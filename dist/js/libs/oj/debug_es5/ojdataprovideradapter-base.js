/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $)
{
  "use strict";
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var DataSourceAdapter =
/*#__PURE__*/
function () {
  function DataSourceAdapter(dataSource) {
    _classCallCheck(this, DataSourceAdapter);

    this.dataSource = dataSource;

    this.AsyncIterable =
    /*#__PURE__*/
    function () {
      function _class(_asyncIterator) {
        _classCallCheck(this, _class);

        this._asyncIterator = _asyncIterator;

        this[Symbol.asyncIterator] = function () {
          return this._asyncIterator;
        };
      }

      return _class;
    }();

    this.AsyncIterator =
    /*#__PURE__*/
    function () {
      function _class2(_nextFunc, _params) {
        _classCallCheck(this, _class2);

        this._nextFunc = _nextFunc;
        this._params = _params;
        this._fetchFirst = true;
      }

      _createClass(_class2, [{
        key: 'next',
        value: function next() {
          var fetchFirst = this._fetchFirst;
          this._fetchFirst = false;
          return this._nextFunc(this._params, fetchFirst);
        }
      }]);

      return _class2;
    }();

    this.AsyncIteratorYieldResult =
    /*#__PURE__*/
    function () {
      function _class3(_parent, value) {
        _classCallCheck(this, _class3);

        this._parent = _parent;
        this.value = value;
        this[DataSourceAdapter._VALUE] = value;
        this[DataSourceAdapter._DONE] = false;
      }

      return _class3;
    }();

    this.AsyncIteratorReturnResult =
    /*#__PURE__*/
    function () {
      function _class4(_parent, value) {
        _classCallCheck(this, _class4);

        this._parent = _parent;
        this.value = value;
        this[DataSourceAdapter._VALUE] = value;
        this[DataSourceAdapter._DONE] = true;
      }

      return _class4;
    }();

    this.FetchListResult =
    /*#__PURE__*/
    function () {
      function _class5(_parent, fetchParameters, data, metadata) {
        _classCallCheck(this, _class5);

        this._parent = _parent;
        this.fetchParameters = fetchParameters;
        this.data = data;
        this.metadata = metadata;
        this[DataSourceAdapter._FETCHPARAMETERS] = fetchParameters;
        this[DataSourceAdapter._DATA] = data;
        this[DataSourceAdapter._METADATA] = metadata;
      }

      return _class5;
    }();

    this.ItemMetadata =
    /*#__PURE__*/
    function () {
      function _class6(_parent, key) {
        _classCallCheck(this, _class6);

        this._parent = _parent;
        this.key = key;
        this[DataSourceAdapter._KEY] = key;
      }

      return _class6;
    }();

    this.SortCriterion =
    /*#__PURE__*/
    function () {
      function _class7(_parent, attribute, direction) {
        _classCallCheck(this, _class7);

        this._parent = _parent;
        this.attribute = attribute;
        this.direction = direction;
        this[DataSourceAdapter._ATTRIBUTE] = attribute;
        this[DataSourceAdapter._DIRECTION] = direction;
      }

      return _class7;
    }();

    this.DataProviderMutationEventDetail =
    /*#__PURE__*/
    function () {
      function _class8(_parent, add, remove, update) {
        _classCallCheck(this, _class8);

        this._parent = _parent;
        this.add = add;
        this.remove = remove;
        this.update = update;
        this[DataSourceAdapter._ADD] = add;
        this[DataSourceAdapter._REMOVE] = remove;
        this[DataSourceAdapter._UPDATE] = update;
      }

      return _class8;
    }();

    this.DataProviderOperationEventDetail =
    /*#__PURE__*/
    function () {
      function _class9(_parent, keys, metadata, data, indexes) {
        _classCallCheck(this, _class9);

        this._parent = _parent;
        this.keys = keys;
        this.metadata = metadata;
        this.data = data;
        this.indexes = indexes;
        this[DataSourceAdapter._KEYS] = keys;
        this[DataSourceAdapter._METADATA] = metadata;
        this[DataSourceAdapter._DATA] = data;
        this[DataSourceAdapter._INDEXES] = indexes;
      }

      return _class9;
    }();

    this.DataProviderAddOperationEventDetail =
    /*#__PURE__*/
    function () {
      function _class10(_parent, keys, afterKeys, addBeforeKeys, parentKeys, metadata, data, indexes) {
        _classCallCheck(this, _class10);

        this._parent = _parent;
        this.keys = keys;
        this.afterKeys = afterKeys;
        this.addBeforeKeys = addBeforeKeys;
        this.parentKeys = parentKeys;
        this.metadata = metadata;
        this.data = data;
        this.indexes = indexes;
        this[DataSourceAdapter._KEYS] = keys;
        this[DataSourceAdapter._AFTERKEYS] = afterKeys;
        this[DataSourceAdapter._ADDBEFOREKEYS] = addBeforeKeys;
        this[DataSourceAdapter._METADATA] = metadata;
        this[DataSourceAdapter._DATA] = data;
        this[DataSourceAdapter._INDEXES] = indexes;
      }

      return _class10;
    }();
  }

  _createClass(DataSourceAdapter, [{
    key: "getCapability",
    value: function getCapability(capabilityName) {
      if (capabilityName == DataSourceAdapter._SORT && this.dataSource.getCapability(capabilityName) == 'full') {
        return {
          attributes: 'multiple'
        };
      } else if (capabilityName == 'fetchByKeys') {
        return {
          implementation: 'lookup'
        };
      } else if (capabilityName == 'fetchByOffset') {
        return {
          implementation: 'lookup'
        };
      }

      return null;
    }
  }, {
    key: "addListener",
    value: function addListener(eventType, eventHandler) {
      this._eventHandlerFuncs[eventType] = eventHandler.bind(this);
      this.dataSource.on(eventType, this._eventHandlerFuncs[eventType]);
    }
  }, {
    key: "removeListener",
    value: function removeListener(eventType) {
      this.dataSource.off(eventType, this._eventHandlerFuncs[eventType]);
    }
  }, {
    key: "removeAllListeners",
    value: function removeAllListeners() {
      this._eventHandlerFuncs = {};
    }
  }]);

  return DataSourceAdapter;
}();

DataSourceAdapter._SORT = 'sort';
DataSourceAdapter._DATA = 'data';
DataSourceAdapter._KEY = 'key';
DataSourceAdapter._ATTRIBUTE = 'attribute';
DataSourceAdapter._DIRECTION = 'direction';
DataSourceAdapter._VALUE = 'value';
DataSourceAdapter._DONE = 'done';
DataSourceAdapter._FETCHPARAMETERS = 'fetchParameters';
DataSourceAdapter._METADATA = 'metadata';
DataSourceAdapter._KEYS = 'keys';
DataSourceAdapter._INDEXES = 'indexes';
DataSourceAdapter._ADD = 'add';
DataSourceAdapter._REMOVE = 'remove';
DataSourceAdapter._UPDATE = 'update';
DataSourceAdapter._AFTERKEYS = 'afterKeys';
DataSourceAdapter._ADDBEFOREKEYS = 'addBeforeKeys';
oj.EventTargetMixin.applyMixin(DataSourceAdapter);

return DataSourceAdapter;
});