/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore';
import Message from 'ojs/ojmessaging';

// ValidatorError

/**
 * Constructs a ValidatorError instance from a summary and detail
 *
 * @param {string} summary a localized String that provides a summary of the error
 * @param {string} detail a localized String that provides a detail of the error
 * @example <caption>throw new oj.ValidationError from custom validator's validate method</caption>
 *  // A custom validator whose validate method ensures that the value is not 'junk'.
 *  self.noJunkValidator = {
 *  'validate' : function (value)
 *  {
 *    value = value + "";
 *    if (value && value.toLowerCase()  === "junk")
 *    {
 *      throw new ValidatorError("Invalid value", "You cannot enter a value that is 'junk'!!");
 *    }
 *    return;
 *    }
 *  };
 * @constructor
 * @final
 * @ojtsnoexport
 * @ojtsexportastype
 * @ojtsimport {module: "ojmessaging", type: "AMD", importName: "Message"}
 * @since 0.6.0
 * @export
 */
const ValidatorError = function (summary, detail) {
  var message = {
    summary: summary,
    detail: detail,
    severity: Message.SEVERITY_LEVEL.ERROR
  };
  this.Init(message);
};

ValidatorError.prototype = new Error();

oj._registerLegacyNamespaceProp('ValidatorError', ValidatorError);

/**
 * Initializes the instance.
 * @param {Object} message an Object that duck-types oj.Message which is an
 * Object with summary, detail, and severity keys. The severity is
 * oj.Message.SEVERITY_LEVEL['ERROR'].
 * @export
 * @ignore
 */
ValidatorError.prototype.Init = function (message) {
  var detail = message.detail;
  var summary = message.summary;
  this._message = message;

  // so browser can get to e.name and e.message
  this.name = 'Validator Error';
  this.message = detail || summary;
};

/**
 * Returns an Object that duck-types oj.Message which is an
 * Object with summary, detail, and severity properties. The severity is
 * oj.Message.SEVERITY_LEVEL['ERROR']
 *
 * @example <caption>get the oj.ValidationError that was thrown and get the message</caption>
 * var ojmessage = valError.getMessage();
 * var severity = ojmessage['severity'] || oj.Message.SEVERITY_LEVEL['ERROR'];
 * var summary = ojmessage['summary'];
 * var detail = ojmessage['detail'];
 * @returns {Object} an Object that duck-types oj.Message which is an
 * Object with summary, detail, and severity properties.
 * The severity is
 * oj.Message.SEVERITY_LEVEL['ERROR']
 * @ojsignature {target: "Type", value: "oj.Message", for: "returns"}
 * @export
 */
ValidatorError.prototype.getMessage = function () {
  return this._message;
};

// ConverterError

/**
 * Constructs a ConverterError instance from a summary and detail
 *
 * @param {string} summary a localized String that provides a summary of the error
 * @param {string} detail a localized String that provides a detail of the error
 * @constructor
 * @final
 * @ojtsnoexport
 * @ojtsexportastype
 * @since 0.6.0
 * @export
 */
const ConverterError = function (summary, detail) {
  var message = {
    summary: summary,
    detail: detail,
    severity: Message.SEVERITY_LEVEL.ERROR
  };
  this.Init(message);
};

ConverterError.prototype = new Error();

oj._registerLegacyNamespaceProp('ConverterError', ConverterError);

/**
 * Initializes the instance.
 * @param {Object} message an Object that duck-types oj.Message which is an
 * Object with summary, detail, and severity properties.
 * @export
 * @ignore
 */
ConverterError.prototype.Init = function (message) {
  var detail = message.detail;
  var summary = message.summary;
  this._message = message;

  // so browser can get to e.name and e.message
  this.name = 'Converter Error';
  this.message = detail || summary;
};

/**
 * Returns an Object that duck-types oj.Message which is an
 * Object with summary, detail, and severity properties.
 *
 * @return {Object} an Object that duck-types oj.Message which is an
 * Object with summary, detail, and severity properties.
 * @ojsignature {target: "Type", value: "oj.Message", for: "returns"}
 * @export
 */
ConverterError.prototype.getMessage = function () {
  return this._message;
};

export { ConverterError, ValidatorError };
