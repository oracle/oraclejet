/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define([], function()
{
  "use strict";


/* jslint browser: true*/

/**
 * @namespace
 * @name oj.Logger
 * @hideconstructor
 * @ojtsmodule
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
 * @desc oj.Logger cannot be instantiated
 * @export
 */
var Logger = {};
/**
 * Log level none
 * @const
 * @export
 * @type {number}
 * @memberof oj.Logger
 * @alias LEVEL_NONE
 */

Logger.LEVEL_NONE = 0;
/**
 * Log level error
 * @const
 * @type {number}
 * @export
 * @memberof oj.Logger
 * @alias LEVEL_ERROR
 */

Logger.LEVEL_ERROR = 1;
/**
 * Log level warning
 * @const
 * @type {number}
 * @export
 * @memberof oj.Logger
 * @alias LEVEL_WARN
 */

Logger.LEVEL_WARN = 2;
/**
 * Log level info
 * @const
 * @type {number}
 * @export
 * @memberof oj.Logger
 * @alias LEVEL_INFO
 */

Logger.LEVEL_INFO = 3;
/**
 * Log level - general message
 * @const
 * @type {number}
 * @export
 * @memberof oj.Logger
 * @alias LEVEL_LOG
 */

Logger.LEVEL_LOG = 4;
/* private constants*/

Logger._METHOD_ERROR = 'error';
Logger._METHOD_WARN = 'warn';
Logger._METHOD_INFO = 'info';
Logger._METHOD_LOG = 'log';
Logger._defaultOptions = {
  level: Logger.LEVEL_ERROR,
  writer: null
};
Logger._options = Logger._defaultOptions;
/* public members*/

/**
 * Writes an error message.
 * @param {any=} message A function that returns the message to be logged, a string containing zero or more substitution strings, or an object to be logged.
 *                      See examples in the overview section above.
 * @param {...any} optionalParams Objects with which to replace substitution strings within messages or simply additional objects to be logged.
 * @return {void}
 * @export
 * @memberof oj.Logger
 * @method error
 * @since 1.0.0
 * @ojsignature {target: "Type", for: "optionalParams", value: "any[]"}
 */
// eslint-disable-next-line no-unused-vars

Logger.error = function (message, optionalParams) {
  Logger._write(Logger.LEVEL_ERROR, Logger._METHOD_ERROR, arguments);
};
/**
 * Writes an informational  message.
 * @param {any=} message A function that returns the message to be logged, a string containing zero or more substitution strings, or an object to be logged.
 *                      See examples in the overview section above.
 * @param {...any} optionalParams Objects with which to replace substitution strings within messages or simply additional objects to be logged.
 * @return {void}
 * @export
 * @memberof oj.Logger
 * @method info
 * @since 1.0.0
 * @ojsignature {target: "Type", for: "optionalParams", value: "any[]"}
 */
// eslint-disable-next-line no-unused-vars


Logger.info = function (message, optionalParams) {
  Logger._write(Logger.LEVEL_INFO, Logger._METHOD_INFO, arguments);
};
/**
 * Writes a warning message.
 * @param {any=} message A function that returns the message to be logged, a string containing zero or more substitution strings, or an object to be logged.
 *                      See examples in the overview section above.
 * @param {...any} optionalParams Objects with which to replace substitution strings within messages or simply additional objects to be logged.
 * @export
 * @return {void}
 * @memberof oj.Logger
 * @method warn
 * @since 1.0.0
 * @ojsignature {target: "Type", for: "optionalParams", value: "any[]"}
 */
// eslint-disable-next-line no-unused-vars


Logger.warn = function (message, optionalParams) {
  Logger._write(Logger.LEVEL_WARN, Logger._METHOD_WARN, arguments);
};
/**
 * Writes a general message.
 * @param {any=} message A function that returns the message to be logged, a string containing zero or more substitution strings, or an object to be logged.
 *                      See examples in the overview section above.
 * @param {...any} optionalParams Objects with which to replace substitution strings within messages or simply additional objects to be logged.
 * @return {void}
 * @export
 * @memberof oj.Logger
 * @method log
 * @since 1.0.0
 * @ojsignature {target: "Type", for: "optionalParams", value: "any[]"}
 */
// eslint-disable-next-line no-unused-vars


Logger.log = function (message, optionalParams) {
  Logger._write(Logger.LEVEL_LOG, Logger._METHOD_LOG, arguments);
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
 * @return {any}
 * @export
 * @memberof oj.Logger
 * @method option
 * @since 1.0.0
 * @ojsignature {target: "Type", for: "key", value: "'level'|'writer'|{level?: any, writer?: any}"}
 */


Logger.option = function (key, value) {
  // getters
  var ret = {};
  var i;
  var keys;

  if (arguments.length === 0) {
    keys = Object.keys(Logger._options);

    for (i = 0; i < keys.length; i++) {
      ret[keys[i]] = Logger._options[keys[i]];
    }

    return ret;
  }

  if (typeof key === 'string' && value === undefined) {
    return Logger._options[key] === undefined ? null : Logger._options[key];
  } // setters


  if (typeof key === 'string') {
    Logger._options[key] = value;
  } else {
    // case when all options are set in one call
    var options = key;
    keys = Object.keys(options);

    for (i = 0; i < keys.length; i++) {
      Logger.option(keys[i], options[keys[i]]);
    }
  }

  return undefined;
};
/* private members*/

/*
 * Helper method - calls a specified method on the available writer (console or custom)
 * if the logging level is sufficient
 */


Logger._write = function (level, method, args) {
  if (Logger.option('level') < level) {
    return;
  }

  var writer = Logger._getWriter();

  if (writer != null) {
    if (args.length === 1 && args[0] instanceof Function) {
      var msg = args[0](); // eslint-disable-next-line no-param-reassign

      args = [msg];
    }

    if (writer[method] && writer[method].apply) {
      writer[method].apply(writer, args);
    } else if (writer[method]) {
      writer[method] = Function.prototype.bind.call(writer[method], writer);

      Logger._write(level, method, args);
    }
  }
};
/*
 * Helper method - returns available writer (console or custom)
 */


Logger._getWriter = function () {
  var writer = null;

  if (Logger.option('writer')) {
    writer = Logger.option('writer');
  } else if (typeof window !== 'undefined' && window.console !== undefined) {
    writer = window.console;
  }

  return writer;
};

;return Logger;
});