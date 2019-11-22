/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojarraydataprovider', 'ojs/ojeventtarget', 'ojs/ojtreedataprovider'], function(oj, $, ko)
{
  "use strict";
  var ArrayDataProvider = oj['ArrayDataProvider'];

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ArrayTreeDataProvider =
/*#__PURE__*/
function () {
  function ArrayTreeDataProvider(treeData, options, _rootDataProvider) {
    _classCallCheck(this, ArrayTreeDataProvider);

    this.treeData = treeData;
    this.options = options;
    this._rootDataProvider = _rootDataProvider;

    this.TreeAsyncIterator =
    /*#__PURE__*/
    function () {
      function _class(_parent, _baseIterable) {
        _classCallCheck(this, _class);

        this._parent = _parent;
        this._baseIterable = _baseIterable;
      }

      _createClass(_class, [{
        key: 'next',
        value: function next() {
          var self = this;
          return this._baseIterable[Symbol.asyncIterator]().next().then(function (result) {
            var metadata = result.value.metadata;

            for (var i = 0; i < metadata.length; i++) {
              // Replace flat array metadata with tree array metadata 
              metadata[i] = self._parent._getNodeMetadata(result.value.data[i]);
            }

            return result;
          });
        }
      }]);

      return _class;
    }();

    this.TreeAsyncIterable =
    /*#__PURE__*/
    function () {
      function _class2(_parent, _asyncIterator) {
        _classCallCheck(this, _class2);

        this._parent = _parent;
        this._asyncIterator = _asyncIterator;

        this[Symbol.asyncIterator] = function () {
          return this._asyncIterator;
        };
      }

      return _class2;
    }();

    this._baseDataProvider = new oj['ArrayDataProvider'](treeData, options);
    this._mapKeyToNode = new Map();
    this._mapNodeToKey = new Map();
    this._mapArrayToSequenceNum = new Map();
    this._mapKoArrayToSubscriptions = new Map(); // Subscribe to all children observableArray at the top-level

    if (_rootDataProvider == null) {
      this._processTreeArray(treeData, []);
    }
  }

  _createClass(ArrayTreeDataProvider, [{
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
          'containsParameters': params,
          'results': results
        });
      });
    }
  }, {
    key: "getCapability",
    value: function getCapability(capabilityName) {
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
    value: function getChildDataProvider(parentKey, options) {
      var node = this._getNodeForKey(parentKey);

      if (node) {
        var children = this._getChildren(node);

        if (children) {
          var childDataProvider = new ArrayTreeDataProvider(children, this.options, this._getRootDataProvider());
          return childDataProvider;
        }
      }

      return null;
    }
  }, {
    key: "fetchFirst",
    value: function fetchFirst(params) {
      if (params && params.filterCriterion) {
        var paramsClone = $.extend({}, params);
        paramsClone.filterCriterion = this._getLeafNodeFilter(paramsClone.filterCriterion);
        paramsClone.filterCriterion.filter = params.filterCriterion.filter;
        params = paramsClone;
      }

      var baseIterable = this._baseDataProvider.fetchFirst(params);

      return new this.TreeAsyncIterable(this, new this.TreeAsyncIterator(this, baseIterable));
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
            'data': data,
            'metadata': metadata
          });
        }

        return {
          'done': result['done'],
          'fetchParameters': result['fetchParameters'],
          'results': newResults
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
            'metadata': {
              'key': key
            },
            'data': node
          });
        }
      });
      return Promise.resolve({
        'fetchParameters': params,
        'results': results
      });
    }
  }, {
    key: "_getChildren",
    value: function _getChildren(node) {
      var childrenAttr = this.options && this.options['childrenAttribute'] ? this.options['childrenAttribute'] : 'children'; // Pass true to _getVal so that we keep observableArray children in the same form 

      return this._getVal(node, childrenAttr, true);
    }
  }, {
    key: "_getRootDataProvider",
    value: function _getRootDataProvider() {
      if (this._rootDataProvider) {
        return this._rootDataProvider;
      } else {
        return this;
      }
    }
  }, {
    key: "_subscribeObservableArray",
    value: function _subscribeObservableArray(treeData, parentKeyPath) {
      if (!(ko.isObservable(treeData) && !(treeData['destroyAll'] === undefined))) {
        // we only support Array or ko.observableArray
        throw new Error('Invalid data type. ArrayTreeDataProvider only supports Array or observableArray.');
      }

      var self = this;
      var mutationEvent = null;
      var subscriptions = new Array(2); // subscribe to observableArray arrayChange event to get individual updates

      subscriptions[0] = treeData['subscribe'](function (changes) {
        var i,
            id,
            dataArray = [],
            keyArray = [],
            indexArray = [],
            metadataArray = [];
        var j, index;
        var updatedIndexes = [];
        var operationUpdateEventDetail = null;
        var operationAddEventDetail = null;
        var operationRemoveEventDetail = null; // squash deletes and adds into updates

        var removeDuplicate = [];

        for (i = 0; i < changes.length; i++) {
          index = changes[i].index;
          status = changes[i].status;

          var iKey = self._getId(changes[i].value);

          if (iKey) {
            for (j = 0; j < changes.length; j++) {
              if (j != i && index === changes[j].index && status !== changes[j]['status'] && updatedIndexes.indexOf(i) < 0 && removeDuplicate.indexOf(i) < 0) {
                // Squash delete and add only if they have the same index and same key
                var jKey = self._getId(changes[j].value);

                if (oj.Object.compareValues(iKey, jKey)) {
                  if (status === 'deleted') {
                    removeDuplicate.push(i);
                    updatedIndexes.push(j);
                  } else {
                    removeDuplicate.push(j);
                    updatedIndexes.push(i);
                  }
                }
              }
            }
          }
        } // Prepare the "remove" event detail


        for (i = 0; i < changes.length; i++) {
          if (changes[i]['status'] === 'deleted' && updatedIndexes.indexOf(i) < 0 && removeDuplicate.indexOf(i) < 0) {
            var node = changes[i].value;

            var key = self._getKeyForNode(node);

            keyArray.push(key);
            dataArray.push(node);
            indexArray.push(changes[i].index);

            self._releaseNode(node);
          }
        }

        if (keyArray.length > 0) {
          metadataArray = keyArray.map(function (value) {
            return {
              'key': value
            };
          });
          var keySet = new Set();
          keyArray.map(function (key) {
            keySet.add(key);
          });
          operationRemoveEventDetail = {
            data: dataArray,
            indexes: indexArray,
            keys: keySet,
            metadata: metadataArray
          };
        } // Preprocessing for the "add" and "update" event detail


        dataArray = [], keyArray = [], indexArray = [], metadataArray = [];
        var nodeArray = treeData();
        var updateKeyArray = [],
            updateDataArray = [],
            updateIndexArray = [],
            updateMetadataArray = [];

        for (i = 0; i < changes.length; i++) {
          if (changes[i]['status'] === 'added' && removeDuplicate.indexOf(i) < 0) {
            var _node = changes[i].value;

            var keyObj = self._processNode(_node, parentKeyPath, treeData);

            if (updatedIndexes.indexOf(i) < 0) {
              keyArray.push(keyObj.key);
              dataArray.push(_node);
              indexArray.push(changes[i].index);
              metadataArray.push({
                key: keyObj.key
              });
            } else {
              updateKeyArray.push(keyObj.key);
              updateDataArray.push(_node);
              updateIndexArray.push(changes[i].index);
              updateMetadataArray.push({
                key: keyObj.key
              });
            }
          }
        } // Prepare the "add" event detail


        if (keyArray.length > 0) {
          var _keySet = new Set();

          keyArray.map(function (key) {
            _keySet.add(key);
          });
          var afterKeySet = new Set();
          var afterKeyArray = [];
          var parentKeyArray = [];
          var parentKey;

          if (self.options && self.options.keyAttributes && self.options.keyAttributesScope !== 'siblings') {
            // For global key, the last part of the parentKeyPath is the parent key
            parentKey = parentKeyPath.length > 0 ? parentKeyPath[parentKeyPath.length - 1] : null;
          } else {
            // For non-global key, the entire parentKeyPath is the parent key
            parentKey = parentKeyPath.length > 0 ? parentKeyPath : null;
          }

          indexArray.map(function (addIndex) {
            var afterKey;

            if (addIndex >= nodeArray.length - 1) {
              afterKey = '';
            } else {
              afterKey = self._getKeyForNode(nodeArray[addIndex + 1]);
            }

            afterKeySet.add(afterKey);
            afterKeyArray.push(afterKey);
            parentKeyArray.push(parentKey);
          });
          operationAddEventDetail = {
            afterKeys: afterKeySet,
            addBeforeKeys: afterKeyArray,
            parentKeys: parentKeyArray,
            data: dataArray,
            indexes: indexArray,
            keys: _keySet,
            metadata: metadataArray
          };
        } // Prepare the "update" event detail


        if (updateKeyArray.length > 0) {
          var updateKeySet = new Set();
          updateKeyArray.map(function (key) {
            updateKeySet.add(key);
          });
          operationUpdateEventDetail = {
            data: updateDataArray,
            indexes: updateIndexArray,
            keys: updateKeySet,
            metadata: updateMetadataArray
          };
        }

        mutationEvent = new oj.DataProviderMutationEvent({
          add: operationAddEventDetail,
          remove: operationRemoveEventDetail,
          update: operationUpdateEventDetail
        });
      }, null, 'arrayChange');
      subscriptions[1] = treeData['subscribe'](function (changes) {
        if (mutationEvent) {
          self.dispatchEvent(mutationEvent);
        } else {
          self.dispatchEvent(new oj.DataProviderRefreshEvent());
        }

        mutationEvent = null;
      }, null, 'change');

      this._mapKoArrayToSubscriptions.set(treeData, subscriptions);
    }
  }, {
    key: "_unsubscribeObservableArray",
    value: function _unsubscribeObservableArray(treeData) {
      if (ko.isObservable(treeData) && !(treeData['destroyAll'] === undefined)) {
        var subscriptions = this._mapKoArrayToSubscriptions.get(treeData);

        if (subscriptions) {
          subscriptions[0].dispose();
          subscriptions[1].dispose();

          this._mapKoArrayToSubscriptions.delete(treeData);
        }
      }
    }
    /**
     * If observableArray, then subscribe to it
     */

  }, {
    key: "_processTreeArray",
    value: function _processTreeArray(treeData, parentKeyPath) {
      var self = this;
      var dataArray;

      if (treeData instanceof Array) {
        dataArray = treeData;
      } else {
        this._subscribeObservableArray(treeData, parentKeyPath);

        dataArray = treeData();
      }

      dataArray.forEach(function (node, i) {
        self._processNode(node, parentKeyPath, treeData);
      });
    }
  }, {
    key: "_releaseTreeArray",
    value: function _releaseTreeArray(treeData) {
      var self = this;
      var dataArray;

      if (treeData instanceof Array) {
        dataArray = treeData;
      } else {
        this._unsubscribeObservableArray(treeData);

        dataArray = treeData();
      }

      dataArray.forEach(function (node, i) {
        self._releaseNode(node);
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
    key: "_releaseNode",
    value: function _releaseNode(node) {
      var self = this;

      var key = this._getKeyForNode(node);

      self._deleteMapEntry(key, node);

      var children = self._getChildren(node);

      if (children) {
        self._releaseTreeArray(children);
      }
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
        'key': key,
        'keyPath': keyPath
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
  }, {
    key: "_getVal",

    /**
     * Get value for attribute
     */
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
  }, {
    key: "_getAllVals",

    /**
     * Get all values in a row
     */
    value: function _getAllVals(val) {
      var self = this;
      return Object.keys(val).map(function (key) {
        return self._getVal(val, key);
      });
    }
  }, {
    key: "_getNodeMetadata",
    value: function _getNodeMetadata(node) {
      return {
        'key': this._getKeyForNode(node)
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
    key: "_deleteMapEntry",
    value: function _deleteMapEntry(key, node) {
      var rootDataProvider = this._getRootDataProvider();

      rootDataProvider._mapKeyToNode.delete(JSON.stringify(key));

      rootDataProvider._mapNodeToKey.delete(node);
    }
  }, {
    key: "_incrementSequenceNum",
    value: function _incrementSequenceNum(treeData) {
      var rootDataProvider = this._getRootDataProvider();

      var seqNum = rootDataProvider._mapArrayToSequenceNum.get(treeData) || 0;

      rootDataProvider._mapArrayToSequenceNum.set(treeData, seqNum + 1); // Return the previous sequence number


      return seqNum;
    }
  }, {
    key: "_getLeafNodeFilter",
    value: function _getLeafNodeFilter(filter) {
      var attributeFilter;

      if (filter && filter['text']) {
        var filterValue = new RegExp(filter['text'], 'i');
        attributeFilter = {
          op: '$regex',
          attribute: '*',
          value: filterValue
        };
      } else {
        attributeFilter = filter;
      }

      var childrenAttr = this.options && this.options['childrenAttribute'] ? this.options['childrenAttribute'] : 'children';
      var childrenNull = {
        op: '$ne',
        attribute: childrenAttr,
        value: null
      };
      var childrenUndefined = {
        op: '$ne',
        attribute: childrenAttr,
        value: undefined
      };
      var excludeParentNodeFilter = {
        op: '$and',
        criteria: [childrenNull, childrenUndefined]
      };
      return {
        op: '$or',
        criteria: [attributeFilter, excludeParentNodeFilter]
      };
    }
  }]);

  return ArrayTreeDataProvider;
}();

oj.ArrayTreeDataProvider = ArrayTreeDataProvider;
oj['ArrayTreeDataProvider'] = ArrayTreeDataProvider;
oj.EventTargetMixin.applyMixin(ArrayTreeDataProvider);



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 *
 * @since 5.1.0
 * @export
 * @final
 * @class oj.ArrayTreeDataProvider
 * @implements oj.TreeDataProvider
 * @classdesc This class implements {@link oj.TreeDataProvider} and is used to represent hierachical data available from an array.<br><br>
 *            Each array element represents a tree node, which can contain nested child object array for its subtree.
 *            Array elements can be in any shape and form, but is usually an object with a "children" property.  The name of the "children" property
 *            can optionaly be specified with the "childrenAttribute" option.<br><br>
 *            For nodes that cannot have children, the "children" property should not be set.
 *            For nodes that can but don't have children, the "children" property should be set to an empty array.<br><br>
 *            Data can be passed as a regular array or a Knockout observableArray.  If a Knockout observableArray is
 *            used, any mutation must be performed with observableArray methods.  The events described below will be dispatched to the ArrayTreeDataProvider
 *            with the appropriate event payload.<br><br>
 *            Filtering is supported and, by default, applied only on leaf nodes. Empty tree nodes are not collapsed. The filtering on leaf nodes only works
 *            by combining the passed in filter definition with an OR expression of the "children" property to determine if a node
 *            is a tree or leaf. Therefore, if users want to customize this to include filtering on tree nodes as well, then a custom filter()
 *            function can be specified which excludes tree nodes.
 *
 *
 * <h3 id="events-section">
 *   Events
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
 * </h3>
 * Consumers can add event listeners to listen for the following event types and respond to data change.
 * Event listeners should be added to the root-level ArrayTreeDataProvider created by the application. The root-level ArrayTreeDataProvider receives events for the entire tree.
 * Child-level ArrayTreeDataProvider returned by getChildDataProvider does not receive events.
 * <h4 id="event:mutate" class="name">
 *   mutate
 * </h4>
 * This event is fired when items have been added or removed from the data.
 * <p>
 * Event payload is found under <code class="prettyprint">event.detail</code>, which implements the {@link oj.DataProviderMutationEventDetail} interface.
 * </p>
 *
 * <h4 id="event:refresh" class="name">
 *   refresh
 * </h4>
 * This event is fired when the data has been refreshed and components need to re-fetch the data.
 * <p>
 * This event contains no additional event payload.
 * </p>
 *
 * <i>Example of consumer listening for the "mutate" event type:</i>
 * <pre class="prettyprint"><code>var listener = function(event) {
 *   if (event.detail.remove) {
 *     var removeDetail = event.detail.remove;
 *     // Handle removed items
 *   }
 * };
 * dataProvider.addEventListener("mutate", listener);
 * </code></pre>
 *
 * @param {(Array|function():Array)} data data supported by the components
 *                                      <p>This can be either an Array, or a Knockout observableArray.</p>
 * @param {Object=} options Options for the ArrayTreeDataProvider
 * @param {oj.SortComparators=} options.sortComparators Optional {@link oj.sortComparator} to use for sort.
 * @param {Array.<oj.SortCriterion>=} options.implicitSort Optional array of {@link oj.sortCriterion} used to specify sort information when the data loaded into the dataprovider is already sorted.
 * @param {(string | Array.<string>)=} options.keyAttributes Optional attribute name(s) which stores the key in the data. Can be a string denoting a single key attribute or an array
 *                                                         of strings for multiple key attributes.  Dot notation can be used to specify nested attribute (e.g. 'attr.id').<br><br>
 *                      If specified, caller must ensure that the keyAttributes contains values that are either unique within the entire tree,
 *                        or unique among the siblings of each node.  In the latter case, Caller must also set the keyAttributesScope option to 'siblings'.<br>
 *                      If keyAttributes is specified and keyAttributesScope is 'global', the attribute value will be used as the key.<br>
 *                      If keyAttributes is specified and keyAttributesScope is 'siblings', a path array of the attribute values, starting from the root node, will be used as the key.<br>
 *                      If keyAttributes is not specified, a path array of node index, starting from the root node, will be used as the key.
 * @param {('global'|'siblings')=} options.keyAttributesScope Optional scope of the key values in the fields specified by keyAttributes.  Supported values:<br>
 *                                           <ul>
 *                                             <li>'global': the key values are unique within the entire tree.
 *                                             <li>'siblings': the key values are unique among the siblings of each node.
 *                                           </ul>
 *                                           Default is 'global'.
 * @param {string=} options.childrenAttribute Optional field name which stores the children of nodes in the data.  Dot notation can be used to specify nested attribute.
 *                                                  If this is not specified, the default is "children".
 * @ojsignature [{target: "Type",
 *               value: "class ArrayTreeDataProvider<K, D> implements TreeDataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
 *               {target: "Type",
 *               value: "Array<SortCriterion<D>>",
 *               for: "options.implicitSort"},
 *               {target: "Type",
 *               value: "ArrayDataProvider.SortComparators<D>",
 *               for: "options.sortComparators"}]
 * @ojtsimport {module: "ojtreedataprovider", type: "AMD", importName: "TreeDataProvider"}
 * @ojtsimport {module: "ojarraydataprovider", type: "AMD", importName: "ArrayDataProvider"}
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion",
 *   "FetchByKeysParameters","ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters", "FetchByOffsetResults",
 *   "FetchListResult","FetchListParameters"]}
 * @ojtsmodule
 * @example
 * // First initialize the tree data.  This can be defined locally or read from file.
 * var treeData = [
 *                  {"attr": {"id": "dir1", "title": "Directory 1"},
 *                   "children": [
 *                     {"attr": {"id": "subdir1", "title": "Subdirectory 1"},
 *                      "children": [
 *                        {"attr": {"id": "file1", "title": "File 1"}},
 *                        {"attr": {"id": "file2", "title": "File 2"}},
 *                        {"attr": {"id": "file3", "title": "File 3"}}
 *                      ]},
 *                     {"attr": {"id": "subdir2", "title": "Subdirectory 2"},
 *                      "children": []}
 *                   ]},
 *                  {"attr": {"id": "dir2", "title": "Directory 2"},
 *                   "children": [
 *                     {"attr": {"id": "file4", "title": "File 4"}},
 *                     {"attr": {"id": "file5", "title": "File 5"}},
 *                   ]}
 *                ];
 *
 * // Then create an ArrayTreeDataProvider object with the array
 * var dataprovider = new oj.ArrayTreeDataProvider(treeData, {keyAttributes: 'attr.id'});
 */

/**
 * Fetch rows by keys in the entire tree.
 *
 *
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.FetchByKeysResults>} Promise which resolves to {@link oj.FetchByKeysResults}
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>"}
 */

/**
 * Get a data provider for the children of the row identified by parentKey.
 *
 *
 * @param {any} parentKey key of the row to get child data provider for.
 * @return {ArrayTreeDataProvider | null} An ArrayTreeDataProvider if the row can (but doesn't have to) have children; or null if the row cannot have children.
 *   Use the <code class="prettyprint">isEmpty</code> method on the returned ArrayTreeDataProvider to determine if it currently has children.
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name getChildDataProvider
 * @ojsignature {target: "Type",
 *               value: "(parentKey: any): ArrayTreeDataProvider<K, D>"}
 */

/**
 * Check if there are rows containing the specified keys in the entire tree.
 *
 *
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.ContainsKeysResults>} Promise which resolves to {@link oj.ContainsKeysResults}
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name containsKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>"}
 */

/**
 * Fetch rows by offset at the top level.
 *
 *
 * @param {oj.FetchByOffsetParameters} params Fetch by offset parameters
 * @return {Promise.<oj.FetchByOffsetResults>} Promise which resolves to {@link oj.FetchByOffsetResults}
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>"}
 */

/**
 * Fetch the first set of rows at the current level.
 * <p>
 * If <code class="prettyprint">params.sortCriteria</code> is specified, the default sorting algorithm used is natural sort.
 * </p>
 *
 *
 * @param {oj.FetchListParameters=} params Fetch parameters
 * @return {AsyncIterable.<oj.FetchListResult>} AsyncIterable with {@link oj.FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name fetchFirst
 * @ojsignature {target: "Type",
 *               value: "(params?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>"}
 */

/**
 * Determines whether this data provider supports certain feature.
 *
 *
 * @param {string} capabilityName capability name. Supported capability names are:
 *                  "fetchByKeys", "fetchByOffset", and "sort".
 * @return {Object} capability information or null if unsupported
 * <ul>
 *   <li>If capabilityName is "fetchByKeys", returns a {@link oj.FetchByKeysCapability} object.</li>
 *   <li>If capabilityName is "fetchByOffset", returns a {@link oj.FetchByOffsetCapability} object.</li>
 *   <li>If capabilityName is "sort", returns a {@link oj.SortCapability} object.</li>
 *   <li>If capabilityName is "filter", returns a {@link oj.FilterCapability} object.</li>
 * </ul>
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name getCapability
 * @ojsignature {target: "Type",
 *               value: "(capabilityName?: string): any"}
 */

/**
 * Return the total number of rows at the top level.
 *
 *
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows. -1 is unknown row count.
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * Return a string that indicates if this data provider is empty.
 *
 *
 * @return {"yes" | "no" | "unknown"} a string that indicates if this data provider is empty. Valid values are:
 *                  "yes": this data provider is empty.
 *                  "no": this data provider is not empty.
 *                  "unknown": it is not known if this data provider is empty until a fetch is made.
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * Add a callback function to listen for a specific event type.
 *
 *
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
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
 * @memberof oj.ArrayTreeDataProvider
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
 * @memberof oj.ArrayTreeDataProvider
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

  return ArrayTreeDataProvider;
});