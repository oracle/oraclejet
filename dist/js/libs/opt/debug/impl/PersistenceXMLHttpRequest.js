/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['../persistenceUtils', './logger'], function (persistenceUtils, logger) {
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
