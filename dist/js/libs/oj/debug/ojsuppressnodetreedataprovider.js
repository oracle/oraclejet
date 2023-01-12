/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojeventtarget'], function (exports, ojeventtarget) { 'use strict';

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

    // end of jsdoc

    class SuppressNodeTreeDataProvider {
        constructor(treeDataProvider, options) {
            var _a, _b;
            this.treeDataProvider = treeDataProvider;
            this.options = options;
            this.SuppressNodeTreeAsyncIterable = (_b = class {
                    constructor(_parent, _asyncIterator) {
                        this._parent = _parent;
                        this._asyncIterator = _asyncIterator;
                        this[_a] = () => {
                            return new this._parent.SuppressNodeTreeAsyncIterator(this._parent, this._asyncIterator);
                        };
                    }
                },
                _a = Symbol.asyncIterator,
                _b);
            this.SuppressNodeTreeAsyncIterator = class {
                constructor(_parent, _baseIterator, _params) {
                    this._parent = _parent;
                    this._baseIterator = _baseIterator;
                    this._params = _params;
                }
                _fetchNext() {
                    return this._baseIterator.next();
                }
                ['next']() {
                    var _b;
                    const signal = (_b = this._params) === null || _b === void 0 ? void 0 : _b.signal;
                    if (signal && signal.aborted) {
                        const reason = signal.reason;
                        return Promise.reject(new DOMException(reason, 'AbortError'));
                    }
                    return new Promise((resolve, reject) => {
                        if (signal) {
                            const reason = signal.reason;
                            signal.addEventListener('abort', (e) => {
                                return reject(new DOMException(reason, 'AbortError'));
                            });
                        }
                        const promise = this._fetchNext();
                        return resolve(promise.then((result) => {
                            return this._parent._suppressNodeIfEmptyChildrenFirst(result);
                        }));
                    });
                }
            };
            this.AsyncIteratorYieldResult = class {
                constructor(value) {
                    this.value = value;
                    this.done = false;
                }
            };
            this.AsyncIteratorReturnResult = class {
                constructor(value) {
                    this.value = value;
                    this.done = true;
                }
            };
            this.FetchListResult = class {
                constructor(fetchParameters, data, metadata, totalFilteredRowCount) {
                    this.fetchParameters = fetchParameters;
                    this.data = data;
                    this.metadata = metadata;
                    this.totalFilteredRowCount = totalFilteredRowCount;
                }
            };
            this.FetchByOffsetResults = class {
                constructor(fetchParameters, results, done) {
                    this.fetchParameters = fetchParameters;
                    this.results = results;
                    this.done = done;
                }
            };
            this.Item = class {
                constructor(metadata, data) {
                    this.metadata = metadata;
                    this.data = data;
                }
            };
        }
        containsKeys(params) {
            return this.treeDataProvider.containsKeys(params);
        }
        getCapability(capabilityName) {
            return this.treeDataProvider.getCapability(capabilityName);
        }
        getTotalSize() {
            return this.treeDataProvider.getTotalSize();
        }
        isEmpty() {
            return this.treeDataProvider.isEmpty();
        }
        createOptimizedKeySet(initialSet) {
            return this.treeDataProvider.createOptimizedKeySet(initialSet);
        }
        createOptimizedKeyMap(initialMap) {
            return this.treeDataProvider.createOptimizedKeyMap(initialMap);
        }
        getChildDataProvider(parentKey) {
            const child = this.treeDataProvider.getChildDataProvider(parentKey);
            return child === null ? null : new SuppressNodeTreeDataProvider(child, this.options);
        }
        fetchFirst(params) {
            const asyncIterable = this.treeDataProvider.fetchFirst(params);
            return new this.SuppressNodeTreeAsyncIterable(this, asyncIterable[Symbol.asyncIterator]());
        }
        fetchByOffset(params) {
            const signal = params === null || params === void 0 ? void 0 : params.signal;
            if (signal && signal.aborted) {
                const reason = signal.reason;
                return Promise.reject(new DOMException(reason, 'AbortError'));
            }
            return new Promise((resolve, reject) => {
                if (signal) {
                    const reason = signal.reason;
                    signal.addEventListener('abort', (e) => {
                        return reject(new DOMException(reason, 'AbortError'));
                    });
                }
                return resolve(this.treeDataProvider.fetchByOffset(params).then((result) => {
                    return this._suppressNodeIfEmptyChildrenByOffset(result);
                }));
            });
        }
        fetchByKeys(params) {
            const signal = params === null || params === void 0 ? void 0 : params.signal;
            if (signal && signal.aborted) {
                const reason = signal.reason;
                return Promise.reject(new DOMException(reason, 'AbortError'));
            }
            return new Promise((resolve, reject) => {
                if (signal) {
                    const reason = signal.reason;
                    signal.addEventListener('abort', (e) => {
                        return reject(new DOMException(reason, 'AbortError'));
                    });
                }
                return resolve(this.treeDataProvider.fetchByKeys(params));
            });
        }
        _suppressNodeIfEmptyChildrenByOffset(result) {
            if (result.results && this.options && this.options.suppressNode == 'ifEmptyChildren') {
                const resultArray = [];
                const promises = [];
                const promiseItems = new Promise((resolve) => {
                    for (let i = 0; i < result.results.length; i++) {
                        const resulti = result.results[i];
                        promises[i] = this._suppressChild(resulti.metadata.key, result.fetchParameters ? result.fetchParameters.filterCriterion : null);
                    }
                    return Promise.all(promises).then((supressNodes) => {
                        for (let i = 0; i < supressNodes.length; i++) {
                            if (supressNodes[i] === false) {
                                resultArray.push(new this.Item(result.results[i].metadata, result.results[i].data));
                            }
                        }
                        return resolve(resultArray);
                    });
                });
                return promiseItems.then((resultArray) => {
                    return new this.FetchByOffsetResults(result.fetchParameters, resultArray, result.done);
                });
            }
            else {
                return Promise.resolve(result);
            }
        }
        _suppressNodeIfEmptyChildrenFirst(result) {
            const promises = [];
            if (!result.done && this.options && this.options.suppressNode == 'ifEmptyChildren') {
                const promiseItems = new Promise((resolve) => {
                    if (result && result.value && result.value.data) {
                        const metadata = result.value.metadata;
                        const data = result.value.data;
                        const retItems = [];
                        for (let i = 0; metadata && i < metadata.length; i++) {
                            promises[i] = this._suppressChild(metadata[i].key, result.value.fetchParameters ? result.value.fetchParameters.filterCriterion : null);
                        }
                        return Promise.all(promises).then((supressNodes) => {
                            for (let i = 0; i < supressNodes.length; i++) {
                                if (supressNodes[i] === false) {
                                    retItems.push({
                                        data: data[i],
                                        metadata: metadata[i],
                                        totalFilteredRowCount: result.value.totalFilteredRowCount
                                    });
                                }
                            }
                            return resolve(retItems);
                        });
                    }
                    else {
                        return {
                            data: result.value.data,
                            metadata: result.value.metadata,
                            totalFilteredRowCount: result.value.totalFilteredRowCount
                        };
                    }
                });
                return promiseItems.then((retItems) => {
                    const retData = [];
                    const retMetadata = [];
                    for (const item of retItems) {
                        retData.push(item.data);
                        retMetadata.push(item.metadata);
                    }
                    return new this.AsyncIteratorYieldResult(new this.FetchListResult(result.value.fetchParameters, retData, retMetadata, result.value.totalFilteredRowCount));
                });
            }
            else {
                return Promise.resolve(result);
            }
        }
        _suppressChild(key, filterCriterion) {
            const child = this.getChildDataProvider(key);
            if (child == null || child.isEmpty() === 'yes') {
                return Promise.resolve(child === null ? false : true);
            }
            else {
                if (filterCriterion) {
                    return child
                        .fetchByOffset({ offset: 0, filterCriterion: filterCriterion })
                        .then((childResult) => {
                        return childResult && childResult.results && childResult.results.length > 0
                            ? false
                            : true;
                    });
                }
                else if (child.isEmpty() === 'unknown') {
                    return child.fetchByOffset({ offset: 0, size: 1 }).then((childResult) => {
                        return childResult && childResult.results && childResult.results.length > 0
                            ? false
                            : true;
                    });
                }
                else {
                    return Promise.resolve(false);
                }
            }
        }
    }
    ojeventtarget.EventTargetMixin.applyMixin(SuppressNodeTreeDataProvider);

    exports.SuppressNodeTreeDataProvider = SuppressNodeTreeDataProvider;

    Object.defineProperty(exports, '__esModule', { value: true });

});
