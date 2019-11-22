/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojtranslation', 'ojs/ojconverterutils', 
'ojs/ojvalidator', 'ojs/ojvalidation-error'], 
function(oj, Translations, ConverterUtils, Validator)
{
  "use strict";

/* global Promise:false, ConverterUtils: false, Translations:false, Validator:false */
/**
 * Constructs a NumberRangeValidator that ensures the value provided is within a given range.
 * @param {Object=} options an object literal used to provide the following properties
 * @export
 * @constructor
 * @final
 * @augments oj.Validator
 * @name oj.NumberRangeValidator
 * @ojtsimport {module: "ojvalidator", type: "AMD", importName: "Validator"}
 * @ojtsimport {module: "ojconverter-number", type:"AMD", imported: ["NumberConverter"]}
 * @ojtsmodule
 * @ojsignature [{target: "Type",
 *                value: "class NumberRangeValidator implements Validator<string|number>"},
 *               {target: "Type",
 *                value: "oj.NumberRangeValidator.ValidatorOptions",
 *                for: "options", jsdocOverride: true}
 *              ]
 * @since 0.7.0
 * @see oj.AsyncNumberRangeValidator
 *
 */
var NumberRangeValidator = function _NumberRangeValidator(options) {
  this.Init(options);
};

// Subclass from oj.Validator
oj.Object.createSubclass(NumberRangeValidator, Validator, 'oj.NumberRangeValidator');

/**
 * @typedef {object} oj.NumberRangeValidator.ValidatorOptions
 * @property {oj.NumberConverter=} converter - an instance implementation of oj.NumberConverter.
 * It is used to format the value in error message. It is optional for the validator that a converter is passed in.
 * @property {number=} min - the minimum number value of the entered value.
 * @property {number=} max - the maximum number value of the entered value.
 * @property {Object=} hint - an optional object literal of hints to be used.
 * <p>The hint strings (e.g., hint.min) are  passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with
 * a dollar character ('$').
 * </p>
 * @property {string=} hint.max - a hint used to indicate the allowed maximum. When not present,
 * the default hint is the resource defined with the key
 * <code class="prettyprint">oj-validator.range.number.hint.max</code>.<p>
 * Tokens: <br/>
 * {max} - the maximum<p>
 * Usage: <br/>
 * Enter a number less than or equal to {max}
 * @property {string=} hint.min - a hint used to indicate the allowed minimum. When not present,
 * the default hint is the resource defined with the key
 * <code class="prettyprint">oj-validator.range.number.hint.min</code>.<p>
 * Tokens: <br/>
 * {min} the minimum <p>
 * Usage: <br/>
 * Enter a number greater than or equal to {min}</li>
 * @property {string=} hint.inRange - a hint used to indicate the allowed range. When not
 * present, the default hint is the resource defined with the key
 * <code class="prettyprint">oj-validator.range.number.hint.inRange</code>.<p>
 * Tokens:<br/>
 * {min} the minimum<br/>
 * {max} the maximum<p>
 * Usage: <br/>
 * Enter a number between {min} and {max}
 * @property {string=} hint.exact - a hint used to indicate the allowed value.
 * This is used when min and max are non-null and are equal to each other.
 * When not present, the default hint is the resource defined with the key
 * <code class="prettyprint">oj-validator.range.number.hint.exact</code>.<p>
 * Tokens:<br/>
 * {num} the number allowed<br/>
 * Usage: <br/>
 * Enter the number {num}
 * @since 3.0.0
 * @property {Object=} messageDetail - an optional object literal of custom error messages to
 * be used.
 * <p>The messageDetail strings (e.g., messageDetail.rangeUnderflow) are  passed as the 'pattern'
 * parameter to [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with
 * a dollar character ('$').
 * </p>
 * @property {string=} messageDetail.rangeUnderflow - the detail error message to be used when
 * input value is less than the set minimum value. When not present, the default detail message is
 * the resource defined with the key
 * <code class="prettyprint">oj-validator.range.number.messageDetail.rangeUnderflow</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {min} - the minimum allowed value<p>
 * Usage: <br/>
 * The number must be greater than or equal to {min}.
 * @property {string=} messageDetail.rangeOverflow - the detail error message to be used when
 * input value exceeds the maximum value set. When not present, the default detail message is
 * the resource defined with the key
 * <code class="prettyprint">oj-validator.range.number.messageDetail.rangeOverflow</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {max} - the maximum allowed value<p>
 * Usage: <br/>
 * The number must be less than or equal to {max}.
 * @property {string=} messageDetail.exact - the detail error message to be used when the
 * input value is not between min and max when min and max are both non-null and equal.
 *  When not present, the default detail message is the resource defined with the key
 * <code class="prettyprint">oj-validator.range.number.messageDetail.exact</code>.<p>
 * Tokens:<br/>
 * {num} - the allowed value<p>
 * Usage: <br/>
 * The number must be {num}.
 * @since 3.0.0
 * @property {Object=} messageSummary - optional object literal of custom error summary message
 * to be used.
 * @property {string=} messageSummary.rangeUnderflow - the summary of the error message when
 * input value is less than the set minimum value. When not present, the default message summary is
 * the resource defined with the key
 * <code class="prettyprint">oj-validator.range.number.messageSummary.rangeUnderflow</code>.
 * @property {string=} messageSummary.rangeOverflow - the summary of the error message when
 * input value exceeds the maximum value set.  When not present, the default message summary is
 * the resource defined with the key
 * <code class="prettyprint">oj-validator.range.number.messageSummary.rangeOverflow</code>.
 */

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @memberof oj.NumberRangeValidator
 * @instance
 * @export
 * @ignore
 */
NumberRangeValidator.prototype.Init = function (options) {
  NumberRangeValidator.superclass.Init.call(this);

  if (options) {
    this._min = options.min;
    this._max = options.max;
    this._converter =
     ConverterUtils.getConverterInstance(options.converter);
    this._hint = options.hint || {};
    this._customMessageSummary = options.messageSummary || {};
    this._customMessageDetail = options.messageDetail || {};
  }
};

/**
 * Validates the minimum + maximum conditions
 *
 * @param {string|number} value that is being validated
 * @returns {void}
 *
 * @throws {Error} when value is out of range
 * @ojsignature {target: "Type", for: "returns",
 *                value: "void"}
 * @memberof oj.NumberRangeValidator
 * @instance
 * @export
 * @method validate
 */
NumberRangeValidator.prototype.validate = function (value) {
  var string = value ? value.toString() : value;
  var numberValue = parseFloat(string);
  var customMessageSummary = this._customMessageSummary;
  var customMessageDetail = this._customMessageDetail;
  var messageDetailRangeOverflow = customMessageDetail.rangeOverflow;
  var messageDetailRangeUnderflow = customMessageDetail.rangeUnderflow;
  var messageDetailExact = customMessageDetail.exact;
  var messageSummaryRangeOverflow = customMessageSummary.rangeOverflow;
  var messageSummaryRangeUnderflow = customMessageSummary.rangeUnderflow;
  var min = this._min !== undefined ? parseFloat(this._min) : null;
  var max = this._max !== undefined ? parseFloat(this._max) : null;
  var summary = '';
  var detail = '';
  var params = null;
  var translations = Translations;

  if (value === null) {
    // request to not throw an error when value being passed is of null
    return;
  }

  if (min !== null && max !== null) {
    // range
    if ((numberValue >= min && numberValue <= max) || min > max) {
      return;
    }
  } else if (min !== null) {
    // only min
    if (numberValue >= min) {
      return;
    }
  } else if (max === null || numberValue <= max) {
    // max only or no min or max
    return;
  }

  var generateValidationError = function (minStr, maxStr) {
    // if we haven't returned with an OK, then we need to throw a ValidatorError
    //
    // First check if we have both a max and a min and if they are equal. If so the message will
    // be the messageDetail.exact message, like "Enter the number 1"
    if (max !== null && min !== null && min === max) {
      params = { value: value, num: maxStr };
      detail = messageDetailExact ?
        translations.applyParameters(messageDetailExact, params) :
        translations.getTranslatedString('oj-validator.range.number.messageDetail.exact', params);
      // if number is greater than max, the summary may say "The number is too high"
      if (numberValue > max) {
        summary = messageSummaryRangeOverflow ||
          translations.getTranslatedString('oj-validator.range.number.messageSummary.rangeOverflow');
      } else if (numberValue < min) {
      // if number is less than min, the summary may say "The number is too low"
        summary = messageSummaryRangeOverflow ?
          messageSummaryRangeUnderflow :
          translations.getTranslatedString('oj-validator.range.number.messageSummary.rangeUnderflow');
      }
    } else if (max !== null && numberValue > max) {
      // Next check if we have a max, and the number we are validating is greater than the max
      // throw an error,
      // like "The number is too high." and "The number must be less than or equal to {max}"
      params = { value: value, max: maxStr };
      summary = messageSummaryRangeOverflow ||
        translations.getTranslatedString('oj-validator.range.number.messageSummary.rangeOverflow');
      detail = messageDetailRangeOverflow ?
        translations.applyParameters(messageDetailRangeOverflow, params) :
        translations.getTranslatedString(
          'oj-validator.range.number.messageDetail.rangeOverflow',
          params
        );
    } else {
      // Else the number we are validating is less than the min, throw an error,
      // like "The number is too low." and "The number must be greater than or equal to {min}"
      params = { value: value, min: minStr };
      summary = messageSummaryRangeUnderflow ||
        translations.getTranslatedString('oj-validator.range.number.messageSummary.rangeUnderflow');
      detail = messageDetailRangeUnderflow ?
        translations.applyParameters(messageDetailRangeUnderflow, params) :
        translations.getTranslatedString(
          'oj-validator.range.number.messageDetail.rangeUnderflow',
          params
        );
    }
    return [summary, detail];
  };

  var minStr = min && this._converter ? this._converter.format(min) : min;
  var maxStr = max && this._converter ? this._converter.format(max) : max;
  var error = generateValidationError(minStr, maxStr);
  throw new oj.ValidatorError(error[0], error[1]);
};

/**
 * @returns {string|null} a hint message or null if no hint is available in the options.
 * A hint message may be like "Enter a value between {min} and {max}"
 * or "Enter a number greater than or equal to {min}"
 * @memberof oj.NumberRangeValidator
 * @instance
 * @export
 * @method getHint
 */
NumberRangeValidator.prototype.getHint = function () {
  var hints = this._hint;
  var hintInRange = hints.inRange;
  var hintExact = hints.exact;
  var hintMinimum = hints.min;
  var hintMaximum = hints.max;
  var translations = Translations;
  var min = this._min !== undefined ? parseFloat(this._min) : null;
  var max = this._max !== undefined ? parseFloat(this._max) : null;

  var generateHintText = function (minStr, maxStr) {
    var hint = null;
    // if both min and max are specified, the hint may say something like "Enter a value
    // between {min} and {max}".
    if (min !== null && max !== null) {
      if (min !== max) {
        // if hintInRange is specified (validator's hint.inRange option is set),
        // use that string, else use the default.
        hint = (hintInRange ?
                translations.applyParameters(hintInRange, { min: minStr, max: maxStr }) :
                translations.getTranslatedString('oj-validator.range.number.hint.inRange',
                                                 { min: minStr, max: maxStr }));
      } else {
        // if hintExact is specified (validator's hint.exact option is set),
        // use that string, else use the default.
        hint = (hintExact ?
                translations.applyParameters(hintExact, { num: minStr }) :
                translations.getTranslatedString('oj-validator.range.number.hint.exact',
                                                 { num: minStr }));
      }
    } else if (min !== null) {
      // else if min is specified, the hint may say something like "Enter a value
      // greater than or equal to {min}".

      // if hintMinimum is specified (validator's hint.min option is set),
      // use that string, else use the default.
      hint = (hintMinimum ?
              translations.applyParameters(hintMinimum, { min: minStr }) :
              translations.getTranslatedString('oj-validator.range.number.hint.min',
                                               { min: minStr }));
    } else if (max !== null) {
      // else if max is specified, the hint may say something like "Enter a value
      // less than or equal to {max}".

      // if hintMaximum is specified (validator's hint.max option is set),
      // use that string, else use the default.
      hint = (hintMaximum ?
              translations.applyParameters(hintMaximum, { max: maxStr }) :
              translations.getTranslatedString('oj-validator.range.number.hint.max',
                                               { max: maxStr }));
    }
    return hint;
  };

  var minStr = min && this._converter ? this._converter.format(min) : min;
  var maxStr = max && this._converter ? this._converter.format(max) : max;

  return generateHintText(minStr, maxStr);
};


  return NumberRangeValidator;
});