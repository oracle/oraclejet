(function() {
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
define(['exports', 'ojs/ojeventtarget'], function (exports, ojeventtarget) {
  'use strict';
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
   * @since 10.1.0
   * @export
   * @final
   * @class SuppressNodeTreeDataProvider
   * @implements TreeDataProvider
   * @classdesc SuppressNodeTreeDataProvider is a wrapping TreeDataProvider that provide an option to suppress certain nodes,
   * such as parent nodes with empty children.  The fetch methods will check if the returned nodes should be suppressed based on the provided option.
   *
   * @ojtsexample <caption>How to use the class</caption>
   * let data = [
   *   {label: "Task 1", id: "task1", children: [{label: "Task 1.1", id: "task1.1"}]},
   *   {label: "Task 2", id: "task2", children: [{label: "Task 2.1", id: "task2.1"}]},
   *   {label: "Task 3", id: "task3", children: []}];
   * let treeDP = new ArrayTreeDataProvider(data, {keyAttributes: "id"});
   * let suppressTDP = new SuppressNodeTreeDataProvider(treeDP, {suppressNode: 'ifEmptyChildren'});
   *
   * @param {TreeDataProvider} treeDataProvider The base tree data provider.
   * @param {SuppressNodeTreeDataProvider.Options=} options Options for the SuppressNodeTreeDataProvider
   * @ojsignature [{target: "Type",
   *               value: "class SuppressNodeTreeDataProvider<K, D> implements TreeDataProvider<K, D>",
   *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
   *               {target: "Type", value: "TreeDataProvider<K,D>", for: "treeDataProvider"},
   *               {target: "Type", value: "SuppressNodeTreeDataProvider.Options", for: "options"}]
   * @ojtsimport {module: "ojtreedataprovider", type: "AMD", importName: "TreeDataProvider"}
   * @ojtsimport {module: "ojarraydataprovider", type: "AMD", importName: "ArrayDataProvider"}
   * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion",
   *   "FetchByKeysParameters","ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters", "FetchByOffsetResults",
   *   "FetchListResult","FetchListParameters"]}
   */

  /**
   * @typedef {Object} SuppressNodeTreeDataProvider.Options
   * @property {string} suppressNode - potions to suppress certain nodes.  The possible value is
   *   <ul>
   *     <li>'never': do not suppress any nodes
   *     <li>'ifEmptyChildren': suppress the parent nodes if they have empty children
   *   </ul>
   *   Default is 'never'.
   * @ojsignature [{target: "Type", value: "'never' | 'ifEmptyChildren'", for: "suppressNode"}]
   */

  /**
   * @inheritdoc
   * @memberof SuppressNodeTreeDataProvider
   * @instance
   * @method
   * @name getChildDataProvider
   */

  /**
   * @inheritdoc
   * @memberof SuppressNodeTreeDataProvider
   * @instance
   * @method
   * @name containsKeys
   */

  /**
   * Get an AsyncIterable object for iterating the data.
   * <p>
   * AsyncIterable contains a Symbol.asyncIterator method that returns an AsyncIterator.
   * AsyncIterator contains a “next” method for fetching the next block of data.
   * </p><p>
   * The "next" method returns a promise that resolves to an object, which contains a "value" property for the data and a "done" property
   * that is set to true when there is no more data to be fetched.  The "done" property should be set to true only if there is no "value"
   * in the result.  Note that "done" only reflects whether the iterator is done at the time "next" is called.  Future calls to "next"
   * may or may not return more rows for a mutable data source.
   * </p>
   * <p>
   * Please see the <a href="DataProvider.html#custom-implementations-section">DataProvider documentation</a> for
   * more information on custom implementations.
   * </p>
   *
   * @param {FetchListParameters=} params fetch parameters
   * @return {AsyncIterable.<FetchListResult>} AsyncIterable with {@link FetchListResult}
   * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
   * @export
   * @expose
   * @memberof SuppressNodeTreeDataProvider
   * @instance
   * @method
   * @name fetchFirst
   * @ojsignature {target: "Type",
   *               value: "(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>"}
   * @ojtsexample <caption>Get an asyncIterator and then fetch first block of data by executing next() on the iterator. Subsequent blocks can be fetched by executing next() again.</caption>
   * let asyncIterator = dataprovider.fetchFirst(options)[Symbol.asyncIterator]();
   * let result = await asyncIterator.next();
   * let value = result.value;
   * let data = value.data;
   * let keys = value.metadata.map(function(val) {
   *   return val.key;
   * });
   * // true or false for done
   * let done = result.done;
   */

  /**
   * @inheritdoc
   * @memberof SuppressNodeTreeDataProvider
   * @instance
   * @method
   * @name fetchByKeys
   */

  /**
   * @inheritdoc
   * @memberof SuppressNodeTreeDataProvider
   * @instance
   * @method
   * @name fetchByOffset
   */

  /**
   * @inheritdoc
   * @memberof SuppressNodeTreeDataProvider
   * @instance
   * @method
   * @name getCapability
   */

  /**
   * @inheritdoc
   * @memberof SuppressNodeTreeDataProvider
   * @instance
   * @method
   * @name getTotalSize
   */

  /**
   * @inheritdoc
   * @memberof SuppressNodeTreeDataProvider
   * @instance
   * @method
   * @name isEmpty
   */

  /**
   * @inheritdoc
   * @memberof SuppressNodeTreeDataProvider
   * @instance
   * @method
   * @name createOptimizedKeySet
   */

  /**
   * @inheritdoc
   * @memberof SuppressNodeTreeDataProvider
   * @instance
   * @method
   * @name createOptimizedKeyMap
   */

  /**
   * @inheritdoc
   * @memberof SuppressNodeTreeDataProvider
   * @instance
   * @method
   * @name addEventListener
   */

  /**
   * @inheritdoc
   * @memberof SuppressNodeTreeDataProvider
   * @instance
   * @method
   * @name removeEventListener
   */

  /**
   * @inheritdoc
   * @memberof SuppressNodeTreeDataProvider
   * @instance
   * @method
   * @name dispatchEvent
   */

  /**
   * End of jsdoc
   */

  var SuppressNodeTreeDataProvider = /*#__PURE__*/function () {
    function SuppressNodeTreeDataProvider(treeDataProvider, options) {
      _classCallCheck(this, SuppressNodeTreeDataProvider);

      this.treeDataProvider = treeDataProvider;
      this.options = options;

      this.SuppressNodeTreeAsyncIterable = /*#__PURE__*/function () {
        function _class(_parent, _asyncIterator) {
          var _this = this;

          _classCallCheck(this, _class);

          this._parent = _parent;
          this._asyncIterator = _asyncIterator;

          this[Symbol.asyncIterator] = function () {
            return new _this._parent.SuppressNodeTreeAsyncIterator(_this._parent, _this._asyncIterator);
          };
        }

        return _class;
      }();

      this.SuppressNodeTreeAsyncIterator = /*#__PURE__*/function () {
        function _class2(_parent, _baseIterator) {
          _classCallCheck(this, _class2);

          this._parent = _parent;
          this._baseIterator = _baseIterator;
        }

        _createClass(_class2, [{
          key: "_fetchNext",
          value: function _fetchNext() {
            return this._baseIterator.next();
          }
        }, {
          key: 'next',
          value: function next() {
            var promise = this._fetchNext();

            var self = this;
            return promise.then(function (result) {
              return self._parent._suppressNodeIfEmptyChildrenFirst(result);
            });
          }
        }]);

        return _class2;
      }();

      this.AsyncIteratorYieldResult = /*#__PURE__*/function () {
        function _class3(_parent, value) {
          _classCallCheck(this, _class3);

          this._parent = _parent;
          this.value = value;
          this['value'] = value;
          this['done'] = false;
        }

        return _class3;
      }();

      this.AsyncIteratorReturnResult = /*#__PURE__*/function () {
        function _class4(_parent, value) {
          _classCallCheck(this, _class4);

          this._parent = _parent;
          this.value = value;
          this['value'] = value;
          this['done'] = true;
        }

        return _class4;
      }();

      this.FetchListResult = /*#__PURE__*/function () {
        function _class5(fetchParameters, data, metadata) {
          _classCallCheck(this, _class5);

          this.fetchParameters = fetchParameters;
          this.data = data;
          this.metadata = metadata;
          this[SuppressNodeTreeDataProvider._FETCHPARAMETERS] = fetchParameters;
          this[SuppressNodeTreeDataProvider._DATA] = data;
          this[SuppressNodeTreeDataProvider._METADATA] = metadata;
        }

        return _class5;
      }();

      this.FetchByOffsetResults = /*#__PURE__*/function () {
        function _class6(_parent, fetchParameters, results, done) {
          _classCallCheck(this, _class6);

          this._parent = _parent;
          this.fetchParameters = fetchParameters;
          this.results = results;
          this.done = done;
          this[SuppressNodeTreeDataProvider._FETCHPARAMETERS] = fetchParameters;
          this[SuppressNodeTreeDataProvider._RESULTS] = results;
          this[SuppressNodeTreeDataProvider._DONE] = done;
        }

        return _class6;
      }();

      this.Item = /*#__PURE__*/function () {
        function _class7(_parent, metadata, data) {
          _classCallCheck(this, _class7);

          this._parent = _parent;
          this.metadata = metadata;
          this.data = data;
          this[SuppressNodeTreeDataProvider._METADATA] = metadata;
          this[SuppressNodeTreeDataProvider._DATA] = data;
        }

        return _class7;
      }();
    }

    _createClass(SuppressNodeTreeDataProvider, [{
      key: "containsKeys",
      value: function containsKeys(params) {
        return this.treeDataProvider.containsKeys(params);
      }
    }, {
      key: "getCapability",
      value: function getCapability(capabilityName) {
        return this.treeDataProvider.getCapability(capabilityName);
      }
    }, {
      key: "getTotalSize",
      value: function getTotalSize() {
        return this.treeDataProvider.getTotalSize();
      }
    }, {
      key: "isEmpty",
      value: function isEmpty() {
        return this.treeDataProvider.isEmpty();
      }
    }, {
      key: "createOptimizedKeySet",
      value: function createOptimizedKeySet(initialSet) {
        return this.treeDataProvider.createOptimizedKeySet(initialSet);
      }
    }, {
      key: "createOptimizedKeyMap",
      value: function createOptimizedKeyMap(initialMap) {
        return this.treeDataProvider.createOptimizedKeyMap(initialMap);
      }
    }, {
      key: "getChildDataProvider",
      value: function getChildDataProvider(parentKey) {
        var child = this.treeDataProvider.getChildDataProvider(parentKey);
        if (child == null) return null;else return new SuppressNodeTreeDataProvider(child, this.options);
      }
    }, {
      key: "fetchByOffset",
      value: function fetchByOffset(params) {
        var _this2 = this;

        return this.treeDataProvider.fetchByOffset(params).then(function (result) {
          return _this2._suppressNodeIfEmptyChildrenByOffset(result);
        });
      }
    }, {
      key: "fetchByKeys",
      value: function fetchByKeys(params) {
        return this.treeDataProvider.fetchByKeys(params);
      }
    }, {
      key: "fetchFirst",
      value: function fetchFirst(params) {
        var asyncIterable = this.treeDataProvider.fetchFirst(params);
        return new this.SuppressNodeTreeAsyncIterable(this, asyncIterable[Symbol.asyncIterator]());
      }
    }, {
      key: "_suppressNodeIfEmptyChildrenByOffset",
      value: function _suppressNodeIfEmptyChildrenByOffset(result) {
        var retResult = null;

        if (result.results && this.options && this.options.suppressNode == 'ifEmptyChildren') {
          var metadata;
          var data;
          var resultArray = [];

          var _iterator = _createForOfIteratorHelper(result.results),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var resulti = _step.value;
              metadata = resulti.metadata;
              data = resulti.data;
              var child = this.treeDataProvider.getChildDataProvider(metadata.key, this.options);

              if (child && child.isEmpty() == 'no') {
                resultArray.push(new this.Item(this, metadata, data));
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          if (resultArray.length > 0) {
            retResult = new this.FetchByOffsetResults(this, result.fetchParameters, resultArray, result.done);
          }
        }

        return retResult == null ? result : retResult;
      }
    }, {
      key: "_suppressNodeIfEmptyChildrenFirst",
      value: function _suppressNodeIfEmptyChildrenFirst(result) {
        var retResult = null;

        if (!result.done && this.options && this.options.suppressNode == 'ifEmptyChildren') {
          if (result && result.value && result.value.data) {
            var metadata = result.value.metadata;
            var data = result.value.data;
            var retData = Array();
            var retMetadata = Array();

            for (var i = 0; metadata && i < metadata.length; i++) {
              var child = this.treeDataProvider.getChildDataProvider(metadata[i].key, this.options);

              if (child && child.isEmpty() == 'no') {
                retData.push(data[i]);
                retMetadata.push(metadata[i]);
              }
            }

            if (retData.length > 0) {
              retResult = result.done ? new this.AsyncIteratorReturnResult(this, new this.FetchListResult(null, retData, retMetadata)) : new this.AsyncIteratorYieldResult(this, new this.FetchListResult(null, retData, retMetadata));
            }
          }
        }

        return Promise.resolve(retResult == null ? result : retResult);
      }
    }]);

    return SuppressNodeTreeDataProvider;
  }();

  SuppressNodeTreeDataProvider._DATA = 'data';
  SuppressNodeTreeDataProvider._METADATA = 'metadata';
  SuppressNodeTreeDataProvider._FETCHPARAMETERS = 'fetchParameters';
  SuppressNodeTreeDataProvider._RESULTS = 'results';
  SuppressNodeTreeDataProvider._DONE = 'done';
  SuppressNodeTreeDataProvider._KEY = 'key';
  ojeventtarget.EventTargetMixin.applyMixin(SuppressNodeTreeDataProvider);
  exports.SuppressNodeTreeDataProvider = SuppressNodeTreeDataProvider;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())