/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'ojs/ojconfig', 'ojL10n!ojtranslations/nls/localeElements', 'ojs/ojcalendarutils'], function (exports, oj, Config, ojldimport, ojcalendarutils) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  ojldimport = ojldimport && Object.prototype.hasOwnProperty.call(ojldimport, 'default') ? ojldimport['default'] : ojldimport;

  var ojld = ojldimport;

  /**
   * @namespace oj.LocaleData
   * @classdesc Locale Data Services
   * @export
   * @since 0.6.0
   * @ojtsmodule
   * @hideconstructor
   */
  const LocaleData = {};

  oj._registerLegacyNamespaceProp('LocaleData', LocaleData);

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
    if (type == null || (type !== 'abbreviated' && type !== 'narrow')) {
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
    if (type == null || (type !== 'abbreviated' && type !== 'narrow')) {
      // eslint-disable-next-line no-param-reassign
      type = 'wide';
    }
    var months = LocaleData._getCalendarData().months['stand-alone'][type];

    return [
      months['1'],
      months['2'],
      months['3'],
      months['4'],
      months['5'],
      months['6'],
      months['7'],
      months['8'],
      months['9'],
      months['10'],
      months['11'],
      months['12']
    ];
  };

  /**
   * Retrieves whether month is displayed prior to year
   * @return {boolean} whether month is prior to year
   * @export
   * @method isMonthPriorToYear
   * @memberof oj.LocaleData
   * @ojdeprecated [{since: "11.0.0", description: "This is used internally by the oj-date-picker component,
   *  and should not be called by application code. If the functionality is needed, use Intl.DateTimeFormat.formatToParts
   *  instead which returns the formatted pieces in order."}]
   */
  LocaleData.isMonthPriorToYear = function () {
    var options = { dateStyle: 'long' };
    var locale = Config.getLocale();
    var d = new Date();
    var intlFormatter = new Intl.DateTimeFormat(locale, options);
    var parts = intlFormatter.formatToParts(d);
    var monthIndex = parts.findIndex((obj) => obj.type === 'month');
    var yearIndex = parts.findIndex((obj) => obj.type === 'year');
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
    var locale = Config.getLocale();
    var cal = ojcalendarutils.CalendarUtils.getCalendar(locale, 'gregory');
    return cal;
  };

  /**
   * @hidden
   * @private
   */
  LocaleData._getRegion = function () {
    var locale = Config.getLocale();
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
    // try default region
    var b = LocaleData.__getBundle();
    var regions = b.supplemental.defaultRegion;
    return regions[locale];
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
    return ojld;
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

  const getDayNames = LocaleData.getDayNames;
  const getFirstDayOfWeek = LocaleData.getFirstDayOfWeek;
  const getMonthNames = LocaleData.getMonthNames;
  const getWeekendEnd = LocaleData.getWeekendEnd;
  const getWeekendStart = LocaleData.getWeekendStart;
  const isMonthPriorToYear = LocaleData.isMonthPriorToYear;
  const setBundle = LocaleData.setBundle;
  const __getBundle = LocaleData.__getBundle;
  const _getCalendarData = LocaleData._getCalendarData;

  exports.__getBundle = __getBundle;
  exports._getCalendarData = _getCalendarData;
  exports.getDayNames = getDayNames;
  exports.getFirstDayOfWeek = getFirstDayOfWeek;
  exports.getMonthNames = getMonthNames;
  exports.getWeekendEnd = getWeekendEnd;
  exports.getWeekendStart = getWeekendStart;
  exports.isMonthPriorToYear = isMonthPriorToYear;
  exports.setBundle = setBundle;

  Object.defineProperty(exports, '__esModule', { value: true });

});
