/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojlogger', 'ojs/ojconverterutils-i18n', 'ojs/ojlocaledata', 'ojs/ojconverter', 'ojs/ojtranslation', 'ojs/ojconfig', 'ojs/ojcore-base', 'ojs/ojvalidation-error'], function (exports, Logger, __ConverterUtilsI18n, LocaleData, Converter, Translations, Config, oj$1, ojvalidationError) { 'use strict';

  Converter = Converter && Object.prototype.hasOwnProperty.call(Converter, 'default') ? Converter['default'] : Converter;
  oj$1 = oj$1 && Object.prototype.hasOwnProperty.call(oj$1, 'default') ? oj$1['default'] : oj$1;

  /* xeslint-disable no-param-reassign */
  /**
   * @constructor
   *
   * @classdesc OraNumberConverter object implements number parsing and formatting for
   * decimal, currency, percent and perMill types. It supports ECMA-402 options
   * and user defined pattern. The user defined pattern is parsed in order to
   * derive the options that can be specified as ECMA options.
   * There are several ways to use the converter.
   * <p>
   * <ul>
   * <li>Using options defined by the ECMA 402 Specification, these would be the properties style,
   * currency, currencyDisplay, minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits,
   * useGrouping. NOTE: minimumSignificantDigits and maximumSignificantDigits are not supported.</li>
   * <li>Using a custom decimal, currency or percent format pattern. specified using the 'pattern' property</li>
   * <li>Using the decimalFormat option to define a compact pattern, such as "1M" and "1 million".</li>
   * <li>Using the currencyFormat option to define a compact pattern, such as "$1M" and "$1 million".</li>
   * <li>Using the roundingMode and roundDuringParse options to round the number UP, DOWN, CEILING, FLOOR, HALF_UP, HALF_DOWN or HALF_EVEN.</li>
   * </ul>
   * <p>
   *
   * The converter provides leniency when parsing user input value to a number in the following ways:<br/>
   *
   * <ul>
   * <li>Prefix and suffix that do not match the pattern, are removed. E.g., when pattern is
   * "#,##0.00%" (suffix is the % character), a value of "abc-123.45xyz", will be leniently parsed to
   * -123.45</li>
   * <li>When a value includes a symbol but the pattern doesn't require it.  E.g., the options are
   * {pattern: "###", currency: 'USD'}, then values ($123), (123) and -123 will be leniently parsed as
   * -123.</li>
   * </ul>
   * <p>
   * Lenient parse can be disabled by setting the property lenientParse to "none". In which case the user input must
   * be an exact match of the expected pattern and all the leniency described above will be disabled.
   * <p>
   * @property {Object=} options - an object literal used to provide optional information to
   * initialize the converter.
   * @property {string=} options.style - sets the style of number formatting. Allowed values are "decimal"
   * (the default), "currency", "percent" or "unit". When a number is formatted as a decimal, the decimal
   * character is replaced with the most appropriate symbol for the locale. In English this is a
   * decimal point ("."), while in many locales it is a decimal comma (","). If grouping is enabled the
   * locale dependent grouping separator is also used. These symbols are also used for numbers
   * formatted as currency or a percentage, where appropriate.
   * @property {string=} options.currency - specifies the currency that will be used when formatting the
   * number. The value should be a ISO 4217 alphabetic currency code. If the style is set to currency,
   * it's required that the currency property also be specified. This is because there is no default
   * currency associated with the current locale. The user must always specify the currency code
   * to be shown, otherwise an error will be thrown. The current page locale
   * (returned by oj.Config.getLocale()) determines the formatting elements of the number
   * like grouping separator and decimal separator. The currency code tells us which currency to
   * display in current page locale. JET has translations for currency names.
   * <p>
   * As an example if we want to format 1000.35 EURO and the page locale is "en-US",
   * we pass {style:'currency', currency:'EUR', currencyDisplay:'symbol'} and we will get "€1,000.35"
   * If the page locale is "fr-FR", with the same options, we will get: "1 000,35 €"
   * </p>
   * @property {string=} options.unit - Mandatory when style is "unit". Allowed values:
   * "byte" or "bit". It is used for formatting only. It can not be used for parsing.
   * <p>
   * It is used to format digital units like 10Mb for bit unit or 10MB for byte unit.
   * There is no need to specify the scale of the unit. We automatically detect it.
   * For example 1024 is formatted as 1KB and 1048576 as 1MB.
   * The user can also specify 'minimumFractionDigits' and  'maximumFractionDigits' to be displayed,
   * otherwise we use the locale's default max and min fraction digits.
   * </p>
   * @property {string=} options.currencyDisplay - if the number is using currency formatting, specifies
   * if the currency will be displayed using its "code" (as an ISO 4217 alphabetic currency code),
   * "symbol" (a localized currency symbol (e.g. $ for US dollars, £ for Great British pounds, and so
   * on), or "name" (a localized currency name. Allowed values are "code", "symbol" and "name".
   * The default is "symbol".
   * @property {string=} options.decimalFormat -
   * specifies the decimal format length to use when style is set to "decimal".
   * Allowed values are : "standard"(default), "short" and "long". "standard" is equivalent to not
   * specifying the 'decimalFormat' attribute, in that case the locale's default decimal pattern
   * is used for formatting.
   * <p>
   * The user can also specify 'minimumFractionDigits' and  'maximumFractionDigits' to display.
   * When not present we use the locale's default max and min fraction digits.
   * </p>
   * <p>
   * There is no need to specify the scale; we automatically detect greatest scale that is less or
   * equal than the input number. For example  1000000 is formatted as "1M" or "1 million" and
   * 1234 is formatted, with zero fractional digits, as "1K" or " 1 thousand" for
   * short and long formats respectively. The pattern for the short and long number is locale dependent
   * and uses plural rules for the particular locale.
   * </p>
   * <p>
   * NOTE: Currently this option formats a value (e.g., 2000 -> 2K), but it does not parse a value
   * (e.g., 2K -> 2000), so it can only be used
   * in a readOnly EditableValue because readOnly EditableValue components do not call
   * the converter's parse function.
   * </p>
   * @property {string=} options.currencyFormat -
   * specifies the currency format length to use when style is set to "currency".
   * Allowed values are : "standard"(default), "short" and "long". 'standard' is equivalent to not
   * specifying the 'currencyFormat' attribute, in that case the locale's default currency pattern
   * is used for formatting.
   * Similar to decimalFormat, currencyFormat can only be used for formatting. It can not be used for parsing.
   * <p>
   * The user can also specify 'minimumFractionDigits' and  'maximumFractionDigits' to display.
   * When not present we use the locale's default max and min fraction digits.
   * </p>
   * <p>
   * There is no need to specify the scale; we automatically detect greatest scale that is less or
   * equal than the input number. For example  1000000 is formatted as "$1M" or "1 million dollar" and
   * 1000 is formatted as "$1K" or " 1 thousand dollar" for short and long formats respectively.
   * The pattern for the short and long number is locale dependent and uses plural rules for the particular locale.
   * </p>
   * @property {number=} options.minimumIntegerDigits - sets the minimum number of digits before the
   * decimal place (known as integer digits). The number is padded with leading zeros if it would not
   * otherwise have enough digits. The value must be an integer between 1 and 21.
   * @property {number=} options.minimumFractionDigits - similar to 'minimumIntegerDigits', except it
   * deals with the digits after the decimal place (fractional digits). It must be an integer between
   * 0 and 20. The fractional digits will be padded with trailing zeros if they are less than the minimum.
   * @property {number=} options.maximumFractionDigits - follows the same rules as 'minimumFractionDigits',
   * but sets the maximum number of fractional digits that are allowed. The value will be rounded if
   * there are more digits than the maximum specified.
   * @property {boolean=} options.useGrouping - when the value is truthy, the locale dependent grouping
   * separator is used when formatting the number. This is often known as the thousands separator,
   * although it is up to the locale where it is placed. The 'useGrouping' is set to true by default.
   * @property {string=} options.pattern an optional localized pattern, where the characters used in
   * pattern are as defined in the Unicode CLDR for numbers, percent or currency formats. When present
   * this will override the other "options". <p>
   *
   * &nbsp;&nbsp;- When the pattern represents a currency style the 'currency' property is required to
   * be set, as not setting this will throw an error. The 'currencyDisplay' is optional. <br/>Example:
   * {pattern: '¤#,##0', currency: 'USD'}. <p>
   *
   * &nbsp;&nbsp;- It's not mandatory for the pattern to have the special character '¤' (currency sign)
   * be present. When not present, values are treated as a currency value, but are not formatted to
   * show the currency symbol. <br/>Example: {pattern: '#,##0', currency: 'USD'} <p>
   *
   * &nbsp;&nbsp;- When the pattern represents a percent style, the percent special character ('%') needs to be
   * explicitly specified in the pattern, e.g., {pattern: "#,##0%"}. If the pattern does not contain
   * the percent character it's treated as a decimal pattern, unless the style is set to percent,
   * in which case the value is treated as a percent value, but not formatted to show the percent symbol.
   * <br/>Example: {style: 'percent', pattern: "#,##0"}. <p>
   *
   * &nbsp;&nbsp;- A decimal pattern or exponent pattern is specified in the pattern using the CLDR
   * conventions. <br/>Example: {pattern: "#,##0.00"} or {pattern: "0.##E0"}. <p>
   *
   * NOTE: 'pattern' is provided for backwards compatibility with existing apps that may want the
   * convenience of specifying an explicit format mask. Setting a pattern will override the default
   * locale specific format. <br/>
   *
   * @property {string=} options.roundingMode - specifies the rounding behavior.
   * We support the options: UP, DOWN, CEILING, FLOOR, HALF_UP, HALF_DOWN and HALF_EVEN.
   * The rounding modes can be used in conjunction with decimal (including short format), currency and percent styles.
   * We follow the Java.Math.RoundingMode behavior : https://docs.oracle.com/javase/7/docs/api/java/math/RoundingMode.html
   *
   * @property {boolean=} options.roundDuringParse - Specifies whether or not to round during
   * parse. Defaults to false; the number converter rounds during format but not during parse.
   *
   * @property {Object=} options.separators - An object with 2 fields: 'decimal' and 'group'.
   * It allows the user to override the locale's default decimal and grouping separators. It is accepted for both
   * format and parse methods.
   * <br/>
   *
   * @property {string=} options.lenientParse - The lenientParse property can be used to enable or disable leninet parsing.
   *  Allowed values: "full" (default), "none".
   * <p style='padding-left: 5px;'>
   * By default the lenient parse is enabled and the leniency rules descibed above will be used. When lenientParse is
   * set to "none" the lenient parse is disabled and the user input must match the expected input otherwise an exception will
   * be thrown.<br/><br/>
   *
   * @example <caption>Create a number converter for currencies</caption>
   * var converter = OraNumberConveter.getInstance();
   * var options = {style: "currency", currency: "USD", minimumIntegerDigits: 2};
   * var localeElements;
   * var nb = 9;
   * converter.format(nb, localeElements, options); --> "$09.00" if page locale is 'en-US'
   * converter.format(nb, localeElements, options); --> "09,00 $US" if page locale is 'fr-FR'<br/>
   *
   * TODO @example <caption>Options for percent values using a custom (CLDR) pattern</caption>
   * var options = {pattern: '#,##0%'};
   * converter = converterFactory.createConverter(options);<br/>
   *
   * @example <caption>To parse a value as percent but format it without displaying the percent character</caption>
   * var options = {style: 'percent', pattern: '#,##0'};<br/>
   *
   * @example <caption>To parse a value as currency using a custom (CLDR) pattern</caption>
   * var options = {pattern: '¤#,##0', currency: 'USD'};
   *
   * @example <caption>To format a value as digital bit unit</caption>
   * var options = {style:'unit', unit:'bit'};
   * var nb = 1024;
   * converter.format(nb, localeElements, options);--> 1Kb<br/>
   *
   * @example <caption>To format a value as digital byte unit</caption>
   * var options = {style:'unit', unit:'byte'};
   * var nb = 1024;
   * converter.format(nb, localeElements, options);--> 1KB<br/>
   *
   * @example <caption>The following decimalFormat examples are in en locale.
   * To format a value as short (default for fraction digits is based on the locale)</caption>
   * var options = {style:'decimal', decimalFormat:'short'};
   * var nb = 12345
   * converter.format(nb, localeElements, options);--> 12.354K<br/>
   *
   * @example <caption>To format a value as long (default for fraction digits is based on the locale):</caption>
   * var options = {style:'decimal', decimalFormat:'long'};
   * var nb = 12345;
   * converter.format(nb, localeElements, options);--> 12.345 thousand<br/>
   *
   * @example <caption>To format a value as short with minimum fraction digits:</caption>
   * options = { style:'decimal', decimalFormat:'short', minimumFractionDigits:4};
   * var nb = 1234;
   * converter.format(nb, localeElements, options);--> 1.2340K<br/>
   *
   * @example <caption>To format a value as short with maximum fraction digits:</caption>
   * options = { style:'decimal', decimalFormat:'short', maximumFractionDigits:0};
   *  var nb = 1234;
   * converter.format(nb, localeElements, options);--> 12K<br/>
   *
   * @example <caption>To format a value as long with minimum and maximum fraction digits:</caption>
   * options = { style:'decimal', decimalFormat:'long',
   * minimumFractionDigits:2, maximumFractionDigits:4};
   * var nb = 12000;
   * converter.format(nb, localeElements, options);--> 12.00 thousand<br/>
   *
   * @example <caption>To format a value as short with minimum and maximum fraction digits:</caption>
   * options = { style:'decimal', decimalFormat:'long',
   * minimumFractionDigits:2, maximumFractionDigits:4};
   * var nb = 12345678;
   * converter.format(nb, localeElements, options);--> 12.345 million<br/>
   *
   * @example <caption>decimal style default is standard:</caption>
   * options = { style:'decimal', decimalFormat:'standard'};
   * var nb = 12345;
   * converter.format(nb, localeElements, options);--> 12,345<br/>
   *
   * @example <caption>decimal round UP:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'UP'};
   * var nb = 0.221;
   * converter.format(nb, localeElements, options);--> 0.23
   * var str = "0.221";
   * converter.parse(str, localeElements, options);-->0.221 //doesn't round during parse by default<br/>
   *
   * @example <caption>decimal round DOWN:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'DOWN'};
   * var nb = 0.229;
   * converter.format(nb, localeElements, options);--> 0.22
   * var str = "0.229";
   * converter.parse(str, localeElements, options);-->0.229 //doesn't round during parse by default<br/>
   *
   * @example <caption>decimal round CEILING:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'CEILING'};
   * var nb = 0.221;
   * converter.format(nb, localeElements, options);--> 0.23
   * var str = "0.221";
   * converter.parse(str, localeElements, options);-->0.221 //doesn't round during parse by default<br/>
   *
   * @example <caption>decimal round FLOOR:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'FLOOR'};
   * var nb = 0.228;
   * converter.format(nb, localeElements, options);--> 0.22
   * var str = "0.228";
   * converter.parse(str, localeElements, options);-->0.228 //doesn't round during parse by default<br/>
   *
   * @example <caption>decimal round HALF_DOWN:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'HALF_DOWN'};
   * var nb = 0.225;
   * converter.format(nb, localeElements, options);--> 0.22
   * var str = "0.225";
   * converter.parse(str, localeElements, options);-->0.225 //doesn't round during parse by default<br/>
   *
   * @example <caption>decimal round HALF_UP:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'HALF_UP'};
   * var nb = 0.225;
   * converter.format(nb, localeElements, options);--> 0.23
   * var str = "0.225";
   * converter.parse(str, localeElements, options);--> 0.225 //doesn't round during parse by default<br/>
   *
   * @example <caption>decimal round HALF_EVEN:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'HALF_EVEN'};
   * converter.format(0.225, localeElements, options);--> 0.22
   * converter.format(0.235, localeElements, options);--> 0.24
   * converter.parse("0.225", localeElements, options);--> 0.225 //doesn't round during parse by default
   * converter.parse("0.235", localeElements, options);--> 0.235 //doesn't round during parse by default<br/>
   *
   * @example <caption>decimal round UP and roundDuringParse:</caption>
   * options = { style:'decimal', maximumFractionDigits:2,
   *             roundingMode:'UP', roundDuringParse: true};
   * var nb = 0.221;
   * converter.format(nb, localeElements, options);--> 0.23
   * var str = "0.221";
   * converter.parse(str, localeElements, options);-->0.23<br/>
   *
   * @example <caption>decimal round DOWN and roundDuringParse:</caption>
   * options = { style:'decimal', maximumFractionDigits:2,
   *             roundingMode:'DOWN', roundDuringParse: true};
   * var nb = 0.229;
   * converter.format(nb, localeElements, options);--> 0.22
   * var str = "0.229";
   * converter.parse(str, localeElements, options);-->0.22<br/>
   *
   * @example <caption>decimal round CEILING and roundDuringParse:</caption>
   * options = { style:'decimal', maximumFractionDigits:2,
   *             roundingMode:'CEILING', roundDuringParse: true};
   * var nb = 0.221;
   * converter.format(nb, localeElements, options);--> 0.23
   * var str = "0.221";
   * converter.parse(str, localeElements, options);-->0.23<br/>
   *
   * @example <caption>decimal round FLOOR and roundDuringParse:</caption>
   * options = { style:'decimal', maximumFractionDigits:2,
   *             roundingMode:'FLOOR', roundDuringParse: true};
   * var nb = 0.228;
   * converter.format(nb, localeElements, options);--> 0.22
   * var str = "0.228";
   * converter.parse(str, localeElements, options);-->0.22<br/>
   *
   * @example <caption>decimal round HALF_DOWN and roundDuringParse:</caption>
   * options = { style:'decimal', maximumFractionDigits:2,
   *             roundingMode:'HALF_DOWN', roundDuringParse: true};
   * var nb = 0.225;
   * converter.format(nb, localeElements, options);--> 0.22
   * var str = "0.225";
   * converter.parse(str, localeElements, options);-->0.22<br/>
   *
   * @example <caption>decimal round HALF_UP and roundDuringParse:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2,
   *             roundingMode:'HALF_UP', roundDuringParse: true};
   * var nb = 0.225;
   * converter.format(nb, localeElements, options);--> 0.23
   * var str = "0.225";
   * converter.parse(str, localeElements, options);--> 0.23<br/>
   *
   * @example <caption>decimal round HALF_EVEN and roundDuringParse:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2,
   *             roundingMode:'HALF_EVEN', roundDuringParse: true};
   * converter.format(0.225, localeElements, options);--> 0.22
   * converter.format(0.235, localeElements, options);--> 0.24
   * converter.parse("0.225", localeElements, options);--> 0.22
   * converter.parse("0.235", localeElements, options);--> 0.24<br/>
   *
   * @example <caption>Override locale's decimal and grouping separators:</caption>
   * in en-US locale, the decimal separator is '.' and grouping separator is ','. In this example we will swap them.
   * options = { style:'decimal', separators: {decimal: ',',  group: '.'}};
   * var nb = 1234567.89;
   * converter.format(nb, localeElements, options);--> 1.234.567,89
   * converter.parse("1.234.567,89", localeElements, options);--> 1234567.89
   * <br/>
   *
   * @example <caption>Disable lenient parse:</caption>
   * options = { style:'decimal',  lenientParse: 'none'};
   * converter.parse("abc-123.45xyz", localeElements, options);--> Error: Unparsable number abc-123.45xyz The expected number pattern is #,##0.###
   * <br/>
   *
   * @name OraNumberConverter
   * @ignore
   */

  /**
   * @ignore
   */

  // eslint-disable-next-line no-unused-vars
  const OraNumberConverter = (function () {
    var instance;

    var _REGEX_INFINITY = /^[+-]?infinity$/i;
    var _REGEX_PARSE_FLOAT = /^[+-]?\d*\.?\d*(e[+-]?\d+)?$/;
    var _LENIENT_REGEX_PARSE_FLOAT = /([^+-.0-9]*)([+-]?\d*\.?\d*(E[+-]?\d+)?).*$/;
    // eslint-disable-next-line no-useless-escape
    var _ESCAPE_REGEXP = /([\^$.*+?|\[\](){}])/g;
    var _REGEX_TRIM_ZEROS = /(^0\.0*)([^0].*$)/;
    var _REGEX_ONLY_ZEROS = /^0+$/;

    var _decimalTypeValues = {
      trillion: [100000000000000, 10000000000000, 1000000000000],
      billion: [100000000000, 10000000000, 1000000000],
      million: [100000000, 10000000, 1000000],
      thousand: [100000, 10000, 1000]
    };

    var _decimalTypeValuesMap = {
      trillion: 1000000000000,
      billion: 1000000000,
      million: 1000000,
      thousand: 1000
    };

    // maps roundingMode attributes to Math rounding modes.
    var _roundingModeMap = {
      HALF_UP: 'ceil',
      CEILING: 'ceil',
      UP: 'ceil',
      HALF_DOWN: 'floor',
      FLOOR: 'floor',
      DOWN: 'floor',
      DEFAULT: 'round'
    };

    var _DIGITAL_KILO = 1024;
    var _DIGITAL_MEGA = 1024 * 1024;
    var _DIGITAL_GIGA = 1024 * 1024 * 1024;
    var _DIGITAL_TERA = 1024 * 1024 * 1024 * 1024;

    // prepend or append count zeros to a string.
    function _zeroPad(str, count, left) {
      var l;
      for (l = str.length; l < count; l += 1) {
        // eslint-disable-next-line no-param-reassign
        str = left ? '0' + str : str + '0';
      }
      return str;
    }

    function _throwNumberOutOfRange(value, minimum, maximum, property) {
      var msg =
        value +
        ' is out of range.  Enter a value between ' +
        minimum +
        ' and ' +
        maximum +
        ' for ' +
        property;
      var rangeError = new RangeError(msg);
      var errorInfo = {
        errorCode: 'numberOptionOutOfRange',
        parameterMap: {
          value: value,
          minValue: minimum,
          maxValue: maximum,
          propertyName: property
        }
      };
      rangeError.errorInfo = errorInfo;
      throw rangeError;
    }

    function _getNumberOption(options, property, minimum, maximum, fallback) {
      var value = options[property];
      if (value !== undefined) {
        value = Number(value);
        if (isNaN(value) || value < minimum || value > maximum) {
          _throwNumberOutOfRange(value, minimum, maximum, property);
        }
        return Math.floor(value);
      }

      return fallback;
    }

    // get the numbering system key from the locale's unicode extension.
    // Verify that the locale data has a numbers entry for it, if not return latn as default.
    function _getNumberingSystemKey(localeElements, locale) {
      if (locale === undefined) {
        return 'latn';
      }
      var numberingSystemKey = _getNumberingExtension(locale);
      var symbols = 'symbols-numberSystem-' + numberingSystemKey;
      if (localeElements.numbers[symbols] === undefined) {
        numberingSystemKey = 'latn';
      }
      return numberingSystemKey;
    }

    // return the language part
    function _getBCP47Lang(tag) {
      var arr = tag.split('-');
      return arr[0];
    }

    // get the unicode numbering system extension.
    function _getNumberingExtension(locale) {
      var _locale = locale || 'en-US';
      var idx = _locale.indexOf('-u-nu-');
      var numbering = 'latn';
      if (idx !== -1) {
        numbering = _locale.substr(idx + 6, 4);
      }
      return numbering;
    }

    /* return the properties for a number such as minimum and maximum fraction
     *digits, decimal separator, grouping separator.
     *-If no user defined pattern is provided, get the pattern from the locale
     *  data and parse it to extrcat the number properties. If ecma options are
     *  present, override the corresponding default properties.
     *-If a user defined pattern is provided, parse it and extrcat the number
     *  properties. Ignore ecma ptions if present.
     */

    function _getNumberSettings(localeElements, _numberSettings, options, locale) {
      var numberSettings = _numberSettings;
      var pat;
      var localeElementsMainNode =
        __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
      var numberingSystemKey = _getNumberingSystemKey(localeElementsMainNode, locale);
      numberSettings.numberingSystemKey = numberingSystemKey;
      numberSettings.numberingSystem = 'symbols-numberSystem-' + numberingSystemKey;
      var lenient = options.lenientParse;
      numberSettings.lenientParse = lenient || 'full';
      numberSettings.style = options.style;
      // pattern passed in options
      if (options.pattern !== undefined && options.pattern.length > 0) {
        pat = options.pattern;
      } else {
        var key;
        switch (numberSettings.style) {
          case 'decimal':
            key = 'decimalFormats-numberSystem-';
            break;
          case 'currency':
            key = 'currencyFormats-numberSystem-';
            break;
          case 'percent':
            key = 'percentFormats-numberSystem-';
            break;
          default:
            key = 'decimalFormats-numberSystem-';
            break;
        }
        key += numberSettings.numberingSystemKey;
        pat = localeElementsMainNode.numbers[key].standard;
      }
      // check if decimalFormat is set
      var decFormatLength = options.decimalFormat;
      // if not, check for currencyFormat
      if (decFormatLength === undefined) {
        decFormatLength = options.currencyFormat;
      }
      // if either decimalFormat or currencyFormat is set, save it in number settings
      if (
        decFormatLength !== undefined &&
        (numberSettings.style === 'decimal' || numberSettings.style === 'currency')
      ) {
        numberSettings.shortDecimalFormat =
          localeElementsMainNode.numbers['decimalFormats-numberSystem-latn'][
            decFormatLength
          ].decimalFormat;
      }
      var decimalSeparator = localeElementsMainNode.numbers[numberSettings.numberingSystem].decimal;
      var groupSeparator = localeElementsMainNode.numbers[numberSettings.numberingSystem].group;
      var separators = options.separators;
      if (separators !== undefined) {
        numberSettings.separators = separators;
        var dec = separators.decimal;
        var grp = separators.group;
        if (dec !== undefined && dec !== '') {
          decimalSeparator = separators.decimal;
        }
        if (grp !== undefined) {
          groupSeparator = separators.group;
        }
      }
      var mainNodeKey =
        __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
      var lang = _getBCP47Lang(mainNodeKey);
      numberSettings.lang = lang;
      numberSettings.pat = pat;
      numberSettings.minusSign =
        localeElementsMainNode.numbers[numberSettings.numberingSystem].minusSign;
      numberSettings.decimalSeparator = decimalSeparator;
      numberSettings.exponential =
        localeElementsMainNode.numbers[numberSettings.numberingSystem].exponential;
      numberSettings.groupingSeparator = groupSeparator;
      numberSettings.currencyDisplay = options.currencyDisplay;
      if (options.currency !== undefined) {
        numberSettings.currencyCode = options.currency.toUpperCase();
      }
      if (options.unit !== undefined) {
        numberSettings.unit = options.unit.toLowerCase();
      }
      _applyPatternImpl(options, pat, localeElementsMainNode, numberSettings);
      if (options.pattern === undefined) {
        numberSettings.minimumIntegerDigits = _getNumberOption(
          options,
          'minimumIntegerDigits',
          1,
          21,
          numberSettings.minimumIntegerDigits
        );
        if (options.maximumFractionDigits !== undefined) {
          numberSettings.maximumFractionDigits = _getNumberOption(
            options,
            'maximumFractionDigits',
            0,
            20,
            numberSettings.maximumFractionDigits
          );
          if (numberSettings.maximumFractionDigits < numberSettings.minimumFractionDigits) {
            numberSettings.minimumFractionDigits = numberSettings.maximumFractionDigits;
          }
        }
        if (options.minimumFractionDigits !== undefined) {
          numberSettings.minimumFractionDigits = _getNumberOption(
            options,
            'minimumFractionDigits',
            0,
            20,
            numberSettings.minimumFractionDigits
          );
        }
        if (numberSettings.maximumFractionDigits < numberSettings.minimumFractionDigits) {
          numberSettings.maximumFractionDigits = numberSettings.minimumFractionDigits;
          Logger.info(
            'maximumFractionDigits is less than minimumFractionDigits, so maximumFractionDigits will be set to minimumFractionDigits'
          );
        }
        // set currency fractions based on currencyData in root bundle. Do not apply
        // it for short and long currencyFormats
        if (
          numberSettings.style === 'currency' &&
          options.minimumFractionDigits === undefined &&
          (decFormatLength === undefined || decFormatLength === 'standard')
        ) {
          var currencyFractions = localeElements.supplemental.currencyData.fractions;
          var specialCurrency = currencyFractions[options.currency];
          if (specialCurrency !== undefined) {
            var fractionDigits = parseInt(specialCurrency._digits, 10);
            numberSettings.minimumFractionDigits = fractionDigits;
            numberSettings.maximumFractionDigits = fractionDigits;
          }
        }
      }
    }

    function _throwMissingCurrency(prop) {
      var typeError = new TypeError(
        'The property "currency" is required when' +
          ' the property "' +
          prop +
          '" is "currency". An accepted value is a ' +
          'three-letter ISO 4217 currency code.'
      );
      var errorInfo = {
        errorCode: 'optionTypesMismatch',
        parameterMap: {
          propertyName: prop, // the driving property
          propertyValue: 'currency', // the driving property's value
          requiredPropertyName: 'currency', // the required property name
          requiredPropertyValueValid: 'a three-letter ISO 4217 currency code'
        }
      };
      typeError.errorInfo = errorInfo;
      throw typeError;
    }

    function _throwMissingUnit(prop) {
      var typeError = new TypeError(
        'The property "unit" is required when' +
          ' the property "' +
          prop +
          '" is "unit". An accepted value is "byte" or "bit".'
      );
      var errorInfo = {
        errorCode: 'optionTypesMismatch',
        parameterMap: {
          propertyName: prop, // the driving property
          propertyValue: 'unit', // the driving property's value
          requiredPropertyName: 'unit', // the required property name
          requiredPropertyValueValid: 'byte or bit'
        }
      };
      typeError.errorInfo = errorInfo;
      throw typeError;
    }

    function _throwUnsupportedParseOption(val) {
      var code = 'unsupportedParseFormat';
      var msg = 'long and short ' + val + ' are not supported for parsing';
      var error = new Error(msg);
      var errorInfo = {
        errorCode: code,
        parameterMap: {
          shortFormats: val
        }
      };
      error.errorInfo = errorInfo;
      throw error;
    }

    // If the user specifies currency as a style, currency option must also be
    // provided. parse does not support short and long decimalFormat.
    function _validateNumberOptions(options, caller) {
      var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(options, caller);
      var s = getOption(
        'style',
        'string',
        ['currency', 'decimal', 'percent', 'unit', 'perMill'],
        'decimal'
      );
      if (s === 'decimal' || s === 'currency') {
        var fmt = s === 'decimal' ? 'decimalFormat' : 'currencyFormat';
        s = getOption(fmt, 'string', ['standard', 'short', 'long']);
        if (caller === 'OraNumberConverter.parse' && s !== undefined && s !== 'standard') {
          _throwUnsupportedParseOption(fmt);
        }
      }
      var c = getOption('currency', 'string');
      if (s === 'currency' && c === undefined) {
        _throwMissingCurrency('style');
      }

      c = getOption('unit', 'string');
      if (s === 'unit' && c === undefined) {
        _throwMissingUnit('style');
      }
      s = getOption('roundingMode', 'string', [
        'UP',
        'DOWN',
        'FLOOR',
        'CEILING',
        'HALF_UP',
        'HALF_DOWN',
        'HALF_EVEN'
      ]);
    }

    // _toDigitalByte does compact formatting like 300MB, 300Mb
    function _toDigitalByte(number, options, numberSettings, localeElements) {
      var scale;
      var count;
      var absVal = Math.abs(number);
      if (absVal >= _DIGITAL_TERA) {
        scale = 'digital-tera';
        count = absVal / _DIGITAL_TERA;
      } else if (absVal >= _DIGITAL_GIGA) {
        scale = 'digital-giga';
        count = absVal / _DIGITAL_GIGA;
      } else if (absVal >= _DIGITAL_MEGA) {
        scale = 'digital-mega';
        count = absVal / _DIGITAL_MEGA;
      } else if (absVal >= _DIGITAL_KILO) {
        scale = 'digital-kilo';
        count = absVal / _DIGITAL_KILO;
      } else {
        scale = 'digital-';
        count = absVal;
      }
      // Find the corresponding entry in resource budle under units section
      // scale -> 'digital-kilo-bit' or 'digital-kilo-byte'
      scale += numberSettings.unit;
      var lang = numberSettings.lang;
      // get plural rule: one, many, etc..
      var plural = new Intl.PluralRules(lang).select(count);
      // plural -> 'unitPattern-count-one' or 'unitPattern-count-many'
      plural = 'unitPattern-count-' + plural;
      // format the number
      if (number < 0) {
        count = -count;
      }
      var fmt = _toRawFixed(count, options, numberSettings);
      // format the number based on plural rule: "{0} Gb", etc..
      var entry = localeElements.units.narrow[scale][plural];
      fmt = __ConverterUtilsI18n.OraI18nUtils.formatString(entry, [fmt]);
      return fmt;
    }

    // _toCompactNumber does compact formatting like 3000->3K for short
    // and "3 thousand" for long
    function _toCompactNumber(number, options, numberSettings) {
      function _getZerosInPattern(s) {
        var i = 0;
        var n = 0;
        var idx = 0;
        var prefix = '';
        if (s[0] !== '0') {
          while (s[i] !== '0' && i < s.length) {
            i += 1;
          }
          prefix = s.substr(0, i);
          idx = i;
        }
        for (i = idx; i < s.length; i++) {
          if (s[i] === '0') {
            n += 1;
          } else {
            break;
          }
        }
        return [prefix, n];
      }

      /* To format a number N, the greatest type less than or equal to N is used, with
       * the appropriate plural category. N is divided by the type, after removing the
       * number of zeros in the pattern, less 1.
       * APIs supporting this format should provide control over the number of
       * significant or fraction digits.
       *Thus N=12345 matches <pattern type="10000" count="other">00 K</pattern>.
       *N is divided by 1000 (obtained from 10000 after removing "00" and restoring
       *one "0". The result is formatted according to the normal decimal pattern.
       *With no fractional digits, that yields "12 K".
       */
      function _matchTypeValue(n) {
        var decimalTypeKeys = Object.keys(_decimalTypeValues);
        for (var i = 0; i < decimalTypeKeys.length; i++) {
          var decimalTypeKey = decimalTypeKeys[i];
          var len = _decimalTypeValues[decimalTypeKey].length;
          for (var j = 0; j < len; j++) {
            if (_decimalTypeValues[decimalTypeKey][j] <= n) {
              return [decimalTypeKey, _decimalTypeValues[decimalTypeKey][j]];
            }
          }
        }
        return [n, null];
      }
      var absVal = Math.abs(number);
      var typeVal = _matchTypeValue(absVal);
      var prefix = '';
      var decimalFormatType;
      var tokens;
      var zeros;
      if (typeVal[1] !== null) {
        var lang = numberSettings.lang;
        var plural = new Intl.PluralRules(lang).select(
          Math.floor(absVal / _decimalTypeValuesMap[typeVal[0]])
        );
        decimalFormatType = '' + typeVal[1] + '-count-' + plural;
        decimalFormatType = numberSettings.shortDecimalFormat[decimalFormatType];
        if (decimalFormatType === undefined) {
          plural = 'other';
          decimalFormatType = '' + typeVal[1] + '-count-' + plural;
          decimalFormatType = numberSettings.shortDecimalFormat[decimalFormatType];
        }
        tokens = _getZerosInPattern(decimalFormatType);
        zeros = tokens[1];
        prefix = tokens[0];
        if (zeros < decimalFormatType.length) {
          var i = 1 * Math.pow(10, zeros);
          i = (typeVal[1] / i) * 10;
          // eslint-disable-next-line no-param-reassign
          absVal /= i;
        }
      }
      var s = '';
      var fmt;
      if (decimalFormatType !== undefined) {
        s = decimalFormatType.substr(zeros + tokens[0].length);
      }
      if (number < 0) {
        absVal = -absVal;
      }
      fmt = _toRawFixed(absVal, options, numberSettings);
      var regExp = /'\.'/g;
      s = s.replace(regExp, '.');
      s = prefix + fmt + s;
      return s;
    }

    // _toExponentialPrecision does the formatting when the pattern contain E,
    // for example #.#E0
    function _toExponentialPrecision(number, numberSettings) {
      var numStr0 = number + '';
      var trimExp = 0;
      var split = numStr0.split(/e/i);
      var numStr = split[0];
      _REGEX_TRIM_ZEROS.lastIndex = 0;
      var match = _REGEX_TRIM_ZEROS.exec(numStr);
      if (match !== null) {
        trimExp = match[1].length - 1;
        numStr = match[2];
      } else {
        numStr = numStr.replace('.', '');
      }
      var exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
      var numStr1 = parseInt(numStr, 10);
      var len = numberSettings.minimumIntegerDigits + numberSettings.maximumFractionDigits;
      if (numStr.length > len) {
        len -= numStr.length;
        var factor = Math.pow(10, len);
        numStr1 = Math.round(numStr1 * factor);
      }
      var padLen = numberSettings.minimumIntegerDigits + numberSettings.minimumFractionDigits;
      numStr1 += '';
      numStr1 = _zeroPad(numStr1, padLen, false);
      if (numStr0.indexOf('.') !== -1) {
        exponent -= numberSettings.minimumIntegerDigits - numStr0.indexOf('.') + trimExp;
      } else {
        exponent -= padLen - numStr.length - numberSettings.minimumFractionDigits;
      }
      var posExp = Math.abs(exponent);
      posExp = _zeroPad(posExp + '', numberSettings.minExponentDigits, true);
      if (exponent < 0) {
        posExp = numberSettings.minusSign + posExp;
      }
      var str1 = numStr1.slice(0, numberSettings.minimumIntegerDigits);
      var str2 = numStr1.slice(numberSettings.minimumIntegerDigits);
      if (str2.length > 0) {
        str1 +=
          numberSettings.decimalSeparator +
          numStr1.slice(numberSettings.minimumIntegerDigits) +
          numberSettings.exponential +
          posExp;
      } else {
        str1 += numberSettings.exponential + posExp;
      }
      return str1;
    }

    // _toRawFixed does the formatting based on
    // minimumFractionDigits and maximumFractionDigits.
    function _toRawFixed(number, options, numberSettings) {
      var curSize = numberSettings.groupingSize;
      var curSize0 = numberSettings.groupingSize0;
      var decimalSeparator = numberSettings.decimalSeparator;
      // First round the number based on maximumFractionDigits
      var numberString = number + '';
      var split = numberString.split(/e/i);
      var exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
      numberString = split[0];
      split = numberString.split('.');
      var right = split.length > 1 ? split[1] : '';
      var precision = Math.min(numberSettings.maximumFractionDigits, right.length - exponent);
      // round the number only if it has decimal points
      if (split.length > 1 && right.length > exponent) {
        var mode = options.roundingMode || 'DEFAULT';
        // eslint-disable-next-line no-param-reassign
        number = _roundNumber(number, precision, mode);
      }
      // split the number into integer, fraction and exponent parts.
      numberString = Math.abs(number) + '';
      split = numberString.split(/e/i);
      exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
      numberString = split[0];
      split = numberString.split('.');
      numberString = split[0];
      right = split.length > 1 ? split[1] : '';
      // pad zeros based on the exponent value and minimumFractionDigits
      if (exponent > 0) {
        right = _zeroPad(right, exponent, false);
        numberString += right.slice(0, exponent);
        right = right.substr(exponent);
      } else if (exponent < 0) {
        exponent = -exponent;
        numberString = _zeroPad(numberString, exponent + 1, true);
        right = numberString.slice(-exponent, numberString.length) + right;
        numberString = numberString.slice(0, -exponent);
      }
      if (precision > 0 && right.length > 0) {
        right =
          right.length > precision ? right.slice(0, precision) : _zeroPad(right, precision, false);
        // if right is only zeros, truncate it to minimumFractionDigits
        if (_REGEX_ONLY_ZEROS.test(right) === true) {
          right = right.slice(0, numberSettings.minimumFractionDigits);
        }
        right = decimalSeparator + right;
      } else if (numberSettings.minimumFractionDigits > 0) {
        right = decimalSeparator;
      } else {
        right = '';
      }
      // trim trailing zeros from right
      right = __ConverterUtilsI18n.OraI18nUtils.trimRightZeros(right);
      // insert grouping separator in the integer part based on groupingSize
      var padLen = decimalSeparator.length + numberSettings.minimumFractionDigits;
      right = _zeroPad(right, padLen, false);
      var sep = numberSettings.groupingSeparator;
      var ret = '';
      if (options.useGrouping === false && options.pattern === undefined) {
        sep = '';
      }
      numberString = _zeroPad(numberString, numberSettings.minimumIntegerDigits, true);
      var stringIndex = numberString.length - 1;
      right = right.length > 1 ? right : '';
      var rets;
      while (stringIndex >= 0) {
        if (curSize === 0 || curSize > stringIndex) {
          rets = numberString.slice(0, stringIndex + 1) + (ret.length ? sep + ret + right : right);
          return rets;
        }
        ret =
          numberString.slice(stringIndex - curSize + 1, stringIndex + 1) +
          (ret.length ? sep + ret : '');
        stringIndex -= curSize;
        if (curSize0 > 0) {
          curSize = curSize0;
        }
      }
      rets = numberString.slice(0, stringIndex + 1) + sep + ret + right;
      return rets;
    }

    function _expandExponent(n) {
      var str = n.toString();
      str = str.replace('E', 'e');
      var isNegative = false;
      if (str.charAt(0) === '-') {
        isNegative = true;
        str = str.substring(1);
      }
      var parts = str.split('e');
      var part1 = parts[0];
      var part2 = Number(parts[1]);
      if (part2 > 0) {
        str = part1.substr(0, 1) + part1.substr(2);
        if (str.length - 1 < part2) {
          var e = part2 + 1 - str.length;
          while (e > 0) {
            str += '0';
            e -= 1;
          }
        } else if (str.length - 1 > part2) {
          str = str.substr(0, part2 + 1) + '.' + str.substr(part2 + 1);
        }
      } else if (part2 < 0) {
        var digits = part1.substr(0, 1) + part1.substr(2);
        str = '0.';
        for (var i = part2; i < -1; i++) {
          str += '0';
        }
        str += digits;
      }
      if (isNegative) {
        str = '-' + str;
      }
      return str;
    }

    /* rounds the number based on the following rules:
     * CEILING: Rounding mode to round towards positive infinity.
     * DOWN: Rounding mode to round towards zero.
     * FLOOR: Rounding mode to round towards negative infinity.
     * HALF_DOWN: Rounding mode to round towards "nearest neighbor" unless both neighbors are equidistant, in which case round down.
     * HALF_EVEN: Rounding mode to round towards the "nearest neighbor" unless both neighbors are equidistant, in which case, round towards the even neighbor.
     * HALF_UP: Rounding mode to round towards "nearest neighbor" unless both neighbors are equidistant, in which case round up.
     * UP: Rounding mode to round away from zero.
     */
    function _roundNumber(value, scale, mode) {
      var rounded;
      var adjustedMode = mode;
      var parts = _expandExponent(value);
      parts = parts.split('.');
      if (parts[1] === undefined) {
        return Math.abs(value);
      }
      if (mode !== 'DEFAULT') {
        // HALF_DOWN behaves as HALF_UP if the discarded fraction is > 0.5
        if (mode === 'HALF_UP' || mode === 'HALF_EVEN' || mode === 'HALF_DOWN') {
          if (parts[1][scale] === '5') {
            var n = parts[1].substr(scale);
            n = parseInt(n, 10);
            if (n > 5) {
              adjustedMode = 'HALF_UP';
            }
          } else {
            adjustedMode = 'DEFAULT';
          }
          // eslint-disable-next-line no-param-reassign
          value = Math.abs(value);
        }
        adjustedMode = _getRoundingMode(parts, adjustedMode, scale, value);
        rounded = _decimalAdjust(value, -scale, adjustedMode);
      } else {
        var factor = Math.pow(10, scale);
        rounded = Math.round(value * factor) / factor;
        if (!isFinite(rounded)) {
          return value;
        }
      }
      return Math.abs(rounded);
    }

    function _getRoundingMode(parts, rMode, scale, value) {
      var mode = _roundingModeMap[rMode];
      if (rMode === 'HALF_EVEN') {
        var c;
        if (scale === 0) {
          var len = parts[0].length;
          c = parseInt(parts[0][len - 1], 10);
        } else {
          c = parseInt(parts[1][scale - 1], 10);
        }
        if (c % 2 === 0) {
          mode = _roundingModeMap.HALF_DOWN;
        } else {
          mode = _roundingModeMap.HALF_UP;
        }
      } else if (rMode === 'UP' && value < 0) {
        mode = _roundingModeMap.DOWN;
      } else if (rMode === 'DOWN' && value < 0) {
        mode = _roundingModeMap.UP;
      }
      return mode;
    }

    /**
     * This function does the actual rounding of the number based on the rounding
     * mode:
     * value is the number to be rounded.
     * scale is the maximumFractionDigits.
     * mode is the rounding mode: ceil, floor, round.
     */
    function _decimalAdjust(value, scale, mode) {
      if (scale === 0) {
        return Math[mode](value);
      }
      var strValue = value.toString().split('e');
      var v0 = strValue[0];
      var v1 = strValue[1];
      // shift the decimal point based on the scale so that we can apply ceil or floor
      // scale is a number, no need to parse it, just parse v1.
      var s = v0 + 'e' + (v1 ? parseInt(v1, 10) - scale : -scale);
      var num = parseFloat(s);
      var _value = Math[mode](num);
      strValue = _value.toString().split('e');
      // need to extract v0 and v1 again because value has changed after applying Math[mode].
      v0 = strValue[0];
      v1 = strValue[1];
      // shift the decimal point back to its original position
      s = v0 + 'e' + (v1 ? parseInt(v1, 10) + scale : scale);
      num = parseFloat(s);
      return num;
    }

    // first call _toRawFixed then add prefixes and suffixes. Display the
    // number using native digits based on the numbering system
    function _formatNumberImpl(value, options, localeElements, numberSettings, locale) {
      var localeElementsMainNode =
        __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
      if (!isFinite(value)) {
        if (value === Infinity) {
          return localeElementsMainNode.numbers[numberSettings.numberingSystem].infinity;
        }
        if (value === -Infinity) {
          return localeElementsMainNode.numbers[numberSettings.numberingSystem].infinity;
        }
        // return localeElementsMainNode.numbers[numberSettings.numberingSystem].nan;
        // return a non-localized NaN so the IntlNumberConverter can throw
        // an error based on it.
        return 'NaN';
      }
      var number = value;
      if (numberSettings.isPercent === true || numberSettings.style === 'percent') {
        number *= 100;
      } else if (numberSettings.isPerMill === true) {
        number *= 1000;
      }
      // expand the number
      var formatType = options.decimalFormat;
      if (formatType === undefined) {
        formatType = options.currencyFormat;
      }
      var optStyle = numberSettings.style;
      if (
        (optStyle === 'decimal' || optStyle === 'currency') &&
        formatType !== undefined &&
        formatType !== 'standard'
      ) {
        number = _toCompactNumber(number, options, numberSettings);
      } else if (numberSettings.useExponentialNotation === true) {
        number = _toExponentialPrecision(number, numberSettings);
      } else if (optStyle === 'unit') {
        number = _toDigitalByte(number, options, numberSettings, localeElementsMainNode);
      } else {
        number = _toRawFixed(number, options, numberSettings);
      }

      var ret = '';
      // add negative prefix and suffix if number is negative
      // and the new formatted value isn't zero
      if (value < 0 && number - 0 !== 0) {
        ret += numberSettings.negativePrefix + number + numberSettings.negativeSuffix;
      } else {
        // add positive prefix and suffix if number is positive
        ret += numberSettings.positivePrefix + number + numberSettings.positiveSuffix;
      }
      // display the digits based on the numbering system
      var numberingSystemKey = _getNumberingExtension(locale);
      if (__ConverterUtilsI18n.OraI18nUtils.numeringSystems[numberingSystemKey] === undefined) {
        numberingSystemKey = 'latn';
      }
      if (numberingSystemKey !== 'latn') {
        var idx;
        var nativeRet = [];
        for (idx = 0; idx < ret.length; idx++) {
          if (ret[idx] >= '0' && ret[idx] <= '9') {
            nativeRet.push(
              __ConverterUtilsI18n.OraI18nUtils.numeringSystems[numberingSystemKey][ret[idx]]
            );
          } else {
            nativeRet.push(ret[idx]);
          }
        }
        return nativeRet.join('');
      }
      return ret;
    }

    // remove prefix and suffix, return a sign and value. First try to extract
    // a number using exact match. If it fails try lenient parsing.
    function _parseNegativePattern(value, options, numberSettings, localeElements) {
      var ret;
      var num = __ConverterUtilsI18n.OraI18nUtils.trimNumber(value);
      var sign = '';
      var exactMatch = false;
      var posSign = localeElements.numbers[numberSettings.numberingSystem].plusSign;
      var posSignRegExp = new RegExp('^' + posSign.replace(_ESCAPE_REGEXP, '\\$1'));
      num = num.replace(posSignRegExp, '');
      // The pattern of a number may contain positive prefix (nbSettingPosPrefix),
      // positive suffix (nbSettingPosSuffix),
      // negative prefix (nbSettingNegPrefix) ,
      // negative suffix (nbSettingNegSuffix).
      // We first try exact match of these prefix/suffix to determine the sign of
      // the number. If the number pattern pattern contain these prefix/suffix
      // and no exact match is found, we go to lenient parse.
      var nbSettingPosPrefix = __ConverterUtilsI18n.OraI18nUtils.trimNumber(
        numberSettings.positivePrefix
      );
      var nbSettingPosSuffix = __ConverterUtilsI18n.OraI18nUtils.trimNumber(
        numberSettings.positiveSuffix
      );
      var nbSettingNegPrefix = __ConverterUtilsI18n.OraI18nUtils.trimNumber(
        numberSettings.negativePrefix
      );
      var nbSettingNegSuffix = __ConverterUtilsI18n.OraI18nUtils.trimNumber(
        numberSettings.negativeSuffix
      );
      // Create regular expressions for the prefixes and suffixes in order to
      // match them with the input number. We need to escape the special
      // characters in them by using _ESCAPE_REGEXP. For example if the prefix
      // conatain '$' it need to be escaped to '\\$'
      // positive prefix regular expression
      var posPrefRegexp = new RegExp(
        '^' + (nbSettingPosPrefix || '').replace(_ESCAPE_REGEXP, '\\$1')
      );
      // positive suffix regular expression
      var posSuffRegexp = new RegExp(
        (nbSettingPosSuffix || '').replace(_ESCAPE_REGEXP, '\\$1') + '$'
      );
      // negative prefix regular expression
      var negPrefRegexp = new RegExp(
        '^' + (nbSettingNegPrefix || '').replace(_ESCAPE_REGEXP, '\\$1')
      );
      // negative suffix regular expression
      var negSuffRegexp = new RegExp(
        (nbSettingNegSuffix || '').replace(_ESCAPE_REGEXP, '\\$1') + '$'
      );
      // try exact match of negative prefix and suffix
      if (negPrefRegexp.test(num) === true && negSuffRegexp.test(num) === true) {
        num = num.replace(negPrefRegexp, '');
        num = num.replace(negSuffRegexp, '');
        sign = '-';
        exactMatch = true;
      } else if (posPrefRegexp.test(num) === true && posSuffRegexp.test(num) === true) {
        // try exact match of positive prefix and suffix
        num = num.replace(posPrefRegexp, '');
        num = num.replace(posSuffRegexp, '');
        sign = '+';
        exactMatch = true;
      } else if (numberSettings.style === 'currency') {
        // if style is currency, remove currency symbol from prefix and suffix
        // and try a match
        var code = numberSettings.currencyCode;
        var symbol = code;
        var repStr;
        if (localeElements.numbers.currencies[code] !== undefined) {
          symbol = localeElements.numbers.currencies[code].symbol;
        }
        if (
          numberSettings.currencyDisplay === undefined ||
          numberSettings.currencyDisplay === 'symbol'
        ) {
          repStr = symbol;
        } else if (numberSettings.currencyDisplay === 'code') {
          repStr = code;
        }
        if (repStr !== undefined) {
          // Remove the currency code/symbol from the prefix/suffix
          var posPrefix = (nbSettingPosPrefix || '').replace(repStr, '');
          var posSuffix = (nbSettingPosSuffix || '').replace(repStr, '');
          var negPrefix = (nbSettingNegPrefix || '').replace(repStr, '');
          var negSuffix = (nbSettingNegSuffix || '').replace(repStr, '');
          // positive prefix regular expression without currency code/symbol
          posPrefRegexp = new RegExp('^' + posPrefix.replace(_ESCAPE_REGEXP, '\\$1'));
          // positive suffix regular expression without currency code/symbol
          posSuffRegexp = new RegExp(posSuffix.replace(_ESCAPE_REGEXP, '\\$1') + '$');
          // negative prefix regular expression without currency code/symbol
          negPrefRegexp = new RegExp('^' + negPrefix.replace(_ESCAPE_REGEXP, '\\$1'));
          // negative suffix regular expression without currency code/symbol
          negSuffRegexp = new RegExp(negSuffix.replace(_ESCAPE_REGEXP, '\\$1') + '$');

          // try  match of positive prefix and suffix without currency code/symbol
          if (negPrefRegexp.test(num) === true && negSuffRegexp.test(num) === true) {
            num = num.replace(negPrefRegexp, '');
            num = num.replace(negSuffRegexp, '');
            sign = '-';
            exactMatch = true;
          } else if (posPrefRegexp.test(num) === true && posSuffRegexp.test(num) === true) {
            // try exact match of positive prefix and suffix
            num = num.replace(posPrefRegexp, '');
            num = num.replace(posSuffRegexp, '');
            sign = '+';
            exactMatch = true;
          }
        }
      }
      if (!exactMatch) {
        if (numberSettings.lenientParse === 'full') {
          ret = _lenientParseNumber(num, numberSettings);
          ret[2] = true;
        } else {
          _throwNaNException(numberSettings.style, numberSettings, value);
        }
      } else {
        ret = [sign, num];
      }
      return ret;
    }

    function _lenientParseNumber(_num, numberSettings) {
      // Try to extract the number accoring to the following pattern:
      // optional +- followed by one or many digits followed by optional
      // fraction part followed by optional exponential.
      // use localized +, -, decimal separator, exponential
      // [+-]?\d+(?:\.\d+)?(?:E[+-]?\d+)?/;
      // remove grouping deparator from string
      var groupingSeparator = numberSettings.groupingSeparator;
      var decimalSeparator = numberSettings.decimalSeparator;
      var localeMinusSign = numberSettings.minusSign;
      var plusSign = '+';
      var minusSign = '-';
      var sign = '';
      var dot = '';
      var exponential = __ConverterUtilsI18n.OraI18nUtils.toUpper(numberSettings.exponential);
      var num = __ConverterUtilsI18n.OraI18nUtils.toUpper(_num);
      num = num.split(exponential).join('E');
      // remove grouping separator from string
      var groupSep = groupingSeparator;
      num = num.split(groupSep).join('');
      var altGroupSep = groupSep.replace(/\u00A0/g, ' ');
      if (groupSep !== altGroupSep) {
        num = num.split(altGroupSep).join('');
      }
      num = num.split(decimalSeparator).join('.');
      if (num.charAt(0) === '.') {
        num = num.substr(1);
        dot = '.';
      }
      // replace localized minus with minus
      num = num.replace(localeMinusSign, minusSign);
      var match = _LENIENT_REGEX_PARSE_FLOAT.exec(num);
      var resNum = dot + match[2];
      if (__ConverterUtilsI18n.OraI18nUtils.startsWith(resNum, minusSign)) {
        resNum = resNum.substr(minusSign.length);
        sign = '-';
      } else if (__ConverterUtilsI18n.OraI18nUtils.startsWith(num, plusSign)) {
        resNum = resNum.substr(plusSign.length);
        sign = '+';
      }
      return [sign, resNum];
    }

    // parse the exponent part of a number
    function _parseNegativeExponent(_value, numberSettings) {
      var neg = numberSettings.minusSign;
      var pos = numberSettings.plusSign;
      var ret;
      var value = __ConverterUtilsI18n.OraI18nUtils.trimNumber(_value);
      neg = __ConverterUtilsI18n.OraI18nUtils.trimNumber(neg);
      pos = __ConverterUtilsI18n.OraI18nUtils.trimNumber(pos);
      if (__ConverterUtilsI18n.OraI18nUtils.startsWith(value, neg)) {
        ret = ['-', value.substr(neg.length)];
      } else if (
        __ConverterUtilsI18n.OraI18nUtils.startsWith(
          value,
          __ConverterUtilsI18n.OraI18nUtils.trimNumber(pos)
        )
      ) {
        ret = ['+', value.substr(pos.length)];
      }
      return ret || ['', value];
    }

    function _getLatnDigits(str, locale) {
      var numberingSystemKey = _getNumberingExtension(locale);
      if (__ConverterUtilsI18n.OraI18nUtils.numeringSystems[numberingSystemKey] === undefined) {
        return str;
      }
      var idx;
      var latnStr = [];
      for (idx = 0; idx < str.length; idx++) {
        var pos = __ConverterUtilsI18n.OraI18nUtils.numeringSystems[numberingSystemKey].indexOf(
          str[idx]
        );
        if (pos !== -1) {
          latnStr.push(pos);
        } else {
          latnStr.push(str[idx]);
        }
      }
      var ret = latnStr.join('');
      return ret;
    }

    // split the number into integer, fraction and exponential parts
    function _getNumberParts(_num, numberSettings) {
      var parts = {};
      var decimalSeparator = numberSettings.decimalSeparator;
      var groupSep = numberSettings.groupingSeparator;
      var num = _num.replace(/ /g, '');
      // determine exponent and number
      var exponentSymbol = numberSettings.exponential;
      var integer;
      var intAndFraction;
      var exponentPos = num.indexOf(exponentSymbol.toLowerCase());
      if (exponentPos < 0) {
        exponentPos = num.indexOf(__ConverterUtilsI18n.OraI18nUtils.toUpper(exponentSymbol));
      }
      if (exponentPos < 0) {
        intAndFraction = num;
        parts.exponent = null;
      } else {
        intAndFraction = num.substr(0, exponentPos);
        parts.exponent = num.substr(exponentPos + exponentSymbol.length);
      }
      // determine decimal position
      var decSep = decimalSeparator;
      var decimalPos = intAndFraction.indexOf(decSep);
      if (decimalPos < 0) {
        integer = intAndFraction;
        parts.fraction = null;
      } else {
        integer = intAndFraction.substr(0, decimalPos);
        parts.fraction = intAndFraction.substr(decimalPos + decSep.length);
      }
      // handle groups (e.g. 1,000,000)
      integer = integer.split(groupSep).join('');
      var altGroupSep = groupSep.replace(/\u00A0/g, ' ');
      if (groupSep !== altGroupSep) {
        integer = integer.split(altGroupSep).join('');
      }
      parts.integer = integer;
      return parts;
    }

    function _getParsedValue(ret, options, numberSettings, errStr) {
      if (isNaN(ret)) {
        _throwNaNException(numberSettings.style, numberSettings, errStr);
      }
      if (numberSettings.isPercent === true || numberSettings.style === 'percent') {
        // eslint-disable-next-line no-param-reassign
        ret /= 100;
      } else if (numberSettings.isPerMill === true) {
        // eslint-disable-next-line no-param-reassign
        ret /= 1000;
      }
      var getOption = __ConverterUtilsI18n.OraI18nUtils.getGetOption(
        options,
        'OraNumberConverter.parse'
      );
      var roundDuringParse = getOption('roundDuringParse', 'boolean', [true, false], false);
      if (roundDuringParse) {
        // eslint-disable-next-line no-param-reassign
        ret = _getRoundedNumber(ret, numberSettings, options);
      }
      return ret;
    }

    function _throwNaNException(style, numberSettings, errStr) {
      var code;
      var msg = 'Enter a number in this format:' + numberSettings.pat;
      switch (style) {
        case 'decimal':
          code = 'decimalFormatMismatch';
          break;
        case 'currency':
          code = 'currencyFormatMismatch';
          break;
        case 'percent':
          code = 'percentFormatMismatch';
          break;
        default:
          break;
      }
      var error = new Error(msg);
      var errorInfo = {
        errorCode: code,
        parameterMap: {
          value: errStr,
          format: numberSettings.pat
        }
      };
      error.errorInfo = errorInfo;
      throw error;
    }

    function _parseNumberImpl(str, localeElements, options, locale) {
      var localeElementsMainNode =
        __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNode(localeElements);
      var numberSettings = {};
      var numStr = _getLatnDigits(str, locale);
      _getNumberSettings(localeElements, numberSettings, options, locale);
      var ret = NaN;
      var value1 = numStr.replace(/ /g, '');
      // allow infinity or hexidecimal
      if (_REGEX_INFINITY.test(value1)) {
        ret = parseFloat(numStr);
        return ret;
      }
      var signInfo = _parseNegativePattern(numStr, options, numberSettings, localeElementsMainNode);
      var sign = signInfo[0];
      var num = signInfo[1];
      sign = sign || '+';
      if (signInfo[2]) {
        ret = parseFloat(sign + num);
        return _getParsedValue(ret, options, numberSettings, str);
      }

      var parts = _getNumberParts(num, numberSettings);
      var integer = parts.integer;
      var fraction = parts.fraction;
      var exponent = parts.exponent;

      // build a natively parsable number string
      var p = sign + integer;
      if (fraction !== null) {
        p += '.' + fraction;
      }
      if (exponent !== null) {
        // exponent itself may have a number pattern
        var expSignInfo = _parseNegativeExponent(exponent, numberSettings);
        p += 'e' + (expSignInfo[0] || '+') + expSignInfo[1];
      }
      if (_REGEX_PARSE_FLOAT.test(p)) {
        ret = parseFloat(p);
      } else if (numberSettings.lenientParse === 'full') {
        p = _lenientParseNumber(numStr, numberSettings);
        ret = parseFloat(p[0] + p[1]);
      } else {
        _throwNaNException(numberSettings.style, numberSettings, str);
      }
      return _getParsedValue(ret, options, numberSettings, str);
    }

    /* This module handles the  parsing of a number pattern.
     * It sets prefix, suffix, minimum and maximum farcation digits,
     * miimum  integer digits and grouping size.
     */

    var _ZERO_DIGIT = '0';
    var _GROUPING_SEPARATOR = ',';
    var _DECIMAL_SEPARATOR = '.';
    var _PERCENT = '%';
    var _PER_MILL = '\u2030';
    var _DIGIT = '#';
    var _SEPARATOR = ';';
    var _EXPONENT = 'E';
    var _MINUS = '-';
    var _QUOT = "'";
    var _CURRENCY = '\u00A4';

    var posPrefixPattern;
    var posSuffixPattern;
    var negPrefixPattern;
    var negSuffixPattern;

    var _MAXIMUM_INTEGER_DIGITS = 0x7fffffff;
    var _MAXIMUM_FRACTION_DIGITS = 0x7fffffff;

    function _throwSyntaxError(pattern) {
      var samplePattern = '#,##0.###';
      var msg =
        'Unexpected character(s) encountered in the pattern "' +
        pattern +
        ' An example of a valid pattern is "' +
        samplePattern +
        '".';
      var syntaxError = new SyntaxError(msg);
      var errorInfo = {
        errorCode: 'optionValueInvalid',
        parameterMap: {
          propertyName: 'pattern',
          propertyValue: pattern,
          propertyValueHint: samplePattern
        }
      };
      syntaxError.errorInfo = errorInfo;
      throw syntaxError;
    }

    function _regionMatches(str1, offset1, str2) {
      var sub1 = str1.substr(offset1, str2.length);
      var regExp = new RegExp(str2, 'i');
      return regExp.exec(sub1) !== null;
    }

    function _expandAffixes(localeElements, _numberSettings) {
      var numberSettings = _numberSettings;
      var curDisplay = {};
      if (posPrefixPattern !== null) {
        numberSettings.positivePrefix = _expandAffix(
          posPrefixPattern,
          localeElements,
          numberSettings,
          curDisplay
        );
      }
      if (posSuffixPattern !== null) {
        numberSettings.positiveSuffix = _expandAffix(
          posSuffixPattern,
          localeElements,
          numberSettings,
          curDisplay
        );
      }
      if (negPrefixPattern !== null) {
        numberSettings.negativePrefix = _expandAffix(
          negPrefixPattern,
          localeElements,
          numberSettings,
          curDisplay
        );
      }
      if (negSuffixPattern !== null) {
        numberSettings.negativeSuffix = _expandAffix(
          negSuffixPattern,
          localeElements,
          numberSettings,
          curDisplay
        );
      }
      if (curDisplay.name !== undefined) {
        numberSettings.positiveSuffix = '\u00a0' + curDisplay.name;
        numberSettings.positivePrefix = '';
        if (numberSettings.lang === 'ar') {
          numberSettings.negativeSuffix =
            localeElements.numbers[numberSettings.numberingSystem].minusSign +
            '\u00a0' +
            curDisplay.name;
          numberSettings.negativePrefix = '';
        } else {
          numberSettings.negativeSuffix = '\u00a0' + curDisplay.name;
          numberSettings.negativePrefix =
            localeElements.numbers[numberSettings.numberingSystem].minusSign;
        }
      }
    }

    function _expandAffix(pattern, localeElements, numberSettings, currencyDisplay) {
      var buffer = '';
      for (var i = 0; i < pattern.length; ) {
        var c = pattern.charAt(i);
        i += 1;
        if (c !== _QUOT) {
          // c = pattern.charAt(i++);
          switch (c) {
            case _CURRENCY:
              var code = numberSettings.currencyCode;
              var name = code;
              var symbol = code;

              if (localeElements.numbers.currencies[code] !== undefined) {
                name = localeElements.numbers.currencies[code].displayName;
                symbol = localeElements.numbers.currencies[code].symbol;
              }
              if (
                numberSettings.currencyDisplay === undefined ||
                numberSettings.currencyDisplay === 'symbol'
              ) {
                c = symbol;
              } else if (numberSettings.currencyDisplay === 'code') {
                // Currency code need to be followed by a space character
                c = code + ' ';
              } else {
                c = name;
                // eslint-disable-next-line no-param-reassign
                currencyDisplay.name = c;
              }
              break;
            case _PERCENT:
              c = localeElements.numbers[numberSettings.numberingSystem].percentSign;
              break;
            case _PER_MILL:
              c = localeElements.numbers[numberSettings.numberingSystem].perMille;
              break;
            case _MINUS:
              c = localeElements.numbers[numberSettings.numberingSystem].minusSign;
              break;
            default:
              break;
          }
          buffer = buffer.concat(c);
        }
      }
      return buffer;
    }

    function _applyPatternImpl(options, pattern, localeElements, _numberSettings) {
      var numberSettings = _numberSettings;
      var gotNegative = false;
      var useExponentialNotation = false;
      var phaseOneLength = 0;
      var start = 0;
      var isPrefix = true;
      var minExponentDigits;

      for (var j = 1; j >= 0 && start < pattern.length; --j) {
        var inQuote = false;
        var prefix = '';
        var suffix = '';
        var decimalPos = -1;
        var multiplier = 1;
        var digitLeftCount = 0;
        var zeroDigitCount = 0;
        var digitRightCount = 0;
        var groupingCount = -1;
        var groupingCount0 = -1;
        var phase = 0;

        /* eslint-disable no-continue */
        isPrefix = true;
        for (var pos = start; pos < pattern.length; ++pos) {
          var ch = pattern.charAt(pos);
          switch (phase) {
            case 0:
            case 2:
              // Process the prefix / suffix characters
              if (inQuote) {
                if (ch === _QUOT) {
                  if (pos + 1 < pattern.length && pattern.charAt(pos + 1) === _QUOT) {
                    pos += 1;
                    if (isPrefix) {
                      prefix = prefix.concat("''");
                    } else {
                      suffix = suffix.concat("''");
                    }
                  } else {
                    inQuote = false; // 'do'
                  }
                  continue;
                }
              } else if (
                ch === _DIGIT ||
                ch === _ZERO_DIGIT ||
                ch === _GROUPING_SEPARATOR ||
                ch === _DECIMAL_SEPARATOR
              ) {
                // Process unquoted characters seen in prefix or suffix phase.
                phase = 1;
                pos -= 1; // Reprocess this character
                continue;
              } else if (ch === _CURRENCY) {
                if (options.currency === undefined) {
                  _throwMissingCurrency('style');
                }
                // Use lookahead to determine if the currency sign
                // is doubled or not.
                numberSettings.style = 'currency';
                var doubled = pos + 1 < pattern.length && pattern.charAt(pos + 1) === _CURRENCY;
                if (doubled) {
                  // Skip over the doubled character
                  pos += 1;
                }
                if (isPrefix) {
                  prefix = prefix.concat(doubled ? "'\u00A4\u00A4" : "'\u00A4");
                } else {
                  suffix = suffix.concat(doubled ? "'\u00A4\u00A4" : "'\u00A4");
                }
                continue;
              } else if (ch === _QUOT) {
                if (ch === _QUOT) {
                  if (pos + 1 < pattern.length && pattern.charAt(pos + 1) === _QUOT) {
                    pos += 1;
                    if (isPrefix) {
                      prefix = prefix.concat("''"); // o''clock
                    } else {
                      suffix = suffix.concat("''");
                    }
                  } else {
                    inQuote = true; // 'do'
                  }
                  continue;
                }
              } else if (ch === _SEPARATOR) {
                if (phase === 0 || j === 0) {
                  _throwSyntaxError(pattern);
                }
                start = pos + 1;
                pos = pattern.length;
                continue;
              } else if (ch === _PERCENT) {
                // Next handle characters which are appended directly.
                numberSettings.style = 'percent';
                if (multiplier !== 1) {
                  _throwSyntaxError(pattern);
                }
                numberSettings.isPercent = true;
                multiplier = 100;
                if (isPrefix) {
                  prefix = prefix.concat("'%");
                } else {
                  suffix = suffix.concat("'%");
                }
                continue;
              } else if (ch === _PER_MILL) {
                if (multiplier !== 1) {
                  _throwSyntaxError(pattern);
                }
                numberSettings.style = 'perMill';
                numberSettings.isPerMill = true;
                multiplier = 1000;
                if (isPrefix) {
                  prefix = prefix.concat("'\u2030");
                } else {
                  suffix = suffix.concat("'\u2030");
                }
                continue;
              } else if (ch === _MINUS) {
                if (isPrefix) {
                  prefix = prefix.concat("'-");
                } else {
                  suffix = suffix.concat("'-");
                }
                continue;
              }
              if (isPrefix) {
                prefix = prefix.concat(ch);
              } else {
                suffix = suffix.concat(ch);
              }
              break;

            case 1:
              if (j === 1) {
                phaseOneLength += 1;
              } else {
                phaseOneLength -= 1;
                if (phaseOneLength === 0) {
                  phase = 2;
                  isPrefix = false;
                }
                continue;
              }

              if (ch === _DIGIT) {
                if (zeroDigitCount > 0) {
                  digitRightCount += 1;
                } else {
                  digitLeftCount += 1;
                }
                if (groupingCount >= 0 && decimalPos < 0) {
                  groupingCount += 1;
                }
              } else if (ch === _ZERO_DIGIT) {
                if (digitRightCount > 0) {
                  _throwSyntaxError(pattern);
                }
                zeroDigitCount += 1;
                if (groupingCount >= 0 && decimalPos < 0) {
                  groupingCount += 1;
                }
              } else if (ch === _GROUPING_SEPARATOR) {
                groupingCount0 = groupingCount;
                groupingCount = 0;
              } else if (ch === _DECIMAL_SEPARATOR) {
                if (decimalPos >= 0) {
                  _throwSyntaxError(pattern);
                }
                decimalPos = digitLeftCount + zeroDigitCount + digitRightCount;
              } else if (_regionMatches(pattern, pos, _EXPONENT)) {
                if (useExponentialNotation) {
                  _throwSyntaxError(pattern);
                }
                useExponentialNotation = true;
                minExponentDigits = 0;
                pos += _EXPONENT.length;
                while (pos < pattern.length && pattern.charAt(pos) === _ZERO_DIGIT) {
                  minExponentDigits += 1;
                  phaseOneLength += 1;
                  pos += 1;
                }

                if (digitLeftCount + zeroDigitCount < 1 || minExponentDigits < 1) {
                  _throwSyntaxError(pattern);
                }
                phase = 2;
                isPrefix = false;
                pos -= 1;
                continue;
              } else {
                phase = 2;
                isPrefix = false;
                pos -= 1;
                phaseOneLength -= 1;
                continue;
              }
              break;
            default:
              break;
          }
        }
        /* eslint-enable no-continue */

        if (zeroDigitCount === 0 && digitLeftCount > 0 && decimalPos >= 0) {
          // Handle "###.###" and "###." and ".###"
          var n = decimalPos;
          if (n === 0) {
            // Handle ".###"
            n += 1;
          }
          digitRightCount = digitLeftCount - n;
          digitLeftCount = n - 1;
          zeroDigitCount = 1;
        }

        // Do syntax checking on the digits.
        if (
          (decimalPos < 0 && digitRightCount > 0) ||
          (decimalPos >= 0 &&
            (decimalPos < digitLeftCount || decimalPos > digitLeftCount + zeroDigitCount)) ||
          groupingCount === 0 ||
          inQuote
        ) {
          _throwSyntaxError(pattern);
        }

        if (j === 1) {
          posPrefixPattern = prefix;
          posSuffixPattern = suffix;
          negPrefixPattern = posPrefixPattern;
          negSuffixPattern = posSuffixPattern;
          var digitTotalCount = digitLeftCount + zeroDigitCount + digitRightCount;
          // The effectiveDecimalPos is the position the decimal is at or
          // would be at if there is no decimal. Note that if decimalPos<0,
          // then digitTotalCount == digitLeftCount + zeroDigitCount.
          var effectiveDecimalPos = decimalPos >= 0 ? decimalPos : digitTotalCount;
          numberSettings.minimumIntegerDigits = effectiveDecimalPos - digitLeftCount;
          numberSettings.maximumIntegerDigits = useExponentialNotation
            ? digitLeftCount + numberSettings.minimumIntegerDigits
            : _MAXIMUM_INTEGER_DIGITS;
          numberSettings.maximumFractionDigits = decimalPos >= 0 ? digitTotalCount - decimalPos : 0;
          numberSettings.minimumFractionDigits =
            decimalPos >= 0 ? digitLeftCount + zeroDigitCount - decimalPos : 0;
          numberSettings.groupingSize = groupingCount > 0 ? groupingCount : 0;
          numberSettings.groupingSize0 = groupingCount0;
        } else {
          negPrefixPattern = prefix;
          negSuffixPattern = suffix;
          gotNegative = true;
        }
      }

      if (pattern.length === 0) {
        posPrefixPattern = '';
        posSuffixPattern = '';
        numberSettings.minimumIntegerDigits = 0;
        numberSettings.maximumIntegerDigits = _MAXIMUM_INTEGER_DIGITS;
        numberSettings.minimumFractionDigits = 0;
        numberSettings.maximumFractionDigits = _MAXIMUM_FRACTION_DIGITS;
      }
      numberSettings.useExponentialNotation = useExponentialNotation;
      numberSettings.minExponentDigits = minExponentDigits;
      // If there was no negative pattern, or if the negative pattern is
      // identical to the positive pattern, then prepend the minus sign to
      // the positive pattern to form the negative pattern.
      if (
        !gotNegative ||
        (negPrefixPattern.localeCompare(posPrefixPattern) === 0 &&
          negSuffixPattern.localeCompare(posSuffixPattern) === 0)
      ) {
        if (numberSettings.style === 'currency' && numberSettings.lang === 'ar') {
          negSuffixPattern = posSuffixPattern + "'\u200f-";
          negPrefixPattern = posPrefixPattern;
        } else {
          negSuffixPattern = posSuffixPattern;
          negPrefixPattern = "'-" + posPrefixPattern;
        }
      }
      _expandAffixes(localeElements, numberSettings);
    }

    function _getRoundedNumber(ret, numberSettings, options) {
      var precision = numberSettings.maximumFractionDigits;
      var isNegative = ret < 0;
      var mode = options.roundingMode || 'DEFAULT';
      var roundedNumber = _roundNumber(ret, precision, mode);
      return isNegative ? -roundedNumber : roundedNumber;
    }

    function _resolveNumberSettings(localeElements, options, locale) {
      var numberSettings = {};
      _validateNumberOptions(options, 'OraNumberConverter.resolvedOptions');
      _getNumberSettings(localeElements, numberSettings, options, locale);
      numberSettings.numberingSystemKey = _getNumberingExtension(locale);
      if (
        __ConverterUtilsI18n.OraI18nUtils.numeringSystems[numberSettings.numberingSystemKey] ===
        undefined
      ) {
        numberSettings.numberingSystemKey = 'latn';
      }
      return numberSettings;
    }

    function _resolveOptions(numberSettings, options, locale) {
      var resOptions = {
        locale: locale,
        style: numberSettings.style === undefined ? 'decimal' : numberSettings.style,
        useGrouping: options.useGrouping === undefined ? true : options.useGrouping,
        numberingSystem: numberSettings.numberingSystemKey
      };
      resOptions.minimumIntegerDigits = numberSettings.minimumIntegerDigits;
      resOptions.minimumFractionDigits = numberSettings.minimumFractionDigits;
      resOptions.maximumFractionDigits = numberSettings.maximumFractionDigits;
      if (numberSettings.style === 'decimal' && options.decimalFormat !== undefined) {
        resOptions.decimalFormat = options.decimalFormat;
      }
      if (numberSettings.style === 'currency' && options.currencyFormat !== undefined) {
        resOptions.currencyFormat = options.currencyFormat;
      }
      if (numberSettings.style === 'currency') {
        resOptions.currency = options.currency;
        resOptions.currencyDisplay =
          options.currencyDisplay === undefined ? 'symbol' : options.currencyDisplay;
      }
      if (options.unit !== undefined) {
        resOptions.unit = options.unit;
      }
      if (options.pattern !== undefined) {
        resOptions.pattern = options.pattern;
      }
      var roundingMode = options.roundingMode;
      var roundDuringParse = options.roundDuringParse;
      if (roundingMode !== undefined) {
        resOptions.roundingMode = roundingMode;
      }
      if (roundDuringParse !== undefined) {
        resOptions.roundDuringParse = roundDuringParse;
      }
      var leneint = numberSettings.lenientParse;
      if (leneint !== undefined) {
        resOptions.lenientParse = leneint;
      }
      var sep = numberSettings.separators;
      if (sep !== undefined) {
        resOptions.separators = sep;
      }
      resOptions.virtualKeyboardHint = _getVirtualKeyboardHint(numberSettings, options);
      return resOptions;
    }

    /*
     * Checks through the converter options.
     * Based on the options the appropriate virtualKeyboardHint is returned.
     * @return {string} virtual keyboard hint type - 'number' or 'text'
     */
    function _getVirtualKeyboardHint(numberSettings, options) {
      var virtualKeyboardHint = 'text';
      var converterStyle = options.style;
      switch (converterStyle) {
        case 'unit':
          virtualKeyboardHint = 'text';
          break;

        case 'currency':
        case 'percent':
          if (options.pattern === undefined) {
            virtualKeyboardHint = 'text';
          } else {
            virtualKeyboardHint = _parsePatternOption(numberSettings, options);
          }
          break;

        default:
          if (options.pattern === undefined) {
            if (options.decimalFormat === 'short' || options.decimalFormat === 'long') {
              virtualKeyboardHint = 'text';
            } else {
              virtualKeyboardHint = _parseUseGrouping(numberSettings, options);
            }
          } else {
            virtualKeyboardHint = _parsePatternOption(numberSettings, options);
          }
          break;
      }

      return virtualKeyboardHint;
    }

    /*
     * Based on converter's options.useGrouping the virtualKeyboardHint is decided.
     * @return {string} virtualKeyboardHint value
     */
    function _parseUseGrouping(numberSettings, options) {
      if (options.useGrouping === undefined || options.useGrouping) {
        if (numberSettings.decimalSeparator === '.' && numberSettings.groupingSeparator === '') {
          return 'number';
        }
      } else if (numberSettings.decimalSeparator === '.') {
        return 'number';
      }
      return 'text';
    }

    /*
     * Based on converter's options.pattern the virtualKeyboardHint is decided.
     * @return {string} virtualKeyboardHint value
     */
    function _parsePatternOption(numberSettings, options) {
      var patternHasNonNumericChar = _checkPatternForNonNumericChar(options.pattern);
      if (patternHasNonNumericChar) {
        return 'text';
      }

      var patternHasGroupSeparator = _checkPatternForGroupSeparator(options.pattern);
      var patternHasDecimalSeparator = _checkPatternForDecimalSeparator(options.pattern);

      if (patternHasGroupSeparator && patternHasDecimalSeparator) {
        if (numberSettings.groupingSeparator !== '' || numberSettings.decimalSeparator !== '.') {
          return 'text';
        } else if (numberSettings.groupingSeparator === numberSettings.decimalSeparator) {
          return 'text';
        }
      }

      if (patternHasDecimalSeparator && !patternHasGroupSeparator) {
        if (numberSettings.decimalSeparator !== '.') {
          return 'text';
        }
      }

      if (!patternHasDecimalSeparator && patternHasGroupSeparator) {
        if (numberSettings.groupingSeparator !== '') {
          return 'text';
        }
      }
      return 'number';
    }

    /*
     * Checks if the converter's options.pattern has non-numeric characters
     * that cannot be rendered by input type 'number'.
     * @return {boolean} indicates whether pattern has non-numeric characters or not.
     */

    function _checkPatternForNonNumericChar(pattern) {
      var nonNumericPattern = /[^0-9.#]/i;
      return nonNumericPattern.test(pattern);
    }

    /*
     * Checks if the converter's options.pattern has group separator symbol
     * that cannot be rendered by input type 'number'.
     * @return {boolean} indicates whether pattern has group separator symbol or not.
     */
    function _checkPatternForGroupSeparator(pattern) {
      if (pattern.indexOf(',') !== -1) {
        return true;
      }
      return false;
    }

    /*
     * Checks if the converter's options.pattern has decimal separator symbol
     * that cannot be rendered by input type 'number'.
     * @return {boolean} indicates whether pattern has
     *  decimal separator symbol or not.
     */
    function _checkPatternForDecimalSeparator(pattern) {
      if (pattern.indexOf('.') !== -1) {
        return true;
      }
      return false;
    }

    function _init() {
      return {
        /**
         * Format a number.
         * @memberof OraNumberConverter
         * @param {number} value - Number object to be formatted.
         * @param {Object} localeElements - the instance of LocaleElements
         * bundle
         * @param {Object=} options - Containing the following properties:<br>
         * - <b>style.</b>  is one of the String values "decimal", "currency",
         * "percent" or "unit". The default is "decimal".<br>
         * - <b>decimalFormat.</b> is used in conjuction with "decimal" style.
         * It can have one of the string values "short", "long", "standard". "standard"
         * is the default. It is used for compact number formatting. For example 3000 is displayed
         *  as 3K for "short" and 3 thousand for "long". We take into consideration
         *  the locale's plural rules for the compact pattern.<br>
         * - <b>currency.</b> An ISO 4217 alphabetic currency code. Mandatory
         *  when style is "currency".<br>
         * - <b>unit.</b> Mandatory when style is "unit". Allowed values are "byte" or "bit".<br>
         * - <b>currencyFormat.</b> is used in conjuction with "currency" style.
         * It can have one of the string values "short", "long", "standard". "standard"
         * is the default. It is used for compact currency formatting. For example $3000 is displayed
         *  as $3K for "short" and 3 thousand US Dollar for "long".<br>
         * - <b>currencyDisplay.</b> is one of the String values "code",
         * "symbol", or "name", specifying whether to display the currency as
         * an ISO 4217 alphabetic currency code,
         * a localized currency symbol, or a localized currency name if
         * formatting with the "currency" style. It is only present when style
         * has the value "currency". The default is "symbol".<br>
         * - <b>minimumIntegerDigits.</b> is a non-negative integer Number value
         * indicating the minimum integer digits to be used. Numbers will be
         * padded with leading zeroes if necessary.<br>
         * - <b>minimumFractionDigits.</b> a non-negative integer Number value
         * indicating the minimum fraction digits to be used. Numbers will be
         * padded with trailing zeroes if necessary.<br>
         * - <b>maximumFractionDigits.</b> a non-negative integer Number value
         * indicating the maximum fraction digits to be used. Numbers will be
         * rounded if necessary.<br>
         * - <b>roundingMode.</b> specifies the rounding behavior. This follows the
         *  Java.Math.RoundingMode behavior. Currently we support the options :
         *  HALF_UP, HALF_DOWN, and HALF_EVEN<br>
         * - <b>useGrouping.</b> is a Boolean value indicating whether a
         * grouping separator should be used. The default is true.<br>
         * - <b>separators.</b> - An object with 2 fields: 'decimal' and 'group'.
         * It allows the user to override the locale's default decimal and grouping separators.<br>
         * - <b>pattern.</b> custom pattern. Will override above options
         * when present.
         * @param {string=} locale - A BCP47 compliant language tag. it is only
         * used to extract the unicode extension keys.
         * @return {string} formatted number.
         * @throws {RangeError} If a property value of the options parameter is
         * out of range.
         * @throws {TypeError} If the style is currency and currency code is
         * missing.
         * @throws {SyntaxError} If an unexpected character is encountered in
         * the pattern.
         */
        format: function (value, localeElements, options, locale) {
          if (arguments.length <= 2 || options === undefined) {
            // eslint-disable-next-line no-param-reassign
            options = {
              useGrouping: true,
              style: 'decimal'
            };
          }
          _validateNumberOptions(options, 'OraNumberConverter.format');
          var numberSettings = {};
          _getNumberSettings(localeElements, numberSettings, options, locale);
          return _formatNumberImpl(value, options, localeElements, numberSettings, locale);
        },
        /**
         * Parse a number.
         * @memberof OraNumberConverter
         * @param {string|number} str - string to be parsed.
         * @param {Object} localeElements - the instance of LocaleElements
         * bundle
         * @param {Object=} options - Containing the following properties:<br>
         * - <b>style.</b>  is one of the String values "decimal", "currency" or
         * "percent". The default is "decimal".<br>
         * - <b>currency.</b> An ISO 4217 alphabetic currency code. Mandatory
         * when style is "currency".<br>
         * - <b>currencyDisplay.</b> is one of the String values "code",
         * "symbol", or "name", specifying whether to display the currency as
         * an ISO 4217 alphabetic currency code,
         *  a localized currency symbol, or a localized currency name if
         *  formatting with the "currency" style. It is only considered when
         *  style has the value "currency". The default is "symbol".<br>
         * - <b>pattern.</b> custom pattern. Will override above options when
         * present.<br>
         * - <b>roundingMode.</b> specifies the rounding behavior. This follows the
         *  Java.Math.RoundingMode behavior. Currently we support the options :
         *  HALF_UP, HALF_DOWN, and HALF_EVEN<br>
         *  - <b>roundDuringParse.</b> Boolean value. Specifies whether or not to round during parse.
         *  by default the number converter rounds during format but not during parse.<br>
         *  - <b>separators.</b> - An object with 2 fields: 'decimal' and 'group'.
         * It allows the user to override the locale's default decimal and grouping separators.<br>
         *  - <b>lenientParse.</b> specifies if lenient parse is enabled or disabled. Allowed values: "full", "none".
         *  default is "full" which means lenient parse is enabled.<br>
         * @param {string=} locale - A BCP47 compliant language tag. it is only
         * used to extract the unicode extension keys.
         * @return {number} a number object parsed from the string. In case of
         * error, returns null.
         * @throws {RangeError} If a property value of the options parameter is
         * out of range.
         * @throws {TypeError} If the style is currency and currency code is
         * missing.
         * @throws {SyntaxError} If an unexpected character is encountered in
         * the pattern.
         * @throws {Error} If the <i>str</i> parameter does not match the number
         * pattern.
         */
        parse: function (str, localeElements, options, locale) {
          if (typeof str === 'number') {
            return str;
          }
          if (Object.prototype.toString.call(str) === '[object Number]') {
            return Number(str);
          }
          if (arguments.length <= 2 || options === undefined) {
            // eslint-disable-next-line no-param-reassign
            options = {
              useGrouping: true,
              style: 'decimal'
            };
          }
          _validateNumberOptions(options, 'OraNumberConverter.parse');
          return _parseNumberImpl(str, localeElements, options, locale);
        },
        /**
         * Resolve options.
         * Returns a new object with properties reflecting the number formatting
         * options computed based on the options parameter.
         * If options is not provided, the properties will be derived from the
         * locale defaults.
         * @memberof OraNumberConverter
         * @param {Object} localeElements - the instance of LocaleElements
         * bundle
         * @param {Object=} options containing the following properties:<br>
         * - <b>style.</b> "decimal", "currency", "percent" or "unit". The default is
         * "decimal".<br>
         * - <b>unit.</b> one of the strings "byte" or "bit" when the style is "unit".<br>
         * - <b>decimalFormat.</b> It can have one of the string values "short", "long", "standard".
         * "standard" is the default. It is used for compact number formatting. For example 3000 is displayed
         *  as 3K for "short" and 3 thousand for "long". We take into consideration
         *  the locale's plural rules for the compact pattern.<br>
         * - <b>currency.</b> An ISO 4217 alphabetic currency code. Mandatory
         * when when style is "currency".<br>
         * - <b>currencyFormat.</b> is used in conjuction with "currency" style.
         * It can have one of the string values "short", "long", "standard". "standard"
         * is the default. It is used for compact currency formatting. For example $3000 is displayed
         *  as $3K for "short" and 3 thousand US Dollar for "long".<br>
         * - <b>currencyDisplay.</b> is one of the String values "code",
         * "symbol", or "name", specifying whether to display the currency as
         * an ISO 4217 alphabetic currency code,
         *   a localized currency symbol, or a localized currency name if
         *   formatting with the "currency" style. It is only present
         *   when style has the value "currency". The default is "symbol".<br>
         * - <b>minimumIntegerDigits.</b> is a non-negative integer Number value
         * indicating the minimum integer digits to be used. Numbers will be
         * padded with leading zeroes if necessary.<br>
         * - <b>minimumFractionDigits.</b> a non-negative integer Number value
         * indicating the minimum fraction digits to be used. Numbers will be
         * padded with trailing zeroes if necessary.<br>
         * - <b>maximumFractionDigits.</b> a non-negative integer Number value
         * indicating the maximum fraction digits to be used. Numbers will be
         * rounded if necessary.<br>
         * - <b>numberingSystem</b>. The numbering system.<br>
         * - <b>useGrouping.</b> is a Boolean value indicating whether a
         * grouping separator should be used. The default is true.<br>
         * - <b>pattern.</b> custom pattern. Will override above options when
         * present.<br>
         * - <b>roundingMode.</b> specifies the rounding behavior. This follows the
         *  Java.Math.RoundingMode behavior. Currently we support the options :
         *  HALF_UP, HALF_DOWN, and HALF_EVEN<br>
         *  - <b>roundDuringParse.</b> Boolean value. Specifies whether or not to round during parse.
         *  by default the number converter rounds during format but not during parse.<br>
         *  - <b>separators.</b> - An object with 2 fields: 'decimal' and 'group'.
         * It allows the user to override the locale's default decimal and grouping separators.<br>
         *  - <b>lenientParse.</b> specifies if lenient parse is enabled or disabled. Allowed values: "full", "none".
         * default is "full" which means lenient parse is enabled.<br>
         * @param {string=} locale - A BCP47 compliant language tag. it is only
         * used to extract the unicode extension keys.
         * @return {Object} Resolved options object.
         * @throws {RangeError} If a property value of the options parameter is
         * out of range.
         * @throws {TypeError} If the style is currency and currency code is
         * missing.
         */
        resolvedOptions: function (localeElements, options, locale) {
          if (arguments.length < 3 || locale === undefined) {
            // eslint-disable-next-line no-param-reassign
            locale = __ConverterUtilsI18n.OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
          }
          if (arguments.length < 2 || options === undefined) {
            // eslint-disable-next-line no-param-reassign
            options = {
              useGrouping: true,
              style: 'decimal'
            };
          }
          var numberSettings = _resolveNumberSettings(localeElements, options, locale);
          return _resolveOptions(numberSettings, options, locale);
        }
      };
    }

    return {
      /**
       * getInstance.
       * Returns the singleton instance of OraNumberConverter class.
       * @memberof OraNumberConverter
       * @return {Object} The singleton OraNumberConverter instance.
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
   * oj.NumberConverter Contract.
   * @ignore
   */

  /**
   * @class
   * @name oj.NumberConverter
   * @constructor
   * @hideconstructor
   * @abstract
   * @augments oj.Converter
   * @ojsignature {target: "Type",
   *                value: "abstract class NumberConverter implements Converter<number>"}
   *
   * @ojtsimport {module: "ojconverter", type: "AMD", importName: "Converter"}
   * @export
   * @since 0.6.0
   * @see oj.IntlNumberConverter JET's implementation of the NumberConverter
   */
  const NumberConverter = function () {
    this.Init();
  };

  // Subclass from oj.Object
  oj.Object.createSubclass(NumberConverter, Converter, 'oj.NumberConverter');

  /**
   * Initializes the number converter instance with the set options.
   * @param {Object=} options an object literal used to provide an optional information to
   * initialize the converter.<p>
   * @export
   * @ignore
   */
  NumberConverter.prototype.Init = function (options) {
    NumberConverter.superclass.Init.call(this, options);
  };

  /**
   * Formats the Number value using the options provided and returs a String value.
   *
   * @param {number} value the value to be formatted for display
   * @return {(string|null)} the localized and formatted value suitable for display
   * @throws {Error} a ConverterError if formatting fails.
   * @export
   * @memberof oj.NumberConverter
   * @instance
   * @method format
   */
  NumberConverter.prototype.format = function (value) {
    return NumberConverter.superclass.format.call(this, value);
  };

  /**
   * Parses the value using the options provided and returns a Number object.
   *
   * @param {string} value to parse
   * @return {number|null} the parsed value as a Number object.
   * @throws {Error} a ConverterError if parsing fails
   * @export
   * @memberof oj.NumberConverter
   * @instance
   * @method parse
   */
  NumberConverter.prototype.parse = function (value) {
    return NumberConverter.superclass.parse.call(this, value);
  };

  /**
   * @export
   * Placeholder here as closure compiler objects to export annotation outside of top level
   */

  /**
   * @constructor
   * @final
   * @name oj.IntlNumberConverter
   * @classdesc Constructs an immutable instance and initializes it with the options provided. When initialized
   * with no options, the default options for the current locale are assumed. The converters by
   * default use the current page locale (set with the html lang attribute and what is returned by oj.Config.getLocale()).
   * There are several ways to initialize the converter.
   * <p>
   * <ul>
   * <li>Using options defined by the ECMA 402 Specification, these would be the properties style,
   * currency, currencyDisplay, minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits,
   * useGrouping. NOTE: minimumSignificantDigits and maximumSignificantDigits are not supported.</li>
   * <li>Using the decimalFormat option to define a locale-based pattern, e.g.,
   *  a compact pattern, such as "1M" and "1 million".</li>
   * <li>Using the currencyFormat option to define a locale-based pattern, e.g.,
   * a compact pattern, such as "$1M" and "$1 million".</li>
   * <li>Using the roundingMode and roundDuringParse options to round the number UP, DOWN, CEILING, FLOOR, HALF_UP, HALF_DOWN or HALF_EVEN.</li>
   * <li>Using a custom decimal, currency or percent format pattern. specified using the 'pattern' property. (deprecated)</li>
   * </ul>
   * <p>
   *
   * The converter provides leniency when parsing user input value to a number in the following ways:<br/>
   *
   * <ul>
   * <li>Prefix and suffix that do not match the pattern, are removed. E.g., when the options are
   * {style: "percent"} (suffix is the % character), a value of "abc-123.45xyz", will be leniently parsed as
   * if the value was -123.45 to
   * -123%</li>
   * <li>When a value includes a symbol but the pattern doesn't require it.  E.g., the options are
   * {pattern: "###", currency: 'USD'}, then values ($123), (123) and -123 will be leniently parsed as
   * -123.</li>
   * </ul>
   * <p>
   * Lenient parse can be disabled by setting the property lenientParse to "none". In which case the user input must
   * be an exact match of the expected pattern and all the leniency described above will be disabled.
   * <p>
   * <h3 id="migration-section">
   *   Migration
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
   * </h3>
   *
   * <p>
   * Please be aware that newer converters are available and IntlNumberConverter will be deprecated in the future.
   * See the docs for <a href="BigDecimalStringConverter.html" target="_blank">BigDecimalStringConverter</a> and
   * <a href="NumberConverter.html" target="_blank">NumberConverter</a> for more details.
   * </p>
   * @param {Object=} options - an object literal used to provide optional information to
   * initialize the converter.
   *
   * @example <caption>Create a number converter for currencies</caption>
   * var options = {style: "currency", currency: "USD", minimumIntegerDigits: 2};
   * converter = new IntlNumberConverter(options);
   * converter.format(9); --> "$09.00" if page locale is 'en-US'
   * converter.format(9); --> "09,00 $US" if page locale is 'fr-FR'<br/>
   *
   * @example <caption>A number converter for percent values using a custom (CLDR) pattern</caption>
   * var options = {pattern: '#,##0%'};
   * converter = new IntlNumberConverter(options);<br/>
   *
   * @example <caption>To parse a value as percent but format it without displaying the percent character</caption>
   * var options = {style: 'percent', pattern: '#,##0'};<br/>
   *
   * @example <caption>To parse a value as currency using a custom (CLDR) pattern</caption>
   * var options = {pattern: '¤#,##0', currency: 'USD'};
   *
   * @example <caption>To format a value as digital bit unit</caption>
   * var options = {style:'unit', unit:'bit'};
   * converter = new IntlNumberConverter(options);
   * var nb = 1024;
   * converter.format(nb, localeElements, options);--> 1Kb<br/>
   *
   * @example <caption>To format a value as digital byte unit</caption>
   * var options = {style:'unit', unit:'byte'};
   * converter = new IntlNumberConverter(options);
   * var nb = 1024;
   * converter.format(nb, localeElements, options);--> 1KB<br/>
   *
   * @example <caption>The following decimalFormat examples are in en locale.
   * To format a value as short (default for fraction digits is based on the locale)</caption>
   * var options = {style:'decimal', decimalFormat:'short'};
   * converter = new IntlNumberConverter(options);
   * converter.format(12345);--> 12.354K<br/>
   *
   * @example <caption>Same as above for currencyFormat.
   * To format a value as short (default for fraction digits is based on the locale)</caption>
   * var options = {style:'currency', currency: 'USD', currencyFormat:'short'};
   * converter = new IntlNumberConverter(options);
   * converter.format(1234);--> $1.23K<br/>
   *
   * @example <caption>To format a value as long (default for fraction digits is based on the locale):</caption>
   * var options = {style:'decimal', decimalFormat:'long'};
   * converter = new IntlNumberConverter(options);
   * converter.format(12345);--> 12.345 thousand<br/>
   *
   * @example <caption>To format a value as long currency format:</caption>
   * var options = {style:'currency',  currency: 'USD', currencyFormat:'long'};
   * converter = new IntlNumberConverter(options);
   * converter.format(1234);--> $1.23 thousand<br/>
   *
   * @example <caption>To format a value as short with minimum fraction digits:</caption>
   * options = { style:'decimal', decimalFormat:'short',
   * minimumFractionDigits:4};
   * converter = new IntlNumberConverter(options);
   * converter.format(1234);--> 1.2340K<br/>
   *
   * @example <caption>To format a value as short with maximum fraction digits:</caption>
   * options = { style:'decimal', decimalFormat:'short',
   * maximumFractionDigits:0};
   * converter = new IntlNumberConverter(options);
   * converter.format(12345);--> 12K<br/>
   *
   * @example <caption>To format a value as long with minimum and maximum fraction digits:</caption>
   * options = { style:'decimal', decimalFormat:'long',
   * minimumFractionDigits:2, maximumFractionDigits:4};
   * converter = new IntlNumberConverter(options);
   * converter.format(12000);--> 12.00 thousand<br/>
   *
   * @example <caption>To format a value as short with minimum and maximum fraction digits:</caption>
   * options = { style:'decimal', decimalFormat:'long',
   * minimumFractionDigits:2, maximumFractionDigits:4};
   * converter = new IntlNumberConverter(options);
   * converter.format(12345678);--> 12.345 million<br/>
   *
   * @example <caption>decimal style default is standard:</caption>
   * options = { style:'decimal', decimalFormat:'standard'};
   * converter = new IntlNumberConverter(options);
   * converter.format(12345);--> 12,345<br/>
   *
   * @example <caption>decimal round UP:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'UP'};
   * converter = new IntlNumberConverter(options);
   * converter.format(0.221);--> 0.23
   * converter.parse(0.221);-->0.221 //doesn't round during parse by default<br/>
   *
   * @example <caption>decimal round DOWN:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'DOWN'};
   * converter = new IntlNumberConverter(options);
   * converter.format(0.229);--> 0.22
   * converter.parse(0.229);-->0.229 //doesn't round during parse by default<br/>
   *
   * @example <caption>decimal round CEILING:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'CEILING'};
   * converter = new IntlNumberConverter(options);
   * converter.format(0.221);--> 0.23
   * converter.parse(0.221);-->0.221 //doesn't round during parse by default<br/>
   *
   * @example <caption>decimal round FLOOR:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'FLOOR'};
   * converter = new IntlNumberConverter(options);
   * converter.format(0.229);--> 0.22
   * converter.parse(0.229);-->0.229 //doesn't round during parse by default<br/>
   *
   * @example <caption>decimal round HALF_DOWN:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'HALF_DOWN'};
   * converter = new IntlNumberConverter(options);
   * converter.format(0.225);--> 0.22
   * converter.parse(0.225);-->0.225 //doesn't round during parse by default<br/>
   *
   * @example <caption>decimal round HALF_UP:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'HALF_UP'};
   * converter = new IntlNumberConverter(options);
   * converter.format(0.225);--> 0.23
   * converter.parse(0.225);--> 0.225 //doesn't round during parse by default<br/>
   *
   * @example <caption>decimal round HALF_EVEN:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'HALF_EVEN'};
   * converter = new IntlNumberConverter(options);
   * converter.format(0.225);--> 0.22
   * converter.format(0.235);--> 0.24
   * converter.parse(0.225);--> 0.225 //doesn't round during parse by default
   * converter.parse(0.235);--> 0.235 //doesn't round during parse by default<br/>
   *
   * @example <caption>decimal round UP and roundDuringParse:</caption>
   * options = { style:'decimal', maximumFractionDigits:2,
   *             roundingMode:'UP', roundDuringParse: true};
   * converter = new IntlNumberConverter(options);
   * converter.format(0.221);--> 0.23
   * converter.parse(0.221);-->0.23<br/>
   *
   * @example <caption>decimal round DOWN and roundDuringParse:</caption>
   * options = { style:'decimal', maximumFractionDigits:2,
   *             roundingMode:'DOWN', roundDuringParse: true};
   * converter = new IntlNumberConverter(options);
   * converter.format(0.229);--> 0.22
   * converter.parse(0.229);-->0.22<br/>
   *
   * @example <caption>decimal round CEILING and roundDuringParse:</caption>
   * options = { style:'decimal', maximumFractionDigits:2,
   *             roundingMode:'CEILING', roundDuringParse: true};
   * converter = new IntlNumberConverter(options);
   * converter.format(0.221);--> 0.23
   * converter.parse(0.221);-->0.23<br/>
   *
   * @example <caption>decimal round FLOOR and roundDuringParse:</caption>
   * options = { style:'decimal', maximumFractionDigits:2,
   *             roundingMode:'FLOOR', roundDuringParse: true};
   * converter = new IntlNumberConverter(options);
   * converter.format(0.229);--> 0.22
   * converter.parse(0.229);-->0.22<br/>
   *
   * @example <caption>decimal round HALF_DOWN and roundDuringParse:</caption>
   * options = { style:'decimal', maximumFractionDigits:2,
   *             roundingMode:'HALF_DOWN', roundDuringParse: true};
   * converter = new IntlNumberConverter(options);
   * converter.format(0.225);--> 0.22
   * converter.parse(0.225);-->0.22<br/>
   *
   * @example <caption>decimal round HALF_UP and roundDuringParse:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2,
   *             roundingMode:'HALF_UP', roundDuringParse: true};
   * converter = new IntlNumberConverter(options);
   * converter.format(0.225);--> 0.23
   * converter.parse(0.225);--> 0.23<br/>
   *
   * @example <caption>decimal round HALF_EVEN and roundDuringParse:</caption>
   * options = { style:'decimal',  maximumFractionDigits:2,
   *             roundingMode:'HALF_EVEN', roundDuringParse: true};
   * converter = new IntlNumberConverter(options);
   * converter.format(0.225);--> 0.22
   * converter.format(0.235);--> 0.24
   * converter.parse(0.225);--> 0.22
   * converter.parse(0.235);--> 0.24<br/>
   *
   * @example <caption>Use custom decimal and grouping separators:</caption>
   * options = { style:'decimal', separators: {decimal: ',',  group: '.'}};
   * converter = new IntlNumberConverter(options);
   * var nb = 1234567.89;
   * converter.format(nb);--> 1.234.567,89
   * converter.parse("1.234.567,89");--> 1234567.89
   * <br/>
   *
   * @example <caption>Disable lenient parse:</caption>
   * options = { style:'decimal',  lenientParse: 'none'};
   * converter = new IntlNumberConverter(options);
   * converter.parse("abc-123.45xyz");--> Error: Unparsable number abc-123.45xyz The expected number pattern is #,##0.###
   * <br/>
   *
   * @export
   * @augments oj.NumberConverter
   * @name oj.IntlNumberConverter
   * @ojsignature [{target: "Type",
   *                value: "class IntlNumberConverter extends NumberConverter"},
   *               {target: "Type",
   *                value: "oj.IntlNumberConverter.ConverterOptions",
   *                for: "options", jsdocOverride: true}
   *              ]
   * @since 0.6.0
   */
  const IntlNumberConverter = function (options) {
    this.Init(options);
  };

  /**
   * @typedef {object} oj.IntlNumberConverter.Separators
   * @property {string=} decimal - Allows the user to provide custom decimal separators.
   * <br/>Example: { style:'decimal', separators: {decimal: ',',  group: '.'}};
   * @property {string=} group - Allows the user to provide custom group separators.
   * <br/>Example: { style:'decimal', separators: {decimal: ',',  group: '.'}};
   */

  /**
   * @typedef {object} oj.IntlNumberConverter.ConverterOptions
   * @property {('decimal'|'currency'|'percent'|'unit')=} style - sets the style of number formatting. Allowed values are "decimal"
   * (the default), "currency", "percent" or "unit". When a number is formatted as a decimal, the decimal
   * character is replaced with the most appropriate symbol for the locale. In English this is a
   * decimal point ("."), while in many locales it is a decimal comma (","). If grouping is enabled the
   * locale dependent grouping separator is also used. These symbols are also used for numbers
   * formatted as currency or a percentage, where appropriate.
   * @property {string=} currency - specifies the currency that will be used when formatting the
   * number. The value should be a ISO 4217 alphabetic currency code. If the style is set to currency,
   * it's required that the currency property also be specified. This is because there is no default
   * currency associated with the current locale. The user must always specify the currency code
   * to be shown, otherwise an error will be thrown. The current page locale
   * (returned by oj.Config.getLocale()) determines the formatting elements of the number
   * like grouping separator and decimal separator. The currency code tells us which currency to
   * display in current page locale. JET has translations for currency names.
   * <p>
   * As an example if we want to format 1000.35 EURO and the page locale is "en-US",
   * we pass {style:'currency', currency:'EUR', currencyDisplay:'symbol'} and we will get "€1,000.35"
   * If the page locale is "fr-FR", with the same options, we will get: "1 000,35 €"
   * </p>
   * @property {('byte'|'bit')=} unit - Mandatory when style is "unit". Allowed values:
   * "byte" or "bit". It is used for formatting only. It can not be used for parsing.
   * <p>
   * It is used to format digital units like 10Mb for bit unit or 10MB for byte unit.
   * There is no need to specify the scale of the unit. We automatically detect it.
   * For example 1024 is formatted as 1KB and ?1048576? as 1MB.
   * The user can also specify 'minimumFractionDigits' and  'maximumFractionDigits' to be displayed,
   * otherwise we use the locale's default max and min fraction digits.
   * </p>
   * @property {('code'|'symbol'|'name')=} currencyDisplay - if the number is using currency formatting, specifies
   * if the currency will be displayed using its "code" (as an ISO 4217 alphabetic currency code),
   * "symbol" (a localized currency symbol (e.g. $ for US dollars, £ for Great British pounds, and so
   * on), or "name" (a localized currency name. Allowed values are "code", "symbol" and "name".
   * The default is "symbol".
   * @property {('standard'|'short'|'long')=} decimalFormat -
   * specifies the decimal format length to use when style is set to "decimal".
   * Allowed values are : "standard"(default), "short" and "long". 'standard' is equivalent to not
   * specifying the 'decimalFormat' attribute, in that case the locale’s default decimal pattern
   * is used for formatting.
   * <p>
   * The user can also specify 'minimumFractionDigits' and  'maximumFractionDigits' to display.
   * When not present we use the locale's default max and min fraction digits.
   * </p>
   * <p>
   * There is no need to specify the scale; we automatically detect greatest scale that is less or
   * equal than the input number. For example  1000000 is formatted as "1M" or "1 million" and
   * 1234 is formatted, with zero fractional digits, as "1K" or " 1 thousand" for
   * short and long formats respectively. The pattern for the short and long number is locale dependent
   * and uses plural rules for the particular locale.
   * </p>
   * <p>
   * NOTE: Currently this option formats a value (e.g., 2000 -> 2K), but it does not parse a value
   * (e.g., 2K -> 2000), so it can only be used
   * in a readOnly EditableValue because readOnly EditableValue components do not call
   * the converter's parse function.
   * </p>
   * @property {('standard'|'short'|'long')=} currencyFormat -
   * specifies the currency format length to use when style is set to "currency".
   * Allowed values are : "standard"(default), "short" and "long". 'standard' is equivalent to not
   * specifying the 'currencyFormat' attribute, in that case the locale's default currency pattern
   * is used for formatting.
   * Similar to decimalFormat, currencyFormat can only be used for formatting. It can not be used for parsing.
   * <p>
   * The user can also specify 'minimumFractionDigits' and  'maximumFractionDigits' to display.
   * When not present we use the locale's default max and min fraction digits.
   * </p>
   * <p>
   * There is no need to specify the scale; we automatically detect greatest scale that is less or
   * equal than the input number. For example  1000000 is formatted as "$1M" or "1 million dollar" and
   * 1000 is formatted as "$1K" or " 1 thousand dollar" for short and long formats respectively.
   * The pattern for the short and long number is locale dependent and uses plural rules for the particular locale.
   * </p>
   * @property {number=} minimumIntegerDigits - sets the minimum number of digits before the
   * decimal place (known as integer digits). The number is padded with leading zeros if it would not
   * otherwise have enough digits. The value must be an integer between 1 and 21.
   * @property {number=} minimumFractionDigits - similar to 'minimumIntegerDigits', except it
   * deals with the digits after the decimal place (fractional digits). It must be an integer between
   * 0 and 20. The fractional digits will be padded with trailing zeros if they are less than the minimum.
   * @property {number=} maximumFractionDigits - follows the same rules as 'minimumFractionDigits',
   * but sets the maximum number of fractional digits that are allowed. The value will be rounded if
   * there are more digits than the maximum specified.
   * @property {boolean=} useGrouping - when the value is truthy, the locale dependent grouping
   * separator is used when formatting the number. This is often known as the thousands separator,
   * although it is up to the locale where it is placed. The ‘useGrouping’ is set to true by default.
   * @property {string=} pattern an optional localized pattern, where the characters used in
   * pattern are as defined in the Unicode CLDR for numbers, percent or currency formats. When present
   * this will override the other "options". <p>
   *
   * &nbsp;&nbsp;- When the pattern represents a currency style the 'currency' property is required to
   * be set, as not setting this will throw an error. The 'currencyDisplay' is optional. <br/>Example:
   * {pattern: '¤#,##0', currency: 'USD'}. <p>
   *
   * &nbsp;&nbsp;- It's not mandatory for the pattern to have the special character '¤' (currency sign)
   * be present. When not present, values are treated as a currency value, but are not formatted to
   * show the currency symbol. <br/>Example: {pattern: '#,##0', currency: 'USD'} <p>
   *
   * &nbsp;&nbsp;- When the pattern represents a percent style, the percent special character ('%') needs to be
   * explicitly specified in the pattern, e.g., {pattern: "#,##0%"}. If the pattern does not contain
   * the percent character it's treated as a decimal pattern, unless the style is set to percent,
   * in which case the value is treated as a percent value, but not formatted to show the percent symbol.
   * <br/>Example: {style: 'percent', pattern: "#,##0"}. <p>
   *
   * &nbsp;&nbsp;- A decimal pattern or exponent pattern is specified in the pattern using the CLDR
   * conventions. <br/>Example: {pattern: "#,##0.00"} or {pattern: "0.##E0"}. <p>
   *
   * NOTE: 'pattern' is provided for backwards compatibility with existing apps that may want the
   * convenience of specifying an explicit format mask. Setting a pattern will override the default
   * locale specific format. <br/>
   * @ojdeprecated {target: 'property', for:'pattern', since: '11.0.0', description: 'Use other options instead like style'}
   *
   * @property {('HALF_UP'|'HALF_DOWN'|'HALF_EVEN'|'UP'|'DOWN'|'CEILING'|'FLOOR')=} roundingMode - specifies the rounding behavior.
   * This follows the Java.Math.RoundingMode behavior. https://docs.oracle.com/javase/7/docs/api/java/math/RoundingMode.html
   *
   * @property {boolean=} roundDuringParse - Specifies whether or not to round during
   * parse. Defaults to false; the number converter rounds during format but not during parse.
   *
   * @property {oj.IntlNumberConverter.Separators=} separators - An object with 2 fields: 'decimal' and 'group'.
   * It allows the user to provide custom decimal and grouping separators. It is accepted for both
   * format and parse methods.
   * <br/>
   *
   * @property {('full'|'none')=} lenientParse - The lenientParse property can be used to enable or disable leninet parsing.
   *  Allowed values: "full" (default), "none".
   * <p style='padding-left: 5px;'>
   * By default the lenient parse is enabled and the leniency rules descibed above will be used. When lenientParse is
   * set to "none" the lenient parse is disabled and the user input must match the expected input otherwise an exception will
   * be thrown.<br/><br/>
   */
  oj$1.Object.createSubclass(IntlNumberConverter, NumberConverter, 'oj.IntlNumberConverter');

  /**
   * Initializes the number converter instance with the set options.
   * @param {Object=} options an object literal used to provide an optional information to
   * initialize the converter.<p>
   * @export
   * @ignore
   * @memberof oj.IntlNumberConverter
   */
  IntlNumberConverter.prototype.Init = function (options) {
    IntlNumberConverter.superclass.Init.call(this, options);
  };

  // Returns the wrapped number converter implementation object.
  // FA is overriding our ojs/ojconverter-datetime bundle and needs to define this function
  // or else they will get an error.
  // Do not rename. TODO: Ideally we will remove the need for them to have to define this function.
  IntlNumberConverter.prototype._getWrapped = function () {
    if (!this._wrapped) {
      this._wrapped = OraNumberConverter.getInstance();
    }

    return this._wrapped;
  };

  /**
   * Formats a Number and returns the formatted string, using the options this converter was
   * initialized with.
   *
   * @param {number} value to be formatted for display
   * @return {string} the localized and formatted value suitable for display. When the value is
   * formatted as a percent it's multiplied by 100.
   *
   * @throws {Error} a ConverterError both when formatting fails, or if the options provided during
   * initialization cannot be resolved correctly.
   * @memberof oj.IntlNumberConverter
   * @export
   * @instance
   * @method format
   */
  IntlNumberConverter.prototype.format = function (value) {
    // undefined, null and empty string values all return null. If value is NaN then return "".
    if (
      value == null ||
      (typeof value === 'string' && oj$1.StringUtils.trim('' + value).length === 0) ||
      (typeof value === 'number' && isNaN(value))
    ) {
      return '';
    }

    var locale = Config.getLocale();
    var localeElements = LocaleData.__getBundle();
    var resolvedOptions = this.resolvedOptions();
    var converterError;
    var formatValue;

    try {
      formatValue = this._getWrapped().format(value, localeElements, resolvedOptions, locale);
    } catch (e) {
      converterError = this._processConverterError(e, value);
      throw converterError;
    }
    // The base converter returns NaN if the value is a string. This
    // is expected behavior and is also the same behavior of the
    // browser's Intl.NumberFormat. So this converter takes that and
    // logs an error. NOTE: it is
    // an application error if the value option is not a valid number.
    if (formatValue === 'NaN') {
      var summary = Translations.getTranslatedString(
        'oj-converter.number.invalidNumberFormat.summary',
        { value: value }
      );
      var detail = Translations.getTranslatedString('oj-converter.number.invalidNumberFormat.detail');
      Logger.error(summary + ' ' + detail);
    }
    return formatValue;
  };

  /**
   * In general, returns hint for the converter. For a IntlNumberConverter returned value is always null.
   *
   * @return {null} a hint describing the format the value is expected to be in.
   * @memberof oj.IntlNumberConverter
   * @export
   * @instance
   * @method getHint
   */
  IntlNumberConverter.prototype.getHint = function () {
    // UX does not want any hint for numbers.
    // return oj.Translations.getTranslatedString("oj-converter.hint.summary",
    //        {'exampleValue': this._getHintValue()});
    // return IntlNumberConverter.superclass.getHint.call(this); // this asserts, and we don't want that.
    return null;
  };

  /**
   * Returns the options called with converter initialization.
   * @return {Object} an object of options.
   * @ojsignature {target:"Type", for: "returns",
   *    value: "oj.IntlNumberConverter.ConverterOptions"}
   * @memberof oj.IntlNumberConverter
   * @export
   * @instance
   * @method getOptions
   * @ojdeprecated {since: '11.0.0', description: 'Use resolvedOptions.'}
   */
  IntlNumberConverter.prototype.getOptions = function () {
    return IntlNumberConverter.superclass.getOptions.call(this);
  };

  /**
   * Parses a string value to return a Number, using the options this converter was initialized with.
   *
   * @param {string} value to parse
   * @return {number|null} the parsed number or null if the value was null or an empty string. When
   * the value is parsed as a percent its 1/100th part is returned.
   *
   * @throws {Error} a ConverterError both when parsing fails, or if the options provided during
   * initialization cannot be resolved correctly.
   * @memberof oj.IntlNumberConverter
   * @export
   * @instance
   * @method parse
   */
  IntlNumberConverter.prototype.parse = function (value) {
    var converterError;
    var locale;
    var localeElements;
    var resolvedOptions;

    // null and empty string values are ignored and not parsed. It
    // undefined.
    if (value == null || value === '') {
      // check for undefined, null and ""
      return null;
    }

    locale = Config.getLocale();
    localeElements = LocaleData.__getBundle();
    resolvedOptions = this.resolvedOptions();

    try {
      // we want to trim the value for leading spaces before and after
      return this._getWrapped().parse(
        oj$1.StringUtils.trim(value),
        localeElements,
        resolvedOptions,
        locale
      );
    } catch (e) {
      converterError = this._processConverterError(e, value);
      throw converterError;
    }
  };

  /**
   * Returns an object literal with properties reflecting the number formatting options computed based
   * on the options parameter. If options (or pattern) is not provided, the properties will be derived
   * from the locale defaults.
   *
   * @return {Object} An object literal containing the resolved values for the following options. Some
   * of these properties may not be present, indicating that the corresponding components will not be
   * represented in the formatted output.
   * <ul>
   * <li><b>locale</b>: a String value with the language tag of the locale whose localization is used
   * for formatting.</li>
   * <li><b>style</b>: a String value. One of the allowed values - "decimal", "currency" or "percent".</li>
   * <li><b>currency</b>: a String value.  an ISO 4217 alphabetic currency code. May be present only
   *  when style is currency.</li>
   * <li><b>currencyDisplay</b>: a String value. One of the allowed values - "code", "symbol", or
   *  "name".</li>
   * <li><b>numberingSystem</b>: a String value of the numbering system used. E.g. latn</li>
   * <li><b>minimumIntegerDigits</b>: a non-negative integer Number value indicating the minimum
   *  integer digits to be used.</li>
   * <li><b>minimumFractionDigits</b>: a non-negative integer Number value indicating the minimum
   *  fraction digits to be used.</li>
   * <li><b>maximumFractionDigits</b>: a non-negative integer Number value indicating the maximum
   *  fraction digits to be used.</li>
   * <li><b>useGrouping</b>: a Boolean value indicating whether a grouping separator is used.</li>
   * <li><b>lenientParse</b>: specifies if lenient parse is enabled or disabled. Allowed values: "full", "none".
   * default is "full" which means lenient parse is enabled.</li>
   * <li><b>separators</b>: - An object with 2 fields: 'decimal' and 'group'.</li>
   *
   * @throws a ConverterError when the options that the converter was initialized with are invalid.
   * @ojsignature {target:"Type", for: "returns",
   *    value: "oj.IntlNumberConverter.ConverterOptions"}
   * @memberof oj.IntlNumberConverter
   * @export
   * @instance
   * @method resolvedOptions
   */
  IntlNumberConverter.prototype.resolvedOptions = function () {
    var converterError;
    var locale = Config.getLocale();
    var localeElements;

    // options are resolved and cached for the current locale. when locale changes resolvedOptions
    // is reevaluated as it contains locale specific info.
    if (locale !== this._locale || !this._resolvedOptions) {
      // leave this line unchanged so that we can test that LocaleData can also be accessed from the oj namespace.
      localeElements = LocaleData.__getBundle();
      try {
        if (!localeElements) {
          Logger.error('locale bundle for the current locale %s is unavailable', locale);
          return {};
        }

        // cache if successfully resolved
        this._resolvedOptions = this._getWrapped().resolvedOptions(
          localeElements,
          this.getOptions(),
          locale
        );
        this._locale = locale;
      } catch (e) {
        converterError = this._processConverterError(e);
        throw converterError;
      }
    }

    return this._resolvedOptions;
  };

  /**
   * Processes the error returned by the converter implementation and throws a ConverterError
   * instance.
   *
   * FA is overriding our ojs/ojconverter-datetime bundle and needs to define this function
   * or else they will get an error.
   * Do not rename. TODO: Ideally we will remove the need for them to have to define this function.
   * @param {Error} e
   * @param {String|string|Number|number|Object=} value
   * @throws an instance of ConverterError
   * @private
   */
  IntlNumberConverter.prototype._processConverterError = function (e, value) {
    var converterError;
    var errorInfo = e.errorInfo;
    var detail;
    var resourceKey;
    var summary;

    if (errorInfo) {
      var errorCode = errorInfo.errorCode;
      var parameterMap = errorInfo.parameterMap;
      oj$1.Assert.assertObject(parameterMap);

      switch (errorCode) {
        case 'optionTypesMismatch':
        case 'optionTypeInvalid':
          converterError = __ConverterUtilsI18n.IntlConverterUtils.__getConverterOptionError(
            errorCode,
            parameterMap
          );
          break;
        case 'optionOutOfRange':
          converterError = __ConverterUtilsI18n.IntlConverterUtils.__getConverterOptionError(
            errorCode,
            parameterMap
          );
          break;
        case 'optionValueInvalid':
          converterError = __ConverterUtilsI18n.IntlConverterUtils.__getConverterOptionError(
            errorCode,
            parameterMap
          );
          break;
        case 'decimalFormatMismatch':
          // The '{value}' does not match the expected number format
          resourceKey = 'oj-converter.number.decimalFormatMismatch.summary';
          break;
        case 'currencyFormatMismatch':
          // The {value} does not match the expected currency format
          resourceKey = 'oj-converter.number.currencyFormatMismatch.summary';
          break;
        case 'percentFormatMismatch':
          // The {value} does not match the expected currency format
          resourceKey = 'oj-converter.number.percentFormatMismatch.summary';
          break;
        case 'unsupportedParseFormat':
          // TODO: We'll be able to remove this exception when this bug is fixed post V1.1:
          //  - implement parse() for short number converter
          //
          summary = Translations.getTranslatedString(
            'oj-converter.number.shortLongUnsupportedParse.summary'
          );
          detail = Translations.getTranslatedString(
            'oj-converter.number.shortLongUnsupportedParse.detail'
          );
          converterError = new ojvalidationError.ConverterError(summary, detail);
          break;
        default:
          break;
      }

      // The formatMismatch errors need a hint
      if (resourceKey) {
        summary = Translations.getTranslatedString(resourceKey, {
          value: value || parameterMap.value,
          format: parameterMap.format
        });

        // _getHintValue is smart. It uses the converter's 'format' function
        //  to get the example format to show the end user.
        detail = Translations.getTranslatedString('oj-converter.hint.detail', {
          exampleValue: this._getHintValue()
        });

        converterError = new ojvalidationError.ConverterError(summary, detail);
      }
    }

    if (!converterError) {
      // An error we are unfamiliar with. Get the message and set as detail
      summary = e.message; // TODO: What should the summary be when it's missing??
      detail = e.message;
      converterError = new ojvalidationError.ConverterError(summary, detail);
    }

    return converterError;
  };

  // Returns the hint value. It uses the converter's format function to return a formatted
  // example. For example, if the converter's style is decimal and decimalFormat is short,
  // this.format(12345.98765) returns 12K, and we show 12K in the error message as an example
  // of what they should type in.
  // FA is overriding our ojs/ojconverter-datetime bundle and needs to define this function
  // or else they will get an error.
  // Do not rename. TODO: Ideally we will remove the need for them to have to define this function.
  IntlNumberConverter.prototype._getHintValue = function () {
    var value = '';
    try {
      // use .format to get a real example to show the user what format they can type in to the field.
      value = this.format(12345.98765);
    } catch (e) {
      if (e instanceof ojvalidationError.ConverterError) {
        // Something went wrong and we don't have a way to retrieve a valid value.
        value = '';
        Logger.error('error retrieving hint value in format');
      }
    }

    // returns the formatted value of 12345.98765
    return value;
  };

  exports.IntlNumberConverter = IntlNumberConverter;
  exports.NumberConverter = NumberConverter;

  Object.defineProperty(exports, '__esModule', { value: true });

});
