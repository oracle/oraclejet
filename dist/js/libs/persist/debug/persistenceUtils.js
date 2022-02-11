/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['./impl/logger'], function (logger) {
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
    var isSVG = contentType && contentType.indexOf('image/svg+xml') !== -1;
    if (_isTextPayload(response.headers) || isSVG) {
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

  function _isTextPayload(headers, isAppJsonText) {

    var contentType = headers.get('Content-Type');

    // the response is considered text type when contentType value is of
    // pattern text/ or application/*json .
    if (isAppJsonText) {
      if (contentType &&
        (contentType.match(/.*text\/.*/) || 
        contentType.match(/.*application\/.*json.*/))) {
        return true;
      }
    } else {
      if (contentType &&
        (contentType.match(/.*text\/.*/))) {
        return true;
      }
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
        _isTextPayload(source.headers, true)) {
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
      id : Math.random().toString(36).replace(/[^a-z]+/g, '') // @RandomNumberOK - Only used to internally keep track of request URLs
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

  function _mapFindQuery(findQuery, dataMapping, sortingInput) {
    if (findQuery  && dataMapping) {
      var filterCriterion = _transformFindQuerySelectorToFilterCriterion(findQuery.selector);

      if (filterCriterion) {
        findQuery.selector = _transformFilterCriterionToFindQuerySelector(dataMapping.mapFilterCriterion(filterCriterion));
      }
    }
    if(sortingInput && sortingInput.length) {
      findQuery.sort = sortingInput;
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

