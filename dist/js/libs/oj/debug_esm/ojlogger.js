/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import * as PreactLogger from '@oracle/oraclejet-preact/utils/UNSAFE_logger';
import { error as error$1, info as info$1, warn as warn$1, log as log$1, getLogLevel, setLogLevel, setLogWriter } from '@oracle/oraclejet-preact/utils/UNSAFE_logger';

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
Logger._defaultOptions = { level: Logger.LEVEL_ERROR, writer: null };
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
Logger.error = error$1.bind(PreactLogger);

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
Logger.info = info$1.bind(PreactLogger);

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
Logger.warn = warn$1.bind(PreactLogger);

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
Logger.log = log$1.bind(PreactLogger);

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
      ret[keys[i]] = keys[i] === 'level' ? getLogLevel() : Logger._options[keys[i]];
    }
    return ret;
  }
  if (typeof key === 'string' && value === undefined) {
    let optValue;
    switch (key) {
      case 'level':
        optValue = getLogLevel();
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
    if (key === 'level') {
      setLogLevel(value);
    } else if (key === 'writer') {
      setLogWriter(value);
      // Keep the writer since PreactLogger does not have getLogWriter() method
      Logger._options[key] = value;
    }
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

export { LEVEL_ERROR, LEVEL_INFO, LEVEL_LOG, LEVEL_NONE, LEVEL_WARN, error, info, log, option, warn };
