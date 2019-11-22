/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojindexer', 'ojs/ojdatasource-common'],
/*
* @param {Object} oj 
* @param {jQuery} $
*/
function(oj, $)
{
  "use strict";


/**
 * Implementation of the IndexerModel and TreeDataSource based on an array of data set.
 * This should be used with the Indexer and its associated ListView.
 * By default, this adapter groups the data based on the first letter of the data and the alphabet of the current locale.
 * @ojdeprecated {since: '7.0.0', description: 'Use IndexerModelTreeDataProvider instead.'}
 * @class oj.IndexerModelTreeDataSource
 * @classdesc TreeDataSource and IndexerModel implementation that represents hierachical data available from an array of JSON objects.  This data source can be used by [Indexer]{@link oj.ojIndexer} and
 *            associated [ListView]{@link oj.ojListView}.<br><br>
 *            See the <a href="../jetCookbook.html?component=indexer&demo=characterIndexer">Indexer - Basic</a> demo for an example.<br><br>
 *            Refer to {@link oj.TreeDataSource} for other data sources that represent hierarachical data.
 * @param {Array.<any>} data an array of data used for Indexer and ListView
 * @param {string} idAttribute the id attribute of the data
 * @param {function(Object)|function(string)} listener a callback function that handles when a section becomes current (user clicks on the section in the Indexer).
 *                   the function takes the current section and must return a Promise which when resolve returns the section in which the ListView
 *                   actually scrolls to.
 * @param {Object=} options the options set on this IndexerModelTreeDataSource
 * @param {(Array.<string>|Array.<Object>)=} options.sections the set of sections to use with the Indexer.  If not specified, then the sections are derived from the alphabet of the current locale.
 * @param {string=} options.groupingAttribute the attribute of the data where grouping is based on, mandatory if no groupingStrategy is specified.
 * @param {function(Object)=} options.groupingStrategy a callback function that takes a data and returns the section that the data belongs to.  If no groupingStrategy is specified,
 *                   then the default grouping strategy based on the first letter of the data is used.
 * @param {function(Object, Object)=} options.sortComparatorFunction a comparator function that is used to sort data within a section.  If not specified, then
 *                   the items within a section will not be sorted.
 * @ojsignature {target: "Type",
 *               value: "(section: string|object)=> Promise<string|object>",
 *               for: "listener"}
 * @ojsignature {target: "Type",
 *               value: "(data: any)=> string|object",
 *               for: "options.groupingStrategy"}
 * @ojsignature {target: "Type",
 *               value: "(section1: string|object, section2: string|object)=> number",
 *               for: "options.sortComparatorFunction"}
 * @constructor
 * @final
 * @since 3.0
 * @export
 * @ojtsignore
 * @extends oj.TreeDataSource
 * @implements oj.IndexerModel
 */
oj.IndexerModelTreeDataSource = function (data, idAttribute, listener, options) {
  this.data = data;
  this.idAttr = idAttribute;
  this.listener = listener;
  this.options = options;
  this.Init();
}; // Subclass from oj.TreeDataSource


oj.Object.createSubclass(oj.IndexerModelTreeDataSource, oj.TreeDataSource, 'oj.IndexerModelTreeDataSource');
/**
 * Initializes the instance.
 * @return {void}
 * @export
 * @expose
 * @memberof oj.IndexerModelTreeDataSource
 * @ojtsignore
 * @instance
 */

oj.IndexerModelTreeDataSource.prototype.Init = function () {
  // call super
  oj.IndexerModelTreeDataSource.superclass.Init.call(this);
  var sections = this.options.sections;

  if (sections == null) {
    var resource = oj.Translations.getTranslatedString('oj-ojIndexer.indexerCharacters');
    sections = resource.split('|');
  }

  sections.push(oj.IndexerModel.SECTION_OTHERS);
  var strategy = this.options.groupingStrategy;

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

  var sortComparator = this.options.sortComparatorFunction;
  this.data = this.data.sort(function (a, b) {
    var section1 = strategy(a);
    var section2 = strategy(b);
    var index1 = sections.indexOf(section1);
    var index2 = sections.indexOf(section2);
    var diff = index1 - index2; // used specified sort comparator function to sort within section

    if (diff === 0 && sortComparator) {
      return sortComparator(a, b);
    }

    return diff;
  });
  var current; // figure out the position of the buckets for quick lookup

  for (var i = 0; i < this.data.length; i++) {
    var section = strategy(this.data[i]);

    if (current !== section) {
      current = section;

      this._set(section, i);
    }
  }

  this.sections = sections;
}; // TODO: use Map when we can use it for all supported platforms

/**
 * @private
 */


oj.IndexerModelTreeDataSource.prototype._set = function (key, value) {
  if (this.pos == null) {
    this.pos = [];
  }

  this.pos.push({
    key: key,
    value: value
  });
};
/**
 * @private
 */


oj.IndexerModelTreeDataSource.prototype._get = function (key) {
  for (var i = 0; i < this.pos.length; i++) {
    if (this.pos[i].key === key) {
      return this.pos[i].value;
    }
  }

  return null;
};
/** **************** IndexerModel *******************/

/**
 * Returns an array of objects each representing a section in the associated ListView.
 * @return {Array.<string>|Array.<Object>} an array of all indexable sections
 * @export
 * @expose
 * @memberof oj.IndexerModelTreeDataSource
 * @instance
 */


oj.IndexerModelTreeDataSource.prototype.getIndexableSections = function () {
  // remove other sections from this.sections
  return this.sections.slice(0, this.sections.length - 1);
};
/**
 * Returns an array of objects each representing a section that does not have a corresponding section in the associated ListView.
 * It must be a subset of the return value of <code>getIndexableSections</code>.  Return null or undefined if there's nothing missing.
 * @return {Array.<string>|Array.<Object>} an array of missing sections
 * @export
 * @expose
 * @memberof oj.IndexerModelTreeDataSource
 * @instance
 */


oj.IndexerModelTreeDataSource.prototype.getMissingSections = function () {
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
};
/**
 * Make a section current in the Indexer.  The implementation should scroll the associated ListView so that the section becomes visible.
 * @param {string|Object} section the current section
 * @return {Promise.<string>|Promise.<Object>} a Promise which when resolved will return the section that the associated ListView actually scrolls to.
 *                   For example, the implementation could choose to scroll to the next available section in ListView if no data
 *                   exists for that section.
 * @export
 * @expose
 * @memberof oj.IndexerModelTreeDataSource
 * @instance
 */


oj.IndexerModelTreeDataSource.prototype.setSection = function (section) {
  return this.listener.call(this, section);
};
/** **************** TreeDataSource *******************/

/**
 * Returns the number of children for a specified parent.  If the value returned is not >= 0 then it is automatically assumed
 * that the child count is unknown.
 * @param {any} parentKey the parent key.  Specify null if inquiring child count of the root.
 * @return {number} the number of children for the specified parent.
 * @export
 * @expose
 * @memberof oj.IndexerModelTreeDataSource
 * @instance
 */


oj.IndexerModelTreeDataSource.prototype.getChildCount = function (parentKey) {
  if (parentKey == null) {
    var count = this.sections.length - this.getMissingSections().length; // exclude other section if there are no entries in it

    return this._get(oj.IndexerModel.SECTION_OTHERS) != null ? count : count - 1;
  }

  var pos = this._get(parentKey);

  if (pos != null) {
    var index = this.sections.indexOf(parentKey); // if it's the last section

    if (index === this.sections.length - 1) {
      return this.data.length - pos;
    }

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

    return nextPos - pos;
  } // should not get here (ex: unexpected parentKey)


  return 0;
};
/**
 * Fetch the children
 * @param {any} parentKey the parent key.  Specify null if fetching children from the root.
 * @param {Object} range information about the range, it must contain the following properties: start, count.
 * @param {number} range.start the start index of the range in which the children are fetched.
 * @param {number} range.count the size of the range in which the children are fetched.
 * @param {Object} callbacks the callbacks to be invoke when fetch children operation is completed.  The valid callback
 *        types are "success" and "error".
 * @param {function(oj.NodeSet)} callbacks.success the callback to invoke when fetch completed successfully.
 * @param {function({status: *})=} callbacks.error the callback to invoke when fetch children failed.
 * @param {Object=} options optional parameters for this operation.
 * @param {boolean=} options.queueOnly true if this fetch request is to be queued and not execute yet.  The implementation must maintain
 *        the order of the fetch operations.  When queueOnly is false/null/undefined, any queued fetch operations are then
 *        flushed and executed in the order they are queued.  This flag is ignored if the datasource does not support batching.
 * @return {void}
 * @export
 * @expose
 * @memberof oj.IndexerModelTreeDataSource
 * @instance
 */


oj.IndexerModelTreeDataSource.prototype.fetchChildren = function ( // eslint-disable-next-line no-unused-vars
parentKey, range, callbacks, options) {
  var nodeSet;
  var self = this;

  if (parentKey == null) {
    // root case
    var available = this.sections.filter(function (section) {
      return self._get(section) != null;
    });
    nodeSet = {
      getParent: function getParent() {
        return parentKey;
      },
      getStart: function getStart() {
        return 0;
      },
      getCount: function getCount() {
        return available.length;
      },
      getData: function getData(index) {
        return available[index];
      },
      getMetadata: function getMetadata(index) {
        return {
          key: available[index],
          leaf: false,
          depth: 0
        };
      }
    };
  } else {
    nodeSet = {
      getParent: function getParent() {
        return parentKey;
      },
      getStart: function getStart() {
        return 0;
      },
      getCount: function getCount() {
        return self.getChildCount(parentKey);
      },
      getData: function getData(index) {
        return self.data[self._get(parentKey) + index];
      },
      getMetadata: function getMetadata(index) {
        var data = self.data[self._get(parentKey) + index];
        return {
          key: self.idAttr != null ? data[self.idAttr] : data,
          leaf: true,
          depth: 1
        };
      }
    };
  } // invoke original success callback


  if (callbacks != null && callbacks.success != null) {
    callbacks.success.call(null, nodeSet);
  }
};
/**
 * Returns the current sort criteria of the tree data.
 * @return {Object} the current sort criteria.  It should contain the following properties: key, direction where
 *         criteria.key the key identifying the attribute (column) to sort on.  Value is null if it's not sorted.
 *         criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @ojsignature {target: "Type",
 *               value: "{key: any, direction: 'ascending'|'descending'|'none'}",
 *               for: "returns"}
 * @export
 * @expose
 * @memberof oj.IndexerModelTreeDataSource
 * @instance
 */


oj.IndexerModelTreeDataSource.prototype.getSortCriteria = function () {
  return {
    key: null,
    direction: 'none'
  };
};

});