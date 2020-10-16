/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

  `This ES6 code cannot run on IE11`

  define('polyfills', []);

  define('promise', ['polyfills'], function () {
    Promise.polyfill = function () {};
    return Promise;
  });

define(['require', 'ojs/ojlogger', 'polyfills'], function(require, Logger)
{
  "use strict";



/* jslint browser: true*/

/**
 * Defines the oj namespace
 */

/**
 * @private
 */
var _scope = {};

//  - check if the window object is available
// Note that the 'typeof' check  is required
if (typeof window !== 'undefined') {
  _scope = window;
  // eslint-disable-next-line no-restricted-globals
} else if (typeof self !== 'undefined') {
  // eslint-disable-next-line no-restricted-globals
  _scope = self;
}

/**
 * @private
 */
var _oldVal = _scope.oj;

// eslint-disable-next-line no-unused-vars
var oj = {
  /**
   * @global
   * @member {string} version JET version numberr
   */
  version: '9.2.0',
  /**
   * @global
   * @member {string} revision JET source code revision number
   */
  revision: '2020-10-07_10-26-04',

  // This function is only meant to be used outside the library, so quoting the name
  // to avoid renaming is appropriate
  noConflict: function () {
    _scope.oj = _oldVal;
  },

  /**
   * Adds a property to the "oj" namespace. This is used by ES6 modules to set
   * legacy exported objects onto the import "oj" namespace, since modifying the
   * original imported object isn't allowed under ES6.
   * @param {string} name The property name, such as "PopupService"
   * @param {object} value The value to set for the property
   * @private
   */
  _registerLegacyNamespaceProp: function (name, value) {
    this[name] = value;
  }
};

_scope.oj = oj;



/* global _scope:false */
/* jslint browser: true*/

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
oj.Assert.forceDebug = function () {
  oj.Assert[_DEBUG] = true;
};

/**
 * Forces DEBUG to be set to false
 * @export
 * @memberof oj.Assert
 */
oj.Assert.clearDebug = function () {
  oj.Assert[_DEBUG] = false;
};

/**
 * Determines whether oj.Assert is running in debug mode
 * @return {boolean} true for debug mode, false otherwise
 * @export
 * @memberof oj.Assert
 */
oj.Assert.isDebug = function () {
  return oj.Assert[_DEBUG] === true;
};


/**
 * Asserts that a condition is true.  If the condition does not
 * evaluate to true, an exception is thrown with the optional message
 * and reason
 * @param {boolean} condition condition to test
 * @param {string=} message message to display
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assert = function (
  condition,
  message
  ) {
  if (oj.Assert[_DEBUG] && !condition) {
    var myMessage = message || '';

    if (arguments.length > 2) {
      myMessage += '(';
      for (var i = 2; i < arguments.length; i += 1) {
        myMessage += arguments[i];
      }
      myMessage += ')';
    }
    oj.Assert.assertionFailed(myMessage, 1);
  }
};

/**
 * Convenience function for asserting when an abstact function is called
 * @export
 * @memberof oj.Assert
 */
oj.Assert.failedInAbstractFunction = function () {
  if (oj.Assert[_DEBUG]) {
    oj.Assert.assertionFailed('Abstract function called', 1);
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
oj.Assert.assertPrototype = function (
  target,
  theConstructor,
  reason
  ) {
  if (oj.Assert[_DEBUG]) {
    var thePrototype = theConstructor.prototype;

    if (target != null) {
      oj.Assert.assertType(theConstructor, 'function', null, 1, false);

      var isPrototypeOf = Object.prototype.isPrototypeOf;
      if (!isPrototypeOf.call(thePrototype, target)) {
        oj.Assert.assertionFailed("object '" + target + "' doesn't match prototype "
                                  + thePrototype,
                                  1,
                                  reason);
      }
    } else {
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
oj.Assert.assertPrototypeOrNull = function (
  target,
  theConstructor,
  reason
  ) {
  if (oj.Assert[_DEBUG] && (target != null)) {
    oj.Assert.assertType(theConstructor, 'function', null, 1, false);
    var thePrototype = theConstructor.prototype;

    var isPrototypeOf = Object.prototype.isPrototypeOf;
    if (!isPrototypeOf.call(thePrototype, target)) {
      oj.Assert.assertionFailed("object '" + target + "' doesn't match prototype "
                                + thePrototype,
                                1,
                                reason);
    }
  }
};

/**
 * Asserts that the the target object has the same prototype as the example
 * types
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertPrototypes = function (
  target,
  instanceOne,
  instanceTwo,
  reason
  ) {
  if (oj.Assert[_DEBUG]) {
    var thePrototype = instanceOne.prototype;
    var thePrototypeTwo = instanceTwo.prototype;

    var isPrototypeOf = Object.prototype.isPrototypeOf;
    if (!(isPrototypeOf.call(thePrototype, target) ||
          isPrototypeOf.call(thePrototypeTwo, target))) {
      oj.Assert.assertionFailed("object '" + target + "' doesn't match prototype "
                                + thePrototype + ' or ' + thePrototypeTwo,
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
oj.Assert.assertDomNodeOrNull = function (target, depth) {
  if (oj.Assert[_DEBUG] && target) {
    if (target.nodeType === undefined) {
      oj.Assert.assertionFailed(target + ' is not a DOM Node', depth + 1);
    }
  }
};

/**
 * Asserts that the target is a DOM Node
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertDomNode = function (target, depth) {
  if (oj.Assert[_DEBUG]) {
    if (!target || (target.nodeType === undefined)) {
      oj.Assert.assertionFailed(target + ' is not a DOM Node', depth + 1);
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
oj.Assert.assertDomElement = function (target, nodeName) {
  if (oj.Assert[_DEBUG]) {
    oj.Assert.assertDomNode(target, 1);

    if (target.nodeType !== 1) {
      oj.Assert.assertionFailed(target + ' is not a DOM Element', 1);
    } else if (nodeName && (target.nodeName !== nodeName)) {
      oj.Assert.assertionFailed(target + ' is not a ' + nodeName + ' Element', 1);
    }
  }
};

/**
 * Asserts that the target is a DOM Element and optionally has the specified
 * element name
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertDomElementOrNull = function (target, nodeName) {
  if (oj.Assert[_DEBUG] && (target != null)) {
    oj.Assert.assertDomNode(target, 1);

    if (target.nodeType !== 1) {
      oj.Assert.assertionFailed(target + ' is not a DOM Element', 1);
    } else if (nodeName && (target.nodeName !== nodeName)) {
      oj.Assert.assertionFailed(target + ' is not a ' + nodeName + ' Element', 1);
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
oj.Assert.assertType = function (target, type, prefix, depth, nullOK) {
  if (oj.Assert[_DEBUG]) {
    // either the target is null and null is OK, or the target better
    // be of the correct type
    var targetType = typeof target;
    if (!(((target == null) && nullOK) || (targetType === type))) {
      var message = target + ' is not of type ' + type;

      if (prefix) {
        message = prefix + message;
      }

      if (!depth) {
        // eslint-disable-next-line no-param-reassign
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
oj.Assert.assertObject = function (target, prefix) {
  if (oj.Assert[_DEBUG]) {
    oj.Assert.assertType(target, 'object', prefix, 1, false);
  }
};

/**
 * Asserts that the target is an Object or null
 * @param {Object} target description
 * @param {string=} prefix
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertObjectOrNull = function (target, prefix) {
  if (oj.Assert[_DEBUG]) {
    oj.Assert.assertType(target, 'object', prefix, 1, true);
  }
};

/**
 * Asserts that the target is a non-empty String
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertNonEmptyString = function (target, prefix) {
  if (oj.Assert[_DEBUG]) {
    oj.Assert.assertType(target, 'string', prefix, 1, false);
    oj.Assert.assert(target.length > 0, 'empty string');
  }
};

/**
 * Asserts that the target is a String
 * @param target target object
 * @param {string=} prefix prefix string
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertString = function (target, prefix) {
  if (oj.Assert[_DEBUG]) {
    oj.Assert.assertType(target, 'string', prefix, 1, false);
  }
};

/**
 * Asserts that the target is a String or null
 * @param {string|null|undefined|Object} target target object
 * @param {string=} prefix prefix string
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertStringOrNull = function (target, prefix) {
  if (oj.Assert[_DEBUG]) {
    oj.Assert.assertType(target, 'string', prefix, 1, true);
  }
};

/**
 * Asserts that the target is a Function
 * @param {Object} target target object
 * @param {string=} prefix prefix string
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertFunction = function (target, prefix) {
  if (oj.Assert[_DEBUG]) {
    oj.Assert.assertType(target, 'function', prefix, 1, false);
  }
};

/**
 * Asserts that the target is a Function or null
 * @param {Object} target target object
 * @param {string=} prefix prefix
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertFunctionOrNull = function (target, prefix) {
  if (oj.Assert[_DEBUG]) {
    oj.Assert.assertType(target, 'function', prefix, 1, true);
  }
};

/**
 * Asserts that the target is a boolean
 * @param {Object} target description
 * @param {string=} prefix
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertBoolean = function (target, prefix) {
  if (oj.Assert[_DEBUG]) {
    oj.Assert.assertType(target, 'boolean', prefix, 1, false);
  }
};

/**
 * Asserts that the target is a number
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertNumber = function (target, prefix) {
  if (oj.Assert[_DEBUG]) {
    oj.Assert.assertType(target, 'number', prefix, 1, false);
  }
};

/**
 * Asserts that the target is a number or Null
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertNumberOrNull = function (target, prefix) {
  if (oj.Assert[_DEBUG]) {
    oj.Assert.assertType(target, 'number', prefix, 1, true);
  }
};


/**
 * Asserts that the target object is an Array
 * @param {Object} target target object
 * @param {string=} message optional message
 * @export
 * @memberof oj.Assert
 */
oj.Assert.assertArray = function (
  target,
  message
  ) {
  if (oj.Assert[_DEBUG]) {
    if (!Array.isArray(target)) {
      if (message === undefined) {
        // eslint-disable-next-line no-param-reassign
        message = target + ' is not an array';
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
oj.Assert.assertArrayOrNull = function (
  target,
  message) {
  if (oj.Assert[_DEBUG] && (target != null)) {
    if (!Array.isArray(target)) {
      if (message === undefined) {
        // eslint-disable-next-line no-param-reassign
        message = target + ' is not an array';
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
oj.Assert.assertNonNumeric = function (
  target,
  message
  ) {
  if (oj.Assert[_DEBUG]) {
    if (!isNaN(target)) {
      if (message === undefined) {
        // eslint-disable-next-line no-param-reassign
        message = target + ' is convertible to a number';
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
oj.Assert.assertNumeric = function (
  target,
  message
  ) {
  if (oj.Assert[_DEBUG]) {
    if (isNaN(target)) {
      if (message === undefined) {
        // eslint-disable-next-line no-param-reassign
        message = target + ' is not convertible to a number';
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
oj.Assert.assertInSet = function (
  value,
  set,
  message) {
  if ((value == null) || (set[value.toString()] === undefined)) {
    if (message === undefined) {
      var keyString = ' is not in set: {';

      var keys = Object.keys(set);
      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];
        keyString += key;
        keyString += ',';
      }

      keyString += '}';

      // eslint-disable-next-line no-param-reassign
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
oj.Assert.assertionFailed = function (
  message,
  skipLevel,
  reason) {
  if (!skipLevel) {
    // eslint-disable-next-line no-param-reassign
    skipLevel = 0;
  }

  var errorMessage = 'Assertion';

  if (reason) {
    errorMessage += ' (' + reason + ')';
  }

  errorMessage += ' failed: ';

  if (message !== undefined) {
    errorMessage += message;
  }

  var error = new Error(errorMessage);


  throw error;
};

/**
 * @private
 * @memberof oj.Assert
 */
var _assertSetting = _scope.__oj_Assert_DEBUG;

if (_assertSetting !== undefined) {
  oj.Assert[_DEBUG] = _assertSetting;
}



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
oj.CollectionUtils.copyInto = function (
  target,
  source,
  keyConverter,
  recurse,
  maxRecursionDepth) {
  return oj.CollectionUtils._copyIntoImpl(target,
                                          source,
                                          keyConverter,
                                          recurse,
                                          maxRecursionDepth,
                                          0);
};


/**
 * A simpler alternative to copyInto()
 * @param {Object} target - target collection
 * @param Array{Object} - one or more sources to merge into the target
 * @ignore
 */
oj.CollectionUtils.mergeDeep = function (target, ...sources) {
  if (!sources.length) return target;
  const isPlain = oj.CollectionUtils.isPlainObject;
  const merge = oj.CollectionUtils.mergeDeep;
  const source = sources.shift();
  if (isPlain(target) && isPlain(source)) {
    Object.keys(source).forEach(key => {
      if (isPlain(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        merge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }
  return merge(target, ...sources);
};


/**
 * Checks whether the object is a direct instance of Object
 * @param {Object} obj - object to test
 *
 * @return {boolean} true if the object is a direct instance of Object, false otherwise
 * @export
 * @memberof! oj.CollectionUtils
 */
oj.CollectionUtils.isPlainObject = function (obj) {
  if (obj !== null && typeof obj === 'object') {
    try {
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      if (obj.constructor &&
          hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
        return true;
      }
    } catch (e) {
      // Ignore errors
    }
  }

  return false;
};


/**
 * @private
 * @memberof! oj.CollectionUtils
 */
oj.CollectionUtils._copyIntoImpl = function (
  target,
  source,
  keyConverter,
  recurse,
  maxRecursionDepth,
  currentLevel) {
  var targetKey;

  if (maxRecursionDepth === undefined || maxRecursionDepth === null) {
    // eslint-disable-next-line no-param-reassign
    maxRecursionDepth = Number.MAX_VALUE;
  }

  if (target && source && (target !== source)) {
    var keys = Object.keys(source);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      // allow the key mapping to be overridden
      if (keyConverter) {
        targetKey = keyConverter(k);
      } else {
        targetKey = k;
      }

      var sourceVal = source[k];

      var recursed = false;

      if (recurse && currentLevel < maxRecursionDepth) {
        var targetVal = target[targetKey];
        if (oj.CollectionUtils.isPlainObject(sourceVal) &&
           (targetVal == null || oj.CollectionUtils.isPlainObject(targetVal))) {
          recursed = true;
          // eslint-disable-next-line no-param-reassign
          target[targetKey] = targetVal || {};
          oj.CollectionUtils._copyIntoImpl(target[targetKey],
                                           sourceVal,
                                           keyConverter,
                                           true,
                                           maxRecursionDepth,
                                           currentLevel + 1);
        }
      }
      if (!recursed) {
        // eslint-disable-next-line no-param-reassign
        target[targetKey] = sourceVal;
      }
    }
  }

  return target;
};



/* jslint browser: true*/
/* global define: false, Promise:false*/

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
 * @final
 * @ojtsignore
 * @since 1.0
 * @export
 */
oj.Object = function () {
  this.Init();
};

oj.Object.superclass = null;

/**
 * @private
 */
oj.Object._typeName = 'oj.Object';

// regular expressicloneon for stripping out the name of a function
/**
 * @private
 */
oj.Object._GET_FUNCTION_NAME_REGEXP = /function\s+([\w$][\w$\d]*)\s*\(/;
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
oj.Object.createSubclass = function (
  extendingClass,
  baseClass,
  typeName) { // optional name to name this class
  oj.Assert.assertFunction(extendingClass);
  oj.Assert.assertFunctionOrNull(baseClass);
  oj.Assert.assertStringOrNull(typeName);

  if (baseClass === undefined) {
    // assume oj.Object
    // eslint-disable-next-line no-param-reassign
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
  // eslint-disable-next-line no-param-reassign
  extendingClass.prototype = new TempConstructor();

  // eslint-disable-next-line no-param-reassign
  extendingClass.prototype.constructor = extendingClass;
  // eslint-disable-next-line no-param-reassign
  extendingClass.superclass = baseClass.prototype;

  if (typeName) {
    // eslint-disable-next-line no-param-reassign
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
oj.Object.copyPropertiesForClass = function (targetClass, source) {
  oj.Assert.assertFunction(targetClass);
  oj.Assert.assert(source != null, 'source object cannot be null');

  var props = Object.keys(source);
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    // eslint-disable-next-line no-param-reassign
    targetClass.prototype[prop] = source[prop];
  }
};

/**
 * @private
 */
oj.Object._tempSubclassConstructor = function () {};


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
oj.Object.prototype.getClass = function (
  otherInstance) {
  if (otherInstance === undefined) {
    // eslint-disable-next-line no-param-reassign
    otherInstance = this;
  } else if (otherInstance === null) {
    return null;
  }
  return otherInstance.constructor;
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
oj.Object.prototype.clone = function () {
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
oj.Object.prototype.toString = function () {
  return this.toDebugString();
};

/**
 * @export
 * @method toDebugString
 * @memberof oj.Object
 * @instance
 * @return {string}
 */
oj.Object.prototype.toDebugString = function () {
  return this.getTypeName() + ' Object';
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
oj.Object.getTypeName = function (clazz) {
  oj.Assert.assertFunction(clazz);

  var typeName = clazz._typeName;

  if (typeName == null) {
    var constructorText = clazz.toString();
    var matches = oj.Object._GET_FUNCTION_NAME_REGEXP.exec(constructorText);

    if (matches) {
      typeName = matches[1];
    } else {
      typeName = 'anonymous';
    }

    // cache the result on the function
    // eslint-disable-next-line no-param-reassign
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
oj.Object.prototype.getTypeName = function () {
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
oj.Object.prototype.Init = function () {
  if (oj.Assert.isDebug()) {
    oj.Assert.assert(this.getTypeName, 'Not an oj.Object');
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
oj.Object.ensureClassInitialization = function (clazz) {
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
oj.Object.prototype.equals = function (
  object) {
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
oj.Object.createCallback = function (obj, func) {
  oj.Assert.assertFunction(func);

  // All browsers supported by JET support bind() method
  return func.bind(obj);
};


/**
 * @private
 */
oj.Object._initClasses = function (currClass) {
  if (oj.Assert.isDebug()) {
    oj.Assert.assertFunction(currClass);
    oj.Assert.assert(!currClass._initialized);
  }

  // eslint-disable-next-line no-param-reassign
  currClass._initialized = true;

  var superclass = currClass.superclass;

  // initialize the superclass if necessary
  if (superclass) {
    var superclassConstructor = superclass.constructor;

    if (superclassConstructor && !superclassConstructor._initialized) {
      oj.Object._initClasses(superclassConstructor);
    }
  }


  // if the class has an initialization function, call it
  var InitClassFunc = currClass.InitClass;

  if (InitClassFunc) {
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
oj.Object.compareValues = function (obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }

  var obj1Type = typeof obj1;
  var obj2Type = typeof obj2;

  if (obj1Type !== obj2Type) {
    // of different type so consider them unequal
    return false;
  }

  // At this point means the types are equal

  // note that if the operand is an array or a null then typeof is an object
  // check if either is null and if so return false [i.e. case where one might be a null and another an object]
  // and one wishes to avoid the null pointer in the following checks. Note that null === null has been already tested
  if (obj1 === null || obj2 === null) {
    return false;
  }

  // now check for constructor since I think by here one has ruled out primitive values and if the constructors
  // aren't equal then return false
  if (obj1.constructor === obj2.constructor) {
    // these are special cases and will need to be modded on a need to have basis
    if (Array.isArray(obj1)) {
      return oj.Object._compareArrayValues(obj1, obj2);
    } else if (obj1.constructor === Object) {
      // for now invoke innerEquals and in the future if there are issues then resolve them
      return oj.Object.__innerEquals(obj1, obj2);
    } else if (obj1.valueOf && typeof obj1.valueOf === 'function') {
      // test cases for Boolean, String, Number, Date
      // Note if some future JavaScript constructors
      // do not impl it then it's their fault
      return obj1.valueOf() === obj2.valueOf();
    }
  }

  return false;
};

oj.Object._compareArrayValues = function (array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }

  for (var i = 0, j = array1.length; i < j; i++) {
    // recurse on each of the values, order does matter for our case since do not wish to search
    // for the value [expensive]
    if (!oj.Object.compareValues(array1[i], array2[i])) {
      return false;
    }
  }
  return true;
};

// Comparion of two Objects containing id and or index properties.
// Note: it returns false if one is an id and other is an index
// if ids are the same, index will be ignored if there is only one is provided
oj.Object._compareIdIndexObject = function (obj1, obj2) {
  if ((typeof obj1 === 'number' && typeof obj2 === 'number') ||
      (typeof obj1 === 'string' && typeof obj2 === 'string')) {
    return obj1 === obj2;
  }

  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    if (obj1.id && obj2.id) {
      if (obj1.id !== obj2.id) {
        return false;
      }

      if (obj1.index && obj2.index) {
        return obj1.index === obj2.index;
      }

      return true;
    } else if (obj1.index && obj2.index) {
      return obj1.index === obj2.index;
    }
  }

  return false;
};


// Comparion of two arrays containing ids, indexes, or objects where each object has id,
// index or both properties.
// order needn't be same but no duplicates
oj.Object._compareArrayIdIndexObject = function (array1, array2) {
  // null and [] are equals
  if (!array1) {
    return (!array2 || array2.length === 0);
  }

  if (!array2) {
    return (!array1 || array1.length === 0);
  }

  if (array1.length !== array2.length) {
    return false;
  }

  for (var i = 0; i < array1.length; i++) {
    var found = false;
    for (var j = 0; j < array2.length; j++) {
      if (oj.Object._compareIdIndexObject(array1[i], array2[j])) {
        found = true;
        break;
      }
    }
    if (!found) {
      return false;
    }
  }

  return true;
};


oj.Object.__innerEquals = function (obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }

  if (!(obj1 instanceof Object) || !(obj2 instanceof Object)) {
    return false;
  }

  if (obj1.constructor !== obj2.constructor) {
    return false;
  }

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var props1 = Object.keys(obj1);
  var prop;
  var i;

  for (i = 0; i < props1.length; i++) {
    prop = props1[i];

    if (hasOwnProperty.call(obj1, prop)) {
      if (!hasOwnProperty.call(obj2, prop)) {
        return false;
      }

      if (obj1[prop] !== obj2[prop]) {
        if (typeof (obj1[prop]) !== 'object') {
          return false;
        }

        if (!oj.Object.__innerEquals(obj1[prop], obj2[prop])) {
          return false;
        }
      }
    }
  }

  var props2 = Object.keys(obj2);
  for (i = 0; i < props2.length; i++) {
    prop = props2[i];

    if (hasOwnProperty.call(obj2, prop) && !hasOwnProperty.call(obj1, prop)) {
      return false;
    }
  }

  if (props1.length === 0 && props2.length === 0) {
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
oj.Object.isEmpty = function (object) {
  var prop;
  // Test if an object is empty
  if (object === undefined || object === null) {
    return true;
  }

  for (prop in object) { // eslint-disable-line no-restricted-syntax
    if (object.hasOwnProperty(prop)) { // eslint-disable-line no-prototype-builtins
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
oj.__isAmdLoaderPresent = function () {
  return (typeof define === 'function' && define.amd);
};

/**
 * Loads a file using require if AMD loader is present, otherwise returns null
 * If loading multiple files then use multiple calls to this and Promise.all
 * @private
 * @param {string} module sting of the module to load
 * @param {function} requireFunc what to use as the require function, if not specified require will be used
 * @returns {Promise|null} returns null if no AMD loader
 */
oj.__getRequirePromise = function (module, requireFunc) {
  if (oj.__isAmdLoaderPresent()) {
    return new Promise(
      function (resolve, reject) {
        requireFunc([module], resolve, reject);
      }
    );
  }
  return null;
};




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
oj.StringUtils.isEmpty = function (value) {
  if (value === null) {
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
oj.StringUtils.isEmptyOrUndefined = function (value) {
  if (value === undefined || oj.StringUtils.isEmpty(value)) {
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
oj.StringUtils.isString = function (obj) {
  return obj !== null && ((typeof obj === 'string') || obj instanceof String);
};

/**
 * Remove leading and trailing whitespace
 * @param {Object|string|null} data to trim
 * @return {Object|string|null}
 * @export
 * @memberof oj.StringUtils
 */
oj.StringUtils.trim = function (data) {
  if (oj.StringUtils.isString(data)) {
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
oj.StringUtils.hashCode = function (str) {
  var hash = 0;
  if (str.length === 0) {
    return hash;
  }

  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = ((hash << 5) - hash) + c;
    // eslint-disable-next-line no-bitwise
    hash &= hash;
  }
  return hash;
};


// Polyfills for IE11
(function () {
  // String.startsWith requires for IE11
  if (!String.prototype.startsWith) {
    // eslint-disable-next-line no-extend-native
    String.prototype.startsWith = function (searchString, position) {
      // eslint-disable-next-line no-param-reassign
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
    };
  }

  // String.endsWith requires for IE11
  if (!String.prototype.endsWith) {
    // eslint-disable-next-line no-extend-native
    String.prototype.endsWith = function (searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) ||
          Math.floor(position) !== position || position > subjectString.length) {
        // eslint-disable-next-line no-param-reassign
        position = subjectString.length;
      }
      // eslint-disable-next-line no-param-reassign
      position -= searchString.length;
      var lastIndex = subjectString.lastIndexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };
  }
}());


  /**
   * This list should be kept in sync with typings/jsx-interfaces.d.ts
   *
   * This list provides a map of global property to attribute names
   * where the attribute name is used for both key and value if no property
   * exists. We start with the list of global attributes found here:
   * https://html.spec.whatwg.org/multipage/dom.html#global-attributes
   * and check those against the Element and HTMLElement specs to determine
   * the property name if different:
   * https://dom.spec.whatwg.org/#interface-element
   * https://html.spec.whatwg.org/multipage/dom.html#htmlelement
   * This list is not exhaustive of all Element and HTMLElement properties.
   * @ignore
   */
  // eslint-disable-next-line no-unused-vars
  var _GLOBAL_PROPS = {
    accessKey: 'accesskey',
    autocapitalize: 'autocapitalize',
    autofocus: 'autofocus',
    class: 'class', // We support class instead of className for JSX
    contentEditable: 'contenteditable',
    dir: 'dir',
    draggable: 'draggable',
    enterKeyHint: 'enterkeyhint',
    hidden: 'hidden',
    id: 'id',
    inputMode: 'inputmode',
    is: 'is',
    itemid: 'itemid',
    itemprop: 'itemprop',
    itemref: 'itemref',
    itemscope: 'itemscope',
    itemtype: 'itemtype',
    lang: 'lang',
    nonce: 'nonce',
    role: 'role',
    slot: 'slot',
    spellcheck: 'spellcheck',
    style: 'style',
    tabIndex: 'tabindex',
    title: 'title',
    translate: 'translate'
  };

  /**
   * This map includes property to attribute names for
   * all native HTML elements where the two differ.
   * This list should only be manually populated for attributes belonging to
   * *subclasses* of HTMLElement.
   * @ignore
   */
  // eslint-disable-next-line no-unused-vars
  var _NATIVE_PROPS = {
    acceptCharset: 'accept-charset',
    allowFullscreen: 'allowfullscreen',
    allowPaymentRequest: 'allowpaymentrequest',
    colSpan: 'colspan',
    crossOrigin: 'crossorigin',
    dateTime: 'datetime',
    dirName: 'dirname',
    encoding: 'enctype',
    formAction: 'formaction',
    formEnctype: 'formenctype',
    formMethod: 'formmethod',
    formNoValidate: 'formnovalidate',
    formTarget: 'formtarget',
    for: 'for', // We support for instead of htmlFor for JSX
    httpEquiv: 'http-equiv',
    imageSizes: 'imagesizes',
    imageSrcset: 'imagesrcset',
    inputMode: 'inputmode',
    isMap: 'ismap',
    maxLength: 'maxlength',
    minLength: 'minlength',
    noModule: 'nomodule',
    noValidate: 'novalidate',
    readOnly: 'readonly',
    referrerPolicy: 'referrerpolicy',
    rowSpan: 'rowspan',
    useMap: 'usemap',
  };



/* jslint browser: true*/


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
oj.AgentUtils.BROWSER = {
  IE: 'ie',
  FIREFOX: 'firefox',
  SAFARI: 'safari',
  CHROME: 'chrome',
  EDGE: 'edge',
  EDGE_CHROMIUM: 'edge-chromium',
  UNKNOWN: 'unknown'
};
/**
 * Browser layout engine identity.
 * @enum {string}
 * @public
 * @memberof oj.AgentUtils
 */
oj.AgentUtils.ENGINE = {
  TRIDENT: 'trident',
  WEBKIT: 'webkit',
  GECKO: 'gecko',
  BLINK: 'blink',
  EDGE_HTML: 'edgehtml',
  UNKNOWN: 'unknown'
};
/**
 * Operating system identity.
 * @enum {string}
 * @public
 * @memberof oj.AgentUtils
 */
oj.AgentUtils.OS = {
  WINDOWS: 'Windows',
  SOLARIS: 'Solaris',
  MAC: 'Mac',
  UNKNOWN: 'Unknown',
  ANDROID: 'Android',
  IOS: 'IOS',
  WINDOWSPHONE: 'WindowsPhone',
  LINUX: 'Linux'
};
/**
 * Device type identity.
 * @enum {string}
 * @public
 * @memberof oj.AgentUtils
 */
oj.AgentUtils.DEVICETYPE = {
  PHONE: 'phone',
  TABLET: 'tablet',
  OTHERS: 'others'
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
oj.AgentUtils.getAgentInfo = function (userAgent) {
  if (oj.StringUtils.isEmptyOrUndefined(userAgent)) {
    // eslint-disable-next-line no-param-reassign
    userAgent = navigator.userAgent;
  }
  // eslint-disable-next-line no-param-reassign
  userAgent = userAgent.toLowerCase();
  /** @type {number} */
  var hashCode = oj.StringUtils.hashCode(userAgent);
  var currAgentInfo = oj.AgentUtils._currAgentInfo;
  if (currAgentInfo && currAgentInfo.hashCode === hashCode) {
    return {
      os: currAgentInfo.os,
      browser: currAgentInfo.browser,
      browserVersion: currAgentInfo.browserVersion,
      deviceType: currAgentInfo.deviceType,
      engine: currAgentInfo.engine,
      engineVersion: currAgentInfo.engineVersion,
      hashCode: currAgentInfo.hashCode
    };
  }
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
  if (userAgent.indexOf('iphone') > -1 || (userAgent.indexOf('ipad') > -1 ||
    (navigator.platform === 'MacIntel' &&
    typeof navigator.standalone !== 'undefined'))) {
    os = oj.AgentUtils.OS.IOS;
  } else if (userAgent.indexOf('mac') > -1) {
    os = oj.AgentUtils.OS.MAC;
  } else if (userAgent.indexOf('sunos') > -1) {
    os = oj.AgentUtils.OS.SOLARIS;
  } else if (userAgent.indexOf('android') > -1) {
    os = oj.AgentUtils.OS.ANDROID;
  } else if (userAgent.indexOf('linux') > -1) {
    os = oj.AgentUtils.OS.LINUX;
  } else if (userAgent.indexOf('windows phone') > -1) {
    os = oj.AgentUtils.OS.WINDOWSPHONE;
  } else if (userAgent.indexOf('win') > -1) {
    os = oj.AgentUtils.OS.WINDOWS;
  }

  if (os === oj.AgentUtils.OS.ANDROID) {
    // This works for Chrome, Firefox, and Edge on Android, even though only Chrome is officially supported.
    // This also works for Edge on Windows 10 Mobile, which announces itself as android-compatible user agent.
    deviceType = userAgent.indexOf('mobile') > -1 ?
      oj.AgentUtils.DEVICETYPE.PHONE : oj.AgentUtils.DEVICETYPE.TABLET;
  } else if (os === oj.AgentUtils.OS.IOS) {
    // This works for Safari, Chrome, Firefox, and Edge on iOS, even though only Safari is officially supported.
    deviceType = userAgent.indexOf('iphone') > -1 ?
      oj.AgentUtils.DEVICETYPE.PHONE : oj.AgentUtils.DEVICETYPE.TABLET;
  }

  if (userAgent.indexOf('msie') > -1) {
    browser = oj.AgentUtils.BROWSER.IE;
    browserVersion = oj.AgentUtils._parseFloatVersion(userAgent, /msie (\d+[.]\d+)/);
    if (userAgent.indexOf('trident')) {
      engine = oj.AgentUtils.ENGINE.TRIDENT;
      engineVersion = oj.AgentUtils._parseFloatVersion(userAgent, /trident\/(\d+[.]\d+)/);
    }
  } else if (userAgent.indexOf('trident') > -1) {
    browser = oj.AgentUtils.BROWSER.IE;
    browserVersion = oj.AgentUtils._parseFloatVersion(userAgent, /rv:(\d+[.]\d+)/);
    if (userAgent.indexOf('trident')) {
      engine = oj.AgentUtils.ENGINE.TRIDENT;
      engineVersion = oj.AgentUtils._parseFloatVersion(userAgent, /trident\/(\d+[.]\d+)/);
    }
  } else if (userAgent.indexOf('edge') > -1) {
    browser = oj.AgentUtils.BROWSER.EDGE;
    engineVersion = oj.AgentUtils._parseFloatVersion(userAgent, /edge\/(\d+[.]\d+)/);
    browserVersion = engineVersion;
    engine = oj.AgentUtils.ENGINE.EDGE_HTML;
  } else if (userAgent.indexOf('edg') > -1) {
    browser = oj.AgentUtils.BROWSER.EDGE_CHROMIUM;
    browserVersion = oj.AgentUtils._parseFloatVersion(userAgent, /edg\/(\d+[.]\d+)/);
    engine = oj.AgentUtils.ENGINE.BLINK;
    engineVersion = browserVersion;
  } else if (userAgent.indexOf('chrome') > -1) {
    browser = oj.AgentUtils.BROWSER.CHROME;
    browserVersion = oj.AgentUtils._parseFloatVersion(userAgent, /chrome\/(\d+[.]\d+)/);
    if (browserVersion >= 28) {
      engine = oj.AgentUtils.ENGINE.BLINK;
      engineVersion = browserVersion;
    } else {
      engine = oj.AgentUtils.ENGINE.WEBKIT;
      engineVersion = oj.AgentUtils._parseFloatVersion(userAgent, /applewebkit\/(\d+[.]\d+)/);
    }
  } else if (userAgent.indexOf('safari') > -1) {
    browser = oj.AgentUtils.BROWSER.SAFARI;
    browserVersion = oj.AgentUtils._parseFloatVersion(userAgent, /version\/(\d+[.]\d+)/);
    engine = oj.AgentUtils.ENGINE.WEBKIT;
    engineVersion = oj.AgentUtils._parseFloatVersion(userAgent, /applewebkit\/(\d+[.]\d+)/);
  } else if (userAgent.indexOf('firefox') > -1) {
    browser = oj.AgentUtils.BROWSER.FIREFOX;
    browserVersion = oj.AgentUtils._parseFloatVersion(userAgent, /rv:(\d+[.]\d+)/);
    engine = oj.AgentUtils.ENGINE.GECKO;
    engineVersion = oj.AgentUtils._parseFloatVersion(userAgent, /gecko\/(\d+)/);
  }

  currAgentInfo = {
    hashCode: hashCode,
    os: os,
    browser: browser,
    browserVersion: browserVersion,
    deviceType: deviceType,
    engine: engine,
    engineVersion: engineVersion
  };
  oj.AgentUtils._currAgentInfo = currAgentInfo;

  return {
    os: currAgentInfo.os,
    browser: currAgentInfo.browser,
    browserVersion: currAgentInfo.browserVersion,
    deviceType: currAgentInfo.deviceType,
    engine: currAgentInfo.engine,
    engineVersion: currAgentInfo.engineVersion,
    hashCode: currAgentInfo.hashCode
  };
};
/**
 * @param {string!} userAgent
 * @param {RegExp!} versionNumberPattern
 * @return {number}
 * @private
 * @memberof oj.AgentUtils
 */
oj.AgentUtils._parseFloatVersion = function (userAgent, versionNumberPattern) {
  var matches = userAgent.match(versionNumberPattern);
  if (matches) {
    var versionString = matches[1];
    if (versionString) {
      return parseFloat(versionString);
    }
  }

  return 0;
};



/* global _GLOBAL_PROPS:false,_NATIVE_PROPS:false */
(function () {
  // Checks that a string either starts with 'array' or contains '|array'
  var _ARRAY_TYPE_EXP = /(^array)|(\|array)/;
  // Checks that a string either starts with 'object' or contains '|object'
  var _OBJ_TYPE_EXP = /(^object)|(\|object)/;

  var _ARRAY_VALUE_EXP = /^\s*\[[^]*\]\s*$/;
  var _OBJ_VALUE_EXP = /^\s*\{[^]*\}\s*$/;

  // Check for {{..}} and [[..]] at the beginning of strings to avoid matching
  // any usages mid string
  var _ATTR_EXP = /^(?:\{\{)([^]+)(?:\}\})$/;
  var _ATTR_EXP_RO = /^(?:\[\[)([^]+)(?:\]\])$/;

  /**
   * This map includes attribute to property names for
   * all global attributes where the two differ.
   * @ignore
   */
  var _GLOBAL_ATTRS = {};

  Object.keys(_GLOBAL_PROPS).forEach(function (prop) {
    var attr = _GLOBAL_PROPS[prop];
    if (prop !== attr) {
      _GLOBAL_ATTRS[attr] = prop;
      _NATIVE_PROPS[prop] = attr;
    }
  });

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
  oj.__AttributeUtils.getExpressionInfo = function (attrValue) {
    var info = {};
    if (attrValue) {
      var trimmedVal = attrValue.trim();
      var exp = _ATTR_EXP.exec(trimmedVal);
      exp = exp ? exp[1] : null;
      if (!exp) {
        info.downstreamOnly = true;
        exp = _ATTR_EXP_RO.exec(trimmedVal);
        exp = exp ? exp[1] : null;
      }
      info.expr = exp;
    }

    return info;
  };

  /**
   * @ignore
   * @param {string} attr attribute name
   * @return {string} property name
   * @private
   */
  oj.__AttributeUtils.attributeToPropertyName = function (attr) {
    return attr.toLowerCase().replace(/-(.)/g, (match, group1) => group1.toUpperCase());
  };

  /**
   * @ignore
   * @param {string} name property name
   * @return {string} attribute name
   * @private
   */
  oj.__AttributeUtils.propertyNameToAttribute = function (name) {
    return name.replace(/([A-Z])/g, match => `-${match.toLowerCase()}`);
  };

  /**
   * @ignore
   * @param {string} type event type (e.g. ojBeforeExpand)
   * @return {string} event listener property name (e.g. onOjBeforeExpand)
   * @private
   */
  oj.__AttributeUtils.eventTypeToEventListenerProperty = function (type) {
    return 'on' + type.substr(0, 1).toUpperCase() + type.substr(1);
  };

  /**
   * @ignore
   * @param {string} property event listener property name (e.g. onOjBeforeExpand)
   * @return {string|null} event type (e.g. ojBeforeExpand)
   * @private
   */
  oj.__AttributeUtils.eventListenerPropertyToEventType = function (property) {
    if (/^on[A-Z]/.test(property)) {
      return property.substr(2, 1).toLowerCase() + property.substr(3);
    }
    return null;
  };

  /**
   * @ignore
   * @param {string} name property name (e.g. expanded)
   * @return {string} change event type (e.g. expandedChanged)
   * @private
   */
  oj.__AttributeUtils.propertyNameToChangeEventType = function (name) {
    return name + 'Changed';
  };

  /**
   * @ignore
   * @param {string} trigger event trigger (e.g. beforeExpand)
   * @return {string} event type (e.g. ojBeforeExpand)
   * @private
   */
  oj.__AttributeUtils.eventTriggerToEventType = function (trigger) {
    return 'oj' + trigger.substr(0, 1).toUpperCase() + trigger.substr(1);
  };

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
  oj.__AttributeUtils.coerceValue = function (elem, attr, value, type) {
    var tagName = elem.tagName.toLowerCase();
    if (!type) {
      throw new Error(`Unable to parse ${attr}='${value}' for ${tagName} with id '${elem.id}'. \
        This attribute only supports data bound values. Check the API doc for supported types`);
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
        (typeLwr === 'any' && (isValueArray || isValueObj))) {
      try {
        return JSON.parse(value);
      } catch (ex) {
        throw new Error(`Unable to parse ${attr}='${value}' for ${tagName} with id '${elem.id}' \
          to a JSON Object. Check the value for correct JSON syntax, e.g. double quoted strings. ${ex}`);
      }
    } else if (typeLwr === 'boolean') {
      return oj.__AttributeUtils.coerceBooleanValue(elem, attr, value, type);
    } else if (typeLwr === 'number') {
      if (!isNaN(value)) {
        return Number(value);
      }
    } else if (typeLwr === 'any') {
      // The any type will return a string if not matched as an object or array in first check
      return value;
    } else {
      var typeAr = typeLwr.split('|').filter(item => item.trim() === 'string');
      if (typeAr.length > 0) {
        return value;
      }
    }
    throw new Error(`Unable to parse ${attr}='${value}' for ${tagName} with id '${elem.id}' \
      to a ${type}.`);
  };

  /**
   * Parses boolean attribute values. Throws
   * an error if the value cannot be parsed.
   * @ignore
   * @param {Element} elem The element whose value we are parsing
   * @param {string} attr attribute
   * @param {string} value attribute value
   * @param {string} type property type
   * @return {boolean} coerced value
   * @private
   */
  oj.__AttributeUtils.coerceBooleanValue = function (elem, attr, value, type) {
    // Boolean attributes are considered true if the attribute is:
    // 1) Set to the empty string
    // 2) Present in the DOM without a value assignment
    // 3) Set to the 'true' string
    // 4) Set to the case-insensitive attribute name
    // Boolean values are considered false if set to the false string.
    // An error is thrown for all other values and the attribute value will not be set.
    if (value == null || value === 'true' || value === '' || value.toLowerCase() === attr) {
      return true;
    } else if (value === 'false') {
      return false;
    }

    throw new Error('Unable to parse ' + attr + "='" + value + "' for " +
                    elem + ' with id ' + elem.id + ' to a ' + type + '.');
  };

  /**
  * Returns true if the given property name maps to a global attribute.
  * For global attributes with no property getter, this method will check
  * the attribute name and handle data- and aria- dash cases.
  * @param {string} prop The property name to check
  * @return {boolean}
  * @private
  * @ignore
  */
  oj.__AttributeUtils.isGlobalOrData = function (prop) {
    // TODO: watch out for performance of hasOwnProperty given how often we expect isGlobal to be called
    return Object.prototype.hasOwnProperty.call(_GLOBAL_PROPS, prop) || prop.startsWith('data-') || prop.startsWith('aria-');
  };

  /**
   * This method assumes that the given property name has already been confirmed to
   * be global and will return the attribute syntax or the original value which could be
   * the global attribute name that does not have a property equivalent, e.g.
   * data- or aria-.
   * @ignore
   * @param {string} prop The property name to check
   * @return {string}
   * @private
   */
  oj.__AttributeUtils.getGlobalAttrForProp = function (prop) {
    return _GLOBAL_PROPS[prop] || prop;
  };

  /**
   * This method assumes that the given attribute name has already been confirmed
   * to be global and will return the attribute syntax or the original value which could be
   * the global attribute name that does not have a property equivalent, e.g.
   * data- or aria-.
   * @ignore
   * @param {string} attr The attribute name to check
   * @return {string}
   * @private
   */
  oj.__AttributeUtils.getGlobalPropForAttr = function (attr) {
    return _GLOBAL_ATTRS[attr] || attr;
  };

  /**
   * This method assumes that the given attribute name has already been confirmed
   * to be come from a native HTML element and will return the attribute name if
   * different from the property name for any native HTML element or the original value.
   * @ignore
   * @param {string} prop The property name to check
   * @return {string}
   * @private
   */
  oj.__AttributeUtils.getNativeAttr = function (prop) {
    return _NATIVE_PROPS[prop] || prop;
  };

  var _UNIQUE_INCR = 0;
  var _UNIQUE = '_ojcustomelem';

  /**
   * Returns either the passed id or a unique string that can be used for
   * a custom element id.
   * @ignore
   * @param {string} id
   * @return {string}
   * @private
   */
  oj.__AttributeUtils.getUniqueId = function (id) {
    if (id) {
      return id;
    }
    var ret = _UNIQUE + _UNIQUE_INCR;
    _UNIQUE_INCR += 1;
    return ret;
  };
}());



/* global Promise:false Map:false */

/**
 * NOTE: When adding a new polyfill, please include a description of what the
 * polyfill is for, the source and any copyright info, along with the browsers
 * it is needed for.
 */


(function () {
  if (typeof window === 'undefined') {
    return;
  }
  // polyfill for Element.closest()
  if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest =
        function (s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s);
          var i;
          var el = this;

          do { // eslint-disable-line no-cond-assign
            i = matches.length;
            while (--i >= 0 && matches.item(i) !== el) {} // eslint-disable-line no-plusplus, no-empty
          } while ((i < 0) && (el = el.parentElement)); // eslint-disable-line no-cond-assign
          return el;
        };
  }
}());

(function () {
  // Polyfill for addEventListener & removeEventListener in browsers
  // that do not support an options object. The polyfilled methods accept
  // an options object, extract the capture option and pass it on as useCapture

  /**
  * Detect if options object is supported by checking if
  * browser looks for passive option. Code taken from
  * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
  * under "Safely detecting option support"
  * @ignore
  * @return {boolean} true if option object is supported,
  * false otherwise
  */
  function browserSupportsOptionObject() {
    let supportsOptionsObject = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function () {
          supportsOptionsObject = true;
        }
      });
      window.addEventListener('testPassive', null, opts);
      window.removeEventListener('testPassive', null, opts);
      // eslint-disable-next-line no-empty
    } catch (e) {}
    return supportsOptionsObject;
  }

  /**
   * If option is object, extract capture and pass on
   * as useCapture. Otherwise simply pass on useCapture
   * @ignore
   * @param {Object|boolean} option option object or useCapture
   * @return {boolean} value for useCapture
  */
  function getCaptureOption(option) {
    if (typeof option === 'boolean') {
      return option;
    }
    return option ? option.capture : false;
  }

  /**
   * Helper for creating polyfilled addEventListener
   * or removeEventListener
   * @ignore
   * @param {Function} native addEventlister or
   * removeEventListener
   * @return {Function} polyfilled addEventListenr or
   * removeEventListener that accepts either options
   * object or useCapture.
  */
  function polyfill(native) {
    /**
     * @ignore
     * @param {string} event
     * @param {Function} handler
     * @param {Object|boolean} option options object or useCapture
    */
    return function (event, handler, option) {
      return native.call(
        this,
        event,
        handler,
        getCaptureOption(option)
      );
    };
  }
  if (typeof window !== 'undefined' && !browserSupportsOptionObject()) {
    let nativePrototype;
    if (window.EventTarget) {
      // modern browsers define addEventListener and
      // removeEventListener on EventTarget
      nativePrototype = EventTarget.prototype;
    } else if (window.Node) {
      // IE defines addEventListener and removeEventListener
      // on Node
      nativePrototype = Node.prototype;
    }
    if (nativePrototype) {
      nativePrototype.addEventListener = polyfill(nativePrototype.addEventListener);
      nativePrototype.removeEventListener = polyfill(nativePrototype.removeEventListener);
    }
  }
}());

(function () {
  /**
   * @license
   * Code taken from
   * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/queueMicrotask
   * under "When queueMicrotask() isn't available".
   * @ignore
   */
  if (typeof window !== 'undefined' && typeof window.queueMicrotask !== 'function') {
    // check for window being undefined for WebWorker cases
    window.queueMicrotask = function (callback) {
      Promise.resolve()
        .then(callback)
        .catch(function (e) {
          setTimeout(function () { throw e; });
        });
    };
  }
}());

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
  var workingDefaultPrevented = (function () {
    var e = document.createEvent('Event');
    e.initEvent('foo', true, true);
    e.preventDefault();
    return e.defaultPrevented;
  }());

  if (!workingDefaultPrevented) {
    var origPreventDefault = Event.prototype.preventDefault;
    Event.prototype.preventDefault = function () {
      if (!this.cancelable) {
        return;
      }

      origPreventDefault.call(this);

      Object.defineProperty(this, 'defaultPrevented', {
        get: function () {
          return true;
        },
        configurable: true
      });
    };
  }

  if (typeof window.CustomEvent === 'function') {
    return;
  }

  function CustomEvent(event, params) {
    // eslint-disable-next-line no-param-reassign
    params = params || { bubbles: false, cancelable: false, detail: undefined };

    var evt = document.createEvent('CustomEvent');

    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = Object.getPrototypeOf(new CustomEvent('bogusEvent'));

  window.CustomEvent = CustomEvent;
}());

/**
 * Polyfill FocusEvent constructor for IE.
 */
(function () {
  if (typeof window === 'undefined' || typeof window.FocusEvent === 'function') {
    return;
  }

  // Note that since we can only use initEvent, we don't have a way to
  // polyfill the optional param to specify a relatedTarget for the FocusEvent.
  function FocusEvent(type) {
    var evt = document.createEvent('FocusEvent');
    evt.initEvent(type, false, false);
    return evt;
  }

  FocusEvent.prototype = Object.getPrototypeOf(new FocusEvent('focus'));
  window.FocusEvent = FocusEvent;
}());

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
(function () {
  if (typeof window === 'undefined' || window.setImmediate || !window.postMessage) {
    return;
  }

  var _setImmediateMap;

  var _setImmediateCounter;
  function _nextId() {
    if (isNaN(_setImmediateCounter)) {
      _setImmediateCounter = 0;
    }

    _setImmediateCounter += 1;
    return _setImmediateCounter;
  }

  // postMessage "message" event listener for the setImmediate impl
  function _nextTickHandler(event) {
    var data = event.data;
    if (!data || data.message !== 'oj-setImmediate') {
      return;
    }

    var id = data.id;
    var entry = _setImmediateMap.get(id);
    clearImmediateImpl(id);

    if (entry) {
      var callback = entry.callback;
      var args = entry.args;
      callback.apply(window, args);
    }
  }

  function setImmediateImpl() {
    var callback = arguments[0];
    var slice = Array.prototype.slice;
    var args = slice.call(arguments, 1);

    oj.Assert.assertFunction(callback);

    var id = _nextId();

    if (!_setImmediateMap) {
      _setImmediateMap = new Map();
    }

    _setImmediateMap.set(id, { callback: callback, args: args });

    if (_setImmediateMap.size === 1) {
      window.addEventListener('message', _nextTickHandler);
    }

    window.postMessage({ id: id, message: 'oj-setImmediate' }, '*');
    return id;
  }

  function clearImmediateImpl(id) {
    if (!_setImmediateMap) {
      return;
    }

    _setImmediateMap.delete(id);

    if (_setImmediateMap.size < 1) {
      window.removeEventListener('message', _nextTickHandler);
      _setImmediateMap = null;
    }
  }

  window.setImmediate = setImmediateImpl;
  window.clearImmediate = clearImmediateImpl;
}());

(function () {
  if (typeof window === 'undefined') {
    return;
  }
  if (window.Symbol) {
    if (!window.Symbol.asyncIterator) {
      window.Symbol.asyncIterator = 'asyncIterator';
    }

    if (!window.Symbol.iterator) {
      window.Symbol.iterator = 'iterator';
    }
  } else {
    window.Symbol = {};
    window.Symbol.asyncIterator = 'asyncIterator';
    window.Symbol.iterator = 'iterator';
  }
}());

(function () {
  if (typeof window === 'undefined') {
    return;
  }

  if (new window.Set([0]).size === 0) {
    var NativeSet = window.Set;
    // eslint-disable-next-line no-inner-declarations
    function Set(iterable) {
      var set = new NativeSet();
      if (iterable) {
        iterable.forEach(set.add, set);
      }
      return set;
    }
    Set.prototype = NativeSet.prototype;
    // eslint-disable-next-line no-extend-native
    Set.prototype.constructor = Set;
    window.Set = Set;
  }
}());

(function () {
  if (typeof window === 'undefined') {
    return;
  }

  // IE11 supports Array.forEach
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  if (window.DOMTokenList && !DOMTokenList.prototype.forEach) {
    DOMTokenList.prototype.forEach = Array.prototype.forEach;
  }
}());

/**
 * Node.isConnected polyfill for IE and EdgeHTML
 * 2020-02-04
 * By Eli Grey, https://eligrey.com
 * Public domain.
 * From: https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected
 */
(function () {
  if (typeof window === 'undefined' || window.Node === 'undefined') {
    return;
  }

  if (!('isConnected' in Node.prototype)) {
    Object.defineProperty(Node.prototype, 'isConnected', {
      get() {
        return (
          !this.ownerDocument ||
          // eslint-disable-next-line no-bitwise
          !(this.ownerDocument.compareDocumentPosition(this) & this.DOCUMENT_POSITION_DISCONNECTED)
        );
      },
    });
  }
}());


/* global Set:false */

/**
 * Element utilities.
 * @class oj.ElementUtils
 * @ignore
 */
oj.ElementUtils = {
  /**
   * Custom element name check
   * @param {String} localName Element name
   * @return {boolean}
   * @ignore
   */
  isValidCustomElementName: function (localName) {
    var reservedTagList = new Set([
      'annotation-xml',
      'color-profile',
      'font-face',
      'font-face-src',
      'font-face-uri',
      'font-face-format',
      'font-face-name',
      'missing-glyph',
    ]);
    var reserved = reservedTagList.has(localName);
    var validForm = /^[a-z][.0-9_a-z]*-[-.0-9_a-z]*$/.test(localName);
    return !reserved && validForm && !localName.startsWith('oj-bind-', 0);
  }
};



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true*/

/**
 * @export
 * @class oj.EventSource
 * @classdesc Object which supports subscribing to and firing events
 * @constructor
 * @final
 * @since 1.1
 * @ojdeprecated {since: '5.0.0', description: 'Use DataProvider instead.'}
 */
oj.EventSource = function () {
  this.Init();
};

// Subclass from oj.Object
oj.Object.createSubclass(oj.EventSource, oj.Object, 'oj.EventSource');

/**
 * Initializes the instance.
 * @export
 */
oj.EventSource.prototype.Init = function () {
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
oj.EventSource.prototype.on = function (eventType, eventHandler) {
  var foundEventHandler = false;

  for (var i = 0; i < this._eventHandlers.length; i++) {
    if (this._eventHandlers[i].eventType === eventType &&
        this._eventHandlers[i].eventHandlerFunc === eventHandler) {
      foundEventHandler = true;
      break;
    }
  }
  if (!foundEventHandler) {
    this._eventHandlers.push({ eventType: eventType, eventHandlerFunc: eventHandler });
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
oj.EventSource.prototype.off = function (eventType, eventHandler) {
  for (var i = this._eventHandlers.length - 1; i >= 0; i--) {
    if (this._eventHandlers[i].eventType === eventType &&
        this._eventHandlers[i].eventHandlerFunc === eventHandler) {
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
// eslint-disable-next-line no-unused-vars
oj.EventSource.prototype.handleEvent = function (eventType, event) {
  var returnValue;

  for (var i = 0; i < this._eventHandlers.length; i++) {
    var eventHandler = this._eventHandlers[i];
    if (eventHandler.eventType === eventType) {
      returnValue =
        eventHandler.eventHandlerFunc.apply(this, Array.prototype.slice.call(arguments).slice(1));

      if (returnValue === false) {
        // event cancelled
        return false;
      }
    }
  }

  return true;
};


/**
 * Key utilities.
 * @class oj.KeyUtils
 * @export
 * @ignore
 */
oj.KeyUtils = {};

/**
 * Determine whether the two keys specified are considered equal.
 *
 * @param {any} key1 first key to compare
 * @param {any} key2 second key to compare
 * @returns {boolean} true if the keys are considered the same, false otherwise.
 * @export
 * @memberof oj.KeyUtils
 */
oj.KeyUtils.equals = function (key1, key2) {
  // algorithm for key equality:
  // if the keys are of type primitive, then do === comparison
  // if the keys are object, then do deep comparison of properties
  // for now, this is the same as compareValues, but this allows us to diverge in the future
  // ex: generate hash with key and compare hash value instead
  return oj.Object.compareValues(key1, key2);
};



/* global _scope:false, Logger:false */

/**
 * @private
 */
var _checkpointManagerDelegate = _scope.__ojCheckpointManager;

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
oj.CHECKPOINT_MANAGER.startCheckpoint = function (name, description) {
  if (_checkpointManagerDelegate) {
    _checkpointManagerDelegate.startCheckpoint(name, description);
  }
};

/**
 * Ends a checkpoint
 * @param {!string} name - the name of the checkpoint
 * @export
 * @memberof! oj.CHECKPOINT_MANAGER
 */
oj.CHECKPOINT_MANAGER.endCheckpoint = function (name) {
  if (_checkpointManagerDelegate) {
    _checkpointManagerDelegate.endCheckpoint(name);
  }
};

/**
 * Retrieves a checkpoint record for a given name
 * @param {!string} name - the name of the checkpoint
 * @return {undefined|{start: number, end: number, duration: number, name: {string}, description: (string|undefined)}}
 * @export
 * @memberof! oj.CHECKPOINT_MANAGER
 */
oj.CHECKPOINT_MANAGER.getRecord = function (name) {
  return _checkpointManagerDelegate ? _checkpointManagerDelegate.getRecord(name) : undefined;
};

/**
 * Retrieves all checkpoint records matching a regular expression
 * @param {!RegExp} regexp - regular expression to match.
 * @return Array.{{start: number, end: number, duration: number, name: {string}, description: (string|undefined)}}
 * @export
 * @memberof! oj.CHECKPOINT_MANAGER
 */
oj.CHECKPOINT_MANAGER.matchRecords = function (regexp) {
  return _checkpointManagerDelegate ? _checkpointManagerDelegate.matchRecords(regexp) : [];
};

/**
 * Dumps matched records into oj.Logger
 * @param {!RegExp} regexp - regular expression for the records to dump.
 * @export
 * @memberof! oj.CHECKPOINT_MANAGER
 */
oj.CHECKPOINT_MANAGER.dump = function (regexp) {
  Logger.info(
    function () {
      var logMsg = 'Checkpoint Records:';
      var records = oj.CHECKPOINT_MANAGER.matchRecords(regexp);
      for (var i = 0; i < records.length; i++) {
        var record = records[i];
        logMsg = logMsg + '\n' + record.name;
        var desc = record.description;
        if (desc != null) {
          logMsg = logMsg + ' (' + desc + ')';
        }
        logMsg += ':\n';
        logMsg = logMsg + 'start: ' + record.start + '\tduration: ' + record.duration;
      }
      return logMsg;
    }
  );
};

;return oj;
});