/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojmodel', 'ojs/ojdatasource-common'], function(oj, $, Model)
{
  "use strict";


/* global Promise:false */

/**
 * A CollectionNodeSet represents a collection of nodes.  The CollectionNodeSet is an object returned by the success callback
 * of the fetchChildren method on CollectionTreeDataSource.
 * @implements oj.NodeSet
 * @constructor
 * @final
 * @since 1.0
 * @param {any} parentKey the key of the parent node
 * @param {oj.Collection} collection the Collection associated with this NodeSet
 * @param {Array.<oj.Model>} models a set of Model objects associated with this NodeSet
 * @param {oj.CollectionTreeDataSource} treeDataSource the TreeDataSource associated with this NodeSet
 * @param {number} start the index of the first node in this NodeSet relative to its parent node
 * @param {number} count the number of nodes in this NodeSet
 * @export
 * @ojtsignore
 */
oj.CollectionNodeSet = function (parentKey, collection, models, treeDataSource, start, count) {
  this.parentKey = parentKey;
  this.collection = collection;
  this.models = models;
  this.childNodeSet = [];
  this.treeDataSource = treeDataSource; // Can't have start exceeding valid indices

  if (start < models.length) {
    this.start = start;
  } else if (models.length === 0) {
    this.start = 0;
  } else {
    this.start = models.length - 1;
  } // Unknown count: we'll assign it.  Also can't have count exceeding collection size


  this.count = count === -1 ? models.length : Math.min(models.length, count);
};
/**
 * @protected
 */


oj.CollectionNodeSet.prototype.FetchDescendants = function (callbacks) {
  this._fetchDescendants(this).then(function () {
    if (callbacks.success) {
      callbacks.success();
    }
  });
};
/**
 * @private
 */


oj.CollectionNodeSet.prototype._fetchDescendants = function (nodeSet) {
  return new Promise(function (resolve) {
    var count = nodeSet.getCount(); // Walk over each node in this node set, and fetch all the descendants of each

    function nextNode(index) {
      if (index < count) {
        nodeSet.FetchChildNodeSet(index, {
          success: function success(childNodeSet) {
            if (childNodeSet !== null) {
              nodeSet._fetchDescendants(childNodeSet).then(function () {
                nextNode(index + 1);
              });
            } else {
              nextNode(index + 1);
            }
          }
        });
      } else {
        resolve(undefined);
      }
    }

    nextNode(0);
  });
};
/**
 * @protected
 */


oj.CollectionNodeSet.prototype.FetchChildNodeSet = function (index, callbacks) {
  var model = this.models[index];
  var parse = this.treeDataSource.parseMetadata(model);

  if (parse.leaf) {
    // We're at the leaf: don't fetch any more
    this.childNodeSet[index] = null;
    callbacks.success(null);
    return;
  }

  var collection = this.treeDataSource.GetChildCollection(model);
  var parentKey = this.treeDataSource.parseMetadata(model).key;
  var self = this;
  this.treeDataSource.FetchCollection(collection, 0, -1, {
    success: function success(nodeSet) {
      self.childNodeSet[index] = nodeSet;
      callbacks.success(nodeSet);
    }
  }, parentKey);
};
/**
 * @private
 */


oj.CollectionNodeSet.prototype._getCollection = function () {
  return this.collection;
};
/**
* Gets the parent key for this result set.
* @return {any} the parent key for this result set.
* @export
* @memberof oj.CollectionNodeSet
*/


oj.CollectionNodeSet.prototype.getParent = function () {
  return this.parentKey;
};
/**
* Gets the start index of the result set.
* @return {number} the start index of the result set.
* @export
* @memberof oj.CollectionNodeSet
*/


oj.CollectionNodeSet.prototype.getStart = function () {
  return this.start;
};
/**
* Gets the actual count of the result set.
* @return {number} the actual count of the result set.
* @export
* @memberof oj.CollectionNodeSet
*/


oj.CollectionNodeSet.prototype.getCount = function () {
  return this.count;
};
/**
* Gets the data of the specified index.  An error is throw when 1) the range is not yet available and
* 2) the index specified is out of bounds.
* @param {number} index the index of the node/row in which we want to retrieve the data from.
* @return {any} the data for the specified index.  oj.RowData should be returned for data that represents a row
*         with a number of columns.
* @export
* @memberof oj.CollectionNodeSet
*/


oj.CollectionNodeSet.prototype.getData = function (index) {
  this._checkRange(index);

  return this.models[index].attributes;
};
/**
 * @private
 */


oj.CollectionNodeSet.prototype._checkRange = function (index) {
  if (index < this.start || index > this.start + this.count) {
    // Out of range
    throw new Error('Out of range');
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
* @return {{key: *, leaf: boolean, depth: number}} the metadata object for the specific index.
* @export
* @memberof oj.CollectionNodeSet
*/


oj.CollectionNodeSet.prototype.getMetadata = function (index) {
  this._checkRange(index);

  var metadata = {
    leaf: false,
    depth: -1
  };
  var model = this.models[index];
  var parse = this.treeDataSource.parseMetadata(model);
  metadata.key = parse.key;
  metadata.leaf = parse.leaf;
  metadata.depth = parse.depth;
  return metadata;
};
/**
 * Gets the node set child of the specified index.
 * @param {number} index the index of the node/row in which we want to retrieve the child node set
 * @return {oj.CollectionNodeSet|null} the child node set representing the child collection.
 * @export
 * @memberof oj.CollectionNodeSet
 */


oj.CollectionNodeSet.prototype.getChildNodeSet = function (index) {
  if (this.treeDataSource._virtual) {
    return null;
  }

  this._checkRange(index);

  return this.childNodeSet[index];
};



/* global Promise:false, Model:false */

/**
 * @class oj.CollectionTreeDataSource
 * @classdesc TreeDataSource implementation that represents hierachical data available from an {@link oj.Collection} object, such as an external data source.  This data source can be used by [ListView]{@link oj.ojListView},
 *            [NavigationList]{@link oj.ojNavigationList}, and [TreeView]{@link oj.ojTreeView}.<br><br>
 *            See the <a href="../jetCookbook.html?component=treeView&demo=collection">Tree View - Data Source: Collection</a> demo for an example.<br><br>
 *            Refer to {@link oj.TreeDataSource} for other data sources that represent hierarachical data.
 * @param {Object=} options an object containing optional properties.
 * @property {oj.Collection=} options.root an oj.Collection specifying the root level Collection
 * @property {function(oj.Collection,oj.Model):oj.Collection=} options.childCollectionCallback callback to return a child collection given a root and model representing the parent
 * @property {function(oj.Model):{key: *, leaf: boolean, depth: number}=} options.parseMetadata callback to return key, leaf, depth metadata from a given Model
 * @constructor
 * @final
 * @since 1.0
 * @export
 * @extends oj.TreeDataSource
 * @ojtsignore
 */
oj.CollectionTreeDataSource = function (options) {
  // eslint-disable-next-line no-param-reassign
  options = options || {};
  this.rootCollection = options.root;
  this.childCollectionCallback = options.childCollectionCallback;
  this.parseMetadata = options.parseMetadata;
  this.sortkey = null;
  this.sortdir = 'none'; // This is a parent->collection cache

  this.cache = {}; // Once we've seen a virtual collection, set this flag to know

  this._virtual = false;
  oj.CollectionTreeDataSource.superclass.constructor.call(this);
}; // Default implementation

/**
 * @private
 */


oj.CollectionTreeDataSource.prototype.parseMetadata = function (model) {
  return {
    key: model.idAttribute + '=' + model.id
  };
}; // Subclass from oj.TreeDataSource


oj.Object.createSubclass(oj.CollectionTreeDataSource, oj.TreeDataSource, 'oj.CollectionTreeDataSource');
/**
 * Initializes the data source.
 * @memberof oj.CollectionTreeDataSource
 * @return {void}
 * @ojtsignore
 * @export
 */

oj.CollectionTreeDataSource.prototype.Init = function () {
  // super
  oj.CollectionTreeDataSource.superclass.Init.call(this);
};
/**
 * Returns the number of children for a specified parent.  If the value returned is not >= 0 then it is automatically assumed
 * that the child count is unknown.
 * @param {any} parent the parent key.  Specify null if inquiring child count of the root.
 * @return {number} the number of children for the specified parent.
 * @export
 * @memberof oj.CollectionTreeDataSource
 */


oj.CollectionTreeDataSource.prototype.getChildCount = function (parent) {
  var childColl = this.__getParentsChildCollectionFromCache(parent);

  if (childColl) {
    if (childColl.length > 0) {
      return childColl.length;
    }
  }
  /*  this.getChildCollection(parent, {'success': function(coll) {
      return coll.length;
    }});
  */


  return -1;
};
/**
 * Gets a collection representing the specified parent key's children.
 * @param {any} key the parent key in which to create an OJ collection for.
 * @param {Object} callbacks success and error callbacks.  The success callback will provide the child collection as the first argument
 * @property {function(oj.Collection):void} callbacks.success the callback to invoke when child collection is fetched successfully.
 * @property {function({status: *})=} callbacks.error the callback to invoke when the fetch failed.
 * @return {void}
 * @export
 * @memberof oj.CollectionTreeDataSource
 */


oj.CollectionTreeDataSource.prototype.getChildCollection = function (key, callbacks) {
  this.fetchChildren(key, null, {
    success: function success(nodeSet) {
      callbacks.success(nodeSet._getCollection());
    },
    error: callbacks.error
  });
};
/**
 * Fetch the children
 * @param {any} parent the parent key.  Specify null if fetching children from the root.
 * @param {Object} range information about the range, it must contain the following properties: start, count
 * @property {number} range.start the start index of the range in which the children are fetched
 * @property {number} range.count the size of the range in which the children are fetched
 * @param {Object} callbacks the callbacks to be invoke when fetch children operation is completed.  The valid callback
 *        types are "success" and "error".
 * @property {function(oj.CollectionNodeSet):void} callbacks.success the callback to invoke when fetch completed successfully.
 * @property {function({status: *})=} callbacks.error the callback to invoke when fetch children failed.
 * @param {Object=} options optional parameters for this operation.  Currently this is used for future expansion only.
 * @return {void}
 * @export
 * @memberof oj.CollectionTreeDataSource
 */
// eslint-disable-next-line no-unused-vars


oj.CollectionTreeDataSource.prototype.fetchChildren = function (parent, range, callbacks, options) {
  // eslint-disable-next-line no-param-reassign
  range = range || {};
  var start = range.start ? range.start : 0;
  var count = range.count ? range.count : -1;

  if (parent === null) {
    // Do root
    this.FetchCollection(null, start, count, callbacks, null);
    return;
  } // Use child collection callback to set up child collection, then fetch it


  var self = this;

  this._getModelForId(this.rootCollection, start, count, parent, 0).then(function (parentModel) {
    if (parentModel) {
      var collection = self.GetChildCollection(parentModel.model);

      try {
        self.FetchCollection(collection, start, count, callbacks, parent);
      } catch (error) {
        if (callbacks && callbacks.error) {
          callbacks.error({
            status: error.message
          });
        }
      }
    } else if (callbacks && callbacks.error) {
      // Couldn't find a model for the given Id: call the error if present
      callbacks.error(parent);
    }
  });
};
/**
 * Called by common model when a model is added to a collection
 * @private
 */


oj.CollectionTreeDataSource.prototype.ModelAdded = function (model, collection, options) {
  var index = 0;

  if (options && options.at) {
    index = options.at;
  }

  var parents = this._getParentChain(collection);

  var parent = parents != null && parents.length > 0 ? parents[parents.length - 1] : null;

  var event = this._createEvent(this, 'insert', index, parents, this._putModelInNodeSet(parent, model));

  this.handleEvent('change', event);
};
/**
 * Called by common model when a model is removed from a collection
 * @private
 */


oj.CollectionTreeDataSource.prototype.ModelRemoved = function (model, collection, options) {
  var index = 0;

  if (options && options.index) {
    index = options.index;
  }

  this._removeCollectionFromCache(model);

  var event = this._createEvent(this, 'delete', index, this._getParentChain(collection), null);

  this.handleEvent('change', event);
};
/**
 * Called by common model when a model is updated
 * @private
 */
// eslint-disable-next-line no-unused-vars


oj.CollectionTreeDataSource.prototype.ModelUpdated = function (model, options) {
  var collectionForModel = model.collection;
  var index = model.GetIndex();
  var parents = null;

  if (collectionForModel) {
    // If this model's collection is found, get its parent chain from the actual collection
    parents = this._getParentChain(collectionForModel);
  }

  var parent = parents != null && parents.length > 0 ? parents[parents.length - 1] : null;

  var event = this._createEvent(this, 'update', index, parents, this._putModelInNodeSet(parent, model));

  this.handleEvent('change', event);
};
/**
 * Called if a collection is refreshed
 * @protected
 */
// eslint-disable-next-line no-unused-vars


oj.CollectionTreeDataSource.prototype.CollectionRefreshed = function (collection, resp, options) {
  var event = this._createEvent(this, 'refresh', null, this._getParentChain(collection), null);

  this.handleEvent('refresh', event);
};
/**
 * @private
 */


oj.CollectionTreeDataSource.prototype._putModelInNodeSet = function (parent, model) {
  /*    var rows = [];
      rows.push(model.attributes);
      var options = {};
      options['idAttribute'] = model['idAttribute'];
      var rowset = new oj.ArrayRowSet(rows, options);
      rowset.fetch();
      return rowset;*/
  var collection = new Model.Collection();
  collection.add(model);
  return this._getNodeSet(collection, parent, 0, 1, [model]);
};
/**
 * Return an array of parent keys representing the parentage of the given collection.  Relies on cached collection fetches.  Array is from
 * child key of root on down to collection's parent
 * @private
 */


oj.CollectionTreeDataSource.prototype._getParentChain = function (collection) {
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
}; // Generate the cache key


oj.CollectionTreeDataSource.ROOT_CACHE_KEY = '%!@ROOT%#@!';
/**
 * @private
 */

oj.CollectionTreeDataSource.prototype._getCacheKey = function (model) {
  // If model (parent) is null, look for the root
  // If model is not an oj.Model, just use it as the key
  var key = model instanceof Model.Model ? this.parseMetadata(model).key : model; // Handle model === 0 case

  return model != null ? key : oj.CollectionTreeDataSource.ROOT_CACHE_KEY;
};
/**
 * Return a cached collection given a parent Model.  Null if not cached
 * @private
 */


oj.CollectionTreeDataSource.prototype.__getParentsChildCollectionFromCache = function (model) {
  return this.cache[this._getCacheKey(model)];
};
/**
 * Put a collection into the cache whose parent is represented by model
 * @private
 */


oj.CollectionTreeDataSource.prototype._setCollectionInCache = function (model, collection) {
  // Tack on listeners
  collection.on(Model.Events.EventType.ADD, this.ModelAdded, this);
  collection.on(Model.Events.EventType.REMOVE, this.ModelRemoved, this);
  collection.on(Model.Events.EventType.CHANGE, this.ModelUpdated, this);
  collection.on(Model.Events.EventType.SYNC, this.CollectionRefreshed, this);

  var key = this._getCacheKey(model);

  this.cache[key] = collection;
  return this.cache[key];
};
/**
 * Remove any collections with the given model as a parent
 * @private
 */


oj.CollectionTreeDataSource.prototype._removeCollectionFromCache = function (model) {
  var key = this._getCacheKey(model);

  var props = Object.keys(this.cache);

  for (var i = 0; i < props.length; i++) {
    var prop = props[i];

    if (prop === key) {
      // Found it: remove listeners and delete it
      this.cache[key].off(null, null, this);
      delete this.cache[key];
      return;
    }
  }
};
/**
 * Determine if a model representing a given parent key is found in the given collection
 * The expectation is that the model would have to have been locally fetched
 * @private
 */


oj.CollectionTreeDataSource.prototype._keyInCollection = function (key, collection) {
  var count = collection.length;
  var model = null;

  for (var i = 0; i < count; i++) {
    model = collection.models[i];

    if (model) {
      var currKey = this._getCacheKey(model);

      if (key === currKey) {
        return true;
      }
    }
  }

  return false;
};
/**
 * Get the collection containing the given key
 * @private
 */


oj.CollectionTreeDataSource.prototype._getCollectionOfKey = function (key) {
  // Search the cache for the parent key
  var props = Object.keys(this.cache);

  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    var collection = this.cache[prop];

    if (this._keyInCollection(key, collection)) {
      return collection;
    }
  }

  return null;
};
/**
 * Get the parent key for the given collection from the cache, if found
 * @private
 */


oj.CollectionTreeDataSource.prototype._getParentOfCollection = function (collection) {
  // Search the cache for the parent key
  var props = Object.keys(this.cache);

  for (var i = 0; i < props.length; i++) {
    var prop = props[i];

    if (this.cache[prop] === collection) {
      return prop;
    }
  }

  return null;
};
/**
 * Return an object giving the child collection for the given model along with a boolean indicating whether the collection was found
 * in cache.
 * @protected
 */


oj.CollectionTreeDataSource.prototype.GetChildCollection = function (parentModel) {
  // Is it in the cache?
  var cached = true;

  var collection = this.__getParentsChildCollectionFromCache(parentModel);

  if (!collection) {
    // Nothing found at all yet
    cached = false; // Ask the app for the child collection for the given model

    collection = this.childCollectionCallback(this.rootCollection, parentModel);

    if (collection != null) {
      // Make sure we transfer sorting properties...
      this._applySortToCollection(collection); // And put it in the cache


      this._setCollectionInCache(parentModel, collection);
    }
  }

  return {
    collection: collection,
    cached: cached
  };
};
/**
 * @private
 */


oj.CollectionTreeDataSource.prototype._createEvent = function (source, operation, index, parent, data) {
  return {
    source: source,
    operation: operation,
    index: index,
    parent: parent,
    data: data
  };
};
/**
 * Call to fetch models for an already-created collection--used only by fetchDescendants
 * @protected
 */


oj.CollectionTreeDataSource.prototype.FetchCollection = function (collectionObj, start, count, callbacks, parent) {
  var self = this;

  if (collectionObj === null) {
    // Fetch the root
    // Check for the root in the cache
    // eslint-disable-next-line no-param-reassign
    collectionObj = this.__getParentsChildCollectionFromCache(null);

    if (!collectionObj) {
      // Not found, put a representation in there
      // eslint-disable-next-line no-param-reassign
      collectionObj = {
        collection: self.rootCollection,
        cached: false
      };

      self._setCollectionInCache(null, this.rootCollection);
    } else {
      // Root was found precached: set up its information
      // eslint-disable-next-line no-param-reassign
      collectionObj = {
        collection: collectionObj,
        cached: true
      };
    }
  }

  if (collectionObj) {
    self._fetch(collectionObj, start, count, function (coll, models) {
      // Check for virtual
      if (coll.IsVirtual()) {
        self._virtual = true;
      }

      if (callbacks.success) {
        // return a nodeset version of this fetched collection via the callback
        callbacks.success(self._getNodeSet(coll, parent, start, count, models));
      }
    }, callbacks.error);
  }
};
/**
 * Turn collection into a CollectionNodeSet
 * @private
 */


oj.CollectionTreeDataSource.prototype._getNodeSet = function (collection, parent, start, count, models) {
  return new oj.CollectionNodeSet(parent, collection, models, this, start, count);
};
/**
 * Do any of the models in this collection or its children have the given key
 * @private
 */


oj.CollectionTreeDataSource.prototype._scanForKey = function (collection, key) {
  // Search collection for key
  var self = this;
  var models = new Array(collection.length);
  return new Promise(function (resolve) {
    function checkNext(index, _collection, _key) {
      if (index < collection.length) {
        // Get the model at location index
        _collection.at(index, {
          deferred: true
        }).then(function (model) {
          // Store the model
          models[index] = model; // Does the retrieved model match the key when parsed out?  If so return it

          if (model) {
            var parse = self.parseMetadata(model);

            if (_key === parse.key) {
              resolve({
                model: model,
                models: models
              });
              return;
            }
          } // No model or no match: go to the next model in the collection
          // eslint-disable-next-line no-param-reassign


          index += 1;
          checkNext(index, _collection, _key);
        });
      } else {
        // Hit the end: not found
        resolve({
          model: null,
          models: models
        });
      }
    } // Start checking at the 0th model in the collection


    checkNext(0, collection, key);
  });
};
/**
 * Returns a promise with an object giving the model that corresponds to the given key, and the depth in the hierarchy at which it was found
 * @private
 */


oj.CollectionTreeDataSource.prototype._getModelForId = function (collection, start, count, key, depth) {
  var self = this;
  return new Promise(function (resolve) {
    // Does the starting collection contain the key?
    self._scanForKey(collection, key).then(function (obj) {
      // Yes, resolve (return it)
      if (obj.model) {
        resolve({
          model: obj.model,
          depth: depth
        });
        return;
      } // It does not
      // Wrong collection: search each model's child collections, and check recursively
      // Check each model in collection now for key


      function getNextCollection(index, models, tds) {
        if (index < models.length) {
          var childColl; // if the model is declared a leaf in the metadata don't bother checking for children

          if (!self.parseMetadata(models[index]).leaf) {
            // Return an object containing the child collection of the current collection + whether its cached
            childColl = tds.GetChildCollection(models[index]);
          }

          if (!childColl || !childColl.collection) {
            // No child collection found: move on to the next model in the current collection
            // eslint-disable-next-line no-param-reassign
            index += 1;
            getNextCollection(index, models, tds);
          } else {
            // Fetch the child collection if necessary
            // eslint-disable-next-line no-unused-vars
            tds._fetch(childColl, start, count, function (fetchColl, nextModels) {
              // Now check the child collection recursively for the key, moving depth down 1
              tds._getModelForId(fetchColl, start, count, key, depth + 1).then(function (childModel) {
                // Found the model in this collection: unwind
                if (childModel) {
                  // Found somewhere down this tree
                  resolve(childModel);
                } else {
                  // Not found down that tree
                  // Move to the next model
                  // eslint-disable-next-line no-param-reassign
                  index += 1;
                  getNextCollection(index, models, tds);
                }
              });
            }, null);
          }
        } else {
          // Hit the end
          resolve(null);
        }
      }

      function getNextCachedCollection(index, models, tds) {
        if (index < models.length) {
          // do this to avoid calling getChildCollection on unfetched collections.
          var childColl = self.__getParentsChildCollectionFromCache(models[index]);

          if (childColl) {
            tds._fetch({
              collection: childColl,
              cached: true
            }, start, count, // eslint-disable-next-line no-unused-vars
            function (fetchColl, nextModels) {
              tds._getModelForId(fetchColl, start, count, key, depth + 1).then(function (childModel) {
                if (childModel) {
                  resolve(childModel);
                } else {
                  // eslint-disable-next-line no-param-reassign
                  index += 1;
                  getNextCachedCollection(index, models, tds);
                }
              });
            }, null);
          } else {
            // eslint-disable-next-line no-param-reassign
            index += 1;
            getNextCachedCollection(index, models, tds);
          }
        } else {
          // Not in cache so try all collections instead
          getNextCollection(0, obj.models, self);
        }
      } // Start checking the cached collections at the 0th model


      getNextCachedCollection(0, obj.models, self);
    });
  });
};
/**
 * @private
 */


oj.CollectionTreeDataSource.prototype._getModelsFromCollection = function (collection) {
  function loop(_collection, a, b, models) {
    return new Promise(function (allresolve, allreject) {
      var i;

      var doTask = function doTask(index) {
        var promise = new Promise(function (resolve, reject) {
          _collection.at(index).then(function (model) {
            // eslint-disable-next-line no-param-reassign
            models[index] = model;
            resolve(index + 1);
          }, reject);
        });
        return promise;
      };

      var currentStep = Promise.resolve(0);

      for (i = a; i < b; i++) {
        currentStep = currentStep.then(doTask);
      }

      return currentStep.then(allresolve, allreject);
    });
  }

  if (collection.IsVirtual()) {
    var models = new Array(collection.length);
    return new Promise(function (resolve) {
      loop(collection, 0, collection.length, models).then(function () {
        resolve(models);
      });
    });
  }

  return new Promise(function (resolve) {
    resolve(collection.models);
  });
};
/**
 * Do a fetch or just return the collection if it came from cache
 * @private
 */


oj.CollectionTreeDataSource.prototype._fetch = function (collectionCacheObj, start, count, _success, error) {
  var self = this;
  var cached = collectionCacheObj.cached;

  if (cached) {
    // If it's cached, it's fetched
    this._getModelsFromCollection(collectionCacheObj.collection).then(function (models) {
      _success(collectionCacheObj.collection, models);
    });
  } else {
    // apply sorting if necessary
    if (this.sortkey && this.sortkey !== 'none') {
      // eslint-disable-next-line no-param-reassign
      collectionCacheObj.collection.comparator = this.sortkey; // eslint-disable-next-line no-param-reassign

      collectionCacheObj.collection.sortDirection = this.sortdir;
    }

    if (collectionCacheObj.collection.length > 0 || !collectionCacheObj.collection.IsUrlBased(null)) {
      // Already fetched: just return
      _success(collectionCacheObj.collection, collectionCacheObj.collection.models);

      return;
    } // Do a real fetch from the collection's url


    if (count === -1) {
      // Don't want any records thrown out if virtual--rely on the fetched models to be there once cached
      // eslint-disable-next-line no-param-reassign
      collectionCacheObj.collection.modelLimit = -1;
      collectionCacheObj.collection.fetch({
        success: function success(fetchColl) {
          // Tack on handlers
          self._getModelsFromCollection(fetchColl).then(function (models) {
            _success(fetchColl, models);
          });
        },
        error: error
      });
    } else {
      // Ensure a range if we have one
      // Don't want any records thrown out if virtual--rely on the fetched models to be there once cached
      // eslint-disable-next-line no-param-reassign
      collectionCacheObj.collection.modelLimit = -1;
      collectionCacheObj.collection.setRangeLocal(start, count).then(function (results) {
        // eslint-disable-next-line no-param-reassign
        collectionCacheObj.models = results.models;

        _success(collectionCacheObj.collection, results.models);
      });
    }
  }
};
/**
 * Fetch all children and their children recursively from a specified parent.
 * @param {any} parent the parent key.  Specify null to fetch everything from the root (i.e. expand all)
 * @param {Object} callbacks the callbacks to be invoke when fetch children operation is completed.  The valid callback types are "success" and "error".
 * @property {function(oj.CollectionNodeSet):void} callbacks.success the callback to invoke when fetch completed successfully.
 * @property {function({status: *})=} callbacks.error the callback to invoke when fetch children failed.
 * @param {Object=} options optional parameters for this operation
 * @property {number=} options.start the index related to parent in which to begin fetching descendants from.  If this is not specified, then value zero will be used
 * @property {number=} options.maxCount the maximum number of children to fetch.  If a non-positive number is specified, then the value is ignored and
 *        there is no maximum fetch count
 * @return {void}
 * @export
 * @memberof oj.CollectionTreeDataSource
 */
// eslint-disable-next-line no-unused-vars


oj.CollectionTreeDataSource.prototype.fetchDescendants = function (parent, callbacks, options) {
  // No fetchDescendants for virtual
  if (this._virtual) {
    oj.Assert.failedInAbstractFunction();
  }

  var self = this;

  if (parent === null) {
    // Do root
    this.FetchCollection(null, 0, -1, {
      success: function success(nodeSet) {
        nodeSet.FetchDescendants({
          success: function success() {
            if (callbacks.success) {
              callbacks.success(nodeSet);
            }
          }
        });
      }
    }, null);
    return;
  } // Use child collection callback to set up child collection, then fetch it


  this._getModelForId(this.rootCollection, 0, -1, parent, 0).then(function (parentModel) {
    if (parentModel) {
      var collection = self.GetChildCollection(parentModel.model);
      self.FetchCollection(collection, 0, -1, {
        success: function success(nodeSet) {
          nodeSet.FetchDescendants({
            success: function success() {
              if (callbacks.success) {
                callbacks.success(nodeSet);
              }
            }
          });
        }
      }, parent);
    }
  });
};
/**
 * Performs a sort operation on the tree data.
 * @param {Object} criteria the sort criteria.  It must contain the following properties: key, direction
 * @param {any} criteria.key the key identifying the attribute (column) to sort on
 * @param {'ascending'|'descending'|'none'} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @param {Object} callbacks callbacks for the sort operation
 * @property {function():void} callbacks.success the callback to invoke when the sort completed successfully
 * @property {function({status: *})=} callbacks.error the callback to invoke when sort failed.
 * @return {void}
 * @export
 * @memberof oj.CollectionTreeDataSource
 */


oj.CollectionTreeDataSource.prototype.sort = function (criteria, callbacks) {
  var key = criteria.key;
  var dir = criteria.direction;
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
    if (this.sortdir === 'none') {
      this.cache = {};
    } // Go off and sort each collection, as long as it has "criteria" as one of its attributes


    var props = Object.keys(this.cache);

    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      var collection = this.cache[prop];

      this._applySortToCollection(collection);
    }
  }

  if (callbacks && callbacks.success) {
    callbacks.success();
  }
};
/**
 * @private
 */


oj.CollectionTreeDataSource.prototype._applySortToCollection = function (collection) {
  // eslint-disable-next-line no-param-reassign
  collection.comparator = this.sortkey; // eslint-disable-next-line no-param-reassign

  collection.sortDirection = this.sortdir === 'ascending' ? 1 : -1;
  collection.sort();
};
/**
 * Returns the current sort criteria of the tree data.
 * @return {{Object}} the current sort criteria.  It should contain the following properties: key, direction where
 *         criteria.key the key identifying the attribute (column) to sort on.  Value is null if it's not sorted.
 *         criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @ojsignature {target: "Type",
 *               value: "{key: any, direction: 'ascending'|'descending'|'none'}",
 *               for: "returns"}
 * @export
 * @memberof oj.CollectionTreeDataSource
 */


oj.CollectionTreeDataSource.prototype.getSortCriteria = function () {
  return {
    key: this.sortkey,
    direction: this.sortdir
  };
};
/**
 * Moves a row from one location to another (different position within the same parent or a completely different parent)
 * @param {any} rowToMove the key of the row to move
 * @param {any} referenceRow the key of the reference row which combined with position are used to determine
 *        the destination of where the row should moved to.
 * @param {number|string} position The position of the moved row relative to the reference row.
 *        This can be a string: "before", "after", "inside", "first", "last", or the zero based index to position
 *        the element at a specific point among the reference row's current children.
 * @param {Object} callbacks the callbacks for the move function
 * @param {function():void} callbacks.success the callback to invoke when the move completed successfully.
 * @param {function({status: *})=} callbacks.error the callback to invoke when move failed.
 * @return {void}
 * @export
 * @memberof oj.CollectionTreeDataSource
 */


oj.CollectionTreeDataSource.prototype.move = function ( // eslint-disable-next-line no-unused-vars
rowToMove, referenceRow, position, callbacks) {
  oj.Assert.failedInAbstractFunction();
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
 * @memberof oj.CollectionTreeDataSource
 */
// eslint-disable-next-line no-unused-vars


oj.CollectionTreeDataSource.prototype.moveOK = function (rowToMove, referenceRow, position) {
  return 'invalid';
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
 * @memberof oj.CollectionTreeDataSource
 */


oj.CollectionTreeDataSource.prototype.getCapability = function (feature) {
  if (feature === 'sort') {
    return 'default';
  }

  if (feature === 'move') {
    return 'none';
  }

  if (feature === 'batchFetch') {
    return 'disable';
  }

  if (feature === 'fetchDescendants') {
    return 'disable';
  }

  return null;
};

  return oj.CollectionTreeDataSource;
});