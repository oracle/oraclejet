/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['./keyValuePersistenceStore', '../persistenceStoreManager', './logger'],
  function (keyValuePersistenceStore, persistenceStoreManager, logger) {
    'use strict';

    var FileSystemPersistenceStore = function (name) {
      keyValuePersistenceStore.call(this, name);
      this._directoryName = _normalize(name);
      this._directory = null;
    }

    FileSystemPersistenceStore.prototype = new keyValuePersistenceStore();

    FileSystemPersistenceStore.prototype.Init = function (options) {
      var self = this;
      return keyValuePersistenceStore.prototype.Init.call(self, options).then(function () {
        self._directoryName = _normalize(self._name + self._version);
        return new Promise(function(resolve, reject) {
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
            fs.root.getDirectory(self._directoryName, {create: true}, function (dirEntry) {
              self._directory = dirEntry;
              resolve();
            });
          }, function(fileError) {
            reject(fileError);
          });
        });
      });
    };

    FileSystemPersistenceStore.prototype._insert = function (key, metadata, value) {
      var self = this;
      // upsert should always delete the file first otherwise we'll end up appending to file
      return this.removeByKey(key).then(function() {
        if (value instanceof Blob) {
          metadata.data_type = 'Blob';
        } else {
          metadata.data_type = 'JSON';
        }
        var dirReader = self._directory.createReader();
        return new Promise(function(resolve, reject) {
          dirReader.readEntries(function (fileEntries) {
            var checkFilename = function(filename) {
              var foundFiles = fileEntries.filter(function(fileEntry) {
                if (fileEntry.name == filename) {
                  return true;
                }
                return false;
              });
              return foundFiles.length > 0;
            };
            var filename = Math.floor(Math.random() * 100000000) + '.pds'; // @RandomNumberOK - Only used to internally generate file names
            while(checkFilename(filename))
            {
              filename = Math.floor(Math.random() * 100000000) + '.pds'; // @RandomNumberOK - Only used to internally generate file names
            }
            _writeFile(self, filename, key, metadata, value).then(function() {
              resolve();
            });
          });
        });
      });
    };

    function _writeFile(self, filename, key, metadata, data) {
      return new Promise(function(resolve, reject){
        self._directory.getFile(filename, {create: true, exclusive: false}, function (fileEntry){
          fileEntry.createWriter(function(fileWriter){
            fileWriter.onwriteend = function () {
              _updateFileIndex(key, filename, metadata).then(function() {
                resolve();
              });
            };

            fileWriter.onerror = function(e) {
              reject(e);
            };
            if (metadata.data_type == 'JSON') {
              data = JSON.stringify(data);
            }
            fileWriter.write(data); // @HTMLUpdateOK
          });
        });
      });
    };

    function _updateFileIndex(key, filename, metadata) {
      return _getFileIndexStorage().then(function(store) {
        return store.upsert(key, metadata, {filename: filename, metadata: metadata});
      });
    };

    function _getFileIndexStorage() {
      var options = {index: ['key'], skipMetadata: true};
      return persistenceStoreManager.openStore('fileIndex', options);
    };

    function _getFile(self, filename) {
      return new Promise(function(resolve, reject){
        self._directory.getFile(filename, {create: false, exclusive: false}, function (fileEntry) {
           resolve(fileEntry)
        }, function (err) {
          if (err.code === FileError.NOT_FOUND_ERR ||
            err.code === FileError.SYNTAX_ERR) {
            resolve(null);
          } else {
            reject(err);
          }
        });
      });
    }

    FileSystemPersistenceStore.prototype.getItem = function (key) {
      logger.log("Offline Persistence Toolkit fileSystemPersistenceStore: getItem() with key: " + key);
      var self = this;
      return _findByKeyFileIndex(key).then(function(fileIndex) {
        if (fileIndex) {
          var filename = fileIndex.filename;
          var metadata = fileIndex.metadata;
          return _getFile(self, filename).then(function(fileEntry) {
            if (fileEntry) {
              return new Promise(function(resolve, reject) {
                fileEntry.file(function (file) {
                  var reader = new FileReader();
                  reader.onloadend = function (e) {
                    var value = _readBlob(this.result, 0);
                    if (metadata.data_type == 'JSON') {
                      var blobReader = new FileReader();
                      blobReader.onloadend = function() {
                        resolve({metadata: metadata, value: JSON.parse(this.result)});
                      };
                      blobReader.readAsText(value);
                    } else {
                      resolve({metadata: metadata, value: value});
                    }
                  };
                  reader.readAsArrayBuffer(file);
                }, function (fileError) {
                  reject(fileError);
                });
              });
            }
          });
        }
      });
    };

    function _readBlob(arrayBuffer, pos) {
      var dataView = new DataView(arrayBuffer.slice(pos));
      return new Blob([dataView]);
    }

    FileSystemPersistenceStore.prototype.removeByKey = function (key) {
      logger.log("Offline Persistence Toolkit fileSystemPersistenceStore: removeByKey() with key: " + key);
      var self = this;
      return _findByKeyFileIndex(key).then(function(fileIndex) {
        if (fileIndex) {
          return _removeByKeyFileIndex(key).then(function() {
            return _removeFile(self, fileIndex.filename);
          });
        } else {
          return Promise.resolve(false);
        }
      });
    };

    function _findByKeyFileIndex(key) {
      return _getFileIndexStorage().then(function(store) {
        return store.findByKey(key);
      });
    };

    function _removeByKeyFileIndex(key) {
      return _getFileIndexStorage().then(function(store) {
        return store.removeByKey(key);
      });
    };

    function _removeFile(self, filename) {
      return _getFile(self, filename).then(function(fileEntry) {
        if (fileEntry) {
          return new Promise(function (resolve, reject) {
            fileEntry.remove(function () {
              resolve(true);
            }, function (err) {
              resolve(false);
            });
          });
        } else {
          return false;
        }
      });
    };

    FileSystemPersistenceStore.prototype.keys = function () {
      logger.log("Offline Persistence Toolkit fileSystemPersistenceStore: keys()");
      return _keysFileIndex();
    };

    function _keysFileIndex() {
      return _getFileIndexStorage().then(function(store) {
        return store.keys();
      });
    };

    FileSystemPersistenceStore.prototype.deleteAll = function () {
      logger.log("Offline Persistence Toolkit fileSystemPersistenceStore: deleteAll()");
      var self = this;
      return _deleteFileIndex().then(function() {
        var promiseArray = [];
        var dirReader = self._directory.createReader();
        promiseArray.push(new Promise(function(resolve, reject) {
          dirReader.readEntries(function (fileEntries) {
            fileEntries.map(function (fileEntry) {
              promiseArray.push(_removeFile(self, fileEntry.name));
            });
            resolve();
          });
        }));
        return Promise.all(promiseArray);
      });
    };

    function _deleteFileIndex() {
      return _getFileIndexStorage().then(function(store) {
        return store.delete();
      });
    };

    // normalize rawname to a valid file name.
    // 1. maximum filename length is 255 (http://unix.stackexchange.com/questions/32795/what-is-the-maximum-allowed-filename-and-folder-size-with-ecryptfs)
    // 2. Common illegal characters as file name (https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx):
    //    < > : " / \ | ? * ~
    // 2. Common reserved filenames: . ..
    // 3. reserved filenames on Windows (https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx):
   //        CON, PRN, AUX, NUL, COM1, COM2, COM3,
    //       COM4, COM5, COM6, COM7, COM8, COM9, LPT1, LPT2, LPT3, LPT4, LPT5,
    //       LPT6, LPT7, LPT8, and LPT9. Also avoid these names followed
    //       immediately by an extension; for example, NUL.txt is not recommended.
    // 4. Unicode control code (https://en.wikipedia.org/wiki/C0_and_C1_control_codes):
    //      C0 0x00-0x1f & C1 (0x80-0x9f)
    function _normalize(rawname) {
      var illegalCharExp = /[<>\:"\/\\\|\?\*\~]/g;
      var reservedExp = /^\.+$/;
      var reservedWindowExp = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
      var unicodeControlExp = /[\x00-\x1f\x80-\x9f]/g;
      var replacement = '';
      var maxLength = 255;
      var replacedname1 = rawname.replace(illegalCharExp, replacement);
      var replacedname2 = replacedname1.replace(reservedExp, replacement);
      var replacedname3 = replacedname2.replace(reservedWindowExp, replacement);
      var replacedname4 = replacedname3.replace(unicodeControlExp, replacement);
      if (replacedname4.length > maxLength) {
        return replacedname4.slice(0, maxLength);
      } else {
        return replacedname4;
      };
    };

    FileSystemPersistenceStore.prototype.updateKey = function(currentKey, newKey) {
      logger.log("Offline Persistence Toolkit FileSystemPersistenceStore: updateKey() with currentKey: " + currentKey + " and new key: " + newKey);
      var self = this;
      return _findByKeyFileIndex(currentKey).then(function(fileIndex) {
        if (fileIndex) {
          var filename = fileIndex.filename;
          var metadata = fileIndex.metadata;
          return _updateFileIndex(newKey, filename, metadata);
        } else {
          return Promise.reject("No existing key found to update");
        }
      }).then(function() {
        return _removeByKeyFileIndex(currentKey);
      });
    };

    return FileSystemPersistenceStore;
  });
