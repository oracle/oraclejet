/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { getTranslatedString } from 'ojs/ojtranslation';
import $ from 'jquery';
import ConverterUtils from 'ojs/ojconverterutils';
import { ConverterError } from 'ojs/ojvalidation-error';

/*
 DESCRIPTION
 OraI18nUtils provides helper functions for converter objects.

 PRIVATE CLASSES
 <list of private classes defined - with one-line descriptions>

 NOTES
 <other useful comments, qualifications, etc.>

 * @namespace oj.OraI18nUtils
 * @classdesc Helper functions for converter objects
 * @ignore
 * @export
 * @since 0.6.0
 * @ojtsnoexport
 */

const OraI18nUtils = {};
// supported numbering systems
OraI18nUtils.numeringSystems = {
  latn: '\u0030\u0031\u0032\u0033\u0034\u0035\u0036\u0037\u0038\u0039',
  arab: '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669',
  thai: '\u0e50\u0e51\u0e52\u0e53\u0e54\u0e55\u0e56\u0e57\u0e58\u0e59'
};

OraI18nUtils.regexTrim = /^\s+|\s+$|\u200f|\u200e/g;
OraI18nUtils.regexTrimNumber = /\s+|\u200f|\u200e/g;
OraI18nUtils.regexTrimRightZeros = /0+$/g;
OraI18nUtils.zeros = ['0', '00', '000'];
// ISO 8601 string accepted values:
// -date only: YYYY or YYYY-MM or YYYY-MM-dd
// -time only without timezone: Thh:mm or Thh:mm:ss or Thh:mm:ss.SSS
// -time only with timezone: any of the time values above followed by any of the following:
// Z or +/-hh:mm or +/-hhmm or +/-hh
// -date time: any of the date values followed by any of the time values
OraI18nUtils._ISO_DATE_REGEXP =
  /^[+-]?\d{4}(?:-\d{2}(?:-\d{2})?)?(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(Z|[+-]\d{2}(?::?\d{2})?)?)?$|^T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(Z|[+-]\d{2}(?::?\d{2})?)?$/;
/**
 * Returns the timezone offset between UTC and the local time in Etc/GMT[+-]h syntax.
 * <p>
 * The offset is positive if the local timezone is behind UTC and negative if
 * it is ahead. The offset range is between Etc/GMT-14 and Etc/GMT+12 (UTC-12 and UTC+14)
 * Examples:
 * 1- The local time is UTC-7 (Pacific Daylight Time):
 * OraI18nUtils. getLocalTimeZoneOffset() will return the string "Etc/GMT+7"
 * 2- The local time is UTC+1 (Central European Standard Time):
 * OraI18nUtils. getLocalTimeZoneOffset() will return the string "Etc/GMT-1"
 * </p>
 * <p>
 * NOTE: Since JET v12.0.0, the IntlDateTimeConverter will fallback to the local system time zone
 * if no timeZone is in the options.
 * So instead of using this API to get a local timezone offset to pass the converter,
 * you should not set any timeZone in the converter options.
 * </p>
 * @param {Date=} date optional Date object. If not present return the local time zone
 * offset of the current date, otherwise return the local time zone offset at the
 * particular date.
 * @returns {string}
 * @memberof oj.OraI18nUtils
 * @method getLocalTimeZoneOffset
 */
OraI18nUtils.getLocalTimeZoneOffset = function (date) {
  var d = date || new Date();
  var offset = d.getTimezoneOffset();

  // getTimeStringFromOffset recently changed to return 'z' for offset 0, and we don't want to return that from this method.
  // this code will still work if getTimeStringFromOffset decides not to return 'z' for offset 0.
  return offset !== 0
    ? OraI18nUtils.getTimeStringFromOffset('Etc/GMT', offset, false, false)
    : 'Etc/GMT+0';
};

/*
 * Will return timezone if it exists.
 */
// This private method is not called, commenting out for now to remove it from code coverage calculations
// OraI18nUtils._getTimeZone = function (isoString)
// {
//  if (!isoString || typeof isoString !== "string")
//  {
//    return null;
//  }
//  var match = OraI18nUtils._ISO_DATE_REGEXP.exec(isoString);
//  //make sure it is iso string
//  if (match === null)
//  {
//    OraI18nUtils._throwInvalidISOString(isoString);
//  }
//  if (match[1] !== undefined)
//    return match[1];
//  return null;
// };

/**
 * <p>Returns a local ISO string provided a Date object.
 * This method can be used to convert a moment in time or a local ISO string into
 * a local ISO string. It can also be used to convert any Date object into local ISO
 * string.</p>
 * Examples below are where the local (user's system) time zone is UTC-06:00<br>
 * dateToLocalIso(new Date('2021-06-04T00:00:00-04:00')); -->'2021-06-03T22:00:00'<br>
 * dateToLocalIso(new Date('2021-06-04T02:30:00Z')); -->'2021-06-03T20:30:00'<br>
 * In this example the input ISO string is local, the output is the same:<br>
 * dateToLocalIso(new Date('2021-06-04T02:30:00')); -->'2021-06-04T02:30:00'<br>
 * In this example we just want to convert a Date object:<br>
 * dateToLocalIso(new Date());<br>
 *
 * @param {Date} _date
 * @returns {string} isoString
 * @export
 * @since 0.7.0
 * @memberof oj.OraI18nUtils
 * @method dateToLocalIso
 */
OraI18nUtils.dateToLocalIso = function (_date) {
  var date = _date;
  if (typeof date === 'number') {
    date = new Date(date);
  }
  var isoStr =
    OraI18nUtils.padZeros(date.getFullYear(), 4) +
    '-' +
    OraI18nUtils.padZeros(date.getMonth() + 1, 2) +
    '-' +
    OraI18nUtils.padZeros(date.getDate(), 2) +
    'T' +
    OraI18nUtils.padZeros(date.getHours(), 2) +
    ':' +
    OraI18nUtils.padZeros(date.getMinutes(), 2) +
    ':' +
    OraI18nUtils.padZeros(date.getSeconds(), 2);
  if (date.getMilliseconds() > 0) {
    isoStr += '.' + OraI18nUtils.trimRightZeros(OraI18nUtils.padZeros(date.getMilliseconds(), 3));
  }
  return isoStr;
};

/**
 * <p>Returns the date only portion of a local ISO string provided a Date object.
 * This method can be used to convert a moment in time ISO string into a local
 * ISO string and get the date part of it. This method is useful if you are storing
 * your dates as a moment in time and you want to use it in a date only component,
 * like oj-input-date, that shows the date in the timezone of the user's local system.</p>
 * Examples where local time zone offset is UTC-06:00<br>
 * dateToLocalIsoDateString(new Date('2021-06-04T00:00:00-04:00')); -->'2021-06-03'<br>
 * dateToLocalIsoDateString(new Date('2021-06-04T02:30:00Z')); -->'2021-06-03'<br>
 *
 * @param {Date} date
 * @returns {string} date portion only of the ISO String
 * @export
 * @since 12.0.0
 * @memberof oj.OraI18nUtils
 * @method dateToLocalIsoDateString
 */
OraI18nUtils.dateToLocalIsoDateString = function (date) {
  var isoStr = OraI18nUtils.dateToLocalIso(date);
  var parts = isoStr.split('T');
  return parts[0];
};

/**
 * @memberof oj.OraI18nUtils
 * @method partsToIsoString
 */
OraI18nUtils.partsToIsoString = function (parts) {
  var isoStr =
    OraI18nUtils.padZeros(parts[0], 4) +
    '-' +
    OraI18nUtils.padZeros(parts[1], 2) +
    '-' +
    OraI18nUtils.padZeros(parts[2], 2) +
    'T' +
    OraI18nUtils.padZeros(parts[3], 2) +
    ':' +
    OraI18nUtils.padZeros(parts[4], 2) +
    ':' +
    OraI18nUtils.padZeros(parts[5], 2);
  if (parts[6] > 0) {
    isoStr += '.' + OraI18nUtils.trimRightZeros(OraI18nUtils.padZeros(parts[6], 3));
  }
  return isoStr;
};

/**
 * Returns a local Date object from a local ISO string. This method is only meant
 * to work with local ISO strings. If the input ISO string contain Z or offset,
 * they will be ignored.
 * @param {string} isoString
 * @memberof oj.OraI18nUtils
 * @method isoToLocalDate
 */
OraI18nUtils.isoToLocalDate = function (isoString) {
  if (!isoString || typeof isoString !== 'string') {
    return null;
  }
  return this._isoToLocalDateIgnoreTimezone(isoString);
};

OraI18nUtils._isoToLocalDateIgnoreTimezone = function (isoString) {
  var datetime = OraI18nUtils._IsoStrParts(isoString);
  var date = new Date(
    datetime[0],
    datetime[1] - 1,
    datetime[2],
    datetime[3],
    datetime[4],
    datetime[5],
    datetime[6]
  );
  // As per the documentation:
  // new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);
  // year - Integer value representing the year and
  // values from 0 to 99 map to the years 1900 to 1999; all other values are the actual year.
  // Use Date.prototype.setFullYear to create dates between the years 0 and 99.
  date.setFullYear(datetime[0]);
  return date;
};

OraI18nUtils._IsoStrParts = function (isoString) {
  var tst = OraI18nUtils._ISO_DATE_REGEXP.test(isoString);
  if (tst === false) {
    OraI18nUtils._throwInvalidISOStringSyntax(isoString);
  }
  var splitted = isoString.split('T');
  var tIndex = isoString.indexOf('T');
  var today = new Date();
  var i;
  var isBC = false;
  var datetime = [today.getFullYear(), today.getMonth() + 1, today.getDate(), 0, 0, 0, 0];

  if (splitted[0] !== '') {
    // contains date portion
    // test if date is BC, year is negative
    if (OraI18nUtils.startsWith(splitted[0], '-')) {
      splitted[0] = splitted[0].substr(1);
      isBC = true;
    }
    var dateSplitted = splitted[0].split('-');
    for (i = 0; i < dateSplitted.length; i++) {
      var val = parseInt(dateSplitted[i], 10);
      // validate month
      if (i === 1) {
        if (val < 1 || val > 12) {
          OraI18nUtils._throwInvalidISOStringRange(isoString, 'month', val, 1, 12);
        }
      }
      // validate day
      if (i === 2) {
        var nbDays = OraI18nUtils._getDaysInMonth(datetime[0], datetime[1] - 1);
        if (val < 1 || val > nbDays) {
          OraI18nUtils._throwInvalidISOStringRange(isoString, 'day', val, 1, nbDays);
        }
      }
      datetime[i] = val;
    }
    if (isBC) {
      datetime[0] = -datetime[0];
    }
  }

  if (tIndex !== -1) {
    var milliSecSplitted = splitted[1].split('.'); // contain millseconds
    var timeSplitted = milliSecSplitted[0].split(':'); // contain hours, minutes, seconds

    for (i = 0; i < timeSplitted.length; i++) {
      var tVal = parseInt(timeSplitted[i], 10);
      // validate hour
      if (i === 0) {
        if (tVal < 0 || tVal > 24) {
          OraI18nUtils._throwInvalidISOStringRange(isoString, 'hour', tVal, 0, 24);
        }
      }
      // validate minute
      if (i === 1) {
        if (tVal < 0 || tVal > 59) {
          OraI18nUtils._throwInvalidISOStringRange(isoString, 'minute', tVal, 0, 59);
        }
      }
      // validate second
      if (i === 2) {
        if (tVal < 0 || tVal > 59) {
          OraI18nUtils._throwInvalidISOStringRange(isoString, 'second', tVal, 0, 59);
        }
      }
      datetime[3 + i] = tVal;
    }

    if (milliSecSplitted.length === 2 && milliSecSplitted[1]) {
      datetime[6] = parseInt(OraI18nUtils.zeroPad(milliSecSplitted[1], 3, false), 10);
    }
  }
  return datetime;
};

/**
 * @memberof oj.OraI18nUtils
 * @method getISOStrFormatInfo
 */
OraI18nUtils.getISOStrFormatInfo = function (isoStr) {
  var res = {
    format: null,
    dateTime: null,
    timeZone: '',
    isoStrParts: null
  };
  var exe = OraI18nUtils._ISO_DATE_REGEXP.exec(isoStr);

  if (exe === null) {
    OraI18nUtils._throwInvalidISOStringSyntax(isoStr);
  }
  if (exe && exe[1] === undefined && exe[2] === undefined) {
    res.format = 'local';
    res.dateTime = isoStr;
    res.isoStrParts = OraI18nUtils._IsoStrParts(res.dateTime);
    return res;
  }
  res.timeZone = exe[1] !== undefined ? exe[1] : exe[2];
  if (res.timeZone === 'Z') {
    res.format = 'zulu';
  } else {
    res.format = 'offset';
  }
  var isoStrLen = isoStr.length;
  var timeZoneLen = res.timeZone.length;
  res.dateTime = isoStr.substring(0, isoStrLen - timeZoneLen);
  res.isoStrParts = OraI18nUtils._IsoStrParts(res.dateTime);
  return res;
};

/**
 * Returns the format type of the isoStr: 'local', 'zulu' or 'offset',
 * or throw invalidISOStringSytax error
 * @param {string} isoStr isoString
 * @returns {'local'|'zulu'|'offset'} isoString format: 'local', 'zulu', or 'offset'
 * @throws Error
 * @memberof oj.OraI18nUtils
 * @method getISOStrFormatType
 */
OraI18nUtils.getISOStrFormatType = function (isoStr) {
  let format;
  const exe = OraI18nUtils._ISO_DATE_REGEXP.exec(isoStr);

  if (exe === null) {
    OraI18nUtils._throwInvalidISOStringSyntax(isoStr);
  }
  if (exe && exe[1] === undefined && exe[2] === undefined) {
    format = 'local';
    return format;
  }
  let timeZone = exe[1] !== undefined ? exe[1] : exe[2];
  if (timeZone === 'Z') {
    format = 'zulu';
  } else {
    format = 'offset';
  }
  return format;
};

// This private method is not called, commenting out for now to remove it from code coverage calculations
// OraI18nUtils._throwTimeZoneNotSupported = function () {
//  var msg, error, errorInfo;
//  msg = "time zone is not supported";
//  error = new Error(msg);
//  errorInfo = {
//    'errorCode': 'timeZoneNotSupported'
//  };
//  error['errorInfo'] = errorInfo;
//  throw error;
// };

OraI18nUtils._isLeapYear = function (y) {
  if (y % 400 === 0) {
    return true;
  } else if (y % 100 === 0) {
    return false;
  } else if (y % 4 === 0) {
    return true;
  }
  return false;
};

// Get days in month depending on month and leap year
OraI18nUtils._getDaysInMonth = function (y, m) {
  switch (m) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
      return 31;
    case 1:
      if (OraI18nUtils._isLeapYear(y)) {
        return 29;
      }
      return 28;
    default:
      return 30;
  }
};
OraI18nUtils._throwInvalidISOStringRange = function (
  isoStr,
  name,
  displayValue,
  displayLow,
  displayHigh
) {
  var msg =
    'The string ' +
    isoStr +
    ' is not a valid ISO 8601 string: ' +
    displayValue +
    ' is out of range.  Enter a value between ' +
    displayLow +
    ' and ' +
    displayHigh +
    ' for ' +
    name;
  var rangeError = new RangeError(msg);
  var errorInfo = {
    errorCode: 'isoStringOutOfRange',
    parameterMap: {
      isoString: isoStr,
      value: displayValue,
      minValue: displayLow,
      maxValue: displayHigh,
      propertyName: name
    }
  };
  rangeError.errorInfo = errorInfo;
  throw rangeError;
};

OraI18nUtils._throwInvalidISOStringSyntax = function (str) {
  var msg = 'The string ' + str + ' is not a valid ISO 8601 string syntax.';
  var error = new Error(msg);
  var errorInfo = {
    errorCode: 'invalidISOString',
    parameterMap: {
      isoStr: str
    }
  };
  error.errorInfo = errorInfo;
  throw error;
};

OraI18nUtils.trim = function (value) {
  return (value + '').replace(OraI18nUtils.regexTrim, '');
};

OraI18nUtils.trimRightZeros = function (value) {
  return (value + '').replace(OraI18nUtils.regexTrimRightZeros, '');
};

OraI18nUtils.trimNumber = function (value) {
  var s = (value + '').replace(OraI18nUtils.regexTrimNumber, '');
  return s;
};

OraI18nUtils.startsWith = function (value, pattern) {
  return value.indexOf(pattern) === 0;
};

OraI18nUtils.toUpper = function (value) {
  // "he-IL" has non-breaking space in weekday names.
  return value.split('\u00A0').join(' ').toUpperCase();
};

OraI18nUtils.padZeros = function (num, c) {
  var s = num + '';
  var isNegative = false;
  if (num < 0) {
    s = s.substr(1);
    isNegative = true;
  }
  if (c > 1 && s.length < c) {
    s = OraI18nUtils.zeros[c - 2] + s;
    s = s.substr(s.length - c, c);
  }
  if (isNegative) {
    s = '-' + s;
  }
  return s;
};

OraI18nUtils.zeroPad = function (str, count, left) {
  var result = '' + str;

  for (var l = result.length; l < count; l += 1) {
    result = left ? '0' + result : result + '0';
  }
  return result;
};

/**
 * @memberof oj.OraI18nUtils
 * @method getTimeStringFromOffset
 */
OraI18nUtils.getTimeStringFromOffset = function (prefix, offset, reverseSign, alwaysMinutes) {
  // when offset is 0 return 'Z' instead of '+00:00'. This is standard practice and is what Java does as well.
  // This changed in JET v14.0.0.
  if (offset === 0) {
    return 'Z';
  }
  var isNegative = reverseSign ? offset > 0 : offset < 0;
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  var sign = isNegative ? '-' : '+';

  if (alwaysMinutes) {
    hours = OraI18nUtils.zeroPad(hours, 2, true);
  }
  var str = prefix + sign + hours;
  if (minutes > 0 || alwaysMinutes) {
    str += ':' + OraI18nUtils.zeroPad(minutes, 2, true);
  }
  return str;
};

/**
 * get the numbering system key from the locale's unicode extension.
 * Verify that the locale data has a numbers entry for it, if not return latn as default.
 * @memberof oj.OraI18nUtils
 * @method getNumberingSystemKey
 */
OraI18nUtils.getNumberingSystemKey = function (localeElements, locale) {
  if (locale === undefined) {
    return 'latn';
  }
  var numberingSystemKey = OraI18nUtils.getNumberingExtension(locale);
  var symbols = 'symbols-numberSystem-' + numberingSystemKey;
  if (localeElements.numbers[symbols] === undefined) {
    numberingSystemKey = 'latn';
  }
  return numberingSystemKey;
};

/**
 * return the language part
 * @memberof oj.OraI18nUtils
 * @method getBCP47Lang
 */
OraI18nUtils.getBCP47Lang = function (tag) {
  var arr = tag.split('-');
  return arr[0];
};

// return the region part. tag is lang or lang-region or lang-script or
// lang-script-region
OraI18nUtils.getBCP47Region = function (tag) {
  var arr = tag.split('-');
  if (arr.length === 3) {
    return arr[2];
  }
  if (arr.length === 2) {
    if (arr[1].length === 2) {
      return arr[1];
    }
  }
  return '001';
};

// get the unicode numbering system extension.
OraI18nUtils.getNumberingExtension = function (_locale) {
  var locale = _locale || 'en-US';
  var idx = locale.indexOf('-u-nu-');
  var numbering = 'latn';
  if (idx !== -1) {
    numbering = locale.substr(idx + 6, 4);
  }
  return numbering;
};

OraI18nUtils.haveSamePropertiesLength = function (obj) {
  return Object.keys(obj).length;
};

// cldr locale data start with "main" node.
// return the subnode under main.
OraI18nUtils.getLocaleElementsMainNode = function (bundle) {
  var mainNode = bundle.main;
  var keys = Object.keys(mainNode);
  return mainNode[keys[0]];
};

// get the locale which is a subnode of "main".
OraI18nUtils.getLocaleElementsMainNodeKey = function (bundle) {
  var mainNode = bundle.main;
  var keys = Object.keys(mainNode);
  return keys[0];
};

OraI18nUtils._toBoolean = function (value) {
  if (typeof value === 'string') {
    var s = value.toLowerCase().trim();
    switch (s) {
      case 'true':
      case '1':
        return true;
      case 'false':
      case '0':
        return false;
      default:
        return value;
    }
  }
  return value;
};
// Return a function getOption.
// The getOption function extracts the value of the property named
// property from the provided options object, converts it to the required type,
// checks whether it is one of a List of allowed values, and fills in a
// fallback value if necessary.
OraI18nUtils.getGetOption = function (options, getOptionCaller) {
  if (options === undefined) {
    throw new Error('Internal ' + getOptionCaller + ' error. Default options missing.');
  }

  var getOption = function (property, type, values, defaultValue) {
    if (options[property] !== undefined) {
      var value = options[property];
      switch (type) {
        case 'boolean':
          value = OraI18nUtils._toBoolean(value);
          break;
        case 'string':
          value = String(value);
          break;
        case 'number':
          value = Number(value);
          break;
        default:
          throw new Error('Internal error. Wrong value type.');
      }
      if (values !== undefined && values.indexOf(value) === -1) {
        var expectedValues = [];
        for (var i = 0; i < values.length; i++) {
          expectedValues.push(values[i]);
        }
        var msg =
          "The value '" +
          options[property] +
          "' is out of range for '" +
          getOptionCaller +
          "' options property '" +
          property +
          "'. Valid values: " +
          expectedValues;
        var rangeError = new RangeError(msg);
        var errorInfo = {
          errorCode: 'optionOutOfRange',
          parameterMap: {
            propertyName: property,
            propertyValue: options[property],
            propertyValueValid: expectedValues,
            caller: getOptionCaller
          }
        };
        rangeError.errorInfo = errorInfo;
        throw rangeError;
      }

      return value;
    }
    return defaultValue;
  };

  return getOption;
};

/**
 * matches a string to a reference string and returns the start and end indexes
 * of the match in the referensed string. The locale and options arguments let
 * applications specify the language whose sort order should be used and customize
 * the behavior of the function.
 *
 * @param {string} str the reference string
 * @param {string} pat The string against which the reference string is compared
 * @param {string} locale a BCP 47 language tag
 * @param {Object=} options Optional. An object with the following property:
 * sensitivity:
 *   Which differences in the strings should lead to non-zero result values. Possible values are:
 *   "base": Only strings that differ in base letters compare as unequal. Examples: a ? b,  a = A.
 *   "accent": Only strings that differ in base letters or accents and other diacritic marks compare as unequal. Examples: a ? b, , a = A.
 *   "case": Only strings that differ in base letters or case compare as unequal. Examples: a ? b, a ? A.
 *   "variant": Strings that differ in base letters, accents and other diacritic marks, or case compare as unequal.
 *   The default is base.
 * @return {Array|null} an array containing the start and end indexes of the match or null if there is no match.
 */
OraI18nUtils.matchString = function (str, pat, locale, options) {
  if (options === undefined) {
    // eslint-disable-next-line no-param-reassign
    options = { sensitivity: 'base', usage: 'sort' };
  }
  var getOption = OraI18nUtils.getGetOption(options, 'OraI18nUtils.matchString');
  // eslint-disable-next-line no-param-reassign
  options.usage = getOption('usage', 'string', ['sort', 'search'], 'sort');
  // eslint-disable-next-line no-param-reassign
  options.sensitivity = getOption(
    'sensitivity',
    'string',
    ['base', 'accent', 'case', 'variant'],
    'base'
  );
  var len = str.length;
  var patLen = pat.length - 1;
  for (var i = 0; i < len; i++) {
    for (var j = 0; j < 3; j++) {
      var len2 = len - i;
      len2 = Math.min(len2, patLen + j);
      var str2 = str.substr(i, len2);
      var res = str2.localeCompare(pat, locale, options);
      if (res === 0) {
        var end = i + (len2 - 1);
        var ret = [i, end];
        return ret;
      }
    }
  }
  return null;
};

var _DEFAULT_TIME_PORTION = 'T00:00:00.000';
var _DATE_TIME_KEYS = {
  fullYear: { pos: 0, pad: 4 },
  month: { pos: 1, pad: 2 },
  date: { pos: 2, pad: 2 },
  hours: { pos: 3, pad: 2 },
  minutes: { pos: 4, pad: 2 },
  seconds: { pos: 5, pad: 2 },
  milliseconds: { pos: 6, pad: 3 },
  timeZone: { pos: 7 }
};

/**
 * Parses the isoString and returns a JavaScript Date object
 *
 * @param {string} isoString isoString to parse and to return Date of
 * @return {Date} the parsed JavaScript Date Object
 * @method isoToDate
 * @ignore
 */
OraI18nUtils.isoToDate = function (isoString) {
  // note new Date w/ isoString in IE fails so need to use parsing from momentjs support
  return new Date(this._normalizeIsoString(isoString));
};

/**
 * Will return an updated toIsoString using the timePortion from the fromIsoString or from the default
 * OraI18nUtils.DEFAULT_TIME_PORTION
 *
 * @private
 * @param {string} fromIsoString isoString that may not be a complete isoString
 * @param {string} toIsoString isoString that may not be a complete isoString
 * @returns {string} modified toIsoString with original date portion and the time portion from the fromIsoString
 * @since 1.1
 * @method _copyTimeOver
 */
OraI18nUtils._copyTimeOver = function (fromIsoString, toIsoString) {
  if (!fromIsoString || !toIsoString) {
    throw new Error('Provided invalid arguments');
  }

  // need to only normalize toIsoString, since copying only time from fromIsoString
  var normalizedToIsoString = this._normalizeIsoString(toIsoString);

  var fromTimeIndex = fromIsoString.indexOf('T');
  var toTimeIndex = normalizedToIsoString.indexOf('T');
  var toDatePortion = normalizedToIsoString.substring(0, toTimeIndex);
  var fromTimePortion =
    fromTimeIndex !== -1 ? fromIsoString.substring(fromTimeIndex) : _DEFAULT_TIME_PORTION;

  return toDatePortion + fromTimePortion;
};

/**
 * Clears the time portion of the isoString
 *
 * @private
 * @param {string} isoString isoString that may not be a complete isoString
 * @returns {string} an updated isoString
 * @since 1.1
 * @method _clearTime
 */
OraI18nUtils._clearTime = function (isoString) {
  return this._dateTime(isoString, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
};

/**
 * Will accept an isoString and perform a get operation or a set operation depending on whether param is an Array
 * or a JSON
 *
 * The keys for the get and set operation are defined in _DATE_TIME_KEYS.
 *
 * Note the handling of month starting with 0 in Date object and being 1 based in isoString will be handled by the function
 * with the usage of doParseValue. Meaning when you doParseValue and you are getting the value it will automatically
 * decrement the value and when you are setting the param it will check if the value is of number and if so will
 * increment it.
 *
 * @private
 * @param {string} isoString isoString that may not be a complete isoString
 * @param {Array|Object} actionParam if an Array will be a get operation, if a JSON will be a set operation
 * @param {boolean=} doParseValue whether one should parseInt the value during the get request
 * @returns {Object|string} an Object when a get operation and a string when a set operation
 * @since 1.1
 * @method _dateTime
 */
OraI18nUtils._dateTime = function (isoString, actionParam, doParseValue) {
  if (!isoString || !actionParam) {
    throw new Error('Invalid argument invocation');
  }

  var pos;
  var value;
  var retVal = null;
  var dateTimeKeys = _DATE_TIME_KEYS;
  var oraUtilsPadZero = this.padZeros;
  var isoStringNormalized = this._normalizeIsoString(isoString); // note intentionally normalizing
  var captured = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):?(\d{2})?\.?(\d{3})?(.*)?/.exec(
    isoStringNormalized
  );

  if (!captured) {
    throw new Error('Unable to capture anything');
  }

  captured = captured.slice(1);

  if (Array.isArray(actionParam)) {
    retVal = {};

    // means an array so perform a get operation
    for (var i = 0, len = actionParam.length; i < len; i++) {
      var key = actionParam[i];

      if (key in dateTimeKeys) {
        pos = dateTimeKeys[key].pos;
        value = captured[pos];

        if (doParseValue && key === 'timeZone') {
          throw new Error('Dude you tried to ask timezone to be parsed');
        }

        if (doParseValue) {
          var parsed = parseInt(value, 10);
          retVal[key] = pos === 1 ? parsed - 1 : parsed; // since month is 0 based, though about having a callback but month only special
        } else {
          retVal[key] = value;
        }
      }
    }
  } else if ($.isPlainObject(actionParam)) {
    var objKeys = Object.keys(actionParam);
    for (var k = 0; k < objKeys.length; k++) {
      var objKey = objKeys[k];
      var dtKey = dateTimeKeys[objKey];
      pos = dtKey.pos;
      value = actionParam[objKey];

      // special case for month again, 0 based so check if number and if so increment it
      if (pos === 1 && typeof value === 'number') {
        value += 1;
      }
      captured[pos] = dtKey.pad ? oraUtilsPadZero(value, dtKey.pad) : value;
    }
    // "2015-02-02T21:12:30.255Z"
    retVal =
      captured[0] +
      '-' +
      captured[1] +
      '-' +
      captured[2] +
      'T' +
      captured[3] +
      ':' +
      captured[4] +
      ':' +
      captured[5] +
      (captured.length > 6 && captured[6]
        ? '.' + captured[6] + (captured.length === 8 && captured[7] ? captured[7] : '')
        : '');
  }

  return retVal;
};

/**
 * So the problem is Jet uses incomplete isoString which causes issues in different browsers.
 *
 * For instance for a new Date().toISOString() => 2015-02-02T18:00:37.007Z
 * ojInputDate stores 2015-02-02
 * ojInputTime stores T18:00:37.007Z
 *
 * yet constructing new Date(val) on above causes different results or errors in different browsers, so
 * this function is to normalize them. Note it is assumed that the point is creating the Date object from the
 * normalized isoString. Meaning if both contain only the time portion today's date will appended to it.
 *
 * Here are the use cases
 *
 * @private
 * @param {string} isoString isoString that may not be a complete isoString
 * @returns {string} a normalized isoString
 * @since 1.1
 * @method _normalizeIsoString
 */
OraI18nUtils._normalizeIsoString = function (isoString) {
  if (!isoString) {
    throw new Error('Provided invalid arguments');
  }

  var checkTime = function (timeValue) {
    var splitted = timeValue.split(':');
    if (splitted.length > 1) {
      return timeValue;
    }
    // need at least hour + minute for proper parsing on browser except IE
    return timeValue + ':00';
  };

  var todayIsoString = new Date().toISOString();
  var todayDatePortion = todayIsoString.substring(0, todayIsoString.indexOf('T'));
  var timeIndex = isoString.indexOf('T');
  var datePortion = timeIndex === -1 ? isoString : isoString.substring(0, timeIndex);
  var timePortion =
    timeIndex !== -1 ? checkTime(isoString.substring(timeIndex)) : _DEFAULT_TIME_PORTION;

  datePortion = datePortion || todayDatePortion;

  return datePortion + timePortion;
};

/**
 * formats a parameterized string
 *
 * @param {string} str string to be formatted. EX: "{0} bytes"
 * @param {Array} params array of parameters to be substituted in the string
 * @returns {string} The formatted string
 * @since 4.0.0
 */
OraI18nUtils.formatString = function (str, params) {
  var len = params.length;
  var result = str;

  for (var i = 0; i < len; i++) {
    var token = '{' + i + '}';
    result = result.replace(token, params[i]);
  }
  return result;
};

/**
 * converts an ISO string based on isoStrFormat and local system's time zone.
 * if isoStrFormat is offset, it appends the local system's offset to the iso string.
 * If isoStrFormat is zulu, it converts the ISO string to UTC and appends 'Z' to it.
 * if isoStrFormat is local, it returns as is.
 * For example if local system's timezone is America/Los_Angeles
 * convertISOString('2021-01-01T13:00:00', 'offset') -->  2021-01-01T13:00:00-08:00
 * convertISOString('2021-06-01T13:00:00', 'offset') -->  2021-06-01T13:00:00-07:00
 * convertISOString('2021-01-01T13:00:00', 'zulu') -->  2021-01-01T21:00:00Z
 * convertISOString('2021-06-01T13:00:00', 'zulu') -->  2021-06-01T20:00:00Z
 * @param {string} iso  string to be formatted.
 * @param {string} isoStrFormat, possible values: 'offset', 'zulu' or 'local'
 * @returns {string} The formatted iso string
 * @since 12.0.0
 */
OraI18nUtils.convertISOString = function (isoStr, isoStrFormat) {
  var formattedIsoStr = isoStr;
  if (isoStrFormat === 'offset') {
    var localOffset;
    if (isoStr.startsWith('T')) {
      localOffset = new Date().getTimezoneOffset();
    } else {
      localOffset = new Date(isoStr).getTimezoneOffset();
    }
    localOffset = OraI18nUtils.getTimeStringFromOffset('', localOffset, true, true);
    formattedIsoStr += localOffset;
  } else if (isoStrFormat === 'zulu') {
    var parts = OraI18nUtils._IsoStrParts(isoStr);
    var date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5], parts[6]);
    formattedIsoStr =
      OraI18nUtils.padZeros(date.getUTCFullYear(), 4) +
      '-' +
      OraI18nUtils.padZeros(date.getUTCMonth() + 1, 2) +
      '-' +
      OraI18nUtils.padZeros(date.getUTCDate(), 2) +
      'T' +
      OraI18nUtils.padZeros(date.getUTCHours(), 2) +
      ':' +
      OraI18nUtils.padZeros(date.getUTCMinutes(), 2) +
      ':' +
      OraI18nUtils.padZeros(date.getUTCSeconds(), 2);
    if (date.getMilliseconds() > 0) {
      formattedIsoStr +=
        '.' + OraI18nUtils.trimRightZeros(OraI18nUtils.padZeros(date.getUTCMilliseconds(), 3));
    }
    formattedIsoStr += 'Z';
  }
  return formattedIsoStr;
};

/**
 * Returns a person's initials
 *
 * @param {string=} firstName first name
 * @param {string=} lastName last name or surname
 * @returns {string|undefined} uppercase concatenation of first letter of first name and first letter
 * of last name.
 * There are the following special cases:
 * - If the name is Arabic characters, it returns empty string.
 * - If the name is Hindi characters, it returns the first letter of the first name.
 * - If the name is Thai characters, it returns the first letter of the first name.
 * - If the name is Korean characters, it returns the first name.
 * - If the name is Japanese or Chinese characters, it returns the last name.
 *
 * @since 4.0.0
 * @method getInitials
 * @ignore
 */
OraI18nUtils.getInitials = function (firstName, lastName) {
  // We assume the names are valid. We test the first character only.
  var c = 0;
  var c1 = 0;
  var u;
  if (firstName !== undefined && firstName.length > 0) {
    c = firstName.charCodeAt(0);
  }

  // Arabic characters. Return empty string
  if (c >= 0x0600 && c <= 0x06ff) {
    return '';
  }

  // Hindi characters. Return first letter of the first name
  if (c >= 0x0900 && c <= 0x097f) {
    return firstName.charAt(0);
  }

  // Thai characters. Return first letter of the first name
  if (c >= 0x0e00 && c <= 0x0e7f) {
    return firstName.charAt(0);
  }

  // Korean characters. Return first name
  if (
    (c >= 0x1100 && c <= 0x11ff) ||
    (c >= 0x3130 && c <= 0x318f) ||
    (c >= 0xa960 && c <= 0xa97f) ||
    (c >= 0xac00 && c <= 0xd7ff)
  ) {
    return firstName;
  }

  // Japanese and Chinese characters. Return last name
  if (lastName !== undefined && lastName.length > 0) {
    c = lastName.charCodeAt(0);
  }
  if (
    (c >= 0x2e80 && c <= 0x2fdf) ||
    (c >= 0x3000 && c <= 0x312f) ||
    (c >= 0x3190 && c <= 0x31ff) ||
    (c >= 0x3300 && c <= 0x4dbf) ||
    (c >= 0x4e00 && c <= 0x9fff) ||
    (c >= 0xf900 && c <= 0xfaff)
  ) {
    return lastName;
  }

  // Handle surrogate characters for Japanese and Chinese characters.
  if (c >= 0xd800 && c <= 0xdbff) {
    if (lastName && lastName.length < 2) {
      return '';
    }
    c1 = lastName.charCodeAt(1);
    // c1 must be in DC00-DFFF range
    if (c1 < 0xdc00 || c1 > 0xdfff) {
      return '';
    }
    // Convert high and low surrogates into unicode scalar.
    u = (c - 0xd800) * 0x400 + (c1 - 0xdc00) + 0x10000;
    // test the blocks
    if (
      (u >= 0x1b000 && u <= 0x1b0ff) ||
      (u >= 0x1f200 && u <= 0x1f2ff) ||
      (u >= 0x20000 && u <= 0x2a6df) ||
      (u >= 0x2a700 && u <= 0x2b73f) ||
      (u >= 0x2b740 && u <= 0x2b81f) ||
      (u >= 0x2b820 && u <= 0x2ceaf) ||
      (u >= 0x2f800 && u <= 0x2fa1f)
    ) {
      return lastName;
    }
  }

  // return default
  c = '';
  c1 = '';
  if (firstName !== undefined && firstName.length > 0) {
    c = firstName.charAt(0).toUpperCase();
  }
  if (lastName !== undefined && lastName.length > 0) {
    c1 = lastName.charAt(0).toUpperCase();
  }
  return c + c1;
};

/**
 * @export
 * @classdesc Utility function for converters
 * @hideconstructor
 * @since 0.7.0
 * @namespace oj.IntlConverterUtils
 * @ojtsimport {module: "ojconverter", type:"AMD", importName: "Converter"}
 * @ojtsimport {module: "ojvalidationfactory-base", type: "AMD", imported:["Validation"]}
 */
const IntlConverterUtils = {};

/**
 * Parses the isoString and returns a JavaScript Date object
 *
 * @export
 * @param {string} isoString isoString to parse and to return Date of
 * @return {Date} the parsed JavaScript Date Object
 * @memberof oj.IntlConverterUtils
 * @method isoToDate
 */
IntlConverterUtils.isoToDate = function (isoString) {
  return OraI18nUtils.isoToDate(isoString);
};

/**
 * Returns a local Date object from a local ISO string. This method is only meant
 * to work with local ISO strings. If the input ISO string contain Z or offset,
 * they will be ignored.
 *
 * @param {string} isoString an ISO 8601 string
 * @returns {Date} localDate
 * @export
 * @since 0.7.0
 * @memberof oj.IntlConverterUtils
 * @method isoToLocalDate
 */
IntlConverterUtils.isoToLocalDate = function (isoString) {
  return OraI18nUtils.isoToLocalDate(isoString);
};

/**
 * <p>Returns a local ISO string provided a Date object.
 * This method can be used to convert a moment in time or a local ISO string into
 * a local ISO string. It can also be used to convert any Date object into local ISO
 * string.</p>
 * Examples below are where the local (user's system) time zone is UTC-06:00<br>
 * dateToLocalIso(new Date('2021-06-04T00:00:00-04:00')); -->'2021-06-03T22:00:00'<br>
 * dateToLocalIso(new Date('2021-06-04T02:30:00Z')); -->'2021-06-03T20:30:00'<br>
 * In this example the input ISO string is local, the output is the same:<br>
 * dateToLocalIso(new Date('2021-06-04T02:30:00')); -->'2021-06-04T02:30:00'<br>
 * In this example we just want to convert a Date object:<br>
 * dateToLocalIso(new Date());<br>
 *
 * @param {Date} date
 * @returns {string} isoString
 * @export
 * @since 0.7.0
 * @memberof oj.IntlConverterUtils
 * @method dateToLocalIso
 */
IntlConverterUtils.dateToLocalIso = function (date) {
  return OraI18nUtils.dateToLocalIso(date);
};

/**
 * <p>Returns the date only portion of a local ISO string provided a Date object.
 * This method can be used to convert a moment in time ISO string into a local
 * ISO string and get the date part of it. This method is useful if you are storing
 * your dates as a moment in time and you want to use it in a date only component,
 * like oj-input-date, that shows the date in the timezone of the user's local system.</p>
 * Examples where local time zone offset is UTC-06:00<br>
 * dateToLocalIsoDateString(new Date('2021-06-04T00:00:00-04:00')); -->'2021-06-03'<br>
 * dateToLocalIsoDateString(new Date('2021-06-04T02:30:00Z')); -->'2021-06-03'<br>
 *
 * @param {Date} date
 * @returns {string} date portion only of the ISO String
 * @export
 * @since 12.0.0
 * @memberof oj.IntlConverterUtils
 * @method dateToLocalIsoDateString
 */
IntlConverterUtils.dateToLocalIsoDateString = function (date) {
  return OraI18nUtils.dateToLocalIsoDateString(date);
};

// This private method is not called, commenting out for now to remove it from code coverage calculations
// oj.IntlConverterUtils._getTimeZone = function(isoString)
// {
//  return OraI18nUtils._getTimeZone(isoString);
// };

/**
 * Returns the timezone offset between UTC and the local time in Etc/GMT[+-]h syntax.
 * The offset is positive if the local timezone is behind UTC and negative if
 * it is ahead. The offset range is between Etc/GMT-14 and Etc/GMT+12 (UTC-12 and UTC+14)
 *
 * @example <caption>The local time is UTC-7 (Pacific Daylight Time)</caption>
 * oj.IntlConverterUtils.getLocalTimeZoneOffset() will return the string "Etc/GMT+7"
 *
 * @example <caption>The local time is UTC+1 (Central European Standard Time)</caption>
 * oj.IntlConverterUtils.getLocalTimeZoneOffset() will return the string "Etc/GMT-1"
 * <p>
 * NOTE: Since JET v12.0.0, the IntlDateTimeConverter will fallback to the local system time zone
 * if no timeZone is in the options.
 * So instead of using this API to get a local timezone offset to pass the converter,
 * you should not set any timeZone in the converter options.
 * </p>
 * @export
 * @param {Date=} date If date is undefined, it returns the local timezone offset of the current
 * date, otherwise it returns the local timezone offset at that given date.
 * @returns {string}
 * @memberof oj.IntlConverterUtils
 * @method getLocalTimeZoneOffset
 */
IntlConverterUtils.getLocalTimeZoneOffset = function (date) {
  return OraI18nUtils.getLocalTimeZoneOffset(date);
};

/**
 * Given either an Object literal representing a 'converter' option (used in components) or a
 * converter instance of type Converter, this method returns the converter instance.
 * You can also pass in a string. In this case, it will return you an instance of a converter
 * registered with that type.
 * @ojdeprecated {since: '8.0.0', description: 'Create a converter using its constructor.'}
 * @param {string| Object} converterOption
 * @returns {Object|null} converterInstance or null if a converter cannot be determined
 * @ojsignature {
 *        target: "Type", value: "<T>(converterOption: string|Validation.RegisteredConverter|Converter<T>): Converter<T>|null"}
 * @export
 * @since 0.6.0

 * @memberof oj.IntlConverterUtils
 * @method getConverterInstance
 */
IntlConverterUtils.getConverterInstance = function (converterOption) {
  return ConverterUtils.getConverterInstance(converterOption);
};

/**
 * So the requirement is if min or max lacks date portion and value contains it, then min + max should use
 * value's date portion
 *
 * @param {string} minMax date in isoString format
 * @param {string} value date in isoString format
 * @returns {string} merged date in isoString format
 * @export
 * @ignore
 * @since 1.2
 * @memberof oj.IntlConverterUtils
 * @method _minMaxIsoString
 */
IntlConverterUtils._minMaxIsoString = function (minMax, value) {
  if (minMax) {
    // eslint-disable-next-line no-param-reassign
    value = value || this.dateToLocalIso(new Date());

    var vTindex = value.indexOf('T');

    if (minMax.indexOf('T') === 0 && vTindex > 0) {
      // meaning only time exists for minMax and value contains date
      // eslint-disable-next-line no-param-reassign
      minMax = value.substring(0, vTindex) + minMax;
    }
  }

  return minMax;
};

// PACKAGE PRIVATE
/**
 * Returns the format type of the isoStr: 'local', 'zulu' or 'offset'.
 *
 * @param {string} isoStr isoString
 * @returns {'local'|'zulu'|'offset'} isoString format: 'local', 'zulu', or 'offset'
 * @throws Error
 * @export
 * @ignore
 * @since 11.0.0
 * @memberof oj.IntlConverterUtils
 * @method _getISOStrFormatType
 * @private
 */
IntlConverterUtils._getISOStrFormatType = function (isoStr) {
  return OraI18nUtils.getISOStrFormatType(isoStr);
};

/**
 * Checks that min and max and value are parseable isoStrings,
 * Logs a warning if value, min, max are not all iso strings.
 *
 * @throws {Error} if value, min, max are not all iso strings, or are not of the same type.
 * @param {string} value
 * @param {string} min
 * @param {string} max
 * @export
 * @ignore
 * @since 11.0.0
 * @memberof oj.IntlConverterUtils
 * @method _verifyValueMinMax
 * @private
 */
IntlConverterUtils._verifyValueMinMax = function (value, min, max) {
  // If value or min or max is not an iso string (say 'abc' or '2021/03/03'),
  // the datepicker renders, but you see an inline converter error meant only for an application
  // developer under the field, 'Please provide valid ISO 8601 string'.
  // This is inconsistent with other component attributes** that are not set to the correct type
  // ** e.g., set oj-input-number value='abc' and an error is thrown in the console.
  // In v11 we logged the warning and monitored FA tests for this warning. After six months or so
  // we saw no warnings and so now in v12 we will throw an error.

  Object.entries({ value, min, max }).forEach(([k, v]) => {
    if (v) {
      try {
        IntlConverterUtils._getISOStrFormatType(v);
      } catch (e) {
        // We weren't checking this in pre-v11.
        throw new Error(`${k} must be an iso string: ${e}`);
      }
    }
  });
};

/**
 * Returns the current date on the browser's local system in iso string format. E.g., '2021-10-13'
 * @return {str} isoStr
 * @export
 * @ignore
 * @since 12.0.0
 * @memberof oj.IntlConverterUtils
 * @method _getTodaysDateIsoStr
 * @private
 */
IntlConverterUtils._getTodaysDateIsoStr = function () {
  const now = new Date();
  const localDateIsoStr =
    OraI18nUtils.padZeros(now.getFullYear(), 4) +
    '-' +
    OraI18nUtils.padZeros(now.getMonth() + 1, 2) +
    '-' +
    OraI18nUtils.padZeros(now.getDate(), 2);
  return localDateIsoStr;
};

/**
 * Takes two iso strings and returns two iso strings that can be passed
 * into new Date() so they can be compared.
 * This function makes sure they are both in a date or date+time
 * format. new Date does not accept time only, like T00:00:00.
 * @param {string} isoStr1 first iso string
 * @param {string} isoStr2 second iso string
 * @returns {Array.<string>} an array with two iso strings that can be compared with Date.
 * @export
 * @ignore
 * @since 12.0.0
 * @memberof oj.IntlConverterUtils
 * @method _makeIsoDateStringsDateComparable
 * @private
 */
IntlConverterUtils._makeIsoDateStringsDateComparable = function (isoStr1, isoStr2) {
  const isoStr1TimeOnly = isoStr1.startsWith('T'); // e.g., T02:00:20
  const isoStr2TimeOnly = isoStr2.startsWith('T');
  const isoStr1ContainsDateOnly = !isoStr1.includes('T');
  const isoStr2ContainsDateOnly = !isoStr2.includes('T');
  let comparableIsoStr1 = isoStr1;
  let comparableIsoStr2 = isoStr2;

  // We may have time-only iso strings which new Date() does not like.
  // So check for that and convert.
  if (isoStr1TimeOnly || isoStr2TimeOnly) {
    const datePart = IntlConverterUtils._getTodaysDateIsoStr();
    if (isoStr1TimeOnly) {
      comparableIsoStr1 = datePart + isoStr1;
    }
    if (isoStr2TimeOnly) {
      comparableIsoStr2 = datePart + isoStr2;
    }
  }

  // at this point comparableIsoStrs will contain date-only or date+time.
  // if one has date-only, add a time piece.
  if (!(isoStr1ContainsDateOnly && isoStr2ContainsDateOnly)) {
    if (isoStr1ContainsDateOnly) {
      comparableIsoStr1 = `${isoStr1}T00:00:00`;
    }
    if (isoStr2ContainsDateOnly) {
      comparableIsoStr2 = `${isoStr2}T00:00:00`;
    }
  }
  return [comparableIsoStr1, comparableIsoStr2];
};

/**
 * Compares 2 ISO 8601 strings, returning the time difference between the two.
 * The two values MUST be valid iso strings, and in the same format:
 * local, zulu, or offset before calling this method.
 * They should be in the same date/time format like time only or date only, etc., when used
 * in JET's date/time components.
 * For backward compatibility we coerce to the same date/time if they are not.
 * This is an replacement for the deprecated IntlDateTimeConverter.compareISODates.
 * @param {string} isoStr1 first iso string
 * @param {string} isoStr2 second iso string
 * @return {number} the time difference between isoStr and isoStr2 in ms.
 * @export
 * @ignore
 * @since 12.0.0
 * @memberof oj.IntlConverterUtils
 * @method _compareISODates
 * @private
 */
IntlConverterUtils._compareISODates = function (isoStr1, isoStr2) {
  // Sometimes people use oj-input-date with min/max that contain date and time, which is not advised,
  // but is currently allowed. It should only accept dates, no time.
  // This method needs to handle if one of the strings is date only, and the other is date/time;
  // if one is time only and the other is datetime, etc.
  const comparableIsoStrings = IntlConverterUtils._makeIsoDateStringsDateComparable(
    isoStr1,
    isoStr2
  );

  return new Date(comparableIsoStrings[0]) - new Date(comparableIsoStrings[1]);
};

/**
 * Processes an converter option error and returns a oj.ConverterERror instance.
 * @param {string} errorCode
 * @param {Object} parameterMap
 * @return {Object} an ConverterError instance
 * @private
 * @memberof oj.IntlConverterUtils
 */
IntlConverterUtils.__getConverterOptionError = function (errorCode, parameterMap) {
  oj.Assert.assertObject(parameterMap);
  var summary = '';
  var detail = '';
  var propName = parameterMap.propertyName;
  var propValueValid;

  if (errorCode === 'optionTypesMismatch') {
    var reqPropName = parameterMap.requiredPropertyName;
    propValueValid = parameterMap.requiredPropertyValueValid;
    // Summary: A value for the property '{requiredPropertyName}' is required when the property
    // '{propertyName}' is set to '{propertyValue}'.
    summary = getTranslatedString('oj-converter.optionTypesMismatch.summary', {
      propertyName: propName,
      propertyValue: parameterMap.propertyValue,
      requiredPropertyName: reqPropName
    });

    detail = IntlConverterUtils._getOptionValueDetailMessage(reqPropName, propValueValid);
  } else if (errorCode === 'optionTypeInvalid') {
    // Summary: A value of the expected type was not provided for '{propertyName}'.
    propName = parameterMap.propertyName;
    propValueValid = parameterMap.propertyValueValid;
    summary = getTranslatedString('oj-converter.optionTypeInvalid.summary', {
      propertyName: propName
    });

    detail = IntlConverterUtils._getOptionValueDetailMessage(propName, propValueValid);
  } else if (errorCode === 'optionOutOfRange') {
    // The value {propertyValue} is out of range for the option '{propertyName}'.
    summary = getTranslatedString('oj-converter.optionOutOfRange.summary', {
      propertyName: propName,
      propertyValue: parameterMap.propertyValue
    });

    propValueValid = parameterMap.propertyValueValid;
    detail = IntlConverterUtils._getOptionValueDetailMessage(propName, propValueValid);
  } else if (errorCode === 'optionValueInvalid') {
    // An invalid value '{propertyValue}' was specified for the option '{propertyName}'..
    summary = getTranslatedString('oj-converter.optionValueInvalid.summary', {
      propertyName: propName,
      propertyValue: parameterMap.propertyValue
    });

    propValueValid = parameterMap.propertyValueHint;
    detail = IntlConverterUtils._getOptionValueDetailMessage(propName, propValueValid);
  }

  return new ConverterError(summary, detail);
};

/**
 * Returns a oj.ConverterERror instance.
 * @param {string} summary
 * @param {string} detail
 * @return {Object} an ConverterError instance
 * @private
 * @memberof oj.IntlConverterUtils
 */
IntlConverterUtils.__getConverterError = function (summary, detail) {
  return new ConverterError(summary, detail);
};

/**
 * Builds the detail message for possible converter option values. Only applicable when errorInfo is
 * returned from JET converter implementation.
 *
 * @param {string} propName name of the property
 * @param {Array|string} propValueValid valid value or values expected.
 *
 * @return {string} the localized message
 * @private
 * @memberof oj.IntlConverterUtils
 */
IntlConverterUtils._getOptionValueDetailMessage = function (propName, propValueValid) {
  // Detail: An accepted value for '{propertyName}' is '{propertyValueValid}'. or
  // Accepted values for '{propertyName}' are '{propertyValueValid}'.
  var resourceKey;

  if (propValueValid) {
    if (typeof propValueValid === 'string') {
      resourceKey = 'oj-converter.optionHint.detail';
    } else {
      // we have an array of values
      resourceKey = 'oj-converter.optionHint.detail-plural';
      // eslint-disable-next-line no-param-reassign
      propValueValid = propValueValid.join(
        getTranslatedString('oj-converter.plural-separator')
      );
    }
    return getTranslatedString(resourceKey, {
      propertyName: propName,
      propertyValueValid: propValueValid
    });
  }

  return '';
};

/**
 * Will return an updated toIsoString using the timePortion from the fromIsoString or from the default
 * oj.OraI18nUtils.DEFAULT_TIME_PORTION
 *
 * @private
 * @expose
 * @param {string} fromIsoString isoString that may not be a complete isoString
 * @param {string} toIsoString isoString that may not be a complete isoString
 * @returns {string} modified toIsoString with original date portion and the time portion from the fromIsoString
 * @since 1.1
 * @memberof oj.IntlConverterUtils
 * @method _copyTimeOver
 */
IntlConverterUtils._copyTimeOver = function (fromIsoString, toIsoString) {
  return OraI18nUtils._copyTimeOver(fromIsoString, toIsoString);
};

/**
 * Clears the time portion of the isoString
 *
 * @private
 * @expose
 * @param {string} isoString isoString that may not be a complete isoString
 * @returns {string} an updated isoString
 * @since 1.1
 * @memberof oj.IntlConverterUtils
 * @method _clearTime
 */
IntlConverterUtils._clearTime = function (isoString) {
  return OraI18nUtils._clearTime(isoString);
};

/**
 * Will accept an isoString and perform a get operation or a set operation depending on whether param is an Array
 * or a JSON
 *
 * The keys for the get and set operation are defined in OraI18nUtils's _DATE_TIME_KEYS.
 *
 * Note the handling of month starting with 0 in Date object and being 1 based in isoString will be handled by the function
 * with the usage of doParseValue. Meaning when you doParseValue and you are getting the value it will automatically
 * decrement the value and when you are setting the param it will check if the value is of number and if so will
 * increment it.
 *
 * @private
 * @expose
 * @param {string} isoString isoString that may not be a complete isoString
 * @param {Array|Object} actionParam if an Array will be a get operation, if a JSON will be a set operation
 * @param {boolean=} doParseValue whether one should parseInt the value during the get request
 * @returns {Object|string} an Object when a get operation and a string when a set operation
 * @since 1.1
 * @memberof oj.IntlConverterUtils
 * @method _dateTime
 */
IntlConverterUtils._dateTime = function (isoString, actionParam, doParseValue) {
  return OraI18nUtils._dateTime(isoString, actionParam, doParseValue);
};

/**
 * So the problem is Jet uses incomplete isoString which causes issues in different browsers.
 *
 * For instance for a new Date().toISOString() => 2015-02-02T18:00:37.007Z
 * ojInputDate stores 2015-02-02
 * ojInputTime stores T18:00:37.007Z
 *
 * yet constructing new Date(val) on above causes different results or errors in different browsers, so
 * this function is to normalize them. Note it is assumed that the point is creating the Date object from the
 * normalized isoString. Meaning if both contain only the time portion today's date will appended to it.
 *
 * @private
 * @expose
 * @param {string} isoString isoString that may not be a complete isoString
 * @returns {string} a normalized isoString
 * @since 1.1
 * @memberof oj.IntlConverterUtils
 * @method _normalizeIsoString
 */
IntlConverterUtils._normalizeIsoString = function (isoString) {
  return OraI18nUtils._normalizeIsoString(isoString);
};

/**
 * Returns a person's initials
 *
 * @param {string=} firstName first name
 * @param {string=} lastName last name
 * @returns {string|undefined} uppercase concatenation of first letter of first name and first letter
 * of last name.
 * There are the following special cases:
 * - If the name is Arabic characters, it returns empty string.
 * - If the name is Hindi characters, it returns the first letter of the first name.
 * - If the name is Thai characters, it returns the first letter of the first name.
 * - If the name is Korean characters, it returns the first name.
 * - If the name is Japanese or Chinese characters, it returns the last name.
 *
 * @export
 * @since 4.0.0
 * @memberof oj.IntlConverterUtils
 * @method getInitials
 */
IntlConverterUtils.getInitials = function (firstName, lastName) {
  return OraI18nUtils.getInitials(firstName, lastName);
};

export { IntlConverterUtils, OraI18nUtils };
