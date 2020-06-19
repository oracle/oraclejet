/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojcomponentcore', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $, ko)
{
  "use strict";
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DeferredDataProvider = /*#__PURE__*/function () {
  function DeferredDataProvider(_dataProvider, _capabilityFunc) {
    _classCallCheck(this, DeferredDataProvider);

    this._dataProvider = _dataProvider;
    this._capabilityFunc = _capabilityFunc;
    this._DATAPROVIDER = 'dataProvider';

    this.AsyncIterable = /*#__PURE__*/function () {
      function _class(_asyncIterator) {
        _classCallCheck(this, _class);

        this._asyncIterator = _asyncIterator;

        this[Symbol.asyncIterator] = function () {
          return this._asyncIterator;
        };
      }

      return _class;
    }();

    this.AsyncIterator = /*#__PURE__*/function () {
      function _class2(_asyncIteratorPromise) {
        _classCallCheck(this, _class2);

        this._asyncIteratorPromise = _asyncIteratorPromise;
      }

      _createClass(_class2, [{
        key: 'next',
        value: function next() {
          var self = this;
          return self._asyncIteratorPromise.then(function (asyncIterator) {
            return asyncIterator['next']();
          });
        }
      }]);

      return _class2;
    }();
  }
  /**
   * Fetch the first block of data
   */


  _createClass(DeferredDataProvider, [{
    key: "fetchFirst",
    value: function fetchFirst(params) {
      var asyncIteratorPromise = this._getDataProvider().then(function (dataProvider) {
        return dataProvider.fetchFirst(params)[Symbol.asyncIterator]();
      });

      return new this.AsyncIterable(new this.AsyncIterator(asyncIteratorPromise));
    }
    /**
     * Fetch rows by keys
     */

  }, {
    key: "fetchByKeys",
    value: function fetchByKeys(params) {
      return this._getDataProvider().then(function (dataProvider) {
        return dataProvider.fetchByKeys(params);
      });
    }
    /**
     * Check if rows are contained by keys
     */

  }, {
    key: "containsKeys",
    value: function containsKeys(params) {
      return this._getDataProvider().then(function (dataProvider) {
        return dataProvider.containsKeys(params);
      });
    }
    /**
     * Fetch rows by offset
     */

  }, {
    key: "fetchByOffset",
    value: function fetchByOffset(params) {
      return this._getDataProvider().then(function (dataProvider) {
        return dataProvider.fetchByOffset(params);
      });
    }
    /**
     * Returns the total size of the data
     */

  }, {
    key: "getTotalSize",
    value: function getTotalSize() {
      return this._getDataProvider().then(function (dataProvider) {
        return dataProvider.getTotalSize();
      });
    }
    /**
     * Returns a string that indicates if this data provider is empty.
     * Returns "unknown" if the dataProvider has not resolved yet.
     */

  }, {
    key: "isEmpty",
    value: function isEmpty() {
      if (!this[this._DATAPROVIDER]) return 'unknown';else return this[this._DATAPROVIDER].isEmpty();
    }
    /**
     * Determines whether this DataProvider supports certain feature.
     */

  }, {
    key: "getCapability",
    value: function getCapability(capabilityName) {
      if (this._capabilityFunc) return this._capabilityFunc(capabilityName);
      return null;
    }
    /** EVENT TARGET IMPLEMENTATION **/

  }, {
    key: "addEventListener",
    value: function addEventListener(eventType, listener) {
      this._getDataProvider().then(function (dataProvider) {
        dataProvider.addEventListener(eventType, listener);
      });
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(eventType, listener) {
      this._getDataProvider().then(function (dataProvider) {
        dataProvider.removeEventListener(eventType, listener);
      });
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(evt) {
      if (!this[this._DATAPROVIDER]) return false;
      return this[this._DATAPROVIDER].dispatchEvent(evt);
    }
    /**
     * Returns the resolved dataProvider for this instance
     */

  }, {
    key: "_getDataProvider",
    value: function _getDataProvider() {
      var self = this;
      return this._dataProvider.then(function (dataProvider) {
        if (oj.DataProviderFeatureChecker.isDataProvider(dataProvider)) {
          if (!self[self._DATAPROVIDER]) self[self._DATAPROVIDER] = dataProvider;
          return dataProvider;
        } else throw new Error('Invalid data type. DeferredDataProvider takes a Promise<DataProvider>');
      });
    }
  }]);

  return DeferredDataProvider;
}();

oj['DeferredDataProvider'] = DeferredDataProvider;



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 *
 * @since 4.2.0
 * @export
 * @final
 * @class DeferredDataProvider
 * @implements DataProvider
 * @ojtsmodule
 * @classdesc This class implements {@link DataProvider}.
 *            This object represents a data provider that is created with deferred data and can be used by any component that requires a data provider that will be created with data from a Promise.
 * @param {Promise.<DataProvider>} dataProvider A promise that resolves to an DataProvider
 * @param {Function} capabilityFunc An function that implements {@link DataProvider#getCapability}.
 * @ojsignature [{target: "Type",
 *               value: "class DeferredDataProvider<K, D> implements DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
 *               {target: "Type",
 *               value: "Promise<DataProvider<K, D>>",
 *               for: "dataProvider"},
 *               {target: "Type",
 *               value: "(capabilityName: string)=> any",
 *               for: "capabilityFunc"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
 *   "FetchListResult","FetchListParameters"]}
 * @example
 * // DeferredDataProvider is used in cases where the data for the data provider will be
 * // provided asynchronously. In the example below, let getDeferredData() be any function
 * // that returns a Promise that will resolve to the final data.
 * var deferredDataPromise = getDeferredData();
 *
 * // Create a Promise that will resolve to a data provider containing the resolved data
 * var dataProviderPromise = deferredDataPromise.then(function(resolvedData){
 *  return new ArrayDataProvider(resolvedData);
 * });
 *
 * // Then create a DeferredDataProvider object with the promise that will resolve to a data provider,
 * // and an implemenation of {@link DataProvider#getCapability}
 * var dataprovider = new DeferredDataProvider(dataProviderPromise, capabilityFunc);
 */

/**
 * @inheritdoc
 * @memberof DeferredDataProvider
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * @inheritdoc
 * @memberof DeferredDataProvider
 * @instance
 * @method
 * @name fetchFirst
 */

/**
 * @inheritdoc
 * @memberof DeferredDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * @inheritdoc
 * @memberof DeferredDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * @inheritdoc
 * @memberof DeferredDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * @inheritdoc
 * @memberof DeferredDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * @inheritdoc
 * @memberof DeferredDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * @inheritdoc
 * @memberof DeferredDataProvider
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @inheritdoc
 * @memberof DeferredDataProvider
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @inheritdoc
 * @memberof DeferredDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 */

/**
 * End of jsdoc
 */

  return DeferredDataProvider;
});