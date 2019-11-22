/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */


define(['ojs/ojcore', 'jquery', 'ojs/ojcontext', 'ojs/ojconfig', 'ojs/ojcomponentcore', 'ojs/ojattributegrouphandler', 'ojs/ojlocaledata', 'ojs/internal-deps/dvt/DvtToolkit', 'ojs/ojkeysetimpl', 'ojs/ojmap', 'ojs/ojlogger', 'ojdnd'], 
function(oj, $, Context, Config, Components, attributeGroupHandler, LocaleData, dvt, KeySetImpl, ojMap, Logger)
{
  "use strict";


/* global attributeGroupHandler:false */
// bleed the 3 AttributeGroupHandler classes into the oj namespace for brackward compatibility
oj.AttributeGroupHandler = attributeGroupHandler.AttributeGroupHandler;
oj.ColorAttributeGroupHandler = attributeGroupHandler.ColorAttributeGroupHandler;
oj.ShapeAttributeGroupHandler = attributeGroupHandler.ShapeAttributeGroupHandler;



/* global Promise:false, Map:false, Symbol:false, KeySetImpl:false, ojMap:false */

/**
* Handler for DataProvider generated content for chart
* @constructor
* @ignore
*/
var DataProviderHandler = function DataProviderHandler(component, configs) {
  this._component = component;
  this._configMap = configs;

  this._init();
}; // Subclass from oj.Object


oj.Object.createSubclass(DataProviderHandler, oj.Object, 'DataProviderHandler');
/**
 * Initializes the instance.
 * @private
 */

DataProviderHandler.prototype._init = function () {
  this._dataProviderEventListeners = {};
  this._keyDataMap = {};
  this._fetchedData = {};
  this._eventListeners = [];
};
/**
 * Returns a promise that resolves into the fully fetched data from the data provider.
 * This handles the use case where fetch parameter -1 doesn't return all the data
 * @param {object} dataProvider The data provider
 * @param {object} postprocessor The call back functon that should return a promise that resolves into row data of the shape {data: , key: }
 * @param {string} dataProperty The property name of the data API
 * @param {object} parentKey The parent key if the dataProvider is a child dataProvider
 * @param {number} fetchDepth The current fetch depth
 * @param {number} maxFetchDepth The maximum fetch depth
 * @return {Promise} Returns a promise that resolves into the fully fetched data from the data provider.
 * @private
 * @instance
 * @memberof oj.dvtBaseComponent
 */


DataProviderHandler.prototype._fetchCollection = function (dataProvider, postprocessor, dataProperty, parentKey, fetchDepth, maxFetchDepth) {
  var self = this;
  var finalData = {
    data: [],
    keys: []
  };

  if (maxFetchDepth <= -1) {
    return Promise.resolve(finalData);
  }

  var iterator = dataProvider.fetchFirst({
    size: -1
  })[Symbol.asyncIterator]();
  var isTreeDataProvider = this.isTreeDataProvider(dataProvider); // Helper function to handle case where fetch parameter -1 doesn�t return all the data

  var chunkDataFetch = function chunkDataFetch(result) {
    var nodePromises = [];

    for (var i = 0; i < result.value.data.length; i++) {
      var nodePromise = postprocessor({
        data: result.value.data[i],
        key: result.value.metadata[i].key
      }, fetchDepth);
      nodePromises.push(nodePromise);
    }

    var chunkPromise = Promise.all(nodePromises).then(function (values) {
      for (var ii = 0; ii < values.length; ii++) {
        var data = values[ii].data;
        var key = values[ii].key;
        finalData.data.push(data);
        finalData.keys.push(key);

        self._keyDataMap[dataProperty].set(isTreeDataProvider ? key.value : key, {
          data: data,
          key: key,
          parentKey: parentKey,
          depth: fetchDepth
        });
      }
    });
    return chunkPromise.then(function () {
      if (!result.done) {
        return iterator.next().then(chunkDataFetch);
      }

      return Promise.resolve(finalData);
    });
  }; // create a Promise that will resolve to the fetched data


  return iterator.next().then(chunkDataFetch);
};
/**
 * Returns a function that returns a promise that resolves into row data of the shape {data: , key: }
 * For tree data providers, data and keys will have children information
 * @param {object} dataProvider The data provider
 * @param {string} dataProperty The property name of the data API
 * @param {oj.KeySet} expandedKeySet The key set with the expanded keys
 * @param {number} maxFetchDepth The maximum fetch depth
 * @return {object} Returns a function that returns a promise that resolves into row data of the shape {data: , key: }
 * @private
 * @instance
 * @memberof oj.dvtBaseComponent
 */


DataProviderHandler.prototype._getDPPostProcessor = function (dataProvider, dataProperty, expandedKeySet, maxFetchDepth) {
  var self = this;
  var isTreeDataProvider = this.isTreeDataProvider(dataProvider); // eslint-disable-next-line no-param-reassign

  maxFetchDepth = maxFetchDepth == null ? Number.MAX_VALUE : maxFetchDepth;

  var treeDPPostProcessor = function treeDPPostProcessor(row, fetchDepth) {
    var data = {
      value: row.data
    };
    var key = {
      value: row.key
    };

    if (fetchDepth < maxFetchDepth && expandedKeySet && expandedKeySet.has(key.value)) {
      var childDataProvider = dataProvider.getChildDataProvider(key.value);

      if (childDataProvider) {
        return self._fetchCollection(childDataProvider, treeDPPostProcessor, dataProperty, key.value, fetchDepth + 1).then(function (children) {
          data.children = children.data;
          key.children = children.keys;
          return {
            data: data,
            key: key
          };
        });
      }
    }

    return Promise.resolve({
      data: data,
      key: key
    });
  };

  var flatDPPostProcessor = function flatDPPostProcessor(value) {
    return Promise.resolve(value);
  };

  return isTreeDataProvider ? treeDPPostProcessor : flatDPPostProcessor;
};
/**
 * Returns a promise that resolves into all the fetched data from the data provider of the shape {data: [], keys: []}
 * For non tree data providers, the data array will have all the data fetched in the shape that was returned by the data provider. This will be the same for the keys array.
 * For tree data providers, the objects in the data and key arrays will have a value attribute and a childrenData/childrenKeys attribute. The value property will have the data returned by the data provider.
 * @param {object} dataProvider The data provider
 * @param {string} dataProperty The property name of the data API
 * @param {boolean} isRoot If true, a cache for the data is used.
 * @return {Promise} Returns a promise that resolves into the results of the data fetch with the shape {data: [], keys: []}
 * @public
 * @instance
 * @memberof oj.dvtBaseComponent
 */


DataProviderHandler.prototype.fetchAllData = function (dataProvider, dataProperty, isRoot) {
  if (isRoot && this._fetchedData[dataProperty]) {
    return Promise.resolve(this._fetchedData[dataProperty]);
  }

  var configs = this._configMap[dataProperty];
  this.clear(dataProperty, true);

  var fetchedDataPromise = this._fetchCollection(dataProvider, this._getDPPostProcessor(dataProvider, dataProperty, configs.expandedKeySet, configs.maxFetchDepth), dataProperty, null, 0, configs.maxFetchDepth).then(function (fetchedData) {
    if (isRoot) {
      this._fetchedData[dataProperty] = fetchedData;

      this._addDPEventListeners(dataProvider, dataProperty);
    }

    return fetchedData;
  }.bind(this));

  return fetchedDataPromise;
};
/**
 * Returns a function that will handle events triggered on the component's
 * dataProvider(s) and update the component
 * @private
 * @instance
 * @memberof oj.dvtBaseComponent
 * @return {function(Event):void} A function that takes an event and updates a component
 * using the data from the data provider it is binded to.
 */


DataProviderHandler.prototype._getDataProviderEventHandler = function (dataProperty) {
  var self = this; // returns indices corresponding to the data with the given keys

  var keysToIndices = function keysToIndices(fullData, keys, isTreeDataProvider) {
    if (!keys) {
      return [];
    }

    var keySet = new KeySetImpl(keys);
    var keyIndexMap = new Map();

    var addToKeyIndexMap = function addToKeyIndexMap(dataKeys) {
      for (var i = 0; i < dataKeys.length; i++) {
        var key = isTreeDataProvider ? dataKeys[i].value : dataKeys[i];
        var eventKey = keySet.get(key);

        if (eventKey !== keySet.NOT_A_KEY) {
          keyIndexMap.set(eventKey, i);
        }

        if (isTreeDataProvider && dataKeys[i].children) {
          addToKeyIndexMap(dataKeys[i].children);
        }
      }
    };

    addToKeyIndexMap(fullData.keys);
    var matchingIndices = [];
    keys.forEach(function (keyValue) {
      matchingIndices.push(keyIndexMap.get(keyValue));
    });
    return matchingIndices;
  }; // rerenders the component with updated data


  var renderUpdatedData = function renderUpdatedData(dataPromise) {
    Promise.all([dataPromise]).then(function (values) {
      // Reset cached data so that the templates would be reprocessed for the new data
      self._fireEvent('clearState', {
        dataProperty: dataProperty
      });

      self._fetchedData[dataProperty] = values[0]; // Rerender component

      self._fireEvent('dataUpdated', {
        data: values[0]
      });
    });
  };

  return function (event) {
    self._fireEvent('notReady', {
      event: event
    }); // create a Promise that will resolve to the newly modified data


    var dataProvider = this;
    var isTreeDataProvider = self.isTreeDataProvider(dataProvider);
    var keyDataMap = self._keyDataMap[dataProperty];

    if (event.type === 'refresh') {
      renderUpdatedData(self.fetchAllData(dataProvider, dataProperty));
    } else if (event.type === 'mutate') {
      var updateDetail = event.detail.update;
      var removeDetail = event.detail.remove;
      var addDetail = event.detail.add;
      var componentData = self._fetchedData[dataProperty]; // used by add, update and delete to update the component's data

      var updateComponentData = function updateComponentData(indices, detail, deleteCount, isDelete) {
        var index = 0;
        var promises = [];
        var isUpdate = deleteCount === 1 && !isDelete;
        detail.keys.forEach(function (keyValue) {
          var dataPromise;
          var dataValue = isDelete ? null : detail.data[index];

          if (isTreeDataProvider) {
            if (isUpdate) {
              // update operation
              var mappedData = keyDataMap.get(keyValue);

              if (mappedData) {
                // only update data that has been previously fetched
                mappedData.data.value = dataValue;
                dataPromise = Promise.resolve({
                  data: mappedData.data,
                  key: keyDataMap.get(keyValue).key
                });
              }
            } else {
              // add or delete operation
              var data = {
                value: dataValue
              };
              var key = {
                value: keyValue
              };
              var childDataProvider = dataProvider.getChildDataProvider(keyValue); // fetch children data for add operations

              if (childDataProvider && !isDelete) {
                var childDataPromise = self.fetchAllData(childDataProvider, dataProperty);
                dataPromise = childDataPromise.then(function (result) {
                  data.children = result.data;
                  key.children = result.keys;
                  return {
                    data: data,
                    key: key
                  };
                });
              } else {
                dataPromise = Promise.resolve({
                  data: data,
                  key: key
                });
              }

              if (!isDelete) {
                var parentKey = detail.parentKeys ? detail.parentKeys[index] : null;
                keyDataMap.set(key.value, {
                  data: data,
                  key: key,
                  parentKey: parentKey
                });
              }
            }
          } else {
            dataPromise = Promise.resolve({
              data: dataValue,
              key: keyValue
            });
            keyDataMap.set(keyValue, {
              data: dataValue,
              key: keyValue
            });
          }

          promises.push(dataPromise);
          index += 1;
        });
        return Promise.all(promises).then(function (values) {
          for (var i = 0; i < values.length; i++) {
            var key = isTreeDataProvider ? values[i].key.value : values[i].key;
            var parentKey = keyDataMap.get(key).parentKey;
            var data;
            var keys;

            if (parentKey) {
              var mappedData = keyDataMap.get(parentKey); // if node is a new parent

              if (!mappedData.data.children && !isUpdate) {
                mappedData.data.children = [];
                mappedData.key.children = [];
              }

              data = mappedData.data.children;
              keys = mappedData.key.children;
            } else {
              // top level operation
              data = componentData.data;
              keys = componentData.keys;
            }

            var _index;

            if (isDelete) {
              _index = indices[i] - i; // "- i" accounts for previously processed operations

              data.splice(_index, deleteCount);
              keys.splice(_index, deleteCount);
            } else {
              if (!isUpdate) {
                // Add Operation
                // if no indices add to the end
                var noIndex = indices.length === 0 || indices[i] == null;
                _index = noIndex ? data.length : indices[i];
              } else {
                _index = indices[i];
              }

              data.splice(_index, deleteCount, values[i].data);
              keys.splice(_index, deleteCount, values[i].key);
            }
          }

          return componentData;
        });
      };

      var getData = function getData(keys) {
        return dataProvider.fetchByKeys({
          keys: keys
        }).then(function (keyResult) {
          var fetchedData = [];

          if (keyResult.results.size > 0) {
            keys.forEach(function (keyValue) {
              fetchedData.push(keyResult.results.get(keyValue).data);
            });
          }

          return fetchedData;
        });
      };

      var indices;
      var updatePromise = Promise.resolve();

      if (updateDetail) {
        indices = updateDetail.indexes || keysToIndices(componentData, updateDetail.keys, isTreeDataProvider);

        if (!Array.isArray(updateDetail.data)) {
          // data was not sent and should be fetched
          updatePromise = getData(updateDetail.keys).then(function (fetchedData) {
            var detail = Object.create(updateDetail, {
              data: {
                value: fetchedData
              }
            }); // add fetched data

            return updateComponentData(indices, detail, 1);
          });
        } else {
          updatePromise = updateComponentData(indices, updateDetail, 1);
        }
      }

      var removePromise = updatePromise.then(function () {
        if (removeDetail) {
          indices = removeDetail.indexes || keysToIndices(componentData, removeDetail.keys, isTreeDataProvider);
          return updateComponentData(indices, removeDetail, 1, true);
        }

        return Promise.resolve();
      });
      var addPromise = removePromise.then(function () {
        if (addDetail) {
          // afterKeys is deprecated, but continue to support it until we can remove it.
          // keysToIndices can take either array or set as its argument.
          indices = addDetail.indexes || keysToIndices(componentData, addDetail.addBeforeKeys ? addDetail.addBeforeKeys : addDetail.afterKeys, isTreeDataProvider);

          if (!Array.isArray(addDetail.data)) {
            // data was not sent and should be fetched
            return getData(addDetail.keys).then(function (fetchedData) {
              var detail = Object.create(addDetail, {
                data: {
                  value: fetchedData
                }
              }); // add fetched data

              return updateComponentData(indices, detail, 0);
            });
          }

          return updateComponentData(indices, addDetail, 0);
        }

        return Promise.resolve();
      });
      addPromise.then(function () {
        renderUpdatedData(Promise.resolve(componentData));
      });
    }
  };
};
/**
 * Checks for all potential dataProviders on the component and attaches event listeners
 * @private
 * @instance
 * @memberof oj.dvtBaseComponent
 */


DataProviderHandler.prototype._addDPEventListeners = function (dataProvider, dataProperty) {
  if (this._dataProviderEventListeners[dataProperty]) {
    return;
  }

  var dataProviderEventHandler = this._getDataProviderEventHandler(dataProperty);

  dataProvider.addEventListener('mutate', dataProviderEventHandler);
  dataProvider.addEventListener('refresh', dataProviderEventHandler);
  this._dataProviderEventListeners[dataProperty] = {
    dataProvider: dataProvider,
    listener: dataProviderEventHandler
  };
};
/**
 * Checks for all potential dataProviders on the component and removes event listeners
 * and clears stored data in caches
 * @private
 * @instance
 * @memberof oj.dvtBaseComponent
 */


DataProviderHandler.prototype.release = function (dataProperty) {
  var clearListeners = function (dpProp) {
    var info = this._dataProviderEventListeners[dpProp];

    if (info) {
      var dataProvider = info.dataProvider;
      var dataProviderEventHandler = info.listener;
      dataProvider.removeEventListener('mutate', dataProviderEventHandler);
      dataProvider.removeEventListener('refresh', dataProviderEventHandler);
      this._dataProviderEventListeners[dpProp] = null;
    }
  }.bind(this);

  if (dataProperty) {
    clearListeners(dataProperty);
    this.clear(dataProperty);
  } else {
    var dataProperties = Object.keys(this._dataProviderEventListeners);

    for (var i = 0; i < dataProperties.length; i++) {
      clearListeners(dataProperties[i]);
    }

    this.clear();
  }
};
/**
 * Creates a callback function that will be used to fetch additional data from data provider
 * Any sub class implementation of this should call this._super
 * @param {string} dataProperty The property name of the data API
 * @param {object} rootDataProvider The root data provider to fetch from
 * @param {object} nodeKey The parent key
 * @param {oj.KeySet} expandedKeySet The key set with the expanded keys
 * @return {Function} fetch data callback that uses root data provider, expanded key set, node data and node key
 * to retrieve child nodes for the specified parent node
 * @public
 * @instance
 * @memberof oj.dvtBaseComponent
 */


DataProviderHandler.prototype.fetchChildrenData = function (dataProperty, rootDataProvider, nodeKey, expandedKeySet) {
  // Updates cached the data provider state
  var updateDataProviderState = function (parentKey, data, keys) {
    this._keyDataMap[dataProperty].get(parentKey).data.children = data;
    this._keyDataMap[dataProperty].get(parentKey).key.children = keys;
  }.bind(this);

  var childDataProvider = rootDataProvider.getChildDataProvider(nodeKey);

  if (childDataProvider) {
    var maxFetchDepth = this._configMap[dataProperty].maxFetchDepth;

    var fetchLevel = this._keyDataMap[dataProperty].get(nodeKey).depth;

    var treeDPPostProcessor = this._getDPPostProcessor(rootDataProvider, dataProperty, expandedKeySet, maxFetchDepth);

    var childInfoPromise = this._fetchCollection(childDataProvider, treeDPPostProcessor, dataProperty, nodeKey, fetchLevel, maxFetchDepth);

    return childInfoPromise.then(function (values) {
      // update cached data provider state
      updateDataProviderState(nodeKey, values.data, values.keys);
      return values;
    });
  }

  return Promise.resolve({
    data: [],
    keys: []
  });
}; // todo: function description


DataProviderHandler.prototype.clear = function (dataProperty, isReset) {
  if (dataProperty && isReset) {
    // eslint-disable-next-line new-cap
    this._keyDataMap[dataProperty] = this._keyDataMap[dataProperty] || new ojMap();

    this._fireEvent('reset', {
      dataProperty: dataProperty
    });
  } else if (dataProperty) {
    this._fetchedData[dataProperty] = null;
  } else {
    this._fetchedData = {};
    this._keyDataMap = {};
  }
}; // todo: function description


DataProviderHandler.prototype.isDataProvider = function (dataprovider) {
  return oj.DataProviderFeatureChecker.isDataProvider(dataprovider);
}; // todo: function description


DataProviderHandler.prototype.isTreeDataProvider = function (dataprovider) {
  return oj.DataProviderFeatureChecker.isTreeDataProvider(dataprovider);
}; // todo: function description


DataProviderHandler.prototype.addEventListener = function (listener) {
  this._eventListeners.push(listener);
}; // todo: function description


DataProviderHandler.prototype._fireEvent = function (type, detail) {
  for (var i = 0; i < this._eventListeners.length; i++) {
    this._eventListeners[i]({
      type: type,
      detail: detail
    });
  }
};



/**
 * Utility class with functions for parsing common DVT attributes.
 * Currently the following DVT components are using it: ojchart, ojdiagram, ojgauge, ojnbox, ojthematicmap.
 * @ignore
 * @memberof oj.dvtBaseComponent
 * @private
 */
var DvtAttributeUtils = {}; // Consider a string with at least one digit a valid SVG path

DvtAttributeUtils._SHAPE_REGEXP = /\d/; // Default shape types supported by DvtSimpleMarker

DvtAttributeUtils._SHAPE_ENUMS = {
  circle: true,
  ellipse: true,
  square: true,
  rectangle: true,
  diamond: true,
  triangleUp: true,
  triangleDown: true,
  plus: true,
  human: true,
  star: true
};
/**
 * @ignore
 * @param {Object} shapeAttrs A map containing the shape attribute name which should be full path using dot notation.
 * @param {Array.<string>} shapeEnums The array of allowed enumerated values for the shape property of this component.
 * @return {function(string, string, Object, Function):string}
 */

DvtAttributeUtils.shapeParseFunction = function (shapeAttrs, shapeEnums) {
  var shapes = shapeEnums || DvtAttributeUtils._SHAPE_ENUMS;
  return function (value, name, meta, defaultParseFunction) {
    if (shapeAttrs[name]) {
      if (DvtAttributeUtils._SHAPE_REGEXP.test(value)) {
        return value;
      } else if (!shapes[value]) {
        throw new Error("Found: '" + value + "'. Expected one of the following: " + Object.keys(shapes).toString());
      } else {
        return value;
      }
    }

    return defaultParseFunction(value);
  };
};



/**
 * Class to help set css properties on the component root options object
 * @param {Object} object The root options object from which this path should be resolved
 * @param {string} path The string path within the options object to resolve
 * @protected
 * @constructor
 * @ignore
 */
var DvtJsonPath = function DvtJsonPath(object, path) {
  this._path = path;
  this._root = object;
  this._delimiter = '/';
};
/**
 * Resolves the parameter of the leaf object and the leaf object itself
 * @param {Object} root The root object to update
 * @param {string} path The string path within the root object to resolve
 * @param {string} delimiter The string delimiter for the path string
 * @param {boolean} createIfMissing Flag to create the hierarchy of the namespaces if they do not exist
 * @return {Object} The resolved parameter
 * @private
 */


DvtJsonPath.prototype._resolveLeafObjectAndProperty = function (root, path, delimiter, createIfMissing) {
  var result = {};

  while (root && path.indexOf(delimiter) > -1) {
    var subProperty = path.substring(0, path.indexOf(delimiter));

    if (createIfMissing && root[subProperty] === undefined) {
      // eslint-disable-next-line no-param-reassign
      root[subProperty] = {};
    } // eslint-disable-next-line no-param-reassign


    root = root[subProperty]; // eslint-disable-next-line no-param-reassign

    path = path.substring(path.indexOf(delimiter) + 1, path.length);
  }

  if (root) {
    result.object = root;
    result.parameter = path;
  }

  return result;
};
/**
 * Resolves path to the leaf object and parameter of this object
 * @param {boolean} createIfMissing Flag to create the hierarchy of the namespaces if they do not exist
 * @private
 */


DvtJsonPath.prototype._resolvePath = function (createIfMissing) {
  if (this._leaf === undefined) {
    var result = this._resolveLeafObjectAndProperty(this._root, this._path, this._delimiter, createIfMissing);

    this._leaf = result.object;
    this._param = result.parameter;
  }
};
/**
 * Returns value of the leaf element of the path.
 * @return {Object} value The value of the leaf element or undefined if path structure is not yet created
 */


DvtJsonPath.prototype.getValue = function () {
  this._resolvePath(false);

  return this._leaf === undefined ? undefined : this._leaf[this._param];
};
/**
 * Sets value of the leaf element of the path.
 * @param {Object} value The value of the leaf element
 * @param {boolean} bOverride Whether to override the original value
 */


DvtJsonPath.prototype.setValue = function (value, bOverride) {
  this._resolvePath(true);

  if (bOverride || !this._leaf[this._param]) {
    this._leaf[this._param] = value;
  }
};

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



/* global DvtJsonPath:false, attributeGroupHandler:false */
var DvtStyleProcessor = {
  TEXT: function TEXT(cssDiv) {
    var ignoreProperties = {};

    if (cssDiv) {
      if (cssDiv.hasClass('oj-gauge-metric-label')) {
        // Ignored because the size and color are fit to shape and based on background color.
        ignoreProperties['font-size'] = true;
        ignoreProperties.color = true;
      } else if (cssDiv.hasClass('oj-treemap-node-header')) {
        // Ignored because the weight is automatically determined based on the layer of the header.
        ignoreProperties['font-weight'] = true;
      }
    }

    return DvtStyleProcessor._buildTextCssPropertiesObject(cssDiv, ignoreProperties);
  },
  // eslint-disable-next-line no-unused-vars
  BACKGROUND: function BACKGROUND(cssDiv, styleClass, property, path) {
    return DvtStyleProcessor._buildCssBackgroundPropertiesObject(cssDiv);
  },
  ANIM_DUR: function ANIM_DUR(cssDiv) {
    var animDur = cssDiv.css('animation-duration');

    if (animDur) {
      // Convert to milliseconds
      if (animDur.slice(-2) === 'ms') {
        animDur = parseInt(animDur.slice(0, -2), 10);
      } else if (animDur.slice(-1) === 's') {
        animDur = parseFloat(animDur.slice(0, -1)) * 1000;
      }

      return animDur;
    }

    return undefined;
  }
};
DvtStyleProcessor._INHERITED_FONT_COLOR = 'rgb(254, 0, 254)';
DvtStyleProcessor._INHERITED_FONT_FAMILY = 'Times';
DvtStyleProcessor._INHERITED_FONT_SIZE = '1px';
DvtStyleProcessor._INHERITED_FONT_WEIGHT = '1';
DvtStyleProcessor._INHERITED_FONT_STYLE = 'normal'; // Chrome adjusts px font size when zooming, so only set the font size if the inherited size is less than 4px.

DvtStyleProcessor._FONT_SIZE_BUFFER = 4.0;
/**
 * A map of resolved style properties, where each key is a style class and each value is an object with property to
 * value mappings.
 * @private
 */

DvtStyleProcessor._styleCache = {};

DvtStyleProcessor.defaultStyleProcessor = function (cssDiv, property) {
  return cssDiv.css(property);
};
/**
 * Returns the css background properties object.
 * @param {Object} cssDiv The element with style class or with some default style
 * @return {Object} The object of CSS background properties including
 *                  border-color, border-width, and background-color
 * @private
 */


DvtStyleProcessor._buildCssBackgroundPropertiesObject = function (cssDiv) {
  var cssObj = {};

  if (cssDiv.css('border-top-color')) {
    cssObj.borderColor = cssDiv.css('border-top-color');
  }

  if (cssDiv.css('border-width') && cssDiv.css('border-style') && cssDiv.css('border-style') !== 'none') {
    cssObj.borderWidth = cssDiv.css('border-width');
  }

  if (cssDiv.css('background-color')) {
    cssObj.backgroundColor = cssDiv.css('background-color');
  }

  return cssObj;
};
/**
 * Returns the css text properties object.
 * @param {Object} cssDiv The div to use for processing CSS style.
 * @param {Object} ignoreProperties The css properties to ignore
 * @return {Object} The CSS text properties object including font-family,
 *                  font-size, font-weight, color, and font-style
 */


DvtStyleProcessor._buildTextCssPropertiesObject = function (cssDiv, ignoreProperties) {
  var cssObj = {};
  var value = cssDiv.css('font-family');

  if (value && value !== DvtStyleProcessor._INHERITED_FONT_FAMILY) {
    cssObj.fontFamily = value.replace(/"/g, "'");
  }

  value = cssDiv.css('font-size');

  if (value && !(value.indexOf('px') > -1 && parseFloat(value) < DvtStyleProcessor._FONT_SIZE_BUFFER) && !ignoreProperties['font-size']) {
    cssObj.fontSize = value;
  }

  value = cssDiv.css('font-weight');

  if (value && value !== DvtStyleProcessor._INHERITED_FONT_WEIGHT && !ignoreProperties['font-weight']) {
    cssObj.fontWeight = value;
  }

  value = cssDiv.css('color');

  if (value && value !== DvtStyleProcessor._INHERITED_FONT_COLOR && !ignoreProperties.color) {
    cssObj.color = value;
  }

  value = cssDiv.css('font-style');

  if (value && value !== DvtStyleProcessor._INHERITED_FONT_STYLE) {
    cssObj.fontStyle = value;
  }

  return cssObj;
};
/**
 * Creates dummy divs for each component style class and merges their values with the component options object.
 * @param {Object} element DOM node to add CSS styles to for processing
 * @param {Object} options The options object to merge CSS properties with
 * @param {Array} componentClasses The style classes associated with the component
 * @param {Object} childClasses Style classes associated with a component's children
 */


DvtStyleProcessor.processStyles = function (element, options, componentClasses, childClasses) {
  var outerDummyDiv = null;
  var innerDummyDiv = null;
  var styleClasses = '';
  var i;

  for (i = 0; i < componentClasses.length; i++) {
    styleClasses = styleClasses + componentClasses[i] + ' ';
  }

  var styleDefinitions = {};
  var styleDivs = {};
  var styleClass;
  var styleClassKeys = Object.keys(childClasses);

  for (i = 0; i < styleClassKeys.length; i++) {
    styleClass = styleClassKeys[i]; // Retrieve the definitions for the styleClass. Convert to an array if not already.

    var definitions = childClasses[styleClass];

    if (!(definitions instanceof Array)) {
      definitions = [definitions];
    } // Performance: Only create these divs if we need to process uncached definitions


    var hasUncachedProperty = DvtStyleProcessor._hasUncachedProperty(styleClass, definitions);

    if (!innerDummyDiv && !outerDummyDiv && hasUncachedProperty) {
      // Add the component style classes to a hidden dummy div
      outerDummyDiv = $(document.createElement('div'));
      outerDummyDiv.css('display', 'none');
      element.append(outerDummyDiv); // @HTMLUpdateOK

      outerDummyDiv.attr('class', styleClasses);
      $(document.body).append(outerDummyDiv); // @HTMLUpdateOK
      // Add an inner dummy div to overwrite inherited values and prevent populating options object with them

      innerDummyDiv = $(document.createElement('div'));
      innerDummyDiv.css('font-size', DvtStyleProcessor._INHERITED_FONT_SIZE);
      innerDummyDiv.css('color', DvtStyleProcessor._INHERITED_FONT_COLOR);
      innerDummyDiv.css('font-weight', DvtStyleProcessor._INHERITED_FONT_WEIGHT);
      innerDummyDiv.css('font-style', DvtStyleProcessor._INHERITED_FONT_STYLE);
      outerDummyDiv.append(innerDummyDiv); // @HTMLUpdateOK
    } // store style definitions to avoid recalculation in the next loop


    styleDefinitions[styleClass] = definitions; // create cssDivs for styles to be resolved during processing where necessary

    if (hasUncachedProperty) {
      styleDivs[styleClass] = DvtStyleProcessor._createStyleDivs(innerDummyDiv, styleClass, definitions);
    }
  } // Performance: Process color attribute groups for components along with the component styles


  var attrGpsDiv = attributeGroupHandler.ColorAttributeGroupHandler.__createAttrDiv();

  for (i = 0; i < styleClassKeys.length; i++) {
    styleClass = styleClassKeys[i];

    DvtStyleProcessor._processStyle(styleDivs[styleClass], options, styleClass, styleDefinitions[styleClass]);
  } // Performance: Process color attribute groups for components along with the component styles


  if (attrGpsDiv) {
    attributeGroupHandler.ColorAttributeGroupHandler.__processAttrDiv(attrGpsDiv);

    attrGpsDiv.remove();
  } // Remove the dummy div when complete


  if (outerDummyDiv) {
    outerDummyDiv.remove();
  }
};
/**
 * Creates and returns a cssDiv for the specified style class if there are definitions that need to be evaluated
 * @param {Object} parentElement The parent DOM node of the element that will be created to add CSS styles to for processing.
 * @param {string} styleClass The style class.
 * @param {Array} definitions Array of maps of CSS style attribute and values to process.
 * @return {Object} The created cssDiv
 * @private
 */


DvtStyleProcessor._createStyleDivs = function (parentElement, styleClass, definitions) {
  // Ensure an entry for the styleClass exists in the cache.
  if (!DvtStyleProcessor._styleCache[styleClass]) {
    DvtStyleProcessor._styleCache[styleClass] = {};
  } // Create a cssDiv for each definition.


  var cssDiv = null;

  for (var i = 0; i < definitions.length; i++) {
    var definition = definitions[i];
    var property = definition.property;

    if (property) {
      // Check if the style cache already has a resolved copy of the value
      var value = DvtStyleProcessor._styleCache[styleClass][property];

      if (typeof value === 'undefined') {
        // Property not found in the cache. Ensure creation of the cssDiv to resolve the property.
        if (!cssDiv) {
          cssDiv = $(document.createElement('div'));
          cssDiv.addClass(styleClass);
          parentElement.append(cssDiv); // @HTMLUpdateOK
        }
      }
    }
  }

  return cssDiv;
};
/**
 * Resolves the css properties for a specified style class.
 * @param {Object} cssDiv The DOM node with addeed CSS styles to process.
 * @param {Object} options The options object to merge CSS properties with.
 * @param {string} styleClass The style class.
 * @param {Array} definitions Array of maps of CSS style attribute and values to process.
 * @private
 */


DvtStyleProcessor._processStyle = function (cssDiv, options, styleClass, definitions) {
  for (var i = 0; i < definitions.length; i++) {
    var definition = definitions[i];
    var property = definition.property;

    if (property) {
      // Check if the style cache already has a resolved copy of the value
      var value = DvtStyleProcessor._styleCache[styleClass][property];

      if (typeof value === 'undefined' && cssDiv) {
        // Resolve and store in the cache.
        value = DvtStyleProcessor._resolveStyle(cssDiv, property);
        DvtStyleProcessor._styleCache[styleClass][property] = value;
      } // If a value exists, apply to the JSON.


      if (value != null) {
        var path = new DvtJsonPath(options, definition.path); // If the value is an object, combine the value from the options with the value from the CSS.

        var optionsValue = path.getValue();
        var isObj = _typeof(optionsValue) === 'object';

        if (isObj && optionsValue) {
          var keys = Object.keys(value);

          for (var j = 0; j < keys.length; j++) {
            var key = keys[j];

            if (optionsValue[key] === undefined) {
              optionsValue[key] = value[key];
            }
          }
        } else {
          // If we have already merged the original value with the new value, such as for
          // text or background styles, we do not need to update the path value.
          path.setValue(value, isObj);
        }
      }
    }
  }
};
/**
 * Helper function to resolve the css properties within a dummy div and handle caching.
 * @param {Object} cssDiv The div to use for processing CSS style.
 * @param {string} property The css property to be resolved.
 * @return {string | null} The resolved value.
 * @private
 */


DvtStyleProcessor._resolveStyle = function (cssDiv, property) {
  var handler = DvtStyleProcessor[property];
  var value = handler ? handler(cssDiv) : DvtStyleProcessor.defaultStyleProcessor(cssDiv, property); // Ensure the returned value is not null or empty string.

  return value != null && !(typeof value === 'string' && value.replace(/^\s+/g, '') === '') ? value : null;
};
/**
 * Helper function to verify if any style properties are not in the cache.
 * @param {string} styleClass The style class.
 * @param {Array} definitions The array of definitions for the style class.
 * @return {boolean}
 * @private
 */


DvtStyleProcessor._hasUncachedProperty = function (styleClass, definitions) {
  var styleCache = DvtStyleProcessor._styleCache[styleClass];

  if (!styleCache) {
    return true;
  }

  for (var i = 0; i < definitions.length; i++) {
    var property = definitions[i].property;

    if (property) {
      var value = styleCache[property];

      if (typeof value === 'undefined') {
        return true;
      }
    }
  }

  return false;
};



/* global Config:false, Promise:false, ojMap:false, Logger:false */

/**
* Handler for DataProvider generated content for chart
* @constructor
* @ignore
*/
var TemplateHandler = function TemplateHandler(component, configs) {
  this._component = component;
  this._configMap = configs;

  this._init();
}; // Subclass from oj.Object


oj.Object.createSubclass(TemplateHandler, oj.Object, 'TemplateHandler');
/**
 * Initializes the instance.
 * @private
 */

TemplateHandler.prototype._init = function () {
  this._templateEnginePromise = null;
  this._templates = this.getTemplates();
  this._templateResults = {};
  this._templateNodeData = {};
  this._componentResults = {}; // this is for components that also do their own processing

  this._eventListeners = [];
  this._queueNextEvent = true;
  this._eventUpdates = [];
  this._templatePropertyMap = {};
  this._propertyValidatorMap = {};
};
/**
 * Returns a promise that resolves into a template engine
 * @return {Promise} Returns a promise that resoves into a template engine
 * @public
 * @instance
 * @memberof oj.dvtBaseComponent
 */


TemplateHandler.prototype.getTemplateEngine = function () {
  if (this._templateEnginePromise) {
    return this._templateEnginePromise;
  }

  this._templateEnginePromise = new Promise(function (resolve) {
    Config.__getTemplateEngine().then(function (engine) {
      resolve(engine);
    }, function (reason) {
      throw new Error('Error loading template engine: ' + reason);
    });
  });
  return this._templateEnginePromise;
};
/**
 * Returns the data set attributes of a template
 * @param {string} templateName The name of the template whose data set attributes is to be returned
 * @return {Object} The data set attributes of the specified template
 * @public
 * @instance
 * @memberof oj.dvtBaseComponent
 */


TemplateHandler.prototype.getDataSet = function (templateName) {
  var template = this.getTemplate(templateName);
  return template && template.dataset;
};
/**
 * Returns the template corresponding to the given name
 * @param {string} templateName The name of the template
 * @return {Element|null} The template element if the handler has it, null if otherwise
 * @public
 * @instance
 * @memberof oj.dvtBaseComponent
 */


TemplateHandler.prototype.getTemplate = function (templateName) {
  return this._templates[templateName] && this._templates[templateName][0];
};
/**
 * Returns the boolean value of the data set attribute given. It is read off the template corresponding to the given template name.
 * @param {string} templateName The name of the template
 * @return {boolean} The data set attribute's boolean value
 * @public
 * @instance
 * @memberof oj.dvtBaseComponent
 */


TemplateHandler.prototype.getDataSetBoolean = function (templateName, attr) {
  var templateDataSet = this.getDataSet(templateName);

  var prop = oj.__AttributeUtils.attributeToPropertyName(attr);

  var propValue = templateDataSet && templateDataSet[prop];
  return propValue != null && oj.__AttributeUtils.coerceBooleanValue(this.getTemplate(templateName), attr, propValue, 'Boolean');
};
/**
 * Gets the inline template elements of the component
 * @return {Object} Returns an object containing the inline template elements of the custom element component.
 * @public
 * @ignore
 * @instance
 * @memberof oj.dvtBaseComponent
 */


TemplateHandler.prototype.getTemplates = function () {
  return oj.BaseCustomElementBridge.getSlotMap(this._component.element[0]);
};
/**
 * Returns a function that validates the value for a property for a given element.
 * @param {node} element The template element name
 * @param {string} elementName The custom element name
 * @return {Function} A function that validates the value for a property. It takes in the property path and the value of the topmost property
 * @private
 * @ignore
 * @instance
 * @memberof oj.dvtBaseComponent
 */


TemplateHandler.prototype._getPropertyValidator = function (element, elementName) {
  if (!element) {
    return null;
  }

  var propertyValidator = this._propertyValidatorMap[elementName];

  if (propertyValidator) {
    return propertyValidator;
  }

  var propsMetadata = oj.CustomElementBridge.getMetadata(elementName);
  var templateElement = element.content ? element.content.children[0] : element.childNodes[1];
  var metadataCache = {};

  propertyValidator = function propertyValidator(propertyPath, value) {
    var property = propertyPath.join('.');
    var metadata = metadataCache[property];

    if (!metadata) {
      metadata = propsMetadata; // Get sub property metadata if needed

      for (var i = 0; i < propertyPath.length; i++) {
        metadata = metadata.properties[propertyPath[i]];
      }

      metadataCache[property] = metadata;
    }

    oj.BaseCustomElementBridge.checkEnumValues(templateElement, property, value, metadata); // TODO support checking for null values once we generate metadata from jsDoc and have accurate info
    // about component support for undefined/null

    if (value != null) {
      oj.BaseCustomElementBridge.checkType(templateElement, property, value, metadata);
    }
  };

  this._propertyValidatorMap[elementName] = propertyValidator;
  return propertyValidator;
}; // todo: function description


TemplateHandler.prototype._processAliasedPropertyNames = function (dataProperty, templateElementName, data) {
  var getAliasedPropertyNames = this._configMap[dataProperty].getAliasedPropertyNames;

  if (getAliasedPropertyNames) {
    var aliasedPropertyMap = getAliasedPropertyNames(templateElementName); // todo: maybe cache this for perfomance

    var aliasedProperties = Object.keys(aliasedPropertyMap);

    for (var i = 0; i < aliasedProperties.length; i++) {
      var elementProp = aliasedProperties[i];
      var dataProp = aliasedPropertyMap[elementProp]; // eslint-disable-next-line no-param-reassign

      data[dataProp] = data[elementProp]; // eslint-disable-next-line no-param-reassign

      data[elementProp] = undefined;
    }
  }

  return data;
}; // todo: function description


TemplateHandler.prototype._getTemplateElementProperties = function (templateElementName) {
  var templateTopProperties = this._templatePropertyMap[templateElementName];

  if (!templateTopProperties) {
    templateTopProperties = this._component.getElementPropertyNames(templateElementName);
    this._templatePropertyMap[templateElementName] = templateTopProperties;
  }

  return templateTopProperties;
}; // todo: function description


TemplateHandler.prototype.processNodeTemplate = function (dataProperty, templateEngine, template, templateElementName, context, nodeKey) {
  var config = this._configMap[dataProperty];
  var currentTemplate = template.getAttribute('slot');
  var alias = this._component.options.as;
  var parentElement = this._component.element[0];

  var properties = this._getTemplateElementProperties(templateElementName);

  var getTemplateName = typeof config.templateName === 'string' ? function () {
    return config.templateName;
  } : config.templateName;

  var validator = this._getPropertyValidator(template, templateElementName);

  var isMainTemplate = currentTemplate === getTemplateName(); // Check if this is the main template for the data property

  var cacheKey = isMainTemplate ? dataProperty : currentTemplate; // Set up for template event listeners

  var getTemplateEventHandler = function (_nodeKey) {
    return function (value) {
      var aliasedValue = this._processAliasedPropertyNames(dataProperty, templateElementName, value);

      var nodeData = this._templateNodeData[cacheKey];
      oj.CollectionUtils.copyInto(nodeData.get(_nodeKey).data, aliasedValue);

      this._eventUpdates.push({
        key: nodeKey,
        data: aliasedValue
      });

      if (this._queueNextEvent) {
        this._fireEvent('notReady');

        templateEngine.getThrottlePromise().then(function () {
          // Rerender component
          this._fireEvent('dataUpdated', {
            dataProperty: dataProperty,
            templateName: currentTemplate,
            data: this._eventUpdates.slice(0)
          });

          this._queueNextEvent = true;
          this._eventUpdates = [];
        }.bind(this));
      }

      this._queueNextEvent = false;
    }.bind(this);
  }.bind(this);

  var resolvedNode = templateEngine.resolveProperties(parentElement, template, templateElementName, properties, context, alias, validator);
  resolvedNode.subscribe(getTemplateEventHandler(nodeKey));

  var aliasedData = this._processAliasedPropertyNames(dataProperty, templateElementName, resolvedNode.peek());

  var processedDataObj = {
    data: aliasedData,
    node: resolvedNode,
    context: context
  };

  if (!this._templateNodeData[cacheKey]) {
    // eslint-disable-next-line new-cap
    this._templateNodeData[cacheKey] = new ojMap();
  }

  this._templateNodeData[cacheKey].set(nodeKey, processedDataObj);

  return processedDataObj.data;
};
/**
 * Processes the templates using the data provider's data and returns a map of values to options to be updated.
 * To use the default behaviour the component should override the _GetSimpleDataProviderConfigs.
 * Any sub class implementation of this should call this._super
 * The return's data has a _itemData that has the data for that item from the data provider.
 * @param {string} dataProperty The property name of the data API to lookup templates for
 * @param {Object} data The fetch results of the data provider. Contains the data and keys
 * @param {Object} templateEngine The template engine to be used to process templates
 * @param {boolean=} isTreeData True is the data has a tree structure, false if otherwise
 * @param {Object=} parentKey Parent key to be used for template context
 * @param {boolean} isRoot If true, a cache for the results is used.
 * @return {Object} An object with paths of components options to be updated and
 *                   their corresponding values.eg: {paths: [], values: []}
 * @public
 * @instance
 * @memberof oj.dvtBaseComponent
 */


TemplateHandler.prototype.processTemplates = function (dataProperty, data, templateEngine, isTreeData, parentKey, isRoot, updateChildren) {
  if (isRoot && this._templateResults[dataProperty]) {
    return this._templateResults[dataProperty];
  }

  var config = this._configMap[dataProperty];
  var self = this;
  var paths;
  var pathValues;

  if (config) {
    paths = [];
    pathValues = [];
    var getTemplateName = typeof config.templateName === 'string' ? function () {
      return config.templateName;
    } : config.templateName;
    var getTemplateElementName = typeof config.templateElementName === 'string' ? function () {
      return config.templateElementName;
    } : config.templateElementName;
    var resultPath = config.resultPath;
    var parentElement = this._component.element[0];
    var processChildrenData = config.processChildrenData;

    var processOptionData = config.processOptionData || function (optionData) {
      return optionData;
    };

    var nodeDataMap = self._templateNodeData[dataProperty];

    if (getTemplateName && getTemplateElementName && resultPath) {
      // read attributes off nodes corresponding to the nodeKey
      var processDatum = function processDatum(nodeData, nodeKey, context, template, templateElementName) {
        var processedDatum;

        try {
          if (template) {
            processedDatum = self.processNodeTemplate(dataProperty, templateEngine, template, templateElementName, context, nodeKey);
          } else {
            processedDatum = Object.create(nodeData);
            processedDatum._noTemplate = true;
            processedDatum._dvtNoClone = true;
            nodeDataMap.set(nodeKey, {
              data: processedDatum,
              context: context
            });
          }

          processedDatum.id = nodeKey;
          processedDatum._itemData = nodeData;
        } catch (error) {
          Logger.error(error);
        }

        return processedDatum;
      };

      var processData = function processData(collection, parentData, _parentKey) {
        var _data = collection.data;
        var _keys = collection.keys;
        var processedData = [];

        for (var i = 0; i < _data.length; i++) {
          var nodeData = isTreeData ? _data[i].value : _data[i];
          var nodeKey = isTreeData ? _keys[i].value : _keys[i];
          var context = {
            data: nodeData,
            key: nodeKey,
            index: i,
            componentElement: parentElement
          };

          if (isTreeData) {
            context.parentData = parentData;
            context.parentKey = _parentKey;
          }

          var templateName = getTemplateName(_data[i]);
          var templateElementName = getTemplateElementName(_data[i]);
          var template = self.getTemplate(templateName);
          var processedDatum = processDatum(nodeData, nodeKey, context, template, templateElementName);

          if (isTreeData && _data[i].children) {
            // more complex for legend need to mutate the data itself
            var newParentData = parentData.slice(0);
            newParentData.push(nodeData);
            var childCollection = {
              data: _data[i].children,
              keys: _keys[i].children
            };
            var processedChildren = processData(childCollection, newParentData, nodeKey);

            if (processChildrenData) {
              processChildrenData(processedDatum, _data[i], processedChildren);
            } else {
              processedDatum[resultPath] = processedChildren;
            }
          }

          processedData.push(processedDatum);
        }

        return processedData;
      };

      paths.push(resultPath);
      var parentData;

      if (parentKey && nodeDataMap.has(parentKey)) {
        parentData = nodeDataMap.get(parentKey).context.parentData.concat(nodeDataMap.get(parentKey).context.data);
      }

      var optionData = processData(data, parentData || [], parentKey);
      pathValues.push(processOptionData(optionData));
    }

    if (updateChildren) {
      nodeDataMap.get(parentKey).data[resultPath] = pathValues[0];
    }
  }

  var templateResults = {
    paths: paths,
    values: pathValues
  };

  if (isRoot) {
    this._templateResults[dataProperty] = templateResults;
  }

  return templateResults;
};
/**
 * Checks for all potential dataProvider templates on the component and removes event listeners
 * and clears stored data in caches
 * @public
 * @instance
 * @memberof oj.dvtBaseComponent
 */


TemplateHandler.prototype.release = function (dataProperty) {
  // Remove data provider template event listeners
  var clearListeners = function (prop) {
    var valueMap = this._templateNodeData[prop];

    if (valueMap) {
      valueMap.forEach(function (value) {
        if (value.node) {
          value.node.dispose();
        }
      }); // eslint-disable-next-line new-cap

      this._templateNodeData[prop] = new ojMap();
    }
  }.bind(this);

  if (dataProperty) {
    clearListeners(dataProperty);
    this.clear(dataProperty);
  } else {
    var dataProperties = Object.keys(this._templateNodeData);

    for (var i = 0; i < dataProperties.length; i++) {
      clearListeners(dataProperties[i]);
    }

    this.clear();
  }
}; // todo: function description


TemplateHandler.prototype.clear = function (dataProperty, isReset) {
  if (dataProperty && isReset) {
    // eslint-disable-next-line new-cap
    this._templateNodeData[dataProperty] = this._templateNodeData[dataProperty] || new ojMap();
  } else if (dataProperty) {
    this._templateResults[dataProperty] = null;
    this._componentResults[dataProperty] = null;
  } else {
    this._templateResults = {};
    this._componentResults = {};
    this._templateNodeData = {};
  }
}; // todo: function description


TemplateHandler.prototype.getComponentResults = function (dataProperty) {
  return this._componentResults[dataProperty];
}; // todo: function description


TemplateHandler.prototype.setComponentResults = function (dataProperty, results) {
  this._componentResults[dataProperty] = results;
}; // todo: function description


TemplateHandler.prototype.addEventListener = function (listener) {
  this._eventListeners.push(listener);
}; // todo: function description


TemplateHandler.prototype._fireEvent = function (type, detail) {
  for (var i = 0; i < this._eventListeners.length; i++) {
    this._eventListeners[i]({
      type: type,
      detail: detail
    });
  }
};



/* global Config:false, Context:false, Promise:false, Map:false, Symbol:false, dvt:false, DvtJsonPath:false, DvtStyleProcessor:false, KeySetImpl:false, ojMap:false, Components:false, Set:false, LocaleData:false, Logger:false, TemplateHandler:false , DataProviderHandler:false*/

/**
 * @ojcomponent oj.dvtBaseComponent
 * @augments oj.baseComponent
 * @since 0.7.0
 * @abstract
 * @hideconstructor
 */
oj.__registerWidget('oj.dvtBaseComponent', $.oj.baseComponent, {
  options: {
    /**
     * Defines whether the element will automatically render in response to
     * changes in size. If set to <code class="prettyprint">off</code>, then the
     * application is responsible for calling <code class="prettyprint">refresh</code>
     * to render the element at the new size.
     * @expose
     * @name trackResize
     * @ojshortdesc Defines whether the element will automatically render in response to changes in size. See the Help documentation for more information.
     * @memberof oj.dvtBaseComponent
     * @instance
     * @type {string}
     * @ojvalue {string} "on"
     * @ojvalue {string} "off"
     * @default "on"
     *
     * @example <caption>Initialize the data visualization element with the
     * <code class="prettyprint">track-resize</code> attribute specified:</caption>
     * &lt;oj-some-dvt track-resize='off'>&lt;/oj-some-dvt>
     *
     * @example <caption>Get or set the <code class="prettyprint">trackResize</code>
     * property after initialization:</caption>
     * // getter
     * var value = myComponent.trackResize;
     *
     * // setter
     * myComponent.trackResize="off";
     */
    trackResize: 'on'
  },
  //* * @inheritdoc */
  _ComponentCreate: function _ComponentCreate() {
    this._super();

    this._renderCount = 0;
    this._numDeferredObjs = 0;
    this._optionsCopy = null;
    this._dataValuePromise = {};
    this._templateMap = {};
    this._TemplateHandler = new TemplateHandler(this, this._GetSimpleDataProviderConfigs());
    this._DataProviderHandler = new DataProviderHandler(this, this._GetSimpleDataProviderConfigs()); // Set up data provider event handlers

    this._DataProviderHandler.addEventListener(this._GetDPEventHandler());

    this._TemplateHandler.addEventListener(this._GetDPEventHandler()); // Append the component style classes to the element


    var componentStyles = this._GetComponentStyleClasses();

    for (var i = 0; i < componentStyles.length; i++) {
      this.element.addClass(componentStyles[i]);
    } // Create a reference div within the element to be used for computing relative event coords.


    this._referenceDiv = $(document.createElement('div'));

    this._referenceDiv.css('visibility', 'hidden');

    this.element.append(this._referenceDiv); // @HTMLUpdateOK

    dvt.Agent.setAgentInfo(oj.AgentUtils.getAgentInfo()); // Create the dvt.Context, which creates the svg element and adds it to the DOM.

    var parentElement = this.element[0].parentElement;

    if (parentElement && parentElement._dvtcontext) {
      this._context = parentElement._dvtcontext;
    } else {
      this._context = new dvt.Context(this.element[0], null, this._referenceDiv[0]);
    } // Store JET reference on context so toolkit can access things like loggers


    this._context.oj = oj;
    this._context.KeySetImpl = KeySetImpl;
    this._context.ojMap = ojMap;
    this._context.LocaleData = LocaleData;
    this._context.dataProviderProps = Object.keys(this._GetSimpleDataProviderConfigs()); // Set the reading direction on the context

    this._context.setReadingDirection(this._GetReadingDirection()); // Set the tooltip and datatip callbacks and div style classes


    this._context.setTooltipAttachedCallback(Components.subtreeAttached);

    this._context.setOverlayAttachedCallback(Components.subtreeAttached); // Pass back method for cleaning up renderer context


    this._context.setFixContextCallback(this._FixRendererContext.bind(this));

    this._context.setCustomElement(this._IsCustomElement()); // Set high contrast mode if needed


    if ($(document.body).hasClass('oj-hicontrast')) {
      dvt.Agent.setHighContrast(true);
    } // Create and cache the component instance


    this._component = this._CreateDvtComponent(this._context, this._HandleEvent, this); // Add the component to the display tree of the rendering context.

    this._context.getStage().addChild(this._component); // Load component resources


    this._LoadResources(); // Pass the environment and widget constructor through the options for JET specific behavior


    this.options._environment = 'jet';
    this.options._widgetConstructor = Components.__GetWidgetConstructor(this.element);
  },
  //* * @inheritdoc */
  _AfterCreate: function _AfterCreate() {
    // Allow superclass to process root attributes and context menus
    this._super(); // Resize Listener Support


    if (this.options.trackResize !== 'off') {
      this._addResizeListener();
    }

    this._ProcessOptions(); // Render the component


    this._Render();
  },

  /**
   * The function sets Locale helpers (various converter instances for Numeric, Date or TimeZone data types) on the DvtContext object.
   * @protected
   * @instance
   * @param {Object} NumberConverter - The return value of the ojconverter-number module
   * @param {Object} ConverterUtils - The return value of the ojconverterutils-i18n module
   * @memberof oj.dvtBaseComponent
   * @return {null}
   */
  _SetLocaleHelpers: function _SetLocaleHelpers(NumberConverter, ConverterUtils) {
    // If requireJS is not used, can't rely on internationalization modules.
    if (dvt.requireJS !== false) {
      var helpers = {}; // Number converter factory for use in formatting default strings

      helpers.createNumberConverter = function (options) {
        return new NumberConverter.IntlNumberConverter(options);
      }; // Iso to date converter to be called for JS that requires Dates


      helpers.isoToDateConverter = function (input) {
        if (typeof input === 'string') {
          var dateWithTimeZone = ConverterUtils.IntlConverterUtils.isoToDate(input);
          var localIsoTime = dateWithTimeZone.toJSON() ? ConverterUtils.IntlConverterUtils.dateToLocalIso(dateWithTimeZone) : input;
          return ConverterUtils.IntlConverterUtils.isoToLocalDate(localIsoTime);
        }

        return input;
      }; // Date to iso converter to be called before passing to the date time converter


      helpers.dateToIsoWithTimeZoneConverter = function (input) {
        if (input instanceof Date) {
          var timeZoneOffest = -1 * input.getTimezoneOffset();
          var offsetSign = timeZoneOffest >= 0 ? '+' : '-';
          var offsetHour = Math.floor(Math.abs(timeZoneOffest) / 60);
          var offsetMinutes = Math.abs(timeZoneOffest) % 60;
          var isoTimeZone = offsetSign + (offsetHour.toString().length !== 2 ? '0' + offsetHour : offsetHour) + ':' + (offsetMinutes.toString().length !== 2 ? offsetMinutes + '0' : offsetMinutes);
          return ConverterUtils.IntlConverterUtils.dateToLocalIso(input) + isoTimeZone;
        }

        return input;
      };

      this._context.setLocaleHelpers(helpers);
    }
  },
  //* * @inheritdoc */
  refresh: function refresh() {
    this._super(); // Update the reading direction on the context


    this._context.setReadingDirection(this._GetReadingDirection()); // Render the component with any changes


    this._Render();
  },
  //* * @inheritdoc */
  getNodeBySubId: function getNodeBySubId(locator) {
    var automation = this._component && this._component.getAutomation ? this._component.getAutomation() : null;

    if (automation) {
      // Convert the locator to the subid string, since the shared JS layer only accepts the subid string syntax.
      var subId = this._ConvertLocatorToSubId(locator);

      return automation.getDomElementForSubId(subId);
    }

    return null;
  },
  //* * @inheritdoc */
  getSubIdByNode: function getSubIdByNode(node) {
    var automation = this._component && this._component.getAutomation ? this._component.getAutomation() : null;

    if (automation) {
      // Retrieve the subid string from the shared JS layer, and convert it to the locator object.
      var subId = automation.getSubIdForDomElement(node);
      return subId ? this._ConvertSubIdToLocator(subId) : null;
    }

    return null;
  },

  /**
   * Converts the specified locator object into a subId string.
   * @param {Object} locator
   * @return {string|null}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  // eslint-disable-next-line no-unused-vars
  _ConvertLocatorToSubId: function _ConvertLocatorToSubId(locator) {
    // subclasses must override to support getNodeBySubId
    return null;
  },

  /**
   * Converts the specified subId string into a locator object.
   * @param {string} subId
   * @return {Object|null}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  // eslint-disable-next-line no-unused-vars
  _ConvertSubIdToLocator: function _ConvertSubIdToLocator(subId) {
    // subclasses must override to support getSubIdByNode
    return null;
  },

  /**
   * Create dummy divs for style classes and merge style class values with json .
   * options object
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _ProcessStyles: function _ProcessStyles() {
    // Process selectors for this component
    DvtStyleProcessor.processStyles(this.element, this.options, this._GetComponentStyleClasses(), this._GetChildStyleClasses());
  },

  /**
   * Returns the style classes associated with the component.
   * @return {Array}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetComponentStyleClasses: function _GetComponentStyleClasses() {
    return ['oj-dvtbase'];
  },

  /**
   * Returns a map of the style classes associated with a component's children.
   * @return {Object}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetChildStyleClasses: function _GetChildStyleClasses() {
    var styleClasses = {};
    styleClasses['oj-dvt-no-data-message'] = {
      path: '_statusMessageStyle',
      property: 'TEXT'
    };
    return styleClasses;
  },

  /**
   * Returns an array of supported event types.  Used in conjunction with _setOptions to skip unnecessary rendering when
   * event listeners are bound. Subclasses must override to return supported event types.
   * @return {Array}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetEventTypes: function _GetEventTypes() {
    return [];
  },
  //* * @inheritdoc */
  _VerifyConnectedForSetup: function _VerifyConnectedForSetup() {
    return true;
  },

  /**
   * Release resources held by the component
   * @instance
   * @override
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _ReleaseResources: function _ReleaseResources() {
    this._super();

    this._renderNeeded = true; // Reset data provider state

    this._DataProviderHandler.release();

    this._TemplateHandler.release();

    this._dataValuePromise = {};
  },
  //* * @inheritdoc */
  _destroy: function _destroy() {
    // Hide all component tooltips and remove references to the DvtContext
    this._context.hideTooltips();

    this._context.destroy();

    this._context = null;
    var parentElement = this.element[0].parentElement;

    if (parentElement && parentElement._dvtcontext) {
      parentElement._dvtcontext = null;
    } // Call destroy on the JS component


    if (this._component.destroy) {
      this._component.destroy();
    }

    this._component = null; // Remove DOM resize listener

    this._removeResizeListener();

    this._CleanAllTemplates(); // Remove children and clean up DOM changes


    this.element.children().remove();
    this.element.removeAttr('role').removeAttr('tabIndex').removeAttr('aria-activedescendant'); // Remove style classes that were added

    var componentStyles = this._GetComponentStyleClasses();

    for (var i = 0; i < componentStyles.length; i++) {
      this.element.removeClass(componentStyles[i]);
    } // Remove any pending busy states


    this._MakeReady(); // Clear data provider states


    this._TemplateHandler.release();

    this._DataProviderHandler.release();

    this._dataValuePromise = {}; // Call super last for destroy

    this._super();
  },
  //* * @inheritdoc */
  // eslint-disable-next-line no-unused-vars
  _setOptions: function _setOptions(options, flags) {
    // Call the super to update the property values
    this._superApply(arguments);

    this._OptionChangeHandler(options); // Add or remove the resize tracking if changed.


    var trackResize = this.options.trackResize;

    if (trackResize === 'off' && this._resizeListener) {
      this._removeResizeListener();
    } else if (trackResize !== 'off' && !this._resizeListener) {
      this._addResizeListener();
    }

    this._ProcessOptions(); // Render the component with the updated options.


    if (this._bUserDrivenChange) {
      // Option change fired in response to user gesture. Already reflected in UI, so no render needed.
      return;
    } // Event listeners don't require rendering.  Iterate through options to check for non-event options.
    // Also no render is needed if the component has exposed a method to update the option without rerendering.


    var bRenderNeeded = false;

    var eventTypes = this._GetEventTypes();

    var optimizedOptions = ['highlightedCategories', 'selection', 'dataCursorPosition', 'scrollPosition'];
    $.each(options, function (key) {
      if (eventTypes.indexOf(key) < 0 && optimizedOptions.indexOf(key) < 0) {
        bRenderNeeded = true;
        return false;
      }

      return undefined;
    });

    if (bRenderNeeded) {
      this._Render();
    } else {
      // Update options without rerendering. Check for undefined to allow nulls.
      if (options.highlightedCategories !== undefined) {
        this._component.highlight(options.highlightedCategories);
      }

      if (options.selection !== undefined) {
        this._component.select(options.selection);
      }

      if (options.dataCursorPosition !== undefined && this._component.positionDataCursor) {
        this._component.positionDataCursor(options.dataCursorPosition);
      }

      if (options.scrollPosition !== undefined) {
        this._component.scroll(options.scrollPosition);
      }
    }
  },

  /**
   * Called by _create to instantiate the specific DVT component instance.  Subclasses must override.
   * @param {dvt.Context} context
   * @param {Function} callback
   * @param {Object} callbackObj
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  // eslint-disable-next-line no-unused-vars
  _CreateDvtComponent: function _CreateDvtComponent(context, callback, callbackObj) {
    return null; // subclasses must override
  },

  /**
   * Called by the component to process events.  Subclasses should override to delegate DVT component events to their
   * JQuery listeners.
   * @param {Object} event
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _HandleEvent: function _HandleEvent(event) {
    // TODO: hiddenCategories and highlightedCategories should use the option change event
    var type = event.type;

    if (type === 'selection') {
      this._UserOptionChange('selection', event.selection);
    } else if (type === 'categoryHide' || type === 'categoryShow') {
      this._UserOptionChange('hiddenCategories', event.hiddenCategories);
    } else if (type === 'categoryHighlight') {
      this._UserOptionChange('highlightedCategories', event.categories);
    } else if (type === 'optionChange') {
      this._UserOptionChange(event.key, event.value, event.optionMetadata);
    } else if (type === 'touchHoldRelease' && this._GetContextMenu()) {
      this._OpenContextMenu($.Event(event.nativeEvent), 'touch');
    } else if (type === 'dvtRender') {
      this._Render();
    } else if (type === 'ready') {
      // Handles case where two option sets occur and the second set
      // containing deferred data. We don't want to prematurely resolve
      // any when ready promises until the deferred data has finished.
      if (this._numDeferredObjs === 0) {
        this._MakeReady();
      }
    }
  },

  /**
   * Adds a resize listener for this component.
   * @private
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _addResizeListener: function _addResizeListener() {
    if (!this._resizeListener) {
      this._resizeListener = this._handleResize.bind(this);
      oj.DomUtils.addResizeListener(this.element[0], this._resizeListener, 250);
    }
  },

  /**
   * Removes the resize listener for this component.
   * @private
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _removeResizeListener: function _removeResizeListener() {
    if (this._resizeListener) {
      oj.DomUtils.removeResizeListener(this.element[0], this._resizeListener);
      this._resizeListener = null;
    }
  },

  /**
   * Called when the component is resized.
   * @param {number} width
   * @param {number} height
   * @private
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  // eslint-disable-next-line no-unused-vars
  _handleResize: function _handleResize(width, height) {
    // Render the component at the new size if it changed enough
    var newWidth = this.element.width();
    var newHeight = this.element.height();

    if (this._width == null || this._height == null || Math.abs(newWidth - this._width) + Math.abs(newHeight - this._height) >= 5) {
      this._Render(true);
    }
  },

  /**
   * Called once during component creation to load resources.
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _LoadResources: function _LoadResources() {// subcomponents should override
  },

  /**
   * Called to render the component at the current size.
   * @param {boolean} isResize (optional) Whether it is a resize rerender.
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _Render: function _Render(isResize) {
    // Hide all component tooltips on rerender cases to avoid abandoned tooltips
    this._context.hideTooltips(); // Starting a new render - no longer ready


    this._NotReady(); // Fix 18498656: If the component is not attached to a visible subtree of the DOM, rendering will fail because
    // getBBox calls will not return the correct values.
    // Note: Checking offsetParent() does not work here since it returns false for position: fixed.
    //  ignore resize events fired before the component is rendered


    if (!this._context.isReadyToRender() || this._renderNeeded && isResize) {
      this._renderNeeded = true;

      this._MakeReady();
    } else {
      // If flowing layout is supported, don't pass width and height to the component render method
      this._width = this._IsFlowingLayoutSupported() ? null : this.element.width();
      this._height = this._IsFlowingLayoutSupported() ? null : this.element.height(); // Set the root font-family

      this._context.setDefaultFontFamily(this._referenceDiv.css('font-family')); // Add the width, height, and locale as private fields in the options for debugging purposes


      this.options._width = this._width;
      this.options._height = this._height;
      this.options._locale = Config.getLocale(); // Add draggable attribute if DnD is supported

      if (this._IsDraggable()) {
        this.element.attr('draggable', true);
      } // Merge css styles with with json options object


      this._ProcessStyles(); // Skip the options on resize to suppress animation.


      if (isResize) {
        // Skip the resize render if Promises are not fully resolved because
        // the component will be rerendered with the new width/height when all
        // Promises are fully resolved.  Make sure not to increment the render
        // count in that case so that the current pending render goes through.
        if (this._numDeferredObjs === 0) {
          // Render the component.
          this._renderCount += 1;

          this._RenderComponent(this._optionsCopy, isResize);
        }
      } else {
        // Render the component.
        this._renderCount += 1;

        if (this._resolveDeferredDataItems()) {
          // Component rendering will be done when all Promises are fully resolved
          this._RenderComponent(this._optionsCopy);
        }
      }

      this._renderNeeded = false;
    }
  },

  /**
   * Check needed for setting draggable attribute on the component.
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _IsDraggable: function _IsDraggable() {
    return !!this.options.dnd;
  },
  //* * @inheritdoc */
  _NotifyShown: function _NotifyShown() {
    this._super();

    this._notifyShownAttached();
  },
  //* * @inheritdoc */
  _NotifyAttached: function _NotifyAttached() {
    this._super();

    this._notifyShownAttached();
  },
  //* * @inheritdoc */
  _NotifyDetached: function _NotifyDetached() {
    this._super();

    this._notifyHiddenDetached();
  },
  //* * @inheritdoc */
  _NotifyHidden: function _NotifyHidden() {
    this._super();

    this._notifyHiddenDetached();
  },

  /**
   * Helper method to perform common logic for when
   * a DVT is hidden or detached from the DOM.
   * @memberof oj.dvtBaseComponent
   * @instance
   * @private
   */
  _notifyShownAttached: function _notifyShownAttached() {
    if (this._renderNeeded) {
      this._Render();
    }
  },

  /**
   * Helper method to perform common logic for when
   * a DVT is shown or detached from the DOM.
   * @memberof oj.dvtBaseComponent
   * @instance
   * @private
   */
  _notifyHiddenDetached: function _notifyHiddenDetached() {
    this._context.hideTooltips(); // Remove any pending busy states


    this._MakeReady();
  },

  /**
   * Sets an option change that was driven by user gesture.  Used in conjunction with _setOption to ensure that the
   * correct optionMetadata flag for writeback is set.
   * @param {string} key The name of the option to set.  Events will be suppressed for private keys (_foo)
   * @param {Object} value The value to set for the option.
   * @param {Object} optionMetadata The optionMetadata for the optionChange event
   * @memberof oj.dvtBaseComponent
   * @instance
   * @protected
   */
  _UserOptionChange: function _UserOptionChange(key, value, optionMetadata) {
    this._bUserDrivenChange = true;
    this.option(key, value, {
      _context: {
        writeback: true,
        optionMetadata: optionMetadata,
        internalSet: true,
        skipEvent: key.charAt(0) === '_'
      }
    });
    this._bUserDrivenChange = false;
  },
  //* * @inheritdoc */
  _NotifyContextMenuGesture: function _NotifyContextMenuGesture(menu, event, eventType) {
    // DVTs support context menus on touch hold release which is detected by the
    // toolkit and handled in _HandleEvent after receiving touch hold release event.
    if (eventType !== 'touch') {
      // Position context menus relative to the current keyboard focus when keyboard triggered
      if (eventType === 'keyboard') {
        var compElementRect = this.element[0].getBoundingClientRect();
        var focusElementRect = this._component.getKeyboardFocus() ? this._component.getKeyboardFocus().getBoundingClientRect() : null;
        var position = focusElementRect ? 'left+' + (focusElementRect.left + focusElementRect.width * 0.5 - compElementRect.left) + ' top+' + (focusElementRect.top + focusElementRect.height * 0.5 - compElementRect.top) : 'center';

        this._OpenContextMenu(event, eventType, {
          position: {
            at: position
          }
        });
      } else {
        this._super(menu, event, eventType);
      }
    }
  },

  /**
   * Returns a DVT component associated with a DOMElement
   * @param {Element} element The DOMElement to get the DVT component from.
   * @return {Object} The DVT component associated with the DOMElement or null
   * @memberof oj.dvtBaseComponent
   * @instance
   * @protected
   */
  _GetDvtComponent: function _GetDvtComponent(element) {
    var widget = Components.__GetWidgetConstructor(element)('instance');

    if (widget) {
      return widget._component;
    }

    return null;
  },

  /**
   * Converts an indexPath array to a string of the form '[index0][index1]...[indexN]'.
   * @param {Array} indexPath
   * @return {string} The resulting string.
   * @instance
   * @memberof oj.dvtBaseComponent
   * @protected
   */
  _GetStringFromIndexPath: function _GetStringFromIndexPath(indexPath) {
    var ret = '';

    for (var i = 0; i < indexPath.length; i++) {
      ret += '[' + indexPath[i] + ']';
    }

    return ret;
  },

  /**
   * Converts a string containing indices in the form '[index0][index1]...[indexN]' to an array of indices.
   * @param {string} subId
   * @return {Array} The resulting array to be used for locator indexPath.
   * @instance
   * @memberof oj.dvtBaseComponent
   * @protected
   */
  _GetIndexPath: function _GetIndexPath(subId) {
    var indexPath = [];
    var currentIndex = 0;

    while (subId.indexOf('[', currentIndex) > 0) {
      var start = subId.indexOf('[', currentIndex) + 1;
      var end = subId.indexOf(']', currentIndex);
      indexPath.push(Number(subId.substring(start, end)));
      currentIndex = end + 1;
    }

    return indexPath;
  },

  /**
   * Converts a string containing a single index in the form '[index]' into the numerical index.
   * @param {string} subId
   * @return {number}
   * @instance
   * @memberof oj.dvtBaseComponent
   * @protected
   */
  _GetFirstIndex: function _GetFirstIndex(subId) {
    return Number(this._GetFirstBracketedString(subId));
  },

  /**
   * Returns the first bracketed substring in the specified string.
   * @param {string} subId
   * @return {string}
   * @instance
   * @memberof oj.dvtBaseComponent
   * @protected
   */
  _GetFirstBracketedString: function _GetFirstBracketedString(subId) {
    var start = subId.indexOf('[') + 1;
    var end = subId.indexOf(']');
    return subId.substring(start, end);
  },

  /**
   * Returns an object containing the top level options key and subkeys for
   * deferred data options.  'root' is used for top level keys. For example,
   * {'areaLayers': ['areaDataLayer/areas', 'areaDataLayer/markers'] indicates
   * that we should check this.options['areaLayers'][i]['areaDataLayer']['areas']
   * and this.options['areaLayers'][i]['areaDataLayer']['markers']. To indicate
   * a top level option, use the options key 'root', i.e. {'root': ['items']}.
   * @return {Object}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetComponentDeferredDataPaths: function _GetComponentDeferredDataPaths() {
    return {};
  },

  /**
   * Returns an object containing the no clone paths for a component. For example,
   * {'areaLayers': {'areaDataLayer': {'areas': true, 'markers': true}}} indicates
   * that we should check this.options['areaLayers'][i]['areaDataLayer']['areas']
   * and this.options['areaLayers'][i]['areaDataLayer']['markers']. The base implementation
   * will handle the basic case where the deferred data path contains only top level data options.
   * @return {Object}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetComponentNoClonePaths: function _GetComponentNoClonePaths() {
    if (!this._noClonePaths) {
      this._noClonePaths = {};
      var self = this;

      var rootPaths = this._GetComponentDeferredDataPaths().root;

      if (rootPaths) {
        rootPaths.forEach(function (path) {
          self._noClonePaths[path] = true;
        });
      }
    }

    return this._noClonePaths;
  },

  /**
   * Resolves the deferred data for a component and returns whether there is any deferred data to wait on.
   * @return {boolean} True if all data has been resolved
   * @private
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _resolveDeferredDataItems: function _resolveDeferredDataItems() {
    // Reset stored options copy so we get the updated copy
    // Make a copy of options except for data options with the noClone parameter on DvtJsonUtils.
    // Cloning shouldn't be expensive if we're skipping data.
    this._optionsCopy = dvt.JsonUtils.clone(this.options, null, this._GetComponentNoClonePaths());
    this._numDeferredObjs = 0; // Fixing custom renderers will increment _numDeferredObjs if there are template slots
    // because the corresponding render functions cannot be created until the templateEnginePromise has resolved

    this._FixCustomRenderers(this._optionsCopy);

    var self = this;

    var paths = this._GetComponentDeferredDataPaths(); // Do an initial loop to determine if we need to copy the options object


    var pathKeys = Object.keys(paths);

    for (var k = 0; k < pathKeys.length; k++) {
      var path = pathKeys[k];
      var subpaths = paths[path]; // eslint-disable-next-line no-loop-func

      subpaths.forEach(function (subpath) {
        if (path === 'root') {
          self._resolveDeferredDataItem.bind(self)(self.options, self._optionsCopy, subpath);
        } else {
          var suboptions = self.options[path]; // Deal with arrays suboptions that are arrays like legend's options['sections']

          if (suboptions && suboptions instanceof Array) {
            for (var i = 0; i < suboptions.length; i++) {
              self._resolveDeferredDataItem.bind(self)(suboptions[i], self._optionsCopy[path][i], subpath);
            }
          }
          /* DataProvider Uptake : Commented out for code coverage. Uncomment for chart/nbox support
          else if (suboptions && suboptions[subpath]) {  // Deal with arrays suboptions that are keys in an object like chart's options['data']['series']
              self._resolveDeferredDataItem.bind(self)(suboptions, self._optionsCopy[path], subpath);
          }
          */

        }
      });
    }

    return this._numDeferredObjs === 0;
  },

  /**
   * Resolves a deferred data item for a given options object and option path.
   * @param {Object} optionsFrom The option object to copy from
   * @param {Object} optionsTo The option object to copy to
   * @param {string} path  The option path to use
   * @private
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _resolveDeferredDataItem: function _resolveDeferredDataItem(optionsFrom, optionsTo, path) {
    var optionPath = new DvtJsonPath(optionsFrom, path);
    var optionValue = optionPath.getValue();
    var self = this;

    if (optionValue instanceof Function) {
      // Call functions and update the option value, creating a Promise from the result
      optionValue = Promise.resolve(optionValue(this._GetDataContext(optionsFrom)));
    } else if (this._IsCustomElement() && Array.isArray(optionValue)) {
      // For custom elements, the getter always should return a Promise for
      // data options so we just always convert arrays to Promises in the setter
      optionValue = Promise.resolve(optionValue);
      optionPath.setValue(optionValue, true);
    }

    if (optionValue && this._DataProviderHandler.isDataProvider(optionValue)) {
      var isTreeDataProvider = this._DataProviderHandler.isTreeDataProvider(optionValue);

      optionValue = self._dataValuePromise[path] || new Promise(function (resolve) {
        var templateEnginePromise = self._TemplateHandler.getTemplateEngine();

        var dataProviderPromise = self._DataProviderHandler.fetchAllData(optionValue, path, true); // use cached results if available


        Promise.all([templateEnginePromise, dataProviderPromise]).then(function (values) {
          if (optionValue === self._dataValuePromise[path]) {
            // make sure only the most recent data fetch is processed
            var templateEngine = values[0];
            var data = values[1];

            var pathsValuesMap = self._ProcessTemplates(path, data, templateEngine, isTreeDataProvider, null, true); // use cached results if available


            self._dataValuePromise[path] = null;
            resolve(pathsValuesMap);
          }
        }, function () {
          self._dataValuePromise[path] = null;
        });
      });
      self._dataValuePromise[path] = optionValue;
    }

    if (optionValue instanceof Promise) {
      var renderCount = this._renderCount;
      optionValue.then(function (value) {
        var paths = [path];
        var values = [value];

        if (value.paths) {
          paths = value.paths;
          values = value.values;
        }

        self._renderDeferredData(renderCount, optionsTo, paths, values);
      }, function () {
        self._renderDeferredData(renderCount, optionsTo, [path], [[]]);
      });
      this._numDeferredObjs += 1;
    }
  },

  /**
   * Checks to see if all deferred data promises have been resolved or rejected,
   * updates the options copy with the resolved value and renders the component when ready.
   * @param {number} renderCount The render count when this Promise was evaluated
   * @param {Object} optionsTo The option object to copy to
   * @param {Array<string>} paths  The option path to use
   * @param {Array<object>} values The value to update the option path with
   * @private
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _renderDeferredData: function _renderDeferredData(renderCount, optionsTo, paths, values) {
    if (renderCount === this._renderCount) {
      this._numDeferredObjs -= 1;

      for (var i = 0; i < paths.length; i++) {
        new DvtJsonPath(optionsTo, paths[i]).setValue(values[i], true);
      }

      if (this._numDeferredObjs === 0) {
        this._RenderComponent(this._optionsCopy);

        this._optionsCopy = null;
      }
    }
  },

  /**
   * Clears the cache data provoder state for the given data property.
   * @param {string} dataProperty The property name of the data API
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _ClearDataProviderState: function _ClearDataProviderState(dataProperty) {
    this._DataProviderHandler.clear(dataProperty);

    this._TemplateHandler.release(dataProperty);

    this._dataValuePromise[dataProperty] = null;
  },

  /**
   * This is called for user options changes.
   * Any sub class that overrides this should call this._super
   * @param {Object} options the options object
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _OptionChangeHandler: function _OptionChangeHandler(options) {
    // If new data provider(s) were set, clear the corresponding data provider states.
    // Note that the options argument contains only options deemed to be new by the framework,
    // so any data provider values that are present in options are definitely new, and we don't need to check.
    var dataProperties = Object.keys(this._GetSimpleDataProviderConfigs());

    for (var i = 0; i < dataProperties.length; i++) {
      var dataProperty = dataProperties[i];

      if (Object.prototype.hasOwnProperty.call(options, dataProperty)) {
        this._ClearDataProviderState(dataProperty);
      }
    }
  },

  /**
   * Gets the top-level (non-event-listener) properties for the specified custom element
   * @param {string} elementName The custom element name
   * @return {Set} The Set of top-level (non-event-listener) properties
   * @public
   * @ignore
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  getElementPropertyNames: function getElementPropertyNames(elementName) {
    var propMetadata = oj.CustomElementBridge.getMetadata(elementName).properties;
    var keys = Object.keys(propMetadata).filter(function (prop) {
      return !propMetadata[prop]._eventListener;
    });
    var elementProperties = new Set();
    keys.forEach(function (key) {
      elementProperties.add(key);
    });
    return elementProperties;
  },

  /**
   * Processes the templates using the data provider's data and returns a map of values to options to be updated.
   * To use the default behaviour the component should override the _GetSimpleDataProviderConfigs.
   * Any sub class implementation of this should call this._super
   * The return's data has a _itemData that has the data for that item from the data provider.
   * @param {string} dataProperty The property name of the data API to lookup templates for
   * @param {Object} data The fetch results of the data provider. Contains the data and keys
   * @param {Object} templateEngine The template engine to be used to process templates
   * @param {boolean=} isTreeData True is the data has a tree structure, false if otherwise
   * @param {Object=} parentKey Parent key to be used for template context
   * @param {boolean} isRoot If true, a cache for the results is used.
   * @return {Object} An object with paths of components options to be updated and
   *                   their corresponding values.eg: {paths: [], values: []}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _ProcessTemplates: function _ProcessTemplates(dataProperty, data, templateEngine, isTreeData, parentKey, isRoot, updateChildren) {
    return this._TemplateHandler.processTemplates(dataProperty, data, templateEngine, isTreeData, parentKey, isRoot, updateChildren);
  },

  /**
   * Returns an object keyed by the data API name with templateName, templateElementName, resultPath, getAliasedPropertyNames, processChildrenData, processOptionData and maxFetchDepth which are used to process dataProvider data with templates.
   * The only required fields are templateName, templateElementName and resultPath
   * todo: add descriptions for parameters and return values for fields
   * @return {object} Object keyed by data API names, and objects of shape {templateName: string|fxn, templateElementName: string|fxn, resultPath: string, expandedKeySet: object, getAliasedPropertyNames: fxn, processChildrenData: fxn, processOptionData: fxn, maxFetchDepth: number} as values
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetSimpleDataProviderConfigs: function _GetSimpleDataProviderConfigs() {
    return {};
  },

  /**
   * Handles events from templateHandler and dataProviderHandler
   * Can be overriden but the sub class must call super
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetDPEventHandler: function _GetDPEventHandler() {
    return function (event) {
      if (event.type === 'notReady') {
        this._NotReady();
      } else if (event.type === 'dataUpdated') {
        this._Render();
      } else if (event.type === 'clearState') {
        this._ClearDataProviderState(event.detail.dataProperty);
      } else if (event.type === 'reset') {
        this._TemplateHandler.clear(event.detail.dataProperty, true);
      }
    }.bind(this);
  },

  /**
   * Creates a callback function that will be used to fetch additional data from data provider
   * Any sub class implementation of this should call this._super
   * @param {string} dataProperty The property name of the data API
   * @return {Function} fetch data callback that uses root data provider, expanded key set, node data and node key
   * to retrieve child nodes for the specified parent node
   * @private
   * @instance
   * @memberof oj.dvtBaseComponent
   * @ignore
   */
  _getFetchDataHandler: function _getFetchDataHandler(dataProperty) {
    var resultPath = this._GetSimpleDataProviderConfigs()[dataProperty].resultPath;

    var fetchDataHandlerFunc = function (rootDataProvider, expandedKeySet, nodeData, nodeKey) {
      // Get new data
      var dataPromise = this._DataProviderHandler.fetchChildrenData(dataProperty, rootDataProvider, nodeKey, expandedKeySet);

      var templateEnginePromise = this._TemplateHandler.getTemplateEngine();

      return Promise.all([dataPromise, templateEnginePromise]).then(function (values) {
        // Get templatized data
        var processedTemplates = this._ProcessTemplates(dataProperty, {
          data: values[0].data,
          keys: values[0].keys
        }, values[1], true, nodeKey, false, true);

        var childrenNodes = processedTemplates.values[0];

        if (nodeData) {
          // update parent data
          // eslint-disable-next-line no-param-reassign
          nodeData[resultPath] = childrenNodes;
        }
      }.bind(this));
    }.bind(this);

    return fetchDataHandlerFunc;
  },

  /**
   * Renders the component.
   * @param {Object} options The options to render the component with
   * @param {boolean} isResize True if we are rendering due to a resize event.
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _RenderComponent: function _RenderComponent(options, isResize) {
    // We do this check in _Render but since our rendering is asynchronous, the DOM state could have changed
    // in that time, e.g. when used inside an oj-switcher
    // Fix 18498656: If the component is not attached to a visible subtree of the DOM, rendering will fail because
    // getBBox calls will not return the correct values.
    // Note: Checking offsetParent() does not work here since it returns false for position: fixed.
    if (!this._context.isReadyToRender()) {
      this._renderNeeded = true;

      this._MakeReady();
    } else {
      // Cleanup
      this._CleanAllTemplates(); // If flowing layout is supported, resize may happen during render, but we
      // don't want the resize listener to be triggered as it causes double render.
      // Thus we should remove the resize listener temporarily.


      var bRemoveResizeListener = this._IsFlowingLayoutSupported() && this._resizeListener;

      if (bRemoveResizeListener) {
        this._removeResizeListener();
      }

      this._component.render(isResize ? null : options, this._width, this._height);

      if (bRemoveResizeListener) {
        this._addResizeListener();
      } // Remove the tabindex from the element to disable keyboard handling if the component
      // does not have a role on the parent element like for non-interactive legends.
      // Make sure not to override any app set tabindex.


      if (!this.element.attr('role')) {
        this.element.attr('tabindex', null);
      } else if (!this.element[0].hasAttribute('tabindex')) {
        this.element.attr('tabindex', 0);
      }
    }
  },

  /**
   * Returns the data context passed to data function callbacks.
   * @param {Object} options The options to retrieve the data context for
   * @return {Object}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  // eslint-disable-next-line no-unused-vars
  _GetDataContext: function _GetDataContext(options) {
    return {};
  },

  /**
   * Returns whether flowing layout is supported for the component.
   * If this returns true, the component will render at the preferred size of
   * the component if the user doesn't specify the width and height in the div.
   * If this returns false, the component will always render at the browser-
   * computed width and height.
   * @return {boolean}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _IsFlowingLayoutSupported: function _IsFlowingLayoutSupported() {
    return false;
  },

  /**
   * Returns a promise that is resolved when the component is finished rendering.
   * This can be used to determine when it is okay to call automation and other APIs on the component.
   * @returns {Promise}
   * @ignore
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  whenReady: function whenReady() {
    if (this._ready) {
      return Promise.resolve(true);
    }

    if (!this._promise) {
      var self = this;
      this._promise = new Promise(function (resolve) {
        self._promiseResolve = resolve;
      });
    }

    return this._promise;
  },

  /**
   * Called by component to declare rendering is not finished. This method currently handles the ready state
   * for the component whenReady API, the page level BusyContext, and the static whenReady API for the custom element
   * version of this component.
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _NotReady: function _NotReady() {
    // For component whenReady API
    this._ready = false; // For page level BusyContext
    // Only decrement ready state when there's no deferred data. Otherwise rendering will be blocked
    // until all deferred data are resolved and we will only get one ready state increment.

    if (this._numDeferredObjs === 0) {
      // If we've already registered a busy state with the page's busy context, don't need to do anything further
      if (!this._readyResolveFunc) {
        var busyContext = Context.getContext(this.element[0]).getBusyContext();
        var options = {
          description: "The component identified by '" + this.element.attr('id') + "' is being loaded."
        };
        this._readyResolveFunc = busyContext.addBusyState(options);
      }
    }
  },

  /**
   * Called by component to declare rendering is finished. This method currently handles the ready state
   * for the component whenReady API, the page level BusyContext, and the static whenReady API for the custom element
   * version of this component.
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _MakeReady: function _MakeReady() {
    // For component whenReady API
    if (this._promiseResolve) {
      this._promiseResolve(true);

      this._promiseResolve = null;
    }

    this._ready = true;
    this._promise = null; // For page level BusyContext

    if (this._readyResolveFunc) {
      this._readyResolveFunc();

      this._readyResolveFunc = null;
    }
  },

  /**
   * Sanitize options variables
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _ProcessOptions: function _ProcessOptions() {
    // Convert the tooltip to an object if the deprecated API structure is passed in
    var tooltip = this.options.tooltip;

    if (tooltip && tooltip._renderer) {
      this.options.tooltip = {
        renderer: this._GetTemplateRenderer(tooltip._renderer, 'tooltip')
      };
    }
  },

  /**
   * Returns a wrapper function for custom elements that converts an object
   * returned by a custom renderer into an old format supported by widgets
   * and toolkit code.
   * @param {Function} origRenderer Renderer function called to create custom content
   * @return {Function} A wrapper function that will used to convert result into toolkit format
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _WrapCustomElementRenderer: function _WrapCustomElementRenderer(origRenderer) {
    var self = this;

    var customRenderer = function customRenderer(context) {
      // add dvt context for the knockout template rendering
      // eslint-disable-next-line no-param-reassign
      context._dvtcontext = self._context;
      var obj = origRenderer(context); // template cleanup section - template name and cleanup function are passed through context

      if (context._templateName && context._templateCleanup) {
        self._AddTemplate(context._templateName, context._templateCleanup);
      } // tooltip case: don't check 'insert' property, if 'preventDefault' is set to true


      if (obj && obj.preventDefault !== true && obj.insert) {
        var insertObj = obj.insert; // handle returns for knockout template renderer

        if (insertObj.classList && insertObj.classList.contains('oj-dvtbase')) {
          return self._GetDvtComponent(insertObj);
        }

        return insertObj;
      }

      return null;
    };

    return origRenderer ? customRenderer : null;
  },

  /**
   * Iterates through custom renderer options and replaces them with wrapper
   * functions that supports format accepted by DVT Toolkit components
   * @param {Object} options Options for rendering the component
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _FixCustomRenderers: function _FixCustomRenderers(options) {
    if (this._IsCustomElement()) {
      var renderers = this._GetComponentRendererOptions();

      for (var i = 0; i < renderers.length; i++) {
        var optionPath = renderers[i].path;
        var slot = renderers[i].slot;

        var templates = this._TemplateHandler.getTemplates();

        if (slot && templates[slot] && templates[slot][0]) {
          this._ProcessInlineTemplateRenderer(options, optionPath, templates[slot][0], slot);
        } else {
          var path = new DvtJsonPath(options, optionPath);
          var value = path.getValue();

          if (value) {
            path.setValue(this._WrapCustomElementRenderer(value), true);
          }
        }
      }
    }
  },

  /**
   * Returns an array of options that contain custom renderer paths
   * for the given component.
   * @return {Array}
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _GetComponentRendererOptions: function _GetComponentRendererOptions() {
    return [{
      path: 'tooltip/renderer',
      slot: 'tooltipTemplate'
    }];
  },

  /**
   * Creates a callback function that will be used as a custom renderer for a template that will be used directly.
   * @param {Function} templateFunction Template function used to render a knockout template
   * @param {string} templateName The name of the template
   * @return {Function} A function that will be used as a custom renderer
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _GetTemplateRenderer: function _GetTemplateRenderer(templateFunction, templateName) {
    var self = this;

    var templateRenderer = function templateRenderer(context) {
      // Create a dummy div
      var dummyDiv = document.createElement('div');
      dummyDiv.style.display = 'none'; // Call the ko template renderer with the dummy div and context

      templateFunction({
        parentElement: dummyDiv,
        context: context
      });
      var elem = dummyDiv.children[0];

      if (elem) {
        // Save a reference to cleanup function for the dummyDiv
        // for ko cleanup to prevent memory leaks
        self._AddTemplate(templateName, function () {
          $(dummyDiv).remove();
        });

        dummyDiv.removeChild(elem);
        $(dummyDiv).remove();
        return elem;
      }

      return null;
    };

    return templateRenderer;
  },

  /**
   * Creates a callback function that will be used as a custom renderer for data items.
   * For components like ojDiagram and ojThematicMap that supports ko templates for stamping
   * data items, the component will reparent the svg element so we have special dummyDiv handling
   * for these cases.
   * @param {Function} templateFunction Template function used to render a knockout template
   * @param {string} templateName The name of the template
   * @return {Function} A function that will be used as a custom renderer
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _GetTemplateDataRenderer: function _GetTemplateDataRenderer(templateFunction, templateName) {
    var self = this;

    var templateRenderer = function templateRenderer(context) {
      // Create a dummy div
      var dummyDiv = document.createElement('div');
      dummyDiv.style.display = 'none';
      dummyDiv._dvtcontext = self._context;
      self.element.append(dummyDiv); // @HTMLUpdateOK
      // Call the ko template renderer with the dummy div and context

      templateFunction({
        parentElement: dummyDiv,
        data: context.data
      });
      var elem = dummyDiv.children[0];

      if (elem) {
        // Save a reference to cleanup function for the dummyDiv
        // for ko cleanup to prevent memory leaks
        self._AddTemplate(templateName, function () {
          $(dummyDiv).remove();
        }); // The dummy div can be removed for custom svg elements, but need to be
        // kept around for stamped DVTs so the oj components aren't removed.


        if (elem.namespaceURI === 'http://www.w3.org/2000/svg') {
          dummyDiv.removeChild(elem);
          $(dummyDiv).remove();
          return elem;
        }

        return self._GetDvtComponent(elem);
      }

      return null;
    };

    return templateRenderer;
  },

  /**
   * Returns a wrapper funtion used to render inline templates
   * @param {Object} origRenderer The original template renderer.
   * @param {string} templateName The name of the template
   * @param {string} option The option name
   * @return {Function} Returns a wrapper funtion used to render inline templates
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  // eslint-disable-next-line no-unused-vars
  _WrapInlineTemplateRenderer: function _WrapInlineTemplateRenderer(origRenderer, templateName, option) {
    // default implementation does nothing.
    return origRenderer;
  },

  /**
   * Creates a callback function that will be used as a custom renderer for an inline template slot.
   * @param {Object} options Options for rendering the component
   * @param {string} optionPath The path to set the generated renderer function
   * @param {Element} templateElement The <template> element
   * @param {string} templateName The name of the template
   * @return {Function} A function that will be used as a custom renderer
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _ProcessInlineTemplateRenderer: function _ProcessInlineTemplateRenderer(options, optionPath, templateElement, templateName) {
    var renderCount = this._renderCount;
    this._numDeferredObjs += 1;

    var templateEnginePromise = this._TemplateHandler.getTemplateEngine();

    templateEnginePromise.then(function (templateEngine) {
      var templateRenderer = function (context) {
        var nodes = templateEngine.execute(this.element[0], templateElement, context);

        if (nodes && nodes.length > 0) {
          Object.defineProperty(context, '_templateCleanup', {
            value: function value() {
              nodes.forEach(function (node) {
                templateEngine.clean(node);
              });
            },
            enumerable: false
          });
          Object.defineProperty(context, '_templateName', {
            value: templateName,
            enumerable: false
          });
          return {
            insert: nodes
          };
        }

        return {
          preventDefault: true
        };
      }.bind(this);

      templateRenderer = this._WrapInlineTemplateRenderer(templateRenderer, templateName, optionPath);

      this._renderDeferredData(renderCount, options, [optionPath], [this._WrapCustomElementRenderer(templateRenderer)]);
    }.bind(this));
  },

  /**
   * Cleans all templates stored by the component
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _CleanAllTemplates: function _CleanAllTemplates() {
    var templateNames = Object.keys(this._templateMap);

    for (var i = 0; i < templateNames.length; i++) {
      var templateName = templateNames[i];

      this._CleanTemplate(templateName);
    }

    this._templateMap = {};
  },

  /**
   * Cleans a specific template stored by the component
   * @param {string} templateName The name of the template to clean
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _CleanTemplate: function _CleanTemplate(templateName) {
    if (this._templateMap[templateName]) {
      var length = this._templateMap[templateName].length;

      for (var i = 0; i < length; i++) {
        this._templateMap[templateName][i]();
      }

      this._templateMap[templateName] = [];
    }
  },

  /**
   * Adds a cleanup function that should be used to cleanup a specific template.
   * @param {string} templateName The name of the template to clean
   * @param {Function} cleanupCallback A callback function to cleanup the template
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _AddTemplate: function _AddTemplate(templateName, cleanupCallback) {
    if (!this._templateMap[templateName]) {
      this._templateMap[templateName] = [];
    }

    this._templateMap[templateName].push(cleanupCallback);
  },
  //* * @inheritdoc */
  _CompareOptionValues: function _CompareOptionValues(option, value1, value2) {
    switch (option) {
      case 'hiddenCategories':
      case 'highlightedCategories':
      case 'selection':
        return oj.Object.compareValues(value1, value2);

      default:
        return this._super(option, value1, value2);
    }
  }
}, true);



/**
 * <p>The SVG DOM that this component generates should be treated as a black box, as it is subject to change.</p>
 *
 * @ojfragment warning
 * @memberof oj.dvtBaseComponent
 */

/**
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>The application is responsible for populating the shortDesc value in the
 * component properties object with meaningful descriptors when the component does
 * not provide a default descriptor.</p>
 *
 * @ojfragment a11y
 * @memberof oj.dvtBaseComponent
 */

/**
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>The application is responsible for populating the shortDesc value in the
 * component properties object with meaningful descriptors when the component does
 * not provide a default descriptor.  Since component terminology for keyboard
 * and touch shortcuts can conflict with those of the application, it is the
 * application's responsibility to provide these shortcuts, possibly via a help
 * popup.</p>
 *
 * @ojfragment a11yKeyboard
 * @memberof oj.dvtBaseComponent
 */

/**
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * <p>
 *   As with any JET component, in the unusual case that the directionality (LTR or RTL) changes post-init, the
 *   component must be <code class="prettyprint">refresh()</code>ed.
 * </p>
 *
 * @ojfragment rtl
 * @memberof oj.dvtBaseComponent
 */

/**
 * <h4>Tracking Resize</h4>
 * <p>By default, the element will track resizes and render at the new size. This functionality adds a small
 * overhead to the initial render for simple elements like gauges or spark charts, which become noticable when
 * using large numbers of these simple elements. To disable resize tracking, set <code class="prettyprint">trackResize</code>
 * to <code class="prettyprint">off</code>. The application can manually request a re-render at any time by calling
 * the <code class="prettyprint">refresh</code> function.
 * </p>
 *
 * @ojfragment fragment_trackResize
 * @memberof oj.dvtBaseComponent
 */

  // Return so we can share shape parsing utils for DVTs
  ;return DvtAttributeUtils;
});