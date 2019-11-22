/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojtranslation', 'ojs/ojvalidator',
'ojs/ojvalidation-error'], 
function(oj, Translations, Validator)
{
  "use strict";


/* global Translations:false, Validator:false */

/**
 * Constructs a RegExpValidator that ensures the value matches the provided pattern.
 * @param {Object=} options an object literal used to provide the pattern, an optional hint and error
 * message.
 * @export
 * @constructor
 * @final
 * @augments oj.Validator
 * @name oj.RegExpValidator
 * @ojtsimport {module: "ojvalidator", type: "AMD", importName: "Validator"}
 * @ojtsmodule
 * @ojsignature [{target: "Type",
 *                value: "class RegExpValidator implements Validator<string|number>"},
 *               {target: "Type",
 *                value: "oj.RegExpValidator.ValidatorOptions",
 *                for: "options", jsdocOverride: true}
 *              ]
 * @since 0.6.0
 * @see oj.AsyncRegExpValidator
 */
var RegExpValidator = function RegExpValidator(options) {
  this.Init(options);
}; // Subclass from oj.Object or oj.Validator. It does not matter


oj.Object.createSubclass(RegExpValidator, Validator, 'oj.RegExpValidator'); // key to access required validator specific resources in the bundle

RegExpValidator._BUNDLE_KEY_DETAIL = 'oj-validator.regExp.detail';
RegExpValidator._BUNDLE_KEY_SUMMARY = 'oj-validator.regExp.summary';
/**
 * @typedef {object} oj.RegExpValidator.ValidatorOptions
 * @property {string=} pattern - a regexp pattern that the validator matches a value against.<p>
 * Example:<br/>
 * '\\d{10}'
 * @property {string=} hint - an optional hint text. There is no default hint provided by the
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
 * @property {string=} label - an optional label text used when the {label} token is passed
 * into messageSummary or messageDetail.
 * @property {string=} messageSummary - a custom error message summarizing the error when the
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
 * @property {string=} messageDetail - a custom error message to be used for creating detail
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
 */

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @memberof oj.RegExpValidator
 * @instance
 * @ignore
 */

RegExpValidator.prototype.Init = function (options) {
  RegExpValidator.superclass.Init.call(this);
  this._options = options;
};
/**
 * Validates value for matches using the regular expression provided by the pattern. This method
 * does not raise an error when value is the empty string or null; the method returns true indicating
 * that the validation was successful. If the application wants the empty string to fail validation,
 * then the application should chain in the required validator (e.g., set required on the input).
 *
 * @param {string|number} value that is being validated
 * @returns {void}
 * @ojsignature {target: "Type", for: "returns",
 *                value: "void"}
 *
 * @throws {Error} when there is no match
 * @memberof oj.RegExpValidator
 * @instance
 * @export
 * @method validate
 */


RegExpValidator.prototype.validate = function (value) {
  var detail;
  var label;
  var summary;
  var pattern = this._options && this._options.pattern || ''; // don't validate null or empty string; per 
  // There are one of two ways we could handle the empty string:
  // 1) blow up on null and then require that customers wrap the validator with one that
  // succeeds on null if they don’t like the behavior
  // 2) Accept null and expect that the application will chain in the required checked if necessary
  // As a team we decided 2) was better than 1).

  if (value === null || value === undefined || value === '') {
    return;
  } // when using digits as input values parseString becomes a integer type, so get away with it.


  var valueString = value.toString(); // We intend that the pattern provided is matched exactly

  var exactPattern = '^(' + pattern + ')$';
  var matchArr = valueString.match(exactPattern);

  if (!(matchArr !== null && matchArr[0] === valueString)) {
    if (this._options) {
      summary = this._options.messageSummary || null;
      detail = this._options.messageDetail || null;
      label = this._options && this._options.label || '';
    }

    var params = {
      label: label,
      pattern: pattern,
      value: valueString
    };
    var localizedSummary = summary ? Translations.applyParameters(summary, params) : Translations.getTranslatedString(this._getSummaryKey(), params);
    var localizedDetail = detail ? Translations.applyParameters(detail, params) : Translations.getTranslatedString(this._getDetailKey(), params);
    throw new oj.ValidatorError(localizedSummary, localizedDetail);
  }
};
/**
 * A message to be used as hint, when giving a hint on the expected pattern. There is no default
 * hint for this property.
 *
 * @returns {string|null} a hint message or null if no hint is available in the options
 * @memberof oj.RegExpValidator
 * @instance
 * @export
 * @method getHint
 */


RegExpValidator.prototype.getHint = function () {
  var hint = null;
  var params = {};

  if (this._options && this._options.hint) {
    params = {
      pattern: this._options.pattern
    };
    hint = Translations.applyParameters(this._options.hint, params);
  }

  return hint;
};

RegExpValidator.prototype._getSummaryKey = function () {
  return RegExpValidator._BUNDLE_KEY_SUMMARY;
};

RegExpValidator.prototype._getDetailKey = function () {
  return RegExpValidator._BUNDLE_KEY_DETAIL;
};

  return RegExpValidator;
});