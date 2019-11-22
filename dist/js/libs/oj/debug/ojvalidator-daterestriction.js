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
 * Constructs a DateRestrictionValidator that ensures the value provided is
 * not in a disabled entry of dayMetaData.
 * @param {Object=} options an object literal used to provide the following properties
 * @export
 * @constructor
 * @final
 * @since 0.6.0
 * @augments oj.Validator
 * @name oj.DateRestrictionValidator
 * @ojtsmodule
 * @ojtsimport {module: "ojvalidator", type: "AMD", importName: "Validator"}
 * @ojtsimport {module: "ojconverter-datetime", type:"AMD", imported: ["DateTimeConverter"]}
 * @ojsignature [{target: "Type",
 *                value: "class DateRestrictionValidator implements Validator<string>"},
 *               {target: "Type",
 *                value: "oj.DateRestrictionValidator.ValidatorOptions",
 *                for: "options", jsdocOverride: true}
 *              ]
 * @see oj.AsyncDateRestrictionValidator
 */
var DateRestrictionValidator = function _DateRestrictionValidator(options) {
  this.Init(options);
};

/**
 * Input type for the dayFormatter option call back function
 * @typedef {object} oj.DateRestrictionValidator.DayFormatterInput
 * @property {number} fullYear
 * @property {number} month
 * @property {number} date
 */
/**
 * Output type for the dayFormatter option call back function
 * @typedef {object} oj.DateRestrictionValidator.DayFormatterOutput
 * @property {boolean=} disabled
 * @property {string=} className
 * @property {string=} tooltip
 */
/**
 * @typedef {object} oj.DateRestrictionValidator.ValidatorOptions
 * @property {oj.DateTimeConverter=} converter - an instance implementation of oj.DateTimeConverter (i.e. oj.IntlDateTimeConverter).
 * It is used to change the format of the value shown in a validation error message if the {value} token is used in messageSummary or messageDetail.
 * Defaults to a new instance of IntlDateTimeConverter.
 * @property {(function(oj.DateRestrictionValidator.DayFormatterInput): (oj.DateRestrictionValidator.DayFormatterOutput|null|'all'))=} dayFormatter - Additional info to be used when rendering the day. This
 * should be a JavaScript Function callback which accepts as its argument the following JSON format
 * <code class="prettyprint">{fullYear: Date.getFullYear(), month: Date.getMonth()+1, date: Date.getDate()}</code>
 * and returns <code class="prettyprint">null</code> or all or partial JSON data of the form
 * <code class="prettyprint">{disabled: true|false, className: "additionalCSS", tooltip: 'Stuff to display'}</code>
 * @property {string=} messageSummary - an optional custom error message summarizing the
 * error. When not present, the default message summary is the resource defined with the key
 * <code class="prettyprint">oj-validator.restriction.date.messageSummary</code>.
 * Tokens: {value} - value entered by user<p>.
 * Example:<br/>
 * "Value {value} is disabled."<br/>
 * <p>
 * @property {string=} messageDetail - a custom error message used for creating detail part
 * of message. When not present, the default message detail is the
 * resource defined with the key <code class="prettyprint">oj-validator.restriction.date.messageDetail</code>.
 * Tokens: {value} - value entered by user<p>.
 * Example:<br/>
 * "Value {value} is a disabled entry. Please select a different date."<br/>
 * </p>
 */

// Subclass from oj.Validator
oj.Object.createSubclass(DateRestrictionValidator, oj.Validator, 'oj.DateRestrictionValidator');

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @memberof oj.DateRestrictionValidator
 * @instance
 * @ignore
 * @export
 */
DateRestrictionValidator.prototype.Init = function (options) {
  DateRestrictionValidator.superclass.Init.call(this);
  this._dayFormatter = options.dayFormatter;
  this._converter = ConverterUtils.getConverterInstance(options.converter);
  if (!this._converter) {
    this._converter = new __DateTimeConverter.IntlDateTimeConverter();
  }
  if (options) {
    this._messageSummary = options.messageSummary || null;
    this._messageDetail = options.messageDetail || null;
  }
};

/**
 * Validates whether the date provided is part of disabled date
 *
 * @private
 * @ignore
 * @param {Object|string} valueDateParam that is being validated. Note it is set to string as well to keep gc happy
 * @returns {boolean} boolean of whether it is a disabled date
 */
DateRestrictionValidator.prototype._inDisabled = function (valueDateParam) {
  var dayFormatter = this._dayFormatter;

  if (dayFormatter) {
    var fullYear = valueDateParam.fullYear;
    var month = valueDateParam.month + 1; // request to start from 1 rather than 0
    var date = valueDateParam.date;
    var metaData = dayFormatter({ fullYear: fullYear, month: month, date: date });

    return metaData && metaData.disabled;
  }

  return false;
};

/**
 * Validates whether the date provided is part of disabled date
 *
 * @param {string} value that is being validated
 * @returns {void}
 * @throws {Error} when there is no match
 * @ojsignature {target: "Type", for: "returns",
 *                value: "void"}
 * @memberof oj.DateRestrictionValidator
 * @instance
 * @export
 * @method validate
 */
DateRestrictionValidator.prototype.validate = function (value) {
  var summary = '';
  var detail = '';
  var translations = Translations;
  var messageSummary = this._messageSummary;
  var messageDetail = this._messageDetail;
  var valueDateParam = value ?
  __ConverterUtilsI18n.IntlConverterUtils._dateTime(value, ['fullYear', 'month', 'date'], true) : null;

  if (value === null) {
    return value;
  }

  if (this._inDisabled(valueDateParam)) {
    var generateValidationError = function (valueStr) {
      summary = (messageSummary ?
                 translations.applyParameters(messageSummary, { value: valueStr }) :
                 translations.getTranslatedString('oj-validator.restriction.date.messageSummary',
                                                  { value: valueStr }));
      detail = (messageDetail ?
                translations.applyParameters(messageDetail, { value: valueStr }) :
                translations.getTranslatedString('oj-validator.restriction.date.messageDetail',
                                                 { value: valueStr }));
      return [summary, detail];
    };

    var valueStr = value ? this._converter.format(value) : value;
    var error = generateValidationError(valueStr);
    throw new oj.ValidatorError(error[0], error[1]);
  }
  return value;
};

/**
 * A message to be used as hint. As there exists no hint for DateRestrictionValidator, default is to return null.
 *
 * @returns {string|null} a hint message or null if no hint is available in the options
 * @memberof oj.DateRestrictionValidator
 * @instance
 * @export
 * @method getHint
 */
DateRestrictionValidator.prototype.getHint = function () {
  return null;
};


  return DateRestrictionValidator;
});