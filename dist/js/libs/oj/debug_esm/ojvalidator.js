/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore';

/**
 * Validator Contract
 * @ignore
 */

/**
 *  @example <caption>Create a Validator and implement its methods.</caption>
 *
 *  //Validator to ensure that the selected time is a multiple of 15 minute interval.
 *  //This converter takes in a converter option which will be used to format the hint/error
 *  //message shown to the user. It is mandatory to pass the converter option.
 *  var TimeIncrementValidator = function (options) {
 *    if(options && options.converter){
 *      this._converter = options.converter;
 *    }
 *  };
 *  //Need to be a subclass of Validator
 *  oj.Object.createSubclass(TimeIncrementValidator, Validator, "TimeIncrementValidator");
 *
 *  // Validates if the passed in value is a multiple of 15 minute interval.
 *  // Throws an error if the validation fails.
 *  TimeIncrementValidator.prototype.validate = function (value)
 *  {
 *    if (value)
 *    {
 *      var currentTime = oj.IntlConverterUtils.isoToLocalDate(value);
 *      var previousValidValue, nextValidValue, sampleMinutes;
 *      var minutes = currentTime.getMinutes();
 *      //Check if the minute is in increment of 15 by taking a modulo
 *      if ((minutes % 15) !== 0)
 *      {
 *        sampleMinute = Math.floor((minutes / 15))*15;
 *        currentTime.setMinutes(sampleMinute);
 *        previousValidValue = oj.IntlConverterUtils.dateToLocalIso(currentTime);
 *        sampleMinute = sampleMinute+ 15;
 *        if(sampleMinute >= 60){
 *          sampleMinute = 0;
 *          currentTime.setTime(currentTime.getTime() + (60*60*1000));
 *        }
 *        currentTime.setMinutes(sampleMinute);
 *        nextValidValue = oj.IntlConverterUtils.dateToLocalIso(currentTime);
 *        throw new ValidatorError("Only multiples of 15 minute intervals are allowed.", "For example, " + this._converter.format(previousValidValue) +
 *                                     " or "+ this._converter.format(nextValidValue));
 *      }
 *    }
 *  };
 *
 *  //Generates a hint message with 4 different samples of valid values.
 *  TimeIncrementValidator.prototype.getHint = function ()
 *  {
 *    var currentTime = new Date();
 *    var hintMessage = "Only 15 minute intervals accepted, for example";
 *    //generate 4 sample values
 *    for (var i = 0; i < 4; i++) {
 *      currentTime.setMinutes(i * 15);
 *      hintMessage = hintMessage + ", " + this._converter.format(oj.IntlConverterUtils.dateToLocalIso(currentTime));
 *    }
 *    return hintMessage;
 *  };
 * @example <caption>Create a Validator and implement its methods. Bind it to the
 * JET form component which will call this 'validate' to validate the user's input.</caption>
 *  // Validator that ensures endDate is never less than start date
 *  self.endDateValidator = {
 *    'validate' : function(value)
 *    {
 *      var value =  oj.IntlConverterUtils.isoToLocalDate(value);
 *      var start = oj.IntlConverterUtils.isoToLocalDate(self.startDate());
 *      if (value && !(value.getFullYear() > start.getFullYear() ||
 *      {
 *        throw new ValidatorError('End Date cannot be less than Start Date');
 *      }
 *    },
 *    'getHint' : function() { return "End Date needs to be greater than Start Date");}
 *  };
 *  -- HTML --
 *  &lt;oj-input-date id="nextday" value="{{endDate}}"
 *  validators="{{[weekendDateValidator, endDateValidator]}}">&lt;/oj-input-date>
 * @interface
 * @name oj.Validator
 * @param {Object=} options An object which contains the options for the validator
 * @ojsignature {target: "Type", value: "interface Validator<V>", genericParameters: [{"name": "V", "description": "Type of value to be validated"}]}
 * @ojtsmodule
 * @export
 * @since 0.6.0
 *
 */
const Validator = function (options) {
  this.Init(options);
};

// Subclass from oj.Object
oj.Object.createSubclass(Validator, oj.Object, 'oj.Validator');

/**
 * Initializes validator instance with the set options
 * @export
 * @ignore
 */
// eslint-disable-next-line no-unused-vars
Validator.prototype.Init = function (options) {
  Validator.superclass.Init.call(this);
};

/**
 * Validates the value.
 * The function typically returns if the validation passes and throws an error if it fails.
 *
 * @example <caption>Create a Validator and implement the validate method. Bind it to the
 * JET form component which will call this 'validate' to validate the user's input.</caption>
 *  // Validator that ensures endDate is never less than start date
 *  self.endDateValidator = {
 *    'validate' : function(value)
 *    {
 *      var value =  oj.IntlConverterUtils.isoToLocalDate(value);
 *      var start = oj.IntlConverterUtils.isoToLocalDate(self.startDate());
 *      if (value && !(value.getFullYear() > start.getFullYear() ||
 *      {
 *        throw new ValidatorError('End Date cannot be less than Start Date');
 *      }
 *    },
 *    'getHint' : function() { return "End Date needs to be greater than Start Date");}
 *  };
 *  -- HTML --
 *  &lt;oj-input-date id="nextday" value="{{endDate}}"
 *  validators="{{[weekendDateValidator, endDateValidator]}}">&lt;/oj-input-date>
 * @param {any} value to be validated
 * @return {void}
 * @throws {Error} if validation fails
 * @method validate
 * @ojsignature [{target: "Type",
 *                value: "V",
 *                for: "value"},
 *                {target: "Type",
 *                value: "void",
 *                for: "returns"}]
 * @memberof oj.Validator
 * @instance
 */

/**
 * Returns a hint that describes the validator rule.
 * @example <caption>Create a Validator and implement the getHint method. Bind it to the
 * JET form component which will show the hint.</caption>
 *  // Validator that ensures endDate is never less than start date
 *  self.endDateValidator = {
 *    'validate' : function(value)
 *    {
 *      ...
 *    },
 *    'getHint' : function() { return "End Date needs to be greater than Start Date");}
 *  };
 *  -- HTML --
 *  &lt;oj-input-date id="nextday" value="{{endDate}}"
 *  validators="{{[weekendDateValidator, endDateValidator]}}">&lt;/oj-input-date>
 * @returns {string|null} a hint string or null
 * @method getHint
 * @memberof oj.Validator
 * @ojsignature {target: "Type", value: "?(): string|null"}
 * @instance
 */

export default Validator;
