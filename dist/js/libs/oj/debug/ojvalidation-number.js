/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojL10n!ojtranslations/nls/localeElements', 'ojs/ojvalidation-base'], function(oj, $, ojld)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * oj.NumberConverter Contract. 
 */

/**
 * @export
 * @constructor
 * @augments oj.Converter 
 * @name oj.NumberConverter
 * @since 0.6
 */
oj.NumberConverter = function()
{
  this.Init();
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.NumberConverter, oj.Converter, "oj.NumberConverter");

/**
 * Initializes the number converter instance with the set options.
 * @param {Object=} options an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @export
 */
oj.NumberConverter.prototype.Init = function(options) 
{
  oj.NumberConverter.superclass.Init.call(this, options);
};

/**
 * Formats the Number value using the options provided and returs a String value.
 * 
 * @param {Number} value the value to be formatted for display
 * @return {(String|null)} the localized and formatted value suitable for display
 * @throws {Error} a ConverterError if formatting fails.
 * @export
 */
oj.NumberConverter.prototype.format = function (value) 
{
  return oj.NumberConverter.superclass.format.call(this, value);
};

/**
 * Parses the value using the options provided and returns a Number object.
 * 
 * @param {String} value to parse
 * @return {Number} the parsed value as a Number object.
 * @throws {Error} a ConverterError if parsing fails
 * @export
 */
oj.NumberConverter.prototype.parse = function (value) 
{
  return oj.NumberConverter.superclass.parse.call(this, value);
};

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Constructs a NumberRangeValidator that ensures the value provided is within a given range
 * @param {Object=} options an object literal used to provide the following properties
 * @param {number=} options.min - the minimum number value of the entered value.
 * @param {number=} options.max - the maximum number value of the entered value.
 * @param {Object=} options.hint - an optional object literal of hints to be used.
 * <p>The hint strings (e.g., hint.min) are  passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p> 
 * @param {string=} options.hint.max - a hint used to indicate the allowed maximum. When not present, 
 * the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.hint.max</code>.<p>
\\ 
 * Tokens: <br/>
 * {max} - the maximum<p>
 * Usage: <br/>
 * Enter a number less than or equal to {max}
 * @param {string=} options.hint.min - a hint used to indicate the allowed minimum. When not present, 
 * the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.hint.min</code>.<p>
 * Tokens: <br/>
 * {min} the minimum <p>
 * Usage: <br/>
 * Enter a number greater than or equal to {min}</li>
 * @param {string=} options.hint.inRange - a hint used to indicate the allowed range. When not 
 * present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.hint.inRange</code>.<p>
 * Tokens:<br/>
 * {min} the minimum<br/>
 * {max} the maximum<p>
 * Usage: <br/>
 * Enter a number between {min} and {max}
 * @param {string=} options.hint.exact - a hint used to indicate the allowed value. 
 * This is used when min and max are non-null and are equal to each other.  
 * When not present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.hint.exact</code>.<p>
 * Tokens:<br/>
 * {num} the number allowed<br/>
 * Usage: <br/>
 * Enter the number {num}
 * @since 3.0.0 
 * @param {Object=} options.messageDetail - an optional object literal of custom error messages to 
 * be used.
 * <p>The messageDetail strings (e.g., messageDetail.rangeUnderflow) are  passed as the 'pattern' 
 * parameter to [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p> 
 * @param {string=} options.messageDetail.rangeUnderflow - the detail error message to be used when 
 * input value is less than the set minimum value. When not present, the default detail message is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.messageDetail.rangeUnderflow</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {min} - the minimum allowed value<p>
 * Usage: <br/>
 * The number must be greater than or equal to {min}.
 * @param {string=} options.messageDetail.rangeOverflow - the detail error message to be used when 
 * input value exceeds the maximum value set. When not present, the default detail message is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.messageDetail.rangeOverflow</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {max} - the maximum allowed value<p>
 * Usage: <br/>
 * The number must be less than or equal to {max}.   
 * @param {string=} options.messageDetail.exact - the detail error message to be used when the
 * input value is not between min and max when min and max are both non-null and equal.
 *  When not present, the default detail message is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.messageDetail.exact</code>.<p>
 * Tokens:<br/>
 * {num} - the allowed value<p>
 * Usage: <br/>
 * The number must be {num}.
 * @since 3.0.0 
 * @param {Object=} options.messageSummary - optional object literal of custom error summary message 
 * to be used. 
 * @param {string=} options.messageSummary.rangeUnderflow - the summary of the error message when 
 * input value is less than the set minimum value. When not present, the default message summary is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.messageSummary.rangeUnderflow</code>.
 * @param {string=} options.messageSummary.rangeOverflow - the summary of the error message when 
 * input value exceeds the maximum value set.  When not present, the default message summary is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.messageSummary.rangeOverflow</code>.
 * @export
 * @constructor
 * @since 0.7
 * 
 */
oj.NumberRangeValidator = function _NumberRangeValidator(options)
{
  this.Init(options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.NumberRangeValidator, oj.Validator, "oj.NumberRangeValidator");

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @memberof oj.NumberRangeValidator
 * @instance
 * @export
 */
oj.NumberRangeValidator.prototype.Init = function (options)
{
  oj.NumberRangeValidator.superclass.Init.call(this);

  if (options)
  {
    this._min = options["min"];
    this._max = options["max"];
    this._converter = oj.IntlConverterUtils.getConverterInstance(options['converter']);
    this._hint = options['hint'] || {};
    this._customMessageSummary = options['messageSummary'] || {};
    this._customMessageDetail = options['messageDetail'] || {};
  }
};

/**
 * Validates the minimum + maximum conditions
 *
 * @param {string|number} value that is being validated
 * @returns {string} original if validation was successful
 *
 * @throws {Error} when value is out of range
 * @memberof oj.NumberRangeValidator
 * @instance
 * @export
 */
oj.NumberRangeValidator.prototype.validate = function (value)
{
  var string = value ? value.toString() : value;
  var numberValue = parseFloat(string); 
  var customMessageSummary = this._customMessageSummary;
  var customMessageDetail = this._customMessageDetail;
  var messageDetailRangeOverflow = customMessageDetail["rangeOverflow"]; 
  var messageDetailRangeUnderflow = customMessageDetail["rangeUnderflow"]; 
  var messageDetailExact = customMessageDetail["exact"];
  var messageSummaryRangeOverflow = customMessageSummary["rangeOverflow"];
  var messageSummaryRangeUnderflow = customMessageSummary["rangeUnderflow"];
  var min = this._min !== undefined ? parseFloat(this._min) : null; 
  var max = this._max !== undefined ? parseFloat(this._max) : null; 
  var minStr = min && this._converter ? this._converter['format'](min) : min;
  var maxStr = max && this._converter ? this._converter['format'](max) : max;
  var summary = ""; 
  var detail = ""; 
  var params = null;
  var translations = oj.Translations;
  
  if(value === null) 
  {
    // request to not throw an error when value being passed is of null
    return value;
  }
  
  if (min !== null && max !== null)
  {
    //range
    if ((numberValue >= min && numberValue <= max) || min > max)
    {
      return string;
    }
  }
  else 
  {
    //only min
    if (min !== null)
    {
      if (numberValue >= min)
      {
        return string;
      }
	  
    }
    //max only or no min or max
    else 
    {
      if (max === null || numberValue <= max)
      {
        return string;
      }
    }
  }
  
  // if we haven't returned with an OK, then we need to throw a ValidatorError
  // 
  // First check if we have both a max and a min and if they are equal. If so the message will
  // be the messageDetail.exact message, like "Enter the number 1"
  if (max !== null && min !== null && min === max)
  {
    params = {"value": value, "num": maxStr};
    detail = messageDetailExact ? 
      translations.applyParameters(messageDetailExact, params) : 
      translations.getTranslatedString('oj-validator.range.number.messageDetail.exact', params);
    // if number is greater than max, the summary may say "The number is too high"
    if (numberValue > max)
    {
      summary = messageSummaryRangeOverflow ? 
        messageSummaryRangeOverflow : 
        translations.getTranslatedString('oj-validator.range.number.messageSummary.rangeOverflow');            
    } 
    // if number is less than min, the summary may say "The number is too low"
    else if (numberValue < min)
    {
      summary = messageSummaryRangeOverflow ? 
        messageSummaryRangeUnderflow : 
        translations.getTranslatedString('oj-validator.range.number.messageSummary.rangeUnderflow');
    }
  }
  // Next check if we have a max, and the number we are validating is greater than the max
  // throw an error, 
  // like "The number is too high." and "The number must be less than or equal to {max}"
  else if (max !== null && numberValue > max)
  {
	  params = {"value": value, "max": maxStr};
    summary = messageSummaryRangeOverflow ?
      messageSummaryRangeOverflow : 
      translations.getTranslatedString('oj-validator.range.number.messageSummary.rangeOverflow');
    detail = messageDetailRangeOverflow ?
      translations.applyParameters(messageDetailRangeOverflow, params) : 
      translations.getTranslatedString('oj-validator.range.number.messageDetail.rangeOverflow', params);
  }
  // 
  // Else check if we have a min, and the number we are validating is less than the min
  // throw an error, 
  // like "The number is too low." and "The number must be greater than or equal to {min}"
  else if (min !== null && numberValue < min)
  {
 	  params = {"value": value, "min": minStr};
    summary = messageSummaryRangeUnderflow ? 
      messageSummaryRangeUnderflow : 
      translations.getTranslatedString('oj-validator.range.number.messageSummary.rangeUnderflow');
    detail = messageDetailRangeUnderflow ? 
      translations.applyParameters(messageDetailRangeUnderflow, params) : 
      translations.getTranslatedString('oj-validator.range.number.messageDetail.rangeUnderflow', params);   
  }

  throw new oj.ValidatorError(summary, detail);
};

/**
 * @returns {String|null} a hint message or null if no hint is available in the options.
 * A hint message may be like "Enter a value between {min} and {max}"
 * or "Enter a number greater than or equal to {min}"
 * @memberof oj.NumberRangeValidator
 * @instance
 * @export
 */
oj.NumberRangeValidator.prototype.getHint = function ()
{
  var hint = null;
  var hints = this._hint; 
  var hintInRange = hints["inRange"];
  var hintExact = hints["exact"];
  var hintMinimum = hints["min"];
  var hintMaximum = hints["max"];
  var translations = oj.Translations;
  var min = this._min !== undefined ? parseFloat(this._min) : null; 
  var max = this._max !== undefined ? parseFloat(this._max) : null;
  var minStr = min && this._converter ? this._converter['format'](min) : min;
  var maxStr = max && this._converter ? this._converter['format'](max) : max;
	 
  // if both min and max are specified, the hint may say something like "Enter a value
  // between {min} and {max}".
  if (min !== null && max !== null) 
  {
    if (min !== max)
    {
      // if hintInRange is specified (validator's hint.inRange option is set), 
      // use that string, else use the default.
      hint = hintInRange ?
              translations.applyParameters(hintInRange, {"min": minStr, "max": maxStr}) : 
              translations.getTranslatedString('oj-validator.range.number.hint.inRange', 
                {"min": minStr, "max": maxStr});
    }
    else
    {
      // if hintExact is specified (validator's hint.exact option is set), 
      // use that string, else use the default.
      hint = hintExact ?
              translations.applyParameters(hintExact, {"num": minStr}) : 
              translations.getTranslatedString('oj-validator.range.number.hint.exact', 
                {"num": minStr});
    }
  }
  // else if min is specified, the hint may say something like "Enter a value
  // greater than or equal to {min}".
  else if (min !== null)
  {
    // if hintMinimum is specified (validator's hint.min option is set), 
    // use that string, else use the default.
    hint = hintMinimum ? 
             translations.applyParameters(hintMinimum, {"min": minStr}) :
	           translations.getTranslatedString('oj-validator.range.number.hint.min', {"min": minStr});
  }
  // else if max is specified, the hint may say something like "Enter a value
  // less than or equal to {max}".
  else if (max !== null)
  {
    // if hintMaximum is specified (validator's hint.max option is set), 
    // use that string, else use the default.
    hint = hintMaximum ?  
            translations.applyParameters(hintMaximum, {"max": maxStr}) :
            translations.getTranslatedString('oj-validator.range.number.hint.max', {"max": maxStr});
  }

  return hint;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*global OraNumberConverter:true*/
/**
 * @export
 * Placeholder here as closure compiler objects to export annotation outside of top level
 */

/**
 * @constructor
 * @classdesc Constructs an immutable instance and initializes it with the options provided. When initialized 
 * with no options, the default options for the current locale are assumed. The converters by 
 * default use the current page locale (returned by oj.Config.getLocale()). There are several ways 
 * to initialize the converter.
 * <p>
 * <ul>
 * <li>Using options defined by the ECMA 402 Specification, these would be the properties style, 
 * currency, currencyDisplay, minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, 
 * useGrouping. NOTE: minimumSignificantDigits and maximumSignificantDigits are not supported.</li>
 * <li>Using a custom decimal, currency or percent format pattern. specified using the 'pattern' property</li>
 * <li>Using the decimalFormat option to define a compact pattern, such as "1M" and "1 million".</li>
 * <li>Using the roundingMode and roundDuringParse options to round the number HALF_UP, HALF_DOWN, or HALF_EVEN.</li>
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
 * (the default), "currency" or "percent". When a number is formatted as a decimal, the decimal 
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
 * @property {string=} options.currencyDisplay - if the number is using currency formatting, specifies 
 * if the currency will be displayed using its "code" (as an ISO 4217 alphabetic currency code), 
 * "symbol" (a localized currency symbol (e.g. $ for US dollars, £ for Great British pounds, and so 
 * on), or "name" (a localized currency name. Allowed values are "code", "symbol" and "name". 
 * The default is "symbol".
 * @property {string=} options.decimalFormat -
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
 * although it is up to the locale where it is placed. The ‘useGrouping’ is set to true by default.
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
 * conventions. <br/>Example: {pattern: "#,##0.00"} or {pattern: "0.##E+0"}. <p>
 * 
 * NOTE: 'pattern' is provided for backwards compatibility with existing apps that may want the 
 * convenience of specifying an explicit format mask. Setting a pattern will override the default 
 * locale specific format. <br/>
 * 
 * @property {string=} options.roundingMode - specifies the rounding behavior. 
 * This follows the Java.Math.RoundingMode behavior.
 * Currently we support the options: HALF_UP, HALF_DOWN, and HALF_EVEN 
 * 
 * @property {boolean=} options.roundDuringParse - Specifies whether or not to round during
 * parse. Defaults to false; the number converter rounds during format but not during parse.
 * 
 * @property {Object=} options.separators - An object with 2 fields: 'decimal' and 'group'.
 * It allows the user to provide custom decimal and grouping separators. It is accepted for both
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
 * var converterFactory = oj.Validation.converterFactory("number");
 * var options = {style: "currency", currency: "USD", minimumIntegerDigits: 2};
 * converter = converterFactory.createConverter(options);
 * converter.format(9); --> "$09.00" if page locale is 'en-US'
 * converter.format(9); --> "09,00 $US" if page locale is 'fr-FR'<br/>
 * 
 * @example <caption>A number converter for percent values using a custom (CLDR) pattern</caption>
 * var converterFactory = oj.Validation.converterFactory("number");
 * var options = {pattern: '#,##0%'};
 * converter = converterFactory.createConverter(options);<br/>
 * 
 * @example <caption>To parse a value as percent but format it without displaying the percent character</caption>
 * var options = {style: 'percent', pattern: '#,##0'};<br/>
 * 
 * @example <caption>To parse a value as currency using a custom (CLDR) pattern</caption>
 * var options = {pattern: '¤#,##0', currency: 'USD'};
 * 
 * @example <caption>The following decimalFormat examples are in en locale.
 * To format a value as short (default for fraction digits is based on the locale)</caption>
 * var options = {style:’decimal’, decimalFormat:’short’};
 * converter = converterFactory.createConverter(options);
 * converter.format(12345);--> 12.354K<br/>
 * 
 * @example <caption>To format a value as long (default for fraction digits is based on the locale):</caption>
 * var options = {style:’decimal’, decimalFormat:’long’};
 * converter = converterFactory.createConverter(options);
 * converter.format(12345);--> 12.345 thousand<br/>
 * 
 * @example <caption>To format a value as short with minimum fraction digits:</caption>
 * options = { style:’decimal’, decimalFormat:’short’, 
 * minimumFractionDigits:4};
 * converter = converterFactory.createConverter(options);
 * converter.format(1234);--> 1.2340K<br/>
 * 
 * @example <caption>To format a value as short with maximum fraction digits:</caption>
 * options = { style:’decimal’, decimalFormat:’short’, 
 * maximumFractionDigits:0};
 * converter = converterFactory.createConverter(options);
 * converter.format(12345);--> 12K<br/>
 * 
 * @example <caption>To format a value as long with minimum and maximum fraction digits:</caption>
 * options = { style:’decimal’, decimalFormat:’long', 
 * minimumFractionDigits:2, maximumFractionDigits:4};
 * converter = converterFactory.createConverter(options);
 * converter.format(12000);--> 12.00 thousand<br/>
 * 
 * @example <caption>To format a value as short with minimum and maximum fraction digits:</caption>
 * options = { style:’decimal’, decimalFormat:’long', 
 * minimumFractionDigits:2, maximumFractionDigits:4};
 * converter = converterFactory.createConverter(options);
 * converter.format(12345678);--> 12.345 million<br/>
 * 
 * @example <caption>decimal style default is standard:</caption>
 * options = { style:’decimal’, decimalFormat:’standard’}; 
 * converter = converterFactory.createConverter(options);
 * converter.format(12345);--> 12,345<br/>
 * 
 * @example <caption>decimal round HALF_DOWN:</caption>
 * options = { style:’decimal’,  maximumFractionDigits:2, roundingMode:'HALF_DOWN'}; 
 * converter = converterFactory.createConverter(options);
 * converter.format(0.225);--> 0.22
 * converter.parse(0.225);-->0.225 //doesn't round during parse by default<br/>
 * 
 * @example <caption>decimal round HALF_UP:</caption>
 * options = { style:’decimal’,  maximumFractionDigits:2, roundingMode:'HALF_UP'}; 
 * converter = converterFactory.createConverter(options);
 * converter.format(0.225);--> 0.23
 * converter.parse(0.225);--> 0.225 //doesn't round during parse by default<br/>
 * 
 * @example <caption>decimal round HALF_EVEN:</caption>
 * options = { style:’decimal’,  maximumFractionDigits:2, roundingMode:'HALF_EVEN'}; 
 * converter = converterFactory.createConverter(options);
 * converter.format(0.225);--> 0.22
 * converter.format(0.235);--> 0.24
 * converter.parse(0.225);--> 0.225 //doesn't round during parse by default
 * converter.parse(0.235);--> 0.235 //doesn't round during parse by default<br/>
 * 
 * @example <caption>decimal round HALF_DOWN and roundDuringParse:</caption>
 * options = { style:’decimal’, maximumFractionDigits:2, 
 *             roundingMode:'HALF_DOWN', roundDuringParse: true}; 
 * converter = converterFactory.createConverter(options);
 * converter.format(0.225);--> 0.22
 * converter.parse(0.225);-->0.22<br/>
 * 
 * @example <caption>decimal round HALF_UP and roundDuringParse:</caption>
 * options = { style:’decimal’,  maximumFractionDigits:2, 
 *             roundingMode:'HALF_UP', roundDuringParse: true}; 
 * converter = converterFactory.createConverter(options);
 * converter.format(0.225);--> 0.23
 * converter.parse(0.225);--> 0.23<br/>
 * 
 * @example <caption>decimal round HALF_EVEN and roundDuringParse:</caption>
 * options = { style:’decimal’,  maximumFractionDigits:2, 
 *             roundingMode:'HALF_EVEN', roundDuringParse: true}; 
 * converter = converterFactory.createConverter(options);
 * converter.format(0.225);--> 0.22
 * converter.format(0.235);--> 0.24
 * converter.parse(0.225);--> 0.22
 * converter.parse(0.235);--> 0.24<br/>
 *
 * @example <caption>Use custom decimal and grouping separators:</caption>
 * options = { style:'decimal', separators: {decimal: ',',  group: '.'}};
 * converter = converterFactory.createConverter(options);
 * var nb = 1234567.89; 
 * converter.format(nb);--> 1.234.567,89
 * converter.parse("1.234.567,89");--> 1234567.89
 * <br/>
 *
 * @example <caption>Disable lenient parse:</caption>
 * options = { style:'decimal',  lenientParse: 'none'}; 
 * converter = converterFactory.createConverter(options);
 * converter.parse("abc-123.45xyz");--> Error: Unparsable number abc-123.45xyz The expected number pattern is #,##0.###
 * <br/>
 * 
 * @export
 * @augments oj.NumberConverter 
 * @name oj.IntlNumberConverter
 * @since 0.6
 */
oj.IntlNumberConverter = function(options)
{
  this.Init(options);
};

oj.Object.createSubclass(oj.IntlNumberConverter, oj.NumberConverter, "oj.IntlNumberConverter");

/**
 * Initializes the number converter instance with the set options.
 * @param {Object=} options an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @export
 */
oj.IntlNumberConverter.prototype.Init = function(options) 
{
  oj.IntlNumberConverter.superclass.Init.call(this, options);
};


// Returns the wrapped number converter implementation object.
oj.IntlNumberConverter.prototype._getWrapped = function ()
{
  if (!this._wrapped)
  {
    this._wrapped = OraNumberConverter.getInstance();
  }
  
  return this._wrapped;
};

/**
 * Formats a Number and returns the formatted string, using the options this converter was 
 * initialized with.
 * 
 * @param {Number|number} value to be formatted for display
 * @return {string} the localized and formatted value suitable for display. When the value is 
 * formatted as a percent it's multiplied by 100.
 * 
 * @throws {Error} a ConverterError both when formatting fails, or if the options provided during 
 * initialization cannot be resolved correctly. 
 * 
 * @export
 */
oj.IntlNumberConverter.prototype.format = function (value) 
{
  var converterError;
  var locale;
  var localeElements;
  var resolvedOptions;

  // undefined, null and empty string values all return null. If value is NaN then return "".
  if (value == null || 
      (typeof value === "string" && (oj.StringUtils.trim("" + value)).length === 0) ||
      (typeof value === "number" && isNaN(value))) 
  {
    return oj.IntlConverterUtils.__getNullFormattedValue();
  }
  
  locale = oj.Config.getLocale();
  localeElements = oj.LocaleData.__getBundle();
  resolvedOptions = this.resolvedOptions();

  
  try
  {
    return this._getWrapped().format(value, localeElements, resolvedOptions, locale);
  }
  catch (e)
  {
    converterError = this._processConverterError(e, value);
    throw converterError;
  }
};

/**
 * Retrieves a hint String describing the format the value is expected to be in.
 * 
 * @return {String} a hint describing the format the value is expected to be in.
 * @export
 */
oj.IntlNumberConverter.prototype.getHint = function ()
{
  // UX does not want any hint for numbers. 
  // return oj.Translations.getTranslatedString("oj-converter.hint.summary",
  //        {'exampleValue': this._getHintValue()}); 
  //return oj.IntlNumberConverter.superclass.getHint.call(this); // this asserts, and we don't want that.
  return null;
};

/**
 * Returns the options called with converter initialization.
 * @return {Object} an object of options.
 * @export
 */
oj.IntlNumberConverter.prototype.getOptions = function () 
{
  return oj.IntlNumberConverter.superclass.getOptions.call(this);
};

/**
 * Parses a string value to return a Number, using the options this converter was initialized with. 
 * 
 * @param {String|string} value to parse
 * @return {number|null} the parsed number or null if the value was null or an empty string. When 
 * the value is parsed as a percent its 1/100th part is returned.
 * 
 * @throws {Error} a ConverterError both when parsing fails, or if the options provided during 
 * initialization cannot be resolved correctly. 
 *  
 * @export
 */
oj.IntlNumberConverter.prototype.parse = function (value) 
{
  var converterError;
  var locale; 
  var localeElements;
  var resolvedOptions;

  // null and empty string values are ignored and not parsed. It
  // undefined.
  if (value == null || value === "") // check for undefined, null and ""
  {
    return null;
  }
  
  locale = oj.Config.getLocale(); 
  localeElements = oj.LocaleData.__getBundle();
  resolvedOptions = this.resolvedOptions();
  
  try
  {
    // we want to trim the value for leading spaces before and after
    return this._getWrapped().parse(oj.StringUtils.trim(value), 
                                    localeElements, 
                                    resolvedOptions, 
                                    locale);
  }
  catch (e)
  {
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
 * @throws a oj.ConverterError when the options that the converter was initialized with are invalid. 
 * @export
 */
oj.IntlNumberConverter.prototype.resolvedOptions = function()
{
  var converterError;
  var locale = oj.Config.getLocale();
  var localeElements;
  
  // options are resolved and cached for the current locale. when locale changes resolvedOptions 
  // is reevaluated as it contains locale specific info.
  if ((locale !== this._locale) || !this._resolvedOptions)
  {
    localeElements = oj.LocaleData.__getBundle();
    try
    {
      if (!localeElements)
      {
        oj.Logger.error("locale bundle for the current locale %s is unavailable", locale);
        return {};
      }
      
      // cache if successfully resolved
      this._resolvedOptions = this._getWrapped().resolvedOptions(localeElements, 
                                                                 this.getOptions(), 
                                                                 locale);
      this._locale = locale;
    }
    catch (e)
    {
      converterError = this._processConverterError(e);
      throw converterError;
    }
  }
  
  return this._resolvedOptions;
};

/**
 * Processes the error returned by the converter implementation and throws a oj.ConverterError 
 * instance.
 * 
 * @param {Error} e
 * @param {String|string|Number|number|Object=} value
 * @throws an instance of oj.ConverterError
 * @private
 */
oj.IntlNumberConverter.prototype._processConverterError = function (e, value)
{
  var converterError;
  var errorCode;
  var errorInfo = e['errorInfo'];
  var detail;
  var parameterMap;
  var propName;
  var resourceKey;
  var summary;

  if (errorInfo)
  {
    errorCode = errorInfo['errorCode'];
    parameterMap = errorInfo['parameterMap'];
    oj.Assert.assertObject(parameterMap);
    propName = parameterMap['propertyName'];
    
    switch (errorCode)
    {
      case "optionTypesMismatch":
      case "optionTypeInvalid":
        converterError = oj.IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
        break;
      case "optionOutOfRange":
        converterError = oj.IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
        break;
      case "optionValueInvalid":
        converterError = oj.IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
        break;
      case "decimalFormatMismatch":
        // The '{value}' does not match the expected decimal format
        resourceKey = "oj-converter.number.decimalFormatMismatch.summary";
        break;
      case "currencyFormatMismatch":
        // The {value} does not match the expected currency format
        resourceKey = "oj-converter.number.currencyFormatMismatch.summary";
        break;
      case "percentFormatMismatch":
        // The {value} does not match the expected currency format
        resourceKey = "oj-converter.number.percentFormatMismatch.summary";
        break;  
      case "unsupportedParseFormat":
        // TODO: We'll be able to remove this exception when this bug is fixed post V1.1:
        //  - implement parse() for short number converter
        //  
        summary =  oj.Translations.getTranslatedString(
          "oj-converter.number.decimalFormatUnsupportedParse.summary");
        detail = oj.Translations.getTranslatedString(
          "oj-converter.number.decimalFormatUnsupportedParse.detail");
        converterError = new oj.ConverterError(summary, detail);
    }

    // The formatMismatch errors need a hint
    if (resourceKey)
    {
      summary = oj.Translations.getTranslatedString(resourceKey, 
        {'value': value || parameterMap['value'],
         'format': parameterMap['format']});

      // _getHintValue is smart. It uses the converter's 'format' function
      //  to get the example format to show the end user.
      detail = oj.Translations.getTranslatedString("oj-converter.hint.detail",
        {'exampleValue': this._getHintValue()}); 

      converterError = new oj.ConverterError(summary, detail);
    }

  }
  
  if (!converterError)
  {
    // An error we are unfamiliar with. Get the message and set as detail
    summary = e.message; // TODO: What should the summary be when it's missing??
    detail = e.message;
    converterError = new oj.ConverterError(summary, detail);
  }
  
  return converterError;
};

// Returns the hint value. It uses the converter's format function to return a formatted
// example. For example, if the converter's style is decimal and decimalFormat is short,
// this.format(12345.98765) returns 12K, and we show 12K in the error message as an example
// of what they should type in.
oj.IntlNumberConverter.prototype._getHintValue = function()
{
  var value = "";
  try
  {
    // use .format to get a real example to show the user what format they can type in to the field.
    value =  this.format(12345.98765);
  }
  catch (e)
  {
    if (e instanceof oj.ConverterError)
    {
      // Something went wrong and we don't have a way to retrieve a valid value.    
      value = "";
      oj.Logger.error("error retrieving hint value in format");
    }
  }
  finally
  {
    // returns the formatted value of 12345.98765
    return value;
  }
};

/**
 * Copyright (c) 2008, 2013, Oracle and/or its affiliates. 
 * All rights reserved.
 */



/**
 * A factory implementation to create the built-in number converter of type 
 * {@link oj.IntlNumberConverter}. 
 * 
 * @name oj.NumberConverterFactory
 * @class
 * 
 * @example <caption>create an instance of the jet datetime converter using the options provided</caption>
 * var ncf = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER); 
 * var salaryOptions = {currency: "EUR" , pattern: "¤#,##0.00;(¤#,##0.00)"};
 * var salaryConverter = ncf.createConverter(salaryOptions);
 * @public
 * @since 0.6
 * 
 */
oj.NumberConverterFactory = (function () 
{
  
  function _createNumberConverter(options) 
  {
    return new oj.IntlNumberConverter(options);
  }
  
  return {
    /**
     * Creates an immutable (jet) number converter instance.
     * 
     * @param {Object=} options an object literal used to provide optional information to initialize 
     * the jet number converter with. For details on what to pass for options, refer to 
     * {@link oj.IntlNumberConverter}
     * 
     * @return {oj.IntlNumberConverter}
     * @memberOf oj.NumberConverterFactory
     * @public
     */
    'createConverter': function(options) {
      return _createNumberConverter(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultConverterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER, // factory name
                               oj.NumberConverterFactory);


// JET VALIDATOR FACTORIES 
                                        
/**
 * a factory method to create an instance of a built-in numberRange validator of type 
 * {@link oj.NumberRangeValidator}. 
 * 
 * @example <caption>create an instance of the numberRange validator using the factory</caption>
 * var lrvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_NUMBER_RANGE);
 * var options = {hint: {min: 'Enter a value greater than {min}'}, min: 100};
 * var lrValidator = lrvf.createValidator(options);
 * 
 * @name oj.NumberRangeValidatorFactory
 * @class
 * @public
 * @since 0.6
 * 
 */
oj.NumberRangeValidatorFactory = (function () 
{
  
  function _createNumberRangeValidator(options) 
  {
    return new oj.NumberRangeValidator(options);
  }
  
  return {
    /**
     * Creates an immutable validator instance of type {@link oj.NumberRangeValidator} that ensures 
     * that the value provided is within a given range.
     * 
     * @param {Object=} options an object literal used to provide the minimum, maximum and other 
     * optional values. See {@link oj.NumberRangeValidator} for details.<p>
     * 
     * @return {oj.NumberRangeValidator}
     * @memberOf oj.NumberRangeValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createNumberRangeValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_NUMBERRANGE,
                                                oj.NumberRangeValidatorFactory);
    
/**
 * Copyright (c) 2016, Oracle and/or its affiliates.
 * All rights reserved.
 */
/**
 * This is a forked version of globalize.js
 */
/*
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
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
 * <li>Using the roundingMode and roundDuringParse options to round the number HALF_UP, HALF_DOWN, or HALF_EVEN.</li>
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
 * (the default), "currency" or "percent". When a number is formatted as a decimal, the decimal 
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
 * conventions. <br/>Example: {pattern: "#,##0.00"} or {pattern: "0.##E+0"}. <p>
 * 
 * NOTE: 'pattern' is provided for backwards compatibility with existing apps that may want the 
 * convenience of specifying an explicit format mask. Setting a pattern will override the default 
 * locale specific format. <br/>
 * 
 * @property {string=} options.roundingMode - specifies the rounding behavior. 
 * This follows the Java.Math.RoundingMode behavior.
 * Currently we support the options: HALF_UP, HALF_DOWN, and HALF_EVEN 
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
 * converter.format(nb, localeElements, options); --> "09,00 $US" if page locale is 'fr-FR'<br/>
 * 
 * @example <caption>Options for percent values using a custom (CLDR) pattern</caption>
 * var options = {pattern: '#,##0%'};
 *converter = converterFactory.createConverter(options);<br/>
 * 
 * @example <caption>To parse a value as percent but format it without displaying the percent character</caption>
 * var options = {style: 'percent', pattern: '#,##0'};<br/>
 * 
 * @example <caption>To parse a value as currency using a custom (CLDR) pattern</caption>
 * var options = {pattern: '¤#,##0', currency: 'USD'};
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
 */

/**
 * @ignore
 */
var OraNumberConverter;

OraNumberConverter = (function () {
  var _zeroPad;
  var _formatNumberImpl;
  var _parseNumberImpl;
  var _getLatnDigits;
  var _getNumberParts;
  var _throwNaNException;
  var _applyPatternImpl;
  var _parseNegativePattern;
  var _lenientParseNumber;
  var _parseNegativeExponent;
  var _getNumberSettings;
  var _validateNumberOptions;
  var _getRoundedNumber;
  var _throwMissingCurrency;
  var _getNumberingSystemKey;
  var _getBCP47Lang;
  var _throwNumberOutOfRange;
  var _roundNumber;
  var _decimalAdjust;
  var _getRoundingMode;
  var _getNumberOption;
  var _getNumberingExtension;
  var _adjustRoundingMode;
  var _getParsedValue;
  var _throwUnsupportedParseOption;
  var _toRawFixed;
  var _toExponentialPrecision;
  var _toCompactNumber;
  var instance;
  var _regionMatches;
  var _expandAffix;
  var _expandAffixes;
  var _throwSyntaxError;
  var _resolveNumberSettings;
  var _resolveOptions;

  var _REGEX_INFINITY = /^[+\-]?infinity$/i;
  var _REGEX_PARSE_FLOAT = /^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/;
  var _LENIENT_REGEX_PARSE_FLOAT = /([^+-.0-9]*)([+\-]?\d*\.?\d*(E[+\-]?\d+)?).*$/;
  var _ESCAPE_REGEXP = /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g;
  var _REGEX_TRIM_ZEROS = /(^0\.0*)([^0].*$)/;

  var _decimalTypeValues = {
    'trillion': [100000000000000, 10000000000000, 1000000000000],
    'billion': [100000000000, 10000000000, 1000000000],
    'million': [100000000, 10000000, 1000000],
    'thousand': [100000, 10000, 1000]
  };

  var _decimalTypeValuesMap = {
    'trillion': 1000000000000,
    'billion': 1000000000,
    'million': 1000000,
    'thousand': 1000
  };

  //maps roundingMode attributes to Math rounding modes. 
  var _roundingModeMap = {
    'HALF_UP': 'ceil',
    'HALF_DOWN': 'floor',
    'DEFAULT': 'round'
  };

  //prepend or append count zeros to a string.
  _zeroPad = function (str, count, left) {
    var l;
    for (l = str.length; l < count; l += 1) {
      str = (left ? ("0" + str) : (str + "0"));
    }
    return str;
  };

  _throwNumberOutOfRange = function (value, minimum, maximum, property) {
    var msg = value +
        " is out of range.  Enter a value between " + minimum +
        " and " + maximum + " for " + property;
    var rangeError = new RangeError(msg);
    var errorInfo = {
      'errorCode': "numberOptionOutOfRange",
      'parameterMap': {
        'value': value,
        'minValue': minimum,
        'maxValue': maximum,
        'propertyName': property
      }
    };
    rangeError['errorInfo'] = errorInfo;
    throw rangeError;
  };

  _getNumberOption = function (options, property, minimum, maximum, fallback) {
    var value = options[property];
    if (value !== undefined) {
      value = Number(value);
      if (isNaN(value) || value < minimum || value > maximum) {
        _throwNumberOutOfRange(value, minimum, maximum, property);
      }
      return Math.floor(value);
    }
    else {
      return fallback;
    }
  };

  //get the numbering system key from the locale's unicode extension.
  //Verify that the locale data has a numbers entry for it, if not return latn as default.
  _getNumberingSystemKey = function (localeElements, locale) {
    if (locale === undefined)
      return 'latn';
    var numberingSystemKey = _getNumberingExtension(locale);
    var symbols = "symbols-numberSystem-" + numberingSystemKey;
    if (localeElements['numbers'][symbols] === undefined)
      numberingSystemKey = 'latn';
    return numberingSystemKey;
  };

  //return the language part
  _getBCP47Lang = function (tag) {
    var arr = tag.split("-");
    return arr[0];
  };

  //get the unicode numbering system extension.
  _getNumberingExtension = function (locale) {
    locale = locale || "en-US";
    var idx = locale.indexOf("-u-nu-");
    var numbering = 'latn';
    if (idx !== -1) {
      numbering = locale.substr(idx + 6, 4);
    }
    return numbering;
  };

  /*return the properties for a number such as minimum and maximum fraction 
   *digits, decimal separator, grouping separator.
   *-If no user defined pattern is provided, get the pattern from the locale
   *  data and parse it to extrcat the number properties. If ecma options are
   *  present, override the corresponding default properties.
   *-If a user defined pattern is provided, parse it and extrcat the number
   *  properties. Ignore ecma ptions if present.
   */

  _getNumberSettings = function (localeElements, numberSettings,
      options, locale) {
    var pat;
    var localeElementsMainNode = oj.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var numberingSystemKey = _getNumberingSystemKey(localeElementsMainNode, locale);
    numberSettings['numberingSystemKey'] = numberingSystemKey;
    numberSettings['numberingSystem'] = "symbols-numberSystem-" +
        numberingSystemKey;
    var lenient = options['lenientParse'];
    numberSettings['lenientParse'] = lenient || 'full';
    
    //pattern passed in options
    if (options['pattern'] !== undefined && options['pattern'].length > 0) {
      pat = options['pattern'];
    }
    else
    {
      var key;
      switch (options['style'])
      {
        case "decimal" :
          key = "decimalFormats-numberSystem-";
          break;
        case "currency" :
          key = "currencyFormats-numberSystem-";
          break;
        case "percent" :
          key = "percentFormats-numberSystem-";
          break;
        default:
          key = "decimalFormats-numberSystem-";
          break;
      }
      key += numberSettings['numberingSystemKey'];
      pat = localeElementsMainNode['numbers'][key]['standard'];
      var decFormatLength = options['decimalFormat'];
      if (decFormatLength !== undefined && options['style'] === 'decimal') {
        numberSettings['shortDecimalFormat'] = localeElementsMainNode['numbers']['decimalFormats-numberSystem-latn'][decFormatLength]['decimalFormat'];
      }
    }
    var decimalSeparator = localeElementsMainNode['numbers'][numberSettings['numberingSystem']]['decimal'];
    var groupSeparator= localeElementsMainNode['numbers'][numberSettings['numberingSystem']]['group'];
    var separators = options['separators'];
    if(separators !== undefined) {
      numberSettings['separators'] = separators;
      var dec = separators['decimal'];
      var grp = separators['group'];
      if( dec !== undefined && dec !== '')
        decimalSeparator = separators['decimal'];
      if(grp !== undefined)
        groupSeparator = separators['group'];
    }
    var mainNodeKey = oj.OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
    var lang = _getBCP47Lang(mainNodeKey);
    numberSettings['plurals'] = localeElements['supplemental']['plurals'];
    numberSettings['lang'] = lang;
    numberSettings['pat'] = pat;
    numberSettings['minusSign'] = localeElementsMainNode['numbers']
    [numberSettings['numberingSystem']]['minusSign'];
    numberSettings['decimalSeparator'] = decimalSeparator;
    numberSettings['exponential'] = localeElementsMainNode['numbers']
    [numberSettings['numberingSystem']]['exponential'];
    numberSettings['groupingSeparator'] = groupSeparator;
    numberSettings['currencyDisplay'] = options['currencyDisplay'];
    if (options['currency'] !== undefined)
      numberSettings['currencyCode'] = options['currency'].toUpperCase();
    numberSettings['style'] = options['style'];
    _applyPatternImpl(options, pat, localeElementsMainNode, numberSettings);
    if (options['pattern'] === undefined) {
      numberSettings['minimumIntegerDigits'] = _getNumberOption(options,
          'minimumIntegerDigits', 1, 21,
          numberSettings['minimumIntegerDigits']);
      if (options['maximumFractionDigits'] !== undefined) {
        numberSettings['maximumFractionDigits'] = _getNumberOption(options,
            'maximumFractionDigits', 0, 20, numberSettings['maximumFractionDigits']);
        if (numberSettings['maximumFractionDigits'] < numberSettings['minimumFractionDigits']) {
          numberSettings['minimumFractionDigits'] = numberSettings['maximumFractionDigits'];
        }
      }
      if (options['minimumFractionDigits'] !== undefined) {
        numberSettings['minimumFractionDigits'] = _getNumberOption(options,
            'minimumFractionDigits', 0, 20,
            numberSettings['minimumFractionDigits']);
      }
      if (numberSettings['maximumFractionDigits'] < numberSettings['minimumFractionDigits']) {
        numberSettings['maximumFractionDigits'] = numberSettings['minimumFractionDigits'];
      }
    }
  };

  _throwMissingCurrency = function (prop) {
    var typeError = new TypeError('The property "currency" is required when' +
        'the property "' + prop + '" is "currency". An accepted value is a ' +
        'three-letter ISO 4217 currency code.');
    var errorInfo = {
      'errorCode': 'optionTypesMismatch',
      'parameterMap': {
        'propertyName': prop, // the driving property
        'propertyValue': 'currency', // the driving property's value
        'requiredPropertyName': 'currency', // the required property name
        'requiredPropertyValueValid': 'a three-letter ISO 4217 currency code'
      }
    };
    typeError['errorInfo'] = errorInfo;
    throw typeError;
  };

  _throwUnsupportedParseOption = function () {
    var error, errorInfo,
        code = "unsupportedParseFormat",
        msg = "long and short decimalFormats are not supported for parsing";
    error = new Error(msg);
    errorInfo = {
      'errorCode': code,
      'parameterMap': {
        'value': 'decimal'
      }
    };
    error['errorInfo'] = errorInfo;
    throw error;
  };

  //If the user specifies currency as a style, currency option must also be
  // provided. parse does not support short and long decimalFormat.
  _validateNumberOptions = function (options, caller) {
    var getOption = oj.OraI18nUtils.getGetOption(options, caller);
    var s = getOption('style', 'string', ['currency', 'decimal', 'percent', 'perMill'],
        'decimal');
    if (s === 'decimal') {
      s = getOption('decimalFormat', 'string', ['standard', 'short', 'long']);
      if (caller === 'OraNumberConverter.parse' && s !== undefined && s !== 'standard') {
        _throwUnsupportedParseOption();
      }
    }
    var c = getOption('currency', 'string');
    if (s === 'currency' && c === undefined) {
      _throwMissingCurrency("style");
    }
    var roundingMode = getOption('roundingMode', 'string', ['HALF_UP', 'HALF_DOWN', 'HALF_EVEN'],
        'DEFAULT');
    var lenientParse = getOption('lenientParse', 'string', ['none', 'full'], 'full');
  };

  //_toCompactNumber does compact formatting like 3000->3K for short
  //and "3 thousand" for long
  _toCompactNumber = function (number, options, numberSettings) {

    function _getZerosInPattern(s) {
      var i = 0, n = 0, idx = 0, prefix = '';
      if (s[0] !== '0') {
        while (s[i] !== '0' && i < s.length) {
          i++;
        }
        prefix = s.substr(0, i);
        idx = i;
      }
      for (i = idx; i < s.length; i++) {
        if (s[i] === '0')
          n++;
        else
          break;
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
      var i, j, len;
      for (i in _decimalTypeValues) {
        len = _decimalTypeValues[i].length;
        for (j = 0; j < len; j++) {
          if (_decimalTypeValues[i][j] <= n)
            return [i, _decimalTypeValues[i][j]];
        }
      }
      return [n, null];
    }


    var typeVal = _matchTypeValue(number);
    var prefix = '';
    if (typeVal[1] !== null) {
      var lang = numberSettings['lang'];
      var plural = numberSettings['plurals'][lang](Math.floor(number / _decimalTypeValuesMap[typeVal[0]]));
      var decimalFormatType = "" + typeVal[1] + "-count-" + plural;
      decimalFormatType = numberSettings['shortDecimalFormat'][decimalFormatType];
      if (decimalFormatType === undefined) {
        plural = "other";
        decimalFormatType = "" + typeVal[1] + "-count-" + plural;
        decimalFormatType = numberSettings['shortDecimalFormat'][decimalFormatType];
      }
      var tokens = _getZerosInPattern(decimalFormatType);
      var zeros = tokens[1];
      prefix = tokens[0];
      if (zeros < decimalFormatType.length) {
        var i = (1 * Math.pow(10, zeros));
        i = (typeVal[1] / i) * 10;
        number = number / i;
      }
    }
    var s = "";
    var fmt;
    if (decimalFormatType !== undefined)
      s = decimalFormatType.substr(zeros + tokens[0].length);
    fmt = _toRawFixed(number, options, numberSettings);
    s = prefix + fmt + s;
    return s;
  };

  //_toExponentialPrecision does the formatting when the pattern contain E,
  //for example #.#E0  
  _toExponentialPrecision = function (number, numberSettings) {
    var numStr0 = number + "";
    var trimExp = 0;
    var split = numStr0.split(/e/i);
    var numStr = split[0];
    _REGEX_TRIM_ZEROS.lastIndex = 0;
    var match = _REGEX_TRIM_ZEROS.exec(numStr);
    if (match !== null) {
      trimExp = match[1].length - 1;
      numStr = match[2];
    }
    else {
      numStr = numStr.replace(".", "");
    }
    var exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
    var numStr1 = parseInt(numStr, 10);
    var len = numberSettings['minimumIntegerDigits'] + numberSettings['maximumFractionDigits'];
    if (numStr.length > len) {
      len -= numStr.length;
      var factor = Math.pow(10, len);
      numStr1 = Math.round(numStr1 * factor);
    }
    var padLen = numberSettings['minimumIntegerDigits'] + numberSettings['minimumFractionDigits'];
    numStr1 = numStr1 + "";
    numStr1 = _zeroPad(numStr1, padLen, false);
    if (numStr0.indexOf('.') !== -1) {
      exponent -= numberSettings['minimumIntegerDigits'] - numStr0.indexOf('.') + trimExp;
    }
    else {
      exponent -= padLen - numStr.length - numberSettings['minimumFractionDigits'];
    }
    var posExp = Math.abs(exponent);
    posExp = _zeroPad(posExp + "", numberSettings['minExponentDigits'], true);
    if (exponent < 0)
      posExp = numberSettings['minusSign'] + posExp;
    var str1 = numStr1.slice(0, numberSettings['minimumIntegerDigits']);
    var str2 = numStr1.slice(numberSettings['minimumIntegerDigits']);
    if (str2.length > 0) {
      str1 += numberSettings['decimalSeparator'] + numStr1.slice(numberSettings['minimumIntegerDigits']) +
          numberSettings['exponential'] + posExp;
    }
    else {
      str1 += numberSettings['exponential'] + posExp;
    }
    return str1;
  };

  //_toRawFixed does the formatting based on
  //minimumFractionDigits and maximumFractionDigits.
  _toRawFixed = function (number, options, numberSettings) {
    var curSize = numberSettings['groupingSize'];
    var curSize0 = numberSettings['groupingSize0'];
    var decimalSeparator = numberSettings['decimalSeparator'];
    //First round the number based on maximumFractionDigits
    var numberString = number + "";
    var split = numberString.split(/e/i);
    var exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
    numberString = split[ 0 ];
    split = numberString.split('.');
    var right = split.length > 1 ? split[ 1 ] : "";
    //round the number only if it has decimal points
    if (split.length > 1 && right.length > exponent)
    {
      var precision = Math.min(numberSettings['maximumFractionDigits'],
          right.length - exponent);
      var mode = options['roundingMode'] || 'DEFAULT';
      number = _roundNumber(number, precision, mode);
    }
    //split the number into integer, fraction and exponent parts.
    numberString = number + "";
    split = numberString.split(/e/i);
    exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
    numberString = split[ 0 ];
    split = numberString.split('.');
    numberString = split[ 0 ];
    right = split.length > 1 ? split[ 1 ] : "";
    //pad zeros based on the exponent value and minimumFractionDigits 
    if (exponent > 0) {
      right = _zeroPad(right, exponent, false);
      numberString += right.slice(0, exponent);
      right = right.substr(exponent);
    }
    else if (exponent < 0) {
      exponent = -exponent;
      numberString = _zeroPad(numberString, exponent + 1, true);
      right = numberString.slice(-exponent, numberString.length) + right;
      numberString = numberString.slice(0, -exponent);
    }
    if (precision > 0 && right.length >0) {
      right = decimalSeparator +
          ((right.length > precision) ? right.slice(0, precision) :
              _zeroPad(right, precision, false));
    }
    else {
      if (numberSettings['minimumFractionDigits'] > 0) {
        right = decimalSeparator;
      }
      else {
        right = "";
      }
    }
    //insert grouping separator in the integer part based on groupingSize
    var padLen = decimalSeparator.length +
        numberSettings['minimumFractionDigits'];
    right = _zeroPad(right, padLen, false);
    var sep = numberSettings['groupingSeparator'],
        ret = "";
    if (options['useGrouping'] === false && options['pattern'] === undefined)
      sep = '';
    numberString = _zeroPad(numberString,
        numberSettings['minimumIntegerDigits'], true);
    var stringIndex = numberString.length - 1;
    right = right.length > 1 ? right : "";
    var rets;
    while (stringIndex >= 0) {
      if (curSize === 0 || curSize > stringIndex) {
        rets = numberString.slice(0, stringIndex + 1) +
            (ret.length ? (sep + ret + right) : right);
        return rets;
      }
      ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) +
          (ret.length ? (sep + ret) : "");
      stringIndex -= curSize;
      if (curSize0 > 0) {
        curSize = curSize0;
      }
    }
    rets = numberString.slice(0, stringIndex + 1) + sep + ret + right;
    return rets;
  };

  //HALF_DOWN behaves as HALF_UP if the discarded fraction is > 0.5
  _adjustRoundingMode = function (value, maxDigits, mode) {
    if (mode === 'HALF_DOWN' || mode === 'HALF_EVEN') {
      var n = value.substr(maxDigits);
      n = parseInt(n, 10);
      if (n > 5)
        mode = 'HALF_UP';
    }
    return mode;
  };

  _roundNumber = function (value, scale, mode) {
    var parts = value.toString().split('.');
    if (parts[1] === undefined)
      return value;
    if (parts[1][scale] === '5' && mode !== 'DEFAULT') {
      var adjustedMode = _adjustRoundingMode(parts[1], scale, mode);
      adjustedMode = _getRoundingMode(parts, adjustedMode, scale);
      return _decimalAdjust(value, -scale, adjustedMode, parts);
    }
    else {
      var factor = Math.pow(10, scale),
          rounded = Math.round(value * factor) / factor;
      if (!isFinite(rounded)) {
        return value;
      }
      return rounded;
    }
  };

  _getRoundingMode = function (parts, rMode, scale) {
    var mode = _roundingModeMap[rMode];
    if (rMode === 'HALF_EVEN') {
      var c;
      if (scale === 0) {
        var len = parts[0].length;
        c = parseInt(parts[0][len - 1], 10);
      }
      else {
        c = parseInt(parts[1][scale - 1], 10);
      }
      if (c % 2 == 0) {
        mode = _roundingModeMap['HALF_DOWN'];
      }
      else {
        mode = _roundingModeMap['HALF_UP']
      }
    }
    return mode;
  };

  /**
   * This function does the actual rounding of the number based on the rounding
   * mode:
   * value is the number to be rounded.
   * scale is the maximumFractionDigits.
   * mode is the rounding mode: ceil, floor, round. 
   * parts is the integer and fraction parts of the value.
   */
  _decimalAdjust = function (value, scale, mode, parts) {
    if (scale === 0) {
      if (parts[1][0] === '5') {
        return Math[mode](value);
      }
      return Math['round'](value);
    }
    var strValue = value.toString().split('e');
    var v0 = strValue[0];
    var v1 = strValue[1];
    //shift the decimal point based on the scale so that we can apply ceil or floor
    //scale is a number, no need to parse it, just parse v1.
    var s = v0 + 'e' + (v1 ? (parseInt(v1, 10) - scale) : -scale);
    var num = parseFloat(s);
    value = Math[mode](num);
    strValue = value.toString().split('e');
    //need to extract v0 and v1 again because value has chnaged after applying Math[mode].
    v0 = strValue[0];
    v1 = strValue[1];
    //shift the decimal point back to its original position
    s = v0 + 'e' + (v1 ? (parseInt(v1, 10) + scale) : scale);
    num = parseFloat(s);
    return num;
  };

  //first call _toRawFixed then add prefixes and suffixes. Display the 
  //number using native digits based on the numbering system
  _formatNumberImpl = function (value, options, localeElements,
      numberSettings, locale) {
    var localeElementsMainNode = oj.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    if (!isFinite(value)) {
      if (value === Infinity) {
        return localeElementsMainNode['numbers'][numberSettings['numberingSystem']]['infinity'];
      }
      if (value === -Infinity) {
        return localeElementsMainNode['numbers'][numberSettings['numberingSystem']]['infinity'];
      }
      return localeElementsMainNode['numbers'][numberSettings['numberingSystem']]['nan'];
    }
    var number = Math.abs(value);
    if (numberSettings['isPercent'] === true ||
        options['style'] === 'percent')
      number *= 100;
    else if (numberSettings['isPerMill'] === true)
      number *= 1000;
    //expand the number
    if ((options['style'] === 'decimal')
        && options['decimalFormat'] !== undefined
        && options['decimalFormat'] !== 'standard')
      number = _toCompactNumber(number, options, numberSettings);
    else if (numberSettings['useExponentialNotation'] === true)
      number = _toExponentialPrecision(number, numberSettings);
    else
      number = _toRawFixed(number, options, numberSettings);
    var ret = "";
    //add negative prefix and suffix if number is negative
    //and the new formatted value isn't zero
    if (value < 0 && (number - 0 != 0)) {
      ret += numberSettings['negativePrefix'] + number +
          numberSettings['negativeSuffix'];
    }
    //add positive prefix and suffix if number is positive
    else {
      ret += numberSettings['positivePrefix'] + number +
          numberSettings['positiveSuffix'];
    }
    //display the digits based on the numbering system
    var numberingSystemKey = _getNumberingExtension(locale);
    if (oj.OraI18nUtils.numeringSystems[numberingSystemKey] === undefined)
      numberingSystemKey = 'latn';
    if (numberingSystemKey !== 'latn') {
      var idx;
      var nativeRet = [];
      for (idx = 0; idx < ret.length; idx++)
      {
        if (ret[idx] >= '0' && ret[idx] <= '9')
          nativeRet.push(oj.OraI18nUtils.numeringSystems[numberingSystemKey][ret[idx]]);
        else
          nativeRet.push(ret[idx]);

      }
      return nativeRet.join("");
    }
    return ret;
  };

  //remove prefix and suffix, return a sign and value. First try to extract
  //a number using exact match. If it fails try lenient parsing.
  _parseNegativePattern = function (value, options, numberSettings,
      localeElements) {
    var ret;
    var num = oj.OraI18nUtils.trimNumber(value);
    var sign = "";
    var exactMatch = false;
    var posSign = localeElements['numbers'][numberSettings['numberingSystem']]['plusSign'];
    var posSignRegExp = new RegExp("^" + posSign.replace(_ESCAPE_REGEXP, "\\$1"));
    num = num.replace(posSignRegExp, "");
    var nbSettingPosPrefix = oj.OraI18nUtils.trimNumber(numberSettings['positivePrefix']),
        nbSettingPosSuffix = oj.OraI18nUtils.trimNumber(numberSettings['positiveSuffix']),
        nbSettingNegPrefix = oj.OraI18nUtils.trimNumber(numberSettings['negativePrefix']),
        nbSettingNegSuffix = oj.OraI18nUtils.trimNumber(numberSettings['negativeSuffix']);
    //try exact match of negative prefix and suffix
    var posPrefRegexp = new RegExp("^" + (nbSettingPosPrefix ||
        "").replace(_ESCAPE_REGEXP, "\\$1"));
    var posSuffRegexp = new RegExp((nbSettingPosSuffix || "").
        replace(_ESCAPE_REGEXP, "\\$1") + "$");
    var negPrefRegexp = new RegExp("^" + (nbSettingNegPrefix ||
        "").replace(_ESCAPE_REGEXP, "\\$1"));
    var negSuffRegexp = new RegExp((nbSettingNegSuffix ||
        "").replace(_ESCAPE_REGEXP, "\\$1") + "$");

    if (negPrefRegexp.test(num) === true && negSuffRegexp.test(num) === true) {
      num = num.replace(negPrefRegexp, "");
      num = num.replace(negSuffRegexp, "");
      sign = "-";
      exactMatch = true;
    }
    //try exact match of positive prefix and suffix
    else if (posPrefRegexp.test(num) === true && posSuffRegexp.test(num) === true) {
      num = num.replace(posPrefRegexp, "");
      num = num.replace(posSuffRegexp, "");
      sign = "+";
      exactMatch = true;
    }
    //if style is currency, remove currency symbol from prefix and suffix 
    //and try a match
    else if (options['style'] === 'currency') {
      var code = numberSettings['currencyCode'], symbol = code;
      var posPrefix, posSuffix, negPrefix, negSuffix, repStr;
      if (localeElements['numbers']['currencies'][code] !== undefined) {
        symbol = localeElements['numbers']['currencies'][code]['symbol'];
      }
      if (numberSettings['currencyDisplay'] === undefined ||
          numberSettings['currencyDisplay'] === "symbol") {
        repStr = symbol;
      }
      else if (numberSettings['currencyDisplay'] === "code") {
        repStr = code;
      }
      if (repStr !== undefined) {
        posPrefix = (nbSettingPosPrefix || "").replace(
            repStr, "");
        posSuffix = (nbSettingPosSuffix || "").replace(
            repStr, "");
        negPrefix = (nbSettingNegPrefix || "").replace(
            repStr, "");
        negSuffix = (nbSettingNegSuffix || "").replace(
            repStr, "");
        posPrefRegexp = new RegExp(("^" + posPrefix).replace(
            _ESCAPE_REGEXP, "\\$1"));
        posSuffRegexp = new RegExp(posSuffix.replace(
            _ESCAPE_REGEXP, "\\$1") + "$");
        negPrefRegexp = new RegExp(("^" + negPrefix).replace(
            _ESCAPE_REGEXP, "\\$1"));
        negSuffRegexp = new RegExp(negSuffix.replace(
            _ESCAPE_REGEXP, "\\$1") + "$");

        //try  match of positive prefix and suffix
        if (negPrefRegexp.test(num) === true && negSuffRegexp.test(num) === true) {
          num = num.replace(negPrefRegexp, "");
          num = num.replace(negSuffRegexp, "");
          sign = "-";
          exactMatch = true;
        }
        //try exact match of positive prefix and suffix
        else if (posPrefRegexp.test(num) === true && posSuffRegexp.test(num) === true) {
          num = num.replace(posPrefRegexp, "");
          num = num.replace(posSuffRegexp, "");
          sign = "+";
          exactMatch = true;
        }
      }
    }
    if (!exactMatch) {
      if(numberSettings['lenientParse'] === 'full') {
        ret = _lenientParseNumber(num, numberSettings);
        ret[2] = true;
      }
      else {
        _throwNaNException(options['style'], numberSettings, value)
      }
    }
    else
      ret = [sign, num];
    return ret;
  };

  _lenientParseNumber = function (num, numberSettings) {
    // Try to extract the number accoring to the following pattern:
    // optional +- followed by one or many digits followed by optional
    // fraction part followed by optional exponential.
    // use localized +, -, decimal separator, exponential
    // [+-]?\d+(?:\.\d+)?(?:E[+-]?\d+)?/;
    //remove grouping deparator from string
    var groupingSeparator = numberSettings['groupingSeparator'];
    var decimalSeparator = numberSettings['decimalSeparator'];
    var localeMinusSign = numberSettings['minusSign'];
    var plusSign = "+";
    var minusSign = "-";
    var sign = "";
    var dot = "";
    var exponential =
        oj.OraI18nUtils.toUpper(numberSettings['exponential']);
    num = oj.OraI18nUtils.toUpper(num);
    num = num.split(exponential).join("E");
    //remove grouping separator from string
    var groupSep = groupingSeparator;
    num = num.split(groupSep).join("");
    var altGroupSep = groupSep.replace(/\u00A0/g, " ");
    if (groupSep !== altGroupSep) {
      num = num.split(altGroupSep).join("");
    }
    num = num.split(decimalSeparator).join(".");
    if (num.charAt(0) === ".") {
      num = num.substr(1);
      dot = ".";
    }
    //replace localized minus with minus
    num = num.replace(localeMinusSign, minusSign);
    var match = _LENIENT_REGEX_PARSE_FLOAT.exec(num);
    var resNum = dot + match[2];
    if (oj.OraI18nUtils.startsWith(resNum, minusSign)) {
      resNum = resNum.substr(minusSign.length);
      sign = "-";
    }
    else if (oj.OraI18nUtils.startsWith(num, plusSign)) {
      resNum = resNum.substr(plusSign.length);
      sign = "+";
    }
    return [sign, resNum];
  };

  //parse the exponent part of a number
  _parseNegativeExponent = function (value, numberSettings) {
    var neg = numberSettings['minusSign'];
    var pos = numberSettings['plusSign'];
    var ret;
    value = oj.OraI18nUtils.trimNumber(value);
    neg = oj.OraI18nUtils.trimNumber(neg);
    pos = oj.OraI18nUtils.trimNumber(pos);
    if (oj.OraI18nUtils.startsWith(value, neg)) {
      ret = ["-", value.substr(neg.length)];
    }
    else if (oj.OraI18nUtils.startsWith(value, oj.OraI18nUtils.trimNumber(pos))) {
      ret = ["+", value.substr(pos.length)];
    }
    return ret || ["", value];
  };

  _getLatnDigits = function (str, locale) {
    var numberingSystemKey = _getNumberingExtension(locale);
    if (oj.OraI18nUtils.numeringSystems[numberingSystemKey] === undefined)
      return str;
    var idx;
    var latnStr = [];
    for (idx = 0; idx < str.length; idx++) {
      var pos = oj.OraI18nUtils.numeringSystems[numberingSystemKey].indexOf(str[idx]);
      if (pos !== -1)
        latnStr.push(pos);
      else
        latnStr.push(str[idx]);
    }
    var ret = latnStr.join("");
    return ret;
  };

  //split the number into integer, fraction and exponential parts
  _getNumberParts = function (num, numberSettings) {
    var parts = {};
    var decimalSeparator = numberSettings['decimalSeparator'];
    var groupSep = numberSettings['groupingSeparator'];
    num = num.replace(/ /g, "");
    // determine exponent and number
    var exponentSymbol = numberSettings['exponential'];
    var integer;
    var intAndFraction;
    var exponentPos = num.indexOf(exponentSymbol.toLowerCase());
    if (exponentPos < 0)
      exponentPos = num.indexOf(oj.OraI18nUtils.toUpper(exponentSymbol));
    if (exponentPos < 0) {
      intAndFraction = num;
      parts['exponent'] = null;
    }
    else {
      intAndFraction = num.substr(0, exponentPos);
      parts['exponent'] = num.substr(exponentPos + exponentSymbol.length);
    }
    // determine decimal position
    var decSep = decimalSeparator;
    var decimalPos = intAndFraction.indexOf(decSep);
    if (decimalPos < 0) {
      integer = intAndFraction;
      parts['fraction'] = null;
    }
    else {
      integer = intAndFraction.substr(0, decimalPos);
      parts['fraction'] = intAndFraction.substr(decimalPos + decSep.length);
    }
    // handle groups (e.g. 1,000,000)
    integer = integer.split(groupSep).join("");
    var altGroupSep = groupSep.replace(/\u00A0/g, " ");
    if (groupSep !== altGroupSep) {
      integer = integer.split(altGroupSep).join("");
    }
    parts['integer'] = integer;
    return parts;
  };

  _getParsedValue = function (ret, options, numberSettings, errStr) {
    if (isNaN(ret)) {
      _throwNaNException(options['style'], numberSettings, errStr)
    }
    if (numberSettings['isPercent'] === true || options['style'] ===
        'percent')
      ret /= 100;
    else if (numberSettings['isPerMill'] === true)
      ret /= 1000;
    var getOption = oj.OraI18nUtils.getGetOption(options, "OraNumberConverter.parse");
    var roundDuringParse = getOption('roundDuringParse', 'boolean', [true, false], false);
    if (roundDuringParse) {
      ret = _getRoundedNumber(ret, numberSettings, options);
    }
    return ret;
  };

  _throwNaNException = function (style, numberSettings, errStr) {
    var msg, error, errorInfo, code;
    msg = "Unparsable number " + errStr + " The expected number " +
        "pattern is " + numberSettings['pat'];
    switch (style)
    {
      case "decimal" :
        code = "decimalFormatMismatch";
        break;
      case "currency" :
        code = "currencyFormatMismatch";
        break;
      case "percent" :
        code = "percentFormatMismatch";
        break;
    }
    error = new Error(msg);
    errorInfo = {
      'errorCode': code,
      'parameterMap': {
        'value': errStr,
        'format': numberSettings['pat']
      }
    };
    error['errorInfo'] = errorInfo;
    throw error;
  };

  _parseNumberImpl = function (str, localeElements, options, locale) {
    var localeElementsMainNode = oj.OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var numberSettings = {};
    var numStr = _getLatnDigits(str, locale);
    _getNumberSettings(localeElements, numberSettings, options, locale);
    var ret = NaN;
    var value1 = numStr.replace(/ /g, "");
    // allow infinity or hexidecimal
    if (_REGEX_INFINITY.test(value1)) {
      ret = parseFloat(numStr);
      return ret;
    }
    var signInfo = _parseNegativePattern(numStr, options, numberSettings,
        localeElementsMainNode);
    var sign = signInfo[ 0 ];
    var num = signInfo[ 1 ];
    sign = sign || "+";
    if (signInfo[2]) {
      ret = parseFloat(sign + num);
      return  _getParsedValue(ret, options, numberSettings, str);
    }

    var parts = _getNumberParts(num, numberSettings);
    var integer = parts['integer'];
    var fraction = parts['fraction'];
    var exponent = parts['exponent'];

    // build a natively parsable number string
    var p = sign + integer;
    if (fraction !== null) {
      p += "." + fraction;
    }
    if (exponent !== null) {
      // exponent itself may have a number pattern
      var expSignInfo = _parseNegativeExponent(exponent, numberSettings);
      p += "e" + (expSignInfo[0] || "+") + expSignInfo[ 1 ];
    }
    if (_REGEX_PARSE_FLOAT.test(p)) {
      ret = parseFloat(p);
    }
    else {
      if(numberSettings['lenientParse'] === 'full') {
        p = _lenientParseNumber(numStr, numberSettings);
        ret = parseFloat(p[0] + p[1]);
      }
      else {
        _throwNaNException(options['style'], numberSettings, str);
      }
    }
    return  _getParsedValue(ret, options, numberSettings, str);
  };
     
  /* This module handles the  parsing of a number pattern.
   * It sets prefix, suffix, minimum and maximum farcation digits, 
   * miimum  integer digits and grouping size. 
   */

  var _ZERO_DIGIT = '0',
      _GROUPING_SEPARATOR = ',',
      _DECIMAL_SEPARATOR = '.',
      _PERCENT = '%',
      _PER_MILL = '\u2030',
      _DIGIT = '#',
      _SEPARATOR = ';',
      _EXPONENT = "E",
      _MINUS = '-',
      _QUOT = '\'',
      _CURRENCY = '\u00A4';

  var posPrefixPattern,
      posSuffixPattern,
      negPrefixPattern,
      negSuffixPattern;

  var _MAXIMUM_INTEGER_DIGITS = 0x7fffffff;
  var _MAXIMUM_FRACTION_DIGITS = 0x7fffffff;

  _throwSyntaxError = function (pattern) {
    var msg, syntaxError, errorInfo, samplePattern = "#,##0.###";
    msg = "Unexpected character(s) encountered in the pattern \"" +
        pattern + " An example of a valid pattern is \"" + samplePattern +
        '".';
    syntaxError = new SyntaxError(msg);
    errorInfo = {
      'errorCode': 'optionValueInvalid',
      'parameterMap': {
        'propertyName': 'pattern',
        'propertyValue': pattern,
        'propertyValueHint': samplePattern
      }
    };
    syntaxError['errorInfo'] = errorInfo;
    throw syntaxError;
  };

  _regionMatches = function (str1, offset1, str2) {
    var sub1 = str1.substr(offset1, str2.length);
    var regExp = new RegExp(str2, "i");
    return (regExp.exec(sub1) !== null);
  };

  _expandAffixes = function (localeElements, numberSettings) {
    var curDisplay = {};
    if (posPrefixPattern !== null) {
      numberSettings['positivePrefix'] = _expandAffix(posPrefixPattern,
          localeElements, numberSettings, curDisplay);
    }
    if (posSuffixPattern !== null) {
      numberSettings['positiveSuffix'] = _expandAffix(posSuffixPattern,
          localeElements, numberSettings, curDisplay);
    }
    if (negPrefixPattern !== null) {
      numberSettings['negativePrefix'] = _expandAffix(negPrefixPattern,
          localeElements, numberSettings, curDisplay);
    }
    if (negSuffixPattern !== null) {
      numberSettings['negativeSuffix'] = _expandAffix(negSuffixPattern,
          localeElements, numberSettings, curDisplay);
    }
    if (curDisplay['name'] !== undefined) {
      numberSettings['positiveSuffix'] = "\u00a0" + curDisplay['name'];
      numberSettings['positivePrefix'] = "";
      if (numberSettings['lang'] === 'ar') {
        numberSettings['negativeSuffix'] = localeElements['numbers'][numberSettings['numberingSystem']]['minusSign'] + "\u00a0" + curDisplay['name'];
        numberSettings['negativePrefix'] = "";
      }
      else {
        numberSettings['negativeSuffix'] = "\u00a0" + curDisplay['name'];
        numberSettings['negativePrefix'] = localeElements['numbers'][numberSettings['numberingSystem']]['minusSign'];
      }
    }
  };

  _expandAffix = function (pattern, localeElements, numberSettings,
      currencyDisplay) {
    var buffer = "";
    for (var i = 0; i < pattern.length; ) {
      var c = pattern.charAt(i++);
      if (c === _QUOT)// {
        continue;
      //c = pattern.charAt(i++);
      switch (c) {
        case _CURRENCY:
          var code = numberSettings['currencyCode'];
          var name = code, symbol = code;
          if (localeElements['numbers']['currencies'][code] !== undefined) {
            name = localeElements['numbers']['currencies'][code]['displayName'];
            symbol = localeElements['numbers']['currencies'][code]['symbol'];
          }
          if (numberSettings['currencyDisplay'] === undefined ||
              numberSettings['currencyDisplay'] === "symbol")
            c = symbol;
          else if (numberSettings['currencyDisplay'] === "code") {
            c = code;
          }
          else {
            c = name;
            currencyDisplay['name'] = c;
          }
          break;
        case _PERCENT:
          c = localeElements['numbers'][numberSettings['numberingSystem']]['percentSign'];
          break;
        case _PER_MILL:
          c = localeElements['numbers'][numberSettings['numberingSystem']]['perMille'];
          break;
        case _MINUS:
          c = localeElements['numbers'][numberSettings['numberingSystem']]['minusSign'];
          break;
      }
      //}
      buffer = buffer.concat(c);
    }
    return buffer;
  };

  _applyPatternImpl = function (options, pattern, localeElements,
      numberSettings) {

    var gotNegative = false,
        useExponentialNotation = false;
    var phaseOneLength = 0;
    var start = 0;
    var isPrefix = true;

    for (var j = 1; j >= 0 && start < pattern.length; --j) {
      var inQuote = false;
      var prefix = "";
      var suffix = "";
      var decimalPos = -1;
      var multiplier = 1;
      var digitLeftCount = 0, zeroDigitCount = 0, digitRightCount = 0,
          groupingCount = -1, groupingCount0 = -1;
      var minExponentDigits;
      var phase = 0;

      isPrefix = true;
      for (var pos = start; pos < pattern.length; ++pos) {
        var ch = pattern.charAt(pos);
        switch (phase) {
          case 0:
          case 2:
            // Process the prefix / suffix characters
            if (inQuote) {
              if (ch === _QUOT) {
                if ((pos + 1) < pattern.length && pattern.charAt(pos + 1) ===
                    _QUOT) {
                  ++pos;
                  if (isPrefix)
                    prefix = prefix.concat("''");
                  else
                    suffix = suffix.concat("''");
                }
                else {
                  inQuote = false; // 'do'
                }
                continue;
              }
            }
            else {
              // Process unquoted characters seen in prefix or suffix phase.
              if (ch === _DIGIT ||
                  ch === _ZERO_DIGIT ||
                  ch === _GROUPING_SEPARATOR ||
                  ch === _DECIMAL_SEPARATOR) {
                phase = 1;
                --pos; // Reprocess this character
                continue;
              }
              else if (ch === _CURRENCY) {
                if (options['currency'] === undefined)
                  _throwMissingCurrency("pattern");
                // Use lookahead to determine if the currency sign
                // is doubled or not.
                options['style'] = 'currency';
                var doubled = (pos + 1) < pattern.length &&
                    pattern.charAt(pos + 1) === _CURRENCY;
                if (doubled) { // Skip over the doubled character
                  ++pos;
                }
                if (isPrefix)
                  prefix = prefix.concat(doubled ? "'\u00A4\u00A4" :
                      "'\u00A4");
                else
                  suffix = suffix.concat(doubled ? "'\u00A4\u00A4" :
                      "'\u00A4");
                continue;
              }
              else if (ch === _QUOT) {
                if (ch === _QUOT) {
                  if ((pos + 1) < pattern.length &&
                      pattern.charAt(pos + 1) === _QUOT) {
                    ++pos;
                    if (isPrefix)
                      prefix = prefix.concat("''");// o''clock
                    else
                      suffix = suffix.concat("''");
                  }
                  else {
                    inQuote = true; // 'do'
                  }
                  continue;
                }
              }
              else if (ch === _SEPARATOR) {
                if (phase === 0 || j === 0) {
                  _throwSyntaxError(pattern);
                }
                start = pos + 1;
                pos = pattern.length;
                continue;
              }

              // Next handle characters which are appended directly.
              else if (ch === _PERCENT) {
                options['style'] = 'percent';
                if (multiplier !== 1) {
                  _throwSyntaxError(pattern);
                }
                numberSettings['isPercent'] = true;
                multiplier = 100;
                if (isPrefix)
                  prefix = prefix.concat("'%");
                else
                  suffix = suffix.concat("'%");
                continue;
              }
              else if (ch === _PER_MILL) {
                if (multiplier !== 1) {
                  _throwSyntaxError(pattern);
                }
                options['style'] = 'perMill';
                numberSettings['isPerMill'] = true;
                multiplier = 1000;
                if (isPrefix)
                  prefix = prefix.concat("'\u2030");
                else
                  suffix = suffix.concat("'\u2030");
                continue;
              }
              else if (ch === _MINUS) {
                if (isPrefix)
                  prefix = prefix.concat("'-");
                else
                  suffix = suffix.concat("'-");
                continue;
              }
            }
            if (isPrefix)
              prefix = prefix.concat(ch);
            else
              suffix = suffix.concat(ch);
            break;

          case 1:
            if (j === 1) {
              ++phaseOneLength;
            }
            else {
              if (--phaseOneLength === 0) {
                phase = 2;
                isPrefix = false;
              }
              continue;
            }

            if (ch === _DIGIT) {
              if (zeroDigitCount > 0) {
                ++digitRightCount;
              }
              else {
                ++digitLeftCount;
              }
              if (groupingCount >= 0 && decimalPos < 0) {
                ++groupingCount;
              }
            }
            else if (ch === _ZERO_DIGIT) {
              if (digitRightCount > 0) {
                _throwSyntaxError(pattern);
              }
              ++zeroDigitCount;
              if (groupingCount >= 0 && decimalPos < 0) {
                ++groupingCount;
              }
            }
            else if (ch === _GROUPING_SEPARATOR) {
              groupingCount0 = groupingCount;
              groupingCount = 0;
            }
            else if (ch === _DECIMAL_SEPARATOR) {
              if (decimalPos >= 0) {
                _throwSyntaxError(pattern);
              }
              decimalPos = digitLeftCount + zeroDigitCount +
                  digitRightCount;
            }
            else if (_regionMatches(pattern, pos, _EXPONENT)) {
              if (useExponentialNotation) {
                _throwSyntaxError(pattern);
              }
              useExponentialNotation = true;
              minExponentDigits = 0;
              pos = pos + _EXPONENT.length;
              while (pos < pattern.length && pattern.charAt(pos) ===
                  _ZERO_DIGIT) {
                ++minExponentDigits;
                ++phaseOneLength;
                ++pos;
              }

              if ((digitLeftCount + zeroDigitCount) < 1 ||
                  minExponentDigits < 1) {
                _throwSyntaxError(pattern);
              }
              phase = 2;
              isPrefix = false;
              --pos;
              continue;
            }
            else {
              phase = 2;
              isPrefix = false;
              --pos;
              --phaseOneLength;
              continue;
            }
            break;
        }
      }


      if (zeroDigitCount === 0 && digitLeftCount > 0 && decimalPos >= 0) {
        // Handle "###.###" and "###." and ".###"
        var n = decimalPos;
        if (n === 0) { // Handle ".###"
          ++n;
        }
        digitRightCount = digitLeftCount - n;
        digitLeftCount = n - 1;
        zeroDigitCount = 1;
      }

      // Do syntax checking on the digits.
      if ((decimalPos < 0 && digitRightCount > 0) ||
          (decimalPos >= 0 && (decimalPos < digitLeftCount ||
              decimalPos > (digitLeftCount + zeroDigitCount))) ||
          groupingCount === 0 || inQuote) {
        _throwSyntaxError(pattern);
      }

      if (j === 1) {
        posPrefixPattern = prefix;
        posSuffixPattern = suffix;
        negPrefixPattern = posPrefixPattern;
        negSuffixPattern = posSuffixPattern;
        var digitTotalCount = digitLeftCount + zeroDigitCount +
            digitRightCount;
        // The effectiveDecimalPos is the position the decimal is at or
        //would be at if there is no decimal. Note that if decimalPos<0,
        // then digitTotalCount == digitLeftCount + zeroDigitCount.
        var effectiveDecimalPos = decimalPos >= 0 ?
            decimalPos : digitTotalCount;
        numberSettings['minimumIntegerDigits'] = (effectiveDecimalPos -
            digitLeftCount);
        numberSettings['maximumIntegerDigits'] = (useExponentialNotation ?
            digitLeftCount + numberSettings['minimumIntegerDigits'] :
            _MAXIMUM_INTEGER_DIGITS);
        numberSettings['maximumFractionDigits'] = (decimalPos >= 0 ?
            (digitTotalCount - decimalPos) : 0);
        numberSettings['minimumFractionDigits'] = (decimalPos >= 0 ?
            (digitLeftCount + zeroDigitCount - decimalPos) : 0);
        numberSettings['groupingSize'] = (groupingCount > 0) ?
            groupingCount : 0;
        numberSettings['groupingSize0'] = groupingCount0;
      }
      else {
        negPrefixPattern = prefix;
        negSuffixPattern = suffix;
        gotNegative = true;
      }
    }

    if (pattern.length === 0) {
      posPrefixPattern = posSuffixPattern = "";
      numberSettings['minimumIntegerDigits'] = 0;
      numberSettings['maximumIntegerDigits'] = _MAXIMUM_INTEGER_DIGITS;
      numberSettings['minimumFractionDigits'] = 0;
      numberSettings['maximumFractionDigits'] = _MAXIMUM_FRACTION_DIGITS;
    }
    numberSettings['useExponentialNotation'] = useExponentialNotation;
    numberSettings['minExponentDigits'] = minExponentDigits;
    // If there was no negative pattern, or if the negative pattern is
    // identical to the positive pattern, then prepend the minus sign to
    // the positive pattern to form the negative pattern.
    if (!gotNegative ||
        ((negPrefixPattern.localeCompare(posPrefixPattern) === 0)
            && (negSuffixPattern.localeCompare(posSuffixPattern) === 0))) {
      if (options['style'] === 'currency' && numberSettings['lang'] === 'ar') {
        negSuffixPattern = posSuffixPattern + "'\u200f-";
        negPrefixPattern = posPrefixPattern;
      }
      else {
        negSuffixPattern = posSuffixPattern;
        negPrefixPattern = "'-" + posPrefixPattern;

      }
    }
    _expandAffixes(localeElements, numberSettings);
  };

  _getRoundedNumber = function (ret, numberSettings, options) {
    var precision = numberSettings['maximumFractionDigits'];
    var isNegative = ret < 0;
    var mode = options['roundingMode'] || 'DEFAULT';
    var roundedNumber = _roundNumber(Math.abs(ret), precision, mode);
    return isNegative ? -roundedNumber : roundedNumber;
  };

  _resolveNumberSettings = function (localeElements, options, locale) {
    var numberSettings = {};
    _validateNumberOptions(options, "OraNumberConverter.resolvedOptions");
    _getNumberSettings(localeElements, numberSettings, options, locale);
    numberSettings['numberingSystemKey'] = _getNumberingExtension(locale);
    if (oj.OraI18nUtils.numeringSystems[numberSettings['numberingSystemKey']] ===
        undefined)
      numberSettings['numberingSystemKey'] = 'latn';
    return numberSettings;
  };

  _resolveOptions = function (numberSettings, options, locale) {
    var resOptions = {
      'locale': locale,
      'style': (options['style'] === undefined) ? 'decimal' : options['style'],
      'useGrouping': (options['useGrouping'] === undefined) ? true : options['useGrouping'],
      'numberingSystem': numberSettings['numberingSystemKey']
    };
    resOptions['minimumIntegerDigits'] = numberSettings['minimumIntegerDigits'];
    resOptions['minimumFractionDigits'] = numberSettings['minimumFractionDigits'];
    resOptions['maximumFractionDigits'] = numberSettings['maximumFractionDigits'];
    if (options['style'] === 'decimal' && options['decimalFormat'] !== undefined) {
      resOptions['decimalFormat'] = options['decimalFormat'];
    }
    if (options['style'] === 'currency') {
      resOptions['currency'] = options['currency'];
      resOptions['currencyDisplay'] = (options['currencyDisplay'] ===
          undefined) ? 'symbol' : options['currencyDisplay'];
    }
    if (options['pattern'] !== undefined)
      resOptions['pattern'] = options['pattern'];
    var roundingMode = options['roundingMode'];
    var roundDuringParse = options['roundDuringParse'];
    if (roundingMode !== undefined)
      resOptions['roundingMode'] = roundingMode;
    if (roundDuringParse !== undefined)
      resOptions['roundDuringParse'] = roundDuringParse;
    var leneint = numberSettings['lenientParse'];
    if (leneint !== undefined)
      resOptions['lenientParse'] = leneint;
    var sep = numberSettings['separators'];
    if (sep !== undefined)
      resOptions['separators'] = sep;
    return resOptions;
  };

  function _init()
  {

    return {
      /**
       * Format a number.
       * @memberOf OraNumberConverter
       * @param {number} value - Number object to be formatted.
       * @param {Object} localeElements - the instance of LocaleElements  
       * bundle
       * @param {Object=} options - Containing the following properties:<br>
       * - <b>style.</b>  is one of the String values "decimal", "currency"  
       * or "percent". The default is "decimal".<br>
       * - <b>decimalFormat.</b> is used in conjuction with "decimal" style. 
       * It can have one of the string values "short", "long". It is used for 
       * compact number formatting. For example 3000 is displayed
       *  as 3K for "short" and 3 thousand for "long". We take into consideration
       *  the locale's plural rules for the compact pattern.<br> 
       * - <b>currency.</b> An ISO 4217 alphabetic currency code. Mandatory 
       *  when style is "currency".<br>
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
          options = {
            'useGrouping': true,
            'style': 'decimal'
          };
        }
        _validateNumberOptions(options, "OraNumberConverter.format");
        var numberSettings = {};
        _getNumberSettings(localeElements, numberSettings, options, locale);
        return _formatNumberImpl(value, options, localeElements,
            numberSettings, locale);
      },
      /**
       * Parse a number.
       * @memberOf OraNumberConverter
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
        if (typeof str === "number")
          return str;
        if (Object.prototype.toString.call(str) === '[object Number]')
          return  Number(str);
        if (arguments.length <= 2 || options === undefined) {
          options = {
            'useGrouping': true,
            'style': 'decimal'
          };
        }
        _validateNumberOptions(options, "OraNumberConverter.parse");
        return _parseNumberImpl(str, localeElements, options, locale);
      },
      /**
       * Resolve options.
       * Returns a new object with properties reflecting the number formatting 
       * options computed based on the options parameter.
       * If options is not provided, the properties will be derived from the 
       * locale defaults.
       * @memberOf OraNumberConverter
       * @param {Object} localeElements - the instance of LocaleElements 
       * bundle
       * @param {Object=} options containing the following properties:<br>
       * - <b>style.</b> "decimal", "currency" or "percent". The default is 
       * "decimal".<br>
       * - <b>decimalFormat.</b> It can have one of the string values "short", "long".
       *  It is used for compact number formatting. For example 3000 is displayed
       *  as 3K for "short" and 3 thousand for "long". We take into consideration
       *  the locale's plural rules for the compact pattern.<br> 
       * - <b>currency.</b> An ISO 4217 alphabetic currency code. Mandatory 
       * when when style is "currency".<br>
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
          locale = oj.OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
        }
        if (arguments.length < 2 || options === undefined) {
          options = {
            'useGrouping': true,
            'style': 'decimal'
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
     * @memberOf OraNumberConverter
     * @return {Object} The singleton OraNumberConverter instance.
     */
    getInstance: function () {
      if (!instance) {
        instance = _init();
      }
      return instance;
    }
  };
}());
});
