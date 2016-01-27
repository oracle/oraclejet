/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojdatasource-common', 'ojs/ojmodel'], function(oj, $)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * A CollectionNodeSet represents a collection of nodes.  The CollectionNodeSet is an object returned by the success callback
 * of the fetchChildren method on CollectionTreeDataSource.  
 * @constructor
 * @export
 */
oj.CollectionNodeSet = function(parentKey, collection, treeDataSource, start, count)
{
    this.parentKey = parentKey;
    this.collection = collection;
    this.childNodeSet = [];
    this.treeDataSource = treeDataSource;
    // Can't have start exceeding valid indices
    this.start = start < collection.length ? start : collection.length-1;
    // Unknown count: we'll assign it.  Also can't have count exceeding collection size
    this.count = count === -1 ? collection.length : Math.min(collection.length, count);
};

oj.CollectionNodeSet.prototype.FetchDescendants = function(callbacks) {
    this._fetchDescendants(this, true).then(function () {
        if (callbacks['success']) {
            callbacks['success']();
        }
    });
};

oj.CollectionNodeSet.prototype._fetchDescendants = function(nodeSet, topLevel) {  
    return new Promise(function(resolve, reject) {
        var count = nodeSet.getCount();

        // Walk over each node in this node set, and fetch all the descendants of each
        function nextNode(index) {
            if (index < count) {
                nodeSet.FetchChildNodeSet(index, {'success':function(childNodeSet) {
                                                            if (childNodeSet !== null) {
                                                                nodeSet._fetchDescendants(childNodeSet, false).then(function() {
                                                                    nextNode(index+1);
                                                                });
                                                            }
                                                            else {
                                                                nextNode(index+1);
                                                            }
                                                        }});
            }
            else {
                resolve(undefined);
            }
        }
        nextNode(0);
    });
};

oj.CollectionNodeSet.prototype.FetchChildNodeSet = function(index, callbacks) {
    var model = this.collection.at(index);
    var parse = this.treeDataSource.parseMetadata(model);
    if (parse['leaf']) {
        // We're at the leaf: don't fetch any more
        this.childNodeSet[index] = null;
        callbacks['success'](null);
        return;
    }
    
    var collection = this.treeDataSource.GetChildCollection(model);
    var parentKey = this.treeDataSource.parseMetadata(model)['key'];
    var self = this;
    this.treeDataSource.FetchCollection(collection, 0, -1, {'success':function(nodeSet) {
            self.childNodeSet[index] = nodeSet;
            callbacks['success'](nodeSet);
    }}, parentKey); 
};

oj.CollectionNodeSet.prototype._getCollection = function() {
    return this.collection;
};

/**
* Gets the parent key for this result set.  
* @return {Object} the parent key for this result set. 
* @export
*/
oj.CollectionNodeSet.prototype.getParent = function()
{
    return this.parentKey;
};

/**
* Gets the start index of the result set.  
* @return {number} the start index of the result set.
* @export	
*/
oj.CollectionNodeSet.prototype.getStart = function()
{
    return this.start;
};

/**
* Gets the actual count of the result set.  
* @return {number} the actual count of the result set.
* @export	
*/
oj.CollectionNodeSet.prototype.getCount = function()
{
    return this.count;
};

/**
* Gets the data of the specified index.  An error is throw when 1) the range is not yet available and
* 2) the index specified is out of bounds. 
* @param {number} index the index of the node/row in which we want to retrieve the data from.  
* @return {Object} the data for the specified index.  oj.RowData should be returned for data that represents a row
*         with a number of columns.
* @export
*/
oj.CollectionNodeSet.prototype.getData = function(index)
{
    this._checkRange(index);
    return this.collection.at(index).attributes;
};

oj.CollectionNodeSet.prototype._checkRange = function(index) {
    if (index < this.start || index > this.start+this.count) {
        // Out of range
        throw "Out of range";
    }
};

/**
* Gets the metadata of the specified index.  An error is throw when 1) the range is not yet available and 
* 2) the index specified is out of bounds. 
* The metadata that the data source must return are:
*  1) key - Object, the key of the node/row.
*  2) leaf - boolean, true if it's a leaf, false otherwise. 
*  3) depth? - number, the depth of the node/row. (or should the caller just calculate it?)
* @param {number} index the index of the node/row in which we want to retrieve the metadata from.  
* @return {Object} the metadata object for the specific index.
* @export
*/	
oj.CollectionNodeSet.prototype.getMetadata = function(index)
{
    this._checkRange(index);
    
    var metadata = {};

    var model = this.collection.at(index);
    
    var parse = this.treeDataSource.parseMetadata(model);
    metadata['key'] = parse['key'];
    metadata['leaf'] = parse['leaf'];
    metadata['depth'] = parse['depth'];

    return metadata;
};


/**
 * Gets the node set child of the specified index.
 * @param {number} index the index of the node/row in which we want to retrieve the child node set
 * @return {oj.CollectionNodeSet|null} the child node set representing the child collection.
 * @export
 */
oj.CollectionNodeSet.prototype.getChildNodeSet = function(index) {
    this._checkRange(index);
    
    return this.childNodeSet[index];
};
/**
 * oj.Collection based implementation of TreeDataSource
 * @param {Object} options an object containing the following options:<p>
 * root: an oj.Collection specifying the root level Collection<p>
 * childCollectionCallback: a function(oj.Collection,oj.Model):oj.Collection callback to return a child collection given a root and model representing the parent<p>
 * parseMetadata: a function(oj.Model):Object callback to return key, leaf, depth metadata from a given Model<p>
 * @constructor
 * @export
 * @extends oj.TreeDataSource
 */
oj.CollectionTreeDataSource = function(options)
{
    options = options || {};
    this.rootCollection = options['root'];
    this.childCollectionCallback = options['childCollectionCallback'];
    this.parseMetadata = options['parseMetadata'];
    this.sortkey = null;
    this.sortdir = "none";
    // This is a parent->collection cache
    this.cache = {};
    oj.CollectionTreeDataSource.superclass.constructor.call(this);
};

// Default implementation
oj.CollectionTreeDataSource.prototype.parseMetadata = function(model) {    
    return {'key':model['idAttribute']+"="+model['id']};
};

// Subclass from oj.TreeDataSource
oj.Object.createSubclass(oj.CollectionTreeDataSource, oj.TreeDataSource, "oj.CollectionTreeDataSource");

/**
 * Initializes the data source.
 * @export
 */
oj.CollectionTreeDataSource.prototype.Init = function()
{
    // super
    oj.CollectionTreeDataSource.superclass.Init.call(this);
};


/**
 * Returns the number of children for a specified parent.  If the value returned is not >= 0 then it is automatically assumed
 * that the child count is unknown.
 * @param {Object} parent the parent key.  Specify null if inquiring child count of the root.
 * @return {number} the number of children for the specified parent.
 * @export
 */
oj.CollectionTreeDataSource.prototype.getChildCount = function(parent)
{
    var childColl = this.cache[parent];    
    if (childColl) {
        if (childColl.length > 0) {
            return childColl.length;
        }
    }
    this.getChildCollection(parent, {'success': function(coll) {
                return coll.length;
        }});
                                       
    return -1;
};

/**
 * Gets a collection representing the specified parent key's children.
 * @param {Object} key the parent key in which to create an OJ collection for.
 * @param {Object} callbacks success and error callbacks.  The success callback will provide the child collection as the first argument
 * @export
 */
oj.CollectionTreeDataSource.prototype.getChildCollection = function(key, callbacks) {
    this.fetchChildren(key, null, {'success':function(nodeSet) {
            callbacks['success'](nodeSet._getCollection());
    }, 'error':callbacks['error']});
};

/**
 * Fetch the children
 * @param {Object} parent the parent key.  Specify null if fetching children from the root.
 * @param {Object} range information about the range, it must contain the following properties: start, count.<p>
 * range.start the start index of the range in which the children are fetched.<p>
 * range.count the size of the range in which the children are fetched.  <p>
 * @param {Object} callbacks the callbacks to be invoke when fetch children operation is completed.  The valid callback
 *        types are "success" and "error".<p>
 * {function(oj.NodeSet)} callbacks.success the callback to invoke when fetch completed successfully.<p>
 * {function({status: Object})} callbacks.error the callback to invoke when fetch children failed.<p>
 * @param {Object=} options optional parameters for this operation. <p>
 * {boolean=} options.queueOnly true if this fetch request is to be queued and not execute yet.  The implementation must maintain 
 *        the order of the fetch operations.  When queueOnly is false/null/undefined, any queued fetch operations are then
 *        flushed and executed in the order they are queued.  This flag is ignored if the datasource does not support batching.
 * @export
 */
oj.CollectionTreeDataSource.prototype.fetchChildren = function(parent, range, callbacks, options)
{
    range = range || {};
    var start = range['start'] ? range['start'] : 0;
    var count = range['count'] ? range['count'] : -1;
    
    if (parent === null) {
        // Do root
        this.FetchCollection(null, start, count, callbacks, null);
        return;
    }
    // Use child collection callback to set up child collection, then fetch it
    var self = this;
    this._getModelForId(this.rootCollection, parent, 0).then(function(parentModel) {
                                                        if (parentModel) {
                                                            var collection = self.GetChildCollection(parentModel.model);
                                                            try {
                                                                self.FetchCollection(collection, start, count, callbacks, parent);
                                                            }
                                                            catch (error)
                                                            {
                                                                if (callbacks && callbacks['error']) {
                                                                    callbacks['error']({'status': error['message']});
                                                                }
                                                            } 
                                                        }
                                                        else {
                                                            // Couldn't find a model for the given Id: call the error if present
                                                            if (callbacks && callbacks['error']) {
                                                                callbacks['error'](parent);
                                                            }
                                                        }
                                                     });
};


// Called by common model when a model is added to a collection
oj.CollectionTreeDataSource.prototype.ModelAdded = function(model, collection, options) {
    var index = 0;
    if (options && options['at']) {
        index = options['at'];
    }
    var parents = this._getParentChain(collection);
    var parent = parents != null && parents.length > 0 ? parents[parents.length-1] : null;
    var event = this._createEvent(this, "insert", index, parents, this._putModelInNodeSet(parent, model));
    this.handleEvent("change", event);
};

// Called by common model when a model is removed from a collection
oj.CollectionTreeDataSource.prototype.ModelRemoved = function(model, collection, options) {
    var index = 0;
    if (options && options['index']) {
        index = options['index'];
    }
    this._removeCollectionFromCache(model);
    var event = this._createEvent(this, "delete", index, this._getParentChain(collection), null);
    this.handleEvent("change", event);
};

// Called by common model when a model is updated
oj.CollectionTreeDataSource.prototype.ModelUpdated = function(model, options) {
    var collectionForModel = this._getCollectionForModel(model);
    var index = null;
    var parents = null;
    if (collectionForModel) {
        // If this model's collection is found, get the index where it was found and its parent chain from the actual collection
        index = collectionForModel.index;
        parents = this._getParentChain(collectionForModel.collection);
    }
    var parent = parents != null && parents.length > 0 ? parents[parents.length-1] : null;
    var event = this._createEvent(this, "update", index, parents, this._putModelInNodeSet(parent, model));
    this.handleEvent("change", event);
};

// Called if a collection is refreshed
oj.CollectionTreeDataSource.prototype.CollectionRefreshed = function(collection, resp, options) {
    var event = this._createEvent(this, "refresh", null, this._getParentChain(collection), null);
    this.handleEvent("refresh", event);
};

oj.CollectionTreeDataSource.prototype._putModelInNodeSet = function(parent, model) {
/*    var rows = [];
    rows.push(model.attributes);
    var options = {};
    options['idAttribute'] = model['idAttribute'];    
    var rowset = new oj.ArrayRowSet(rows, options);
    rowset.fetch();
    return rowset;*/
    var collection = new oj.Collection();
    collection.add(model);
    return this._getNodeSet(collection, parent, 0, 1);    
};

// Return an array of parent keys representing the parentage of the given collection.  Relies on cached collection fetches.  Array is from
// child key of root on down to collection's parent
oj.CollectionTreeDataSource.prototype._getParentChain = function(collection) {
    var parents = [];
    var parent = null;
    var coll = collection;
    do {
        parent = this._getParentOfCollection(coll);
        if (parent !== null) {
            if (parent !== oj.CollectionTreeDataSource.ROOT_CACHE_KEY) {
                parents.unshift(parent);
            }
            coll = this._getCollectionOfKey(parent);
        }
    } while (parent != null);
    return parents;
};

// Generate the cache key
oj.CollectionTreeDataSource.ROOT_CACHE_KEY = "%!@ROOT%#@!";
oj.CollectionTreeDataSource.prototype._getCacheKey = function(model) {
    // If model (parent) is null, look for the root
    // If model is not an oj.Model, just use it as the key
    var key = model instanceof oj.Model ? this.parseMetadata(model)['key'] : model;
    return model ? key : oj.CollectionTreeDataSource.ROOT_CACHE_KEY;
};

// Return a cached collection given a parent Model.  Null if not cached
oj.CollectionTreeDataSource.prototype.__getParentsChildCollectionFromCache = function(model) {
    return this.cache[this._getCacheKey(model)];
};

// Put a collection into the cache whose parent is represented by model
oj.CollectionTreeDataSource.prototype._setCollectionInCache = function(model, collection) {
    // Tack on listeners
    collection.on(oj.Events.EventType['ADD'], this.ModelAdded, this);
    collection.on(oj.Events.EventType['REMOVE'], this.ModelRemoved, this);
    collection.on(oj.Events.EventType['CHANGE'], this.ModelUpdated, this);
    collection.on(oj.Events.EventType['SYNC'], this.CollectionRefreshed, this);
    this.cache[this._getCacheKey(model)] = collection;
};

// Remove any collections with the given model as a parent
oj.CollectionTreeDataSource.prototype._removeCollectionFromCache = function(model) {
    var key = this._getCacheKey(model);
    for (var prop in this.cache) {
        if (this.cache.hasOwnProperty(prop)) {
            if (prop === key) {
                // Found it: remove listeners and delete it
                this.cache[key].off(null, null, this);
                delete this.cache[key];
                return;
            }
        }
    }
};

// Determine if a model representing a given parent key is found in the given collection
oj.CollectionTreeDataSource.prototype._keyInCollection = function(key, collection) {
    var count = collection.length;
    for (var i = 0; i < count; i++) {
        var currKey = this._getCacheKey(collection.at(i));
        if (key === currKey) {
            return true;
        }
    }
    return false;
};

// Get the collection and index of the given model
oj.CollectionTreeDataSource.prototype._getCollectionForModel = function(model) {
    // Search the cache for the parent key
    for (var prop in this.cache) {
        if (this.cache.hasOwnProperty(prop)) {
            var collection = this.cache[prop];
            for (var i = 0; i < collection.length; i++) {
                if (collection.at(i) === model) {
                    return {index:i, collection:collection};
                }
            }
        }
    }
    return null;    
    
};

// Get the collection containing the given key
oj.CollectionTreeDataSource.prototype._getCollectionOfKey = function(key) {
    // Search the cache for the parent key
    for (var prop in this.cache) {
        if (this.cache.hasOwnProperty(prop)) {
            var collection = this.cache[prop];
            if (this._keyInCollection(key, collection)) {
                return collection;
            }
        }
    }
    return null;    
};

// Get the parent key for the given collection from the cache, if found
oj.CollectionTreeDataSource.prototype._getParentOfCollection = function(collection) {
    // Search the cache for the parent key
    for (var prop in this.cache) {
        if (this.cache.hasOwnProperty(prop)) {
            if (this.cache[prop] === collection) {
                return prop;
            }
        }
    }
    return null;
};

// Return an object giving the child collection for the given model along with a boolean indicating whether the collection was found 
// in cache. 
oj.CollectionTreeDataSource.prototype.GetChildCollection = function(parentModel) {    
    // Is it in the cache?
    var cached = true;
    var collection = this.__getParentsChildCollectionFromCache(parentModel);
    if (!collection) {
        // Nothing found at all yet
        cached = false;
        // Ask the app for the child collection for the given model
        collection = this.childCollectionCallback(this.rootCollection, parentModel);
        if (collection != null) {
            // Make sure we transfer sorting properties...
            this._applySortToCollection(collection);
            // And put it in the cache
            this._setCollectionInCache(parentModel, collection);
        }
    }
    
    return {collection:collection,cached:cached};
};

oj.CollectionTreeDataSource.prototype._createEvent = function(source, operation, index, parent, data) {
    return {'source':source, 'operation':operation, 'index':index, 'parent':parent, 'data':data};
};

// Call to fetch models for an already-created collection
oj.CollectionTreeDataSource.prototype.FetchCollection = function(collection, start, count, callbacks, parent) {
    var self = this;
    if (collection === null) {
        // Fetch the root
        // Check for the root in the cache
        collection = this.__getParentsChildCollectionFromCache(null);
        if (!collection) {
            // Not found, put a representation in there
            collection = {collection:self.rootCollection,cached:false};
            self._setCollectionInCache(null, this.rootCollection);
        }
        else {
            // Root was found precached: set up its information
            collection = {collection:collection, cached:true};
        }
    }
    if (collection) {
        self._fetch(collection, function (coll) {
                                    if (callbacks['success']) {
                                        // return a nodeset version of this fetched collection via the callback
                                        callbacks['success'](self._getNodeSet(coll, parent, start, count));
                                    }
                                }, callbacks['error']);    
    }
};

// Turn collection into a CollectionNodeSet
oj.CollectionTreeDataSource.prototype._getNodeSet = function(collection, parent, start, count) {
    return new oj.CollectionNodeSet(parent, collection, this, start, count);
};

// Do any of the models in this collection or its children have the given key
oj.CollectionTreeDataSource.prototype._scanForKey = function(collection, key) {
    // Search collection for key
    var self = this;
 
    return new Promise(function(resolve, reject) {
        function checkNext(index, collection, key) {
            if (index < collection.length) {
                // Get the model at location index
                collection.at(index, {'deferred':true}).then(function (model) {
                                                            // Does the retrieved model match the key when parsed out?  If so return it
                                                            if (model) {
                                                                var parse = self.parseMetadata(model);
                                                                if (key === parse['key']) {
                                                                    resolve(model);
                                                                    return;
                                                                }
                                                            }
                                                            // No model or no match: go to the next model in the collection
                                                            index++;
                                                            checkNext(index, collection, key);
                                                         });
            }
            else {
                // Hit the end: not found
                resolve(null);
                return;
            }
        };

        // Start checking at the 0th model in the collection
        checkNext(0, collection, key);
    });
};

// Returns a promise with an object giving the model that corresponds to the given key, and the depth in the hierarchy at which it was found
oj.CollectionTreeDataSource.prototype._getModelForId = function(collection, key, depth) {
    var self = this;

    return new Promise(function(resolve, reject) {
        // Does the starting collection contain the key?
        self._scanForKey(collection, key).then(function (model) {
            // Yes, resolve (return it)
            if (model) {
                resolve({model:model, depth: depth});
                return;
            }
            // It does not
            // Wrong collection: search each model's child collections, and check recursively
            var max = collection.length;

            // Check each model in collection now for key
            function getNextCollection(index, tds) {
                if (index < max) {
                    // Return an object containing the child collection of the current collection + whether its cached
                    var childColl = tds.GetChildCollection(collection.at(index));
                    if (!childColl.collection) {
                        // No child collection found: move on to the next model in the current collection
                        index++;
                        getNextCollection(index, tds);
                    } else {
                        // Fetch the child collection if necessary
                        tds._fetch(childColl, function(fetchColl) {
                                        // Now check the child collection recursively for the key, moving depth down 1
                                        tds._getModelForId(fetchColl, key, depth+1).then(function(childModel) {
                                                                                    // Found the model in this collection: unwind
                                                                                    if (childModel) {
                                                                                        // Found somewhere down this tree
                                                                                        resolve(childModel);
                                                                                        return;
                                                                                    } else {
                                                                                        // Not found down that tree
                                                                                        // Move to the next model
                                                                                        index++;
                                                                                        getNextCollection(index, tds);
                                                                                    }
                                                                                });                                
                                    }, null);
                    }
                }
                else {
                    // Hit the end
                    resolve(null);
                }
            }
            // Start checking the collection at the 0th model
            getNextCollection(0, self);
        });
    });
};

// Do a fetch or just return the collection if it came from cache
oj.CollectionTreeDataSource.prototype._fetch = function(collectionCacheObj, success, error) {
    var cached = collectionCacheObj.cached;
    if (cached) {
        // If it's cached, it's fetched
        success(collectionCacheObj.collection);
    }
    else {
        // apply sorting if necessary
        if (this.sortkey && this.sortkey !== "none") {
            collectionCacheObj.collection.comparator = this.sortkey;
            collectionCacheObj.collection.sortDirection = this.sortdir;
        }
        if (collectionCacheObj.collection.length > 0 || !collectionCacheObj.collection.IsUrlBased(null)) {
            // Already fetched: just return
            success(collectionCacheObj.collection);
            return;
        }
        // Do a real fetch from the collection's url
        collectionCacheObj.collection.fetch({'success':function(fetchColl) {
                // Tack on handlers
                success(fetchColl);
        }, 'error':error});
    }
};

/**
 * Fetch all children and their children recursively from a specified parent.
 * @param {Object} parent the parent key.  Specify null to fetch everything from the root (i.e. expand all)
 * @param {Object} callbacks the callbacks to be invoke when fetch children operation is completed.  The valid callback
 *        types are "success" and "error".<p>
 * {function(oj.CollectionNodeSet)} success the callback to invoke when fetch completed successfully.<p>
 * {function({status: Object})} error the callback to invoke when fetch children failed.<p>
 * @param {Object=} options optional parameters for this operation.<p>
 *  {number=} start the index related to parent in which to begin fetching descendants from.  If this is not specified, then <p>
 *  {number=} maxCount the maximum number of children to fetch.  If a non-positive number is specified, then the value is ignored and
 *        there is no maximum fetch count.
 * @export
 */
oj.CollectionTreeDataSource.prototype.fetchDescendants = function(parent, callbacks, options)
{
    var self = this;
    if (parent === null) {
        // Do root
        this.FetchCollection(null, 0, -1, {'success':function(nodeSet) {
                                                    nodeSet.FetchDescendants({'success':function() {
                                                            if (callbacks['success']) {
                                                                callbacks['success'](nodeSet);
                                                            }
                                                    }});
        }}, null);
        return;
    }
    // Use child collection callback to set up child collection, then fetch it
    this._getModelForId(this.rootCollection, parent, 0).then(function(parentModel) {
                                                        if (parentModel) {
                                                            var collection = self.GetChildCollection(parentModel.model);
                                                            self.FetchCollection(collection, 0, -1, {'success':function(nodeSet) {
                                                                    nodeSet.FetchDescendants({'success':function() {
                                                                            if (callbacks['success']) {
                                                                                callbacks['success'](nodeSet);
                                                                            }
                                                                    }});                                                                    
                                                            }}, parent);
                                                        }
                                                     });
};

/**
 * Performs a sort operation on the tree data.
 * @param {Object} criteria the sort criteria.  It must contain the following properties: key, direction<p>
 * criteria.key the key identifying the attribute (column) to sort on<p>
 * criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)<p>
 * @param {function({status: Object})} callbacks.success the callback to invoke when the sort completed successfully.<p>
 * callbacks.error the callback to invoke when sort failed.
 * @export
 */
oj.CollectionTreeDataSource.prototype.sort = function(criteria, callbacks)
{
    var key = criteria['key'];
    var dir = criteria['direction'];
    var needSort = false;
    if (key !== this.sortkey) {
        this.sortkey = key;
        needSort = true;
    }
    if (dir !== this.sortdir) {
        this.sortdir = dir;
        needSort = true;
    }
    if (needSort) {
        // If clearing, clear the cache
        if (this.sortdir === "none") {
            this.cache = {};
        }
        // Go off and sort each collection, as long as it has "criteria" as one of its attributes
        for (var prop in this.cache) {
            if (this.cache.hasOwnProperty(prop)) {
                var collection = this.cache[prop];
                this._applySortToCollection(collection);
            }
        }
    }
    if (callbacks && callbacks['success']) {
        callbacks['success']();
    }
};

oj.CollectionTreeDataSource.prototype._applySortToCollection = function(collection) {
    collection['comparator'] = this.sortkey;
    collection['sortDirection'] = (this.sortdir === "ascending") ? 1 : -1;
    collection.sort();    
};

/**
 * Returns the current sort criteria of the tree data.
 * @return {Object} the current sort criteria.  It should contain the following properties: key, direction where
 *         criteria.key the key identifying the attribute (column) to sort on.  Value is null if it's not sorted.
 *         criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @export
 */
oj.CollectionTreeDataSource.prototype.getSortCriteria = function()
{
    return {'key': this.sortkey, 'direction': this.sortdir};
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
oj.CollectionTreeDataSource.prototype.move = function(rowToMove, referenceRow, position, callbacks)
{
    oj.Assert.failedInAbstractFunction();
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
oj.CollectionTreeDataSource.prototype.moveOK = function(rowToMove, referenceRow, position)
{
    return "invalid";
};

/**
 * Determines whether this CollectionTreeDataSource supports the specified feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the valid features "sort", 
 *        "move", "fetchDescendants", "batchFetch"
 * @return {string|null} the name of the feature.  Returns null if the feature is not recognized.
 *         For "sort", the valid return values are: "default", "none".  
 *         For "fetchDescendants", the valid return values are: "enable", "disable", "suboptimal".  
 *         For "move", the valid return values are: "default", "none".  
 *         For "batchFetch", the valid return values are: "enable", "disable".  
 * @export
 */
oj.CollectionTreeDataSource.prototype.getCapability = function(feature)
{
    if (feature === "sort") {
        return "default";
    }
    if (feature === "move") {
        return "none";
    }
    if (feature === "batchFetch") {
        return "disable";
    }
    if (feature === "fetchDescendants") {
        return "disable";
    }
    return null;
};


});
