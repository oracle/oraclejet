/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { OraI18nUtils } from 'ojs/ojconverterutils-i18n';
import Converter from 'ojs/ojconverter';
import { __getBundle } from 'ojs/ojlocaledata';
import { NativeParserImpl, DateTimePreferencesUtils, NativeDateTimePatternConverter, NativeDateTimeConverter } from 'ojs/ojconverter-nativedatetime';
import { getLocale } from 'ojs/ojconfig';
import oj$1 from 'ojs/ojcore-base';
import { AvailableTimeZones } from 'ojs/ojavailabletimezones';

/**
 * DateTimeConverter Contract.
 * @ignore
 */

/**
 * @class
 * @name oj.DateTimeConverter
 * @constructor
 * @hideconstructor
 * @abstract
 * @augments oj.Converter
 * @param {Object=} options an object literal used to provide an optional information to
 * @ojsignature {target: "Type",
 *                value: "abstract class DateTimeConverter implements Converter<string>"}
 *
 * @ojtsimport {module: "ojconverter", type: "AMD", importName: "Converter"}
 * @export
 * @since 0.6.0
 * @see oj.IntlDateTimeConverter JET's implementation of the DateTimeConverter
 */
const DateTimeConverter = function (options) {
  this.Init(options);
};

// Subclass from oj.Object
oj.Object.createSubclass(DateTimeConverter, Converter, 'oj.DateTimeConverter');

/**
 * Initializes the date time converter instance with the set options.
 *
 * @param {Object=} options an object literal used to provide an optional information to
 * initialize the converter.<p>
 * @export
 * @ignore
 */
DateTimeConverter.prototype.Init = function (options) {
  DateTimeConverter.superclass.Init.call(this, options);
};

/**
 * Formats the local isoString value using the options provided and returns a string value. Note that if previous application
 * code was passing a JavaScript Date object which is no longer supported, one can use the utility function oj.IntlConverterUtils.dateToLocalIso
 * to get the proper isoString value.
 *
 * @example <caption>For example <code class="prettyprint">converter.format(oj.IntlConverterUtils.dateToLocalIso(new Date()))</code></caption>
 * @see oj.IntlConverterUtils.dateToLocalIso
 * @param {string} value to be formatted for display which should be a local isoString
 * @return {(string|null)} the localized and formatted value suitable for display
 * @throws {Error} a ConverterError if formatting fails.
 * @export
 * @memberof oj.DateTimeConverter
 * @instance
 * @method format
 */
DateTimeConverter.prototype.format = function (value) {
  return DateTimeConverter.superclass.format.call(this, value);
};

/**
 * Returns true if a 24-hour format is set; false otherwise.
 * @export
 * @abstract
 * @ojsignature {target: "Type",
 *                value: "():boolean"}
 * @memberof oj.DateTimeConverter
 * @instance
 * @method isHourInDaySet
 * @ojdeprecated {since: '11.0.0', description: 'Use !!(resolvedOptions()["hour"] && !resolvedOptions()["hour12"])'}
 */
DateTimeConverter.prototype.isHourInDaySet = function () {
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if 12-hour is set; false otherwise.
 * @export
 * @ojsignature {target: "Type",
 *                value: "():boolean"}
 * @abstract
 * @memberof oj.DateTimeConverter
 * @instance
 * @method isHourInAMPMSet
 * @ojdeprecated {since: '11.0.0', description: 'Use !!(resolvedOptions()["hour"] && resolvedOptions()["hour12"])'}
 */
DateTimeConverter.prototype.isHourInAMPMSet = function () {
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if minutes are shown in the time portion; false otherwise.
 * @export
 * @abstract
 * @ojsignature {target: "Type",
 *                value: "():boolean"}
 * @memberof oj.DateTimeConverter
 * @instance
 * @method isMinuteSet
 * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions()["minute"] !== undefined'}
 */
DateTimeConverter.prototype.isMinuteSet = function () {
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if seconds are shown in the time portion; false otherwise.
 * @export
 * @ojsignature {target: "Type",
 *                value: "():boolean"}
 * @abstract
 * @memberof oj.DateTimeConverter
 * @instance
 * @method isSecondSet
 * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions()["second"] !== undefined'}
 */
DateTimeConverter.prototype.isSecondSet = function () {
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if milliseconds are shown in the time portion; false otherwise.
 * @export
 * @ojsignature {target: "Type",
 *                value: "():boolean"}
 * @abstract
 * @memberof oj.DateTimeConverter
 * @instance
 * @method isMilliSecondSet
 * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions()["millisecond"] !== undefined'}
 */
DateTimeConverter.prototype.isMilliSecondSet = function () {
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if year is shown in the date portion; false otherwise.
 * @export
 * @ojsignature {target: "Type",
 *                value: "():boolean"}
 * @abstract
 * @memberof oj.DateTimeConverter
 * @instance
 * @method isYearSet
 * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions()["year"] !== undefined'}
 */
DateTimeConverter.prototype.isYearSet = function () {
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if month is shown in the date portion; false otherwise.ƒ
 * @export
 * @ojsignature {target: "Type",
 *                value: "():boolean"}
 * @abstract
 * @memberof oj.DateTimeConverter
 * @instance
 * @method isMonthSet
 * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions()["month"] !== undefined'}
 */
DateTimeConverter.prototype.isMonthSet = function () {
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if day is shown in the date portion; false otherwise.
 * @export
 * @ojsignature {target: "Type",
 *                value: "():boolean"}
 * @abstract
 * @memberof oj.DateTimeConverter
 * @instance
 * @method isDaySet
 * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions()["day"] !== undefined'}
 */
DateTimeConverter.prototype.isDaySet = function () {
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if the day name is shown in the date portion; false otherwise.
 * @export
 * @ojsignature {target: "Type",
 *                value: "():boolean"}
 * @abstract
 * @memberof oj.DateTimeConverter
 * @instance
 * @method isDayNameSet
 * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions()["weekday"] !== undefined'}
 */
DateTimeConverter.prototype.isDayNameSet = function () {
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns the calculated week for the isoString value.
 * @param {string} value to return the calculated week of
 * @return {number|undefined} calculated week.
 * @export
 * @abstract
 * @method calculateWeek
 * @instance
 * @memberof oj.DateTimeConverter
 * @instance
 * @method calculateWeek
 * @ojdeprecated [{since: "11.0.0", description: "This is used internally by the oj-date-picker component,
 *  and should not be called by application code."}]
 */
// eslint-disable-next-line no-unused-vars
DateTimeConverter.prototype.calculateWeek = function (value) {
  oj.Assert.failedInAbstractFunction();
};

/**
 * Parses the value using the options provided and returns a local isoString value. For convenience if one wishes to
 * retrieve a JavaScript Date object from the local isoString an utility function oj.IntlConverterUtils.isoToLocalDate is
 * provided.
 *
 * @example <caption>For example <code class="prettyprint">oj.IntlConverterUtils.isoToLocalDate(converter.parse(isoString))</code></caption>
 * @see oj.IntlConverterUtils.isoToLocalDate
 * @param {string} value to parse
 * @return {string|null} the parsed value as a local isoString value
 * @throws {Error} a ConverterError if parsing fails
 * @export
 * @memberof oj.DateTimeConverter
 * @instance
 * @method parse
 */
DateTimeConverter.prototype.parse = function (value) {
  return DateTimeConverter.superclass.parse.call(this, value);
};

/**
 * Compares 2 ISO 8601 strings, returning the time difference between the two
 *
 * @param {string} isoStr first iso string
 * @param {string} isoStr2 second iso string
 * @return {number} the time difference between isoStr and isoStr2
 * @export
 * @memberof oj.DateTimeConverter
 * @instance
 * @method compareISODates
 * @ojdeprecated {since: '11.0.0', description: 'The two values should be in the same format: local, offset, or zulu.
 * Create Date objects and compare the Dates.'}
 */
DateTimeConverter.prototype.compareISODates = function (isoStr, isoStr2) {
  return DateTimeConverter.superclass.compareISODates.call(this, isoStr, isoStr2);
};

/**
 * Gets the supported timezones for the converter.<br/>
 *
 * @return {Array} supported timezones
 * @since 4.0.0
 * @export
 * @memberof oj.DateTimeConverter
 * @instance
 * @method getAvailableTimeZones
 * @ojdeprecated {since: '11.0.0', description: 'Use <a href="TimeZoneUtils.html#getAvailableTimeZones">TimeZoneUtils.getAvailableTimeZones</a> instead.'}
 */
DateTimeConverter.prototype.getAvailableTimeZones = function () {
  return DateTimeConverter.superclass.getAvailableTimeZones.call(this);
};

const RelativeDateTimeFormatter = (function () {
  var instance;
  var _THRESHOLDS = {
    s: 46, // seconds to minute
    m: 46, // minutes to hour
    h: 23, // hours to day
    d: 7, // days to week
    w: 4, // weeks to month
    M: 12 // months to year
  };
  var _LOCAL = 'local';
  var _ZULU = 'zulu';
  var _OFFSET = 'offset';

  function _daysToMonths(days) {
    // 400 years have 146097 days (taking into account leap year rules)
    return (days * 4800) / 146097;
  }

  // d1 and d2 same year
  function _isSameYear(d1, d2) {
    return d1.getFullYear() === d2.getFullYear();
  }

  // d2 is next year
  function _isNextYear(d1, d2) {
    return d2.getFullYear() - d1.getFullYear() === 1;
  }

  // d2 is previous year
  function _isPrevYear(d1, d2) {
    return _isNextYear(d2, d1);
  }

  // d2 and d1 same month
  function _isSameMonth(d1, d2) {
    return _isSameYear(d1, d2) && d1.getMonth() === d2.getMonth();
  }

  // d2 is next month
  function _isNextMonth(d1, d2) {
    if (_isSameYear(d1, d2)) {
      return d2.getMonth() - d1.getMonth() === 1;
    } else if (_isNextYear(d1, d2)) {
      return d1.getMonth() === 11 && d2.getMonth() === 0;
    }
    return false;
  }

  // d2 is previous month
  function _isPrevMonth(d1, d2) {
    return _isNextMonth(d2, d1);
  }

  // difference in days between d2 and d1. Only valid if d2 is same or
  // next month of d1
  function _getDaysDif(d1, d2) {
    var day1 = d1.getDate();
    var day2 = d2.getDate();
    if (_isNextMonth(d1, d2)) {
      day2 += OraI18nUtils._getDaysInMonth(d1.getFullYear, d1.getMonth());
    }
    return day2 - day1;
  }

  function _getDayIndex(localeElements, idx) {
    var locale = localeElements._ojLocale_;
    var territory = OraI18nUtils.getBCP47Region(locale);
    var firstDayNode = localeElements.supplemental.weekData.firstDay;
    var firstDayOfweek = firstDayNode[territory];
    if (firstDayOfweek === undefined) {
      firstDayOfweek = firstDayNode['001'];
    }
    var ret = idx - firstDayOfweek;
    if (ret < 0) {
      ret += 7;
    }
    return ret;
  }

  // d1 and d2 same week
  function _isSameWeek(localeElements, d1, d2) {
    if (d1 > d2) {
      // swap dates to make sure we work with positive numbers
      var tmp = d1;
      // eslint-disable-next-line no-param-reassign
      d1 = d2;
      // eslint-disable-next-line no-param-reassign
      d2 = tmp;
    }
    if (!_isSameMonth(d1, d2) && !_isNextMonth(d1, d2)) {
      return false;
    }
    var dif = _getDaysDif(d1, d2) + _getDayIndex(localeElements, d1.getDay());
    return dif >= 0 && dif <= 6;
  }

  // d2 is next week
  function _isNextWeek(localeElements, d1, d2) {
    if (!_isSameMonth(d1, d2) && !_isNextMonth(d1, d2)) {
      return false;
    }
    var dif = _getDaysDif(d1, d2) + _getDayIndex(localeElements, d1.getDay());
    return dif >= 7 && dif <= 13;
  }

  // d2 is previous week
  function _isPrevWeek(localeElements, d1, d2) {
    return _isNextWeek(localeElements, d2, d1);
  }

  // d1 and d2 same day
  function _isSameDay(d1, d2) {
    return _isSameYear(d1, d2) && _isSameMonth(d1, d2) && d1.getDate() === d2.getDate();
  }

  // d2 is next day
  function _isNextDay(d1, d2) {
    if (!_isSameMonth(d1, d2) && !_isNextMonth(d1, d2)) {
      return false;
    }
    return _getDaysDif(d1, d2) === 1;
  }

  // d2 is previous day
  function _isPrevDay(d1, d2) {
    return _isNextDay(d2, d1);
  }

  function _getUnits(milliseconds) {
    var days = milliseconds / 864e5;
    var months = _daysToMonths(days);
    var years = months / 12;
    var obj = {
      year: Math.round(years),
      month: Math.round(months),
      week: Math.round(milliseconds / 6048e5),
      day: Math.round(milliseconds / 864e5),
      hour: Math.round(milliseconds / 36e5),
      minute: Math.round(milliseconds / 6e4),
      second: Math.round(milliseconds / 1000),
      millisecond: milliseconds
    };
    return obj;
  }

  function _getTimeDiff(d1, d2, isCalendar) {
    var datetime1 = OraI18nUtils._IsoStrParts(d1);
    var datetime2 = OraI18nUtils._IsoStrParts(d2);

    if (isCalendar) {
      // for calendar, normalize the times to midnight so that the diff is the same
      // regardless of time of day.
      datetime1 = Date.UTC(datetime1[0], datetime1[1] - 1, datetime1[2], 0, 0, 0, 0);
      datetime2 = Date.UTC(datetime2[0], datetime2[1] - 1, datetime2[2], 0, 0, 0, 0);
    } else {
      datetime1 = Date.UTC(
        datetime1[0],
        datetime1[1] - 1,
        datetime1[2],
        datetime1[3],
        datetime1[4],
        datetime1[5],
        datetime1[6]
      );
      datetime2 = Date.UTC(
        datetime2[0],
        datetime2[1] - 1,
        datetime2[2],
        datetime2[3],
        datetime2[4],
        datetime2[5],
        datetime2[6]
      );
    }
    return datetime1 - datetime2;
  }

  function _getAtString() {
    var intlCnv = new Intl.DateTimeFormat(getLocale(), { dateStyle: 'long', timeStyle: 'short' });
    var parts = intlCnv.formatToParts(new Date());
    var index = parts.findIndex((obj) => obj.type === 'hour') - 1;
    if (!parts[index]) {
      return ' ';
    }
    var at = parts[index].value;
    return at;
  }

  function _formatDateTime(relativeDate, options) {
    var intlCnv = new Intl.DateTimeFormat(getLocale(), options);
    var fmt = intlCnv.format(relativeDate);
    return fmt;
  }

  function _convertFromTimeZone(d, options, localeElements) {
    // first, convert to zulu
    var tzOptions = { isoStrFormat: 'zulu', timeZone: options.timeZone };
    var zuluDate = NativeParserImpl.parseImpl(d, null, tzOptions, localeElements);
    // use date object to convert zulu iso string to local date
    var locaDate = new Date(zuluDate.value);
    var localIso = OraI18nUtils.dateToLocalIso(locaDate);
    return localIso;
  }

  function _convertToLocalDate(d, options, localeElements) {
    var srcTimeZone = options.timeZone;
    var isoInfo = OraI18nUtils.getISOStrFormatInfo(d);
    var isoInfoFormat = isoInfo.format;
    // if ISO string is zulu or offset , use Date object to convert it to local date
    if (isoInfoFormat === _OFFSET || isoInfoFormat === _ZULU) {
      var localDate = new Date(d);
      var localIso = OraI18nUtils.dateToLocalIso(localDate);
      return localIso;
    }
    // if ISO string is local and no time zone in options return it as is
    var isLocal = isoInfoFormat === _LOCAL && !srcTimeZone;
    if (isLocal) {
      return d;
    }
    // do time zone conversion to local ISO
    return _convertFromTimeZone(d, options, localeElements);
  }

  function _formatRelativeImplicit(now, relativeDate, field, style) {
    var diff = _getTimeDiff(relativeDate, now, false);
    var absdiff = Math.abs(diff);
    var units = _getUnits(absdiff);
    if (field === null) {
      // eslint-disable-next-line no-param-reassign
      field =
        (units.second < _THRESHOLDS.s && 'second') ||
        (units.minute < _THRESHOLDS.m && 'minute') ||
        (units.hour < _THRESHOLDS.h && 'hour') ||
        (units.day < _THRESHOLDS.d && 'day') ||
        (units.week < _THRESHOLDS.w && 'week') ||
        (units.month < _THRESHOLDS.M && 'month') ||
        'year';
    }
    var intlRelativeCnv = new Intl.RelativeTimeFormat(getLocale(), { numeric: style });
    var val = diff >= 0 ? units[field] : -units[field];
    var format = intlRelativeCnv.format(val, field);
    return format;
  }

  function _formatRelativeCalendar(now, relativeDate, dateOnly) {
    var datePart;
    var timePart;
    var timePartOptions = { hour: 'numeric', minute: 'numeric' };
    var elseOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    var weekDayOptions = { weekday: 'long' };
    var fields = [];
    var value = OraI18nUtils.isoToLocalDate(relativeDate);
    var localNow = OraI18nUtils.isoToLocalDate(now);
    var locale = getLocale();
    var intlRelativeCnv;

    if (_isSameDay(localNow, value)) {
      fields = [0, 'day', 'auto'];
      intlRelativeCnv = new Intl.RelativeTimeFormat(locale, { numeric: fields[2] });
      datePart = intlRelativeCnv.format(fields[0], fields[1]);
    } else if (_isNextDay(localNow, value)) {
      fields = [1, 'day', 'auto'];
      intlRelativeCnv = new Intl.RelativeTimeFormat(locale, { numeric: fields[2] });
      datePart = intlRelativeCnv.format(fields[0], fields[1]);
    } else if (_isPrevDay(localNow, value)) {
      fields = [-1, 'day', 'auto'];
      intlRelativeCnv = new Intl.RelativeTimeFormat(locale, { numeric: fields[2] });
      datePart = intlRelativeCnv.format(fields[0], fields[1]);
    } else {
      var diff = _getTimeDiff(relativeDate, now, true);
      diff /= 864e5; // number of days
      if (diff > 1 && diff < 7) {
        // next week
        datePart = _formatDateTime(value, weekDayOptions);
      } else {
        // everything else
        return _formatDateTime(value, elseOptions);
      }
    }
    if (dateOnly) {
      return datePart;
    }
    timePart = _formatDateTime(value, timePartOptions);
    var at = _getAtString();
    var retVal = datePart + at + timePart;
    return retVal;
  }

  function _formatRelativeDisplayName(isoNow, isoValue, options, localeElements) {
    var getOption = OraI18nUtils.getGetOption(
      options,
      'OraDateTimeConverter.formatRelative'
    );
    var option = getOption('dateField', 'string', [
      'day',
      'week',
      'month',
      'year',
      'hour',
      'minute',
      'second'
    ]);
    var now = OraI18nUtils.isoToLocalDate(isoNow);
    var value = OraI18nUtils.isoToLocalDate(isoValue);
    var diff = _getTimeDiff(isoValue, isoNow, false);
    var absdiff = Math.abs(diff);
    var units = _getUnits(absdiff);
    var fields = [];
    var val;
    switch (option) {
      case 'day':
        if (_isSameDay(now, value)) {
          fields = [0, 'day', 'auto'];
        } else if (_isNextDay(now, value)) {
          fields = [1, 'day', 'auto'];
        } else if (_isPrevDay(now, value)) {
          fields = [-1, 'day', 'auto'];
        } else {
          val = diff > 0 ? units.day : -units.day;
          fields = [val, 'day', 'always'];
        }
        break;
      case 'week':
        if (_isSameWeek(localeElements, now, value)) {
          fields = [0, 'week', 'auto'];
        } else if (_isNextWeek(localeElements, now, value)) {
          fields = [1, 'week', 'auto'];
        } else if (_isPrevWeek(localeElements, now, value)) {
          fields = [-1, 'week', 'auto'];
        } else {
          val = diff > 0 ? units.week : -units.week;
          fields = [val, 'week', 'always'];
        }
        break;
      case 'month':
        if (_isSameMonth(now, value)) {
          fields = [0, 'month', 'auto'];
        } else if (_isNextMonth(now, value)) {
          fields = [1, 'month', 'auto'];
        } else if (_isPrevMonth(now, value)) {
          fields = [-1, 'month', 'auto'];
        } else {
          val = diff > 0 ? units.month : -units.month;
          fields = [val, 'month', 'always'];
        }
        break;
      case 'year':
        if (_isSameYear(now, value)) {
          fields = [0, 'year', 'auto'];
        } else if (_isNextYear(now, value)) {
          fields = [1, 'year', 'auto'];
        } else if (_isPrevYear(now, value)) {
          fields = [-1, 'year', 'auto'];
        } else {
          val = diff > 0 ? units.year : -units.year;
          fields = [val, 'year', 'always'];
        }
        break;
      case 'hour':
        val = diff > 0 ? units.hour : -units.hour;
        fields = [val, 'hour', 'auto'];
        break;
      case 'minute':
        val = diff > 0 ? units.minute : -units.minute;
        fields = [val, 'minute', 'auto'];
        break;
      case 'second':
        val = diff > 0 ? units.second : -units.second;
        fields = [val, 'second', 'auto'];
        break;
      default:
        break;
    }
    var intlRelativeCnv = new Intl.RelativeTimeFormat(getLocale(), { numeric: fields[2] });
    var format = intlRelativeCnv.format(fields[0], fields[1]);
    return format;
  }

  function _formatRelativeImpl(value, localeElements, options) {
    var now = OraI18nUtils.dateToLocalIso(new Date());
    if (typeof value === 'number') {
      // eslint-disable-next-line no-param-reassign
      value = OraI18nUtils.dateToLocalIso(new Date(value));
    } else if (typeof value === 'string') {
      if (OraI18nUtils.trim(value) === '') {
        return null;
      }
    } else {
      return null;
    }
    if (options === undefined) {
      // eslint-disable-next-line no-param-reassign
      options = { formatUsing: 'displayName' };
    }
    var getOption = OraI18nUtils.getGetOption(
      options,
      'OraDateTimeConverter.formatRelative'
    );
    var relativeTime = getOption('relativeTime', 'string', ['fromNow', 'toNow'], 'fromNow');
    var fieldOption = getOption('dateField', 'string', [
      'day',
      'week',
      'month',
      'year',
      'hour',
      'minute',
      'second'
    ]);

    // eslint-disable-next-line no-param-reassign
    value = _convertToLocalDate(value, options, localeElements);
    var toNow = relativeTime === 'toNow';
    if (toNow) {
      var tmp = now;
      now = value;
      // eslint-disable-next-line no-param-reassign
      value = tmp;
    }
    var formatUsing = getOption(
      'formatUsing',
      'string',
      ['displayName', 'calendar'],
      'displayName'
    );
    if (formatUsing === 'calendar') {
      var dateOnly = getOption('dateOnly', 'boolean', [true, false], false);
      return _formatRelativeCalendar(now, value, dateOnly);
    }
    if (fieldOption !== undefined) {
      return _formatRelativeDisplayName(now, value, options, localeElements);
    }
    return _formatRelativeImplicit(now, value, null, 'auto');
  }

  function _init() {
    return {
      formatRelative: function (value, options) {
        var localeElements = __getBundle();
        return _formatRelativeImpl(value, localeElements, options);
      }
    };
  }
  return {
    /**
     * getInstance.
     * Returns the singleton instance of RelativeDateTimeFormatter class.
     * @memberof RelativeDateTimeFormatter
     * @return {Object} The singleton RelativeDateTimeFormatter instance.
     */
    getInstance: function () {
      if (!instance) {
        instance = _init();
      }
      return instance;
    }
  };
})();

/**
 * @export
 * Placeholder here as closure compiler objects to export annotation outside of top level
 */

/**
 * @constructor
 * @final
 *
 * @classdesc Constructs an immutable instance and initializes it with the options provided.
 * <p>
 *  The converter instance uses locale symbols for the locale set on the page (returned by
 *  {@link oj.Config.getLocale}.
 *  </p>
 * There are several ways to initialize the converter.
 * <ul>
 * <li>Using the standard date, datetime and time format lengths defined by Unicode CLDR, these
 * would include the properties formatType, dateFormat, timeFormat.</li>
 * <li>Using options defined by the ECMA 402 Specification, these would be the properties year,
 * month, day, hour, minute, second, weekday, era, timeZoneName, hour12</li>
 * <li>Using a custom date and/or time format pattern using the pattern property.
 * This way is deprecated and not recommended; Applications should not use pattern
 * because it is not locale sensitive.</li>
 * </ul>
 *
 * <p>
 * The options when specified take precedence in the following order:<br>
 * 1. pattern (deprecated). If pattern is set, the ECMA options and formatType/dateFormat/timeFormat are ignored.<br>
 * 2. ECMA options. If pattern is not set, and ECMA options are set, ECMA options are used, and formatType/dateFormat/timeFormat are ignored.<br>
 * 3. formatType/dateFormat/timeFormat (recommended).
 * </p>
 * <p>If no options are provided, they default to day:"numeric", month:"numeric", year:"numeric".
 * </p>
 * The converter provides great leniency when parsing a user input value to a date in the following
 * ways: <br/>
 * <ul>
 * <li>Allows use of any character for separators irrespective of the separator specified in the
 * associated pattern. E.g., if pattern is set to 'y-M-d', the following values are all valid -
 * 2013-11-16, 2013/11-16 and 2013aaa11xxx16.</li>
 * <li>Allows specifying 4 digit year in any position in relation to day and month. E.g., 11-2013-16
 * or 16-11-2013</li>
 * <li>Supports auto-correction of value, when month and day positions are swapped as long as the
 * day is > 12 when working with the Gregorian calendar. E.g., if the pattern is 'y-M-d',
 * 2013-16-11 will be auto-corrected to 2013-11-16. However if both day and month are less or equal
 * to 12, no assumptions are made about the day or month and the value parsed against the exact pattern.</li>
 * <li>Supports auto-correction of value, for the short and long types of weekday and month names.
 * So they can are used anywhere in the value. E.g., if the expected pattern is E, MMM, d, y, all
 * these values are acceptable - Tue, Nov 26 2013 or Nov, Tue 2013 26 or 2013 Tue 26 Nov. <br/>
 * NOTE: Lenient parsing of narrow era, weekday or month name is not supported because of ambiguity in
 * choosing the right value. So we expect for narrow era, weekday or month option that values be
 * provided either in their short or long forms. E.g., Sat, March 02, 2013.
 * </li>
 * <li>Specifying the weekday is optional. E.g., if the expected pattern is E, MMM, d, y; then
 * entering Nov 26, 2013, is automatically turned to Tuesday Nov 26, 2013. But entering an invalid
 * weekday, i.e., if the weekday does not match the date, an exception is thrown.</li>
 * <li>Leniency rules apply equally no matter which option is used - pattern, ECMA options or formatType</li>
 * </ul>
 *
 * <p>
 * Lenient parse can be disabled by setting the property lenientParse to "none". In which case the user input must
 * be an exact match of the expected pattern and all the leniency described above will be disabled.
 *
 * @param {Object=} options - an object literal used to provide an optional information to
 * initialize the converter.<p>
 *
 * @example <caption>Create a date time converter using new IntlDateTimeConverter with no options.
 * This uses the default value for year, month, day properties</caption>
 * converter = new IntlDateTimeConverter();
 * var resolved = converter.resolvedOpions();
 * // logs "day=numeric, month=numeric, year=numeric"
 * console.log("day=" + resolved.day + ", month=" + resolved.month + ", year=" + resolved.year);
 * <br/>
 *
 * @example <caption>Create a date time converter using the ECMA options to represent date</caption>
 * var options = { year:'2-digit', month: '2-digit', day: '2-digit'};
 * converter = new IntlDateTimeConverter(options);<br/>
 *
 * @example <caption>Create a date time converter using the 'pattern' option</caption>
 * var options = {pattern: 'MM-dd-yyyy'};
 * converter = new IntlDateTimeConverter(options);<br/>
 *
 * @example <caption>Create a date time converter using the standard format length</caption>
 * var options = {formatType: 'date', dateFormat: 'medium'};
 * converter = new IntlDateTimeConverter(options);<br/>
 *
 * @example <caption>Create a date time converter using specific pattern with IANA timezone ID with
 * isoStrFormat of offset.</caption>
 * var options = {pattern: 'MM/dd/yy hh:mm:ss a Z', timeZone: 'America/Los_Angeles', isoStrFormat: 'offset'};
 * converter = new IntlDateTimeConverter(options);<br/>
 *
 * @example <caption>Create a date time converter using specific pattern with Etc/GMT timezone ID with
 * isoStrFormat of zulu.</caption>
 * var options = {pattern: 'MM/dd/yy hh:mm:ss a Z', timeZone: 'Etc/GMT-08:00', isoStrFormat: 'zulu'};
 * converter = new IntlDateTimeConverter(options);<br/>
 *
 * @example <caption>Disable lenient parse.</caption>
 * var options = {pattern: 'MM/dd/yy', lenientParse:'none'};
 * converter = new IntlDateTimeConverter(options);<br/>
 * var str = "14/05/16";
 * var obj = converter.parse(str); --> RangeError: 13 is out of range.  Enter a value between 1 and 12 for month.<br/>
 *
 * @export
 * @augments oj.DateTimeConverter
 * @name oj.IntlDateTimeConverter
 * @ojsignature [{target: "Type",
 *                value: "class IntlDateTimeConverter extends DateTimeConverter"},
 *               {target: "Type",
 *                value: "oj.IntlDateTimeConverter.ConverterOptions",
 *                for: "options", jsdocOverride: true}
 *              ]
 * @since 0.6.0
 */
const IntlDateTimeConverter = function (options) {
  // map options so that we also have option names that work with our
  // modern NativeDateTimeConverter options which we delegate to.
  // e.g., dateFormat is mapped to dateStyle (but we keep dateFormat too for bw compatibility)
  let mappedOptions = options ? IntlDateTimeConverter.mapOptions(options) : null;

  // Next we merge in User Preferences pattern and timezone, if any.
  // Options passed into the converter's constructor takes precedence.
  const mo = DateTimePreferencesUtils.getPreferencesMergedWithConverterOptions(mappedOptions);

  const defaultOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const optionsAreEmpty = Object.keys(mo).length === 0;
  const newOptions = optionsAreEmpty ? defaultOptions : mo;
  this.Init(newOptions);
};

/**
 * @typedef {object} oj.IntlDateTimeConverter.ConverterOptions
 * @property {('2-digit'|'numeric')=} year - allowed values are "2-digit", "numeric". When no options are
 * set the default value of "numeric" is used.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>2-digit</td>
 *       <td>2 digit representation of the year, padded: 00-99.</td>
 *       <td>2001 => 01, 2016 => 16</td>
 *     </tr>
 *     <tr>
 *       <td>numeric</td>
 *       <td>variable digit representation of the year depending on the value.</td>
 *       <td>2010, 199</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {number=} two-digit-year-start - the 100-year period 2-digit year.
 * During parsing, two digit years will be placed in the range two-digit-year-start to two-digit-year-start + 100 years.
 * The default is 1950.
 * <p style='padding-left: 5px;'>
 * Example: if two-digit-year-start is 1950, 10 is parsed as 2010<br/><br/>
 * Example: if two-digit-year-start is 1900, 10 is parsed as 1910
 * </p>
 *
 * @property {('2-digit'|'numeric'|'narrow'|'short'|'long')=} month - specifies how the month is formatted. Allowed values are
 * "2-digit", "numeric", "narrow", "short", "long". The last 3 values behave in the same way as for
 * weekday, indicating the length of the string used. When no options are set the default value of
 * "numeric" is used.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>2-digit</td>
 *       <td>2 digit representation of the month, padded: 01-12.</td>
 *       <td>1 => 01, 12 => 12</td>
 *     </tr>
 *     <tr>
 *       <td>numeric</td>
 *       <td>variable digit representation of the month depending on the value.</td>
 *       <td>1, 11</td>
 *     </tr>
 *     <tr>
 *       <td>narrow</td>
 *       <td>narrow name of the month.</td>
 *       <td>J</td>
 *     </tr>
 *     <tr>
 *       <td>short</td>
 *       <td>abbreviated name of the month.</td>
 *       <td>Jan</td>
 *     </tr>
 *     <tr>
 *       <td>long</td>
 *       <td>wide name of the month.</td>
 *       <td>January</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {('2-digit'|'numeric')=} day - specifies how the day is formatted. Allowed values are "2-digit",
 *  "numeric". When no options are set the default value of "numeric" is used.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>2-digit</td>
 *       <td>2 digit representation of the day in month, padded: 01-31.</td>
 *       <td>1 => 01, 27 => 27</td>
 *     </tr>
 *     <tr>
 *       <td>numeric</td>
 *       <td>variable digit representation of the day in month depending on the value.</td>
 *       <td>1, 31</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {('2-digit'|'numeric')=} hour - specifies how the hour is formatted. Allowed values are
 * "2-digit" or "numeric". The hour is displayed using the 12 or 24 hour clock, depending on the
 * locale. See 'hour12' for details.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>2-digit</td>
 *       <td>2 digit representation of the hour, padded: 01-24 depending on the locale.</td>
 *       <td>1 => 01, 24 => 24</td>
 *     </tr>
 *     <tr>
 *       <td>numeric</td>
 *       <td>variable digit representation of the day in month depending on the value.</td>
 *       <td>1, 24</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {('2-digit'|'numeric')=} minute - specifies how the minute is formatted. Allowed values are
 * "2-digit", "numeric". Although allowed values for minute are numeric and 2-digit, minute is always
 * displayed as 2 digits: 00-59.
 *
 * @property {('2-digit'|'numeric')=} second - specifies whether the second should be displayed as "2-digit"
 * or "numeric". Although allowed values for second are numeric and 2-digit, second is always displayed
 * as 2 digits: 00-59.
 *
 * @property {('numeric')=} millisecond - specifies how the minute is formatted. Allowed
 * value is "numeric". millisecond is always displayed as 3-digits except the case where only millisecond
 * is present (hour and minute not specified) in which case we display it as no-padded number, example: .5
 *
 * @property {('narrow'|'short'|'long')=} weekday - specifies how the day of the week is formatted. If absent, it
 * is not included in the date formatting. Allowed values are "narrow", "short", "long" indicating the
 * length of the string used.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>narrow</td>
 *       <td>narrow name of the day of week.</td>
 *       <td>M</td>
 *     </tr>
 *     <tr>
 *       <td>short</td>
 *       <td>abbreviated name of the day of week.</td>
 *       <td>Mon</td>
 *     </tr>
 *     <tr>
 *       <td>long</td>
 *       <td>wide name of the day of week.</td>
 *       <td>Monday</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {('narrow'|'short'|'long')=} era - specifies how the era is included in the formatted date. If
 * absent, it is not included in the date formatting. Allowed values are "narrow", "short", "long".
 * Although allowed values are narrow, short, long, we only display era in abbreviated format: BC, AD.
 *
 * @property {('short'|'long')=} timeZoneName - allowed values are "short", "long".
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>short</td>
 *       <td>short name of the time zone.</td>
 *       <td>short: short name of the time zone: PDT, PST, EST, EDT. Note: Not all locales have
 *           translations for short time zone names, in this case we display the English short name</td>
 *     </tr>
 *     <tr>
 *       <td>long</td>
 *       <td>short name of the time zone.</td>
 *       <td>Pacific Standard Time, Pacific Daylight Time.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} timeZone - The possible values of the timeZone property are valid IANA
 * timezone IDs. If the users want to pass an offset, they can use one of the Etc/GMT timezone IDs.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>IANA ID</td>
 *       <td>America/Los_Angeles, Europe/Paris</td>
 *     </tr>
 *     <tr>
 *       <td>Offset</td>
 *       <td>Etc/GMT-8. The offset is positive if the local time zone is behind UTC and negative if it is ahead.
 *           The offset range is between Etc/GMT-14 and Etc/GMT+12 (UTC-12 and UTC+14). Which means that Etc/GMT-8
 *           is equivalent to UTC+08.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {('offset'|'zulu'|'local'|'auto')=} isoStrFormat - specifies the time zone offset
 * of the ISO string that is returned from the parse method. isoStrFormat only applies to the
 * parse method. The possible values of isoStrFormat are: "offset", "zulu", "local".
 * The default is offset. local applies to time-only and date-only ISO strings. If the returned ISO
 * string is date-time, local is ignored and the date-time ISO string is returned with offset.
 * This is necessary for the result to be a valid RFC-3339 date-time so that it may be transferred over REST.
 * Note: auto is deprecated and ignored since the default is now offset.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>offset</td>
 *       <td>time zone offset from UTC.</td>
 *       <td>2016-01-05T11:30:00-08:00<br>T11:30:00-06:00</td>
 *     </tr>
 *     <tr>
 *       <td>zulu</td>
 *       <td>zulu time or UTC time.</td>
 *       <td>2016-01-05T19:30:00Z</td>
 *     </tr>
 *     <tr>
 *       <td>local</td>
 *       <td>local date or time, does not contain time zone offset.</td>
 *       <td>T19:30:00<br>2016-01-05</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {boolean=} hour12 - specifies what time notation is used for formatting the time.
 * A true value uses the 12-hour clock and false uses the 24-hour clock (often called military time
 * in the US). This property is undefined if the hour property is not used when formatting the date.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>true</td>
 *       <td>T13:10  is formatted as "1:10 PM"</td>
 *     </tr>
 *     <tr>
 *       <td>false</td>
 *       <td>T13:10 is formatted as "13:10"</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {('h11'|'h12'|'h23'|'h24')=} hourCycle - The hour cycle to use. Possible values are "h11", "h12", "h23", or "h24".
 * hour12 option takes precedence in case both options have been specified.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>h11</td>
 *       <td>T00:00:00 is formatted as "00:00:00 AM"</td>
 *     </tr>
 *     <tr>
 *       <td>h12</td>
 *       <td>T00:00:00 is formatted as "12:00:00 AM"</td>
 *     </tr>
 *     <tr>
 *       <td>h23</td>
 *       <td>T00:00:00 is formatted as "00:00:00"</td>
 *     </tr>
 *     <tr>
 *       <td>h24</td>
 *       <td>T00:00:00 is formatted as "24:00:00"</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} pattern - a localized string pattern, where the the characters used in
 * pattern conform to Unicode CLDR for date time formats. This will override all other options
 * when present. <br/>
 * NOTE: 'pattern' is provided for backwards compatibility with existing apps that may want the
 * convenience of specifying an explicit format mask. Setting a 'pattern' will override the default
 * locale specific format.
 * NOTE: The supported tokens for timezone are of 'Z', 'VV', and 'X'.<br/><br/>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Letter</th>
 *       <th>Date or Time Component</th>
 *       <th>Examples</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>G, GG, GGG</td>
 *       <td>Era designator</td>
 *       <td>AD</td>
 *     </tr>
 *     <tr>
 *       <td>y</td>
 *       <td>numeric representation of year</td>
 *       <td>1, 2014</td>
 *     </tr>
 *     <tr>
 *       <td>yy</td>
 *       <td>2-digit representation of year</td>
 *       <td>01, 14</td>
 *     </tr>
 *     <tr>
 *       <td>yyyy</td>
 *       <td>4-digit representation of year</td>
 *       <td>0001, 2014</td>
 *     </tr>
 *     <tr>
 *       <td>M</td>
 *       <td>Numeric representation of month in year: (1-12)</td>
 *       <td>1, 12</td>
 *     </tr>
 *     <tr>
 *       <td>MM</td>
 *       <td>2-digit representation of month in year: (01-12)</td>
 *       <td>01, 12</td>
 *     </tr>
 *     <tr>
 *       <td>MMM</td>
 *       <td>Formatted  name of the month, abbreviated</td>
 *       <td>Jan</td>
 *     </tr>
 *     <tr>
 *       <td>MMMM</td>
 *       <td>Formatted  name of the month, wide</td>
 *       <td>January</td>
 *     </tr>
 *     <tr>
 *       <td>MMMMM</td>
 *       <td>Formatted  name of the month, narrow</td>
 *       <td>J</td>
 *     </tr>
 *     <tr>
 *       <td>LLL</td>
 *       <td>Stand-alone name of the month, abbreviated</td>
 *       <td>Jan</td>
 *     </tr>
 *     <tr>
 *       <td>LLLL</td>
 *       <td>Stand-alone name of the month, wide</td>
 *       <td>January</td>
 *     </tr>
 *     <tr>
 *       <td>LLLLL</td>
 *       <td>Stand-alone name of the month, narrow</td>
 *       <td>J</td>
 *     </tr>
 *     <tr>
 *       <td>d</td>
 *       <td>Numeric representation of  day in month (1-31)</td>
 *       <td>1, 21</td>
 *     </tr>
 *     <tr>
 *       <td>dd</td>
 *       <td>2-digit representation of  day in month (01-31)</td>
 *       <td>01, 21</td>
 *     </tr>
 *     <tr>
 *       <td>E, EE, EEE</td>
 *       <td>Formatted name of day in week, abbreviated</td>
 *       <td>Tue</td>
 *     </tr>
 *     <tr>
 *       <td>EEEE</td>
 *       <td>Formatted name of day in week, wide</td>
 *       <td>Tuesday</td>
 *     </tr>
 *     <tr>
 *       <td>EEEEE</td>
 *       <td>Formatted name of day in week, narrow</td>
 *       <td>T</td>
 *     </tr>
 *     <tr>
 *       <td>c, cc, ccc</td>
 *       <td>Stand-alone name of day in week, abbreviated</td>
 *       <td>Tue</td>
 *     </tr>
 *     <tr>
 *       <td>cccc</td>
 *       <td>Stand-alone name of day in week, wide</td>
 *       <td>Tuesday</td>
 *     </tr>
 *     <tr>
 *       <td>ccccc</td>
 *       <td>Stand-alone name of day in week, narrow</td>
 *       <td>T</td>
 *     </tr>
 *     <tr>
 *       <td>a</td>
 *       <td>am/pm marker</td>
 *       <td>PM</td>
 *     </tr>
 *     <tr>
 *       <td>H</td>
 *       <td>Numeric hour in day (0-23)</td>
 *       <td>1, 23</td>
 *     </tr>
 *     <tr>
 *       <td>HH</td>
 *       <td>2-digit hour in day (00-23)</td>
 *       <td>01, 23</td>
 *     </tr>
 *     <tr>
 *       <td>h</td>
 *       <td>Numeric  hour in am/pm (1-12)</td>
 *       <td>1, 12</td>
 *     </tr>
 *     <tr>
 *       <td>hh</td>
 *       <td>2-digit hour in day (01-12)</td>
 *       <td>01, 12</td>
 *     </tr>
 *     <tr>
 *       <td>k</td>
 *       <td>Numeric  hour in day (1-24)</td>
 *       <td>1, 24</td>
 *     </tr>
 *     <tr>
 *       <td>kk</td>
 *       <td>2-digit hour in day (1-24)</td>
 *       <td>01, 24</td>
 *     </tr>
 *     <tr>
 *       <td>K</td>
 *       <td>Numeric  hour in am/pm (0-11)</td>
 *       <td>1, 11</td>
 *     </tr>
 *     <tr>
 *       <td>KK</td>
 *       <td>2-digit hour in am/pm (0-11)</td>
 *       <td>01, 11</td>
 *     </tr>
 *     <tr>
 *       <td>m, mm</td>
 *       <td>2-digit  minute in hour (00-59)</td>
 *       <td>05, 59</td>
 *     </tr>
 *     <tr>
 *       <td>s, ss</td>
 *       <td>2-digit second in minute (00-59)</td>
 *       <td>01, 59</td>
 *     </tr>
 *     <tr>
 *       <td>S</td>
 *       <td>Numeric  Millisecond (0-999)</td>
 *       <td>1, 999</td>
 *     </tr>
 *     <tr>
 *       <td>SS</td>
 *       <td>2-digit Millisecond (00-999)</td>
 *       <td>01, 999</td>
 *     </tr>
 *     <tr>
 *       <td>SSS</td>
 *       <td>3-digit Millisecond (000-999)</td>
 *       <td>001, 999</td>
 *     </tr>
 *     <tr>
 *       <td>z, zz, zzz</td>
 *       <td>Abbreviated time zone name</td>
 *       <td>PDT, PST</td>
 *     </tr>
 *     <tr>
 *       <td>zzzz</td>
 *       <td>Full time zone name</td>
 *       <td>Pacific Standard Time, Pacific Daylight Time</td>
 *     </tr>
 *     <tr>
 *       <td>Z, ZZ, ZZZ</td>
 *       <td>Sign hours minutes</td>
 *       <td>-0800</td>
 *     </tr>
 *     <tr>
 *       <td>X</td>
 *       <td>Sign hours</td>
 *       <td>-08</td>
 *     </tr>
 *     <tr>
 *       <td>XX</td>
 *       <td>Sign hours minutes</td>
 *       <td>-0800</td>
 *     </tr>
 *     <tr>
 *       <td>XXX</td>
 *       <td>Sign hours:minutes</td>
 *       <td>-08:00</td>
 *     </tr>
 *     <tr>
 *       <td>VV</td>
 *       <td>Time zone ID</td>
 *       <td>Americs/Los_Angeles</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojdeprecated {target: 'property', for: 'pattern', since: '11.0.0',
 * description: 'Applications should not use pattern because it is not locale sensitive.
 * Use other options instead like formatType, dateFormat and timeFormat,
 * and if needed, set the locale to be the preferred locale.'}
 *
 * @property {('date'|'time'|'datetime')=} formatType - determines the 'standard' date and/or time format lengths
 * to use. Allowed values: "date", "time", "datetime". See 'dateFormat' and 'timeFormat' options.
 * When set a value must be specified.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>datetime</td>
 *       <td>date and time portions are displayed.</td>
 *       <td>"September 20, 2015 12:04 PM", "September 20, 2015 12:05:35 PM Pacific Daylight Time"</td>
 *     </tr>
 *     <tr>
 *       <td>date</td>
 *       <td>date portion only is displayed.</td>
 *       <td>"September 20, 2015"</td>
 *     </tr>
 *     <tr>
 *       <td>time</td>
 *       <td>time portion only is displayed.</td>
 *       <td>“12:05:35�?</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {('short'|'medium'|'long'|'full')=} dateFormat - specifies the standard date format length to use when
 * formatType is set to "date" or "datetime". Allowed values are : "short" (default), "medium", "long",
 * "full".
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>short</td>
 *       <td>9/20/15</td>
 *     </tr>
 *     <tr>
 *       <td>medium</td>
 *       <td>Sep 20, 2015</td>
 *     </tr>
 *     <tr>
 *       <td>long</td>
 *       <td>September 20, 2015</td>
 *     </tr>
 *     <tr>
 *       <td>full</td>
 *       <td>Sunday, September 20, 2015</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {('short'|'medium'|'long'|'full')=} timeFormat - specifies the standard time format length to use when
 * 'formatType' is set to "time" or "datetime". Allowed values: "short" (default), "medium", "long",
 * "full".
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>short</td>
 *       <td>12:11 PM</td>
 *     </tr>
 *     <tr>
 *       <td>medium</td>
 *       <td>12:11:23 PM</td>
 *     </tr>
 *     <tr>
 *       <td>long</td>
 *       <td>12:12:19 PM PDT</td>
 *     </tr>
 *     <tr>
 *       <td>full</td>
 *       <td>12:12:37 PM Pacific Daylight Time</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 *  @property {('full'|'none')=} lenientParse - The lenientParse property can be used to enable or disable leninet parsing.
 *  Allowed values: "full" (default), "none".
 * <p style='padding-left: 5px;'>
 * By default the lenient parse is enabled and the leniency rules descibed above will be used. When lenientParse is
 * set to "none" the lenient parse is disabled and the user input must match the expected input otherwise an exception will
 * be thrown.</p>
 */
// Subclass from oj.Object
oj$1.Object.createSubclass(IntlDateTimeConverter, DateTimeConverter, 'oj.IntlDateTimeConverter');
IntlDateTimeConverter._DEFAULT_DATE = new Date(1998, 10, 29, 15, 45, 31);

/**
 * Initializes the date time converter instance with the set options.
 * @param {Object=} options an object literal used to provide an optional information to initialize
 * the converter.<p>
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @ignore
 */
IntlDateTimeConverter.prototype.Init = function (options) {
  IntlDateTimeConverter.superclass.Init.call(this, options);
  this._initConverter();
};

// Returns the wrapped date time converter implementation object.
// FA is overriding our ojs/ojconverter-datetime bundle and needs to define this function
// or else they will get an error.
// Do not rename. TODO: Ideally we will remove the need for them to have to define this function.
// As of v12.0.0, we are using the DateTimePreferences as the way for FA to merge in user
// preferences instead of overriding our ojs/ojconverter-datetime.
IntlDateTimeConverter.prototype._getWrapped = function () {
  return this._wrapped;
};

IntlDateTimeConverter.prototype._initConverter = function () {
  var thisOptions = this.getOptions();
  // Always set numbering system to lain because IntlDateTimeConverter did not
  // support other numbering systems. Also the only supported calendar was gregory
  thisOptions.numberingSystem = 'latn';
  thisOptions.calendar = 'gregory';
  if (thisOptions.pattern) {
    this._wrapped = new NativeDateTimePatternConverter(thisOptions);
  } else {
    this._wrapped = new NativeDateTimeConverter(thisOptions);
  }
};
/**
 * Formats the isoString value using the options provided and returns a string value.
 * <p>
 * The isoStr value could be zulu, offset, or local.
 * And if the value is zulu or offset, then the timezone the converter uses
 * will be the system's timezone if no timeZone option is specified.
 * </p>
 *
 * @param {string} value to be formatted for display which should be an isoString
 * @return {string|null} the formatted value suitable for display
 *
 * @throws {Error} a ConverterError both when formatting fails, and if the options provided during
 * initialization cannot be resolved correctly.
 *
 * @example <caption>To convert Javascript Date to a local iso string before passing to <code class="prettyprint">format</code></caption>
 * var date = new Date();
 * var formatted = converter.format(oj.IntlConverterUtils.dateToLocalIso(date));
 *
 * @example <caption>Standard format invocation
 * var formatted = converter.format("2013-12-01T20:00:00-08:00");
 *
 * @see oj.IntlConverterUtils.dateToLocalIso
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @instance
 * @method format
 */
IntlDateTimeConverter.prototype.format = function (value) {
  // undefined, null and empty string values all return null. If value is NaN then return "".
  // TODO: Should we automatically parse() the integer value representing the number of milliseconds
  // since 1 January 1970 00:00:00 UTC (Unix Epoch)?
  if (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && oj$1.StringUtils.trim('' + value).length === 0)
  ) {
    return '';
  }
  // for backward compatibiliity
  // format should only take an iso string, but in previous versions it allowed
  // new Date() or Date.now().
  let valToFormat = value;
  if (typeof value === 'number') {
    valToFormat = OraI18nUtils.dateToLocalIso(new Date(value));
  } else if (typeof value === 'string') {
    valToFormat = OraI18nUtils.trim(value);
  } else {
    return null;
  }
  return this._getWrapped().format(valToFormat);
};

/**
 * Formats an ISOString as a relative date time, using the relativeOptions.
 * <p>
 *
 * @param {string} value - value to be formatted. This value is compared with the current date
 * on the client to arrive at the relative formatted value.
 * @param {Object=} relativeOptions - an Object literal containing the following properties. The
 * default options are ignored during relative formatting -
 * @param {string=} relativeOptions.formatUsing - Specifies the relative formatting convention to.
 * Allowed values are "displayName" and "calendar". Setting value to 'displayName' uses the relative
 * display name for the instance of the dateField, and one or two past and future instances.
 * When omitted we use the implicit rules.
 * @param {string=} relativeOptions.dateField - To be used in conjunction of 'displayName'  value
 * of formatUsing attribute.  Allowed values are: "day", "week", "month", "year", "hour", "minute", "second".
 * @param {string=} relativeOptions.relativeTime - Allowed values are: "fromNow", "toNow".
 * "fromNow" means the system's current date is the reference and "toNow" means the value attribute
 * is the reference. Default "fromNow".
 * @param {boolean=} relativeOptions.dateOnly - A boolean value that can be used in conjunction with
 * "calendar" of formatUsing attribute.  When set to true date only format is used. Example: "Sunday"
 * instead of "Sunday at 2:30 PM". Default value is false.
 * @param {string=} relativeOptions.timeZone - The timeZone attribute can be used to specify the
 * time zone of the  value parameter.  The system’s time zone is used for the current time. If timeZone
 * attribute is not specified, we use the system’s time zone  for both. The value parameter, which is an
 * iso string, can be Z or contain and offset, in this case  the timeZone attribute is overwritten.
 *
 * @return {string|null} relative date. null if the value falls out side the supported relative range.
 * @throws {Object} an instance of {@link ConverterError}
 *
 * @example <caption>Relative time in the future using implicit rules</caption>
 * var dateInFuture = new Date();
 * dateInFuture.setMinutes(dateInFuture.getMinutes() + 41);
 * var formatted = converter.formatRelative(oj.IntlConverterUtils.dateToLocalIso(dateInFuture)); -> in 41 minutes
 *
 * @example <caption>Relative time in the past using implicit rules</caption>
 * var dateInPase = new Date();
 * dateInPase.setHours( dateInPast.getHours() - 20);
 * var formatted = converter.formatRelative(oj.IntlConverterUtils.dateToLocalIso(dateInPase)); -> 20 hours ago
 *
 * @example <caption>Relative time using dateField. Assuming system’s current date is 2016-07-28.</caption>
 * Format relative year:
 * var options = {formatUsing: "displayName", dateField: "year"};
 * var formatted = converter.formatRelative("2015-06-01T00:00:00", options); -> last year
 *
 * @example <caption>Relative time using relativeTime. Assuming system’s current date is 2016-07-28.</caption>
 * var options = {formatUsing: "displayName", dateField: "day", relativeTime: "fromNow"};
 * var formatted = converter.formatRelative("2016-07-28T00:00:00", options); -> tomorrow
 * options = {formatUsing: "displayName", dateField: "day", relativeTime: toNow};
 * formatted = converter.formatRelative("2016-07-28T00:00:00", options); -> yesterday
 *
 * @example <caption>Relative time using calendar. Assuming system’s current date is 2016-07-28.</caption>
 * var options = {formatUsing: "calendar"};
 * var formatted = converter.formatRelative("2016-07-28T14:15:00", options); -> tomorrow at 2:30 PM
 *
 *
 * @example <caption>Relative time using timeZone. Assuming that the system’s time zone is America/Los_Angeles.</caption>
 * var options = {timeZone:"America/New_York"};
 * var nyDateInFuture = new Date();
 * nyDateInFuture.setHours(nyDateInFuture.getHours() + 6);
 * var formatted = converter.formatRelative(oj.IntlConverterUtils.dateToLocalIso(nyDateInFuture), options); -> in 3 hours
 *
 * @see oj.IntlConverterUtils.dateToLocalIso
 *
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @instance
 * @method formatRelative
 * @ojdeprecated {since: '11.0.0', description: 'Use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat">Intl.RelativeTimeFormat</a>'}
 */
IntlDateTimeConverter.prototype.formatRelative = function (value, relativeOptions) {
  var cnv = RelativeDateTimeFormatter.getInstance();
  return cnv.formatRelative(value, relativeOptions);
};

/**
 * It returns null for the placeholder hint. There is no default placeholder hint when using IntlDateTimeConverter.
 *
 * @return {null} hint for the converter.
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @instance
 * @method getHint
 */
IntlDateTimeConverter.prototype.getHint = function () {
  // do not return any hint.
  return null;
};

/**
 * Returns the options called with converter initialization.
 * @return {Object} an object of options.
 * @ojsignature {target: "Type", for: "returns",
 *                value: "oj.IntlDateTimeConverter.ConverterOptions"}
 * @export
 * @memberof oj.IntlDateTimeConverter
 * @instance
 * @method getOptions
 * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions.'}
 */
IntlDateTimeConverter.prototype.getOptions = function () {
  return IntlDateTimeConverter.superclass.getOptions.call(this);
};

/**
 * Returns an object literal with locale and formatting options computed during initialization of
 * the object. If options was not provided at the time of initialization, the properties will be
 * derived from the locale defaults.
 * @return {Object} an object of resolved options. Properties whose corresponding internal
 * properties are not present are not assigned.
 * @ojsignature {target: "Type", for: "returns",
 *                value: "oj.IntlDateTimeConverter.ConverterOptions"}
 * @throws a ConverterError when the options that the converter was initialized with are invalid.
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @instance
 * @method resolvedOptions
 */
IntlDateTimeConverter.prototype.resolvedOptions = function () {
  if (!this._resolvedOptions) {
    const wrappedResOptions = this._getWrapped().resolvedOptions();
    // Take the resolvedOptions we get from NativeDateTimeConverter and make it compatible with
    // IntlDateTimeConverter options. For example,
    // NativeDateTimeConverter uses timeStyle/dateStyle and IntlDateTimeConverter uses timeFormat/dateFormat
    this._resolvedOptions = {};
    const keys = Object.keys(wrappedResOptions);
    let i = 0;
    for (i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key === 'timeStyle') {
        this._resolvedOptions.timeFormat = wrappedResOptions[key];
      } else if (key === 'dateStyle') {
        this._resolvedOptions.dateFormat = wrappedResOptions[key];
      } else if (key === 'fractionalSecondDigits') {
        this._resolvedOptions.millisecond = 'numeric';
      } else if (key === 'twoDigitYearStart') {
        this._resolvedOptions['two-digit-year-start'] = wrappedResOptions[key];
      } else {
        this._resolvedOptions[key] = wrappedResOptions[key];
      }
    }
    // Intl.DateTimeFormat doesn't have formatType api, so set that here.
    if (this._resolvedOptions.dateFormat && this._resolvedOptions.timeFormat) {
      this._resolvedOptions.formatType = 'datetime';
    } else if (this._resolvedOptions.dateFormat) {
      this._resolvedOptions.formatType = 'date';
    } else if (this._resolvedOptions.timeFormat) {
      this._resolvedOptions.formatType = 'time';
    }

    // Safari expands dateStyle/timeStyle into ecma options but not vice versa,
    // so if dateStyle/timeStyle are set in resolvedOptions, remove the ecma options,
    // so that we maintain bw compatibility.
    // e.g., timeStyle: "full" expands to have timeStyle: 'full' plus hour,minute,dayPeriod etc.
    const optionsExcluded = [
      'hour',
      'minute',
      'second',
      'millisecond',
      'day',
      'month',
      'year',
      'weekday',
      'timeZoneName',
      'dayPeriod'
    ];
    if (this._resolvedOptions.dateFormat || this._resolvedOptions.timeFormat) {
      const localResolvedOptionsKeys = Object.keys(this._resolvedOptions);
      // loop through all the ecma options and make sure those are not in the resolvedOptions
      optionsExcluded.forEach((option) => {
        if (localResolvedOptionsKeys.includes(option)) {
          delete this._resolvedOptions[option];
        }
      });
    }
  }
  return this._resolvedOptions;
};

/**
 * Returns true if a 24-hour format is set; false otherwise.
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @return {boolean}
 * @instance
 * @method isHourInDaySet
 * @ojdeprecated {since: '11.0.0', description: 'Use !!(resolvedOptions()["hour"] && !resolvedOptions()["hour12"])'}
 */
IntlDateTimeConverter.prototype.isHourInDaySet = function () {
  var ro = this.resolvedOptions();
  var hour = ro.hour;
  var hour12 = ro.hour12;

  if (hour && !hour12) {
    // if hour12=false or not set and hour is set to some value
    return true;
  }

  return false;
};

/**
 * Returns true if 12-hour is set; false otherwise.
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @return {boolean}
 * @instance
 * @method isHourInAMPMSet
 * @ojdeprecated {since: '11.0.0', description: 'Use !!(resolvedOptions()["hour"] && resolvedOptions()["hour12"])'}
 */
IntlDateTimeConverter.prototype.isHourInAMPMSet = function () {
  var ro = this.resolvedOptions();
  var hour = ro.hour;
  var hour12 = ro.hour12;

  if (hour && hour12) {
    // if hour12==true and hour is set to some value
    return true;
  }

  return false;
};

/**
 * Returns true if minutes are shown in the time portion; false otherwise.
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @return {boolean}
 * @instance
 * @method isMinuteSet
 * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions()["minute"] !== undefined'}
 */
IntlDateTimeConverter.prototype.isMinuteSet = function () {
  return this._isOptionSet('minute');
};

/**
 * Returns true if seconds are shown in the time portion; false otherwise.
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @return {boolean}
 * @instance
 * @method isSecondSet
 * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions()["second"] !== undefined'}
 */
IntlDateTimeConverter.prototype.isSecondSet = function () {
  return this._isOptionSet('second');
};

/**
 * Returns true if milliseconds are shown in the time portion; false otherwise.
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @return {boolean}
 * @instance
 * @method isMilliSecondSet
 * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions()["millisecond"] !== undefined'}
 */
IntlDateTimeConverter.prototype.isMilliSecondSet = function () {
  return this._isOptionSet('millisecond');
};

/**
 * Returns true if year is shown in the date portion; false otherwise.
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @return {boolean}
 * @instance
 * @method isYearSet
 * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions()["year"] !== undefined'}
 */
IntlDateTimeConverter.prototype.isYearSet = function () {
  return this._isOptionSet('year');
};

/**
 * Returns true if month is shown in the date portion; false otherwise.
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @return {boolean}
 * @instance
 * @method isMonthSet
 * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions()["month"] !== undefined'}
 */
IntlDateTimeConverter.prototype.isMonthSet = function () {
  return this._isOptionSet('month');
};

/**
 * Returns true if day is shown in the date portion; false otherwise.
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @return {boolean}
 * @instance
 * @method isDaySet
 * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions()["day"] !== undefined'}
 */
IntlDateTimeConverter.prototype.isDaySet = function () {
  return this._isOptionSet('day');
};

/**
 * Returns true if the day name is shown in the date portion; false otherwise.
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @return {boolean}
 * @instance
 * @method isDayNameSet
 * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions()["weekday"] !== undefined'}
 */
IntlDateTimeConverter.prototype.isDayNameSet = function () {
  return this._isOptionSet('weekday');
};

/**
 * Returns the calculated week for the isoString value
 *
 * @param {string} value to return the calculated week of
 * @return {number} calculated week.
 *
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @instance
 * @method calculateWeek
 * @ojdeprecated [{since: "11.0.0", description: "This is used internally by the oj-date-picker component,
 *  and should not be called by application code."}]
 */
IntlDateTimeConverter.prototype.calculateWeek = function (value) {
  var d = OraI18nUtils._IsoStrParts(value);
  var time;
  var checkDate = new Date(Date.UTC(d[0], d[1] - 1, d[2]));
  // Find Thursday of this week starting on Monday
  checkDate.setUTCDate(checkDate.getUTCDate() + 4 - (checkDate.getUTCDay() || 7));
  time = checkDate.getTime();
  checkDate.setUTCMonth(0); // Compare with Jan 1
  checkDate.setUTCDate(1);
  return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
};

/**
 * Parses the value using the options provided and returns the date and time as a string
 * expressed using the ISO-8601 format (http://en.wikipedia.org/wiki/ISO_8601).
 *
 * <p>
 * For converter options specific to a date, the iso date representation alone is returned. <br/>
 * For time only options, the iso time representation alone is returned. <br/>
 * For options that include both date and time, the iso date and time representation is
 * returned.<br/>
 * </p>
 *
 * <p>
 * For convenience, if one wishes to retrieve a JavaScript Date object from the local isoString, a
 * utility function oj.IntlConverterUtils.isoToLocalDate is provided.
 *
 * Or oj.IntlConverterUtils.isoToDate if one wish to utilize the timezone of the isoString.
 * </p>
 *
 * @param {string} value to parse
 * @return {string|null} the parsed value as an ISOString.
 *
 * @throws {Error} a ConverterError both when parsing fails, and if the options provided during
 * initialization cannot be resolved correctly. Parsing can also fail when the value includes a time
 *  zone.
 *
 * @example <caption>Parse date, time and date & time values using <code class="prettyprint">parse</code> method.</caption>
 * &lt;!-- For date-time values  -->
 * var options = {pattern: 'MM/dd/yy hh:mm:ss a'};
 * var conv = new IntlDateTimeConverter(options);
 * cnv.parse('09/11/14 03:02:01 PM'); // '2014-09-11T15:02:01'
 *
 * &lt;!-- For date values -->
 * var options = {pattern: 'MM/dd/yy'};
 * cnv.parse('09/11/14'); // '2014-09-11'
 *
 * &lt;!-- For time values -->
 * var options = {pattern: 'hh:mm:ss a'};
 * cnv.parse('03:02:01 PM'); // 'T15:02:01'
 *
 * @example <caption>Convert from iso string to Javascript Date object</caption>
 * var isoString = '2014-10-20T15:02:01';
 * var date = oj.IntlConverterUtils.isoToLocalDate(converter.parse(isoString));
 *
 * @see oj.IntlConverterUtils.isoToLocalDate
 * @see oj.IntlConverterUtils.isoToDate
 *
 * @export
 * @memberof oj.IntlDateTimeConverter
 * @instance
 * @method parse
 */
IntlDateTimeConverter.prototype.parse = function (value) {
  // undefined, null and empty string values are ignored and not parsed.
  if (value === null || value === '' || value === undefined) {
    return null;
  }
  var isoStrFormat = this._wrapped.resOptions.isoStrFormat;
  var timeZone = this._wrapped.resOptions.timeZone;
  var timePart = '';
  // try if str is an iso 8601 string
  var testIsoStr = OraI18nUtils._ISO_DATE_REGEXP.test(value);
  // If the input is zulu ISO string and there is no timeZone in the options return it as is.
  if (testIsoStr) {
    timePart = value.substring(value.indexOf('T'));
    var isZuluStr = timePart.indexOf('Z') !== -1;
    if (isZuluStr && !timeZone) {
      return value;
    }
  }
  var isoStr = this._getWrapped().parse(value);
  timePart = isoStr.substring(isoStr.indexOf('T'));
  var isLocalValue =
    timePart.indexOf('Z') === -1 && timePart.indexOf('+') === -1 && timePart.indexOf('-') === -1;
  // If the options have no timeZone but have isoStrFormat, parse will not do time zone
  // conversion. We need to do the time zone conversion after the parseImpl except when the
  // returned value from parseImpl is not local.
  if (!timeZone && isoStrFormat && isLocalValue) {
    isoStr = OraI18nUtils.convertISOString(isoStr, isoStrFormat);
  }
  return isoStr;
};

/**
 * Compares 2 ISO 8601 strings, returning the time difference between the two
 *
 * @param {string} isoStr first iso string
 * @param {string} isoStr2 second iso string
 * @return {number} the time difference between isoStr and isoStr2
 * @export
 * @memberof oj.IntlDateTimeConverter
 * @instance
 * @method compareISODates
 */
IntlDateTimeConverter.prototype.compareISODates = function (isoStr1, isoStr2) {
  // If I get TIME ONLY I need to add a date to it so that I can use the javascript Date constructor.
  // You can't pass TIME ONLY to new Date. I chose today, local time, because that is what
  // the converter's compareISODates method did (we are deprecating it), andd the less
  // behavior change, the better.
  const today = new Date();
  const month = today.getMonth() + 1;
  let monthStr = OraI18nUtils.zeroPad(month.toString(), 2, true);
  const day = today.getDate();
  let dayStr = OraI18nUtils.zeroPad(day.toString(), 2, true);
  const todayIsoDate = today.getFullYear() + '-' + monthStr + '-' + dayStr;
  let isoString1 = isoStr1;
  let isoString2 = isoStr2;
  const str1StartsWithT = isoString1.indexOf('T') === 0;
  const str2StartsWithT = isoString2.indexOf('T') === 0;
  const str1HasNoT = isoString1.indexOf('T') === -1;
  const str2HasNoT = isoString2.indexOf('T') === -1;
  const zeroTime = 'T00:00:00';
  if (str1StartsWithT) {
    isoString1 = todayIsoDate + isoString1;
  } else if (str1HasNoT) {
    // Append time when there is none.
    // You cannot have zulu or offset without time.
    // You would never have 2021-04-02Z, for example, so you don't have to worry about
    // getting something like 2021-04-02ZT00:00:00.
    isoString1 += zeroTime;
  }
  if (str2StartsWithT) {
    isoString2 = todayIsoDate + isoString2;
  } else if (str2HasNoT) {
    isoString2 += zeroTime;
  }
  // new Date takes an iso string, but not date only. It takes offset iso strings as well.
  const dateMin = new Date(isoString1);
  const dateValue = new Date(isoString2);
  return dateMin.getTime() - dateValue.getTime();
};

/**
 * Checks to see if an option is present in the resolved options.
 *
 * FA is overriding our ojs/ojconverter-datetime bundle and needs to define this function
 * or else they will get an error.
 * Do not rename. TODO: Ideally we will remove the need for them to have to define this function.
 * @param {string} optionName
 * @returns {boolean} true if optionName is present.
 * @private
 */
IntlDateTimeConverter.prototype._isOptionSet = function (optionName) {
  var ro = this.resolvedOptions();
  var hasOption = !!ro[optionName];

  return hasOption;
};

/**
 * Gets the supported timezones for the converter. The returned value is an array of objects. Each object represents a timezone
 * and contains 2 properties: <br/>
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Property</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>id</td>
 *       <td>IANA timezone ID</td>
 *     </tr>
 *     <tr>
 *       <td>displayName</td>
 *       <td><ul>It is the concatenation of 3 string:
 *              <li>UTC timezone offset</li>
 *              <li>City name</li>
 *              <li>Generic time zone name</li>
 *           </ul>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 * @example <caption>Example of an array entry in en-US locale</caption>
 * {id: 'America/Edmonton', displayName: '(UTC-07:00) Edmonton - Mountain Time'} <br/>
 *
 * @example <caption>Example of above entry in fr-FR locale</caption>
 * {id: 'America/Edmonton', displayName: '(UTC-07:00) Edmonton - heure des Rocheuses' } <br/>
 *
 * @return {Array} supported timezones
 * @since 4.0.0
 * @export
 * @memberof oj.IntlDateTimeConverter
 * @instance
 * @method getAvailableTimeZones
 * @ojdeprecated {since: '11.0.0', description: 'Use <a href="TimeZoneUtils.html#getAvailableTimeZones">TimeZoneUtils.getAvailableTimeZones</a> instead.'}
 */
IntlDateTimeConverter.prototype.getAvailableTimeZones = function () {
  return AvailableTimeZones.getAvailableTimeZonesImpl();
};

/**
 * check if one of ECMA options is set
 * @returns {boolean}
 * @private
 * @static
 */
IntlDateTimeConverter.isECMAOptionSet = function (options) {
  var flag =
    options.year ||
    options.month ||
    options.day ||
    options.weekday ||
    options.hour ||
    options.minute ||
    options.second ||
    options.millisecond ||
    options.dayPeriod ||
    options.timeZoneName;
  return flag;
};

/**
 * maps IntlDateTimeConverter options to Intl.DateFormatOptions.
 * These new options are the ones passed to NativeDateTimeConverter,
 * and then on to Intl.DateTimeFormat.
 * ECMA options take precedence over formatType, if they are present
 * igonre formatType
 * @returns {Object}
 * @private
 * @static
 */
IntlDateTimeConverter.mapOptions = function (options) {
  let newOptions = {};
  const keys = Object.keys(options);
  let i = 0;
  var ecmaoptionSet = IntlDateTimeConverter.isECMAOptionSet(options);
  // For bw compatibility, if formatType is not set, and either dateFormat or timeFormat are,
  // we set formatType to 'date' and dateFormat to 'short', so do
  // the same behavior here.
  if (!keys.includes('formatType') && (options.dateFormat || options.timeFormat)) {
    if (!ecmaoptionSet) {
      newOptions.dateStyle = options.dateFormat || 'short';
    }
  }

  for (i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key === 'formatType' && !ecmaoptionSet) {
      if (options[key] === 'datetime' || options[key] === 'date') {
        newOptions.dateStyle = options.dateFormat || 'short';
      }
      if (options[key] === 'datetime' || options[key] === 'time') {
        newOptions.timeStyle = options.timeFormat || 'short';
      }
    } else if (key === 'millisecond') {
      newOptions.fractionalSecondDigits = 3;
    } else if (key === 'two-digit-year-start') {
      newOptions.twoDigitYearStart = options[key];
    } else {
      newOptions[key] = options[key];
    }
  }
  return newOptions;
};

export { DateTimeConverter, IntlDateTimeConverter, RelativeDateTimeFormatter };
