/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $)
{
  "use strict";
/**
 * Copyright (c) 2018, Oracle and/or its affiliates.
 * All rights reserved.
 */
var DataSourceAdapter = /** @class */ (function () {
    function DataSourceAdapter(dataSource) {
        this.dataSource = dataSource;
        this.AsyncIterable = /** @class */ (function () {
            function class_1(_asyncIterator) {
                this._asyncIterator = _asyncIterator;
                this[Symbol.asyncIterator] = function () {
                    return this._asyncIterator;
                };
            }
            return class_1;
        }());
        this.AsyncIterator = /** @class */ (function () {
            function class_2(_nextFunc, _params) {
                this._nextFunc = _nextFunc;
                this._params = _params;
                this._fetchFirst = true;
            }
            class_2.prototype['next'] = function () {
                var fetchFirst = this._fetchFirst;
                this._fetchFirst = false;
                return this._nextFunc(this._params, fetchFirst);
            };
            return class_2;
        }());
        this.AsyncIteratorResult = /** @class */ (function () {
            function class_3(_parent, value, done) {
                this._parent = _parent;
                this.value = value;
                this.done = done;
                this[DataSourceAdapter._VALUE] = value;
                this[DataSourceAdapter._DONE] = done;
            }
            return class_3;
        }());
        this.FetchListResult = /** @class */ (function () {
            function class_4(_parent, fetchParameters, data, metadata) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.data = data;
                this.metadata = metadata;
                this[DataSourceAdapter._FETCHPARAMETERS] = fetchParameters;
                this[DataSourceAdapter._DATA] = data;
                this[DataSourceAdapter._METADATA] = metadata;
            }
            return class_4;
        }());
        this.ItemMetadata = /** @class */ (function () {
            function class_5(_parent, key) {
                this._parent = _parent;
                this.key = key;
                this[DataSourceAdapter._KEY] = key;
            }
            return class_5;
        }());
        this.SortCriterion = /** @class */ (function () {
            function class_6(_parent, attribute, direction) {
                this._parent = _parent;
                this.attribute = attribute;
                this.direction = direction;
                this[DataSourceAdapter._ATTRIBUTE] = attribute;
                this[DataSourceAdapter._DIRECTION] = direction;
            }
            return class_6;
        }());
        this.DataProviderMutationEventDetail = /** @class */ (function () {
            function class_7(_parent, add, remove, update) {
                this._parent = _parent;
                this.add = add;
                this.remove = remove;
                this.update = update;
                this[DataSourceAdapter._ADD] = add;
                this[DataSourceAdapter._REMOVE] = remove;
                this[DataSourceAdapter._UPDATE] = update;
            }
            return class_7;
        }());
        this.DataProviderOperationEventDetail = /** @class */ (function () {
            function class_8(_parent, keys, metadata, data, indexes) {
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
            return class_8;
        }());
        this.DataProviderAddOperationEventDetail = /** @class */ (function () {
            function class_9(_parent, keys, afterKeys, addBeforeKeys, parentKeys, metadata, data, indexes) {
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
            return class_9;
        }());
    }
    DataSourceAdapter.prototype.getCapability = function (capabilityName) {
        if (capabilityName == DataSourceAdapter._SORT &&
            this.dataSource.getCapability(capabilityName) == 'full') {
            return { attributes: 'multiple' };
        }
        else if (capabilityName == 'fetchByKeys') {
            return { implementation: 'lookup' };
        }
        else if (capabilityName == 'fetchByOffset') {
            return { implementation: 'lookup' };
        }
        return null;
    };
    DataSourceAdapter.prototype.addListener = function (eventType, eventHandler) {
        this._eventHandlerFuncs[eventType] = eventHandler.bind(this);
        this.dataSource.on(eventType, this._eventHandlerFuncs[eventType]);
    };
    DataSourceAdapter.prototype.removeListener = function (eventType) {
        this.dataSource.off(eventType, this._eventHandlerFuncs[eventType]);
    };
    DataSourceAdapter.prototype.removeAllListeners = function () {
        this._eventHandlerFuncs = {};
    };
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
    return DataSourceAdapter;
}());
oj.EventTargetMixin.applyMixin(DataSourceAdapter);

return DataSourceAdapter;
});