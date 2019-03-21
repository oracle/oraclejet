/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(["./keyValuePersistenceStore", "./logger"],
  function (keyValuePersistenceStore, logger) {
    'use strict';

    var ArrayPersistenceStore = function (name) {
      keyValuePersistenceStore.call(this, name);
    }

    ArrayPersistenceStore.prototype = new keyValuePersistenceStore();

    ArrayPersistenceStore.prototype.Init = function (options) {
      this._version = (options && options.version) || '0';
      this._arrayStore = {};
      return Promise.resolve();
    };

    ArrayPersistenceStore.prototype._insert = function (key, metadata, value) {
      var insertValue = {
        metadata: metadata,
        value: value
      };
      this._arrayStore[key] = insertValue;
      
      return Promise.resolve();
    };

    ArrayPersistenceStore.prototype.removeByKey = function (key) {
      logger.log("Offline Persistence Toolkit arrayPersistenceStore: removeByKey() with key: " + key);
      var self = this;
      return this.findByKey(key).then(function(storageData) {
        if (storageData) {
          delete self._arrayStore[key];
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
    };

    ArrayPersistenceStore.prototype.keys = function () {
      logger.log("Offline Persistence Toolkit arrayPersistenceStore: keys()");
      var allKeys = Object.keys(this._arrayStore);
      return Promise.resolve(allKeys);
    };
    
    ArrayPersistenceStore.prototype.getItem = function (key) {
      logger.log("Offline Persistence Toolkit arrayPersistenceStore: getItem() with key: " + key);
      var storeageData = this._arrayStore[key];
      if (storeageData) {
        return Promise.resolve(storeageData);
      } else {
        return Promise.resolve();
      }
    };

    return ArrayPersistenceStore;
  });