const moment = require('moment-timezone');

module.exports = { convertIsoDurationInDaysHoursMinutes, convertIsoDurationInMinutes, getHoursValue };

function convertIsoDurationInDaysHoursMinutes(duration) {
  const momentDuration = moment.duration(duration);
  const days = Math.trunc(momentDuration.asDays());
  const hours = momentDuration.hours();
  const minutes = momentDuration.minutes();

  return { days, hours, minutes };
}

function convertIsoDurationInMinutes(duration, workingHours) {
  if (!duration || !workingHours) {
    return 0;
  }
  const { days, hours, minutes } = convertIsoDurationInDaysHoursMinutes(duration);

  return days * workingHours * 60 + hours * 60 + minutes;
}

function getHoursValue(workingHours, days, hours = 0, minutes = 0) {
  return days * workingHours + hours + minutes / 60;
}
