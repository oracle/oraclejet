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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var IndexerModelTreeDataProvider = /*#__PURE__*/function () {
  function IndexerModelTreeDataProvider(data, options) {
    _classCallCheck(this, IndexerModelTreeDataProvider);

    this.data = data;
    this.options = options;
    var sections = options.sections;

    if (sections == null) {
      var resource = Translations.getTranslatedString('oj-ojIndexer.indexerCharacters');
      sections = resource.split('|');
    }

    sections.push(oj.IndexerModel.SECTION_OTHERS);
    var strategy = options.groupingStrategy;

    if (strategy == null) {
      // if no grouping strategy is specified, use the default which groups based on the first charactor
      // of the data
      var field = this.options.groupingAttribute;

      strategy = function strategy(value) {
        var content = value[field] ? value[field] : value;
        var char = content.toString().toUpperCase()[0];
        return sections.indexOf(char) > -1 ? char : oj.IndexerModel.SECTION_OTHERS;
      };
    }

    data = data.sort(function (a, b) {
      var section1 = strategy(a);
      var section2 = strategy(b);
      var index1 = sections.indexOf(section1);
      var index2 = sections.indexOf(section2);
      return index1 - index2;
    });
    var current; // figure out the position of the buckets for quick lookup

    for (var i = 0; i < this.data.length; i++) {
      var section = strategy(this.data[i]);

      if (current !== section) {
        current = section;

        this._set(section, i);
      }
    }

    var self = this;
    var available = sections.filter(function (aSection) {
      return self._get(aSection) != null;
    });
    this.sections = sections;
    this.baseDataProvider = new ArrayDataProvider(available, {
      keys: available
    });
  } // TODO: use Map when we can use it for all supported platforms


  _createClass(IndexerModelTreeDataProvider, [{
    key: "_set",
    value: function _set(key, value) {
      if (this.pos == null) {
        this.pos = [];
      }

      this.pos.push({
        key: key,
        value: value
      });
    }
  }, {
    key: "_get",
    value: function _get(key) {
      for (var i = 0; i < this.pos.length; i++) {
        if (this.pos[i].key === key) {
          return this.pos[i].value;
        }
      }

      return null;
    }
    /** **************** IndexerModel *******************/

  }, {
    key: "getIndexableSections",
    value: function getIndexableSections() {
      // remove other sections from this.sections
      return this.sections.slice(0, this.sections.length - 1);
    }
  }, {
    key: "getMissingSections",
    value: function getMissingSections() {
      if (this.missing == null) {
        var missing = []; // figure out what's missing, skip the others section since it's always available

        for (var i = 0; i < this.sections.length - 1; i++) {
          var section = this.sections[i];

          if (this._get(section) == null) {
            missing.push(section);
          }
        }

        this.missing = missing;
      }

      return this.missing;
    }
  }, {
    key: "setSection",
    value: function setSection(section) {
      if (this.options.sectionChangeHandler) {
        return this.options.sectionChangeHandler.call(this, section);
      }

      return Promise.resolve(section);
    }
    /** **************** TreeDataProvider *******************/

  }, {
    key: "getChildDataProvider",
    value: function getChildDataProvider(parentKey, options) {
      if (parentKey === null) {
        return this;
      }

      var section = parentKey;
      var index = this.sections.indexOf(section);

      if (index > -1) {
        var childData;

        var pos = this._get(parentKey);

        if (pos != null) {
          // if it's the last section
          if (index === this.sections.length - 1) {
            childData = this.data.slice(pos);
          } else {
            index += 1;
            var next = this.sections[index];

            var nextPos = this._get(next);

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
        } else {
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
  }, {
    key: "getCapability",
    value: function getCapability(capabilityName) {
      return this.baseDataProvider.getCapability(capabilityName);
    }
  }, {
    key: "getTotalSize",
    value: function getTotalSize() {
      return this.baseDataProvider.getTotalSize();
    }
  }, {
    key: "containsKeys",
    value: function containsKeys(params) {
      return this.baseDataProvider.containsKeys(params);
    }
  }, {
    key: "fetchByKeys",
    value: function fetchByKeys(params) {
      return this.baseDataProvider.fetchByKeys(params);
    }
  }, {
    key: "fetchByOffset",
    value: function fetchByOffset(params) {
      return this.baseDataProvider.fetchByOffset(params);
    }
  }, {
    key: "fetchFirst",
    value: function fetchFirst(params) {
      return this.baseDataProvider.fetchFirst(params);
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.baseDataProvider.isEmpty();
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(eventType, listener) {
      this.baseDataProvider.addEventListener(eventType, listener);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(eventType, listener) {
      this.baseDataProvider.removeEventListener(eventType, listener);
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(evt) {
      return this.baseDataProvider.dispatchEvent(evt);
    }
  }]);

  return IndexerModelTreeDataProvider;
}(); // make it available internally for backward compatibility and norequire case


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