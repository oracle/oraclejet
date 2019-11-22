/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojlistdataproviderview', 'ojs/ojcomponentcore', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $, ListDataProviderView)
{
  "use strict";
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



/**
 * Class which provides list based optimizations
 */
var TreeDataProviderView =
/*#__PURE__*/
function () {
  function TreeDataProviderView(dataProvider, options) {
    _classCallCheck(this, TreeDataProviderView);

    this.dataProvider = dataProvider;
    this.options = options;
    this._listDataProviderView = new ListDataProviderView(dataProvider, options);
  }
  /*
   * Get the data provider for the children of the node identified by parentKey.
   * This should return null for node that cannot have children.
   * This should return a TreeDataProvider for node that can (but doesn't have to) have children.
   */


  _createClass(TreeDataProviderView, [{
    key: "getChildDataProvider",
    value: function getChildDataProvider(parentKey, options) {
      var childDataProvider = this.dataProvider.getChildDataProvider(parentKey, options);

      if (childDataProvider) {
        return new TreeDataProviderView(childDataProvider, this.options);
      }

      return null;
    }
  }, {
    key: "containsKeys",
    value: function containsKeys(params) {
      return this._listDataProviderView.containsKeys(params);
    }
  }, {
    key: "fetchByKeys",
    value: function fetchByKeys(params) {
      return this._listDataProviderView.fetchByKeys(params);
    }
  }, {
    key: "fetchByOffset",
    value: function fetchByOffset(params) {
      return this._listDataProviderView.fetchByOffset(params);
    }
  }, {
    key: "fetchFirst",
    value: function fetchFirst(params) {
      return this._listDataProviderView.fetchFirst(params);
    }
  }, {
    key: "getCapability",
    value: function getCapability(capabilityName) {
      return this._listDataProviderView.getCapability(capabilityName);
    }
  }, {
    key: "getTotalSize",
    value: function getTotalSize() {
      return this._listDataProviderView.getTotalSize();
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this._listDataProviderView.isEmpty();
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(eventType, listener) {
      this._listDataProviderView.addEventListener(eventType, listener);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(eventType, listener) {
      this._listDataProviderView.removeEventListener(eventType, listener);
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(evt) {
      return this._listDataProviderView.dispatchEvent(evt);
    }
  }]);

  return TreeDataProviderView;
}();

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
 * @class oj.TreeDataProviderView
 * @ojtsmodule
 * @implements oj.DataProvider
 * @classdesc Provides list based optimizations for oj.DataProvider. Supports fetchFirst starting at arbitrary key or index offset, sortCriteria,
 * and field mapping. Please see the select demos for examples of DataMapping [Select]{@link oj.ojSelect}
 * @param {oj.DataProvider} dataProvider the DataProvider.
 * @param {Object=} options Options for the TreeDataProviderView
 * @param {oj.DataMapping=} options.dataMapping mapping to apply to the data.
 * @ojsignature [{target: "Type",
 *               value: "class TreeDataProviderView<K, D, Kin, Din> implements DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of output key"}, {"name": "D", "description": "Type of output data"},
 *                    {"name": "Kin", "description": "Type of input key"}, {"name": "Din", "description": "Type of input data"}]},
 *               {target: "Type",
 *               value: "DataProvider<K, D>",
 *               for: "dataProvider"},
 *               {target: "Type",
 *               value: "DataMapping<K, D, Kin, Din>",
 *               for: "options.dataMapping"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults", "DataMapping",
 *   "FetchListResult","FetchListParameters", "FetchAttribute"]}
 */

/**
 * Get a data provider for the children of the row identified by parentKey.
 *
 *
 * @param {any} parentKey key of the row to get child data provider for.
 * @return {TreeDataProviderView | null} A TreeDataProviderView if the row can (but doesn't have to) have children; or null if the row cannot have children.
 *   Use the <code class="prettyprint">isEmpty</code> method on the returned TreeDataProviderView to determine if it currently has children.
 * @export
 * @expose
 * @memberof oj.TreeDataProviderView
 * @instance
 * @method
 * @name getChildDataProvider
 * @ojsignature {target: "Type",
 *               value: "(parentKey: any): TreeDataProviderView<K, D, Kin, Din>"}
 */

/**
 * Check if there are rows containing the specified keys
 *
 *
 * @since 6.2.0
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.ContainsKeysResults>} Promise which resolves to {@link oj.ContainsKeysResults}
 * @export
 * @expose
 * @memberof oj.TreeDataProviderView
 * @instance
 * @method
 * @name containsKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>"}
 */

/**
 * Fetch rows by keys
 *
 *
 * @since 6.2.0
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.FetchByKeysResults>} Promise which resolves to {@link oj.FetchByKeysResults}
 * @export
 * @expose
 * @memberof oj.TreeDataProviderView
 * @instance
 * @method
 * @name fetchByKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>"}
 */

/**
 * Fetch rows by offset
 *
 *
 * @since 4.2.0
 * @param {oj.FetchByOffsetParameters} params Fetch by offset parameters
 * @return {Promise.<oj.FetchByOffsetResults>} Promise which resolves to {@link oj.FetchByOffsetResults}
 * @export
 * @expose
 * @memberof oj.TreeDataProviderView
 * @instance
 * @method
 * @name fetchByOffset
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>"}
 */

/**
 * Fetch the first block of data.
 *
 *
 * @since 6.2.0
 * @param {oj.FetchListParameters=} params Fetch parameters
 * @return {AsyncIterable.<oj.FetchListResult>} AsyncIterable with {@link oj.FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof oj.TreeDataProviderView
 * @instance
 * @method
 * @name fetchFirst
 * @ojsignature {target: "Type",
 *               value: "(params?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>"}
 */

/**
 * Determines whether this DataProvider supports certain feature.
 *
 *
 * @since 6.2.0
 * @param {string} capabilityName capability name. Supported capability names
 *                  are determined by the underlying dataprovider.
 * @return {Object} capability information or null if unsupported
 * @export
 * @expose
 * @memberof oj.TreeDataProviderView
 * @instance
 * @method
 * @name getCapability
 * @ojsignature {target: "Type",
 *               value: "(capabilityName: string): any"}
 */

/**
 * Return the total number of rows in this dataprovider
 *
 *
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows. -1 is unknown row count.
 * @export
 * @expose
 * @memberof oj.TreeDataProviderView
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * Return a string that indicates if this data provider is empty
 *
 *
 * @return {"yes"|"no"|"unknown"} a string that indicates if this data provider is empty. Valid values are:
 *                  "yes": this data provider is empty.
 *                  "no": this data provider is not empty.
 *                  "unknown": it is not known if this data provider is empty until a fetch is made.
 * @export
 * @expose
 * @memberof oj.TreeDataProviderView
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * Optional dataMapping to apply
 *
 *
 * @since 6.2.0
 * @export
 * @expose
 * @memberof oj.TreeDataProviderView
 * @instance
 * @name dataMapping
 * @ojsignature {target: "Type",
 *               value: "DataMapping<K, D, Kin, Din>"}
 */

/**
 *
 * @export
 * @expose
 * @memberof oj.TreeDataProviderView
 * @instance
 * @method
 * @name addEventListener
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 *
 * @export
 * @expose
 * @memberof oj.TreeDataProviderView
 * @instance
 * @method
 * @name removeEventListener
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 *
 * @export
 * @expose
 * @memberof oj.TreeDataProviderView
 * @instance
 * @method
 * @name dispatchEvent
 * @ojsignature {target: "Type",
 *               value: "(evt: Event): boolean"}
 */

/**
 * End of jsdoc
 */

  return TreeDataProviderView;
});