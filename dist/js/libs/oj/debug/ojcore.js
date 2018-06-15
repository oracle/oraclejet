/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['require', 'ojL10n!ojtranslations/nls/ojtranslations', 'promise'], function(require, ojt, promise)
{
    promise['polyfill']();
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
/*jslint browser: true*/
/*global define: false,goog: true,self:true*/

/**
 * Defines the oj namespace
 */

/**
 * @private
 */
var _scope = {};

//  - check if the window object is available
// Note that the 'typeof' check  is required
if (typeof window !== 'undefined')
{
  _scope = window;
}
else if (typeof self !== 'undefined')
{
  _scope = self;
}

/**
 * @private
 */
var _oldVal = _scope['oj'];

var oj = _scope['oj'] =
{
  /**
   * @global
   * @member {string} version JET version numberr
   */
  'version': "5.1.0",
  /**
   * @global
   * @member {string} revision JET source code revision number
   */
  'revision': "2018-06-06_15-03-03",
          
  // This function is only meant to be used outside the library, so quoting the name
  // to avoid renaming is appropriate
  'noConflict': function()
  {
    _scope['oj'] = _oldVal;
  }

};
// Copyright (c) 2011, 2013, Oracle and/or its affiliates.
// All rights reserved.

/*jslint browser: true*/

/**
 * @class
 * @name oj.Logger
 * @hideconstructor
 * @since 1.0.0
 *
 * @classdesc
 * <h3>JET Logger</h3>
 *
 * <p>Logger object writes into the native browser console or a custom writer, if a custom writer is set as an option.
 * To use a custom writer, implement the following writer methods: log(), info(), warn(), error()
 *
 * <p>When any of the logging methods is called, it compares the requested log level with the value of a log level option
 * and logs the message if the log level is sufficient.
 *
 * <p>If the logging options are changed at a later point, the Logger will use the modified options for the subsequent log operations.
 *
 * <p>All the logging methods support string formatting, accept variable number of arguments and accept a function as a parameter.
 * When a callback function is specified as a parameter the function will be called if the log level is sufficient.
 *
 * <h3> Usage : </h3>
 * <pre class="prettyprint">
 * <code>
 * //optional calls, see defaults
 * oj.Logger.option("level",  oj.Logger.LEVEL_INFO);
 * oj.Logger.option("writer",  customWriter);  //an object that implements the following methods: log(), info(), warn(), error()
 *
 * // logging a message
 * oj.Logger.info("My log level is %d", oj.Logger.option("level"));  // string formatting
 * oj.Logger.warn("Beware of bugs", "in the above code");            // multiple parameters
 *
 * // using a callback function as a parameter
 * oj.Logger.info(function(){
 *    var foo = "This ";
 *    var bar = "is ";
 *    var zing = "a function";
 *    return foo + bar + zing;
 * });
 * </code></pre>
 *
 * @desc
 * oj.Logger cannot be instantiated
 * @export
 */
oj.Logger = {};
/**
 * Log level none
 * @const
 * @export
 * @type {number}
 * @memberof oj.Logger
 */
oj.Logger.LEVEL_NONE = 0;
/**
 * Log level error
 * @const
 * @type {number}
 * @export
 * @memberof oj.Logger
 */
oj.Logger.LEVEL_ERROR = 1;
/**
 * Log level warning
 * @const
 * @type {number}
 * @export
 * @memberof oj.Logger
 */
oj.Logger.LEVEL_WARN = 2;
/**
 * Log level info
 * @const
 * @type {number}
 * @export
 * @memberof oj.Logger
 */
oj.Logger.LEVEL_INFO = 3;
/**
 * Log level - general message
 * @const
 * @type {number}
 * @export
 * @memberof oj.Logger
 */
oj.Logger.LEVEL_LOG = 4;

/* private constants*/
oj.Logger._METHOD_ERROR = "error";
oj.Logger._METHOD_WARN = "warn";
oj.Logger._METHOD_INFO = "info";
oj.Logger._METHOD_LOG = "log";
oj.Logger._defaultOptions = {'level': oj.Logger.LEVEL_ERROR, 'writer': null};
oj.Logger._options = oj.Logger._defaultOptions;


/*public members*/
/**
 * Writes an error message.
 * @param {...(Object|string|number)} args The method supports a variable number of arguments, string substitutions and accepts a function as a parameter.
 *                                See examples in the overview section above.
 * @return {void}
 * @export
 * @memberof oj.Logger
 * @since 1.0.0
 */
oj.Logger.error = function(args)
{
  oj.Logger._write(oj.Logger.LEVEL_ERROR, oj.Logger._METHOD_ERROR, arguments);
};

/**
 * Writes an informational  message.
 * @param {...(Object|string|number)} args The method supports a variable number of arguments, string substitutions and accepts a function as a parameter.
 *                                See examples in the overview section above.
 * @return {void}
 * @export
 * @memberof oj.Logger
 * @since 1.0.0
 */
oj.Logger.info = function(args)
{
  oj.Logger._write(oj.Logger.LEVEL_INFO, oj.Logger._METHOD_INFO, arguments);
};

/**
 * Writes a warning message.
 * @param {...(Object|string|number)} args The method supports a variable number of arguments, string substitutions and accepts a function as a parameter.
 *                                See examples in the overview section above.
 * @export
 * @return {void}
 * @memberof oj.Logger
 * @since 1.0.0
 */
oj.Logger.warn = function(args)
{
  oj.Logger._write(oj.Logger.LEVEL_WARN, oj.Logger._METHOD_WARN, arguments);
};

/**
 * Writes a general message.
 * @param {...(Object|string|number)} args The method supports a variable number of arguments, string substitutions and accepts a function as a parameter.
 *                                See examples in the overview section above.
 * @return {void}
 * @export
 * @memberof oj.Logger
 * @since 1.0.0
 */
oj.Logger.log = function(args)
{
  oj.Logger._write(oj.Logger.LEVEL_LOG, oj.Logger._METHOD_LOG, arguments);
};

/**
 * Method for setting and getting logger option/options
 * <p>Sets/gets logger configuration - level and/or writer. Accepts variable number of arguments.
 * <p><h5>Defaults:</h5>
 * Default level: oj.Logger.LEVEL_ERROR<br/>
 * Default writer: null; writes to the console
 * <p><h5>Usages:</h5>
 * <i>oj.Logger.option(optionName)</i> gets the value associated the the specified optionName<br/>
 * <i>oj.Logger.option()</i> gets an object containing key/value pairs representing the logger options hash<br/>
 * <i>oj.Logger.option(optionName, value)</i> sets  the option value associated with optionName<br/>
 * <i>oj.Logger.option(options)</i> sets  one or more options for the logger
 *
 * @example <caption>Overriding default options</caption>
 * oj.Logger.option("level",  oj.Logger.LEVEL_INFO);
 * oj.Logger.option("writer",  customWriter);  //an object that implements the following methods: log(), info(), warn(), error()
 *
 * @param {Object|string} [key]
 * @param {any} [value]
 * @ojsignature {target: "Type", for: "returns", value: "any"}
 * @export
 * @memberof oj.Logger
 * @since 1.0.0
 */
oj.Logger.option = function (key, value)
{
  //getters
  var ret = {}, opt;
  if (arguments.length == 0) {
     for (opt in oj.Logger._options) {
      if (oj.Logger._options.hasOwnProperty(opt)) {
        ret[opt]=oj.Logger._options[opt];
      }
     }
     return ret;
  }
  if (typeof key === "string" && value === undefined) {
     return oj.Logger._options[key] === undefined ? null : oj.Logger._options[key];
  }

  //setters
  if (typeof key === "string") {
    oj.Logger._options[key] = value;
  }
  else { // case when all options are set in one call
    var options = key;
    for (opt in options) {
      if (options.hasOwnProperty(opt)) {
        oj.Logger.option(opt, options[opt]);
      }
    }
  }
};

/* private members*/
/*
 * Helper method - calls a specified method on the available writer (console or custom)
 * if the logging level is sufficient
 */
oj.Logger._write = function(level, method, args)
{
  if (oj.Logger.option("level") < level) {
    return;
  }

  var writer = oj.Logger._getWriter();
  if (writer != null) {
    if (args.length == 1 && (args[0] instanceof Function)) {
      var msg = args[0]();
      args = [msg];
    }
    if (writer[method] && writer[method].apply) {
      writer[method].apply(writer, args);
    }
    else if (writer[method]) {
      writer[method] = Function.prototype.bind.call(writer[method], writer);
      oj.Logger._write(level, method, args);
    }
  }
};

/*
 * Helper method - returns available writer (console or custom)
 */
oj.Logger._getWriter = function()
{
  var writer = null;
  if (oj.Logger.option("writer")) {
    writer =  oj.Logger.option("writer");
  }
  else if (typeof window !== 'undefined' && window.console !== undefined) {
    writer = window.console;
  }
  return writer;
};

/*
 * Helper method - validates an option against default options
 * Returns true if the option(key) is a default option
 */
oj.Logger._validateOption = function(key)
{
  return oj.Logger._defaultOptions[key] !== undefined;
};
/*
** Copyright (c) 2008, 2014, Oracle and/or its affiliates. All rights reserved.
**
**34567890123456789012345678901234567890123456789012345678901234567890123456789
*/

/**
 * @private
 */
var _checkpointManagerDelegate = _scope['__ojCheckpointManager'];

/**
 * Global Checkpoint Manager Instance
 * @const
 * @export
 * @ignore
 */
oj.CHECKPOINT_MANAGER = {};

/**
 * Starts a checkpoint
 * @param {!string} name - the name of the checkpoint
 * @param {string=} description - optional description of the checkpoint
 * @export
 * @memberof! oj.CHECKPOINT_MANAGER
 */
oj.CHECKPOINT_MANAGER.startCheckpoint = function (name, description)
{
  if (_checkpointManagerDelegate)
  {
    _checkpointManagerDelegate['startCheckpoint'](name, description);
  }
};

/**
 * Ends a checkpoint
 * @param {!string} name - the name of the checkpoint
 * @export
 * @memberof! oj.CHECKPOINT_MANAGER
 */
oj.CHECKPOINT_MANAGER.endCheckpoint = function (name)
{
  if (_checkpointManagerDelegate)
  {
    _checkpointManagerDelegate['endCheckpoint'](name);
  }
};

/**
 * Retrieves a checkpoint record for a given name
 * @param {!string} name - the name of the checkpoint
 * @return {undefined|{start: number, end: number, duration: number, name: {string}, description: (string|undefined)}}
 * @export
 * @memberof! oj.CHECKPOINT_MANAGER
 */
oj.CHECKPOINT_MANAGER.getRecord = function (name)
{
  return _checkpointManagerDelegate ? _checkpointManagerDelegate['getRecord'](name) : undefined;
};

/**
 * Retrieves all checkpoint records matching a regular expression
 * @param {!RegExp} regexp - regular expression to match.
 * @return Array.{{start: number, end: number, duration: number, name: {string}, description: (string|undefined)}}
 * @export
 * @memberof! oj.CHECKPOINT_MANAGER
 */
oj.CHECKPOINT_MANAGER.matchRecords = function (regexp)
{
  return _checkpointManagerDelegate ? _checkpointManagerDelegate['matchRecords'](regexp) : [];
};

/**
 * Dumps matched records into oj.Logger
 * @param {!RegExp} regexp - regular expression for the records to dump.
 * @export
 * @memberof! oj.CHECKPOINT_MANAGER
 */
oj.CHECKPOINT_MANAGER.dump = function (regexp)
{
  oj.Logger.info(
    function()
    {
      var logMsg = "Checkpoint Records:";
      var records = oj.CHECKPOINT_MANAGER.matchRecords(regexp);
      for (var i=0; i<records.length; i++)
      {
        var record = records[i];
        logMsg = logMsg + '\n' + record['name'];
        var desc = record['description'];
        if (desc != null)
        {
          logMsg = logMsg + ' (' + desc + ')';
        }
        logMsg += ':\n';
        logMsg  = logMsg + 'start: ' + record['start'] + '\t' + 'duration: ' + record['duration'];
      }
      return logMsg;
    }
  );
}
/*
** Copyright (c) 2008, 2012, Oracle and/or its affiliates. All rights reserved.
**
**34567890123456789012345678901234567890123456789012345678901234567890123456789
*/
/*jslint browser: true*/
/*global define: false,goog: true*/

/**
 * Base class of all OJET Objects.
 * <p>
 * To create a subclass of another oj.Object, use oj.Object.createSubclass.
 * The subclass can specify class-level initialization by implementing an
 * <code>InitClass()</code> method on its constructor.  <code>InitClass</code>
 * is guaranteed to be called only once per class.  Further, a class'
 * <code>InitClass</code> method is guranteed to be called only after its
 * superclass' class initialization has been called.  When <code>InitClass</code>
 * is called, <code>this</code> is the class' constructor.  This allows class
 * initialization implementations to be shared in some cases.
 * </p>
 */


/**
 * @constructor oj.Object
 * @since 1.0
 * @export
 */
oj.Object = function()
{
  this.Init();
};

oj.Object.superclass = null;

/**
 * @private
 */
oj.Object._typeName = "oj.Object";

// regular expressicloneon for stripping out the name of a function
/**
 * @private
 */
oj.Object._GET_FUNCTION_NAME_REGEXP = /function\s+([\w\$][\w\$\d]*)\s*\(/;
// oj.Object._TRIM_REGEXP = /(^\s*)|(\s*$)/g; this.replace(/(^\s*)|(\s*$)/g, "");

oj.Object.prototype = {};
oj.Object.prototype.constructor = oj.Object;


/**
 * Creates a subclass of a baseClass
 * @method createSubclass
 * @memberof oj.Object
 * @param {Object} extendingClass The class to extend from the base class
 * @param {Object} baseClass class to make the superclass of extendingClass
 * @param {string=} typeName to use for new class.  If not specified, the typeName will be extracted from the
 * baseClass's function if possible
 * @return {void}
 * @export
 */
oj.Object.createSubclass = function(
  extendingClass,
  baseClass,
  typeName)  // optional name to name this class
{
  oj.Assert.assertFunction(extendingClass);
  oj.Assert.assertFunctionOrNull(baseClass);
  oj.Assert.assertStringOrNull(typeName);

  if (baseClass === undefined)
  {
    // assume oj.Object
    baseClass = oj.Object;
  }

  oj.Assert.assert(extendingClass !== baseClass, "Class can't extend itself");

  // use a temporary constructor to get our superclass as our prototype
  // without out having to initialize the superclass
  /**
   * @private
   * @constructor
   */
  var TempConstructor = oj.Object._tempSubclassConstructor;

  TempConstructor.prototype = baseClass.prototype;
  extendingClass.prototype = new TempConstructor();

  extendingClass.prototype.constructor = extendingClass;
  extendingClass.superclass = extendingClass["superclass"] = baseClass.prototype;

  if (typeName) {
    extendingClass._typeName = typeName;
  }
};

/**
 * Copies properties from the source object to the prototype of the target class
 * Only properties 'owned' by the source object will be copied, i.e. the properties
 * from the source object's prototype chain will not be included.
 * To copy properties from another class with methods defined on the prototype, pass
 * otherClass.prototype as the source.
 * @method copyPropertiesForClass
 * @memberof oj.Object
 * @param {Object} targetClass - the function whose prototype will be used a
 * copy target
 * @param {Object} source - object whose properties will be copied
 * @return {void}
 * @export
 */
oj.Object.copyPropertiesForClass = function(targetClass, source)
{
  var prop;
  oj.Assert.assertFunction(targetClass);
  oj.Assert.assert(source != null, "source object cannot be null");

  for(prop in source)
  {
    if(source.hasOwnProperty(prop))
    {
      targetClass.prototype[prop] = source[prop];
    }
  }
};

/**
 * @private
 */
oj.Object._tempSubclassConstructor = function(){};




/**
 * Returns the class object for the instance
 * @method getClass
 * @memberof oj.Object
 * @instance
 * @param {Object=} otherInstance - if specified, the instance whose type
 * should be returned. Otherwise the type of this instance will be returned
 * @return {Object} the class object for the instance
 * @final
 * @export
 */
oj.Object.prototype.getClass = function(
  otherInstance)
{
  if (otherInstance === undefined) {
    otherInstance = this;
  }
  else if (otherInstance === null)
  {
    return null;
  }
  return otherInstance["constructor"];
};


/**
 * Returns a clone of this object.  The default implementation is a shallow
 * copy.  Subclassers can override this method to implement a deep copy.
 * @method clone
 * @memberof oj.Object
 * @instance
 * @return {Object} a clone of this object
 * @export
 */
oj.Object.prototype.clone = function()
{
  var clone = new this.constructor();

  oj.CollectionUtils.copyInto(clone, this);

  return clone;
};

/**
 * @export
 * @method toString
 * @memberof oj.Object
 * @instance
 * @return {string}
 */
oj.Object.prototype.toString = function()
{
  return this.toDebugString();
};

/**
 * @export
 * @method toDebugString
 * @memberof oj.Object
 * @instance
 * @return {string}
 */
oj.Object.prototype.toDebugString = function()
{
  return this.getTypeName() + " Object";
};


/**
 * Returns the type name for a class derived from oj.Object
 * @method getTypeName
 * @memberof oj.Object
 * @instance
 * @param {Object|null} clazz Class to get the name of
 * @return {string} name of the Class
 * @export
 */
oj.Object.getTypeName = function(clazz)
{
  oj.Assert.assertFunction(clazz);

  var typeName = clazz._typeName, constructorText, matches;

  if (typeName == null)
  {
    constructorText = clazz.toString();
    matches = oj.Object._GET_FUNCTION_NAME_REGEXP.exec(constructorText);

    if (matches)
    {
      typeName = matches[1];
    }
    else
    {
      typeName = "anonymous";
    }

    // cache the result on the function
    clazz._typeName = typeName;
  }

  return typeName;
};

/**
 * Returns the type name for this instance
 * @method getTypeName
 * @memberof oj.Object
 * @return {string} name of the Class
 * @final
 * @export
 */
oj.Object.prototype.getTypeName = function()
{
  return oj.Object.getTypeName(this.constructor);
};

/**
 * Initializes the instance.  Subclasses of oj.Object must call
 * their superclass' Init
 * @export
 * @method Init
 * @return {void}
 * @memberof oj.Object
 * @instance
 */
oj.Object.prototype.Init = function()
{
  if (oj.Assert.isDebug()) {
    oj.Assert.assert(this["getTypeName"], "Not an oj.Object");
  }

  // do any class initialization.  This code is duplicated from
  // oj.Object.ensureClassInitialization()

  var currClass = this.constructor;
  if (!currClass._initialized) {
    oj.Object._initClasses(currClass);
  }
};

/**
 * Ensures that a class is initialized.  Although class initialization occurs
 * by default the first time that an instance of a class is created, classes that
 * use static factory methods to create their instances may
 * still need to ensure that their class has been initialized when the factory
 * method is called.
 *
 * @method ensureClassInitialization
 * @memberof oj.Object
 * @param {Object} clazz The class to ensure initialization of
 * @return {void}
 * @export
 */
oj.Object.ensureClassInitialization = function(clazz)
{
  oj.Assert.assertFunction(clazz);

  if (!clazz._initialized) {
    oj.Object._initClasses(clazz);
  }
};


/**
 * Indicates whether some other oj.Object is "equal to" this one.
 * Method is equivalent to java ".equals()" method.
 * @method equals
 * @memberof oj.Object
 * @instance
 * @param {Object} object - comparison target
 * @return {boolean} true if if the comparison target is equal to this object, false otherwise
 * @export
 */
oj.Object.prototype.equals = function(
  object)
{
  return this === object;
};

/**
 * Binds the supplied callback function to an object
 * @method createCallback
 * @memberof oj.Object
 * @param {!Object} obj - object that will be available to the supplied callback
 * function as 'this'
 * @param {!Object} func - the original callback
 * @return {function()} a function that will be invoking the original callback with
 * 'this' object assigned to obj
 * @ojsignature {target: "Type", for: "returns", value: "()=>any"}
 * @export
 */
oj.Object.createCallback = function(obj, func)
{
  oj.Assert.assertFunction(func);

  // All browsers supported by JET support bind() method
  return func.bind(obj);
};


/**
 * @private
 */
oj.Object._initClasses = function(currClass)
{
  if (oj.Assert.isDebug())
  {
    oj.Assert.assertFunction(currClass);
    oj.Assert.assert(!currClass._initialized);
  }

  currClass._initialized = true;

  var superclass = currClass.superclass, superclassConstructor, typeName, InitClassFunc;

  // initialize the superclass if necessary
  if (superclass)
  {
    superclassConstructor = superclass.constructor;

    if (superclassConstructor && !superclassConstructor._initialized) {
      oj.Object._initClasses(superclassConstructor);
    }

  }


  // if the class has an initialization function, call it
  InitClassFunc = currClass.InitClass

  if (InitClassFunc)
  {
    InitClassFunc.call(currClass);
  }
};

/**
 * Compares 2 values using strict equality except for the case of
 * <ol>
 *   <li> Array [order matters]; will traverse through the arrays and compare oj.Object.compareValues(array[i], array2[i]) </li>
 *   <li> Instances that support valueOf [i.e. Boolean, String, Number, Date, and etc] will be compared by usage of that function </li>
 * </ol>
 * @param {any} obj1 The first value to compare.
 * @param {any} obj2 The second value to compare.
 * @return {boolean}
 * @public
 * @export
 * @method compareValues
 * @memberof oj.Object
 */
oj.Object.compareValues = function (obj1, obj2)
{
  if (obj1 === obj2)
  {
    return true;
  }

  var obj1Type = typeof obj1,
      obj2Type = typeof obj2;

  if (obj1Type !== obj2Type)
  {
    //of different type so consider them unequal
    return false;
  }

  //At this point means the types are equal

  //note that if the operand is an array or a null then typeof is an object
  //check if either is null and if so return false [i.e. case where one might be a null and another an object]
  //and one wishes to avoid the null pointer in the following checks. Note that null === null has been already tested
  if(obj1 === null || obj2 === null)
  {
    return false;
  }

  //now check for constructor since I think by here one has ruled out primitive values and if the constructors
  //aren't equal then return false
  if(obj1.constructor === obj2.constructor)
  {

    //these are special cases and will need to be modded on a need to have basis
    if(Array.isArray(obj1))
    {
      return oj.Object._compareArrayValues(obj1, obj2);
    }
    else if(obj1.constructor === Object)
    {
      //for now invoke innerEquals and in the future if there are issues then resolve them
      return oj.Object.__innerEquals(obj1, obj2);
    }
    else if(obj1["valueOf"] && typeof obj1["valueOf"] === "function")
    {
      //test cases for Boolean, String, Number, Date
      //Note if some future JavaScript constructors
      //do not impl it then it's their fault
      return obj1.valueOf() === obj2.valueOf();
    }

  }

  return false;
};

oj.Object._compareArrayValues = function (array1, array2)
{
  if (array1.length !== array2.length)
  {
    return false;
  }

  for (var i = 0, j = array1.length;i < j;i++)
  {
    //recurse on each of the values, order does matter for our case since do not wish to search
    //for the value [expensive]
    if (!oj.Object.compareValues(array1[i], array2[i]))
    {
      return false;
    }
  }
  return true;
}

//Comparion of two Objects containing id and or index properties. 
//Note: it returns false if one is an id and other is an index
//if ids are the same, index will be ignored if there is only one is provided
oj.Object._compareIdIndexObject = function (obj1, obj2)
{
  if ((typeof obj1 === "number" && typeof obj2 === "number") ||
      (typeof obj1 === "string" && typeof obj2 === "string"))
  {
    return obj1 == obj2;
  }

  if (typeof obj1 === "object" && typeof obj2 === "object")
  {
    if (obj1["id"] && obj2["id"])
    {
      if (obj1["id"] != obj2["id"])
        return false;

      if (obj1["index"] && obj2["index"])
        return obj1["index"] == obj2["index"];

      return true;
    }
    else if (obj1["index"] && obj2["index"])
    {
      return obj1["index"] == obj2["index"];
    }
  }

  return false;  
};


//Comparion of two arrays containing ids, indexes, or objects where each object has id, 
//index or both properties.
//order needn't be same but no duplicates
oj.Object._compareArrayIdIndexObject = function (array1, array2)
{
  //null and [] are equals
  if (!array1)
    return (!array2 || array2.length == 0);

  if (!array2)
    return (!array1 || array1.length == 0);

  if (array1.length != array2.length)
    return false;

  for (var i = 0; i < array1.length; i++)
  {
    var found = false;
    for (var j = 0; j < array2.length; j++)
    {
      if (oj.Object._compareIdIndexObject (array1[i], array2[j]))
      {
        found = true;
        break;
      }
    }
    if (! found)
      return false;
  }

  return true;
};


oj.Object.__innerEquals = function (obj1, obj2) {
  var prop, hasProperties = false;

  if (obj1 === obj2) {
    return true;
  }

  if (!(obj1 instanceof Object) || !(obj2 instanceof Object)) {
    return false;
  }

  if (obj1.constructor !== obj2.constructor)
  {
    return false;
  }

  for (prop in obj1)
  {
    if (!hasProperties)
    {
      hasProperties = true;
    }
    if (obj1.hasOwnProperty(prop)) {
      if (!obj2.hasOwnProperty(prop))
      {
        return false;
      }

      if (obj1[prop] !== obj2[prop])
      {
        if (typeof(obj1[prop]) !== 'object') {
          return false;
        }

        if (!oj.Object.__innerEquals(obj1[prop], obj2[prop]))
        {
          return false;
        }
      }
    }
  }

  for (prop in obj2)
  {
    if (!hasProperties)
    {
      hasProperties = true;
    }

    if (obj2.hasOwnProperty(prop) && !obj1.hasOwnProperty(prop)) {
      return false;
    }
  }

  if (!hasProperties)
  {
    // we are dealing with objects that have no properties like Number or Date.
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  return true;
};

/**
 * @method isEmpty
 * @return {boolean}
 * @memberof oj.Object
 */
oj.Object.isEmpty = function(object) {
    var prop;
    // Test if an object is empty
    if (object === undefined || object === null) {
        return true;
    }

    for (prop in object) {
        if (object.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
};


/**
 * @private
 * @return  {boolean} true if AMD Loader (such as Require.js) is present,
 *                    false otherwise
 */
oj.__isAmdLoaderPresent = function()
{
  return (typeof define === 'function' && define['amd']);
};



/*
** Copyright (c) 2008, 2011, Oracle and/or its affiliates. All rights reserved.
*/

/*jslint browser: true*/

/**
 * Assertion utilities.
 * The container is expected to have already initialized the oj.Assert Object before this
 * code is executed and initialized the oj.Assert.DEBUG flag/
 * @class
 * @export
 * @ignore
 */
oj.Assert = {};

/**
 * @private
 */
var _DEBUG = 'DEBUG';

/**
 * Forces DEBUG to be set to true
 * @export
 * @memberof oj.Assert
 */
oj.Assert.forceDebug = function()
{
  oj.Assert[_DEBUG] = true;
};

/**
 * Forces DEBUG to be set to false
 * @export
 * @memberof oj.Assert
 */
oj.Assert.clearDebug = function() {
  oj.Assert[_DEBUG] = false;
};

/**
 * Determines whether oj.Assert is running in debug mode
 * @return {boolean} true for debug mode, false otherwise
 * @export
 * @memberof oj.Assert
 */
oj.Assert.isDebug = function()
{
  return oj.Assert[_DEBUG] == true;
}


/**
 * Asserts that a condition is true.  If the condition does not
 * evaluate to true, an exception is thrown with the optional message
 * and reason
 * @param {boolean} condition condition to test
 * @param {string=} message message to display
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assert = function(
  condition,
  message
  )
{
  if (oj.Assert[_DEBUG] && !condition)
  {
    var myMessage = message || "", i;
    if (arguments.length > 2)
    {      
      myMessage += "(";
      for(i=2; i<arguments.length; i=i+1)
      {
        myMessage += arguments[i];
      }
      myMessage += ")";
    }
    oj.Assert.assertionFailed(myMessage, 1);
  }
};

/**
 * Convenience function for asserting when an abstact function is called
 * @export
 * @memberof oj.Assert
 */
oj.Assert.failedInAbstractFunction = function()
{
  if (oj.Assert[_DEBUG])
  {
    oj.Assert.assertionFailed("Abstract function called", 1);
  }
};



/**
 * Asserts that the the target object has the same prototype as the example
 * type
 * @param {Object} target description
 * @param {Function} theConstructor
 * @param {string=} reason
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertPrototype = function(
  target,
  theConstructor,
  reason
  )
{
  var thePrototype;
  
  if (oj.Assert[_DEBUG])
  {
    if (target != null)
    {
      oj.Assert.assertType(theConstructor, "function", null, 1, false);
      thePrototype = theConstructor.prototype;
    
      if (!thePrototype.isPrototypeOf(target))
      {
        oj.Assert.assertionFailed("object '" + target + "' doesn't match prototype "
                               + thePrototype,
                               1,
                               reason);
      }
    }
    else
    {
      oj.Assert.assertionFailed("null object doesn't match prototype " + thePrototype, 1, reason);
    }
  }
};

/**
 * Asserts that the the target object has the same prototype as the example
 * type or is null.
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertPrototypeOrNull = function(
  target,
  theConstructor,
  reason
  )
{
  var thePrototype;
  
  if (oj.Assert[_DEBUG] && (target != null))
  {
    if (target != null)
    {
      oj.Assert.assertType(theConstructor, "function", null, 1, false);
      thePrototype = theConstructor.prototype;
    
      if (!thePrototype.isPrototypeOf(target))
      {
        oj.Assert.assertionFailed("object '" + target + "' doesn't match prototype "
                               + thePrototype,
                               1,
                               reason);
      }
    }
    else
    {
      oj.Assert.assertionFailed("null object doesn't match prototype " + thePrototype, 1, reason);
    }
  }
};

/**
 * Asserts that the the target object has the same prototype as the example
 * types
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertPrototypes = function(
  target,
  instanceOne,
  instanceTwo,
  reason
  )
{
  if (oj.Assert[_DEBUG])
  {
    var thePrototype = instanceOne.prototype, thePrototypeTwo = instanceTwo.prototype;
    
    if (!(thePrototype.isPrototypeOf(target) ||
          thePrototypeTwo.isPrototypeOf(target)))
    {
      oj.Assert.assertionFailed("object '" + target + "' doesn't match prototype "
                             + thePrototype + " or " + thePrototypeTwo,
                             1,
                             reason);
    }
  }
};


/**
 * Asserts that the target is a DOM Node or Null
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertDomNodeOrNull = function(target, depth)
{
  if (oj.Assert[_DEBUG] && target)
  {
    if (target["nodeType"] === undefined)
    {
      oj.Assert.assertionFailed(target + " is not a DOM Node", depth + 1);
    }
  }
};

/**
 * Asserts that the target is a DOM Node
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertDomNode = function(target, depth)
{
  if (oj.Assert[_DEBUG])
  {
    if (!target || (target["nodeType"] === undefined))
    {
      oj.Assert.assertionFailed(target + " is not a DOM Node", depth + 1);
    }
  }
};

/**
 * Asserts that the target is a DOM Element and optionally has the specified
 * element name
 * @param {Object} target target object
 * @param {string=} nodeName name of the element
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertDomElement = function(target, nodeName)
{
  if (oj.Assert[_DEBUG])
  {
    oj.Assert.assertDomNode(target, 1);

    if (target.nodeType !== 1)
    {
      oj.Assert.assertionFailed(target + " is not a DOM Element", 1);
    }
    else if (nodeName && (target.nodeName !== nodeName))
    {      
      oj.Assert.assertionFailed(target + " is not a " + nodeName + " Element", 1);
    }
  }
};

/**
 * Asserts that the target is a DOM Element and optionally has the specified
 * element name
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertDomElementOrNull = function(target, nodeName)
{
  if (oj.Assert[_DEBUG] && (target != null))
  {
    oj.Assert.assertDomNode(target, 1);

    if (target.nodeType !== 1)
    {
      oj.Assert.assertionFailed(target + " is not a DOM Element", 1);
    }
    else if (nodeName && (target.nodeName !== nodeName))
    {
      oj.Assert.assertionFailed(target + " is not a " + nodeName + " Element", 1);
    }
  }
};


/**
 * Asserts that the target object has the typeof specified
 * 
 * @param {Object|null|string|undefined} target 
 * @param {string} type typeof type that statisfies this condition
 * @param {string|undefined|null} prefix
 * @param {number} depth stack depth to skip when printing stack traces
 * @param {boolean} nullOK true if a null value satisfies this condition
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertType = function(target,type,prefix,depth, nullOK)
{
  if (oj.Assert[_DEBUG])
  {
    // either the target is null and null is OK, or the target better
    // be of the correct type
    var message, targetType = typeof target;
    if (!(((target == null) && nullOK) || (targetType === type)))
    {
      message = target + " is not of type " + type;
      
      if (prefix) {
        message = prefix + message;
      }
        
      if (!depth) {
        depth = 0;
      }
        
      oj.Assert.assertionFailed(message, depth + 1);
    }
  }
};

/**
 * Asserts that the target is an Object
 * @param {Object} target description
 * @param {string=} prefix
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertObject = function(target, prefix)
{
  if (oj.Assert[_DEBUG])
  {
    oj.Assert.assertType(target, "object", prefix, 1, false);
  }
};

/**
 * Asserts that the target is an Object or null
 * @param {Object} target description
 * @param {string=} prefix
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertObjectOrNull = function(target, prefix)
{
  if (oj.Assert[_DEBUG])
  {
    oj.Assert.assertType(target, "object", prefix, 1, true);
  }
};

/**
 * Asserts that the target is a non-empty String
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertNonEmptyString = function(target, prefix)
{
  if (oj.Assert[_DEBUG])
  {
    oj.Assert.assertType(target, "string", prefix, 1, false);
    oj.Assert.assert(target.length > 0, "empty string"); 
  }
};

/**
 * Asserts that the target is a String
 * @param target target object
 * @param {string=} prefix prefix string
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertString = function(target, prefix)
{
  if (oj.Assert[_DEBUG])
  {
    oj.Assert.assertType(target, "string", prefix, 1, false);
  }
};

/**
 * Asserts that the target is a String or null
 * @param {string|null|undefined|Object} target target object
 * @param {string=} prefix prefix string
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertStringOrNull = function(target, prefix)
{
  if (oj.Assert[_DEBUG])
  {
    oj.Assert.assertType(target, "string", prefix, 1, true);
  }
};

/**
 * Asserts that the target is a Function
 * @param {Object} target target object
 * @param {string=} prefix prefix string
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertFunction = function(target, prefix)
{
  if (oj.Assert[_DEBUG])
  {
    oj.Assert.assertType(target, "function", prefix, 1, false);
  }
};

/**
 * Asserts that the target is a Function or null
 * @param {Object} target target object
 * @param {string=} prefix prefix
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertFunctionOrNull = function(target, prefix)
{
  if (oj.Assert[_DEBUG])
  {
    oj.Assert.assertType(target, "function", prefix, 1, true);
  }
};

/**
 * Asserts that the target is a boolean 
 * @param {Object} target description
 * @param {string=} prefix
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertBoolean = function(target, prefix)
{
  if (oj.Assert[_DEBUG])
  {
    oj.Assert.assertType(target, "boolean", prefix, 1, false);
  }
};

/**
 * Asserts that the target is a number
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertNumber = function(target, prefix)
{
  if (oj.Assert[_DEBUG])
  {
    oj.Assert.assertType(target, "number", prefix, 1, false);
  }
};

/**
 * Asserts that the target is a number or Null
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertNumberOrNull = function(target, prefix)
{
  if (oj.Assert[_DEBUG])
  {
    oj.Assert.assertType(target, "number", prefix, 1, true);
  }
};


/**
 * Asserts that the target object is an Array
 * @param {Object} target target object
 * @param {string=} message optional message
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertArray = function(
  target,
  message
  )
{
  if (oj.Assert[_DEBUG])
  {
    if (!Array.isArray(target))
    {
      if (message === undefined) {
        message = target + " is not an array";
      }
        
      oj.Assert.assertionFailed(message, 1);
    }
  }
};

/**
 * Asserts that the target object is an Array or null
 * @param {Object} target target object
 * @param {string=} message optional message
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertArrayOrNull = function(
  target,
  message)
{
  if (oj.Assert[_DEBUG] && (target != null))
  {
    if (!Array.isArray(target))
    {
      if (message === undefined) {
        message = target + " is not an array";
      }
        
      oj.Assert.assertionFailed(message, 1);
    }
  }
};


/**
 * Asserts that the target object is not either a number, or convertible to a number
 * @param {Object} target target object
 * @param {string=} message optional message
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertNonNumeric = function(
  target,
  message
  )
{
  if (oj.Assert[_DEBUG])
  { 
    if (!isNaN(target))
    {
      if (message === undefined) {
        message = target + " is convertible to a number";
      }
        
      oj.Assert.assertionFailed(message, 1);
    }
  }
};

/**
 * Asserts that the target object is either a number, or convertible to a number
 * @param {Object} target target object
 * @param {string=} message optional message
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertNumeric = function(
  target,
  message
  )
{
  if (oj.Assert[_DEBUG])
  {
    if (isNaN(target))
    {
      if (message === undefined) {
        message = target + " is not convertible to a number";
      }
        
      oj.Assert.assertionFailed(message, 1);
    }
  }
};

/**
 * Asserts that value String is in the Set
 * @param {Object} value value to check
 * @param {Object} set set to check
 * @param {string=} message optional message
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertInSet = function(
  value,
  set,
  message)
{
  var keyString, k;
  if ((value == null) || (set[value.toString()] === undefined))
  {
    if (message === undefined)
    {
      keyString = " is not in set: {";
      
      for (k in set)
      {
        if (set.hasOwnProperty(k)) {
            keyString += k;
            keyString += ",";
        }
      }
      
      keyString += "}";
      
      message = value + keyString;
    }
      
    oj.Assert.assertionFailed(message, 1);
  }
};

/**
 * Base assertion failure support that supports specifying the stack skipping
 * level
 * @param {string} message Message to display
 * @param {number} skipLevel assertion level
 * @param {string=} reason reason to display
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertionFailed = function(
  message,
  skipLevel,
  reason)
{  
  if (!skipLevel) {
    skipLevel = 0;
  }

  var errorMessage = "Assertion", stackTrace, stackTraceString, error;
  
  if (reason)
  {
    errorMessage += " (" + reason + ")";
  }
  
  errorMessage += " failed: ";
  
  if (message !== undefined)
  {
    errorMessage += message;
  }
    
  error = new Error(errorMessage);
  

  throw error;
};

/**
 * @private
 * @memberof oj.Assert
 */
var _assertSetting = _scope['__oj_Assert_DEBUG'];

if (_assertSetting !== undefined)
{
  oj.Assert[_DEBUG] = _assertSetting;
}

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/*jslint browser: true*/

/**
 * @export
 * @class oj.EventSource
 * @classdesc Object which supports subscribing to and firing events
 * @constructor
 * @since 1.1
 */
oj.EventSource = function()
{
    this.Init();
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.EventSource, oj.Object, "oj.EventSource");

/**
 * Initializes the instance.
 * @export
 */
oj.EventSource.prototype.Init = function()
{
    this._eventHandlers = [];
    oj.EventSource.superclass.Init.call(this);
};

/**
 * Attach an event handler.
 * <p>Application can call this if it wants to be notified of an event.  It can call the <code class="prettyprint">off</code> method to detach the handler when it no longer wants to be notified.</p>
 * @param {string} eventType eventType
 * @param {function(Object)} eventHandler event handler function
 * @return {void}
 * @memberof oj.EventSource
 * @export
 */
oj.EventSource.prototype.on = function(eventType, eventHandler)
{
    var foundEventHandler = false, i;
    for (i = 0; i < this._eventHandlers.length; i++)
    {
        if (this._eventHandlers[i]['eventType'] == eventType && 
            this._eventHandlers[i]['eventHandlerFunc'] == eventHandler)
        {
            foundEventHandler = true;
            break;
        }
    }
    if (!foundEventHandler) {
        this._eventHandlers.push({'eventType': eventType, 'eventHandlerFunc': eventHandler});
    }
};

/**
 * Detach an event handler.
 * <p>Application can call this if it no longer wants to be notified of an event that it has attached an handler to using the <code class="prettyprint">on</code> method.</p>
 * @param {string} eventType eventType
 * @param {function(Object)} eventHandler event handler function
 * @return {void}
 * @memberof oj.EventSource
 * @export
 */
oj.EventSource.prototype.off = function(eventType, eventHandler)
{
    var i;
    for (i = this._eventHandlers.length-1; i >= 0; i--)
    {
        if (this._eventHandlers[i]['eventType'] == eventType && 
            this._eventHandlers[i]['eventHandlerFunc'] == eventHandler)
        {
            this._eventHandlers.splice(i, 1);
            break;
        }
    }
};

/**
 * Handle the event
 * @param {string} eventType  event type
 * @param {Object} event  event
 * @return {boolean} Returns false if event is cancelled
 * @memberof oj.EventSource
 * @export
 */
oj.EventSource.prototype.handleEvent = function(eventType, event)
{
    var i, returnValue;
    for (i = 0; i < this._eventHandlers.length; i++)
    {
        var eventHandler = this._eventHandlers[i];
        if (eventHandler['eventType'] == eventType)
        {
            returnValue = eventHandler['eventHandlerFunc'].apply(this, Array.prototype.slice.call(arguments).slice(1));
            
            if (returnValue === false)
            {
                // event cancelled
                return false;
            }
        }
    }
    
    return true;
};
/*
** Copyright (c) 2008, 2013, Oracle and/or its affiliates. All rights reserved.
**
**34567890123456789012345678901234567890123456789012345678901234567890123456789
*/
/*jslint browser: true*/
/*global require:false,ojt:true */

/**
 * @class oj.Config
 * @hideconstructor
 * @classdesc Services for setting and retrieving configuration options
 * @since 1.0
 * @export
 */
oj.Config = {};

/**
 * Retrieves the type of device the application is running on.
 * @memberof oj.Config
 * @method getDeviceType
 * @return {"phone" | "tablet" | "others"} The device type
 * @export 
 */
oj.Config.getDeviceType = function()
{
  return oj.AgentUtils.getAgentInfo()['deviceType'];
};

/**
 * Retrieves the current locale
 * @memberof oj.Config
 * @method getLocale
 * @return {string} current locale
 * @export 
 */
oj.Config.getLocale = function()
{
  var rl, loc;
  if (oj.__isAmdLoaderPresent())
  {
    oj.Assert.assert(typeof ojt !== 'undefined', "ojtranslations module must be defined");
    rl = ojt['_ojLocale_'];
    
    // If Require.js internationalziation plugin resolved the locale to "root" (presumably because "lang" attribute was not
    // set, and neither navigator.language or navigator.userLanguage were not available), return "en"
    return (rl == "root") ? "en" : rl;
  }
    loc = oj.Config._locale;
    if (loc == null)
    {
      loc = document.documentElement.lang;
      if (!loc)
      {
         loc = navigator === undefined ? "en" :
                            (navigator['language'] ||
                             navigator['userLanguage'] || "en").toLowerCase();
      }
      oj.Config._locale = loc = loc.toLowerCase();
    }
    return loc;
};

/**
 * Changes the current locale
 * @method setLocale
 * @param {string} locale (language code and subtags separated by dash)
 * @param {function(): void} [callback] - for applications running with an AMD Loader (such as Require.js), this optional callback 
 * will be invoked when the framework is done loading its translated resources and Locale Elements for the newly specified locale. 
 * For applications running without an AMD loader, this optional callback will be invoked immediately
 * @return {undefined}
 * @export
 * @memberof oj.Config
 */
oj.Config.setLocale = function(locale, callback)
{
  if (oj.__isAmdLoaderPresent())
  {
    var prefix = "ojL10n!ojtranslations/nls/",
        requestedBundles = [prefix + locale + "/ojtranslations"];
    
    var timezoneBundleCount = 0;
    
    // Request LocaleElements only if ojlocaledata module is loaded
    if (oj.LocaleData) 
    {
      requestedBundles.push(prefix + locale + "/localeElements");
      
      if (oj.TimezoneData)
      {
        var tzBundles = oj.TimezoneData.__getBundleNames();
        timezoneBundleCount = tzBundles.length;
        tzBundles.forEach(
          function(bundle)
          {
            requestedBundles.push(prefix + locale + bundle)
          }
        );
      }
    }
    
    require(requestedBundles,
      function(translations, localeElements)
      {
        ojt = translations;
        
        if (localeElements)
        {
          oj.LocaleData.__updateBundle(localeElements);
        }
        
        for (var i=0; i<timezoneBundleCount; i++)
        {
          var tzBundle = arguments[i+2];
          oj.TimezoneData.__mergeIntoLocaleElements(tzBundle);
        }
        
        if (callback)
        {
          callback();
        }
      }
    );
  }
  else
  {
    oj.Config._locale = locale;
    if (callback)
    {
      callback();
    }
  }
};

/**
 * Retrieves a URL for loading a component-specific resource.
 * The URL is resolved as follows:
 * 1. If the application has specified a base URL with setResourceBaseUrl(), the return values will be
 * a relative path appended to the base URL.
 * 2. Otherwise, if the application running with an AMD Loader (such as Require.js), the parent folder of a 
 * module with ojs/ mapping will be used as a base URL.
 * 3. Otherwise, the original relative path will be returned.
 * @method getResourceUrl
 * @param {string} relativePath resource path
 * @return {string} resource URL
 * @see oj.Config.setResourceBaseUrl
 * @export
 * @memberof oj.Config
 */
oj.Config.getResourceUrl = function(relativePath)
{
  // Returning null and full URLs (containing protocol or a leading slash) as is
  var fullUrlExp = /^\/|:/, base, modulePath;
  if (relativePath == null || fullUrlExp.test(relativePath))
  {
    return relativePath;
  }
  
  base = oj.Config._resourceBaseUrl;
  
  if (base)
  {
    return base + (base.charAt(base.length-1) == '/' ? "" : '/') + relativePath;
  }
  
  if (oj.__isAmdLoaderPresent())
  {
    // : use ojs/_foo_ instead of ojs/ojcore to handle the case when ojs.core ends up in a partition bundle
    // in a different location
    modulePath = require.toUrl("ojs/_foo_");
    return modulePath.replace(/[^\/]*$/, "../" + relativePath);
  }
  
  return relativePath;
};

/**
 * Sets the base URL for retrieving component-specific resources
 * @method setResourceBaseUrl
 * @param {string} baseUrl base URL
 * @return {undefined}
 * @see oj.Config.getResourceUrl
 * @export
 * @memberof oj.Config
 */
oj.Config.setResourceBaseUrl = function(baseUrl)
{
  oj.Config._resourceBaseUrl = baseUrl;  
};

/**
 * Sets the automation mode.
 * @method setAutomationMode
 * @param {string} mode "enabled" for running in automation mode
 * @return {undefined}
 * @see oj.Config.getAutomationMode
 * @export
 * @memberof oj.Config
 */
oj.Config.setAutomationMode = function(mode)
{
  oj.Config._automationMode = mode;
};

/**
 * Gets the automation mode.
 * @method getAutomationMode
 * @return {string} automation mode
 * @see oj.Config.setAutomationMode
 * @export
 * @memberof oj.Config
 */
oj.Config.getAutomationMode = function()
{
  return oj.Config._automationMode;
}; 

/**
 * Return a string containing important version information about JET and the libraries
 * it has loaded
 * @method getVersionInfo 
 * @return {string}
 * @export
 * @memberof oj.Config
 */
oj.Config.getVersionInfo = function()
{
    // JET information
    var info = "Oracle JET Version: " + oj['version'] + '\n';
    info += "Oracle JET Revision: " + oj['revision'] + '\n';
    
    var windowDefined = (typeof window !== 'undefined');
    
    // Browser information
    if (windowDefined && window.navigator) {
        info += "Browser: " + window.navigator.userAgent +'\n';
        info += "Browser Platform: " + window.navigator.platform +'\n';
    }
    
    // 3rd party libraries
    if ($) {
        if ($.fn) {
            info += "jQuery Version: " + $.fn.jquery + '\n';
        }
        if ($.ui && $.ui['version']) {
            info += "jQuery UI Version: " + $.ui['version'] + '\n';
        }
    }
    if (oj.ComponentBinding) {
        info += "Knockout Version: " + oj.ComponentBinding.__getKnockoutVersion() + '\n';
    }
    
    // Local require doesn't have version #
    if (windowDefined && window.require) {
        info += "Require Version: " + window.require['version'] + '\n';
    }
    
    return info;
};

/**
 * Dump information to the browser's console containing important version information about JET and
 * the libraries it has loaded
 * @method logVersionInfo 
 * @return {undefined}
 * @memberof oj.Config
 * @export
 */
oj.Config.logVersionInfo = function()
{
    console.log(oj.Config.getVersionInfo());
};

/**
 * Retrives JET's template engine for dealing with inline templates (currently internal only)
 * @ignore
 * @memberof oj.Config
 * @private
 */
oj.Config.__getTemplateEngine = function()
{
  if (!oj.Config._templateEnginePromise)
  {
    if (!oj.__isAmdLoaderPresent())
    {
      throw "JET Temlate engine cannot be loaded with an AMD loader";
    }
    oj.Config._templateEnginePromise = new Promise(
      function(resolve, reject)
      {
        require(['./ojtemplateengine'], resolve, reject);
      }
    );
  }
  return oj.Config._templateEnginePromise;
};
/* The custom element (webcomponents) support requires the native CustomEvent
 * object.  This polyfill provides CustomEvent implementation for browsers that
 * don't support it yet.
 */
(function () {

  if (typeof window === 'undefined') {
    return;
  }

  // defaultPrevented is broken in IE.
  // https://connect.microsoft.com/IE/feedback/details/790389/event-defaultprevented-returns-false-after-preventdefault-was-called
  var workingDefaultPrevented = (function() {
    var e = document.createEvent('Event');
    e.initEvent('foo', true, true);
    e.preventDefault();
    return e.defaultPrevented;
  })();

  if (!workingDefaultPrevented) {
    var origPreventDefault = Event.prototype.preventDefault;
    Event.prototype.preventDefault = function() {
      if (!this.cancelable) {
        return;
      }

      origPreventDefault.call(this);

      Object.defineProperty(this, 'defaultPrevented', {
        get: function() {
          return true;
        },
        configurable: true
      });
    };
  }

  if (typeof window['CustomEvent'] === "function") {
    return;
  }

  function CustomEvent (event, params) {
    params = params || {bubbles: false, cancelable: false, detail: undefined};

    var evt = document.createEvent('CustomEvent');

    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window['CustomEvent'] = CustomEvent;
})();

/* This polyfill implements a proposed Microsoft standard [1] for effective yielding.
 * With the setImmediate global function, developers can yield control flow to the
 * user agent before running script.  The yield is similar to the setTimeout function
 * in that it is evaluated in the macrotask queue.  However, the setTimeout often has
 * a minimum delay and is also subject to long delays when the browser is placed in the
 * background.  The setImmediate function implemented by this polyfill invokes the
 * callback in the "next-tick" after the current macrotask queue has been exhausted.
 *
 * [1] https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
 *
 * The strategy for the polyfill implementation uses the window.postMessage API for
 * creating a context for calling the target function evaulated as a macrotask. This
 * plugin will not work in a webworker where the window object doesn't exist.
 */
(function ()
{

  if (typeof window === 'undefined' || window["setImmediate"] || !window["postMessage"])
  {
    return;
  }

  var _setImmediateMap;

  var _setImmediateCounter;
  function _nextId()
  {
    if (isNaN(_setImmediateCounter))
      _setImmediateCounter = 0;

    return ++_setImmediateCounter;
  }

  // postMessage "message" event listener for the setImmediate impl
  function _nextTickHandler (event)
  {
    var data = event.data;
    if (!data || "oj-setImmeidate" !== data.message)
      return;

    var id = data.id;
    var entry = _setImmediateMap.get(id);
    clearImmediateImpl(id);

    if (entry)
    {
      var callback = entry.callback;
      var args = entry.args;
      callback.apply(window, args);
    }
  };

  function setImmediateImpl ()
  {
    var callback = arguments[0];
    var slice = Array.prototype.slice;
    var args = slice.call(arguments, 1);

    if (typeof callback !== "function")
      callback = new Function(callback.toString());

    var id = _nextId();

    if (!_setImmediateMap)
      _setImmediateMap = new Map();

    _setImmediateMap.set(id, {callback: callback, args: args});

    if (_setImmediateMap.size === 1)
      window.addEventListener("message", _nextTickHandler);

    window.postMessage({id: id, message: "oj-setImmeidate"}, "*");
    return id;
  }

  function clearImmediateImpl(id)
  {
    if (!_setImmediateMap)
      return;

    _setImmediateMap.delete(id);

    if (_setImmediateMap.size < 1)
    {
      window.removeEventListener("message", _nextTickHandler);
      _setImmediateMap = null;
    }
  }

  window["setImmediate"] = setImmediateImpl;
  window["clearImmediate"] = clearImmediateImpl;
})();

(function ()
{
  if (typeof window === 'undefined' || window["__extends"])
  {
    return;
  }
  
  var __extends = (this && this.__extends) || (function () {
      var extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return function (d, b) {
          extendStatics(d, b);
          /**
           * @constructor
           */
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  
  window["__extends"] = __extends; 
})();

(function ()
{
  if (typeof window === 'undefined') {
    return;
  }
  if (window['Symbol']) {
    if (!window['Symbol']['asyncIterator']) {
      window['Symbol']['asyncIterator'] = 'asyncIterator';
    }

    if (!window['Symbol']['iterator']) {
      window['Symbol']['iterator'] = 'iterator';
    }
  } else {
    window['Symbol'] = {};
    window['Symbol']['asyncIterator'] = 'asyncIterator';
    window['Symbol']['iterator'] = 'iterator';
  }
})();



/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true*/


/**
 * @ojtsignore
 * @class oj.AgentUtils
 * @classdesc Utilities for qualifying the user agent string.
 * @public
 * @ignore
 */
oj.AgentUtils = function () {};

/**
 * Identity of the target browser.
 * @enum {string}
 * @public
 * @memberof oj.AgentUtils
 */
oj.AgentUtils.BROWSER =
{
  IE: "ie",
  FIREFOX: "firefox",
  SAFARI: "safari",
  CHROME: "chrome",
  EDGE: "edge",
  UNKNOWN: "unknown"
};
/**
 * Browser layout engine identity.
 * @enum {string}
 * @public
 * @memberof oj.AgentUtils
 */
oj.AgentUtils.ENGINE =
{
  TRIDENT: "trident",
  WEBKIT: "webkit",
  GECKO: "gecko",
  BLINK: "blink",
  EDGE_HTML: "edgehtml",
  UNKNOWN: "unknown"
};
/**
 * Operating system identity.
 * @enum {string}
 * @public
 * @memberof oj.AgentUtils
 */
oj.AgentUtils.OS =
{
  WINDOWS: "Windows",
  SOLARIS: "Solaris",
  MAC: "Mac",
  UNKNOWN: "Unknown",
  ANDROID: "Android",
  IOS: "IOS",
  WINDOWSPHONE: "WindowsPhone",
  LINUX: "Linux"
};
/**
 * Device type identity.
 * @enum {string}
 * @public
 * @memberof oj.AgentUtils
 */
oj.AgentUtils.DEVICETYPE =
{
  PHONE: "phone",
  TABLET: "tablet",
  OTHERS: "others"
};
/**
 * Parses the browser user agent string determining what browser and layout engine
 * is being used.
 *
 * @param {Object|null|string=} userAgent a specific agent string but defaults to navigator userAgent if not provided
 * @return {{os: oj.AgentUtils.OS, browser: oj.AgentUtils.BROWSER, browserVersion: number, deviceType: oj.AgentUtils.DEVICETYPE,
 *          engine: oj.AgentUtils.ENGINE, engineVersion: number, hashCode: number}}
 * @public
 * @memberof oj.AgentUtils
 */
oj.AgentUtils.getAgentInfo = function (userAgent)
{
  if (oj.StringUtils.isEmptyOrUndefined(userAgent))
    userAgent = navigator.userAgent;
  userAgent = userAgent.toLowerCase();
  /** @type {number} */
  var hashCode = oj.StringUtils.hashCode(userAgent);
  var currAgentInfo = oj.AgentUtils._currAgentInfo;
  if (currAgentInfo && currAgentInfo["hashCode"] === hashCode)
    return {
      'os': currAgentInfo["os"],
      'browser': currAgentInfo["browser"],
      'browserVersion': currAgentInfo["browserVersion"],
      'deviceType': currAgentInfo["deviceType"],
      'engine': currAgentInfo["engine"],
      'engineVersion': currAgentInfo["engineVersion"],
      'hashCode': currAgentInfo["hashCode"]
    };
  /** @type {oj.AgentUtils.OS} */
  var os = oj.AgentUtils.OS.UNKNOWN;
  /** @type {oj.AgentUtils.BROWSER} */
  var browser = oj.AgentUtils.BROWSER.UNKNOWN;
  /** @type {number} */
  var browserVersion = 0;
  /** @type {oj.AgentUtils.DEVICETYPE} */
  var deviceType = oj.AgentUtils.DEVICETYPE.OTHERS;
  /** @type {oj.AgentUtils.ENGINE} */
  var engine = oj.AgentUtils.ENGINE.UNKNOWN;
  /** @type {number} */
  var engineVersion = 0;
  if (userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1)
    os = oj.AgentUtils.OS.IOS;
  else if (userAgent.indexOf("mac") > -1)
    os = oj.AgentUtils.OS.MAC;
  else if (userAgent.indexOf("sunos") > -1)
    os = oj.AgentUtils.OS.SOLARIS;
  else if (userAgent.indexOf("android") > -1)
    os = oj.AgentUtils.OS.ANDROID;
  else if (userAgent.indexOf("linux") > -1)
    os = oj.AgentUtils.OS.LINUX;
  else if (userAgent.indexOf("windows phone") > -1)
    os = oj.AgentUtils.OS.WINDOWSPHONE;
  else if (userAgent.indexOf("win") > -1)
    os = oj.AgentUtils.OS.WINDOWS;

  if (os == oj.AgentUtils.OS.ANDROID)
  {
    // This works for Chrome, Firefox, and Edge on Android, even though only Chrome is officially supported.
    // This also works for Edge on Windows 10 Mobile, which announces itself as android-compatible user agent.
    deviceType = userAgent.indexOf("mobile") > -1 ? oj.AgentUtils.DEVICETYPE.PHONE : oj.AgentUtils.DEVICETYPE.TABLET;
  }
  else if (os == oj.AgentUtils.OS.IOS)
  {
    // This works for Safari, Chrome, Firefox, and Edge on iOS, even though only Safari is officially supported.
    deviceType = userAgent.indexOf("iphone") > -1 ? oj.AgentUtils.DEVICETYPE.PHONE : oj.AgentUtils.DEVICETYPE.TABLET;
  }

  if (userAgent.indexOf("msie") > -1)
  {
    browser = oj.AgentUtils.BROWSER.IE;
    browserVersion = oj.AgentUtils._parseFloatVersion(userAgent, /msie (\d+[.]\d+)/);
    if (userAgent.indexOf("trident"))
    {
      engine = oj.AgentUtils.ENGINE.TRIDENT;
      engineVersion = oj.AgentUtils._parseFloatVersion(userAgent, /trident\/(\d+[.]\d+)/);
    }
  }
  else if (userAgent.indexOf("trident") > -1)
  {
    browser = oj.AgentUtils.BROWSER.IE;
    browserVersion = oj.AgentUtils._parseFloatVersion(userAgent, /rv:(\d+[.]\d+)/);
    if (userAgent.indexOf("trident"))
    {
      engine = oj.AgentUtils.ENGINE.TRIDENT;
      engineVersion = oj.AgentUtils._parseFloatVersion(userAgent, /trident\/(\d+[.]\d+)/);
    }
  }
  else if (userAgent.indexOf("edge") > -1)
  {
    browser = oj.AgentUtils.BROWSER.EDGE;
    browserVersion = engineVersion  = oj.AgentUtils._parseFloatVersion(userAgent, /edge\/(\d+[.]\d+)/);
    engine = oj.AgentUtils.ENGINE.EDGE_HTML;
  }
  else if (userAgent.indexOf("chrome") > -1)
  {
    browser = oj.AgentUtils.BROWSER.CHROME;
    browserVersion = oj.AgentUtils._parseFloatVersion(userAgent, /chrome\/(\d+[.]\d+)/);
    if (browserVersion >= 28)
    {
      engine = oj.AgentUtils.ENGINE.BLINK;
      engineVersion = browserVersion;
    }
    else
    {
      engine = oj.AgentUtils.ENGINE.WEBKIT;
      engineVersion = oj.AgentUtils._parseFloatVersion(userAgent, /applewebkit\/(\d+[.]\d+)/);
    }
  }
  else if (userAgent.indexOf("safari") > -1)
  {
    browser = oj.AgentUtils.BROWSER.SAFARI;
    browserVersion = oj.AgentUtils._parseFloatVersion(userAgent, /version\/(\d+[.]\d+)/);
    engine = oj.AgentUtils.ENGINE.WEBKIT;
    engineVersion = oj.AgentUtils._parseFloatVersion(userAgent, /applewebkit\/(\d+[.]\d+)/);
  }
  else if (userAgent.indexOf("firefox") > -1)
  {
    browser = oj.AgentUtils.BROWSER.FIREFOX;
    browserVersion = oj.AgentUtils._parseFloatVersion(userAgent, /rv:(\d+[.]\d+)/);
    engine = oj.AgentUtils.ENGINE.GECKO;
    engineVersion = oj.AgentUtils._parseFloatVersion(userAgent, /gecko\/(\d+)/);
  }

  currAgentInfo = oj.AgentUtils._currAgentInfo =
  {
    'hashCode': hashCode,
    'os': os,
    'browser': browser,
    'browserVersion': browserVersion,
    'deviceType': deviceType,
    'engine': engine,
    'engineVersion': engineVersion
  };
  return {
    'os': currAgentInfo["os"],
    'browser': currAgentInfo["browser"],
    'browserVersion': currAgentInfo["browserVersion"],
    'deviceType': currAgentInfo["deviceType"],
    'engine': currAgentInfo["engine"],
    'engineVersion': currAgentInfo["engineVersion"],
    'hashCode': currAgentInfo["hashCode"]
  };
};
/**
 * @param {string!} userAgent
 * @param {RegExp!} versionNumberPattern
 * @return {number}
 * @private
 * @memberof oj.AgentUtils
 */
oj.AgentUtils._parseFloatVersion = function (userAgent, versionNumberPattern)
{
  var matches = userAgent.match(versionNumberPattern);
  if (matches)
  {
    var versionString = matches[1];
    if (versionString)
      return parseFloat(versionString);
  }

  return 0;
};



/*
** Copyright (c) 2015, Oracle and/or its affiliates. All rights reserved.
*/
/*jslint browser: true*/

/**
 * @class oj.ThemeUtils
 * @classdesc Services for getting information from the theme
 * @since 1.2.0
 * @export
 */
oj.ThemeUtils = function(){};

/**
 * get the name of the current theme
 * @method getThemeName
 * @memberof oj.ThemeUtils
 * @export
 * @static
 * @hideconstructor
 *
 * @return {string|null} the name of the theme
 */
oj.ThemeUtils.getThemeName = function()
{
  
  // get the map of theme info
  var themeMap = oj.ThemeUtils.parseJSONFromFontFamily("oj-theme-json") || {};

  return themeMap['name'];
}


/**
 * <p>Get the target platform of the current theme. </p>
 * <p>This API does not look at the user agent and therefore it 
 *    tells you nothing about the current platform you are actually on.  
 *    Instead it tells you the target platform the theme was written 
 *    for so that programmatic behaviors that match the theme's UI can be written.
 *    This can be useful when writing a cross platform hybrid mobile app.  </p>
 * 
 * <p>Example</p>
 * <pre class="prettyprint">
 * <code>
 * var themeTargetPlatform = oj.ThemeUtils.getThemeTargetPlatform();
 *
 * if (themeTargetPlatform == 'ios')
 *    // code for a behavior familiar in ios
 * else if (themeTargetPlatform == 'android')
 *    // code for a behavior familiar on android
 * else
 *    // code for the default behavior
 * </code></pre>
 * @export
 * @static
 * @method getThemeTargetPlatform
 * @memberof oj.ThemeUtils
 * @return {string|null} the target platform can be any string the theme 
 * wants to send down, but the usual values are 'web', 'ios', 'android', 'windows'
 */
oj.ThemeUtils.getThemeTargetPlatform = function()
{
  
  // get the map of theme info
  var themeMap = oj.ThemeUtils.parseJSONFromFontFamily("oj-theme-json") || {};

  return themeMap['targetPlatform'];
}



/**
 * clear values cached in  [oj.ThemeUtils.parseJSONFromFontFamily]{@link oj.ThemeUtils.parseJSONFromFontFamily}
 * @export
 * @static
 * @method clearCache
 * @return {void}
 * @memberof oj.ThemeUtils
 */
oj.ThemeUtils.clearCache = function()
{
  this._cache = null;
}


/**
 *
 * <p>json can be sent down as the font family in classes 
 * that look something like this 
 * (on the sass side of things see the file 
 * scss/utilities/_oj.utilities.json.scss
 * for information on jet mixins available to generate json):<p>
 *
 * <p>Example CSS</p>
 * <pre class="prettyprint">
 * <code>
 * .demo-map-json {
 *    font-family: '{"foo":"bar", "binky": 4}';
 * }
 *
 * .demo-list-json {
 *    font-family: '["foo","bar","binky"}';
 * }
 * </code></pre>
 * <p>Example Usage</p>
 * <pre class="prettyprint">
 * <code>
 * var mymap = oj.ThemeUtils.parseJSONFromFontFamily("demo-map-json");
 * var myarray = oj.ThemeUtils.parseJSONFromFontFamily("demo-list-json");
 * </code></pre>
 *
 * This function 
 * <ul>
 *   <li>Gets the font family string by creating a dom element, 
 *      applying the selector passed in, calling getcomputedstyle, 
 *      and then reading the value for font-family.
 *   </li>
 *   <li>Parses the font family value by calling JSON.pars.</li>
 *   <li>Caches the parsed value because calling getComputedStyle is a perf hit. 
 *       Subsequent requests for the same selector will return the cached value. 
 *       Call [oj.ThemeUtils.clearCache]{@link oj.ThemeUtils.clearCache} if new css is loaded.</li>
 *   <li>Return the parsed value.</li>
 * </ul>
 * 
 * <p>
 * If new css is loaded call oj.ThemeUtils.clearCache to clear the cache</p>
 *
 * @method parseJSONFromFontFamily
 * @memberof oj.ThemeUtils
 * @param {string} selector a class selector name, for example 'demo-map-json';
 * @return {any} the result of parsing the font family with JSON.parse. 
 *      The returned value is cached, so if you modify the returned 
 *      value it will be reflected in the cache.
 * @throws {SyntaxError} If JSON.parse throws a SyntaxError exception we will log an error and rethrow 
 * @export
 * @static
 */
oj.ThemeUtils.parseJSONFromFontFamily = function(selector)
{

 
 // NOTE: I first tried code inspired by 
 // https://css-tricks.com/making-sass-talk-to-javascript-with-json/
 // so I was using :before and content, for example
 //   .oj-button-option-defaults:before {
 //     content: '{"foo":"bar", "binky": 4}';
 //    }
 // 
 //  however IE 11 has a bug where the computed style doesn't actually 
 //  seem to be computed when it comes to :before,
 //  so if you set a class that affects :before after the page loads 
 //  on IE getComputedStyle doesn't work.
 //  See the pen below, the yellow box has the class applied in js,
 //  computedstyle works on chrome, doesn't work on IE11 for 
 //  class applied after page load.
 //     http://codepen.io/gabrielle/pen/OVOwev

  // if needed create the cache and initialize some things
  if (this._cache == null)
  {
    this._cache = {};

    // magic value that means null in the cache
    this._null_cache_value = {};

    // font family is inherited, so even if no selector/json 
    // is sent down we will get a string like 
    // 'HelveticaNeue',Helvetica,Arial,sans-serif' off of our generated element. 
    // So save off the font family from the head 
    // element to compare to what we read off our generated element. 
    this._headfontstring = window.getComputedStyle(document.head).getPropertyValue('font-family');
  }

  // see if we already have a map for this component's option defaults
  var jsonval =  this._cache[selector];

  // if there's something already cached return it
  if (jsonval === this._null_cache_value)
  {
    return null;
  }
  else if (jsonval != null)
  {
    return jsonval;
  }
    

  // there's nothing cached, so we need to create a dom element to apply the class to. 
  // We're creating a meta element, 
  // the hope is that the browser is smart enough to realize the 
  // meta element isn't visible and therefore we avoid perf issues of calling 
  // getcomputedstyle
  var elem = document.createElement("meta");
  elem.className = selector;
  document.head.appendChild(elem); // @HTMLUpdateOK 
  var rawfontstring = window.getComputedStyle(elem).getPropertyValue('font-family');

  if (rawfontstring != null)
  {

    // if the raw font string is the same value as the saved header 
    // font value then log a warning that no value was sent down.

    if (rawfontstring == this._headfontstring)
    {
      oj.Logger.warn("parseJSONFromFontFamily: When the selector ", selector, 
        " is applied the font-family read off the dom element is ", rawfontstring, 
        ". The parent dom elment has the same font-family value.",
        " This is interpreted to mean that no value was sent down for selector ", 
        selector, ". Null will be returned.");
    }
    else
    {
      // remove inconsistent quotes
      var fontstring = rawfontstring.replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g, '');
      //console.log("json fontstring for selector " + selector + ': ' + fontstring);

      if (fontstring)
      {

        try {

          jsonval = JSON.parse(fontstring);
        }
        catch(e)
        {

          // In Firefox you can turn off the page font
          // Options -> Content -> Fonts and Colors -> Advanced
          // Uncheck the "Allow pages to choose their own fonts, instead of my selections above" 
          // In that case they stick something like 'serif,"'at the front of the font family,
          // so search for the first comma, add 2, and try parsing again.
          var commaindex = fontstring.indexOf(',');
          var reparseSuccess = false;

          if (commaindex > -1)
          {
            fontstring = fontstring.substring(commaindex + 2);

            try {

              jsonval = JSON.parse(fontstring);
              reparseSuccess = true;
            }
            catch(e2)
            {
            }
          }

          if (reparseSuccess == false)
          {
            oj.Logger.error("Error parsing json for selector " + selector + 
                            ".\nString being parsed is " + fontstring + ". Error is:\n", e);
            
            // remove the meta tag
            document.head.removeChild(elem); // @HTMLUpdateOK 
            throw e;
          }

        }
      }
    }
  }

  // remove the meta tag
  document.head.removeChild(elem); // @HTMLUpdateOK 

  // cache the result 
  if (jsonval == null)
  {
    this._cache[selector] = this._null_cache_value;
  }
  else
  {
    this._cache[selector] = jsonval;
  }
  
  //console.log(this._cache);

  return jsonval;
}




/*jslint browser: true*/
/*
** Copyright (c) 2014, Oracle and/or its affiliates. All rights reserved.
*/


/**
 * @class oj.ResponsiveUtils
 * @classdesc Utilities for working with the framework's responsive screen widths 
 * and ranges. Often used in conjunction with {@link oj.ResponsiveKnockoutUtils} 
 * to create knockout observables that can be used to drive responsive page behavior. 
 * See the method doc below for specific examples.
 * 
 * @since 1.1.0
 * @hideconstructor
 * @export
 */
oj.ResponsiveUtils = function() {};


/**
 * <p>In the jet sass files there are variables for
 * responsive screen widths, these look something like</p>
 *  <ul>
 *    <li>$screenSmallRange:  0, 767px;</li>
 *    <li>$screenMediumRange: 768px, 1023px;</li>
 *    <li>$screenLargeRange:  1024px, 1280px;</li>
 *    <li>$screenXlargeRange: 1281px, null;</li>
 *  </ul>
 *
 * <p>These constants are used to identify these ranges.</p>
 * @enum {string}
 * @memberof oj.ResponsiveUtils
 * @constant
 * @export
 */
oj.ResponsiveUtils.SCREEN_RANGE ={
   /**
   * @expose
   * @constant
   */
   SM: "sm",
   /**
   * @expose
   * @constant
   */
   MD: "md",
   /**
   * @expose
   * @constant
   */
   LG: "lg",
   /**
   * @expose
   * @constant
   */
   XL: "xl",
   /**
   * @expose
   * @constant
   */
   XXL: "xxl"

};


/**
 * <p>In the jet sass files there are variables for
 * responsive screen widths,
 * see {@link oj.ResponsiveUtils.SCREEN_RANGE} for details.
 * The jet sass files also has variables for
 * responsive queries like $responsiveQuerySmallUp,
 * $responsiveQuerySmallOnly, $responsiveQueryMediumUp, etc.</p>
 *
 * <p>These constants are used to identify these queries.</p>
 * @enum {string}
 * @memberof oj.ResponsiveUtils
 * @constant
 * @export
 */
oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY = {
   /**
   * Matches screen width small and wider
   * @expose
   * @constant
   */
   SM_UP: "sm-up",
   /**
   * matches screen width medium and wider
   * @expose
   * @constant
   */
   MD_UP: "md-up",
   /**
   * matches screen width large and wider
   * @expose
   * @constant
   */
   LG_UP: "lg-up",
   /**
   * matches screen width extra-large and wider
   * @expose
   * @constant
   */
   XL_UP: "xl-up",
   /**
   * matches screen width extra-extra-large and wider
   * @expose
   * @constant
   */
   XXL_UP: "xxl-up",

   /**
   * matches screen width small only
   * @expose
   * @constant
   */
   SM_ONLY: "sm-only",
   /**
   * matches screen width medium only
   * @expose
   * @constant
   */
   MD_ONLY: "md-only",
   /**
   * matches screen width large only
   * @expose
   * @constant
   */
   LG_ONLY: "lg-only",
   /**
   * matches screen width extra-large only
   * @expose
   * @constant
   */
   XL_ONLY: "xl-only",

   /**
   * matches screen width medium and narrower
   * @expose
   * @constant
   */
   MD_DOWN: "md-down",
   /**
   * matches screen width large and narrower
   * @expose
   * @constant
   */
   LG_DOWN: "lg-down",
   /**
   * matches screen width extra-large and narrower
   * @expose
   * @constant
   */
   XL_DOWN: "xl-down",
   /**
   * matches high resolution screens
   * @expose
   * @constant
   */
   HIGH_RESOLUTION: "high-resolution"

};

// used by the compare function
oj.ResponsiveUtils._RANGE = {};
oj.ResponsiveUtils._RANGE[oj.ResponsiveUtils.SCREEN_RANGE.SM]   = 0;
oj.ResponsiveUtils._RANGE[oj.ResponsiveUtils.SCREEN_RANGE.MD]   = 1;
oj.ResponsiveUtils._RANGE[oj.ResponsiveUtils.SCREEN_RANGE.LG]   = 2;
oj.ResponsiveUtils._RANGE[oj.ResponsiveUtils.SCREEN_RANGE.XL]   = 3;
oj.ResponsiveUtils._RANGE[oj.ResponsiveUtils.SCREEN_RANGE.XXL]  = 4;



/**
 * This idea/code is from zurb foundation, thanks zurb!
 *
 * In the jet sass files there are variables for
 * responsive screen sizes, these look something like

 *  <ul>
 *    <li>$screenSmallRange:  0, 767px;</li>
 *    <li>$screenMediumRange: 768px, 1023px;</li>
 *    <li>$screenLargeRange:  1024px, 1280px;</li>
 *    <li>$screenXlargeRange: 1281px, null;</li>
 *  </ul>
 *
 * <p>These variables in turn are used to generate responsive media queries in variables like
 * $responsiveQuerySmallUp, $responsiveQueryMediumUp, etc.</p>
 *
 * <p>we send down these media queries as the font family in classes
 * that look something like this:<p>
 *
 * <pre class="prettyprint">
 * <code>
 * .oj-mq-md {
 *    font-family: "/screen and (min-width: 768px)/";
 * }
 * </code></pre>
 *
 * <p>This function applies the class and then reads the font family off a dom
 * element to get the media query string</p>
 *
 * @param {string} selector a class selector name, for example 'oj-mq-md';
 * @return {string} the media query sent down for that class
 * @private
 */
oj.ResponsiveUtils._getMediaQueryFromClass = function(selector)
{

  var elem = /** @type {(Element | null)} */ (document.getElementsByClassName(selector).item(0));

  if(elem === null) {
    elem = document.createElement("meta");
    elem.className = selector;
    document.head.appendChild(elem); // @HTMLUpdateOK
  }

  var fontFamily= window.getComputedStyle(elem).getPropertyValue('font-family');

  return fontFamily.replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '');
}

/**
 * Get a framework (built in) media query string, 
 * see {@link oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY} for details on framework queries. 
 * The media query string returned can be passed to 
 * {@link oj.ResponsiveKnockoutUtils.createMediaQueryObservable} to create a knockout
 * observable, which in turn can be used to drive responsive page behavior.
 * 
 * <p>Example:</p>
 * <pre class="prettyprint">
 * <code>
 *
 *     var lgQuery = oj.ResponsiveUtils.getFrameworkQuery(
 *                             oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);
 *        
 *     self.large = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(lgQuery);
 * </code></pre>
 * 
 *
 * @method getFrameworkQuery
 * @memberof oj.ResponsiveUtils
 * @param {oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY} frameworkQueryKey one of the FRAMEWORK_QUERY_KEY constants,
 *                       for example oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP
 * @return {string | null} the media query to use for the framework query key passed in
 * @export
 * @static
 */
oj.ResponsiveUtils.getFrameworkQuery = function(frameworkQueryKey)
{
  var selector = "oj-mq-" + frameworkQueryKey;
  var query = oj.ResponsiveUtils._getMediaQueryFromClass(selector);

  if (query == "null")
    return null;
  else
    return query;
}


/**
 * <p> Compare can be used in conjunction with 
 * {@link oj.ResponsiveKnockoutUtils.createScreenRangeObservable}</p>
 *
 * 
 * <p>Example:</p>
 * <pre class="prettyprint">
 * <code>
 *        // create an observable which returns the current screen range
 *        self.screenRange = oj.ResponsiveKnockoutUtils.createScreenRangeObservable();
 *
 *        self.label2 = ko.computed(function() {
 *          var range = self.screenRange();
 * 
 *          if ( oj.ResponsiveUtils.compare( 
 *                       range, oj.ResponsiveUtils.SCREEN_RANGE.MD) <= 0)
 *          {
 *            // code for when screen is in small or medium range
 *          }
 *          else if (range == oj.ResponsiveUtils.SCREEN_RANGE.XL)
 *          {
 *            // code for when screen is in XL range
 *          }
 *        });
 * </code></pre>
 * 
 * @method compare
 * @memberof oj.ResponsiveUtils
 * @param {oj.ResponsiveUtils.SCREEN_RANGE} size1 one of the screen size constants,
 * for example oj.ResponsiveUtils.SCREEN_RANGE.MD
 * @param {oj.ResponsiveUtils.SCREEN_RANGE} size2 one of the screen size constants,
 * for example oj.ResponsiveUtils.SCREEN_RANGE.LG
 * @return {number} a negative integer if the first
 * argument is less than the second. Zero if the two are equal.
 * 1 or greater if the first argument is more than the second.
 *
 * @export
 * @static
 */
oj.ResponsiveUtils.compare = function(size1, size2)
{
  var range1 = oj.ResponsiveUtils._RANGE[size1];
  var range2 = oj.ResponsiveUtils._RANGE[size2];

  if (range1 == undefined)
    throw "size1 param " + size1 +
          " illegal, please use one of the screen size constants like oj.ResponsiveUtils.SCREEN_RANGE.MD";
  if (range2 == undefined)
    throw "size2 param " + size2 +
          " illegal, please use one of the screen size constants like oj.ResponsiveUtils.SCREEN_RANGE.MD";

  return range1 - range2;
}

/*
** Copyright (c) 2004, 2012, Oracle and/or its affiliates. All rights reserved.
*/
/**
 * String utilities.
 * @class oj.StringUtils
 * @export
 * @ignore
 */
oj.StringUtils = {};

oj.StringUtils._TRIM_ALL_RE = /^\s*|\s*$/g;

/**
  * Returns true if the value is null or if the trimmed value is of zero length.
  *
  * @param {Object|string|null} value
  * @returns {boolean} true if the string or Object (e.g., Array) is of zero length.
  * @export
  * @memberof oj.StringUtils
  */
 oj.StringUtils.isEmpty = function(value)
 {
   if (value === null)
   {
     return true;
   }

   var trimValue = oj.StringUtils.trim(value);

   return (trimValue.length === 0);
 };

 /**
  * Returns true if the value is null, undefined or if the trimmed value is of zero length.
  *
  * @param {Object|string|null=} value
  * @returns {boolean} true if the string or Object (e.g., Array) is of zero length.
  * @export
  * @memberof oj.StringUtils
  */
 oj.StringUtils.isEmptyOrUndefined = function (value)
 {
   if (value === undefined || oj.StringUtils.isEmpty(value))
   {
     return true;
   }

   return false;
 };

/**
 * Test if an object is a string (either a string constant or a string object)
 * @param {Object|string|null} obj object to test
 * @return {boolean} true if a string constant or string object
 * @export
 * @memberof oj.StringUtils
 */
oj.StringUtils.isString = function(obj)
{
  return obj !== null && ((typeof obj === 'string') || obj instanceof String);
};

/**
 * Remove leading and trailing whitespace
 * @param {Object|string|null} data to trim
 * @return {Object|string|null}
 * @export
 * @memberof oj.StringUtils
 */
oj.StringUtils.trim = function(data)
{
  if (oj.StringUtils.isString(data))
  {
    return data.replace(oj.StringUtils._TRIM_ALL_RE, '');
  }

  return data;
};

/**
 * Port of the Java String.hashCode method.
 * http://erlycoder.com/49/javascript-hash-functions-to-convert-string-into-integer-hash-
 *
 * @param {string} str
 * @returns {number}
 * @public
 * @memberof oj.StringUtils
 */
oj.StringUtils.hashCode = function(str)
{
  var hash = 0;
  if (str.length === 0)
    return hash;

  for (var i = 0; i < str.length; i++)
  {
    var c = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+c;
    hash = hash & hash;
  }
  return hash;
};


//Polyfills for IE11
(function () {  
  // String.startsWith requires for IE11
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
    };
  }

  // String.endsWith requires for IE11
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || 
          Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.lastIndexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };
  }
})();

/*
** Copyright (c) 2004, 2012, Oracle and/or its affiliates. All rights reserved.
*/

/**
 * Utilities for working with collections
 * @export
 */
oj.CollectionUtils = {};


/**
 * Copies all of the properties of source into the target and returns the target
 * 
 * @param {Object} target - target collection
 * @param {Object} source - source collection
 * @param {function(string)=} keyConverter a callback for converting the key
 * @param {boolean=} recurse - true if this method should recurse into plain Javascript object properties
 * @param {number=} maxRecursionDepth - the maximum depth of the recursion into plain Javascript object properties
 * @return target collection
 * @export
 * @memberof! oj.CollectionUtils
 */
oj.CollectionUtils.copyInto = function(
  target,
  source,
  keyConverter,
  recurse,
  maxRecursionDepth)
{
  return oj.CollectionUtils._copyIntoImpl(
                                          target,
                                          source,
                                          keyConverter,
                                          recurse,
                                          maxRecursionDepth,
                                          0);
};


/**
 * Checks whether the object is a direct instance of Object
 * @param {Object} obj - object to test
 * 
 * @return {boolean} true if the object is a direct instance of Object, false otherwise
 * @export
 * @memberof! oj.CollectionUtils
 */
oj.CollectionUtils.isPlainObject = function(obj)
{
  if (obj !== null && typeof obj === 'object')
  {
    try
    {
      if (obj.constructor && obj.constructor.prototype.hasOwnProperty("isPrototypeOf"))
      {
        return true;
      }
    }
    catch(e){}
  }
  
  return false;
};


/**
 * @private
 * @memberof! oj.CollectionUtils
 */
oj.CollectionUtils._copyIntoImpl = function(
  target,
  source,
  keyConverter,
  recurse,
  maxRecursionDepth,
  currentLevel)
{
  var k, targetKey, keys;
  
  if (maxRecursionDepth === undefined || maxRecursionDepth === null)
  {
    maxRecursionDepth = Number.MAX_VALUE;
  }
  
  if (target && source && (target !== source))
  {    
    keys = Object.keys(source);
    for (var i=0; i<keys.length; i++)
    {      
      k = keys[i];
      // allow the key mapping to be overridden
      if (keyConverter)
      {
        targetKey = keyConverter(k);
      }
      else
      {
        targetKey = k;
      }
      
      var sourceVal = source[k];
      
      var recursed = false;
      
      if (recurse && currentLevel < maxRecursionDepth)
      {
        var targetVal = target[targetKey];
        if (oj.CollectionUtils.isPlainObject(sourceVal) && 
           (targetVal == null || oj.CollectionUtils.isPlainObject(targetVal))) 
        {
          recursed = true;
          target[targetKey] = targetVal || {};
          oj.CollectionUtils._copyIntoImpl(
                                          target[targetKey],
                                          sourceVal,
                                          keyConverter,
                                          true,
                                          maxRecursionDepth,
                                          currentLevel + 1);
        }
      }
      if (!recursed)
      {
        target[targetKey] = sourceVal;
      }

    }
  }
  
  return target;
};

/*
** Copyright (c) 2008, 2013, Oracle and/or its affiliates. All rights reserved.
**
**34567890123456789012345678901234567890123456789012345678901234567890123456789
*/

/*global ojt:false*/

/**
 * @class oj.Translations
 * @classdesc Services for Retrieving Translated Resources
 * @export
 * @since 1.0
 * @hideconstructor
 */
oj.Translations = {};

/**
 * Sets the translation bundle used by JET
 * If an AMD loader (such as Require.js) is not present, this method should be called by the application to provide
 * translated strings for JET.
 * This method may also be used by an application that wants to completely replace the resource bundle that is automatically
 * fetched by an AMD loader.
 * @method setBundle
 * @memberof oj.Translations
 * @param {Object} bundle resource bundle that should be used by the framework
 * @return {void}
 * @export
 */
oj.Translations.setBundle = function(bundle)
{
  oj.Translations._bundle = bundle;
};

/**
 * Retrives a translated resource for a given key
 * @method getResource
 * @memberof oj.Translations
 * @param {string} key resource key The dot character (.) within the key string
 * is interpreted as a separator for the name of a sub-section within the bundle.
 * For example, 'components.chart', would be read as the 'chart' section within
 * 'components'. Thus the key name for an individual section should never contain a dot.
 * @return {Object|string|null} resource associated with the key or null if none was found
 * @export
 */
oj.Translations.getResource = function(key)
{
  return oj.Translations._getResourceString(key);
};

/**
 * Applies parameters to a format pattern
 * @method applyParameters
 * @memberof oj.Translations
 * @param {string} pattern pattern that may contain tokens like {0}, {1}, {name}. These tokens
 * will be used to define string keys for retrieving values from the parameters
 * object. Token strings should not contain comma (,) 
 * or space characters, since they are reserved for future format type enhancements. 
 * The reserved characters within a pattern are:
 * $ { } [ ]  
 * These characters will not appear in the formatted output unless they are escaped
 * with a dollar character ('$').
 * 
 * @param {Object|Array} parameters parameters to be inserted into the string. Both arrays and
 * Javascript objects with string keys are accepted.
 * 
 * @return {string|null} formatted message or null if the pattern argument was null
 * @export
 */
oj.Translations.applyParameters = function(pattern, parameters)
{
  return (pattern == null) ? null : oj.Translations._format(pattern, parameters);
};

/**
 * Retrieves a translated string after inserting optional parameters. 
 * The method uses a key to retrieve a format pattern from the resource bundle.
 * Tokens like {0}, {1}, {name} within the pattern will be used to define placement
 * for the optional parameters.  Token strings should not contain comma (,) 
 * or space characters, since they are reserved for future format type enhancements.
 * The reserved characters within a pattern are:
 * $ { } [ ]  
 * These characters will not appear in the formatted output unless they are escaped
 * with a dollar character ('$').
 * @method getTranslatedString
 * @memberof oj.Translations
 * @param {string} key  translations resource key. The dot character (.) within the key string
 * is interpreted as a separator for the name of a sub-section within the bundle.
 * For example, 'components.chart', would be read as the 'chart' section within
 * 'components'. Thus the key name for an individual section should never contain a dot.
 * 
 * @param {...(string|Object|Array)} var_args  - optional parameters to be inserted into the 
 * translated pattern.
 * 
 * If more than one var_args arguments are passed, they will be treated as an array 
 * for replacing positional tokens like {0}, {1}, etc.
 * If a single argument is passed, it will be treated as a Javascript Object whose
 * keys will be matched to tokens within the pattern. Note that an Array is just
 * a special kind of such an Object.
 * 
 * For backward compatibility, a var_args argument whose type is neither 
 * Object or Array will be used to replace {0} in the pattern.
 * 
 * @return formatted translated string
 * @ojsignature {target: "Type", for:"returns", value: "string"}
 * @export
 */
oj.Translations.getTranslatedString = function(key, var_args)
{  
  var val = oj.Translations._getResourceString(key);
  
  if (val == null)
  {
    return key;
  }
  
  var params = {};
  
  if (arguments.length > 2)
  {
    params = Array.prototype.slice.call(arguments, 1);
  }
  else if (arguments.length == 2)
  {
    params = arguments[1];
    if (typeof params !== 'object' && !(params instanceof Array))
    {
      params = [params];
    }
      
  }
  
  return oj.Translations.applyParameters(val, params);
};


/**
 * Provides a key-to-value map of the translated resources for a given component name
 * @method getComponentTranslations
 * @memberof oj.Translations
 * @param {string} componentName name of the component
 * @return {Object} a map of translated resources
 * @export
 */
oj.Translations.getComponentTranslations = function(componentName)
{
  var bundle = oj.Translations._getBundle()[componentName], translations, k;
  
  if (bundle == null)
  {
    return {};
  }
  
  // Assume that the set of keys remains constant regardless of the current locale
  translations = {};
  for(k in bundle)
  {
    if (bundle.hasOwnProperty(k)) {
        translations[k] = bundle[k];
    }
  }
  return translations;
};

/**
 * Retrives a translated resource for a given key, accounting for nested keys
 * @param {string} key
 * @return {string|null} resource associated with the key or null if none was found
 * @private
 */
oj.Translations._getResourceString = function(key)
{
  // Account for dot separated nested keys
  var keys = key ? key.split(".") : [], bundle = oj.Translations._getBundle(), 
          iteration = keys.length, index = 0, subkey = keys[index];
  oj.Assert.assertObject(bundle);
  
  // even though we start with a valid bundle it's possible that part or all of the key is invalid, 
  // so check we have a valid bundle in the while loop
  while (--iteration > 0 && bundle) 
  {
    // if we have a key like a.b.c
    bundle = bundle[subkey];
    index++;
    subkey = keys[index];
  }
    
  return bundle ? (bundle[subkey] || null) : null;
};

oj.Translations._format = function(formatString, parameters)
{
  var formatLength = formatString.length;
  
  // Use the javascript StringBuffer technique.
  var buffer = [];
  
  var token = null;
  
  
  var escaped = false;
  var isToken = false;
  var isGroup = false;
  var isExcluded = false;
  
  var tokenTerminated; // this will be set to true when a comma or space is 
                       // encountered in teh token
  var i;
  
  for (i = 0; i < formatLength; i++)
  {
    var ch = formatString.charAt(i);
    
    var accumulate = false;
    
    if (!escaped)
    {
      switch(ch)
      {
        case '$':
          escaped = true;
          break;
          
        case '{':
          if (!isExcluded)
          {
            if (!isToken)
            {
              tokenTerminated = false;
              token = [];
            }
            isToken = true;
          }
          break;
          
        case '}':
          if (isToken && token.length > 0)
          {
            var val = parameters[token.join('')];
            buffer.push((val === undefined) ? "null" : val);
          }
          isToken = false;
          break;
          
        case '[':
          if (!isToken)
          {
            if (isGroup)
            {
              isExcluded = true;
            }
            else
            {
              isGroup = true;
            }
          }
          break;
          
        case ']':
          if (isExcluded)
          {
            isExcluded = false;
          }
          else
          {
            isGroup = false;
          }
          break;
        
        default:
          accumulate = true;
      }
    }
    else
    {
      accumulate = true;
      escaped = false;  
    }
    
    if (accumulate)
    {
      if (isToken)
      {
        if (ch == ',' || ch ==' ')
        {
          tokenTerminated = true;
        }
        else if (!tokenTerminated)
        {
          token.push(ch);
        }
      }
      else if (!isExcluded)
      {
        buffer.push(ch);
      }
    } 
  }

  // Use the javascript StringBuffer technique for toString()
  return buffer.join("");
};


oj.Translations._getBundle = function()
{
  var b = oj.Translations._bundle;
  if (b)
  {
    return b;
  }
  
  if (oj.__isAmdLoaderPresent()) {
    oj.Assert.assert(ojt !== undefined, "ojtranslations module must be defined");
    return ojt;
  }
  return {};
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/**
 * Internally used by the {@link oj.BusyContext} to track a components state
 * while it is performing a task such as animation or fetching data.
 * 
 * @hideconstructor
 * @ignore
 * @protected
 * @constructor
 * @param {Function|Object|undefined} description of the component and cause
 *        of the busy state
 */
oj.BusyState = function (description)
{
  /**
   * @ignore
   * @private
   * @type {?}
   */
  this._description = description;

  /**
   * @ignore
   * @private
   * @type {number}
   */
  this._addedWaitTs = oj.BusyState._getTs();

  /**
   * @ignore
   * @private
   * @type {string}
   */
  this._id = this._addedWaitTs.toString(36) + "_" + Math.random().toString(36); //@RandomNumberOk -
  // random number concatinated to the current timestamp is used for a unique id for a local Map
  // key. This random number is not used use as a cryptography key.

};

Object.defineProperties(oj.BusyState.prototype,
  {
    /**
     * Identifies the usage instance of a busy state.
     * @memberof oj.BusyState
     * @instance
     * @property {!string} id
     */
    "id" : {
      "get" : function ()
      {
        return this._id;
      },
      "enumerable" : true
    },
    /**
     * Further definition of the busy state instance.
     * @memberof oj.BusyState
     * @instance
     * @property {?string} description
     */
    "description" :
      {
        "get" : function ()
        {
          if (this._description)
          {
            if (this._description instanceof Function)
              return this._description();
            else
              return this._description.toString();
          }

        },
        "enumerable" : true
      }
  });

/**
 * @override
 * @returns {string} returns the value of the object as a string
 */
oj.BusyState.prototype.toString = function ()
{
  var buff = "Busy state: [description=";

  var description = this["description"];

  if (description !== null)
  {
    buff += description;
  }

  var elapsed = oj.BusyState._getTs() - this._addedWaitTs;
  buff += ", elapsed=" + elapsed + "]";

  return buff;
};


/**
 * @private
 * @returns {number} current date represented by a number
 */
oj.BusyState._getTs = function ()
{
  // Safari V9.1.1 doesn't yet support performance.now
  return window["performance"] ? window["performance"].now() : new Date().getTime();
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/**
 * <p>The purpose of the BusyContext API is to accommodate sequential dependencies of asynchronous
 * operations. A common use cases defining the API is for automation testing (qunit and webdriver).
 * Automation test developers can use this API to wait until components finish animation effects
 * or data fetch before trying to interact with components. The BusyContext is not limited to
 * test automation developers usages. It is also needed by page developers for waiting on run-time
 * operation readiness.</p>
 *
 * The Busy Context API will wait until busy states have resolved or a timeout period has elapsed.
 * There are several primary wait scenarios:
 * <ol>
 *   <li>Component creation and page bindings applied.</li>
 *   <li>Components that implement animation effects.</li>
 *   <li>Components that must fetch data from a REST endpoint.</li>
 *   <li>General wait conditions that are not specific to the Jet framework. The customer might
 *       choose to register some busy condition associated with application domain logic such
 *       as REST endpoints.</li>
 *   <li>Wait until the bootstrap of the page has completed - jet libraries loaded via requireJS.</li>
 * </ol>
 *
 * <p>The first step for waiting on a busy context is to determine what conditions are of interest
 *   to wait on. The granularity of a busy context can be scoped for the entirety of the page or
 *   for a specific DOM element. Busy contexts have hierarchical dependencies mirroring the
 *   document's DOM structure with the root being the page context. Depending on the particular
 *   scenario, developers might need to target one of the following busy context scopes:</p>
 * <ul>
 *   <li>Scoped for the Page - Automation test developers will more commonly choose the page busy
 *     context. This context represents the page as a whole. Automation developers commonly need
 *     to wait until the page is fully loaded before starting automation. More commonly, automation
 *     developers are interesting in testing the functionality of an application having multiple
 *     JET components versus just a single component.
 *
 *     <pre class="prettyprint">
 *     <code>
 *     var busyContext = oj.Context.getPageContext().getBusyContext();
 *     </code></pre>
 *
 *   </li>
 *   <li>Scoped for the nearest DOM Element - Application developers sometime need a mechanism to
 *     wait until a specific component operation has complete. For example, it might be desirable
 *     to wait until a component has been created and bindings applied before setting a property or
 *     calling a method on the component. Another scenario, waiting for a popup to finish
 *     open or close animation before initiating the next action in their application flow.
 *     For this problem space developers would need to obtain a busy context scoped for a DOM node.
 *     The "data-oj-context" marker attribute is used to define a busy context for a dom subtree.
 *
 *     <pre class="prettyprint">
 *     <code>
 *     <!-- subtree assigned a marker 'data-oj-context' attribute -->
 *     &lt;div id="mycontext" data-oj-context&gt;
 *        ...
 *        &lt;!-- JET content --&gt;
 *        ...
 *     &lt;/div&gt;
 *
 *     var node = document.querySelector("#mycontext");
 *     var busyContext = oj.Context.getContext(node).getBusyContext();
 *     busyContext.whenReady().then(function ()
 *     {
 *       var component = document.querySelector("#myInput");
 *       component.value = "foo";
 *       component.validate().then(function (isValid)
 *       {
 *         if (!isValid)
 *           component.value = "foobar";
 *       });
 *     });
 *     </code></pre>
 *
 *   </li>
 * </ul>
 *
 * The BusyContext API utilizes {@link oj.Logger.LEVEL_LOG} to log detail busy state activity.
 * <pre class="prettyprint">
 * <code>
 *  oj.Logger.option("level", oj.Logger.LEVEL_LOG);
 * </code></pre>
 *
 * <b>This constructor should never be invoked by the application code directly.</b>
 * @hideconstructor
 * @param {Element=} hostNode DOM element associated with this busy context
 * @export
 * @constructor oj.BusyContext
 * @since 2.1.0
 * @classdesc Framework service for querying the busy state of components on the page.
 */
oj.BusyContext = function (hostNode)
{
  this.Init(hostNode);
};

oj.Object.createSubclass(oj.BusyContext, oj.Object, "oj.BusyContext");


/**
 * see oj.BusyContext#setDefaultTimeout
 * @type {number}
 * @ignore
 * @private
 */
oj.BusyContext._defaultTimeout = Number.NaN;

/**
 * Sets a default for the optional <code>timeout</code> argument of the {@link oj.BusyContext#whenReady}
 * for all BusyContext instances. The default value will be implicitly used if a timeout argument is not
 * provided.
 *
 * @export
 * @see oj.BusyContext#whenReady
 * @since 3.1.0
 * @memberof oj.BusyContext
 * @method setDefaultTimeout
 * @param {number} timeout in milliseconds
 * @return {undefined}
 */
oj.BusyContext.setDefaultTimeout = function(timeout)
{
  if (!isNaN(timeout))
    oj.BusyContext._defaultTimeout = timeout;
};

/**
 * @param {Element=} hostNode DOM element associated with this busy context
 * @instance
 * @protected
 */
oj.BusyContext.prototype.Init = function (hostNode)
{
  oj.BusyContext.superclass.Init.call(this);

  this._hostNode = hostNode;

  /**
   * Busy states cache.
   *
   * @type {?}
   * @ignore
   * @private
   */
  this._statesMap = new Map();

  /**
   * Coordinates resolution of the master when ready promise with one or more slave
   * when ready promises having a timeout period.
   *
   * @type {Object}
   * @ignore
   * @private
   */
  this._mediator = {
    /**
     * Returns a master primise that will resolve when all busy states have been resolved.
     *
     * @returns {Promise}
     * @ignore
     * @private
     */
    getMasterWhenReadyPromise : function ()
    {
      if (!this._masterWhenReadyPromise)
        this._masterWhenReadyPromise = new Promise(this._captureWhenReadyPromiseResolver.bind(this));
      return this._masterWhenReadyPromise;
    },
    /**
     * Triggers resolution of the master promise and clears all timeouts associated with slave
     * when ready promises.
     *
     * @returns {void}
     * @ignore
     * @private
     */
    resolveMasterWhenReadyPromise : function ()
    {
      if (this._masterWhenReadyPromiseResolver)
        this._masterWhenReadyPromiseResolver(true);
      this._masterWhenReadyPromise = null;
      this._masterWhenReadyPromiseResolver = null;
    },
    /**
     * Returns a promise that will resolve when the master promise resolves or reject when
     * the slave timeout promise rejects.
     *
     * @param {Promise} master
     * @param {Function} generateErrorCallback
     * @param {number} timeout
     * @returns {Promise}
     * @ignore
     * @private
     */
    getSlaveTimeoutPromise : function (master, generateErrorCallback, timeout)
    {
      var timer;
      var slaveTimeoutPromise = new Promise(function (resolve, reject)
      {
        timer = window.setTimeout(function ()
        {
          reject(generateErrorCallback());
        }, timeout);
      });
      this._slaveTimeoutPromiseTimers.push(timer);

      // When the master promise is resolved, all timers may be cleared
      return Promise.race([master, slaveTimeoutPromise])
                                  .then(this._clearAllSlaveTimeouts.bind(this));
    },

    /**
     * @private
     * @ignore
     * @return {Promise} resolves on the next-tick using setImmediate.
     */
    getNextTickPromise: function()
    {
      if (!this._nextTickPromise)
      {
        this._nextTickPromise = new Promise(function (resolve)
        {
          window.setImmediate(function ()
          {
            this._nextTickPromise = null;
            resolve(true);
          }.bind(this));
        }.bind(this));
      }

      return this._nextTickPromise;
    },

    /**
     * Clears all window timeout timeers that are slave when ready promises.
     *
     * @returns {boolean}
     * @ignore
     * @private
     */
    _clearAllSlaveTimeouts : function ()
    {
      var slaveTimeoutPromiseTimers = this._slaveTimeoutPromiseTimers;
      this._slaveTimeoutPromiseTimers = [];
      for (var i = 0; i < slaveTimeoutPromiseTimers.length; i++)
        window.clearTimeout(slaveTimeoutPromiseTimers[i]);

      return true;
    },
    /**
     * Promise executor function passed as the single master promise constructor.  Captures the
     * promise resolve callback function.  The resolve promise function will be called when all the
     * busy states have been removed.
     *
     * @param {Function} resolve
     * @param {Function} reject
     * @returns {void}
     * @ignore
     * @private
     */
    _captureWhenReadyPromiseResolver : function (resolve, reject)
    {
      this._masterWhenReadyPromiseResolver = resolve;
    },
    /**
     * Array of setTimeout timers that should be cancled when the busy state resolves.
     *
     * @type {Array.<number>}
     * @ignore
     * @private
     */
    _slaveTimeoutPromiseTimers : []
      /**
       * The master when ready promise that will resovle when all busy states resolve.
       *
       * @type {Promise|undefined}
       * @ignore
       * @private
       */
      //_masterWhenReadyPromise : undefined,
      /**
       * The resolve function of the masterWhenReadyPromise.
       *
       * @type {Function|undefined}
       * @ignore
       * @private
       */
      //_masterWhenReadyPromiseResolver : undefined,
      /**
       * Promise evaluated next-tick.
       *
       * @type {Promise|undefined}
       * @ignore
       * @private
       */
      //_nextTickPromise : undefined
  };
};

/**
 * Logs the current registered busy states ordered acceding by the order they were added.
 * The cost of compiling the list is only made if the logger level is oj.Logger.LEVEL_LOG.
 * @param {?} statesMap busy states
 * @returns {void}
 * @private
 */
oj.BusyContext._log = function (statesMap)
{
  if (oj.Logger.option('level') !== oj.Logger.LEVEL_LOG)
    return;

  oj.Logger.log(">> Busy states: %d", statesMap.size);

  var busyStates = oj.BusyContext._values(statesMap);
  if (busyStates.length > 0)
    oj.Logger.log(busyStates.join("\n"));
};

/**
 * @param {?} statesMap busy states
 * @return {Array.<oj.BusyState>} Returns an array of busy states entries from the states map
 * @private
 */
oj.BusyContext._values = function (statesMap)
{
  var busyStates = [];
  statesMap.forEach(function (value)
  {
    busyStates.push(value);
  });

  return busyStates;
};

/**
 * <p>Called by components or services performing a task that should be considered
 * in the overall busy state of the page. An example would be animation or fetching data.</p>
 *
 * Caveats:
 * <ul>
 *   <li>Busy context dependency relationships are determined at the point the first busy state
 *       is added.  If the DOM node is re-parented after a busy context was added, the context will
 *       maintain dependencies with any parent DOM contexts.</li>
 *   <li>The application logic creating busy states is responsible for ensuring these busy states
 *       are resolved. Busy states added internally by JET are automatically accounted for.
 *       The busy states added by the application logic must manage a reference to the resolve
 *       function associated with a busy state and it must be called to release the busy state.</li>
 * </ul>
 *
 * <pre class="prettyprint">
 * <code>// apply the marker attribute to the element
 * &lt;div id="context1" data-oj-context ... &gt;&lt;/&gt;
 * ...
 * ...
 * var context1 = document.querySelector("#context1");
 *
 * // obtain a busy context scoped for the target node
 * var busyContext1 = oj.Context.getContext(context1).getBusyContext();
 * // add a busy state to the target context
 * var options = {"description": "#context1 fetching data"};
 * var resolve = busyContext1.addBusyState(options);
 * ...
 * ...  // perform asynchronous operation that needs guarded by a busy state
 * ...
 * // resolve the busy state after the operation completes
 * resolve();
 * </code></pre>
 *
 * @since 2.1.0
 * @export
 * @memberof oj.BusyContext
 * @instance
 * @method addBusyState
 * @param {Object} options object that describes the busy state being registered.<br/>
 * @param {Object|function():string} options.description
 *         description: Option additional information of what is registering a busy state. Added to
 *                      logging and handling rejected status. Can be supplied as a Object or a
 *                      function.  If the type is an object the toString function needs to be
 *                      implemented.
 * @returns {function():void} resolve function called by the registrant when the busy state completes.
 *                     The resultant function will throw an error if the busy state is no longer
 *                     registered.
 */
oj.BusyContext.prototype.addBusyState = function (options)
{
  oj.Logger.log("BusyContext.addBusyState: start scope='%s'", this._getDebugScope());

  var statesMap = this._statesMap;

  /** @type {oj.BusyState} */
  var busyState = new oj.BusyState(options[oj.BusyContext._DESCRIPTION]);

  oj.Logger.log(">> " + busyState);

  statesMap.set(busyState.id, busyState);

  this._addBusyStateToParent();

  oj.Logger.log("BusyContext.addBusyState: end scope='%s'", this._getDebugScope());

  return this._removeBusyState.bind(this, busyState);
};

/**
 * Logs all active busy states to the {@link oj.Logger} at {oj.Logger.LEVEL_INFO}.
 * <pre class="prettyprint">
 * <code>
 *  oj.Logger.option("level", oj.Logger.LEVEL_INFO);
 *  oj.Context.getPageContext().getBusyContext().dump("before popup open");
 * </code></pre>
 *
 * @export
 * @since 3.1.0
 * @memberof oj.BusyContext
 * @instance
 * @method dump
 * @param {string=} message optional text used to further denote a debugging point
 * @return {undefined}
 */
oj.BusyContext.prototype.dump = function (message)
{
  oj.Logger.info("BusyContext.dump: start scope='%s' %s", this._getDebugScope(),
                 message ? message : "");

  var statesMap = this._statesMap;
  oj.Logger.info(">> Busy states: %d", statesMap.size);

  var busyStates = oj.BusyContext._values(statesMap);
  if (busyStates.length > 0)
    oj.Logger.info(busyStates.join("\n"));

  oj.Logger.info("BusyContext.dump: start scope='%s' %s", this._getDebugScope(),
                 message ? message : "");
};

/**
 * Returns an array of states representing the active busy states managed by the instance.
 *
 * @export
 * @since 3.1.0
 * @method getBusyStates
 * @memberof oj.BusyContext
 * @instance
 * @return {Array.<{id:string, description:string}>} active busy states managed by the context
 *         instance
 */
oj.BusyContext.prototype.getBusyStates = function ()
{
  var statesMap = this._statesMap;

   /** @type {?} */
  var busyStates = oj.BusyContext._values(statesMap);
  return busyStates;
};

/**
 * Forces all busy states per context instance to release.
 * Use with discretion - last course of action.
 *
 * @since 3.1.0
 * @method clear
 * @memberof oj.BusyContext
 * @instance
 * @export
 * @return {undefined}
 */
oj.BusyContext.prototype.clear = function ()
{
  oj.Logger.log("BusyContext.clear: start scope='%s'", this._getDebugScope());

  var statesMap = this._statesMap;
  var busyStates = oj.BusyContext._values(statesMap);
  for (var i = 0; i < busyStates.length; i++)
  {
    /** @type {?} **/
    var busyState = busyStates[i];
    try
    {
      this._removeBusyState(busyState);
    }
    catch (e)
    {
      oj.Logger.log("BusyContext.clear: %o", e);
    }

    Object.defineProperty(busyState, oj.BusyContext._OJ_RIP, {'value': true, 'enumerable': false});
  }

  oj.Logger.log("BusyContext.clear: end scope='%s'", this._getDebugScope());
};

/**
 * <p>Returns a Promise that will resolve when all registered busy states have completed or a maximum
 * timeout period has elapsed. The promise will be rejected if all the busy states are not resolved
 * within the timeout period. The busyness of the whenReady promsie is evaluated in the next-tick
 * of resolving a busy state.</p>
 *
 * "next-tick" is at the macrotask level. "whenReady" is waiting for the microtask queue to be exhausted,
 * yielding control flow to the user agent, before resolving busyness.
 *
 * @see oj.BusyContext#applicationBootstrapComplete
 * @since 2.1.0
 * @export
 * @memberof oj.BusyContext
 * @instance
 * @method whenReady
 * @param {number=} timeout "optional" maximum period in milliseconds the resultant promise
 *        will wait. Also see {@link oj.BusyContext.setDefaultTimeout}.
 * @returns {Promise.<boolean|Error>}
 */
oj.BusyContext.prototype.whenReady = function (timeout)
{
  var debugScope = this._getDebugScope();

  oj.Logger.log("BusyContext.whenReady: start, scope='%s', timeout=%d", debugScope, timeout);
  /** @type {?} */
  var statesMap = this._statesMap;

  var mediator = this._mediator;
  var nextTickPromise = mediator.getNextTickPromise();
  var bootstrapPromise = oj.BusyContext._BOOTSTRAP_MEDIATOR.whenReady();
  var promise = Promise.all([nextTickPromise, bootstrapPromise]).then(
    function()
    {
      oj.Logger.log("BusyContext.whenReady: bootstrap mediator ready scope=%s", debugScope);

      // Since we are executing this code on 'next tick', it is safe to flush any JET throttled updates.
      // Doing so will allow us to take into account any busy states added in response to the pending updates
      oj.BusyContext._deliverThrottledUpdates();

      if (statesMap.size === 0 && !this._waitingOnNextTickBusynessEval)
      {
        // no busy states, promise resolves immediately
        oj.Logger.log("BusyContext.whenReady: resolved no busy states scope=%s", debugScope);
        return Promise.resolve(true);
      }
      else
      {
        oj.Logger.log("BusyContext.whenReady: busy states returning master scope=%s", debugScope);
        return mediator.getMasterWhenReadyPromise();
      }
    }.bind(this)
  );

  // if a timeout argument is not provided, check the default timeout
  if (isNaN(timeout) && !isNaN(oj.BusyContext._defaultTimeout))
    timeout = oj.BusyContext._defaultTimeout;


  if (!isNaN(timeout))
  {
    var handleTimeout = function()
    {
      var error;
      var expiredText = "whenReady timeout of " + timeout + "ms expired ";

      oj.BusyContext._log(statesMap);
      var busyStates = oj.BusyContext._values(statesMap);

      if (!oj.BusyContext._BOOTSTRAP_MEDIATOR.isReady())
      {
        error = new Error(expiredText + 'while the application is loading.' +
          ' Busy state enabled by setting the "window.oj_whenReady = true;" global variable.' +
          ' Application bootstrap busy state is released by calling' +
          ' "oj.Context.getPageContext().getBusyContext().applicationBootstrapComplete();".');
      }
      else
      {
        error = new Error(expiredText + "with the following busy states: " +
                            busyStates.join(", "));
      }

      error["busyStates"] = busyStates;

      oj.Logger.log("BusyContext.whenReady: rejected scope='%s'\n%s", debugScope, error.message);
      return error;

    };
    promise = mediator.getSlaveTimeoutPromise(promise, handleTimeout, timeout);
  }


  oj.Logger.log("BusyContext.whenReady: end scope='%s'", this._getDebugScope());
  return promise;

};

/**
 * <p>Describes the busyness of the context. The busyness is evaluated in the "next-tick" of a busy
 * state being resolved, meaning the number of busy states doesn't necessarily equate to readiness.
 * The readiness is in sync with the {@link oj.BusyContext#whenReady} resultant promise resolution.</p>
 *
 * @see oj.BusyContext#getBusyStates
 * @since 2.1.0
 * @export
 * @memberof oj.BusyContext
 * @instance
 * @method isReady
 * @returns {boolean} <code>true</code> if the context is not busy
 */
oj.BusyContext.prototype.isReady = function ()
{
  oj.Logger.log("BusyContext.isReady: start scope='%s'", this._getDebugScope());
  var rtn = false;

  if (oj.BusyContext._BOOTSTRAP_MEDIATOR.isReady() && !this._waitingOnNextTickBusynessEval)
  {
    var statesMap = this._statesMap;

    rtn = statesMap.size === 0;
    oj.BusyContext._log(statesMap);
  }

  oj.Logger.log("BusyContext.isReady: end scope='%s'", this._getDebugScope());
  return rtn;
};

/**
 * @private
 * @param {oj.BusyState} busyState added busy state
 * @returns {void}
 * @throws {Error} Busy state has already been resolved
 */
oj.BusyContext.prototype._removeBusyState = function (busyState)
{
  var debugScope = this._getDebugScope();

  oj.Logger.log("BusyContext._removeBusyState: start scope='%s'", debugScope);

  // The BusyState object is passed here instead of just the generated id to provide a more
  // descriptive message when the busy state is removed twice. The description (if provided) of
  // the busy state will be captured in the error message.

  var statesMap = this._statesMap;

  if (busyState[oj.BusyContext._OJ_RIP])
  {
    oj.Logger.log("Busy state has been forcefully resolved via clear:\n" + busyState);
    return;
  }
  else if (!statesMap["delete"](busyState.id)) // quoted to make the closure compiler happy
  {
    throw new Error("Busy state has already been resolved:\n" + busyState);
  }

  // no more busy states; evaluate busyness in the next tick
  if (statesMap.size === 0 && !this._waitingOnNextTickBusynessEval)
  {
    this._waitingOnNextTickBusynessEval = true;
    window.setImmediate(this._evalBusyness.bind(this));
  }
  else
  {
    oj.Logger.log("BusyContext._removeBusyState: resolving busy state:\n" + busyState);
  }

  oj.Logger.log("BusyContext._removeBusyState: end scope='%s'", debugScope);
};

/**
 * Evaluates the busyness of the context.
 * @private
 */
oj.BusyContext.prototype._evalBusyness = function()
{
  var debugScope = this._getDebugScope();

  oj.Logger.log("BusyContext._evalBusyness: begin scope='%s'", debugScope);

  // Since we are executing this code on 'next tick', it is safe to flush any JET throttled updates.
  // Doing so will allow us to take into account any busy states added in response to the pending updates
  oj.BusyContext._deliverThrottledUpdates();

  var statesMap = this._statesMap;
  var mediator = this._mediator;

  if (statesMap.size === 0)
  {
    oj.Logger.log("BusyContext._evalBusyness: resolving whenReady promises");

    mediator.resolveMasterWhenReadyPromise();
    this._resolveBusyStateForParent();
  }
  else
  {
    oj.BusyContext._log(statesMap);
  }

  this._waitingOnNextTickBusynessEval = false;

  oj.Logger.log("BusyContext._evalBusyness: end scope='%s'", debugScope);
};

/**
 * <p>This function should be invoke by application domain logic to indicate all application
 * libraries are loaded and bootstrap processes complete.  The assumed strategy is that the
 * application will set a single global variable "oj_whenReady" from a inline script from the
 * document header section indicating the {@link oj.BusyContext#whenReady}
 * should {@link oj.BusyContext#addBusyState} until the application determines its bootstrap
 * sequence has completed.</p>
 *
 * Inline Script Example:
 * <pre class="prettyprint">
 * <code>
 * &lt;head&gt;
 *   &lt;script type=&quot;text/javascript&quot;&gt;
 *     // The "oj_whenReady" global variable enables a strategy that the busy context whenReady,
 *     // will implicitly add a busy state, until the application calls applicationBootstrapComplete
 *     // on the busy state context.
 *     window["oj_whenReady"] = true;
 *   &lt;/script&gt;
 * ...
 * ...
 * </code></pre>
 *
 * Requirejs callback Example:
 * <pre class="prettyprint">
 * <code>
 * require(['knockout', 'jquery', 'app', 'ojs/ojknockout', 'ojs/ojselectcombobox' ...],
 *   function(ko, $, app)
 *   {
 *     // release the application bootstrap busy state
 *     oj.Context.getPageContext().getBusyContext().applicationBootstrapComplete();
 *     ...
 *     ...
 *   });
 * </code></pre>
 *
 * @since 3.2.0
 * @export
 * @memberof oj.BusyContext
 * @method applicationBootstrapComplete
 * @returns {undefined}
 */
oj.BusyContext.prototype.applicationBootstrapComplete = function ()
{
  var debugScope = this._getDebugScope();
  oj.Logger.log("BusyContext.applicationBootstrapComplete: begin scope='%s'", debugScope);

  oj.BusyContext._BOOTSTRAP_MEDIATOR.notifyComplete();

  oj.Logger.log("BusyContext.applicationBootstrapComplete: end scope='%s'", debugScope);
};

/**
 * @ignore
 * @private
 * @return {oj.BusyContext} returns the nearest parent context
 */
oj.BusyContext.prototype._getParentBusyContext = function()
{
  if (this._hostNode)
  {
    var parentContext =  oj.Context.getContext(oj.Context.getParentElement(this._hostNode));
    if (parentContext)
    {
      return parentContext.getBusyContext();
    }
  }

  return null;
}

/**
 * Links a child context to its parent by registering a busy state with the parent
 * that will recursively register with its parent.
 *
 * @ignore
 * @private
 */
oj.BusyContext.prototype._addBusyStateToParent = function()
{
  if (!this._parentNotified)
  {
    this._parentNotified = true;

    var parentContext = this._getParentBusyContext();
    if (parentContext)
    {
      var opts = {};
      opts[oj.BusyContext._DESCRIPTION] = this._getCompoundDescription.bind(this);
      this._parentResolveCallback = parentContext.addBusyState(opts);
    }
  }
}

/**
 * Resolves the busy state linking a child context with its parent.
 *
 * @ignore
 * @private
 */
oj.BusyContext.prototype._resolveBusyStateForParent = function()
{
  this._parentNotified = false;
  if (this._parentResolveCallback)
  {
    this._parentResolveCallback();
    this._parentResolveCallback = null;
  }
}

/**
 * @private
 * @ignore
 * @return {string} description of all active busy states held by the context.
 */
oj.BusyContext.prototype._getCompoundDescription = function()
{
  var busyStates = oj.BusyContext._values(this._statesMap);
  return ('[' + busyStates.join(", ") + ']');
}

/**
 * @private
 * @ignore
 * @return {string} context debug scope
 */
oj.BusyContext.prototype._getDebugScope = function()
{
  function toSelector(node)
  {
    var selector = "undefined";
    if (node)
    {
      if (node.id && node.id.length > 0)
        selector = "#" + node.id;
      else
      {
        selector = node.nodeName;
        if (node.hasAttribute("data-oj-context"))
          selector += '[data-oj-context]';

        var clazz = node.getAttribute("class");
        if (clazz)
          selector += "." + clazz.split(" ").join(".");
      }
    }

    return selector;
  }

  if (!this._debugScope)
  {
    if (this._hostNode)
      this._debugScope = toSelector(this._hostNode.parentElement) + " > " +
                         toSelector(this._hostNode);
    else
      this._debugScope = "page";
  }

  return this._debugScope;
};

/**
 * @since 3.1.0
 * @override
 * @memberof oj.BusyContext
 * @instance
 * @method toString
 * @returns {string} returns the value of the object as a string
 */
oj.BusyContext.prototype.toString = function ()
{
  var msg = "Busy Context: [scope=";
  msg += this._getDebugScope();
  msg += " states=" + this._getCompoundDescription() + "]"
  return msg;
};

/**
 * @ignore
 * @private
 */
oj.BusyContext._deliverThrottledUpdates = function()
{
  // Dynamically check for the presence of ojs/ojknockout
  if (oj.ComponentBinding)
  {
    oj.ComponentBinding.deliverChanges();
  }
}

/**
 * @private
 * @ignore
 * @const
 * attribute name describing a busystate
 * @type {string}
 */
oj.BusyContext._DESCRIPTION = "description";

/**
 * @ignore
 * @private
 * @constant
 * {@link oj.BusyState} property name indicating the instance is dead
 * @type {string}
 */
oj.BusyContext._OJ_RIP = "__ojRip";

/**
 * @ojtsignore
 * @private
 * @ignore
 */
oj.BusyContext._BOOTSTRAP_MEDIATOR = new /** @constructor */(function()
{
  var _tracking;
  var _readyPromise;
  var _resolveCallback;

  if (typeof window !== 'undefined')
  {
    _tracking = window["oj_whenReady"];
  }

  this.whenReady = function()
  {
    if (_readyPromise)
    {
      return _readyPromise;
    }

    if (!_tracking)
    {
      _readyPromise = Promise.resolve(true);
    }
    else
    {
      _readyPromise = new Promise(
        function(resolve, reject)
        {
          _resolveCallback = resolve;
        }
      );
    }
    return _readyPromise;
  }

  this.isReady = function()
  {
    return !_tracking;
  }

  this.notifyComplete = function()
  {

    if (_resolveCallback)
    {
      // resovle the promise in the next-tick.
      window.setImmediate(function ()
      {
        _tracking = false;
        _resolveCallback(true);
        _resolveCallback = null;
      });
    }
    else
    {
      _tracking = false;
    }
  }

})();

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/**
 * <b>The constructor should never be invoked by an application directly</b>. Use
 * {@link oj.Context.getPageContext} and {@link oj.Context.getContext} APIs to
 * retrieve an instance of the context.
 * @param {Element=} node DOM node where the context should be created
 * @export
 * @hideconstructor
 * @constructor oj.Context
 * @since 2.1.0
 * @classdesc This is a general purpose context. Initially it only exposes the BusyContext
 * that keeps track of components that are currently animating or fetching data.
 * In the future this context might be expanded for other purposes.
 */
oj.Context = function (node)
{
  this.Init(node);
};

oj.Object.createSubclass(oj.Context, oj.Object, "oj.Context");

/**
 * @method Init
 * @param {Element=} node DOM node where the context should be created
 * @instance
 * @memberof oj.Context
 * @instance
 * @protected
 */
oj.Context.prototype.Init = function (node)
{
  oj.Context.superclass.Init.call(this);
  this._node = node;
};

/**
 * Returns the closest enclosing JET context for a node.
 * Any DOM element may be designated by the page author as a host of JET context.
 * The designation must be expressed in HTML markup by specifying the "data-oj-context"
 * attribute on the host element:

 * <pre class="prettyprint">
 * &lt;div data-oj-context>&lt;div>
 * </pre>
 *
 * <p>This method will walk up the element hierarchy starting with the source node to
 * find an element that has the data-oj-context attribute. If no such element is found,
 * the page context will be returned.</p>
 *
 * If the JET context is established on a particular element, the {@link oj.BusyContext}
 * associated with that context will be tracking busy states for that element and
 * its subtree
 *
 * @see oj.BusyContext for code examples
 * @method getContext
 * @memberof oj.Context
 * @param {Element} node DOM element whose enclosing context will be provided
 * @return {oj.Context} context object scoped per the target node
 * @since 2.2.0
 * @export
 */
oj.Context.getContext = function(node)
{
  while(node)
  {
    var context = node[oj.Context._OJ_CONTEXT_INSTANCE];
    if (context)
    {
      return context;
    }
    if (node.hasAttribute(oj.Context._OJ_CONTEXT_ATTRIBUTE))
    {
      context = new oj.Context(node);
      Object.defineProperty(node, oj.Context._OJ_CONTEXT_INSTANCE,
                                                        {'value': context});
      return context;
    }

    node = oj.Context.getParentElement(node);
  }

  return oj.Context.getPageContext();
};

/**
 * Static factory method that returns the page context.
 * @see oj.BusyContext for code examples
 * @export
 * @since 2.1.0
 * @method getPageContext
 * @return {oj.Context} context scoped for the page
 * @memberof oj.Context
 */
oj.Context.getPageContext = function ()
{
  if (!oj.Context._pageContext)
    oj.Context._pageContext = new oj.Context();

  return oj.Context._pageContext;
};

/**
 * @see oj.BusyContext for code examples
 * @since 2.1.0
 * @export
 * @method getBusyContext
 * @memberof oj.Context
 * @instance
 * @returns {oj.BusyContext} busy state context
 */
oj.Context.prototype.getBusyContext = function ()
{
  if (!this._busyContext)
    this._busyContext = new oj.BusyContext(this._node);

  return this._busyContext;
};

/**
 * @ignore
 * @private
 * @constant
 * Element marker attribute defining a context
 * @type {string}
 */
oj.Context._OJ_CONTEXT_ATTRIBUTE = "data-oj-context";

/**
 * @ignore
 * @private
 * @constant
 * Element property name for a context
 * @type {string}
 */
oj.Context._OJ_CONTEXT_INSTANCE = "__ojContextInstance";

/**
 * @ignore
 * @private
 * @constant
 * attribute identifying an open popup
 * @type {string}
 */
oj.Context._OJ_SURROGATE_ATTR = "data-oj-surrogate-id";

/**
 * @ignore
 * @public
 * @param {Element} element target
 * @return {Element} the logical parent of an element accounting for open popups
 * @memberof oj.Context
 */
oj.Context.getParentElement = function (element)
{
  // @see oj.ZOrderUtils._SURROGATE_ATTR in "ojpopupcore/PopupService.js" for the details on how
  // this attribute is used by the popup service. The constant was re-declared to simplify module
  // dependencies.

  if (element && element.hasAttribute(oj.Context._OJ_SURROGATE_ATTR))
  {
    var surrogate = document.getElementById(element.getAttribute(oj.Context._OJ_SURROGATE_ATTR));
    if (surrogate)
      return surrogate.parentElement;
  }

  return element.parentElement;
};

(function()
{

  /**
   * @ignore
   * @private
   */
  oj.__AttributeUtils = {};
  
  /**
   * @ignore
   * @return {{expr: (null|string), downstreamOnly: boolean}} 
   * @private
   */
  oj.__AttributeUtils.getExpressionInfo = function(attrValue)
  {
    var info = {};
    if (attrValue)
    {
      var trimmedVal = attrValue.trim();
      var exp = _ATTR_EXP.exec(trimmedVal);
      exp = exp ? exp[1] : null;
      if (!exp)
      {
       info.downstreamOnly = true;
       exp = _ATTR_EXP_RO.exec(trimmedVal);
       exp = exp ? exp[1] : null;
      }
      info.expr = exp;
    }

    return info;
  }
  
  /**
   * @ignore
   * @param {string} attr attribute name
   * @return {string} property name
   * @private
   */
  oj.__AttributeUtils.attributeToPropertyName = function(attr)
  {
    return attr.toLowerCase().replace(/-(.)/g,
      function(match, group1)
      {
        return group1.toUpperCase();
      }
    );
  }
  
  /**
   * @ignore
   * @param {string} name property name
   * @return {string} attribute name
   * @private
   */
  oj.__AttributeUtils.propertyNameToAttribute = function(name)
  {
    return name.replace(/([A-Z])/g,
      function(match)
      {
        return '-' + match.toLowerCase();
      }
    );
  }

  /**
   * @ignore
   * @param {string} type event type (e.g. ojBeforeExpand)
   * @return {string} event listener property name (e.g. onOjBeforeExpand)
   * @private
   */
  oj.__AttributeUtils.eventTypeToEventListenerProperty = function(type)
  {
    return 'on' + type.substr(0,1).toUpperCase() + type.substr(1);
  }

  /**
   * @ignore
   * @param {string} property event listener property name (e.g. onOjBeforeExpand)
   * @return {string|null} event type (e.g. ojBeforeExpand)
   * @private
   */
  oj.__AttributeUtils.eventListenerPropertyToEventType = function(property)
  {
    if (/^on[A-Z]/.test(property)) {
      return property.substr(2,1).toLowerCase() + property.substr(3);
    }
    return null;
  }

  /**
   * @ignore
   * @param {string} name property name (e.g. expanded)
   * @return {string} change event type (e.g. expandedChanged)
   * @private
   */
  oj.__AttributeUtils.propertyNameToChangeEventType = function(name)
  {
    return name + 'Changed';
  }

  /**
   * @ignore
   * @param {string} type change event type (e.g. expandedChanged)
   * @return {string|null} propertyName (e.g. expanded)
   * @private
   */
  oj.__AttributeUtils.changeEventTypeToPropertyName = function(type)
  {
    if (/Changed$/.test(type)) {
      return type.substr(0, type.length - 7);
    }
    return null;
  }

  /**
   * @ignore
   * @param {string} trigger event trigger (e.g. beforeExpand)
   * @return {string} event type (e.g. ojBeforeExpand)
   * @private
   */
  oj.__AttributeUtils.eventTriggerToEventType = function(trigger)
  {
    return 'oj' + trigger.substr(0,1).toUpperCase() + trigger.substr(1);
  }

  /**
   * @ignore
   * @param {string} type event type (e.g. ojBeforeExpand)
   * @return {string|null} event trigger (e.g. beforeExpand)
   * @private
   */
  oj.__AttributeUtils.eventTypeToEventTrigger = function(type)
  {
    if (/^oj[A-Z]/.test(type)) {
      return type.substr(2,1).toLowerCase() + type.substr(3);
    }
    return null;
  }
  
  /**
   * Parses attribute values to the specified metadata type. Throws
   * an error if the value cannot be parsed to the metadata type
   * or if no type was provided.
   * @ignore
   * @param {Element} elem The element whose value we are parsing
   * @param {string} attr attribute
   * @param {string} value attribute value
   * @param {string} type property type
   * @return {any} coerced value
   * @private
   */
  oj.__AttributeUtils.coerceValue = function(elem, attr, value, type)
  {
    if (!type)
    {
      throw "Unable to parse " + attr + "='" + value + "' for " + elem.tagName + " with id " + elem.id + 
      " . This attribute only supports data bound values. Check the API doc for supported types";
    }
    
    // We only support primitive types and JSON objects for coerced properties.
    // Generally, we support parsing of a single type except for Object|string or Array|string cases
    // defined in metadata.
    var typeLwr = type.toLowerCase();
    // The below checks ignore the couble {{}} [[]] cases since expression checking occurs
    // before attribute value coercion
    // Tests to see if the value starts and ends with matched [...] ignoring whitespace
    var isValueArray = _ARRAY_VALUE_EXP.test(value);
    // Tests to see if the value starts and ends with matched {...} ignoring whitespace
    var isValueObj = _OBJ_VALUE_EXP.test(value);

    if ((_ARRAY_TYPE_EXP.test(typeLwr) && isValueArray) ||
        (_OBJ_TYPE_EXP.test(typeLwr) && isValueObj) ||
        (typeLwr === 'any' && (isValueArray || isValueObj)))
    {
      try
      {
        return JSON.parse(value);
      }
      catch (ex) 
      {
        throw "Unable to parse " + attr + "='" + value + "' for " + elem.tagName + " with id " + elem.id +
        " to a JSON Object. Check the value for correct JSON syntax, e.g. double quoted strings. " + ex;
      }
    }
    else if (typeLwr === "boolean")
    {
      // Boolean attributes are considered true if the attribute is:
      // 1) Set to the empty string
      // 2) Present in the DOM without a value assignment
      // 3) Set to the 'true' string
      // 4) Set to the case-insensitive attribute name
      // Boolean values are considered false if set to the false string.
      // An error is thrown for all other values and the attribute value will not be set.
      if (value == null || value === "true" || value === "" || value.toLowerCase() === attr)
        return true;
      else if (value === "false")
        return false;
    }
    else if (typeLwr === "number")
    {
      if (!isNaN(value))
        return Number(value);
    }
    else
    {
      var typeAr = type.split('|');
      // The any type will return a string if not matched as an object or array in first check
      if (typeAr.indexOf('string') !== -1 || typeLwr === 'any')
        return value;
    }

    throw "Unable to parse " + attr + "='" + value + "' for " + elem.tagName + " with id " + elem.id + " to a " + type + ".";
  }
  
  // Checks that a string either starts with 'array' or contains '|array'
  var _ARRAY_TYPE_EXP = /(^array)|(\|array)/;
  // Checks that a string either starts with 'object' or contains '|object'
  var _OBJ_TYPE_EXP = /(^object)|(\|object)/;
  
  var _ARRAY_VALUE_EXP = /\s*\[[^]*\]\s*/;
  var _OBJ_VALUE_EXP = /\s*\{[^]*\}\s*/;

  // Check for {{..}} and [[..]] at the beginning of strings to avoid matching
  // any usages mid string
  var _ATTR_EXP = /^(?:\{\{)([^]+)(?:\}\})$/;
  var _ATTR_EXP_RO = /^(?:\[\[)([^]+)(?:\]\])$/;
  
})();


(function () {  
  if (typeof window === 'undefined') {
    return;
  }
  // polyfill for Element.closest()
  if (window['Element'] && !Element.prototype.closest) {
    Element.prototype.closest =
        function(s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
              i,
              el = this;
      do {
        i = matches.length;
        while (--i >= 0 && matches.item(i) !== el) {}
      } while ((i < 0) && (el = el.parentElement));
      return el;
    };
  }
})();
/**
 * Utility class with functions for preprocessing HTML data  
 * to avoid a problem using a custom tag within HTML table.
 * Used as a part of ModuleElementUtils.createView() call
 *
 * @constructor
 * @private
 */
oj.__HtmlUtils = (function() {
  
  //replace '<from' tag with '<oj-bind-replace-from' globally in the provided string in order to identify and reverse it later
  var escapeTag = function (from, str) {
    var startTag = new RegExp('<' + from + '(?=\\s|>)', 'gi');
    var endTag = new RegExp('</' + from + '(?=\\s|>)', 'gi');
    return str.replace(startTag, '<' + 'oj-bind-replace-' + from).replace(endTag, '</' + 'oj-bind-replace-' + from);
  }
  
  //replace '<oj-bind-replace-tag' with the original <tag in the array of DOM nodes
  var unescapeTag = function (parent) {
    var children = parent.childNodes;
    var len = children.length;
    for (var i = 0; i < len; i++) {
      var child = children[i];
      unescapeTag(child);
      var nodeName = child.nodeName.toLowerCase();
      if (nodeName.substr(0,16) === 'oj-bind-replace-') {
        var replName = nodeName.substr(16);
        var replNode = document.createElement(replName);
        for (var j = 0; j < child.attributes.length; j++) {
          var attr = child.attributes[j];
          replNode.setAttribute(attr.name, attr.value);
        }
        var childHolder = replNode.content ? replNode.content : replNode;
        for (var j = 0; child.childNodes.length > 0; ) {
          childHolder.appendChild(child.childNodes[0]);
        }
        parent.replaceChild(replNode, child);
      }
      else if(nodeName === "script" || nodeName === "style") {
        var replNode = document.createElement(nodeName);
        for (var j = 0; j < child.attributes.length; j++) {
          var attr = child.attributes[j];
          replNode.setAttribute(attr.name, attr.value);
        }
        var origHTML = child.innerHTML;
        replNode.innerHTML = origHTML.replace(new RegExp('oj-bind-replace-', 'g'), '');
        parent.replaceChild(replNode, child);
      }
      else if(child.nodeType === 8) { //comment node
        var origValue = child.nodeValue;
        child.nodeValue = origValue.replace(new RegExp('oj-bind-replace-', 'g'), '');
      }      
    }
  }

  return {
    stringToNodeArray: function(html) {
      // escape html for the predefined tags
      var tags = ["table","caption","colgroup","col","thead","tfoot","th","tbody","tr","td","template"];
      for (var i = 0; i < tags.length; i++) {
        html = escapeTag(tags[i], html);
      }
      //convert tags into DOM structure
      var container = document.createElement("div");
      container.innerHTML = html; //@HTMLUpdateOK html is the oj-module or composite View which does not come from the end user
      if (html.indexOf("<oj-bind-replace-") !== -1)
        unescapeTag(container);
      
      //convert child nodes to nodes array accepted by oj-module element
      var childList = container.childNodes;
      var nodesArray = [];
      for(var i = childList.length; i--; nodesArray.unshift(childList[i]));
      return nodesArray;
    }
  };
  
})();
/**
 * Timing related utilities
 * @namespace
 * @name oj.TimerUtils
 * @since 4.1.0
 * @ojstatus preview
 */
oj.TimerUtils = {};

/**
 * A Timer encapsulates a Promise associated with a deferred function execution
 * and the ability to cancel the timer before timeout.
 * @interface Timer
 */
 function Timer() {};
 /**
  * Get the Promise assocaited with this timer.  Promise callbacks will be
  * passed a single boolean value indicating if the timer's timeout expired
  * normally (without being canceled/cleared).  If the timer is left to expire
  * after its configured timeout has been exceeded, then it will pass
  * boolean(true) to the callbacks.  If the timer's {@link #clear} method is
  * called before its configured timeout has been reached, then the callbacks
  * will receive boolean(false).
  * @memberof Timer
  * @return {Promise.<boolean>} This timer's Promise
  */
 Timer.prototype.getPromise = function() {};
 /**
  * Clears the timer and resolves the Promise.  If the normal timeout hasn't
  * yet expired, the value passed to the Promise callbacks will be boolean(false).
  * If the timeout has already expired, this function will do nothing, and all of
  * its Promise callbacks will receive boolean(true).
  * @return {void}
  * @memberof Timer
  */
 Timer.prototype.clear = function() {};

/**
 * Get a Timer object with the given timeout in milliseconds.  The Promise
 * associated with the timer is resolved when the timeout window expires, or if
 * the clear() function is called.
 * This is useful for when code needs to be executed on timeout (setTimeout) and
 * must handle cleanup tasks such as clearing {@link BusyState} when the timer
 * expires or is canceled.
 *
 * @param  {number} timeout The timeout value in milliseconds to wait before the
 * promise is resolved.
 * @return {Timer}
 * A Timer object which encapsulates the Promise that will be
 * resolved once the timeout has been exceeded or cleared.
 * @export
 * @memberof oj.TimerUtils
 * @example <caption>Get a timer to execute code on normal timeout and
 * cancelation.  If the timeout occurs normally (not canceled), both
 * callbacks are executed and the value of the 'completed' parameter will be
 * true.</caption>
 * var timer = oj.TimerUtils.getTimer(1000);
 * timer.getPromise().then(function(completed) {
 *     if (completed) {
 *       // Delayed code
 *     }
 *   })
 * timer.getPromise().then(function() {
 *   // Code always to be run
 * })
 *
 * @example <caption>Get a timer to execute code on normal timeout and cancelation.
 * In this example, the timer is canceled before its timeout expires, and the
 * value of the 'completed' parameter will be false.</caption>
 * var timer = oj.TimerUtils.getTimer(1000);
 * timer.getPromise()
 *   .then(function(completed) {
 *     if (completed) {
 *       // Delayed code
 *     }
 *   })
 * timer.getPromise()
 *   .then(function() {
 *     // Code always to be run
 *   })
 * ...
 * timer.clear(); // timer cleared before timeout expires
 */
oj.TimerUtils.getTimer = function(timeout) {
    return new oj.TimerUtils._TimerImpl(timeout);
}

/**
 * @constructor
 * @implements {Timer}
 * @param  {number} timeout The timeout value in milliseconds.
 * @private
 */
oj.TimerUtils._TimerImpl = function(timeout) {
    var _promise;
    var _resolve;
    var _timerId;

    this.getPromise = function() {
        return _promise;
    }
    this.clear = function() {
        window.clearTimeout(_timerId);
        _timerId = null;
        _timerDone(false);
    }

    /**
     * Called on normal and early timeout (cancelation)
     */
    function _timerDone(completed) {
        _timerId = null;
        _resolve(completed);
    }

    if (typeof window === 'undefined') {
        _promise = Promise.reject();
    }
    else {
        _promise = new Promise(function(resolve) {
            _resolve = resolve;
            _timerId = window.setTimeout(_timerDone.bind(null, true), timeout);
        });
    }
};

;return oj;
});