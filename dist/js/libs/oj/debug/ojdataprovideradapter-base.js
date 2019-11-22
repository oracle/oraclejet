/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $)
{
  "use strict";

class DataSourceAdapter {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.AsyncIterable = class {
            constructor(_asyncIterator) {
                this._asyncIterator = _asyncIterator;
                this[Symbol.asyncIterator] = function () {
                    return this._asyncIterator;
                };
            }
        };
        this.AsyncIterator = class {
            constructor(_nextFunc, _params) {
                this._nextFunc = _nextFunc;
                this._params = _params;
                this._fetchFirst = true;
            }
            ['next']() {
                var fetchFirst = this._fetchFirst;
                this._fetchFirst = false;
                return this._nextFunc(this._params, fetchFirst);
            }
        };
        this.AsyncIteratorYieldResult = class {
            constructor(_parent, value) {
                this._parent = _parent;
                this.value = value;
                this[DataSourceAdapter._VALUE] = value;
                this[DataSourceAdapter._DONE] = false;
            }
        };
        this.AsyncIteratorReturnResult = class {
            constructor(_parent, value) {
                this._parent = _parent;
                this.value = value;
                this[DataSourceAdapter._VALUE] = value;
                this[DataSourceAdapter._DONE] = true;
            }
        };
        this.FetchListResult = class {
            constructor(_parent, fetchParameters, data, metadata) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.data = data;
                this.metadata = metadata;
                this[DataSourceAdapter._FETCHPARAMETERS] = fetchParameters;
                this[DataSourceAdapter._DATA] = data;
                this[DataSourceAdapter._METADATA] = metadata;
            }
        };
        this.ItemMetadata = class {
            constructor(_parent, key) {
                this._parent = _parent;
                this.key = key;
                this[DataSourceAdapter._KEY] = key;
            }
        };
        this.SortCriterion = class {
            constructor(_parent, attribute, direction) {
                this._parent = _parent;
                this.attribute = attribute;
                this.direction = direction;
                this[DataSourceAdapter._ATTRIBUTE] = attribute;
                this[DataSourceAdapter._DIRECTION] = direction;
            }
        };
        this.DataProviderMutationEventDetail = class {
            constructor(_parent, add, remove, update) {
                this._parent = _parent;
                this.add = add;
                this.remove = remove;
                this.update = update;
                this[DataSourceAdapter._ADD] = add;
                this[DataSourceAdapter._REMOVE] = remove;
                this[DataSourceAdapter._UPDATE] = update;
            }
        };
        this.DataProviderOperationEventDetail = class {
            constructor(_parent, keys, metadata, data, indexes) {
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
        };
        this.DataProviderAddOperationEventDetail = class {
            constructor(_parent, keys, afterKeys, addBeforeKeys, parentKeys, metadata, data, indexes) {
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
        };
    }
    getCapability(capabilityName) {
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
    }
    addListener(eventType, eventHandler) {
        this._eventHandlerFuncs[eventType] = eventHandler.bind(this);
        this.dataSource.on(eventType, this._eventHandlerFuncs[eventType]);
    }
    removeListener(eventType) {
        this.dataSource.off(eventType, this._eventHandlerFuncs[eventType]);
    }
    removeAllListeners() {
        this._eventHandlerFuncs = {};
    }
}
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