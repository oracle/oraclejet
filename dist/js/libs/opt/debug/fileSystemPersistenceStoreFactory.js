/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(["./impl/fileSystemPersistenceStore"], function (FileSystemPersistenceStore) {
  'use strict';
  
  /**
   * @export
   * @class FileSystemPersistenceStoreFactory
   * @classdesc PersistenceStoreFactory that creates filesystem backed 
   *            PersistenceStore instance. Requires the device to have the
   *            cordova-file-plugin installed. Each PersistenceStore will be
   *            saved as a directory and each entry in that store will be a file
   *            in the directory. Please configure the location where the directories
   *            will be stored in the cordova-file-plugin.
   */
  var FileSystemPersistenceStoreFactory = (function () {

    /**
     * @method
     * @name createPersistenceStore
     * @memberof! FileSystemPersistenceStoreFactory
     * @export
     * @instance
     * @return {Promise} returns a Promise that is resolved to a filesystem
     * backed PersistenceStore instance.
     */
    
    function _createPersistenceStore (name, options) {
      var store = new FileSystemPersistenceStore(name);
      return store.Init(options).then(function() {
        return store;
      });
    };

    return {
      'createPersistenceStore': function (name, options) {
        return _createPersistenceStore(name, options);
      }
    };
  }());

  return FileSystemPersistenceStoreFactory;
});
