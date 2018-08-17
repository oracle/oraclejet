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
   * @param {string} idAttr The id field in the JSON data
   * @return {Function} shredder The shredder function takes a Response object as
   * parameter and returns a Promise which resolves to an array of objects which have the following
   * structure:
   * {
   *  'name': storeName, 
   *  'resourceIdentifier': resourceIdentifier, 
   *  'keys': idArray, 
   *  'data': dataArray,
   *  'resourceType' : 'single' or 'collection'
   * }
   */
  var getShredder = function (storeName, idAttr) {
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
                return jsonEntry[idAttr];
              });
              dataArray = payloadJson;
            } else {
              idArray[0] = payloadJson[idAttr];
              dataArray[0] = payloadJson;
              resourceType = 'single';
            }
          } catch (err) {
            logger.log("Offline Persistence Toolkit simpleRestJsonShredding: Error during shredding: " + err);
          }
        }
        return [{
            'name': storeName,
            'resourceIdentifier': resourceIdentifier,
            'keys': idArray,
            'data': dataArray,
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
   * @return {Function} unshredder The unshredder function takes an array of objects 
   * and a response object as parameters. The array of objects has the following
   * structure:
   * {
   *  'name': storeName, 
   *  'resourceIdentifier': resourceIdentifier, 
   *  'keys': idArray, 
   *  'data': dataArray,
   *  'resourceType' : 'single' or 'collection'
   * }
   * The unshredder returns a Promise which resolves to a Response object.
   */
  var getUnshredder = function () {
    return function (data, response) {
      logger.log("Offline Persistence Toolkit simpleJsonShredding: Unshredding Response");
      return Promise.resolve().then(function () {
        var dataContent = _retrieveDataContent(data);
        return persistenceUtils.setResponsePayload(response, dataContent);
      }).then(function (response) {
        response.headers.set('x-oracle-jscpt-cache-expiration-date', '');
        return Promise.resolve(response);
      });
    };
  };

  // helper method to retrieve the data content from the valueArray. In general,
  // valueArray is an array where each element contains an object where the 
  // key is the name of the store while the value is the shredded data from 
  // that store. For simple json shredder/unshredder, the valueArray should 
  // contain only one entry.
  function _retrieveDataContent(valueArray) {
    if (!valueArray || valueArray.length !== 1) {
      throw new Error({message: 'shredded data is not in the correct format.'});
    }
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

