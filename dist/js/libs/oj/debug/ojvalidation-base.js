/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojL10n!ojtranslations/nls/localeElements', 'ojs/ojmessaging'], function(oj, $, ojld)
{
/*
** Copyright (c) 2008, 2013, Oracle and/or its affiliates. All rights reserved.
**
**34567890123456789012345678901234567890123456789012345678901234567890123456789
*/

/*global ojld:true*/

/**
 * @class Locale Data Services
 * @export
 * @since 0.6
 */
oj.LocaleData = {};

/**
 * Sets the Locale Elements bundle used by JET
 * If an AMD loader (such as Require.js) is not present, this method should be called by the application to provide
 * a Locale Elements for JET.
 * This method may also be used by an application that wants to completely replace the Locale Elements bundle that is automatically
 * fetched by an AMD loader.
 * @param {Object} bundle resource bundle that should be used by the framework
 * @export
 */
oj.LocaleData.setBundle = function(bundle)
{
  oj.LocaleData._bundle = bundle;
};

/**
 * Retrieves the first day of week for the current locale's region
 * @return {number} a numeric representation of the first week day of the week: 
 * 0 for Sunday, 1 for Monday, etc.
 * @export
 */
oj.LocaleData.getFirstDayOfWeek = function()
{
  return oj.LocaleData._getWeekData("firstDay");
};

/**
 * Retrieves the first weekend day for the current locale's region
 * @return {number} a numeric representation of the first weekend day: 
 * 0 for Sunday, 1 for Monday, etc.
 * @export
 */
oj.LocaleData.getWeekendStart = function()
{
  return oj.LocaleData._getWeekData("weekendStart");
};

/**
 * Retrieves the last weekend day for the current locale's region
 * @return {number} a numeric representation of the last weekend day: 
 * 0 for Sunday, 1 for Monday, etc.
 * @export
 */
oj.LocaleData.getWeekendEnd = function()
{
  return oj.LocaleData._getWeekData("weekendEnd");
};

/**
 * Retrieves locale-specific names of the days of the week
 * @return {Array.<string>} names of the days from Sunday through Sturday
 * @param {string} type - the type of the name. Currently, "abbreviated", "narrow" and "wide" are supported
 * @export
 */
oj.LocaleData.getDayNames = function(type)
{
  if (type== null || (type !== "abbreviated" && type !== "narrow"))
  {
    type = "wide";
  }
  var days = oj.LocaleData._getCalendarData()["days"]["stand-alone"][type];
  
  return [days["sun"], days["mon"], days["tue"], days["wed"], days["thu"],  days["fri"],  days["sat"]];
};

/**
 * Retrieves locale-specific names of months
 * @return {Array.<string>} names of months from January through December
 * @param {string} type - the type of the name. Currently, "abbreviated", "narrow" and "wide" are supported
 * @export
 */
oj.LocaleData.getMonthNames = function(type)
{
  if (type== null || (type !== "abbreviated" && type !== "narrow"))
  {
    type = "wide";
  }
  var months = oj.LocaleData._getCalendarData()["months"]["stand-alone"][type];
  
  return [months["1"], months["2"], months["3"], months["4"], months["5"], months["6"],
           months["7"], months["8"], months["9"], months["10"], months["11"], months["12"]];
};

/**
 * Retrieves whether month is displayed prior to year
 * @return {boolean} whether month is prior to year
 * @export
 */
oj.LocaleData.isMonthPriorToYear = function() 
{
  var longDateFormat = oj.LocaleData._getCalendarData()["dateFormats"]["long"].toUpperCase(),
      monthIndex = longDateFormat.indexOf("M"),
	  yearIndex = longDateFormat.indexOf("Y");
  
  return monthIndex < yearIndex;
}

/**
 * @hidden
 * @private
 */
oj.LocaleData._getWeekData = function(key)
{
  var b = oj.LocaleData.__getBundle();
  var defRegion = "001";
  var region = oj.LocaleData._getRegion() || defRegion;
  
  var data = b["supplemental"]["weekData"][key];
  
  var val = data[region];
  
  if (val === undefined)
  {
    val = data[defRegion];
  }
  
  return val;
};

/**
 * @hidden
 * @private
 */
oj.LocaleData._getCalendarData = function()
{
   var b = oj.LocaleData.__getBundle();
   var main  = b['main'];
   
   // skip one level (the name of the locale)
   var data, p;
   for (p in main)
   {
     if (main.hasOwnProperty(p)) {
        data = main[p];
        break;
     }
   }
   return data['dates']['calendars']['gregorian'];
};

/**
 * @hidden
 * @private
 */
oj.LocaleData._getRegion = function()
{
  var locale = oj.Config.getLocale();
  if (locale)
  {
    var tokens = locale.toUpperCase().split(/-|_/);
    if (tokens.length >= 2)
    {
      var tag = tokens[1];
      if (tag.length == 4) // this is a script tag
      {
        if (tokens.length >= 3)
        {
          return tokens[2];
        }
      }
      else
      {
        return tag;
      }
    }
  }
  return null;
};

/**
 * @hidden
 * @private
 */
oj.LocaleData.__getBundle = function()
{
  var b = oj.LocaleData._bundle;
  if (b)
  {
    return b;
  }
  
  if (oj.__isAmdLoaderPresent()) {
    oj.Assert.assert(ojld !== undefined, "LocaleElements module must be loaded");
    return ojld;
  }
  return {};
};

/**
 * Called from oj.Config after AMD loader fetches LocaleElements for the new locale.
 *
 * @hidden
 * @private
 * 
 */
oj.LocaleData.__updateBundle = function(bundle)
{
  ojld = bundle;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*
 DESCRIPTION
 oj.OraI18nUtils provides helper functions for converter objects.
 
 PRIVATE CLASSES
 <list of private classes defined - with one-line descriptions>
 
 NOTES
 <other useful comments, qualifications, etc.>
 
 MODIFIED    (MM/DD/YY)
        05/13/14 - Creation
 */


oj.OraI18nUtils = {};
//supported numbering systems
oj.OraI18nUtils.numeringSystems = {
  'latn': "\u0030\u0031\u0032\u0033\u0034\u0035\u0036\u0037\u0038\u0039",
  'arab': "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669",
  'thai': "\u0e50\u0e51\u0e52\u0e53\u0e54\u0e55\u0e56\u0e57\u0e58\u0e59"
};

oj.OraI18nUtils.regexTrim = /^\s+|\s+$|\u200f|\u200e/g;
oj.OraI18nUtils.regexTrimNumber = /\s+|\u200f|\u200e/g;
oj.OraI18nUtils.regexTrimRightZeros = /0+$/g;
oj.OraI18nUtils.zeros = ["0", "00", "000"];
//ISO 8601 string accepted values:
//date only: YYYY or YYYY-MM or YYYY-MM-dd or YYYYMM or YYYYMMdd
//time only without timezone: Thh:mm or Thh:mm:ss or Thh:mm:ss.SSS or Thhmm or Thhmmss or Thhmmss.SSS
//time only with timezone: any of the time values above followed by any of the following: Z or +/-hh:mm or extended timezone like @America/Los_Angeles
//date time: any of the date values followed by any of the time values
oj.OraI18nUtils._ISO_DATE_REGEXP = /^\d{4}(?:-?\d{2}(?:-?\d{2})?)?(?:T\d{2}:?\d{2}(?::?\d{2}(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?)?$|^T\d{2}:?\d{2}(?::?\d{2}(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?$/;

/**
 * Returns the timezone offset between UTC and the local time in Etc/GMT[+-]hh:mm syntax.
 * The offset is positive if the local timezone is behind UTC and negative if
 * it is ahead. The offset range is between Etc/GMT-14 and Etc/GMT+12 (UTC-12 and UTC+14)
 * Examples:
 * 1- The local time is UTC-7 (Pacific Daylight Time):
 * oj.OraI18nUtils. getLocalTimeZoneOffset() will return the string "Etc/GMT+07:00" 
 * 2- The local time is UTC+1 (Central European Standard Time):
 * oj.OraI18nUtils. getLocalTimeZoneOffset() will return the string "Etc/GMT-01:00"  
 * @returns {string}  
 */
oj.OraI18nUtils.getLocalTimeZoneOffset = function () {
  var d = new Date();
  var offset = d.getTimezoneOffset();
  return oj.OraI18nUtils.getTimeStringFromOffset("Etc/GMT", offset, false, false);
};


/*
 * Will return timezone if it exists.
 */
oj.OraI18nUtils._getTimeZone = function (isoString)
{
  if (!isoString || typeof isoString !== "string")
  {
    return null;
  }
  var match = oj.OraI18nUtils._ISO_DATE_REGEXP.exec(isoString);
  //make sure it is iso string
  if (match === null)
  {
    oj.OraI18nUtils._throwInvalidISOString(isoString);
  }
  if (match[1] !== undefined)
    return match[1];
  return null;
};

/*
 * Will return local isoString provided a date.
 */
oj.OraI18nUtils.dateToLocalIso = function (date)
{
  var isoStr = oj.OraI18nUtils.padZeros(date.getFullYear(), 4) + "-" + oj.OraI18nUtils.padZeros((date.getMonth() + 1), 2) + "-" + oj.OraI18nUtils.padZeros(date.getDate(), 2) + "T" +
      oj.OraI18nUtils.padZeros((date.getHours()), 2) + ":" + oj.OraI18nUtils.padZeros((date.getMinutes()), 2) + ":" +
      oj.OraI18nUtils.padZeros((date.getSeconds()), 2);
  if (date.getMilliseconds() > 0) {
    isoStr += "." + oj.OraI18nUtils.trimRightZeros(oj.OraI18nUtils.padZeros(date.getMilliseconds(), 3));
  }
  return isoStr;
};

oj.OraI18nUtils.partsToIsoString = function (parts)
{
  var isoStr = oj.OraI18nUtils.padZeros(parts[0], 4) + "-" + oj.OraI18nUtils.padZeros(parts[1], 2) + "-" + oj.OraI18nUtils.padZeros(parts[2], 2) + "T" +
      oj.OraI18nUtils.padZeros(parts[3], 2) + ":" + oj.OraI18nUtils.padZeros(parts[4], 2) + ":" + oj.OraI18nUtils.padZeros(parts[5], 2);
  if (parts[6] > 0) {
    isoStr += "." + oj.OraI18nUtils.trimRightZeros(oj.OraI18nUtils.padZeros(parts[6], 3));
  }
  return isoStr;
};

oj.OraI18nUtils.isoToLocalDate = function (isoString)
{
  if (!isoString || typeof isoString !== "string")
  {
    return null;
  }
  return this._isoToLocalDateIgnoreTimezone(isoString);
};

oj.OraI18nUtils._isoToLocalDateIgnoreTimezone = function (isoString) {
  var datetime = oj.OraI18nUtils._IsoStrParts(isoString);
  return new Date(datetime[0], datetime[1] - 1, datetime[2], datetime[3], datetime[4], datetime[5], datetime[6]);
};

oj.OraI18nUtils._IsoStrParts = function (isoString) {
  var splitted = isoString.split("T"),
      tIndex = isoString.indexOf("T"),
      today = new Date(), i,
      datetime = [today.getFullYear(), today.getMonth() + 1, today.getDate(), 0, 0, 0, 0];

  if (splitted[0] !== "")
  {
    //contains date portion
    var dateSplitted = splitted[0].split("-");
    for (i = 0; i < dateSplitted.length; i++) {
      datetime[i] = parseInt(dateSplitted[i], 10);
    }
  }

  if (tIndex !== -1) {
    var milliSecSplitted = splitted[1].split("."), //contain millseconds
        timeSplitted = milliSecSplitted[0].split(":"); //contain hours, minutes, seconds

    for (i = 0; i < timeSplitted.length; i++)
    {
      datetime[3 + i] = parseInt(timeSplitted[i], 10);
    }

    if (milliSecSplitted.length === 2 && milliSecSplitted[1])
    {
      datetime[6] = parseInt(oj.OraI18nUtils.zeroPad(milliSecSplitted[1], 3, false), 10);
    }
  }
  return datetime;
};

oj.OraI18nUtils.getISOStrFormatInfo = function (isoStr) {
  var res = {
    'format': null,
    'dateTime': null,
    'timeZone': "",
    'isoStrParts': null
  };
  var exe = oj.OraI18nUtils._ISO_DATE_REGEXP.exec(isoStr);
  if (exe === null) {
    oj.OraI18nUtils._throwInvalidISOString(isoStr);
  }
  if (exe[1] === undefined && exe[2] === undefined) {
    res['format'] = 'local';
    res['dateTime'] = isoStr;
    res['isoStrParts'] = oj.OraI18nUtils._IsoStrParts(res['dateTime']);
    return res;
  }
  res['timeZone'] = (exe[1] !== undefined) ? exe[1] : exe[2];
  if (res['timeZone'] === 'Z')
    res['format'] = 'zulu';
  else
    res['format'] = 'offset';
  res['dateTime'] = isoStr.substring(0, isoStr.indexOf(res['timeZone']));
  res['isoStrParts'] = oj.OraI18nUtils._IsoStrParts(res['dateTime']);
  return res;
};

oj.OraI18nUtils._throwTimeZoneNotSupported = function () {
  var msg, error, errorInfo;
  msg = "time zone is not supported";
  error = new Error(msg);
  errorInfo = {
    'errorCode': 'timeZoneNotSupported'
  };
  error['errorInfo'] = errorInfo;
  throw error;
};

oj.OraI18nUtils._throwInvalidISOString = function (str) {
  var msg, error, errorInfo;
  msg = "The string " + str + " is not a valid ISO 8601 string.";
  error = new Error(msg);
  errorInfo = {
    'errorCode': 'invalidISOString',
    'parameterMap': {
      'isoStr': str
    }
  };
  error['errorInfo'] = errorInfo;
  throw error;
};

oj.OraI18nUtils.trim = function (value) {
  return (value + "").replace(oj.OraI18nUtils.regexTrim, "");
};

oj.OraI18nUtils.trimRightZeros = function (value) {
  return (value + "").replace(oj.OraI18nUtils.regexTrimRightZeros, "");
};


oj.OraI18nUtils.trimNumber = function (value) {
  var s = (value + "").replace(oj.OraI18nUtils.regexTrimNumber, "");
  return s;
};

oj.OraI18nUtils.startsWith = function (value, pattern) {
  return value.indexOf(pattern) === 0;
};

oj.OraI18nUtils.toUpper = function (value) {
  // "he-IL" has non-breaking space in weekday names.
  return value.split("\u00A0").join(" ").toUpperCase();
};

oj.OraI18nUtils.padZeros = function (num, c) {
  var r, s = num + "";
  if (c > 1 && s.length < c) {
    r = (oj.OraI18nUtils.zeros[c - 2] + s);
    return r.substr(r.length - c, c);
  }
  else {
    r = s;
  }
  return r;
};

oj.OraI18nUtils.zeroPad = function (str, count, left) {
  str = "" + str;
  var l;
  for (l = str.length; l < count; l += 1) {
    str = (left ? ("0" + str) : (str + "0"));
  }
  return str;
};

oj.OraI18nUtils.getTimeStringFromOffset = function (prefix, offset, reverseSign, alwaysMinutes) {
  var isNegative = reverseSign ? offset >= 0 : offset < 0;
  offset = Math.abs(offset);
  var hours = (offset / 60) << 0;
  var minutes = offset % 60;
  var sign = isNegative ? "-" : "+";
  if (alwaysMinutes) {
    hours = oj.OraI18nUtils.zeroPad(hours, 2, true);
  }
  var str = prefix + sign + hours;
  if (minutes > 0 || alwaysMinutes) {
    str += ":" + oj.OraI18nUtils.zeroPad(minutes, 2, true);
  }
  return str;
};

//get the numbering system key from the locale's unicode extension.
//Verify that the locale data has a numbers entry for it, if not return latn as default.
oj.OraI18nUtils.getNumberingSystemKey = function (localeElements, locale) {
  if (locale === undefined)
    return 'latn';
  var numberingSystemKey = oj.OraI18nUtils.getNumberingExtension(locale);
  var symbols = "symbols-numberSystem-" + numberingSystemKey;
  if (localeElements['numbers'][symbols] === undefined)
    numberingSystemKey = 'latn';
  return numberingSystemKey;
};

//return the language part
oj.OraI18nUtils.getBCP47Lang = function (tag) {
  var arr = tag.split("-");
  return arr[0];
};

//return the region part. tag is lang or lang-region or lang-script or
//lang-script-region
oj.OraI18nUtils.getBCP47Region = function (tag) {
  var arr = tag.split("-");
  if (arr.length === 3)
    return arr[2];
  if (arr.length === 2) {
    if (arr[1].length === 2)
      return arr[1];
  }
  return '001';
};


//get the unicode numbering system extension.
oj.OraI18nUtils.getNumberingExtension = function (locale) {
  locale = locale || "en-US";
  var idx = locale.indexOf("-u-nu-");
  var numbering = 'latn';
  if (idx !== -1) {
    numbering = locale.substr(idx + 6, 4);
  }
  return numbering;
};

oj.OraI18nUtils.haveSamePropertiesLength = function (obj) {
  var count = 0;
  for (var n in obj)
  {
    count++;
  }
  return count;
};

//cldr locale data start with "main" node.
//return the subnode under main.
oj.OraI18nUtils.getLocaleElementsMainNode = function (bundle) {
  var mainNode = bundle['main'];
  var subnode;
  for (var n in mainNode)
  {
    subnode = n;
    break;
  }
  return mainNode[subnode];
};

//get the locale which is a subnode of "main".
oj.OraI18nUtils.getLocaleElementsMainNodeKey = function (bundle) {
  var mainNode = bundle['main'];
  var subnode;
  for (var n in mainNode)
  {
    subnode = n;
    break;
  }
  return subnode;
};

oj.OraI18nUtils._toBoolean = function (value) {
  if (typeof value === "string") {
    var s = value.toLowerCase().trim();
    switch (s) {
      case "true":
      case "1":
        return true;
      case "false":
      case "0":
        return false;
      default:
        return value;
    }
  }
  return value;
};
//Return a function getOption.
//The getOption function extracts the value of the property named 
//property from the provided options object, converts it to the required type,
// checks whether it is one of a List of allowed values, and fills in a 
// fallback value if necessary.
oj.OraI18nUtils.getGetOption = function (options, getOptionCaller) {
  if (options === undefined) {
    throw new Error('Internal ' + getOptionCaller +
        ' error. Default options missing.');
  }

  var getOption = function getOption(property, type, values, defaultValue) {
    if (options[property] !== undefined) {
      var value = options[property];
      switch (type) {
        case 'boolean':
          value = oj.OraI18nUtils._toBoolean(value);
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
        var msg = "The value '" + options[property] +
            "' is out of range for '" + getOptionCaller +
            "' options property '" + property + "'. Valid values: " +
            expectedValues;
        var rangeError = new RangeError(msg);
        var errorInfo = {
          'errorCode': 'optionOutOfRange',
          'parameterMap': {
            'propertyName': property,
            'propertyValue': options[property],
            'propertyValueValid': expectedValues,
            'caller': getOptionCaller
          }
        };
        rangeError['errorInfo'] = errorInfo;
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
oj.OraI18nUtils.matchString = function (str, pat, locale, options) {
  if (options === undefined) {
    options = {sensitivity: 'base', usage: 'sort'};
  }
  var getOption = oj.OraI18nUtils.getGetOption(options, "oj.OraI18nUtils.matchString");
  options['usage'] = getOption('usage', 'string', ['sort', 'search'], 'sort');
  options['sensitivity'] = getOption('sensitivity', 'string', ['base', 'accent', 'case', 'variant'], 'base');
  var i, j;
  var len = str.length;
  var patLen = pat.length - 1;
  for (i = 0; i < len; i++) {
    for (j = 0; j < 3; j++) {
      var len2 = len - i;
      len2 = Math.min(len2, patLen + j);
      var str2 = str.substr(i, len2);
      var res = str2.localeCompare(pat, locale, options);
      if (res === 0) {
        var end = i + len2 - 1;
        var ret = [i, end];
        return ret;
      }
    }
  }
  return null;
};

var _DEFAULT_TIME_PORTION = "T00:00:00.000";
var _DATE_TIME_KEYS = {"fullYear": {pos: 0, pad: 4}, "month": {pos: 1, pad: 2}, "date": {pos: 2, pad: 2},
  "hours": {pos: 3, pad: 2}, "minutes": {pos: 4, pad: 2}, "seconds": {pos: 5, pad: 2},
  "milliseconds": {pos: 6, pad: 3}, "timeZone": {pos: 7}};

/**
 * Parses the isoString and returns a JavaScript Date object
 * 
 * @param {string} isoString isoString to parse and to return Date of
 * @return {Date} the parsed JavaScript Date Object
 */
oj.OraI18nUtils.isoToDate = function (isoString)
{
  //note new Date w/ isoString in IE fails so need to use parsing from momentjs support
  return new Date(this._normalizeIsoString(isoString));
};

/**
 * Will return an updated toIsoString using the timePortion from the fromIsoString or from the default 
 * oj.OraI18nUtils.DEFAULT_TIME_PORTION
 * 
 * @private
 * @param {string} fromIsoString isoString that may not be a complete isoString
 * @param {string} toIsoString isoString that may not be a complete isoString
 * @returns {string} modified toIsoString with original date portion and the time portion from the fromIsoString
 * @since 1.1
 */
oj.OraI18nUtils._copyTimeOver = function (fromIsoString, toIsoString)
{
  if (!fromIsoString || !toIsoString)
  {
    throw new Error("Provided invalid arguments");
  }

  //need to only normalize toIsoString, since copying only time from fromIsoString
  toIsoString = this._normalizeIsoString(toIsoString);

  var fromTimeIndex = fromIsoString.indexOf("T"),
      toTimeIndex = toIsoString.indexOf("T"),
      toDatePortion = toIsoString.substring(0, toTimeIndex),
      fromTimePortion = fromTimeIndex !== -1 ? fromIsoString.substring(fromTimeIndex) : _DEFAULT_TIME_PORTION;

  return toDatePortion + fromTimePortion;
};

/**
 * Clears the time portion of the isoString
 * 
 * @private
 * @param {string} isoString isoString that may not be a complete isoString
 * @returns {string} an updated isoString
 * @since 1.1
 */
oj.OraI18nUtils._clearTime = function (isoString)
{
  return this._dateTime(isoString, {"hours": 0, "minutes": 0, "seconds": 0, "milliseconds": 0});
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
 */
oj.OraI18nUtils._dateTime = function (isoString, actionParam, doParseValue)
{
  if (!isoString || !actionParam)
  {
    throw new Error("Invalid argument invocation");
  }

  var pos, value, dtKey,
      retVal = null,
      key = null,
      dateTimeKeys = _DATE_TIME_KEYS,
      oraUtilsPadZero = this.padZeros,
      isoStringNormalized = this._normalizeIsoString(isoString), //note intentionally normalizing 
      captured = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):?(\d{2})?\.?(\d{3})?(.*)?/.exec(isoStringNormalized);

  if (!captured)
  {
    throw new Error("Unable to capture anything");
  }

  captured = captured.slice(1);

  if (Array.isArray(actionParam))
  {
    retVal = {};

    //means an array so perform a get operation
    for (var i = 0, len = actionParam.length; i < len; i++)
    {
      key = actionParam[i];

      if (key in dateTimeKeys)
      {
        pos = dateTimeKeys[key].pos;
        value = captured[pos];

        if (doParseValue && "timeZone" === key)
        {
          throw new Error("Dude you tried to ask timezone to be parsed");
        }

        if (doParseValue)
        {
          var parsed = parseInt(value, 10);
          retVal[key] = pos === 1 ? parsed - 1 : parsed; //since month is 0 based, though about having a callback but month only special
        }
        else
        {
          retVal[key] = value;
        }

      }
    }
  }
  else if ($.isPlainObject(actionParam))
  {

    for (var keys in actionParam)
    {
      dtKey = dateTimeKeys[keys];
      pos = dtKey.pos;
      value = actionParam[keys];

      //special case for month again, 0 based so check if number and if so increment it
      if (pos === 1 && typeof value === "number")
      {
        value++;
      }
      captured[pos] = dtKey.pad ? oraUtilsPadZero(value, dtKey.pad) : value;
    }
    //"2015-02-02T21:12:30.255Z"
    retVal = captured[0] + "-" + captured[1] + "-" + captured[2] + "T" + captured[3] + ":" + captured[4] + ":" + captured[5] +
        (captured.length > 6 && captured[6] ? ("." + captured[6] + (captured.length === 8 && captured[7] ? captured[7] : "")) : "");
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
 */
oj.OraI18nUtils._normalizeIsoString = function (isoString)
{
  if (!isoString)
  {
    throw new Error("Provided invalid arguments");
  }

  var checkTime = function (timeValue)
  {
    var splitted = timeValue.split(":");
    if (splitted.length > 1)
    {
      return timeValue;
    }
    //need at least hour + minute for proper parsing on browser except IE
    return timeValue + ":00";
  },
      todayIsoString = new Date().toISOString(),
      todayDatePortion = todayIsoString.substring(0, todayIsoString.indexOf("T")),
      timeIndex = isoString.indexOf("T"),
      datePortion = timeIndex === -1 ? isoString : isoString.substring(0, timeIndex),
      timePortion = timeIndex !== -1 ? checkTime(isoString.substring(timeIndex)) : _DEFAULT_TIME_PORTION;

  datePortion = datePortion || todayDatePortion;

  return datePortion + timePortion;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * The ojvalidation module.
 * @name oj.Validation
 * @class 
 * @export
 * @since 0.6
 * 
 */
oj.Validation = {};

/**
 * Internal properties to hold all factory provider callbacks or instances by name
 * @private
 */
oj.Validation._converterFactories = {}; oj.Validation._validatorFactories = {};

/**
 * Internal properties to hold the default factory instances.
 * @private
 */
oj.Validation._defaultConverterFactories = {}; oj.Validation._defaultValidatorFactories = {};

/**
 * Internal property that identifies the type that is the contract for conveters and validators.
 * @private
 */
oj.Validation._CONTRACTS = {'converter' : {name: "oj.ConverterFactory",  type: oj.ConverterFactory},
                            'validator': {name: "oj.ValidatorFactory", type: oj.ValidatorFactory}};

/**
 * Module method to register and retrieve converter factory instances by name. 
 * When passed only the name, an existing factory (registered for the name) is returned. Callers can 
 * expect to get back the default 'number' and 'datetime' converters. 
 * When passed two arguments, a new factory for the name is registered. If the name already exists 
 * the new instance replaces the old one. 
 * 
 * @param {string} type a case insensitive name of the converter factory. 
 * @param {Object=} instance the instance of the factory that implements the contract for 
 * oj.ConverterFactory.
 * 
 * @export
 * @see oj.ConverterFactory
 */
oj.Validation.converterFactory = function (type, instance)
{
  var retValue;
  if (type && !instance)
  {
    // getter
    retValue = oj.Validation._getFactory(type, oj.Validation._converterFactories);
  }
  else if (type && instance)
  {
    // setter
    retValue = oj.Validation._registerFactory(type, 
                                              instance, 
                                              oj.Validation._converterFactories,
                                              oj.Validation._CONTRACTS['converter']);
  }
  
  return retValue;
};

/**
 * Module method to register and retrieve validator factory instances by name. 
 * When passed only the name, an existing factory (registered for the name) is returned. 
 * When passed two arguments, a new factory for the name is registered. If the name already exists 
 * the new instance replaces the old one. 
 * 
 * @param {string} type a case insensitive name of the validator factory. 
 * @param {Object=} instance the instance of the factory that implements the contract for 
 * oj.ValidatorFactory.
 * 
 * @export
 * @see oj.ValidatorFactory
 */
oj.Validation.validatorFactory = function (type, instance)
{
  var retValue;
  if (type && !instance)
  {
    // getter
    retValue = oj.Validation._getFactory(type, oj.Validation._validatorFactories);
  }
  else if (type && instance)
  {
    // setter
    retValue = oj.Validation._registerFactory(type, 
                                              instance, 
                                              oj.Validation._validatorFactories, 
                                              oj.Validation._CONTRACTS['validator']);
  }
  
  return retValue;
};

/**
 * Returns the default converter factory instances for the supported types as defined by the 
 * oj.ConverterFactory.
 * 
 * @param {string} type The default converter factory for the type. Supported types are 'number' and 
 * 'datetime'
 * @return {Object} an instance of oj.ConverterFactory or null if an unknown type is requested.
 * 
 * @export
 * @see oj.ConverterFactory
 * 
 */
oj.Validation.getDefaultConverterFactory = function (type)
{
  return oj.Validation._getFactory(type, oj.Validation._defaultConverterFactories);
};

/**
 * Returns the default validator factory instance for the requested types as defined by the 
 * oj.ValidatorFactory.
 * 
 * @param {string} type The default converter factory for the type. Supported types are 'number' and 
 * 'datetime'
 * @return {Object} an instance of oj.ConverterFactory or null if an unknown type is requested.
 * 
 * @export
 * @see oj.ValidatorFactory
 */
oj.Validation.getDefaultValidatorFactory = function (type)
{
  return oj.Validation._getFactory(type, oj.Validation._defaultValidatorFactories);
};

// PACKAGE PRIVATE METHODS
/**
 * Called only by internal jet converter factory implementations.
 * 
 * @param {string} name
 * @param {Object} instance
 * @private
 */
oj.Validation.__registerDefaultConverterFactory = function (name, instance)
{
  // save to both factories
  var contractDef = oj.Validation._CONTRACTS['converter'];
  oj.Validation._registerFactory (name, instance, oj.Validation._defaultConverterFactories, contractDef);
  oj.Validation._registerFactory(name, instance, oj.Validation._converterFactories, contractDef);
};

/**
 * Called only by internal jet validator factory implementations.
 * 
 * @param {string} name of the validator factory
 * @param {Object} instance of the validator factory that creates instances of the validator
 * @private
 */
oj.Validation.__registerDefaultValidatorFactory = function (name, instance)
{
  // save to both factories
  var contractDef = oj.Validation._CONTRACTS['validator'];
  oj.Validation._registerFactory (name, instance, oj.Validation._defaultValidatorFactories, contractDef);
  oj.Validation._registerFactory(name, instance, oj.Validation._validatorFactories, contractDef);
};


/**
 * Checks that the instance implements the interface type. If it doesn't it throws an error.
 * @param {Object} instance
 * @param {Object} type
 * @param {string} typeName 
 * @throws {Error} if instance does not implement the methods defined on type.  
 * @private
 */
oj.Validation._doImplementsCheck = function (instance, type, typeName)
{
  if (type)
  {
    // Check that instance duck types providerType
    if (!oj.Validation._quacksLike(instance, type))
    {
      throw new Error("Factory instance does not implement the methods expected by the factory of type " + typeName);
    }
  }
};

/**
 * Retrieves the converter factory by name from the provided factories.
 * @private
 */
oj.Validation._getFactory = function(name, factories)
{
  oj.Assert.assertString(name);
  var cachedInstance = null;
  
  if (name)
  {
    name = name.toLowerCase();

    // getter called to retrieve the factory instance 
    var providerProps = factories[name] || {}; 
    cachedInstance = providerProps['instance'] || null;
  }
  // TODO: log a warning that name is null
  return cachedInstance;
};

/**
 * Tests whether an object 'quacks like a duck'. Returns `true` if the thingie has all of the 
 * methods of the second, parameter 'duck'. Returns `false` otherwise. 
 *
 * @param {Object} thingie the object to test.
 * @param {Object} duck The archetypal object, or 'duck', that the test is against.
 * @private
*/
oj.Validation._quacksLike = function(thingie, duck) 
{
  var valid = true, property;

  oj.Assert.assertObject(thingie);
  oj.Assert.assertObject(duck);

  for (property in duck) 
  {
    // Ensure that thingie defines the same functions as duck. We don't care about other properties
    if (duck.hasOwnProperty(property)) 
    {
      if (typeof duck[property] === "function" && 
              !thingie[property] && typeof thingie[property] !== "function") 
      {
        valid = false;
        break;
      }
    }
  }
  
  return valid;
};

/**
 * Registers the factory instance by the name, storing it into the factories object, after ensuring 
 * that the instance duck types the specified contract.
 * 
 * @private
 */
oj.Validation._registerFactory = function(name, instance, factories, contractDef)
{
  oj.Assert.assertString(name);
  oj.Assert.assertObject(instance);

  if (name)
  {
    // set new provider factory function clearing out the previously stored instance
    var props = {};
    props['instance'] = instance;
    oj.Validation._doImplementsCheck(instance, contractDef.type, contractDef.name);

    // Save to default and public factories
    factories[name.toLowerCase()] = props;
  }
};

/**
 * Contract for a ConverterFactory that provides a factory method to create a converter instance for 
 * the requested type. JET provides two factory implementations for number and datetime types that 
 * implement this contract. Customers can register custom converter factories for the supported 
 * types or create and register factories for new types altogether.
 * 
 * @name oj.ConverterFactory
 * @abstract
 * @class
 * @export
 * @see oj.Validation
 * @see oj.NumberConverterFactory
 * @see oj.DateTimeConverterFactory
 */
oj.ConverterFactory = 
{
  /**
   * Default type for a factory used to create number converters. This type is passed to the 
   * [Validation.converterFactory]{@link oj.Validation#converterFactory} method to retrieve the 
   * number converter factory of type {@link oj.NumberConverterFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "CONVERTER_TYPE_NUMBER" : 'number',
  
  /**
   * Default type for a factory used to create datetime converters. This type is passed to the 
   * [Validation.converterFactory]{@link oj.Validation#converterFactory} method to retrieve the 
   * datetime converter factory of type {@link oj.DateTimeConverterFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "CONVERTER_TYPE_DATETIME" : 'datetime',
  
  /**
   * Default type for a factory used to create color converters. This type is passed to the 
   * [Validation.converterFactory]{@link oj.Validation#converterFactory} method to retrieve the 
   * color converter factory of type {@link oj.ColorConverterFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "CONVERTER_TYPE_COLOR" : 'color',
  
  /**
   * Creates an immutable converter instance of the type the factory implements. 
   * 
   * @param {(Object|null)} options an object literal containing properties required by the converter 
   * for its initialization. The properties provided in the options is implementation specific.
   * 
   * @return {Object} a converter instance.
   * @throws {TypeError} if an unrecognized type was provided 
   * @expose
   * 
   * @example <caption>Create a JET dateTime converter with options</caption>
   * var dateTimeCvtr = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
   * var dateOptions = {day: 'numeric', month: 'numeric'};
   * var dayMonthConverter = dateTimeCvtr.createConverter(dateOptions);
   */
  createConverter : function(options) {}  
};

/**
 * Contract for a ValidatorFactory that provides a factory method to create a validator instance for 
 * the requested type. JET provides several factory implementations that implement this contract - 
 * for example dateRestriction, dateTimeRange, numberRange, length, required, regexp. Customers can 
 * register custom validator factories for the supported types or create and register factories for 
 * new types altogether.
 * 
 * @name oj.ValidatorFactory
 * @abstract
 * @class
 * @export
 * @see oj.Validation
 * @see oj.DateRestrictionValidatorFactory
 * @see oj.DateTimeRangeValidatorFactory
 * @see oj.LengthValidatorFactory
 * @see oj.NumberRangeValidatorFactory
 * @see oj.RegExpValidatorFactory
 * @see oj.RequiredValidatorFactory
 */
oj.ValidatorFactory = 
{
  /**
   * Default type for a factory used to create required validators. This type is passed to the 
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * required validator factory of type {@link oj.RequiredValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_REQUIRED" : 'required',
          
  /**
   * Default type for a factory used to create regExp validators. This type is passed to the 
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * regExp validator factory of type {@link oj.RegExpValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_REGEXP" : 'regexp',

  /**
   * Default type for a factory used to create numberRange validators. This type is passed to the 
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * numberRange validator factory of type {@link oj.NumberRangeValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_NUMBERRANGE" : 'numberRange',

  /**
   * Default type for a factory used to create length validators. This type is passed to the 
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * length validator factory of type {@link oj.LengthValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_LENGTH" : 'length',

  /**
   * Default type for a factory used to create required validators. This type is passed to the 
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * dateTimeRange validator factory of type {@link oj.DateTimeRangeValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_DATETIMERANGE" : 'dateTimeRange',
  
  /**
   * Default type for a factory used to create date restriction validators. This type is passed to 
   * the [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * dateRestriction validator factory of type {@link oj.DateRestrictionValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_DATERESTRICTION" : 'dateRestriction',
          
  /**
   * Creates an immutable validator instance of the type the factory implements. 
   * 
   * @param {(Object|null)} options an object literal containing properties required by the validator 
   * for its initialization. The properties provided in the options is implementation specific.
   * 
   * @return {Object} a validator instance.
   * @throws {TypeError} if an unrecognized type was provided 
   * @expose
   */
  createValidator : function(options) {}  
};

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Converter Contract
 */

/**
 * Constructs an immutable instance of Converter.
 * 
 * @param {Object=} options an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @export
 * @constructor
 * @since 0.6
 */
oj.Converter = function(options)
{
  this.Init(options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.Converter, oj.Object, "oj.Converter");


/**
 * Initializes converter instance with the set options
 * @param {Object=} options an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @export
 */
oj.Converter.prototype.Init = function(options) 
{
  oj.Converter.superclass.Init.call(this);
  // should we make options truly immutable? non-configurable, non-enumerable, non-writable
  // Object.defineProperty(oj.Converter.prototype, "_options", {value: options});
  this._options = options;
};


/**
 * Returns a hint that describes the converter format expected.
 * @method getHint
 * @return {String|null} a hint describing the format the value is expected to be in.
 * @memberof oj.Converter
 * @instance
 */

/**
 * Returns the options called with converter initialization.
 * @return {Object} an object of options.
 * @export
 */
oj.Converter.prototype.getOptions = function () 
{
  return (this._options || {});
};


/**
 * Parses a String value using the options provided. 
 * @method parse
 * @param {String} value to parse
 * @return {(Number|Date)} the parsed value. 
 * @throws {Error} if parsing fails
 * @memberof oj.Converter
 * @instance
 */

/**
 * Formats the value using the options provided. 
 * 
 * @param {(Number|Date)} value the value to be formatted for display
 * @return {(String|null)} the localized and formatted value suitable for display
 * @throws {Error} if formatting fails.
 * @method format
 * @memberof oj.Converter
 * @instance
 */

/**
 * Returns an object literal with locale and formatting options computed during initialization of 
 * the object. If options was not provided at the time of initialization, the properties will be 
 * derived from the locale defaults.
 * @return {Object} an object of resolved options.
 * @export
 */
oj.Converter.prototype.resolvedOptions = function ()
{
  var resolved = {};
  // returns a clone of this._options
  $.extend(resolved, this._options);
  
  return resolved;
};


// oj.ConverterError

/**
 * Constructs a ConverterError instance from a summary and detail 
 * 
 * @param {string} summary a localized String that provides a summary of the error
 * @param {string} detail a localized String that provides a detail of the error
 * @constructor
 * @export
 */
oj.ConverterError = function (summary, detail)
{
  var message = new oj.Message(summary, detail, oj.Message.SEVERITY_LEVEL['ERROR']);
  this.Init(message); 
};

oj.ConverterError.prototype = new Error();

/**
 * Initializes the instance. 
 * @param {Object} message instance of oj.Message
 * @export
 */
oj.ConverterError.prototype.Init = function (message)
{
  var detail = message['detail'], summary = message['summary'];
  this._message = message;

  // so browser can get to e.name and e.message 
  this.name = 'Converter Error';
  this.message = detail || summary;
};

/**
 * Returns an instance of oj.Message.
 * 
 * @return {Object} instance of oj.Message
 * @export
 */
oj.ConverterError.prototype.getMessage = function ()
{
  return this._message;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Validator Contract
 */

/**
 * @constructor
 * @export
 * @since 0.6
 * 
 */
oj.Validator = function()
{
  this.Init();
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.Validator, oj.Object, "oj.Validator");

/**
 * Initializes validator instance with the set options
 * @export
 */
oj.Validator.prototype.Init = function() 
{
  oj.Validator.superclass.Init.call(this);
};


/**
 * Vaidates the value.
 * 
 * @param {Object} value to be validated
 * @return {*} a boolean true if validation passes.
 * @throws Error if validation fails
 * @method validate
 * @memberof oj.Validator
 * @instance
 */


/**
 * Returns a hint that describes the validator rule.
 * @returns {*} a hint string or null
 * @method getHint
 * @memberof oj.Validator
 * @instance
 */

// ValidatorError

/**
 * Constructs a ValidatorError instance from a summary and detail 
 * 
 * @param {string} summary a localized String that provides a summary of the error
 * @param {string} detail a localized String that provides a detail of the error
 * @constructor
 * @export
 */
oj.ValidatorError = function (summary, detail)
{
  var message = new oj.Message(summary, 
                               detail, 
                               oj.Message.SEVERITY_LEVEL['ERROR']);
  this.Init(message); 
};

oj.ValidatorError.prototype = new Error();

/**
 * Initializes the instance. 
 * @param {Object} message an instance of oj.Message
 * @export
 */
oj.ValidatorError.prototype.Init = function (message)
{
  var detail = message['detail'], summary = message['summary'];
  this._message = message;

  // so browser can get to e.name and e.message 
  this.name = 'Validator Error';
  this.message = detail || summary;
};

/**
 * Returns an instance of oj.Message.
 * 
 * @returns {Object} instance of oj.Message
 * @export
 */
oj.ValidatorError.prototype.getMessage = function ()
{
  return this._message;
};
/**
 * Copyright (c) 2008, 2013, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Constructs a RequiredValidator that ensures that the value provided is not empty
 * @param {Object=} options an object literal used to provide an optional hint and error message.<p>
 * @param {string=} options.hint an optional hint text. There is no default hint provided by this 
 * validator.
 * @param {string=} options.messageSummary - an optional custom error message summarizing the 
 * error. When not present, the default message summary is the resource defined with the key 
 * <code class="prettyprint">oj-validator.required.summary</code>.<p>
 * <p>The messageSummary string is passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p>
 * Tokens: {label} - this token can be used to substitute the label of the component at runtime. </p>
 * <p>
 * Example:<br/>
 * "'{label}' Required"<br/>
 * </p>
 * @param {string=} options.messageDetail - a custom error message used for creating detail part 
 * of message, when the value provided is empty. When not present, the default message detail is the 
 * resource defined with the key <code class="prettyprint">oj-validator.required.detail</code>.
 * <p>The messageDetail string is passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p>
 * <p>Tokens: {label} - this token can be used to substitute the label of the component at runtime.</p>
 * <p>
 * Example:<br/>
 * "A value is required for the field '{label}'."<br/>
 * </p>
 * 
 * @export
 * @constructor
 * @since 0.6
 * 
 */
oj.RequiredValidator = function (options)
{
  this.Init(options);
};

// Subclass from oj.Object or oj.Validator. It does not matter
oj.Object.createSubclass(oj.RequiredValidator, oj.Validator, "oj.RequiredValidator");

// key to access required validator specific resources in the bundle 
oj.RequiredValidator._BUNDLE_KEY_DETAIL = "oj-validator.required.detail";
oj.RequiredValidator._BUNDLE_KEY_SUMMARY = "oj-validator.required.summary";

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @memberof oj.RequiredValidator
 * @instance
 */
oj.RequiredValidator.prototype.Init = function (options)
{
  oj.RequiredValidator.superclass.Init.call(this);
  this._options = options;
};

/**
 * Validates value to be non-empty
 * 
 * @param {Object|string|number} value that is being validated 
 * @returns {boolean} true if validation was was successful the value is non-empty
 * 
 * @throws {Error} when fails required-ness check
 * @memberof oj.RequiredValidator
 * @instance
 * @export
 */
oj.RequiredValidator.prototype.validate = function (value)
{
  var detail;
  var label = "";
  var localizedDetail;
  var localizedSummary;
  var summary;
  var params = {};

  // checks for empty arrays and String. Objects are considered non-null.
  // Need to specifically test for if value is 0 first if number is passed on.
  if ((typeof value === "number" && value === 0) || (value && value.length !== 0))
  {
    return true;
  }
  else
  {
    if (this._options)
    {
      // we have deprecated support for message param and instead use messageDetail.
      detail = this._options['messageDetail'] || this._options['message'] || null;
      summary = this._options['messageSummary'] || null;
      label = this._options['label'] || "";
    }
    params = {'label': label};
    localizedSummary = (summary) ? oj.Translations.applyParameters(summary, params) :
    oj.Translations.getTranslatedString(this._getSummaryKey(), params);
    localizedDetail = (detail) ?
    oj.Translations.applyParameters(detail, params) :
    oj.Translations.getTranslatedString(this._getDetailKey(), params);

    throw new oj.ValidatorError(localizedSummary, localizedDetail);
  }

};

/**
 * A message to be used as hint, when giving a hint on the expected pattern. There is no default 
 * hint for this property.
 * 
 * @returns {String|string|null} a hint message or null if no hint is available in the options
 * @memberof oj.RequiredValidator
 * @instance
 * @export
 */
oj.RequiredValidator.prototype.getHint = function ()
{
  var hint = "";
  if (this._options && (this._options['hint']))
  {
    hint = oj.Translations.getTranslatedString(this._options['hint']);
  }

  return hint;
};

oj.RequiredValidator.prototype._getSummaryKey = function ()
{
  return oj.RequiredValidator._BUNDLE_KEY_SUMMARY;
};

oj.RequiredValidator.prototype._getDetailKey = function ()
{
  return oj.RequiredValidator._BUNDLE_KEY_DETAIL;
};
/**
 * Copyright (c) 2016, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * oj.ColorConverter Contract. 
 */


(function ()
{

  /**
   * @export
   * @constructor
   * @augments oj.Converter 
   * @name oj.ColorConverter
   
   * @classdesc An {@link oj.Color} object format converter.
   * @desc Creates a Converter that allows any color format to be obtained from an {@link oj.Color} object.
   * @since 0.6
   * @property {Object=} options - an object literal used to provide optional information to 
   * initialize the converter.
   * @property {string=} options.format - sets the format of the converted color specification.
   * Allowed values are "rgb" (the default, if omitted), "hsl", "hsv" "hex", and "hex3". "hex" returns six
   * hex digits ('#rrggbb'), and "hex3" returns three hex digits if possible ('#rgb') or six hex
   * digits if the value cannot be converted to three.
   * @example <caption>Create a color converter to convert an rgb specification to hsl format</caption>
   * var cvFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_COLOR);
   * var cv        = cv.createConverter({format: "hsl");
   * var color     = new oj.Color("rgb(30, 87, 236)") ;
   * var hsl       = cv.format(color);   -->  "hsl(223, 84%, 52%)"
   * 
   */
  oj.ColorConverter = function (options)
  {
    this.Init(options);
  };

// Subclass from oj.Converter 
  oj.Object.createSubclass(oj.ColorConverter, oj.Converter, "oj.ColorConverter");

  /**
   * Initializes the color converter instance with the set options.
   * @param {Object=} options an object literal used to provide an optional information to 
   * initialize the converter.<p>
   * @export
   */
  oj.ColorConverter.prototype.Init = function (options)
  {
    options = options || {};
    options["format"] = options["format"] || "rgb";
    oj.ColorConverter.superclass.Init.call(this, options);
  };

  /**
   * Formats the color using the options provided into a string.
   * 
   * @param {oj.Color} color the {@link oj.Color} instance to be formatted to a color specification string
   * @return {(string | null)} the color value formatted to the color specification defined in the options.
   * @throws {Error} a ConverterError if formatting fails, or the color option is invalid.
   * @export
   */
  oj.ColorConverter.prototype.format = function (color)
  {
    var fmt = this._getFormat(),
    ret = null;

    if (fmt === "rgb")
    {
      ret = color.toString();
    }
    else if (fmt === "hsl")
    {
      ret = _toHslString(color);
    }
    else if (fmt === "hex")
    {
      ret = _toHexString(color);
    }
    else if (fmt === "hex3")
    {
      ret = _toHexString(color, true);
    }
    else if (fmt === "hsv")
    {
      ret = _toHsvString(color);
    }
    else
    {
      _throwInvalidColorFormatOption();
    }

    return ret ? ret : oj.ColorConverter.superclass.format.call(this, color);
  };


  /**
   * Parses a CSS3 color specification string and returns an oj.Color object.</br>
   * (Note that the "format" option used to create the Converter is not used
   * by this method, since the oj.Color object created is color agnostic.)
   * @param {string} value The color specification string to parse.
   * @return {oj.Color} the parsed value as an {@link oj.Color} object.
   * @throws {Error} a ConverterError if parsing fails
   * @export
   */
  oj.ColorConverter.prototype.parse = function (value)
  {
    try
    {
      return  new oj.Color(value);   //throws error if invalid
    }
    catch (e)
    {
      _throwInvalidColorSyntax();
    }
  };


  /**
   * Returns a hint that describes the color converter format.
   * @return {string} The expected format of a converted color.
   * @export
   */
  oj.ColorConverter.prototype.getHint = function ()
  {
    return this._getFormat();
  };


  /**
   * Returns an object literal with properties reflecting the color formatting options computed based 
   * on the options parameter.
   * 
   * @return {Object} An object literal containing the resolved values for the following options.
   * <ul>
   * <li><b>format</b>: A string value with the format of the color specification.
   * for formatting.</li>
   * </ul>
   * @export
   */
  oj.ColorConverter.prototype.resolvedOptions = function ()
  {
    return {
      "format": this._getFormat()
    };
  };


  /**
   *   @private
   */
  oj.ColorConverter.prototype._getFormat = function ()
  {
    return  oj.ColorConverter.superclass.getOptions.call(this)["format"];
  }



  /**-------------------------------------------------------------*/
  /*   Helpers                                                    */
  /**-------------------------------------------------------------*/


  /**
   *  Converts an oj.Color object to a 3 or 6 hex character string 
   *  @param {Object} color  The oj.Color object to be converted to a hex string.
   *  @param {boolean=} allow3Char  If true the representation is 3 hex characters
   *  (if possible). If false, or omitted, 6 hex characters are used.
   *  @return {string} The hex string representation of the color object.
   */
  function _toHexString(color, allow3Char)
  {
    return '#' + _toHex(color, allow3Char);
  };


  /**
   *  Converts an oj.Color object to an hsl/hsla string 
   *  @param {Object} color  The oj.Color object to be converted to an hsl/hsla string.
   *  @return {string} The hsl/hsla representation of the color object.
   */
  function _toHslString(color)
  {
    var hsl = _rgbToHsl(color._r, color._g, color._b);
    var h = Math.round(hsl.h * 360), s = Math.round(hsl.s * 100), l = Math.round(hsl.l * 100);

    return (color._a == 1) ? "hsl(" + h + ", " + s + "%, " + l + "%)" :
    "hsla(" + h + ", " + s + "%, " + l + "%, " + color._a + ")";
  };

  /**
   *  Converts an oj.Color object to a 3 or 6 hex character string 
   *  @param {Object} color  The oj.Color object to be converted to a hex string.
   *  @param {boolean=} allow3Char  If true the representation is 3 hex characters
   *                   (if possible). If false, or omitted, 6 hex characters are used.
   *  @return {string} The hex string representation of the color object.
   */
  function _toHex(color, allow3Char)
  {
    return _rgbToHex(color._r, color._g, color._b, allow3Char);
  };

  /**
   *  Converts an oj.Color object to an hsv/hsva string 
   *  @param {Object} color  The oj.Color object to be converted to an hsv/hsva string.
   *  @return {string} The hsv/hsva representation of the color object.
   */
  function _toHsvString(color)
  {
    var hsv = _rgbToHsv(color._r, color._g, color._b);

    var h = Math.round(hsv.h * 360),
    s = Math.round(hsv.s * 100),
    v = Math.round(hsv.v * 100);

    return (color._a == 1) ?
    "hsv(" + h + ", " + s + "%, " + v + "%)" :
//   "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    "hsva(" + h + ", " + s + "%, " + v + "%, " + color._a + ")";
  };


  /**
   * Converts RGB color values to hex
   * @param {number} r the red value in the set [0,255]
   * @param {number} g the green value in the set [0,255]
   * @param {number} b the blue value in the set [0,255]
   * @param {boolean=} allow3Char  If true the representation is 3 hex characters
   *                   (if possible). If false, or omitted, 6 hex characters are used.
   * @returns {string} a 3 or 6 hex character string.
   */
  function _rgbToHex(r, g, b, allow3Char)
  {
    var hex = [
      _pad2(Math.round(r).toString(16)),
      _pad2(Math.round(g).toString(16)),
      _pad2(Math.round(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) &&
    hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1))
    {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
  };


  /**
   * Converts an RGB color value to HSL.
   * Handle bounds/percentage checking to conform to CSS color spec, and returns
   * an object containg the h,s,l values.
   * <http://www.w3.org/TR/css3-color/>
   * Assumes:  r, g, b in [0, 255] or [0, 1]
   * @param {number} r the red value
   * @param {number} g the green value
   * @param {number} b the blue value
   * @returns {Object} Object with properties h, s, l, in [0, 1].
   */
  function _rgbToHsl(r, g, b)
  {
    r = _bound01(r, 255);
    g = _bound01(g, 255);
    b = _bound01(b, 255);

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min)
    {
      h = s = 0; // achromatic
    }
    else
    {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max)
      {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {h: h, s: s, l: l};
  };

  /**
   * Converts an RGB color value to HSV.
   * Handle bounds/percentage checking to conform to CSS color spec, and returns
   * an object containg the h,s,v values.
   * <http://www.w3.org/TR/css3-color/>
   * Assumes:  r, g, and b are contained in the set [0,255] or [0,1]
   * @param {number} r the red value
   * @param {number} g the green value
   * @param {number} b the blue value
   * @returns {Object} Object with properties h, s, v, in [0,1].
   */
  function _rgbToHsv(r, g, b)
  {
    r = _bound01(r, 255);
    g = _bound01(g, 255);
    b = _bound01(b, 255);

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max == min)
    {
      h = 0; // achromatic
    }
    else
    {
      switch (max)
      {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return {h: h, s: s, v: v};
  };


  /**
   * Converts an RGBA color plus alpha transparency to hex
   * Assumes r, g, b and a are contained in the set [0, 255]
   * @param {number} r the red value in the set [0, 255]
   * @param {number} g the green value in the set [0, 255]
   * @param {number} b the blue value in the set [0, 255]
   * @param {number} a the alpha value in the set [0,1]
   * Returns an 8 character hex string
   */
  /*    NOT USED currently
   function rgbaToHex(r, g, b, a)
   {
   var hex = [
   pad2(convertDecimalToHex(a)),
   pad2(mathRound(r).toString(16)),
   pad2(mathRound(g).toString(16)),
   pad2(mathRound(b).toString(16))
   ];
   
   return hex.join("");
   }
   */


  /**
   *   Take input from [0, n] and return it as [0, 1]
   */
  function _bound01(n, max)
  {
    if (_isOnePointZero(n))
    {
      n = "100%";
    }

    var processPercent = _isPercentage(n);
    n = Math.min(max, Math.max(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent)
    {
      n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001))
    {
      return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
  };


  /**
   *   Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
   *   <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
   */
  function _isOnePointZero(n)
  {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
  };

  /**
   *  Check to see if string passed in is a percentage
   *  @param {string}  n  The number string
   *  @return {boolean}  True if the string contains a '%' character.
   */
  function _isPercentage(n)
  {
    return typeof n === "string" && n.indexOf('%') != -1;
  }
  ;


  /**
   *  Force a hex value string to have 2 characters by inserting a preceding zero
   *  if neccessary.  e.g. 'a' -> '0a'
   *  @param {string} c  The hex character(s) to be tested.
   *  @return {string} A two character hex string.
   */
  function _pad2(c)
  {
    return c.length == 1 ? '0' + c : '' + c;
  }
  ;


  /**
   *   Throw an invalid color specfication error.
   */
  function _throwInvalidColorSyntax()
  {
    var summary, detail, ce;

//  summary =  oj.Translations.getTranslatedString("oj-converter.color.invalidFormat.summary") ;
//  detail  = oj.Translations.getTranslatedString("oj-converter.color.invalidFormat.detail") ;
    summary = "Invalid color specification";
    detail = "Color specification does not conform to CSS3 standard";

    ce = new oj.ConverterError(summary, detail);

    throw ce;
  }
  ;


  /**
   *   Throw an invalid converter specfication error.
   */
  function _throwInvalidColorFormatOption()
  {
    var summary, detail, ce;

// summary =  oj.Translations.getTranslatedString("oj-converter.color.invalidFormat.summary") ;
// detail  = oj.Translations.getTranslatedString("oj-converter.color.invalidFormat.detail") ;
    summary = "Invalid color format";
    detail = "Invalid color format option specification";
    ce = new oj.ConverterError(summary, detail);

    throw ce;
  }
  ;


})();





/**
 * Copyright (c) 2008, 2013, Oracle and/or its affiliates. 
 * All rights reserved.
 */
/**
 * A factory implementation to create the built-in color converter of type 
 * {@link oj.ColorConverter}. 
 * 
 * @name oj.ColorConverterFactory
 * @public
 * @class
 * @example <caption>create an instance of the jet color converter using the options provided</caption>
 * var ccf = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_COLOR);  
 * var options = {format: 'hsl'};
 * var colorConverter = ccf.createConverter(options);
 * @since 0.6
 * 
 */
oj.ColorConverterFactory = (function () 
{
  function _createColorConverter(options) 
  {
    return new oj.ColorConverter(options);
  }
  
  /**
   * 
   * @public
   */
  return {
    /**
     * Creates an immutable (jet) color converter instance. 
     * 
     * @param {Object=} options an object literal used to provide an optional information to 
     * initialize the jet color converter. For details on what to pass for options, refer to 
     * {@link oj.ColorConverter}.
     * 
     * @return {oj.ColorConverter} 
     * @memberOf oj.ColorConverterFactory
     * @public
     */
    'createConverter' : function(options) {
                             return _createColorConverter(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultConverterFactory(oj.ConverterFactory.CONVERTER_TYPE_COLOR, // factory name
                                                oj.ColorConverterFactory);


// JET VALIDATOR FACTORIES 

/**
 * A factory implementation to create an instance of the built-in required validator of type 
 * {@link oj.RequiredValidator}. 
 * 
 * @example <caption>create an instance of the required validator using the factory</caption>
 * var rvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REQUIRED); 
 * var options = {'hint' : 'a value is required for this field'};
 * var requiredValidator = rvf.createValidator(options);
 * 
 * @name oj.RequiredValidatorFactory
 * @class
 * @public
 * @since 0.6
 * 
 */
oj.RequiredValidatorFactory = (function () 
{
  
  function _createRequiredValidator(options) 
  {
    return new oj.RequiredValidator(options);
  }
  
  return {
    /**
     * Creates an immutable validator instance of type @link oj.RequiredValidator that ensures that 
     * the value provided is not empty.  
     * 
     * @param {Object=} options an object literal used to provide an optional hint and error 
     * message. See {@link oj.RequiredValidator} for details.<p>
     * 
     * @return {oj.RequiredValidator}
     * @memberOf oj.RequiredValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createRequiredValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REQUIRED,
                                                oj.RequiredValidatorFactory);
                               
/**
 * A factory implementation that creates an instance of the built-in regExp validator of type 
 * {@link oj.RegExpValidator}.
 * 
 * @example <caption>create an instance of the regExp validator using the factory</caption>
 * var rvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP);  
 * var usernameValidator = rvf.createValidator(
 *  {
 *    'pattern': '[a-zA-Z0-9]{3,}', 
 *    'messageDetail': 'You must enter at least 3 letters or numbers'}
 *  });
 * 
 * @name oj.RegExpValidatorFactory
 * @class
 * @public
 * @since 0.6
 * 
 */
oj.RegExpValidatorFactory = (function () 
{
  
  function _createRegExpValidator(options) 
  {
    return new oj.RegExpValidator(options);
  }
  
  return {
    /**
     * Creates an immutable validator instance of type {@link oj.RegExpValidator} that ensures the value 
     * matches the provided pattern. 
     * 
     * @param {Object} options an object literal used to provide the pattern, an optional hint, error 
     * message among others. See {@link oj.RegExpValidator} for details.<p>
     * 
     * 
     * @return {oj.RegExpValidator} 
     * @memberOf oj.RegExpValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createRegExpValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP,
                                                oj.RegExpValidatorFactory);
                                        
                              
/**
 * Returns an instance of oj.LengthValidatorFactory that provides a factory method to create an 
 * instance of a length validator. 
 * 
 * @example <caption>create an instance of the length validator using the factory</caption>
 * var lvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_LENGTH);
 * var options = {hint: {max: 'Enter {max} or fewer characters'}, max: 10};
 * var lValidator = lvf.createValidator(options);
 * 
 * @name oj.LengthValidatorFactory
 * @class
 * @public
 * @since 0.6
 * 
 */
oj.LengthValidatorFactory = (function () 
{
  
  function _createLengthValidator(options) 
  {
    return new oj.LengthValidator(options);
  }
  
  return {
    /**
     * Creates an immutable validator instance of type oj.LengthValidator that ensures that the 
     * value provided is withing a given length.
     * 
     * @param {Object=} options an object literal used to provide the 'minimum', 'maximum' and other 
     * optional values. See {@link oj.LengthValidator} for details.<p>
     * 
     * @return {oj.LengthValidator}
     * @memberOf oj.LengthValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createLengthValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_LENGTH,
                                                oj.LengthValidatorFactory);
/**
 * Copyright (c) 2008, 2013, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Constructs a RegExpValidator that ensures the value matches the provided pattern
 * @param {Object} options an object literal used to provide the pattern, an optional hint and error 
 * message.
 * @param {RegExp=} options.pattern - a regexp pattern that the validator matches a value against.<p>
 * Example:<br/>
 * '\\d{10}'
 * @param {string=} options.hint - an optional hint text. There is no default hint provided by the 
 * validator. It is generally not recommended to show the actual pattern in the hint as it might be 
 * confusing to end-user, but if you do, you can use the {pattern} token.<p>
 * <p>The hint string is passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p>
 * Tokens: <br/>
 * {pattern} - the pattern to enforce<p>
 * Example:<br/>
 * "value must meet this pattern {pattern}" 
 * @param {string=} options.messageSummary - a custom error message summarizing the error when the 
 * users input does not match the specified pattern. When not present, the default summary is the 
 * resource defined with the key <code class="prettyprint">oj-validator.regExp.summary</code>. 
 * It is generally not recommended to show the actual pattern in the message as it might be 
 *  confusing to end-user. <p>
 * <p>The messageSummary string is passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p>
 * Tokens: <p>
 * {label} - label of the component for which this message applies. The label may not always be 
 * available depending on the usage of the validator. <br/>
 * {pattern} - the pattern the value should match<br/>
 * {value} - value entered by user<p>
 * Examples:<br/>
 * "'{label}' Format Incorrect" // translating to 'Phone Number' Format Incorrect
 * @param {string=} options.messageDetail - a custom error message to be used for creating detail 
 * part of message, when the users input does not match the specified pattern. When not present, the 
 * default detail message is the resource defined with the key 
 * <code class="prettyprint">oj-validator.regExp.detail</code>.<p>
 * <p>The messageDetail string is passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p>
 * Tokens:<br/>
 * {label} - label text of the component for which this message applies. <br/>
 * {pattern} the 'pattern' that the value should match <br/>
 * {value} value entered by the user <p>
 * Examples:<br/>
 * "The value {value} must contain at least 3 alphanumeric characters"<br/>
 * @export
 * @constructor
 * @since 0.6
 */
oj.RegExpValidator = function (options)
{
  this.Init(options);
};

// Subclass from oj.Object or oj.Validator. It does not matter
oj.Object.createSubclass(oj.RegExpValidator, oj.Validator, "oj.RegExpValidator");

// key to access required validator specific resources in the bundle 
oj.RegExpValidator._BUNDLE_KEY_DETAIL = "oj-validator.regExp.detail";
oj.RegExpValidator._BUNDLE_KEY_SUMMARY = "oj-validator.regExp.summary";

/**
 * Initializes validator instance with the set options
 * @param {Object} options
 * @memberof oj.RegExpValidator
 * @instance
 */
oj.RegExpValidator.prototype.Init = function (options)
{
  oj.RegExpValidator.superclass.Init.call(this);
  this._options = options;
};

/**
 * Validates value for matches using the regular expression provided by the pattern. This method 
 * does not raise an error when value is the empty string or null; the method returns true indicating
 * that the validation was successful. If the application wants the empty string to fail validation, 
 * then the application should chain in the required validator (e.g., set required on the input). 
 *  
 * @param {string|number} value that is being validated 
 * @returns {boolean} true if validation was successful 
 * 
 * @throws {Error} when there is no match
 * @memberof oj.RegExpValidator
 * @instance
 * @export
 */
oj.RegExpValidator.prototype.validate = function (value)
{
  var detail;
  var label;
  var params;
  var pattern = (this._options && this._options['pattern']) || "";

  var summary;


  // don't validate null or empty string; per 
  // There are one of two ways we could handle the empty string:
  // 1) blow up on null and then require that customers wrap the validator with one that 
  // succeeds on null if they don’t like the behavior 
  // 2) Accept null and expect that the application will chain in the required checked if necessary
  // As a team we decided 2) was better than 1).
  if (value === null || value === undefined || value === "")
  {
    return true;
  }

  // when using digits as input values parseString becomes a integer type, so get away with it.
  value = (value || value === 0) ? value.toString() : value;

  // We intend that the pattern provided is matched exactly
  var exactPattern = "^(" + pattern + ")$", valid = false,
  localizedDetail, localizedSummary, matchArr;

  matchArr = value.match(exactPattern);
  if ((matchArr !== null) && (matchArr[0] === value))
  {
    valid = true;
  }
  else
  {
    if (this._options)
    {
      summary = this._options['messageSummary'] || null;
      detail = this._options['messageDetail'] || null;
      label = this._options && this._options['label'] || "";
    }

    params = {'label': label, 'pattern': pattern, 'value': value};
    localizedSummary = summary ?
    oj.Translations.applyParameters(summary, params) :
    oj.Translations.getTranslatedString(this._getSummaryKey(), params);
    localizedDetail = (detail) ?
    oj.Translations.applyParameters(detail, params) :
    oj.Translations.getTranslatedString(this._getDetailKey(), params);

    throw new oj.ValidatorError(localizedSummary, localizedDetail);
  }

  return valid;
};

/**
 * A message to be used as hint, when giving a hint on the expected pattern. There is no default 
 * hint for this property.
 * 
 * @returns {String|null} a hint message or null if no hint is available in the options
 * @memberof oj.RegExpValidator
 * @instance
 * @export
 */
oj.RegExpValidator.prototype.getHint = function ()
{
  var hint = null;
  var params = {};
  if (this._options && (this._options['hint']))
  {
    params = {'pattern': this._options['pattern']};
    hint = oj.Translations.applyParameters(this._options['hint'], params);
  }

  return hint;
};

oj.RegExpValidator.prototype._getSummaryKey = function ()
{
  return oj.RegExpValidator._BUNDLE_KEY_SUMMARY;
};

oj.RegExpValidator.prototype._getDetailKey = function ()
{
  return oj.RegExpValidator._BUNDLE_KEY_DETAIL;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @export
 * @class oj.IntlConverterUtils
 * @classdesc Utility function for converters 
 * @since 0.7
 */
oj.IntlConverterUtils = {};

/**
 * Parses the isoString and returns a JavaScript Date object
 * 
 * @export
 * @param {string} isoString isoString to parse and to return Date of
 * @return {Date} the parsed JavaScript Date Object
 */
oj.IntlConverterUtils.isoToDate = function(isoString) 
{
  return oj.OraI18nUtils.isoToDate(isoString);
};

/**
 * Returns a local Date object provided a local isoString
 * 
 * @param {string} isoString date in isoString format
 * @returns {Date} localDate 
 * @export
 * @since 0.7
 */
oj.IntlConverterUtils.isoToLocalDate = function(isoString) 
{
  return oj.OraI18nUtils.isoToLocalDate(isoString);
};

/**
 * Returns a local isoString provided a Date object
 * 
 * @param {Date} date
 * @returns {string} isoString 
 * @export
 * @since 0.7
 */
oj.IntlConverterUtils.dateToLocalIso = function(date) 
{
  return oj.OraI18nUtils.dateToLocalIso(date);
};

oj.IntlConverterUtils._getTimeZone = function(isoString) 
{
  return oj.OraI18nUtils._getTimeZone(isoString);
};

/**
 * Returns the timezone offset between UTC and the local time in Etc/GMT[+-]hh:mm syntax.
 * The offset is positive if the local timezone is behind UTC and negative if
 * it is ahead. The offset range is between Etc/GMT-14 and Etc/GMT+12 (UTC-12 and UTC+14)
 * 
 * @example <caption>The local time is UTC-7 (Pacific Daylight Time)</caption>
 * oj.IntlConverterUtils.getLocalTimeZoneOffset() will return the string "Etc/GMT+07:00" 
 *
 * @example <caption>The local time is UTC+1 (Central European Standard Time)</caption>
 * oj.IntlConverterUtils.getLocalTimeZoneOffset() will return the string "Etc/GMT-01:00" 
 * 
 * @export 
 * @returns {string}
 */
oj.IntlConverterUtils.getLocalTimeZoneOffset = function() 
{
  return oj.OraI18nUtils.getLocalTimeZoneOffset();
};

/**
 * Given either an Object literal representing a 'converter' option (used in components) or a 
 * converter instance of type oj.Converter, this method returns the converter instance.
 * 
 * @param {Object} converterOption
 * @returns {Object} converterInstance or null if a converter cannot be determined
 * @export
 * @since 0.6
 */
oj.IntlConverterUtils.getConverterInstance = function (converterOption)
{
  var cTypeStr = "", cOptions = {}, converterInstance = null, cf;
  
  if (converterOption)
  {
    if (typeof converterOption === "object")
    {
      // TODO: Should we check that it duck types oj.Converter?
      if (converterOption instanceof oj.Converter || 
          (converterOption['parse'] && typeof converterOption['parse'] === "function") || 
          (converterOption['format'] && typeof converterOption['format'] === "function"))
      {
        // we are dealing with a converter instance
        converterInstance = converterOption;
      }
      else 
      {
        // check if there is a type set
        cTypeStr = converterOption['type'];
        cOptions = converterOption['options'] || {};
      }
    }

    if (!converterInstance)
    {
      // either we have an object literal or just plain string.
      cTypeStr = cTypeStr || converterOption;
      if (cTypeStr && typeof cTypeStr === "string")
      {
        // if we are passed a string get registered type. 
        cf = oj.Validation.converterFactory(cTypeStr);
        converterInstance = cf.createConverter(cOptions);
      }
    }
  }
  
  return converterInstance;
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
 */
oj.IntlConverterUtils._minMaxIsoString = function(minMax, value) 
{
  if(minMax) 
  {
    value = value || this.dateToLocalIso(new Date());
    
    var vTindex = value.indexOf("T");

    if(minMax.indexOf("T") === 0 && vTindex > 0) 
    {
      //meaning only time exists for minMax and value contains date
      minMax = value.substring(0, vTindex) + minMax;
    }
  }
  
  return minMax;
};

// PACKAGE PRIVATE

/**
 * Processes an converter option error and returns a oj.ConverterERror instance.
 * @param {string} errorCode
 * @param {Object} parameterMap
 * @return {Object} an oj.ConverterError instance
 * @private
 */
oj.IntlConverterUtils.__getConverterOptionError = function(errorCode, parameterMap)
{
  oj.Assert.assertObject(parameterMap);
  var summary = "", detail = "", propName = parameterMap['propertyName'], reqPropName, 
          propValueValid;
  
  if (errorCode === "optionTypesMismatch")
  {
    reqPropName = parameterMap['requiredPropertyName'];
    propValueValid = parameterMap['requiredPropertyValueValid'];
    // Summary: A value for the property '{requiredPropertyName}' is required when the property 
    // '{propertyName}' is set to '{propertyValue}'.
    summary = oj.Translations.getTranslatedString("oj-converter.optionTypesMismatch.summary", 
      {'propertyName': propName,
       'propertyValue': parameterMap['propertyValue'],
       'requiredPropertyName': reqPropName});

    detail = oj.IntlConverterUtils._getOptionValueDetailMessage(reqPropName, propValueValid);
  }
  else if (errorCode === "optionTypeInvalid")
  {
    // Summary: A value of the expected type was not provided for '{propertyName}'.
    propName = parameterMap['propertyName'];
    propValueValid = parameterMap['propertyValueValid'];
    summary = oj.Translations.getTranslatedString("oj-converter.optionTypeInvalid.summary", 
      {'propertyName': propName});

    detail = oj.IntlConverterUtils._getOptionValueDetailMessage(propName, propValueValid);
  }
  else if (errorCode === "optionOutOfRange")
  {
    // The value {propertyValue} is out of range for the option '{propertyName}'.
    summary = oj.Translations.getTranslatedString("oj-converter.optionOutOfRange.summary", 
      {'propertyName': propName,
       'propertyValue': parameterMap['propertyValue']});

    propValueValid = parameterMap['propertyValueValid'];
    detail = oj.IntlConverterUtils._getOptionValueDetailMessage(propName, propValueValid);
  }
  else if (errorCode === "optionValueInvalid")
  {
    // An invalid value '{propertyValue}' was specified for the option '{propertyName}'.. 
    summary = oj.Translations.getTranslatedString("oj-converter.optionValueInvalid.summary", 
      {'propertyName': propName,
       'propertyValue': parameterMap['propertyValue']});
    
    propValueValid = parameterMap['propertyValueHint'];
    detail = oj.IntlConverterUtils._getOptionValueDetailMessage(propName, propValueValid);
  }
  
  return new oj.ConverterError(summary, detail);

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
 */
oj.IntlConverterUtils._getOptionValueDetailMessage = function (propName, propValueValid)
{
  // Detail: An accepted value for '{propertyName}' is '{propertyValueValid}'. or 
  // Accepted values for '{propertyName}' are '{propertyValueValid}'.
  var resourceKey;
  
  if (propValueValid)
  {
    if (typeof propValueValid === "string")
    {
      resourceKey = "oj-converter.optionHint.detail";
    }
    else
    {
      // we have an array of values
      resourceKey = "oj-converter.optionHint.detail-plural";
      propValueValid = 
         propValueValid.join(oj.Translations.getTranslatedString("oj-converter.plural-separator"));
    }
    return oj.Translations.getTranslatedString(resourceKey, 
      {'propertyName': propName,
       'propertyValueValid': propValueValid});

  }
  
  return "";
};

/**
 * Returns the default value for non-truthy values.
 * 
 * @returns {string} an empty string
 * @private
 */
oj.IntlConverterUtils.__getNullFormattedValue = function ()
{
  return "";
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
 */
oj.IntlConverterUtils._copyTimeOver = function(fromIsoString, toIsoString) 
{
  return oj.OraI18nUtils._copyTimeOver(fromIsoString, toIsoString);
};

/**
 * Clears the time portion of the isoString
 * 
 * @private
 * @expose
 * @param {string} isoString isoString that may not be a complete isoString
 * @returns {string} an updated isoString
 * @since 1.1
 */
oj.IntlConverterUtils._clearTime = function(isoString) 
{
  return oj.OraI18nUtils._clearTime(isoString);
};

/**
 * Will accept an isoString and perform a get operation or a set operation depending on whether param is an Array 
 * or a JSON 
 * 
 * The keys for the get and set operation are defined in oj.OraI18nUtils's _DATE_TIME_KEYS.
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
 */
oj.IntlConverterUtils._dateTime = function(isoString, actionParam, doParseValue) 
{
  return oj.OraI18nUtils._dateTime(isoString, actionParam, doParseValue);
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
 */
oj.IntlConverterUtils._normalizeIsoString = function(isoString) 
{
  return oj.OraI18nUtils._normalizeIsoString(isoString);
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Constructs a LengthValidator that ensures the value entered is within a given length.
 * <p> 
 * By default this uses Javascript's String length property 
 * which counts a UTF-16 surrogate pair as length === 2. 
 * If you need to count surrogate pairs as length === 1, then set the 
 * <code class="prettyprint">countBy</code> option to <code class="prettyprint">"codePoint"</code>
 * or use
 * <code class="prettyprint">oj.LengthValidator.defaults.countBy = "codePoint";</code>
 * to set the page-wide default.
 * </p>
 * <p> 
 * You can customize the default messages of all validators including this one
 * using the messageDetail and messageSummary options.
 * <p>
 * @param {Object=} options an object literal used to provide:<p>
 * @param {string=} options.countBy - A string that specifies how to count the length. Valid values are
 * <code class="prettyprint">"codeUnit"</code> and <code class="prettyprint">"codePoint"</code>.
 * Defaults to <code class="prettyprint">oj.LengthValidator.defaults.countBy</code> which defaults
 * to <code class="prettyprint">"codeUnit"</code>.<br/>
 * <code class="prettyprint">"codeUnit"</code> uses javascript's length function which counts the 
 * number of UTF-16 code units. Here a Unicode surrogate pair has a length of two. <br/>
 * <code class="prettyprint">"codePoint"</code> 
 * counts the number of Unicode code points. 
 * Here a Unicode surrogate pair has a length of one.<br/>
 * @param {number=} options.min - a number 0 or greater that is the minimum length of the value.
 * @param {number=} options.max - a number 1 or greater that is the maximum length of the value.
 * @param {Object=} options.hint - an optional object literal of hints to be used. 
 * <p>The hint strings (e.g., hint.min) are  passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p> 
 * @param {string=} options.hint.max - a hint message to be used to indicate the allowed maximum. 
 * When not present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.hint.max</code>.<p>
 * Tokens: <br/>
 * {max} - the maximum<p>
 * Usage: <br/>
 * Enter {max} or fewer characters
 * @param {string=} options.hint.min - a hint message to be used to indicate the allowed minimum. 
 * When not present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.hint.min</code>.<p>
 * Tokens: <br/>
 * {min} the minimum<p>
 * Usage: <br/>
 * Enter {min} or more characters 
 * @param {string=} options.hint.inRange - a hint message to be used to indicate the allowed range. 
 * When not present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.hint.inRange</code>.<p>
 * Tokens: <br/>
 * {min} the minimum<p>
 * {max} - the maximum<p>
 * Usage: <br/>
 * Enter between {min} and {max} characters
 * @param {string=} options.hint.exact - a hint message to be used, to indicate the exact length. 
 * When not present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.hint.exact</code>.<p>
 * Tokens: <br/>
 * {length} the length<p>
 * Usage: <br/>
 * Enter {length} characters
 * @param {Object=} options.messageDetail - an optional object literal of custom error messages to 
 * be used.
 * <p>The messageDetail strings (e.g., messageDetail.tooLong) are  passed as the 'pattern' 
 * parameter to [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p> 
 * @param {string=} options.messageDetail.tooLong - the detail error message to be used as the error 
 * message, when the length of the input value exceeds the maximum value set. When not present, the 
 * default detail message is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.messageDetail.tooLong</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {max} - the maximum allowed value<p>
 * Usage: <br/>
 * The {value} has too many characters. Enter {max} or fewer characters, not more.
 * @param {string=} options.messageDetail.tooShort - the detail error message to be used as the error 
 * message, when the length of the input value is less the minimum value set. When not present, the 
 * default detail message is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.messageDetail.tooShort</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {min} - the minimum allowed value<p>
 * Usage: <br/>
 * The {value} has too few characters. Enter {min} or more characters, not less.
 * @param {Object=} options.messageSummary - optional object literal of custom error summary message 
 * to be used. 
 * <p>The messageSummary strings (e.g., messageSummary.tooLong) are  passed as the 'pattern' 
 * parameter to [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p> 
 * @param {string=} options.messageSummary.tooLong - the message to be used as the summary error 
 * message, when the length of the input value exceeds the maximum value set. When not present, the 
 * default message summary is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.messageSummary.tooLong</code>.
 * @param {string=} options.messageSummary.tooShort - the message to be used as the summary error 
 * message, when input value is less than the set minimum value. When not present, the default 
 * message summary is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.messageSummary.tooShort</code>.
 * @export
 * @constructor
 * @since 0.7
 */
oj.LengthValidator = function (options)
{
  this.Init(options);
};

/**
 * The set of attribute/value pairs that serve as default values 
 * when new LengthValidator objects are created.
 * <p>
 * LengthValidator's <code class="prettyprint">countBy</code> option may be changed
 * for the entire application after the 'ojs/ojvalidation' module is loaded 
 * (each form control module includes the 'ojs/ojvalidation' module). If the 
 * <code class="prettyprint">options.countBy</code> is specifically set, 
 * it will take precedence over this default.
 * </p>
 * <p>For example:
 * <code class="prettyprint">
 * oj.LengthValidator.defaults.countBy = 'codePoint';
 * </code></p>
 * @property {string} countBy count the length by <code class="prettyprint">"codeUnit"</code> or 
 * <code class="prettyprint">"codePoint"</code>. 
 * Defaults to <code class="prettyprint">"codeUnit"</code>.
 * @export
 * @memberof oj.LengthValidator
 * @since 2.1.0
 */
oj.LengthValidator.defaults =
{
  'countBy': 'codeUnit'
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.LengthValidator, oj.Validator, "oj.LengthValidator");

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 */
oj.LengthValidator.prototype.Init = function (options)
{
  var countByOptions = options["countBy"];

  oj.LengthValidator.superclass.Init.call(this);

  this._min = options["min"] !== undefined ? parseInt(options["min"], 10) : null;
  this._max = options["max"] !== undefined ? parseInt(options["max"], 10) : null;
  
  // check that the min/max make sense, otherwise throw an error
  if (isNaN(this._min))
    throw new Error("length validator's min option is not a number. min option is " + options["min"]);
  if (isNaN(this._max))
    throw new Error("length validator's max option is not a number. max option is " + options["min"]);
  if (this._min !== null && this._min < 0)
    throw new Error("length validator's min option cannot be less than 0. min option is " + 
      options["min"]);
  if (this._max !== null && this._max < 1)
    throw new Error("length validator's max option cannot be less than 1. max option is " + 
      options["max"]);
  
  this._countBy = (countByOptions === undefined) ?
  oj.LengthValidator.defaults['countBy'] : countByOptions;

  if (options)
  {
    this._hint = options['hint'] || {};
    this._customMessageSummary = options['messageSummary'] || {};
    this._customMessageDetail = options['messageDetail'] || {};

  }
};

/**
 * A message to be used as hint, when giving a hint about the expected length. There is no default 
 * hint for this property.
 * 
 * @returns {String|null} a hint message or null if no hint is available in the options
 * @memberof oj.LengthValidator
 * @instance
 * @export
 */
oj.LengthValidator.prototype.getHint = function ()
{
  var hint = null;
  var hints = this._hint;
  var hintExact = hints["exact"];
  var hintInRange = hints["inRange"];
  var hintMaximum = hints["max"];
  var hintMinimum = hints["min"];

  var max = this._max;
  var min = this._min;
  var params;
  var translations = oj.Translations;

  if (min !== null && max !== null)
  {
    if (min !== max)
    {
      params = {"min": min, "max": max};
      hint = hintInRange ? translations.applyParameters(hintInRange, params) :
      translations.getTranslatedString('oj-validator.length.hint.inRange', params);
    }
    else
    {
      params = {'length': min};
      hint = hintExact ? translations.applyParameters(hintExact, params) :
      translations.getTranslatedString('oj-validator.length.hint.exact', params);
    }
  }
  else if (min !== null)
  {
    params = {"min": min};
    hint = hintMinimum ? translations.applyParameters(hintMinimum, params) :
    translations.getTranslatedString('oj-validator.length.hint.min', params);
  }
  else if (max !== null)
  {
    params = {"max": max};
    hint = hintMaximum ? translations.applyParameters(hintMaximum, params) :
    translations.getTranslatedString('oj-validator.length.hint.max', params);
  }

  return hint;
};

/**
 * Validates the length of value is greater than minimum and/or less than maximum.
 *
 * @param {string} value that is being validated
 * @returns {string} original if validation was successful
 *
 * @throws {Error} when the length is out of range.
 * @export
 */
oj.LengthValidator.prototype.validate = function (value)
{

  var customMessageDetail = this._customMessageDetail;
  var customMessageSummary = this._customMessageSummary;
  var detail = "";
  var length;
  var max = this._max;
  var messageSummaryTooLong = customMessageSummary["tooLong"];
  var messageSummaryTooShort = customMessageSummary["tooShort"];
  var messageTooLong = customMessageDetail["tooLong"];
  var messageTooShort = customMessageDetail["tooShort"];
  var min = this._min;
  var params;
  var string;
  var summary = "";
  var translations = oj.Translations;

  string = "" + value;
  length = this._getLength(string);

  // If only min is set and length is at least min, or 
  // if only max is set and length is at most max, or
  // if length is between min and max or
  // if neither min or max is set return with no error.
  if ((min === null || length >= this._min) &&
  ((max === null) || (length <= this._max)))
  {
    return string;
  }
  else
  {
    if (length < this._min) //too short
    {
      params = {"value": value, "min": min};
      summary = messageSummaryTooShort ? translations.applyParameters(messageSummaryTooShort, params) :
      translations.getTranslatedString('oj-validator.length.messageSummary.tooShort');
      detail = messageTooShort ? translations.applyParameters(messageTooShort, params) :
      translations.getTranslatedString('oj-validator.length.messageDetail.tooShort', params);
    }
    else // too long
    {
      params = {"value": value, "max": max};
      summary = messageSummaryTooLong ? translations.applyParameters(messageSummaryTooLong, params) :
      translations.getTranslatedString('oj-validator.length.messageSummary.tooLong');
      detail = messageTooLong ? translations.applyParameters(messageTooLong, params) :
      translations.getTranslatedString('oj-validator.length.messageDetail.tooLong', params);
    }

    throw new oj.ValidatorError(summary, detail);
  }
};

/**
 * @returns {number} the length of the text counted by UTF-16 codepoint
 *  or codeunit as specified in the countBy option.
 */
oj.LengthValidator.prototype._getLength = function (text)
{

  var countBy = this._countBy.toLowerCase();
  var codeUnitLength = text.length;
  var i;
  var length;
  var surrogateLength = 0;

  switch (countBy)
  {
    case "codepoint" :
      // if countBy is "codePoint", then count supplementary characters as length of one
      // For UTF-16, a "Unicode  surrogate pair" represents a single supplementary character. 
      // The first (high) surrogate is a 16-bit code value in the range U+D800 to U+DBFF. 
      // The second (low) surrogate is a 16-bit code value in the range U+DC00 to U+DFFF.
      // This code figures out if a charCode is a high or low surrogate and if so, 
      // increments surrogateLength
      for (i = 0; i < codeUnitLength; i++)
      {
        if ((text.charCodeAt(i) & 0xF800) === 0xD800)
        {
          surrogateLength++;
        }
      }
      // e.g., if the string is two supplementary characters, codeUnitLength is 4, and the 
      // surrogateLength is 4, so we will return two.
      oj.Assert.assert(surrogateLength%2 === 0, 
        "the number of surrogate chars must be an even number.");
      length = (codeUnitLength - surrogateLength / 2);
      break;
    case "codeunit" :
    default :
      // Javascript's length function counts # of code units. 
      // A supplementary character has a length of 2 code units.
      length = codeUnitLength;
  }
  return length;
};
});
