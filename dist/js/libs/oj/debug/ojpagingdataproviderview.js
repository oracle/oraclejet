/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojeventtarget'], function (oj, ojeventtarget) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

    /* jslint browser: true,devel:true*/
    /**
     *
     * @export
     * @final
     * @class PagingDataProviderView
     * @implements PagingModel
     * @implements DataProvider
     * @classdesc This class implements {@link DataProvider}.
     *            Wraps a {@link DataProvider} to be used with [PagingControl]{@link oj.ojPagingControl}.
     *            Supports PagingModel API.
     * @param {DataProvider} dataProvider the {@link DataProvider} to be wrapped.
     *                                      <p>This can be either any DataProvider or a wrapped
     *                                      DataSource with a TableDataSourceAdapter. Paging DataProvider View does
     *                                      not handle DataProviders with unknown total sizes.</p>
     * @param {PagingDataProviderView.Options=} options Options for the PagingDataProviderView
     * @ojsignature [{target: "Type",
     *               value: "class PagingDataProviderView<K, D> implements DataProvider<K, D>, PagingModel"},
     *               {target: "Type",
     *               value: "DataProvider<K, D>",
     *               for: "dataProvider"},
     *               {target: "Type",
     *               value: "PagingDataProviderView.Options",
     *               for: "options"}]
     * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
     * "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
     * "FetchListResult","FetchListParameters"]}
     * @ojtsimport {module: "ojpagingmodel", type: "AMD", imported: ["PagingModel"]}
     * @ojtsmodule
     */

    /**
     * @typedef {Object} PagingDataProviderView.Options
     * @property {string=} rowCountConfidence - Optional enum {"exact", "approximate"} to specify exact or approximate
     *                                             rowcount for CollectionDataProviders. "exact" should only be used when
     *                                             the totalSize is fully specified by the CollectionDataProvider and is
     *                                             not expected to change. If totalSize is defined as -1, "exact" will
     *                                             have the same behavior as approximate. The default value is approximate.
     *
     * @ojsignature [{target: "Type", value: "'exact'|'approximate'", for: "rowCountConfidence"}]

     */
    /**
     * @inheritdoc
     * @memberof PagingDataProviderView
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
     * @memberof PagingDataProviderView
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
     * @memberof PagingDataProviderView
     * @instance
     * @method
     * @name fetchByKeys
     */

    /**
     * @inheritdoc
     * @memberof PagingDataProviderView
     * @instance
     * @method
     * @name fetchByOffset
     */

    /**
     * @inheritdoc
     * @memberof PagingDataProviderView
     * @instance
     * @method
     * @name getCapability
     */

    /**
     * @inheritdoc
     * @memberof PagingDataProviderView
     * @instance
     * @method
     * @name getTotalSize
     */

    /**
     * @inheritdoc
     * @memberof PagingDataProviderView
     * @instance
     * @method
     * @name isEmpty
     */

    /**
     * @inheritdoc
     * @memberof PagingDataProviderView
     * @instance
     * @method
     * @name addEventListener
     */

    /**
     * @inheritdoc
     * @memberof PagingDataProviderView
     * @instance
     * @method
     * @name removeEventListener
     */

    /**
     * @inheritdoc
     * @memberof PagingDataProviderView
     * @instance
     * @method
     * @name dispatchEvent
     */

    /**
     * Get the current page
     * @return {number} The current page
     * @export
     * @expose
     * @memberof PagingDataProviderView
     * @method
     * @name getPage
     * @instance
     */

    /**
     * Set the current page. This will trigger a refresh event. During initialization
     * the refresh event is skipped.
     * @param {number} value The current page
     * @param {Object=} options Options<p>
     *                  pageSize: The page size.<p>
     * @return {Promise} promise object triggering done when complete..
     * @export
     * @expose
     * @memberof PagingDataProviderView
     * @method
     * @name setPage
     * @instance
     */

    /**
     * Get the current page start index
     * @return {number} The current page start index
     * @export
     * @expose
     * @memberof PagingDataProviderView
     * @method
     * @name getStartItemIndex
     * @instance
     */

    /**
     * Get the current page end index
     * @return {number} The current page end index
     * @export
     * @expose
     * @memberof PagingDataProviderView
     * @method
     * @name getEndItemIndex
     * @instance
     */

    /**
     * Get the page count
     * @return {number} The total number of pages
     * @export
     * @expose
     * @memberof PagingDataProviderView
     * @method
     * @name getPageCount
     * @instance
     */

    /**
     * @export
     * Return the total number of items. Returns -1 if unknown.
     * @returns {number} total number of items
     * @expose
     * @memberof PagingDataProviderView
     * @method
     * @name totalSize
     * @instance
     */

    /**
     * Returns the confidence for the totalSize value.
     * @return {string} "actual" if the totalSize is the time of the fetch is an exact number
     *                  "estimate" if the totalSize is an estimate
     *                  "atLeast" if the totalSize is at least a certain number
     *                  "unknown" if the totalSize is unknown
     * @export
     * @expose
     * @memberof PagingDataProviderView
     * @method
     * @name totalSizeConfidence
     * @instance
     */

    /**
     * Translates and returns the global index given a local index.
     *
     * @param {number} value The local index to be translated
     * @return {number} The translated global index
     * @export
     * @expose
     * @memberof PagingDataProviderView
     * @method
     * @name getGlobalIndex
     * @instance
     */

    // end of jsdoc

    var RowCountConfidence;
    (function (RowCountConfidence) {
        RowCountConfidence["EXACT"] = "exact";
        RowCountConfidence["APPROXIMATE"] = "approximate";
    })(RowCountConfidence || (RowCountConfidence = {}));
    class PagingDataProviderView {
        constructor(dataProvider, options) {
            var _a;
            this.dataProvider = dataProvider;
            this.options = options;
            this._KEY = 'key';
            this._KEYS = 'keys';
            this._STARTINDEX = 'startIndex';
            this._PAGESIZE = 'pageSize';
            this._OFFSET = 'offset';
            this._SIZE = 'size';
            this._PAGE = 'page';
            this._PAGECOUNT = 'pageCount';
            this._TOTALSIZE = 'totalsize';
            this._PREVIOUSPAGE = 'previousPage';
            this._BEFOREPAGE = 'beforePage';
            this._DONE = 'done';
            this._VALUE = 'value';
            this._DATA = 'data';
            this._REFRESH = 'refresh';
            this._MUTATE = 'mutate';
            this._SORTCRITERIA = 'sortCriteria';
            this._FILTERCRITERION = 'filterCriterion';
            this._METADATA = 'metadata';
            this._RESULTS = 'results';
            this._FETCHPARAMETERS = 'fetchParameters';
            this._CONTAINSPARAMETERS = 'containsParameters';
            this._CONTAINSKEYS = 'containsKeys';
            this._FETCHBYKEYS = 'fetchByKeys';
            this._FETCHBYOFFSET = 'fetchByOffset';
            this._AFTERKEYS = 'afterKeys';
            this._ADDBEFOREKEYS = 'addBeforeKeys';
            this._ADD = 'add';
            this._REMOVE = 'remove';
            this._UPDATE = 'update';
            this._INDEXES = 'indexes';
            this.AsyncIterable = (_a = class {
                    constructor(_parent, _asyncIterator) {
                        this._parent = _parent;
                        this._asyncIterator = _asyncIterator;
                        this[Symbol.asyncIterator] = function () {
                            return this._asyncIterator;
                        };
                    }
                },
                Symbol.asyncIterator,
                _a);
            this.AsyncIterator = class {
                constructor(_parent, _nextFunc, _params, _clientId) {
                    this._parent = _parent;
                    this._nextFunc = _nextFunc;
                    this._params = _params;
                    this._clientId = _clientId;
                }
                ['next']() {
                    const result = this._nextFunc(this._params, this._clientId);
                    return Promise.resolve(result);
                }
            };
            this.AsyncIteratorYieldResult = class {
                constructor(_parent, value) {
                    this._parent = _parent;
                    this.value = value;
                    this[_parent._VALUE] = value;
                    this[_parent._DONE] = false;
                }
            };
            this.AsyncIteratorReturnResult = class {
                constructor(_parent, value) {
                    this._parent = _parent;
                    this.value = value;
                    this[_parent._VALUE] = value;
                    this[_parent._DONE] = true;
                }
            };
            this.FetchListParameters = class {
                constructor(_parent, size, sortCriteria, filterCriterion) {
                    this._parent = _parent;
                    this.size = size;
                    this.sortCriteria = sortCriteria;
                    this.filterCriterion = filterCriterion;
                    this[_parent._SIZE] = size;
                    this[_parent._SORTCRITERIA] = sortCriteria;
                    this[_parent._FILTERCRITERION] = filterCriterion;
                }
            };
            this.FetchListResult = class {
                constructor(_parent, fetchParameters, data, metadata) {
                    this._parent = _parent;
                    this.fetchParameters = fetchParameters;
                    this.data = data;
                    this.metadata = metadata;
                    this[_parent._FETCHPARAMETERS] = fetchParameters;
                    this[_parent._DATA] = data;
                    this[_parent._METADATA] = metadata;
                }
            };
            this.FetchByOffsetParameters = class {
                constructor(_parent, offset, size, sortCriteria, filterCriterion) {
                    this._parent = _parent;
                    this.offset = offset;
                    this.size = size;
                    this.sortCriteria = sortCriteria;
                    this.filterCriterion = filterCriterion;
                    this[_parent._SIZE] = size;
                    this[_parent._SORTCRITERIA] = sortCriteria;
                    this[_parent._OFFSET] = offset;
                    this[_parent._FILTERCRITERION] = filterCriterion;
                }
            };
            this.FetchByOffsetResults = class {
                constructor(_parent, fetchParameters, results, done) {
                    this._parent = _parent;
                    this.fetchParameters = fetchParameters;
                    this.results = results;
                    this.done = done;
                    this[_parent._FETCHPARAMETERS] = fetchParameters;
                    this[_parent._RESULTS] = results;
                    this[_parent._DONE] = done;
                }
            };
            this.FetchByKeysResults = class {
                constructor(_parent, fetchParameters, results) {
                    this._parent = _parent;
                    this.fetchParameters = fetchParameters;
                    this.results = results;
                    this[_parent._FETCHPARAMETERS] = fetchParameters;
                    this[_parent._RESULTS] = results;
                }
            };
            this.ContainsKeysResults = class {
                constructor(_parent, containsParameters, results) {
                    this._parent = _parent;
                    this.containsParameters = containsParameters;
                    this.results = results;
                    this[_parent._CONTAINSPARAMETERS] = containsParameters;
                    this[_parent._RESULTS] = results;
                }
            };
            this.ItemMetadata = class {
                constructor(_parent, key) {
                    this._parent = _parent;
                    this.key = key;
                    this[_parent._KEY] = key;
                }
            };
            this.DataProviderMutationEventDetail = class {
                constructor(_parent, add, remove, update) {
                    this._parent = _parent;
                    this.add = add;
                    this.remove = remove;
                    this.update = update;
                    this[_parent._ADD] = add;
                    this[_parent._REMOVE] = remove;
                    this[_parent._UPDATE] = update;
                }
            };
            this.DataProviderOperationEventDetail = class {
                constructor(_parent, keys, metadata, data, indexes) {
                    this._parent = _parent;
                    this.keys = keys;
                    this.metadata = metadata;
                    this.data = data;
                    this.indexes = indexes;
                    this[_parent._KEYS] = keys;
                    this[_parent._METADATA] = metadata;
                    this[_parent._DATA] = data;
                    this[_parent._INDEXES] = indexes;
                }
            };
            this.DataProviderAddOperationEventDetail = class {
                constructor(_parent, keys, afterKeys, addBeforeKeys, metadata, data, indexes) {
                    this._parent = _parent;
                    this.keys = keys;
                    this.afterKeys = afterKeys;
                    this.addBeforeKeys = addBeforeKeys;
                    this.metadata = metadata;
                    this.data = data;
                    this.indexes = indexes;
                    this[_parent._KEYS] = keys;
                    this[_parent._AFTERKEYS] = afterKeys;
                    this[_parent._ADDBEFOREKEYS] = addBeforeKeys;
                    this[_parent._METADATA] = metadata;
                    this[_parent._DATA] = data;
                    this[_parent._INDEXES] = indexes;
                }
            };
            this._addEventListeners(dataProvider);
            this._currentPage = -1;
            this._pageSize = -1;
            this._pageCount = -1;
            this._offset = 0;
            this._totalSize = -1;
            this._skipCriteriaCheck = false;
            // set up initialize promise check to make sure setPage is called before
            // fetching data
            this._isInitialized = new Promise((resolve) => {
                this._resolveFunc = resolve;
            });
            // set up initialize data promise check to make sure data is loaded
            // before View fetch calls are allowed to continue
            this._isInitialDataLoaded = new Promise((resolve) => {
                this._dataResolveFunc = resolve;
            });
            this._hasMutated = false;
            this._selfRefresh = false;
            this._mustRefetch = false;
            this._isFetchingForMutation = false;
            this._mutationEventQueue = [];
            this._isMutating = null;
            this._mutationFunc = null;
            this._doRefreshEvent = false;
            this._mutatingTotalSize = null;
            this._fetchMore = false;
            this._isUnknownRowCount = false;
            this._iteratorCacheMap = new Map();
        }
        containsKeys(params) {
            return this._checkIfDataInitialized(() => {
                // if containsKeys exists, use that and filter out extra keys
                return this.dataProvider[this._CONTAINSKEYS](params)
                    .then((value) => {
                    const keys = value.results;
                    if (!this._isGlobal(params)) {
                        const currentPageResults = new Set();
                        const currentPageKeys = this._getCurrentPageKeys();
                        keys.forEach((key) => {
                            if (currentPageKeys.indexOf(key) !== -1) {
                                currentPageResults.add(key);
                            }
                        });
                        return new this.ContainsKeysResults(this, params, currentPageResults);
                    }
                    else {
                        return new this.ContainsKeysResults(this, params, keys);
                    }
                })
                    .catch((reject) => {
                    return Promise.reject(reject);
                });
            });
        }
        fetchByKeys(params) {
            return this._checkIfDataInitialized(() => {
                const requestedKeys = params.keys;
                if (!this._isGlobal(params)) {
                    // use the cached fetch data to get values by keys.
                    return this._fetchByOffset(new this.FetchByOffsetParameters(this, this._offset, this._pageSize, this._currentSortCriteria, this._currentFilterCriteria))
                        .then((results) => {
                        const result = results['results'];
                        const mappedResultMap = new Map();
                        const filteredResults = result.map((value) => {
                            if (requestedKeys.has(value[this._METADATA][this._KEY])) {
                                return value;
                            }
                        });
                        filteredResults.forEach((value) => {
                            if (value) {
                                mappedResultMap.set(value[this._METADATA][this._KEY], value);
                            }
                        });
                        return new this.FetchByKeysResults(this, params, mappedResultMap);
                    })
                        .catch((reject) => {
                        return Promise.reject(reject);
                    });
                }
                else {
                    // fetching globally so need to use the dataprovider.
                    if (this.dataProvider[this._FETCHBYKEYS]) {
                        return this.dataProvider[this._FETCHBYKEYS](params);
                    }
                    else {
                        // doesn't exist so need to throw an error
                        throw new Error('Global scope not supported for this dataprovider');
                    }
                }
            });
        }
        fetchByOffset(params) {
            return this._checkIfDataInitialized(() => {
                const offset = params != null ? (params[this._OFFSET] > 0 ? params[this._OFFSET] : 0) : 0;
                params = new this.FetchByOffsetParameters(this, this._offset, this._pageSize, this._currentSortCriteria, this._currentFilterCriteria);
                return this._fetchByOffset(params).then((results) => {
                    const newResult = results['results'].filter((value, index) => {
                        return index >= offset;
                    });
                    return new this.FetchByOffsetResults(this, this._getLocalParams(params), newResult, results['done']);
                });
            });
        }
        fetchFirst(params) {
            // set up iterator variables
            const sortCriteria = params != null ? params[this._SORTCRITERIA] : null;
            const filterCriterion = params != null ? params[this._FILTERCRITERION] : null;
            let payload = {};
            // we can force a criteria check skip if we know that we shouldn't check
            if (this._skipCriteriaCheck) {
                this._skipCriteriaCheck = false;
            }
            else {
                // check criteria. If different, reset page to 0
                if (!this._isSameCriteria(sortCriteria, filterCriterion)) {
                    this._currentSortCriteria = sortCriteria;
                    this._currentFilterCriteria = filterCriterion;
                    this._offset = 0;
                    if (this._currentPage !== 0) {
                        payload[this._PREVIOUSPAGE] = this._currentPage;
                        this._currentPage = 0;
                        payload[this._PAGE] = this._currentPage;
                    }
                }
            }
            const offset = this._offset;
            const size = this._pageSize;
            const clientId = (params && params.clientId) || Symbol();
            // initialize cachemap
            this._iteratorCacheMap.set(clientId, {
                offset,
                size,
                mutationOffset: 0,
                fetchFirstDone: false,
                currentParams: this._currentParams
            });
            // this fetchFirst applies the offset properties on the this.
            return new this.AsyncIterable(this, new this.AsyncIterator(this, ((params, clientId) => {
                return (params, clientId) => {
                    const iteratorData = this._iteratorCacheMap.get(clientId);
                    let offset = iteratorData['offset'];
                    let size = iteratorData['size'];
                    let mutationOffset = iteratorData['mutationOffset'];
                    let fetchFirstDone = iteratorData['fetchFirstDone'];
                    const currentParams = iteratorData['currentParams'];
                    let updatedParams = new this.FetchByOffsetParameters(this, offset, size, this._currentSortCriteria, this._currentFilterCriteria);
                    if (mutationOffset !== 0 && currentParams) {
                        // we have a remove event in progress triggering a fetch
                        // Since we already have the page fetched data, we can
                        // just grab the current page data and slice what we need.
                        updatedParams = currentParams;
                    }
                    // Datagrid may trigger the fetchFirst first, so we need to update the params again before fetching
                    let needParamUpdate = false;
                    if (this._isInitialDataLoaded != null) {
                        needParamUpdate = true;
                    }
                    return this._checkIfDataInitialized(() => {
                        if (needParamUpdate) {
                            size = this._pageSize;
                            offset = this._offset;
                            updatedParams = new this.FetchByOffsetParameters(this, offset, size, this._currentSortCriteria, this._currentFilterCriteria);
                        }
                        return this._fetchByOffset(updatedParams).then((result) => {
                            let results = result['results'];
                            // If the fetch first done flag is true, then the last fetch should have been all the data
                            // Return no results since datagrid requires 0 results to conclude fetch
                            // Skip this if mutationOffset is non-zero, since it's an extra fetch caused by mutation
                            if (fetchFirstDone && mutationOffset === 0) {
                                results = [];
                            }
                            if (mutationOffset !== 0) {
                                // Do a slice for mutation offset if applicable.
                                results = results.slice(results.length - mutationOffset);
                            }
                            const data = results.map((value) => {
                                return value[this._DATA];
                            });
                            const metadata = results.map((value) => {
                                return value[this._METADATA];
                            });
                            offset = offset + metadata.length - mutationOffset;
                            // fire page change event in the case of sort operation resetting the page to 0
                            if (payload[this._PAGE] != null) {
                                // Update end item index
                                this._endItemIndex = this._offset + data.length - 1;
                                this.dispatchEvent(new CustomEvent(this._PAGE, { detail: payload }));
                                payload = {};
                            }
                            // Datagrid triggers fetchfirst before setPage, so we need to clear this parameter here
                            this._skipCriteriaCheck = false;
                            const resultsParam = new this.FetchByOffsetParameters(this, result['fetchParameters']['offset'] - mutationOffset, this._pageSize, result['fetchParameters'].sortCriteria, result['fetchParameters'].filterCriterion);
                            // Reset mutation offset after fetch
                            mutationOffset = 0;
                            // Set done flag for datagrid fetch handling
                            fetchFirstDone = result[this._DONE];
                            // cache the new data values
                            this._iteratorCacheMap.set(clientId, {
                                offset,
                                size,
                                mutationOffset,
                                fetchFirstDone,
                                currentParams
                            });
                            if (result[this._DONE] && data.length === 0) {
                                return Promise.resolve(new this.AsyncIteratorReturnResult(this, new this.FetchListResult(this, resultsParam, data, metadata)));
                            }
                            return Promise.resolve(new this.AsyncIteratorYieldResult(this, new this.FetchListResult(this, resultsParam, data, metadata)));
                        });
                    });
                };
            })(), params, clientId));
        }
        getCapability(capabilityName) {
            return this.dataProvider.getCapability(capabilityName);
        }
        getTotalSize() {
            return this._checkIfInitialized(() => {
                return Promise.resolve(this._pageSize);
            });
        }
        isEmpty() {
            return this.dataProvider.isEmpty();
        }
        // Start PagingModel APIs
        getPage() {
            return this._currentPage;
        }
        setPage(value, options) {
            // make sure mutation events are complete before starting
            return this._mutationBusyContext(() => {
                value = parseInt(value, 10);
                const payload = {};
                payload[this._PAGE] = value;
                payload[this._PREVIOUSPAGE] = this._currentPage;
                this.dispatchEvent(new CustomEvent(this._BEFOREPAGE, { detail: payload }));
                if (options[this._PAGESIZE] != null) {
                    this._pageSize = options[this._PAGESIZE];
                }
                this._offset = parseInt(value, 10) * this._pageSize;
                this._currentPage = value;
                // Handle initialization confirmation
                if (this._isInitialized != null) {
                    this._resolveFunc(true);
                    this._updateTotalSize();
                }
                const params = new this.FetchByOffsetParameters(this, this._offset, this._pageSize, this._currentSortCriteria, this._currentFilterCriteria);
                return this._fetchByOffset(params).then((results) => {
                    const data = results['results'];
                    if (data.length !== 0) {
                        this._endItemIndex = this._offset + data.length - 1;
                        this._skipCriteriaCheck = true;
                        this.dispatchEvent(new CustomEvent(this._PAGE, { detail: payload }));
                        this._updateTotalSize();
                        // If data length is less than fetch parameters page size, then reduce current params size
                        const resultParams = results['fetchParameters'];
                        if (data.length < resultParams.size) {
                            this._currentParams = new this.FetchByOffsetParameters(this, resultParams['offset'], data.length, resultParams['sortCriteria'], resultParams['filterCriterion']);
                        }
                        this._updatePageData(data);
                    }
                    else if (this._currentPage !== 0) {
                        // reset to previous page if no data and not on page 1
                        // since it means we were done last page
                        this._currentPage = payload[this._PREVIOUSPAGE];
                        this._offset = this._currentPage * this._pageSize;
                        this.dispatchEvent(new CustomEvent(this._PAGECOUNT, {
                            detail: { previousValue: value, value: this._currentPage }
                        }));
                        // skip refresh
                        this._doRefreshEvent = false;
                    }
                    else {
                        // no data and page 0 means empty data set
                        this._offset = 0;
                        this._endItemIndex = 0;
                    }
                    // skip initial refresh so that view doesn't
                    // double fetch. Also confirm that initial data has been loaded
                    if (this._doRefreshEvent) {
                        this._hasMutated = true;
                        this._selfRefresh = true;
                        this.dispatchEvent(new oj.DataProviderRefreshEvent());
                    }
                    else {
                        this._dataResolveFunc(true);
                        this._doRefreshEvent = true;
                    }
                    if (this._isInitialDataLoaded) {
                        this._dataResolveFunc(true);
                    }
                });
            });
        }
        getStartItemIndex() {
            return this._offset;
        }
        getEndItemIndex() {
            return this._endItemIndex;
        }
        getPageCount() {
            if (this._totalSizeConfidence === 'atLeast') {
                return this._pageCount + 1;
            }
            else {
                return this._pageCount;
            }
        }
        totalSize() {
            return this._totalSize;
        }
        totalSizeConfidence() {
            if (this._totalSizeConfidence) {
                return this._totalSizeConfidence;
            }
            else {
                if (this._totalSize === -1) {
                    return 'unknown';
                }
                return 'actual';
            }
        }
        // End PagingModel APIs
        // Start Paging DataProvider View Helper API
        // helper method for the view to get the global offset
        getGlobalIndex(value) {
            return this._offset + value;
        }
        // helper method for the view to get the local offset
        getLocalIndex(value) {
            return value - this._offset;
        }
        // End Paging DataProvider View Helper API
        // helper method to get local params
        _getLocalParams(params) {
            return new this.FetchByOffsetParameters(this, this.getLocalIndex(params.offset), params.size, params.sortCriteria, params.filterCriterion);
        }
        _updatePageData(results) {
            this._currentPageData = results;
        }
        // helper method to update total size and fire events if necessary
        _updateTotalSize() {
            // fire pagecount/totalsize change events if applicable
            const previousTotalSize = this._totalSize;
            const previousPageCount = this._pageCount;
            return this._checkIfInitialized(() => {
                return this.dataProvider.getTotalSize().then((totalSize) => {
                    this._totalSize = totalSize;
                    // Reset page count;
                    this._pageCount = -1;
                    if (this._totalSize !== -1) {
                        if (this._isUnknownRowCount) {
                            // unknown row count flag means that we should be in
                            // partial row count mode now
                            this._isUnknownRowCount = false;
                            if (!this._isExactMode()) {
                                this._totalSizeConfidence = 'atLeast';
                            }
                        }
                        this._pageCount = Math.ceil(this._totalSize / this._pageSize);
                        // update offsets and currentpage if needed
                        if (this._offset >= this._totalSize) {
                            this._offset = this._totalSize - (this._totalSize % this._pageSize);
                            this._endItemIndex = this._totalSize - 1;
                            const newPage = Math.floor(this._totalSize / this._pageSize);
                            if (this._currentPage !== newPage) {
                                const payload = {};
                                payload[this._PAGE] = newPage;
                                payload[this._PREVIOUSPAGE] = this._currentPage;
                                this.dispatchEvent(new CustomEvent(this._PAGE, { detail: payload }));
                                this._currentPage = newPage;
                            }
                        }
                        if (previousPageCount !== this._pageCount) {
                            this.dispatchEvent(new CustomEvent(this._PAGECOUNT, {
                                detail: { previousValue: previousPageCount, value: this._pageCount }
                            }));
                        }
                        else if (previousTotalSize !== this._totalSize) {
                            this.dispatchEvent(new CustomEvent(this._TOTALSIZE, {
                                detail: { previousValue: previousTotalSize, value: this._totalSize }
                            }));
                        }
                    }
                    return this._pageSize;
                });
            });
        }
        // busy context for mutation event handling.
        // should block setPage calls until done
        _mutationBusyContext(callback) {
            if (this._isMutating) {
                return this._isMutating.then(() => {
                    this._isMutating = null;
                    return callback();
                });
            }
            else {
                return callback();
            }
        }
        // setup the mutation busyContext
        _setupMutationBusyContext() {
            this._isMutating = new Promise((resolve) => {
                this._mutationFunc = resolve;
            });
        }
        // helper method to check if paging control dataprovider view is initialized with currentpage
        _checkIfInitialized(callback) {
            if (this._isInitialized) {
                return this._isInitialized.then((value) => {
                    // make sure currentPage is set
                    if (!value || this._currentPage === -1) {
                        this._isInitialized = null;
                        throw new Error('Paging DataProvider View incorrectly initialized');
                    }
                    else {
                        this._isInitialized = null;
                        return callback();
                    }
                });
            }
            else {
                return callback();
            }
        }
        // helper method to check if paging control dataprovider view is initialized with data
        _checkIfDataInitialized(callback) {
            if (this._isInitialDataLoaded) {
                return this._isInitialDataLoaded.then((value) => {
                    // make sure currentPage is set
                    if (!value || this._currentPage === -1) {
                        this._isInitialDataLoaded = null;
                        throw new Error('Paging DataProvider View incorrectly initialized');
                    }
                    else {
                        this._isInitialDataLoaded = null;
                        return callback();
                    }
                });
            }
            else {
                return callback();
            }
        }
        // helper method to determine if a row is in the current page.
        _getCurrentPageKeys() {
            return this._currentResults.map((value) => {
                return value[this._METADATA][this._KEY];
            });
        }
        // helper method to check that all params for the current fetched data are still the same
        _isSameParams(params) {
            // In some circumstances current Params is not applied at this point
            if (!this._currentParams) {
                return false;
            }
            if (this._currentParams[this._SIZE] === params[this._SIZE] &&
                this._currentParams[this._OFFSET] === params[this._OFFSET] &&
                this._currentParams[this._SORTCRITERIA] === params[this._SORTCRITERIA] &&
                this._currentParams[this._FILTERCRITERION] === params[this._FILTERCRITERION]) {
                return true;
            }
            else {
                return false;
            }
        }
        // helper method to determine if the criteria is the same
        _isSameCriteria(sortCriteria, filterCriterion) {
            if (sortCriteria) {
                if (!this._currentSortCriteria ||
                    sortCriteria[0]['attribute'] !== this._currentSortCriteria[0]['attribute'] ||
                    sortCriteria[0]['direction'] !== this._currentSortCriteria[0]['direction']) {
                    return false;
                }
            }
            else {
                if (this._currentSortCriteria) {
                    return false;
                }
            }
            if (filterCriterion) {
                if (!this._currentFilterCriteria) {
                    return false;
                }
                else {
                    // need to do deep filter compare from both sides
                    for (const prop in this._currentFilterCriteria) {
                        if (!this._filterCompare(this._currentFilterCriteria, filterCriterion, prop)) {
                            return false;
                        }
                    }
                    for (const prop in filterCriterion) {
                        if (!this._filterCompare(this._currentFilterCriteria, filterCriterion, prop)) {
                            return false;
                        }
                    }
                }
            }
            else {
                if (this._currentFilterCriteria) {
                    return false;
                }
            }
            return true;
        }
        _filterCompare(cachedFilter, newFilter, prop) {
            if (cachedFilter[prop] && newFilter[prop] && cachedFilter[prop] === newFilter[prop]) {
                return true;
            }
            return false;
        }
        _isGlobal(params) {
            return params.scope !== undefined && params.scope === 'global';
        }
        _isExactMode() {
            if (this.options &&
                this.options.rowCountConfidence &&
                this.options.rowCountConfidence === RowCountConfidence.EXACT) {
                return true;
            }
            return false;
        }
        // helper method to get current page data
        _getCurrentPageData() {
            // if params haven't changed, just return what we already have
            // Also need to check that offset and page size are properly set
            if (this._currentParams &&
                this._currentParams['offset'] === this._offset &&
                this._currentParams['size'] === this._pageSize) {
                if (this._currentPageData && !this._hasMutated) {
                    return Promise.resolve(new this.FetchByOffsetResults(this, this._getLocalParams(this._currentParams), this._currentPageData, this._currentIsDone));
                }
                else {
                    return this._fetchByOffset(this._currentParams).then((result) => {
                        return result;
                    });
                }
            }
            else {
                return this._fetchByOffset(new this.FetchByOffsetParameters(this, this._offset, this._pageSize, this._currentSortCriteria, this._currentFilterCriteria)).then((result) => {
                    return result;
                });
            }
        }
        // internal fetch by offset method to get page data based on offset
        _fetchByOffset(params) {
            return this._checkIfInitialized(() => {
                params = this._cleanFetchParams(params);
                // if params haven't changed, just return what we already have
                if (this._currentParams &&
                    this._isSameParams(params) &&
                    (!this._hasMutated || this._selfRefresh)) {
                    this._selfRefresh = false;
                    this._hasMutated = false;
                    return Promise.resolve(new this.FetchByOffsetResults(this, this._returnFetchParams, this._currentResults, this._currentIsDone));
                }
                // If size is 0, then we have hit the end of the data and we should be
                // returning empty results with done = true
                if (params.size === 0) {
                    this._currentIsDone = true;
                    this._currentParams = params;
                    return Promise.resolve(new this.FetchByOffsetResults(this, this._getLocalParams(params), [], this._currentIsDone));
                }
                return this._fetchByOffsetHelper(params);
            });
        }
        _fetchByOffsetHelper(params) {
            // perform a fetch by offset using the available params.
            return this.dataProvider[this._FETCHBYOFFSET](params)
                .then((result) => {
                // store results locally. If fetchMore is true, we should append instead of replace
                this._currentIsDone = result['done'];
                // initialize currentParams if they don't exist
                if (!this._currentParams) {
                    this._currentParams = params;
                }
                if (this._fetchMore) {
                    this._currentResults = this._currentResults.concat(result['results']);
                }
                else {
                    this._currentResults = result['results'];
                    this._currentParams = params;
                }
                // Grab sortCriteria and filterCriteria and pass them back if they exist.
                const sortCriteria = result['fetchParameters'].sortCriteria;
                const filterCriterion = result['fetchParameters'].filterCriterion;
                this._returnFetchParams = new this.FetchByOffsetParameters(this, this.getLocalIndex(this._currentParams.offset), this._currentParams.size, sortCriteria, filterCriterion);
                this._fetchMore = false;
                // check if we are at the end of the available data
                const resultSize = this._currentResults.length;
                const newSize = this._offset + resultSize;
                const totalSize = this._mutatingTotalSize === null ? this._totalSize : this._mutatingTotalSize;
                if (result['done']) {
                    this._pageCount = Math.ceil(newSize / this._pageSize);
                    // if partial, can change back to exact.
                    if (this._totalSizeConfidence) {
                        this._totalSizeConfidence = null;
                    }
                }
                else if (!result['done'] &&
                    newSize >= totalSize &&
                    totalSize > -1 &&
                    params.size === this._pageSize) {
                    // we have more data than we expect given the totalSize, so we should be in partial mode
                    if (!this._isExactMode()) {
                        this._totalSizeConfidence = 'atLeast';
                    }
                }
                else if (!result['done'] && resultSize < this._pageSize) {
                    // we are not done and we have less data than we expected.
                    // need to refetch with new params since the underlying dataprovider
                    // fetchSize is smaller than pageSize
                    this._fetchMore = true;
                    const newParams = new this.FetchByOffsetParameters(this, newSize, this._pageSize - resultSize, this._currentSortCriteria, this._currentFilterCriteria);
                    return this._fetchByOffsetHelper(newParams);
                }
                else if (!result['done'] && totalSize === -1) {
                    // either we haven't initialized total size yet,
                    // or we are in unknown row count mode
                    this._isUnknownRowCount = true;
                }
                // check if pageSize matches length or if length and offset hits total size.
                if (this._pageSize === this._currentResults.length ||
                    (newSize >= totalSize && totalSize > -1)) {
                    this._currentIsDone = true;
                }
                // Truncate results down to pageSize if needed to prevent extra data
                // 
                if (resultSize > this._pageSize) {
                    this._currentResults.splice(this._pageSize);
                }
                // updated data so set mutated flag to false;
                this._hasMutated = false;
                return new this.FetchByOffsetResults(this, this._returnFetchParams, this._currentResults, this._currentIsDone);
            })
                .catch((reject) => {
                // if fetch is rejected, set all current records to null and reject.
                this._hasMutated = false;
                this._fetchMore = false;
                this._currentIsDone = null;
                this._currentResults = null;
                this._currentParams = null;
                this._dataResolveFunc(false);
                return Promise.reject(reject);
            });
        }
        // Sanity Check helper method to correct any issues with the params for fetch by offset.
        _cleanFetchParams(params) {
            // Sanity Check that the offset is within acceptable range
            const newOffset = params.offset;
            if (newOffset >= this._offset + this._pageSize || newOffset < this._offset) {
                // if outside range, just return size 0
                return new this.FetchByOffsetParameters(this, newOffset, 0, params.sortCriteria, params.filterCriterion);
            }
            // Sanity Check that the pageSize is positive
            let newSize = params.size;
            if (newSize <= 0) {
                newSize = this._pageSize;
            }
            // Sanity Check that the size and offset are both within the context of the current Page limits.
            if (newOffset + newSize > this._offset + this._pageSize) {
                newSize = this._offset + this._pageSize - newOffset;
            }
            const totalSize = this._mutatingTotalSize === null ? this._totalSize : this._mutatingTotalSize;
            if (totalSize > 0 &&
                this._totalSizeConfidence !== 'atLeast' &&
                newOffset + newSize > totalSize) {
                // Sanity Check that the size and offset combined are within bounds of the total page size
                newSize = totalSize - newOffset;
            }
            return new this.FetchByOffsetParameters(this, newOffset, newSize, params.sortCriteria, params.filterCriterion);
        }
        // helper method to fetch data from dataprovider
        // needs to make sure that no new mutation events have
        // occurred while fetching to prevent mistakes.
        _mutationEventDataFetcher(callback) {
            this.dataProvider.getTotalSize().then((totalSize) => {
                if (totalSize > 0) {
                    this._mutatingTotalSize = totalSize;
                    if (this._offset >= totalSize) {
                        this._offset = totalSize - ((totalSize - 1) % this._pageSize) - 1;
                        this._endItemIndex = totalSize - 1;
                    }
                }
                this._getCurrentPageData()
                    .then((result) => {
                    if (this._mustRefetch) {
                        this._mustRefetch = false;
                        this._hasMutated = true;
                        this._mutationEventDataFetcher(callback);
                    }
                    else {
                        callback(result);
                    }
                })
                    .catch((reject) => {
                    // try again if must refetch is true
                    if (this._mustRefetch) {
                        this._mustRefetch = false;
                        this._hasMutated = true;
                        this._mutationEventDataFetcher(callback);
                    }
                    else {
                        return Promise.reject(reject);
                    }
                });
            });
        }
        // helper method to handle mutation events with index
        _processMutationEventsByKey(result) {
            const removeMetadataArray = [];
            const removeDataArray = [];
            const removeIndexArray = [];
            const removeKeySet = new Set();
            const addMetadataArray = [];
            const addDataArray = [];
            const addIndexArray = [];
            const addKeySet = new Set();
            const updateMetadataArray = [];
            const updateDataArray = [];
            const updateIndexArray = [];
            const updateKeySet = new Set();
            //TODO iterate through previous page data vs current page data
            // and generate the mutation event detail
            const previousPageData = this._currentResultsForMutation.map((item, index) => {
                return { item, index };
            });
            const updatedPageData = result['results'].map((item, index) => {
                return { item, index };
            });
            const previousPageDataKeys = previousPageData.map((item) => {
                return item.item.metadata.key;
            });
            const updatedPageDataKeys = updatedPageData.map((item) => {
                return item.item.metadata.key;
            });
            const removedItems = previousPageData.filter((item) => {
                return updatedPageDataKeys.indexOf(item.item.metadata.key) < 0;
            });
            const addedItems = updatedPageData.filter((item) => {
                return previousPageDataKeys.indexOf(item.item.metadata.key) < 0;
            });
            // Use filtered mutation event queue to track update events
            let updateMutationsIndices = this._mutationEventQueue
                .filter((item) => {
                return !item.detail.add && !item.detail.remove && item.detail.update;
            })
                .map((item) => {
                // indexes from events are global, so we need to update them to local
                return item.detail.update.indexes.map((x) => x - this._pageSize * this._currentPage);
            });
            // flatten array so we can check for duplicates
            updateMutationsIndices = updateMutationsIndices.reduce((a, b) => {
                return a.concat(b);
            }, []);
            // remove duplicate update entries
            updateMutationsIndices = updateMutationsIndices.filter((item, index) => {
                return updateMutationsIndices.indexOf(item) === index;
            });
            // Use tracked update event items to check whether or not
            // existing items in the previous page data that are in the
            // same place in the current page date have updated.
            const updateItems = previousPageData.filter((item) => {
                const updatedIndex = updatedPageDataKeys.indexOf(item.item.metadata.key);
                if (updateMutationsIndices.indexOf(updatedIndex) > -1) {
                    return true;
                }
                return false;
            });
            // clear mutation event queue
            this._mutationEventQueue = [];
            if (addedItems.length > 0) {
                addedItems.forEach((item) => {
                    addMetadataArray.push(updatedPageData[item.index].item.metadata);
                    addDataArray.push(updatedPageData[item.index].item.data);
                    addIndexArray.push(item.index);
                });
                addMetadataArray.forEach((metadata) => {
                    addKeySet.add(metadata.key);
                });
            }
            if (removedItems.length > 0) {
                removedItems.forEach((item) => {
                    removeMetadataArray.push(previousPageData[item.index].item.metadata);
                    removeDataArray.push(previousPageData[item.index].item.data);
                    removeIndexArray.push(item.index);
                });
                removeMetadataArray.forEach((metadata) => {
                    removeKeySet.add(metadata.key);
                });
            }
            if (updateItems.length > 0) {
                updateItems.forEach((item) => {
                    updateMetadataArray.push(updatedPageData[item.index].item.metadata);
                    updateDataArray.push(updatedPageData[item.index].item.data);
                    updateIndexArray.push(item.index);
                });
                updateMetadataArray.forEach((metadata) => {
                    updateKeySet.add(metadata.key);
                });
            }
            // : Adding mutation offset tracker to support collection iterator
            // based mutation event handling. Expected behavior should be: on remove event
            // iterator is called and expected to provide the new rows to fill in the
            // removed gap when we need add events that are out of current viewport range
            // Table specific
            const currentViewport = previousPageData.length - removeIndexArray.length;
            const oocvAddIndexArray = addIndexArray.filter((index) => {
                return index >= currentViewport;
            });
            // Update mutation offset values
            this._iteratorCacheMap.forEach((iteratorData, clientId) => {
                iteratorData['mutationOffset'] = oocvAddIndexArray.length;
                // also update the offset in case it is out of range due to page data deletion
                // update the current params
                if (iteratorData['offset'] >= this._totalSize) {
                    iteratorData['offset'] = this._totalSize - (this._totalSize % this._pageSize);
                    iteratorData['currentParams'] = this._currentParams;
                }
                this._iteratorCacheMap.set(clientId, iteratorData);
            });
            // build mutation event detail and fire if not null
            let operationAddEventDetail = null;
            let operationRemoveEventDetail = null;
            let operationUpdateEventDetail = null;
            if (addIndexArray.length > 0) {
                operationAddEventDetail = new this.DataProviderAddOperationEventDetail(this, addKeySet, null, null, addMetadataArray, addDataArray, addIndexArray);
            }
            if (removeIndexArray.length > 0) {
                operationRemoveEventDetail = new this.DataProviderOperationEventDetail(this, removeKeySet, removeMetadataArray, removeDataArray, removeIndexArray);
            }
            if (updateIndexArray.length > 0) {
                operationUpdateEventDetail = new this.DataProviderOperationEventDetail(this, updateKeySet, updateMetadataArray, updateDataArray, updateIndexArray);
            }
            if (operationAddEventDetail != null ||
                operationRemoveEventDetail != null ||
                operationUpdateEventDetail != null) {
                const mutationEventDetail = new this.DataProviderMutationEventDetail(this, operationAddEventDetail, operationRemoveEventDetail, operationUpdateEventDetail);
                //update internal currentPageData
                this._updatePageData(result['results']);
                this.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
            }
        }
        _addEventListeners(dataprovider) {
            dataprovider.addEventListener(this._REFRESH, (event) => {
                // Treat it as a set page to 0 and refresh if not
                // directly after a mutation b/c mutation event trigger
                // refresh naturally. Natural refreshes need to update
                // totalSize and force fetching.
                if (!this._hasMutated) {
                    this._hasMutated = true;
                    // If refresh occurs, setPage should complete before
                    // fetchFirst triggers. this will help resolve the order
                    this._isInitialDataLoaded = new Promise((resolve) => {
                        this._dataResolveFunc = resolve;
                    });
                    this._updateTotalSize().then(() => {
                        this.setPage(0, { pageSize: this._pageSize }).then(() => {
                            // if no data, set page skips refresh event dispatch,
                            // so we need to fire it off here to update the view with no data.
                            if (this._endItemIndex === 0) {
                                this.dispatchEvent(new oj.DataProviderRefreshEvent());
                            }
                        });
                    });
                }
            });
            dataprovider.addEventListener(this._MUTATE, (event) => {
                this._mutationEventQueue.push(event);
                this._setupMutationBusyContext();
                if (this._isFetchingForMutation) {
                    // if new mutation has come in, we need to refetch. Otherwise, we may have stale data.
                    this._mustRefetch = true;
                }
                else {
                    this._isFetchingForMutation = true;
                    this._currentResultsForMutation =
                        this._currentPageData != null ? this._currentPageData : [];
                    // kick off new data fetch
                    this._hasMutated = true;
                    this._mutationEventDataFetcher((result) => {
                        // finish fetching updated data
                        this._isFetchingForMutation = false;
                        const length = result['results'].length;
                        // need to update endItemIndex
                        this._endItemIndex = Math.max(0, this._offset + length - 1);
                        this._updateTotalSize().then(() => {
                            this._mutatingTotalSize = null;
                            if (length === 0) {
                                // no results so need to refresh since page has changed
                                this._mutationFunc(true);
                                this.setPage(this._currentPage, { pageSize: this._pageSize });
                            }
                            else {
                                this._processMutationEventsByKey(result);
                                this._mutationFunc(true);
                            }
                        });
                    });
                }
            });
        }
    }
    oj._registerLegacyNamespaceProp('PagingDataProviderView', PagingDataProviderView);
    oj.EventTargetMixin.applyMixin(PagingDataProviderView);

    return PagingDataProviderView;

});
