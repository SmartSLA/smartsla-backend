const moment = require('moment-timezone');
const { Cns, CnsValue } = require('./cns.model');
const { getTicketSoftwareEngagement } = require('./helpers/ticket');
const { convertIsoDurationInMinutes } = require('./helpers/duration');
const { HOLIDAYS } = require('./holidays');
const { TICKET_STATUS, USER_TYPE, REQUEST_TYPE } = require('../constants');

module.exports = {
  computeCns,
  computePeriods,
  calculateSuspendedMinutes,
  calculateWorkingMinutes,
  hoursBetween
};

const DEFAULT_TIMEZONE = {
  name: '(GMT+01:00) Central European Time - Paris',
  value: 'Europe/Paris'
};

const HOLIDAYS_MAP = HOLIDAYS.reduce((holidaysMap, day) => {
    holidaysMap[day.date] = day.nom_jour_ferie;

    return holidaysMap;
  }, {});

/**
 * Compute Cns per status
 *
 * cns per status can be 0 if n/a
 *
 * @param ticket
 * @param contract
 * @return {Cns}
 */
function computeCns(ticket, contract) {
  const cns = new Cns();

  if (ticket.software && ticket.software.software && contract) {
    const timezone = getTimeZone(contract);

    moment.tz.setDefault(timezone);

    const workingInterval = contract.businessHours || { start: 9, end: 18 };
    const periods = computePeriods(ticket.events, ticket.timestamps.createdAt);
    const contractEngagements = getTicketSoftwareEngagement(ticket, contract);

    if (contractEngagements) {
      cns.supported = computeTime(periods.new, workingInterval, contractEngagements.supported);

      if (ticket.type === REQUEST_TYPE.ANOMALY) {
        cns.bypassed = computeTime(periods.supported, workingInterval, contractEngagements.bypassed);
        cns.resolved = computeTime(periods.bypassed, workingInterval, contractEngagements.resolved);

        cns.resolved.elapsedMinutes += cns.bypassed.elapsedMinutes;
        cns.resolved.suspendedMinutes += cns.bypassed.suspendedMinutes;
        cns.resolved.percentageElapsed = Math.round(
          (cns.resolved.elapsedMinutes / (
            convertIsoDurationInMinutes(cns.resolved.engagement, cns.resolved.workingHours) +
            convertIsoDurationInMinutes(cns.bypassed.engagement, cns.bypassed.workingHours))) * 100 * 100
        ) / 100;
      } else {
        cns.resolved = computeTime(periods.supported, workingInterval, contractEngagements.resolved);
      }

    }
  }

  return cns;
}

/**
 * Transform events into periods of time per status (new, supported, ...)
 *
 * Period can be undefined if no status change matches.
 *
 * When event notify a beneficiary assignment,
 * a suspension range is created until an expert assignment occurs.
 *
 * Suspension are split between status if it overlaps 2 status.
 *
 * Any non finished period or suspension are bound to currentDate
 *
 * @param events List of ticket events
 * @param ticketStartTime ticket creation time
 * @return periods per status
 */
function computePeriods(events, ticketStartTime) {
  const periods = {};
  const currentDate = moment();
  const orderedEvents = (events && [...events]) || [];

  orderedEvents.sort((a, b) => new Date(a.timestamps.createdAt) - new Date(b.timestamps.createdAt));

  let currentStatus = TICKET_STATUS.NEW;
  let currentSuspension;

  periods[currentStatus] = {
    start: moment(ticketStartTime),
    end: currentDate,
    suspensions: []
  };

  orderedEvents.forEach(event => {
    const eventDate = moment(event.timestamps.createdAt);

    // On status change
    if (event.status) {
      // End previous period
      periods[currentStatus].end = eventDate;

      currentStatus = event.status;

      // Create period
      periods[currentStatus] = {
        start: eventDate,
        end: currentDate,
        suspensions: []
      };

      // If suspension, split between previous and current period
      if (currentSuspension) {
        currentSuspension.end = eventDate;

        currentSuspension = {
          start: eventDate,
          end: currentDate
        };

        periods[currentStatus].suspensions.push(currentSuspension);
      }
    }

    if (event.target) {
      // If beneficiary create suspension if none
      if (event.target.type === USER_TYPE.BENEFICIARY) {
        if (!currentSuspension) {
          currentSuspension = {
            start: eventDate,
            end: currentDate
          };
          periods[currentStatus].suspensions.push(currentSuspension);
        }
      } else if (currentSuspension) {
        // If expert, end suspension if any
        currentSuspension.end = eventDate;
        currentSuspension = undefined;
      }
    }
  });

  return periods;
}

/**
 * Compute spent time per period regarding working hours, holidays and customer suspensions
 *
 * @param period
 * @param workingInterval
 * @param engagement
 * @return {Object} time spent regarding contrat
 */
function computeTime(period, workingInterval, engagement) {
  const noStop = !engagement.businessHours;

  const workingHoursInterval = noStop ? 24 : workingInterval.end - workingInterval.start;
  const engagementDuration = engagement.hours;
  const cnsValue = new CnsValue(engagementDuration, workingHoursInterval, noStop);

  if (!period) {
    return cnsValue;
  }

  const startDate = period.start;
  const endDate = period.end;

  let workingMinutes = 0;
  let suspendedMinutes = 0;

  if (noStop) {
    workingMinutes = hoursBetween(startDate, endDate) * 60;
    suspendedMinutes = calculateSuspendedMinutes(period.suspensions, 0, 24, true);
  } else {
    workingMinutes = calculateWorkingMinutes(startDate, endDate, workingInterval.start, workingInterval.end);
    suspendedMinutes = calculateSuspendedMinutes(period.suspensions, workingInterval.start, workingInterval.end);
  }

  cnsValue.elapsedMinutes = workingMinutes - suspendedMinutes;
  cnsValue.suspendedMinutes = suspendedMinutes;
  cnsValue.percentageElapsed = Math.round(
    (cnsValue.elapsedMinutes / convertIsoDurationInMinutes(engagementDuration, workingHoursInterval)) * 100 * 100
  ) / 100;

  return cnsValue;
}

function hoursBetween(start, end) {
  const startDate = moment(start);
  const endDate = moment(end);
  const duration = moment.duration(endDate.diff(startDate));

  return duration.asHours();
}

/**
 * Calculate working minutes for the period with office hours
 *
 * @param startingDate
 * @param endingDate
 * @param startingHour
 * @param endingHour
 * @return {number}
 */
function calculateWorkingMinutes(startingDate, endingDate, startingHour, endingHour) {
  const { startWrapper, endWrapper } = adjustRangeInWorkingHour(startingDate, endingDate, startingHour, endingHour);

  const durationMs = endWrapper.diff(startWrapper);

  // If start and end dates are in consecutive non working days.
  // adjustRangeInWorkingHour will introduce a negative difference although it should be 0
  if (durationMs < 0) {
    return 0;
  }

  const duration = moment.duration(durationMs);

  const nbNonWorkingDay = getNumberOfWorkingDay(startWrapper, endWrapper);

  duration.subtract(nbNonWorkingDay, 'day');

  // If startWapper time is after endWrapper time, time difference will be computed across days.
  // It'll include whole day hours, so we need to remove non working days hours.
  if (startWrapper.format('HH:mm:ss') > endWrapper.format('HH:mm:ss')) {
    duration.subtract(24 - (endingHour - startingHour), 'hour');
  }

  return convertIsoDurationInMinutes(duration, endingHour - startingHour);

  function getNumberOfWorkingDay(startDay, endDay) {
    let nb = 0;

    while (startDay.isBefore(endDay)) {
      if (isNonWorkingDay(startDay)) {
        nb++;
      }
      startDay.add(1, 'day');
    }

    return nb;
  }

  /**
   * Return closest working hour date times for period start and end date/times
   *
   * If start and end are in working hour/days, they are left unchanged.
   *
   * If start is not in working hour, returned startWrapper is the closest working day/hour before start
   * If end is not in working hour, returned endWrapper is the closest working day/hour after end
   *
   * @param start period start date time
   * @param end period end date time
   * @param startHourBoundary Office working hour start time
   * @param endHourBoundary Office working hour end time
   * @returns {{endWrapper: (*|moment.Moment), startWrapper: (*|moment.Moment)}}
   */
  function adjustRangeInWorkingHour(start, end, startHourBoundary, endHourBoundary) {
    const startWrapperLocal = moment(start);
    const endWrapperLocal = moment(end);

    if (isNonWorkingDay(startWrapperLocal) || startWrapperLocal.hour() >= endHourBoundary) {
      // Iterate until the next working day
      startWrapperLocal.add(1, 'day');
      startWrapperLocal.hour(startHourBoundary).minute(0).second(0);

      while (isNonWorkingDay(startWrapperLocal)) {
        startWrapperLocal.add(1, 'day');
      }
    } else if (startWrapperLocal.hour() < startHourBoundary) {
      startWrapperLocal.hour(startHourBoundary).minute(0).second(0);
    }

    if (isNonWorkingDay(endWrapperLocal) || endWrapperLocal.hour() < startHourBoundary) {
      // Iterate until the previous working day
      endWrapperLocal.add(-1, 'day');
      endWrapperLocal.hour(endHourBoundary).minute(0).second(0);

      while (isNonWorkingDay(endWrapperLocal)) {
        endWrapperLocal.add(-1, 'day');
      }
    } else if (endWrapperLocal.hour() >= endHourBoundary) {
      endWrapperLocal.hour(endHourBoundary).minute(0).second(0);
    }

    return { startWrapper: startWrapperLocal, endWrapper: endWrapperLocal };
  }

  function isNonWorkingDay(currentDate) {
    const dayString = currentDate.format('YYYY-MM-DD');

    return currentDate.day() === 0 || currentDate.day() === 6 || HOLIDAYS_MAP.hasOwnProperty(dayString);
  }
}

/**
 * Sums the time spent during all customers suspensions
 *
 * @param suspensions
 * @param startingHour
 * @param endHour
 * @param nbh 24/7 option
 * @return {number} suspended time in minutes
 */
function calculateSuspendedMinutes(suspensions, startingHour, endHour, nbh = false) {
  let suspendedTime = 0;

  if (nbh) {
    suspensions.forEach(suspension => {
      suspendedTime += hoursBetween(suspension.start, suspension.end) * 60;
    });
  } else {
    suspensions.forEach(suspension => {
      suspendedTime += calculateWorkingMinutes(suspension.start, suspension.end, startingHour, endHour);
    });
  }

  return suspendedTime;
}

/**
 * Return full timezone name for a contract otherwise return default `Europe/Paris`
 *
 * @param contract
 * @return {string} full timezone name
 */
function getTimeZone(contract) {
  return !contract.timezone ? DEFAULT_TIMEZONE.value : contract.timezone;
}
