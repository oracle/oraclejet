(function() {function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

define(['exports', 'ojs/ojcachediteratorresultsdataprovider', 'ojs/ojdedupdataprovider', 'ojs/ojmutateeventfilteringdataprovider'], function (exports, CachedIteratorResultsDataProvider, DedupDataProvider, MutateEventFilteringDataProvider) {
  'use strict';

  CachedIteratorResultsDataProvider = CachedIteratorResultsDataProvider && Object.prototype.hasOwnProperty.call(CachedIteratorResultsDataProvider, 'default') ? CachedIteratorResultsDataProvider['default'] : CachedIteratorResultsDataProvider;
  DedupDataProvider = DedupDataProvider && Object.prototype.hasOwnProperty.call(DedupDataProvider, 'default') ? DedupDataProvider['default'] : DedupDataProvider;
  MutateEventFilteringDataProvider = MutateEventFilteringDataProvider && Object.prototype.hasOwnProperty.call(MutateEventFilteringDataProvider, 'default') ? MutateEventFilteringDataProvider['default'] : MutateEventFilteringDataProvider;

  var EnhancedTreeDataProvider = /*#__PURE__*/function () {
    function EnhancedTreeDataProvider(treeDataProvider, enhancedDataProvider, options) {
      var _this = this;

      _classCallCheck(this, EnhancedTreeDataProvider);

      this.treeDataProvider = treeDataProvider;
      this.enhancedDataProvider = enhancedDataProvider;
      this.options = options;
      enhancedDataProvider.addEventListener(EnhancedTreeDataProvider._MUTATE, function (event) {
        _this.dispatchEvent(event);
      });
      enhancedDataProvider.addEventListener(EnhancedTreeDataProvider._REFRESH, function (event) {
        _this.dispatchEvent(event);
      });

      if (enhancedDataProvider.createOptimizedKeyMap) {
        this.createOptimizedKeyMap = function (initialMap) {
          return enhancedDataProvider.createOptimizedKeyMap(initialMap);
        };
      }

      if (enhancedDataProvider.createOptimizedKeySet) {
        this.createOptimizedKeySet = function (initialSet) {
          return enhancedDataProvider.createOptimizedKeySet(initialSet);
        };
      }
    }

    _createClass(EnhancedTreeDataProvider, [{
      key: "getChildDataProvider",
      value: function getChildDataProvider(parentKey) {
        var childDataProvider = this.treeDataProvider.getChildDataProvider(parentKey);

        if (childDataProvider) {
          return getEnhancedDataProvider(childDataProvider, this.options);
        }

        return null;
      }
    }, {
      key: "containsKeys",
      value: function containsKeys(parameters) {
        return this.enhancedDataProvider.containsKeys(parameters);
      }
    }, {
      key: "fetchByKeys",
      value: function fetchByKeys(parameters) {
        return this.enhancedDataProvider.fetchByKeys(parameters);
      }
    }, {
      key: "fetchByOffset",
      value: function fetchByOffset(parameters) {
        return this.enhancedDataProvider.fetchByOffset(parameters);
      }
    }, {
      key: "fetchFirst",
      value: function fetchFirst(parameters) {
        return this.enhancedDataProvider.fetchFirst(parameters);
      }
    }, {
      key: "getCapability",
      value: function getCapability(capabilityName) {
        return this.enhancedDataProvider.getCapability(capabilityName);
      }
    }, {
      key: "getTotalSize",
      value: function getTotalSize() {
        return this.enhancedDataProvider.getTotalSize();
      }
    }, {
      key: "isEmpty",
      value: function isEmpty() {
        return this.enhancedDataProvider.isEmpty();
      }
    }]);

    return EnhancedTreeDataProvider;
  }();

  EnhancedTreeDataProvider._REFRESH = 'refresh';
  EnhancedTreeDataProvider._MUTATE = 'mutate';
  oj['EnhancedTreeDataProvider'] = EnhancedTreeDataProvider;
  oj.EnhancedTreeDataProvider = EnhancedTreeDataProvider;
  oj.EventTargetMixin.applyMixin(EnhancedTreeDataProvider);

  function getEnhancedDataProvider(dataProvider, options) {
    var _a, _b, _c;

    var fetchCapability = (_a = options === null || options === void 0 ? void 0 : options.capabilities) === null || _a === void 0 ? void 0 : _a.fetchCapability;
    var dedupCapability = (_b = options === null || options === void 0 ? void 0 : options.capabilities) === null || _b === void 0 ? void 0 : _b.dedupCapability;
    var eventFilteringCapability = (_c = options === null || options === void 0 ? void 0 : options.capabilities) === null || _c === void 0 ? void 0 : _c.eventFilteringCapability;
    var dataProviderFetchCapability = dataProvider.getCapability('fetchCapability');
    var dataProviderDedupCapability = dataProvider.getCapability('dedup');
    var dataProviderEventFilteringCapability = dataProvider.getCapability('eventFiltering');
    var needsCaching = true;
    var needsDedup = true;
    var needsEventFiltering = true;
    var dataProviderFetchCapabilityCaching = dataProviderFetchCapability === null || dataProviderFetchCapability === void 0 ? void 0 : dataProviderFetchCapability.caching;

    if ((fetchCapability === null || fetchCapability === void 0 ? void 0 : fetchCapability.caching) == 'none' || dataProviderFetchCapabilityCaching == 'all' || dataProviderFetchCapabilityCaching == 'visitedByCurrentIterator') {
      needsCaching = false;
    }

    var dataProviderDedupCapabilityType = dataProviderDedupCapability === null || dataProviderDedupCapability === void 0 ? void 0 : dataProviderDedupCapability.type;

    if ((dedupCapability === null || dedupCapability === void 0 ? void 0 : dedupCapability.type) == 'none' || dataProviderDedupCapabilityType == 'global' || dataProviderDedupCapabilityType == 'iterator') {
      needsDedup = false;
    }

    var dataProviderEventFilteringCapabilityType = dataProviderEventFilteringCapability === null || dataProviderEventFilteringCapability === void 0 ? void 0 : dataProviderEventFilteringCapability.type;

    if ((eventFilteringCapability === null || eventFilteringCapability === void 0 ? void 0 : eventFilteringCapability.type) == 'none' || dataProviderEventFilteringCapabilityType == 'global' || dataProviderEventFilteringCapabilityType == 'iterator') {
      needsEventFiltering = false;
    }

    var wrappedDataProvider = dataProvider;

    if (needsCaching) {
      wrappedDataProvider = new CachedIteratorResultsDataProvider(wrappedDataProvider);
    }

    if (needsDedup) {
      wrappedDataProvider = new DedupDataProvider(wrappedDataProvider);
    }

    if (needsEventFiltering) {
      wrappedDataProvider = new MutateEventFilteringDataProvider(wrappedDataProvider);
    }

    if (dataProvider['getChildDataProvider']) {
      wrappedDataProvider = new EnhancedTreeDataProvider(dataProvider, wrappedDataProvider, options);
    }

    return wrappedDataProvider;
  }

  exports.getEnhancedDataProvider = getEnhancedDataProvider;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
}())