/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojlistdataproviderview', 'ojs/ojcomponentcore', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $, ListDataProviderView)
{
  "use strict";

/**
 * Class which provides list based optimizations
 */
class TreeDataProviderView {
    constructor(dataProvider, options) {
        this.dataProvider = dataProvider;
        this.options = options;
        this._listDataProviderView = new ListDataProviderView(dataProvider, options);
    }
    /*
     * Get the data provider for the children of the node identified by parentKey.
     * This should return null for node that cannot have children.
     * This should return a TreeDataProvider for node that can (but doesn't have to) have children.
     */
    getChildDataProvider(parentKey, options) {
        let childDataProvider = this.dataProvider.getChildDataProvider(parentKey, options);
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
oj['TreeDataProviderView'] = TreeDataProviderView;
oj.TreeDataProviderView = TreeDataProviderView;



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
 * @param {Object=} options Options for the TreeDataProviderView
 * @param {DataMapping=} options.dataMapping mapping to apply to the data.
 * @ojsignature [{target: "Type",
 *               value: "class TreeDataProviderView<K, D, Kin, Din> implements TreeDataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of output key"}, {"name": "D", "description": "Type of output data"},
 *                    {"name": "Kin", "description": "Type of input key"}, {"name": "Din", "description": "Type of input data"}]},
 *               {target: "Type",
 *               value: "TreeDataProvider<K, D>",
 *               for: "dataProvider"},
 *               {target: "Type",
 *               value: "DataMapping<K, D, Kin, Din>",
 *               for: "options.dataMapping"}]
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
 * @inheritdoc
 * @memberof TreeDataProviderView
 * @instance
 * @method
 * @name fetchFirst
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

/**
 * End of jsdoc
 */

  return TreeDataProviderView;
});