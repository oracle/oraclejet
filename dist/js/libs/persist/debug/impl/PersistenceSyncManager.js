/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['require', '../persistenceUtils', '../persistenceStoreManager', './defaultCacheHandler', './logger'],
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
                    var fetchFunc;
                    if (_isBrowserContext()) {
                      fetchFunc = fetch;
                    } else {
                      fetchFunc = self._browserFetch;
                    }
                    fetchFunc(request).then(function (response) {
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

    function _isBrowserContext() {
      return (typeof window != 'undefined') && (window != null);
    };

    return PersistenceSyncManager;
  });

