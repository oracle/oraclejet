/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(["./impl/localPersistenceStore"], function (LocalPersistenceStore) {
  'use strict';
  
  /**
   * @export
   * @class LocalPersistenceStoreFactory
   * @classdesc PersistenceStoreFactory that creates localStorage backed 
   *            PersisteneStore instance.
   * @hideconstructor
   */

  var LocalPersistenceStoreFactory = (function () {

    /**
     * @method
     * @name createPersistenceStore
     * @memberof! LocalPersistenceStoreFactory
     * @export
     * @instance
     * @param {string} name The name to be associated with the store.
     * @param {object} [options] The configratuion options to be applied to the store.
     * @param {string} [options.version] The version of the store.
     * @return {Promise<LocalPersistenceStore>} returns a Promise that is resolved to a localStorage
     * backed PersistenceStore instance.
     */

    function _createPersistenceStore (name, options) {
      var store = new LocalPersistenceStore(name);
      return store.Init(options).then(function () {
        return store;
      });
    };

    return {
      'createPersistenceStore': function (name, options) {
        return _createPersistenceStore(name, options);
      }
    };
  }());

  return LocalPersistenceStoreFactory;
});