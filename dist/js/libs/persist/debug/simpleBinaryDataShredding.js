/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['./persistenceUtils'], function (persistenceUtils) {
  'use strict';
    
  /**
   * @export
   * @class simpleBinaryDataShredding
   * @classdesc Shredder for simple binary data GET requests. The URL is used as key.
   */
  
  /**
   * Return the shredder for simple Binary Data
   * @method
   * @name getShredder
   * @memberof! simpleBinaryDataShredding
   * @instance
   * @param {string} storeName Name of the Persistent Store into which the shredded data should be stored
   * @return {Function} shredder The shredder function takes a Response object as
   * parameter and returns a Promise which resolves to an array of objects which have the following
   * structure:
   * {
   *  'name': storeName, 
   *  'resourceIdentifier': resourceIdentifier, 
   *  'keys': idArray, 
   *  'data': dataArray,
   *  'resourceType' : 'single'
   * }
   */
  var getShredder = function (storeName) {
    return function (response) {
      var responseClone = response.clone();
      var resourceIdentifier = responseClone.headers.get('Etag');
      return responseClone.blob().then(function (blob) {
        var idArray = [];
        var dataArray = [];
        idArray[0] = response.url == null || response.url.length == 0 ? response.headers.get('x-oracle-jscpt-response-url') : response.url;
        dataArray[0] = blob;
        return [{
          'name': storeName,
          'resourceIdentifier': resourceIdentifier,
          'keys': idArray,
          'data': dataArray,
          'resourceType' : 'single'
        }];
      });
    }
  };

  /**
   * Return the unshredder for simple Binary Data
   * @method
   * @name getUnshredder
   * @memberof! simpleBinaryDataShredding
   * @instance
   * @return {Function} unshredder The unshredder function takes an array of objects 
   * and a response object as parameters. The array of objects has the following
   * structure:
   * {
   *  'name': storeName, 
   *  'resourceIdentifier': resourceIdentifier, 
   *  'keys': idArray, 
   *  'data': dataArray,
   *  'resourceType' : 'single'
   * }
   * The unshredder returns a Promise which resolves to a Response object.
   */
  var getUnshredder = function () {
    return function (data, response) {
      var dataContent = _retrieveDataContent(data);
      return persistenceUtils.setResponsePayload(response, dataContent).then(function (response) {
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

