/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojL10n!ojtranslations/nls/localeElements', 'ojs/ojmessaging'], function(oj, $, ojld)
{
/*
** Copyright (c) 2008, 2013, Oracle and/or its affiliates. All rights reserved.
**
**34567890123456789012345678901234567890123456789012345678901234567890123456789
*/

/*global ojld:true*/

/**
 * @class Locale Data Services
 * @export
 * @since 0.6
 */
oj.LocaleData = {};

/**
 * Sets the Locale Elements bundle used by JET
 * If an AMD loader (such as Require.js) is not present, this method should be called by the application to provide
 * a Locale Elements for JET.
 * This method may also be used by an application that wants to completely replace the Locale Elements bundle that is automatically
 * fetched by an AMD loader.
 * @param {Object} bundle resource bundle that should be used by the framework
 * @export
 */
oj.LocaleData.setBundle = function(bundle)
{
  oj.LocaleData._bundle = bundle;
};

/**
 * Retrieves the first day of week for the current locale's region
 * @return {number} a numeric representation of the first week day of the week: 
 * 0 for Sunday, 1 for Monday, etc.
 * @export
 */
oj.LocaleData.getFirstDayOfWeek = function()
{
  return oj.LocaleData._getWeekData("firstDay");
};

/**
 * Retrieves the first weekend day for the current locale's region
 * @return {number} a numeric representation of the first weekend day: 
 * 0 for Sunday, 1 for Monday, etc.
 * @export
 */
oj.LocaleData.getWeekendStart = function()
{
  return oj.LocaleData._getWeekData("weekendStart");
};

/**
 * Retrieves the last weekend day for the current locale's region
 * @return {number} a numeric representation of the last weekend day: 
 * 0 for Sunday, 1 for Monday, etc.
 * @export
 */
oj.LocaleData.getWeekendEnd = function()
{
  return oj.LocaleData._getWeekData("weekendEnd");
};

/**
 * Retrieves locale-specific names of the days of the week
 * @return {Array.<string>} names of the days from Sunday through Sturday
 * @param {string} type - the type of the name. Currently, "abbreviated", "narrow" and "wide" are supported
 * @export
 */
oj.LocaleData.getDayNames = function(type)
{
  if (type== null || (type !== "abbreviated" && type !== "narrow"))
  {
    type = "wide";
  }
  var days = oj.LocaleData._getCalendarData()["days"]["stand-alone"][type];
  
  return [days["sun"], days["mon"], days["tue"], days["wed"], days["thu"],  days["fri"],  days["sat"]];
};

/**
 * Retrieves locale-specific names of months
 * @return {Array.<string>} names of months from January through December
 * @param {string} type - the type of the name. Currently, "abbreviated", "narrow" and "wide" are supported
 * @export
 */
oj.LocaleData.getMonthNames = function(type)
{
  if (type== null || (type !== "abbreviated" && type !== "narrow"))
  {
    type = "wide";
  }
  var months = oj.LocaleData._getCalendarData()["months"]["stand-alone"][type];
  
  return [months["1"], months["2"], months["3"], months["4"], months["5"], months["6"],
           months["7"], months["8"], months["9"], months["10"], months["11"], months["12"]];
};

/**
 * Retrieves whether month is displayed prior to year
 * @return {boolean} whether month is prior to year
 * @export
 */
oj.LocaleData.isMonthPriorToYear = function() 
{
  var longDateFormat = oj.LocaleData._getCalendarData()["dateFormats"]["long"].toUpperCase(),
      monthIndex = longDateFormat.indexOf("M"),
	  yearIndex = longDateFormat.indexOf("Y");
  
  return monthIndex < yearIndex;
}

/**
 * @hidden
 * @private
 */
oj.LocaleData._getWeekData = function(key)
{
  var b = oj.LocaleData.__getBundle();
  var defRegion = "001";
  var region = oj.LocaleData._getRegion() || defRegion;
  
  var data = b["supplemental"]["weekData"][key];
  
  var val = data[region];
  
  if (val === undefined)
  {
    val = data[defRegion];
  }
  
  return val;
};

/**
 * @hidden
 * @private
 */
oj.LocaleData._getCalendarData = function()
{
   var b = oj.LocaleData.__getBundle();
   var main  = b['main'];
   
   // skip one level (the name of the locale)
   var data, p;
   for (p in main)
   {
     if (main.hasOwnProperty(p)) {
        data = main[p];
        break;
     }
   }
   return data['dates']['calendars']['gregorian'];
};

/**
 * @hidden
 * @private
 */
oj.LocaleData._getRegion = function()
{
  var locale = oj.Config.getLocale();
  if (locale)
  {
    var tokens = locale.toUpperCase().split(/-|_/);
    if (tokens.length >= 2)
    {
      var tag = tokens[1];
      if (tag.length == 4) // this is a script tag
      {
        if (tokens.length >= 3)
        {
          return tokens[2];
        }
      }
      else
      {
        return tag;
      }
    }
  }
  return null;
};

/**
 * @hidden
 * @private
 */
oj.LocaleData.__getBundle = function()
{
  var b = oj.LocaleData._bundle;
  if (b)
  {
    return b;
  }
  
  if (oj.__isAmdLoaderPresent()) {
    oj.Assert.assert(ojld !== undefined, "LocaleElements module must be loaded");
    return ojld;
  }
  return {};
};

/**
 * Called from oj.Config after AMD loader fetches LocaleElements for the new locale.
 *
 * @hidden
 * @private
 * 
 */
oj.LocaleData.__updateBundle = function(bundle)
{
  ojld = bundle;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * The ojvalidation module.
 * @name oj.Validation
 * @class 
 * @export
 * @since 0.6
 * 
 */
oj.Validation = {};

/**
 * Internal properties to hold all factory provider callbacks or instances by name
 * @private
 */
oj.Validation._converterFactories = {}; oj.Validation._validatorFactories = {};

/**
 * Internal properties to hold the default factory instances.
 * @private
 */
oj.Validation._defaultConverterFactories = {}; oj.Validation._defaultValidatorFactories = {};

/**
 * Internal property that identifies the type that is the contract for conveters and validators.
 * @private
 */
oj.Validation._CONTRACTS = {'converter' : {name: "oj.ConverterFactory",  type: oj.ConverterFactory},
                            'validator': {name: "oj.ValidatorFactory", type: oj.ValidatorFactory}};

/**
 * Module method to register and retrieve converter factory instances by name. 
 * When passed only the name, an existing factory (registered for the name) is returned. Callers can 
 * expect to get back the default 'number' and 'datetime' converters. 
 * When passed two arguments, a new factory for the name is registered. If the name already exists 
 * the new instance replaces the old one. 
 * 
 * @param {string} type a case insensitive name of the converter factory. 
 * @param {Object=} instance the instance of the factory that implements the contract for 
 * oj.ConverterFactory.
 * 
 * @export
 * @see oj.ConverterFactory
 */
oj.Validation.converterFactory = function (type, instance)
{
  var retValue;
  if (type && !instance)
  {
    // getter
    retValue = oj.Validation._getFactory(type, oj.Validation._converterFactories);
  }
  else if (type && instance)
  {
    // setter
    retValue = oj.Validation._registerFactory(type, 
                                              instance, 
                                              oj.Validation._converterFactories,
                                              oj.Validation._CONTRACTS['converter']);
  }
  
  return retValue;
};

/**
 * Module method to register and retrieve validator factory instances by name. 
 * When passed only the name, an existing factory (registered for the name) is returned. 
 * When passed two arguments, a new factory for the name is registered. If the name already exists 
 * the new instance replaces the old one. 
 * 
 * @param {string} type a case insensitive name of the validator factory. 
 * @param {Object=} instance the instance of the factory that implements the contract for 
 * oj.ValidatorFactory.
 * 
 * @export
 * @see oj.ValidatorFactory
 */
oj.Validation.validatorFactory = function (type, instance)
{
  var retValue;
  if (type && !instance)
  {
    // getter
    retValue = oj.Validation._getFactory(type, oj.Validation._validatorFactories);
  }
  else if (type && instance)
  {
    // setter
    retValue = oj.Validation._registerFactory(type, 
                                              instance, 
                                              oj.Validation._validatorFactories, 
                                              oj.Validation._CONTRACTS['validator']);
  }
  
  return retValue;
};

/**
 * Returns the default converter factory instances for the supported types as defined by the 
 * oj.ConverterFactory.
 * 
 * @param {string} type The default converter factory for the type. Supported types are 'number' and 
 * 'datetime'
 * @return {Object} an instance of oj.ConverterFactory or null if an unknown type is requested.
 * 
 * @export
 * @see oj.ConverterFactory
 * 
 */
oj.Validation.getDefaultConverterFactory = function (type)
{
  return oj.Validation._getFactory(type, oj.Validation._defaultConverterFactories);
};

/**
 * Returns the default validator factory instance for the requested types as defined by the 
 * oj.ValidatorFactory.
 * 
 * @param {string} type The default converter factory for the type. Supported types are 'number' and 
 * 'datetime'
 * @return {Object} an instance of oj.ConverterFactory or null if an unknown type is requested.
 * 
 * @export
 * @see oj.ValidatorFactory
 */
oj.Validation.getDefaultValidatorFactory = function (type)
{
  return oj.Validation._getFactory(type, oj.Validation._defaultValidatorFactories);
};

// PACKAGE PRIVATE METHODS
/**
 * Called only by internal jet converter factory implementations.
 * 
 * @param {string} name
 * @param {Object} instance
 * @private
 */
oj.Validation.__registerDefaultConverterFactory = function (name, instance)
{
  // save to both factories
  var contractDef = oj.Validation._CONTRACTS['converter'];
  oj.Validation._registerFactory (name, instance, oj.Validation._defaultConverterFactories, contractDef);
  oj.Validation._registerFactory(name, instance, oj.Validation._converterFactories, contractDef);
};

/**
 * Called only by internal jet validator factory implementations.
 * 
 * @param {string} name of the validator factory
 * @param {Object} instance of the validator factory that creates instances of the validator
 * @private
 */
oj.Validation.__registerDefaultValidatorFactory = function (name, instance)
{
  // save to both factories
  var contractDef = oj.Validation._CONTRACTS['validator'];
  oj.Validation._registerFactory (name, instance, oj.Validation._defaultValidatorFactories, contractDef);
  oj.Validation._registerFactory(name, instance, oj.Validation._validatorFactories, contractDef);
};


/**
 * Checks that the instance implements the interface type. If it doesn't it throws an error.
 * @param {Object} instance
 * @param {Object} type
 * @param {string} typeName 
 * @throws {Error} if instance does not implement the methods defined on type.  
 * @private
 */
oj.Validation._doImplementsCheck = function (instance, type, typeName)
{
  if (type)
  {
    // Check that instance duck types providerType
    if (!oj.Validation._quacksLike(instance, type))
    {
      throw new Error("Factory instance does not implement the methods expected by the factory of type " + typeName);
    }
  }
};

/**
 * Retrieves the converter factory by name from the provided factories.
 * @private
 */
oj.Validation._getFactory = function(name, factories)
{
  oj.Assert.assertString(name);
  var cachedInstance = null;
  
  if (name)
  {
    name = name.toLowerCase();

    // getter called to retrieve the factory instance 
    var providerProps = factories[name] || {}; 
    cachedInstance = providerProps['instance'] || null;
  }
  // TODO: log a warning that name is null
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
oj.Validation._quacksLike = function(thingie, duck) 
{
  var valid = true, property;

  oj.Assert.assertObject(thingie);
  oj.Assert.assertObject(duck);

  for (property in duck) 
  {
    // Ensure that thingie defines the same functions as duck. We don't care about other properties
    if (duck.hasOwnProperty(property)) 
    {
      if (typeof duck[property] === "function" && 
              !thingie[property] && typeof thingie[property] !== "function") 
      {
        valid = false;
        break;
      }
    }
  }
  
  return valid;
};

/**
 * Registers the factory instance by the name, storing it into the factories object, after ensruing 
 * that the instance duck types the specified contract.
 * 
 * @private
 */
oj.Validation._registerFactory = function(name, instance, factories, contractDef)
{
  oj.Assert.assertString(name);
  oj.Assert.assertObject(instance);

  if (name)
  {
    // set new provider factory function clearing out the previously stored instance
    var props = {};
    props['instance'] = instance;
    oj.Validation._doImplementsCheck(instance, contractDef.type, contractDef.name);

    // Save to default and public factories
    factories[name.toLowerCase()] = props;
  }
};

/**
 * Contract for a ConverterFactory that provides a factory method to create a converter instance for 
 * the requested type. JET provides 2 factory implementations for number and datetime types that 
 * implement this contract. Customers can register custom converter factories for the supported 
 * types or create and register factories for new types altogether.
 * 
 * @name oj.ConverterFactory
 * @abstract
 * @class
 * @export
 * @see oj.Validation
 * @see oj.NumberConverterFactory
 * @see oj.DateTimeConverterFactory
 */
oj.ConverterFactory = 
{
  /**
   * Default type for a factory used to create number converters. This type is passed to the 
   * [Validation.converterFactory]{@link oj.Validation#converterFactory} method to retrieve the 
   * number converter factory of type {@link oj.NumberConverterFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "CONVERTER_TYPE_NUMBER" : 'number',
  
  /**
   * Default type for a factory used to create datetime converters. This type is passed to the 
   * [Validation.converterFactory]{@link oj.Validation#converterFactory} method to retrieve the 
   * datetime converter factory of type {@link oj.DateTimeConverterFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "CONVERTER_TYPE_DATETIME" : 'datetime',

  /**
   * Creates an immutable converter instance of the type the factory implements. 
   * 
   * @param {(Object|null)} options an object literal containing properties required by the converter 
   * for its initialization. The properties provided in the options is implementation specific.
   * 
   * @return {Object} a converter instance.
   * @throws {TypeError} if an unrecognized type was provided 
   * @expose
   */
  createConverter : function(options) {}  
};

/**
 * Contract for a ValidatorFactory that provides a factory method to create a validator instance for 
 * the requested type. JET provides several factory implementations that implement this contract - 
 * for example dateRestriction, dateTimeRange, numberRange, length, required, regexp. Customers can 
 * register custom validator factories for the supported types or create and register factories for 
 * new types altogether.
 * 
 * @name oj.ValidatorFactory
 * @abstract
 * @class
 * @export
 * @see oj.Validation
 * @see oj.DateRestrictionValidatorFactory
 * @see oj.DateTimeRangeValidatorFactory
 * @see oj.LengthValidatorFactory
 * @see oj.NumberRangeValidatorFactory
 * @see oj.RegExpValidatorFactory
 * @see oj.RequiredValidatorFactory
 */
oj.ValidatorFactory = 
{
  /**
   * Default type for a factory used to create required validators. This type is passed to the 
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * required validator factory of type {@link oj.RequiredValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_REQUIRED" : 'required',
          
  /**
   * Default type for a factory used to create regExp validators. This type is passed to the 
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * regExp validator factory of type {@link oj.RegExpValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_REGEXP" : 'regexp',

  /**
   * Default type for a factory used to create numberRange validators. This type is passed to the 
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * numberRange validator factory of type {@link oj.NumberRangeValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_NUMBERRANGE" : 'numberRange',

  /**
   * Default type for a factory used to create length validators. This type is passed to the 
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * length validator factory of type {@link oj.LengthValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_LENGTH" : 'length',

  /**
   * Default type for a factory used to create required validators. This type is passed to the 
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * dateTimeRange validator factory of type {@link oj.DateTimeRangeValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_DATETIMERANGE" : 'dateTimeRange',
  
  /**
   * Default type for a factory used to create date restriction validators. This type is passed to 
   * the [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * dateRestriction validator factory of type {@link oj.DateRestrictionValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_DATERESTRICTION" : 'dateRestriction',
          
  /**
   * Creates an immutable validator instance of the type the factory implements. 
   * 
   * @param {(Object|null)} options an object literal containing properties required by the validator 
   * for its initialization. The properties provided in the options is implementation specific.
   * 
   * @return {Object} a validator instance.
   * @throws {TypeError} if an unrecognized type was provided 
   * @expose
   */
  createValidator : function(options) {}  
};

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Converter Contract
 */

/**
 * Constructs an immutable instance of Converter.
 * 
 * @param {Object=} options an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @export
 * @constructor
 * @since 0.6
 */
oj.Converter = function(options)
{
  this.Init(options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.Converter, oj.Object, "oj.Converter");


/**
 * Initializes converter instance with the set options
 * @param {Object=} options an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @export
 */
oj.Converter.prototype.Init = function(options) 
{
  oj.Converter.superclass.Init.call(this);
  // should we make options truly immutable? non-configurable, non-enumerable, non-writable
  // Object.defineProperty(oj.Converter.prototype, "_options", {value: options});
  this._options = options;
};

/**
 * Returns a hint that describes the converter format expected.
 * @return {String|null} a hint describing the format the value is expected to be in.
 * @export
 */
oj.Converter.prototype.getHint = function () 
{
  oj.Assert.failedInAbstractFunction();
  return null;
};

/**
 * Returns the options called with converter initialization.
 * @return {Object} an object of options.
 * @export
 */
oj.Converter.prototype.getOptions = function () 
{
  return (this._options || {});
};

/**
 * Parses a String value using the options provided. 
 * 
 * @param {String} value to parse
 * @return {(Number|Date)} the parsed value. 
 * @throws {Error} if parsing fails
 * @export
 */
oj.Converter.prototype.parse = function (value) 
{
  oj.Assert.failedInAbstractFunction();
  return null;
};

/**
 * Formats the value using the options provided. 
 * 
 * @param {(Number|Date)} value the value to be formatted for display
 * @return {(String|null)} the localized and formatted value suitable for display
 * @throws {Error} if formatting fails.
 * @export
 */
oj.Converter.prototype.format = function (value) 
{
  oj.Assert.failedInAbstractFunction();
  return null;
};

/**
 * Returns an object literal with locale and formatting options computed during initialization of 
 * the object. If options was not provided at the time of initialization, the properties will be 
 * derived from the locale defaults.
 * @return {Object} an object of resolved options.
 * @export
 */
oj.Converter.prototype.resolvedOptions = function ()
{
  var resolved = {};
  // returns a clone of this._options
  $.extend(resolved, this._options);
  
  return resolved;
};


// oj.ConverterError

/**
 * Constructs a ConverterError instance from a summary and detail 
 * 
 * @param {string} summary a localized String that provides a summary of the error
 * @param {string} detail a localized String that provides a detail of the error
 * @constructor
 * @export
 */
oj.ConverterError = function (summary, detail)
{
  var message = new oj.Message(summary, detail, oj.Message.SEVERITY_LEVEL['ERROR']);
  this.Init(message); 
};

oj.ConverterError.prototype = new Error();

/**
 * Initializes the instance. 
 * @param {Object} message instance of oj.Message
 * @export
 */
oj.ConverterError.prototype.Init = function (message)
{
  var detail = message['detail'], summary = message['summary'];
  this._message = message;

  // so browser can get to e.name and e.message 
  this.name = 'Converter Error';
  this.message = detail || summary;
};

/**
 * Returns an instance of oj.Message.
 * 
 * @return {Object} instance of oj.Message
 * @export
 */
oj.ConverterError.prototype.getMessage = function ()
{
  return this._message;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * oj.NumberConverter Contract. 
 */

/**
 * @export
 * @constructor
 * @augments oj.Converter 
 * @name oj.NumberConverter
 * @since 0.6
 */
oj.NumberConverter = function()
{
  this.Init();
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.NumberConverter, oj.Converter, "oj.NumberConverter");

/**
 * Initializes the number converter instance with the set options.
 * @param {Object=} options an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @export
 */
oj.NumberConverter.prototype.Init = function(options) 
{
  oj.NumberConverter.superclass.Init.call(this, options);
};

/**
 * Formats the Number value using the options provided and returs a String value.
 * 
 * @param {Number} value the value to be formatted for display
 * @return {(String|null)} the localized and formatted value suitable for display
 * @throws {Error} a ConverterError if formatting fails.
 * @export
 */
oj.NumberConverter.prototype.format = function (value) 
{
  return oj.NumberConverter.superclass.format.call(this, value);
};

/**
 * Parses the value using the options provided and returns a Number object.
 * 
 * @param {String} value to parse
 * @return {Number} the parsed value as a Number object.
 * @throws {Error} a ConverterError if parsing fails
 * @export
 */
oj.NumberConverter.prototype.parse = function (value) 
{
  return oj.NumberConverter.superclass.parse.call(this, value);
};

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * oj.DateTimeConverter Contract. 
 */

/**
 * @constructor
 * @param {Object=} options an object literal used to provide an optional information to 
 * @augments oj.Converter 
 * @name oj.DateTimeConverter
 * @export
 * @since 0.6
 */
oj.DateTimeConverter = function(options)
{
  this.Init(options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.DateTimeConverter, oj.Converter, "oj.DateTimeConverter");

/**
 * Initializes the date time converter instance with the set options.
 * 
 * @param {Object=} options an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @export
 */
oj.DateTimeConverter.prototype.Init = function(options) 
{
  oj.DateTimeConverter.superclass.Init.call(this, options);
};

/**
 * Formats the local isoString value using the options provided and returns a string value. Note that if previous application 
 * code was passing a JavaScript Date object which is no longer supported, one can use the utility function oj.IntlConverterUtils.dateToLocalIso 
 * to get the proper isoString value.
 * 
 * @example <caption>For example <code class="prettyprint">converter.format(oj.IntlConverterUtils.dateToLocalIso(new Date()))</code></caption>
 * @see oj.IntlConverterUtils.dateToLocalIso
 * @param {string} value to be formatted for display which should be a local isoString
 * @return {(string|null)} the localized and formatted value suitable for display
 * @throws {Error} a ConverterError if formatting fails.
 * @export
 */
oj.DateTimeConverter.prototype.format = function (value) 
{
  return oj.DateTimeConverter.superclass.format.call(this, value);
};


/**
 * Returns true if a 24-hour format is set; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isHourInDaySet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if 12-hour is set; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isHourInAMPMSet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if minutes are shown in the time portion; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isMinuteSet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if seconds are shown in the time portion; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isSecondSet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if milliseconds are shown in the time portion; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isMilliSecondSet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if year is shown in the date portion; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isYearSet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if month is shown in the date portion; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isMonthSet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if day is shown in the date portion; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isDaySet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if the day name is shown in the date portion; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isDayNameSet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns the calculated week for the isoString value.
 * @export
 */
oj.DateTimeConverter.prototype.calculateWeek = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Parses the value using the options provided and returns a local isoString value. For convenience if one wishes to 
 * retrieve a JavaScript Date object from the local isoString an utility function oj.IntlConverterUtils.isoToLocalDate is 
 * provided.
 * 
 * @example <caption>For example <code class="prettyprint">oj.IntlConverterUtils.isoToLocalDate(converter.parse(isoString))</code></caption>
 * @see oj.IntlConverterUtils.isoToLocalDate
 * @param {string} value to parse
 * @return {string} the parsed value as a local isoString value
 * @throws {Error} a ConverterError if parsing fails
 * @export
 */
oj.DateTimeConverter.prototype.parse = function (value) 
{
  return oj.DateTimeConverter.superclass.parse.call(this, value);
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Validator Contract
 */

/**
 * @constructor
 * @export
 * @since 0.6
 * 
 */
oj.Validator = function()
{
  this.Init();
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.Validator, oj.Object, "oj.Validator");

/**
 * Initializes validator instance with the set options
 * @export
 */
oj.Validator.prototype.Init = function() 
{
  oj.Validator.superclass.Init.call(this);
};

/**
 * Vaidates the value.
 * 
 * @param {Object} value to be validated
 * @return {*} a boolean true if validation passes.
 * @throws Error if validation fails
 * @export
 */
oj.Validator.prototype.validate = function (value) {
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns a hint that describes the validator rule.
 * @returns {*} a hint string or null
 * @export
 */
oj.Validator.prototype.getHint = function () 
{
  oj.Assert.failedInAbstractFunction();
};

// ValidatorError

/**
 * Constructs a ValidatorError instance from a summary and detail 
 * 
 * @param {string} summary a localized String that provides a summary of the error
 * @param {string} detail a localized String that provides a detail of the error
 * @constructor
 * @export
 */
oj.ValidatorError = function (summary, detail)
{
  var message = new oj.Message(summary, 
                               detail, 
                               oj.Message.SEVERITY_LEVEL['ERROR']);
  this.Init(message); 
};

oj.ValidatorError.prototype = new Error();

/**
 * Initializes the instance. 
 * @param {Object} message an instance of oj.Message
 * @export
 */
oj.ValidatorError.prototype.Init = function (message)
{
  var detail = message['detail'], summary = message['summary'];
  this._message = message;

  // so browser can get to e.name and e.message 
  this.name = 'Validator Error';
  this.message = detail || summary;
};

/**
 * Returns an instance of oj.Message.
 * 
 * @returns {Object} instance of oj.Message
 * @export
 */
oj.ValidatorError.prototype.getMessage = function ()
{
  return this._message;
};
/**
 * Copyright (c) 2008, 2013, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Constructs a RequiredValidator that ensures that the value provided is not empty
 * @param {Object=} options an object literal used to provide an optional hint and error message.<p>
 * @param {string=} options.hint an optional hint text. There is no default hint provided by this 
 * validator.
 * @param {string=} options.messageSummary - an optional custom error message summarizing the 
 * error. When not present, the default message summary is the resource defined with the key 
 * <code class="prettyprint">oj-validator.required.summary</code>.<p>
 * Tokens: {label} - this token can be used to substitute the label of the component at runtime. </p>
 * <p>
 * Example:<br/>
 * "'{label}' Required"<br/>
 * </p>
 * @param {string=} options.messageDetail - a custom error message used for creating detail part 
 * of message, when the value provided is empty. When not present, the default message detail is the 
 * resource defined with the key <code class="prettyprint">oj-validator.required.detail</code>.
 * <p>Tokens: {label} - this token can be used to substitute the label of the component at runtime.</p>
 * <p>
 * Example:<br/>
 * "A value is required for the field '{label}'."<br/>
 * </p>
 * 
 * @export
 * @constructor
 * @since 0.6
 * 
 */
oj.RequiredValidator = function(options) 
{
  this.Init(options);
};

// Subclass from oj.Object or oj.Validator. It does not matter
oj.Object.createSubclass(oj.RequiredValidator, oj.Validator, "oj.RequiredValidator");

// key to access required validator specific resources in the bundle 
oj.RequiredValidator._BUNDLE_KEY_DETAIL = "oj-validator.required.detail";
oj.RequiredValidator._BUNDLE_KEY_SUMMARY = "oj-validator.required.summary";

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @memberof oj.RequiredValidator
 * @instance
 * @export
 */
oj.RequiredValidator.prototype.Init = function(options) 
{
  oj.RequiredValidator.superclass.Init.call(this);
  this._options = options;
};

/**
 * Validates value to be non-empty
 * 
 * @param {Object|string|number} value that is being validated 
 * @returns {boolean} true if validation was was successful the value is non-empty
 * 
 * @throws {Error} when fails required-ness check
 * @memberof oj.RequiredValidator
 * @instance
 * @export
 */
oj.RequiredValidator.prototype.validate = function(value)
{
  var localizedDetail, localizedSummary, detail, summary, params = {}, label = "";
  // checks for empty arrays and String. Objects are considered non-null.
  // Need to specifically test for if value is 0 first if number is passed on.
  if ((typeof value === "number" && value === 0) || (value && value.length !== 0))
  {
    return true;
  }
  else
  {
    if (this._options)
    {
      // we have deprecated support for message param and instead use messageDetail.
      detail = this._options['messageDetail'] || this._options['message'] || null;
      summary = this._options['messageSummary'] || null;
      label = this._options['label'] || "";
    }
    params = {'label': label};
    localizedSummary = (summary) ? oj.Translations.applyParameters(summary, params) :
            oj.Translations.getTranslatedString(this._getSummaryKey(), params);
    localizedDetail = (detail) ? 
    oj.Translations.applyParameters(detail, params) : 
    oj.Translations.getTranslatedString(this._getDetailKey(), params);
    
    throw new oj.ValidatorError(localizedSummary, localizedDetail);
  }

};

/**
 * A message to be used as hint, when giving a hint on the expected pattern. There is no default 
 * hint for this property.
 * 
 * @returns {String|string|null} a hint message or null if no hint is available in the options
 * @memberof oj.RequiredValidator
 * @instance
 * @export
 */
oj.RequiredValidator.prototype.getHint = function()
{
  var hint = "";
  if (this._options && (this._options['hint']))
  {
    hint = oj.Translations.getTranslatedString(this._options['hint']);
  }
  
  return hint;
};

oj.RequiredValidator.prototype._getSummaryKey = function ()
{
  return oj.RequiredValidator._BUNDLE_KEY_SUMMARY;
};

oj.RequiredValidator.prototype._getDetailKey = function ()
{
  return oj.RequiredValidator._BUNDLE_KEY_DETAIL;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * Constructs a DateRestrictionValidator that ensures the value provided is not in a disabled entry of dayMetaData
 * @param {Object=} options an object literal used to provide the following properties
 * @param {Function=} options.dayFormatter - Additional info to be used when rendering the day. This 
 * should be a JavaScript Function callback which accepts as its argument the following JSON format 
 * <code class="prettyprint">{fullYear: Date.getFullYear(), month: Date.getMonth()+1, date: Date.getDate()}</code>
 * and returns <code class="prettyprint">null</code> or all or partial JSON data of the form 
 * <code class="prettyprint">{disabled: true|false, className: "additionalCSS", tooltip: 'Stuff to display'}</code>
 * @param {string=} options.messageSummary - an optional custom error message summarizing the 
 * error. When not present, the default message summary is the resource defined with the key 
 * <code class="prettyprint">oj-validator.restriction.date.messageSummary</code>.
 * Tokens: {value} - value entered by user<p>. 
 * Example:<br/>
 * "Value {value} is disabled."<br/>
 * <p>
 * @param {string=} options.messageDetail - a custom error message used for creating detail part 
 * of message. When not present, the default message detail is the 
 * resource defined with the key <code class="prettyprint">oj-validator.restriction.date.messageDetail</code>.
 * Tokens: {value} - value entered by user<p>. 
 * Example:<br/>
 * "Value {value} is a disabled entry. Please select a different date."<br/>
 * </p>
 * @export
 * @constructor
 * @since 0.6
 */
oj.DateRestrictionValidator = function _DateRestrictionValidator(options)
{
  this.Init(options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.DateRestrictionValidator, oj.Validator, "oj.DateRestrictionValidator");

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @memberof oj.DateRestrictionValidator
 * @instance
 * @export
 */
oj.DateRestrictionValidator.prototype.Init = function (options)
{
  oj.DateRestrictionValidator.superclass.Init.call(this);
  this._dayFormatter = options["dayFormatter"];
  this._converter = oj.IntlConverterUtils.getConverterInstance(options["converter"]);
  if (options)
  {
    this._messageSummary = options['messageSummary'] || null;
    this._messageDetail = options['messageDetail'] || null;
  }
};

/**
 * Validates whether the date provided is part of disabled date
 *
 * @private
 * @ignore
 * @param {Date} valueDate that is being validated
 * @returns {boolean} boolean of whether it is a disabled date
 */
oj.DateRestrictionValidator.prototype._inDisabled = function(valueDate) 
{
  var dayFormatter = this._dayFormatter;
  
  if(dayFormatter) {
    var fullYear = valueDate.getFullYear(),
        month = valueDate.getMonth() + 1, //request to start from 1 rather than 0
        date = valueDate.getDate(),
        metaData = dayFormatter({"fullYear": fullYear, "month": month, "date": date});
    
    return metaData && metaData.disabled;
  }
  
  return false;
};

/**
 * Validates whether the date provided is part of disabled date
 *
 * @param {string} value that is being validated
 * @returns {string} original if validation was successful
 *
 * @throws {Error} when there is no match
 * @memberof oj.DateRestrictionValidator
 * @instance
 * @export
 */
oj.DateRestrictionValidator.prototype.validate = function (value)
{
  var summary = "", 
      detail = "", 
      translations = oj.Translations, 
      messageSummary = this._messageSummary,
      messageDetail = this._messageDetail,
      valueStr = value ? this._converter['format'](value) : value,
      valueDate = value ? oj.IntlConverterUtils.isoToLocalDate(value) : null;
  
  if(value === null) 
  {
    return value;
  }
  
  if(this._inDisabled(valueDate)) {
    
    summary = messageSummary ? translations.applyParameters(messageSummary, {"value": valueStr}) : 
                translations.getTranslatedString('oj-validator.restriction.date.messageSummary', {"value": valueStr});
    detail = messageDetail ? translations.applyParameters(messageDetail, {"value": valueStr}) : 
                translations.getTranslatedString('oj-validator.restriction.date.messageDetail', {"value": valueStr});
    throw new oj.ValidatorError(summary, detail);
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
 */
oj.DateRestrictionValidator.prototype.getHint = function ()
{
  return null;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * Constructs a DateTimeRangeValidator that ensures the value provided is within a given range
 * @param {Object=} options an object literal used to provide the following properties
 * @param {string=} options.min - the minimum datetime value of the entered value. Should be local ISOString.
 * @param {string=} options.max - the maximum datetime value of the entered value. Should be local ISOString.
 * @param {Object=} options.hint - an optional object literal of hints to be used. 
 * @param {string=} options.hint.max - a hint used to indicate the allowed maximum. When not present, 
 * the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.datetime.hint.max</code>.<p>
 * Tokens: <br/>
 * {max} - the maximum<p>
 * Usage: <br/>
 * Enter a datetime less than or equal to {max}
 * @param {string=} options.hint.min - a hint used to indicate the allowed minimum. When not present, 
 * the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.datetime.hint.min</code>.<p>
 * Tokens: <br/>
 * {min} the minimum <p>
 * Usage: <br/>
 * Enter a datetime greater than or equal to {min}
 * @param {string=} options.hint.inRange - a hint used to indicate the allowed range. When not 
 * present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.datetime.hint.inRange</code>.<p>
 * Tokens:<br/>
 * {min} the minimum<br/>
 * {max} the maximum<p>
 * Usage: <br/>
 * Enter a datetime between {min} and {max}
 * @param {Object=} options.messageDetail - an optional object literal of custom error messages to 
 * be used.
 * @param {string=} options.messageDetail.rangeUnderflow - the detail error message to be used when 
 * input value is less than the set minimum value. When not present, the default detail message is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.datetime.messagedetail.rangeUnderflow</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {min} - the minimum allowed value<p>
 * Usage: <br/>
 * Entered {value} with min being {min}
 * @param {string=} options.messageDetail.rangeOverflow - the detail error message to be used when 
 * input value exceeds the maximum value set.  When not present, the default detail message is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.datetime.messagedetail.rangeOverflow</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {max} - the maximum allowed value<p>
 * Usage: <br/>
 * Entered {value} with max being {max}
 * @param {Object=} options.messageSummary - optional object literal of custom error summary message 
 * to be used. 
 * @param {string=} options.messageSummary.rangeUnderflow - the summary of the error message when 
 * input value is less than the set minimum value. When not present, the default message summary is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.datetime.messageSummary.rangeUnderflow</code>.
 * @param {string=} options.messageSummary.rangeOverflow - the summary of the error message when 
 * input value exceeds the maximum value set.  When not present, the default message summary is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.datetime.messageSummary.rangeOverflow</code>.
 * @export
 * @constructor
 * @since 0.6
*/
oj.DateTimeRangeValidator = function _DateTimeRangeValidator(options)
{
  this.Init(options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.DateTimeRangeValidator, oj.Validator, "oj.DateTimeRangeValidator");

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @memberof oj.DateTimeRangeValidator
 * @instance
 * @export
 */
oj.DateTimeRangeValidator.prototype.Init = function (options)
{
  oj.DateTimeRangeValidator.superclass.Init.call(this);
  
  //if undefined set to null as they are equivalent in terms of logic
  //setting to null for the default validator [min + max option] is taken care of for ojInputDate 
  //in _InitOptions for min + max values [default validator]; however 
  //user can pass in the validators via validators option so taking care of it here
  this._converter = oj.IntlConverterUtils.getConverterInstance(options["converter"]);
  this._min = options["min"] || null;
  this._max = options["max"] || null;
  
  if (options)
  {
    this._hint = options['hint'] || {};
    this._customMessageSummary = options['messageSummary'] || {};
    this._customMessageDetail = options['messageDetail'] || {};
  }
};

/**
 * Validates the minimum + maximum conditions
 *
 * @param {string} value that is being validated
 * @returns {string} original if validation was successful
 *
 * @throws {Error} when there is no match
 * @memberof oj.DateTimeRangeValidator
 * @instance
 * @export
 */
oj.DateTimeRangeValidator.prototype.validate = function (value)
{
  var customMessageSummary = this._customMessageSummary,
      customMessageDetail = this._customMessageDetail,
      messageDetailRangeOverflow = customMessageDetail["rangeOverflow"], 
      messageDetailRangeUnderflow = customMessageDetail["rangeUnderflow"], 
      messageSummaryRangeOverflow = customMessageSummary["rangeOverflow"],
      messageSummaryRangeUnderflow = customMessageSummary["rangeUnderflow"],
      converterUtils = oj.IntlConverterUtils,
      min = this._min, 
      max = this._max, 
      summary = "", 
      detail = "", 
      translations = oj.Translations, 
      params = null,
      valStr,
      valDate,
      minStr,
      maxStr;
  
  if(value === null) 
  {
    // request to not throw an error when value being passed is of null
    return value;
  }
  
  valStr = this._converter['format'](value);
  valDate = converterUtils.isoToLocalDate(value);
  
  if(min) 
  {
    minStr = this._converter ? this._converter['format'](min) : min;
    min = converterUtils.isoToLocalDate(converterUtils._minMaxIsoString(min, value));
  }
  
  if(max)
  {
    maxStr = this._converter ? this._converter['format'](max) : max;
    max = converterUtils.isoToLocalDate(converterUtils._minMaxIsoString(max, value));
  }
  
  if (min !== null && max !== null)
  {
    //range
    if ((valDate >= min && valDate <= max) || min > max)
    {
      return value;
    }
  }
  else 
  {
    //only min
    if (min !== null)
    {
      if (valDate >= min)
      {
        return value;
      }
	  
    }
    //max only
    else 
    {
      if (max === null || valDate <= max)
      {
        return value;
      }
      
    }
  }
  
  if (max !== null && valDate > max)
  {
      params = {"value": valStr, "max": maxStr};
      summary = messageSummaryRangeOverflow ? messageSummaryRangeOverflow : 
        translations.getTranslatedString('oj-validator.range.datetime.messageSummary.rangeOverflow');
      detail = messageDetailRangeOverflow ? 
        translations.applyParameters(messageDetailRangeOverflow, params) : 
        translations.getTranslatedString('oj-validator.range.datetime.messageDetail.rangeOverflow', 
        params);
  }
  else if (min !== null && valDate < min)
  {
      params = {"value": valStr, "min": minStr};
      summary = messageSummaryRangeUnderflow ? messageSummaryRangeUnderflow : 
        translations.getTranslatedString('oj-validator.range.datetime.messageSummary.rangeUnderflow');
      detail = messageDetailRangeUnderflow ?
        translations.applyParameters(messageDetailRangeUnderflow, params) : 
        translations.getTranslatedString('oj-validator.range.datetime.messageDetail.rangeUnderflow', 
        params);   
  }
 

  throw new oj.ValidatorError(summary, detail);
};

/**
 * A message to be used as hint.
 *
 * @returns {string|null} a hint message or null if no hint is available in the options
 * @memberof oj.DateTimeRangeValidator
 * @instance
 * @export
 */
oj.DateTimeRangeValidator.prototype.getHint = function ()
{
  var hint = null, hints = this._hint, 
      hintInRange = hints["inRange"], hintMinimum = hints["min"], 
      hintMaximum = hints["max"],
      min = this._min, 
      max = this._max, 
      minStr = min && this._converter ? this._converter['format'](min) : min,
      maxStr = max && this._converter ? this._converter['format'](max) : max,
      params = null,
      translations = oj.Translations;
  
  if (min !== null && max !== null) 
  {
    params = {"min": minStr, "max": maxStr};
    hint = hintInRange ? translations.applyParameters(hintInRange, params) : 
            translations.getTranslatedString('oj-validator.range.datetime.hint.inRange', params);
  }
  else if (min !== null)
  {
    params = {"min": minStr};
    hint = hintMinimum ?  translations.applyParameters(hintMinimum, params) :
            translations.getTranslatedString('oj-validator.range.datetime.hint.min', params);
  }
  else if (max !== null)
  {
    params = {"max": maxStr};
    hint = hintMaximum ?  translations.applyParameters(hintMaximum, params) :
            translations.getTranslatedString('oj-validator.range.datetime.hint.max', params);
  }

  return hint;
};
/**
 * Copyright (c) 2008, 2013, Oracle and/or its affiliates. 
 * All rights reserved.
 */

/**
 * A factory implementation to create the built-in number converter of type 
 * {@link oj.IntlNumberConverter}. 
 * 
 * @name oj.NumberConverterFactory
 * @class
 * 
 * @example <caption>create an instance of the jet datetime converter using the options provided</caption>
 * var ncf = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER); 
 * var salaryOptions = {currency: "EUR" , pattern: "¤#,##0.00;(¤#,##0.00)"};
 * var salaryConverter = ncf.createConverter(salaryOptions);
 * @public
 * @since 0.6
 * 
 */
oj.NumberConverterFactory = (function () 
{
  
  function _createNumberConverter(options) 
  {
    return new oj.IntlNumberConverter(options);
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
     * @memberOf oj.NumberConverterFactory
     * @public
     */
    'createConverter': function(options) {
      return _createNumberConverter(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultConverterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER, // factory name
                               oj.NumberConverterFactory);


/**
 * A factory implementation to create the built-in datetime converter of type 
 * {@link oj.IntlDateTimeConverter}. 
 * 
 * @name oj.DateTimeConverterFactory
 * @public
 * @class
 * @example <caption>create an instance of the jet datetime converter using the options provided</caption>
 * var dtcf = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);  
 * var dateOptions = {year: '2-digit', month: 'numeric', day: 'numeric'};
 * var dateConverter = dtcf.createConverter(dateOptions);
 * @since 0.6
 * 
 */
oj.DateTimeConverterFactory = (function () 
{
  function _createDateTimeConverter(options) 
  {
    return new oj.IntlDateTimeConverter(options);
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
     * @link oj.IntlDateTimeConverter.
     * 
     * @return {oj.IntlDateTimeConverter} 
     * @memberOf oj.DateTimeConverterFactory
     * @public
     */
    'createConverter' : function(options) {
      return _createDateTimeConverter(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultConverterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME, // factory name
                               oj.DateTimeConverterFactory);


// JET VALIDATOR FACTORIES 

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
 * @class
 * @public
 * @since 0.6
 * 
 */
oj.RequiredValidatorFactory = (function () 
{
  
  function _createRequiredValidator(options) 
  {
    return new oj.RequiredValidator(options);
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
     * @memberOf oj.RequiredValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createRequiredValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REQUIRED,
                                                oj.RequiredValidatorFactory);
                               
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
 * @class
 * @public
 * @since 0.6
 * 
 */
oj.RegExpValidatorFactory = (function () 
{
  
  function _createRegExpValidator(options) 
  {
    return new oj.RegExpValidator(options);
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
     * @memberOf oj.RegExpValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createRegExpValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP,
                                                oj.RegExpValidatorFactory);
                                        
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
 * @class
 * @public
 * @since 0.6
 * 
 */
oj.DateTimeRangeValidatorFactory = (function () 
{
  
  function _createDateTimeRangeValidator(options) 
  {
    return new oj.DateTimeRangeValidator(options);
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
     * @memberOf oj.DateTimeRangeValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createDateTimeRangeValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE,
                                                oj.DateTimeRangeValidatorFactory);
												
/**
 * a factory method to create an instance of the built-in dateRestriction validator of type 
 * {@link oj.DateRestrictionValidator}. 
 * 
 * @example <caption>create an instance of the dateRestriction validator using the factory </caption>
 * var drvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATERESTRICTION);
 * var drValidator = drvf.createValidator();
 *  
 * @name oj.DateRestrictionValidatorFactory
 * @class
 * @since 0.6
 * @public
 * 
 */
oj.DateRestrictionValidatorFactory = (function () 
{
  
  function _createDateRestrictionValidator(options) 
  {
    return new oj.DateRestrictionValidator(options);
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
     * @memberOf oj.DateRestrictionValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createDateRestrictionValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATERESTRICTION,
                                                oj.DateRestrictionValidatorFactory);
                                        
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
 * @class
 * @public
 * @since 0.6
 * 
 */
oj.NumberRangeValidatorFactory = (function () 
{
  
  function _createNumberRangeValidator(options) 
  {
    return new oj.NumberRangeValidator(options);
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
     * @memberOf oj.NumberRangeValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createNumberRangeValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_NUMBERRANGE,
                                                oj.NumberRangeValidatorFactory);
                                        
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
 * @class
 * @public
 * @since 0.6
 * 
 */
oj.LengthValidatorFactory = (function () 
{
  
  function _createLengthValidator(options) 
  {
    return new oj.LengthValidator(options);
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
     * @memberOf oj.LengthValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createLengthValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_LENGTH,
                                                oj.LengthValidatorFactory);
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*
   DESCRIPTION
   OraI18nUtils provides helper functions for converter objects.

   PRIVATE CLASSES
    <list of private classes defined - with one-line descriptions>

   NOTES
    <other useful comments, qualifications, etc.>

 */

/**
 * @ignore
 */
var OraI18nUtils = {};
//supported numbering systems
OraI18nUtils.numeringSystems = {
  'latn' : "\u0030\u0031\u0032\u0033\u0034\u0035\u0036\u0037\u0038\u0039",
  'arab' : "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669",
  'thai' : "\u0e50\u0e51\u0e52\u0e53\u0e54\u0e55\u0e56\u0e57\u0e58\u0e59"
};
   
OraI18nUtils.BCP47RE = /^(?:(en-GB-oed|i-(?:ami|bnn|default|enochian|hak|klingon|lux|mingo|navajo|pwn|tao|tay|tsu)|sgn-(?:BE-FR|BE-NL|CH-DE))|(art-lojban|cel-gaulish|no-(?:bok|nyn)|zh-(?:guoyu|hakka|min|min-nan|xiang)))$|^(x(?:-[0-9a-z]{1,8})+)$|^(?:((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|[0-9]{3}))?((?:-(?:[a-z0-9]{5,8}|[0-9][a-z0-9]{3}))*)?((?:-[0-9a-wy-z](?:-[a-z0-9]{2,8}){1,})*)?(-x(?:-[0-9a-z]{1,8})+)?)$/i;
OraI18nUtils.regexTrim = /^\s+|\s+$|\u200f|\u200e/g;
OraI18nUtils.regexTrimNumber = /\s+|\u200f|\u200e/g;
OraI18nUtils.zeros = [ "0", "00", "000" ];
OraI18nUtils._ISO_DATE_REGEXP = /^\d{4}(?:-\d{2}(?:-\d{2})?)?(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?)?$|^T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?$/;      

/*
 * Will return timezone if it exists.
 */
OraI18nUtils._getTimeZone = function(isoString)
{
  if(!isoString || typeof isoString !== "string") 
  {
    return null;
  }
  var match = OraI18nUtils._ISO_DATE_REGEXP.exec(isoString);
  //make sure it is iso string
  if(match === null)
  {
    OraI18nUtils._throwInvalidISOString(isoString);
  }
  if (match[1] !== undefined)
    return match[1];
  return null;
};

/*
 * Will return local isoString provided a date.
 */
OraI18nUtils.dateToLocalIso = function(date) 
{
  return OraI18nUtils.padZeros(date.getFullYear(), 4) + "-" + OraI18nUtils.padZeros((date.getMonth() + 1), 2) + "-" + OraI18nUtils.padZeros(date.getDate(), 2) + "T" +
  OraI18nUtils.padZeros((date.getHours()), 2) + ":" + OraI18nUtils.padZeros((date.getMinutes()), 2) +  ":" +
  OraI18nUtils.padZeros((date.getSeconds()), 2) + "." + OraI18nUtils.padZeros((date.getMilliseconds()), 3);
};

OraI18nUtils.isoToLocalDate = function(isoString) 
{
  if(!isoString || typeof isoString !== "string") 
  {
    return null;
  }
  if(OraI18nUtils._getTimeZone(isoString) !== null) 
  {
    OraI18nUtils._throwTimeZoneNotSupported();
  }
  return this._isoToLocalDateIgnoreTimezone(isoString);
};

OraI18nUtils._isoToLocalDateIgnoreTimezone = function(isoString) {
  var splitted = isoString.split("T"),
  tIndex = isoString.indexOf("T"),
  today = new Date(), i,
  datetime = [today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0];

  if(splitted[0] !== "") 
  {
    //contains date portion
    var dateSplitted = splitted[0].split("-");
    for(i=0; i < dateSplitted.length; i++) {
      datetime[i] = parseInt(dateSplitted[i], 10);
      if(i === 1)
        datetime[i]--;//since is 0 based for months
    }
  }

  if(tIndex !== -1) {
    var milliSecSplitted = splitted[1].split("."),  //contain millseconds
    timeSplitted = milliSecSplitted[0].split(":"); //contain hours, minutes, seconds

    for(i=0; i < timeSplitted.length; i++) 
    {
      datetime[3+i] = parseInt(timeSplitted[i], 10);
    }

    if(milliSecSplitted.length === 2 && milliSecSplitted[1]) 
    {
      datetime[6] = parseInt(milliSecSplitted[1], 10);
    }
  }
  return new Date(datetime[0], datetime[1], datetime[2], datetime[3], datetime[4], datetime[5], datetime[6]);
};

OraI18nUtils._throwTimeZoneNotSupported = function() {
  var msg, error, errorInfo;
  msg =  "time zone is not supported"; 
  error = new Error(msg);
  errorInfo = {
    'errorCode' : 'timeZoneNotSupported'
  };
  error['errorInfo'] = errorInfo;
  throw error;
};

OraI18nUtils._throwInvalidISOString = function(str) {
  var msg, error, errorInfo;
  msg =  "The string " + str + " is not a valid ISO 8601 string."; 
  error = new Error(msg);
  errorInfo = {
    'errorCode' : 'invalidISOString',
    'parameterMap' : {
      'isoStr' : str
    }
  };
  error['errorInfo'] = errorInfo;
  throw error;
};

OraI18nUtils.trim = function(value) {
  return (value + "").replace(OraI18nUtils.regexTrim, "");
};

OraI18nUtils.trimNumber = function(value) {
  var s = (value + "").replace(OraI18nUtils.regexTrimNumber, "");
  return s;
};
    
OraI18nUtils.startsWith = function(value, pattern) {
  return value.indexOf(pattern) === 0;
};
    
OraI18nUtils.toUpper = function(value) {
  // "he-IL" has non-breaking space in weekday names.
  return value.split("\u00A0").join(" ").toUpperCase();
};

OraI18nUtils.padZeros = function(num, c) {
  var r, s = num + "";
  if (c > 1 && s.length < c) {
    r = (OraI18nUtils.zeros[c - 2] + s);
    return r.substr(r.length - c, c);
  }
  else {
    r = s;
  }
  return r;
};

//get the numbering system key from the locale's unicode extension.
//Verify that the locale data has a numbers entry for it, if not return latn as default.
OraI18nUtils.getNumberingSystemKey = function(localeElements, locale){
  if(locale === undefined)
    return 'latn';
  var numberingSystemKey = OraI18nUtils.getLanguageExtension(locale, "nu") || "";
  var symbols = "symbols-numberSystem-" + numberingSystemKey;
  if(localeElements['numbers'][symbols] === undefined)
    numberingSystemKey =  'latn';
  return numberingSystemKey;
};
  
//parse a bcp47 language and extracts the tokens such as language, region, variant.
OraI18nUtils.parseBCP47 = function (tag){
  var match = OraI18nUtils.BCP47RE.exec (tag);
  if (!match) return null;
	
  var match4 = match[4];
  match4 = match4 ? match4.split ("-") : null;
  var language = null;
  if (match4) language = match4.shift ();
	
  var match7 = match[7];
  match7 = match7 ? match7.split ("-") : null;
  if (match7) match7.shift ();
	
  var match9 = match[9];
  match9 = match9 ? match9.split ("-") : null;
  if (match9){
    match9.shift ();
    match9.shift ();
  }
	
  var match3 = match[3];
  match3 = match3 ? match3.split ("-") : null;
  if (match3) match3.shift ();
  return {
    language: {
      language: language,
      extlang: match4 || []
    },
    script: match[5] || null,
    'region': match[6] || null,
    variant: match7 || null,
    extension: OraI18nUtils.parseExtension (match[8]),
    privateuse: match9 || match3 || [],
    grandfathered: {
      irregular: match[1] || null,
      regular: match[2] || null
    }
  };
};

//parse the extensions in the language tag
OraI18nUtils.parseExtension = function (tag){
      
  if (!tag) return [];

  var extensions = [];
  var e;
  var c;
  var newExtension = false;
  var singleton = false;
  var extension = "";
  var parsingExtension = false;
	
  for (var i=0, len=tag.length; i<len; i++){
    c = tag[i];
		
    if (c === "-" && !newExtension){
      newExtension = true;
      e = {
        'singleton': null,
        'extension': []
      };
      continue;
    }
		
    if (newExtension && !singleton){
      singleton = true;
      e['singleton'] = c;
      continue;
    }
		
    if (c === "-"){
      if (!parsingExtension){
        extension = "";
        parsingExtension = true;
      }else{
        if (extension.length === 1){
          parsingExtension = false;
          singleton = false;
          extensions.push (e);
          e = {
            'singleton': null,
            'extension': []
          };
        }
        else{
          e['extension'].push (extension);
          extension = "";
        }
      }
      continue;
    }
		
    extension += c;
  }
	
  e['extension'].push (extension);
  extensions.push (e);
	
  return extensions;
}; 
    
//get the unicode extension from a bcp47 locale given a token.
// for example, token can be "nu" for numbering system, "ca" for calendar.
OraI18nUtils.getLanguageExtension = function(locale, token){
  locale = locale || "en-US";
  var parsedLang = OraI18nUtils.parseBCP47(locale);
  if(parsedLang === null || parsedLang === undefined)
    return null;
  var ext = parsedLang['extension'];
  var localeExtension;
  for(var i in ext) {
    if(ext[i]['singleton'] === 'u') {
      for(var j in ext[i]['extension']) {
        if(ext[i]['extension'][j] === token) {
          j++;
          localeExtension = ext[i]['extension'][j];
          break;
        }
      }
      break;
    }
  }
  return localeExtension;    
};

OraI18nUtils.haveSamePropertiesLength = function(obj) {
  var count = 0;
  for (var n in obj)
  {
    count++;
  }
  return count;
};

//cldr locale data start with "main" node.
//return the subnode under main.
OraI18nUtils.getLocaleElementsMainNode = function(bundle) {
  var mainNode = bundle['main'];
  var subnode;
  for (var n in mainNode)
  {
    subnode = n;
    break;
  }
  return mainNode[subnode];
};
     
//get the locale which is a subnode of "main".
OraI18nUtils.getLocaleElementsMainNodeKey= function(bundle) {
  var mainNode = bundle['main'];
  var subnode;
  for (var n in mainNode)
  {
    subnode = n;
    break;
  }
  return subnode;
};
  
//Return a function getOption.
//The getOption function extracts the value of the property named 
//property from the provided options object, converts it to the required type,
// checks whether it is one of a List of allowed values, and fills in a 
// fallback value if necessary.
OraI18nUtils.getGetOption = function(options, getOptionCaller) {
  if (options === undefined) {
    throw new Error('Internal ' + getOptionCaller +
      ' error. Default options missing.');
  }

  var getOption = function getOption(property, type, values, defaultValue) {
    if (options[property] !== undefined) {
      var value = options[property];
      switch (type) {
        case 'boolean':
          value = Boolean(value);
          break;
        case 'string':
          value = String(value);
          break;
        case 'number':
          value = Number(value);
          break;
        default:
          throw new Error('Internal error. Wrong value type.');
      }
      if (values !== undefined && values.indexOf(value) === -1) {
        var expectedValues = [];
        for(var i=0; i < values.length; i++) {
          expectedValues.push(values[i]);
        }
        var msg = "The value '" + options[property] +
        "' is out of range for '" + getOptionCaller +
        "' options property '" + property + "'. Valid values: " + 
        expectedValues; 
        var rangeError = new RangeError(msg);
        var errorInfo = {
          'errorCode' : 'optionOutOfRange',
          'parameterMap' : {
            'propertyName': property,
            'propertyValue': options[property],
            'propertyValueValid': expectedValues,
            'caller': getOptionCaller
          }
        };
        rangeError['errorInfo'] = errorInfo;
        throw rangeError;
      }

      return value;
    }
    return defaultValue;
  }

  return getOption;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*global OraDateTimeConverter:true*/
/**
 * @export
 * Placeholder here as closure compiler objects to export annotation outside of top level
 */

/**
 * @constructor
 * 
 * @classdesc Constructs an immutable instance and initializes it with the options provided. 
 * <p>
 *  The converter instance uses locale symbols for the locale set on the page (returned by 
 *  {@li.nk oj.Config#getLocale}. Please note that timezone is currently not supported by the 
 *  converter.
 *  </p>
 * There are several ways to initialize the converter.
 * <ul>
 * <li>Using options defined by the ECMA 402 Specification, these would be the properties year, 
 * month, day, hour, minute, second, weekday, era, timeZoneName, hour12</li>
 * <li>Using a custom date and/or time format pattern using the 'pattern' property</li>
 * <li>Using the standard date, datetime and time format lengths defined by Unicode CLDR, these 
 * would include the properties formaType, dateFormat, timeFormat.</li>
 * </ul>
 * 
 * <p>
 * The options when specified take precendence in the following order:<br>
 * 1. pattern.<br>
 * 2. ECMA options.<br>
 * 3. formatType/dateFormat/timeFormat.
 * <p>
 * The converter provides great leniency when parsing a user input value to a date in the following 
 * ways: <br/>
 * <ul>
 * <li>Allows use of any character for separators irrespective of the separator specified in the 
 * associated pattern. E.g., if pattern is set to 'y-M-d', the following values are all valid - 
 * 2013-11-16, 2013/11-16 and 2013aaa11xxx16.</li>
 * <li>Allows specifying 4 digit year in any position in relation to day and month. E.g., 11-2013-16 
 * or 16-11-2013</li>
 * <li>Supports auto-correction of value, when month and day positions are swapped as long as the 
 * date is > 12 when working with the Gregorian calendar. E.g., if the pattern is 'y-M-d', 
 * 2013-16-11 will be auto-corrected to 2013-11-16. However if both date and month are less or equal 
 * to 12, no assumptions are made about the day or month and the value parsed against the exact pattern.</li>
 * <li>Supports auto-correction of value, for the short and long types of weekday and month names. 
 * So they can are used anywhere in the value. E.g., if the expected pattern is E, MMM, d, y, all 
 * these values are acceptable - Tue, Nov 26 2013 or Nov, Tue 2013 26 or 2013 Tue 26 Nov. <br/>
 * NOTE: Lenient parsing of narrow era, weekday or month name is not supported because of ambiguity in 
 * choosing the right value. So we expect for narrow era, weekday or month option that values be 
 * provided either in their short or long forms. E.g., Sat, March 02, 2013.
 * </li>
 * <li>Specifying the weekday is optional. E.g., if the expected pattern is E, MMM, d, y; then 
 * entering Nov 26, 2013, is automatically turned to Tuesday Nov 26, 2013. But entering an invalid 
 * weekday, i.e., if the weekday does not match the date, an exception is thrown.</li>
 * <li>Leniency rules apply equally no matter which option is used - pattern, ECMA options or formatType</li>
 * </ul>
 * 
 * @property {Object=} options - an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @property {string=} options.year - allowed values are "2-digit", "numeric". When no options are 
 * set the default value of "numeric" is used.
 * @property {string=} options.month - specifies how the month is formatted. Allowed values are 
 * "2-digit", "numeric", "narrow", "short", "long". The last 3 values behave in the same way as for 
 * weekday, indicating the length of the string used. When no options are set the default value of 
 * "numeric" is used.
 * @property {string=} options.day - specifies how the day is formatted. Allowed values are "2-digit",
 *  "numeric". When no options are set the default value of "numeric" is used.
 * @property {string=} options.hour - specifies how the hour is formatted. Allowed values are 
 * "2-digit" or "numeric". The hour is displayed using the 12 or 24 hour clock, depending on the 
 * locale. See 'hour12' for details.
 * @property {string=} options.minute - specifies how the minute is formatted. Allowed values are 
 * "2-digit", "numeric".
 * @property {string=} options.second - specifies whether the second should be displayed as "2-digit" 
 * or "numeric".
 * @property {string=} options.weekday - specifies how the day of the week is formatted. If absent, it 
 * is not included in the date formatting. Allowed values are "narrow", "short", "long" indicating the 
 * length of the string used.
 * @property {string=} options.era - specifies how the era is included in the formatted date. If 
 * absent, it is not included in the date formatting. Allowed values are "narrow", "short", "long".
 * @property {string=} options.timeZoneName - allowed values are "short", "long".
 * @property {boolean=} options.hour12 - specifies what time notation is used for formatting the time. 
 * A true value uses the 12-hour clock and false uses the 24-hour clock (often called military time 
 * in the US). This property is undefined if the hour property is not used when formatting the date.
 * 
 * @property {string=} options.pattern - a localized string pattern, where the the characters used in 
 * pattern conform to Unicode CLDR for date time formats. This will override all other options 
 * when present. <br/>
 * NOTE: 'pattern' is provided for backwards compatibility with existing apps that may want the 
 * convenience of specifying an explicit format mask. Setting a 'pattern' will override the default 
 * locale specific format.
 * 
 * @property {string=} options.formatType - determines the 'standard' date and/or time format lengths 
 * to use. Allowed values: "date", "time", "datetime". See 'dateFormat' and 'timeFormat' options. 
 * When set a value must be specified.
 * @property {string=} options.dateFormat - specifies the standard date format length to use when 
 * formatType is set to "date" or "datetime". Allowed values are : "short" (default), "medium", "long", 
 * "full". 
 * @property {string=} options.timeFormat - specifies the standard time format length to use when 
 * 'formatType' is set to "time" or "datetime". Allowed values: "short" (default), "medium", "long", 
 * "full". 
 * 
 * @example <caption>Create a date time converter using no options. This uses the default value for 
 * year, month, day properties</caption>
 * var converterFactory = oj.Validation.converterFactory("datetime");
 * converter = converterFactory.createConverter();
 * var resolved = converter.resolvedOpions();
 * // logs "day=numeric, month=numeric, year=numeric"
 * console.log("day=" + resolved.day + ", month=" + resolved.month + ", year=" + resolved.year);
 * <br/>
 * 
 * @example <caption>Create a date time converter using the ECMA options to represent date</caption>
 * var options = { year:'2-digit', month: '2-digit', day: '2-digit'};
 * var converterFactory = oj.Validation.converterFactory("datetime");
 * converter = converterFactory.createConverter(options);<br/>
 * 
 * @example <caption>Create a date time converter using the 'pattern' option</caption>
 * var options = {pattern: 'MM-dd-yyyy'}; 
 * var converterFactory = oj.Validation.converterFactory("datetime");
 * converter = converterFactory.createConverter(options);<br/>
 * 
 * @example <caption>Create a date time converter using the standard format length</caption>
 * var options = {formatType: 'date', dateFormat: 'medium'}; 
 * var converterFactory = oj.Validation.converterFactory("datetime");
 * converter = converterFactory.createConverter(options);<br/>
 * 
 * @export
 * @augments oj.DateTimeConverter 
 * @name oj.IntlDateTimeConverter
 * @since 0.6
 */
oj.IntlDateTimeConverter = function(options)
{
  this.Init(options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.IntlDateTimeConverter, oj.DateTimeConverter, "oj.IntlDateTimeConverter");
oj.IntlDateTimeConverter._DEFAULT_DATE = new Date(1998, 10, 29, 15, 45, 31);

/**
 * Initializes the date time converter instance with the set options.
 * @param {Object=} options an object literal used to provide an optional information to initialize 
 * the converter.<p>
 * 
 * @export
 */
oj.IntlDateTimeConverter.prototype.Init = function(options) 
{
  oj.IntlDateTimeConverter.superclass.Init.call(this, options);
};


// Returns the wrapped date time converter implementation object.
oj.IntlDateTimeConverter.prototype._getWrapped = function ()
{
  if (!this._wrapped)
  {
    this._wrapped = OraDateTimeConverter.getInstance();
  }
  
  return this._wrapped;
};

/**
 * Formats the local isoString value using the options provided and returns a string value. 
 * <p>
 * Note: Application code that was previosuly passinga JavaScript Date object to this method, can 
 * now use the utility function oj.IntlConverterUtils.dateToLocalIso(), to get the proper isoString 
 * value.
 * 
 * @param {string} value to be formatted for display which should be a local isoString
 * @return {string|Object} the localized and formatted value suitable for display
 * 
 * @throws {Error} a ConverterError both when formatting fails, and if the options provided during 
 * initialization cannot be resolved correctly. Also if the iso string value contains time zone 
 * information, like the UTC designator (Z) or timezone offsets, an error is thrown.
 * 
 * @example <caption>To convert Javascript Date to an iso string before passing to <code class="prettyprint">format</code></caption>
 * var date = new Date();
 * var formatted = converter.format(oj.IntlConverterUtils.dateToLocalIso(date));
 * 
 * @see oj.IntlConverterUtils.dateToLocalIso
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.format = function (value) 
{
  var localeElements = oj.LocaleData.__getBundle(), locale = oj.Config.getLocale(), 
          resolvedOptions = this.resolvedOptions(), converterError;
  
  // undefined, null and empty string values all return null. If value is NaN then return "".
  // TODO: Should we automatically parse() the integer value representing the number of milliseconds 
  // since 1 January 1970 00:00:00 UTC (Unix Epoch)?
  if (value == null || 
      (typeof value === "string" && (oj.StringUtils.trim("" + value)).length === 0)) 
  {
    return oj.IntlConverterUtils.__getNullFormattedValue();
  }
  
  try
  {
    return this._getWrapped().format(value, localeElements, resolvedOptions, locale);
  }
  catch (e)
  {
    converterError = this._processConverterError(e, value);
    throw converterError;
  }
};


/**
 * Formats an ISOString as a relative date, using the relativeOptions. 
 * <p>
 * Note: Application code that was previosuly passing a JavaScript Date object to this method can 
 * now use the utility function oj.IntlConverterUtils.dateToLocalIso to get the proper isoString 
 * value.
 * 
 * @param {string} value - value to be formatted. This value is compared with the current date 
 * on the client to arrive at the relative formatted value.
 * @param {Object} relativeOptions - an Object literal containing the following properties. The 
 * default options are ignored during relative formatting - <br>
 * <ul>
 * <li><b>formatUsing</b>: Specifies the relative formatting convention to use for (calendar or) 
 * the date field type. allowed values: "displayName". <br>Setting value to 'displayName' uses the 
 * relative display name for the instance of the dateField, and one or two past and future instances.
 * </li>
 * <li><b>dateField</b>: allowed values are: "day", "week", "month", "year"</li>
 * </ul>
 * @return {string|null} relative date. null if the value falls out side the supported relative range.
 * @throws {Object} an instance of {@link oj.ConverterError}
 * 
 * @example <caption>To convert Javascript Date to an iso string before passing to <code class="prettyprint">formatRelative</code></caption>
 * var formatted = converter.formatRelative(oj.IntlConverterUtils.dateToLocalIso(new Date()));
 * 
 * @see oj.IntlConverterUtils.dateToLocalIso
 * 
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.formatRelative = function(value, relativeOptions) 
{
  var localeElements = oj.LocaleData.__getBundle(), locale = oj.Config.getLocale(), converterError;
  try
  {
    return this._getWrapped().formatRelative(value, localeElements, relativeOptions, locale);
  }
  catch (e)
  {
    converterError = this._processConverterError(e, value);
    throw converterError;
  }
};

/**
 * Retrieves a hint String describing the format the value is expected to be in. THe pattern used is 
 * provided through resolvedOptions, except when an actual pattern is set in the options. Otherwise 
 * hint is empty.
 * 
 * @return {String} a hint describing the format the value is expected to be in.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.getHint = function ()
{
  var resolvedOptions = this.resolvedOptions(), patternFromOptions = 
          resolvedOptions["patternFromOptions"] || this.getOptions()['pattern'];
  
  // TODO: converter hints are often shown in placeholder and is a user-friendly readable pattern. 
  // Until this feature is implemented use the CLDR pattern converted to lowercase
  return patternFromOptions ? patternFromOptions.toLowerCase() : "";
};

// Returns the hint value.
oj.IntlDateTimeConverter.prototype._getHintValue = function()
{
  var value = "";
  try
  {
    // example date 
    value =  this.format(oj.IntlConverterUtils.dateToLocalIso(oj.IntlDateTimeConverter._DEFAULT_DATE));
  }
  catch (e)
  {
    if (e instanceof oj.ConverterError)
    {
      // Something went wrong and we don't have a way to retrieve a valid value.
      // TODO: Log an error
      value = "";
    }
  }
  finally
  {
    return value;
  }
};


/**
 * Returns the options called with converter initialization.
 * @return {Object} an object of options.
 * @export
 * @memberOf oj.IntlDateTimeConverter
 * 
 */
oj.IntlDateTimeConverter.prototype.getOptions = function () 
{
  return oj.IntlDateTimeConverter.superclass.getOptions.call(this);
};

/**
 * Returns an object literal with locale and formatting options computed during initialization of 
 * the object. If options was not provided at the time of initialization, the properties will be 
 * derived from the locale defaults.
 * @return {Object} an object of resolved options. Properties whose corresponding internal 
 * properties are not present are not assigned. More properties may be included as needed.
 * <ul>
 * <li><b>locale</b> - a String value with the language tag of the locale whose localization is used 
 * for formatting.</li>
 * <li><b>numberingSystem</b>: a String value of the numbering system used. E.g. latn</li>
 * <li><b>era</b>: a String value. One of allowed values - "narrow", "short", "long"</li>
 * <li><b>year</b>: a String value. One of allowed values - "2-digit", "numeric"</li>
 * <li><b>month</b>: a String value. One of allowed values - "2-digit", "numeric", "narrow", "short"
 * , "long"</li>
 * <li><b>weekday</b>: a String value. One of the allowed values - "narrow", "short", "long"</li>
 * <li><b>day</b>: a String value. One of allowed values - "2-digit", "numeric"</li>
 * <li><b>hour</b>: String value. One of allowed values - "2-digit", "numeric"</li>
 * <li><b>minute</b>: a String value. One of allowed values - "2-digit", "numeric"</li>
 * <li><b>second</b>: a String value. One of allowed values - "2-digit", "numeric"</li>
 * <li><b>hour12</b>: a Boolean value indicating whether 12-hour format (true) or 24-hour format 
 * (false) should be used. It is only relevant when hour is also present.</li>
 * <li><b>timeZoneName</b>: String value. One of allowed values - "short", "long".</li>
 * </ul>
 * 
 * @throws a oj.ConverterError when the options that the converter was initialized with are invalid. 
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.resolvedOptions = function ()
{
  var localeElements, locale = oj.Config.getLocale(), converterError, options = this.getOptions();
  // options are resolved and cached for a locale
  if ((locale !== this._locale) || !this._resolvedOptions)
  {
    localeElements = oj.LocaleData.__getBundle();
    try
    {
      if (!localeElements)
      {
        oj.Logger.error("locale bundle for the current locale %s is unavailable", locale);
        return {};
      }
      // cache if successfully resolved
      this._resolvedOptions = this._getWrapped().resolvedOptions(localeElements, 
                                                                 options, 
                                                                 locale);
      this._locale = locale;
    }
    catch (e)
    {
      converterError = this._processConverterError(e);
      throw converterError;
    }
  }
  
  return this._resolvedOptions;
};

/**
 * Returns true if a 24-hour format is set; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isHourInDaySet = function()
{
  var ro = this.resolvedOptions(), hour = ro['hour'], hour12 = ro['hour12'];
  if (hour && !hour12)
  {
    // if hour12=false or not set and hour is set to some value
    return true;
  }
  
  return false;
};

/**
 * Returns true if 12-hour is set; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isHourInAMPMSet = function()
{
  var ro = this.resolvedOptions(), hour = ro['hour'], hour12 = ro['hour12'];  
  if (hour && hour12)
  {
    // if hour12==true and hour is set to some value
    return true;
  }
  
  return false;
  
};

/**
 * Returns true if minutes are shown in the time portion; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isMinuteSet = function()
{
  return this._isOptionSet('minute');
};

/**
 * Returns true if seconds are shown in the time portion; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isSecondSet = function()
{
  return this._isOptionSet('second');
};

/**
 * Returns true if milliseconds are shown in the time portion; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isMilliSecondSet = function()
{
  return this._isOptionSet('millisecond');
};

/**
 * Returns true if year is shown in the date portion; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isYearSet = function()
{
  return this._isOptionSet('year');
};

/**
 * Returns true if month is shown in the date portion; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isMonthSet = function()
{
  return this._isOptionSet('month');
};

/**
 * Returns true if day is shown in the date portion; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isDaySet = function()
{
  return this._isOptionSet('day');
};

/**
 * Returns true if the day name is shown in the date portion; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isDayNameSet = function()
{
  return this._isOptionSet('weekday');
};

/**
 * Returns the calculated week for the isoString value
 * 
 * @param {string} value to return the calculated week of
 * @return {number} calculated week.
 * 
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.calculateWeek = function(value)
{
  return this._getWrapped().calculateWeek(value, oj.LocaleData.__getBundle(), oj.Config.getLocale());
};

/**
 * Parses the value using the options provided and returns the local date and time as a string 
 * expressed using the ISO-8601 format (http://en.wikipedia.org/wiki/ISO_8601).
 * 
 * <p>
 * For converter options specific to a date, the iso date representation alone is returned. <br/>
 * For time only options, the iso local time representation alone is returned. <br/>
 * For options that include both date and time, the iso date and local time representation is 
 * returned.<br/>
 * </p>
 * 
 * <p>
 * For convenience, if one wishes to retrieve a JavaScript Date object from the local isoString, a 
 * utility function oj.IntlConverterUtils.isoToLocalDate is provided.
 * </p>
 * 
 * @param {String|string} value to parse
 * @return {string|Object} the parsed value as an ISOString.
 * 
 * @throws {Error} a ConverterError both when parsing fails, and if the options provided during 
 * initialization cannot be resolved correctly. Parsing can also fail when the value includes a time
 *  zone. 
 * 
 * @example <caption>Parse date, time and date & time values using <code class="prettyprint">parse</code> method.</caption>
 * &lt;!-- For date-time values  -->
 * var options = {pattern: 'MM/dd/yy hh:mm:ss a'};
 * var conv = oj.Validation.converterFactory('datetime').createConverter(options);
 * cnv.parse('09/11/14 03:02:01 PM'); // '2014-10-20T15:02:01'
 * 
 * &lt;!-- For date values -->
 * var options = {pattern: 'MM/dd/yy'};
 * cnv.parse('09/11/14'); // '2014-10-20'
 * 
 * &lt;!-- For time values -->
 * var options = {pattern: 'hh:mm:ss a'};
 * cnv.parse('03:02:01 PM'); // 'T15:02:01'
 * 
 * @example <caption>Convert from iso string to Javascript Date object</caption>
 * var isoString = '2014-10-20T15:02:01';
 * var date = oj.IntlConverterUtils.isoToLocalDate(converter.parse(isoString));
 * 
 * @see oj.IntlConverterUtils.isoToLocalDate
 *  
 * @export
 */
oj.IntlDateTimeConverter.prototype.parse = function (value) 
{
  var result, parsed;
  // undefined, null and empty string values are ignored and not parsed. 
  if (value == null || value === "") 
  {
    return null;
  }
  
  var localeElements = oj.LocaleData.__getBundle(), locale = oj.Config.getLocale(), 
          resolvedOptions = this.resolvedOptions(), converterError;

  try
  {
    // date converter parses the value and returns an Object with 2 fields - 'value' and 'warning'
    result = this._getWrapped().parse(value, localeElements, resolvedOptions, locale); 
    parsed = result['value'];
    if (parsed)
    {
      // TODO: For now log a warning when we leniently parse a value; later we plan to flash the 
      // field.
      if (result['warning'])
      {
        oj.Logger.warn("The value " + value + " was leniently parsed to represent a date " + 
                (parsed.toString) ? parsed.toString() : parsed);
      }
      
    }
    return parsed;
  }
  catch (e)
  {
    converterError = this._processConverterError(e, value);
    throw converterError;
  }
};

/**
 * Processes the error returned by the converter implementation and throws a oj.ConverterError 
 * instance.
 * @param {Error} e
 * @param {String|string|Date|Object=} value 
 * @throws an instance of oj.ConverterError
 * @private
 */
oj.IntlDateTimeConverter.prototype._processConverterError = function (e, value)
{
  var errorInfo = e['errorInfo'], summary, detail, errorCode, parameterMap, converterError, 
          propName, resourceKey;
  if (errorInfo)
  {
    errorCode = errorInfo['errorCode'];
    parameterMap = errorInfo['parameterMap'];
    oj.Assert.assertObject(parameterMap);
    propName = parameterMap['propertyName'];
    
    if (e instanceof TypeError)
    {
      if (errorCode === "optionTypesMismatch" || errorCode === "optionTypeInvalid")
      {
        converterError = oj.IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
      }
    }
    else if (e instanceof RangeError)
    {
      if (errorCode === "optionOutOfRange")
      {
        converterError = oj.IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
      }
      else if (errorCode === 'datetimeOutOfRange') // TODO: NLS should use lower case time
      {
        // The '{value}' is out of range. Enter a value between '{minValue}' and '{maxValue}' for 
        // '{propertyName}'.
        summary = oj.Translations.getTranslatedString("oj-converter.datetime.datetimeOutOfRange.summary", 
          {'propertyName': propName,
           'value': parameterMap['value']});
        detail = oj.Translations.getTranslatedString("oj-converter.datetime.datetimeOutOfRange.detail",
          {'minValue': parameterMap['minValue'],
           'maxValue': parameterMap['maxValue']});
         
        converterError = new oj.ConverterError(summary, detail);
      }
    }
    else if (e instanceof SyntaxError)
    {
      if (errorCode === "optionValueInvalid")
      {
        converterError = oj.IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
      }
    }
    else if (e instanceof Error)
    {
      if (errorCode === "dateFormatMismatch")
      {
        // The '{value}' does not match the expected date format '{format}'.
        resourceKey = "oj-converter.datetime.dateFormatMismatch.summary";
      }
      else if (errorCode === "timeFormatMismatch")
      {
        // The {value} does not match the expected time format {format}.
        resourceKey = "oj-converter.datetime.timeFormatMismatch.summary";
      }
      else if (errorCode === "datetimeFormatMismatch")
      {
        resourceKey = "oj-converter.datetime.datetimeFormatMismatch.summary";
      }
      else if (errorCode === "dateToWeekdayMismatch")
      {
        summary = oj.Translations.getTranslatedString("oj-converter.datetime.dateToWeekdayMismatch.summary", 
          {'date': parameterMap['date'], 'weekday': parameterMap['weekday']});
        detail = oj.Translations.getTranslatedString("oj-converter.datetime.dateToWeekdayMismatch.detail");
        converterError = new oj.ConverterError(summary, detail);
      }
      
      if (resourceKey)
      {
        summary = oj.Translations.getTranslatedString(resourceKey, 
          {'value': value || parameterMap['value'],
           'format': parameterMap['format']});
        
        detail = oj.Translations.getTranslatedString("oj-converter.hint.detail",
          {'exampleValue': this._getHintValue()}); 
          
        converterError = new oj.ConverterError(summary, detail);
      }
    }
  }
  
  if (!converterError)
  {
    // An error we are unfamiliar with. Get the message and set as detail
    summary = e.message; // TODO: What should the summary be when it's missing??
    detail = e.message;
    converterError = new oj.ConverterError(summary, detail);
  }
  
  return converterError;
};

/**
 * Checks to see if an option is present in the resolved options.
 * @param {string} optionName
 * @returns {boolean} true if optionName is present.
 * @private
 */
oj.IntlDateTimeConverter.prototype._isOptionSet = function (optionName)
{
  var ro = this.resolvedOptions(), hasOption = ro[optionName] ? true : false;
  return hasOption;
};

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Constructs a NumberRangeValidator that ensures the value provided is within a given range
 * @param {Object=} options an object literal used to provide the following properties
 * @param {number=} options.min - the minimum number value of the entered value.
 * @param {number=} options.max - the maximum number value of the entered value.
 * @param {Object=} options.hint - an optional object literal of hints to be used. 
 * @param {string=} options.hint.max - a hint used to indicate the allowed maximum. When not present, 
 * the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.hint.max</code>.<p>
 * Tokens: <br/>
 * {max} - the maximum<p>
 * Usage: <br/>
 * Enter a number less than or equal to {max}
 * @param {string=} options.hint.min - a hint used to indicate the allowed minimum. When not present, 
 * the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.hint.min</code>.<p>
 * Tokens: <br/>
 * {min} the minimum <p>
 * Usage: <br/>
 * Enter a number greater than or equal to {min}</li>
 * @param {string=} options.hint.inRange - a hint used to indicate the allowed range. When not 
 * present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.hint.inRange</code>.<p>
 * Tokens:<br/>
 * {min} the minimum<br/>
 * {max} the maximum<p>
 * Usage: <br/>
 * Enter a number between {min} and {max}
 * @param {Object=} options.messageDetail - an optional object literal of custom error messages to 
 * be used.
 * @param {string=} options.messageDetail.rangeUnderflow - the detail error message to be used when 
 * input value is less than the set minimum value. When not present, the default detail message is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.messageDetail.rangeUnderflow</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {min} - the minimum allowed value<p>
 * Usage: <br/>
 * The number {value} must be greater than or equal to {min}.
 * @param {string=} options.messageDetail.rangeOverflow - the detail error message to be used when 
 * input value exceeds the maximum value set. When not present, the default detail message is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.messageDetail.rangeOverflow</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {max} - the maximum allowed value<p>
 * Usage: <br/>
 * The number {value} must be less than or equal to {max}.     
 * @param {Object=} options.messageSummary - optional object literal of custom error summary message 
 * to be used. 
 * @param {string=} options.messageSummary.rangeUnderflow - the summary of the error message when 
 * input value is less than the set minimum value. When not present, the default message summary is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.messageSummary.rangeUnderflow</code>.
 * @param {string=} options.messageSummary.rangeOverflow - the summary of the error message when 
 * input value exceeds the maximum value set.  When not present, the default message summary is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.messageSummary.rangeOverflow</code>.
 * @export
 * @constructor
 * @since 0.7
 * 
 */
// TODO: Probably get rid of the 'message' level, and just have 'hint', 'messageDetail', 'messageSummary'. This matches what I put in oj-translations.
oj.NumberRangeValidator = function _NumberRangeValidator(options)
{
  this.Init(options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.NumberRangeValidator, oj.Validator, "oj.NumberRangeValidator");

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @memberof oj.NumberRangeValidator
 * @instance
 * @export
 */
oj.NumberRangeValidator.prototype.Init = function (options)
{
  oj.NumberRangeValidator.superclass.Init.call(this);

  
  if (options)
  {
    this._min = options["min"];
    this._max = options["max"];
    this._converter = oj.IntlConverterUtils.getConverterInstance(options['converter']);
    this._hint = options['hint'] || {};
    this._customMessageSummary = options['messageSummary'] || {};
    this._customMessageDetail = options['messageDetail'] || {};
  }
};

/**
 * Validates the minimum + maximum conditions
 *
 * @param {string|number} value that is being validated
 * @returns {string} original if validation was successful
 *
 * @throws {Error} when value is out of range
 * @memberof oj.NumberRangeValidator
 * @instance
 * @export
 */
oj.NumberRangeValidator.prototype.validate = function (value)
{
  var string = value ? value.toString() : value, 
      numberValue = parseFloat(string), 
      customMessageSummary = this._customMessageSummary,
      customMessageDetail = this._customMessageDetail,
      messageDetailRangeOverflow = customMessageDetail["rangeOverflow"], 
      messageDetailRangeUnderflow = customMessageDetail["rangeUnderflow"], 
      messageSummaryRangeOverflow = customMessageSummary["rangeOverflow"],
      messageSummaryRangeUnderflow = customMessageSummary["rangeUnderflow"],
      min = this._min !== undefined ? parseFloat(this._min) : null, 
      max = this._max !== undefined ? parseFloat(this._max) : null, 
      minStr = min && this._converter ? this._converter['format'](min) : min,
      maxStr = max && this._converter ? this._converter['format'](max) : max,
      summary = "", 
      detail = "", 
      params = null,
      translations = oj.Translations;
  
  if(value === null) 
  {
    // request to not throw an error when value being passed is of null
    return value;
  }
  
  if (min !== null && max !== null)
  {
    //range
    if ((numberValue >= min && numberValue <= max) || min > max)
    {
      return string;
    }
  }
  else 
  {
    //only min
    if (min !== null)
    {
      if (numberValue >= min)
      {
        return string;
      }
	  
    }
    //max only
    else 
    {
      if (max === null || numberValue <= max)
      {
        return string;
      }
    }
  }
  
  // if we haven't returned with an OK, then we need to throw a ValidatorError
  if (max !== null && numberValue > max)
  {
	  params = {"value": value, "max": maxStr};
      summary = messageSummaryRangeOverflow ? messageSummaryRangeOverflow : 
                  translations.getTranslatedString('oj-validator.range.number.messageSummary.rangeOverflow');
      detail = messageDetailRangeOverflow ? translations.applyParameters(messageDetailRangeOverflow, params) : 
                  translations.getTranslatedString('oj-validator.range.number.messageDetail.rangeOverflow', params);
  }
  else if (min !== null && numberValue < min)
  {
 	  params = {"value": value, "min": minStr};
      summary = messageSummaryRangeUnderflow ? messageSummaryRangeUnderflow : 
                  translations.getTranslatedString('oj-validator.range.number.messageSummary.rangeUnderflow');
      detail = messageDetailRangeUnderflow ? translations.applyParameters(messageDetailRangeUnderflow, params) : 
                  translations.getTranslatedString('oj-validator.range.number.messageDetail.rangeUnderflow', params);   
  }

  throw new oj.ValidatorError(summary, detail);
};

/**
 * @returns {String|null} a hint message or null if no hint is available in the options
 * @memberof oj.NumberRangeValidator
 * @instance
 * @export
 */
oj.NumberRangeValidator.prototype.getHint = function ()
{
  var hint = null, hints = this._hint, 
      hintInRange = hints["inRange"], hintMinimum = hints["min"], hintMaximum = hints["max"],
      translations = oj.Translations,
      min = this._min !== undefined ? parseFloat(this._min) : null, 
      max = this._max !== undefined ? parseFloat(this._max) : null,
      minStr = min && this._converter ? this._converter['format'](min) : min,
      maxStr = max && this._converter ? this._converter['format'](max) : max;
	  
  if (min !== null && max !== null) 
  {
  	hint = hintInRange ? translations.applyParameters(hintInRange, {"min": minStr, "max": maxStr}) : 
	                       translations.getTranslatedString('oj-validator.range.number.hint.inRange', {"min": minStr, "max": maxStr});
  }
  else if (min !== null)
  {
    hint = hintMinimum ?  translations.applyParameters(hintMinimum, {"min": minStr}) :
	                      translations.getTranslatedString('oj-validator.range.number.hint.min', {"min": minStr});
  }
  else if (max !== null)
  {
    hint = hintMaximum ?  translations.applyParameters(hintMaximum, {"max": maxStr}) :
                          translations.getTranslatedString('oj-validator.range.number.hint.max', {"max": maxStr});
  }

  return hint;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*global OraNumberConverter:true*/
/**
 * @export
 * Placeholder here as closure compiler objects to export annotation outside of top level
 */

/**
 * @constructor
 * @classdesc Constructs an immutable instance and initializes it with the options provided. When initialized 
 * with no options, the default options for the current locale are assumed. The converters by 
 * default use the current page locale (returned by oj.Config.getLocale()). There are several ways 
 * to initialize the converter.
 * <p>
 * <ul>
 * <li>Using options defined by the ECMA 402 Specification, these would be the properties style, 
 * currency, currencyDisplay, minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, 
 * useGrouping. NOTE: minimumSignificantDigits and maximumSignificantDigits are not supported.</li>
 * <li>Using a custom decimal, currency or percent format pattern. specified using the 'pattern' property</li>
 * <li>Using the decimalFormat option to define a compact pattern, such as "1M" and "1 million".</li>
 * </ul>
 * <p>
 * 
 * The converter provides leniency when parsing user input value to a number in the following ways:<br/>
 * 
 * <ul>
 * <li>Prefix and suffix that do not match the pattern, are removed. E.g., when pattern is 
 * "#,##0.00%" (suffix is the % character), a value of "abc-123.45xyz", will be leniently parsed to 
 * -123.45</li>
 * <li>When a value includes a symbol but the pattern doesn't require it.  E.g., the options are 
 * {pattern: "###", currency: 'USD'}, then values ($123), (123) and -123 will be leniently parsed as 
 * -123.</li>
 * </ul>
 * <p>
 * @property {Object=} options - an object literal used to provide optional information to 
 * initialize the converter.
 * @property {string=} options.style - sets the style of number formatting. Allowed values are "decimal" 
 * (the default), "currency" or "percent". When a number is formatted as a decimal, the decimal 
 * character is replaced with the most appropriate symbol for the locale. In English this is a 
 * decimal point ("."), while in many locales it is a decimal comma (","). If grouping is enabled the 
 * locale dependent grouping separator is also used. These symbols are also used for numbers 
 * formatted as currency or a percentage, where appropriate.
 * @property {string=} options.currency - specifies the currency that will be used when formatting the 
 * number. The value should be a ISO 4217 alphabetic currency code. If the style is set to currency, 
 * it's required that the currency property also be specified. This is because the currency used is 
 * not dependent on the locale. You may be using a Thai locale, but dealing in US Dollars, e.g.
 * @property {string=} options.currencyDisplay - if the number is using currency formatting, specifies 
 * if the currency will be displayed using its "code" (as an ISO 4217 alphabetic currency code), 
 * "symbol" (a localized currency symbol (e.g. $ for US dollars, £ for Great British pounds, and so 
 * on), or "name" (a localized currency name. Allowed values are "code", "symbol" and "name". 
 * The default is "symbol".
 * @property {string=} options.decimalFormat -
 * specifies the decimal format length to use when style is set to "decimal". 
 * Allowed values are : "standard"(default), "short" and "long". 'standard' is equivalent to not 
 * specifying the 'decimalFormat' attribute, in that case the locale’s default decimal pattern 
 * is used for formatting.
 * <p>
 * The user can also specify 'minimumFractionDigits' and  'maximumFractionDigits' to display. 
 * When not present we use the locale's default max and min fraction digits.
 * </p>
 * <p>
 * There is no need to specify the scale; we automatically detect greatest scale that is less or 
 * equal than the input number. For example  1000000 is formatted as "1M" or "1 million" and
 * 1234 is formatted, with zero fractional digits, as "1K" or " 1 thousand" for 
 * short and long formats respectively. The pattern for the short and long number is locale dependent 
 * and uses plural rules for the particular locale.
 * </p>
 * <p>
 * NOTE: Currently this option formats a value (e.g., 2000 -> 2K), but it does not parse a value 
 * (e.g., 2K -> 2000), so it can only be used
 * in a readOnly EditableValue because readOnly EditableValue components do not call
 * the converter's parse function.
 * </p>
 * @property {number=} options.minimumIntegerDigits - sets the minimum number of digits before the 
 * decimal place (known as integer digits). The number is padded with leading zeros if it would not 
 * otherwise have enough digits. The value must be an integer between 1 and 21.
 * @property {number=} options.minimumFractionDigits - similar to 'minimumIntegerDigits', except it 
 * deals with the digits after the decimal place (fractional digits). It must be an integer between 
 * 0 and 20. The fractional digits will be padded with trailing zeros if they are less than the minimum.
 * @property {number=} options.maximumFractionDigits - follows the same rules as 'minimumFractionDigits', 
 * but sets the maximum number of fractional digits that are allowed. The value will be rounded if 
 * there are more digits than the maximum specified.
 * @property {boolean=} options.useGrouping - when the value is truthy, the locale dependent grouping 
 * separator is used when formatting the number. This is often known as the thousands separator, 
 * although it is up to the locale where it is placed. The ‘useGrouping’ is set to true by default.
 * @property {string=} options.pattern an optional localized pattern, where the characters used in 
 * pattern are as defined in the Unicode CLDR for numbers, percent or currency formats. When present 
 * this will override the other "options". <p>
 * 
 * &nbsp;&nbsp;- When the pattern represents a currency style the 'currency' property is required to 
 * be set, as not setting this will throw an error. The 'currencyDisplay' is optional. <br/>Example: 
 * {pattern: '¤#,##0', currency: 'USD'}. <p>
 * 
 * &nbsp;&nbsp;- It's not mandatory for the pattern to have the special character '¤' (currency sign) 
 * be present. When not present, values are treated as a currency value, but are not formatted to 
 * show the currency symbol. <br/>Example: {pattern: '#,##0', currency: 'USD'} <p>
 * 
 * &nbsp;&nbsp;- When the pattern represents a percent style, the percent special character ('%') needs to be 
 * explicitly specified in the pattern, e.g., {pattern: "#,##0%"}. If the pattern does not contain 
 * the percent character it's treated as a decimal pattern, unless the style is set to percent, 
 * in which case the value is treated as a percent value, but not formatted to show the percent symbol. 
 * <br/>Example: {style: 'percent', pattern: "#,##0"}. <p>
 * 
 * &nbsp;&nbsp;- A decimal pattern or exponent pattern is specified in the pattern using the CLDR 
 * conventions. <br/>Example: {pattern: "#,##0.00"} or {pattern: "0.##E+0"}. <p>
 * 
 * NOTE: 'pattern' is provided for backwards compatibility with existing apps that may want the 
 * convenience of specifying an explicit format mask. Setting a pattern will override the default 
 * locale specific format. <br/>
 * 
 * @example <caption>Create a number converter to parse/format currencies</caption>
 * var converterFactory = oj.Validation.converterFactory("number");
 * var options = {style: "currency", currency: "USD", minimumIntegerDigits: 2};
 * converter = converterFactory.createConverter(options);<br/>
 * 
 * @example <caption>A number converter for percent values using a custom (CLDR) pattern</caption>
 * var converterFactory = oj.Validation.converterFactory("number");
 * var options = {pattern: '#,##0%'};
 * converter = converterFactory.createConverter(options);<br/>
 * 
 * @example <caption>To parse a value as percent but format it without displaying the percent character</caption>
 * var options = {style: 'percent', pattern: '#,##0'};<br/>
 * 
 * @example <caption>To parse a value as currency using a custom (CLDR) pattern</caption>
 * var options = {pattern: '¤#,##0', currency: 'USD'};
 * 
 * @example <caption>The following decimalFormat examples are in en locale.
 * To format a value as short (default for fraction digits is based on the locale)</caption>
 * var options = {style:’decimal’, decimalFormat:’short’};
 * converter = converterFactory.createConverter(options);
 * converter.format(12345);--> 12.354K<br/>
 * 
 * @example <caption>To format a value as long (default for fraction digits is based on the locale):</caption>
 * var options = {style:’decimal’, decimalFormat:’long’};
 * converter = converterFactory.createConverter(options);
 * converter.format(12345);--> 12.345 thousand<br/>
 * 
 * @example <caption>To format a value as short with minimum fraction digits:</caption>
 * options = { style:’decimal’, decimalFormat:’short’, 
 * minimumFractionDigits:4};
 * converter = converterFactory.createConverter(options);
 * converter.format(1234);--> 1.2340K<br/>
 * 
 * @example <caption>To format a value as short with maximum fraction digits:</caption>
 * options = { style:’decimal’, decimalFormat:’short’, 
 * maximumFractionDigits:0};
 * converter = converterFactory.createConverter(options);
 * converter.format(12345);--> 12K<br/>
 * 
 * @example <caption>To format a value as long with minimum and maximum fraction digits:</caption>
 * options = { style:’decimal’, decimalFormat:’long', 
 * minimumFractionDigits:2, maximumFractionDigits:4};
 * converter = converterFactory.createConverter(options);
 * converter.format(12000);--> 12.00 thousand<br/>
 * 
 * @example <caption>To format a value as short with minimum and maximum fraction digits:</caption>
 * options = { style:’decimal’, decimalFormat:’long', 
 * minimumFractionDigits:2, maximumFractionDigits:4};
 * converter = converterFactory.createConverter(options);
 * converter.format(12345678);--> 12.345 million<br/>
 * 
 * @example <caption>decimal style default is standard:</caption>
 * options = { style:’decimal’, decimalFormat:’standard’}; 
 * converter = converterFactory.createConverter(options);
 * converter.format(12345);--> 12,345<br/>

 * @export
 * @augments oj.NumberConverter 
 * @name oj.IntlNumberConverter
 * @since 0.6
 */
oj.IntlNumberConverter = function(options)
{
  this.Init(options);
};

oj.Object.createSubclass(oj.IntlNumberConverter, oj.NumberConverter, "oj.IntlNumberConverter");

/**
 * Initializes the number converter instance with the set options.
 * @param {Object=} options an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @export
 */
oj.IntlNumberConverter.prototype.Init = function(options) 
{
  oj.IntlNumberConverter.superclass.Init.call(this, options);
};


// Returns the wrapped number converter implementation object.
oj.IntlNumberConverter.prototype._getWrapped = function ()
{
  if (!this._wrapped)
  {
    this._wrapped = OraNumberConverter.getInstance();
  }
  
  return this._wrapped;
};

/**
 * Formats a Number and returns the formatted string, using the options this converter was 
 * initialized with.
 * 
 * @param {Number|number} value to be formatted for display
 * @return {string} the localized and formatted value suitable for display. When the value is 
 * formatted as a percent it's multiplied by 100.
 * 
 * @throws {Error} a ConverterError both when formatting fails, or if the options provided during 
 * initialization cannot be resolved correctly. 
 * 
 * @export
 */
oj.IntlNumberConverter.prototype.format = function (value) 
{
  // undefined, null and empty string values all return null. If value is NaN then return "".
  if (value == null || 
      (typeof value === "string" && (oj.StringUtils.trim("" + value)).length === 0) ||
      (typeof value === "number" && isNaN(value))) 
  {
    return oj.IntlConverterUtils.__getNullFormattedValue();
  }
  
  // TODO: Is this correct?
  var localeElements = oj.LocaleData.__getBundle(), locale = oj.Config.getLocale(), 
          resolvedOptions = this.resolvedOptions(), converterError;
  
  try
  {
    return this._getWrapped().format(value, localeElements, resolvedOptions, locale);
  }
  catch (e)
  {
    converterError = this._processConverterError(e, value);
    throw converterError;
  }
};

/**
 * Retrieves a hint String describing the format the value is expected to be in.
 * 
 * @return {String} a hint describing the format the value is expected to be in.
 * @export
 */
oj.IntlNumberConverter.prototype.getHint = function ()
{
  // UX does not want any hint for numbers. 
  // return oj.Translations.getTranslatedString("oj-converter.hint.summary",
  //        {'exampleValue': this._getHintValue()}); 
  //return oj.IntlNumberConverter.superclass.getHint.call(this); // this asserts, and we don't want that.
  return null;
};

/**
 * Returns the options called with converter initialization.
 * @return {Object} an object of options.
 * @export
 */
oj.IntlNumberConverter.prototype.getOptions = function () 
{
  return oj.IntlNumberConverter.superclass.getOptions.call(this);
};

/**
 * Parses a string value to return a Number, using the options this converter was initialized with. 
 * 
 * @param {String|string} value to parse
 * @return {number|null} the parsed number or null if the value was null or an empty string. When 
 * the value is parsed as a percent its 1/100th part is returned.
 * 
 * @throws {Error} a ConverterError both when parsing fails, or if the options provided during 
 * initialization cannot be resolved correctly. 
 *  
 * @export
 */
oj.IntlNumberConverter.prototype.parse = function (value) 
{
  var localeElements = oj.LocaleData.__getBundle(), locale = oj.Config.getLocale(), 
          resolvedOptions = this.resolvedOptions(), converterError;

  // null and empty string values are ignored and not parsed. It
  // undefined.
  if (value == null || value === "") // check for undefined, null and ""
  {
    return null;
  }
  
  try
  {
    // we want to trim the value for leading spaces before and after
    return this._getWrapped().parse(oj.StringUtils.trim(value), 
                                    localeElements, 
                                    resolvedOptions, 
                                    locale);
  }
  catch (e)
  {
    converterError = this._processConverterError(e, value);
    throw converterError;
  }
  
};

/**
 * Returns an object literal with properties reflecting the number formatting options computed based 
 * on the options parameter. If options (or pattern) is not provided, the properties will be derived 
 * from the locale defaults.
 * 
 * @return {Object} An object literal containing the resolved values for the following options. Some 
 * of these properties may not be present, indicating that the corresponding components will not be 
 * represented in the formatted output.
 * <ul>
 * <li><b>locale</b>: a String value with the language tag of the locale whose localization is used 
 * for formatting.</li>
 * <li><b>style</b>: a String value. One of the allowed values - "decimal", "currency" or "percent".</li>
 * <li><b>currency</b>: a String value.  an ISO 4217 alphabetic currency code. May be present only 
 *  when style is currency.</li>
 * <li><b>currencyDisplay</b>: a String value. One of the allowed values - "code", "symbol", or 
 *  "name".</li>
 * <li><b>numberingSystem</b>: a String value of the numbering system used. E.g. latn</li>
 * <li><b>minimumIntegerDigits</b>: a non-negative integer Number value indicating the minimum 
 *  integer digits to be used.</li>
 * <li><b>minimumFractionDigits</b>: a non-negative integer Number value indicating the minimum 
 *  fraction digits to be used.</li>
 * <li><b>maximumFractionDigits</b>: a non-negative integer Number value indicating the maximum 
 *  fraction digits to be used.</li>
 * <li><b>useGrouping</b>: a Boolean value indicating whether a grouping separator is used.</li>
 * 
 * @throws a oj.ConverterError when the options that the converter was initialized with are invalid. 
 * @export
 */
oj.IntlNumberConverter.prototype.resolvedOptions = function()
{
  var localeElements, locale = oj.Config.getLocale(), converterError;
  // options are resolved and cached for the current locale. when locale changes resolvedOptions 
  // is reevaluated as it contains locale specific info.
  if ((locale !== this._locale) || !this._resolvedOptions)
  {
    localeElements = oj.LocaleData.__getBundle();
    try
    {
      if (!localeElements)
      {
        oj.Logger.error("locale bundle for the current locale %s is unavailable", locale);
        return {};
      }
      
      // cache if successfully resolved
      this._resolvedOptions = this._getWrapped().resolvedOptions(localeElements, 
                                                                 this.getOptions(), 
                                                                 locale);
      this._locale = locale;
    }
    catch (e)
    {
      converterError = this._processConverterError(e);
      throw converterError;
    }
  }
  
  return this._resolvedOptions;
};

/**
 * Processes the error returned by the converter implementation and throws a oj.ConverterError 
 * instance.
 * 
 * @param {Error} e
 * @param {String|string|Number|number|Object=} value
 * @throws an instance of oj.ConverterError
 * @private
 */
oj.IntlNumberConverter.prototype._processConverterError = function (e, value)
{
  var errorInfo = e['errorInfo'], summary, detail, errorCode, parameterMap, converterError, 
          propName, resourceKey;
  if (errorInfo)
  {
    errorCode = errorInfo['errorCode'];
    parameterMap = errorInfo['parameterMap'];
    oj.Assert.assertObject(parameterMap);
    propName = parameterMap['propertyName'];
    
    if (e instanceof TypeError)
    {
      if (errorCode === "optionTypesMismatch" || errorCode === "optionTypeInvalid")
      {
        converterError = oj.IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
      }
    }
    else if (e instanceof RangeError)
    {
      if (errorCode === "optionOutOfRange")
      {
        converterError = oj.IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
      }
    }
    else if (e instanceof SyntaxError)
    {
      if (errorCode === "optionValueInvalid")
      {
        converterError = oj.IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
      }
    }
    else if (e instanceof Error)
    {
      if (errorCode === "decimalFormatMismatch")
      {
        // The '{value}' does not match the expected decimal format
        resourceKey = "oj-converter.number.decimalFormatMismatch.summary";
      }
      else if (errorCode === "currencyFormatMismatch")
      {
        // The {value} does not match the expected currency format
        resourceKey = "oj-converter.number.currencyFormatMismatch.summary";
      }
      else if (errorCode === "percentFormatMismatch")
      {
        resourceKey = "oj-converter.number.percentFormatMismatch.summary";
      }
      // TODO: We'll be able to remove this exception when this bug is fixed post V1.1:
      //  - implement parse() for short number converter
      //  
      else if (errorCode === "unsupportedParseFormat")
      {
        summary =  oj.Translations.getTranslatedString(
          "oj-converter.number.decimalFormatUnsupportedParse.summary");
        detail = oj.Translations.getTranslatedString(
          "oj-converter.number.decimalFormatUnsupportedParse.detail");
        converterError = new oj.ConverterError(summary, detail);
      }
      
      if (resourceKey)
      {
        summary = oj.Translations.getTranslatedString(resourceKey, 
          {'value': value || parameterMap['value'],
           'format': parameterMap['format']});
        
        // _getHintValue is smart. It uses the converter's 'format' function
        //  to get the example format to show the end user.
        detail = oj.Translations.getTranslatedString("oj-converter.hint.detail",
          {'exampleValue': this._getHintValue()}); 
          
        converterError = new oj.ConverterError(summary, detail);
      }
    }
  }
  
  if (!converterError)
  {
    // An error we are unfamiliar with. Get the message and set as detail
    summary = e.message; // TODO: What should the summary be when it's missing??
    detail = e.message;
    converterError = new oj.ConverterError(summary, detail);
  }
  
  return converterError;
};

// Returns the hint value. It uses the converter's format function to return a formatted
// example. For example, if the converter's style is decimal and decimalFormat is short,
// this.format(12345.98765) returns 12K, and we show 12K in the error message as an example
// of what they should type in.
oj.IntlNumberConverter.prototype._getHintValue = function()
{
  var value = "";
  try
  {
    // use .format to get a real example to show the user what format they can type in to the field.
    value =  this.format(12345.98765);
  }
  catch (e)
  {
    if (e instanceof oj.ConverterError)
    {
      // Something went wrong and we don't have a way to retrieve a valid value.
      // TODO: Log an error
      value = "";
    }
  }
  finally
  {
    // returns the formatted value of 12345.98765
    return value;
  }
};

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * This is a forked version of globalize.js
 */
/*
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */

/*
 DESCRIPTION
 OraNumberConverter object implements number parsing and formatting for
 decimal, currency, percent and perMill types. It supports ECMA-402 options 
 and user defined pattern. The user defined pattern is parsed in order to 
 derive the options that can be specified as ECMA options.
 
 PRIVATE CLASSES
 <list of private classes defined - with one-line descriptions>
 
 NOTES
 <other useful comments, qualifications, etc.>
 
 */

/** 
 * OraNumberConverter object implements number parsing and formatting for
 * decimal, currency, percent and perMill types. It supports ECMA-402 options 
 * and user defined pattern. The user defined pattern is parsed in order to 
 * derive the options that can be specified as ECMA options.
 *<p>The format and parse functions can throw the following exceptions:
 * <li> RangeError can be thrown during the validation of the options:
 * Example: The value 'currencies' is out of range for 'OraNumberConverter.parse'
 * options property 'style'. 
 * Expected: ['currency', 'decimal', 'percent', 'perMill']<br>
 * var errorInfo = {<br>
 *   'errorCode' : "optionOutOfRange",<br>
 *   'parameterMap' : {<br>
 *   'propertyName': $property$,<br>
 *   'propertyValue': $options.property$,<br>
 *   'propertyValueValid': $expectedValues$,<br>
 *   'caller': $_getOptionCaller$<br>
 * }<br>
 * };<br>
 * <br>
 * <br>
 * <li> TypeError can be thrown when currency is missing for currency style. It 
 * can be generic when an options requires a corresponding  option value.<br>
 * Example: A value for the property currency is required when the property
 * style is set to the value currency. An accepted value is a three-letter
 * ISO 4217 currency code.<br>
 * var errorInfo = {<br>
 * 'errorCode' : "optionTypesMismatch",<br>  
 * 'parameterMap' : {<br>
 * 'propertyName': 'style', // the driving property<br>
 * 'propertyValue': 'currency', // the driving property's value<br>
 * 'requiredPropertyName': 'currency', // the required property name<br>
 * 'requiredPropertyValueValid': 'a three-letter ISO 4217 currency code'<br>
 * }<br>
 * };<br> 
 * <br>
 * <br>
 * <li>SyntaxError can be thrown when the number format is invalid. it can 
 * happen during the calls to parse and format number.<br>
 * Example: Unexpected character(s) encountered in the pattern "#00#.00".<br>
 * An example of a valid pattern is "#,##0.0".<br>
 * var errorInfo = {<br>
 * 'errorCode' : "optionValueInvalid",<br> 
 * parameterMap : {'propertyName' : 'pattern',<br>
 *                 'propertyValue': $options.pattern$,<br>
 *                 'propertyValueHint': $format$}<br>
 * };<br>
 * <br>
 * <br>
 * <br>
 * <li>RangeError can be thrown if one of the number options is out of range.
 * It can happen during the calls to format number.<br>
 * Example: 30  is out of range. Enter a value between 0 and 20 for 
 * minimumFractionDigits. 
 * var errorInfo = {<br>
 * 'errorCode' : "numberOptionOutOfRange",<br>
 * 'parameterMap' : {'value': $value$, 'minValue': $mainValue$,
 * 'maxVlaue': $maxValue$, 'propertyName': $name$}<br>
 * };<br>
 * <br>
 * <br>
 * <li>Error can be thrown when there is mismatch between number pattern and
 * number string. it can happen during the calls to parse number.<br>
 * Example: The value "-$125" does not match the expected currency 
 * pattern "&#xa4;#,##0.00;(&#xa4;#,##0.00)"<br>
 * var errorInfo = {'errorCode' : "decimalFormatMismatch", 
 * 'parameterMap' : { 'value': $value$,  'format': $format$}};<br>
 * var errorInfo = {'errorCode' : "currencyFormatMismatch", 
 * 'parameterMap' : { 'value': $value$,   'format': $format$}};<br>
 * var errorInfo = {'errorCode' : "percentFormatMismatch", 
 * 'parameterMap' : { 'value': $value$,   'format': $format$}};<br>
 */

/**
 * @ignore
 */
var OraNumberConverter;

OraNumberConverter = (function () {
  var _zeroPad,
    _formatNumberImpl,
    _applyPatternImpl,
    _parseNegativePattern,
    _lenientParseNumber,
    _parseNegativeExponent,
    _getNumberSettings,
    _validateNumberOptions,
    _throwMissingCurrency,
    _throwNumberOutOfRange,
    _getNumberOption,
    _throwNaNException, _throwUnsupportedParseOption,
    _toRawFixed, _toExponentialPrecision, _toCompactNumber, instance,
    _regionMatches, _expandAffix, _expandAffixes, _throwSyntaxError;

  var _REGEX_INFINITY = /^[+\-]?infinity$/i,
    _REGEX_PARSE_FLOAT = /^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/,
    _LENIENT_REGEX_PARSE_FLOAT = /([^+-.0-9]*)([+\-]?\d*\.?\d*(E[+\-]?\d+)?).*$/,
    _ESCAPE_REGEXP = /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g,
    _REGEX_TRIM_ZEROS = /(^0\.0*)([^0].*$)/;

  var _decimalTypeValues = {
    'trillion': [100000000000000, 10000000000000, 1000000000000],
    'billion': [100000000000, 10000000000, 1000000000],
    'million': [100000000, 10000000, 1000000],
    'thousand': [100000, 10000, 1000]
  };

  var _decimalTypeValuesMap = {
    'trillion': 1000000000000,
    'billion': 1000000000,
    'million': 1000000,
    'thousand': 1000
  };
  //prepend or append count zeros to a string.
  _zeroPad = function (str, count, left) {
    var l;
    for (l = str.length; l < count; l += 1) {
      str = (left ? ("0" + str) : (str + "0"));
    }
    return str;
  };

  _throwNumberOutOfRange = function (value, minimum, maximum, property) {
    var msg = value +
      " is out of range.  Enter a value between " + minimum +
      " and " + maximum + " for " + property;
    var rangeError = new RangeError(msg);
    var errorInfo = {
      'errorCode': "numberOptionOutOfRange",
      'parameterMap': {
        'value': value,
        'minValue': minimum,
        'maxValue': maximum,
        'propertyName': property
      }
    };
    rangeError['errorInfo'] = errorInfo;
    throw rangeError;
  };

  _getNumberOption = function (options, property, minimum, maximum, fallback) {
    var value = options[property];
    if (value !== undefined) {
      value = Number(value);
      if (isNaN(value) || value < minimum || value > maximum) {
        _throwNumberOutOfRange(value, minimum, maximum, property);
      }
      return Math.floor(value);
    }
    else {
      return fallback;
    }
  };

  /*return the properties for a number such as minimum and maximum fraction 
   *digits, decimal separator, grouping separator.
   *-If no user defined pattern is provided, get the pattern from the locale
   *  data and parse it to extrcat the number properties. If ecma options are
   *  present, override the corresponding default properties.
   *-If a user defined pattern is provided, parse it and extrcat the number
   *  properties. Ignore ecma ptions if present.
   */

  _getNumberSettings = function (localeElements, numberSettings,
    options, locale) {
    var pat;
    var localeElementsMainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var numberingSystemKey = OraI18nUtils.getNumberingSystemKey(localeElementsMainNode, locale);
    numberSettings['numberingSystemKey'] = numberingSystemKey;
    numberSettings['numberingSystem'] = "symbols-numberSystem-" +
      numberingSystemKey;

    //pattern passed in options
    if (options['pattern'] !== undefined && options['pattern'].length > 0) {
      pat = options['pattern'];
    }
    else
    {
      var key;
      switch (options['style'])
      {
        case "decimal" :
          key = "decimalFormats-numberSystem-";
          break;
        case "currency" :
          key = "currencyFormats-numberSystem-";
          break;
        case "percent" :
          key = "percentFormats-numberSystem-";
          break;
        default:
          key = "decimalFormats-numberSystem-";
          break;
      }
      key += numberSettings['numberingSystemKey'];
      pat = localeElementsMainNode['numbers'][key]['standard'];
      var decFormatLength = options['decimalFormat'];
      if (decFormatLength !== undefined) {
        numberSettings['shortDecimalFormat'] = localeElementsMainNode['numbers'][key][decFormatLength]['decimalFormat'];
      }
    }
    var mainNodeKey = OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
    var bcp47Keys = OraI18nUtils.parseBCP47(mainNodeKey);
    var lang = bcp47Keys['language']['language'];
    numberSettings['plurals'] = localeElements['supplemental']['plurals'];
    numberSettings['lang'] = lang;
    numberSettings['pat'] = pat;
    numberSettings['minusSign'] = localeElementsMainNode['numbers']
      [numberSettings['numberingSystem']]['minusSign'];
    numberSettings['decimalSeparator'] = localeElementsMainNode['numbers']
      [numberSettings['numberingSystem']]['decimal'];
    numberSettings['exponential'] = localeElementsMainNode['numbers']
      [numberSettings['numberingSystem']]['exponential'];
    numberSettings['groupingSeparator'] = localeElementsMainNode['numbers']
      [numberSettings['numberingSystem']]['group'];
    numberSettings['currencyDisplay'] = options['currencyDisplay'];
    if (options['currency'] !== undefined)
      numberSettings['currencyCode'] = options['currency'].toUpperCase();
    numberSettings['style'] = options['style'];
    _applyPatternImpl(options, pat, localeElementsMainNode, numberSettings);
    if (options['pattern'] === undefined) {
      numberSettings['minimumIntegerDigits'] = _getNumberOption(options,
        'minimumIntegerDigits', 1, 21,
        numberSettings['minimumIntegerDigits']);
      if (options['maximumFractionDigits'] !== undefined) {
        numberSettings['maximumFractionDigits'] = _getNumberOption(options,
          'maximumFractionDigits', 0, 20, numberSettings['maximumFractionDigits']);
        if (numberSettings['maximumFractionDigits'] < numberSettings['minimumFractionDigits']) {
          numberSettings['minimumFractionDigits'] = numberSettings['maximumFractionDigits'];
        }
      }
      if (options['minimumFractionDigits'] !== undefined) {
        numberSettings['minimumFractionDigits'] = _getNumberOption(options,
          'minimumFractionDigits', 0, 20,
          numberSettings['minimumFractionDigits']);
      }
      if (numberSettings['maximumFractionDigits'] < numberSettings['minimumFractionDigits']) {
        numberSettings['maximumFractionDigits'] = numberSettings['minimumFractionDigits'];
      }
    }
  };

  _throwMissingCurrency = function (prop) {
    var typeError = new TypeError('The property "currency" is required when' +
      'the property "' + prop + '" is "currency". An accepted value is a ' +
      'three-letter ISO 4217 currency code.');
    var errorInfo = {
      'errorCode': 'optionTypesMismatch',
      'parameterMap': {
        'propertyName': prop, // the driving property
        'propertyValue': 'currency', // the driving property's value
        'requiredPropertyName': 'currency', // the required property name
        'requiredPropertyValueValid': 'a three-letter ISO 4217 currency code'
      }
    };
    typeError['errorInfo'] = errorInfo;
    throw typeError;
  };

  _throwUnsupportedParseOption = function () {
    var error, errorInfo,
      code = "unsupportedParseFormat",
      msg = "long and short decimalFormats are not supported for parsing";
    error = new Error(msg);
    errorInfo = {
      'errorCode': code,
      'parameterMap': {
        'value': 'decimal'
      }
    };
    error['errorInfo'] = errorInfo;
    throw error;
  };

  //If the user specifies currency as a style, currency option must also be
  // provided. parse does not support short and long decimalFormat.
  _validateNumberOptions = function (options, caller) {
    var getOption = OraI18nUtils.getGetOption(options, caller);
    var s = getOption('style', 'string', ['currency', 'decimal', 'percent', 'perMill'],
      'decimal');
    if (s === 'decimal') {
      s = getOption('decimalFormat', 'string', ['standard', 'short', 'long']);
      if (caller === 'OraNumberConverter.parse' && s !== undefined && s !== 'standard') {
        _throwUnsupportedParseOption();
      }
    }
    var c = getOption('currency', 'string');
    if (s === 'currency' && c === undefined) {
      _throwMissingCurrency("style");
    }
  };

  //_toCompactNumber does compact formatting like 3000->3K for short
  //and "3 thousand" for long
  _toCompactNumber = function (number, options, numberSettings) {

    function _getzerosInPattern(s) {
      var i = 0, n = 0, idx = 0, prefix = '';
      if (s[0] !== '0') {
        while (s[i] !== '0' && i < s.length) {
          i++;
        }
        prefix = s.substr(0, i);
        idx = i;
      }
      for (i = idx; i < s.length; i++) {
        if (s[i] === '0')
          n++;
        else
          break;
      }
      return [prefix, n];
    }

    /* To format a number N, the greatest type less than or equal to N is used, with
     * the appropriate plural category. N is divided by the type, after removing the
     * number of zeros in the pattern, less 1.
     * APIs supporting this format should provide control over the number of
     * significant or fraction digits.
     *Thus N=12345 matches <pattern type="10000" count="other">00 K</pattern>.
     *N is divided by 1000 (obtained from 10000 after removing "00" and restoring
     *one "0". The result is formatted according to the normal decimal pattern.
     *With no fractional digits, that yields "12 K".
     */
    function _matchTypeValue(n) {
      var i, j, len;
      for (i in _decimalTypeValues) {
        len = _decimalTypeValues[i].length;
        for (j = 0; j < len; j++) {
          if (_decimalTypeValues[i][j] <= n)
            return [i, _decimalTypeValues[i][j]];
        }
      }
      return [n, null];
    }


    var typeVal = _matchTypeValue(number);
    var prefix = '';
    if (typeVal[1] !== null) {
      var lang = numberSettings['lang'];
      var plural = numberSettings['plurals'][lang](Math.floor(number / _decimalTypeValuesMap[typeVal[0]]));
      var decimalFormatType = "" + typeVal[1] + "-count-" + plural;
      decimalFormatType = numberSettings['shortDecimalFormat'][decimalFormatType];
      if (decimalFormatType === undefined) {
        plural = "other";
        decimalFormatType = "" + typeVal[1] + "-count-" + plural;
        decimalFormatType = numberSettings['shortDecimalFormat'][decimalFormatType];
      }
      var tokens = _getzerosInPattern(decimalFormatType);
      var zeros = tokens[1];
      prefix = tokens[0];
      if (zeros < decimalFormatType.length) {
        var i = (1 * Math.pow(10, zeros));
        i = (typeVal[1] / i) * 10;
        number = number / i;
      }
    }
    var s = "";
    if (decimalFormatType !== undefined)
      s = decimalFormatType.substr(zeros + tokens[0].length);
    s = prefix + _toRawFixed(number, options, numberSettings) + s;
    return s;
  };

  //_toExponentialPrecision does the formatting when the pattern contain E,
  //for example #.#E0  
  _toExponentialPrecision = function (number, numberSettings) {
    var numStr0 = number + "";
    var trimExp = 0;
    var split = numStr0.split(/e/i);
    var numStr = split[0];
    _REGEX_TRIM_ZEROS.lastIndex = 0;
    var match = _REGEX_TRIM_ZEROS.exec(numStr);
    if (match !== null) {
      trimExp = match[1].length - 1;
      numStr = match[2];
    }
    else {
      numStr = numStr.replace(".", "");
    }
    var exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
    var numStr1 = parseInt(numStr, 10);
    var len = numberSettings['minimumIntegerDigits'] + numberSettings['maximumFractionDigits'];
    if (numStr.length > len) {
      len -= numStr.length;
      var factor = Math.pow(10, len);
      numStr1 = Math.round(numStr1 * factor);
    }
    var padLen = numberSettings['minimumIntegerDigits'] + numberSettings['minimumFractionDigits'];
    numStr1 = numStr1 + "";
    numStr1 = _zeroPad(numStr1, padLen, false);
    if (numStr0.indexOf('.') !== -1) {
      exponent -= numberSettings['minimumIntegerDigits'] - numStr0.indexOf('.') + trimExp;
    }
    else {
      exponent -= padLen - numStr.length - numberSettings['minimumFractionDigits'];
    }
    var posExp = Math.abs(exponent);
    posExp = _zeroPad(posExp + "", numberSettings['minExponentDigits'], true);
    if (exponent < 0)
      posExp = numberSettings['minusSign'] + posExp;
    var str1 = numStr1.slice(0, numberSettings['minimumIntegerDigits']);
    var str2 = numStr1.slice(numberSettings['minimumIntegerDigits']);
    if (str2.length > 0) {
      str1 += numberSettings['decimalSeparator'] + numStr1.slice(numberSettings['minimumIntegerDigits']) +
        numberSettings['exponential'] + posExp;
    }
    else {
      str1 += numberSettings['exponential'] + posExp;
    }
    return str1;
  };

  //_toRawFixed does the formatting based on
  //minimumFractionDigits and maximumFractionDigits.
  _toRawFixed = function (number, options, numberSettings) {
    var curSize = numberSettings['groupingSize'];
    //First round the number based on maximumFractionDigits
    var numberString = number + "";
    var split = numberString.split(/e/i);
    var exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
    numberString = split[ 0 ];
    split = numberString.split('.');
    var right = split.length > 1 ? split[ 1 ] : "";
    //round the number only if it has decimal points
    if (split.length > 1 && right.length > exponent)
    {
      var precision = Math.min(numberSettings['maximumFractionDigits'],
        right.length - exponent);
      var factor = Math.pow(10, precision),
        rounded = Math.round(number * factor) / factor;
      if (!isFinite(rounded)) {
        rounded = number;
      }
      number = rounded;
    }
    //split the number into integer, fraction and exponent parts.
    numberString = number + "";
    split = numberString.split(/e/i);
    exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
    numberString = split[ 0 ];
    split = numberString.split('.');
    numberString = split[ 0 ];
    right = split.length > 1 ? split[ 1 ] : "";
    //pad zeros based on the exponent value and minimumFractionDigits 
    if (exponent > 0) {
      right = _zeroPad(right, exponent, false);
      numberString += right.slice(0, exponent);
      right = right.substr(exponent);
    }
    else if (exponent < 0) {
      exponent = -exponent;
      numberString = _zeroPad(numberString, exponent + 1, true);
      right = numberString.slice(-exponent, numberString.length) + right;
      numberString = numberString.slice(0, -exponent);
    }
    if (precision > 0) {
      right = numberSettings['decimalSeparator'] +
        ((right.length > precision) ? right.slice(0, precision) :
          _zeroPad(right, precision, false));
    }
    else {
      if (numberSettings['minimumFractionDigits'] > 0) {
        right = numberSettings['decimalSeparator'];
      }
      else {
        right = "";
      }
    }
    //insert grouping separator in the integer part based on groupingSize
    var padLen = numberSettings['decimalSeparator'].length +
      numberSettings['minimumFractionDigits'];
    right = _zeroPad(right, padLen, false);
    var sep = numberSettings['groupingSeparator'],
      ret = "";
    if (options['useGrouping'] === false && options['pattern'] === undefined)
      sep = '';
    numberString = _zeroPad(numberString,
      numberSettings['minimumIntegerDigits'], true);
    var stringIndex = numberString.length - 1;
    right = right.length > 1 ? right : "";
    var rets;
    while (stringIndex >= 0) {
      if (curSize === 0 || curSize > stringIndex) {
        rets = numberString.slice(0, stringIndex + 1) +
          (ret.length ? (sep + ret + right) : right);
        return rets;
      }
      ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) +
        (ret.length ? (sep + ret) : "");
      stringIndex -= curSize;
    }
    rets = numberString.slice(0, stringIndex + 1) + sep + ret + right;
    return rets;
  };

  //first call _toRawFixed then add prefixes and suffixes. Display the 
  //number using native digits based on the numbering system
  _formatNumberImpl = function (value, options, localeElements,
    numberSettings, locale) {
    var localeElementsMainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    if (!isFinite(value)) {
      if (value === Infinity) {
        return localeElementsMainNode['numbers'][numberSettings['numberingSystem']]['infinity'];
      }
      if (value === -Infinity) {
        return localeElementsMainNode['numbers'][numberSettings['numberingSystem']]['infinity'];
      }
      return localeElementsMainNode['numbers'][numberSettings['numberingSystem']]['nan'];
    }
    var number = Math.abs(value);
    if (numberSettings['isPercent'] === true ||
      options['style'] === 'percent')
      number *= 100;
    else if (numberSettings['isPerMill'] === true)
      number *= 1000;

    //expand the number
    if (options['style'] === 'decimal' && options['decimalFormat'] !== undefined
      && options['decimalFormat'] !== 'standard')
      number = _toCompactNumber(number, options, numberSettings);
    else if (numberSettings['useExponentialNotation'] === true)
      number = _toExponentialPrecision(number, numberSettings);
    else
      number = _toRawFixed(number, options, numberSettings);
    var ret = "";
    //add negative prefix and suffix if number is negative
    if (value < 0) {
      ret += numberSettings['negativePrefix'] + number +
        numberSettings['negativeSuffix'];
    }
    //add positive prefix and suffix if number is positive
    else {
      ret += numberSettings['positivePrefix'] + number +
        numberSettings['positiveSuffix'];
    }
    //display the digits based on the numbering system
    var numberingSystemKey = OraI18nUtils.getLanguageExtension(locale, "nu");
    if (OraI18nUtils.numeringSystems[numberingSystemKey] === undefined)
      numberingSystemKey = 'latn';
    if (numberingSystemKey !== 'latn') {
      var idx;
      var nativeRet = [];
      for (idx = 0; idx < ret.length; idx++)
      {
        if (ret[idx] >= '0' && ret[idx] <= '9')
          nativeRet.push(OraI18nUtils.numeringSystems[numberingSystemKey][ret[idx]]);
        else
          nativeRet.push(ret[idx]);

      }
      return nativeRet.join("");
    }
    return ret;
  };

  //remove prefix and suffix, return a sign and value. First try to extract
  //a number using exact match. If it fails try lenient parsing.
  _parseNegativePattern = function (value, options, numberSettings,
    localeElements) {
    var ret, num = OraI18nUtils.trimNumber(value);
    var sign = "";
    var exactMatch = false;
    var posSign = localeElements['numbers'][numberSettings['numberingSystem']]['plusSign'];
    var posSignRegExp = new RegExp("^" + posSign.replace(_ESCAPE_REGEXP, "\\$1"));
    num = num.replace(posSignRegExp, "");
    var nbSettingPosPrefix = OraI18nUtils.trimNumber(numberSettings['positivePrefix']),
      nbSettingPosSuffix = OraI18nUtils.trimNumber(numberSettings['positiveSuffix']),
      nbSettingNegPrefix = OraI18nUtils.trimNumber(numberSettings['negativePrefix']),
      nbSettingNegSuffix = OraI18nUtils.trimNumber(numberSettings['negativeSuffix']);
    //try exact match of negative prefix and suffix
    var posPrefRegexp = new RegExp("^" + (nbSettingPosPrefix ||
      "").replace(_ESCAPE_REGEXP, "\\$1"));
    var posSuffRegexp = new RegExp((nbSettingPosSuffix || "").
      replace(_ESCAPE_REGEXP, "\\$1") + "$");
    var negPrefRegexp = new RegExp("^" + (nbSettingNegPrefix ||
      "").replace(_ESCAPE_REGEXP, "\\$1"));
    var negSuffRegexp = new RegExp((nbSettingNegSuffix ||
      "").replace(_ESCAPE_REGEXP, "\\$1") + "$");

    if (negPrefRegexp.test(num) === true && negSuffRegexp.test(num) === true) {
      num = num.replace(negPrefRegexp, "");
      num = num.replace(negSuffRegexp, "");
      sign = "-";
      exactMatch = true;
    }
    //try exact match of positive prefix and suffix
    else if (posPrefRegexp.test(num) === true && posSuffRegexp.test(num) === true) {
      num = num.replace(posPrefRegexp, "");
      num = num.replace(posSuffRegexp, "");
      sign = "+";
      exactMatch = true;
    }
    //if style is currency, remove currency symbol from prefix and suffix 
    //and try a match
    else if (options['style'] === 'currency') {
      var code = numberSettings['currencyCode'], symbol = code;
      var posPrefix, posSuffix, negPrefix, negSuffix, repStr;
      if (localeElements['numbers']['currencies'][code] !== undefined) {
        symbol = localeElements['numbers']['currencies'][code]['symbol'];
      }
      if (numberSettings['currencyDisplay'] === undefined ||
        numberSettings['currencyDisplay'] === "symbol") {
        repStr = symbol;
      }
      else if (numberSettings['currencyDisplay'] === "code") {
        repStr = code;
      }
      if (repStr !== undefined) {
        posPrefix = (nbSettingPosPrefix || "").replace(
          repStr, "");
        posSuffix = (nbSettingPosSuffix || "").replace(
          repStr, "");
        negPrefix = (nbSettingNegPrefix || "").replace(
          repStr, "");
        negSuffix = (nbSettingNegSuffix || "").replace(
          repStr, "");
        posPrefRegexp = new RegExp(("^" + posPrefix).replace(
          _ESCAPE_REGEXP, "\\$1"));
        posSuffRegexp = new RegExp(posSuffix.replace(
          _ESCAPE_REGEXP, "\\$1") + "$");
        negPrefRegexp = new RegExp(("^" + negPrefix).replace(
          _ESCAPE_REGEXP, "\\$1"));
        negSuffRegexp = new RegExp(negSuffix.replace(
          _ESCAPE_REGEXP, "\\$1") + "$");

        //try  match of positive prefix and suffix
        if (negPrefRegexp.test(num) === true && negSuffRegexp.test(num) === true) {
          num = num.replace(negPrefRegexp, "");
          num = num.replace(negSuffRegexp, "");
          sign = "-";
          exactMatch = true;
        }
        //try exact match of positive prefix and suffix
        else if (posPrefRegexp.test(num) === true && posSuffRegexp.test(num) === true) {
          num = num.replace(posPrefRegexp, "");
          num = num.replace(posSuffRegexp, "");
          sign = "+";
          exactMatch = true;
        }
      }
    }
    if (!exactMatch) {
      ret = _lenientParseNumber(num, numberSettings, localeElements);
      ret[2] = true;
    }
    else
      ret = [sign, num];
    return ret;
  };

  _lenientParseNumber = function (num, numberSettings, localeElements) {
    // Try to extract the number accoring to the following pattern:
    // optional +- followed by one or many digits followed by optional
    // fraction part followed by optional exponential.
    // use localized +, -, decimal separator, exponential
    // [+-]?\d+(?:\.\d+)?(?:E[+-]?\d+)?/;
    //remove grouping deparator from string
    var groupingSeparator =
      localeElements['numbers'][numberSettings['numberingSystem']]['group'];
    var decimalSeparator =
      localeElements['numbers'][numberSettings['numberingSystem']]['decimal'];
    var localeMinusSign =
      localeElements['numbers'][numberSettings['numberingSystem']]['minusSign'];
    var plusSign = "+";
    var minusSign = "-";
    var sign = "";
    var dot = "";
    var exponential =
      OraI18nUtils.toUpper(localeElements['numbers'][numberSettings['numberingSystem']]['exponential']);
    num = OraI18nUtils.toUpper(num);
    num = num.split(exponential).join("E");
    //remove grouping separator from string
    var groupSep = groupingSeparator;
    num = num.split(groupSep).join("");
    var altGroupSep = groupSep.replace(/\u00A0/g, " ");
    if (groupSep !== altGroupSep) {
      num = num.split(altGroupSep).join("");
    }
    num = num.split(decimalSeparator).join(".");
    if (num.charAt(0) === ".") {
      num = num.substr(1);
      dot = ".";
    }
    //replace localized minus with minus
    num = num.replace(localeMinusSign, minusSign);
    var match = _LENIENT_REGEX_PARSE_FLOAT.exec(num);
    var resNum = dot + match[2];
    if (OraI18nUtils.startsWith(resNum, minusSign)) {
      resNum = resNum.substr(minusSign.length);
      sign = "-";
    }
    else if (OraI18nUtils.startsWith(num, plusSign)) {
      resNum = resNum.substr(plusSign.length);
      sign = "+";
    }
    return [sign, resNum];
  };

  //parse the exponent part of a number
  _parseNegativeExponent = function (value, localeElements, numberSettings) {
    var neg = localeElements['numbers'][numberSettings['numberingSystem']]['minusSign'],
      pos = localeElements['numbers'][numberSettings['numberingSystem']]['plusSign'],
      ret;
    value = OraI18nUtils.trimNumber(value);
    neg = OraI18nUtils.trimNumber(neg);
    pos = OraI18nUtils.trimNumber(pos);
    if (OraI18nUtils.startsWith(value, neg)) {
      ret = ["-", value.substr(neg.length)];
    }
    else if (OraI18nUtils.startsWith(value, OraI18nUtils.trimNumber(pos))) {
      ret = ["+", value.substr(pos.length)];
    }
    return ret || ["", value];
  };

  /* This module handles the  parsing of a number pattern.
   * It sets prefix, suffix, minimum and maximum farcation digits, 
   * miimum  integer digits and grouping size. 
   */

  var _ZERO_DIGIT = '0',
    _GROUPING_SEPARATOR = ',',
    _DECIMAL_SEPARATOR = '.',
    _PERCENT = '%',
    _PER_MILL = '\u2030',
    _DIGIT = '#',
    _SEPARATOR = ';',
    _EXPONENT = "E",
    _MINUS = '-',
    _QUOT = '\'',
    _CURRENCY = '\u00A4';

  var posPrefixPattern,
    posSuffixPattern,
    negPrefixPattern,
    negSuffixPattern;

  var _MAXIMUM_INTEGER_DIGITS = 0x7fffffff;
  var _MAXIMUM_FRACTION_DIGITS = 0x7fffffff;

  _throwSyntaxError = function (pattern) {
    var msg, syntaxError, errorInfo, samplePattern = "#,##0.###";
    msg = "Unexpected character(s) encountered in the pattern \"" +
      pattern + " An example of a valid pattern is \"" + samplePattern +
      '".';
    syntaxError = new SyntaxError(msg);
    errorInfo = {
      'errorCode': 'optionValueInvalid',
      'parameterMap': {
        'propertyName': 'pattern',
        'propertyValue': pattern,
        'propertyValueHint': samplePattern
      }
    };
    syntaxError['errorInfo'] = errorInfo;
    throw syntaxError;
  };

  _regionMatches = function (str1, offset1, str2) {
    var sub1 = str1.substr(offset1, str2.length);
    var regExp = new RegExp(str2, "i");
    return (regExp.exec(sub1) !== null);
  };

  _expandAffixes = function (localeElements, numberSettings) {
    var curDisplay = {};
    if (posPrefixPattern !== null) {
      numberSettings['positivePrefix'] = _expandAffix(posPrefixPattern,
        localeElements, numberSettings, curDisplay);
    }
    if (posSuffixPattern !== null) {
      numberSettings['positiveSuffix'] = _expandAffix(posSuffixPattern,
        localeElements, numberSettings, curDisplay);
    }
    if (negPrefixPattern !== null) {
      numberSettings['negativePrefix'] = _expandAffix(negPrefixPattern,
        localeElements, numberSettings, curDisplay);
    }
    if (negSuffixPattern !== null) {
      numberSettings['negativeSuffix'] = _expandAffix(negSuffixPattern,
        localeElements, numberSettings, curDisplay);
    }
    if (curDisplay['name'] !== undefined) {
      numberSettings['positiveSuffix'] = "\u00a0" + curDisplay['name'];
      numberSettings['positivePrefix'] = "";
      if (numberSettings['lang'] === 'ar') {
        numberSettings['negativeSuffix'] = localeElements['numbers'][numberSettings['numberingSystem']]['minusSign'] + "\u00a0" + curDisplay['name'];
        numberSettings['negativePrefix'] = "";
      }
      else {
        numberSettings['negativeSuffix'] = "\u00a0" + curDisplay['name'];
        numberSettings['negativePrefix'] = localeElements['numbers'][numberSettings['numberingSystem']]['minusSign'];
      }
    }
  };

  _expandAffix = function (pattern, localeElements, numberSettings,
    currencyDisplay) {
    var buffer = "";
    for (var i = 0; i < pattern.length; ) {
      var c = pattern.charAt(i++);
      if (c === _QUOT)// {
        continue;
      //c = pattern.charAt(i++);
      switch (c) {
        case _CURRENCY:
          var code = numberSettings['currencyCode'];
          var name = code, symbol = code;
          if (localeElements['numbers']['currencies'][code] !== undefined) {
            name = localeElements['numbers']['currencies'][code]['displayName'];
            symbol = localeElements['numbers']['currencies'][code]['symbol'];
          }
          if (numberSettings['currencyDisplay'] === undefined ||
            numberSettings['currencyDisplay'] === "symbol")
            c = symbol;
          else if (numberSettings['currencyDisplay'] === "code") {
            c = code;
          }
          else {
            c = name;
            currencyDisplay['name'] = c;
          }
          break;
        case _PERCENT:
          c = localeElements['numbers'][numberSettings['numberingSystem']]['percentSign'];
          break;
        case _PER_MILL:
          c = localeElements['numbers'][numberSettings['numberingSystem']]['perMille'];
          break;
        case _MINUS:
          c = localeElements['numbers'][numberSettings['numberingSystem']]['minusSign'];
          break;
      }
      //}
      buffer = buffer.concat(c);
    }
    return buffer;
  };

  _applyPatternImpl = function (options, pattern, localeElements,
    numberSettings) {

    var gotNegative = false,
      useExponentialNotation = false;
    var phaseOneLength = 0;
    var start = 0;
    var isPrefix = true;

    for (var j = 1; j >= 0 && start < pattern.length; --j) {
      var inQuote = false;
      var prefix = "";
      var suffix = "";
      var decimalPos = -1;
      var multiplier = 1;
      var digitLeftCount = 0, zeroDigitCount = 0, digitRightCount = 0,
        groupingCount = -1;
      var minExponentDigits;
      var phase = 0;

      isPrefix = true;
      for (var pos = start; pos < pattern.length; ++pos) {
        var ch = pattern.charAt(pos);
        switch (phase) {
          case 0:
          case 2:
            // Process the prefix / suffix characters
            if (inQuote) {
              if (ch === _QUOT) {
                if ((pos + 1) < pattern.length && pattern.charAt(pos + 1) ===
                  _QUOT) {
                  ++pos;
                  if (isPrefix)
                    prefix = prefix.concat("''");
                  else
                    suffix = suffix.concat("''");
                } else {
                  inQuote = false; // 'do'
                }
                continue;
              }
            }
            else {
              // Process unquoted characters seen in prefix or suffix phase.
              if (ch === _DIGIT ||
                ch === _ZERO_DIGIT ||
                ch === _GROUPING_SEPARATOR ||
                ch === _DECIMAL_SEPARATOR) {
                phase = 1;
                --pos; // Reprocess this character
                continue;
              } else if (ch === _CURRENCY) {
                if (options['currency'] === undefined)
                  _throwMissingCurrency("pattern");
                // Use lookahead to determine if the currency sign
                // is doubled or not.
                options['style'] = 'currency';
                var doubled = (pos + 1) < pattern.length &&
                  pattern.charAt(pos + 1) === _CURRENCY;
                if (doubled) { // Skip over the doubled character
                  ++pos;
                }
                if (isPrefix)
                  prefix = prefix.concat(doubled ? "'\u00A4\u00A4" :
                    "'\u00A4");
                else
                  suffix = suffix.concat(doubled ? "'\u00A4\u00A4" :
                    "'\u00A4");
                continue;
              } else if (ch === _QUOT) {
                if (ch === _QUOT) {
                  if ((pos + 1) < pattern.length &&
                    pattern.charAt(pos + 1) === _QUOT) {
                    ++pos;
                    if (isPrefix)
                      prefix = prefix.concat("''");// o''clock
                    else
                      suffix = suffix.concat("''");
                  } else {
                    inQuote = true; // 'do'
                  }
                  continue;
                }
              } else if (ch === _SEPARATOR) {
                if (phase === 0 || j === 0) {
                  _throwSyntaxError(pattern);
                }
                start = pos + 1;
                pos = pattern.length;
                continue;
              }

              // Next handle characters which are appended directly.
              else if (ch === _PERCENT) {
                options['style'] = 'percent';
                if (multiplier !== 1) {
                  _throwSyntaxError(pattern);
                }
                numberSettings['isPercent'] = true;
                multiplier = 100;
                if (isPrefix)
                  prefix = prefix.concat("'%");
                else
                  suffix = suffix.concat("'%");
                continue;
              } else if (ch === _PER_MILL) {
                if (multiplier !== 1) {
                  _throwSyntaxError(pattern);
                }
                options['style'] = 'perMill';
                numberSettings['isPerMill'] = true;
                multiplier = 1000;
                if (isPrefix)
                  prefix = prefix.concat("'\u2030");
                else
                  suffix = suffix.concat("'\u2030");
                continue;
              }
              else if (ch === _MINUS) {
                if (isPrefix)
                  prefix = prefix.concat("'-");
                else
                  suffix = suffix.concat("'-");
                continue;
              }
            }
            if (isPrefix)
              prefix = prefix.concat(ch);
            else
              suffix = suffix.concat(ch);
            break;

          case 1:
            if (j === 1) {
              ++phaseOneLength;
            } else {
              if (--phaseOneLength === 0) {
                phase = 2;
                isPrefix = false;
              }
              continue;
            }

            if (ch === _DIGIT) {
              if (zeroDigitCount > 0) {
                ++digitRightCount;
              } else {
                ++digitLeftCount;
              }
              if (groupingCount >= 0 && decimalPos < 0) {
                ++groupingCount;
              }
            } else if (ch === _ZERO_DIGIT) {
              if (digitRightCount > 0) {
                _throwSyntaxError(pattern);
              }
              ++zeroDigitCount;
              if (groupingCount >= 0 && decimalPos < 0) {
                ++groupingCount;
              }
            } else if (ch === _GROUPING_SEPARATOR) {
              groupingCount = 0;
            } else if (ch === _DECIMAL_SEPARATOR) {
              if (decimalPos >= 0) {
                _throwSyntaxError(pattern);
              }
              decimalPos = digitLeftCount + zeroDigitCount +
                digitRightCount;
            } else if (_regionMatches(pattern, pos, _EXPONENT)) {
              if (useExponentialNotation) {
                _throwSyntaxError(pattern);
              }
              useExponentialNotation = true;
              minExponentDigits = 0;
              pos = pos + _EXPONENT.length;
              while (pos < pattern.length && pattern.charAt(pos) ===
                _ZERO_DIGIT) {
                ++minExponentDigits;
                ++phaseOneLength;
                ++pos;
              }

              if ((digitLeftCount + zeroDigitCount) < 1 ||
                minExponentDigits < 1) {
                _throwSyntaxError(pattern);
              }
              phase = 2;
              isPrefix = false;
              --pos;
              continue;
            } else {
              phase = 2;
              isPrefix = false;
              --pos;
              --phaseOneLength;
              continue;
            }
            break;
        }
      }


      if (zeroDigitCount === 0 && digitLeftCount > 0 && decimalPos >= 0) {
        // Handle "###.###" and "###." and ".###"
        var n = decimalPos;
        if (n === 0) { // Handle ".###"
          ++n;
        }
        digitRightCount = digitLeftCount - n;
        digitLeftCount = n - 1;
        zeroDigitCount = 1;
      }

      // Do syntax checking on the digits.
      if ((decimalPos < 0 && digitRightCount > 0) ||
        (decimalPos >= 0 && (decimalPos < digitLeftCount ||
          decimalPos > (digitLeftCount + zeroDigitCount))) ||
        groupingCount === 0 || inQuote) {
        _throwSyntaxError(pattern);
      }

      if (j === 1) {
        posPrefixPattern = prefix;
        posSuffixPattern = suffix;
        negPrefixPattern = posPrefixPattern;
        negSuffixPattern = posSuffixPattern;
        var digitTotalCount = digitLeftCount + zeroDigitCount +
          digitRightCount;
        // The effectiveDecimalPos is the position the decimal is at or
        //would be at if there is no decimal. Note that if decimalPos<0,
        // then digitTotalCount == digitLeftCount + zeroDigitCount.
        var effectiveDecimalPos = decimalPos >= 0 ?
          decimalPos : digitTotalCount;
        numberSettings['minimumIntegerDigits'] = (effectiveDecimalPos -
          digitLeftCount);
        numberSettings['maximumIntegerDigits'] = (useExponentialNotation ?
          digitLeftCount + numberSettings['minimumIntegerDigits'] :
          _MAXIMUM_INTEGER_DIGITS);
        numberSettings['maximumFractionDigits'] = (decimalPos >= 0 ?
          (digitTotalCount - decimalPos) : 0);
        numberSettings['minimumFractionDigits'] = (decimalPos >= 0 ?
          (digitLeftCount + zeroDigitCount - decimalPos) : 0);
        numberSettings['groupingSize'] = (groupingCount > 0) ?
          groupingCount : 0;
      } else {
        negPrefixPattern = prefix;
        negSuffixPattern = suffix;
        gotNegative = true;
      }
    }

    if (pattern.length === 0) {
      posPrefixPattern = posSuffixPattern = "";
      numberSettings['minimumIntegerDigits'] = 0;
      numberSettings['maximumIntegerDigits'] = _MAXIMUM_INTEGER_DIGITS;
      numberSettings['minimumFractionDigits'] = 0;
      numberSettings['maximumFractionDigits'] = _MAXIMUM_FRACTION_DIGITS;
    }
    numberSettings['useExponentialNotation'] = useExponentialNotation;
    numberSettings['minExponentDigits'] = minExponentDigits;
    // If there was no negative pattern, or if the negative pattern is
    // identical to the positive pattern, then prepend the minus sign to
    // the positive pattern to form the negative pattern.
    if (!gotNegative ||
      ((negPrefixPattern.localeCompare(posPrefixPattern) === 0)
        && (negSuffixPattern.localeCompare(posSuffixPattern) === 0))) {
      if (options['style'] === 'currency' && numberSettings['lang'] === 'ar') {
        negSuffixPattern = posSuffixPattern + "'\u200f-";
        negPrefixPattern = posPrefixPattern;
      }
      else {
        negSuffixPattern = posSuffixPattern;
        negPrefixPattern = "'-" + posPrefixPattern;

      }
    }
    _expandAffixes(localeElements, numberSettings);
  };

  _throwNaNException = function (ret, options, numberSettings, errStr) {
    if (isNaN(ret)) {
      var msg, error, errorInfo, code;
      msg = "Unparsable number " + errStr + " The expected number " +
        "pattern is " + numberSettings['pat'];
      switch (options['style'])
      {
        case "decimal" :
          code = "decimalFormatMismatch";
          break;
        case "currency" :
          code = "currencyFormatMismatch";
          break;
        case "percent" :
          code = "percentFormatMismatch";
          break;
      }
      error = new Error(msg);
      errorInfo = {
        'errorCode': code,
        'parameterMap': {
          'value': errStr,
          'format': numberSettings['pat']
        }
      };
      error['errorInfo'] = errorInfo;
      throw error;
    }
    if (numberSettings['isPercent'] === true || options['style'] ===
      'percent')
      ret /= 100;
    else if (numberSettings['isPerMill'] === true)
      ret /= 1000;
    return ret;
  };

  function _init()
  {

    return {
      /**
       * Format a number.
       * @memberOf OraNumberConverter
       * @param {number} value - Number object to be formatted.
       * @param {Object} localeElements - the instance of LocaleElements  
       * bundle
       * @param {Object=} options - Containing the following properties:<br>
       * - <b>style.</b>  is one of the String values "decimal", "currency"  
       * or "percent". The default is "decimal".<br>
       * - <b>decimalFormat.</b> is used in conjuction with "decimal" style. 
       * It can have one of the string values "short", "long". It is used for 
       * compact number formatting. For example 3000 is displayed
       *  as 3K for "short" and 3 thousand for "long". We take into consideration
       *  the locale's plural rules for the compact pattern.<br> 
       * - <b>currency.</b> An ISO 4217 alphabetic currency code. Mandatory 
       *  when style is "currency".<br>
       * - <b>currencyDisplay.</b> is one of the String values "code", 
       * "symbol", or "name", specifying whether to display the currency as  
       * an ISO 4217 alphabetic currency code, 
       * a localized currency symbol, or a localized currency name if 
       * formatting with the "currency" style. It is only present when style 
       * has the value "currency". The default is "symbol".<br>
       * - <b>minimumIntegerDigits.</b> is a non-negative integer Number value 
       * indicating the minimum integer digits to be used. Numbers will be 
       * padded with leading zeroes if necessary.<br>
       * - <b>minimumFractionDigits.</b> a non-negative integer Number value 
       * indicating the minimum fraction digits to be used. Numbers will be 
       * padded with trailing zeroes if necessary.<br>
       * - <b>maximumFractionDigits.</b> a non-negative integer Number value 
       * indicating the maximum fraction digits to be used. Numbers will be 
       * rounded if necessary.<br>
       * - <b>useGrouping.</b> is a Boolean value indicating whether a 
       * grouping separator should be used. The default is true.<br>
       * - <b>pattern.</b> custom pattern. Will override above options 
       * when present.
       * @param {string=} locale - A BCP47 compliant language tag. it is only 
       * used to extract the unicode extension keys. 
       * @return {string} formatted number.
       * @throws {RangeError} If a property value of the options parameter is 
       * out of range.
       * @throws {TypeError} If the style is currency and currency code is 
       * missing.
       * @throws {SyntaxError} If an unexpected character is encountered in 
       * the pattern.
       */
      format: function (value, localeElements, options, locale) {
        if (arguments.length <= 2 || options === undefined) {
          options = {
            'useGrouping': true,
            'style': 'decimal'
          };
        }
        _validateNumberOptions(options, "OraNumberConverter.format");
        var numberSettings = {};
        _getNumberSettings(localeElements, numberSettings, options, locale);
        return _formatNumberImpl(value, options, localeElements,
          numberSettings, locale);
      },
      /**
       * Parse a number.
       * @memberOf OraNumberConverter
       * @param {string|number} str - string to be parsed.
       * @param {Object} localeElements - the instance of LocaleElements 
       * bundle
       * @param {Object=} options - Containing the following properties:<br>
       * - <b>style.</b>  is one of the String values "decimal", "currency" or 
       * "percent". The default is "decimal".<br>
       * - <b>currency.</b> An ISO 4217 alphabetic currency code. Mandatory 
       * when style is "currency".<br>
       * - <b>currencyDisplay.</b> is one of the String values "code", 
       * "symbol", or "name", specifying whether to display the currency as 
       * an ISO 4217 alphabetic currency code,
       *  a localized currency symbol, or a localized currency name if 
       *  formatting with the "currency" style. It is only considered when 
       *  style has the value "currency". The default is "symbol".<br>
       * - <b>useGrouping.</b> is a Boolean value indicating whether a 
       * grouping separator should be used. The default is true.<br>
       * - <b>pattern.</b> custom pattern. Will override above options when 
       * present.<br>
       * @param {string=} locale - A BCP47 compliant language tag. it is only 
       * used to extract the unicode extension keys. 
       * @return {number} a number object parsed from the string. In case of 
       * error, returns null.
       * @throws {RangeError} If a property value of the options parameter is 
       * out of range.
       * @throws {TypeError} If the style is currency and currency code is 
       * missing.
       * @throws {SyntaxError} If an unexpected character is encountered in 
       * the pattern.
       * @throws {Error} If the <i>str</i> parameter does not match the number 
       * pattern.
       */
      parse: function (str, localeElements, options, locale) {
        if (typeof str === "number")
          return str;
        if (Object.prototype.toString.call(str) === '[object Number]')
          return  Number(str);
        if (arguments.length <= 2 || options === undefined) {
          options = {
            'useGrouping': true,
            'style': 'decimal'
          };
        }
        var errStr = str;
        _validateNumberOptions(options, "OraNumberConverter.parse");
        var localeElementsMainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
        var numberSettings = {};
        var numberingSystemKey = OraI18nUtils.getLanguageExtension(locale, "nu");
        if (OraI18nUtils.numeringSystems[numberingSystemKey] === undefined)
          numberingSystemKey = 'latn';
        if (numberingSystemKey !== 'latn') {
          var idx;
          var latnStr = [];
          for (idx = 0; idx < str.length; idx++)
          {
            var pos = OraI18nUtils.numeringSystems[numberingSystemKey].indexOf(str[idx]);
            if (pos !== -1)
              latnStr.push(pos);
            else
              latnStr.push(str[idx]);
          }
          str = latnStr.join("");
        }
        _getNumberSettings(localeElements, numberSettings, options, locale);
        var decimalSeparator = localeElementsMainNode['numbers']
          [numberSettings['numberingSystem']]['decimal'],
          groupingSeparator = localeElementsMainNode['numbers']
          [numberSettings['numberingSystem']]['group'],
          ret = NaN,
          value1 = str.replace(/ /g, "");
        // allow infinity or hexidecimal
        if (_REGEX_INFINITY.test(value1)) {
          ret = parseFloat(str);
          return ret;
        }
        var signInfo = _parseNegativePattern(str, options, numberSettings,
          localeElementsMainNode),
          sign = signInfo[ 0 ],
          num = signInfo[ 1 ];
        sign = sign || "+";
        if (signInfo[2]) {
          ret = parseFloat(sign + num);
          return  _throwNaNException(ret, options, numberSettings, errStr);
        }
        // remove spaces: leading, trailing and between - and number. 
        // Used for negative currency pt-BR

        num = num.replace(/ /g, "");
        // determine exponent and number
        var exponentSymbol = numberSettings['exponential'];
        var exponent,
          intAndFraction,
          exponentPos = num.indexOf(exponentSymbol.toLowerCase());
        if (exponentPos < 0)
          exponentPos = num.indexOf(
            OraI18nUtils.toUpper(exponentSymbol));
        if (exponentPos < 0) {
          intAndFraction = num;
          exponent = null;
        }
        else {
          intAndFraction = num.substr(0, exponentPos);
          exponent = num.substr(exponentPos + exponentSymbol.length);
        }
        // determine decimal position
        var integer,
          fraction,
          decSep = decimalSeparator,
          decimalPos = intAndFraction.indexOf(decSep);
        if (decimalPos < 0) {
          integer = intAndFraction;
          fraction = null;
        }
        else {
          integer = intAndFraction.substr(0, decimalPos);
          fraction = intAndFraction.substr(decimalPos + decSep.length);
        }
        // handle groups (e.g. 1,000,000)
        var groupSep = groupingSeparator;
        integer = integer.split(groupSep).join("");
        var altGroupSep = groupSep.replace(/\u00A0/g, " ");
        if (groupSep !== altGroupSep) {
          integer = integer.split(altGroupSep).join("");
        }
        // build a natively parsable number string
        var p = sign + integer;
        if (fraction !== null) {
          p += "." + fraction;
        }
        if (exponent !== null) {
          // exponent itself may have a number pattern
          var expSignInfo = _parseNegativeExponent(exponent, localeElementsMainNode,
            numberSettings);
          p += "e" + (expSignInfo[0] || "+") + expSignInfo[ 1 ];
        }
        if (_REGEX_PARSE_FLOAT.test(p)) {
          ret = parseFloat(p);
        }
        else {
          p = _lenientParseNumber(str, numberSettings, localeElementsMainNode);
          ret = parseFloat(p[0] + p[1]);
        }
        return  _throwNaNException(ret, options, numberSettings, errStr);
      },
      /**
       * Resolve options.
       * Returns a new object with properties reflecting the number formatting 
       * options computed based on the options parameter.
       * If options is not provided, the properties will be derived from the 
       * locale defaults.
       * @memberOf OraNumberConverter
       * @param {Object} localeElements - the instance of LocaleElements 
       * bundle
       * @param {Object=} options containing the following properties:<br>
       * - <b>style.</b> "decimal", "currency" or "percent". The default is 
       * "decimal".<br>
       * - <b>currency.</b> An ISO 4217 alphabetic currency code. Mandatory 
       * when when style is "currency".<br>
       * - <b>currencyDisplay.</b> is one of the String values "code", 
       * "symbol", or "name", specifying whether to display the currency as 
       * an ISO 4217 alphabetic currency code,
       *   a localized currency symbol, or a localized currency name if 
       *   formatting with the "currency" style. It is only present 
       *   when style has the value "currency". The default is "symbol".<br>
       * - <b>minimumIntegerDigits.</b> is a non-negative integer Number value 
       * indicating the minimum integer digits to be used. Numbers will be 
       * padded with leading zeroes if necessary.<br>
       * - <b>minimumFractionDigits.</b> a non-negative integer Number value 
       * indicating the minimum fraction digits to be used. Numbers will be 
       * padded with trailing zeroes if necessary.<br>
       * - <b>maximumFractionDigits.</b> a non-negative integer Number value 
       * indicating the maximum fraction digits to be used. Numbers will be 
       * rounded if necessary.<br>
       * - <b>numberingSystem</b>. The numbering system.
       * - <b>useGrouping.</b> is a Boolean value indicating whether a 
       * grouping separator should be used. The default is true.<br>
       * - <b>pattern.</b> custom pattern. Will override above options when 
       * present.<br>
       * @param {string=} locale - A BCP47 compliant language tag. it is only 
       * used to extract the unicode extension keys. 
       * @return {Object} Resolved options object.
       * @throws {RangeError} If a property value of the options parameter is 
       * out of range.
       * @throws {TypeError} If the style is currency and currency code is 
       * missing. 
       */
      resolvedOptions: function (localeElements, options, locale) {
        if (arguments.length < 3 || locale === undefined) {
          locale = OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
        }
        if (arguments.length < 2 || options === undefined) {
          options = {
            'useGrouping': true,
            'style': 'decimal'
          };
        }
        var numberSettings = {};
        _validateNumberOptions(options, "OraNumberConverter.resolvedOptions");
        _getNumberSettings(localeElements, numberSettings, options, locale);
        numberSettings['numberingSystemKey'] = OraI18nUtils.getLanguageExtension(locale,
          "nu");
        if (OraI18nUtils.numeringSystems[numberSettings['numberingSystemKey']] ===
          undefined)
          numberSettings['numberingSystemKey'] = 'latn';
        var resOptions = {
          'locale': locale,
          'style': (options['style'] === undefined) ? 'decimal' :
            options['style'],
          'useGrouping': (options['useGrouping'] === undefined) ? true :
            options['useGrouping'],
          'minimumIntegerDigits': numberSettings['minimumIntegerDigits'],
          'minimumFractionDigits': numberSettings['minimumFractionDigits'],
          'maximumFractionDigits': numberSettings['maximumFractionDigits'],
          'numberingSystem': numberSettings['numberingSystemKey']
        };
        if (options['style'] === 'decimal' && options['decimalFormat'] !== undefined) {
          resOptions['decimalFormat'] = options['decimalFormat'];
        }
        if (options['style'] === 'currency') {
          resOptions['currency'] = options['currency'];
          resOptions['currencyDisplay'] = (options['currencyDisplay'] ===
            undefined) ? 'symbol' : options['currencyDisplay'];
        }
        if (options['pattern'] !== undefined)
          resOptions['pattern'] = options['pattern'];
        return resOptions;
      }
    };
  }

  return {
    /**
     * getInstance.
     * Returns the singleton instance of OraNumberConverter class.  
     * @memberOf OraNumberConverter
     * @return {Object} The singleton OraNumberConverter instance.
     */
    getInstance: function () {
      if (!instance) {
        instance = _init();
      }
      return instance;
    }
  };
}());
/**
 * Copyright (c) 2008, 2013, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Constructs a RegExpValidator that ensures the value matches the provided pattern
 * @param {Object} options an object literal used to provide the pattern, an optional hint and error 
 * message.
 * @param {RegExp=} options.pattern - a regexp pattern that the validator matches a value against.<p>
 * Example:<br/>
 * '\\d{10}'
 * @param {string=} options.hint - an optional hint text. There is no default hint provided by the 
 * validator. It is generally not recommended to show the actual pattern in the hint as it might be 
 * confusing to end-user.<p>
 * Tokens: <br/>
 * {pattern} - the pattern to enforce<p>
 * Example:<br/>
 * "value must meet this pattern {pattern}" 
 * @param {string=} options.messageSummary - a custom error message summarizing the error when the 
 * users input does not match the specified pattern. When not present, the default summary is the 
 * resource defined with the key <code class="prettyprint">oj-validator.regExp.summary</code>. 
 * It is generally not recommended to show the actual pattern in the message as it might be 
 *  confusing to end-user. <p>
 * Tokens: <p>
 * {label} - label of the component for which this message applies. The label may not always be 
 * available depending on the usage of the validator. <br/>
 * {pattern} - the pattern the value should match<br/>
 * {value} - value entered by user<p>
 * Examples:<br/>
 * "'{label}' Format Incorrect" // translating to 'Phone Number' Format Incorrect
 * @param {string=} options.messageDetail - a custom error message to be used for creating detail 
 * part of message, when the users input does not match the specified pattern. When not present, the 
 * default detail message is the resource defined with the key 
 * <code class="prettyprint">oj-validator.regExp.detail</code>.<p>
 * Tokens:<br/>
 * {label} - label text of the component for which this message applies. <br/>
 * {pattern} the 'pattern' that the value should match <br/>
 * {value} value entered by the user <p>
 * Examples:<br/>
 * "The value {value} must contain at least 3 alphanumeric characters"<br/>
 * @export
 * @constructor
 * @since 0.6
*/
oj.RegExpValidator = function(options) 
{
  this.Init(options);
};

// Subclass from oj.Object or oj.Validator. It does not matter
oj.Object.createSubclass(oj.RegExpValidator, oj.Validator, "oj.RegExpValidator");

// key to access required validator specific resources in the bundle 
oj.RegExpValidator._BUNDLE_KEY_DETAIL = "oj-validator.regExp.detail";
oj.RegExpValidator._BUNDLE_KEY_SUMMARY = "oj-validator.regExp.summary";

/**
 * Initializes validator instance with the set options
 * @param {Object} options
 * @memberof oj.RegExpValidator
 * @instance
 * @export
 */
oj.RegExpValidator.prototype.Init = function(options) 
{
  oj.RegExpValidator.superclass.Init.call(this);
  this._options = options;
};

/**
 * Validates value for matches using the regular expression provided by the pattern. This method 
 * does not raise error when value is empty string or null, then this method returns.
 * 
 * @param {string|number} value that is being validated 
 * @returns {boolean} true if validation was successful 
 * 
 * @throws {Error} when there is no match
 * @memberof oj.RegExpValidator
 * @instance
 * @export
 */
oj.RegExpValidator.prototype.validate = function(value)
{
  var pattern = (this._options && this._options['pattern']) || "", label, summary, detail, params;
  
  // don't validate null or empty string; per 
  if (value === null || value === undefined || value === "")
  {
    return true;
  }
  
  // when using digits as input values parseString becomes a integer type, so get away with it.
  value = value ? value.toString() : value;
  
  // We intend that the pattern provided is matched exactly
  var exactPattern = "^(" + pattern + ")$", valid = false, 
          localizedDetail, localizedSummary, matchArr;
  
  matchArr = value.match(exactPattern);
  if ((matchArr !== null) && (matchArr[0] === value))
  {
    valid = true;
  }
  else
  {
    if (this._options)
    {
      summary = this._options['messageSummary'] || null;
      detail = this._options['messageDetail'] || null;
      label = this._options && this._options['label'] || "";
    }
    
    params = {'label': label, 'pattern': pattern, 'value': value};
    localizedSummary = summary ? 
      oj.Translations.applyParameters(summary, params) : 
      oj.Translations.getTranslatedString(this._getSummaryKey(), params);
    localizedDetail = (detail) ? 
      oj.Translations.applyParameters(detail, params) : 
      oj.Translations.getTranslatedString(this._getDetailKey(), params);
    
    throw new oj.ValidatorError(localizedSummary, localizedDetail);
  }
  
  return valid;
};

/**
 * A message to be used as hint, when giving a hint on the expected pattern. There is no default 
 * hint for this property.
 * 
 * @returns {String|null} a hint message or null if no hint is available in the options
 * @memberof oj.RegExpValidator
 * @instance
 * @export
 */
oj.RegExpValidator.prototype.getHint = function()
{
  var hint = null, params = {};
  if (this._options && (this._options['hint']))
  {
    params = {'pattern': this._options['pattern']};
    hint = oj.Translations.applyParameters(this._options['hint'], params);
  }
  
  return hint;
};

oj.RegExpValidator.prototype._getSummaryKey = function ()
{
  return oj.RegExpValidator._BUNDLE_KEY_SUMMARY;
};

oj.RegExpValidator.prototype._getDetailKey = function ()
{
  return oj.RegExpValidator._BUNDLE_KEY_DETAIL;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @export
 * @class oj.IntlConverterUtils
 * @classdesc Utility function for converters 
 * @since 0.7
 */
oj.IntlConverterUtils = {};

/**
 * Returns a local Date object provided a local isoString
 * 
 * @param {string} isoString date in isoString format
 * @returns {Date} localDate 
 * @expose
 * @since 0.7
 */
oj.IntlConverterUtils.isoToLocalDate = function(isoString) 
{
  return OraI18nUtils.isoToLocalDate(isoString);
}

/**
 * Returns a local isoString provided a Date object
 * 
 * @param {Date} date
 * @returns {string} isoString 
 * @expose
 * @since 0.7
 */
oj.IntlConverterUtils.dateToLocalIso = function(date) 
{
  return OraI18nUtils.dateToLocalIso(date);
}

/**
 * Returns a Date object provided an isoString ignoring the timezone
 * 
 * @param {string} isoString date in isoString format
 * @returns {Date} date ignoring the timezeon
 * @expose
 * @ignore
 * @since 0.7
 */
oj.IntlConverterUtils._isoToLocalDateIgnoreTimezone = function(isoString) 
{
  return OraI18nUtils._isoToLocalDateIgnoreTimezone(isoString);
}

oj.IntlConverterUtils._getTimeZone = function(isoString) 
{
  return OraI18nUtils._getTimeZone(isoString);
}

/**
 * Given either an Object literal representing a 'converter' option (used in components) or a 
 * converter instance of type oj.Converter, this method returns the converter instance.
 * 
 * @param {Object} converterOption
 * @returns {Object} converterInstance or null if a converter cannot be determined
 * @expose
 * @since 0.6
 */
oj.IntlConverterUtils.getConverterInstance = function (converterOption)
{
  var cTypeStr = "", cOptions = {}, converterInstance = null, cf;
  
  if (converterOption)
  {
    if (typeof converterOption === "object")
    {
      // TODO: Should we check that it duck types oj.Converter?
      if (converterOption instanceof oj.Converter || 
          (converterOption['parse'] && typeof converterOption['parse'] === "function") || 
          (converterOption['format'] && typeof converterOption['format'] === "function"))
      {
        // we are dealing with a converter instance
        converterInstance = converterOption;
      }
      else 
      {
        // check if there is a type set
        cTypeStr = converterOption['type'];
        cOptions = converterOption['options'] || {};
      }
    }

    if (!converterInstance)
    {
      // either we have an object literal or just plain string.
      cTypeStr = cTypeStr || converterOption;
      if (cTypeStr && typeof cTypeStr === "string")
      {
        // if we are passed a string get registered type. 
        cf = oj.Validation.converterFactory(cTypeStr);
        converterInstance = cf.createConverter(cOptions);
      }
    }
  }
  
  return converterInstance;
};

/**
 * So the requirement is if min or max lacks date portion and value contains it, then min + max should use 
 * value's date portion
 * 
 * @param {string} minMax date in isoString format
 * @param {string} value date in isoString format
 * @returns {string} merged date in isoString format
 * @expose
 * @ignore
 * @since 1.2
 */
oj.IntlConverterUtils._minMaxIsoString = function(minMax, value) 
{
  if(minMax) 
  {
    value = value || this.dateToLocalIso(new Date());
    
    var vTindex = value.indexOf("T");

    if(minMax.indexOf("T") === 0 && vTindex > 0) 
    {
      //meaning only time exists for minMax and value contains date
      minMax = value.substring(0, vTindex) + minMax;
    }
  }
  
  return minMax;
};

// PACKAGE PRIVATE

/**
 * Processes an converter option error and returns a oj.ConverterERror instance.
 * @param {string} errorCode
 * @param {Object} parameterMap
 * @return {Object} an oj.ConverterError instance
 * @private
 */
oj.IntlConverterUtils.__getConverterOptionError = function(errorCode, parameterMap)
{
  oj.Assert.assertObject(parameterMap);
  var summary = "", detail = "", propName = parameterMap['propertyName'], reqPropName, 
          propValueValid;
  
  if (errorCode === "optionTypesMismatch")
  {
    reqPropName = parameterMap['requiredPropertyName'];
    propValueValid = parameterMap['requiredPropertyValueValid'];
    // Summary: A value for the property '{requiredPropertyName}' is required when the property 
    // '{propertyName}' is set to '{propertyValue}'.
    summary = oj.Translations.getTranslatedString("oj-converter.optionTypesMismatch.summary", 
      {'propertyName': propName,
       'propertyValue': parameterMap['propertyValue'],
       'requiredPropertyName': reqPropName});

    detail = oj.IntlConverterUtils._getOptionValueDetailMessage(reqPropName, propValueValid);
  }
  else if (errorCode === "optionTypeInvalid")
  {
    // Summary: A value of the expected type was not provided for '{propertyName}'.
    propName = parameterMap['propertyName'];
    propValueValid = parameterMap['propertyValueValid'];
    summary = oj.Translations.getTranslatedString("oj-converter.optionTypeInvalid.summary", 
      {'propertyName': propName});

    detail = oj.IntlConverterUtils._getOptionValueDetailMessage(propName, propValueValid);
  }
  else if (errorCode === "optionOutOfRange")
  {
    // The value {propertyValue} is out of range for the option '{propertyName}'.
    summary = oj.Translations.getTranslatedString("oj-converter.optionOutOfRange.summary", 
      {'propertyName': propName,
       'propertyValue': parameterMap['propertyValue']});

    propValueValid = parameterMap['propertyValueValid'];
    detail = oj.IntlConverterUtils._getOptionValueDetailMessage(propName, propValueValid);
  }
  else if (errorCode === "optionValueInvalid")
  {
    // An invalid value '{propertyValue}' was specified for the option '{propertyName}'.. 
    summary = oj.Translations.getTranslatedString("oj-converter.optionValueInvalid.summary", 
      {'propertyName': propName,
       'propertyValue': parameterMap['propertyValue']});
    
    propValueValid = parameterMap['propertyValueHint'];
    detail = oj.IntlConverterUtils._getOptionValueDetailMessage(propName, propValueValid);
  }
  
  return new oj.ConverterError(summary, detail);

};


/**
 * Builds the detail message for possible converter option values. Only applicable when errorInfo is 
 * returned from JET converter implementation.
 * 
 * @param {string} propName name of the property 
 * @param {Array|string} propValueValid valid value or values expected.
 * 
 * @return {string} the localized message
 * @private
 */
oj.IntlConverterUtils._getOptionValueDetailMessage = function (propName, propValueValid)
{
  // Detail: An accepted value for '{propertyName}' is '{propertyValueValid}'. or 
  // Accepted values for '{propertyName}' are '{propertyValueValid}'.
  var resourceKey;
  
  if (propValueValid)
  {
    if (typeof propValueValid === "string")
    {
      resourceKey = "oj-converter.optionHint.detail";
    }
    else
    {
      // we have an array of values
      resourceKey = "oj-converter.optionHint.detail-plural";
      propValueValid = 
         propValueValid.join(oj.Translations.getTranslatedString("oj-converter.plural-separator"));
    }
    return oj.Translations.getTranslatedString(resourceKey, 
      {'propertyName': propName,
       'propertyValueValid': propValueValid});

  }
  
  return "";
};

/**
 * Returns the default value for non-truthy values.
 * 
 * @returns {string} an empty string
 * @private
 */
oj.IntlConverterUtils.__getNullFormattedValue = function ()
{
  return "";
};

/**
 * @ignore
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * This is a forked version of globalize.js
 */
/*
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */

/*
   DESCRIPTION
   OraDateTimeConverter object implements date-time parsing and formatting and 
   relative date formatting. It supports ECMA-402 options, predefined and user 
   defined pattern.

   PRIVATE CLASSES
    <list of private classes defined - with one-line descriptions>

   NOTES
    <other useful comments, qualifications, etc.>

 */

/*
 *OraDateTimeConverter object implements date-time parsing and formatting and 
 *relative date formatting.It supports ECMA-402 options, predefined and user 
 *defined pattern.
 * <p>The format and parse functions can throw the following exceptions:
 * <li> RangeError can be thrown during the validation of the options:
 * Example: The value 'longs' is out of range for 'OraDateTimeConverter.parse'
 * options property 'year'. Expected: ['2-digit', 'numeric']<br>
 * var errorInfo = {<br>
 *   'errorCode' : "datetimeOutOfRange",<br>
 *   'parameterMap' : {<br>
 *   'propertyName': $property$,<br>
 *   'propertyValue': $options.property$,<br>
 *   'propertyValueValid': $expectedValues$,<br>
 *   'caller': $_getOptionCaller$<br>
 * }<br>
 * };<br>
 * <br>
 * <li>SyntaxError can be thrown when the date format is invalid. it can happen
 * during the calls to parse and format date.<br>
 * Example: Unexpected character(s) encountered in the pattern "MM/dd/cc".<br>
 * An example of a valid pattern is "MM/dd/y".<br>
 * var errorInfo = {<br>
 * 'errorCode' : "optionValueInvalid",<br> 
 * parameterMap : {'propertyName' : 'pattern',<br>
 *                 'propertyValue': $options.pattern$,<br>
 *                 'propertyValueHint': $format$}<br>
 * };<br>
 * <br>
 * <br>
 * <li>Error can be thrown when there is mismatch between date format and
 * date string. it can happen during the calls to parse date.<br>
 * Example: The value "03,05,12" does not match the expected date format
 * "MM/dd/yy"<br>
 * var errorInfo = {'errorCode' : "datetimeFormatMismatch", 'parameterMap' : 
 * { 'value': $value$,  'format': $format$}};<br>
 * errorInfo = {'errorCode' : "timeFormatMismatch", 'parameterMap' : 
 * { 'value': $value$,  'format': $format$}};<br>
 * verrorInfo = {'errorCode' : "dateFormatMismatch", 'parameterMap' : 
 * { 'value': $value$,  'format': $format$}};<br>
 * <br>
 * <br>
 * <li>RangeError can be thrown if one of the date fields is out of range.
 * It can happen during the calls to parse date.<br>
 * Example: 64  is out of range.  Enter a value between 0 and 59 for minute 
 * var errorInfo = {<br>
 * 'errorCode' : "datetimeOutOfRange",<br>
 * 'parameterMap' : {'value': $value$, 'minValue': $mainValue$,
 * 'maxVlaue': $maxValue$, 'propertyName': $name$}<br>
 * };<br>
 * <br>
 * <br>
 * <li>Error can be thrown the weekday does not match the date.
 * It can happen during the calls to parse date.<br>
 * Example: The weekday Tuesday does not match the date 27.
 * var errorInfo = {<br>
 * 'errorCode' : "dateToWeekdayMismatch",<br>
 * 'parameterMap' : {'weekday' : $weekday$, 'date':$date$}<br>
 * };<br>
 * <br>
 * <br>
 * <li>Error can be thrown if an invalid ISO string is provided.<br>
 * Example: "The string 2014.01T1 is not a valid ISO 8601 string."
 * var errorInfo = {<br>
 * 'errorCode' : "invalidISOString",<br>
 * 'parameterMap' : {'isoStr' : str}<br>
 * };<br>
 * <br>
 * <br>
 * <li>Error can be thrown if the ISO string contain a time zone.<br>
 * Example: "time zone is not supported."
 * var errorInfo = {<br>
 * 'errorCode' : "timeZoneNotSupported"<br>
 * };<br>
 */

/**
 * @ignore
 */
var OraDateTimeConverter;
  
OraDateTimeConverter =  (function() {

  var
  _appendPreOrPostMatch,
  _expandFormat,
  _parseExact,
  _formatImpl,
  _parseImpl,
  _formatRelativeImpl,
  _throwInvalidDateFormat,
  _getResolvedOptionsFromPattern,
  _dateTimeStyle,
  _get2DigitYearStart,
  _isHour12,
  _dateTimeStyleFromPattern,
  _expandPredefinedStylesFormat,
  _localeDataCache = {},
  _isLeapYear, _getDaysInMonth, instance,
  _toAvailableFormatsKeys,
  _expandAvailableDateFormatsPattern,
  _expandAvailableTimeFormatsPattern,
  _basicFormatMatcher,
  _appendToKey,
  _getDaysDif, _getDayIndex,
  _isSameYear, _isNextYear, _isPrevYear,
  _isSameMonth, _isNextMonth, _isPrevMonth,
  _isSameWeek, _isNextWeek, _isPrevWeek,
  _isSameDay, _isNextDay, _isPrevDay,
  _expandYear,
  _getTokenIndex,
  _parseLenient,
  _parseLenientyMEd,
  _parseLenientyMMMEd,
  _parseLenienthms,
  _getDayIndex1,
  _getMonthIndex,
  _getParseRegExp,
  _validateRange,
  _arrayIndexOfDay,
  _arrayIndexOfMonth,
  _throwDateFormatMismatch, _getPatternFromSingleToken,
  _throwWeekdayMismatch, _createParseISOString,
  _getTimePart, _getNameIndex, _getWeekdayName;

  var _YEAR_AND_DATE_REGEXP = /(\d{1,4})\D+?(\d{1,4})/g;
  var _YMD_REGEXP = /(\d{1,4})\D+?(\d{1,4})\D+?(\d{1,4})/g;
  var _MONTH_REGEXP_FMT =/^[M][^M]|[^M]M[^M]/g;
  var _MONTH_REGEXP_STD =/^[L][^L]|[^L]L[^L]/g;
  var _DAY_REGEXP =/^[d][^d]|[^d]d[^d]/g;
  var _HOUR_REGEXP=/(?:^|[^h])h[^h]|[^H]H[^H]|[^k]k[^k]|[^K]K[^K]/;
  var _TIME_REGEXP = /(\d{1,2})(?:\D+?(\d{1,2}))?(?:\D+?(\d{1,2}))?(?:\D+?(\d{1,3}))?/g;
  var _TIME_FORMAT_REGEXP= /h|H|K|k/g;
  var _ESCAPE_REGEXP = /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g;
  var _TOKEN_REGEXP = /ccccc|cccc|ccc|cc|c|EEEEE|EEEE|EEE|EE|E|dd|d|MMMMM|MMMM|MMM|MM|M|LLLLL|LLLL|LLL|LL|L|yyyy|yy|y|hh|h|HH|H|KK|K|kk|k|mm|m|ss|s|aa|a|SSS|SS|S|zzzz|zzz|zz|z|GGGGG|GGGG|GGG|GG|G/g;
  var _TIME_FORMATS_Z_TOKENS = /\s?(?:\(|\[)??z{1,4}(?:\)|\])?/g;
  var _DAYS_INDEXES = {
    0: "sun", 
    1: "mon", 
    2: "tue", 
    3: "wed", 
    4: "thu", 
    5: "fri", 
    6: "sat"
  };


  var _ALNUM_REGEXP = '(\\D+|\\d\\d?\\D|\\d\\d?|\\D+\\d\\d?)',
  _NON_DIGIT_REGEXP ='(\\D+|\\D+\\d\\d?)',
  _NON_DIGIT_OPT_REGEXP = '(\\D*)',
  _TWO_DIGITS_REGEXP = '(\\d\\d?)',
  _THREE_DIGITS_REGEXP = '(\\d{1,3})',
  _FOUR_DIGITS_REGEXP = '(\\d{1,4})',
  _TZ_REGEXP = '([+-]?\\d{1,4})',
  _SLASH_REGEXP = '(\\/)';
  
  var _PROPERTIES_MAP = {
    'MMM' : {
      'token' : 'months',
      'style' : 'format',
      'mLen' : 'abbreviated',
      'matchIndex': 0,
      'key' : 'month',
      'value' : 'short',
      'regExp' : _ALNUM_REGEXP
    },
    'MMMM' : {
      'token' : 'months',
      'style' : 'format',
      'mLen' : 'wide',
      'matchIndex': 0,
      'key' : 'month',
      'value' : 'long',
      'regExp' : _ALNUM_REGEXP
    },
    'MMMMM' : {
      'token' : 'months',
      'style' : 'format',
      'mLen' : 'narrow',
      'matchIndex': 0,
      'key' : 'month',
      'value' : 'narrow',
      'regExp' : _ALNUM_REGEXP
    },
    'LLL' : {
      'token' : 'months',
      'style' : 'stand-alone',
      'mLen' : 'abbreviated',
      'matchIndex': 1,
      'key' : 'month',
      'value' : 'short',
      'regExp' : _ALNUM_REGEXP
    },
    'LLLL' : {
      'token' : 'months',
      'style' : 'stand-alone',
      'mLen' : 'wide',
      'matchIndex': 1,
      'key' : 'month',
      'value' : 'long',
      'regExp' : _ALNUM_REGEXP
    },
    'LLLLL' : {
      'token' : 'months',
      'style' : 'stand-alone',
      'mLen' : 'narrow',
      'matchIndex': 1,
      'key' : 'month',
      'value' : 'narrow',
      'regExp' : _ALNUM_REGEXP
    },
    'E' : {
      'token' : 'days',
      'style' : 'format',
      'dLen' : 'abbreviated',
      'matchIndex': 0,
      'key' : 'weekday',
      'value' : 'short',
      'regExp' : _NON_DIGIT_REGEXP
    },
    'EE' : {
      'token' : 'days',
      'style' : 'format',
      'dLen' : 'abbreviated',
      'matchIndex': 0,
      'key' : 'weekday',
      'value' : 'short',
      'regExp' : _NON_DIGIT_REGEXP
    },
    'EEE' : {
      'token' : 'days',
      'style' : 'format',
      'dLen' : 'abbreviated',
      'matchIndex': 0,
      'key' : 'weekday',
      'value' : 'short',
      'regExp' : _NON_DIGIT_REGEXP
    },
    'EEEE' : {
      'token' : 'days',
      'style' : 'format',
      'dLen' : 'wide',
      'matchIndex': 0,
      'key' : 'weekday',
      'value' : 'long',
      'regExp' : _NON_DIGIT_REGEXP
    },
    'EEEEE' : {
      'token' : 'days',
      'style' : 'format',
      'dLen' : 'narrow',
      'matchIndex': 0,
      'key' : 'weekday',
      'value' : 'narrow',
      'regExp' : _NON_DIGIT_REGEXP
    },
    'c' : {
      'token' : 'days',
      'style' : 'stand-alone',
      'dLen' : 'abbreviated',
      'matchIndex': 1,
      'key' : 'weekday',
      'value' : 'short',
      'regExp' : _NON_DIGIT_REGEXP
    },
    'cc' : {
      'token' : 'days',
      'style' : 'stand-alone',
      'dLen' : 'abbreviated',
      'matchIndex': 1,
      'key' : 'weekday',
      'value' : 'short',
      'regExp' : _NON_DIGIT_REGEXP
    },
    'ccc' : {
      'token' : 'days',
      'style' : 'stand-alone',
      'dLen' : 'abbreviated',
      'matchIndex': 1,
      'key' : 'weekday',
      'value' : 'short',
      'regExp' : _NON_DIGIT_REGEXP
    },
    'cccc' : {
      'token' : 'days',
      'style' : 'stand-alone',
      'dLen' : 'wide',
      'matchIndex': 1,
      'key' : 'weekday',
      'value' : 'long',
      'regExp' : _NON_DIGIT_REGEXP
    },
    'ccccc' : {
      'token' : 'days',
      'style' : 'stand-alone',
      'dLen' : 'narrow',
      'matchIndex': 1,
      'key' : 'weekday',
      'value' : 'narrow',
      'regExp' : _NON_DIGIT_REGEXP
    },
    'h' : {
      'token' : 'time',
      'timePart' : 'hour',
      'start1' : 0,
      'end1' : 11,
      'start2' : 1,
      'end2' : 12,
      'key' : 'hour',
      'value' : 'numeric',
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'hh' : {
      'token' : 'time',
      'timePart' : 'hour',
      'start1' : 0,
      'end1' : 11,
      'start2' : 1,
      'end2' : 12,
      'key' : 'hour',
      'value' : '2-digit',
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'K' : {
      'token' : 'time',
      'timePart' : 'hour',
      'start1' : 0,
      'end1' : 11,
      'start2' : 0,
      'end2' : 11,
      'key' : 'hour',
      'value' : 'numeric',
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'KK' : {
      'token' : 'time',
      'timePart' : 'hour',
      'start1' : 0,
      'end1' : 11,
      'start2' : 0,
      'end2' : 11,
      'key' : 'hour',
      'value' : '2-digit',
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'H' : {
      'token' : 'time',
      'timePart' : 'hour',
      'start1' : 0,
      'end1' : 23,
      'start2' : 0,
      'end2' : 23,
      'key' : 'hour',
      'value' : 'numeric',
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'HH' : {
      'token' : 'time',
      'timePart' : 'hour',
      'start1' : 0,
      'end1' : 23,
      'start2' : 0,
      'end2' : 23,
      'key' : 'hour',
      'value' : '2-digit',
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'k' : {
      'token' : 'time',
      'timePart' : 'hour',
      'start1' : 0,
      'end1' : 23,
      'start2' : 1,
      'end2' : 24,
      'key' : 'hour',
      'value' : 'numeric',
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'kk' : {
      'token' : 'time',
      'timePart' : 'hour',
      'start1' : 0,
      'end1' : 23,
      'start2' : 1,
      'end2' : 24,
      'key' : 'hour',
      'value' : '2-digit',
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'm' : {
      'token' : 'time',
      'timePart' : 'minute',
      'start1' : 0,
      'end1' : 59,
      'start2' : 0,
      'end2' : 59,
      'key' : 'minute',
      'value' : 'numeric',
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'mm' : {
      'token' : 'time',
      'timePart' : 'minute',
      'start1' : 0,
      'end1' : 59,
      'start2' : 0,
      'end2' : 59,
      'key' : 'minute',
      'value' : '2-digit',
      'regExp' : _TWO_DIGITS_REGEXP
    },
    's' : {
      'token' : 'time',
      'timePart' : 'second',
      'start1' : 0,
      'end1' : 59,
      'start2' : 0,
      'end2' : 59,
      'key' : 'second',
      'value' : 'numeric',
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'ss' : {
      'token' : 'time',
      'timePart' : 'second',
      'start1' : 0,
      'end1' : 59,
      'start2' : 0,
      'end2' : 59,
      'key' : 'second',
      'value' : '2-digit',
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'S' : {
      'token' : 'time',
      'timePart' : 'millisec',
      'start1' : 0,
      'end1' : 999,
      'start2' : 0,
      'end2' : 999,
      'key' : 'millisecond',
      'value' : 'numeric',
      'regExp' : _THREE_DIGITS_REGEXP
    },
    'SS' : {
      'token' : 'time',
      'timePart' : 'millisec',
      'start1' : 0,
      'end1' : 999,
      'start2' : 0,
      'end2' : 999,
      'key' : 'millisecond',
      'value' : 'numeric',
      'regExp' : _THREE_DIGITS_REGEXP
    },
    'SSS' : {
      'token' : 'time',
      'timePart' : 'millisec',
      'start1' : 0,
      'end1' : 999,
      'start2' : 0,
      'end2' : 999,
      'key' : 'millisecond',
      'value' : 'numeric',
      'regExp' : _THREE_DIGITS_REGEXP
    },
    'd' : {
      'token' : 'dayOfMonth',
      'key' : 'day',
      'value' : 'numeric',
      'getPartIdx' : 2,
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'dd' : {
      'token' : 'dayOfMonth',
      'key' : 'day',
      'value' : '2-digit',
      'getPartIdx' : 2,
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'M' : {
      'token' : 'monthIndex',
      'key' : 'month',
      'value' : 'numeric',
      'getPartIdx' : 1,
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'MM' : {
      'token' : 'monthIndex',
      'key' : 'month',
      'value' : '2-digit',
      'getPartIdx' : 1,
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'L' : {
      'token' : 'monthIndex',
      'key' : 'month',
      'value' : 'numeric',
      'getPartIdx' : 1,
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'LL' : {
      'token' : 'monthIndex',
      'key' : 'month',
      'value' : '2-digit',
      'getPartIdx' : 1,
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'y' : {
      'token' : 'year',
      'key' : 'year',
      'value' : 'numeric',
      'regExp' : _FOUR_DIGITS_REGEXP
    },
    'yy' : {
      'token' : 'year',
      'key' : 'year',
      'value' : '2-digit',
      'regExp' : _TWO_DIGITS_REGEXP
    },
    'yyyy' : {
      'token' : 'year',
      'key' : 'year',
      'value' : 'numeric',
      'regExp' : _FOUR_DIGITS_REGEXP
    },
    'a' : {
      'token' : 'ampm',
      'key' : 'hour12',
      'value' : true,
      'regExp' : _NON_DIGIT_OPT_REGEXP
    },
    'z' : {
      'token' : 'tz',
      'key' : 'timeZoneName',
      'value' : 'short',
      'regExp' : _TZ_REGEXP
    },
    'zz' : {
      'token' : 'tz',
      'key' : 'timeZoneName',
      'value' : 'short',
      'regExp' : _TZ_REGEXP
    },
    'zzz' : {
      'token' : 'tz',
      'key' : 'timeZoneName',
      'value' : 'short',
      'regExp' : _TZ_REGEXP
    },
    'zzzz' : {
      'token' : 'tz',
      'key' : 'timeZoneName',
      'value' : 'long',
      'regExp' : _TZ_REGEXP
    },
    'G' : {
      'token' : 'era',
      'key' : 'era',
      'value' : 'short',
      'regExp' : _NON_DIGIT_REGEXP
    },
    'GG' : {
      'token' : 'era',
      'key' : 'era',
      'value' : 'short',
      'regExp' : _NON_DIGIT_REGEXP
    },
    'GGG' : {
      'token' : 'era',
      'key' : 'era',
      'value' : 'short',
      'regExp' : _NON_DIGIT_REGEXP
    },
    'GGGG' : {
      'token' : 'era',
      'key' : 'era',
      'value' : 'long',
      'regExp' : _NON_DIGIT_REGEXP
    },
    'GGGGG' : {
      'token' : 'era',
      'key' : 'era',
      'value' : 'narrow',
      'regExp' : _NON_DIGIT_REGEXP
    },
    '/' : {
      'token' : 'slash',
      'regExp' : _SLASH_REGEXP
    }
  };

  /*
   *Helper functions
   */
  _get2DigitYearStart = function(options) {
    var option = options['two-digit-year-start'];
    if(option === undefined || isNaN(option))
      option = 1950;
    option = parseInt(option, 10);
    return option;
  };
    
  //Each locale has 12 or 24 hour preferred format
  _isHour12 = function(localeElements) {
    var mainNode = OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
    var bcp47Keys = OraI18nUtils.parseBCP47(mainNode);
    var territory = bcp47Keys['region'] || '001';
    var prefferedHours = localeElements['supplemental']['prefferedHours'];
    var hour12 = prefferedHours[territory];
    return hour12 === 'h';      
  };
    
  _isLeapYear = function(y) {
    if (y % 400 == 0)
      return true;
    else if (y % 100 == 0)
      return false;
    else if (y % 4 == 0)
      return true;
    else
      return false;
  };
    
  _getDaysInMonth = function(y, m) {
    switch (m) {
      case 0 :
      case 2 :
      case 4 :
      case 6 :
      case 7 :
      case 9 :
      case 11 :
        return 31;
      case 1:
        if(_isLeapYear(y))
          return 29;
        else
          return 28;
      default:
        return 30;
    }
  };

  //returns the locale's pattern from the predefined styles.
  //EX: for en-US dateFormat:"full" returns the pattern "EEEE, MMMM d, y".
  _expandPredefinedStylesFormat = function(options, localeElements, caller) {
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var getOption = OraI18nUtils.getGetOption(options, caller);
    var fmtType = getOption('formatType', 'string', ['date', 'time', 
      'datetime'], 'date');
    var dStyle = getOption('dateFormat', 'string', 
      ['short', 'medium', 'long', 'full'], 'short');
    var tStyle = getOption('timeFormat', 'string', 
      ['short', 'medium', 'long', 'full'], 'short');
    var cal = mainNode['dates']['calendars']['gregorian'];
    var dateFormats = cal['dateFormats'];
    var timeFormats = cal['timeFormats'];
    
    var dStyleFmt, tStyleFmt, format;
    switch (dStyle)
    {
      case "full" :
        dStyleFmt = dateFormats['full'];
        break;
      case "long" :
        dStyleFmt = dateFormats['long'];
        break;
      case "medium" :
        dStyleFmt = dateFormats['medium'];
        break;
      case "short" :
        dStyleFmt = dateFormats['short'];
        break;
      default:
        break;
    }
    switch (tStyle)
    {
      case "full" :
        tStyleFmt = timeFormats['full'];
        break;
      case "long" :
        tStyleFmt = timeFormats['long'];
        break;
      case "medium" :
        tStyleFmt = timeFormats['medium'];
        break;
      case "short" :
        tStyleFmt = timeFormats['short'];
        break;
      default:
        break;
    }
    if(dStyleFmt !== undefined && (fmtType === "datetime" || 
      fmtType === "date"))
      format = dStyleFmt;
    if(tStyleFmt !== undefined && (fmtType === "datetime" || 
      fmtType === "time")) { 
      tStyleFmt = tStyleFmt.replace(_TIME_FORMATS_Z_TOKENS, '');
      if(format)
        format = format + " " + tStyleFmt;
      else
        format = tStyleFmt;
    }
    return format;
  };
      
  // appends pre- and post- token match strings while removing escaped 
  // characters.
  // Returns a single quote count which is used to determine if the 
  // token occurs
  // in a string literal.
  _appendPreOrPostMatch = function(preMatch, strings) {
    var quoteCount = 0,
    escaped = false;
    for (var i = 0, il = preMatch.length; i < il; i++) {
      var c = preMatch.charAt(i);
      switch (c) {
        case "\'":
          if (escaped) {
            strings.push("\'");
          }
          else {
            quoteCount++;
          }
          escaped = false;
          break;
        case "\\":
          if (escaped) {
            strings.push("\\");
          }
          escaped = !escaped;
          break;
        default:
          strings.push(c);
          escaped = false;
          break;
      }
    }
    return quoteCount;
  };
    
  //Throw an exception if date-time pattern is invalid
  _throwInvalidDateFormat = function(format, options, m) {
    var msg, error, errorInfo, samplePattern;
    var isDate = options['year'] !== undefined || options['month'] !== 
    undefined ||
    options['weekday'] !== undefined || options['day'] !== undefined;
    var isTime = options['hour'] !== undefined || options['minute'] !==
    undefined ||
    options['second'] !== undefined;
    if(isDate && isTime) {
      samplePattern = "MM/dd/yy hh:mm:ss a";
    }
    else if(isDate) {
      samplePattern = "MM/dd/yy";           
    }
    else {
      samplePattern = "hh:mm:ss a";          
    }
    msg = "Unexpected character(s) " + m + " encountered in the pattern \"" +
    format  + " An example of a valid pattern is \"" + samplePattern + '".';
    error = new SyntaxError(msg);
    errorInfo = {
      'errorCode' : 'optionValueInvalid',
      'parameterMap' : {
        'propertyName' : 'pattern',
        'propertyValue' : format,
        'propertyValueHint ': samplePattern
      }
    };
    error['errorInfo'] = errorInfo;
    throw error;
  };
    
  //implementation of basic forat matcher algorithm from ECMA spec.
  //This impelmentation takes into consideration hour12, For example if 
  //hour12=true, H entries are removed from availableFormats in order to
  //avoid wrong matching for hour.
  _basicFormatMatcher = function(dateTimeKeys, localeElements, isDate,
    hour12)
    {          
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var availableFormats = mainNode['dates']['calendars']['gregorian']
    ['dateTimeFormats']['availableFormats'];
    var dateTimeFormats = ["weekday", "era", "year", "month", "day",
    "hour", "minute", "second", "timeZoneName"];
    var values = {
      '2-digit':0, 
      'numeric':1, 
      'narrow':2, 
      'short':3, 
      'long':4
    };
 
    var removalPenalty = 120;
    var additionPenalty = 20;
    var longLessPenalty = 8;
    var longMorePenalty = 6;
    var shortLessPenalty = 6;
    var shortMorePenalty = 3;
    var bestScore = -Infinity;
    var bestFormat = undefined; 
    var match;
    var skip;
    for(var f in availableFormats) {
      skip = false;
      var format = {};
      format['pattern'] = availableFormats[f];
      var score = 0;
      while ((match = _TOKEN_REGEXP.exec(f)) !== null) {
        var m = match[0];
        if((m === 'h' || m === 'hh') && !hour12) {
          skip = true;
          continue;
        }
        else if ((m === 'H' || m === 'HH') && hour12) {
          skip = true;
          continue;
        }
        if(_PROPERTIES_MAP[m] !== undefined) {
          format[_PROPERTIES_MAP[m]['key']] = 
          _PROPERTIES_MAP[m]['value'];
        }
      }
      if(skip)
        continue;
      for(var property in dateTimeFormats) {
        var optionsProp = dateTimeKeys[dateTimeFormats[property]];
        var formatProp = format[dateTimeFormats[property]];
        if(optionsProp === undefined && formatProp !== undefined) {
          score -= additionPenalty;
        }
        else if(optionsProp !== undefined && formatProp === undefined) {
          score -= removalPenalty;
        }
        else if(optionsProp !== undefined && formatProp !== undefined){
 
          var optionsPropIndex = values[optionsProp];
          var formatPropIndex = values[formatProp];
          var delta = Math.max(Math.min(formatPropIndex - 
            optionsPropIndex, 2), -2);
          if(delta === 2) {
            score -= longMorePenalty;
          }
          else if(delta ===1 ) {
            score -= shortMorePenalty;
          }
          else if(delta === -1) {
            score -= shortLessPenalty;
          }
          else if(delta === -2) {
            score -= longLessPenalty;
          }
        }
      }
      if(score > bestScore) {
        bestScore = score;
        bestFormat = format;
      }         
    }
    if(bestFormat !== undefined) {
      return bestFormat['pattern'];
    }
    return null;
  };
      
  //Return a format key from ecma options. For example:
  //{year:"2-digit", month:"long", day:"numeric", weekday:"long"};
  //will return "yyMMMMdEEEE"
  _toAvailableFormatsKeys = function (options, localeElements, caller) {
    var dateKey = '', timeKey = '';
    var dateOptions = {}, timeOptions = {};
  
    var getOption = OraI18nUtils.getGetOption(options, caller);
          
    //date key
    var option = getOption('era', 'string', ['narrow', 'short', 'long']);
    dateKey += _appendToKey(dateOptions, 'era',
      option, {
        'narrow': 'GGGGG', 
        'short': 'GGG', 
        'long': 'GGGG'
      });            
  
    option = getOption('year',  'string', ['2-digit', 'numeric']); 
    dateKey += _appendToKey(dateOptions, 'year',
      option, {
        '2-digit': 'yy', 
        'numeric': 'y'
      });

    option = getOption('month', 'string', ['2-digit', 'numeric', 'narrow',
      'short', 'long']);
    dateKey += _appendToKey(dateOptions, 'month',
      option, {
        '2-digit': 'MM', 
        'numeric': 'M',
        'narrow': 'MMMMM', 
        'short': 'MMM', 
        'long': 'MMMM'
      });

    option = getOption('weekday', 'string', ['narrow', 'short', 'long']);
    dateKey += _appendToKey(dateOptions, 'weekday',
      option, {
        'narrow': 'EEEEE', 
        'short': 'E', 
        'long': 'EEEE'
      });

    option = getOption('day', 'string', ['2-digit', 'numeric']);
    dateKey += _appendToKey(dateOptions, 'day',
      option, {
        '2-digit': 'dd', 
        'numeric': 'd'
      });
   
    //time key
    var hr12 = getOption('hour12', 'boolean', [true, false]);
    if(hr12 === undefined)
      hr12 = _isHour12(localeElements);
    option = getOption('hour', 'string', ['2-digit', 'numeric']);
    if (hr12 === true) {
      timeKey += _appendToKey(timeOptions, 'hour',
        option, {
          '2-digit': 'hh', 
          'numeric': 'h'
        });
    } 
    else {
      timeKey += _appendToKey(timeOptions, 'hour',
        option, {
          '2-digit': 'HH', 
          'numeric': 'H'
        });
    }

    option = getOption('minute', 'string', ['2-digit', 'numeric']);
    timeKey += _appendToKey(timeOptions, 'minute',
      option, {
        '2-digit': 'mm', 
        'numeric': 'm'
      });

    option = getOption('second', 'string', ['2-digit', 'numeric']);
    timeKey += _appendToKey(timeOptions, 'second',
      option, {
        '2-digit': 'ss', 
        'numeric': 's'
      });
            
    return [dateKey, timeKey, dateOptions, timeOptions];
  };
        
  _appendToKey = function (obj, prop, option, pairs) {
    if (option !== undefined) {
      obj[prop] = option;
      return pairs[option];
    } else {
      return '';
    }
  };


  /*
   *This function is used by the munger algorith. It expands a pattern
   *in order to match the user's ECMA options.
   *For example if the user provided options is 
   *options = {year: 'numeric', month: 'long', weekday: 'long',
   *day : '2-digit'}; 
   *The key for these options is: yMMMMEEEEdd. under availableFormats, 
   *we have the following entry: "yMMMEd": "E, MMM d, y".
   *The _basicFormatMatcher algorithm will find "yMMMEd" key as the 
   *closest match to yMMMMEEEEdd. If formatMatcher ="munger", we will 
   *expand the corresponding pattern to match the options. 
   *So "E, MMM d, y" will be expanded to "EEEE, MMMM dd y".
   */        
  _expandAvailableDateFormatsPattern = function (formatTemplate, options,
    caller)
    {
    var datePat = formatTemplate, match;
    var getOption = OraI18nUtils.getGetOption(options, caller);
    //year
    var option = getOption('year', 'string', ['2-digit', 'numeric']);
    var pairs =  {
      '2-digit': 'yy', 
      'numeric': 'yyyy'
    };
    if(option !== undefined)
      datePat = datePat.replace(/y{1,4}/, pairs[option]);

    //month
    option = getOption('month', 'string', ['2-digit', 'numeric', 'narrow',
      'short', 'long']);
    if(option !== undefined) {
      pairs = {
        '2-digit': 'MM', 
        'numeric': 'M', 
        'narrow': 'MMMMM', 
        'short': 'MMM', 
        'long': 'MMMM'
      };
      var pairsL = {
        '2-digit': 'LL', 
        'numeric': 'L', 
        'narrow': 'LLLLL', 
        'short': 'LLL', 
        'long': 'LLLL'
      };
      if(pairs[option] !== undefined && pairs[option].length > 2) {
        datePat = datePat.replace(/M{3,5}/, pairs[option]);
        datePat = datePat.replace(/L{3,5}/, pairsL[option]);
      }
      else if(option === '2-digit') {
        _MONTH_REGEXP_FMT.lastIndex = 0;
        match= _MONTH_REGEXP_FMT.test(formatTemplate);
        if(match) {
          datePat = datePat.replace('M', 'MM');
        }
        match= _MONTH_REGEXP_STD.test(formatTemplate);
        if(match) {
          datePat = datePat.replace('L', 'LL');
        }
      }
    }
            
    //weekday
    option = getOption('weekday', 'string', ['narrow', 'short', 'long']);
    if(option !== undefined) { 
      var pairsFormat = {
        'narrow': 'EEEEE', 
        'short': 'EEE', 
        'long': 'EEEE'
      };
      var pairsStandalone = {
        'narrow': 'ccccc', 
        'short': 'ccc', 
        'long': 'cccc'
      };
      datePat = datePat.replace(/E{1,5}/, pairsFormat[option]);
      datePat = datePat.replace(/c{1,5}/, pairsStandalone[option]);
    }
    //day

    option = getOption('day', 'string', ['2-digit', 'numeric']);
    if(option !== undefined) { 
      if(option === '2-digit') {
        _DAY_REGEXP.lastIndex = 0;
        match = _DAY_REGEXP.test(formatTemplate);
        if(match) {
          datePat = datePat.replace('d', 'dd');
        }
      }
    }          
    return datePat;
  };
      
  //Same as above for time entries
  _expandAvailableTimeFormatsPattern = function (formatTemplate, options,
    caller) {
    var timePat = formatTemplate;
    var getOption = OraI18nUtils.getGetOption(options, caller);
    var option = getOption('hour', 'string', ['2-digit', 'numeric']);
    if(option === '2-digit') {
      _HOUR_REGEXP.lastIndex = 0;
      var match= _HOUR_REGEXP.exec(formatTemplate);
      if(match !== null) {
        var len = match[0].length-2;
        var ext = match[0][len] + match[0][len];
        timePat = formatTemplate.replace(match[0][len], ext);
      }
    }
    return timePat;
  };
  
  _getPatternFromSingleToken = function(token, tokenObj, availableFormats) {
    var i, count = 0;
    for(i in tokenObj) {
      count++;
    }
    if(count > 1) {
      return null;
    }
    var pattern;
    for(i = token.length; i > 0; i--) {
      pattern = availableFormats[token.substr(0, i)];
      if(pattern !== undefined)
        return pattern;
    }
    return token;
  };
  
  //Returns a pattern corresponding to user's options.
  //Cache the entries for which we already found a pattern 
  _expandFormat = function(options, localeElements, caller) {
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var locale = OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
    var getOption = OraI18nUtils.getGetOption(options, caller);
    var pattern;
    var matcher = getOption('formatMatcher',  'string', 
      ['basic', 'munger'], 'munger');
    var count = 0;
    for(count in options){
      count++;
    }
    if(count == 0) {
      options = {
        'year': 'numeric', 
        'month': 'numeric', 
        'day': 'numeric'
      };
    }
    var dateTimeKeys = _toAvailableFormatsKeys(options, localeElements, 
      caller);
    //First try to get the pattern from cache
    if(_localeDataCache[locale] !== undefined) {
      var cachedPattern= _localeDataCache[locale]['dates']['calendars']['gregorian']
      ['dateTimeFormats'][dateTimeKeys[0] + dateTimeKeys[1]];
      if( cachedPattern !== undefined){
        return cachedPattern;
      }
    }
    if(dateTimeKeys[0] === '' && dateTimeKeys[1] === '') {
      return _expandPredefinedStylesFormat(options, localeElements, 
        caller);
    }
    var availableFormats = mainNode['dates']['calendars']['gregorian']
    ['dateTimeFormats']['availableFormats'];
    var datePattern = availableFormats[dateTimeKeys[0]];
    var hour12 = getOption('hour12', 'boolean', [true, false]);
    if(hour12 === undefined)
      hour12 = _isHour12(localeElements);
    if(datePattern === undefined && dateTimeKeys[0] !== '') {
      datePattern = _getPatternFromSingleToken(dateTimeKeys[0], dateTimeKeys[2],
        availableFormats);
      if(datePattern === null)
        datePattern = _basicFormatMatcher(dateTimeKeys[2], 
          localeElements, true, hour12);
      if(datePattern !== null) {
        if(matcher !== 'basic') {
          datePattern = _expandAvailableDateFormatsPattern(
            datePattern, options, caller);
        }
      }
      else
        datePattern = dateTimeKeys[0];
    }
    var timePattern = availableFormats[dateTimeKeys[1]];
    if(timePattern === undefined && dateTimeKeys[1] !== '') {
      timePattern = _getPatternFromSingleToken(dateTimeKeys[1], dateTimeKeys[3],
        availableFormats);
      if(timePattern === null)
        timePattern = _basicFormatMatcher(dateTimeKeys[3], 
          localeElements, true, hour12);
      if(timePattern !== null) {
        if(matcher !== 'basic') {
          timePattern = _expandAvailableTimeFormatsPattern(
            timePattern, options, caller);
        }
      }
      else
        timePattern = dateTimeKeys[1];
    }
    pattern = datePattern || '';
    if(timePattern !== undefined)
    {
      if(pattern !== '')
        pattern += ' ' + timePattern;
      else
        pattern = timePattern;
    }
    //cache the pattern
    if(_localeDataCache[locale] === undefined) {
      _localeDataCache[locale] = {};
      _localeDataCache[locale]['dates'] = {};
      _localeDataCache[locale]['dates']['calendars'] = {};
      _localeDataCache[locale]['dates']['calendars']['gregorian'] = {};
      _localeDataCache[locale]['dates']['calendars']['gregorian']
      ['dateTimeFormats'] = {};
    }
    _localeDataCache[locale]['dates']['calendars']['gregorian']
    ['dateTimeFormats'][dateTimeKeys[0] + dateTimeKeys[1]] = pattern;
    return pattern;
  };
            
      
  _formatImpl = function(value, localeElements, options) {
    var ret;
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    //get the pattern from options
    var format = options['pattern'] || _expandFormat(options, localeElements,
      "OraDateTimeConverter.format");
    // Start with an empty string
    ret = [];
    var part,
    quoteCount = 0,
    cal = mainNode['dates']['calendars']['gregorian'];
      
    function _getPart(date, part) {
      switch (part) {
        case 0:
          return date.getFullYear();
        case 1:
          return date.getMonth() + 1;
        case 2:
          return date.getDate();
        case 3:
          return _DAYS_INDEXES[date.getDay()];
      }
    }
      
    function _getPaddedPart(ret, value, idx, len) {          
      var val = _getPart(value, idx);
      ret.push(len > 1 ? OraI18nUtils.padZeros(val, len) : val)
    }

    function _getTimeParts(ret, value, len, currentPart, current) {
      var val;
      switch (currentPart['timePart']) {
        case 'hour' :
          if(currentPart['end1'] === 11)
            val = value.getHours() % 12;
          else
            val = value.getHours();
          if(current === 'h' || current === 'hh') {
            if (val === 0) val = 12;
          }
          else if(current === 'k' || current === 'kk') {
            if (val === 0) val = 24;
          }
          break;
        case 'minute' :
          val = value.getMinutes();
          break;
        case 'second' :
          val = value.getSeconds();
          break;
        case 'millisec' :
          val = value.getMilliseconds();
          break;            
      }
      ret.push(len > 1 ? OraI18nUtils.padZeros(val, len) : val)
    }
      
    for (; ;) {
      // Save the current index
      var index = _TOKEN_REGEXP.lastIndex,
      // Look for the next pattern
      ar = _TOKEN_REGEXP.exec(format);

      // Append the text before the pattern (or the end of the string if 
      // not found)
      var preMatch = format.slice(index, ar ? ar.index : format.length);
      quoteCount += _appendPreOrPostMatch(preMatch, ret);

      if (!ar) {
        break;
      }

      // do not replace any matches that occur inside a string literal.
      if (quoteCount % 2) {
        ret.push(ar[0]);
        continue;
      }

      var current = ar[ 0 ],
      clength = current.length,
      currentPart = _PROPERTIES_MAP[current];
      switch (currentPart['token']) {
        case 'days':
          part = cal[currentPart['token']][currentPart['style']][currentPart['dLen']];
          ret.push(part[_getPart(value, 3)]);
          break;
        case 'months':
          part = cal[currentPart['token']][currentPart['style']][currentPart['mLen']];
          ret.push(part[_getPart(value, 1)]);
          break;
        case 'dayOfMonth' :
        case 'monthIndex' :
          ret.push(_getPaddedPart(ret, value, currentPart['getPartIdx'], clength));
          break;
        case 'year':
          // Year represented by four full digits
          part =  value.getFullYear();
          if (clength == 2) {
            part = part % 100;
          }
          ret.push(OraI18nUtils.padZeros(part, clength));
          break;
        case 'time':
          _getTimeParts(ret, value, clength, currentPart, current);
          break;
        case "ampm":
          // Multicharacter am/pm indicator
          part = value.getHours() < 12 ? 
          cal['dayPeriods']['format']['wide']['am'] : 
          cal['dayPeriods']['format']['wide']['pm'];
          ret.push(part);
          break;
        case "tz":
          // Time zone offset with leading zero
          /*part = value.getTimezoneOffset();
          ret.push(
            (part <= 0 ? "+" : "-") + 
            OraI18nUtils.padZeros(Math.floor(Math.abs(part/60)), 2) + 
            OraI18nUtils.padZeros(Math.floor(Math.abs(part%60)), 2)
            );*/
          break;
        case "era":
          part = cal['eras']['eraAbbr'];             
          ret.push(part['1']);
          break;
        case "slash":
          ret.push("/");
          break;
        default:
          _throwInvalidDateFormat(format, options, current);
      }
    }
    return ret.join("");
  };
  

  //_formatRelativeImpl

  //d1 and d2 same year
  _isSameYear = function(d1, d2) {
    return d1.getFullYear() == d2.getFullYear();
  };

  //d2 is next year
  _isNextYear = function(d1, d2) {
    return d2.getFullYear() - d1.getFullYear() == 1;
  };

  //d2 is previous year
  _isPrevYear = function(d1, d2) {
    return _isNextYear(d2, d1);
  };

  //d2 and d1 same month 
  _isSameMonth = function(d1, d2) {
    return _isSameYear(d1, d2) && (d1.getMonth() === d2.getMonth());
  };

  //d2 is next month
  _isNextMonth = function(d1, d2) {
    if(_isSameYear(d1, d2))
      return (d2.getMonth() - d1.getMonth()) == 1;
    else if(_isNextYear(d1, d2)) {
      return d1.getMonth() == 11 && (d2.getMonth() == 0);   
    }
    return false;
  };

  //d2 is previous month
  _isPrevMonth = function(d1, d2) {
    return _isNextMonth(d2, d1);
  };

  //difference in days between d2 and d1. Only valid if d2 is same or 
  //next month of d1
  _getDaysDif = function(d1, d2) {
    var day1 = d1.getDate();
    var day2 = d2.getDate();  
    if(_isNextMonth(d1, d2)) {
      day2 += _getDaysInMonth(d1.getFullYear, d1.getMonth());
    }
    return day2 - day1;
  };

  _getDayIndex = function(localeElements, idx) {
    var mainNode = OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
    var bcp47Keys = OraI18nUtils.parseBCP47(mainNode);
    var territory = bcp47Keys['region'] || '001';
    var firstDayNode = 
    localeElements['supplemental']['weekData']['firstDay'];
    var firstDayOfweek = firstDayNode[territory];
    var ret = idx - firstDayOfweek;
    if(ret < 0)
      ret += 7;
    return ret;
  };

  //d1 and d2 same week
  _isSameWeek = function(localeElements, d1, d2) {
    if(d1 > d2) {
      //swap dates to make sure we work with positive numbers
      var tmp = d1;
      d1 = d2;
      d2 = tmp;  
    }
    if((!_isSameMonth(d1, d2)) && (!_isNextMonth(d1, d2)))
      return false;
    var dif = _getDaysDif(d1, d2) + 
    _getDayIndex(localeElements, d1.getDay());
    return dif >= 0 && dif <= 6; 
  };

  //d2 is next week
  _isNextWeek = function(localeElements, d1, d2) {
    if((!_isSameMonth(d1, d2)) && (!_isNextMonth(d1, d2)))
      return false;
    var dif = _getDaysDif(d1, d2) + 
    _getDayIndex(localeElements, d1.getDay());
    return dif >= 7 && dif <= 13; 
  };

  //d2 is previous week
  _isPrevWeek = function(localeElements, d1, d2) {
    return _isNextWeek(localeElements, d2, d1);
  };

  //d1 and d2 same day
  _isSameDay = function(d1, d2) {
    return _isSameYear(d1, d2) && _isSameMonth(d1, d2) &&
    (d1.getDate() === d2.getDate());
  };

  //d2 is next day
  _isNextDay = function(d1, d2) {
    if((!_isSameMonth(d1, d2)) && (!_isNextMonth(d1, d2))) {
      return false;
    }
    return (_getDaysDif(d1, d2) === 1);
  };

  //d2 is previous day
  _isPrevDay = function(d1, d2) {
    return _isNextDay(d2, d1);
  };
      
 
  _formatRelativeImpl = function(value, localeElements, options) {
    if(typeof value === "number") {
      value = new Date(value);            
    }
    else if(typeof value === "string") {
      if(OraI18nUtils.trim(value) === '')
        return null;
      value = OraI18nUtils.isoToLocalDate(value);
    }
    else {
      return null;
    }
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var fields = mainNode['dates']['fields'];
    var getOption = OraI18nUtils.getGetOption(options, 
      "OraDateTimeConverter.formatRelative");
    var formatUsing = getOption('formatUsing', 'string', 
      ['displayName']);
    var option = getOption('dateField', 'string',
      ['day', 'week', 'month', 'year']);
    var now = new Date();
    switch(option) {
      case "day" :
        if(_isSameDay(now, value))
          return fields['day']['relative-type-0'];
        if(_isNextDay(now, value))
          return fields['day']['relative-type-1'];
        if(_isPrevDay(now, value))
          return fields['day']['relative-type--1'];
        break;
      case "week" :
        if(_isSameWeek(localeElements, now, value))
          return fields['week']['relative-type-0'];
        if(_isNextWeek(localeElements, now, value))
          return fields['week']['relative-type-1'];
        if(_isPrevWeek(localeElements, now, value))
          return fields['week']['relative-type--1'];
        break;
      case "month" :
        if(_isSameMonth(now, value))
          return fields['month']['relative-type-0'];
        if(_isNextMonth(now, value))
          return fields['month']['relative-type-1'];
        if(_isPrevMonth(now, value))
          return fields['month']['relative-type--1'];
        break;
      case "year" :
        if(_isSameYear(now, value))
          return fields['year']['relative-type-0'];
        if(_isNextYear(now, value))
          return fields['year']['relative-type-1'];
        if(_isPrevYear(now, value))
          return fields['year']['relative-type--1'];
        break;
      default :
        break;
    }
    return null;
  };
    
    
  // parse functions
      
  _throwWeekdayMismatch = function(weekday, day) {
    var msg, error, errorInfo;
    msg =  "The weekday " + weekday + " does not match the date " + day; 
    error = new Error(msg);
    errorInfo = {
      'errorCode' : 'dateToWeekdayMismatch',
      'parameterMap' : {
        'weekday' : weekday,
        'date':day
      }
    };
    error['errorInfo'] = errorInfo;
    throw error;
  };
      
  _throwDateFormatMismatch = function(value, format, style) {
    var msg, error, errorInfo, errorCodeType;
    if(style === 2) {
      msg =  "The value \"" + value + 
      "\" does not match the expected date-time format \"" + format + '"';
      errorCodeType = "datetimeFormatMismatch";
    }
    else if(style === 0) {
      msg =  "The value \"" + value + 
      "\" does not match the expected date format \"" + format + '"';
      errorCodeType = "dateFormatMismatch";
         
    }
    else {
      msg = "The value \"" + value + 
      "\" does not match the expected time format \"" + format + '"';
      errorCodeType = "timeFormatMismatch";
        
    }
    error = new Error(msg);
    errorInfo = {
      'errorCode' : errorCodeType,
      'parameterMap' : {
        'value': value,
        'format': format
      }
    };
    error['errorInfo'] = errorInfo;
    throw error;
  };
        
  _expandYear = function(start2DigitYear, year) {
    // expands 2-digit year into 4 digits.
    if (year < 100) {
      var ambiguousTwoDigitYear = start2DigitYear % 100;
      year += Math.floor((start2DigitYear/100))*100 + 
      (year < ambiguousTwoDigitYear ? 100 : 0);
    }
    return year;
  };
  
  _arrayIndexOfDay = function(daysObj, item) {
    var days = {
      "sun": 0, 
      "mon": 1, 
      "tue": 2, 
      "wed": 3, 
      "thu": 4, 
      "fri": 5, 
      "sat": 6
    };
    for (var d in daysObj) {
      if (OraI18nUtils.trim(OraI18nUtils.toUpper(daysObj[d])) == OraI18nUtils.trim(item)) {
        return days[d];
      }
    }
    return -1;
  };
  
  _arrayIndexOfMonth = function(monthsObj, item) {    
    for (var m in monthsObj) {
      if (OraI18nUtils.trim(OraI18nUtils.toUpper(monthsObj[m])) === OraI18nUtils.trim(item)) {
        return (m - 1);
      }
    }
    return -1;
  };
      
  _getDayIndex1 = function(localeElements, value, fmt) {
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var ret, days;
    var calDaysFmt = 
    mainNode['dates']['calendars']['gregorian']['days']['format'];
    var calDaysStdAlone = 
    mainNode['dates']['calendars']['gregorian']['days']['stand-alone'];
    switch(fmt) {
      case 0:
        days =  [
        calDaysFmt['abbreviated'],
        calDaysFmt['wide']
        ];
        break;
      case 1:
        days =  [
        calDaysStdAlone['abbreviated'],
        calDaysStdAlone['wide']
        ];
        break;
      default:
        break;
    }
    value = OraI18nUtils.toUpper(value);
    ret = _arrayIndexOfDay(days[0], value);
    if (ret === -1) {
      ret = _arrayIndexOfDay(days[1], value);
    }
    return ret;
  };

  //fmt:0 for format, 1 for stand-alone, 2 for lenient parse
  _getMonthIndex = function(localeElements, value, fmt) {
    var ret = -1, months;
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var calMonthsFmt = 
    mainNode['dates']['calendars']['gregorian']['months']['format'];
    var calMonthsStdAlone = 
    mainNode['dates']['calendars']['gregorian']['months']['stand-alone'];
    switch(fmt) {
      case 0:
        months =  [
        calMonthsFmt['wide'],
        calMonthsFmt['abbreviated']
        ];
        break;
      case 1:
        months =  [
        calMonthsStdAlone['wide'],
        calMonthsStdAlone['abbreviated']
        ];
        break;
      case 2:
        months =  [
        calMonthsFmt['wide'],
        calMonthsFmt['abbreviated'],
        calMonthsStdAlone['wide'],
        calMonthsStdAlone['abbreviated']
        ];
        break; 
      default:
        return -1;
    }
    value = OraI18nUtils.toUpper(value);
    for(var m in months) {
      ret = _arrayIndexOfMonth(months[m], value);
      if (ret !== -1) {
        return ret;
      }
    }
    return ret;
  };
        
  // converts a format string into a regular expression with groups that
  // can be used to extract date fields from a date string.
  // check for a cached parse regex.
  _getParseRegExp = function(format, options) {
    var re = {};
		

    // expand single digit formats, then escape regular expression
    //  characters.
    var expFormat = format.replace(_ESCAPE_REGEXP, "\\\\$1"),
    regexp = [ "^" ],
    groups = [],
    index = 0,
    quoteCount = 0,
    match;

    // iterate through each date token found.
    while ((match = _TOKEN_REGEXP.exec(expFormat)) !== null) {
      var preMatch = expFormat.slice(index, match.index);
      index = _TOKEN_REGEXP.lastIndex;

      // don't replace any matches that occur inside a string literal.
      quoteCount += _appendPreOrPostMatch(preMatch, regexp);
      if (quoteCount % 2) {
        regexp.push(match[0]);
        continue;
      }

      // add a regex group for the token.
      var m = match[ 0 ],
      add;
      if(_PROPERTIES_MAP[m] !== undefined){
        add = _PROPERTIES_MAP[m]['regExp'];
      }
      else
        _throwInvalidDateFormat(format, options, m);
      if (add) {
        regexp.push(add);
      }
      groups.push(match[0]);
    }
    _appendPreOrPostMatch(expFormat.slice(index), regexp);
    regexp.push("$");

    // allow whitespace to differ when matching formats.
    var regexpStr = regexp.join("").replace(/\s+/g, "\\s+"),
    parseRegExp = {
      'regExp': regexpStr, 
      'groups': groups
    };
    // cache the regex for this format.
    return re[ format ] = parseRegExp;
  };

  _validateRange = function(name, value, low, high, displayValue,
    displayLow, displayHigh) {
    if(value < low || value > high) { 
      var msg =  displayValue + 
      " is out of range.  Enter a value between " + displayLow +
      " and " + displayHigh + " for " + name; 
      var rangeError = new RangeError(msg);
      var errorInfo = {
        'errorCode' : "datetimeOutOfRange",
        'parameterMap' : {
          'value': displayValue, 
          'minValue': displayLow,
          'maxValue': displayHigh,
          'propertyName': name
        }
      };
      rangeError['errorInfo'] = errorInfo;
      throw rangeError;              
    }
  };
        
  _getTokenIndex = function(arr, token)
  {
    for(var i in arr){
      for (var n in arr[i])
      {
        if(n === token)
          return parseInt(i, 10);
      }         
    }
    return 0;
  };
        
  //time lenient parse
  _parseLenienthms = function(result, timepart, format, localeElements, dtype) {
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var calPM = mainNode['dates']['calendars']['gregorian']['dayPeriods']['format']['wide']['pm'];
    //hour, optional minutes and optional seconds
    _TIME_REGEXP.lastIndex = 0;
    var hour = 0, minute = 0, second = 0, msec=0, idx;
    var match = _TIME_REGEXP.exec(timepart);
    if(match === null) {
      _throwDateFormatMismatch(timepart, format, dtype);
    }
    if(match[1] !== undefined)
      hour = parseInt(match[1], 10);
    if(match[2] !== undefined)
      minute = parseInt(match[2], 10);
    if(match[3] !== undefined)
      second = parseInt(match[3], 10);
    if(match[4] !== undefined)
      msec = parseInt(match[4], 10);
    
    _TIME_FORMAT_REGEXP.lastIndex = 0;
    match =  _TIME_FORMAT_REGEXP.exec(format);
    switch(match[0]) {
      case "h":
        // Hour in am/pm (1-12)
        if (hour === 12) hour = 0;
        _validateRange("hour", hour, 0, 11, hour, 1, 12);
        idx = (OraI18nUtils.toUpper(timepart)).indexOf(OraI18nUtils.toUpper(calPM));
        if( idx !== -1 && hour < 12)
          hour += 12;
        break;
      case "K":
        // Hour in am/pm (0-11)
        _validateRange("hour", hour, 0, 11, hour, 0, 11);
        idx = (OraI18nUtils.toUpper(timepart)).indexOf(OraI18nUtils.toUpper(calPM));
        if( idx !== -1 && hour < 12)
          hour += 12;
        break;
      case "H":
        _validateRange("hour", hour, 0, 23, hour, 0, 23);
        break;
      case "k":
        if (hour === 24) hour = 0;
        _validateRange("hour", hour, 0, 23, hour, 1, 24);
        break;
      default:
        break;
    }
    // Minutes.
    _validateRange("minute", minute, 0, 59, minute, 0, 59);
    // Seconds.
    _validateRange("second", second, 0, 59, second, 0, 59);
    //millisec
    _validateRange("millisec", msec, 0, 999, msec, 0, 999);

    result.setHours(hour, minute, second, msec);
  };
  
  _getWeekdayName = function(value, localeElements) {
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var calDaysFmt = 
    mainNode['dates']['calendars']['gregorian']['days']['format'];
    var calDaysStandAlone = 
    mainNode['dates']['calendars']['gregorian']['days']['stand-alone'];
    var days =  [
    calDaysFmt['wide'],
    calDaysFmt['abbreviated'],
    calDaysStandAlone['wide'],         
    calDaysStandAlone['abbreviated']
    ];
          
    var foundMatch = false;
    var dName, i, j;
    for (i in days) {
      for(j in days[i]) {
        dName = days[i][j];
        var dRegExp = new RegExp(dName + "\\b", 'i');
        if (dRegExp.test(value)) {         
          foundMatch = true;
          break;
        }
      }
      if(foundMatch)
        break;
      dName = null;
    }
    return dName;
  };
  
  //lenient parse yMd and yMEd patterm. Must have year, moth, 
  //date all numbers. Ex: 5/3/2013
  //weekday is optional. If present it must match date. 
  //Ex:  Tuesday 11/19/2013
  //if year > 2-digits it can be anywhere in the string. 
  //Otherwise assume its position based on pattern
  //if date > 12 it can be anywhere in the string. 
  //Otherwise assume its position based on pattern 
  //separators can be any non digit characters
  _parseLenientyMEd = function(value, format, options, localeElements,
    isDateTime)
    {
    _YMD_REGEXP.lastIndex = 0;
    var match = _YMD_REGEXP.exec(value);
    if(match === null) {
      var dtype = isDateTime ? 2 : 0;
      _throwDateFormatMismatch(value, format, dtype);
    }
    var tokenIndexes = [{
      'y':format.indexOf("y")
    },{
      'M':format.indexOf("M")
    },{
      'd':format.indexOf("d")
    }];
    tokenIndexes.sort(function(a,b){
      for (var n1 in a)
      {
        break;
      }
      for (var n2 in b)
      {
        break;
      }
      return a[n1]-b[n2];
    });
    var year, month, day, yearIndex, dayIndex, i, j;
    var foundYear = false, foundDay = false;
    for(i =1; i <= 3; i++)
    {
      var tokenMatch =  match[i];
      //find year if year is yyy|yyyy
      if(tokenMatch.length > 2 || tokenMatch > 31)
      {
        year = tokenMatch;
        foundYear = true;
        yearIndex = i-1;
      }
    }

    if(!foundYear) {
      yearIndex = _getTokenIndex(tokenIndexes, 'y');
      year = match[_getTokenIndex(tokenIndexes, 'y')+1];
    }
    //find day if day value > 12
    for(i = 0; i < 3; i++) { 
      if(i!== yearIndex && match[i+1] > 12) {
        day = match[i+1];
        foundDay = true;
        dayIndex = i;
        break;
      }
    }
    if(!foundDay) {
      if(yearIndex === _getTokenIndex(tokenIndexes, 'd'))
      {
        day = match[_getTokenIndex(tokenIndexes, 'y')+1];
        month = match[_getTokenIndex(tokenIndexes, 'M')+1];
      }
      else if (yearIndex === _getTokenIndex(tokenIndexes, 'M'))
      {
        day = match[_getTokenIndex(tokenIndexes, 'd')+1];
        month = match[_getTokenIndex(tokenIndexes, 'y')+1];   
      }
      else {
        day = match[_getTokenIndex(tokenIndexes, 'd')+1];
        month = match[_getTokenIndex(tokenIndexes, 'M')+1];   
 
      }
    }
    else {
      for(i = 0; i < 3; i++) { 
        if(i!== dayIndex && i !== yearIndex) {
          month = match[i+1];
          break;
        }
      }
      if(month === undefined) {
        month = match[_getTokenIndex(tokenIndexes, 'M')+1];
      }
    }
    month -= 1;
    var daysInMonth = _getDaysInMonth(year, month);
    _validateRange("month", month, 0, 11, month+1, 1, 12);
    _validateRange("day", day, 1, daysInMonth, day, 1, daysInMonth);
    var start2DigitYear = _get2DigitYearStart(options);
    year = _expandYear(start2DigitYear, parseInt(year, 10));
    _validateRange("year", year, 0, 9999, year, 0, 9999);
    var parsedDate = new Date(year, month, day);
    //locate weekday
    var dName = _getWeekdayName(value, localeElements);
    if(dName != null) {
      var weekDay = _getDayIndex1(localeElements, dName, 0);  
      // day of week does not match date
      if (parsedDate.getDay() !== weekDay) {
        _throwWeekdayMismatch(dName, parsedDate.getDate());
      }
    }
    var result = 
    {
      'value': parsedDate,
      'warning' : 'lenient parsing was used'
    };
    if(isDateTime) {
      var timepart = value.substr(_YMD_REGEXP.lastIndex);
      if(timepart.length === 0)
        result['value'].setHours(0, 0, 0, 0);
      else
        _parseLenienthms(result['value'], timepart, format, localeElements, 2); 
    }
    return result;
  };

  //lenient parse yMMMd and yMMMEd patterns. Must have year, date as numbers 
  //and month name.
  //weekday is optional. If present it must match date.
  // Ex:  Monday Nov, 11 2013
  //weekday and month name can be anywhere in the string.
  //if year > 2-digits it can be anywhere in the string. 
  //Otherwise assume its position based on pattern
  //separators can be any non digit characters
  _parseLenientyMMMEd = function(value, format, options, localeElements,
    isDateTime) {
    var origValue = value;
    value =  OraI18nUtils.toUpper(value); 
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    //locate month name
    var calMonthsFmt = 
    mainNode['dates']['calendars']['gregorian']['months']['format'];
    var calMonthsStandAlone = 
    mainNode['dates']['calendars']['gregorian']['months']['stand-alone'];
    var months =  [
    calMonthsFmt['wide'],
    calMonthsFmt['abbreviated'],
    calMonthsStandAlone['wide'],         
    calMonthsStandAlone['abbreviated']
    ];
    var foundMatch = false;
    var reverseMonth;
    var i, j, mName;
    for (i in months) {
      reverseMonth = [];
      for(j in months[i]) {
        mName = OraI18nUtils.toUpper( months[i][j]);
        reverseMonth.push({
          'idx':j, 
          'name':mName
        });
      }
      reverseMonth.sort(function(a,b){
        return b['idx'] - a['idx'];
      });
          
      for(j in reverseMonth) {
        mName =  reverseMonth[j]['name'];
        if (value.indexOf(mName) != -1) {
          foundMatch = true;
          value = value.replace(mName, "");
          break;
        }
      }
      if(foundMatch)
        break;
    }
    //There is no month name. Try yMEd lenient parse.
    if(!foundMatch) {
      return _parseLenientyMEd(origValue, format, options, localeElements,
        isDateTime);
    }
          
    var month = _getMonthIndex(localeElements, mName, 2);          
    _validateRange("month", month, 0, 11, month, 1, 12);

    //locate weekday
    var dName = _getWeekdayName(origValue, localeElements);
    var dRegExp = new RegExp(dName + "\\W", 'i');
    if(dName !== null) {
      value = value.replace(dRegExp, "");
    }
    //find year and date
    _YEAR_AND_DATE_REGEXP.lastIndex = 0;
    var match = _YEAR_AND_DATE_REGEXP.exec(value);
    if(match === null) {
      var dtype = isDateTime ? 2 : 0;
      _throwDateFormatMismatch(origValue, format, dtype);
    }
    var tokenIndexes = [{
      'y':format.indexOf("y")
    },{
      'd':format.indexOf("d")
    }];
      
    tokenIndexes.sort(function(a,b){
      for (var n1 in a)
      {
        break;
      }
      for (var n2 in b)
      {
        break;
      }
      return a[n1]-b[n2];
    });
        
    var year, day, yearIndex;
    var foundYear = false;
    for(i =1; i <= 2; i++)
    {
      var tokenMatch =  match[i];
      //find year if year is yyy|yyyy
      if(tokenMatch.length > 2 || tokenMatch > 31)
      {
        year = tokenMatch;
        foundYear = true;
        yearIndex = i-1;
      }
    }
    if(!foundYear) {
      yearIndex = _getTokenIndex(tokenIndexes, 'y');
      year = match[_getTokenIndex(tokenIndexes, 'y')+1];
    } 
    if(yearIndex === _getTokenIndex(tokenIndexes, 'd'))
    {
      day = match[_getTokenIndex(tokenIndexes, 'y')+1];
    }
    else {
      day = match[_getTokenIndex(tokenIndexes, 'd')+1];
    }
          
    var start2DigitYear = _get2DigitYearStart(options);
    year = _expandYear(start2DigitYear, parseInt(year, 10));
    _validateRange("year", year, 0, 9999, year, 0, 9999);
    var parsedDate = new Date(year, month, day);
    if(dName != null) {
      var weekDay = _getDayIndex1(localeElements, dName, 0);  
      // day of week does not match date
      if (parsedDate.getDay() !== weekDay) {
        _throwWeekdayMismatch(dName, parsedDate.getDate());
      }
    }
    var daysInMonth = _getDaysInMonth(year, month);
    _validateRange("day", day, 1, daysInMonth, day, 1, daysInMonth);
    var result = 
    {
      'value': parsedDate,
      'warning' : 'lenient parsing was used'
    };
    if(isDateTime) {
      var timepart = value.substr(_YEAR_AND_DATE_REGEXP.lastIndex);
      if(timepart.length === 0)
        result['value'].setHours(0, 0, 0, 0);
      else
        _parseLenienthms(result['value'], timepart, format, localeElements, 2); 
    }
    return result;
  };
      
  _parseLenient = function(value, format, options, localeElements) {
    var dtStyle = _dateTimeStyle(options, "OraDateTimeConverter.parse");
    switch (dtStyle) {
      //date style
      case 0 :
        return _parseLenientyMMMEd(value, format, options, localeElements,
          false);
        break
      //time style
      case 1 :
        var d = new Date();
        _parseLenienthms(d, value, format, localeElements, 1);
        var result = 
        {
          'value': d,
          'warning' : 'lenient parsing was used'
        };
        return result;
        break;
      //date-time style
      case 2 :
        return _parseLenientyMMMEd(value, format, options, localeElements,
          true);
        break;
      default:
        break;
    }
    return null;
  };
    
  _getNameIndex = function(localeElements, datePart, matchGroup, mLength,
    style, matchIndex, start1, end1, start2, end2, name){
    var index;
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var monthsFormat = 
    mainNode['dates']['calendars']['gregorian'][datePart][style];
    var startName, endName;
    if(datePart === 'months') {
      index = _getMonthIndex(localeElements, matchGroup, matchIndex);
    }
    else {
      index = _getDayIndex1(localeElements, matchGroup, matchIndex);
    }
    startName = monthsFormat[mLength][start2];
    endName = monthsFormat[mLength][end2];
    _validateRange(name, index, start1, end1, matchGroup, 
      startName, endName);
    return index;
  };
     
  _getTimePart = function(matchInt, timeObj, objMap, clength, timeToken) {
    timeObj[objMap['timePart']] = matchInt;
    if(timeToken === 'h' || timeToken === 'hh') {
      if (matchInt === 12)
        timeObj[objMap['timePart']] = 0;
    }
    else if(timeToken === 'k' || timeToken === 'kk') {
      if (matchInt === 24)
        timeObj[objMap['timePart']] = 0;
    }
    else if(timeToken === 'S') {
      timeObj[objMap['timePart']] = matchInt * Math.pow(10, 3 - clength);
    }
    _validateRange(objMap['timePart'], timeObj[objMap['timePart']], 
      objMap['start1'], objMap['end1'], matchInt,
      objMap['start2'], objMap['end2']); 
  };
     
  //exact match parsing for date-time. If it fails, try lenient parse.
  _parseExact = function(value, format, options, localeElements) {
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    // try to parse the date string by matching against the format string
    // while using the specified culture for date field names.
    value = OraI18nUtils.trim(value);
    // remove spaces from era.
    var cal = mainNode['dates']['calendars']['gregorian'];
    var eraPart = cal['eras']['eraAbbr']['1'];
    var trimEraPart = OraI18nUtils.trimNumber(eraPart);
    value = value.replace(eraPart, trimEraPart);
 
    // convert date formats into regular expressions with groupings.
    // use the regexp to determine the input format and extract the date
    //  fields.
    var parseInfo = _getParseRegExp(format, options),
    match = new RegExp(parseInfo['regExp']).exec(value);
    if (match === null) {
      return _parseLenient(value, format, options, localeElements);
    }

    // found a date format that matches the input.
    var groups = parseInfo['groups'],
    year = null, month = null, date = null, weekDay = null,
    hourOffset, tzMinOffset = null,
    pmHour = false, minOffset, weekDayName,
    timeObj = {
      'hour':0, 
      'minute':0, 
      'second':0, 
      'millisec':0
    },
    calPM = mainNode['dates']['calendars']['gregorian']['dayPeriods']['format']['wide']['pm'];
    var start2DigitYear = _get2DigitYearStart(options);
    // iterate the format groups to extract and set the date fields.
    for (var j = 0, jl = groups.length; j < jl; j++) {
      var matchGroup = match[ j + 1 ];
      if (matchGroup) {
        var current = groups[ j ],
        clength = current.length,
        matchInt = parseInt(matchGroup, 10);
        var currentGroup = _PROPERTIES_MAP[current];
        switch (currentGroup['token']) {
          case 'months':
            month = _getNameIndex(localeElements, currentGroup['token'],
              matchGroup, currentGroup['mLen'], currentGroup['style'],
              currentGroup['matchIndex'], 0, 11, '1', '12', 'month name');
            break;
          case 'days':
            weekDayName = matchGroup;
            weekDay = _getNameIndex(localeElements, currentGroup['token'],
              matchGroup, currentGroup['dLen'], currentGroup['style'],
              currentGroup['matchIndex'], 0, 6, 'sun', 'sat', 'weekday');
            break;
          case 'time':
            _getTimePart(matchInt, timeObj, currentGroup, clength, current);
            break;
          case 'dayOfMonth':
            date = matchInt;
            //try leneient parse for date style only
            if(date > 31)                    
              return _parseLenient(value, format, options, localeElements);
            break;
          case 'monthIndex':
            // Month.
            month = matchInt - 1;
            //try leneient parse for date style only
            if(month > 11)
              return _parseLenient(value, format, options, localeElements);
            break;
          case 'year':
            year = _expandYear(start2DigitYear, matchInt);
            _validateRange("year", year, 0, 9999, year, 0, 9999);
            break;
          case "ampm":
            pmHour = (OraI18nUtils.toUpper(matchGroup) === OraI18nUtils.toUpper(calPM));
            break;
          case "tz":
            // Time zone offset in +/-hhmm | +/-hmm.
            hourOffset = (matchInt/100) << 0;
            _validateRange("TZ Offset", hourOffset, -12, 13, 
              matchInt, -12, 13);
            minOffset = Math.abs(matchInt % 100);
            _validateRange("TZ Offset", minOffset, 0, 59, minOffset, 0, 
              59);
            tzMinOffset  = (hourOffset * 60)  + 
            (OraI18nUtils.startsWith(matchGroup, "-") ? -minOffset : minOffset);
            break;
        }       
      }
    }
    var parsedDate = new Date(), defaultYear;
    defaultYear =  parsedDate.getFullYear();
    if (year === null) {
      year = defaultYear;
    }
    // if day and month are unspecified,the defaults are current 
    // day and month.
    if (month === null && date === null) {
      month = parsedDate.getMonth();
      date = parsedDate.getDate();
    }
    // if day is unspecified, default 1st day of month.
    else if (date === null) {
      date = 1;
    }
        
    //validate day range, depending on the month and year
    var daysInMonth = _getDaysInMonth(year, month);
    _validateRange("day", date, 1, daysInMonth, date, 1, daysInMonth);
    // have to set year, month and date together to avoid overflow based 
    // on current date.
    parsedDate.setFullYear(year, month, date);

    // day of week does not match date
    if (weekDay !== null && parsedDate.getDay() !== weekDay) {
      _throwWeekdayMismatch(weekDayName, parsedDate.getDate());
    }
    // if pm designator token was found make sure the hours fit the 
    // 24-hour clock.
    if (pmHour && timeObj['hour'] < 12) {
      timeObj['hour'] += 12;
    }
    parsedDate.setHours(timeObj['hour'], timeObj['minute'], timeObj['second'],
      timeObj['millisec']);
    if (tzMinOffset !== null) {
      // adjust timezone to utc before applying local offset.
      var adjustedMin = parsedDate.getMinutes() - (tzMinOffset + 
        parsedDate.getTimezoneOffset());
      parsedDate.setHours(parsedDate.getHours() + 
        ((adjustedMin / 60) << 0), adjustedMin % 60);
    }
    var result =
    {
      'value': parsedDate
    };
    return result;
  };
    
  //given a user defined pattern, derive the ecma options that will
  //be returned by getResolvedOptions method
  _getResolvedOptionsFromPattern = function(locale, numberingSystemKey, 
    pattern) {
    // expand single digit formats, then escape regular expression 
    // characters.
    var expFormat = pattern.replace(_ESCAPE_REGEXP, "\\\\$1"),
    regexp = [ "^" ],
    quoteCount = 0,
    index=0,
    match;
    var result = {
      'locale': locale,
      'numberingSystem': numberingSystemKey,
      'calendar': 'gregorian'
    };
    // iterate through each date token found.
    while ((match = _TOKEN_REGEXP.exec(expFormat)) !== null) {
      var preMatch = expFormat.slice(index, match.index);
      index = _TOKEN_REGEXP.lastIndex;

      // skip matches that occur inside a string literal.
      quoteCount += _appendPreOrPostMatch(preMatch, regexp);
      if (quoteCount % 2) {
        continue;
      }

      // add a regex group for the token.
      var m = match[ 0 ];
      if(m === '/' || m === 'zzzz' || m === 'zzz' ||
        m === 'zz' || m === 'z') {
        continue;
      }
      if(_PROPERTIES_MAP[m] !== undefined) {
        result[_PROPERTIES_MAP[m]['key']] = _PROPERTIES_MAP[m]['value'];
        if(m === 'kk' || m === 'HH' || m === 'H' || m === 'k') {
          result['hour12'] = false;
        }
        else if(m === 'KK' || m === 'hh' || m === 'h' || m === 'K') {
          result['hour12'] = true;
        }
      }
      else {
        _throwInvalidDateFormat(pattern, result, m);
      }
    }
    return result;
  };
  //test if the pattern is date, time or date-time
  //0: date, 1:time, 2:date-time
  _dateTimeStyleFromPattern = function(pattern) {
    var result = _getResolvedOptionsFromPattern('', '', pattern);
    var isDate = (result['year'] !== undefined || result['month'] !== 
      undefined ||
      result['weekday'] !== undefined || result['day'] !== undefined);
    var isTime = (result['hour'] !== undefined || result['minute'] !== 
      undefined ||
      result['second'] !== undefined);
    if(isDate && isTime)
      return 2;
    else if (isTime)
      return 1;
    else
      return 0;    
  };
      
  //test if the pattern/options is date, time or date-time
  //0: date, 1:time, 2:date-time
  _dateTimeStyle = function(options, caller) {
    //try pattern
    if(options['pattern'] !== undefined ) {
      return _dateTimeStyleFromPattern(options['pattern']);     
    }
        
    //try ecma options
    var getOption = OraI18nUtils.getGetOption(options, caller);
    var isTime = (getOption('hour', 'string', ['2-digit', 'numeric']) !== 
      undefined ||
      getOption('minute', 'string', ['2-digit', 'numeric']) !== undefined ||
      getOption('second', 'string', ['2-digit', 'numeric']) !== undefined);
    var isDate = (getOption('year', 'string', ['2-digit', 'numeric']) !== 
      undefined ||
      getOption('month', 'string', 
        ['2-digit', 'numeric', 'narrow', 'short', 'long']) !== undefined ||
      getOption('day', 'string', ['2-digit', 'numeric']) !== undefined ||
      getOption('weekday', 'string', ['narrow', 'short', 'long']) !== 
      undefined);
    if(isDate && isTime)
      return 2;
    else if (isTime)
      return 1;
    else if (isDate)
      return 0;                
        
    //try predefined style
    var option = getOption('formatType', 'string', 
      ['date', 'time', 'datetime'], 'date');
    if(option === 'datetime')
      return 2;
    else if (option === 'time')
      return 1;
    return 0;
  };
  
  _createParseISOString = function(dtStyle, d) {
    var ms, val;
    switch (dtStyle) {
      case 0 :
        val = OraI18nUtils.padZeros(d.getFullYear(), 4) + "-" + OraI18nUtils.padZeros((d.getMonth() + 1 ), 2) + "-" +
        OraI18nUtils.padZeros(d.getDate(), 2);
        break;
      case 1 :
        val = "T" + OraI18nUtils.padZeros(d.getHours(), 2) + ":" + 
        OraI18nUtils.padZeros(d.getMinutes(), 2) + ":" +
        OraI18nUtils.padZeros(d.getSeconds(), 2);
        ms = d.getMilliseconds();
        if( ms > 0) {
          val += "." + ms
        }
        break;
      default :
        val = OraI18nUtils.padZeros(d.getFullYear(), 4) + "-" + 
        OraI18nUtils.padZeros((d.getMonth() + 1 ), 2) + "-" +
        OraI18nUtils.padZeros(d.getDate(), 2) +
        "T" + OraI18nUtils.padZeros(d.getHours(), 2) + ":" + 
        OraI18nUtils.padZeros(d.getMinutes(), 2) + ":" +
        OraI18nUtils.padZeros(d.getSeconds(), 2);
        ms = d.getMilliseconds();
        if( ms > 0) {
          val += "." + ms
        }
        break;
    }
    return val;
  };
  
  _parseImpl = function(str, localeElements, options, locale) {
    var numberingSystemKey =  OraI18nUtils.getLanguageExtension(locale, "nu");
    if(OraI18nUtils.numeringSystems[numberingSystemKey] === undefined)
      numberingSystemKey = 'latn';         
    if(numberingSystemKey !== 'latn') {
      var idx;
      var latnStr = [];
      for(idx = 0; idx < str.length; idx++)
      {
        var pos = OraI18nUtils.numeringSystems[numberingSystemKey].indexOf(str[idx]);
        if(pos != -1)
          latnStr.push(pos);
        else
          latnStr.push(str[idx]);       
      }
      str =  latnStr.join("");
    }
    if(arguments.length <= 2 || options === undefined)
    {
      //default is yMd
      options = {
        'year': 'numeric', 
        'month': 'numeric', 
        'day': 'numeric'
      };
    }
    var dtStyle = _dateTimeStyle(options, "OraDateTimeConverter.parse");
    var formats = options['pattern'] || _expandFormat(options, localeElements, 
      "OraDateTimeConverter.parse");
    var dateObj = {};
    //First try if str is an iso 8601 string 
    var testIsoStr = OraI18nUtils._ISO_DATE_REGEXP.test(str);
    if(testIsoStr === true) {
      var dateFromISOStr = OraI18nUtils.isoToLocalDate(str);
      dateObj['value'] = _createParseISOString(dtStyle, dateFromISOStr);
      return dateObj;
    }
    var parsedDateObj = _parseExact(str, formats, options, localeElements);
    var d = parsedDateObj['value'];
    dateObj['warning'] = parsedDateObj['warning'];
    dateObj['value'] = _createParseISOString(dtStyle, d);    
    return dateObj;
  };
      
  function _init() {    
    return {
      /**
     * Format a date.
     * @memberOf OraDateTimeConverter
     * @param {string} value - an iso 8601 string to be formatted. It  may be in 
     * extended or non-extended form. http://en.wikipedia.org/wiki/ISO_8601
     * @param {Object} localeElements - the instance of LocaleElements bundle.
     * @param {Object=} options - Containing the following properties:<br>
     * - <b>weekday.</b> Allowed values: "narrow", "short", "long".<br>
     * - <b>era.</b> Allowed values: "narrow", "short", "long".<br>
     * - <b>year.</b> Allowed values:"2-digit", "numeric".<br>
     * - <b>month.</b> Allowed values: "2-digit", "numeric", "narrow", 
     * "short", "long".<br>
     * - <b>day.</b> Allowed values: "2-digit", "numeric".<br>
     * - <b>hour.</b> Allowed values: "2-digit", "numeric".<br>
     * - <b>minute.</b> Allowed values: "2-digit", "numeric".<br>
     * - <b>second.</b> Allowed values: "2-digit", "numeric".<br>
     * - <b>timeZoneName.</b> Will be ignored in phase1. We do not support it 
     * yet.<br>
     * - <b>hour12.</b> is a Boolean value indicating whether 12-hour format 
     * (true) or 24-hour format (false) should be used. It is only relevant 
     * when hour is also present.<br>
     * - <b>formatMatcher.</b> optional, specifies the algorithm to be used 
     * for looking up the date format based on the options. Allowed values: 
     * "basic", "munger". The default is munger.
     * - <b>pattern.</b> custom String pattern as defined by Unicode CLDR.<br>
     * - <b>formatType.</b> a predefined formatting type. Allowed values: 
     * "date", "time", "datetime".
     * - <b>dateFormat.</b> optional, specifies the date format field. 
     * Allowed values: "short", "medium", "long", "full". It is only 
     * considered when formatType is present. The default value 
     * is "short".<br>
     * - <b>timeFormat.</b> optional, specifies the time format field. 
     * Allowed values: "short", "medium", "long", "full". It is only 
     * considered when formatType is present. The default value 
     * is "short".<br><br>
     * The order of precedence is the following:<br>
     * 1. pattern.<br>
     * 2. ECMA options.<br>
     * 3. formatType.<br>
     * If options is ommitted, the default will be the following object:<br>
     * {<br>
     * year:"numeric",<br> 
     * month:"numeric",<br> 
     * day:"numeric"<br>
     * };
     * @param {string=} locale - A BCP47 compliant language tag. it is only 
     * used to extract the unicode extension keys. 
     * @return {string|null} formatted date.
     * @throws {RangeError} If a propery value of the options parameter is 
     * out of range.
     * @throws {SyntaxError} If an Unexpected token is encountered in the 
     * pattern.
     * @throws {timeZoneNotSupported} if the iso string comtain a time zone.
     * @throws {invalidISOString} if the ISO string is not valid.
 
     */ 
      format : function(value, localeElements, options, locale) {
        var val;
        if(typeof value === "number") {
          val = new Date(value);            
        }
        else if(typeof value === "string") {
          if(OraI18nUtils.trim(value) === '')
            return null;
          val = OraI18nUtils.isoToLocalDate(value);
        }
        else {
          return null;
        }
        if(arguments.length <=2 || options === undefined)
        {
          //default is yMd
          options = {
            'year': 'numeric', 
            'month': 'numeric', 
            'day': 'numeric'
          };
        }
        var ret = _formatImpl(val, localeElements, options);
        var numberingSystemKey =  OraI18nUtils.getLanguageExtension(locale, "nu");
        if(OraI18nUtils.numeringSystems[numberingSystemKey] === undefined)
          numberingSystemKey = 'latn';           
        if(numberingSystemKey !== 'latn') {
          var idx;
          var nativeRet = [];
          for(idx = 0; idx < ret.length; idx++)
          {
            if(ret[idx] >= '0' && ret[idx] <= '9')
              nativeRet.push(OraI18nUtils.numeringSystems[numberingSystemKey][ret[idx]]);
            else nativeRet.push(ret[idx]);
        
          }
          return nativeRet.join("");
        }
        return ret;
      },
      
      /**
     * Format a relative date/time
     * @memberOf OraDateTimeConverter
     * @param {string} value - iso 8601 string to be formatted. It may be in
     *  extended or non-extended form. http://en.wikipedia.org/wiki/ISO_8601
     * @param {Object} localeElements - the instance of LocaleElements bundle.
     * @param {Object} options - Containing the following properties:
     * formatUsing. Allowed values: "displayName"
     * dateField. Allowed values: "day", "week", "month", "year"
     * @return {string|null} relative date. null if the value falls out side 
     * the supported relative range.
     */
      formatRelative : function(value, localeElements, options) {
        return _formatRelativeImpl(value, localeElements, options);
      },


      /**
     * Parse a date. It also support lenient parse when input does not match
     * the pattern.<br>
     * We first try to match month a pattern where we have month and weekday 
     * names Ex:  Monday Nov, 11 2013
     * weekday name and month name can be anywhere in the string.
     * if year > 2-digits it can be anywhere in the string. Otherwise we assume
     * its position based on pattern. Separators can be any non digit characters
     * <br>If month name is not present, we try lenient parse yMd and yMEd
     * pattern. Must have year, moth and date all numbers. Ex: 5/3/2013 weekday
     * is optional. If present it must match date. Ex:  Tuesday 11/19/2013
     * if year > 2-digits it can be anywhere in the string. Otherwise assume its
     * position based on pattern if date > 12 it can be anywhere in the string. 
     * Otherwise assume its position based on pattern separators can be any
     * non digit characters.<br><br>
     * @memberOf OraDateTimeConverter
     * @param {string} str - a String to be parsed. it can be an iso 8601 string
     * or a formatted string.
     * @param {Object} localeElements - The instance of LocaleElements bundle
     * @param {Object=} options - Containing the following properties:<br>
     * - <b>weekday.</b> Allowed values: "narrow", "short", "long".<br>
     * - <b>era.</b> Allowed values: "narrow", "short", "long".<br>
     * - <b>year.</b> Allowed values:"2-digit", "numeric".<br>
     * - <b>month.</b> Allowed values: "2-digit", "numeric", "narrow", 
     * "short", "long".<br>
     * - <b>day.</b> Allowed values: "2-digit", "numeric".<br>
     * - <b>hour.</b> Allowed values: "2-digit", "numeric".<br>
     * - <b>minute.</b> Allowed values: "2-digit", "numeric".<br>
     * - <b>second.</b> Allowed values: "2-digit", "numeric".<br>
     * - <b>timeZoneNmae.</b> Will be ignored in phase1. We do not support it
     *  yet.<br>
     * - <b>hour12.</b> is a Boolean value indicating whether 12-hour format 
     * (true) or 24-hour format (false) should be used. It is only relevant 
     * when hour is also present.<br>
     * - <b>formatMatcher.</b> optional, specifies the algorithm to be used 
     * for looking up the date format based on the options. Allowed values: 
     * "basic", "munger". The default is munger.
     * - <b>pattern.</b> custom String pattern as defined by Unicode CLDR.<br>
     * - <b>two-digit-year-start.</b> the 100-year period 2-digit year. 
     * During parsing, two digit years will be placed in the range 
     * two-digit-year-start to two-digit-year-start + 100 years. 
     * The default is 1950.<br>
     * - <b>formatType.</b> a predefined formatting type. Allowed values: 
     * "date", "time", "datetime".
     * - <b>dateFormat.</b> optional, specifies the date format. Allowed 
     * values: "short", "medium", "long", "full". It is only considered when 
     * formatType is present. The default value is "short".<br>
     * - <b>timeFormat.</b> optional, specifies the time format. Allowed 
     * values: "short", "medium", "long", "full". It is only considered when 
     * formatType is present. The default value is "short".<br><br>
     * The order of precedence is the following:<br>
     * 1. pattern.<br>
     * 2. ECMA options.<br>
     * 3. formatType.<br>          
     * If options is ommitted, the default will be the following object:<br>
     * {<br>
     * year:"numeric",<br> 
     * month:"numeric",<br> 
     * day:"numeric"<br>
     * };
     * @param {string=} locale - A BCP47 compliant language tag. it is only 
     * used to extract the unicode extension keys. 
     * @return {string} an iso 8601 extended String. http://en.wikipedia.org/wiki/ISO_8601.
     * If the patern is a date only, returns the date part of the iso string.
     * If the pattern is time only, returns the time part of the iso string. 
     * If the pattern is date-time, returns the date-time iso string.
     * <br>Example1:
     * <br> var pattern = 'MM/dd/yy hh:mm:ss a';
     * <br> cnv.parse('09/11/14 03:02:01 PM', localeElems, pattern);
     * <br> The return value is '2014-10-20T15:02:01'; 
     * <br>Example2:
     * <br> var pattern = 'MM/dd/yy';
     * <br> cnv.parse('09/11/14', localeElems, pattern);
     * <br> The return value is '2014-10-20'; 
     * <br>Example3:
     * <br> var pattern = 'hh:mm:ss a';
     * <br> cnv.parse('03:02:01 PM', localeElems, pattern);
     * <br> The return value is 'T15:02:01'; 
     * @throws {RangeError} If a property value of the options parameter is 
     * out of range.
     * @throws {SyntaxError} If an Unexpected token is encountered in the 
     * pattern.
     * @throws {Error} If the <i>str</i> parameter does not match the format 
     * pattern.
     * @throws {RangeError} if one of the date fields is out of range.
     * @throws {timeZoneNotSupported} if the iso string comtain a time zone.
     * @throws {invalidISOString} if the string to be parsed is an invalid ISO string.
     */ 
      parse : function(str, localeElements, options, locale) {
        return _parseImpl(str, localeElements, options, locale);
      },
      
      /**
     * Resolve options.
     * Returns a new object with properties reflecting the date and time 
     * formatting options computed based on the options parameter. 
     * If the options parameter is ommitted, the following object will be 
     * returned:<br>
     * {<br>
     * calendar: "gregorian"<br>
     * numberingSystem: "latn"<br>
     * locale: &lt;locale parameter&gt;,<br>
     * day: "numeric",<br>
     * month: "numeric",<br>
     * year: "numeric"<br>
     * };
     * @memberOf OraDateTimeConverter
     * @param {Object} localeElements - The instance of LocaleElements bundle                           
     * @param {Object=} options - Containing the following properties:<br>
     * - <b>calendar.</b> The calendar system.<br>
     * - <b>weekday.</b> Allowed values: "narrow", "short", "long".<br>
     * - <b>era.</b> Allowed values: "narrow", "short", "long".<br>
     * - <b>year.</b> Allowed values:"2-digit", "numeric".<br>
     * - <b>month.</b> Allowed values: "2-digit", "numeric", "narrow", 
     * "short", "long".<br>
     * - <b>day.</b> Allowed values: "2-digit", "numeric".<br>
     * - <b>hour.</b> Allowed values: "2-digit", "numeric".<br>
     * - <b>minute.</b> Allowed values: "2-digit", "numeric".<br>
     * - <b>second.</b> Allowed values: "2-digit", "numeric".<br>
     * - <b>timeZoneName.</b> Will be ignored in phase1. We do not support 
     * it yet.<br>
     * - <b>hour12.</b> is a Boolean value indicating whether 12-hour format 
     * (true) or 24-hour format (false) should be used. It is only relevant 
     * when hour is also present.<br>
     * - <b>formatMatcher.</b> optional, specifies the algorithm to be used 
     * for looking up the date format based on the options. Allowed values: 
     * "basic", "munger". The default is munger.
     * - <b>pattern.</b> custom String pattern as defined by Unicode CLDR. 
     * Will override above options when present.<br>
     * - <b>two-digit-year-start.</b> the 100-year period 2-digit year. 
     * During parsing, two digit years will be placed in the range 
     * two-digit-year-start to two-digit-year-start + 100 years. 
     * The default is 1950.<br>
     * - <b>formatType.</b> predefined format type.  Allowed values: 
     * "datetime", "date", "time"<br>
     * - <b>dateFormat.</b> format of date field.  Allowed values: "short", 
     * "medium", "long", "full". It is only relevant when formatType is also 
     * present<br>
     * - <b>timeFormat.</b> format of time field.  Allowed values: "short", 
     * "medium", "long", "full". It is only relevant when formatType is also 
     * present<br>
     * @param {string=} locale - A BCP47 compliant language tag. it is only 
     * used to extract the unicode extension keys.
     * @return {Object} Resolved options object.
     * @throws {RangeError} If a property value of the options parameter is 
     * out of range.
     * @throws {Error} if weekday does not match the date.
     */
           
      resolvedOptions : function(localeElements, options, locale){
        if(arguments.length < 3 || locale === undefined) {
          locale = OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
        }
        if(arguments.length < 2 || options === undefined)
        {
          //default is yMd
          options = {
            'year': 'numeric', 
            'month': 'numeric', 
            'day': 'numeric'
          };
        }
        var ecma = false;
        var result;
        var numberingSystemKey =  OraI18nUtils.getLanguageExtension(locale, "nu");
        if(OraI18nUtils.numeringSystems[numberingSystemKey] === undefined)
          numberingSystemKey = 'latn';
        if(options !== undefined && options['pattern'] !== undefined ) {
          result = _getResolvedOptionsFromPattern(locale, numberingSystemKey, 
            options['pattern']);
          result['pattern'] = options['pattern'];
          return result;
        }
        if(options !== undefined) {
          result = {
            'locale': locale,
            'numberingSystem': numberingSystemKey,
            'calendar': 'gregorian'
          };
          var count = 0;
          for(count in options){
            count++;
          }
          if(count == 0) {            
            result['year']= 'numeric'; 
            result['month'] = 'numeric'; 
            result['day']=  'numeric';
            return result;
          }
          var getOption = OraI18nUtils.getGetOption(options, 
            "OraDateTimeConverter.resolvedOptions");
          var option = getOption('year',  'string', ['2-digit', 'numeric']);
          if(option !== undefined) {
            result['year'] = option;
            ecma = true;
          }
          option = getOption('era', 'string', ['narrow', 'short', 'long']);
          if(option !== undefined) {
            result['era'] = option;
            ecma = true;
          }
          option = getOption('month', 'string', ['2-digit', 'numeric', 
            'narrow', 'short', 'long']);
          if(option !== undefined) {
            result['month'] = option;
            ecma = true;
          }
          option = getOption('day', 'string', ['2-digit', 'numeric']);
          if(option !== undefined) {
            result['day'] = option;
            ecma = true;
          }
          option = getOption('weekday', 'string', ['narrow', 'short', 
            'long']);
          if(option !== undefined) {
            result['weekday'] = option;
            ecma = true;
          }           
          option = getOption('hour', 'string', ['2-digit', 'numeric']);
          if(option !== undefined) {
            result['hour'] = option;
            ecma = true;
            option = getOption('hour12', 'boolean', [true, false]);
            if(option === undefined)
              option = _isHour12(localeElements);
            result['hour12'] = option;
          }
          option = getOption('minute', 'string', ['2-digit', 'numeric']);
          if(option !== undefined) {
            result['minute'] = option;
            ecma = true;
          }
          option = getOption('second', 'string', ['2-digit', 'numeric']);
          if(option !== undefined) {
            result['second'] = option;
            ecma = true;
          }
          result['two-digit-year-start'] = _get2DigitYearStart(options);
          if(!ecma) {
            var format = _expandPredefinedStylesFormat(options, 
              localeElements, OraDateTimeConverter.resolvedOptions);
            var fmtType = getOption('formatType', 'string', 
              ['date', 'time', 'datetime'], 'date');
            var dStyle = getOption('dateFormat', 'string', 
              ['short', 'medium', 'long', 'full'], 'short');
            var tStyle = getOption('timeFormat', 'string', 
              ['short', 'medium', 'long', 'full'], 'short');
            result['formatType'] = fmtType;
            if(fmtType === 'datetime' || fmtType === 'date') {
              result['dateFormat'] = dStyle;
            }
            if(fmtType === 'datetime' || fmtType === 'time') {
              result['timeFormat'] = tStyle;
            }
            result['patternFromOptions'] = format;
            return result;
          }
          result['patternFromOptions'] = _expandFormat(options, 
            localeElements, "OraDateTimeConverter.resolvedOptions");
          return result;
        }
        var defaultOptions = {
          'year': 'numeric', 
          'month': 'numeric', 
          'day': 'numeric'
        };
        var patternFromOptions = _expandFormat(defaultOptions,
          localeElements, "OraDateTimeConverter.resolvedOptions");
        return {
          'calendar': 'gregorian',
          'locale': locale,
          'numberingSystem': numberingSystemKey,
          'year': 'numeric', 
          'month': 'numeric', 
          'day': 'numeric',
          'patternFromOptions': patternFromOptions
        };
      },
      
      /**
     * Returns the current week in the year when provided a date.
     * @memberOf OraDateTimeConverter
     * @param {string} date - iso 8601 string. It may be in extended or 
     * non-extended form. http://en.wikipedia.org/wiki/ISO_8601
     * @return {number}. The current week in the year when provided a date.
     */
      calculateWeek : function(date)
      {
        var d = OraI18nUtils.isoToLocalDate(date);
        var time, checkDate = new Date(d.getTime());

        // Find Thursday of this week starting on Monday
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
        time = checkDate.getTime();
        checkDate.setMonth(0);// Compare with Jan 1
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
      }      
    };
  }
   
  return {
    /**
   * getInstance.
   * Returns the singleton instance of OraDateTimeConverter class.  
   * @memberOf OraDateTimeConverter
   * @return {Object} The singleton OraDateTimeConverter instance.
   */
    getInstance: function () {	 
      if ( !instance ) {
        instance = _init();
      }	 
      return instance;
    }	 
  };
}());
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Constructs a LengthValidator that ensures the value entered is within a given length. 
 * 
 * @param {Object=} options an object literal used to provide:<p>
 * @param {number=} options.min - a number that is the minimum length of the value.
 * @param {number=} options.max - a number that is the maximum length of the value.
 * @param {Object=} options.hint - an optional object literal of hints to be used. 
 * @param {string=} options.hint.max - a hint message to be used to indicate the allowed maximum. 
 * When not present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.hint.max</code>.<p>
 * Tokens: <br/>
 * {max} - the maximum<p>
 * Usage: <br/>
 * Enter {max} or fewer characters
 * @param {string=} options.hint.min - a hint message to be used to indicate the allowed minimum. 
 * When not present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.hint.min</code>.<p>
 * Tokens: <br/>
 * {min} the minimum<p>
 * Usage: <br/>
 * Enter {min} or more characters 
 * @param {string=} options.hint.inRange - a hint message to be used to indicate the allowed range. 
 * When not present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.hint.inRange</code>.<p>
 * Tokens: <br/>
 * {min} the minimum<p>
 * {max} - the maximum<p>
 * Usage: <br/>
 * Enter between {min} and {max} characters
 * @param {string=} options.hint.exact - a hint message to be used, to indicate the exact length. 
 * When not present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.hint.exact</code>.<p>
 * Tokens: <br/>
 * {length} the length<p>
 * Usage: <br/>
 * Enter {length} characters
 * @param {Object=} options.messageDetail - an optional object literal of custom error messages to 
 * be used.
 * @param {string=} options.messageDetail.tooLong - the detail error message to be used as the error 
 * message, when the length of the input value exceeds the maximum value set. When not present, the 
 * default detail message is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.messageDetail.tooLong</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {max} - the maximum allowed value<p>
 * Usage: <br/>
 * The {value} has too many characters. Enter {max} or fewer characters, not more.
 * @param {string=} options.messageDetail.tooShort - the detail error message to be used as the error 
 * message, when the length of the input value is less the minimum value set. When not present, the 
 * default detail message is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.messageDetail.tooShort</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {min} - the minimum allowed value<p>
 * Usage: <br/>
 * The {value} has too few characters. Enter {min} or more characters, not less.
 * @param {Object=} options.messageSummary - optional object literal of custom error summary message 
 * to be used. 
 * @param {string=} options.messageSummary.tooLong - the message to be used as the summary error 
 * message, when the length of the input value exceeds the maximum value set. When not present, the 
 * default message summary is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.messageSummary.tooLong</code>.
 * @param {string=} options.messageSummary.tooShort - the message to be used as the summary error 
 * message, when input value is less than the set minimum value. When not present, the default 
 * message summary is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.messageSummary.tooShort</code>.
 * @export
 * @constructor
 * @since 0.7
 */
oj.LengthValidator = function (options)
{
  this.Init(options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.LengthValidator, oj.Validator, "oj.LengthValidator");

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @export
 */
oj.LengthValidator.prototype.Init = function (options)
{
  oj.LengthValidator.superclass.Init.call(this);
  this._min = options["min"];
  this._max = options["max"];
  
  if (options)
  {
    this._hint = options['hint'] || {};
    this._customMessageSummary = options['messageSummary'] || {};
    this._customMessageDetail = options['messageDetail'] || {};

  }
};

oj.LengthValidator.prototype.getHint = function()
{
  var hint = null, hints = this._hint, 
      hintInRange = hints["inRange"], hintMinimum = hints["min"], 
      hintMaximum = hints["max"], hintExact = hints["exact"],
      translations = oj.Translations,
      min = this._min !== undefined ? parseInt(this._min, 10) : null, 
      max = this._max !== undefined ? parseInt(this._max, 10) : null, params;
	  
  if (min !== null && max !== null) 
  {
    if (min !== max)
    {
      params = {"min": min, "max": max};
      hint = hintInRange ? translations.applyParameters(hintInRange, params) : 
	                       translations.getTranslatedString('oj-validator.length.hint.inRange', params);
    }
    else
    {
      params = {'length': min};
      hint = hintExact ? translations.applyParameters(hintExact, params) :
                          translations.getTranslatedString('oj-validator.length.hint.exact', params);
    }
  }
  else if (min !== null)
  {
    params = {"min": min};
    hint = hintMinimum ?  translations.applyParameters(hintMinimum, params) :
	                      translations.getTranslatedString('oj-validator.length.hint.min', params);
  }
  else if (max !== null)
  {
    params = {"max": max};
    hint = hintMaximum ?  translations.applyParameters(hintMaximum, params) :
                          translations.getTranslatedString('oj-validator.length.hint.max', params);
  }

  return hint;
};

/**
 * Validates the length of vaue is greater than minimum and/or less than maximum.
 *
 * @param {string} value that is being validated
 * @returns {string} original if validation was successful
 *
 * @throws {Error} when the length is out of range.
 * @export
 */
oj.LengthValidator.prototype.validate  = function(value)
{
  var summary = "", detail = "", string = "" + value, length = string.length,
      customMessageDetail = this._customMessageDetail, 
      customMessageSummary = this._customMessageSummary,
      messageTooShort = customMessageDetail["tooShort"], 
      messageTooLong = customMessageDetail["tooLong"],
      messageSummaryTooShort = customMessageSummary["tooShort"], 
      messageSummaryTooLong = customMessageSummary["tooLong"],
      translations = oj.Translations, params,
      min = this._min !== undefined ? parseInt(this._min, 10) : null, 
      max = this._max !== undefined ? parseInt(this._max, 10) : null;
  
  // If only min is set and length is at least min, or 
  // if only max is set and length is at most max, or
  // if length is between min and max or
  // if neither min or max is set return with no error.
  if ((min === null || length >= this._min) &&
     ((max === null) || (length <= this._max)))
  {
    return string;
  }
  else
  {
    if (length < this._min) //too short
    {
      params = {"value": value, "min": min};
      summary = messageSummaryTooShort ? translations.applyParameters(messageSummaryTooShort, params) :
                  translations.getTranslatedString('oj-validator.length.messageSummary.tooShort');
      detail = messageTooShort ? translations.applyParameters(messageTooShort, params) : 
                  translations.getTranslatedString('oj-validator.length.messageDetail.tooShort', params);
    }
    else // too long
    {
      params = {"value": value, "max": max};
      summary = messageSummaryTooLong ? translations.applyParameters(messageSummaryTooLong, params) :
                  translations.getTranslatedString('oj-validator.length.messageSummary.tooLong');
      detail = messageTooLong ? translations.applyParameters(messageTooLong, params) : 
                    translations.getTranslatedString('oj-validator.length.messageDetail.tooLong', params);
    }
    
    throw new oj.ValidatorError(summary, detail);
  }
};
});
