/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['./persistenceManager', './persistenceStoreManager', './persistenceUtils', './impl/logger', './impl/sql-where-parser.min'],
  function (persistenceManager, persistenceStoreManager, persistenceUtils, logger, sqlWhereParser) {
    'use strict';

    /**
     * @export
     * @interface NormalizedQuery
     * @classdesc Interface for normalized query structure. Various REST endpoints support
     *            different syntax for querying resources. Normalizing the query syntax
     *            enables Oracle Persistence Toolkit to perform certain functionalities
     *            including client side shredded data cleanup.
     * @hideconstructor
     */

     /**
      * The offset to be requested from the current query.
      *
      * @export
      * @expose
      * @memberof NormalizedQuery
      * @instance
      * @name offset
      * @type {int}
      */

      /**
       * The number of rows to be requested from the current query. Can be -1 or
       * any integer. -1 indicates no limit.
       *
       * @export
       * @expose
       * @memberof NormalizedQuery
       * @instance
       * @name limit
       * @type {number}
       */

       /**
        * The search criteria to be included in the current query.
        *
        * @export
        * @expose
        * @memberof NormalizedQuery
        * @instance
        * @name searchCriteria
        * @type {object}
        */

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
     * >, <, >=, <=, =, !=, AND, OR, LIKE, IN.
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
      var sortQuery;
      // normalize the query parameters into format:
      // offset: integer
      // limit: integer
      // searchCriteria:
      var normalizeOracleRestQueryParameter = function (requestUrl) {
        var limit = -1;
        var offset = 0;
        var searchCriteria;
        var urlParams = requestUrl.split('?');
        var queryParamsIter;
        var queryParamEntry;
        var queryParamName;
        var queryParamValue;
        sortQuery = [];
        if (typeof URLSearchParams === 'undefined') {
          // IE does not support URLSearchParams so parse
          // it ourselves
          queryParamsIter = _parseURLSearchParams(urlParams[1]);
        } else {
          queryParamsIter = (new URLSearchParams(urlParams[1])).entries();
        }
        do {
          queryParamEntry = queryParamsIter.next();

          if (queryParamEntry['value'] != null) {
            queryParamName = queryParamEntry['value'][0];
            queryParamValue = queryParamEntry['value'][1];

            if (queryParamName == 'q') {
              searchCriteria = queryParamValue;
            } else if (queryParamName == 'limit') {
              limit = parseInt(queryParamValue, 10);
            } else if (queryParamName == 'offset') {
              offset = parseInt(queryParamValue, 10);
            } else if(queryParamName.toLowerCase() === 'orderby' && !sortQuery.length) {
              var sortQueryValues = queryParamValue.split(',');
              sortQueryValues.forEach(function(sortQueryValue) {
                var sortValue = sortQueryValue.split(':');
                var _sortQueryItem = {};
                _sortQueryItem["value." + sortValue[0]] = sortValue[1] ? sortValue[1] : 'asc' ;
                sortQuery.push(_sortQueryItem);
              })
            }
          }
        } while (!queryParamEntry['done']);
        return {
          offset: offset,
          limit: limit,
          searchCriteria: searchCriteria
        }
      };
      var queryHandler = function (request, options) {
        if (request.method == 'GET' ||
          request.method == 'HEAD') {
          logger.log("Offline Persistence Toolkit queryHandlers: OracleRestQueryHandler processing request");
          var normalized = normalizeOracleRestQueryParameter(request.url);

          var findQuery = persistenceUtils._mapFindQuery(createQueryExp(normalized.searchCriteria), dataMapping, sortQuery);

          var shredder;
          var unshredder;

          if (options['jsonProcessor'] != null) {
            shredder = options['jsonProcessor']['shredder'];
            unshredder = options['jsonProcessor']['unshredder'];
          }
          if (shredder != null &&
            unshredder != null) {
            return _processQuery(request, storeName, findQuery, shredder, unshredder, normalized.offset, normalized.limit).then(function(response) {
              if (!response) {
                return;
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
                        return response;
                      });
                    } else {
                      return response;
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
      queryHandler.normalizeQueryParameter = normalizeOracleRestQueryParameter;

      return queryHandler;
    };

    // 1. get the matched raw entry from cache store: it should contain key, and
    //    response header.
    // 2. if we found a match:
    //       for single resource type, we'll just get it from cache, by using cache key.
    //       for collection resource type, we'll need to query the store, and
    //       construct the response.
    // 3. if we don't find a match
    //       get the possible id from the url, and search store on that key.
    //       if we no possible id, or no entry found with that key, we don't have a match
    //       if we found an object from the store, then we need to construct a response.
    //
    function _processQuery(request, storeName, findQuery, shredder, unshredder, offset, limit) {
      return persistenceManager.getCache()._internalMatch(request, {ignoreSearch: true, ignoreBody: true}).then(function (cacheEntryMetadata) {
        if (cacheEntryMetadata) {
          if (cacheEntryMetadata.resourceType === 'unknown') {
            return null;
          } else if (cacheEntryMetadata.resourceType === 'single') {
            // just get the response based on key.
            return persistenceManager.getCache()._matchByKey(request, cacheEntryMetadata.key);
          } else {
            // we have collection type of response
            // 1. first query from the shredded store.
            // 2. apply offset and limit.
            // 3. reconstruct the response
            return persistenceStoreManager.openStore(storeName).then(function(store) {
              return store.find(findQuery);
            }).then(function(results) {
              var hasMore = false;
              var totalResults = results.length;
              if (offset && offset > 0) {
                if (offset < totalResults) {
                  results = results.slice(offset);
                } else {
                  results = [];
                }
              }
              if (limit && limit > 0 && results.length > 0) {
                if (limit < results.length) {
                  hasMore = true;
                  results = results.slice(0, limit);
                }
              }
              var newShreddedData = {
                name: storeName,
                data: results,
                resourceType: 'collection'
              };
              return persistenceManager.getCache()._matchByKey(
                request, cacheEntryMetadata.key, {ignoreBody: true}
              ).then(function(response) {
                return unshredder([newShreddedData], response).then(function(newResponse) {
                  // add limit and offset to the newly constructed response.
                  var responseClone = newResponse.clone();
                  return responseClone.text().then(function(payload) {
                    if (payload != null && payload.length > 0) {
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
                          return persistenceUtils.setResponsePayload(response, payloadJson);
                        } else {
                          return newResponse;
                        }
                      } catch (err) {
                        logger.log("JSON parse error on payload: " + payload);
                      }
                    } else {
                      return newResponse;
                    }
                  });
                });
              });
            })
          }
        } else {
          // no matched response from cache, could be
          // 1. this is a single row query, we'll try finding that row in the
          //    shredded store.
          // 2. there is just no cached response for this request at all.
          var id = _getRequestUrlId(request);
          if (!id) {
            // there is just no cached response for this request.
            return;
          } else {
            // check if we have shredded data for this id.
            return persistenceStoreManager.openStore(storeName).then(function (store) {
              return store.findByKey(id);
            }).then(function(result) {
              if (result) {
                // we have an entry in the shredded store, so we can contruct
                // a valid response by using the cached collection response shell
                // with the single shredded data as payload.
                var collectionUrl = _getRequestCollectionUrl(request);
                if (collectionUrl) {
                  return persistenceUtils.requestToJSON(request).then(function (requestObj) {
                    requestObj.url = collectionUrl;
                    return persistenceUtils.requestFromJSON(requestObj).then(function (collectionRequest) {
                      return persistenceManager.getCache().match(collectionRequest, {ignoreSearch: true, ignoreBody: true}).then(function (response) {
                        if (response) {
                          var transformedResults = {
                            name: storeName,
                            data: [result],
                            resourceType: 'single'
                          };
                          return unshredder([transformedResults], response);
                        }
                      });
                    });
                  });
                } else {
                  // should never come here since we are able to get id from
                  // the url, we should be able to get the colletion URL.
                  return;
                }
              } else {
                // nothing in the shredded store, we don't have anything to return
                // a valid response.
                return;
              }
            });
          }
        }
      });
    };

    function _createQueryFromAdfBcParams(value) {
      var findQuery = {};

      if (value) {
        // link to 3rd party API : https://www.npmjs.com/package/sql-where-parser
        // By default sql-where-parser does not support the <> operator.
        var config = sqlWhereParser.defaultConfig;
        // adding the '<>' operator into the config list
        config.operators[5]['<>'] = 2;
        config.tokenizer.shouldTokenize.push('<>');
        // creating a new sqlWhereParser with the config settings we just created
        var parser = new sqlWhereParser(config);

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
                operatorValue != 'OR' &&
                operatorValue != ',') {
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
                  rhsOp = rhsOp.replace(/%/g, '.*');
                  returnExp[lhsOp] = {
                    $regex: RegExp(rhsOp,'i')
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
                case '<>':
                  returnExp[lhsOp] = {
                    $ne: rhsOp
                  };
                  break;
                case 'IS':
                  // Checks if the rhsOp is null before constucting null case
                  // this is to avoid mishandling 'IS NOT NULL' cases
                  if (rhsOp === null){
                    var nullOperand = [];
                    nullOperand[0] = {};
                    nullOperand[1] = {};
                    // Rows with non-existing columns return 'undefined' instead of null in JS.
                    // Checking both 'null' and 'undefined' since both are valid for a 'IS NULL' query
                    nullOperand[0][lhsOp] = {$eq: null};
                    nullOperand[1][lhsOp] = {$eq: undefined};
                    // The 'or' statement is used to check for both null and undefined
                    returnExp = {
                      $or : nullOperand
                    }
                  }
                  break;
                case 'IN':
                  returnExp[lhsOp] = {
                    $in: [].concat(rhsOp)
                  };
                  break;
                case ',':
                  // the ',' case is due to how sql-where-parser handles comma seperated values
                  // The returned value is used in the next operation
                  // Example 'Location IN (1,2,3)', using the ',' case logic:
                  // operatorValue : IN | operands : [ 'location', [3,2,1] ]
                  // Without the ',' case logic :
                  // operatorValue : IN | operands : [ 'location', {} ]
                  return [rhsOp].concat(lhsOp);
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
      var normalizeSimpleQueryParameter = function (requestUrl) {
        var searchCriteria;
        var urlParams = requestUrl.split('?');
        if (urlParams.length > 1) {
          searchCriteria = urlParams[1];
        }
        return {
          offset: 0,
          limit: -1,
          searchCriteria: searchCriteria
        }
      };
      var queryHandler = function (request, options) {
        if (request.method == 'GET' ||
          request.method == 'HEAD') {
          logger.log("Offline Persistence Toolkit queryHandlers: SimpleQueryHandler processing request");
          // applies to all GET requests. If there are any URL query params
          // then the keys in the parameter are directly mapped to the shredded
          // data fields and values to the shredded data values
          var normalized = normalizeSimpleQueryParameter(request.url);
          var findQuery = persistenceUtils._mapFindQuery(_createQueryFromUrlParams(normalized.searchCriteria, ignoreUrlParams), dataMapping);

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
      queryHandler.normalizeQueryParameter = normalizeSimpleQueryParameter;
      return queryHandler;
    };

    function _createQueryFromUrlParams(searchParams, ignoreUrlParams) {
      var findQuery = {};

      if (searchParams) {
        var selectorQuery = {};
        var queryParamsIter;

        if (typeof URLSearchParams === 'undefined') {
          // IE does not support URLSearchParams so parse
          // it ourselves
          queryParamsIter = _parseURLSearchParams(searchParams);
        } else {
          queryParamsIter = (new URLSearchParams(searchParams)).entries();
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

    // add more search criteria to the query.
    function _addSearchCriteria(
      query, // the existing query to be updated
      name,  // the name to search against
      value // the value to use to search against the name
    ) {
      var additionalSelector = {};
      additionalSelector[name] = {'$eq': value};
      var selector = query.selector;
      if (!selector) {
        query.selector = additionalSelector;
      } else {
        var combined = [];
        combined.push(selector);
        combined.push(additionalSelector);
        query.selector = {
          '$and': combined
        };
      }
    }

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

