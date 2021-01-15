(function() {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojmap', 'ojs/ojset', 'ojs/ojeventtarget', 'ojs/ojlogger'], function (ojMap, ojSet, ojeventtarget, Logger) {
  'use strict';

  ojMap = ojMap && Object.prototype.hasOwnProperty.call(ojMap, 'default') ? ojMap['default'] : ojMap;
  ojSet = ojSet && Object.prototype.hasOwnProperty.call(ojSet, 'default') ? ojSet['default'] : ojSet;
  /**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */

  /**
   * @preserve Copyright 2013 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */

  /* jslint browser: true,devel:true*/

  /**
   *
   * @since 10.0.0
   * @export
   * @final
   * @class JoiningDataProvider
   * @implements DataProvider
   * @classdesc
   * <p>JoiningDataProvider is a wrapping DataProvider that performs client-side joins
   * from a base data provider to other data providers and returns the joined records.
   * </p>
   * <p>Whenever possible, server-side joins are encouraged.  If FetchByKeysCapability.implementation
   * on joined DataProvider is not 'batchLookup', using JoiningDataProvider may encounter performance issue.
   * </p>
   * <p>
   * In addition to the base data provider's attributes, the fetch methods' parameter of a JoiningDataProvider
   *   can also take joined data providers' attributes in the 'attributes' option.  If no attributes are provided,
   *   all fields will be returned.
   * </p>
   * @param {DataProvider} baseDataProvider The base data provider.
   * <p>The metadata from this data provider will be the metadata for the JoiningDataProvider,
   * and all data from this data provider will be part of the data for the JoiningDataProvider.
   * </p>
   * <p>The resulting data for the JoiningDataProvider will be the set of attributes from the base data provider,
   * plus the set of attributes specified by the "joins" option.
   * Data returned by each data provider specified in the "joins" options will be merged into the JoiningDataProvider as an object.
   * </p>
   * @param {Object} options Options for the JoiningDataProvider.
   * @ojsignature [{target: "Type",
   *               value: "class JoiningDataProvider<K, D extends BD, BD> implements DataProvider<K, D>",
   *               genericParameters:[
   *                  {"name": "K", "description": "Type of key"},
   *                  {"name": "D", "description": "Type of returned data"},
   *                  {"name": "BD", "description": "Type of base data"}]},
   *               {target: "Type", value: "DataProvider<K, BD>", for: "baseDataProvider"},
   *               {target: "Type", value: "JoiningDataProvider.DataProviderOptions<D, BD>", for: "options"}]
   * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "FetchByKeysParameters",
   *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults", "DataMapping",
   *   "FetchListResult","FetchListParameters", "FetchAttribute"]}
   * @ojtsmodule
   * @ojtsexample
   * let employee = [
   *   { id: 1001, departmentId: 2001, managerId: 1011, firstName: "Chris", lastName: "Black", title: "Software Engineer" },
   *   { id: 1011, departmentId: 2002, managerId: 1021, firstName: "Jenifer", lastName: "Cooper", title: "Manager" },
   *   { id: 1021, departmentId: 2003, managerId: 1031, firstName: "Kurt", lastName: "Jonhson", title: "VP" },
   *   { id: 1022, departmentId: 2003, managerId: 1031, firstName: "Mike", lastName: "Chrison", title: "VP", manager: { firstName: "Guangping", lastName: null } }
   * ];
   * let department = [
   *   { id: 2001, locationId: 1, VPId: 1021, name: "JET" },
   *   { id: 2002, locationId: 1, VPId: 1022, name: "Visual Builder" }
   * ];
   * let location = [
   *   { id: 1, city: "Redwood City", state: "California" }
   * ];
   *
   * // initialize basic DataProvider
   * let dpEmployee = new ArrayDataProvider(employee, { keyAttributes: 'id' });
   * let dpDepartment = new ArrayDataProvider(department, { keyAttributes: 'id' });
   * let dpLocation = new ArrayDataProvider(location, { keyAttributes: 'id' });
   *
   * // join for department
   * let locJoin = { foreignKeyMapping: { foreignKey: 'locationId' }, joinedDataProvider: dpLocation };
   * let VPJoin = { foreignKeyMapping: { foreignKey: 'VPId' }, joinedDataProvider: dpEmployee };
   * let dpJoinDepartment = new JoiningDataProvider(dpDepartment,
   *   { joins: { location: locJoin, VP: VPJoin } });
   *
   * let deptJoin = { foreignKeyMapping: { foreignKey: 'departmentId' }, joinedDataProvider: dpJoinDepartment };
   * let mgrJoin = { foreignKeyMapping: { foreignKey: 'managerId' }, joinedDataProvider: dpEmployee };
   *
   * this.dpJoinEmployee = new JoiningDataProvider(dpEmployee,
   *   { joins: { manager: mgrJoin, department: deptJoin } });
   *
   * // Using joined dataprovider attributes for fetch methods
   * // The returned fields will include all fields from base data provider and department plus title from manager.
   * this.dpJoinEmployee.fetchByOffset({ offset: 0, attributes: ['manager.title'] });
   */

  /**
   * @typedef {Object} JoiningDataProvider.DataProviderOptions
   * @property {Object} joins - <p>A map of attribute name to information about DataProviders to join in.</p>
   * <p>The returned data for each row from the joined DataProvider will be merged as an object under the attribute name in the JoiningDataProvider.
   * </p>
   * @ojsignature [{target: "Type", value: "<D, BD>", for: "genericTypeParameters"},
   *               {target: "Type", value: "Record<keyof Omit<D, keyof BD>, DataProviderJoinInfo<D, any, any>>", for: "joins"}]
   */

  /**
   * @inheritdoc
   * @memberof JoiningDataProvider
   * @instance
   * @method
   * @name containsKeys
   */

  /**
   * @inheritdoc
   * @memberof JoiningDataProvider
   * @instance
   * @method
   * @name createOptimizedKeySet
   */

  /**
   * @inheritdoc
   * @memberof JoiningDataProvider
   * @instance
   * @method
   * @name createOptimizedKeyMap
   */

  /**
   * @inheritdoc
   * @memberof JoiningDataProvider
   * @instance
   * @method
   * @name fetchFirst
   */

  /**
   * @inheritdoc
   * @memberof JoiningDataProvider
   * @instance
   * @method
   * @name fetchByKeys
   */

  /**
   * @inheritdoc
   * @memberof JoiningDataProvider
   * @instance
   * @method
   * @name fetchByOffset
   */

  /**
   * @inheritdoc
   * @memberof JoiningDataProvider
   * @instance
   * @method
   * @name getCapability
   */

  /**
   * @inheritdoc
   * @memberof JoiningDataProvider
   * @instance
   * @method
   * @name getTotalSize
   */

  /**
   * @inheritdoc
   * @memberof JoiningDataProvider
   * @instance
   * @method
   * @name isEmpty
   */

  /**
   * @inheritdoc
   * @memberof JoiningDataProvider
   * @instance
   * @method
   * @name addEventListener
   */

  /**
   * @inheritdoc
   * @memberof JoiningDataProvider
   * @instance
   * @method
   * @name removeEventListener
   */

  /**
   * @inheritdoc
   * @memberof JoiningDataProvider
   * @instance
   * @method
   * @name dispatchEvent
   */

  /**
   * End of jsdoc
   */

  var JoiningDataProvider = /*#__PURE__*/function () {
    function JoiningDataProvider(baseDataProvider, options) {
      _classCallCheck(this, JoiningDataProvider);

      this.baseDataProvider = baseDataProvider;
      this.options = options;
      this._mapJoinAttributes = new Map();
      this._fks = [];
      this._transform = [];
      this._joinDPs = [];

      this.JoiningAsyncIterable = /*#__PURE__*/function () {
        function _class(_parent, params, _asyncIterator) {
          var _this = this;

          _classCallCheck(this, _class);

          this._parent = _parent;
          this.params = params;
          this._asyncIterator = _asyncIterator;

          this[Symbol.asyncIterator] = function () {
            return new _this._parent.JoiningAsyncIterator(_this._parent, _this._asyncIterator, _this.params);
          };
        }

        return _class;
      }();

      this.JoiningAsyncIterator = /*#__PURE__*/function () {
        function _class2(_parent, _baseIterator, _params) {
          _classCallCheck(this, _class2);

          this._parent = _parent;
          this._baseIterator = _baseIterator;
          this._params = _params;
        }

        _createClass(_class2, [{
          key: "_fetchNext",
          value: function _fetchNext() {
            return this._baseIterator.next().then(function (result) {
              return result;
            });
          }
        }, {
          key: 'next',
          value: function next() {
            var _this2 = this;

            var promise = this._fetchNext();

            return promise.then(function (baseResult) {
              if (baseResult != undefined && baseResult.value != undefined && _this2._parent.options != undefined) {
                return _this2._parent._joiningData(baseResult.value.data, _this2._parent.options).then(function (joinedData) {
                  baseResult.value.data = joinedData;
                  return baseResult;
                });
              } else {
                return baseResult;
              }
            });
          }
        }]);

        return _class2;
      }();

      this.FetchByKeysResults = /*#__PURE__*/function () {
        function _class3(_parent, fetchParameters, results) {
          _classCallCheck(this, _class3);

          this._parent = _parent;
          this.fetchParameters = fetchParameters;
          this.results = results;
          this[JoiningDataProvider._FETCHPARAMETERS] = fetchParameters;
          this[JoiningDataProvider._RESULTS] = results;
        }

        return _class3;
      }();

      this.FetchByOffsetResults = /*#__PURE__*/function () {
        function _class4(_parent, fetchParameters, results, done) {
          _classCallCheck(this, _class4);

          this._parent = _parent;
          this.fetchParameters = fetchParameters;
          this.results = results;
          this.done = done;
          this[JoiningDataProvider._FETCHPARAMETERS] = fetchParameters;
          this[JoiningDataProvider._RESULTS] = results;
          this[JoiningDataProvider._DONE] = done;
        }

        return _class4;
      }();

      this.Item = /*#__PURE__*/function () {
        function _class5(_parent, metadata, data) {
          _classCallCheck(this, _class5);

          this._parent = _parent;
          this.metadata = metadata;
          this.data = data;
          this[JoiningDataProvider._METADATA] = metadata;
          this[JoiningDataProvider._DATA] = data;
        }

        return _class5;
      }();

      this.ItemMetadata = /*#__PURE__*/function () {
        function _class6(_parent, key) {
          _classCallCheck(this, _class6);

          this._parent = _parent;
          this.key = key;
          this[JoiningDataProvider._KEY] = key;
        }

        return _class6;
      }();

      this._getJoinSpec(options);
    }

    _createClass(JoiningDataProvider, [{
      key: "fetchFirst",
      value: function fetchFirst(params) {
        var baseParams = params;

        if (params && params.attributes) {
          baseParams.attributes = this._seperateBaseJoinAttributes(params);
        } else {
          this._mapJoinAttributes = null;
        }

        var asyncIterable = this.baseDataProvider.fetchFirst(baseParams);
        return new this.JoiningAsyncIterable(this, params, asyncIterable[Symbol.asyncIterator]());
      }
    }, {
      key: "fetchByKeys",
      value: function fetchByKeys(params) {
        var _this3 = this;

        var baseParams = params;

        if (params && params.attributes) {
          var baseAttributes = this._seperateBaseJoinAttributes(params);

          baseParams = {
            keys: params.keys,
            attributes: baseAttributes,
            scope: params.scope
          };
        } else {
          this._mapJoinAttributes = null;
        }

        return this.baseDataProvider.fetchByKeys(baseParams).then(function (baseResults) {
          var results = new ojMap();

          if (baseResults != undefined && baseResults.results != undefined) {
            var data = [];
            var metaData = [];
            var keyValues = [];
            var i = 0;
            params.keys.forEach(function (key) {
              keyValues[i++] = key;
            });

            _this3._fetchByKeyResultsToArray(baseResults, keyValues, metaData, data);

            return _this3._joiningData(data, _this3.options).then(function (joinData) {
              i = 0;
              params.keys.forEach(function (key) {
                results.set(key, new _this3.Item(_this3, metaData[i], joinData[i]));
                i++;
              });
              return new _this3.FetchByKeysResults(_this3, params, results);
            });
          }
        });
      }
    }, {
      key: "fetchByOffset",
      value: function fetchByOffset(params) {
        var _this4 = this;

        var baseParams = params;

        if (params && params.attributes) {
          var baseAttributes = this._seperateBaseJoinAttributes(params);

          baseParams = {
            attributes: baseAttributes,
            clientId: params.clientId,
            filterCriterion: params.filterCriterion,
            offset: params.offset,
            size: params.size,
            sortCriteria: params.sortCriteria
          };
        } else {
          this._mapJoinAttributes = null;
        }

        return this.baseDataProvider.fetchByOffset(baseParams).then(function (baseResult) {
          if (baseResult.results != undefined) {
            var metaData = [];
            var data = [];

            for (var i = 0; i < baseResult.results.length; i++) {
              metaData[i] = baseResult.results[i].metadata;
              data[i] = baseResult.results[i].data;
            }

            var resultArray = [];
            return _this4._joiningData(data, _this4.options).then(function (joinData) {
              for (var _i = 0; _i < baseResult.results.length; _i++) {
                resultArray[_i] = new _this4.Item(_this4, metaData[_i], joinData[_i]);
              }

              return new _this4.FetchByOffsetResults(_this4, params, resultArray, baseResult.done);
            });
          }
        });
      }
    }, {
      key: "containsKeys",
      value: function containsKeys(params) {
        return this.baseDataProvider.containsKeys(params).then(function (baseResults) {
          return baseResults;
        });
      }
    }, {
      key: "getTotalSize",
      value: function getTotalSize() {
        return this.baseDataProvider.getTotalSize().then(function (totalSize) {
          return totalSize;
        });
      }
    }, {
      key: "isEmpty",
      value: function isEmpty() {
        var isEmpty = this.baseDataProvider.isEmpty();
        return isEmpty;
      }
    }, {
      key: "getCapability",
      value: function getCapability(capabilityName) {
        if (capabilityName == 'sort' || capabilityName == 'filter') {
          return null;
        } else {
          return this.baseDataProvider.getCapability(capabilityName);
        }
      }
    }, {
      key: "createOptimizedKeySet",
      value: function createOptimizedKeySet(initialSet) {
        return new ojSet(initialSet);
      }
    }, {
      key: "createOptimizedKeyMap",
      value: function createOptimizedKeyMap(initialMap) {
        if (initialMap) {
          var map = new ojMap();
          initialMap.forEach(function (value, key) {
            map.set(key, value);
          });
          return map;
        }

        return new ojMap();
      }
    }, {
      key: "_getJoinSpec",
      value: function _getJoinSpec(options) {
        var joins = options.joins;
        this._joinAlias = Object.keys(joins);

        for (var i = 0; i < this._joinAlias.length; i++) {
          var alias = this._joinAlias[i];
          var joinInfo = joins[alias];

          if (joinInfo != undefined) {
            if (joinInfo.foreignKeyMapping.foreignKey != undefined) {
              this._fks[i] = joinInfo.foreignKeyMapping.foreignKey;
            } else if (joinInfo.foreignKeyMapping.foreignKeys != undefined) {
              this._fks[i] = joinInfo.foreignKeyMapping.foreignKeys;
            } else {
              this._fks[i] = null;
            }

            if (joinInfo.foreignKeyMapping.transform != undefined) {
              this._transform[i] = joinInfo.foreignKeyMapping.transform;
            } else {
              this._transform[i] = null;
            }

            this._joinDPs[i] = joinInfo.joinedDataProvider;
          } else {
            this._fks[i] = null;
            this._joinDPs[i] = null;
          }
        }
      }
    }, {
      key: "_seperateBaseJoinAttributes",
      value: function _seperateBaseJoinAttributes(params) {
        this._mapJoinAttributes = new Map();
        var origAttr = params.attributes;
        var iBase = 0;
        var baseAttributes = [];

        for (var i = 0; i < origAttr.length; i++) {
          var attr = origAttr[i];
          var alias = void 0;
          var attributes = void 0;

          if (typeof attr == 'string' || attr instanceof String) {
            alias = attr;
            attributes = attr;
          } else {
            alias = attr.name;
            attributes = attr.attributes;
          }

          var bJoinAlias = false;

          for (var j = 0; this._joinAlias != null && j < this._joinAlias.length; j++) {
            if (alias == this._joinAlias[j]) {
              bJoinAlias = true;
              break;
            }
          }

          if (bJoinAlias) {
            if (this._mapJoinAttributes.has(alias)) {
              var joinAttrs = this._mapJoinAttributes.get(alias);

              if (attributes != undefined) {
                if (joinAttrs == undefined) {
                  joinAttrs = [];
                }

                joinAttrs.concat(attributes);

                this._mapJoinAttributes.set(alias, joinAttrs);
              }
            } else {
              this._mapJoinAttributes.set(alias, attributes);
            }
          } else {
            baseAttributes[iBase++] = attributes;
          }
        }

        for (var k = 0; this._fks != null && k < this._fks.length; k++) {
          var fk = this._fks[k];

          if (!baseAttributes.includes(fk)) {
            if (fk instanceof Array) {
              baseAttributes = baseAttributes.concat(fk);
            } else {
              baseAttributes[iBase++] = this._fks[k];
            }
          }
        }

        return baseAttributes;
      }
    }, {
      key: "_joiningData",
      value: function _joiningData(baseData, options) {
        var _this5 = this;

        if (baseData == undefined || baseData.length == 0 || options.joins == undefined) {
          return Promise.resolve(baseData);
        }

        var fkValues = [];
        var promises = [];

        this._getFKValues(baseData, this._fks, this._transform, fkValues);

        for (var i = 0; i < this._joinAlias.length; i++) {
          var joinDP = this._joinDPs[i];
          var capability = joinDP.getCapability('fetchByKeys');

          if (capability == null || capability.implementation != 'batchLookup') {
            Logger.warn("Warning: The joined data provider named '" + this._joinAlias[i] + "' does not support 'batchLookup' implementation for FetchByKeysCapability.");
          }

          if (joinDP == null) {
            promises[i] = null;
          } else {
            if (this._mapJoinAttributes == null) {
              promises[i] = joinDP.fetchByKeys({
                keys: fkValues[i]
              });
            } else if (!this._mapJoinAttributes.has(this._joinAlias[i])) {
              promises[i] = null;
            } else {
              var attr = this._mapJoinAttributes.get(this._joinAlias[i]);

              promises[i] = joinDP.fetchByKeys({
                keys: fkValues[i],
                attributes: attr
              });
            }
          }
        }

        return Promise.all(promises).then(function (results) {
          var resultMetadata = [];
          var resultData = [];

          for (var _i2 = 0; results != null && _i2 < results.length; _i2++) {
            if (_this5._mapJoinAttributes == null || _this5._mapJoinAttributes.has(_this5._joinAlias[_i2])) {
              _this5._fetchByKeyResultsToArray(results[_i2], fkValues[_i2], resultMetadata, resultData);

              _this5._assignAliasData(baseData, _this5._joinAlias[_i2], resultData);
            }
          }

          return baseData;
        });
      }
    }, {
      key: "_getFKValues",
      value: function _getFKValues(baseData, fks, transform, fkValues) {
        for (var i = 0; i < fks.length; i++) {
          var vals = [];

          for (var j = 0; j < baseData.length; j++) {
            if (baseData[j] != null && fks[i] != null) {
              if (transform != undefined && transform[i] != undefined) {
                var transformParam = new Object();

                if (fks[i] instanceof Array) {
                  for (var k = 0; k < fks[i].length; k++) {
                    transformParam[fks[i][k]] = baseData[j][fks[i][k]];
                  }
                } else {
                  transformParam[fks[i]] = baseData[j][fks[i]];
                }

                vals[j] = transform[i](transformParam);
              } else {
                if (fks[i] instanceof Array) {
                  vals[j] = [];

                  for (var _k = 0; _k < fks[i].length; _k++) {
                    vals[j][_k] = baseData[j][fks[i][_k]];
                  }
                } else {
                  vals[j] = baseData[j][fks[i]];
                }
              }
            } else {
              vals[j] = null;
            }
          }

          fkValues[i] = vals;
        }
      }
    }, {
      key: "_fetchByKeyResultsToArray",
      value: function _fetchByKeyResultsToArray(result, keyValues, metaData, data) {
        if (result != undefined && result.results != undefined && result.results.size != 0) {
          for (var i = 0; i < keyValues.length; i++) {
            var item = result.results.get(keyValues[i]);

            if (item != undefined) {
              metaData[i] = item.metadata;
              data[i] = item.data;
            } else {
              metaData[i] = null;
              data[i] = null;
            }
          }
        }
      }
    }, {
      key: "_assignAliasData",
      value: function _assignAliasData(baseData, alias, aliasData) {
        for (var i = 0; i < baseData.length; i++) {
          if (baseData[i] != null && aliasData != undefined) {
            baseData[i][alias] = aliasData[i];
          }
        }
      }
    }]);

    return JoiningDataProvider;
  }();

  JoiningDataProvider._REFRESH = 'refresh';
  JoiningDataProvider._MUTATE = 'mutate';
  JoiningDataProvider._ADDEVENTLISTENER = 'addEventListener';
  JoiningDataProvider._DATA = 'data';
  JoiningDataProvider._METADATA = 'metadata';
  JoiningDataProvider._FETCHPARAMETERS = 'fetchParameters';
  JoiningDataProvider._RESULTS = 'results';
  JoiningDataProvider._DONE = 'done';
  JoiningDataProvider._KEY = 'key';
  ojeventtarget.EventTargetMixin.applyMixin(JoiningDataProvider);
  return JoiningDataProvider;
});

}())