/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define([], function () {
  'use strict';
  
  /**
   * @export
   * @class PersistenceStoreFactory
   * @classdesc Contract for a PersistenceStoreFactory that provides a factory
   * method to create a PersisteneStore instance with the name and options. The
   * options is the same as the one used in
   * {@link persistenceStoreManager.openStore}. A default factory is provided
   * that implements this contract. Customers can register custom store factory
   * for creating persistence stores of their choice. 
   * @hideconstructor
   */

  var PersistenceStoreFactory = {
    
    /**
     * @method
     * @name createPersistenceStore
     * @memberof! PersistenceStoreFactory
     * @export
     * @instance
     * @param {string} name The name to be associated with the store.
     * @param {object} [options] The configratuion options to be applied to the store.
     * @param {string} [options.version] The version of the store.
     * @return {Promise<PersistenceStore>} returns a Promise that is resolved to a PersistenceStore
     *                   instance.
     */
    createPersistenceStore: function (name, options) {}
  };

  return PersistenceStoreFactory;
});