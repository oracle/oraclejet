/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdatasource-common'], 
       /*
        * @param {Object} oj 
        * @param {jQuery} $
        */
       function(oj, $, compCore)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * Convenient class that represents an empty node set
 * @param {Object} parent the parent key
 * @param {number} start the start index
 * @constructor
 * @export
 */
oj.EmptyNodeSet = function(parent, start)
{
    this.m_parent = parent;
    this.m_start = start;
};

/**
 * Gets the parent
 * @return {Object} the key of the parent.
 * @export
 */
oj.EmptyNodeSet.prototype.getParent = function()
{
    return this.m_parent;
};

/**
 * Gets the start index of the result set.  
 * @return {number} the start index of the result set.  
 * @export
 */
oj.EmptyNodeSet.prototype.getStart = function()
{
    return this.m_start;
};

/**
 * Gets the actual count of the result set.  
 * @return {number} the actual count of the result set.  
 * @export
 */
oj.EmptyNodeSet.prototype.getCount = function()
{
    return 0;
};

/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds. 
 * @param {number} index the index of the node/row in which we want to retrieve the data from.  
 * @return {Object} the data for the specified index.
 * @export
 */
oj.EmptyNodeSet.prototype.getData = function(index)
{
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
 * @return {Object} the metadata object for the specific index.
 * @export
 */
oj.EmptyNodeSet.prototype.getMetadata = function(index)
{
    return null;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * Flattens a hierarchical node set, which can happen in node set returned from
 * fetchDescendants call.
 * @param {Object} nodeSet the node set to flatten
 * @param {number=} actualStart in the fetch descendant case the result set would
 *        be a subset of the node set.  This param gives the exact start index in the
 *        wrapped node set where the result should start.
 * @constructor
 * @export
 */
oj.FlattenedNodeSet = function(nodeSet, actualStart)
{
    this.m_nodeSet = nodeSet;
    this.m_start = actualStart;
};

/**
 * Gets the parent
 * @return {Object} the key of the parent.
 * @export
 */
oj.FlattenedNodeSet.prototype.getParent = function()
{
    return this.m_nodeSet.getParent();
};

/**
 * Gets the start index of the result set.  
 * @return {number} the start index of the result set.  
 * @export
 */
oj.FlattenedNodeSet.prototype.getStart = function()
{
    // if explicit start index is specified, use it, otherwise
    // delegate to wrapped node set
    if (this.m_start != undefined)
    {
        return this.m_start;
    }
    else
    {
        return this.m_nodeSet.getStart();
    }
};

/**
 * Gets the actual count of the result set.  
 * @return {number} the actual count of the result set.  
 * @export
 */
oj.FlattenedNodeSet.prototype.getCount = function()
{
    // see if it's calculated already
    if (this.m_count === undefined)
    {
        this.m_count = this._getCount(this.m_nodeSet, 0);

        // if explicit start is specified (subset), need to take that into
        // account when calculating total count
        if (this.m_start != undefined)
        {
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
oj.FlattenedNodeSet.prototype._getCount = function(nodeSet, total)
{
    var start, count, i, child;

    start = nodeSet.getStart();
    count = nodeSet.getCount();
    total = total + count;

    // if there's child node set
    if (nodeSet.getChildNodeSet)
    {
        for (i=0; i<count; i++)
        {
            child = nodeSet.getChildNodeSet(i+start);
            if (child != null)
                total = this._getCount(child, total); 
        }
    }

    return total;
};

/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds. 
 * @param {number} index the index of the node/row in which we want to retrieve the data from.  
 * @return {Object} the data for the specified index.
 * @export
 */
oj.FlattenedNodeSet.prototype.getData = function(index)
{
    return this._getDataOrMetadata(this.m_nodeSet, index, {'index': this.m_nodeSet.getStart()}, this._getData);
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
oj.FlattenedNodeSet.prototype.getMetadata = function(index)
{
    return this._getDataOrMetadata(this.m_nodeSet, index, {'index': this.m_nodeSet.getStart()}, this._getMetadata);
};

/**
 * Callback function to retrieve metadata of specified index in node set
 * @param {Object} nodeSet the node set to retrieve metadata from
 * @param {number} index the index to retrieve metadata from
 * @return {Object} the metadata
 * @private
 */
oj.FlattenedNodeSet.prototype._getMetadata = function(nodeSet, index)
{
    return nodeSet.getMetadata(index);
};

/**
 * Callback function to retrieve data of specified index in node set
 * @param {Object} nodeSet the node set to retrieve data from
 * @param {number} index the index to retrieve data from
 * @return {Object} the data
 * @private
 */
oj.FlattenedNodeSet.prototype._getData = function(nodeSet, index)
{
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
oj.FlattenedNodeSet.prototype._getDataOrMetadata = function(nodeSet, index, current, func)
{
    var start, count, i, currIndex, child, result;

    // walk the node set recursively until we found the index
    start = nodeSet.getStart();
    count = nodeSet.getCount();
    for (i=0; i<count; i++)
    {
        currIndex = current['index'];
        // found the index
        if (currIndex === index)
            return func.call(this, nodeSet, i+start);

        current['index'] = currIndex+1;
        // if there's child node set
        if (nodeSet.getChildNodeSet)
        {
            child = nodeSet.getChildNodeSet(i+start);
            if (child != null)
            {
                result = this._getDataOrMetadata(child, index, current, func); 
                if (result != null)
                    return result;
            }
        }
    }       

    return null;
};

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * Combines two NodeSets together into one.
 * @param {Object} nodeSet1 the first node set
 * @param {Object} nodeSet2 the second node set
 * @param {Object} mergeAt the row key on the first node set where the second node set is merge to 
 * @constructor
 * @export
 */
oj.MergedNodeSet = function(nodeSet1, nodeSet2, mergeAt)
{
    this.m_nodeSet1 = nodeSet1;
    this.m_nodeSet2 = nodeSet2;
    this.m_mergeAt = this._findIndex(mergeAt);
};

/**
 * Retrieve the index of the key within the first node set
 * Which is going to be the index where the two node set merge
 * @param {Object} key the key to find the index
 * @return {number} the index of the key within the first node set, if index is not found, then the last index of the first node set is returned.
 * @private
 */
oj.MergedNodeSet.prototype._findIndex = function(key)
{
    var start, end, i, rowKey;

    start = this.m_nodeSet1.getStart();
    end = start + this.m_nodeSet1.getCount();
    for (i=start; i<end; i++)
    {
        rowKey = this.m_nodeSet1.getMetadata(i)['key'];
        if (key === rowKey)
        {
            return i;
        }
    }

    // if the point cannot be found, the merge happens at the end
    return (end-1);
};

/**
 * Gets the parent
 * @return {Object} the key of the parent.
 * @export
 */
oj.MergedNodeSet.prototype.getParent = function()
{
    // returns the parent of the top node set
    return this.m_nodeSet1.getParent();
};

/**
 * Gets the start index of the result set.  
 * @return {number} the start index of the result set.  
 * @export
 */
oj.MergedNodeSet.prototype.getStart = function()
{
    // returns the start of the top node set
    return this.m_nodeSet1.getStart();
};

/**
 * Gets the actual count of the result set.  
 * @return {number} the actual count of the result set.  
 * @export
 */
oj.MergedNodeSet.prototype.getCount = function()
{
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
oj.MergedNodeSet.prototype.getData = function(index)
{
    var result, set, relIndex;

    result = this._getRelativeIndex(index);
    set = result['set'];
    relIndex = result['index'];

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
oj.MergedNodeSet.prototype.getMetadata = function(index)
{
    var result, set, relIndex;

    result = this._getRelativeIndex(index);
    set = result['set'];
    relIndex = result['index'];

    return set.getMetadata(relIndex);
};

/**
 * Calculate the relative index to the appropriate node set based on where the
 * merge point is.
 * @private
 */
oj.MergedNodeSet.prototype._getRelativeIndex = function(index)
{
    if (index <= this.m_mergeAt)
    {
        return {'set': this.m_nodeSet1, 'index': index};
    }
    else
    {
        var count = this.m_nodeSet2.getCount();
        var end = this.m_mergeAt + count;
        if (index > end)
        {
            // first set
            return {'set': this.m_nodeSet1, 'index': index - count};
        }   
        else
        {
            // second set
            return {'set': this.m_nodeSet2, 'index': index - (this.m_mergeAt+1)};
        }
    }
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * Wraps around the NodeSet to provide additional metadata
 * @param {Object} nodeSet the node set to wrap
 * @param {function(Object, Object)} metadataCallback callback to inject additional metadata information
 * @param {Object=} range the requested range
 * @param {Array=} collapsedKeys an array of the collapsedKeys that should be passed in the expandAll case only
 * @constructor
 * @export
 */
oj.NodeSetWrapper = function(nodeSet, metadataCallback, range, collapsedKeys)
{
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
oj.NodeSetWrapper.prototype.getParent = function()
{
    return this.m_nodeSet.getParent();
};

/**
 * Gets the start index of the result set.  
 * @return {number} the start index of the result set.  
 * @export
 */
oj.NodeSetWrapper.prototype.getStart = function()
{
    // if the requested start is a subset of the result set, adjust
    // accordingly
    if (this.m_range != null)
    {
        return this.m_range['start'];
    }
    else
    {
        return this.m_nodeSet.getStart();
    }
};

/**
 * Gets the actual count of the result set.  
 * @return {number} the actual count of the result set.  
 * @export
 */
oj.NodeSetWrapper.prototype.getCount = function()
{
    var nodeStart, nodeCount;

    nodeStart = this.m_nodeSet.getStart();
    nodeCount = this.m_nodeSet.getCount();

    // if the requested start is a subset of the NodeSet, adjust
    // accordingly
    if (this.m_range != null)
    {
        if (this.m_range['start'] > nodeStart)
        {
            nodeCount = Math.min(0, nodeCount - (this.m_range['start'] - nodeStart));
        }
        else if (this.m_range['start'] < nodeStart)
        {
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
oj.NodeSetWrapper.prototype.getData = function(index)
{
    return this.m_nodeSet.getData(index);
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
oj.NodeSetWrapper.prototype.getMetadata = function(index)
{
    var metadata, rowKey;

    metadata = this.m_nodeSet.getMetadata(index);
    metadata['index'] = index;
    metadata['parentKey'] = this.getParent();
    rowKey = metadata['key'];

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
oj.NodeSetWrapper.prototype.getChildNodeSet = function(index) 
{
    var result;
    if (this.m_collapsedKeys == null || this.m_collapsedKeys.indexOf(this.m_nodeSet.getMetadata(index)['key']) == -1)
    {
        if (this.m_nodeSet.getChildNodeSet)
        {
            result = this.m_nodeSet.getChildNodeSet(index);
            if (result != null)
            {
                // wraps the child nodeset too
                return new oj.NodeSetWrapper(result, this.m_callback, null, this.m_collapsedKeys);
            }
        }
    }
    return null;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
 /**
 * Base class for FlattenedTreeDataGridDataSource and FlattenedTreeTableDataSource
 * @param {Object} treeDataSource the instance of TreeDataSource to flattened
 * @param {Object=} options the options set on the FlattenedDataSource
 * @constructor
 * @export
 * @extends oj.DataSource
 */
oj.FlattenedTreeDataSource = function(treeDataSource, options)
{
    this.m_wrapped = treeDataSource;
    this.m_options = options || {};
    oj.FlattenedTreeDataSource.superclass.constructor.call(this);
};

// Make FlattenedTreeDataSource subclass of oj.DataSource
oj.Object.createSubclass(oj.FlattenedTreeDataSource, oj.DataSource, "oj.FlattenedTreeDataSource");

/**
 * Initializes the data source.
 * @export
 */
oj.FlattenedTreeDataSource.prototype.Init = function()
{
    var expanded;

    // super
    oj.FlattenedTreeDataSource.superclass.Init.call(this);

    // we have to react if the underlying TreeDataSource has changed
    this.m_wrapped.on('change', this._handleModelEvent.bind(this));

    // retrieves the fetch size against the underlying data source
    this.m_fetchSize = parseInt(this.m_options['fetchSize'], 10);
    if (isNaN(this.m_fetchSize))
    {
        this.m_fetchSize = 25;
    }
    // retrieves the maximum number of rows to fetch from the underlying data source
    // once the maximum count has been reached, this data source should stop fetching
    // until either a collapse occurs or a delete model change event.
    this.m_maxCount = parseInt(this.m_options['maxCount'], 10);
    if (isNaN(this.m_maxCount))
    {
        this.m_maxCount = 500;
    }

    // retrieves the initial expanded row keys.  If the expanded is specified to 'all',
    // then mark that all rows should be expanded initially.
    expanded = this.m_options['expanded'];
    if (Array.isArray(expanded))
    {
        this.m_expandedKeys = expanded;
    }
    else
    {
        if (expanded === 'all')
        {
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
 * @return {boolean} Returns false if event is cancelled
 * @export
 */
oj.FlattenedTreeDataSource.prototype.handleEvent = function(eventType, event)
{
    return oj.FlattenedTreeDataSource.superclass.handleEvent.call(this, eventType, event);
};

/**
 * Destroy the data source.
 * @export
 */
oj.FlattenedTreeDataSource.prototype.Destroy = function()
{
    // free internal cache
    delete this.m_cache;
    delete this.m_expandedKeys;
    delete this.m_collapsedKeys;

    // unload listener
    this.m_wrapped.off('change');

    // delegate to underlying data source
    if (this.m_wrapped.Destroy)
    {
        this.m_wrapped.Destroy();
    }
};

/**
 * Retrieves the fetch size
 * @return {number} the fetch size
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.getFetchSize = function()
{
    return this.m_fetchSize;
};

/**
 * Retrieves the max count
 * @return {number} the max count
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.getMaxCount = function()
{
    return this.m_maxCount;
};

/**
 * Retrieves the expanded row keys
 * @return {Array.<Object>|string} an array of expanded row keys or 'all' if 
 *         all rows are expanded.
 * @export
 */
oj.FlattenedTreeDataSource.prototype.getExpandedKeys = function()
{
    return this.m_expandedKeys;
};

/**
 * Retreives the value of the specified option.
 * @param {string} option the option to retrieve the value.
 * @return {Object} the value of the specified option.  Returns null if the
 *         value is null or if the option is not recognized.
 * @export
 */
oj.FlattenedTreeDataSource.prototype.getOption = function(option)
{
    if (this.m_options != null)
    {
        return this.m_options[option];
    }

    // unrecoginzed option or no options set
    return null;
};

/**
 * Retrieves the underlying TreeDataSource.
 * @return {Object} the underlying oj.TreeDataSource.
 * @export
 */
oj.FlattenedTreeDataSource.prototype.getWrappedDataSource = function()
{
    return this.m_wrapped;
};

/**
 * Determine the actual fetch size to use.
 * @param {number} count the child count of the parent node to fetch on.
 * @private
 */
oj.FlattenedTreeDataSource.prototype._getFetchSizeToUse = function(count)
{
    var fetchSize, maxCount;

    fetchSize = this.getFetchSize();
    maxCount = this.getMaxCount();

    if (fetchSize === -1)
    {
        if (count === -1)
        {
            return maxCount;
        }
        return count;
    }
    else
    {
        if (count === -1)
        {
            return Math.min(fetchSize, count);
        }
        return fetchSize;
    } 
};

/**
 * Fetch a range of rows from the underlying data source.  This is a convenient method that
 * the subclasses should use to fetch from the underlying TreeDataSource.  This method will take
 * care of the index mapping between a flattened range to tree indexes.
 * @param {Object} range the range of rows to fetch.  This is the range in a flattened view.
 * @param {number} range.start the start of the range in a flattened view
 * @param {number} range.count the number of rows to fetch
 * @protected
 */ 
oj.FlattenedTreeDataSource.prototype.fetchRows = function(range, callbacks)
{
    // check if we should fetch rows from descendants result set or walk the tree
    // to retrieve children
    if (this._isExpandAll())
    {
        this._fetchRowsFromDescendants(range, callbacks);
    }
    else
    {
        this._fetchRowsFromChildren(range, callbacks);
    }
};

/**
 * Fetch a range of rows from the underlying TreeDataSource.  
 * @param {Object} range the range of rows to fetch.  This is the range in a flattened view.
 * @param {number} range.start the start of the range in a flattened view
 * @param {number} range.count the number of rows to fetch
 * @protected
 */ 
oj.FlattenedTreeDataSource.prototype._fetchRowsFromChildren = function(range, callbacks)
{
    var maxFetchSize, lastEntry, parent, count, index, depth, processed, nodeSet, fetchSize;

    // this condition should always be true since in high watermark scrolling we are
    // always asking for rows after the current last row
    if (range['start'] > this._getLastIndex())
    {
        maxFetchSize = this._getMaxFetchSize();
        // initial fetch
        if (this._getLastIndex() < 0)
        {
            // adjust fetch count if neccessary
            range['count'] = Math.min(maxFetchSize, range['count']);
            this.m_wrapped.fetchChildren(null, range, {"success": function(nodeSet){this._handleFetchSuccess(nodeSet, null, 0, range, 0, callbacks);}.bind(this), "error": function(status){this._handleFetchError(status, callbacks);}.bind(this)});

            return;
        }
        else if (maxFetchSize > 0)
        {
            lastEntry = this._getLastEntry();
            parent = lastEntry['parent'];
            count = this.m_wrapped.getChildCount(parent);
            index = lastEntry['index'];
            depth = lastEntry['depth'];

            // see if we are fetching within the parent
            if (count === -1 || index < count-1)
            {
                fetchSize = this._getFetchSizeToUse(count);
                range['start'] = index+1;
                if (count === -1)
                {
                    range['count'] = fetchSize;
                }
                else
                {
                    range['count'] = Math.min(maxFetchSize, Math.min(fetchSize, count - range['start']));
                }
                this.m_wrapped.fetchChildren(parent, range, {"success": function(nodeSet){this._handleFetchSuccess(nodeSet, parent, depth, range, count, callbacks);}.bind(this), "error": function(status){this._handleFetchError(status, callbacks);}.bind(this)});
            }
            else if (index === count-1)
            {
                // if this is the last child within the parent, then we are done
                nodeSet = new oj.EmptyNodeSet(null, range['start']);
                // invoke original success callback
                if (callbacks != null && callbacks['success'] != null)
                {
                    callbacks['success'].call(null, nodeSet);
                }
            }
            else
            {
                // fetch size is greater than the number of children remaining to fetch
                // so we'll need to go up the path (recursively if necessary) and see if
                // if we need to fetch from ancestors.
                processed = this._fetchFromAncestors(parent, depth, callbacks, maxFetchSize);
                if (!processed)
                {
                    // nothing is used from node set, just return a empty node set
                    nodeSet = new oj.EmptyNodeSet(null, range['start']);
                    // invoke original success callback
                    if (callbacks != null && callbacks['success'] != null)
                    {
                        callbacks['success'].call(null, nodeSet);
                    }
                }
            }
            return;
        }
    }

    // the only case we'll ended up here is if the max count has been reached or
    // for some reason the caller is asking for count = 0
    this.handleMaxCountReached(range, callbacks);
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
oj.FlattenedTreeDataSource.prototype.moveOK = function(rowToMove, referenceRow, position)
{
    return this.m_wrapped.moveOK(rowToMove, referenceRow, position);
};

/**
 * Moves a row from one location to another (different position within the same parent or a completely different parent)
 * @param {Object} rowToMove the key of the row to move
 * @param {Object} referenceRow the key of the reference row which combined with position are used to determine 
 *        the destination of where the row should moved to.
 * @param {number|string} position The position of the moved row relative to the reference row.  
 *        This can be a string: "before", "after", "inside", "first", "last", or the zero based index to position 
 *        the element at a specific point among the reference row's current children.
 * @param {function()} callbacks.success the callback to invoke when the move completed successfully.  
 * @param {function({status: Object})} callbacks.error the callback to invoke when move failed.
 * @export
 */ 
oj.FlattenedTreeDataSource.prototype.move = function(rowToMove, referenceRow, position, callbacks)
{
    this.m_wrapped.move(rowToMove, referenceRow, position, callbacks);
};

/**
 * Determine the maximum possible fetch size.
 * @return {number} the maximum fetch size
 * @private
 */
oj.FlattenedTreeDataSource.prototype._getMaxFetchSize = function()
{
    return this.getMaxCount() - (this._getLastIndex()+1);
};

/**
 * Process error callback for fetchChildren operation before handing it back to original caller.
 * @param {Object} status the error status
 * @param {Object} callbacks the original callbacks passed to the fetch operation
 * @private
 */
oj.FlattenedTreeDataSource.prototype._handleFetchError = function(status, callbacks)
{
    if (callbacks != null && callbacks['error'] != null)
    {
        callbacks['error'].call(null, status);
    }
};

/**
 * Process success callback for fetchChildren operation before handing it back to original caller.
 * @param {Object} nodeSet the set of fetched nodes
 * @param {Object} parent the parent key of the fetch operation
 * @param {number} depth the depth of the nodes
 * @param {Object} range the request range for the fetch operation
 * @param {number} count the child count of the parent, -1 if count is unknown
 * @param {Object} callbacks the original callbacks passed to the fetch operation
 * @private
 */
oj.FlattenedTreeDataSource.prototype._handleFetchSuccess = function(nodeSet, parent, depth, range, count, callbacks)
{
    var toExpand, processed, queue, prevNodeSetInfo;

    // handle result nodeSet
    toExpand = [];
    // wrap it to inject additional metadata
    nodeSet = new oj.NodeSetWrapper(nodeSet, this.insertMetadata.bind(this), range);
    this._processNodeSet(nodeSet, parent, depth, toExpand);

    // if child count is unknown and the result fetched from parent is less than what we asked for 
    // and it's not a root node, go up one level and try to fetch results from its grandparent
    if (count === -1 && nodeSet.getCount() === 0 && parent != null && depth > 0)
    {
        processed = this._fetchFromAncestors(parent, depth, callbacks);
        if (!processed)
        {
            // if nothing is fetched from ancestors, then just return the original empty set
            if (callbacks != null && callbacks['success'] != null)
            {
                callbacks['success'].call(null, nodeSet);
            }
        }
    }
    else
    {
        if (toExpand.length === 0)
        {
            // invoke original success callback
            if (callbacks != null && callbacks['success'] != null)
            {
                callbacks['success'].call(null, nodeSet);
            }
        }
        else
        {
            // there are rows to expand, so we'll need to combine the nodeset after
            // we got the expanded nodeset
            queue = [];
            queue.push(toExpand);

            // we'll reuse the syncExpandRows method, which is used to combine nested expanding
            // nodeset, the only difference is we'll include the callbacks here, see handleExpandSuccess method
            prevNodeSetInfo = {};
            prevNodeSetInfo['callbacks'] = callbacks;
            prevNodeSetInfo['nodeSet'] = nodeSet;
            prevNodeSetInfo['keys'] = [];

            this._syncExpandRows(queue, prevNodeSetInfo);
        }
    }
};

/**
 * Returns the number of children for a specified parent.  If the value returned is not >= 0 then it is automatically assumed
 * that the child count is unknown.
 * @param {Object} parent the parent key.  Specify null if inquiring child count of the root.
 * @return {number} the number of children for the specified parent.
 * @export
 */
oj.FlattenedTreeDataSource.prototype.getChildCount = function(parent)
{
    return this.m_wrapped.getChildCount(parent);
};

/**
 * Go up ancestors and fetch build up fetch requests (if possible) until the fetch size is met.
 * @param {Object} parent the parent key of the fetch operation
 * @param {number} depth the depth of the nodes
 * @param {Object} callbacks the original callbacks passed to the fetch operation
 * @param {number=} maxFetchSize maximum fetch size, optional
 * @return {boolean} true if results are fetched, false if nothing is fetched
 * @private
 */
oj.FlattenedTreeDataSource.prototype._fetchFromAncestors = function(parent, depth, callbacks, maxFetchSize)
{
    var options, remainToFetch, current, i, currEntry, currDepth, count, index, countUnknown, range, fetchSize;

    if (maxFetchSize === undefined)
    {
        maxFetchSize = this._getMaxFetchSize();
    }

    // fetch size is greater than the number of children remaining to fetch
    // so we'll need to go up the path (recursively if necessary) and see if
    // if we need to fetch from ancestors.
    if (this._isBatchFetching())
    {
        options = {'queueOnly': true};
    }

    fetchSize = this._getFetchSizeToUse(-1);
    remainToFetch = fetchSize;
    current = this._getLastIndex();
    for (i=current-1; i>=0; i--)
    {
        currEntry = this._getEntry(i);
        currDepth = currEntry['depth'];
        if (currDepth < depth)
        {
            parent = currEntry['parent'];
            count = this.m_wrapped.getChildCount(parent);
            index = currEntry['index'];

            countUnknown = (count === -1);
            if (countUnknown || index < count-1)
            {
                range = {};
                range['start'] = index+1;
                if (countUnknown)
                {
                    range['count'] = Math.min(maxFetchSize, Math.max(0, remainToFetch));
                    // if count is unknown, we cannot do batch fetch
                    options = undefined;
                    // stop going up parents
                }
                else
                {
                    range['count'] = Math.min(maxFetchSize, Math.min(remainToFetch, count - range['start']));
                }

                // if there's nothing to fetch, quit
                if (range['count'] == 0)
                {
                    break;
                }
                
                // it's always attached at the end
                this.m_wrapped.fetchChildren(parent, range, {"success": function(nodeSet){this._handleFetchSuccess(nodeSet, parent, currDepth, range, count, callbacks);}.bind(this), "error": function(status){this._handleFetchError(status, callbacks);}.bind(this)}, options);

                // go up one level
                depth = currDepth;
                // update remaining fetch count
                remainToFetch = Math.max(0, remainToFetch - range['count']);

                // done if count is unknown or we've reach the root or we've reach total number of rows we want to fetch
                if (countUnknown || currDepth === 0 || remainToFetch === 0)                
                {
                    break;
                }
            }
        }
    }            

    // if batching is used, fire a final fetch children call to flush the queue
    if (options != undefined)
    {
        this.m_wrapped.fetchChildren(parent, {'start': range['count'], 'count': 0}, {"success": function(nodeSet){this._handleFetchSuccess(nodeSet, parent, currDepth, range, count, callbacks);}.bind(this), "error": function(status){this._handleFetchError(status, callbacks);}.bind(this)});
    }

    // return false if no results are fetched
    return (remainToFetch != fetchSize);
};

/**
 * Walk the node set and do whatever processing is neccessary.
 * @param {Object} nodeSet the node set to process
 * @param {Object} parent the parent key of the nodes
 * @param {number} depth the depth of the nodes
 * @param {Array.<Object>=} toExpand the set of keys to be expand.  It is populated by this method.
 * @private
 */
oj.FlattenedTreeDataSource.prototype._processNodeSet = function(nodeSet, parent, depth, toExpand)
{
    var nodeStart, nodeCount, i, metadata, key;

    nodeStart = nodeSet.getStart();
    nodeCount = nodeSet.getCount();

    // walk the node set and populate the internal cache
    for (i=0; i<nodeCount; i++)
    {
        metadata = nodeSet.getMetadata(nodeStart+i);
        key = metadata['key'];

        this._addEntry(key, depth, nodeStart+i, parent);

        if (this._isExpanded(key))
        {
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
oj.FlattenedTreeDataSource.prototype.insertMetadata = function(key, metadata)
{
    if (this._isExpanded(key) && !metadata['leaf'])
    {
        // also update metadata with state info
        metadata['state'] = 'expanded';
    }
    else
    {
        // include state metadata for row expander to render correct icon
        if (metadata['leaf'])
        {
            metadata['state'] = 'leaf';
        }
        else
        {
            metadata['state'] = 'collapsed';
        }
    }
};

/**
 * Fetch a range of rows from the underlying TreeDataSource using the fetchDescendants method.
 * @param {Object} range the range of rows to fetch.  This is the range in a flattened view.
 * @param {number} range.start the start of the range in a flattened view
 * @param {number} range.count the number of rows to fetch
 * @protected
 */ 
oj.FlattenedTreeDataSource.prototype._fetchRowsFromDescendants = function(range, callbacks)
{
    // give implementation a hint of maximum to fetch, implementation can choose to ignore it
    var options = {'maxCount': this.getMaxCount()};

    // give implementation a hint of where to start, implementation can choose to ignore it
    if (this._getLastIndex() >= 0)
    {
        options['start'] = this._getEntry(this._getLastIndex())['key'];
    }

    // invoke method on TreeDataSource
    this.m_wrapped.fetchDescendants(null, {"success": function(nodeSet){this._handleFetchDescendantsSuccess(nodeSet, range, callbacks);}.bind(this), "error": function(status){this._handleFetchError(status, callbacks);}.bind(this)}, options);
};

/**
 * Returns the current sort criteria of the tree data.
 * @return {Object} the current sort criteria.  It should contain the following properties: key, direction where
 *         criteria.key the key identifying the attribute (column) to sort on.  Value is null if it's not sorted.
 *         criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @export
 */
oj.FlattenedTreeDataSource.prototype.getSortCriteria = function()
{
    return this.m_wrapped.getSortCriteria();
};
    
/**
 * Process success callback for fetchDescendants operation before handing it back to original caller.
 * @param {Object} nodeSet the set of fetched nodes
 * @param {Object} range the request range for the fetch operation
 * @param {Object} callbacks the original callbacks passed to the fetch operation
 * @private
 */
oj.FlattenedTreeDataSource.prototype._handleFetchDescendantsSuccess = function(nodeSet, range, callbacks)
{
    var maxFetchSize, count, lastEntry, options, actualStart;

    // this condition should always be true since in high watermark scrolling we are
    // always asking for rows after the current last row
    if (range['start'] > this._getLastIndex())
    {
        maxFetchSize = this._getMaxFetchSize();
        count = Math.min(maxFetchSize, range['count']);

        // wrap it to inject additional metadata
        nodeSet = new oj.NodeSetWrapper(nodeSet, this.insertMetadata.bind(this), null, this.m_collapsedKeys);

        if (this._getLastIndex() >= 0)
        {
            // in fetchDescendants case, the result node set would probably contains more than what
            // we would return.  The issue is we can't really use range to filter the set since the 
            // range in the current view does not map one-to-one to the expand all node set as some 
            // node might have been collapsed before the fetch.
            // the solution is to use the last cached entry to find where new data starts in the
            // result node set, and use range count to limit what to return
            lastEntry = this._getLastEntry();
            options = {'index': 0, 'found': false, 'count': 0};
            this._processDescendantsNodeSet(nodeSet, null, 0, lastEntry, count, options);
            actualStart = options['index'] + 1;
        }
        else
        {
            // initial fetch case, just specify the count to limit result
            options = {'count': 0};
            this._processDescendantsNodeSet(nodeSet, null, 0, null, count, options);
            actualStart = 0;
        }

        if (callbacks != null && callbacks['success'] != null)
        {
            if (options != null)
            {
                if (options['count'] === 0)
                {
                    // nothing is used from node set, just return a empty node set
                    nodeSet = new oj.EmptyNodeSet(null, range['start']);
                }
                else 
                {
                    // wraps node set with a filter that only returns nodes that
                    // have not been fetched already
                    nodeSet = new oj.FlattenedNodeSet(nodeSet, actualStart);
                }
            }
            else
            {
                nodeSet = new oj.FlattenedNodeSet(nodeSet);
            }
            callbacks['success'].call(null, nodeSet);
        }

        return;
    }

    // the only case we'll ended up here is if the max count has been reached or
    // for some reason the caller is asking for count = 0
    this.handleMaxCountReached(range, callbacks);
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
oj.FlattenedTreeDataSource.prototype._processDescendantsNodeSet = function(nodeSet, parent, depth, lastEntry, maxCount, options)
{
    var nodeStart, nodeCount, i, metadata, key, childNodeSet;

    nodeStart = nodeSet.getStart();
    nodeCount = nodeSet.getCount();

    // walk the node set and populate the internal cache
    for (i=0; i<nodeCount; i++)
    {
        // see if we have enough results
        if (options['count'] == maxCount)
        {
            return;
        }

        metadata = nodeSet.getMetadata(nodeStart+i);
        key = metadata['key'];

        // see if we need to check depth
        if (options['checkDepth'])
        {
            if (lastEntry['depth'] === depth)
            {
                options['found'] = true;
                options['checkDepth'] = false;
            }
        }

        if (lastEntry == null || options['found'])
        {
            this._addEntry(key, depth, nodeStart+i, parent);

            options['count'] = options['count'] + 1;

            // include state metadata for row expander
            // in the fetchDescendants case the state is always 'expanded'
            if (metadata['leaf'])
            {
                metadata['state'] = 'leaf';
            }
            else
            {
                metadata['state'] = 'expanded';
            }
        }

        // mark we found the entry in node set that matches the last key
        // the rest of node set we can start pushing to cache
        if (lastEntry != null && !options['found'])
        {
            // we'll need to also check whether the last entry is expanded (or not leaf)
            // if it is collapsed, then we can't add any nodes from the node set until
            // we found child in the node set that has the same depth
            if (key === lastEntry['key'])
            {
                if (metadata['leaf'] || this._isExpanded(key))
                {
                    options['found'] = true;
                }
                else
                {
                    // collapsed.  Mark to check the depth of the next node before
                    // setting found to true.
                    options['checkDepth'] = true;
                }
            }
            else
            {
                options['index'] = options['index'] + 1;
            }
        }

        // process child node set, if any
        if (nodeSet.getChildNodeSet && this._isExpanded(key))
        {
            childNodeSet = nodeSet.getChildNodeSet(i);
            if (childNodeSet != null)
            {
                this._processDescendantsNodeSet(childNodeSet, key, depth+1, lastEntry, maxCount, options);
            }
        }
    }
};

/**
 * Expand the specified row.
 * @param {Object} rowKey the key of the row to expand
 * @export
 */
oj.FlattenedTreeDataSource.prototype.expand = function(rowKey)
{
    this._expand(rowKey);
};

/**
 * Expand the specified row with options
 * @param {Object} rowKey the key of the row to expand
 * @param {Object=} options additional options to pass to fetchChildren method
 * @private
 */
oj.FlattenedTreeDataSource.prototype._expand = function(rowKey, options)
{
    var count, fetchSize, maxCount, refIndex, queue, prevNodeSetInfo;

    count = this.m_wrapped.getChildCount(rowKey);
    fetchSize = this._getFetchSizeToUse(count);
    maxCount = this.getMaxCount();

    // if cache is full, check if the rowKey is the last row, if it's
    // the last row do nothing
    if (this._getLastIndex()+1 === maxCount)
    {
       refIndex = this.getIndex(rowKey);
       if (refIndex == maxCount-1)
       {
           // we'll still have to return an empty nodeset to trigger done to occur in handleExpandSuccess
           this.handleExpandSuccess(rowKey, new oj.EmptyNodeSet(rowKey, 0), 0, options);
           return;
       }
    }

    // nothing to do
    if (fetchSize == 0)
    {
        // we'll still have to return an empty nodeset to trigger done to occur in handleExpandSuccess
        this.handleExpandSuccess(rowKey, new oj.EmptyNodeSet(rowKey, 0), 0, options);
        return;
    }

    this.m_wrapped.fetchChildren(rowKey, {"start": 0, "count": fetchSize}, {"success": function(nodeSet){this.handleExpandSuccess(rowKey, nodeSet, count, options);}.bind(this), "error": function(status){this.handleExpandError(rowKey, status);}.bind(this)});
};

/**
 * Collapse the specified row.
 * @param {Object} rowKey the key of the row to collapse
 * @export
 */
oj.FlattenedTreeDataSource.prototype.collapse = function(rowKey)
{
    var rowIndex, parent, count, depth, lastIndex, i, j, keys;

    rowIndex = this.getIndex(rowKey) + 1;
    parent = this._getEntry(rowIndex-1);

    // keeping track of how many rows to remove
    count = 0;

    depth = parent['depth'];
    lastIndex = this._getLastIndex();
    for (j=rowIndex; j<lastIndex+1; j++)
    {
        var rowData = this._getEntry(j);
        var rowDepth = rowData['depth'];
        if (rowDepth > depth)
        {
            count = count + 1;
        }
        else if (rowDepth == depth)
        {
            break;
        }
    }

    // nothing to do
    if (count == 0)
    {
        // still should fire an event to get the icon state updated properly
        this.handleEvent("collapse", {'rowKey':rowKey});
        return;
    }

    // remove from expanded keys or add to collapsed keys
    if (this._isExpandAll())
    {
        this.m_collapsedKeys.push(rowKey);
    }
    else
    {
        this._removeExpanded(rowKey);
    }

    // remove rows from view
    keys = [];
    for (i=0; i<count; i++)
    {
        keys.push({"key": this._getEntry(rowIndex+i)['key'], "index":rowIndex+i});
    }

    // remove from cache.  Note this has to be done before firing row remove event
    // since it could cause a fetch which relies on the internal cache being up to date.
    this._removeEntry(rowIndex, count);    

    // (firing of event to view)
    this.removeRows(keys);

    // fire datasource event
    this.handleEvent("collapse", {'rowKey':rowKey});
};

/**
 * Checks whether the row key is expanded.
 * @param {Object} rowKey the key of the row to inquire the state
 * @return {boolean} true if the row is/should be expanded.  False otherwise.
 * @private
 */
oj.FlattenedTreeDataSource.prototype._isExpanded = function(rowKey)
{
    if (this._isExpandAll())
    {
        if (this.m_collapsedKeys && this.m_collapsedKeys.length > 0)
        {
            // call helper method to check collapsed keys
            return (this._getCollapsedKeyIndex(rowKey) === -1);
        }
        else
        {
            // everything expanded
            return true;
        }
    }
    else
    {
        if (this.m_expandedKeys && this.m_expandedKeys.length > 0)
        {
            // call helper method to check expanded keys
            return (this._getExpandedKeyIndex(rowKey) > -1);
        }
        else
        {
            // nothing expanded
            return false;
        }
    }
};

/**
 * Helper method to retrieve the index of the row key in the set of collapsed row keys
 * @param {Object} rowKey the key of the row
 * @return {number} the index of the key in the collapsed key array
 * @private
 */ 
oj.FlattenedTreeDataSource.prototype._getCollapsedKeyIndex = function(rowKey)
{
    return this._getKeyIndex(this.m_collapsedKeys, rowKey);
};

/**
 * Helper method to retrieve the index of the row key in the set of expanded row keys
 * @param {Object} rowKey the key of the row
 * @return {number} the index of the key in the expanded key array
 * @private
 */ 
oj.FlattenedTreeDataSource.prototype._getExpandedKeyIndex = function(rowKey)
{
    return this._getKeyIndex(this.m_expandedKeys, rowKey);
};

/**
 * Helper method to retrieve the index of the row key in a specified array
 * @param {Object} rowKey the key of the row
 * @return {number} the index of the key in the array
 * @private
 */ 
oj.FlattenedTreeDataSource.prototype._getKeyIndex = function(arr, rowKey)
{
    var i, index;

    index = -1;
    for (i=0; i<arr.length; i++)
    {
        if (arr[i] === rowKey)
        {
            index = i;
        }
    }

    return index;
}


/**
 * Remove the row key from the expanded cache
 * @param {Object} rowKey the key to remove
 * @private
 */
oj.FlattenedTreeDataSource.prototype._removeExpanded = function(rowKey)
{
    var index = this._getExpandedKeyIndex(rowKey);

    // index found, remove from array
    if (index > -1)
    {
        this.m_expandedKeys.splice(index, 1);    
    }
};

/**
 * Remove the row key from the collapsed cache
 * @param {Object} rowKey the key to remove
 * @private
 */
oj.FlattenedTreeDataSource.prototype._removeCollapsed = function(rowKey)
{
    var index = this._getCollapsedKeyIndex(rowKey);

    // index found, remove from array
    if (index > -1)
    {
        this.m_collapsedKeys.splice(index, 1);    
    }
};

/**
 * Callback method to handle fetch error on expand operation.
 * @param {Object} rowKey the key of the expanded row
 * @param {Object} status the error status
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.handleExpandError = function(rowKey, status)
{
    // fire event, todo: should include error msg?
    this.handleEvent("expand", {'rowKey':rowKey});
};

/**
 * Callback method to handle fetch success on expand operation.
 * @param {Object} rowKey the key of the expanded row
 * @param {Object} nodeSet the node set that describes the children of the expanded row
 * @param {number} childCount the total number of children the expanded row has
 * @param {Object=} options optional parameters to the method
 * @param {Object=} options.queue a queue of expanded rows remaining to process (depth first traversal)
 * @param {Object=} options.prevNodeSetInfo.nodeSet the node set from a previous expand call
 * @param {number=} options.prevNodeSetInfo.firstIndex the ref index for the FIRST expand call, this is needed when firing the insert event, where the insertion point is the first index
 * @param {Object=} options.prevNodeSetInfo.firstKey the ref row key for the FIRST expand call, this is needed when firing the insert event, where the insertion point is the first row key
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.handleExpandSuccess = function(rowKey, nodeSet, childCount, options)
{
    var refIndex, rangeStart, rowStart, rowCount, parent, depth, metadata, key, toExpand, i, j, queue, prevNodeSetInfo, done, maxCount, callbacks;

    // wrap it to inject additional metadata
    nodeSet = new oj.NodeSetWrapper(nodeSet, this.insertMetadata.bind(this));

    refIndex = this.getIndex(rowKey) + 1;
    rangeStart = refIndex;

    rowStart = nodeSet.getStart();
    rowCount = nodeSet.getCount();

    parent = this._getEntry(refIndex-1);
    depth = parent['depth']+1;

    toExpand = [];

    // go through the node set and insert an entry with info about the row into internal cache
    for (i=rowStart; i<rowCount; i++)
    {
        metadata = nodeSet.getMetadata(i);
        key = metadata['key'];
        if (this._isExpanded(key))
        {
            // expand it if the user specified it to be expand (or the
            // parent was previously collapsed before and now expanded again, 
            // the expanded child would need to be expanded also)
            toExpand.push(key);
        }

        // add to cache
        this._insertRow(refIndex, metadata, parent['key'], i, depth);

        refIndex++;
    }

    // keep track of expanded row or collapsed row for expand all case
    if (this._isExpandAll())
    {
        this._removeCollapsed(rowKey);
    }
    else
    {
        // check whether it's already in expanded keys, which is the case
        // if it is expanded by initial expansion
        if (this.m_expandedKeys.indexOf(rowKey) === -1)
        {
            this.m_expandedKeys.push(rowKey);
        }
    }

    // extract optional params
    if (options != undefined)
    {
        queue = options['queue'];
        prevNodeSetInfo = options['prevNodeSetInfo'];
    }

    // see if a previous nodeset has been set and merge with current one 
    // so that we have one nodeset that includes expanded children, a single row insert event
    // is fired and the nodeset will be in the proper order
    if (prevNodeSetInfo != undefined)
    {
        nodeSet = new oj.MergedNodeSet(prevNodeSetInfo['nodeSet'], nodeSet, rowKey);
    }

    // check if there's nothing else to expand and process queue is empty
    done = (toExpand.length == 0 && (queue === undefined || queue.length == 0));
    if (done)
    {
        // fire event to insert the expanded rows
        if (prevNodeSetInfo != undefined)
        {
            // check if this is part of a fetchRows call
            callbacks = prevNodeSetInfo['callbacks'];
            if (callbacks != null)
            {
                // invoke fetch success callback
                callbacks['success'].call(null, nodeSet);
                
                // we are done at this point, we don't fire insert events
                return;
            }
            else
            {
                // use the reference insertion point from prevNodeSetInfo instead
                this.insertRows(prevNodeSetInfo['firstIndex'], prevNodeSetInfo['firstKey'], nodeSet);
            }
        }
        else
        {
            this.insertRows(rangeStart, rowKey, nodeSet);
        }

        // if child count is > fetched or child count is unknown and requested fetch count is the same as result set size, 
        // then delete all rows that comes after the reference row so that we can trigger a fetch when user scroll to the end
        // ALSO delete all rows that comes after reference row if the reference row is the last row (according to max row count)
        maxCount = this.getMaxCount();
        if ((childCount === -1 && rowCount === this.getFetchSize()) || childCount > rowCount || refIndex == maxCount)
        {
            this._deleteAllRowsBelow(refIndex);
        }
        else if (this._getLastIndex() >= maxCount)
        {
            // also clean up rows that goes beyond max row count after expand
            this._deleteAllRowsBelow(maxCount);
        }

        if (prevNodeSetInfo != undefined)
        {
            // fire expand event for each row key cached in prevNodeSetInfo
            for (j=0; j<prevNodeSetInfo['keys'].length; j++)
            {
                this.handleEvent("expand", {'rowKey':prevNodeSetInfo['keys'][j]});
            }
        }

        // fire event
        this.handleEvent("expand", {'rowKey':rowKey});
    }
    else
    {
        // there are still child rows to expand
        // create queue if not yet created
        if (queue === undefined)
        {
            queue = [];
        }

        // push expanded rows to the queue
        if (toExpand.length > 0)
        {
            queue.push(toExpand);
        }

        // create prevNodeSetInfo if not yet created
        if (prevNodeSetInfo === undefined)
        {
            prevNodeSetInfo = {};
            // populate the initial insertion index and key, this is needed when we are actually firing
            // the insert event
            prevNodeSetInfo['firstIndex'] = rangeStart;
            prevNodeSetInfo['firstKey'] = rowKey;
            // cache of row keys for firing expand event when everything is done
            prevNodeSetInfo['keys'] = [];
        }

        // update the previous node set 
        prevNodeSetInfo['nodeSet'] = nodeSet;
        // update keys array for fire expand events later
        prevNodeSetInfo['keys'].push(rowKey);

        // expand any child rows that should be expanded
        this._syncExpandRows(queue, prevNodeSetInfo);
    }
};

/**
 * Expands the specified array of rows synchronously, i.e. one will not start until the previous one is finished.
 * @param {Object} queue the queue of a set of expanded row keys remaining to process 
 * @param {Object} prevNodeSetInfo node set from the previous expand call
 * @private 
 */ 
oj.FlattenedTreeDataSource.prototype._syncExpandRows = function(queue, prevNodeSetInfo)
{
    var last, key, options;

    // peek the last set of expanded rows from queue (since we are doing depth first traversal)
    last = queue[queue.length-1];    
    // then take the first row key from the set
    key = last.shift();
    // if this is the last item in the set, we can remove the set from queue
    if (last.length === 0)
    {
        queue.pop();
    }

    this._expand(key, {'prevNodeSetInfo': prevNodeSetInfo, 'queue': queue});    
};

/**
 * Expands the specified array of rows.  Use batch fetching if supported.
 * @param {Array.<Object>} keys an array of row keys.
 * @private
 */
oj.FlattenedTreeDataSource.prototype._expandRows = function(keys)
{
    var options, i;

    // use batch fetching if supported so we'll have less trip to server.
    if (this._isBatchFetching())
    {
        options = {'queueOnly': true};
    }

    // expand each of the rows
    for (i=0; i<keys.length; i++)
    {
        // last expand should not have any options set to flush to batch queue
        if (i == keys.length-1)
        {
            this._expand(keys[i]);
        }            
        else
        {
            this._expand(keys[i], options);
        }            
    }
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
oj.FlattenedTreeDataSource.prototype._insertRow = function(index, metadata, parentKey, childIndex, depth)
{
    var key, rowData;

    key = metadata['key'];

    if (index <= this._getLastIndex())    
    {
        this._addEntry(key, depth, childIndex, parentKey, index);
    }
    else
    {
        this._addEntry(key, depth, childIndex, parentKey);
    }
};

/**
 * Remove all rows below the row of the specified index including this row.
 * @param {number} index the index from which we start to delete rows 
 * @param {number=} count the number of rows to delete.  If not specified, then delete until the end.
 * @private
 */
oj.FlattenedTreeDataSource.prototype._deleteAllRowsBelow = function(index, count)
{
    var keys, event;

    if (count == undefined)
    {
        count = this._getLastIndex()+1 - index;
    }

    keys = [];
    for (var i=0; i<count; i++)
    {
        keys.push({"row": this._getEntry(index+i)['key'], "index":index+i});
    }

    // update internal cache
    this._removeEntry(index, count);    

    // fire event to remove rows from view
    this.removeRows(keys);
};

/**
 * Handles model event from underlying TreeDataSource.
 * @param {Event} event the model change event
 * @private
 */
oj.FlattenedTreeDataSource.prototype._handleModelEvent = function(event)
{
    var operation, ancestors, parentKey, index;

    operation = event['operation'];
    ancestors = event['parent'];
    if (Array.isArray(ancestors))
    {
        // take the direct key of direct parent
        parentKey = ancestors[ancestors.length-1];
    }
    else
    {
        // single element or null, value is the parent key
        parentKey = ancestors;
    }
    index = event['index'];

    if (operation === 'insert')
    {
        this._handleInsertEvent(parentKey, index, event['data']);
    }
    else if (operation === 'delete')
    {
        this._handleDeleteEvent(parentKey, index);
    }
    else if (operation === 'refresh')
    {
        this._handleRefreshEvent(parentKey);
    }
};

/**
 * Handles insert event from TreeDataSource.
 * @param {Object} parentKey the key of the parent where the node is inserted
 * @param {number} index the index relative to its parent where the noce is inserted
 * @param {Object} nodeSet the node set containing the single insert data
 * @private
 */
oj.FlattenedTreeDataSource.prototype._handleInsertEvent = function(parentKey, index, nodeSet)
{
    var parentIndex, parent, depth, insertIndex, metadata;

    parentIndex = this.getIndex(parentKey);
    parent = this._getEntry(parentIndex);
    depth = parent['depth']+1;
    insertIndex = parentIndex + index + 1;

    // there should only be one row in the set
    metadata = nodeSet.getMetadata(nodeSet.getStart());

    // insert into cache
    this._insertRow(insertIndex, metadata, parentKey, index, depth)    
};

/**
 * Handles delete event from TreeDataSource.
 * @param {Object} parentKey the key of the parent where the node is inserted
 * @param {number} index the index relative to its parent where the noce is inserted
 * @private
 */
oj.FlattenedTreeDataSource.prototype._handleDeleteEvent = function(parentKey, index)
{
    var parentIndex, parent, startIndex, start, count, currentIndex, lastIndex, current;

    parentIndex = this.getIndex(parentKey);
    parent = this._getEntry(parentIndex);

    startIndex = parentIndex + index;
    start = this._getEntry(startIndex);

    // make sure the child data is valid
    oj.Assert.assert(start['parent'] === parent && start['depth'] === parent['depth']+1); 

    // remove the entry and all of its children from cache
    count = 1;
    currentIndex = startIndex + 1;
    lastIndex = this._getLastIndex();
    while (currentIndex <= lastIndex)
    {
        current = this._getEntry(currentIndex);
        // check if we have reached the last child of the deleted node
        if (current['depth'] != start['depth'])
        {
            break;
        }      
        currentIndex++;
    }

    // remove rows
    this._deleteAllRowsBelow(startIndex, count);
};

/**
 * Handles refresh event from TreeDataSource.
 * @param {Object} parentKey the key of the parent where the node is inserted
 * @private
 */
oj.FlattenedTreeDataSource.prototype._handleRefreshEvent = function(parentKey)
{
    if (parentKey == null)
    {
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
oj.FlattenedTreeDataSource.prototype._isExpandAll = function()
{
    var capability = this.m_wrapped.getCapability('fetchDescendants');
    return (this.m_collapsedKeys != undefined && capability != null && capability != 'disable');
};

/**
 * Checks whether batch fetching is supported.
 * @return {boolean} true if batch fetching is supported, false otherwise.
 * @private
 */
oj.FlattenedTreeDataSource.prototype._isBatchFetching = function()
{
    var capability = this.m_wrapped.getCapability('batchFetch');
    return (capability === 'enable');
};

/////////////////////////////// helper methods subclass should find useful //////////////////////////////////////////////
/**
 * Refresh the data source.  Clear out any state.
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.refresh = function()
{
    // clear the cache
    this._clearAll();

    // todo: more work here to force fetch (remove then insert)
};

/**
 * Determine the flattened index for the specified key
 * @param {Object} rowKey the key to find the index
 * @return {number} the index representing the specified key.  Returns -1 if the index
 *         cannot be found.
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.getIndex = function(rowKey)
{
    var lastIndex, i, rowData;

    lastIndex = this._getLastIndex();
    for (i=0; i<=lastIndex; i++)
    {
        rowData = this._getEntry(i);
        if (rowData['key'] == rowKey)
        {
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
oj.FlattenedTreeDataSource.prototype.getKey = function(index)
{
    // ensure the index is valid and in range
    if (index < 0 || index > this._getLastIndex())
    {
        return null;
    }

    // just return from internal cache
    return this._getEntry(index)['key'];
};

/**
 * Returns the currently fetched range.
 * @return {Object} the fetched range (start, end).
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.getFetchedRange = function()
{
    return {'start': 0, 'end': this._getLastIndex()+1};
};

/**
 * Returns the key of the ancestors.
 * @param {Object} rowKey the row key to find the ancestors.
 * @return {Array} an array of the key of the ancestors from root to the row with specified row key.
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.getAncestors = function(rowKey)
{
    var ancestors, index, parent;

    ancestors = [];
    index = this.getIndex(rowKey);
    parent = this._getParent(index);
    while (parent != null)
    {
        ancestors.push(parent);
        index = this.getIndex(parent);
        parent = this._getParent(index);
    }

    // reverse since we want to return from the root
    return ancestors.reverse();
};
///////////////////////////////////// methods subclass must override ////////////////////////////////////////////////////////
/**
 * Handles what happened when the maximum row count has been reached.
 * @param {Object} range the range of the fetch request which caused the max count to be reached.
 * @param {Object} callbacks the callbacks of the fetch request which caused the max count to be reached.
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.handleMaxCountReached = function(range, callbacks)
{
    // send an error by default
    if (callbacks != null && callbacks['error'] != null)
    {
        callbacks['error'].call(null);
    }
};

/**
 * Abstract method to insert a set of rows into the DataGrid/Table
 * @param {number} insertAtIndex the flattened index of the node where the rows are inserted.
 * @param {Object} insertAtKey the key of the node where the rows are inserted (the parent key)
 * @param {Object} nodeSet the node set containing data/metadata of inserted rows
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.insertRows = function(insertAtIndex, insertAtKey, nodeSet)
{
    oj.Assert.failedInAbstractFunction();
};

/**
 * Abstract method to remove the specified rows in the DataGrid/Table
 * @param {Array.<Object>} rowKeys an array of keys of the rows to be remove.
 * @protected
 */
oj.FlattenedTreeDataSource.prototype.removeRows = function(rowKeys)
{
    oj.Assert.failedInAbstractFunction();
};

///////////////////////////////// methods that manipulates the internal cache ///////////////////////////////////
/**
 * Retrieve the flattened index of the last entry fetched so far
 * @return {number} the flattened index of the last entry
 * @private
 */
oj.FlattenedTreeDataSource.prototype._getLastIndex = function()
{
    return this.m_cache.length-1;
};

/**
 * Retrieve the metadata for the last entry fetched so far
 * @return {Object} the metadata for the last entry
 * @private
 */
oj.FlattenedTreeDataSource.prototype._getLastEntry = function()
{
    return this.m_cache[this._getLastIndex()];
};

/**
 * Retrieve metadata info for the specified index.
 * @param {number} index the flattened index 
 * @return {Object} the metadata info
 * @private
 */
oj.FlattenedTreeDataSource.prototype._getEntry = function(index)
{
    return this.m_cache[index];
};

/**
 * Retrieve the parent key for the specified index.
 * @param {number} index the flattened index 
 * @return {Object} the parent key
 * @private
 */
oj.FlattenedTreeDataSource.prototype._getParent = function(index)
{
    var entry = this.m_cache[index];
    if (entry != null)
    {
        return entry['parent'];
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
oj.FlattenedTreeDataSource.prototype._addEntry = function(key, depth, index, parent, insertAt)
{
    var rowData = new Object();
    rowData['key'] = key;
    rowData['depth'] = depth;
    rowData['index'] = index;
    rowData['parent'] = parent;

    if (insertAt === undefined)
    {
        this.m_cache.push(rowData);
    }
    else
    {
        this.m_cache.splice(insertAt, 0, rowData);
    }
};

/**
 * Remove entry from cache
 * @param {number} index the flattened index to start remove entry
 * @param {number} count how many entries to remove starting from the flattened index
 * @private
 */
oj.FlattenedTreeDataSource.prototype._removeEntry = function(index, count)
{
    this.m_cache.splice(index, count);
};

/**
 * Clears the internal cache
 * @private
 */
oj.FlattenedTreeDataSource.prototype._clearAll = function()
{
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
oj.FlattenedTreeDataSource.prototype.getCapability = function(feature)
{
    return this.m_wrapped.getCapability(feature);
};

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojRowExpander
 * @augments oj.baseComponent
 *
 * @classdesc
 * <h3 id="rowexpanderOverview-section">
 *   JET RowExpander Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rowexpanderOverview-section"></a>
 * </h3>
 * <p>Description: A JET RowExpander is a component that is primarily used inside the JET Table and JET DataGrid widgets.  It enables hierarchical data to be display in a JET Table and JET DataGrid.</p>
 *
 * <p>To enable expand and collapse of rows, developers must specify oj.FlattenedTreeTableDataSource as data when used within JET Table and oj.FlattenedTreeDataGridDataSource as data when used within JET DataGrid.</p>
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
 * <p>The location of the row expander will be reversed in RTL reading direction.</p>
 * <p>As with any JET component, in the unusual case that the directionality (LTR or RTL) changes post-init, the component containing the row expander (JET Table or JET DataGrid) must be <code class="prettyprint">refresh()</code>ed.
 */
oj.__registerWidget('oj.ojRowExpander', $['oj']['baseComponent'],
{
    version: "1.0.0",
    widgetEventPrefix: 'oj',
    options:
            {
                /**
                 * The context object obtained from the column renderer (Table) or cell renderer (DataGrid)
                 *
                 * @expose
                 * @memberof! oj.ojRowExpander
                 * @instance
                 * @type {Object}
                 * @default <code class="prettyprint">null</code>
                 *
                 */
                context: null,
                /**
                 * Triggered when a expand is performed on the row expander
                 *
                 * @expose
                 * @event
                 * @memberof! oj.ojRowExpander
                 * @instance
                 * @property {Event} event <code class="prettyprint">jQuery</code> event object
                 * @property {Object} ui Parameters
                 * @property {string} ui.rowKey the key of the row expanded
                 *
                 * @example <caption>Initialize the row expander with the <code class="prettyprint">expand</code> callback specified:</caption>
                 * $( ".selector" ).ojRowExpander({
                 *     "expand": function( event, ui ) {}
                 * });
                 *
                 * @example <caption>Bind an event listener to the <code class="prettyprint">ojexpand</code> event:</caption>
                 * $( ".selector" ).on( "ojexpand", function( event, ui ) {} );
                 */
                expand: null,
                /**
                 * Triggered when a collapse is performed on the row expander
                 *
                 * @expose
                 * @event
                 * @memberof! oj.ojRowExpander
                 * @instance
                 * @property {Event} event <code class="prettyprint">jQuery</code> event object
                 * @property {Object} ui Parameters
                 * @property {string} ui.rowKey the key of the row collapsed
                 *
                 * @example <caption>Initialize the row expander with the <code class="prettyprint">collapse</code> callback specified:</caption>
                 * $( ".selector" ).ojRowExpander({
                 *     "collapse": function( event, ui ) {}
                 * });
                 *
                 * @example <caption>Bind an event listener to the <code class="prettyprint">ojcollapse</code> event:</caption>
                 * $( ".selector" ).on( "ojcollapse", function( event, ui ) {} );
                 */
                collapse: null
            },
    classNames:
            {
                'root': 'oj-rowexpander',
                'icon': 'oj-component-icon',
                'clickable': 'oj-clickable-icon-nocontext',
                'expand': 'oj-rowexpander-expand-icon',
                'collapse': 'oj-rowexpander-collapse-icon',
                'leaf': 'oj-rowexpander-leaf-icon',
                'lazyload': 'oj-rowexpander-lazyload-icon',
                'toucharea': 'oj-rowexpander-touch-area',
                'indent': 'oj-rowexpander-indent',
                'iconspacer': 'oj-rowexpander-icon-spacer',
                'depth0': 'oj-rowexpander-depth-0',
                'depth1': 'oj-rowexpander-depth-1',
                'depth2': 'oj-rowexpander-depth-2',
                'depth3': 'oj-rowexpander-depth-3',
                'depth4': 'oj-rowexpander-depth-4',
                'depth5': 'oj-rowexpander-depth-5',
                'depth6': 'oj-rowexpander-depth-6',
                'depth7': 'oj-rowexpander-depth-7'
    },
    constants :{
        MAX_STYLE_DEPTH: 7,
        NUM5_KEY: 53
    },
    /**
     * Create the row expander
     * @override
     * @memberof! oj.ojRowExpander
     * @protected
     */
    _ComponentCreate: function()
    {
        this._super();
        this.element.addClass(this.classNames['root']);
        this._initContent();
    },
    /**
     * Initialize the row expander after creation
     * @private
     */
    _initContent : function ()
    {
        var self = this, context;

        context = this.options['context'];
        //component now widget constructor
        this.component = typeof context['component'] === 'function' ? context['component']('instance') : context['component'];        
        this.datasource = context['datasource'];

        //root hidden so subtract 1
        this.depth = context['depth'];
        this.iconState = context['state'];
        this.rowKey = context['key'];
        this.index = context['index'];
        this.parentKey = context['parentKey'];

        this._addIndentation();
        this._addIcon();
        this._setIconStateClass();

        if (this.iconState === 'expanded' || this.iconState === 'collapsed')
        {
            $(this.toucharea).on('touchend', function(event) {
                //prevent scroll to top and # append, also prevents the following click
                event.preventDefault();
                self._fireExpandCollapse();
            });

            $(this.toucharea).on('click', function(event) {
                //prevent scroll to top and # append
                event.preventDefault();
                self._fireExpandCollapse();
            });
            $(this.element).on('keypress', function(event) {
                var code = event.keyCode || event.which;
                if (code === $.ui.keyCode.ENTER || code === $.ui.keyCode.SPACE)
                {
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
            $(this.component.element).on('ojkeydown', this.handleKeyDownCallback);

            // listens for expand and collapse event from flattened datasource
            // this could be due to user clicks, keyboard shortcuts or programmatically
            this.handleExpandCallback = this._handleExpandEvent.bind(this);
            this.handleCollapseCallback = this._handleCollapseEvent.bind(this);

            this.datasource.on("expand", this.handleExpandCallback, this);
            this.datasource.on("collapse", this.handleCollapseCallback, this);
        }
        else if (this.iconState === 'leaf')
        {
            // we'll still need to handle ctrl+alt+5 for leaf node
            // listen for key down event from host component
            this.handleKeyDownCallback = this._handleKeyDownEvent.bind(this);
            $(this.component.element).on('ojkeydown', this.handleKeyDownCallback);
            $(this.icon).attr('tabindex', -1);
        }

        // listen for active key change event from host component
        this.handleActiveKeyChangeCallback = this._handleActiveKeyChangeEvent.bind(this);
        $(this.component.element).on('ojbeforecurrentcell', this.handleActiveKeyChangeCallback);
    },
    /**
     * Refresh the row expander having made external modifications
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof! oj.ojRowExpander
     * @instance
     *
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * $( ".selector" ).ojRowExpander( "refresh" );
     */
    refresh: function()
    {
        this.element.empty();
        this._initContent();
    },
    /**
     * destroy the row expander
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof! oj.ojRowExpander
     * @instance
     * @private
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * $( ".selector" ).ojRowExpander( "destroy" );
     */
    _destroy: function()
    {
        // unregister keydown and active key change handlers
        $(this.component.element).off('ojkeydown', this.handleKeyDownCallback);
        $(this.component.element).off('ojbeforecurrentcell', this.handleActiveKeyChangeCallback);

        // unregister expand/collapse events
        this.datasource.off("expand", this.handleExpandCallback, this);
        this.datasource.off("collapse", this.handleCollapseCallback, this);

        this.element.removeClass(this.classNames['root']);
        this.element.empty();
    },
    /**
     * Sets a single option value
     * @param {Object} key the option key
     * @param {Object} value the option value
     * @param {Object} flags additional flags for option*
     * @override
     * @private
     */
    _setOption: function(key, value, flags)
    {
        this._super(key, value, flags);
        // refresh if context is updated
        if (key == 'context')
        {
            this.refresh();
        }
    },
    /**
     * Add athe indentation spacers to the row
     * @private
     */
    _addIndentation: function()
    {
        var remainder, i, depth;
        //0 index the depth for style purposes
        depth = this.depth-1;
        if (depth < this.constants.MAX_STYLE_DEPTH)
        {
            this._appendSpacer(depth);
        }
        else
        {
            for (i=1; i <= (depth/(this.constants.MAX_STYLE_DEPTH)); i++)
            {
                this._appendSpacer(this.constants.MAX_STYLE_DEPTH);
            }
            remainder = (depth % this.constants.MAX_STYLE_DEPTH);
            if (remainder < this.constants.MAX_STYLE_DEPTH)
            {
                this._appendSpacer(remainder);
            }
        }
    },
    /**
     * Append appropriate spacer based on depth to the row expander
     * @param {number} depth the depth
     * @private
     */
    _appendSpacer: function(depth)
    {
        var spacer = $(document.createElement('span')).addClass(this.classNames['indent']).addClass(this.classNames['depth'+depth]);
        this.element.append(spacer); //@HTMLUpdateOK
    },
    /**
     * Add an icon to the row expander with appropriate class names for a clickable icon.
     * @private
     */
    _addIcon: function()
    {
        var iconSpacer = $(document.createElement('div')).addClass(this.classNames['iconspacer']);
        this.toucharea = $(document.createElement('div')).addClass(this.classNames['toucharea']);
        this.icon = $(document.createElement('a')).attr('href', '#').attr('aria-labelledby', this._getLabelledBy()).addClass(this.classNames['icon']).addClass(this.classNames['clickable']);
        this.element.append(iconSpacer.append(this.toucharea.append(this.icon))); //@HTMLUpdateOK
    },
    /**
     * Add a class name on the icon
     * @private
     * @param {string} classKey the key of the appropriate icon class expand/collapse/leaf
     */
    _addIconClass: function(classKey)
    {
        this.icon.addClass(this.classNames[classKey]);
    },
    /**
     * Remove a class name on the icon
     * @private
     * @param {string} classKey the key of the appropriate icon class expand/collapse/leaf
     */
    _removeIconClass: function(classKey)
    {
        this.icon.removeClass(this.classNames[classKey]);
    },
    /**
     * Set the icon class to the the iconState property
     * @private
     */
    _setIconStateClass: function()
    {
        switch (this.iconState)
        {
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
        }

    },
    /**
     * Removes the icon class of the iconState property
     * @private
     */
    _removeIconStateClass: function()
    {
        switch (this.iconState)
        {
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
        }

    },
    /**
     * Handles active key change event from host component (ojDataGrid or ojTable)
     * @param {Event} event
     * @param {Object} ui
     * @private
     */
    _handleActiveKeyChangeEvent: function(event, ui)
    {
        var rowKey, previousRowKey, context, state;
        if (ui['currentCell'] != null)
        {
            rowKey = ui['currentCell']['type'] == 'cell' ? ui['currentCell']['keys']['row'] :  ui['currentCell']['key'];
            if (ui['previousValue'] != null)
            {
                previousRowKey = ui['previousCurrentCell']['type'] == 'cell' ? ui['previousCurrentCell']['keys']['row'] :  ui['previousCurrentCell']['key'];
            }
            // if the event is for this row and the active key change event is triggered
            // by row change and not column change
            if (this.rowKey === rowKey && previousRowKey != rowKey)
            {
                // if the component allows AccessibleContext to be set
                if (this.component._setAccessibleContext)
                {
                    // row context of row expander for screen reader
                    // todo: get index from TreeDataSource as well since that could change
                    context = this.getTranslatedString('accessibleRowDescription', {'level': this.depth, 'num': this.index+1, 'total': this.datasource.getWrappedDataSource().getChildCount(this.parentKey)});
                    // state of row expander for screen reader
                    if (this.iconState === 'collapsed')
                    {
                        state = this.getTranslatedString('accessibleStateCollapsed');
                    }
                    else if (this.iconState === 'expanded')
                    {
                        state = this.getTranslatedString('accessibleStateExpanded');
                    }
                    else
                    {
                        // for leaf node don't read anything
                        state = '';
                    }

                    this.component._setAccessibleContext({'context': context, 'state': state});
                }
            }
        }
    },
    /**
     * Handles keydown event from host component (ojDataGrid or ojTable)
     * @param {Event} event
     * @param {Object} ui
     * @private
     */
    _handleKeyDownEvent: function(event, ui)
    {
        var rowKey, code, context, ancestorInfo, ancestors, i;

        rowKey = ui['rowKey'];
        if (this.rowKey === rowKey)
        {
            event = event['originalEvent'];
            code = event.keyCode || event.which;
            // ctrl (or equivalent) is pressed
            if (oj.DomUtils.isMetaKeyPressed(event))
            {
                // Ctrl+Right expands, Ctrl+Left collapse in accordance with WAI-ARIA best practice
                // consume the event as it's processed
                if (code == $.ui.keyCode.RIGHT && this.iconState === 'collapsed')
                {
                    this._loading();
                    this.datasource.expand(this.rowKey);
                    event.preventDefault();
                }
                else if (code == $.ui.keyCode.LEFT && this.iconState === 'expanded')
                {
                    this._loading();
                    this.datasource.collapse(this.rowKey);
                    event.preventDefault();
                }
                else if (event.altKey && code == this.constants.NUM5_KEY)
                {
                    // read current cell context
                    if (this.component._setAccessibleContext)
                    {
                        ancestors = this.datasource.getAncestors(this.rowKey);
                        if (ancestors != null && ancestors.length > 0)
                        {
                            ancestorInfo = [];
                            for (i=0; i<ancestors.length; i++)
                            {
                                ancestorInfo.push({'key': ancestors[i], 'label': this.getTranslatedString('accessibleLevelDescription', {'level': i+1})});
                            }
                        }

                        context = this.getTranslatedString('accessibleRowDescription', {'level': this.depth, 'num': this.index+1, 'total': this.datasource.getWrappedDataSource().getChildCount(this.parentKey)});
                        this.component._setAccessibleContext({'context': context, 'state': '', 'ancestors': ancestorInfo});
                        event.preventDefault();
                    }
                }
            }
        }
    },
    /**
     * Put row expander in a loading state.  This is called during expand/collapse.
     * @private
     */
    _loading: function()
    {
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
    _handleExpandEvent: function(event)
    {
        var rowKey = event['rowKey'];
        if (rowKey === this.rowKey)
        {
            this._removeIconStateClass();
            this.iconState = 'expanded';
            this._setIconStateClass();
            this._ariaExpanded(true);
            this._trigger('expand', null, {'rowKey': rowKey});
        }
    },
    /**
     * Handle a collapse event coming from the datasource,
     * update the icon and the aria-expand property
     * @param {Object} event the collapse event from the data source, should contain rowKey
     * @private
     */
    _handleCollapseEvent: function(event)
    {
        var rowKey = event['rowKey'];
        if (rowKey === this.rowKey)
        {
            this._removeIconStateClass();
            this.iconState = 'collapsed';
            this._setIconStateClass();
            this._ariaExpanded(false);
            this._trigger('collapse', null, {'rowKey': rowKey});
        }
    },
    /**
     * Fire the expand or collapse on the datasource and the oj event on the widget
     * @private
     */
    _fireExpandCollapse: function()
    {
        var state = this.iconState;

        // show loading icon, note this changes the icon state to 'loading'
        this._loading();

        // invoke expand/collapse on datasource
        if (state === 'collapsed')
        {
            this.datasource.expand(this.rowKey);
        }
        else if (state === 'expanded')
        {
            this.datasource.collapse(this.rowKey);
        }
    },
    /**
     * Sets the icon's aria-expanded property to the boolean passed in
     * @param {boolean|null} bool true if expanded false if not
     * @private
     */
    _ariaExpanded: function(bool)
    {
        this.icon.attr('aria-expanded', bool);
    },
    /**
     * Return the subcomponent node represented by the documented locator attribute values.
     * <p>
     * To lookup the expand/collapse icon the locator object should have the following:
     * <ul>
     * <li><b>subId</b>: 'oj-rowexpander-disclosure'</li>
     * </ul>
     *
     * @expose
     * @memberof! oj.ojRowExpander
     * @instance
     * @override
     * @param {Object} locator An Object containing at minimum a subId property
     *        whose value is a string, documented by the component, that allows
     *         the component to look up the subcomponent associated with that
     *        string.  It contains:<p>
     *        component: optional - in the future there may be more than one
     *        component contained within a page element<p>
     *        subId: the string, documented by the component, that the component
     *        expects in getNodeBySubId to locate a particular subcomponent
     * @returns {Element|null} the subcomponent located by the subId string passed
     *          in locator, if found.<p>
     */
    getNodeBySubId: function(locator)
    {
        var subId;

        if (locator == null)
        {
            return this.element ? this.element[0] : null;
        }

        subId = locator['subId'];
        if ((subId === 'oj-rowexpander-disclosure' || subId === 'oj-rowexpander-icon') && this.icon != null)
        {
            return this.icon.get(0);
        }
        // Non-null locators have to be handled by the component subclasses
        return null;
    },

    /**
     * Returns the subId string for the given child DOM node.  For more details, see
     * <a href="#getNodeBySubId">getNodeBySubId</a>.
     *
     * @expose
     * @override
     * @memberof oj.ojRowExpander
     * @instance
     *
     * @param {!Element} node - child DOM node
     * @return {Object|null} The subId for the DOM node, or <code class="prettyprint">null</code> when none is found.
     *
     * @example <caption>Get the subId for a certain DOM node:</caption>
     * var subId = $( ".selector" ).ojRowExpander( "getSubIdByNode", nodeInsideComponent );
     */
    getSubIdByNode: function(node)
    {
        if (node === this.icon.get(0))
        {
            return {subId: 'oj-rowexpander-disclosure'};
        }
        return null;
    },
    _NotifyAttached: function()
    {
        this._super();
        this.icon.attr('aria-labelledby', this._getLabelledBy());
    },
    /**
     * Get the aria label of the rowexpander from the closest row expander
     * @return {string} the closest id set to the rowexpander
     * @private
     */
    _getLabelledBy: function()
    {
        return this.element.parent().closest('[id]').attr('id');
    }

    //////////////////     FRAGMENTS    //////////////////
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
     *       <td rowspan="2">Focused Row or Cell with Row Expander</td>
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

    //////////////////     SUB-IDS     //////////////////

    /**
     * <p>Sub-ID for the ojRowExpander component's icon.</p>
     *
     * @ojsubid oj-rowexpander-disclosure
     * @memberof oj.ojRowExpander
     *
     * @example <caption>Get the icon from the row expander component:</caption>
     * var node = $( ".selector" ).ojRowExpander( "getNodeBySubId", {'subId': 'oj-rowexpander-disclosure'} );
     */
    
    /**
     * @deprecated Use the <a href="#oj-rowexpander-disclosure">oj-rowexpander-disclosure</a> option instead. 
     * @ojsubid oj-rowexpander-icon
     * @memberof oj.ojRowExpander
     */    
});

});
