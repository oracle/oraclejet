/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
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
            return new ArrayTreeDataProvider(childData, {
                keyAttributes: this.options.keyAttributes,
                sortComparators: this.options.sortComparators,
                implicitSort: this.options.implicitSort
            });
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
 *            Refer to {@link TreeDataProvider} for other data providers that represent hierarachical data.
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
 * @param {SortComparators=} options.sortComparators a comparator function that is used to sort data within a section.
 * @param {Array.<SortCriterion>=} options.implicitSort array of SortCriterion used to specify sort information when the data loaded into the DataProvider is already sorted.
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
 * @implements TreeDataProvider
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

/**
 * @inheritdoc
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name getChildDataProvider
 */

/**
 * @inheritdoc
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * @inheritdoc
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name fetchFirst
 */

/**
 * @inheritdoc
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * @inheritdoc
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * @inheritdoc
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * @inheritdoc
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * @inheritdoc
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * @inheritdoc
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @inheritdoc
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @inheritdoc
 * @memberof IndexerModelTreeDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 */


  return IndexerModelTreeDataProvider;
});