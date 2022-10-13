/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var utils_UNSAFE_getLocale = require('./utils/UNSAFE_getLocale.js');
require('./utils/UNSAFE_stringUtils.js');
var Message_types = require('./Message.types-2c9b978d.js');
var stringUtils = require('./stringUtils-b22cc214.js');

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Options for creating an Intl.DateTimeFormat instance.
 */
const DATE_FORMAT_OPTIONS = Object.freeze({
    TODAY: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    },
    DEFAULT: {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }
});
/**
 * Regex for validating ISO timestamp
 */
const ISO_DATE_REGEX = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
/**
 * Checks if the provided date is today
 *
 * @param isoDate Date to be tested for today
 *
 * @returns boolean indicating if the provided date is today
 */
function isDateToday(isoDate) {
    const today = new Date();
    const provided = new Date(isoDate);
    return (today.getUTCFullYear() === provided.getUTCFullYear() &&
        today.getUTCMonth() === provided.getUTCMonth() &&
        today.getUTCDate() === provided.getUTCDate());
}
/**
 * Creates an instance of Intl.DateTimeFormat
 *
 * @param isToday A boolean to indicate whether a formatter is needed for the date
 *                that is the current day.
 *
 * @returns the formatter instance
 */
function getDateTimeFormatter(isToday) {
    const locale = utils_UNSAFE_getLocale.getLocale();
    const { DateTimeFormat } = Intl;
    if (isToday) {
        return new DateTimeFormat(locale, DATE_FORMAT_OPTIONS.TODAY);
    }
    return new DateTimeFormat(locale, DATE_FORMAT_OPTIONS.DEFAULT);
}
/**
 * Checks if the provided value is valid for the prop specified.
 * By default, this method just checks for the value to be a valid string.
 *
 * @param value The value to be checked
 * @param prop The property for which the value needs to be evaluated
 *
 * @returns the result of the validation
 */
function isValidValueForProp(value, prop = 'string') {
    switch (prop) {
        case 'severity':
            // Should be one of the allowed severity
            return typeof value === 'string' && Message_types.severities.includes(value);
        case 'timestamp':
            // Should be a valid ISO Datetime string
            return typeof value === 'string' && ISO_DATE_REGEX.test(value);
        case 'string':
        default:
            // anything other than null, undefined and '' is a valid string
            return typeof value === 'string' && !stringUtils.isEmptyOrUndefined(value);
    }
}
/**
 * Formats the timestamp in the required format based on the current
 * locale.
 *
 * @param isoTime Timestamp in ISO format
 */
function formatTimestamp(isoTime) {
    const isToday = isDateToday(isoTime);
    const formatter = getDateTimeFormatter(isToday);
    return formatter.format(new Date(isoTime));
}

exports.formatTimestamp = formatTimestamp;
exports.isValidValueForProp = isValidValueForProp;
/*  */
//# sourceMappingURL=MessageFormattingUtils-6764fed3.js.map
