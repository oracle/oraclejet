/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojdataprovider', 'ojs/ojeventtarget'], function (oj, ojdataprovider, ojeventtarget) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

    /**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

    /* jslint browser: true,devel:true*/
    /**
     *
     * @since 4.1.0
     * @export
     * @final
     * @class ListDataProviderView
     * @ojtsmodule
     * @implements DataProvider
     * @classdesc Provides list based optimizations for DataProvider and adds some support for providing state
     * for certain operations. e.g supports {@link DataProvider#fetchFirst} starting at arbitrary key or index offset, sortCriteria,
     * and field mapping. Please see the select demos for examples of DataMapping [Select]{@link oj.ojSelect}
     * @param {DataProvider} dataProvider the DataProvider.
     * @param {ListDataProviderView.Options=} options Options for the ListDataProviderView
     * @ojsignature [{target: "Type",
     *               value: "class ListDataProviderView<K, D, Kin, Din> implements DataProvider<K, D>",
     *               genericParameters: [{"name": "K", "description": "Type of output key"}, {"name": "D", "description": "Type of output data"},
     *                    {"name": "Kin", "description": "Type of input key"}, {"name": "Din", "description": "Type of input data"}]},
     *               {target: "Type",
     *               value: "DataProvider<Kin, Din>",
     *               for: "dataProvider"},
     *               {target: "Type",
     *                value: "ListDataProviderView.Options<K, D, Kin, Din>",
     *                for: "options"}]
     * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
     *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults", "DataMapping",
     *   "FetchListResult","FetchListParameters", "FetchAttribute", "DataFilter"]}
     */

    /**
     * @typedef {Object} ListDataProviderView.Options
     * @property {any=} from - key to start fetching from. This will be applied first before offset is applied.
     * @property {number=} offset - offset to start fetching from.
     * @property {Array=} sortCriteria - {@link SortCriterion} to apply to the data.
     * @property {DataMapping=} dataMapping - mapping to apply to the data.
     * @property {Array=} attributes - fetch attributes to apply
     * @property {DataFilter.Filter=} filterCriterion - filter criterion to apply. If the DataProvider does not support filtering then
     *        ListDataProviderView will do local filtering of the data.
     * @ojsignature [
     *  {target: "Type", value: "<K, D, Kin, Din>", for: "genericTypeParameters"},
     *  {target: "Type", value: "Kin=", for: "from"},
     *  {target: "Type", value: "number=", for: "offset"},
     *  {target: "Type", value: "Array.<SortCriterion<D>>", for: "sortCriteria"},
     *  {target: "Type", value: "DataMapping<K, D, Kin, Din>", for: "dataMapping"},
     *  {target: "Type", value: "Array<string | FetchAttribute>", for: "attributes"},
     *  {target: "Type", value: "DataFilter.Filter<D>=", for: "filterCriterion"}
     * ]
     */

    /**
     * @inheritdoc
     * @memberof ListDataProviderView
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
     * @memberof ListDataProviderView
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
     * @memberof ListDataProviderView
     * @instance
     * @method
     * @name fetchByKeys
     */

    /**
     * @inheritdoc
     * @memberof ListDataProviderView
     * @instance
     * @method
     * @name fetchByOffset
     */

    /**
     * @inheritdoc
     * @memberof ListDataProviderView
     * @instance
     * @method
     * @name getCapability
     */

    /**
     * @inheritdoc
     * @memberof ListDataProviderView
     * @instance
     * @method
     * @name getTotalSize
     */

    /**
     * @inheritdoc
     * @memberof ListDataProviderView
     * @instance
     * @method
     * @name isEmpty
     */

    /**
     * @inheritdoc
     * @memberof ListDataProviderView
     * @instance
     * @method
     * @name addEventListener
     */

    /**
     * @inheritdoc
     * @memberof ListDataProviderView
     * @instance
     * @method
     * @name removeEventListener
     */

    /**
     * @inheritdoc
     * @memberof ListDataProviderView
     * @instance
     * @method
     * @name dispatchEvent
     */

    /**
     * Optional key to start fetching from. Used to set on the ListDataProviderView instance instead of through the constructor.
     *
     *
     * @since 4.1.0
     * @export
     * @expose
     * @memberof ListDataProviderView
     * @instance
     * @name from
     * @type {any}
     * @ojsignature {target: "Type",
     *               value: "?Kin"}
     * @ojtsexample <caption>set the key to start fetching from</caption>
     * dataprovider.from = '1234';
     */

    /**
     * Optional offset to start fetching from. Used to set on the ListDataProviderView instance instead of through the constructor.. Should be greater than or equal to zero.
     * If a negative offset is used then it will be treated as zero.
     *
     *
     * @since 4.1.0
     * @export
     * @expose
     * @memberof ListDataProviderView
     * @instance
     * @name offset
     * @type {number=}
     * @ojsignature {target: "Type",
     *               value: "?number"}
     * @ojtsexample <caption>set the offset to start fetching from</caption>
     * dataprovider.offset = 5;
     */

    /**
     * Optional sortCriteria to apply. Used to set on the ListDataProviderView instance instead of through the constructor.
     *
     *
     * @since 4.1.0
     * @export
     * @expose
     * @memberof ListDataProviderView
     * @instance
     * @name sortCriteria
     * @type {Array.<SortCriterion>=}
     * @ojsignature {target: "Type",
     *               value: "?Array<SortCriterion<D>>"}
     * @ojtsexample <caption>set the sortCriteria for fetching</caption>
     * dataprovider.sortCriteria = [{attribute: 'DepartmentName', direction: 'ascending'}];
     */

    /**
     * Optional dataMapping to apply. Used to set on the ListDataProviderView instance instead of through the constructor.
     *
     *
     * @since 4.1.0
     * @export
     * @expose
     * @memberof ListDataProviderView
     * @instance
     * @name dataMapping
     * @type {DataMapping=}
     * @ojsignature {target: "Type",
     *               value: "?DataMapping<K, D, Kin, Din>"}
     * @ojtsexample <caption>set the data mapping for fetching</caption>
     * dataprovider.dataMapping = function (item) {
     *   let data = item.data;
     *   let mappedItem = {};
     *   mappedItem.data = {};
     *   mappedItem.data.label = data.name;
     *   mappedItem.data.value = data.id;
     *   mappedItem.metadata = { key: data.id };
     *   return mappedItem;
     * };
     */

    /**
     * Optional fetch attributes to apply. Used to set on the ListDataProviderView instance instead of through the constructor.
     *
     *
     * @since 4.1.0
     * @export
     * @expose
     * @memberof ListDataProviderView
     * @instance
     * @name attributes
     * @type {Array<string | FetchAttribute>=}
     * @ojsignature {target: "Type",
     *               value: "?Array<string | FetchAttribute>"}
     * @ojtsexample <caption>set the attribute filter for fetching</caption>
     * dataprovider.attributes = ['!lastName', '@default']; // all attributes except lastName
     */

    /**
     * Optional filter criterion to apply. Used to set on the ListDataProviderView instance instead of through the constructor.
     *
     *
     * @since 7.0.0
     * @export
     * @expose
     * @memberof ListDataProviderView
     * @instance
     * @name filterCriterion
     * @type {DataFilter.Filter=}
     * @ojsignature {target: "Type",
     *               value: "?DataFilter.Filter<D>"}
     * @ojtsexample <caption>set the filter criterion for fetching</caption>
     * let filterDef = {op: '$or', criteria: [{op: '$eq', value: {name: 'Bob'}}, {op: '$gt', value: {level: 'Low'}}]};
     * dataprovider.filterCriterion = FilterFactory.getFilter({filterDef}); // create a standard filter using the filterFactory.
     */

    // end of jsdoc

    class ListDataProviderView {
        constructor(dataProvider, options) {
            var _a;
            this.dataProvider = dataProvider;
            this.options = options;
            this._noFilterSupport = false;
            this.AsyncIterable = (_a = class {
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
            this.AsyncIterator = class {
                constructor(_parent, _nextFunc, _params) {
                    this._parent = _parent;
                    this._nextFunc = _nextFunc;
                    this._params = _params;
                }
                ['next']() {
                    var _a;
                    const signal = (_a = this._params) === null || _a === void 0 ? void 0 : _a.signal;
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
                        const result = this._nextFunc(this._params);
                        return resolve(result);
                    });
                }
            };
            this.AsyncIteratorYieldResult = class {
                constructor(_parent, value) {
                    this._parent = _parent;
                    this.value = value;
                    this[ListDataProviderView._VALUE] = value;
                    this[ListDataProviderView._DONE] = false;
                }
            };
            this.AsyncIteratorReturnResult = class {
                constructor(_parent, value) {
                    this._parent = _parent;
                    this.value = value;
                    this[ListDataProviderView._VALUE] = value;
                    this[ListDataProviderView._DONE] = true;
                }
            };
            this.FetchListResult = class {
                constructor(_parent, fetchParameters, data, metadata, totalFilteredRowCount) {
                    this._parent = _parent;
                    this.fetchParameters = fetchParameters;
                    this.data = data;
                    this.metadata = metadata;
                    this.totalFilteredRowCount = totalFilteredRowCount;
                    this[ListDataProviderView._FETCHPARAMETERS] = fetchParameters;
                    this[ListDataProviderView._DATA] = data;
                    this[ListDataProviderView._METADATA] = metadata;
                    if (fetchParameters && fetchParameters.includeFilteredRowCount === 'enabled') {
                        this[ListDataProviderView._TOTALFILTEREDROWCOUNR] = totalFilteredRowCount;
                    }
                }
            };
            this.Item = class {
                constructor(_parent, metadata, data) {
                    this._parent = _parent;
                    this.metadata = metadata;
                    this.data = data;
                    this[ListDataProviderView._METADATA] = metadata;
                    this[ListDataProviderView._DATA] = data;
                }
            };
            this.ItemMetadata = class {
                constructor(_parent, key) {
                    this._parent = _parent;
                    this.key = key;
                    this[ListDataProviderView._KEY] = key;
                }
            };
            this.FetchListParameters = class {
                constructor(_parent, params, size, sortCriteria, filterCriterion, attributes, signal) {
                    this._parent = _parent;
                    this.params = params;
                    this.size = size;
                    this.sortCriteria = sortCriteria;
                    this.filterCriterion = filterCriterion;
                    this.attributes = attributes;
                    this.signal = signal;
                    if (params) {
                        Object.keys(params).forEach((prop) => {
                            this[prop] = params[prop];
                        });
                    }
                    this[ListDataProviderView._SIZE] = size;
                    if (sortCriteria) {
                        this[ListDataProviderView._SORTCRITERIA] = sortCriteria;
                    }
                    if (filterCriterion) {
                        this[ListDataProviderView._FILTERCRITERION] = filterCriterion;
                    }
                    if (attributes) {
                        this[ListDataProviderView._FETCHATTRIBUTES] = attributes;
                    }
                    if (signal) {
                        this[ListDataProviderView._SIGNAL] = signal;
                    }
                }
            };
            this.FetchByKeysParameters = class {
                constructor(_parent, keys, params, attributes) {
                    this._parent = _parent;
                    this.keys = keys;
                    this.params = params;
                    this.attributes = attributes;
                    if (params) {
                        Object.keys(params).forEach((prop) => {
                            this[prop] = params[prop];
                        });
                    }
                    if (keys) {
                        this[ListDataProviderView._KEYS] = keys;
                    }
                    if (attributes) {
                        this[ListDataProviderView._FETCHATTRIBUTES] = attributes;
                    }
                }
            };
            this.FetchByOffsetParameters = class {
                constructor(_parent, offset, params, size, sortCriteria, filterCriterion, attributes, signal) {
                    this._parent = _parent;
                    this.offset = offset;
                    this.params = params;
                    this.size = size;
                    this.sortCriteria = sortCriteria;
                    this.filterCriterion = filterCriterion;
                    this.attributes = attributes;
                    this.signal = signal;
                    if (params) {
                        Object.keys(params).forEach((prop) => {
                            this[prop] = params[prop];
                        });
                    }
                    if (size) {
                        this[ListDataProviderView._SIZE] = size;
                    }
                    if (sortCriteria) {
                        this[ListDataProviderView._SORTCRITERIA] = sortCriteria;
                    }
                    if (offset) {
                        this[ListDataProviderView._OFFSET] = offset;
                    }
                    if (filterCriterion) {
                        this[ListDataProviderView._FILTERCRITERION] = filterCriterion;
                    }
                    if (attributes) {
                        this[ListDataProviderView._FETCHATTRIBUTES] = attributes;
                    }
                    if (signal) {
                        this[ListDataProviderView._SIGNAL] = signal;
                    }
                }
            };
            this.FetchByKeysResults = class {
                constructor(_parent, fetchParameters, results) {
                    this._parent = _parent;
                    this.fetchParameters = fetchParameters;
                    this.results = results;
                    this[ListDataProviderView._FETCHPARAMETERS] = fetchParameters;
                    this[ListDataProviderView._RESULTS] = results;
                }
            };
            this.ContainsKeysResults = class {
                constructor(_parent, containsParameters, results) {
                    this._parent = _parent;
                    this.containsParameters = containsParameters;
                    this.results = results;
                    this[ListDataProviderView._CONTAINSPARAMETERS] = containsParameters;
                    this[ListDataProviderView._RESULTS] = results;
                }
            };
            this.FetchByOffsetResults = class {
                constructor(_parent, fetchParameters, results, done, totalFilteredRowCount) {
                    this._parent = _parent;
                    this.fetchParameters = fetchParameters;
                    this.results = results;
                    this.done = done;
                    this.totalFilteredRowCount = totalFilteredRowCount;
                    this[ListDataProviderView._FETCHPARAMETERS] = fetchParameters;
                    this[ListDataProviderView._RESULTS] = results;
                    this[ListDataProviderView._DONE] = done;
                    if (fetchParameters && fetchParameters.includeFilteredRowCount === 'enabled') {
                        this[ListDataProviderView._TOTALFILTEREDROWCOUNR] = totalFilteredRowCount;
                    }
                }
            };
            this[ListDataProviderView._INTERNAL_FROM] =
                this.options == null ? null : this.options[ListDataProviderView._FROM];
            this[ListDataProviderView._INTERNAL_OFFSET] =
                this.options == null
                    ? 0
                    : this.options[ListDataProviderView._OFFSET] > 0
                        ? this.options[ListDataProviderView._OFFSET]
                        : 0;
            this[ListDataProviderView._INTERNAL_SORTCRITERIA] =
                this.options == null ? null : this.options[ListDataProviderView._SORTCRITERIA];
            this[ListDataProviderView._INTERNAL_DATAMAPPING] =
                this.options == null ? null : this.options[ListDataProviderView._DATAMAPPING];
            this[ListDataProviderView._INTERNAL_FETCHATTRIBUTES] =
                this.options == null ? null : this.options[ListDataProviderView._FETCHATTRIBUTES];
            this[ListDataProviderView._INTERNAL_FILTERCRITERION] =
                this.options == null ? null : this.options[ListDataProviderView._FILTERCRITERION];
            this._addEventListeners(dataProvider);
            if (dataProvider.getCapability && !dataProvider.getCapability('filter')) {
                this._noFilterSupport = true;
            }
            Object.defineProperty(this, 'from', {
                set(value) {
                    this[ListDataProviderView._INTERNAL_FROM] = value;
                    this.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
                },
                get() {
                    return this[ListDataProviderView._INTERNAL_FROM];
                },
                enumerable: true
            });
            Object.defineProperty(this, 'offset', {
                set(value) {
                    this[ListDataProviderView._INTERNAL_OFFSET] = value;
                    this.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
                },
                get() {
                    return this[ListDataProviderView._INTERNAL_OFFSET];
                },
                enumerable: true
            });
            Object.defineProperty(this, 'sortCriteria', {
                set(value) {
                    this[ListDataProviderView._INTERNAL_SORTCRITERIA] = value;
                    this.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
                },
                get() {
                    return this[ListDataProviderView._INTERNAL_SORTCRITERIA];
                },
                enumerable: true
            });
            Object.defineProperty(this, 'dataMapping', {
                set(value) {
                    this[ListDataProviderView._INTERNAL_DATAMAPPING] = value;
                    this.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
                },
                get() {
                    return this[ListDataProviderView._INTERNAL_DATAMAPPING];
                },
                enumerable: true
            });
            Object.defineProperty(this, 'attributes', {
                set(value) {
                    this[ListDataProviderView._INTERNAL_FETCHATTRIBUTES] = value;
                    this.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
                },
                get() {
                    return this[ListDataProviderView._INTERNAL_FETCHATTRIBUTES];
                },
                enumerable: true
            });
            Object.defineProperty(this, 'filterCriterion', {
                set(value) {
                    this[ListDataProviderView._INTERNAL_FILTERCRITERION] = value;
                    this.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
                },
                get() {
                    return this[ListDataProviderView._INTERNAL_FILTERCRITERION];
                },
                enumerable: true
            });
        }
        containsKeys(params) {
            if (this.dataProvider[ListDataProviderView._CONTAINSKEYS]) {
                return this.dataProvider[ListDataProviderView._CONTAINSKEYS](params);
            }
            else {
                return this.fetchByKeys(params).then((fetchByKeysResult) => {
                    const results = new Set();
                    params[ListDataProviderView._KEYS].forEach((key) => {
                        if (fetchByKeysResult[ListDataProviderView._RESULTS].get(key) != null) {
                            results.add(key);
                        }
                    });
                    return Promise.resolve(new this.ContainsKeysResults(this, params, results));
                });
            }
        }
        fetchByKeys(params) {
            const keys = params != null ? params[ListDataProviderView._KEYS] : null;
            let fetchAttributes = params != null ? params[ListDataProviderView._FETCHATTRIBUTES] : null;
            if (fetchAttributes == null) {
                fetchAttributes = this[ListDataProviderView._INTERNAL_FETCHATTRIBUTES];
            }
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
                const updatedParams = new this.FetchByKeysParameters(this, keys, params, fetchAttributes);
                if (this.dataProvider[ListDataProviderView._FETCHBYKEYS]) {
                    return resolve(this.dataProvider[ListDataProviderView._FETCHBYKEYS](updatedParams).then((value) => {
                        const resultMap = value[ListDataProviderView._RESULTS];
                        const mappedResultMap = new Map();
                        resultMap.forEach((value, key) => {
                            const mappedItem = this._getMappedItems([value]);
                            mappedResultMap.set(key, mappedItem[0]);
                        });
                        return new this.FetchByKeysResults(this, updatedParams, mappedResultMap);
                    }));
                }
                else {
                    const options = new this.FetchListParameters(this, null, ListDataProviderView._DEFAULT_SIZE, null, null, fetchAttributes);
                    const resultMap = new Map();
                    const dataProviderAsyncIterator = this.dataProvider[ListDataProviderView._FETCHFIRST](options)[Symbol.asyncIterator]();
                    return resolve(this._fetchNextSet(params, dataProviderAsyncIterator, resultMap).then((resultMap) => {
                        const mappedResultMap = new Map();
                        resultMap.forEach((value, key) => {
                            const mappedItem = this._getMappedItems([value]);
                            mappedResultMap.set(key, mappedItem[0]);
                        });
                        return new this.FetchByKeysResults(this, updatedParams, mappedResultMap);
                    }));
                }
            });
        }
        fetchByOffset(params) {
            const offset = params != null ? params[ListDataProviderView._OFFSET] : null;
            const size = params != null ? params[ListDataProviderView._SIZE] : null;
            let fetchAttributes = params != null ? params[ListDataProviderView._FETCHATTRIBUTES] : null;
            if (fetchAttributes == null) {
                fetchAttributes = this[ListDataProviderView._INTERNAL_FETCHATTRIBUTES];
            }
            let sortCriteria = params != null ? params[ListDataProviderView._SORTCRITERIA] : null;
            if (sortCriteria == null) {
                sortCriteria = this[ListDataProviderView._INTERNAL_SORTCRITERIA];
            }
            const mappedSortCriteria = this._getMappedSortCriteria(sortCriteria);
            const filterCriterion = this._combineFilters(params);
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
                const mappedFilterCriterion = this._getMappedFilterCriterion(filterCriterion);
                const updatedParams = new this.FetchByOffsetParameters(this, offset, params, size, mappedSortCriteria, mappedFilterCriterion, fetchAttributes);
                return resolve(this.dataProvider[ListDataProviderView._FETCHBYOFFSET](updatedParams).then((value) => {
                    const resultArray = value[ListDataProviderView._RESULTS];
                    const done = value[ListDataProviderView._DONE];
                    const totalFilteredRowCount = value[ListDataProviderView._TOTALFILTEREDROWCOUNR];
                    const mappedResultArray = new Array();
                    resultArray.forEach((value) => {
                        const mappedItem = this._getMappedItems([value]);
                        mappedResultArray.push(mappedItem[0]);
                    });
                    return new this.FetchByOffsetResults(this, updatedParams, mappedResultArray, done, totalFilteredRowCount);
                }));
            });
        }
        fetchFirst(params) {
            const cachedData = {};
            cachedData[ListDataProviderView._ITEMS] = [];
            cachedData[ListDataProviderView._DONE] = false;
            cachedData[ListDataProviderView._STARTINDEX] = 0;
            cachedData[ListDataProviderView._LASTDONEHASDATA] = false;
            const size = params != null ? params[ListDataProviderView._SIZE] : null;
            const signal = params === null || params === void 0 ? void 0 : params.signal;
            let sortCriteria = params != null ? params[ListDataProviderView._SORTCRITERIA] : null;
            if (sortCriteria == null) {
                sortCriteria = this[ListDataProviderView._INTERNAL_SORTCRITERIA];
            }
            const mappedSortCriteria = this._getMappedSortCriteria(sortCriteria);
            const filterCriterion = this._combineFilters(params);
            const mappedFilterCriterion = this._getMappedFilterCriterion(filterCriterion);
            let fetchAttributes = params != null ? params[ListDataProviderView._FETCHATTRIBUTES] : null;
            if (fetchAttributes == null) {
                fetchAttributes = this[ListDataProviderView._INTERNAL_FETCHATTRIBUTES];
            }
            if (this[ListDataProviderView._INTERNAL_FROM] == null &&
                this[ListDataProviderView._INTERNAL_OFFSET] > 0) {
                let offset = this[ListDataProviderView._INTERNAL_OFFSET];
                return new this.AsyncIterable(this, new this.AsyncIterator(this, ((cachedData) => {
                    return () => {
                        const updatedParams = new this.FetchByOffsetParameters(this, offset, null, size, mappedSortCriteria, mappedFilterCriterion, fetchAttributes, signal);
                        return this.dataProvider[ListDataProviderView._FETCHBYOFFSET](updatedParams).then((result) => {
                            const results = result['results'];
                            offset = offset + results.length;
                            const mappedResult = this._getMappedItems(results);
                            this._cacheResult(cachedData, mappedResult);
                            cachedData[ListDataProviderView._DONE] = result[ListDataProviderView._DONE];
                            const data = mappedResult.map((value) => {
                                return value[ListDataProviderView._DATA];
                            });
                            const metadata = mappedResult.map((value) => {
                                return value[ListDataProviderView._METADATA];
                            });
                            const resultFetchParams = result[ListDataProviderView._FETCHPARAMETERS];
                            const resultSortCriteria = resultFetchParams != null
                                ? resultFetchParams[ListDataProviderView._SORTCRITERIA]
                                : null;
                            const resultFilterCriterion = resultFetchParams != null
                                ? resultFetchParams[ListDataProviderView._FILTERCRITERION]
                                : null;
                            const unmappedResultSortCriteria = this._getUnmappedSortCriteria(resultSortCriteria);
                            const unmappedResultFilterCriterion = this._getUnmappedFilterCriterion(resultFilterCriterion);
                            const resultParams = new this.FetchByOffsetParameters(this, this[ListDataProviderView._INTERNAL_OFFSET], null, size, unmappedResultSortCriteria, unmappedResultFilterCriterion);
                            if (cachedData[ListDataProviderView._DONE]) {
                                return Promise.resolve(new this.AsyncIteratorReturnResult(this, new this.FetchListResult(this, resultParams, data, metadata)));
                            }
                            return Promise.resolve(new this.AsyncIteratorYieldResult(this, new this.FetchListResult(this, resultParams, data, metadata)));
                        });
                    };
                })(cachedData), params));
            }
            else {
                const updatedParams = new this.FetchListParameters(this, params, size, mappedSortCriteria, mappedFilterCriterion, fetchAttributes, signal);
                const cachedAsyncIterator = this.dataProvider[ListDataProviderView._FETCHFIRST](updatedParams)[Symbol.asyncIterator]();
                return new this.AsyncIterable(this, new this.AsyncIterator(this, ((cachedData, cachedAsyncIterator) => {
                    return () => {
                        if (cachedData[ListDataProviderView._LASTDONEHASDATA]) {
                            cachedData[ListDataProviderView._LASTDONEHASDATA] = false;
                            return Promise.resolve(new this.AsyncIteratorReturnResult(this, new this.FetchListResult(this, params, [], [], 0)));
                        }
                        return cachedAsyncIterator.next().then((result) => {
                            let resultValue = result[ListDataProviderView._VALUE];
                            if (!resultValue) {
                                resultValue = { data: [], metadata: [], fetchParameters: null };
                            }
                            const data = resultValue[ListDataProviderView._DATA];
                            const totalFilteredRowCount = resultValue.totalFilteredRowCount;
                            const metadata = resultValue[ListDataProviderView._METADATA];
                            const items = data.map((value, index) => {
                                return new this.Item(this, metadata[index], data[index]);
                            });
                            if (this._noFilterSupport) {
                                this._filterResult(mappedFilterCriterion, items);
                            }
                            const mappedResult = this._getMappedItems(items);
                            this._cacheResult(cachedData, mappedResult);
                            cachedData[ListDataProviderView._DONE] = result[ListDataProviderView._DONE];
                            const size = params != null ? params[ListDataProviderView._SIZE] : null;
                            const offset = params != null ? params[ListDataProviderView._OFFSET] : null;
                            const resultFetchParams = resultValue[ListDataProviderView._FETCHPARAMETERS];
                            const resultSortCriteria = resultFetchParams != null
                                ? resultFetchParams[ListDataProviderView._SORTCRITERIA]
                                : null;
                            const resultFilterCriterion = resultFetchParams != null
                                ? resultFetchParams[ListDataProviderView._FILTERCRITERION]
                                : null;
                            const unmappedResultSortCriteria = this._getUnmappedSortCriteria(resultSortCriteria);
                            const unmappedResultFilterCriterion = this._getUnmappedFilterCriterion(resultFilterCriterion);
                            const resultParams = new this.FetchListParameters(this, params, size, unmappedResultSortCriteria, unmappedResultFilterCriterion);
                            return this._fetchUntilKey(resultParams, this[ListDataProviderView._INTERNAL_FROM], cachedData, cachedAsyncIterator).then(() => {
                                return this._fetchUntilOffset(resultParams, this[ListDataProviderView._INTERNAL_OFFSET] +
                                    cachedData[ListDataProviderView._STARTINDEX], data.length, cachedData, cachedAsyncIterator, totalFilteredRowCount);
                            });
                        });
                    };
                })(cachedData, cachedAsyncIterator), params));
            }
        }
        getCapability(capabilityName) {
            return this.dataProvider.getCapability(capabilityName);
        }
        getTotalSize() {
            return this.dataProvider.getTotalSize();
        }
        isEmpty() {
            return this.dataProvider.isEmpty();
        }
        _fetchNextSet(params, dataProviderAsyncIterator, resultMap) {
            return dataProviderAsyncIterator.next().then((result) => {
                let value = result[ListDataProviderView._VALUE];
                if (!value) {
                    value = { data: [], metadata: [], fetchParameters: null };
                }
                const data = value[ListDataProviderView._DATA];
                const metadata = value[ListDataProviderView._METADATA];
                const keys = metadata.map((metadata) => {
                    return metadata[ListDataProviderView._KEY];
                });
                let foundAllKeys = true;
                params[ListDataProviderView._KEYS].forEach((findKey) => {
                    if (!resultMap.has(findKey)) {
                        keys.map((key, index) => {
                            if (oj.Object.compareValues(key, findKey)) {
                                resultMap.set(findKey, new this.Item(this, metadata[index], data[index]));
                            }
                        });
                    }
                    if (!resultMap.has(findKey)) {
                        foundAllKeys = false;
                    }
                });
                if (!foundAllKeys && !result[ListDataProviderView._DONE]) {
                    return this._fetchNextSet(params, dataProviderAsyncIterator, resultMap);
                }
                else {
                    return resultMap;
                }
            });
        }
        _fetchUntilKey(params, key, cachedData, cachedAsyncIterator) {
            if (key != null) {
                const resultItems = cachedData[ListDataProviderView._ITEMS].filter((resultItem) => {
                    if (oj.KeyUtils.equals(resultItem[ListDataProviderView._METADATA][ListDataProviderView._KEY], key)) {
                        return true;
                    }
                });
                if (resultItems.length > 0) {
                    const itemIndex = cachedData[ListDataProviderView._ITEMS].indexOf(resultItems[0]);
                    cachedData[ListDataProviderView._ITEMS] = cachedData[ListDataProviderView._ITEMS].slice(itemIndex, cachedData[ListDataProviderView._ITEMS].length);
                }
                else if (!cachedData[ListDataProviderView._DONE]) {
                    return cachedAsyncIterator.next().then((nextResult) => {
                        let value = nextResult[ListDataProviderView._VALUE];
                        if (!value) {
                            value = { data: [], metadata: [], fetchParameters: null };
                        }
                        const data = value[ListDataProviderView._DATA];
                        const metadata = value[ListDataProviderView._METADATA];
                        const items = data.map((value, index) => {
                            return new this.Item(this, metadata[index], data[index]);
                        });
                        const mappedResult = this._getMappedItems(items);
                        this._cacheResult(cachedData, mappedResult);
                        cachedData[ListDataProviderView._DONE] = nextResult[ListDataProviderView._DONE];
                        return this._fetchUntilKey(nextResult[ListDataProviderView._FETCHPARAMETERS], mappedResult[ListDataProviderView._KEYS], cachedData, cachedAsyncIterator);
                    });
                }
                else {
                    cachedData[ListDataProviderView._ITEMS] = [];
                }
            }
            return Promise.resolve(null);
        }
        _fetchUntilOffset(params, offset, resultSize, cachedData, cachedAsyncIterator, totalFilteredRowCount) {
            const fetchSize = params != null
                ? params[ListDataProviderView._SIZE] > 0
                    ? params[ListDataProviderView._SIZE]
                    : resultSize
                : resultSize;
            offset = offset > 0 ? offset : 0;
            const cachedItems = cachedData[ListDataProviderView._ITEMS].slice(offset, offset + fetchSize);
            if (this._noFilterSupport) {
                const mappedFilterCriterion = this._getMappedFilterCriterion(params[ListDataProviderView._FILTERCRITERION]);
                this._filterResult(mappedFilterCriterion, cachedItems);
            }
            if (params &&
                params[ListDataProviderView._SIZE] > 0 &&
                cachedItems.length < fetchSize &&
                !cachedData[ListDataProviderView._DONE]) {
                return cachedAsyncIterator.next().then((nextResult) => {
                    let value = nextResult[ListDataProviderView._VALUE];
                    if (!value) {
                        value = { data: [], metadata: [], fetchParameters: null };
                    }
                    const data = value[ListDataProviderView._DATA];
                    const metadata = value[ListDataProviderView._METADATA];
                    const items = data.map((value, index) => {
                        return new this.Item(this, metadata[index], data[index]);
                    });
                    if (this._noFilterSupport) {
                        const mappedFilterCriterion = this._getMappedFilterCriterion(params[ListDataProviderView._FILTERCRITERION]);
                        this._filterResult(mappedFilterCriterion, items);
                    }
                    const mappedResult = this._getMappedItems(items);
                    this._cacheResult(cachedData, mappedResult);
                    cachedData[ListDataProviderView._DONE] = nextResult[ListDataProviderView._DONE];
                    return this._fetchUntilOffset(params, offset, data.length, cachedData, cachedAsyncIterator, totalFilteredRowCount);
                });
            }
            return this._createResultPromise(params, cachedData, cachedItems, totalFilteredRowCount);
        }
        _createResultPromise(params, cachedData, cachedItems, totalFilteredRowCount) {
            cachedData[ListDataProviderView._STARTINDEX] =
                cachedData[ListDataProviderView._STARTINDEX] + cachedItems.length;
            const data = cachedItems.map((item) => {
                return item[ListDataProviderView._DATA];
            });
            const metadata = cachedItems.map((item) => {
                return item[ListDataProviderView._METADATA];
            });
            let isDone = false;
            if (cachedData[ListDataProviderView._DONE]) {
                if (data.length === 0) {
                    isDone = true;
                }
                else {
                    cachedData[ListDataProviderView._LASTDONEHASDATA] = true;
                }
            }
            if (isDone) {
                return Promise.resolve(new this.AsyncIteratorReturnResult(this, new this.FetchListResult(this, params, data, metadata, totalFilteredRowCount)));
            }
            return Promise.resolve(new this.AsyncIteratorYieldResult(this, new this.FetchListResult(this, params, data, metadata, totalFilteredRowCount)));
        }
        _cacheResult(cachedData, items) {
            items.forEach((value) => {
                cachedData[ListDataProviderView._ITEMS].push(value);
            });
        }
        _filterResult(filterCriterion, items) {
            if (filterCriterion) {
                if (!filterCriterion.filter) {
                    filterCriterion = ojdataprovider.FilterFactory.getFilter({ filterDef: filterCriterion });
                }
                let i = items.length - 1;
                while (i >= 0) {
                    if (!filterCriterion.filter(items[i][ListDataProviderView._DATA])) {
                        items.splice(i, 1);
                    }
                    i--;
                }
            }
        }
        _getMappedItems(items) {
            if (this[ListDataProviderView._INTERNAL_DATAMAPPING] != null) {
                const mapFields = this[ListDataProviderView._INTERNAL_DATAMAPPING][ListDataProviderView._MAPFIELDS];
                if (mapFields != null && items != null && items.length > 0) {
                    const mappedItems = items.map((value) => {
                        return mapFields.bind(this)(value);
                    });
                    return mappedItems;
                }
            }
            return items;
        }
        _combineFilters(params) {
            const filters = [];
            let i = 0;
            if (params != null && params[ListDataProviderView._FILTERCRITERION] != null) {
                filters[i] = params[ListDataProviderView._FILTERCRITERION];
                i++;
            }
            if (this[ListDataProviderView._INTERNAL_FILTERCRITERION] != null) {
                filters[i] = this[ListDataProviderView._INTERNAL_FILTERCRITERION];
            }
            let filterCriterion;
            if (filters.length == 0) {
                filterCriterion = null;
            }
            else if (filters.length == 1) {
                filterCriterion = filters[0];
            }
            else {
                filterCriterion = ojdataprovider.FilterFactory.getFilter({ filterDef: { op: '$and', criteria: filters } });
            }
            return filterCriterion;
        }
        _getMappedFilterCriterion(filterCriterion) {
            if (this[ListDataProviderView._INTERNAL_DATAMAPPING] != null) {
                const mappedFilterCriterion = this[ListDataProviderView._INTERNAL_DATAMAPPING][ListDataProviderView._MAPFILTERCRITERION];
                if (mappedFilterCriterion != null && filterCriterion != null) {
                    return mappedFilterCriterion(filterCriterion);
                }
            }
            return filterCriterion;
        }
        _getMappedSortCriteria(sortCriteria) {
            if (this[ListDataProviderView._INTERNAL_DATAMAPPING] != null) {
                const mapSortCriteria = this[ListDataProviderView._INTERNAL_DATAMAPPING][ListDataProviderView._MAPSORTCRITERIA];
                if (mapSortCriteria != null && sortCriteria != null && sortCriteria.length > 0) {
                    return mapSortCriteria(sortCriteria);
                }
            }
            return sortCriteria;
        }
        _getUnmappedSortCriteria(sortCriteria) {
            if (this[ListDataProviderView._INTERNAL_DATAMAPPING] != null) {
                const unmapSortCriteria = this[ListDataProviderView._INTERNAL_DATAMAPPING][ListDataProviderView._UNMAPSORTCRITERIA];
                if (unmapSortCriteria != null && sortCriteria != null && sortCriteria.length > 0) {
                    return unmapSortCriteria(sortCriteria);
                }
            }
            return sortCriteria;
        }
        _getUnmappedFilterCriterion(filter) {
            if (this[ListDataProviderView._INTERNAL_DATAMAPPING] != null) {
                const unmapFilterCriterion = this[ListDataProviderView._INTERNAL_DATAMAPPING][ListDataProviderView._UNMAPFILTERCRITERION];
                if (unmapFilterCriterion != null && filter != null) {
                    return unmapFilterCriterion(filter);
                }
            }
            return filter;
        }
        _addEventListeners(dataprovider) {
            dataprovider[ListDataProviderView._ADDEVENTLISTENER](ListDataProviderView._REFRESH, (event) => {
                this.dispatchEvent(event);
            });
            dataprovider[ListDataProviderView._ADDEVENTLISTENER](ListDataProviderView._MUTATE, (event) => {
                this.dispatchEvent(event);
            });
        }
    }
    ListDataProviderView._KEY = 'key';
    ListDataProviderView._KEYS = 'keys';
    ListDataProviderView._DATA = 'data';
    ListDataProviderView._STARTINDEX = 'startIndex';
    ListDataProviderView._SORT = 'sort';
    ListDataProviderView._INTERNAL_SORTCRITERIA = '_sortCriteria';
    ListDataProviderView._SORTCRITERIA = 'sortCriteria';
    ListDataProviderView._INTERNAL_FILTERCRITERION = '_filterCriterion';
    ListDataProviderView._FILTERCRITERION = 'filterCriterion';
    ListDataProviderView._METADATA = 'metadata';
    ListDataProviderView._ITEMS = 'items';
    ListDataProviderView._INTERNAL_FROM = '_from';
    ListDataProviderView._INTERNAL_OFFSET = '_offset';
    ListDataProviderView._FROM = 'from';
    ListDataProviderView._OFFSET = 'offset';
    ListDataProviderView._REFRESH = 'refresh';
    ListDataProviderView._MUTATE = 'mutate';
    ListDataProviderView._SIZE = 'size';
    ListDataProviderView._FETCHPARAMETERS = 'fetchParameters';
    ListDataProviderView._VALUE = 'value';
    ListDataProviderView._DONE = 'done';
    ListDataProviderView._LASTDONEHASDATA = 'lastDoneHasData';
    ListDataProviderView._INTERNAL_DATAMAPPING = '_dataMapping';
    ListDataProviderView._DATAMAPPING = 'dataMapping';
    ListDataProviderView._MAPFIELDS = 'mapFields';
    ListDataProviderView._MAPSORTCRITERIA = 'mapSortCriteria';
    ListDataProviderView._MAPFILTERCRITERION = 'mapFilterCriterion';
    ListDataProviderView._UNMAPSORTCRITERIA = 'unmapSortCriteria';
    ListDataProviderView._UNMAPFILTERCRITERION = 'unmapFilterCriterion';
    ListDataProviderView._RESULTS = 'results';
    ListDataProviderView._CONTAINSPARAMETERS = 'containsParameters';
    ListDataProviderView._DEFAULT_SIZE = 25;
    ListDataProviderView._CONTAINSKEYS = 'containsKeys';
    ListDataProviderView._FETCHBYKEYS = 'fetchByKeys';
    ListDataProviderView._FETCHBYOFFSET = 'fetchByOffset';
    ListDataProviderView._FETCHFIRST = 'fetchFirst';
    ListDataProviderView._ADDEVENTLISTENER = 'addEventListener';
    ListDataProviderView._INTERNAL_FETCHATTRIBUTES = '_attributes';
    ListDataProviderView._FETCHATTRIBUTES = 'attributes';
    ListDataProviderView._TOTALFILTEREDROWCOUNR = 'totalFilteredRowCount';
    ListDataProviderView._SIGNAL = 'signal';
    ojeventtarget.EventTargetMixin.applyMixin(ListDataProviderView);
    oj._registerLegacyNamespaceProp('ListDataProviderView', ListDataProviderView);

    return ListDataProviderView;

});
