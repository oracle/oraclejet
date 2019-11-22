/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define([], function () {
  'use strict';
  
  /**
   * @export
   * @class PersistenceStoreMetadata
   * @classdesc Class that contains the metadata for a Persistence Store. This is returned by the PersistenceStoreManager.
   * @hideconstructor
   */
  var PersistenceStoreMetadata = function (name, persistenceStoreFactory, versions) {
    this.name = name;
    this.persistenceStoreFactory = persistenceStoreFactory;
    this.versions = versions;
  };

  PersistenceStoreMetadata.prototype = {};

  /**
   * @export
   * @desc The name of the PersistenceStore
   * @memberof PersistenceStoreMetadata
   * @type {string}
   */
  PersistenceStoreMetadata.prototype.name;
  
  /**
   * @export
   * @desc Instance of the PersistenceStoreFactory used to create the PersistenceStore
   * @memberof PersistenceStoreMetadata
   * @type {PersistenceStoreFactory}
   */
  PersistenceStoreMetadata.prototype.persistenceStoreFactory;

  /**
   * @export
   * @desc An array of versions of the PersistenceStore
   * @memberof PersistenceStoreMetadata
   * @type {array}
   */
  PersistenceStoreMetadata.prototype.versions;

  return PersistenceStoreMetadata;
});
