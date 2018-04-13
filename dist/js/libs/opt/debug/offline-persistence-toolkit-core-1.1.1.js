/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('impl/logger',[], function () {
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
    }
    return writer;
  };
  return new Logger();
});
/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persistenceUtils',['./impl/logger'], function (logger) {
  'use strict';
  
  /**
   * @class persistenceUtils
   * @classdesc Provide various utilities for converting Request/Response objects
   * to JSON.
   * @export
   * @hideconstructor
   */
  
  /**
   * Return whether the Response is a cached Response
   * @method
   * @name isCachedResponse
   * @memberof persistenceUtils
   * @static
   * @param {Response} response Response object
   * @return {boolean} Returns whether it's a cached Response
   */
  function isCachedResponse(response) {
    return response.headers.has('x-oracle-jscpt-cache-expiration-date');
  };
  
  /**
   * Return whether the Response has a generated ETag
   * @method
   * @name isGeneratedEtagResponse
   * @memberof persistenceUtils
   * @static
   * @param {Response} response Response object
   * @return {boolean} Returns whether it has a generated ETag
   */
  function isGeneratedEtagResponse(response) {
    return response.headers.has('x-oracle-jscpt-etag-generated');
  };
  
  function _isTextPayload(headers) {

    var contentType = headers.get('Content-Type');

    if (contentType &&
      (contentType.indexOf('text/') !== -1 ||
       contentType.indexOf('application/json') !== -1)) {
      return true;
    }
    return false;
  };
  
  function _isMultipartPayload(headers) {

    var contentType = headers.get('Content-Type');

    return (contentType &&
            contentType.indexOf('multipart/') !== -1);
  };

  /**
   * Return a JSON object representing the Request object
   * @method
   * @name requestToJSON
   * @memberof persistenceUtils
   * @static
   * @param {Request} request Request object
   * @return {Promise} Returns a Promise which resolves to the JSON object
   * representing the Request
   */
  function requestToJSON(request, options) {
    logger.log("Offline Persistence Toolkit persistenceUtils: requestToJSON()");
    if (!options || !options._noClone) {
      request = request.clone();
    }
    var requestObject = {};
    _copyProperties(request, requestObject, ['body', 'headers', 'signal']);
    requestObject['headers'] = _getHeaderValues(request.headers);
    return _copyPayload(request, requestObject);
  };
  
  function _copyProperties(sourceObj, targetObj, ignoreProps) {
    for (var k in sourceObj) {
      if (typeof (sourceObj[k]) !== 'function' &&
        !_isPrivateProperty(k) &&
        ignoreProps.indexOf(k) === -1) {
        // we check for underscore too because the fetch polyfill uses
        // underscores for private props.
        targetObj[k] = sourceObj[k];
      }
    }
  };
  
  function _isPrivateProperty(property) {
    return property.indexOf('_') === 0;
  };
  
  function _getHeaderValues(headers) {
    var headersData = {};
    if (headers.entries) {
      var headerEntriesIter = headers.entries();
      var headerEntry;
      var headerName;
      var headerValue;

      do {
        headerEntry = headerEntriesIter.next();

        if (headerEntry['value']) {
          headerName = headerEntry['value'][0];
          headerValue = headerEntry['value'][1];
          headersData[headerName] = headerValue;
        }
      } while (!headerEntry['done']);
    } else if (headers.forEach) {
      // Edge uses forEach
      headers.forEach(function (headerValue, headerName) {
        headersData[headerName] = headerValue;
      })
    }
    _addDateHeaderIfNull(headersData);
 
    return headersData;
  };
  
  function _addDateHeaderIfNull(headersData) {
    // Date is not exposed for CORS request/response
    var date = headersData['date'];

    if (!date) {
      logger.log("Offline Persistence Toolkit persistenceUtils: Setting HTTP date header since it's null or not exposed");
      date = (new Date()).toUTCString();
      headersData['date'] = date;
    }
  };

  function _copyPayload(source, targetObj) {
    targetObj.body = {};
    
    if ((source instanceof Request) &&
        _isMultipartPayload(source.headers)) {
      return _copyMultipartPayload(source, targetObj);
    }

    if ((source instanceof Request) ||
        _isTextPayload(source.headers)) {
      return source.text().then(function (text) {
        targetObj.body.text = text;
        return targetObj;
      });
    }

    if (!(source instanceof Request) && 
        typeof(source.arrayBuffer) === 'function') {
      return source.arrayBuffer().then(function (aBuffer) {
        if (aBuffer.byteLength > 0) {
          targetObj.body.arrayBuffer = aBuffer;
        }
        return targetObj;
      });
    }

    return Promise.reject(new Error({message: 'payload body type is not supported'}));
  };
  
  function _copyMultipartPayload(request, targetObj) {
    logger.log("Offline Persistence Toolkit persistenceUtils: Copying multipart payload");
    if (typeof(request.formData) === 'function') {
      return request.formData().then(function (formData) {
        var formDataPairObject = {};
        var formDataIter = formData.entries();
        var formDataEntry;
        var formDataEntryValue;
        var formDataName;
        var formDataValue;

        do {
          formDataEntry = formDataIter.next();
          formDataEntryValue = formDataEntry['value'];

          if (formDataEntryValue) {
            formDataName = formDataEntryValue[0];
            formDataValue = formDataEntryValue[1];
            formDataPairObject[formDataName] = formDataValue;
          }
        } while (!formDataEntry['done']);

        targetObj.body.formData = formDataPairObject;
        return targetObj;
      });
    } else {
      var contentType = request.headers.get('Content-Type');
      return request.text().then(function (text) {
        var parts = parseMultipartFormData(text, contentType);
        var formDataPairObject = {};
        for (var index = 0; index < parts.length; index++) {
          formDataPairObject[parts[index].headers.name] = parts[index].data;
        }
        targetObj.body.formData = formDataPairObject;
       return targetObj;
      });
    }
  };

  /**
   * Return a JSON object representing the Response object
   * @method
   * @name responseToJSON
   * @memberof persistenceUtils
   * @static
   * @param {Response} response Response object
   * @param {{excludeBody: boolean}=} options Options
   * <ul>
   * <li>options.excludeBody Whether to exclude body from generating the JSON object or not.</li>
   * </ul>
   * @return {Promise} Returns a Promise which resolves to the JSON object
   * representing the Response
   */
  function responseToJSON(response, options) {
    logger.log("Offline Persistence Toolkit persistenceUtils: responseToJSON()");
    if (!options || !options._noClone) {
      response = response.clone();
    }
    var responseObject = {};
    _copyProperties(response, responseObject, ['body', 'headers']);
    responseObject['headers'] = _getHeaderValues(response.headers);
    if (options && options.excludeBody) {
      return Promise.resolve(responseObject);
    } else {
      return _copyPayload(response, responseObject);
    }
  };

  /**
   * Return a Request object constructed from the JSON object returned by 
   * requestToJSON
   * @method
   * @name requestFromJSON
   * @memberof persistenceUtils
   * @static
   * @param {Object} data JSON object returned by requestToJSON
   * @return {Promise} Returns a Promise which resolves to the Request
   */
  function requestFromJSON(data) {
    logger.log("Offline Persistence Toolkit persistenceUtils: requestFromJSON()");
    var initFromData = {};
    _copyProperties(data, initFromData, ['headers', 'body', 'signal']);
    var skipContentType = _copyPayloadFromJsonObj(data, initFromData);
    initFromData.headers = _createHeadersFromJsonObj(data, skipContentType);

    return _createRequestFromJsonObj(data, initFromData);
  };
  
  function _copyPayloadFromJsonObj(data, targetObj) {
    var skipContentType = false;
    var body = data.body;
    
    if (body.text && body.text.length > 0) {
      targetObj.body = body.text;
    } else if (body.arrayBuffer) {
      targetObj.body = body.arrayBuffer;
    } else if (body.formData) {
      skipContentType = true;
      var formData = new FormData();
      var formPairs = body.formData;
      Object.keys(formPairs).forEach(function (pairkey) {
        formData.append(pairkey, formPairs[pairkey]);
      });
      targetObj.body = formData;
    }

    return skipContentType;
  };
  
  function _createHeadersFromJsonObj(data, skipContentType) {
    var headers = new Headers();
    Object.keys(data.headers).forEach(function (key) {
      if (key !== 'content-type' ||
        (!skipContentType && key === 'content-type')) {
        headers.append(key, data.headers[key]);
      }
    });

    return headers;
  };
  
  function _createRequestFromJsonObj(data, initFromData) {
    return Promise.resolve(new Request(data.url, initFromData));
  };

  /**
   * Return a Response object constructed from the JSON object returned by
   * responseToJSON
   * @method
   * @name responseFromJSON
   * @memberof persistenceUtils
   * @static
   * @param {Object} data JSON object returned by responseToJSON
   * @return {Promise} Returns a Promise which resolves to the Response
   */
  function responseFromJSON(data) {
    logger.log("Offline Persistence Toolkit persistenceUtils: responseFromJSON()");
    var initFromData = {};
    _copyProperties(data, initFromData, ['headers', 'body']);
    initFromData.headers = _createHeadersFromJsonObj(data, false);

    return _createResponseFromJsonObj(data, initFromData);
  };
  
  function _createResponseFromJsonObj(data, initFromData) {
    var response;
    var body = data.body;

    if (body && body.text) {
      response = new Response(body.text, initFromData);
    } else if (body && body.arrayBuffer) {
      initFromData.responseType = 'blob';
      response = new Response(body.arrayBuffer, initFromData);
    } else if (body && body.blob) {
      initFromData.responseType = 'blob';
      response = new Response(body.blob, initFromData);
    } else {
      response = new Response(null, initFromData);
    }

    return Promise.resolve(response);
  };

  /**
   * Update the Response object with the provided payload. The existing payload 
   * will be replaced
   * @method
   * @name setResponsePayload
   * @memberof persistenceUtils
   * @static
   * @param {Response} response Response object
   * @param {Object} payload JSON payload data
   * @return {Promise} Returns a Promise which resolves to the updated Response object 
   */
  function setResponsePayload(response, payload) {
    logger.log("Offline Persistence Toolkit persistenceUtils: setResponsePayload()");
    return responseToJSON(response).then(function (responseObject) {
      var body = responseObject.body;

      if (body.arrayBuffer) {
        if (payload instanceof ArrayBuffer) {
          body.arrayBuffer = payload;
        } else {
          throw new Error({message: 'unexpected payload'});
        }
      } else if (payload instanceof Blob) { 
        body.blob = payload;
      } else {
        body.text = JSON.stringify(payload);
      }
      return responseFromJSON(responseObject);
    });
  };

  /**
   * Parse multipart form data in the resquest/response body. Any binary data
   * must be base64 encoded.
   * @method
   * @name parseMultipartFormData
   * @memberof persistenceUtils
   * @static
   * @param {string} origbody request/response body as text
   * @param {string} contentType content type
   * @return {Array} Array of the parts
   */
  function parseMultipartFormData(origbody, contentType) {
    logger.log("Offline Persistence Toolkit persistenceUtils: parseMultipartFormData()");
    var contentTypePrased = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    if (!contentTypePrased) {
      throw new Error("not a valid multipart form data value.");
    }

    var parseHeader = function (headerpart) {
      var parsedHeaders = {};
      var headers = {};
      var headerparts = headerpart.split('\r\n');
      for (var hearderpartindex = 0; hearderpartindex < headerparts.length; hearderpartindex++) {
        var headersubpart = headerparts[hearderpartindex];
        if (headersubpart.length === 0) {
          continue;
        } else {
          var hearderitems = headersubpart.split(';');
          if (hearderitems.length === 1 && hearderitems[0].indexOf('Content-Type') === 0) {
            parsedHeaders.contentType = hearderitems[0].split(':')[1].trim();
          } else {
            for (var itemindex = 0; itemindex < hearderitems.length; itemindex++) {
              if (hearderitems[itemindex].indexOf('=') === -1) {
                continue;
              } else {
                var itempair = hearderitems[itemindex].split('=');
                headers[itempair[0].trim()] = itempair[1].substring(1, itempair[1].length - 1);
              }
            }
          }
        }
      }
      parsedHeaders.headers = headers;
      return parsedHeaders;
    };

    var parseData = function (datapart, contentType) {
      var dataparts = datapart.split('\r\n');
      if (contentType && contentType.indexOf('image') >= 0) {
        return textToBlob(dataparts[0], contentType);
      } else {
        return dataparts[0];
      }
    };

    var textToBlob = function (text, contentType) {
      var byteCharacters = null;
      try {
        byteCharacters = atob(text);
      } catch (err) {
        return null;
      }
      var arrayBuffer = new ArrayBuffer(byteCharacters.length);
      var bytes = new Uint8Array(arrayBuffer);
      for (var index = 0; index < byteCharacters.length; index++) {
        bytes[index] = byteCharacters.charCodeAt(index);
      }
      var blob = new Blob([arrayBuffer], {type: contentType});
      return blob;
    };

    var boundaryText = contentTypePrased[1] || contentTypePrased[2];

    var isText = typeof (origbody) === 'string';
    var bodyText;

    if (isText) {
      bodyText = origbody;
    } else {
      var view = new Uint8Array(origbody);
      bodyText = String.fromCharCode.apply(null, view);
    }
    var parts = bodyText.split(new RegExp(boundaryText));
    var partsPairArray = [];

    // first part and last part are markers
    for (var partIndex = 1; partIndex < parts.length - 1; partIndex++) {
      var partPair = {};
      var part = parts[partIndex];
      var subparts = part.split('\r\n\r\n');
      var headerpart = subparts[0];
      var datapart = subparts[1];
      var parsedHeader = parseHeader(headerpart);
      partPair.headers = parsedHeader.headers;
      partPair.data = parseData(datapart, parsedHeader.contentType);
      partsPairArray.push(partPair);
    }

    return partsPairArray;
  };

  /**
   * helper function to build endpoint key to register options under.
   * The option contains shredder/unshredder needed for cache to shred/unshredd
   * responses. Ideally, we would like cache to be able to look up such
   * information in the framework based on scope, but there is no central place
   * for such information to reside, considering the facts that the framework
   * should work in service worker case. So the solution is for cache to
   * lookup the information based on request.url, thus we require
   * (1) responseProxy needs to register/unregister the options so during which
   *     time period cache is able to look up shredder/unshredder
   * (2) because of asynchronous nature, there could be multiple fetch events
   *     going on from the same url, while we don't want the registered 
   *     shredder/unshredder to grow out of control, we create a unique key
   *     so we can use the same key to unreigster the shredder/unshredder
   * (3) any cache operations needs to happen within defaultResponseProxy
   *     processRequest scope.
   * @method
   * @name buildEndpointKey
   * @memberof persistenceUtils
   * @static
   * @param {Request} request Request object to build the key for.
   * @return {string} A unique key that can by used to register option under.
   */
  function buildEndpointKey (request) {
    logger.log("Offline Persistence Toolkit persistenceUtils: buildEndpointKey() for Request with url: " + request.url);
    var endPointKeyObj = {
      url: request.url,
      id : Math.random().toString(36).replace(/[^a-z]+/g, '')
    };
    return JSON.stringify(endPointKeyObj);
  };
  
  function _cloneRequest(request) {
    return requestToJSON(request, {_noClone: true}).then(function (requestJson) {
      return requestFromJSON(requestJson).then(function (requestClone) {
        return requestClone;
      });
    });
  };
  
  function _cloneResponse(response, options) {
    options = options || {};
    return responseToJSON(response, {_noClone: true}).then(function (responseJson) {
      return responseFromJSON(responseJson).then(function (responseClone) {
        if (options.url != null &&
          options.url.length > 0 &&
          responseClone.headers.get('x-oracle-jscpt-response-url') == null) {
          responseClone.headers.set('x-oracle-jscpt-response-url', options.url);
        }
        return responseClone;
      });
    });
  };

  return {
    requestToJSON: requestToJSON,
    requestFromJSON: requestFromJSON,
    responseToJSON: responseToJSON,
    responseFromJSON: responseFromJSON,
    setResponsePayload: setResponsePayload,
    parseMultipartFormData: parseMultipartFormData,
    isCachedResponse: isCachedResponse,
    isGeneratedEtagResponse: isGeneratedEtagResponse,
    _isTextPayload: _isTextPayload,
    buildEndpointKey: buildEndpointKey,
    _cloneRequest: _cloneRequest,
    _cloneResponse: _cloneResponse,
  };
});


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('impl/PersistenceXMLHttpRequest',['../persistenceUtils', './logger'], function (persistenceUtils, logger) {
  'use strict';

  /**
   * PersistenceXMLHttpRequest is the XMLHttpRequest adapter for the persistence toolkit.
   * It works by replacing the browser's native XMLHttpRequest and then transforming all
   * XMLHttpRequest calls into Fetch API calls. There are a few limitations which are
   * introduced by the adapter:
   * 1. XMLHttpRequest.abort() will result in a no-op as it is not yet supported by the fetch API.
   * 2. XMLHttpRequest.timeout is not supported as it is not yet supported by the fetch API.
   * 3. XMLHttpRequest.upload is not supported as the fetch API does not support fetch progress yet.
   * @param {Function} browserXMLHttpRequest The browser's native XHR function
   */
  function PersistenceXMLHttpRequest(browserXMLHttpRequest) {
    var self = this;

    // These status codes are available on the native XMLHttpRequest
    Object.defineProperty(this, '_eventListeners', {
      value: [],
      writable: true
    });
    Object.defineProperty(this, '_browserXMLHttpRequest', {
      value: browserXMLHttpRequest
    });
    Object.defineProperty(this, '_method', {
      value: null,
      writable: true
    });
    Object.defineProperty(this, 'onreadystatechange', {
      value: null,
      enumerable: true,
      writable: true
    });
    Object.defineProperty(this, 'ontimeout', {
      value: null,
      enumerable: true,
      writable: true
    });
    Object.defineProperty(this, '_password', {
      value: null,
      writable: true
    });
    Object.defineProperty(this, '_readyState', {
      value: 0,
      writable: true
    });
    Object.defineProperty(this, 'readyState', {
      enumerable: true,
      get: function () {
        return self._readyState;
      }
    });
    Object.defineProperty(this, '_requestHeaders', {
      value: {},
      writable: true
    });
    Object.defineProperty(this, '_response', {
      value: '',
      writable: true
    });
    Object.defineProperty(this, 'response', {
      enumerable: true,
      get: function () {
        return self._response;
      }
    });
    Object.defineProperty(this, '_responseHeaders', {
      value: {},
      writable: true
    });
    Object.defineProperty(this, '_responseText', {
      value: null,
      writable: true
    });
    Object.defineProperty(this, 'responseText', {
      enumerable: true,
      get: function () {
        return self._responseText;
      }
    });
    Object.defineProperty(this, 'responseType', {
      value: '',
      enumerable: true,
      writable: true
    });
    Object.defineProperty(this, '_responseURL', {
      value: '',
      writable: true
    });
    Object.defineProperty(this, 'responseURL', {
      enumerable: true,
      get: function () {
        return self._responseURL;
      }
    });
    Object.defineProperty(this, '_responseXML', {
      value: null,
      writable: true
    });
    Object.defineProperty(this, 'responseXML', {
      enumerable: true,
      get: function () {
        return self._responseXML;
      }
    });
    Object.defineProperty(this, '_status', {
      value: 0,
      writable: true
    });
    Object.defineProperty(this, 'status', {
      enumerable: true,
      get: function () {
        return self._status;
      }
    });
    Object.defineProperty(this, '_statusText', {
      value: '',
      writable: true
    });
    Object.defineProperty(this, 'statusText', {
      enumerable: true,
      get: function () {
        return self._statusText;
      }
    });
    Object.defineProperty(this, 'timeout', {
      value: 0,
      enumerable: true
    });
    Object.defineProperty(this, 'upload', {
      value: null,
      enumerable: true
    });
    Object.defineProperty(this, '_url', {
      value: null,
      writable: true
    });
    Object.defineProperty(this, '_username', {
      value: null,
      writable: true
    });
    Object.defineProperty(this, 'withCredentials', {
      value: false,
      enumerable: true,
      writable: true
    });
  };

  Object.defineProperty(PersistenceXMLHttpRequest, 'UNSENT', {
    value: 0,
    enumerable: true
  });
  Object.defineProperty(PersistenceXMLHttpRequest, 'OPENED', {
    value: 1,
    enumerable: true
  });
  Object.defineProperty(PersistenceXMLHttpRequest, 'HEADERS_RECEIVED', {
    value: 2,
    enumerable: true
  });
  Object.defineProperty(PersistenceXMLHttpRequest, 'LOADING', {
    value: 3,
    enumerable: true
  });
  Object.defineProperty(PersistenceXMLHttpRequest, 'DONE', {
    value: 4,
    enumerable: true
  });

  /*
   Duplicates the behavior of native XMLHttpRequest's open function
   */
  PersistenceXMLHttpRequest.prototype.open = function (method, url, async, username, password) {
    logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: open() for method: ' + method + ", url: " + url);
    if (typeof async == 'boolean' &&
      !async) {
      throw new Error("InvalidAccessError: Failed to execute 'open' on 'XMLHttpRequest': Synchronous requests are disabled on the XHR Adapter");
    }
    this._method = method;
    this._url = url;
    // file: scheme should be a passthrough to the browser's XHR. Fetch API does not support
    // file so offline lib will not process it
    var isFile = _isFileRequest(url);

    if (isFile) {
      logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: open called for a File url');
      var self = this;
      this._passthroughXHR = new self._browserXMLHttpRequest();
      this._passthroughXHR.onreadystatechange = function () {
        var readyState = self._passthroughXHR.readyState;
        if (readyState == PersistenceXMLHttpRequest.DONE) {
          self._status = self._passthroughXHR.status;
          self._statusText = self._passthroughXHR.statusText;
          self._response = self._passthroughXHR.response;
          self._responseHeaders = self._passthroughXHR.responseHeaders;
          self._responseType = self._passthroughXHR.responseType;
          if (self._responseType == null ||
            self._responseType == '' ||
            self._responseType == 'text') {
            self._responseText = self._passthroughXHR.responseText;
          }
          self._responseURL = self._passthroughXHR.responseURL;
          if (self._responseType == null ||
            self._responseType == '' ||
            self._responseType == 'document') {
            self._responseXML = self._passthroughXHR.responseXML;
          }
        }
        _readyStateChange(self, self._passthroughXHR.readyState);
      }
      this._passthroughXHR.open(method, url, async, username, password);
    } else {
      this._passthroughXHR = null;
    }


    this._username = username;
    this._password = password;
    this._responseText = null;
    this._responseXML = null;
    this._requestHeaders = {};
    _readyStateChange(this, PersistenceXMLHttpRequest.OPENED);
  };

  /*
   Duplicates the behavior of native XMLHttpRequest's setRequestHeader function
   */
  PersistenceXMLHttpRequest.prototype.setRequestHeader = function (header, value) {
    logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: setRequestHeader() with header: ' + header + ' ,value: ' + value);
    _verifyState(this);

    var oldValue = this._requestHeaders[header];
    this._requestHeaders[header] = (oldValue) ?
      oldValue += ',' + value :
      value;
  };

  /*
   Duplicates the behavior of native XMLHttpRequest's send function
   */
  PersistenceXMLHttpRequest.prototype.send = function (data) {
    logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: send()');
    if (this._passthroughXHR) {
      if (this.responseType != null) {
        this._passthroughXHR.responseType = this.responseType;
      }
      this._passthroughXHR.send(data);
    } else {
      _verifyState(this);
      _readyStateChange(this, PersistenceXMLHttpRequest.OPENED);

      var requestInit = _getRequestInit(this, data);
      var request = new Request(this._url, requestInit);
      var self = this;
      fetch(request).then(function (response) {
        _processResponse(self, request, response);
      }, function (error) {
        logger.error(error);
      });
      this.dispatchEvent(new PersistenceXMLHttpRequestEvent('loadstart', false, false, this));
    }
  };

  /*
   Duplicates the behavior of native XMLHttpRequest's abort function
   */
  PersistenceXMLHttpRequest.prototype.abort = function () {
    logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: abort() is not supported by the XHR Adapter');
  };

  /*
   Duplicates the behavior of native XMLHttpRequest's getResponseHeader function
   */
  PersistenceXMLHttpRequest.prototype.getResponseHeader = function (header) {
    logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: getResponseHeader() for header: ' + header);
    if (this._readyState < PersistenceXMLHttpRequest.HEADERS_RECEIVED) {
      return null;
    }

    header = header.toLowerCase();

    for (var responseHeader in this._responseHeaders) {
      if (responseHeader.toLowerCase() == header.toLowerCase()) {
        return this._responseHeaders[responseHeader];
      }
    }

    return null;
  };

  /*
   Duplicates the behavior of native XMLHttpRequest's getAllResponseHeaders function
   */
  PersistenceXMLHttpRequest.prototype.getAllResponseHeaders = function () {
    logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: getAllResponseHeaders()');
    var self = this;

    if (this._readyState < PersistenceXMLHttpRequest.HEADERS_RECEIVED) {
      return '';
    }

    var responseHeaders = '';
    function appendResponseHeader(responseHeader) {
      responseHeaders += responseHeader + ': ' + self._responseHeaders[responseHeader] + '\r\n';
    }
    Object.keys(this._responseHeaders).forEach(appendResponseHeader);

    return responseHeaders;
  };

  /*
   Duplicates the behavior of native XMLHttpRequest's overrideMimeType function
   */
  PersistenceXMLHttpRequest.prototype.overrideMimeType = function (mimeType) {
    logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: overrideMimeType() for mimeType: ' + mimeType);
    if (typeof mimeType === 'string') {
      this._forceMimeType = mimeType.toLowerCase();
    }
  };

  PersistenceXMLHttpRequest.prototype.addEventListener = function (eventType, listener) {
    logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: addEventListener() for event type: ' + eventType);
    this._eventListeners[eventType] = this._eventListeners[eventType] || [];
    this._eventListeners[eventType].push(listener);
  };

  PersistenceXMLHttpRequest.prototype.removeEventListener = function (eventType, listener) {
    logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: removeEventListener() for event type: ' + eventType);
    var listeners = this._eventListeners[eventType] || [];
    var i;
    var listenersCount = listeners.length;
    for (i = 0; i < listenersCount; i++) {
      if (listeners[i] == listener) {
        return listeners.splice(i, 1);
      }
    }
  };

  PersistenceXMLHttpRequest.prototype.dispatchEvent = function (event) {
    logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: dispatchEvent() for event type: ' + event.type);
    var self = this;
    var type = event.type;
    var listeners = this._eventListeners[type] || [];
    listeners.forEach(function (listener) {
      if (typeof listener == 'function') {
        listener.call(self, event);
      } else {
        listener.handleEvent(event);
      }
    });

    return !!event.defaultPrevented;
  };

  function _readyStateChange(self, state) {
    self._readyState = state;

    if (typeof self.onreadystatechange == 'function') {
      self.onreadystatechange(new PersistenceXMLHttpRequestEvent('readystatechange'));
    }

    self.dispatchEvent(new PersistenceXMLHttpRequestEvent('readystatechange'));

    if (self._readyState == PersistenceXMLHttpRequest.DONE) {
      self.dispatchEvent(new PersistenceXMLHttpRequestEvent('load', false, false, self));
      self.dispatchEvent(new PersistenceXMLHttpRequestEvent('loadend', false, false, self));
    }
  };

  function _isFileRequest(url) {
    var absoluteUrlOrigin = url.toLowerCase();
    // simple thing first. If the url starts with http or https we are sure to skip
    if (absoluteUrlOrigin.indexOf('http:') === 0 || absoluteUrlOrigin.indexOf('https:') === 0) {
      return false;
    }
    if (absoluteUrlOrigin.indexOf('file:') === 0) {
      return true;
    }
    if (URL && URL.prototype) {
      absoluteUrlOrigin = (new URL(url, window.location.href)).origin;
       
      if (absoluteUrlOrigin != null && 
        absoluteUrlOrigin != "null" &&
        absoluteUrlOrigin.length > 0) {
        if (absoluteUrlOrigin.toLowerCase().indexOf('file:') === 0){
          return true;
        } else {
          return false;
        }
      }
    }
    
    // for browsers like IE who has not implemented URL instantiation yet
    var anchorElement = document.createElement('a');
    anchorElement.href = url;
    absoluteUrlOrigin = anchorElement.protocol;
    
    if(absoluteUrlOrigin && absoluteUrlOrigin.toLowerCase().indexOf('file:') === 0){
      return true;
    }
    return false;
  };
  function _getRequestHeaders(self) {
    var requestHeaders = new Headers();
    function appendRequestHeader(requestHeader) {
      requestHeaders.append(requestHeader, self._requestHeaders[requestHeader]);
    }
    Object.keys(self._requestHeaders).forEach(appendRequestHeader);

    return requestHeaders;
  };

  function _getRequestInit(self, data) {
    var requestHeaders = _getRequestHeaders(self);
    var credentials = self.withCredentials ? 'include' : 'same-origin';
    var requestInit = {
      method: self._method,
      headers: requestHeaders,
      mode: 'cors',
      cache: 'default',
      credentials: credentials
    };

    if (self._method !== 'GET' &&
      self._method !== 'HEAD' &&
      self._method !== 'DELETE') {
      requestInit.body = data;
    }
    return requestInit;
  };

  function _processResponse(self, request, response) {
    logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: Processing Response');
    _setResponseHeaders(self, response.headers);

    var contentType = response.headers.get('Content-Type');
    self._status = response.status;
    self._statusText = response.statusText;
    self._responseURL = request.url;

    if (!persistenceUtils._isTextPayload(response.headers) &&
      persistenceUtils.isCachedResponse(response)) {
      // above is temp workaround before we figure out when to invoke blob()
      // when to invoke arrayBuffer from the response object.
      // ideally we should get the information from request.responseType
      logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: Calling response.blob()');
      response.blob().then(function (blobData) {
        self._responseType = 'blob';
        self._response = blobData;
        _readyStateChange(self, PersistenceXMLHttpRequest.DONE);
        if (typeof self.onload == 'function') {
          self.onload();
        }
      }, function (blobErr) {
        logger.error(blobErr);
      });
    } else if (contentType &&
      contentType.indexOf('image/') !== -1) {
      logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: Calling response.arrayBuffer()');
      response.arrayBuffer().then(function (aBuffer) {
        self._responseType = 'arrayBuffer';
        self._response = aBuffer;
        _readyStateChange(self, PersistenceXMLHttpRequest.DONE);

        if (typeof self.onload == 'function') {
          self.onload();
        }
      }, function (arrayBufferError) {
        logger.error('error reading response as arrayBuffer!');
      });
    } else {
      response.text().then(function (data) {
        logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: Calling response.text()');
        self._responseType = '';
        self._response = data;
        self._responseText = data;
        _readyStateChange(self, PersistenceXMLHttpRequest.DONE);

        if (typeof self.onload == 'function') {
          self.onload();
        }
      }, function (err) {
        logger.error(err);
      });
    }
  };

  function _setResponseHeaders(self, headers) {
    self._responseHeaders = {};

    if (headers.entries) {
      var headerEntriesIter = headers.entries();
      var headerEntry;
      var headerName;
      var headerValue;

      do {
        headerEntry = headerEntriesIter.next();

        if (headerEntry['value']) {
          headerName = headerEntry['value'][0];
          headerValue = headerEntry['value'][1];

          if (self._forceMimeType &&
            headerName.toLowerCase() == 'content-type') {
            self._responseHeaders[headerName] = self._forceMimeType;
          } else {
            self._responseHeaders[headerName] = headerValue;
          }
        }
      } while (!headerEntry['done']);
    } else if (headers.forEach) {
      // Edge uses forEach
      headers.forEach(function (headerValue, headerName) {
        if (self._forceMimeType &&
          headerName.toLowerCase() == 'content-type') {
          self._responseHeaders[headerName] = self._forceMimeType;
        } else {
          self._responseHeaders[headerName] = headerValue;
        }
      })
    }

    _readyStateChange(self, PersistenceXMLHttpRequest.HEADERS_RECEIVED);
  };

  function _verifyState(self) {
    if (self._readyState !== PersistenceXMLHttpRequest.OPENED) {
      throw new Error('INVALID_STATE_ERR');
    }
  };

  function PersistenceXMLHttpRequestEvent(type, bubbles, cancelable, target) {
    Object.defineProperty(this, 'type', {
      value: type,
      enumerable: true
    });
    Object.defineProperty(this, 'bubbles', {
      value: bubbles,
      enumerable: true
    });
    Object.defineProperty(this, 'cancelable', {
      value: cancelable,
      enumerable: true
    });
    Object.defineProperty(this, 'target', {
      value: target,
      enumerable: true
    });
  };

  PersistenceXMLHttpRequestEvent.prototype.stopPropagation = function () {
    // This is not a DOM Event
  };

  PersistenceXMLHttpRequestEvent.prototype.preventDefault = function () {
    this['defaultPrevented'] = true;
  };

  return PersistenceXMLHttpRequest;
});

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persistenceStoreManager',['./impl/logger'], function (logger) {
  'use strict';
  
  /**
   * @export
   * @class PersistenceStoreManager
   * @classdesc PersistenceStoreManager used for offline support
   */

  var PersistenceStoreManager = function () {
    Object.defineProperty(this, '_stores', {
      value: {},
      writable: true
    });
    Object.defineProperty(this, '_factories', {
      value: {},
      writable: true
    });
    Object.defineProperty(this, '_DEFAULT_STORE_FACTORY_NAME', {
      value: '_defaultFactory',
      writable: false
    });
  }
  
  /**
   * Register a PersistenceStoreFactory to create PersistenceStore for the
   * specified name. Only one factory is allowed to be registered per name.
   * @method
   * @name registerStoreFactory
   * @memberof! PersistenceStorageManager
   * @instance
   * @param {string} name Name of the store the factory is registered under.
   *                      Must not be null / undefined.
   * @param {Object} factory The factory instance used to create
   *                         PersistenceStore. Must not be null / undefined.
   */
  PersistenceStoreManager.prototype.registerStoreFactory = function (name, factory) {
    if (!factory) {
      throw TypeError("A valid factory must be provided.");
    }
    
    if (!name) {
      throw TypeError("A valid name must be provided.");
    }

    var oldFactory = this._factories[name];
    if (oldFactory && oldFactory !== factory) {
      throw TypeError("A factory with the same name has already been registered.");
    }
    this._factories[name] = factory;
  };

  /**
   * Register the default PersistenceStoreFactory to create PersistenceStore
   * for stores that don't have any factory registered under.
   * @method
   * @instance
   * @name registerDefaultStoreFactory
   * @memberof! PersistenceStoreManager
   * @param {Object} factory The factory instance used to create
   *                         PersistenceStore
   */
  PersistenceStoreManager.prototype.registerDefaultStoreFactory = function (factory) {
    this.registerStoreFactory(this._DEFAULT_STORE_FACTORY_NAME, factory);
  };

  /**
   * Get hold of a store for a collection of records of the same type.
   * Returns a promise that resolves to an instance of PersistenceStore
   * that's ready to be used.
   * @method
   * @name openStore
   * @memberof! PersistenceStoreManager
   * @instance
   * @param {string} name Name of the store.
   * @param {{index: Array, version: string}|null} options Optional options to
   *                                               tune the store
   * <ul>
   * <li>options.index array of fields to create index for</li>
   * <li>options.version The version of this store to open, default to be '0'. </li>
   * </ul>
   * @return {Promise} Returns an instance of a PersistenceStore.
   */
  PersistenceStoreManager.prototype.openStore = function (name, options) {
    logger.log("Offline Persistence Toolkit PersistenceStoreManager: openStore() for name: " + name);
    var allVersions = this._stores[name];
    var version = (options && options.version) || '0';

    if (allVersions && allVersions[version]) {
      return Promise.resolve(allVersions[version]);
    }

    var factory = this._factories[name];
    if (!factory) {
      factory = this._factories[this._DEFAULT_STORE_FACTORY_NAME];
    }
    if (!factory) {
      return Promise.reject(new Error("no factory is registered to create the store."));
    }

    var self = this;
    logger.log("Offline Persistence Toolkit PersistenceStoreManager: Calling createPersistenceStore on factory");
    return factory.createPersistenceStore(name, options).then(function (store) {
      allVersions = allVersions || {};
      allVersions[version] = store;
      self._stores[name] = allVersions;
      return store;
    });
  };

  /**
   * Check whether a specific version of a specific store exists or not.
   * @method
   * @name hasStore
   * @memberof! PersistenceStoreManager
   * @instance
   * @param {string} name The name of the store to check for existence
   * @param {{version: string}|null} options Optional options when perform the
   *                                 check. 
   * <ul>
   * <li>options.version The version of this store to check. If not specified,
   *                     any version of the store counts.</li>
   * </ul>             
   * @return {boolean} Returns true if the store with the name exists of the 
   *                   specific version, false otherwise.
   */
  PersistenceStoreManager.prototype.hasStore = function (name, options) {
    var allVersions = this._stores[name];
    if (!allVersions) {
      return false;
    } else if (!options || !options.version) {
      return true;
    } else {
      return (allVersions[options.version] ? true : false);
    }
  };

  /**
   * Delete the specific store, including all the content stored in the store.
   * @method
   * @name deleteStore
   * @memberof! PersistenceStoreManager
   * @instance
   * @param {string} name The name of the store to delete
   * @param {{version: string}|null} options Optional options when perform the
   *                                 delete. 
   * <ul>
   * <li>options.version The version of this store to delete. If not specified,
   *                     all versions of the store will be deleted.</li>
   * </ul>  
   * @return {Promise} Returns a Promise which resolves to true if the store is
   *                   actually deleted, and false otherwise.
   */
  PersistenceStoreManager.prototype.deleteStore = function (name, options) {
    logger.log("Offline Persistence Toolkit PersistenceStoreManager: deleteStore() for name: " + name);
    var allversions = this._stores[name];
    if (!allversions) {
      return Promise.resolve(false);
    } else {
      var version = options && options.version;
      if (version) {
        var store = allversions[version];
        if (!store) {
          return Promise.resolve(false);
        } else {
          logger.log("Offline Persistence Toolkit PersistenceStoreManager: Calling delete on store");
          return store.delete().then(function () {
            delete allversions[version];
            return true;
          });
        }
      } else {
        var mapcallback = function (origObject) {
          return function (version) {
            var value = origObject[version];
            return value.delete();
          };
        };
        var promises = Object.keys(allversions).map(mapcallback(allversions), this);
        var self = this;
        return Promise.all(promises).then(function () {
          delete self._stores[name];
          return true;
        });
      }
    }
  };

  return new PersistenceStoreManager();
});
/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('impl/defaultCacheHandler',['../persistenceUtils', '../persistenceStoreManager', './logger'],
  function (persistenceUtils, persistenceStoreManager, logger) {
  'use strict';

  /**
   * defaultCacheHandler module.
   * This serves as a bridge between {@link OfflineCache} and
   * {@link PersistenceStore}. It contains utility methods to convert Request
   * / Response into/from the structure that's suitable to put into the
   * persistence store.
   * @module defaultCacheHandler
   */

  /**
   * @class DefaultCacheHandler
   * @classdesc DefaultCacheHandler constructor
   * @constructor
   */
  function DefaultCacheHandler() {
    Object.defineProperty(this, '_endpointToOptionsMap', {
      value: {},
      writable: true
    });
  }

  /**
   * Utility method that constructs data out from the request/response pair
   * that can be persisted into our storage. For request/response from the
   * scope that has shredder/unshredder configured, we will only save the
   * shredded response, thus the response persisted in offline cache will be
   * body-less. The body will be pulled out from shredded store as needed.
   * @method
   * @name constructRequestResponseCacheData
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {Request} request The request object to construct data out from.
   * @param {Response} response The response object to contruct data out from
   * @return {Promise} returns a Promise that resolves to JS object out from
   *                           the request/response pair that can be persisted
   *                           into our storage.
   */
  DefaultCacheHandler.prototype.constructRequestResponseCacheData = function (request, response) {
    var self = this;
    var dataField = {};
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: constructRequestResponseCacheData()");
    return persistenceUtils.requestToJSON(request).then(function(requestJSONData){
      dataField.requestData = requestJSONData;
      // cache the body-less response if shredder/unshreder is configured
      // for this request. cache the full response otherwise.
      var excludeBody = self._excludeBody(request);
      return persistenceUtils.responseToJSON(response, {excludeBody: excludeBody});
    }).then(function (responseJSONData) {
      dataField.responseData = responseJSONData;
      return {
        key: self._constructCacheKey(request, response),
        metadata: self.constructMetadata(request),
        value: dataField
      };
    });
  };

  /**
   * Utility method that uses the configured JSON processor to shred response
   * payload and constructs shredded data into structure that can be persisted
   * into storage for later.
   * @method
   * @name constructShreddedData
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {Response} response The response object whose payload is used to
   *                            contruct shredded data out from.
   * @param {Object} options Options where shredder is retrieved from.
   * @return {Promise} returns a Promise that resolves to undefined if there is
   *                           no need to persist shredded data. This happens
   *                           when no json processor is provided. It resolves
   *                           to an array of data that needs to be stored. Each
   *                           item has the structure of
   *                           {storename: [{key, metadata, value}]}.
   */
  DefaultCacheHandler.prototype.constructShreddedData = function (request, response) {
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: constructShreddedData()");
    var shredder = this._getShredder(request);

    if (!shredder) {
      return Promise.resolve();
    }

    return  shredder(response).then(function (shreddedObjArray) {
      var shreddedData = shreddedObjArray.map(_convertShreddedData);
      return Promise.resolve(shreddedData);
    });
  };

  DefaultCacheHandler.prototype.shredResponse = function (request, response) {
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: shredResponse()");
    var shredder = this._getShredder(request);

    if (!shredder) {
      return Promise.resolve();
    }

    return shredder(response);
  };

  DefaultCacheHandler.prototype.cacheShreddedData = function(shreddedObjArray) {
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: cacheShreddedData()");
    var shreddedData = shreddedObjArray.map(_convertShreddedData);
    return _updateShreddedDataStore(shreddedData);
  };

  // helper function to convert array where each element of format
  // into array where each
  //
  function _updateShreddedDataStore(shreddedData) {
    var promises = shreddedData.map(function (element) {
      var storeName = Object.keys(element)[0];
      var storeData = element[storeName];
      if (!storeData || !storeData.length) {
        return Promise.resolve();
      }
      return _updateShreddedDataForStore(storeName, storeData);
    });
    return Promise.all(promises);
  };

  function _updateShreddedDataForStore(storeName, storeData) {
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: Updating store with shredded data");
    return  persistenceStoreManager.openStore(storeName).then(function (store) {
      return store.upsertAll(storeData);
    });
  };

  // helper function to convert entry of format
  // {}
  // into format
  function _convertShreddedData (entry) {
    var storeName = entry.name;
    var resourceIdentifierValue = entry.resourceIdentifier;
    var ids = entry.keys;
    var shreddedDataArray = [];
    var currentTime = (new Date()).toUTCString();
    for (var i = 0; i < ids.length; i++) {
      var data = {
        key: ids[i],
        metadata: {
          lastUpdated: currentTime,
          resourceIdentifier: resourceIdentifierValue,
        },
        value: entry.data[i]
      };
      shreddedDataArray.push(data);
    }
    var convertedEntry = {};
    convertedEntry[storeName] = shreddedDataArray;
    return convertedEntry;
  };

  /**
   * Utility method that constructs a unique cache entry key for the
   * request/response pair to be persisted into our storage.
   * @method
   * @name _constructCacheKey
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {Request} request The request object from which to generate cache
   *                          entry key.
   * @param {Response} response The response object from which to generate cache
   *                          entry key.
   * @return {String} returns a string that can be used as a key to persist
   *                          this request into the storage.
   */
  DefaultCacheHandler.prototype._constructCacheKey = function (request, response) {
    var key = request.url + request.method;
    if (response) {
      var headers = response.headers;
      if (headers) {
        var varyValue = headers.get('vary');
        if (varyValue) {
          if (varyValue === '*') {
            // * vary value means every request is absolutely unique.
            key += (new Date()).getTime();
          } else {
            var requestHeaders = request.headers;
            var varyFields = varyValue.split(',');
            for (var index = 0; index < varyFields.length; index++) {
              var varyField = varyFields[index];
              var varyValue = requestHeaders ? requestHeaders.get(varyField) : 'undefined';
              key += varyField + '=' + varyValue;
            }
          }
        }
      }
    }
    return key;
  };

  /**
   * Utility method that constructs metadata for the request to be used
   * to be persisted into our storage.
   * @method
   * @name constructMetadata
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {Request} request The request object to construct metadata for.
   * @return {String} returns a JS object that can be used as metadata to
   *                          persist this request into the storage.
   */
  DefaultCacheHandler.prototype.constructMetadata = function (request) {
    var currentTime = (new Date()).getTime();
    var metadata = {
      url:  request.url,
      method: request.method,
      created: currentTime,
      lastupdated: currentTime
    };
    return metadata;
  };

  /**
   * Utility method that constructs a Response object out from the persisted
   * data.
   * @method
   * @name constructResponse
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {Object} data The persisted response data from storage.
   * @return {Promise} returns a Promise that resolves to a Response object
   *                           out from the persisted data.
   */
  DefaultCacheHandler.prototype.constructResponse = function (data) {
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: constructResponse()");
    return  persistenceUtils.responseFromJSON(data).then(function (response) {
      if (!persistenceUtils.isCachedResponse(response)) {
        // this means the cached response data does not contain the header
        // 'x-oracle-jscpt-cache-expiration-date'. We still to add it with
        // empty value then to denote this is a cached Response
        response.headers.set('x-oracle-jscpt-cache-expiration-date', '');
      }
      return Promise.resolve(response);
    });
  };

  /**
   * Utility method that constructs search criteria in Mango-db style based on
   * the provided match options.
   * @method
   * @name constructSearchCriteria
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {Request} request The request object based on which to generate
   *                          search criteria.
   * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control generating search criteria.
   * <ul>
   * <li>options.ignoreSearch A Boolean that specifies whether to ignore
   *                          the query string in the url.  For example,
   *                          if set to true the ?value=bar part of
   *                          http://foo.com/?value=bar would be ignored
   *                          when performing a match. It defaults to false.</li>
   * <li>options.ignoreMethod A Boolean that, when set to true, prevents
   *                          matching operations from validating the
   *                          Request http method (normally only GET and
   *                          HEAD are allowed.) It defaults to false.</li>
   * <li>options.ignoreVary A Boolean that when set to true tells the
   *                          matching operation not to perform VARY header
   *                          matching — i.e. if the URL matches you will get
   *                          a match regardless of whether the Response
   *                          object has a VARY header. It defaults to false.</li>
   * </ul>
   * @return {Promise} returns a Promise that resolves to Mango-db style search
   *                           expressions to query out cached request/response.
   */
  DefaultCacheHandler.prototype.constructSearchCriteria = function (request, options) {
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: constructSearchCriteria()");
    var ignoreSearch = false;
    if (options && options.ignoreSearch !== undefined) {
      ignoreSearch = options.ignoreSearch;
    }

    var ignoreMethod = false;
    if (options && options.ignoreMethod !== undefined) {
      ignoreMethod = options.ignoreMethod;
    }

    var selectorField;
    var searchURL;

    var searchStartIndex = request.url.indexOf('?');
    if (searchStartIndex >= 0) {
      searchURL = request.url.substring(0, searchStartIndex);
    } else {
      searchURL = request.url;
    }

    if (ignoreSearch) {
      selectorField = {
        'metadata.url': {
          '$regex': '^' + escapeRegExp(searchURL) + '(\\?|$)'
        }
      };
    } else {
      selectorField = {
        'metadata.url' : request.url
      }
    }

    if (!ignoreMethod) {
      selectorField['metadata.method'] = request.method;
    }

    var searchCriteria = {
      selector: selectorField,
      sort: [{'metadata.created' : 'asc'}]
    };

    return searchCriteria;
  };

  /**
   * Register options (jsonProcessor, including shredder and unshredder) under
   * an endpoint key. This is to facilitate how response is cached. For response
   * to scope that has shredder/unshredder, the response body will be persisted
   * in the shredded store, cache enty will only contain the bodyless response.
   * For responses that don't have corresponding jsonProcessor, the full response
   * body will be cached.
   * @method
   * @name registerEndpointOptions
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {object} endpointKey The object that contains the request url to
   *                 look up shredding/unshredding options. An object is used
   *                 as key so we can unregister the endpoint when a request
   *                 is finished processing.
   * @param {{jsonProcessor: object}} processor jsonProcessor associated with
   *                                  the endpointKey.
   */
  DefaultCacheHandler.prototype.registerEndpointOptions = function (endpointKey, options) {
    if (!endpointKey) {
      throw new Error({message: 'a valid endpointKey must be provided.'});
    }

    if (this._endpointToOptionsMap[endpointKey]) {
      throw new Error({message: 'endpointKey can only be registered once.'});
    }

    this._endpointToOptionsMap[endpointKey] = options;
  };

  DefaultCacheHandler.prototype.unregisterEndpointOptions = function (endpointKey) {
    if (!endpointKey) {
      throw new Error({message: 'a valid endpointKey must be provided.'});
    }
    delete this._endpointToOptionsMap[endpointKey];
  };

  DefaultCacheHandler.prototype._excludeBody = function (request) {
     return (this._getShredder(request) !== null);
  };

  DefaultCacheHandler.prototype._getShredder = function (request) {
    var jsonProcessor = this._getJsonProcessor(request);
    return jsonProcessor ? jsonProcessor.shredder : null;
  };

  DefaultCacheHandler.prototype._getUnshredder = function (request) {
    var jsonProcessor = this._getJsonProcessor(request);
    return jsonProcessor ? jsonProcessor.unshredder : null;
  };

  DefaultCacheHandler.prototype._getJsonProcessor = function (request) {
    var allKeys = Object.keys(this._endpointToOptionsMap);
    for (var index = 0; index < allKeys.length; index++) {
      var key = allKeys[index];
      if (request.url === JSON.parse(key).url) {
        var option = this._endpointToOptionsMap[key];
        if (option && option.jsonProcessor &&
            option.jsonProcessor.shredder &&
            option.jsonProcessor.unshredder) {
          return option.jsonProcessor;
        } else {
          return null;
        }
      }
    }
    return null;
  };

  /**
   * Utility method that fill the body-less response with data queried from
   * shredded data stores.
   * @method
   * @name fillResponseBodyWithShreddedData
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {Request} request The request of the request/response pair.
   * @param {Response} response The bodyless response of the request/response pair.
   * @return {Promise} returns a Promise that resolves to the response whose body
   *                   is filled with content from shredded store.
   */
  DefaultCacheHandler.prototype.fillResponseBodyWithShreddedData = function (request, bodyAbstract, response) {
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: fillResponseBodyWithShreddedData()");
    if (request.url != null &&
      request.url.length > 0 &&
      response.headers.get('x-oracle-jscpt-response-url') == null) {
      response.headers.set('x-oracle-jscpt-response-url', request.url);
    }
    var unshredder = this._getUnshredder(request);
    var shredder = this._getShredder(request);
    if (!unshredder || !shredder || !response || !bodyAbstract || !bodyAbstract.length) {
      return Promise.resolve(response);
    }

    var promises = bodyAbstract.map(function (element) {
      return _fillStoreValue(element);
    });

    return Promise.all(promises).then(function (results) {
      return unshredder(results, response);
    });
  };

  function _fillStoreValue(storeEntry) {
    var storeName = storeEntry.name;

    return  persistenceStoreManager.openStore(storeName).then(function (store) {
      if (storeEntry.keys && storeEntry.keys.length) {
        if (storeEntry.keys.length === 1) {
          return store.findByKey(storeEntry.keys[0]);
        } else {
          var transformedKeys = storeEntry.keys.map(function (keyValue) {
            return {key: keyValue};
          });
          var findExpression = {
            selector: {
              $or: transformedKeys
            }
          };
          return store.find(findExpression);
        }
      }
      return Promise.resolve([]);
    }).then(function (results) {
      if (!Array.isArray(results)) {
        results = [results];
      }
      storeEntry.data = results;
      return Promise.resolve(storeEntry);
    });
  };

  var escapeRegExp = function(str) {
    return String(str).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  };

  return new DefaultCacheHandler();
});

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('impl/PersistenceSyncManager',['require', '../persistenceUtils', '../persistenceStoreManager', './defaultCacheHandler', './logger'],
  function (require, persistenceUtils, persistenceStoreManager, cacheHandler, logger) {
    'use strict';

    function PersistenceSyncManager(isOnline, browserFetch, cache) {
      Object.defineProperty(this, '_eventListeners', {
        value: [],
        writable: true
      });
      Object.defineProperty(this, '_isOnline', {
        value: isOnline
      });
      Object.defineProperty(this, '_browserFetch', {
        value: browserFetch
      });
      Object.defineProperty(this, '_cache', {
        value: cache
      });
    };

    PersistenceSyncManager.prototype.addEventListener = function (type, listener, scope) {
      logger.log("Offline Persistence Toolkit PersistenceSyncManager: addEventListener() for type: " + type + " and scope: " + scope);
      this._eventListeners.push({type: type.toLowerCase(), listener: listener, scope: scope});
    };
    
    PersistenceSyncManager.prototype.removeEventListener = function (type, listener, scope) {
      logger.log("Offline Persistence Toolkit PersistenceSyncManager: removeEventListener() for type: " + type + " and scope: " + scope);
      this._eventListeners = this._eventListeners.filter(function (eventListener) {
        if (type.toLowerCase() == eventListener.type &&
          listener == eventListener.listener &&
          scope == eventListener.scope) {
          return false;
        }
        return true;
      });
    };

    PersistenceSyncManager.prototype.getSyncLog = function () {
      logger.log("Offline Persistence Toolkit PersistenceSyncManager: getSyncLog()");
      // if we're already reading the sync log then just return the promise
      if (!this._readingSyncLog)
      {
        this._readingSyncLog = _getSyncLog(this);
      }
      return this._readingSyncLog;
    };

    function _getSyncLog(persistenceSyncManager) {
      var self = persistenceSyncManager;
      return _findSyncLogRecords().then(function (results) {
        return _generateSyncLog(results);
      }).then(function (syncLog) {
        self._readingSyncLog = null;
        return syncLog;
      });
    };

    PersistenceSyncManager.prototype.insertRequest = function (request, options) {
      logger.log("Offline Persistence Toolkit PersistenceSyncManager: insertRequest() for Request with url: " + request.url);
      var localVars = {};
      return _getSyncLogStorage().then(function (store) {
        localVars.store = store;
        return persistenceUtils.requestToJSON(request, {'_noClone': true});
      }).then(function (requestData) {
        localVars.requestData = requestData;
        localVars.metadata = cacheHandler.constructMetadata(request);
        localVars.requestId = localVars.metadata.created.toString();
        return localVars.store.upsert(localVars.requestId, localVars.metadata, localVars.requestData);
      }).then(function () {
        if (options != null) {
          var undoRedoDataArray = options.undoRedoDataArray;

          if (undoRedoDataArray != null) {
            return _getRedoUndoStorage().then(function (redoUndoStore) {
              var storeUndoRedoData = function (i) {
                if (i < undoRedoDataArray.length &&
                  undoRedoDataArray[i] != null) {
                  return redoUndoStore.upsert(localVars.requestId, localVars.metadata, undoRedoDataArray[i]).then(function () {
                    return storeUndoRedoData(++i);
                  });
                } else {
                  return Promise.resolve();
                }
              };
              return storeUndoRedoData(0);
            });
          } else {
            return Promise.resolve();
          }
        } else {
          return Promise.resolve();
        }
      });
    };

    PersistenceSyncManager.prototype.removeRequest = function (requestId) {
      logger.log("Offline Persistence Toolkit PersistenceSyncManager: removeRequest() for Request with requestId: " + requestId);
      var self = this;
      var localVars = {};
      return _getSyncLogStorage().then(function (store) {
        localVars.store = store;
        return _getRequestFromSyncLog(self, requestId);
      }).then(function (request) {
        localVars.request = request;
        return localVars.store.removeByKey(requestId);
      }).then(function () {
        // Also remove the redo/undo data
        return _getRedoUndoStorage();
      }).then(function (redoUndoStore) {
        return redoUndoStore.removeByKey(requestId);
      }).then(function () {
        return localVars.request;
      });
    };
    
    PersistenceSyncManager.prototype.updateRequest = function (requestId, request) {
      logger.log("Offline Persistence Toolkit PersistenceSyncManager: updateRequest() for Request with requestId: " + requestId);
      return Promise.all([_getSyncLogStorage(), 
        persistenceUtils.requestToJSON(request)]
        ).then(function (values) {
        var store = values[0];
        var requestData = values[1];
        var metadata = cacheHandler.constructMetadata(request);
        return store.upsert(requestId, metadata, requestData);
      });
    };

    PersistenceSyncManager.prototype.sync = function (options) {
      logger.log("Offline Persistence Toolkit PersistenceSyncManager: sync()");
      this._options = options || {};
      var self = this;
      if (this._syncing) {
        return Promise.reject('Cannot start sync while sync is in progress');
      }
      this._syncing = true;
      var syncPromise = new Promise(function (resolve, reject) {
        self.getSyncLog().then(function (value) {
          if (self._isOnline()) {
            logger.log("Offline Persistence Toolkit PersistenceSyncManager: Processing sync, is online");
            var requestId, request, requestClone, statusCode;

            var replayRequestArray = function (requests) {
              if (requests.length == 0) {
                logger.log("Offline Persistence Toolkit PersistenceSyncManager: Sync finished, no requests in sync log");
                resolve();
              }
              if (requests.length > 0) {
                logger.log("Offline Persistence Toolkit PersistenceSyncManager: Processing sync, # of request in sync log: " + requests.length);
                requestId = requests[0].requestId;
                request = requests[0].request;
                // we need to clone the request before sending it off so we
                // can return it later in case of error
                requestClone = request.clone();
                logger.log("Offline Persistence Toolkit PersistenceSyncManager: Dispatching beforeSyncRequest event");
                _dispatchEvent(self, 'beforeSyncRequest', {'requestId': requestId,
                  'request': requestClone.clone()},
                  request.url).then(function (eventResult) {
                  if (_checkStopSync(eventResult)) {
                    logger.log("Offline Persistence Toolkit PersistenceSyncManager: Sync stopped by beforeSyncRequest event listener");
                    resolve();
                    return;
                  }
                  eventResult = eventResult || {};
                  if (eventResult.action !== 'skip') {
                    if (eventResult.action === 'replay') {
                      logger.log("Offline Persistence Toolkit PersistenceSyncManager: Replay request from beforeSyncRequest event listener");
                      // replay the provided request instead of what's in the sync log
                      request = eventResult.request;
                    }                  
                    requestClone = request.clone();
                    _checkURL(self, request).then(function() {
                      logger.log("Offline Persistence Toolkit PersistenceSyncManager: Replaying request with url: " + request.url);
                      self._browserFetch(request).then(function (response) {
                        statusCode = response.status;

                        // fail for HTTP error codes 4xx and 5xx
                        if (statusCode >= 400) {
                          reject({'error': response.statusText,
                            'requestId': requestId,
                            'request': requestClone.clone(),
                            'response': response.clone()});
                          return;
                        }
                        persistenceUtils._cloneResponse(response, {url: request.url}).then(function(responseClone) {
                          logger.log("Offline Persistence Toolkit PersistenceSyncManager: Dispatching syncRequest event");
                          _dispatchEvent(self, 'syncRequest', {'requestId': requestId,
                            'request': requestClone.clone(),
                            'response': responseClone.clone()},
                            request.url).then(function (dispatchEventResult) {
                            if (!_checkStopSync(dispatchEventResult)) {
                              logger.log("Offline Persistence Toolkit PersistenceSyncManager: Removing replayed request");
                              self.removeRequest(requestId).then(function () {
                                requests.shift();
                                if (request.method == 'GET' ||
                                  request.method == 'HEAD') {
                                  persistenceUtils._cloneResponse(responseClone, {url: request.url}).then(function(responseClone) {
                                    self._cache().put(request, responseClone).then(function () {
                                      logger.log("Offline Persistence Toolkit PersistenceSyncManager: Replayed request/response is cached.");
                                      replayRequestArray(requests);
                                    });
                                  });
                                } else {
                                  replayRequestArray(requests);
                                }
                              }, function (err) {
                                reject({'error': err, 'requestId': requestId, 'request': requestClone.clone()});
                              });
                            } else {
                              resolve();
                            }
                          });
                        });
                      }, function (err) {
                        reject({'error': err, 'requestId': requestId, 'request': requestClone.clone()});
                      });
                    }, function(err) {
                      if (err === false) {
                        // timeout
                        var init = {'status': 504, 'statusText': 'Preflight OPTIONS request timed out'};
                        reject({'error': 'Preflight OPTIONS request timed out', 'requestId': requestId, 'request': requestClone.clone(), 'response': new Response(null, init)});
                      } else {
                        reject({'error': err, 'requestId': requestId, 'request': requestClone.clone()});
                      }
                    });
                  } else {
                    // skipping, just remove the request and carry on
                    logger.log("Offline Persistence Toolkit PersistenceSyncManager: Removing skipped request");
                    self.removeRequest(requestId).then(function () {
                      requests.shift();
                      replayRequestArray(requests);
                    }, function (err) {
                      reject({'error': err, 'requestId': requestId, 'request': requestClone.clone()});
                    });
                  }
                });
              }
            };
            value = _reorderSyncLog(value);
            replayRequestArray(value);
          } else {
            resolve();
          }
        });
      });
      return syncPromise.then(function (value) {
        self._syncing = false;
        self._pingedURLs = null;
        return value;
      }, function (err) {
        self._syncing = false;
        self._pingedURLs = null;
        return Promise.reject(err);
      });
    };
    
    function _checkURL(persistenceSyncManager, request) {
      // send an OPTIONS request to the server to see if it's reachable
      var self = persistenceSyncManager;
      var preflightOptionsRequestOption = self._options['preflightOptionsRequest'];
      var preflightOptionsRequestTimeoutOption = self._options['preflightOptionsRequestTimeout'];
      if (request.url != null &&
        preflightOptionsRequestOption != 'disabled' &&
        request.url.match(preflightOptionsRequestOption) != null) {
        logger.log("Offline Persistence Toolkit PersistenceSyncManager: Checking URL based on preflightOptionsRequest");
        if (!self._pingedURLs) {
          self._pingedURLs = [];
        } else if (self._pingedURLs.indexOf(request.url) >= 0) {
          return Promise.resolve(true);
        }
        self._preflightOptionsRequestId = new Date().getTime();
        return new Promise(function(preflightOptionsRequestId) {
          return function(resolve, reject) {
            self._repliedOptionsRequest = false;
            var preflightOptionsRequest = new Request(request.url, {method: 'OPTIONS'});
            var requestTimeout = 60000;
            if(preflightOptionsRequestTimeoutOption != null) {
              requestTimeout = preflightOptionsRequestTimeoutOption;
            }
            setTimeout(function() 
            {
              if (!self._repliedOptionsRequest &&
                self._preflightOptionsRequestId == preflightOptionsRequestId) {
                reject(false);
              }
            }, requestTimeout);
            self._browserFetch(preflightOptionsRequest).then(function(result) {
              self._repliedOptionsRequest = true;
              if (!self._pingedURLs) {
                self._pingedURLs = [];
              }
              self._pingedURLs.push(request.url);
              resolve(true);
            }, function(err) {
              // if an error returns then the server may be rejecting OPTIONS
              // requests. That's ok.
              self._repliedOptionsRequest = true;
              resolve(true);
            });
          }
        }(self._preflightOptionsRequestId));
      }
      return Promise.resolve(true);
    };
    
    function _checkStopSync(syncEventResult) {
      syncEventResult = syncEventResult || {};
      return syncEventResult.action === 'stop';
    };

    function _reorderSyncLog(requestObjArray) {
      // re-order the sync log so that the
      // GET requests are at the end
      if (requestObjArray &&
        requestObjArray.length > 0) {
        var reorderedRequestObjArray = [];
        var i;
        var request;

        for (i = 0; i < requestObjArray.length; i++) {
          request = requestObjArray[i].request;

          if (request.method != 'GET' &&
            request.method != 'HEAD') {
            reorderedRequestObjArray.push(requestObjArray[i]);
          }
        }
        for (i = 0; i < requestObjArray.length; i++) {
          request = requestObjArray[i].request;

          if (request.method == 'GET' ||
            request.method == 'HEAD') {
            reorderedRequestObjArray.push(requestObjArray[i]);
          }
        }
        return reorderedRequestObjArray;
      }
      return requestObjArray;
    };

    function _createSyncLogEntry(requestId, request) {
      return {'requestId': requestId,
        'request': request,
        'undo': function () {
          return _undoLocalStore(requestId);
        },
        'redo': function () {
          return _redoLocalStore(requestId);
        }};
    };

    function _findSyncLogRecords() {
      return _getSyncLogStorage().then(function (store) {
        return store.find(_getSyncLogFindExpression());
      });
    };

    function _generateSyncLog(results) {
      var syncLogArray = [];
      var requestId;
      var requestData;
      var getRequestArray = function (requestDataArray) {
        if (!requestDataArray ||
          requestDataArray.length == 0) {
          return Promise.resolve(syncLogArray);
        } else {
          requestId = requestDataArray[0].metadata.created.toString();
          requestData = requestDataArray[0].value;
          return persistenceUtils.requestFromJSON(requestData).then(function (request) {
            syncLogArray.push(_createSyncLogEntry(requestId, request));
            requestDataArray.shift();
            return getRequestArray(requestDataArray);
          });
        }
      };
      return getRequestArray(results);
    };

    function _getRequestFromSyncLog(persistenceSyncManager, requestId) {
      var self = persistenceSyncManager;
      return self.getSyncLog().then(function (syncLog) {
        var i;
        var request;
        var syncLogCount = syncLog.length;
        for (i = 0; i < syncLogCount; i++) {
          if (syncLog[i].requestId === requestId) {
            request = syncLog[i].request;
            return request;
          }
        }
      });
    };

    function _getSyncLogFindExpression() {
      var findExpression = {};
      var fieldsExpression = [];
      var sortExpression = [];
      sortExpression.push('metadata.created');
      findExpression.sort = sortExpression;
      fieldsExpression.push('metadata.created');
      fieldsExpression.push('value');
      findExpression.fields = fieldsExpression;
      var selectorExpression = {};
      var existsExpression = {};
      existsExpression['$exists'] = true;
      selectorExpression['metadata.created'] = existsExpression;
      findExpression.selector = selectorExpression;

      return findExpression;
    };

    function _redoLocalStore(requestId) {
      return _getRedoUndoStorage().then(function (redoUndoStore) {
        return redoUndoStore.findByKey(requestId);
      }).then(function (redoUndoDataArray) {
        if (redoUndoDataArray != null) {
          return _updateLocalStore(redoUndoDataArray, false).then(function () {
            return true;
          });
        } else {
          return false;
        }
      });
    };

    function _undoLocalStore(requestId) {
      return _getRedoUndoStorage().then(function (redoUndoStore) {
        return redoUndoStore.findByKey(requestId);
      }).then(function (redoUndoDataArray) {
        if (redoUndoDataArray != null) {
          return _updateLocalStore(redoUndoDataArray, true).then(function () {
            return true;
          });
        } else {
          return false;
        }
      });
    };

    function _updateLocalStore(redoUndoDataArray, isUndo) {
      var j, dataArray = [], operation, storeName, undoRedoData, undoRedoDataCount;
      if (!(redoUndoDataArray instanceof Array)) {
        redoUndoDataArray = [redoUndoDataArray];
      }
      var redoUndoDataArrayCount = redoUndoDataArray.length;
      var applyUndoRedoItem = function (i) {
        if (i < redoUndoDataArrayCount) {
          storeName = redoUndoDataArray[i].storeName;
          operation = redoUndoDataArray[i].operation;
          undoRedoData = redoUndoDataArray[i].undoRedoData;

          if (operation == 'upsert' || 
            (operation == 'remove' && isUndo)) {
            // bunch up the upserts so we can do them in bulk using upsertAll
            dataArray = [];
            undoRedoDataCount = undoRedoData.length;
            for (j = 0; j < undoRedoDataCount; j++) {
              if (isUndo) {
                dataArray.push({'key': undoRedoData[j].key, 'value': undoRedoData[j].undo});
              } else {
                dataArray.push({'key': undoRedoData[j].key, 'value': undoRedoData[j].redo});
              }
            }

            return persistenceStoreManager.openStore(storeName).then(function (store) {
              if (dataArray.length == 1 &&
                dataArray[0].value == null &&
                dataArray[0].key != null) {
                // we need to remove since the actual operation was an insert. That's
                // why the undo is null
                return store.removeByKey(dataArray[0].key).then(function () {
                  return applyUndoRedoItem(++i);
                });
              } else {
                return store.upsertAll(dataArray).then(function () {
                  return applyUndoRedoItem(++i);
                });
              }
            });
          } else if (operation == 'remove') {
            // remove will only contain one entry in the undoRedoData array
            return persistenceStoreManager.openStore(storeName).then(function (store) {
              return store.removeByKey(undoRedoData[0].key).then(function () {
                return applyUndoRedoItem(++i);
              });
            });
          }
        } else {
          return Promise.resolve();
        }
      };
      return applyUndoRedoItem(0);
    };

    function _dispatchEvent(persistenceSyncManager, eventType, event, url) {
      var self = persistenceSyncManager;
      var filteredEventListeners = self._eventListeners.filter(_eventFilterFunction(eventType, url));
      return _callEventListener(event, filteredEventListeners);
    };

    function _eventFilterFunction(eventType, url) {
      return function (eventListener) {
        return eventType.toLowerCase() == eventListener.type &&
          (url != null && url.match(eventListener.scope) ||
            url == null || eventListener.scope == null);
      };
    };
    
    function _callEventListener(event, eventListeners) {
      if (eventListeners.length > 0) {
        return eventListeners[0].listener(event).then(function (result) {
          if (result != null) {
            return Promise.resolve(result);
          }
          if (eventListeners.length > 1) {
            return _callEventListener(eventListeners.slice(1));
          }
        });
      }
      return Promise.resolve(null);
    };

    function _getStorage(name) {
      var options = {index: ['metadata.created']};
      return persistenceStoreManager.openStore(name, options);
    };

    function _getSyncLogStorage() {
      return _getStorage('syncLog');
    };

    function _getRedoUndoStorage() {
      return _getStorage('redoUndoLog');
    };

    return PersistenceSyncManager;
  });


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('impl/OfflineCache',["./defaultCacheHandler", "./logger"], function (cacheHandler, logger) {
  'use strict';

  /**
   * OfflineCache module.
   * Persistence Toolkit implementation of the standard
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Cache|Cache API}.
   * In additional to functionalities provided by the standard Cache API, this
   * OfflineCache also interacts with shredding methods for more fine-grain
   * caching.
   * @module OfflineCache
   */

  /**
   * @export
   * @class OfflineCache
   * @classdesc  Persistence Toolkit implementation of the standard
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Cache|Cache API}.
   * @constructor
   * @param {String} name name of the cache
   * @param {Object} persistencestore instance for cache storage
   */
  function OfflineCache (name, persistencestore) {
    if (!name) {
      throw TypeError("A name must be provided to create an OfflineCache!");
    }
    if (!persistencestore) {
      throw TypeError("A persistence store must be provided to create an OfflineCache!");
    }

    this._name = name;
    this._store = persistencestore;
  }

  /**
   * Retrieve the name of the cache object.
   * @method
   * @name getName
   * @memberof! OfflineCache
   * @instance
   * @return {string} Returns the name of the cache object.
   */
  OfflineCache.prototype.getName = function () {
    return this._name;
  };

  /**
   * Takes a request, retrieves it and adds the resulting response
   * object to the cache.
   * @method
   * @name add
   * @memberof! OfflineCache
   * @instance
   * @param {Request} request The request object to fetch for response
   *                          and be cached.
   * @return {Promise} returns a Promise that is resolved when the reponse
   *                           is retrieved and request/response is cached.
   */
  OfflineCache.prototype.add = function (request) {
    logger.log("Offline Persistence Toolkit OfflineCache: add()");
    var self = this;
    return fetch(request).then(function (response) {
      var responseClone = response.clone();
      return self.put(request, response).then(function(){
        Promise.resolve(responseClone);
      })
    });
  };

  /**
   * Bulk operation of add.
   * @method
   * @name upsertAll
   * @memberof! OfflineCache
   * @param {Array} requests An array of Request
   * @return {Promise} Returns a promise when all the requests in the array are handled.
   */
  OfflineCache.prototype.addAll = function (requests) {
    logger.log("Offline Persistence Toolkit OfflineCache: addAll()");
    var promises = requests.map(this.add, this);
    return Promise.all(promises);
  };


  /**
   * Find the first response in this Cache object that match the request with the options.
   * @method
   * @name match
   * @memberof! OfflineCache
   * @instance
   * @param {Request} a request object to match against
   * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
   * <ul>
   * <li>options.ignoreSearch A Boolean that specifies whether to ignore
   *                          the query string in the url.  For example,
   *                          if set to true the ?value=bar part of
   *                          http://foo.com/?value=bar would be ignored
   *                          when performing a match. It defaults to false.</li>
   * <li>options.ignoreMethod A Boolean that, when set to true, prevents
   *                          matching operations from validating the
   *                          Request http method (normally only GET and
   *                          HEAD are allowed.) It defaults to false.</li>
   * <li>options.ignoreVary A Boolean that when set to true tells the
   *                          matching operation not to perform VARY header
   *                          matching — i.e. if the URL matches you will get
   *                          a match regardless of whether the Response
   *                          object has a VARY header. It defaults to false.</li>
   * </ul>
   * @return {Promise} Returns a Promise that resolves to the Response associated with the
   *                           first matching request in the Cache object. If no match is
   *                           found, the Promise resolves to undefined.
   */
  OfflineCache.prototype.match = function (request, options) {
    logger.log("Offline Persistence Toolkit OfflineCache: match() for Request with url: " + request.url);
    var self = this;

    var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
    var ignoreVary = (options && options.ignoreVary);

    return self._store.find(searchCriteria).then(function (cacheEntries) {
      var matchEntry = _applyVaryForSingleMatch(ignoreVary, request, cacheEntries);
      return _cacheEntryToResponse(matchEntry);
    }).then(function (results) {
      if (results) {
        var bodyAbstract = results[0];
        var response = results[1];
        return cacheHandler.fillResponseBodyWithShreddedData(request, bodyAbstract, response);
      } else {
        return Promise.resolve();
      }
    });
  };

  /**
   * Finds all responses whose request matches the passed-in request with the specified
   * options.
   * @method
   * @name matchAll
   * @memberof! OfflineCache
   * @instance
   * @param {Request} request The request object to match against
   * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
   * <ul>
   * <li>options.ignoreSearch A Boolean that specifies whether to ignore
   *                          the query string in the url.  For example,
   *                          if set to true the ?value=bar part of
   *                          http://foo.com/?value=bar would be ignored
   *                          when performing a match. It defaults to false.</li>
   * <li>options.ignoreMethod A Boolean that, when set to true, prevents
   *                          matching operations from validating the
   *                          Request http method (normally only GET and
   *                          HEAD are allowed.) It defaults to false.</li>
   * <li>options.ignoreVary A Boolean that when set to true tells the
   *                          matching operation not to perform VARY header
   *                          matching — i.e. if the URL matches you will get
   *                          a match regardless of whether the Response
   *                          object has a VARY header. It defaults to false.</li>
   * </ul>
   * @return {Promise } Returns a Promise that resolves to an array of response objects
   *                            whose request matches the passed-in request.
   */
  OfflineCache.prototype.matchAll = function (request, options) {
    logger.log("Offline Persistence Toolkit OfflineCache: matchAll() for Request with url: " + request.url);
    var self = this;

    var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
    var ignoreVary = (options && options.ignoreVary);

    return  self._store.find(searchCriteria).then(function (cacheEntries) {
      var responseDataArray = _applyVaryForAllMatches(ignoreVary, request, cacheEntries);
      return _cacheEntriesToResponses(responseDataArray);
    }).then(function (responseArray) {
      if (responseArray && responseArray.length) {
        var promises = responseArray.map(function (responseElement) {
          var bodyAbstract = responseElement[0];
          var response = responseElement[1];
          return cacheHandler.fillResponseBodyWithShreddedData(request, bodyAbstract, response);
        });
        return Promise.all(promises);
      } else {
        return Promise.resolve([]);
      }
    });
  };

  /**
   * Perform vary header check and return the first match among all the
   * cacheEntries.
   * @param {boolean} ignoreVary Whether to ignore vary or not.
   * @param {Object} request Request to check against.
   * @param {Array} cacheEntries An array of cache entry to be checked among.
   * @returns {Object} The first match entry.
   */
  function _applyVaryForSingleMatch (ignoreVary, request, cacheEntries) {
    if (cacheEntries && cacheEntries.length) {
      for (var index = 0; index < cacheEntries.length; index++) {
        var cacheEntry = cacheEntries[index];
        if (_applyVaryCheck(ignoreVary, request, cacheEntry)) {
          return cacheEntry.responseData;
        }
      }
    }
    return null;
  };

  /**
   * Perform vary header check and return the all entries that match the request
   * on vary.
   * @param {boolean} ignoreVary Whether to ignore vary or not.
   * @param {Object} request Request to check against.
   * @param {Array} cacheEntries An array of cache entry to be checked among.
   * @returns {Array} The array of the cache entries that match request on vary
   *                  header.
   */
  function _applyVaryForAllMatches (ignoreVary, request, cacheEntries) {
    var responseDataArray = [];
    if (cacheEntries && cacheEntries.length) {
      var filteredArray = cacheEntries.filter(_filterByVary(ignoreVary, request));
      responseDataArray = filteredArray.map(function (entry) {return entry.responseData;});
    }
    return responseDataArray;
  };

  // callback function supplied to Array.filter() method to filter entries
  // based on vary header.
  function _filterByVary (ignoreVary, request, propertyName) {
    return function (cacheValue) {
      var propertyValue;
      if (propertyName) {
        propertyValue = cacheValue[propertyName];
      } else {
        propertyValue = cacheValue;
      }
      return _applyVaryCheck(ignoreVary, request, propertyValue);
    };
  };

  // perform the vary header check.
  function _applyVaryCheck (ignoreVary, request, cacheValue) {
    if (ignoreVary) {
      return true;
    }

    if (!cacheValue || !request) {
      return false;
    }

    var cacheRequestHeaders = cacheValue.requestData.headers;
    var cacheResponseHeaders = cacheValue.responseData.headers;
    var requestHeaders = request.headers;
    var varyValue = cacheResponseHeaders.vary;

    logger.log("Offline Persistence Toolkit OfflineCache: Processing HTTP Vary header");
    if (!varyValue) {
      return true;
    } else if (varyValue.trim() === '*') {
      return false;
    } else {
      var varyArray = varyValue.split(',');
      for (var index = 0; index < varyArray.length; index++) {
        var varyHeaderName = varyArray[index].toLowerCase();
        var requestVaryHeaderValue = requestHeaders.get(varyHeaderName);
        var cachedRequestVaryHeaderValue = cacheRequestHeaders[varyHeaderName];
        logger.log("Offline Persistence Toolkit OfflineCache: HTTP Vary header name: " + varyHeaderName);
        logger.log("Offline Persistence Toolkit OfflineCache: Request HTTP Vary header value: " + requestVaryHeaderValue);
        logger.log("Offline Persistence Toolkit OfflineCache: Cached HTTP Vary header value: " + cachedRequestVaryHeaderValue);
        if ((!cachedRequestVaryHeaderValue && !requestVaryHeaderValue) ||
            (cachedRequestVaryHeaderValue && requestVaryHeaderValue &&
             cachedRequestVaryHeaderValue === requestVaryHeaderValue)) {
          continue;
        } else {
          return false;
        }
      }
    }

    return true;
  };

  /**
   * Convert the cached response data to Response object, it handles undefined
   * response data as well.
   * @param {Object} responseData Cached response data.
   * @returns {Promise} A promise that resolves to de-serialized Response object
   *                    from responseData. The promise is resolved to undefined
   *                    if responseData is undefined.
   */
  function _cacheEntryToResponse (responseData) {
    if (responseData) {
      logger.log("Offline Persistence Toolkit OfflineCache: Converting cached entry to Response object");
      var promises = [];
      var bodyAbstract = responseData.bodyAbstract;
      if (bodyAbstract) {
        promises.push(Promise.resolve(JSON.parse(bodyAbstract)));
        delete responseData.bodyAbstract;
      } else {
        promises.push(Promise.resolve());
      }
      promises.push(cacheHandler.constructResponse(responseData));
      return Promise.all(promises);
    } else {
      return Promise.resolve();
    }
  };

  function _cacheEntriesToResponses (responseDataArray) {
    if (!responseDataArray || !responseDataArray.length) {
      return Promise.resolve();
    } else {
      var promisesArray = responseDataArray.map(function (element) {
        return _cacheEntryToResponse(element);
      });
      return Promise.all(promisesArray);
    }
  };

  /**
   * Add the request/response pair into the cache.
   * @method
   * @name put
   * @memberof! OfflineCache
   * @instance
   * @param {Request} request Request object of the pair
   * @param {Response} response Response object of the pair
   * @return {Promise} Returns a promise when the request/response pair is cached.
   */
  OfflineCache.prototype.put = function (request, response) {
    logger.log("Offline Persistence Toolkit OfflineCache: put() for Request with url: " + request.url);
    var self = this;
    var promises = [];
    promises.push(cacheHandler.constructRequestResponseCacheData(request, response));
    promises.push(cacheHandler.shredResponse(request, response));

    return Promise.all(promises).then(function (results) {
      var requestResponsePair = results[0];
      var shreddedPayload = results[1];
      if (!shreddedPayload) {
        // this is the case where no shredder/unshredder is specified.
        return self._store.upsert(requestResponsePair.key,
                                  requestResponsePair.metadata,
                                  requestResponsePair.value);
      } else {
        var storePromises = [];
        requestResponsePair.value.responseData.bodyAbstract = _buildBodyAbstract(shreddedPayload);
        storePromises.push(self._store.upsert(requestResponsePair.key,
                                              requestResponsePair.metadata,
                                              requestResponsePair.value));
        storePromises.push(cacheHandler.cacheShreddedData(shreddedPayload));
        return Promise.all(storePromises);
      }
    });
  };

  function _buildBodyAbstract (shreddedPayload) {
    var bodyAbstract = shreddedPayload.map(function (element) {
      return {
        name: element.name,
        keys: element.keys,
        resourceType: element.resourceType
      };
    });
    return JSON.stringify(bodyAbstract);
  };

  /**
   * Delete the all the entries in the cache that matches the passed-in request with
   * the specified options.
   * @method
   * @name delete
   * @memberof! OfflineCache
   * @instance
   * @param {Request} request The request object to match against
   * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
   * <ul>
   * <li>options.ignoreSearch A Boolean that specifies whether to ignore
   *                          the query string in the url.  For example,
   *                          if set to true the ?value=bar part of
   *                          http://foo.com/?value=bar would be ignored
   *                          when performing a match. It defaults to false.</li>
   * <li>options.ignoreMethod A Boolean that, when set to true, prevents
   *                          matching operations from validating the
   *                          Request http method (normally only GET and
   *                          HEAD are allowed.) It defaults to false.</li>
   * <li>options.ignoreVary A Boolean that when set to true tells the
   *                          matching operation not to perform VARY header
   *                          matching — i.e. if the URL matches you will get
   *                          a match regardless of whether the Response
   *                          object has a VARY header. It defaults to false.</li>
   * </ul>
   * @return {Promse} Finds the Cache entry whose key is the request, and if found,
   *                  deletes the Cache entry and returns a Promise that resolves to
   *                  true. If no Cache entry is found, it returns a Promise that
   *                  resolves to false.
   */
  OfflineCache.prototype.delete = function (request, options) {
    if (request) {
      logger.log("Offline Persistence Toolkit OfflineCache: delete() for Request with url: " + request.url);
    } else {
      logger.log("Offline Persistence Toolkit OfflineCache: delete()");
    }
    var self = this;

    return self.keys(request, options).then(function (keysArray) {
      if (keysArray && keysArray.length) {
        var promisesArray = keysArray.map(self._store.removeByKey, self._store);
        return Promise.all(promisesArray);
      } else {
        return false;
      }
    }).then(function (result) {
      if (result && result.length) {
        return true;
      } else {
        return false;
      }
    });
  };

  /**
   * Retrieves all the keys in this cache.
   * @method
   * @name keys
   * @memberof! OfflineCache
   * @instance
   * @param {Request} request The request object to match against
   * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
   * <ul>
   * <li>options.ignoreSearch A Boolean that specifies whether to ignore
   *                          the query string in the url.  For example,
   *                          if set to true the ?value=bar part of
   *                          http://foo.com/?value=bar would be ignored
   *                          when performing a match. It defaults to false.</li>
   * <li>options.ignoreMethod A Boolean that, when set to true, prevents
   *                          matching operations from validating the
   *                          Request http method (normally only GET and
   *                          HEAD are allowed.) It defaults to false.</li>
   * <li>options.ignoreVary A Boolean that when set to true tells the
   *                          matching operation not to perform VARY header
   *                          matching — i.e. if the URL matches you will get
   *                          a match regardless of whether the Response
   *                          object has a VARY header. It defaults to false.</li>
   * </ul>
   * @return {Promise} Returns a promise that resolves to an array of Cache keys.
   */
  OfflineCache.prototype.keys = function (request, options) {
    if (request) {
      logger.log("Offline Persistence Toolkit OfflineCache: keys() for Request with url: " + request.url);
    } else {
      logger.log("Offline Persistence Toolkit OfflineCache: keys()");
    }
    var self = this;

    if (request) {
      // need to match with the passed-in request.
      var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
      searchCriteria.fields = ['key', 'value'];

      var ignoreVary = (options && options.ignoreVary);

      return self._store.find(searchCriteria).then(function (dataArray) {
        if (dataArray && dataArray.length) {
          var filteredEntries = dataArray.filter(_filterByVary(ignoreVary, request, 'value'));
          var keysArray = filteredEntries.map(function (entry) { return entry.key;});
          return keysArray;
        } else {
          return [];
        }
      });
    } else {
      // no passed-in request to match, so returns ALL requests objects in
      // the persistence store.
      return self._store.keys();
    }
  };

  /**
   * Checks if a match to this request with the specified options exist in the
   * cache or not. This is an optimization over match because we don't need to
   * query out the shredded data to fill the response body.
   * @method
   * @name hasMatch
   * @memberof! OfflineCache
   * @instance
   * @param {Request} request The request object to match against
   * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
   * <ul>
   * <li>options.ignoreSearch A Boolean that specifies whether to ignore
   *                          the query string in the url.  For example,
   *                          if set to true the ?value=bar part of
   *                          http://foo.com/?value=bar would be ignored
   *                          when performing a match. It defaults to false.</li>
   * <li>options.ignoreMethod A Boolean that, when set to true, prevents
   *                          matching operations from validating the
   *                          Request http method (normally only GET and
   *                          HEAD are allowed.) It defaults to false.</li>
   * <li>options.ignoreVary A Boolean that when set to true tells the
   *                          matching operation not to perform VARY header
   *                          matching — i.e. if the URL matches you will get
   *                          a match regardless of whether the Response
   *                          object has a VARY header. It defaults to false.</li>
   * </ul>
   * @return {Promise} Returns a promise that resolves to true if a match exist
   *                   while false otherwise.
   */
  OfflineCache.prototype.hasMatch = function (request, options) {
    logger.log("Offline Persistence Toolkit OfflineCache: hasMatch() for Request with url: " + request.url);
    var self = this;
    var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
    var ignoreVary = (options && options.ignoreVary);

    return self._store.find(searchCriteria).then(function (cacheEntries) {
      var matchEntry = _applyVaryForSingleMatch(ignoreVary, request, cacheEntries);
      return matchEntry !== null;
    });
  };

  return OfflineCache;
});
/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('impl/offlineCacheManager',['../persistenceStoreManager', './OfflineCache', './logger'],
  function (persistenceStoreManager, OfflineCache, logger) {
    'use strict';

    /**
     * OfflineCacheManager module.
     * Persistence Toolkit implementation of the standard
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage|
     *  CacheStorage API}.
     * This module is privately owned by {@link persistenceManager} for getting
     * hold of a cache instance. Multiple instances of {@link OfflinceCache}
     * is possible with different versions.
     * @module OfflineCacheManager
     */

    function OfflineCacheManager () {
      this._prefix = "offlineCaches-";
      // this is for fast lookup on cache name
      this._caches = {};
      // this is to persist the caches in insertion order.
      this._cachesArray = [];
    }

    /**
     * Creates or retrieves a cache with the specified name.
     * @method
     * @name open
     * @memberof! OfflineCacheManager
     * @instance
     * @param {string} cacheName Name of the cache.
     * @return {Promise} Returns a promise that resolves to the cache that is ready to
     *                           use for offline support.
     */
    OfflineCacheManager.prototype.open = function (cacheName) {
      logger.log("Offline Persistence Toolkit OfflineCacheManager: open() with name: " + cacheName);
      var self = this;

      var cache = self._caches[cacheName];
      if (cache) {
        return Promise.resolve(cache);
      } else {
        return persistenceStoreManager.openStore(self._prefix + cacheName).then(function (store) {
          cache = new OfflineCache(cacheName, store);
          self._caches[cacheName] = cache;
          self._cachesArray.push(cache);
          return cache;
        });
      }
    };

    /**
     * Find the response in all the caches managed by this OfflineCacheManager
     * that match the request with the options. Cache objects are searched by key
     * insertion order.
     * @method
     * @name match
     * @memberof! OfflineCacheManager
     * @instance
     * @param {Request} a request object to match against
     * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
     * <ul>
     * <li>options.ignoreSearch A Boolean that specifies whether to ignore
     *                          the query string in the url.  For example,
     *                          if set to true the ?value=bar part of
     *                          http://foo.com/?value=bar would be ignored
     *                          when performing a match. It defaults to false.</li>
     * <li>options.ignoreMethod A Boolean that, when set to true, prevents
     *                          matching operations from validating the
     *                          Request http method (normally only GET and
     *                          HEAD are allowed.) It defaults to false.</li>
     * <li>options.ignoreVary A Boolean that when set to true tells the
     *                          matching operation not to perform VARY header
     *                          matching — i.e. if the URL matches you will get
     *                          a match regardless of whether the Response
     *                          object has a VARY header. It defaults to false.</li>
     * </ul>
     * @return {Promise} Return a Promise that resolves to the first matching response.
     */
    OfflineCacheManager.prototype.match = function (request, options) {
      logger.log("Offline Persistence Toolkit OfflineCacheManager: match() for Request with url: " + request.url);
      var self = this;
      var getFirstMatch = function (cacheArray, currentIndex) {
        if (currentIndex === cacheArray.length) {
          // no match is found from all the caches, resolve to undefined.
          return Promise.resolve();
        } else {
          var currentCache = cacheArray[currentIndex];
          return currentCache.match(request, options).then(function (response) {
            if (response) {
              return response.clone();
            } else {
              return getFirstMatch(cacheArray, currentIndex + 1);
            }
          });
        }
      };
      return getFirstMatch(self._cachesArray, 0);
    };

    /**
     * Checks if cache with the specified name exists or not.
     * @method
     * @name has
     * @memberof! OfflineCacheManager
     * @instance
     * @param {string} cacheName Name of the cache to check for existence
     * @return {Promise} Returns a Promise that resolves to true if a Cache
     *                           object matches the cacheName.
     */
    OfflineCacheManager.prototype.has = function (cacheName) {
      logger.log("Offline Persistence Toolkit OfflineCacheManager: has() for name: " + cacheName);
      if (this._caches[cacheName]) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    };

    /**
     * Delete the cache with the specified name.
     * @method
     * @name delete
     * @memberof! OfflineCacheManager
     * @instance
     * @param {string} cacheName Name of the cache to delete
     * @return {Promise} Returns a Promise. If Cache object matching the cacheName is found
     *                   and deleted, the promise resolves to true, otherwise it resolves to
     *                   false.
     */
    OfflineCacheManager.prototype.delete = function (cacheName) {
      logger.log("Offline Persistence Toolkit OfflineCacheManager: delete() for name: " + cacheName);
      var self = this;
      var cache = self._caches[cacheName];
      if (cache) {
        return cache.delete().then(function () {
          self._cachesArray.splice(self._cachesArray.indexOf(cacheName), 1);
          delete self._caches[cacheName];
          return true;
        });
      } else {
        return Promise.resolve(false);
      }
    };

    /**
     * Returns an array of cache names managed by this OfflineCacheManager.
     * @method
     * @name keys
     * @memberof! OfflineCacheManager
     * @instance
     * @return {Promise} Returns a Promise that resolves to an array of the
     *                   OfflineCache names managed by this OfflineCacheManager.
     */
    OfflineCacheManager.prototype.keys = function () {
      logger.log("Offline Persistence Toolkit OfflineCacheManager: keys()");
      var keysArray = [];
      for (var i = 0; i < this._cachesArray.length; i++) {
        keysArray.push(this._cachesArray[i].getName());
      }
      return Promise.resolve(keysArray);
    };

    return new OfflineCacheManager();
  });
/**
 * Copyright (c) 2014-2016 GitHub, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.prototype
 */

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
		if (this._bodyFormData) {
		  return Promise.resolve(this._bodyFormData);
		} else {
		  return this.text().then(decode)
        }
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

define("impl/fetch", function(){});

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persistenceManager',['./impl/PersistenceXMLHttpRequest', './impl/PersistenceSyncManager', './impl/offlineCacheManager', './impl/logger', './impl/fetch'],
  function (PersistenceXMLHttpRequest, PersistenceSyncManager, offlineCacheManager, logger) {
    'use strict';

    /**
     * @export
     * @class PersistenceManager
     * @classdesc PersistenceManager used for offline support
     */
    function PersistenceManager() {
      Object.defineProperty(this, '_registrations', {
        value: [],
        writable: true
      });
      Object.defineProperty(this, '_eventListeners', {
        value: [],
        writable: true
      });
      Object.defineProperty(this, '_forceOffline', {
        value: false,
        writable: true
      });
      Object.defineProperty(this, '_isOffline', {
        value: false,
        writable: true
      });
      Object.defineProperty(this, '_cache', {
        value: null,
        writable: true
      });
      Object.defineProperty(this, '_persistenceSyncManager', {
        value: new PersistenceSyncManager(this.isOnline.bind(this), this.browserFetch.bind(this), this.getCache.bind(this))
      });
    };

    /**
     * @method
     * @name init
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @return {Promise} returns a Promise when resolved that this
     *                   PersistenceManager is fully initialized.
     */
    PersistenceManager.prototype.init = function () {
      _replaceBrowserApis(this);
      _addBrowserEventListeners(this);

      return _openOfflineCache(this);
    };

    /**
     * Force the PersistenceManager offline.
     * @method
     * @name forceOffline
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @param {boolean} offline If true, sets the PersistenceManager offline
     */
    PersistenceManager.prototype.forceOffline = function (offline) {
      logger.log("Offline Persistence Toolkit PersistenceManager: forceOffline is called with value: " + offline);
      this._forceOffline = offline;
    };

    /**
     * @method
     * @name getCache
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @return {OfflineCache} returns the cache store for the Persistence Framework. Implements the Cache API.
     */
    PersistenceManager.prototype.getCache = function () {
      return this._cache;
    };

    /**
     * Checks if online.
     * Returns true if the browser and PersistenceManager is online.
     * Returns false if the browser or PersistenceManager is offline.
     * 
     * Note: To determine if the browser is online, the function will use
     * navigator.onLine whose behavior is browser specific. If being used
     * in a hybrid mobile application, please install the Cordova plugin:
     * 
     * https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-network-information/
     * 
     * Installing the plugin will enable this function to return accurate
     * browser online status.
     * 
     * @method
     * @name isOnline
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @return {boolean} Returns true if online, false if not.
     */
    PersistenceManager.prototype.isOnline = function () {
      var online = navigator.onLine;

      if (navigator.network &&
        navigator.network.connection &&
        navigator.network.connection.type == Connection.NONE) {
        online = false;
        logger.log("Offline Persistence Toolkit PersistenceManager: Cordova network info plugin is returning online value: " + online);
      }
      return online && !this._isOffline && !this._forceOffline;
    };

    /**
     * Registers a URL for persistence
     * @method
     * @name register
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @param {{scope: string}=} options Options to control registration
     * <ul>
     * <li>options.scope The URI which should be persisted.</li>
     * </ul>
     * @return {Promise} Returns a Promise which resolves to a PersistenceRegistration object for the specified options.
     * If options is null, returns an array of all current PersistenceRegistration objects or null if there are none.
     */
    PersistenceManager.prototype.register = function (options) {
      options = options || {};
      var registration = new PersistenceRegistration(options['scope'], this);
      this._registrations.push(registration);

      return Promise.resolve(registration);
    };

    /**
     * Return the registration object for the URL
     * @method
     * @name getRegistration
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @param {string} url Url
     * @return {Promise} Returns a Promise which resolves to the
     * registration object for the URL or undefined.
     */
    PersistenceManager.prototype.getRegistration = function (url) {
      var i;
      var registration;
      var registrationCount = this._registrations.length;

      for (i = 0; i < registrationCount; i++) {
        registration = this._registrations[i];

        if (url.match(registration.scope)) {
          return Promise.resolve(registration);
        }
      }
      return Promise.resolve();
    };

    /**
     * Return an array of Registration objects
     * @method
     * @name getRegistrations
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @return {Promise} Returns a Promise which resolves to an array of
     * Registration objects.
     */
    PersistenceManager.prototype.getRegistrations = function () {
      return Promise.resolve(this._registrations.slice());
    };

    /**
     * Return the Sync Manager
     * @method
     * @name getSyncManager
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @return {PersistenceSyncManager} Returns the Sync Manager
     */
    PersistenceManager.prototype.getSyncManager = function () {
      return this._persistenceSyncManager;
    };

    /**
     * Call fetch without going through the persistence framework. This is the
     * unproxied browser provided fetch API.
     * @method
     * @name browserFetch
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @param {String|Request} request A USVString containing the direct URL of the
     * resource you want to fetch or a Request object.
     * @return {Promise} Resolves to the Response when complete
     */
    PersistenceManager.prototype.browserFetch = function (request) {
      logger.log("Offline Persistence Toolkit PersistenceManager: browserFetch() for Request with url: " + request.url);
      // only do special processing in browser context. In service worker context
      // just call regular fetch.
      if (_isBrowserContext()) {
        // store the last Request object on the PersistenceManager so that we
        // can detect if a fetch polyfill is causing a XHR request to our
        // XHR adapter
        Object.defineProperty(this, '_browserFetchRequest', {
          value: request,
          writable: true
        });
        var self = this;
        return new Promise(function (resolve, reject) {
          logger.log("Offline Persistence Toolkit PersistenceManager: Calling browser fetch function for Request with url: " + request.url);
          self._browserFetchFunc.call(window, request).then(function (response) {
            resolve(response);
          }, function (error) {
            reject(error);
          });
          self._browserFetchRequest = null;
        });
      } else {
        return fetch(request);
      }
    };

    function _addBrowserEventListeners(persistenceManager) {
      var self = persistenceManager;
      // add listeners for browser online
      // Don't do it for Service Workers
      if (_isBrowserContext() &&
        !self._addedBrowserEventListeners) {
        logger.log("Offline Persistence Toolkit PersistenceManager: Adding browser event listeners");
        window.addEventListener('offline', function (e) {
          self._isOffline = true;
        }, false);

        window.addEventListener('online', function (e) {
          self._isOffline = false;
        }, false);
        self._addedBrowserEventListeners = true;
      }
    };

    function _isBrowserContext() {
      return (typeof window != 'undefined') && (window != null);
    };

    function _dispatchEvent(persistenceManager, eventType, event) {
      var i;
      var j;
      var returnValue;
      var registration;
      var respondWithPromise = null;
      var registrations = persistenceManager._registrations;
      var registrationCount = registrations != null ? registrations.length : 0;
      var eventListenerCount;
      for (i = 0; i < registrationCount; i++) {
        registration = registrations[i];

        if (event.request.url.match(registration['scope']) != null) {
          eventListenerCount = registration._eventListeners.length;

          for (j = 0; j < eventListenerCount; j++) {
            if (registration._eventListeners[j]['type'] == eventType) {
              if (eventType == 'fetch') {
                if (respondWithPromise === null &&
                  event._setPromiseCallbacks instanceof Function) {
                  respondWithPromise = new Promise(function (resolve, reject) {
                    event._setPromiseCallbacks(resolve, reject);
                  });
                }
                logger.log("Offline Persistence Toolkit PersistenceManager: Calling fetch event listener");
                registration._eventListeners[j]['listener'](event);
              } else {
                logger.log("Offline Persistence Toolkit PersistenceManager: Calling event listener");
                returnValue = registration._eventListeners[j]['listener'](event);

                if (returnValue === false) {
                  // event cancelled
                  return false;
                }
              }
            }
          }

          if (respondWithPromise != null) {
            return respondWithPromise;
          }
        }
      }
      return true;
    };

    function _openOfflineCache(persistenceManager) {
      var self = persistenceManager;

      return offlineCacheManager.open('systemCache').then(function (cache) {
        self._cache = cache;
        return Promise.resolve();
      });
    };

    function _replaceBrowserApis(persistenceManager) {
      var self = persistenceManager;
      // save off the browser fetch and XHR only in browser context.
      // also add listeners for browser online
      // Don't do it for Service Workers
      if (_isBrowserContext() &&
        !self._browserFetchFunc &&
        !self._browserXMLHttpRequest) {
        // browser context
        // _browserFetchFunc is always non-null because we polyfill it
        logger.log("Offline Persistence Toolkit PersistenceManager: Replacing browser APIs");
        Object.defineProperty(self, '_browserFetchFunc', {
          value: window.fetch,
          writable: false
        });
        Object.defineProperty(self, '_browserXMLHttpRequest', {
          value: window.XMLHttpRequest,
          writable: false
        });
        // replace the browser fetch and XHR with our own
        window['fetch'] = persistenceFetch(persistenceManager);
        window['XMLHttpRequest'] = function () {
          if (self._browserFetchRequest != null) {
            // this means we got invoked by a fetch polyfill. That means
            // we can just use the browser XHR since the browser doesn't
            // support the Fetch API anyway
            return new self._browserXMLHttpRequest();
          }
          return new PersistenceXMLHttpRequest(self._browserXMLHttpRequest);
        };
      }
    };

    function _unregister(persistenceManager, registration) {
      var self = persistenceManager
      var regIdx = self._registrations.indexOf(registration);

      if (regIdx > -1) {
        self._registrations.splice(regIdx, 1);
        return true;
      }
      return false;
    };

    /**
     * @export
     * @class PersistenceRegistration
     * @classdesc PersistenceRegistration constructor
     * @constructor
     * @param {string} scope The URI which should be persisted
     * @param {Object} persistenceManager
     */
    function PersistenceRegistration(scope, persistenceManager) {
      Object.defineProperty(this, 'scope', {
        value: scope,
        enumerable: true
      });
      Object.defineProperty(this, '_persistenceManager', {
        value: persistenceManager
      });
      Object.defineProperty(this, '_eventListeners', {
        value: [],
        writable: true
      });
    }
    ;

    /**
     * @export
     * @instance
     * @memberof! PersistenceRegistration
     * @desc The scope for the registration. This is the unique identifier for each registration.
     *
     * @type {string}
     */

    /**
     * Add an event listener.
     * @method
     * @name addEventListener
     * @memberof! PersistenceRegistration
     * @export
     * @instance
     * @param {string} type A string representing the event type to listen for. Supported value is "fetch"
     * which will trigger the function with a FetchEvent once a fetch occurs.
     * @param {Function} listener The object that receives a notification when an event of the specified type occurs
     */
    PersistenceRegistration.prototype.addEventListener = function (type, listener) {
      this._eventListeners.push({'type': type.toLowerCase(),
                                'listener': listener});
    };

    /**
     * Unregister the registration. Will finish any ongoing operations before it is unregistered.
     * @method
     * @name unregister
     * @memberof! PersistenceRegistration
     * @export
     * @instance
     * @return {Promise} Promise resolves with a boolean indicating whether the scope has been unregistered or not
     */
    PersistenceRegistration.prototype.unregister = function () {
      return Promise.resolve(_unregister(this._persistenceManager, this));
    };

    // this is the persistence version of fetch which we replace the browser
    // version with. We only do this in browser context, not in service worker context.
    // The replacement is done in persistenceManager.
    function persistenceFetch(persistenceManager) {
      function PersistenceFetchEvent(request) {
        Object.defineProperty(this, 'isReload', {
          value: false,
          enumerable: true
        });
        // clientId is not applicable to a non-ServiceWorker context
        Object.defineProperty(this, 'clientId', {
          value: null,
          enumerable: true
        });
        // client is not applicable to a non-ServiceWorker context
        Object.defineProperty(this, 'client', {
          value: null,
          enumerable: true
        });
        Object.defineProperty(this, 'request', {
          value: request,
          enumerable: true
        });
        Object.defineProperty(this, '_resolveCallback', {
          value: null,
          writable: true
        });
        Object.defineProperty(this, '_rejectCallback', {
          value: null,
          writable: true
        });
      };

      PersistenceFetchEvent.prototype.respondWith = function (any) {
        var self = this;
        if (any instanceof Promise) {
          any.then(function (response) {
            self._resolveCallback(response);
          }, function (err) {
            self._rejectCallback(err);
          });
        } else if (typeof (any) == 'function') {
          var response = any();
          self._resolveCallback(response);
        }
      };

      PersistenceFetchEvent.prototype._setPromiseCallbacks = function (resolveCallback, rejectCallback) {
        this._resolveCallback = resolveCallback;
        this._rejectCallback = rejectCallback;
      };

      return function (input, init) {
        var request;
        // input can either be a Request object or something
        // which can be passed to the Request constructor
        if (Request.prototype.isPrototypeOf(input) && !init) {
          request = input
        } else {
          request = new Request(input, init)
        }

        // check if it's an endpoint we care about
        return persistenceManager.getRegistration(request.url).then(function (registration) {
          if (registration != null) {
            // create a Fetch Event
            var fetchEvent = new PersistenceFetchEvent(request);
            var promise = _dispatchEvent(persistenceManager, 'fetch', fetchEvent);
            // if a promise is returned than a fetch listener(s) handled the event
            if (promise != null &&
              promise instanceof Promise) {
              return promise;
            }
          }
          // if the endpoint is not registered or the Fetch Event Listener
          // did not return a Promise then just do a regular browser fetch
          return persistenceManager.browserFetch(request);
        });
      };
    };

    return new PersistenceManager();
    /**
     * @export
     * @class PersistenceSyncManager
     * @classdesc The PersistenceSyncManager should be used support synchronization
     * capabilities for requests which were made when offline. The PersistenceSyncManager
     * instance can be obtained via the persistenceManager.getSyncManager() API. The
     * PersistenceSyncManager supports operations such as retrieving the sync log,
     * invoking the sync() API to replay the requests which were made while offline,
     * inserting/removing requests from the sync log, adding event listeners for
     * sync operations, and performing undo/redo operations for the shredded local
     * data which were made as a result of those requests.
     * @param {Function} isOnline The persistenceManager.isOnline() function
     * @param {Function} browserFetch The persistenceManager.browserFetch() function
     * @param {Function} cache The persistenceManager.getCache() function
     */
    
    /**
     * Add an event listener. The listener should always return a Promise which should resolve to either null or an object with the action field.
     * <br>
     * <p>
     * For the beforeSyncRequest event, the resolved value of the Promise returned by the listener should be one of the items given below:
     * <p>
     * <table>
     * <thead>
     * <tr>
     * <th>Resolved Value</th>
     * <th>Behavior</th>
     * </tr>
     * </thead>
     * <tbody>
     * <tr>
     * <td>null</td>
     * <td>Continue replaying the request</td>
     * </tr>
     * <tr>
     * <td>{action: 'replay', request: Request obj}</td>
     * <td>Replay the provided Request obj</td>
     * </tr>
     * <tr>
     * <td>{action: 'skip'}</td>
     * <td>Skip replaying the request</td>
     * </tr>
     * <tr>
     * <td>{action: 'stop'}</td>
     * <td>Stop the sync process</td>
     * </tr>
     * <tr>
     * <td>{action: 'continue'}</td>
     * <td>Continue replaying the request</td>
     * </tr>
     * </tbody>
     * </table>
     * <br>
     * For the syncRequest event, the resolved value of the Promise returned by the listener should be one of the items given below:
     * <p>
     * <table>
     * <thead>
     * <tr>
     * <th>Resolved Value</th>
     * <th>Behavior</th>
     * </tr>
     * </thead>
     * <tbody>
     * <tr>
     * <td>null</td>
     * <td>Continue processing the sync log</td>
     * </tr>
     * <tr>
     * <td>{action: 'stop'}</td>
     * <td>Stop the sync process</td>
     * </tr>
     * <tr>
     * <td>{action: 'continue'}</td>
     * <td>Continue processing the sync log</td>
     * </tr>
     * </tbody>
     * </table>
     * <br>
     * @method
     * @name addEventListener
     * @memberof! PersistenceSyncManager
     * @export
     * @instance
     * @param {string} type A string representing the event type to listen for.
     * @param {Function} listener The function that receives a notification when an event of the specified type occurs. The function should return a Promise.
     * @param {string} scope optional scope of the Requests. If not specified, will trigger for all Requests.
     */
    
    /**
     * Remove the event listener.
     * @method
     * @name removeEventListener
     * @memberof! PersistenceSyncManager
     * @export
     * @instance
     * @param {string} type A string representing the event type to listen for.
     * @param {Function} listener The function that receives a notification when an event of the specified type occurs. The function should return a Promise.
     * @param {string} scope optional scope of the Requests. If not specified, will trigger for all Requests.
     */
    
    /**
     * Returns a Promise which resolves to all the Requests in the Sync Log returned as an Array sorted by
     * the created date of the Request
     * @method
     * @name getSyncLog
     * @memberof! PersistenceSyncManager
     * @export
     * @instance
     * @return {Promise} Returns a Promise which resolves to all the Requests in the Sync Log returned as an Array of compound objects
     * which have the following structure:
     * <ul>
     * <li>requestId An internally generated unique id for the Request.</li>
     * <li>request The Request object.</li>
     * <li>undo The undo function which returns a Promise to undo the changes
     * made to the local shredded data store for the Request. The Promise will
     * resolve to true if there is undo data and false if there wasn't any.</li>
     * <li>redo The redo function which returns a Promise to redo the changes
     * made to the local shredded data store for the Request. The Promise will
     * resolve to true if there is redo data and false if there wasn't any.</li>
     * </ul>
     */
    
    /**
     * Insert a Request into the Sync Log. The position in the Sync Log the Request will be inserted at
     * is determined by the Request created date.
     * @method
     * @name insertRequest
     * @memberof! PersistenceSyncManager
     * @export
     * @instance
     * @param {Request} request Request object
     * @param {{undoRedoDataArray: Array}} options Options
     * <ul>
     * <li>options.undoRedoDataArray optionally specify undo/redo data if this request was shredded. Should be an Array
     * whose entries should have the structure:
     * <ul>
     * <li>operation The operation performed on the local store, e.g. upsert or remove</li>
     * <li>storeName The local store name</li>
     * <li>undoRedoData An Array of compounds object with the following structure containing the undo/redo data
     * <ul>
     * <li>key The key for the shredded data row.</li>
     * <li>undo The undo data for the shredded data row.</li>
     * <li>redo The redo data for the shredded data row.</li>
     * </ul>
     * </li>
     * </ul>
     * </li>
     * </ul>
     * @return {Promise} Returns a Promise which resolves with the Request Id when complete
     */
    
    /**
     * Delete a Request from the Sync Log
     * @method
     * @name removeRequest
     * @memberof! PersistenceSyncManager
     * @export
     * @instance
     * @param {string} requestId The unique id for the Request
     * @return {Promise} Returns a Promise which resolves to the removed Request when complete
     */
    
    /**
     * Update a Request from the Sync Log. This function effectivaly replaces the
     * Request in the sync log with the provided Request.
     * @method
     * @name updateRequest
     * @memberof! PersistenceSyncManager
     * @export
     * @instance
     * @param {string} requestId The unique id for the Request
     * @param {Request} request Request object
     * @return {Promise} Returns a Promise which resolves to the replaced Request when complete
     */
    
    /**
     * Synchronize the log with the server. By default sync will first send an OPTIONS request before each request URL
     * to determine if the server is reachable. This OPTIONS request will be timed out after 60s and the sync will fail
     * with a HTTP response 504 error. If the OPTIONS request does not time out then sync will progress.
     * @method
     * @name sync
     * @memberof! PersistenceSyncManager
     * @export
     * @instance
     * @param {Object} options Options
     * <ul>
     * <li>options.preflightOptionsRequest 'enabled' or 'disabled' or url regex. 'enabled' is the default. 'disabled' will disable sending an OPTIONS request for all URLs. Specifying an URL pattern will enable the OPTIONS request only for those URLs.</li>
     * <li>options.preflightOptionsRequestTimeout The timeout for the OPTIONS request. Default is 60s.</li>
     * </ul>
     * @return {Promise} Returns a Promise which resolves when complete
     */
     
    /**
     * @export
     * @class OfflineCache
     * @classdesc Offline Persistence Toolkit implementation of the standard
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Cache|Cache API}.
     * In additional to functionalities provided by the standard Cache API, this
     * OfflineCache also interacts with shredding methods for more fine-grain
     * caching.
     * @constructor
     * @param {String} name name of the cache
     * @param {Object} persistencestore instance for cache storage
     */
      
    /**
     * Retrieve the name of the cache object.
     * @method
     * @name getName
     * @memberof! OfflineCache
     * @instance
     * @return {string} Returns the name of the cache object.
     */
       
    /**
     * Takes a request, retrieves it and adds the resulting response
     * object to the cache.
     * @method
     * @name add
     * @memberof! OfflineCache
     * @instance
     * @param {Request} request The request object to fetch for response
     *                          and be cached.
     * @return {Promise} returns a Promise that is resolved when the reponse
     *                           is retrieved and request/response is cached.
     */
    
    /**
     * Bulk operation of add.
     * @method
     * @name upsertAll
     * @memberof! OfflineCache
     * @param {Array} requests An array of Request
     * @return {Promise} Returns a promise when all the requests in the array are handled.
     */

    /**
     * Find the first response in this Cache object that match the request with the options.
     * @method
     * @name match
     * @memberof! OfflineCache
     * @instance
     * @param {Request} a request object to match against
     * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
     * <ul>
     * <li>options.ignoreSearch A Boolean that specifies whether to ignore
     *                          the query string in the url.  For example,
     *                          if set to true the ?value=bar part of
     *                          http://foo.com/?value=bar would be ignored
     *                          when performing a match. It defaults to false.</li>
     * <li>options.ignoreMethod A Boolean that, when set to true, prevents
     *                          matching operations from validating the
     *                          Request http method (normally only GET and
     *                          HEAD are allowed.) It defaults to false.</li>
     * <li>options.ignoreVary A Boolean that when set to true tells the
     *                          matching operation not to perform VARY header
     *                          matching — i.e. if the URL matches you will get
     *                          a match regardless of whether the Response
     *                          object has a VARY header. It defaults to false.</li>
     * </ul>
     * @return {Promise} Returns a Promise that resolves to the Response associated with the
     *                           first matching request in the Cache object. If no match is
     *                           found, the Promise resolves to undefined.
     */

    /**
     * Finds all responses whose request matches the passed-in request with the specified
     * options.
     * @method
     * @name matchAll
     * @memberof! OfflineCache
     * @instance
     * @param {Request} request The request object to match against
     * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
     * <ul>
     * <li>options.ignoreSearch A Boolean that specifies whether to ignore
     *                          the query string in the url.  For example,
     *                          if set to true the ?value=bar part of
     *                          http://foo.com/?value=bar would be ignored
     *                          when performing a match. It defaults to false.</li>
     * <li>options.ignoreMethod A Boolean that, when set to true, prevents
     *                          matching operations from validating the
     *                          Request http method (normally only GET and
     *                          HEAD are allowed.) It defaults to false.</li>
     * <li>options.ignoreVary A Boolean that when set to true tells the
     *                          matching operation not to perform VARY header
     *                          matching — i.e. if the URL matches you will get
     *                          a match regardless of whether the Response
     *                          object has a VARY header. It defaults to false.</li>
     * </ul>
     * @return {Promise } Returns a Promise that resolves to an array of response objects
     *                            whose request matches the passed-in request.
     */

    /**
     * Add the request/response pair into the cache.
     * @method
     * @name put
     * @memberof! OfflineCache
     * @instance
     * @param {Request} request Request object of the pair
     * @param {Response} response Response object of the pair
     * @return {Promise} Returns a promise when the request/response pair is cached.
     */
            
    /**
     * Delete the all the entries in the cache that matches the passed-in request with
     * the specified options.
     * @method
     * @name delete
     * @memberof! OfflineCache
     * @instance
     * @param {Request} request The request object to match against
     * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
     * <ul>
     * <li>options.ignoreSearch A Boolean that specifies whether to ignore
     *                          the query string in the url.  For example,
     *                          if set to true the ?value=bar part of
     *                          http://foo.com/?value=bar would be ignored
     *                          when performing a match. It defaults to false.</li>
     * <li>options.ignoreMethod A Boolean that, when set to true, prevents
     *                          matching operations from validating the
     *                          Request http method (normally only GET and
     *                          HEAD are allowed.) It defaults to false.</li>
     * <li>options.ignoreVary A Boolean that when set to true tells the
     *                          matching operation not to perform VARY header
     *                          matching — i.e. if the URL matches you will get
     *                          a match regardless of whether the Response
     *                          object has a VARY header. It defaults to false.</li>
     * </ul>
     * @return {Promse} Finds the Cache entry whose key is the request, and if found,
     *                  deletes the Cache entry and returns a Promise that resolves to
     *                  true. If no Cache entry is found, it returns a Promise that
     *                  resolves to false.
     */

    /**
     * Retrieves all the keys in this cache.
     * @method
     * @name keys
     * @memberof! OfflineCache
     * @instance
     * @param {Request} request The request object to match against
     * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
     * <ul>
     * <li>options.ignoreSearch A Boolean that specifies whether to ignore
     *                          the query string in the url.  For example,
     *                          if set to true the ?value=bar part of
     *                          http://foo.com/?value=bar would be ignored
     *                          when performing a match. It defaults to false.</li>
     * <li>options.ignoreMethod A Boolean that, when set to true, prevents
     *                          matching operations from validating the
     *                          Request http method (normally only GET and
     *                          HEAD are allowed.) It defaults to false.</li>
     * <li>options.ignoreVary A Boolean that when set to true tells the
     *                          matching operation not to perform VARY header
     *                          matching — i.e. if the URL matches you will get
     *                          a match regardless of whether the Response
     *                          object has a VARY header. It defaults to false.</li>
     * </ul>
     * @return {Promise} Returns a promise that resolves to an array of Cache keys.
     */            

    /**
     * Checks if a match to this request with the specified options exist in the
     * cache or not. This is an optimization over match because we don't need to
     * query out the shredded data to fill the response body.
     * @method
     * @name hasMatch
     * @memberof! OfflineCache
     * @instance
     * @param {Request} request The request object to match against
     * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
     * <ul>
     * <li>options.ignoreSearch A Boolean that specifies whether to ignore
     *                          the query string in the url.  For example,
     *                          if set to true the ?value=bar part of
     *                          http://foo.com/?value=bar would be ignored
     *                          when performing a match. It defaults to false.</li>
     * <li>options.ignoreMethod A Boolean that, when set to true, prevents
     *                          matching operations from validating the
     *                          Request http method (normally only GET and
     *                          HEAD are allowed.) It defaults to false.</li>
     * <li>options.ignoreVary A Boolean that when set to true tells the
     *                          matching operation not to perform VARY header
     *                          matching — i.e. if the URL matches you will get
     *                          a match regardless of whether the Response
     *                          object has a VARY header. It defaults to false.</li>
     * </ul>
     * @return {Promise} Returns a promise that resolves to true if a match exist
     *                   while false otherwise.
     */
             
  });


