/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'ojs/ojtranslation', 'ojs/ojvalidator', 'ojs/ojvalidation-error'], function (oj, Translations, Validator, ojvalidationError) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  Validator = Validator && Object.prototype.hasOwnProperty.call(Validator, 'default') ? Validator['default'] : Validator;

  /**
   * Constructs a RequiredValidator that ensures that the value provided is not empty.
   * @param {Object=} options an object literal used to provide an optional hint and error message.<p>
   *
   * @export
   * @constructor
   * @final
   * @augments oj.Validator
   * @name oj.RequiredValidator
   * @ojtsimport {module: "ojvalidator", type: "AMD", importName: "Validator"}
   * @ojtsmodule
   * @ojsignature [{target: "Type", value: "class RequiredValidator implements Validator<object|string|number>"},
   *               {target: "Type", value: "oj.RequiredValidator.ValidatorOptions", for: "options", jsdocOverride: true}]
   * @since 0.6.0
   * @see oj.AsyncRequiredValidator
   *
   */
  const RequiredValidator = function (options) {
    this.Init(options);
  };

  // Subclass from oj.Object or oj.Validator. It does not matter
  oj.Object.createSubclass(RequiredValidator, Validator, 'oj.RequiredValidator');

  // key to access required validator specific resources in the bundle
  RequiredValidator._BUNDLE_KEY_DETAIL = 'oj-validator.required.detail';
  RequiredValidator._BUNDLE_KEY_SUMMARY = 'oj-validator.required.summary';

  /**
   * @typedef {object} oj.RequiredValidator.ValidatorOptions
   * @property {string=} hint an optional hint text. There is no default hint provided by this
   * validator.
   * @property {string=} label - an optional label text used when the {label} token is passed
   * into messageSummary or messageDetail.
   * @property {string=} messageSummary - an optional custom error message summarizing the
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
   * @property {(string|function(Object):string)=} messageDetail - an optional custom error message used for creating the detail part
   * of the message, when the value provided is empty. When not present, the default message detail is the
   * resource defined with the key <code class="prettyprint">oj-validator.required.detail</code>.
   * <p>If messageDetail is a string, the messageDetail string is passed as the 'pattern' parameter to
   * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
   * that documentation, if you are using a reserved character, you need to escape it with
   * a dollar character ('$').
   * </p>
   * <p>Tokens: {label} - this token can be used to substitute the label of the component at runtime.</p>
   * <p>
   * Example:<br/>
   * "A value is required for the field '{label}'."<br/>
   * </p>
   * <p>If messageDetail is a function, the messageDetail function is called with the {label} parameter.
   * <p>
   * Example:<br/>
   * messageDetail: (p: {label}) => `A value is required for the field '${p.label}'.`<br/>
   * </p>
   * @ojsignature {
   *   target: "Type",
   *   value: "?(string|(({label: string}) => string))",
   *   for: "messageDetail",
   *   jsdocOverride: true
   * }
   */
  /**
   * Initializes validator instance with the set options
   * @param {Object=} options
   * @memberof oj.RequiredValidator
   * @instance
   * @ignore
   */
  RequiredValidator.prototype.Init = function (options) {
    RequiredValidator.superclass.Init.call(this);
    this._options = options;
  };

  /**
   * Validates value to be non-empty
   *
   * @param {any} value value that is being validated
   * @returns {void}
   * @throws {Error} when fails required-ness check
   * @ojsignature {target: "Type", for: "returns",
   *                value: "void"}
   * @memberof oj.RequiredValidator
   * @instance
   * @export
   * @method validate
   */
  RequiredValidator.prototype.validate = function (value) {
    var detail;
    var label = '';
    var localizedDetail;
    var localizedSummary;
    var summary;
    var params = {};

    // checks for empty arrays and String. Objects are considered non-null.
    if (
      value !== undefined &&
      value !== null &&
      !((typeof value === 'string' || value instanceof Array) && value.length === 0)
    ) {
      return;
    }

    if (this._options) {
      // we have deprecated support for message param and instead use messageDetail.
      detail = this._options.messageDetail || this._options.message || null;
      summary = this._options.messageSummary || null;
      label = this._options.label || '';
    }
    params = { label: label };
    localizedSummary = summary
      ? Translations.applyParameters(summary, params)
      : Translations.getTranslatedString(this._getSummaryKey(), params);
    if (detail === null || detail === undefined || typeof detail === 'string') {
      localizedDetail = detail
        ? Translations.applyParameters(detail, params)
        : Translations.getTranslatedString(this._getDetailKey(), params);
    } else if (typeof detail === 'function') {
      // function, so pass in parameters.
      localizedDetail = detail(params);
    }

    throw new ojvalidationError.ValidatorError(localizedSummary, localizedDetail);
  };

  /**
   * A message to be used as hint, when giving a hint on the expected pattern. There is no default
   * hint for this property.
   *
   * @returns {string|null} a hint message or null if no hint is available in the options
   * @memberof oj.RequiredValidator
   * @instance
   * @export
   * @method getHint
   */
  RequiredValidator.prototype.getHint = function () {
    var hint = '';
    if (this._options && this._options.hint) {
      hint = Translations.getTranslatedString(this._options.hint);
    }

    return hint;
  };

  RequiredValidator.prototype._getSummaryKey = function () {
    return RequiredValidator._BUNDLE_KEY_SUMMARY;
  };

  RequiredValidator.prototype._getDetailKey = function () {
    return RequiredValidator._BUNDLE_KEY_DETAIL;
  };

  return RequiredValidator;

});
