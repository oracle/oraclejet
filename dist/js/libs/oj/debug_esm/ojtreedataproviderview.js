/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import ListDataProviderView from 'ojs/ojlistdataproviderview';

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 *
 * @since 6.2.0
 * @final
 * @export
 * @class TreeDataProviderView
 * @ojtsmodule
 * @implements TreeDataProvider
 * @classdesc Provides optimizations for TreeDataProvider. Supports field mapping. Please see the select demos for examples of DataMapping [Select]{@link oj.ojSelect}
 * @param {DataProvider} dataProvider the DataProvider.
 * @param {TreeDataProviderView.Options=} options Options for the TreeDataProviderView
 * @ojsignature [{target: "Type",
 *               value: "class TreeDataProviderView<K, D, Kin, Din> implements TreeDataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of output key"}, {"name": "D", "description": "Type of output data"},
 *                    {"name": "Kin", "description": "Type of input key"}, {"name": "Din", "description": "Type of input data"}]},
 *               {target: "Type",
 *               value: "TreeDataProvider<K, D>",
 *               for: "dataProvider"},
 *               {target: "Type",
 *               value: "TreeDataProviderView.Options<K, D, Kin, Din>",
 *               for: "options"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults", "DataMapping",
 *   "FetchListResult","FetchListParameters", "FetchAttribute"]}
 * @ojtsimport {module: "ojtreedataprovider", type: "AMD", importName: "TreeDataProvider"}
 */

/**
 * Optional dataMapping to apply
 *
 *
 * @since 6.2.0
 * @export
 * @expose
 * @memberof TreeDataProviderView
 * @instance
 * @name dataMapping
 * @ojsignature {target: "Type",
 *               value: "?DataMapping<K, D, Kin, Din>"}
 */

/**
 * @typedef {Object} TreeDataProviderView.Options
 * @property {DataMapping=} dataMapping - mapping to apply to the data.
 * @ojsignature [
 *  {target: "Type", value: "<K, D, Kin, Din>", for: "genericTypeParameters"},
 *  {target: "Type", value: "DataMapping<K, D, Kin, Din>", for: "dataMapping"},
 * ]
 * */

/**
 * @inheritdoc
 * @memberof TreeDataProviderView
 * @instance
 * @method
 * @name getChildDataProvider
 */

/**
 * @inheritdoc
 * @memberof TreeDataProviderView
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
 * @memberof TreeDataProviderView
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
 * @memberof TreeDataProviderView
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * @inheritdoc
 * @memberof TreeDataProviderView
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * @inheritdoc
 * @memberof TreeDataProviderView
 * @instance
 * @method
 * @name getCapability
 */

/**
 * @inheritdoc
 * @memberof TreeDataProviderView
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * @inheritdoc
 * @memberof TreeDataProviderView
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * @inheritdoc
 * @memberof TreeDataProviderView
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @inheritdoc
 * @memberof TreeDataProviderView
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @inheritdoc
 * @memberof TreeDataProviderView
 * @instance
 * @method
 * @name dispatchEvent
 */

// end of jsdoc

class TreeDataProviderView {
    constructor(dataProvider, options) {
        this.dataProvider = dataProvider;
        this.options = options;
        this._listDataProviderView = new ListDataProviderView(dataProvider, options);
    }
    getChildDataProvider(parentKey, options) {
        let childDataProvider = this.dataProvider.getChildDataProvider(parentKey);
        if (childDataProvider) {
            return new TreeDataProviderView(childDataProvider, this.options);
        }
        return null;
    }
    containsKeys(params) {
        return this._listDataProviderView.containsKeys(params);
    }
    fetchByKeys(params) {
        return this._listDataProviderView.fetchByKeys(params);
    }
    fetchByOffset(params) {
        return this._listDataProviderView.fetchByOffset(params);
    }
    fetchFirst(params) {
        return this._listDataProviderView.fetchFirst(params);
    }
    getCapability(capabilityName) {
        return this._listDataProviderView.getCapability(capabilityName);
    }
    getTotalSize() {
        return this._listDataProviderView.getTotalSize();
    }
    isEmpty() {
        return this._listDataProviderView.isEmpty();
    }
    addEventListener(eventType, listener) {
        this._listDataProviderView.addEventListener(eventType, listener);
    }
    removeEventListener(eventType, listener) {
        this._listDataProviderView.removeEventListener(eventType, listener);
    }
    dispatchEvent(evt) {
        return this._listDataProviderView.dispatchEvent(evt);
    }
}
oj._registerLegacyNamespaceProp('TreeDataProviderView', TreeDataProviderView);

export default TreeDataProviderView;
