/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojcollectiontabledatasource', 'ojs/ojdataprovideradapter'], function(oj)
{
  "use strict";
class CollectionDataProvider {
    constructor(collection) {
        this.collection = collection;
        this._dataProviderAdapter = new oj.TableDataSourceAdapter(new oj.CollectionTableDataSource(collection));
        this.addEventListener = this._dataProviderAdapter.addEventListener.bind(this._dataProviderAdapter);
        this.removeEventListener = this._dataProviderAdapter.removeEventListener.bind(this._dataProviderAdapter);
        this.dispatchEvent = this._dataProviderAdapter.dispatchEvent.bind(this._dataProviderAdapter);
    }
    destroy() {
        this._dataProviderAdapter.destroy();
    }
    fetchFirst(parameters) {
        return this._dataProviderAdapter.fetchFirst(parameters);
    }
    fetchByKeys(parameters) {
        return this._dataProviderAdapter.fetchByKeys(parameters);
    }
    containsKeys(parameters) {
        return this._dataProviderAdapter.containsKeys(parameters);
    }
    fetchByOffset(parameters) {
        return this._dataProviderAdapter.fetchByOffset(parameters);
    }
    getCapability(capabilityName) {
        return this._dataProviderAdapter.getCapability(capabilityName);
    }
    getTotalSize() {
        return this._dataProviderAdapter.getTotalSize();
    }
    isEmpty() {
        return this._dataProviderAdapter.isEmpty();
    }
}
oj['CollectionDataProvider'] = CollectionDataProvider;
oj.CollectionDataProvider = CollectionDataProvider;



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 *
 * @since 6.0.0
 * @export
 * @final
 * @class CollectionDataProvider
 * @implements DataProvider
 * @classdesc This class implements {@link DataProvider}.
 *            This object represents a data provider that is created from an {@link oj.Collection} object, such as an external data source. It can be used by [ListView]{@link oj.ojListView}, [NavigationList]{@link oj.ojNavigationList},
 *            [TabBar]{@link oj.ojTabBar}, and [Table]{@link oj.ojTable}.<br><br>
 * In general, apps should not listen to the underlying ojCollection events. They should only list to events from the DataProvider itself.
 * CollectionDataProvider may silence ojCollection events.  How CollectionDP uses ojCollection is entirely up to itself and not part of the CollectionDataProvider contract.
 * So it's unreliable for apps to listen to the underlying ojCollection events and expect events to be triggered based on CollectionDataProvider operations.
 * @param {oj.Collection} collection data supported by the components
 * @example
 * // Create collection
 * var collecton = oj.Collection(...);
 * // Create CollectionDataProvider object from collection
 * var dataprovider = new CollectionDataProvider(collection);
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider",
 *   "FetchByKeysParameters","ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters", "FetchByOffsetResults",
 *   "FetchListResult","FetchListParameters"]}
 * @ojtsimport {module: "ojmodel", type: "AMD", imported: ["Collection"]}
 * @ojtsmodule
 * @ojsignature [{target: "Type",
 *               value: "class CollectionDataProvider<K, D> implements DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}]
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name fetchFirst
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 */

/**
 * End of jsdoc
 */

    return CollectionDataProvider;
});