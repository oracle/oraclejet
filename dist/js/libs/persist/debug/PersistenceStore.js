/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define([], function () {
  'use strict';
  
  /**
   * @export
   * @class PersistenceStore
   * @classdesc Abstract class that all Persistence Store implmenetation extends
   *            from. Defines the basic operations every persistence store should
   *            support.
   * @hideconstructor
   */
  var PersistenceStore = function (name) {
    this._name = name;
  };

  PersistenceStore.prototype = {};

  /**
   * Retrieves the name of the store.
   * @method
   * @name getName
   * @memberof! PersistenceStore
   * @instance
   * @return {string} Returns the name of this store.
   */
  PersistenceStore.prototype.getName = function () {
    return this._name;
  };

  /**
   * Retrieves the version of the store.
   * @method
   * @name getVersion
   * @memberof! PersistenceStore
   * @instance
   * @return {string} Returns the version of this store.
   */
  PersistenceStore.prototype.getVersion = function () {
    return this._version;
  };

  /**
   * Initializes the store.
   * @method
   * @name Init
   * @memberof! PersistenceStore
   * @instance
   * @param {{index: Array, version: string}} options Optional options to tune the store. 
   * <ul>
   * <li>options.index   array of fields to create index for</li>
   * <li>options.version The version of the store.</li>
   * </ul>
   * @return {Promise} Returns a Promise when resolved the store is ready to be used.
   */
  PersistenceStore.prototype.Init = function (options) {
    if (options && options.version) {
      this._version = options.version;
    } else {
      this._version = '0';
    }
    return Promise.resolve();
  };

  /**
   * Insert a resource if it does not already exist, update otherwise.
   * @method
   * @name upsert
   * @memberof! PersistenceStore
   * @instance
   * @param {string} key The unique key used to identify this resource
   * @param {Object} metadata The metadata portion of this resource
   * @param {Object} value The value portion of this resource
   * @param {string} expectedVersionIdentifier Optional, the new version 
   *                                           identifier value of this resource.
   * @return {Promise} Returns a Promise that for insert, resolves to undefined,
   *                   while for update, resolves to the old value of the resource
   *                   associated with the key.
   */
  PersistenceStore.prototype.upsert = function (key, metadata, value, expectedVersionIdentifier) {
    throw TypeError("failed in abstract function");
  };

  /**
   * Bulk operation of upsert.
   * @method
   * @name upsertAll
   * @memberof! PersistenceStore
   * @instance
   * @param {Array} values An array of document to be bulk operated. Each item in the
   *                       array is of {key, metadata, value, expectedVersionIdentifier} format.
   * @return {Promise} Returns a Promise that resolves to an array where each element
   *                           in the array is the status of upsert of the corresponding
   *                           resource.
   */
  PersistenceStore.prototype.upsertAll = function (values) {
    throw TypeError("failed in abstract function");
  };

  /**
   * This is query and sort support for persistence store.
   * @method
   * @name find
   * @memberof! PersistenceStore
   * @instance
   * @param {{selector: Object, fields: Object, sort: Object}} findExpression The expression to query/sort the store. The syntax
   *                                of the expression follows standard MangoDB syntax.
   * <ul>
   * <li>findExpression.selector search criteria</li>
   * <li>findExpression.fields lists of fields to be included in the return
   *                                       value</li>
   * <li>findExpression.sort name of the field to be sorted against and the
   *                                     order to sort with.</li>
   * </ul>
   * @return {Promise} Returns a Promise that resolves to an array of entries that
   *                           satisfy the selector expression in the specified sorted
   *                           order that contains the specified fields. The
   *                           promise should resolve to an emtpy array if no
   *                           entries are found. 
   */
  PersistenceStore.prototype.find = function (findExpression) {
    throw TypeError("failed in abstract function");
  };

  /**
   * Convenient method to retrieve the document with the specified key. This is
   * equivalent to
   * find({selector: {key: {$eq: keyValue}},
           fields: [value]});
   * @method
   * @name findByKey
   * @memberof! PersistenceStore
   * @instance
   * @param {string} key The key part of the composite key in the store to
   *                     search for store entry.
   * @return {Promise} Returns a Promise that resolves to the store entry
   *                   identified by the specified key
   */
  PersistenceStore.prototype.findByKey = function (key) {
    throw TypeError("failed in abstract function");
  };

  /**
   * Convenient method to delete a document identified by the specified key.
   * This is equivalent to
   *   delete({selector: {key: {$eq: keyValue}}});
   * @method
   * @name removeByKey
   * @memberof! PersistenceStore
   * @instance
   * @param {string} key The key to identify the store entry that needs to be deleted.
   * @return {Promise} Returns a Promise that is resolved when the store entry
   *                   is deleted.
   */
  PersistenceStore.prototype.removeByKey = function (key) {
    throw TypeError("failed in abstract function");
  };

  /**
   * Delete the keys that satisfy the findExpression.
   * @method
   * @name delete
   * @memberof! PersistenceStore
   * @instance
   * @param {{selector: Object}} findExpression The expression to find matching documents to delete.
   *                                The syntax of the expression follows standard
   *                                MangoDB syntax. If undefined, all documents in this
   *                                store will be deleted.
   * <ul>
   * <li>findExpression.selector The search criteria to find matching
   *                                         document.</li>
   * </ul>
   */
  PersistenceStore.prototype.delete = function (findExpression) {
    throw TypeError("failed in abstract function");
  };

  /**
   * Returns all the keys of the documents in this store.
   * @method
   * @memberof! PersistenceStore
   * @instance
   * @return {Promise} Returns a Promise that resolves to an array where each
   *                           element is the key of an entry in this store.
   *                           The Promise should resolve to an empty array if
   *                           there is no entries in the store.
   */
  PersistenceStore.prototype.keys = function () {
    throw TypeError("failed in abstract function");
  };

  /**
   * Update the key value for the row referenced by the current key value.
   * @method
   * @name updateKey
   * @memberof! PersistenceStore
   * @instance
   * @param {string} currentKey The current key used to identify this resource
   * @param {string} newKey The new key used to identify this resource
   * @return {Promise} Returns a Promise that resolves when the key is updated.
   */
  PersistenceStore.prototype.updateKey = function(currentKey, newKey) {
    throw TypeError("failed in abstract function");
  }

  return PersistenceStore;
});
