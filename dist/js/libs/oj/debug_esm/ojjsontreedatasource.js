/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import 'ojs/ojdatasource-common';
import { error } from 'ojs/ojlogger';

/**
 * A JsonNodeSet represents a collection of nodes.  The JsonNodeSet is an object returned by the success callback
 * of the fetchChildren method on TreeDataSource.
 * @implements oj.NodeSet
 * @constructor
 * @final
 * @since 1.0
 * @ojtsignore
 * @param {number} startNode the index of the first node in this NodeSet relative to its parent
 * @param {number} endNode the index of the last node in this NodeSet
 * @param {Object} data the JSON data
 * @param {any} currKey the key of the parent node
 * @param {number} depth the depth of the nodes in this NodeSet
 * @export
 * @ojdeprecated {since: '14.0.0', description: 'JsonNodeSet has been deprecated with JsonTreeDataSource.'}
 */
const JsonNodeSet = function (startNode, endNode, data, currKey, depth) {
  // assert startNode/endNode are number
  oj.Assert.assertNumber(startNode, null);
  oj.Assert.assertNumber(endNode, null);

  this.m_depth = depth;
  this.m_key = currKey;
  this.m_startNode = startNode;
  this.m_endNode = endNode;
  this.m_nodes = data;
};
oj._registerLegacyNamespaceProp('JsonNodeSet', JsonNodeSet);
/**
 * Gets the parent key for this result set.
 * @return {any} the parent key for this result set.
 * @export
 */
JsonNodeSet.prototype.getParent = function () {
  return this.m_key;
};

/**
 * Gets the start index of the result set.
 * @return {number} the start index of the result set.
 * @export
 */
JsonNodeSet.prototype.getStart = function () {
  return this.m_startNode;
};

/**
 * Gets the actual count of the result set.
 * @return {number} the actual count of the result set.
 * @export
 */
JsonNodeSet.prototype.getCount = function () {
  return Math.max(0, this.m_endNode - this.m_startNode);
};

/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds.
 * @param {number} index the index of the node/row in which we want to retrieve the data from.
 * @return {any} the data for the specified index.  oj.RowData should be returned for data that represents a row
 *         with a number of columns.
 * @export
 */
JsonNodeSet.prototype.getData = function (index) {
  // make sure index are valid
  oj.Assert.assert(index <= this.m_endNode && index >= this.m_startNode);

  // adjust to relative index
  var relIndex = index - this.m_startNode;

  if (this.m_nodes[relIndex]) {
    return this.m_nodes[relIndex].attr;
  }
  return null;
};

/**
 * Gets the metadata of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds.
 * The metadata that the data source must return are:
 *  1) key - <any>, the key of the node/row.
 *  2) leaf - boolean, true if it's a leaf, false otherwise.
 *  3) depth - number, the depth of the node/row.
 * @param {number} index the index of the node/row in which we want to retrieve the metadata from.
 * @return {{key: *, leaf: boolean, depth: number}} the metadata of the item
 * @export
 */
JsonNodeSet.prototype.getMetadata = function (index) {
  var metadata = { leaf: false, depth: -1 };

  // make sure index are valid
  oj.Assert.assert(index <= this.m_endNode && index >= this.m_startNode);

  // adjust to relative index
  var relIndex = index - this.m_startNode;

  metadata.key = this.m_nodes[relIndex].id
    ? this.m_nodes[relIndex].id
    : this.m_nodes[relIndex].attr.id;
  metadata.leaf = this.m_nodes[relIndex].leaf;
  metadata.depth = this.m_nodes[relIndex].depth;

  if (metadata.leaf == null) {
    if (this.m_nodes[relIndex].children && this.m_nodes[relIndex].children.length > 0) {
      metadata.leaf = false;
    } else {
      metadata.leaf = true;
    }
  }

  return metadata;
};

/**
 * Helper method to update the node's depth recursively with its children.
 * @param {Object} currChild the node to update.
 * @param {number} offset the difference between current and updated depth values.
 * @private
 */
JsonNodeSet.prototype._updateDepth = function (currChild, offset) {
  var i;

  // eslint-disable-next-line no-param-reassign
  offset += 1;
  // eslint-disable-next-line no-param-reassign
  currChild.depth = offset;

  if (currChild.children && currChild.children.length !== 0) {
    for (i = 0; i < currChild.children.length; i++) {
      this._updateDepth(currChild.children[i], offset);
    }
  }
};

/**
 * Gets the node set child of the specified index.
 * @param {number} index the index of the node/row in which we want to retrieve the child node set
 * @return {oj.JsonNodeSet|null} the child node set representing the child tree data.
 * @export
 */
JsonNodeSet.prototype.getChildNodeSet = function (index) {
  // make sure index are valid
  oj.Assert.assert(index <= this.m_endNode && index >= this.m_startNode);

  // adjust to relative index
  var relIndex = index - this.m_startNode;

  var depth = this.m_nodes[relIndex].depth;
  var results = this.m_nodes[relIndex].children;
  if (results == null || results.length === 0) {
    return null;
  }
  var key = this.m_nodes[relIndex].id ? this.m_nodes[relIndex].id : this.m_nodes[relIndex].attr.id;
  for (var i = 0; i < results.length; i++) {
    this._updateDepth(results[i], depth);
  }

  return new JsonNodeSet(0, results.length, results, key, 0);
};

// ////////////////// _JsonTreeNodeDataSource ///////////////////////////////////
/**
 * Helper class to implement sort recursive features for tree.
 * @constructor
 * @private
 */
var _JsonTreeNodeDataSource = function () {
  this.id = null;
  this.depth = 0;
  this.parent = null;
  /** @type {Array} */
  this.children = null;
  this.title = null;
  this.attr = null;
  this.leaf = null;
};

/**
 * Helper comparer method for ascending sort.
 * @private
 */
_JsonTreeNodeDataSource.prototype._ascending = function (key) {
  return function (a, b) {
    if (a.attr != null && b.attr != null) {
      if (a.attr[key] != null && b.attr[key] != null) {
        if (a.attr[key] < b.attr[key]) {
          return -1;
        } else if (a.attr[key] === b.attr[key]) {
          return 0;
        }
        return 1;
      }
    }
    if (a[key] < b[key]) {
      return -1;
    } else if (a[key] === b[key]) {
      return 0;
    }
    return 1;
  };
};

/**
 * Helper comparer method for descending sort.
 * @private
 */
_JsonTreeNodeDataSource.prototype._descending = function (key) {
  return function (a, b) {
    if (a.attr != null && b.attr != null) {
      if (a.attr[key] != null && b.attr[key] != null) {
        if (a.attr[key] < b.attr[key]) {
          return 1;
        } else if (a.attr[key] === b.attr[key]) {
          return 0;
        }
        return -1;
      }
    }
    if (a[key] < b[key]) {
      return 1;
    } else if (a[key] === b[key]) {
      return 0;
    }
    return -1;
  };
};

/**
 * Helper method for recursive sort.
 * @param {Object} criteria the sort criteria.
 * @param {Object} criteria.key the key identifying the attribute to sort on
 *        {string} criteria.direction the sort direction, valid values are "ascending", "descending".
 * @private
 */
_JsonTreeNodeDataSource.prototype._sortRecursive = function (criteria) {
  var key = criteria.key;
  if (this.children == null) {
    return this;
  }

  if (criteria.direction === 'ascending') {
    this.children.sort(this._ascending(key));
  } else if (criteria.direction === 'descending') {
    this.children.sort(this._descending(key));
  }
  for (var i = 0, l = this.children.length; i < l; i++) {
    this.children[i]._sortRecursive(criteria);
  }

  return this;
};

// /////////// JsonTreeDataSource //////////////////

/**
 * @class JsonTreeDataSource
 * @classdesc TreeDataSource implementation that represents hierarchical data available from an array of JSON objects.  This data source can be used by [ListView]{@link oj.ojListView},
 *            [NavigationList]{@link oj.ojNavigationList}, and [TreeView]{@link oj.ojTreeView}.<br><br>
 *            See the Tree View - Data Source: JSON demo for an example.<br><br>
 *            Refer to {@link TreeDataSource} for other data sources that represent hierarchical data.
 * @param {Object} data An array of JSON objects that represent the root nodes.
 *                      <p>Each node object can contain the following properties:</p>
 *                      <p>attr - an object of name-value pairs that represents data for the node.</p>
 *                      <p>children - an array of JSON objects that represent child nodes.</p>
 * @constructor
 * @since 1.0
 * @export
 * @ojtsignore
 * @ojdeprecated {since: '6.0.0', description: 'Use ArrayTreeDataProvider instead.'}
 * @extends oj.TreeDataSource
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
 *                      ]}
 *                   ]},
 *                  {"attr": {"id": "dir2", "title": "Directory 2"},
 *                   "children": [
 *                     {"attr": {"id": "file4", "title": "File 4"}},
 *                     {"attr": {"id": "file5", "title": "File 5"}},
 *                   ]}
 *                ];
 *
 * // Then create a JsonTreeDataSource object with the tree data
 * var dataSource = new JsonTreeDataSource(treeData);
 */
const JsonTreeDataSource = function (data) {
  var tree = new _JsonTreeNodeDataSource(); // that's the root node

  if (data.id == null) {
    tree.id = 'root';
  }

  this.data = this._createTreeDataSource({ count: 0 }, tree, data, 0);

  JsonTreeDataSource.superclass.constructor.call(this, tree);
};
oj._registerLegacyNamespaceProp('JsonTreeDataSource', JsonTreeDataSource);
// Subclass from oj.TreeDataSource
oj.Object.createSubclass(JsonTreeDataSource, oj.TreeDataSource, 'oj.JsonTreeDataSource');

/**
 * Initial the json object based data source.
 * @return {undefined}
 * @export
 * @ojtsignore
 */
JsonTreeDataSource.prototype.Init = function () {
  // call super
  JsonTreeDataSource.superclass.Init.call(this);
};

/**
 * Returns tree based structure/object from json data.
 * @param {Object} c an object to keep track of the count
 * @param {Object} target the final tree structure.
 * @param {Object} source the json object.
 * @param {number=} depth used recursively for depth calculation.
 * @return target
 * @private
 */
JsonTreeDataSource.prototype._createTreeDataSource = function (c, target, source, depth) {
  // Do not copy the code of this function.  It should be cleaned up to not use for-in loops but
  // since data sources are going to be depricated, this is unlikely.

  // eslint-disable-next-line no-restricted-syntax,guard-for-in
  for (var prop in source) {
    if (prop === 'children' || (depth === 0 && source instanceof Array)) {
      var children;
      if (depth === 0 && source instanceof Array) {
        children = source;
      } else {
        children = source[prop];
      }

      // eslint-disable-next-line no-param-reassign
      target.children = [];

      // eslint-disable-next-line no-param-reassign
      depth += 1;
      for (var j = 0; j < children.length; j++) {
        var child = children[j];
        var node = new _JsonTreeNodeDataSource();
        if (child.id == null) {
          // eslint-disable-next-line no-param-reassign
          c.count += 1;
          if (child.attr == null) {
            node.id = 'rid_' + c.count;
          } else if (child.attr.id == null) {
            child.attr.id = 'rid_' + c.count;
          }
        }

        var prp;

        // eslint-disable-next-line no-restricted-syntax,guard-for-in
        for (var propr in child) {
          // eslint-disable-next-line no-restricted-syntax,guard-for-in
          for (prp in node) {
            if (propr === prp && propr !== 'children') {
              node[prp] = child[propr];
            }
            if (prp === 'depth') {
              node[prp] = depth;
            }
          }
        }
        target.children.push(node);
        // eslint-disable-next-line no-restricted-syntax,guard-for-in
        for (prp in child) {
          if (prp === 'children') {
            this._createTreeDataSource(c, target.children[j], child, depth);
          }
        }
      }
    }
  }
  return target;
};

/**
 * Returns the number of children for a specified parent.  If the value returned is not >= 0 then it is automatically assumed
 * that the child count is unknown.
 * @param {any} parentKey the parent key.  Specify null if inquiring child count of the root.
 * @return {number} the number of children for the specified parent.
 * @export
 */
JsonTreeDataSource.prototype.getChildCount = function (parentKey) {
  var parent;

  if (parentKey == null) {
    // eslint-disable-next-line no-param-reassign
    parentKey = this.data.id;
  }

  parent = this._searchTreeById(this.data, parentKey);

  if (parent.children) {
    return parent.children.length;
  }

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
 * @param {function(JsonNodeSet)} callbacks.success the callback to invoke when fetch completed successfully.
 * @param {function({status: *})=} callbacks.error the callback to invoke when fetch children failed.
 * @param {Object=} options optional parameters for this operation.
 * @param {boolean=} options.queueOnly true if this fetch request is to be queued and not execute yet.  The implementation must maintain
 *        the order of the fetch operations.  When queueOnly is false/null/undefined, any queued fetch operations are then
 *        flushed and executed in the order they are queued.  This flag is ignored if the datasource does not support batching.
 * @return {void}
 * @export
 */
// eslint-disable-next-line no-unused-vars
JsonTreeDataSource.prototype.fetchChildren = function (parentKey, range, callbacks, options) {
  var childStart = 0;
  var childEnd = 0;
  var results = [];

  if (parentKey == null) {
    // eslint-disable-next-line no-param-reassign
    parentKey = this.data.id;
  }

  var parent = this._searchTreeById(this.data, parentKey);

  // should never be null but this prevents blowing up if someone tries to call fetchChildren on a leaf
  var childCount = parent.children != null ? parent.children.length : 0;

  if (!range) {
    // eslint-disable-next-line no-param-reassign
    range = [];
    // eslint-disable-next-line no-param-reassign
    range.start = 0;
    // eslint-disable-next-line no-param-reassign
    range.count = childCount;
  }

  if (!range.count) {
    // eslint-disable-next-line no-param-reassign
    range.count = childCount;
  }

  if (!range.start) {
    // eslint-disable-next-line no-param-reassign
    range.start = 0;
  }

  childStart = range.start;
  childEnd = Math.min(childCount, childStart + range.count);

  // now populate results from data array
  for (var i = childStart; i < childEnd; i += 1) {
    var node = new _JsonTreeNodeDataSource();
    if (parent.children[i].attr != null) {
      node.attr = parent.children[i].attr;
    }
    if (parent.children[i].id != null) {
      node.id = parent.children[i].id;
    }
    if (parent.children[i].depth != null) {
      node.depth = parent.children[i].depth;
    }
    if (parent.children[i].title != null) {
      node.title = parent.children[i].title;
    }
    if (parent.children[i].parent != null) {
      node.parent = parent.children[i].parent;
    }
    if (parent.children[i].children != null) {
      node.leaf = false;
    } else {
      node.leaf = true;
    }
    results.push(node);
  }

  // invoke callback
  var nodeSet = new oj.JsonNodeSet(childStart, childEnd, results, parentKey, parent.depth);

  // invoke original success callback
  if (callbacks != null && callbacks.success != null) {
    callbacks.success.call(null, nodeSet);
  }
};

/**
 * Fetch all children and their children recursively from a specified parent.
 * @param {any} parentKey the parent key.  Specify null to fetch everything from the root (i.e. expand all)
 * @param {Object} callbacks the callbacks to be invoke when fetch children operation is completed.  The valid callback
 *        types are "success" and "error".
 * @param {function(JsonNodeSet)} callbacks.success the callback to invoke when fetch completed successfully.
 * @param {function({status: *})=} callbacks.error the callback to invoke when fetch children failed.
 * @param {Object=} options optional parameters for this operation
 * @param {number=} options.start the index related to parent in which to begin fetching descendants from.  If this is not specified, then value zero will be used
 * @param {number=} options.maxCount the maximum number of children to fetch.  If a non-positive number is specified, then the value is ignored and
 *        there is no maximum fetch count
 * @return {void}
 * @export
 */
// eslint-disable-next-line no-unused-vars
JsonTreeDataSource.prototype.fetchDescendants = function (parentKey, callbacks, options) {
  var childStart = 0;
  var childEnd = 0;
  var results = [];

  if (parentKey == null) {
    // eslint-disable-next-line no-param-reassign
    parentKey = this.data.id;
  }

  var parent = this._searchTreeById(this.data, parentKey);

  // should never be null but this prevents blowing up if someone tries to call fetchDescendants on a leaf
  var childCount = parent.children != null ? parent.children.length : 0;

  var range = [];
  range.start = 0;
  range.count = childCount;

  childStart = range.start;
  childEnd = Math.min(childCount, childStart + range.count);

  // now populate results from data array
  for (var i = childStart; i < childEnd; i += 1) {
    if (parent.children[i].children != null) {
      parent.children[i].leaf = false;
    } else {
      parent.children[i].leaf = true;
    }
    results.push(parent.children[i]);
  }

  // invoke callback
  var nodeSet = new oj.JsonNodeSet(0, results.length, results, parentKey, parent.depth);

  // ie original success callback
  if (callbacks != null && callbacks.success != null) {
    callbacks.success.call(null, nodeSet);
  }
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
 * @ojsignature {target: "Type",
 *               value: "'valid'|'invalid'",
 *               for: "returns"}
 * @export
 */
// eslint-disable-next-line no-unused-vars
JsonTreeDataSource.prototype.moveOK = function (rowToMove, referenceRow, position) {
  return 'valid';
};

/**
 * Moves a node from one location to another (different position within the same parent or a completely different parent)
 * @param {any} nodeToMove the key of the node to move
 * @param {any} referenceNode the key of the reference node which combined with position are used to determine
 *        the destination of where the node should moved to.
 * @param {number|string} position The position of the moved node relative to the reference node.
 *        This can be a string: "before", "after", "inside", "first", "last", or the zero based index to position
 *        the element at a specific point among the reference node's current children.
 * @param {Object} callbacks the callbacks for the move function
 * @param {function():void} callbacks.success the callback to invoke when the move completed successfully.
 * @param {function({status: *})=} callbacks.error the callback to invoke when move failed.
 * @return {void}
 * @export
 */
JsonTreeDataSource.prototype.move = function (nodeToMove, referenceNode, position, callbacks) {
  var pos = position;
  var moveNodeKey = nodeToMove;
  var refNodeKey = referenceNode;

  if (refNodeKey == null || refNodeKey === this.data.id) {
    if (pos !== 'inside') {
      error('Error: root can not be the reference node if position equals to ' + pos);
      return;
    }

    if (!refNodeKey) {
      refNodeKey = this.data.id;
    }
  }

  // get node to move;
  var moveNode = this._searchTreeById(null, moveNodeKey);

  // if the moveNode doesn't contain the reference node as its sub-tree the action is allowed
  if (!this._searchTreeById(moveNode, refNodeKey)) {
    var refNode = this._searchTreeById(null, refNodeKey);
    var parent = this._getParentById(refNodeKey);
    var index;

    // remove moveNode from the original position;
    this._removeFromTree(moveNode);
    if (pos === 'inside') {
      this._updateDepth(moveNode, moveNode.depth - (refNode.depth + 1));
      if (refNode.children == null) {
        refNode.children = [];
      }
      refNode.children.push(moveNode);
    } else if (pos === 'before') {
      this._updateDepth(moveNode, moveNode.depth - refNode.depth);
      index = parent.children.indexOf(refNode);
      if (index > -1) {
        if (index !== 0) {
          parent.children.splice(index, 0, moveNode);
        } else {
          parent.children.unshift(moveNode);
        }
      }
    } else if (pos === 'after') {
      this._updateDepth(moveNode, moveNode.depth - refNode.depth);
      index = parent.children.indexOf(refNode);
      if (index > -1) {
        parent.children.splice(index + 1, 0, moveNode);
      }
    } else if (pos === 'first') {
      this._updateDepth(moveNode, moveNode.depth - refNode.depth);
      parent.children.unshift(moveNode);
    } else if (pos === 'last') {
      // update depth recursively
      this._updateDepth(moveNode, moveNode.depth - refNode.depth);
      parent.children.push(moveNode);
    }

    // invoke original success callback
    if (callbacks != null && callbacks.success != null) {
      callbacks.success.call(null, this.data);
    }
  } else {
    error('Error: the node to move contains the reference node as its sub-tree.');
  }
};

/**
 * Performs a sort operation on the tree data.
 * @param {Object} criteria the sort criteria.  It must contain the following properties: key, direction
 * @param {any} criteria.key the key identifying the attribute (column) to sort on
 * @param {'ascending'|'descending'|'none'} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @param {Object} callbacks the callbacks for the move function
 * @param {function():void} callbacks.success the callback to invoke when the sort completed successfully.
 * @param {function({status: *})=} callbacks.error the callback to invoke when sort failed.
 * @return {void}
 * @export
 */
JsonTreeDataSource.prototype.sort = function (criteria, callbacks) {
  var parentKey = this.data.id;

  var parent = this._searchTreeById(this.data, parentKey);

  parent._sortRecursive(criteria);

  // invoke original success callback
  if (callbacks != null && callbacks.success != null) {
    callbacks.success.call(null, parent);
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
 */
JsonTreeDataSource.prototype.getSortCriteria = function () {
  return { key: null, direction: 'none' };
};

/**
 * @param {any} refNodeKey
 * @param {Object=} currNode
 * @return {Object|null} the node with required key value.
 * @private
 */
JsonTreeDataSource.prototype._getParentById = function (refNodeKey, currNode) {
  var i;
  var parent = null;

  if (refNodeKey === this.data.id) {
    return null;
  }

  if (currNode == null) {
    // eslint-disable-next-line no-param-reassign
    currNode = this.data;
  }

  if (currNode.children && currNode.children.length > 0) {
    for (i = 0; i < currNode.children.length; i++) {
      if (
        (currNode.children[i].id && currNode.children[i].id === refNodeKey) ||
        (currNode.children[i].attr && currNode.children[i].attr.id === refNodeKey)
      ) {
        return currNode;
      }
    }
    for (i = 0; i < currNode.children.length; i++) {
      parent = this._getParentById(refNodeKey, currNode.children[i]);
      if (parent) {
        return parent;
      }
    }
  }
  return parent;
};

/**
 * Helper method to traverse through the tree and return the node with required key.
 * @param {Object|null} currChild the start tree node.
 * @param {any|null} parentKey the node key for search.
 * @return {Object|null} the node with required key value.
 * @private
 */
JsonTreeDataSource.prototype._searchTreeById = function (currChild, parentKey) {
  var result = null;

  if (currChild == null) {
    // eslint-disable-next-line no-param-reassign
    currChild = this.data;
  }

  if (
    (currChild.id && currChild.id === parentKey) ||
    (currChild.attr && currChild.attr.id === parentKey)
  ) {
    return currChild;
  } else if (currChild.children != null) {
    for (var i = 0; i < currChild.children.length; i++) {
      if (result) {
        return result;
      }
      if (
        (currChild.children[i].id && currChild.children[i].id === parentKey) ||
        (currChild.children[i].attr && currChild.children[i].attr.id === parentKey)
      ) {
        result = currChild.children[i];
      } else {
        result = this._searchTreeById(currChild.children[i], parentKey);
      }
    }
    return result;
  }
  return result;
};

/**
 * Helper method to update the node's depth alongside with its children.
 * @param {Object} currChild the node to update.
 * @param {number} offset the difference between current and updated depth values.
 * @private
 */
JsonTreeDataSource.prototype._updateDepth = function (currChild, offset) {
  // eslint-disable-next-line no-param-reassign
  currChild.depth -= offset;

  if (currChild.children && currChild.children.length !== 0) {
    for (var i = 0; i < currChild.children.length; i++) {
      this._updateDepth(currChild.children[i], offset);
    }
  }
};

/**
 * Helper method to remove node from the tree (based on depth value).
 * @param {Object} currChild the node to remove.
 * @private
 */
JsonTreeDataSource.prototype._removeFromTree = function (currChild) {
  var key;

  if (currChild.id != null) {
    key = currChild.id;
  } else if (currChild.attr != null) {
    key = currChild.attr.id;
  }

  var parent = this._getParentById(key);
  if (!parent) {
    parent = this.data;
  }
  var index = parent.children.indexOf(currChild);
  if (index > -1) {
    parent.children.splice(index, 1);
  }
};

/**
 * Determines whether this TreeDataSource supports the specified feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the valid features "sort",
 *        "move", "fetchDescendants", "batchFetch"
 * @return {string|null} the name of the feature.  Returns null if the feature is not recognized.
 *         For "sort", the valid return values are: "default", "none".
 *         For "fetchDescendants", the valid return values are: "enable", "disable", "suboptimal".
 *         For "move", the valid return values are: "default", "none".
 *         For "batchFetch", the valid return values are: "enable", "disable".
 * @export
 */
JsonTreeDataSource.prototype.getCapability = function (feature) {
  if (feature === 'fetchDescendants') {
    return 'enable';
  } else if (feature === 'sort') {
    return 'default';
  } else if (feature === 'batchFetch') {
    return 'disable';
  } else if (feature === 'move') {
    return 'full';
  }

  return null;
};

export default JsonTreeDataSource;
