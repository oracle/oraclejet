/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojtranslation', 'ojs/ojarraytreedataprovider', 'ojs/ojarraydataprovider', 'ojs/ojindexer'],
       /*
        * @param {Object} oj 
        * @param {jQuery} $
        */
       function(oj, $, Translations, ArrayTreeDataProvider, ArrayDataProvider)
{

class IndexerModelTreeDataProvider {
    constructor(data, options) {
        this.data = data;
        this.options = options;
        let sections = options.sections;
        if (sections == null) {
            let resource = Translations.getTranslatedString('oj-ojIndexer.indexerCharacters');
            sections = resource.split('|');
        }
        sections.push(oj.IndexerModel.SECTION_OTHERS);
        let strategy = options.groupingStrategy;
        if (strategy == null) {
            // if no grouping strategy is specified, use the default which groups based on the first charactor
            // of the data
            let field = this.options.groupingAttribute;
            strategy = function (value) {
                let content = value[field] ? value[field] : value;
                let char = content.toString().toUpperCase()[0];
                return sections.indexOf(char) > -1 ? char : oj.IndexerModel.SECTION_OTHERS;
            };
        }
        data = data.sort(function (a, b) {
            let section1 = strategy(a);
            let section2 = strategy(b);
            let index1 = sections.indexOf(section1);
            let index2 = sections.indexOf(section2);
            return index1 - index2;
        });
        let current;
        // figure out the position of the buckets for quick lookup
        for (let i = 0; i < this.data.length; i++) {
            let section = strategy(this.data[i]);
            if (current !== section) {
                current = section;
                this._set(section, i);
            }
        }
        let self = this;
        let available = sections.filter(function (aSection) {
            return self._get(aSection) != null;
        });
        this.sections = sections;
        this.baseDataProvider = new ArrayDataProvider(available, { keys: available });
    }
    // TODO: use Map when we can use it for all supported platforms
    _set(key, value) {
        if (this.pos == null) {
            this.pos = [];
        }
        this.pos.push({ key: key, value: value });
    }
    _get(key) {
        for (let i = 0; i < this.pos.length; i++) {
            if (this.pos[i].key === key) {
                return this.pos[i].value;
            }
        }
        return null;
    }
    /** **************** IndexerModel *******************/
    getIndexableSections() {
        // remove other sections from this.sections
        return this.sections.slice(0, this.sections.length - 1);
    }
    getMissingSections() {
        if (this.missing == null) {
            let missing = [];
            // figure out what's missing, skip the others section since it's always available
            for (let i = 0; i < this.sections.length - 1; i++) {
                let section = this.sections[i];
                if (this._get(section) == null) {
                    missing.push(section);
                }
            }
            this.missing = missing;
        }
        return this.missing;
    }
    setSection(section) {
        if (this.options.sectionChangeHandler) {
            return this.options.sectionChangeHandler.call(this, section);
        }
        return Promise.resolve(section);
    }
    ;
    /** **************** TreeDataProvider *******************/
    getChildDataProvider(parentKey, options) {
        if (parentKey === null) {
            return this;
        }
        let section = parentKey;
        let index = this.sections.indexOf(section);
        if (index > -1) {
            let childData;
            let pos = this._get(parentKey);
            if (pos != null) {
                // if it's the last section
                if (index === this.sections.length - 1) {
                    childData = this.data.slice(pos);
                }
                else {
                    index += 1;
                    let next = this.sections[index];
                    let nextPos = this._get(next);
                    while (nextPos == null && index < this.sections.length) {
                        index += 1;
                        next = this.sections[index];
                        nextPos = this._get(next);
                    }
                    if (isNaN(nextPos) || nextPos == null) {
                        nextPos = this.data.length;
                    }
                    childData = this.data.slice(pos, nextPos);
                }
            }
            else {
                childData = [];
            }
            return new ArrayTreeDataProvider(childData, { keyAttributes: this.options.keyAttributes,
                sortComparators: this.options.sortComparators,
                implicitSort: this.options.implicitSort });
        }
        return null;
    }
    getCapability(capabilityName) {
        return this.baseDataProvider.getCapability(capabilityName);
    }
    getTotalSize() {
        return this.baseDataProvider.getTotalSize();
    }
    containsKeys(params) {
        return this.baseDataProvider.containsKeys(params);
    }
    fetchByKeys(params) {
        return this.baseDataProvider.fetchByKeys(params);
    }
    fetchByOffset(params) {
        return this.baseDataProvider.fetchByOffset(params);
    }
    fetchFirst(params) {
        return this.baseDataProvider.fetchFirst(params);
    }
    isEmpty() {
        return this.baseDataProvider.isEmpty();
    }
    addEventListener(eventType, listener) {
        this.baseDataProvider.addEventListener(eventType, listener);
    }
    removeEventListener(eventType, listener) {
        this.baseDataProvider.removeEventListener(eventType, listener);
    }
    dispatchEvent(evt) {
        return this.baseDataProvider.dispatchEvent(evt);
    }
}
// make it available internally for backward compatibility and norequire case
oj.IndexerModelTreeDataProvider = IndexerModelTreeDataProvider;
oj['IndexerModelTreeDataProvider'] = IndexerModelTreeDataProvider;


/* global Promise:false */

/**
 * Implementation of the IndexerModel and TreeDataProvider based on an array of data set.
 * This should be used with the Indexer and its associated ListView.
 * By default, this DataProvider groups the data based on the first letter of the data and the alphabet of the current locale.
 * Note this implementation of TreeDataProvider does not fire any model events.
 * @final
 * @class IndexerModelTreeDataProvider
 * @classdesc TreeDataProvider and IndexerModel implementation that represents hierachical data available from an array of JSON objects.  This DataProvider can be used by [Indexer]{@link oj.ojIndexer} and
 *            its associated [ListView]{@link oj.ojListView}.<br><br>
 *            See the <a href="../jetCookbook.html?component=indexer&demo=characterIndexer">Indexer - Basic</a> demo for an example.<br><br>
 *            Refer to {@link oj.TreeDataProvider} for other data providers that represent hierarachical data.
 * @param {Array.<any>} data an array of data used for Indexer and ListView
 * @param {Object=} options the options set on this IndexerModelTreeProvider
 * @param {(string|Array.<string>)=} options.keyAttributes the field of the data that uniquely identifies the data.  Can be a string denoting a single key attribute or an array of strings for multiple key attributes.
 *                 If not specified, then one will be created.
 * @param {(Array.<string>|Array.<Object>)=} options.sections the set of sections to use with the Indexer.  If not specified, then the sections are derived from the alphabet of the current locale.
 * @param {(function(Object)|function(string))=} options.sectionChangeHandler a callback function that handles when a section becomes current (user clicks on the section in the Indexer).
 *                   the function takes the section that is going to become current and must return a Promise which when resolve returns the section that actually becomes current.
 * @param {string=} options.groupingAttribute the attribute of the data where grouping is based on, mandatory if no groupingStrategy is specified.
 * @param {function(Object)=} options.groupingStrategy a callback function that takes a data and returns the section that the data belongs to.  If no groupingStrategy is specified,
 *                   then the default grouping strategy based on the first letter of the data is used.
 * @param {oj.SortComparators=} options.sortComparators a comparator function that is used to sort data within a section.
 * @param {Array.<oj.SortCriterion>=} options.implicitSort array of oj.SortCriterion used to specify sort information when the data loaded into the DataProvider is already sorted.
 * @ojsignature [{target: "Type",
 *               value: "class IndexerModelTreeDataProvider<K, D> implements IndexerModel, TreeDataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
 *             {target: "Type",
 *               value: "(section: oj.IndexerModel.Section)=> Promise<oj.IndexerModel.Section>",
 *               for: "options.sectionChangeHandler"},
 *             {target: "Type",
 *               value: "(data: D)=> oj.IndexerModel.Section",
 *               for: "options.groupingStrategy"},
 *             {target: "Type",
 *               value: "ArrayDataProvider.SortComparators<D>",
 *               for: "options.sortComparators"},
 *             {target: "Type",
 *               value: "Array.<SortCriterion<D>>",
 *               for: "options.implicitSort"}]
 *
 * @constructor
 * @final
 * @since 7.0
 * @export
 * @implements oj.IndexerModel
 * @implements oj.TreeDataProvider
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["FetchByKeysParameters", "SortCriterion", "ContainsKeysResults", "FetchByKeysResults",
 * "FetchByOffsetParameters", "FetchByOffsetResults", "FetchListParameters", "FetchListResult"]}
 * @ojtsimport {module: "ojtreedataprovider", type: "AMD", importName: "TreeDataProvider"}
 * @ojtsimport {module: "ojindexer", type: "AMD", imported: ["IndexerModel"]}
 * @ojtsimport {module: "ojarraydataprovider", type: "AMD", importName: "ArrayDataProvider"}
 * @ojtsmodule
 */

/** **************** IndexerModel *******************/
/**
 * Returns an array of objects each representing a section in the associated ListView.
 * @return {Array.<string>|Array.<Object>} an array of all indexable sections
 * @export
 * @expose
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name getIndexableSections
 * @ojsignature {target: "Type", value: "(): oj.IndexerModel.Section[]"}
 */

/**
 * Returns an array of objects each representing a section that does not have a corresponding section in the associated ListView.
 * It must be a subset of the return value of <code>getIndexableSections</code>.  Return null or undefined if there's nothing missing.
 * @return {Array.<string>|Array.<Object>} an array of missing sections
 * @export
 * @expose
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name getMissingSections
 * @ojsignature {target: "Type", value: "(): oj.IndexerModel.Section[]"}
 */

/**
 * Make a section current in the Indexer.
 * @param {string|Object} section the current section
 * @return {Promise.<string>|Promise.<Object>} a Promise which when resolved will return the section that the associated ListView actually scrolls to.
 *                   For example, the implementation could choose to scroll to the next available section in ListView if no data
 *                   exists for the current section section.
 * @export
 * @expose
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name setSection
 * @ojsignature {target: "Type",
 *               value: "(section: oj.IndexerModel.Section): Promise<oj.IndexerModel.Section>"}
 */

/** **************** TreeDataProvider *******************/
/**
 * Get the data provider for the children of the row identified by parentKey.
 * @param {any} parentKey key of the row to get child data provider for.
 * @return {oj.TreeDataProvider | null} A TreeDataProvider if the row can (but doesn't have to) have children; or null if the row cannot have children.
 *   Use the <code class="prettyprint">isEmpty</code> method on the returned TreeDataProvider to determine if it currently has children.
 * @export
 * @expose
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name getChildDataProvider
 * @ojsignature {target: "Type",
 *               value: "(parentKey: any): TreeDataProvider<K, D>"}
 */

/**
 * Determines whether this DataProvider supports a certain feature.
 * @param {string} capabilityName capability name. Supported capability names are:
 *                  "fetchByKeys", "fetchByOffset", "sort", and "filter".
 * @return {Object} capability information or null if unsupported
 * <ul>
 *   <li>If capabilityName is "fetchByKeys", returns a {@link oj.FetchByKeysCapability} object.</li>
 *   <li>If capabilityName is "fetchByOffset", returns a {@link oj.FetchByOffsetCapability} object.</li>
 *   <li>If capabilityName is "sort", returns a {@link oj.SortCapability} object.</li>
 *   <li>If capabilityName is "filter", returns a {@link oj.FilterCapability} object.</li>
 * </ul>
 * @export
 * @expose
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name getCapability
 * @ojsignature {target: "Type",
 *               value: "(capabilityName: string): any"}
 * @example <caption>Check what kind of fetchByKeys is supported.</caption>
 * var capabilityInfo = dataprovider.getCapability('fetchByKeys');
 * if (capabilityInfo.implementation == 'iteration') {
 *   // the DataProvider supports iteration for fetchByKeys
 *   ...
 */

/**
 * Return the total number of rows in this IndexerModelTreeDataProvider.
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows. -1 is unknown row count.
 * @export
 * @expose
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name getTotalSize
 * @example <caption>Get the total rows</caption>
 * dataprovider.getTotalSize().then(function(value) {
 *   if (value == -1) {
 *     // we don't know the total row count
 *   } else {
 *     // the total count
 *     console.log(value);
 * });
 */

/**
 * Check if there are sections containing the specified keys
 * @param {oj.FetchByKeysParameters} parameters contains by key parameters
 * @return {Promise.<oj.ContainsKeysResults>} Returns Promise which resolves to {@link oj.ContainsKeysResults}.
 * @export
 * @expose
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name containsKeys
 * @ojsignature {target: "Type",
 *               value: "(parameters : FetchByKeysParameters<K>) : Promise<ContainsKeysResults<K>>"}
 * @example <caption>Check if keys 1001 and 556 are contained</caption>
 * var containsKeys = [1001, 556];
 * dataprovider.containsKeys({keys: containsKeys}).then(function(value) {
 *   var results = value['results'];
 *   if (results.has(1001)) {
 *     console.log('Has key 1001');
 *   } else if (results.has(556){
 *     console.log('Has key 556');
 *   }
 * });
 */

/**
 * Fetch data by specifying a set of keys.
 * @param {oj.FetchByKeysParameters} parameters fetch by key parameters
 * @return {Promise.<oj.FetchByKeysResults>} Returns Promise which resolves to {@link oj.FetchByKeysResults}.
 * @export
 * @expose
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 * @ojsignature {target: "Type",
 *               value: "(parameters : FetchByKeysParameters<K>) : Promise<FetchByKeysResults<K, D>>"}
 * @example <caption>Fetch for keys 1001 and 556</caption>
 * var fetchKeys = [1001, 556];
 * dataprovider.fetchByKeys({keys: fetchKeys}).then(function(value) {
 *   // get the data for key 1001
 *   console.log(value.results.get(1001).data);
 * });
 */

/**
 * Fetch data by specifying the index to start the fetch and the number of rows to fetch.
 * @param {oj.FetchByOffsetParameters} parameters fetch by offset parameters
 * @return {Promise.<oj.FetchByOffsetResults>} Returns Promise which resolves to {@link oj.FetchByOffsetResults}.
 * @export
 * @expose
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 * @ojsignature {target: "Type",
 *               value: "(parameters: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>"}
 * @example <caption>Fetch by offset 5 rows starting at index 2</caption>
 * dataprovider.fetchByOffset({size: 5, offset: 2}).then(function(value) {
 *   var results = result['results'];
 *   var data = results.map(function(value) {
 *     return value['data'];
 *   });
 *   var keys = results.map(function(value) {
 *     return value['metadata']['key'];
 *   });
 * });
 */

/**
 * Get an asyncIterator which can be used to fetch a block of data.
 * @param {oj.FetchListParameters=} params fetch parameters
 * @return {AsyncIterable.<oj.FetchListResult>} AsyncIterable with {@link oj.FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name fetchFirst
 * @ojsignature {target: "Type",
 *               value: "(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>"}
 * @example <caption>Get an asyncIterator and then fetch first block of data by executing next() on the iterator. Subsequent blocks can be fetched by executing next() again.</caption>
 * var asyncIterator = dataprovider.fetchFirst(options)[Symbol.asyncIterator]();
 * asyncIterator.next().then(function(result) {
 *   var value = result.value;
 *   var data = value.data;
 *   var keys = value.metadata.map(function(val) {
 *     return val.key;
 * });
 */

/**
 * Returns a string that indicates if this data provider is empty.  Valid values are:
 * <ul>
 * <li>"yes": this data provider is empty.</li>
 * <li>"no": this data provider is not empty.</li>
 * <li>"unknown": it is not known if this data provider is empty until a fetch is made.</li>
 * </ul>
 * @return {"yes" | "no" | "unknown"} string that indicates if this data provider is empty
 * @export
 * @expose
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name isEmpty
 * @ojsignature {target: "Type",
 *               value: "(): 'yes' | 'no' | 'unknown'"}
 * @example <caption>Check if empty</caption>
 * var isEmpty = dataprovider.isEmpty();
 * console.log('DataProvider is empty: ' + isEmpty);
 */

/**
 * Add a callback function to listen for a specific event type.
 *
 * @export
 * @expose
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name addEventListener
 * @param {string} eventType The event type to listen for.
 * @param {EventListener} listener The callback function that receives the event notification.
 * @method
 * @name addEventListener
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * Remove a listener previously registered with addEventListener.
 *
 * @export
 * @expose
 * @memberof IndexerModelTreeDataProvider
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
 * @export
 * @expose
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 * @param {Event} event The event object to dispatch.
 * @return {boolean} Return false if a registered listener has cancelled the event. Return true otherwise.
 * @ojsignature {target: "Type",
 *               value: "(evt: Event): boolean"}
 */

  return IndexerModelTreeDataProvider;
});