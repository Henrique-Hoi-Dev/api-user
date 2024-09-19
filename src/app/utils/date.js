const _ = require('lodash');
const ONE_MIN_IN_MS = 60000;

const createExpirationDateFromNow = (timeInMin = 30) => new Date(Date.now() + ONE_MIN_IN_MS * timeInMin);

const isDateAfterNow = (date = Date.now()) => (_.isDate(date) ? date > new Date() : new Date(date) > new Date());

module.exports = { createExpirationDateFromNow, isDateAfterNow };
