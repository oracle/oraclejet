/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(["./keyValuePersistenceStore", "./logger"],
  function (keyValuePersistenceStore, logger) {
    'use strict';

    var LocalPersistenceStore = function (name) {
      keyValuePersistenceStore.call(this, name);
    }

    LocalPersistenceStore.prototype = new keyValuePersistenceStore();

    LocalPersistenceStore.prototype.Init = function (options) {
      this._version = (options && options.version) || '0';
      return Promise.resolve();
    };

    LocalPersistenceStore.prototype._insert = function (key, metadata, value) {
      var insertKey = this._createRawKey(key);
      // the key passed-in could be a non-string type, we save the original
      // key value as well so that we could return the same key back when asked
      // for it.
      var insertValue = {
        key: key,
        metadata: metadata,
        value: value
      };

      var valueToStore = JSON.stringify(insertValue);
      localStorage.setItem(insertKey, valueToStore);

      return Promise.resolve();
    };

    LocalPersistenceStore.prototype.removeByKey = function (key) {
      logger.log("Offline Persistence Toolkit localPersistenceStore: removeByKey() with key: " + key);
      var self = this;
      return this.findByKey(key).then(function(storageData) {
        if (storageData) {
          var insertKey = self._createRawKey(key);
          localStorage.removeItem(insertKey);
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
    };

    LocalPersistenceStore.prototype._createRawKey = function (key) {
      return this._name + this._version + key.toString();
    };

    LocalPersistenceStore.prototype.keys = function () {
      logger.log("Offline Persistence Toolkit localPersistenceStore: keys()");
      var allRawKeys = Object.keys(localStorage);
      var allKeys = [];
      for (var index = 0; index < allRawKeys.length; index++) {
        var prefix = this._name + this._version;
        var rawKey = allRawKeys[index];
        if (rawKey.indexOf(prefix) === 0) {
          // when asked for keys, we need to return the saved original key,
          // which might not be a string typed value.
          var storageData = localStorage.getItem(rawKey);
          if (storageData) {
            try {
              var item = JSON.parse(storageData);
              var key = item.key;
              if (key) {
                allKeys.push(key);
              }
               else {
                // pre 1.4.1 method of obtain the key values.
                allKeys.push(rawKey.slice(prefix.length));
              }
            } catch (err) {
              logger.log("data is not in valid JSON format: " + storageData);
              continue;
            }
          }
        }
      }
      return Promise.resolve(allKeys);
    };

    LocalPersistenceStore.prototype.getItem = function (key) {
      logger.log("Offline Persistence Toolkit localPersistenceStore: getItem() with key: " + key);
      var insertKey = this._createRawKey(key);
      var storeageData = localStorage.getItem(insertKey);
      if (storeageData) {
        try {
          var item = JSON.parse(storeageData);
          return Promise.resolve(item);
        } catch (err) {
          return Promise.resolve();
        }
      } else {
        return Promise.resolve();
      }
    };

    return LocalPersistenceStore;
  });
