/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojvalidationfactory-base', 
'ojs/ojconverter-datetime', 
'ojs/ojvalidator-datetimerange', 'ojs/ojvalidator-daterestriction'],
 function(oj, __ValidationFactoryBase, __ConverterDateTime, 
 DateTimeRangeValidator, DateRestrictionValidator)
{
  "use strict";

/* global __ValidationFactoryBase:false, __ConverterDateTime:false, DateTimeRangeValidator:false, DateRestrictionValidator:false */
/**
 * A factory implementation to create the built-in datetime converter of type
 * {@link oj.IntlDateTimeConverter}.
 *
 * @name oj.DateTimeConverterFactory
 * @ojdeprecated {since: '8.0.0', description: 'Directly create new instances of DateTimeConverter instead.'}
 * @hideconstructor
 * @ojtsnoexport
 * @ojtsexportastype
 * @ojtsimport {module: "ojconverter-datetime", type: "AMD", imported: ["IntlDateTimeConverter"]}
 * @public
 * @class
 * @example <caption>create an instance of the jet datetime converter using the options provided</caption>
 * var dtcf = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
 * var dateOptions = {year: '2-digit', month: 'numeric', day: 'numeric'};
 * var dateConverter = dtcf.createConverter(dateOptions);
 * @since 0.6.0
 *
 */
var DateTimeConverterFactory = (function () {
  function _createDateTimeConverter(options) {
    return new __ConverterDateTime.IntlDateTimeConverter(options);
  }

  /**
   *
   * @public
   */
  return {
    /**
     * Creates an immutable (jet) datetime converter instance.
     *
     * @param {Object=} options an object literal used to provide an optional information to
     * initialize the jet datetime converter. For details on what to pass for options, refer to
     * {@link oj.IntlDateTimeConverter}.
     *
     * @return {oj.IntlDateTimeConverter}
     * @ojsignature {target: "Type", for: "options", value: "oj.IntlDateTimeConverter.ConverterOptions"}
     * @instance
     * @memberof oj.DateTimeConverterFactory
     * @public
     */
    createConverter: function (options) {
      return _createDateTimeConverter(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
__ValidationFactoryBase.Validation.__registerDefaultConverterFactory(
  __ValidationFactoryBase.ConverterFactory.CONVERTER_TYPE_DATETIME, // factory name
  DateTimeConverterFactory
);


// JET VALIDATOR FACTORIES

/**
 * a factory implementation to create an instance of the built-in dateTimeRange validator of type
 * {@link oj.DateTimeRangeValidator}.
 *
 * @example <caption>create an instance of the dateTimeRange validator using the factory</caption>
 * var drvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE);
 * var birthdateOptions = {min: new Date(1930, 00, 01), max: new Date(1995, 11,31)};
 * var birthdateValidator = drvf.createValidator(birthdateOptions);
 *
 * @name oj.DateTimeRangeValidatorFactory
 * @ojdeprecated {since: '8.0.0', description: 'Directly create new instances of DateTimeRangeValidator instead.'}
 * @hideconstructor
 * @ojtsnoexport
 * @ojtsexportastype
 * @ojtsimport {module: "ojvalidator-datetimerange", type: "AMD", importName: "DateTimeRangeValidator"}
 * @class
 * @public
 * @since 0.6.0
 *
 */
var DateTimeRangeValidatorFactory = (function () {
  function _createDateTimeRangeValidator(options) {
    return new DateTimeRangeValidator(options);
  }

  return {
    /**
     * Creates an immutable validator instance of type {@link oj.DateTimeRangeValidator} that ensures
     * that the (datetime) value provided is within a given range.
     *
     * @param {Object=} options an object literal used to provide the minimum, maximum and other
     * optional values. See {@link oj.DateTimeRangeValidator} for details.<p>
     *
     * @return {oj.DateTimeRangeValidator}
     * @memberof oj.DateTimeRangeValidatorFactory
     * @instance
     * @ojsignature {target: "Type", for: "options", value: "oj.DateTimeRangeValidator.ValidatorOptions"}
     * @public
     */
    createValidator: function (options) {
      return _createDateTimeRangeValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
__ValidationFactoryBase.Validation.__registerDefaultValidatorFactory(
  __ValidationFactoryBase.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE,
  DateTimeRangeValidatorFactory);

/**
 * a factory method to create an instance of the built-in dateRestriction validator of type
 * {@link oj.DateRestrictionValidator}.
 *
 * @example <caption>create an instance of the dateRestriction validator using the factory </caption>
 * var drvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATERESTRICTION);
 * var drValidator = drvf.createValidator();
 *
 * @name oj.DateRestrictionValidatorFactory
 * @ojdeprecated {since: '8.0.0', description: 'Directly create new instances of DateRestrictionValidator instead.'}
 * @class
 * @hideconstructor
 * @ojtsnoexport
 * @ojtsexportastype
 * @ojtsimport {module: "ojvalidator-daterestriction", type: "AMD", importName: "DateRestrictionValidator"}
 * @since 0.6.0
 * @public
 *
 */
var DateRestrictionValidatorFactory = (function () {
  function _createDateRestrictionValidator(options) {
    return new DateRestrictionValidator(options);
  }

  return {
    /**
     * Creates an immutable validator instance of type oj.DateRestrictionValidator that ensures that the
     * isoString value provided is not in a disabled entry of dayFormatter callback.
     *
     * @param {Object=} options an object literal
     * See {@link oj.ojInputDate} and {@link oj.DateRestrictionValidator} for details.<p>
     *
     * @return {oj.DateRestrictionValidator}
     * @memberof oj.DateRestrictionValidatorFactory
     * @instance
     * @ojsignature {target: "Type", for: "options", value: "oj.DateRestrictionValidator.ValidatorOptions"}
     * @public
     */
    createValidator: function (options) {
      return _createDateRestrictionValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
__ValidationFactoryBase.Validation.__registerDefaultValidatorFactory(
  __ValidationFactoryBase.ValidatorFactory.VALIDATOR_TYPE_DATERESTRICTION,
  DateRestrictionValidatorFactory);


/* global DateTimeConverterFactory:false, DateTimeRangeValidatorFactory:false, DateRestrictionValidatorFactory:false */

var __ValidationFactoryDateTime = {};
__ValidationFactoryDateTime.DateTimeConverterFactory = DateTimeConverterFactory;
__ValidationFactoryDateTime.DateTimeRangeValidatorFactory = DateTimeRangeValidatorFactory;
__ValidationFactoryDateTime.DateRestrictionValidatorFactory = DateRestrictionValidatorFactory;

  ;return __ValidationFactoryDateTime;
});