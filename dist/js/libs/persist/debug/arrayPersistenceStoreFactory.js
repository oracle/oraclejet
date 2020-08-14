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
   *            PersistenceStore instance.
   * @hideconstructor
   */

  var ArrayPersistenceStoreFactory = (function () {

    /**
     * @method
     * @name createPersistenceStore
     * @memberof! ArrayPersistenceStoreFactory
     * @export
     * @instance
     * @param {string} name The name to be associated with the store.
     * @param {object} [options] The configratuion options to be applied to the store.
     * @param {string} [options.version] The version of the store.
     * @return {Promise<ArrayPersistenceStore>} returns a Promise that is resolved to an array
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
