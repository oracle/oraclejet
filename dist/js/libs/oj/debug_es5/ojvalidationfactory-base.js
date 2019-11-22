/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore',
'ojs/ojlogger',
'ojs/ojconverter-color', 
'ojs/ojvalidator-length', 
'ojs/ojvalidator-regexp', 
'ojs/ojvalidator-required'], function(oj,
Logger,
ColorConverter, 
LengthValidator, 
RegExpValidator, 
RequiredValidator)
{
  "use strict";


/* global Logger:false */

/**
 * Used to register and retrieve converterFactories and validationFactories.
 * There is no need to call the constructor.
 * @see oj.Validation.converterFactory
 * @see oj.Validation.validatorFactory
 * @see oj.ConverterFactory
 * @see oj.ValidatorFactory
 * @name oj.Validation
 * @namespace
 * @hideconstructor
 * @export
 * @since 0.6.0
 *
 */
var Validation = {};
/**
 * Internal properties to hold all factory provider callbacks or instances by name
 * @private
 */

Validation._converterFactories = {};
Validation._validatorFactories = {};
/**
 * Internal properties to hold the default factory instances.
 * @private
 */

Validation._defaultConverterFactories = {};
Validation._defaultValidatorFactories = {};
/**
 * Method to register and retrieve converter factory instances by name.
 * When passed only the name, an existing factory (registered for the name) is returned. Callers can
 * expect to get back the default 'number', 'datetime', or 'color' converters.
 * When passed two arguments, a new factory for the name is registered. If the name already exists
 * the new instance replaces the old one.
 * @ojdeprecated {since: '8.0.0', description: 'Directly create new instances ColorConverter, DateTimeConverter, and NumberConverter instead.'}
 * @param {string} type a case insensitive name of the converter factory. e.g., 'number' (or
 * oj.ConverterFactory.CONVERTER_TYPE_NUMBER), 'datetime' (or oj.ConverterFactory.CONVERTER_TYPE_DATETIME),
 * or 'color' (or oj.ConverterFactory.CONVERTER_TYPE_COLOR).
 * @param {Object=} instance the instance of the factory that implements the contract for
 * oj.ConverterFactory.
 *
 * @export
 * @memberof oj.Validation
 * @name converterFactory
 * @method
 * @ojsignature {target: "Type",
 *                value: "<CF extends oj.ConverterFactory<any, any>>(type:'number'|'color'|'datetime'|string, instance?:CF): CF|null"}
 * @see oj.ConverterFactory
 * @example <caption>Initialize a JET datetime converter instance using options
 * and use it in a knockout-binding and bind it to the
 * converter attribute on the JET form element.</caption>
 * ----- Javascript ViewModel----
 * self.converter = ko.observable(
    oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).
      createConverter({formatType: 'date', dateFormat: 'full'}));
 * ----- HTML -----
 * &lt;oj-input-date value="{{endDate}}" converter="[[converter]]">&lt/oj-input-date>
 * @example <caption>Create your own converter, register it, and use it when displaying information
 * on the page to the user.</caption>
 * ----- Javascript -----
 * RelativeDateTimeConverterFactory = (function () {
 *  function _createRelativeDateTimeConverter(options)
 *  {
 *    // this is a custom converter that formats the datetime into "Today" or
 *    // "Tomorrow", or "This Week"/"Next Week", etc. See the Converter API or
 *    // the Custom Converter demos for how to create a custom converter.
 *    return new RelativeDateTimeConverter(options);
 *  }
 *  return {
 *    'createConverter': function (options) {
 *      return _createRelativeDateTimeConverter(options);
 *    }
 *  };
 *  }());
 * oj.Validation.converterFactory("relativeDate", RelativeDateTimeConverterFactory);
 *  // Use our custom relativeDate converter.
 *  // In this demo, we want to see in the Schedule For column the words
 *  // Today or Tomorrow so we set the relativeField option's value
 *  // to 'day'. If we want to see This Week, we'd set it to 'week', etc.
 *  var rdConverter =  oj.Validation.converterFactory("relativeDate")
 *  .createConverter({relativeField: 'day', year: "numeric", month: "numeric", day: "numeric"});
 *  ...
 *  // Our custom converter's format function returns an object with 'value' and 'title'.
 *  // We put the 'value' in innerHTML so the user can read it. E.g., Today or Tomorrow.
 *  // And we put the actual date in the title. The user can read it when they hover over
 *  // the word Today or Tomorrow.
 *  content = rdConverter.format(context.row.ScheduleFor);
 *  span.setAttribute('title', content.title);
 *  span.innerHTML = content.value;
 * ...
 * @example <caption>On your JET form component that has a 'converter' attribute,
 * set the 'converter' attribute using "type" of a registered converter. This
 * could be a JET Converter or a oj.Converter
 * (or Object that duck-types it) that you wrote. (it must implement parse and format
 * since our JET form components call format and parse.</caption>
 * &lt;oj-input-date value="{{date}}"
 * converter= '{"type":"datetime",
 * "options": {"year": "numeric", "month": "long", "day": "numeric"}}'> &lt;/oj-input-date>
 */

Validation.converterFactory = function (type, instance) {
  var retValue;

  if (type && !instance) {
    // getter
    retValue = Validation._getFactory(type, Validation._converterFactories);

    if (retValue === null) {
      var lowerTypeStr = type.toLowerCase();
      var errString = 'Converter of type ' + type + ' cannot be found.';

      switch (lowerTypeStr) {
        case 'datetime':
          Logger.error(errString + ' Please import the ojs/ojvalidation-datetime module.');
          break;

        case 'number':
          Logger.error(errString + ' Please import the ojs/ojvalidation-number module.');
          break;

        default:
          Logger.warn(errString);
      }
    }
  } else if (type && instance) {
    // setter
    retValue = Validation._registerFactory(type, instance, Validation._converterFactories, Validation._CONTRACTS.converter);
    Logger.error('Registering a custom type or overriding the standard types is no longer supported. Please directly set the converter on the component. Please consult the Release Notes for further information.');
  }

  return retValue;
};
/**
 * Method to register and retrieve validator factory instances by name.
 * When passed only the name, an existing factory (registered for the name) is returned.
 * When passed two arguments, a new factory for the name is registered. If the name already exists
 * the new instance replaces the old one.
 * @ojdeprecated {since: '8.0.0', description: 'Directly create new instances validator instead.'}
 * @param {string} type a case insensitive name of the validator factory.
 * @param {Object=} instance the instance of the factory that implements the contract for
 * oj.ValidatorFactory.
 * @example <caption>Initialize a JET validator instance using options
 * and use it in a knockout-binding and bind it to the
 * validators attribute on the JET form element.</caption>
 * ----- Javascript ViewModel----
 * var options = {min: 5, max: 10};
 * var validator =
 * oj.Validation.validatorFactory(
 * oj.ValidatorFactory.VALIDATOR_TYPE_LENGTH).createValidator(options);
 * self.validator = ko.observable([validator]);
 * ----- HTML -----
 * &lt;oj-input-text validators="[[validator]]">&lt/oj-input-text>
 * @example <caption>An easier usage is to return an Object since the validators option
 * takes an array where each item is either an instance that duck types oj.Validator,
 * or is an Object literal containing type and options.</caption>
 * ----- Javascript ViewModel -----
 * self.validators = ko.computed(function() {
 * return [{type: 'numberRange', options: { min: 10000.05, max: 25000.95,
 * hint: {inRange: 'Enter a value between {min} and {max}.'}}}];
 * });
 * ----- HTML -----
 * &lt;oj-input-text id="numberRange1" value="{{numberValue1}}" validators="[[validators]]">
 * &lt;/oj-input-text>
 * @example <caption>Get a registered validator with your options, and calls its validate method
 * on your own value.</caption>
 * var reqValOptions = {
 *   'hint': reqTrans['hint'] || null,
 *   'label': this._getLabelText(),
 *   'messageSummary': reqTrans['messageSummary'] || null,
 *   'messageDetail': reqTrans['messageDetail'] || null
 * };
 * var vf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REQUIRED);
 * var requiredValidator = vf.createValidator(reqValOptions);
 * var isValid = validator.validate(value);
 * @example <caption>Create and register your own factory</caption>
 * MyOwnNumberRangeValidatorFactory = (function () {
 *   function _createNumberRangeValidator(options) {
 *     return new MyOwnNumberRangeValidator(options);
 *   }
 *
 *   return {
 *     'createValidator': function(options) {
 *       return _createNumberRangeValidator(options);
 *   }
 *   };
 * }());
 * oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_NUMBERRANGE, MyOwnNumberRangeValidatorFactory);
 * @export
 * @since 0.6.0
 * @see oj.ValidatorFactory
 * @memberof oj.Validation
 * @name validatorFactory
 * @method
 * @ojsignature {target: "Type",
 *   value: "<VF extends oj.ValidatorFactory<any,any>>(type:'required'|'regexp'|'numberRange'|'length'|'dateTimeRange'|'dateRestriction'|string, instance?:VF): VF|null"}
 */


Validation.validatorFactory = function (type, instance) {
  var retValue;

  if (type && !instance) {
    // getter
    retValue = Validation._getFactory(type, Validation._validatorFactories);

    if (retValue === null) {
      var lowerTypeStr = type.toLowerCase();
      var errString = 'Unable to locate a validatorFactory for the requested type: ' + type;

      switch (lowerTypeStr) {
        case 'daterestriction':
          Logger.error(errString + '. Please import the ojs/ojvalidation-datetime module.');
          break;

        case 'datetimerange':
          Logger.error(errString + '. Please import the ojs/ojvalidation-datetime module.');
          break;

        case 'numberrange':
          Logger.error(errString + '. Please import the ojs/ojvalidation-number module.');
          break;

        default:
          Logger.warn(errString);
      }
    }
  } else if (type && instance) {
    // setter
    retValue = Validation._registerFactory(type, instance, Validation._validatorFactories, Validation._CONTRACTS.validator);
    Logger.error('Registering a custom type or overriding the standard types is no longer supported. Please directly set the converter on the component. Please consult the Release Notes for further information.');
  }

  return retValue;
};
/**
 * Returns the default converter factory instances for the supported types as defined by the
 * oj.ConverterFactory. Instead of calling this method, it should be
 * sufficient to use oj.Validation.converterFactory.
 * @ojdeprecated {since: '8.0.0', description: 'Directly create new instances ColorConverter, DateTimeConverter, and NumberConverter instead.'}
 * @param {string} type The default converter factory for the type. Supported types are 'number' and
 * 'datetime'
 * @return {Object|null} an instance of oj.ConverterFactory or null if an unknown type is requested.
 *
 * @export
 * @ojtsignore
 * @memberof oj.Validation
 * @method
 * @ojsignature {target:"Type",
 *    value: "<V>(type: 'number'|'color'|'datetime'): oj.ConverterFactory<V>|null"}
 * @see oj.ConverterFactory
 * @see oj.Validation.converterFactory
 *
 */


Validation.getDefaultConverterFactory = function (type) {
  return Validation._getFactory(type, Validation._defaultConverterFactories);
};
/**
 * Returns the default validator factory instance for the requested types as defined by the
 * oj.ValidatorFactory.  Instead of calling this method, it should be
 * sufficient to use oj.Validation.validatorFactory.
 * @ojdeprecated {since: '8.0.0', description: 'Directly create new instances validator instead.'}
 * @param {string} type The default converter factory for the type. Supported types are 'number' and
 * 'datetime'
 * @return {Object|null} an instance of oj.ConverterFactory or null if an unknown type is requested.
 *
 * @export
 * @ojtsignore
 * @memberof oj.Validation
 * @method
 * @ojsignature {target:"Type",
 *    value: "<V>(type: 'required'|'regexp'|'numberRange'|'length'|'dateTimeRange'|'dateRestriction'): oj.ValidatorFactory<V>|null"}
 * @see oj.ValidatorFactory
 * @see oj.Validation.validatorFactory
 */


Validation.getDefaultValidatorFactory = function (type) {
  return Validation._getFactory(type, Validation._defaultValidatorFactories);
}; // PACKAGE PRIVATE METHODS

/**
 * Called only by internal jet converter factory implementations.
 *
 * @param {string} name
 * @param {Object} instance
 * @private
 */


Validation.__registerDefaultConverterFactory = function (name, instance) {
  // save to both factories
  var contractDef = Validation._CONTRACTS.converter;

  Validation._registerFactory(name, instance, Validation._defaultConverterFactories, contractDef);

  Validation._registerFactory(name, instance, Validation._converterFactories, contractDef);
};
/**
 * Called only by internal jet validator factory implementations.
 *
 * @param {string} name of the validator factory
 * @param {Object} instance of the validator factory that creates instances of the validator
 * @private
 */


Validation.__registerDefaultValidatorFactory = function (name, instance) {
  // save to both factories
  var contractDef = Validation._CONTRACTS.validator;

  Validation._registerFactory(name, instance, Validation._defaultValidatorFactories, contractDef);

  Validation._registerFactory(name, instance, Validation._validatorFactories, contractDef);
};
/**
 * Checks that the instance implements the interface type. If it doesn't it throws an error.
 * @param {Object} instance
 * @param {Object} type
 * @param {string} typeName
 * @throws {Error} if instance does not implement the methods defined on type.
 * @private
 */


Validation._doImplementsCheck = function (instance, type, typeName) {
  if (type) {
    // Check that instance duck types providerType
    if (!Validation._quacksLike(instance, type)) {
      throw new Error('Factory instance does not implement the methods expected by the factory of type ' + typeName);
    }
  }
};
/**
 * Retrieves the converter factory by name from the provided factories.
 * @private
 */


Validation._getFactory = function (name, factories) {
  oj.Assert.assertString(name);
  var cachedInstance = null;
  var lowerName = name.toLowerCase(); // getter called to retrieve the factory instance

  var providerProps = factories[lowerName] || {};
  cachedInstance = providerProps.instance || null; // TODO: log a warning that name is null

  return cachedInstance;
};
/**
 * Tests whether an object 'quacks like a duck'. Returns `true` if the thingie has all of the
 * methods of the second, parameter 'duck'. Returns `false` otherwise.
 *
 * @param {Object} thingie the object to test.
 * @param {Object} duck The archetypal object, or 'duck', that the test is against.
 * @private
*/


Validation._quacksLike = function (thingie, duck) {
  var valid = true;
  oj.Assert.assertObject(thingie);
  oj.Assert.assertObject(duck);
  var properties = Object.keys(duck);

  for (var i = 0; i < properties.length; i++) {
    var property = properties[i]; // Ensure that thingie defines the same functions as duck. We don't care about other properties

    if (typeof duck[property] === 'function' && (!thingie[property] || typeof thingie[property] !== 'function')) {
      valid = false;
      break;
    }
  }

  return valid;
};
/**
 * Registers the factory instance by the name, storing it into the factories object, after ensuring
 * that the instance duck types the specified contract.
 *
 * @private
 */


Validation._registerFactory = function (name, instance, factories, contractDef) {
  oj.Assert.assertString(name);
  oj.Assert.assertObject(instance); // set new provider factory function clearing out the previously stored instance

  var props = {};
  props.instance = instance;

  Validation._doImplementsCheck(instance, contractDef.type, contractDef.name); // Save to default and public factories
  // eslint-disable-next-line no-param-reassign


  factories[name.toLowerCase()] = props;
};
/**
 * Contract for a ConverterFactory that provides a factory method to create a converter instance for
 * the requested type. Factories handle the details of object creation.
 * It allows the consumers of the factory to create specific converters
 * without knowing the internals of the converter creation.
 * <p>
 * JET provides three factory implementations for number and datetime
 * and color types that implement this contract.
 * </p>
 * <p>
 * Customers can register custom converter factories for the supported
 * types or create and register factories for new types altogether.
 * </p>
 * @example <caption>Get the ConverterFactory for 'datetime', and create
 * a JET dateTime converter with specific options.
 * See {@link oj.DateTimeConverterFactory} for what to set for options
 * for the DateTime Converter. </caption>
 * var dateTimeCvtr = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
 * var dateOptions = {day: 'numeric', month: 'numeric'};
 * var dayMonthConverter = dateTimeCvtr.createConverter(dateOptions);
 * @example <caption>Create a custom ConverterFactory with a new type and register that ConverterFactory.</caption>
 * // Define a new ConverterFactory for relative datetimes, like Today, Yesterday, Tomorrow
 * RelativeDateTimeConverterFactory = (function () {
 *   function _createRelativeDateTimeConverter(options)
 *   {
 *     // this is a custom converter
 *     // See the Custom Converter JET demo for details on how to create
 *     // your own Converter. Or see the Converter jsdoc.
 *     return new RelativeDateTimeConverter(options);
 *   }
 *   return {
 *     'createConverter': function (options) {
 *       return _createRelativeDateTimeConverter(options);
 *     }
 *   };
 * }());
 *
 * // Register the custom factory with the new "relativeDate" type
 * oj.Validation.converterFactory("relativeDate", RelativeDateTimeConverterFactory);
 *
 * // Get the custom factory using the new type.
 * var rdConverter =  oj.Validation.converterFactory("relativeDate")
 * .createConverter({relativeField: 'day', year: "numeric", month: "numeric", day: "numeric"});
 * @ojdeprecated {since: '8.0.0', description: 'Use string literals instead of the member constants.'}
 * @name oj.ConverterFactory
 * @abstract
 * @class
 * @export
 * @ojtsimport {module: "ojconverter", type: "AMD", importName: "Converter"}
 * @since 0.6.0
 * @ojsignature {target: "Type", value: "class ConverterFactory<V, O>", genericParameters: [{"name": "V", "description": "Type of value to be converted"}]}
 * @see oj.Validation
 * @see oj.NumberConverterFactory
 * @see oj.DateTimeConverterFactory
 * @see oj.ColorConverterFactory
 */


var ConverterFactory = {
  /**
   * Default type for a factory used to create number converters. This type is passed to the
   * [Validation.converterFactory]{@link oj.Validation#converterFactory} method to retrieve the
   * number converter factory of type {@link oj.NumberConverterFactory}.
   * @example <caption>Create a JET number converter with options</caption>
   * var convFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER);
   * var converter  =  convFactory.createConverter({
   *  style: 'currency',
   *  currency: 'USD',
   *  currencyDisplay: 'symbol',
   *  pattern: '¤ ##,##0.00'});
   * @ojdeprecated {since: '8.0.0', description: 'Use the string instead.'}
   * @expose
   * @const
   * @member
   * @memberof oj.ConverterFactory
   * @type {string}
   */
  CONVERTER_TYPE_NUMBER: 'number',

  /**
   * Default type for a factory used to create datetime converters. This type is passed to the
   * [Validation.converterFactory]{@link oj.Validation#converterFactory} method to retrieve the
   * datetime converter factory of type {@link oj.DateTimeConverterFactory}.
   * @example <caption>Create a JET dateTime converter with options</caption>
   * var dateTimeCvtr = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
   * var dateOptions = {day: 'numeric', month: 'numeric'};
   * var dayMonthConverter = dateTimeCvtr.createConverter(dateOptions);
   * @ojdeprecated {since: '8.0.0', description: 'Use the string instead.'}
   * @expose
   * @const
   * @member
   * @memberof oj.ConverterFactory
   * @type {string}
   */
  CONVERTER_TYPE_DATETIME: 'datetime',

  /**
   * Default type for a factory used to create color converters. This type is passed to the
   * [Validation.converterFactory]{@link oj.Validation#converterFactory} method to retrieve the
   * color converter factory of type {@link oj.ColorConverterFactory}.
   * @example <caption>Create a JET color converter with options</caption>
   * this._convFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_COLOR);
   * this._convHex  =  this._convFactory.createConverter({"format": "hex"})
   * @ojdeprecated {since: '8.0.0', description: 'Use the string instead.'}
   * @expose
   * @const
   * @member
   * @memberof oj.ConverterFactory
   * @type {string}
   */
  CONVERTER_TYPE_COLOR: 'color',

  /**
   * Creates an immutable converter instance of the type the factory implements.
   *
   * @param {Object=} options an object literal containing properties required by the converter
   * for its initialization. The properties provided in the options is implementation specific.
   *
   * @return {oj.Converter} a converter instance.
   * @memberof oj.ConverterFactory
   * @ojsignature {target: "Type",
   *               value: "(options?: O): Converter<V> | Promise.<Converter<V>>"}
   * @instance
   * @throws {TypeError} if an unrecognized type was provided
   * @expose
   *
   * @example <caption>Create a JET dateTime converter with options</caption>
   * var dateTimeCvtr = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
   * var dateOptions = {day: 'numeric', month: 'numeric'};
   * var dayMonthConverter = dateTimeCvtr.createConverter(dateOptions);
   * @example <caption>Create your own ConverterFactory and Converter, register the Converter on your
   * ConverterFactory, and use it when displaying relative date information
   * on the page to the user.</caption>
   * ----- Javascript -----
   * // Define new ConverterFactory
   * RelativeDateTimeConverterFactory = (function () {
   *   function _createRelativeDateTimeConverter(options)
   *   {
   *     // this is a custom converter See the Converter API or
   *     // Custom Converter JET demo for details on
   *     // how to create a custom converter.
   *     return new RelativeDateTimeConverter(options);
   *   }
   *   return {
   *     'createConverter': function (options) {
   *       return _createRelativeDateTimeConverter(options);
   *     }
   *   };
   * }());
   * // Register the custom factory with the new type
   * oj.Validation.converterFactory("relativeDate", RelativeDateTimeConverterFactory);
   * // Get the custom factory using the new type.
   * var rdConverter =  oj.Validation.converterFactory("relativeDate")
   * .createConverter({relativeField: 'day', year: "numeric", month: "numeric", day: "numeric"});
   *  ...
   *  // Our custom converter's format function returns an object with 'value' and 'title'.
   *  // We put the 'value' in innerHTML so the user can read it. E.g., Today or Tomorrow.
   *  // And we put the actual date in the title. The user can read it when they hover over
   *  // the word Today or Tomorrow.
   *  content = rdConverter.format(context.row.ScheduleFor);
   *  span.setAttribute('title', content.title);
   *  span.innerHTML = content.value;
   * ...
   */
  // eslint-disable-next-line no-unused-vars
  createConverter: function createConverter(options) {}
};
/**
 * Contract for a ValidatorFactory that provides a factory method to create a validator instance for
 * the requested type. JET provides several factory implementations that implement this contract -
 * for example dateRestriction, dateTimeRange, numberRange, length, required, regexp.
 * <p> Customers can
 * register custom validator factories for the supported types or create and register factories for
 * new types altogether.
 * </p>
 * @example <caption>Create a JET regexp validator</caption>
 * var validatorFactory =
 *   oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP);
 *
 * var options =
 *   {pattern: '[a-zA-Z0-9]{3,}',
 *   hint: 'enter at least 3 letters or numbers.',
 *   messageDetail: 'You must enter at least 3 letters or numbers.'}
 *
 * var validator = validatorFactory.createValidator(options);
 * @example <caption>Create and register your own ValidatorFactory</caption>
 * MyOwnNumberRangeValidatorFactory = (function () {
 *   function _createNumberRangeValidator(options) {
 *     // See Validator api or Custom Validator demos for how to create your own Validator
 *     return new MyOwnNumberRangeValidator(options);
 *   }
 *
 *   return {
 *     'createValidator': function(options) {
 *       return _createNumberRangeValidator(options);
 *   }
 *   };
 * }());
 *
 * oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_NUMBERRANGE, MyOwnNumberRangeValidatorFactory);
 * @ojdeprecated {since: '8.0.0', description: 'Use string literals instead of the member constants.'}
 * @name oj.ValidatorFactory
 * @abstract
 * @class
 * @ojsignature {target: "Type", value: "class ValidatorFactory<V, O>", genericParameters: [{"name": "V", "description": "Type of value to be validated"}]}
 * @export
 * @ojtsimport {module: "ojvalidator", type: "AMD", importName: "Validator"}
 * @ojtsimport {module: "ojvalidator-async", type: "AMD", importName: "AsyncValidator"}
 * @since 0.6.0
 * @see oj.Validation
 * @see oj.DateRestrictionValidatorFactory
 * @see oj.DateTimeRangeValidatorFactory
 * @see oj.LengthValidatorFactory
 * @see oj.NumberRangeValidatorFactory
 * @see oj.RegExpValidatorFactory
 * @see oj.RequiredValidatorFactory
 */

var ValidatorFactory = {
  /**
   * Default type for a factory used to create required validators. This type is passed to the
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the
   * required validator factory of type {@link oj.RequiredValidatorFactory}.
   * @example <caption>Create a JET required validator</caption>
   * var rvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REQUIRED);
   * var options = {'hint' : 'a value is required for this field'};
   * var requiredValidator = rvf.createValidator(options);
   * @ojdeprecated {since: '8.0.0', description: 'Use the string instead.'}
   * @expose
   * @const
   * @member
   * @memberof oj.ValidatorFactory
   * @type {string}
   */
  VALIDATOR_TYPE_REQUIRED: 'required',

  /**
   * Default type for a factory used to create regExp validators. This type is passed to the
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the
   * regExp validator factory of type {@link oj.RegExpValidatorFactory}.
   * @example <caption>Create a JET regexp validator</caption>
   * var validatorFactory =
   * oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP);
   * var options =
   * {pattern: '[a-zA-Z0-9]{3,}',
   * hint: 'enter at least 3 letters or numbers.',
   * messageDetail: 'You must enter at least 3 letters or numbers.'}
   * var validator = validatorFactory.createValidator(options);
   * @ojdeprecated {since: '8.0.0', description: 'Use the string instead.'}
   * @expose
   * @const
   * @member
   * @memberof oj.ValidatorFactory
   * @type {string}
   */
  VALIDATOR_TYPE_REGEXP: 'regexp',

  /**
   * Default type for a factory used to create numberRange validators. This type is passed to the
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the
   * numberRange validator factory of type {@link oj.NumberRangeValidatorFactory}.
   * @example <caption>Create a JET numberrange validator</caption>
   * var validatorFactory =
   * oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_NUMBERRANGE);
   * var options = {min: 10000.05, max: 25000.95,
   * hint: {inRange: 'Enter a value between {min} and {max}.'}};
   * var validator = validatorFactory.createValidator(options);
   * @ojdeprecated {since: '8.0.0', description: 'Use the string instead.'}
   * @expose
   * @const
   * @member
   * @memberof oj.ValidatorFactory
   * @type {string}
   */
  VALIDATOR_TYPE_NUMBERRANGE: 'numberRange',

  /**
   * Default type for a factory used to create length validators. This type is passed to the
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the
   * length validator factory of type {@link oj.LengthValidatorFactory}.
   * @example <caption>Create a JET length validator</caption>
   * var validatorFactory =
   * oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_LENGTH);
   * var options = {min: 5, max: 10};
   * var validator = validatorFactory.createValidator(options);
   * @ojdeprecated {since: '8.0.0', description: 'Use the string instead.'}
   * @expose
   * @const
   * @member
   * @memberof oj.ValidatorFactory
   * @type {string}
   */
  VALIDATOR_TYPE_LENGTH: 'length',

  /**
   * Default type for a factory used to create required validators. This type is passed to the
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the
   * dateTimeRange validator factory of type {@link oj.DateTimeRangeValidatorFactory}.
   * @example <caption>Create a JET datetime validator</caption>
   * var validator =
   * oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE)
   * .createValidator({{max: oj.IntlConverterUtils.dateToLocalIso(new Date()),
   * min: oj.IntlConverterUtils.dateToLocalIso(new Date(2000, 00, 01)),
   * hint: {'inRange': 'Enter a date that falls in the current millennium.'}});
   * @ojdeprecated {since: '8.0.0', description: 'Use the string instead.'}
   * @expose
   * @const
   * @member
   * @memberof oj.ValidatorFactory
   * @type {string}
   */
  VALIDATOR_TYPE_DATETIMERANGE: 'dateTimeRange',

  /**
   * Default type for a factory used to create date restriction validators. This type is passed to
   * the [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the
   * dateRestriction validator factory of type {@link oj.DateRestrictionValidatorFactory}.
   * @example <caption>Create a JET dateRestriction validator</caption>
   * var validatorFactory =
   * oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATERESTRICTION);
   * var options = {dayFormatter : self.aprilFoolsFormatter, // your own formatter code
   * message : {messageDayMetaData : 'You can\'t fool me! Try a different date.'}};
   * var validator = validatorFactory.createValidator(options);
   * @ojdeprecated {since: '8.0.0', description: 'Use the string instead.'}
   * @expose
   * @const
   * @member
   * @memberof oj.ValidatorFactory
   * @type {string}
   */
  VALIDATOR_TYPE_DATERESTRICTION: 'dateRestriction',

  /**
   * Creates an immutable validator instance of the type the factory implements.
   * For the specific options parameters, see the Validator jsdoc for the validator you
   * are creating, e.g., oj.RequiredValidator if you are creating a required validator.
   *
   * @example <caption>create an instance of the required validator using the factory</caption>
   * var rvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REQUIRED);
   * var options = {'hint' : 'a value is required for this field'};
   * var requiredValidator = rvf.createValidator(options);
   * @param {(Object|null)} options an object literal containing properties required by the validator
   * for its initialization. The properties provided in the options is implementation specific.
   * @return {Object} a validator instance.
   * @throws {TypeError} if an unrecognized type was provided
   * @memberof oj.ValidatorFactory
   * @ojsignature { target: "Type",
   *                value: "oj.Validator<V> | oj.AsyncValidator<V>",
   *                for: "returns"}
   * @instance
   * @expose
   * @see oj.DateRestrictionValidator
   * @see oj.DateTimeRangeValidator
   * @see oj.LengthValidator
   * @see oj.NumberRangeValidator
   * @see oj.RegExpValidator
   * @see oj.RequiredValidator
   */
  // eslint-disable-next-line no-unused-vars
  createValidator: function createValidator(options) {}
  /**
   * A ducktype for accessing validator created and/ registered by referring to {@link oj.Validation.validatorFactory}
   * @typedef {object} oj.Validation.RegisteredValidator
   * @property {string} type the name of the factory registered validator
   * @property {Object=} options options to the validator
   */

  /**
  * A ducktype for accessing converter created and/ registered by referring to {@link oj.Validation.converterFactory}
  * @typedef {object} oj.Validation.RegisteredConverter
  * @property {string} type the name of the factory registered converter
  * @property {Object=} options options to the converter
  */

};
/**
 * Internal property that identifies the type that is the contract for conveters and validators.
 * @private
 */

Validation._CONTRACTS = {
  converter: {
    name: 'oj.ConverterFactory',
    type: ConverterFactory
  },
  validator: {
    name: 'oj.ValidatorFactory',
    type: ValidatorFactory
  }
};



/* global Validation:false, ConverterFactory:false, ValidatorFactory:false, ColorConverter:false, LengthValidator:false, RegExpValidator:false, RequiredValidator:false */

/**
 * A factory implementation to create the built-in color converter of type
 * {@link oj.ColorConverter}.
 *
 * @name oj.ColorConverterFactory
 * @ojdeprecated {since: '8.0.0', description: 'Directly create new instances of ColorConverter instead.'}
 * @public
 * @class
 * @ojtsnoexport
 * @ojtsexportastype
 * @ojtsimport {module: "ojconverter-color", type: "AMD", importName: "ColorConverter"}
 * @hideconstructor
 * @example <caption>create an instance of the jet color converter using the options provided</caption>
 * var ccf = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_COLOR);
 * var options = {format: 'hsl'};
 * var colorConverter = ccf.createConverter(options);
 * @since 0.6.0
 *
 */
var ColorConverterFactory = function () {
  function _createColorConverter(options) {
    return new ColorConverter(options);
  }
  /**
   *
   * @public
   */


  return {
    /**
     * Creates an immutable (jet) color converter instance.
     *
     * @param {Object=} options an object literal used to provide an optional information to
     * initialize the jet color converter. For details on what to pass for options, refer to
     * {@link oj.ColorConverter}.
     *
     * @return {oj.ColorConverter}
     * @ojsignature {target: "Type", for: "options", value: "oj.ColorConverter.ConverterOptions"}
     * @instance
     * @memberof oj.ColorConverterFactory
     * @public
     */
    createConverter: function createConverter(options) {
      return _createColorConverter(options);
    }
  };
}(); // notice immediate invocation of anonymous function

/** Register the default factory provider function */


Validation.__registerDefaultConverterFactory(ConverterFactory.CONVERTER_TYPE_COLOR, // factory name
ColorConverterFactory); // JET VALIDATOR FACTORIES

/**
 * A factory implementation to create an instance of the built-in required validator of type
 * {@link oj.RequiredValidator}.
 *
 * @example <caption>create an instance of the required validator using the factory</caption>
 * var rvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REQUIRED);
 * var options = {'hint' : 'a value is required for this field'};
 * var requiredValidator = rvf.createValidator(options);
 *
 * @name oj.RequiredValidatorFactory
 * @hideconstructor
 * @ojtsnoexport
 * @ojtsexportastype
 * @ojtsimport {module: "ojvalidator-required", type: "AMD", importName: "RequiredValidator"}
 * @class
 * @public
 * @since 0.6.0
 *
 */


var RequiredValidatorFactory = function () {
  function _createRequiredValidator(options) {
    return new RequiredValidator(options);
  }

  return {
    /**
     * Creates an immutable validator instance of type @link oj.RequiredValidator that ensures that
     * the value provided is not empty.
     *
     * @param {Object=} options an object literal used to provide an optional hint and error
     * message. See {@link oj.RequiredValidator} for details.<p>
     *
     * @return {oj.RequiredValidator}
     * @ojsignature {target: "Type", for: "options", value: "oj.RequiredValidator.ValidatorOptions"}
     * @memberof oj.RequiredValidatorFactory
     * @instance
     * @public
     */
    createValidator: function createValidator(options) {
      return _createRequiredValidator(options);
    }
  };
}(); // notice immediate invocation of anonymous function

/** Register the default factory provider function */


Validation.__registerDefaultValidatorFactory(ValidatorFactory.VALIDATOR_TYPE_REQUIRED, RequiredValidatorFactory);
/**
 * A factory implementation that creates an instance of the built-in regExp validator of type
 * {@link oj.RegExpValidator}.
 *
 * @example <caption>create an instance of the regExp validator using the factory</caption>
 * var rvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP);
 * var usernameValidator = rvf.createValidator(
 *  {
 *    'pattern': '[a-zA-Z0-9]{3,}',
 *    'messageDetail': 'You must enter at least 3 letters or numbers'}
 *  });
 *
 * @name oj.RegExpValidatorFactory
 * @ojtsnoexport
 * @ojtsexportastype
 * @ojtsimport {module: "ojvalidator-regexp", type: "AMD", importName: "RegExpValidator"}
 * @class
 * @public
 * @hideconstructor
 * @since 0.6.0
 *
 */


var RegExpValidatorFactory = function () {
  function _createRegExpValidator(options) {
    return new RegExpValidator(options);
  }

  return {
    /**
     * Creates an immutable validator instance of type {@link oj.RegExpValidator} that ensures the value
     * matches the provided pattern.
     *
     * @param {Object} options an object literal used to provide the pattern, an optional hint, error
     * message among others. See {@link oj.RegExpValidator} for details.<p>
     *
     *
     * @return {oj.RegExpValidator}
     * @memberof oj.RegExpValidatorFactory
     * @ojsignature {target: "Type", for: "options", value: "oj.RegExpValidator.ValidatorOptions"}
     * @instance
     * @public
     */
    createValidator: function createValidator(options) {
      return _createRegExpValidator(options);
    }
  };
}(); // notice immediate invocation of anonymous function

/** Register the default factory provider function */


Validation.__registerDefaultValidatorFactory(ValidatorFactory.VALIDATOR_TYPE_REGEXP, RegExpValidatorFactory);
/**
 * Returns an instance of oj.LengthValidatorFactory that provides a factory method to create an
 * instance of a length validator.
 *
 * @example <caption>create an instance of the length validator using the factory</caption>
 * var lvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_LENGTH);
 * var options = {hint: {max: 'Enter {max} or fewer characters'}, max: 10};
 * var lValidator = lvf.createValidator(options);
 *
 * @name oj.LengthValidatorFactory
 * @hideconstructor
 * @ojtsnoexport
 * @ojtsexportastype
 * @ojtsimport {module: "ojvalidator-length", type: "AMD", importName: "LengthValidator"}
 * @class
 * @public
 * @since 0.6.0
 *
 */


var LengthValidatorFactory = function () {
  function _createLengthValidator(options) {
    return new LengthValidator(options);
  }

  return {
    /**
     * Creates an immutable validator instance of type oj.LengthValidator that ensures that the
     * value provided is withing a given length.
     *
     * @param {Object=} options an object literal used to provide the 'minimum', 'maximum' and other
     * optional values. See {@link oj.LengthValidator} for details.<p>
     *
     * @return {oj.LengthValidator}
     * @memberof oj.LengthValidatorFactory
     * @ojsignature {target: "Type", for: "options", value: "oj.LengthValidator.ValidatorOptions"}
     * @instance
     * @public
     */
    createValidator: function createValidator(options) {
      return _createLengthValidator(options);
    }
  };
}(); // notice immediate invocation of anonymous function

/** Register the default factory provider function */


Validation.__registerDefaultValidatorFactory(ValidatorFactory.VALIDATOR_TYPE_LENGTH, LengthValidatorFactory);



/* global Validation:false, ValidatorFactory:false, ConverterFactory:false */
var __ValidationFactoryBase = {};
__ValidationFactoryBase.Validation = Validation;
__ValidationFactoryBase.ValidatorFactory = ValidatorFactory;
__ValidationFactoryBase.ConverterFactory = ConverterFactory;

  ;return __ValidationFactoryBase;
});