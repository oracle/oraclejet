/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore-base', 'ojL10n!ojtranslations/nls/localeElements'], function(oj, ojld)
{
  "use strict";


/* global ojld:true*/

/**
 * @namespace oj.LocaleData
 * @classdesc Locale Data Services
 * @export
 * @since 0.6.0
 * @ojtsmodule
 * @hideconstructor
 */
var LocaleData = {};
/**
 * Sets the Locale Elements bundle used by JET
 * If an AMD loader (such as Require.js) is not present, this method should be called by the application to provide
 * a Locale Elements for JET.
 * This method may also be used by an application that wants to completely replace the Locale Elements bundle that is automatically
 * fetched by an AMD loader.
 * @param {Object} bundle resource bundle that should be used by the framework
 * @return {void}
 * @export
 * @method setBundle
 * @memberof oj.LocaleData
 */

LocaleData.setBundle = function (bundle) {
  LocaleData._bundle = bundle;
};
/**
 * Retrieves the first day of week for the current locale's region
 * @return {number} a numeric representation of the first week day of the week:
 * 0 for Sunday, 1 for Monday, etc.
 * @export
 * @method getFirstDayOfWeek
 * @memberof oj.LocaleData
 */


LocaleData.getFirstDayOfWeek = function () {
  return LocaleData._getWeekData('firstDay');
};
/**
 * Retrieves the first weekend day for the current locale's region
 * @return {number} a numeric representation of the first weekend day:
 * 0 for Sunday, 1 for Monday, etc.
 * @export
 * @method getWeekendStart
 * @memberof oj.LocaleData
 */


LocaleData.getWeekendStart = function () {
  return LocaleData._getWeekData('weekendStart');
};
/**
 * Retrieves the last weekend day for the current locale's region
 * @return {number} a numeric representation of the last weekend day:
 * 0 for Sunday, 1 for Monday, etc.
 * @export
 * @method getWeekendEnd
 * @memberof oj.LocaleData
 */


LocaleData.getWeekendEnd = function () {
  return LocaleData._getWeekData('weekendEnd');
};
/**
 * Retrieves locale-specific names of the days of the week
 * @return {Array.<string>} names of the days from Sunday through Sturday
 * @param {string} [type] - the type of the name. Currently, "abbreviated", "narrow" and "wide" are supported
 * @ojsignature { target:"Type", for: "type", value: "'abbreviated'|'narrow'|'wide'"}
 * @export
 * @method getDayNames
 * @memberof oj.LocaleData
 */


LocaleData.getDayNames = function (type) {
  if (type == null || type !== 'abbreviated' && type !== 'narrow') {
    // eslint-disable-next-line no-param-reassign
    type = 'wide';
  }

  var days = LocaleData._getCalendarData().days['stand-alone'][type];

  return [days.sun, days.mon, days.tue, days.wed, days.thu, days.fri, days.sat];
};
/**
 * Retrieves locale-specific names of months
 * @return {Array.<string>} names of months from January through December
 * @param {string} [type] - the type of the name. Currently, "abbreviated", "narrow" and "wide" are supported
 * @ojsignature { target:"Type", for: "type", value: "'abbreviated'|'narrow'|'wide'"}
 * @export
 * @method getMonthNames
 * @memberof oj.LocaleData
 */


LocaleData.getMonthNames = function (type) {
  if (type == null || type !== 'abbreviated' && type !== 'narrow') {
    // eslint-disable-next-line no-param-reassign
    type = 'wide';
  }

  var months = LocaleData._getCalendarData().months['stand-alone'][type];

  return [months['1'], months['2'], months['3'], months['4'], months['5'], months['6'], months['7'], months['8'], months['9'], months['10'], months['11'], months['12']];
};
/**
 * Retrieves whether month is displayed prior to year
 * @return {boolean} whether month is prior to year
 * @export
 * @method isMonthPriorToYear
 * @memberof oj.LocaleData
 */


LocaleData.isMonthPriorToYear = function () {
  var longDateFormat = LocaleData._getCalendarData().dateFormats.long.toUpperCase();

  var monthIndex = longDateFormat.indexOf('M');
  var yearIndex = longDateFormat.indexOf('Y');
  return monthIndex < yearIndex;
};
/**
 * @hidden
 * @private
 */


LocaleData._getWeekData = function (key) {
  var b = LocaleData.__getBundle();

  var defRegion = '001';
  var region = LocaleData._getRegion() || defRegion;
  var data = b.supplemental.weekData[key];
  var val = data[region];

  if (val === undefined) {
    val = data[defRegion];
  }

  return val;
};
/**
 * @hidden
 * @private
 */


LocaleData._getCalendarData = function () {
  var b = LocaleData.__getBundle();

  var main = b.main; // skip one level (the name of the locale)

  var keys = Object.keys(main);
  var localeName = keys[0];
  var data = main[localeName];
  return data.dates.calendars.gregorian;
};
/**
 * @hidden
 * @private
 */


LocaleData._getRegion = function () {
  var locale = oj.Config.getLocale();

  if (locale) {
    var tokens = locale.toUpperCase().split(/-|_/);

    if (tokens.length >= 2) {
      var tag = tokens[1];

      if (tag.length === 4) {
        // this is a script tag
        if (tokens.length >= 3) {
          return tokens[2];
        }
      } else {
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


LocaleData.__getBundle = function () {
  var b = LocaleData._bundle;

  if (b) {
    return b;
  }

  if (oj.__isAmdLoaderPresent()) {
    oj.Assert.assert(ojld !== undefined, 'LocaleElements module must be loaded');
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


LocaleData.__updateBundle = function (bundle) {
  ojld = bundle;
};

  oj.LocaleData = LocaleData; // for bw compatibility bleed back here.
  ;return LocaleData;
});