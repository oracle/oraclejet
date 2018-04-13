/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['./impl/logger'], function (logger) {
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
  }
  
  /**
   * Register a PersistenceStoreFactory to create PersistenceStore for the
   * specified name. Only one factory is allowed to be registered per name.
   * @method
   * @name registerStoreFactory
   * @memberof! PersistenceStorageManager
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

    var oldFactory = this._factories[name];
    if (oldFactory && oldFactory !== factory) {
      throw TypeError("A factory with the same name has already been registered.");
    }
    this._factories[name] = factory;
  };

  /**
   * Register the default PersistenceStoreFactory to create PersistenceStore
   * for stores that don't have any factory registered under.
   * @method
   * @instance
   * @name registerDefaultStoreFactory
   * @memberof! PersistenceStoreManager
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
   * @memberof! PersistenceStoreManager
   * @instance
   * @param {string} name Name of the store.
   * @param {{index: Array, version: string}|null} options Optional options to
   *                                               tune the store
   * <ul>
   * <li>options.index array of fields to create index for</li>
   * <li>options.version The version of this store to open, default to be '0'. </li>
   * </ul>
   * @return {Promise} Returns an instance of a PersistenceStore.
   */
  PersistenceStoreManager.prototype.openStore = function (name, options) {
    logger.log("Offline Persistence Toolkit PersistenceStoreManager: openStore() for name: " + name);
    var allVersions = this._stores[name];
    var version = (options && options.version) || '0';

    if (allVersions && allVersions[version]) {
      return Promise.resolve(allVersions[version]);
    }

    var factory = this._factories[name];
    if (!factory) {
      factory = this._factories[this._DEFAULT_STORE_FACTORY_NAME];
    }
    if (!factory) {
      return Promise.reject(new Error("no factory is registered to create the store."));
    }

    var self = this;
    logger.log("Offline Persistence Toolkit PersistenceStoreManager: Calling createPersistenceStore on factory");
    return factory.createPersistenceStore(name, options).then(function (store) {
      allVersions = allVersions || {};
      allVersions[version] = store;
      self._stores[name] = allVersions;
      return store;
    });
  };

  /**
   * Check whether a specific version of a specific store exists or not.
   * @method
   * @name hasStore
   * @memberof! PersistenceStoreManager
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
    var allVersions = this._stores[name];
    if (!allVersions) {
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
   * @memberof! PersistenceStoreManager
   * @instance
   * @param {string} name The name of the store to delete
   * @param {{version: string}|null} options Optional options when perform the
   *                                 delete. 
   * <ul>
   * <li>options.version The version of this store to delete. If not specified,
   *                     all versions of the store will be deleted.</li>
   * </ul>  
   * @return {Promise} Returns a Promise which resolves to true if the store is
   *                   actually deleted, and false otherwise.
   */
  PersistenceStoreManager.prototype.deleteStore = function (name, options) {
    logger.log("Offline Persistence Toolkit PersistenceStoreManager: deleteStore() for name: " + name);
    var allversions = this._stores[name];
    if (!allversions) {
      return Promise.resolve(false);
    } else {
      var version = options && options.version;
      if (version) {
        var store = allversions[version];
        if (!store) {
          return Promise.resolve(false);
        } else {
          logger.log("Offline Persistence Toolkit PersistenceStoreManager: Calling delete on store");
          return store.delete().then(function () {
            delete allversions[version];
            return true;
          });
        }
      } else {
        var mapcallback = function (origObject) {
          return function (version) {
            var value = origObject[version];
            return value.delete();
          };
        };
        var promises = Object.keys(allversions).map(mapcallback(allversions), this);
        var self = this;
        return Promise.all(promises).then(function () {
          delete self._stores[name];
          return true;
        });
      }
    }
  };

  return new PersistenceStoreManager();
});