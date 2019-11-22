/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(["./impl/pouchDBPersistenceStore"],
       function(PouchDBPersistenceStore) {
  'use strict';

  /**
   * @export
   * @class ConfigurablePouchDBStoreFactory
   * @classdesc PersistenceStoreFactory that creates PouchDB backed 
   *            PersisteneStore instance based on specified configurations,
   *            for example, the adapter to be used for the PouchDB.
   * @param {object} [options] The optional options to be applied to every PouchDBPersistenceStore
   *                           instances created by this factory.
   * @param {object} [options.adapter] The adapter to be used for the underlying
   *                                   PouchDB. Application uses this option needs
   *                                   to make sure all necessary plugins and adapter
   *                                   are installed.
   * @param {string} options.adapter.name The name of the adapter to be used for the underlying
   *                                   PouchDB.
   * @param {object} [options.adapter.plugin] The plugin associated with the adapter to be used 
   *                                  by the underlying PouchDB.
   */
  var ConfigurablePouchDBStoreFactory = function (options) {
    this._options = options;
  }

  /**
   * @method
   * @name createPersistenceStore
   * @memberof! ConfigurablePouchDBStoreFactory
   * @export
   * @instance
   * @param {string} name The name to be associated with the store.
   * @param {object} [options] The configratuion options to be applied to the store.
   * @param {string} [options.version] The version of the store.
   * @return {Promise<PouchDBPersistenceStore>} returns a Promise that is resolved to a PouchDB backed
   * PersistenceStore instance with specified configurations.
   */
  ConfigurablePouchDBStoreFactory.prototype.createPersistenceStore = function (name, options) {
    var store = new PouchDBPersistenceStore(name);
    var storeOptions = this._options;
    if (options) {
      if (!storeOptions) {
        storeOptions = options;
      } else {
        var mergedOptions = {};
        for (var key in storeOptions) {
          if (Object.prototype.hasOwnProperty.call(storeOptions, key)) {
            mergedOptions[key] = storeOptions[key];
          }
        }
        for (var key in options) {
          if (Object.prototype.hasOwnProperty.call(options, key)) {
            mergedOptions[key] = options[key];
          }
        }
        storeOptions = mergedOptions;
      }
    }
    return store.Init(storeOptions).then(function () {
      return Promise.resolve(store);
    });
  }  

  return ConfigurablePouchDBStoreFactory;
});
