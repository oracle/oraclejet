/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports'], function (exports) { 'use strict';

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
   * <p>The logging level can be overridden via sessionStorage.setItem() call for the current browser session.
   * Use 'ojet.logLevel' as the key with one of the following values: 'none' (least verbose), 'error', 'warning', 'info', 'log' (most verbose).
   * Set the value in the browser console and refresh the browser in order for the value to take effect.
   * </p>
   * <h3> Session storage usage : </h3>
   * <pre class="prettyprint">
   * <code>
   * // override logging level for the current session
   * sessionStorage.setItem('ojet.logLevel', 'log');
   * </code></pre>
   *
   * <p>All the logging methods support string formatting, accept variable number of arguments and accept a function as a parameter.
   * When a callback function is specified as a parameter the function will be called if the log level is sufficient.
   *
   * <h3> Logger usage : </h3>
   * <pre class="prettyprint">
   * <code>
   * //optional calls, see defaults
   * Logger.option("level",  Logger.LEVEL_INFO);
   * Logger.option("writer",  customWriter);  //an object that implements the following methods: log(), info(), warn(), error()
   *
   * // logging a message
   * Logger.info("My log level is %d", Logger.option("level"));  // string formatting
   * Logger.warn("Beware of bugs", "in the above code");            // multiple parameters
   *
   * // using a callback function as a parameter
   * Logger.info(function(){
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
  const Logger = {};

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
  Logger._defaultOptions = { level: Logger.LEVEL_ERROR, writer: null };
  Logger._options = Logger._defaultOptions;

  /*
   * Helper method that retrieves and parses session storage setting
   */
  const _getSessionStorage = () => {
    let logLevel;
    try {
      const sessionValue =
        typeof window !== 'undefined' && window.sessionStorage !== undefined
          ? sessionStorage.getItem('ojet.logLevel')
          : undefined;
      switch (sessionValue) {
        case 'none':
          logLevel = Logger.LEVEL_NONE;
          break;
        case 'error':
          logLevel = Logger.LEVEL_ERROR;
          break;
        case 'warning':
          logLevel = Logger.LEVEL_WARN;
          break;
        case 'info':
          logLevel = Logger.LEVEL_INFO;
          break;
        case 'log':
          logLevel = Logger.LEVEL_LOG;
          break;
        default:
          logLevel = undefined;
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}

    return logLevel;
  };

  /* SessionStorage setting */
  const _sessionStorage = _getSessionStorage();

  /*
   * Helper method - returns current log level from session storage or options
   */
  const _getLogLevel = () => {
    return _sessionStorage || Logger._options.level;
  };

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
        ret[keys[i]] = key === 'level' ? _getLogLevel() : Logger._options[keys[i]];
      }
      return ret;
    }
    if (typeof key === 'string' && value === undefined) {
      let optValue;
      switch (key) {
        case 'level':
          optValue = _getLogLevel();
          break;
        case 'writer':
          optValue = Logger._options.writer;
          break;
        default:
          optValue = null;
      }
      return optValue;
    }

    // setters
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
        var msg = args[0]();
        // eslint-disable-next-line no-param-reassign
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

  const info = Logger.info;
  const error = Logger.error;
  const warn = Logger.warn;
  const log = Logger.log;
  const option = Logger.option;
  const LEVEL_ERROR = Logger.LEVEL_ERROR;
  const LEVEL_INFO = Logger.LEVEL_INFO;
  const LEVEL_LOG = Logger.LEVEL_LOG;
  const LEVEL_NONE = Logger.LEVEL_NONE;
  const LEVEL_WARN = Logger.LEVEL_WARN;

  exports.LEVEL_ERROR = LEVEL_ERROR;
  exports.LEVEL_INFO = LEVEL_INFO;
  exports.LEVEL_LOG = LEVEL_LOG;
  exports.LEVEL_NONE = LEVEL_NONE;
  exports.LEVEL_WARN = LEVEL_WARN;
  exports.error = error;
  exports.info = info;
  exports.log = log;
  exports.option = option;
  exports.warn = warn;

  Object.defineProperty(exports, '__esModule', { value: true });

});
