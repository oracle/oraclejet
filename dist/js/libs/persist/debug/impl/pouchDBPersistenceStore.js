/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(["../PersistenceStore", "../impl/storageUtils", "pouchdb", "./logger"],
       function (PersistenceStore, storageUtils, PouchDB, logger) {
  'use strict';

  var PouchDBPersistenceStore = function (name) {
    PersistenceStore.call(this, name);
  }

  PouchDBPersistenceStore.prototype = new PersistenceStore();

  // in ---> index: ['foo', 'bar']
  // out---> index: {
  //                  fields: ['foo', 'bar'],
  //                  name: 'storefoobar'
  //                }
  PouchDBPersistenceStore.prototype.Init = function (options) {
    this._version = (options && options.version) || '0';
    var dbname = this._name + this._version;
    var adapter = options ? options.adapter : null;
    var dbOptions = this._extractDBOptions(options);
    if (adapter) {
      try {
        if (adapter.plugin) {
          PouchDB.plugin(adapter.plugin);
        }
        dbOptions = dbOptions ? dbOptions : {};
        dbOptions['adapter'] = adapter.name;
        this._db = new PouchDB(dbname, dbOptions);
      } catch (exp) {
        logger.log("Error creating PouchDB instance with adapter " + adapter + ": ", exp.message);
        logger.log("Please make sure the needed plugin and adapter are installed.");
        return Promise.reject(exp);
      }
    } else if (dbOptions) {
      this._db = new PouchDB(dbname, dbOptions);
    } else {
      this._db = new PouchDB(dbname);
    }
    this._index = (options && options.index) ? options.index : null;
    return this._createIndex();
  };

  // extract the option keys that will be passed to pouchDB.
  // ignore the ones that's for PouchDBPersistenceStore itself.
  PouchDBPersistenceStore.prototype._extractDBOptions = function(options) {
    var dbOptions = null;
    if (options) {
      var self = this;
      Object.keys(options).forEach(function(optionKey) {
        if (!self._isPersistenceStoreKey(optionKey)) {
          if (!dbOptions) {
            dbOptions = {};
          }
          dbOptions[optionKey] = options[optionKey];
        }
      });
    }
    return dbOptions;
  };

  PouchDBPersistenceStore.prototype._isPersistenceStoreKey = function(keyName) {
    return keyName === 'version' || keyName === 'adapter' || keyName === 'index';
  };

  PouchDBPersistenceStore.prototype._createIndex = function () {
    if (!this._index || !this._db.createIndex) {
      return Promise.resolve();
    } else {
      var self = this;
      var indexName = self._name + self._index.toString().replace(",", "").replace(".","");
      var indexSyntax = {
        index: {
          fields: self._index,
          name: indexName
        }
      };
      // createIndex if using the find plugin
      return self._db.createIndex(indexSyntax);
    }
  };

  PouchDBPersistenceStore.prototype.upsert = function (key, metadata, value, expectedVersionIdentifier) {
    logger.log("Offline Persistence Toolkit pouchDBPersistenceStore: upsert() for key: " + key);
    var self = this;
    var docId = key.toString();

    var attachmentParts = [];
    this._prepareUpsert(value, attachmentParts);

    return self._db.get(docId).then(function (doc) {
      // document exists already, update it if its versionIdentifier value
      // is the same as the expected value. Otherwise, throw conflict error
      if (!_verifyVersionIdentifier(expectedVersionIdentifier, doc)) {
        return Promise.reject({status: 409});
      } else {
        return doc;
      }
    }).catch(function (geterr) {
      if (geterr.status === 404 && geterr.message === 'missing') {
        return Promise.resolve();
      } else {
        return Promise.reject(geterr);
      }
    }).then(function (existingDoc) {
      return self._put(docId, metadata, value, expectedVersionIdentifier, attachmentParts, existingDoc);
    }).then(function () {
      return Promise.resolve();
    });
  };

  PouchDBPersistenceStore.prototype._put = function (docId, metadata, value,
                                                     expectedVersionIdentifier,
                                                     attachmentParts, existingDoc) {
    var dbdoc = {
      _id: docId,
      metadata: metadata,
      value: value
    };

    if (existingDoc) {
      dbdoc._rev = existingDoc._rev;
    }

    var self = this;
    return self._db.put(dbdoc).then(function (addeddoc) {
      return Promise.resolve(addeddoc);
    }).catch(function (puterr) {
      if (puterr.status === 409) {
        // because of the asynchroness nature, and the same resource
        // could be asked to add to the store in multiple paths, it's
        // valid to have conflict error from pouchDB, we'll verify if
        // this is a valid conflict or not.
        return self._db.get(docId).then(function (conflictDoc) {
          if (expectedVersionIdentifier) {
            if (!_verifyVersionIdentifier(expectedVersionIdentifier, conflictDoc)) {
              return Promise.reject({status: 409});
            } else {
              return Promise.resolve(conflictDoc);
            }
          } else {
            return Promise.resolve(conflictDoc);
          }
        });
      } else {
        return Promise.reject(puterr);
      }
    }).then(function(finalDoc){
      return self._addAttachments(finalDoc, attachmentParts);
    }).then(function () {
      return Promise.resolve();
    });
  };

  // helper function to check expectedVersionIdentifier with the
  // versionIdentifier value of currentDocument. Return true if there is no
  // confict, false otherwise.
  var _verifyVersionIdentifier = function (expectedVersionIdentifier, currentDocument) {
    if (!expectedVersionIdentifier) {
      return true;
    } else {
      var docVersionIdentifier = currentDocument.metadata.versionIdentifier;
      return docVersionIdentifier === expectedVersionIdentifier;
    }
  };

  // add the binary part of the value as attachment to the main document.
  PouchDBPersistenceStore.prototype._addAttachments = function (doc, attachmentParts) {
    if (!attachmentParts || !attachmentParts.length) {
      return Promise.resolve();
    } else {
      var promises = attachmentParts.map(function (attachment) {
        var blob;
        if (attachment.value instanceof Blob) {
          blob = attachment.value;
        } else {
          blob = new Blob([attachment.value]);
        }
        return this._db.putAttachment(doc.id, attachment.path, doc.rev, blob, 'binary')
      }, this);
      return Promise.all(promises);
    }
  };

  PouchDBPersistenceStore.prototype.upsertAll = function (values) {
    logger.log("Offline Persistence Toolkit pouchDBPersistenceStore: upsertAll()");
    if (!values || !values.length) {
      return Promise.resolve();
    } else {
      var promises = values.map(function (element) {
        return this.upsert(element.key, element.metadata, element.value, element.expectedVersionIdentifier);
      }, this);
      return Promise.all(promises);
    }
  };

  PouchDBPersistenceStore.prototype.find = function (findExpression) {
    logger.log("Offline Persistence Toolkit pouchDBPersistenceStore: find() for expression: " +  JSON.stringify(findExpression));
    var self = this;
    
    findExpression = findExpression || {};

    // if the find plugin is installed
    if (self._db.find) {
      var modifiedFind = self._prepareFind(findExpression);
      return self._db.find(modifiedFind).then(function (result) {
        if (result && result.docs && result.docs.length) {
          var promises = result.docs.map(self._findResultCallback(modifiedFind.fields), self);
          return Promise.all(promises);
        } else {
          return [];
        }
      }).catch(function (finderr) {
        if (finderr.status === 404 && finderr.message === 'missing') {
          return [];
        } else {
          throw finderr;
        }
      });
    } else {
      // get all rows and use our own find logic
      return self._db.allDocs({include_docs: true}).then(function (result) {
        if (result && result.rows && result.rows.length) {
          // filter on the rows first before _fixBinaryValue which adds binary
          // back to the document. This assumes the search criteria should
          // not have any operator against the binary data. 
          var satisfiedRows = result.rows.filter(function(row) {
            var doc = row.doc;
            self._fixKey(doc);
            if (storageUtils.satisfy(findExpression.selector, doc)) {
              return true;
            }
            return false;
           });

          if (satisfiedRows.length) {
            var fixDocPromises = satisfiedRows.map(function(row) {
              return self._fixBinaryValue(row.doc).then(function(fixedDoc){
                if (findExpression.fields) {
                  return storageUtils.assembleObject(fixedDoc, findExpression.fields);
                } else {
                  return fixedDoc.value;
                }
              });
            });
            return Promise.all(fixDocPromises);
          } else {
            return [];
          }
        } else {
          return [];
        }
      }).catch(function(err) {
        logger.log("error retrieving all documents from pouch db, returns empty list as find operation.", err);
        return [];
      });
    }
  };

  PouchDBPersistenceStore.prototype._findResultCallback = function (useDefaultField) {
    return function (element) {
      var self = this;
      return self._fixValue(element).then(function (fixedDoc) {
        if (useDefaultField) {
          return fixedDoc;
        } else {
          return fixedDoc.value;
        }
      });
    };
  };

  // invoked after document is retrieved. Fix the key and binary
  // part of the value.
  PouchDBPersistenceStore.prototype._fixValue = function (doc) {
    this._fixKey(doc);
    return this._fixBinaryValue(doc);
  };

  // If the original value has binary data in it,
  // we need to retrieve it back as attachments
  // and add it back to the value part.
  PouchDBPersistenceStore.prototype._fixBinaryValue = function (doc) {
    var docId = doc._id || doc.id || doc.key;
    var attachments = doc._attachments;
    if (!attachments) {
      return Promise.resolve(doc);
    } else {
      var self = this;
      var filename = Object.keys(attachments)[0];
      return self._db.getAttachment(docId, filename).then(function (blob) {
        var paths = filename.split('.');
        var targetValue = doc.value;
        for (var pathIndex = 0; pathIndex < paths.length - 1; pathIndex++) {
          targetValue = targetValue[paths[pathIndex]];
        }
        targetValue[paths[paths.length - 1]] = blob;
        return doc;
      });
    }
  };

  PouchDBPersistenceStore.prototype._fixKey = function (doc) {
    var docId = doc._id || doc.id || doc.key;

    if (docId) {
      doc.key = docId;
    }
  };

  PouchDBPersistenceStore.prototype.findByKey = function (key) {
    logger.log("Offline Persistence Toolkit pouchDBPersistenceStore: findByKey() for key: " + key);
    var self = this;
    var docId = key.toString();

    return self._db.get(docId).then(function (doc) {
      return doc.value;
    }).catch(function (err) {
      if (err.status === 404 && err.message === 'missing') {
        return Promise.resolve();
      } else {
        return Promise.reject(err);
      }
    });
  };

  PouchDBPersistenceStore.prototype.removeByKey = function (key) {
    logger.log("Offline Persistence Toolkit pouchDBPersistenceStore: removeByKey() for key: " + key);
    var self = this;
    var docId = key.toString();
    return self._db.get(docId).then(function (doc) {
      return self._db.remove(doc);
    }).then(function () {
      return true;
    }).catch(function (err) {
      if (err.status === 404 && err.message === 'missing') {
        return Promise.resolve(false);
      } else {
        return Promise.reject(err);
      }
    });
  };

  PouchDBPersistenceStore.prototype.delete = function (deleteExpression) {
    logger.log("Offline Persistence Toolkit pouchDBPersistenceStore: delete() for expression: " +  JSON.stringify(deleteExpression));
    var self = this;

    if (deleteExpression) {
      var modifiedExpression = deleteExpression;
      modifiedExpression.fields = ['_id', '_rev'];
      return self.find(modifiedExpression).then(function (entries) {
        if (entries && entries.length) {
           var promisesArray = entries.map(function (element) {
             return this._db.remove(element._id, element._rev);
           }, self);
           return Promise.all(promisesArray);
         } else {
           return Promise.resolve();
         }
      }).then(function () {
        return Promise.resolve();
      });
    } else {
      return self._db.destroy().then(function () {
        var dbname = self._name + self._version;
        self._db = new PouchDB(dbname);
        return self._createIndex();
      });
    }
  };

  PouchDBPersistenceStore.prototype.keys = function () {
    logger.log("Offline Persistence Toolkit pouchDBPersistenceStore: keys()");
    var self = this;

    return self._db.allDocs().then(function (result) {
      var rows = result.rows;
      var keysArray = [];
      if (rows && rows.length) {
        keysArray = rows.map(function (element) {
          return element.id;
        });
      }
      return keysArray;
    });
  };

  // return a promise that resolves to an expression that can be
  // understood by pouchdb find plugin.
  PouchDBPersistenceStore.prototype._prepareFind = function (findExpression) {

    var modifiedExpression = {};

    // ideally we should allow sort, but PouchDB-find-plugin
    // has bug on that, so disable sorting at this time by
    // not copy sort from original expression.

    // selector is required from pouchdb.find plugin, thus create a selector
    // property if no selector is explicitely defined in findExpression. The
    // default selector is {'_id': {$gt: null}} which selects everything.
    var selector = findExpression.selector;
    if (!selector) {
      modifiedExpression.selector = {
        '_id': {'$gt': null}
      };
    } else {
      modifiedExpression.selector = selector;
    }

    // our key attribute maps to pouchdb documents' _id field.
    var fields = findExpression.fields;
    if (fields && fields.length) {
      var modifiedFields = fields.map(function (x) {
        if (x === 'key') {
          return '_id';
        } else {
          return x;
        }
      });
      modifiedExpression.fields = modifiedFields;
    }

    return modifiedExpression;
  };

  // prepare the value for upsert. pouchDB requires that binary part of the value
  // be added as attachment instead of as part of the value.
  PouchDBPersistenceStore.prototype._prepareUpsert = function (value, attachmentParts) {
    var path = '';
    this._inspectValue(path, value, attachmentParts);
  };

  // scan the value to see if there's any binary data in it, if so, extract it out.
  PouchDBPersistenceStore.prototype._inspectValue = function (path, value, attachmentParts) {
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        var itemValue = value[key];
        if (itemValue && typeof(itemValue) === 'object') {
          if ((itemValue instanceof Blob) || (itemValue instanceof ArrayBuffer)) {
            var localPath = path;
            if (localPath.length > 0) {
              localPath = localPath + '.';
            }
            var attachment = {
              path: localPath + key,
              value: itemValue
            };
            attachmentParts.push(attachment);
            value.key = null;
          } else if (itemValue.length === undefined) {
            var oldPath = path;
            if (path.length > 0) {
              path = path + '.';
            }
            path = path + key;
            this._inspectValue(path, itemValue, attachmentParts);
            path = oldPath;
          }
        }
      }
    }
  };

  PouchDBPersistenceStore.prototype.updateKey = function(currentKey, newKey) {
    logger.log("Offline Persistence Toolkit PouchDBPersistenceStore: updateKey() with currentKey: " + currentKey + " and new key: " + newKey);
    var self = this;
    return self._db.get(currentKey).then(function (existingValue) {
      if (existingValue) {
        return self.upsert(newKey, existingValue.metadata, existingValue.value);
      } else {
        return Promise.reject("No existing key found to update");
      }
    }).then(function() {
      return self.removeByKey(currentKey);
    });
  };

  return PouchDBPersistenceStore;
});
