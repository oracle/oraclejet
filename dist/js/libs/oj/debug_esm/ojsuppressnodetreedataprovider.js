/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { EventTargetMixin } from 'ojs/ojeventtarget';

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

class SuppressNodeTreeDataProvider {
    constructor(treeDataProvider, options) {
        this.treeDataProvider = treeDataProvider;
        this.options = options;
        this.SuppressNodeTreeAsyncIterable = class {
            constructor(_parent, _asyncIterator) {
                this._parent = _parent;
                this._asyncIterator = _asyncIterator;
                this[Symbol.asyncIterator] = () => {
                    return new this._parent.SuppressNodeTreeAsyncIterator(this._parent, this._asyncIterator);
                };
            }
        };
        this.SuppressNodeTreeAsyncIterator = class {
            constructor(_parent, _baseIterator) {
                this._parent = _parent;
                this._baseIterator = _baseIterator;
            }
            _fetchNext() {
                return this._baseIterator.next();
            }
            ['next']() {
                const promise = this._fetchNext();
                let self = this;
                return promise.then((result) => {
                    return self._parent._suppressNodeIfEmptyChildrenFirst(result);
                });
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
        this.FetchListResult = class {
            constructor(fetchParameters, data, metadata) {
                this.fetchParameters = fetchParameters;
                this.data = data;
                this.metadata = metadata;
                this[SuppressNodeTreeDataProvider._FETCHPARAMETERS] = fetchParameters;
                this[SuppressNodeTreeDataProvider._DATA] = data;
                this[SuppressNodeTreeDataProvider._METADATA] = metadata;
            }
        };
        this.FetchByOffsetResults = class {
            constructor(_parent, fetchParameters, results, done) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.results = results;
                this.done = done;
                this[SuppressNodeTreeDataProvider._FETCHPARAMETERS] = fetchParameters;
                this[SuppressNodeTreeDataProvider._RESULTS] = results;
                this[SuppressNodeTreeDataProvider._DONE] = done;
            }
        };
        this.Item = class {
            constructor(_parent, metadata, data) {
                this._parent = _parent;
                this.metadata = metadata;
                this.data = data;
                this[SuppressNodeTreeDataProvider._METADATA] = metadata;
                this[SuppressNodeTreeDataProvider._DATA] = data;
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
        let child = this.treeDataProvider.getChildDataProvider(parentKey);
        if (child == null)
            return null;
        else
            return new SuppressNodeTreeDataProvider(child, this.options);
    }
    fetchByOffset(params) {
        return this.treeDataProvider.fetchByOffset(params).then((result) => {
            return this._suppressNodeIfEmptyChildrenByOffset(result);
        });
    }
    fetchByKeys(params) {
        return this.treeDataProvider.fetchByKeys(params);
    }
    fetchFirst(params) {
        let asyncIterable = this.treeDataProvider.fetchFirst(params);
        return new this.SuppressNodeTreeAsyncIterable(this, asyncIterable[Symbol.asyncIterator]());
    }
    _suppressNodeIfEmptyChildrenByOffset(result) {
        let retResult = null;
        if (result.results && this.options && this.options.suppressNode == 'ifEmptyChildren') {
            let metadata;
            let data;
            let resultArray = [];
            for (let resulti of result.results) {
                metadata = resulti.metadata;
                data = resulti.data;
                let child = this.treeDataProvider.getChildDataProvider(metadata.key, this.options);
                if (child && child.isEmpty() == 'no') {
                    resultArray.push(new this.Item(this, metadata, data));
                }
            }
            if (resultArray.length > 0) {
                retResult = new this.FetchByOffsetResults(this, result.fetchParameters, resultArray, result.done);
            }
        }
        return retResult == null ? result : retResult;
    }
    _suppressNodeIfEmptyChildrenFirst(result) {
        let retResult = null;
        if (!result.done && this.options && this.options.suppressNode == 'ifEmptyChildren') {
            if (result && result.value && result.value.data) {
                let metadata = result.value.metadata;
                let data = result.value.data;
                let retData = Array();
                let retMetadata = Array();
                for (let i = 0; metadata && i < metadata.length; i++) {
                    let child = this.treeDataProvider.getChildDataProvider(metadata[i].key, this.options);
                    if (child && child.isEmpty() == 'no') {
                        retData.push(data[i]);
                        retMetadata.push(metadata[i]);
                    }
                }
                if (retData.length > 0) {
                    retResult = result.done
                        ? new this.AsyncIteratorReturnResult(this, new this.FetchListResult(null, retData, retMetadata))
                        : new this.AsyncIteratorYieldResult(this, new this.FetchListResult(null, retData, retMetadata));
                }
            }
        }
        return Promise.resolve(retResult == null ? result : retResult);
    }
}
SuppressNodeTreeDataProvider._DATA = 'data';
SuppressNodeTreeDataProvider._METADATA = 'metadata';
SuppressNodeTreeDataProvider._FETCHPARAMETERS = 'fetchParameters';
SuppressNodeTreeDataProvider._RESULTS = 'results';
SuppressNodeTreeDataProvider._DONE = 'done';
SuppressNodeTreeDataProvider._KEY = 'key';
EventTargetMixin.applyMixin(SuppressNodeTreeDataProvider);

export { SuppressNodeTreeDataProvider };
