/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore';
import * as Translations from 'ojs/ojtranslation';
import Validator from 'ojs/ojvalidator';
import { ValidatorError } from 'ojs/ojvalidation-error';

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
 * @export
 * @constructor
 * @final
 * @augments oj.Validator
 * @name oj.LengthValidator
 * @ojtsmodule
 * @ojtsimport {module: "ojvalidator", type: "AMD", importName: "Validator"}
 * @ojsignature [{target: "Type",
 *                value: "class LengthValidator implements Validator<number|string>"},
 *               {target: "Type",
 *                value: "oj.LengthValidator.ValidatorOptions",
 *                for: "options",
 *                jsdocOverride: true}
 *              ]
 * @since 0.7.0
 * @see oj.AsyncLengthValidator
 */
const LengthValidator = function (options) {
  this.Init(options);
};

/**
 * @typedef {object} oj.LengthValidator.ValidatorOptions
 * @property {('codeUnit'|'codePoint')=} countBy - A string that specifies how to count the length. Valid values are
 * <code class="prettyprint">"codeUnit"</code> and <code class="prettyprint">"codePoint"</code>.
 * Defaults to <code class="prettyprint">oj.LengthValidator.defaults.countBy</code> which defaults
 * to <code class="prettyprint">"codeUnit"</code>.<br/>
 * <code class="prettyprint">"codeUnit"</code> uses javascript's length function which counts the
 * number of UTF-16 code units. Here a Unicode surrogate pair has a length of two. <br/>
 * <code class="prettyprint">"codePoint"</code>
 * counts the number of Unicode code points.
 * Here a Unicode surrogate pair has a length of one.<br/>
 * @property {number=} min - a number 0 or greater that is the minimum length of the value.
 * @property {number=} max - a number 1 or greater that is the maximum length of the value.
 * @property {Object=} hint - an optional object literal of hints to be used. If not set,
 * defaults will be used for the validator hint.
 * See the individual hint properties below for details.
 * <p>The hint strings (e.g., hint.min) are  passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with
 * a dollar character ('$').
 * </p>
 * @property {string=} hint.max - a hint message to be used to indicate the allowed maximum.
 * When not present, the default hint is the resource defined with the key
 * <code class="prettyprint">oj-validator.length.hint.max</code>.<p>
 * Tokens: <br/>
 * {max} - the maximum<p>
 * Usage: <br/>
 * Enter {max} or fewer characters
 * @property {string=} hint.min - a hint message to be used to indicate the allowed minimum.
 * When not present, the default hint is the resource defined with the key
 * <code class="prettyprint">oj-validator.length.hint.min</code>.<p>
 * Tokens: <br/>
 * {min} the minimum<p>
 * Usage: <br/>
 * Enter {min} or more characters
 * @property {string=} hint.inRange - a hint message to be used to indicate the allowed range.
 * When not present, the default hint is the resource defined with the key
 * <code class="prettyprint">oj-validator.length.hint.inRange</code>.<p>
 * Tokens: <br/>
 * {min} the minimum<p>
 * {max} - the maximum<p>
 * Usage: <br/>
 * Enter between {min} and {max} characters
 * @property {string=} hint.exact - a hint message to be used, to indicate the exact length.
 * When not present, the default hint is the resource defined with the key
 * <code class="prettyprint">oj-validator.length.hint.exact</code>.<p>
 * Tokens: <br/>
 * {length} the length<p>
 * Usage: <br/>
 * Enter {length} characters
 * @property {Object=} messageDetail - an optional object literal of custom error messages to
 * be used.
 * <p>The messageDetail strings (e.g., messageDetail.tooLong) are  passed as the 'pattern'
 * parameter to [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with
 * a dollar character ('$').
 * </p>
 * @property {string=} messageDetail.tooLong - the detail error message to be used as the error
 * message, when the length of the input value exceeds the maximum value set. When not present, the
 * default detail message is the resource defined with the key
 * <code class="prettyprint">oj-validator.length.messageDetail.tooLong</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {max} - the maximum allowed value<p>
 * Usage: <br/>
 * The {value} has too many characters. Enter {max} or fewer characters, not more.
 * @property {string=} messageDetail.tooShort - the detail error message to be used as the error
 * message, when the length of the input value is less the minimum value set. When not present, the
 * default detail message is the resource defined with the key
 * <code class="prettyprint">oj-validator.length.messageDetail.tooShort</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {min} - the minimum allowed value<p>
 * Usage: <br/>
 * The {value} has too few characters. Enter {min} or more characters, not less.
 * @property {Object=} messageSummary - optional object literal of custom error summary message
 * to be used.
 * <p>The messageSummary strings (e.g., messageSummary.tooLong) are  passed as the 'pattern'
 * parameter to [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with
 * a dollar character ('$').
 * </p>
 * @property {string=} messageSummary.tooLong - the message to be used as the summary error
 * message, when the length of the input value exceeds the maximum value set. When not present, the
 * default message summary is the resource defined with the key
 * <code class="prettyprint">oj-validator.length.messageSummary.tooLong</code>.
 * @property {string=} messageSummary.tooShort - the message to be used as the summary error
 * message, when input value is less than the set minimum value. When not present, the default
 * message summary is the resource defined with the key
 * <code class="prettyprint">oj-validator.length.messageSummary.tooShort</code>.
 */

/**
 * The set of attribute/value pairs that serve as default values
 * when new LengthValidator objects are created.
 * <p>
 * LengthValidator's <code class="prettyprint">countBy</code> option may be changed
 * for the entire application after the 'ojs/ojvalidator-length' module is loaded
 * (each form control module includes the 'ojs/ojvalidator-length' module). If the
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
 * @type object
 * @name defaults
 * @static
 */
LengthValidator.defaults = {
  countBy: 'codeUnit'
};

// Subclass from oj.Validator
oj.Object.createSubclass(LengthValidator, Validator, 'oj.LengthValidator');

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @memberof oj.LengthValidator
 * @instance
 * @export
 * @ignore
 */
LengthValidator.prototype.Init = function (options) {
  var countByOptions = options.countBy;

  LengthValidator.superclass.Init.call(this);

  this._min = options.min !== undefined ? parseInt(options.min, 10) : null;
  this._max = options.max !== undefined ? parseInt(options.max, 10) : null;

  // check that the min/max make sense, otherwise throw an error
  if (isNaN(this._min)) {
    throw new Error("length validator's min option is not a number. min option is " + options.min);
  }
  if (isNaN(this._max)) {
    throw new Error("length validator's max option is not a number. max option is " + options.min);
  }
  if (this._min !== null && this._min < 0) {
    throw new Error(
      "length validator's min option cannot be less than 0. min option is " + options.min
    );
  }
  if (this._max !== null && this._max < 1) {
    throw new Error(
      "length validator's max option cannot be less than 1. max option is " + options.max
    );
  }

  this._countBy = countByOptions === undefined ? LengthValidator.defaults.countBy : countByOptions;

  if (options) {
    this._hint = options.hint || {};
    this._customMessageSummary = options.messageSummary || {};
    this._customMessageDetail = options.messageDetail || {};
  }
};

/**
 * A message to be used as hint, when giving a hint about the expected length. There is no default
 * hint for this property.
 *
 * @returns {string|null} a hint message or null if no hint is available in the options
 * @memberof oj.LengthValidator
 * @instance
 * @export
 * @method getHint
 */
LengthValidator.prototype.getHint = function () {
  var hint = null;
  var hints = this._hint;
  var hintExact = hints.exact;
  var hintInRange = hints.inRange;
  var hintMaximum = hints.max;
  var hintMinimum = hints.min;

  var max = this._max;
  var min = this._min;
  var params;
  var translations = Translations;

  if (min !== null && max !== null) {
    if (min !== max) {
      params = { min: min, max: max };
      hint = hintInRange
        ? translations.applyParameters(hintInRange, params)
        : translations.getTranslatedString('oj-validator.length.hint.inRange', params);
    } else {
      params = { length: min };
      hint = hintExact
        ? translations.applyParameters(hintExact, params)
        : translations.getTranslatedString('oj-validator.length.hint.exact', params);
    }
  } else if (min !== null) {
    params = { min: min };
    hint = hintMinimum
      ? translations.applyParameters(hintMinimum, params)
      : translations.getTranslatedString('oj-validator.length.hint.min', params);
  } else if (max !== null) {
    params = { max: max };
    hint = hintMaximum
      ? translations.applyParameters(hintMaximum, params)
      : translations.getTranslatedString('oj-validator.length.hint.max', params);
  }

  return hint;
};

/**
 * Validates the length of value is greater than minimum and/or less than maximum.
 * @param {string|number} value that is being validated
 * @returns {void}
 * @ojsignature {target: "Type", for: "returns",
 *                value: "void"}
 * @throws {Error} when the length is out of range.
 * @export
 * @memberof oj.LengthValidator
 * @instance
 * @method validate
 */
LengthValidator.prototype.validate = function (value) {
  var customMessageDetail = this._customMessageDetail;
  var customMessageSummary = this._customMessageSummary;
  var detail = '';
  var max = this._max;
  var messageSummaryTooLong = customMessageSummary.tooLong;
  var messageSummaryTooShort = customMessageSummary.tooShort;
  var messageTooLong = customMessageDetail.tooLong;
  var messageTooShort = customMessageDetail.tooShort;
  var min = this._min;
  var params;
  var summary = '';
  var translations = Translations;
  var string = '' + value;
  var length = this._getLength(string);

  // If only min is set and length is at least min, or
  // if only max is set and length is at most max, or
  // if length is between min and max or
  // if neither min or max is set return with no error.
  if ((min === null || length >= this._min) && (max === null || length <= this._max)) {
    return;
  }

  if (length < this._min) {
    // too short
    params = { value: value, min: min };
    summary = messageSummaryTooShort
      ? translations.applyParameters(messageSummaryTooShort, params)
      : translations.getTranslatedString('oj-validator.length.messageSummary.tooShort');
    detail = messageTooShort
      ? translations.applyParameters(messageTooShort, params)
      : translations.getTranslatedString('oj-validator.length.messageDetail.tooShort', params);
  } else {
    // too long
    params = { value: value, max: max };
    summary = messageSummaryTooLong
      ? translations.applyParameters(messageSummaryTooLong, params)
      : translations.getTranslatedString('oj-validator.length.messageSummary.tooLong');
    detail = messageTooLong
      ? translations.applyParameters(messageTooLong, params)
      : translations.getTranslatedString('oj-validator.length.messageDetail.tooLong', params);
  }

  throw new ValidatorError(summary, detail);
};

/**
 * @returns {number} the length of the text counted by UTF-16 codepoint
 *  or codeunit as specified in the countBy option.
 * @private
 */
LengthValidator.prototype._getLength = function (text) {
  var countBy = this._countBy.toLowerCase();
  var codeUnitLength = text.length;
  var length;
  var surrogateLength = 0;

  switch (countBy) {
    case 'codepoint':
      // if countBy is "codePoint", then count supplementary characters as length of one
      // For UTF-16, a "Unicode  surrogate pair" represents a single supplementary character.
      // The first (high) surrogate is a 16-bit code value in the range U+D800 to U+DBFF.
      // The second (low) surrogate is a 16-bit code value in the range U+DC00 to U+DFFF.
      // This code figures out if a charCode is a high or low surrogate and if so,
      // increments surrogateLength
      for (var i = 0; i < codeUnitLength; i++) {
        // eslint-disable-next-line no-bitwise
        if ((text.charCodeAt(i) & 0xf800) === 0xd800) {
          surrogateLength += 1;
        }
      }
      // e.g., if the string is two supplementary characters, codeUnitLength is 4, and the
      // surrogateLength is 4, so we will return two.
      oj.Assert.assert(
        surrogateLength % 2 === 0,
        'the number of surrogate chars must be an even number.'
      );
      length = codeUnitLength - surrogateLength / 2;
      break;
    case 'codeunit':
    default:
      // Javascript's length function counts # of code units.
      // A supplementary character has a length of 2 code units.
      length = codeUnitLength;
  }
  return length;
};

export default LengthValidator;
