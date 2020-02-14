const moment = require('moment-timezone');
const { Cns, CnsValue } = require('./cns.model');
const { getTicketSoftwareEngagement } = require('./helpers/ticket');
const { convertIsoDurationInMinutes } = require('./helpers/duration');
const { HOLIDAYS } = require('./holidays');
const { TICKET_STATUS, USER_TYPE } = require('../constants');

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
    const engagement = getTicketSoftwareEngagement(ticket, contract);

    if (engagement) {
      cns.supported = computeTime(periods.new, workingInterval, engagement.supported);
      cns.bypassed = computeTime(periods.supported, workingInterval, engagement.bypassed);
      cns.resolved = computeTime(periods.bypassed, workingInterval, engagement.resolved);

      const { elapsedMinutes, suspendedMinutes, engagementDuration, workingHoursInterval } = cns.bypassed;

      cns.resolved.elapsedMinutes += elapsedMinutes;
      cns.resolved.suspendedMinutes += suspendedMinutes;
      cns.resolved.percentageElapsed = Math.round(
        (cns.resolved.elapsedMinutes / (
          convertIsoDurationInMinutes(cns.resolved.engagementDuration, cns.resolved.workingHoursInterval) +
          convertIsoDurationInMinutes(engagementDuration, workingHoursInterval))) * 100 * 100
      ) / 100;
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
  let holidaysMinutes = 0;

  if (noStop) {
    workingMinutes = hoursBetween(startDate, endDate) * 60;
    suspendedMinutes = calculateSuspendedMinutes(period.suspensions, 0, 24, true);
  } else {
    workingMinutes = calculateWorkingMinutes(startDate, endDate, workingInterval.start, workingInterval.end);
    holidaysMinutes = holidaysBetween(startDate, endDate) * (workingInterval.end - workingInterval.start) * 60;
    suspendedMinutes = calculateSuspendedMinutes(period.suspensions, workingInterval.start, workingInterval.end);
  }

  cnsValue.elapsedMinutes = workingMinutes - holidaysMinutes - suspendedMinutes;
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
 * Compute the number of holyday days during the period
 *
 * @param from
 * @param to
 * @return {number} number of holyday days during the period
 */
function holidaysBetween(from, to) {
  const holidaysDates = HOLIDAYS.map(date => moment(date));
  const holidays = holidaysDates.filter(date => {
    if (date.valueOf() <= to.valueOf() && date.valueOf() >= from.valueOf()) {
      return !(date.weekday() === 6 || date.weekday() === 0);
    } else {
      return false;
    }
  });

  return holidays.length;
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
  let minutes = 0;

  while (startWrapper.valueOf() < endWrapper.valueOf()) {
    if (startWrapper.day() !== 0 && startWrapper.day() !== 6) {
      if (startWrapper.hour() >= startingHour && startWrapper.hour() < endingHour) {
        ++minutes;
      }
    }
    startWrapper.add(1, 'minutes');
  }

  return minutes;
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
