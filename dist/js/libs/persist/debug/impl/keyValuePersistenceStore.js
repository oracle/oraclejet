/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(["../PersistenceStore", "./storageUtils", "./logger"],
  function (PersistenceStore, storageUtils, logger) {
    'use strict';

    /**
     * @class KeyValuePersistenceStore
     * @abstract
     * @classdesc Abstract class that Persistence Stores which implement
     * simple key/value stores can extend from.
     *            
     * @extends KeyValuePersistenceStore
     * @constructor
     */
    var KeyValuePersistenceStore = function (name) {
      PersistenceStore.call(this, name);
    }

    KeyValuePersistenceStore.prototype = new PersistenceStore();

    KeyValuePersistenceStore.prototype.Init = function (options) {
      this._version = (options && options.version) || '0';
      return Promise.resolve();
    };
    
    /**
     * Must be implemented by subclasses of KeyValuePersistenceStore
     * @method
     * @name getItem
     * @memberof! KeyValuePersistenceStore
     * @instance
     * @param {string} key The key part of the composite key in the store to
     *                     search for store entry.
     * @return {Promise} Returns a Promise that resolves to the value and metadata
     *                   identified by the specified key
     */
    KeyValuePersistenceStore.prototype.getItem = function (key) {
      throw TypeError("failed in abstract function");
    };
    
    /**
     * Must be implemented by subclasses of KeyValuePersistenceStore
     * @method
     * @name removeByKey
     * @memberof! KeyValuePersistenceStore
     * @instance
     * @override
     * @param {string} key The key to identify the store entry that needs to be deleted.
     * @return {Promise} Returns a Promise that is resolved when the store entry
     *                   is deleted.
     */
    KeyValuePersistenceStore.prototype.removeByKey = function (key) {
      throw TypeError("failed in abstract function");
    };
    
    /**
     * Must be implemented by subclasses of KeyValuePersistenceStore
     * @method
     * @name keys
     * @memberof! KeyValuePersistenceStore
     * @instance
     * @override
     * @return {Promise} Returns a Promise that resolves to an array where each
     *                           element is the key of an entry in this store.
     *                           The Promise should resolve to an empty array if
     *                           there is no entries in the store.
     */
    KeyValuePersistenceStore.prototype.keys = function () {
      throw TypeError("failed in abstract function");
    };
    
    KeyValuePersistenceStore.prototype.findByKey = function (key) {
      logger.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: findByKey() with key: " + key);
      return this.getItem(key).then(function(storageData) {
        if (storageData) {
          return Promise.resolve(storageData.value);
        } else {
          return Promise.resolve();
        }
      });
    };

    KeyValuePersistenceStore.prototype.find = function (findExpression) {
      logger.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: find() with expression: " + JSON.stringify(findExpression));
      var self = this;
      var resultSet = [];
      var unsorted = [];
      var findExpression = findExpression || {};

      return this.keys().then(function (keys) {
        var itemPromiseArray = [];
        for (var index = 0; index < keys.length; index++) {
          var key = keys[index];
          if (key) {
            itemPromiseArray.push(function (itemKey) {
              return self.getItem(itemKey).then(function (item) {
                if (item) {
                  if (storageUtils.satisfy(findExpression.selector, item)) {
                    item.key = itemKey;
                    unsorted.push(item);
                  }
                }
              });
            }(key));
          }
        }

        return Promise.all(itemPromiseArray).then(function () {
          var sorted = self._sort(unsorted, findExpression.sort);
          for (var index = 0; index < sorted.length; index++) {
            resultSet.push(self._constructReturnObject(findExpression.fields, sorted[index]));
          }

          return Promise.resolve(resultSet);
        });
      });
    };

    KeyValuePersistenceStore.prototype._sort = function (unsorted, sortCriteria) {

      if (!unsorted || !unsorted.length ||
          !sortCriteria || !sortCriteria.length) {
        return unsorted;
      }

      return unsorted.sort(this._sortFunction(sortCriteria, this));
    };

    /**
     * Helper method that returns a function that can be used as callback
     * to Array.sort.
     * @method
     * @name _sortFunction
     * @memberof! KeyValuePersistenceStore
     * @param {object} sortCriteria Rule that defines how sort should be
     *                              performed.
     * @param {object} thisArg The object that should be used as this.
     * @returns {function} the function that is used as callback to
     *                     Array.sort.
     */
    KeyValuePersistenceStore.prototype._sortFunction = function (sortCriteria, thisArg) {
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

          var valueA = storageUtils.getValue(sortField, a);
          var valueB = storageUtils.getValue(sortField, b);
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


    /**
     * Helper function used by {@link find} that constructs an object out from
     * itemData based on fieldsExpression.
     * @method
     * @name _constructReturnObject
     * @memberof! KeyValuePersistenceStore
     * @param {Array} fieldsExpression An array of property names whose values
     *                                 should be included in the final contructed
     *                                 return object.
     * @param {object} itemData The original object to construct the return object
     *                        from.
     * @returns {object} the object that contains all the properties defined
     *                   in fieldsExpression array, the corresponding property
     *                   value is obtained from itemData.
     */
    KeyValuePersistenceStore.prototype._constructReturnObject = function (fieldsExpression, itemData) {
      var returnObject;
      if (!fieldsExpression) {
        returnObject = itemData.value;
      } else {
        returnObject = {};
        for (var index = 0; index < fieldsExpression.length; index++) {
          var currentObject = returnObject;
          var currentItemDataValue = itemData;
          var field = fieldsExpression[index];
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

    /**
     * Helper function that returns a callback function that can be used by
     * Array.map in {@link delete}.
     * @method
     * @name _removeByKeyMapCallback
     * @memberof! KeyValuePersistenceStore
     * @param {string} propertyName An array of Request
     * @return {function} Returns a function that can be used as a callback
     *                    by Array.map.
     */
    KeyValuePersistenceStore.prototype._removeByKeyMapCallback = function (propertyName) {
      var self = this;
      return function (element) {
        var valueToOperate;
        if (propertyName) {
          valueToOperate = element[propertyName];
        } else {
          valueToOperate = element;
        }
        return self.removeByKey(valueToOperate);
      };
    };
    
    /**
     * Delete the keys that satisfy the findExpression.
     * @method
     * @name delete
     * @memberof! KeyValuePersistenceStore
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
    KeyValuePersistenceStore.prototype.delete = function (deleteExpression) {
      logger.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: delete() with expression: " +  JSON.stringify(deleteExpression));
      var self = this;

      if (!deleteExpression) {
        return this.deleteAll();
      }

      var modExpression = deleteExpression;
      modExpression.fields = ['key'];
      return self.find(modExpression).then(function (searchResults) {
        if (searchResults && searchResults.length) {
          var promises = searchResults.map(self._removeByKeyMapCallback('key'), self);
          return Promise.all(promises);
        } else {
          return Promise.resolve();
        }
      });
    };
    
    KeyValuePersistenceStore.prototype.deleteAll = function () {
      logger.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: deleteAll()");
      var self = this;
      var promiseArray = [];
      var i;
      return this.keys().then(function (keys) {
        for (i = 0; i < keys.length; i++) {
          promiseArray.push(self.removeByKey(keys[i]));
        }
        return Promise.all(promiseArray);
      });
    };
    
    KeyValuePersistenceStore.prototype.upsert = function (key, metadata, value, expectedVersionIdentifier) {
      logger.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: upsert() for key: " + key);
      var self = this;
      return this.getItem(key).then(function (existingValue) {
        if (existingValue && expectedVersionIdentifier) {
          var existingVersionIdentifier = existingValue.metadata.versionIdentifier;
          if (existingVersionIdentifier !== expectedVersionIdentifier) {
            return Promise.reject({
              status: 409
            });
          } else {
            var newVersionIdentifier = metadata.versionIdentifier;
            if (newVersionIdentifier !== existingVersionIdentifier) {
              return self._insert(key, metadata, value);
            }
            return Promise.resolve();
          }
        } else {
          return self._insert(key, metadata, value);
        }
      });
    };
    
    KeyValuePersistenceStore.prototype.upsertAll = function (dataArray) {
      logger.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: upsertAll()");
      var promiseArray = [];
      for (var index = 0; index < dataArray.length; index++) {
        var data = dataArray[index];
        promiseArray.push(this.upsert(data.key, data.metadata, data.value, data.expectedVersionIndentifier));
      }
      return Promise.all(promiseArray);
    };

    return KeyValuePersistenceStore;
  });