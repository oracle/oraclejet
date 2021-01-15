/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import $ from 'jquery';
import { observableArray } from 'knockout';
import ArrayTreeDataProvider from 'ojs/ojarraytreedataprovider';
import ArrayDataProvider from 'ojs/ojarraydataprovider';
import { DataProviderMutationEvent, DataProviderRefreshEvent } from 'ojs/ojdataprovider';
import { EventTargetMixin } from 'ojs/ojeventtarget';
import 'ojs/ojtreedataprovider';
import KeyMap from 'ojs/ojmap';

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

/* jslint browser: true,devel:true*/
/**
 *
 * @export
 * @final
 * @class oj.GroupingDataProvider
 * @implements oj.TreeDataProvider
 * @classdesc This class implements {@link oj.TreeDataProvider}.
 *            Wraps a flat {@link DataProvider} and groups the contents into tree data.
 * @param {DataProvider} dataProvider The {@link DataProvider} to be wrapped.
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

class GroupingDataProvider {
    constructor(dataProvider, sortComparator, sectionRenderer, options) {
        this.dataProvider = dataProvider;
        this.sortComparator = sortComparator;
        this.sectionRenderer = sectionRenderer;
        this.options = options;
        this._getKeyAttribute = function () {
            var keyAttributes = this.options != null ? this.options['keyAttributes'] : null;
            if (!keyAttributes) {
                keyAttributes = 'id';
            }
            return keyAttributes;
        };
        this.GroupAsyncIterator = class {
            constructor(_parent, _baseIterable, _dataprovider, _params) {
                this._parent = _parent;
                this._baseIterable = _baseIterable;
                this._dataprovider = _dataprovider;
                this._params = _params;
            }
            ['next']() {
                let self = this;
                let currentFetchedRootOffset = 0;
                if (self._parent._currentRootSection) {
                    currentFetchedRootOffset = Object.keys(self._parent._sections).indexOf(self._parent._currentRootSection);
                }
                let skipFetch = self._parent._currentBaseOffset < currentFetchedRootOffset;
                return this._parent
                    ._getDataFromDataProvider(this._params, 'root', skipFetch)
                    .then(function () {
                    self._parent._updateSectionIndex();
                    let updatedParams = new self._parent.FetchByOffsetParameters(self._parent, self._parent._currentBaseOffset, self._params.size, self._params.sortCriteria, self._params.filterCriterion);
                    return self._dataprovider.fetchByOffset(updatedParams).then(function (res) {
                        let result = res['results'];
                        let data = result.map(function (value) {
                            return value['data'];
                        });
                        let metadata = result.map(function (value) {
                            return value['metadata'];
                        });
                        for (let i = 0; i < metadata.length; i++) {
                            metadata[i] = self._parent._getNodeMetadata(result[i].data);
                            data[i] = self._parent.sectionRenderer(metadata[i].key);
                        }
                        self._parent._currentBaseOffset = self._parent._currentBaseOffset + data.length;
                        if (res.done && self._parent._dataFetchComplete && data.length == 0) {
                            return Promise.resolve((new self._parent.AsyncIteratorReturnResult(self._parent, (new self._parent.FetchListResult(self._parent, self._params, data, metadata)))));
                        }
                        return Promise.resolve((new self._parent.AsyncIteratorYieldResult(self._parent, (new self._parent.FetchListResult(self._parent, self._params, data, metadata)))));
                    });
                });
            }
        };
        this.TreeAsyncIterator = class {
            constructor(_parent, _isParentSection, _parentKey, _dataprovider, _params) {
                this._parent = _parent;
                this._isParentSection = _isParentSection;
                this._parentKey = _parentKey;
                this._dataprovider = _dataprovider;
                this._params = _params;
                this._parent._registerIteratorOffset(this, this._parentKey, 0);
            }
            ['next']() {
                let self = this;
                let internalOffset = self._parent._getIteratorOffset(self);
                let updatedParams = new self._parent.FetchByOffsetParameters(self._parent, internalOffset.offset, self._params.size, self._params.sortCriteria, self._params.filterCriterion);
                let totalSectionSize = self._parent._sections[self._parentKey].children().length;
                let skipFetch = totalSectionSize - internalOffset.offset > 0;
                return this._parent
                    ._getDataFromDataProvider(this._params, this._parentKey, skipFetch)
                    .then(function (value) {
                    if (value === undefined) {
                        self._parent._updateSectionIndex();
                    }
                    return self._dataprovider.fetchByOffset(updatedParams).then(function (res) {
                        let result = res['results'];
                        let doneValue = res.done;
                        let data = result.map(function (value) {
                            return value['data'];
                        });
                        let metadata = result.map(function (value) {
                            return self._parent._getNodeMetadata(value['data']);
                            ;
                        });
                        if (self._isParentSection) {
                            for (let i = 0; i < metadata.length; i++) {
                                data[i] = self._parent.sectionRenderer(metadata[i].key);
                            }
                        }
                        self._parent._updateIteratorOffset(self, internalOffset.offset + data.length);
                        if (skipFetch && doneValue) {
                            let nextSectionId = self._parent._sections[self._parentKey].next;
                            if (!nextSectionId) {
                                doneValue = false;
                            }
                        }
                        if (doneValue && data.length == 0) {
                            return Promise.resolve((new self._parent.AsyncIteratorReturnResult(self._parent, (new self._parent.FetchListResult(self._parent, self._params, data, metadata)))));
                        }
                        return Promise.resolve((new self._parent.AsyncIteratorYieldResult(self._parent, (new self._parent.FetchListResult(self._parent, self._params, data, metadata)))));
                    });
                });
            }
        };
        this.TreeAsyncIterable = class {
            constructor(_parent, _asyncIterator) {
                this._parent = _parent;
                this._asyncIterator = _asyncIterator;
                this[Symbol.asyncIterator] = function () {
                    return this._asyncIterator;
                };
            }
        };
        this.FetchListParameters = class {
            constructor(_parent, size, sortCriteria, attributes) {
                this._parent = _parent;
                this.size = size;
                this.sortCriteria = sortCriteria;
                this.attributes = attributes;
                this['size'] = size;
                this['sortCriteria'] = sortCriteria;
                this['attributes'] = attributes;
            }
        };
        this.FetchByOffsetParameters = class {
            constructor(_parent, offset, size, sortCriteria, filterCriterion) {
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
        };
        this.FetchListResult = class {
            constructor(_parent, fetchParameters, data, metadata) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.data = data;
                this.metadata = metadata;
                this['fetchParameters'] = fetchParameters;
                this['data'] = data;
                this['metadata'] = metadata;
            }
        };
        this.AsyncIteratorYieldResult = class {
            constructor(_parent, value) {
                this._parent = _parent;
                this.value = value;
                this['value'] = value;
                this['done'] = false;
            }
        };
        this.AsyncIteratorReturnResult = class {
            constructor(_parent, value) {
                this._parent = _parent;
                this.value = value;
                this['value'] = value;
                this['done'] = true;
            }
        };
        this._dataProvider = dataProvider;
        this._addEventListeners(this._dataProvider);
        this._initialize();
    }
    containsKeys(params) {
        let self = this;
        return this.fetchByKeys(params).then(function (fetchByKeysResult) {
            let results = new Set();
            params['keys'].forEach(function (key) {
                if (fetchByKeysResult['results'].get(key) != null) {
                    results.add(key);
                }
            });
            return Promise.resolve({ containsParameters: params, results: results });
        });
    }
    getCapability(capabilityName) {
        if (capabilityName === 'filter') {
            return null;
        }
        return this._baseDataProvider.getCapability(capabilityName);
    }
    getTotalSize() {
        return this._baseDataProvider.getTotalSize();
    }
    isEmpty() {
        return this._baseDataProvider.isEmpty();
    }
    getChildDataProvider(parentKey) {
        let self = this;
        let children = this._getChildren(parentKey);
        let isParentSection = this._isParentSection(parentKey);
        function SectionTreeDataProvider(sections, params) {
            this._parentKey = params.parentKey;
            this._isParentSection = params.isParentSection;
            if (this._isParentSection) {
                this._baseDataProvider = new ArrayDataProvider(sections.childData, {});
                this._baseTreeDataProvider = new ArrayTreeDataProvider(sections.childData, {
                    keyAttributes: params.keyAttributes
                });
            }
            else {
                this._baseDataProvider = new ArrayDataProvider(sections.children, {
                    keyAttributes: params.keyAttributes
                });
                this._baseTreeDataProvider = new ArrayTreeDataProvider(sections.children, {
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
                params = $.extend({}, params);
                params.filterCriterion = null;
            }
            let baseDataProvider = this._baseDataProvider;
            let _isParentSection = this._isParentSection;
            let parentKey = this._parentKey;
            return new self.TreeAsyncIterable(self, new self.TreeAsyncIterator(self, _isParentSection, parentKey, baseDataProvider, params));
        };
        SectionTreeDataProvider.prototype._getId = function (key) {
            return self._getId(key);
        };
        if (children) {
            return new SectionTreeDataProvider(this._sections[parentKey], {
                keyAttributes: this._getKeyAttribute(),
                parentKey: parentKey,
                isParentSection: isParentSection
            });
        }
        return null;
    }
    fetchFirst(params) {
        if (params && params.filterCriterion) {
            params = $.extend({}, params);
            params.filterCriterion = null;
        }
        let self = this;
        let baseIterable = self._baseDataProvider.fetchFirst(params);
        this._initializeTreeCache();
        return new self.TreeAsyncIterable(this, new self.GroupAsyncIterator(this, baseIterable, self._baseDataProvider, params));
    }
    fetchByOffset(params) {
        let basePromise = this._baseDataProvider.fetchByOffset(params);
        let self = this;
        return basePromise.then(function (result) {
            let results = result.results;
            let newResults = [];
            for (let i = 0; i < results.length; i++) {
                let metadata = results[i]['metadata'];
                let data = results[i]['data'];
                metadata = self._getNodeMetadata(data);
                newResults.push({ data: data, metadata: metadata });
            }
            return {
                done: result['done'],
                fetchParameters: result['fetchParameters'],
                results: newResults
            };
        });
    }
    fetchByKeys(params) {
        let self = this;
        let results = new Map();
        params['keys'].forEach(function (key) {
            let node = self._getNodeForKey(key);
            if (node) {
                results.set(key, {
                    metadata: { key: key },
                    data: node
                });
            }
        });
        return Promise.resolve({
            fetchParameters: params,
            results: results
        });
    }
    _getChildren(sectionKey) {
        if (this._sections[sectionKey]) {
            return this._sections[sectionKey].children;
        }
        return null;
    }
    _isParentSection(sectionKey) {
        if (sectionKey in this._sections) {
            let parentSection = this._sections[sectionKey];
            if (parentSection && parentSection.children().length > 0) {
                if (this._sections[parentSection.children()[0]]) {
                    return true;
                }
            }
        }
        return false;
    }
    _initialize() {
        this._mapKeyToNode = new Map();
        this._mapNodeToKey = new KeyMap();
        this._mapArrayToSequenceNum = new Map();
        this._sections = {};
        this._sectionRoots = observableArray();
        this._sectionRootData = observableArray();
        this._dataFetchComplete = false;
        this._internalIterator = null;
        this.treeData = observableArray([]);
        this._initializeTreeCache();
        this._createSections();
        this._storedAddSection = [];
        this._storedAddSectionKeys = [];
        this._storedRemoveSection = [];
        this._baseDataProvider = null;
        this._processSectionsArray([]);
    }
    _initializeTreeCache() {
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
    _registerIteratorOffset(dataprovider, parentKey, initialOffset) {
        this._iteratorOffsets.set(dataprovider, { parentKey: parentKey, offset: initialOffset });
    }
    _getIteratorOffset(dataprovider) {
        return this._iteratorOffsets.get(dataprovider);
    }
    _updateIteratorOffset(dataprovider, newOffset) {
        let originalValue = this._iteratorOffsets.get(dataprovider);
        originalValue.offset = newOffset;
        this._iteratorOffsets.set(dataprovider, originalValue);
    }
    _unregisterIteratorOffset(dataprovider) {
        this._iteratorOffsets.delete(dataprovider);
    }
    _getRootDataProvider() {
        return this;
    }
    _getDataFromDataProvider(params, source, skipFetch) {
        let self = this;
        if (!this._inCurrentFetchingSection(source) || skipFetch) {
            return Promise.resolve(true);
        }
        if (!self._internalIterator) {
            self._internalIterator = this._dataProvider.fetchFirst(params)[Symbol.asyncIterator]();
        }
        let helperFunction = function () {
            return self._internalIterator.next().then(function (result) {
                self._treeData = self._treeData.concat(result['value']['data']);
                self._treeMetadata = self._treeMetadata.concat(result['value']['metadata']);
                result['value']['metadata'].forEach(function (val) {
                    self._treeKeyMap.push(val.key);
                });
                if (result['done']) {
                    self._dataFetchComplete = true;
                }
                else {
                    self._dataFetchComplete = false;
                }
                if (result['done'] ||
                    result['value']['data'].length == result['value']['fetchParameters']['size']) {
                    return;
                }
                return helperFunction();
            });
        };
        return helperFunction();
    }
    _inCurrentFetchingSection(source) {
        if (source === 'root') {
            return true;
        }
        if (this._currentSectionKey == source) {
            return true;
        }
        return false;
    }
    _processSectionsArray(parentKeyPath) {
        let self = this;
        this.treeData().forEach(function (node, i) {
            self._processNode(node, parentKeyPath);
        });
        if (!this._baseDataProvider) {
            this._baseDataProvider = new oj['ArrayDataProvider'](this.treeData, null);
        }
    }
    _processTreeArray(treeData, parentKeyPath) {
        let self = this;
        let dataArray;
        if (treeData instanceof Array) {
            dataArray = treeData;
        }
        else {
            dataArray = treeData();
        }
        dataArray.forEach(function (node, i) {
            self._processNode(node, parentKeyPath);
        });
    }
    _processNode(node, parentKeyPath, nodeKey) {
        let self = this;
        let keyObj = { 'key': null, 'keyPath': null };
        if (nodeKey != null) {
            keyObj.key = nodeKey;
            keyObj.keyPath = parentKeyPath;
            keyObj.keyPath.push(nodeKey);
        }
        else {
            keyObj = self._createKeyObj(node, parentKeyPath, self._treeData);
        }
        self._setMapEntry(keyObj.key, node);
        let children = self._getChildren(node);
        if (children) {
            self._processTreeArray(children, keyObj.keyPath);
        }
        return keyObj;
    }
    _createSections() {
        let self = this;
        if (!this.options || !this.options.groupByStrategy) {
            let cutoffs = [];
            let now = new Date(Date.now());
            cutoffs.push(now);
            let nowTemp = new Date(Date.now());
            let previous1 = nowTemp.setDate(now.getDate() - 1);
            let previous2 = nowTemp.setDate(now.getDate() - 7);
            cutoffs.push(previous1);
            cutoffs.push(previous2);
            nowTemp = new Date(Date.now());
            let previous3 = nowTemp.setMonth(now.getMonth() - 1);
            cutoffs.push(previous3);
            nowTemp = new Date(Date.now());
            let previous4 = nowTemp.setFullYear(now.getFullYear() - 1);
            cutoffs.push(previous4);
            this._groupingFunction = function (item) {
                let labels = [
                    'In the past day',
                    'In the past week',
                    'In the past month',
                    'In the past year',
                    'Earlier'
                ];
                if (item && item['date']) {
                    let date = new Date(item['date']);
                    let counter = 1;
                    while (date < cutoffs[counter] && counter != 5) {
                        counter++;
                    }
                    return [labels[counter - 1]];
                }
                return ['Section 1'];
            };
        }
        else if (typeof this.options.groupByStrategy == 'function') {
            this._groupingFunction = this.options.groupByStrategy;
        }
        else if (typeof this.options.groupByStrategy == 'string') {
            this._groupingFunction = function (item) {
                return self._getVal(item, self.options.groupByStrategy);
            };
        }
        if (this.treeData) {
            this.treeData.valueHasMutated();
        }
    }
    _getSectionKeyFromArray(label) {
        if (label) {
            if (Array.isArray(label) && label.length > 0) {
                return label[label.length - 1];
            }
            else if (typeof label == 'string') {
                return label;
            }
        }
        return null;
    }
    _createNewSection(newSectionKey, needsMutationEvent, sectionMapping, previousKey, nextKey) {
        let self = this;
        let depth = sectionMapping.indexOf(newSectionKey);
        let parentKey = null;
        if (depth != 0) {
            parentKey = sectionMapping[depth - 1];
        }
        let parentSectionChildrenArray;
        let parentSectionChildDataArray;
        let previousLeaf = null;
        let nextLeaf = null;
        let leafNode = depth == this._getDepth(sectionMapping);
        let rootNode = false;
        if (leafNode) {
            previousLeaf = previousKey;
            nextLeaf = nextKey;
        }
        if (parentKey != null) {
            if (!(parentKey in this._sections && this._sections[parentKey].active)) {
                this._createNewSection(parentKey, needsMutationEvent, sectionMapping, previousKey, nextKey);
                if (needsMutationEvent) {
                    needsMutationEvent = false;
                }
            }
            parentSectionChildrenArray = this._sections[parentKey].children;
            parentSectionChildDataArray = this._sections[parentKey].childData;
        }
        else {
            parentSectionChildrenArray = this._sectionRoots;
            parentSectionChildDataArray = this._sectionRootData;
            rootNode = true;
        }
        let previousNode = null;
        if (nextKey == null) {
            if (previousKey == null) {
                if (parentSectionChildrenArray().length > 0) {
                    previousKey = parentSectionChildrenArray()[parentSectionChildrenArray().length - 1];
                    if (leafNode) {
                        previousLeaf = previousKey;
                    }
                }
                parentSectionChildrenArray.push(newSectionKey);
                parentSectionChildDataArray.push(self.sectionRenderer(newSectionKey));
            }
            else {
                previousNode = this._sections[previousKey];
                while (previousNode.depth > depth) {
                    previousNode = this._sections[this._sections[previousKey].parent];
                }
                if (previousNode.depth == depth) {
                    previousKey = previousNode.key;
                    let newIndex = parentSectionChildrenArray.indexOf(previousKey);
                    if (newIndex >= 0) {
                        parentSectionChildrenArray.splice(newIndex + 1, 0, newSectionKey);
                        parentSectionChildDataArray.splice(newIndex + 1, 0, self.sectionRenderer(newSectionKey));
                    }
                    else {
                        parentSectionChildrenArray.push(newSectionKey);
                        parentSectionChildDataArray.push(self.sectionRenderer(newSectionKey));
                    }
                    nextKey = previousNode.next;
                }
                else {
                    previousKey = null;
                    nextKey = null;
                    parentSectionChildrenArray.push(newSectionKey);
                    parentSectionChildDataArray.push(self.sectionRenderer(newSectionKey));
                }
            }
        }
        else {
            let nextNode = this._sections[nextKey];
            while (nextNode.depth > depth) {
                nextNode = this._sections[this._sections[nextKey].parent];
            }
            if (nextNode.depth == depth) {
                nextKey = nextNode.key;
                let newIndex = parentSectionChildrenArray.indexOf(nextKey);
                if (newIndex >= 0) {
                    parentSectionChildrenArray.splice(newIndex, 0, newSectionKey);
                    parentSectionChildDataArray.splice(newIndex, 0, self.sectionRenderer(newSectionKey));
                }
                else {
                    parentSectionChildrenArray.push(newSectionKey);
                    parentSectionChildDataArray.push(self.sectionRenderer(newSectionKey));
                }
                previousKey = nextNode.previous;
            }
            else {
                previousKey = null;
                nextKey = null;
                parentSectionChildrenArray.push(newSectionKey);
                parentSectionChildDataArray.push(self.sectionRenderer(newSectionKey));
            }
        }
        if (!(newSectionKey in this._sections)) {
            this._sections[newSectionKey] = {
                parent: parentKey,
                key: newSectionKey,
                children: observableArray([]),
                childData: observableArray([]),
                previous: previousKey,
                next: nextKey,
                previousLeaf: previousLeaf,
                nextLeaf: nextLeaf,
                depth: depth,
                active: true,
                index: function () {
                    if (this.parent != null) {
                        return self._sections[this.parent].children.indexOf(this.key);
                    }
                    else {
                        return self._sectionRoots.indexOf(this.key);
                    }
                },
                cutoffIndex: function () {
                    return (self._getCutoffIndex(self._sections[this.key].previousLeaf) +
                        self._sections[this.key].children().length);
                }
            };
        }
        else {
            this._sections[newSectionKey].active = true;
            this._sections[newSectionKey].previous = previousKey;
            this._sections[newSectionKey].next = nextKey;
            this._sections[newSectionKey].previousLeaf = previousLeaf;
            this._sections[newSectionKey].nextLeaf = nextLeaf;
            this._sections[newSectionKey].parent = parentKey;
        }
        if (previousKey != null) {
            this._sections[previousKey].next = newSectionKey;
        }
        if (nextKey != null) {
            this._sections[nextKey].previous = newSectionKey;
        }
        if (depth == this._getDepth(sectionMapping)) {
            if (previousLeaf != null) {
                this._sections[previousLeaf].nextLeaf = newSectionKey;
            }
            if (nextLeaf != null) {
                this._sections[nextLeaf].previousLeaf = newSectionKey;
            }
        }
        if (depth == this._getDepth(sectionMapping) &&
            (nextKey == this._currentFirstSection || this._currentFirstSection == null)) {
            this._currentFirstSection = newSectionKey;
        }
        let addBeforeKeys = null;
        if (nextKey != null) {
            addBeforeKeys = [nextKey];
        }
        let data = self.sectionRenderer(newSectionKey);
        this._processNode(data, [], newSectionKey);
        if (needsMutationEvent) {
            if (this._storedAddSectionKeys.indexOf(this._sections[newSectionKey].parent) == -1) {
                let keys = newSectionKey;
                let metadata = {
                    key: newSectionKey
                };
                let index = this._sections[newSectionKey].index();
                let addEvent = {
                    data: [data],
                    indexes: [index],
                    keys: new Set([keys]),
                    metadata: [metadata],
                    addBeforeKeys: addBeforeKeys,
                    parentKeys: [parentKey]
                };
                let mutationEvent = new DataProviderMutationEvent({
                    add: addEvent,
                    remove: null,
                    update: null
                });
                this._storedAddSection.push(mutationEvent);
                this._storedAddSectionKeys.push(newSectionKey);
                if (!this._dataFetchComplete && rootNode && this._currentBaseOffset > index) {
                    this._currentBaseOffset++;
                }
                if (!this._dataFetchComplete) {
                    for (let [key, value] of this._internalIterator) {
                        if (value.parentKey === parentKey && value.offset > index) {
                            value.offset++;
                        }
                        this._updateIteratorOffset(key, value.offset);
                    }
                }
            }
        }
        this.treeData.valueHasMutated();
    }
    _removeSection(sectionKey) {
        let sectionData = this._sections[sectionKey];
        let parent = sectionData.parent;
        let previous = sectionData.previous;
        let next = sectionData.next;
        let previousLeaf = sectionData.previousLeaf;
        let nextLeaf = sectionData.nextLeaf;
        let needsMutationEvent = true;
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
        }
        if (this._sections[parent] && this._sections[parent].children.indexOf(sectionKey) != -1) {
            let childIndex = this._sections[parent].children.indexOf(sectionKey);
            if (!this._dataFetchComplete) {
                for (let [key, value] of this._internalIterator) {
                    if (value.parentKey === parent && value.offset > childIndex) {
                        value.offset--;
                    }
                    this._updateIteratorOffset(key, value.offset);
                }
            }
            this._sections[parent].children.splice(childIndex, 1);
            this._sections[parent].childData.splice(childIndex, 1);
            if (this._sections[parent].children().length === 0) {
                this._removeSection(parent);
                if (needsMutationEvent) {
                    needsMutationEvent = false;
                }
            }
        }
        this._sections[sectionKey].active = false;
        this._sections[sectionKey].children([]);
        this._sections[sectionKey].childData([]);
        if (this._sections[sectionKey].parent == null) {
            let rootIndex = this._sectionRoots.indexOf(sectionKey);
            this._sectionRoots.splice(rootIndex, 1);
            this._sectionRootData.splice(rootIndex, 1);
            if (!this._dataFetchComplete && this._currentBaseOffset > rootIndex) {
                this._currentBaseOffset--;
            }
        }
        if (sectionKey == this._currentFirstSection) {
            this._currentFirstSection = next;
        }
        if (needsMutationEvent) {
            let data = this.sectionRenderer(sectionKey);
            let keys = sectionKey;
            let metadata = {
                key: sectionKey
            };
            let removeEvent = {
                data: [data],
                indexes: null,
                keys: new Set([keys]),
                metadata: [metadata]
            };
            let mutationEvent = new DataProviderMutationEvent({
                add: null,
                remove: removeEvent,
                update: null
            });
            this._storedRemoveSection.push(mutationEvent);
        }
        this.treeData.valueHasMutated();
    }
    _updateSectionIndex() {
        let self = this;
        for (let i = this._currentOffset; i < this._treeData.length; i++) {
            let data = this._treeData[i];
            let key = this._treeKeyMap[i];
            self._processNode(data, [], key);
            let newSectionLabel = self._groupingFunction(data);
            let itemSectionKey = self._getSectionKeyFromArray(newSectionLabel);
            if (this._currentSectionKey == null) {
                if (!(itemSectionKey in this._sections)) {
                    self._createNewSection(itemSectionKey, false, newSectionLabel, this._currentSectionKey, null);
                }
                this._currentSectionKey = itemSectionKey;
                this._currentRootSection = this._getSectionArray(newSectionLabel)[0];
            }
            if (itemSectionKey === this._currentSectionKey) {
                this._currentSectionData.push(data);
            }
            else {
                if (!(itemSectionKey in this._sections && this._sections[itemSectionKey].active)) {
                    self._createNewSection(itemSectionKey, false, newSectionLabel, this._currentSectionKey, null);
                }
                this._sections[this._currentSectionKey].children(this._currentSectionData);
                this._sections[this._currentSectionKey].childData(this._getChildDataFromChildren(this._currentSectionKey));
                this._currentSectionKey = itemSectionKey;
                this._currentRootSection = this._getSectionArray(newSectionLabel)[0];
                this._currentSectionData = [data];
            }
            this._currentOffset++;
        }
        if (this._currentSectionData.length > 0) {
            this._sections[this._currentSectionKey].children(this._currentSectionData);
            this._sections[this._currentSectionKey].childData(this._getChildDataFromChildren(this._currentSectionKey));
        }
        let rootSections = [];
        for (let sectionKey in this._sections) {
            if (this._sections[sectionKey].parent == null) {
                rootSections.push(this.sectionRenderer(sectionKey));
            }
        }
        this.treeData(rootSections);
        this.treeData.valueHasMutated();
    }
    _getSectionArray(sectionMapping) {
        if (Array.isArray(sectionMapping)) {
            return sectionMapping;
        }
        else {
            return [sectionMapping];
        }
    }
    _getChildDataFromChildren(sectionKey) {
        let self = this;
        let childData = [];
        this._sections[sectionKey].children().forEach(function (child) {
            childData.push(self.sectionRenderer(child));
        });
        return childData;
    }
    _createKeyObj(node, parentKeyPath, treeData) {
        let key = this._getId(node);
        let keyPath = parentKeyPath ? parentKeyPath.slice() : [];
        if (key == null) {
            keyPath.push(this._incrementSequenceNum(treeData));
            key = keyPath;
        }
        else {
            keyPath.push(key);
            if (this.options && this.options['keyAttributesScope'] == 'siblings') {
                key = keyPath;
            }
        }
        return { key: key, keyPath: keyPath };
    }
    _getId(row) {
        let id;
        let keyAttributes = this.options != null ? this.options['keyAttributes'] : null;
        if (!keyAttributes) {
            keyAttributes = 'id';
        }
        if (keyAttributes != null) {
            if (Array.isArray(keyAttributes)) {
                let i;
                id = [];
                for (i = 0; i < keyAttributes.length; i++) {
                    id[i] = this._getVal(row, keyAttributes[i]);
                }
            }
            else if (keyAttributes == '@value') {
                id = this._getAllVals(row);
            }
            else {
                id = this._getVal(row, keyAttributes);
            }
            return id;
        }
        else {
            return null;
        }
    }
    _getDepth(sectionMapping) {
        if (Array.isArray(sectionMapping)) {
            return sectionMapping.length - 1;
        }
        else {
            return 0;
        }
    }
    _getVal(val, attr, keepFunc) {
        if (typeof attr == 'string') {
            let dotIndex = attr.indexOf('.');
            if (dotIndex > 0) {
                let startAttr = attr.substring(0, dotIndex);
                let endAttr = attr.substring(dotIndex + 1);
                let subObj = val[startAttr];
                if (subObj) {
                    return this._getVal(subObj, endAttr);
                }
            }
        }
        if (keepFunc !== true && typeof val[attr] == 'function') {
            return val[attr]();
        }
        return val[attr];
    }
    _getAllVals(val) {
        let self = this;
        return Object.keys(val).map(function (key) {
            return self._getVal(val, key);
        });
    }
    _getNodeMetadata(node) {
        let key = this._getKeyForNode(node);
        if (key == null) {
            key = this._getId(node);
        }
        return { key: key };
    }
    _getNodeForKey(key) {
        let rootDataProvider = this._getRootDataProvider();
        return rootDataProvider._mapKeyToNode.get(JSON.stringify(key));
    }
    _getKeyForNode(node) {
        let rootDataProvider = this._getRootDataProvider();
        return rootDataProvider._mapNodeToKey.get(node);
    }
    _setMapEntry(key, node) {
        let rootDataProvider = this._getRootDataProvider();
        rootDataProvider._mapKeyToNode.set(JSON.stringify(key), node);
        rootDataProvider._mapNodeToKey.set(node, key);
    }
    _incrementSequenceNum(treeData) {
        let rootDataProvider = this._getRootDataProvider();
        let seqNum = rootDataProvider._mapArrayToSequenceNum.get(treeData) || 0;
        rootDataProvider._mapArrayToSequenceNum.set(treeData, seqNum + 1);
        return seqNum;
    }
    _addData(event) {
        let self = this;
        let data = event.data;
        let metadata = event.metadata;
        let addBeforeKeys = event.addBeforeKeys;
        let indexes = event.indexes;
        let keys = [];
        event.keys.forEach(function (key) {
            keys.push(key);
        });
        if (indexes != null && indexes.length > 0) {
            let sortedIndexes = indexes.slice(0).sort();
            for (let i = 0; i < sortedIndexes.length; i++) {
                let currentIndex = sortedIndexes[i];
                let originalIndex = indexes.indexOf(currentIndex);
                self._treeData.splice(currentIndex, 0, data[originalIndex]);
                self._treeMetadata.splice(currentIndex, 0, metadata[originalIndex]);
                self._treeKeyMap.splice(currentIndex, 0, keys[originalIndex]);
            }
            if (addBeforeKeys == null || addBeforeKeys.length == 0) {
                addBeforeKeys = [];
                for (let i = 0; i < indexes.length; i++) {
                    let beforeKey = indexes[i] + 1 < self._treeKeyMap.length ? self._treeKeyMap[indexes[i] + 1] : null;
                    addBeforeKeys.push(beforeKey);
                }
            }
        }
        else if (addBeforeKeys != null && addBeforeKeys.length > 0) {
            let currentKeys = keys.slice(0);
            let currentMetadatas = metadata.slice(0);
            let currentDatas = data.slice(0);
            let currentBeforeKeys = addBeforeKeys.slice(0);
            while (currentBeforeKeys.length > 0) {
                let currentBeforeKey = currentBeforeKeys[0];
                let currentKey = currentKeys[0];
                let currentMetadata = currentMetadatas[0];
                let currentData = currentDatas[0];
                let previousIndex = self._treeKeyMap.indexOf(currentBeforeKey);
                if (previousIndex != -1) {
                    self._treeData.splice(previousIndex, 0, currentData);
                    self._treeMetadata.splice(previousIndex, 0, currentMetadata);
                    self._treeKeyMap.splice(previousIndex, 0, currentKey);
                }
                else {
                    currentKeys.push(currentKey);
                    currentMetadatas.push(currentMetadata);
                    currentDatas.push(currentData);
                    currentBeforeKeys.push(currentBeforeKey);
                }
                currentKeys.splice(0, 1);
                currentBeforeKeys.splice(0, 1);
                currentMetadatas.splice(0, 1);
                currentDatas.splice(0, 1);
            }
        }
        else {
            let orderedData = [];
            let orderedMetaData = [];
            let orderedKeys = [];
            let counter = 0;
            let added = false;
            data.forEach(function (value, ind) {
                added = false;
                if (orderedData.length != 0) {
                    while (counter < orderedData.length && !added) {
                        if (self.sortComparator(value, orderedData[counter])) {
                            orderedData.splice(counter, 0, value);
                            orderedMetaData.splice(counter, 0, metadata[ind]);
                            orderedKeys.splice(counter, 0, keys[ind]);
                            added = true;
                        }
                        else {
                            counter++;
                        }
                    }
                }
                if (!added) {
                    orderedData.push(value);
                    orderedMetaData.push(metadata[ind]);
                    orderedKeys.push(keys[ind]);
                }
            });
            counter = self._treeData.length - 1;
            let addBeforeKeysMap = {};
            orderedData.forEach(function (value, ind) {
                let newData = value;
                let newMetadata = orderedMetaData[ind];
                let newKey = orderedKeys[ind];
                added = false;
                while (counter >= 0 && !added) {
                    if (self.sortComparator(newData, self._treeData[counter])) {
                        if (counter + 1 != self._treeData.length) {
                            self._treeData.splice(counter + 1, 0, newData);
                            self._treeMetadata.splice(counter + 1, 0, newMetadata);
                            addBeforeKeysMap[self._getId(newData)] = self._treeKeyMap[counter + 1];
                            self._treeKeyMap.splice(counter + 1, 0, newKey);
                        }
                        else {
                            self._treeData.push(newData);
                            self._treeMetadata.push(newMetadata);
                            addBeforeKeysMap[self._getId(newData)] = null;
                            self._treeKeyMap.push(newKey);
                        }
                        added = true;
                    }
                    else {
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
    _handleAdd(event) {
        let self = this;
        let newData = [];
        let addBeforeKeys = self._addData(event);
        if (!event.addBeforeKeys || event.addBeforeKeys.length == 0) {
            event.addBeforeKeys = addBeforeKeys;
        }
        event.keys.forEach(function (key) {
            let i = newData.length;
            let itemData = event.data[i];
            let addBeforeKey = addBeforeKeys[i];
            newData.push({ addBeforeKey: addBeforeKey, key: key, data: itemData });
        });
        let parentKeys = [];
        let newAddedSections = [];
        let keepInd = [];
        let indexMap = this._getIndexFromKeys(event.keys);
        if (!event.indexes || event.indexes.length == 0) {
            event.indexes = [];
        }
        event.data.forEach(function (value, ind) {
            self._processNode(value, [], newData[ind].key);
            let sectionLabel = self._groupingFunction(value);
            let sectionId = self._getSectionKeyFromArray(sectionLabel);
            let previousSectionId;
            let nextSectionId;
            if (!(sectionId in self._sections && self._sections[sectionId].active)) {
                if (indexMap[ind] != 0) {
                    previousSectionId = self._getSectionKeyFromArray(self._groupingFunction(self._treeData[indexMap[ind] - 1]));
                    nextSectionId = self._sections[previousSectionId].nextLeaf;
                }
                else {
                    previousSectionId = null;
                }
                if (indexMap[ind] + 1 < self._treeData.length && previousSectionId == null) {
                    nextSectionId = self._currentFirstSection;
                }
                self._createNewSection(sectionId, true, sectionLabel, previousSectionId, nextSectionId);
                sectionId = self._getSectionKeyFromArray(sectionLabel);
                newAddedSections.push(sectionId);
            }
            else if (newAddedSections.indexOf(sectionId) === -1) {
                keepInd.push(ind);
            }
            let childrenArray = self._sections[sectionId].children;
            let childDataArray = self._sections[sectionId].childData;
            previousSectionId = self._sections[sectionId].previousLeaf;
            let previousCutoffIndex = 0;
            if (previousSectionId != null) {
                previousCutoffIndex = self._sections[previousSectionId].cutoffIndex();
            }
            childrenArray.splice(indexMap[ind] - previousCutoffIndex, 0, value);
            childDataArray.splice(indexMap[ind] - previousCutoffIndex, 0, self.sectionRenderer(value));
            parentKeys.push(sectionId);
            event.indexes[ind] = indexMap[ind] - previousCutoffIndex;
            if (event.addBeforeKeys[ind] != null && ind == event.data.length - 1) {
                let addBeforeDataSection = self._getSectionKeyFromArray(self._groupingFunction(self._treeData[self._treeKeyMap.indexOf(event.addBeforeKeys[ind])]));
                if (addBeforeDataSection != sectionId) {
                    event.addBeforeKeys[ind] = null;
                }
            }
        });
        event.parentKeys = parentKeys;
        if (newAddedSections.length > 0) {
            let counter = 0;
            let newData = [];
            let newKeys = [];
            let newMetadata = [];
            let newParentKeys = [];
            let newIndexes = [];
            let newAddBeforeKeys = [];
            event.keys.forEach(function (value) {
                if (keepInd.indexOf(counter) != -1) {
                    newKeys.push(value);
                    newData.push(event.data[counter]);
                    newMetadata.push(event.metadata[counter]);
                    newParentKeys.push(event.parentKeys[counter]);
                    newIndexes.push(event.indexes[counter]);
                    newAddBeforeKeys.push(event.addBeforeKeys[counter]);
                }
                counter++;
            });
            if (newKeys.length > 0) {
                event = {
                    data: newData,
                    keys: new Set(newKeys),
                    metadata: newMetadata,
                    parentKeys: newParentKeys,
                    indexes: newIndexes,
                    addBeforeKeys: newAddBeforeKeys
                };
            }
            else {
                event = null;
            }
        }
        return event;
    }
    _handleRemove(event) {
        let self = this;
        let indexMap = this._getIndexFromKeys(event.keys);
        this._removeKeys(event.keys);
        let removeDataIndex = [];
        let removeIndex = [];
        for (var ind = 0; ind < indexMap.length; ind++) {
            let updateInd = indexMap[ind];
            let item = self._treeData[updateInd];
            let oldKey = self._treeKeyMap[updateInd];
            let oldNode = self._mapKeyToNode.get(JSON.stringify(oldKey));
            self._mapKeyToNode.delete(JSON.stringify(oldKey));
            self._mapNodeToKey.delete(oldNode);
            let sectionId = self._getSectionKeyFromArray(self._groupingFunction(item));
            let previousSectionId = self._sections[sectionId].previousLeaf;
            let previousCutoffIndex = 0;
            if (previousSectionId != null) {
                previousCutoffIndex = self._sections[previousSectionId].cutoffIndex();
            }
            removeDataIndex.push({ ind: updateInd - previousCutoffIndex, sectionId: sectionId });
            removeIndex.push(updateInd);
        }
        removeDataIndex.sort(function (a, b) {
            return b.ind - a.ind;
        });
        removeIndex.sort(function (a, b) {
            return b - a;
        });
        for (let i = 0; i < removeDataIndex.length; i++) {
            let sectionId = removeDataIndex[i].sectionId;
            let dataArray = self._sections[sectionId].children;
            dataArray.splice(removeDataIndex[i].ind, 1);
            if (dataArray().length === 0) {
                this._removeSection(sectionId);
            }
            self._treeData.splice(removeIndex[i], 1);
            self._treeMetadata.splice(removeIndex[i], 1);
        }
    }
    _handleUpdate(event) {
        let self = this;
        let indexMap = this._getIndexFromKeys(event.keys);
        event.data.forEach(function (value, ind) {
            let updateInd = indexMap[ind];
            let item = self._treeData[updateInd];
            let oldKey = self._treeKeyMap[updateInd];
            let oldNode = self._mapKeyToNode.get(JSON.stringify(oldKey));
            self._mapNodeToKey.delete(oldNode);
            self._setMapEntry(oldKey, item);
            let sectionId = self._getSectionKeyFromArray(self._groupingFunction(item));
            let dataArray = self._sections[sectionId].children;
            let previousSectionId = self._sections[sectionId].previousLeaf;
            let previousCutoffIndex = 0;
            if (previousSectionId != null) {
                previousCutoffIndex = self._sections[previousSectionId].cutoffIndex();
            }
            dataArray.splice(updateInd - previousCutoffIndex, 1, value);
            self._treeData[updateInd] = value;
        });
    }
    _getCutoffIndex(sectionKey) {
        if (sectionKey != null) {
            return this._sections[sectionKey].cutoffIndex();
        }
        return 0;
    }
    _getIndexFromKeys(keys) {
        let self = this;
        let indexMap = [];
        keys.forEach(function (key) {
            indexMap.push(self._treeKeyMap.indexOf(key));
        });
        return indexMap;
    }
    _removeKeys(keys) {
        let self = this;
        keys.forEach(function (key) {
            self._treeKeyMap.splice(self._treeKeyMap.indexOf(key), 1);
        });
    }
    _cleanEvent(event) {
        let indexMap = this._getIndexFromKeys(event.keys);
        let keyIndex = 0;
        event.keys.forEach(function (val) {
            if (indexMap[keyIndex] == -1) {
                event.keys.delete(val);
            }
            keyIndex++;
        });
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
    _cleanAddEvent(event) {
        let self = this;
        let addBeforeKeys = event.addBeforeKeys;
        let indexes = event.indexes;
        let keys = [];
        let cleanItems = [];
        event.keys.forEach(function (key) {
            keys.push(key);
        });
        if (indexes != null) {
            let sortedIndexes = indexes.slice(0).sort();
            for (let i = 0; i < sortedIndexes.length; i++) {
                let currentIndex = sortedIndexes[i];
                let originalIndex = indexes.indexOf(currentIndex);
                if (self._treeData.length + i - cleanItems.length < currentIndex) {
                    cleanItems.push(originalIndex);
                }
            }
        }
        else if (addBeforeKeys != null) {
            let sortedKeys = addBeforeKeys.slice(0).sort();
            for (let i = 0; i < sortedKeys.length; i++) {
                let currentKey = sortedKeys[i];
                let originalKeyIndex = addBeforeKeys.indexOf(currentKey);
                if (self._treeKeyMap.indexOf(currentKey) == -1 && keys.indexOf(currentKey) == -1) {
                    cleanItems.push(originalKeyIndex);
                }
                else if (self._treeKeyMap.indexOf(currentKey) == -1 &&
                    keys.indexOf(currentKey) != -1 &&
                    cleanItems.indexOf(keys.indexOf(currentKey)) == -1) {
                    cleanItems.push(originalKeyIndex);
                }
            }
        }
        let keyIndex = 0;
        event.keys.forEach(function (val) {
            if (cleanItems.indexOf(keyIndex) != -1) {
                event.keys.delete(val);
            }
            keyIndex++;
        });
        let sortedCleanItems = cleanItems.splice(0).sort();
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
    _addEventListeners(dataprovider) {
        let self = this;
        dataprovider.addEventListener('refresh', function (event) {
            self._initialize();
            self.dispatchEvent(new DataProviderRefreshEvent());
        });
        dataprovider.addEventListener('mutate', function (event) {
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
}
EventTargetMixin.applyMixin(GroupingDataProvider);
oj._registerLegacyNamespaceProp('GroupingDataProvider', GroupingDataProvider);

export default GroupingDataProvider;
