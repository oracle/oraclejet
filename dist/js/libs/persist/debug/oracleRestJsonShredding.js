/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['./persistenceUtils', './impl/logger'], function (persistenceUtils, logger) {
  'use strict';
  
  /**
   * @export
   * @class oracleRestJsonShredding
   * @classdesc Shredder for REST services which conform to the Oracle REST standard.
   * @hideconstructor
   */
  
  /**
   * Return the shredder for Oracle REST JSON
   * @method
   * @name getShredder
   * @memberof oracleRestJsonShredding
   * @static
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
      logger.log("Offline Persistence Toolkit oracleRestJsonShredding: Shredding Response");
      var responseClone = response.clone();
      var resourceIdentifier = responseClone.headers.get('X-ORACLE-DMS-ECID');
      return responseClone.text().then(function (payload) {
        var idArray = [];
        var dataArray = [];
        var resourceType = 'collection';
        if (payload != null &&
          payload.length > 0) {
          try {
            var payloadJson = JSON.parse(payload);
            if (payloadJson.items != null) {
              idArray = payloadJson.items.map(function (jsonEntry) {
                if (idAttr instanceof Array) {
                  var key = [];
                  idAttr.forEach(function(keyAttr) {
                    key.push(jsonEntry[keyAttr])
                  });
                  return key;
                }
                return jsonEntry[idAttr];
              });
              dataArray = payloadJson.items;
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
            logger.log("Offline Persistence Toolkit oracleRestJsonShredding: Error during shredding: " + err);
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
   * Return the unshredder for Oracle REST JSON
   * @method
   * @name getUnshredder
   * @memberof oracleRestJsonShredding
   * @static
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
      logger.log("Offline Persistence Toolkit oracleRestJsonShredding: Unshredding Response");
      if (!data || data.length !== 1) {
        throw new Error({message: 'shredded data is not in the correct format.'});
      }
      var unmappedData = persistenceUtils._unmapData(data[0].keys, data[0].data, dataMapping);
      var payload = _buildPayload([{
        'keys': unmappedData.keys,
        'data': unmappedData.data,
        'resourceType' : data[0].resourceType
      }]);
      return persistenceUtils.setResponsePayload(response, payload).then(function (response) {
        response.headers.set('x-oracle-jscpt-cache-expiration-date', '');
        return response;
      });
    };
  }

  function _buildPayload (value) {
    var payload;
    var data = value[0].data;
    if (data && data.length === 1 && value[0].resourceType === 'single') {
      payload = data[0];
    } else {
      payload = {items: data,
        count: data.length};
    }
    return payload;
  };

  return {
    getShredder: getShredder,
    getUnshredder: getUnshredder};
});

