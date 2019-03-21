/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(["./impl/arrayPersistenceStore"], function (ArrayPersistenceStore) {
  'use strict';
  
  /**
   * @export
   * @class ArrayPersistenceStoreFactory
   * @classdesc PersistenceStoreFactory that creates an in-memory array backed 
   *            PersisteneStore instance.
   */

  var ArrayPersistenceStoreFactory = (function () {

    /**
     * @method
     * @name createPersistenceStore
     * @memberof! ArrayPersistenceStoreFactory
     * @export
     * @instance
     * @return {Promise} returns a Promise that is resolved to an array
     * backed PersistenceStore instance.
     */

    function _createPersistenceStore (name, options) {
      var store = new ArrayPersistenceStore(name);
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

  return ArrayPersistenceStoreFactory;
});