/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdatasource-common'], 
/*
* @param {Object} oj 
* @param {jQuery} $
*/
function(oj, $, Components)
{
  "use strict";
var __oj_row_expander_metadata = 
{
  "properties": {
    "context": {
      "type": "object",
      "properties": {
        "datasource": {
          "type": "oj.DataProvider<K, D>"
        },
        "keys": {
          "type": "object",
          "properties": {
            "row": {
              "type": "K"
            },
            "column": {
              "type": "K"
            }
          }
        },
        "key": {
          "type": "K"
        },
        "parentKey": {
          "type": "K"
        },
        "treeDepth": {
          "type": "number"
        },
        "isLeaf": {
          "type": "boolean"
        }
      }
    },
    "expanded": {
      "type": "boolean",
      "writeback": true
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "accessibleLevelDescription": {
          "type": "string"
        },
        "accessibleRowCollapsed": {
          "type": "string"
        },
        "accessibleRowDescription": {
          "type": "string"
        },
        "accessibleRowExpanded": {
          "type": "string"
        },
        "accessibleStateCollapsed": {
          "type": "string"
        },
        "accessibleStateExpanded": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "refresh": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojExpand": {},
    "ojCollapse": {}
  },
  "extension": {}
};


/**
 * Convenient class that represents an empty node set
 * @param {any} parent the parent key
 * @param {number} start the start index
 * @constructor
 * @final
 * @since 1.0
 * @ojtsignore
 * @export
 */
oj.EmptyNodeSet = function (parent, start) {
  this.m_parent = parent;
  this.m_start = start;
};

/**
 * Gets the parent
 * @return {any} the key of the parent.
 * @export
 */
oj.EmptyNodeSet.prototype.getParent = function () {
  return this.m_parent;
};

/**
 * Gets the start index of the result set.
 * @return {number} the start index of the result set.
 * @export
 */
oj.EmptyNodeSet.prototype.getStart = function () {
  return this.m_start;
};

/**
 * Gets the actual count of the result set.
 * @return {number} the actual count of the result set.
 * @export
 */
oj.EmptyNodeSet.prototype.getCount = function () {
  return 0;
};

/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds.
 * @param {number} index the index of the node/row in which we want to retrieve the data from.
 * @return {null} the data for the specified index.
 * @export
 */
// eslint-disable-next-line no-unused-vars
oj.EmptyNodeSet.prototype.getData = function (index) {
  return null;
};

/**
 * Gets the metadata of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds.
 * The metadata that the data source must return are:
 *  1) key - Object, the key of the node/row.
 *  2) state - state of the node, valid values are 'expanded', 'collapsed', 'leaf'.
 *  3) depth - number, the depth of the node/row.
 * @param {number} index the index of the node/row in which we want to retrieve the metadata from.
 * @return {null} the metadata object for the specific index.
 * @export
 */
// eslint-disable-next-line no-unused-vars
oj.EmptyNodeSet.prototype.getMetadata = function (index) {
  return null;
};



/**
 * Flattens a hierarchical node set, which can happen in node set returned from
 * fetchDescendants call.
 * @param {Object} nodeSet the node set to flatten
 * @param {number=} actualStart in the fetch descendant case the result set would
 *        be a subset of the node set.  This param gives the exact start index in the
 *        wrapped node set where the result should start.
 * @constructor
 * @final
 * @since 1.0
 * @ojtsignore
 * @export
 */
oj.FlattenedNodeSet = function (nodeSet, actualStart) {
  this.m_nodeSet = nodeSet;
  this.m_start = actualStart;
};

/**
 * Gets the parent
 * @return {Object} the key of the parent.
 * @export
 */
oj.FlattenedNodeSet.prototype.getParent = function () {
  return this.m_nodeSet.getParent();
};

/**
 * Gets the start index of the result set.
 * @return {number} the start index of the result set.
 * @export
 */
oj.FlattenedNodeSet.prototype.getStart = function () {
  // if explicit start index is specified, use it, otherwise
  // delegate to wrapped node set
  if (this.m_start != null) {
    return this.m_start;
  }

  return this.m_nodeSet.getStart();
};

/**
 * Gets the actual count of the result set.
 * @return {number} the actual count of the result set.
 * @export
 */
oj.FlattenedNodeSet.prototype.getCount = function () {
  // see if it's calculated already
  if (this.m_count === undefined) {
    this.m_count = this._getCount(this.m_nodeSet, 0);

    // if explicit start is specified (subset), need to take that into
    // account when calculating total count
    if (this.m_start != null) {
      this.m_count = this.m_count - this.m_start;
    }
  }

  return this.m_count;
};

/**
 * Recursive function to calculate the total number of nodes in the node set.
 * @param {Object} nodeSet the node set to calculate count
 * @param {number} total the total number of nodes so far
 * @return {number} the total number of nodes
 * @private
 */
oj.FlattenedNodeSet.prototype._getCount = function (nodeSet, total) {
  var resultTotal = total;
  var start = nodeSet.getStart();
  var count = nodeSet.getCount();
  resultTotal += count;

  // if there's child node set
  if (nodeSet.getChildNodeSet) {
    for (var i = 0; i < count; i++) {
      var child = nodeSet.getChildNodeSet(i + start);
      if (child != null) {
        resultTotal = this._getCount(child, resultTotal);
      }
    }
  }

  return resultTotal;
};

/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds.
 * @param {number} index the index of the node/row in which we want to retrieve the data from.
 * @return {Object} the data for the specified index.
 * @export
 */
oj.FlattenedNodeSet.prototype.getData = function (index) {
  return this._getDataOrMetadata(this.m_nodeSet, index,
                                 { index: this.m_nodeSet.getStart() },
                                 this._getData);
};

/**
 * Gets the metadata of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds.
 * The metadata that the data source must return are:
 *  1) key - Object, the key of the node/row.
 *  2) state - state of the node, valid values are 'expanded', 'collapsed', 'leaf'.
 *  3) depth - number, the depth of the node/row.
 * @param {number} index the index of the node/row in which we want to retrieve the metadata from.
 * @return {Object} the metadata object for the specific index.
 * @export
 */
oj.FlattenedNodeSet.prototype.getMetadata = function (index) {
  return this._getDataOrMetadata(this.m_nodeSet, index,
                                 { index: this.m_nodeSet.getStart() },
                                 this._getMetadata);
};

/**
 * Callback function to retrieve metadata of specified index in node set
 * @param {Object} nodeSet the node set to retrieve metadata from
 * @param {number} index the index to retrieve metadata from
 * @return {Object} the metadata
 * @private
 */
oj.FlattenedNodeSet.prototype._getMetadata = function (nodeSet, index) {
  return nodeSet.getMetadata(index);
};

/**
 * Callback function to retrieve data of specified index in node set
 * @param {Object} nodeSet the node set to retrieve data from
 * @param {number} index the index to retrieve data from
 * @return {Object} the data
 * @private
 */
oj.FlattenedNodeSet.prototype._getData = function (nodeSet, index) {
  return nodeSet.getData(index);
};

/**
 * Retrieve data or metadata (depending on callback function) from the node set
 * @param {Object} nodeSet the node set to retrieve data from
 * @param {number} index the index to retrieve data from
 * @param {Object} current contains the current index keep track by the method
 * @param {function(Object, number)} func the callback function to retrieve data or metadata
 * @return {Object} the data or metadata
 * @private
 */
oj.FlattenedNodeSet.prototype._getDataOrMetadata = function (nodeSet, index, current, func) {
  // walk the node set recursively until we found the index
  var start = nodeSet.getStart();
  var count = nodeSet.getCount();
  for (var i = 0; i < count; i++) {
    var currIndex = current.index;
    // found the index
    if (currIndex === index) {
      return func.call(this, nodeSet, i + start);
    }

    // eslint-disable-next-line no-param-reassign
    current.index = currIndex + 1;
    // if there's child node set
    if (nodeSet.getChildNodeSet) {
      var child = nodeSet.getChildNodeSet(i + start);
      if (child != null) {
        var result = this._getDataOrMetadata(child, index, current, func);
        if (result != null) {
          return result;
        }
      }
    }
  }

  return null;
};



/**
 * Combines two NodeSets together into one.
 * @param {Object} nodeSet1 the first node set
 * @param {Object} nodeSet2 the second node set
 * @param {any} mergeAt the row key on the first node set where the second node set is merge to
 * @constructor
 * @final
 * @since 1.0
 * @ojtsignore
 * @export
 */
oj.MergedNodeSet = function (nodeSet1, nodeSet2, mergeAt) {
  this.m_nodeSet1 = nodeSet1;
  this.m_nodeSet2 = nodeSet2;
  this.m_mergeAt = this._findIndex(mergeAt);
};

/**
 * Retrieve the index of the key within the first node set
 * Which is going to be the index where the two node set merge
 * @param {any} key the key to find the index
 * @return {number} the index of the key within the first node set, if index is not found, then the last index of the first node set is returned.
 * @private
 */
oj.MergedNodeSet.prototype._findIndex = function (key) {
  var start = this.m_nodeSet1.getStart();
  var end = start + this.m_nodeSet1.getCount();
  for (var i = start; i < end; i++) {
    var rowKey = this.m_nodeSet1.getMetadata(i).key;
    if (key === rowKey) {
      return i;
    }
  }

  // if the point cannot be found, the merge happens at the end
  return (end - 1);
};

/**
 * Gets the parent
 * @return {any} the key of the parent.
 * @export
 */
oj.MergedNodeSet.prototype.getParent = function () {
  // returns the parent of the top node set
  return this.m_nodeSet1.getParent();
};

/**
 * Gets the start index of the result set.
 * @return {number} the start index of the result set.
 * @export
 */
oj.MergedNodeSet.prototype.getStart = function () {
  // returns the start of the top node set
  return this.m_nodeSet1.getStart();
};

/**
 * Gets the actual count of the result set.
 * @return {number} the actual count of the result set.
 * @export
 */
oj.MergedNodeSet.prototype.getCount = function () {
  // return the total count of both node sets
  return this.m_nodeSet1.getCount() + this.m_nodeSet2.getCount();
};

/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds.
 * @param {number} index the index of the node/row in which we want to retrieve the data from.
 * @return {Object} the data for the specified index.
 * @export
 */
oj.MergedNodeSet.prototype.getData = function (index) {
  var result = this._getRelativeIndex(index);
  var set = result.set;
  var relIndex = result.index;

  return set.getData(relIndex);
};

/**
 * Gets the metadata of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds.
 * The metadata that the data source must return are:
 *  1) key - Object, the key of the node/row.
 *  2) state - state of the node, valid values are 'expanded', 'collapsed', 'leaf'.
 *  3) depth - number, the depth of the node/row.
 * @param {number} index the index of the node/row in which we want to retrieve the metadata from.
 * @return {Object} the metadata object for the specific index.
 * @export
 */
oj.MergedNodeSet.prototype.getMetadata = function (index) {
  var result = this._getRelativeIndex(index);
  var set = result.set;
  var relIndex = result.index;

  return set.getMetadata(relIndex);
};

/**
 * Calculate the relative index to the appropriate node set based on where the
 * merge point is.
 * @private
 */
oj.MergedNodeSet.prototype._getRelativeIndex = function (index) {
  if (index <= this.m_mergeAt) {
    return { set: this.m_nodeSet1, index: index };
  }

  var count = this.m_nodeSet2.getCount();
  var end = this.m_mergeAt + count;
  if (index > end) {
    // first set
    return { set: this.m_nodeSet1, index: index - count };
  }

  // second set, do not assume the second node set is zero indexed
  return {
    set: this.m_nodeSet2,
    index: (index - this.m_mergeAt - 1) + this.m_nodeSet2.getStart()
  };
};


/**
 * Wraps around the NodeSet to provide additional metadata
 * @param {Object} nodeSet the node set to wrap
 * @param {function(Object, Object)} metadataCallback callback to inject additional metadata information
 * @param {Object=} range the requested range
 * @param {Array=} collapsedKeys an array of the collapsedKeys that should be passed in the expandAll case only
 * @constructor
 * @since 1.0
 * @ojtsignore
 * @ignore
 * @export
 */
oj.NodeSetWrapper = function (nodeSet, metadataCallback, range, collapsedKeys) {
  this.m_nodeSet = nodeSet;
  this.m_callback = metadataCallback;
  this.m_range = range;
  this.m_collapsedKeys = collapsedKeys;
};

/**
 * Gets the parent
 * @return {Object} the key of the parent.
 * @export
 */
oj.NodeSetWrapper.prototype.getParent = function () {
  return this.m_nodeSet.getParent();
};

/**
 * Gets the start index of the result set.
 * @return {number} the start index of the result set.
 * @export
 */
oj.NodeSetWrapper.prototype.getStart = function () {
  // if the requested start is a subset of the result set, adjust
  // accordingly
  if (this.m_range != null) {
    return this.m_range.start;
  }

  return this.m_nodeSet.getStart();
};

/**
 * Gets the actual count of the result set.
 * @return {number} the actual count of the result set.
 * @export
 */
oj.NodeSetWrapper.prototype.getCount = function () {
  var nodeStart = this.m_nodeSet.getStart();
  var nodeCount = this.m_nodeSet.getCount();

  // if the requested start is a subset of the NodeSet, adjust
  // accordingly
  if (this.m_range != null) {
    // if the count was provided it is to limit what may be beneath it
    nodeCount = Math.min(this.m_range.count, nodeCount);
    if (this.m_range.start < nodeStart) {
      // this is an invalid NodeSet, so just return 0
      nodeCount = 0;
    }
  }

  return nodeCount;
};

/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds.
 * @param {number} index the index of the node/row in which we want to retrieve the data from.
 * @return {Object} the data for the specified index.
 * @export
 */
oj.NodeSetWrapper.prototype.getData = function (index) {
  return this.m_nodeSet.getData(this._getRelativeIndex(index));
};

/**
 * Gets the metadata of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds.
 * The metadata that the data source must return are:
 *  1) key - Object, the key of the node/row.
 *  2) state - state of the node, valid values are 'expanded', 'collapsed', 'leaf'.
 *  3) depth - number, the depth of the node/row.
 * @param {number} index the index of the node/row in which we want to retrieve the metadata from.
 * @return {Object} the metadata object for the specific index.
 * @export
 */
oj.NodeSetWrapper.prototype.getMetadata = function (index) {
  var metadata = this.m_nodeSet.getMetadata(this._getRelativeIndex(index));
  metadata.index = index;
  metadata.parentKey = this.getParent();
  var rowKey = metadata.key;

  // inject additional metadata
  this.m_callback.call(null, rowKey, metadata);

  return metadata;
};

/**
 * Gets the node set child of the specified index.
 * @param {number} index the index of the node/row in which we want to retrieve the child node set
 * @return {Object|null} the child node set representing the child tree data.
 * @export
 */
oj.NodeSetWrapper.prototype.getChildNodeSet = function (index) {
  if (this.m_collapsedKeys == null ||
      this.m_collapsedKeys.indexOf(this.m_nodeSet.getMetadata(index).key) === -1) {
    if (this.m_nodeSet.getChildNodeSet) {
      var result = this.m_nodeSet.getChildNodeSet(index);
      if (result != null) {
        // wraps the child nodeset too
        return new oj.NodeSetWrapper(result, this.m_callback, null, this.m_collapsedKeys);
      }
    }
  }
  return null;
};

/**
 * Gets the relative index to the underlying nodeSet. Since the nodeSetWrapper basically adjusts the indexes relative the flattened model
 * where the wrapped node set indexes are relative to the parent node.
 * @param {number} index the index of the node/row in which we want to retrieve the index of in child node set
 * @return {number} the index of the node in the wrapped node set
 * @private
 */
oj.NodeSetWrapper.prototype._getRelativeIndex = function (index) {
  if (this.m_range == null) {
    return index;
  }
  return (index - this.m_range.start) + this.m_nodeSet.getStart();
};



/**
 * Base class for FlattenedTreeDataGridDataSource and FlattenedTreeTableDataSource
 * @param {Object} treeDataSource the instance of TreeDataSource to flattened
 * @param {Object=} options the options set on the FlattenedDataSource
 * @constructor
 * @final
 * @since 1.0
 * @export
 * @ojtsignore
 * @extends oj.DataSource
 */
oj.FlattenedTreeDataSource = function (treeDataSource, options) {
  this.m_wrapped = treeDataSource;
  this.m_options = options || {};
  oj.FlattenedTreeDataSource.superclass.constructor.call(this);
};

/**
 * Subclass FlattenedTreeDataSource to TreeDataSource
 * @private
 */
oj.Object.createSubclass(oj.FlattenedTreeDataSource, oj.DataSource, 'oj.FlattenedTreeDataSource');

/**
 * Initializes the data source.
 * @return {undefined}
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.Init = function () {
  // super
  oj.FlattenedTreeDataSource.superclass.Init.call(this);

  // we have to react if the underlying TreeDataSource has changed
  this.m_wrapped.on('change', this._handleModelEvent.bind(this));

  this.m_busy = false;

  // retrieves the fetch size against the underlying data source
  this.m_fetchSize = parseInt(this.m_options.fetchSize, 10);
  if (isNaN(this.m_fetchSize)) {
    this.m_fetchSize = 25;
  }
  // retrieves the maximum number of rows to fetch from the underlying data source
  // once the maximum count has been reached, this data source should stop fetching
  // until either a collapse occurs or a delete model change event.
  this.m_maxCount = parseInt(this.m_options.maxCount, 10);
  if (isNaN(this.m_maxCount)) {
    this.m_maxCount = 500;
  }

  // retrieves the initial expanded row keys.  If the expanded is specified to 'all',
  // then mark that all rows should be expanded initially.
  var expanded = this.m_options.expanded;
  if (Array.isArray(expanded)) {
    this.m_expandedKeys = expanded;
  } else {
    if (expanded === 'all') {
      // if expand all, we'll need to keep track of collapsed keys instead
      this.m_collapsedKeys = [];
    }
    // keep track of expanded row keys
    this.m_expandedKeys = [];
  }

  // cache to keep track of indexes
  // PRIVATE.  Subclass should never need to access this directly.
  // and implementation might change to use different form of caching strategy.
  this.m_cache = [];
};

/**
 * Handle the event
 * @param {string} eventType  event type
 * @param {Object} event  event
 * @return {boolean} Returns false if event is canceled
 * @export
 */
oj.FlattenedTreeDataSource.prototype.handleEvent = function (eventType, event) {
  return oj.FlattenedTreeDataSource.superclass.handleEvent.call(this, eventType, event);
};

/**
 * Destroy the data source.
 * @export
 * @return {undefined}
 */
oj.FlattenedTreeDataSource.prototype.Destroy = function () {
  // free internal cache
  delete this.m_cache;
  delete this.m_expandedKeys;
  delete this.m_collapsedKeys;
  if (this.m_queue) {
    delete this.m_queue;
  }

  // unload listener
  this.m_wrapped.off('change');

  // delegate to underlying data source
  if (this.m_wrapped.Destroy) {
    this.m_wrapped.Destroy();
  }
};

/**
 * Retrieves the fetch size
 * @return {number} the fetch size
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.getFetchSize = function () {
  return this.m_fetchSize;
};

/**
 * Retrieves the max count
 * @return {number} the max count
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.getMaxCount = function () {
  return this.m_maxCount;
};

/**
 * Retrieves the expanded row keys
 * @return {Array.<Object>|string} an array of expanded row keys or 'all' if
 *         all rows are expanded.
 * @export
 */
oj.FlattenedTreeDataSource.prototype.getExpandedKeys = function () {
  return this.m_expandedKeys;
};

/**
 * Retrieves the value of the specified option.
 * @param {string} option the option to retrieve the value.
 * @return {Object} the value of the specified option.  Returns null if the
 *         value is null or if the option is not recognized.
 * @export
 */
oj.FlattenedTreeDataSource.prototype.getOption = function (option) {
  if (this.m_options != null) {
    return this.m_options[option];
  }

  // unrecognized option or no options set
  return null;
};

/**
 * Retrieves the underlying TreeDataSource.
 * @return {Object} the underlying oj.TreeDataSource.
 * @export
 */
oj.FlattenedTreeDataSource.prototype.getWrappedDataSource = function () {
  return this.m_wrapped;
};

/**
 * Determine the actual fetch size to use.
 * @param {number} count the child count of the parent node to fetch on.
 * @private
 */
oj.FlattenedTreeDataSource.prototype._getFetchSizeToUse = function (count) {
  var fetchSize = this.getFetchSize();
  var maxCount = this.getMaxCount();

  if (fetchSize === -1) {
    if (count === -1) {
      return maxCount;
    }
    return count;
  }

  if (count === -1) {
    return Math.min(fetchSize, maxCount);
  }
  return fetchSize;
};

/**
 * Fetch a range of rows from the underlying data source.  This is a convenient method that
 * the subclasses should use to fetch from the underlying TreeDataSource.  This method will take
 * care of the index mapping between a flattened range to tree indexes.
 * @param {Object} range the range of rows to fetch.  This is the range in a flattened view.
 * @property {number} range.start the start of the range in a flattened view
 * @property {number} range.count the number of rows to fetch
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.fetchRows = function (range, callbacks) {
  this.m_busy = true;

  // check if we should fetch rows from descendants result set or walk the tree
  // to retrieve children
  if (this._isExpandAll()) {
    this._fetchRowsFromDescendants(range, callbacks);
  } else {
    this._fetchRowsFromChildren(range, callbacks);
  }
};

/**
 * Fetch a range of rows from the underlying TreeDataSource.
 * @param {Object} range the range of rows to fetch.  This is the range in a flattened view.
 * @property {number} range.start the start of the range in a flattened view
 * @property {number} range.count the number of rows to fetch
 * @protected
 */
oj.FlattenedTreeDataSource.prototype._fetchRowsFromChildren = function (range, callbacks) {
  var fetchRange;

  // this condition should always be true since in high-water mark scrolling we are
  // always asking for rows after the current last row
  if (range.start > this._getLastIndex()) {
    var maxFetchSize = this._getMaxFetchSize();
    // initial fetch
    if (this._getLastIndex() < 0) {
      fetchRange = {};
      fetchRange.start = range.start;
      // adjust fetch count if neccessary
      fetchRange.count = Math.min(maxFetchSize, range.count);
      this.m_wrapped.fetchChildren(null, fetchRange, {
        success: function (nodeSet) {
          this._handleFetchSuccess(nodeSet, null, 0, range, fetchRange, 0, callbacks);
        }.bind(this),
        error: function (status) {
          this._handleFetchError(status, callbacks);
        }.bind(this)
      });

      return;
    } else if (maxFetchSize > 0) {
      var lastEntry = this._getLastEntry();
      var parent = lastEntry.parent;
      var count = this.m_wrapped.getChildCount(parent);
      var index = lastEntry.index;
      var depth = lastEntry.depth;

      // see if we are fetching within the parent
      if (count === -1 || index < count - 1) {
        var fetchSize = this._getFetchSizeToUse(count);
        fetchRange = {};
        fetchRange.start = index + 1;
        if (count === -1) {
          fetchRange.count = Math.min(fetchSize, range.count);
        } else {
          fetchRange.count = Math.min(maxFetchSize,
                                      Math.min(Math.min(fetchSize, range.count),
                                               count - fetchRange.start));
        }
        this.m_wrapped.fetchChildren(parent, fetchRange, {
          success: function (nodeSet) {
            this._handleFetchSuccess(nodeSet, parent, depth, range, fetchRange, count, callbacks);
          }.bind(this),
          error: function (status) {
            this._handleFetchError(status, callbacks);
          }.bind(this)
        });
      } else {
        // if this is the last child within the parent, then we still need to see if there are ancestors available to fetch
        var lastEntryKey = lastEntry.key;
        var lastEntryCount = this.m_wrapped.getChildCount(lastEntryKey);
        var processed;

        if (this._isExpanded(lastEntryKey) && (lastEntryCount === -1 || lastEntryCount > 0)) {
          // if the last entry was expanded and has children fetch its children
          processed =
            this._fetchFromAncestors(lastEntry, depth + 1, range, callbacks, maxFetchSize);
        } else {
          // fetch size is greater than the number of children remaining to fetch
          // so we'll need to go up the path (recursively if necessary) and see if
          // if we need to fetch from ancestors.
          processed = this._fetchFromAncestors(parent, depth, range, callbacks, maxFetchSize);
        }
        if (!processed) {
          // nothing is used from node set, just return a empty node set
          var nodeSet = new oj.EmptyNodeSet(null, range.start);
          // invoke original success callback
          if (callbacks != null && callbacks.success != null) {
            callbacks.success.call(null, nodeSet);
          }
          // busy not handled by the _fetchFromAncestors in this case
          this.m_busy = false;
        }
      }
      return;
    }
  }

  // the only case we'll ended up here is if the max count has been reached or
  // for some reason the caller is asking for count = 0
  this.handleMaxCountReached(range, callbacks);
  // busy can't be set by max count reached because it can be overwritten by wrapped datasource
  this.m_busy = false;
};

/**
 * Checks whether a move operation is valid.
 * @param {any} rowToMove the key of the row to move
 * @param {any} referenceRow the key of the reference row which combined with position are used to determine
 *        the destination of where the row should moved to.
 * @param {number|string} position The position of the moved row relative to the reference row.
 *        This can be a string: "before", "after", "inside", "first", "last", or the zero based index to position
 *        the element at a specific point among the reference row's current children.
 * @return {string} returns "valid" if the move is valid, "invalid" otherwise.
 * @export
 */
oj.FlattenedTreeDataSource.prototype.moveOK = function (rowToMove, referenceRow, position) {
  return this.m_wrapped.moveOK(rowToMove, referenceRow, position);
};

/**
 * Moves a row from one location to another (different position within the same parent or a completely different parent)
 * @param {any} rowToMove the key of the row to move
 * @param {any} referenceRow the key of the reference row which combined with position are used to determine
 *        the destination of where the row should moved to.
 * @param {number|string} position The position of the moved row relative to the reference row.
 *        This can be a string: "before", "after", "inside", "first", "last", or the zero based index to position
 *        the element at a specific point among the reference row's current children.
 * @param {Object=} callbacks the callback to invoke when the move completed.
 * @property {function()} callbacks.success the callback to invoke when the move completed successfully.
 * @property {function({status: Object})} callbacks.error the callback to invoke when move failed.
 * @return {undefined}
 * @export
 */
oj.FlattenedTreeDataSource.prototype.move =
  function (rowToMove, referenceRow, position, callbacks) {
    this.m_wrapped.move(rowToMove, referenceRow, position, callbacks);
  };

/**
 * Determine the maximum possible fetch size.
 * @return {number} the maximum fetch size
 * @private
 */
oj.FlattenedTreeDataSource.prototype._getMaxFetchSize = function () {
  return this.getMaxCount() - (this._getLastIndex() + 1);
};

/**
 * Process error callback for fetchChildren operation before handing it back to original caller.
 * @param {Object} status the error status
 * @param {Object} callbacks the original callbacks passed to the fetch operation
 * @private
 */
oj.FlattenedTreeDataSource.prototype._handleFetchError = function (status, callbacks) {
  if (callbacks != null && callbacks.error != null) {
    callbacks.error.call(null, status);
  }

  this.m_busy = false;
};

/**
 * Process success callback for fetchChildren operation before handing it back to original caller.
 * @param {Object} nodeSet the set of fetched nodes
 * @param {Object} parent the parent key of the fetch operation
 * @param {number} depth the depth of the nodes
 * @param {Object} originalRange the request range for the fetch operation
 * @param {Object} requestedRange the request range for the fetch operation
 * @param {number} count the child count of the parent, -1 if count is unknown
 * @param {Object} callbacks the original callbacks passed to the fetch operation
 * @param {Object=} options the original callbacks passed to the fetch operation
 * @private
 */
oj.FlattenedTreeDataSource.prototype._handleFetchSuccess =
  function (nodeSet, parent, depth, originalRange, requestedRange, count, callbacks, options) {
    var toExpand = [];

    // first process the node set to get the rows to expand with the indexes
    this._processNodeSet(nodeSet, parent, depth, toExpand);

    var flattenedRange = { start: originalRange.start, count: nodeSet.getCount() };
    // eslint-disable-next-line no-param-reassign
    nodeSet = new oj.NodeSetWrapper(nodeSet, this.insertMetadata.bind(this), flattenedRange);

    // expand the fetched nodes to get the node set as full as possible from the original fetch
    if (toExpand.length !== 0) {
      // there are rows to expand, so we'll need to combine the nodeset after
      // we got the expanded nodeset
      var queue = [];
      queue.push(toExpand);

      // we'll reuse the syncExpandRows method, which is used to combine nested expanding
      // nodeset, the only difference is we'll include the callbacks here, see handleExpandSuccess method
      var prevNodeSetInfo = {};
      prevNodeSetInfo.callbacks =
      {
        success: function (newNodeSet) {
          this._verifyFetchResults(newNodeSet, parent, depth, originalRange,
                                     requestedRange, count, callbacks, options);
        }.bind(this),
        error: function (status) {
          this._handleFetchError(status, callbacks);
        }.bind(this)
      };
      prevNodeSetInfo.nodeSet = nodeSet;
      prevNodeSetInfo.keys = [];

      this._syncExpandRows(queue, prevNodeSetInfo);
    } else {
      this._verifyFetchResults(nodeSet, parent, depth, originalRange, requestedRange,
                               count, callbacks, options);
    }
  };

/**
 * Process success callback from fetchChildren, fetchFromAncestors or expand after a fetch children
 * @param {Object} nodeSet the set of fetched nodes
 * @param {Object} parent the parent key of the fetch operation
 * @param {number} depth the depth of the nodes
 * @param {Object} originalRange the request range for the fetch operation
 * @param {Object} requestedRange the request range for the fetch operation
 * @param {number} count the child count of the parent, -1 if count is unknown
 * @param {Object} callbacks the original callbacks passed to the fetch operation
 * @param {Object=} options the original callbacks passed to the fetch operation
 * @private
 */
oj.FlattenedTreeDataSource.prototype._verifyFetchResults =
  function (nodeSet, parent, depth, originalRange, requestedRange, count, callbacks, options) {
    var mergedNodeSet;
    var processed;

    if (options != null) {
      // if there is a previousNodeSet merge it with the new one to try and fulfill the original fetch size
      var prevNodeSet = options.prevNodeSet;
      if (prevNodeSet != null) {
        var lastNodeIndex = (prevNodeSet.getStart() + prevNodeSet.getCount()) - 1;
        var lastNodeKey = prevNodeSet.getMetadata(lastNodeIndex).key;
        mergedNodeSet = new oj.MergedNodeSet(prevNodeSet, nodeSet, lastNodeKey);
      }
    }

    // if the nodeSet contains less nodes than originally requested, attempt to fetch the remainder from the ancestors
    if (nodeSet.getCount() < originalRange.count && parent != null && depth > 0) {
      var remainingRange = {};
      remainingRange.start = originalRange.start + nodeSet.getCount();
      remainingRange.count = originalRange.count - nodeSet.getCount();

      var remainingOptions = {};
      remainingOptions.prevNodeSet = mergedNodeSet == null ? nodeSet : mergedNodeSet;

      processed = this._fetchFromAncestors(parent, depth, remainingRange,
                                           callbacks, undefined, remainingOptions);
    } else if (nodeSet.getCount() > originalRange.count) {
      // if we overfetched because of expanded children then trim the nodeSet by wrapping the nodeSet in the correct range
      var difference = nodeSet.getCount() - originalRange.count;
      if (mergedNodeSet != null) {
        mergedNodeSet = new oj.NodeSetWrapper(mergedNodeSet, this.insertMetadata.bind(this), {
          start: mergedNodeSet.getStart(),
          count: (mergedNodeSet.getCount() - difference)
        });
        // remove entries that will not be passed back via the wrapped range
        this._removeEntry(mergedNodeSet.getStart() + mergedNodeSet.getCount(), difference);
      } else {
        // eslint-disable-next-line no-param-reassign
        nodeSet = new oj.NodeSetWrapper(nodeSet, this.insertMetadata.bind(this), {
          start: nodeSet.getStart(),
          count: (nodeSet.getCount() - difference)
        });
        // remove entries that will not be passed back via the wrapped range
        this._removeEntry(nodeSet.getStart() + nodeSet.getCount(), difference);
      }
    }

    if (!processed) {
      if (callbacks != null && callbacks.success != null) {
        callbacks.success.call(null, mergedNodeSet == null ? nodeSet : mergedNodeSet);
      }
    }

    this.m_busy = false;
  };

/**
 * Returns the number of children for a specified parent.  If the value returned is not >= 0 then it is automatically assumed
 * that the child count is unknown.
 * @param {any} parent the parent key.  Specify null if inquiring child count of the root.
 * @return {number} the number of children for the specified parent.
 * @export
 */
oj.FlattenedTreeDataSource.prototype.getChildCount = function (parent) {
  return this.m_wrapped.getChildCount(parent);
};

/**
 * Go up ancestors and fetch build up fetch requests (if possible) until the fetch size is met.
 * @param {Object} parent the parent key of the fetch operation
 * @param {number} depth the depth of the nodes
 * @param {Object} callbacks the original callbacks passed to the fetch operation
 * @param {number=} maxFetchSize maximum fetch size, optional
 * @param {Object=} options
 * @return {boolean} true if results are fetched, false if nothing is fetched
 * @private
 */
oj.FlattenedTreeDataSource.prototype._fetchFromAncestors =
  function (parent, depth, range, callbacks, maxFetchSize, options) {
    var batchFetchOptions;

    var fetchedChildren = false;

    if (maxFetchSize === undefined) {
      // eslint-disable-next-line no-param-reassign
      maxFetchSize = this._getMaxFetchSize();
    }

    // fetch size is greater than the number of children remaining to fetch
    // so we'll need to go up the path (recursively if necessary) and see if
    // if we need to fetch from ancestors.
    if (this._isBatchFetching()) {
      batchFetchOptions = { queueOnly: true };
    }

    var fetchSize = this._getFetchSizeToUse(-1);
    var current = this._getLastIndex();
    var count;
    var fetchRange;
    var currDepth;

    // adjusted for loop i = current-1 to i = current.
    // this._getLastIndex automatically performs a -1
    // so no need to set that again.
    for (var i = current; i >= 0; i--) {
      var currEntry = this._getEntry(i);
      currDepth = currEntry.depth;
      if (currDepth < depth) {
        // eslint-disable-next-line no-param-reassign
        parent = currEntry.parent;
        count = this.m_wrapped.getChildCount(parent);
        var index = currEntry.index;

        var countUnknown = (count === -1);
        if (countUnknown || index < count - 1) {
          fetchRange = {};
          fetchRange.start = index + 1;
          if (countUnknown) {
            fetchRange.count = Math.min(maxFetchSize, Math.max(0, fetchSize));
            // if count is unknown, we cannot do batch fetch
            batchFetchOptions = undefined;
            // stop going up parents
          } else {
            fetchRange.count = Math.min(maxFetchSize,
                                        Math.min(fetchSize, count - fetchRange.start));
          }

          // if there's nothing to fetch, quit
          if (fetchRange.count === 0) {
            break;
          }

          // it's always attached at the end
          this.m_wrapped.fetchChildren(parent, fetchRange, {
            success: function (_parent, _currDepth, _fetchRange, _count, nodeSet) {
              this._handleFetchSuccess(nodeSet, _parent, _currDepth, range, _fetchRange,
                                       _count, callbacks, options);
            }.bind(this, parent, currDepth, fetchRange, count),
            error: function (status) {
              this._handleFetchError(status, callbacks);
            }.bind(this)
          }, batchFetchOptions);

          fetchedChildren = true;

          break;
        } else {
          // eslint-disable-next-line no-param-reassign
          depth -= 1;
        }
      }
    }

    // if batching is used, fire a final fetch children call to flush the queue
    if (batchFetchOptions != null) {
      this.m_wrapped.fetchChildren(parent, { start: range.count, count: 0 }, {
        success: function (nodeSet) {
          this._handleFetchSuccess(nodeSet, parent, currDepth, range, fetchRange,
                                   count, callbacks, options);
        }.bind(this),
        error: function (status) {
          this._handleFetchError(status, callbacks);
        }.bind(this)
      });
      fetchedChildren = true;
    }

    // return false if no results are fetched
    return fetchedChildren;
  };

/**
 * Walk the node set and do whatever processing is neccessary.
 * @param {Object} nodeSet the node set to process
 * @param {Object} parent the parent key of the nodes
 * @param {number} depth the depth of the nodes
 * @param {Array.<Object>=} toExpand the set of keys to be expand.  It is populated by this method.
 * @private
 */
oj.FlattenedTreeDataSource.prototype._processNodeSet = function (nodeSet, parent, depth, toExpand) {
  var nodeStart = nodeSet.getStart();
  var nodeCount = nodeSet.getCount();

  // walk the node set and populate the internal cache
  for (var i = 0; i < nodeCount; i++) {
    var metadata = nodeSet.getMetadata(nodeStart + i);
    var key = metadata.key;

    this._addEntry(key, depth, nodeStart + i, parent);

    if (this._isExpanded(key)) {
      // keep track of rows that needs to expand later
      toExpand.push(key);
    }
  }
};

/**
 * A hook for FlattenedTreeDataSource to inject additional metadata into the NodeSet
 * @param {Object} key the row key identifying the row
 * @param {Object} metadata the existing metadata to inject into
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.insertMetadata = function (key, metadata) {
  if (this._isExpanded(key) && !metadata.leaf) {
    // also update metadata with state info
    // eslint-disable-next-line no-param-reassign
    metadata.state = 'expanded';
  } else if (metadata.leaf) {
    // include state metadata for row expander to render correct icon
    // eslint-disable-next-line no-param-reassign
    metadata.state = 'leaf';
  } else {
    // eslint-disable-next-line no-param-reassign
    metadata.state = 'collapsed';
  }
};

/**
 * Fetch a range of rows from the underlying TreeDataSource using the fetchDescendants method.
 * @param {Object} range the range of rows to fetch.  This is the range in a flattened view.
 * @property {number} range.start the start of the range in a flattened view
 * @property {number} range.count the number of rows to fetch
 * @protected
 */
oj.FlattenedTreeDataSource.prototype._fetchRowsFromDescendants = function (range, callbacks) {
  // give implementation a hint of maximum to fetch, implementation can choose to ignore it
  var options = { maxCount: this.getMaxCount() };

  // give implementation a hint of where to start, implementation can choose to ignore it
  if (this._getLastIndex() >= 0) {
    options.start = this._getEntry(this._getLastIndex()).key;
  }

  // invoke method on TreeDataSource
  this.m_wrapped.fetchDescendants(null, {
    success: function (nodeSet) {
      this._handleFetchDescendantsSuccess(nodeSet, range, callbacks);
    }.bind(this),
    error: function (status) {
      this._handleFetchError(status, callbacks);
    }.bind(this)
  }, options);
};

/**
 * Returns the current sort criteria of the tree data.
 * @return {Object} the current sort criteria.  It should contain the following properties: key, direction where
 *         criteria.key the key identifying the attribute (column) to sort on.  Value is null if it's not sorted.
 *         criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @export
 */
oj.FlattenedTreeDataSource.prototype.getSortCriteria = function () {
  return this.m_wrapped.getSortCriteria();
};

/**
 * Process success callback for fetchDescendants operation before handing it back to original caller.
 * @param {Object} nodeSet the set of fetched nodes
 * @param {Object} range the request range for the fetch operation
 * @param {Object} callbacks the original callbacks passed to the fetch operation
 * @private
 */
oj.FlattenedTreeDataSource.prototype._handleFetchDescendantsSuccess =
  function (nodeSet, range, callbacks) {
    var options;
    var actualStart;
    var _nodeSet = nodeSet;

    // this condition should always be true since in high-water mark scrolling we are
    // always asking for rows after the current last row
    if (range.start > this._getLastIndex()) {
      var maxFetchSize = this._getMaxFetchSize();
      var count = Math.min(maxFetchSize, range.count);

      // wrap it to inject additional metadata
      _nodeSet = new oj.NodeSetWrapper(_nodeSet,
                                      this.insertMetadata.bind(this), null, this.m_collapsedKeys);

      if (this._getLastIndex() >= 0) {
        // in fetchDescendants case, the result node set would probably contains more than what
        // we would return.  The issue is we can't really use range to filter the set since the
        // range in the current view does not map one-to-one to the expand all node set as some
        // node might have been collapsed before the fetch.
        // the solution is to use the last cached entry to find where new data starts in the
        // result node set, and use range count to limit what to return
        var lastEntry = this._getLastEntry();
        options = { index: 0, found: false, count: 0 };
        this._processDescendantsNodeSet(_nodeSet, null, 0, lastEntry, count, options);
        actualStart = options.index + 1;
      } else {
        // initial fetch case, just specify the count to limit result
        options = { count: 0 };
        this._processDescendantsNodeSet(_nodeSet, null, 0, null, count, options);
        actualStart = 0;
      }

      if (callbacks != null && callbacks.success != null) {
        if (options != null) {
          if (options.count === 0) {
            // nothing is used from node set, just return a empty node set
            _nodeSet = new oj.EmptyNodeSet(null, range.start);
          } else {
            // wraps node set with a filter that only returns nodes that
            // have not been fetched already
            _nodeSet = new oj.FlattenedNodeSet(_nodeSet, actualStart);
          }
        } else {
          _nodeSet = new oj.FlattenedNodeSet(_nodeSet);
        }
        callbacks.success.call(null, _nodeSet);
      }
    } else {
      // the only case we'll ended up here is if the max count has been reached or
      // for some reason the caller is asking for count = 0
      this.handleMaxCountReached(range, callbacks);
    }

    this.m_busy = false;

    // process any outstanding operations
    this._processQueue();
  };

/**
 * Walk the node set and do whatever processing is neccessary.
 * @param {Object} nodeSet the node set to process
 * @param {Object} parent the parent key of the nodes
 * @param {number} depth the depth of the nodes
 * @param {Object} lastEntry the last fetched entry
 * @param {number} maxCount the maximum number of rows to process
 * @param {Object=} options this object carries information collected in this method
 * @private
 */
oj.FlattenedTreeDataSource.prototype._processDescendantsNodeSet =
  function (nodeSet, parent, depth, lastEntry, maxCount, options) {
    var nodeStart = nodeSet.getStart();
    var nodeCount = nodeSet.getCount();

    // walk the node set and populate the internal cache
    for (var i = 0; i < nodeCount; i++) {
      // see if we have enough results
      if (options.count === maxCount) {
        return;
      }

      var metadata = nodeSet.getMetadata(nodeStart + i);
      var key = metadata.key;

      // see if we need to check depth
      if (options.checkDepth) {
        if (lastEntry.depth >= depth) {
          // eslint-disable-next-line no-param-reassign
          options.found = true;
          // eslint-disable-next-line no-param-reassign
          options.checkDepth = false;
        }
      }

      if (lastEntry == null || options.found) {
        this._addEntry(key, depth, nodeStart + i, parent);

        // eslint-disable-next-line no-param-reassign
        options.count += 1;

        // include state metadata for row expander
        // in the fetchDescendants case the state is always 'expanded'
        if (metadata.leaf) {
          metadata.state = 'leaf';
        } else {
          metadata.state = 'expanded';
        }
      }

      // mark we found the entry in node set that matches the last key
      // the rest of node set we can start pushing to cache
      if (lastEntry != null && !options.found) {
        // we'll need to also check whether the last entry is expanded (or not leaf)
        // if it is collapsed, then we can't add any nodes from the node set until
        // we found child in the node set that has the same or lower depth in case no siblings
        // just next parent
        if (key === lastEntry.key) {
          if (metadata.leaf || this._isExpanded(key)) {
            // eslint-disable-next-line no-param-reassign
            options.found = true;
          } else {
            // collapsed.  Mark to check the depth of the next node before
            // setting found to true.
            // eslint-disable-next-line no-param-reassign
            options.checkDepth = true;
          }
        } else {
          // eslint-disable-next-line no-param-reassign
          options.index += 1;
        }
      }

      // process child node set, if any
      if (nodeSet.getChildNodeSet && this._isExpanded(key)) {
        var childNodeSet = nodeSet.getChildNodeSet(i);
        if (childNodeSet != null) {
          this._processDescendantsNodeSet(childNodeSet, key, depth + 1,
                                          lastEntry, maxCount, options);
        }
      }
    }
  };

/**
 * Expand the specified row.
 * @param {any} rowKey the key of the row to expand
 * @export
 * @return {undefined}
 */
oj.FlattenedTreeDataSource.prototype.expand = function (rowKey) {
  this._expand(rowKey);
};

/**
 * Expand the specified row with options
 * @param {any} rowKey the key of the row to expand
 * @param {Object=} options additional options to pass to fetchChildren method
 * @private
 */
oj.FlattenedTreeDataSource.prototype._expand = function (rowKey, options) {
  this.m_busy = true;

  var count = this.m_wrapped.getChildCount(rowKey);
  var fetchSize = this._getFetchSizeToUse(count);
  var maxCount = this.getMaxCount();

  // if cache is full, check if the rowKey is the last row, if it's
  // the last row do nothing
  if (this._getLastIndex() + 1 === maxCount) {
    var refIndex = this.getIndex(rowKey);
    if (refIndex === maxCount - 1) {
      // we'll still have to return an empty nodeset to trigger done to occur in handleExpandSuccess
      this.handleExpandSuccess(rowKey, new oj.EmptyNodeSet(rowKey, 0), 0, options);
      return;
    }
  }

  // nothing to do
  if (fetchSize === 0) {
    // we'll still have to return an empty nodeset to trigger done to occur in handleExpandSuccess
    this.handleExpandSuccess(rowKey, new oj.EmptyNodeSet(rowKey, 0), 0, options);
    return;
  }

  this.m_wrapped.fetchChildren(rowKey, { start: 0, count: fetchSize }, {
    success: function (nodeSet) {
      this.handleExpandSuccess(rowKey, nodeSet, count, options);
    }.bind(this),
    error: function (status) {
      this.handleExpandError(rowKey, status);
    }.bind(this)
  });
};

/**
 * Process any outstanding operation
 * @private
 */
oj.FlattenedTreeDataSource.prototype._processQueue = function () {
  if (this.m_queue && this.m_queue.length > 0) {
    for (var i = this.m_queue.length - 1; i >= 0; i--) {
      var op = this.m_queue[i];
      this.collapse(op.key);
    }

    // clear the queue
    this.m_queue.length = 0;
  }
};

/**
 * Queue an operation to be process later
 * @param {string} op the operation
 * @param {any} rowKey the row key where the operation is to be apply
 * @private
 */
oj.FlattenedTreeDataSource.prototype._queueOp = function (op, rowKey) {
  if (this.m_queue == null) {
    this.m_queue = [];
  }

  this.m_queue.push({ op: op, key: rowKey });
};

/**
 * Collapse the specified row.
 * @param {any} rowKey the key of the row to collapse
 * @return {undefined}
 * @export
 */
oj.FlattenedTreeDataSource.prototype.collapse = function (rowKey) {
  // if in the middle of fetch, queue up the operation
  if (this.m_busy) {
    this._queueOp('collapse', rowKey);
    return;
  }

  var rowIndex = this.getIndex(rowKey) + 1;
  var parent = this._getEntry(rowIndex - 1);

  // could happen if parent node has already collapsed
  if (parent == null) {
    return;
  }

  // keeping track of how many rows to remove
  var count = 0;

  var depth = parent.depth;
  var lastIndex = this._getLastIndex();
  for (var j = rowIndex; j < lastIndex + 1; j++) {
    var rowData = this._getEntry(j);
    var rowDepth = rowData.depth;
    if (rowDepth > depth) {
      count += 1;
    } else if (rowDepth === depth) {
      break;
    }
  }

  // nothing to do
  if (count === 0) {
    // still should fire an event to get the icon state updated properly
    this.handleEvent('collapse', { rowKey: rowKey });
    return;
  }

  // remove from expanded keys or add to collapsed keys
  if (this._isExpandAll()) {
    this.m_collapsedKeys.push(rowKey);
  } else {
    this._removeExpanded(rowKey);
  }

  // remove rows from view
  var keys = [];
  for (var i = 0; i < count; i++) {
    keys.push({ key: this._getEntry(rowIndex + i).key, index: rowIndex + i });
  }

  // remove from cache.  Note this has to be done before firing row remove event
  // since it could cause a fetch which relies on the internal cache being up to date.
  this._removeEntry(rowIndex, count);

  // (firing of event to view)
  this.removeRows(keys);

  // fire datasource event
  this.handleEvent('collapse', { rowKey: rowKey });
};

/**
 * Checks whether the row key is expanded.
 * @param {any} rowKey the key of the row to inquire the state
 * @return {boolean} true if the row is/should be expanded.  False otherwise.
 * @private
 */
oj.FlattenedTreeDataSource.prototype._isExpanded = function (rowKey) {
  if (this._isExpandAll()) {
    if (this.m_collapsedKeys && this.m_collapsedKeys.length > 0) {
      // call helper method to check collapsed keys
      return (this._getCollapsedKeyIndex(rowKey) === -1);
    }

    // everything expanded
    return true;
  }

  if (this.m_expandedKeys && this.m_expandedKeys.length > 0) {
    // call helper method to check expanded keys
    return (this._getExpandedKeyIndex(rowKey) > -1);
  }

  // nothing expanded
  return false;
};

/**
 * Helper method to retrieve the index of the row key in the set of collapsed row keys
 * @param {any} rowKey the key of the row
 * @return {number} the index of the key in the collapsed key array
 * @private
 */
oj.FlattenedTreeDataSource.prototype._getCollapsedKeyIndex = function (rowKey) {
  return this._getKeyIndex(this.m_collapsedKeys, rowKey);
};

/**
 * Helper method to retrieve the index of the row key in the set of expanded row keys
 * @param {any} rowKey the key of the row
 * @return {number} the index of the key in the expanded key array
 * @private
 */
oj.FlattenedTreeDataSource.prototype._getExpandedKeyIndex = function (rowKey) {
  return this._getKeyIndex(this.m_expandedKeys, rowKey);
};

/**
 * Helper method to retrieve the index of the row key in a specified array
 * @param {any} rowKey the key of the row
 * @return {number} the index of the key in the array
 * @private
 */
oj.FlattenedTreeDataSource.prototype._getKeyIndex = function (arr, rowKey) {
  var index = -1;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === rowKey) {
      index = i;
    }
  }

  return index;
};


/**
 * Remove the row key from the expanded cache
 * @param {any} rowKey the key to remove
 * @private
 */
oj.FlattenedTreeDataSource.prototype._removeExpanded = function (rowKey) {
  var index = this._getExpandedKeyIndex(rowKey);

  // index found, remove from array
  if (index > -1) {
    this.m_expandedKeys.splice(index, 1);
  }
};

/**
 * Remove the row key from the collapsed cache
 * @param {any} rowKey the key to remove
 * @private
 */
oj.FlattenedTreeDataSource.prototype._removeCollapsed = function (rowKey) {
  var index = this._getCollapsedKeyIndex(rowKey);

  // index found, remove from array
  if (index > -1) {
    this.m_collapsedKeys.splice(index, 1);
  }
};

/**
 * Callback method to handle fetch error on expand operation.
 * @param {any} rowKey the key of the expanded row
 * @param {Object} status the error status
 * @protected
 */
// eslint-disable-next-line no-unused-vars
oj.FlattenedTreeDataSource.prototype.handleExpandError = function (rowKey, status) {
  // fire event, todo: should include error msg?
  this.handleEvent('expand', { rowKey: rowKey });
};

/**
 * Callback method to handle fetch success on expand operation.
 * @param {any} rowKey the key of the expanded row
 * @param {Object} nodeSet the node set that describes the children of the expanded row
 * @param {number} childCount the total number of children the expanded row has
 * @param {Object=} options optional parameters to the method
 * @property {Object=} options.queue a queue of expanded rows remaining to process (depth first traversal)
 * @property {Object=} options.prevNodeSetInfo.nodeSet the node set from a previous expand call
 * @property {number=} options.prevNodeSetInfo.firstIndex the ref index for the FIRST expand call, this is needed when firing the insert event, where the insertion point is the first index
 * @property {Object=} options.prevNodeSetInfo.firstKey the ref row key for the FIRST expand call, this is needed when firing the insert event, where the insertion point is the first row key
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.handleExpandSuccess =
  function (rowKey, nodeSet, childCount, options) {
    var queue;
    var prevNodeSetInfo;

    // wrap it to inject additional metadata
    // eslint-disable-next-line no-param-reassign
    nodeSet = new oj.NodeSetWrapper(nodeSet, this.insertMetadata.bind(this));

    var refIndex = this.getIndex(rowKey) + 1;
    var rangeStart = refIndex;

    var rowStart = nodeSet.getStart();
    var rowCount = nodeSet.getCount();

    var parent = this._getEntry(refIndex - 1);
    var depth = parent.depth + 1;

    var toExpand = [];

    // go through the node set and insert an entry with info about the row into internal cache
    for (var i = rowStart; i < rowCount; i++) {
      var metadata = nodeSet.getMetadata(i);
      var key = metadata.key;
      if (this._isExpanded(key)) {
        // expand it if the user specified it to be expand (or the
        // parent was previously collapsed before and now expanded again,
        // the expanded child would need to be expanded also)
        toExpand.push(key);
      }

      // add to cache
      this._insertRow(refIndex, metadata, parent.key, i, depth);

      refIndex += 1;
    }

    // keep track of expanded row or collapsed row for expand all case
    if (this._isExpandAll()) {
      this._removeCollapsed(rowKey);
    } else if (this.m_expandedKeys.indexOf(rowKey) === -1) {
      // check whether it's already in expanded keys, which is the case
      // if it is expanded by initial expansion
      this.m_expandedKeys.push(rowKey);
    }

    // extract optional params
    if (options != null) {
      queue = options.queue;
      prevNodeSetInfo = options.prevNodeSetInfo;
    }

    // see if a previous nodeset has been set and merge with current one
    // so that we have one nodeset that includes expanded children, a single row insert event
    // is fired and the nodeset will be in the proper order
    if (prevNodeSetInfo != null) {
      // eslint-disable-next-line no-param-reassign
      nodeSet = new oj.MergedNodeSet(prevNodeSetInfo.nodeSet, nodeSet, rowKey);
    }

    // check if there's nothing else to expand and process queue is empty
    var done = (toExpand.length === 0 && (queue === undefined || queue.length === 0));
    if (done) {
      // fire event to insert the expanded rows
      if (prevNodeSetInfo != null) {
        // check if this is part of a fetchRows call
        var callbacks = prevNodeSetInfo.callbacks;
        if (callbacks != null) {
          // invoke fetch success callback
          callbacks.success.call(null, nodeSet);

          // we are done at this point, we don't fire insert events
          this.m_busy = false;
          return;
        }

        // use the reference insertion point from prevNodeSetInfo instead
        this.insertRows(prevNodeSetInfo.firstIndex, prevNodeSetInfo.firstKey, nodeSet);
      } else {
        this.insertRows(rangeStart, rowKey, nodeSet);
      }

      // if child count is > fetched or child count is unknown and requested fetch count is the same as result set size,
      // then delete all rows that comes after the reference row so that we can trigger a fetch when user scroll to the end
      // ALSO delete all rows that comes after reference row if the reference row is the last row (according to max row count)
      var maxCount = this.getMaxCount();
      if ((childCount === -1 && rowCount === this.getFetchSize()) ||
          childCount > rowCount || refIndex === maxCount) {
        this._deleteAllRowsBelow(refIndex);
      } else if (this._getLastIndex() >= maxCount) {
        // also clean up rows that goes beyond max row count after expand
        this._deleteAllRowsBelow(maxCount);
      }

      if (prevNodeSetInfo != null) {
        // fire expand event for each row key cached in prevNodeSetInfo
        for (var j = 0; j < prevNodeSetInfo.keys.length; j++) {
          this.handleEvent('expand', { rowKey: prevNodeSetInfo.keys[j] });
        }
      }

      this.m_busy = false;

      // fire event
      this.handleEvent('expand', { rowKey: rowKey });
    } else {
      // there are still child rows to expand
      // create queue if not yet created
      if (queue === undefined) {
        queue = [];
      }

      // push expanded rows to the queue
      if (toExpand.length > 0) {
        queue.push(toExpand);
      }

      // create prevNodeSetInfo if not yet created
      if (prevNodeSetInfo === undefined) {
        prevNodeSetInfo = {};
        // populate the initial insertion index and key, this is needed when we are actually firing
        // the insert event
        prevNodeSetInfo.firstIndex = rangeStart;
        prevNodeSetInfo.firstKey = rowKey;
        // cache of row keys for firing expand event when everything is done
        prevNodeSetInfo.keys = [];
      }

      // update the previous node set
      prevNodeSetInfo.nodeSet = nodeSet;
      // update keys array for fire expand events later
      prevNodeSetInfo.keys.push(rowKey);

      // expand any child rows that should be expanded
      this._syncExpandRows(queue, prevNodeSetInfo);
    }

    this.m_busy = false;

    if (queue && queue.length === 0) {
      this._processQueue();
    }
  };

/**
 * Expands the specified array of rows synchronously, i.e. one will not start until the previous one is finished.
 * @param {Object} queue the queue of a set of expanded row keys remaining to process
 * @param {Object} prevNodeSetInfo node set from the previous expand call
 * @private
 */
oj.FlattenedTreeDataSource.prototype._syncExpandRows = function (queue, prevNodeSetInfo) {
  // peek the last set of expanded rows from queue (since we are doing depth first traversal)
  var last = queue[queue.length - 1];
  // then take the first row key from the set
  var key = last.shift();
  // if this is the last item in the set, we can remove the set from queue
  if (last.length === 0) {
    queue.pop();
  }

  this._expand(key, { prevNodeSetInfo: prevNodeSetInfo, queue: queue });
};

/**
 * Insert a single row of data into the cache
 * @param {number} index the index (based on flattened view) where this is inserted
 * @param {Object} metadata the metadata of the inserted node
 * @param {Object} parentKey the key of the parent node
 * @param {number} childIndex the index relative to its parent where this is inserted
 * @param {number} depth the depth of the node
 * @private
 */
oj.FlattenedTreeDataSource.prototype._insertRow =
  function (index, metadata, parentKey, childIndex, depth) {
    var key = metadata.key;

    if (index <= this._getLastIndex()) {
      this._addEntry(key, depth, childIndex, parentKey, index);
    } else {
      this._addEntry(key, depth, childIndex, parentKey);
    }
  };

/**
 * Remove all rows below the row of the specified index including this row.
 * @param {number} index the index from which we start to delete rows
 * @param {number=} count the number of rows to delete.  If not specified, then delete until the end.
 * @private
 */
oj.FlattenedTreeDataSource.prototype._deleteAllRowsBelow = function (index, count) {
  var actualCount = count;
  if (count == null) {
    actualCount = (this._getLastIndex() + 1) - index;
  }

  var keys = [];
  for (var i = 0; i < actualCount; i++) {
    keys.push({ key: this._getEntry(index + i).key, index: index + i });
  }

  // update internal cache
  this._removeEntry(index, actualCount);

  // fire event to remove rows from view
  this.removeRows(keys);
};

/**
 * Handles model event from underlying TreeDataSource.
 * @param {Event} event the model change event
 * @private
 */
oj.FlattenedTreeDataSource.prototype._handleModelEvent = function (event) {
  var parentKey;
  var operation = event.operation;
  var ancestors = event.parent;

  if (Array.isArray(ancestors)) {
    // take the direct key of direct parent
    parentKey = ancestors[ancestors.length - 1];
  } else {
    // single element or null, value is the parent key
    parentKey = ancestors;
  }
  var index = event.index;

  if (operation === 'insert') {
    this._handleInsertEvent(parentKey, index, event.data);
  } else if (operation === 'delete') {
    this._handleDeleteEvent(parentKey, index);
  } else if (operation === 'refresh') {
    this._handleRefreshEvent(parentKey);
  }
};

/**
 * Handles insert event from TreeDataSource.
 * @param {Object} parentKey the key of the parent where the node is inserted
 * @param {number} index the index relative to its parent where the node is inserted
 * @param {Object} nodeSet the node set containing the single insert data
 * @private
 */
oj.FlattenedTreeDataSource.prototype._handleInsertEvent = function (parentKey, index, nodeSet) {
  var parentIndex = this.getIndex(parentKey);
  var parent = this._getEntry(parentIndex);
  var depth = parent.depth + 1;
  var insertIndex = parentIndex + index + 1;

  // there should only be one row in the set
  var metadata = nodeSet.getMetadata(nodeSet.getStart());

  // insert into cache
  this._insertRow(insertIndex, metadata, parentKey, index, depth);
};

/**
 * Handles delete event from TreeDataSource.
 * @param {Object} parentKey the key of the parent where the node is inserted
 * @param {number} index the index relative to its parent where the node is inserted
 * @private
 */
oj.FlattenedTreeDataSource.prototype._handleDeleteEvent = function (parentKey, index) {
  var parentIndex = this.getIndex(parentKey);
  var parent = this._getEntry(parentIndex);

  var startIndex = parentIndex + index;
  var start = this._getEntry(startIndex);

  // make sure the child data is valid
  oj.Assert.assert(start.parent === parent && start.depth === parent.depth + 1);

  // remove the entry and all of its children from cache
  var count = 1;
  var currentIndex = startIndex + 1;
  var lastIndex = this._getLastIndex();
  while (currentIndex <= lastIndex) {
    var current = this._getEntry(currentIndex);
    // check if we have reached the last child of the deleted node
    if (current.depth !== start.depth) {
      break;
    }
    currentIndex += 1;
  }

  // remove rows
  this._deleteAllRowsBelow(startIndex, count);
};

/**
 * Handles refresh event from TreeDataSource.
 * @param {Object} parentKey the key of the parent where the node is inserted
 * @private
 */
oj.FlattenedTreeDataSource.prototype._handleRefreshEvent = function (parentKey) {
  if (parentKey == null) {
    // the entire tree is refreshed
    // clean up internal cache
    this.refresh();
  }
};

/**
 * Checks whether all rows should be expanded.
 * @return {boolean} true if expand all rows, false otherwise.
 * @private
 */
oj.FlattenedTreeDataSource.prototype._isExpandAll = function () {
  var capability = this.m_wrapped.getCapability('fetchDescendants');
  return (this.m_collapsedKeys != null &&
          capability != null && capability !== 'disable');
};

/**
 * Checks whether batch fetching is supported.
 * @return {boolean} true if batch fetching is supported, false otherwise.
 * @private
 */
oj.FlattenedTreeDataSource.prototype._isBatchFetching = function () {
  var capability = this.m_wrapped.getCapability('batchFetch');
  return (capability === 'enable');
};

// ///////////////////////////// helper methods subclass should find useful //////////////////////////////////////////////
/**
 * Refresh the data source.  Clear out any state.
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.refresh = function () {
  // clear the cache
  this._clearAll();

  // todo: more work here to force fetch (remove then insert)
};

/**
 * Determine the flattened index for the specified key
 * @param {any} rowKey the key to find the index
 * @return {number} the index representing the specified key.  Returns -1 if the index
 *         cannot be found.
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.getIndex = function (rowKey) {
  var lastIndex = this._getLastIndex();
  for (var i = 0; i <= lastIndex; i++) {
    var rowData = this._getEntry(i);
    if (rowData.key === rowKey) {
      return i;
    }
  }

  // can't find it, return -1
  return -1;
};

/**
 * Determines the key for the specified flattened index
 * @param {number} index the index in flattened view
 * @return {Object|null} the key for the specified index.  Returns null if the index has not been
 *         fetched yet or is invalid.
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.getKey = function (index) {
  // ensure the index is valid and in range
  if (index < 0 || index > this._getLastIndex()) {
    return null;
  }

  // just return from internal cache
  return this._getEntry(index).key;
};

/**
 * Returns the currently fetched range.
 * @return {Object} the fetched range (start, end).
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.getFetchedRange = function () {
  return { start: 0, end: this._getLastIndex() + 1 };
};

/**
 * Returns the key of the ancestors.
 * @param {any} rowKey the row key to find the ancestors.
 * @return {Array} an array of the key of the ancestors from root to the row with specified row key.
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.getAncestors = function (rowKey) {
  var ancestors = [];
  var index = this.getIndex(rowKey);
  var parent = this._getParent(index);

  while (parent != null) {
    ancestors.push(parent);
    index = this.getIndex(parent);
    parent = this._getParent(index);
  }

  // reverse since we want to return from the root
  return ancestors.reverse();
};
// /////////////////////////////////// methods subclass must override ////////////////////////////////////////////////////////
/**
 * Handles what happened when the maximum row count has been reached.
 * @param {Object} range the range of the fetch request which caused the max count to be reached.
 * @param {Object} callbacks the callbacks of the fetch request which caused the max count to be reached.
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.handleMaxCountReached = function (range, callbacks) {
  // send an error by default
  if (callbacks != null && callbacks.error != null) {
    callbacks.error.call(null);
  }
};

/**
 * Abstract method to insert a set of rows into the DataGrid/Table
 * @param {number} insertAtIndex the flattened index of the node where the rows are inserted.
 * @param {any} insertAtKey the key of the node where the rows are inserted (the parent key)
 * @param {Object} nodeSet the node set containing data/metadata of inserted rows
 * @protected
 */
// eslint-disable-next-line no-unused-vars
oj.FlattenedTreeDataSource.prototype.insertRows = function (insertAtIndex, insertAtKey, nodeSet) {
  oj.Assert.failedInAbstractFunction();
};

/**
 * Abstract method to remove the specified rows in the DataGrid/Table
 * @param {Array.<any>} rowKeys an array of keys of the rows to be remove.
 * @protected
 */
// eslint-disable-next-line no-unused-vars
oj.FlattenedTreeDataSource.prototype.removeRows = function (rowKeys) {
  oj.Assert.failedInAbstractFunction();
};

// /////////////////////////////// methods that manipulates the internal cache ///////////////////////////////////
/**
 * Retrieve the flattened index of the last entry fetched so far
 * @return {number} the flattened index of the last entry
 * @private
 */
oj.FlattenedTreeDataSource.prototype._getLastIndex = function () {
  return this.m_cache.length - 1;
};

/**
 * Retrieve the metadata for the last entry fetched so far
 * @return {Object} the metadata for the last entry
 * @private
 */
oj.FlattenedTreeDataSource.prototype._getLastEntry = function () {
  return this.m_cache[this._getLastIndex()];
};

/**
 * Retrieve metadata info for the specified index.
 * @param {number} index the flattened index
 * @return {Object} the metadata info
 * @private
 */
oj.FlattenedTreeDataSource.prototype._getEntry = function (index) {
  return this.m_cache[index];
};

/**
 * Retrieve the parent key for the specified index.
 * @param {number} index the flattened index
 * @return {Object} the parent key
 * @private
 */
oj.FlattenedTreeDataSource.prototype._getParent = function (index) {
  var entry = this.m_cache[index];
  if (entry != null) {
    return entry.parent;
  }
  return null;
};

/**
 * Add or insert entry to the cache
 * @param {Object} key the key
 * @param {number} depth the depth
 * @param {number} index the index relative to its parent
 * @param {Object} parent the parent
 * @param {number=} insertAt insert the metadata entry at this flattened index
 * @private
 */
oj.FlattenedTreeDataSource.prototype._addEntry = function (key, depth, index, parent, insertAt) {
  var rowData = {};
  rowData.key = key;
  rowData.depth = depth;
  rowData.index = index;
  rowData.parent = parent;

  if (insertAt === undefined) {
    this.m_cache.push(rowData);
  } else {
    this.m_cache.splice(insertAt, 0, rowData);
  }
};

/**
 * Remove entry from cache
 * @param {number} index the flattened index to start remove entry
 * @param {number} count how many entries to remove starting from the flattened index
 * @private
 */
oj.FlattenedTreeDataSource.prototype._removeEntry = function (index, count) {
  this.m_cache.splice(index, count);
};

/**
 * Clears the internal cache
 * @private
 */
oj.FlattenedTreeDataSource.prototype._clearAll = function () {
  this.m_cache.length = 0;
};

/**
 * Determines whether this data source supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none".
 *         Returns null if the feature is not recognized.
 * @export
 * @expose
 * @memberof! oj.FlattenedTreeDataSource
 * @instance
 */
oj.FlattenedTreeDataSource.prototype.getCapability = function (feature) {
  return this.m_wrapped.getCapability(feature);
};


/* global Components:false */
/**
 * @ojcomponent oj.ojRowExpander
 * @augments oj.baseComponent
 * @since 1.0.0
 *
 * @ojrole button
 * @ojshortdesc Enable hierarchical data to be displayed in a JET Table and JET DataGrid.
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojRowExpander<K, D> extends baseComponent<ojRowExpanderSettableProperties<K,D>>",
 *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data of the dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojRowExpanderSettableProperties<K,D> extends baseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @classdesc
 * <h3 id="rowexpanderOverview-section">
 *   JET RowExpander
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rowexpanderOverview-section"></a>
 * </h3>
 * <p>Description: A JET RowExpander is primarily used inside the JET Table and JET DataGrid.  It enables hierarchical data to be displayed in a JET Table and JET DataGrid.</p>
 *
 * <p>To enable expand and collapse of rows, developers must specify oj.FlattenedTreeDataProviderView as data when used within JET Table  and JET DataGrid.</p>
 *
 * <pre class="prettyprint"><code>&lt;oj-row-expander
 *   context='{{$context}}'>
 * &lt;/oj-row-expander></code></pre>
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * <p>The location of the RowExpander will be reversed in RTL reading direction.</p>
 * <p>In the unusual case that the directionality (LTR or RTL) changes post-init, the component containing the RowExpander (JET Table or JET DataGrid) must be <code class="prettyprint">refresh()</code>ed.
 *
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * <h4>Initial expansion</h4>
 * <p>To specify initial expanded rows with RowExpander, it is recommended that applications do this through the initial options in oj.FlattenedTreeDataProvider, especially for expanding all rows initially.</p>
 */
oj.__registerWidget('oj.ojRowExpander', $.oj.baseComponent,
  {
    version: '1.0.0',
    widgetEventPrefix: 'oj',
    options:
    {
      /**
       * The context object obtained from the column renderer (Table) or cell renderer (DataGrid)
       *
       * @expose
       * @ojrequired
       * @memberof oj.ojRowExpander
       * @instance
       * @type {Object}
       * @default null
       * @ojsignature {target: "Type", value: "?(oj.ojRowExpander.Context<K, D>)", jsdocOverride: true}
       *
       */
      context: null,
      /**
       * Specifies if the RowExpander is expanded.  The default value is determined by the <code class="prettyprint">context</code> obtained from the column renderer (Table) or cell renderer (DataGrid), or null if no context is specified.
       * See <a href="#perf-section">performance</a> for recommended usage regarding initial expansion state.
       *
       * This attribute is not supported for use with DataProvider.
       *
       * @expose
       * @memberof oj.ojRowExpander
       * @instance
       * @type {boolean|null}
       * @default null
       * @ojwriteback
       * @ojdeprecated {since: '7.0.0', description: 'The source of truth for expansion is the data source key set.'}
       * @ojtsignore
       * @ojshortdesc Specifies if the RowExpander is expanded.
       *
       * @example <caption>Initialize the RowExpander with the <code class="prettyprint">expanded</code> attribute specified:</caption>
       * &lt;oj-row-expander expanded='true'>&lt;/oj-row-expander>
       *
       * @example <caption>Get or set the <code class="prettyprint">expanded</code> property after initialization:</caption>
       * // getter
       * var expandedValue = myRowExpander.expanded;
       *
       * // setter
       * myRowExpander.expanded = false;
       */
      expanded: null,
      /**
       * Triggered when a expand is performed on the RowExpander
       *
       * @expose
       * @event
       * @memberof oj.ojRowExpander
       * @instance
       * @property {any} rowKey the key of the expanded row
       * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"},
     *               {target:"Type", value:"K", for:"key"}]
       */
      expand: null,
      /**
       * Triggered when a collapse is performed on the RowExpander
       *
       * @expose
       * @event
       * @memberof oj.ojRowExpander
       * @instance
       * @property {any} rowKey the key of the collapsed row
       * @ojsignature[{target:"Type", value:"<K>", for:"genericTypeParameters"},
     *               {target:"Type", value:"K", for:"key"}]
       */
      collapse: null
    },
    classNames:
    {
      root: 'oj-rowexpander',
      icon: 'oj-component-icon',
      clickable: 'oj-clickable-icon-nocontext',
      expand: 'oj-rowexpander-expand-icon',
      collapse: 'oj-rowexpander-collapse-icon',
      leaf: 'oj-rowexpander-leaf-icon',
      lazyload: 'oj-rowexpander-lazyload-icon',
      toucharea: 'oj-rowexpander-touch-area',
      indent: 'oj-rowexpander-indent',
      iconspacer: 'oj-rowexpander-icon-spacer',
      depth0: 'oj-rowexpander-depth-0',
      depth1: 'oj-rowexpander-depth-1',
      depth2: 'oj-rowexpander-depth-2',
      depth3: 'oj-rowexpander-depth-3',
      depth4: 'oj-rowexpander-depth-4',
      depth5: 'oj-rowexpander-depth-5',
      depth6: 'oj-rowexpander-depth-6',
      depth7: 'oj-rowexpander-depth-7'
    },
    constants: {
      MAX_STYLE_DEPTH: 7,
      NUM5_KEY: 53
    },
    /**
     * Create the row expander
     * @override
     * @memberof oj.ojRowExpander
     * @protected
     */
    _ComponentCreate: function () {
      this._super();
      this.element.addClass(this.classNames.root);
      this._initContent();
    },
    /**
     * Initialize the row expander after creation
     * @private
     */
    _initContent: function () {
      var self = this;

      var context = this.options.context;
      // component now widget constructor or non existent
      if (context.component != null) {
        this.component = typeof context.component === 'function' ?
          context.component('instance') :
          context.component;
      } else if (context.componentElement) {
        var widgetElem = context.componentElement;
        widgetElem = $(widgetElem).hasClass('oj-component-initnode') ?
          widgetElem :
          $(widgetElem).find('.oj-component-initnode')[0];
        this.component = Components.__GetWidgetConstructor(widgetElem)('instance');
      }
      this.datasource = context.datasource;
      if (oj.DataProviderFeatureChecker.isDataProvider(this.datasource)) {
        this._subscribeToDataProvider();
      }

      // root hidden so subtract 1
      this.depth = oj.DataProviderFeatureChecker.isDataProvider(this.datasource) ?
        context.treeDepth + 1 : context.depth;
      this.rowKey = context.key;
      if (context.state) {
        this.iconState = context.state;
      } else if (context.isLeaf) {
        this.iconState = 'leaf';
      } else {
        this.iconState = this._getDataProviderExpanded().has(this.rowKey) ? 'expanded' : 'collapsed';
      }
      this.index = oj.DataProviderFeatureChecker.isDataProvider(this.datasource) ?
        context.indexFromParent : context.index;

      this.parentKey = context.parentKey;

      this._addIndentation();
      this._addIcon();
      this._setIconStateClass();

      if (this.iconState === 'expanded' || this.iconState === 'collapsed') {
        $(this.toucharea).on('touchend', function (event) {
          // prevent scroll to top and # append, also prevents the following click
          event.preventDefault();
          self._fireExpandCollapse();
        });

        $(this.toucharea).on('click', function (event) {
          // prevent scroll to top and # append
          event.preventDefault();
          self._fireExpandCollapse();
        });
        $(this.element).on('keypress', function (event) {
          var code = event.keyCode || event.which;
          if (code === $.ui.keyCode.ENTER || code === $.ui.keyCode.SPACE) {
            // do expand or collapse
            self._fireExpandCollapse();
            // stop browser from for example scrolling the page
            event.preventDefault();
            // ensure focus stays
            event.target.focus();
          }
        });

        // listen for key down event from host component
        this.handleKeyDownCallback = this._handleKeyDownEvent.bind(this);
        this.component.element.get(0).addEventListener('keydown', this.handleKeyDownCallback, true);

        // listens for expand and collapse event from flattened datasource
        // this could be due to user clicks, keyboard shortcuts or programmatically
        this.handleExpandCallback = this._handleExpandEvent.bind(this);
        this.handleCollapseCallback = this._handleCollapseEvent.bind(this);

        if (!oj.DataProviderFeatureChecker.isDataProvider(this.datasource)) {
          this.datasource.on('expand', this.handleExpandCallback, this);
          this.datasource.on('collapse', this.handleCollapseCallback, this);
        }

        // if expanded option is explicitly specified, make sure it's in sync with current state
        this._initExpanded();
      } else if (this.iconState === 'leaf') {
        // we'll still need to handle ctrl+alt+5 for leaf node
        // listen for key down event from host component
        this.handleKeyDownCallback = this._handleKeyDownEvent.bind(this);
        this.component.element.get(0).addEventListener('keydown', this.handleKeyDownCallback, true);
        $(this.icon).attr('tabindex', -1);
      }

      // listen for active key change event from host component
      this.handleActiveKeyChangeCallback = this._handleActiveKeyChangeEvent.bind(this);
      if (this.component._IsCustomElement()) {
        $(this.component.element).on('ojBeforeCurrentCell', this.handleActiveKeyChangeCallback);
      } else {
        $(this.component.element).on('ojbeforecurrentcell', this.handleActiveKeyChangeCallback);
      }
    },
    /**
     * Sync initial state of expanded with context/FlattenedTreeModel
     * @private
     */
    _initExpanded: function () {
      if (!oj.DataProviderFeatureChecker.isDataProvider(this.datasource)) {
        var expanded = this.options.expanded;
        if (expanded != null) {
          if (expanded && this.iconState === 'collapsed') {
            this._expand();
          } else if (!expanded && this.iconState === 'expanded') {
            this._collapse();
          }
        } else {
          // make sure expanded value reflect the current state
          // we don't want to trigger option change event in this case
          this.options.expanded = this.iconState !== 'collapsed';
        }
      }
    },
    /**
     * @private
     */
    _getDataProviderExpanded: function () {
      return this._dataSourceExpanded;
    },
    /**
     * @private
     */
    _getFlattenedDataProvider: function () {
      if (this.datasource.getExpandedObservable) {
        return this.datasource;
      }
      // paging case
      return this.datasource.dataProvider;
    },
    /**
     * @private
     */
    _getChildCount: function (parentKey) {
      if (oj.DataProviderFeatureChecker.isDataProvider(this.datasource)) {
        var dataprovider;
        if (parentKey != null) {
          dataprovider = this._getFlattenedDataProvider().dataProvider.getChildDataProvider(
            this.parentKey);
        } else {
          dataprovider = this._getFlattenedDataProvider().dataProvider;
        }
        return dataprovider.getTotalSize();
      }
      return this.datasource.getWrappedDataSource().getChildCount(this.parentKey);
    },
    /**
     * Redraw the RowExpander element.
     *
     * @expose
     * @memberof oj.ojRowExpander
     * @instance
     * @return {void}
     *
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * myRowExpander.refresh();
     */
    refresh: function () {
      this.element.empty();
      this._initContent();
    },

    /**
     * destroy the row expander
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof oj.ojRowExpander
     * @instance
     * @private
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * $( ".selector" ).ojRowExpander( "destroy" );
     */
    _destroy: function () {
      // unregister keydown and active key change handlers
      this.component.element.get(0).removeEventListener('ojkeydown',
                                                        this.handleKeyDownCallback, true);
      $(this.component.element).off('ojbeforecurrentcell', this.handleActiveKeyChangeCallback);

      // unregister expand/collapse events
      if (oj.DataProviderFeatureChecker.isDataProvider(this.datasource)) {
        this._dataProviderSubscription.unsubscribe();
      } else {
        this.datasource.off('expand', this.handleExpandCallback, this);
        this.datasource.off('collapse', this.handleCollapseCallback, this);
      }

      this.element.removeClass(this.classNames.root);
      this.element.empty();
    },

    _subscribeToDataProvider: function () {
      var self = this;
      var observable = this._getFlattenedDataProvider().getExpandedObservable();
      self._dataProviderSubscription = observable.subscribe(function (value) {
        var shouldCollapse = false;
        var shouldExpand = false;

        self._dataSourceExpanded = value.value;

        if (self.iconState === 'expanded' && !self._dataSourceExpanded.has(self.rowKey)) {
          shouldCollapse = true;
          self._loading();
        }

        if (self.iconState === 'collapsed' && self._dataSourceExpanded.has(self.rowKey)) {
          shouldExpand = true;
          self._loading();
        }

        if (shouldExpand || shouldCollapse) {
          var completionPromise = value.completionPromise;
          if (completionPromise) {
            completionPromise.then(function () {
              if (shouldExpand) {
                self._handleExpandEvent({ rowKey: self.rowKey });
              }
              if (shouldCollapse) {
                self._handleCollapseEvent({ rowKey: self.rowKey });
              }
            });
          }
        }
      });
    },

    /**
     * Expand the current row expander
     * @return {boolean} true if the expand is processed, false if it's a no op.
     * @private
     */
    _expand: function () {
      if (this.iconState === 'collapsed') {
        this._loading();
        if (!oj.DataProviderFeatureChecker.isDataProvider(this.datasource)) {
          this.datasource.expand(this.rowKey);
        } else {
          this._getFlattenedDataProvider().setExpanded(
            this._getDataProviderExpanded().add([this.rowKey]));
        }
        return true;
      }
      return false;
    },

    /**
     * Collapse the current row expander
     * @return {boolean} true if the collapse is processed, false if it's a no op.
     * @private
     */
    _collapse: function () {
      if (this.iconState === 'expanded') {
        this._loading();
        if (!oj.DataProviderFeatureChecker.isDataProvider(this.datasource)) {
          this.datasource.collapse(this.rowKey);
        } else {
          this._getFlattenedDataProvider().setExpanded(
            this._getDataProviderExpanded().delete([this.rowKey]));
        }
        return true;
      }
      return false;
    },

    /**
     * Sets a single option value
     * @param {Object} key the option key
     * @param {Object} value the option value
     * @param {Object} flags additional flags for option*
     * @override
     * @private
     */
    _setOption: function (key, value, flags) {
      if (key === 'expanded' && !oj.DataProviderFeatureChecker.isDataProvider(this.datasource) && (flags._context == null || flags._context.internalSet !== true)) {
        if (value) {
          this._expand();
        } else {
          this._collapse();
        }
        // don't update option, it will be update when the operation completed via expand/collapse event
        return;
      }

      this._super(key, value, flags);

      // refresh if context is updated
      if (key === 'context' && flags._context != null && flags._context.internalSet !== true) {
        this.refresh();
      }
    },

    /**
     * Add athe indentation spacers to the row
     * @private
     */
    _addIndentation: function () {
      // 0 index the depth for style purposes
      var depth = this.depth - 1;
      if (depth < this.constants.MAX_STYLE_DEPTH) {
        this._appendSpacer(depth);
      } else {
        for (var i = 1; i <= (depth / (this.constants.MAX_STYLE_DEPTH)); i++) {
          this._appendSpacer(this.constants.MAX_STYLE_DEPTH);
        }
        var remainder = (depth % this.constants.MAX_STYLE_DEPTH);
        if (remainder < this.constants.MAX_STYLE_DEPTH) {
          this._appendSpacer(remainder);
        }
      }
    },

    /**
     * Append appropriate spacer based on depth to the row expander
     * @param {number} depth the depth
     * @private
     */
    _appendSpacer: function (depth) {
      var spacer = $(document.createElement('span'))
          .addClass(this.classNames.indent)
          .addClass(this.classNames['depth' + depth]);
      this.element.append(spacer); // @HTMLUpdateOK
    },

    /**
     * Add an icon to the row expander with appropriate class names for a clickable icon.
     * @private
     */
    _addIcon: function () {
      var iconSpacer = $(document.createElement('div')).addClass(this.classNames.iconspacer);
      this.toucharea = $(document.createElement('div')).addClass(this.classNames.toucharea);
      // if icon is a leaf do not add # because that will trigger navigation if entered in JAWS
      this.icon = $(document.createElement('a'))
        .attr('href', this.iconState === 'leaf' ? '' : '#')
        .attr('aria-labelledby', this._getLabelledBy())
        .addClass(this.classNames.icon)
        .addClass(this.classNames.clickable)
        .attr('aria-label',
              this.getTranslatedString('accessibleLevelDescription', { level: this.depth }));
      this.element.append(iconSpacer.append(this.toucharea.append(this.icon))); // @HTMLUpdateOK

      var self = this;
      this._focusable({
        element: self.icon,
        applyHighlight: true
      });
    },

    /**
     * Add a class name on the icon
     * @private
     * @param {string} classKey the key of the appropriate icon class expand/collapse/leaf
     */
    _addIconClass: function (classKey) {
      this.icon.addClass(this.classNames[classKey]);
    },

    /**
     * Remove a class name on the icon
     * @private
     * @param {string} classKey the key of the appropriate icon class expand/collapse/leaf
     */
    _removeIconClass: function (classKey) {
      this.icon.removeClass(this.classNames[classKey]);
    },

    /**
     * Set the icon class to the the iconState property
     * @private
     */
    _setIconStateClass: function () {
      switch (this.iconState) {
        case 'leaf':
          this._removeIconClass('icon');
          this._removeIconClass('clickable');
          this._addIconClass('leaf');
          break;
        case 'collapsed':
          this._addIconClass('expand');
          this._ariaExpanded(false);
          break;
        case 'expanded':
          this._addIconClass('collapse');
          this._ariaExpanded(true);
          break;
        case 'loading':
          this._removeIconClass('clickable');
          this._addIconClass('lazyload');
          break;
        default:
          break;
      }
    },

    /**
     * Removes the icon class of the iconState property
     * @private
     */
    _removeIconStateClass: function () {
      switch (this.iconState) {
        case 'leaf':
          this._removeIconClass('leaf');
          this._addIconClass('icon');
          this._addIconClass('clickable');
          break;
        case 'collapsed':
          this._removeIconClass('expand');
          break;
        case 'expanded':
          this._removeIconClass('collapse');
          break;
        case 'loading':
          this._removeIconClass('lazyload');
          this._addIconClass('clickable');
          break;
        default:
          break;
      }
    },

    /**
     * Handles active key change event from host component (ojDataGrid or ojTable)
     * @param {Event} event
     * @param {Object|null|number=} ui
     * @private
     */
    _handleActiveKeyChangeEvent: function (event, ui) {
      var previousRowKey;

      if (ui == null) {
        // eslint-disable-next-line no-param-reassign
        ui = event.detail;
      }

      if (ui.currentCell != null) {
        var rowKey = ui.currentCell.type === 'cell' ? ui.currentCell.keys.row : ui.currentCell.key;
        if (ui.previousValue != null) {
          previousRowKey = ui.previousCurrentCell.type === 'cell' ?
            ui.previousCurrentCell.keys.row :
            ui.previousCurrentCell.key;
        }
        // if the event is for this row and the active key change event is triggered
        // by row change and not column change
        if (this.rowKey === rowKey && previousRowKey !== rowKey) {
          // if the component allows AccessibleContext to be set
          if (this.component._setAccessibleContext) {
            // row context of row expander for screen reader
            // todo: get index from TreeDataSource as well since that could change
            var context = this.getTranslatedString('accessibleRowDescription', {
              level: this.depth,
              num: this.index + 1,
              total: this._getChildCount(this.parentKey)
            });
            // state of row expander for screen reader
            var state;
            if (this.iconState === 'collapsed') {
              state = this.getTranslatedString('accessibleStateCollapsed');
            } else if (this.iconState === 'expanded') {
              state = this.getTranslatedString('accessibleStateExpanded');
            } else {
              // for leaf node don't read anything
              state = '';
            }

            this.component._setAccessibleContext({ context: context, state: state });
          }
        }
      }
    },
    /**
     * Handles keydown event from host component (ojDataGrid or ojTable)
     * No longer returns a boolean but rather prevents default if appropriate
     * @param {Event} event
     * @private
     */
    _handleKeyDownEvent: function (event) {
      var targetContext =
          Components.__GetWidgetConstructor(this.component.element.get(0))('getContextByNode',
                                                                              event.target);
      if (targetContext == null) {
        return;
      }

      var rowKey = targetContext.key;
      if (rowKey == null) {
        rowKey = targetContext.keys.row;
      }
      if (this.rowKey === rowKey) {
        var code = event.keyCode || event.which;
        // ctrl (or equivalent) is pressed
        if (oj.DomUtils.isMetaKeyPressed(event)) {
          // Ctrl+Right expands, Ctrl+Left collapse in accordance with WAI-ARIA best practice
          // consume the event as it's processed
          if (code === $.ui.keyCode.RIGHT) {
            if (this._expand()) {
              event.preventDefault();
            }
          } else if (code === $.ui.keyCode.LEFT) {
            if (this._collapse()) {
              event.preventDefault();
            }
          } else if (event.altKey && code === this.constants.NUM5_KEY) {
            // read current cell context
            if (this.component._setAccessibleContext) {
              var ancestorInfo;
              if (!oj.DataProviderFeatureChecker.isDataProvider(this.datasource)) {
                var ancestors = this.datasource.getAncestors(this.rowKey);
                if (ancestors != null && ancestors.length > 0) {
                  ancestorInfo = [];
                  for (var i = 0; i < ancestors.length; i++) {
                    ancestorInfo.push({
                      key: ancestors[i],
                      label: this.getTranslatedString('accessibleLevelDescription',
                                                      { level: i + 1 })
                    });
                  }
                }
              }

              var context = this.getTranslatedString('accessibleRowDescription', {
                level: this.depth,
                num: this.index + 1,
                total: this._getChildCount(this.parentKey)
              });
              this.component._setAccessibleContext({
                context: context,
                state: '',
                ancestors: ancestorInfo
              });
            }
          }
        }
      }
    },

    /**
     * Put row expander in a loading state.  This is called during expand/collapse.
     * @private
     */
    _loading: function () {
      this._removeIconStateClass();
      this.iconState = 'loading';
      this._setIconStateClass();
    },

    /**
     * Handle an expand event coming from the datasource,
     * update the icon and the aria-expand property
     * @param {Object} event the expand event from the data source, should contain rowKey
     * @private
     */
    _handleExpandEvent: function (event) {
      var rowKey = event.rowKey ? event.rowKey : event.detail.key;
      if (rowKey === this.rowKey) {
        this._removeIconStateClass();
        this.iconState = 'expanded';
        this._setIconStateClass();
        this._ariaExpanded(true);
        this._updateContextState('expanded');

        // if the event is triggered by initial setting of expanded, we should not
        // fire expand or option change event
        var expanded = this.options.expanded;
        if (expanded == null || (expanded != null && !expanded)) {
          this._trigger('expand', null, { rowKey: rowKey });
          this._updateExpandedState(true);
        }
      }
    },

    /**
     * Handle a collapse event coming from the datasource,
     * update the icon and the aria-expand property
     * @param {Object} event the collapse event from the data source, should contain rowKey
     * @private
     */
    _handleCollapseEvent: function (event) {
      var rowKey = event.rowKey ? event.rowKey : event.detail.key;
      if (rowKey === this.rowKey) {
        this._removeIconStateClass();
        this.iconState = 'collapsed';
        this._setIconStateClass();
        this._ariaExpanded(false);
        this._updateContextState('collapsed');

        // if the event is triggered by initial setting of expanded, we should not
        // fire expand or option change event
        var expanded = this.options.expanded;
        if (expanded == null || (expanded != null && expanded)) {
          this._trigger('collapse', null, { rowKey: rowKey });
          this._updateExpandedState(false);
        }
      }
    },

    /**
     * Update the expanded option
     * @param {boolean} expanded
     * @private
     */
    _updateExpandedState: function (expanded) {
      this.option('expanded', expanded,
                  { changed: true, _context: { internalSet: true, writeback: true } });
    },

    /**
     * Update context state
     * @param {string} newState
     * @private
     */
    _updateContextState: function (newState) {
      var context = this.options.context;
      context.state = newState;
      // need to reuse the same object so mark it as changed ourselves
      this.option('context', context, { changed: true, _context: { internalSet: true } });
    },

    /**
     * Fire the expand or collapse on the datasource and the oj event on the widget
     * @private
     */
    _fireExpandCollapse: function () {
      var state = this.iconState;

      // show loading icon, note this changes the icon state to 'loading'
      if (!oj.DataProviderFeatureChecker.isDataProvider(this.datasource)) {
        this._loading();
      }
      // invoke expand/collapse on datasource
      if (state === 'collapsed') {
        if (!oj.DataProviderFeatureChecker.isDataProvider(this.datasource)) {
          this.datasource.expand(this.rowKey);
        } else {
          this._getFlattenedDataProvider().setExpanded(
            this._getDataProviderExpanded().add([this.rowKey]));
        }
      } else if (state === 'expanded') {
        if (!oj.DataProviderFeatureChecker.isDataProvider(this.datasource)) {
          this.datasource.collapse(this.rowKey);
        } else {
          this._getFlattenedDataProvider().setExpanded(
            this._getDataProviderExpanded().delete([this.rowKey]));
        }
      }
    },

    /**
     * Sets the icon's aria-expanded property to the boolean passed in
     * @param {boolean|null} bool true if expanded false if not
     * @private
     */
    _ariaExpanded: function (bool) {
      this.icon.attr('aria-expanded', bool);
    },

    // @inheritdoc
    getNodeBySubId: function (locator) {
      if (locator == null) {
        return this.element ? this.element[0] : null;
      }

      var subId = locator.subId;
      if ((subId === 'oj-rowexpander-disclosure' || subId === 'oj-rowexpander-icon') &&
          this.icon != null) {
        return this.icon.get(0);
      }
      // Non-null locators have to be handled by the component subclasses
      return null;
    },

    // @inheritdoc
    getSubIdByNode: function (node) {
      if (node === this.icon.get(0)) {
        return { subId: 'oj-rowexpander-disclosure' };
      }
      return null;
    },

    _NotifyAttached: function () {
      this._super();
      this.icon.attr('aria-labelledby', this._getLabelledBy());
    },
    /**
     * Get the aria label of the rowexpander from the closest row expander
     * @return {string} the closest id set to the rowexpander
     * @private
     */
    _getLabelledBy: function () {
      return this.element.parent().closest('[id]').attr('id');
    }

    // ////////////////     FRAGMENTS    //////////////////
    /**
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Target</th>
     *       <th>Gesture</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td>Icon</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Expand or collapse the row with the icon in it.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment touchDoc - Used in touch section of classdesc, and standalone gesture doc
     * @memberof oj.ojRowExpander
     */

    /**
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Target</th>
     *       <th>Key</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td rowspan="2">Focused Row or Cell with RowExpander</td>
     *       <td><kbd>Ctrl + RightArrow</kbd></td>
     *       <td>Expand</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Ctrl + LeftArrow</kbd></td>
     *       <td>Collapse</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="1">Icon</td>
     *       <td><kbd>Enter</kbd></td>
     *       <td>Expand or Collapse</td>
     *     </tr>
     *   </tbody>
     * </table>
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojRowExpander
     */

    // ////////////////     SUB-IDS     //////////////////

    /**
     * <p>Sub-ID for the ojRowExpander's icon.</p>
     *
     * @ojsubid oj-rowexpander-disclosure
     * @memberof oj.ojRowExpander
     *
     * @example <caption>Get the icon from the RowExpander:</caption>
     * var node = myRowExpander.getNodeBySubId({subId: 'oj-rowexpander-disclosure'});
     */

    /**
     * @typedef {Object} oj.ojRowExpander.Context context object used by cell callbacks.
     * @property {oj.DataProvider<K, D>|null} datasource a reference to the data source object
     * @property {Object?} keys the object that contains both the row key and column key which identifies the cell
     * @property {K} keys.row the row key
     * @property {K} keys.column the column key
     * @property {K?} key the row key
     * @property {K} parentKey the parent row key
     * @property {number} treeDepth the depth of the node
     * @property {boolean} isLeaf true if it is a leaf node
     * @ojsignature [{target:"Type", value:"<K,D>", for:"genericTypeParameters"}]
     */
  });


/* global __oj_row_expander_metadata:false */

(function () {
  __oj_row_expander_metadata.extension._WIDGET_NAME = 'ojRowExpander';
  oj.CustomElementBridge.register('oj-row-expander', { metadata: __oj_row_expander_metadata });
}());

});