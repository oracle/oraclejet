/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojconfig', 'ojs/ojtranslation', 'ojL10n!ojtranslations/nls/localeElements', 'ojs/ojlocaledata', 'ojs/ojconverterutils-i18n', 'ojs/ojlogger', 'ojs/ojconverter', 'ojs/ojvalidation-error'], 
function(oj, Config, Translations, ojld, LocaleData, __ConverterUtilsI18n, Logger, Converter)
{
  "use strict";

/* global Converter:false */
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
var DateTimeConverter = function (options) {
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
 */
DateTimeConverter.prototype.getAvailableTimeZones = function () {
  return DateTimeConverter.superclass.getAvailableTimeZones.call(this);
};




/* global OraDateTimeConverter:true, DateTimeConverter:false, LocaleData:false, __ConverterUtilsI18n:false, Logger:false, Config:false, Translations:false */
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
 *  {@link oj.Config#getLocale}.
 *  </p>
 * There are several ways to initialize the converter.
 * <ul>
 * <li>Using options defined by the ECMA 402 Specification, these would be the properties year,
 * month, day, hour, minute, second, weekday, era, timeZoneName, hour12</li>
 * <li>Using a custom date and/or time format pattern using the 'pattern' property</li>
 * <li>Using the standard date, datetime and time format lengths defined by Unicode CLDR, these
 * would include the properties formaType, dateFormat, timeFormat.</li>
 * </ul>
 *
 * <p>
 * The options when specified take precendence in the following order:<br>
 * 1. pattern.<br>
 * 2. ECMA options.<br>
 * 3. formatType/dateFormat/timeFormat.
 * <p>
 * The converter provides great leniency when parsing a user input value to a date in the following
 * ways: <br/>
 * <ul>
 * <li>Allows use of any character for separators irrespective of the separator specified in the
 * associated pattern. E.g., if pattern is set to 'y-M-d', the following values are all valid -
 * 2013-11-16, 2013/11-16 and 2013aaa11xxx16.</li>
 * <li>Allows specifying 4 digit year in any position in relation to day and month. E.g., 11-2013-16
 * or 16-11-2013</li>
 * <li>Supports auto-correction of value, when month and day positions are swapped as long as the
 * date is > 12 when working with the Gregorian calendar. E.g., if the pattern is 'y-M-d',
 * 2013-16-11 will be auto-corrected to 2013-11-16. However if both date and month are less or equal
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
var IntlDateTimeConverter = function (options) {
  this.Init(options);
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
 * @property {('offset'|'zulu'|'local'|'auto')=} isoStrFormat - specifies in which format the ISO string is returned.
 * The possible values of isoStrFormat are: "offset", "zulu", "local", "auto".
 * The default format is auto.
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
 *       <td>2016-01-05T11:30:00-08:00</td>
 *     </tr>
 *     <tr>
 *       <td>zulu</td>
 *       <td>zulu time or UTC time.</td>
 *       <td>2016-01-05T19:30:00Z</td>
 *     </tr>
 *     <tr>
 *       <td>local</td>
 *       <td>local time, does not contain time zone offset.</td>
 *       <td>2016-01-05T19:30:00</td>
 *     </tr>
 *     <tr>
 *       <td>auto</td>
 *       <td>auto means the returned ISO string depends on the input string and options</td>
 *       <td></td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {(boolean)=} dst - The dst option can be used for time only values in conjunction with offset.
 * Setting dst to true indicates the time is in DST. By default the time is interpreted as standard time.
 * The possible values of dst are: "true" or "false". Default is "false".
 * <p style='padding-left: 5px;'>
 * Due to Daylight Saving Time, there is a possibility that a time exists twice If the time falls in the duplicate window
 * (switching from daylight saving time to standard time). The application can disambiguate the time in the overlapping
 * period using the dst option. Setting dst to true indicates the time is in DST. By default the time is interpreted as
 * standard time.<br/><br/>
 * Example: On November 1st, 2105 in US the time between 1 and 2 AM will be repeated. The dst option can indicate the
 * distinction as follows. Initially the time is in DST, so dst:'true' is specified.<br/>
 * var options = {formatType:'datetime', dateFormat:'short', timeFormat:'medium', timeZone:'America/Los_Angeles', isoStrFormat: 'offset', dst : true};<br/>
 * var localeElements = oj.getLocaleElemnts();<br/>
 * var str= "11/1/15 1:59:59 AM";<br/>
 * cnv.parse(str, localeElements, options);-->2015-11-01T01:59:59-07:00
 * <br/><br/>
 * If the user does not pass the dst option, the time will be interpreted as standard time.
 * var options = {formatType:'datetime', dateFormat:'short', timeFormat:'medium', timeZone:'America/Los_Angeles'};<br/>
 * var localeElements = oj.getLocaleElemnts();<br/>
 * var str= "11/1/15 1:59:59 AM";<br/>
 * cnv.parse(str, localeElements, options);-->2015-11-01T01:59:59-08:00
 * <br/><br/>
 * At 2AM, DST will be over and the clock brings back to 1AM. Then the dst option should be false or not specified.
 * var options = {formatType:'datetime', dateFormat:'short', timeFormat:'medium', timeZone:'America/Los_Angeles', isoStrFormat: 'offset'};<br/>
 * var localeElements = oj.getLocaleElemnts();<br/>
 * var str= "11/1/15 1:00:00 AM";<br/>
 * cnv.parse(str, localeElements, options);-->2015-11-01T01:00:00-08:00
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
oj.Object.createSubclass(IntlDateTimeConverter, DateTimeConverter,
                         'oj.IntlDateTimeConverter');
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
};


// Returns the wrapped date time converter implementation object.
IntlDateTimeConverter.prototype._getWrapped = function () {
  if (!this._wrapped) {
    this._wrapped = OraDateTimeConverter.getInstance();
  }

  return this._wrapped;
};

/**
 * Formats the isoString value using the options provided and returns a string value.
 * <p>
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
  var localeElements = LocaleData.__getBundle();
  var locale = Config.getLocale();
  var resolvedOptions = this.resolvedOptions();

  // undefined, null and empty string values all return null. If value is NaN then return "".
  // TODO: Should we automatically parse() the integer value representing the number of milliseconds
  // since 1 January 1970 00:00:00 UTC (Unix Epoch)?
  if (value == null ||
      (typeof value === 'string' && (oj.StringUtils.trim('' + value)).length === 0)) {
    return '';
  }

  try {
    return this._getWrapped().format(value, localeElements, resolvedOptions, locale);
  } catch (e) {
    var converterError = this._processConverterError(e, value);
    throw converterError;
  }
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
 * @throws {Object} an instance of {@link oj.ConverterError}
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
 */
IntlDateTimeConverter.prototype.formatRelative = function (value, relativeOptions) {
  var localeElements = LocaleData.__getBundle();
  var locale = Config.getLocale();

  try {
    return this._getWrapped().formatRelative(value, localeElements, relativeOptions, locale);
  } catch (e) {
    var converterError = this._processConverterError(e, value);
    throw converterError;
  }
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

// Returns the hint value.
IntlDateTimeConverter.prototype._getHintValue = function () {
  var value = '';
  try {
    // example date
    value =
      this.format(__ConverterUtilsI18n.IntlConverterUtils.dateToLocalIso(
        IntlDateTimeConverter._DEFAULT_DATE));
  } catch (e) {
    if (e instanceof oj.ConverterError) {
      // Something went wrong and we don't have a way to retrieve a valid value.
      // TODO: Log an error
      value = '';
    }
  }
  return value;
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
 * @throws a oj.ConverterError when the options that the converter was initialized with are invalid.
 * @memberof oj.IntlDateTimeConverter
 * @export
 * @instance
 * @method resolvedOptions
 */
IntlDateTimeConverter.prototype.resolvedOptions = function () {
  var localeElements;
  var locale = Config.getLocale();
  var options = this.getOptions();

  // options are resolved and cached for a locale
  if ((locale !== this._locale) || !this._resolvedOptions) {
    localeElements = LocaleData.__getBundle();
    try {
      if (!localeElements) {
        Logger.error('locale bundle for the current locale %s is unavailable', locale);
        return {};
      }
      // cache if successfully resolved
      this._resolvedOptions = this._getWrapped().resolvedOptions(localeElements,
                                                                 options,
                                                                 locale);
      this._locale = locale;
    } catch (e) {
      var converterError = this._processConverterError(e);
      throw converterError;
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
 */
IntlDateTimeConverter.prototype.calculateWeek = function (value) {
  return this._getWrapped().calculateWeek(value,
                                          LocaleData.__getBundle(),
                                          Config.getLocale());
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
  if (value == null || value === '') {
    return null;
  }

  var localeElements = LocaleData.__getBundle();
  var locale = Config.getLocale();
  var resolvedOptions = this.resolvedOptions();

  try {
    // date converter parses the value and returns an Object with 2 fields - 'value' and 'warning'
    var result = this._getWrapped().parse(value, localeElements, resolvedOptions, locale);
    var parsed = result.value;
    if (parsed) {
      // TODO: For now log a warning when we leniently parse a value; later we plan to flash the
      // field.
      if (result.warning) {
        Logger.warn('The value ' + value + ' was leniently parsed to represent a date ' +
                (parsed.toString) ? parsed.toString() : parsed);
      }
    }
    return parsed;
  } catch (e) {
    var converterError = this._processConverterError(e, value);
    throw converterError;
  }
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
IntlDateTimeConverter.prototype.compareISODates = function (isoStr, isoStr2) {
  var stringChecker = oj.StringUtils.isString;

  if (!stringChecker(isoStr) || !stringChecker(isoStr2)) {
    throw new Error('Invalid arguments for compareISODates ', isoStr, isoStr2);
  }

  return this._getWrapped().compareISODates(isoStr, isoStr2, LocaleData.__getBundle());
};

/**
 * Processes the error returned by the converter implementation and throws a oj.ConverterError
 * instance.
 * @param {Error} e
 * @param {String|string|Date|Object=} value
 * @throws an instance of oj.ConverterError
 * @private
 */
IntlDateTimeConverter.prototype._processConverterError = function (e, value) {
  var errorInfo = e.errorInfo;
  var summary;
  var detail;
  var converterError;
  var resourceKey;

  if (errorInfo) {
    var errorCode = errorInfo.errorCode;
    var parameterMap = errorInfo.parameterMap || {};
    oj.Assert.assertObject(parameterMap);
    var propName = parameterMap.propertyName;
    propName = Translations.getTranslatedString(
      'oj-converter.datetime.datetimeOutOfRange.' + propName
    );
    // update the map back so that functions like __getConverterOptionError use new value
    parameterMap.propertyName = propName;

    if (e instanceof TypeError) {
      if (errorCode === 'optionTypesMismatch' || errorCode === 'optionTypeInvalid') {
        converterError = __ConverterUtilsI18n.IntlConverterUtils.__getConverterOptionError(
          errorCode, parameterMap);
      }
    } else if (e instanceof RangeError) {
      if (errorCode === 'optionOutOfRange') {
        converterError = __ConverterUtilsI18n.IntlConverterUtils.__getConverterOptionError(
          errorCode, parameterMap);
      } else if (errorCode === 'datetimeOutOfRange') { // TODO: NLS should use lower case time
        // The '{value}' is out of range. Enter a value between '{minValue}' and '{maxValue}' for
        // '{propertyName}'.
        summary = Translations.getTranslatedString(
          'oj-converter.datetime.datetimeOutOfRange.summary', {
            propertyName: propName,
            value: parameterMap.value
          });
        detail = Translations.getTranslatedString(
          'oj-converter.datetime.datetimeOutOfRange.detail', {
            minValue: parameterMap.minValue,
            maxValue: parameterMap.maxValue
          });

        converterError = new oj.ConverterError(summary, detail);
      } else if (errorCode === 'isoStringOutOfRange') {
        summary = Translations.getTranslatedString(
          'oj-converter.datetime.invalidISOString.invalidRangeSummary', {
            isoStr: parameterMap.isoString,
            propertyName: propName,
            value: parameterMap.value
          });
        detail = Translations.getTranslatedString(
          'oj-converter.datetime.datetimeOutOfRange.detail', {
            minValue: parameterMap.minValue,
            maxValue: parameterMap.maxValue
          });
        converterError = new oj.ConverterError(summary, detail);
      }
    } else if (e instanceof SyntaxError) {
      if (errorCode === 'optionValueInvalid') {
        converterError = __ConverterUtilsI18n.IntlConverterUtils.__getConverterOptionError(
          errorCode, parameterMap);
      }
    } else if (e instanceof Error) {
      if (errorCode === 'dateFormatMismatch') {
        // The '{value}' does not match the expected date format '{format}'.
        resourceKey = 'oj-converter.datetime.dateFormatMismatch.summary';
      } else if (errorCode === 'timeFormatMismatch') {
        // The {value} does not match the expected time format {format}.
        resourceKey = 'oj-converter.datetime.timeFormatMismatch.summary';
      } else if (errorCode === 'datetimeFormatMismatch') {
        resourceKey = 'oj-converter.datetime.datetimeFormatMismatch.summary';
      } else if (errorCode === 'invalidTimeZoneID') {
        summary = Translations.getTranslatedString(
          'oj-converter.datetime.invalidTimeZoneID.summary',
          { timeZoneID: parameterMap.timeZoneID }
        );
        detail = Translations.getTranslatedString('oj-converter.hint.detail', {
          exampleValue: this._getHintValue()
        });

        converterError = new oj.ConverterError(summary, detail);
      } else if (errorCode === 'nonExistingTime') {
        resourceKey = 'oj-converter.datetime.nonExistingTime.summary';
      } else if (errorCode === 'missingTimeZoneData') {
        resourceKey = 'oj-converter.datetime.missingTimeZoneData.summary';
      } else if (errorCode === 'dateToWeekdayMismatch') {
        summary =
          Translations.getTranslatedString(
            'oj-converter.datetime.dateToWeekdayMismatch.summary',
            { date: parameterMap.date, weekday: parameterMap.weekday }
          );
        detail = Translations.getTranslatedString(
          'oj-converter.datetime.dateToWeekdayMismatch.detail'
        );
        converterError = new oj.ConverterError(summary, detail);
      } else if (errorCode === 'invalidISOString') {
        summary = Translations.getTranslatedString(
          'oj-converter.datetime.invalidISOString.summary',
          { isoStr: parameterMap.isoStr }
        );
        detail = Translations.getTranslatedString(
          'oj-converter.datetime.invalidISOString.detail'
        );
        converterError = new oj.ConverterError(summary, detail);
      }

      if (resourceKey) {
        summary = Translations.getTranslatedString(resourceKey, {
          value: value || parameterMap.value,
          format: parameterMap.format
        });

        detail = Translations.getTranslatedString(
          'oj-converter.hint.detail',
          { exampleValue: this._getHintValue() }
        );

        converterError = new oj.ConverterError(summary, detail);
      }
    }
  }

  if (!converterError) {
    // An error we are unfamiliar with. Get the message and set as detail
    summary = e.message; // TODO: What should the summary be when it's missing??
    detail = e.message;
    converterError = new oj.ConverterError(summary, detail);
  }

  return converterError;
};

/**
 * Checks to see if an option is present in the resolved options.
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
 */
IntlDateTimeConverter.prototype.getAvailableTimeZones = function () {
  return this._getWrapped().getAvailableTimeZones(LocaleData.__getBundle());
};

/**
 * Internal API to getTimePositioning.
 * @returns {Object} json object of the positioning with h + m as keys
 * @export
 * @ignore
 */
IntlDateTimeConverter.prototype._getTimePositioning = function (param) {
  var resolvedOption;
  if (param === null) {
    resolvedOption = this.resolvedOptions();
  } else {
    resolvedOption = param;
  }
  return this._getWrapped().getTimePositioning(LocaleData.__getBundle(),
                                               resolvedOption,
                                               Config.getLocale());
};



var __ConverterDateTime = {};
// eslint-disable-next-line no-undef
__ConverterDateTime.DateTimeConverter = DateTimeConverter;
// eslint-disable-next-line no-undef
__ConverterDateTime.IntlDateTimeConverter = IntlDateTimeConverter;



/**
 * This is a forked version of globalize.js
 */
/*
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */

/* global OraTimeZone:false, __ConverterUtilsI18n:false */

/**
 * @constructor
 *
 * @classdesc OraDateTimeConverter object implements date-time parsing and formatting and
 * relative date formatting.
 * <p>
 * There are several ways to use the converter.
 * <ul>
 * <li>Using options defined by the ECMA 402 Specification, these would be the properties year,
 * month, day, hour, minute, second, weekday, era, timeZone, hour12</li>
 * <li>Using a custom date and/or time format pattern using the 'pattern' property</li>
 * <li>Using the standard date, datetime and time format lengths defined by Unicode CLDR, these
 * would include the properties formaType, dateFormat, timeFormat.</li>
 * </ul>
 *
 * <p>
 * The options when specified take precendence in the following order:<br>
 * 1. pattern.<br>
 * 2. ECMA options.<br>
 * 3. formatType/dateFormat/timeFormat.
 * <p>
 * The converter provides great leniency when parsing a user input value to a date in the following
 * ways: <br/>
 * <ul>
 * <li>Allows use of any character for separators irrespective of the separator specified in the
 * associated pattern. E.g., if pattern is set to 'y-M-d', the following values are all valid -
 * 2013-11-16, 2013/11-16 and 2013aaa11xxx16.</li>
 * <li>Allows specifying 4 digit year in any position in relation to day and month. E.g., 11-2013-16
 * or 16-11-2013</li>
 * <li>Supports auto-correction of value, when month and day positions are swapped as long as the
 * date is > 12 when working with the Gregorian calendar. E.g., if the pattern is 'y-M-d',
 * 2013-16-11 will be auto-corrected to 2013-11-16. However if both date and month are less or equal
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
 * <p>
 * Lenient parse can be disabled by setting the property lenientParse to "none". In which case the user input must
 * be an exact match of the expected pattern and all the leniency described above will be disabled.
 * @property {Object=} options - an object literal used to provide  optional information to
 * the converter.<p>
 * @property {string=} options.year - allowed values are "2-digit", "numeric". When no options are
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
 * @property {number=} options.two-digit-year-start - the 100-year period 2-digit year.
 * During parsing, two digit years will be placed in the range two-digit-year-start to two-digit-year-start + 100 years.
 * The default is 1950.
 * <p style='padding-left: 5px;'>
 * Example: if two-digit-year-start is 1950, 10 is parsed as 2010<br/><br/>
 * Example: if two-digit-year-start is 1900, 10 is parsed as 1910
 * </p>
 *
 * @property {string=} options.month - specifies how the month is formatted. Allowed values are
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
 * @property {string=} options.day - specifies how the day is formatted. Allowed values are "2-digit",
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
 * @property {string=} options.hour - specifies how the hour is formatted. Allowed values are
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
 * @property {string=} options.minute - specifies how the minute is formatted. Allowed values are
 * "2-digit", "numeric". Although allowed values for minute are numeric and 2-digit, minute is always
 * displayed as 2 digits: 00-59.
 *
 * @property {string=} options.second - specifies whether the second should be displayed as "2-digit"
 * or "numeric". Although allowed values for second are numeric and 2-digit, second is always displayed
 * as 2 digits: 00-59.
 *
 * @property {string=} options.millisecond - specifies whether the millisecond should be displayed.
 * Allowed value is "numeric".
 *
 * @property {string=} options.weekday - specifies how the day of the week is formatted. If absent, it
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
 * @property {string=} options.era - specifies how the era is included in the formatted date. If
 * absent, it is not included in the date formatting. Allowed values are "narrow", "short", "long".
 * Although allowed values are narrow, short, long, we only display era in abbreviated format: BC, AD.
 *
 * @property {string=} options.timeZoneName - allowed values are "short", "long".
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
 * @property {string=} options.timeZone - The possible values of the timeZone property are valid IANA
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
 * @property {string=} options.isoStrFormat - specifies in which format the ISO string is returned.
 * The possible values of isoStrFormat are: "offset", "zulu", "local", "auto".
 * The default format is auto.
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
 *       <td>2016-01-05T11:30:00-08:00</td>
 *     </tr>
 *     <tr>
 *       <td>zulu</td>
 *       <td>zulu time or UTC time.</td>
 *       <td>2016-01-05T19:30:00Z</td>
 *     </tr>
 *     <tr>
 *       <td>local</td>
 *       <td>local time, does not contain time zone offset.</td>
 *       <td>2016-01-05T19:30:00</td>
 *     </tr>
 *     <tr>
 *       <td>auto</td>
 *       <td>auto means the returned ISO string depends on the input string and options</td>
 *       <td></td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.dst - The dst option can be used for time only values in conjunction with offset.
 * Setting dst to true indicates the time is in DST. By default the time is interpreted as standard time.
 * The possible values of dst are: "true" or "false". Default is "false".
 * <p style='padding-left: 5px;'>
 * Due to Daylight Saving Time, there is a possibility that a time exists twice If the time falls in the duplicate window
 * (switching from daylight saving time to standard time). The application can disambiguate the time in the overlapping
 * period using the dst option. Setting dst to true indicates the time is in DST. By default the time is interpreted as
 * standard time.<br/><br/>
 * Example: On November 1st, 2105 in US the time between 1 and 2 AM will be repeated. The dst option can indicate the
 * distinction as follows. Initially the time is in DST, so dst:'true' is specified.<br/>
 * var options = {formatType:'datetime', dateFormat:'short', timeFormat:'medium', timeZone:'America/Los_Angeles', isoStrFormat: 'offset', dst : true};<br/>
 * var localeElements = oj.getLocaleElemnts();<br/>
 * var str= "11/1/15 1:59:59 AM";<br/>
 * cnv.parse(str, localeElements, options);-->2015-11-01T01:59:59-07:00
 * <br/><br/>
 * If the user does not pass the dst option, the time will be interpreted as standard time.
 * var options = {formatType:'datetime', dateFormat:'short', timeFormat:'medium', timeZone:'America/Los_Angeles'};<br/>
 * var localeElements = oj.getLocaleElemnts();<br/>
 * var str= "11/1/15 1:59:59 AM";<br/>
 * cnv.parse(str, localeElements, options);-->2015-11-01T01:59:59-08:00
 * <br/><br/>
 * At 2AM, DST will be over and the clock brings back to 1AM. Then the dst option should be false or not specified.
 * var options = {formatType:'datetime', dateFormat:'short', timeFormat:'medium', timeZone:'America/Los_Angeles', isoStrFormat: 'offset'};<br/>
 * var localeElements = oj.getLocaleElemnts();<br/>
 * var str= "11/1/15 1:00:00 AM";<br/>
 * cnv.parse(str, localeElements, options);-->2015-11-01T01:00:00-08:00
 * </p>
 *
 * @property {boolean=} options.hour12 - specifies what time notation is used for formatting the time.
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
 *       <td>T13:10  is formatted as 1:10 PM</td>
 *     </tr>
 *     <tr>
 *       <td>false</td>
 *       <td>T13:10 is formatted as 13:10</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.pattern - a localized string pattern, where the the characters used in
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
 *
 * @property {string=} options.formatType - determines the 'standard' date and/or time format lengths
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
 *       <td>September 20, 2015 12:04 PM September 20, 2015 12:05:35 PM Pacific Daylight Time</td>
 *     </tr>
 *     <tr>
 *       <td>date</td>
 *       <td>date portion only is displayed.</td>
 *       <td>September 20, 2015</td>
 *     </tr>
 *     <tr>
 *       <td>time</td>
 *       <td>time portion only is displayed.</td>
 *       <td>12:05:35</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.dateFormat - specifies the standard date format length to use when
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
 * @property {string=} options.timeFormat - specifies the standard time format length to use when
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
 *  @property {string=} options.lenientParse - The lenientParse property can be used to enable or disable leninet parsing.
 *  Allowed values: "full" (default), "none".
 * <p style='padding-left: 5px;'>
 * By default the lenient parse is enabled and the leniency rules descibed above will be used. When lenientParse is
 * set to "none" the lenient parse is disabled and the user input must match the expected input otherwise an exception will
 * be thrown.<br/><br/>
 *
 * </p>
 *
 * @example <caption>Create a date time converter using no options. This uses the default value for
 * year, month, day properties</caption>
 * var converter = OraDateTimeConverter.getInstance();
 * var localeElements;
 * var resolved = converter.resolvedOptions(localeElements);
 * // logs "day=numeric, month=numeric, year=numeric"
 * console.log("day=" + resolved.day + ", month=" + resolved.month + ", year=" + resolved.year);
 * <br/>
 *
 * @example <caption>Use a converter using the ECMA options to represent date</caption>
 * var options = { year:'2-digit', month: '2-digit', day: '2-digit'};
 * var localeElements;
 * var converter = OraDateTimeConverter.getInstance();
 * var date = "2016-04-17";
 * var str = converter.format(date, localeElements, options);<br/>
 *
 *
 * @example <caption>Converter using the 'pattern' option</caption>
 * var options = {pattern: 'MM-dd-yyyy'};
 * var localeElements;
 * var converter = OraDateTimeConverter.getInstance();
 * var date = "2016-04-17";
 * var str = converter.format(date, localeElements, options);<br/>
 *
 * @example <caption>Converter using predefined style</caption>
 * var options = {formatType: 'date', dateFormat: 'medium'};
 * var localeElements;
 * var converter = OraDateTimeConverter.getInstance();
 * var date = "2016-04-17";
 * var str = converter.format(date, localeElements, options);<br/>
 *
 * @example <caption>Create a date time converter using specific pattern with IANA timezone ID with
 * isoStrFormat of offset.</caption>
 * var options = {pattern: 'MM/dd/yy hh:mm:ss a Z', timeZone: 'America/Los_Angeles', isoStrFormat: 'offset'};
 * var localeElements;
 * var converter = OraDateTimeConverter.getInstance();
 * var date = "2016-04-17T13:05:30";
 * var str = converter.format(date, localeElements, options);<br/>
 *
 * @example <caption>Create a date time converter using specific pattern with Etc/GMT timezone ID with
 * isoStrFormat of zulu.</caption>
 * var options = {pattern: 'MM/dd/yy hh:mm:ss a Z', timeZone: 'Etc/GMT-08:00', isoStrFormat: 'zulu'};
 * var localeElements;
 * var converter = OraDateTimeConverter.getInstance();
 * var str = "01/05/16 01:01:01 AM +0800";
 * var obj = converter.parse(str, localeElements, options);<br/>
 *
 * @example <caption>Disable lenient parse.</caption>
 * var options = {pattern: 'MM/dd/yy', lenientParse:'none'};
 * var localeElements;
 * var converter = OraDateTimeConverter.getInstance();
 * var str = "14/05/16";
 * var obj = converter.parse(str, localeElements, options); --> RangeError: 13 is out of range.  Enter a value between 1 and 12 for month.<br/>
 * @name OraDateTimeConverter
 * @ignore
 */

/**
 * @ignore
 */
var OraDateTimeConverter;

OraDateTimeConverter = (function () {
  var instance;
  var _localeDataCache = {};
  var _timeZoneDataCache = {};

  var _YEAR_AND_DATE_REGEXP = /(\d{1,4})\D+?(\d{1,4})/g;
  var _YMD_REGEXP = /(\d{1,4})\D+?(\d{1,4})\D+?(\d{1,4})/g;
  var _MONTH_REGEXP_FMT = /^[M][^M]|[^M]M[^M]|[^M]M$|^M$/g;
  var _MONTH_REGEXP_STD = /^[L][^L]|[^L]L[^L]|[^L]L$|^L$/g;
  var _DAY_REGEXP = /^[d][^d]|[^d]d[^d]|[^d]d$|^d$|^d[^d]/;
  var _HOUR_REGEXP = /(?:^|[^h])h[^h]|[^H]H[^H]|[^k]k[^k]|[^K]K[^K]|^H[^H]|^H$|[^h]h$/;
  var _COMMENT_REGEXP = /'.*'/;
  var _DAY_COMMENT_REGEXP = /'[^d]*d[^d]*'/;
  var _TIME_REGEXP = /(\d{1,2})(?:\D+?(\d{1,2}))?(?:\D+?(\d{1,2}))?(?:\D+?(\d{1,3}))?/g;
  var _TIME_FORMAT_REGEXP = /h|H|K|k/g;

  // This eslint disable require to make eacs happy
  // eslint-disable-next-line no-useless-escape
  var _ESCAPE_REGEXP = /([\^$.*+?|\[\](){}])/g;

  var _TOKEN_REGEXP = /ccccc|cccc|ccc|cc|c|EEEEE|EEEE|EEE|EE|E|dd|d|MMMMM|MMMM|MMM|MM|M|LLLLL|LLLL|LLL|LL|L|yyyy|yy|y|hh|h|HH|H|KK|K|kk|k|mm|m|ss|s|aa|a|SSS|SS|S|zzzz|zzz|zz|z|v|ZZZ|ZZ|Z|XXX|XX|X|VV|GGGGG|GGGG|GGG|GG|G/g;
  var _TIME_FORMATS_Z_TOKENS = /\s?(?:\(|\[)?z{1,4}(?:\)|\])?/g;
  var tzNotSupported = false;
  var _DAYS_INDEXES = {
    0: 'sun',
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat'
  };

  var _THRESHOLDS = {
    s: 46, // seconds to minute
    m: 46, // minutes to hour
    h: 23, // hours to day
    d: 7, // days to week
    w: 4, // weeks to
    M: 12   // months to year
  };

  var _ZULU = 'zulu';
  var _LOCAL = 'local';
  var _AUTO = 'auto';
  var _INVARIANT = 'invariant';
  var _OFFSET = 'offset';
  var _UTC = 'UTC';

  var _ALNUM_REGEXP = '(\\D+|\\d\\d?\\D|\\d\\d?|\\D+\\d\\d?)';
  var _NON_DIGIT_REGEXP = '(\\D+|\\D+\\d\\d?)';
  var _NON_DIGIT_OPT_REGEXP = '(\\D*)';
  var _STR_REGEXP = '(.+?)';
  var _TWO_DIGITS_REGEXP = '(\\d\\d?)';
  var _THREE_DIGITS_REGEXP = '(\\d{1,3})';
  var _FOUR_DIGITS_REGEXP = '(\\d{1,4})';
  var _TZ_HM_REGEXP = '([+-]?\\d{1,4})';
  var _TZ_H_REGEXP = '([+-]?\\d{1,2})';
  var _TZ_H_SEP_M_REGEXP = '([+-]?\\d{1,2}:\\d{1,2})';
  var _SLASH_REGEXP = '(\\/)';

  var _PROPERTIES_MAP = {
    MMM: {
      token: 'months',
      style: 'format',
      mLen: 'abbreviated',
      matchIndex: 0,
      key: 'month',
      value: 'short',
      regExp: _ALNUM_REGEXP
    },
    MMMM: {
      token: 'months',
      style: 'format',
      mLen: 'wide',
      matchIndex: 0,
      key: 'month',
      value: 'long',
      regExp: _ALNUM_REGEXP
    },
    MMMMM: {
      token: 'months',
      style: 'format',
      mLen: 'narrow',
      matchIndex: 0,
      key: 'month',
      value: 'narrow',
      regExp: _ALNUM_REGEXP
    },
    LLL: {
      token: 'months',
      style: 'stand-alone',
      mLen: 'abbreviated',
      matchIndex: 1,
      key: 'month',
      value: 'short',
      regExp: _ALNUM_REGEXP
    },
    LLLL: {
      token: 'months',
      style: 'stand-alone',
      mLen: 'wide',
      matchIndex: 1,
      key: 'month',
      value: 'long',
      regExp: _ALNUM_REGEXP
    },
    LLLLL: {
      token: 'months',
      style: 'stand-alone',
      mLen: 'narrow',
      matchIndex: 1,
      key: 'month',
      value: 'narrow',
      regExp: _ALNUM_REGEXP
    },
    E: {
      token: 'days',
      style: 'format',
      dLen: 'abbreviated',
      matchIndex: 0,
      key: 'weekday',
      value: 'short',
      regExp: _NON_DIGIT_REGEXP
    },
    EE: {
      token: 'days',
      style: 'format',
      dLen: 'abbreviated',
      matchIndex: 0,
      key: 'weekday',
      value: 'short',
      regExp: _NON_DIGIT_REGEXP
    },
    EEE: {
      token: 'days',
      style: 'format',
      dLen: 'abbreviated',
      matchIndex: 0,
      key: 'weekday',
      value: 'short',
      regExp: _NON_DIGIT_REGEXP
    },
    EEEE: {
      token: 'days',
      style: 'format',
      dLen: 'wide',
      matchIndex: 0,
      key: 'weekday',
      value: 'long',
      regExp: _NON_DIGIT_REGEXP
    },
    EEEEE: {
      token: 'days',
      style: 'format',
      dLen: 'narrow',
      matchIndex: 0,
      key: 'weekday',
      value: 'narrow',
      regExp: _NON_DIGIT_REGEXP
    },
    c: {
      token: 'days',
      style: 'stand-alone',
      dLen: 'abbreviated',
      matchIndex: 1,
      key: 'weekday',
      value: 'short',
      regExp: _NON_DIGIT_REGEXP
    },
    cc: {
      token: 'days',
      style: 'stand-alone',
      dLen: 'abbreviated',
      matchIndex: 1,
      key: 'weekday',
      value: 'short',
      regExp: _NON_DIGIT_REGEXP
    },
    ccc: {
      token: 'days',
      style: 'stand-alone',
      dLen: 'abbreviated',
      matchIndex: 1,
      key: 'weekday',
      value: 'short',
      regExp: _NON_DIGIT_REGEXP
    },
    cccc: {
      token: 'days',
      style: 'stand-alone',
      dLen: 'wide',
      matchIndex: 1,
      key: 'weekday',
      value: 'long',
      regExp: _NON_DIGIT_REGEXP
    },
    ccccc: {
      token: 'days',
      style: 'stand-alone',
      dLen: 'narrow',
      matchIndex: 1,
      key: 'weekday',
      value: 'narrow',
      regExp: _NON_DIGIT_REGEXP
    },
    h: {
      token: 'time',
      timePart: 'hour',
      start1: 0,
      end1: 11,
      start2: 1,
      end2: 12,
      key: 'hour',
      value: 'numeric',
      regExp: _TWO_DIGITS_REGEXP
    },
    hh: {
      token: 'time',
      timePart: 'hour',
      start1: 0,
      end1: 11,
      start2: 1,
      end2: 12,
      key: 'hour',
      value: '2-digit',
      regExp: _TWO_DIGITS_REGEXP
    },
    K: {
      token: 'time',
      timePart: 'hour',
      start1: 0,
      end1: 11,
      start2: 0,
      end2: 11,
      key: 'hour',
      value: 'numeric',
      regExp: _TWO_DIGITS_REGEXP
    },
    KK: {
      token: 'time',
      timePart: 'hour',
      start1: 0,
      end1: 11,
      start2: 0,
      end2: 11,
      key: 'hour',
      value: '2-digit',
      regExp: _TWO_DIGITS_REGEXP
    },
    H: {
      token: 'time',
      timePart: 'hour',
      start1: 0,
      end1: 23,
      start2: 0,
      end2: 23,
      key: 'hour',
      value: 'numeric',
      regExp: _TWO_DIGITS_REGEXP
    },
    HH: {
      token: 'time',
      timePart: 'hour',
      start1: 0,
      end1: 23,
      start2: 0,
      end2: 23,
      key: 'hour',
      value: '2-digit',
      regExp: _TWO_DIGITS_REGEXP
    },
    k: {
      token: 'time',
      timePart: 'hour',
      start1: 0,
      end1: 23,
      start2: 1,
      end2: 24,
      key: 'hour',
      value: 'numeric',
      regExp: _TWO_DIGITS_REGEXP
    },
    kk: {
      token: 'time',
      timePart: 'hour',
      start1: 0,
      end1: 23,
      start2: 1,
      end2: 24,
      key: 'hour',
      value: '2-digit',
      regExp: _TWO_DIGITS_REGEXP
    },
    m: {
      token: 'time',
      timePart: 'minute',
      start1: 0,
      end1: 59,
      start2: 0,
      end2: 59,
      key: 'minute',
      value: 'numeric',
      regExp: _TWO_DIGITS_REGEXP
    },
    mm: {
      token: 'time',
      timePart: 'minute',
      start1: 0,
      end1: 59,
      start2: 0,
      end2: 59,
      key: 'minute',
      value: '2-digit',
      regExp: _TWO_DIGITS_REGEXP
    },
    s: {
      token: 'time',
      timePart: 'second',
      start1: 0,
      end1: 59,
      start2: 0,
      end2: 59,
      key: 'second',
      value: 'numeric',
      regExp: _TWO_DIGITS_REGEXP
    },
    ss: {
      token: 'time',
      timePart: 'second',
      start1: 0,
      end1: 59,
      start2: 0,
      end2: 59,
      key: 'second',
      value: '2-digit',
      regExp: _TWO_DIGITS_REGEXP
    },
    S: {
      token: 'time',
      timePart: 'millisec',
      start1: 0,
      end1: 999,
      start2: 0,
      end2: 999,
      key: 'millisecond',
      value: 'numeric',
      regExp: _THREE_DIGITS_REGEXP
    },
    SS: {
      token: 'time',
      timePart: 'millisec',
      start1: 0,
      end1: 999,
      start2: 0,
      end2: 999,
      key: 'millisecond',
      value: 'numeric',
      regExp: _THREE_DIGITS_REGEXP
    },
    SSS: {
      token: 'time',
      timePart: 'millisec',
      start1: 0,
      end1: 999,
      start2: 0,
      end2: 999,
      key: 'millisecond',
      value: 'numeric',
      regExp: _THREE_DIGITS_REGEXP
    },
    d: {
      token: 'dayOfMonth',
      key: 'day',
      value: 'numeric',
      getPartIdx: 2,
      regExp: _TWO_DIGITS_REGEXP
    },
    dd: {
      token: 'dayOfMonth',
      key: 'day',
      value: '2-digit',
      getPartIdx: 2,
      regExp: _TWO_DIGITS_REGEXP
    },
    M: {
      token: 'monthIndex',
      key: 'month',
      value: 'numeric',
      getPartIdx: 1,
      regExp: _TWO_DIGITS_REGEXP
    },
    MM: {
      token: 'monthIndex',
      key: 'month',
      value: '2-digit',
      getPartIdx: 1,
      regExp: _TWO_DIGITS_REGEXP
    },
    L: {
      token: 'monthIndex',
      key: 'month',
      value: 'numeric',
      getPartIdx: 1,
      regExp: _TWO_DIGITS_REGEXP
    },
    LL: {
      token: 'monthIndex',
      key: 'month',
      value: '2-digit',
      getPartIdx: 1,
      regExp: _TWO_DIGITS_REGEXP
    },
    y: {
      token: 'year',
      key: 'year',
      value: 'numeric',
      regExp: _FOUR_DIGITS_REGEXP
    },
    yy: {
      token: 'year',
      key: 'year',
      value: '2-digit',
      regExp: _TWO_DIGITS_REGEXP
    },
    yyyy: {
      token: 'year',
      key: 'year',
      value: 'numeric',
      regExp: _FOUR_DIGITS_REGEXP
    },
    a: {
      token: 'ampm',
      key: 'hour12',
      value: true,
      regExp: _NON_DIGIT_OPT_REGEXP
    },
    z: {
      token: 'tzAbbrev',
      regExp: _STR_REGEXP
    },
    v: {
      token: 'tzAbbrev',
      key: 'timeZoneName',
      value: 'short',
      regExp: _STR_REGEXP
    },
    zz: {
      token: 'tzAbbrev',
      regExp: _STR_REGEXP
    },
    zzz: {
      token: 'tzAbbrev',
      regExp: _STR_REGEXP
    },
    zzzz: {
      token: 'tzFull',
      regExp: _STR_REGEXP
    },
    Z: {
      token: 'tzhm',
      regExp: _TZ_HM_REGEXP
    },
    ZZ: {
      token: 'tzhm',
      regExp: _TZ_HM_REGEXP
    },
    ZZZ: {
      token: 'tzhm',
      regExp: _TZ_HM_REGEXP
    },
    X: {
      token: 'tzh',
      regExp: _TZ_H_REGEXP
    },
    XX: {
      token: 'tzhm',
      key: 'XX',
      regExp: _TZ_HM_REGEXP
    },
    XXX: {
      token: 'tzhsepm',
      regExp: _TZ_H_SEP_M_REGEXP
    },
    VV: {
      token: 'tzid',
      regExp: _STR_REGEXP
    },
    G: {
      token: 'era',
      key: 'era',
      value: 'short',
      regExp: _NON_DIGIT_REGEXP
    },
    GG: {
      token: 'era',
      key: 'era',
      value: 'short',
      regExp: _NON_DIGIT_REGEXP
    },
    GGG: {
      token: 'era',
      key: 'era',
      value: 'short',
      regExp: _NON_DIGIT_REGEXP
    },
    GGGG: {
      token: 'era',
      key: 'era',
      value: 'long',
      regExp: _NON_DIGIT_REGEXP
    },
    GGGGG: {
      token: 'era',
      key: 'era',
      value: 'narrow',
      regExp: _NON_DIGIT_REGEXP
    },
    '/': {
      token: 'slash',
      regExp: _SLASH_REGEXP
    }
  };


  /*
   *Helper functions
   */
  function _get2DigitYearStart(options) {
    var option = options['two-digit-year-start'];
    if (option === undefined || isNaN(option)) {
      option = 1950;
    }
    option = parseInt(option, 10);
    return option;
  }

  // Each locale has 12 or 24 hour preferred format
  function _isHour12(localeElements) {
    var locale = localeElements._ojLocale_;
    var territory = __ConverterUtilsI18n.OraI18nUtils.getBCP47Region(locale);
    var prefferedHours = localeElements.supplemental.prefferedHours;
    var hour12 = prefferedHours[territory];
    return hour12 === 'h';
  }

  // returns the locale's pattern from the predefined styles.
  // EX: for en-US dateFormat:"full" returns the pattern "EEEE, MMMM d, y".
  function _expandPredefinedStylesFormat(options, localeElements, caller) {
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(options, caller);
    var fmtType = getOption('formatType', 'string',
                            ['date', 'time', 'datetime'], 'date');
    var dStyle = getOption('dateFormat', 'string',
                           ['short', 'medium', 'long', 'full'], 'short');
    var tStyle = getOption('timeFormat', 'string',
                           ['short', 'medium', 'long', 'full'], 'short');
    var cal = mainNode.dates.calendars.gregorian;
    var dateFormats = cal.dateFormats;
    var timeFormats = cal.timeFormats;

    var dStyleFmt;
    var tStyleFmt;
    var format;
    switch (dStyle) {
      case 'full' :
        dStyleFmt = dateFormats.full;
        break;
      case 'long' :
        dStyleFmt = dateFormats.long;
        break;
      case 'medium' :
        dStyleFmt = dateFormats.medium;
        break;
      case 'short' :
        dStyleFmt = dateFormats.short;
        break;
      default:
        break;
    }
    switch (tStyle) {
      case 'full' :
        tStyleFmt = timeFormats.full;
        break;
      case 'long' :
        tStyleFmt = timeFormats.long;
        break;
      case 'medium' :
        tStyleFmt = timeFormats.medium;
        break;
      case 'short' :
        tStyleFmt = timeFormats.short;
        break;
      default:
        break;
    }
    if (dStyleFmt !== undefined &&
        (fmtType === 'datetime' || fmtType === 'date')) {
      format = dStyleFmt;
    }
    if (tStyleFmt !== undefined && (fmtType === 'datetime' ||
        fmtType === 'time')) {
      if (tzNotSupported) {
        tStyleFmt = tStyleFmt.replace(_TIME_FORMATS_Z_TOKENS, '');
      }
      if (format) {
        format = format + ' ' + tStyleFmt;
      } else {
        format = tStyleFmt;
      }
    }
    return format;
  }

  // appends pre- and post- token match strings while removing escaped
  // characters.
  // Returns a single quote count which is used to determine if the
  // token occurs
  // in a string literal.
  function _appendPreOrPostMatch(preMatch, strings) {
    var quoteCount = 0;
    var escaped = false;
    for (var i = 0, il = preMatch.length; i < il; i++) {
      var c = preMatch.charAt(i);
      switch (c) {
        case "'":
          if (escaped) {
            strings.push("'");
          } else {
            quoteCount += 1;
          }
          escaped = false;
          break;
        case '\\':
          if (escaped) {
            strings.push('\\');
          }
          escaped = !escaped;
          break;
        default:
          strings.push(c);
          escaped = false;
          break;
      }
    }
    return quoteCount;
  }

  // Throw an exception if date-time pattern is invalid
  function _throwInvalidDateFormat(format, options, m) {
    var isDate = (options.year !== undefined || options.month !== undefined ||
                  options.weekday !== undefined || options.day !== undefined);
    var isTime = (options.hour !== undefined || options.minute !== undefined ||
                  options.second !== undefined);

    var samplePattern;
    if (isDate && isTime) {
      samplePattern = 'MM/dd/yy hh:mm:ss a';
    } else if (isDate) {
      samplePattern = 'MM/dd/yy';
    } else {
      samplePattern = 'hh:mm:ss a';
    }

    var msg = 'Unexpected character(s) ' + m + ' encountered in the pattern "' +
        format + ' An example of a valid pattern is "' + samplePattern + '".';
    var error = new SyntaxError(msg);
    var errorInfo = {
      errorCode: 'optionValueInvalid',
      parameterMap: {
        propertyName: 'pattern',
        propertyValue: format,
        'propertyValueHint ': samplePattern
      }
    };
    error.errorInfo = errorInfo;
    throw error;
  }

  // implementation of basic forat matcher algorithm from ECMA spec.
  // This impelmentation takes into consideration hour12, For example if
  // hour12=true, H entries are removed from availableFormats in order to
  // avoid wrong matching for hour.
  function _basicFormatMatcher(dateTimeKeys, localeElements, isDate, hour12) {
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var availableFormats = mainNode.dates.calendars.gregorian.dateTimeFormats.availableFormats;
    var dateTimeFormats = [
      'weekday', 'era', 'year', 'month', 'day',
      'hour', 'minute', 'second', 'timeZoneName'
    ];
    var values = {
      '2-digit': 0,
      numeric: 1,
      narrow: 2,
      short: 3,
      long: 4
    };

    var removalPenalty = 120;
    var additionPenalty = 20;
    var longLessPenalty = 8;
    var longMorePenalty = 6;
    var shortLessPenalty = 6;
    var shortMorePenalty = 3;
    var bestScore = -Infinity;
    var bestFormat;
    var formatIds = Object.keys(availableFormats);

    for (var i = 0; i < formatIds.length; i++) {
      var formatId = formatIds[i];
      var skip = false;
      var format = {};
      format.pattern = availableFormats[formatId];
      var score = 0;
      var match = _TOKEN_REGEXP.exec(formatId);
      while (match !== null) {
        var m = match[0];
        if ((m === 'h' || m === 'hh') && !hour12) {
          skip = true;
        } else if ((m === 'H' || m === 'HH') && hour12) {
          skip = true;
        } else if (_PROPERTIES_MAP[m] !== undefined) {
          format[_PROPERTIES_MAP[m].key] = _PROPERTIES_MAP[m].value;
        }
        match = _TOKEN_REGEXP.exec(formatId);
      }
      if (!skip) {
        for (var j = 0; j < dateTimeFormats.length; j++) {
          var optionsProp = dateTimeKeys[dateTimeFormats[j]];
          var formatProp = format[dateTimeFormats[j]];
          if (optionsProp === undefined && formatProp !== undefined) {
            score -= additionPenalty;
          } else if (optionsProp !== undefined && formatProp === undefined) {
            score -= removalPenalty;
          } else if (optionsProp !== undefined) {
            var optionsPropIndex = values[optionsProp];
            var formatPropIndex = values[formatProp];
            var delta = Math.max(Math.min(formatPropIndex -
                                          optionsPropIndex, 2), -2);
            if (delta === 2) {
              score -= longMorePenalty;
            } else if (delta === 1) {
              score -= shortMorePenalty;
            } else if (delta === -1) {
              score -= shortLessPenalty;
            } else if (delta === -2) {
              score -= longLessPenalty;
            }
          }
        }
        if (score > bestScore) {
          bestScore = score;
          bestFormat = format;
        }
      }
    }
    if (bestFormat !== undefined) {
      return bestFormat.pattern;
    }
    return null;
  }

  // Return a format key from ecma options. For example:
  // {year:"2-digit", month:"long", day:"numeric", weekday:"long"};
  // will return "yyMMMMdEEEE"
  function _toAvailableFormatsKeys(options, localeElements, caller) {
    var dateKey = '';
    var timeKey = '';
    var dateOptions = {};
    var timeOptions = {};

    var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(options, caller);

    // date key
    var option = getOption('era', 'string', ['narrow', 'short', 'long']);
    dateKey += _appendToKey(dateOptions, 'era',
                            option, {
                              narrow: 'GGGGG',
                              short: 'GGG',
                              long: 'GGGG'
                            });

    option = getOption('year', 'string', ['2-digit', 'numeric']);
    dateKey += _appendToKey(dateOptions, 'year',
                            option, {
                              '2-digit': 'yy',
                              numeric: 'y'
                            });

    option = getOption('month', 'string',
                       ['2-digit', 'numeric', 'narrow', 'short', 'long']);
    dateKey += _appendToKey(dateOptions, 'month', option, {
      '2-digit': 'MM',
      numeric: 'M',
      narrow: 'MMMMM',
      short: 'MMM',
      long: 'MMMM'
    });

    option = getOption('weekday', 'string', ['narrow', 'short', 'long']);
    dateKey += _appendToKey(dateOptions, 'weekday', option, {
      narrow: 'EEEEE',
      short: 'E',
      long: 'EEEE'
    });

    option = getOption('day', 'string', ['2-digit', 'numeric']);
    dateKey += _appendToKey(dateOptions, 'day', option, {
      '2-digit': 'dd',
      numeric: 'd'
    });

    // time key
    var hr12 = getOption('hour12', 'boolean', [true, false]);
    if (hr12 === undefined) {
      hr12 = _isHour12(localeElements);
    }
    option = getOption('hour', 'string', ['2-digit', 'numeric']);
    if (hr12 === true) {
      timeKey += _appendToKey(timeOptions, 'hour', option, {
        '2-digit': 'hh',
        numeric: 'h'
      });
    } else {
      timeKey += _appendToKey(timeOptions, 'hour', option, {
        '2-digit': 'HH',
        numeric: 'H'
      });
    }

    option = getOption('minute', 'string', ['2-digit', 'numeric']);
    timeKey += _appendToKey(timeOptions, 'minute', option, {
      '2-digit': 'mm',
      numeric: 'm'
    });

    option = getOption('second', 'string', ['2-digit', 'numeric']);
    timeKey += _appendToKey(timeOptions, 'second', option, {
      '2-digit': 'ss',
      numeric: 's'
    });
    option = getOption('timeZoneName', 'string', ['short', 'long']);
    timeKey += _appendToKey(timeOptions, 'timeZoneName', option, {
      short: 'v',
      long: 'v'
    });

    return [dateKey, timeKey, dateOptions, timeOptions];
  }

  function _appendToKey(obj, prop, option, pairs) {
    if (option !== undefined) {
      // eslint-disable-next-line no-param-reassign
      obj[prop] = option;
      return pairs[option];
    }

    return '';
  }

  /*
   *This function is used by the munger algorith. It expands a pattern
   *in order to match the user's ECMA options.
   *For example if the user provided options is
   *options = {year: 'numeric', month: 'long', weekday: 'long',
   *day : '2-digit'};
   *The key for these options is: yMMMMEEEEdd. under availableFormats,
   *we have the following entry: "yMMMEd": "E, MMM d, y".
   *The _basicFormatMatcher algorithm will find "yMMMEd" key as the
   *closest match to yMMMMEEEEdd. If formatMatcher ="munger", we will
   *expand the corresponding pattern to match the options.
   *So "E, MMM d, y" will be expanded to "EEEE, MMMM dd y".
   */
  function _expandAvailableDateFormatsPattern(formatTemplate, options, caller) {
    var datePat = formatTemplate;
    var match;
    var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(options, caller);
    // year
    var option = getOption('year', 'string', ['2-digit', 'numeric']);
    var pairs = {
      '2-digit': 'yy',
      numeric: 'yyyy'
    };
    if (option !== undefined) {
      datePat = datePat.replace(/y{1,4}/, pairs[option]);
    }

    // month
    option = getOption('month', 'string',
                       ['2-digit', 'numeric', 'narrow', 'short', 'long']);
    if (option !== undefined) {
      pairs = {
        '2-digit': 'MM',
        numeric: 'M',
        narrow: 'MMMMM',
        short: 'MMM',
        long: 'MMMM'
      };
      var pairsL = {
        '2-digit': 'LL',
        numeric: 'L',
        narrow: 'LLLLL',
        short: 'LLL',
        long: 'LLLL'
      };
      if (pairs[option] !== undefined && pairs[option].length > 2) {
        datePat = datePat.replace(/M{3,5}/, pairs[option]);
        datePat = datePat.replace(/L{3,5}/, pairsL[option]);
      } else if (option === '2-digit') {
        _MONTH_REGEXP_FMT.lastIndex = 0;
        match = _MONTH_REGEXP_FMT.test(formatTemplate);
        if (match) {
          datePat = datePat.replace('M', 'MM');
        }
        match = _MONTH_REGEXP_STD.test(formatTemplate);
        if (match) {
          datePat = datePat.replace('L', 'LL');
        }
      }
    }

    // weekday
    option = getOption('weekday', 'string', ['narrow', 'short', 'long']);
    if (option !== undefined) {
      var pairsFormat = {
        narrow: 'EEEEE',
        short: 'EEE',
        long: 'EEEE'
      };
      var pairsStandalone = {
        narrow: 'ccccc',
        short: 'ccc',
        long: 'cccc'
      };
      datePat = datePat.replace(/E{1,5}/, pairsFormat[option]);
      datePat = datePat.replace(/c{1,5}/, pairsStandalone[option]);
    }
    // day
    option = getOption('day', 'string', ['2-digit', 'numeric']);
    if (option !== undefined) {
      if (option === '2-digit') {
        _DAY_REGEXP.lastIndex = 0;
        _DAY_COMMENT_REGEXP.lastIndex = 0;
        var match1 = _DAY_COMMENT_REGEXP.test(formatTemplate);
        match = _DAY_REGEXP.test(formatTemplate);
        if (match === true && match1 === false) {
          datePat = datePat.replace('d', 'dd');
        }
      }
    }
    return datePat;
  }

  // Same as above for time entries
  function _expandAvailableTimeFormatsPattern(formatTemplate, options, caller) {
    var timePat = formatTemplate;
    var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(options, caller);
    var option = getOption('hour', 'string', ['2-digit', 'numeric']);
    if (option === '2-digit') {
      _HOUR_REGEXP.lastIndex = 0;
      _COMMENT_REGEXP.lastIndex = 0;
      var formatTemplate1 = formatTemplate.replace(_COMMENT_REGEXP, '');
      var match = _HOUR_REGEXP.exec(formatTemplate1);
      if (match !== null) {
        _TIME_FORMAT_REGEXP.lastIndex = 0;
        var match1 = _TIME_FORMAT_REGEXP.exec(match[0]);
        var ext = match1[0] + match1[0];
        timePat = formatTemplate.replace(match1[0], ext);
      }
    }
    return timePat;
  }

  function _getPatternFromSingleToken(token, tokenObj, availableFormats) {
    var count = Object.keys(tokenObj).length;

    if (count > 1) {
      return null;
    }
    var pattern;
    for (var i = token.length; i > 0; i--) {
      pattern = availableFormats[token.substr(0, i)];
      if (pattern !== undefined) {
        return pattern;
      }
    }
    return token;
  }

  // Returns the localized decimal separator. Used for milliseconds
  function _getLocaleDecimalSeparator(localeElements, locale) {
    var numberingSystemKey = __ConverterUtilsI18n.OraI18nUtils.getNumberingSystemKey(
      localeElements, locale);
    var numberingSystem = 'symbols-numberSystem-' + numberingSystemKey;
    return localeElements.numbers[numberingSystem].decimal;
  }

  // Returns a pattern corresponding to user's options.
  // Cache the entries for which we already found a pattern
  function _expandFormat(options, localeElements, mlocale, caller) {
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var locale = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
    var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(options, caller);
    var pattern;
    var matcher = getOption('formatMatcher', 'string',
                            ['basic', 'munger'], 'munger');
    var count = Object.keys(options).length;

    if (count === 0) {
      // eslint-disable-next-line no-param-reassign
      options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      };
    }
    var hOption;
    var mOption;

    // append millisecnods to pattern
    var msOption = getOption('millisecond', 'string', ['numeric', '2-digit']);
    var sOption = getOption('second', 'string', ['numeric', '2-digit']);
    if (msOption !== undefined) {
      hOption = getOption('hour', 'string', ['numeric', '2-digit']);
      mOption = getOption('minute', 'string', ['numeric', '2-digit']);
      // eslint-disable-next-line no-param-reassign
      options.second = '2-digit';
    }

    var dateTimeKeys = _toAvailableFormatsKeys(options, localeElements, caller);
    // First try to get the pattern from cache
    if (_localeDataCache[locale] !== undefined) {
      var cachedPattern = _localeDataCache[locale].dates.calendars.gregorian
      .dateTimeFormats[dateTimeKeys[0] + dateTimeKeys[1]];
      if (cachedPattern !== undefined) {
        cachedPattern = substituteTokens(cachedPattern);
        return cachedPattern;
      }
    }
    if (dateTimeKeys[0] === '' && dateTimeKeys[1] === '') {
      return _expandPredefinedStylesFormat(options, localeElements, caller);
    }
    var availableFormats = mainNode.dates.calendars.gregorian.dateTimeFormats.availableFormats;
    var datePattern = availableFormats[dateTimeKeys[0]];
    var hour12 = getOption('hour12', 'boolean', [true, false]);
    if (hour12 === undefined) {
      hour12 = _isHour12(localeElements);
    }
    if (datePattern === undefined && dateTimeKeys[0] !== '') {
      datePattern = _getPatternFromSingleToken(dateTimeKeys[0], dateTimeKeys[2],
          availableFormats);
      if (datePattern === null) {
        datePattern = _basicFormatMatcher(dateTimeKeys[2],
            localeElements, true, hour12);
      }
      if (datePattern !== null) {
        if (matcher !== 'basic') {
          datePattern = _expandAvailableDateFormatsPattern(
            datePattern, options, caller);
        }
      } else {
        datePattern = dateTimeKeys[0];
      }
    }
    var timePattern = availableFormats[dateTimeKeys[1]];
    if (timePattern === undefined && dateTimeKeys[1] !== '') {
      timePattern = _getPatternFromSingleToken(dateTimeKeys[1], dateTimeKeys[3],
                                               availableFormats);
      if (timePattern === null) {
        timePattern = _basicFormatMatcher(dateTimeKeys[3],
            localeElements, true, hour12);
      }
      if (timePattern !== null) {
        if (matcher !== 'basic') {
          timePattern = _expandAvailableTimeFormatsPattern(
              timePattern, options, caller);
        }
      } else {
        timePattern = dateTimeKeys[1];
      }
    }
    pattern = datePattern || '';
    if (timePattern !== undefined) {
      if (pattern !== '') {
        pattern += ' ' + timePattern;
      } else {
        pattern = timePattern;
      }
    }

    // cache the pattern
    if (_localeDataCache[locale] === undefined) {
      _localeDataCache[locale] = {};
      _localeDataCache[locale].dates = {};
      _localeDataCache[locale].dates.calendars = {};
      _localeDataCache[locale].dates.calendars.gregorian = {};
      _localeDataCache[locale].dates.calendars.gregorian.dateTimeFormats = {};
    }
    _localeDataCache[locale].dates.calendars.gregorian
      .dateTimeFormats[dateTimeKeys[0] + dateTimeKeys[1]] = pattern;
    pattern = substituteTokens(pattern);
    return pattern;

    function substituteTokens(cachedVal) {
      if (msOption !== undefined) {
        var sep = _getLocaleDecimalSeparator(mainNode, mlocale);
        if (hOption === undefined && mOption === undefined && sOption === undefined) {
          sep = 'S';
        } else {
          sep = 'ss' + sep + 'SSS';
        }
        // eslint-disable-next-line no-param-reassign
        cachedVal = cachedVal.replace('ss', sep);
        if (sOption === undefined) {
          // eslint-disable-next-line no-param-reassign
          options.second = undefined;
        }
      }
      // substitute time zone token v  based on short or long
      var option = getOption('timeZoneName', 'string', ['short', 'long']);
      var pairs = {
        short: 'z',
        long: 'zzzz'
      };
      if (option !== undefined) {
        // eslint-disable-next-line no-param-reassign
        cachedVal = cachedVal.replace(/v/, pairs[option]);
      }
      return cachedVal;
    }
  }

  function _parseMetaDate(str) {
    var parts = str.split(' ');
    var dParts = parts[0].split('-');
    var d = new Date(dParts[0], dParts[1] - 1, dParts[2]);
    if (parts.length > 1) {
      dParts = parts[1].split(':');
      d.setHours(dParts[0]);
      d.setMinutes(dParts[1]);
    }
    return d.getTime();
  }

  function _getMetazone(value, zoneName, metazones) {
    var nowObj = new Date(value[0], value[1] - 1, value[2],
                          value[3], value[4], value[5]);
    var now = nowObj.getTime();
    var parts = zoneName.split('/');
    var country = parts[0];
    var city = parts[1];
    var zone = metazones[country];
    if (zone === undefined) {
      return null;
    }
    zone = zone[city];
    if (zone === undefined) {
      return null;
    }

    var length = zone.length;
    var mzoneStartTime;
    var mzoneEndTime;


    for (var i = 0; i < length; i++) {
      var mzoneStart = zone[i].usesMetazone._from;
      var mzoneEnd = zone[i].usesMetazone._to;
      var mzoneName = zone[i].usesMetazone._mzone;
      // time zone never chnaged. _to and _from undefined
      if (mzoneStart === undefined && mzoneEnd === undefined) {
        return mzoneName;
      }
      // _from undefined. check if  now <= _to
      if (mzoneStart === undefined && mzoneEnd !== undefined) {
        mzoneEndTime = _parseMetaDate(mzoneEnd);
        if (now <= mzoneEndTime) {
          return mzoneName;
        }
      }
      // _to undefined. check if  now >= _from
      if (mzoneStart !== undefined && mzoneEnd === undefined) {
        mzoneStartTime = _parseMetaDate(mzoneStart);
        if (now >= mzoneStartTime) {
          return mzoneName;
        }
      }
      // find interval where now falls between _to and _from
      if (mzoneStart !== undefined && mzoneEnd !== undefined) {
        mzoneStartTime = _parseMetaDate(mzoneStart);
        mzoneEndTime = _parseMetaDate(mzoneEnd);
        if (now >= mzoneStartTime && now < mzoneEndTime) {
          return mzoneName;
        }
      }
    }

    return undefined;
  }

  // value is the  utc date. Used to determinse if dst or not
  // options, param passed to the converter
  // len = 0, return short timezone name; 1, return long timezone
  // isTimeOnly is used to determine of we should igonore dst
  function _getTimezoneName(localeElements, value, options, len, isTimeOnly) {
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var zoneName = '';
    var timeZone = options.timeZone;
    var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(options, 'OraDateTimeConverter');
    var dst = getOption('dst', 'boolean', [true, false], false);
    if (timeZone === undefined) {
      return zoneName;
    }
    var metazones = localeElements.supplemental.metazones;
    var metaZone = _getMetazone(value, timeZone, metazones);
    var zoneNameEntry0;
    var tzLong = 'long';
    var tzShort = 'short';
    var during = 'standard';
    var ignoreDst = !isTimeOnly;
    var zone = _getTimeZone(timeZone, localeElements);
    var index = _parseZone(zone, value, dst, ignoreDst, true);
    if (mainNode.dates.timeZoneNames.metazone !== undefined) {
      zoneNameEntry0 = mainNode.dates.timeZoneNames.metazone[metaZone];
    }
    if (zoneNameEntry0 === undefined) {
      var offset = zone.ofset(index);
      return __ConverterUtilsI18n.OraI18nUtils.getTimeStringFromOffset(_UTC, offset, true, true);
    }
    var zoneNameEntry;
    if (len === 1) {
      zoneNameEntry = zoneNameEntry0[tzLong];
    } else {
      zoneNameEntry = zoneNameEntry0[tzShort];
    }
    var offset1 = zone.ofset(index);
    var offset2 = zone.ofset(index + 1);
    if (offset1 < offset2) {
      during = 'daylight';
    }
    if (zoneNameEntry !== undefined) {
      zoneName = zoneNameEntry[during];
      if (zoneName !== undefined) {
        return zoneName;
      }
    }
    // return UTC offset if we can not find a timezone name.
    return __ConverterUtilsI18n.OraI18nUtils.getTimeStringFromOffset(_UTC, offset1, true, true);
  }

  function _getTimeZone(timeZoneId, localeElements) {
    var tz = OraTimeZone.getInstance();
    var zone = tz.getZone(timeZoneId, localeElements);
    return zone;
  }

  function _parseZone(zone, parts, dst, ignoreDst, dateTime) {
    var utcDate = Date.UTC(parts[0], parts[1] - 1, parts[2],
                           parts[3], parts[4], parts[5]);
    var index = zone.parse(utcDate, dst, ignoreDst, dateTime);
    return index;
  }

  function _parseTimezoneOffset(_offset) {
    var offsetParts = _offset.split(':');
    // offset is +hh:mm
    if (offsetParts.length === 2) {
      offsetParts[0] = parseInt(offsetParts[0], 10);
      offsetParts[1] = parseInt(offsetParts[1], 10);
    } else if (_offset.length === 2 || _offset.length === 3) { // offset is +hh or +h
      offsetParts[0] = parseInt(_offset, 10);
      offsetParts[1] = 0;
    } else { // offset is +hhmm
      offsetParts[0] = parseInt(_offset.substr(0, 3), 10);
      offsetParts[1] = parseInt(_offset.substr(3), 10);
    }
    return offsetParts;
  }

  function _formatImpl(localeElements, options, isoStrInfo, locale) {
    var ret;
    var format;
    var value = isoStrInfo.isoStrParts;
    var isTimeOnly = isoStrInfo.dateTime.indexOf('T') === 0;
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(options, 'OraDateTimeConverter.format');
    // get the pattern from options
    format = options.pattern || _expandFormat(options, localeElements,
                                              locale, 'OraDateTimeConverter.format');
    // Start with an empty string
    ret = [];
    var part;
    var quoteCount = 0;
    var cal = mainNode.dates.calendars.gregorian;

    function _getPart(date, _part) {
      switch (_part) {
        case 0:
          return date[0];
        case 1:
          return date[1];
        case 2:
          return date[2];
        case 3:
          var dt = new Date(date[0], date[1] - 1, date[2],
                            date[3], date[4], date[5]);
          return _DAYS_INDEXES[dt.getDay()];
        default:
          return undefined;
      }
    }

    function _getPaddedPart(_ret, _value, idx, len) {
      var val = _getPart(_value, idx);
      _ret.push(len > 1 ? __ConverterUtilsI18n.OraI18nUtils.padZeros(val, len) : val);
    }

    function _getTimeParts(_ret, _value, len, currentPart, current) {
      var val;
      switch (currentPart.timePart) {
        case 'hour' :
          if (currentPart.end1 === 11) {
            val = _value[3] % 12;
          } else {
            val = _value[3];
          }
          if (current === 'h' || current === 'hh') {
            if (val === 0) {
              val = 12;
            }
          } else if (current === 'k' || current === 'kk') {
            if (val === 0) {
              val = 24;
            }
          }
          break;
        case 'minute' :
          val = _value[4];
          break;
        case 'second' :
          if (options.second === undefined && options.millisecond !== undefined) {
            val = 0;
          } else {
            val = _value[5];
          }
          break;
        case 'millisec' :
          // val = __ConverterUtilsI18n.OraI18nUtils.zeroPad("" + _value[6], 3, true);
          val = _value[6];
          break;
        default:
          break;
      }
      _ret.push(len > 1 ? __ConverterUtilsI18n.OraI18nUtils.padZeros(val, len) : val);
    }

    function _getTimezoneOffset(_value, _options, _isTimeOnly) {
      var offset;
      var zone;
      var index;
      var timeZone = _options.timeZone;
      var dst = getOption('dst', 'boolean', [true, false], false);
      var ignoreDst = !_isTimeOnly;
      if (timeZone !== undefined) {
        zone = _getTimeZone(timeZone, localeElements);
        index = _parseZone(zone, _value, dst, ignoreDst, true);
        offset = -zone.ofset(index);
      } else if (isoStrInfo.format !== _LOCAL) {
        switch (isoStrInfo.format) {
          case _OFFSET :
            var offsetParts = _parseTimezoneOffset(isoStrInfo.timeZone);
            var hoursOffset = offsetParts[0];
            var minOffset = offsetParts[1];
            offset = (hoursOffset * 60) +
              (__ConverterUtilsI18n.OraI18nUtils.startsWith(isoStrInfo.timeZone, '-') ? -minOffset : minOffset);
            break;
          case _ZULU :
            offset = 0;
            break;
          default:
            offset = 0;
            break;
        }
      }
      return offset;
    }

    // adjust the offset based on the offset of input iso str and timeZone attribute
    // EX: if the input iso str is one of the following:
    // 2014-06-01T16:00:00-07:00
    // 2014-06-01T16:00:00Z
    var timeZone = options.timeZone;
    if (isoStrInfo.format !== _LOCAL && timeZone !== undefined) {
      _adjustHours(isoStrInfo, options, localeElements);
    }

    for (; ;) {
      // Save the current index
      var index = _TOKEN_REGEXP.lastIndex;
      // Look for the next pattern
      var ar = _TOKEN_REGEXP.exec(format);

      // Append the text before the pattern (or the end of the string if
      // not found)
      var preMatch = format.slice(index, ar ? ar.index : format.length);
      quoteCount += _appendPreOrPostMatch(preMatch, ret);

      if (!ar) {
        break;
      }

      // do not replace any matches that occur inside a string literal.
      if (quoteCount % 2) {
        ret.push(ar[0]);
      } else {
        var current = ar[0];
        var clength = current.length;
        var currentPart = _PROPERTIES_MAP[current];
        switch (currentPart.token) {
          case 'days':
            part = cal[currentPart.token][currentPart.style][currentPart.dLen];
            ret.push(part[_getPart(value, 3)]);
            break;
          case 'months':
            part = cal[currentPart.token][currentPart.style][currentPart.mLen];
            ret.push(part[_getPart(value, 1)]);
            break;
          case 'dayOfMonth' :
          case 'monthIndex' :
            ret.push(_getPaddedPart(ret, value, currentPart.getPartIdx, clength));
            break;
          case 'year':
            // Year represented by four full digits
            part = value[0];
            if (clength === 2) {
              part %= 100;
            }
            ret.push(__ConverterUtilsI18n.OraI18nUtils.padZeros(part, clength));
            break;
          case 'time':
            _getTimeParts(ret, value, clength, currentPart, current);
            break;
          case 'ampm':
            // Multicharacter am/pm indicator
            part = value[3] < 12 ?
              cal.dayPeriods.format.wide.am :
              cal.dayPeriods.format.wide.pm;
            ret.push(part);
            break;
          case 'tzhm':
            // Time zone hours minutes: -0800
            part = _getTimezoneOffset(value, options, isTimeOnly);
            if (part === 0) {
              if (currentPart.key === 'XX') {
                ret.push('Z');
              } else {
                ret.push('+0000');
              }
            } else if (part !== undefined) {
              ret.push(
                (part <= 0 ? '-' : '+') +
                  __ConverterUtilsI18n.OraI18nUtils.padZeros(Math.floor(Math.abs(part / 60)), 2) +
                  __ConverterUtilsI18n.OraI18nUtils.padZeros(Math.floor(Math.abs(part % 60)), 2)
              );
            }
            break;
          case 'tzhsepm':
            // Time zone hours minutes: -08:00
            part = _getTimezoneOffset(value, options, isTimeOnly);
            if (part === 0) {
              ret.push('Z');
            } else if (part !== undefined) {
              ret.push(
                (part <= 0 ? '-' : '+') +
                  __ConverterUtilsI18n.OraI18nUtils.padZeros(Math.floor(Math.abs(part / 60)), 2) + ':' +
                  __ConverterUtilsI18n.OraI18nUtils.padZeros(Math.floor(Math.abs(part % 60)), 2)
              );
            }
            break;
          case 'tzh':
            // Time zone hours: -08
            part = _getTimezoneOffset(value, options, isTimeOnly);
            if (part === 0) {
              ret.push('Z');
            } else if (part !== undefined) {
              ret.push(
                (part <= 0 ? '-' : '+') +
                  __ConverterUtilsI18n.OraI18nUtils.padZeros(Math.floor(Math.abs(part / 60)), 2));
            }
            break;
          case 'tzid':
            // Time zone ID: America/Los_Angeles
            if (timeZone !== undefined) {
              part = timeZone;
            } else if (isoStrInfo.format === _ZULU) {
              part = _UTC;
            } else {
              part = '';
            }
            ret.push(part);
            break;
          case 'tzAbbrev':
            // Time zone abbreviation: PDT, PST
            part = _getTimezoneName(localeElements, value, options, 0, isTimeOnly);
            ret.push(part);
            break;
          case 'tzFull':
            // Time zone Full: Pacific Standard Time
            part = _getTimezoneName(localeElements, value, options, 1, isTimeOnly);

            ret.push(part);
            break;
          case 'era':
            part = cal.eras.eraAbbr;
            ret.push(part['1']);
            break;
          case 'slash':
            ret.push('/');
            break;
          default:
            _throwInvalidDateFormat(format, options, current);
        }
      }
    }
    return ret.join('');
  }


  // _formatRelativeImpl

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
    return _isSameYear(d1, d2) && (d1.getMonth() === d2.getMonth());
  }

  // d2 is next month
  function _isNextMonth(d1, d2) {
    if (_isSameYear(d1, d2)) {
      return (d2.getMonth() - d1.getMonth()) === 1;
    } else if (_isNextYear(d1, d2)) {
      return d1.getMonth() === 11 && (d2.getMonth() === 0);
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
      day2 += __ConverterUtilsI18n.OraI18nUtils._getDaysInMonth(d1.getFullYear, d1.getMonth());
    }
    return day2 - day1;
  }

  function _getDayIndex(localeElements, idx) {
    var locale = localeElements._ojLocale_;
    var territory = __ConverterUtilsI18n.OraI18nUtils.getBCP47Region(locale);
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
    if ((!_isSameMonth(d1, d2)) && (!_isNextMonth(d1, d2))) {
      return false;
    }
    var dif = _getDaysDif(d1, d2) + _getDayIndex(localeElements, d1.getDay());
    return dif >= 0 && dif <= 6;
  }

  // d2 is next week
  function _isNextWeek(localeElements, d1, d2) {
    if ((!_isSameMonth(d1, d2)) && (!_isNextMonth(d1, d2))) {
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
    return _isSameYear(d1, d2) && _isSameMonth(d1, d2) &&
      (d1.getDate() === d2.getDate());
  }

  // d2 is next day
  function _isNextDay(d1, d2) {
    if ((!_isSameMonth(d1, d2)) && (!_isNextMonth(d1, d2))) {
      return false;
    }
    return (_getDaysDif(d1, d2) === 1);
  }

  // d2 is previous day
  function _isPrevDay(d1, d2) {
    return _isNextDay(d2, d1);
  }

  function _convertToLocalDate(d, localeElements, options) {
    var srcTimeZone = options.timeZone;
    var isoInfo = __ConverterUtilsI18n.OraI18nUtils.getISOStrFormatInfo(d);
    var isoInfoFormat = isoInfo.format;
    // first test id d is local
    if (isoInfoFormat === _LOCAL && srcTimeZone === undefined) {
      return d;
    }
    // first, convert to zulu
    var tzOptions = { isoStrFormat: 'zulu' };
    if (srcTimeZone !== undefined) {
      tzOptions.timeZone = srcTimeZone;
      tzOptions.dst = true;
    }
    var zuluDate = _parseImpl(d, localeElements, tzOptions, 'en-US');
    // second, convert to local date
    var localOffset = __ConverterUtilsI18n.OraI18nUtils.getLocalTimeZoneOffset();
    tzOptions = { timeZone: localOffset, isoStrFormat: 'local' };
    var localDate = _parseImpl(zuluDate.value, localeElements, tzOptions, 'en-US');
    return localDate.value;
  }

  function _getTimeDiff(d1, d2, isCalendar) {
    var datetime1 = __ConverterUtilsI18n.OraI18nUtils._IsoStrParts(d1);
    var datetime2 = __ConverterUtilsI18n.OraI18nUtils._IsoStrParts(d2);

    if (isCalendar) {
      // for calendar, normalize the times to midnight so that the diff is the same
      // regardless of time of day.
      datetime1 = Date.UTC(datetime1[0], datetime1[1] - 1, datetime1[2], 0, 0, 0, 0);
      datetime2 = Date.UTC(datetime2[0], datetime2[1] - 1, datetime2[2], 0, 0, 0, 0);
    } else {
      datetime1 = Date.UTC(datetime1[0], datetime1[1] - 1, datetime1[2], datetime1[3],
                           datetime1[4], datetime1[5], datetime1[6]);
      datetime2 = Date.UTC(datetime2[0], datetime2[1] - 1, datetime2[2], datetime2[3],
                           datetime2[4], datetime2[5], datetime2[6]);
    }
    return (datetime1 - datetime2);
  }

  function _replaceParams(string, replacements) {
    return string.replace(/\{(\d+)\}/g, function () {
      return replacements[arguments[1]];
    });
  }

  function _formatRelativeCalendar(now, relativeDate, localeElements, dateOnly) {
    var datePart;
    var timePart;
    var relativeDay;
    var dayIndex;
    var timePartOptions = { hour: 'numeric', minute: 'numeric' };
    var elseOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var pattern = mainNode.dates.calendars.gregorian.dateTimeFormats.long;
    var days = mainNode.dates.calendars.gregorian.days.format.wide;
    var fields = mainNode.dates.fields;

    var value = __ConverterUtilsI18n.OraI18nUtils.isoToLocalDate(relativeDate);
    var localNow = __ConverterUtilsI18n.OraI18nUtils.isoToLocalDate(now);
    var isoStrInfo = __ConverterUtilsI18n.OraI18nUtils.getISOStrFormatInfo(relativeDate);

    if (_isSameDay(localNow, value)) {
      datePart = fields.day['relative-type-0'];
    } else if (_isNextDay(localNow, value)) {
      datePart = fields.day['relative-type-1'];
    } else if (_isPrevDay(localNow, value)) {
      datePart = fields.day['relative-type--1'];
    } else {
      relativeDay = value.getDay();
      dayIndex = _DAYS_INDEXES[relativeDay];
      var diff = _getTimeDiff(relativeDate, now, true);
      diff /= 864e5; // number of days
      if (diff < -1 && diff > -7) {
        datePart = fields[dayIndex]['relative-type--1'];
      } else if (diff > 1 && diff < 7) {
        // next week
        datePart = days[dayIndex];
      } else {
        // everything else
        return _formatImpl(localeElements, elseOptions, isoStrInfo, 'en-US');
      }
    }
    if (dateOnly) {
      return datePart;
    }
    timePart = _formatImpl(localeElements, timePartOptions, isoStrInfo, 'en-US');
    pattern = pattern.replace(/'/g, '');
    pattern = _replaceParams(pattern, [timePart, datePart]);
    return pattern;
  }

  function _formatRelativeDisplayName(isoNow, isoValue, options, localeElements) {
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var fields = mainNode.dates.fields;
    var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(options,
                                                 'OraDateTimeConverter.formatRelative');
    var option = getOption('dateField', 'string',
                           ['day', 'week', 'month', 'year', 'hour', 'minute', 'second']);
    var now = __ConverterUtilsI18n.OraI18nUtils.isoToLocalDate(isoNow);
    var value = __ConverterUtilsI18n.OraI18nUtils.isoToLocalDate(isoValue);
    switch (option) {
      case 'day' :
        if (_isSameDay(now, value)) {
          return fields.day['relative-type-0'];
        }
        if (_isNextDay(now, value)) {
          return fields.day['relative-type-1'];
        }
        if (_isPrevDay(now, value)) {
          return fields.day['relative-type--1'];
        }
        return _formatRelativeImplicit(isoNow, isoValue, localeElements, 'day');
      case 'week' :
        if (_isSameWeek(localeElements, now, value)) {
          return fields.week['relative-type-0'];
        }
        if (_isNextWeek(localeElements, now, value)) {
          return fields.week['relative-type-1'];
        }
        if (_isPrevWeek(localeElements, now, value)) {
          return fields.week['relative-type--1'];
        }
        return _formatRelativeImplicit(isoNow, isoValue, localeElements, 'week');
      case 'month' :
        if (_isSameMonth(now, value)) {
          return fields.month['relative-type-0'];
        }
        if (_isNextMonth(now, value)) {
          return fields.month['relative-type-1'];
        }
        if (_isPrevMonth(now, value)) {
          return fields.month['relative-type--1'];
        }
        return _formatRelativeImplicit(isoNow, isoValue, localeElements, 'month');
      case 'year' :
        if (_isSameYear(now, value)) {
          return fields.year['relative-type-0'];
        }
        if (_isNextYear(now, value)) {
          return fields.year['relative-type-1'];
        }
        if (_isPrevYear(now, value)) {
          return fields.year['relative-type--1'];
        }
        return _formatRelativeImplicit(isoNow, isoValue, localeElements, 'year');
      case 'hour' :
        return _formatRelativeImplicit(isoNow, isoValue, localeElements, 'hour');
      case 'minute' :
        return _formatRelativeImplicit(isoNow, isoValue, localeElements, 'minute');
      case 'second' :
        return _formatRelativeImplicit(isoNow, isoValue, localeElements, 'second');
      default :
        break;
    }
    return null;
  }

  function _daysToMonths(days) {
    // 400 years have 146097 days (taking into account leap year rules)
    return (days * 4800) / 146097;
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

  // return the language part
  function _getBCP47Lang(tag) {
    var arr = tag.split('-');
    return arr[0];
  }

  function _formatRelativeImplicit(now, relativeDate, localeElements, field) {
    var future = 'relativeTime-type-future';
    var past = 'relativeTime-type-past';
    var nowNodeKey = 'relative-type-0';
    var mainNodeKey = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNodeKey(
      localeElements);
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var lang = _getBCP47Lang(mainNodeKey);
    var plurals = localeElements.supplemental.plurals;
    var fields = mainNode.dates.fields;
    var pluralKey = 'relativeTimePattern-count-';

    var diff = _getTimeDiff(relativeDate, now, false);
    var absdiff = Math.abs(diff);
    var units = _getUnits(absdiff);
    if (field === null) {
      // eslint-disable-next-line no-param-reassign
      field = (units.second < _THRESHOLDS.s && 'second') ||
        (units.minute < _THRESHOLDS.m && 'minute') ||
        (units.hour < _THRESHOLDS.h && 'hour') ||
        (units.day < _THRESHOLDS.d && 'day') ||
        (units.week < _THRESHOLDS.w && 'week') ||
        (units.month < _THRESHOLDS.M && 'month') ||
        'year';
    }
    // when seconds <= 45 display 'now' instead of number of seconds
    if (field === 'second' && units.second < _THRESHOLDS.s) {
      return fields[field][nowNodeKey];
    }
    var plural = plurals[lang](units[field]);
    var pluralEntry = pluralKey + plural;
    var x = diff < 0 ? past : future;
    var format = fields[field][x][pluralEntry];
    // some locales only have other plural entry
    if (format === undefined) {
      pluralEntry = pluralKey + 'other';
      format = fields[field][x][pluralEntry];
    }
    format = _replaceParams(format, [units[field]]);
    return format;
  }

  function _formatRelativeImpl(value, localeElements, options) {
    var now = __ConverterUtilsI18n.OraI18nUtils.dateToLocalIso(new Date());
    if (typeof value === 'number') {
      // eslint-disable-next-line no-param-reassign
      value = __ConverterUtilsI18n.OraI18nUtils.dateToLocalIso(new Date(value));
    } else if (typeof value === 'string') {
      if (__ConverterUtilsI18n.OraI18nUtils.trim(value) === '') {
        return null;
      }
    } else {
      return null;
    }
    if (options === undefined) {
      // eslint-disable-next-line no-param-reassign
      options = { formatUsing: 'displayName' };
    }
    var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(options,
                                                 'OraDateTimeConverter.formatRelative');
    var relativeTime = getOption('relativeTime', 'string',
                                 ['fromNow', 'toNow'], 'fromNow');
    var fieldOption = getOption('dateField', 'string',
                                ['day', 'week', 'month', 'year', 'hour', 'minute', 'second']);

    // eslint-disable-next-line no-param-reassign
    value = _convertToLocalDate(value, localeElements, options);
    var toNow = (relativeTime === 'toNow');
    if (toNow) {
      var tmp = now;
      now = value;
      // eslint-disable-next-line no-param-reassign
      value = tmp;
    }
    var formatUsing = getOption('formatUsing', 'string',
                                ['displayName', 'calendar'], 'displayName');
    if (formatUsing === 'calendar') {
      var dateOnly = getOption('dateOnly', 'boolean', [true, false], false);
      return _formatRelativeCalendar(now, value, localeElements, dateOnly);
    }
    if (fieldOption !== undefined) {
      return _formatRelativeDisplayName(now, value, options, localeElements);
    }
    return _formatRelativeImplicit(now, value, localeElements, null);
  }


  // parse functions

  function _throwWeekdayMismatch(weekday, day) {
    var msg = 'The weekday ' + weekday + ' does not match the date ' + day;
    var error = new Error(msg);
    var errorInfo = {
      errorCode: 'dateToWeekdayMismatch',
      parameterMap: {
        weekday: weekday,
        date: day
      }
    };
    error.errorInfo = errorInfo;
    throw error;
  }

  function _throwDateFormatMismatch(value, format, style) {
    var msg;
    var errorCodeType;

    if (style === 2) {
      msg = 'The value "' + value +
        '" does not match the expected date-time format "' + format + '"';
      errorCodeType = 'datetimeFormatMismatch';
    } else if (style === 0) {
      msg = 'The value "' + value +
        '" does not match the expected date format "' + format + '"';
      errorCodeType = 'dateFormatMismatch';
    } else {
      msg = 'The value "' + value +
        '" does not match the expected time format "' + format + '"';
      errorCodeType = 'timeFormatMismatch';
    }
    var error = new Error(msg);
    var errorInfo = {
      errorCode: errorCodeType,
      parameterMap: {
        value: value,
        format: format
      }
    };
    error.errorInfo = errorInfo;
    throw error;
  }

  function _expandYear(start2DigitYear, year) {
    // expands 2-digit year into 4 digits.
    if (year < 100) {
      var ambiguousTwoDigitYear = start2DigitYear % 100;
      // eslint-disable-next-line no-param-reassign
      year += (Math.floor((start2DigitYear / 100)) * 100) +
        (year < ambiguousTwoDigitYear ? 100 : 0);
    }
    return year;
  }

  function _arrayIndexOfDay(daysObj, item) {
    var days = {
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6
    };
    var daysKeys = Object.keys(daysObj);
    for (var i = 0; i < daysKeys.length; i++) {
      var d = daysKeys[i];
      if (__ConverterUtilsI18n.OraI18nUtils.trim(
        __ConverterUtilsI18n.OraI18nUtils.toUpper(daysObj[d])) ===
          __ConverterUtilsI18n.OraI18nUtils.trim(item)) {
        return days[d];
      }
    }
    return -1;
  }

  function _arrayIndexOfMonth(monthsObj, item) {
    var monthsKeys = Object.keys(monthsObj);
    for (var i = 0; i < monthsKeys.length; i++) {
      var m = monthsKeys[i];
      if (__ConverterUtilsI18n.OraI18nUtils.trim(
        __ConverterUtilsI18n.OraI18nUtils.toUpper(monthsObj[m])) ===
          __ConverterUtilsI18n.OraI18nUtils.trim(item)) {
        return i;
      }
    }
    return -1;
  }

  function _getDayIndex1(localeElements, value, fmt) {
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var ret;
    var days;
    var calDaysFmt =
        mainNode.dates.calendars.gregorian.days.format;
    var calDaysStdAlone =
        mainNode.dates.calendars.gregorian.days['stand-alone'];
    switch (fmt) {
      case 0:
        days = [
          calDaysFmt.abbreviated,
          calDaysFmt.wide
        ];
        break;
      case 1:
        days = [
          calDaysStdAlone.abbreviated,
          calDaysStdAlone.wide
        ];
        break;
      default:
        break;
    }
    // eslint-disable-next-line no-param-reassign
    value = __ConverterUtilsI18n.OraI18nUtils.toUpper(value);
    ret = _arrayIndexOfDay(days[0], value);
    if (ret === -1) {
      ret = _arrayIndexOfDay(days[1], value);
    }
    return ret;
  }

  // fmt:0 for format, 1 for stand-alone, 2 for lenient parse
  function _getMonthIndex(localeElements, value, fmt) {
    var ret = -1;
    var months;
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var calMonthsFmt =
        mainNode.dates.calendars.gregorian.months.format;
    var calMonthsStdAlone =
        mainNode.dates.calendars.gregorian.months['stand-alone'];
    switch (fmt) {
      case 0:
        months = [
          calMonthsFmt.wide,
          calMonthsFmt.abbreviated
        ];
        break;
      case 1:
        months = [
          calMonthsStdAlone.wide,
          calMonthsStdAlone.abbreviated
        ];
        break;
      case 2:
        months = [
          calMonthsFmt.wide,
          calMonthsFmt.abbreviated,
          calMonthsStdAlone.wide,
          calMonthsStdAlone.abbreviated
        ];
        break;
      default:
        return -1;
    }
    // eslint-disable-next-line no-param-reassign
    value = __ConverterUtilsI18n.OraI18nUtils.toUpper(value);
    for (var m = 0; m < months.length; m++) {
      ret = _arrayIndexOfMonth(months[m], value);
      if (ret !== -1) {
        return ret;
      }
    }
    return ret;
  }

  // converts a format string into a regular expression with groups that
  // can be used to extract date fields from a date string.
  // check for a cached parse regex.
  function _getParseRegExp(format, options) {
    var re = {};


    // expand single digit formats, then escape regular expression
    //  characters.
    var expFormat = format.replace(_ESCAPE_REGEXP, '\\\\$1');
    var regexp = ['^'];
    var groups = [];
    var index = 0;
    var quoteCount = 0;

    // iterate through each date token found.
    var match = _TOKEN_REGEXP.exec(expFormat);
    while (match !== null) {
      var preMatch = expFormat.slice(index, match.index);
      index = _TOKEN_REGEXP.lastIndex;

      // don't replace any matches that occur inside a string literal.
      quoteCount += _appendPreOrPostMatch(preMatch, regexp);
      if (quoteCount % 2) {
        regexp.push(match[0]);
      } else {
        // add a regex group for the token.
        var m = match[0];
        var add;
        if (_PROPERTIES_MAP[m] !== undefined) {
          add = _PROPERTIES_MAP[m].regExp;
        } else {
          _throwInvalidDateFormat(format, options, m);
        }
        if (add) {
          regexp.push(add);
        }
        groups.push(match[0]);
      }
      match = _TOKEN_REGEXP.exec(expFormat);
    }
    _appendPreOrPostMatch(expFormat.slice(index), regexp);
    regexp.push('$');

    // allow whitespace to differ when matching formats.
    var regexpStr = regexp.join('').replace(/\s+/g, '\\s+');
    var parseRegExp = {
      regExp: regexpStr,
      groups: groups
    };
    // cache the regex for this format.
    re[format] = parseRegExp;
    return parseRegExp;
  }

  function _validateRange(name, value, low, high, displayValue, displayLow, displayHigh) {
    if (value < low || value > high) {
      var msg = displayValue +
          ' is out of range.  Enter a value between ' + displayLow +
          ' and ' + displayHigh + ' for ' + name;
      var rangeError = new RangeError(msg);
      var errorInfo = {
        errorCode: 'datetimeOutOfRange',
        parameterMap: {
          value: displayValue,
          minValue: displayLow,
          maxValue: displayHigh,
          propertyName: name
        }
      };
      rangeError.errorInfo = errorInfo;
      throw rangeError;
    }
  }

  function _getTokenIndex(arr, token) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][token] !== undefined) {
        return i;
      }
    }
    return 0;
  }

  // time lenient parse
  function _parseLenienthms(result, timepart, format, localeElements, dtype) {
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var calPM = mainNode.dates.calendars.gregorian.dayPeriods.format.wide.pm;
    // hour, optional minutes and optional seconds
    _TIME_REGEXP.lastIndex = 0;
    var hour = 0;
    var minute = 0;
    var second = 0;
    var msec = 0;
    var idx;
    var match = _TIME_REGEXP.exec(timepart);
    if (match === null) {
      _throwDateFormatMismatch(timepart, format, dtype);
    }
    if (match[1] !== undefined) {
      hour = parseInt(match[1], 10);
    }
    if (match[2] !== undefined) {
      minute = parseInt(match[2], 10);
    }
    if (match[3] !== undefined) {
      second = parseInt(match[3], 10);
    }
    if (match[4] !== undefined) {
      msec = parseInt(match[4], 10);
    }

    _TIME_FORMAT_REGEXP.lastIndex = 0;
    match = _TIME_FORMAT_REGEXP.exec(format);
    switch (match[0]) {
      case 'h':
        // Hour in am/pm (1-12)
        if (hour === 12) {
          hour = 0;
        }
        _validateRange('hour', hour, 0, 11, hour, 1, 12);
        idx = (__ConverterUtilsI18n.OraI18nUtils.toUpper(timepart)).indexOf(
          __ConverterUtilsI18n.OraI18nUtils.toUpper(calPM));
        if (idx !== -1 && hour < 12) {
          hour += 12;
        }
        break;
      case 'K':
        // Hour in am/pm (0-11)
        _validateRange('hour', hour, 0, 11, hour, 0, 11);
        idx = (__ConverterUtilsI18n.OraI18nUtils.toUpper(timepart)).indexOf(
          __ConverterUtilsI18n.OraI18nUtils.toUpper(calPM));
        if (idx !== -1 && hour < 12) {
          hour += 12;
        }
        break;
      case 'H':
        _validateRange('hour', hour, 0, 23, hour, 0, 23);
        break;
      case 'k':
        if (hour === 24) {
          hour = 0;
        }
        _validateRange('hour', hour, 0, 23, hour, 1, 24);
        break;
      default:
        break;
    }
    // Minutes.
    _validateRange('minute', minute, 0, 59, minute, 0, 59);
    // Seconds.
    _validateRange('second', second, 0, 59, second, 0, 59);
    // millisec
    _validateRange('millisec', msec, 0, 999, msec, 0, 999);

    result.setHours(hour, minute, second, msec);
  }

  function _getWeekdayName(value, localeElements) {
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var calDaysFmt = mainNode.dates.calendars.gregorian.days.format;
    var calDaysStandAlone = mainNode.dates.calendars.gregorian.days['stand-alone'];
    var days = [
      calDaysFmt.wide,
      calDaysFmt.abbreviated,
      calDaysStandAlone.wide,
      calDaysStandAlone.abbreviated
    ];

    for (var i = 0; i < days.length; i++) {
      var dayKeys = Object.keys(days[i]);
      for (var j = 0; j < dayKeys.length; j++) {
        var dName = days[i][dayKeys[j]];
        var dRegExp = new RegExp(dName + '\\b', 'i');
        if (dRegExp.test(value)) {
          return dName;
        }
      }
    }
    return null;
  }

  // lenient parse yMd and yMEd patterm. Must have year, moth,
  // date all numbers. Ex: 5/3/2013
  // weekday is optional. If present it must match date.
  // Ex:  Tuesday 11/19/2013
  // if year is 3-digits it can be anywhere in the string.
  // Otherwise assume its position based on pattern
  // if date > 12 it can be anywhere in the string.
  // Otherwise assume its position based on pattern
  // separators can be any non digit characters
  function _parseLenientyMEd(value, format, options, localeElements, isDateTime) {
    _YMD_REGEXP.lastIndex = 0;
    var match = _YMD_REGEXP.exec(value);
    if (match === null) {
      var dtype = isDateTime ? 2 : 0;
      _throwDateFormatMismatch(value, format, dtype);
    }
    var tokenIndexes = [{
      y: format.indexOf('y')
    }, {
      M: format.indexOf('M')
    }, {
      d: format.indexOf('d')
    }];
    tokenIndexes.sort(function (a, b) {
      var n1 = Object.keys(a)[0];
      var n2 = Object.keys(b)[0];
      return a[n1] - b[n2];
    });
    var year;
    var month;
    var day;
    var yearIndex;
    var foundDayIndex;
    var i;
    var dayIndex = _getTokenIndex(tokenIndexes, 'd');
    var foundYear = false;
    var foundDay = false;

    for (i = 1; i <= 3; i++) {
      var tokenMatch = match[i];
      // find year if year is yyy|yyyy
      if (tokenMatch.length > 2 || tokenMatch > 31) {
        year = tokenMatch;
        foundYear = true;
        yearIndex = i - 1;
      }
    }
    if (!foundYear) {
      yearIndex = _getTokenIndex(tokenIndexes, 'y');
      year = match[_getTokenIndex(tokenIndexes, 'y') + 1];
    }
    // find day if day value > 12
    for (i = 0; i < 3; i++) {
      if (i !== yearIndex && match[i + 1] > 12) {
        day = match[i + 1];
        foundDay = true;
        foundDayIndex = i;
        break;
      }
    }
    if (!foundDay) {
      if (yearIndex === _getTokenIndex(tokenIndexes, 'd')) {
        day = match[_getTokenIndex(tokenIndexes, 'y') + 1];
        month = match[_getTokenIndex(tokenIndexes, 'M') + 1];
      } else if (yearIndex === _getTokenIndex(tokenIndexes, 'M')) {
        day = match[_getTokenIndex(tokenIndexes, 'd') + 1];
        month = match[_getTokenIndex(tokenIndexes, 'y') + 1];
      } else {
        day = match[_getTokenIndex(tokenIndexes, 'd') + 1];
        month = match[_getTokenIndex(tokenIndexes, 'M') + 1];
      }
    } else {
      for (i = 0; i < 3; i++) {
        if (i !== foundDayIndex && i !== yearIndex) {
          month = match[i + 1];
          break;
        }
      }
      if (month === undefined) {
        month = match[_getTokenIndex(tokenIndexes, 'M') + 1];
      }
    }
    month -= 1;
    var daysInMonth = __ConverterUtilsI18n.OraI18nUtils._getDaysInMonth(year, month);
    // if both month and day > 12 and swapped, throw exception
    // based on original order
    if (foundDay && dayIndex !== foundDayIndex && month > 12) {
      _validateRange('month', day, 0, 11, day, 1, 12);
    }
    _validateRange('month', month, 0, 11, month + 1, 1, 12);
    _validateRange('day', day, 1, daysInMonth, day, 1, daysInMonth);
    var start2DigitYear = _get2DigitYearStart(options);
    year = _expandYear(start2DigitYear, parseInt(year, 10));
    _validateRange('year', year, 0, 9999, year, 0, 9999);
    var parsedDate = new Date(year, month, day);
    // locate weekday
    var dName = _getWeekdayName(value, localeElements);
    if (dName !== null) {
      var weekDay = _getDayIndex1(localeElements, dName, 0);
      // day of week does not match date
      if (parsedDate.getDay() !== weekDay) {
        _throwWeekdayMismatch(dName, parsedDate.getDate());
      }
    }
    var result =
      {
        value: parsedDate,
        offset: '',
        warning: 'lenient parsing was used'
      };
    if (isDateTime) {
      var timepart = value.substr(_YMD_REGEXP.lastIndex);
      if (timepart.length === 0) {
        result.value.setHours(0, 0, 0, 0);
      } else {
        _parseLenienthms(result.value, timepart, format, localeElements, 2);
      }
    }
    result.value = __ConverterUtilsI18n.OraI18nUtils.dateToLocalIso(result.value);
    return result;
  }

  // lenient parse yMMMd and yMMMEd patterns. Must have year, date as numbers
  // and month name.
  // weekday is optional. If present it must match date.
  // Ex:  Monday Nov, 11 2013
  // weekday and month name can be anywhere in the string.
  // if year > 2-digits it can be anywhere in the string.
  // Otherwise assume its position based on pattern
  // separators can be any non digit characters
  function _parseLenientyMMMEd(value, format, options, localeElements, isDateTime) {
    var origValue = value;
    // eslint-disable-next-line no-param-reassign
    value = __ConverterUtilsI18n.OraI18nUtils.toUpper(value);
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    // locate month name
    var calMonthsFmt = mainNode.dates.calendars.gregorian.months.format;
    var calMonthsStandAlone = mainNode.dates.calendars.gregorian.months['stand-alone'];
    var months = [
      calMonthsFmt.wide,
      calMonthsFmt.abbreviated,
      calMonthsStandAlone.wide,
      calMonthsStandAlone.abbreviated
    ];
    var foundMatch = false;
    var reverseMonth;
    var i;
    var mName;
    for (i = 0; i < months.length; i++) {
      reverseMonth = [];
      var monthKeys = Object.keys(months[i]);
      var j;
      for (j = 0; j < monthKeys.length; j++) {
        mName = __ConverterUtilsI18n.OraI18nUtils.toUpper(months[i][monthKeys[j]]);
        reverseMonth.unshift({
          idx: j,
          name: mName
        });
      }

      reverseMonth.sort(function (a, b) {
        return b.idx - a.idx;
      });

      for (j = 0; j < reverseMonth.length; j++) {
        mName = reverseMonth[j].name;
        if (value.indexOf(mName) !== -1) {
          foundMatch = true;
          // eslint-disable-next-line no-param-reassign
          value = value.replace(mName, '');
          break;
        }
      }
      if (foundMatch) {
        break;
      }
    }
    // There is no month name. Try yMEd lenient parse.
    if (!foundMatch) {
      return _parseLenientyMEd(origValue, format, options, localeElements, isDateTime);
    }

    var month = _getMonthIndex(localeElements, mName, 2);
    _validateRange('month', month, 0, 11, month, 1, 12);

    // locate weekday
    var dName = _getWeekdayName(origValue, localeElements);
    var dRegExp = new RegExp(dName + '\\W', 'i');
    if (dName !== null) {
      // eslint-disable-next-line no-param-reassign
      value = value.replace(dRegExp, '');
    }
    // find year and date
    _YEAR_AND_DATE_REGEXP.lastIndex = 0;
    var match = _YEAR_AND_DATE_REGEXP.exec(value);
    if (match === null) {
      var dtype = isDateTime ? 2 : 0;
      _throwDateFormatMismatch(origValue, format, dtype);
    }
    var tokenIndexes = [{
      y: format.indexOf('y')
    }, {
      d: format.indexOf('d')
    }];

    tokenIndexes.sort(function (a, b) {
      var n1 = Object.keys(a)[0];
      var n2 = Object.keys(b)[0];
      return a[n1] - b[n2];
    });

    var year;
    var day;
    var yearIndex;
    var foundYear = false;
    for (i = 1; i <= 2; i++) {
      var tokenMatch = match[i];
      // find year if year is yyy|yyyy
      if (tokenMatch.length > 2 || tokenMatch > 31) {
        year = tokenMatch;
        foundYear = true;
        yearIndex = i - 1;
      }
    }
    if (!foundYear) {
      yearIndex = _getTokenIndex(tokenIndexes, 'y');
      year = match[_getTokenIndex(tokenIndexes, 'y') + 1];
    }
    if (yearIndex === _getTokenIndex(tokenIndexes, 'd')) {
      day = match[_getTokenIndex(tokenIndexes, 'y') + 1];
    } else {
      day = match[_getTokenIndex(tokenIndexes, 'd') + 1];
    }

    var start2DigitYear = _get2DigitYearStart(options);
    year = _expandYear(start2DigitYear, parseInt(year, 10));
    _validateRange('year', year, 0, 9999, year, 0, 9999);
    var parsedDate = new Date(year, month, day);
    if (dName !== null) {
      var weekDay = _getDayIndex1(localeElements, dName, 0);
      // day of week does not match date
      if (parsedDate.getDay() !== weekDay) {
        _throwWeekdayMismatch(dName, parsedDate.getDate());
      }
    }
    var daysInMonth = __ConverterUtilsI18n.OraI18nUtils._getDaysInMonth(year, month);
    _validateRange('day', day, 1, daysInMonth, day, 1, daysInMonth);
    var result = {
      value: parsedDate,
      offset: '',
      warning: 'lenient parsing was used'
    };

    if (isDateTime) {
      var timepart = value.substr(_YEAR_AND_DATE_REGEXP.lastIndex);
      if (timepart.length === 0) {
        result.value.setHours(0, 0, 0, 0);
      } else {
        _parseLenienthms(result.value, timepart, format, localeElements, 2);
      }
    }
    result.value = __ConverterUtilsI18n.OraI18nUtils.dateToLocalIso(result.value);
    return result;
  }

  function _parseLenient(value, format, options, localeElements) {
    var dtStyle = _dateTimeStyle(options, 'OraDateTimeConverter.parse');
    switch (dtStyle) {
      case 0 :
        // date style
        return _parseLenientyMMMEd(value, format, options, localeElements, false);

      case 1 :
        // time style
        var d = new Date();
        _parseLenienthms(d, value, format, localeElements, 1);
        var isoStr = __ConverterUtilsI18n.OraI18nUtils.dateToLocalIso(d);
        var result = {
          value: isoStr,
          offset: '',
          warning: 'lenient parsing was used'
        };
        return result;

      case 2 :
        // date-time style
        return _parseLenientyMMMEd(value, format, options, localeElements, true);
      default:
        break;
    }
    return null;
  }

  function _getNameIndex(localeElements, datePart, matchGroup, mLength,
    style, matchIndex, start1, end1, start2, end2, name) {
    var index;
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var monthsFormat = mainNode.dates.calendars.gregorian[datePart][style];

    if (datePart === 'months') {
      index = _getMonthIndex(localeElements, matchGroup, matchIndex);
    } else {
      index = _getDayIndex1(localeElements, matchGroup, matchIndex);
    }
    var startName = monthsFormat[mLength][start2];
    var endName = monthsFormat[mLength][end2];
    _validateRange(name, index, start1, end1, matchGroup,
        startName, endName);
    return index;
  }

  function _getTimePart(matchInt, _timeObj, objMap, timeToken) {
    var timeObj = _timeObj;
    timeObj[objMap.timePart] = matchInt;
    if (timeToken === 'h' || timeToken === 'hh') {
      if (matchInt === 12) {
        timeObj[objMap.timePart] = 0;
      }
    } else if (timeToken === 'k' || timeToken === 'kk') {
      if (matchInt === 24) {
        timeObj[objMap.timePart] = 0;
      }
    }
    _validateRange(objMap.timePart, timeObj[objMap.timePart],
                   objMap.start1, objMap.end1, matchInt,
                   objMap.start2, objMap.end2);
  }

  // exact match parsing for date-time. If it fails, try lenient parse.
  function _parseExact(value, format, options, localeElements) {
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    // remove spaces from era.
    var cal = mainNode.dates.calendars.gregorian;
    var eraPart = cal.eras.eraAbbr['1'];
    var trimEraPart = __ConverterUtilsI18n.OraI18nUtils.trimNumber(eraPart);

    // eslint-disable-next-line no-param-reassign
    value = value.replace(eraPart, trimEraPart);
    var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(options, 'OraDateTimeConverter.parse');
    var lenientParse = getOption('lenientParse', 'string', ['none', 'full'], 'full');
    var dtStyle = _dateTimeStyle(options, 'OraDateTimeConverter.parse');
    // convert date formats into regular expressions with groupings.
    // use the regexp to determine the input format and extract the date
    //  fields.
    var parseInfo = _getParseRegExp(format, options);
    var match = new RegExp(parseInfo.regExp).exec(value);
    if (match === null) {
      if (lenientParse === 'full') {
        return _parseLenient(value, format, options, localeElements);
      }
      _throwDateFormatMismatch(value, format, dtStyle);
    }
    // found a date format that matches the input.
    var groups = parseInfo.groups;
    var year = null;
    var month = null;
    var date = null;
    var weekDay = null;
    var hourOffset = '';
    var tzID = null;
    var pmHour = false;
    var weekDayName;
    var timeObj = {
      hour: 0,
      minute: 0,
      second: 0,
      millisec: 0
    };
    var calPM = mainNode.dates.calendars.gregorian.dayPeriods.format.wide.pm;
    var start2DigitYear = _get2DigitYearStart(options);
    // iterate the format groups to extract and set the date fields.
    for (var j = 0, jl = groups.length; j < jl; j++) {
      var matchGroup = match[j + 1];
      if (matchGroup) {
        var current = groups[j];
        var matchInt = parseInt(matchGroup, 10);
        var currentGroup = _PROPERTIES_MAP[current];

        switch (currentGroup.token) {
          case 'months':
            month = _getNameIndex(localeElements, currentGroup.token,
                                  matchGroup, currentGroup.mLen, currentGroup.style,
                                  currentGroup.matchIndex, 0, 11, '1', '12', 'month name');
            break;
          case 'days':
            weekDayName = matchGroup;
            weekDay = _getNameIndex(localeElements, currentGroup.token,
                                    matchGroup, currentGroup.dLen, currentGroup.style,
                                    currentGroup.matchIndex, 0, 6, 'sun', 'sat', 'weekday');
            break;
          case 'time':
            _getTimePart(matchInt, timeObj, currentGroup, current);
            break;
          case 'dayOfMonth':
            date = matchInt;
            // try leneient parse for date style only
            if (date > 31 && lenientParse === 'full') {
              try {
                return _parseLenient(value, format, options, localeElements);
              } catch (e) {
                var MonthDays = __ConverterUtilsI18n.OraI18nUtils._getDaysInMonth(year, month);
                _validateRange('day', date, 1, MonthDays, date, 1, MonthDays);
              }
            }
            break;
          case 'monthIndex':
            // Month.
            month = matchInt - 1;
            // try leneient parse for date style only
            if (month > 11 && lenientParse === 'full') {
              try {
                return _parseLenient(value, format, options, localeElements);
              } catch (e) {
                _validateRange('month', month, 0, 11, month + 1, 1, 12);
              }
            }
            break;
          case 'year':
            year = _expandYear(start2DigitYear, matchInt);
            _validateRange('year', year, 0, 9999, year, 0, 9999);
            break;
          case 'ampm':
            pmHour =
              (__ConverterUtilsI18n.OraI18nUtils.toUpper(matchGroup)).indexOf(
                __ConverterUtilsI18n.OraI18nUtils.toUpper(calPM)) !== -1;
            break;
          case 'tzhm':
            // Time zone hours minutes: -0800
            hourOffset = matchGroup.substr(-2);
            hourOffset = matchGroup.substr(0, 3) + ':' + hourOffset;
            break;
          case 'tzhsepm':
            // Time zone hours minutes: -08:00
            hourOffset = matchGroup;
            break;
          case 'tzh':
            // Time zone hours minutes: -08
            hourOffset = matchGroup + ':00';
            break;
          case 'tzid':
            // Time zone ID: America/Los_Angeles
            tzID = matchGroup;
            break;
          default:
            break;
        }
      }
    }
    var parsedDate = new Date();
    if (year === null) {
      year = parsedDate.getFullYear();
    }
    // if day and month are unspecified,the defaults are current
    // day and month.
    if (month === null && date === null) {
      month = parsedDate.getMonth();
      date = parsedDate.getDate();
    } else if (date === null) {
      // if day is unspecified, default 1st day of month.
      date = 1;
    }

    // validate month
    _validateRange('month', month, 0, 11, month + 1, 1, 12);

    // validate day range, depending on the month and year
    var daysInMonth = __ConverterUtilsI18n.OraI18nUtils._getDaysInMonth(year, month);
    _validateRange('day', date, 1, daysInMonth, date, 1, daysInMonth);
    parsedDate.setFullYear(year, month, date);

    // day of week does not match date
    if (weekDay !== null && parsedDate.getDay() !== weekDay) {
      _throwWeekdayMismatch(weekDayName, parsedDate.getDate());
    }
    // if pm designator token was found make sure the hours fit the
    // 24-hour clock.
    if (pmHour && timeObj.hour < 12) {
      timeObj.hour += 12;
    }
    var parts = [year, month + 1, date, timeObj.hour, timeObj.minute,
      timeObj.second, timeObj.millisec];
    var isoParsedDate = __ConverterUtilsI18n.OraI18nUtils.partsToIsoString(parts);
    if (tzID !== null) {
      var zone = _getTimeZone(tzID, localeElements);
      var index = _parseZone(zone, parts, false, true, true);
      hourOffset = -zone.ofset(index);
      hourOffset = __ConverterUtilsI18n.OraI18nUtils.getTimeStringFromOffset('', hourOffset, false, true);
    }
    if (hourOffset !== '') {
      isoParsedDate += hourOffset;
    }
    var result =
      {
        value: isoParsedDate
      };
    return result;
  }

  // given a user defined pattern, derive the ecma options that will
  // be returned by getResolvedOptions method
  function _getResolvedOptionsFromPattern(locale, numberingSystemKey, pattern) {
    // expand single digit formats, then escape regular expression
    // characters.
    var expFormat = pattern.replace(_ESCAPE_REGEXP, '\\\\$1');
    var regexp = ['^'];
    var quoteCount = 0;
    var index = 0;
    var result = {
      locale: locale,
      numberingSystem: numberingSystemKey,
      calendar: 'gregorian'
    };
    // iterate through each date token found.
    var match = _TOKEN_REGEXP.exec(expFormat);
    while (match !== null) {
      var preMatch = expFormat.slice(index, match.index);
      index = _TOKEN_REGEXP.lastIndex;

      // skip matches that occur inside a string literal.
      quoteCount += _appendPreOrPostMatch(preMatch, regexp);
      if (quoteCount % 2 === 0) {
        // add a regex group for the token.
        var m = match[0];
        if (m !== '/' && m !== 'zzzz' && m !== 'zzz' && m !== 'zz' && m !== 'z') {
          if (_PROPERTIES_MAP[m] !== undefined) {
            if (_PROPERTIES_MAP[m].key !== undefined) {
              result[_PROPERTIES_MAP[m].key] = _PROPERTIES_MAP[m].value;
            }
            if (m === 'kk' || m === 'HH' || m === 'H' || m === 'k') {
              result.hour12 = false;
            } else if (m === 'KK' || m === 'hh' || m === 'h' || m === 'K') {
              result.hour12 = true;
            }
          } else {
            _throwInvalidDateFormat(pattern, result, m);
          }
        }
      }
      match = _TOKEN_REGEXP.exec(expFormat);
    }
    return result;
  }

  // test if the pattern is date, time or date-time
  // 0: date, 1:time, 2:date-time
  function _dateTimeStyleFromPattern(pattern) {
    var result = _getResolvedOptionsFromPattern('', '', pattern);
    var isDate = (result.year !== undefined ||
                  result.month !== undefined ||
                  result.weekday !== undefined ||
                  result.day !== undefined);
    var isTime = (result.hour !== undefined ||
                  result.minute !== undefined ||
                  result.second !== undefined ||
                  result.millisecond !== undefined);
    if (isDate && isTime) {
      return 2;
    } else if (isTime) {
      return 1;
    }
    return 0;
  }

  // test if the isoStr is date, time or date-time
  // 0: date, 1:time, 2:date-time
  function _isoStrDateTimeStyle(isoStr) {
    var timeIndex = isoStr.indexOf('T');
    if (timeIndex === -1) {
      return 0;
    }
    if (timeIndex > 0) {
      return 2;
    }
    return 1;
  }

  // test if the pattern/options is date, time or date-time
  // 0: date, 1:time, 2:date-time
  function _dateTimeStyle(options, caller) {
    // try pattern
    if (options.pattern !== undefined) {
      return _dateTimeStyleFromPattern(options.pattern);
    }

    // try ecma options
    var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(options, caller);
    var isTime = (getOption('hour', 'string', ['2-digit', 'numeric']) !== undefined ||
                  getOption('minute', 'string', ['2-digit', 'numeric']) !== undefined ||
                  getOption('second', 'string', ['2-digit', 'numeric']) !== undefined ||
                  getOption('millisecond', 'string', ['numeric']) !== undefined);
    var isDate = (getOption('year', 'string', ['2-digit', 'numeric']) !== undefined ||
                  getOption('month', 'string',
                            ['2-digit', 'numeric', 'narrow', 'short', 'long']) !== undefined ||
                  getOption('day', 'string', ['2-digit', 'numeric']) !== undefined ||
                  getOption('weekday', 'string', ['narrow', 'short', 'long']) !== undefined);
    if (isDate && isTime) {
      return 2;
    } else if (isTime) {
      return 1;
    } else if (isDate) {
      return 0;
    }

    // try predefined style
    var option = getOption('formatType', 'string',
        ['date', 'time', 'datetime'], 'date');
    if (option === 'datetime') {
      return 2;
    } else if (option === 'time') {
      return 1;
    }
    return 0;
  }

  function _getStdOffset(zone, value) {
    var index = _parseZone(zone, value, false, true, false);
    var offset0 = zone.ofset(index);
    var offset1 = zone.ofset(index + 1);
    return Math.max(offset0, offset1);
  }

  function _adjustHours(isoStrInfo, options, localeElements) {
    var value = isoStrInfo.isoStrParts;
    var isoStrFormat = isoStrInfo.format;
    var timeZone = options.timeZone;
    var zone = _getTimeZone(timeZone, localeElements);
    var utcd;
    var origOffset;
    var newOffset;
    var index;
    utcd = Date.UTC(value[0], value[1] - 1, value[2],
        value[3], value[4], value[5]);
    switch (isoStrFormat) {
      case _OFFSET :
        var tzParts = _parseTimezoneOffset(isoStrInfo.timeZone);
        var hoursOffset = tzParts[0];
        var minOffset = tzParts[1];
        origOffset = (hoursOffset * 60) +
          (hoursOffset < 0 ? -minOffset : minOffset);
        break;
      case _ZULU :
        origOffset = 0;
        break;
      default :
        break;
    }
    // get target zone offset:
    // 1.get target zone standard time offset
    newOffset = _getStdOffset(zone, value);
    // 2.adjust utcd to target zone
    utcd -= (newOffset + origOffset) * 60000;
    // 3.get target zone offset
    var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(options, 'OraDateTimeConverter');
    var dst = getOption('dst', 'boolean', [true, false], false);
    var isTimeOnly = isoStrInfo.dateTime.indexOf('T') === 0;
    index = zone.parse(utcd, dst, !isTimeOnly, false);
    newOffset = -zone.ofset(index);
    // adjust the offset
    newOffset -= origOffset;
    // Do the offset math through the Date object.
    var adjustD = new Date(Date.UTC(value[0], value[1] - 1, value[2],
        value[3], value[4], value[5]));

    var adjustedMin = adjustD.getUTCMinutes() + newOffset;
    // eslint-disable-next-line no-bitwise
    adjustD.setUTCHours(adjustD.getUTCHours() + ((adjustedMin / 60) << 0),
                        adjustedMin % 60);
    value[0] = adjustD.getUTCFullYear();
    value[1] = adjustD.getUTCMonth() + 1;
    value[2] = adjustD.getUTCDate();
    value[3] = adjustD.getUTCHours();
    value[4] = adjustD.getUTCMinutes();
    value[5] = adjustD.getUTCSeconds();
  }

  // Returns a time-only, date-only or date-time ISO string based on dtStyle.
  function _createISOStrParts(dtStyle, d) {
    var ms;
    var val = '';
    switch (dtStyle) {
      // Date only
      case 0 :
        val = __ConverterUtilsI18n.OraI18nUtils.padZeros(d[0], 4) + '-' + __ConverterUtilsI18n.OraI18nUtils.padZeros(d[1], 2) + '-' +
            __ConverterUtilsI18n.OraI18nUtils.padZeros(d[2], 2);
        break;
        // Time only
      case 1 :
        val = 'T' + __ConverterUtilsI18n.OraI18nUtils.padZeros(d[3], 2) + ':' +
            __ConverterUtilsI18n.OraI18nUtils.padZeros(d[4], 2) + ':' +
            __ConverterUtilsI18n.OraI18nUtils.padZeros(d[5], 2);
        ms = d[6];
        if (ms > 0) {
          val += '.' + __ConverterUtilsI18n.OraI18nUtils.trimRightZeros(__ConverterUtilsI18n.OraI18nUtils.padZeros(ms, 3));
        }
        break;
        // Date-Time
      default :
        val = __ConverterUtilsI18n.OraI18nUtils.padZeros(d[0], 4) + '-' +
            __ConverterUtilsI18n.OraI18nUtils.padZeros(d[1], 2) + '-' +
            __ConverterUtilsI18n.OraI18nUtils.padZeros(d[2], 2) +
            'T' + __ConverterUtilsI18n.OraI18nUtils.padZeros(d[3], 2) + ':' +
            __ConverterUtilsI18n.OraI18nUtils.padZeros(d[4], 2) + ':' +
            __ConverterUtilsI18n.OraI18nUtils.padZeros(d[5], 2);
        ms = d[6];
        if (ms > 0) {
          val += '.' + __ConverterUtilsI18n.OraI18nUtils.trimRightZeros(__ConverterUtilsI18n.OraI18nUtils.padZeros(ms, 3));
        }
        break;
    }
    return val;
  }

  function _getParseISOStringOffset(tzName, parts, dst, ignoreDst, localeElements, thowException) {
    var zone = _getTimeZone(tzName, localeElements);
    var index = _parseZone(zone, parts, dst, ignoreDst, thowException);
    // hours
    var offset = zone.ofset(index);
    return __ConverterUtilsI18n.OraI18nUtils.getTimeStringFromOffset('', offset, true, true);
  }

  function _createParseISOStringFromDate(dtStyle, isoStrInfo, options, localeElements) {
    var zone;
    var index;
    var offset;
    var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(options, 'OraDateTimeConverter.parse');
    var isoFormat = getOption('isoStrFormat', 'string',
                              [_ZULU, _OFFSET, _INVARIANT, _LOCAL, _AUTO], _AUTO);
    var dst = getOption('dst', 'boolean', [true, false], false);
    var ignoreDst = true;
    var parts = isoStrInfo.isoStrParts;
    var dTimeZone = isoStrInfo.timeZone;
    var tzName = options.timeZone;
    var isoStrFormat = isoStrInfo.format;
    var optionsFormat = options.isoStrFormat;
    var val = _createISOStrParts(dtStyle, parts);
    // do not include timezone if date-only or local
    if (dtStyle === 0 || optionsFormat === 'local') {
      return val;
    }
    // when iso string is time-only, do not ignore dst outside ambiguous intervals.
    if (dtStyle === 1) {
      ignoreDst = false;
    }
    switch (isoFormat) {
      case _OFFSET :
        if (tzName === undefined && isoStrFormat === _OFFSET) {
          val += dTimeZone;
        } else if (tzName === undefined && isoStrFormat === _LOCAL) {
          val += '';
        } else if (tzName === undefined && isoStrFormat === _ZULU) {
          val += '+00:00';
        } else if (tzName !== undefined) {
          offset = _getParseISOStringOffset(tzName, parts, dst, ignoreDst, localeElements, true);
          val += offset;
        }
        break;
      case _ZULU :
        var adjustedMin = 0;
        if (tzName === undefined) {
          if (isoStrFormat === _OFFSET) {
            offset = _parseTimezoneOffset(dTimeZone);
            var offsetHours = parseInt(offset[0], 10);
            var offsetMinutes = parseInt(offset[1], 10);
            adjustedMin = (offsetHours * 60) +
              (offsetHours < 0 ? -offsetMinutes : offsetMinutes);
            adjustedMin = -adjustedMin;
          }
        } else {
          zone = _getTimeZone(tzName, localeElements);
          index = _parseZone(zone, parts, dst, ignoreDst, true);
          offset = zone.ofset(index);
          adjustedMin = offset;
        }
        if (adjustedMin !== 0) {
          // Do the offset math through date object.
          var adjustD = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2],
                                          parts[3], parts[4], parts[5], parts[6]));
          adjustedMin = adjustD.getUTCMinutes() + adjustedMin;
          // eslint-disable-next-line no-bitwise
          adjustD.setUTCHours(adjustD.getUTCHours() + ((adjustedMin / 60) << 0),
                              adjustedMin % 60);
          parts[0] = adjustD.getUTCFullYear();
          parts[1] = adjustD.getUTCMonth() + 1;
          parts[2] = adjustD.getUTCDate();
          parts[3] = adjustD.getUTCHours();
          parts[4] = adjustD.getUTCMinutes();
          parts[5] = adjustD.getUTCSeconds();
          val = _createISOStrParts(dtStyle, parts);
        }
        val += 'Z';
        break;
      case _AUTO :
        if (tzName !== undefined) {
          offset = _getParseISOStringOffset(tzName, parts, dst, ignoreDst, localeElements, true);
          val += offset;
        } else {
          offset = dTimeZone;
          if (offset) {
            val += offset;
          }
        }
        break;
      default :
        break;
    }
    return val;
  }

  function _parseImpl(str, localeElements, options, locale) {
    var numberingSystemKey = __ConverterUtilsI18n.OraI18nUtils.getNumberingExtension(locale);
    if (__ConverterUtilsI18n.OraI18nUtils.numeringSystems[numberingSystemKey] === undefined) {
      numberingSystemKey = 'latn';
    }
    if (numberingSystemKey !== 'latn') {
      var latnStr = [];
      for (var idx = 0; idx < str.length; idx++) {
        var pos =
        __ConverterUtilsI18n.OraI18nUtils.numeringSystems[numberingSystemKey].indexOf(str[idx]);
        if (pos !== -1) {
          latnStr.push(pos);
        } else {
          latnStr.push(str[idx]);
        }
      }
      // eslint-disable-next-line no-param-reassign
      str = latnStr.join('');
    }
    if (arguments.length <= 2 || options === undefined) {
      // default is yMd
      // eslint-disable-next-line no-param-reassign
      options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      };
    }
    var dtStyle;
    var formats;
    // First try if str is an iso 8601 string
    var testIsoStr = __ConverterUtilsI18n.OraI18nUtils._ISO_DATE_REGEXP.test(str);
    var parsedIsoStr;
    var isoStrInfo;
    var res = {};
    if (testIsoStr === true) {
      parsedIsoStr = str;
      dtStyle = _isoStrDateTimeStyle(str);
    } else {
      formats = options.pattern || _expandFormat(options, localeElements,
                                                 locale, 'OraDateTimeConverter.parse');
      dtStyle = _dateTimeStyle(options, 'OraDateTimeConverter.parse');
      res = _parseExact(str, formats, options, localeElements);
      parsedIsoStr = res.value;
    }
    isoStrInfo = __ConverterUtilsI18n.OraI18nUtils.getISOStrFormatInfo(parsedIsoStr);
    if (options.timeZone !== undefined && isoStrInfo.format !== _LOCAL) {
      _adjustHours(isoStrInfo, options, localeElements);
    }
    parsedIsoStr = _createParseISOStringFromDate(dtStyle, isoStrInfo, options, localeElements);
    res.value = parsedIsoStr;
    return res;
  }

  // If one of the iso strings is local/invariant parse both strings as local.
  // Else, normalize both strings to zulu
  function _getCompareISODatesOptions(isoStr1, isoStr2) {
    var options = { isoStrFormat: _LOCAL };
    var isoInfo1 = __ConverterUtilsI18n.OraI18nUtils.getISOStrFormatInfo(isoStr1);
    var isoInfo2 = __ConverterUtilsI18n.OraI18nUtils.getISOStrFormatInfo(isoStr2);
    var isoInfo1Format = isoInfo1.format;
    var isoInfo2Format = isoInfo2.format;
    if (isoInfo1Format === _LOCAL || isoInfo2Format === _LOCAL) {
      return options;
    }
    options.isoStrFormat = _ZULU;
    return options;
  }

  function _getPatternResolvedOptions(isoFormat, tz, dst, locale,
    numberingSystemKey, options, getOption) {
    var result = _getResolvedOptionsFromPattern(locale, numberingSystemKey,
                                                options.pattern);
    result.pattern = options.pattern;
    if (isoFormat !== undefined) {
      result.isoStrFormat = isoFormat;
    }
    if (tz !== undefined) {
      result.timeZone = tz;
    }
    if (dst !== undefined) {
      result.dst = dst;
    }
    result['two-digit-year-start'] = _get2DigitYearStart(options);
    result.lenientParse = getOption('lenientParse', 'string', ['none', 'full'], 'full');
    return result;
  }

  function _getECMAResolvedOptions(getOption, _result, dst, localeElements) {
    var result = _result;
    var ecma = false;
    var option;
    if (dst !== undefined) {
      result.dst = dst;
    }
    option = getOption('year', 'string', ['2-digit', 'numeric']);
    if (option !== undefined) {
      result.year = option;
      ecma = true;
    }
    option = getOption('era', 'string', ['narrow', 'short', 'long']);
    if (option !== undefined) {
      result.era = option;
      ecma = true;
    }
    option = getOption('month', 'string', ['2-digit', 'numeric', 'narrow', 'short', 'long']);
    if (option !== undefined) {
      result.month = option;
      ecma = true;
    }
    option = getOption('day', 'string', ['2-digit', 'numeric']);
    if (option !== undefined) {
      result.day = option;
      ecma = true;
    }
    option = getOption('weekday', 'string', ['narrow', 'short', 'long']);
    if (option !== undefined) {
      result.weekday = option;
      ecma = true;
    }
    option = getOption('hour', 'string', ['2-digit', 'numeric']);
    if (option !== undefined) {
      result.hour = option;
      ecma = true;
      option = getOption('hour12', 'boolean', [true, false]);
      if (option === undefined) {
        option = _isHour12(localeElements);
      }
      result.hour12 = option;
    }
    option = getOption('minute', 'string', ['2-digit', 'numeric']);
    if (option !== undefined) {
      result.minute = option;
      ecma = true;
    }
    option = getOption('second', 'string', ['2-digit', 'numeric']);
    if (option !== undefined) {
      result.second = option;
      ecma = true;
    }
    option = getOption('millisecond', 'string', ['numeric']);
    if (option !== undefined) {
      result.millisecond = option;
      ecma = true;
    }
    return ecma;
  }

  function _getPredefinedStylesResolvedOptions(_result, options, localeElements, getOption) {
    var result = _result;
    var format = _expandPredefinedStylesFormat(options, localeElements,
                                               OraDateTimeConverter.resolvedOptions);
    var fmtType = getOption('formatType', 'string',
                            ['date', 'time', 'datetime'], 'date');
    var dStyle = getOption('dateFormat', 'string',
                           ['short', 'medium', 'long', 'full'], 'short');
    var tStyle = getOption('timeFormat', 'string',
                           ['short', 'medium', 'long', 'full'], 'short');
    result.formatType = fmtType;
    if (fmtType === 'datetime' || fmtType === 'date') {
      result.dateFormat = dStyle;
    }
    if (fmtType === 'datetime' || fmtType === 'time') {
      result.timeFormat = tStyle;
    }
    result.patternFromOptions = format;
    result.lenientParse = getOption('lenientParse', 'string', ['none', 'full'], 'full');
  }

  function _getRelativeTimeResolvedOptions(getOption, _result) {
    var result = _result;
    var option = getOption('formatUsing', 'string', ['displayName', 'calendar']);
    if (option !== undefined) {
      result.formatUsing = option;
    }
    option = getOption('dateField', 'string',
                       ['day', 'week', 'month', 'year', 'hour', 'minute', 'second']);
    if (option !== undefined) {
      result.dateField = option;
    }
    option = getOption('relativeTime', 'string',
                       ['fromNow', 'toNow']);
    if (option !== undefined) {
      result.relativeTime = option;
    }
    option = getOption('dateOnly', 'boolean', [true, false]);
    if (option !== undefined) {
      result.dateOnly = option;
    }
  }

  function _getResolvedOptions(options, getOption, tz, dst, isoFormat,
    localeElements, numberingSystemKey, locale) {
    var result = {
      locale: locale,
      numberingSystem: numberingSystemKey,
      calendar: 'gregorian'
    };
    var optionsKeys = Object.keys(options);
    if (optionsKeys.length === 0) {
      result.year = 'numeric';
      result.month = 'numeric';
      result.day = 'numeric';
      result.lenientParse = 'full';
      return result;
    }
    if (tz !== undefined) {
      result.timeZone = tz;
      if (isoFormat !== undefined) {
        result.isoStrFormat = isoFormat;
      }
    }

    _getRelativeTimeResolvedOptions(getOption, result);

    var ecma = _getECMAResolvedOptions(getOption, result, dst, localeElements);
    result['two-digit-year-start'] = _get2DigitYearStart(options);
    if (!ecma) {
      _getPredefinedStylesResolvedOptions(result, options, localeElements, getOption);
      return result;
    }
    if (tz !== undefined) {
      var option = getOption('timeZoneName', 'string', ['short', 'long']);
      if (option !== undefined) {
        result.timeZoneName = option;
      }
    }
    result.lenientParse = getOption('lenientParse', 'string', ['none', 'full'], 'full');
    result.patternFromOptions = _expandFormat(result,
        localeElements, locale, 'OraDateTimeConverter.resolvedOptions');
    return result;
  }

  function _getResolvedDefaultOptions(localeElements, locale, numberingSystemKey) {
    var defaultOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    };
    var patternFromOptions = _expandFormat(defaultOptions,
        localeElements, locale, 'OraDateTimeConverter.resolvedOptions');
    return {
      calendar: 'gregorian',
      locale: locale,
      numberingSystem: numberingSystemKey,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      patternFromOptions: patternFromOptions,
      lenientParse: 'full'
    };
  }

  function _resolvedOptionsImpl(localeElements, options, locale) {
    if (arguments.length < 3 || locale === undefined) {
      // eslint-disable-next-line no-param-reassign
      locale = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
    }
    if (arguments.length < 2 || options === undefined) {
      // default is yMd
      // eslint-disable-next-line no-param-reassign
      options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      };
    }
    var tz;
    var isoFormat;
    var dst;
    var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(options, 'OraDateTimeConverter.resolvedOptions');
    if (options !== undefined) {
      isoFormat = getOption('isoStrFormat', 'string',
                            [_ZULU, _OFFSET, _INVARIANT, _LOCAL, _AUTO], _AUTO);
      dst = getOption('dst', 'boolean', [true, false], false);
      tz = options.timeZone;
    }
    var numberingSystemKey = __ConverterUtilsI18n.OraI18nUtils.getNumberingExtension(locale);
    if (__ConverterUtilsI18n.OraI18nUtils.numeringSystems[numberingSystemKey] === undefined) {
      numberingSystemKey = 'latn';
    }
    if (options !== undefined && options.pattern !== undefined) {
      return _getPatternResolvedOptions(isoFormat, tz, dst, locale,
                                        numberingSystemKey, options, getOption);
    }
    if (options !== undefined) {
      return _getResolvedOptions(options, getOption, tz, dst, isoFormat,
                                 localeElements, numberingSystemKey, locale);
    }
    return _getResolvedDefaultOptions(localeElements, locale, numberingSystemKey);
  }

  function _availableTimeZonesImpl(localeElements) {
    var tz = OraTimeZone.getInstance();
    var sortOptions = { sensitivity: 'variant' };
    var sortLocale = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
    var mainNode = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var metaZones = mainNode.dates.timeZoneNames.metazone;
    var cities = mainNode.dates.timeZoneNames.zone;
    var sortedZones = [];
    var offsets = {};
    var tzData = localeElements.supplemental.timeZoneData;
    var d = new Date();
    var dParts = [
      d.getFullYear(), d.getMonth() + 1, d.getDate(),
      d.getHours(), d.getMinutes(), d.getSeconds()
    ];

    function getLocalizedName(id, offset, _metaZones, _cities) {
      var parts = id.split('/');
      var region = parts[0];
      var city = parts[1];
      var locCity = '';
      var locZone = '';
      var nameObject = {};
      var metaRegion = _cities[region];
      if (metaRegion !== undefined) {
        locCity = metaRegion[city];
        if (locCity !== undefined) {
          locCity = locCity.exemplarCity;
          if (locCity !== undefined) {
            locCity = ' ' + locCity;
          }
        }
      }
      var _id = region + '/' + city;
      var metazones = localeElements.supplemental.metazones;
      var metaZone = _getMetazone(dParts, _id, metazones);
      if (_metaZones !== undefined) {
        metaZone = _metaZones[metaZone];
      }
      if (metaZone !== undefined && metaZone !== null && metaZone.long !== undefined) {
        locZone = metaZone.long.generic;
        // some metazones do not have generic. Use standard
        if (locZone === undefined) {
          locZone = metaZone.long.standard;
        }
        if (locZone !== undefined) {
          locZone = ' - ' + locZone;
        }
      }
      var locName = '(' + _UTC + ')';
      if (offset !== 0) {
        locName =
          __ConverterUtilsI18n.OraI18nUtils.getTimeStringFromOffset(_UTC, offset, true, true);
        locName = '(' + locName + ')';
      }
      if (locCity === undefined || locZone === undefined) {
        return null;
      }
      nameObject.offsetLocName = locName + locCity + locZone;
      nameObject.locName = locCity + locZone;
      return nameObject;
    }

    function pushZoneNameObject(zones) {
      var zone;
      var offset;
      var zoneNames = Object.keys(zones);
      for (var i = 0; i < zoneNames.length; i++) {
        var zoneName = zoneNames[i];
        zone = tz.getZone(zoneName, localeElements);
        offset = _getStdOffset(zone, dParts);
        var localizedName = getLocalizedName(zoneName, offset, metaZones, cities);
        if (localizedName !== null) {
          sortedZones.push({
            id: zoneName,
            displayName: localizedName
          });
        }
        offsets[zoneName] = offset;
      }
    }

    // return cahched array if available
    var locale = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
    if (_timeZoneDataCache[locale] !== undefined) {
      var ret = _timeZoneDataCache[locale].availableTimeZones;
      if (ret !== undefined) {
        return ret;
      }
    }

    pushZoneNameObject(tzData.zones);
    // add the links
    pushZoneNameObject(tzData.links);
    sortedZones.sort(function (a, b) {
      var res1 = (offsets[b.id] - offsets[a.id]);
      var res2 =
          a.displayName.locName.localeCompare(b.displayName.locName, sortLocale, sortOptions);
      return (res1 + res2);
    });
    var len = sortedZones.length;
    // return an array with "display name with offset" instead of the
    // object localizedName which was only used for sorting
    for (var j = 0; j < len; j++) {
      sortedZones[j].displayName = sortedZones[j].displayName.offsetLocName;
    }
    // cache the sorted zones
    if (_timeZoneDataCache[locale] === undefined) {
      _timeZoneDataCache[locale] = {};
      _timeZoneDataCache[locale].availableTimeZones = sortedZones;
    }
    return sortedZones;
  }

  function _init() {
    return {
      /**
       * Format a date.
       * @memberof OraDateTimeConverter
       * @param {string} value - an iso 8601 string to be formatted. It  may be in
       * extended or non-extended form. http://en.wikipedia.org/wiki/ISO_8601
       * @param {Object} localeElements - the instance of LocaleElements bundle.
       * @param {Object=} options - Containing the following properties:<br>
       * - <b>weekday.</b> Allowed values: "narrow", "short", "long".<br>
       * - <b>era.</b> Allowed values: "narrow", "short", "long".<br>
       * - <b>year.</b> Allowed values:"2-digit", "numeric".<br>
       * - <b>month.</b> Allowed values: "2-digit", "numeric", "narrow",
       * "short", "long".<br>
       * - <b>day.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>hour.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>minute.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>second.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>millisecond.</b> Allowed values: "numeric".<br>
       * - <b>timeZone.</b> The possible values of the timeZone property are valid IANA timezone IDs.
       * If the users want to pass an offset, they can use one of the Etc/GMT timezone IDs.
       *  yet.<br>
       * - <b>timeZoneName.</b> allowed values are "short", "long". </b> <br>
       * - <b>dst.</b> is a Boolean value. Setting dst to true indicates the time is in DST. By default the
       * time is interpreted as standard time. The possible values of dst are: "true" or "false". Default is "false".<br>
       * - <b>hour12.</b> is a Boolean value indicating whether 12-hour format
       * (true) or 24-hour format (false) should be used. It is only relevant
       * when hour is also present.<br>
       * - <b>pattern.</b> custom String pattern as defined by Unicode CLDR.<br>
       * - <b>formatType.</b> a predefined formatting type. Allowed values:
       * "date", "time", "datetime".<br>
       * - <b>dateFormat.</b> optional, specifies the date format field.
       * Allowed values: "short", "medium", "long", "full". It is only
       * considered when formatType is present. The default value
       * is "short".<br>
       * - <b>timeFormat.</b> optional, specifies the time format field.
       * Allowed values: "short", "medium", "long", "full". It is only
       * considered when formatType is present. The default value
       * is "short".<br><br>
       * The order of precedence is the following:<br>
       * 1. pattern.<br>
       * 2. ECMA options.<br>
       * 3. formatType.<br>
       * If options is ommitted, the default will be the following object:<br>
       * {<br>
       * year:"numeric",<br>
       * month:"numeric",<br>
       * day:"numeric"<br>
       * };
       * @param {string=} locale - A BCP47 compliant language tag. it is only
       * used to extract the unicode "nu" extension key. We currently support "arab", "latn" and "thai"
       * numbering systems. EX: locale: 'en-US-u-nu-latn'
       * @return {string|null} formatted date.
       * @throws {RangeError} If a propery value of the options parameter is
       * out of range.
       * @throws {SyntaxError} If an Unexpected token is encountered in the
       * pattern.
       * @throws {invalidISOString} if the ISO string is not valid.

       */
      format: function (value, localeElements, options, locale) {
        var val;
        if (typeof value === 'number') {
          val = __ConverterUtilsI18n.OraI18nUtils.dateToLocalIso(new Date(value));
        } else if (typeof value === 'string') {
          val = __ConverterUtilsI18n.OraI18nUtils.trim(value);
          if (val === '') {
            return null;
          }
        } else {
          return null;
        }
        if (arguments.length <= 2 || options === undefined) {
          // default is yMd
          // eslint-disable-next-line no-param-reassign
          options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
          };
        }
        var isoStrInfo = __ConverterUtilsI18n.OraI18nUtils.getISOStrFormatInfo(val);
        var ret = _formatImpl(localeElements, options, isoStrInfo, locale);
        var numberingSystemKey = __ConverterUtilsI18n.OraI18nUtils.getNumberingExtension(locale);
        if (__ConverterUtilsI18n.OraI18nUtils.numeringSystems[numberingSystemKey] === undefined) {
          numberingSystemKey = 'latn';
        }
        if (numberingSystemKey !== 'latn') {
          var nativeRet = [];
          for (var idx = 0; idx < ret.length; idx++) {
            if (ret[idx] >= '0' && ret[idx] <= '9') {
              nativeRet.push(
                __ConverterUtilsI18n.OraI18nUtils.numeringSystems[numberingSystemKey][ret[idx]]);
            } else {
              nativeRet.push(ret[idx]);
            }
          }
          return nativeRet.join('');
        }
        return ret;
      },

      /**
       * Formats an ISO String as a relative date time.
       * <p>
       *
       * @param {string} value - iso 8601 string to be formatted. This value is compared with the current date
       * on the client to arrive at the relative formatted value.
       *  @param {Object} localeElements - the instance of LocaleElements bundle.
       * @param {Object=} options - an Object literal containing the following properties. The
       * default options are ignored during relative formatting <br>
       * <b>formatUsing:</b> - Specifies the relative formatting convention.
       * Allowed values are "displayName" and "calendar". Setting value to "displayName" uses the relative
       * display name for the instance of the dateField, and one or two past and future instances.
       * When omitted we use the implicit rules.<br>
       * <b>dateField:</b> - To be used in conjunction of 'displayName'  value
       * of formatUsing attribute.  Allowed values are: "day", "week", "month", "year", "hour", "minute", "second".<br>
       * relativeTime:</b> - Allowed values are: "fromNow", "toNow". "fromNow" means the system's
       * current date is the reference and "toNow" means the value attribute is the reference. Default "fromNow".<br>
       * <b>dateOnly:</b> - A boolean value that can be used in conjunction with
       * calendar of formatUsing attribute.  When set to true date only format is used. Example: Sunday
       * instead of Sunday at 2:30 PM. Default value is false.<br>
       * <b>timeZone:</b> - The timeZone attribute can be used to specify the
       * time zone of the  value parameter.  The system's time zone is used for the current time. If timeZone
       * attribute is not specified, we use the system's time zone  for both. The value parameter, which is an
       * iso string, can be Z or contain and offset, in this case  the timeZone attribute is overwritten.
       *
       * @return {string} relative date.
       *
       * @example <caption>Relative time in the future using implicit rules</caption>
       * var localeElements;
       * var dateInFuture = new Date();
       * dateInFuture.setMinutes(dateInFuture.getMinutes() + 41);
       * dateInFuture = __ConverterUtilsI18n.OraI18nUtils.dateToLocalIso(dateInFuture);
       * var formatted = converter.formatRelative(dateInFuture, localeElements); -> in 41 minutes
       *
       * @example <caption>Relative time in the past using implicit rules</caption>
       * var localeElements;
       * var dateInPast = new Date();
       * dateInPast.setHours(dateInPast.getHours() - 20);
       * dateInPast = __ConverterUtilsI18n.OraI18nUtils.dateToLocalIso(dateInPast);
       * var formatted = converter.formatRelative(dateInPast, localeElements); -> 20 hours ago
       *
       * @example <caption>Relative time using dateField. Assuming system's current date is 2016-07-28.</caption>
       * Format relative year:
       * var localeElements;
       * var options = {formatUsing: "displayName", dateField: "year"};
       * var formatted = converter.formatRelative("2015-06-01T00:00:00", localeElements, options); -> last year
       *
       * @example <caption>Relative time using relativeTime. Assuming system's current date is 2016-07-28.</caption>
       * var localeElements;
       * var options = {formatUsing: "displayName", dateField: "day", relativeTime: "fromNow"};
       * var formatted = converter.formatRelative("2016-07-28T00:00:00", localeElements, options); -> tomorrow
       * options = {formatUsing: "displayName", dateField: "day", relativeTime: "toNow"};
       * formatted = converter.formatRelative("2016-07-28T00:00:00", localeElements, options); -> yesterday
       *
       * @example <caption>Relative time using calendar. Assuming system's current date is 2016-07-28.</caption>
       * var localeElements;
       * var options = {formatUsing: "calendar"};
       * var formatted = converter.formatRelative("2016-07-28T14:15:00", localeElements, options); -> tomorrow at 2:30 PM
       *
       *
       * @example <caption>Relative time using timeZone. Assuming that the system's time zone is America/Los_Angeles.</caption>
       * var localeElements;
       * var options = {timeZone:"America/New_York"};
       * var nyDateInFuture = new Date();
       * nyDateInFuture.setHours(nyDateInFuture.getHours() + 6);
       * nyDateInFuture = __ConverterUtilsI18n.OraI18nUtils.dateToLocalIso(nyDateInFuture);
       * var formatted = converter.formatRelative(nyDateInFuture, localeElements, options); -> in 3 hours
       *
       * @memberof OraDateTimeConverter
       * @export
       */
      formatRelative: function (value, localeElements, options) {
        return _formatRelativeImpl(value, localeElements, options);
      },

      /**
       * Parse a date. It also support lenient parse when input does not match
       * the pattern.<br>
       * We first try to match month a pattern where we have month and weekday
       * names Ex:  Monday Nov, 11 2013
       * weekday name and month name can be anywhere in the string.
       * if year > 2-digits it can be anywhere in the string. Otherwise we assume
       * its position based on pattern. Separators can be any non digit characters
       * <br>If month name is not present, we try lenient parse yMd and yMEd
       * pattern. Must have year, moth and date all numbers. Ex: 5/3/2013 weekday
       * is optional. If present it must match date. Ex:  Tuesday 11/19/2013
       * if year > 2-digits it can be anywhere in the string. Otherwise assume its
       * position based on pattern if date > 12 it can be anywhere in the string.
       * Otherwise assume its position based on pattern separators can be any
       * non digit characters.<br><br>
       * @memberof OraDateTimeConverter
       * @param {string} str - a String to be parsed. it can be an iso 8601 string
       * or a formatted string.
       * @param {Object} localeElements - The instance of LocaleElements bundle
       * @param {Object=} options - Containing the following properties:<br>
       * - <b>weekday.</b> Allowed values: "narrow", "short", "long".<br>
       * - <b>era.</b> Allowed values: "narrow", "short", "long".<br>
       * - <b>year.</b> Allowed values:"2-digit", "numeric".<br>
       * - <b>month.</b> Allowed values: "2-digit", "numeric", "narrow",
       * "short", "long".<br>
       * - <b>day.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>hour.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>minute.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>second.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>millisecond.</b> Allowed values: "numeric".<br>
       * - <b>timeZone.</b> The possible values of the timeZone property are valid IANA timezone IDs.
       * If the users want to pass an offset, they can use one of the Etc/GMT timezone IDs.
       *  yet.<br>
       * - <b>timeZoneName.</b> allowed values are "short", "long". </b> <br>
       * - <b>dst</b> is a Boolean value. Setting dst to true indicates the time is in DST. By default the
       * time is interpreted as standard time. The possible values of dst are: "true" or "false". Default is "false".<br>
       * -<b>isoStrFormat.</b>specifies in which format the ISO string is returned.
       * The possible values of isoStrFormat are: "offset", "zulu", "local", "auto". The default format is auto.<br>
       * - <b>hour12.</b> is a Boolean value indicating whether 12-hour format
       * (true) or 24-hour format (false) should be used. It is only relevant
       * when hour is also present.<br>
       * - <b>pattern.</b> custom String pattern as defined by Unicode CLDR.<br>
       * - <b>two-digit-year-start.</b> the 100-year period 2-digit year.
       * During parsing, two digit years will be placed in the range
       * two-digit-year-start to two-digit-year-start + 100 years.
       * The default is 1950.<br>
       * - <b>formatType.</b> a predefined formatting type. Allowed values:
       * "date", "time", "datetime".<br>
       * - <b>dateFormat.</b> optional, specifies the date format. Allowed
       * values: "short", "medium", "long", "full". It is only considered when
       * formatType is present. The default value is "short".<br>
       * - <b>timeFormat.</b> optional, specifies the time format. Allowed
       * values: "short", "medium", "long", "full". It is only considered when
       * formatType is present. The default value is "short".<br><br>
       * The order of precedence is the following:<br>
       * 1. pattern.<br>
       * 2. ECMA options.<br>
       * 3. formatType.<br>
       * If options is ommitted, the default will be the following object:<br>
       * {<br>
       * year:"numeric",<br>
       * month:"numeric",<br>
       * day:"numeric"<br>
       * };<br>
       * - <b>lenientParse.</b> specifies if lenient parse is enabled or disabled. Allowed values: "full", "none".
       * default is "full" which means lenient parse is enabled.<br>
       * @param {string=} locale - A BCP47 compliant language tag. it is only
       * used to extract the unicode "nu" extension key. We currently support "arab", "latn" and "thai"
       * numbering systems. EX: locale: 'en-US-u-nu-latn'
       * @return {string} an iso 8601 extended String. http://en.wikipedia.org/wiki/ISO_8601.
       * If the patern is a date only, returns the date part of the iso string.
       * If the pattern is time only, returns the time part of the iso string.
       * If the pattern is date-time, returns the date-time iso string.
       * <br>Example1:
       * <br> var pattern = 'MM/dd/yy hh:mm:ss a';
       * <br> cnv.parse('09/11/14 03:02:01 PM', localeElems, pattern);
       * <br> The return value is '2014-10-20T15:02:01';
       * <br>Example2:
       * <br> var pattern = 'MM/dd/yy';
       * <br> cnv.parse('09/11/14', localeElems, pattern);
       * <br> The return value is '2014-10-20';
       * <br>Example3:
       * <br> var pattern = 'hh:mm:ss a';
       * <br> cnv.parse('03:02:01 PM', localeElems, pattern);
       * <br> The return value is 'T15:02:01';
       * @throws {RangeError} If a property value of the options parameter is
       * out of range.
       * @throws {SyntaxError} If an Unexpected token is encountered in the
       * pattern.
       * @throws {Error} If the <i>str</i> parameter does not match the format
       * pattern.
       * @throws {RangeError} if one of the date fields is out of range.
       * @throws {invalidISOString} if the string to be parsed is an invalid ISO string.
       */
      parse: function (str, localeElements, options, locale) {
        return _parseImpl(str, localeElements, options, locale);
      },

      /**
       * Resolve options.
       * Returns a new object with properties reflecting the date and time
       * formatting options computed based on the options parameter.
       * If the options parameter is ommitted, the following object will be
       * returned:<br>
       * {<br>
       * calendar: "gregorian"<br>
       * numberingSystem: "latn"<br>
       * locale: &lt;locale parameter&gt;,<br>
       * day: "numeric",<br>
       * month: "numeric",<br>
       * year: "numeric"<br>
       * };
       * @memberof OraDateTimeConverter
       * @param {Object} localeElements - The instance of LocaleElements bundle
       * @param {Object=} options - Containing the following properties:<br>
       * - <b>calendar.</b> The calendar system.<br>
       * - <b>weekday.</b> Allowed values: "narrow", "short", "long".<br>
       * - <b>era.</b> Allowed values: "narrow", "short", "long".<br>
       * - <b>year.</b> Allowed values:"2-digit", "numeric".<br>
       * - <b>month.</b> Allowed values: "2-digit", "numeric", "narrow",
       * "short", "long".<br>
       * - <b>day.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>hour.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>minute.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>second.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>millissecond.</b> Allowed values: "numeric".<br>
       * - <b>timeZone.</b> The possible values of the timeZone property are valid IANA timezone IDs.<br>
       * - <b>timeZoneName.</b> allowed values are "short", "long". </b> <br>
       * - <b>dst.</b> is a Boolean value. The possible values of dst are: "true" or "false". Default is "false".<br>
       * - <b>isoStrFormat.</b> specifies in which format the ISO string is returned.
       * The possible values of isoStrFormat are: "offset", "zulu", "local", "auto". The default format is auto.<br>
       * - <b>hour12.</b> is a Boolean value indicating whether 12-hour format
       * (true) or 24-hour format (false) should be used. It is only relevant
       * when hour is also present.<br>
       * - <b>pattern.</b> custom String pattern as defined by Unicode CLDR.
       * Will override above options when present.<br>
       * - <b>two-digit-year-start.</b> the 100-year period 2-digit year.
       * During parsing, two digit years will be placed in the range
       * two-digit-year-start to two-digit-year-start + 100 years.
       * The default is 1950.<br>
       * - <b>formatType.</b> predefined format type.  Allowed values:
       * "datetime", "date", "time"<br>
       * - <b>dateFormat.</b> format of date field.  Allowed values: "short",
       * "medium", "long", "full". It is only relevant when formatType is also
       * present<br>
       * - <b>timeFormat.</b> format of time field.  Allowed values: "short",
       * "medium", "long", "full". It is only relevant when formatType is also
       * present<br>
       * - <b>lenientParse.</b> specifies if lenient parse is enabled or disabled. Allowed values: "full", "none".
       * default is "full" which means lenient parse is enabled.<br>
       * @param {string=} locale - A BCP47 compliant language tag. it is only
       * used to extract the unicode extension keys.
       * @return {Object} Resolved options object.
       * @throws {RangeError} If a property value of the options parameter is
       * out of range.
       * @throws {Error} if weekday does not match the date.
       */
      resolvedOptions: function (localeElements, options, locale) {
        return _resolvedOptionsImpl(localeElements, options, locale);
      },

      /**
       * Returns the current week in the year when provided a date.
       * @memberof OraDateTimeConverter
       * @param {string} date - iso 8601 string. It may be in extended or
       * non-extended form. http://en.wikipedia.org/wiki/ISO_8601
       * @return {number}. The current week in the year when provided a date.
       */
      calculateWeek: function (date) {
        var d = __ConverterUtilsI18n.OraI18nUtils.isoToLocalDate(date);
        var time;
        var checkDate = new Date(d.getTime());

        // Find Thursday of this week starting on Monday
        checkDate.setDate((checkDate.getDate() + 4) - (checkDate.getDay() || 7));
        time = checkDate.getTime();
        checkDate.setMonth(0);// Compare with Jan 1
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
      },

      /**
       * Returns the available timeZones.
       * @memberof OraDateTimeConverter
       * @param {Object} localeElements - The instance of LocaleElements bundle
       * @return {Object}. An array of objects. Each object represents a timezone
       * and contains 2 attributes:<br>
       * 'id': IANA timezone ID<br>
       * 'displayName': It is the concatenation of 3 strings:<br>
       * 1- UTC timezone offset.<br>
       * 2- City name.<br>
       * 3- Generic time zone name
       * The displayName attribute is localized based on the current locale.
       * Example of an array entry in en-US locale:
       * {id: 'America/Edmonton',<br>
       *  displayName: '(UTC-07:00) Edmonton - Mountain Time'<br>
       * }<br>
       * The same array entry is the following in fr-FR locale:
       * {id: 'America/Edmonton',<br>
       *  displayName: '(UTC-07:00) Edmonton - heure des Rocheuses'<br>
       * }<br>
       * The array is sorted by offsets in ascending order. Within the same offset,
       * the entries by displayName in ascending order.
       */
      getAvailableTimeZones: function (localeElements) {
        return _availableTimeZonesImpl(localeElements);
      },

      /**
       * Compares 2 ISO 8601 strings.
       * @memberof OraDateTimeConverter
       * @param {string} isoStr1 isoString that may be date, time or date-time and possible timezone info
       * @param {string} isoStr2 isoString that may be date, time or date-time and with possible timezone info
       * @param {Object} localeElements - The instance of LocaleElements bundle
       * @returns {number} 0 if isoStr1 is equal to this isoStr2;
       *  a value less than 0 if isoStr1 is before isoStr2; and a value
       *  greater than 0 if isoStr1 is after isoStr2.
       */
      compareISODates: function (isoStr1, isoStr2, localeElements) {
        var options = _getCompareISODatesOptions(isoStr1, isoStr2);
        var iso1 = _parseImpl(isoStr1, localeElements, options, 'en-US');
        var iso2 = _parseImpl(isoStr2, localeElements, options, 'en-US');
        var str1 = iso1.value.replace('Z', '');
        var str2 = iso2.value.replace('Z', '');
        var datetime1 = __ConverterUtilsI18n.OraI18nUtils._IsoStrParts(str1);
        datetime1 = Date.UTC(datetime1[0], datetime1[1] - 1, datetime1[2], datetime1[3],
                             datetime1[4], datetime1[5], datetime1[6]);
        var datetime2 = __ConverterUtilsI18n.OraI18nUtils._IsoStrParts(str2);
        datetime2 = Date.UTC(datetime2[0], datetime2[1] - 1, datetime2[2], datetime2[3],
                             datetime2[4], datetime2[5], datetime2[6]);
        return (datetime1 - datetime2);
      },

      /**
       * returns if a locale is 12 or 24 hour format.
       * @memberof OraDateTimeConverter
       * @param {Object} localeElements - The instance of LocaleElements bundle
       * @returns {boolean} true if the locale's preferred hour format is 12, false for 24 hour format.
       * @since 2.2
       */
      isHour12: function (localeElements) {
        return _isHour12(localeElements);
      },

      /**
       * returns time tokens positions
       * @memberof OraDateTimeConverter
       * @param {Object} localeElements - the instance of LocaleElements bundle.
       * @param {Object=} options - ECMA options or a pattern<br>
       * @param {string=} locale - A BCP47 compliant language tag. it is only
       * used to extract the unicode extension keys.
       * @return {Object}. time tokens positions. For example  if the pattern is 'hh:mm a'
       * the return value is { 'h': 0, 'm': 1, 'a': 2 }, fot RTL locales the order
       * of the tokens is reversed for 'h' and 'm' { 'h':1, 'm': 0, 'a': 2 }
       */
      getTimePositioning: function (localeElements, options, locale) {
        var resOptions = _resolvedOptionsImpl(localeElements, options, locale);
        var pattern = resOptions.pattern || resOptions.patternFromOptions;
        pattern = pattern.replace(/'[^']*'/g, '').replace(/[^hHkKma]*/g, '');
        pattern = pattern.replace(/(h|H|k|K)+/, 'h').replace(/m+/, 'm');
        var mainNodeKey =
        __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
        var lang = _getBCP47Lang(mainNodeKey);
        var isRTL = (lang === 'ar') || (lang === 'he');
        var positioning = {};
        var i = 0;
        var c;
        var len = pattern.length;
        for (i = 0; i < len; i++) {
          c = pattern.charAt(i);
          positioning[c] = i;
        }
        if (isRTL) {
          // for RTL locales reverse h and m
          i = positioning.h;
          positioning.h = positioning.m;
          positioning.m = i;
        }
        return positioning;
      }
    };
  }

  return {
    /**
     * getInstance.
     * Returns the singleton instance of OraDateTimeConverter class.
     * @memberof OraDateTimeConverter
     * @return {Object} The singleton OraDateTimeConverter instance.
     */
    getInstance: function () {
      if (!instance) {
        instance = _init();
      }
      return instance;
    }
  };
}());



/**
 * @license
 * This is a forked version of moment-timezone.js
 * The MIT License (MIT)
 * Copyright (c) 2014 Tim Wood
 * https://github.com/moment/moment-timezone/blob/develop/LICENSE
 * @ignore
 */

/*
 DESCRIPTION
 OraTimeZone object implements timeZone support.

 PRIVATE CLASSES
 <list of private classes defined - with one-line descriptions>

 NOTES
 <other useful comments, qualifications, etc.>

 */


/**
 * @ignore
 */
// eslint-disable-next-line no-unused-vars
var OraTimeZone = (function () {
  var _zones = {};
  var instance;

  var _GMT_REGEXP = /^Etc\/GMT/i;
  var _SECOND = 1000;
  var _MINUTE = 60 * _SECOND;
  var _HOUR = 60 * _MINUTE;
  var _MIN_OFFSET = -14 * 60;
  var _MAX_OFFSET = +12 * 60;

  /** **********************************
   Unpacking
   ************************************/

  var __BASE60 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWX';
  var _EPSILON = 0.000001; // Used to fix floating point rounding errors

  function _packBase60Fraction(fraction, precision) {
    var buffer = '.';
    var output = '';

    while (precision > 0) {
      // eslint-disable-next-line no-param-reassign
      precision -= 1;
      // eslint-disable-next-line no-param-reassign
      fraction *= 60;
      var current = Math.floor(fraction + _EPSILON);
      buffer += __BASE60[current];
      // eslint-disable-next-line no-param-reassign
      fraction -= current;

      // Only add buffer to output once we have a non-zero value.
      // This makes '.000' output '', and '.100' output '.1'
      if (current) {
        output += buffer;
        buffer = '';
      }
    }

    return output;
  }

  function _packBase60(number, precision) {
    var output = '';
    var absolute = Math.abs(number);
    var whole = Math.floor(absolute);
    var fraction = _packBase60Fraction(absolute - whole, Math.min(precision, 10));

    while (whole > 0) {
      output = __BASE60[whole % 60] + output;
      whole = Math.floor(whole / 60);
    }

    if (number < 0) {
      output = '-' + output;
    }

    if (output && fraction) {
      return output + fraction;
    }

    if (!fraction && output === '-') {
      return '0';
    }

    return output || fraction || '0';
  }

  /** **********************************
   Unpacking
   ************************************/
  function _charCodeToInt(charCode) {
    if (charCode > 96) {
      return charCode - 87;
    } else if (charCode > 64) {
      return charCode - 29;
    }
    return charCode - 48;
  }

  function _unpackBase60(string) {
    var i = 0;
    var parts = string.split('.');
    var whole = parts[0];
    var fractional = parts[1] || '';
    var multiplier = 1;
    var num;
    var out = 0;
    var sign = 1;

    // handle negative numbers
    if (string.charCodeAt(0) === 45) {
      i = 1;
      sign = -1;
    }
    // handle digits before the decimal
    for (; i < whole.length; i++) {
      num = _charCodeToInt(whole.charCodeAt(i));
      out = (60 * out) + num;
    }
    // handle digits after the decimal
    for (i = 0; i < fractional.length; i++) {
      multiplier /= 60;
      num = _charCodeToInt(fractional.charCodeAt(i));
      out += num * multiplier;
    }
    return out * sign;
  }


  function _arrayToInt(array) {
    for (var i = 0; i < array.length; i++) {
      // eslint-disable-next-line no-param-reassign
      array[i] = _unpackBase60(array[i]);
    }
  }

  function _intToUntil(array, length) {
    for (var i = 0; i < length; i++) {
      // eslint-disable-next-line no-param-reassign
      array[i] = Math.round((array[i - 1] || 0) + (array[i] * _MINUTE)); // minutes to milliseconds
    }

    // eslint-disable-next-line no-param-reassign
    array[length - 1] = Infinity;
  }

  function _mapIndices(source, indices) {
    var out = [];
    for (var i = 0; i < indices.length; i++) {
      out[i] = source[indices[i]];
    }
    return out;
  }

  function _unpack(id, string) {
    var data = string.split('|');
    var offsets = data[1].split(' ');
    var indices = data[2].split('');
    var untils = data[3].split(' ');

    _arrayToInt(offsets);
    _arrayToInt(indices);
    _arrayToInt(untils);
    _intToUntil(untils, indices.length);
    return {
      name: id,
      abbrs: _mapIndices(data[0].split(' '), indices),
      offsets: _mapIndices(offsets, indices),
      untils: untils
    };
  }

  /** **********************************
   Exceptions
   ************************************/
  function _throwInvalidtimeZoneID(str) {
    var msg = 'invalid timeZone ID: ' + str;
    var error = new Error(msg);
    var errorInfo = {
      errorCode: 'invalidTimeZoneID',
      parameterMap: {
        timeZoneID: str
      }
    };
    error.errorInfo = errorInfo;
    throw error;
  }

  function _throwNonExistingTime() {
    var msg = 'The input time does not exist because it falls during the transition to daylight saving time.';
    var error = new Error(msg);
    var errorInfo = {
      errorCode: 'nonExistingTime'
    };
    error.errorInfo = errorInfo;
    throw error;
  }

  function _throwMissingTimeZoneData() {
    var msg = "TimeZone data is missing. Please call require 'ojs/ojtimezonedata' in order to load the TimeZone data.";
    var error = new Error(msg);
    var errorInfo = {
      errorCode: 'missingTimeZoneData'
    };
    error.errorInfo = errorInfo;
    throw error;
  }

  /** **********************************
   Zone object
   ************************************/

  /**
   * @ignore
   * @constructor
   */
  function Zone(name, tzData) {
    var data = tzData.zones[name];
    // Try  if name matches Etc/GMT offset
    if (_GMT_REGEXP.test(name)) {
      var offset = name.replace(_GMT_REGEXP, '');
      var parts = offset.split(':');
      var hours = parseInt(parts[0], 10) * 60;
      var minutes = 0;

      if (isNaN(hours)) {
        return;
      }
      if (parts.length === 2) {
        minutes = parseInt(parts[1], 10);
        if (isNaN(minutes)) {
          return;
        }
      }
      hours += (hours >= 0) ? minutes : -minutes;
      // offset must be between -14 and +12
      if (hours < _MIN_OFFSET || hours > _MAX_OFFSET) {
        return;
      }
      hours = _packBase60(hours, 1);
      var gmtName = name.replace('/etc//i', '').toUpperCase();
      data = gmtName + '|' + hours + '|0|';
    }
    if (data !== undefined) {
      this._set(_unpack(name, data));
    }
  }

  Zone.prototype = {
    _set: function (unpacked) {
      this.name = unpacked.name;
      this.abbrs = unpacked.abbrs;
      this.untils = unpacked.untils;
      this.offsets = unpacked.offsets;
    },
    parse: function (target, dst, ignoreDst, throwException) {
      var offsets = this.offsets;
      var untils = this.untils;
      var max = untils.length - 1;

      for (var i = 0; i < max; i++) {
        var offset = offsets[i];
        var offset1 = offsets[i + 1];
        var until = untils[i];
        var transitionTime = until - (offset * _MINUTE);
        var gapTime = transitionTime + _HOUR;
        var dupTime = transitionTime - _HOUR;
        // Transition to dst:
        // Test if the time falls during the non existing hour when trasition to
        // dst happens. The missing hour is between transitionTime and gapTime.
        // If we are converting from source timezone to target timezone, we do not
        // throw an exception if target timezone falls in non existing window,
        // we just skip one hour, throwException is passed as false in this scenario.
        if (target >= transitionTime && target < gapTime && offset > offset1) {
          if (throwException === true) {
            _throwNonExistingTime();
          } else {
            return (i + 1);
          }
        }
        // Test if the time falls during the duplicate hour when dst ends.
        // The duplicate hour is between dupTime and transitionTime.
        // if dst is set to true, return dst offset.
        if (target >= dupTime && target < transitionTime && offset < offset1) {
          if (dst) {
            return i;
          }
          return (i + 1);
        }
        // Time is outside transtition times.
        if (target < until - (offset * _MINUTE)) {
          if (ignoreDst === false) {
            if (dst) {
              if (offset < offset1) {
                return i;
              }
              return (i + 1);
            }

            if (offset < offset1) {
              return (i + 1);
            }
            return i;
          }
          return i;
        }
      }
      return max;
    },
    // user first need to call pasre to get the index, then pass it to the
    // 2 functions below
    abbr: function (idx) {
      return this.abbrs[idx];
    },
    ofset: function (idx) {
      var len = this.offsets.length;
      if (idx >= 0 && idx < len) {
        return parseInt(this.offsets[idx], 10);
      }
      return parseInt(this.offsets[len - 1], 10);
    },
    len: function () {
      return this.offsets.length;
    }
  };

  /** **********************************
   timeZOne functions
   ************************************/
  function _normalizeName(name) {
    return (name || '').toLowerCase().replace(/\//g, '_');
  }

  function _addZone(name, tzData) {
    var zone = new Zone(name, tzData);
    var zoneName = _normalizeName(zone.name);
    _zones[zoneName] = zone;
  }

  function _getZone(name, tzData) {
    var zoneName = _normalizeName(name);
    if (_zones[zoneName] === undefined) {
      _addZone(name, tzData);
    }
    return _zones[_normalizeName(name)] || null;
  }


  function _init() {
    return {
      getZone: function (name, localeElements) {
        var tzData = localeElements.supplemental.timeZoneData;
        if (tzData === undefined) {
          _throwMissingTimeZoneData();
        }
        var s = _getZone(name, tzData);
        // try the links
        if (!s) {
          var link = tzData.links[name];
          if (link) {
            s = _getZone(link, tzData);
          }
        }
        if (!s) {
          _throwInvalidtimeZoneID(name);
        }
        return s;
      }
    };
  }

  return {
    /**
     * getInstance.
     * Returns the singleton instance of OraTimeZone class.
     * @ignore
     * @memberof OraTimeZone
     * @return {Object} The singleton OraTimeZone instance.
     */
    getInstance: function () {
      if (!instance) {
        instance = _init();
      }
      return instance;
    }
  };
}());

  ;return __ConverterDateTime;
});