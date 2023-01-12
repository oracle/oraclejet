/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { EventTargetMixin } from 'ojs/ojeventtarget';
import { DataProviderRefreshEvent, DataProviderMutationEvent, FilterFactory } from 'ojs/ojdataprovider';
import ojSet from 'ojs/ojset';
import ojMap from 'ojs/ojmap';
import { deepFreeze } from 'ojs/ojmetadatautils';

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 *
 * @since 11.0.0
 * @export
 * @final
 * @class RESTDataProvider
 * @implements DataProvider
 * @classdesc This class implements {@link DataProvider}.
 *            Object representing data available from a JSON-based REST service.
 *            This dataprovider can be used by [ListView]{@link oj.ojListView}, [NavigationList]{@link oj.ojNavigationList},
 *            [TabBar]{@link oj.ojTabBar}, and [Table]{@link oj.ojTable}.<br><br>
 * RESTDataProvider is an implementation of DataProvider for fetching data from a JSON-based REST API using the Fetch API . RESTDataProvider fetch calls are based on transforms which are specified as an option to the RESTDataProvider constructor. For each fetch method (fetchFirst, fetchByOffset and fetchByKeys), they define the following functions:
 * <ul>
 * <li>request : function that returns a Promise that resolves to a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Request">Request</a> object to use for the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API">Fetch API</a> call to the the REST API. This is where any required query parameters for paging, filtering, sorting and more can be applied to the URL which can then be used to create a request. Other request options, such as headers , body and method can also be added to the request if needed. If written in Typescript, the function can be defined using async which automatically wraps the return value in a Promise . Otherwise, a Promise has to be explicitly returned e.g return Promise.resolve(new Request(...)) . </li>
 * <li>response : function that extracts the data and other relevant values from the response body and returns a Promise that resolves to those values. The function must at least return an object with a data property that is an array of items of shape D (generic passed into RESTDataProvider class). If written in Typescript, the function can be defined using async which automatically wraps the return value in a Promise . Otherwise, a Promise has to be explicitly returned e.g return Promise.resolve({ data }) .</li>
 * </ul>
 * Please navigate to the corresponding demos for details of how to define transforms to accomplish various fetch tasks. <br><br>
 *
 * <h3 id="events-section">
 *   Events
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
 * </h3>
 * Consumers can add event listeners to listen for the following event types.
 * <h4 id="event:mutate" class="name">
 * mutate
 * </h4>
 * This event is fired when the mutate method is called.
 * <p>
 * Event payload is found under <code class="prettyprint">event.detail</code>, which implements the {@link DataProviderMutationEventDetail} interface.
 * </p>
 *
 * <h4 id="event:refresh" class="name">
 *   refresh
 * </h4>
 * This event is fired when the refresh method is called.
 * <p>
 * This event contains no additional event payload.
 * </p>
 *
 * <i>Example of consumer listening for the "mutate" event type:</i>
 * <pre class="prettyprint"><code>var listener = function(event) {
 *   if (event.detail.remove) {
 *     var removeDetail = event.detail.remove;
 *     // Handle removed items
 *   }
 * };
 * dataProvider.addEventListener("mutate", listener);
 * </code></pre>
 *
 * @param {Object} options options for the RESTDataProvider
 * @ojsignature [{target: "Type",
 *               value: "class RESTDataProvider<K, D> implements DataProvider<K, D>",
 *               genericTypeParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
 *               {target: "Type",
 *               value: "RESTDataProvider.Options<K, D>",
 *               for: "options"}]
 *
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 * "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
 * "FetchListResult","FetchListParameters", "FetchByKeysCapability", "FetchByOffsetCapability", "FilterCapability",
 * "SortCapability", "DataProviderMutationEventDetail", "ItemMetadata"]}
 * @ojtsexample
 * // First create an options object with the minimum fields
 * const options = {
 *  url: 'url/to/rest/endpoint',
 *  transforms: {
 *   // fetchByOffset and fetchByKeys delegate to fetchFirst if their capabilities are not defined
 *   // so at minimum we must specify transforms for fetchFirst
 *   fetchFirst: {
 *     request: async (options) => {
 *       // Use size and offset to set the expected paging parameters and create a request.
 *       // In this example, "size" corresponds to the endpoint' "limit"
 *       // parameter and "offset" corresponds to the endpoint' "offset" parameter for the mock
 *       // server. Note that the function needs to return a Promise, hence the use of async which
 *       // automatically wraps the return value in one
 *       const url = new URL(options.url);
 *       const { size, offset } = options.fetchParameters;
 *       url.searchParams.set("limit", String(size));
 *       url.searchParams.set("offset", String(offset));
 *       return new Request(url.href);
 *     },
 *     response: async ({ body }) => {
 *       // The mock server sends back a response body with shape { hasMore, keys, totalSize, data} so
 *       // we need to extract and return them. "keys" is optional, it is needed when the REST endpoint
 *       // returns the set of keys associated with the data. When not available, RESTDataProvider generates
 *       // the keys from the data based on keyAttributes. Again, note that the function needs to return a
 *       // Promise hence the use of async which automatically wraps the return value in one
 *       const { data, keys, totalSize, hasMore } = body;
 *       return { data, keys, totalSize, hasMore };
 *     }
 *   }
 *  }
 * };
 * // Then create an RESTDataProvider object with the options
 * const dataprovider = new RESTDataProvider(options);
 * @example
 * // First create an options object with the minimum fields
 * var options = {
 *  url: 'url/to/rest/endpoint',
 *  transforms: {
 *   // fetchByOffset and fetchByKeys delegate to fetchFirst if their capabilities are not defined
 *   // so at minimum we must specify transforms for fetchFirst
 *   fetchFirst: {
 *     request: (options) => {
 *       // Use size and offset to set the expected paging parameters and create a request.
 *       // In this example, "size" corresponds to the endpoint' "limit"
 *       // parameter and "offset" corresponds to the endpoint' "offset" parameter for the mock
 *       // server. Note that the function needs to return a Promise
 *       const url = new URL(options.url);
 *       const size = options.fetchParameters.offset;
 *       const offset = options.fetchParameters.offset;
 *       url.searchParams.set("limit", String(size));
 *       url.searchParams.set("offset", String(offset));
 *       return Promise.resolve(new Request(url.href));
 *     },
 *     response: ({ body }) => {
 *       // The mock server sends back a response body with shape { hasMore, keys, totalSize, data} so
 *       // we need to extract and return them. "keys" is optional, it is needed when the REST endpoint
 *       // returns the set of keys associated with the data. When not available, RESTDataProvider generates
 *       // the keys from the data based on keyAttributes. Again, note that the function needs to return a
 *       // Promise
 *       return Promise.resolve({ data: body.data, totalSize: body.totalSize, hasMore: body.hasMore });
 *     }
 *   }
 *  }
 * };
 * // Then create an RESTDataProvider object with the options
 * const dataprovider = new RESTDataProvider(options);
 */

/**
 * @typedef {Object} RESTDataProvider.Options
 * @property {string} url - URL of the REST endpoint to fetch data from.
 * @property {string} keyAttributes - The field name which stores the key in the data. Can be a string denoting a single key attribute or an array
 * of strings for multiple key attributes.
 * @property {Object} transforms - Object which defines functions that transform the request when fetchFirst, fetchByOffset and fetchByKeys are called.
 * @property {Object=} capabilities - Object which defines the capabilities of the RESTDataProvider instance based on the REST service is fetches data from.
 * @property {Array=} implicitSort - Array of {@link SortCriterion} used to specify sort information when the fetched data is already sorted.
 * For example, ojTable will display the column sort indicator for the corresponding column in either ascending or descending order upon initial render.
 * This option is not used for cases where we want the RESTDataProvider to apply a sort on initial fetch.
 * @property {Array=} textFilterAttributes - Specify which attributes the filter should be applied on when a TextFilter filterCriteria is specified.
 * @property {number=} iterationLimit - Specify the maximum number of rows to fetch when iterating through the data. This is particularly useful when fetchByKeys
 * delegates to fetchFirst (because the fetchByKeys capability has not be set with an implementation of "lookup" or "batchLookup"). In the fetchByKeys case,
 * fetchFirst has to iterate through all the data in search of rows corresponding to the provided keys. Without an iteration limit, the iteration can continue
 * for a long time if the provided keys are invalid or the corresponding rows are at the end of the dataset.
 * @ojsignature [
 *  {target: "Type", value: "<K, D>", for: "genericTypeParameters"},
 *  {target: "Type", value: "string | string[]", for: "keyAttributes"},
 *  {target: "Type", value: "Transforms<K, D>", for: "transforms"},
 *  {target: "Type", value: "Capabilities", for: "capabilities"},
 *  {target: "Type", value: "Array<SortCriterion<D>>", for: "implicitSort"},
 *  {target: "Type", value: "string[]", for: "textFilterAttributes"}
 * ]
 */

/**
 * @typedef {Object} RESTDataProvider.Transforms
 * @property {Object=} fetchFirst - Object which specifies transforms for fetchFirst calls
 * @property {Object=} fetchByOffset - Object which specifies transforms for fetchByOffset calls
 * @property {Object=} fetchByKeys - Object which specifies transforms for fetchByKeys calls
 * @ojsignature [
 *  {target: "Type", value: "<K, D>", for: "genericTypeParameters"},
 *  {target: "Type", value: "FetchByOffsetTransforms<K, D>", for: "fetchFirst"},
 *  {target: "Type", value: "FetchByOffsetTransforms<K, D>", for: "fetchByOffset"},
 *  {target: "Type", value: "FetchByKeysTransforms<K, D>", for: "fetchByKeys"}
 * ]
 */

/**
 * @typedef {Object} RESTDataProvider.FetchByOffsetTransforms
 * @property {Object=} request - Object which specifies request transforms
 * @property {Object=} response - Object which specifies response transforms
 * @ojsignature [
 *  {target: "Type", value: "<K, D>", for: "genericTypeParameters"},
 *  {target: "Type", value: "FetchByOffsetRequestTransform<K, D>", for: "request"},
 *  {target: "Type", value: "FetchResponseTransform<K, D>", for: "response"}
 * ]
 */

/**
 * @typedef {Object} RESTDataProvider.FetchByKeysTransforms
 * @property {Object=} request - Object which specifies request transforms
 * @property {Object=} response - Object which specifies response transforms
 * @ojsignature [
 *  {target: "Type", value: "<K, D>", for: "genericTypeParameters"},
 *  {target: "Type", value: "FetchByKeysRequestTransform<K>", for: "request"},
 *  {target: "Type", value: "FetchResponseTransform<K, D>", for: "response"}
 * ]
 */

/**
 * @typedef {Function} RESTDataProvider.FetchByOffsetRequestTransform
 * @ojsignature [
 *   {target: "Type", value: "<K, D>", for: "genericTypeParameters"},
 *   {target: "Type", value: "(options: FetchByOffsetRequestTransformOptions<K, D>) => Promise<Request>"}
 * ]
 */

/**
 * @typedef {Object} RESTDataProvider.FetchByOffsetRequestTransformOptions
 * @property {string} url - url to use for fetch call
 * @property {Object} fetchParameters - fetch parameters of the called fetch method
 * @property {string} fetchType - fetch method called
 * @property {Object} fetchOptions - fetch options passed into constructor such as textFilterAttributes
 * @ojsignature [
 *  {target: "Type", value: "<K, D>", for: "genericTypeParameters"},
 *  {target: "Type", value: "FetchByOffsetParameters<D>", for: "fetchParameters"},
 *  {target: "Type", value: "'fetchFirst' | 'fetchByOffset'", for: "fetchType"},
 *  {target: "Type", value: "{ textFilterAttributes?: Options<K, D>['textFilterAttributes'] }", for: "fetchOptions"}
 * ]
 */

/**
 * @typedef {Function} RESTDataProvider.FetchByKeysRequestTransform
 * @ojsignature [
 *   {target: "Type", value: "<K>", for: "genericTypeParameters"},
 *   {target: "Type", value: "(options: FetchByKeysRequestTransformOptions<K>) => Promise<Request>"}
 * ]
 */

/**
 * @typedef {Object} RESTDataProvider.FetchByKeysRequestTransformOptions
 * @property {string} url - url to use for fetch call
 * @property {Object} fetchParameters - fetch parameters of the called fetch method
 * @property {string} fetchType - fetch method called
 * @ojsignature [
 *  {target: "Type", value: "<K>", for: "genericTypeParameters"},
 *  {target: "Type", value: "FetchByKeysParameters<K>", for: "fetchParameters"},
 *  {target: "Type", value: "'fetchByKeys'", for: "fetchType"}
 * ]
 */

/**
 * @typedef {Function} RESTDataProvider.FetchResponseTransform
 * @ojsignature [
 *   {target: "Type", value: "<K, D>", for: "genericTypeParameters"},
 *   {target: "Type", value: "(options: FetchResponseTransformOptions) => Promise<FetchResponseTransformResult<K, D>>"}
 * ]
 */

/**
 * @typedef {Object} RESTDataProvider.FetchResponseTransformOptions
 * @property {number} status - response status number
 * @property {Object} headers - response headers object
 * @property {Object} body - response body
 * @ojsignature [
 *  {target: "Type", value: "Headers", for: "headers"},
 *  {target: "Type", value: "any", for: "body"}
 * ]
 */

/**
 * @typedef {Object} RESTDataProvider.FetchResponseTransformResult
 * @property {Array} data - fetched data
 * @property {Array=} keys - keys associated with fetched data. If keys is returned but not metadata,
 * the metadata will be generated from the keys
 * @property {Array=} metadata - metadata associated with fetched data. If metadata is returned
 * but not keys, the keys will be extracted from the metadata
 * @property {number=} totalSize - total number of rows available
 * @property {boolean=} hasMore - whether there are more rows available to be fetched
 * @ojsignature [
 *  {target: "Type", value: "<K, D>", for: "genericTypeParameters"},
 *  {target: "Type", value: "D[]", for: "data"},
 *  {target: "Type", value: "K[]", for: "keys"},
 *  {target: "Type", value: "ItemMetadata<K>[]", for: "metadata"}
 * ]
 */

/**
 * @typedef {Object} RESTDataProvider.Capabilities
 * @property {FetchByKeysCapability=} fetchByKeys - Optional FetchByKeysCapability object. If not set or if the implementation is "iteration", fetchByKeys
 * calls will delegate to fetchFirst which is not efficient. If the implementation is "lookup", individual requests will be made for each key and then
 * combined. If the implementation is "batchLookup", a single request will be made for all keys. Please see {@link RESTDataProvider.Transforms}
 * for how requests should be transformed for fetchByKeys calls.
 * @property {FetchByOffsetCapability=} fetchByOffset - Optional FetchByOffsetCapability object. If not set or if the implementation is "iteration",
 * fetchByOffset calls will delegate to fetchFirst which is not efficient. When implementation is "randomAccess", data can be fetched from any offset
 * and in order and not just from sequentially from the beginning.
 * @property {FilterCapability=} filter - Optional FilterCapability object which specifies the type of filtering supported by the REST service.
 * @property {SortCapability=} sort - Optional SortCapability object which specifies the type of sorting supported by the REST service.
 * @ojsignature [
 *  {target: "Type", value: "FetchByKeysCapability", for: "fetchByKeys"},
 *  {target: "Type", value: "FetchByOffsetCapability", for: "fetchByOffset"},
 *  {target: "Type", value: "FilterCapability", for: "filter"},
 *  {target: "Type", value: "SortCapability", for: "sort"}
 * ]
 */

/**
 * @inheritdoc
 * @memberof RESTDataProvider
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * @inheritdoc
 * @memberof RESTDataProvider
 * @instance
 * @method
 * @name createOptimizedKeySet
 */

/**
 * @inheritdoc
 * @memberof RESTDataProvider
 * @instance
 * @method
 * @name createOptimizedKeyMap
 */

/**
 * @inheritdoc
 * @memberof RESTDataProvider
 * @instance
 * @method
 * @name fetchFirst
 */

/**
 * @inheritdoc
 * @memberof RESTDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * @inheritdoc
 * @memberof RESTDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * @inheritdoc
 * @memberof RESTDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * @inheritdoc
 * @memberof RESTDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * @inheritdoc
 * @memberof RESTDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * @inheritdoc
 * @memberof RESTDataProvider
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @inheritdoc
 * @memberof RESTDataProvider
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @inheritdoc
 * @memberof RESTDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 */

/**
 * Triggers a "mutate" event, with the passed in mutation detail, for listening dataprovider consumers.
 * RESTDataProvider does not support CRUD operations and as such, applications are responsible for calling this
 * method when a change happens to notify consumers.
 *
 * @since 11.0.0
 * @param {DataProviderMutationEventDetail } detail - mutation detail
 * @export
 * @expose
 * @memberof RESTDataProvider
 * @instance
 * @method
 * @name mutate
 * @ojsignature {target: "Type",
 *               value: "(detail : DataProviderMutationEventDetail<K, D>) : void"}
 * @ojtsexample <caption>Trigger "mutate" event with passed in mutation detail</caption>
 * dataprovider.mutate({
 *   add: {
 *     data: [row],
 *     indexes: [rowIndex],
 *     keys: new Set([rowKey]),
 *     metadata: [{ key: rowKey }]
 *   }
 * });
 */

/**
 * Triggers a "refresh" event for listening dataprovider consumers.
 *
 * @since 11.0.0
 * @export
 * @expose
 * @memberof RESTDataProvider
 * @instance
 * @method
 * @name refresh
 * @ojsignature {target: "Type",
 *               value: "() : void"}
 * @ojtsexample <caption>Trigger "refresh" event</caption>
 * dataprovider.refresh();
 */

// end of jsdoc

var __awaiter = (null && null.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class RESTHelper {
    constructor(options) {
        this.options = options;
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield this._createRequest();
            const signal = this.options.fetchParameters.signal;
            const response = yield fetch(request, { signal: signal });
            return this._parseResponse(response);
        });
    }
    _createRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, transforms, fetchParameters, fetchType, fetchOptions } = this.options;
            const transform = transforms[fetchType].request;
            if (transform) {
                const transformOptions = deepFreeze({ url, fetchParameters, fetchType, fetchOptions });
                return transform(transformOptions);
            }
            return new Request(url);
        });
    }
    _parseResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedResponse = {
                status: response.status,
                headers: response.headers,
                body: yield this._getResponseBody(response)
            };
            if (!response.ok) {
                throw parsedResponse;
            }
            return this._applyResponseTransforms(parsedResponse);
        });
    }
    _getResponseBody(response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield response.json();
            }
            catch (_a) {
                return;
            }
        });
    }
    _applyResponseTransforms({ status, headers, body }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { transforms = {}, fetchType } = this.options;
            const transform = transforms[fetchType].response;
            let data;
            let keys;
            let metadata;
            let hasMore;
            let totalSize;
            if (transform) {
                const transformOptions = deepFreeze({ status, headers, body });
                const transformResult = yield transform(transformOptions);
                data = transformResult.data;
                keys = transformResult.keys;
                metadata = transformResult.metadata;
                hasMore = transformResult.hasMore;
                totalSize = transformResult.totalSize;
            }
            else if (body !== null && typeof body === 'object') {
                data = body.data;
                keys = body.keys;
                metadata = body.metadata;
                hasMore = body.hasMore;
                totalSize = body.totalSize;
            }
            if (!Array.isArray(data)) {
                throw '"data" should be an array. Please use the response transform to extract the data array from the response if needed.';
            }
            return {
                data,
                keys,
                metadata,
                hasMore,
                totalSize
            };
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
const _SORT = 'sort';
const _FILTER = 'filter';
const _ATINDEX = '@index';
const _FETCHBYKEYS = 'fetchByKeys';
const _FETCHBYOFFSET = 'fetchByOffset';
const _FETCHFIRST = 'fetchFirst';
const _FETCHCAPABILITY = 'fetchCapability';
const _BATCHLOOKUP = 'batchLookup';
const _LOOKUP = 'lookup';
const _DELAYED = 'delayed';
const _RANDOMACCESS = 'randomAccess';
const _DEFAULTFETCHSIZE = 25;
class RESTDataProvider {
    constructor(options) {
        var _a;
        this.options = options;
        this._totalSize = -1;
        this._sequenceNum = 0;
        this._mapClientIdToProps = new Map();
        this.AsyncIterable = (_a = class {
                constructor(_asyncIterator) {
                    this._asyncIterator = _asyncIterator;
                    this[Symbol.asyncIterator] = function () {
                        return this._asyncIterator;
                    };
                }
            },
            Symbol.asyncIterator,
            _a);
        this.AsyncIterator = class {
            constructor(_parent, _nextFunc, _fetchParameters, _offset, _iterationLimit) {
                this._parent = _parent;
                this._nextFunc = _nextFunc;
                this._fetchParameters = _fetchParameters;
                this._offset = _offset;
                this._iterationLimit = _iterationLimit;
                this._rowsFetched = 0;
                this._clientId = (_fetchParameters && _fetchParameters.clientId) || Symbol();
                _parent._mapClientIdToProps.set(this._clientId, { hasMore: true, offset: _offset });
            }
            next() {
                return __awaiter$1(this, void 0, void 0, function* () {
                    const propObject = this._parent._mapClientIdToProps.get(this._clientId);
                    const cachedOffset = propObject.offset;
                    const hasMore = propObject.hasMore;
                    const { result, offset, hasNoMore } = yield this._nextFunc(_FETCHFIRST, this._fetchParameters, cachedOffset, hasMore);
                    this._parent._mapClientIdToProps.set(this._clientId, {
                        hasMore: !hasNoMore,
                        offset: offset
                    });
                    const data = result.value.data;
                    this._rowsFetched += data.length;
                    if (Number.isInteger(this._iterationLimit) && this._rowsFetched >= this._iterationLimit) {
                        result.done = true;
                    }
                    return result;
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
    }
    fetchFirst(fetchParameters) {
        return new this.AsyncIterable(new this.AsyncIterator(this, this._fetchFrom.bind(this), fetchParameters, 0, this.options.iterationLimit));
    }
    fetchByKeys(fetchParameters) {
        return __awaiter$1(this, void 0, void 0, function* () {
            if (!fetchParameters) {
                throw Error('"keys" is a required parameter');
            }
            const capabilities = this._getCapabilitiesFromOptions();
            if (capabilities.fetchByKeys) {
                if (capabilities.fetchByKeys.implementation === _LOOKUP) {
                    return this._fetchByKeysLookup(fetchParameters);
                }
                if (capabilities.fetchByKeys.implementation === _BATCHLOOKUP) {
                    return this._fetchByKeysBatchLookup(fetchParameters);
                }
            }
            return this._fetchByKeysIteration(fetchParameters);
        });
    }
    fetchByOffset(fetchParameters) {
        return __awaiter$1(this, void 0, void 0, function* () {
            if (!fetchParameters) {
                throw Error('"offset" is a required parameter');
            }
            const offset = fetchParameters.offset > 0 ? fetchParameters.offset : 0;
            const capabilities = this._getCapabilitiesFromOptions();
            if (capabilities.fetchByOffset && capabilities.fetchByOffset.implementation === _RANDOMACCESS) {
                return this._fetchByOffsetRandomAccess(fetchParameters, offset);
            }
            return this._fetchByOffsetIteration(fetchParameters, offset);
        });
    }
    containsKeys(containsParameters) {
        return __awaiter$1(this, void 0, void 0, function* () {
            const results = new ojSet();
            const fetchByKeysResults = yield this.fetchByKeys(containsParameters);
            containsParameters.keys.forEach((key) => {
                if (fetchByKeysResults.results.get(key) != null) {
                    results.add(key);
                }
            });
            return { containsParameters, results };
        });
    }
    createOptimizedKeySet(initialSet) {
        return initialSet ? new ojSet(initialSet) : new ojSet();
    }
    createOptimizedKeyMap(initialMap) {
        return initialMap ? new ojMap(initialMap) : new ojMap();
    }
    isEmpty() {
        return 'unknown';
    }
    getCapability(capabilityName) {
        const capabilities = this._getCapabilitiesFromOptions();
        switch (capabilityName) {
            case _SORT:
                return capabilities.sort;
            case _FILTER:
                return capabilities.filter;
            case _FETCHFIRST:
                return this._getFetchCapability(_FETCHFIRST);
            case _FETCHBYKEYS:
                return this._getFetchCapability(_FETCHBYKEYS);
            case _FETCHBYOFFSET:
                return this._getFetchCapability(_FETCHBYOFFSET);
            case _FETCHCAPABILITY:
                return RESTDataProvider._getFetchCapabilityDefaults();
            default:
                return;
        }
    }
    getTotalSize() {
        return Promise.resolve(this._totalSize);
    }
    refresh() {
        this.dispatchEvent(new DataProviderRefreshEvent());
    }
    mutate(detail) {
        const { add, remove } = detail;
        this._adjustIteratorOffset(remove, add);
        this.dispatchEvent(new DataProviderMutationEvent(detail));
    }
    _fetchFrom(fetchType, fetchParameters, offset, hasMore) {
        var _a;
        return __awaiter$1(this, void 0, void 0, function* () {
            if ((_a = fetchParameters.signal) === null || _a === void 0 ? void 0 : _a.aborted) {
                throw new DOMException('Signal was previously aborted.', 'AbortError');
            }
            if (hasMore) {
                const convertedFetchParameters = this._convertFetchListToFetchByOffsetParameters(fetchParameters, offset);
                const fetchSize = this._getFetchSize(convertedFetchParameters);
                const fullFetchParameters = Object.assign(Object.assign({}, convertedFetchParameters), { size: fetchSize, filterCriterion: FilterFactory.getFilter({
                        filterDef: convertedFetchParameters.filterCriterion,
                        filterOptions: this.options
                    }) });
                const restHelper = new RESTHelper({
                    fetchType,
                    fetchParameters: fullFetchParameters,
                    url: this.options.url,
                    transforms: this.options.transforms,
                    fetchOptions: {
                        textFilterAttributes: this.options.textFilterAttributes
                    }
                });
                const fetchResult = yield restHelper.fetch();
                const { data, totalSize, hasMore } = fetchResult;
                let metadata;
                if (fetchResult.metadata) {
                    metadata = fetchResult.metadata.map((entry) => (Object.assign({}, entry)));
                }
                else {
                    const keys = fetchResult.keys || this._generateKeysFromData(data);
                    metadata = this._generateMetadataFromKeys(keys);
                }
                const mergedSortCriteria = this._mergeSortCriteria(fetchParameters.sortCriteria);
                if (mergedSortCriteria) {
                    fetchParameters.sortCriteria = mergedSortCriteria;
                }
                const result = { fetchParameters, data, metadata };
                if (Number.isInteger(totalSize) && this._totalSize !== totalSize) {
                    this._totalSize = totalSize;
                }
                if (typeof hasMore === 'boolean' && (hasMore || data.length > 0)) {
                    return {
                        result: new this.AsyncIteratorYieldResult(result),
                        offset: offset + data.length,
                        hasNoMore: !hasMore
                    };
                }
                return {
                    result: new this.AsyncIteratorReturnResult(result),
                    offset: offset + data.length,
                    hasNoMore: !hasMore
                };
            }
            return {
                result: new this.AsyncIteratorReturnResult({ fetchParameters: fetchParameters, data: [], metadata: [] }),
                offset: offset,
                hasNoMore: true
            };
        });
    }
    _fetchByKeysIteration(fetchParameters) {
        return __awaiter$1(this, void 0, void 0, function* () {
            const fetchListParameters = this._convertFetchByKeysToFetchListParameters(fetchParameters);
            const asyncIterator = this.fetchFirst(fetchListParameters)[Symbol.asyncIterator]();
            const fetchedData = [];
            const fetchedDataMetadata = [];
            let done = false;
            while (!done) {
                const fetchResult = yield asyncIterator.next();
                const { data, metadata } = fetchResult.value;
                metadata.forEach((entry, index) => {
                    if (fetchParameters.keys.has(entry.key)) {
                        fetchedData.push(data[index]);
                        fetchedDataMetadata.push(entry);
                    }
                });
                if (fetchParameters.keys.size === fetchedDataMetadata.length) {
                    done = true;
                }
                else {
                    done = fetchResult.done;
                }
            }
            return this._createFetchByKeysResults(fetchParameters, fetchedData, fetchedDataMetadata);
        });
    }
    _fetchByKeysLookup(fetchParameters) {
        var _a;
        return __awaiter$1(this, void 0, void 0, function* () {
            if ((_a = fetchParameters.signal) === null || _a === void 0 ? void 0 : _a.aborted) {
                throw new DOMException('Signal was previously aborted.', 'AbortError');
            }
            const fetchPromises = [];
            const fetchedData = [];
            const fetchedDataMetadata = [];
            for (let key of fetchParameters.keys) {
                const restHelper = new RESTHelper({
                    fetchType: _FETCHBYKEYS,
                    fetchParameters: Object.assign(Object.assign({}, fetchParameters), { keys: new Set([key]) }),
                    url: this.options.url,
                    transforms: this.options.transforms
                });
                fetchPromises.push(restHelper.fetch());
            }
            (yield Promise.all(fetchPromises)).forEach((fetchResult) => {
                fetchResult.data.forEach((item) => {
                    fetchedData.push(item);
                });
                const keys = fetchResult.keys || this._generateKeysFromData(fetchResult.data);
                const metadata = fetchResult.metadata || this._generateMetadataFromKeys(keys);
                metadata.forEach((entry) => {
                    fetchedDataMetadata.push(entry);
                });
            });
            return this._createFetchByKeysResults(fetchParameters, fetchedData, fetchedDataMetadata);
        });
    }
    _fetchByKeysBatchLookup(fetchParameters) {
        var _a;
        return __awaiter$1(this, void 0, void 0, function* () {
            if ((_a = fetchParameters.signal) === null || _a === void 0 ? void 0 : _a.aborted) {
                throw new DOMException('Signal was previously aborted.', 'AbortError');
            }
            const restHelper = new RESTHelper({
                fetchType: _FETCHBYKEYS,
                fetchParameters,
                url: this.options.url,
                transforms: this.options.transforms
            });
            const fetchResult = yield restHelper.fetch();
            const keys = fetchResult.keys || this._generateKeysFromData(fetchResult.data);
            const metadata = fetchResult.metadata || this._generateMetadataFromKeys(keys);
            return this._createFetchByKeysResults(fetchParameters, fetchResult.data, metadata);
        });
    }
    _fetchByOffsetRandomAccess(fetchParameters, offset) {
        return __awaiter$1(this, void 0, void 0, function* () {
            const fetchResult = yield this._fetchFrom(_FETCHBYOFFSET, this._convertFetchByOffsetToFetchListParameters(fetchParameters), offset, true);
            if (fetchResult.hasNoMore) {
                fetchResult.result.done = true;
            }
            const { value, done } = fetchResult.result;
            const { data, metadata } = value;
            const results = data.map((value, index) => ({ metadata: metadata[index], data: value }));
            return { fetchParameters, results, done };
        });
    }
    _fetchByOffsetIteration(fetchParameters, offset) {
        return __awaiter$1(this, void 0, void 0, function* () {
            const fetchListParameters = this._convertFetchByOffsetToFetchListParameters(fetchParameters);
            const asyncIterator = this.fetchFirst(fetchListParameters)[Symbol.asyncIterator]();
            const fetchResultData = [];
            const fetchResultMetadata = [];
            const size = this._getFetchSize(fetchParameters);
            let done = false;
            let fetchResultDone = true;
            while (!done) {
                const fetchResult = yield asyncIterator.next();
                const value = fetchResult.value;
                const { data, metadata } = value;
                fetchResultDone = fetchResult.done;
                data.forEach((entry) => {
                    fetchResultData.push(entry);
                });
                metadata.forEach((entry) => {
                    fetchResultMetadata.push(entry);
                });
                if (typeof fetchResultData[offset + size - 1] !== 'undefined') {
                    done = true;
                }
                else {
                    done = fetchResultDone;
                }
            }
            const start = offset;
            const end = offset + size;
            const data = fetchResultData.slice(start, end);
            const metadata = fetchResultMetadata.slice(start, end);
            const results = data.map((value, index) => ({ metadata: metadata[index], data: value }));
            return { fetchParameters, results, done: fetchResultDone };
        });
    }
    _generateKeysFromData(data) {
        const keyAttributes = this.options != null ? this.options.keyAttributes : null;
        return data.map((item) => {
            let id = this._getId(item);
            if (id == null || keyAttributes == _ATINDEX) {
                id = this._sequenceNum++;
            }
            return id;
        });
    }
    _generateMetadataFromKeys(keys) {
        return keys.map((key) => ({ key }));
    }
    _getId(row) {
        let id;
        let keyAttributes = null;
        if (this.options != null) {
            if (this.options.keyAttributes != null) {
                keyAttributes = this.options.keyAttributes;
            }
        }
        if (keyAttributes != null) {
            if (Array.isArray(keyAttributes)) {
                let i;
                id = [];
                for (i = 0; i < keyAttributes.length; i++) {
                    id[i] = this._getVal(row, keyAttributes[i]);
                }
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
    _getVal(val, attr) {
        const dotIndex = attr.indexOf('.');
        if (dotIndex > 0) {
            const startAttr = attr.substring(0, dotIndex);
            const endAttr = attr.substring(dotIndex + 1);
            const subObj = val[startAttr];
            if (subObj) {
                return this._getVal(subObj, endAttr);
            }
        }
        if (typeof val[attr] == 'function') {
            return val[attr]();
        }
        return val[attr];
    }
    _convertFetchByOffsetToFetchListParameters(fetchParameters) {
        return {
            size: fetchParameters.size,
            sortCriteria: fetchParameters.sortCriteria,
            filterCriterion: fetchParameters.filterCriterion,
            attributes: fetchParameters.attributes,
            clientId: fetchParameters.clientId,
            signal: fetchParameters.signal
        };
    }
    _convertFetchListToFetchByOffsetParameters(fetchParameters, offset) {
        return {
            offset,
            size: fetchParameters.size,
            sortCriteria: fetchParameters.sortCriteria,
            filterCriterion: fetchParameters.filterCriterion,
            attributes: fetchParameters.attributes,
            clientId: fetchParameters.clientId,
            signal: fetchParameters.signal
        };
    }
    _convertFetchByKeysToFetchListParameters(fetchParameters) {
        return {
            attributes: fetchParameters.attributes,
            signal: fetchParameters.signal
        };
    }
    _createFetchByKeysResults(fetchParameters, fetchedData, fetchedDataMetadata) {
        const results = new Map();
        fetchedData.forEach((value, index) => {
            if (value) {
                results.set(fetchedDataMetadata[index].key, {
                    metadata: fetchedDataMetadata[index],
                    data: value
                });
            }
        });
        return { fetchParameters, results };
    }
    _getFetchCapability(fetchType) {
        const capabilities = this._getCapabilitiesFromOptions();
        const fetchCapabilityDefaults = RESTDataProvider._getFetchCapabilityDefaults();
        if (fetchType === _FETCHFIRST) {
            return Object.assign(Object.assign({}, fetchCapabilityDefaults), { iterationSpeed: _DELAYED });
        }
        return capabilities[fetchType]
            ? Object.assign(Object.assign({}, fetchCapabilityDefaults), (capabilities[fetchType] || {})) : null;
    }
    static _getFetchCapabilityDefaults() {
        return {
            caching: 'none',
            attributeFilter: {
                expansion: {},
                ordering: {},
                defaultShape: {
                    features: new Set(['exclusion'])
                }
            }
        };
    }
    _getCapabilitiesFromOptions() {
        return this.options.capabilities || {};
    }
    _getFetchSize(fetchParameters) {
        return Number.isInteger(fetchParameters.size) && fetchParameters.size > 0
            ? fetchParameters.size
            : _DEFAULTFETCHSIZE;
    }
    _mergeSortCriteria(sortCriteria) {
        const implicitSort = this.options != null ? this.options.implicitSort : null;
        if (implicitSort != null) {
            if (sortCriteria == null) {
                return implicitSort;
            }
            const mergedSortCriteria = sortCriteria.slice(0);
            let i, j, found;
            for (i = 0; i < implicitSort.length; i++) {
                found = false;
                for (j = 0; j < mergedSortCriteria.length; j++) {
                    if (mergedSortCriteria[j].attribute == implicitSort[i].attribute) {
                        found = true;
                    }
                }
                if (!found) {
                    mergedSortCriteria.push(implicitSort[i]);
                }
            }
            return mergedSortCriteria;
        }
        else {
            return sortCriteria;
        }
    }
    _adjustIteratorOffset(remove, add) {
        const removeIndexes = remove ? remove.indexes : null;
        const addIndexes = add ? add.indexes : null;
        this._mapClientIdToProps.forEach((propObject, clientId) => {
            let offset = propObject.offset;
            let deleteCount = 0;
            if (removeIndexes) {
                removeIndexes.forEach(function (index) {
                    if (index < offset) {
                        ++deleteCount;
                    }
                });
            }
            offset -= deleteCount;
            let resetHasMore = false;
            if (addIndexes) {
                addIndexes.forEach(function (index) {
                    if (index < offset) {
                        ++offset;
                    }
                    else {
                        resetHasMore = true;
                    }
                });
            }
            if (resetHasMore) {
                this._mapClientIdToProps.set(clientId, { hasMore: true, offset: offset });
            }
            else {
                this._mapClientIdToProps.set(clientId, { hasMore: propObject.hasMore, offset: offset });
            }
        });
    }
}
EventTargetMixin.applyMixin(RESTDataProvider);

export { RESTDataProvider };
