/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojvalidationfactory-base', 'ojs/ojconverter-number', 
'ojs/ojvalidator-numberrange'], 
function(oj, __ValidationFactoryBase, __ConverterNumber, NumberRangeValidator)
{
  "use strict";


/* global __ValidationFactoryBase:false, __ConverterNumber:false, NumberRangeValidator:false */

/**
 * A factory implementation to create the built-in number converter of type
 * {@link oj.IntlNumberConverter}.
 *
 * @name oj.NumberConverterFactory
 * @ojdeprecated {since: '8.0.0', description: 'Directly create new instances of NumberConverter instead.'}
 * @hideconstructor
 * @ojtsnoexport
 * @ojtsexportastype
 * @ojtsimport {module: "ojconverter-number", type: "AMD", imported: ["IntlNumberConverter"]}

 * @class
 *
 * @example <caption>create an instance of the jet datetime converter using the options provided</caption>
 * var ncf = __ValidationFactoryBase.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER);
 * var salaryOptions = {currency: "EUR" , pattern: "¤#,##0.00;(¤#,##0.00)"};
 * var salaryConverter = ncf.createConverter(salaryOptions);
 * @public
 * @since 0.6.0
 *
 */
var NumberConverterFactory = function () {
  function _createNumberConverter(options) {
    return new __ConverterNumber.IntlNumberConverter(options);
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
     * @memberof oj.NumberConverterFactory
     * @ojsignature {target: "Type", for: "options", value: "oj.IntlNumberConverter.ConverterOptions"}
     * @instance
     * @public
     */
    createConverter: function createConverter(options) {
      return _createNumberConverter(options);
    }
  };
}(); // notice immediate invocation of anonymous function

/** Register the default factory provider function */


__ValidationFactoryBase.Validation.__registerDefaultConverterFactory(__ValidationFactoryBase.ConverterFactory.CONVERTER_TYPE_NUMBER, // factory name
NumberConverterFactory); // JET VALIDATOR FACTORIES

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
 * @ojdeprecated {since: '8.0.0', description: 'Directly create new instances of NumberRangeValidator instead.'}
 * @hideconstructor
 * @ojtsnoexport
 * @ojtsexportastype
 * @ojtsimport {module: "ojvalidator-numberrange", type: "AMD", importName: "NumberRangeValidator"}
 * @class
 * @public
 * @since 0.6.0
 *
 */


var NumberRangeValidatorFactory = function () {
  function _createNumberRangeValidator(options) {
    return new NumberRangeValidator(options);
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
     * @memberof oj.NumberRangeValidatorFactory
     * @instance
     * @ojsignature {target: "Type", for: "options", value: "oj.NumberRangeValidator.ValidatorOptions"}
     * @public
     */
    createValidator: function createValidator(options) {
      return _createNumberRangeValidator(options);
    }
  };
}(); // notice immediate invocation of anonymous function

/** Register the default factory provider function */


__ValidationFactoryBase.Validation.__registerDefaultValidatorFactory(__ValidationFactoryBase.ValidatorFactory.VALIDATOR_TYPE_NUMBERRANGE, NumberRangeValidatorFactory);



/* global NumberConverterFactory:false, NumberRangeValidatorFactory:false */
var __ValidationFactoryNumber = {};
__ValidationFactoryNumber.NumberConverterFactory = NumberConverterFactory;
__ValidationFactoryNumber.NumberRangeValidatorFactory = NumberRangeValidatorFactory;

  ;return __ValidationFactoryNumber;
});