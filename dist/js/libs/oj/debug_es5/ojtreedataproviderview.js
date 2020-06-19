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
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



/**
 * Class which provides list based optimizations
 */
var TreeDataProviderView = /*#__PURE__*/function () {
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