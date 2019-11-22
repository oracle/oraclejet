/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojtranslation', 'ojs/ojconverterutils-i18n', 'ojs/ojconverterutils', 'ojs/ojvalidator', 'ojs/ojconverter-datetime', 
'ojs/ojvalidation-error'
], function(oj, Translations, __ConverterUtilsI18n, ConverterUtils, Validator, __DateTimeConverter)
{
  "use strict";


/* global Promise:false, __ConverterUtilsI18n:false, ConverterUtils:false, Translations:false, Validator:false, __DateTimeConverter:false */

/**
 * Constructs a DateTimeRangeValidator that ensures the value provided is within a given range.
 * @param {Object=} options an object literal used to provide the following properties
 * @export
 * @constructor
 * @final
 * @augments oj.Validator
 * @name oj.DateTimeRangeValidator
 * @ojtsmodule
 * @ojtsimport {module: "ojvalidator", type: "AMD", importName: "Validator"}
 * @ojtsimport {module: "ojconverter-datetime", type:"AMD", imported: ["DateTimeConverter"]}
 * @ojsignature [{target: "Type",
 *                value: "class DateTimeRangeValidator implements Validator<string>"},
 *               {target: "Type",
 *                value: "oj.DateTimeRangeValidator.ValidatorOptions",
 *                for: "options", jsdocOverride: true}
 *              ]
 * @since 0.6.0
 * @see oj.AsyncDateTimeRangeValidator
*/
var DateTimeRangeValidator = function _DateTimeRangeValidator(options) {
  this.Init(options);
};
/**
 * @typedef {Object} oj.DateTimeRangeValidator.ValidatorOptions
 * @property {oj.DateTimeConverter} converter - an instance implementation of oj.DateTimeConverter (i.e. oj.IntlDateTimeConverter).
 * In order to compare isoString value with the timeZone options in the converter, it is necessary for the validator that
 * a converter is passed in.
 * @property {string=} min - the minimum datetime value of the entered value. Should be ISOString.
 * @property {string=} max - the maximum datetime value of the entered value. Should be ISOString.
 * @property {Object=} hint - an optional object literal of hints to be used.
 * @property {string=} hint.max - a hint used to indicate the allowed maximum. When not present,
 * the default hint is the resource defined with the key
 * <code class="prettyprint">oj-validator.range.datetime.hint.max</code>.<p>
 * Tokens: <br/>
 * {max} - the maximum<p>
 * Usage: <br/>
 * Enter a datetime less than or equal to {max}
 * @property {string=} hint.min - a hint used to indicate the allowed minimum. When not present,
 * the default hint is the resource defined with the key
 * <code class="prettyprint">oj-validator.range.datetime.hint.min</code>.<p>
 * Tokens: <br/>
 * {min} the minimum <p>
 * Usage: <br/>
 * Enter a datetime greater than or equal to {min}
 * @property {string=} hint.inRange - a hint used to indicate the allowed range. When not
 * present, the default hint is the resource defined with the key
 * <code class="prettyprint">oj-validator.range.datetime.hint.inRange</code>.<p>
 * Tokens:<br/>
 * {min} the minimum<br/>
 * {max} the maximum<p>
 * Usage: <br/>
 * Enter a datetime between {min} and {max}
 * @property {string=} translationKey - an optional string for the default messages + hints. Note
 * that this is required only when the validator is used standlone (i.e. if one uses min + max
 * attribute for ojInputDate the validator will have this already be set to correct "date" value)
 * <ul>
 *  <li>"datetime"</li>
 *  <li>"date"</li>
 *  <li>"time"</li>
 * </ul>
 * <br/>
 * @property {Object=} messageDetail - an optional object literal of custom error messages to
 * be used.
 * @property {string=} messageDetail.rangeUnderflow - the detail error message to be used when
 * input value is less than the set minimum value. When not present, the default detail message is
 * the resource defined with the key
 * <code class="prettyprint">oj-validator.range.datetime.messagedetail.rangeUnderflow</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {min} - the minimum allowed value<p>
 * Usage: <br/>
 * Entered {value} with min being {min}
 * @property {string=} messageDetail.rangeOverflow - the detail error message to be used when
 * input value exceeds the maximum value set.  When not present, the default detail message is
 * the resource defined with the key
 * <code class="prettyprint">oj-validator.range.datetime.messagedetail.rangeOverflow</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {max} - the maximum allowed value<p>
 * Usage: <br/>
 * Entered {value} with max being {max}
 * @property {Object=} messageSummary - optional object literal of custom error summary message
 * to be used.
 * @property {string=} messageSummary.rangeUnderflow - the summary of the error message when
 * input value is less than the set minimum value. When not present, the default message summary is
 * the resource defined with the key
 * <code class="prettyprint">oj-validator.range.datetime.messageSummary.rangeUnderflow</code>.
 * @property {string=} messageSummary.rangeOverflow - the summary of the error message when
 * input value exceeds the maximum value set.  When not present, the default message summary is
 * the resource defined with the key
 * <code class="prettyprint">oj-validator.range.datetime.messageSummary.rangeOverflow</code>.
 */
// Subclass from oj.Validator


oj.Object.createSubclass(DateTimeRangeValidator, Validator, 'oj.DateTimeRangeValidator');
/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @memberof oj.DateTimeRangeValidator
 * @instance
 * @export
 * @ignore
 */

DateTimeRangeValidator.prototype.Init = function (options) {
  DateTimeRangeValidator.superclass.Init.call(this); // if undefined set to null as they are equivalent in terms of logic
  // setting to null for the default validator [min + max option] is taken care of for ojInputDate
  // in _InitOptions for min + max values [default validator]; however
  // user can pass in the validators via validators option so taking care of it here

  this._converter = ConverterUtils.getConverterInstance(options.converter);

  if (!this._converter) {
    this._converter = new __DateTimeConverter.IntlDateTimeConverter();
  }

  if (!this._converter) {
    throw new Error('oj.DateTimeRangeValidator missing a converter option');
  }

  this._min = options.min || null;
  this._max = options.max || null;
  this._translationKey = options.translationKey || 'datetime';

  if (options) {
    this._hint = options.hint || {};
    this._customMessageSummary = options.messageSummary || {};
    this._customMessageDetail = options.messageDetail || {};
  } // random test to check that the specified translation identity exists; otherwise just use datetime


  if (!Translations.getTranslatedString('oj-validator.range.' + this._translationKey + '.messageSummary.rangeOverflow')) {
    this._translationKey = 'datetime';
  }
};
/**
 * Validates the minimum + maximum conditions
 *
 * @param {string} value that is being validated
 * @returns {void}
 * @ojsignature {target: "Type", for: "returns",
 *                value: "void"}
 * @throws {Error} when there is no match
 * @memberof oj.DateTimeRangeValidator
 * @instance
 * @export
 * @method validate
 */


DateTimeRangeValidator.prototype.validate = function (value) {
  var self = this;
  var customMessageSummary = this._customMessageSummary;
  var customMessageDetail = this._customMessageDetail;
  var messageDetailRangeOverflow = customMessageDetail.rangeOverflow;
  var messageDetailRangeUnderflow = customMessageDetail.rangeUnderflow;
  var messageSummaryRangeOverflow = customMessageSummary.rangeOverflow;
  var messageSummaryRangeUnderflow = customMessageSummary.rangeUnderflow;
  var converterUtils = __ConverterUtilsI18n.IntlConverterUtils;
  var min = this._min;
  var max = this._max;
  var summary = '';
  var detail = '';
  var translations = Translations;
  var params = null;
  var minStr;
  var maxStr;

  if (value === null) {
    // request to not throw an error when value being passed is of null
    return;
  }

  var processValidation = function processValidation(converter) {
    if (min) {
      min = converterUtils._minMaxIsoString(min, value);
      minStr = converter ? converter.format(min) : min;
    }

    if (max) {
      max = converterUtils._minMaxIsoString(max, value);
      maxStr = converter ? converter.format(max) : max;
    }

    if (min !== null && max !== null) {
      // range
      if (converter.compareISODates(value, min) >= 0 && converter.compareISODates(value, max) <= 0 || converter.compareISODates(min, max) > 0) {
        return value;
      }
    } else if (min !== null) {
      // only min
      if (converter.compareISODates(value, min) >= 0) {
        return value;
      }
    } else if (max === null || converter.compareISODates(value, max) <= 0) {
      // max only
      return value;
    }

    throw new Error();
  };

  var generateValidationError = function generateValidationError(valStr, converter) {
    if (max !== null && converter.compareISODates(value, max) > 0) {
      params = {
        value: valStr,
        max: maxStr
      };
      summary = messageSummaryRangeOverflow || translations.getTranslatedString('oj-validator.range.' + self._translationKey + '.messageSummary.rangeOverflow');
      detail = messageDetailRangeOverflow ? translations.applyParameters(messageDetailRangeOverflow, params) : translations.getTranslatedString('oj-validator.range.' + self._translationKey + '.messageDetail.rangeOverflow', params);
    } else if (min !== null && converter.compareISODates(value, min) < 0) {
      params = {
        value: valStr,
        min: minStr
      };
      summary = messageSummaryRangeUnderflow || translations.getTranslatedString('oj-validator.range.' + self._translationKey + '.messageSummary.rangeUnderflow');
      detail = messageDetailRangeUnderflow ? translations.applyParameters(messageDetailRangeUnderflow, params) : translations.getTranslatedString('oj-validator.range.' + self._translationKey + '.messageDetail.rangeUnderflow', params);
    }

    return [summary, detail];
  };

  try {
    processValidation(this._converter);
  } catch (e) {
    var valStr = value ? this._converter.format(value) : value;
    var error = generateValidationError(valStr, this._converter);
    throw new oj.ValidatorError(error[0], error[1]);
  }
};
/**
 * A message to be used as hint.
 *
 * @returns {string|null} a hint message or null if no hint is available in the options
 * @memberof oj.DateTimeRangeValidator
 * @instance
 * @export
 * @method getHint
 */


DateTimeRangeValidator.prototype.getHint = function () {
  var hint = null;
  var hints = this._hint;
  var hintInRange = hints.inRange;
  var hintMinimum = hints.min;
  var hintMaximum = hints.max;
  var min = this._min;
  var max = this._max;
  var minStr = min && this._converter ? this._converter.format(min) : min;
  var maxStr = max && this._converter ? this._converter.format(max) : max;
  var params = null;
  var translations = Translations;

  if (min !== null && max !== null) {
    params = {
      min: minStr,
      max: maxStr
    };
    hint = hintInRange ? translations.applyParameters(hintInRange, params) : translations.getTranslatedString('oj-validator.range.' + this._translationKey + '.hint.inRange', params);
  } else if (min !== null) {
    params = {
      min: minStr
    };
    hint = hintMinimum ? translations.applyParameters(hintMinimum, params) : translations.getTranslatedString('oj-validator.range.' + this._translationKey + '.hint.min', params);
  } else if (max !== null) {
    params = {
      max: maxStr
    };
    hint = hintMaximum ? translations.applyParameters(hintMaximum, params) : translations.getTranslatedString('oj-validator.range.' + this._translationKey + '.hint.max', params);
  }

  return hint;
};

  return DateTimeRangeValidator;
});