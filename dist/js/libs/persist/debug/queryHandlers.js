/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['./persistenceManager', './persistenceStoreManager', './persistenceUtils', './impl/logger', './impl/sql-where-parser.min'],
  function (persistenceManager, persistenceStoreManager, persistenceUtils, logger, sqlWhereParser) {
    'use strict';
  
    /**
     * @class queryHandlers
     * @classdesc Contains out of the box query handlers.
     * @export
     * @hideconstructor
     */
    
    /**
     * Returns the Oracle Rest Query Handler which handles the query parameters
     * according to the Oracle Rest Specification. Note the Oracle Rest Specification
     * requires queries to be specified in the q parameter e.g. ?q= but does not
     * enforce a particular format for the query itself. Therefore this API takes a parameter
     * createQueryExp where the developer can plugin a function which takes the parameter
     * value and returns a persistence store query. If none if provided then the
     * default is to use the ADFBc REST query parameter structure which has the form:
     * ?q=EmpId=100. Offline supports the following ADFBc operators in the expression:
     * >, <, >=, <=, =, !=, AND, OR, LIKE. 
     * In addition, the query handler supports the limit and offset query parameters
     * used for paging in the Oracle REST specification.
     * @method
     * @name getOracleRestQueryHandler
     * @memberof queryHandlers
     * @static
     * @param {string} storeName The store name against which queries should be executed
     * @param {function=} createQueryExp Optional function takes URL query parameters
     * and returns a query expression which will be executed against the persistent store.
     * If null then use the ADFBc REST query parameter structure.
     * @param {DataMapping=} dataMapping Optional dataMapping to apply to the data 
     * @return {Function} Returns the query handler
     */
    function getOracleRestQueryHandler(storeName, createQueryExp, dataMapping) {
      createQueryExp = createQueryExp || function (urlParams) {
        return _createQueryFromAdfBcParams(urlParams, null);
      }
      return function (request, options) {
        if (request.method == 'GET' ||
          request.method == 'HEAD') {
          logger.log("Offline Persistence Toolkit queryHandlers: OracleRestQueryHandler processing request");
          var urlParams = request.url.split('?');
          var findQuery = {};
          var queryParams;
          var queryParamsIter;

          if (typeof URLSearchParams === 'undefined') {
            // IE does not support URLSearchParams so parse
            // it ourselves
            queryParamsIter = _parseURLSearchParams(urlParams[1]);
          } else {
            queryParamsIter = (new URLSearchParams(urlParams[1])).entries();
          }

          var queryParamEntry;
          var queryParamName;
          var queryParamValue;
          var limit;
          var offset;

          do {
            queryParamEntry = queryParamsIter.next();

            if (queryParamEntry['value'] != null) {
              queryParamName = queryParamEntry['value'][0];
              queryParamValue = queryParamEntry['value'][1];

              if (queryParamName == 'q') {
                queryParams = queryParamValue;
              } else if (queryParamName == 'limit') {
                limit = queryParamValue;
              } else if (queryParamName == 'offset') {
                offset = queryParamValue;
              }
            }
          } while (!queryParamEntry['done']);

          var findQuery = persistenceUtils._mapFindQuery(createQueryExp(queryParams), dataMapping);

          var shredder;
          var unshredder;

          if (options['jsonProcessor'] != null) {
            shredder = options['jsonProcessor']['shredder'];
            unshredder = options['jsonProcessor']['unshredder'];
          }

          if (shredder != null &&
            unshredder != null) {
            return _processQuery(request, storeName, findQuery, shredder, unshredder, offset, limit).then(function(response) {
              if (!response) {
                return Promise.resolve();
              }
              var responseClone = response.clone();
              return responseClone.text().then(function (payload) {
                if (payload != null &&
                  payload.length > 0) {
                  try {
                    var payloadJson = JSON.parse(payload);
                    if (!payloadJson.links) {
                      payloadJson.links = [{rel: 'self', href: request.url}];
                      return persistenceUtils.setResponsePayload(response, payloadJson).then(function (response) {
                        return Promise.resolve(response);
                      });
                    } else {
                      return Promise.resolve(response);
                    }
                  } catch (err) {
                  }
                }
              });
            });
          }
        }
        return Promise.resolve();
      };
    };
    
    function _processQuery(request, storeName, findQuery, shredder, unshredder, offset, limit) {
      // first check of we have a collection query or single row query
      // collection query will always return true for cache.hasMatch()
      // single row query will return hasMatch true if that query
      // was executed before, if not we have to query for it
      return persistenceManager.getCache().hasMatch(request, {ignoreSearch: true}).then(function (hasMatch) {
        return persistenceStoreManager.openStore(storeName).then(function (store) {
          if (hasMatch) {
            // check if it's a single row query. If so then we don't need to
            // do a find.
            return persistenceManager.getCache().match(request, {ignoreSearch: true}).then(function (response) {
              if (response.headers.get('x-oracle-jscpt-resource-type') === 'single') {
                return Promise.resolve();
              } else {
                // query in the shredded data
                return store.find(findQuery);
              }
            });
          } else {
            // this might be a single row query so we need to parse the URL for an id based query
            var id = _getRequestUrlId(request);
            if (id) {
              return store.findByKey(id);
            }
            return Promise.resolve([]);
          }
        }).then(function (results) {
          return persistenceManager.getCache().match(request, {ignoreSearch: true}).then(function (response) {
            if (response) {
              var hasMore = false;
              var totalResults = 0;
              if (results) {
                totalResults = results.length;
                if (offset
                  && offset > 0) {
                  if (offset < results.length)
                  {
                    hasMore = true;
                  }
                  else
                  {
                    hasMore = false;
                  }
                  results = results.slice(offset, results.length);
                }
                if (limit
                  && limit > 0) {
                  if (limit <= results.length)
                  {
                    hasMore = true;
                  }
                  else
                  {
                    hasMore = false;
                  }
                  results = results.slice(0, limit);
                }
              }
              return shredder(response).then(function (dataArray) {
                var resourceType = dataArray[0].resourceType;
                var transformedResults = {
                  name: storeName,
                  data: results != null ? results : dataArray[0].data,
                  resourceType: resourceType
                };
                return unshredder([transformedResults], response).then(function (response) {
                  // add limit and offset
                  var responseClone = response.clone();
                  return responseClone.text().then(function (payload) {
                    if (payload != null &&
                      payload.length > 0) {
                      try {
                        var payloadJson = JSON.parse(payload);
                        if (payloadJson.items != null) {
                          if (limit) {
                            payloadJson.limit = parseInt(limit, 10);
                          }
                          if (offset) {
                            payloadJson.offset = parseInt(offset, 10);
                          }
                          payloadJson.hasMore = hasMore;
                          payloadJson.totalResults = totalResults;
                        }
                        return persistenceUtils.setResponsePayload(response, payloadJson);
                      } catch (err) {
                      }
                    } else {
                      return response;
                    }
                  });
                });
              });
            } else if (results && Object.keys(results).length > 0) {
              // this means have a single query result
              var collectionUrl = _getRequestCollectionUrl(request);
              if (collectionUrl) {
                return persistenceUtils.requestToJSON(request).then(function (requestObj) {
                  requestObj.url = collectionUrl;
                  return persistenceUtils.requestFromJSON(requestObj).then(function (collectionRequest) {
                    return persistenceManager.getCache().match(collectionRequest, {ignoreSearch: true}).then(function (response) {
                      if (response) {
                        var transformedResults = {
                          name: storeName,
                          data: [results],
                          resourceType: 'single'
                        };
                        return unshredder([transformedResults], response);
                      }
                    });
                  });
                });
              } else {
                return Promise.resolve();
              }
            } else {
              return Promise.resolve();
            }
          });
        });
      });
    };
    
    function _createQueryFromAdfBcParams(value) {
      var findQuery = {};

      if (value) {
        var parser = new sqlWhereParser();
        var queryExpArray = value.split(';');
        var i;
        var selectorQuery = {};
        var selectorQueryItemArray = [];
        var selectorQueryItem = {};

        for (i = 0; i < queryExpArray.length; i++) {
          
          selectorQueryItem = parser.parse(queryExpArray[i], function(operatorValue, operands)
            {
              operatorValue = operatorValue.toUpperCase();
              // the LHS operand is always a value operand
              if (operatorValue != 'AND' &&
                operatorValue != 'OR') {
                operands[0] = 'value.' + operands[0];
              }
              var lhsOp = operands[0];
              var rhsOp = operands[1];
              var returnExp = {};
              switch (operatorValue) {
                case '>':
                  returnExp[lhsOp] = {
                    $gt: rhsOp
                  };
                  break;
                case '<':
                  returnExp[lhsOp] = {
                    $lt: rhsOp
                  };
                  break;
                case '>=':
                  returnExp[lhsOp] = {
                    $gte: rhsOp
                  };
                  break;
                case '<=':
                  returnExp[lhsOp] = {
                    $lte: rhsOp
                  };
                  break;
                case '=':
                  returnExp[lhsOp] = {
                    $eq: rhsOp
                  };
                  break;
                case '!=':
                  returnExp[lhsOp] = {
                    $ne: rhsOp
                  };
                  break;
                case 'AND':
                  returnExp = {
                    $and: operands
                  };
                  break;
                case 'OR':
                  returnExp = {
                    $or: operands
                  };
                  break;
                case 'LIKE':
                  rhsOp = rhsOp.replace('%', '.+');
                  returnExp[lhsOp] = {
                    $regex: rhsOp
                  };
                  break;
                case 'BETWEEN':
                  var betweenOperands = [];
                  betweenOperands[0] = {};
                  betweenOperands[1] = {};
                  betweenOperands[0][lhsOp] = {$gte: operands[1]};
                  betweenOperands[1][lhsOp] = {$lte: operands[2]};
                  returnExp = {
                    $and: betweenOperands
                  };
                  break;
              }
              return returnExp;
            });
            selectorQueryItemArray.push(selectorQueryItem);
          }
          if (selectorQueryItemArray.length > 1) {
            selectorQuery['$and'] = selectorQueryItemArray;
          } else if (selectorQueryItemArray.length == 1) {
            selectorQuery = selectorQueryItemArray[0];
          }
          if (Object.keys(selectorQuery).length > 0) {
            findQuery.selector = selectorQuery;
          }
        }
      return findQuery;
    };
  
    /**
     * Returns the Simple Query Handler which matches the URL query parameter/value pairs
     * against the store's field/value pairs.
     * @method
     * @name getSimpleQueryHandler
     * @memberof queryHandlers
     * @static
     * @param {string} storeName The store name against which queries should be executed
     * @param {Array=} ignoreUrlParams An array of URL params to be ignored
     * @param {DataMapping=} dataMapping Optional dataMapping to apply to the data
     * @return {Function} Returns the query handler
     */
    function getSimpleQueryHandler(storeName, ignoreUrlParams, dataMapping) {
      return function (request, options) {
        if (request.method == 'GET' ||
          request.method == 'HEAD') {
          logger.log("Offline Persistence Toolkit queryHandlers: SimpleQueryHandler processing request");
          // applies to all GET requests. If there are any URL query params
          // then the keys in the parameter are directly mapped to the shredded
          // data fields and values to the shredded data values
          var urlParams = request.url.split('?');
          var findQuery = persistenceUtils._mapFindQuery(_createQueryFromUrlParams(urlParams, ignoreUrlParams), dataMapping);

          var shredder;
          var unshredder;

          if (options['jsonProcessor'] != null) {
            shredder = options['jsonProcessor']['shredder'];
            unshredder = options['jsonProcessor']['unshredder'];
          }

          if (shredder != null &&
            unshredder != null) {
            return _processQuery(request, storeName, findQuery, shredder, unshredder);
          }
        }
        return Promise.resolve();
      };
    };
    
    function _createQueryFromUrlParams(urlParams, ignoreUrlParams) {
      var findQuery = {};
      
      if (urlParams &&
        urlParams.length > 1) {
        var selectorQuery = {};
        var queryParamsIter;

        if (typeof URLSearchParams === 'undefined') {
          // IE does not support URLSearchParams so parse
          // it ourselves
          queryParamsIter = _parseURLSearchParams(urlParams[1]);
        } else {
          queryParamsIter = (new URLSearchParams(urlParams[1])).entries();
        }

        var queryParamEntry;
        var queryParamName;
        var queryParamValue;

        do {
          queryParamEntry = queryParamsIter.next();

          if (queryParamEntry['value'] != null) {
            queryParamName = queryParamEntry['value'][0];
            queryParamValue = queryParamEntry['value'][1];

            if (!ignoreUrlParams ||
              ignoreUrlParams.indexOf(queryParamName) == -1) {
              // build our query
              selectorQuery["value." + queryParamName] = queryParamValue;
            }
          }
        } while (!queryParamEntry['done']);

        if (Object.keys(selectorQuery).length > 0) {
          findQuery.selector = selectorQuery;
        }
      }
      return findQuery;
    };

    function _parseURLSearchParams(query) {
      // parse the URL query params. Does the same as
      // URLSearchParams but use for IE which doesn't support URLSearchParams.
      var params = [];
      if (query != null) {
        // URLSearchParams requires that the implementation strip off an initial ? char
        if (query.charAt(0) === '?') {
          query = query.slice(1);
        }
        query = query || '';
        var paramPairs = query.split('&');
        var paramName;
        var paramValue
        var index;
        params = paramPairs.map(function (paramPair) {
          index = paramPair.indexOf('=');

          if (index > -1) {
            paramName = paramPair.slice(0, index);
            paramValue = paramPair.slice(index + 1);
            paramValue = _cleanURIValue(paramValue);
          } else {
            paramName = paramPair;
            paramValue = '';
          }
          paramName = _cleanURIValue(paramName);
          return [paramName, paramValue];
        });
      }

      var iterator =
        {
          next: function () {
            var value = params.shift();
            return {done: value === undefined, value: value};
          }
        };

      return iterator;
    };
    
    function _cleanURIValue(value) {
      return decodeURIComponent(value.replace(/\+/g, ' '));
    };
    
    function _getRequestUrlId(request) {
      var urlTokens = request.url.split('/');
      if (urlTokens.length > 1) {
        return urlTokens[urlTokens.length - 1].split('?')[0];
      }
      return null;
    };
    
    function _getRequestCollectionUrl(request) {
      var urlTokens = request.url.split('/');
      if (urlTokens.length > 1) {
        urlTokens.pop();
        return urlTokens.join('/');
      }
      return null;
    };

    return {'getSimpleQueryHandler': getSimpleQueryHandler,
      'getOracleRestQueryHandler': getOracleRestQueryHandler};
  });

