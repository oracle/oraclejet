/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsx } from 'preact/jsx-runtime';
import { Component } from 'preact';

var __awaiter = (null && null.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class DataProviderHandlerUtils {
    static getUpdatedItemsFromMutationDetail(detail, currentData, dataProvider) {
        return __awaiter(this, void 0, void 0, function* () {
            const { add, remove, update } = detail !== null && detail !== void 0 ? detail : {};
            const keyIndexMap = new Map();
            for (const [index, item] of currentData.entries()) {
                keyIndexMap.set(item.key, index);
            }
            let mutatedData = [...currentData];
            if (remove) {
                mutatedData = DataProviderHandlerUtils._removeItemsFromDetail(remove, mutatedData, keyIndexMap);
            }
            if (add) {
                mutatedData = yield DataProviderHandlerUtils._addItemsFromDetail(add, mutatedData, keyIndexMap, dataProvider);
            }
            if (update) {
                mutatedData = yield DataProviderHandlerUtils._updateItemsFromDetail(update, mutatedData, keyIndexMap, dataProvider);
            }
            return mutatedData;
        });
    }
    static _addItemsAtEnd(itemsToAdd, itemMetadataToAdd, items) {
        const returnItems = [...items];
        itemsToAdd.forEach((item, index) => {
            var _a;
            const addItem = {
                data: item,
                key: (_a = itemMetadataToAdd[index]) === null || _a === void 0 ? void 0 : _a.key,
                metadata: itemMetadataToAdd[index]
            };
            returnItems.push(addItem);
        });
        return returnItems;
    }
    static _addItemsAtIndices(indices, itemsToAdd, itemMetadataToAdd, items) {
        const returnItems = [...items];
        indices.forEach((addAtIndex, index) => {
            var _a;
            const addItem = {
                data: itemsToAdd[index],
                key: (_a = itemMetadataToAdd[index]) === null || _a === void 0 ? void 0 : _a.key,
                metadata: itemMetadataToAdd[index]
            };
            if (addAtIndex >= 0) {
                returnItems.splice(addAtIndex, 0, addItem);
            }
            else {
                returnItems.push(addItem);
            }
        });
        return returnItems;
    }
    static _addItemsBeforeKeys(beforeKeys, itemsToAdd, items, keyIndexMap) {
        const addIndices = [];
        const itemMetadataToAdd = [];
        beforeKeys.forEach((key) => {
            addIndices.push(DataProviderHandlerUtils._getIndexByKey(keyIndexMap, key));
            itemMetadataToAdd.push({ key });
        });
        return DataProviderHandlerUtils._addItemsAtIndices(addIndices, itemsToAdd, itemMetadataToAdd, items);
    }
    static _addItemsFromDetail(detail, items, keyIndexMap, dataProvider) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { addBeforeKeys, afterKeys, data, indexes, keys, metadata } = detail;
            let mutatedData = [...items];
            let treatedData = data || [];
            let treatedMetaData = metadata || [];
            if (treatedData.length === 0 && (keys === null || keys === void 0 ? void 0 : keys.size)) {
                const fetchResults = (_a = (yield DataProviderHandlerUtils._fetchDataByKeys(dataProvider, keys))) !== null && _a !== void 0 ? _a : [];
                treatedData = fetchResults.map((itemContext) => itemContext.data);
                treatedMetaData = fetchResults.map((itemContext) => itemContext.metadata);
            }
            if (treatedMetaData.length === 0 && (keys === null || keys === void 0 ? void 0 : keys.size)) {
                treatedMetaData = [...keys].map((key) => ({ key }));
            }
            if (treatedData.length) {
                if (indexes === null || indexes === void 0 ? void 0 : indexes.length) {
                    mutatedData = DataProviderHandlerUtils._addItemsAtIndices(indexes, treatedData, treatedMetaData, mutatedData);
                }
                else if (addBeforeKeys === null || addBeforeKeys === void 0 ? void 0 : addBeforeKeys.length) {
                    mutatedData = DataProviderHandlerUtils._addItemsBeforeKeys(addBeforeKeys, treatedData, mutatedData, keyIndexMap);
                }
                else if (afterKeys === null || afterKeys === void 0 ? void 0 : afterKeys.size) {
                    mutatedData = DataProviderHandlerUtils._addItemsBeforeKeys([...afterKeys], treatedData, mutatedData, keyIndexMap);
                }
                else {
                    mutatedData = DataProviderHandlerUtils._addItemsAtEnd(treatedData, treatedMetaData, mutatedData);
                }
            }
            return mutatedData;
        });
    }
    static _fetchDataByKeys(dataProvider, keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedData = [];
            const results = (yield dataProvider.fetchByKeys({ keys })).results;
            for (const key of keys) {
                if (results.has(key)) {
                    const result = results.get(key);
                    fetchedData.push(Object.assign(Object.assign({}, result), { key }));
                }
            }
            return fetchedData;
        });
    }
    static _getIndexByKey(keyIndexMap, key) {
        if (keyIndexMap.has(key)) {
            return keyIndexMap.get(key);
        }
        return -1;
    }
    static _removeItemsAtIndices(indices, items) {
        const returnItems = [...items];
        indices.sort((a, b) => b - a);
        indices.forEach((index) => {
            if (index < returnItems.length) {
                returnItems.splice(index, 1);
            }
        });
        return returnItems;
    }
    static _removeItemsAtKeys(keys, items, keyIndexMap) {
        const indicesToRemove = [];
        keys.forEach((key) => {
            const index = DataProviderHandlerUtils._getIndexByKey(keyIndexMap, key);
            if (index !== -1) {
                indicesToRemove.push(index);
            }
        });
        return DataProviderHandlerUtils._removeItemsAtIndices(indicesToRemove, items);
    }
    static _removeItemsFromDetail(detail, items, keyIndexMap) {
        const { indexes, keys } = detail;
        let mutatedData = [...items];
        if (indexes === null || indexes === void 0 ? void 0 : indexes.length) {
            mutatedData = DataProviderHandlerUtils._removeItemsAtIndices(indexes, mutatedData);
        }
        else if (keys === null || keys === void 0 ? void 0 : keys.size) {
            mutatedData = DataProviderHandlerUtils._removeItemsAtKeys(keys, mutatedData, keyIndexMap);
        }
        return mutatedData;
    }
    static _updateItemsAtIndices(indices, itemsToUpdate, itemMetadataToUpdate, items) {
        const returnItems = [...items];
        indices.forEach((updateAtIndex, index) => {
            var _a;
            if (returnItems[updateAtIndex]) {
                const addItem = {
                    data: itemsToUpdate[index],
                    key: (_a = itemMetadataToUpdate[index]) === null || _a === void 0 ? void 0 : _a.key,
                    metadata: itemMetadataToUpdate[index]
                };
                returnItems.splice(updateAtIndex, 1, addItem);
            }
        });
        return returnItems;
    }
    static _updateItemsAtKeys(keys, itemsToUpdate, itemMetadataToUpdate, items, keyIndexMap) {
        const returnItems = [...items];
        keys.forEach((key) => {
            var _a;
            const index = this._getIndexByKey(keyIndexMap, key);
            const addItem = {
                data: itemsToUpdate[index],
                key: (_a = itemMetadataToUpdate[index]) === null || _a === void 0 ? void 0 : _a.key,
                metadata: itemMetadataToUpdate[index]
            };
            if (index >= 0) {
                returnItems.splice(index, 1, addItem);
            }
        });
        return returnItems;
    }
    static _updateItemsFromDetail(detail, items, keyIndexMap, dataProvider) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { data, indexes, keys, metadata } = detail;
            let mutatedData = [...items];
            let treatedData = data || [];
            let treatedMetaData = metadata || [];
            if (treatedData.length === 0 && (keys === null || keys === void 0 ? void 0 : keys.size)) {
                const fetchResults = (_a = (yield DataProviderHandlerUtils._fetchDataByKeys(dataProvider, keys))) !== null && _a !== void 0 ? _a : [];
                treatedData = fetchResults.map((itemContext) => itemContext.data);
                treatedMetaData = fetchResults.map((itemContext) => itemContext.metadata);
            }
            if (treatedMetaData.length === 0 && (keys === null || keys === void 0 ? void 0 : keys.size)) {
                treatedMetaData = [...keys].map((key) => ({ key }));
            }
            if (treatedData.length) {
                if (indexes === null || indexes === void 0 ? void 0 : indexes.length) {
                    mutatedData = DataProviderHandlerUtils._updateItemsAtIndices(indexes, treatedData, treatedMetaData, mutatedData);
                }
                else if (keys === null || keys === void 0 ? void 0 : keys.size) {
                    mutatedData = DataProviderHandlerUtils._updateItemsAtKeys(keys, treatedData, treatedMetaData, mutatedData, keyIndexMap);
                }
            }
            return mutatedData;
        });
    }
}

var __awaiter$1 = (null && null.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (null && null.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
class DataProviderHandler {
    constructor(dataProvider, addBusyState, callback) {
        this._handleMutateEvent = (event) => __awaiter$1(this, void 0, void 0, function* () {
            var _a, _b;
            const { detail } = event;
            const resolver = this._addBusyState('updating data from mutation event');
            const updatedData = yield DataProviderHandlerUtils.getUpdatedItemsFromMutationDetail(detail, this._currentData, this._dataProvider);
            resolver === null || resolver === void 0 ? void 0 : resolver();
            this._currentData = updatedData;
            (_b = (_a = this._callback) === null || _a === void 0 ? void 0 : _a.onDataUpdated) === null || _b === void 0 ? void 0 : _b.call(_a, updatedData);
        });
        this._handleRefreshEvent = (event) => {
            this._fetchDataAndNotify();
        };
        this._addBusyState = addBusyState;
        this._callback = callback;
        this._dataProvider = dataProvider;
        this._currentData = [];
        dataProvider.addEventListener('refresh', this._handleRefreshEvent);
        dataProvider.addEventListener('mutate', this._handleMutateEvent);
        this._fetchDataAndNotify();
    }
    destroy() {
        this._callback = undefined;
        this._currentData = [];
        this._dataProvider.removeEventListener('refresh', this._handleRefreshEvent);
        this._dataProvider.removeEventListener('mutate', this._handleMutateEvent);
    }
    _fetchData() {
        var e_1, _a;
        return __awaiter$1(this, void 0, void 0, function* () {
            const fetchedData = [];
            const asyncIterable = this._dataProvider.fetchFirst({ size: -1 });
            try {
                for (var asyncIterable_1 = __asyncValues(asyncIterable), asyncIterable_1_1; asyncIterable_1_1 = yield asyncIterable_1.next(), !asyncIterable_1_1.done;) {
                    const results = asyncIterable_1_1.value;
                    const contextArray = results.data.map((item, index) => {
                        return {
                            data: item,
                            key: results.metadata[index].key,
                            metadata: results.metadata[index]
                        };
                    });
                    fetchedData.push(...contextArray);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return)) yield _a.call(asyncIterable_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this._currentData = fetchedData.slice();
            return fetchedData;
        });
    }
    _fetchDataAndNotify() {
        var _a, _b;
        return __awaiter$1(this, void 0, void 0, function* () {
            const resolver = this._addBusyState('fetching data');
            const fetchedData = yield this._fetchData();
            (_b = (_a = this._callback) === null || _a === void 0 ? void 0 : _a.onDataUpdated) === null || _b === void 0 ? void 0 : _b.call(_a, fetchedData);
            resolver();
        });
    }
}

var __rest = (null && null.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
function withDataProvider(WrappedComponent, dataProp) {
    var _a;
    return _a = class extends Component {
            constructor(props) {
                super(props);
                this._handleDataUpdate = (fetchedData) => {
                    this.setState({ fetchedData });
                };
                this.state = {
                    fetchedData: []
                };
            }
            componentDidMount() {
                this._initDataProviderHandler();
            }
            componentDidUpdate(previousProps) {
                if (this.props.data !== previousProps.data) {
                    this._resetDataProviderHandler();
                }
            }
            componentWillUnmount() {
                this._releaseDataProviderHandler();
            }
            render(props, state) {
                const { data, addBusyState } = props, passThroughProps = __rest(props, ["data", "addBusyState"]);
                const { fetchedData } = state;
                const childProps = Object.assign({ [dataProp]: fetchedData }, passThroughProps);
                return jsx(WrappedComponent, Object.assign({}, childProps));
            }
            _initDataProviderHandler() {
                const { data, addBusyState } = this.props;
                if (data != null) {
                    this._dataProviderHandler = new DataProviderHandler(data, addBusyState, {
                        onDataUpdated: this._handleDataUpdate
                    });
                }
            }
            _releaseDataProviderHandler() {
                var _a;
                (_a = this._dataProviderHandler) === null || _a === void 0 ? void 0 : _a.destroy();
                this._dataProviderHandler = undefined;
            }
            _resetDataProviderHandler() {
                this._releaseDataProviderHandler();
                this._initDataProviderHandler();
            }
        },
        _a.displayName = `WithDataProvider(${getDisplayName(WrappedComponent)})`,
        _a;
}
function getDisplayName(WrappedComponent) {
    var _a, _b;
    return (_b = (_a = WrappedComponent.displayName) !== null && _a !== void 0 ? _a : WrappedComponent.name) !== null && _b !== void 0 ? _b : 'Component';
}

export { withDataProvider };
