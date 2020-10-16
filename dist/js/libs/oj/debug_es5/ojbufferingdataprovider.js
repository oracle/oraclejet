/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojset', 'ojs/ojmap', 'ojs/ojdataprovider', 'ojs/ojcomponentcore', 'ojs/ojeventtarget'],
function(oj, ojSet, ojMap, __DataProvider)
{
  "use strict";
  var GenericEvent = oj.GenericEvent;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



/**
 * Class which provides edit buffering
 */
var BufferingDataProvider = /*#__PURE__*/function () {
  function BufferingDataProvider(dataProvider, options) {
    _classCallCheck(this, BufferingDataProvider);

    this.dataProvider = dataProvider;
    this.options = options;

    this.AsyncIterable = /*#__PURE__*/function () {
      function _class(_parent, _asyncIterator) {
        _classCallCheck(this, _class);

        this._parent = _parent;
        this._asyncIterator = _asyncIterator;

        this[Symbol.asyncIterator] = function () {
          return this._asyncIterator;
        };
      }

      return _class;
    }();

    this.AsyncIterator = /*#__PURE__*/function () {
      function _class2(_parent, _baseIterator, _params) {
        _classCallCheck(this, _class2);

        this._parent = _parent;
        this._baseIterator = _baseIterator;
        this._params = _params;
        this.itemArray = [];
        this.firstBaseKey = null;
        this.mergedAddKeySet = new ojSet();
        this.mergedMetadataArray = [];
        this.mergedDataArray = [];
      }

      _createClass(_class2, [{
        key: "_fetchNext",
        value: function _fetchNext() {
          var _this = this;

          return this._baseIterator.next().then(function (result) {
            // Remember the first key from base DataProvider before which we add unsorted new items
            if (!_this.firstBaseKey && result.value.metadata.length) {
              _this.firstBaseKey = result.value.metadata[0].key;
            }

            var editBuffer = _this._parent.editBuffer;

            if (!editBuffer.isEmpty()) {
              var baseItemArray = result.value.data.map(function (val, index) {
                return {
                  data: result.value.data[index],
                  metadata: result.value.metadata[index]
                };
              });

              var newItemArray = _this.itemArray.slice();

              _this.itemArray = [];

              _this._parent._mergeEdits(baseItemArray, newItemArray, _this._params.filterCriterion, _this._params.sortCriteria, true, _this.mergedAddKeySet, result.done); // If the new results don't have the requested number of rows, we may need to fetch more


              var params = _this._params || {};

              if (params.size && newItemArray.length < params.size || params.size == null && newItemArray.length === 0) {
                // We can only fetch more if the underlying DataProvider is not done
                if (!result.done) {
                  // Set this.itemArray to newItemArray so that the next call will append to it
                  _this.itemArray = newItemArray;
                  return _this._fetchNext();
                }
              } // If the new results have more rows than requested, we can save the rest for next call


              if (params.size && newItemArray.length > params.size) {
                _this.itemArray = newItemArray.splice(params.size);
              }

              var done = result.done && _this.itemArray.length === 0;
              var newDataArray = newItemArray.map(function (item) {
                return item.data;
              });
              var newMetaArray = newItemArray.map(function (item) {
                return item.metadata;
              });
              return {
                done: done,
                value: {
                  fetchParameters: _this._params,
                  data: newDataArray,
                  metadata: newMetaArray
                }
              };
            }

            return result;
          });
        }
      }, {
        key: 'next',
        value: function next() {
          var _this2 = this;

          var promise = this._fetchNext();

          return promise.then(function (result) {
            // Keep track of the merged data that have been returned so that we know where added items should be inserted
            var metadata = result.value.metadata;
            var data = result.value.data;

            for (var i = 0; i < metadata.length; i++) {
              _this2.mergedMetadataArray.push(metadata[i]);

              _this2.mergedDataArray.push(data[i]);
            }

            return result;
          });
        }
      }]);

      return _class2;
    }();

    this._addEventListeners(dataProvider);

    this.editBuffer = new EditBuffer();
    this.lastSubmittableCount = 0;
    this.lastFetchListParams = null;
    this.lastIterator = null;
  }

  _createClass(BufferingDataProvider, [{
    key: "_fetchByKeysFromBuffer",
    value: function _fetchByKeysFromBuffer(params) {
      var _this3 = this;

      var results = new ojMap();
      var unresolvedKeys = new ojSet();
      params.keys.forEach(function (key) {
        var editItem = _this3.editBuffer.getItem(key);

        if (editItem) {
          switch (editItem.operation) {
            case 'add':
            case 'update':
              // Return the buffered item if it is being added or updated
              results.set(key, editItem.item);
              break;

            case 'remove':
              // Skip the key if it is being removed
              break;
          }
        } else {
          // need to fetch from underlying DataProvider if it's not in the buffer
          unresolvedKeys.add(key);
        }
      });
      return {
        results: results,
        unresolvedKeys: unresolvedKeys
      };
    }
  }, {
    key: "_compareItem",
    value: function _compareItem(d1, d2, sortCriteria) {
      for (var i = 0; i < sortCriteria.length; i++) {
        if (d1[sortCriteria[i].attribute] > d2[sortCriteria[i].attribute]) {
          return sortCriteria[i].direction === 'ascending' ? 1 : -1;
        } else if (d1[sortCriteria[i].attribute] < d2[sortCriteria[i].attribute]) {
          return sortCriteria[i].direction === 'ascending' ? -1 : 1;
        } // If d1 and d2 is the same on the current sortCriterion, move on to the next sortCriterion

      }

      return 0;
    }
  }, {
    key: "_insertAddEdits",
    value: function _insertAddEdits(editItems, filterObj, sortCriteria, itemArray, mergedAddKeySet, lastBlock) {
      var _this4 = this;

      editItems.forEach(function (editItem, key) {
        // Check if it's an "add" item and not previously merged before merging it
        if (editItem.operation === 'add' && !mergedAddKeySet.has(key)) {
          // First check to see if this item satisfies any filter
          if (!filterObj || filterObj.filter(editItem.item.data)) {
            if (sortCriteria && sortCriteria.length) {
              var inserted = false;

              for (var i = 0; i < itemArray.length; i++) {
                if (_this4._compareItem(editItem.item.data, itemArray[i].data, sortCriteria) < 0) {
                  itemArray.splice(i, 0, editItem.item);
                  mergedAddKeySet.add(key);
                  inserted = true;
                  break;
                }
              } // Add to the end only if the item hasn't been inserted and there is no more data


              if (!inserted && lastBlock) {
                itemArray.push(editItem.item);
                mergedAddKeySet.add(key);
              }
            } else {
              itemArray.push(editItem.item);
              mergedAddKeySet.add(key);
            }
          }
        }
      });
    }
  }, {
    key: "_mergeAddEdits",
    value: function _mergeAddEdits(filterObj, sortCriteria, newItemArray, mergedAddKeySet, lastBlock) {
      this._insertAddEdits(this.editBuffer.getUnsubmittedItems(), filterObj, sortCriteria, newItemArray, mergedAddKeySet, lastBlock);

      this._insertAddEdits(this.editBuffer.getSubmittingItems(), filterObj, sortCriteria, newItemArray, mergedAddKeySet, lastBlock);
    }
  }, {
    key: "_mergeEdits",
    value: function _mergeEdits(baseItemArray, newItemArray, filterCriterion, sortCriteria, addToBeginning, mergedAddKeySet, lastBlock) {
      var filterObj; // Get a filter if there is a filterCriterion

      if (filterCriterion) {
        if (!filterCriterion.filter) {
          filterObj = __DataProvider.FilterFactory.getFilter({
            filterDef: filterCriterion,
            filterOptions: this.options
          });
        } else {
          filterObj = filterCriterion;
        }
      } // If addToBeginning is true and there is no sortCriteria, insert all "add" items at the beginning.
      // Newly added items are likely the most important items and users want to see it at the beginning
      // instead of at the end.  We can add option to control this if there is request to add them
      // to the end.


      if (addToBeginning && !(sortCriteria && sortCriteria.length)) {
        this._mergeAddEdits(filterObj, sortCriteria, newItemArray, mergedAddKeySet, lastBlock);
      } // Merge the removes and updates


      for (var i = 0; i < baseItemArray.length; i++) {
        var baseItem = baseItemArray[i];
        var editItem = this.editBuffer.getItem(baseItem.metadata.key);

        if (!editItem) {
          newItemArray.push(baseItem);
        } else {
          if (editItem.operation === 'remove') {// Skip the item if it's marked for remove
          } else if (editItem.operation === 'update') {
            // Replace the item if it's marked for update
            // However, if the replacement doesn't satisfy any filter, skip it altogether.
            if (!filterObj || filterObj.filter(editItem.item.data)) {
              newItemArray.push(editItem.item);
            }
          }
        }
      } // If there is sortCriteria, merge the "add" items into the existing items


      if (sortCriteria && sortCriteria.length) {
        this._mergeAddEdits(filterObj, sortCriteria, newItemArray, mergedAddKeySet, lastBlock);
      }
    }
  }, {
    key: "_fetchFromOffset",
    value: function _fetchFromOffset(params, newItemArray) {
      var _this5 = this;

      return this.dataProvider.fetchByOffset(params).then(function (baseResults) {
        var editBuffer = _this5.editBuffer;

        if (!editBuffer.isEmpty()) {
          var baseItemArray = baseResults.results;

          _this5._mergeEdits(baseItemArray, newItemArray, params.filterCriterion, params.sortCriteria, params.offset === 0, new ojSet(), baseResults.done); // If the new results don't have the requested number of rows, we may need to fetch more


          if (params.size && newItemArray.length < params.size || params.size == null && newItemArray.length === 0) {
            // We can only fetch more if the underlying DataProvider is not done
            if (!baseResults.done) {
              var nextParams = {
                attributes: params.attributes,
                clientId: params.clientId,
                filterCriterion: params.filterCriterion,
                offset: params.offset + baseResults.results.length,
                size: params.size,
                sortCriteria: params.sortCriteria
              };
              return _this5._fetchFromOffset(nextParams, newItemArray);
            }
          } // If the new results have more rows than requested, we can remove the extra


          if (params.size && newItemArray.length > params.size) {
            newItemArray.splice(params.size);
          }

          return {
            fetchParameters: params,
            results: newItemArray,
            done: baseResults.done
          };
        }

        return baseResults;
      });
    }
  }, {
    key: "containsKeys",
    value: function containsKeys(params) {
      // First try to resolve the keys from the buffer
      var bufferResult = this._fetchByKeysFromBuffer(params);

      var unresolvedKeys = bufferResult.unresolvedKeys;
      var results = new ojSet(); // Extract the set of keys from bufferResult

      bufferResult.results.forEach(function (value, key) {
        results.add(key);
      }); // We are done if all keys are resolved by the buffer

      if (unresolvedKeys.size === 0) {
        return Promise.resolve({
          containsParameters: params,
          results: results
        });
      } // Otherwise fetch the remaining keys from the underlying DataProvider


      return this.dataProvider.containsKeys({
        attributes: params.attributes,
        keys: unresolvedKeys,
        scope: params.scope
      }).then(function (baseResults) {
        if (results.size > 0) {
          // If we already have some results from the buffer, add the remaining results from the underlying DataProvider
          baseResults.results.forEach(function (value, key) {
            results.add(key);
          });
          return {
            containsParameters: params,
            results: results
          };
        }

        return baseResults;
      });
    }
  }, {
    key: "fetchByKeys",
    value: function fetchByKeys(params) {
      // First try to resolve the keys from the buffer
      var bufferResult = this._fetchByKeysFromBuffer(params);

      var unresolvedKeys = bufferResult.unresolvedKeys;
      var results = bufferResult.results; // We are done if all keys are resolved by the buffer

      if (unresolvedKeys.size === 0) {
        return Promise.resolve({
          fetchParameters: params,
          results: results
        });
      } // Otherwise fetch the remaining keys from the underlying DataProvider


      return this.dataProvider.fetchByKeys({
        attributes: params.attributes,
        keys: unresolvedKeys,
        scope: params.scope
      }).then(function (baseResults) {
        if (results.size > 0) {
          // If we already have some results from the buffer, add the remaining results from the underlying DataProvider
          baseResults.results.forEach(function (value, key) {
            results.set(key, value);
          });
          return {
            fetchParameters: params,
            results: results
          };
        }

        return baseResults;
      });
    }
  }, {
    key: "fetchByOffset",
    value: function fetchByOffset(params) {
      return this._fetchFromOffset(params, []);
    }
  }, {
    key: "fetchFirst",
    value: function fetchFirst(params) {
      this.lastFetchListParams = params;
      var baseIterator = this.dataProvider.fetchFirst(params)[Symbol.asyncIterator]();
      this.lastIterator = new this.AsyncIterator(this, baseIterator, params);
      return new this.AsyncIterable(this, this.lastIterator);
    }
  }, {
    key: "getCapability",
    value: function getCapability(capabilityName) {
      return this.dataProvider.getCapability(capabilityName);
    }
  }, {
    key: "_calculateSizeChange",
    value: function _calculateSizeChange(editItems) {
      var sizeChange = 0; // Add the size of "add" items and substract the size of "remove" items

      editItems.forEach(function (value, key) {
        if (value.operation === 'add') {
          ++sizeChange;
        } else if (value.operation === 'remove') {
          --sizeChange;
        }
      });
      return sizeChange;
    }
  }, {
    key: "getTotalSize",
    value: function getTotalSize() {
      var _this6 = this;

      // Start with the total size from underlying DataProvider
      return this.dataProvider.getTotalSize().then(function (totalSize) {
        if (totalSize > -1) {
          // Adjust the size by submitting items
          totalSize += _this6._calculateSizeChange(_this6.editBuffer.getSubmittingItems()); // Adjust the size by unsubmitted items.  We shouldn't need to worry about
          // "add" or "remove" items existing in both submitting and unsubmitted maps.
          // Duplicate "add" and "remove" is not allowed.

          totalSize += _this6._calculateSizeChange(_this6.editBuffer.getUnsubmittedItems());
        }

        return totalSize;
      });
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      var unsubmittedItems = this.editBuffer.getUnsubmittedItems();
      var submittingItems = this.editBuffer.getSubmittingItems(); // If there is any add or update item, the BufferingDataProvider is not empty

      unsubmittedItems.forEach(function (item, key) {
        if (item.operation === 'add' || item.operation === 'update') {
          return 'no';
        }
      });
      submittingItems.forEach(function (item, key) {
        if (item.operation === 'add' || item.operation === 'update') {
          return 'no';
        }
      }); // At this point, we know that there is either no item or only remove items in the buffer.
      // delegate to the underlying DataProvider

      var isEmpty = this.dataProvider.isEmpty();

      if (isEmpty === 'no') {
        // If the underlying DataProvider is not empty, the BufferingDataProvider can
        // still be empty if all the rows in the underlying DataProvider are being removed.
        // However, to verify that, we have to get all the keys from the underlying DataProvider,
        // which can be expensive.  Consumer usually calls isEmpty as an inexpensive way to
        // tell if the DataProvider has any data.  If we cannot tell inexpensively, we
        // returns "unknown".
        if (unsubmittedItems.size > 0 || submittingItems.size > 0) {
          return 'unknown';
        }
      }

      return isEmpty;
    }
  }, {
    key: "_addToMergedArrays",
    value: function _addToMergedArrays(item) {
      var addBeforeKey = null;

      if (this.lastIterator) {
        var sortCriteria = this.lastFetchListParams ? this.lastFetchListParams.sortCriteria : null;

        if (sortCriteria && sortCriteria.length) {
          // If there is sortCriteria, new items are inserted based on the sort
          var mergedMetadataArray = this.lastIterator.mergedMetadataArray;
          var mergedDataArray = this.lastIterator.mergedDataArray;

          for (var i = 0; i < mergedDataArray.length; i++) {
            if (this._compareItem(item.data, mergedDataArray[i], sortCriteria) < 0) {
              addBeforeKey = mergedMetadataArray[i].key;
              mergedMetadataArray.splice(i, 0, item.metadata);
              mergedDataArray.splice(i, 0, item.data);
              break;
            }
          }
        } else {
          // If there is no sortCriteria, new items are added at the beginning of dataset
          addBeforeKey = this.lastIterator.firstBaseKey;
        }
      }

      return addBeforeKey;
    }
  }, {
    key: "addItem",
    value: function addItem(item) {
      this.editBuffer.addItem(item); // Add item to the merged arrays

      var addBeforeKey = this._addToMergedArrays(item); // Fire mutate event if successful


      var detail = {
        add: {
          data: [item.data],
          keys: new ojSet().add(item.metadata.key),
          metadata: [item.metadata],
          addBeforeKeys: [addBeforeKey]
        }
      };
      var event = new __DataProvider.DataProviderMutationEvent(detail);
      this.dispatchEvent(event);

      this._dispatchSubmittableChangeEvent();
    }
  }, {
    key: "_removeFromMergedArrays",
    value: function _removeFromMergedArrays(key) {
      if (this.lastIterator) {
        // Remove item from the merged arrays
        var mergedMetadataArray = this.lastIterator.mergedMetadataArray;
        var mergedDataArray = this.lastIterator.mergedDataArray;
        var mergedAddKeySet = this.lastIterator.mergedAddKeySet;

        var keyIdx = this._findKeyInMetadata(key, mergedMetadataArray);

        if (keyIdx !== -1) {
          mergedMetadataArray.splice(keyIdx, 1);
          mergedDataArray.splice(keyIdx, 1);
          mergedAddKeySet.delete(key); // If the firstBaseKey is removed, set it to the next one

          if (oj.KeyUtils.equals(this.lastIterator.firstBaseKey, key)) {
            if (mergedMetadataArray.length > keyIdx) {
              this.lastIterator.firstBaseKey = mergedMetadataArray[keyIdx].key;
            } else {
              this.lastIterator.firstBaseKey = null;
            }
          }
        }
      }
    }
  }, {
    key: "removeItem",
    value: function removeItem(item) {
      this.editBuffer.removeItem(item); // Remove item from the merged arrays

      this._removeFromMergedArrays(item.metadata.key); // Fire mutate event if successful


      var detail = {
        remove: {
          data: item.data ? [item.data] : null,
          keys: new ojSet().add(item.metadata.key),
          metadata: [item.metadata]
        }
      };
      var event = new __DataProvider.DataProviderMutationEvent(detail);
      this.dispatchEvent(event);

      this._dispatchSubmittableChangeEvent();
    }
  }, {
    key: "updateItem",
    value: function updateItem(item) {
      this.editBuffer.updateItem(item); // Fire mutate event if successful

      var detail = {
        update: {
          data: [item.data],
          keys: new ojSet().add(item.metadata.key),
          metadata: [item.metadata]
        }
      };
      var event = new __DataProvider.DataProviderMutationEvent(detail);
      this.dispatchEvent(event);

      this._dispatchSubmittableChangeEvent();
    }
  }, {
    key: "getSubmittableItems",
    value: function getSubmittableItems() {
      var unsubmitted = this.editBuffer.getUnsubmittedItems();
      var submitting = this.editBuffer.getSubmittingItems(); // If some items are in submitting state, only return those unsubmitted items that don't
      // have the same keys as the ones that are submitting.

      var submittableItems = [];
      unsubmitted.forEach(function (editItem, key) {
        if (!submitting.has(key)) {
          submittableItems.push(editItem);
        }
      });
      return submittableItems;
    }
  }, {
    key: "resetAllUnsubmittedItems",
    value: function resetAllUnsubmittedItems() {
      // Clear the buffer and fire submittableChange event
      this.editBuffer.getUnsubmittedItems().clear();

      this._dispatchSubmittableChangeEvent(); // Fire refresh event so that consumers can refetch data


      this.dispatchEvent(new __DataProvider.DataProviderRefreshEvent());
    }
  }, {
    key: "_addEventDetail",
    value: function _addEventDetail(detail, detailType, detailItem) {
      if (detail[detailType] == null) {
        detail[detailType] = {
          data: [],
          keys: new ojSet(),
          metadata: []
        };
      }

      detail[detailType].keys.add(detailItem.metadata.key);
      detail[detailType].data.push(detailItem.data);
      detail[detailType].metadata.push(detailItem.metadata);
    }
  }, {
    key: "resetUnsubmittedItem",
    value: function resetUnsubmittedItem(key) {
      var _this7 = this;

      var unsubmittedItems = this.editBuffer.getUnsubmittedItems();
      var keySet = new ojSet();
      var editItemMap = new ojMap(); // Remove the reset items from buffer and fire submittableChange event

      var editItem = unsubmittedItems.get(key);

      if (editItem) {
        keySet.add(key); // Delete the entry from the buffer but keep it in a temporary map

        editItemMap.set(key, editItem);
        unsubmittedItems.delete(key);
      }

      this._dispatchSubmittableChangeEvent(); // Refetch the reset items and fire mutate event so that consumer have the original data


      this.dataProvider.fetchByKeys({
        keys: keySet
      }).then(function (resultObj) {
        var detail = {};
        var resultItem;
        editItemMap.forEach(function (editItem, key) {
          if (editItem.operation === 'add') {
            // If we reset an "add" entry, fire mutate event with remove detail.
            _this7._addEventDetail(detail, 'remove', editItem.item);
          } else if (editItem.operation === 'remove') {
            // If we reset a "remove" entry, fire mutate event with add detail,
            // unless the underlying data no longer exists, in which case we don't do anything.
            resultItem = resultObj.results.get(key);

            if (resultItem) {
              _this7._addEventDetail(detail, 'add', resultItem);
            }
          } else {
            // If we reset an "update" entry, fire mutate event with update detail,
            // unless the underlying data no longer exists, in which case we fire mutate event with remove detail
            resultItem = resultObj.results.get(key);

            if (resultItem) {
              _this7._addEventDetail(detail, 'update', resultItem);
            } else {
              _this7._addEventDetail(detail, 'remove', editItem.item);
            }
          }
        });

        _this7.dispatchEvent(new __DataProvider.DataProviderMutationEvent(detail));
      });
    }
  }, {
    key: "setItemStatus",
    value: function setItemStatus(editItem, newStatus, error) {
      if (editItem) {
        this.editBuffer.setItemStatus(editItem, newStatus, error); // If any item is changing status, we may have submittable items.
        // Call _dispatchSubmittableChangeEvent, which will figure out if we need to fire submittableChange event.

        this._dispatchSubmittableChangeEvent();
      }
    }
  }, {
    key: "_dispatchSubmittableChangeEvent",
    value: function _dispatchSubmittableChangeEvent() {
      // Fire the submittableChange event if the number of submittable item has changed
      var submittable = this.getSubmittableItems();

      if (submittable.length !== this.lastSubmittableCount) {
        this.lastSubmittableCount = submittable.length;
        var event = new BufferingDataProviderSubmittableChangeEvent(submittable);
        this.dispatchEvent(event);
      }
    } // Return the index of key in a metadata array

  }, {
    key: "_findKeyInMetadata",
    value: function _findKeyInMetadata(key, metadata) {
      if (metadata) {
        for (var i = 0; i < metadata.length; i++) {
          if (oj.KeyUtils.equals(key, metadata[i].key)) {
            return i;
          }
        }
      }

      return -1;
    }
  }, {
    key: "_initDetailProp",
    value: function _initDetailProp(detail, newDetail, propName, initValue) {
      if (detail[propName]) {
        newDetail[propName] = initValue;
      }
    }
  }, {
    key: "_pushDetailProp",
    value: function _pushDetailProp(detail, newDetail, propName, idx) {
      if (detail[propName]) {
        newDetail[propName].push(detail[propName][idx]);
      }
    } // Get the operation detail from underlying mutate event and create new detail that excludes items that are submitting.
    // The "indexes" property is also excluded from the new detail since it's optional and the original indexes could be wrong
    // due to "add" operations in the buffer.
    // If "isRemoveDetail" is true, also delete unsubmitted remove and update items that have the same keys as the mutated items because
    // the underlying data items no longer exist.

  }, {
    key: "_getOperationDetail",
    value: function _getOperationDetail(detail, isRemoveDetail) {
      var _this8 = this;

      if (detail) {
        var newDetail = {};
        var submittingItems = this.editBuffer.getSubmittingItems();
        var unsubmittedItems = this.editBuffer.getUnsubmittedItems();

        if (submittingItems.size === 0 && unsubmittedItems.size === 0) {
          // If no item is buffered, simply use the underlying operation detail except indexes.
          this._initDetailProp(detail, newDetail, 'data', detail.data);

          this._initDetailProp(detail, newDetail, 'metadata', detail.metadata);

          this._initDetailProp(detail, newDetail, 'addBeforeKeys', detail.addBeforeKeys);

          this._initDetailProp(detail, newDetail, 'parentKeys', detail.parentKeys);
        } else {
          newDetail.keys = new ojSet();

          this._initDetailProp(detail, newDetail, 'data', []);

          this._initDetailProp(detail, newDetail, 'metadata', []);

          this._initDetailProp(detail, newDetail, 'addBeforeKeys', []);

          this._initDetailProp(detail, newDetail, 'parentKeys', []);

          detail.keys.forEach(function (key) {
            // Skip the mutation if:
            // 1. The key is in the submitting buffer, because the mutation should be coming from
            //    the data source when the item is committed.  We would have already fired the mutate
            //    event when the item was first added to the buffer.
            // 2. The key is in the unsubmitted buffer as removed item. Skip any mutation because
            //    the item does not exist from this dataprovider's perspective.
            var skipItem = submittingItems.get(key) != null;

            if (!skipItem) {
              var editItem = unsubmittedItems.get(key);
              skipItem = editItem && editItem.operation === 'remove';
            }

            if (!skipItem) {
              newDetail.keys.add(key);

              if (detail.metadata) {
                var idx = _this8._findKeyInMetadata(key, detail.metadata);

                if (idx > -1) {
                  _this8._pushDetailProp(detail, newDetail, 'data', idx);

                  _this8._pushDetailProp(detail, newDetail, 'metadata', idx);

                  _this8._pushDetailProp(detail, newDetail, 'addBeforeKeys', idx);

                  _this8._pushDetailProp(detail, newDetail, 'parentKeys', idx);
                }
              }
            } // delete unsubmitted remove and update items for keys that are removed from underlying data


            if (isRemoveDetail) {
              var _editItem = unsubmittedItems.get(key);

              if (_editItem && (_editItem.operation === 'remove' || _editItem.operation === 'update')) {
                unsubmittedItems.delete(key);
              }
            }
          });
          return newDetail;
        }
      }

      return detail;
    } // Handle refresh event from underlying DataProvider

  }, {
    key: "_handleRefreshEvent",
    value: function _handleRefreshEvent(event) {
      var _this9 = this;

      // If we get a refresh event from the underlying DataProvider, check to see if the
      // unsubmitted remove and update edits still exist in the underlying DataProvider
      var unsubmittedItems = this.editBuffer.getUnsubmittedItems();
      var keySet = new ojSet();
      unsubmittedItems.forEach(function (editItem) {
        if (editItem.operation === 'remove' || editItem.operation === 'update') {
          keySet.add(editItem.item.metadata.key);
        }
      });

      if (keySet.size > 0) {
        this.dataProvider.fetchByKeys({
          keys: keySet
        }).then(function (resultObj) {
          resultObj.results.forEach(function (item, key) {
            keySet.delete(key);
          }); // keySet now contains the keys of remove and update edits that no longer exist in the underlying DataProvider,
          // so we remove them from the buffer.

          keySet.forEach(function (key) {
            unsubmittedItems.delete(key);
          }); // Fire the refresh event after we have cleaned up the buffer

          _this9.dispatchEvent(event);
        });
      } else {
        // Fire the refresh event if we don't need to clean up the buffer
        this.dispatchEvent(event);
      }
    } // Handle mutate event from underlying DataProvider

  }, {
    key: "_handleMutateEvent",
    value: function _handleMutateEvent(event) {
      var _this10 = this;

      // Fix up the merged arrays
      if (event.detail.remove) {
        event.detail.remove.keys.forEach(function (key) {
          _this10._removeFromMergedArrays(key);
        });
      }

      var detailAdd = event.detail.add;

      if (detailAdd && detailAdd.metadata && detailAdd.data) {
        detailAdd.metadata.forEach(function (metadata, idx) {
          _this10._addToMergedArrays({
            metadata: detailAdd.metadata[idx],
            data: detailAdd.data[idx]
          });
        });
      }

      var newAddDetail = this._getOperationDetail(event.detail.add, false);

      var newRemoveDetail = this._getOperationDetail(event.detail.remove, true);

      var newUpdateDetail = this._getOperationDetail(event.detail.update, false);

      var newEventDetail = {
        add: newAddDetail,
        remove: newRemoveDetail,
        update: newUpdateDetail
      };
      this.dispatchEvent(new __DataProvider.DataProviderMutationEvent(newEventDetail));
    }
    /**
     * Add event listeners
     */

  }, {
    key: "_addEventListeners",
    value: function _addEventListeners(dataprovider) {
      dataprovider[BufferingDataProvider._ADDEVENTLISTENER](BufferingDataProvider._REFRESH, this._handleRefreshEvent.bind(this));

      dataprovider[BufferingDataProvider._ADDEVENTLISTENER](BufferingDataProvider._MUTATE, this._handleMutateEvent.bind(this));
    }
  }]);

  return BufferingDataProvider;
}();

BufferingDataProvider._REFRESH = 'refresh';
BufferingDataProvider._MUTATE = 'mutate';
BufferingDataProvider._ADDEVENTLISTENER = 'addEventListener';
oj['BufferingDataProvider'] = BufferingDataProvider;
oj.EventTargetMixin.applyMixin(BufferingDataProvider);

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


var BufferingDataProviderSubmittableChangeEvent = /*#__PURE__*/function (_GenericEvent) {
  _inherits(BufferingDataProviderSubmittableChangeEvent, _GenericEvent);

  var _super = _createSuper(BufferingDataProviderSubmittableChangeEvent);

  function BufferingDataProviderSubmittableChangeEvent(detail) {
    _classCallCheck(this, BufferingDataProviderSubmittableChangeEvent);

    var eventOptions = {};
    eventOptions['detail'] = detail;
    return _super.call(this, 'submittableChange', eventOptions);
  }

  return BufferingDataProviderSubmittableChangeEvent;
}(GenericEvent);



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 *
 * @since 9.0.0
 * @export
 * @final
 * @class BufferingDataProvider
 * @ojtsmodule
 * @implements DataProvider
 * @classdesc
 * <p>BufferingDataProvider is a wrapping DataProvider that provides edit buffering for an underlying DataProvider, so that
 * the edits can be committed to the data source later on.
 * The underlying DataProvider is responsible for fetchting data, and BufferingDataProvider will merge any buffered edits with
 * the underlying data so that they appear as an unified set of data.
 * </p>
 * <p>Because all edits are tracked by keys, the underlying DataProvider must return unique keys in the metadata.  If new rows
 * are added, unique keys must be specified for the new rows.
 * </p>
 * <p>In addition to the methods in the DataProvider interface, BufferingDataProvider implements a set of methods for managing edits:
 * <ul>
 *   <li>addItem</li>
 *   <li>removeItem</li>
 *   <li>updateItem</li>
 *   <li>getSubmittableItems</li>
 *   <li>resetAllUnsubmittedItems</li>
 *   <li>resetUnsubmittedItem</li>
 *   <li>setItemStatus</li>
 * </ul>
 * </p>
 * <p>In a typical usage scenario, an application will:
 * <ol>
 *   <li>Create an instance of the underlying DataProvider that provides the actual data.
 *   <li>Create an instance of BufferingDataProvider, passing the underlying DataProvider instance and any options.
 *   <li>Call "addItem", "removeItem", and "updateItem" on the BufferingDataProvider instance to create edit items, usually in response
 *       to user interactions.  These methods correspond to the basic data operations.  Buffer entries will be created for the edit items
 *       with a status of "unsubmitted".
 *   <li>When ready to submit the edits, call "getSubmittableItems" to get the list of submittable edit items.
 *   <li>Call "setItemStatus" to set the edit items' status to "submitting".
 *   <li>Submit the actual data to the data source and wait for its completion.  How this is done is up to the application and dependent
 *       on the data source.
 *   <li>If the submission is successful, call "setItemStatus" to set the edit items' status to "submitted".
 *       If the submission is unsuccessful, call "setItemStatus" to set the edit items' status
 *       to "unsubmitted" and pass error messages if available.
 *   <li>Show the error messages to the user if needed.
 * </ol>
 * </p>
 * <p>In general, the edit item data should have the same shape as the data in the underlying DataProvider.
 * </p>
 * <p>If sorting and filtering is used in the underlying DataProvider, the application should ensure that all attributes referenced in the
 * sort criterion and filter criterion are included in the item data.  If there is a sortCriteria, added items are merged with the
 * underlying data based on the sortCriteria.  If there is no sortCriteria, added items are inserted at the
 * beginning of the underlying data.  Furthermore, iterators obtained by fetchFirst must all use the same sortCriteria
 * if the application is using those iterators at the same time.
 * </p>
 * <p>BufferingDataProvider does not validate the item key and data.  It is up to the application to perform any validation
 * prior to creating edit items in the buffer.
 * </p>
 *
 * <h3 id="events-section">
 *   Events
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
 * </h3>
 * Consumers can add event listeners to listen for the following event types and respond to data change.
 * <h4 id="event:mutate" class="name">
 *   mutate
 * </h4>
 * This event is fired when items have been added or removed from the data.
 * <p>
 * Event payload is found under <code class="prettyprint">event.detail</code>, which implements the {@link DataProviderMutationEventDetail} interface.
 * </p>
 *
 * <h4 id="event:refresh" class="name">
 *   refresh
 * </h4>
 * This event is fired when the data has been refreshed and components need to re-fetch the data.
 * <p>
 * This event contains no additional event payload.
 * </p>
 *
 * <h4 id="event:submittableChange" class="name">
 *   submittableChange
 * </h4>
 * This event is fired when the number of submittable edit items has changed.  An edit item is submittable if it is in "unsubmitted"
 * status and there is no other edit item with the same key in "submitting" status.
 * <p>
 * Event payload is found under <code class="prettyprint">event.detail</code>, which is array of objects that implement the {@link EditItem} interface.
 * </p>
 *
 * <i>Example of consumer listening for the "submittableChange" event type:</i>
 * <pre class="prettyprint"><code>var listener = function(event) {
 *   var editItems = event.detail;
 *   console.log("Number of submittable edit items: " + editItems.length);
 * };
 * dataProvider.addEventListener("submittableChange", listener);
 * </code></pre>
 *
 * @param {DataProvider} dataProvider The underlying DataProvider that provides the original data.
 * @param {Object=} options Options for the underlying DataProvider.
 * @ojsignature [{target: "Type",
 *               value: "class BufferingDataProvider<K, D> implements DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of key"}, {"name": "D", "description": "Type of data"}]},
 *               {target: "Type",
 *               value: "DataProvider<K, D>",
 *               for: "dataProvider"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults", "DataMapping",
 *   "FetchListResult","FetchListParameters", "FetchAttribute", "DataFilter", "Item", "ItemWithOptionalData", "ItemMessage"]}
 */

/**
 * @inheritdoc
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * @inheritdoc
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name createOptimizedKeySet
 */

/**
 * @inheritdoc
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name createOptimizedKeyMap
 */

/**
 * @inheritdoc
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name fetchFirst
 */

/**
 * @inheritdoc
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * @inheritdoc
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * @inheritdoc
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * @inheritdoc
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * @inheritdoc
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * @inheritdoc
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @inheritdoc
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @inheritdoc
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 */

/**
 * Create a buffer entry for adding a row.  The entry initially has a status of 'unsubmitted'.
 * <p>
 * If a "remove" entry already exists:
 * <ol>
 * <li>
 * If the "remove" entry does not have data, it will be changed to an "update" entry with the new data.
 * </li><li>
 * If the "remove" entry has data, it will be compared to the new data passed to this method.<br>
 *      If the data are the same, the "remove" entry will be removed and no new entry will be created.<br>
 *      If the data are different, the "remove" entry will be changed to an "update" entry with the new data.
 * </li>
 * </ol>
 * </p><p>
 * Application can call setItemStatus to change the status of the entry to 'submitting' or 'submitted'.
 * There can be at most one entry in 'unsubmitted' status and one entry in 'submitting' status with the same key.  This
 * allows application to keep track of additional changes to a row while submitting previous changes.
 * </p>
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name addItem
 * @param {Item<K, D>} item - an Item object that represents the row.
 * @throws {Error} if an "add" or "update" entry already exists for the same key.
 * @ojsignature {target: "Type",
 *               value: "(item: Item<K, D>): void"}
 */

/**
 * Create a buffer entry for removing a row.  The entry initially has a status of 'unsubmitted'.
 * <p>
 * If an "add" entry already exists, it will be deleted.<br>
 * If an "update" entry already exists, it will be changed to a "remove" entry.
 * </p><p>
 * Application can call setItemStatus to change the status of the entry to 'submitting' or 'submitted'.
 * There can be at most one entry in 'unsubmitted' status and one entry in 'submitting' status with the same key.  This
 * allows application to keep track of additional changes to a row while submitting previous changes.
 * </p>
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name removeItem
 * @param {ItemWithOptionalData} item - an ItemWithOptionalData object that represents the row.
 * @throws {Error} if a "remove" entry already exists for the same key.
 * @ojsignature {target: "Type",
 *               value: "(item: ItemWithOptionalData<K, D>): void"}
 */

/**
 * Create a buffer entry for updating a row.  The entry initially has a status of 'unsubmitted'.
 * <p>
 * If an "add" or "update" entry already exists, the data of the entry will be changed.
 * </p><p>
 * Application can call setItemStatus to change the status of the entry to 'submitting' or 'submitted'.
 * There can be at most one entry in 'unsubmitted' status and one entry in 'submitting' status with the same key.  This
 * allows application to keep track of additional changes to a row while submitting previous changes.
 * </p>
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name updateItem
 * @param {Item<K, D>} item - an Item object that represents the row.
 * @throws {Error} if a "remove" entry already exists for the same key.
 * @ojsignature {target: "Type",
 *               value: "(item: Item<K, D>): void"}
 */

/**
 * Get the list of all submittable edit items.
 * <p>
 * Caller should call setItemStatus to change the status
 * to "submitting" when ready to submit.  Once the edit item for a key is moved to 'submitting', new edit for the same
 * key will be tracked separately.  There can be at most one "submitting" edit item and one "unsubmitted" edit item for the same key.
 * </p>
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name getSubmittableItems
 * @return {Array<BufferingDataProvider.EditItem<K, D>>} an array of all submittable edit items.  Each edit item implements the {@link EditItem} interface.
 * @ojsignature {target: "Type",
 *               value: "(): Array<BufferingDataProvider.EditItem<K, D>>"}
 */

/**
 * Reset all rows by discarding all 'unsubmitted' edit items, so that the data from the underlying
 * DataProvider will be used.
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name resetAllUnsubmittedItems
 */

/**
 * Reset a row by discarding any 'unsubmitted' edit item for the row, so that the data from the underlying
 * DataProvider will be used.
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name resetUnsubmittedItem
 * @param {K} key - The key of the row to reset.
 * @ojsignature {target: "Type",
 *               value: "(key: K): void"}
 */

/**
 * Set the status of an edit item.
 * <p>
 * Application should set an edit item to 'submitting' before committing its change to the data source.  This will prevent
 * any new edit item with the same key from being changed to 'submitting'.
 * </p><p>
 * When setting an edit item from 'submitting' back to 'unsubmitted' (usually upon submission error),
 * and there is another 'unsubmitted' entry for the same key (this happens when edit is allowed while an edit item is submitting),
 * the error will be set on the new 'unsubmitted' entry and the current 'submitting' entry will be disposed.
 * </p><p>
 * when setting an edit item to 'submitted', the edit item will be removed from the buffer.
 * </p>
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name setItemStatus
 * @param {BufferingDataProvider.EditItem<K, D>} editItem - The edit item to set status on.  This should implement the {@link EditItem} interface and is
 *   usually one of the items returned by the getSubmittableItems method.
 * @param {'unsubmitted' | 'submitting' | 'submitted'} newStatus - the new status of the edit item.
 *   If an edit item is marked as "submitted", it will be removed at the DataProvider's discretion.
 * @param {ItemMessage?} error - an optional error message.
 * @ojsignature {target: "Type",
 *               value: "(editItem: BufferingDataProvider.EditItem<K, D>, newStatus: 'unsubmitted' | 'submitting' | 'submitted', error?: ItemMessage): void"}
 */

/**
 * End of jsdoc
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var EditBuffer = /*#__PURE__*/function () {
  function EditBuffer() {
    _classCallCheck(this, EditBuffer);

    this.unsubmittedItems = new ojMap();
    this.submittingItems = new ojMap();
  }

  _createClass(EditBuffer, [{
    key: "addItem",
    value: function addItem(item) {
      var unsubmitted = this.unsubmittedItems.get(item.metadata.key);
      var submitting = this.submittingItems.get(item.metadata.key);

      if (unsubmitted && (unsubmitted.operation === 'add' || unsubmitted.operation === 'update') || submitting && (submitting.operation === 'add' || submitting.operation === 'update')) {
        // It's an error if we add an item that's being added or updated
        throw new Error('Cannot add item with same key as an item being added or updated');
      } else if (unsubmitted && unsubmitted.operation === 'remove') {
        // If we add an item that's being remove and...
        if (unsubmitted.item.data && oj.Object.compareValues(unsubmitted.item.data, item.data)) {
          // the data is the same, simply delete the "remove" entry
          this.unsubmittedItems.delete(item.metadata.key);
        } else {
          // the data is different, change the "remove" entry to an "update" entry
          this.unsubmittedItems.set(item.metadata.key, {
            operation: 'update',
            item: item
          });
        }

        return;
      }

      this.unsubmittedItems.set(item.metadata.key, {
        operation: 'add',
        item: item
      });
    }
  }, {
    key: "removeItem",
    value: function removeItem(item) {
      var unsubmitted = this.unsubmittedItems.get(item.metadata.key);
      var submitting = this.submittingItems.get(item.metadata.key);

      if (unsubmitted && unsubmitted.operation === 'remove' || submitting && submitting.operation === 'remove') {
        // It's an error if we remove an item that's being removed
        throw new Error('Cannot remove item with same key as an item being removed');
      } else if (unsubmitted && unsubmitted.operation === 'add') {
        // If we remove an item that's being added but unsubmitted, just remove it from the buffer as if it never exists
        this.unsubmittedItems.delete(item.metadata.key);
        return;
      } else if (unsubmitted && unsubmitted.operation === 'update') {
        // If we remove an item that's being updated but unsubmitted, mark it for remove instead
        this.unsubmittedItems.set(item.metadata.key, {
          operation: 'remove',
          item: item
        });
        return;
      }

      this.unsubmittedItems.set(item.metadata.key, {
        operation: 'remove',
        item: item
      });
    }
  }, {
    key: "updateItem",
    value: function updateItem(item) {
      var unsubmitted = this.unsubmittedItems.get(item.metadata.key);
      var submitting = this.submittingItems.get(item.metadata.key);

      if (unsubmitted && unsubmitted.operation === 'remove' || submitting && submitting.operation === 'remove') {
        // It's an error if we update an item that's being removed
        throw new Error('Cannot update item with same key as an item being removed');
      } else if (unsubmitted && (unsubmitted.operation === 'add' || unsubmitted.operation === 'update')) {
        // If we update an item that's being added or updated but unsubmitted, it's the same operation with different data
        this.unsubmittedItems.set(item.metadata.key, {
          operation: unsubmitted.operation,
          item: item
        });
        return;
      }

      this.unsubmittedItems.set(item.metadata.key, {
        operation: 'update',
        item: item
      });
    }
  }, {
    key: "setItemStatus",
    value: function setItemStatus(editItem, newStatus, error) {
      var key = editItem.item.metadata.key;

      if (newStatus === 'submitting') {
        this.unsubmittedItems.delete(key);
        this.submittingItems.set(key, editItem);
      } else if (newStatus === 'submitted') {
        this.submittingItems.delete(key);
      } else if (newStatus === 'unsubmitted') {
        this.submittingItems.delete(key);
        var newEditItem;

        if (error) {
          newEditItem = {
            operation: editItem.operation,
            item: {
              data: editItem.item.data,
              metadata: {
                key: editItem.item.metadata.key,
                message: error
              }
            }
          };
        } else {
          newEditItem = editItem;
        }

        this.unsubmittedItems.set(key, newEditItem);
      }
    }
  }, {
    key: "getUnsubmittedItems",
    value: function getUnsubmittedItems() {
      return this.unsubmittedItems;
    }
  }, {
    key: "getSubmittingItems",
    value: function getSubmittingItems() {
      return this.submittingItems;
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.unsubmittedItems.size === 0 && this.submittingItems.size === 0;
    } // Get an unsubmitted or submitting EditItem by key.

  }, {
    key: "getItem",
    value: function getItem(key) {
      var editItem = this.unsubmittedItems.get(key);

      if (!editItem) {
        editItem = this.submittingItems.get(key);
      }

      return editItem;
    }
  }]);

  return EditBuffer;
}();





/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for EditItem
 *
 *
 * @since 9.0.0
 * @export
 * @interface EditItem
 * @ojtsnamespace BufferingDataProvider
 * @ojsignature {target: "Type",
 *               value: "interface EditItem<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 */

/**
 * The type of buffered edit.
 * <p>
 * Possible values are:<ul>
 * <li>'add': The edit is for adding a new item to the data source.</li>
 * <li>'remove': The edit is for removing an existing item from the data source.</li>
 * <li>'update': The edit is for updating an existing item from the data source.</li>
 * </ul>
 * </p>
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof EditItem
 * @instance
 * @readonly
 * @name operation
 * @type {'add' | 'remove' | 'update'}
 * @ojsignature {target: "Type",
 *               value: "'add' | 'remove' | 'update'"}
 */

/**
 * The Item object that represents the edited item.
 *
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof EditItem
 * @instance
 * @readonly
 * @name item
 * @type {ItemWithOptionalData<K, D>}
 * @ojsignature {target: "Type",
 *               value: "ItemWithOptionalData<K, D>"}
 */

/**
 * End of jsdoc
 */

  return BufferingDataProvider;
});