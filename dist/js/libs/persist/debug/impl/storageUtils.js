/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['./logger'], function (logger) {
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
      } else if (operator === '$nin') {
        return value.indexOf(itemValue) < 0;
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
      token === '$regex' || token === '$exists' || token === '$in' ||
      token === '$nin');
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

