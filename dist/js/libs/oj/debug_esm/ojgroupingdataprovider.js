/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import $ from 'jquery';
import { observableArray } from 'knockout';
import ArrayTreeDataProvider from 'ojs/ojarraytreedataprovider';
import ArrayDataProvider from 'ojs/ojarraydataprovider';
import { DataProviderMutationEvent, DataProviderRefreshEvent } from 'ojs/ojdataprovider';
import { EventTargetMixin } from 'ojs/ojeventtarget';
import KeyMap from 'ojs/ojmap';

/* jslint browser: true,devel:true*/
/**
 *
 * @export
 * @final
 * @class GroupingDataProvider
 * @implements TreeDataProvider
 * @classdesc This class implements {@link TreeDataProvider}.
 *            Wraps a flat {@link DataProvider} and groups the contents into tree data.
 * @param {DataProvider} dataProvider The {@link DataProvider} to be wrapped.
 *                                      <p>This DataProvider must provide flat data that are sorted in some order.</p>
 * @param {function(D, D): boolean} sortComparator The sort comparator function.
 *                                      <p>Given two data points, the sortComparator will return true if data2 should be sorted before data1
 *                                        and false if data2 should be sorted after data1</p>
 * @param {function(K): D} sectionRenderer The section renderer function
 *                                      <p>This function takes in a section key and returns data that will be provided to the view.
 *                                      </p>
 * @param {GroupingDataProvider.Options=} options the optional parameters.
 *
 * @ojsignature [{target: "Type",
 *               value: "class GroupingDataProvider<K, D> implements TreeDataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of output key"}, {"name": "D", "description": "Type of output data"}]},
 *               {target: "Type",
 *               value: "DataProvider<K, D>",
 *               for: "dataProvider"},
 *               {target: "Type",
 *               value: "GroupingDataProvider.Options<D>",
 *               for: "options"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 * "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
 * "FetchListResult","FetchListParameters"]}
 * @ojtsimport {module: "ojtreedataprovider", type: "AMD", importName: "TreeDataProvider"}
 * @ojtsimport {module: "ojarraydataprovider", type: "AMD", importName: "ArrayDataProvider"}
 * @ojtsmodule
 */

/**
 * @typedef {Object} GroupingDataProvider.Options
 * @property {function(D):Array.<string>=} groupByStrategy - The grouping mechanism.
 *                                      <p>Optional grouping mechanism. This allows for either a grouping function
 *                                      that will take in data and return a path Array of section keys from the root node
 *                                      to the item. The grouping mechanism can also be a string attribute of the data
 *                                      that will contain the path Array of section keys.</p>
 * @property {string=} keyAttributes - Optional attribute name(s) which stores the key in the data.
 *                                      <p>Can be a string denoting a single key attribute or an array
 *                                      of strings for multiple key attributes.  Dot notation can be used to specify nested attribute (e.g. 'attr.id').<br><br>
 *                                      If specified, caller must ensure that the keyAttributes contains values that are either unique within the entire tree,
 *                                      or unique among the siblings of each node.  In the latter case, Caller must also set the keyAttributesScope option to 'siblings'.<br>
 *                                      If keyAttributes is specified and keyAttributesScope is 'global', the attribute value will be used as the key.<br>
 *                                      If keyAttributes is specified and keyAttributesScope is 'siblings', a path array of the attribute values,
 *                                      starting from the root node, will be used as the key.<br>
 *                                      If keyAttributes is not specified, a path array of node index, starting from the root node, will be used as the key.</p>
 * @ojsignature [
 *  {target: "Type", value: "<D>", for: "genericTypeParameters"},
 *  {target: "Type", value: "string | Array.<string>", for: "keyAttributes"}
 * ]
 */

/**
 * Check if rows are contained by keys (default: local dataset)
 * FetchByKeysParameter scope may be set to "global" to check in global dataset
 *
 *
 * @param {FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<ContainsKeysResults>} Promise which resolves to {@link ContainsKeysResults}
 * @export
 * @expose
 * @memberof GroupingDataProvider
 * @instance
 * @method
 * @name containsKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>"}
 */

/**
 * Fetch rows by keys (default: local dataset)
 *
 * @param {FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<FetchByKeysResults>} Promise which resolves to {@link FetchByKeysResults}
 * @export
 * @expose
 * @memberof GroupingDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>"}
 */

/**
 * Fetch rows by offset.
 *
 *
 * @param {FetchByOffsetParameters} params Fetch by offset parameters
 * @return {Promise.<FetchByOffsetResults>} Promise which resolves to {@link FetchByOffsetResults}
 * @export
 * @expose
 * @memberof GroupingDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>"}
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
 * @memberof GroupingDataProvider
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
 * Determines whether this DataProvider supports certain feature.
 *
 * @param {string} capabilityName capability name. Supported capability names are:
 *                  "fetchByKeys", "fetchByOffset", and "sort".
 * @return {Object} capability information or null if unsupported
 * <ul>
 *   <li>If capabilityName is "fetchByKeys", returns a {@link FetchByKeysCapability} object.</li>
 *   <li>If capabilityName is "fetchByOffset", returns a {@link FetchByOffsetCapability} object.</li>
 *   <li>If capabilityName is "sort", returns a {@link SortCapability} object.</li>
 * </ul>
 * @export
 * @expose
 * @memberof GroupingDataProvider
 * @instance
 * @method
 * @name getCapability
 * @ojsignature {target: "Type",
 *               value: "(capabilityName?: string): any"}
 */

/**
 * Gets the total size of the data set
 *
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows.
 * @export
 * @expose
 * @memberof GroupingDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * Return a string that indicates if this data provider is empty
 *
 * @return {"yes"|"no"|"unknown"} a string that indicates if this data provider is empty. Valid values are:
 *                  "yes": this data provider is empty.
 *                  "no": this data provider is not empty.
 *                  "unknown": it is not known if this data provider is empty until a fetch is made.
 * @export
 * @expose
 * @memberof GroupingDataProvider
 * @instance
 * @method
 * @name isEmpty
 */
/**
 * Get a data provider for the children of the row identified by parentKey.
 *
 *
 * @param {any} parentKey key of the row to get child data provider for.
 * @return {TreeDataProvider | null} An TreeDataProvider if the row can (but doesn't have to) have children; or null if the row cannot have children.
 *   Use the <code class="prettyprint">isEmpty</code> method on the returned TreeDataProvider to determine if it currently has children.
 * @export
 * @expose
 * @memberof GroupingDataProvider
 * @instance
 * @method
 * @name getChildDataProvider
 * @ojsignature {target: "Type",
 *               value: "(parentKey: any): GroupingDataProvider<K, D>"}
 */
/**
 * Add a callback function to listen for a specific event type.
 *
 *
 * @export
 * @expose
 * @memberof GroupingDataProvider
 * @instance
 * @method
 * @name addEventListener
 * @param {string} eventType The event type to listen for.
 * @param {EventListener} listener The callback function that receives the event notification.
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * Remove a listener previously registered with addEventListener.
 *
 *
 * @export
 * @expose
 * @memberof GroupingDataProvider
 * @instance
 * @method
 * @name removeEventListener
 * @param {string} eventType The event type that the listener was registered for.
 * @param {EventListener} listener The callback function that was registered.
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * Dispatch an event and invoke any registered listeners.
 *
 *
 * @export
 * @expose
 * @memberof GroupingDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 * @param {Event} event The event object to dispatch.
 * @return {boolean} Return false if a registered listener has cancelled the event. Return true otherwise.
 * @ojsignature {target: "Type",
 *               value: "(evt: Event): boolean"}
 */

// end of jsdoc

class GroupingDataProvider {
    constructor(dataProvider, sortComparator, sectionRenderer, options) {
        var _a;
        this.dataProvider = dataProvider;
        this.sortComparator = sortComparator;
        this.sectionRenderer = sectionRenderer;
        this.options = options;
        this.GroupAsyncIterator = class {
            constructor(_parent, _baseIterable, _dataprovider, _params) {
                this._parent = _parent;
                this._baseIterable = _baseIterable;
                this._dataprovider = _dataprovider;
                this._params = _params;
            }
            ['next']() {
                let currentFetchedRootOffset = 0;
                if (this._parent._currentRootSection) {
                    currentFetchedRootOffset = Object.keys(this._parent._sections).indexOf(this._parent._currentRootSection);
                }
                const skipFetch = this._parent._currentBaseOffset < currentFetchedRootOffset;
                const doneOrSkip = skipFetch || this._parent._dataFetchComplete;
                return this._parent._getDataFromDataProvider(this._params, 'root', doneOrSkip).then((res) => {
                    if (res === 'error') {
                        return Promise.reject('Fetch interrupted due to refresh event');
                    }
                    this._parent._updateSectionIndex();
                    const updatedParams = new this._parent.FetchByOffsetParameters(this._parent, this._parent._currentBaseOffset, this._params.size, this._params.sortCriteria, this._params.filterCriterion);
                    return this._dataprovider.fetchByOffset(updatedParams).then((res) => {
                        const result = res['results'];
                        const data = result.map((value) => {
                            return value['data'];
                        });
                        const metadata = result.map((value) => {
                            return value['metadata'];
                        });
                        for (let i = 0; i < metadata.length; i++) {
                            metadata[i] = this._parent._getNodeMetadata(result[i].data);
                            data[i] = this._parent.sectionRenderer(metadata[i].key);
                        }
                        this._parent._currentBaseOffset = this._parent._currentBaseOffset + data.length;
                        if (res.done && this._parent._dataFetchComplete && data.length === 0) {
                            return Promise.resolve(new this._parent.AsyncIteratorReturnResult(this._parent, new this._parent.FetchListResult(this._parent, this._params, data, metadata)));
                        }
                        return Promise.resolve(new this._parent.AsyncIteratorYieldResult(this._parent, new this._parent.FetchListResult(this._parent, this._params, data, metadata)));
                    });
                });
            }
        };
        this.TreeAsyncIterator = class {
            constructor(_parent, _isParentSection, _parentKey, _dataprovider, _params) {
                this._parent = _parent;
                this._isParentSection = _isParentSection;
                this._parentKey = _parentKey;
                this._dataprovider = _dataprovider;
                this._params = _params;
                this._parent._registerIteratorOffset(this, this._parentKey, 0);
            }
            ['next']() {
                const internalOffset = this._parent._getIteratorOffset(this);
                const updatedParams = new this._parent.FetchByOffsetParameters(this._parent, internalOffset.offset, this._params.size, this._params.sortCriteria, this._params.filterCriterion);
                const totalSectionSize = this._parent._sections[this._parentKey].children().length;
                const skipFetch = totalSectionSize - internalOffset.offset > 0;
                const doneOrSkip = skipFetch || this._parent._dataFetchComplete;
                return this._parent
                    ._getDataFromDataProvider(this._params, this._parentKey, doneOrSkip)
                    .then((value) => {
                    if (value === 'error') {
                        return Promise.reject('Fetch interrupted due to refresh event');
                    }
                    else if (value === undefined) {
                        this._parent._updateSectionIndex();
                    }
                    return this._dataprovider.fetchByOffset(updatedParams).then((res) => {
                        const result = res['results'];
                        let doneValue = res.done;
                        const data = result.map((value) => {
                            return value['data'];
                        });
                        const metadata = result.map((value) => {
                            return this._parent._getNodeMetadata(value['data']);
                        });
                        if (this._isParentSection) {
                            for (let i = 0; i < metadata.length; i++) {
                                data[i] = this._parent.sectionRenderer(metadata[i].key);
                            }
                        }
                        this._parent._updateIteratorOffset(this, internalOffset.offset + data.length);
                        if (skipFetch && doneValue) {
                            const nextSectionId = this._parent._sections[this._parentKey].next;
                            if (!nextSectionId) {
                                doneValue = false;
                            }
                        }
                        if (doneValue && data.length === 0) {
                            return Promise.resolve(new this._parent.AsyncIteratorReturnResult(this._parent, new this._parent.FetchListResult(this._parent, this._params, data, metadata)));
                        }
                        return Promise.resolve(new this._parent.AsyncIteratorYieldResult(this._parent, new this._parent.FetchListResult(this._parent, this._params, data, metadata)));
                    });
                });
            }
        };
        this.TreeAsyncIterable = (_a = class {
                constructor(_parent, _asyncIterator) {
                    this._parent = _parent;
                    this._asyncIterator = _asyncIterator;
                    this[Symbol.asyncIterator] = () => {
                        return this._asyncIterator;
                    };
                }
            },
            Symbol.asyncIterator,
            _a);
        this.FetchListParameters = class {
            constructor(_parent, size, sortCriteria, attributes) {
                this._parent = _parent;
                this.size = size;
                this.sortCriteria = sortCriteria;
                this.attributes = attributes;
                this['size'] = size;
                this['sortCriteria'] = sortCriteria;
                this['attributes'] = attributes;
            }
        };
        this.FetchByOffsetParameters = class {
            constructor(_parent, offset, size, sortCriteria, filterCriterion) {
                this._parent = _parent;
                this.offset = offset;
                this.size = size;
                this.sortCriteria = sortCriteria;
                this.filterCriterion = filterCriterion;
                this['size'] = size;
                this['sortCriteria'] = sortCriteria;
                this['offset'] = offset;
                this['filterCriterion'] = filterCriterion;
            }
        };
        this.FetchListResult = class {
            constructor(_parent, fetchParameters, data, metadata) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.data = data;
                this.metadata = metadata;
                this['fetchParameters'] = fetchParameters;
                this['data'] = data;
                this['metadata'] = metadata;
            }
        };
        this.AsyncIteratorYieldResult = class {
            constructor(_parent, value) {
                this._parent = _parent;
                this.value = value;
                this['value'] = value;
                this['done'] = false;
            }
        };
        this.AsyncIteratorReturnResult = class {
            constructor(_parent, value) {
                this._parent = _parent;
                this.value = value;
                this['value'] = value;
                this['done'] = true;
            }
        };
        this._dataProvider = dataProvider;
        this._addEventListeners(this._dataProvider);
        this._initialize();
    }
    containsKeys(params) {
        return this.fetchByKeys(params).then((fetchByKeysResult) => {
            const results = new Set();
            params['keys'].forEach((key) => {
                if (fetchByKeysResult['results'].get(key) != null) {
                    results.add(key);
                }
            });
            return Promise.resolve({ containsParameters: params, results });
        });
    }
    getCapability(capabilityName) {
        if (capabilityName === 'filter') {
            return null;
        }
        return this._baseDataProvider.getCapability(capabilityName);
    }
    getTotalSize() {
        return this._baseDataProvider.getTotalSize();
    }
    isEmpty() {
        return this._baseDataProvider.isEmpty();
    }
    getChildDataProvider(parentKey) {
        const children = this._getChildren(parentKey);
        const isParentSection = this._isParentSection(parentKey);
        class SectionTreeDataProvider {
            constructor(parent, sections, params) {
                this.parent = parent;
                this.sections = sections;
                this.params = params;
                this.containsKeys = function (params) {
                    return this._baseTreeDataProvider.containsKeys(params);
                };
                this.getCapability = function (capabilityName) {
                    return this._baseTreeDataProvider.getCapability(capabilityName);
                };
                this.getTotalSize = function () {
                    return this._baseTreeDataProvider.getTotalSize();
                };
                this.isEmpty = function () {
                    return this._baseTreeDataProvider.isEmpty();
                };
                this.fetchByOffset = function (params) {
                    return this._baseTreeDataProvider.fetchByOffset(params);
                };
                this.fetchByKeys = function (params) {
                    return this._baseTreeDataProvider.fetchByKeys(params);
                };
                this.getChildDataProvider = function (parentKey, options) {
                    return this._parent.getChildDataProvider(parentKey);
                };
                this.fetchFirst = function (params) {
                    if (params && params.filterCriterion) {
                        params = $.extend({}, params);
                        params.filterCriterion = null;
                    }
                    const baseDataProvider = this._baseDataProvider;
                    const _isParentSection = this._isParentSection;
                    const parentKey = this._parentKey;
                    return this._parent._getTreeIterator(_isParentSection, parentKey, baseDataProvider, params);
                };
                this._getId = function (key) {
                    return this._parent._getId(key);
                };
                this._parent = parent;
                this._parentKey = params.parentKey;
                this._isParentSection = params.isParentSection;
                if (this._isParentSection) {
                    this._baseDataProvider = new ArrayDataProvider(sections.childData, {});
                    this._baseTreeDataProvider = new ArrayTreeDataProvider(sections.childData, {
                        keyAttributes: params.keyAttributes
                    });
                }
                else {
                    this._baseDataProvider = new ArrayDataProvider(sections.children, {
                        keyAttributes: params.keyAttributes
                    });
                    this._baseTreeDataProvider = new ArrayTreeDataProvider(sections.children, {
                        keyAttributes: params.keyAttributes
                    });
                }
            }
        }
        if (children) {
            return new SectionTreeDataProvider(this, this._sections[parentKey], {
                keyAttributes: this._getKeyAttribute(),
                parentKey,
                isParentSection
            });
        }
        return null;
    }
    fetchFirst(params) {
        if (params && params.filterCriterion) {
            params = $.extend({}, params);
            params.filterCriterion = null;
        }
        const baseIterable = this._baseDataProvider.fetchFirst(params);
        this._initializeTreeCache();
        return this._getGroupIterator(baseIterable, this._baseDataProvider, params);
    }
    fetchByOffset(params) {
        const basePromise = this._baseDataProvider.fetchByOffset(params);
        return basePromise.then((result) => {
            const results = result.results;
            const newResults = [];
            for (const result of results) {
                const data = result['data'];
                const metadata = this._getNodeMetadata(data);
                newResults.push({ data, metadata });
            }
            return {
                done: result['done'],
                fetchParameters: result['fetchParameters'],
                results: newResults
            };
        });
    }
    fetchByKeys(params) {
        const results = new Map();
        params['keys'].forEach((key) => {
            const node = this._getNodeForKey(key);
            if (node) {
                results.set(key, {
                    metadata: { key },
                    data: node
                });
            }
        });
        return Promise.resolve({
            fetchParameters: params,
            results
        });
    }
    _getTreeIterator(isParentSection, parentKey, baseDataProvider, params) {
        return new this.TreeAsyncIterable(this, new this.TreeAsyncIterator(this, isParentSection, parentKey, baseDataProvider, params));
    }
    _getGroupIterator(baseIterable, baseDataProvider, params) {
        return new this.TreeAsyncIterable(this, new this.GroupAsyncIterator(this, baseIterable, baseDataProvider, params));
    }
    _getChildren(sectionKey) {
        if (this._sections[sectionKey]) {
            return this._sections[sectionKey].children;
        }
        return null;
    }
    _isParentSection(sectionKey) {
        if (sectionKey in this._sections) {
            const parentSection = this._sections[sectionKey];
            if (parentSection &&
                parentSection.children().length > 0 &&
                this._sections[parentSection.children()[0]]) {
                return true;
            }
        }
        return false;
    }
    _initialize() {
        this._mapKeyToNode = new Map();
        this._mapNodeToKey = new KeyMap();
        this._sections = {};
        this._sectionRoots = observableArray();
        this._sectionRootData = observableArray();
        this._dataFetchComplete = false;
        this._internalIterator = null;
        this.treeData = observableArray([]);
        this._initializeTreeCache();
        this._createSections();
        this._storedAddSection = [];
        this._storedAddSectionKeys = [];
        this._storedRemoveSection = [];
        this._baseDataProvider = null;
        this._processSectionsArray([]);
    }
    _initializeTreeCache() {
        this._treeKeyMap = [];
        this._treeMetadata = [];
        this._treeData = [];
        this._currentFirstSection = null;
        this._currentSectionKey = null;
        this._currentRootSection = null;
        this._currentSectionData = [];
        this._currentOffset = 0;
        this._currentBaseOffset = 0;
        this._iteratorOffsets = new Map();
        this._dataFetchComplete = false;
        this._internalIterator = null;
    }
    _registerIteratorOffset(dataprovider, parentKey, initialOffset) {
        this._iteratorOffsets.set(dataprovider, { parentKey, offset: initialOffset });
    }
    _getIteratorOffset(dataprovider) {
        return this._iteratorOffsets.get(dataprovider);
    }
    _updateIteratorOffset(dataprovider, newOffset) {
        const originalValue = this._iteratorOffsets.get(dataprovider);
        originalValue.offset = newOffset;
        this._iteratorOffsets.set(dataprovider, originalValue);
    }
    _getRootDataProvider() {
        return this;
    }
    _getDataFromDataProvider(params, source, skipFetch) {
        if (!this._inCurrentFetchingSection(source) || skipFetch) {
            return Promise.resolve('skip');
        }
        let iterator = this._internalIterator;
        if (!this._internalIterator) {
            iterator = this._dataProvider.fetchFirst(params)[Symbol.asyncIterator]();
            this._internalIterator = iterator;
            this._previousTotalSize = 0;
            this._internalIteratorCacheLength = 0;
        }
        if (this._previousTotalSize !== this._treeData.length) {
            this._internalIteratorCacheLength = 0;
        }
        return new Promise((resolve) => {
            this._internalIteratorResolve = resolve;
            const helperFunction = (storedDataLength, iterator) => {
                return this._internalIterator.next().then((result) => {
                    if (this._internalIterator != null && this._internalIterator === iterator) {
                        this._treeData = this._treeData.concat(result['value']['data']);
                        this._treeMetadata = this._treeMetadata.concat(result['value']['metadata']);
                        result['value']['metadata'].forEach((val) => {
                            this._treeKeyMap.push(val.key);
                        });
                        storedDataLength += result['value']['data'].length;
                        if (result['done']) {
                            this._dataFetchComplete = true;
                        }
                        else {
                            this._dataFetchComplete = false;
                        }
                        if (result['done'] || storedDataLength >= result['value']['fetchParameters']['size']) {
                            const remainder = storedDataLength - result['value']['fetchParameters']['size'];
                            this._internalIteratorCacheLength = Math.max(0, remainder);
                            this._previousTotalSize = this._treeData.length;
                            this._internalIteratorResolve(undefined);
                            this._internalIteratorResolve = null;
                        }
                        else {
                            return helperFunction(storedDataLength, iterator);
                        }
                    }
                });
            };
            return helperFunction(this._internalIteratorCacheLength, iterator);
        });
    }
    _inCurrentFetchingSection(source) {
        if (source === 'root') {
            return true;
        }
        if (this._currentSectionKey === source) {
            return true;
        }
        return false;
    }
    _processSectionsArray(parentKeyPath) {
        if (!this._baseDataProvider) {
            this._baseDataProvider = new oj['ArrayDataProvider'](this.treeData, null);
        }
    }
    _processNode(node, parentKeyPath, nodeKey) {
        const keyObj = { key: null, keyPath: null };
        keyObj.key = nodeKey;
        keyObj.keyPath = parentKeyPath;
        keyObj.keyPath.push(nodeKey);
        this._setMapEntry(keyObj.key, node);
        return keyObj;
    }
    _createSections() {
        if (!this.options || !this.options.groupByStrategy) {
            const cutoffs = [];
            const now = new Date(Date.now());
            cutoffs.push(now);
            let nowTemp = new Date(Date.now());
            const previous1 = nowTemp.setDate(now.getDate() - 1);
            const previous2 = nowTemp.setDate(now.getDate() - 7);
            cutoffs.push(previous1);
            cutoffs.push(previous2);
            nowTemp = new Date(Date.now());
            const previous3 = nowTemp.setMonth(now.getMonth() - 1);
            cutoffs.push(previous3);
            nowTemp = new Date(Date.now());
            const previous4 = nowTemp.setFullYear(now.getFullYear() - 1);
            cutoffs.push(previous4);
            this._groupingFunction = (item) => {
                const labels = [
                    'In the past day',
                    'In the past week',
                    'In the past month',
                    'In the past year',
                    'Earlier'
                ];
                if (item && item['date']) {
                    const date = new Date(item['date']);
                    let counter = 1;
                    while (date < cutoffs[counter] && counter !== 5) {
                        counter++;
                    }
                    return [labels[counter - 1]];
                }
                return ['Section 1'];
            };
        }
        else if (typeof this.options.groupByStrategy === 'function') {
            this._groupingFunction = this.options.groupByStrategy;
        }
        else if (typeof this.options.groupByStrategy === 'string') {
            this._groupingFunction = (item) => {
                return this._getVal(item, this.options.groupByStrategy);
            };
        }
        if (this.treeData) {
            this.treeData.valueHasMutated();
        }
    }
    _getSectionKeyFromArray(label) {
        if (label) {
            if (Array.isArray(label) && label.length > 0) {
                return label[label.length - 1];
            }
            else if (typeof label === 'string') {
                return label;
            }
        }
        return null;
    }
    _insertSection(keyParams, leafParams, depth) {
        const newSection = {
            parent: keyParams.parentKey,
            key: keyParams.newKey,
            children: observableArray([]),
            childData: observableArray([]),
            previous: keyParams.previousKey,
            next: keyParams.nextKey,
            previousLeaf: leafParams.previousLeaf,
            nextLeaf: leafParams.nextLeaf,
            depth,
            active: true
        };
        this._sections[keyParams.newKey] = newSection;
        this._sections[keyParams.newKey].index = function () {
            const parent = newSection.parent;
            const key = newSection.key;
            if (parent != null) {
                return this._sections[parent].children.indexOf(key);
            }
            else {
                return this._sectionRoots.indexOf(key);
            }
        }.bind(this);
        this._sections[keyParams.newKey].cutoffIndex = function () {
            const key = newSection.key;
            return (this._getCutoffIndex(this._sections[key].previousLeaf) +
                this._sections[key].children().length);
        }.bind(this);
    }
    _createNewSection(newSectionKey, needsMutationEvent, sectionMapping, previousKey, nextKey) {
        const depth = sectionMapping.indexOf(newSectionKey);
        let parentKey = null;
        if (depth !== 0) {
            parentKey = sectionMapping[depth - 1];
        }
        let parentSectionChildrenArray;
        let parentSectionChildDataArray;
        let previousLeaf = null;
        let nextLeaf = null;
        const leafNode = depth === this._getDepth(sectionMapping);
        let rootNode = false;
        if (leafNode) {
            previousLeaf = previousKey;
            nextLeaf = nextKey;
        }
        if (parentKey != null) {
            if (!(parentKey in this._sections && this._sections[parentKey].active)) {
                this._createNewSection(parentKey, needsMutationEvent, sectionMapping, previousKey, nextKey);
                if (needsMutationEvent) {
                    needsMutationEvent = false;
                }
            }
            parentSectionChildrenArray = this._sections[parentKey].children;
            parentSectionChildDataArray = this._sections[parentKey].childData;
        }
        else {
            parentSectionChildrenArray = this._sectionRoots;
            parentSectionChildDataArray = this._sectionRootData;
            rootNode = true;
        }
        let previousNode = null;
        if (nextKey == null) {
            if (previousKey == null) {
                if (parentSectionChildrenArray().length > 0) {
                    previousKey = parentSectionChildrenArray()[parentSectionChildrenArray().length - 1];
                    if (leafNode) {
                        previousLeaf = previousKey;
                    }
                }
                parentSectionChildrenArray.push(newSectionKey);
                parentSectionChildDataArray.push(this.sectionRenderer(newSectionKey));
            }
            else {
                previousNode = this._sections[previousKey];
                while (previousNode.depth > depth) {
                    previousNode = this._sections[this._sections[previousKey].parent];
                }
                if (previousNode.depth === depth) {
                    previousKey = previousNode.key;
                    const newIndex = parentSectionChildrenArray.indexOf(previousKey);
                    if (newIndex >= 0) {
                        parentSectionChildrenArray.splice(newIndex + 1, 0, newSectionKey);
                        parentSectionChildDataArray.splice(newIndex + 1, 0, this.sectionRenderer(newSectionKey));
                    }
                    else {
                        parentSectionChildrenArray.push(newSectionKey);
                        parentSectionChildDataArray.push(this.sectionRenderer(newSectionKey));
                    }
                    nextKey = previousNode.next;
                }
                else {
                    previousKey = null;
                    nextKey = null;
                    parentSectionChildrenArray.push(newSectionKey);
                    parentSectionChildDataArray.push(this.sectionRenderer(newSectionKey));
                }
            }
        }
        else {
            let nextNode = this._sections[nextKey];
            while (nextNode.depth > depth) {
                nextNode = this._sections[this._sections[nextKey].parent];
            }
            if (nextNode.depth === depth) {
                nextKey = nextNode.key;
                const newIndex = parentSectionChildrenArray.indexOf(nextKey);
                if (newIndex >= 0) {
                    parentSectionChildrenArray.splice(newIndex, 0, newSectionKey);
                    parentSectionChildDataArray.splice(newIndex, 0, this.sectionRenderer(newSectionKey));
                }
                else {
                    parentSectionChildrenArray.push(newSectionKey);
                    parentSectionChildDataArray.push(this.sectionRenderer(newSectionKey));
                }
                previousKey = nextNode.previous;
            }
            else {
                previousKey = null;
                nextKey = null;
                parentSectionChildrenArray.push(newSectionKey);
                parentSectionChildDataArray.push(this.sectionRenderer(newSectionKey));
            }
        }
        if (!(newSectionKey in this._sections)) {
            this._insertSection({ newKey: newSectionKey, parentKey, previousKey, nextKey }, { previousLeaf, nextLeaf }, depth);
        }
        else {
            this._sections[newSectionKey].active = true;
            this._sections[newSectionKey].previous = previousKey;
            this._sections[newSectionKey].next = nextKey;
            this._sections[newSectionKey].previousLeaf = previousLeaf;
            this._sections[newSectionKey].nextLeaf = nextLeaf;
            this._sections[newSectionKey].parent = parentKey;
        }
        if (previousKey != null) {
            this._sections[previousKey].next = newSectionKey;
        }
        if (nextKey != null) {
            this._sections[nextKey].previous = newSectionKey;
        }
        if (depth === this._getDepth(sectionMapping)) {
            if (previousLeaf != null) {
                this._sections[previousLeaf].nextLeaf = newSectionKey;
            }
            if (nextLeaf != null) {
                this._sections[nextLeaf].previousLeaf = newSectionKey;
            }
        }
        if (depth === this._getDepth(sectionMapping) &&
            (nextKey == this._currentFirstSection || this._currentFirstSection == null)) {
            this._currentFirstSection = newSectionKey;
        }
        let addBeforeKeys = null;
        if (nextKey != null) {
            addBeforeKeys = [nextKey];
        }
        const data = this.sectionRenderer(newSectionKey);
        this._processNode(data, [], newSectionKey);
        if (needsMutationEvent &&
            this._storedAddSectionKeys.indexOf(this._sections[newSectionKey].parent) === -1) {
            const keys = newSectionKey;
            const metadata = {
                key: newSectionKey
            };
            const index = this._sections[newSectionKey].index();
            const addEvent = {
                data: [data],
                indexes: [index],
                keys: new Set([keys]),
                metadata: [metadata],
                addBeforeKeys,
                parentKeys: [parentKey]
            };
            const mutationEvent = new DataProviderMutationEvent({
                add: addEvent,
                remove: null,
                update: null
            });
            this._storedAddSection.push(mutationEvent);
            this._storedAddSectionKeys.push(newSectionKey);
            if (!this._dataFetchComplete && rootNode && this._currentBaseOffset > index) {
                this._currentBaseOffset++;
            }
            if (!this._dataFetchComplete) {
                for (const [key, value] of this._iteratorOffsets) {
                    if (value.parentKey === parentKey && value.offset > index) {
                        value.offset++;
                    }
                    this._updateIteratorOffset(key, value.offset);
                }
            }
        }
        this.treeData.valueHasMutated();
    }
    _removeSection(sectionKey) {
        const sectionData = this._sections[sectionKey];
        const parent = sectionData.parent;
        const previous = sectionData.previous;
        const next = sectionData.next;
        const previousLeaf = sectionData.previousLeaf;
        const nextLeaf = sectionData.nextLeaf;
        let needsMutationEvent = true;
        if (this._sections[next] && this._sections[next].previous === sectionKey) {
            this._sections[next].previous = sectionData.previous;
        }
        if (this._sections[previous] && this._sections[previous].next === sectionKey) {
            this._sections[previous].next = sectionData.next;
        }
        if (this._sections[nextLeaf] && this._sections[nextLeaf].previousLeaf === sectionKey) {
            this._sections[nextLeaf].previousLeaf = sectionData.previousLeaf;
        }
        if (this._sections[previousLeaf] && this._sections[previousLeaf].nextLeaf === sectionKey) {
            this._sections[previousLeaf].nextLeaf = sectionData.nextLeaf;
        }
        if (this._sections[parent] && this._sections[parent].children.indexOf(sectionKey) !== -1) {
            const childIndex = this._sections[parent].children.indexOf(sectionKey);
            if (!this._dataFetchComplete) {
                for (const [key, value] of this._iteratorOffsets) {
                    if (value.parentKey === parent && value.offset > childIndex) {
                        value.offset--;
                    }
                    this._updateIteratorOffset(key, value.offset);
                }
            }
            this._sections[parent].children.splice(childIndex, 1);
            this._sections[parent].childData.splice(childIndex, 1);
            if (this._sections[parent].children().length === 0) {
                this._removeSection(parent);
                if (needsMutationEvent) {
                    needsMutationEvent = false;
                }
            }
        }
        this._sections[sectionKey].active = false;
        this._sections[sectionKey].children([]);
        this._sections[sectionKey].childData([]);
        if (this._sections[sectionKey].parent == null) {
            const rootIndex = this._sectionRoots.indexOf(sectionKey);
            this._sectionRoots.splice(rootIndex, 1);
            this._sectionRootData.splice(rootIndex, 1);
            if (!this._dataFetchComplete && this._currentBaseOffset > rootIndex) {
                this._currentBaseOffset--;
            }
        }
        if (sectionKey === this._currentFirstSection) {
            this._currentFirstSection = next;
        }
        if (needsMutationEvent) {
            const data = this.sectionRenderer(sectionKey);
            const keys = sectionKey;
            const metadata = {
                key: sectionKey
            };
            const removeEvent = {
                data: [data],
                indexes: null,
                keys: new Set([keys]),
                metadata: [metadata]
            };
            const mutationEvent = new DataProviderMutationEvent({
                add: null,
                remove: removeEvent,
                update: null
            });
            this._storedRemoveSection.push(mutationEvent);
        }
        this.treeData.valueHasMutated();
    }
    _updateSectionIndex() {
        for (let i = this._currentOffset; i < this._treeData.length; i++) {
            const data = this._treeData[i];
            const key = this._treeKeyMap[i];
            this._processNode(data, [], key);
            const newSectionLabel = this._groupingFunction(data);
            const itemSectionKey = this._getSectionKeyFromArray(newSectionLabel);
            if (this._currentSectionKey == null) {
                if (!(itemSectionKey in this._sections)) {
                    this._createNewSection(itemSectionKey, false, newSectionLabel, this._currentSectionKey, null);
                }
                this._currentSectionKey = itemSectionKey;
                this._currentRootSection = this._getSectionArray(newSectionLabel)[0];
            }
            if (itemSectionKey === this._currentSectionKey) {
                this._currentSectionData.push(data);
            }
            else {
                if (!(itemSectionKey in this._sections && this._sections[itemSectionKey].active)) {
                    this._createNewSection(itemSectionKey, false, newSectionLabel, this._currentSectionKey, null);
                }
                this._sections[this._currentSectionKey].children(this._currentSectionData);
                this._sections[this._currentSectionKey].childData(this._getChildDataFromChildren(this._currentSectionKey));
                this._currentSectionKey = itemSectionKey;
                this._currentRootSection = this._getSectionArray(newSectionLabel)[0];
                this._currentSectionData = [data];
            }
            this._currentOffset++;
        }
        if (this._currentSectionData.length > 0) {
            this._sections[this._currentSectionKey].children(this._currentSectionData);
            this._sections[this._currentSectionKey].childData(this._getChildDataFromChildren(this._currentSectionKey));
        }
        const rootSections = [];
        for (const sectionKey in this._sections) {
            if (this._sections[sectionKey].parent == null) {
                rootSections.push(this.sectionRenderer(sectionKey));
            }
        }
        this.treeData(rootSections);
        this.treeData.valueHasMutated();
    }
    _getSectionArray(sectionMapping) {
        if (Array.isArray(sectionMapping)) {
            return sectionMapping;
        }
        else {
            return [sectionMapping];
        }
    }
    _getChildDataFromChildren(sectionKey) {
        const childData = [];
        this._sections[sectionKey].children().forEach((child) => {
            childData.push(this.sectionRenderer(child));
        });
        return childData;
    }
    _getKeyAttribute() {
        let keyAttributes = this.options != null ? this.options['keyAttributes'] : null;
        if (!keyAttributes) {
            keyAttributes = 'id';
        }
        return keyAttributes;
    }
    _getId(row) {
        let id;
        let keyAttributes = this.options != null ? this.options['keyAttributes'] : null;
        if (!keyAttributes) {
            keyAttributes = 'id';
        }
        if (keyAttributes != null) {
            if (Array.isArray(keyAttributes)) {
                let i;
                id = [];
                for (i = 0; i < keyAttributes.length; i++) {
                    id[i] = this._getVal(row, keyAttributes[i]);
                }
            }
            else if (keyAttributes === '@value') {
                id = this._getAllVals(row);
            }
            else {
                id = this._getVal(row, keyAttributes);
            }
            return id;
        }
        else {
            return null;
        }
    }
    _getDepth(sectionMapping) {
        if (Array.isArray(sectionMapping)) {
            return sectionMapping.length - 1;
        }
        else {
            return 0;
        }
    }
    _getVal(val, attr, keepFunc = false) {
        if (typeof attr === 'string') {
            const dotIndex = attr.indexOf('.');
            if (dotIndex > 0) {
                const startAttr = attr.substring(0, dotIndex);
                const endAttr = attr.substring(dotIndex + 1);
                const subObj = val[startAttr];
                if (subObj) {
                    return this._getVal(subObj, endAttr);
                }
            }
        }
        if (keepFunc !== true && typeof val[attr] === 'function') {
            return val[attr]();
        }
        return val[attr];
    }
    _getAllVals(val) {
        return Object.keys(val).map((key) => {
            return this._getVal(val, key);
        });
    }
    _getNodeMetadata(node) {
        let key = this._getKeyForNode(node);
        if (key == null) {
            key = this._getId(node);
        }
        return { key };
    }
    _getNodeForKey(key) {
        const rootDataProvider = this._getRootDataProvider();
        return rootDataProvider._mapKeyToNode.get(JSON.stringify(key));
    }
    _getKeyForNode(node) {
        const rootDataProvider = this._getRootDataProvider();
        return rootDataProvider._mapNodeToKey.get(node);
    }
    _setMapEntry(key, node) {
        const rootDataProvider = this._getRootDataProvider();
        rootDataProvider._mapKeyToNode.set(JSON.stringify(key), node);
        rootDataProvider._mapNodeToKey.set(node, key);
    }
    _addData(event) {
        const data = event.data;
        const metadata = event.metadata;
        let addBeforeKeys = event.addBeforeKeys;
        const indexes = event.indexes;
        const keys = [];
        event.keys.forEach((key) => {
            keys.push(key);
        });
        if (indexes != null && indexes.length > 0) {
            const sortedIndexes = indexes.slice(0).sort();
            for (const sortedIndex of sortedIndexes) {
                const originalIndex = indexes.indexOf(sortedIndex);
                this._treeData.splice(sortedIndex, 0, data[originalIndex]);
                this._treeMetadata.splice(sortedIndex, 0, metadata[originalIndex]);
                this._treeKeyMap.splice(sortedIndex, 0, keys[originalIndex]);
            }
            if (addBeforeKeys == null || addBeforeKeys.length === 0) {
                addBeforeKeys = [];
                for (const index of indexes) {
                    const beforeKey = index + 1 < this._treeKeyMap.length ? this._treeKeyMap[index + 1] : null;
                    addBeforeKeys.push(beforeKey);
                }
            }
        }
        else {
            const orderedData = [];
            const orderedMetaData = [];
            const orderedKeys = [];
            let counter = 0;
            let added = false;
            data.forEach((value, ind) => {
                added = false;
                if (orderedData.length !== 0) {
                    while (counter < orderedData.length && !added) {
                        if (this.sortComparator(value, orderedData[counter])) {
                            orderedData.splice(counter, 0, value);
                            orderedMetaData.splice(counter, 0, metadata[ind]);
                            orderedKeys.splice(counter, 0, keys[ind]);
                            added = true;
                        }
                        else {
                            counter++;
                        }
                    }
                }
                if (!added) {
                    orderedData.push(value);
                    orderedMetaData.push(metadata[ind]);
                    orderedKeys.push(keys[ind]);
                }
            });
            counter = this._treeData.length - 1;
            const addBeforeKeysMap = {};
            orderedData.forEach((value, ind) => {
                const newData = value;
                const newMetadata = orderedMetaData[ind];
                const newKey = orderedKeys[ind];
                added = false;
                while (counter >= 0 && !added) {
                    if (this.sortComparator(newData, this._treeData[counter])) {
                        if (counter + 1 !== this._treeData.length) {
                            this._treeData.splice(counter + 1, 0, newData);
                            this._treeMetadata.splice(counter + 1, 0, newMetadata);
                            addBeforeKeysMap[this._getId(newData)] = this._treeKeyMap[counter + 1];
                            this._treeKeyMap.splice(counter + 1, 0, newKey);
                        }
                        else {
                            this._treeData.push(newData);
                            this._treeMetadata.push(newMetadata);
                            addBeforeKeysMap[this._getId(newData)] = null;
                            this._treeKeyMap.push(newKey);
                        }
                        added = true;
                    }
                    else {
                        counter--;
                    }
                }
                if (!added) {
                    this._treeData.splice(0, 0, newData);
                    this._treeMetadata.splice(0, 0, newMetadata);
                    addBeforeKeysMap[this._getId(newData)] = this._treeKeyMap[0];
                    this._treeKeyMap.splice(0, 0, newKey);
                    counter = 0;
                }
            });
            addBeforeKeys = [];
            data.forEach((value) => {
                addBeforeKeys.push(addBeforeKeysMap[this._getId(value)]);
            });
        }
        return addBeforeKeys;
    }
    _handleAdd(event) {
        const newData = [];
        const addBeforeKeys = this._addData(event);
        if (!event.addBeforeKeys || event.addBeforeKeys.length === 0) {
            event.addBeforeKeys = addBeforeKeys;
        }
        event.keys.forEach((key) => {
            const i = newData.length;
            const itemData = event.data[i];
            const addBeforeKey = addBeforeKeys[i];
            newData.push({ addBeforeKey, key, data: itemData });
        });
        const parentKeys = [];
        const newAddedSections = [];
        const keepInd = [];
        const indexMap = this._getIndexFromKeys(event.keys);
        if (!event.indexes || event.indexes.length === 0) {
            event.indexes = [];
        }
        event.data.forEach((value, ind) => {
            this._processNode(value, [], newData[ind].key);
            const sectionLabel = this._groupingFunction(value);
            let sectionId = this._getSectionKeyFromArray(sectionLabel);
            let previousSectionId;
            let nextSectionId;
            if (!(sectionId in this._sections && this._sections[sectionId].active)) {
                if (indexMap[ind] !== 0) {
                    previousSectionId = this._getSectionKeyFromArray(this._groupingFunction(this._treeData[indexMap[ind] - 1]));
                    nextSectionId = this._sections[previousSectionId].nextLeaf;
                }
                else {
                    previousSectionId = null;
                }
                if (indexMap[ind] + 1 < this._treeData.length && previousSectionId == null) {
                    nextSectionId = this._currentFirstSection;
                }
                this._createNewSection(sectionId, true, sectionLabel, previousSectionId, nextSectionId);
                sectionId = this._getSectionKeyFromArray(sectionLabel);
                newAddedSections.push(sectionId);
            }
            else if (newAddedSections.indexOf(sectionId) === -1) {
                keepInd.push(ind);
            }
            const childrenArray = this._sections[sectionId].children;
            const childDataArray = this._sections[sectionId].childData;
            previousSectionId = this._sections[sectionId].previousLeaf;
            let previousCutoffIndex = 0;
            if (previousSectionId != null) {
                previousCutoffIndex = this._sections[previousSectionId].cutoffIndex();
            }
            childrenArray.splice(indexMap[ind] - previousCutoffIndex, 0, value);
            childDataArray.splice(indexMap[ind] - previousCutoffIndex, 0, this.sectionRenderer(value));
            parentKeys.push(sectionId);
            event.indexes[ind] = indexMap[ind] - previousCutoffIndex;
            if (event.addBeforeKeys[ind] != null && ind === event.data.length - 1) {
                const addBeforeDataSection = this._getSectionKeyFromArray(this._groupingFunction(this._treeData[this._treeKeyMap.indexOf(event.addBeforeKeys[ind])]));
                if (addBeforeDataSection !== sectionId) {
                    event.addBeforeKeys[ind] = null;
                }
            }
        });
        event.parentKeys = parentKeys;
        if (newAddedSections.length > 0) {
            let counter = 0;
            const newData = [];
            const newKeys = [];
            const newMetadata = [];
            const newParentKeys = [];
            const newIndexes = [];
            const newAddBeforeKeys = [];
            event.keys.forEach((value) => {
                if (keepInd.indexOf(counter) !== -1) {
                    newKeys.push(value);
                    newData.push(event.data[counter]);
                    newMetadata.push(event.metadata[counter]);
                    newParentKeys.push(event.parentKeys[counter]);
                    newIndexes.push(event.indexes[counter]);
                    newAddBeforeKeys.push(event.addBeforeKeys[counter]);
                }
                counter++;
            });
            if (newKeys.length > 0) {
                event = {
                    data: newData,
                    keys: new Set(newKeys),
                    metadata: newMetadata,
                    parentKeys: newParentKeys,
                    indexes: newIndexes,
                    addBeforeKeys: newAddBeforeKeys
                };
            }
            else {
                event = null;
            }
        }
        return event;
    }
    _handleRemove(event) {
        const indexMap = this._getIndexFromKeys(event.keys);
        this._removeKeys(event.keys);
        const removeDataIndex = [];
        const removeIndex = [];
        for (const updateInd of indexMap) {
            const item = this._treeData[updateInd];
            const oldKey = this._treeKeyMap[updateInd];
            const oldNode = this._mapKeyToNode.get(JSON.stringify(oldKey));
            this._mapKeyToNode.delete(JSON.stringify(oldKey));
            this._mapNodeToKey.delete(oldNode);
            const sectionId = this._getSectionKeyFromArray(this._groupingFunction(item));
            const previousSectionId = this._sections[sectionId].previousLeaf;
            let previousCutoffIndex = 0;
            if (previousSectionId != null) {
                previousCutoffIndex = this._sections[previousSectionId].cutoffIndex();
            }
            removeDataIndex.push({ ind: updateInd - previousCutoffIndex, sectionId });
            removeIndex.push(updateInd);
        }
        removeDataIndex.sort((a, b) => {
            return b.ind - a.ind;
        });
        removeIndex.sort((a, b) => {
            return b - a;
        });
        for (let i = 0; i < removeDataIndex.length; i++) {
            const sectionId = removeDataIndex[i].sectionId;
            const dataArray = this._sections[sectionId].children;
            dataArray.splice(removeDataIndex[i].ind, 1);
            if (dataArray().length === 0) {
                this._removeSection(sectionId);
            }
            this._treeData.splice(removeIndex[i], 1);
            this._treeMetadata.splice(removeIndex[i], 1);
        }
    }
    _handleUpdate(event) {
        const indexMap = this._getIndexFromKeys(event.keys);
        event.data.forEach((value, ind) => {
            const updateInd = indexMap[ind];
            const item = this._treeData[updateInd];
            const oldKey = this._treeKeyMap[updateInd];
            const oldNode = this._mapKeyToNode.get(JSON.stringify(oldKey));
            this._mapNodeToKey.delete(oldNode);
            this._setMapEntry(oldKey, item);
            const sectionId = this._getSectionKeyFromArray(this._groupingFunction(item));
            const dataArray = this._sections[sectionId].children;
            const previousSectionId = this._sections[sectionId].previousLeaf;
            let previousCutoffIndex = 0;
            if (previousSectionId != null) {
                previousCutoffIndex = this._sections[previousSectionId].cutoffIndex();
            }
            dataArray.splice(updateInd - previousCutoffIndex, 1, value);
            this._treeData[updateInd] = value;
        });
    }
    _getCutoffIndex(sectionKey) {
        if (sectionKey != null) {
            return this._sections[sectionKey].cutoffIndex();
        }
        return 0;
    }
    _getIndexFromKeys(keys) {
        const indexMap = [];
        keys.forEach((key) => {
            indexMap.push(this._treeKeyMap.indexOf(key));
        });
        return indexMap;
    }
    _removeKeys(keys) {
        keys.forEach((key) => {
            this._treeKeyMap.splice(this._treeKeyMap.indexOf(key), 1);
        });
    }
    _cleanEvent(event) {
        const indexMap = this._getIndexFromKeys(event.keys);
        let keyIndex = 0;
        event.keys.forEach((val) => {
            if (indexMap[keyIndex] === -1) {
                event.keys.delete(val);
            }
            keyIndex++;
        });
        for (let ind = indexMap.length - 1; ind >= 0; ind--) {
            if (indexMap[ind] === -1) {
                if (event.data) {
                    event.data.splice(ind, 1);
                }
                if (event.indexes) {
                    event.indexes.splice(ind, 1);
                }
                if (event.metadata) {
                    event.metadata.splice(ind, 1);
                }
            }
        }
        return event;
    }
    _cleanAddEvent(event) {
        const addBeforeKeys = event.addBeforeKeys;
        const indexes = event.indexes;
        const keys = [];
        const cleanItems = [];
        event.keys.forEach((key) => {
            keys.push(key);
        });
        if (indexes != null) {
            const sortedIndexes = indexes.slice(0).sort();
            for (let i = 0; i < sortedIndexes.length; i++) {
                const currentIndex = sortedIndexes[i];
                const originalIndex = indexes.indexOf(currentIndex);
                if (this._treeData.length + i - cleanItems.length < currentIndex) {
                    cleanItems.push(originalIndex);
                }
            }
        }
        else if (addBeforeKeys != null) {
            const sortedKeys = addBeforeKeys.slice(0).sort();
            for (const currentKey of sortedKeys) {
                const originalKeyIndex = addBeforeKeys.indexOf(currentKey);
                if (currentKey != null) {
                    if (this._treeKeyMap.indexOf(currentKey) === -1 && keys.indexOf(currentKey) === -1) {
                        cleanItems.push(originalKeyIndex);
                    }
                    else if (this._treeKeyMap.indexOf(currentKey) === -1 &&
                        keys.indexOf(currentKey) !== -1 &&
                        cleanItems.indexOf(keys.indexOf(currentKey)) === -1) {
                        cleanItems.push(originalKeyIndex);
                    }
                }
                else {
                    if (!this._dataFetchComplete) {
                        cleanItems.push(originalKeyIndex);
                    }
                }
            }
        }
        let keyIndex = 0;
        event.keys.forEach((val) => {
            if (cleanItems.indexOf(keyIndex) !== -1) {
                event.keys.delete(val);
            }
            keyIndex++;
        });
        const sortedCleanItems = cleanItems.splice(0).sort();
        for (let ind = sortedCleanItems.length - 1; ind >= 0; ind--) {
            if (event.data) {
                event.data.splice(sortedCleanItems[ind], 1);
            }
            if (event.indexes) {
                event.indexes.splice(sortedCleanItems[ind], 1);
            }
            if (event.metadata) {
                event.metadata.splice(sortedCleanItems[ind], 1);
            }
            if (event.parentKeys) {
                event.parentKeys.splice(sortedCleanItems[ind], 1);
            }
            if (event.addBeforeKeys) {
                event.addBeforeKeys.splice(sortedCleanItems[ind], 1);
            }
        }
        return event;
    }
    _addEventListeners(dataprovider) {
        dataprovider.addEventListener('refresh', (event) => {
            this._initialize();
            if (this._internalIteratorResolve != null) {
                this._internalIteratorResolve('error');
                this._internalIteratorResolve = null;
                window.requestAnimationFrame(() => {
                    this.dispatchEvent(new DataProviderRefreshEvent());
                });
            }
            else {
                this.dispatchEvent(new DataProviderRefreshEvent());
            }
        });
        dataprovider.addEventListener('mutate', (event) => {
            if (event.detail.add) {
                event.detail.add = this._cleanAddEvent(event.detail.add);
                if (event.detail.add.keys.size !== 0) {
                    event.detail.add = this._handleAdd(event.detail.add);
                    this._storedAddSection.forEach((addEvent) => {
                        this.dispatchEvent(addEvent);
                    });
                    if (event.detail.add) {
                        this.dispatchEvent(event);
                    }
                    this._storedAddSection = [];
                    this._storedAddSectionKeys = [];
                }
            }
            if (event.detail.remove || event.detail.update) {
                if (event.detail.remove) {
                    event.detail.remove = this._cleanEvent(event.detail.remove);
                    if (event.detail.remove.keys.size !== 0) {
                        this._handleRemove(event.detail.remove);
                        this.dispatchEvent(event);
                    }
                }
                if (event.detail.update) {
                    event.detail.update = this._cleanEvent(event.detail.update);
                    if (event.detail.update.keys.size !== 0) {
                        this._handleUpdate(event.detail.update);
                        this.dispatchEvent(event);
                    }
                }
            }
            this._storedRemoveSection.forEach((removeEvent) => {
                this.dispatchEvent(removeEvent);
            });
            this._storedRemoveSection = [];
        });
    }
}
EventTargetMixin.applyMixin(GroupingDataProvider);
oj._registerLegacyNamespaceProp('GroupingDataProvider', GroupingDataProvider);

export default GroupingDataProvider;
