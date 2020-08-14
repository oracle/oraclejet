/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['./impl/logger', './impl/PersistenceStoreMetadata', './pouchDBPersistenceStoreFactory'], function (logger, PersistenceStoreMetadata, pouchDBPersistenceStoreFactory) {
  'use strict';

  /**
   * @export
   * @class PersistenceStoreManager
   * @classdesc PersistenceStoreManager used for offline support
   */

  var PersistenceStoreManager = function () {
    Object.defineProperty(this, '_stores', {
      value: {},
      writable: true
    });
    Object.defineProperty(this, '_factories', {
      value: {},
      writable: true
    });
    Object.defineProperty(this, '_DEFAULT_STORE_FACTORY_NAME', {
      value: '_defaultFactory',
      writable: false
    });
    Object.defineProperty(this, '_METADATA_STORE_NAME', {
      value: 'systemCache-metadataStore',
      writable: false
    });
    // some pattern of store name (e.g. http://) will cause issues
    // for the underlying storage system. We'll rename the store
    // name to avoid such issue. This is to store the original store
    // name to the system replaced name.
    Object.defineProperty(this, '_storeNameMapping', {
      value: {},
      writable: true
    });
  }

  /**
   * Register a PersistenceStoreFactory to create PersistenceStore for the
   * specified name. Only one factory is allowed to be registered per name.
   * @method
   * @name registerStoreFactory
   * @memberof PersistenceStorageManager
   * @instance
   * @param {string} name Name of the store the factory is registered under.
   *                      Must not be null / undefined.
   * @param {Object} factory The factory instance used to create
   *                         PersistenceStore. Must not be null / undefined.
   */
  PersistenceStoreManager.prototype.registerStoreFactory = function (name, factory) {
    if (!factory) {
      throw TypeError("A valid factory must be provided.");
    }

    if (!name) {
      throw TypeError("A valid name must be provided.");
    }

    var storeName = this._mapStoreName(name);
    var oldFactory = this._factories[storeName];
    if (oldFactory && oldFactory !== factory) {
      throw TypeError("A factory with the same name has already been registered.");
    }
    this._factories[storeName] = factory;
  };

  /**
   * Register the default PersistenceStoreFactory to create PersistenceStore
   * for stores that don't have any factory registered under.
   * @method
   * @instance
   * @name registerDefaultStoreFactory
   * @memberof PersistenceStoreManager
   * @param {Object} factory The factory instance used to create
   *                         PersistenceStore
   */
  PersistenceStoreManager.prototype.registerDefaultStoreFactory = function (factory) {
    this.registerStoreFactory(this._DEFAULT_STORE_FACTORY_NAME, factory);
  };

  /**
   * Get hold of a store for a collection of records of the same type.
   * Returns a promise that resolves to an instance of PersistenceStore
   * that's ready to be used.
   * @method
   * @name openStore
   * @memberof PersistenceStoreManager
   * @instance
   * @param {string} name Name of the store.
   * @param {{index: Array, version: string}|null} options Optional options to
   *                                               tune the store
   * <ul>
   * <li>options.index array of fields to create index for</li>
   * <li>options.version The version of this store to open, default to be '0'. </li>
   * </ul>
   * @return {Promise<PersistenceStore>} Returns an instance of a PersistenceStore.
   */
  PersistenceStoreManager.prototype.openStore = function (name, options) {
    logger.log("Offline Persistence Toolkit PersistenceStoreManager: openStore() for name: " + name);
    var storeName = this._mapStoreName(name);
    var allVersions = this._stores[storeName];
    var version = (options && options.version) || '0';

    if (allVersions && allVersions[version]) {
      return Promise.resolve(allVersions[version]);
    }

    var factory = this._factories[storeName];
    if (!factory) {
      factory = this._factories[this._DEFAULT_STORE_FACTORY_NAME];
    }
    if (!factory) {
      return Promise.reject(new Error("no factory is registered to create the store."));
    }

    var self = this;
    logger.log("Offline Persistence Toolkit PersistenceStoreManager: Calling createPersistenceStore on factory");
    return factory.createPersistenceStore(storeName, options).then(function (store) {
      allVersions = allVersions || {};
      allVersions[version] = store;
      self._stores[storeName] = allVersions;
      if (options && options.skipMetadata) {
        return store;
      } else {
        return self._updateStoreMetadata(storeName, version).then(function() {
          return store;
        }).catch(function(error) {
          logger.log("updating store metadata for store " + storeName + " failed");
          return store;
        });
      }
    });
  };

  PersistenceStoreManager.prototype._updateStoreMetadata = function (storeName, version) {
    var self = this;
    return self._getStoresMetadata(storeName).then(function(storeMetadata) {
      var dbEntry = null;
      if (!storeMetadata) {
        // no metadata for this store yet, need to add an entry.
        dbEntry = [version];
      } else if (storeMetadata.versions.indexOf(version) < 0) {
        // no version for this .
        storeMetadata.versions.push(version);
        dbEntry = storeMetadata.versions;
      }
      if (dbEntry) {
        // now need to update metadata from database.
        var encodedStoreName = self._encodeString(storeName);
        return self._metadataStore.upsert(encodedStoreName, {}, dbEntry);
      }
    });
  };

  /**
   * Check whether a specific version of a specific store exists or not.
   * @method
   * @name hasStore
   * @memberof PersistenceStoreManager
   * @instance
   * @param {string} name The name of the store to check for existence
   * @param {{version: string}|null} options Optional options when perform the
   *                                 check.
   * <ul>
   * <li>options.version The version of this store to check. If not specified,
   *                     any version of the store counts.</li>
   * </ul>
   * @return {boolean} Returns true if the store with the name exists of the
   *                   specific version, false otherwise.
   */
  PersistenceStoreManager.prototype.hasStore = function (name, options) {
    var storeName = this._mapStoreName(name);
    var allVersions = this._stores[storeName];
    if (!allVersions || Object.keys(allVersions).length === 0) {
      return false;
    } else if (!options || !options.version) {
      return true;
    } else {
      return (allVersions[options.version] ? true : false);
    }
  };

  /**
   * Delete the specific store, including all the content stored in the store.
   * @method
   * @name deleteStore
   * @memberof PersistenceStoreManager
   * @instance
   * @param {string} name The name of the store to delete
   * @param {{version: string}|null} options Optional options when perform the
   *                                 delete.
   * <ul>
   * <li>options.version The version of this store to delete. If not specified,
   *                     all versions of the store will be deleted.</li>
   * </ul>
   * @return {Promise<Boolean>} Returns a Promise which resolves to true if the store is
   *                   actually deleted, and false otherwise.
   */
  PersistenceStoreManager.prototype.deleteStore = function (name, options) {
    logger.log("Offline Persistence Toolkit PersistenceStoreManager: deleteStore() for name: " + name);
    var self = this;
    var storeName = this._mapStoreName(name);
    return self._getStoresMetadata(storeName).then(function(storeMetadata) {
      if (!storeMetadata) {
        // no metadata for this store, could be that no store instances have
        // ever been created, or skipMetadata was true when the store is created;
        var storesToDelete = [];
        if (options && options.version) {
          if (self._stores[storeName] && self._stores[storeName][options.version]) {
            storesToDelete.push(self._stores[storeName][options.version]);
            delete self._stores[storeName][options.version];
          }
        } else if (self._stores[storeName]) {
          storesToDelete = Object.values(self._stores[storeName]);
          self._stores[storeName] = {};
        }
        if (storesToDelete.length) {
          var promises = storesToDelete.map(function(store) {
            return store.delete();
          })
          return Promise.all(promises).then(function() {
            return true;
          }).catch(function(err) {
            logger.log("failed deleting store " + name);
            return false;
          });
        } else {
          return false;
        }
      } else {
        var versionsToDelete = [];
        var remainingVersions = [];
        var allVersions = storeMetadata.versions;
        if (options && options.version) {
          var index = allVersions.indexOf(options.version);
          if (index < 0) {
            // no such version exists.
            remainingVersions = allVersions;
          } else {
            // only remove the asked version.
            allVersions.splice(index, 1);
            remainingVersions = allVersions;
            versionsToDelete.push(options.version);
          }
        } else {
          // remove all the versions.
          versionsToDelete = allVersions;
        }
        if (versionsToDelete.length) {
          var promises = versionsToDelete.map(function(version) {
            var self = this;
            return self.openStore(storeName, {version: version, skipMetadata: true}).then(function(store) {
              delete self._stores[storeName][version];
              return store.delete();
            });
          }, self);
          return Promise.all(promises).then(function() {
            // update metadata store.
            var encodedStoreName = self._encodeString(storeName);
            if (remainingVersions.length) {
              return self._metadataStore.upsert(encodedStoreName, {}, remainingVersions);
            } else {
              return self._metadataStore.removeByKey(encodedStoreName);
            }
          }).then(function() {
            return true;
          }).catch(function(error) {
            logger.log("failed deleting store " + storeName);
            return false;
          });
        } else {
          return false;
        }
      }
    });
  };

  /**
   * Returns a promise that resolves to a Map of store name and store metadata.
   * @method
   * @name getStoresMetadata
   * @memberof PersistenceStoreManager
   * @instance
   * @return {Promise<Map<String, PersistenceStoreMetadata>>} Returns a Map of store name and store metadata.
   */
  PersistenceStoreManager.prototype.getStoresMetadata = function() {
    var self = this;
    var storesMetadataMap = new Map();
    return this._getMetadataStore().then(function(store) {
      return store.find({fields: ['key', 'value']});
    }).then(function(entries) {
      if (entries && entries.length > 0) {
        entries.forEach(function(entry) {
          var storeName = self._decodeString(entry.key);
          var factory = self._factories[storeName];
          if (!factory) {
            factory = self._factories[self._DEFAULT_STORE_FACTORY_NAME];
          }
          storesMetadataMap.set(storeName, new PersistenceStoreMetadata(storeName, factory, entry.value));
        });
      }
      return storesMetadataMap;
    }).catch(function(err) {
      logger.log("error occured getting store metadata.");
      return storesMetadataMap;
    });
  };

  // get the store information for this store.
  PersistenceStoreManager.prototype._getStoresMetadata = function(storeName) {
    var self = this;
    return self._getMetadataStore().then(function(store) {
      var encodedStoreName = self._encodeString(storeName);
      return store.findByKey(encodedStoreName);
    }).then(function(entry) {
      if (entry) {
        var factory = self._factories[storeName];
        if (!factory) {
          factory = self._factories[self._DEFAULT_STORE_FACTORY_NAME];
        }
        return new PersistenceStoreMetadata(storeName, factory, entry);
      } else {
        return null;
      }
    }).catch(function(error) {
      logger.log("error getting store metadata for store " + storeName);
      return null;
    });
  };

  PersistenceStoreManager.prototype._mapStoreName = function (name, options) {
    var mappedName = this._storeNameMapping[name];
    if (mappedName) {
      return mappedName;
    } else {
      // remove '://' from the string.
      mappedName = name.replace(/(.*):\/\/(.*)/gi, '$1$2');
      this._storeNameMapping[name] = mappedName;
      return mappedName;
    }
  };

  PersistenceStoreManager.prototype._getMetadataStore = function () {
    var self = this;
    if (!self._metadataStore) {
      // check if there is a default store factory
      var factory = this._factories[this._DEFAULT_STORE_FACTORY_NAME];
      if (!factory) {
        // if not, register the pouchdb store
        this._factories[self._METADATA_STORE_NAME] = pouchDBPersistenceStoreFactory;
      }
      return this.openStore(self._METADATA_STORE_NAME, {skipMetadata: true}).then(function (store) {
        self._metadataStore = store;
        return self._metadataStore;
      });
    }
    return Promise.resolve(self._metadataStore);
  }

  PersistenceStoreManager.prototype._encodeString = function(value) {
	  var i, arr = [];
	  for (var i = 0; i < value.length; i++) {
		  var hex = Number(value.charCodeAt(i)).toString(16);
		  arr.push(hex);
	  }
	  return arr.join('');
  }

  PersistenceStoreManager.prototype._decodeString = function (value) {
	  var hex  = value.toString();
    var str = '';
    var i;
	  for (i = 0; i < hex.length; i += 2) {
		  str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	  }
	  return str;
  }

  return new PersistenceStoreManager();
});
