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
   * 1. XMLHttpRequest.upload is supported with the following workarounds as the Fetch API
   *    does not support progress yet:
   *    - Since Fetch API does not have fetch progress, all progress events
   *      from OPT will have lengthConputable = false
   *    - Progress event will only fire once after load start and none after that
   * 2. XMLHttpRequest.abort() is supported with the following workaround:
   *    - Fetch Abort is now possible with abortController API
   *    - based on the abortController API so it depends on the browser support.
   *  !!- abort() is not supported on IE11 and will result in a no op due to lack of AbortController API
   * 3. XMLHttpRequest.timeout() is supported with the following workaround:
   *    - native timeout results in an abort of the request
   *      so OPT XHR timeout also requires AbortController API support
   *  !!- On IE11 the request will timeout but the request will not be aborted due to lack of
   *      AbortController API support. This means the request is still processing after the timeout event is triggered.
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
      enumerable: true,
      writable: true
    });
    // used for checking for how readystatechange should behave
    // when timedout, the readystate is DONE but load should not fire.
    Object.defineProperty(this, '_isTimedOut', {
      value: false,
      enumerable: true,
      writable: true
    });
    Object.defineProperty(this, 'upload', {
      value: new PersistenceXMLHttpRequestUpload(),
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
    // stores the abortController for later use
    Object.defineProperty(this, '_abortController', {
      value: null,
      writable: true
    });
    // Checks to see if there data to be uploaded
    // if no data, then there is no need to fire upload progress events
    Object.defineProperty(this, '_isUpload', {
      value: false,
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
    this._isTimedOut = false;
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

    // if the AbortController api is supported by browser
    // a signal is created to abort the fetch api
    if (AbortController) {
      this._abortController = new AbortController();
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
      // checks to make sure that there is data for upload events
      // uses a boolean value
      this._isUpload = !!requestInit.body;
      var self = this;
      // if abortController is not supported, pass a empty option object
      var options = {};
      if (self._abortController){
        options.signal = self._abortController.signal
      }
      try {
        // check if there is a timeout value set and is a number that is not zero
        if (self.timeout && typeof self.timeout === 'number') {
          _fetchWithTimeout(request,options, self).then(function (response) {
            _processResponse(self, request, response);
          }).catch(function (error) {
            // checks the error to check that it is a timeout error to determine the type of event to dispatch
            if (error && error.name && error.name === 'TimeoutError') {
              self._isTimedOut = true
              _readyStateChange(self, PersistenceXMLHttpRequest.DONE);
            } else {
              self.dispatchEvent(new PersistenceXMLHttpRequestEvent('error', false, false, self));
            }
          })
          // if no timeout is set, proceed with original response
        } else {
          fetch(request, options).then(function (response) {
            _processResponse(self, request, response);
          }, function (error) {
            // since aborting a fetch will cause an AbortError, the abort event is dispatched here
            // instead of the abort() function call.
            if (error && error.name && error.name === 'AbortError') {
              logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: Request Timedout: ' + request.url);
              self.dispatchEvent(new PersistenceXMLHttpRequestEvent('abort', false, false, self));
            }else {
              self.dispatchEvent(new PersistenceXMLHttpRequestEvent('error', false, false, self));
            }
          });
        }
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
    logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: abort()');
    // check to see if _abortSignal is set before calling it
    // if there is no abortController Support, fire the abort event here
    if (this._abortController) {
      this._abortController.abort()
    } else {
      this.dispatchEvent(new PersistenceXMLHttpRequestEvent('abort', false, false, self));
    }
    // XHR abort sets readyState, status, and statusText to UNSENT. Abort does not invoke readyStateChange event.
    this._readyState = PersistenceXMLHttpRequest.UNSENT
    this._status = 0
    this._statusText = ''
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
    // since upload events mostly follow the requests events and theres no API to currently track upload status,
    // upload events are triggered here in the request dispatchEvent function if there is data to upload
    switch (type) {
      case 'abort':
        if (this._isUpload) {
          this.upload._dispatchEvent(new PersistenceXMLHttpRequestProgressEvent('abort', false, false, self.upload))
        }
        if (this.onabort) {
          this.onabort(event);
        }
        // since abort does not set ready state to done, loadend event is not triggered
        // the same way that the other events are triggered and must be triggered manually
        self.dispatchEvent(new PersistenceXMLHttpRequestEvent('loadend', false, false, self));
        break;
      case 'error':
        if (this._isUpload) {
          this.upload._dispatchEvent(new PersistenceXMLHttpRequestProgressEvent('error', false, false, self.upload))
        }
        if (this.onerror) {
          this.onerror(event);
        }
        break;
      case 'load':
        if (this._isUpload) {
          this.upload._dispatchEvent(new PersistenceXMLHttpRequestProgressEvent('load', false, false, self.upload))
        }
        if (this.onload) {
          this.onload(event);
        }
        break;
      case 'loadend':
        if (this._isUpload) {
          this.upload._dispatchEvent(new PersistenceXMLHttpRequestProgressEvent('loadend', false, false, self.upload))
        }
        if (this.onloadend) {
          this.onloadend(event);
        }
        break;
      case 'loadstart':
        if (this._isUpload) {
          this.upload._dispatchEvent(new PersistenceXMLHttpRequestProgressEvent('loadstart', false, false, self.upload))
        }
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
        if (this._isUpload) {
          this.upload._dispatchEvent(new PersistenceXMLHttpRequestProgressEvent('timeout', false, false, self.upload))
        }
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
    // check if readyState was set to Done due to a timeout
    if(self._isTimedOut == true &&
      self._readyState == PersistenceXMLHttpRequest.DONE){
      self.dispatchEvent(new PersistenceXMLHttpRequestEvent('timeout', false, false, self));
      self.dispatchEvent(new PersistenceXMLHttpRequestEvent('loadend', false, false, self));
      self._isTimedOut = false;
    } else if (self._readyState == PersistenceXMLHttpRequest.DONE) {
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
        if (absoluteUrlOrigin.toLowerCase().indexOf('file:') === 0) {
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

    if (absoluteUrlOrigin && absoluteUrlOrigin.toLowerCase().indexOf('file:') === 0) {
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
      var parseMultipartForm = function (data) {
        var responseText = '';
        var pairs = persistenceUtils.parseMultipartFormData(data, contentType);
        pairs.forEach(function (pair) {
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

  // Timeout Helper Function
  function _fetchWithTimeout(request, option, xhr) {
    return new Promise(function (resolve, reject) {
      logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: Calling fetchWithTimeout');
      var timeoutError = new Error('Fetch Timeout')
      timeoutError.name = 'TimeoutError'
      // set timeout function based on timeout specified
      // rejects with timeout error if timeout is reached.
      var _timer = setTimeout(
        function () {
          logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequest: Request Timedout: ' + request.url);
          reject(timeoutError)
          if (xhr._abortController){
            xhr._abortController.abort()
          }
        }, xhr.timeout
      );
      // call fetch API as normal but with the abort signal passed in
      fetch(request, option).then(
        function (response) { resolve(response) },
        function (error) { reject(error) }
        // added a .finally() to clear the timeout that was previously set regardless fetch response.
      ).finally(function () { clearTimeout(_timer) });
    })
  }


  // XHR upload constructor and its event listeners that are seperate from the request events.
  function PersistenceXMLHttpRequestUpload() {
    this.onabort = null;
    this.onerror = null;
    this.onload = null;
    this.onloadend = null;
    this.onloadstart = null;
    this.onprogress = null;
    this.ontimeout = null;
    this._eventListeners = [];
  }

  PersistenceXMLHttpRequestUpload.prototype.addEventListener = function (eventType, listener) {
    logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequestUpload: addEventListener() for event type: ' + eventType);
    this._eventListeners[eventType] = this._eventListeners[eventType] || [];
    this._eventListeners[eventType].push(listener);
  };

  PersistenceXMLHttpRequestUpload.prototype.removeEventListener = function (eventType, listener) {
    logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequestUpload: removeEventListener() for event type: ' + eventType);
    var listeners = this._eventListeners[eventType] || [];
    var i;
    var listenersCount = listeners.length;
    for (i = 0; i < listenersCount; i++) {
      if (listeners[i] == listener) {
        return listeners.splice(i, 1);
      }
    }
  };

  PersistenceXMLHttpRequestUpload.prototype._dispatchEvent = function (event) {
    logger.log('Offline Persistence Toolkit PersistenceXMLHttpRequestUpload: dispatchEvent() for event type: ' + event.type);
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
    switch (type) {
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
        // call progress at least once per http spec
        // minor quirk between ours and real xhr is that if an event is aborted/timedout immediately
        // a progress event is not fired which is against spec. so ours is technically more correct per spec.
        this._dispatchEvent(new PersistenceXMLHttpRequestProgressEvent('progress', false, false, self))
        break;
      case 'progress':
        if (this.onprogress) {
          this.onprogress(event);
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
  // progress event that contains the lengthComputable, loaded, total values
  // lengthComputable is always set to false since its not being computed
  function PersistenceXMLHttpRequestProgressEvent(type, bubbles, cancelable, target) {
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
    Object.defineProperty(this, 'lengthComputable', {
      value: false,
      enumerable: true
    });
    Object.defineProperty(this, 'loaded', {
      value: 0,
      enumerable: true
    });
    Object.defineProperty(this, 'total', {
      value: 0,
      enumerable: true
    });
  };

  PersistenceXMLHttpRequestProgressEvent.prototype.stopPropagation = function () {
    // This is not a DOM Event
  };

  PersistenceXMLHttpRequestProgressEvent.prototype.preventDefault = function () {
    this['defaultPrevented'] = true;
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
