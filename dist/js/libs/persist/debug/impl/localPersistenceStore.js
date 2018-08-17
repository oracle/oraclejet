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
      var insertValue = {
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

    LocalPersistenceStore.prototype._extractKey = function (rawKey) {
      var prefix = this._name + this._version;
      var prefixLength = prefix.length;
      if (rawKey.indexOf(prefix) === 0) {
        return rawKey.slice(prefixLength);
      } else {
        return null;
      }
    };

    LocalPersistenceStore.prototype.keys = function () {
      logger.log("Offline Persistence Toolkit localPersistenceStore: keys()");
      var allRawKeys = Object.keys(localStorage);
      var allKeys = [];
      for (var index = 0; index < allRawKeys.length; index++) {
        var key = this._extractKey(allRawKeys[index]);
        if (key) {
          allKeys.push(key);
        }
      }
      return Promise.resolve(allKeys);
    };
    
    LocalPersistenceStore.prototype.getItem = function (key) {
      logger.log("Offline Persistence Toolkit localPersistenceStore: getItem() with key: " + key);
      var insertKey = this._createRawKey(key);
      var storeageData = localStorage.getItem(insertKey);
      if (storeageData) {
        return Promise.resolve(JSON.parse(storeageData));
      } else {
        return Promise.resolve();
      }
    };

    return LocalPersistenceStore;
  });