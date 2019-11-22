/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojdataprovideradapter-base', 'ojs/ojmap'], function(oj, $, DataSourceAdapter, KeyMap)
{
  "use strict";
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TreeDataSourceAdapter =
/*#__PURE__*/
function (_DataSourceAdapter) {
  _inherits(TreeDataSourceAdapter, _DataSourceAdapter);

  function TreeDataSourceAdapter(treeDataSource) {
    var _this;

    _classCallCheck(this, TreeDataSourceAdapter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TreeDataSourceAdapter).call(this, treeDataSource));
    _this.treeDataSource = treeDataSource;

    _this._addTreeDataSourceEventListeners();

    _this._parentKey = null;
    _this._parentInfoMap = new KeyMap();
    return _this;
  }

  _createClass(TreeDataSourceAdapter, [{
    key: "destroy",
    value: function destroy() {
      this._removeTreeDataSourceEventListeners();
    }
  }, {
    key: "getChildDataProvider",
    value: function getChildDataProvider(parentKey) {
      if (this._parentInfoMap.has(parentKey)) {
        var childDataProvider = new TreeDataSourceAdapter(this.treeDataSource);
        childDataProvider._parentKey = parentKey;
        childDataProvider._parentInfoMap = this._parentInfoMap;
        return childDataProvider;
      } // todo: for the component use case, this is sufficient since parentKey should have been
      // fetched already, otherwise, we would probably need a private contract in TreeDataSource
      // to handle the case when parentKey has not been fetched yet


      return null;
    }
  }, {
    key: "fetchFirst",
    value: function fetchFirst(params) {
      return new this.AsyncIterable(new this.AsyncIterator(this._getFetchFunc(params), params));
    }
  }, {
    key: "getTotalSize",
    value: function getTotalSize() {
      return Promise.resolve(this.treeDataSource.getChildCount(this._parentKey));
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      var count = this.treeDataSource.getChildCount();

      if (count === -1) {
        return "unknown";
      }

      return count > 0 ? 'no' : 'yes';
    }
  }, {
    key: "getCapability",
    value: function getCapability(capabilityName) {
      if (capabilityName == TreeDataSourceAdapter._SORT && this.treeDataSource.getCapability(capabilityName) == 'full') {
        return {
          attributes: 'multiple'
        };
      } else if (capabilityName == 'fetchByKeys') {
        return {
          implementation: 'iteration'
        };
      } else if (capabilityName == 'fetchByOffset') {
        return {
          implementation: 'iteration'
        };
      }

      return null;
    }
    /**
     * Get the function which performs the fetch
     */

  }, {
    key: "_getFetchFunc",
    value: function _getFetchFunc(params) {
      var self = this;

      if (params != null && params[TreeDataSourceAdapter._SORTCRITERIA] != null) {
        var attribute = params[TreeDataSourceAdapter._SORTCRITERIA][0][TreeDataSourceAdapter._ATTRIBUTE];
        var direction = params[TreeDataSourceAdapter._SORTCRITERIA][0][TreeDataSourceAdapter._DIRECTION];
        return function (attribute, direction) {
          return function (params, fetchFirst) {
            if (fetchFirst) {
              var sortParam = {};
              sortParam[TreeDataSourceAdapter._KEY] = attribute;
              sortParam[TreeDataSourceAdapter._DIRECTION] = direction;
              return new Promise(function (resolve, reject) {
                self.treeDataSource.sort(sortParam, {
                  success: function success() {
                    resolve(self._getTreeDataSourceFetch(params)(params));
                  },
                  error: function error(err) {
                    reject(err);
                  }
                });
              });
            } else {
              return self._getTreeDataSourceFetch(params)(params);
            }
          };
        }(attribute, direction);
      } else {
        return this._getTreeDataSourceFetch(params);
      }
    }
    /**
     * Get the function which invokes fetchChildren() on TreeDataSource
     */

  }, {
    key: "_getTreeDataSourceFetch",
    value: function _getTreeDataSourceFetch(params) {
      var self = this;
      return function (params, fetchFirst) {
        var sortCriteria = self.treeDataSource.getSortCriteria();

        if (sortCriteria != null && sortCriteria[TreeDataSourceAdapter._DIRECTION] != 'none' && params[TreeDataSourceAdapter._SORTCRITERIA] == null) {
          params[TreeDataSourceAdapter._SORTCRITERIA] = [];
          var sortCriterion = new self.SortCriterion(self, sortCriteria[TreeDataSourceAdapter._KEY], sortCriteria[TreeDataSourceAdapter._DIRECTION]);

          params[TreeDataSourceAdapter._SORTCRITERIA].push(sortCriterion);
        }

        self._isFetching = true;
        return new Promise(function (resolve, reject) {
          self.treeDataSource.fetchChildren(self._parentKey, {
            start: 0,
            end: -1
          }, {
            success: function success(nodeSet) {
              self._isFetching = false;
              var resultData = [];
              var resultMetadata = [];
              var start = nodeSet.getStart();
              var count = nodeSet.getCount();
              var i, data, metadata;

              for (i = 0; i < count; i++) {
                data = nodeSet.getData(start + i);
                resultData.push(data);
                metadata = nodeSet.getMetadata(start + i);

                if (!metadata[TreeDataSourceAdapter._LEAF]) {
                  self._parentInfoMap.set(metadata[TreeDataSourceAdapter._KEY], metadata);
                }

                resultMetadata.push(new self.ItemMetadata(self, metadata[TreeDataSourceAdapter._KEY]));
              }

              resolve(new self.AsyncIteratorReturnResult(self, new self.FetchListResult(self, params, resultData, resultMetadata)));
            },
            error: function error(_error) {
              self._isFetching = false;
              reject(_error);
            }
          });
        });
      };
    }
    /**
     * Add event listeners to TreeDataSource.  Note that currently none of the components
     * handle change event from TreeDataSource.
     */

  }, {
    key: "_addTreeDataSourceEventListeners",
    value: function _addTreeDataSourceEventListeners() {
      this.removeAllListeners();
      this.addListener('change', this._handleChange);
      this.addListener('refresh', this._handleRefresh);
    }
    /**
     * Remove event listeners to TableDataSource
     */

  }, {
    key: "_removeTreeDataSourceEventListeners",
    value: function _removeTreeDataSourceEventListeners() {
      this.removeListener('change');
      this.removeListener('refresh');
    }
  }, {
    key: "_handleChange",
    value: function _handleChange(event) {
      var operation = event[TreeDataSourceAdapter._OPERATION];

      if (operation === 'insert') {
        this._handleInsert(event);
      } else if (operation === 'delete') {
        this._handleDelete(event);
      } else if (operation === 'update') {
        this._handleUpdate(event);
      }
    }
  }, {
    key: "_handleInsert",
    value: function _handleInsert(event) {
      var data = event[TreeDataSourceAdapter._DATA];
      var index = event[TreeDataSourceAdapter._INDEX];
      var key = event[TreeDataSourceAdapter._KEY];
      var parentKey = event[TreeDataSourceAdapter._PARENT];
      var itemMetadata = new this.ItemMetadata(this, key);
      var keySet = new Set();
      keySet.add(key);
      var metadata = event[TreeDataSourceAdapter._METADATA];

      if (metadata != null && metadata[TreeDataSourceAdapter._LEAF]) {
        this._parentInfoMap.set(key, metadata);
      }

      var operationEventDetail = new this.DataProviderAddOperationEventDetail(this, keySet, null, null, [parentKey], [itemMetadata], [data], [index]);
      var mutationEventDetail = new this.DataProviderMutationEventDetail(this, operationEventDetail, null, null);
      this.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    }
  }, {
    key: "_handleDelete",
    value: function _handleDelete(event) {
      var data = event[TreeDataSourceAdapter._DATA];
      var index = event[TreeDataSourceAdapter._INDEX];
      var key = event[TreeDataSourceAdapter._KEY];
      var itemMetadata = new this.ItemMetadata(this, key);
      var keySet = new Set();
      keySet.add(key);

      this._parentInfoMap.delete(key);

      var operationEventDetail = new this.DataProviderOperationEventDetail(this, keySet, [itemMetadata], [data], [index]);
      var mutationEventDetail = new this.DataProviderMutationEventDetail(this, null, operationEventDetail, null);
      this.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    }
  }, {
    key: "_handleUpdate",
    value: function _handleUpdate(event) {
      var data = event[TreeDataSourceAdapter._DATA];
      var index = event[TreeDataSourceAdapter._INDEX];
      var key = event[TreeDataSourceAdapter._KEY];
      var itemMetadata = new this.ItemMetadata(this, key);
      var keySet = new Set();
      keySet.add(key);
      var operationEventDetail = new this.DataProviderOperationEventDetail(this, keySet, [itemMetadata], [data], [index]);
      var mutationEventDetail = new this.DataProviderMutationEventDetail(this, null, null, operationEventDetail);
      self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    }
  }, {
    key: "_handleRefresh",
    value: function _handleRefresh(event) {
      if (!this._isFetching) {
        this._parentInfoMap.clear();

        this.dispatchEvent(new oj.DataProviderRefreshEvent());
      }
    }
  }]);

  return TreeDataSourceAdapter;
}(DataSourceAdapter);

TreeDataSourceAdapter._SORTCRITERIA = 'sortCriteria';
TreeDataSourceAdapter._INDEX = 'index';
TreeDataSourceAdapter._PARENT = 'parent';
TreeDataSourceAdapter._LEAF = 'leaf';
TreeDataSourceAdapter._OPERATION = 'operation';
oj.TreeDataSourceAdapter = TreeDataSourceAdapter;
oj['TreeDataSourceAdapter'] = TreeDataSourceAdapter;
oj.FetchByKeysMixin.applyMixin(TreeDataSourceAdapter);
oj.FetchByOffsetMixin.applyMixin(TreeDataSourceAdapter);

return TreeDataSourceAdapter;
});