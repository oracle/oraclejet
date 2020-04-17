/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(["./impl/pouchDBPersistenceStore"],
       function(PouchDBPersistenceStore) {
  'use strict';

  /**
   * @export
   * @class PouchDBPersistenceStoreFactory
   * @classdesc PersistenceStoreFactory that creates PouchDB backed 
   *            PersisteneStore instance.
   * @hideconstructor
   */
  var PouchDBPersistenceStoreFactory = (function () {

    /**
     * @method
     * @name createPersistenceStore
     * @memberof! PouchDBPersistenceStoreFactory
     * @export
     * @instance
     * @param {string} name The name to be associated with the store.
     * @param {object} [options] The configratuion options to be applied to the store.
     * @param {string} [options.version] The version of the store.
     * @return {Promise<PouchDBPersistenceStore>} returns a Promise that is resolved to a PouchDB backed
     * PersistenceStore instance.
     */
     
    function _createPersistenceStore (name, options) {
      var store = new PouchDBPersistenceStore(name);
      return store.Init(options).then(function () {
        return store;
      });
    };

    return {
      'createPersistenceStore' : function (name, options) {
        return _createPersistenceStore(name, options);
      }
    };
  }());

  return PouchDBPersistenceStoreFactory;
});