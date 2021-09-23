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
 * @return {{bypassed: number, supported: number, resolved: number}}
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
  const startWrapper = moment(startingDate);
  const endWrapper = moment(endingDate);

  if (isNonWorkingDay(startWrapper) || startWrapper.hour() >= endingHour) {
    // Iterate until the next working day
    startWrapper.add(1, 'day');
    startWrapper.hour(startingHour).minute(0).second(0);

    while (isNonWorkingDay(startWrapper)) {
      startWrapper.add(1, 'day');
    }
  } else if (startWrapper.hour() < startingHour) {
    startWrapper.hour(startingHour).minute(0).second(0);
  }

  if (isNonWorkingDay(endWrapper) || endWrapper.hour() < startingHour) {
    // Iterate until the previous working day
    endWrapper.add(-1, 'day');
    endWrapper.hour(endingHour).minute(0).second(0);

    while (isNonWorkingDay(endWrapper)) {
      endWrapper.add(-1, 'day');
    }
  } else if (endWrapper.hour() >= endingHour) {
    endWrapper.hour(endingHour).minute(0).second(0);
  }

  const durationMs = endWrapper.diff(startWrapper);

  if (durationMs < 0) {
    return 0;
  }

  const duration = moment.duration(durationMs);

  while (startWrapper.isBefore(endWrapper)) {
    if (isNonWorkingDay(startWrapper)) {
      duration.add(-1, 'day');
    }
    startWrapper.add(1, 'day');
  }

  if (startWrapper.format('HH:mm:ss') > endWrapper.format('HH:mm:ss')) {
    duration.add(- (24 - (endingHour - startingHour)), 'hour');
  }

  return convertIsoDurationInMinutes(duration, endingHour - startingHour);

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
