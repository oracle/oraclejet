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
   * @param {string} idAttr The id field in the JSON data
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
  var getShredder = function (storeName, idAttr) {
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
                return jsonEntry[idAttr];
              });
              dataArray = payloadJson.items;
            } else {
              idArray[0] = payloadJson[idAttr];
              dataArray[0] = payloadJson;
              resourceType = 'single';
            }
          } catch (err) {
            logger.log("Offline Persistence Toolkit oracleRestJsonShredding: Error during shredding: " + err);
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
   * Return the unshredder for Oracle REST JSON
   * @method
   * @name getUnshredder
   * @memberof oracleRestJsonShredding
   * @static
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
  var getUnshredder = function () {
    return function (value, response) {
      logger.log("Offline Persistence Toolkit oracleRestJsonShredding: Unshredding Response");
      var payload = _buildPayload(value, response);
      return persistenceUtils.setResponsePayload(response, payload).then(function (response) {
        response.headers.set('x-oracle-jscpt-cache-expiration-date', '');
        return response;
      });
    };
  }

  function _buildPayload (value, response) {
    if (!value || value.length !== 1) {
      throw new Error({message: 'shredded data is not in the correct format.'});
    }
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

