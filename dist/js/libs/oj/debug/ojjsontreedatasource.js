/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojdatasource-common'], function(oj, $)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
//////////////////// _JsonTreeNodeDataSource ///////////////////////////////////

/**
 * Helper class to implement sort recursive features for tree.
 * @constructor
 * @private
 */
oj._JsonTreeNodeDataSource = function()
{
    this.id = null;
    this.depth = 0;
    this.parent = null;
    this.children = [];
    this.title = null;
    this.attr = null;
    this.leaf = null;
};

/**
 * Helper comparer method for ascending sort.
 * @private
 */
oj._JsonTreeNodeDataSource.prototype._ascending = function(key)
{
    return function(a, b) 
    {
        if (a.attr && b.attr) 
        {
            if (a.attr[key] && b.attr[key])
            {
                return a.attr[key] < b.attr[key] ? -1 : a.attr[key] === b.attr[key] ? 0 : 1;
            }
        }
        return a[key] < b[key] ? -1 : a[key] === b[key] ? 0 : 1;
    }
};

/**
 * Helper comparer method for descending sort.
 * @private
 */
oj._JsonTreeNodeDataSource.prototype._descending = function(key)
{
    return function(a, b) 
    {
        if (a.attr && b.attr) 
        {
            if (a.attr[key] && b.attr[key])
            {
                return a.attr[key] < b.attr[key] ? 1 : a.attr[key] === b.attr[key] ? 0 : -1;
            }
        }
        return a[key] < b[key] ? 1 : a[key] === b[key] ? 0 : -1;
    }
};

/**
 * Helper method for recursive sort.
 * @param {Object} criteria the sort criteria.
 * @param {Object} criteria.key the key identifying the attribute to sort on
 *        {string} criteria.direction the sort direction, valid values are "ascending", "descending".
 * @private
 */
oj._JsonTreeNodeDataSource.prototype._sortRecursive = function(criteria)
{
    var key = criteria['key'];
    if (criteria['direction'] === 'ascending')
    {
        this.children.sort(this._ascending(key));
    }
    else if (criteria['direction'] === 'descending')
	{
		this.children.sort(this._descending(key));
	}
    for (var i = 0, l = this.children.length; i < l; i++)
    {
        this.children[i]._sortRecursive(criteria);
    }
    return this;
};

///////////// JsonTreeDataSource //////////////////   

/**
 * A json object based implementation of the TreeDataSource.
 * @param {Object} data the json object
 * @constructor
 * @export
 * @extends oj.TreeDataSource
 */
oj.JsonTreeDataSource = function(data)
{
    var tree;

    tree = new oj._JsonTreeNodeDataSource(); // that's the root node

    if (!data.id)
    {
        tree.id = "root";
    }

    this.data = this._createTreeDataSource({count:0}, tree, data);

    oj.JsonTreeDataSource.superclass.constructor.call(this, tree);
};

// Subclass from oj.TreeDataSource
oj.Object.createSubclass(oj.JsonTreeDataSource, oj.TreeDataSource, "oj.JsonTreeDataSource");

/**
 * Initial the json object based data source.
 * @export
 */
oj.JsonTreeDataSource.prototype.Init = function()
{
    // call super
    oj.JsonTreeDataSource.superclass.Init.call(this);
};

/**
 * Returns tree based structure/object from json data.
 * @param {Object} c an object to keep track of the count
 * @param {Object} target the final tree structure. 
 * @param {Object} source the json object.
 * @param {number=} depth used recursively for depth calculation.
 * @return target
 */
oj.JsonTreeDataSource.prototype._createTreeDataSource = function(c, target, source, depth)
{
    var children, node, child, prop, propr, prp, j;

    if (!depth)
    {
        depth = 0;
    }

    for (prop in source)
    {
        if (prop == "children" || (depth == 0 && source instanceof Array))
        {
            if (depth == 0 && source instanceof Array)
            {
                children = source;
            }
            else
            {
                children = source[prop];
            }

            depth++;
            for (j = 0; j < children.length; j++)
            {
                child = children[j];
                node = new oj._JsonTreeNodeDataSource();
                if (!child.id) 
                {
                    c.count++;
                    if (!child.attr) 
                    {
                        node.id = 'rid_' + c.count;
                    } 
                    else if (!child.attr.id) 
                    {
                        child.attr.id = 'rid_' + c.count;
                    }
                }
                for (propr in child)
                {
                    for (prp in node)
                    {
                        if (propr == prp && propr != "children")
                        {    
                            node[prp] = child[propr];
                        }
                        if (prp == "depth")
                        {
                            node[prp] = depth;
                        }
                    }
                }
                target.children.push(node);
                for (prp in child)
                {
                    if (prp == "children")
                    {
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
 * @param {Object} parentKey the parent key.  Specify null if inquiring child count of the root.
 * @return {number} the number of children for the specified parent.
 * @export
 */
oj.JsonTreeDataSource.prototype.getChildCount = function(parentKey)
{
    var parent;

    if (!parentKey)
    {
        parentKey = this.data.id;
    }

    parent = this._searchTreeById(this.data, parentKey);

    if (parent.children)
    {
        return parent.children.length;
    }
    else
    {
        return 0;
    }
};

/**
 * Fetch the children
 * @param {Object} parentKey the parent key.  Specify null if fetching children from the root.
 * @param {Object} range information about the range, it must contain the following properties: start, count.
 * @param {number} range.start the start index of the range in which the children are fetched.
 * @param {number} range.count the size of the range in which the children are fetched.  
 * @param {Object} callbacks the callbacks to be invoke when fetch children operation is completed.  The valid callback
 *        types are "success" and "error".
 * @param {function(oj.JsonNodeSet)} callbacks.success the callback to invoke when fetch completed successfully.
 * @param {function({status: Object})} callbacks.error the callback to invoke when fetch children failed.
 * @param {Object=} options optional parameters for this operation.
 * @param {boolean=} options.queueOnly true if this fetch request is to be queued and not execute yet.  The implementation must maintain 
 *        the order of the fetch operations.  When queueOnly is false/null/undefined, any queued fetch operations are then
 *        flushed and executed in the order they are queued.  This flag is ignored if the datasource does not support batching.
 * @export
 */
oj.JsonTreeDataSource.prototype.fetchChildren = function(parentKey, range, callbacks, options)
{
    var i, childStart, childEnd, nodeSet, results, parent, node;

    childStart = 0;
    childEnd = 0;
    results = [];

    if (!parentKey)
    {
        parentKey = this.data.id;
    }

    parent = this._searchTreeById(this.data, parentKey);

    if (!range)
    {
        range = [];
        range['start'] = 0;
        range['count'] = parent.children.length;
    }

    if (!range['count'])
    {
        range['count'] = parent.children.length;
    }

    if (!range['start'])
    {
        range['start'] = 0;
    }

    childStart = range['start'];
    childEnd = Math.min(parent.children.length, childStart + range['count']);

    // now populate results from data array
    for (i = childStart; i < childEnd; i += 1)
    {
        node = new oj._JsonTreeNodeDataSource();
        if(parent.children[i].attr)
        {
            node.attr = parent.children[i].attr;
        }
        if(parent.children[i].id)
        {
            node.id = parent.children[i].id;
        }
        if(parent.children[i].depth)
        {
            node.depth = parent.children[i].depth;
        }
        if(parent.children[i].title)
        {
            node.title = parent.children[i].title;
        }
        if(parent.children[i].parent)
        {
            node.parent = parent.children[i].parent;
        }
        if(parent.children[i].children.length > 0)
        {
            node.leaf = false;
        }
        else 
        {
            node.leaf = true;
        }
        results.push(node);
    }

    // invoke callback
    nodeSet = new oj.JsonNodeSet(childStart, childEnd, results, parentKey, parent.depth);

    // invoke original success callback
    if (callbacks != null && callbacks['success'] != null)
    {
        callbacks['success'].call(null, nodeSet);
    }
};

/**
 * Fetch all children and their children recursively from a specified parent.
 * @param {Object} parentKey the parent key.  Specify null to fetch everything from the root (i.e. expand all)
 * @param {Object} callbacks the callbacks to be invoke when fetch children operation is completed.  The valid callback
 *        types are "success" and "error".
 * @param {function(oj.JsonNodeSet)} callbacks.success the callback to invoke when fetch completed successfully.
 * @param {function({status: Object})} callbacks.error the callback to invoke when fetch children failed.
 * @param {Object=} maxCount the maximum number of children to fetch.  If a non-positive number is specified, then the value is ignored and
 *        there is no maximum fetch count.
 * @export
 */
oj.JsonTreeDataSource.prototype.fetchDescendants = function(parentKey, callbacks, maxCount)
{
    var range, i, childStart, childEnd, nodeSet, results, parent;

    childStart = 0;
    childEnd = 0;
    results = [];

    if (!parentKey)
    {
        parentKey = this.data.id;
    }

    parent = this._searchTreeById(this.data, parentKey);

    range = [];
    range['start'] = 0;
    range['count'] = parent.children.length;

    childStart = range['start'];
    childEnd = Math.min(parent.children.length, childStart + range['count']);

    // now populate results from data array
    for (i = childStart; i < childEnd; i += 1)
    {       
	if(parent.children[i].children.length > 0)
        {
            parent.children[i].leaf = false;
        }
        else 
        {
            parent.children[i].leaf = true;
        }
        results.push(parent.children[i]); 
    }

    // invoke callback
    nodeSet = new oj.JsonNodeSet(0, results.length, results, parentKey, parent.depth);

    // invoke original success callback
    if (callbacks != null && callbacks['success'] != null)
    {
        callbacks['success'].call(null, nodeSet);
    }
};

/**
 * Checks whether a move operation is valid.
 * @param {Object} rowToMove the key of the row to move
 * @param {Object} referenceRow the key of the reference row which combined with position are used to determine 
 *        the destination of where the row should moved to.
 * @param {number|string} position The position of the moved row relative to the reference row.  
 *        This can be a string: "before", "after", "inside", "first", "last", or the zero based index to position 
 *        the element at a specific point among the reference row's current children.
 * @return {string} returns "valid" if the move is valid, "invalid" otherwise.
 * @export
 */ 
oj.JsonTreeDataSource.prototype.moveOK = function(rowToMove, referenceRow, position)
{
    return "valid";
};

/**
 * Moves a node from one location to another (different position within the same parent or a completely different parent)
 * @param {Object} nodeToMove the key of the node to move
 * @param {Object} referenceNode the key of the reference node which combined with position are used to determine 
 *        the destination of where the node should moved to.
 * @param {number|string} position The position of the moved node relative to the reference node.  
 *        This can be a string: "before", "after", "inside", "first", "last", or the zero based index to position 
 *        the element at a specific point among the reference node's current children.
 * @param {function()} callbacks.success the callback to invoke when the move completed successfully.  
 * @param {function({status: Object})} callbacks.error the callback to invoke when move failed.
 * @export
 */
oj.JsonTreeDataSource.prototype.move = function(nodeToMove, referenceNode, position, callbacks)
{
    var moveNode, refNode, moveNodeKey, refNodeKey, pos, parent, index;

    pos = position;
    moveNodeKey = nodeToMove;
    refNodeKey = referenceNode;

    if ((!refNodeKey || refNodeKey == this.data.id))
    {
        if (pos != "inside")
        {
            oj.Logger.log("Error: root can not be the reference node if position equals to " + pos);
            return;
        }
        else
        {
            if (!refNodeKey)
            {
                refNodeKey = this.data.id;
            }
        }
    }

    //get node to move;
    moveNode = this._searchTreeById(null, moveNodeKey);
    //if the moveNode doesn't contain the reference node as its sub-tree the action is allowed
    if (!this._searchTreeById(moveNode, refNodeKey))
    {
        refNode = this._searchTreeById(null, refNodeKey);

        parent = this._getParentById(refNodeKey);
        //remove moveNode from the original position;
        this._removeFromTree(moveNode);
        if (pos == "inside")
        {
            this._updateDepth(moveNode, moveNode.depth - (refNode.depth + 1));
            refNode.children.push(moveNode);
        }
        else if (pos == "before")
        {
            this._updateDepth(moveNode, moveNode.depth - refNode.depth);
            index = parent.children.indexOf(refNode);
            if (index > -1)
            {
                if (index != 0)
                {
                    parent.children.splice(index - 1, 0, moveNode);
                }
                else
                {
                    parent.children.unshift(moveNode);
                }
            }
        }
        else if (pos == "after")
        {
            this._updateDepth(moveNode, moveNode.depth - refNode.depth);
            index = parent.children.indexOf(refNode);
            if (index > -1)
            {
                parent.children.splice(index, 0, moveNode);
            }
        }
        else if (pos == "first")
        {
            this._updateDepth(moveNode, moveNode.depth - refNode.depth);
            parent.children.unshift(moveNode);
        }
        else if (pos == "last")
        {
            //update depth recursively
            this._updateDepth(moveNode, moveNode.depth - refNode.depth);
            parent.children.push(moveNode);
        }

        // invoke original success callback
        if (callbacks != null && callbacks['success'] != null)
        {
            callbacks['success'].call(null, this.data);
        }
    }
    else
    {
        oj.Logger.log("Error: the node to move contains the reference node as its sub-tree.");
    }
};

/**
 * Performs a sort operation on the tree data.
 * @param {Object} criteria the sort criteria.  It must contain the following properties: key, direction
 * @param {Object} criteria.key the key identifying the attribute (column) to sort on
 *        {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @param {function()} callbacks.success the callback to invoke when the sort completed successfully.  
 * @param {function({status: Object})} callbacks.error the callback to invoke when sort failed.
 * @export
 */
oj.JsonTreeDataSource.prototype.sort = function(criteria, callbacks)
{
    var parent, parentKey;

    parentKey = null;

    if (!parentKey)
    {
        parentKey = this.data.id;
    }

    parent = this._searchTreeById(this.data, parentKey);

    parent._sortRecursive(criteria);

    // invoke original success callback
    if (callbacks != null && callbacks['success'] != null)
    {
        callbacks['success'].call(null, parent);
    }
};

/**
 * Returns the current sort criteria of the tree data.
 * @return {Object} the current sort criteria.  It should contain the following properties: key, direction where
 *         criteria.key the key identifying the attribute (column) to sort on.  Value is null if it's not sorted.
 *         criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @export
 */
oj.JsonTreeDataSource.prototype.getSortCriteria = function()
{
    return {'key': null, 'direction': 'none'};
};

/**
 * @param {string|number} refNodeKey
 * @param {Object=} currNode
 * @return {Object|null} the node with required key value.
 * @private
 */
oj.JsonTreeDataSource.prototype._getParentById = function(refNodeKey, currNode)
{
    var i, parent = null, parentIsFound = false;

    if ((refNodeKey == this.data.id))
    {
        return null;
    }

    if (!currNode)
    {
        currNode = this.data;
    }

    if (currNode.children && currNode.children.length > 0)
    {
        for (i = 0; i < currNode.children.length; i++)
        {
            if ((currNode.children[i].id && currNode.children[i].id == refNodeKey) || (currNode.children[i].attr && currNode.children[i].attr.id == refNodeKey))
            {
                parentIsFound = true;
                return currNode;
                break;
            }
        }
        if (!parentIsFound)
        {
            for (i = 0; i < currNode.children.length; i++)
            {
                parent = this._getParentById(refNodeKey, currNode.children[i]);
                if (parent)
                {
                    parentIsFound = true;
                    return parent;
                    break;
                }
            }

        }
    }
    return parent;
};

/**
 * Helper method to traverse through the tree and return the node with required key.
 * @param {Object|null} currChild the start tree node.
 * @param {Object|null} parentKey the node key for search.
 * @return {Object|null} the node with required key value.
 * @private
 */
oj.JsonTreeDataSource.prototype._searchTreeById = function(currChild, parentKey)
{
    var i, result = null;

    if (!currChild)
    {
        currChild = this.data;
    }

    if ((currChild.id && currChild.id == parentKey) || (currChild.attr && currChild.attr.id == parentKey))
    {
        return currChild;
    }
    else if (currChild.children != null)
    {
        for (i = 0; i < currChild.children.length; i++)
        {
            if (result)
            {
                return result;
                break;
            }
            if ((currChild.children[i].id && currChild.children[i].id == parentKey) || (currChild.children[i].attr && currChild.children[i].attr.id == parentKey))
            {
                result = currChild.children[i];
            }
            else
            {
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
oj.JsonTreeDataSource.prototype._updateDepth = function(currChild, offset)
{
    var i;

    currChild.depth = currChild.depth - offset;

    if (currChild.children && currChild.children.length != 0)
    {
        for (i = 0; i < currChild.children.length; i++)
        {
            this._updateDepth(currChild.children[i], offset);
        }
    }
};


/**
 * Helper method to remove node from the tree (based on depth value).
 * @param {Object} currChild the node to remove.
 * @private
 */
oj.JsonTreeDataSource.prototype._removeFromTree = function(currChild)
{
    var parent, index, key;

    if (currChild.id)
    {
        key = currChild.id;
    }
    else if (currChild.attr)
    {
        key = currChild.attr.id;
    }

    parent = this._getParentById(key);
    if (!parent)
    {
        parent = this.data;
    }
    index = parent.children.indexOf(currChild);
    if (index > -1)
    {
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
oj.JsonTreeDataSource.prototype.getCapability = function(feature)
{
    if (feature === 'fetchDescendants')
    {
        return "enable";
    }
    else if (feature === 'sort')
    {
        return "default";
    }
    else if (feature === 'batchFetch')
    {
        return "disable";
    }
    else if (feature === 'move')
    {
        return "full";
    }
    else
    {
        return null;
    }
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * A JsonNodeSet represents a collection of nodes.  The JsonNodeSet is an object returned by the success callback
 * of the fetchChildren method on TreeDataSource.  
 * @constructor
 * @export
 */
oj.JsonNodeSet = function(startNode, endNode, data, currKey, depth)
{
    // assert startNode/endNode are number
    oj.Assert.assertNumber(startNode, null);
    oj.Assert.assertNumber(endNode, null);

    this.m_depth = depth;
    this.m_key = currKey;
    this.m_startNode = startNode;
    this.m_endNode = endNode;
    this.m_nodes = data;
};

/**
 * Gets the parent key for this result set.  
 * @return {Object} the parent key for this result set. 
 * @export
 */
oj.JsonNodeSet.prototype.getParent = function()
{
    return this.m_key;
};

/**
 * Gets the start index of the result set.  
 * @return {number} the start index of the result set.
 * @export	
 */
oj.JsonNodeSet.prototype.getStart = function()
{
    return this.m_startNode;
};

/**
 * Gets the actual count of the result set.  
 * @return {number} the actual count of the result set.
 * @export	
 */
oj.JsonNodeSet.prototype.getCount = function()
{
    return Math.max(0, this.m_endNode - this.m_startNode);
};

/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds. 
 * @param {number} index the index of the node/row in which we want to retrieve the data from.  
 * @return {Object} the data for the specified index.  oj.RowData should be returned for data that represents a row
 *         with a number of columns.
 * @export
 */
oj.JsonNodeSet.prototype.getData = function(index)
{
    // make sure index are valid
    oj.Assert.assert(index <= this.m_endNode && index >= this.m_startNode);

    // adjust to relative index
    index = index - this.m_startNode;

    if (this.m_nodes[index])
        return this.m_nodes[index].attr;
    else
        return null;
};

/**
 * Gets the metadata of the specified index.  An error is throw when 1) the range is not yet available and 
 * 2) the index specified is out of bounds. 
 * The metadata that the data source must return are:
 *  1) key - Object, the key of the node/row.
 *  2) leaf - boolean, true if it's a leaf, false otherwise. 
 *  3) depth - number, the depth of the node/row. 
 * @param {number} index the index of the node/row in which we want to retrieve the metadata from.  
 * @return {Object} the metadata object for the specific index.
 * @export
 */
oj.JsonNodeSet.prototype.getMetadata = function(index)
{
    var metadata = [];

    // make sure index are valid
    oj.Assert.assert(index <= this.m_endNode && index >= this.m_startNode);

    // adjust to relative index
    index = index - this.m_startNode;

    metadata["key"] = this.m_nodes[index].id ? this.m_nodes[index].id : this.m_nodes[index].attr.id;
    metadata["leaf"] = this.m_nodes[index].leaf;
    metadata["depth"] = this.m_nodes[index].depth;

    if(metadata["leaf"] == null)
    {
        if (this.m_nodes[index].children && this.m_nodes[index].children.length > 0)
        {
            metadata["leaf"] = false;
        }
        else
        {
            metadata["leaf"] = true;
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
oj.JsonNodeSet.prototype._updateDepth = function (currChild, offset)
{
    var i;

    offset++;
    currChild.depth = offset;

    if (currChild.children && currChild.children.length != 0)
    {
        for (i = 0; i < currChild.children.length; i++)
	{
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
oj.JsonNodeSet.prototype.getChildNodeSet = function(index) {

    var results, key, depth, i;

    // make sure index are valid
    oj.Assert.assert(index <= this.m_endNode && index >= this.m_startNode);

    // adjust to relative index
    index = index - this.m_startNode;

    depth = this.m_nodes[index].depth;
    results = this.m_nodes[index].children;
    if(results.length == 0)
    {
        return null;
    }
    key = this.m_nodes[index].id ? this.m_nodes[index].id : this.m_nodes[index].attr.id;
    for(i = 0; i < results.length; i++)
    {
        this._updateDepth(results[i], depth);
    }

    return new oj.JsonNodeSet(0, results.length, results, key, 0);
};
});
