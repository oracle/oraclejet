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


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/impl/keyValuePersistenceStore',["../PersistenceStore", "./storageUtils", "./logger"],
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
          var sorted = storageUtils.sortRows(unsorted, findExpression.sort);
          for (var index = 0; index < sorted.length; index++) {
            resultSet.push(self._constructReturnObject(findExpression.fields, sorted[index]));
          }

          return Promise.resolve(resultSet);
        });
      });
    };

    KeyValuePersistenceStore.prototype.updateKey = function(currentKey, newKey) {
      logger.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: updateKey() with currentKey: " + currentKey + " and new key: " + newKey);
      var self = this;
      return this.getItem(currentKey).then(function (existingValue) {
        if (existingValue) {
          return self._insert(newKey, existingValue.metadata, existingValue.value);
        } else {
          return Promise.reject("No existing key found to update");
        }
      }).then(function() {
        return self.removeByKey(currentKey);
      });
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
        returnObject = storageUtils.assembleObject(itemData, fieldsExpression);
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
/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/impl/arrayPersistenceStore',["./keyValuePersistenceStore", "./logger"],
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
/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/arrayPersistenceStoreFactory',["./impl/arrayPersistenceStore"], function (ArrayPersistenceStore) {
  'use strict';
  
  /**
   * @export
   * @class ArrayPersistenceStoreFactory
   * @classdesc PersistenceStoreFactory that creates an in-memory array backed 
   *            PersisteneStore instance.
   * @hideconstructor
   */

  var ArrayPersistenceStoreFactory = (function () {

    /**
     * @method
     * @name createPersistenceStore
     * @memberof! ArrayPersistenceStoreFactory
     * @export
     * @instance
     * @param {string} name The name to be associated with the store.
     * @param {object} [options] The configratuion options to be applied to the store.
     * @param {string} [options.version] The version of the store.
     * @return {Promise<ArrayPersistenceStore>} returns a Promise that is resolved to an array
     * backed PersistenceStore instance.
     */

    function _createPersistenceStore (name, options) {
      var store = new ArrayPersistenceStore(name);
      return store.Init(options).then(function () {
        return store;
      });
    };

    return {
      'createPersistenceStore': function (name, options) {
        return _createPersistenceStore(name, options);
      }
    };
  }());

  return ArrayPersistenceStoreFactory;
});
/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('persist/persistenceStoreFactory',[], function () {
  'use strict';
  
  /**
   * @export
   * @class PersistenceStoreFactory
   * @classdesc Contract for a PersistenceStoreFactory that provides a factory
   * method to create a PersisteneStore instance with the name and options. The
   * options is the same as the one used in
   * {@link persistenceStoreManager.openStore}. A default factory is provided
   * that implements this contract. Customers can register custom store factory
   * for creating persistence stores of their choice. 
   * @hideconstructor
   */

  var PersistenceStoreFactory = {
    
    /**
     * @method
     * @name createPersistenceStore
     * @memberof! PersistenceStoreFactory
     * @export
     * @instance
     * @param {string} name The name to be associated with the store.
     * @param {object} [options] The configratuion options to be applied to the store.
     * @param {string} [options.version] The version of the store.
     * @return {Promise<PersistenceStore>} returns a Promise that is resolved to a PersistenceStore
     *                   instance.
     */
    createPersistenceStore: function (name, options) {}
  };

  return PersistenceStoreFactory;
});
