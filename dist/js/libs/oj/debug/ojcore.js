/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['require', 'ojL10n!ojtranslations/nls/ojtranslations', 'promise'], function(require, ojt)
{
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

/**
 * Global exported Oracle JET namespace
 * @property {String} version JET version number
 * @property {String} build JET build number
 * @property {String} revision JET source code revision number
 */
var oj = _scope['oj'] =
{
  'version': "2.2.0",
  'build' : "10",
  'revision': "29506",

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
 */
oj.Logger.LEVEL_NONE = 0;
/**
 * Log level error
 * @const
 * @export
 */
oj.Logger.LEVEL_ERROR = 1;
/**
 * Log level warning
 * @const
 * @export
 */
oj.Logger.LEVEL_WARN = 2;
/**
 * Log level info
 * @const
 * @export
 */
oj.Logger.LEVEL_INFO = 3;
/**
 * Log level - general message
 * @const
 * @export
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
 * @param {...} args The method supports a variable number of arguments, string substitutions and accepts a function as a parameter.
 *                                See examples in the overview section above.
 * @export
 */
oj.Logger.error = function(args)
{
  oj.Logger._write(oj.Logger.LEVEL_ERROR, oj.Logger._METHOD_ERROR, arguments);
};

/**
 * Writes an informational  message.
 * @param {...} args The method supports a variable number of arguments, string substitutions and accepts a function as a parameter.
 *                                See examples in the overview section above.
 * @export
 */
oj.Logger.info = function(args)
{
  oj.Logger._write(oj.Logger.LEVEL_INFO, oj.Logger._METHOD_INFO, arguments);
};

/**
 * Writes a warning message.
 * @param {...} args The method supports a variable number of arguments, string substitutions and accepts a function as a parameter.
 *                                See examples in the overview section above.
 * @export
 */
oj.Logger.warn = function(args)
{
  oj.Logger._write(oj.Logger.LEVEL_WARN, oj.Logger._METHOD_WARN, arguments);
};

/**
 * Writes a general message.
 * @param {...} args The method supports a variable number of arguments, string substitutions and accepts a function as a parameter.
 *                                See examples in the overview section above.
 * @export
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
 * @param {Object|string=} key
 * @param {Object|string=} value
 * @export
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
 */
oj.CHECKPOINT_MANAGER = {};

/**
 * Starts a checkpoint
 * @param {!string} name - the name of the checkpoint
 * @param {string=} description - optional description of the checkpoint
 * @export
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
 */
oj.CHECKPOINT_MANAGER.matchRecords = function (regexp)
{
  return _checkpointManagerDelegate ? _checkpointManagerDelegate['matchRecords'](regexp) : [];
};

/**
 * Dumps matched records into oj.Logger
 * @param {!RegExp} regexp - regular expression for the records to dump.
 * @export
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
 * @author Blake Sullivan
 */


/**
 * @constructor
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
 * Calls to  this method are added by the Closure Compiler pass during JET's build process.
 * It should never be called by the Application code
 *
 * The method delegates to goog.exportProperty() for exporting a symbol with Closure compiler,
 * while recording a map of the renamed names to an original names and a map of original names to the renamed names
 * @param {string} name - name of the property ('CCCC.prototype.FFFF' is expected)
 * @param {Object} valueMapping - a name-value pair, where tke key is the renamed name (renamed FFFF), and the value is the refernce to the member function
 * whose name was exported
 * @ignore
 */
oj.Object.exportPrototypeSymbol = function(name, valueMapping)
{
  var renamed = null;
  var val = null, prop;
  for (prop in valueMapping)
  {
    if (valueMapping.hasOwnProperty(prop)) {
        renamed = prop;
        val = valueMapping[prop];
        break;
    }
  }

  var tokens = name.split('.');

  var constructor = oj[tokens[0]];
  var original = tokens[2];

  // Do nothing if we are exporting a function that has not been renamed
  if (renamed == original || renamed == null)
  {
    return;
  }

  var renameMap = constructor._r2o;
  if (!renameMap)
  {
     renameMap = {};
     constructor._r2o = renameMap;
  }

  renameMap[renamed] = original;

  goog.exportProperty(constructor.prototype, original, val);
};

/**
 * Creates a subclass of a baseClass
 * @param {Object} extendingClass The class to extend from the base class
 * @param {Object} baseClass class to make the superclass of extendingClass
 * @param {string=} typeName to use for new class.  If not specified, the typeName will be extracted from the
 * baseClass's function if possible
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
 * @param {Object} targetClass - the function whose prototype will be used a
 * copy target
 * @param {Object} source - object whose properties will be copied
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
 * @param {Object=} otherInstance - if specified, the instance whose type
 * should be returned. Otherwise the type if this instance will be returned
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
 */
oj.Object.prototype.toString = function()
{
  return this.toDebugString();
};

/**
 * @export
 */
oj.Object.prototype.toDebugString = function()
{
  return this.getTypeName() + " Object";
};


/**
 * Returns the type name for a class derived from oj.Object
 * @param {Object|null} clazz Class to get the name of
 * @return {String} name of the Class
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
 * @return {String} name of the Class
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
 * @param {Object} clazz The class to ensure initialization of
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
 * @param {Object!} obj - object that will be available to the supplied callback
 * function as 'this'
 * @param {Object!} func - the original callback
 * @return {function()} a function that will be invoking the original callback with
 * 'this' object assigned to obj
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

    oj.Object._applyRenamesToSubclass(currClass);
  }


  // if the class has an initialization function, call it
  InitClassFunc = currClass["InitClass"] || null;

  // Check for the quoted name in case InitClass is renamed by Closure compiler
  if (!InitClassFunc)
  {
    InitClassFunc = currClass["InitClass"];
  }

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
 *
 * @public
 * @export
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

//Shadow comparion of two arrays, order needn't be same, but no duplicates
oj.Object._compareSet = function (array1, array2)
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
    if ((array1[i] != array2[i]) &&
        ((array1.indexOf(array2[i]) == -1 ||
          array2.indexOf(array1[i]) == -1)))
      return false;
  }

  return true;
}


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
 */
oj.Object._applyRenamesToSubclass = function (currClass)
{
  // Check whether any renames actually happened
  if (!oj.Object._r2o)
  {
    return;
  }
  var ancestor = currClass.superclass;
  oj.Object._applyRenamesFromChain(currClass, ancestor);
};

/**
 * @private
 */
oj.Object._applyRenamesFromChain = function(currClass, superclass)
{
  if (!superclass)
  {
    return;
  }

  var ancestor = superclass.constructor;


  //Recurse up the inheritance chain first
  oj.Object._applyRenamesFromChain(currClass, ancestor.superclass);

  var renameMap = ancestor._r2o, alias;
  if (renameMap)
  {
    for (alias in renameMap)
    {
      if (renameMap.hasOwnProperty(alias)) {
        var orig = renameMap[alias];
        if (alias != orig)
        {
          var prot = currClass.prototype;
          if (!prot.hasOwnProperty(alias) && prot.hasOwnProperty(orig))
          {
            prot[alias] = prot[orig];
          }
          else if(!prot.hasOwnProperty(orig) && prot.hasOwnProperty(alias))
          {
            prot[orig] = prot[alias];
          }
        }
      }
    }
  }
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
 * @author Blake Sullivan
 * @constant {Object|Boolean} DEBUG <code>true</code> if assertions are enabled.
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
 */
oj.Assert.forceDebug = function()
{
  oj.Assert[_DEBUG] = true;
};

/**
 * Forces DEBUG to be set to false
 * @export
 */
oj.Assert.clearDebug = function() {
  oj.Assert[_DEBUG] = false;
};

/**
 * Determines whether oj.Assert is running in debug mode
 * @return {boolean} true for debug mode, false otherwise
 * @export
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
 * Attach an event handler
 * @param {string} eventType eventType
 * @param {function(Object)} eventHandler event handler function
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
 * Detach an event handler
 * @param {string} eventType eventType
 * @param {function(Object)} eventHandler event handler function
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
 * @class Services for setting and retrieving configuration options
 * @export
 */
oj.Config = {};

/**
 * Retrieves the current locale
 * @return {string} current locale
 * @export
 */
oj.Config.getLocale = function()
{
  var rl, loc;
  if (oj.__isAmdLoaderPresent())
  {
    oj.Assert.assert(ojt !== undefined, "ojtranslations module must be defined");
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
 * @param {string} locale (language code and subtags separated by dash)
 * @param {Function} callback - for applications running with an AMD Loader (such as Require.js), this optional callback
 * will be invoked when the framework is done loading its translated resources and Locale Elements for the newly specified locale.
 * For applications running without an AMD loader, this optional callback will be invoked immediately
 * @export
 */
oj.Config.setLocale = function(locale, callback)
{

  var cb = function() {
    if (callback) {
      callback();
    }
  }

  if (oj.__isAmdLoaderPresent())
     {
       var prefix = "ojtranslations/nls/"
       require([prefix + locale + "/ojtranslations"], function(translations) {
         ojt = translations;
         if (!oj.LocaleData) {
           cb();
           return
         }
         require([prefix + locale + "/localeElements"], function(localeElements) {
           if (localeElements) {
             oj.LocaleData.__updateBundle(localeElements);
           }

           if (!oj.TimezoneData) {
             cb();
             return
           }

           var wait = 0;
           var doCB = function() {
             if (processed == 0) {
               cb()
             }
           }

           var tzBundles = oj.TimezoneData.__getBundleNames();
           tzBundles.forEach(function(bundle) {
             wait++
             // having all expressions in a require results in webpack
             // including **/* files from this point downward
             require(["ojtranslations/nls/" + locale + bundle], function(tzBundle) {
               oj.TimezoneData.__mergeIntoLocaleElements(tzBundle);
               wait--
               // slowest one fires the callback
               doCB()
             })
           })
         })
       })
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
 *
 * @param {string} relativePath resource path
 * @return {string} resource URL
 * @see oj.Config.setResourceBaseUrl
 * @export
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
 * @param {string} baseUrl base URL
 * @see oj.Config.getResourceUrl
 * @export
 */
oj.Config.setResourceBaseUrl = function(baseUrl)
{
  oj.Config._resourceBaseUrl = baseUrl;
};

/**
 * Sets the automation mode.
 * @param {string} mode "enabled" for running in automation mode
 * @see oj.Config.getAutomationMode
 * @export
 */
oj.Config.setAutomationMode = function(mode)
{
  oj.Config._automationMode = mode;
};

/**
 * Gets the automation mode.
 * @return {string} automation mode
 * @see oj.Config.setAutomationMode
 * @export
 */
oj.Config.getAutomationMode = function()
{
  return oj.Config._automationMode;
};

/**
 * Return a string containing important version information about JET and the libraries
 * it has loaded
 *
 * @return {string}
 * @export
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
 * @export
 */
oj.Config.logVersionInfo = function()
{
    console.log(oj.Config.getVersionInfo());
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true*/


/**
 * @class Utilities for qualifying the user agent string.
 * @public
 * @ignore
 */
oj.AgentUtils = function () {};

/**
 * Identity of the target browser.
 * @enum {string}
 * @public
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
 */
oj.AgentUtils.OS =
{
  WINDOWS: "Windows",
  SOLARIS: "Solaris",
  MAC: "Mac",
  UNKNOWN: "Unknown",
  ANDROID: "Android",
  IOS: "IOS",
  LINUX: "Linux"
};
/**
 * Parses the browser user agent string determining what browser and layout engine
 * is being used.
 *
 * @param {Object|null|string=} userAgent a specific agent string but defaults to navigator userAgent if not provided
 * @return {{os: oj.AgentUtils.OS, browser: oj.AgentUtils.BROWSER, browserVersion: number,
 *          engine: oj.AgentUtils.ENGINE, engineVersion: number, hashCode: number}}
 * @public
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
  else if (userAgent.indexOf("win") > -1)
    os = oj.AgentUtils.OS.WINDOWS;
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
    'engine': engine,
    'engineVersion': engineVersion
  };
  return {
    'os': currAgentInfo["os"],
    'browser': currAgentInfo["browser"],
    'browserVersion': currAgentInfo["browserVersion"],
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
 *
 * @class Services for getting information from the theme
 * @since 1.2.0
 * @export
 */
oj.ThemeUtils = function(){};

/**
 * get the name of the current theme
 * @export
 * @static
 *
 * @return {String|null} the name of the theme
 */
oj.ThemeUtils.getThemeName = function()
{

  // get the map of theme info
  var themeMap = oj.ThemeUtils.parseJSONFromFontFamily("oj-theme-json") || {};

  return themeMap['name'];
}


/**
 * get the target platform of the current theme
 * @export
 * @static
 *
 * @return {String|null} the target platform can be any string the theme
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
 *
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
 *
 * @param {string} selector a class selector name, for example 'demo-map-json';
 * @return {*} the result of parsing the font family with JSON.parse.
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
          oj.Logger.error("Error parsing json for selector " + selector +
                          ".\nString being parsed is " + fontstring + ". Error is:\n", e);

          // remove the meta tag
          document.head.removeChild(elem); // @HTMLUpdateOK
          throw e;

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
 * @class Utilities for responsive pages.
 * @since 1.1.0
 * @export
 */
oj.ResponsiveUtils = function() {};


/**
 * <p>In the jet sass files there are variables for
 * responsive screen sizes, these look something like</p>
 *  <ul>
 *    <li>$screenSmallRange:  0, 767px;</li>
 *    <li>$screenMediumRange: 768px, 1023px;</li>
 *    <li>$screenLargeRange:  1024px, 1280px;</li>
 *    <li>$screenXlargeRange: 1281px, null;</li>
 *  </ul>
 *
 * <p>These constants are used to identify these ranges.</p>
 * @enum {string}
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
 * responsive queries like $responsiveQuerySmallUp,
 * $responsiveQuerySmallOnly, $responsiveQueryMediumUp, etc.</p>
 *
 * <p>These constants are used to identify these queries.</p>
 * @enum {string}
 * @constant
 * @export
 */
oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY = {
   /**
   * matches small and up screens
   * @expose
   * @constant
   */
   SM_UP: "sm-up",
   /**
   * matches medium and up screens
   * @expose
   * @constant
   */
   MD_UP: "md-up",
   /**
   * matches large and up screens
   * @expose
   * @constant
   */
   LG_UP: "lg-up",
   /**
   * matches extra large and up screens
   * @expose
   * @constant
   */
   XL_UP: "xl-up",
   /**
   * matches xxl and up screens
   * @expose
   * @constant
   */
   XXL_UP: "xxl-up",

   /**
   * matches small screens only
   * @expose
   * @constant
   */
   SM_ONLY: "sm-only",
   /**
   * matches medium screens only
   * @expose
   * @constant
   */
   MD_ONLY: "md-only",
   /**
   * matches large screens only
   * @expose
   * @constant
   */
   LG_ONLY: "lg-only",
   /**
   * matches extra large screens only
   * @expose
   * @constant
   */
   XL_ONLY: "xl-only",

   /**
   * matches medium and down screens
   * @expose
   * @constant
   */
   MD_DOWN: "md-down",
   /**
   * matches large and down screens
   * @expose
   * @constant
   */
   LG_DOWN: "lg-down",
   /**
   * matches extra large and down screens
   * @expose
   * @constant
   */
   XL_DOWN: "xl-down",
   /**
   * matches high resolution screems
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
 * Get a framweork (built in) media query
 *
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
 */
oj.CollectionUtils.isPlainObject = function(obj)
{
  if (typeof obj === 'object')
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
 * @class Services for Retrieving Translated Resources
 * @export
 */
oj.Translations = {};

/**
 * Sets the translation bundle used by JET
 * If an AMD loader (such as Require.js) is not present, this method should be called by the application to provide
 * translated strings for JET.
 * This method may also be used by an application that wants to completely replace the resource bundle that is automatically
 * fetched by an AMD loader.
 * @param {Object} bundle resource bundle that should be used by the framework
 * @export
 */
oj.Translations.setBundle = function(bundle)
{
  oj.Translations._bundle = bundle;
};

/**
 * Retrives a translated resource for a given key
 * @param {string} key resource key
 * @return {Object|string|null} resource associated with the key or null if none was found
 * @export
 */
oj.Translations.getResource = function(key)
{
  return oj.Translations._getResourceString(key);
};

/**
 * Applies parameters to a format pattern
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
 * @return formatted message or null if the pattern argument was null
 * @export
 */
oj.Translations.applyParameters = function(pattern, parameters)
{
  return (pattern == null) ? null : oj.Translations._format(pattern, parameters);
};

/**
 * Retrieves a translated string after inserting optional parameters
 * @param {string} key  translations resource key
 * The key is used to retrieve a format pattern from the resource bundle.
 * Tokens like {0}, {1}, {name} within the pattern will be used to define placement
 * for the optional parameters.  Token strings should not contain comma (,)
 * or space characters, since they are reserved for future format type enhancements.
 * The reserved characters within a pattern are:
 * $ { } [ ]
 * These characters will not appear in the formatted output unless they are escaped
 * with a dollar character ('$').
 *
 * @param {...string|Object|Array} var_args  - optional parameters to be inserted into the
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
 * @param {string} componentName name of the component
 * @return a map of translated resources
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
  this._id = this._addedWaitTs.toString(36) + "_" + Math.random().toString(36);
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
          if ($.isFunction(this._description))
            return this._description();
          else if (this._description)
            return this._description.toString();
          else
            return undefined;
        },
        "enumerable" : true
      }
  });

/**
 * @public
 * @override
 * @returns {string} returns the value of the object as a string
 */
oj.BusyState.prototype.toString = function ()
{
  var buff = "oj.BusyState";

  //using the collection syntax here to access id, description properties to make the
  //closure compiler happy.

  buff += " [id=" + this["id"];

  if (this["description"])
    buff += ", description=" + this["description"];

  var elapsed = oj.BusyState._getTs() - this._addedWaitTs;
  buff += ", elapsed=" + elapsed + "]";

  return buff;
};

/**
 * @public
 * @param {Object} target object to compare
 * @returns {boolean} <code>true</code> if the "id" and "description" properties
 *           are equal
 */
oj.BusyState.prototype.equals = function (target)
{
  // using this syntax to make the closure compiler happy.
  return this["id"] === target["id"] && this["description"] === target["description"];
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
 * This context tracks busy states of components.  Busy states, include but are
 * not limited to, animation and data fetch.  Initially this context will be
 * scoped for the page but in the future the scopes could be at the module
 * or composite component level.
 *
 * @export
 * @constructor
 * @since 2.1.0
 * @class Framework service for querying the busy state of components on the page.
 */
oj.BusyContext = function ()
{
  this.Init();
};

oj.Object.createSubclass(oj.BusyContext, oj.Object, "oj.BusyContext");

/**
 * @instance
 * @protected
 */
oj.BusyContext.prototype.Init = function ()
{
  oj.BusyContext.superclass.Init.call(this);

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
      this._clearAllSlaveTimeouts();
      if (this._masterWhenReadyPromiseResolver)
        this._masterWhenReadyPromiseResolver(true);
      this._masterWhenReadyPromise = null;
      this._masterWhenReadyPromiseResolver = null;
    },
    /**
     * Returns a promise that will resolve when the master promise resolves or reject when
     * the slave timeout promise rejects.
     *
     * @param {?} statesMap
     * @param {number} timeout
     * @returns {Promise}
     * @ignore
     * @private
     */
    getSlaveTimeoutPromise : function (statesMap, timeout)
    {
      var timer;
      var slaveTimeoutPromise = new Promise(function (resolve, reject)
      {
        timer = window.setTimeout(function ()
        {
          // There could be a bit of a race condition here with the logging and the use of
          // Promise.race.  The timer could expire and log a rejection even though the master
          // promised resolved slightly sooner.

          oj.BusyContext._log(statesMap);
          oj.Logger.info("BusyContext.whenReady: rejected");
          var busyStates = oj.BusyContext._values(statesMap);
          var error = new Error("whenReady timeout of " + timeout +
            "ms expired with the following busy states: " + busyStates.join(", "));
          error["busyStates"] = busyStates;
          reject(error);
        }, timeout);
      });
      this._slaveTimeoutPromiseTimers.push(timer);

      //closure compiler doesn't recognize "Promise.race".
      return Promise["race"]([this.getMasterWhenReadyPromise(), slaveTimeoutPromise]);
    },
    /**
     * Clears all window timeout timeers that are slave when ready promises.
     *
     * @returns {void}
     * @ignore
     * @private
     */
    _clearAllSlaveTimeouts : function ()
    {
      var slaveTimeoutPromiseTimers = this._slaveTimeoutPromiseTimers;
      this._slaveTimeoutPromiseTimers = [];
      for (var i = 0; i < slaveTimeoutPromiseTimers.length; i++)
        window.clearTimeout(slaveTimeoutPromiseTimers[i]);
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
      //_masterWhenReadyPromiseResolver : undefined
  };
};


/**
 * Logs the current registered busy states ordered acceding by the order they were added.
 * The cost of compiling the list is only made if the logger level is info.
 * @param {?} statesMap busy states
 * @returns {void}
 * @private
 */
oj.BusyContext._log = function (statesMap)
{
  if (oj.Logger.option('level') !== oj.Logger.LEVEL_INFO)
    return;

  oj.Logger.info(">> Busy states: %d", statesMap.size);

  var busyStates = oj.BusyContext._values(statesMap);
  if (busyStates.length > 0)
    oj.Logger.info(busyStates.join("\n"));
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
 * Called by components or services performing a task that should be considered
 * in the overall busy state of the page. An example would be animation or fetching data.
 *
 * @since 2.1.0
 * @export
 * @param {{description: ?}} options object that describes the busy state being registered.<br/>
 *         description: Option additional information of what is registering a busy state. Added to
 *                      logging and handling rejected status. Can be supplied as a Object or a
 *                      function.  If the type is an object the toString function needs to be
 *                      implemented.
 * @returns {Function} resolve function called by the registrant when the busy state completes.
 *                     The resultant function will throw an error if the busy state is no longer
 *                     registered.
 */
oj.BusyContext.prototype.addBusyState = function (options)
{
  oj.Logger.info("BusyContext.addBusyState: start");

  var statesMap = this._statesMap;

  /** @type {oj.BusyState} */
  var busyState = new oj.BusyState(options["description"]);

  oj.Logger.info(">> " + busyState);

  statesMap.set(busyState.id, busyState);

  oj.Logger.info("BusyContext.addBusyState: end");

  return this._removeBusyState.bind(this, busyState);
};

/**
 * Returns a Promise that will resolve when all registered busy states have completed or a maximum
 * timeout period has elapsed. The promise will be rejected if all the busy states are not resolved
 * within the timeout period.
 *
 * @see oj.BusyContext#applicationBoostrapComplete
 * @since 2.1.0
 * @export
 * @param {number=} timeout "optional" maximum period in milliseconds the resultant promise
 *        will wait
 * @returns {Promise}
 */
oj.BusyContext.prototype.whenReady = function (timeout)
{
  oj.Logger.info("BusyContext.whenReady: start, timeout:%d", timeout);
  /** @type {?} */
  var statesMap = this._statesMap;

  if (statesMap.size === 0)
  {
    // no busy states, promise resolves immediately
    oj.Logger.info("BusyContext.whenReady: resolved");
    return Promise.resolve(true);
  }
  else
  {
    var mediator = this._mediator;
    var promise;
    if (isNaN(timeout))
      promise = mediator.getMasterWhenReadyPromise();
    else
      promise = mediator.getSlaveTimeoutPromise(statesMap, timeout);

    oj.Logger.info("BusyContext.whenReady: end");
    return promise;
  }
};

/**
 * @since 2.1.0
 * @export
 * @returns {boolean} <code>true</code> if the page is not busy
 */
oj.BusyContext.prototype.isReady = function ()
{
  oj.Logger.info("BusyContext.isReady: start");
  var statesMap = this._statesMap;

  var rtn = statesMap.size === 0;
  oj.BusyContext._log(statesMap);

  oj.Logger.info("BusyContext.isReady: end");
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
  // The BusyState object is passed here instead of just the generated id to provide a more
  // descriptive message when the busy state is removed twice. The description (if provided) of
  // the busy state will be captured in the error message.

  var statesMap = this._statesMap;

  if (!statesMap["delete"](busyState.id)) // quoted to make the closure compiler happy
  {
    throw new Error("Busy state has already been resolved:\n" + busyState);
  }

  // no more busy states; resolve pending promises.
  if (statesMap.size === 0)
  {
    var mediator = this._mediator;
    oj.Logger.info("BusyContext._removeBusyState: resolving whenReady promises");
    mediator.resolveMasterWhenReadyPromise();
  }

  oj.Logger.info("BusyContext._removeBusyState: end");
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
 *     // will implicitly add a busy state, until the application calls applicationBoostrapComplete
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
 *     oj.Context.getPageContext().getBusyContext().applicationBoostrapComplete();
 *     ...
 *     ...
 *   });
 * </code></pre>
 *
 * @since 2.1.0
 * @export
 * @returns {void}
 */
oj.BusyContext.prototype.applicationBoostrapComplete = function ()
{
  if (!("oj_whenReady" in window) || !window["oj_whenReady"])
  {
    oj.Logger.info("BusyContext.applicationBoostrapComplete: strategy not enabled.");
    return;
  }

  var bootstrapWhenReadyResolver = this._bootstrapWhenReadyResolver;
  this._bootstrapWhenReadyResolver = null;
  if (bootstrapWhenReadyResolver)
    bootstrapWhenReadyResolver();
  else
    oj.Logger.warning("BusyContext.applicationBoostrapComplete already invoked.");
};

/**
 * @ignore
 * @returns {void}
 */
oj.BusyContext.prototype.__bootstrapAddBusyState = function ()
{
  // called from a static block in Context.js.  Function is not exported and ignored from JSDoc.
  if (!("oj_whenReady" in window) || !window["oj_whenReady"])
    return;

  var options = {"description" : 'Application loading.' +
      ' Busy state enabled by setting the "window.oj_whenReady = true;" global variable.' +
      ' Application bootstrap busy state is released by calling' +
      ' "oj.Context.getPageContext().getBusyContext().applicationBoostrapComplete();".'};
  this._bootstrapWhenReadyResolver = this.addBusyState(options);
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
 * This is a general purpose context.  Initially it only exposes the BusyContext
 * that keeps track of components that are currently animating or fetching data.
 * In the future this context might be expanded for other purposes.  Instances
 * of contexts might be further scoped to modules and composite components.
 * Initially the single BusyContext will be scoped for the page.
 *
 * @export
 * @constructor
 * @since 2.1.0
 * @class Context scoped for the page.  Exposes additional contexts.
 */
oj.Context = function ()
{
  this.Init();
};

oj.Object.createSubclass(oj.Context, oj.Object, "oj.Context");

/**
 * @instance
 * @protected
 */
oj.Context.prototype.Init = function ()
{
  oj.Context.superclass.Init.call(this);
};

/**
 * Returns a context that is scoped as per the node.
 * @param {Element} node DOM element used to provide the correct context
 * @returns {oj.Context} context object scoped per the target node
 */
oj.Context.getContext = function(node)
{
  // this method is not exported as customer facing API yet.
  // initial impl will default to the page context.
  return oj.Context.getPageContext();
};

/**
 * Static factory method that returns the page context.
 * @export
 * @since 2.1.0
 * @return {oj.Context} context scoped for the page
 */
oj.Context.getPageContext = function ()
{
  if (!oj.Context._pageContext)
    oj.Context._pageContext = new oj.Context();

  return oj.Context._pageContext;
};

/**
 * @since 2.1.0
 * @export
 * @returns {oj.BusyContext} busy state context
 */
oj.Context.prototype.getBusyContext = function ()
{
  if (!this._busyContext)
    this._busyContext = new oj.BusyContext();

  return this._busyContext;
};

// If the app has opt'd in on the strategy, add a busy state for the purpose of blocking
// until the app bootstrap has completed.
//
// ignore if running in a JS context that doesn't have the global window object defined
if (typeof window !== 'undefined')
  oj.Context.getPageContext().getBusyContext().__bootstrapAddBusyState();
/*
** Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
**
**
*/

// CustomEvent()
(function () {
  if (typeof window === 'undefined' || (typeof window['CustomEvent'] === "function")) {
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
/*
** Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
**
*/

(function()
{

  /**
   * @ignore
   */
  oj.__AttributeUtils = {};

  /**
   * @ignore
   * @return {{expr: (null|string), downstreamOnly: boolean}}
   */
  oj.__AttributeUtils.getExpressionInfo = function(attrValue)
  {
    var info = {};
    if (attrValue)
    {
      var exp = _ATTR_EXP.exec(attrValue);
      exp = exp ? exp[1] : null;
      if (!exp)
      {
       info.downstreamOnly = true;
       exp = _ATTR_EXP_RO.exec(attrValue);
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
   * @param {string} propName property name
   * @param {string} val attribute value
   * @param {string} type property type
   * @return {*} coerced value
   */
  oj.__AttributeUtils.coerceValue = function(propName, val, type)
  {
    // We only support primitive types and JSON objects for coerced properties
    var typeLwr = type.toLowerCase();
    var coercedType;
    switch (typeLwr) {
      case "boolean":
        // Boolean attributes are considered true if the attribute is:
        // 1) Set to the empty string
        // 2) Present in the DOM without a value assignment
        // 3) Set to the 'true' string
        // 4) Set to the case-insensitive attribute name
        // Boolean values are considered false if set to the false string.
        // An error is thrown for all other values and the attribute value will not be set.
        if (val == null || val === "true" || val === "" || val.toLowerCase() === oj.__AttributeUtils.propertyNameToAttribute(propName))
        {
          coercedType = true;
        }
        else if (val === "false")
        {
          coercedType = false;
        }
        break;
      case "number":
        if (!isNaN(val))
        {
          coercedType = Number(val);
        }
        break;
      case "string":
        coercedType = val;
        break;
      default:
        try
        {
          coercedType = JSON.parse(val);
        }
        catch (ex)
        {
          // Error will be logged at the end
        }
    }

    if (coercedType == null)
    {
      oj.Logger.error("Unable to parse value %s for property %s with type %s.", val, propName, type);
    }
    return coercedType;
  }



  var _ATTR_EXP = /(?:\{\{\s*)([^\s]+)(?:\s*\}\})/;
  var _ATTR_EXP_RO = /(?:\[\[\s*)([^\s]+)(?:\s*\]\])/;

})();


;return oj;
});
