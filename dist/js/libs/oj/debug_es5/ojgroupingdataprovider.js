/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojarraytreedataprovider', 'ojs/ojarraydataprovider', 'ojs/ojeventtarget', 'ojs/ojtreedataprovider'], function(oj, $, ko, ArrayTreeDataProvider)
{
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GroupingDataProvider = /*#__PURE__*/function () {
  function GroupingDataProvider(dataProvider, sortComparator, sectionRenderer, options) {
    _classCallCheck(this, GroupingDataProvider);

    this.dataProvider = dataProvider;
    this.sortComparator = sortComparator;
    this.sectionRenderer = sectionRenderer;
    this.options = options;

    this._getKeyAttribute = function () {
      var keyAttributes = this.options != null ? this.options['keyAttributes'] : null;

      if (!keyAttributes) {
        //default to id
        keyAttributes = 'id';
      }

      return keyAttributes;
    };

    this.GroupAsyncIterator = /*#__PURE__*/function () {
      function _class(_parent, _baseIterable, _dataprovider, _params) {
        _classCallCheck(this, _class);

        this._parent = _parent;
        this._baseIterable = _baseIterable;
        this._dataprovider = _dataprovider;
        this._params = _params;
      }

      _createClass(_class, [{
        key: 'next',
        value: function next() {
          var self = this; // skip fetch if we have at least one section that's prefetched.

          var currentFetchedRootOffset = 0;

          if (self._parent._currentRootSection) {
            currentFetchedRootOffset = Object.keys(self._parent._sections).indexOf(self._parent._currentRootSection);
          }

          var skipFetch = self._parent._currentBaseOffset < currentFetchedRootOffset;
          return this._parent._getDataFromDataProvider(this._params, 'root', skipFetch).then(function () {
            self._parent._updateSectionIndex();

            var updatedParams = new self._parent.FetchByOffsetParameters(self._parent, self._parent._currentBaseOffset, self._params.size, self._params.sortCriteria, self._params.filterCriterion);
            return self._dataprovider.fetchByOffset(updatedParams).then(function (res) {
              var result = res['results'];
              var data = result.map(function (value) {
                return value['data'];
              });
              var metadata = result.map(function (value) {
                return value['metadata'];
              });

              for (var i = 0; i < metadata.length; i++) {
                // Replace flat array metadata with tree array metadata
                metadata[i] = self._parent._getNodeMetadata(result[i].data);
                data[i] = self._parent.sectionRenderer(metadata[i].key);
              } // update internal base offset value


              self._parent._currentBaseOffset = self._parent._currentBaseOffset + data.length;

              if (res.done && self._parent._dataFetchComplete) {
                return Promise.resolve(new self._parent.AsyncIteratorReturnResult(self._parent, new self._parent.FetchListResult(self._parent, self._params, data, metadata)));
              }

              return Promise.resolve(new self._parent.AsyncIteratorYieldResult(self._parent, new self._parent.FetchListResult(self._parent, self._params, data, metadata)));
            });
          });
        }
      }]);

      return _class;
    }();

    this.TreeAsyncIterator = /*#__PURE__*/function () {
      function _class2(_parent, _isParentSection, _parentKey, _dataprovider, _params) {
        _classCallCheck(this, _class2);

        this._parent = _parent;
        this._isParentSection = _isParentSection;
        this._parentKey = _parentKey;
        this._dataprovider = _dataprovider;
        this._params = _params;

        this._parent._registerIteratorOffset(this, this._parentKey, 0);
      }

      _createClass(_class2, [{
        key: 'next',
        value: function next() {
          var self = this;
          return this._parent._getDataFromDataProvider(this._params, this._parentKey, false).then(function (value) {
            if (value === undefined) {
              self._parent._updateSectionIndex();
            }

            var internalOffset = self._parent._getIteratorOffset(self);

            var updatedParams = new self._parent.FetchByOffsetParameters(self._parent, internalOffset.offset, self._params.size, self._params.sortCriteria, self._params.filterCriterion);
            return self._dataprovider.fetchByOffset(updatedParams).then(function (res) {
              var result = res['results'];
              var data = result.map(function (value) {
                return value['data'];
              });
              var metadata = result.map(function (value) {
                return value['metadata'];
              });

              if (self._isParentSection) {
                for (var i = 0; i < metadata.length; i++) {
                  // Replace flat array metadata with tree array metadata
                  metadata[i] = self._parent._getNodeMetadata(result[i].data);
                  data[i] = self._parent.sectionRenderer(metadata[i].key);
                }
              } // update internal base offset value


              self._parent._updateIteratorOffset(self, internalOffset.offset + data.length);

              if (res.done) {
                // done with fetching, clear offsets
                self._parent._unregisterIteratorOffset(self);

                return Promise.resolve(new self._parent.AsyncIteratorReturnResult(self._parent, new self._parent.FetchListResult(self._parent, self._params, data, metadata)));
              }

              return Promise.resolve(new self._parent.AsyncIteratorYieldResult(self._parent, new self._parent.FetchListResult(self._parent, self._params, data, metadata)));
            });
          });
        }
      }]);

      return _class2;
    }();

    this.TreeAsyncIterable = /*#__PURE__*/function () {
      function _class3(_parent, _asyncIterator) {
        _classCallCheck(this, _class3);

        this._parent = _parent;
        this._asyncIterator = _asyncIterator;

        this[Symbol.asyncIterator] = function () {
          return this._asyncIterator;
        };
      }

      return _class3;
    }();

    this.FetchListParameters = /*#__PURE__*/function () {
      function _class4(_parent, size, sortCriteria, attributes) {
        _classCallCheck(this, _class4);

        this._parent = _parent;
        this.size = size;
        this.sortCriteria = sortCriteria;
        this.attributes = attributes;
        this['size'] = size;
        this['sortCriteria'] = sortCriteria;
        this['attributes'] = attributes;
      }

      return _class4;
    }();

    this.FetchByOffsetParameters = /*#__PURE__*/function () {
      function _class5(_parent, offset, size, sortCriteria, filterCriterion) {
        _classCallCheck(this, _class5);

        this._parent = _parent;
        this.offset = offset;
        this.size = size;
        this.sortCriteria = sortCriteria;
        this.filterCriterion = filterCriterion;
        this['size'] = size;
        this['sortCriteria'] = sortCriteria;
        this['offset'] = offset;
        this['filterCriterion'] = filterCriterion;
      }

      return _class5;
    }();

    this.FetchListResult = /*#__PURE__*/function () {
      function _class6(_parent, fetchParameters, data, metadata) {
        _classCallCheck(this, _class6);

        this._parent = _parent;
        this.fetchParameters = fetchParameters;
        this.data = data;
        this.metadata = metadata;
        this['fetchParameters'] = fetchParameters;
        this['data'] = data;
        this['metadata'] = metadata;
      }

      return _class6;
    }();

    this.AsyncIteratorYieldResult = /*#__PURE__*/function () {
      function _class7(_parent, value) {
        _classCallCheck(this, _class7);

        this._parent = _parent;
        this.value = value;
        this['value'] = value;
        this['done'] = false;
      }

      return _class7;
    }();

    this.AsyncIteratorReturnResult = /*#__PURE__*/function () {
      function _class8(_parent, value) {
        _classCallCheck(this, _class8);

        this._parent = _parent;
        this.value = value;
        this['value'] = value;
        this['done'] = true;
      }

      return _class8;
    }();

    this._dataProvider = dataProvider;

    this._addEventListeners(this._dataProvider);

    this._initialize();
  }

  _createClass(GroupingDataProvider, [{
    key: "containsKeys",
    value: function containsKeys(params) {
      var self = this;
      return this.fetchByKeys(params).then(function (fetchByKeysResult) {
        var results = new Set();
        params['keys'].forEach(function (key) {
          if (fetchByKeysResult['results'].get(key) != null) {
            results.add(key);
          }
        });
        return Promise.resolve({
          containsParameters: params,
          results: results
        });
      });
    }
  }, {
    key: "getCapability",
    value: function getCapability(capabilityName) {
      // No filtering support yet
      if (capabilityName === 'filter') {
        return null;
      }

      return this._baseDataProvider.getCapability(capabilityName);
    }
  }, {
    key: "getTotalSize",
    value: function getTotalSize() {
      return this._baseDataProvider.getTotalSize();
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this._baseDataProvider.isEmpty();
    }
  }, {
    key: "getChildDataProvider",
    value: function getChildDataProvider(parentKey) {
      var self = this;

      var children = this._getChildren(parentKey);

      var isParentSection = this._isParentSection(parentKey); // create new custom array tree dataprovider that references this getChildDataProvider


      function SectionTreeDataProvider(sections, params) {
        this._parentKey = params.parentKey;
        this._isParentSection = params.isParentSection;

        if (this._isParentSection) {
          this._baseDataProvider = new oj['ArrayDataProvider'](sections.childData, {});
          this._baseTreeDataProvider = new oj.ArrayTreeDataProvider(sections.childData, {
            keyAttributes: params.keyAttributes
          });
        } else {
          this._baseDataProvider = new oj['ArrayDataProvider'](sections.children, {
            keyAttributes: params.keyAttributes
          });
          this._baseTreeDataProvider = new oj.ArrayTreeDataProvider(sections.children, {
            keyAttributes: params.keyAttributes
          });
        }
      }

      SectionTreeDataProvider.prototype.containsKeys = function (params) {
        return this._baseTreeDataProvider.containsKeys(params);
      };

      SectionTreeDataProvider.prototype.getCapability = function (capabilityName) {
        return this._baseTreeDataProvider.getCapability(capabilityName);
      };

      SectionTreeDataProvider.prototype.getTotalSize = function () {
        return this._baseTreeDataProvider.getTotalSize();
      };

      SectionTreeDataProvider.prototype.isEmpty = function () {
        return this._baseTreeDataProvider.isEmpty();
      };

      SectionTreeDataProvider.prototype.fetchByOffset = function (params) {
        return this._baseTreeDataProvider.fetchByOffset(params);
      };

      SectionTreeDataProvider.prototype.fetchByKeys = function (params) {
        return this._baseTreeDataProvider.fetchByKeys(params);
      };

      SectionTreeDataProvider.prototype.getChildDataProvider = function (parentKey) {
        return self.getChildDataProvider(parentKey);
      };

      SectionTreeDataProvider.prototype.fetchFirst = function (params) {
        if (params && params.filterCriterion) {
          // clear out filterCriterion until support for filtering is added
          params = $.extend({}, params);
          params.filterCriterion = null;
        }

        var baseDataProvider = this._baseDataProvider;
        var _isParentSection = this._isParentSection;
        var parentKey = this._parentKey;
        return new self.TreeAsyncIterable(self, new self.TreeAsyncIterator(self, _isParentSection, parentKey, baseDataProvider, params));
      };

      SectionTreeDataProvider.prototype._getId = function (key) {
        return self._getId(key);
      };

      if (children) {
        //if (isParentSection) {
        return new SectionTreeDataProvider(this._sections[parentKey], {
          keyAttributes: this._getKeyAttribute(),
          parentKey: parentKey,
          isParentSection: isParentSection
        }); //}
        //return new ArrayTreeDataProvider<K, D>(children, { keyAttributes: this._getKeyAttribute() });
      }

      return null;
    }
  }, {
    key: "fetchFirst",
    value: function fetchFirst(params) {
      if (params && params.filterCriterion) {
        // clear out filterCriterion until support for filtering is added
        params = $.extend({}, params);
        params.filterCriterion = null;
      }

      var self = this;

      var baseIterable = self._baseDataProvider.fetchFirst(params); // reset current cache since we are refetching data from the base dp


      this._initializeTreeCache();

      return new self.TreeAsyncIterable(this, new self.GroupAsyncIterator(this, baseIterable, self._baseDataProvider, params));
    }
  }, {
    key: "fetchByOffset",
    value: function fetchByOffset(params) {
      var basePromise = this._baseDataProvider.fetchByOffset(params);

      var self = this;
      return basePromise.then(function (result) {
        // Repackage the results with tree node metadata
        var results = result.results;
        var newResults = [];

        for (var i = 0; i < results.length; i++) {
          var metadata = results[i]['metadata'];
          var data = results[i]['data'];
          metadata = self._getNodeMetadata(data);
          newResults.push({
            data: data,
            metadata: metadata
          });
        }

        return {
          done: result['done'],
          fetchParameters: result['fetchParameters'],
          results: newResults
        };
      });
    }
  }, {
    key: "fetchByKeys",
    value: function fetchByKeys(params) {
      var self = this;
      var results = new Map();
      params['keys'].forEach(function (key) {
        var node = self._getNodeForKey(key);

        if (node) {
          results.set(key, {
            metadata: {
              key: key
            },
            data: node
          });
        }
      });
      return Promise.resolve({
        fetchParameters: params,
        results: results
      });
    }
  }, {
    key: "_getChildren",
    value: function _getChildren(sectionKey) {
      if (this._sections[sectionKey]) {
        return this._sections[sectionKey].children;
      }

      return null;
    }
  }, {
    key: "_isParentSection",
    value: function _isParentSection(sectionKey) {
      if (sectionKey in this._sections) {
        var parentSection = this._sections[sectionKey];

        if (parentSection && parentSection.children().length > 0) {
          // check if first child is in the section keys
          if (this._sections[parentSection.children()[0]]) {
            return true;
          }
        }
      }

      return false;
    }
  }, {
    key: "_initialize",
    value: function _initialize() {
      this._mapKeyToNode = new Map();
      this._mapNodeToKey = new Map();
      this._mapArrayToSequenceNum = new Map();
      this._sections = {};
      this._sectionRoots = ko.observableArray();
      this._sectionRootData = ko.observableArray();
      this._dataFetchComplete = false;
      this._internalIterator = null; // initialize base treeData as observable array to track root nodes

      this.treeData = new ko.observableArray([]);

      this._initializeTreeCache();

      this._createSections();

      this._storedAddSection = [];
      this._storedAddSectionKeys = [];
      this._storedRemoveSection = [];
      this._baseDataProvider = null;

      this._processSectionsArray([]);
    }
  }, {
    key: "_initializeTreeCache",
    value: function _initializeTreeCache() {
      this._treeKeyMap = [];
      this._treeMetadata = [];
      this._treeData = [];
      this._currentFirstSection = null;
      this._currentSectionKey = null;
      this._currentRootSection = null;
      this._currentSectionData = [];
      this._currentOffset = 0;
      this._currentBaseOffset = 0;
      this._iteratorOffsets = new Map();
      this._dataFetchComplete = false;
      this._internalIterator = null;
    }
  }, {
    key: "_registerIteratorOffset",
    value: function _registerIteratorOffset(dataprovider, parentKey, initialOffset) {
      this._iteratorOffsets.set(dataprovider, {
        parentKey: parentKey,
        offset: initialOffset
      });
    }
  }, {
    key: "_getIteratorOffset",
    value: function _getIteratorOffset(dataprovider) {
      return this._iteratorOffsets.get(dataprovider);
    }
  }, {
    key: "_updateIteratorOffset",
    value: function _updateIteratorOffset(dataprovider, newOffset) {
      var originalValue = this._iteratorOffsets.get(dataprovider);

      originalValue.offset = newOffset;

      this._iteratorOffsets.set(dataprovider, originalValue);
    }
  }, {
    key: "_unregisterIteratorOffset",
    value: function _unregisterIteratorOffset(dataprovider) {
      this._iteratorOffsets.delete(dataprovider);
    }
  }, {
    key: "_getRootDataProvider",
    value: function _getRootDataProvider() {
      return this;
    }
  }, {
    key: "_getDataFromDataProvider",
    value: function _getDataFromDataProvider(params, source, skipFetch) {
      var self = this; // Check if we need to grab more data.
      // Applicable if the current fetched section or any of its parent sections is being called for fetching

      if (!this._inCurrentFetchingSection(source) || skipFetch) {
        return Promise.resolve(true);
      }

      if (!self._internalIterator) {
        self._internalIterator = this._dataProvider.fetchFirst(params)[Symbol.asyncIterator]();
      }

      var helperFunction = function helperFunction() {
        return self._internalIterator.next().then(function (result) {
          // concat the data
          self._treeData = self._treeData.concat(result['value']['data']);
          self._treeMetadata = self._treeMetadata.concat(result['value']['metadata']);
          result['value']['metadata'].forEach(function (val) {
            self._treeKeyMap.push(val.key);
          });

          if (result['done']) {
            self._dataFetchComplete = true;
          }

          if (result['done'] || result['value']['data'].length == result['value']['fetchParameters']['size']) {
            // we have all the data or we hit the fetchSize
            return;
          }

          return helperFunction();
        });
      };

      return helperFunction();
    } // Returns a boolean about whether or not the source value
    // is the same as the current section key

  }, {
    key: "_inCurrentFetchingSection",
    value: function _inCurrentFetchingSection(source) {
      if (source === 'root') {
        return true;
      }

      if (this._currentSectionKey == source) {
        return true;
      }

      return false;
    }
  }, {
    key: "_processSectionsArray",
    value: function _processSectionsArray(parentKeyPath) {
      var self = this;
      this.treeData().forEach(function (node, i) {
        self._processNode(node, parentKeyPath, this.treeData());
      });

      if (!this._baseDataProvider) {
        this._baseDataProvider = new oj['ArrayDataProvider'](this.treeData, null);
      }
    }
  }, {
    key: "_processTreeArray",
    value: function _processTreeArray(treeData, parentKeyPath) {
      var self = this;
      var dataArray;

      if (treeData instanceof Array) {
        dataArray = treeData;
      } else {
        dataArray = treeData();
      }

      dataArray.forEach(function (node, i) {
        self._processNode(node, parentKeyPath, treeData);
      });
    }
  }, {
    key: "_processNode",
    value: function _processNode(node, parentKeyPath, treeData) {
      var self = this;

      var keyObj = self._createKeyObj(node, parentKeyPath, treeData);

      self._setMapEntry(keyObj.key, node);

      var children = self._getChildren(node);

      if (children) {
        self._processTreeArray(children, keyObj.keyPath);
      }

      return keyObj;
    }
  }, {
    key: "_createSections",
    value: function _createSections() {
      var self = this;

      if (!this.options || !this.options.groupByStrategy) {
        var cutoffs = [];
        var now = new Date(Date.now());
        cutoffs.push(now);
        var nowTemp = new Date(Date.now());
        var previous1 = nowTemp.setDate(now.getDate() - 1);
        var previous2 = nowTemp.setDate(now.getDate() - 7);
        cutoffs.push(previous1);
        cutoffs.push(previous2);
        nowTemp = new Date(Date.now());
        var previous3 = nowTemp.setMonth(now.getMonth() - 1);
        cutoffs.push(previous3);
        nowTemp = new Date(Date.now());
        var previous4 = nowTemp.setFullYear(now.getFullYear() - 1);
        cutoffs.push(previous4);

        this._groupingFunction = function (item) {
          var labels = ['In the past day', 'In the past week', 'In the past month', 'In the past year', 'Earlier'];

          if (item && item['date']) {
            var date = new Date(item['date']);
            var counter = 1;

            while (date < cutoffs[counter] && counter != 5) {
              counter++;
            }

            return [labels[counter - 1]];
          }

          return ['Section 1'];
        };
      } else if (typeof this.options.groupByStrategy == 'function') {
        this._groupingFunction = this.options.groupByStrategy;
      } else if (typeof this.options.groupByStrategy == 'string') {
        this._groupingFunction = function (item) {
          return self._getVal(item, self.options.groupByStrategy);
        };
      } // need to notify that value has changed


      if (this.treeData) {
        this.treeData.valueHasMutated();
      }
    }
  }, {
    key: "_getSectionKeyFromArray",
    value: function _getSectionKeyFromArray(label) {
      if (label) {
        if (Array.isArray(label) && label.length > 0) {
          // last item should be the section key
          return label[label.length - 1];
        } else if (typeof label == 'string') {
          return label;
        }
      }

      return null;
    }
  }, {
    key: "_createNewSection",
    value: function _createNewSection(newSectionKey, needsMutationEvent, sectionMapping, previousKey, nextKey) {
      var self = this;
      var depth = sectionMapping.indexOf(newSectionKey);
      var parentKey = null;

      if (depth != 0) {
        parentKey = sectionMapping[depth - 1];
      }

      var parentSectionChildrenArray;
      var parentSectionChildDataArray;
      var previousLeaf = null;
      var nextLeaf = null;

      var leafNode = depth == this._getDepth(sectionMapping);

      var rootNode = false; // if leaf node, keep track of previous and next leaf

      if (leafNode) {
        previousLeaf = previousKey;
        nextLeaf = nextKey;
      }

      if (parentKey != null) {
        if (!(parentKey in this._sections && this._sections[parentKey].active)) {
          // parent doesn't exist, need to create it.
          this._createNewSection(parentKey, needsMutationEvent, sectionMapping, previousKey, nextKey); // If we need to create a parent, we can just use that as the mutation event


          if (needsMutationEvent) {
            needsMutationEvent = false;
          }
        } // parent does exist now. Extract the relevant data from it


        parentSectionChildrenArray = this._sections[parentKey].children;
        parentSectionChildDataArray = this._sections[parentKey].childData;
      } else {
        // this is a root node. Go to sectionRoots for the correct data
        parentSectionChildrenArray = this._sectionRoots;
        parentSectionChildDataArray = this._sectionRootData;
        rootNode = true;
      } // get the appropriate previous node for the level


      var previousNode = null; // Usually can just use previous key to determine placement of section level.

      if (nextKey == null) {
        // Grab the previous Key and add current key to the array if null previousKey
        if (previousKey == null) {
          if (parentSectionChildrenArray().length > 0) {
            previousKey = parentSectionChildrenArray()[parentSectionChildrenArray().length - 1]; // if leaf node, update previous leaf

            if (leafNode) {
              previousLeaf = previousKey;
            }
          } // splice in the new sectionKey based on location


          parentSectionChildrenArray.push(newSectionKey);
          parentSectionChildDataArray.push(self.sectionRenderer(newSectionKey));
        } else {
          // get the appropriate previous node for the level
          previousNode = this._sections[previousKey];

          while (previousNode.depth > depth) {
            previousNode = this._sections[this._sections[previousKey].parent];
          }

          if (previousNode.depth == depth) {
            previousKey = previousNode.key; // splice in the new sectionKey based on location

            var newIndex = parentSectionChildrenArray.indexOf(previousKey);

            if (newIndex >= 0) {
              parentSectionChildrenArray.splice(newIndex + 1, 0, newSectionKey);
              parentSectionChildDataArray.splice(newIndex + 1, 0, self.sectionRenderer(newSectionKey));
            } else {
              parentSectionChildrenArray.push(newSectionKey);
              parentSectionChildDataArray.push(self.sectionRenderer(newSectionKey));
            }

            nextKey = previousNode.next;
          } else {
            // no previous node at this level so leave both previous and next as null
            previousKey = null;
            nextKey = null; // push to parent

            parentSectionChildrenArray.push(newSectionKey);
            parentSectionChildDataArray.push(self.sectionRenderer(newSectionKey));
          }
        }
      } else {
        // previousKey is null so we need to go off next key
        // get the appropriate next node for the level
        var nextNode = this._sections[nextKey]; // For non-leaf containing sections, we need to align the depths

        while (nextNode.depth > depth) {
          nextNode = this._sections[this._sections[nextKey].parent];
        }

        if (nextNode.depth == depth) {
          nextKey = nextNode.key; // splice in the new sectionKey based on location

          var _newIndex = parentSectionChildrenArray.indexOf(nextKey);

          if (_newIndex >= 0) {
            parentSectionChildrenArray.splice(_newIndex, 0, newSectionKey);
            parentSectionChildDataArray.splice(_newIndex, 0, self.sectionRenderer(newSectionKey));
          } else {
            parentSectionChildrenArray.push(newSectionKey);
            parentSectionChildDataArray.push(self.sectionRenderer(newSectionKey));
          }

          previousKey = nextNode.previous;
        } else {
          // no next node at this level so leave both previous and next as null
          previousKey = null;
          nextKey = null; // push to parent

          parentSectionChildrenArray.push(newSectionKey);
          parentSectionChildDataArray.push(self.sectionRenderer(newSectionKey));
        }
      } // create the section if it doesn't exist


      if (!(newSectionKey in this._sections)) {
        this._sections[newSectionKey] = {
          parent: parentKey,
          key: newSectionKey,
          children: ko.observableArray([]),
          childData: ko.observableArray([]),
          previous: previousKey,
          next: nextKey,
          previousLeaf: previousLeaf,
          nextLeaf: nextLeaf,
          depth: depth,
          active: true,
          index: function index() {
            if (this.parent != null) {
              return self._sections[this.parent].children.indexOf(this.key);
            } else {
              return self._sectionRoots.indexOf(this.key);
            }
          },
          cutoffIndex: function cutoffIndex() {
            return self._getCutoffIndex(self._sections[this.key].previousLeaf) + self._sections[this.key].children().length;
          }
        };
      } else {
        // already exists, just need to activate and update methods
        this._sections[newSectionKey].active = true;
        this._sections[newSectionKey].previous = previousKey;
        this._sections[newSectionKey].next = nextKey;
        this._sections[newSectionKey].previousLeaf = previousLeaf;
        this._sections[newSectionKey].nextLeaf = nextLeaf;
        this._sections[newSectionKey].parent = parentKey;
      } // update previous section's next


      if (previousKey != null) {
        this._sections[previousKey].next = newSectionKey;
      } // update next section's previous


      if (nextKey != null) {
        this._sections[nextKey].previous = newSectionKey;
      }

      if (depth == this._getDepth(sectionMapping)) {
        // update leaf references
        if (previousLeaf != null) {
          this._sections[previousLeaf].nextLeaf = newSectionKey;
        }

        if (nextLeaf != null) {
          this._sections[nextLeaf].previousLeaf = newSectionKey;
        }
      }

      if (depth == this._getDepth(sectionMapping) && (nextKey == this._currentFirstSection || this._currentFirstSection == null)) {
        // if current first section is null or considered the next section, update current first section
        this._currentFirstSection = newSectionKey;
      }

      var addBeforeKeys = null;

      if (nextKey != null) {
        addBeforeKeys = [nextKey];
      }

      var data = self.sectionRenderer(newSectionKey);

      this._processNode(data, [], this.treeData);

      if (needsMutationEvent) {
        // Check if parent event already being fired
        if (this._storedAddSectionKeys.indexOf(this._sections[newSectionKey].parent) == -1) {
          var keys = newSectionKey;
          var metadata = {
            key: newSectionKey
          };

          var index = this._sections[newSectionKey].index();

          var addEvent = {
            data: [data],
            indexes: [index],
            keys: new Set([keys]),
            metadata: [metadata],
            addBeforeKeys: addBeforeKeys,
            parentKeys: [parentKey]
          };
          var mutationEvent = new oj.DataProviderMutationEvent({
            add: addEvent,
            remove: null,
            update: null
          });

          this._storedAddSection.push(mutationEvent);

          this._storedAddSectionKeys.push(newSectionKey); // need to increment the currentbaseoffset value to adjust fetch parameters if we're still fetching
          // and we are mutating root level nodes and new item index is before current offsets


          if (!this._dataFetchComplete && rootNode && this._currentBaseOffset > index) {
            this._currentBaseOffset++;
          }

          if (!this._dataFetchComplete) {
            // check current iterators if parentKey section is being fetched from
            // need to update its internal offset if new item index is before current offsets
            var _iterator = _createForOfIteratorHelper(this._internalIterator),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var _step$value = _slicedToArray(_step.value, 2),
                    key = _step$value[0],
                    value = _step$value[1];

                if (value.parentKey === parentKey && value.offset > index) {
                  value.offset++;
                }

                this._updateIteratorOffset(key, value.offset);
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
        }
      } // need to notify that value has changed


      this.treeData.valueHasMutated();
    }
  }, {
    key: "_removeSection",
    value: function _removeSection(sectionKey) {
      var sectionData = this._sections[sectionKey]; // update previous, next, and parent sections to
      // properly kill off all empty sections and keep references current

      var parent = sectionData.parent;
      var previous = sectionData.previous;
      var next = sectionData.next;
      var previousLeaf = sectionData.previousLeaf;
      var nextLeaf = sectionData.nextLeaf;
      var needsMutationEvent = true; // update previous and next

      if (this._sections[next] && this._sections[next].previous == sectionKey) {
        this._sections[next].previous = sectionData.previous;
      }

      if (this._sections[previous] && this._sections[previous].next == sectionKey) {
        this._sections[previous].next = sectionData.next;
      }

      if (this._sections[nextLeaf] && this._sections[nextLeaf].previousLeaf == sectionKey) {
        this._sections[nextLeaf].previousLeaf = sectionData.previousLeaf;
      }

      if (this._sections[previousLeaf] && this._sections[previousLeaf].nextLeaf == sectionKey) {
        this._sections[previousLeaf].nextLeaf = sectionData.nextLeaf;
      } // resolve parent. May need to delete


      if (this._sections[parent] && this._sections[parent].children.indexOf(sectionKey) != -1) {
        var childIndex = this._sections[parent].children.indexOf(sectionKey);

        if (!this._dataFetchComplete) {
          // check current iterators if parentKey section is being fetched from
          // need to update its internal offset
          var _iterator2 = _createForOfIteratorHelper(this._internalIterator),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _step2$value = _slicedToArray(_step2.value, 2),
                  key = _step2$value[0],
                  value = _step2$value[1];

              if (value.parentKey === parent && value.offset > childIndex) {
                value.offset--;
              }

              this._updateIteratorOffset(key, value.offset);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }

        this._sections[parent].children.splice(childIndex, 1);

        this._sections[parent].childData.splice(childIndex, 1); // If a section no longer has children, we should remove it.


        if (this._sections[parent].children().length === 0) {
          this._removeSection(parent); // If we need to remove a parent, we can just use that as the mutation event


          if (needsMutationEvent) {
            needsMutationEvent = false;
          }
        }
      } // Don't delete section. Instead 'soft delete' by setting inactive
      // That way we retain the data for the section and can add it back in as needed


      this._sections[sectionKey].active = false;

      this._sections[sectionKey].children([]);

      this._sections[sectionKey].childData([]);

      if (this._sections[sectionKey].parent == null) {
        // if no parent, remove it also from root nodes
        var rootIndex = this._sectionRoots.indexOf(sectionKey);

        this._sectionRoots.splice(rootIndex, 1);

        this._sectionRootData.splice(rootIndex, 1); // need to decrement the currentbaseoffset value to adjust fetch parameters if we're still fetching
        // and rootIndex < base offset


        if (!this._dataFetchComplete && this._currentBaseOffset > rootIndex) {
          this._currentBaseOffset--;
        }
      }

      if (sectionKey == this._currentFirstSection) {
        // removing first section, so set as its next section
        this._currentFirstSection = next;
      }

      if (needsMutationEvent) {
        var data = this.sectionRenderer(sectionKey);
        var keys = sectionKey;
        var metadata = {
          key: sectionKey
        };
        var removeEvent = {
          data: [data],
          indexes: null,
          keys: new Set([keys]),
          metadata: [metadata]
        };
        var mutationEvent = new oj.DataProviderMutationEvent({
          add: null,
          remove: removeEvent,
          update: null
        });

        this._storedRemoveSection.push(mutationEvent);
      } // need to notify that value has changed


      this.treeData.valueHasMutated();
    }
  }, {
    key: "_updateSectionIndex",
    value: function _updateSectionIndex() {
      var self = this;

      for (var i = this._currentOffset; i < this._treeData.length; i++) {
        var data = this._treeData[i];

        var newSectionLabel = self._groupingFunction(data);

        var itemSectionKey = self._getSectionKeyFromArray(newSectionLabel);

        if (this._currentSectionKey == null) {
          // initialize
          if (!(itemSectionKey in this._sections)) {
            self._createNewSection(itemSectionKey, false, newSectionLabel, this._currentSectionKey, null);
          }

          this._currentSectionKey = itemSectionKey;
          this._currentRootSection = this._getSectionArray(newSectionLabel)[0];
        }

        if (itemSectionKey === this._currentSectionKey) {
          this._currentSectionData.push(data);
        } else {
          if (!(itemSectionKey in this._sections && this._sections[itemSectionKey].active)) {
            // if key doesn't exist, need to initialize
            // if it is inactive, also need to initialize
            self._createNewSection(itemSectionKey, false, newSectionLabel, this._currentSectionKey, null);
          }

          this._sections[this._currentSectionKey].children(this._currentSectionData);

          this._sections[this._currentSectionKey].childData(this._getChildDataFromChildren(this._currentSectionKey));

          this._currentSectionKey = itemSectionKey;
          this._currentRootSection = this._getSectionArray(newSectionLabel)[0];
          this._currentSectionData = [data];
        } // increment our offset position


        this._currentOffset++;
      }

      if (this._currentSectionData.length > 0) {
        this._sections[this._currentSectionKey].children(this._currentSectionData);

        this._sections[this._currentSectionKey].childData(this._getChildDataFromChildren(this._currentSectionKey));
      } // update root nodes


      var rootSections = [];

      for (var sectionKey in this._sections) {
        if (this._sections[sectionKey].parent == null) {
          rootSections.push(this.sectionRenderer(sectionKey));
        }
      }

      this.treeData(rootSections);
      this.treeData.valueHasMutated();
    }
  }, {
    key: "_getSectionArray",
    value: function _getSectionArray(sectionMapping) {
      if (Array.isArray(sectionMapping)) {
        // if it's an array, return 1 less than the length
        return sectionMapping;
      } else {
        // it can be a string, so depth 0
        return [sectionMapping];
      }
    }
  }, {
    key: "_getChildDataFromChildren",
    value: function _getChildDataFromChildren(sectionKey) {
      var self = this;
      var childData = [];

      this._sections[sectionKey].children().forEach(function (child) {
        childData.push(self.sectionRenderer(child));
      });

      return childData;
    }
  }, {
    key: "_createKeyObj",
    value: function _createKeyObj(node, parentKeyPath, treeData) {
      var key = this._getId(node);

      var keyPath = parentKeyPath ? parentKeyPath.slice() : [];

      if (key == null) {
        // _getId returns null if keyAttributes is not specified.  In this case we
        // use the index path of the node as the key.
        // However, if this is called after initialization, we can't use index
        // any more because node position can shift, so we need to keep track of
        // a sequence number.
        keyPath.push(this._incrementSequenceNum(treeData));
        key = keyPath;
      } else {
        keyPath.push(key);

        if (this.options && this.options['keyAttributesScope'] == 'siblings') {
          // If the id is only unique among siblings, we use the id path of the
          // node as the key.
          key = keyPath;
        }
      }

      return {
        key: key,
        keyPath: keyPath
      };
    }
    /**
     * Get id value for row
     */

  }, {
    key: "_getId",
    value: function _getId(row) {
      var id;
      var keyAttributes = this.options != null ? this.options['keyAttributes'] : null;

      if (!keyAttributes) {
        //default to id
        keyAttributes = 'id';
      }

      if (keyAttributes != null) {
        if (Array.isArray(keyAttributes)) {
          var i;
          id = [];

          for (i = 0; i < keyAttributes.length; i++) {
            id[i] = this._getVal(row, keyAttributes[i]);
          }
        } else if (keyAttributes == '@value') {
          id = this._getAllVals(row);
        } else {
          id = this._getVal(row, keyAttributes);
        }

        return id;
      } else {
        return null;
      }
    }
    /**
     * Get depth of a section. Sections right below root are depth 0, increasing for number of levels
     */

  }, {
    key: "_getDepth",
    value: function _getDepth(sectionMapping) {
      if (Array.isArray(sectionMapping)) {
        // if it's an array, return 1 less than the length
        return sectionMapping.length - 1;
      } else {
        // it can be a string, so depth 0
        return 0;
      }
    }
    /**
     * Get value for attribute
     */

  }, {
    key: "_getVal",
    value: function _getVal(val, attr, keepFunc) {
      if (typeof attr == 'string') {
        var dotIndex = attr.indexOf('.');

        if (dotIndex > 0) {
          var startAttr = attr.substring(0, dotIndex);
          var endAttr = attr.substring(dotIndex + 1);
          var subObj = val[startAttr];

          if (subObj) {
            return this._getVal(subObj, endAttr);
          }
        }
      } // If keepFunc is true, don't resolve any function value.
      // e.g. Caller may want to preserve any observableArray for other operations.


      if (keepFunc !== true && typeof val[attr] == 'function') {
        return val[attr]();
      }

      return val[attr];
    }
    /**
     * Get all values in a row
     */

  }, {
    key: "_getAllVals",
    value: function _getAllVals(val) {
      var self = this;
      return Object.keys(val).map(function (key) {
        return self._getVal(val, key);
      });
    }
  }, {
    key: "_getNodeMetadata",
    value: function _getNodeMetadata(node) {
      var key = this._getKeyForNode(node);

      if (!key) {
        key = this._getId(node);
      }

      return {
        key: key
      };
    }
  }, {
    key: "_getNodeForKey",
    value: function _getNodeForKey(key) {
      var rootDataProvider = this._getRootDataProvider();

      return rootDataProvider._mapKeyToNode.get(JSON.stringify(key));
    }
  }, {
    key: "_getKeyForNode",
    value: function _getKeyForNode(node) {
      var rootDataProvider = this._getRootDataProvider();

      return rootDataProvider._mapNodeToKey.get(node);
    }
  }, {
    key: "_setMapEntry",
    value: function _setMapEntry(key, node) {
      var rootDataProvider = this._getRootDataProvider();

      rootDataProvider._mapKeyToNode.set(JSON.stringify(key), node);

      rootDataProvider._mapNodeToKey.set(node, key);
    }
  }, {
    key: "_incrementSequenceNum",
    value: function _incrementSequenceNum(treeData) {
      var rootDataProvider = this._getRootDataProvider();

      var seqNum = rootDataProvider._mapArrayToSequenceNum.get(treeData) || 0;

      rootDataProvider._mapArrayToSequenceNum.set(treeData, seqNum + 1); // Return the previous sequence number


      return seqNum;
    } // sortComparator(a, b): returns true if a goes before b, false otherwise.

  }, {
    key: "_addData",
    value: function _addData(event) {
      var self = this;
      var data = event.data;
      var metadata = event.metadata;
      var addBeforeKeys = event.addBeforeKeys;
      var indexes = event.indexes;
      var keys = []; // get key array

      event.keys.forEach(function (key) {
        keys.push(key);
      });

      if (indexes != null && indexes.length > 0) {
        // if indexes exist, we can use them.
        var sortedIndexes = indexes.slice(0).sort();

        for (var i = 0; i < sortedIndexes.length; i++) {
          var currentIndex = sortedIndexes[i];
          var originalIndex = indexes.indexOf(currentIndex);

          self._treeData.splice(currentIndex, 0, data[originalIndex]);

          self._treeMetadata.splice(currentIndex, 0, metadata[originalIndex]);

          self._treeKeyMap.splice(currentIndex, 0, keys[originalIndex]);
        }

        if (addBeforeKeys == null || addBeforeKeys.length == 0) {
          addBeforeKeys = [];

          for (var _i2 = 0; _i2 < indexes.length; _i2++) {
            var beforeKey = indexes[_i2] + 1 < self._treeKeyMap.length ? self._treeKeyMap[indexes[_i2] + 1] : null;
            addBeforeKeys.push(beforeKey);
          }
        }
      } else if (addBeforeKeys != null && addBeforeKeys.length > 0) {
        // if addBeforeKeys are provided, we should be able to insert the new keys with them
        var currentKeys = keys.slice(0);
        var currentMetadatas = metadata.slice(0);
        var currentDatas = data.slice(0);
        var currentBeforeKeys = addBeforeKeys.slice(0);

        while (currentBeforeKeys.length > 0) {
          var currentBeforeKey = currentBeforeKeys[0];
          var currentKey = currentKeys[0];
          var currentMetadata = currentMetadatas[0];
          var currentData = currentDatas[0];

          var previousIndex = self._treeKeyMap.indexOf(currentBeforeKey);

          if (previousIndex != -1) {
            // currentBeforeKey exists
            self._treeData.splice(previousIndex, 0, currentData);

            self._treeMetadata.splice(previousIndex, 0, currentMetadata);

            self._treeKeyMap.splice(previousIndex, 0, currentKey);
          } else {
            // currentBeforeKey doesn't exist, so put it at the end
            // since it must be a new key
            currentKeys.push(currentKey);
            currentMetadatas.push(currentMetadata);
            currentDatas.push(currentData);
            currentBeforeKeys.push(currentBeforeKey);
          } // delete current key


          currentKeys.splice(0, 1);
          currentBeforeKeys.splice(0, 1);
          currentMetadatas.splice(0, 1);
          currentDatas.splice(0, 1);
        }
      } else {
        // Don't have addBeforeKeys or indexes.
        // Insert items based on sort comparator
        var orderedData = [];
        var orderedMetaData = [];
        var orderedKeys = [];
        var counter = 0;
        var added = false; // order the incoming data reverse chronologically

        data.forEach(function (value, ind) {
          added = false;

          if (orderedData.length != 0) {
            while (counter < orderedData.length && !added) {
              if (self.sortComparator(value, orderedData[counter])) {
                orderedData.splice(counter, 0, value);
                orderedMetaData.splice(counter, 0, metadata[ind]);
                orderedKeys.splice(counter, 0, keys[ind]);
                added = true;
              } else {
                counter++;
              }
            }
          }

          if (!added) {
            orderedData.push(value);
            orderedMetaData.push(metadata[ind]);
            orderedKeys.push(keys[ind]);
          }
        }); // add the new data/metadata/key in

        counter = self._treeData.length - 1;
        var addBeforeKeysMap = {};
        orderedData.forEach(function (value, ind) {
          var newData = value;
          var newMetadata = orderedMetaData[ind];
          var newKey = orderedKeys[ind];
          added = false;

          while (counter >= 0 && !added) {
            if (self.sortComparator(newData, self._treeData[counter])) {
              if (counter + 1 != self._treeData.length) {
                self._treeData.splice(counter + 1, 0, newData);

                self._treeMetadata.splice(counter + 1, 0, newMetadata);

                addBeforeKeysMap[self._getId(newData)] = self._treeKeyMap[counter + 1];

                self._treeKeyMap.splice(counter + 1, 0, newKey);
              } else {
                self._treeData.push(newData);

                self._treeMetadata.push(newMetadata);

                addBeforeKeysMap[self._getId(newData)] = null;

                self._treeKeyMap.push(newKey);
              }

              added = true;
            } else {
              counter--;
            }
          }

          if (!added) {
            self._treeData.splice(0, 0, newData);

            self._treeMetadata.splice(0, 0, newMetadata);

            addBeforeKeysMap[self._getId(newData)] = self._treeKeyMap[0];

            self._treeKeyMap.splice(0, 0, newKey);

            counter = 0;
          }
        });
        addBeforeKeys = [];
        data.forEach(function (value) {
          addBeforeKeys.push(addBeforeKeysMap[self._getId(value)]);
        });
      }

      return addBeforeKeys;
    }
  }, {
    key: "_handleAdd",
    value: function _handleAdd(event) {
      var self = this;
      var newData = []; // add the new data, metadata, keys into treeData, treeMetadata, treeKeyMap

      var addBeforeKeys = self._addData(event); // Make sure addBeforeKeys = [] case is also covered


      if (!event.addBeforeKeys || event.addBeforeKeys.length == 0) {
        event.addBeforeKeys = addBeforeKeys;
      }

      event.keys.forEach(function (key) {
        var i = newData.length;
        var itemData = event.data[i];
        var addBeforeKey = addBeforeKeys[i];
        newData.push({
          addBeforeKey: addBeforeKey,
          key: key,
          data: itemData
        });
      });
      var parentKeys = [];
      var newAddedSections = [];
      var keepInd = [];

      var indexMap = this._getIndexFromKeys(event.keys); // Make sure indexes = [] case is also covered


      if (!event.indexes || event.indexes.length == 0) {
        event.indexes = [];
      }

      event.data.forEach(function (value, ind) {
        var sectionLabel = self._groupingFunction(value);

        var sectionId = self._getSectionKeyFromArray(sectionLabel);

        var previousSectionId;
        var nextSectionId;

        if (!(sectionId in self._sections && self._sections[sectionId].active)) {
          // New Section
          if (indexMap[ind] != 0) {
            previousSectionId = self._getSectionKeyFromArray(self._groupingFunction(self._treeData[indexMap[ind] - 1]));
            nextSectionId = self._sections[previousSectionId].nextLeaf;
          } else {
            previousSectionId = null;
          }

          if (indexMap[ind] + 1 < self._treeData.length && previousSectionId == null) {
            // This should be a new section in front
            nextSectionId = self._currentFirstSection;
          }

          self._createNewSection(sectionId, true, sectionLabel, previousSectionId, nextSectionId);

          sectionId = self._getSectionKeyFromArray(sectionLabel);
          newAddedSections.push(sectionId);
        } else if (newAddedSections.indexOf(sectionId) === -1) {
          keepInd.push(ind);
        }

        var childrenArray = self._sections[sectionId].children;
        var childDataArray = self._sections[sectionId].childData;
        previousSectionId = self._sections[sectionId].previousLeaf;
        var previousCutoffIndex = 0;

        if (previousSectionId != null) {
          previousCutoffIndex = self._sections[previousSectionId].cutoffIndex();
        }

        childrenArray.splice(indexMap[ind] - previousCutoffIndex, 0, value);
        childDataArray.splice(indexMap[ind] - previousCutoffIndex, 0, self.sectionRenderer(value));
        parentKeys.push(sectionId);
        event.indexes[ind] = indexMap[ind] - previousCutoffIndex;

        if (event.addBeforeKeys[ind] != null && ind == event.data.length - 1) {
          var addBeforeDataSection = self._getSectionKeyFromArray(self._groupingFunction(self._treeData[self._treeKeyMap.indexOf(event.addBeforeKeys[ind])]));

          if (addBeforeDataSection != sectionId) {
            // For each new add event, we need to check the last addBeforeKeys
            // If the key and addBeforeKey are in two different sections
            // addBeforeKeys should be null
            event.addBeforeKeys[ind] = null;
          }
        }
      });
      event.parentKeys = parentKeys; // If we need to create any new Sections, skip events that pertain to the new Section

      if (newAddedSections.length > 0) {
        var counter = 0;
        var _newData = [];
        var newKeys = [];
        var newMetadata = [];
        var newParentKeys = [];
        var newIndexes = [];
        var newAddBeforeKeys = [];
        event.keys.forEach(function (value) {
          if (keepInd.indexOf(counter) != -1) {
            newKeys.push(value);

            _newData.push(event.data[counter]);

            newMetadata.push(event.metadata[counter]);
            newParentKeys.push(event.parentKeys[counter]);
            newIndexes.push(event.indexes[counter]);
            newAddBeforeKeys.push(event.addBeforeKeys[counter]);
          }

          counter++;
        });

        if (newKeys.length > 0) {
          event = {
            data: _newData,
            keys: new Set(newKeys),
            metadata: newMetadata,
            parentKeys: newParentKeys,
            indexes: newIndexes,
            addBeforeKeys: newAddBeforeKeys
          };
        } else {
          event = null;
        }
      }

      return event;
    }
  }, {
    key: "_handleRemove",
    value: function _handleRemove(event) {
      // remove data entries from our internal data array
      // remove unneeded keys from our mapping
      var self = this;

      var indexMap = this._getIndexFromKeys(event.keys);

      this._removeKeys(event.keys);

      var removeDataIndex = [];
      var removeIndex = [];

      for (var ind = 0; ind < indexMap.length; ind++) {
        var updateInd = indexMap[ind];
        var item = self._treeData[updateInd];

        var sectionId = self._getSectionKeyFromArray(self._groupingFunction(item));

        var previousSectionId = self._sections[sectionId].previousLeaf;
        var previousCutoffIndex = 0;

        if (previousSectionId != null) {
          previousCutoffIndex = self._sections[previousSectionId].cutoffIndex();
        }

        removeDataIndex.push({
          ind: updateInd - previousCutoffIndex,
          sectionId: sectionId
        });
        removeIndex.push(updateInd);
      }

      removeDataIndex.sort(function (a, b) {
        return b.ind - a.ind;
      });
      removeIndex.sort(function (a, b) {
        return b - a;
      });

      for (var i = 0; i < removeDataIndex.length; i++) {
        var _sectionId = removeDataIndex[i].sectionId;
        var dataArray = self._sections[_sectionId].children;
        dataArray.splice(removeDataIndex[i].ind, 1); // Remove Section since doesn't exist anymore

        if (dataArray().length === 0) {
          this._removeSection(_sectionId);
        }

        self._treeData.splice(removeIndex[i], 1);

        self._treeMetadata.splice(removeIndex[i], 1);
      }
    }
  }, {
    key: "_handleUpdate",
    value: function _handleUpdate(event) {
      // need to update our internal data array with the new data
      var self = this;

      var indexMap = this._getIndexFromKeys(event.keys);

      event.data.forEach(function (value, ind) {
        var updateInd = indexMap[ind];
        var item = self._treeData[updateInd];

        var sectionId = self._getSectionKeyFromArray(self._groupingFunction(item));

        var dataArray = self._sections[sectionId].children;
        var previousSectionId = self._sections[sectionId].previousLeaf;
        var previousCutoffIndex = 0;

        if (previousSectionId != null) {
          previousCutoffIndex = self._sections[previousSectionId].cutoffIndex();
        }

        dataArray.splice(updateInd - previousCutoffIndex, 1, value);
        self._treeData[updateInd] = value;
      });
    }
  }, {
    key: "_getCutoffIndex",
    value: function _getCutoffIndex(sectionKey) {
      if (sectionKey != null) {
        return this._sections[sectionKey].cutoffIndex();
      }

      return 0;
    }
  }, {
    key: "_getIndexFromKeys",
    value: function _getIndexFromKeys(keys) {
      var self = this;
      var indexMap = [];
      keys.forEach(function (key) {
        indexMap.push(self._treeKeyMap.indexOf(key));
      });
      return indexMap;
    }
  }, {
    key: "_removeKeys",
    value: function _removeKeys(keys) {
      // Remove unneeded key/index mappings.
      var self = this;
      keys.forEach(function (key) {
        self._treeKeyMap.splice(self._treeKeyMap.indexOf(key), 1);
      });
    }
  }, {
    key: "_cleanEvent",
    value: function _cleanEvent(event) {
      var indexMap = this._getIndexFromKeys(event.keys);

      var keyIndex = 0;
      event.keys.forEach(function (val) {
        if (indexMap[keyIndex] == -1) {
          // key is not in the set, so ignore it
          event.keys.delete(val);
        }

        keyIndex++;
      }); // remove optional elements if they exist

      for (var ind = indexMap.length - 1; ind >= 0; ind--) {
        if (indexMap[ind] == -1) {
          if (event.data) {
            event.data.splice(ind, 1);
          }

          if (event.indexes) {
            event.indexes.splice(ind, 1);
          }

          if (event.metadata) {
            event.metadata.splice(ind, 1);
          }
        }
      }

      return event;
    }
  }, {
    key: "_cleanAddEvent",
    value: function _cleanAddEvent(event) {
      var self = this;
      var addBeforeKeys = event.addBeforeKeys;
      var indexes = event.indexes;
      var keys = [];
      var cleanItems = []; // get key array

      event.keys.forEach(function (key) {
        keys.push(key);
      });

      if (indexes != null) {
        // if indexes exist, we can use them.
        var sortedIndexes = indexes.slice(0).sort();

        for (var i = 0; i < sortedIndexes.length; i++) {
          var currentIndex = sortedIndexes[i];
          var originalIndex = indexes.indexOf(currentIndex); // check total length + all newly added items

          if (self._treeData.length + i - cleanItems.length < currentIndex) {
            // currentIndex is out of scope, add it to the cleanItems for removal
            cleanItems.push(originalIndex);
          }
        }
      } else if (addBeforeKeys != null) {
        // check each addBeforeKeys. If an addBeforeKey value is not
        // in treeKeyMap, and is also not in event.keys, it is out of scope
        var sortedKeys = addBeforeKeys.slice(0).sort();

        for (var _i3 = 0; _i3 < sortedKeys.length; _i3++) {
          var currentKey = sortedKeys[_i3];
          var originalKeyIndex = addBeforeKeys.indexOf(currentKey);

          if (self._treeKeyMap.indexOf(currentKey) == -1 && keys.indexOf(currentKey) == -1) {
            cleanItems.push(originalKeyIndex);
          } else if (self._treeKeyMap.indexOf(currentKey) == -1 && keys.indexOf(currentKey) != -1 && cleanItems.indexOf(keys.indexOf(currentKey)) == -1) {
            // If addBeforeKey value is in event.keys, but that key
            // belongs to an out of scope value already, it is also out of scope
            cleanItems.push(originalKeyIndex);
          }
        }
      }

      var keyIndex = 0;
      event.keys.forEach(function (val) {
        if (cleanItems.indexOf(keyIndex) != -1) {
          // key is not in the set, so ignore it
          event.keys.delete(val);
        }

        keyIndex++;
      });
      var sortedCleanItems = cleanItems.splice(0).sort(); // remove optional elements if they exist

      for (var ind = sortedCleanItems.length - 1; ind >= 0; ind--) {
        if (event.data) {
          event.data.splice(sortedCleanItems[ind], 1);
        }

        if (event.indexes) {
          event.indexes.splice(sortedCleanItems[ind], 1);
        }

        if (event.metadata) {
          event.metadata.splice(sortedCleanItems[ind], 1);
        }

        if (event.parentKeys) {
          event.parentKeys.splice(sortedCleanItems[ind], 1);
        }

        if (event.addBeforeKeys) {
          event.addBeforeKeys.splice(sortedCleanItems[ind], 1);
        }
      }

      return event;
    }
  }, {
    key: "_addEventListeners",
    value: function _addEventListeners(dataprovider) {
      var self = this;
      dataprovider.addEventListener('refresh', function (event) {
        self._initialize();

        self.dispatchEvent(new oj.DataProviderRefreshEvent());
      });
      dataprovider.addEventListener('mutate', function (event) {
        // For now assume that mutation events have event.keys and event.data
        // We can handle no data events later (e.g. perform fetchByKeys extra step)
        // convert add event to update event
        if (event.detail.add) {
          event.detail.add = self._cleanAddEvent(event.detail.add);

          if (event.detail.add.keys.size != 0) {
            event.detail.add = self._handleAdd(event.detail.add);

            self._storedAddSection.forEach(function (addEvent) {
              self.dispatchEvent(addEvent);
            });

            if (event.detail.add) {
              self.dispatchEvent(event);
            }

            self._storedAddSection = [];
            self._storedAddSectionKeys = [];
          }
        }

        if (event.detail.remove || event.detail.update) {
          if (event.detail.remove) {
            event.detail.remove = self._cleanEvent(event.detail.remove);

            if (event.detail.remove.keys.size != 0) {
              self._handleRemove(event.detail.remove);

              self.dispatchEvent(event);
            }
          }

          if (event.detail.update) {
            event.detail.update = self._cleanEvent(event.detail.update);

            if (event.detail.update.keys.size != 0) {
              self._handleUpdate(event.detail.update);

              self.dispatchEvent(event);
            }
          }
        }

        self._storedRemoveSection.forEach(function (removeEvent) {
          self.dispatchEvent(removeEvent);
        });

        self._storedRemoveSection = [];
      });
    }
  }]);

  return GroupingDataProvider;
}();

oj.GroupingDataProvider = GroupingDataProvider;
oj['GroupingDataProvider'] = GroupingDataProvider;
oj.EventTargetMixin.applyMixin(GroupingDataProvider);



/* jslint browser: true,devel:true*/

/**
 *
 * @export
 * @final
 * @class oj.GroupingDataProvider
 * @implements oj.TreeDataProvider
 * @classdesc This class implements {@link oj.TreeDataProvider}.
 *            Wraps a flat {@link oj.DataProvider} and groups the contents into tree data.
 * @param {oj.DataProvider} dataProvider The {@link oj.DataProvider} to be wrapped.
 *                                      <p>This DataProvider must provide flat data that are sorted in some order.</p>
 * @param {function(D, D): boolean} sortComparator The sort comparator function.
 *                                      <p>Given two data points, the sortComparator will return true if data2 should be sorted before data1
 *                                        and false if data2 should be sorted after data1</p>
 * @param {function(K): D} sectionRenderer The section renderer function
 *                                      <p>This function takes in a section key and returns data that will be provided to the view.
 *                                      </p>
 * @param {Object=} options the optional parameters.
 * @param {function(D):Array.<string>=} options.groupByStrategy The grouping mechanism.
 *                                      <p>Optional grouping mechanism. This allows for either a grouping function
 *                                      that will take in data and return a path Array of section keys from the root node
 *                                      to the item. The grouping mechanism can also be a string attribute of the data
 *                                      that will contain the path Array of section keys.</p>
 * @param {(string | Array.<string>)=} options.keyAttributes Optional attribute name(s) which stores the key in the data.
 *                                      <p>Can be a string denoting a single key attribute or an array
 *                                      of strings for multiple key attributes.  Dot notation can be used to specify nested attribute (e.g. 'attr.id').<br><br>
 *                                      If specified, caller must ensure that the keyAttributes contains values that are either unique within the entire tree,
 *                                      or unique among the siblings of each node.  In the latter case, Caller must also set the keyAttributesScope option to 'siblings'.<br>
 *                                      If keyAttributes is specified and keyAttributesScope is 'global', the attribute value will be used as the key.<br>
 *                                      If keyAttributes is specified and keyAttributesScope is 'siblings', a path array of the attribute values,
 *                                      starting from the root node, will be used as the key.<br>
 *                                      If keyAttributes is not specified, a path array of node index, starting from the root node, will be used as the key.</p>
 *
 * @ojsignature [{target: "Type",
 *               value: "class GroupingDataProvider<K, D> implements TreeDataProvider<K, D>"},
 *               {target: "Type",
 *               value: "DataProvider<K, D>",
 *               for: "dataProvider"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 * "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
 * "FetchListResult","FetchListParameters"]}
 * @ojtsimport {module: "ojtreedataprovider", type: "AMD", importName: "TreeDataProvider"}
 * @ojtsimport {module: "ojarraydataprovider", type: "AMD", importName: "ArrayDataProvider"}
 * @ojtsmodule
 */

/**
 * Check if rows are contained by keys (default: local dataset)
 * FetchByKeysParameter scope may be set to "global" to check in global dataset
 *
 *
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.ContainsKeysResults>} Promise which resolves to {@link oj.ContainsKeysResults}
 * @export
 * @expose
 * @memberof oj.GroupingDataProvider
 * @instance
 * @method
 * @name containsKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>"}
 */

/**
 * Fetch rows by keys (default: local dataset)
 *
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.FetchByKeysResults>} Promise which resolves to {@link oj.FetchByKeysResults}
 * @export
 * @expose
 * @memberof oj.GroupingDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>"}
 */

/**
 * Fetch rows by offset.
 *
 *
 * @param {oj.FetchByOffsetParameters} params Fetch by offset parameters
 * @return {Promise.<oj.FetchByOffsetResults>} Promise which resolves to {@link oj.FetchByOffsetResults}
 * @export
 * @expose
 * @memberof oj.GroupingDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>"}
 */

/**
 * Fetch the first block of data.
 *
 * @param {oj.FetchListParameters=} params Fetch parameters
 * @return {AsyncIterable.<oj.FetchListResult>} AsyncIterable with {@link oj.FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof oj.GroupingDataProvider
 * @instance
 * @method
 * @name fetchFirst
 * @ojsignature {target: "Type",
 *               value: "(params?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>"}
 */

/**
 * Determines whether this DataProvider supports certain feature.
 *
 * @param {string} capabilityName capability name. Supported capability names are:
 *                  "fetchByKeys", "fetchByOffset", and "sort".
 * @return {Object} capability information or null if unsupported
 * <ul>
 *   <li>If capabilityName is "fetchByKeys", returns a {@link oj.FetchByKeysCapability} object.</li>
 *   <li>If capabilityName is "fetchByOffset", returns a {@link oj.FetchByOffsetCapability} object.</li>
 *   <li>If capabilityName is "sort", returns a {@link oj.SortCapability} object.</li>
 * </ul>
 * @export
 * @expose
 * @memberof oj.GroupingDataProvider
 * @instance
 * @method
 * @name getCapability
 * @ojsignature {target: "Type",
 *               value: "(capabilityName?: string): any"}
 */

/**
 * Gets the total size of the data set
 *
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows.
 * @export
 * @expose
 * @memberof oj.GroupingDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * Return a string that indicates if this data provider is empty
 *
 * @return {"yes"|"no"|"unknown"} a string that indicates if this data provider is empty. Valid values are:
 *                  "yes": this data provider is empty.
 *                  "no": this data provider is not empty.
 *                  "unknown": it is not known if this data provider is empty until a fetch is made.
 * @export
 * @expose
 * @memberof oj.GroupingDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * Get a data provider for the children of the row identified by parentKey.
 *
 *
 * @param {any} parentKey key of the row to get child data provider for.
 * @return {TreeDataProvider | null} An TreeDataProvider if the row can (but doesn't have to) have children; or null if the row cannot have children.
 *   Use the <code class="prettyprint">isEmpty</code> method on the returned TreeDataProvider to determine if it currently has children.
 * @export
 * @expose
 * @memberof oj.GroupingDataProvider
 * @instance
 * @method
 * @name getChildDataProvider
 * @ojsignature {target: "Type",
 *               value: "(parentKey: any): GroupingDataProvider<K, D>"}
 */

/**
 * Add a callback function to listen for a specific event type.
 *
 *
 * @export
 * @expose
 * @memberof oj.GroupingDataProvider
 * @instance
 * @method
 * @name addEventListener
 * @param {string} eventType The event type to listen for.
 * @param {EventListener} listener The callback function that receives the event notification.
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * Remove a listener previously registered with addEventListener.
 *
 *
 * @export
 * @expose
 * @memberof oj.GroupingDataProvider
 * @instance
 * @method
 * @name removeEventListener
 * @param {string} eventType The event type that the listener was registered for.
 * @param {EventListener} listener The callback function that was registered.
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * Dispatch an event and invoke any registered listeners.
 *
 *
 * @export
 * @expose
 * @memberof oj.GroupingDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 * @param {Event} event The event object to dispatch.
 * @return {boolean} Return false if a registered listener has cancelled the event. Return true otherwise.
 * @ojsignature {target: "Type",
 *               value: "(evt: Event): boolean"}
 */

/**
 * End of jsdoc
 */

  return GroupingDataProvider;
});