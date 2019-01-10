/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define([], function () {
  'use strict';

  /**
   * @export
   * @class Logger
   * @classdesc Logger utility for persistence toolkit
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
   * logger.option("level",  this.LEVEL_INFO);
   * logger.option("writer",  customWriter);  //an object that implements the following methods: log(), info(), warn(), error()
   *
   * // logging a message
   * logger.info("My log level is %d", Logger.option("level"));  // string formatting
   * logger.warn("Beware of bugs", "in the above code");            // multiple parameters
   *
   * // using a callback function as a parameter
   * logger.info(function(){
   *    var foo = "This ";
   *    var bar = "is ";
   *    var zing = "a function";
   *    return foo + bar + zing;
   * });
   * </code></pre>
   *
   * @desc
   * logger cannot be instantiated
   * @export
   */

  function Logger() {
    Object.defineProperty(this, 'LEVEL_NONE', {
      value: 0,
      enumerable: true
    });
    Object.defineProperty(this, 'LEVEL_ERROR', {
      value: 1,
      enumerable: true
    });
    Object.defineProperty(this, 'LEVEL_WARN', {
      value: 2,
      enumerable: true
    });
    Object.defineProperty(this, 'LEVEL_INFO', {
      value: 3,
      enumerable: true
    });
    Object.defineProperty(this, 'LEVEL_LOG', {
      value: 4,
      enumerable: true
    });
    Object.defineProperty(this, '_METHOD_ERROR', {
      value: 'error'
    });
    Object.defineProperty(this, '_METHOD_WARN', {
      value: 'warn'
    });
    Object.defineProperty(this, '_METHOD_INFO', {
      value: 'info'
    });
    Object.defineProperty(this, '_METHOD_LOG', {
      value: 'log'
    });
    Object.defineProperty(this, '_defaultOptions', {
      value: {'level': this.LEVEL_ERROR, 'writer': null}
    });
    Object.defineProperty(this, '_options', {
      value: this._defaultOptions,
      writable: true
    });
  };

  /**
   * Writes an error message.
   * @method
   * @name error
   * @memberof! Logger
   * @export
   * @instance
   * @param {...*} args The method supports a variable number of arguments, string substitutions and accepts a function as a parameter.
   *                                See examples in the overview section above.
   */
  Logger.prototype.error = function (args) {
    _write(this, this.LEVEL_ERROR, this._METHOD_ERROR, arguments);
  };

  /**
   * Writes an informational  message.
   * @method
   * @name info
   * @memberof! Logger
   * @export
   * @instance
   * @param {...*} args The method supports a variable number of arguments, string substitutions and accepts a function as a parameter.
   *                                See examples in the overview section above.
   */
  Logger.prototype.info = function (args) {
    _write(this, this.LEVEL_INFO, this._METHOD_INFO, arguments);
  };

  /**
   * Writes a warning message.
   * @method
   * @name warn
   * @memberof! Logger
   * @export
   * @instance
   * @param {...*} args The method supports a variable number of arguments, string substitutions and accepts a function as a parameter.
   *                                See examples in the overview section above.
   */
  Logger.prototype.warn = function (args) {
    _write(this, this.LEVEL_WARN, this._METHOD_WARN, arguments);
  };

  /**
   * Writes a general message.
   * @method
   * @name log
   * @memberof! Logger
   * @export
   * @instance
   * @param {...*} args The method supports a variable number of arguments, string substitutions and accepts a function as a parameter.
   *                                See examples in the overview section above.
   */
  Logger.prototype.log = function (args) {
    _write(this, this.LEVEL_LOG, this._METHOD_LOG, arguments);
  };

  /**
   * Method for setting and getting logger option/options
   * <p>Sets/gets logger configuration - level and/or writer. Accepts variable number of arguments.
   * <p><h5>Defaults:</h5>
   * Default level: this.LEVEL_ERROR<br/>
   * Default writer: null; writes to the console
   * <p><h5>Usages:</h5>
   * <i>logger.option(optionName)</i> gets the value associated the the specified optionName<br/>
   * <i>logger.option()</i> gets an object containing key/value pairs representing the logger options hash<br/>
   * <i>logger.option(optionName, value)</i> sets  the option value associated with optionName<br/>
   * <i>logger.option(options)</i> sets  one or more options for the logger
   *
   * @example <caption>Overriding default options</caption>
   * logger.option("level",  this.LEVEL_INFO);
   * logger.option("writer",  customWriter);  //an object that implements the following methods: log(), info(), warn(), error()
   * @method
   * @name option
   * @memberof! Logger
   * @export
   * @instance
   * @param {Object|string=} key
   * @param {Object|string=} value
   */
  Logger.prototype.option = function (key, value) {
    var ret = {}, opt;
    if (arguments.length == 0) {
      for (opt in this._options) {
        if (this._options.hasOwnProperty(opt)) {
          ret[opt] = this._options[opt];
        }
      }
      return ret;
    }
    if (typeof key === "string" && value === undefined) {
      return this._options[key] === undefined ? null : this._options[key];
    }

    if (typeof key === "string") {
      this._options[key] = value;
    } else {
      var options = key;
      for (opt in options) {
        if (options.hasOwnProperty(opt)) {
          this.option(opt, options[opt]);
        }
      }
    }
  };

  /* private members*/
  /*
   * Helper method - calls a specified method on the available writer (console or custom)
   * if the logging level is sufficient
   */
  function _write(logger, level, method, args) {
    var self = logger;

    if (self.option("level") < level) {
      return;
    }

    var writer = _getWriter(self);
    if (writer != null) {
      if (args.length == 1 && (args[0] instanceof Function)) {
        var msg = args[0]();
        args = [msg];
      }
      if (writer[method] && writer[method].apply) {
        writer[method].apply(writer, args);
      } else if (writer[method]) {
        writer[method] = Function.prototype.bind.call(writer[method], writer);
        _write(self, level, method, args);
      }
    }
  };

  /*
   * Helper method - returns available writer (console or custom)
   */
  function _getWriter(logger) {
    var self = logger;

    var writer = null;
    if (self.option("writer")) {
      writer = self.option("writer");
    } else if (typeof window !== 'undefined' && window.console !== undefined) {
      writer = window.console;
    } else if (typeof console !== 'undefined') {
      writer = console;
    }
    return writer;
  };
  return new Logger();
});