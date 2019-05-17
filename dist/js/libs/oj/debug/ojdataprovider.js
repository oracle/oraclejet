/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'ojs/ojeventtarget'], function(oj)
{
  "use strict";
  var GenericEvent = oj.GenericEvent;
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * The interface for oj.FetchByKeysParameters
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.FetchByKeysParameters
 * @ojsignature {target: "Type",
 *               value: "interface FetchByKeysParameters<K>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}]}
 */

/**
 * Keys for rows to fetch
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.FetchByKeysParameters
 * @instance
 * @name keys
 * @type {Set.<any>}
 * @ojsignature {target: "Type",
 *               value: "Set<K>"}
 */

/**
 * Optional string describing local or global data set to fetch
 *
 * @ojstatus preview
 * @since 7.0.0
 * @export
 * @expose
 * @memberof oj.FetchByKeysParameters
 * @instance
 * @name scope
 * @type {"local" | "global"}
 */

/**
 * attributes to include in the result. If specified, then at least these set of attributes will be included in each row
 * results. If not specified then the default attributes will be included.
 *
 * @ojstatus preview
 * @since 6.1.0
 * @export
 * @expose
 * @memberof oj.FetchByKeysParameters
 * @instance
 * @name attributes
 * @type {Array.<string | oj.FetchAttribute>}
 * @ojsignature {target: "Type",
 *               value: "?Array<string | FetchAttribute>"}
 */

/**
 * The interface for oj.FetchByKeysResults
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.FetchByKeysResults
 * @ojsignature {target: "Type",
 *               value: "interface FetchByKeysResults<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 */

/**
 * The parameters used for the fetch call.
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.FetchByKeysResults
 * @instance
 * @name fetchParameters
 * @type {oj.FetchByKeysParameters}
 * @ojsignature {target: "Type",
 *               value: "FetchByKeysParameters<K>"}
 */

/**
 * Map of keys and corresponding {@link oj.Item}.
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.FetchByKeysResults
 * @instance
 * @name results
 * @type {Map.<*, oj.Item>}
 * @ojsignature {target: "Type",
 *               value: "Map<K, Item<K, D>>"}
 */

/**
 * The interface for oj.ContainsKeysResults
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.ContainsKeysResults
 * @ojsignature {target: "Type",
 *               value: "interface ContainsKeysResults<K>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}]}
 */

/**
 * The parameters used for the containsKeys call.
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.ContainsKeysResults
 * @instance
 * @name containsParameters
 * @type {oj.FetchByKeysParameters}
 * @ojsignature {target: "Type",
 *               value: "FetchByKeysParameters<K>"}
 */

/**
 * Requested keys subset which are contained in the DataProvider.
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.ContainsKeysResults
 * @instance
 * @name results
 * @type {Set.<any>}
 * @ojsignature {target: "Type",
 *               value: "Set<K>"}
 */

 /**
  * end of jsdoc
  */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.SortCriterion
 * @ojsignature {target: "Type",
 *               value: "interface SortCriterion<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 */

/**
 * sort attribute upon which the data should be sorted.
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.SortCriterion
 * @instance
 * @name attribute
 * @type {string}
 * @ojsignature {target: "Type",
 *               value: "keyof D"}
 */

/**
 * sort direction, either "ascending" or "descending".
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.SortCriterion
 * @instance
 * @name direction
 * @type {string}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.DataMapping
 * @ojsignature {target: "Type",
 *               value: "interface DataMapping <K, D, Kin, Din>",
 *               genericParameters: [{"name": "K", "description": "Type of output key"}, {"name": "D", "description": "Type of output data"},
 *                    {"name": "Kin", "description": "Type of input key"}, {"name": "Din", "description": "Type of input data"}]}
 */

/**
 * Field mapping function which takes an item and returns the mapped item
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.DataMapping
 * @instance
 * @name mapFields
 * @type {Function}
 * @ojsignature {target: "Type",
 *               value: "(item: Item<Kin, Din>) => Item<K, D>"}
 */

/**
 * Optional FilterCriterion mapping function which takes filterOperator and returns the mapped filterOperator
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.DataMapping
 * @instance
 * @name mapFilterCriterion
 * @type {Function}
 * @ojsignature {target: "Type",
 *               value: "?(filterCriterion: AttributeFilter<D> | CompoundFilter<D>) => AttributeFilter<Din> | CompoundFilter<Din>"}
 */

/**
 * Optional SortCriterion mapping function which takes sortCriteria and returns the mapped sortCriteria
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.DataMapping
 * @instance
 * @name mapSortCriteria
 * @type {Function}
 * @ojsignature {target: "Type",
 *               value: "?(sortCriteria: Array<SortCriterion<D>>) => Array<SortCriterion<Din>>"}
 */

/**
 * Optional SortCriterion unmapping function which takes mapped sortCriteria and returns the unmapped sortCriteria
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.DataMapping
 * @instance
 * @name unmapSortCriteria
 * @type {Function}
 * @ojsignature {target: "Type",
 *               value: "?(sortCriteria: Array<SortCriterion<Din>>) => Array<SortCriterion<D>>"}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * The interface for oj.FetchFunc
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @ojsignature {target: "Type",
 *               value: "interface FetchFunc<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 */

/**
 * @ojsignature {target: "Type",
 *               value: "(FetchListParameters?): AsyncIterable<FetchListResult<K, D>>"}
 */

 /**
  * end of jsdoc
  */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * The interface for oj.FetchListParameters
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.FetchListParameters
 * @ojsignature {target: "Type",
 *               value: "interface FetchListParameters<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 */

/**
 * Optional number of rows to fetch starting from offset.  If fewer than that number of rows exist, the fetch will succeed but be truncated.
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.FetchListParameters
 * @instance
 * @name size
 * @type {number}
 */

/**
 * Optional sort criteria to apply.
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.FetchListParameters
 * @instance
 * @name sortCriteria
 * @type {Array.<oj.SortCriterion>}
 * @ojsignature {target: "Type",
 *               value: "?Array<SortCriterion<D>>"}
 */

/**
 * Optional filter criterion to apply. The filter criterion would be composed of a
 * supported Filter such as a AttributeFilter or a CompoundFilter.
 *
 * @example
 * The following would be a valid filterCriterion:
 * {op: '$or', criteria: [{op: '$eq', value: {name: 'Bob'}}, {op: '$gt', value: {level: 'Low'}}]}
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.FetchListParameters
 * @instance
 * @name filterCriterion
 * @type {oj.AttributeFilter | oj.CompoundFilter | oj.FilterOperator}
 * @ojsignature {target: "Type",
 *               value: "?AttributeFilter<D> | CompoundFilter<D> | FilterOperator<D>"}
 */

/**
 * Optional attributes to include in the result. If specified, then at least these set of attributes must be included in each row
 * in the data array in the FetchListResult. If not specified then the default attributes must be included.
 *
 * @ojstatus preview
 * @since 6.1.0
 * @export
 * @expose
 * @memberof oj.FetchListParameters
 * @instance
 * @name attributes
 * @type {Array.<string | oj.FetchAttribute>}
 * @ojsignature {target: "Type",
 *               value: "?Array<string | FetchAttribute>"}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * The interface for oj.FetchListResult
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.FetchListResult
 * @ojsignature {target: "Type",
 *               value: "interface FetchListResult<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 */

/**
 * The {@link oj.FetchListParameters} used for the fetch call
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.FetchListResult
 * @instance
 * @name fetchParameters
 * @type {oj.FetchListParameters}
 * @ojsignature {target: "Type",
 *               value: "FetchListParameters<D>"}
 */

/**
 * Array of data for each row
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.FetchListResult
 * @instance
 * @name data
 * @type {Array.<Object>}
 * @ojsignature {target: "Type",
 *               value: "D[]"}
 */

/**
 * Array of {link@ oj.ItemMetadata} for each row
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.FetchListResult
 * @instance
 * @name metadata
 * @type {Array.<oj.ItemMetadata>}
 * @ojsignature {target: "Type",
 *               value: "Array<ItemMetadata<K>>"}
 */

 /**
  * end of jsdoc
  */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * The interface for oj.ItemMetadata
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.ItemMetadata
 * @ojsignature {target: "Type",
 *               value: "interface ItemMetadata<K>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}]}
 */

/**
 * The key for the row
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.ItemMetadata
 * @instance
 * @name key
 * @type {any}
 * @ojsignature {target: "Type",
 *               value: "K"}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for oj.AttributeFilterDef
 *
 * @ojstatus preview
 * @export
 * @interface oj.AttributeFilterDef
 * @since 7.0.0
 * @ojsignature {target: "Type",
 *               value: "interface AttributeFilterDef<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 */

/**
 * Optional property which specifies which attribute to filter on. This is provided for backward compatibility
 * and has been deprecated. Please specify attribute/value pairs in the value property instead.
 *
 * @ojstatus preview
 * @since 7.0.0
 * @export
 * @expose
 * @memberof oj.AttributeFilterDef
 * @instance
 * @name attribute
 * @type {string=}
 * @ojdeprecated {since: '7.0.0', description: 'Use attribute pair values in the value property instead. e.g. value: {DepartmentId: 10}'}
 * @example <caption>Attribute filter definition which filters on DepartmentId value 10</caption>
 * {op: '$eq', attribute: 'DepartmentId', value: 10}
 */

/**
 * Operator to apply for the filter. Valid operators defined in the AttributeFilterOperator union type are the strings:
 * <ul>
 *   <li>$co The entire operator value must be a substring of the attribute value for a match.</li>
 *   <li>$eq The attribute and operator values must be identical for a match.</li>
 *   <li>$ew The entire operator value must be a substring of the attribute value matching at the end of the attribute value.  This criterion is satisfied if the two strings are identical.</li>
 *   <li>$pr If the attribute has a non-empty or non-null value, or if it contains a non-empty node for complex attributes, there is a match.</li>
 *   <li>$gt If the attribute value is greater than the operator value, there is a match.</li>
 *   <li>$ge If the attribute value is greater than or equal to the operator value, there is a match.</li>
 *   <li>$lt If the attribute value is less than the operator value, there is a match.</li>
 *   <li>$le If the attribute value is less than or equal to the operator value, there is a match.</li>
 *   <li>$ne The attribute and operator values are not identical.</li>
 *   <li>$regex If the attribute value satisfies the regular expression, there is a match.</li>
 *   <li>$sw The entire operator value must be a substring of the attribute value, starting at the beginning of the attribute value.  This criterion is satisfied if the two strings are identical.</li>
 * </ul>
 *
 * @ojstatus preview
 * @since 7.0.0
 * @export
 * @expose
 * @memberof oj.AttributeFilterDef
 * @instance
 * @name op
 * @type {string}
 */

/**
 * Specifies the value to filter for. This can be a primitive or object. If a primitive is specified, then the attribute property must
 * be used in conjunction. However, that type of usage is only provided for backwards compatibility and has been deprecated. Therefore,
 * value should be an object which specifies attribute/value pairs to filter on. The op will be applied to each attribute/value pair and
 * the whole will be AND'd. For subobjects, please specify them in a nested structure.
 *
 * @ojstatus preview
 * @since 7.0.0
 * @export
 * @expose
 * @memberof oj.AttributeFilterDef
 * @instance
 * @name value
 * @type {any}
 * @example
 * <caption>Filter definition which filters on DepartmentId value 10</caption>
 * {op: '$eq', value: {DepartmentId: 10}}
 * @example
 * <caption>Filter definition which filters on DepartmentId value 10 and DepartmentName is Hello</caption>
 * {op: '$eq', value: {DepartmentId: 10, DepartmentName: 'Hello'}}
 * @example
 * <caption>Filter definition which filters on subobject Location State is California and DepartmentName is Hello</caption>
 * {op: '$eq', value: {DepartmentName: 'Hello', Location: {State: 'California'}}}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
var AttributeFilterOperator;
(function (AttributeFilterOperator) {
    var AttributeOperator;
    (function (AttributeOperator) {
        AttributeOperator["$co"] = "$co";
        AttributeOperator["$eq"] = "$eq";
        AttributeOperator["$ew"] = "$ew";
        AttributeOperator["$pr"] = "$pr";
        AttributeOperator["$gt"] = "$gt";
        AttributeOperator["$ge"] = "$ge";
        AttributeOperator["$lt"] = "$lt";
        AttributeOperator["$le"] = "$le";
        AttributeOperator["$ne"] = "$ne";
        AttributeOperator["$regex"] = "$regex";
        AttributeOperator["$sw"] = "$sw";
    })(AttributeOperator = AttributeFilterOperator.AttributeOperator || (AttributeFilterOperator.AttributeOperator = {}));
    ;
})(AttributeFilterOperator || (AttributeFilterOperator = {}));
oj['AttributeFilterOperator'] = AttributeFilterOperator;
oj['AttributeFilterOperator']['AttributeOperator'] = AttributeFilterOperator.AttributeOperator;

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for oj.AttributeFilterOperator
 *
 * @ojstatus preview
 * @export
 * @interface oj.AttributeFilterOperator
 * @extends oj.FilterOperator
 * @since 5.0.0
 * @ojsignature {target: "Type",
 *               value: "interface AttributeFilterOperator<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @ojdeprecated {since: '7.0.0', description: 'Use AttributeFilter instead.'}
 */

/**
 * Operator one of enum oj.AttributeOperator {$co, $eq, $ew, $pr, $gt, $ge, $lt, $le, $ne, $regex, $sw}
 *
 * @ojstatus preview
 * @since 5.0.0
 * @export
 * @expose
 * @memberof oj.AttributeFilterOperator
 * @instance
 * @name op
 * @type {oj.AttributeFilterOperator.AttributeOperator}
 */

/**
 * Attribute
 *
 * @ojstatus preview
 * @since 5.0.0
 * @export
 * @expose
 * @memberof oj.AttributeFilterOperator
 * @instance
 * @name attribute
 * @type {string}
 */

/**
 * Value
 *
 * @ojstatus preview
 * @since 5.0.0
 * @export
 * @expose
 * @memberof oj.AttributeFilterOperator
 * @instance
 * @name value
 * @type {any}
 */

/**
 * oj.AttributeOperator enum
 * <br>
 * <p>The operators are based on the filtering spec of the RFC 7644 SCIM
 * protocol:
 * <br>
 * {@link https://tools.ietf.org/html/rfc7644#section-3.4.2|SCIM Filtering}
 * <br>
 * <p>
 * @ojstatus preview
 * @export
 * @enum {string}
 * @name AttributeOperator
 * @memberof oj.AttributeFilterOperator
 * @property {string} $co=$co The entire operator value must be a substring of the attribute value for a match.
 * @property {string} $eq=$eq The attribute and operator values must be identical for a match.
 * @property {string} $ew=$ew The entire operator value must be a substring of the attribute value matching at the end of the attribute value.  This criterion is satisfied if the two strings are identical.
 * @property {string} $pr=$pr If the attribute has a non-empty or non-null value, or if it contains a non-empty node for complex attributes, there is a match.
 * @property {string} $gt=$gt If the attribute value is greater than the operator value, there is a match.
 * @property {string} $ge=$ge If the attribute value is greater than or equal to the operator value, there is a match.
 * @property {string} $lt=$lt If the attribute value is less than the operator value, there is a match.
 * @property {string} $le=$le If the attribute value is less than or equal to the operator value, there is a match.
 * @property {string} $ne=$ne The attribute and operator values are not identical.
 * @property {string} $regex=$regex If the attribute value satisfies the regular expression, there is a match.
 * @property {string} $sw=$sw The entire operator value must be a substring of the attribute value, starting at the beginning of the attribute value.  This criterion is satisfied if the two strings are identical.
 * @since 5.0.0
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for oj.AttributeFilter
 *
 * @ojstatus preview
 * @export
 * @interface oj.AttributeFilter
 * @extends oj.AttributeFilterDef
 * @since 7.0.0
 * @ojsignature {target: "Type",
 *               value: "interface AttributeFilter<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 */

/**
 * Specifies a filter function which has the same signature as the the callback
 * which is specified for the JS Array.filter():
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 * This function will be optionally used by the DataProvider to do local filtering.
 * This function is required by the DataProvider so that it is possible for DataProvider
 * implementations to at least do local filtering.
 *
 * @ojstatus preview
 * @since 7.0.0
 * @export
 * @expose
 * @memberof oj.AttributeFilter
 * @instance
 * @name filter
 * @method
 * @param {any item The current element being processed in the array.
 * @param {number=} index The index of the current element being processed in the array.
 * @param {Array=} array The array filter was called upon.
 * @return {boolean} True if the element satisfies the filter.
 * @ojsignature {target: "Type",
 *               value: "filter(item: D, index?: number, array?: Array<D>): boolean;"}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for oj.CompoundFilterDef
 *
 * @ojstatus preview
 * @export
 * @interface oj.CompoundFilterDef
 * @since 7.0.0
 * @ojsignature {target: "Type",
 *               value: "interface CompoundFilterDef<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 */

/**
 * Operator to apply for the filter. Valid operators defined in the CompoundFilterOperator union type are the strings:
 * <ul>
 *   <li>$and The filters in the criteria array will be AND'd.</li>
 *   <li>$or The filters in the criteria array will be OR'd.</li>
 * </ul>
 * @ojstatus preview
 * @since 7.0.0
 * @export
 * @expose
 * @memberof oj.CompoundFilterDef
 * @instance
 * @name op
 * @type {string}
 */

/**
 * Array of FilterDefs on which to apply the operator
 *
 * @ojstatus preview
 * @since 7.0.0
 * @export
 * @expose
 * @memberof oj.CompoundFilterDef
 * @instance
 * @name criteria
 * @type {Array.<oj.AttributeFilterDef | oj.CompoundFilterDef>}
 * @ojsignature {target: "Type",
 *               value: "Array<AttributeFilterDef<D> | CompoundFilterDef<D>>"}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
var CompoundFilterOperator;
(function (CompoundFilterOperator) {
    var CompoundOperator;
    (function (CompoundOperator) {
        CompoundOperator["$and"] = "$and";
        CompoundOperator["$or"] = "$or";
    })(CompoundOperator = CompoundFilterOperator.CompoundOperator || (CompoundFilterOperator.CompoundOperator = {}));
    ;
})(CompoundFilterOperator || (CompoundFilterOperator = {}));
oj['CompoundFilterOperator'] = CompoundFilterOperator;
oj['CompoundFilterOperator']['CompoundOperator'] = CompoundFilterOperator.CompoundOperator;

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for oj.CompoundFilterOperator
 *
 * @ojstatus preview
 * @export
 * @interface oj.CompoundFilterOperator
 * @extends oj.FilterOperator
 * @since 5.0.0
 * @ojsignature {target: "Type",
 *               value: "interface CompoundFilterOperator<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @ojdeprecated {since: '7.0.0', description: 'Use CompoundFilter instead.'}
 */

/**
 * Operator one of enum oj.CompoundOperator {$and, $or}
 *
 * @ojstatus preview
 * @since 5.0.0
 * @export
 * @expose
 * @memberof oj.CompoundFilterOperator
 * @instance
 * @name op
 * @type {oj.CompoundFilterOperator.CompoundOperator}
 */

/**
 * Array of FilterOperators on which to apply the operator
 *
 * @ojstatus preview
 * @since 5.0.0
 * @export
 * @expose
 * @memberof oj.CompoundFilterOperator
 * @instance
 * @name criteria
 * @type {Array.<oj.FilterOperator>}
 * @ojsignature {target: "Type",
 *               value: "Array<FilterOperator<D>>"}
 */

/**
 * oj.CompoundOperator enum
 * <br>
 * <p>The operators are based on the filtering spec of the RFC 7644 SCIM
 * protocol:
 * <br>
 * {@link https://tools.ietf.org/html/rfc7644#section-3.4.2|SCIM Filtering}
 * <br>
 * <p>
 * @ojstatus preview
 * @export
 * @enum {string}
 * @name CompoundOperator
 * @memberof oj.CompoundFilterOperator
 * @property {string} $and=$and The filter is only a match if both expressions evaluate to true.
 * @property {string} $or=$or The filter is a match if either expression evaluates to true.
 * @since 5.0.0
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for oj.CompoundFilter
 *
 * @ojstatus preview
 * @export
 * @interface oj.CompoundFilter
 * @extends oj.CompoundFilterDef
 * @since 7.0.0
 * @ojsignature {target: "Type",
 *               value: "interface CompoundFilter<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 */

/**
 * Specifies a filter function which has the same signature as the the callback
 * which is specified for the JS Array.filter():
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 * This function will be optionally used by the DataProvider to do local filtering.
 * This function is required by the DataProvider so that it is possible for DataProvider
 * implementations to at least do local filtering.
 *
 * @ojstatus preview
 * @since 7.0.0
 * @export
 * @expose
 * @memberof oj.CompoundFilter
 * @instance
 * @name filter
 * @method
 * @param {any} item The current element being processed in the array.
 * @param {number=} index The index of the current element being processed in the array.
 * @param {Array=} array The array filter was called upon.
 * @return {boolean} True if the element satisfies the filter.
 * @ojsignature {target: "Type",
 *               value: "filter(item: D, index?: number, array?: Array<D>): boolean;"}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @interface oj.DataProviderAddOperationEventDetail
 * @extends oj.DataProviderOperationEventDetail
 * @ojsignature {target: "Type",
 *               value: "interface DataProviderAddOperationEventDetail<K, D> extends DataProviderOperationEventDetail<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 */

/**
 * Optional set of keys for items located after the items involved in the operation. If null and
 * index not specified then insert at the end.
 *
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderAddOperationEventDetail
 * @instance
 * @name afterKeys
 * @type {Set.<any>}
 * @ojdeprecated {since: '6.0.0', description: 'Use addBeforeKeys instead.  addBeforeKeys is an Array instead of a Set.'}
 * @ojsignature {target: "Type",
 *               value: "?Set<K>"}
 */

/**
 * Optional array of keys for items located after the items involved in the operation. If null and
 * index not specified then insert at the end.
 *
 * @ojstatus preview
 * @since 6.0.0
 * @export
 * @expose
 * @memberof oj.DataProviderAddOperationEventDetail
 * @instance
 * @name addBeforeKeys
 * @type {Array.<any>}
 * @ojsignature {target: "Type",
 *               value: "?K[]"}
 */

/**
 * Keys of parents for the items involved in the operation.
 * <p>If this property is undefined, the items involved in the operation have no parent.
 * This is the case for non-hierarchical DataProvider implementatons such as ArrayDataProvider.</p>
 * <p>If this property has a value, each entry in the array represents the parent key of
 * the corresponding item.  A parent key of null indicates that the item is at the root level.
 * TreeDataProvider implementations should always set this property.</p>
 *
 * @ojstatus preview
 * @since 6.0.0
 * @export
 * @expose
 * @memberof oj.DataProviderAddOperationEventDetail
 * @instance
 * @name parentKeys
 * @type {Array.<any>}
 * @ojsignature {target: "Type",
 *               value: "?K[]"}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
var DataProviderMutationEvent = /** @class */ (function (_super) {
    __extends(DataProviderMutationEvent, _super);
    function DataProviderMutationEvent(detail) {
        var _this = this;
        var eventOptions = {};
        eventOptions[DataProviderMutationEvent._DETAIL] = detail;
        _this = _super.call(this, 'mutate', eventOptions) || this;
        return _this;
    }
    DataProviderMutationEvent._DETAIL = 'detail';
    return DataProviderMutationEvent;
}(GenericEvent));
oj.DataProviderMutationEvent = DataProviderMutationEvent;
oj['DataProviderMutationEvent'] = DataProviderMutationEvent;

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * This interface specifies as one atomic event all the mutation operations which
 * occurred. The keys for each operation must be disjoint from each other, e.g. for example
 * an add and remove cannot occur on the same item. In addition, any indexes specified must
 * be monotonically increasing.
 *
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @interface oj.DataProviderMutationEventDetail
 * @ojsignature {target: "Type",
 *               value: "interface DataProviderMutationEventDetail<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 */

/**
 * Optional add operation detail
 *
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEventDetail
 * @instance
 * @name add
 * @type {oj.DataProviderAddOperationEventDetail}
 * @ojsignature {target: "Type",
 *               value: "?DataProviderAddOperationEventDetail<K, D>"}
 */

/**
 * Optional remove operation detail
 *
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEventDetail
 * @instance
 * @name remove
 * @type {oj.DataProviderOperationEventDetail}
 * @ojsignature {target: "Type",
 *               value: "?DataProviderOperationEventDetail<K, D>"}
 */

/**
 * Optional update operation detail
 *
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEventDetail
 * @instance
 * @name update
 * @type {oj.DataProviderOperationEventDetail}
 * @ojsignature {target: "Type",
 *               value: "?DataProviderOperationEventDetail<K, D>"}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @class oj.DataProviderMutationEvent
 * @implements Event
 * @ojtsnoexport
 * @classdesc Mutation event dispatched by oj.DataProvider
 * @param {oj.DataProviderMutationEventDetail} detail the event detail
 * @ojsignature [{target: "Type",
 *               value: "class DataProviderMutationEvent<K, D> implements Event",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
 *               {target: "Type",
 *               value: "DataProviderMutationEventDetail<K, D>",
 *               for: "detail"}]
 */

/**
 * Event detail
 *
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name detail
 * @type {oj.DataProviderMutationEventDetail}
 * @ojsignature {target: "Type",
 *               value: "DataProviderMutationEventDetail<K, D>"}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name type
 * @type {string}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name bubbles
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name cancelable
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name cancelBubble
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 6.0.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name composed
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name currentTarget
 * @type {EventTarget}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name defaultPrevented
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name eventPhase
 * @type {number}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name isTrusted
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name returnValue
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name srcElement
 * @type {Element | null}
 */


/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name target
 * @type {EventTarget}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name timeStamp
 * @type {number}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name scoped
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name initEvent
 * @ojsignature {target: "Type",
 *               value: "(eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean) => void"}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name preventDefault
 * @ojsignature {target: "Type",
 *               value: "() => void"}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name stopImmediatePropagation
 * @ojsignature {target: "Type",
 *               value: "() => void"}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name stopPropagation
 * @ojsignature {target: "Type",
 *               value: "() => void"}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name deepPath
 * @ojsignature {target: "Type",
 *               value: "() => EventTarget[]"}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name AT_TARGET
 * @type {number}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name BUBBLING_PHASE
 * @type {number}
 */

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name CAPTURING_PHASE
 * @type {number}
 */

/**
 * @ojstatus preview
 * @since 6.0.0
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name NONE
 * @type {number}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @interface oj.DataProviderOperationEventDetail
 * @ojsignature {target: "Type",
 *               value: "interface DataProviderOperationEventDetail<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 */

/**
 * keys of items involved in the operation
 *
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderOperationEventDetail
 * @instance
 * @name keys
 * @type {Set.<any>}
 * @ojsignature {target: "Type",
 *               value: "Set<K>"}
 */

/**
 * Optional metadata of items involved in the operation
 *
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderOperationEventDetail
 * @instance
 * @name metadata
 * @type {Array.<ItemMetadata>}
 * @ojsignature {target: "Type",
 *               value: "?Array<ItemMetadata<K>>"}
 */

/**
 * Optional data of items involved in the operation
 *
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderOperationEventDetail
 * @instance
 * @name data
 * @type {Array.<Object>}
 * @ojsignature {target: "Type",
 *               value: "?D[]"}
 */

/**
 * Optional indexes of items involved in the operation
 *
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.DataProviderOperationEventDetail
 * @instance
 * @name indexes
 * @type {Array.<number>}
 * @ojsignature {target: "Type",
 *               value: "?number[]"}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
var DataProviderRefreshEvent = /** @class */ (function (_super) {
    __extends(DataProviderRefreshEvent, _super);
    function DataProviderRefreshEvent() {
        return _super.call(this, 'refresh') || this;
    }
    return DataProviderRefreshEvent;
}(GenericEvent));
oj.DataProviderRefreshEvent = DataProviderRefreshEvent;
oj['DataProviderRefreshEvent'] = DataProviderRefreshEvent;

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The oj.DataProviderRefreshEvent class
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @class oj.DataProviderRefreshEvent
 * @implements Event
 * @ojtsnoexport
 * @classdesc Refresh Event dispatched by the DataProvider. This event is fired when
 * the data has been refreshed and components need to re-fetch the data.
 * @ojsignature {target: "Type",
 *               value: "class DataProviderRefreshEvent implements Event"}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name type
 * @type {string}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name bubbles
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name cancelable
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name cancelBubble
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 6.0.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name composed
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name currentTarget
 * @type {EventTarget}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name defaultPrevented
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name eventPhase
 * @type {number}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name isTrusted
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name returnValue
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name srcElement
 * @type {Element | null}
 */


/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name target
 * @type {EventTarget}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name timeStamp
 * @type {number}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name scoped
 * @type {boolean}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name initEvent
 * @ojsignature {target: "Type",
 *               value: "(eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean) => void"}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name preventDefault
 * @ojsignature {target: "Type",
 *               value: "() => void"}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name stopImmediatePropagation
 * @ojsignature {target: "Type",
 *               value: "() => void"}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name stopPropagation
 * @ojsignature {target: "Type",
 *               value: "() => void"}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name deepPath
 * @ojsignature {target: "Type",
 *               value: "() => EventTarget[]"}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name AT_TARGET
 * @type {number}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name BUBBLING_PHASE
 * @type {number}
 */

/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name CAPTURING_PHASE
 * @type {number}
 */

/**
 * @ojstatus preview
 * @since 6.0.0
 * @export
 * @expose
 * @memberof oj.DataProviderRefreshEvent
 * @instance
 * @name NONE
 * @type {number}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @interface oj.DataProvider
 * @extends EventTarget
 * @ojsignature {target: "Type",
 *               value: "interface DataProvider<K, D> extends EventTarget",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 * @classdesc
 * DataProvider is the basic interface for getting runtime data which JET components that display list of items (such as [oj-table]{@link oj.ojTable} and [oj-list-view]{@link oj.ojListView}) can use.
 * <p>
 * JET provides some implementations of this interface, such as {@link oj.ArrayDataProvider}.
 * </p><p>
 * Applications can also create their own implementations of this interface and use them with JET components that support it.  For example, an application can create a DataProvider implementation
 * that fetches data from a REST endpoint.
 * </p><p>
 * Implementation class must implement all of the interface methods.  It should also fire the events described below when appropriate, so that JET components or other consumers can respond to data change accordingly.
 * </p>
 *
 * <h3 id="events-section">
 *   Events
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
 * </h3>
 * Implementation can fire the following events by creating an instance of the event class and passing the event payload in the constructor.
 * <h4 id="event:DataProviderMutationEvent" class="name">
 *   {@link oj.DataProviderMutationEvent}
 * </h4>
 * This event is fired when items have been added or removed from the data.
 * <p>
 * Event payload should implement the {@link oj.DataProviderMutationEventDetail} interface.
 * </p><p>
 * Consumers can add an event listener for the "mutate" event type on the DataProvider object.
 * </p>
 * <h4 id="event:DataProviderRefreshEvent" class="name">
 *   {@link oj.DataProviderRefreshEvent}
 * </h4>
 * This event is fired when the data has been refreshed and components need to re-fetch the data.
 * <p>
 * This event contains no additional event payload.
 * </p><p>
 * Consumers can add an event listener for the "refresh" event type on the DataProvider object.
 * </p>
 *
 * <i>Example of implementation firing an oj.DataProviderMutationEvent for removed items:</i>
 * <pre class="prettyprint"><code>var removeDetail = {data: removedDataArray,
 *                     indexes: removedIndexArray,
 *                     keys: removedKeySet,
 *                     metadata: removedMetadataArray};
 * this.dispatchEvent(new oj.DataProviderMutationEvent({remove: removeDetail}));
 * </code></pre>
 *
 * <i>Example of consumer listening for the "mutate" event type:</i>
 * <pre class="prettyprint"><code>var listener = function(event) {
 *   if (event.detail.remove) {
 *     var removeDetail = event.detail.remove;
 *     // Handle removed items
 *   }
 * };
 * dataProvider.addEventListener("mutate", listener);
 * </code></pre>
 */
oj.DataProvider = function () {
};

/**
 * Get an asyncIterator which can be used to fetch a block of data.
 *
 * @ojstatus preview
 * @since 4.2.0
 * @param {oj.FetchListParameters=} params fetch parameters
 * @return {AsyncIterable.<oj.FetchListResult>} AsyncIterable with {@link oj.FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof oj.DataProvider
 * @instance
 * @method
 * @name fetchFirst
 * @ojsignature {target: "Type",
 *               value: "(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>"}
 * @example <caption>Get an asyncIterator and then fetch first block of data by executing next() on the iterator. Subsequent blocks can be fetched by executing next() again.</caption>
 * var asyncIterator = dataprovider.fetchFirst(options)[Symbol.asyncIterator]();
 * asyncIterator.next().then(function(result) {
 *   var value = result.value;
 *   var data = value.data;
 *   var keys = value.metadata.map(function(val) {
 *     return val.key;
 * });
 */

/**
 * Determines whether this DataProvider supports a certain feature.
 *
 * @ojstatus preview
 * @since 4.2.0
 * @param {string} capabilityName capability name. Supported capability names are:
 *                  "fetchByKeys", "fetchByOffset", "sort", and "filter".
 * @return {Object} capability information or null if unsupported
 * <ul>
 *   <li>If capabilityName is "fetchByKeys", returns a {@link oj.FetchByKeysCapability} object.</li>
 *   <li>If capabilityName is "fetchByOffset", returns a {@link oj.FetchByOffsetCapability} object.</li>
 *   <li>If capabilityName is "sort", returns a {@link oj.SortCapability} object.</li>
 *   <li>If capabilityName is "filter", returns a {@link oj.FilterCapability} object.</li>
 *   <li>If capabilityName is "fetchCapability", returns a {@link oj.FetchCapability} object.</li>
 * </ul>
 * @export
 * @expose
 * @memberof oj.DataProvider
 * @instance
 * @method
 * @name getCapability
 * @ojsignature {target: "Type",
 *               value: "(capabilityName: string): any"}
 * @example <caption>Check what kind of fetchByKeys is supported.</caption>
 * var capabilityInfo = dataprovider.getCapability('fetchByKeys');
 * if (capabilityInfo.implementation == 'iteration') {
 *   // the DataProvider supports iteration for fetchByKeys
 *   ...
 */

/**
 * Return the total number of rows in this dataprovider
 *
 * @ojstatus preview
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows. -1 is unknown row count.
 * @export
 * @expose
 * @memberof oj.DataProvider
 * @instance
 * @method
 * @name getTotalSize
 * @example <caption>Get the total rows</caption>
 * dataprovider.getTotalSize().then(function(value) {
 *   if (value == -1) {
 *     // we don't know the total row count
 *   } else {
 *     // the total count
 *     console.log(value);
 * });
 */

/**
 * Fetch rows by keys
 * <p>
 * A generic implementation of this method is available from {@link oj.FetchByKeysMixin}.
 * It is for convenience and may not provide the most efficient implementation for your data provider.
 * Classes that implement the DataProvider interface are encouraged to provide a more efficient implementation.
 * </p>
 *
 * @ojstatus preview
 * @since 4.2.0
 * @param {oj.FetchByKeysParameters} parameters fetch by key parameters
 * @return {Promise.<oj.FetchByKeysResults>} Returns Promise which resolves to {@link oj.FetchByKeysResults}.
 * @export
 * @expose
 * @memberof oj.DataProvider
 * @instance
 * @method
 * @name fetchByKeys
 * @ojsignature {target: "Type",
 *               value: "(parameters : FetchByKeysParameters<K>) : Promise<FetchByKeysResults<K, D>>"}
 * @example <caption>Fetch for keys 1001 and 556</caption>
 * var fetchKeys = [1001, 556];
 * dataprovider.fetchByKeys({keys: fetchKeys}).then(function(value) {
 *   // get the data for key 1001
 *   console.log(value.results.get(1001).data);
 * });
 */

/**
 * Check if there are rows containing the specified keys
 * <p>
 * A generic implementation of this method is available from {@link oj.FetchByKeysMixin}.
 * It is for convenience and may not provide the most efficient implementation for your data provider.
 * Classes that implement the DataProvider interface are encouraged to provide a more efficient implementation.
 * </p>
 *
 * @ojstatus preview
 * @since 4.2.0
 * @param {oj.FetchByKeysParameters} parameters contains by key parameters
 * @return {Promise.<oj.ContainsKeysResults>} Returns Promise which resolves to {@link oj.ContainsKeysResults}.
 * @export
 * @expose
 * @memberof oj.DataProvider
 * @instance
 * @method
 * @name containsKeys
 * @ojsignature {target: "Type",
 *               value: "(parameters : FetchByKeysParameters<K>) : Promise<ContainsKeysResults<K>>"}
 * @example <caption>Check if keys 1001 and 556 are contained</caption>
 * var containsKeys = [1001, 556];
 * dataprovider.containsKeys({keys: containsKeys}).then(function(value) {
 *   var results = value['results'];
 *   if (results.has(1001)) {
 *     console.log('Has key 1001');
 *   } else if (results.has(556){
 *     console.log('Has key 556');
 *   }
 * });
 */

/**
 * Fetch rows by offset
 * <p>
 * A generic implementation of this method is available from {@link oj.FetchByOffsetMixin}.
 * It is for convenience and may not provide the most efficient implementation for your data provider.
 * Classes that implement the DataProvider interface are encouraged to provide a more efficient implementation.
 * </p>
 *
 * @ojstatus preview
 * @since 4.2.0
 * @param {oj.FetchByOffsetParameters} parameters fetch by offset parameters
 * @return {Promise.<oj.FetchByOffsetResults>} Returns Promise which resolves to {@link oj.FetchByOffsetResults}.
 * @export
 * @expose
 * @memberof oj.DataProvider
 * @instance
 * @method
 * @name fetchByOffset
 * @ojsignature {target: "Type",
 *               value: "(parameters: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>"}
 * @example <caption>Fetch by offset 5 rows starting at index 2</caption>
 * dataprovider.fetchByOffset({size: 5, offset: 2}).then(function(value) {
 *   var results = result['results'];
 *   var data = results.map(function(value) {
 *     return value['data'];
 *   });
 *   var keys = results.map(function(value) {
 *     return value['metadata']['key'];
 *   });
 * });
 */

/**
 * Returns a string that indicates if this data provider is empty.  Valid values are:
 * <ul>
 * <li>"yes": this data provider is empty.</li>
 * <li>"no": this data provider is not empty.</li>
 * <li>"unknown": it is not known if this data provider is empty until a fetch is made.</li>
 * </ul>
 *
 * @ojstatus preview
 * @since 4.2.0
 * @return {"yes" | "no" | "unknown"} string that indicates if this data provider is empty
 * @export
 * @expose
 * @memberof oj.DataProvider
 * @instance
 * @method
 * @name isEmpty
 * @ojsignature {target: "Type",
 *               value: "(): 'yes' | 'no' | 'unknown'"}
 * @example <caption>Check if empty</caption>
 * var isEmpty = dataprovider.isEmpty();
 * console.log('DataProvider is empty: ' + isEmpty);
 */

/**
 * Return an empty Set which is optimized to store keys
 * <p>
 * Optionally provided by certain DataProvider implementations for storing
 * keys from the DataProvider in a performant fashion. Sometimes components will
 * need to temporarily store a Set of keys provided by the DataProvider, for
 * example, in the case of maintaining a Set of selected keys. Only the DataProvider
 * is aware of the internal structure of keys such as whether they are primitives, Strings,
 * or objects and how to do identity comparisons. Therefore, the DataProvider can optionally
 * provide a Set implementation which can performantly store keys surfaced by the
 * DataProvider.
 * </p>
 *
 * @ojstatus preview
 * @since 6.2.0
 * @param {Set.<any>=} Optionally specify an initial set of keys for the Set. If not specified, then return an empty Set.
 * @return {Set.<any>} Returns a Set optimized for handling keys from the DataProvider.
 * @export
 * @expose
 * @memberof oj.DataProvider
 * @instance
 * @method
 * @name createOptimizedKeySet
 * @ojsignature {target: "Type",
 *               value: "?(initialSet?: Set<K>): Set<K>"}
 * @example <caption>create empty key Set</caption>
 * var keySet = dataprovider.createOptimizedKeySet();
 */

/**
 * Return an empty Map which is optimized to store key value pairs
 * <p>
 * Optionally provided by certain DataProvider implementations for storing
 * key/value pairs from the DataProvider in a performant fashion. Sometimes components will
 * need to temporarily store a Map of keys provided by the DataProvider, for
 * example, in the case of maintaining a Map of selected keys. Only the DataProvider
 * is aware of the internal structure of keys such as whether they are primitives, Strings,
 * or objects and how to do identity comparisons. Therefore, the DataProvider can optionally
 * provide a Map implementation which can performantly store key/value pairs surfaced by the
 * DataProvider.
 * </p>
 *
 * @ojstatus preview
 * @since 6.2.0
 * @param {Map.<any>=} Optionally specify an initial map of key/values for the Map. If not specified, then return an empty Map.
 * @return {Map.<any>} Returns a Map optimized for handling keys from the DataProvider.
 * @export
 * @expose
 * @memberof oj.DataProvider
 * @instance
 * @method
 * @name createOptimizedKeyMap
 * @ojsignature {target: "Type",
 *               value: "?(initialMap?: Map<K, D>): Map<K, D>"}
 * @example <caption>create empty key Map</caption>
 * var keyMap = dataprovider.createOptimizedKeyMap();
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * The interface for oj.FetchAttribute
 *
 * @ojstatus preview
 * @since 6.1.0
 * @export
 * @interface oj.FetchAttribute
 * @ojsignature {target: "Type",
 *               value: "interface FetchAttribute"}
 */

/**
 * The name of the attribute or sub object or related object.
 *
 * @ojstatus preview
 * @since 6.1.0
 * @export
 * @expose
 * @memberof oj.FetchAttribute
 * @instance
 * @name name
 * @type string
 * @ojsignature {target: "Type",
 *               value: "string"}
 */

/**
 * Optional attributes property which specifies at least which attributes of the value we want to include. If not specified then the default attributes are included. If the value
 * is a primitive then this is ignored. Expressions like "!" and "@default" are also supported. @default indicates the default attributes the implementation chooses to include in the result, by default.
 * e.g. ['!lastName', '@default'] for everything except 'lastName'. For only
 * 'firstName' and 'lastName' we'd have ['firstName', 'lastName']. Order does not matter when @default is used with field exclusions "!".
 * This can be nested. e.g. ['!lastName', '@default', {name: 'location', attributes: ['address line 1', 'address line 2']}].
 * When specified attributes, exclusions and @default are all present as in  [‘id’, ‘firstName’, ‘!lastName’, ‘@default’, ‘email’], this means that
 * all default attributes (including 'id', 'firstName', and 'email') except for 'lastName' will be included.
 * Also, a string value for attribute is equivalent to an object value with only name. e.g.  ['lastName', 'firstName'] is the same as [{name: 'lastName'}, {name: 'firstName'}]
 *
 * @ojstatus preview
 * @since 6.1.0
 * @export
 * @expose
 * @memberof oj.FetchAttribute
 * @instance
 * @name attributes
 * @type {Array.<string | oj.FetchAttribute>}
 * @ojsignature {target: "Type",
 *               value: "?Array<string | FetchAttribute>"}
 */

 /**
  * end of jsdoc
  */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for oj.FetchByKeysCapability
 *
 * @ojstatus preview
 * @export
 * @interface oj.FetchByKeysCapability
 * @since 4.2.0
 * @ojsignature {target: "Type",
 *               value: "interface FetchByKeysCapability<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 */

/**
 * The type of implementation for fetchByKeys and containsKeys methods.  Possible values are:
 * <ul>
 * <li>"iteration": the implementation uses fetchFirst iteratively to find the result</li>
 * <li>"lookup": the implementation uses direct lookup to find the result</li>
 * </ul>
 *
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.FetchByKeysCapability
 * @instance
 * @name implementation
 * @type {"iteration" | "lookup"}
 */

/**
 * End of jsdoc
 */

var FetchByKeysMixin = /** @class */ (function () {
    function FetchByKeysMixin() {
    }
    /**
     * Fetch rows by keys
     */
    FetchByKeysMixin.prototype.fetchByKeys = function (params) {
        var fetched = 0;
        var limit = this['getIterationLimit'] ? this['getIterationLimit']() : -1;
        var options = {};
        options['size'] = 25;
        var resultMap = new Map();
        var dataProviderAsyncIterator = this['fetchFirst'](options)[Symbol.asyncIterator]();
        function _fetchNextSet(params, dataProviderAsyncIterator, resultMap) {
            return dataProviderAsyncIterator.next().then(function (result) {
                var value = result['value'];
                var data = value['data'];
                var metadata = value['metadata'];
                var keys = metadata.map(function (metadata) {
                    return metadata['key'];
                });
                var foundAllKeys = true;
                params['keys'].forEach(function (findKey) {
                    if (!resultMap.has(findKey)) {
                        keys.map(function (key, index) {
                            if (key == findKey) {
                                resultMap.set(key, { 'metadata': metadata[index], 'data': data[index] });
                            }
                        });
                    }
                    if (!resultMap.has(findKey)) {
                        foundAllKeys = false;
                    }
                });
                // Keep track of how many rows we have fetched
                fetched += data.length;
                // Keep iterating if we haven't found all keys and there are more data
                if (!foundAllKeys && !result['done']) {
                    if (limit != -1 && fetched >= limit) {
                        // If we have reached the limit, just return the results
                        return resultMap;
                    }
                    else {
                        return _fetchNextSet(params, dataProviderAsyncIterator, resultMap);
                    }
                }
                else {
                    return resultMap;
                }
            });
        }
        return _fetchNextSet(params, dataProviderAsyncIterator, resultMap).then(function (resultMap) {
            var mappedResultMap = new Map();
            resultMap.forEach(function (value, key) {
                var mappedItem = [value];
                mappedResultMap.set(key, mappedItem[0]);
            });
            return { 'fetchParameters': params, 'results': mappedResultMap };
        });
    };
    /**
     * Check if rows are contained by keys
     */
    FetchByKeysMixin.prototype.containsKeys = function (params) {
        return this.fetchByKeys(params).then(function (fetchByKeysResult) {
            var results = new Set();
            params['keys'].forEach(function (key) {
                if (fetchByKeysResult['results'].get(key) != null) {
                    results.add(key);
                }
            });
            return Promise.resolve({ 'containsParameters': params,
                'results': results });
        });
    };
    FetchByKeysMixin.prototype.getCapability = function (capabilityName) {
        if (capabilityName == 'fetchByKeys') {
            return { implementation: 'iteration' };
        }
        var cap = null;
        if (this['_ojSkipLastCapability'] !== true) {
            this['_ojSkipLastCapability'] = true;
            // Find the index for the very last _ojLastGetCapability
            var index = 1;
            while (this['_ojLastGetCapability' + index]) {
                ++index;
            }
            // Iterate through the _ojLastGetCapability(n) in reverse order
            for (--index; index > 0; index--) {
                cap = this['_ojLastGetCapability' + index](capabilityName);
                if (cap) {
                    break;
                }
            }
            delete this['_ojSkipLastCapability'];
        }
        return cap;
    };
    FetchByKeysMixin.applyMixin = function (derivedCtor) {
        // Save the current getCapability
        var _lastGetCapability = derivedCtor.prototype['getCapability'];
        var baseCtors = [FetchByKeysMixin];
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
        if (_lastGetCapability) {
            var index = 1;
            while (derivedCtor.prototype['_ojLastGetCapability' + index]) {
                ++index;
            }
            derivedCtor.prototype['_ojLastGetCapability' + index] = _lastGetCapability;
        }
    };
    return FetchByKeysMixin;
}());
oj['FetchByKeysMixin'] = FetchByKeysMixin;
oj['FetchByKeysMixin']['applyMixin'] = FetchByKeysMixin.applyMixin;

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @export
 * @namespace oj.FetchByKeysMixin
 * @classdesc Mixin class to provide generic implementation of fetchByKeys and containsKeys
 * methods for the {@link oj.DataProvider} interface.
 * <p>
 * By default, the mixin implementation will iterate through all the rows to find
 * the result.  DataProvider implementations can implement a "getIterationLimit" function
 * that returns a row limit for the iteration:<br>
 * getIterationLimit() => number
 * </p>
 * <p>
 * This class cannot be instantiated.  You can only call the static applyMixin
 * method to add the implementation to another class.
 * </p>
 * @since 4.2.0
 * @hideconstructor
 */

/**
 * Apply this mixin to another class
 *
 * @ojstatus preview
 * @param {Function} derivedCtor the constructor of an existing class
 * @export
 * @expose
 * @memberof oj.FetchByKeysMixin
 * @method
 * @name applyMixin
 * @example <caption>Apply the mixin in Typescript:</caption>
 * class CustomDataProvider&lt;K, D> implements DataProvider&lt;K, D> {
 *   // Add stand-in properties to satisfy the compiler
 *   containsKeys: (parameters: FetchByKeysParameters&lt;K>) => Promise&lt;ContainsKeysResults&lt;K>>;
 *   fetchByKeys: (parameters: FetchByKeysParameters&lt;K>) => Promise&lt;FetchByKeysResults&lt;K, D>>;
 *
 *   constructor() {
 *     // Constructor implementation
 *   }
 * }
 *
 * oj.FetchByKeysMixin.applyMixin(CustomDataProvider);
 *
 * @example <caption>Apply the mixin in Javascript:</caption>
 * function CustomDataProvider() {
 *   // Constructor implementation
 * }
 *
 * oj.FetchByKeysMixin.applyMixin(CustomDataProvider);
 * @ojsignature {target: "Type", value: "(derivedCtor: {new(): DataProvider<any, any>}): any;"}
 */

 /**
  * end of jsdoc
  */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for oj.FetchByOffsetCapability
 *
 * @ojstatus preview
 * @export
 * @interface oj.FetchByOffsetCapability
 * @since 4.2.0
 * @ojsignature {target: "Type",
 *               value: "interface FetchByOffsetCapability<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 */

/**
 * The type of implementation for fetchByOffset method.  Possible values are:
 * <ul>
 * <li>"iteration": the implementation uses fetchFirst iteratively to find the result</li>
 * <li>"randomAccess": the implementation uses random access to find the result</li>
 * </ul>
 *
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.FetchByOffsetCapability
 * @instance
 * @name implementation
 * @type {"iteration" | "randomAccess"}
 */

/**
 * End of jsdoc
 */

var FetchByOffsetMixin = /** @class */ (function () {
    function FetchByOffsetMixin() {
    }
    /**
     * Fetch rows by offset
     */
    FetchByOffsetMixin.prototype.fetchByOffset = function (params) {
        var size = params && params['size'] > 0 ? params['size'] : 25;
        var sortCriteria = params ? params['sortCriteria'] : null;
        var offset = params && params['offset'] > 0 ? params['offset'] : 0;
        var fetched = 0;
        var limit = this['getIterationLimit'] ? this['getIterationLimit']() : -1;
        var done = false;
        var options = {};
        options['size'] = size;
        options['sortCriteria'] = sortCriteria;
        var resultArray = new Array();
        var dataProviderAsyncIterator = this['fetchFirst'](options)[Symbol.asyncIterator]();
        function _fetchNextSet(params, dataProviderAsyncIterator, resultArray) {
            return dataProviderAsyncIterator.next().then(function (result) {
                done = result['done'];
                var value = result['value'];
                var data = value['data'];
                var metadata = value['metadata'];
                var dataLen = data.length;
                if (offset < (fetched + dataLen)) {
                    var start = (offset <= fetched) ? 0 : (offset - fetched);
                    for (var index = start; index < dataLen; index++) {
                        if (resultArray.length == size) {
                            break;
                        }
                        resultArray.push({ 'metadata': metadata[index], 'data': data[index] });
                    }
                }
                fetched += dataLen;
                if (resultArray.length < size && !done) {
                    if (limit != -1 && fetched >= limit) {
                        // If we have reached the limit, just return the results
                        return resultArray;
                    }
                    else {
                        return _fetchNextSet(params, dataProviderAsyncIterator, resultArray);
                    }
                }
                else {
                    return resultArray;
                }
            });
        }
        return _fetchNextSet(params, dataProviderAsyncIterator, resultArray).then(function (resultArray) {
            return { 'fetchParameters': params,
                'results': resultArray,
                'done': done };
        });
    };
    FetchByOffsetMixin.prototype.getCapability = function (capabilityName) {
        if (capabilityName == 'fetchByOffset') {
            return { implementation: 'iteration' };
        }
        var cap = null;
        if (this['_ojSkipLastCapability'] !== true) {
            this['_ojSkipLastCapability'] = true;
            // Find the index for the very last _ojLastGetCapability
            var index = 1;
            while (this['_ojLastGetCapability' + index]) {
                ++index;
            }
            // Iterate through the _ojLastGetCapability(n) in reverse order
            for (--index; index > 0; index--) {
                cap = this['_ojLastGetCapability' + index](capabilityName);
                if (cap) {
                    break;
                }
            }
            delete this['_ojSkipLastCapability'];
        }
        return cap;
    };
    FetchByOffsetMixin.applyMixin = function (derivedCtor) {
        // Save the current getCapability
        var _lastGetCapability = derivedCtor.prototype['getCapability'];
        var baseCtors = [FetchByOffsetMixin];
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
        if (_lastGetCapability) {
            var index = 1;
            while (derivedCtor.prototype['_ojLastGetCapability' + index]) {
                ++index;
            }
            derivedCtor.prototype['_ojLastGetCapability' + index] = _lastGetCapability;
        }
    };
    return FetchByOffsetMixin;
}());
oj['FetchByOffsetMixin'] = FetchByOffsetMixin;
oj['FetchByOffsetMixin']['applyMixin'] = FetchByOffsetMixin.applyMixin;

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @export
 * @namespace oj.FetchByOffsetMixin
 * @classdesc Mixin class to provide generic implementation of fetchByOffset
 * method for the {@link oj.DataProvider} interface.
 * <p>
 * By default, the mixin implementation will iterate through all the rows to find
 * the result.  DataProvider implementations can implement a "getIterationLimit" function
 * that returns a row limit for the iteration:<br>
 * getIterationLimit() => number
 * </p>
 * <p>
 * This class cannot be instantiated.  You can only call the static applyMixin
 * method to add the implementation to another class.
 * </p>
 * @since 4.2.0
 * @hideconstructor
 */

/**
 * Apply this mixin to another class
 *
 * @ojstatus preview
 * @param {Function} derivedCtor the constructor of an existing class
 * @export
 * @expose
 * @memberof oj.FetchByOffsetMixin
 * @method
 * @name applyMixin
 * @example <caption>Apply the mixin in Typescript:</caption>
 * class CustomDataProvider&lt;K, D> implements DataProvider&lt;K, D> {
 *   // Add a stand-in property to satisfy the compiler
 *   fetchByOffset: (parameters: FetchByOffsetParameters&lt;D>) => Promise&lt;FetchByOffsetResults&lt;K, D>>;
 *
 *   constructor() {
 *     // Constructor implementation
 *   }
 * }
 *
 * oj.FetchByOffsetMixin.applyMixin(CustomDataProvider);
 *
 * @example <caption>Apply the mixin in Javascript:</caption>
 * function CustomDataProvider() {
 *   // Constructor implementation
 * }
 *
 * oj.FetchByOffsetMixin.applyMixin(CustomDataProvider);
 * @ojsignature {target: "Type", value: "(derivedCtor: {new(): DataProvider<any, any>}): any;"}
 */

 /**
  * end of jsdoc
  */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * The interface for oj.FetchByOffsetParameters
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.FetchByOffsetParameters
 * @extends oj.FetchListParameters
 * @ojsignature {target: "Type",
 *               value: "interface FetchByOffsetParameters<D> extends FetchListParameters<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 */

/**
 * The offset used for the fetch call.
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.FetchByOffsetParameters
 * @instance
 * @name offset
 * @type {number}
 */

/**
 * attributes to include in the result. If specified, then at least these set of attributes will be included in each row
 * results. If not specified then the default attributes will be included.
 *
 * @ojstatus preview
 * @since 6.1.0
 * @export
 * @expose
 * @memberof oj.FetchByOffsetParameters
 * @instance
 * @name attributes
 * @type {Array.<string | oj.FetchAttribute>}
 * @ojsignature {target: "Type",
 *               value: "?Array<string | FetchAttribute>"}
 */

/**
 * The interface for oj.FetchByOffsetResults
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.FetchByOffsetResults
 * @ojsignature {target: "Type",
 *               value: "interface FetchByOffsetResults<K, D>"}
 */

/**
 * The parameters used for the fetch call.
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.FetchByOffsetResults
 * @instance
 * @name fetchParameters
 * @type {oj.FetchByOffsetParameters}
 * @ojsignature {target: "Type",
 *               value: "FetchByOffsetParameters<D>"}
 */


/**
 * Array of {@link oj.Item}.
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.FetchByOffsetResults
 * @instance
 * @name results
 * @type {Array.<oj.Item>}
 * @ojsignature {target: "Type",
 *               value: "Array<Item<K, D>>"}
 */

/**
 * Indicates whether there are more items which can be fetched.
 * <p>If this is true, fetching the next block will likely return an empty array as the result.  A DataProvider can potentially make a stronger guarantee (if the DataProvider is running against an immutable repository or the DataProvider doesn’t attempt to retrieve a subsequent block if the DataProvider believes it is complete).  We don’t generally make the stronger guarantee since the repository may have been mutated since the previous response with done:true, such that new records would be returned.</p>
 * <p>If this is false, fetching the next block may or may not return an empty array as a result.</p>
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.FetchByOffsetResults
 * @instance
 * @name done
 * @type {boolean}
 */

 /**
  * end of jsdoc
  */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for oj.FetchCapability
 *
 * @ojstatus preview
 * @export
 * @interface oj.FetchCapability
 * @since 6.1.0
 * @ojsignature {target: "Type",
 *               value: "interface FetchCapability"}
 */

/**
 * Optional detailed attribute filter capability information
 *
 * @ojstatus preview
 * @since 6.1.0
 * @export
 * @expose
 * @memberof oj.FetchCapability
 * @instance
 * @name attributeFilter
 * @type {oj.AttributeFilterCapability}
 * @ojsignature {target: "Type",
 *               value: "AttributeFilterCapability"}
 */

/**
 * The interface for oj.AttributeFilterCapability
 *
 * @ojstatus preview
 * @export
 * @interface oj.AttributeFilterCapability
 * @since 6.1.0
 * @ojsignature {target: "Type",
 *               value: "interface AttributeFilterCapability"}
 */

/**
 * Optional attribute expansion filter capability information
 *
 * @ojstatus preview
 * @since 6.1.0
 * @export
 * @expose
 * @memberof oj.AttributeFilterCapability
 * @instance
 * @name expansion
 * @type {object=}
 */

/**
 * Optional attribute ordering filter capability information
 *
 * @ojstatus preview
 * @since 6.1.0
 * @export
 * @expose
 * @memberof oj.AttributeFilterCapability
 * @instance
 * @name ordering
 * @type {object=}
 */

/**
 * Optional attribute defaultShape filter capability information
 *
 * @ojstatus preview
 * @since 6.1.0
 * @export
 * @expose
 * @memberof oj.AttributeFilterCapability
 * @instance
 * @name defaultShape
 * @type {object=}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for oj.FilterCapability
 *
 * @ojstatus preview
 * @export
 * @interface oj.FilterCapability
 * @since 5.0.0
 * @ojsignature {target: "Type",
 *               value: "interface FilterCapability"}
 */

/**
 * An array of supported filter operator strings
 *
 * @ojstatus preview
 * @since 5.0.0
 * @export
 * @expose
 * @memberof oj.FilterCapability
 * @instance
 * @name operators
 * @type {Array.<string>}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
var FilterImpl = /** @class */ (function () {
    function FilterImpl(options) {
        var filterDef = options ? options.filterDef : null;
        if (filterDef) {
            this['op'] = filterDef['op'];
        }
        if (filterDef.value) {
            this['value'] = filterDef['value'];
            if (filterDef['attribute']) {
                this['attribute'] = filterDef['attribute'];
            }
        }
        else if (filterDef) {
            this['criteria'] = filterDef['criteria'];
        }
    }
    FilterImpl.prototype.filter = function (item, index, array) {
        return oj.FilterUtils.satisfy(FilterImpl._transformFilter(this), item);
    };
    FilterImpl._transformFilter = function (filter) {
        var transformedExpr;
        if (filter) {
            var self_1 = this;
            var op = filter.op;
            // offline has slightly different names for some operators
            if (op === '$le') {
                op = '$lte';
            }
            else if (op === '$ge') {
                op = '$gte';
            }
            else if (op === '$pr') {
                op = "$exists";
            }
            if (op != '$and' && op != '$or') {
                var filterValue = filter.value;
                transformedExpr = {};
                var attributeExpr = filter.attribute;
                if (attributeExpr) {
                    var operatorExpr = {};
                    // need express sw and ew as regex
                    if (op === '$sw' ||
                        op === '$ew' ||
                        op === '$co') {
                        op = '$regex';
                        filterValue = FilterImpl._fixStringExpr(op, filterValue);
                    }
                    operatorExpr[op] = filterValue;
                    transformedExpr[attributeExpr] = operatorExpr;
                }
                else {
                    // the field/value combos are specified in the value itself
                    var criteriaArray = [];
                    FilterImpl._transformObjectExpr(filterValue, op, null, criteriaArray);
                    transformedExpr['$and'] = criteriaArray;
                }
            }
            else {
                var criteriaArray_1 = [];
                filter.criteria.forEach(function (criterion) {
                    criteriaArray_1.push(FilterImpl._transformFilter(criterion));
                });
                transformedExpr = {};
                transformedExpr[op] = criteriaArray_1;
            }
        }
        return transformedExpr;
    };
    FilterImpl._transformObjectExpr = function (objectExpr, op, path, criteriaArray) {
        var self = this;
        var objectProps = Object.keys(objectExpr);
        if (objectProps.length > 0) {
            Object.keys(objectExpr).forEach(function (fieldAttribute) {
                var fieldValue = objectExpr[fieldAttribute];
                var fieldAttributePath = path ? path + '.' + fieldAttribute : fieldAttribute;
                if (!(fieldValue instanceof Object)) {
                    var operatorExpr = {};
                    // need express co, sw and ew as regex
                    if (op === '$sw' ||
                        op === '$ew' ||
                        op === '$co') {
                        op = '$regex';
                        fieldValue = FilterImpl._fixStringExpr(op, fieldValue);
                    }
                    operatorExpr[op] = fieldValue;
                    var fieldExpr = {};
                    fieldExpr[fieldAttributePath] = operatorExpr;
                    criteriaArray.push(fieldExpr);
                }
                else {
                    FilterImpl._transformObjectExpr(fieldValue, op, fieldAttributePath, criteriaArray);
                }
            });
        }
        else {
            var operatorExpr = {};
            operatorExpr[op] = objectExpr;
            var fieldExpr = {};
            fieldExpr[path] = operatorExpr;
            criteriaArray.push(fieldExpr);
        }
    };
    FilterImpl._fixStringExpr = function (op, value) {
        if ((typeof value === 'string') || (value instanceof String)) {
            if (op === '$sw') {
                value = '^' + value;
            }
            else if (op === '$ew') {
                value = value + '$';
            }
        }
        return value;
    };
    return FilterImpl;
}());
var FilterFactory = /** @class */ (function () {
    function FilterFactory() {
    }
    FilterFactory.getFilter = function (options) {
        return (new FilterImpl(options));
    };
    return FilterFactory;
}());
oj['FilterFactory'] = FilterFactory;

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The class oj.FilterFactory
 *
 * @ojstatus preview
 * @export
 * @class oj.FilterFactory
 * @since 7.0.0
 * @ojsignature {target: "Type",
 *               value: "class FilterFactory<D>"}
 * @hideconstructor
 */

/**
 * This function is used to pass in a filter definition and returns a filter which can be used
 * with DataProviders. It essentially takes the filter definition and then adds a local filter()
 * function which is required when used for a DataProvider filterCriterion.
 *
 * @ojstatus preview
 * @since 7.0.0
 * @export
 * @expose
 * @memberof oj.FilterFactory
 * @instance
 * @name getFilter
 * @method
 * @param {Object} options Options for the getFilter() function
 * @param {AttributeFilterDef | CompoundFilterDef} options.filterDef The filter definition for the filter to be returned.
 * @return {AttributeFilter | CompoundFilter} Returns either an AttributeFilter or CompoundFilter depending on whether a AttributeFilterDef or CompoundFilterDef.
 * was passed in.
 * @ojsignature {target: "Type",
 *               value: "(options: {filterDef: AttributeFilterDef<D> | CompoundFilterDef<D>}) : AttributeFilter<D> | CompoundFilter<D>"}
 * @example
 * <caption>Get filter which filters on DepartmentId value 10 and then fetch filtered rows from the DataProvider</caption>
 * var filter = FilterFactory.getFilter({filterDef: {op: '$eq', value: {DepartmentId: 10}}};
 * var dataProviderAsyncIterator = dataprovider.fetchFirst({filterCriterion: filter})[Symbol.asyncIterator]();
 * dataProviderAsyncIterator.next().then(function(result)
 * {
 *   ...
 **/

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for oj.FilterOperator
 *
 * @ojstatus preview
 * @export
 * @interface oj.FilterOperator
 * @since 5.0.0
 * @ojsignature {target: "Type",
 *               value: "interface FilterOperator<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @ojdeprecated {since: '7.0.0', description: 'Use AttributeFilter or CompoundFilter instead.'}
 */

/**
 * The operator, either an oj.AttributeFilterOperator.AttributeOperator or oj.CompoundFilterOperator.CompoundOperator.
 *
 * @ojstatus preview
 * @since 5.0.0
 * @export
 * @expose
 * @memberof oj.FilterOperator
 * @instance
 * @name op
 * @type {oj.AttributeFilterOperator.AttributeOperator | oj.CompoundFilterOperator.CompoundOperator}
 */

/**
 * Optional function which is used to locally filter the data.
 *
 * @ojstatus preview
 * @since 5.0.0
 * @export
 * @expose
 * @memberof oj.FilterOperator
 * @instance
 * @name filter
 * @method
 * @param {Array} data The data to filter
 * @return {Array} filtered data
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */
/* eslint-disable */
/**
 * @ignore
 * @class oj.FilterUtils
 * @constructor
 */
oj.FilterUtils = function () {
  'use strict';
  
  /**
    * Helper function that checks if itemData satisfies the search criteria
    * defined by selector or not. Undefined selector means everything is
    * selected.
    * @method
    * @name satisfy
    * @memberof! storageUtils
    * @static
    * @param {string} selector Rule that defines whether an object is selected
    *                          or not.
    * @param {object} itemData The value to check with.
    * @returns {boolean} true if itemData satisfies search criteria defined
    *                         by selector, and false otherwise.
    */
  function satisfy(selector, itemData) {
    if (!selector) {
      // undefined selector means select everything.
      return true;
    } else {
      var expTree = _buildExpressionTree(selector);
      return _evaluateExpressionTree(expTree, itemData);
    }
  };
   
  /**
   * Helper function used by {@link _satisfy} to build an expression tree
   * based on expression object for easier evaluation later.
   * @method
   * @name _buildExpressionTree
   * @memberof! storageUtils
   * @static
   * @param {object} expression The expression that used to filter an object.
   * @returns {object} The tree representation of the passed-in expression.
   */
  function _buildExpressionTree(expression) {
    var subTree;
    var itemTreeArray = [];
    for (var key in expression) {
      if (expression.hasOwnProperty(key)) {
        var value = expression[key];
        if (key.indexOf('$') === 0) {
          if (_isMultiSelector(key)) {
            if (value instanceof Array) {
              subTree = {
                operator: key,
                array: []
              };
              for (var subindex = 0; subindex < value.length; subindex++) {
                var itemTree = _buildExpressionTree(value[subindex]);
                subTree.array.push(itemTree);
              }
            } else {
              throw new Error("not a valid expression: " + expression);
            }
          } else if (_isSingleSelector(key)) {
            throw new Error("not a valid expression: " + expression);
          }
        } else if (_isLiteral(value)) {
          itemTreeArray.push({
            left: key,
            right: value,
            operator: '$eq'
          });
        } else {
          var partialTree = {
            left: key,
          };
          _completePartialTree(partialTree, value);
          itemTreeArray.push(partialTree);
        }
      }
    }

    if (itemTreeArray.length > 1) {
      subTree = {
        operator: '$and',
        array: itemTreeArray
      };
    } else if (itemTreeArray.length === 1) {
      subTree = itemTreeArray[0];
    }

    return subTree;
  };

  /**
   * Helper function used by {@link _buildExpressionTree} to complete the
   * right side of an expression tree.
   * @method
   * @name _completePartialTree
   * @memberof! storageUtils
   * @static
   * @param {object} partialTree The tree representation of an expression.
   * @param {object} expression The object to evaluate the expression tree
   *                          against.
   */
  function _completePartialTree(partialTree, expression) {
    var found = false;
    for (var key in expression) {
      if (expression.hasOwnProperty(key)) {
        var value = expression[key];
        if (found || !_isSingleSelector(key)) {
          throw new Error("parsing error " + expression);
        }
        partialTree.operator = key;
        partialTree.right = value;
        found = true;
      }
    }
  };

  /**
   * Helper function used by {@link find} to apply an expression tree to
   * an object to check if this object satisfies the expression tree or not.
   * @method
   * @name _evaluateExpressionTree
   * @memberof! storageUtils
   * @tatic
   * @param {object} expTree The tree representation of an expression.
   * @param {object} itemData The object to evaluate the expression tree
   *                          against.
   * @returns {boolean} true if itemData satisfies expression tree, false
   *                    otherwise.
   */
  function _evaluateExpressionTree(expTree, itemData) {
    var operator = expTree.operator;
    if (_isMultiSelector(operator)) {
      if (expTree.left || !(expTree.array instanceof Array)) {
        throw new Error("invalid expression tree!" + expTree);
      } else {
        var result;
        var subTreeArray = expTree.array;
        for (var subIndex = 0; subIndex < subTreeArray.length; subIndex++) {
          var subResult = _evaluateExpressionTree(subTreeArray[subIndex], itemData);
          if (operator === '$or' && subResult === true) {
            return true;
          } else if (operator === '$and' && subResult === false) {
            return false;
          }
          result = subResult;
        }
        return result;
      }
    } else if (_isSingleSelector(operator)) {
      var value = expTree.right;
      var itemValue;

      if (expTree.left != '*') {
        itemValue = getValue(expTree.left, itemData);
        return _evaluateSingleSelectorExpression(operator, value, itemValue);
      } else {
        var i;
        var itemProperties = Object.keys(itemData);
        for (i = 0; i < itemProperties.length; i++) {
          itemValue = getValue(itemProperties[i], itemData);
          if (_evaluateSingleSelectorExpression(operator, value, itemValue)) {
            return true;
          }
        }
        return false;
      }
    } else {
      throw new Error("not a valid expression!" + expTree);
    }
  };
  
  /**
   * Helper function to evaluate a single selector expression.
   * @method
   * @name _evaluateSingleSelectorExpression
   * @memberof! storageUtils
   * @static
   * @param {string} operator The operator of an expression.
   * @param {object} value The value.
   * @param {object} itemData The object to evaluate the expression tree
   *                          against.
   * @returns {boolean} true if itemData satisfies expression, false
   *                    otherwise.
   */
  function _evaluateSingleSelectorExpression(operator, value, itemValue) {
    if (operator === '$lt') {
      var fixedTokens = _fixNullForString(itemValue, value);
      itemValue = fixedTokens[0];
      value = fixedTokens[1];
      return (itemValue < value);
    } else if (operator === '$gt') {
      var fixedTokens = _fixNullForString(itemValue, value);
      itemValue = fixedTokens[0];
      value = fixedTokens[1];
      return (itemValue > value);
    } else if (operator === '$lte') {
      var fixedTokens = _fixNullForString(itemValue, value);
      itemValue = fixedTokens[0];
      value = fixedTokens[1];
      return (itemValue <= value);
    } else if (operator === '$gte') {
      var fixedTokens = _fixNullForString(itemValue, value);
      itemValue = fixedTokens[0];
      value = fixedTokens[1];
      return (itemValue >= value);
    } else if (operator === '$eq') {
      return (itemValue === value);
    } else if (operator === '$ne') {
      return (itemValue !== value);
    } else if (operator === '$regex') {
      if (itemValue) {
        if (!(typeof itemValue === 'string') && !(itemValue instanceof String)) {
          itemValue = new String(itemValue);
        }
        var matchResult = itemValue.match(value);
        return (matchResult !== null);
      }
      return false;
    } else if (operator === '$exists') {
      if (value) {
        return (itemValue !== null && itemValue !== undefined);
      } else {
        return (itemValue === null || itemValue === undefined);
      }
    } else {
      throw new Error("not a valid expression! " + expTree);
    }
    return false;
  }

  /**
   * Helper function that checks if the token is a multiple selector operator
   * or not.
   * @method
   * @name _isMultiSelector
   * @memberof! storageUtils
   * @static
   * @param {string} token The token to check against.
   * @returns {boolean} true if the token is the supported multiple selector
   *                    operator, false otherwise.
   */
  function _isMultiSelector(token) {
    return (token === '$and' || token === '$or');
  };

  /**
   * Helper function that checks if the token is a single selector operator
   * or not.
   * @method
   * @name _isSingleSelector
   * @memberof! storageUtils
   * @static
   * @param {string} token The token to check against.
   * @returns {boolean} true if the token is the supported single selector
   *                    operator, false otherwise.
   */
  function _isSingleSelector(token) {
    return (token === '$lt' || token === '$gt' || token === '$lte' ||
      token === '$gte' || token === '$eq' || token === '$ne' ||
      token === '$regex' || token === '$exists');
  };

  /**
   * Helper function that checks if the token is a literal or not.
   * @method
   * @name _isLiteral
   * @memberof! storageUtils
   * @static
   * @param {string} token The token to check against.
   * @returns {boolean} true if the token is a literal, false otherwise.
   */
  function _isLiteral(token) {
    return (typeof(token) !== 'object');
  };
  
  /**
   * Helper function that checks if the token is a string
   * @method
   * @name _isSring
   * @memberof! storageUtils
   * @static
   * @param {string} token The token to check against.
   * @returns {boolean} true if the token is a string, false otherwise.
   */
  function _isString(token) {
    return (token != null && (token instanceof String || typeof token === 'string'));
  };
  
  /**
   * Helper function that sets null literals to empty string for string comparison
   * @method
   * @name _fixNullForString
   * @memberof! storageUtils
   * @static
   * @param {string} leftToken left hand token
   * @param {string} rightToken right hand token
   * @returns {Array} Array of left and right hand tokens
   */
  function _fixNullForString(leftToken, rightToken) {
    if (_isString(leftToken) && rightToken == null) {
      rightToken = '';
    } else if (_isString(rightToken) && leftToken == null) {
      leftToken = '';
    }
    return [leftToken, rightToken];
  };

  /**
   * Helper function that retrieves the value of a property from an object.
   * The object can have nested properties, and the property name could be
   * a path to the leaf property.
   * @method
   * @name getValue
   * @memberof! storageUtils
   * @static
   * @param {string} path The chain of the property names from the root to
   *                      the leaf when the object has nested properties.
   * @param {object} itemValue The object to retrieve the property value
   *                           from.
   * @returns {object} the object that contains all the properties defined
   *                   in fieldsExpression array, the corresponding property
   *                   value is obtained from itemData.
   */
  function getValue(path, itemValue) {
    var paths = path.split('.');
    var returnValue = itemValue;
    for (var index = 0; index < paths.length; index++) {
      returnValue = returnValue[paths[index]];
    }
    return returnValue;
  };

  /**
   * Helper function that constructs an object out from value
   * based on fields.
   * @method
   * @name assembleObject
   * @param {object} value The original object to construct the return object
   *                       from.
   * @param {Array} fields An array of property names whose values
   *                       should be included in the final contructed
   *                       return object.
   * @returns {object} the object that contains all the properties defined
   *                   in fields array, the corresponding property
   *                   value is obtained from value.
   */
  function assembleObject (value, fields) {
    var returnObject;
    if (!fields) {
      returnObject = value;
    } else {
      returnObject = {};
      for (var index = 0; index < fields.length; index++) {
        var currentObject = returnObject;
        var currentItemDataValue = value;
        var field = fields[index];
        var paths = field.split('.');
        for (var pathIndex = 0; pathIndex < paths.length; pathIndex++) {
          currentItemDataValue = currentItemDataValue[paths[pathIndex]];
          if (!currentObject[paths[pathIndex]] && pathIndex < paths.length - 1) {
            currentObject[paths[pathIndex]] = {};
          }
          if (pathIndex === paths.length - 1) {
            currentObject[paths[pathIndex]] = currentItemDataValue;
          } else {
            currentObject = currentObject[paths[pathIndex]];
          }
        }
      }
    }
    return returnObject;
  };
  
  return {
    satisfy: satisfy,
    getValue: getValue,
    assembleObject: assembleObject
  };
}();


/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * The interface for oj.Item
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.Item
 * @ojsignature {target: "Type",
 *               value: "interface Item<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 */

/**
 * The metadata for the item
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.Item
 * @instance
 * @name metadata
 * @type {oj.ItemMetadata}
 * @ojsignature {target: "Type",
 *               value: "ItemMetadata<K>"}
 */

/**
 * The data for the item
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.Item
 * @instance
 * @name data
 * @type {Object}
 * @ojsignature {target: "Type",
 *               value: "D"}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for oj.SortCapability
 *
 * @ojstatus preview
 * @export
 * @interface oj.SortCapability
 * @since 4.2.0
 * @ojsignature {target: "Type",
 *               value: "interface SortCapability<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 */

/**
 * Number of attributes that can be sorted at the same time.  Possible values are:
 * <ul>
 * <li>"none": no sorting is supported.</li>
 * <li>"single": only one attribute can be sorted at a time.</li>
 * <li>"multiple": more than one attribute can be sorted at a time.</li>
 * </ul>
 *
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @expose
 * @memberof oj.SortCapability
 * @instance
 * @name attributes
 * @type {"none" | "single" | "multiple"}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

var __DataProvider = {};
__DataProvider.FetchByKeysMixin = oj.FetchByKeysMixin;
__DataProvider.FetchByOffsetMixin = oj.FetchByOffsetMixin;
__DataProvider.FilterFactory = oj.FilterFactory;

  ;return __DataProvider;
});