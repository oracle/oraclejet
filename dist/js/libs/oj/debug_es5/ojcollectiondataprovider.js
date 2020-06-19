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
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CollectionDataProvider = /*#__PURE__*/function () {
  function CollectionDataProvider(collection) {
    _classCallCheck(this, CollectionDataProvider);

    this.collection = collection;
    this._dataProviderAdapter = new oj.TableDataSourceAdapter(new oj.CollectionTableDataSource(collection));
    this.addEventListener = this._dataProviderAdapter.addEventListener.bind(this._dataProviderAdapter);
    this.removeEventListener = this._dataProviderAdapter.removeEventListener.bind(this._dataProviderAdapter);
    this.dispatchEvent = this._dataProviderAdapter.dispatchEvent.bind(this._dataProviderAdapter);
  }

  _createClass(CollectionDataProvider, [{
    key: "destroy",
    value: function destroy() {
      this._dataProviderAdapter.destroy();
    }
  }, {
    key: "fetchFirst",
    value: function fetchFirst(parameters) {
      return this._dataProviderAdapter.fetchFirst(parameters);
    }
  }, {
    key: "fetchByKeys",
    value: function fetchByKeys(parameters) {
      return this._dataProviderAdapter.fetchByKeys(parameters);
    }
  }, {
    key: "containsKeys",
    value: function containsKeys(parameters) {
      return this._dataProviderAdapter.containsKeys(parameters);
    }
  }, {
    key: "fetchByOffset",
    value: function fetchByOffset(parameters) {
      return this._dataProviderAdapter.fetchByOffset(parameters);
    }
  }, {
    key: "getCapability",
    value: function getCapability(capabilityName) {
      return this._dataProviderAdapter.getCapability(capabilityName);
    }
  }, {
    key: "getTotalSize",
    value: function getTotalSize() {
      return this._dataProviderAdapter.getTotalSize();
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this._dataProviderAdapter.isEmpty();
    }
  }]);

  return CollectionDataProvider;
}();

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