/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['./persistenceUtils', './impl/logger'], function (persistenceUtils, logger) {
  'use strict';
    
  /**
   * @export
   * @class simpleJsonShredding
   * @classdesc Shredder for REST services which have a JSON structure. If the
   * JSON contained in the payload is hierchical the shredder will only process
   * the first level in the hierarchy. The shredder transforms the JSON payload
   * into a flat list of ids and data items.
   * @hideconstructor
   */

  /**
   * Return the shredder for simple JSON
   * @method
   * @name getShredder
   * @memberof simpleJsonShredding
   * @param {string} storeName Name of the Persistent Store into which the shredded data should be stored
   * @param {string|Array} idAttr The id field or array of fields in the JSON data
   * @param {DataMapping=} dataMapping Optional dataMapping to apply to the data 
   * @return {Function} shredder The shredder function takes a Response object as
   * parameter and returns a Promise which resolves to an array of objects which have the following
   * structure:
   * <code>
   * <pre>
   * {
   *  'name': storeName, 
   *  'resourceIdentifier': resourceIdentifier, 
   *  'keys': idArray, 
   *  'data': dataArray,
   *  'resourceType' : 'single' or 'collection'
   * }
   * </pre>
   * </code>
   */
  var getShredder = function (storeName, idAttr, dataMapping) {
    return function (response) {
      logger.log("Offline Persistence Toolkit simpleJsonShredding: Shredding Response");
      var responseClone = response.clone();
      var resourceIdentifier = responseClone.headers.get('Etag');
      return responseClone.text().then(function (payload) {
        var idArray = [];
        var dataArray = [];
        var resourceType = 'collection';
        if (payload &&
          payload.length > 0) {
          try {
            var payloadJson = JSON.parse(payload);
            if (Array.isArray(payloadJson)) {
              idArray = payloadJson.map(function (jsonEntry) {
                if (idAttr instanceof Array) {
                  var key = [];
                  idAttr.forEach(function(keyAttr) {
                    key.push(jsonEntry[keyAttr])
                  });
                  return key;
                } else {
                  return jsonEntry[idAttr];
                }
              });
              dataArray = payloadJson;
            } else {
              if (idAttr instanceof Array) {
                var key = [];
                idAttr.forEach(function(keyAttr) {
                  key.push(payloadJson[keyAttr])
                });
                idArray[0] = key;
              } else {
                idArray[0] = payloadJson[idAttr];
              }
              dataArray[0] = payloadJson;
              resourceType = 'single';
            }
          } catch (err) {
            logger.log("Offline Persistence Toolkit simpleRestJsonShredding: Error during shredding: " + err);
          }
        }
        var mappedData = persistenceUtils._mapData(idArray, dataArray, dataMapping);
        return [{
            'name': storeName,
            'resourceIdentifier': resourceIdentifier,
            'keys': mappedData.keys,
            'data': mappedData.data,
            'resourceType' : resourceType
          }];
      });
    };
  };

  /**
   * Return the unshredder for simple JSON
   * @method
   * @name getUnshredder
   * @memberof simpleJsonShredding
   * @param {DataMapping=} dataMapping Optional dataMapping to apply to the data 
   * @return {Function} unshredder The unshredder function takes an array of objects 
   * and a response object as parameters. The array of objects has the following
   * structure:
   * <code>
   * <pre>
   * {
   *  'name': storeName, 
   *  'resourceIdentifier': resourceIdentifier, 
   *  'keys': idArray, 
   *  'data': dataArray,
   *  'resourceType' : 'single' or 'collection'
   * }
   * </pre>
   * </code>
   * The unshredder returns a Promise which resolves to a Response object.
   */
  var getUnshredder = function (dataMapping) {
    return function (data, response) {
      logger.log("Offline Persistence Toolkit simpleJsonShredding: Unshredding Response");
      return Promise.resolve().then(function () {
        if (!data || data.length !== 1) {
          throw new Error({message: 'shredded data is not in the correct format.'});
        }
        var unmappedData = persistenceUtils._unmapData(data[0].keys, data[0].data, dataMapping);
        var dataContent = _retrieveDataContent([{
          'keys': unmappedData.keys,
          'data': unmappedData.data,
          'resourceType' : data[0].resourceType
        }]);
        return persistenceUtils.setResponsePayload(response, dataContent);
      }).then(function (response) {
        response.headers.set('x-oracle-jscpt-cache-expiration-date', '');
        return response;
      });
    };
  };

  // helper method to retrieve the data content from the valueArray. In general,
  // valueArray is an array where each element contains an object where the 
  // key is the name of the store while the value is the shredded data from 
  // that store. For simple json shredder/unshredder, the valueArray should 
  // contain only one entry.
  function _retrieveDataContent(valueArray) {
    var data = valueArray[0].data;
    if (data && data.length === 1 && valueArray[0].resourceType === 'single') {
      return data[0];
    }
    return data;
  };

  return {
    getShredder: getShredder,
    getUnshredder: getUnshredder
  };
});

