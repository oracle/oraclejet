/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/impl/logger',[], function () {
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
/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/persistenceUtils',['./impl/logger'], function (logger) {
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
   * Return whether the Request is initiated from sync operation.
   * @method
   * @name isReplayRequest
   * @memberof persistenceUtils
   * @static
   * @private
   * @param {Request} request Request object
   * @return {boolean} Returns whether it's a request initiated from sync operation.
   */
  function isReplayRequest(request) {
    return request.headers.has('x-oracle-jscpt-sync-replay');
  };

  /**
   * Mark the request as initiated from sync operation
   * @method
   * @name markReplayRequest
   * @memberof persistenceUtils
   * @static
   * @private
   * @param {Request} request Request object
   * @param {boolean} replay a flag indicating whether it is a request from syn
   *                         operation or not.
   */
  function markReplayRequest(request, replay) {
    if (replay) {
      request.headers.set('x-oracle-jscpt-sync-replay', '');
    } else {
      request.headers.delete('x-oracle-jscpt-sync-replay');
    }
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

  function _derivePayloadType(xhr, response) {
    var contentType = response.headers.get('Content-Type');
    var responseType = xhr.responseType;
    if (_isTextPayload(response.headers)) {
      return "text";
    } else if (isCachedResponse(response) || responseType === 'blob') {
      return "blob";
    } else if (contentType && contentType.indexOf('image/') !== -1 || responseType === 'arraybuffer') {
      return "arraybuffer";
    } else if (contentType && contentType.indexOf('multipart/form-data') !== -1) {
      return "multipart";
    } else {
      return "text";
    }
  }

  function _isTextPayload(headers) {

    var contentType = headers.get('Content-Type');

    // the response is considered text type when contentType value is of
    // pattern text/ or application/*json .
    if (contentType &&
        (contentType.match(/.*text\/.*/) ||
         contentType.match(/.*application\/.*json.*/))) {
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
    if (!data){
      return Promise.resolve();
    }
    var initFromData = {};
    _copyProperties(data, initFromData, ['headers', 'body', 'signal']);
    var skipContentType = _copyPayloadFromJsonObj(data, initFromData);
    initFromData.headers = _createHeadersFromJsonObj(data, skipContentType);

    return Promise.resolve(new Request(data.url, initFromData));
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
        formData.append(pairkey, formPairs[pairkey]); // @XSSFalsePositive
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
        headers.append(key, data.headers[key]); // @XSSFalsePositive
      }
    });

    return headers;
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

    return Promise.resolve(_createResponseFromJsonObj(data, initFromData));
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

    return response;
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

      body.arrayBuffer = null;
      body.blob = null;
      body.text = null;

      if (payload instanceof ArrayBuffer) {
        body.arrayBuffer = payload;
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
      id : Math.random().toString(36).replace(/[^a-z]+/g, '') // @randomNumberOk - Only used to internally keep track of request URLs
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

  function _mapData(idArray, dataArray, dataMapping) {
    var mappedIdArray = idArray || [];
    var mappedDataArray = dataArray || [];

    if (dataMapping) {
      mappedIdArray = [];
      mappedDataArray = [];
      var totalCount = idArray != null ? idArray.length : dataArray.length;
      var i;
      for (i = 0; i < totalCount; i ++) {
        var itemMetadata = idArray != null ? {key: idArray[i]} : {key: null};
        var item = dataArray != null ? {metadata: itemMetadata, data: dataArray[i]} : {metadata: itemMetadata, data: null};
        var mappedItem = dataMapping.mapFields(item);
        mappedIdArray[i] = mappedItem.metadata.key;
        mappedDataArray[i] = mappedItem.data;
      };
    }

    return {keys: mappedIdArray, data: mappedDataArray};
  };

  function _unmapData(idArray, dataArray, dataMapping) {
    var unmappedIdArray = idArray || [];
    var unmappedDataArray = dataArray || [];

    if (dataMapping) {
      unmappedIdArray = [];
      unmappedDataArray = [];
      var totalCount = idArray != null ? idArray.length : dataArray.length;
      var i;
      for (i = 0; i < totalCount; i ++) {
        var itemMetadata = idArray != null ? {key: idArray[i]} : {key: null};
        var item = dataArray != null ? {metadata: itemMetadata, data: dataArray[i]} : {metadata: itemMetadata, data: null};
        var unmappedItem = dataMapping.unmapFields(item);
        unmappedIdArray[i] = unmappedItem.metadata.key;
        unmappedDataArray[i] = unmappedItem.data;
      }
    }

    return {keys: unmappedIdArray, data: unmappedDataArray};
  };

  function _mapFindQuery(findQuery, dataMapping) {
    if (findQuery  && dataMapping) {
      var filterCriterion = _transformFindQuerySelectorToFilterCriterion(findQuery.selector);

      if (filterCriterion) {
        findQuery.selector = _transformFilterCriterionToFindQuerySelector(dataMapping.mapFilterCriterion(filterCriterion));
      }
    }
    return findQuery;
  };

  function _transformFindQuerySelectorToFilterCriterion(findQuery) {
    if (findQuery) {
      var filterCriterion = {};
      Object.keys(findQuery).forEach(function(lhs) {
        if (!lhs.startsWith('value.')) {
          var operand = lhs;
          if (operand == '$and' || operand == '$or') {
            filterCriterion['op'] = operand;
            filterCriterion['value'] = [];
            findQuery[operand].forEach(function(innerQuery, index) {
              filterCriterion['value'][index] = _transformFindQuerySelectorToFilterCriterion(innerQuery);
            });
          }
        } else {
          var rhs = findQuery[lhs];
          if (rhs instanceof Object) {
            filterCriterion['op'] = Object.keys(rhs)[0];
            filterCriterion['value'] = rhs[filterCriterion['op']];
          } else {
            filterCriterion['op'] = '$eq';
            filterCriterion['value'] = rhs;
          }
          filterCriterion['attribute'] = lhs.substr(6, lhs.length);
        }
      });
      return filterCriterion;
    }
    return null;
  };

  function _transformFilterCriterionToFindQuerySelector(filterCriterion) {
    if (filterCriterion) {
      var findQuery = {};
      var operand = filterCriterion.op;
      if (operand == '$and' || operand == '$or') {
        findQuery[operand] = [];
        filterCriterion.value.forEach(function(innerFilterCriterion, index) {
          findQuery[operand][index] = _transformFilterCriterionToFindQuerySelector(innerFilterCriterion);
        });
      } else {
        findQuery['value.' + filterCriterion.attribute] = {};
        findQuery['value.' + filterCriterion.attribute][filterCriterion.op] = filterCriterion.value;
      }
      return findQuery;
    }
    return null;
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
    _derivePayloadType: _derivePayloadType,
    _mapData: _mapData,
    _unmapData: _unmapData,
    _mapFindQuery: _mapFindQuery,
    isReplayRequest: isReplayRequest,
    markReplayRequest: markReplayRequest
  };
});


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/impl/PersistenceXMLHttpRequest',['../persistenceUtils', './logger'], function (persistenceUtils, logger) {
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
    Object.defineProperty(this, 'onabort', {
      value: null,
      enumerable: true,
      writable: true
    });
    Object.defineProperty(this, 'onerror', {
      value: null,
      enumerable: true,
      writable: true
    });
    Object.defineProperty(this, 'onload', {
      value: null,
      enumerable: true,
      writable: true
    });
    Object.defineProperty(this, 'onloadend', {
      value: null,
      enumerable: true,
      writable: true
    });
    Object.defineProperty(this, 'onloadstart', {
      value: null,
      enumerable: true,
      writable: true
    });
    Object.defineProperty(this, 'onprogress', {
      value: null,
      enumerable: true,
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
      value: '',
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
    var self = this;
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
      try {
        fetch(request).then(function (response) {
          _processResponse(self, request, response);
        }, function (error) {
          self.dispatchEvent(new PersistenceXMLHttpRequestEvent('error', false, false, self));
        });
      } catch (err) {
        throw err;
      }
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
    if (this._responseHeaders) {
      Object.keys(this._responseHeaders).forEach(appendResponseHeader);
    }

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
    switch(type) {
      case 'abort':
        if (this.onabort) {
          this.onabort(event);
        }
        break;
      case 'error':
        if (this.onerror) {
          this.onerror(event);
        }
        break;
      case 'load':
        if (this.onload) {
          this.onload(event);
        }
        break;
      case 'loadend':
        if (this.onloadend) {
          this.onloadend(event);
        }
        break;
      case 'loadstart':
        if (this.onloadstart) {
          this.onloadstart(event);
        }
        break;
      case 'progress':
        if (this.onprogress) {
          this.onprogress(event);
        }
        break;
      case 'readystatechange':
        if (this.onreadystatechange) {
          this.onreadystatechange(event);
        }
        break;
       case 'timeout':
        if (this.ontimeout) {
          this.ontimeout(event);
        }
        break;
    }

    return !!event.defaultPrevented;
  };

  function _readyStateChange(self, state) {
    self._readyState = state;
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
    if (absoluteUrlOrigin.indexOf('file:') === 0 || absoluteUrlOrigin.indexOf('cdvfile:') === 0) {
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
      requestHeaders.append(requestHeader, self._requestHeaders[requestHeader]); // @XSSFalsePositive
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

    var payloadType = persistenceUtils._derivePayloadType(self, response);
    if (payloadType === 'blob') {
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
    } else if (payloadType === "arraybuffer") {
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
    } else if (payloadType === "multipart") {
      logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: Calling response.formData()');
      self._responseType = 'formData';
      var parseMultipartForm = function(data) {
        var responseText = '';
        var pairs = persistenceUtils.parseMultipartFormData(data, contentType);
        pairs.forEach(function(pair) {
          responseText = responseText + pair.data;
        });
        self._response = responseText;
        self._responseText = responseText;
        _readyStateChange(self, PersistenceXMLHttpRequest.DONE);

        if (typeof self.onload == 'function') {
          self.onload();
        }
      }
      if (response.formData) {
        try {
          response.formData().then(function (formData) {
            var responseText = '';
            var values = formData.values();
            var value;
            var next;
            do {
              next = values.next();
              value = next.value;
              if (value) {
                responseText = responseText + value;
              }
            } while (!next.done);
            self._response = responseText;
            self._responseText = responseText;
            _readyStateChange(self, PersistenceXMLHttpRequest.DONE);

            if (typeof self.onload == 'function') {
              self.onload();
            }
          });
        } catch (err) {
          response.text().then(function (data) {
            parseMultipartForm(data);
          });
        }
      } else {
        response.text().then(function (data) {
          parseMultipartForm(data);
        });
      }
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

define('persist/impl/PersistenceStoreMetadata',[], function () {
  'use strict';
  
  /**
   * @export
   * @class PersistenceStoreMetadata
   * @classdesc Class that contains the metadata for a Persistence Store. This is returned by the PersistenceStoreManager.
   * @hideconstructor
   */
  var PersistenceStoreMetadata = function (name, persistenceStoreFactory, versions) {
    this.name = name;
    this.persistenceStoreFactory = persistenceStoreFactory;
    this.versions = versions;
  };

  PersistenceStoreMetadata.prototype = {};

  /**
   * @export
   * @desc The name of the PersistenceStore
   * @memberof PersistenceStoreMetadata
   * @type {string}
   */
  PersistenceStoreMetadata.prototype.name;
  
  /**
   * @export
   * @desc Instance of the PersistenceStoreFactory used to create the PersistenceStore
   * @memberof PersistenceStoreMetadata
   * @type {PersistenceStoreFactory}
   */
  PersistenceStoreMetadata.prototype.persistenceStoreFactory;

  /**
   * @export
   * @desc An array of versions of the PersistenceStore
   * @memberof PersistenceStoreMetadata
   * @type {array}
   */
  PersistenceStoreMetadata.prototype.versions;

  return PersistenceStoreMetadata;
});

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/PersistenceStore',[], function () {
  'use strict';
  
  /**
   * @export
   * @class PersistenceStore
   * @classdesc Abstract class that all Persistence Store implmenetation extends
   *            from. Defines the basic operations every persistence store should
   *            support.
   * @hideconstructor
   */
  var PersistenceStore = function (name) {
    this._name = name;
  };

  PersistenceStore.prototype = {};

  /**
   * Retrieves the name of the store.
   * @method
   * @name getName
   * @memberof! PersistenceStore
   * @instance
   * @return {string} Returns the name of this store.
   */
  PersistenceStore.prototype.getName = function () {
    return this._name;
  };

  /**
   * Retrieves the version of the store.
   * @method
   * @name getVersion
   * @memberof! PersistenceStore
   * @instance
   * @return {string} Returns the version of this store.
   */
  PersistenceStore.prototype.getVersion = function () {
    return this._version;
  };

  /**
   * Initializes the store.
   * @method
   * @name Init
   * @memberof! PersistenceStore
   * @instance
   * @param {{index: Array, version: string}} options Optional options to tune the store. 
   * <ul>
   * <li>options.index   array of fields to create index for</li>
   * <li>options.version The version of the store.</li>
   * </ul>
   * @return {Promise} Returns a Promise when resolved the store is ready to be used.
   */
  PersistenceStore.prototype.Init = function (options) {
    if (options && options.version) {
      this._version = options.version;
    } else {
      this._version = '0';
    }
    return Promise.resolve();
  };

  /**
   * Insert a resource if it does not already exist, update otherwise.
   * @method
   * @name upsert
   * @memberof! PersistenceStore
   * @instance
   * @param {string} key The unique key used to identify this resource
   * @param {Object} metadata The metadata portion of this resource
   * @param {Object} value The value portion of this resource
   * @param {string} expectedVersionIdentifier Optional, the new version 
   *                                           identifier value of this resource.
   * @return {Promise} Returns a Promise that for insert, resolves to undefined,
   *                   while for update, resolves to the old value of the resource
   *                   associated with the key.
   */
  PersistenceStore.prototype.upsert = function (key, metadata, value, expectedVersionIdentifier) {
    throw TypeError("failed in abstract function");
  };

  /**
   * Bulk operation of upsert.
   * @method
   * @name upsertAll
   * @memberof! PersistenceStore
   * @instance
   * @param {Array} values An array of document to be bulk operated. Each item in the
   *                       array is of {key, metadata, value, expectedVersionIdentifier} format.
   * @return {Promise} Returns a Promise that resolves to an array where each element
   *                           in the array is the status of upsert of the corresponding
   *                           resource.
   */
  PersistenceStore.prototype.upsertAll = function (values) {
    throw TypeError("failed in abstract function");
  };

  /**
   * This is query and sort support for persistence store.
   * @method
   * @name find
   * @memberof! PersistenceStore
   * @instance
   * @param {{selector: Object, fields: Object, sort: Object}} findExpression The expression to query/sort the store. The syntax
   *                                of the expression follows standard MangoDB syntax.
   * <ul>
   * <li>findExpression.selector search criteria</li>
   * <li>findExpression.fields lists of fields to be included in the return
   *                                       value</li>
   * <li>findExpression.sort name of the field to be sorted against and the
   *                                     order to sort with.</li>
   * </ul>
   * @return {Promise} Returns a Promise that resolves to an array of entries that
   *                           satisfy the selector expression in the specified sorted
   *                           order that contains the specified fields. The
   *                           promise should resolve to an emtpy array if no
   *                           entries are found. 
   */
  PersistenceStore.prototype.find = function (findExpression) {
    throw TypeError("failed in abstract function");
  };

  /**
   * Convenient method to retrieve the document with the specified key. This is
   * equivalent to
   * find({selector: {key: {$eq: keyValue}},
           fields: [value]});
   * @method
   * @name findByKey
   * @memberof! PersistenceStore
   * @instance
   * @param {string} key The key part of the composite key in the store to
   *                     search for store entry.
   * @return {Promise} Returns a Promise that resolves to the store entry
   *                   identified by the specified key
   */
  PersistenceStore.prototype.findByKey = function (key) {
    throw TypeError("failed in abstract function");
  };

  /**
   * Convenient method to delete a document identified by the specified key.
   * This is equivalent to
   *   delete({selector: {key: {$eq: keyValue}}});
   * @method
   * @name removeByKey
   * @memberof! PersistenceStore
   * @instance
   * @param {string} key The key to identify the store entry that needs to be deleted.
   * @return {Promise} Returns a Promise that is resolved when the store entry
   *                   is deleted.
   */
  PersistenceStore.prototype.removeByKey = function (key) {
    throw TypeError("failed in abstract function");
  };

  /**
   * Delete the keys that satisfy the findExpression.
   * @method
   * @name delete
   * @memberof! PersistenceStore
   * @instance
   * @param {{selector: Object}} findExpression The expression to find matching documents to delete.
   *                                The syntax of the expression follows standard
   *                                MangoDB syntax. If undefined, all documents in this
   *                                store will be deleted.
   * <ul>
   * <li>findExpression.selector The search criteria to find matching
   *                                         document.</li>
   * </ul>
   */
  PersistenceStore.prototype.delete = function (findExpression) {
    throw TypeError("failed in abstract function");
  };

  /**
   * Returns all the keys of the documents in this store.
   * @method
   * @memberof! PersistenceStore
   * @instance
   * @return {Promise} Returns a Promise that resolves to an array where each
   *                           element is the key of an entry in this store.
   *                           The Promise should resolve to an empty array if
   *                           there is no entries in the store.
   */
  PersistenceStore.prototype.keys = function () {
    throw TypeError("failed in abstract function");
  };

  /**
   * Update the key value for the row referenced by the current key value.
   * @method
   * @name updateKey
   * @memberof! PersistenceStore
   * @instance
   * @param {string} currentKey The current key used to identify this resource
   * @param {string} newKey The new key used to identify this resource
   * @return {Promise} Returns a Promise that resolves when the key is updated.
   */
  PersistenceStore.prototype.updateKey = function(currentKey, newKey) {
    throw TypeError("failed in abstract function");
  }

  return PersistenceStore;
});

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/impl/storageUtils',['./logger'], function (logger) {
  'use strict';

  /**
    * Helper function that checks if itemData satisfies the search criteria
    * defined by selector or not. Undefined selector means everything is
    * selected.
    * @method
    * @name satisfy
    * @memberof! storageUtils
    * @static
    * @param {string} selector Rule that defines whether an object is selected
    *                          or not.
    * @param {object} itemData The value to check with.
    * @returns {boolean} true if itemData satisfies search criteria defined
    *                         by selector, and false otherwise.
    */
  function satisfy(selector, itemData) {
    logger.log("Offline Persistence Toolkit storageUtils: Processing selector: " +  JSON.stringify(selector));
    if (!selector) {
      // undefined selector means select everything.
      return true;
    } else {
      var expTree = _buildExpressionTree(selector);
      return _evaluateExpressionTree(expTree, itemData);
    }
  };

  /**
   * Helper function used by {@link _satisfy} to build an expression tree
   * based on expression object for easier evaluation later.
   * @method
   * @name _buildExpressionTree
   * @memberof! storageUtils
   * @static
   * @param {object} expression The expression that used to filter an object.
   * @returns {object} The tree representation of the passed-in expression.
   */
  function _buildExpressionTree(expression) {
    var subTree;
    var itemTreeArray = [];
    for (var key in expression) {
      if (expression.hasOwnProperty(key)) {
        var value = expression[key];
        if (key.indexOf('$') === 0) {
          if (_isMultiSelector(key)) {
            if (value instanceof Array) {
              subTree = {
                operator: key,
                array: []
              };
              for (var subindex = 0; subindex < value.length; subindex++) {
                var itemTree = _buildExpressionTree(value[subindex]);
                subTree.array.push(itemTree);
              }
            } else {
              throw new Error("not a valid expression: " + expression);
            }
          } else if (_isSingleSelector(key)) {
            throw new Error("not a valid expression: " + expression);
          }
        } else if (_isLiteral(value)) {
          itemTreeArray.push({
            left: key,
            right: value,
            operator: '$eq'
          });
        } else {
          var partialTree = {
            left: key,
          };
          _completePartialTree(partialTree, value);
          itemTreeArray.push(partialTree);
        }
      }
    }

    if (itemTreeArray.length > 1) {
      subTree = {
        operator: '$and',
        array: itemTreeArray
      };
    } else if (itemTreeArray.length === 1) {
      subTree = itemTreeArray[0];
    }

    return subTree;
  };

  /**
   * Helper function used by {@link _buildExpressionTree} to complete the
   * right side of an expression tree.
   * @method
   * @name _completePartialTree
   * @memberof! storageUtils
   * @static
   * @param {object} partialTree The tree representation of an expression.
   * @param {object} expression The object to evaluate the expression tree
   *                          against.
   */
  function _completePartialTree(partialTree, expression) {
    var found = false;
    for (var key in expression) {
      if (expression.hasOwnProperty(key)) {
        var value = expression[key];
        if (found || !_isSingleSelector(key)) {
          throw new Error("parsing error " + expression);
        }
        partialTree.operator = key;
        partialTree.right = value;
        found = true;
      }
    }
  };

  /**
   * Helper function used by {@link find} to apply an expression tree to
   * an object to check if this object satisfies the expression tree or not.
   * @method
   * @name _evaluateExpressionTree
   * @memberof! storageUtils
   * @tatic
   * @param {object} expTree The tree representation of an expression.
   * @param {object} itemData The object to evaluate the expression tree
   *                          against.
   * @returns {boolean} true if itemData satisfies expression tree, false
   *                    otherwise.
   */
  function _evaluateExpressionTree(expTree, itemData) {
    var operator = expTree.operator;
    if (_isMultiSelector(operator)) {
      if (expTree.left || !(expTree.array instanceof Array)) {
        throw new Error("invalid expression tree!" + expTree);
      } else {
        var result;
        var subTreeArray = expTree.array;
        for (var subIndex = 0; subIndex < subTreeArray.length; subIndex++) {
          var subResult = _evaluateExpressionTree(subTreeArray[subIndex], itemData);
          if (operator === '$or' && subResult === true) {
            return true;
          } else if (operator === '$and' && subResult === false) {
            return false;
          }
          result = subResult;
        }
        return result;
      }
    } else if (_isSingleSelector(operator)) {
      var itemValue = getValue(expTree.left, itemData);
      var value = expTree.right;
      if (operator === '$lt') {
        var fixedTokens = _fixNullForString(itemValue, value);
        itemValue = fixedTokens[0];
        value = fixedTokens[1];
        return (itemValue < value);
      } else if (operator === '$gt') {
        var fixedTokens = _fixNullForString(itemValue, value);
        itemValue = fixedTokens[0];
        value = fixedTokens[1];
        return (itemValue > value);
      } else if (operator === '$lte') {
        var fixedTokens = _fixNullForString(itemValue, value);
        itemValue = fixedTokens[0];
        value = fixedTokens[1];
        return (itemValue <= value);
      } else if (operator === '$gte') {
        var fixedTokens = _fixNullForString(itemValue, value);
        itemValue = fixedTokens[0];
        value = fixedTokens[1];
        return (itemValue >= value);
      } else if (operator === '$eq') {
        return (itemValue === value);
      } else if (operator === '$ne') {
        return (itemValue !== value);
      } else if (operator === '$regex') {
        var matchResult = itemValue.match(value);
        return (matchResult !== null);
      } else if (operator === '$exists') {
        if (value) {
          return (itemValue !== null && itemValue !== undefined);
        } else {
          return (itemValue === null || itemValue === undefined);
        }
      } else if (operator === '$in') {
        for (var i=0; i<value.length; i++) {
          if(value[i] ===  itemValue) {
            return true
          }
        }
      } else {
        throw new Error("not a valid expression! " + expTree);
      }
    } else {
      throw new Error("not a valid expression!" + expTree);
    }
    return false;
  };

  /**
   * Helper function that checks if the token is a multiple selector operator
   * or not.
   * @method
   * @name _isMultiSelector
   * @memberof! storageUtils
   * @static
   * @param {string} token The token to check against.
   * @returns {boolean} true if the token is the supported multiple selector
   *                    operator, false otherwise.
   */
  function _isMultiSelector(token) {
    return (token === '$and' || token === '$or');
  };

  /**
   * Helper function that checks if the token is a single selector operator
   * or not.
   * @method
   * @name _isSingleSelector
   * @memberof! storageUtils
   * @static
   * @param {string} token The token to check against.
   * @returns {boolean} true if the token is the supported single selector
   *                    operator, false otherwise.
   */
  function _isSingleSelector(token) {
    return (token === '$lt' || token === '$gt' || token === '$lte' ||
      token === '$gte' || token === '$eq' || token === '$ne' ||
      token === '$regex' || token === '$exists' || token === '$in');
  };

  /**
   * Helper function that checks if the token is a literal or not.
   * @method
   * @name _isLiteral
   * @memberof! storageUtils
   * @static
   * @param {string} token The token to check against.
   * @returns {boolean} true if the token is a literal, false otherwise.
   */
  function _isLiteral(token) {
    return (typeof(token) !== 'object');
  };

  /**
   * Helper function that checks if the token is a string
   * @method
   * @name _isSring
   * @memberof! storageUtils
   * @static
   * @param {string} token The token to check against.
   * @returns {boolean} true if the token is a string, false otherwise.
   */
  function _isString(token) {
    return (token != null && (token instanceof String || typeof token === 'string'));
  };

  /**
   * Helper function that sets null literals to empty string for string comparison
   * @method
   * @name _fixNullForString
   * @memberof! storageUtils
   * @static
   * @param {string} leftToken left hand token
   * @param {string} rightToken right hand token
   * @returns {Array} Array of left and right hand tokens
   */
  function _fixNullForString(leftToken, rightToken) {
    if (_isString(leftToken) && rightToken == null) {
      rightToken = '';
    } else if (_isString(rightToken) && leftToken == null) {
      leftToken = '';
    }
    return [leftToken, rightToken];
  };

  /**
   * Helper function that retrieves the value of a property from an object.
   * The object can have nested properties, and the property name could be
   * a path to the leaf property.
   * @method
   * @name getValue
   * @memberof! storageUtils
   * @static
   * @param {string} path The chain of the property names from the root to
   *                      the leaf when the object has nested properties.
   * @param {object} itemValue The object to retrieve the property value
   *                           from.
   * @returns {object} the object that contains all the properties defined
   *                   in fieldsExpression array, the corresponding property
   *                   value is obtained from itemData.
   */
  function getValue(path, itemValue) {
    var paths = path.split('.');
    var returnValue = itemValue;
    for (var index = 0; index < paths.length; index++) {
      returnValue = returnValue[paths[index]];
    }
    return returnValue;
  };

  /**
   * Helper function that constructs an object out from value
   * based on fields.
   * @method
   * @name assembleObject
   * @param {object} value The original object to construct the return object
   *                       from.
   * @param {Array} fields An array of property names whose values
   *                       should be included in the final contructed
   *                       return object.
   * @returns {object} the object that contains all the properties defined
   *                   in fields array, the corresponding property
   *                   value is obtained from value.
   */
  function assembleObject (value, fields) {
    var returnObject;
    if (!fields) {
      returnObject = value;
    } else {
      returnObject = {};
      for (var index = 0; index < fields.length; index++) {
        var currentObject = returnObject;
        var currentItemDataValue = value;
        var field = fields[index];
        var paths = field.split('.');
        for (var pathIndex = 0; pathIndex < paths.length; pathIndex++) {
          currentItemDataValue = currentItemDataValue[paths[pathIndex]];
          if (!currentObject[paths[pathIndex]] && pathIndex < paths.length - 1) {
            currentObject[paths[pathIndex]] = {};
          }
          if (pathIndex === paths.length - 1) {
            currentObject[paths[pathIndex]] = currentItemDataValue;
          } else {
            currentObject = currentObject[paths[pathIndex]];
          }
        }
      }
    }
    return returnObject;
  };
  
  function sortRows (unsorted, sortCriteria) {
    if (!unsorted || !Array.isArray(unsorted) || unsorted.length < 1 ||
        !sortCriteria || !Array.isArray(sortCriteria) || !sortCriteria.length) {
      return unsorted;
    }

    return unsorted.sort(_sortFunction(sortCriteria));
  };

  var _sortFunction = function (sortCriteria) {
    return function (a, b) {
      for (var index = 0; index < sortCriteria.length; index++) {
        var sortC = sortCriteria[index];
        var sortField;
        var sortAsc = true;

        if (typeof(sortC) === 'string') {
          sortField = sortC;
        } else if (typeof(sortC) === 'object'){
          var keys = Object.keys(sortC);
          if (!keys || keys.length !== 1) {
            throw new Error('invalid sort criteria');
          }
          sortField = keys[0];
          sortAsc = (sortC[sortField].toLowerCase() === 'asc');
        } else {
          throw new Error("invalid sort criteria.");
        }

        var valueA = getValue(sortField, a);
        var valueB = getValue(sortField, b);
        if (valueA == valueB) {
          continue;
        } else if (sortAsc) {
          return (valueA < valueB ? -1 : 1);
        } else {
          return (valueA < valueB ? 1 : -1);
        }
      }
      return 0;
    };
  };

  return {
    satisfy: satisfy,
    getValue: getValue,
    assembleObject: assembleObject,
    sortRows: sortRows
  };
});


(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define('pouchdb',[],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PouchDB = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

module.exports = argsArray;

function argsArray(fun) {
  return function () {
    var len = arguments.length;
    if (len) {
      var args = [];
      var i = -1;
      while (++i < len) {
        args[i] = arguments[i];
      }
      return fun.call(this, args);
    } else {
      return fun.call(this, []);
    }
  };
}
},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],3:[function(require,module,exports){
(function (global){
'use strict';
var Mutation = global.MutationObserver || global.WebKitMutationObserver;

var scheduleDrain;

{
  if (Mutation) {
    var called = 0;
    var observer = new Mutation(nextTick);
    var element = global.document.createTextNode('');
    observer.observe(element, {
      characterData: true
    });
    scheduleDrain = function () {
      element.data = (called = ++called % 2);
    };
  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = nextTick;
    scheduleDrain = function () {
      channel.port2.postMessage(0);
    };
  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
    scheduleDrain = function () {

      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var scriptEl = global.document.createElement('script');
      scriptEl.onreadystatechange = function () {
        nextTick();

        scriptEl.onreadystatechange = null;
        scriptEl.parentNode.removeChild(scriptEl);
        scriptEl = null;
      };
      global.document.documentElement.appendChild(scriptEl);
    };
  } else {
    scheduleDrain = function () {
      setTimeout(nextTick, 0);
    };
  }
}

var draining;
var queue = [];
//named nextTick for less confusing stack traces
function nextTick() {
  draining = true;
  var i, oldQueue;
  var len = queue.length;
  while (len) {
    oldQueue = queue;
    queue = [];
    i = -1;
    while (++i < len) {
      oldQueue[i]();
    }
    len = queue.length;
  }
  draining = false;
}

module.exports = immediate;
function immediate(task) {
  if (queue.push(task) === 1 && !draining) {
    scheduleDrain();
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
(function (process,global){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var getArguments = _interopDefault(require('argsarray'));
var nextTick = _interopDefault(require('immediate'));
var events = require('events');
var inherits = _interopDefault(require('inherits'));
var Md5 = _interopDefault(require('spark-md5'));
var uuidV4 = _interopDefault(require('uuid'));
var vuvuzela = _interopDefault(require('vuvuzela'));

function isBinaryObject(object) {
  return (typeof ArrayBuffer !== 'undefined' && object instanceof ArrayBuffer) ||
    (typeof Blob !== 'undefined' && object instanceof Blob);
}

function cloneArrayBuffer(buff) {
  if (typeof buff.slice === 'function') {
    return buff.slice(0);
  }
  // IE10-11 slice() polyfill
  var target = new ArrayBuffer(buff.byteLength);
  var targetArray = new Uint8Array(target);
  var sourceArray = new Uint8Array(buff);
  targetArray.set(sourceArray);
  return target;
}

function cloneBinaryObject(object) {
  if (object instanceof ArrayBuffer) {
    return cloneArrayBuffer(object);
  }
  var size = object.size;
  var type = object.type;
  // Blob
  if (typeof object.slice === 'function') {
    return object.slice(0, size, type);
  }
  // PhantomJS slice() replacement
  return object.webkitSlice(0, size, type);
}

// most of this is borrowed from lodash.isPlainObject:
// https://github.com/fis-components/lodash.isplainobject/
// blob/29c358140a74f252aeb08c9eb28bef86f2217d4a/index.js

var funcToString = Function.prototype.toString;
var objectCtorString = funcToString.call(Object);

function isPlainObject(value) {
  var proto = Object.getPrototypeOf(value);
  /* istanbul ignore if */
  if (proto === null) { // not sure when this happens, but I guess it can
    return true;
  }
  var Ctor = proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

function clone(object) {
  var newObject;
  var i;
  var len;

  if (!object || typeof object !== 'object') {
    return object;
  }

  if (Array.isArray(object)) {
    newObject = [];
    for (i = 0, len = object.length; i < len; i++) {
      newObject[i] = clone(object[i]);
    }
    return newObject;
  }

  // special case: to avoid inconsistencies between IndexedDB
  // and other backends, we automatically stringify Dates
  if (object instanceof Date) {
    return object.toISOString();
  }

  if (isBinaryObject(object)) {
    return cloneBinaryObject(object);
  }

  if (!isPlainObject(object)) {
    return object; // don't clone objects like Workers
  }

  newObject = {};
  for (i in object) {
    /* istanbul ignore else */
    if (Object.prototype.hasOwnProperty.call(object, i)) {
      var value = clone(object[i]);
      if (typeof value !== 'undefined') {
        newObject[i] = value;
      }
    }
  }
  return newObject;
}

function once(fun) {
  var called = false;
  return getArguments(function (args) {
    /* istanbul ignore if */
    if (called) {
      // this is a smoke test and should never actually happen
      throw new Error('once called more than once');
    } else {
      called = true;
      fun.apply(this, args);
    }
  });
}

function toPromise(func) {
  //create the function we will be returning
  return getArguments(function (args) {
    // Clone arguments
    args = clone(args);
    var self = this;
    // if the last argument is a function, assume its a callback
    var usedCB = (typeof args[args.length - 1] === 'function') ? args.pop() : false;
    var promise = new Promise(function (fulfill, reject) {
      var resp;
      try {
        var callback = once(function (err, mesg) {
          if (err) {
            reject(err);
          } else {
            fulfill(mesg);
          }
        });
        // create a callback for this invocation
        // apply the function in the orig context
        args.push(callback);
        resp = func.apply(self, args);
        if (resp && typeof resp.then === 'function') {
          fulfill(resp);
        }
      } catch (e) {
        reject(e);
      }
    });
    // if there is a callback, call it back
    if (usedCB) {
      promise.then(function (result) {
        usedCB(null, result);
      }, usedCB);
    }
    return promise;
  });
}

function logApiCall(self, name, args) {
  /* istanbul ignore if */
  if (self.constructor.listeners('debug').length) {
    var logArgs = ['api', self.name, name];
    for (var i = 0; i < args.length - 1; i++) {
      logArgs.push(args[i]);
    }
    self.constructor.emit('debug', logArgs);

    // override the callback itself to log the response
    var origCallback = args[args.length - 1];
    args[args.length - 1] = function (err, res) {
      var responseArgs = ['api', self.name, name];
      responseArgs = responseArgs.concat(
        err ? ['error', err] : ['success', res]
      );
      self.constructor.emit('debug', responseArgs);
      origCallback(err, res);
    };
  }
}

function adapterFun(name, callback) {
  return toPromise(getArguments(function (args) {
    if (this._closed) {
      return Promise.reject(new Error('database is closed'));
    }
    if (this._destroyed) {
      return Promise.reject(new Error('database is destroyed'));
    }
    var self = this;
    logApiCall(self, name, args);
    if (!this.taskqueue.isReady) {
      return new Promise(function (fulfill, reject) {
        self.taskqueue.addTask(function (failed) {
          if (failed) {
            reject(failed);
          } else {
            fulfill(self[name].apply(self, args));
          }
        });
      });
    }
    return callback.apply(this, args);
  }));
}

function mangle(key) {
  return '$' + key;
}
function unmangle(key) {
  return key.substring(1);
}
function Map$1() {
  this._store = {};
}
Map$1.prototype.get = function (key) {
  var mangled = mangle(key);
  return this._store[mangled];
};
Map$1.prototype.set = function (key, value) {
  var mangled = mangle(key);
  this._store[mangled] = value;
  return true;
};
Map$1.prototype.has = function (key) {
  var mangled = mangle(key);
  return mangled in this._store;
};
Map$1.prototype.delete = function (key) {
  var mangled = mangle(key);
  var res = mangled in this._store;
  delete this._store[mangled];
  return res;
};
Map$1.prototype.forEach = function (cb) {
  var keys = Object.keys(this._store);
  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];
    var value = this._store[key];
    key = unmangle(key);
    cb(value, key);
  }
};
Object.defineProperty(Map$1.prototype, 'size', {
  get: function () {
    return Object.keys(this._store).length;
  }
});

function Set$1(array) {
  this._store = new Map$1();

  // init with an array
  if (array && Array.isArray(array)) {
    for (var i = 0, len = array.length; i < len; i++) {
      this.add(array[i]);
    }
  }
}
Set$1.prototype.add = function (key) {
  return this._store.set(key, true);
};
Set$1.prototype.has = function (key) {
  return this._store.has(key);
};
Set$1.prototype.forEach = function (cb) {
  this._store.forEach(function (value, key) {
    cb(key);
  });
};
Object.defineProperty(Set$1.prototype, 'size', {
  get: function () {
    return this._store.size;
  }
});

/* global Map,Set,Symbol */
// Based on https://kangax.github.io/compat-table/es6/ we can sniff out
// incomplete Map/Set implementations which would otherwise cause our tests to fail.
// Notably they fail in IE11 and iOS 8.4, which this prevents.
function supportsMapAndSet() {
  if (typeof Symbol === 'undefined' || typeof Map === 'undefined' || typeof Set === 'undefined') {
    return false;
  }
  var prop = Object.getOwnPropertyDescriptor(Map, Symbol.species);
  return prop && 'get' in prop && Map[Symbol.species] === Map;
}

// based on https://github.com/montagejs/collections

var ExportedSet;
var ExportedMap;

{
  if (supportsMapAndSet()) { // prefer built-in Map/Set
    ExportedSet = Set;
    ExportedMap = Map;
  } else { // fall back to our polyfill
    ExportedSet = Set$1;
    ExportedMap = Map$1;
  }
}

// like underscore/lodash _.pick()
function pick(obj, arr) {
  var res = {};
  for (var i = 0, len = arr.length; i < len; i++) {
    var prop = arr[i];
    if (prop in obj) {
      res[prop] = obj[prop];
    }
  }
  return res;
}

// Most browsers throttle concurrent requests at 6, so it's silly
// to shim _bulk_get by trying to launch potentially hundreds of requests
// and then letting the majority time out. We can handle this ourselves.
var MAX_NUM_CONCURRENT_REQUESTS = 6;

function identityFunction(x) {
  return x;
}

function formatResultForOpenRevsGet(result) {
  return [{
    ok: result
  }];
}

// shim for P/CouchDB adapters that don't directly implement _bulk_get
function bulkGet(db, opts, callback) {
  var requests = opts.docs;

  // consolidate into one request per doc if possible
  var requestsById = new ExportedMap();
  requests.forEach(function (request) {
    if (requestsById.has(request.id)) {
      requestsById.get(request.id).push(request);
    } else {
      requestsById.set(request.id, [request]);
    }
  });

  var numDocs = requestsById.size;
  var numDone = 0;
  var perDocResults = new Array(numDocs);

  function collapseResultsAndFinish() {
    var results = [];
    perDocResults.forEach(function (res) {
      res.docs.forEach(function (info) {
        results.push({
          id: res.id,
          docs: [info]
        });
      });
    });
    callback(null, {results: results});
  }

  function checkDone() {
    if (++numDone === numDocs) {
      collapseResultsAndFinish();
    }
  }

  function gotResult(docIndex, id, docs) {
    perDocResults[docIndex] = {id: id, docs: docs};
    checkDone();
  }

  var allRequests = [];
  requestsById.forEach(function (value, key) {
    allRequests.push(key);
  });

  var i = 0;

  function nextBatch() {

    if (i >= allRequests.length) {
      return;
    }

    var upTo = Math.min(i + MAX_NUM_CONCURRENT_REQUESTS, allRequests.length);
    var batch = allRequests.slice(i, upTo);
    processBatch(batch, i);
    i += batch.length;
  }

  function processBatch(batch, offset) {
    batch.forEach(function (docId, j) {
      var docIdx = offset + j;
      var docRequests = requestsById.get(docId);

      // just use the first request as the "template"
      // TODO: The _bulk_get API allows for more subtle use cases than this,
      // but for now it is unlikely that there will be a mix of different
      // "atts_since" or "attachments" in the same request, since it's just
      // replicate.js that is using this for the moment.
      // Also, atts_since is aspirational, since we don't support it yet.
      var docOpts = pick(docRequests[0], ['atts_since', 'attachments']);
      docOpts.open_revs = docRequests.map(function (request) {
        // rev is optional, open_revs disallowed
        return request.rev;
      });

      // remove falsey / undefined revisions
      docOpts.open_revs = docOpts.open_revs.filter(identityFunction);

      var formatResult = identityFunction;

      if (docOpts.open_revs.length === 0) {
        delete docOpts.open_revs;

        // when fetching only the "winning" leaf,
        // transform the result so it looks like an open_revs
        // request
        formatResult = formatResultForOpenRevsGet;
      }

      // globally-supplied options
      ['revs', 'attachments', 'binary', 'ajax', 'latest'].forEach(function (param) {
        if (param in opts) {
          docOpts[param] = opts[param];
        }
      });
      db.get(docId, docOpts, function (err, res) {
        var result;
        /* istanbul ignore if */
        if (err) {
          result = [{error: err}];
        } else {
          result = formatResult(res);
        }
        gotResult(docIdx, docId, result);
        nextBatch();
      });
    });
  }

  nextBatch();

}

var hasLocal;

try {
  localStorage.setItem('_pouch_check_localstorage', 1);
  hasLocal = !!localStorage.getItem('_pouch_check_localstorage');
} catch (e) {
  hasLocal = false;
}

function hasLocalStorage() {
  return hasLocal;
}

// Custom nextTick() shim for browsers. In node, this will just be process.nextTick(). We

inherits(Changes, events.EventEmitter);

/* istanbul ignore next */
function attachBrowserEvents(self) {
  if (hasLocalStorage()) {
    addEventListener("storage", function (e) {
      self.emit(e.key);
    });
  }
}

function Changes() {
  events.EventEmitter.call(this);
  this._listeners = {};

  attachBrowserEvents(this);
}
Changes.prototype.addListener = function (dbName, id, db, opts) {
  /* istanbul ignore if */
  if (this._listeners[id]) {
    return;
  }
  var self = this;
  var inprogress = false;
  function eventFunction() {
    /* istanbul ignore if */
    if (!self._listeners[id]) {
      return;
    }
    if (inprogress) {
      inprogress = 'waiting';
      return;
    }
    inprogress = true;
    var changesOpts = pick(opts, [
      'style', 'include_docs', 'attachments', 'conflicts', 'filter',
      'doc_ids', 'view', 'since', 'query_params', 'binary', 'return_docs'
    ]);

    /* istanbul ignore next */
    function onError() {
      inprogress = false;
    }

    db.changes(changesOpts).on('change', function (c) {
      if (c.seq > opts.since && !opts.cancelled) {
        opts.since = c.seq;
        opts.onChange(c);
      }
    }).on('complete', function () {
      if (inprogress === 'waiting') {
        nextTick(eventFunction);
      }
      inprogress = false;
    }).on('error', onError);
  }
  this._listeners[id] = eventFunction;
  this.on(dbName, eventFunction);
};

Changes.prototype.removeListener = function (dbName, id) {
  /* istanbul ignore if */
  if (!(id in this._listeners)) {
    return;
  }
  events.EventEmitter.prototype.removeListener.call(this, dbName,
    this._listeners[id]);
  delete this._listeners[id];
};


/* istanbul ignore next */
Changes.prototype.notifyLocalWindows = function (dbName) {
  //do a useless change on a storage thing
  //in order to get other windows's listeners to activate
  if (hasLocalStorage()) {
    localStorage[dbName] = (localStorage[dbName] === "a") ? "b" : "a";
  }
};

Changes.prototype.notify = function (dbName) {
  this.emit(dbName);
  this.notifyLocalWindows(dbName);
};

function guardedConsole(method) {
  /* istanbul ignore else */
  if (typeof console !== 'undefined' && typeof console[method] === 'function') {
    var args = Array.prototype.slice.call(arguments, 1);
    console[method].apply(console, args);
  }
}

function randomNumber(min, max) {
  var maxTimeout = 600000; // Hard-coded default of 10 minutes
  min = parseInt(min, 10) || 0;
  max = parseInt(max, 10);
  if (max !== max || max <= min) {
    max = (min || 1) << 1; //doubling
  } else {
    max = max + 1;
  }
  // In order to not exceed maxTimeout, pick a random value between half of maxTimeout and maxTimeout
  if (max > maxTimeout) {
    min = maxTimeout >> 1; // divide by two
    max = maxTimeout;
  }
  var ratio = Math.random();
  var range = max - min;

  return ~~(range * ratio + min); // ~~ coerces to an int, but fast.
}

function defaultBackOff(min) {
  var max = 0;
  if (!min) {
    max = 2000;
  }
  return randomNumber(min, max);
}

// designed to give info to browser users, who are disturbed
// when they see http errors in the console
function explainError(status, str) {
  guardedConsole('info', 'The above ' + status + ' is totally normal. ' + str);
}

var assign;
{
  if (typeof Object.assign === 'function') {
    assign = Object.assign;
  } else {
    // lite Object.assign polyfill based on
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    assign = function (target) {
      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    };
  }
}

var $inject_Object_assign = assign;

inherits(PouchError, Error);

function PouchError(status, error, reason) {
  Error.call(this, reason);
  this.status = status;
  this.name = error;
  this.message = reason;
  this.error = true;
}

PouchError.prototype.toString = function () {
  return JSON.stringify({
    status: this.status,
    name: this.name,
    message: this.message,
    reason: this.reason
  });
};

var UNAUTHORIZED = new PouchError(401, 'unauthorized', "Name or password is incorrect.");
var MISSING_BULK_DOCS = new PouchError(400, 'bad_request', "Missing JSON list of 'docs'");
var MISSING_DOC = new PouchError(404, 'not_found', 'missing');
var REV_CONFLICT = new PouchError(409, 'conflict', 'Document update conflict');
var INVALID_ID = new PouchError(400, 'bad_request', '_id field must contain a string');
var MISSING_ID = new PouchError(412, 'missing_id', '_id is required for puts');
var RESERVED_ID = new PouchError(400, 'bad_request', 'Only reserved document ids may start with underscore.');
var NOT_OPEN = new PouchError(412, 'precondition_failed', 'Database not open');
var UNKNOWN_ERROR = new PouchError(500, 'unknown_error', 'Database encountered an unknown error');
var BAD_ARG = new PouchError(500, 'badarg', 'Some query argument is invalid');
var INVALID_REQUEST = new PouchError(400, 'invalid_request', 'Request was invalid');
var QUERY_PARSE_ERROR = new PouchError(400, 'query_parse_error', 'Some query parameter is invalid');
var DOC_VALIDATION = new PouchError(500, 'doc_validation', 'Bad special document member');
var BAD_REQUEST = new PouchError(400, 'bad_request', 'Something wrong with the request');
var NOT_AN_OBJECT = new PouchError(400, 'bad_request', 'Document must be a JSON object');
var DB_MISSING = new PouchError(404, 'not_found', 'Database not found');
var IDB_ERROR = new PouchError(500, 'indexed_db_went_bad', 'unknown');
var WSQ_ERROR = new PouchError(500, 'web_sql_went_bad', 'unknown');
var LDB_ERROR = new PouchError(500, 'levelDB_went_went_bad', 'unknown');
var FORBIDDEN = new PouchError(403, 'forbidden', 'Forbidden by design doc validate_doc_update function');
var INVALID_REV = new PouchError(400, 'bad_request', 'Invalid rev format');
var FILE_EXISTS = new PouchError(412, 'file_exists', 'The database could not be created, the file already exists.');
var MISSING_STUB = new PouchError(412, 'missing_stub', 'A pre-existing attachment stub wasn\'t found');
var INVALID_URL = new PouchError(413, 'invalid_url', 'Provided URL is invalid');

function createError(error, reason) {
  function CustomPouchError(reason) {
    // inherit error properties from our parent error manually
    // so as to allow proper JSON parsing.
    /* jshint ignore:start */
    for (var p in error) {
      if (typeof error[p] !== 'function') {
        this[p] = error[p];
      }
    }
    /* jshint ignore:end */
    if (reason !== undefined) {
      this.reason = reason;
    }
  }
  CustomPouchError.prototype = PouchError.prototype;
  return new CustomPouchError(reason);
}

function generateErrorFromResponse(err) {

  if (typeof err !== 'object') {
    var data = err;
    err = UNKNOWN_ERROR;
    err.data = data;
  }

  if ('error' in err && err.error === 'conflict') {
    err.name = 'conflict';
    err.status = 409;
  }

  if (!('name' in err)) {
    err.name = err.error || 'unknown';
  }

  if (!('status' in err)) {
    err.status = 500;
  }

  if (!('message' in err)) {
    err.message = err.message || err.reason;
  }

  return err;
}

function tryFilter(filter, doc, req) {
  try {
    return !filter(doc, req);
  } catch (err) {
    var msg = 'Filter function threw: ' + err.toString();
    return createError(BAD_REQUEST, msg);
  }
}

function filterChange(opts) {
  var req = {};
  var hasFilter = opts.filter && typeof opts.filter === 'function';
  req.query = opts.query_params;

  return function filter(change) {
    if (!change.doc) {
      // CSG sends events on the changes feed that don't have documents,
      // this hack makes a whole lot of existing code robust.
      change.doc = {};
    }

    var filterReturn = hasFilter && tryFilter(opts.filter, change.doc, req);

    if (typeof filterReturn === 'object') {
      return filterReturn;
    }

    if (filterReturn) {
      return false;
    }

    if (!opts.include_docs) {
      delete change.doc;
    } else if (!opts.attachments) {
      for (var att in change.doc._attachments) {
        /* istanbul ignore else */
        if (change.doc._attachments.hasOwnProperty(att)) {
          change.doc._attachments[att].stub = true;
        }
      }
    }
    return true;
  };
}

function flatten(arrs) {
  var res = [];
  for (var i = 0, len = arrs.length; i < len; i++) {
    res = res.concat(arrs[i]);
  }
  return res;
}

// shim for Function.prototype.name,

// Determine id an ID is valid
//   - invalid IDs begin with an underescore that does not begin '_design' or
//     '_local'
//   - any other string value is a valid id
// Returns the specific error object for each case
function invalidIdError(id) {
  var err;
  if (!id) {
    err = createError(MISSING_ID);
  } else if (typeof id !== 'string') {
    err = createError(INVALID_ID);
  } else if (/^_/.test(id) && !(/^_(design|local)/).test(id)) {
    err = createError(RESERVED_ID);
  }
  if (err) {
    throw err;
  }
}

// Checks if a PouchDB object is "remote" or not. This is

function isRemote(db) {
  if (typeof db._remote === 'boolean') {
    return db._remote;
  }
  /* istanbul ignore next */
  if (typeof db.type === 'function') {
    guardedConsole('warn',
      'db.type() is deprecated and will be removed in ' +
      'a future version of PouchDB');
    return db.type() === 'http';
  }
  /* istanbul ignore next */
  return false;
}

function listenerCount(ee, type) {
  return 'listenerCount' in ee ? ee.listenerCount(type) :
                                 events.EventEmitter.listenerCount(ee, type);
}

function parseDesignDocFunctionName(s) {
  if (!s) {
    return null;
  }
  var parts = s.split('/');
  if (parts.length === 2) {
    return parts;
  }
  if (parts.length === 1) {
    return [s, s];
  }
  return null;
}

function normalizeDesignDocFunctionName(s) {
  var normalized = parseDesignDocFunctionName(s);
  return normalized ? normalized.join('/') : null;
}

// originally parseUri 1.2.2, now patched by us
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
var keys = ["source", "protocol", "authority", "userInfo", "user", "password",
    "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
var qName ="queryKey";
var qParser = /(?:^|&)([^&=]*)=?([^&]*)/g;

// use the "loose" parser
/* eslint maxlen: 0, no-useless-escape: 0 */
var parser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

function parseUri(str) {
  var m = parser.exec(str);
  var uri = {};
  var i = 14;

  while (i--) {
    var key = keys[i];
    var value = m[i] || "";
    var encoded = ['user', 'password'].indexOf(key) !== -1;
    uri[key] = encoded ? decodeURIComponent(value) : value;
  }

  uri[qName] = {};
  uri[keys[12]].replace(qParser, function ($0, $1, $2) {
    if ($1) {
      uri[qName][$1] = $2;
    }
  });

  return uri;
}

// Based on https://github.com/alexdavid/scope-eval v0.0.3
// (source: https://unpkg.com/scope-eval@0.0.3/scope_eval.js)
// This is basically just a wrapper around new Function()

function scopeEval(source, scope) {
  var keys = [];
  var values = [];
  for (var key in scope) {
    if (scope.hasOwnProperty(key)) {
      keys.push(key);
      values.push(scope[key]);
    }
  }
  keys.push(source);
  return Function.apply(null, keys).apply(null, values);
}

// this is essentially the "update sugar" function from daleharvey/pouchdb#1388
// the diffFun tells us what delta to apply to the doc.  it either returns
// the doc, or false if it doesn't need to do an update after all
function upsert(db, docId, diffFun) {
  return new Promise(function (fulfill, reject) {
    db.get(docId, function (err, doc) {
      if (err) {
        /* istanbul ignore next */
        if (err.status !== 404) {
          return reject(err);
        }
        doc = {};
      }

      // the user might change the _rev, so save it for posterity
      var docRev = doc._rev;
      var newDoc = diffFun(doc);

      if (!newDoc) {
        // if the diffFun returns falsy, we short-circuit as
        // an optimization
        return fulfill({updated: false, rev: docRev});
      }

      // users aren't allowed to modify these values,
      // so reset them here
      newDoc._id = docId;
      newDoc._rev = docRev;
      fulfill(tryAndPut(db, newDoc, diffFun));
    });
  });
}

function tryAndPut(db, doc, diffFun) {
  return db.put(doc).then(function (res) {
    return {
      updated: true,
      rev: res.rev
    };
  }, function (err) {
    /* istanbul ignore next */
    if (err.status !== 409) {
      throw err;
    }
    return upsert(db, doc._id, diffFun);
  });
}

var thisAtob = function (str) {
  return atob(str);
};

var thisBtoa = function (str) {
  return btoa(str);
};

// Abstracts constructing a Blob object, so it also works in older
// browsers that don't support the native Blob constructor (e.g.
// old QtWebKit versions, Android < 4.4).
function createBlob(parts, properties) {
  /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
  parts = parts || [];
  properties = properties || {};
  try {
    return new Blob(parts, properties);
  } catch (e) {
    if (e.name !== "TypeError") {
      throw e;
    }
    var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder :
                  typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder :
                  typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder :
                  WebKitBlobBuilder;
    var builder = new Builder();
    for (var i = 0; i < parts.length; i += 1) {
      builder.append(parts[i]);
    }
    return builder.getBlob(properties.type);
  }
}

// From http://stackoverflow.com/questions/14967647/ (continues on next line)
// encode-decode-image-with-base64-breaks-image (2013-04-21)
function binaryStringToArrayBuffer(bin) {
  var length = bin.length;
  var buf = new ArrayBuffer(length);
  var arr = new Uint8Array(buf);
  for (var i = 0; i < length; i++) {
    arr[i] = bin.charCodeAt(i);
  }
  return buf;
}

function binStringToBluffer(binString, type) {
  return createBlob([binaryStringToArrayBuffer(binString)], {type: type});
}

function b64ToBluffer(b64, type) {
  return binStringToBluffer(thisAtob(b64), type);
}

//Can't find original post, but this is close
//http://stackoverflow.com/questions/6965107/ (continues on next line)
//converting-between-strings-and-arraybuffers
function arrayBufferToBinaryString(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var length = bytes.byteLength;
  for (var i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

// shim for browsers that don't support it
function readAsBinaryString(blob, callback) {
  var reader = new FileReader();
  var hasBinaryString = typeof reader.readAsBinaryString === 'function';
  reader.onloadend = function (e) {
    var result = e.target.result || '';
    if (hasBinaryString) {
      return callback(result);
    }
    callback(arrayBufferToBinaryString(result));
  };
  if (hasBinaryString) {
    reader.readAsBinaryString(blob);
  } else {
    reader.readAsArrayBuffer(blob);
  }
}

function blobToBinaryString(blobOrBuffer, callback) {
  readAsBinaryString(blobOrBuffer, function (bin) {
    callback(bin);
  });
}

function blobToBase64(blobOrBuffer, callback) {
  blobToBinaryString(blobOrBuffer, function (base64) {
    callback(thisBtoa(base64));
  });
}

// simplified API. universal browser support is assumed
function readAsArrayBuffer(blob, callback) {
  var reader = new FileReader();
  reader.onloadend = function (e) {
    var result = e.target.result || new ArrayBuffer(0);
    callback(result);
  };
  reader.readAsArrayBuffer(blob);
}

// this is not used in the browser

var setImmediateShim = global.setImmediate || global.setTimeout;
var MD5_CHUNK_SIZE = 32768;

function rawToBase64(raw) {
  return thisBtoa(raw);
}

function sliceBlob(blob, start, end) {
  if (blob.webkitSlice) {
    return blob.webkitSlice(start, end);
  }
  return blob.slice(start, end);
}

function appendBlob(buffer, blob, start, end, callback) {
  if (start > 0 || end < blob.size) {
    // only slice blob if we really need to
    blob = sliceBlob(blob, start, end);
  }
  readAsArrayBuffer(blob, function (arrayBuffer) {
    buffer.append(arrayBuffer);
    callback();
  });
}

function appendString(buffer, string, start, end, callback) {
  if (start > 0 || end < string.length) {
    // only create a substring if we really need to
    string = string.substring(start, end);
  }
  buffer.appendBinary(string);
  callback();
}

function binaryMd5(data, callback) {
  var inputIsString = typeof data === 'string';
  var len = inputIsString ? data.length : data.size;
  var chunkSize = Math.min(MD5_CHUNK_SIZE, len);
  var chunks = Math.ceil(len / chunkSize);
  var currentChunk = 0;
  var buffer = inputIsString ? new Md5() : new Md5.ArrayBuffer();

  var append = inputIsString ? appendString : appendBlob;

  function next() {
    setImmediateShim(loadNextChunk);
  }

  function done() {
    var raw = buffer.end(true);
    var base64 = rawToBase64(raw);
    callback(base64);
    buffer.destroy();
  }

  function loadNextChunk() {
    var start = currentChunk * chunkSize;
    var end = start + chunkSize;
    currentChunk++;
    if (currentChunk < chunks) {
      append(buffer, data, start, end, next);
    } else {
      append(buffer, data, start, end, done);
    }
  }
  loadNextChunk();
}

function stringMd5(string) {
  return Md5.hash(string);
}

function rev$$1(doc, deterministic_revs) {
  var clonedDoc = clone(doc);
  if (!deterministic_revs) {
    return uuidV4.v4().replace(/-/g, '').toLowerCase();
  }

  delete clonedDoc._rev_tree;
  return stringMd5(JSON.stringify(clonedDoc));
}

var uuid = uuidV4.v4;

// We fetch all leafs of the revision tree, and sort them based on tree length
// and whether they were deleted, undeleted documents with the longest revision
// tree (most edits) win
// The final sort algorithm is slightly documented in a sidebar here:
// http://guide.couchdb.org/draft/conflicts.html
function winningRev(metadata) {
  var winningId;
  var winningPos;
  var winningDeleted;
  var toVisit = metadata.rev_tree.slice();
  var node;
  while ((node = toVisit.pop())) {
    var tree = node.ids;
    var branches = tree[2];
    var pos = node.pos;
    if (branches.length) { // non-leaf
      for (var i = 0, len = branches.length; i < len; i++) {
        toVisit.push({pos: pos + 1, ids: branches[i]});
      }
      continue;
    }
    var deleted = !!tree[1].deleted;
    var id = tree[0];
    // sort by deleted, then pos, then id
    if (!winningId || (winningDeleted !== deleted ? winningDeleted :
        winningPos !== pos ? winningPos < pos : winningId < id)) {
      winningId = id;
      winningPos = pos;
      winningDeleted = deleted;
    }
  }

  return winningPos + '-' + winningId;
}

// Pretty much all below can be combined into a higher order function to
// traverse revisions
// The return value from the callback will be passed as context to all
// children of that node
function traverseRevTree(revs, callback) {
  var toVisit = revs.slice();

  var node;
  while ((node = toVisit.pop())) {
    var pos = node.pos;
    var tree = node.ids;
    var branches = tree[2];
    var newCtx =
      callback(branches.length === 0, pos, tree[0], node.ctx, tree[1]);
    for (var i = 0, len = branches.length; i < len; i++) {
      toVisit.push({pos: pos + 1, ids: branches[i], ctx: newCtx});
    }
  }
}

function sortByPos(a, b) {
  return a.pos - b.pos;
}

function collectLeaves(revs) {
  var leaves = [];
  traverseRevTree(revs, function (isLeaf, pos, id, acc, opts) {
    if (isLeaf) {
      leaves.push({rev: pos + "-" + id, pos: pos, opts: opts});
    }
  });
  leaves.sort(sortByPos).reverse();
  for (var i = 0, len = leaves.length; i < len; i++) {
    delete leaves[i].pos;
  }
  return leaves;
}

// returns revs of all conflicts that is leaves such that
// 1. are not deleted and
// 2. are different than winning revision
function collectConflicts(metadata) {
  var win = winningRev(metadata);
  var leaves = collectLeaves(metadata.rev_tree);
  var conflicts = [];
  for (var i = 0, len = leaves.length; i < len; i++) {
    var leaf = leaves[i];
    if (leaf.rev !== win && !leaf.opts.deleted) {
      conflicts.push(leaf.rev);
    }
  }
  return conflicts;
}

// compact a tree by marking its non-leafs as missing,
// and return a list of revs to delete
function compactTree(metadata) {
  var revs = [];
  traverseRevTree(metadata.rev_tree, function (isLeaf, pos,
                                               revHash, ctx, opts) {
    if (opts.status === 'available' && !isLeaf) {
      revs.push(pos + '-' + revHash);
      opts.status = 'missing';
    }
  });
  return revs;
}

// build up a list of all the paths to the leafs in this revision tree
function rootToLeaf(revs) {
  var paths = [];
  var toVisit = revs.slice();
  var node;
  while ((node = toVisit.pop())) {
    var pos = node.pos;
    var tree = node.ids;
    var id = tree[0];
    var opts = tree[1];
    var branches = tree[2];
    var isLeaf = branches.length === 0;

    var history = node.history ? node.history.slice() : [];
    history.push({id: id, opts: opts});
    if (isLeaf) {
      paths.push({pos: (pos + 1 - history.length), ids: history});
    }
    for (var i = 0, len = branches.length; i < len; i++) {
      toVisit.push({pos: pos + 1, ids: branches[i], history: history});
    }
  }
  return paths.reverse();
}

// for a better overview of what this is doing, read:

function sortByPos$1(a, b) {
  return a.pos - b.pos;
}

// classic binary search
function binarySearch(arr, item, comparator) {
  var low = 0;
  var high = arr.length;
  var mid;
  while (low < high) {
    mid = (low + high) >>> 1;
    if (comparator(arr[mid], item) < 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

// assuming the arr is sorted, insert the item in the proper place
function insertSorted(arr, item, comparator) {
  var idx = binarySearch(arr, item, comparator);
  arr.splice(idx, 0, item);
}

// Turn a path as a flat array into a tree with a single branch.
// If any should be stemmed from the beginning of the array, that's passed
// in as the second argument
function pathToTree(path, numStemmed) {
  var root;
  var leaf;
  for (var i = numStemmed, len = path.length; i < len; i++) {
    var node = path[i];
    var currentLeaf = [node.id, node.opts, []];
    if (leaf) {
      leaf[2].push(currentLeaf);
      leaf = currentLeaf;
    } else {
      root = leaf = currentLeaf;
    }
  }
  return root;
}

// compare the IDs of two trees
function compareTree(a, b) {
  return a[0] < b[0] ? -1 : 1;
}

// Merge two trees together
// The roots of tree1 and tree2 must be the same revision
function mergeTree(in_tree1, in_tree2) {
  var queue = [{tree1: in_tree1, tree2: in_tree2}];
  var conflicts = false;
  while (queue.length > 0) {
    var item = queue.pop();
    var tree1 = item.tree1;
    var tree2 = item.tree2;

    if (tree1[1].status || tree2[1].status) {
      tree1[1].status =
        (tree1[1].status ===  'available' ||
        tree2[1].status === 'available') ? 'available' : 'missing';
    }

    for (var i = 0; i < tree2[2].length; i++) {
      if (!tree1[2][0]) {
        conflicts = 'new_leaf';
        tree1[2][0] = tree2[2][i];
        continue;
      }

      var merged = false;
      for (var j = 0; j < tree1[2].length; j++) {
        if (tree1[2][j][0] === tree2[2][i][0]) {
          queue.push({tree1: tree1[2][j], tree2: tree2[2][i]});
          merged = true;
        }
      }
      if (!merged) {
        conflicts = 'new_branch';
        insertSorted(tree1[2], tree2[2][i], compareTree);
      }
    }
  }
  return {conflicts: conflicts, tree: in_tree1};
}

function doMerge(tree, path, dontExpand) {
  var restree = [];
  var conflicts = false;
  var merged = false;
  var res;

  if (!tree.length) {
    return {tree: [path], conflicts: 'new_leaf'};
  }

  for (var i = 0, len = tree.length; i < len; i++) {
    var branch = tree[i];
    if (branch.pos === path.pos && branch.ids[0] === path.ids[0]) {
      // Paths start at the same position and have the same root, so they need
      // merged
      res = mergeTree(branch.ids, path.ids);
      restree.push({pos: branch.pos, ids: res.tree});
      conflicts = conflicts || res.conflicts;
      merged = true;
    } else if (dontExpand !== true) {
      // The paths start at a different position, take the earliest path and
      // traverse up until it as at the same point from root as the path we
      // want to merge.  If the keys match we return the longer path with the
      // other merged After stemming we dont want to expand the trees

      var t1 = branch.pos < path.pos ? branch : path;
      var t2 = branch.pos < path.pos ? path : branch;
      var diff = t2.pos - t1.pos;

      var candidateParents = [];

      var trees = [];
      trees.push({ids: t1.ids, diff: diff, parent: null, parentIdx: null});
      while (trees.length > 0) {
        var item = trees.pop();
        if (item.diff === 0) {
          if (item.ids[0] === t2.ids[0]) {
            candidateParents.push(item);
          }
          continue;
        }
        var elements = item.ids[2];
        for (var j = 0, elementsLen = elements.length; j < elementsLen; j++) {
          trees.push({
            ids: elements[j],
            diff: item.diff - 1,
            parent: item.ids,
            parentIdx: j
          });
        }
      }

      var el = candidateParents[0];

      if (!el) {
        restree.push(branch);
      } else {
        res = mergeTree(el.ids, t2.ids);
        el.parent[2][el.parentIdx] = res.tree;
        restree.push({pos: t1.pos, ids: t1.ids});
        conflicts = conflicts || res.conflicts;
        merged = true;
      }
    } else {
      restree.push(branch);
    }
  }

  // We didnt find
  if (!merged) {
    restree.push(path);
  }

  restree.sort(sortByPos$1);

  return {
    tree: restree,
    conflicts: conflicts || 'internal_node'
  };
}

// To ensure we dont grow the revision tree infinitely, we stem old revisions
function stem(tree, depth) {
  // First we break out the tree into a complete list of root to leaf paths
  var paths = rootToLeaf(tree);
  var stemmedRevs;

  var result;
  for (var i = 0, len = paths.length; i < len; i++) {
    // Then for each path, we cut off the start of the path based on the
    // `depth` to stem to, and generate a new set of flat trees
    var path = paths[i];
    var stemmed = path.ids;
    var node;
    if (stemmed.length > depth) {
      // only do the stemming work if we actually need to stem
      if (!stemmedRevs) {
        stemmedRevs = {}; // avoid allocating this object unnecessarily
      }
      var numStemmed = stemmed.length - depth;
      node = {
        pos: path.pos + numStemmed,
        ids: pathToTree(stemmed, numStemmed)
      };

      for (var s = 0; s < numStemmed; s++) {
        var rev = (path.pos + s) + '-' + stemmed[s].id;
        stemmedRevs[rev] = true;
      }
    } else { // no need to actually stem
      node = {
        pos: path.pos,
        ids: pathToTree(stemmed, 0)
      };
    }

    // Then we remerge all those flat trees together, ensuring that we dont
    // connect trees that would go beyond the depth limit
    if (result) {
      result = doMerge(result, node, true).tree;
    } else {
      result = [node];
    }
  }

  // this is memory-heavy per Chrome profiler, avoid unless we actually stemmed
  if (stemmedRevs) {
    traverseRevTree(result, function (isLeaf, pos, revHash) {
      // some revisions may have been removed in a branch but not in another
      delete stemmedRevs[pos + '-' + revHash];
    });
  }

  return {
    tree: result,
    revs: stemmedRevs ? Object.keys(stemmedRevs) : []
  };
}

function merge(tree, path, depth) {
  var newTree = doMerge(tree, path);
  var stemmed = stem(newTree.tree, depth);
  return {
    tree: stemmed.tree,
    stemmedRevs: stemmed.revs,
    conflicts: newTree.conflicts
  };
}

// return true if a rev exists in the rev tree, false otherwise
function revExists(revs, rev) {
  var toVisit = revs.slice();
  var splitRev = rev.split('-');
  var targetPos = parseInt(splitRev[0], 10);
  var targetId = splitRev[1];

  var node;
  while ((node = toVisit.pop())) {
    if (node.pos === targetPos && node.ids[0] === targetId) {
      return true;
    }
    var branches = node.ids[2];
    for (var i = 0, len = branches.length; i < len; i++) {
      toVisit.push({pos: node.pos + 1, ids: branches[i]});
    }
  }
  return false;
}

function getTrees(node) {
  return node.ids;
}

// check if a specific revision of a doc has been deleted
//  - metadata: the metadata object from the doc store
//  - rev: (optional) the revision to check. defaults to winning revision
function isDeleted(metadata, rev) {
  if (!rev) {
    rev = winningRev(metadata);
  }
  var id = rev.substring(rev.indexOf('-') + 1);
  var toVisit = metadata.rev_tree.map(getTrees);

  var tree;
  while ((tree = toVisit.pop())) {
    if (tree[0] === id) {
      return !!tree[1].deleted;
    }
    toVisit = toVisit.concat(tree[2]);
  }
}

function isLocalId(id) {
  return (/^_local/).test(id);
}

// returns the current leaf node for a given revision
function latest(rev, metadata) {
  var toVisit = metadata.rev_tree.slice();
  var node;
  while ((node = toVisit.pop())) {
    var pos = node.pos;
    var tree = node.ids;
    var id = tree[0];
    var opts = tree[1];
    var branches = tree[2];
    var isLeaf = branches.length === 0;

    var history = node.history ? node.history.slice() : [];
    history.push({id: id, pos: pos, opts: opts});

    if (isLeaf) {
      for (var i = 0, len = history.length; i < len; i++) {
        var historyNode = history[i];
        var historyRev = historyNode.pos + '-' + historyNode.id;

        if (historyRev === rev) {
          // return the rev of this leaf
          return pos + '-' + id;
        }
      }
    }

    for (var j = 0, l = branches.length; j < l; j++) {
      toVisit.push({pos: pos + 1, ids: branches[j], history: history});
    }
  }

  /* istanbul ignore next */
  throw new Error('Unable to resolve latest revision for id ' + metadata.id + ', rev ' + rev);
}

inherits(Changes$1, events.EventEmitter);

function tryCatchInChangeListener(self, change, pending, lastSeq) {
  // isolate try/catches to avoid V8 deoptimizations
  try {
    self.emit('change', change, pending, lastSeq);
  } catch (e) {
    guardedConsole('error', 'Error in .on("change", function):', e);
  }
}

function Changes$1(db, opts, callback) {
  events.EventEmitter.call(this);
  var self = this;
  this.db = db;
  opts = opts ? clone(opts) : {};
  var complete = opts.complete = once(function (err, resp) {
    if (err) {
      if (listenerCount(self, 'error') > 0) {
        self.emit('error', err);
      }
    } else {
      self.emit('complete', resp);
    }
    self.removeAllListeners();
    db.removeListener('destroyed', onDestroy);
  });
  if (callback) {
    self.on('complete', function (resp) {
      callback(null, resp);
    });
    self.on('error', callback);
  }
  function onDestroy() {
    self.cancel();
  }
  db.once('destroyed', onDestroy);

  opts.onChange = function (change, pending, lastSeq) {
    /* istanbul ignore if */
    if (self.isCancelled) {
      return;
    }
    tryCatchInChangeListener(self, change, pending, lastSeq);
  };

  var promise = new Promise(function (fulfill, reject) {
    opts.complete = function (err, res) {
      if (err) {
        reject(err);
      } else {
        fulfill(res);
      }
    };
  });
  self.once('cancel', function () {
    db.removeListener('destroyed', onDestroy);
    opts.complete(null, {status: 'cancelled'});
  });
  this.then = promise.then.bind(promise);
  this['catch'] = promise['catch'].bind(promise);
  this.then(function (result) {
    complete(null, result);
  }, complete);



  if (!db.taskqueue.isReady) {
    db.taskqueue.addTask(function (failed) {
      if (failed) {
        opts.complete(failed);
      } else if (self.isCancelled) {
        self.emit('cancel');
      } else {
        self.validateChanges(opts);
      }
    });
  } else {
    self.validateChanges(opts);
  }
}
Changes$1.prototype.cancel = function () {
  this.isCancelled = true;
  if (this.db.taskqueue.isReady) {
    this.emit('cancel');
  }
};
function processChange(doc, metadata, opts) {
  var changeList = [{rev: doc._rev}];
  if (opts.style === 'all_docs') {
    changeList = collectLeaves(metadata.rev_tree)
    .map(function (x) { return {rev: x.rev}; });
  }
  var change = {
    id: metadata.id,
    changes: changeList,
    doc: doc
  };

  if (isDeleted(metadata, doc._rev)) {
    change.deleted = true;
  }
  if (opts.conflicts) {
    change.doc._conflicts = collectConflicts(metadata);
    if (!change.doc._conflicts.length) {
      delete change.doc._conflicts;
    }
  }
  return change;
}

Changes$1.prototype.validateChanges = function (opts) {
  var callback = opts.complete;
  var self = this;

  /* istanbul ignore else */
  if (PouchDB._changesFilterPlugin) {
    PouchDB._changesFilterPlugin.validate(opts, function (err) {
      if (err) {
        return callback(err);
      }
      self.doChanges(opts);
    });
  } else {
    self.doChanges(opts);
  }
};

Changes$1.prototype.doChanges = function (opts) {
  var self = this;
  var callback = opts.complete;

  opts = clone(opts);
  if ('live' in opts && !('continuous' in opts)) {
    opts.continuous = opts.live;
  }
  opts.processChange = processChange;

  if (opts.since === 'latest') {
    opts.since = 'now';
  }
  if (!opts.since) {
    opts.since = 0;
  }
  if (opts.since === 'now') {
    this.db.info().then(function (info) {
      /* istanbul ignore if */
      if (self.isCancelled) {
        callback(null, {status: 'cancelled'});
        return;
      }
      opts.since = info.update_seq;
      self.doChanges(opts);
    }, callback);
    return;
  }

  /* istanbul ignore else */
  if (PouchDB._changesFilterPlugin) {
    PouchDB._changesFilterPlugin.normalize(opts);
    if (PouchDB._changesFilterPlugin.shouldFilter(this, opts)) {
      return PouchDB._changesFilterPlugin.filter(this, opts);
    }
  } else {
    ['doc_ids', 'filter', 'selector', 'view'].forEach(function (key) {
      if (key in opts) {
        guardedConsole('warn',
          'The "' + key + '" option was passed in to changes/replicate, ' +
          'but pouchdb-changes-filter plugin is not installed, so it ' +
          'was ignored. Please install the plugin to enable filtering.'
        );
      }
    });
  }

  if (!('descending' in opts)) {
    opts.descending = false;
  }

  // 0 and 1 should return 1 document
  opts.limit = opts.limit === 0 ? 1 : opts.limit;
  opts.complete = callback;
  var newPromise = this.db._changes(opts);
  /* istanbul ignore else */
  if (newPromise && typeof newPromise.cancel === 'function') {
    var cancel = self.cancel;
    self.cancel = getArguments(function (args) {
      newPromise.cancel();
      cancel.apply(this, args);
    });
  }
};

/*
 * A generic pouch adapter
 */

function compare(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

// Wrapper for functions that call the bulkdocs api with a single doc,
// if the first result is an error, return an error
function yankError(callback, docId) {
  return function (err, results) {
    if (err || (results[0] && results[0].error)) {
      err = err || results[0];
      err.docId = docId;
      callback(err);
    } else {
      callback(null, results.length ? results[0]  : results);
    }
  };
}

// clean docs given to us by the user
function cleanDocs(docs) {
  for (var i = 0; i < docs.length; i++) {
    var doc = docs[i];
    if (doc._deleted) {
      delete doc._attachments; // ignore atts for deleted docs
    } else if (doc._attachments) {
      // filter out extraneous keys from _attachments
      var atts = Object.keys(doc._attachments);
      for (var j = 0; j < atts.length; j++) {
        var att = atts[j];
        doc._attachments[att] = pick(doc._attachments[att],
          ['data', 'digest', 'content_type', 'length', 'revpos', 'stub']);
      }
    }
  }
}

// compare two docs, first by _id then by _rev
function compareByIdThenRev(a, b) {
  var idCompare = compare(a._id, b._id);
  if (idCompare !== 0) {
    return idCompare;
  }
  var aStart = a._revisions ? a._revisions.start : 0;
  var bStart = b._revisions ? b._revisions.start : 0;
  return compare(aStart, bStart);
}

// for every node in a revision tree computes its distance from the closest
// leaf
function computeHeight(revs) {
  var height = {};
  var edges = [];
  traverseRevTree(revs, function (isLeaf, pos, id, prnt) {
    var rev = pos + "-" + id;
    if (isLeaf) {
      height[rev] = 0;
    }
    if (prnt !== undefined) {
      edges.push({from: prnt, to: rev});
    }
    return rev;
  });

  edges.reverse();
  edges.forEach(function (edge) {
    if (height[edge.from] === undefined) {
      height[edge.from] = 1 + height[edge.to];
    } else {
      height[edge.from] = Math.min(height[edge.from], 1 + height[edge.to]);
    }
  });
  return height;
}

function allDocsKeysParse(opts) {
  var keys =  ('limit' in opts) ?
    opts.keys.slice(opts.skip, opts.limit + opts.skip) :
    (opts.skip > 0) ? opts.keys.slice(opts.skip) : opts.keys;
  opts.keys = keys;
  opts.skip = 0;
  delete opts.limit;
  if (opts.descending) {
    keys.reverse();
    opts.descending = false;
  }
}

// all compaction is done in a queue, to avoid attaching
// too many listeners at once
function doNextCompaction(self) {
  var task = self._compactionQueue[0];
  var opts = task.opts;
  var callback = task.callback;
  self.get('_local/compaction').catch(function () {
    return false;
  }).then(function (doc) {
    if (doc && doc.last_seq) {
      opts.last_seq = doc.last_seq;
    }
    self._compact(opts, function (err, res) {
      /* istanbul ignore if */
      if (err) {
        callback(err);
      } else {
        callback(null, res);
      }
      nextTick(function () {
        self._compactionQueue.shift();
        if (self._compactionQueue.length) {
          doNextCompaction(self);
        }
      });
    });
  });
}

function attachmentNameError(name) {
  if (name.charAt(0) === '_') {
    return name + ' is not a valid attachment name, attachment ' +
      'names cannot start with \'_\'';
  }
  return false;
}

inherits(AbstractPouchDB, events.EventEmitter);

function AbstractPouchDB() {
  events.EventEmitter.call(this);

  // re-bind prototyped methods
  for (var p in AbstractPouchDB.prototype) {
    if (typeof this[p] === 'function') {
      this[p] = this[p].bind(this);
    }
  }
}

AbstractPouchDB.prototype.post =
  adapterFun('post', function (doc, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  if (typeof doc !== 'object' || Array.isArray(doc)) {
    return callback(createError(NOT_AN_OBJECT));
  }
  this.bulkDocs({docs: [doc]}, opts, yankError(callback, doc._id));
});

AbstractPouchDB.prototype.put = adapterFun('put', function (doc, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  if (typeof doc !== 'object' || Array.isArray(doc)) {
    return cb(createError(NOT_AN_OBJECT));
  }
  invalidIdError(doc._id);
  if (isLocalId(doc._id) && typeof this._putLocal === 'function') {
    if (doc._deleted) {
      return this._removeLocal(doc, cb);
    } else {
      return this._putLocal(doc, cb);
    }
  }
  var self = this;
  if (opts.force && doc._rev) {
    transformForceOptionToNewEditsOption();
    putDoc(function (err) {
      var result = err ? null : {ok: true, id: doc._id, rev: doc._rev};
      cb(err, result);
    });
  } else {
    putDoc(cb);
  }

  function transformForceOptionToNewEditsOption() {
    var parts = doc._rev.split('-');
    var oldRevId = parts[1];
    var oldRevNum = parseInt(parts[0], 10);

    var newRevNum = oldRevNum + 1;
    var newRevId = rev$$1();

    doc._revisions = {
      start: newRevNum,
      ids: [newRevId, oldRevId]
    };
    doc._rev = newRevNum + '-' + newRevId;
    opts.new_edits = false;
  }
  function putDoc(next) {
    if (typeof self._put === 'function' && opts.new_edits !== false) {
      self._put(doc, opts, next);
    } else {
      self.bulkDocs({docs: [doc]}, opts, yankError(next, doc._id));
    }
  }
});

AbstractPouchDB.prototype.putAttachment =
  adapterFun('putAttachment', function (docId, attachmentId, rev,
                                              blob, type) {
  var api = this;
  if (typeof type === 'function') {
    type = blob;
    blob = rev;
    rev = null;
  }
  // Lets fix in https://github.com/pouchdb/pouchdb/issues/3267
  /* istanbul ignore if */
  if (typeof type === 'undefined') {
    type = blob;
    blob = rev;
    rev = null;
  }
  if (!type) {
    guardedConsole('warn', 'Attachment', attachmentId, 'on document', docId, 'is missing content_type');
  }

  function createAttachment(doc) {
    var prevrevpos = '_rev' in doc ? parseInt(doc._rev, 10) : 0;
    doc._attachments = doc._attachments || {};
    doc._attachments[attachmentId] = {
      content_type: type,
      data: blob,
      revpos: ++prevrevpos
    };
    return api.put(doc);
  }

  return api.get(docId).then(function (doc) {
    if (doc._rev !== rev) {
      throw createError(REV_CONFLICT);
    }

    return createAttachment(doc);
  }, function (err) {
     // create new doc
    /* istanbul ignore else */
    if (err.reason === MISSING_DOC.message) {
      return createAttachment({_id: docId});
    } else {
      throw err;
    }
  });
});

AbstractPouchDB.prototype.removeAttachment =
  adapterFun('removeAttachment', function (docId, attachmentId, rev,
                                                 callback) {
  var self = this;
  self.get(docId, function (err, obj) {
    /* istanbul ignore if */
    if (err) {
      callback(err);
      return;
    }
    if (obj._rev !== rev) {
      callback(createError(REV_CONFLICT));
      return;
    }
    /* istanbul ignore if */
    if (!obj._attachments) {
      return callback();
    }
    delete obj._attachments[attachmentId];
    if (Object.keys(obj._attachments).length === 0) {
      delete obj._attachments;
    }
    self.put(obj, callback);
  });
});

AbstractPouchDB.prototype.remove =
  adapterFun('remove', function (docOrId, optsOrRev, opts, callback) {
  var doc;
  if (typeof optsOrRev === 'string') {
    // id, rev, opts, callback style
    doc = {
      _id: docOrId,
      _rev: optsOrRev
    };
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
  } else {
    // doc, opts, callback style
    doc = docOrId;
    if (typeof optsOrRev === 'function') {
      callback = optsOrRev;
      opts = {};
    } else {
      callback = opts;
      opts = optsOrRev;
    }
  }
  opts = opts || {};
  opts.was_delete = true;
  var newDoc = {_id: doc._id, _rev: (doc._rev || opts.rev)};
  newDoc._deleted = true;
  if (isLocalId(newDoc._id) && typeof this._removeLocal === 'function') {
    return this._removeLocal(doc, callback);
  }
  this.bulkDocs({docs: [newDoc]}, opts, yankError(callback, newDoc._id));
});

AbstractPouchDB.prototype.revsDiff =
  adapterFun('revsDiff', function (req, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  var ids = Object.keys(req);

  if (!ids.length) {
    return callback(null, {});
  }

  var count = 0;
  var missing = new ExportedMap();

  function addToMissing(id, revId) {
    if (!missing.has(id)) {
      missing.set(id, {missing: []});
    }
    missing.get(id).missing.push(revId);
  }

  function processDoc(id, rev_tree) {
    // Is this fast enough? Maybe we should switch to a set simulated by a map
    var missingForId = req[id].slice(0);
    traverseRevTree(rev_tree, function (isLeaf, pos, revHash, ctx,
      opts) {
        var rev = pos + '-' + revHash;
        var idx = missingForId.indexOf(rev);
        if (idx === -1) {
          return;
        }

        missingForId.splice(idx, 1);
        /* istanbul ignore if */
        if (opts.status !== 'available') {
          addToMissing(id, rev);
        }
      });

    // Traversing the tree is synchronous, so now `missingForId` contains
    // revisions that were not found in the tree
    missingForId.forEach(function (rev) {
      addToMissing(id, rev);
    });
  }

  ids.map(function (id) {
    this._getRevisionTree(id, function (err, rev_tree) {
      if (err && err.status === 404 && err.message === 'missing') {
        missing.set(id, {missing: req[id]});
      } else if (err) {
        /* istanbul ignore next */
        return callback(err);
      } else {
        processDoc(id, rev_tree);
      }

      if (++count === ids.length) {
        // convert LazyMap to object
        var missingObj = {};
        missing.forEach(function (value, key) {
          missingObj[key] = value;
        });
        return callback(null, missingObj);
      }
    });
  }, this);
});

// _bulk_get API for faster replication, as described in
// https://github.com/apache/couchdb-chttpd/pull/33
// At the "abstract" level, it will just run multiple get()s in
// parallel, because this isn't much of a performance cost
// for local databases (except the cost of multiple transactions, which is
// small). The http adapter overrides this in order
// to do a more efficient single HTTP request.
AbstractPouchDB.prototype.bulkGet =
  adapterFun('bulkGet', function (opts, callback) {
  bulkGet(this, opts, callback);
});

// compact one document and fire callback
// by compacting we mean removing all revisions which
// are further from the leaf in revision tree than max_height
AbstractPouchDB.prototype.compactDocument =
  adapterFun('compactDocument', function (docId, maxHeight, callback) {
  var self = this;
  this._getRevisionTree(docId, function (err, revTree) {
    /* istanbul ignore if */
    if (err) {
      return callback(err);
    }
    var height = computeHeight(revTree);
    var candidates = [];
    var revs = [];
    Object.keys(height).forEach(function (rev) {
      if (height[rev] > maxHeight) {
        candidates.push(rev);
      }
    });

    traverseRevTree(revTree, function (isLeaf, pos, revHash, ctx, opts) {
      var rev = pos + '-' + revHash;
      if (opts.status === 'available' && candidates.indexOf(rev) !== -1) {
        revs.push(rev);
      }
    });
    self._doCompaction(docId, revs, callback);
  });
});

// compact the whole database using single document
// compaction
AbstractPouchDB.prototype.compact =
  adapterFun('compact', function (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  var self = this;
  opts = opts || {};

  self._compactionQueue = self._compactionQueue || [];
  self._compactionQueue.push({opts: opts, callback: callback});
  if (self._compactionQueue.length === 1) {
    doNextCompaction(self);
  }
});
AbstractPouchDB.prototype._compact = function (opts, callback) {
  var self = this;
  var changesOpts = {
    return_docs: false,
    last_seq: opts.last_seq || 0
  };
  var promises = [];

  function onChange(row) {
    promises.push(self.compactDocument(row.id, 0));
  }
  function onComplete(resp) {
    var lastSeq = resp.last_seq;
    Promise.all(promises).then(function () {
      return upsert(self, '_local/compaction', function deltaFunc(doc) {
        if (!doc.last_seq || doc.last_seq < lastSeq) {
          doc.last_seq = lastSeq;
          return doc;
        }
        return false; // somebody else got here first, don't update
      });
    }).then(function () {
      callback(null, {ok: true});
    }).catch(callback);
  }
  self.changes(changesOpts)
    .on('change', onChange)
    .on('complete', onComplete)
    .on('error', callback);
};

/* Begin api wrappers. Specific functionality to storage belongs in the
   _[method] */
AbstractPouchDB.prototype.get = adapterFun('get', function (id, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  if (typeof id !== 'string') {
    return cb(createError(INVALID_ID));
  }
  if (isLocalId(id) && typeof this._getLocal === 'function') {
    return this._getLocal(id, cb);
  }
  var leaves = [], self = this;

  function finishOpenRevs() {
    var result = [];
    var count = leaves.length;
    /* istanbul ignore if */
    if (!count) {
      return cb(null, result);
    }

    // order with open_revs is unspecified
    leaves.forEach(function (leaf) {
      self.get(id, {
        rev: leaf,
        revs: opts.revs,
        latest: opts.latest,
        attachments: opts.attachments,
        binary: opts.binary
      }, function (err, doc) {
        if (!err) {
          // using latest=true can produce duplicates
          var existing;
          for (var i = 0, l = result.length; i < l; i++) {
            if (result[i].ok && result[i].ok._rev === doc._rev) {
              existing = true;
              break;
            }
          }
          if (!existing) {
            result.push({ok: doc});
          }
        } else {
          result.push({missing: leaf});
        }
        count--;
        if (!count) {
          cb(null, result);
        }
      });
    });
  }

  if (opts.open_revs) {
    if (opts.open_revs === "all") {
      this._getRevisionTree(id, function (err, rev_tree) {
        /* istanbul ignore if */
        if (err) {
          return cb(err);
        }
        leaves = collectLeaves(rev_tree).map(function (leaf) {
          return leaf.rev;
        });
        finishOpenRevs();
      });
    } else {
      if (Array.isArray(opts.open_revs)) {
        leaves = opts.open_revs;
        for (var i = 0; i < leaves.length; i++) {
          var l = leaves[i];
          // looks like it's the only thing couchdb checks
          if (!(typeof (l) === "string" && /^\d+-/.test(l))) {
            return cb(createError(INVALID_REV));
          }
        }
        finishOpenRevs();
      } else {
        return cb(createError(UNKNOWN_ERROR, 'function_clause'));
      }
    }
    return; // open_revs does not like other options
  }

  return this._get(id, opts, function (err, result) {
    if (err) {
      err.docId = id;
      return cb(err);
    }

    var doc = result.doc;
    var metadata = result.metadata;
    var ctx = result.ctx;

    if (opts.conflicts) {
      var conflicts = collectConflicts(metadata);
      if (conflicts.length) {
        doc._conflicts = conflicts;
      }
    }

    if (isDeleted(metadata, doc._rev)) {
      doc._deleted = true;
    }

    if (opts.revs || opts.revs_info) {
      var splittedRev = doc._rev.split('-');
      var revNo       = parseInt(splittedRev[0], 10);
      var revHash     = splittedRev[1];

      var paths = rootToLeaf(metadata.rev_tree);
      var path = null;

      for (var i = 0; i < paths.length; i++) {
        var currentPath = paths[i];
        var hashIndex = currentPath.ids.map(function (x) { return x.id; })
          .indexOf(revHash);
        var hashFoundAtRevPos = hashIndex === (revNo - 1);

        if (hashFoundAtRevPos || (!path && hashIndex !== -1)) {
          path = currentPath;
        }
      }

      var indexOfRev = path.ids.map(function (x) { return x.id; })
        .indexOf(doc._rev.split('-')[1]) + 1;
      var howMany = path.ids.length - indexOfRev;
      path.ids.splice(indexOfRev, howMany);
      path.ids.reverse();

      if (opts.revs) {
        doc._revisions = {
          start: (path.pos + path.ids.length) - 1,
          ids: path.ids.map(function (rev) {
            return rev.id;
          })
        };
      }
      if (opts.revs_info) {
        var pos =  path.pos + path.ids.length;
        doc._revs_info = path.ids.map(function (rev) {
          pos--;
          return {
            rev: pos + '-' + rev.id,
            status: rev.opts.status
          };
        });
      }
    }

    if (opts.attachments && doc._attachments) {
      var attachments = doc._attachments;
      var count = Object.keys(attachments).length;
      if (count === 0) {
        return cb(null, doc);
      }
      Object.keys(attachments).forEach(function (key) {
        this._getAttachment(doc._id, key, attachments[key], {
          // Previously the revision handling was done in adapter.js
          // getAttachment, however since idb-next doesnt we need to
          // pass the rev through
          rev: doc._rev,
          binary: opts.binary,
          ctx: ctx
        }, function (err, data) {
          var att = doc._attachments[key];
          att.data = data;
          delete att.stub;
          delete att.length;
          if (!--count) {
            cb(null, doc);
          }
        });
      }, self);
    } else {
      if (doc._attachments) {
        for (var key in doc._attachments) {
          /* istanbul ignore else */
          if (doc._attachments.hasOwnProperty(key)) {
            doc._attachments[key].stub = true;
          }
        }
      }
      cb(null, doc);
    }
  });
});

// TODO: I dont like this, it forces an extra read for every
// attachment read and enforces a confusing api between
// adapter.js and the adapter implementation
AbstractPouchDB.prototype.getAttachment =
  adapterFun('getAttachment', function (docId, attachmentId, opts, callback) {
  var self = this;
  if (opts instanceof Function) {
    callback = opts;
    opts = {};
  }
  this._get(docId, opts, function (err, res) {
    if (err) {
      return callback(err);
    }
    if (res.doc._attachments && res.doc._attachments[attachmentId]) {
      opts.ctx = res.ctx;
      opts.binary = true;
      self._getAttachment(docId, attachmentId,
                          res.doc._attachments[attachmentId], opts, callback);
    } else {
      return callback(createError(MISSING_DOC));
    }
  });
});

AbstractPouchDB.prototype.allDocs =
  adapterFun('allDocs', function (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  opts.skip = typeof opts.skip !== 'undefined' ? opts.skip : 0;
  if (opts.start_key) {
    opts.startkey = opts.start_key;
  }
  if (opts.end_key) {
    opts.endkey = opts.end_key;
  }
  if ('keys' in opts) {
    if (!Array.isArray(opts.keys)) {
      return callback(new TypeError('options.keys must be an array'));
    }
    var incompatibleOpt =
      ['startkey', 'endkey', 'key'].filter(function (incompatibleOpt) {
      return incompatibleOpt in opts;
    })[0];
    if (incompatibleOpt) {
      callback(createError(QUERY_PARSE_ERROR,
        'Query parameter `' + incompatibleOpt +
        '` is not compatible with multi-get'
      ));
      return;
    }
    if (!isRemote(this)) {
      allDocsKeysParse(opts);
      if (opts.keys.length === 0) {
        return this._allDocs({limit: 0}, callback);
      }
    }
  }

  return this._allDocs(opts, callback);
});

AbstractPouchDB.prototype.changes = function (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  opts = opts || {};

  // By default set return_docs to false if the caller has opts.live = true,
  // this will prevent us from collecting the set of changes indefinitely
  // resulting in growing memory
  opts.return_docs = ('return_docs' in opts) ? opts.return_docs : !opts.live;

  return new Changes$1(this, opts, callback);
};

AbstractPouchDB.prototype.close = adapterFun('close', function (callback) {
  this._closed = true;
  this.emit('closed');
  return this._close(callback);
});

AbstractPouchDB.prototype.info = adapterFun('info', function (callback) {
  var self = this;
  this._info(function (err, info) {
    if (err) {
      return callback(err);
    }
    // assume we know better than the adapter, unless it informs us
    info.db_name = info.db_name || self.name;
    info.auto_compaction = !!(self.auto_compaction && !isRemote(self));
    info.adapter = self.adapter;
    callback(null, info);
  });
});

AbstractPouchDB.prototype.id = adapterFun('id', function (callback) {
  return this._id(callback);
});

/* istanbul ignore next */
AbstractPouchDB.prototype.type = function () {
  return (typeof this._type === 'function') ? this._type() : this.adapter;
};

AbstractPouchDB.prototype.bulkDocs =
  adapterFun('bulkDocs', function (req, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  opts = opts || {};

  if (Array.isArray(req)) {
    req = {
      docs: req
    };
  }

  if (!req || !req.docs || !Array.isArray(req.docs)) {
    return callback(createError(MISSING_BULK_DOCS));
  }

  for (var i = 0; i < req.docs.length; ++i) {
    if (typeof req.docs[i] !== 'object' || Array.isArray(req.docs[i])) {
      return callback(createError(NOT_AN_OBJECT));
    }
  }

  var attachmentError;
  req.docs.forEach(function (doc) {
    if (doc._attachments) {
      Object.keys(doc._attachments).forEach(function (name) {
        attachmentError = attachmentError || attachmentNameError(name);
        if (!doc._attachments[name].content_type) {
          guardedConsole('warn', 'Attachment', name, 'on document', doc._id, 'is missing content_type');
        }
      });
    }
  });

  if (attachmentError) {
    return callback(createError(BAD_REQUEST, attachmentError));
  }

  if (!('new_edits' in opts)) {
    if ('new_edits' in req) {
      opts.new_edits = req.new_edits;
    } else {
      opts.new_edits = true;
    }
  }

  var adapter = this;
  if (!opts.new_edits && !isRemote(adapter)) {
    // ensure revisions of the same doc are sorted, so that
    // the local adapter processes them correctly (#2935)
    req.docs.sort(compareByIdThenRev);
  }

  cleanDocs(req.docs);

  // in the case of conflicts, we want to return the _ids to the user
  // however, the underlying adapter may destroy the docs array, so
  // create a copy here
  var ids = req.docs.map(function (doc) {
    return doc._id;
  });

  return this._bulkDocs(req, opts, function (err, res) {
    if (err) {
      return callback(err);
    }
    if (!opts.new_edits) {
      // this is what couch does when new_edits is false
      res = res.filter(function (x) {
        return x.error;
      });
    }
    // add ids for error/conflict responses (not required for CouchDB)
    if (!isRemote(adapter)) {
      for (var i = 0, l = res.length; i < l; i++) {
        res[i].id = res[i].id || ids[i];
      }
    }

    callback(null, res);
  });
});

AbstractPouchDB.prototype.registerDependentDatabase =
  adapterFun('registerDependentDatabase', function (dependentDb,
                                                          callback) {
  var depDB = new this.constructor(dependentDb, this.__opts);

  function diffFun(doc) {
    doc.dependentDbs = doc.dependentDbs || {};
    if (doc.dependentDbs[dependentDb]) {
      return false; // no update required
    }
    doc.dependentDbs[dependentDb] = true;
    return doc;
  }
  upsert(this, '_local/_pouch_dependentDbs', diffFun)
    .then(function () {
      callback(null, {db: depDB});
    }).catch(callback);
});

AbstractPouchDB.prototype.destroy =
  adapterFun('destroy', function (opts, callback) {

  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  var self = this;
  var usePrefix = 'use_prefix' in self ? self.use_prefix : true;

  function destroyDb() {
    // call destroy method of the particular adaptor
    self._destroy(opts, function (err, resp) {
      if (err) {
        return callback(err);
      }
      self._destroyed = true;
      self.emit('destroyed');
      callback(null, resp || { 'ok': true });
    });
  }

  if (isRemote(self)) {
    // no need to check for dependent DBs if it's a remote DB
    return destroyDb();
  }

  self.get('_local/_pouch_dependentDbs', function (err, localDoc) {
    if (err) {
      /* istanbul ignore if */
      if (err.status !== 404) {
        return callback(err);
      } else { // no dependencies
        return destroyDb();
      }
    }
    var dependentDbs = localDoc.dependentDbs;
    var PouchDB = self.constructor;
    var deletedMap = Object.keys(dependentDbs).map(function (name) {
      // use_prefix is only false in the browser
      /* istanbul ignore next */
      var trueName = usePrefix ?
        name.replace(new RegExp('^' + PouchDB.prefix), '') : name;
      return new PouchDB(trueName, self.__opts).destroy();
    });
    Promise.all(deletedMap).then(destroyDb, callback);
  });
});

function TaskQueue() {
  this.isReady = false;
  this.failed = false;
  this.queue = [];
}

TaskQueue.prototype.execute = function () {
  var fun;
  if (this.failed) {
    while ((fun = this.queue.shift())) {
      fun(this.failed);
    }
  } else {
    while ((fun = this.queue.shift())) {
      fun();
    }
  }
};

TaskQueue.prototype.fail = function (err) {
  this.failed = err;
  this.execute();
};

TaskQueue.prototype.ready = function (db) {
  this.isReady = true;
  this.db = db;
  this.execute();
};

TaskQueue.prototype.addTask = function (fun) {
  this.queue.push(fun);
  if (this.failed) {
    this.execute();
  }
};

function parseAdapter(name, opts) {
  var match = name.match(/([a-z-]*):\/\/(.*)/);
  if (match) {
    // the http adapter expects the fully qualified name
    return {
      name: /https?/.test(match[1]) ? match[1] + '://' + match[2] : match[2],
      adapter: match[1]
    };
  }

  var adapters = PouchDB.adapters;
  var preferredAdapters = PouchDB.preferredAdapters;
  var prefix = PouchDB.prefix;
  var adapterName = opts.adapter;

  if (!adapterName) { // automatically determine adapter
    for (var i = 0; i < preferredAdapters.length; ++i) {
      adapterName = preferredAdapters[i];
      // check for browsers that have been upgraded from websql-only to websql+idb
      /* istanbul ignore if */
      if (adapterName === 'idb' && 'websql' in adapters &&
          hasLocalStorage() && localStorage['_pouch__websqldb_' + prefix + name]) {
        // log it, because this can be confusing during development
        guardedConsole('log', 'PouchDB is downgrading "' + name + '" to WebSQL to' +
          ' avoid data loss, because it was already opened with WebSQL.');
        continue; // keep using websql to avoid user data loss
      }
      break;
    }
  }

  var adapter = adapters[adapterName];

  // if adapter is invalid, then an error will be thrown later
  var usePrefix = (adapter && 'use_prefix' in adapter) ?
    adapter.use_prefix : true;

  return {
    name: usePrefix ? (prefix + name) : name,
    adapter: adapterName
  };
}

// OK, so here's the deal. Consider this code:
//     var db1 = new PouchDB('foo');
//     var db2 = new PouchDB('foo');
//     db1.destroy();
// ^ these two both need to emit 'destroyed' events,
// as well as the PouchDB constructor itself.
// So we have one db object (whichever one got destroy() called on it)
// responsible for emitting the initial event, which then gets emitted
// by the constructor, which then broadcasts it to any other dbs
// that may have been created with the same name.
function prepareForDestruction(self) {

  function onDestroyed(from_constructor) {
    self.removeListener('closed', onClosed);
    if (!from_constructor) {
      self.constructor.emit('destroyed', self.name);
    }
  }

  function onClosed() {
    self.removeListener('destroyed', onDestroyed);
    self.constructor.emit('unref', self);
  }

  self.once('destroyed', onDestroyed);
  self.once('closed', onClosed);
  self.constructor.emit('ref', self);
}

inherits(PouchDB, AbstractPouchDB);
function PouchDB(name, opts) {
  // In Node our test suite only tests this for PouchAlt unfortunately
  /* istanbul ignore if */
  if (!(this instanceof PouchDB)) {
    return new PouchDB(name, opts);
  }

  var self = this;
  opts = opts || {};

  if (name && typeof name === 'object') {
    opts = name;
    name = opts.name;
    delete opts.name;
  }

  if (opts.deterministic_revs === undefined) {
    opts.deterministic_revs = true;
  }

  this.__opts = opts = clone(opts);

  self.auto_compaction = opts.auto_compaction;
  self.prefix = PouchDB.prefix;

  if (typeof name !== 'string') {
    throw new Error('Missing/invalid DB name');
  }

  var prefixedName = (opts.prefix || '') + name;
  var backend = parseAdapter(prefixedName, opts);

  opts.name = backend.name;
  opts.adapter = opts.adapter || backend.adapter;

  self.name = name;
  self._adapter = opts.adapter;
  PouchDB.emit('debug', ['adapter', 'Picked adapter: ', opts.adapter]);

  if (!PouchDB.adapters[opts.adapter] ||
      !PouchDB.adapters[opts.adapter].valid()) {
    throw new Error('Invalid Adapter: ' + opts.adapter);
  }

  AbstractPouchDB.call(self);
  self.taskqueue = new TaskQueue();

  self.adapter = opts.adapter;

  PouchDB.adapters[opts.adapter].call(self, opts, function (err) {
    if (err) {
      return self.taskqueue.fail(err);
    }
    prepareForDestruction(self);

    self.emit('created', self);
    PouchDB.emit('created', self.name);
    self.taskqueue.ready(self);
  });

}

// AbortController was introduced quite a while after fetch and
// isnt required for PouchDB to function so polyfill if needed
var a = (typeof AbortController !== 'undefined')
    ? AbortController
    : function () { return {abort: function () {}}; };

var f$1 = fetch;
var h = Headers;

PouchDB.adapters = {};
PouchDB.preferredAdapters = [];

PouchDB.prefix = '_pouch_';

var eventEmitter = new events.EventEmitter();

function setUpEventEmitter(Pouch) {
  Object.keys(events.EventEmitter.prototype).forEach(function (key) {
    if (typeof events.EventEmitter.prototype[key] === 'function') {
      Pouch[key] = eventEmitter[key].bind(eventEmitter);
    }
  });

  // these are created in constructor.js, and allow us to notify each DB with
  // the same name that it was destroyed, via the constructor object
  var destructListeners = Pouch._destructionListeners = new ExportedMap();

  Pouch.on('ref', function onConstructorRef(db) {
    if (!destructListeners.has(db.name)) {
      destructListeners.set(db.name, []);
    }
    destructListeners.get(db.name).push(db);
  });

  Pouch.on('unref', function onConstructorUnref(db) {
    if (!destructListeners.has(db.name)) {
      return;
    }
    var dbList = destructListeners.get(db.name);
    var pos = dbList.indexOf(db);
    if (pos < 0) {
      /* istanbul ignore next */
      return;
    }
    dbList.splice(pos, 1);
    if (dbList.length > 1) {
      /* istanbul ignore next */
      destructListeners.set(db.name, dbList);
    } else {
      destructListeners.delete(db.name);
    }
  });

  Pouch.on('destroyed', function onConstructorDestroyed(name) {
    if (!destructListeners.has(name)) {
      return;
    }
    var dbList = destructListeners.get(name);
    destructListeners.delete(name);
    dbList.forEach(function (db) {
      db.emit('destroyed',true);
    });
  });
}

setUpEventEmitter(PouchDB);

PouchDB.adapter = function (id, obj, addToPreferredAdapters) {
  /* istanbul ignore else */
  if (obj.valid()) {
    PouchDB.adapters[id] = obj;
    if (addToPreferredAdapters) {
      PouchDB.preferredAdapters.push(id);
    }
  }
};

PouchDB.plugin = function (obj) {
  if (typeof obj === 'function') { // function style for plugins
    obj(PouchDB);
  } else if (typeof obj !== 'object' || Object.keys(obj).length === 0) {
    throw new Error('Invalid plugin: got "' + obj + '", expected an object or a function');
  } else {
    Object.keys(obj).forEach(function (id) { // object style for plugins
      PouchDB.prototype[id] = obj[id];
    });
  }
  if (this.__defaults) {
    PouchDB.__defaults = $inject_Object_assign({}, this.__defaults);
  }
  return PouchDB;
};

PouchDB.defaults = function (defaultOpts) {
  function PouchAlt(name, opts) {
    if (!(this instanceof PouchAlt)) {
      return new PouchAlt(name, opts);
    }

    opts = opts || {};

    if (name && typeof name === 'object') {
      opts = name;
      name = opts.name;
      delete opts.name;
    }

    opts = $inject_Object_assign({}, PouchAlt.__defaults, opts);
    PouchDB.call(this, name, opts);
  }

  inherits(PouchAlt, PouchDB);

  PouchAlt.preferredAdapters = PouchDB.preferredAdapters.slice();
  Object.keys(PouchDB).forEach(function (key) {
    if (!(key in PouchAlt)) {
      PouchAlt[key] = PouchDB[key];
    }
  });

  // make default options transitive
  // https://github.com/pouchdb/pouchdb/issues/5922
  PouchAlt.__defaults = $inject_Object_assign({}, this.__defaults, defaultOpts);

  return PouchAlt;
};

PouchDB.fetch = function (url, opts) {
  return f$1(url, opts);
};

// managed automatically by set-version.js
var version = "7.0.0";

// this would just be "return doc[field]", but fields
// can be "deep" due to dot notation
function getFieldFromDoc(doc, parsedField) {
  var value = doc;
  for (var i = 0, len = parsedField.length; i < len; i++) {
    var key = parsedField[i];
    value = value[key];
    if (!value) {
      break;
    }
  }
  return value;
}

function compare$1(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

// Converts a string in dot notation to an array of its components, with backslash escaping
function parseField(fieldName) {
  // fields may be deep (e.g. "foo.bar.baz"), so parse
  var fields = [];
  var current = '';
  for (var i = 0, len = fieldName.length; i < len; i++) {
    var ch = fieldName[i];
    if (ch === '.') {
      if (i > 0 && fieldName[i - 1] === '\\') { // escaped delimiter
        current = current.substring(0, current.length - 1) + '.';
      } else { // not escaped, so delimiter
        fields.push(current);
        current = '';
      }
    } else { // normal character
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

var combinationFields = ['$or', '$nor', '$not'];
function isCombinationalField(field) {
  return combinationFields.indexOf(field) > -1;
}

function getKey(obj) {
  return Object.keys(obj)[0];
}

function getValue(obj) {
  return obj[getKey(obj)];
}


// flatten an array of selectors joined by an $and operator
function mergeAndedSelectors(selectors) {

  // sort to ensure that e.g. if the user specified
  // $and: [{$gt: 'a'}, {$gt: 'b'}], then it's collapsed into
  // just {$gt: 'b'}
  var res = {};

  selectors.forEach(function (selector) {
    Object.keys(selector).forEach(function (field) {
      var matcher = selector[field];
      if (typeof matcher !== 'object') {
        matcher = {$eq: matcher};
      }

      if (isCombinationalField(field)) {
        if (matcher instanceof Array) {
          res[field] = matcher.map(function (m) {
            return mergeAndedSelectors([m]);
          });
        } else {
          res[field] = mergeAndedSelectors([matcher]);
        }
      } else {
        var fieldMatchers = res[field] = res[field] || {};
        Object.keys(matcher).forEach(function (operator) {
          var value = matcher[operator];

          if (operator === '$gt' || operator === '$gte') {
            return mergeGtGte(operator, value, fieldMatchers);
          } else if (operator === '$lt' || operator === '$lte') {
            return mergeLtLte(operator, value, fieldMatchers);
          } else if (operator === '$ne') {
            return mergeNe(value, fieldMatchers);
          } else if (operator === '$eq') {
            return mergeEq(value, fieldMatchers);
          }
          fieldMatchers[operator] = value;
        });
      }
    });
  });

  return res;
}



// collapse logically equivalent gt/gte values
function mergeGtGte(operator, value, fieldMatchers) {
  if (typeof fieldMatchers.$eq !== 'undefined') {
    return; // do nothing
  }
  if (typeof fieldMatchers.$gte !== 'undefined') {
    if (operator === '$gte') {
      if (value > fieldMatchers.$gte) { // more specificity
        fieldMatchers.$gte = value;
      }
    } else { // operator === '$gt'
      if (value >= fieldMatchers.$gte) { // more specificity
        delete fieldMatchers.$gte;
        fieldMatchers.$gt = value;
      }
    }
  } else if (typeof fieldMatchers.$gt !== 'undefined') {
    if (operator === '$gte') {
      if (value > fieldMatchers.$gt) { // more specificity
        delete fieldMatchers.$gt;
        fieldMatchers.$gte = value;
      }
    } else { // operator === '$gt'
      if (value > fieldMatchers.$gt) { // more specificity
        fieldMatchers.$gt = value;
      }
    }
  } else {
    fieldMatchers[operator] = value;
  }
}

// collapse logically equivalent lt/lte values
function mergeLtLte(operator, value, fieldMatchers) {
  if (typeof fieldMatchers.$eq !== 'undefined') {
    return; // do nothing
  }
  if (typeof fieldMatchers.$lte !== 'undefined') {
    if (operator === '$lte') {
      if (value < fieldMatchers.$lte) { // more specificity
        fieldMatchers.$lte = value;
      }
    } else { // operator === '$gt'
      if (value <= fieldMatchers.$lte) { // more specificity
        delete fieldMatchers.$lte;
        fieldMatchers.$lt = value;
      }
    }
  } else if (typeof fieldMatchers.$lt !== 'undefined') {
    if (operator === '$lte') {
      if (value < fieldMatchers.$lt) { // more specificity
        delete fieldMatchers.$lt;
        fieldMatchers.$lte = value;
      }
    } else { // operator === '$gt'
      if (value < fieldMatchers.$lt) { // more specificity
        fieldMatchers.$lt = value;
      }
    }
  } else {
    fieldMatchers[operator] = value;
  }
}

// combine $ne values into one array
function mergeNe(value, fieldMatchers) {
  if ('$ne' in fieldMatchers) {
    // there are many things this could "not" be
    fieldMatchers.$ne.push(value);
  } else { // doesn't exist yet
    fieldMatchers.$ne = [value];
  }
}

// add $eq into the mix
function mergeEq(value, fieldMatchers) {
  // these all have less specificity than the $eq
  // TODO: check for user errors here
  delete fieldMatchers.$gt;
  delete fieldMatchers.$gte;
  delete fieldMatchers.$lt;
  delete fieldMatchers.$lte;
  delete fieldMatchers.$ne;
  fieldMatchers.$eq = value;
}


//
// normalize the selector
//
function massageSelector(input) {
  var result = clone(input);
  var wasAnded = false;
  if ('$and' in result) {
    result = mergeAndedSelectors(result['$and']);
    wasAnded = true;
  }

  ['$or', '$nor'].forEach(function (orOrNor) {
    if (orOrNor in result) {
      // message each individual selector
      // e.g. {foo: 'bar'} becomes {foo: {$eq: 'bar'}}
      result[orOrNor].forEach(function (subSelector) {
        var fields = Object.keys(subSelector);
        for (var i = 0; i < fields.length; i++) {
          var field = fields[i];
          var matcher = subSelector[field];
          if (typeof matcher !== 'object' || matcher === null) {
            subSelector[field] = {$eq: matcher};
          }
        }
      });
    }
  });

  if ('$not' in result) {
    //This feels a little like forcing, but it will work for now,
    //I would like to come back to this and make the merging of selectors a little more generic
    result['$not'] = mergeAndedSelectors([result['$not']]);
  }

  var fields = Object.keys(result);

  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    var matcher = result[field];

    if (typeof matcher !== 'object' || matcher === null) {
      matcher = {$eq: matcher};
    } else if ('$ne' in matcher && !wasAnded) {
      // I put these in an array, since there may be more than one
      // but in the "mergeAnded" operation, I already take care of that
      matcher.$ne = [matcher.$ne];
    }
    result[field] = matcher;
  }

  return result;
}

function pad(str, padWith, upToLength) {
  var padding = '';
  var targetLength = upToLength - str.length;
  /* istanbul ignore next */
  while (padding.length < targetLength) {
    padding += padWith;
  }
  return padding;
}

function padLeft(str, padWith, upToLength) {
  var padding = pad(str, padWith, upToLength);
  return padding + str;
}

var MIN_MAGNITUDE = -324; // verified by -Number.MIN_VALUE
var MAGNITUDE_DIGITS = 3; // ditto
var SEP = ''; // set to '_' for easier debugging 

function collate(a, b) {

  if (a === b) {
    return 0;
  }

  a = normalizeKey(a);
  b = normalizeKey(b);

  var ai = collationIndex(a);
  var bi = collationIndex(b);
  if ((ai - bi) !== 0) {
    return ai - bi;
  }
  switch (typeof a) {
    case 'number':
      return a - b;
    case 'boolean':
      return a < b ? -1 : 1;
    case 'string':
      return stringCollate(a, b);
  }
  return Array.isArray(a) ? arrayCollate(a, b) : objectCollate(a, b);
}

// couch considers null/NaN/Infinity/-Infinity === undefined,
// for the purposes of mapreduce indexes. also, dates get stringified.
function normalizeKey(key) {
  switch (typeof key) {
    case 'undefined':
      return null;
    case 'number':
      if (key === Infinity || key === -Infinity || isNaN(key)) {
        return null;
      }
      return key;
    case 'object':
      var origKey = key;
      if (Array.isArray(key)) {
        var len = key.length;
        key = new Array(len);
        for (var i = 0; i < len; i++) {
          key[i] = normalizeKey(origKey[i]);
        }
      /* istanbul ignore next */
      } else if (key instanceof Date) {
        return key.toJSON();
      } else if (key !== null) { // generic object
        key = {};
        for (var k in origKey) {
          if (origKey.hasOwnProperty(k)) {
            var val = origKey[k];
            if (typeof val !== 'undefined') {
              key[k] = normalizeKey(val);
            }
          }
        }
      }
  }
  return key;
}

function indexify(key) {
  if (key !== null) {
    switch (typeof key) {
      case 'boolean':
        return key ? 1 : 0;
      case 'number':
        return numToIndexableString(key);
      case 'string':
        // We've to be sure that key does not contain \u0000
        // Do order-preserving replacements:
        // 0 -> 1, 1
        // 1 -> 1, 2
        // 2 -> 2, 2
        /* eslint-disable no-control-regex */
        return key
          .replace(/\u0002/g, '\u0002\u0002')
          .replace(/\u0001/g, '\u0001\u0002')
          .replace(/\u0000/g, '\u0001\u0001');
        /* eslint-enable no-control-regex */
      case 'object':
        var isArray = Array.isArray(key);
        var arr = isArray ? key : Object.keys(key);
        var i = -1;
        var len = arr.length;
        var result = '';
        if (isArray) {
          while (++i < len) {
            result += toIndexableString(arr[i]);
          }
        } else {
          while (++i < len) {
            var objKey = arr[i];
            result += toIndexableString(objKey) +
                toIndexableString(key[objKey]);
          }
        }
        return result;
    }
  }
  return '';
}

// convert the given key to a string that would be appropriate
// for lexical sorting, e.g. within a database, where the
// sorting is the same given by the collate() function.
function toIndexableString(key) {
  var zero = '\u0000';
  key = normalizeKey(key);
  return collationIndex(key) + SEP + indexify(key) + zero;
}

function parseNumber(str, i) {
  var originalIdx = i;
  var num;
  var zero = str[i] === '1';
  if (zero) {
    num = 0;
    i++;
  } else {
    var neg = str[i] === '0';
    i++;
    var numAsString = '';
    var magAsString = str.substring(i, i + MAGNITUDE_DIGITS);
    var magnitude = parseInt(magAsString, 10) + MIN_MAGNITUDE;
    /* istanbul ignore next */
    if (neg) {
      magnitude = -magnitude;
    }
    i += MAGNITUDE_DIGITS;
    while (true) {
      var ch = str[i];
      if (ch === '\u0000') {
        break;
      } else {
        numAsString += ch;
      }
      i++;
    }
    numAsString = numAsString.split('.');
    if (numAsString.length === 1) {
      num = parseInt(numAsString, 10);
    } else {
      /* istanbul ignore next */
      num = parseFloat(numAsString[0] + '.' + numAsString[1]);
    }
    /* istanbul ignore next */
    if (neg) {
      num = num - 10;
    }
    /* istanbul ignore next */
    if (magnitude !== 0) {
      // parseFloat is more reliable than pow due to rounding errors
      // e.g. Number.MAX_VALUE would return Infinity if we did
      // num * Math.pow(10, magnitude);
      num = parseFloat(num + 'e' + magnitude);
    }
  }
  return {num: num, length : i - originalIdx};
}

// move up the stack while parsing
// this function moved outside of parseIndexableString for performance
function pop(stack, metaStack) {
  var obj = stack.pop();

  if (metaStack.length) {
    var lastMetaElement = metaStack[metaStack.length - 1];
    if (obj === lastMetaElement.element) {
      // popping a meta-element, e.g. an object whose value is another object
      metaStack.pop();
      lastMetaElement = metaStack[metaStack.length - 1];
    }
    var element = lastMetaElement.element;
    var lastElementIndex = lastMetaElement.index;
    if (Array.isArray(element)) {
      element.push(obj);
    } else if (lastElementIndex === stack.length - 2) { // obj with key+value
      var key = stack.pop();
      element[key] = obj;
    } else {
      stack.push(obj); // obj with key only
    }
  }
}

function parseIndexableString(str) {
  var stack = [];
  var metaStack = []; // stack for arrays and objects
  var i = 0;

  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (true) {
    var collationIndex = str[i++];
    if (collationIndex === '\u0000') {
      if (stack.length === 1) {
        return stack.pop();
      } else {
        pop(stack, metaStack);
        continue;
      }
    }
    switch (collationIndex) {
      case '1':
        stack.push(null);
        break;
      case '2':
        stack.push(str[i] === '1');
        i++;
        break;
      case '3':
        var parsedNum = parseNumber(str, i);
        stack.push(parsedNum.num);
        i += parsedNum.length;
        break;
      case '4':
        var parsedStr = '';
        /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
        while (true) {
          var ch = str[i];
          if (ch === '\u0000') {
            break;
          }
          parsedStr += ch;
          i++;
        }
        // perform the reverse of the order-preserving replacement
        // algorithm (see above)
        /* eslint-disable no-control-regex */
        parsedStr = parsedStr.replace(/\u0001\u0001/g, '\u0000')
          .replace(/\u0001\u0002/g, '\u0001')
          .replace(/\u0002\u0002/g, '\u0002');
        /* eslint-enable no-control-regex */
        stack.push(parsedStr);
        break;
      case '5':
        var arrayElement = { element: [], index: stack.length };
        stack.push(arrayElement.element);
        metaStack.push(arrayElement);
        break;
      case '6':
        var objElement = { element: {}, index: stack.length };
        stack.push(objElement.element);
        metaStack.push(objElement);
        break;
      /* istanbul ignore next */
      default:
        throw new Error(
          'bad collationIndex or unexpectedly reached end of input: ' +
            collationIndex);
    }
  }
}

function arrayCollate(a, b) {
  var len = Math.min(a.length, b.length);
  for (var i = 0; i < len; i++) {
    var sort = collate(a[i], b[i]);
    if (sort !== 0) {
      return sort;
    }
  }
  return (a.length === b.length) ? 0 :
    (a.length > b.length) ? 1 : -1;
}
function stringCollate(a, b) {
  // See: https://github.com/daleharvey/pouchdb/issues/40
  // This is incompatible with the CouchDB implementation, but its the
  // best we can do for now
  return (a === b) ? 0 : ((a > b) ? 1 : -1);
}
function objectCollate(a, b) {
  var ak = Object.keys(a), bk = Object.keys(b);
  var len = Math.min(ak.length, bk.length);
  for (var i = 0; i < len; i++) {
    // First sort the keys
    var sort = collate(ak[i], bk[i]);
    if (sort !== 0) {
      return sort;
    }
    // if the keys are equal sort the values
    sort = collate(a[ak[i]], b[bk[i]]);
    if (sort !== 0) {
      return sort;
    }

  }
  return (ak.length === bk.length) ? 0 :
    (ak.length > bk.length) ? 1 : -1;
}
// The collation is defined by erlangs ordered terms
// the atoms null, true, false come first, then numbers, strings,
// arrays, then objects
// null/undefined/NaN/Infinity/-Infinity are all considered null
function collationIndex(x) {
  var id = ['boolean', 'number', 'string', 'object'];
  var idx = id.indexOf(typeof x);
  //false if -1 otherwise true, but fast!!!!1
  if (~idx) {
    if (x === null) {
      return 1;
    }
    if (Array.isArray(x)) {
      return 5;
    }
    return idx < 3 ? (idx + 2) : (idx + 3);
  }
  /* istanbul ignore next */
  if (Array.isArray(x)) {
    return 5;
  }
}

// conversion:
// x yyy zz...zz
// x = 0 for negative, 1 for 0, 2 for positive
// y = exponent (for negative numbers negated) moved so that it's >= 0
// z = mantisse
function numToIndexableString(num) {

  if (num === 0) {
    return '1';
  }

  // convert number to exponential format for easier and
  // more succinct string sorting
  var expFormat = num.toExponential().split(/e\+?/);
  var magnitude = parseInt(expFormat[1], 10);

  var neg = num < 0;

  var result = neg ? '0' : '2';

  // first sort by magnitude
  // it's easier if all magnitudes are positive
  var magForComparison = ((neg ? -magnitude : magnitude) - MIN_MAGNITUDE);
  var magString = padLeft((magForComparison).toString(), '0', MAGNITUDE_DIGITS);

  result += SEP + magString;

  // then sort by the factor
  var factor = Math.abs(parseFloat(expFormat[0])); // [1..10)
  /* istanbul ignore next */
  if (neg) { // for negative reverse ordering
    factor = 10 - factor;
  }

  var factorStr = factor.toFixed(20);

  // strip zeros from the end
  factorStr = factorStr.replace(/\.?0+$/, '');

  result += SEP + factorStr;

  return result;
}

// create a comparator based on the sort object
function createFieldSorter(sort) {

  function getFieldValuesAsArray(doc) {
    return sort.map(function (sorting) {
      var fieldName = getKey(sorting);
      var parsedField = parseField(fieldName);
      var docFieldValue = getFieldFromDoc(doc, parsedField);
      return docFieldValue;
    });
  }

  return function (aRow, bRow) {
    var aFieldValues = getFieldValuesAsArray(aRow.doc);
    var bFieldValues = getFieldValuesAsArray(bRow.doc);
    var collation = collate(aFieldValues, bFieldValues);
    if (collation !== 0) {
      return collation;
    }
    // this is what mango seems to do
    return compare$1(aRow.doc._id, bRow.doc._id);
  };
}

function filterInMemoryFields(rows, requestDef, inMemoryFields) {
  rows = rows.filter(function (row) {
    return rowFilter(row.doc, requestDef.selector, inMemoryFields);
  });

  if (requestDef.sort) {
    // in-memory sort
    var fieldSorter = createFieldSorter(requestDef.sort);
    rows = rows.sort(fieldSorter);
    if (typeof requestDef.sort[0] !== 'string' &&
        getValue(requestDef.sort[0]) === 'desc') {
      rows = rows.reverse();
    }
  }

  if ('limit' in requestDef || 'skip' in requestDef) {
    // have to do the limit in-memory
    var skip = requestDef.skip || 0;
    var limit = ('limit' in requestDef ? requestDef.limit : rows.length) + skip;
    rows = rows.slice(skip, limit);
  }
  return rows;
}

function rowFilter(doc, selector, inMemoryFields) {
  return inMemoryFields.every(function (field) {
    var matcher = selector[field];
    var parsedField = parseField(field);
    var docFieldValue = getFieldFromDoc(doc, parsedField);
    if (isCombinationalField(field)) {
      return matchCominationalSelector(field, matcher, doc);
    }

    return matchSelector(matcher, doc, parsedField, docFieldValue);
  });
}

function matchSelector(matcher, doc, parsedField, docFieldValue) {
  if (!matcher) {
    // no filtering necessary; this field is just needed for sorting
    return true;
  }

  return Object.keys(matcher).every(function (userOperator) {
    var userValue = matcher[userOperator];
    return match(userOperator, doc, userValue, parsedField, docFieldValue);
  });
}

function matchCominationalSelector(field, matcher, doc) {

  if (field === '$or') {
    return matcher.some(function (orMatchers) {
      return rowFilter(doc, orMatchers, Object.keys(orMatchers));
    });
  }

  if (field === '$not') {
    return !rowFilter(doc, matcher, Object.keys(matcher));
  }

  //`$nor`
  return !matcher.find(function (orMatchers) {
    return rowFilter(doc, orMatchers, Object.keys(orMatchers));
  });

}

function match(userOperator, doc, userValue, parsedField, docFieldValue) {
  if (!matchers[userOperator]) {
    throw new Error('unknown operator "' + userOperator +
      '" - should be one of $eq, $lte, $lt, $gt, $gte, $exists, $ne, $in, ' +
      '$nin, $size, $mod, $regex, $elemMatch, $type, $allMatch or $all');
  }
  return matchers[userOperator](doc, userValue, parsedField, docFieldValue);
}

function fieldExists(docFieldValue) {
  return typeof docFieldValue !== 'undefined' && docFieldValue !== null;
}

function fieldIsNotUndefined(docFieldValue) {
  return typeof docFieldValue !== 'undefined';
}

function modField(docFieldValue, userValue) {
  var divisor = userValue[0];
  var mod = userValue[1];
  if (divisor === 0) {
    throw new Error('Bad divisor, cannot divide by zero');
  }

  if (parseInt(divisor, 10) !== divisor ) {
    throw new Error('Divisor is not an integer');
  }

  if (parseInt(mod, 10) !== mod ) {
    throw new Error('Modulus is not an integer');
  }

  if (parseInt(docFieldValue, 10) !== docFieldValue) {
    return false;
  }

  return docFieldValue % divisor === mod;
}

function arrayContainsValue(docFieldValue, userValue) {
  return userValue.some(function (val) {
    if (docFieldValue instanceof Array) {
      return docFieldValue.indexOf(val) > -1;
    }

    return docFieldValue === val;
  });
}

function arrayContainsAllValues(docFieldValue, userValue) {
  return userValue.every(function (val) {
    return docFieldValue.indexOf(val) > -1;
  });
}

function arraySize(docFieldValue, userValue) {
  return docFieldValue.length === userValue;
}

function regexMatch(docFieldValue, userValue) {
  var re = new RegExp(userValue);

  return re.test(docFieldValue);
}

function typeMatch(docFieldValue, userValue) {

  switch (userValue) {
    case 'null':
      return docFieldValue === null;
    case 'boolean':
      return typeof (docFieldValue) === 'boolean';
    case 'number':
      return typeof (docFieldValue) === 'number';
    case 'string':
      return typeof (docFieldValue) === 'string';
    case 'array':
      return docFieldValue instanceof Array;
    case 'object':
      return ({}).toString.call(docFieldValue) === '[object Object]';
  }

  throw new Error(userValue + ' not supported as a type.' +
                  'Please use one of object, string, array, number, boolean or null.');

}

var matchers = {

  '$elemMatch': function (doc, userValue, parsedField, docFieldValue) {
    if (!Array.isArray(docFieldValue)) {
      return false;
    }

    if (docFieldValue.length === 0) {
      return false;
    }

    if (typeof docFieldValue[0] === 'object') {
      return docFieldValue.some(function (val) {
        return rowFilter(val, userValue, Object.keys(userValue));
      });
    }

    return docFieldValue.some(function (val) {
      return matchSelector(userValue, doc, parsedField, val);
    });
  },

  '$allMatch': function (doc, userValue, parsedField, docFieldValue) {
    if (!Array.isArray(docFieldValue)) {
      return false;
    }

    /* istanbul ignore next */
    if (docFieldValue.length === 0) {
      return false;
    }

    if (typeof docFieldValue[0] === 'object') {
      return docFieldValue.every(function (val) {
        return rowFilter(val, userValue, Object.keys(userValue));
      });
    }

    return docFieldValue.every(function (val) {
      return matchSelector(userValue, doc, parsedField, val);
    });
  },

  '$eq': function (doc, userValue, parsedField, docFieldValue) {
    return fieldIsNotUndefined(docFieldValue) && collate(docFieldValue, userValue) === 0;
  },

  '$gte': function (doc, userValue, parsedField, docFieldValue) {
    return fieldIsNotUndefined(docFieldValue) && collate(docFieldValue, userValue) >= 0;
  },

  '$gt': function (doc, userValue, parsedField, docFieldValue) {
    return fieldIsNotUndefined(docFieldValue) && collate(docFieldValue, userValue) > 0;
  },

  '$lte': function (doc, userValue, parsedField, docFieldValue) {
    return fieldIsNotUndefined(docFieldValue) && collate(docFieldValue, userValue) <= 0;
  },

  '$lt': function (doc, userValue, parsedField, docFieldValue) {
    return fieldIsNotUndefined(docFieldValue) && collate(docFieldValue, userValue) < 0;
  },

  '$exists': function (doc, userValue, parsedField, docFieldValue) {
    //a field that is null is still considered to exist
    if (userValue) {
      return fieldIsNotUndefined(docFieldValue);
    }

    return !fieldIsNotUndefined(docFieldValue);
  },

  '$mod': function (doc, userValue, parsedField, docFieldValue) {
    return fieldExists(docFieldValue) && modField(docFieldValue, userValue);
  },

  '$ne': function (doc, userValue, parsedField, docFieldValue) {
    return userValue.every(function (neValue) {
      return collate(docFieldValue, neValue) !== 0;
    });
  },
  '$in': function (doc, userValue, parsedField, docFieldValue) {
    return fieldExists(docFieldValue) && arrayContainsValue(docFieldValue, userValue);
  },

  '$nin': function (doc, userValue, parsedField, docFieldValue) {
    return fieldExists(docFieldValue) && !arrayContainsValue(docFieldValue, userValue);
  },

  '$size': function (doc, userValue, parsedField, docFieldValue) {
    return fieldExists(docFieldValue) && arraySize(docFieldValue, userValue);
  },

  '$all': function (doc, userValue, parsedField, docFieldValue) {
    return Array.isArray(docFieldValue) && arrayContainsAllValues(docFieldValue, userValue);
  },

  '$regex': function (doc, userValue, parsedField, docFieldValue) {
    return fieldExists(docFieldValue) && regexMatch(docFieldValue, userValue);
  },

  '$type': function (doc, userValue, parsedField, docFieldValue) {
    return typeMatch(docFieldValue, userValue);
  }
};

// return true if the given doc matches the supplied selector
function matchesSelector(doc, selector) {
  /* istanbul ignore if */
  if (typeof selector !== 'object') {
    // match the CouchDB error message
    throw new Error('Selector error: expected a JSON object');
  }

  selector = massageSelector(selector);
  var row = {
    'doc': doc
  };

  var rowsMatched = filterInMemoryFields([row], { 'selector': selector }, Object.keys(selector));
  return rowsMatched && rowsMatched.length === 1;
}

function evalFilter(input) {
  return scopeEval('"use strict";\nreturn ' + input + ';', {});
}

function evalView(input) {
  var code = [
    'return function(doc) {',
    '  "use strict";',
    '  var emitted = false;',
    '  var emit = function (a, b) {',
    '    emitted = true;',
    '  };',
    '  var view = ' + input + ';',
    '  view(doc);',
    '  if (emitted) {',
    '    return true;',
    '  }',
    '};'
  ].join('\n');

  return scopeEval(code, {});
}

function validate(opts, callback) {
  if (opts.selector) {
    if (opts.filter && opts.filter !== '_selector') {
      var filterName = typeof opts.filter === 'string' ?
        opts.filter : 'function';
      return callback(new Error('selector invalid for filter "' + filterName + '"'));
    }
  }
  callback();
}

function normalize(opts) {
  if (opts.view && !opts.filter) {
    opts.filter = '_view';
  }

  if (opts.selector && !opts.filter) {
    opts.filter = '_selector';
  }

  if (opts.filter && typeof opts.filter === 'string') {
    if (opts.filter === '_view') {
      opts.view = normalizeDesignDocFunctionName(opts.view);
    } else {
      opts.filter = normalizeDesignDocFunctionName(opts.filter);
    }
  }
}

function shouldFilter(changesHandler, opts) {
  return opts.filter && typeof opts.filter === 'string' &&
    !opts.doc_ids && !isRemote(changesHandler.db);
}

function filter(changesHandler, opts) {
  var callback = opts.complete;
  if (opts.filter === '_view') {
    if (!opts.view || typeof opts.view !== 'string') {
      var err = createError(BAD_REQUEST,
        '`view` filter parameter not found or invalid.');
      return callback(err);
    }
    // fetch a view from a design doc, make it behave like a filter
    var viewName = parseDesignDocFunctionName(opts.view);
    changesHandler.db.get('_design/' + viewName[0], function (err, ddoc) {
      /* istanbul ignore if */
      if (changesHandler.isCancelled) {
        return callback(null, {status: 'cancelled'});
      }
      /* istanbul ignore next */
      if (err) {
        return callback(generateErrorFromResponse(err));
      }
      var mapFun = ddoc && ddoc.views && ddoc.views[viewName[1]] &&
        ddoc.views[viewName[1]].map;
      if (!mapFun) {
        return callback(createError(MISSING_DOC,
          (ddoc.views ? 'missing json key: ' + viewName[1] :
            'missing json key: views')));
      }
      opts.filter = evalView(mapFun);
      changesHandler.doChanges(opts);
    });
  } else if (opts.selector) {
    opts.filter = function (doc) {
      return matchesSelector(doc, opts.selector);
    };
    changesHandler.doChanges(opts);
  } else {
    // fetch a filter from a design doc
    var filterName = parseDesignDocFunctionName(opts.filter);
    changesHandler.db.get('_design/' + filterName[0], function (err, ddoc) {
      /* istanbul ignore if */
      if (changesHandler.isCancelled) {
        return callback(null, {status: 'cancelled'});
      }
      /* istanbul ignore next */
      if (err) {
        return callback(generateErrorFromResponse(err));
      }
      var filterFun = ddoc && ddoc.filters && ddoc.filters[filterName[1]];
      if (!filterFun) {
        return callback(createError(MISSING_DOC,
          ((ddoc && ddoc.filters) ? 'missing json key: ' + filterName[1]
            : 'missing json key: filters')));
      }
      opts.filter = evalFilter(filterFun);
      changesHandler.doChanges(opts);
    });
  }
}

function applyChangesFilterPlugin(PouchDB) {
  PouchDB._changesFilterPlugin = {
    validate: validate,
    normalize: normalize,
    shouldFilter: shouldFilter,
    filter: filter
  };
}

// TODO: remove from pouchdb-core (breaking)
PouchDB.plugin(applyChangesFilterPlugin);

PouchDB.version = version;

function toObject(array) {
  return array.reduce(function (obj, item) {
    obj[item] = true;
    return obj;
  }, {});
}
// List of top level reserved words for doc
var reservedWords = toObject([
  '_id',
  '_rev',
  '_attachments',
  '_deleted',
  '_revisions',
  '_revs_info',
  '_conflicts',
  '_deleted_conflicts',
  '_local_seq',
  '_rev_tree',
  //replication documents
  '_replication_id',
  '_replication_state',
  '_replication_state_time',
  '_replication_state_reason',
  '_replication_stats',
  // Specific to Couchbase Sync Gateway
  '_removed'
]);

// List of reserved words that should end up the document
var dataWords = toObject([
  '_attachments',
  //replication documents
  '_replication_id',
  '_replication_state',
  '_replication_state_time',
  '_replication_state_reason',
  '_replication_stats'
]);

function parseRevisionInfo(rev) {
  if (!/^\d+-./.test(rev)) {
    return createError(INVALID_REV);
  }
  var idx = rev.indexOf('-');
  var left = rev.substring(0, idx);
  var right = rev.substring(idx + 1);
  return {
    prefix: parseInt(left, 10),
    id: right
  };
}

function makeRevTreeFromRevisions(revisions, opts) {
  var pos = revisions.start - revisions.ids.length + 1;

  var revisionIds = revisions.ids;
  var ids = [revisionIds[0], opts, []];

  for (var i = 1, len = revisionIds.length; i < len; i++) {
    ids = [revisionIds[i], {status: 'missing'}, [ids]];
  }

  return [{
    pos: pos,
    ids: ids
  }];
}

// Preprocess documents, parse their revisions, assign an id and a
// revision for new writes that are missing them, etc
function parseDoc(doc, newEdits, dbOpts) {
  if (!dbOpts) {
    dbOpts = {
      deterministic_revs: true
    };
  }

  var nRevNum;
  var newRevId;
  var revInfo;
  var opts = {status: 'available'};
  if (doc._deleted) {
    opts.deleted = true;
  }

  if (newEdits) {
    if (!doc._id) {
      doc._id = uuid();
    }
    newRevId = rev$$1(doc, dbOpts.deterministic_revs);
    if (doc._rev) {
      revInfo = parseRevisionInfo(doc._rev);
      if (revInfo.error) {
        return revInfo;
      }
      doc._rev_tree = [{
        pos: revInfo.prefix,
        ids: [revInfo.id, {status: 'missing'}, [[newRevId, opts, []]]]
      }];
      nRevNum = revInfo.prefix + 1;
    } else {
      doc._rev_tree = [{
        pos: 1,
        ids : [newRevId, opts, []]
      }];
      nRevNum = 1;
    }
  } else {
    if (doc._revisions) {
      doc._rev_tree = makeRevTreeFromRevisions(doc._revisions, opts);
      nRevNum = doc._revisions.start;
      newRevId = doc._revisions.ids[0];
    }
    if (!doc._rev_tree) {
      revInfo = parseRevisionInfo(doc._rev);
      if (revInfo.error) {
        return revInfo;
      }
      nRevNum = revInfo.prefix;
      newRevId = revInfo.id;
      doc._rev_tree = [{
        pos: nRevNum,
        ids: [newRevId, opts, []]
      }];
    }
  }

  invalidIdError(doc._id);

  doc._rev = nRevNum + '-' + newRevId;

  var result = {metadata : {}, data : {}};
  for (var key in doc) {
    /* istanbul ignore else */
    if (Object.prototype.hasOwnProperty.call(doc, key)) {
      var specialKey = key[0] === '_';
      if (specialKey && !reservedWords[key]) {
        var error = createError(DOC_VALIDATION, key);
        error.message = DOC_VALIDATION.message + ': ' + key;
        throw error;
      } else if (specialKey && !dataWords[key]) {
        result.metadata[key.slice(1)] = doc[key];
      } else {
        result.data[key] = doc[key];
      }
    }
  }
  return result;
}

function parseBase64(data) {
  try {
    return thisAtob(data);
  } catch (e) {
    var err = createError(BAD_ARG,
      'Attachment is not a valid base64 string');
    return {error: err};
  }
}

function preprocessString(att, blobType, callback) {
  var asBinary = parseBase64(att.data);
  if (asBinary.error) {
    return callback(asBinary.error);
  }

  att.length = asBinary.length;
  if (blobType === 'blob') {
    att.data = binStringToBluffer(asBinary, att.content_type);
  } else if (blobType === 'base64') {
    att.data = thisBtoa(asBinary);
  } else { // binary
    att.data = asBinary;
  }
  binaryMd5(asBinary, function (result) {
    att.digest = 'md5-' + result;
    callback();
  });
}

function preprocessBlob(att, blobType, callback) {
  binaryMd5(att.data, function (md5) {
    att.digest = 'md5-' + md5;
    // size is for blobs (browser), length is for buffers (node)
    att.length = att.data.size || att.data.length || 0;
    if (blobType === 'binary') {
      blobToBinaryString(att.data, function (binString) {
        att.data = binString;
        callback();
      });
    } else if (blobType === 'base64') {
      blobToBase64(att.data, function (b64) {
        att.data = b64;
        callback();
      });
    } else {
      callback();
    }
  });
}

function preprocessAttachment(att, blobType, callback) {
  if (att.stub) {
    return callback();
  }
  if (typeof att.data === 'string') { // input is a base64 string
    preprocessString(att, blobType, callback);
  } else { // input is a blob
    preprocessBlob(att, blobType, callback);
  }
}

function preprocessAttachments(docInfos, blobType, callback) {

  if (!docInfos.length) {
    return callback();
  }

  var docv = 0;
  var overallErr;

  docInfos.forEach(function (docInfo) {
    var attachments = docInfo.data && docInfo.data._attachments ?
      Object.keys(docInfo.data._attachments) : [];
    var recv = 0;

    if (!attachments.length) {
      return done();
    }

    function processedAttachment(err) {
      overallErr = err;
      recv++;
      if (recv === attachments.length) {
        done();
      }
    }

    for (var key in docInfo.data._attachments) {
      if (docInfo.data._attachments.hasOwnProperty(key)) {
        preprocessAttachment(docInfo.data._attachments[key],
          blobType, processedAttachment);
      }
    }
  });

  function done() {
    docv++;
    if (docInfos.length === docv) {
      if (overallErr) {
        callback(overallErr);
      } else {
        callback();
      }
    }
  }
}

function updateDoc(revLimit, prev, docInfo, results,
                   i, cb, writeDoc, newEdits) {

  if (revExists(prev.rev_tree, docInfo.metadata.rev) && !newEdits) {
    results[i] = docInfo;
    return cb();
  }

  // sometimes this is pre-calculated. historically not always
  var previousWinningRev = prev.winningRev || winningRev(prev);
  var previouslyDeleted = 'deleted' in prev ? prev.deleted :
    isDeleted(prev, previousWinningRev);
  var deleted = 'deleted' in docInfo.metadata ? docInfo.metadata.deleted :
    isDeleted(docInfo.metadata);
  var isRoot = /^1-/.test(docInfo.metadata.rev);

  if (previouslyDeleted && !deleted && newEdits && isRoot) {
    var newDoc = docInfo.data;
    newDoc._rev = previousWinningRev;
    newDoc._id = docInfo.metadata.id;
    docInfo = parseDoc(newDoc, newEdits);
  }

  var merged = merge(prev.rev_tree, docInfo.metadata.rev_tree[0], revLimit);

  var inConflict = newEdits && ((
    (previouslyDeleted && deleted && merged.conflicts !== 'new_leaf') ||
    (!previouslyDeleted && merged.conflicts !== 'new_leaf') ||
    (previouslyDeleted && !deleted && merged.conflicts === 'new_branch')));

  if (inConflict) {
    var err = createError(REV_CONFLICT);
    results[i] = err;
    return cb();
  }

  var newRev = docInfo.metadata.rev;
  docInfo.metadata.rev_tree = merged.tree;
  docInfo.stemmedRevs = merged.stemmedRevs || [];
  /* istanbul ignore else */
  if (prev.rev_map) {
    docInfo.metadata.rev_map = prev.rev_map; // used only by leveldb
  }

  // recalculate
  var winningRev$$1 = winningRev(docInfo.metadata);
  var winningRevIsDeleted = isDeleted(docInfo.metadata, winningRev$$1);

  // calculate the total number of documents that were added/removed,
  // from the perspective of total_rows/doc_count
  var delta = (previouslyDeleted === winningRevIsDeleted) ? 0 :
    previouslyDeleted < winningRevIsDeleted ? -1 : 1;

  var newRevIsDeleted;
  if (newRev === winningRev$$1) {
    // if the new rev is the same as the winning rev, we can reuse that value
    newRevIsDeleted = winningRevIsDeleted;
  } else {
    // if they're not the same, then we need to recalculate
    newRevIsDeleted = isDeleted(docInfo.metadata, newRev);
  }

  writeDoc(docInfo, winningRev$$1, winningRevIsDeleted, newRevIsDeleted,
    true, delta, i, cb);
}

function rootIsMissing(docInfo) {
  return docInfo.metadata.rev_tree[0].ids[1].status === 'missing';
}

function processDocs(revLimit, docInfos, api, fetchedDocs, tx, results,
                     writeDoc, opts, overallCallback) {

  // Default to 1000 locally
  revLimit = revLimit || 1000;

  function insertDoc(docInfo, resultsIdx, callback) {
    // Cant insert new deleted documents
    var winningRev$$1 = winningRev(docInfo.metadata);
    var deleted = isDeleted(docInfo.metadata, winningRev$$1);
    if ('was_delete' in opts && deleted) {
      results[resultsIdx] = createError(MISSING_DOC, 'deleted');
      return callback();
    }

    // 4712 - detect whether a new document was inserted with a _rev
    var inConflict = newEdits && rootIsMissing(docInfo);

    if (inConflict) {
      var err = createError(REV_CONFLICT);
      results[resultsIdx] = err;
      return callback();
    }

    var delta = deleted ? 0 : 1;

    writeDoc(docInfo, winningRev$$1, deleted, deleted, false,
      delta, resultsIdx, callback);
  }

  var newEdits = opts.new_edits;
  var idsToDocs = new ExportedMap();

  var docsDone = 0;
  var docsToDo = docInfos.length;

  function checkAllDocsDone() {
    if (++docsDone === docsToDo && overallCallback) {
      overallCallback();
    }
  }

  docInfos.forEach(function (currentDoc, resultsIdx) {

    if (currentDoc._id && isLocalId(currentDoc._id)) {
      var fun = currentDoc._deleted ? '_removeLocal' : '_putLocal';
      api[fun](currentDoc, {ctx: tx}, function (err, res) {
        results[resultsIdx] = err || res;
        checkAllDocsDone();
      });
      return;
    }

    var id = currentDoc.metadata.id;
    if (idsToDocs.has(id)) {
      docsToDo--; // duplicate
      idsToDocs.get(id).push([currentDoc, resultsIdx]);
    } else {
      idsToDocs.set(id, [[currentDoc, resultsIdx]]);
    }
  });

  // in the case of new_edits, the user can provide multiple docs
  // with the same id. these need to be processed sequentially
  idsToDocs.forEach(function (docs, id) {
    var numDone = 0;

    function docWritten() {
      if (++numDone < docs.length) {
        nextDoc();
      } else {
        checkAllDocsDone();
      }
    }
    function nextDoc() {
      var value = docs[numDone];
      var currentDoc = value[0];
      var resultsIdx = value[1];

      if (fetchedDocs.has(id)) {
        updateDoc(revLimit, fetchedDocs.get(id), currentDoc, results,
          resultsIdx, docWritten, writeDoc, newEdits);
      } else {
        // Ensure stemming applies to new writes as well
        var merged = merge([], currentDoc.metadata.rev_tree[0], revLimit);
        currentDoc.metadata.rev_tree = merged.tree;
        currentDoc.stemmedRevs = merged.stemmedRevs || [];
        insertDoc(currentDoc, resultsIdx, docWritten);
      }
    }
    nextDoc();
  });
}

// IndexedDB requires a versioned database structure, so we use the
// version here to manage migrations.
var ADAPTER_VERSION = 5;

// The object stores created for each database
// DOC_STORE stores the document meta data, its revision history and state
// Keyed by document id
var DOC_STORE = 'document-store';
// BY_SEQ_STORE stores a particular version of a document, keyed by its
// sequence id
var BY_SEQ_STORE = 'by-sequence';
// Where we store attachments
var ATTACH_STORE = 'attach-store';
// Where we store many-to-many relations
// between attachment digests and seqs
var ATTACH_AND_SEQ_STORE = 'attach-seq-store';

// Where we store database-wide meta data in a single record
// keyed by id: META_STORE
var META_STORE = 'meta-store';
// Where we store local documents
var LOCAL_STORE = 'local-store';
// Where we detect blob support
var DETECT_BLOB_SUPPORT_STORE = 'detect-blob-support';

function safeJsonParse(str) {
  // This try/catch guards against stack overflow errors.
  // JSON.parse() is faster than vuvuzela.parse() but vuvuzela
  // cannot overflow.
  try {
    return JSON.parse(str);
  } catch (e) {
    /* istanbul ignore next */
    return vuvuzela.parse(str);
  }
}

function safeJsonStringify(json) {
  try {
    return JSON.stringify(json);
  } catch (e) {
    /* istanbul ignore next */
    return vuvuzela.stringify(json);
  }
}

function idbError(callback) {
  return function (evt) {
    var message = 'unknown_error';
    if (evt.target && evt.target.error) {
      message = evt.target.error.name || evt.target.error.message;
    }
    callback(createError(IDB_ERROR, message, evt.type));
  };
}

// Unfortunately, the metadata has to be stringified
// when it is put into the database, because otherwise
// IndexedDB can throw errors for deeply-nested objects.
// Originally we just used JSON.parse/JSON.stringify; now
// we use this custom vuvuzela library that avoids recursion.
// If we could do it all over again, we'd probably use a
// format for the revision trees other than JSON.
function encodeMetadata(metadata, winningRev, deleted) {
  return {
    data: safeJsonStringify(metadata),
    winningRev: winningRev,
    deletedOrLocal: deleted ? '1' : '0',
    seq: metadata.seq, // highest seq for this doc
    id: metadata.id
  };
}

function decodeMetadata(storedObject) {
  if (!storedObject) {
    return null;
  }
  var metadata = safeJsonParse(storedObject.data);
  metadata.winningRev = storedObject.winningRev;
  metadata.deleted = storedObject.deletedOrLocal === '1';
  metadata.seq = storedObject.seq;
  return metadata;
}

// read the doc back out from the database. we don't store the
// _id or _rev because we already have _doc_id_rev.
function decodeDoc(doc) {
  if (!doc) {
    return doc;
  }
  var idx = doc._doc_id_rev.lastIndexOf(':');
  doc._id = doc._doc_id_rev.substring(0, idx - 1);
  doc._rev = doc._doc_id_rev.substring(idx + 1);
  delete doc._doc_id_rev;
  return doc;
}

// Read a blob from the database, encoding as necessary
// and translating from base64 if the IDB doesn't support
// native Blobs
function readBlobData(body, type, asBlob, callback) {
  if (asBlob) {
    if (!body) {
      callback(createBlob([''], {type: type}));
    } else if (typeof body !== 'string') { // we have blob support
      callback(body);
    } else { // no blob support
      callback(b64ToBluffer(body, type));
    }
  } else { // as base64 string
    if (!body) {
      callback('');
    } else if (typeof body !== 'string') { // we have blob support
      readAsBinaryString(body, function (binary) {
        callback(thisBtoa(binary));
      });
    } else { // no blob support
      callback(body);
    }
  }
}

function fetchAttachmentsIfNecessary(doc, opts, txn, cb) {
  var attachments = Object.keys(doc._attachments || {});
  if (!attachments.length) {
    return cb && cb();
  }
  var numDone = 0;

  function checkDone() {
    if (++numDone === attachments.length && cb) {
      cb();
    }
  }

  function fetchAttachment(doc, att) {
    var attObj = doc._attachments[att];
    var digest = attObj.digest;
    var req = txn.objectStore(ATTACH_STORE).get(digest);
    req.onsuccess = function (e) {
      attObj.body = e.target.result.body;
      checkDone();
    };
  }

  attachments.forEach(function (att) {
    if (opts.attachments && opts.include_docs) {
      fetchAttachment(doc, att);
    } else {
      doc._attachments[att].stub = true;
      checkDone();
    }
  });
}

// IDB-specific postprocessing necessary because
// we don't know whether we stored a true Blob or
// a base64-encoded string, and if it's a Blob it
// needs to be read outside of the transaction context
function postProcessAttachments(results, asBlob) {
  return Promise.all(results.map(function (row) {
    if (row.doc && row.doc._attachments) {
      var attNames = Object.keys(row.doc._attachments);
      return Promise.all(attNames.map(function (att) {
        var attObj = row.doc._attachments[att];
        if (!('body' in attObj)) { // already processed
          return;
        }
        var body = attObj.body;
        var type = attObj.content_type;
        return new Promise(function (resolve) {
          readBlobData(body, type, asBlob, function (data) {
            row.doc._attachments[att] = $inject_Object_assign(
              pick(attObj, ['digest', 'content_type']),
              {data: data}
            );
            resolve();
          });
        });
      }));
    }
  }));
}

function compactRevs(revs, docId, txn) {

  var possiblyOrphanedDigests = [];
  var seqStore = txn.objectStore(BY_SEQ_STORE);
  var attStore = txn.objectStore(ATTACH_STORE);
  var attAndSeqStore = txn.objectStore(ATTACH_AND_SEQ_STORE);
  var count = revs.length;

  function checkDone() {
    count--;
    if (!count) { // done processing all revs
      deleteOrphanedAttachments();
    }
  }

  function deleteOrphanedAttachments() {
    if (!possiblyOrphanedDigests.length) {
      return;
    }
    possiblyOrphanedDigests.forEach(function (digest) {
      var countReq = attAndSeqStore.index('digestSeq').count(
        IDBKeyRange.bound(
          digest + '::', digest + '::\uffff', false, false));
      countReq.onsuccess = function (e) {
        var count = e.target.result;
        if (!count) {
          // orphaned
          attStore.delete(digest);
        }
      };
    });
  }

  revs.forEach(function (rev) {
    var index = seqStore.index('_doc_id_rev');
    var key = docId + "::" + rev;
    index.getKey(key).onsuccess = function (e) {
      var seq = e.target.result;
      if (typeof seq !== 'number') {
        return checkDone();
      }
      seqStore.delete(seq);

      var cursor = attAndSeqStore.index('seq')
        .openCursor(IDBKeyRange.only(seq));

      cursor.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          var digest = cursor.value.digestSeq.split('::')[0];
          possiblyOrphanedDigests.push(digest);
          attAndSeqStore.delete(cursor.primaryKey);
          cursor.continue();
        } else { // done
          checkDone();
        }
      };
    };
  });
}

function openTransactionSafely(idb, stores, mode) {
  try {
    return {
      txn: idb.transaction(stores, mode)
    };
  } catch (err) {
    return {
      error: err
    };
  }
}

var changesHandler = new Changes();

function idbBulkDocs(dbOpts, req, opts, api, idb, callback) {
  var docInfos = req.docs;
  var txn;
  var docStore;
  var bySeqStore;
  var attachStore;
  var attachAndSeqStore;
  var metaStore;
  var docInfoError;
  var metaDoc;

  for (var i = 0, len = docInfos.length; i < len; i++) {
    var doc = docInfos[i];
    if (doc._id && isLocalId(doc._id)) {
      continue;
    }
    doc = docInfos[i] = parseDoc(doc, opts.new_edits, dbOpts);
    if (doc.error && !docInfoError) {
      docInfoError = doc;
    }
  }

  if (docInfoError) {
    return callback(docInfoError);
  }

  var allDocsProcessed = false;
  var docCountDelta = 0;
  var results = new Array(docInfos.length);
  var fetchedDocs = new ExportedMap();
  var preconditionErrored = false;
  var blobType = api._meta.blobSupport ? 'blob' : 'base64';

  preprocessAttachments(docInfos, blobType, function (err) {
    if (err) {
      return callback(err);
    }
    startTransaction();
  });

  function startTransaction() {

    var stores = [
      DOC_STORE, BY_SEQ_STORE,
      ATTACH_STORE,
      LOCAL_STORE, ATTACH_AND_SEQ_STORE,
      META_STORE
    ];
    var txnResult = openTransactionSafely(idb, stores, 'readwrite');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    txn = txnResult.txn;
    txn.onabort = idbError(callback);
    txn.ontimeout = idbError(callback);
    txn.oncomplete = complete;
    docStore = txn.objectStore(DOC_STORE);
    bySeqStore = txn.objectStore(BY_SEQ_STORE);
    attachStore = txn.objectStore(ATTACH_STORE);
    attachAndSeqStore = txn.objectStore(ATTACH_AND_SEQ_STORE);
    metaStore = txn.objectStore(META_STORE);

    metaStore.get(META_STORE).onsuccess = function (e) {
      metaDoc = e.target.result;
      updateDocCountIfReady();
    };

    verifyAttachments(function (err) {
      if (err) {
        preconditionErrored = true;
        return callback(err);
      }
      fetchExistingDocs();
    });
  }

  function onAllDocsProcessed() {
    allDocsProcessed = true;
    updateDocCountIfReady();
  }

  function idbProcessDocs() {
    processDocs(dbOpts.revs_limit, docInfos, api, fetchedDocs,
                txn, results, writeDoc, opts, onAllDocsProcessed);
  }

  function updateDocCountIfReady() {
    if (!metaDoc || !allDocsProcessed) {
      return;
    }
    // caching the docCount saves a lot of time in allDocs() and
    // info(), which is why we go to all the trouble of doing this
    metaDoc.docCount += docCountDelta;
    metaStore.put(metaDoc);
  }

  function fetchExistingDocs() {

    if (!docInfos.length) {
      return;
    }

    var numFetched = 0;

    function checkDone() {
      if (++numFetched === docInfos.length) {
        idbProcessDocs();
      }
    }

    function readMetadata(event) {
      var metadata = decodeMetadata(event.target.result);

      if (metadata) {
        fetchedDocs.set(metadata.id, metadata);
      }
      checkDone();
    }

    for (var i = 0, len = docInfos.length; i < len; i++) {
      var docInfo = docInfos[i];
      if (docInfo._id && isLocalId(docInfo._id)) {
        checkDone(); // skip local docs
        continue;
      }
      var req = docStore.get(docInfo.metadata.id);
      req.onsuccess = readMetadata;
    }
  }

  function complete() {
    if (preconditionErrored) {
      return;
    }

    changesHandler.notify(api._meta.name);
    callback(null, results);
  }

  function verifyAttachment(digest, callback) {

    var req = attachStore.get(digest);
    req.onsuccess = function (e) {
      if (!e.target.result) {
        var err = createError(MISSING_STUB,
          'unknown stub attachment with digest ' +
          digest);
        err.status = 412;
        callback(err);
      } else {
        callback();
      }
    };
  }

  function verifyAttachments(finish) {


    var digests = [];
    docInfos.forEach(function (docInfo) {
      if (docInfo.data && docInfo.data._attachments) {
        Object.keys(docInfo.data._attachments).forEach(function (filename) {
          var att = docInfo.data._attachments[filename];
          if (att.stub) {
            digests.push(att.digest);
          }
        });
      }
    });
    if (!digests.length) {
      return finish();
    }
    var numDone = 0;
    var err;

    function checkDone() {
      if (++numDone === digests.length) {
        finish(err);
      }
    }
    digests.forEach(function (digest) {
      verifyAttachment(digest, function (attErr) {
        if (attErr && !err) {
          err = attErr;
        }
        checkDone();
      });
    });
  }

  function writeDoc(docInfo, winningRev$$1, winningRevIsDeleted, newRevIsDeleted,
                    isUpdate, delta, resultsIdx, callback) {

    docInfo.metadata.winningRev = winningRev$$1;
    docInfo.metadata.deleted = winningRevIsDeleted;

    var doc = docInfo.data;
    doc._id = docInfo.metadata.id;
    doc._rev = docInfo.metadata.rev;

    if (newRevIsDeleted) {
      doc._deleted = true;
    }

    var hasAttachments = doc._attachments &&
      Object.keys(doc._attachments).length;
    if (hasAttachments) {
      return writeAttachments(docInfo, winningRev$$1, winningRevIsDeleted,
        isUpdate, resultsIdx, callback);
    }

    docCountDelta += delta;
    updateDocCountIfReady();

    finishDoc(docInfo, winningRev$$1, winningRevIsDeleted,
      isUpdate, resultsIdx, callback);
  }

  function finishDoc(docInfo, winningRev$$1, winningRevIsDeleted,
                     isUpdate, resultsIdx, callback) {

    var doc = docInfo.data;
    var metadata = docInfo.metadata;

    doc._doc_id_rev = metadata.id + '::' + metadata.rev;
    delete doc._id;
    delete doc._rev;

    function afterPutDoc(e) {
      var revsToDelete = docInfo.stemmedRevs || [];

      if (isUpdate && api.auto_compaction) {
        revsToDelete = revsToDelete.concat(compactTree(docInfo.metadata));
      }

      if (revsToDelete && revsToDelete.length) {
        compactRevs(revsToDelete, docInfo.metadata.id, txn);
      }

      metadata.seq = e.target.result;
      // Current _rev is calculated from _rev_tree on read
      // delete metadata.rev;
      var metadataToStore = encodeMetadata(metadata, winningRev$$1,
        winningRevIsDeleted);
      var metaDataReq = docStore.put(metadataToStore);
      metaDataReq.onsuccess = afterPutMetadata;
    }

    function afterPutDocError(e) {
      // ConstraintError, need to update, not put (see #1638 for details)
      e.preventDefault(); // avoid transaction abort
      e.stopPropagation(); // avoid transaction onerror
      var index = bySeqStore.index('_doc_id_rev');
      var getKeyReq = index.getKey(doc._doc_id_rev);
      getKeyReq.onsuccess = function (e) {
        var putReq = bySeqStore.put(doc, e.target.result);
        putReq.onsuccess = afterPutDoc;
      };
    }

    function afterPutMetadata() {
      results[resultsIdx] = {
        ok: true,
        id: metadata.id,
        rev: metadata.rev
      };
      fetchedDocs.set(docInfo.metadata.id, docInfo.metadata);
      insertAttachmentMappings(docInfo, metadata.seq, callback);
    }

    var putReq = bySeqStore.put(doc);

    putReq.onsuccess = afterPutDoc;
    putReq.onerror = afterPutDocError;
  }

  function writeAttachments(docInfo, winningRev$$1, winningRevIsDeleted,
                            isUpdate, resultsIdx, callback) {


    var doc = docInfo.data;

    var numDone = 0;
    var attachments = Object.keys(doc._attachments);

    function collectResults() {
      if (numDone === attachments.length) {
        finishDoc(docInfo, winningRev$$1, winningRevIsDeleted,
          isUpdate, resultsIdx, callback);
      }
    }

    function attachmentSaved() {
      numDone++;
      collectResults();
    }

    attachments.forEach(function (key) {
      var att = docInfo.data._attachments[key];
      if (!att.stub) {
        var data = att.data;
        delete att.data;
        att.revpos = parseInt(winningRev$$1, 10);
        var digest = att.digest;
        saveAttachment(digest, data, attachmentSaved);
      } else {
        numDone++;
        collectResults();
      }
    });
  }

  // map seqs to attachment digests, which
  // we will need later during compaction
  function insertAttachmentMappings(docInfo, seq, callback) {

    var attsAdded = 0;
    var attsToAdd = Object.keys(docInfo.data._attachments || {});

    if (!attsToAdd.length) {
      return callback();
    }

    function checkDone() {
      if (++attsAdded === attsToAdd.length) {
        callback();
      }
    }

    function add(att) {
      var digest = docInfo.data._attachments[att].digest;
      var req = attachAndSeqStore.put({
        seq: seq,
        digestSeq: digest + '::' + seq
      });

      req.onsuccess = checkDone;
      req.onerror = function (e) {
        // this callback is for a constaint error, which we ignore
        // because this docid/rev has already been associated with
        // the digest (e.g. when new_edits == false)
        e.preventDefault(); // avoid transaction abort
        e.stopPropagation(); // avoid transaction onerror
        checkDone();
      };
    }
    for (var i = 0; i < attsToAdd.length; i++) {
      add(attsToAdd[i]); // do in parallel
    }
  }

  function saveAttachment(digest, data, callback) {


    var getKeyReq = attachStore.count(digest);
    getKeyReq.onsuccess = function (e) {
      var count = e.target.result;
      if (count) {
        return callback(); // already exists
      }
      var newAtt = {
        digest: digest,
        body: data
      };
      var putReq = attachStore.put(newAtt);
      putReq.onsuccess = callback;
    };
  }
}

// Abstraction over IDBCursor and getAll()/getAllKeys() that allows us to batch our operations
// while falling back to a normal IDBCursor operation on browsers that don't support getAll() or
// getAllKeys(). This allows for a much faster implementation than just straight-up cursors, because
// we're not processing each document one-at-a-time.
function runBatchedCursor(objectStore, keyRange, descending, batchSize, onBatch) {

  if (batchSize === -1) {
    batchSize = 1000;
  }

  // Bail out of getAll()/getAllKeys() in the following cases:
  // 1) either method is unsupported - we need both
  // 2) batchSize is 1 (might as well use IDBCursor)
  // 3) descending – no real way to do this via getAll()/getAllKeys()

  var useGetAll = typeof objectStore.getAll === 'function' &&
    typeof objectStore.getAllKeys === 'function' &&
    batchSize > 1 && !descending;

  var keysBatch;
  var valuesBatch;
  var pseudoCursor;

  function onGetAll(e) {
    valuesBatch = e.target.result;
    if (keysBatch) {
      onBatch(keysBatch, valuesBatch, pseudoCursor);
    }
  }

  function onGetAllKeys(e) {
    keysBatch = e.target.result;
    if (valuesBatch) {
      onBatch(keysBatch, valuesBatch, pseudoCursor);
    }
  }

  function continuePseudoCursor() {
    if (!keysBatch.length) { // no more results
      return onBatch();
    }
    // fetch next batch, exclusive start
    var lastKey = keysBatch[keysBatch.length - 1];
    var newKeyRange;
    if (keyRange && keyRange.upper) {
      try {
        newKeyRange = IDBKeyRange.bound(lastKey, keyRange.upper,
          true, keyRange.upperOpen);
      } catch (e) {
        if (e.name === "DataError" && e.code === 0) {
          return onBatch(); // we're done, startkey and endkey are equal
        }
      }
    } else {
      newKeyRange = IDBKeyRange.lowerBound(lastKey, true);
    }
    keyRange = newKeyRange;
    keysBatch = null;
    valuesBatch = null;
    objectStore.getAll(keyRange, batchSize).onsuccess = onGetAll;
    objectStore.getAllKeys(keyRange, batchSize).onsuccess = onGetAllKeys;
  }

  function onCursor(e) {
    var cursor = e.target.result;
    if (!cursor) { // done
      return onBatch();
    }
    // regular IDBCursor acts like a batch where batch size is always 1
    onBatch([cursor.key], [cursor.value], cursor);
  }

  if (useGetAll) {
    pseudoCursor = {"continue": continuePseudoCursor};
    objectStore.getAll(keyRange, batchSize).onsuccess = onGetAll;
    objectStore.getAllKeys(keyRange, batchSize).onsuccess = onGetAllKeys;
  } else if (descending) {
    objectStore.openCursor(keyRange, 'prev').onsuccess = onCursor;
  } else {
    objectStore.openCursor(keyRange).onsuccess = onCursor;
  }
}

// simple shim for objectStore.getAll(), falling back to IDBCursor
function getAll(objectStore, keyRange, onSuccess) {
  if (typeof objectStore.getAll === 'function') {
    // use native getAll
    objectStore.getAll(keyRange).onsuccess = onSuccess;
    return;
  }
  // fall back to cursors
  var values = [];

  function onCursor(e) {
    var cursor = e.target.result;
    if (cursor) {
      values.push(cursor.value);
      cursor.continue();
    } else {
      onSuccess({
        target: {
          result: values
        }
      });
    }
  }

  objectStore.openCursor(keyRange).onsuccess = onCursor;
}

function allDocsKeys(keys, docStore, onBatch) {
  // It's not guaranted to be returned in right order  
  var valuesBatch = new Array(keys.length);
  var count = 0;
  keys.forEach(function (key, index) {
    docStore.get(key).onsuccess = function (event) {
      if (event.target.result) {
        valuesBatch[index] = event.target.result;
      } else {
        valuesBatch[index] = {key: key, error: 'not_found'};
      }
      count++;
      if (count === keys.length) {
        onBatch(keys, valuesBatch, {});
      }
    };
  });
}

function createKeyRange(start, end, inclusiveEnd, key, descending) {
  try {
    if (start && end) {
      if (descending) {
        return IDBKeyRange.bound(end, start, !inclusiveEnd, false);
      } else {
        return IDBKeyRange.bound(start, end, false, !inclusiveEnd);
      }
    } else if (start) {
      if (descending) {
        return IDBKeyRange.upperBound(start);
      } else {
        return IDBKeyRange.lowerBound(start);
      }
    } else if (end) {
      if (descending) {
        return IDBKeyRange.lowerBound(end, !inclusiveEnd);
      } else {
        return IDBKeyRange.upperBound(end, !inclusiveEnd);
      }
    } else if (key) {
      return IDBKeyRange.only(key);
    }
  } catch (e) {
    return {error: e};
  }
  return null;
}

function idbAllDocs(opts, idb, callback) {
  var start = 'startkey' in opts ? opts.startkey : false;
  var end = 'endkey' in opts ? opts.endkey : false;
  var key = 'key' in opts ? opts.key : false;
  var keys = 'keys' in opts ? opts.keys : false; 
  var skip = opts.skip || 0;
  var limit = typeof opts.limit === 'number' ? opts.limit : -1;
  var inclusiveEnd = opts.inclusive_end !== false;

  var keyRange ; 
  var keyRangeError;
  if (!keys) {
    keyRange = createKeyRange(start, end, inclusiveEnd, key, opts.descending);
    keyRangeError = keyRange && keyRange.error;
    if (keyRangeError && 
      !(keyRangeError.name === "DataError" && keyRangeError.code === 0)) {
      // DataError with error code 0 indicates start is less than end, so
      // can just do an empty query. Else need to throw
      return callback(createError(IDB_ERROR,
        keyRangeError.name, keyRangeError.message));
    }
  }

  var stores = [DOC_STORE, BY_SEQ_STORE, META_STORE];

  if (opts.attachments) {
    stores.push(ATTACH_STORE);
  }
  var txnResult = openTransactionSafely(idb, stores, 'readonly');
  if (txnResult.error) {
    return callback(txnResult.error);
  }
  var txn = txnResult.txn;
  txn.oncomplete = onTxnComplete;
  txn.onabort = idbError(callback);
  var docStore = txn.objectStore(DOC_STORE);
  var seqStore = txn.objectStore(BY_SEQ_STORE);
  var metaStore = txn.objectStore(META_STORE);
  var docIdRevIndex = seqStore.index('_doc_id_rev');
  var results = [];
  var docCount;
  var updateSeq;

  metaStore.get(META_STORE).onsuccess = function (e) {
    docCount = e.target.result.docCount;
  };

  /* istanbul ignore if */
  if (opts.update_seq) {
    getMaxUpdateSeq(seqStore, function (e) { 
      if (e.target.result && e.target.result.length > 0) {
        updateSeq = e.target.result[0];
      }
    });
  }

  function getMaxUpdateSeq(objectStore, onSuccess) {
    function onCursor(e) {
      var cursor = e.target.result;
      var maxKey = undefined;
      if (cursor && cursor.key) {
        maxKey = cursor.key;
      } 
      return onSuccess({
        target: {
          result: [maxKey]
        }
      });
    }
    objectStore.openCursor(null, 'prev').onsuccess = onCursor;
  }

  // if the user specifies include_docs=true, then we don't
  // want to block the main cursor while we're fetching the doc
  function fetchDocAsynchronously(metadata, row, winningRev$$1) {
    var key = metadata.id + "::" + winningRev$$1;
    docIdRevIndex.get(key).onsuccess =  function onGetDoc(e) {
      row.doc = decodeDoc(e.target.result) || {};
      if (opts.conflicts) {
        var conflicts = collectConflicts(metadata);
        if (conflicts.length) {
          row.doc._conflicts = conflicts;
        }
      }
      fetchAttachmentsIfNecessary(row.doc, opts, txn);
    };
  }

  function allDocsInner(winningRev$$1, metadata) {
    var row = {
      id: metadata.id,
      key: metadata.id,
      value: {
        rev: winningRev$$1
      }
    };
    var deleted = metadata.deleted;
    if (deleted) {
      if (keys) {
        results.push(row);
        // deleted docs are okay with "keys" requests
        row.value.deleted = true;
        row.doc = null;
      }
    } else if (skip-- <= 0) {
      results.push(row);
      if (opts.include_docs) {
        fetchDocAsynchronously(metadata, row, winningRev$$1);
      }
    }
  }

  function processBatch(batchValues) {
    for (var i = 0, len = batchValues.length; i < len; i++) {
      if (results.length === limit) {
        break;
      }
      var batchValue = batchValues[i];
      if (batchValue.error && keys) {
        // key was not found with "keys" requests
        results.push(batchValue);
        continue;
      }
      var metadata = decodeMetadata(batchValue);
      var winningRev$$1 = metadata.winningRev;
      allDocsInner(winningRev$$1, metadata);
    }
  }

  function onBatch(batchKeys, batchValues, cursor) {
    if (!cursor) {
      return;
    }
    processBatch(batchValues);
    if (results.length < limit) {
      cursor.continue();
    }
  }

  function onGetAll(e) {
    var values = e.target.result;
    if (opts.descending) {
      values = values.reverse();
    }
    processBatch(values);
  }

  function onResultsReady() {
    var returnVal = {
      total_rows: docCount,
      offset: opts.skip,
      rows: results
    };
    
    /* istanbul ignore if */
    if (opts.update_seq && updateSeq !== undefined) {
      returnVal.update_seq = updateSeq;
    }
    callback(null, returnVal);
  }

  function onTxnComplete() {
    if (opts.attachments) {
      postProcessAttachments(results, opts.binary).then(onResultsReady);
    } else {
      onResultsReady();
    }
  }

  // don't bother doing any requests if start > end or limit === 0
  if (keyRangeError || limit === 0) {
    return;
  }
  if (keys) {
    return allDocsKeys(opts.keys, docStore, onBatch);
  }
  if (limit === -1) { // just fetch everything
    return getAll(docStore, keyRange, onGetAll);
  }
  // else do a cursor
  // choose a batch size based on the skip, since we'll need to skip that many
  runBatchedCursor(docStore, keyRange, opts.descending, limit + skip, onBatch);
}

//
// Blobs are not supported in all versions of IndexedDB, notably
// Chrome <37 and Android <5. In those versions, storing a blob will throw.
//
// Various other blob bugs exist in Chrome v37-42 (inclusive).
// Detecting them is expensive and confusing to users, and Chrome 37-42
// is at very low usage worldwide, so we do a hacky userAgent check instead.
//
// content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
// 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
// FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
//
function checkBlobSupport(txn) {
  return new Promise(function (resolve) {
    var blob$$1 = createBlob(['']);
    var req = txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob$$1, 'key');

    req.onsuccess = function () {
      var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
      var matchedEdge = navigator.userAgent.match(/Edge\//);
      // MS Edge pretends to be Chrome 42:
      // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
      resolve(matchedEdge || !matchedChrome ||
        parseInt(matchedChrome[1], 10) >= 43);
    };

    req.onerror = txn.onabort = function (e) {
      // If the transaction aborts now its due to not being able to
      // write to the database, likely due to the disk being full
      e.preventDefault();
      e.stopPropagation();
      resolve(false);
    };
  }).catch(function () {
    return false; // error, so assume unsupported
  });
}

function countDocs(txn, cb) {
  var index = txn.objectStore(DOC_STORE).index('deletedOrLocal');
  index.count(IDBKeyRange.only('0')).onsuccess = function (e) {
    cb(e.target.result);
  };
}

// This task queue ensures that IDB open calls are done in their own tick

var running = false;
var queue = [];

function tryCode(fun, err, res, PouchDB) {
  try {
    fun(err, res);
  } catch (err) {
    // Shouldn't happen, but in some odd cases
    // IndexedDB implementations might throw a sync
    // error, in which case this will at least log it.
    PouchDB.emit('error', err);
  }
}

function applyNext() {
  if (running || !queue.length) {
    return;
  }
  running = true;
  queue.shift()();
}

function enqueueTask(action, callback, PouchDB) {
  queue.push(function runAction() {
    action(function runCallback(err, res) {
      tryCode(callback, err, res, PouchDB);
      running = false;
      nextTick(function runNext() {
        applyNext(PouchDB);
      });
    });
  });
  applyNext();
}

function changes(opts, api, dbName, idb) {
  opts = clone(opts);

  if (opts.continuous) {
    var id = dbName + ':' + uuid();
    changesHandler.addListener(dbName, id, api, opts);
    changesHandler.notify(dbName);
    return {
      cancel: function () {
        changesHandler.removeListener(dbName, id);
      }
    };
  }

  var docIds = opts.doc_ids && new ExportedSet(opts.doc_ids);

  opts.since = opts.since || 0;
  var lastSeq = opts.since;

  var limit = 'limit' in opts ? opts.limit : -1;
  if (limit === 0) {
    limit = 1; // per CouchDB _changes spec
  }

  var results = [];
  var numResults = 0;
  var filter = filterChange(opts);
  var docIdsToMetadata = new ExportedMap();

  var txn;
  var bySeqStore;
  var docStore;
  var docIdRevIndex;

  function onBatch(batchKeys, batchValues, cursor) {
    if (!cursor || !batchKeys.length) { // done
      return;
    }

    var winningDocs = new Array(batchKeys.length);
    var metadatas = new Array(batchKeys.length);

    function processMetadataAndWinningDoc(metadata, winningDoc) {
      var change = opts.processChange(winningDoc, metadata, opts);
      lastSeq = change.seq = metadata.seq;

      var filtered = filter(change);
      if (typeof filtered === 'object') { // anything but true/false indicates error
        return Promise.reject(filtered);
      }

      if (!filtered) {
        return Promise.resolve();
      }
      numResults++;
      if (opts.return_docs) {
        results.push(change);
      }
      // process the attachment immediately
      // for the benefit of live listeners
      if (opts.attachments && opts.include_docs) {
        return new Promise(function (resolve) {
          fetchAttachmentsIfNecessary(winningDoc, opts, txn, function () {
            postProcessAttachments([change], opts.binary).then(function () {
              resolve(change);
            });
          });
        });
      } else {
        return Promise.resolve(change);
      }
    }

    function onBatchDone() {
      var promises = [];
      for (var i = 0, len = winningDocs.length; i < len; i++) {
        if (numResults === limit) {
          break;
        }
        var winningDoc = winningDocs[i];
        if (!winningDoc) {
          continue;
        }
        var metadata = metadatas[i];
        promises.push(processMetadataAndWinningDoc(metadata, winningDoc));
      }

      Promise.all(promises).then(function (changes) {
        for (var i = 0, len = changes.length; i < len; i++) {
          if (changes[i]) {
            opts.onChange(changes[i]);
          }
        }
      }).catch(opts.complete);

      if (numResults !== limit) {
        cursor.continue();
      }
    }

    // Fetch all metadatas/winningdocs from this batch in parallel, then process
    // them all only once all data has been collected. This is done in parallel
    // because it's faster than doing it one-at-a-time.
    var numDone = 0;
    batchValues.forEach(function (value, i) {
      var doc = decodeDoc(value);
      var seq = batchKeys[i];
      fetchWinningDocAndMetadata(doc, seq, function (metadata, winningDoc) {
        metadatas[i] = metadata;
        winningDocs[i] = winningDoc;
        if (++numDone === batchKeys.length) {
          onBatchDone();
        }
      });
    });
  }

  function onGetMetadata(doc, seq, metadata, cb) {
    if (metadata.seq !== seq) {
      // some other seq is later
      return cb();
    }

    if (metadata.winningRev === doc._rev) {
      // this is the winning doc
      return cb(metadata, doc);
    }

    // fetch winning doc in separate request
    var docIdRev = doc._id + '::' + metadata.winningRev;
    var req = docIdRevIndex.get(docIdRev);
    req.onsuccess = function (e) {
      cb(metadata, decodeDoc(e.target.result));
    };
  }

  function fetchWinningDocAndMetadata(doc, seq, cb) {
    if (docIds && !docIds.has(doc._id)) {
      return cb();
    }

    var metadata = docIdsToMetadata.get(doc._id);
    if (metadata) { // cached
      return onGetMetadata(doc, seq, metadata, cb);
    }
    // metadata not cached, have to go fetch it
    docStore.get(doc._id).onsuccess = function (e) {
      metadata = decodeMetadata(e.target.result);
      docIdsToMetadata.set(doc._id, metadata);
      onGetMetadata(doc, seq, metadata, cb);
    };
  }

  function finish() {
    opts.complete(null, {
      results: results,
      last_seq: lastSeq
    });
  }

  function onTxnComplete() {
    if (!opts.continuous && opts.attachments) {
      // cannot guarantee that postProcessing was already done,
      // so do it again
      postProcessAttachments(results).then(finish);
    } else {
      finish();
    }
  }

  var objectStores = [DOC_STORE, BY_SEQ_STORE];
  if (opts.attachments) {
    objectStores.push(ATTACH_STORE);
  }
  var txnResult = openTransactionSafely(idb, objectStores, 'readonly');
  if (txnResult.error) {
    return opts.complete(txnResult.error);
  }
  txn = txnResult.txn;
  txn.onabort = idbError(opts.complete);
  txn.oncomplete = onTxnComplete;

  bySeqStore = txn.objectStore(BY_SEQ_STORE);
  docStore = txn.objectStore(DOC_STORE);
  docIdRevIndex = bySeqStore.index('_doc_id_rev');

  var keyRange = (opts.since && !opts.descending) ?
    IDBKeyRange.lowerBound(opts.since, true) : null;

  runBatchedCursor(bySeqStore, keyRange, opts.descending, limit, onBatch);
}

var cachedDBs = new ExportedMap();
var blobSupportPromise;
var openReqList = new ExportedMap();

function IdbPouch(opts, callback) {
  var api = this;

  enqueueTask(function (thisCallback) {
    init(api, opts, thisCallback);
  }, callback, api.constructor);
}

function init(api, opts, callback) {

  var dbName = opts.name;

  var idb = null;
  api._meta = null;

  // called when creating a fresh new database
  function createSchema(db) {
    var docStore = db.createObjectStore(DOC_STORE, {keyPath : 'id'});
    db.createObjectStore(BY_SEQ_STORE, {autoIncrement: true})
      .createIndex('_doc_id_rev', '_doc_id_rev', {unique: true});
    db.createObjectStore(ATTACH_STORE, {keyPath: 'digest'});
    db.createObjectStore(META_STORE, {keyPath: 'id', autoIncrement: false});
    db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);

    // added in v2
    docStore.createIndex('deletedOrLocal', 'deletedOrLocal', {unique : false});

    // added in v3
    db.createObjectStore(LOCAL_STORE, {keyPath: '_id'});

    // added in v4
    var attAndSeqStore = db.createObjectStore(ATTACH_AND_SEQ_STORE,
      {autoIncrement: true});
    attAndSeqStore.createIndex('seq', 'seq');
    attAndSeqStore.createIndex('digestSeq', 'digestSeq', {unique: true});
  }

  // migration to version 2
  // unfortunately "deletedOrLocal" is a misnomer now that we no longer
  // store local docs in the main doc-store, but whaddyagonnado
  function addDeletedOrLocalIndex(txn, callback) {
    var docStore = txn.objectStore(DOC_STORE);
    docStore.createIndex('deletedOrLocal', 'deletedOrLocal', {unique : false});

    docStore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        var metadata = cursor.value;
        var deleted = isDeleted(metadata);
        metadata.deletedOrLocal = deleted ? "1" : "0";
        docStore.put(metadata);
        cursor.continue();
      } else {
        callback();
      }
    };
  }

  // migration to version 3 (part 1)
  function createLocalStoreSchema(db) {
    db.createObjectStore(LOCAL_STORE, {keyPath: '_id'})
      .createIndex('_doc_id_rev', '_doc_id_rev', {unique: true});
  }

  // migration to version 3 (part 2)
  function migrateLocalStore(txn, cb) {
    var localStore = txn.objectStore(LOCAL_STORE);
    var docStore = txn.objectStore(DOC_STORE);
    var seqStore = txn.objectStore(BY_SEQ_STORE);

    var cursor = docStore.openCursor();
    cursor.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        var metadata = cursor.value;
        var docId = metadata.id;
        var local = isLocalId(docId);
        var rev = winningRev(metadata);
        if (local) {
          var docIdRev = docId + "::" + rev;
          // remove all seq entries
          // associated with this docId
          var start = docId + "::";
          var end = docId + "::~";
          var index = seqStore.index('_doc_id_rev');
          var range = IDBKeyRange.bound(start, end, false, false);
          var seqCursor = index.openCursor(range);
          seqCursor.onsuccess = function (e) {
            seqCursor = e.target.result;
            if (!seqCursor) {
              // done
              docStore.delete(cursor.primaryKey);
              cursor.continue();
            } else {
              var data = seqCursor.value;
              if (data._doc_id_rev === docIdRev) {
                localStore.put(data);
              }
              seqStore.delete(seqCursor.primaryKey);
              seqCursor.continue();
            }
          };
        } else {
          cursor.continue();
        }
      } else if (cb) {
        cb();
      }
    };
  }

  // migration to version 4 (part 1)
  function addAttachAndSeqStore(db) {
    var attAndSeqStore = db.createObjectStore(ATTACH_AND_SEQ_STORE,
      {autoIncrement: true});
    attAndSeqStore.createIndex('seq', 'seq');
    attAndSeqStore.createIndex('digestSeq', 'digestSeq', {unique: true});
  }

  // migration to version 4 (part 2)
  function migrateAttsAndSeqs(txn, callback) {
    var seqStore = txn.objectStore(BY_SEQ_STORE);
    var attStore = txn.objectStore(ATTACH_STORE);
    var attAndSeqStore = txn.objectStore(ATTACH_AND_SEQ_STORE);

    // need to actually populate the table. this is the expensive part,
    // so as an optimization, check first that this database even
    // contains attachments
    var req = attStore.count();
    req.onsuccess = function (e) {
      var count = e.target.result;
      if (!count) {
        return callback(); // done
      }

      seqStore.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if (!cursor) {
          return callback(); // done
        }
        var doc = cursor.value;
        var seq = cursor.primaryKey;
        var atts = Object.keys(doc._attachments || {});
        var digestMap = {};
        for (var j = 0; j < atts.length; j++) {
          var att = doc._attachments[atts[j]];
          digestMap[att.digest] = true; // uniq digests, just in case
        }
        var digests = Object.keys(digestMap);
        for (j = 0; j < digests.length; j++) {
          var digest = digests[j];
          attAndSeqStore.put({
            seq: seq,
            digestSeq: digest + '::' + seq
          });
        }
        cursor.continue();
      };
    };
  }

  // migration to version 5
  // Instead of relying on on-the-fly migration of metadata,
  // this brings the doc-store to its modern form:
  // - metadata.winningrev
  // - metadata.seq
  // - stringify the metadata when storing it
  function migrateMetadata(txn) {

    function decodeMetadataCompat(storedObject) {
      if (!storedObject.data) {
        // old format, when we didn't store it stringified
        storedObject.deleted = storedObject.deletedOrLocal === '1';
        return storedObject;
      }
      return decodeMetadata(storedObject);
    }

    // ensure that every metadata has a winningRev and seq,
    // which was previously created on-the-fly but better to migrate
    var bySeqStore = txn.objectStore(BY_SEQ_STORE);
    var docStore = txn.objectStore(DOC_STORE);
    var cursor = docStore.openCursor();
    cursor.onsuccess = function (e) {
      var cursor = e.target.result;
      if (!cursor) {
        return; // done
      }
      var metadata = decodeMetadataCompat(cursor.value);

      metadata.winningRev = metadata.winningRev ||
        winningRev(metadata);

      function fetchMetadataSeq() {
        // metadata.seq was added post-3.2.0, so if it's missing,
        // we need to fetch it manually
        var start = metadata.id + '::';
        var end = metadata.id + '::\uffff';
        var req = bySeqStore.index('_doc_id_rev').openCursor(
          IDBKeyRange.bound(start, end));

        var metadataSeq = 0;
        req.onsuccess = function (e) {
          var cursor = e.target.result;
          if (!cursor) {
            metadata.seq = metadataSeq;
            return onGetMetadataSeq();
          }
          var seq = cursor.primaryKey;
          if (seq > metadataSeq) {
            metadataSeq = seq;
          }
          cursor.continue();
        };
      }

      function onGetMetadataSeq() {
        var metadataToStore = encodeMetadata(metadata,
          metadata.winningRev, metadata.deleted);

        var req = docStore.put(metadataToStore);
        req.onsuccess = function () {
          cursor.continue();
        };
      }

      if (metadata.seq) {
        return onGetMetadataSeq();
      }

      fetchMetadataSeq();
    };

  }

  api._remote = false;
  api.type = function () {
    return 'idb';
  };

  api._id = toPromise(function (callback) {
    callback(null, api._meta.instanceId);
  });

  api._bulkDocs = function idb_bulkDocs(req, reqOpts, callback) {
    idbBulkDocs(opts, req, reqOpts, api, idb, callback);
  };

  // First we look up the metadata in the ids database, then we fetch the
  // current revision(s) from the by sequence store
  api._get = function idb_get(id, opts, callback) {
    var doc;
    var metadata;
    var err;
    var txn = opts.ctx;
    if (!txn) {
      var txnResult = openTransactionSafely(idb,
        [DOC_STORE, BY_SEQ_STORE, ATTACH_STORE], 'readonly');
      if (txnResult.error) {
        return callback(txnResult.error);
      }
      txn = txnResult.txn;
    }

    function finish() {
      callback(err, {doc: doc, metadata: metadata, ctx: txn});
    }

    txn.objectStore(DOC_STORE).get(id).onsuccess = function (e) {
      metadata = decodeMetadata(e.target.result);
      // we can determine the result here if:
      // 1. there is no such document
      // 2. the document is deleted and we don't ask about specific rev
      // When we ask with opts.rev we expect the answer to be either
      // doc (possibly with _deleted=true) or missing error
      if (!metadata) {
        err = createError(MISSING_DOC, 'missing');
        return finish();
      }

      var rev;
      if (!opts.rev) {
        rev = metadata.winningRev;
        var deleted = isDeleted(metadata);
        if (deleted) {
          err = createError(MISSING_DOC, "deleted");
          return finish();
        }
      } else {
        rev = opts.latest ? latest(opts.rev, metadata) : opts.rev;
      }

      var objectStore = txn.objectStore(BY_SEQ_STORE);
      var key = metadata.id + '::' + rev;

      objectStore.index('_doc_id_rev').get(key).onsuccess = function (e) {
        doc = e.target.result;
        if (doc) {
          doc = decodeDoc(doc);
        }
        if (!doc) {
          err = createError(MISSING_DOC, 'missing');
          return finish();
        }
        finish();
      };
    };
  };

  api._getAttachment = function (docId, attachId, attachment, opts, callback) {
    var txn;
    if (opts.ctx) {
      txn = opts.ctx;
    } else {
      var txnResult = openTransactionSafely(idb,
        [DOC_STORE, BY_SEQ_STORE, ATTACH_STORE], 'readonly');
      if (txnResult.error) {
        return callback(txnResult.error);
      }
      txn = txnResult.txn;
    }
    var digest = attachment.digest;
    var type = attachment.content_type;

    txn.objectStore(ATTACH_STORE).get(digest).onsuccess = function (e) {
      var body = e.target.result.body;
      readBlobData(body, type, opts.binary, function (blobData) {
        callback(null, blobData);
      });
    };
  };

  api._info = function idb_info(callback) {
    var updateSeq;
    var docCount;

    var txnResult = openTransactionSafely(idb, [META_STORE, BY_SEQ_STORE], 'readonly');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    var txn = txnResult.txn;
    txn.objectStore(META_STORE).get(META_STORE).onsuccess = function (e) {
      docCount = e.target.result.docCount;
    };
    txn.objectStore(BY_SEQ_STORE).openCursor(null, 'prev').onsuccess = function (e) {
      var cursor = e.target.result;
      updateSeq = cursor ? cursor.key : 0;
    };

    txn.oncomplete = function () {
      callback(null, {
        doc_count: docCount,
        update_seq: updateSeq,
        // for debugging
        idb_attachment_format: (api._meta.blobSupport ? 'binary' : 'base64')
      });
    };
  };

  api._allDocs = function idb_allDocs(opts, callback) {
    idbAllDocs(opts, idb, callback);
  };

  api._changes = function idbChanges(opts) {
    return changes(opts, api, dbName, idb);
  };

  api._close = function (callback) {
    // https://developer.mozilla.org/en-US/docs/IndexedDB/IDBDatabase#close
    // "Returns immediately and closes the connection in a separate thread..."
    idb.close();
    cachedDBs.delete(dbName);
    callback();
  };

  api._getRevisionTree = function (docId, callback) {
    var txnResult = openTransactionSafely(idb, [DOC_STORE], 'readonly');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    var txn = txnResult.txn;
    var req = txn.objectStore(DOC_STORE).get(docId);
    req.onsuccess = function (event) {
      var doc = decodeMetadata(event.target.result);
      if (!doc) {
        callback(createError(MISSING_DOC));
      } else {
        callback(null, doc.rev_tree);
      }
    };
  };

  // This function removes revisions of document docId
  // which are listed in revs and sets this document
  // revision to to rev_tree
  api._doCompaction = function (docId, revs, callback) {
    var stores = [
      DOC_STORE,
      BY_SEQ_STORE,
      ATTACH_STORE,
      ATTACH_AND_SEQ_STORE
    ];
    var txnResult = openTransactionSafely(idb, stores, 'readwrite');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    var txn = txnResult.txn;

    var docStore = txn.objectStore(DOC_STORE);

    docStore.get(docId).onsuccess = function (event) {
      var metadata = decodeMetadata(event.target.result);
      traverseRevTree(metadata.rev_tree, function (isLeaf, pos,
                                                         revHash, ctx, opts) {
        var rev = pos + '-' + revHash;
        if (revs.indexOf(rev) !== -1) {
          opts.status = 'missing';
        }
      });
      compactRevs(revs, docId, txn);
      var winningRev$$1 = metadata.winningRev;
      var deleted = metadata.deleted;
      txn.objectStore(DOC_STORE).put(
        encodeMetadata(metadata, winningRev$$1, deleted));
    };
    txn.onabort = idbError(callback);
    txn.oncomplete = function () {
      callback();
    };
  };


  api._getLocal = function (id, callback) {
    var txnResult = openTransactionSafely(idb, [LOCAL_STORE], 'readonly');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    var tx = txnResult.txn;
    var req = tx.objectStore(LOCAL_STORE).get(id);

    req.onerror = idbError(callback);
    req.onsuccess = function (e) {
      var doc = e.target.result;
      if (!doc) {
        callback(createError(MISSING_DOC));
      } else {
        delete doc['_doc_id_rev']; // for backwards compat
        callback(null, doc);
      }
    };
  };

  api._putLocal = function (doc, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    delete doc._revisions; // ignore this, trust the rev
    var oldRev = doc._rev;
    var id = doc._id;
    if (!oldRev) {
      doc._rev = '0-1';
    } else {
      doc._rev = '0-' + (parseInt(oldRev.split('-')[1], 10) + 1);
    }

    var tx = opts.ctx;
    var ret;
    if (!tx) {
      var txnResult = openTransactionSafely(idb, [LOCAL_STORE], 'readwrite');
      if (txnResult.error) {
        return callback(txnResult.error);
      }
      tx = txnResult.txn;
      tx.onerror = idbError(callback);
      tx.oncomplete = function () {
        if (ret) {
          callback(null, ret);
        }
      };
    }

    var oStore = tx.objectStore(LOCAL_STORE);
    var req;
    if (oldRev) {
      req = oStore.get(id);
      req.onsuccess = function (e) {
        var oldDoc = e.target.result;
        if (!oldDoc || oldDoc._rev !== oldRev) {
          callback(createError(REV_CONFLICT));
        } else { // update
          var req = oStore.put(doc);
          req.onsuccess = function () {
            ret = {ok: true, id: doc._id, rev: doc._rev};
            if (opts.ctx) { // return immediately
              callback(null, ret);
            }
          };
        }
      };
    } else { // new doc
      req = oStore.add(doc);
      req.onerror = function (e) {
        // constraint error, already exists
        callback(createError(REV_CONFLICT));
        e.preventDefault(); // avoid transaction abort
        e.stopPropagation(); // avoid transaction onerror
      };
      req.onsuccess = function () {
        ret = {ok: true, id: doc._id, rev: doc._rev};
        if (opts.ctx) { // return immediately
          callback(null, ret);
        }
      };
    }
  };

  api._removeLocal = function (doc, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    var tx = opts.ctx;
    if (!tx) {
      var txnResult = openTransactionSafely(idb, [LOCAL_STORE], 'readwrite');
      if (txnResult.error) {
        return callback(txnResult.error);
      }
      tx = txnResult.txn;
      tx.oncomplete = function () {
        if (ret) {
          callback(null, ret);
        }
      };
    }
    var ret;
    var id = doc._id;
    var oStore = tx.objectStore(LOCAL_STORE);
    var req = oStore.get(id);

    req.onerror = idbError(callback);
    req.onsuccess = function (e) {
      var oldDoc = e.target.result;
      if (!oldDoc || oldDoc._rev !== doc._rev) {
        callback(createError(MISSING_DOC));
      } else {
        oStore.delete(id);
        ret = {ok: true, id: id, rev: '0-0'};
        if (opts.ctx) { // return immediately
          callback(null, ret);
        }
      }
    };
  };

  api._destroy = function (opts, callback) {
    changesHandler.removeAllListeners(dbName);

    //Close open request for "dbName" database to fix ie delay.
    var openReq = openReqList.get(dbName);
    if (openReq && openReq.result) {
      openReq.result.close();
      cachedDBs.delete(dbName);
    }
    var req = indexedDB.deleteDatabase(dbName);

    req.onsuccess = function () {
      //Remove open request from the list.
      openReqList.delete(dbName);
      if (hasLocalStorage() && (dbName in localStorage)) {
        delete localStorage[dbName];
      }
      callback(null, { 'ok': true });
    };

    req.onerror = idbError(callback);
  };

  var cached = cachedDBs.get(dbName);

  if (cached) {
    idb = cached.idb;
    api._meta = cached.global;
    return nextTick(function () {
      callback(null, api);
    });
  }

  var req = indexedDB.open(dbName, ADAPTER_VERSION);
  openReqList.set(dbName, req);

  req.onupgradeneeded = function (e) {
    var db = e.target.result;
    if (e.oldVersion < 1) {
      return createSchema(db); // new db, initial schema
    }
    // do migrations

    var txn = e.currentTarget.transaction;
    // these migrations have to be done in this function, before
    // control is returned to the event loop, because IndexedDB

    if (e.oldVersion < 3) {
      createLocalStoreSchema(db); // v2 -> v3
    }
    if (e.oldVersion < 4) {
      addAttachAndSeqStore(db); // v3 -> v4
    }

    var migrations = [
      addDeletedOrLocalIndex, // v1 -> v2
      migrateLocalStore,      // v2 -> v3
      migrateAttsAndSeqs,     // v3 -> v4
      migrateMetadata         // v4 -> v5
    ];

    var i = e.oldVersion;

    function next() {
      var migration = migrations[i - 1];
      i++;
      if (migration) {
        migration(txn, next);
      }
    }

    next();
  };

  req.onsuccess = function (e) {

    idb = e.target.result;

    idb.onversionchange = function () {
      idb.close();
      cachedDBs.delete(dbName);
    };

    idb.onabort = function (e) {
      guardedConsole('error', 'Database has a global failure', e.target.error);
      idb.close();
      cachedDBs.delete(dbName);
    };

    // Do a few setup operations (in parallel as much as possible):
    // 1. Fetch meta doc
    // 2. Check blob support
    // 3. Calculate docCount
    // 4. Generate an instanceId if necessary
    // 5. Store docCount and instanceId on meta doc

    var txn = idb.transaction([
      META_STORE,
      DETECT_BLOB_SUPPORT_STORE,
      DOC_STORE
    ], 'readwrite');

    var storedMetaDoc = false;
    var metaDoc;
    var docCount;
    var blobSupport;
    var instanceId;

    function completeSetup() {
      if (typeof blobSupport === 'undefined' || !storedMetaDoc) {
        return;
      }
      api._meta = {
        name: dbName,
        instanceId: instanceId,
        blobSupport: blobSupport
      };

      cachedDBs.set(dbName, {
        idb: idb,
        global: api._meta
      });
      callback(null, api);
    }

    function storeMetaDocIfReady() {
      if (typeof docCount === 'undefined' || typeof metaDoc === 'undefined') {
        return;
      }
      var instanceKey = dbName + '_id';
      if (instanceKey in metaDoc) {
        instanceId = metaDoc[instanceKey];
      } else {
        metaDoc[instanceKey] = instanceId = uuid();
      }
      metaDoc.docCount = docCount;
      txn.objectStore(META_STORE).put(metaDoc);
    }

    //
    // fetch or generate the instanceId
    //
    txn.objectStore(META_STORE).get(META_STORE).onsuccess = function (e) {
      metaDoc = e.target.result || { id: META_STORE };
      storeMetaDocIfReady();
    };

    //
    // countDocs
    //
    countDocs(txn, function (count) {
      docCount = count;
      storeMetaDocIfReady();
    });

    //
    // check blob support
    //
    if (!blobSupportPromise) {
      // make sure blob support is only checked once
      blobSupportPromise = checkBlobSupport(txn);
    }

    blobSupportPromise.then(function (val) {
      blobSupport = val;
      completeSetup();
    });

    // only when the metadata put transaction has completed,
    // consider the setup done
    txn.oncomplete = function () {
      storedMetaDoc = true;
      completeSetup();
    };
    txn.onabort = idbError(callback);
  };

  req.onerror = function () {
    var msg = 'Failed to open indexedDB, are you in private browsing mode?';
    guardedConsole('error', msg);
    callback(createError(IDB_ERROR, msg));
  };
}

IdbPouch.valid = function () {
  // Following #7085 buggy idb versions (typically Safari < 10.1) are
  // considered valid.

  // On Firefox SecurityError is thrown while referencing indexedDB if cookies
  // are not allowed. `typeof indexedDB` also triggers the error.
  try {
    // some outdated implementations of IDB that appear on Samsung
    // and HTC Android devices <4.4 are missing IDBKeyRange
    return typeof indexedDB !== 'undefined' && typeof IDBKeyRange !== 'undefined';
  } catch (e) {
    return false;
  }
};

function IDBPouch (PouchDB) {
  PouchDB.adapter('idb', IdbPouch, true);
}

// dead simple promise pool, inspired by https://github.com/timdp/es6-promise-pool
// but much smaller in code size. limits the number of concurrent promises that are executed


function pool(promiseFactories, limit) {
  return new Promise(function (resolve, reject) {
    var running = 0;
    var current = 0;
    var done = 0;
    var len = promiseFactories.length;
    var err;

    function runNext() {
      running++;
      promiseFactories[current++]().then(onSuccess, onError);
    }

    function doNext() {
      if (++done === len) {
        /* istanbul ignore if */
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      } else {
        runNextBatch();
      }
    }

    function onSuccess() {
      running--;
      doNext();
    }

    /* istanbul ignore next */
    function onError(thisErr) {
      running--;
      err = err || thisErr;
      doNext();
    }

    function runNextBatch() {
      while (running < limit && current < len) {
        runNext();
      }
    }

    runNextBatch();
  });
}

var CHANGES_BATCH_SIZE = 25;
var MAX_SIMULTANEOUS_REVS = 50;
var CHANGES_TIMEOUT_BUFFER = 5000;
var DEFAULT_HEARTBEAT = 10000;

var supportsBulkGetMap = {};

function readAttachmentsAsBlobOrBuffer(row) {
  var doc = row.doc || row.ok;
  var atts = doc._attachments;
  if (!atts) {
    return;
  }
  Object.keys(atts).forEach(function (filename) {
    var att = atts[filename];
    att.data = b64ToBluffer(att.data, att.content_type);
  });
}

function encodeDocId(id) {
  if (/^_design/.test(id)) {
    return '_design/' + encodeURIComponent(id.slice(8));
  }
  if (/^_local/.test(id)) {
    return '_local/' + encodeURIComponent(id.slice(7));
  }
  return encodeURIComponent(id);
}

function preprocessAttachments$1(doc) {
  if (!doc._attachments || !Object.keys(doc._attachments)) {
    return Promise.resolve();
  }

  return Promise.all(Object.keys(doc._attachments).map(function (key) {
    var attachment = doc._attachments[key];
    if (attachment.data && typeof attachment.data !== 'string') {
      return new Promise(function (resolve) {
        blobToBase64(attachment.data, resolve);
      }).then(function (b64) {
        attachment.data = b64;
      });
    }
  }));
}

function hasUrlPrefix(opts) {
  if (!opts.prefix) {
    return false;
  }
  var protocol = parseUri(opts.prefix).protocol;
  return protocol === 'http' || protocol === 'https';
}

// Get all the information you possibly can about the URI given by name and
// return it as a suitable object.
function getHost(name, opts) {
  // encode db name if opts.prefix is a url (#5574)
  if (hasUrlPrefix(opts)) {
    var dbName = opts.name.substr(opts.prefix.length);
    // Ensure prefix has a trailing slash
    var prefix = opts.prefix.replace(/\/?$/, '/');
    name = prefix + encodeURIComponent(dbName);
  }

  var uri = parseUri(name);
  if (uri.user || uri.password) {
    uri.auth = {username: uri.user, password: uri.password};
  }

  // Split the path part of the URI into parts using '/' as the delimiter
  // after removing any leading '/' and any trailing '/'
  var parts = uri.path.replace(/(^\/|\/$)/g, '').split('/');

  uri.db = parts.pop();
  // Prevent double encoding of URI component
  if (uri.db.indexOf('%') === -1) {
    uri.db = encodeURIComponent(uri.db);
  }

  uri.path = parts.join('/');

  return uri;
}

// Generate a URL with the host data given by opts and the given path
function genDBUrl(opts, path) {
  return genUrl(opts, opts.db + '/' + path);
}

// Generate a URL with the host data given by opts and the given path
function genUrl(opts, path) {
  // If the host already has a path, then we need to have a path delimiter
  // Otherwise, the path delimiter is the empty string
  var pathDel = !opts.path ? '' : '/';

  // If the host already has a path, then we need to have a path delimiter
  // Otherwise, the path delimiter is the empty string
  return opts.protocol + '://' + opts.host +
         (opts.port ? (':' + opts.port) : '') +
         '/' + opts.path + pathDel + path;
}

function paramsToStr(params) {
  return '?' + Object.keys(params).map(function (k) {
    return k + '=' + encodeURIComponent(params[k]);
  }).join('&');
}

function shouldCacheBust(opts) {
  var ua = (typeof navigator !== 'undefined' && navigator.userAgent) ?
      navigator.userAgent.toLowerCase() : '';
  var isIE = ua.indexOf('msie') !== -1;
  var isTrident = ua.indexOf('trident') !== -1;
  var isEdge = ua.indexOf('edge') !== -1;
  var isGET = !('method' in opts) || opts.method === 'GET';
  return (isIE || isTrident || isEdge) && isGET;
}

// Implements the PouchDB API for dealing with CouchDB instances over HTTP
function HttpPouch(opts, callback) {

  // The functions that will be publicly available for HttpPouch
  var api = this;

  var host = getHost(opts.name, opts);
  var dbUrl = genDBUrl(host, '');

  opts = clone(opts);

  var ourFetch = function (url, options) {

    options = options || {};
    options.headers = options.headers || new h();

    if (opts.auth || host.auth) {
      var nAuth = opts.auth || host.auth;
      var str = nAuth.username + ':' + nAuth.password;
      var token = thisBtoa(unescape(encodeURIComponent(str)));
      options.headers.set('Authorization', 'Basic ' + token);
    }

    var headers = opts.headers || {};
    Object.keys(headers).forEach(function (key) {
      options.headers.append(key, headers[key]);
    });

    /* istanbul ignore if */
    if (shouldCacheBust(options)) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + '_nonce=' + Date.now();
    }

    var fetchFun = opts.fetch || f$1;
    return fetchFun(url, options);
  };

  function adapterFun$$1(name, fun) {
    return adapterFun(name, getArguments(function (args) {
      setup().then(function () {
        return fun.apply(this, args);
      }).catch(function (e) {
        var callback = args.pop();
        callback(e);
      });
    })).bind(api);
  }

  function fetchJSON(url, options, callback) {

    var result = {};

    options = options || {};
    options.headers = options.headers || new h();

    if (!options.headers.get('Content-Type')) {
      options.headers.set('Content-Type', 'application/json');
    }
    if (!options.headers.get('Accept')) {
      options.headers.set('Accept', 'application/json');
    }

    return ourFetch(url, options).then(function (response) {
      result.ok = response.ok;
      result.status = response.status;
      return response.json();
    }).then(function (json) {
      result.data = json;
      if (!result.ok) {
        result.data.status = result.status;
        var err = generateErrorFromResponse(result.data);
        if (callback) {
          return callback(err);
        } else {
          throw err;
        }
      }

      if (Array.isArray(result.data)) {
        result.data = result.data.map(function (v) {
          if (v.error || v.missing) {
            return generateErrorFromResponse(v);
          } else {
            return v;
          }
        });
      }

      if (callback) {
        callback(null, result.data);
      } else {
        return result;
      }
    });
  }

  var setupPromise;

  function setup() {
    if (opts.skip_setup) {
      return Promise.resolve();
    }

    // If there is a setup in process or previous successful setup
    // done then we will use that
    // If previous setups have been rejected we will try again
    if (setupPromise) {
      return setupPromise;
    }

    setupPromise = fetchJSON(dbUrl).catch(function (err) {
      if (err && err.status && err.status === 404) {
        // Doesnt exist, create it
        explainError(404, 'PouchDB is just detecting if the remote exists.');
        return fetchJSON(dbUrl, {method: 'PUT'});
      } else {
        return Promise.reject(err);
      }
    }).catch(function (err) {
      // If we try to create a database that already exists, skipped in
      // istanbul since its catching a race condition.
      /* istanbul ignore if */
      if (err && err.status && err.status === 412) {
        return true;
      }
      return Promise.reject(err);
    });

    setupPromise.catch(function () {
      setupPromise = null;
    });

    return setupPromise;
  }

  nextTick(function () {
    callback(null, api);
  });

  api._remote = true;

  /* istanbul ignore next */
  api.type = function () {
    return 'http';
  };

  api.id = adapterFun$$1('id', function (callback) {
    ourFetch(genUrl(host, '')).then(function (response) {
      return response.json();
    }).then(function (result) {
      var uuid$$1 = (result && result.uuid) ?
          (result.uuid + host.db) : genDBUrl(host, '');
      callback(null, uuid$$1);
    }).catch(function (err) {
      callback(err);
    });
  });

  // Sends a POST request to the host calling the couchdb _compact function
  //    version: The version of CouchDB it is running
  api.compact = adapterFun$$1('compact', function (opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    opts = clone(opts);

    fetchJSON(genDBUrl(host, '_compact'), {method: 'POST'}).then(function () {
      function ping() {
        api.info(function (err, res) {
          // CouchDB may send a "compact_running:true" if it's
          // already compacting. PouchDB Server doesn't.
          /* istanbul ignore else */
          if (res && !res.compact_running) {
            callback(null, {ok: true});
          } else {
            setTimeout(ping, opts.interval || 200);
          }
        });
      }
      // Ping the http if it's finished compaction
      ping();
    });
  });

  api.bulkGet = adapterFun('bulkGet', function (opts, callback) {
    var self = this;

    function doBulkGet(cb) {
      var params = {};
      if (opts.revs) {
        params.revs = true;
      }
      if (opts.attachments) {
        /* istanbul ignore next */
        params.attachments = true;
      }
      if (opts.latest) {
        params.latest = true;
      }
      fetchJSON(genDBUrl(host, '_bulk_get' + paramsToStr(params)), {
        method: 'POST',
        body: JSON.stringify({ docs: opts.docs})
      }).then(function (result) {
        if (opts.attachments && opts.binary) {
          result.data.results.forEach(function (res) {
            res.docs.forEach(readAttachmentsAsBlobOrBuffer);
          });
        }
        cb(null, result.data);
      }).catch(cb);
    }

    /* istanbul ignore next */
    function doBulkGetShim() {
      // avoid "url too long error" by splitting up into multiple requests
      var batchSize = MAX_SIMULTANEOUS_REVS;
      var numBatches = Math.ceil(opts.docs.length / batchSize);
      var numDone = 0;
      var results = new Array(numBatches);

      function onResult(batchNum) {
        return function (err, res) {
          // err is impossible because shim returns a list of errs in that case
          results[batchNum] = res.results;
          if (++numDone === numBatches) {
            callback(null, {results: flatten(results)});
          }
        };
      }

      for (var i = 0; i < numBatches; i++) {
        var subOpts = pick(opts, ['revs', 'attachments', 'binary', 'latest']);
        subOpts.docs = opts.docs.slice(i * batchSize,
          Math.min(opts.docs.length, (i + 1) * batchSize));
        bulkGet(self, subOpts, onResult(i));
      }
    }

    // mark the whole database as either supporting or not supporting _bulk_get
    var dbUrl = genUrl(host, '');
    var supportsBulkGet = supportsBulkGetMap[dbUrl];

    /* istanbul ignore next */
    if (typeof supportsBulkGet !== 'boolean') {
      // check if this database supports _bulk_get
      doBulkGet(function (err, res) {
        if (err) {
          supportsBulkGetMap[dbUrl] = false;
          explainError(
            err.status,
            'PouchDB is just detecting if the remote ' +
            'supports the _bulk_get API.'
          );
          doBulkGetShim();
        } else {
          supportsBulkGetMap[dbUrl] = true;
          callback(null, res);
        }
      });
    } else if (supportsBulkGet) {
      doBulkGet(callback);
    } else {
      doBulkGetShim();
    }
  });

  // Calls GET on the host, which gets back a JSON string containing
  //    couchdb: A welcome string
  //    version: The version of CouchDB it is running
  api._info = function (callback) {
    setup().then(function () {
      return ourFetch(genDBUrl(host, ''));
    }).then(function (response) {
      return response.json();
    }).then(function (info) {
      info.host = genDBUrl(host, '');
      callback(null, info);
    }).catch(callback);
  };

  api.fetch = function (path, options) {
    return setup().then(function () {
      return ourFetch(genDBUrl(host, path), options);
    });
  };

  // Get the document with the given id from the database given by host.
  // The id could be solely the _id in the database, or it may be a
  // _design/ID or _local/ID path
  api.get = adapterFun$$1('get', function (id, opts, callback) {
    // If no options were given, set the callback to the second parameter
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    opts = clone(opts);

    // List of parameters to add to the GET request
    var params = {};

    if (opts.revs) {
      params.revs = true;
    }

    if (opts.revs_info) {
      params.revs_info = true;
    }

    if (opts.latest) {
      params.latest = true;
    }

    if (opts.open_revs) {
      if (opts.open_revs !== "all") {
        opts.open_revs = JSON.stringify(opts.open_revs);
      }
      params.open_revs = opts.open_revs;
    }

    if (opts.rev) {
      params.rev = opts.rev;
    }

    if (opts.conflicts) {
      params.conflicts = opts.conflicts;
    }

    /* istanbul ignore if */
    if (opts.update_seq) {
      params.update_seq = opts.update_seq;
    }

    id = encodeDocId(id);

    function fetchAttachments(doc) {
      var atts = doc._attachments;
      var filenames = atts && Object.keys(atts);
      if (!atts || !filenames.length) {
        return;
      }
      // we fetch these manually in separate XHRs, because
      // Sync Gateway would normally send it back as multipart/mixed,
      // which we cannot parse. Also, this is more efficient than
      // receiving attachments as base64-encoded strings.
      function fetchData(filename) {
        var att = atts[filename];
        var path = encodeDocId(doc._id) + '/' + encodeAttachmentId(filename) +
            '?rev=' + doc._rev;
        return ourFetch(genDBUrl(host, path)).then(function (response) {
          if (typeof process !== 'undefined' && !process.browser) {
            return response.buffer();
          } else {
            /* istanbul ignore next */
            return response.blob();
          }
        }).then(function (blob) {
          if (opts.binary) {
            // TODO: Can we remove this?
            if (typeof process !== 'undefined' && !process.browser) {
              blob.type = att.content_type;
            }
            return blob;
          }
          return new Promise(function (resolve) {
            blobToBase64(blob, resolve);
          });
        }).then(function (data) {
          delete att.stub;
          delete att.length;
          att.data = data;
        });
      }

      var promiseFactories = filenames.map(function (filename) {
        return function () {
          return fetchData(filename);
        };
      });

      // This limits the number of parallel xhr requests to 5 any time
      // to avoid issues with maximum browser request limits
      return pool(promiseFactories, 5);
    }

    function fetchAllAttachments(docOrDocs) {
      if (Array.isArray(docOrDocs)) {
        return Promise.all(docOrDocs.map(function (doc) {
          if (doc.ok) {
            return fetchAttachments(doc.ok);
          }
        }));
      }
      return fetchAttachments(docOrDocs);
    }

    var url = genDBUrl(host, id + paramsToStr(params));
    fetchJSON(url).then(function (res) {
      return Promise.resolve().then(function () {
        if (opts.attachments) {
          return fetchAllAttachments(res.data);
        }
      }).then(function () {
        callback(null, res.data);
      });
    }).catch(function (e) {
      e.docId = id;
      callback(e);
    });
  });


  // Delete the document given by doc from the database given by host.
  api.remove = adapterFun$$1('remove', function (docOrId, optsOrRev, opts, cb) {
    var doc;
    if (typeof optsOrRev === 'string') {
      // id, rev, opts, callback style
      doc = {
        _id: docOrId,
        _rev: optsOrRev
      };
      if (typeof opts === 'function') {
        cb = opts;
        opts = {};
      }
    } else {
      // doc, opts, callback style
      doc = docOrId;
      if (typeof optsOrRev === 'function') {
        cb = optsOrRev;
        opts = {};
      } else {
        cb = opts;
        opts = optsOrRev;
      }
    }

    var rev = (doc._rev || opts.rev);
    var url = genDBUrl(host, encodeDocId(doc._id)) + '?rev=' + rev;

    fetchJSON(url, {method: 'DELETE'}, cb).catch(cb);
  });

  function encodeAttachmentId(attachmentId) {
    return attachmentId.split("/").map(encodeURIComponent).join("/");
  }

  // Get the attachment
  api.getAttachment = adapterFun$$1('getAttachment', function (docId, attachmentId,
                                                            opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    var params = opts.rev ? ('?rev=' + opts.rev) : '';
    var url = genDBUrl(host, encodeDocId(docId)) + '/' +
        encodeAttachmentId(attachmentId) + params;
    var contentType;
    ourFetch(url, {method: 'GET'}).then(function (response) {
      contentType = response.headers.get('content-type');
      if (!response.ok) {
        throw response;
      } else {
        if (typeof process !== 'undefined' && !process.browser) {
          return response.buffer();
        } else {
          /* istanbul ignore next */
          return response.blob();
        }
      }
    }).then(function (blob) {
      // TODO: also remove
      if (typeof process !== 'undefined' && !process.browser) {
        blob.type = contentType;
      }
      callback(null, blob);
    }).catch(function (err) {
      callback(err);
    });
  });

  // Remove the attachment given by the id and rev
  api.removeAttachment =  adapterFun$$1('removeAttachment', function (docId,
                                                                   attachmentId,
                                                                   rev,
                                                                   callback) {
    var url = genDBUrl(host, encodeDocId(docId) + '/' +
                       encodeAttachmentId(attachmentId)) + '?rev=' + rev;
    fetchJSON(url, {method: 'DELETE'}, callback).catch(callback);
  });

  // Add the attachment given by blob and its contentType property
  // to the document with the given id, the revision given by rev, and
  // add it to the database given by host.
  api.putAttachment = adapterFun$$1('putAttachment', function (docId, attachmentId,
                                                            rev, blob,
                                                            type, callback) {
    if (typeof type === 'function') {
      callback = type;
      type = blob;
      blob = rev;
      rev = null;
    }
    var id = encodeDocId(docId) + '/' + encodeAttachmentId(attachmentId);
    var url = genDBUrl(host, id);
    if (rev) {
      url += '?rev=' + rev;
    }

    if (typeof blob === 'string') {
      // input is assumed to be a base64 string
      var binary;
      try {
        binary = thisAtob(blob);
      } catch (err) {
        return callback(createError(BAD_ARG,
                        'Attachment is not a valid base64 string'));
      }
      blob = binary ? binStringToBluffer(binary, type) : '';
    }

    // Add the attachment
    fetchJSON(url, {
      headers: new h({'Content-Type': type}),
      method: 'PUT',
      body: blob
    }, callback).catch(callback);
  });

  // Update/create multiple documents given by req in the database
  // given by host.
  api._bulkDocs = function (req, opts, callback) {
    // If new_edits=false then it prevents the database from creating
    // new revision numbers for the documents. Instead it just uses
    // the old ones. This is used in database replication.
    req.new_edits = opts.new_edits;

    setup().then(function () {
      return Promise.all(req.docs.map(preprocessAttachments$1));
    }).then(function () {
      // Update/create the documents
      return fetchJSON(genDBUrl(host, '_bulk_docs'), {
        method: 'POST',
        body: JSON.stringify(req)
      }, callback);
    }).catch(callback);
  };


  // Update/create document
  api._put = function (doc, opts, callback) {
    setup().then(function () {
      return preprocessAttachments$1(doc);
    }).then(function () {
      return fetchJSON(genDBUrl(host, encodeDocId(doc._id)), {
        method: 'PUT',
        body: JSON.stringify(doc)
      });
    }).then(function (result) {
      callback(null, result.data);
    }).catch(function (err) {
      err.docId = doc && doc._id;
      callback(err);
    });
  };


  // Get a listing of the documents in the database given
  // by host and ordered by increasing id.
  api.allDocs = adapterFun$$1('allDocs', function (opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    opts = clone(opts);

    // List of parameters to add to the GET request
    var params = {};
    var body;
    var method = 'GET';

    if (opts.conflicts) {
      params.conflicts = true;
    }

    /* istanbul ignore if */
    if (opts.update_seq) {
      params.update_seq = true;
    }

    if (opts.descending) {
      params.descending = true;
    }

    if (opts.include_docs) {
      params.include_docs = true;
    }

    // added in CouchDB 1.6.0
    if (opts.attachments) {
      params.attachments = true;
    }

    if (opts.key) {
      params.key = JSON.stringify(opts.key);
    }

    if (opts.start_key) {
      opts.startkey = opts.start_key;
    }

    if (opts.startkey) {
      params.startkey = JSON.stringify(opts.startkey);
    }

    if (opts.end_key) {
      opts.endkey = opts.end_key;
    }

    if (opts.endkey) {
      params.endkey = JSON.stringify(opts.endkey);
    }

    if (typeof opts.inclusive_end !== 'undefined') {
      params.inclusive_end = !!opts.inclusive_end;
    }

    if (typeof opts.limit !== 'undefined') {
      params.limit = opts.limit;
    }

    if (typeof opts.skip !== 'undefined') {
      params.skip = opts.skip;
    }

    var paramStr = paramsToStr(params);

    if (typeof opts.keys !== 'undefined') {
      method = 'POST';
      body = {keys: opts.keys};
    }

    fetchJSON(genDBUrl(host, '_all_docs' + paramStr), {
       method: method,
      body: JSON.stringify(body)
    }).then(function (result) {
      if (opts.include_docs && opts.attachments && opts.binary) {
        result.data.rows.forEach(readAttachmentsAsBlobOrBuffer);
      }
      callback(null, result.data);
    }).catch(callback);
  });

  // Get a list of changes made to documents in the database given by host.
  // TODO According to the README, there should be two other methods here,
  // api.changes.addListener and api.changes.removeListener.
  api._changes = function (opts) {

    // We internally page the results of a changes request, this means
    // if there is a large set of changes to be returned we can start
    // processing them quicker instead of waiting on the entire
    // set of changes to return and attempting to process them at once
    var batchSize = 'batch_size' in opts ? opts.batch_size : CHANGES_BATCH_SIZE;

    opts = clone(opts);

    if (opts.continuous && !('heartbeat' in opts)) {
      opts.heartbeat = DEFAULT_HEARTBEAT;
    }

    var requestTimeout = ('timeout' in opts) ? opts.timeout : 30 * 1000;

    // ensure CHANGES_TIMEOUT_BUFFER applies
    if ('timeout' in opts && opts.timeout &&
      (requestTimeout - opts.timeout) < CHANGES_TIMEOUT_BUFFER) {
        requestTimeout = opts.timeout + CHANGES_TIMEOUT_BUFFER;
    }

    /* istanbul ignore if */
    if ('heartbeat' in opts && opts.heartbeat &&
       (requestTimeout - opts.heartbeat) < CHANGES_TIMEOUT_BUFFER) {
        requestTimeout = opts.heartbeat + CHANGES_TIMEOUT_BUFFER;
    }

    var params = {};
    if ('timeout' in opts && opts.timeout) {
      params.timeout = opts.timeout;
    }

    var limit = (typeof opts.limit !== 'undefined') ? opts.limit : false;
    var leftToFetch = limit;

    if (opts.style) {
      params.style = opts.style;
    }

    if (opts.include_docs || opts.filter && typeof opts.filter === 'function') {
      params.include_docs = true;
    }

    if (opts.attachments) {
      params.attachments = true;
    }

    if (opts.continuous) {
      params.feed = 'longpoll';
    }

    if (opts.seq_interval) {
      params.seq_interval = opts.seq_interval;
    }

    if (opts.conflicts) {
      params.conflicts = true;
    }

    if (opts.descending) {
      params.descending = true;
    }
    
    /* istanbul ignore if */
    if (opts.update_seq) {
      params.update_seq = true;
    }

    if ('heartbeat' in opts) {
      // If the heartbeat value is false, it disables the default heartbeat
      if (opts.heartbeat) {
        params.heartbeat = opts.heartbeat;
      }
    }

    if (opts.filter && typeof opts.filter === 'string') {
      params.filter = opts.filter;
    }

    if (opts.view && typeof opts.view === 'string') {
      params.filter = '_view';
      params.view = opts.view;
    }

    // If opts.query_params exists, pass it through to the changes request.
    // These parameters may be used by the filter on the source database.
    if (opts.query_params && typeof opts.query_params === 'object') {
      for (var param_name in opts.query_params) {
        /* istanbul ignore else */
        if (opts.query_params.hasOwnProperty(param_name)) {
          params[param_name] = opts.query_params[param_name];
        }
      }
    }

    var method = 'GET';
    var body;

    if (opts.doc_ids) {
      // set this automagically for the user; it's annoying that couchdb
      // requires both a "filter" and a "doc_ids" param.
      params.filter = '_doc_ids';
      method = 'POST';
      body = {doc_ids: opts.doc_ids };
    }
    /* istanbul ignore next */
    else if (opts.selector) {
      // set this automagically for the user, similar to above
      params.filter = '_selector';
      method = 'POST';
      body = {selector: opts.selector };
    }

    var controller = new a();
    var lastFetchedSeq;

    // Get all the changes starting wtih the one immediately after the
    // sequence number given by since.
    var fetchData = function (since, callback) {
      if (opts.aborted) {
        return;
      }
      params.since = since;
      // "since" can be any kind of json object in Cloudant/CouchDB 2.x
      /* istanbul ignore next */
      if (typeof params.since === "object") {
        params.since = JSON.stringify(params.since);
      }

      if (opts.descending) {
        if (limit) {
          params.limit = leftToFetch;
        }
      } else {
        params.limit = (!limit || leftToFetch > batchSize) ?
          batchSize : leftToFetch;
      }

      // Set the options for the ajax call
      var url = genDBUrl(host, '_changes' + paramsToStr(params));
      var fetchOpts = {
        signal: controller.signal,
        method: method,
        body: JSON.stringify(body)
      };
      lastFetchedSeq = since;

      /* istanbul ignore if */
      if (opts.aborted) {
        return;
      }

      // Get the changes
      setup().then(function () {
        return fetchJSON(url, fetchOpts, callback);
      }).catch(callback);
    };

    // If opts.since exists, get all the changes from the sequence
    // number given by opts.since. Otherwise, get all the changes
    // from the sequence number 0.
    var results = {results: []};

    var fetched = function (err, res) {
      if (opts.aborted) {
        return;
      }
      var raw_results_length = 0;
      // If the result of the ajax call (res) contains changes (res.results)
      if (res && res.results) {
        raw_results_length = res.results.length;
        results.last_seq = res.last_seq;
        var pending = null;
        var lastSeq = null;
        // Attach 'pending' property if server supports it (CouchDB 2.0+)
        /* istanbul ignore if */
        if (typeof res.pending === 'number') {
          pending = res.pending;
        }
        if (typeof results.last_seq === 'string' || typeof results.last_seq === 'number') {
          lastSeq = results.last_seq;
        }
        // For each change
        var req = {};
        req.query = opts.query_params;
        res.results = res.results.filter(function (c) {
          leftToFetch--;
          var ret = filterChange(opts)(c);
          if (ret) {
            if (opts.include_docs && opts.attachments && opts.binary) {
              readAttachmentsAsBlobOrBuffer(c);
            }
            if (opts.return_docs) {
              results.results.push(c);
            }
            opts.onChange(c, pending, lastSeq);
          }
          return ret;
        });
      } else if (err) {
        // In case of an error, stop listening for changes and call
        // opts.complete
        opts.aborted = true;
        opts.complete(err);
        return;
      }

      // The changes feed may have timed out with no results
      // if so reuse last update sequence
      if (res && res.last_seq) {
        lastFetchedSeq = res.last_seq;
      }

      var finished = (limit && leftToFetch <= 0) ||
        (res && raw_results_length < batchSize) ||
        (opts.descending);

      if ((opts.continuous && !(limit && leftToFetch <= 0)) || !finished) {
        // Queue a call to fetch again with the newest sequence number
        nextTick(function () { fetchData(lastFetchedSeq, fetched); });
      } else {
        // We're done, call the callback
        opts.complete(null, results);
      }
    };

    fetchData(opts.since || 0, fetched);

    // Return a method to cancel this method from processing any more
    return {
      cancel: function () {
        opts.aborted = true;
        controller.abort();
      }
    };
  };

  // Given a set of document/revision IDs (given by req), tets the subset of
  // those that do NOT correspond to revisions stored in the database.
  // See http://wiki.apache.org/couchdb/HttpPostRevsDiff
  api.revsDiff = adapterFun$$1('revsDiff', function (req, opts, callback) {
    // If no options were given, set the callback to be the second parameter
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    // Get the missing document/revision IDs
    fetchJSON(genDBUrl(host, '_revs_diff'), {
      method: 'POST',
      body: JSON.stringify(req)
    }, callback).catch(callback);
  });

  api._close = function (callback) {
    callback();
  };

  api._destroy = function (options, callback) {
    fetchJSON(genDBUrl(host, ''), {method: 'DELETE'}).then(function (json) {
      callback(null, json);
    }).catch(function (err) {
      /* istanbul ignore if */
      if (err.status === 404) {
        callback(null, {ok: true});
      } else {
        callback(err);
      }
    });
  };
}

// HttpPouch is a valid adapter.
HttpPouch.valid = function () {
  return true;
};

function HttpPouch$1 (PouchDB) {
  PouchDB.adapter('http', HttpPouch, false);
  PouchDB.adapter('https', HttpPouch, false);
}

function QueryParseError(message) {
  this.status = 400;
  this.name = 'query_parse_error';
  this.message = message;
  this.error = true;
  try {
    Error.captureStackTrace(this, QueryParseError);
  } catch (e) {}
}

inherits(QueryParseError, Error);

function NotFoundError(message) {
  this.status = 404;
  this.name = 'not_found';
  this.message = message;
  this.error = true;
  try {
    Error.captureStackTrace(this, NotFoundError);
  } catch (e) {}
}

inherits(NotFoundError, Error);

function BuiltInError(message) {
  this.status = 500;
  this.name = 'invalid_value';
  this.message = message;
  this.error = true;
  try {
    Error.captureStackTrace(this, BuiltInError);
  } catch (e) {}
}

inherits(BuiltInError, Error);

function promisedCallback(promise, callback) {
  if (callback) {
    promise.then(function (res) {
      nextTick(function () {
        callback(null, res);
      });
    }, function (reason) {
      nextTick(function () {
        callback(reason);
      });
    });
  }
  return promise;
}

function callbackify(fun) {
  return getArguments(function (args) {
    var cb = args.pop();
    var promise = fun.apply(this, args);
    if (typeof cb === 'function') {
      promisedCallback(promise, cb);
    }
    return promise;
  });
}

// Promise finally util similar to Q.finally
function fin(promise, finalPromiseFactory) {
  return promise.then(function (res) {
    return finalPromiseFactory().then(function () {
      return res;
    });
  }, function (reason) {
    return finalPromiseFactory().then(function () {
      throw reason;
    });
  });
}

function sequentialize(queue, promiseFactory) {
  return function () {
    var args = arguments;
    var that = this;
    return queue.add(function () {
      return promiseFactory.apply(that, args);
    });
  };
}

// uniq an array of strings, order not guaranteed
// similar to underscore/lodash _.uniq
function uniq(arr) {
  var theSet = new ExportedSet(arr);
  var result = new Array(theSet.size);
  var index = -1;
  theSet.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

function mapToKeysArray(map) {
  var result = new Array(map.size);
  var index = -1;
  map.forEach(function (value, key) {
    result[++index] = key;
  });
  return result;
}

function createBuiltInError(name) {
  var message = 'builtin ' + name +
    ' function requires map values to be numbers' +
    ' or number arrays';
  return new BuiltInError(message);
}

function sum(values) {
  var result = 0;
  for (var i = 0, len = values.length; i < len; i++) {
    var num = values[i];
    if (typeof num !== 'number') {
      if (Array.isArray(num)) {
        // lists of numbers are also allowed, sum them separately
        result = typeof result === 'number' ? [result] : result;
        for (var j = 0, jLen = num.length; j < jLen; j++) {
          var jNum = num[j];
          if (typeof jNum !== 'number') {
            throw createBuiltInError('_sum');
          } else if (typeof result[j] === 'undefined') {
            result.push(jNum);
          } else {
            result[j] += jNum;
          }
        }
      } else { // not array/number
        throw createBuiltInError('_sum');
      }
    } else if (typeof result === 'number') {
      result += num;
    } else { // add number to array
      result[0] += num;
    }
  }
  return result;
}

var log = guardedConsole.bind(null, 'log');
var isArray = Array.isArray;
var toJSON = JSON.parse;

function evalFunctionWithEval(func, emit) {
  return scopeEval(
    "return (" + func.replace(/;\s*$/, "") + ");",
    {
      emit: emit,
      sum: sum,
      log: log,
      isArray: isArray,
      toJSON: toJSON
    }
  );
}

/*
 * Simple task queue to sequentialize actions. Assumes
 * callbacks will eventually fire (once).
 */


function TaskQueue$1() {
  this.promise = new Promise(function (fulfill) {fulfill(); });
}
TaskQueue$1.prototype.add = function (promiseFactory) {
  this.promise = this.promise.catch(function () {
    // just recover
  }).then(function () {
    return promiseFactory();
  });
  return this.promise;
};
TaskQueue$1.prototype.finish = function () {
  return this.promise;
};

function stringify(input) {
  if (!input) {
    return 'undefined'; // backwards compat for empty reduce
  }
  // for backwards compat with mapreduce, functions/strings are stringified
  // as-is. everything else is JSON-stringified.
  switch (typeof input) {
    case 'function':
      // e.g. a mapreduce map
      return input.toString();
    case 'string':
      // e.g. a mapreduce built-in _reduce function
      return input.toString();
    default:
      // e.g. a JSON object in the case of mango queries
      return JSON.stringify(input);
  }
}

/* create a string signature for a view so we can cache it and uniq it */
function createViewSignature(mapFun, reduceFun) {
  // the "undefined" part is for backwards compatibility
  return stringify(mapFun) + stringify(reduceFun) + 'undefined';
}

function createView(sourceDB, viewName, mapFun, reduceFun, temporary, localDocName) {
  var viewSignature = createViewSignature(mapFun, reduceFun);

  var cachedViews;
  if (!temporary) {
    // cache this to ensure we don't try to update the same view twice
    cachedViews = sourceDB._cachedViews = sourceDB._cachedViews || {};
    if (cachedViews[viewSignature]) {
      return cachedViews[viewSignature];
    }
  }

  var promiseForView = sourceDB.info().then(function (info) {

    var depDbName = info.db_name + '-mrview-' +
      (temporary ? 'temp' : stringMd5(viewSignature));

    // save the view name in the source db so it can be cleaned up if necessary
    // (e.g. when the _design doc is deleted, remove all associated view data)
    function diffFunction(doc) {
      doc.views = doc.views || {};
      var fullViewName = viewName;
      if (fullViewName.indexOf('/') === -1) {
        fullViewName = viewName + '/' + viewName;
      }
      var depDbs = doc.views[fullViewName] = doc.views[fullViewName] || {};
      /* istanbul ignore if */
      if (depDbs[depDbName]) {
        return; // no update necessary
      }
      depDbs[depDbName] = true;
      return doc;
    }
    return upsert(sourceDB, '_local/' + localDocName, diffFunction).then(function () {
      return sourceDB.registerDependentDatabase(depDbName).then(function (res) {
        var db = res.db;
        db.auto_compaction = true;
        var view = {
          name: depDbName,
          db: db,
          sourceDB: sourceDB,
          adapter: sourceDB.adapter,
          mapFun: mapFun,
          reduceFun: reduceFun
        };
        return view.db.get('_local/lastSeq').catch(function (err) {
          /* istanbul ignore if */
          if (err.status !== 404) {
            throw err;
          }
        }).then(function (lastSeqDoc) {
          view.seq = lastSeqDoc ? lastSeqDoc.seq : 0;
          if (cachedViews) {
            view.db.once('destroyed', function () {
              delete cachedViews[viewSignature];
            });
          }
          return view;
        });
      });
    });
  });

  if (cachedViews) {
    cachedViews[viewSignature] = promiseForView;
  }
  return promiseForView;
}

var persistentQueues = {};
var tempViewQueue = new TaskQueue$1();
var CHANGES_BATCH_SIZE$1 = 50;

function parseViewName(name) {
  // can be either 'ddocname/viewname' or just 'viewname'
  // (where the ddoc name is the same)
  return name.indexOf('/') === -1 ? [name, name] : name.split('/');
}

function isGenOne(changes) {
  // only return true if the current change is 1-
  // and there are no other leafs
  return changes.length === 1 && /^1-/.test(changes[0].rev);
}

function emitError(db, e) {
  try {
    db.emit('error', e);
  } catch (err) {
    guardedConsole('error',
      'The user\'s map/reduce function threw an uncaught error.\n' +
      'You can debug this error by doing:\n' +
      'myDatabase.on(\'error\', function (err) { debugger; });\n' +
      'Please double-check your map/reduce function.');
    guardedConsole('error', e);
  }
}

/**
 * Returns an "abstract" mapreduce object of the form:
 *
 *   {
 *     query: queryFun,
 *     viewCleanup: viewCleanupFun
 *   }
 *
 * Arguments are:
 *
 * localDoc: string
 *   This is for the local doc that gets saved in order to track the
 *   "dependent" DBs and clean them up for viewCleanup. It should be
 *   unique, so that indexer plugins don't collide with each other.
 * mapper: function (mapFunDef, emit)
 *   Returns a map function based on the mapFunDef, which in the case of
 *   normal map/reduce is just the de-stringified function, but may be
 *   something else, such as an object in the case of pouchdb-find.
 * reducer: function (reduceFunDef)
 *   Ditto, but for reducing. Modules don't have to support reducing
 *   (e.g. pouchdb-find).
 * ddocValidator: function (ddoc, viewName)
 *   Throws an error if the ddoc or viewName is not valid.
 *   This could be a way to communicate to the user that the configuration for the
 *   indexer is invalid.
 */
function createAbstractMapReduce(localDocName, mapper, reducer, ddocValidator) {

  function tryMap(db, fun, doc) {
    // emit an event if there was an error thrown by a map function.
    // putting try/catches in a single function also avoids deoptimizations.
    try {
      fun(doc);
    } catch (e) {
      emitError(db, e);
    }
  }

  function tryReduce(db, fun, keys, values, rereduce) {
    // same as above, but returning the result or an error. there are two separate
    // functions to avoid extra memory allocations since the tryCode() case is used
    // for custom map functions (common) vs this function, which is only used for
    // custom reduce functions (rare)
    try {
      return {output : fun(keys, values, rereduce)};
    } catch (e) {
      emitError(db, e);
      return {error: e};
    }
  }

  function sortByKeyThenValue(x, y) {
    var keyCompare = collate(x.key, y.key);
    return keyCompare !== 0 ? keyCompare : collate(x.value, y.value);
  }

  function sliceResults(results, limit, skip) {
    skip = skip || 0;
    if (typeof limit === 'number') {
      return results.slice(skip, limit + skip);
    } else if (skip > 0) {
      return results.slice(skip);
    }
    return results;
  }

  function rowToDocId(row) {
    var val = row.value;
    // Users can explicitly specify a joined doc _id, or it
    // defaults to the doc _id that emitted the key/value.
    var docId = (val && typeof val === 'object' && val._id) || row.id;
    return docId;
  }

  function readAttachmentsAsBlobOrBuffer(res) {
    res.rows.forEach(function (row) {
      var atts = row.doc && row.doc._attachments;
      if (!atts) {
        return;
      }
      Object.keys(atts).forEach(function (filename) {
        var att = atts[filename];
        atts[filename].data = b64ToBluffer(att.data, att.content_type);
      });
    });
  }

  function postprocessAttachments(opts) {
    return function (res) {
      if (opts.include_docs && opts.attachments && opts.binary) {
        readAttachmentsAsBlobOrBuffer(res);
      }
      return res;
    };
  }

  function addHttpParam(paramName, opts, params, asJson) {
    // add an http param from opts to params, optionally json-encoded
    var val = opts[paramName];
    if (typeof val !== 'undefined') {
      if (asJson) {
        val = encodeURIComponent(JSON.stringify(val));
      }
      params.push(paramName + '=' + val);
    }
  }

  function coerceInteger(integerCandidate) {
    if (typeof integerCandidate !== 'undefined') {
      var asNumber = Number(integerCandidate);
      // prevents e.g. '1foo' or '1.1' being coerced to 1
      if (!isNaN(asNumber) && asNumber === parseInt(integerCandidate, 10)) {
        return asNumber;
      } else {
        return integerCandidate;
      }
    }
  }

  function coerceOptions(opts) {
    opts.group_level = coerceInteger(opts.group_level);
    opts.limit = coerceInteger(opts.limit);
    opts.skip = coerceInteger(opts.skip);
    return opts;
  }

  function checkPositiveInteger(number) {
    if (number) {
      if (typeof number !== 'number') {
        return  new QueryParseError('Invalid value for integer: "' +
          number + '"');
      }
      if (number < 0) {
        return new QueryParseError('Invalid value for positive integer: ' +
          '"' + number + '"');
      }
    }
  }

  function checkQueryParseError(options, fun) {
    var startkeyName = options.descending ? 'endkey' : 'startkey';
    var endkeyName = options.descending ? 'startkey' : 'endkey';

    if (typeof options[startkeyName] !== 'undefined' &&
      typeof options[endkeyName] !== 'undefined' &&
      collate(options[startkeyName], options[endkeyName]) > 0) {
      throw new QueryParseError('No rows can match your key range, ' +
        'reverse your start_key and end_key or set {descending : true}');
    } else if (fun.reduce && options.reduce !== false) {
      if (options.include_docs) {
        throw new QueryParseError('{include_docs:true} is invalid for reduce');
      } else if (options.keys && options.keys.length > 1 &&
        !options.group && !options.group_level) {
        throw new QueryParseError('Multi-key fetches for reduce views must use ' +
          '{group: true}');
      }
    }
    ['group_level', 'limit', 'skip'].forEach(function (optionName) {
      var error = checkPositiveInteger(options[optionName]);
      if (error) {
        throw error;
      }
    });
  }

  function httpQuery(db, fun, opts) {
    // List of parameters to add to the PUT request
    var params = [];
    var body;
    var method = 'GET';
    var ok, status;

    // If opts.reduce exists and is defined, then add it to the list
    // of parameters.
    // If reduce=false then the results are that of only the map function
    // not the final result of map and reduce.
    addHttpParam('reduce', opts, params);
    addHttpParam('include_docs', opts, params);
    addHttpParam('attachments', opts, params);
    addHttpParam('limit', opts, params);
    addHttpParam('descending', opts, params);
    addHttpParam('group', opts, params);
    addHttpParam('group_level', opts, params);
    addHttpParam('skip', opts, params);
    addHttpParam('stale', opts, params);
    addHttpParam('conflicts', opts, params);
    addHttpParam('startkey', opts, params, true);
    addHttpParam('start_key', opts, params, true);
    addHttpParam('endkey', opts, params, true);
    addHttpParam('end_key', opts, params, true);
    addHttpParam('inclusive_end', opts, params);
    addHttpParam('key', opts, params, true);
    addHttpParam('update_seq', opts, params);

    // Format the list of parameters into a valid URI query string
    params = params.join('&');
    params = params === '' ? '' : '?' + params;

    // If keys are supplied, issue a POST to circumvent GET query string limits
    // see http://wiki.apache.org/couchdb/HTTP_view_API#Querying_Options
    if (typeof opts.keys !== 'undefined') {
      var MAX_URL_LENGTH = 2000;
      // according to http://stackoverflow.com/a/417184/680742,
      // the de facto URL length limit is 2000 characters

      var keysAsString =
        'keys=' + encodeURIComponent(JSON.stringify(opts.keys));
      if (keysAsString.length + params.length + 1 <= MAX_URL_LENGTH) {
        // If the keys are short enough, do a GET. we do this to work around
        // Safari not understanding 304s on POSTs (see pouchdb/pouchdb#1239)
        params += (params[0] === '?' ? '&' : '?') + keysAsString;
      } else {
        method = 'POST';
        if (typeof fun === 'string') {
          body = {keys: opts.keys};
        } else { // fun is {map : mapfun}, so append to this
          fun.keys = opts.keys;
        }
      }
    }

    // We are referencing a query defined in the design doc
    if (typeof fun === 'string') {
      var parts = parseViewName(fun);
      return db.fetch('_design/' + parts[0] + '/_view/' + parts[1] + params, {
        headers: new h({'Content-Type': 'application/json'}),
        method: method,
        body: JSON.stringify(body)
      }).then(function (response) {
        ok = response.ok;
        status = response.status;
        return response.json();
      }).then(function (result) {
        if (!ok) {
          result.status = status;
          throw generateErrorFromResponse(result);
        }
        // fail the entire request if the result contains an error
        result.rows.forEach(function (row) {
          /* istanbul ignore if */
          if (row.value && row.value.error && row.value.error === "builtin_reduce_error") {
            throw new Error(row.reason);
          }
        });
        return result;
      }).then(postprocessAttachments(opts));
    }

    // We are using a temporary view, terrible for performance, good for testing
    body = body || {};
    Object.keys(fun).forEach(function (key) {
      if (Array.isArray(fun[key])) {
        body[key] = fun[key];
      } else {
        body[key] = fun[key].toString();
      }
    });

    return db.fetch('_temp_view' + params, {
      headers: new h({'Content-Type': 'application/json'}),
      method: 'POST',
      body: JSON.stringify(body)
    }).then(function (response) {
        ok = response.ok;
        status = response.status;
      return response.json();
    }).then(function (result) {
      if (!ok) {
        result.status = status;
        throw generateErrorFromResponse(result);
      }
      return result;
    }).then(postprocessAttachments(opts));
  }

  // custom adapters can define their own api._query
  // and override the default behavior
  /* istanbul ignore next */
  function customQuery(db, fun, opts) {
    return new Promise(function (resolve, reject) {
      db._query(fun, opts, function (err, res) {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  }

  // custom adapters can define their own api._viewCleanup
  // and override the default behavior
  /* istanbul ignore next */
  function customViewCleanup(db) {
    return new Promise(function (resolve, reject) {
      db._viewCleanup(function (err, res) {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  }

  function defaultsTo(value) {
    return function (reason) {
      /* istanbul ignore else */
      if (reason.status === 404) {
        return value;
      } else {
        throw reason;
      }
    };
  }

  // returns a promise for a list of docs to update, based on the input docId.
  // the order doesn't matter, because post-3.2.0, bulkDocs
  // is an atomic operation in all three adapters.
  function getDocsToPersist(docId, view, docIdsToChangesAndEmits) {
    var metaDocId = '_local/doc_' + docId;
    var defaultMetaDoc = {_id: metaDocId, keys: []};
    var docData = docIdsToChangesAndEmits.get(docId);
    var indexableKeysToKeyValues = docData[0];
    var changes = docData[1];

    function getMetaDoc() {
      if (isGenOne(changes)) {
        // generation 1, so we can safely assume initial state
        // for performance reasons (avoids unnecessary GETs)
        return Promise.resolve(defaultMetaDoc);
      }
      return view.db.get(metaDocId).catch(defaultsTo(defaultMetaDoc));
    }

    function getKeyValueDocs(metaDoc) {
      if (!metaDoc.keys.length) {
        // no keys, no need for a lookup
        return Promise.resolve({rows: []});
      }
      return view.db.allDocs({
        keys: metaDoc.keys,
        include_docs: true
      });
    }

    function processKeyValueDocs(metaDoc, kvDocsRes) {
      var kvDocs = [];
      var oldKeys = new ExportedSet();

      for (var i = 0, len = kvDocsRes.rows.length; i < len; i++) {
        var row = kvDocsRes.rows[i];
        var doc = row.doc;
        if (!doc) { // deleted
          continue;
        }
        kvDocs.push(doc);
        oldKeys.add(doc._id);
        doc._deleted = !indexableKeysToKeyValues.has(doc._id);
        if (!doc._deleted) {
          var keyValue = indexableKeysToKeyValues.get(doc._id);
          if ('value' in keyValue) {
            doc.value = keyValue.value;
          }
        }
      }
      var newKeys = mapToKeysArray(indexableKeysToKeyValues);
      newKeys.forEach(function (key) {
        if (!oldKeys.has(key)) {
          // new doc
          var kvDoc = {
            _id: key
          };
          var keyValue = indexableKeysToKeyValues.get(key);
          if ('value' in keyValue) {
            kvDoc.value = keyValue.value;
          }
          kvDocs.push(kvDoc);
        }
      });
      metaDoc.keys = uniq(newKeys.concat(metaDoc.keys));
      kvDocs.push(metaDoc);

      return kvDocs;
    }

    return getMetaDoc().then(function (metaDoc) {
      return getKeyValueDocs(metaDoc).then(function (kvDocsRes) {
        return processKeyValueDocs(metaDoc, kvDocsRes);
      });
    });
  }

  // updates all emitted key/value docs and metaDocs in the mrview database
  // for the given batch of documents from the source database
  function saveKeyValues(view, docIdsToChangesAndEmits, seq) {
    var seqDocId = '_local/lastSeq';
    return view.db.get(seqDocId)
      .catch(defaultsTo({_id: seqDocId, seq: 0}))
      .then(function (lastSeqDoc) {
        var docIds = mapToKeysArray(docIdsToChangesAndEmits);
        return Promise.all(docIds.map(function (docId) {
          return getDocsToPersist(docId, view, docIdsToChangesAndEmits);
        })).then(function (listOfDocsToPersist) {
          var docsToPersist = flatten(listOfDocsToPersist);
          lastSeqDoc.seq = seq;
          docsToPersist.push(lastSeqDoc);
          // write all docs in a single operation, update the seq once
          return view.db.bulkDocs({docs : docsToPersist});
        });
      });
  }

  function getQueue(view) {
    var viewName = typeof view === 'string' ? view : view.name;
    var queue = persistentQueues[viewName];
    if (!queue) {
      queue = persistentQueues[viewName] = new TaskQueue$1();
    }
    return queue;
  }

  function updateView(view) {
    return sequentialize(getQueue(view), function () {
      return updateViewInQueue(view);
    })();
  }

  function updateViewInQueue(view) {
    // bind the emit function once
    var mapResults;
    var doc;

    function emit(key, value) {
      var output = {id: doc._id, key: normalizeKey(key)};
      // Don't explicitly store the value unless it's defined and non-null.
      // This saves on storage space, because often people don't use it.
      if (typeof value !== 'undefined' && value !== null) {
        output.value = normalizeKey(value);
      }
      mapResults.push(output);
    }

    var mapFun = mapper(view.mapFun, emit);

    var currentSeq = view.seq || 0;

    function processChange(docIdsToChangesAndEmits, seq) {
      return function () {
        return saveKeyValues(view, docIdsToChangesAndEmits, seq);
      };
    }

    var queue = new TaskQueue$1();

    function processNextBatch() {
      return view.sourceDB.changes({
        return_docs: true,
        conflicts: true,
        include_docs: true,
        style: 'all_docs',
        since: currentSeq,
        limit: CHANGES_BATCH_SIZE$1
      }).then(processBatch);
    }

    function processBatch(response) {
      var results = response.results;
      if (!results.length) {
        return;
      }
      var docIdsToChangesAndEmits = createDocIdsToChangesAndEmits(results);
      queue.add(processChange(docIdsToChangesAndEmits, currentSeq));
      if (results.length < CHANGES_BATCH_SIZE$1) {
        return;
      }
      return processNextBatch();
    }

    function createDocIdsToChangesAndEmits(results) {
      var docIdsToChangesAndEmits = new ExportedMap();
      for (var i = 0, len = results.length; i < len; i++) {
        var change = results[i];
        if (change.doc._id[0] !== '_') {
          mapResults = [];
          doc = change.doc;

          if (!doc._deleted) {
            tryMap(view.sourceDB, mapFun, doc);
          }
          mapResults.sort(sortByKeyThenValue);

          var indexableKeysToKeyValues = createIndexableKeysToKeyValues(mapResults);
          docIdsToChangesAndEmits.set(change.doc._id, [
            indexableKeysToKeyValues,
            change.changes
          ]);
        }
        currentSeq = change.seq;
      }
      return docIdsToChangesAndEmits;
    }

    function createIndexableKeysToKeyValues(mapResults) {
      var indexableKeysToKeyValues = new ExportedMap();
      var lastKey;
      for (var i = 0, len = mapResults.length; i < len; i++) {
        var emittedKeyValue = mapResults[i];
        var complexKey = [emittedKeyValue.key, emittedKeyValue.id];
        if (i > 0 && collate(emittedKeyValue.key, lastKey) === 0) {
          complexKey.push(i); // dup key+id, so make it unique
        }
        indexableKeysToKeyValues.set(toIndexableString(complexKey), emittedKeyValue);
        lastKey = emittedKeyValue.key;
      }
      return indexableKeysToKeyValues;
    }

    return processNextBatch().then(function () {
      return queue.finish();
    }).then(function () {
      view.seq = currentSeq;
    });
  }

  function reduceView(view, results, options) {
    if (options.group_level === 0) {
      delete options.group_level;
    }

    var shouldGroup = options.group || options.group_level;

    var reduceFun = reducer(view.reduceFun);

    var groups = [];
    var lvl = isNaN(options.group_level) ? Number.POSITIVE_INFINITY :
      options.group_level;
    results.forEach(function (e) {
      var last = groups[groups.length - 1];
      var groupKey = shouldGroup ? e.key : null;

      // only set group_level for array keys
      if (shouldGroup && Array.isArray(groupKey)) {
        groupKey = groupKey.slice(0, lvl);
      }

      if (last && collate(last.groupKey, groupKey) === 0) {
        last.keys.push([e.key, e.id]);
        last.values.push(e.value);
        return;
      }
      groups.push({
        keys: [[e.key, e.id]],
        values: [e.value],
        groupKey: groupKey
      });
    });
    results = [];
    for (var i = 0, len = groups.length; i < len; i++) {
      var e = groups[i];
      var reduceTry = tryReduce(view.sourceDB, reduceFun, e.keys, e.values, false);
      if (reduceTry.error && reduceTry.error instanceof BuiltInError) {
        // CouchDB returns an error if a built-in errors out
        throw reduceTry.error;
      }
      results.push({
        // CouchDB just sets the value to null if a non-built-in errors out
        value: reduceTry.error ? null : reduceTry.output,
        key: e.groupKey
      });
    }
    // no total_rows/offset when reducing
    return {rows: sliceResults(results, options.limit, options.skip)};
  }

  function queryView(view, opts) {
    return sequentialize(getQueue(view), function () {
      return queryViewInQueue(view, opts);
    })();
  }

  function queryViewInQueue(view, opts) {
    var totalRows;
    var shouldReduce = view.reduceFun && opts.reduce !== false;
    var skip = opts.skip || 0;
    if (typeof opts.keys !== 'undefined' && !opts.keys.length) {
      // equivalent query
      opts.limit = 0;
      delete opts.keys;
    }

    function fetchFromView(viewOpts) {
      viewOpts.include_docs = true;
      return view.db.allDocs(viewOpts).then(function (res) {
        totalRows = res.total_rows;
        return res.rows.map(function (result) {

          // implicit migration - in older versions of PouchDB,
          // we explicitly stored the doc as {id: ..., key: ..., value: ...}
          // this is tested in a migration test
          /* istanbul ignore next */
          if ('value' in result.doc && typeof result.doc.value === 'object' &&
            result.doc.value !== null) {
            var keys = Object.keys(result.doc.value).sort();
            // this detection method is not perfect, but it's unlikely the user
            // emitted a value which was an object with these 3 exact keys
            var expectedKeys = ['id', 'key', 'value'];
            if (!(keys < expectedKeys || keys > expectedKeys)) {
              return result.doc.value;
            }
          }

          var parsedKeyAndDocId = parseIndexableString(result.doc._id);
          return {
            key: parsedKeyAndDocId[0],
            id: parsedKeyAndDocId[1],
            value: ('value' in result.doc ? result.doc.value : null)
          };
        });
      });
    }

    function onMapResultsReady(rows) {
      var finalResults;
      if (shouldReduce) {
        finalResults = reduceView(view, rows, opts);
      } else {
        finalResults = {
          total_rows: totalRows,
          offset: skip,
          rows: rows
        };
      }
      /* istanbul ignore if */
      if (opts.update_seq) {
        finalResults.update_seq = view.seq;
      }
      if (opts.include_docs) {
        var docIds = uniq(rows.map(rowToDocId));

        return view.sourceDB.allDocs({
          keys: docIds,
          include_docs: true,
          conflicts: opts.conflicts,
          attachments: opts.attachments,
          binary: opts.binary
        }).then(function (allDocsRes) {
          var docIdsToDocs = new ExportedMap();
          allDocsRes.rows.forEach(function (row) {
            docIdsToDocs.set(row.id, row.doc);
          });
          rows.forEach(function (row) {
            var docId = rowToDocId(row);
            var doc = docIdsToDocs.get(docId);
            if (doc) {
              row.doc = doc;
            }
          });
          return finalResults;
        });
      } else {
        return finalResults;
      }
    }

    if (typeof opts.keys !== 'undefined') {
      var keys = opts.keys;
      var fetchPromises = keys.map(function (key) {
        var viewOpts = {
          startkey : toIndexableString([key]),
          endkey   : toIndexableString([key, {}])
        };
        /* istanbul ignore if */
        if (opts.update_seq) {
          viewOpts.update_seq = true;
        }
        return fetchFromView(viewOpts);
      });
      return Promise.all(fetchPromises).then(flatten).then(onMapResultsReady);
    } else { // normal query, no 'keys'
      var viewOpts = {
        descending : opts.descending
      };
      /* istanbul ignore if */
      if (opts.update_seq) {
        viewOpts.update_seq = true;
      }
      var startkey;
      var endkey;
      if ('start_key' in opts) {
        startkey = opts.start_key;
      }
      if ('startkey' in opts) {
        startkey = opts.startkey;
      }
      if ('end_key' in opts) {
        endkey = opts.end_key;
      }
      if ('endkey' in opts) {
        endkey = opts.endkey;
      }
      if (typeof startkey !== 'undefined') {
        viewOpts.startkey = opts.descending ?
          toIndexableString([startkey, {}]) :
          toIndexableString([startkey]);
      }
      if (typeof endkey !== 'undefined') {
        var inclusiveEnd = opts.inclusive_end !== false;
        if (opts.descending) {
          inclusiveEnd = !inclusiveEnd;
        }

        viewOpts.endkey = toIndexableString(
          inclusiveEnd ? [endkey, {}] : [endkey]);
      }
      if (typeof opts.key !== 'undefined') {
        var keyStart = toIndexableString([opts.key]);
        var keyEnd = toIndexableString([opts.key, {}]);
        if (viewOpts.descending) {
          viewOpts.endkey = keyStart;
          viewOpts.startkey = keyEnd;
        } else {
          viewOpts.startkey = keyStart;
          viewOpts.endkey = keyEnd;
        }
      }
      if (!shouldReduce) {
        if (typeof opts.limit === 'number') {
          viewOpts.limit = opts.limit;
        }
        viewOpts.skip = skip;
      }
      return fetchFromView(viewOpts).then(onMapResultsReady);
    }
  }

  function httpViewCleanup(db) {
    return db.fetch('_view_cleanup', {
      headers: new h({'Content-Type': 'application/json'}),
      method: 'POST'
    }).then(function (response) {
      return response.json();
    });
  }

  function localViewCleanup(db) {
    return db.get('_local/' + localDocName).then(function (metaDoc) {
      var docsToViews = new ExportedMap();
      Object.keys(metaDoc.views).forEach(function (fullViewName) {
        var parts = parseViewName(fullViewName);
        var designDocName = '_design/' + parts[0];
        var viewName = parts[1];
        var views = docsToViews.get(designDocName);
        if (!views) {
          views = new ExportedSet();
          docsToViews.set(designDocName, views);
        }
        views.add(viewName);
      });
      var opts = {
        keys : mapToKeysArray(docsToViews),
        include_docs : true
      };
      return db.allDocs(opts).then(function (res) {
        var viewsToStatus = {};
        res.rows.forEach(function (row) {
          var ddocName = row.key.substring(8); // cuts off '_design/'
          docsToViews.get(row.key).forEach(function (viewName) {
            var fullViewName = ddocName + '/' + viewName;
            /* istanbul ignore if */
            if (!metaDoc.views[fullViewName]) {
              // new format, without slashes, to support PouchDB 2.2.0
              // migration test in pouchdb's browser.migration.js verifies this
              fullViewName = viewName;
            }
            var viewDBNames = Object.keys(metaDoc.views[fullViewName]);
            // design doc deleted, or view function nonexistent
            var statusIsGood = row.doc && row.doc.views &&
              row.doc.views[viewName];
            viewDBNames.forEach(function (viewDBName) {
              viewsToStatus[viewDBName] =
                viewsToStatus[viewDBName] || statusIsGood;
            });
          });
        });
        var dbsToDelete = Object.keys(viewsToStatus).filter(
          function (viewDBName) { return !viewsToStatus[viewDBName]; });
        var destroyPromises = dbsToDelete.map(function (viewDBName) {
          return sequentialize(getQueue(viewDBName), function () {
            return new db.constructor(viewDBName, db.__opts).destroy();
          })();
        });
        return Promise.all(destroyPromises).then(function () {
          return {ok: true};
        });
      });
    }, defaultsTo({ok: true}));
  }

  function queryPromised(db, fun, opts) {
    /* istanbul ignore next */
    if (typeof db._query === 'function') {
      return customQuery(db, fun, opts);
    }
    if (isRemote(db)) {
      return httpQuery(db, fun, opts);
    }

    if (typeof fun !== 'string') {
      // temp_view
      checkQueryParseError(opts, fun);

      tempViewQueue.add(function () {
        var createViewPromise = createView(
          /* sourceDB */ db,
          /* viewName */ 'temp_view/temp_view',
          /* mapFun */ fun.map,
          /* reduceFun */ fun.reduce,
          /* temporary */ true,
          /* localDocName */ localDocName);
        return createViewPromise.then(function (view) {
          return fin(updateView(view).then(function () {
            return queryView(view, opts);
          }), function () {
            return view.db.destroy();
          });
        });
      });
      return tempViewQueue.finish();
    } else {
      // persistent view
      var fullViewName = fun;
      var parts = parseViewName(fullViewName);
      var designDocName = parts[0];
      var viewName = parts[1];
      return db.get('_design/' + designDocName).then(function (doc) {
        var fun = doc.views && doc.views[viewName];

        if (!fun) {
          // basic validator; it's assumed that every subclass would want this
          throw new NotFoundError('ddoc ' + doc._id + ' has no view named ' +
            viewName);
        }

        ddocValidator(doc, viewName);
        checkQueryParseError(opts, fun);

        var createViewPromise = createView(
          /* sourceDB */ db,
          /* viewName */ fullViewName,
          /* mapFun */ fun.map,
          /* reduceFun */ fun.reduce,
          /* temporary */ false,
          /* localDocName */ localDocName);
        return createViewPromise.then(function (view) {
          if (opts.stale === 'ok' || opts.stale === 'update_after') {
            if (opts.stale === 'update_after') {
              nextTick(function () {
                updateView(view);
              });
            }
            return queryView(view, opts);
          } else { // stale not ok
            return updateView(view).then(function () {
              return queryView(view, opts);
            });
          }
        });
      });
    }
  }

  function abstractQuery(fun, opts, callback) {
    var db = this;
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    opts = opts ? coerceOptions(opts) : {};

    if (typeof fun === 'function') {
      fun = {map : fun};
    }

    var promise = Promise.resolve().then(function () {
      return queryPromised(db, fun, opts);
    });
    promisedCallback(promise, callback);
    return promise;
  }

  var abstractViewCleanup = callbackify(function () {
    var db = this;
    /* istanbul ignore next */
    if (typeof db._viewCleanup === 'function') {
      return customViewCleanup(db);
    }
    if (isRemote(db)) {
      return httpViewCleanup(db);
    }
    return localViewCleanup(db);
  });

  return {
    query: abstractQuery,
    viewCleanup: abstractViewCleanup
  };
}

var builtInReduce = {
  _sum: function (keys, values) {
    return sum(values);
  },

  _count: function (keys, values) {
    return values.length;
  },

  _stats: function (keys, values) {
    // no need to implement rereduce=true, because Pouch
    // will never call it
    function sumsqr(values) {
      var _sumsqr = 0;
      for (var i = 0, len = values.length; i < len; i++) {
        var num = values[i];
        _sumsqr += (num * num);
      }
      return _sumsqr;
    }
    return {
      sum     : sum(values),
      min     : Math.min.apply(null, values),
      max     : Math.max.apply(null, values),
      count   : values.length,
      sumsqr : sumsqr(values)
    };
  }
};

function getBuiltIn(reduceFunString) {
  if (/^_sum/.test(reduceFunString)) {
    return builtInReduce._sum;
  } else if (/^_count/.test(reduceFunString)) {
    return builtInReduce._count;
  } else if (/^_stats/.test(reduceFunString)) {
    return builtInReduce._stats;
  } else if (/^_/.test(reduceFunString)) {
    throw new Error(reduceFunString + ' is not a supported reduce function.');
  }
}

function mapper(mapFun, emit) {
  // for temp_views one can use emit(doc, emit), see #38
  if (typeof mapFun === "function" && mapFun.length === 2) {
    var origMap = mapFun;
    return function (doc) {
      return origMap(doc, emit);
    };
  } else {
    return evalFunctionWithEval(mapFun.toString(), emit);
  }
}

function reducer(reduceFun) {
  var reduceFunString = reduceFun.toString();
  var builtIn = getBuiltIn(reduceFunString);
  if (builtIn) {
    return builtIn;
  } else {
    return evalFunctionWithEval(reduceFunString);
  }
}

function ddocValidator(ddoc, viewName) {
  var fun = ddoc.views && ddoc.views[viewName];
  if (typeof fun.map !== 'string') {
    throw new NotFoundError('ddoc ' + ddoc._id + ' has no string view named ' +
      viewName + ', instead found object of type: ' + typeof fun.map);
  }
}

var localDocName = 'mrviews';
var abstract = createAbstractMapReduce(localDocName, mapper, reducer, ddocValidator);

function query(fun, opts, callback) {
  return abstract.query.call(this, fun, opts, callback);
}

function viewCleanup(callback) {
  return abstract.viewCleanup.call(this, callback);
}

var mapreduce = {
  query: query,
  viewCleanup: viewCleanup
};

function isGenOne$1(rev) {
  return /^1-/.test(rev);
}

function fileHasChanged(localDoc, remoteDoc, filename) {
  return !localDoc._attachments ||
         !localDoc._attachments[filename] ||
         localDoc._attachments[filename].digest !== remoteDoc._attachments[filename].digest;
}

function getDocAttachments(db, doc) {
  var filenames = Object.keys(doc._attachments);
  return Promise.all(filenames.map(function (filename) {
    return db.getAttachment(doc._id, filename, {rev: doc._rev});
  }));
}

function getDocAttachmentsFromTargetOrSource(target, src, doc) {
  var doCheckForLocalAttachments = isRemote(src) && !isRemote(target);
  var filenames = Object.keys(doc._attachments);

  if (!doCheckForLocalAttachments) {
    return getDocAttachments(src, doc);
  }

  return target.get(doc._id).then(function (localDoc) {
    return Promise.all(filenames.map(function (filename) {
      if (fileHasChanged(localDoc, doc, filename)) {
        return src.getAttachment(doc._id, filename);
      }

      return target.getAttachment(localDoc._id, filename);
    }));
  }).catch(function (error) {
    /* istanbul ignore if */
    if (error.status !== 404) {
      throw error;
    }

    return getDocAttachments(src, doc);
  });
}

function createBulkGetOpts(diffs) {
  var requests = [];
  Object.keys(diffs).forEach(function (id) {
    var missingRevs = diffs[id].missing;
    missingRevs.forEach(function (missingRev) {
      requests.push({
        id: id,
        rev: missingRev
      });
    });
  });

  return {
    docs: requests,
    revs: true,
    latest: true
  };
}

//
// Fetch all the documents from the src as described in the "diffs",
// which is a mapping of docs IDs to revisions. If the state ever
// changes to "cancelled", then the returned promise will be rejected.
// Else it will be resolved with a list of fetched documents.
//
function getDocs(src, target, diffs, state) {
  diffs = clone(diffs); // we do not need to modify this

  var resultDocs = [],
      ok = true;

  function getAllDocs() {

    var bulkGetOpts = createBulkGetOpts(diffs);

    if (!bulkGetOpts.docs.length) { // optimization: skip empty requests
      return;
    }

    return src.bulkGet(bulkGetOpts).then(function (bulkGetResponse) {
      /* istanbul ignore if */
      if (state.cancelled) {
        throw new Error('cancelled');
      }
      return Promise.all(bulkGetResponse.results.map(function (bulkGetInfo) {
        return Promise.all(bulkGetInfo.docs.map(function (doc) {
          var remoteDoc = doc.ok;

          if (doc.error) {
            // when AUTO_COMPACTION is set, docs can be returned which look
            // like this: {"missing":"1-7c3ac256b693c462af8442f992b83696"}
            ok = false;
          }

          if (!remoteDoc || !remoteDoc._attachments) {
            return remoteDoc;
          }

          return getDocAttachmentsFromTargetOrSource(target, src, remoteDoc)
                   .then(function (attachments) {
                           var filenames = Object.keys(remoteDoc._attachments);
                           attachments
                             .forEach(function (attachment, i) {
                                        var att = remoteDoc._attachments[filenames[i]];
                                        delete att.stub;
                                        delete att.length;
                                        att.data = attachment;
                                      });

                                      return remoteDoc;
                                    });
        }));
      }))

      .then(function (results) {
        resultDocs = resultDocs.concat(flatten(results).filter(Boolean));
      });
    });
  }

  function hasAttachments(doc) {
    return doc._attachments && Object.keys(doc._attachments).length > 0;
  }

  function hasConflicts(doc) {
    return doc._conflicts && doc._conflicts.length > 0;
  }

  function fetchRevisionOneDocs(ids) {
    // Optimization: fetch gen-1 docs and attachments in
    // a single request using _all_docs
    return src.allDocs({
      keys: ids,
      include_docs: true,
      conflicts: true
    }).then(function (res) {
      if (state.cancelled) {
        throw new Error('cancelled');
      }
      res.rows.forEach(function (row) {
        if (row.deleted || !row.doc || !isGenOne$1(row.value.rev) ||
            hasAttachments(row.doc) || hasConflicts(row.doc)) {
          // if any of these conditions apply, we need to fetch using get()
          return;
        }

        // strip _conflicts array to appease CSG (#5793)
        /* istanbul ignore if */
        if (row.doc._conflicts) {
          delete row.doc._conflicts;
        }

        // the doc we got back from allDocs() is sufficient
        resultDocs.push(row.doc);
        delete diffs[row.id];
      });
    });
  }

  function getRevisionOneDocs() {
    // filter out the generation 1 docs and get them
    // leaving the non-generation one docs to be got otherwise
    var ids = Object.keys(diffs).filter(function (id) {
      var missing = diffs[id].missing;
      return missing.length === 1 && isGenOne$1(missing[0]);
    });
    if (ids.length > 0) {
      return fetchRevisionOneDocs(ids);
    }
  }

  function returnResult() {
    return { ok:ok, docs:resultDocs };
  }

  return Promise.resolve()
    .then(getRevisionOneDocs)
    .then(getAllDocs)
    .then(returnResult);
}

var CHECKPOINT_VERSION = 1;
var REPLICATOR = "pouchdb";
// This is an arbitrary number to limit the
// amount of replication history we save in the checkpoint.
// If we save too much, the checkpoing docs will become very big,
// if we save fewer, we'll run a greater risk of having to
// read all the changes from 0 when checkpoint PUTs fail
// CouchDB 2.0 has a more involved history pruning,
// but let's go for the simple version for now.
var CHECKPOINT_HISTORY_SIZE = 5;
var LOWEST_SEQ = 0;

function updateCheckpoint(db, id, checkpoint, session, returnValue) {
  return db.get(id).catch(function (err) {
    if (err.status === 404) {
      if (db.adapter === 'http' || db.adapter === 'https') {
        explainError(
          404, 'PouchDB is just checking if a remote checkpoint exists.'
        );
      }
      return {
        session_id: session,
        _id: id,
        history: [],
        replicator: REPLICATOR,
        version: CHECKPOINT_VERSION
      };
    }
    throw err;
  }).then(function (doc) {
    if (returnValue.cancelled) {
      return;
    }

    // if the checkpoint has not changed, do not update
    if (doc.last_seq === checkpoint) {
      return;
    }

    // Filter out current entry for this replication
    doc.history = (doc.history || []).filter(function (item) {
      return item.session_id !== session;
    });

    // Add the latest checkpoint to history
    doc.history.unshift({
      last_seq: checkpoint,
      session_id: session
    });

    // Just take the last pieces in history, to
    // avoid really big checkpoint docs.
    // see comment on history size above
    doc.history = doc.history.slice(0, CHECKPOINT_HISTORY_SIZE);

    doc.version = CHECKPOINT_VERSION;
    doc.replicator = REPLICATOR;

    doc.session_id = session;
    doc.last_seq = checkpoint;

    return db.put(doc).catch(function (err) {
      if (err.status === 409) {
        // retry; someone is trying to write a checkpoint simultaneously
        return updateCheckpoint(db, id, checkpoint, session, returnValue);
      }
      throw err;
    });
  });
}

function Checkpointer(src, target, id, returnValue, opts) {
  this.src = src;
  this.target = target;
  this.id = id;
  this.returnValue = returnValue;
  this.opts = opts || {};
}

Checkpointer.prototype.writeCheckpoint = function (checkpoint, session) {
  var self = this;
  return this.updateTarget(checkpoint, session).then(function () {
    return self.updateSource(checkpoint, session);
  });
};

Checkpointer.prototype.updateTarget = function (checkpoint, session) {
  if (this.opts.writeTargetCheckpoint) {
    return updateCheckpoint(this.target, this.id, checkpoint,
      session, this.returnValue);
  } else {
    return Promise.resolve(true);
  }
};

Checkpointer.prototype.updateSource = function (checkpoint, session) {
  if (this.opts.writeSourceCheckpoint) {
    var self = this;
    return updateCheckpoint(this.src, this.id, checkpoint,
      session, this.returnValue)
      .catch(function (err) {
        if (isForbiddenError(err)) {
          self.opts.writeSourceCheckpoint = false;
          return true;
        }
        throw err;
      });
  } else {
    return Promise.resolve(true);
  }
};

var comparisons = {
  "undefined": function (targetDoc, sourceDoc) {
    // This is the previous comparison function
    if (collate(targetDoc.last_seq, sourceDoc.last_seq) === 0) {
      return sourceDoc.last_seq;
    }
    /* istanbul ignore next */
    return 0;
  },
  "1": function (targetDoc, sourceDoc) {
    // This is the comparison function ported from CouchDB
    return compareReplicationLogs(sourceDoc, targetDoc).last_seq;
  }
};

Checkpointer.prototype.getCheckpoint = function () {
  var self = this;

  if (self.opts && self.opts.writeSourceCheckpoint && !self.opts.writeTargetCheckpoint) {
    return self.src.get(self.id).then(function (sourceDoc) {
      return sourceDoc.last_seq || LOWEST_SEQ;
    }).catch(function (err) {
      /* istanbul ignore if */
      if (err.status !== 404) {
        throw err;
      }
      return LOWEST_SEQ;
    });
  }

  return self.target.get(self.id).then(function (targetDoc) {
    if (self.opts && self.opts.writeTargetCheckpoint && !self.opts.writeSourceCheckpoint) {
      return targetDoc.last_seq || LOWEST_SEQ;
    }

    return self.src.get(self.id).then(function (sourceDoc) {
      // Since we can't migrate an old version doc to a new one
      // (no session id), we just go with the lowest seq in this case
      /* istanbul ignore if */
      if (targetDoc.version !== sourceDoc.version) {
        return LOWEST_SEQ;
      }

      var version;
      if (targetDoc.version) {
        version = targetDoc.version.toString();
      } else {
        version = "undefined";
      }

      if (version in comparisons) {
        return comparisons[version](targetDoc, sourceDoc);
      }
      /* istanbul ignore next */
      return LOWEST_SEQ;
    }, function (err) {
      if (err.status === 404 && targetDoc.last_seq) {
        return self.src.put({
          _id: self.id,
          last_seq: LOWEST_SEQ
        }).then(function () {
          return LOWEST_SEQ;
        }, function (err) {
          if (isForbiddenError(err)) {
            self.opts.writeSourceCheckpoint = false;
            return targetDoc.last_seq;
          }
          /* istanbul ignore next */
          return LOWEST_SEQ;
        });
      }
      throw err;
    });
  }).catch(function (err) {
    if (err.status !== 404) {
      throw err;
    }
    return LOWEST_SEQ;
  });
};
// This checkpoint comparison is ported from CouchDBs source
// they come from here:
// https://github.com/apache/couchdb-couch-replicator/blob/master/src/couch_replicator.erl#L863-L906

function compareReplicationLogs(srcDoc, tgtDoc) {
  if (srcDoc.session_id === tgtDoc.session_id) {
    return {
      last_seq: srcDoc.last_seq,
      history: srcDoc.history
    };
  }

  return compareReplicationHistory(srcDoc.history, tgtDoc.history);
}

function compareReplicationHistory(sourceHistory, targetHistory) {
  // the erlang loop via function arguments is not so easy to repeat in JS
  // therefore, doing this as recursion
  var S = sourceHistory[0];
  var sourceRest = sourceHistory.slice(1);
  var T = targetHistory[0];
  var targetRest = targetHistory.slice(1);

  if (!S || targetHistory.length === 0) {
    return {
      last_seq: LOWEST_SEQ,
      history: []
    };
  }

  var sourceId = S.session_id;
  /* istanbul ignore if */
  if (hasSessionId(sourceId, targetHistory)) {
    return {
      last_seq: S.last_seq,
      history: sourceHistory
    };
  }

  var targetId = T.session_id;
  if (hasSessionId(targetId, sourceRest)) {
    return {
      last_seq: T.last_seq,
      history: targetRest
    };
  }

  return compareReplicationHistory(sourceRest, targetRest);
}

function hasSessionId(sessionId, history) {
  var props = history[0];
  var rest = history.slice(1);

  if (!sessionId || history.length === 0) {
    return false;
  }

  if (sessionId === props.session_id) {
    return true;
  }

  return hasSessionId(sessionId, rest);
}

function isForbiddenError(err) {
  return typeof err.status === 'number' && Math.floor(err.status / 100) === 4;
}

var STARTING_BACK_OFF = 0;

function backOff(opts, returnValue, error, callback) {
  if (opts.retry === false) {
    returnValue.emit('error', error);
    returnValue.removeAllListeners();
    return;
  }
  /* istanbul ignore if */
  if (typeof opts.back_off_function !== 'function') {
    opts.back_off_function = defaultBackOff;
  }
  returnValue.emit('requestError', error);
  if (returnValue.state === 'active' || returnValue.state === 'pending') {
    returnValue.emit('paused', error);
    returnValue.state = 'stopped';
    var backOffSet = function backoffTimeSet() {
      opts.current_back_off = STARTING_BACK_OFF;
    };
    var removeBackOffSetter = function removeBackOffTimeSet() {
      returnValue.removeListener('active', backOffSet);
    };
    returnValue.once('paused', removeBackOffSetter);
    returnValue.once('active', backOffSet);
  }

  opts.current_back_off = opts.current_back_off || STARTING_BACK_OFF;
  opts.current_back_off = opts.back_off_function(opts.current_back_off);
  setTimeout(callback, opts.current_back_off);
}

function sortObjectPropertiesByKey(queryParams) {
  return Object.keys(queryParams).sort(collate).reduce(function (result, key) {
    result[key] = queryParams[key];
    return result;
  }, {});
}

// Generate a unique id particular to this replication.
// Not guaranteed to align perfectly with CouchDB's rep ids.
function generateReplicationId(src, target, opts) {
  var docIds = opts.doc_ids ? opts.doc_ids.sort(collate) : '';
  var filterFun = opts.filter ? opts.filter.toString() : '';
  var queryParams = '';
  var filterViewName =  '';
  var selector = '';

  // possibility for checkpoints to be lost here as behaviour of
  // JSON.stringify is not stable (see #6226)
  /* istanbul ignore if */
  if (opts.selector) {
    selector = JSON.stringify(opts.selector);
  }

  if (opts.filter && opts.query_params) {
    queryParams = JSON.stringify(sortObjectPropertiesByKey(opts.query_params));
  }

  if (opts.filter && opts.filter === '_view') {
    filterViewName = opts.view.toString();
  }

  return Promise.all([src.id(), target.id()]).then(function (res) {
    var queryData = res[0] + res[1] + filterFun + filterViewName +
      queryParams + docIds + selector;
    return new Promise(function (resolve) {
      binaryMd5(queryData, resolve);
    });
  }).then(function (md5sum) {
    // can't use straight-up md5 alphabet, because
    // the char '/' is interpreted as being for attachments,
    // and + is also not url-safe
    md5sum = md5sum.replace(/\//g, '.').replace(/\+/g, '_');
    return '_local/' + md5sum;
  });
}

function replicate(src, target, opts, returnValue, result) {
  var batches = [];               // list of batches to be processed
  var currentBatch;               // the batch currently being processed
  var pendingBatch = {
    seq: 0,
    changes: [],
    docs: []
  }; // next batch, not yet ready to be processed
  var writingCheckpoint = false;  // true while checkpoint is being written
  var changesCompleted = false;   // true when all changes received
  var replicationCompleted = false; // true when replication has completed
  var last_seq = 0;
  var continuous = opts.continuous || opts.live || false;
  var batch_size = opts.batch_size || 100;
  var batches_limit = opts.batches_limit || 10;
  var changesPending = false;     // true while src.changes is running
  var doc_ids = opts.doc_ids;
  var selector = opts.selector;
  var repId;
  var checkpointer;
  var changedDocs = [];
  // Like couchdb, every replication gets a unique session id
  var session = uuid();

  result = result || {
    ok: true,
    start_time: new Date().toISOString(),
    docs_read: 0,
    docs_written: 0,
    doc_write_failures: 0,
    errors: []
  };

  var changesOpts = {};
  returnValue.ready(src, target);

  function initCheckpointer() {
    if (checkpointer) {
      return Promise.resolve();
    }
    return generateReplicationId(src, target, opts).then(function (res) {
      repId = res;

      var checkpointOpts = {};
      if (opts.checkpoint === false) {
        checkpointOpts = { writeSourceCheckpoint: false, writeTargetCheckpoint: false };
      } else if (opts.checkpoint === 'source') {
        checkpointOpts = { writeSourceCheckpoint: true, writeTargetCheckpoint: false };
      } else if (opts.checkpoint === 'target') {
        checkpointOpts = { writeSourceCheckpoint: false, writeTargetCheckpoint: true };
      } else {
        checkpointOpts = { writeSourceCheckpoint: true, writeTargetCheckpoint: true };
      }

      checkpointer = new Checkpointer(src, target, repId, returnValue, checkpointOpts);
    });
  }

  function writeDocs() {
    changedDocs = [];

    if (currentBatch.docs.length === 0) {
      return;
    }
    var docs = currentBatch.docs;
    var bulkOpts = {timeout: opts.timeout};
    return target.bulkDocs({docs: docs, new_edits: false}, bulkOpts).then(function (res) {
      /* istanbul ignore if */
      if (returnValue.cancelled) {
        completeReplication();
        throw new Error('cancelled');
      }

      // `res` doesn't include full documents (which live in `docs`), so we create a map of 
      // (id -> error), and check for errors while iterating over `docs`
      var errorsById = Object.create(null);
      res.forEach(function (res) {
        if (res.error) {
          errorsById[res.id] = res;
        }
      });

      var errorsNo = Object.keys(errorsById).length;
      result.doc_write_failures += errorsNo;
      result.docs_written += docs.length - errorsNo;

      docs.forEach(function (doc) {
        var error = errorsById[doc._id];
        if (error) {
          result.errors.push(error);
          // Normalize error name. i.e. 'Unauthorized' -> 'unauthorized' (eg Sync Gateway)
          var errorName = (error.name || '').toLowerCase();
          if (errorName === 'unauthorized' || errorName === 'forbidden') {
            returnValue.emit('denied', clone(error));
          } else {
            throw error;
          }
        } else {
          changedDocs.push(doc);
        }
      });

    }, function (err) {
      result.doc_write_failures += docs.length;
      throw err;
    });
  }

  function finishBatch() {
    if (currentBatch.error) {
      throw new Error('There was a problem getting docs.');
    }
    result.last_seq = last_seq = currentBatch.seq;
    var outResult = clone(result);
    if (changedDocs.length) {
      outResult.docs = changedDocs;
      // Attach 'pending' property if server supports it (CouchDB 2.0+)
      /* istanbul ignore if */
      if (typeof currentBatch.pending === 'number') {
        outResult.pending = currentBatch.pending;
        delete currentBatch.pending;
      }
      returnValue.emit('change', outResult);
    }
    writingCheckpoint = true;
    return checkpointer.writeCheckpoint(currentBatch.seq,
        session).then(function () {
      writingCheckpoint = false;
      /* istanbul ignore if */
      if (returnValue.cancelled) {
        completeReplication();
        throw new Error('cancelled');
      }
      currentBatch = undefined;
      getChanges();
    }).catch(function (err) {
      onCheckpointError(err);
      throw err;
    });
  }

  function getDiffs() {
    var diff = {};
    currentBatch.changes.forEach(function (change) {
      // Couchbase Sync Gateway emits these, but we can ignore them
      /* istanbul ignore if */
      if (change.id === "_user/") {
        return;
      }
      diff[change.id] = change.changes.map(function (x) {
        return x.rev;
      });
    });
    return target.revsDiff(diff).then(function (diffs) {
      /* istanbul ignore if */
      if (returnValue.cancelled) {
        completeReplication();
        throw new Error('cancelled');
      }
      // currentBatch.diffs elements are deleted as the documents are written
      currentBatch.diffs = diffs;
    });
  }

  function getBatchDocs() {
    return getDocs(src, target, currentBatch.diffs, returnValue).then(function (got) {
      currentBatch.error = !got.ok;
      got.docs.forEach(function (doc) {
        delete currentBatch.diffs[doc._id];
        result.docs_read++;
        currentBatch.docs.push(doc);
      });
    });
  }

  function startNextBatch() {
    if (returnValue.cancelled || currentBatch) {
      return;
    }
    if (batches.length === 0) {
      processPendingBatch(true);
      return;
    }
    currentBatch = batches.shift();
    getDiffs()
      .then(getBatchDocs)
      .then(writeDocs)
      .then(finishBatch)
      .then(startNextBatch)
      .catch(function (err) {
        abortReplication('batch processing terminated with error', err);
      });
  }


  function processPendingBatch(immediate) {
    if (pendingBatch.changes.length === 0) {
      if (batches.length === 0 && !currentBatch) {
        if ((continuous && changesOpts.live) || changesCompleted) {
          returnValue.state = 'pending';
          returnValue.emit('paused');
        }
        if (changesCompleted) {
          completeReplication();
        }
      }
      return;
    }
    if (
      immediate ||
      changesCompleted ||
      pendingBatch.changes.length >= batch_size
    ) {
      batches.push(pendingBatch);
      pendingBatch = {
        seq: 0,
        changes: [],
        docs: []
      };
      if (returnValue.state === 'pending' || returnValue.state === 'stopped') {
        returnValue.state = 'active';
        returnValue.emit('active');
      }
      startNextBatch();
    }
  }


  function abortReplication(reason, err) {
    if (replicationCompleted) {
      return;
    }
    if (!err.message) {
      err.message = reason;
    }
    result.ok = false;
    result.status = 'aborting';
    batches = [];
    pendingBatch = {
      seq: 0,
      changes: [],
      docs: []
    };
    completeReplication(err);
  }


  function completeReplication(fatalError) {
    if (replicationCompleted) {
      return;
    }
    /* istanbul ignore if */
    if (returnValue.cancelled) {
      result.status = 'cancelled';
      if (writingCheckpoint) {
        return;
      }
    }
    result.status = result.status || 'complete';
    result.end_time = new Date().toISOString();
    result.last_seq = last_seq;
    replicationCompleted = true;

    if (fatalError) {
      // need to extend the error because Firefox considers ".result" read-only
      fatalError = createError(fatalError);
      fatalError.result = result;

      // Normalize error name. i.e. 'Unauthorized' -> 'unauthorized' (eg Sync Gateway)
      var errorName = (fatalError.name || '').toLowerCase();
      if (errorName === 'unauthorized' || errorName === 'forbidden') {
        returnValue.emit('error', fatalError);
        returnValue.removeAllListeners();
      } else {
        backOff(opts, returnValue, fatalError, function () {
          replicate(src, target, opts, returnValue);
        });
      }
    } else {
      returnValue.emit('complete', result);
      returnValue.removeAllListeners();
    }
  }


  function onChange(change, pending, lastSeq) {
    /* istanbul ignore if */
    if (returnValue.cancelled) {
      return completeReplication();
    }
    // Attach 'pending' property if server supports it (CouchDB 2.0+)
    /* istanbul ignore if */
    if (typeof pending === 'number') {
      pendingBatch.pending = pending;
    }

    var filter = filterChange(opts)(change);
    if (!filter) {
      return;
    }
    pendingBatch.seq = change.seq || lastSeq;
    pendingBatch.changes.push(change);
    nextTick(function () {
      processPendingBatch(batches.length === 0 && changesOpts.live);
    });
  }


  function onChangesComplete(changes) {
    changesPending = false;
    /* istanbul ignore if */
    if (returnValue.cancelled) {
      return completeReplication();
    }

    // if no results were returned then we're done,
    // else fetch more
    if (changes.results.length > 0) {
      changesOpts.since = changes.results[changes.results.length - 1].seq;
      getChanges();
      processPendingBatch(true);
    } else {

      var complete = function () {
        if (continuous) {
          changesOpts.live = true;
          getChanges();
        } else {
          changesCompleted = true;
        }
        processPendingBatch(true);
      };

      // update the checkpoint so we start from the right seq next time
      if (!currentBatch && changes.results.length === 0) {
        writingCheckpoint = true;
        checkpointer.writeCheckpoint(changes.last_seq,
            session).then(function () {
          writingCheckpoint = false;
          result.last_seq = last_seq = changes.last_seq;
          complete();
        })
        .catch(onCheckpointError);
      } else {
        complete();
      }
    }
  }


  function onChangesError(err) {
    changesPending = false;
    /* istanbul ignore if */
    if (returnValue.cancelled) {
      return completeReplication();
    }
    abortReplication('changes rejected', err);
  }


  function getChanges() {
    if (!(
      !changesPending &&
      !changesCompleted &&
      batches.length < batches_limit
      )) {
      return;
    }
    changesPending = true;
    function abortChanges() {
      changes.cancel();
    }
    function removeListener() {
      returnValue.removeListener('cancel', abortChanges);
    }

    if (returnValue._changes) { // remove old changes() and listeners
      returnValue.removeListener('cancel', returnValue._abortChanges);
      returnValue._changes.cancel();
    }
    returnValue.once('cancel', abortChanges);

    var changes = src.changes(changesOpts)
      .on('change', onChange);
    changes.then(removeListener, removeListener);
    changes.then(onChangesComplete)
      .catch(onChangesError);

    if (opts.retry) {
      // save for later so we can cancel if necessary
      returnValue._changes = changes;
      returnValue._abortChanges = abortChanges;
    }
  }


  function startChanges() {
    initCheckpointer().then(function () {
      /* istanbul ignore if */
      if (returnValue.cancelled) {
        completeReplication();
        return;
      }
      return checkpointer.getCheckpoint().then(function (checkpoint) {
        last_seq = checkpoint;
        changesOpts = {
          since: last_seq,
          limit: batch_size,
          batch_size: batch_size,
          style: 'all_docs',
          doc_ids: doc_ids,
          selector: selector,
          return_docs: true // required so we know when we're done
        };
        if (opts.filter) {
          if (typeof opts.filter !== 'string') {
            // required for the client-side filter in onChange
            changesOpts.include_docs = true;
          } else { // ddoc filter
            changesOpts.filter = opts.filter;
          }
        }
        if ('heartbeat' in opts) {
          changesOpts.heartbeat = opts.heartbeat;
        }
        if ('timeout' in opts) {
          changesOpts.timeout = opts.timeout;
        }
        if (opts.query_params) {
          changesOpts.query_params = opts.query_params;
        }
        if (opts.view) {
          changesOpts.view = opts.view;
        }
        getChanges();
      });
    }).catch(function (err) {
      abortReplication('getCheckpoint rejected with ', err);
    });
  }

  /* istanbul ignore next */
  function onCheckpointError(err) {
    writingCheckpoint = false;
    abortReplication('writeCheckpoint completed with error', err);
  }

  /* istanbul ignore if */
  if (returnValue.cancelled) { // cancelled immediately
    completeReplication();
    return;
  }

  if (!returnValue._addedListeners) {
    returnValue.once('cancel', completeReplication);

    if (typeof opts.complete === 'function') {
      returnValue.once('error', opts.complete);
      returnValue.once('complete', function (result) {
        opts.complete(null, result);
      });
    }
    returnValue._addedListeners = true;
  }

  if (typeof opts.since === 'undefined') {
    startChanges();
  } else {
    initCheckpointer().then(function () {
      writingCheckpoint = true;
      return checkpointer.writeCheckpoint(opts.since, session);
    }).then(function () {
      writingCheckpoint = false;
      /* istanbul ignore if */
      if (returnValue.cancelled) {
        completeReplication();
        return;
      }
      last_seq = opts.since;
      startChanges();
    }).catch(onCheckpointError);
  }
}

// We create a basic promise so the caller can cancel the replication possibly
// before we have actually started listening to changes etc
inherits(Replication, events.EventEmitter);
function Replication() {
  events.EventEmitter.call(this);
  this.cancelled = false;
  this.state = 'pending';
  var self = this;
  var promise = new Promise(function (fulfill, reject) {
    self.once('complete', fulfill);
    self.once('error', reject);
  });
  self.then = function (resolve, reject) {
    return promise.then(resolve, reject);
  };
  self.catch = function (reject) {
    return promise.catch(reject);
  };
  // As we allow error handling via "error" event as well,
  // put a stub in here so that rejecting never throws UnhandledError.
  self.catch(function () {});
}

Replication.prototype.cancel = function () {
  this.cancelled = true;
  this.state = 'cancelled';
  this.emit('cancel');
};

Replication.prototype.ready = function (src, target) {
  var self = this;
  if (self._readyCalled) {
    return;
  }
  self._readyCalled = true;

  function onDestroy() {
    self.cancel();
  }
  src.once('destroyed', onDestroy);
  target.once('destroyed', onDestroy);
  function cleanup() {
    src.removeListener('destroyed', onDestroy);
    target.removeListener('destroyed', onDestroy);
  }
  self.once('complete', cleanup);
};

function toPouch(db, opts) {
  var PouchConstructor = opts.PouchConstructor;
  if (typeof db === 'string') {
    return new PouchConstructor(db, opts);
  } else {
    return db;
  }
}

function replicateWrapper(src, target, opts, callback) {

  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  if (typeof opts === 'undefined') {
    opts = {};
  }

  if (opts.doc_ids && !Array.isArray(opts.doc_ids)) {
    throw createError(BAD_REQUEST,
                       "`doc_ids` filter parameter is not a list.");
  }

  opts.complete = callback;
  opts = clone(opts);
  opts.continuous = opts.continuous || opts.live;
  opts.retry = ('retry' in opts) ? opts.retry : false;
  /*jshint validthis:true */
  opts.PouchConstructor = opts.PouchConstructor || this;
  var replicateRet = new Replication(opts);
  var srcPouch = toPouch(src, opts);
  var targetPouch = toPouch(target, opts);
  replicate(srcPouch, targetPouch, opts, replicateRet);
  return replicateRet;
}

inherits(Sync, events.EventEmitter);
function sync(src, target, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  if (typeof opts === 'undefined') {
    opts = {};
  }
  opts = clone(opts);
  /*jshint validthis:true */
  opts.PouchConstructor = opts.PouchConstructor || this;
  src = toPouch(src, opts);
  target = toPouch(target, opts);
  return new Sync(src, target, opts, callback);
}

function Sync(src, target, opts, callback) {
  var self = this;
  this.canceled = false;

  var optsPush = opts.push ? $inject_Object_assign({}, opts, opts.push) : opts;
  var optsPull = opts.pull ? $inject_Object_assign({}, opts, opts.pull) : opts;

  this.push = replicateWrapper(src, target, optsPush);
  this.pull = replicateWrapper(target, src, optsPull);

  this.pushPaused = true;
  this.pullPaused = true;

  function pullChange(change) {
    self.emit('change', {
      direction: 'pull',
      change: change
    });
  }
  function pushChange(change) {
    self.emit('change', {
      direction: 'push',
      change: change
    });
  }
  function pushDenied(doc) {
    self.emit('denied', {
      direction: 'push',
      doc: doc
    });
  }
  function pullDenied(doc) {
    self.emit('denied', {
      direction: 'pull',
      doc: doc
    });
  }
  function pushPaused() {
    self.pushPaused = true;
    /* istanbul ignore if */
    if (self.pullPaused) {
      self.emit('paused');
    }
  }
  function pullPaused() {
    self.pullPaused = true;
    /* istanbul ignore if */
    if (self.pushPaused) {
      self.emit('paused');
    }
  }
  function pushActive() {
    self.pushPaused = false;
    /* istanbul ignore if */
    if (self.pullPaused) {
      self.emit('active', {
        direction: 'push'
      });
    }
  }
  function pullActive() {
    self.pullPaused = false;
    /* istanbul ignore if */
    if (self.pushPaused) {
      self.emit('active', {
        direction: 'pull'
      });
    }
  }

  var removed = {};

  function removeAll(type) { // type is 'push' or 'pull'
    return function (event, func) {
      var isChange = event === 'change' &&
        (func === pullChange || func === pushChange);
      var isDenied = event === 'denied' &&
        (func === pullDenied || func === pushDenied);
      var isPaused = event === 'paused' &&
        (func === pullPaused || func === pushPaused);
      var isActive = event === 'active' &&
        (func === pullActive || func === pushActive);

      if (isChange || isDenied || isPaused || isActive) {
        if (!(event in removed)) {
          removed[event] = {};
        }
        removed[event][type] = true;
        if (Object.keys(removed[event]).length === 2) {
          // both push and pull have asked to be removed
          self.removeAllListeners(event);
        }
      }
    };
  }

  if (opts.live) {
    this.push.on('complete', self.pull.cancel.bind(self.pull));
    this.pull.on('complete', self.push.cancel.bind(self.push));
  }

  function addOneListener(ee, event, listener) {
    if (ee.listeners(event).indexOf(listener) == -1) {
      ee.on(event, listener);
    }
  }

  this.on('newListener', function (event) {
    if (event === 'change') {
      addOneListener(self.pull, 'change', pullChange);
      addOneListener(self.push, 'change', pushChange);
    } else if (event === 'denied') {
      addOneListener(self.pull, 'denied', pullDenied);
      addOneListener(self.push, 'denied', pushDenied);
    } else if (event === 'active') {
      addOneListener(self.pull, 'active', pullActive);
      addOneListener(self.push, 'active', pushActive);
    } else if (event === 'paused') {
      addOneListener(self.pull, 'paused', pullPaused);
      addOneListener(self.push, 'paused', pushPaused);
    }
  });

  this.on('removeListener', function (event) {
    if (event === 'change') {
      self.pull.removeListener('change', pullChange);
      self.push.removeListener('change', pushChange);
    } else if (event === 'denied') {
      self.pull.removeListener('denied', pullDenied);
      self.push.removeListener('denied', pushDenied);
    } else if (event === 'active') {
      self.pull.removeListener('active', pullActive);
      self.push.removeListener('active', pushActive);
    } else if (event === 'paused') {
      self.pull.removeListener('paused', pullPaused);
      self.push.removeListener('paused', pushPaused);
    }
  });

  this.pull.on('removeListener', removeAll('pull'));
  this.push.on('removeListener', removeAll('push'));

  var promise = Promise.all([
    this.push,
    this.pull
  ]).then(function (resp) {
    var out = {
      push: resp[0],
      pull: resp[1]
    };
    self.emit('complete', out);
    if (callback) {
      callback(null, out);
    }
    self.removeAllListeners();
    return out;
  }, function (err) {
    self.cancel();
    if (callback) {
      // if there's a callback, then the callback can receive
      // the error event
      callback(err);
    } else {
      // if there's no callback, then we're safe to emit an error
      // event, which would otherwise throw an unhandled error
      // due to 'error' being a special event in EventEmitters
      self.emit('error', err);
    }
    self.removeAllListeners();
    if (callback) {
      // no sense throwing if we're already emitting an 'error' event
      throw err;
    }
  });

  this.then = function (success, err) {
    return promise.then(success, err);
  };

  this.catch = function (err) {
    return promise.catch(err);
  };
}

Sync.prototype.cancel = function () {
  if (!this.canceled) {
    this.canceled = true;
    this.push.cancel();
    this.pull.cancel();
  }
};

function replication(PouchDB) {
  PouchDB.replicate = replicateWrapper;
  PouchDB.sync = sync;

  Object.defineProperty(PouchDB.prototype, 'replicate', {
    get: function () {
      var self = this;
      if (typeof this.replicateMethods === 'undefined') {
        this.replicateMethods = {
          from: function (other, opts, callback) {
            return self.constructor.replicate(other, self, opts, callback);
          },
          to: function (other, opts, callback) {
            return self.constructor.replicate(self, other, opts, callback);
          }
        };
      }
      return this.replicateMethods;
    }
  });

  PouchDB.prototype.sync = function (dbName, opts, callback) {
    return this.constructor.sync(this, dbName, opts, callback);
  };
}

PouchDB.plugin(IDBPouch)
  .plugin(HttpPouch$1)
  .plugin(mapreduce)
  .plugin(replication);

module.exports = PouchDB;

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":6,"argsarray":1,"events":2,"immediate":3,"inherits":5,"spark-md5":7,"uuid":8,"vuvuzela":13}],5:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],6:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],7:[function(require,module,exports){
(function (factory) {
    if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else {
        // Browser globals (with support for web workers)
        var glob;

        try {
            glob = window;
        } catch (e) {
            glob = self;
        }

        glob.SparkMD5 = factory();
    }
}(function (undefined) {

    'use strict';

    /*
     * Fastest md5 implementation around (JKM md5).
     * Credits: Joseph Myers
     *
     * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
     * @see http://jsperf.com/md5-shootout/7
     */

    /* this function is much faster,
      so if possible we use it. Some IEs
      are the only ones I know of that
      need the idiotic second function,
      generated by an if clause.  */
    var add32 = function (a, b) {
        return (a + b) & 0xFFFFFFFF;
    },
        hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];


    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }

    function md5cycle(x, k) {
        var a = x[0],
            b = x[1],
            c = x[2],
            d = x[3];

        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;

        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;

        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;

        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b  = (b << 21 |b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b  = (b << 21 |b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b  = (b << 21 |b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b  = (b << 21 | b >>> 11) + c | 0;

        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
    }

    function md5blk(s) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }

    function md5blk_array(a) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
        }
        return md5blks;
    }

    function md51(s) {
        var n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        length = s.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        }
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);
        return state;
    }

    function md51_array(a) {
        var n = a.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
        }

        // Not sure if it is a bug, however IE10 will always produce a sub array of length 1
        // containing the last element of the parent array if the sub array specified starts
        // beyond the length of the parent array - weird.
        // https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue
        a = (i - 64) < n ? a.subarray(i - 64) : new Uint8Array(0);

        length = a.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= a[i] << ((i % 4) << 3);
        }

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);

        return state;
    }

    function rhex(n) {
        var s = '',
            j;
        for (j = 0; j < 4; j += 1) {
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
        }
        return s;
    }

    function hex(x) {
        var i;
        for (i = 0; i < x.length; i += 1) {
            x[i] = rhex(x[i]);
        }
        return x.join('');
    }

    // In some cases the fast add32 function cannot be used..
    if (hex(md51('hello')) !== '5d41402abc4b2a76b9719d911017c592') {
        add32 = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };
    }

    // ---------------------------------------------------

    /**
     * ArrayBuffer slice polyfill.
     *
     * @see https://github.com/ttaubert/node-arraybuffer-slice
     */

    if (typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.prototype.slice) {
        (function () {
            function clamp(val, length) {
                val = (val | 0) || 0;

                if (val < 0) {
                    return Math.max(val + length, 0);
                }

                return Math.min(val, length);
            }

            ArrayBuffer.prototype.slice = function (from, to) {
                var length = this.byteLength,
                    begin = clamp(from, length),
                    end = length,
                    num,
                    target,
                    targetArray,
                    sourceArray;

                if (to !== undefined) {
                    end = clamp(to, length);
                }

                if (begin > end) {
                    return new ArrayBuffer(0);
                }

                num = end - begin;
                target = new ArrayBuffer(num);
                targetArray = new Uint8Array(target);

                sourceArray = new Uint8Array(this, begin, num);
                targetArray.set(sourceArray);

                return target;
            };
        })();
    }

    // ---------------------------------------------------

    /**
     * Helpers.
     */

    function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
            str = unescape(encodeURIComponent(str));
        }

        return str;
    }

    function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length,
           buff = new ArrayBuffer(length),
           arr = new Uint8Array(buff),
           i;

        for (i = 0; i < length; i += 1) {
            arr[i] = str.charCodeAt(i);
        }

        return returnUInt8Array ? arr : buff;
    }

    function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
    }

    function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);

        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);

        return returnUInt8Array ? result : result.buffer;
    }

    function hexToBinaryString(hex) {
        var bytes = [],
            length = hex.length,
            x;

        for (x = 0; x < length - 1; x += 2) {
            bytes.push(parseInt(hex.substr(x, 2), 16));
        }

        return String.fromCharCode.apply(String, bytes);
    }

    // ---------------------------------------------------

    /**
     * SparkMD5 OOP implementation.
     *
     * Use this class to perform an incremental md5, otherwise use the
     * static methods instead.
     */

    function SparkMD5() {
        // call reset to init the instance
        this.reset();
    }

    /**
     * Appends a string.
     * A conversion will be applied if an utf8 string is detected.
     *
     * @param {String} str The string to be appended
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.append = function (str) {
        // Converts the string to utf8 bytes if necessary
        // Then append as binary
        this.appendBinary(toUtf8(str));

        return this;
    };

    /**
     * Appends a binary string.
     *
     * @param {String} contents The binary string to be appended
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.appendBinary = function (contents) {
        this._buff += contents;
        this._length += contents.length;

        var length = this._buff.length,
            i;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
        }

        this._buff = this._buff.substring(i - 64);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.prototype.end = function (raw) {
        var buff = this._buff,
            length = buff.length,
            i,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff.charCodeAt(i) << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = hex(this._hash);

        if (raw) {
            ret = hexToBinaryString(ret);
        }

        this.reset();

        return ret;
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.reset = function () {
        this._buff = '';
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */
    SparkMD5.prototype.getState = function () {
        return {
            buff: this._buff,
            length: this._length,
            hash: this._hash
        };
    };

    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.setState = function (state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;

        return this;
    };

    /**
     * Releases memory used by the incremental buffer and other additional
     * resources. If you plan to use the instance again, use reset instead.
     */
    SparkMD5.prototype.destroy = function () {
        delete this._hash;
        delete this._buff;
        delete this._length;
    };

    /**
     * Finish the final calculation based on the tail.
     *
     * @param {Array}  tail   The tail (will be modified)
     * @param {Number} length The length of the remaining buffer
     */
    SparkMD5.prototype._finish = function (tail, length) {
        var i = length,
            tmp,
            lo,
            hi;

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(this._hash, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._hash, tail);
    };

    /**
     * Performs the md5 hash on a string.
     * A conversion will be applied if utf8 string is detected.
     *
     * @param {String}  str The string
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.hash = function (str, raw) {
        // Converts the string to utf8 bytes if necessary
        // Then compute it using the binary function
        return SparkMD5.hashBinary(toUtf8(str), raw);
    };

    /**
     * Performs the md5 hash on a binary string.
     *
     * @param {String}  content The binary string
     * @param {Boolean} raw     True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.hashBinary = function (content, raw) {
        var hash = md51(content),
            ret = hex(hash);

        return raw ? hexToBinaryString(ret) : ret;
    };

    // ---------------------------------------------------

    /**
     * SparkMD5 OOP implementation for array buffers.
     *
     * Use this class to perform an incremental md5 ONLY for array buffers.
     */
    SparkMD5.ArrayBuffer = function () {
        // call reset to init the instance
        this.reset();
    };

    /**
     * Appends an array buffer.
     *
     * @param {ArrayBuffer} arr The array to be appended
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.append = function (arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true),
            length = buff.length,
            i;

        this._length += arr.byteLength;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
        }

        this._buff = (i - 64) < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.ArrayBuffer.prototype.end = function (raw) {
        var buff = this._buff,
            length = buff.length,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            i,
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff[i] << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = hex(this._hash);

        if (raw) {
            ret = hexToBinaryString(ret);
        }

        this.reset();

        return ret;
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.reset = function () {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */
    SparkMD5.ArrayBuffer.prototype.getState = function () {
        var state = SparkMD5.prototype.getState.call(this);

        // Convert buffer to a string
        state.buff = arrayBuffer2Utf8Str(state.buff);

        return state;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.setState = function (state) {
        // Convert string to buffer
        state.buff = utf8Str2ArrayBuffer(state.buff, true);

        return SparkMD5.prototype.setState.call(this, state);
    };

    SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;

    SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;

    /**
     * Performs the md5 hash on an array buffer.
     *
     * @param {ArrayBuffer} arr The array buffer
     * @param {Boolean}     raw True to get the raw string, false to get the hex one
     *
     * @return {String} The result
     */
    SparkMD5.ArrayBuffer.hash = function (arr, raw) {
        var hash = md51_array(new Uint8Array(arr)),
            ret = hex(hash);

        return raw ? hexToBinaryString(ret) : ret;
    };

    return SparkMD5;
}));

},{}],8:[function(require,module,exports){
var v1 = require('./v1');
var v4 = require('./v4');

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;

},{"./v1":11,"./v4":12}],9:[function(require,module,exports){
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;

},{}],10:[function(require,module,exports){
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && msCrypto.getRandomValues.bind(msCrypto));
if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

},{}],11:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;

},{"./lib/bytesToUuid":9,"./lib/rng":10}],12:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},{"./lib/bytesToUuid":9,"./lib/rng":10}],13:[function(require,module,exports){
'use strict';

/**
 * Stringify/parse functions that don't operate
 * recursively, so they avoid call stack exceeded
 * errors.
 */
exports.stringify = function stringify(input) {
  var queue = [];
  queue.push({obj: input});

  var res = '';
  var next, obj, prefix, val, i, arrayPrefix, keys, k, key, value, objPrefix;
  while ((next = queue.pop())) {
    obj = next.obj;
    prefix = next.prefix || '';
    val = next.val || '';
    res += prefix;
    if (val) {
      res += val;
    } else if (typeof obj !== 'object') {
      res += typeof obj === 'undefined' ? null : JSON.stringify(obj);
    } else if (obj === null) {
      res += 'null';
    } else if (Array.isArray(obj)) {
      queue.push({val: ']'});
      for (i = obj.length - 1; i >= 0; i--) {
        arrayPrefix = i === 0 ? '' : ',';
        queue.push({obj: obj[i], prefix: arrayPrefix});
      }
      queue.push({val: '['});
    } else { // object
      keys = [];
      for (k in obj) {
        if (obj.hasOwnProperty(k)) {
          keys.push(k);
        }
      }
      queue.push({val: '}'});
      for (i = keys.length - 1; i >= 0; i--) {
        key = keys[i];
        value = obj[key];
        objPrefix = (i > 0 ? ',' : '');
        objPrefix += JSON.stringify(key) + ':';
        queue.push({obj: value, prefix: objPrefix});
      }
      queue.push({val: '{'});
    }
  }
  return res;
};

// Convenience function for the parse function.
// This pop function is basically copied from
// pouchCollate.parseIndexableString
function pop(obj, stack, metaStack) {
  var lastMetaElement = metaStack[metaStack.length - 1];
  if (obj === lastMetaElement.element) {
    // popping a meta-element, e.g. an object whose value is another object
    metaStack.pop();
    lastMetaElement = metaStack[metaStack.length - 1];
  }
  var element = lastMetaElement.element;
  var lastElementIndex = lastMetaElement.index;
  if (Array.isArray(element)) {
    element.push(obj);
  } else if (lastElementIndex === stack.length - 2) { // obj with key+value
    var key = stack.pop();
    element[key] = obj;
  } else {
    stack.push(obj); // obj with key only
  }
}

exports.parse = function (str) {
  var stack = [];
  var metaStack = []; // stack for arrays and objects
  var i = 0;
  var collationIndex,parsedNum,numChar;
  var parsedString,lastCh,numConsecutiveSlashes,ch;
  var arrayElement, objElement;
  while (true) {
    collationIndex = str[i++];
    if (collationIndex === '}' ||
        collationIndex === ']' ||
        typeof collationIndex === 'undefined') {
      if (stack.length === 1) {
        return stack.pop();
      } else {
        pop(stack.pop(), stack, metaStack);
        continue;
      }
    }
    switch (collationIndex) {
      case ' ':
      case '\t':
      case '\n':
      case ':':
      case ',':
        break;
      case 'n':
        i += 3; // 'ull'
        pop(null, stack, metaStack);
        break;
      case 't':
        i += 3; // 'rue'
        pop(true, stack, metaStack);
        break;
      case 'f':
        i += 4; // 'alse'
        pop(false, stack, metaStack);
        break;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '-':
        parsedNum = '';
        i--;
        while (true) {
          numChar = str[i++];
          if (/[\d\.\-e\+]/.test(numChar)) {
            parsedNum += numChar;
          } else {
            i--;
            break;
          }
        }
        pop(parseFloat(parsedNum), stack, metaStack);
        break;
      case '"':
        parsedString = '';
        lastCh = void 0;
        numConsecutiveSlashes = 0;
        while (true) {
          ch = str[i++];
          if (ch !== '"' || (lastCh === '\\' &&
              numConsecutiveSlashes % 2 === 1)) {
            parsedString += ch;
            lastCh = ch;
            if (lastCh === '\\') {
              numConsecutiveSlashes++;
            } else {
              numConsecutiveSlashes = 0;
            }
          } else {
            break;
          }
        }
        pop(JSON.parse('"' + parsedString + '"'), stack, metaStack);
        break;
      case '[':
        arrayElement = { element: [], index: stack.length };
        stack.push(arrayElement.element);
        metaStack.push(arrayElement);
        break;
      case '{':
        objElement = { element: {}, index: stack.length };
        stack.push(objElement.element);
        metaStack.push(objElement);
        break;
      default:
        throw new Error(
          'unexpectedly reached end of input: ' + collationIndex);
    }
  }
};

},{}]},{},[4])(4)
});

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/impl/pouchDBPersistenceStore',["../PersistenceStore", "../impl/storageUtils", "pouchdb", "./logger"],
       function (PersistenceStore, storageUtils, PouchDB, logger) {
  'use strict';

  var PouchDBPersistenceStore = function (name) {
    PersistenceStore.call(this, name);
  }

  PouchDBPersistenceStore.prototype = new PersistenceStore();

  // in ---> index: ['foo', 'bar']
  // out---> index: {
  //                  fields: ['foo', 'bar'],
  //                  name: 'storefoobar'
  //                }
  PouchDBPersistenceStore.prototype.Init = function (options) {
    this._version = (options && options.version) || '0';
    var dbname = this._name + this._version;
    var adapter = options ? options.adapter : null;
    var dbOptions = this._extractDBOptions(options);
    if (adapter) {
      try {
        if (adapter.plugin) {
          PouchDB.plugin(adapter.plugin);
        }
        dbOptions = dbOptions ? dbOptions : {};
        dbOptions['adapter'] = adapter.name;
        this._dbOptions = dbOptions;
        this._db = new PouchDB(dbname, dbOptions);
      } catch (exp) {
        logger.log("Error creating PouchDB instance with adapter " + adapter + ": ", exp.message);
        logger.log("Please make sure the needed plugin and adapter are installed.");
        return Promise.reject(exp);
      }
    } else if (dbOptions) {
      this._dbOptions = dbOptions;
      this._db = new PouchDB(dbname, dbOptions);
    } else {
      this._dbOptions = null;
      this._db = new PouchDB(dbname);
    }
    if (options && options.index) {
      // pouch db automatically create index on key, no need to specifically
      // create it.
      if (!Array.isArray(options.index)) {
        logger.log("index must be an array");
      } else {
        this._index = options.index.filter(function(indexKey) {
          return indexKey !== 'key';
        });
        if (this._index.length === 0) {
          this._index = null;
        }
      }
    }
    return this._createIndex();
  };

  // extract the option keys that will be passed to pouchDB.
  // ignore the ones that's for PouchDBPersistenceStore itself.
  PouchDBPersistenceStore.prototype._extractDBOptions = function(options) {
    var dbOptions = null;
    if (options) {
      var self = this;
      Object.keys(options).forEach(function(optionKey) {
        if (!self._isPersistenceStoreKey(optionKey)) {
          if (!dbOptions) {
            dbOptions = {};
          }
          dbOptions[optionKey] = options[optionKey];
        }
      });
    }
    return dbOptions;
  };

  PouchDBPersistenceStore.prototype._isPersistenceStoreKey = function(keyName) {
    return keyName === 'version' || keyName === 'adapter' ||
           keyName === 'index' || keyName === 'skipMetadata';
  };

  PouchDBPersistenceStore.prototype._createIndex = function () {
    if (!this._index || !this._db.createIndex) {
      return Promise.resolve();
    } else {
      var self = this;
      var indexName = self._name + self._index.toString().replace(",", "").replace(".","");
      var indexSyntax = {
        index: {
          fields: self._index,
          name: indexName
        }
      };
      // createIndex if using the find plugin
      return self._db.createIndex(indexSyntax).catch(function(error) {
        logger.error("creating index on " + self._index.toString() + " failed with error " + error);
      });
    }
  };

  PouchDBPersistenceStore.prototype.upsert = function (key, metadata, value, expectedVersionIdentifier) {
    logger.log("Offline Persistence Toolkit pouchDBPersistenceStore: upsert() for key: " + key);
    var self = this;
    var docId = key.toString();

    return self._db.get(docId).then(function (doc) {
      // document exists already, update it if its versionIdentifier value
      // is the same as the expected value. Otherwise, throw conflict error
      if (!_verifyVersionIdentifier(expectedVersionIdentifier, doc)) {
        return Promise.reject({status: 409});
      } else {
        return doc;
      }
    }).catch(function (geterr) {
      if (geterr.status === 404 && geterr.message === 'missing') {
        return;
      } else {
        return Promise.reject(geterr);
      }
    }).then(function (existingDoc) {
      return self._put(docId, metadata, value, expectedVersionIdentifier, existingDoc);
    });
  }

  PouchDBPersistenceStore.prototype._put = function (docId, metadata, value,
                                                     expectedVersionIdentifier,
                                                     existingDoc) {

    var attachmentParts = [];
    var fullbinaryData = this._prepareUpsert(value, attachmentParts);

    var dbdoc = {
      _id: docId,
      key: docId,
      metadata: metadata,
      value: fullbinaryData ? null : value
    };

    if (existingDoc) {
      dbdoc._rev = existingDoc._rev;
    }
    var self = this;
    return self._db.put(dbdoc).then(function(addeddoc) {
      return self._addAttachments(docId, addeddoc.rev, attachmentParts);
    }).catch(function(puterr) {
      if (puterr.status === 409) {
        // because of the asynchroness nature, and the same resource
        // could be asked to add to the store in multiple paths, it's
        // valid to have conflict error from pouchDB.
      } else {
        throw puterr;
      }
    });
  };

  // helper function to check expectedVersionIdentifier with the
  // versionIdentifier value of currentDocument. Return true if there is no
  // confict, false otherwise.
  var _verifyVersionIdentifier = function (expectedVersionIdentifier, currentDocument) {
    if (!expectedVersionIdentifier) {
      return true;
    } else {
      var docVersionIdentifier = currentDocument.metadata.versionIdentifier;
      return docVersionIdentifier === expectedVersionIdentifier;
    }
  };

  // add the binary part of the value as attachment to the main document.
  PouchDBPersistenceStore.prototype._addAttachments = function (docId, docRev, attachmentParts) {
    if (!attachmentParts || !attachmentParts.length) {
      return Promise.resolve();
    } else {
      var self = this;
      var promises = attachmentParts.map(function (attachment) {
        var blob;
        if (attachment.value instanceof Blob) {
          blob = attachment.value;
        } else {
          blob = new Blob([attachment.value]);
        }
        return self._db.putAttachment(docId, attachment.path, docRev, blob, 'binary')
      }, this);
      return Promise.all(promises).catch(function(error) {
        logger.error("store: " + self._name + " failed add attachment for doc " + docId);
      });
    }
  };

  PouchDBPersistenceStore.prototype.upsertAll = function (values) {
    logger.log("Offline Persistence Toolkit pouchDBPersistenceStore: upsertAll()");
    if (!values || !values.length) {
      return Promise.resolve();
    } else {
      var self = this;
      var docIdToAttachmentParts = {};
      var dbpromises = values.map(function(element) {
        var docId = element.key.toString();
        var value = element.value;
        var attachmentParts = [];
        var fullbinaryData = self._prepareUpsert(value, attachmentParts);
        if (attachmentParts.length > 0) {
          docIdToAttachmentParts[docId] = attachmentParts;
        }
        var doc = {
          _id: docId,
          key: element.key,
          metadata: element.metadata,
          value: fullbinaryData ? null : value
        };
        return self._db.get(docId).then(function(existdoc) {
          doc["_rev"] = existdoc["_rev"];
          return doc;
        }).catch(function(error) {
          if (error.status === 404 && error.message === 'missing') {
            // this doc does not exist yet, no need to provide revision value
            return doc;
          } else {
            throw error;
          }
        });
      });

      return Promise.all(dbpromises).then(function(dbdocs) {
        return self._db.bulkDocs(dbdocs);
      }).then(function(results) {
        var promises = [];
        results.forEach(function(result, index) {
          if (result["ok"]) {
            var attachmentParts = docIdToAttachmentParts[result.id];
            if (attachmentParts) {
              promises.push(self._addAttachments(result.id, result.rev, attachmentParts));
            }
          } else if (result['status'] === 409) {
            logger.log("conflict error");
          }
        });
        if (promises.length > 0) {
          return Promise.all(promises);
        }
      }).catch(function(error) {
        logger.log("error in upsertAll");
      });
    }
  };

  PouchDBPersistenceStore.prototype.find = function (findExpression) {
    logger.log("Offline Persistence Toolkit pouchDBPersistenceStore: find() for expression: " +  JSON.stringify(findExpression));
    var self = this;

    findExpression = findExpression || {};

    // if the find plugin is installed
    if (self._db.find) {
      var modifiedFind = self._prepareFind(findExpression);
      return self._db.find(modifiedFind).then(function (result) {
        if (result && result.docs && result.docs.length) {
          var promises = result.docs.map(self._findResultCallback(modifiedFind.fields), self);
          return Promise.all(promises);
        } else {
          return [];
        }
      }).catch(function (finderr) {
        if (finderr.status === 404 && finderr.message === 'missing') {
          return [];
        } else {
          throw finderr;
        }
      });
    } else {
      // get all rows and use our own find logic
      return self._db.allDocs({include_docs: true}).then(function (result) {
        if (result && result.rows && result.rows.length) {
          // filter on the rows first before _fixBinaryValue which adds binary
          // back to the document. This assumes the search criteria should
          // not have any operator against the binary data.
          var satisfiedRows = result.rows.filter(function(row) {
            var doc = row.doc;
            if (!_isInternalDoc(row) && storageUtils.satisfy(findExpression.selector, doc)) {
              return true;
            }
            return false;
           });

          if (satisfiedRows.length) {
            var unsortedDocs = satisfiedRows.map(function(row) {
              self._fixKey(row.doc)
              return row.doc;
            });
            var sortedDocs = storageUtils.sortRows(unsortedDocs, findExpression.sort);
            var fixDocPromises = sortedDocs.map(function(doc) {
              return self._fixBinaryValue(doc).then(function(fixedDoc){
                if (findExpression.fields) {
                  return storageUtils.assembleObject(fixedDoc, findExpression.fields);
                } else {
                  return fixedDoc.value;
                }
              });
            });
            return Promise.all(fixDocPromises);
          } else {
            return [];
          }
        } else {
          return [];
        }
      }).catch(function(err) {
        logger.log("error retrieving all documents from pouch db, returns empty list as find operation.", err);
        return [];
      });
    }
  };

  PouchDBPersistenceStore.prototype._findResultCallback = function (useDefaultField) {
    return function (element) {
      var self = this;
      return self._fixValue(element).then(function (fixedDoc) {
        if (useDefaultField) {
          return fixedDoc;
        } else {
          return fixedDoc.value;
        }
      });
    };
  };

  // invoked after document is retrieved. Fix the key and binary
  // part of the value.
  PouchDBPersistenceStore.prototype._fixValue = function (doc) {
    this._fixKey(doc);
    return this._fixBinaryValue(doc);
  };

  // If the original value has binary data in it,
  // we need to retrieve it back as attachments
  // and add it back to the value part.
  PouchDBPersistenceStore.prototype._fixBinaryValue = function (doc) {
    var docId = doc._id || doc.id || doc.key;
    var attachments = doc._attachments;
    if (!attachments) {
      return Promise.resolve(doc);
    } else {
      var self = this;
      var filename = Object.keys(attachments)[0];
      return self._db.getAttachment(docId, filename).then(function (blob) {
        if (filename === 'rootpath') {
          doc.value = blob;
        } else {
          var paths = filename.split('.');
          var targetValue = doc.value;
          for (var pathIndex = 0; pathIndex < paths.length - 1; pathIndex++) {
            targetValue = targetValue[paths[pathIndex]];
          }
          targetValue[paths[paths.length - 1]] = blob;
        }
        return doc;
      }).catch(function(error) {
        logger.error("store: " + self._name + " error getting attachment. ");
      });
    }
  };

  PouchDBPersistenceStore.prototype.findByKey = function (key) {
    logger.log("Offline Persistence Toolkit pouchDBPersistenceStore: findByKey() for key: " + key);
    var self = this;
    var docId = key.toString();

    return self._db.get(docId, {attachments: true}).then(function (doc) {
      return self._fixBinaryValue(doc);
    }).then(function(fixedDoc) {
      return fixedDoc.value;
    }).catch(function (err) {
      if (err.status === 404 && err.message === 'missing') {
        return;
      } else {
        return Promise.reject(err);
      }
    });
  };

  PouchDBPersistenceStore.prototype.removeByKey = function (key) {
    logger.log("Offline Persistence Toolkit pouchDBPersistenceStore: removeByKey() for key: " + key);
    var self = this;
    if (!key) {
      return Promise.resolve(false);
    }
    var docId = key.toString();
    return self._db.get(docId).then(function (doc) {
      return self._db.remove(doc);
    }).then(function () {
      return true;
    }).catch(function (err) {
      if (err.status === 404 && err.message === 'missing') {
        return false;
      } else {
        return Promise.reject(err);
      }
    });
  };

  PouchDBPersistenceStore.prototype.delete = function (deleteExpression) {
    logger.log("Offline Persistence Toolkit pouchDBPersistenceStore: delete() for expression: " +  JSON.stringify(deleteExpression));
    var self = this;

    if (deleteExpression) {
      var modifiedExpression = deleteExpression;
      modifiedExpression.fields = ['_id', '_rev'];
      return self.find(modifiedExpression).then(function (entries) {
        if (entries && entries.length) {
          var docsToDelete = entries.map(function(doc) {
            return {'_id': doc['_id'], '_rev': doc['_rev'], '_deleted': true};
          });
          return self._db.bulkDocs(docsToDelete);
        } else {
          return;
        }
      }).catch(function(error) {
        logger.error("store: " + self._name + " error deleting....");
      });
    } else {
      return self._db.destroy().then(function () {
        var dbname = self._name + self._version;
        if (self._dbOptions) {
          self._db = new PouchDB(dbname, self._dbOptions);
        } else {
          self._db = new PouchDB(dbname);
        }
        return self._createIndex();
      }).catch(function(error) {
        logger.error("store: " + self._name + " error deleting....");
      });
    }
  };

  PouchDBPersistenceStore.prototype.keys = function () {
    logger.log("Offline Persistence Toolkit pouchDBPersistenceStore: keys()");
    var self = this;

    return self._db.allDocs().then(function (result) {
      var rows = result.rows;
      var keysArray = [];
      if (rows && rows.length) {
        for (var index = 0; index < rows.length; index++) {
          if (!_isInternalDoc(rows[index])) {
            keysArray.push(rows[index].id);
          }
        }
      }
      return keysArray;
    }).catch(function(error) {
      logger.error("store: " + self._name + " error getting all the docs for keys ");
    });
  };

  // return a promise that resolves to an expression that can be
  // understood by pouchdb find plugin.
  PouchDBPersistenceStore.prototype._prepareFind = function (findExpression) {

    var modifiedExpression = {};

    // ideally we should allow sort, but PouchDB-find-plugin
    // has bug on that, so disable sorting at this time by
    // not copy sort from original expression.

    // selector is required from pouchdb.find plugin, thus create a selector
    // property if no selector is explicitely defined in findExpression. The
    // default selector is {'_id': {$gt: null}} which selects everything.
    var selector = findExpression.selector;
    if (!selector) {
      modifiedExpression.selector = {
        '_id': {'$gt': null}
      };
    } else if (selector) {
      modifiedExpression.selector = selector;
    }

    // our key attribute maps to pouchdb documents' _id field.
    var fields = findExpression.fields;
    if (fields && fields.length) {
      modifiedExpression.fields = fields;

      // if the _id field is not included, it will be added to the list
      // this is so that previous version of OPT will be compatable and
      // still have access to the 'key' value after the find is fixed
      if (fields.indexOf('key') !== -1 && fields.indexOf('_id') === -1){
        modifiedExpression.fields.push('_id')
      }
    }
    return modifiedExpression;
  };

  // prepare the value for upsert. pouchDB requires that binary part of the value
  // be added as attachment instead of as part of the value.
  PouchDBPersistenceStore.prototype._prepareUpsert = function (value, attachmentParts) {
    if (!value) {
      return false;
    }
    if ((value instanceof Blob) || (value instanceof ArrayBuffer)) {
      attachmentParts.push({
        path: "rootpath",
        value: value
      });
      return true;
    }
    var path = '';
    this._inspectValue(path, value, attachmentParts);
    return false;
  };

  // scan the value to see if there's any binary data in it, if so, extract it out.
  PouchDBPersistenceStore.prototype._inspectValue = function (path, value, attachmentParts) {
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        var itemValue = value[key];
        if (itemValue && typeof(itemValue) === 'object') {
          if ((itemValue instanceof Blob) || (itemValue instanceof ArrayBuffer)) {
            var localPath = path;
            if (localPath.length > 0) {
              localPath = localPath + '.';
            }
            var attachment = {
              path: localPath + key,
              value: itemValue
            };
            attachmentParts.push(attachment);
            value.key = null;
          } else if (itemValue.length === undefined) {
            var oldPath = path;
            if (path.length > 0) {
              path = path + '.';
            }
            path = path + key;
            this._inspectValue(path, itemValue, attachmentParts);
            path = oldPath;
          }
        }
      }
    }
  };

  PouchDBPersistenceStore.prototype.updateKey = function(currentKey, newKey) {
    logger.log("Offline Persistence Toolkit PouchDBPersistenceStore: updateKey() with currentKey: " + currentKey + " and new key: " + newKey);
    var self = this;
    return self._db.get(currentKey).then(function (existingValue) {
      if (existingValue) {
        return self.upsert(newKey, existingValue.metadata, existingValue.value);
      } else {
        return Promise.reject("No existing key found to update");
      }
    }).then(function() {
      return self.removeByKey(currentKey);
    }).catch(function() {
      logger.error("store: " + self._name + " error updating key");
    });
  };

  // when find plugin is not present, we query out all documents and run the
  // find ourselve. allDocs returns some internal document that pouchDB created
  // we should ignore. For example, when the store has index configured,
  // pouchDB will create a document with id starting with '_design'. There is
  // no option provided from allDocs() call that we can use to ask pouchDB to
  // not return internal documents.
  var _isInternalDoc = function(dbRow) {
    var id = dbRow.id;
    return id.startsWith('_design/');
  };

  PouchDBPersistenceStore.prototype._fixKey = function (doc) {
    var docId = doc._id || doc.id || doc.key;
    if (docId) {
      doc.key = docId;
    }
  };

  return PouchDBPersistenceStore;
});

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/pouchDBPersistenceStoreFactory',["./impl/pouchDBPersistenceStore"],
       function(PouchDBPersistenceStore) {
  'use strict';

  /**
   * @export
   * @class PouchDBPersistenceStoreFactory
   * @classdesc PersistenceStoreFactory that creates PouchDB backed 
   *            PersisteneStore instance.
   * @hideconstructor
   */
  var PouchDBPersistenceStoreFactory = (function () {

    /**
     * @method
     * @name createPersistenceStore
     * @memberof! PouchDBPersistenceStoreFactory
     * @export
     * @instance
     * @param {string} name The name to be associated with the store.
     * @param {object} [options] The configratuion options to be applied to the store.
     * @param {string} [options.version] The version of the store.
     * @return {Promise<PouchDBPersistenceStore>} returns a Promise that is resolved to a PouchDB backed
     * PersistenceStore instance.
     */
     
    function _createPersistenceStore (name, options) {
      var store = new PouchDBPersistenceStore(name);
      return store.Init(options).then(function () {
        return store;
      });
    };

    return {
      'createPersistenceStore' : function (name, options) {
        return _createPersistenceStore(name, options);
      }
    };
  }());

  return PouchDBPersistenceStoreFactory;
});
/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/persistenceStoreManager',['./impl/logger', './impl/PersistenceStoreMetadata', './pouchDBPersistenceStoreFactory'], function (logger, PersistenceStoreMetadata, pouchDBPersistenceStoreFactory) {
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
    Object.defineProperty(this, '_METADATA_STORE_NAME', {
      value: 'systemCache-metadataStore',
      writable: false
    });
    // some pattern of store name (e.g. http://) will cause issues
    // for the underlying storage system. We'll rename the store
    // name to avoid such issue. This is to store the original store
    // name to the system replaced name.
    Object.defineProperty(this, '_storeNameMapping', {
      value: {},
      writable: true
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

    var storeName = this._mapStoreName(name);
    var oldFactory = this._factories[storeName];
    if (oldFactory && oldFactory !== factory) {
      throw TypeError("A factory with the same name has already been registered.");
    }
    this._factories[storeName] = factory;
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
    var storeName = this._mapStoreName(name);
    var allVersions = this._stores[storeName];
    var version = (options && options.version) || '0';

    if (allVersions && allVersions[version]) {
      return Promise.resolve(allVersions[version]);
    }

    var factory = this._factories[storeName];
    if (!factory) {
      factory = this._factories[this._DEFAULT_STORE_FACTORY_NAME];
    }
    if (!factory) {
      return Promise.reject(new Error("no factory is registered to create the store."));
    }

    var self = this;
    logger.log("Offline Persistence Toolkit PersistenceStoreManager: Calling createPersistenceStore on factory");
    return factory.createPersistenceStore(storeName, options).then(function (store) {
      allVersions = allVersions || {};
      allVersions[version] = store;
      self._stores[storeName] = allVersions;
      if (options && options.skipMetadata) {
        return store;
      } else {
        return self._updateStoreMetadata(storeName, version).then(function() {
          return store;
        }).catch(function(error) {
          logger.log("updating store metadata for store " + storeName + " failed");
          return store;
        });
      }
    });
  };

  PersistenceStoreManager.prototype._updateStoreMetadata = function (storeName, version) {
    var self = this;
    return self._getStoresMetadata(storeName).then(function(storeMetadata) {
      var dbEntry = null;
      if (!storeMetadata) {
        // no metadata for this store yet, need to add an entry.
        dbEntry = [version];
      } else if (storeMetadata.versions.indexOf(version) < 0) {
        // no version for this .
        storeMetadata.versions.push(version);
        dbEntry = storeMetadata.versions;
      }
      if (dbEntry) {
        // now need to update metadata from database.
        var encodedStoreName = self._encodeString(storeName);
        return self._metadataStore.upsert(encodedStoreName, {}, dbEntry);
      }
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
    var storeName = this._mapStoreName(name);
    var allVersions = this._stores[storeName];
    if (!allVersions || Object.keys(allVersions).length === 0) {
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
    var self = this;
    var storeName = this._mapStoreName(name);
    return self._getStoresMetadata(storeName).then(function(storeMetadata) {
      if (!storeMetadata) {
        // no metadata for this store, could be that no store instances have 
        // ever been created, or skipMetadata was true when the store is created;
        var storesToDelete = [];
        if (options && options.version) {
          if (self._stores[storeName] && self._stores[storeName][options.version]) {
            storesToDelete.push(self._stores[storeName][options.version]);
            delete self._stores[storeName][options.version];
          }
        } else if (self._stores[storeName]) {
          storesToDelete = Object.values(self._stores[storeName]);
          self._stores[storeName] = {};
        }
        if (storesToDelete.length) {
          var promises = storesToDelete.map(function(store) {
            return store.delete();
          })
          return Promise.all(promises).then(function() {
            return true;
          }).catch(function(err) {
            logger.log("failed deleting store " + name);
            return false;
          });
        } else {
          return false;
        }
      } else {
        var versionsToDelete = [];
        var remainingVersions = [];
        var allVersions = storeMetadata.versions;
        if (options && options.version) {
          var index = allVersions.indexOf(options.version);
          if (index < 0) {
            // no such version exists.
            remainingVersions = allVersions;
          } else {
            // only remove the asked version.
            allVersions.splice(index, 1);
            remainingVersions = allVersions;
            versionsToDelete.push(options.version);
          }
        } else {
          // remove all the versions.
          versionsToDelete = allVersions;
        }
        if (versionsToDelete.length) {
          var promises = versionsToDelete.map(function(version) {
            var self = this;
            return self.openStore(storeName, {version: version, skipMetadata: true}).then(function(store) {
              delete self._stores[storeName][version];
              return store.delete();
            }); 
          }, self);
          return Promise.all(promises).then(function() {
            // update metadata store.
            var encodedStoreName = self._encodeString(storeName);
            if (remainingVersions.length) {
              return self._metadataStore.upsert(encodedStoreName, {}, remainingVersions);
            } else {
              return self._metadataStore.removeByKey(encodedStoreName);
            }
          }).then(function() {
            return true;
          }).catch(function(error) {
            logger.log("failed deleting store " + storeName);
            return false;
          });
        } else {
          return false;
        }
      }
    });
  };

  /**
   * Returns a promise that resolves to a Map of store name and store metadata.
   * @method
   * @name getStoresMetadata
   * @memberof! PersistenceStoreManager
   * @instance
   * @return {Promise<Map<String, PersistenceStoreMetadata>>} Returns a Map of store name and store metadata.
   */
  PersistenceStoreManager.prototype.getStoresMetadata = function() {
    var self = this;
    var storesMetadataMap = new Map();
    return this._getMetadataStore().then(function(store) {
      return store.find({fields: ['key', 'value']});
    }).then(function(entries) {
      if (entries && entries.length > 0) {
        entries.forEach(function(entry) {
          var storeName = self._decodeString(entry.key);
          var factory = self._factories[storeName];
          if (!factory) {
            factory = self._factories[self._DEFAULT_STORE_FACTORY_NAME];
          }
          storesMetadataMap.set(storeName, new PersistenceStoreMetadata(storeName, factory, entry.value));
        });
      }
      return storesMetadataMap;
    }).catch(function(err) {
      logger.log("error occured getting store metadata.");
      return storesMetadataMap;
    });
  };

  // get the store information for this store.
  PersistenceStoreManager.prototype._getStoresMetadata = function(storeName) {
    var self = this;
    return self._getMetadataStore().then(function(store) {
      var encodedStoreName = self._encodeString(storeName);
      return store.findByKey(encodedStoreName);
    }).then(function(entry) {
      if (entry) {
        var factory = self._factories[storeName];
        if (!factory) {
          factory = self._factories[self._DEFAULT_STORE_FACTORY_NAME];
        }
        return new PersistenceStoreMetadata(storeName, factory, entry);
      } else {
        return null;
      }
    }).catch(function(error) {
      logger.log("error getting store metadata for store " + storeName);
      return null;
    });
  };

  PersistenceStoreManager.prototype._mapStoreName = function (name, options) {
    var mappedName = this._storeNameMapping[name];
    if (mappedName) {
      return mappedName;
    } else {
      // remove '://' from the string. 
      mappedName = name.replace(/(.*):\/\/(.*)/gi, '$1$2');
      this._storeNameMapping[name] = mappedName;
      return mappedName;
    }
  };

  PersistenceStoreManager.prototype._getMetadataStore = function () {
    var self = this;
    if (!self._metadataStore) {
      // check if there is a default store factory
      var factory = this._factories[this._DEFAULT_STORE_FACTORY_NAME];
      if (!factory) {
        // if not, register the pouchdb store
        this._factories[self._METADATA_STORE_NAME] = pouchDBPersistenceStoreFactory;
      }
      return this.openStore(self._METADATA_STORE_NAME, {skipMetadata: true}).then(function (store) {
        self._metadataStore = store;
        return self._metadataStore;
      });
    }
    return Promise.resolve(self._metadataStore);
  }

  PersistenceStoreManager.prototype._encodeString = function(value) {
	  var i, arr = [];
	  for (var i = 0; i < value.length; i++) {
		  var hex = Number(value.charCodeAt(i)).toString(16);
		  arr.push(hex);
	  }
	  return arr.join('');
  }

  PersistenceStoreManager.prototype._decodeString = function (value) {
	  var hex  = value.toString();
    var str = '';
    var i;
	  for (i = 0; i < hex.length; i += 2) {
		  str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	  }
	  return str;
  }

  return new PersistenceStoreManager();
});
/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/impl/defaultCacheHandler',['../persistenceUtils', '../persistenceStoreManager', './logger'],
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
      var excludeBody = self.hasShredder(request);
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
      if (shreddedObjArray && Array.isArray(shreddedObjArray)) {
        return shreddedObjArray.map(_convertShreddedData);
      } else {
        return null;
      }
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
    var key = request.url + "$" + request.method + "$";
    if (response) {
      var headers = response.headers;
      if (headers) {
        var varyValue = headers.get('vary');
        if (varyValue) {
          if (varyValue === '*') {
            // * vary value means every request is absolutely unique.
            key = (new Date()).getTime()*1000 + Math.floor(Math.random() * 1000);;
          } else {
            var requestHeaders = request.headers;
            var varyFields = varyValue.split(',');
            for (var index = 0; index < varyFields.length; index++) {
              var varyField = varyFields[index];
              varyField = varyField.trim();
              var varyValue = (!requestHeaders || !requestHeaders.get(varyField)) ? 'undefined' : requestHeaders.get(varyField);
              key += varyField + '=' + varyValue + ';';
            }
          }
        }
      }
    }
    return key;
  };

  // request: the request to match against
  // options: options that controls the match
  // allKeys: the possible keys to find matches from.
  DefaultCacheHandler.prototype.getMatchedCacheKeys = function (request, options, allKeys) {
    var urlToMatch;
    var methodToMatch;

    if (options && options.ignoreSearch) {
      urlToMatch = extractBaseUrl(request.url);
    } else {
      urlToMatch = request.url;
    }
    if (!options || !options.ignoreMethod) {
      methodToMatch = request.method;
    }

    return allKeys.filter(function(key) {
      var parts = key.split("$");
      var urlToCheck;
      // check to see key was split into multiple parts based on delimiter
      if (parts.length === 1){
        // if only 1 part, then key may be using old key method
        // here for compatablity with pre v1.4.1

        // check if url to check is the same as the request url
        urlToCheck = key.slice(0,urlToMatch.length);
        if (urlToCheck !== urlToMatch) {
            return false;
        }

        if (options && options.ignoreSearch) {
          if (key[urlToMatch.length] === '/') {
            return false;
          }
        }
        // check the for the method using indexOf only if the method
        // needs to be matched. Slicing the key based on the length of the
        // urlToMatch length, if the option.ignoreSearch is true, we don't know
        // where the method is past the '?', so search the whole string. if
        // option.ignoreSearch is false, then just check the substring of method length
        var methodToCheck
        if (methodToMatch){
          if (options && options.ignoreSearch) {
            methodToCheck = key.slice(urlToMatch.length);
          } else {
            methodToCheck = key.slice(urlToMatch.length,urlToMatch.length + request.method.length)
          }
          if(methodToCheck.indexOf(methodToMatch) === -1) {
            return false;
          }
        }
        if (!options || !options.ignoreVary) {
          var variesInKey = key;
          // if methodToMatch exists, split based on method then select the last instance in the array for Vary
          // this is incase there are multiple instances of a method Keyword ie localhost.com/PUTherePUTVaryHeader
          if (methodToMatch){
            variesInKey = variesInKey.split(methodToMatch);
            variesInKey = variesInKey[variesInKey.length - 1];
          }
          else {
            // if method is ignored, using regular expressions to find the last instance of a method Keyword
            // return the capture group that appears after that keyword.
            variesInKey = getVariesRegExp(variesInKey);
          }
          if (!variesInKey) {
            return true;
          }

          // split based on = to determine number of keys
          var varyPairs = variesInKey.split('=')
          var requestHeaders = request.headers;
          // if only 2 items, then that is the header and value pair
          if (varyPairs === 2){
            var varyValue = (!requestHeaders || !requestHeaders.get(varyPairs[0])) ? 'undefined' : requestHeaders.get(varyPairs[0]);
            if (varyValue !== varyPairs[1]) {
              return false;
            }
          } else {
            // otherwise, the header and value pair of the next header are combined like 'str1=str2str3=str4”
            for (var index = 0; index < varyPairs.length - 1; index++) {
              var varyFieldValueToCheck = varyPairs[index];
              var varyValue = (!requestHeaders || !requestHeaders.get(varyFieldValueToCheck)) ? 'undefined' : requestHeaders.get(varyFieldValueToCheck);
              // split based on varyValue provided by the header
              var checkPairs = varyPairs[index+1].split(varyValue);
              // if value is in the header, it splits into length of 2, where the first item is ''
              if (checkPairs.length !== 2 && checkPairs[0] !== ''){
                return false;
              // must also check to make sure that the second pair does not start with a ',' otherwise
              // that means the vary value returned does not match the original value which contained more than 1 value
              }else if (checkPairs[1] && checkPairs[1].startsWith(',')){
                return false;
              } else {
                varyPairs[index+1] = checkPairs[1];
              }
            }
          }
        }
        return true
      } else {
        // use new key search
        if (options && options.ignoreSearch) {
          urlToCheck = extractBaseUrl(parts[0]);
        } else {
          urlToCheck = parts[0];
        }
        if (urlToCheck !== urlToMatch) {
          return false;
        }
        if (methodToMatch && parts[1] !== methodToMatch) {
          return false;
        }
        if (!options || !options.ignoreVary) {
          var variesInKey = parts[2];
          if (!variesInKey) {
            return true;
          }
          var pairs = variesInKey.split(';');
          if (pairs.length === 1) {
            return false;
          }
          var requestHeaders = request.headers;
          for (var index = 0; index < pairs.length - 1; index++) {
            var pair = pairs[index];
            var varyFieldValueToCheck = pair.split('=');
            var varyValue = (!requestHeaders || !requestHeaders.get(varyFieldValueToCheck[0])) ? 'undefined' : requestHeaders.get(varyFieldValueToCheck[0]);
            if (varyValue != varyFieldValueToCheck[1]) {
              return false;
            }
          }
        }
        return true;
      }
    });
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
    var baseUrl = extractBaseUrl(request.url);
    var metadata = {
      url:  request.url,
      method: request.method,
      baseUrl: baseUrl,
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
      return response;
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

    if (ignoreSearch) {
      var searchURL = extractBaseUrl(request.url);
      selectorField = {
        'metadata.baseUrl': searchURL
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
      sort: ['metadata.created']
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

  DefaultCacheHandler.prototype.hasShredder = function (request) {
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
    if (bodyAbstract && bodyAbstract.length === 1) {
      if (bodyAbstract[0].resourceType === 'single') {
        response.headers.set('x-oracle-jscpt-resource-type', 'single');
      }
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
            return {key: {$eq: keyValue}};
          });
          var findExpression = {
            selector: {
              $or: transformedKeys
            }
          };
          return store.find(findExpression);
        }
      }
      return [];
    }).then(function (results) {
      if (!Array.isArray(results)) {
        results = [results];
      }
      storeEntry.data = results;
      return storeEntry;
    });
  };

  /**
   * Utility method that deletes the shredded data identified by
   * the body-less resonse.
   * @method
   * @name deleteShreddedData
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {bodyAbstract} request The body abstract from the cached body-less
   *                               response.
   * @return {Promise} returns a Promise that resolve when all the shredded
   *                   data is deleted.
   */
  DefaultCacheHandler.prototype.deleteShreddedData = function (bodyAbstract) {
    var promises = [];
    bodyAbstract.forEach(function(item) {
      var storeName = item.name;
      var keys = item.keys;
      if (storeName && keys && keys.length) {
        var storeDeletionTask = persistenceStoreManager.openStore(storeName).then(function(store) {
          var transformedKeys = keys.map(function (keyValue) {
            return {key: {$eq: keyValue}};
          });
          var findExpression = {
            selector: {
              $or: transformedKeys
            }
          };
          return store.delete(findExpression);
        });
        promises.push(storeDeletionTask);
      }
    });
    return Promise.all(promises);
  };

  var escapeRegExp = function(str) {
    return String(str).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  };

  var extractBaseUrl = function(fullUrl) {
    // return the url that doesn't have query parameters in it.
    if (!fullUrl || typeof fullUrl !== 'string') {
      return "";
    }
    var pattern = /([^?]*)\?/;
    var matchResult = pattern.exec(fullUrl);
    if (matchResult && matchResult.length === 2) {
      return matchResult[1];
    } else {
      return fullUrl;
    }
  };
  var getVariesRegExp = function(fullUrl) {
    // returns the Vary section of a if the option ignore method is applied
    // regexp is in reversed strings with '.*?' to capture as little as possible
    // before hitting the first instance of a method String.
    if (!fullUrl || typeof fullUrl !== 'string') {
      return "";
    }
    var reversedUrl = fullUrl.split("").reverse().join("")
    var pattern = /(.*?)(TEG|TUP|ETELED|TSOP|HCTAP|TCENNOC|SNOITPO|ECART)/;
    var matchResult = pattern.exec(reversedUrl);
    if (matchResult && matchResult.length === 3) {
      return matchResult[1].split("").reverse().join("");
    } else {
      return fullUrl;
    }
  };

  return new DefaultCacheHandler();
});

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/impl/PersistenceSyncManager',['require', '../persistenceUtils', '../persistenceStoreManager', './defaultCacheHandler', './logger'],
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
        return _getRequestFromSyncLog(requestId, store);
      }).then(function(request) {
        if (!request) {
          return;
        } else {
          return self._internalRemoveRequest(requestId, request, localVars.store);
        }
      });
    }

    PersistenceSyncManager.prototype._internalRemoveRequest = function (requestId, request, synclogStore) {
      var self = this;
      var promises = [];
      if (!synclogStore) {
        promises.push(_getSyncLogStorage().then(function(synclogStore) {
          return synclogStore.removeByKey(requestId);
        }));
      } else {
        promises.push(synclogStore.removeByKey(requestId));
      }
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        promises.push(_getRedoUndoStorage().then(function(redoUndoStore) {
          return redoUndoStore.removeByKey(requestId);
        }));
      }
      return Promise.all(promises).then(function() {
        return request;
      }).catch(function(error) {
        logger.log("Offline Persistence Toolkit PersistenceSyncManager: removeRequest() error for Request with requestId: " + requestId);
      });;
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
          logger.log("Offline Persistence Toolkit PersistenceSyncManager: Processing sync");
          var requestId, request, requestClone, statusCode;
          var replayRequestArray = function (requests) {
            if (requests.length == 0) {
              logger.log("Offline Persistence Toolkit PersistenceSyncManager: Sync finished, no requests in sync log");
              resolve();
            }
            if (requests.length > 0) {
              logger.log("Offline Persistence Toolkit PersistenceSyncManager: Processing sync, # of requests in sync log: " + requests.length);
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
                    // mark the request as initiated from sync operation and
                    // start the fetch to replay the request. we don't directly
                    // use browser fetch because we want the response from the
                    // fetch to go through cacheStrategy logic from response
                    // proxy.
                    persistenceUtils.markReplayRequest(request, true);
                    logger.log("Offline Persistence Toolkit PersistenceSyncManager: Replaying request with url: " + request.url);
                    fetch(request).then(function (response) {
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
                            self._internalRemoveRequest(requestId, request).then(function () {
                              requests.shift();
                              replayRequestArray(requests);
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
                  self._internalRemoveRequest(requestId, request).then(function () {
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
        });
      });

      return syncPromise.finally(function (err) {
        self._syncing = false;
        self._pingedURLs = null;
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
          requestId = requestDataArray[0].key;
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

    function _getRequestFromSyncLog(requestId, store) {
      return store.findByKey(requestId).then(function(synLogRecord) {
        if (synLogRecord) {
          return persistenceUtils.requestFromJSON(synLogRecord);
        }
      });
    };

    function _getSyncLogFindExpression() {
      var findExpression = {};
      var fieldsExpression = [];
      var sortExpression = [];
      sortExpression.push('key');
      findExpression.sort = sortExpression;
      fieldsExpression.push('key');
      fieldsExpression.push('value');
      findExpression.fields = fieldsExpression;

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
      var options = {index: ['key'], skipMetadata: true};
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

define('persist/impl/OfflineCache',["./defaultCacheHandler", "../persistenceStoreManager", "../persistenceUtils", "./logger"], function (cacheHandler, persistenceStoreManager, persistenceUtils, logger) {
  'use strict';

  /**
   * OfflineCache module.
   * Persistence Toolkit implementation of the standard
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Cache|Cache API}.
   * In additional to functionalities provided by the standard Cache API, this
   * OfflineCache also interacts with shredding methods for more fine-grain
   * caching. In addition to the Cache API, the OfflineCache also supports
   * the clear() function to clear the cache.
   * @module OfflineCache
   */

  /**
   * @export
   * @class OfflineCache
   * @classdesc  Persistence Toolkit implementation of the standard
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Cache|Cache API}.
   * @constructor
   * @param {String} name name of the cache
   * @param {String} store name for cache storage
   */
  function OfflineCache (name, storeName) {
    if (!name) {
      throw TypeError("A name must be provided to create an OfflineCache!");
    }
    if (!storeName) {
      throw TypeError("A persistence store must be provided to create an OfflineCache!");
    }

    this._name = name;
    this._storeName = storeName;
    this._store = null;

    // in-memory cache of all the keys in the store, for quick lookup.
    this._cacheKeys = [];
    this._createStorePromise;

    // the names of all the shredded stores associated
    // with this cache. We need them when clear() is
    // called since we need to clear all the shredded
    // stores as well.
    Object.defineProperty(this, '_STORE_NAMES_', {
      value: '_OPT_INT_SHRED_STORE_NAMES_',
      writable: false
    });
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
      return self.put(request, response);
    });
  };

  /**
   * Bulk operation of add.
   * @method
   * @name addAll
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

    return self._getCacheEntries(request, options).then(function (cacheEntries) {
      var ignoreVary = (options && options.ignoreVary);
      var matchEntry = _applyVaryForSingleMatch(ignoreVary, request, cacheEntries);
      if (!matchEntry) {
        return;
      }
      return _cacheEntryToResponse(request, matchEntry.value.responseData, options);
    }).catch(function(error) {
      logger.log('error finding match for request with url: ' + request.url);
      return;
    });
  };

  OfflineCache.prototype._getCacheEntries = function (request, options) {
    var self = this;
    return this._getStore().then(function(store) {
      var possibleKeys = cacheHandler.getMatchedCacheKeys(request, options, self._cacheKeys);
      if (possibleKeys && possibleKeys.length) {
        var promises = possibleKeys.map(function(key) {
          return store.findByKey(key).then(function(value) {
            return {key: key, value: value};
          });
        });
        return Promise.all(promises);
      } else {
        // get the cache entries based on search criteria.
        var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
        searchCriteria['fields'] = ['key', 'value'];
        return store.find(searchCriteria);
      }
    });
  };

  // find the response from the cache that matches the request based on
  // cache key value.
  OfflineCache.prototype._matchByKey = function (request, key, options) {
    return this._getStore().then(function(store) {
      return store.findByKey(key);
    }).then(function(cacheData) {
      if (!cacheData) {
        return;
      } else {
        return _cacheEntryToResponse(request, cacheData.responseData, options);
      }
    });
  };

  // internal match that only returns the needed metadata that includes:
  //   key: key of the cache entry in the cache store.
  //   resourceType: whether the response body is a collection type of resource
  //                 or single type of resourse
  //   resourceIdentifier: the resourse identifier value of the cached response.
  // This is called from queryHandler which needs the metadata information
  // to handle the query.
  OfflineCache.prototype._internalMatch = function (request, options) {
    // return key and headers. always skip search, always skip body.
    var self = this;
    return self._getStore().then(function(store) {
      var possibleKeys = cacheHandler.getMatchedCacheKeys(request, options, self._cacheKeys);
      if (possibleKeys && possibleKeys.length) {
        var promises = possibleKeys.map(function(key) {
          return store.findByKey(key);
        });
        return Promise.all(promises).then(function(results) {
          return results.map(function(result, index) {
            return {key: possibleKeys[index], value: result};
          });
        });
      } else {
        var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
        searchCriteria['fields'] = ['key', 'value'];
        return store.find(searchCriteria);
      }
    }).then(function (cacheEntries) {
      if (!cacheEntries) {
        return;
      }
      var ignoreVary = (options && options.ignoreVary);
      var matchEntry = _applyVaryForSingleMatch(ignoreVary, request, cacheEntries);
      if (matchEntry) {
        var returnValue = {key: matchEntry.key};
        var bodyAbstractText = matchEntry.value.responseData.bodyAbstract;
        if (bodyAbstractText) {
          try {
            var bodyAbstract = JSON.parse(bodyAbstractText);
            if (bodyAbstract) {
              if (bodyAbstract.length === 1 && bodyAbstract[0].resourceType === 'single') {
                returnValue.resourceType = 'single';
              } else {
                returnValue.resourceType = 'collection';
              }
            } else {
              returnValue.resourceType = 'unknown';
            }
          } catch (exp) {
            logger.log('internal error: invalid body abstract');
            return;
          }
        } else {
          // this is for the case where there is no thredder, thus
          // no bodyAbstract.
          returnValue.resourceType = 'unknown';
        }
        return returnValue;
      } else {
        return;
      }
    }).catch(function(error) {
      logger.log('error finding match internal');
      return;
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

    return this._getCacheEntries(request, options).then(function (cacheEntries) {
      var ignoreVary = (options && options.ignoreVary);
      var responseDataArray = _applyVaryForAllMatches(ignoreVary, request, cacheEntries);
      return _cacheEntriesToResponses(request, responseDataArray, options);
    }).catch(function(error) {
      logger.log('error finding all matches for request with url: ' + request.url);
      return;
    });
  };

  /**
   * Return the persistent store.
   * @returns {Object} The persistent store.
   */
  OfflineCache.prototype._getStore = function () {
    var self = this;
    if (self._store) {
      return Promise.resolve(self._store);
    }
    if (self._createStorePromise) {
      return self._createStorePromise;
    } else {
      var localStore;
      self._createStorePromise = persistenceStoreManager.openStore(self._storeName, {
        index: ["metadata.baseUrl", "metadata.url", "metadata.created"],
        skipMetadata: true
      }).then(function (store) {
        localStore = store;
        return store.keys();
      }).then(function (keys) {
        self._cacheKeys = keys;
        self._store = localStore;
        return self._store;
      });
      return self._createStorePromise;
    }
  }

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
       if (_applyVaryCheck(ignoreVary, request, cacheEntry.value)) {
         return cacheEntry;
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
      var filteredArray = cacheEntries.filter(_filterByVary(ignoreVary, request, 'value'));
      responseDataArray = filteredArray.map(function (entry) {return entry.value.responseData;});
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
        varyHeaderName = varyHeaderName.trim();
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
   * @param {Object} options options to control the behavior.
   * @param {boolean} options.ignoreBody default to false. If true, don't bother
   *                  building body from shredded data.
   * @returns {Promise} A promise that resolves to de-serialized Response object
   *                    from responseData. The promise is resolved to undefined
   *                    if responseData is undefined.
   */
  function _cacheEntryToResponse (request, responseData, options) {
    if (responseData) {
      logger.log("Offline Persistence Toolkit OfflineCache: Converting cached entry to Response object");
      var ignoreBody = false;
      if (options && options.ignoreBody) {
        ignoreBody = true;
      }
      var bodyAbstractText = responseData.bodyAbstract;

      return cacheHandler.constructResponse(responseData).then(function(response) {
        if (request.url != null && request.url.length > 0 &&
            response.headers.get('x-oracle-jscpt-response-url') == null) {
          response.headers.set('x-oracle-jscpt-response-url', request.url);
        }
        if (!ignoreBody && bodyAbstractText) {
          var bodyAbstract;
          try {
            bodyAbstract = JSON.parse(bodyAbstractText);
          } catch (exp) {
            logger.error("error parsing json " + bodyAbstractText);
          }
          return cacheHandler.fillResponseBodyWithShreddedData(request, bodyAbstract, response);
        } else {
          return response;
        }
      });
    } else {
      return Promise.resolve();
    }
  };

  function _cacheEntriesToResponses (request, responseDataArray, options) {
    if (!responseDataArray || !responseDataArray.length) {
      return Promise.resolve();
    } else {
      var promisesArray = responseDataArray.map(function (element) {
        return _cacheEntryToResponse(request, element, options);
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
    var cacheKey;

    return self._getStore().then(function() {
      return cacheHandler.constructRequestResponseCacheData(request, response);
    }).then(function(requestResponsePair) {
      var cacheStore = self._store;
      cacheKey = requestResponsePair.key;
      var hasShredder = cacheHandler.hasShredder(request);
      if (!hasShredder) {
        return cacheStore.upsert(requestResponsePair.key,
                                 requestResponsePair.metadata,
                                 requestResponsePair.value);
      } else {
        return cacheHandler.shredResponse(request, response).then(function(shreddedPayload) {
          if (!shreddedPayload) {
            // something is wrong with the shredding process. will not cache
            // the request/response pair.
            cacheKey = null;
            return;
          }
          self._updateShreddedStoreNames(shreddedPayload.map(function(entry) {
            return entry.name;
          }));
          var storePromises = [];
          requestResponsePair.value.responseData.bodyAbstract = _buildBodyAbstract(shreddedPayload);
          storePromises.push(cacheStore.upsert(requestResponsePair.key,
                                               requestResponsePair.metadata,
                                               requestResponsePair.value));
          storePromises.push(cacheHandler.cacheShreddedData(shreddedPayload));
          return Promise.all(storePromises);
        });
      }
    }).then(function() {
      if (cacheKey && self._cacheKeys.indexOf(cacheKey) < 0) {
        self._cacheKeys.push(cacheKey);
      }
    }).catch(function(error) {
      logger.error("error in cache.put() for Request with url: " + request.url);
    });
  };

  OfflineCache.prototype._updateShreddedStoreNames = function (storeNames) {
    if (!storeNames) {
      localStorage.setItem(this._STORE_NAMES_, "");
      return;
    }
    var storeageData = localStorage.getItem(this._STORE_NAMES_);
    if (!storeageData) {
      storeageData = JSON.stringify(storeNames);
    } else {
      var existingStoreNames;
      try {
        existingStoreNames = JSON.parse(storeageData);
      } catch(exc) {
        existingStoreNames = [];
      }
      storeNames.forEach(function (storeName) {
        if (existingStoreNames.indexOf(storeName) < 0) {
          existingStoreNames.push(storeName);
        }
      });
      storeageData = JSON.stringify(existingStoreNames);
    }
    localStorage.setItem(this._STORE_NAMES_, storeageData);
  };

  OfflineCache.prototype._getShreddedStoreNames = function () {
    var storeNames = [];
    var storeageData = localStorage.getItem(this._STORE_NAMES_);
    if (storeageData) {
      try {
        storeNames = JSON.parse(storeageData);
      } catch (exc) {
        logger.log("error getting shredded store names from localStorage");
      }
    }
    return storeNames;
  };

  function _buildBodyAbstract (shreddedPayload) {
    var bodyAbstract = shreddedPayload.map(function (element) {
      return {
        name: element.name,
        keys: element.keys ? element.keys.reduce(function(processedKeys, key) {
          if (key) {
            processedKeys.push(key);
          } else {
            logger.warn("should not have undefined key in the shredded data");
          }
          return processedKeys;
        }, []) : element.keys,
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
      logger.warn("Offline Persistence Toolkit OfflineCache: delete() request is a required parameter. To clear the cache, please call clear()");
      return Promise.resolve(false);
    }
    var self = this;

    return self._getStore().then(function(cacheStore) {
      if (cacheHandler.hasShredder(request)) {
        // shredder is configured for this request, needs to delete both
        // the cache entries and the shredded data entries.
        var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
        searchCriteria.fields = ['key', 'value'];
        var ignoreVary = (options && options.ignoreVary);
        return cacheStore.find(searchCriteria).then(function(dataArray) {
          if (dataArray && dataArray.length) {
            var filteredEntries = dataArray.filter(_filterByVary(ignoreVary, request, 'value'));
            var promises = [];
            filteredEntries.forEach(function(entry) {
              promises.push(cacheStore.removeByKey(entry.key));
              var index = self._cacheKeys.indexOf(entry.key);
              if (index >= 0) {
                self._cacheKeys.splice(index, 1);
              }
              if (entry.value.responseData.bodyAbstract && entry.value.responseData.bodyAbstract.length) {
                promises.push(cacheHandler.deleteShreddedData(JSON.parse(entry.value.responseData.bodyAbstract)));
              }
            });
            return Promise.all(promises).then(function() {
              logger.log("Offline Persistence Toolkit OfflineCache: all matching entries are deleted from both the cache store and the shredded store.");
              return true;
            })
          } else {
            return false;
          }
        });
      } else {
        // no shredder, deleting cache entries is sufficient.
        return _getStoreKeys(cacheStore, request, options).then(function(keysArray) {
          if (keysArray && keysArray.length) {
            var promisesArray = keysArray.map(function(key) {
              var index = self._cacheKeys.indexOf(key);
              if (index >= 0) {
                self._cacheKeys.splice(index, 1);
              }
              return cacheStore.removeByKey(key);
            });
            return Promise.all(promisesArray);
          } else {
            return [];
          }
        }).then(function(result) {
          if (result && result.length) {
            return true;
          } else {
            return false;
          }
        });
      }
    }).catch(function(error) {
      logger.log("Offline Persistence Toolkit OfflineCache: error occurred delete() for Request with url: " + request.url);
      return false;
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
   * @return {Promise} Returns a promise that resolves to an array of Cache keys (which are Request objects).
   */
  OfflineCache.prototype.keys = function (request, options) {
    if (request) {
      logger.log("Offline Persistence Toolkit OfflineCache: keys() for Request with url: " + request.url);
    } else {
      logger.log("Offline Persistence Toolkit OfflineCache: keys()");
    }
    var self = this;
    return self._getStore().then(function() {
      return _getStoreKeys(self._store, request, options);
    }).then(function(keysArray) {
      var requestsPromiseArray = [];
      keysArray.forEach(function(key) {
        requestsPromiseArray.push(self._store.findByKey(key).then(function(entry) {
          return persistenceUtils.requestFromJSON(entry.requestData);
        }));
      });
      return Promise.all(requestsPromiseArray);
    }).catch(function(error) {
      logger.log("Offline Persistence Toolkit OfflineCache: keys() error for Request with url: " + request.url);
      return [];
    });
  };

  function _getStoreKeys(store, request, options) {
    if (request) {
      // need to match with the passed-in request.
      var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
      searchCriteria.fields = ['key', 'value'];

      var ignoreVary = (options && options.ignoreVary);

      return store.find(searchCriteria).then(function (dataArray) {
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
      return store.keys();
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

    return self._getCacheEntries(request, options).then(function (cacheEntries) {
      var ignoreVary = (options && options.ignoreVary);
      var matchEntry = _applyVaryForSingleMatch(ignoreVary, request, cacheEntries);
      return matchEntry !== null;
    });
  };

  /**
   * Clear the cache.
   * @method
   * @name clear
   * @memberof! OfflineCache
   * @instance
   * @return {Promise} Returns a promise that resolves to true when the cache is cleared.
   * Will resolve to false if not all cache items were able to be cleared.
   */
  OfflineCache.prototype.clear = function () {
    logger.log("Offline Persistence Toolkit OfflineCache: clear()");

    var self = this;
    return self._getStore().then(function(cacheStore) {
      var deletePromiseArray = [];
      deletePromiseArray.push(cacheStore.delete());
      var storeNames = self._getShreddedStoreNames();
      storeNames.forEach(function(storeName) {
        deletePromiseArray.push(persistenceStoreManager.deleteStore(storeName));
        return;
      });
      return Promise.all(deletePromiseArray).then(function(results) {
        self._updateShreddedStoreNames(null);
        self._cacheKeys = [];
        return true;
      });
    }).catch(function(error) {
      logger.log("Offline Persistence Toolkit OfflineCache: clear() error");
    });
  };

  return OfflineCache;
});

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/impl/offlineCacheManager',['./OfflineCache', './logger'],
  function (OfflineCache, logger) {
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
     * @return {OfflineCache} Returns a cache that is ready to
     *                           use for offline support.
     */
    OfflineCacheManager.prototype.open = function (cacheName) {
      logger.log("Offline Persistence Toolkit OfflineCacheManager: open() with name: " + cacheName);

      var cache = this._caches[cacheName];
      if (!cache) {
        cache = new OfflineCache(cacheName, this._prefix + cacheName);
        this._caches[cacheName] = cache;
        this._cachesArray.push(cache);
      }
      return cache;
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
        return cache.clear().then(function () {
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
        this.append(name, value) // @XSSFalsePositive
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]) // @XSSFalsePositive
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]) // @XSSFalsePositive
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
        form.append(decodeURIComponent(name), decodeURIComponent(value)) // @XSSFalsePositive
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
        headers.append(key, value) // @XSSFalsePositive
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

define("persist/impl/fetch", function(){});

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/persistenceManager',['./impl/PersistenceXMLHttpRequest', './impl/PersistenceSyncManager', './impl/offlineCacheManager', './impl/logger', './impl/fetch'],
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
      _openOfflineCache(this);
      
      return Promise.resolve();
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
      self._cache = offlineCacheManager.open('systemCache');
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
     * caching. In addition to the Cache API, the OfflineCache also supports
     * the clear() function to clear the cache.
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
     * Clear the cache.
     * @method
     * @name clear
     * @memberof! OfflineCache
     * @instance
     * @return {Promise} Returns a promise that resolves to true when the cache is cleared.
     * Will resolve to false if not all cache items were able to be cleared.
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


