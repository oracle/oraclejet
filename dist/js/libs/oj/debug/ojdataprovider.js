/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojeventtarget'], function(oj)
{
  "use strict";
  var GenericEvent = oj.GenericEvent;


/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for AttributeExprFilterDef
 *
 *
 * @export
 * @interface AttributeExprFilterDef
 * @since 8.0.0
 * @ojsignature {target: "Type",
 *               value: "interface AttributeExprFilterDef<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 */

/**
 * Property which contains an expression specifies which attribute to filter on.
 *
 * @since 8.0.0
 * @export
 * @expose
 * @memberof AttributeExprFilterDef
 * @instance
 * @name attribute
 * @type {AttributeFilterDef.AttributeExpression | string}
 * @ojtsexample <caption>Attribute filter definition which filters on DepartmentId value 10</caption>
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
 *
 * @since 8.0.0
 * @export
 * @expose
 * @memberof AttributeExprFilterDef
 * @instance
 * @name op
 * @type {AttributeFilterDef.AttributeOperator}
 */

/**
 * Specifies the value to filter for.
 *
 * @since 8.0.0
 * @export
 * @expose
 * @memberof AttributeExprFilterDef
 * @instance
 * @name value
 * @type {any}
 * @ojtsexample
 * <caption>Filter definition which filters on DepartmentId value 10</caption>
 * {op: '$eq', attribute: 'DepartmentId', value: 10}
 */

/**
 * End of jsdoc
 */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for AttributeExprFilter
 *
 *
 * @export
 * @interface AttributeExprFilter
 * @extends AttributeExprFilterDef
 * @extends BaseDataFilter
 * @since 8.0.0
 * @ojsignature {target: "Type",
 *               value: "interface AttributeExprFilter<D> extends AttributeExprFilterDef<D>, BaseDataFilter<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 */

/**
 * End of jsdoc
 */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @export
 * @interface AttributeFilterDef
 * @since 7.0.0
 * @ojsignature {target: "Type",
 *               value: "interface AttributeFilterDef<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines a kind of {@link DataFilter.FilterDef} which applies to the attributes in item data.
 */

/**
 * Operator to apply for the filter.
 * @since 7.0.0
 * @export
 * @expose
 * @memberof AttributeFilterDef
 * @instance
 * @name op
 * @type {AttributeFilterDef.AttributeOperator}
 */

/**
 * Specifies the value to filter for. Value should be an object which specifies attribute/value pairs to filter on. The op will be applied to each attribute/value pair and
 * the whole will be AND'd. For subobjects, please specify them in a nested structure.
 *
 *
 * @since 7.0.0
 * @export
 * @expose
 * @memberof AttributeFilterDef
 * @instance
 * @name value
 * @type {any}
 * @ojtsexample
 * <caption>Filter definition which filters on DepartmentId value 10</caption>
 * {op: '$eq', value: {DepartmentId: 10}}
 * @ojtsexample
 * <caption>Filter definition which filters on DepartmentId value 10 and DepartmentName is Hello</caption>
 * {op: '$eq', value: {DepartmentId: 10, DepartmentName: 'Hello'}}
 * @ojtsexample
 * <caption>Filter definition which filters on subobject Location State is California and DepartmentName is Hello</caption>
 * {op: '$eq', value: {DepartmentName: 'Hello', Location: {State: 'California'}}}
 */

/**
 * AttributeOperator enum
 * <br>
 * <p>The operators are based on the filtering spec of the RFC 7644 SCIM
 * protocol:
 * <br>
 * {@link https://tools.ietf.org/html/rfc7644#section-3.4.2|SCIM Filtering}
 * <br>
 * <p>
 *
 * @export
 * @enum {string}
 * @name AttributeOperator
 * @memberof AttributeFilterDef
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
 * @since 9.0.0
 */

/**
 * AttributeExpression enum
 * <br>
 * <p>
 * Attribute expressions supported
 *
 * @export
 * @enum {string}
 * @name AttributeExpression
 * @memberof AttributeFilterDef
 * @property {string} *=* Attribute wildcard
 * @since 9.0.0
 */

/**
 * End of jsdoc
 */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @export
 * @interface AttributeFilter
 * @extends AttributeFilterDef
 * @extends BaseDataFilter
 * @since 7.0.0
 * @ojsignature {target: "Type",
 *               value: "interface AttributeFilter<D> extends AttributeFilterDef<D>, BaseDataFilter<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines a kind of {@link DataFilter.Filter} which applies to the attributes in item data.
 */

/**
 * End of jsdoc
 */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @export
 * @interface CompoundFilterDef
 * @since 7.0.0
 * @ojsignature {target: "Type",
 *               value: "interface CompoundFilterDef<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines a kind of {@link DataFilter.FilterDef} which applies to the compound filter definitions.
 */

/**
 * Operator to apply for the filter. Valid operators defined in the CompoundFilterOperator union type are the strings:
 * <ul>
 *   <li>$and The filters in the criteria array will be AND'd.</li>
 *   <li>$or The filters in the criteria array will be OR'd.</li>
 * </ul>
 *
 * @since 7.0.0
 * @export
 * @expose
 * @memberof CompoundFilterDef
 * @instance
 * @name op
 * @type {CompoundFilterDef.CompoundOperator}
 */

/**
 * Array of FilterDefs on which to apply the operator
 *
 *
 * @since 7.0.0
 * @export
 * @expose
 * @memberof CompoundFilterDef
 * @instance
 * @name criteria
 * @type {Array.<AttributeFilterDef | AttributeExprFilterDef | CompoundFilterDef>}
 * @ojsignature {target: "Type",
 *               value: "Array<AttributeFilterDef<D> | AttributeExprFilterDef<D> | CompoundFilterDef<D>>"}
 */

/**
 * CompoundOperator enum
 * <br>
 * <p>The operators are based on the filtering spec of the RFC 7644 SCIM
 * protocol:
 * <br>
 * {@link https://tools.ietf.org/html/rfc7644#section-3.4.2|SCIM Filtering}
 * <br>
 * <p>
 *
 * @export
 * @enum {string}
 * @name CompoundOperator
 * @memberof CompoundFilterDef
 * @property {string} $and=$and The filter is only a match if both expressions evaluate to true.
 * @property {string} $or=$or The filter is a match if either expression evaluates to true.
 * @since 5.0.0
 */

/**
 * End of jsdoc
 */


/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @export
 * @interface CompoundFilter
 * @extends CompoundFilterDef
 * @extends BaseDataFilter
 * @since 7.0.0
 * @ojsignature {target: "Type",
 *               value: "interface CompoundFilter<D> extends CompoundFilterDef<D>, BaseDataFilter<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines a kind of {@link DataFilter.Filter} which applies to the compound filters.
 */

/**
 * End of jsdoc
 */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @export
 * @interface TextFilterDef
 * @since 8.0.0
 * @ojsignature {target: "Type",
 *               value: "interface TextFilterDef",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines a kind of {@link DataFilter.FilterDef} which applies to text filter definitions. A text filter definition
 * specifies a string which should be used for filtering and leaves it up to the DataProvider to decide which fields are filtered
 * and how the filtering happens (such as whether the filtering is an exact match or contains, etc).
 */

/**
 * Specifies the text to filter for. It is up to the DataProvider implementation to decide which attributes to
 * apply the filter to and also the exact filtering logic used, such as case insensitivity, etc. In addition, for
 * attributes which contain non-string values, the type coercion rule expected is to call toString() on that value.
 * If the value is an object which does not have a string representation then the value does not satisfy the filter.
 * @since 8.0.0
 * @export
 * @expose
 * @memberof TextFilterDef
 * @instance
 * @name text
 * @type {string}
 * @ojtsexample
 * <caption>Filter definition which filters on the text 'abc search'</caption>
 * {text: 'abc search'}
 */

/**
 * End of jsdoc
 */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @export
 * @interface TextFilter
 * @extends TextFilterDef
 * @extends BaseDataFilter
 * @since 8.0.0
 * @ojsignature {target: "Type",
 *               value: "interface TextFilter<D> extends TextFilterDef, BaseDataFilter<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines a kind of {@link DataFilter.Filter} which applies to text filters. A text filter
 * specifies a string which should be used for filtering and leaves it up to the DataProvider to decide which fields are filtered
 * and how the filtering happens (such as whether the filtering is an exact match or contains, etc).
 */

/**
 * End of jsdoc
 */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for Filter
 *
 *
 * @export
 * @interface BaseDataFilter
 * @since 8.0.0
 * @ojsignature {target: "Type",
 *              value: "interface BaseDataFilter<D>",
 *              genericParameters: [{"name": "D", "description": "Type of Data"}]}
 */

/**
 * Specifies a filter function which has the same signature as the the callback
 * which is specified for the JS Array.filter():
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 * This function will be optionally used by the DataProvider to do local filtering.
 * This function is required by the DataProvider so that it is possible for DataProvider
 * implementations to at least do local filtering.
 *
 *
 * @since 8.0.0
 * @export
 * @expose
 * @memberof BaseDataFilter
 * @instance
 * @name filter
 * @method
 * @param {any} item The current element being processed in the array.
 * @param {number=} index The index of the current element being processed in the array.
 * @param {Array=} array The array filter was called upon.
 * @return {boolean} True if the element satisfies the filter.
 * @ojsignature {target: "Type",
 *               value: "(item: D, index?: number, array?: Array<D>): boolean;"}
 */

/**
 * @export
 * @namespace DataFilter
 * @since 8.0.0
 * @ojsignature {target: "Type",
 *              value: "namespace DataFilter"}
 * @classdesc Contains definitions for {@link DataFilter.Filter} used in {@link FetchListParameters#filterCriterion} and {@link FetchByOffsetParameters#filterCriterion}
 */

/**
 * @typedef {Object} DataFilter.FilterDef Union type of all FilterDef types.
 * @ojsignature [{target: "Type",
 *               value: "AttributeFilterDef<D> | AttributeExprFilterDef<D> | CompoundFilterDef<D> | TextFilterDef"},
 *               {target:"Type", value:"<D>", for:"genericTypeParameters"}]
 * @classdesc Union type containing {@link AttributeFilterDef}, {@link AttributeExprFilterDef}, {@link CompoundFilterDef}, and {@link TextFilterDef}
 */

/**
 * @typedef {Object} DataFilter.Filter Union type of all Filter types.
 * @ojsignature [{target: "Type",
 *               value: "AttributeFilter<D> | AttributeExprFilter<D> | CompoundFilter<D> | TextFilter<D>"},
 *               {target:"Type", value:"<D>", for:"genericTypeParameters"}]
 * @classdesc Union type containing {@link AttributeFilter}, {@link AttributeExprFilter}, {@link CompoundFilter}, and {@link TextFilter}
 */

/**
 * End of jsdoc
 */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @export
 * @expose
 * @interface AttributeFilterCapability
 * @since 6.1.0
 * @ojsignature {target: "Type",
 *               value: "interface AttributeFilterCapability"}
 * @classdesc Defines the properties in the attribute property used in {@link FetchCapability}
 */

/**
 * Optionally indicates what attribute expansion (as in the addition of more attributes) capability the DataProvider has.
 * The exact shape of this property are determined by the DataProvider.
 *
 * @since 6.1.0
 * @export
 * @expose
 * @memberof AttributeFilterCapability
 * @instance
 * @name expansion
 * @type {object=}
 * @ojsignature {target: "Type",
 *               value: "?object"}
 */

/**
 * Optionally indicates what capability the DataProvider has in terms of attribute ordering. By default there is no inherent
 * attribute ordering on the item data property bag. The exact shape of this property are determined by the DataProvider.
 *
 *
 * @since 6.1.0
 * @export
 * @expose
 * @memberof AttributeFilterCapability
 * @instance
 * @name ordering
 * @type {object=}
 * @ojsignature {target: "Type",
 *               value: "?object"}
 */

/**
 * Optionally indicates what capability the DataProvider has in terms of being able to specify the item data shape.
 * The exact shape of this property are determined by the DataProvider.
 *
 *
 * @since 6.1.0
 * @export
 * @expose
 * @memberof AttributeFilterCapability
 * @instance
 * @name defaultShape
 * @type {object=}
 * @ojsignature {target: "Type",
 *               value: "?object"}
 */

/**
 * End of jsdoc
 */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @export
 * @interface FetchCapability
 * @since 6.1.0
 * @ojsignature {target: "Type",
 *               value: "interface FetchCapability"}
 * @classdesc Defines the result from the DataProvider method {@link DataProvider#getCapability} for capability "fetchCapability"
 */

/**
 * Optional detailed attribute filter capability information
 *
 *
 * @since 6.1.0
 * @export
 * @expose
 * @memberof FetchCapability
 * @instance
 * @name attributeFilter
 * @type {AttributeFilterCapability=}
 * @ojsignature {target: "Type",
 *               value: "?AttributeFilterCapability"}
 */

/**
 * Optional detailed caching capability information
 *
 *
 * @since 9.1.0
 * @export
 * @expose
 * @memberof FetchCapability
 * @instance
 * @name caching
 * @type {string}
 * @ojsignature {target: "Type",
 *               value: "? 'all' | 'none' | 'visitedByCurrentIterator'"}
 */

/**
 * End of jsdoc
 */


/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @export
 * @interface FilterCapability
 * @since 5.0.0
 * @ojsignature {target: "Type",
 *               value: "interface FilterCapability"}
 * @classdesc Defines the result from the DataProvider method {@link DataProvider#getCapability} for capability "filter"
 */

/**
 * An array of supported filter operator strings. The filter operators may be for {@link AttributeFilter} or {@link CompoundFilter}.
 *
 *
 * @since 5.0.0
 * @export
 * @expose
 * @memberof FilterCapability
 * @instance
 * @name operators
 * @type {Array.<AttributeFilterDef.AttributeOperator | CompoundFilterDef.CompoundOperator>=}
 * @ojsignature {target: "Type",
 *               value: "?Array.<AttributeFilterDef.AttributeOperator | CompoundFilterDef.CompoundOperator>"}
 */

/**
 * An array of supported attribute expressions.
 *
 *
 * @since 5.0.0
 * @export
 * @expose
 * @memberof FilterCapability
 * @instance
 * @name attributeExpression
 * @type {Array.<AttributeFilterDef.AttributeExpression>=}
 * @ojsignature {target: "Type",
 *               value: "?Array.<AttributeFilterDef.AttributeExpression>"}
 */

/**
 * Existence of this property indicates that {@link TextFilter} is supported. The property value can be used convey more information to the caller.
 *
 *
 * @since 8.0.0
 * @export
 * @expose
 * @memberof FilterCapability
 * @instance
 * @name textFilter
 * @type {any=}
 * @ojsignature {target: "Type",
 *               value: "?any"}
 */

/**
 * End of jsdoc
 */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @since 4.1.0
 * @export
 * @interface FetchByKeysParameters
 * @ojsignature {target: "Type",
 *               value: "interface FetchByKeysParameters<K>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}]}
 * @classdesc Defines the parameters to the DataProvider methods {@link DataProvider#fetchByKeys} and {@link DataProvider#containsKeys}
 */

/**
 * Keys for rows to fetch
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof FetchByKeysParameters
 * @instance
 * @name keys
 * @type {Set.<any>}
 * @ojsignature {target: "Type",
 *               value: "Set<K>"}
 */

/**
 * Optional string describing local or global data set to fetch. Local refers to the current fetched data whereas global is the entire data set.
 * The usage is primarily directed towards selection where a selection is on a different part of the data set than that of the local data set.
 *
 *
 * @since 7.0.0
 * @export
 * @expose
 * @memberof FetchByKeysParameters
 * @instance
 * @name scope
 * @type {FetchByKeysParameters.Scope=}
 * @ojsignature {target: "Type",
 *               value: "?FetchByKeysParameters.Scope"}
 * @ojsignature {target: "Type",
 *               value: "?'local' | 'global'"}
 */

/**
 * attributes to include in the result. If specified, then at least these set of attributes will be included in each row
 * results. If not specified then the default attributes will be included.
 *
 *
 * @since 6.1.0
 * @export
 * @expose
 * @memberof FetchByKeysParameters
 * @instance
 * @name attributes
 * @type {Array.<string | FetchAttribute>}
 * @ojsignature {target: "Type",
 *               value: "?Array<string | FetchAttribute>"}
 */

/**
 * Scope enum
 * <br>
 * <p>
 * Scope supported
 *
 * @export
 * @enum {string}
 * @name Scope
 * @memberof FetchByKeysParameters
 * @property {string} local=local Local refers to the current fetched data.
 * @property {string} global=global Global is the entire data set
 * @since 9.0.0
 */

/**
 * @since 4.1.0
 * @export
 * @interface FetchByKeysResults
 * @ojsignature {target: "Type",
 *               value: "interface FetchByKeysResults<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 * @classdesc FetchByKeysResults defines the result from the DataProvider method {@link DataProvider#fetchByKeys}
 */

/**
 * The parameters used for the fetch call.
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof FetchByKeysResults
 * @instance
 * @name fetchParameters
 * @type {FetchByKeysParameters}
 * @ojsignature {target: "Type",
 *               value: "FetchByKeysParameters<K>"}
 */

/**
 * Map of keys and corresponding {@link Item}. The map will only contain keys which were actually found.
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof FetchByKeysResults
 * @instance
 * @name results
 * @type {Map.<*, Item>}
 * @ojsignature {target: "Type",
 *               value: "Map<K, Item<K, D>>"}
 */

/**
 * @since 4.1.0
 * @export
 * @interface ContainsKeysResults
 * @ojsignature {target: "Type",
 *               value: "interface ContainsKeysResults<K>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}]}
 * @classdesc ContainsKeysResults defines the results from the DataProvider method {@link DataProvider#containsKeys}
 */

/**
 * The parameters used for the containsKeys call.
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof ContainsKeysResults
 * @instance
 * @name containsParameters
 * @type {FetchByKeysParameters}
 * @ojsignature {target: "Type",
 *               value: "FetchByKeysParameters<K>"}
 */

/**
 * Requested keys subset which are contained in the DataProvider.
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof ContainsKeysResults
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
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @since 4.1.0
 * @export
 * @interface SortCriterion
 * @ojsignature {target: "Type",
 *               value: "interface SortCriterion<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines the sort criterion objects in {@link FetchListParameters#sortCriterion}
 */

/**
 * sort attribute upon which the data should be sorted.
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof SortCriterion
 * @instance
 * @name attribute
 * @type {string}
 * @ojsignature {target: "Type",
 *               value: "keyof D"}
 */

/**
 * sort direction, either "ascending" or "descending".
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof SortCriterion
 * @instance
 * @name direction
 * @type {string}
 */

/**
 * End of jsdoc
 */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 *
 * @since 4.1.0
 * @export
 * @interface DataMapping
 * @ojsignature {target: "Type",
 *               value: "interface DataMapping <K, D, Kin, Din>",
 *               genericParameters: [{"name": "K", "description": "Type of output key"}, {"name": "D", "description": "Type of output data"},
 *                    {"name": "Kin", "description": "Type of input key"}, {"name": "Din", "description": "Type of input data"}]}
 */

/**
 * Field mapping function which takes an item and returns the mapped item
 *
 *
 * @export
 * @expose
 * @memberof DataMapping
 * @instance
 * @name mapFields
 * @type {Function}
 * @ojsignature {target: "Type",
 *               value: "(item: Item<Kin, Din>) => Item<K, D>"}
 */

/**
 * Optional FilterCriterion mapping function which takes filterOperator and returns the mapped filterOperator
 *
 *
 * @export
 * @expose
 * @memberof DataMapping
 * @instance
 * @name mapFilterCriterion
 * @type {Function}
 * @ojsignature {target: "Type",
 *               value: "?(filterCriterion: DataFilter.Filter<D>) => DataFilter.Filter<Din>"}
 */

/**
 * Optional FilterCriterion unmapping function which takes a mapped filterOperator and returns the unmapped filterOperator
 *
 *
 * @export
 * @expose
 * @memberof DataMapping
 * @instance
 * @name unmapFilterCriterion
 * @type {Function}
 * @ojsignature {target: "Type",
 *               value: "?(filterCriterion: DataFilter.Filter<Din>) => DataFilter.Filter<D>"}
 */

/**
 * Optional SortCriterion mapping function which takes sortCriteria and returns the mapped sortCriteria
 *
 *
 * @export
 * @expose
 * @memberof DataMapping
 * @instance
 * @name mapSortCriteria
 * @type {Function}
 * @ojsignature {target: "Type",
 *               value: "?(sortCriteria: Array<SortCriterion<D>>) => Array<SortCriterion<Din>>"}
 */

/**
 * Optional SortCriterion unmapping function which takes mapped sortCriteria and returns the unmapped sortCriteria
 *
 *
 * @export
 * @expose
 * @memberof DataMapping
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
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @since 4.1.0
 * @export
 * @ojsignature {target: "Type",
 *               value: "interface FetchFunc<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines the interface for the {@link DataProvider#fetchFirst} method
 */

/**
 * @ojsignature {target: "Type",
 *               value: "(FetchListParameters?): AsyncIterable<FetchListResult<K, D>>"}
 */

 /**
  * end of jsdoc
  */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @since 4.1.0
 * @export
 * @interface FetchListParameters
 * @ojsignature {target: "Type",
 *               value: "interface FetchListParameters<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines the parameters to the DataProvider method {@link DataProvider#fetchFirst}
 */

/**
 * Optional number of rows to fetch.  If fewer than that number of rows exist, the fetch will succeed but be truncated.
 * A value of -1 will return all rows or the maximum size supported by the DataProvider.
 * If the size is not specified, then the DataProvider implementation will determine how many rows to return.
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof FetchListParameters
 * @instance
 * @name size
 * @type {number=}
 * @ojsignature {target: "Type",
 *               value: "?number"}
 */

/**
 * Optional sort criteria to apply.
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof FetchListParameters
 * @instance
 * @name sortCriteria
 * @type {Array.<SortCriterion>}
 * @ojsignature {target: "Type",
 *               value: "?Array<SortCriterion<D>>"}
 * @ojtsexample
 * [{attribute: 'DepartmentName', direction: 'ascending'}]
 */

/**
 * Optional filter criterion to apply. The filter criterion would be composed of a
 * supported {@link DataFilter.Filter} such as a {@link AttributeFilter}, {@link AttributeExprFilter}, {@link CompoundFilter}. {@link TextFilter}
 *
 * @ojtsexample
 * let filterDef = {op: '$or', criteria: [{op: '$eq', value: {name: 'Bob'}}, {op: '$gt', value: {level: 'Low'}}]};
 * let filter = FilterFactory.getFilter(filterDef); // create a standard filter using the filterFactory.
 * let fetchListParam = {filterCriterion: filter, size: 5};
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof FetchListParameters
 * @instance
 * @name filterCriterion
 * @type {DataFilter.Filter}
 * @ojsignature {target: "Type",
 *               value: "?DataFilter.Filter<D>"}
 */

/**
 * Optional attributes to include in the result. If specified, then at least these set of attributes must be included in each row
 * in the data array in the FetchListResult. If not specified then the default attributes must be included.
 *
 *
 * @since 6.1.0
 * @export
 * @expose
 * @memberof FetchListParameters
 * @instance
 * @name attributes
 * @type {Array.<string | FetchAttribute>}
 * @ojsignature {target: "Type",
 *               value: "?Array<string | FetchAttribute>"}
 * @ojtsexample
 * ['!lastName', '@default'] // all attributes except lastName
 * @ojtsexample
 * ['!lastName', '@default', {name: 'location', attributes: ['address line 1', 'address line 2']}] // nested example
 *
 */

/**
 * Optional symbol that can uniquely identify the consumer of the DataProvider.
 *
 * Each consumer can call Symbol() to obtain a unique symbol, which can be
 * stored and reused on each subsequent call to fetchFirst. Note that Symbol()
 * returns a different unique symbol every time, so it should not be called
 * every time the consumer calls fetchFirst.
 *
 * There should only be one active iterator per clientId. All previous iterators
 * obtained with the same clientId should be considered invalid. This is used to
 * optimize resource usage in some DataProvider implementations.
 *
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof oj.FetchListParameters
 * @instance
 * @name clientId
 * @type {symbol}
 * @ojsignature {target: "Type",
 *               value: "?symbol"}
 */

/**
 * End of jsdoc
 */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @since 4.1.0
 * @export
 * @interface FetchListResult
 * @ojsignature {target: "Type",
 *               value: "interface FetchListResult<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines the results from the DataProvider method {@link DataProvider#fetchFirst}.
 */

/**
 * The {@link FetchListParameters} used for the fetch call.
 * In addition, the property fetchParameters is not only the parameter passed through from fetchFirst.
 * The sortCriteria of fetchParameters is the sort criteria specified in fetchFirst parameter, it also include the implicitSort criteria specified in data provider constructor.
 * For example, if implicitSort is set in ArrayDataProvider constructor, it will be returned as part of the sortCriteria of fetchParameters.
 * The collection components, such as ojTable, will look at the sortCriteria to put appropriate sort icon on the UI rendered.
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof FetchListResult
 * @instance
 * @name fetchParameters
 * @type {FetchListParameters}
 * @ojsignature {target: "Type",
 *               value: "FetchListParameters<D>"}
 * @ojtsexample <caption>Example of retrieving sortCriteria from FetchListResult:</caption>
 * let asyncIterator = dataprovider.fetchFirst(options)[Symbol.asyncIterator]();
 * let result = await asyncIterator.next();
 * let sortCriteria = result.value.fetchParameters.sortCriteria;
 */

/**
 * Array of data for each row
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof FetchListResult
 * @instance
 * @name data
 * @type {Array.<Object>}
 * @ojsignature {target: "Type",
 *               value: "D[]"}
 */

/**
 * Array of {link@ ItemMetadata} for each row
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof FetchListResult
 * @instance
 * @name metadata
 * @type {Array.<ItemMetadata>}
 * @ojsignature {target: "Type",
 *               value: "Array<ItemMetadata<K>>"}
 */

 /**
  * end of jsdoc
  */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @since 4.1.0
 * @export
 * @interface ItemMetadata
 * @ojsignature {target: "Type",
 *               value: "interface ItemMetadata<K>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}]}
 * @classdesc Defines the item metadata objects in {@link FetchListResult#metadata}.  Note that key is the only mandatory property,
 * implementations can provide additional properties as needed.
 */

/**
 * The key for the row
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof ItemMetadata
 * @instance
 * @name key
 * @type {any}
 * @ojsignature {target: "Type",
 *               value: "K"}
 */

/**
 * An optional message such as error associated with the row
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof ItemMetadata
 * @instance
 * @name message
 * @type {ItemMessage=}
 * @ojsignature {target: "Type",
 *               value: "?ItemMessage"}
 */

/**
 * End of jsdoc
 */












var AttributeFilterOperator;
(function (AttributeFilterOperator) {
    let AttributeOperator;
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
})(AttributeFilterOperator || (AttributeFilterOperator = {}));
oj['AttributeFilterOperator'] = AttributeFilterOperator;
oj['AttributeFilterOperator']['AttributeOperator'] = AttributeFilterOperator.AttributeOperator;



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for AttributeFilterOperator
 *
 *
 * @export
 * @interface AttributeFilterOperator
 * @extends FilterOperator
 * @since 5.0.0
 * @ojsignature {target: "Type",
 *               value: "interface AttributeFilterOperator<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @ojdeprecated {since: '7.0.0', description: 'Use AttributeFilter instead.'}
 */

/**
 * Operator one of enum AttributeOperator {$co, $eq, $ew, $pr, $gt, $ge, $lt, $le, $ne, $regex, $sw}
 *
 *
 * @since 5.0.0
 * @export
 * @expose
 * @memberof AttributeFilterOperator
 * @instance
 * @name op
 * @type {AttributeFilterOperator.AttributeOperator}
 */

/**
 * Attribute
 *
 *
 * @since 5.0.0
 * @export
 * @expose
 * @memberof AttributeFilterOperator
 * @instance
 * @name attribute
 * @type {string}
 */

/**
 * Value
 *
 *
 * @since 5.0.0
 * @export
 * @expose
 * @memberof AttributeFilterOperator
 * @instance
 * @name value
 * @type {any}
 */

/**
 * AttributeOperator enum
 * <br>
 * <p>The operators are based on the filtering spec of the RFC 7644 SCIM
 * protocol:
 * <br>
 * {@link https://tools.ietf.org/html/rfc7644#section-3.4.2|SCIM Filtering}
 * <br>
 * <p>
 *
 * @export
 * @enum {string}
 * @name AttributeOperator
 * @memberof AttributeFilterOperator
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








var CompoundFilterOperator;
(function (CompoundFilterOperator) {
    let CompoundOperator;
    (function (CompoundOperator) {
        CompoundOperator["$and"] = "$and";
        CompoundOperator["$or"] = "$or";
    })(CompoundOperator = CompoundFilterOperator.CompoundOperator || (CompoundFilterOperator.CompoundOperator = {}));
})(CompoundFilterOperator || (CompoundFilterOperator = {}));
oj['CompoundFilterOperator'] = CompoundFilterOperator;
oj['CompoundFilterOperator']['CompoundOperator'] = CompoundFilterOperator.CompoundOperator;



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for CompoundFilterOperator
 *
 *
 * @export
 * @interface CompoundFilterOperator
 * @extends FilterOperator
 * @since 5.0.0
 * @ojsignature {target: "Type",
 *               value: "interface CompoundFilterOperator<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @ojdeprecated {since: '7.0.0', description: 'Use CompoundFilter instead.'}
 */

/**
 * Operator one of enum CompoundOperator {$and, $or}
 *
 *
 * @since 5.0.0
 * @export
 * @expose
 * @memberof CompoundFilterOperator
 * @instance
 * @name op
 * @type {CompoundFilterOperator.CompoundOperator}
 */

/**
 * Array of FilterOperators on which to apply the operator
 *
 *
 * @since 5.0.0
 * @export
 * @expose
 * @memberof CompoundFilterOperator
 * @instance
 * @name criteria
 * @type {Array.<FilterOperator>}
 * @ojsignature {target: "Type",
 *               value: "Array<FilterOperator<D>>"}
 */

/**
 * CompoundOperator enum
 * <br>
 * <p>The operators are based on the filtering spec of the RFC 7644 SCIM
 * protocol:
 * <br>
 * {@link https://tools.ietf.org/html/rfc7644#section-3.4.2|SCIM Filtering}
 * <br>
 * <p>
 *
 * @export
 * @enum {string}
 * @name CompoundOperator
 * @memberof CompoundFilterOperator
 * @property {string} $and=$and The filter is only a match if both expressions evaluate to true.
 * @property {string} $or=$or The filter is a match if either expression evaluates to true.
 * @since 5.0.0
 */

/**
 * End of jsdoc
 */


class DataCache {
    constructor() {
        this._handleMutationAdd = function (eventDetail) {
            var _a, _b;
            let self = this;
            let eventDetailBeforeKeys = eventDetail[DataCache._BEFOREKEYS];
            let eventDetailKeys = eventDetail[DataCache._KEYS];
            let eventDetailKeysArray = [];
            eventDetailKeys.forEach(function (key) {
                eventDetailKeysArray.push(key);
            });
            let eventDetailData = eventDetail[DataCache._DATA];
            let eventDetailMetadata = eventDetail[DataCache._METADATA];
            let eventDetailIndexes = eventDetail[DataCache._INDEXES];
            if (eventDetailKeysArray && eventDetailKeysArray.length > 0) {
                if (eventDetailIndexes) {
                    eventDetailKeysArray.forEach(function (key, index) {
                        self._items.splice(eventDetailIndexes[index], 0, new self.Item(eventDetailMetadata[index], eventDetailData[index]));
                    });
                }
                else if (eventDetailBeforeKeys) {
                    let eventDetailBeforeKeysClone = Object.assign([], eventDetailBeforeKeys);
                    let eventDetailKeysClone = Object.assign(new Set(), eventDetail[DataCache._KEYS]);
                    let eventDetailDataClone = Object.assign([], eventDetail[DataCache._DATA]);
                    let eventDetailMetadataClone = Object.assign([], eventDetail[DataCache._METADATA]);
                    // first find all the beforekeys which are not in our cache, are not null, and are not in the mutation event
                    let outOfRangeKeys = [];
                    let i, j, key, findKey, outOfRange;
                    for (i = 0; i < eventDetailBeforeKeys.length; i++) {
                        key = eventDetailBeforeKeys[i];
                        outOfRange = true;
                        if (key != null) {
                            for (j = 0; j < eventDetailKeysArray.length; j++) {
                                if (oj.Object.compareValues(eventDetailKeysArray[j], key)) {
                                    outOfRange = false;
                                    break;
                                }
                            }
                            if (outOfRange) {
                                for (j = 0; j < self._items.length; j++) {
                                    if (oj.Object.compareValues((_b = (_a = self._items[j]) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.key, key)) {
                                        outOfRange = false;
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            outOfRange = false;
                        }
                        if (outOfRange) {
                            outOfRangeKeys.push(key);
                        }
                    }
                    // push all keys chained to the outOfRangeKeys to the array
                    let keysToCheck = eventDetailBeforeKeys.length;
                    while (keysToCheck > 0) {
                        for (i = 0; i < eventDetailBeforeKeys.length; i++) {
                            findKey = eventDetailBeforeKeys[i];
                            if (outOfRangeKeys.indexOf(findKey) >= 0) {
                                outOfRangeKeys.push(findKey);
                                break;
                            }
                        }
                        keysToCheck--;
                    }
                    // remove all out of range keys and their chained keys
                    for (i = eventDetailBeforeKeysClone.length - 1; i >= 0; i--) {
                        if (outOfRangeKeys.indexOf(eventDetailBeforeKeysClone[i]) >= 0) {
                            delete eventDetailBeforeKeysClone[i];
                            eventDetailKeysClone.delete(eventDetailBeforeKeysClone[i]);
                            delete eventDetailDataClone[i];
                            delete eventDetailMetadataClone[i];
                        }
                    }
                    // insert them into our cache
                    eventDetailBeforeKeysClone.forEach(function (beforeKey, beforeKeyIndex) {
                        var _a, _b;
                        if (beforeKey === null) {
                            self._items.push(new self.Item(eventDetailMetadata[beforeKeyIndex], eventDetailData[beforeKeyIndex]));
                        }
                        else {
                            for (i = 0; i < self._items.length; i++) {
                                if (oj.Object.compareValues((_b = (_a = self._items[i]) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.key, beforeKey)) {
                                    self._items.splice(i, 0, new self.Item(eventDetailMetadata[beforeKeyIndex], eventDetailData[beforeKeyIndex]));
                                    break;
                                }
                            }
                        }
                    });
                }
                else {
                    // we don't have index or beforeKeys so we need to sort to figure out where to insert the keys.
                    // if there is no sort, then we don't know where the rows go so just push them in at the end.
                    if (self._fetchParams && self._fetchParams.sortCriteria != null) {
                        let sortCriteria = self._fetchParams.sortCriteria;
                        if (sortCriteria) {
                            let comparator = self._getSortComparator(sortCriteria);
                            let i, currentData, currentCompare;
                            let insertedIndexes = [];
                            eventDetailData.forEach(function (data, index) {
                                for (i = 0; i < self._items.length; i++) {
                                    currentData = self._items[i].data;
                                    currentCompare = comparator(data, currentData);
                                    if (currentCompare < 0) {
                                        // found insertion point
                                        self._items.splice(i, 0, new self.Item(eventDetailMetadata[index], eventDetailData[index]));
                                        insertedIndexes.push(index);
                                        break;
                                    }
                                }
                            });
                            // inserted all the rows we haven't inserted yet at the end
                            eventDetailData.forEach(function (data, index) {
                                if (insertedIndexes.indexOf(index) < 0) {
                                    self._items.push(new self.Item(eventDetailMetadata[index], eventDetailData[index]));
                                }
                            });
                        }
                    }
                    else {
                        eventDetailData.forEach(function (data, index) {
                            self._items.push(new self.Item(eventDetailMetadata[index], eventDetailData[index]));
                        });
                    }
                }
            }
        };
        this._handleMutationRemove = function (eventDetail) {
            let self = this;
            let eventDetailKeys = eventDetail[DataCache._KEYS];
            if (eventDetailKeys && eventDetailKeys.size > 0) {
                let i;
                eventDetailKeys.forEach(function (key) {
                    for (i = self._items.length - 1; i >= 0; i--) {
                        if (oj.Object.compareValues(self._items[i].metadata.key, key)) {
                            self._items.splice(i, 1);
                            break;
                        }
                    }
                });
            }
        };
        this._handleMutationUpdate = function (eventDetail) {
            let self = this;
            let eventDetailKeys = eventDetail[DataCache._KEYS];
            let eventDetailData = eventDetail[DataCache._DATA];
            let eventDetailMetadata = eventDetail[DataCache._METADATA];
            if (eventDetailData && eventDetailData.length > 0) {
                let i, index = 0;
                eventDetailKeys.forEach(function (key) {
                    for (i = self._items.length - 1; i >= 0; i--) {
                        if (oj.Object.compareValues(self._items[i].metadata.key, key)) {
                            self._items.splice(i, 1, new self.Item(eventDetailMetadata[index], eventDetailData[index]));
                            break;
                        }
                    }
                    index++;
                });
            }
        };
        this.Item = class {
            constructor(metadata, data) {
                this.metadata = metadata;
                this.data = data;
                this[DataCache._METADATA] = metadata;
                this[DataCache._DATA] = data;
            }
        };
        this.FetchByKeysResults = class {
            constructor(fetchParameters, results) {
                this.fetchParameters = fetchParameters;
                this.results = results;
                this[DataCache._FETCHPARAMETERS] = fetchParameters;
                this[DataCache._RESULTS] = results;
            }
        };
        this.FetchByOffsetResults = class {
            constructor(fetchParameters, results, done) {
                this.fetchParameters = fetchParameters;
                this.results = results;
                this.done = done;
                this[DataCache._FETCHPARAMETERS] = fetchParameters;
                this[DataCache._RESULTS] = results;
                this[DataCache._DONE] = done;
            }
        };
        this._items = [];
    }
    addListResult(result) {
        let self = this;
        let items = [];
        result.value.data.forEach(function (data, index) {
            items.push(new self.Item(result.value.metadata[index], data));
        });
        this._items = this._items.concat(items);
        this._done = result.done;
    }
    getDataList(params, offset) {
        this._fetchParams = params;
        let fetchSize = 25;
        if (params.size != null) {
            if (params.size == -1) {
                fetchSize = this.getSize();
            }
            else {
                fetchSize = params.size;
            }
        }
        let items = this._items.slice(offset, offset + fetchSize);
        let data = [];
        let metadata = [];
        items.forEach(function (item) {
            data.push(item.data);
            metadata.push(item.metadata);
        });
        return { fetchParameters: params, data: data, metadata: metadata };
    }
    getDataByKeys(params) {
        let self = this;
        let results = new Map();
        if (params && params.keys) {
            let i;
            params.keys.forEach(function (key) {
                for (i = 0; i < self._items.length; i++) {
                    if (self._items[i].metadata.key == key) {
                        results.set(key, self._items[i]);
                        break;
                    }
                }
            });
        }
        return new this.FetchByKeysResults(params, results);
    }
    getDataByOffset(params) {
        let self = this;
        let results = [];
        let done = true;
        if (params) {
            results = self._items.slice(params.offset, params.offset + params.size);
        }
        return new this.FetchByOffsetResults(params, results, done);
    }
    processMutations(detail) {
        if (detail.remove != null) {
            this._handleMutationRemove(detail.remove);
        }
        if (detail.add != null) {
            this._handleMutationAdd(detail.add);
        }
        if (detail.update != null) {
            this._handleMutationUpdate(detail.update);
        }
    }
    reset() {
        this._items = [];
        this._done = false;
    }
    getSize() {
        return this._items.length;
    }
    isDone() {
        return this._done;
    }
    _getSortComparator(sortCriteria) {
        let self = this;
        return function (x, y) {
            let i, direction, attribute, comparator, xval, yval;
            for (i = 0; i < sortCriteria.length; i++) {
                direction = sortCriteria[i][DataCache._DIRECTION];
                attribute = sortCriteria[i][DataCache._ATTRIBUTE];
                comparator = null;
                xval = self._getVal(x, attribute);
                yval = self._getVal(y, attribute);
                let compareResult = 0;
                let strX = typeof xval === 'string' ? xval : new String(xval).toString();
                let strY = typeof yval === 'string' ? yval : new String(yval).toString();
                if (direction == 'ascending') {
                    compareResult = strX.localeCompare(strY, undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    });
                }
                else {
                    compareResult = strY.localeCompare(strX, undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    });
                }
                if (compareResult != 0) {
                    return compareResult;
                }
            }
            return 0;
        };
    }
    _getVal(val, attr) {
        if (typeof attr == 'string') {
            let dotIndex = attr.indexOf('.');
            if (dotIndex > 0) {
                let startAttr = attr.substring(0, dotIndex);
                let endAttr = attr.substring(dotIndex + 1);
                let subObj = val[startAttr];
                if (subObj) {
                    return this._getVal(subObj, endAttr);
                }
            }
        }
        if (typeof val[attr] == 'function') {
            return val[attr]();
        }
        return val[attr];
    }
}
DataCache._DATA = 'data';
DataCache._METADATA = 'metadata';
DataCache._ITEMS = 'items';
DataCache._BEFOREKEYS = 'addBeforeKeys';
DataCache._KEYS = 'keys';
DataCache._INDEXES = 'indexes';
DataCache._FROM = 'from';
DataCache._OFFSET = 'offset';
DataCache._REFRESH = 'refresh';
DataCache._MUTATE = 'mutate';
DataCache._SIZE = 'size';
DataCache._FETCHPARAMETERS = 'fetchParameters';
DataCache._SORTCRITERIA = 'sortCriteria';
DataCache._DIRECTION = 'direction';
DataCache._ATTRIBUTE = 'attribute';
DataCache._VALUE = 'value';
DataCache._DONE = 'done';
DataCache._RESULTS = 'results';
DataCache._CONTAINSPARAMETERS = 'containsParameters';
DataCache._DEFAULT_SIZE = 25;
DataCache._CONTAINSKEYS = 'containsKeys';
DataCache._FETCHBYKEYS = 'fetchByKeys';
DataCache._FETCHBYOFFSET = 'fetchByOffset';
DataCache._FETCHFIRST = 'fetchFirst';
DataCache._FETCHATTRIBUTES = 'attributes';
oj['DataCache'] = DataCache;







/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 *
 * @since 4.2.0
 * @export
 * @interface DataProviderAddOperationEventDetail
 * @extends DataProviderOperationEventDetail
 * @ojsignature {target: "Type",
 *               value: "interface DataProviderAddOperationEventDetail<K, D> extends DataProviderOperationEventDetail<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 */

/**
 * Optional set of keys for items located after the items involved in the operation. They are relative to after the
 * operation was completed and not the original array. If null and index not specified then insert at the end.
 *
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderAddOperationEventDetail
 * @instance
 * @name afterKeys
 * @type {Set.<any>}
 * @ojdeprecated {since: '6.0.0', description: 'Use addBeforeKeys instead.  addBeforeKeys is an Array instead of a Set.'}
 * @ojsignature {target: "Type",
 *               value: "?Set<K>"}
 */

/**
 * Optional array of keys for items located after the items involved in the operation. They are relative to after the
 * operation was completed and not the original array.If null and index not specified then insert at the end.
 *
 *
 * @since 6.0.0
 * @export
 * @expose
 * @memberof DataProviderAddOperationEventDetail
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
 *
 * @since 6.0.0
 * @export
 * @expose
 * @memberof DataProviderAddOperationEventDetail
 * @instance
 * @name parentKeys
 * @type {Array.<any>}
 * @ojsignature {target: "Type",
 *               value: "?K[]"}
 */

/**
 * End of jsdoc
 */


class DataProviderMutationEvent extends GenericEvent {
    constructor(detail) {
        let eventOptions = {};
        eventOptions[DataProviderMutationEvent._DETAIL] = detail;
        super('mutate', eventOptions);
    }
}
DataProviderMutationEvent._DETAIL = 'detail';
oj.DataProviderMutationEvent = DataProviderMutationEvent;
oj['DataProviderMutationEvent'] = DataProviderMutationEvent;


/**
 * Interface oj.DataProviderMutationEventDetail
 */


/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @since 4.2.0
 * @export
 * @interface DataProviderMutationEventDetail
 * @ojsignature {target: "Type",
 *               value: "interface DataProviderMutationEventDetail<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 * @classdesc This interface defines the payload of the {@link DataProviderMutationEvent} and specifies as one atomic event all the mutation operations which
 * occurred. The keys for each operation must be disjoint from each other, e.g. for example
 * an add and remove cannot occur on the same item. In addition, any indexes specified must
 * be monotonically increasing.
 */

/**
 * Optional add operation detail
 *
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEventDetail
 * @instance
 * @name add
 * @type {DataProviderAddOperationEventDetail}
 * @ojsignature {target: "Type",
 *               value: "?DataProviderAddOperationEventDetail<K, D>"}
 */

/**
 * Optional remove operation detail
 *
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEventDetail
 * @instance
 * @name remove
 * @type {DataProviderOperationEventDetail}
 * @ojsignature {target: "Type",
 *               value: "?DataProviderOperationEventDetail<K, D>"}
 */

/**
 * Optional update operation detail
 *
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEventDetail
 * @instance
 * @name update
 * @type {DataProviderOperationEventDetail}
 * @ojsignature {target: "Type",
 *               value: "?DataProviderOperationEventDetail<K, D>"}
 */

/**
 * End of jsdoc
 */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 *
 * @since 4.2.0
 * @export
 * @final
 * @class DataProviderMutationEvent
 * @implements Event
 * @classdesc Mutation event dispatched by {@link DataProvider}
 * @param {DataProviderMutationEventDetail} detail the event detail
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
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name detail
 * @type {DataProviderMutationEventDetail}
 * @ojsignature {target: "Type",
 *               value: "DataProviderMutationEventDetail<K, D>"}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name type
 * @type {string}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name bubbles
 * @type {boolean}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name cancelable
 * @type {boolean}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name cancelBubble
 * @type {boolean}
 */

/**
 *
 * @since 6.0.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name composed
 * @type {boolean}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name currentTarget
 * @type {EventTarget}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name defaultPrevented
 * @type {boolean}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name eventPhase
 * @type {number}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name isTrusted
 * @type {boolean}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name returnValue
 * @type {boolean}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name srcElement
 * @type {Element | null}
 */


/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name target
 * @type {EventTarget}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name timeStamp
 * @type {number}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name scoped
 * @type {boolean}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name initEvent
 * @ojsignature {target: "Type",
 *               value: "(eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean) => void"}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name preventDefault
 * @ojsignature {target: "Type",
 *               value: "() => void"}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name stopImmediatePropagation
 * @ojsignature {target: "Type",
 *               value: "() => void"}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name stopPropagation
 * @ojsignature {target: "Type",
 *               value: "() => void"}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name deepPath
 * @ojsignature {target: "Type",
 *               value: "() => EventTarget[]"}
 */

/**
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name composedPath
 * @ojsignature {target: "Type",
 *               value: "() => EventTarget[]"}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name AT_TARGET
 * @type {number}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name BUBBLING_PHASE
 * @type {number}
 */

/**
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name CAPTURING_PHASE
 * @type {number}
 */

/**
 *
 * @since 6.0.0
 * @export
 * @expose
 * @memberof DataProviderMutationEvent
 * @instance
 * @name NONE
 * @type {number}
 */

/**
 * End of jsdoc
 */





/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 *
 * @since 4.2.0
 * @export
 * @interface DataProviderOperationEventDetail
 * @ojsignature {target: "Type",
 *               value: "interface DataProviderOperationEventDetail<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines the details for a particular operation in an {@link DataProviderMutationEventDetail}
 */

/**
 * keys of items involved in the operation
 *
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderOperationEventDetail
 * @instance
 * @name keys
 * @type {Set.<any>}
 * @ojsignature {target: "Type",
 *               value: "Set<K>"}
 */

/**
 * Optional metadata of items involved in the operation
 *
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderOperationEventDetail
 * @instance
 * @name metadata
 * @type {Array.<ItemMetadata>}
 * @ojsignature {target: "Type",
 *               value: "?Array<ItemMetadata<K>>"}
 */

/**
 * Optional data of items involved in the operation
 *
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderOperationEventDetail
 * @instance
 * @name data
 * @type {Array.<Object>}
 * @ojsignature {target: "Type",
 *               value: "?D[]"}
 */

/**
 * Optional indexes of items involved in the operation. Indices are with respect to the DataProvider
 * with only its implicit sort applied. Essentially, indices are the global indices (except for TreeDataProvider, please see
 * the note below), not the indices with respect to whatever query (which might have its own sorting or filtering)
 * fetched the items.
 *
 * <p>For 'add' operation the indexes are relative to after the
 * operation was completed and not the original dataset.</p>
 *
 * <p>For 'update' operation the indexes are relative to after the
 * operation was completed and not the original dataset.</p>
 *
 * <p>For 'remove' operation the indexes are relative to the original dataset.</p>
 *
 * <p>Note: With respect to TreeDataProvider, the index is the index at the level where the mutation occurs.
 * That is, the index of the node among its siblings.</p>
 * <p> Optimization can be achieved by specifying indexes for mutation events. </p>
 * @since 4.2.0
 * @export
 * @expose
 * @memberof DataProviderOperationEventDetail
 * @instance
 * @name indexes
 * @type {Array.<number>}
 * @ojsignature {target: "Type",
 *               value: "?number[]"}
 * @ojtsexample <caption>Example to illustrate indexes from array mutations</caption>
 * let data = [{ id: 1, name: 'Amy Bartlet', title: 'Vice President' },
 *             { id: 2, name: 'Annett Barnes', title: 'Individual  Contributer' },
 *             { id: 3, name: 'Bobby Fisher', title: 'Individual Contributer' }];
 * let observableArray = ko.observableArray(data);
 * let dataProvider = new ArrayDataProvider(ko.observableArray(data), { keyAttributes: 'id' });
 *
 * let listener = function(event) {
 *  // Print DataProviderEventDetail
 * };
 *
 * dataProvider.addEventListener("mutate", listener);
 *
 * observableArray.push({ id: 4, name: ‘John schully', title: ‘Manager' });
 * // Then the DataProviderOperationEventDetail will have Indexes as [3]
 *
 * observableArray.splice(2, 1, { id: 5, name: ’Scott Jhonson', title: ‘President' });
 * // Then the DataProviderOperationEventDetail will have Indexes as [2]
 * @ojtsexample <caption>Example to illustrate indexes with respect to ArrayTreeDataProvider</caption>
 *
 * let dataArray = [{
 *                    title: "Amy Bartlet",
 *                    id: "100"
 *                  },
 *                  {
 *                    title: "Scott Fisher",
 *                    id: "101",
 *                    children: [{
 *                                 title: "John Fisher",
 *                                 id: "102"
 *                               },
 *                               {
 *                                 title: "Bobby Fisher",
 *                                 id: "103"
 *                               }]
 *                  },
 *                  {
 *                    title: "Annett Barnes",
 *                    id: "104"
 *                  }];
 *
 * createObservableArrayTree(data: Array<any>) {
 *   let array = <any[]>[];
 *   let observableArray = ko.observableArray(array);
 *   for (let i = 0; i < data.length; i++) {
 *     let newItem = data[i];
 *     if (data[i].children) {
 *       newItem.children = this.createObservableArrayTree(data[i].children);
 *     }
 *     observableArray.push(newItem);
 *   }
 *   return observableArray;
 * }
 *
 * let observableArrayTree = createObservableArrayTree(dataArray);
 * let dataProvider = new ArrayTreeDataProvider(observableArrayTree, { keyAttributes: 'id' });
 * dataProvider.addEventListener('mutate', ((event: CustomEvent<any>) => {
 *   console.log(event.detail);
 * }) as EventListener);
 * let index = 1;
 *
 * observableArrayTree()[1].children.splice(index, 1);
 *
 * // Output will be // { 'add': null, 'remove' : { 'indexes': [1] }, 'update': null}
 * // Here the index 1 refers to the object with id '103'.
 */

/**
 * End of jsdoc
 */


class DataProviderRefreshEvent extends GenericEvent {
    constructor() {
        super('refresh');
    }
}
oj.DataProviderRefreshEvent = DataProviderRefreshEvent;
oj['DataProviderRefreshEvent'] = DataProviderRefreshEvent;



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @since 4.1.0
 * @export
 * @final
 * @class DataProviderRefreshEvent
 * @implements Event
 * @classdesc Refresh Event dispatched by the {@link DataProvider}. This event is fired when
 * the data has been refreshed and components need to re-fetch the data.
 * @ojsignature {target: "Type",
 *               value: "class DataProviderRefreshEvent implements Event"}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name type
 * @type {string}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name bubbles
 * @type {boolean}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name cancelable
 * @type {boolean}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name cancelBubble
 * @type {boolean}
 */

/**
 *
 * @since 6.0.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name composed
 * @type {boolean}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name currentTarget
 * @type {EventTarget}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name defaultPrevented
 * @type {boolean}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name eventPhase
 * @type {number}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name isTrusted
 * @type {boolean}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name returnValue
 * @type {boolean}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name srcElement
 * @type {Element | null}
 */


/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name target
 * @type {EventTarget}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name timeStamp
 * @type {number}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name scoped
 * @type {boolean}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name initEvent
 * @ojsignature {target: "Type",
 *               value: "(eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean) => void"}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name preventDefault
 * @ojsignature {target: "Type",
 *               value: "() => void"}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name stopImmediatePropagation
 * @ojsignature {target: "Type",
 *               value: "() => void"}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name stopPropagation
 * @ojsignature {target: "Type",
 *               value: "() => void"}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name deepPath
 * @ojsignature {target: "Type",
 *               value: "() => EventTarget[]"}
 */

/**
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name composedPath
 * @ojsignature {target: "Type",
 *               value: "() => EventTarget[]"}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name AT_TARGET
 * @type {number}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name BUBBLING_PHASE
 * @type {number}
 */

/**
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name CAPTURING_PHASE
 * @type {number}
 */

/**
 *
 * @since 6.0.0
 * @export
 * @expose
 * @memberof DataProviderRefreshEvent
 * @instance
 * @name NONE
 * @type {number}
 */

/**
 * End of jsdoc
 */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 *
 * @since 4.2.0
 * @export
 * @interface DataProvider
 * @extends EventTarget
 * @ojsignature {target: "Type",
 *               value: "interface DataProvider<K, D> extends EventTarget",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 * @classdesc
 * The DataProvider interface defines the contract by which JET components retrieve data.  By exposing this contract as an interface, we allow for a range of possible data retrieval strategies, while shielding components from dependencies on any one particular implementation choice.  For example, some DataProvider implementations may get data from a local array. Others may retrieve data from a remote endpoint.  In either case, the consuming component simply interacts with the DataProvider interface and is unaware of the of the specific data retrieval approach.
 * <p>
 * The DataProvider contract has the following characteristics:
 * <ul>
 *   <li>Asynchronous: Even in cases where data is available synchronously (eg. the data is already in a local array), the DataProvider contract provides access to the data via asynchronous APIs.  As such, consumers are able to interact with the data in a consistent manner, regardless of how the data is retrieved.</li>
 *   <li>Stateless: The DataProvider’s data retrieval APIs are inherently stateless.  Attempts to retrieve data are atomic and are not impacted by previous interactions with the DataProvider.  This avoids potential brittleness when multiple consumers are interacting with the same DataProvider instance.</li>
 *   <li>Key-based: In order to ensure reliable interactions with the data set, the DataProvider contract assumes that each data item can be accessed via a unique key.  While the index can be used as a key if no viable key is available, stable keys should be used whenever possible.</li>
 *   <li>Read only (with mutation notifications):  The base DataProvider contract does not include mutation APIs.  That is, the DataProvider contract defines APIs for reading data, not for writing data.  However, DataProvider implementations may expose their own type-specific mutation APIs, and the DataProvider contract defines an event-based mechanism for notifying consumers of data changes.</li>
 *   <li>Filterable:  When requesting data from a DataProvider, consumers are able to specify filter criteria that area used to restrict the data set to those items that match the specified criteria.</li>
 *   <li>Sortable:  When requesting data from a DataProvider, consumers are able to specify sort criteria that impact the ordering of the provided data.</li>
 * </ul>
 * <p>
 * The DataProvider contract exposes three ways for consumers to retrieve data:
 * <ul>
 *   <li>Iteration: the {@link DataProvider#fetchFirst} method returns an AsyncIterable that can be used to iterate over the entire data set.  Consumers typically use this when rendering a data set.</li>
 *   <li>By keys: the {@link DataProvider#fetchByKeys} method allows specific items to be retrieved by key.  Consumers typically use this when interacting with a subset of data (eg. for retrieving the values of the selected rows in a table component).</li>
 *   <li>By offset: the {@link DataProvider#fetchByOffset} method allows a specific block of data to be retrieved by specifying an offset and size. Consumers typically use this for paging purposes.</li>
 * </ul>
 * A related interface is {@link TreeDataProvider}, which extends DataProvider. TreeDataProviders represent hierarchical data, whereas (non-tree) DataProviders represent data sets that are single-level.
 * <p>
 * JET provides several out-of-the-box DataProvider implementations that support the most common use cases.
 * <br>
 * <h4 id="description:DataProviderImplementations" class="name">
 *   Implementations
 * </h4>
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Class</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>
 *         {@link ArrayDataProvider}
 *       </td>
 *       <td>
 *         Basic DataProvider implementation that takes the data from an Javascript array or ko.observableArray.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link ArrayTreeDataProvider}
 *       </td>
 *       <td>
 *         Basic TreeDataProvider implementation that takes the data from an Javascript array or ko.observableArray that contains "children" property for subtree data.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link CollectionDataProvider}
 *       </td>
 *       <td>
 *         DataProvider implementation that takes the data from a {@link oj.Collection} object. {@link oj.Collection} is an older class that represents data usually comes from external source such as a REST.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link DeferredDataProvider}
 *       </td>
 *       <td>
 *         DataProvider implementation that takes the data from a promise that resolves to another DataProvider object.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link FlattenedTreeDataProviderView}
 *       </td>
 *       <td>
 *         DataProvider implementation that wraps a TreeDataProvider object and "flattens" the hierarchical data into a single level.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link IndexerModelTreeDataProvider}
 *       </td>
 *       <td>
 *         TreeDataProvider implementation that takes the data from an Javascript array that contains "children" property for subtree data. This class also implements the {@link oj.IndexerModel} interface.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link ListDataProviderView}
 *       </td>
 *       <td>
 *         DataProvider implementation that wraps another DataProvider, adding data manipulation functionality such as filtering, sorting and field mapping.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link PagingDataProviderView}
 *       </td>
 *       <td>
 *         DataProvider implementation that wraps another DataProvider object. This class also implements the {@link oj.PagingModel} interface so that it can be used by components that support paging.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link TreeDataProviderView}
 *       </td>
 *       <td>
 *         TreeDataProvider implementation that wraps another TreeDataProvider object and exposes additional APIs. This class provides field mapping functionality for the wrapped TreeDataProvider.
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 * <h4 id="description:DataProviderClassHierarchy" class="name">
 *   Class Hierarchy
 * </h4>
 * <ul>
 *   <li><b>Interface {@link DataProvider}</b></li>
 *   <ul>
 *     <li>{@link ArrayDataProvider}</li>
 *     <li>{@link CollectionDataProvider}</li>
 *     <li>{@link DeferredDataProvider}</li>
 *     <li>{@link FlattenedTreeDataProviderView}</li>
 *     <li>{@link ListDataProviderView}</li>
 *     <li>{@link PagingDataProviderView}</li>
 *     <li><b>Interface {@link TreeDataProvider}</b></li>
 *       <ul>
 *         <li>{@link ArrayTreeDataProvider}</li>
 *         <li>{@link IndexerModelTreeDataProvider}</li>
 *         <li>{@link TreeDataProviderView}</li>
 *       </ul>
 *     </li>
 *   </ul>
 * </ul>
 * </p><p>
 *
 * <h3 id="events-section">
 *   Events
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
 * </h3>
 * Implementations can fire the following events by creating an instance of the event class and passing the event payload in the constructor.
 * <h4 id="event:DataProviderMutationEvent" class="name">
 *   {@link DataProviderMutationEvent}
 * </h4>
 * This event is fired when items have been added or removed from the data.
 * <p>
 * Event payloads should implement the {@link DataProviderMutationEventDetail} interface.
 * </p><p>
 * Consumers can add an event listener for the "mutate" event type on the DataProvider object.
 * </p>
 * <i>Example of implementation firing an DataProviderMutationEvent for removed items:</i>
 * <pre class="prettyprint"><code>let removeDetail = {data: removedDataArray,
 *                     indexes: removedIndexArray,
 *                     keys: removedKeySet,
 *                     metadata: removedMetadataArray};
 * this.dispatchEvent(new DataProviderMutationEvent({remove: removeDetail}));
 * </code></pre>
 *
 * <i>Example of consumer listening for the "mutate" event type:</i>
 * <pre class="prettyprint"><code>let listener = function(event) {
 *   if (event.detail.remove) {
 *     let removeDetail = event.detail.remove;
 *     // Handle removed items
 *   }
 * };
 * dataProvider.addEventListener("mutate", listener);
 * </code></pre>
 * <h4 id="event:DataProviderRefreshEvent" class="name">
 *   {@link DataProviderRefreshEvent}
 * </h4>
 * This event is fired when the data has been refreshed and components need to re-fetch the data.
 * <p>
 * This event contains no additional event payload.
 * </p><p>
 * Consumers can add an event listener for the "refresh" event type on the DataProvider object.
 * </p>
 * <i>Example of consumer listening for the "refresh" event type:</i>
 * <pre class="prettyprint"><code>let listener = function(event) {
 * };
 * dataProvider.addEventListener("refresh", listener);
 * </code></pre>
 * <h3 id="custom-implementations-section">
 *   Custom Implementations
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#custom-implementations-section"></a>
 * </h3>
 * Applications can also create their own implementations of the DataProvider interface and use them with JET components.  For example, an application can create a DataProvider implementation
 * that fetches data from a REST endpoint.
 * </p><p>
 * Implementation classes must implement all of the interface methods.  It should also fire the DataProvider events when appropriate, so that JET components or other consumers can respond to data change accordingly.
 * </p>
 * <p>
 * A generic implementation of {@link DataProvider#fetchByKeys} and {@link DataProvider#containsKeys} is available from {@link FetchByKeysMixin}
 * which can be used in custom implementations of DataProvider.
 * It is for convenience and may not provide the most efficient implementation for your data provider.
 * Classes that implement the DataProvider interface are encouraged to provide a more efficient implementation.
 * </p>
 */
oj.DataProvider = function () {
};

/**
 * Get an asyncIterator which can be used to fetch a block of data.
 *
 *
 * @since 4.2.0
 * @param {FetchListParameters=} params fetch parameters
 * @return {AsyncIterable.<FetchListResult>} AsyncIterable with {@link FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name fetchFirst
 * @ojsignature {target: "Type",
 *               value: "(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>"}
 * @ojtsexample <caption>Get an asyncIterator and then fetch first block of data by executing next() on the iterator. Subsequent blocks can be fetched by executing next() again.</caption>
 * let asyncIterator = dataprovider.fetchFirst(options)[Symbol.asyncIterator]();
 * let result = await asyncIterator.next();
 * let value = result.value;
 * let data = value.data;
 * let keys = value.metadata.map(function(val) {
 *   return val.key;
 * });
 * // true or false for done
 * let done = result.done;
 */

/**
 * Determines whether this DataProvider defines a certain feature.
 *
 *
 * @since 4.2.0
 * @param {string} capabilityName capability name. Defined capability names are:
 *                  "fetchByKeys", "fetchByOffset", "sort", "fetchCapability" and "filter".
 * @return {Object} capability information or null if undefined
 * <ul>
 *   <li>If capabilityName is "fetchByKeys", returns a {@link FetchByKeysCapability} object.</li>
 *   <li>If capabilityName is "fetchByOffset", returns a {@link FetchByOffsetCapability} object.</li>
 *   <li>If capabilityName is "sort", returns a {@link SortCapability} object.</li>
 *   <li>If capabilityName is "filter", returns a {@link FilterCapability} object.</li>
 *   <li>If capabilityName is "fetchCapability", returns a {@link FetchCapability} object.</li>
 * </ul>
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name getCapability
 * @ojsignature {target: "Type",
 *               value: "(capabilityName: string): any"}
 * @ojtsexample <caption>Check what kind of fetchByKeys is defined.</caption>
 * let capabilityInfo = dataprovider.getCapability('fetchByKeys');
 * if (capabilityInfo.implementation == 'iteration') {
 *   // the DataProvider supports iteration for fetchByKeys
 *   ...
 */

/**
 * Return the total number of rows in this dataprovider
 *
 *
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows. -1 is unknown row count.
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name getTotalSize
 * @ojtsexample <caption>Get the total rows</caption>
 * let value = await dataprovider.getTotalSize();
 * if (value == -1) {
 *   // we don't know the total row count
 * } else {
 *   // the total count
 *   console.log(value);
 */

/**
 * Fetch rows by keys. The resulting key map will only contain keys which were actually found.
 *
 *
 * @since 4.2.0
 * @param {FetchByKeysParameters} parameters fetch by key parameters
 * @return {Promise.<FetchByKeysResults>} Returns Promise which resolves to {@link FetchByKeysResults}.
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name fetchByKeys
 * @ojsignature {target: "Type",
 *               value: "(parameters : FetchByKeysParameters<K>) : Promise<FetchByKeysResults<K, D>>"}
 * @ojtsexample <caption>Fetch for keys 1001 and 556</caption>
 * let fetchKeys = [1001, 556];
 * let value = await dataprovider.fetchByKeys({keys: fetchKeys});
 * // get the data for key 1001
 * console.log(value.results.get(1001).data);
 */

/**
 * Check if there are rows containing the specified keys. The resulting key map will only contain keys which were actually found.
 *
 *
 * @since 4.2.0
 * @param {FetchByKeysParameters} parameters contains by key parameters
 * @return {Promise.<ContainsKeysResults>} Returns Promise which resolves to {@link ContainsKeysResults}.
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name containsKeys
 * @ojsignature {target: "Type",
 *               value: "(parameters : FetchByKeysParameters<K>) : Promise<ContainsKeysResults<K>>"}
 * @ojtsexample <caption>Check if keys 1001 and 556 are contained</caption>
 * let containsKeys = [1001, 556];
 * let value = await dataprovider.containsKeys({keys: containsKeys});
 * let results = value['results'];
 * if (results.has(1001)) {
 *   console.log('Has key 1001');
 * } else if (results.has(556){
 *   console.log('Has key 556');
 * }
 */

/**
 * Fetch rows by offset
 * <p>
 * A generic implementation of this method is available from {@link FetchByOffsetMixin}.
 * It is for convenience and may not provide the most efficient implementation for your data provider.
 * Classes that implement the DataProvider interface are encouraged to provide a more efficient implementation.
 * </p>
 *
 *
 * @since 4.2.0
 * @param {FetchByOffsetParameters} parameters fetch by offset parameters
 * @return {Promise.<FetchByOffsetResults>} Returns Promise which resolves to {@link FetchByOffsetResults}.
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name fetchByOffset
 * @ojsignature {target: "Type",
 *               value: "(parameters: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>"}
 * @ojtsexample <caption>Fetch by offset 5 rows starting at index 2</caption>
 * let result = await dataprovider.fetchByOffset({size: 5, offset: 2});
 * let results = result['results'];
 * let data = results.map(function(value) {
 *   return value['data'];
 * });
 * let keys = results.map(function(value) {
 *   return value['metadata']['key'];
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
 *
 * @since 4.2.0
 * @return {"yes" | "no" | "unknown"} string that indicates if this data provider is empty
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name isEmpty
 * @ojsignature {target: "Type",
 *               value: "(): 'yes' | 'no' | 'unknown'"}
 * @ojtsexample <caption>Check if empty</caption>
 * let isEmpty = dataprovider.isEmpty();
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
 *
 * @since 6.2.0
 * @param {Set.<any>=} initialSet Optionally specify an initial set of keys for the Set. If not specified, then return an empty Set.
 * @return {Set.<any>} Returns a Set optimized for handling keys from the DataProvider.
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name createOptimizedKeySet
 * @ojsignature {target: "Type",
 *               value: "?(initialSet?: Set<K>): Set<K>"}
 * @ojtsexample <caption>create empty key Set</caption>
 * let keySet = dataprovider.createOptimizedKeySet();
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
 *
 * @since 6.2.0
 * @param {Map.<any>=} initialMap Optionally specify an initial map of key/values for the Map. If not specified, then return an empty Map.
 * @return {Map.<any>} Returns a Map optimized for handling keys from the DataProvider.
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name createOptimizedKeyMap
 * @ojsignature {target: "Type",
 *               value: "?(initialMap?: Map<K, D>): Map<K, D>"}
 * @ojtsexample <caption>create empty key Map</caption>
 * let keyMap = dataprovider.createOptimizedKeyMap();
 */

/**
 * Add a callback function to listen for a specific event type.
 *
 *
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name addEventListener
 * @param {string} eventType The event type to listen for.
 * @param {EventListener} listener The callback function that receives the event notification.
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * Remove a listener previously registered with addEventListener.
 *
 *
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name removeEventListener
 * @param {string} eventType The event type that the listener was registered for.
 * @param {EventListener} listener The callback function that was registered.
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * Dispatch an event and invoke any registered listeners.
 *
 *
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name dispatchEvent
 * @param {Event} event The event object to dispatch.
 * @return {boolean} Return false if a registered listener has cancelled the event. Return true otherwise.
 * @ojsignature {target: "Type",
 *               value: "(evt: Event): boolean"}
 */


/**
 * End of jsdoc
 */





/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @export
 * @interface DedupCapability
 * @since 9.1.0
 * @ojsignature {target: "Type",
 *               value: "interface DedupCapability"}
 * @classdesc Defines the result from the DataProvider method {@link DataProvider#getCapability} for capability "dedup"
 */

/**
 * Dedup type information. Type of 'global' indicates that this DataProvider globally dedups keys and will always return unique keys. Type of
 * 'iterator' indicates that this DataProvider dedups keys during fetch iteration. Type of 'none' indicates that this DataProvider does not
 * dedup keys and may return duplicate keys.
 *
 *
 * @since 9.1.0
 * @export
 * @expose
 * @memberof DedupCapability
 * @instance
 * @name type
 * @type {string}
 * @ojsignature {target: "Type",
 *               value: "'global' | 'none' | 'iterator'"}
 */

/**
 * End of jsdoc
 */





/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @export
 * @interface EventFilteringCapability
 * @since 9.1.0
 * @ojsignature {target: "Type",
 *               value: "interface EventFilteringCapability"}
 * @classdesc Defines the result from the DataProvider method {@link DataProvider#getCapability} for capability "eventFiltering"
 */

/**
 * Mutation event filtering type information for scrolling. Note that mutation event filtering is
 * only done on remove and update events, not on add events. The reason is because the properties which
 * indicate the location of an added row are optional so it is not possible to guarantee that an add is
 * not occurring inside the already iterated rowset.
 * Type of 'global' indicates that this DataProvider globally filters mutation events. Type of
 * 'iterator' indicates that this DataProvider filters events based on rows which have been fetched via
 * fetch iteration. Type of 'none' indicates that this DataProvider does not filter mutation events.
 *
 *
 * @since 9.1.0
 * @export
 * @expose
 * @memberof EventFilteringCapability
 * @instance
 * @name type
 * @type {string}
 * @ojsignature {target: "Type",
 *               value: "'global' | 'none' | 'iterator'"}
 */

/**
 * End of jsdoc
 */




/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @since 6.1.0
 * @export
 * @interface FetchAttribute
 * @ojsignature {target: "Type",
 *               value: "interface FetchAttribute"}
 * @classdesc Defines the stucture of attribute objects in {@link FetchListParameters#attributes}
 */

/**
 * The name of the attribute or sub object or related object.
 *
 *
 * @since 6.1.0
 * @export
 * @expose
 * @memberof FetchAttribute
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
 *
 * @since 6.1.0
 * @export
 * @expose
 * @memberof FetchAttribute
 * @instance
 * @name attributes
 * @type {Array.<string | FetchAttribute>}
 * @ojsignature {target: "Type",
 *               value: "?Array<string | FetchAttribute>"}
 */

 /**
  * end of jsdoc
  */






/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @export
 * @interface FetchByKeysCapability
 * @since 4.2.0
 * @ojsignature {target: "Type",
 *               value: "interface FetchByKeysCapability<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines the result to the DataProvider method {@link DataProvider#getCapability} for capability "fetchByKeys"
 */

/**
 * The type of implementation for fetchByKeys and containsKeys methods.  Possible values are:
 * <ul>
 * <li>"iteration": the implementation uses fetchFirst iteratively to find the result</li>
 * <li>"lookup": the implementation uses direct lookup to find the result</li>
 * </ul>
 *
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof FetchByKeysCapability
 * @instance
 * @name implementation
 * @type {"iteration" | "lookup"}
 */

/**
 * End of jsdoc
 */

class FetchByKeysMixin {
    /**
     * Fetch rows by keys
     */
    fetchByKeys(params) {
        let fetched = 0;
        let limit = this['getIterationLimit'] ? this['getIterationLimit']() : -1;
        let options = {};
        options['size'] = 25;
        let resultMap = new Map();
        let dataProviderAsyncIterator = this['fetchFirst'](options)[Symbol.asyncIterator]();
        function _fetchNextSet(params, dataProviderAsyncIterator, resultMap) {
            return dataProviderAsyncIterator.next().then(function (result) {
                let value = result['value'];
                let data = value['data'];
                let metadata = value['metadata'];
                let keys = metadata.map(function (metadata) {
                    return metadata['key'];
                });
                let foundAllKeys = true;
                params['keys'].forEach(function (findKey) {
                    if (!resultMap.has(findKey)) {
                        keys.map(function (key, index) {
                            if (key == findKey) {
                                resultMap.set(key, { metadata: metadata[index], data: data[index] });
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
            let mappedResultMap = new Map();
            resultMap.forEach(function (value, key) {
                let mappedItem = [value];
                mappedResultMap.set(key, mappedItem[0]);
            });
            return { fetchParameters: params, results: mappedResultMap };
        });
    }
    /**
     * Check if rows are contained by keys
     */
    containsKeys(params) {
        return this.fetchByKeys(params).then(function (fetchByKeysResult) {
            let results = new Set();
            params['keys'].forEach(function (key) {
                if (fetchByKeysResult['results'].get(key) != null) {
                    results.add(key);
                }
            });
            return Promise.resolve({ containsParameters: params, results: results });
        });
    }
    getCapability(capabilityName) {
        if (capabilityName == 'fetchByKeys') {
            return { implementation: 'iteration' };
        }
        let cap = null;
        if (this['_ojSkipLastCapability'] !== true) {
            this['_ojSkipLastCapability'] = true;
            // Find the index for the very last _ojLastGetCapability
            let index = 1;
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
    }
    static applyMixin(derivedCtor) {
        // Save the current getCapability
        let _lastGetCapability = derivedCtor.prototype['getCapability'];
        let baseCtors = [FetchByKeysMixin];
        baseCtors.forEach((baseCtor) => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
        if (_lastGetCapability) {
            let index = 1;
            while (derivedCtor.prototype['_ojLastGetCapability' + index]) {
                ++index;
            }
            derivedCtor.prototype['_ojLastGetCapability' + index] = _lastGetCapability;
        }
    }
}
oj['FetchByKeysMixin'] = FetchByKeysMixin;
oj['FetchByKeysMixin']['applyMixin'] = FetchByKeysMixin.applyMixin;



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 *
 * @export
 * @namespace FetchByKeysMixin
 * @classdesc Mixin class to provide generic implementation of {@link DataProvider#fetchByKeys} and {@link DataProvider#containsKeys}
 * methods for the {@link DataProvider} interface.
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
 *
 * @param {Function} derivedCtor the constructor of an existing class
 * @export
 * @expose
 * @memberof FetchByKeysMixin
 * @method
 * @name applyMixin
 * @ojtsexample <caption>Apply the mixin in Typescript:</caption>
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
 * FetchByKeysMixin.applyMixin(CustomDataProvider);
 *
 * @ojtsexample <caption>Apply the mixin in Javascript:</caption>
 * function CustomDataProvider() {
 *   // Constructor implementation
 * }
 *
 * FetchByKeysMixin.applyMixin(CustomDataProvider);
 * @ojsignature {target: "Type", value: "(derivedCtor: {new(): DataProvider<any, any>}): any;"}
 */

 /**
  * end of jsdoc
  */







/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @export
 * @interface FetchByOffsetCapability
 * @since 4.2.0
 * @ojsignature {target: "Type",
 *               value: "interface FetchByOffsetCapability<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines the result to the DataProvider method {@link DataProvider#getCapability} for capability "fetchByOffset"
 */

/**
 * The type of implementation for fetchByOffset method.  Possible values are:
 * <ul>
 * <li>"iteration": the implementation uses fetchFirst iteratively to find the result</li>
 * <li>"randomAccess": the implementation uses random access to find the result</li>
 * </ul>
 *
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof FetchByOffsetCapability
 * @instance
 * @name implementation
 * @type {"iteration" | "randomAccess"}
 */

/**
 * End of jsdoc
 */

class FetchByOffsetMixin {
    /**
     * Fetch rows by offset
     */
    fetchByOffset(params) {
        let size = params && params['size'] > 0 ? params['size'] : 25;
        let sortCriteria = params ? params['sortCriteria'] : null;
        let offset = params && params['offset'] > 0 ? params['offset'] : 0;
        let fetched = 0;
        let limit = this['getIterationLimit'] ? this['getIterationLimit']() : -1;
        let done = false;
        let options = {};
        options['size'] = size;
        options['sortCriteria'] = sortCriteria;
        let resultArray = new Array();
        let dataProviderAsyncIterator = this['fetchFirst'](options)[Symbol.asyncIterator]();
        function _fetchNextSet(params, dataProviderAsyncIterator, resultArray) {
            return dataProviderAsyncIterator.next().then(function (result) {
                done = result['done'];
                let value = result['value'];
                let data = value['data'];
                let metadata = value['metadata'];
                let dataLen = data.length;
                if (offset < fetched + dataLen) {
                    let start = offset <= fetched ? 0 : offset - fetched;
                    for (let index = start; index < dataLen; index++) {
                        if (resultArray.length == size) {
                            break;
                        }
                        resultArray.push({ metadata: metadata[index], data: data[index] });
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
            return { fetchParameters: params, results: resultArray, done: done };
        });
    }
    getCapability(capabilityName) {
        if (capabilityName == 'fetchByOffset') {
            return { implementation: 'iteration' };
        }
        let cap = null;
        if (this['_ojSkipLastCapability'] !== true) {
            this['_ojSkipLastCapability'] = true;
            // Find the index for the very last _ojLastGetCapability
            let index = 1;
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
    }
    static applyMixin(derivedCtor) {
        // Save the current getCapability
        let _lastGetCapability = derivedCtor.prototype['getCapability'];
        let baseCtors = [FetchByOffsetMixin];
        baseCtors.forEach((baseCtor) => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
        if (_lastGetCapability) {
            let index = 1;
            while (derivedCtor.prototype['_ojLastGetCapability' + index]) {
                ++index;
            }
            derivedCtor.prototype['_ojLastGetCapability' + index] = _lastGetCapability;
        }
    }
}
oj['FetchByOffsetMixin'] = FetchByOffsetMixin;
oj['FetchByOffsetMixin']['applyMixin'] = FetchByOffsetMixin.applyMixin;



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 *
 * @export
 * @namespace FetchByOffsetMixin
 * @classdesc Mixin class to provide generic implementation of {@link DataProvider#fetchByOffset}
 * method for the {@link DataProvider} interface.
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
 *
 * @param {Function} derivedCtor the constructor of an existing class
 * @export
 * @expose
 * @memberof FetchByOffsetMixin
 * @method
 * @name applyMixin
 * @ojtsexample <caption>Apply the mixin in Typescript:</caption>
 * class CustomDataProvider&lt;K, D> implements DataProvider&lt;K, D> {
 *   // Add a stand-in property to satisfy the compiler
 *   fetchByOffset: (parameters: FetchByOffsetParameters&lt;D>) => Promise&lt;FetchByOffsetResults&lt;K, D>>;
 *
 *   constructor() {
 *     // Constructor implementation
 *   }
 * }
 *
 * FetchByOffsetMixin.applyMixin(CustomDataProvider);
 *
 * @ojtsexample <caption>Apply the mixin in Javascript:</caption>
 * function CustomDataProvider() {
 *   // Constructor implementation
 * }
 *
 * FetchByOffsetMixin.applyMixin(CustomDataProvider);
 * @ojsignature {target: "Type", value: "(derivedCtor: {new(): DataProvider<any, any>}): any;"}
 */

 /**
  * end of jsdoc
  */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @since 4.1.0
 * @export
 * @interface FetchByOffsetParameters
 * @extends FetchListParameters
 * @ojsignature {target: "Type",
 *               value: "interface FetchByOffsetParameters<D> extends FetchListParameters<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines the parameters to the DataProvider method {@link DataProvider#fetchByOffset}
 */

/**
 * The offset used for the fetch call.
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof FetchByOffsetParameters
 * @instance
 * @name offset
 * @type {number}
 */

/**
 * attributes to include in the result. If specified, then at least these set of attributes will be included in each row
 * results. If not specified then the default attributes will be included.
 *
 *
 * @since 6.1.0
 * @export
 * @expose
 * @memberof FetchByOffsetParameters
 * @instance
 * @name attributes
 * @type {Array.<string | FetchAttribute>}
 * @ojsignature {target: "Type",
 *               value: "?Array<string | FetchAttribute>"}
 */

/**
 * @since 4.1.0
 * @export
 * @interface FetchByOffsetResults
 * @ojsignature {target: "Type",
 *               value: "interface FetchByOffsetResults<K, D>"}
 * @classdesc FetchByOffsetResults defines the result from the DataProvider method {@link DataProvider#fetchByOffset}
 */

/**
 * The parameters used for the fetch call.
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof FetchByOffsetResults
 * @instance
 * @name fetchParameters
 * @type {FetchByOffsetParameters}
 * @ojsignature {target: "Type",
 *               value: "FetchByOffsetParameters<D>"}
 */


/**
 * Array of {@link Item}.
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof FetchByOffsetResults
 * @instance
 * @name results
 * @type {Array.<Item>}
 * @ojsignature {target: "Type",
 *               value: "Array<Item<K, D>>"}
 */

/**
 * Indicates whether there are more items which can be fetched.
 * <p>If this is true, fetching the next block will likely return an empty array as the result.  A DataProvider can potentially make a stronger guarantee (if the DataProvider is running against an immutable repository or the DataProvider doesn’t attempt to retrieve a subsequent block if the DataProvider believes it is complete).  We don’t generally make the stronger guarantee since the repository may have been mutated since the previous response with done:true, such that new records would be returned.</p>
 * <p>If this is false, fetching the next block may or may not return an empty array as a result.</p>
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof FetchByOffsetResults
 * @instance
 * @name done
 * @type {boolean}
 */

 /**
  * end of jsdoc
  */











class FilterImpl {
    constructor(options) {
        options = options || {};
        this._textFilterAttributes = options['filterOptions']
            ? options['filterOptions']['textFilterAttributes']
            : null;
        let filterDef = options.filterDef;
        if (filterDef) {
            if (filterDef['op']) {
                this['op'] = filterDef['op'];
                if (filterDef['value']) {
                    this['value'] = filterDef['value'];
                    if (filterDef['attribute']) {
                        this['attribute'] = filterDef['attribute'];
                    }
                }
                else if (filterDef['criteria']) {
                    this['criteria'] = filterDef['criteria'];
                }
            }
            else if (filterDef['text']) {
                this['text'] = filterDef['text'];
            }
        }
    }
    filter(item, index, array) {
        return oj.FilterUtils.satisfy(FilterImpl._transformFilter(this), item);
    }
    static _transformFilter(filter) {
        let transformedExpr;
        if (filter) {
            let op = filter.op;
            let filterValue;
            if (filter['text']) {
                op = '$regex';
            }
            else {
                // offline has slightly different names for some operators
                if (op === '$le') {
                    op = '$lte';
                }
                else if (op === '$ge') {
                    op = '$gte';
                }
                else if (op === '$pr') {
                    op = '$exists';
                }
            }
            if (op != '$and' && op != '$or') {
                if (filter['text']) {
                    // Escape special characters without change filter['text'] which is the original filter string
                    filterValue = new RegExp(filter['text'].replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'), 'i');
                }
                else {
                    filterValue = filter.value;
                }
                transformedExpr = {};
                let attributeExpr = filter.attribute;
                if (attributeExpr) {
                    let operatorExpr = {};
                    // need express sw and ew as regex
                    if (op === '$sw' || op === '$ew' || op === '$co') {
                        op = '$regex';
                        filterValue = FilterImpl._fixStringExpr(op, filterValue);
                    }
                    operatorExpr[op] = filterValue;
                    transformedExpr[attributeExpr] = operatorExpr;
                }
                else if (filter['text']) {
                    let operatorExpr = {};
                    operatorExpr[op] = filterValue;
                    if (filter._textFilterAttributes) {
                        let textFilterArray = [];
                        filter._textFilterAttributes.forEach(function (field) {
                            let textFilter = {};
                            textFilter[field] = operatorExpr;
                            textFilterArray.push(textFilter);
                        });
                        transformedExpr['$or'] = textFilterArray;
                    }
                    else {
                        transformedExpr['*'] = operatorExpr;
                    }
                }
                else {
                    // the field/value combos are specified in the value itself
                    let criteriaArray = [];
                    FilterImpl._transformObjectExpr(filterValue, op, null, criteriaArray);
                    transformedExpr['$and'] = criteriaArray;
                }
            }
            else {
                let criteriaArray = [];
                filter.criteria.forEach(function (criterion) {
                    criteriaArray.push(FilterImpl._transformFilter(criterion));
                });
                transformedExpr = {};
                transformedExpr[op] = criteriaArray;
            }
        }
        return transformedExpr;
    }
    static _transformObjectExpr(objectExpr, op, path, criteriaArray) {
        let self = this;
        let objectProps = Object.keys(objectExpr);
        if (objectProps.length > 0) {
            Object.keys(objectExpr).forEach(function (fieldAttribute) {
                let fieldValue = objectExpr[fieldAttribute];
                let fieldAttributePath = path ? path + '.' + fieldAttribute : fieldAttribute;
                if (!(fieldValue instanceof Object)) {
                    let operatorExpr = {};
                    // need express co, sw and ew as regex
                    if (op === '$sw' || op === '$ew' || op === '$co') {
                        op = '$regex';
                        fieldValue = FilterImpl._fixStringExpr(op, fieldValue);
                    }
                    operatorExpr[op] = fieldValue;
                    let fieldExpr = {};
                    fieldExpr[fieldAttributePath] = operatorExpr;
                    criteriaArray.push(fieldExpr);
                }
                else {
                    FilterImpl._transformObjectExpr(fieldValue, op, fieldAttributePath, criteriaArray);
                }
            });
        }
        else {
            let operatorExpr = {};
            operatorExpr[op] = objectExpr;
            let fieldExpr = {};
            fieldExpr[path] = operatorExpr;
            criteriaArray.push(fieldExpr);
        }
    }
    static _fixStringExpr(op, value) {
        if (typeof value === 'string' || value instanceof String) {
            if (op === '$sw') {
                value = '^' + value;
            }
            else if (op === '$ew') {
                value = value + '$';
            }
        }
        return value;
    }
}
class FilterFactory {
    static getFilter(options) {
        return new FilterImpl(options);
    }
}
oj['FilterFactory'] = FilterFactory;



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @export
 * @class FilterFactory
 * @since 7.0.0
 * @ojsignature {target: "Type",
 *               value: "class FilterFactory<D>"}
 * @hideconstructor
 * @classdesc Provides the ability to construct filters which can be used for {@link FetchListParameters#filterCriterion}. Note is it not a requirement to use this
 * factory to construct filters based on the filter definition. Applications can construct their own filters which implement the interface {@link DataFilter.Filter}
 */

/**
 * This function is used to pass in a filter definition and returns a filter which can be used
 * with DataProviders. It essentially takes the filter definition and then adds a local filter()
 * function which is required when used for a DataProvider filterCriterion.
 *
 *
 * @since 7.0.0
 * @export
 * @expose
 * @memberof FilterFactory
 * @instance
 * @name getFilter
 * @method
 * @static
 * @param {Object} options Options for the getFilter() function
 * @param {DataFilter.FilterDef} options.filterDef The filter definition for the filter to be returned.
 * @param {any=} options.filterOptions Options for the filter such as textFilterAttributes which lists the attributes to filter on for TextFilter.
 * @return {DataFilter.Filter} Returns either an AttributeFilter, AttributeExprFilter, CompoundFilter, or TextFilter depending on whether a AttributeFilterDef or CompoundFilterDef.
 * was passed in.
 * @ojsignature {target: "Type",
 *               value: "(options: {filterDef: DataFilter.FilterDef<any>, filterOptions: any}): DataFilter.Filter<any>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @example
 * <caption>Get filter which filters on DepartmentId value 10 and then fetch filtered rows from the DataProvider</caption>
 * var filter = FilterFactory.getFilter({filterDef: {op: '$eq', value: {DepartmentId: 10}}};
 * var dataProviderAsyncIterator = dataprovider.fetchFirst({filterCriterion: filter})[Symbol.asyncIterator]();
 * let result = await dataProviderAsyncIterator.next();
 * ...
 **/

/**
 * End of jsdoc
 */





/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for FilterOperator
 *
 *
 * @export
 * @interface FilterOperator
 * @since 5.0.0
 * @ojsignature {target: "Type",
 *               value: "interface FilterOperator<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @ojdeprecated {since: '7.0.0', description: 'Use AttributeFilter or CompoundFilter instead.'}
 */

/**
 * The operator, either an AttributeFilterOperator.AttributeOperator or CompoundFilterOperator.CompoundOperator.
 *
 *
 * @since 5.0.0
 * @export
 * @expose
 * @memberof FilterOperator
 * @instance
 * @name op
 * @type {AttributeFilterOperator.AttributeOperator | CompoundFilterOperator.CompoundOperator}
 */

/**
 * Optional function which is used to locally filter the data.
 *
 *
 * @since 5.0.0
 * @export
 * @expose
 * @memberof FilterOperator
 * @instance
 * @name filter
 * @method
 * @param {Array} data The data to filter
 * @return {Array} filtered data
 */

/**
 * End of jsdoc
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
          if (!(itemValue instanceof Object)) {
            // primitive so coerce to a string
            itemValue = new String(itemValue);
          } else {
            // call toString() on objects. Check if it returns just the default
            // return value for toString(). If so, then we can't do anything so
            // return false
            itemValue = itemValue.toString();

            if (itemValue == '[object Object]') {
              return false;
            }
          }
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
   * @ignore
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
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * The interface for ItemMetadata.  Note that key is the only mandatory property,
 * implementations can provide additional properties as needed.
 *
 *
 * @since 9.0.0
 * @export
 * @interface ItemMessage
 * @ojsignature {target: "Type",
 *               value: "interface ItemMessage"}
 */

/**
 * Detail text of the message.
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof ItemMessage
 * @instance
 * @name detail
 * @type {string}
 */

/**
 * Severity type or level of the message.
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof ItemMessage
 * @instance
 * @name severity
 * @type {(ItemMessage.SEVERITY_TYPE | ItemMessage.SEVERITY_LEVEL)=}
 * @ojsignature {target: "Type",
 *               value: "?(ItemMessage.SEVERITY_TYPE | ItemMessage.SEVERITY_LEVEL)"}
 */

/**
 * Summary text of the message.
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof ItemMessage
 * @instance
 * @name summary
 * @type {string}
 */

/**
 * The supported severity levels of the message.
 * @typedef {1 | 2 | 3 | 4 | 5} ItemMessage.SEVERITY_LEVEL
 * @ojsignature {target:"Type", value:"1 | 2 | 3 | 4 | 5"}
 * @ojvalue {number} 1 {"description": "Indicates a confirmation that an operation or task was completed. This is the lowest severity level."}
 * @ojvalue {number} 2 {"description": "Indicates information or operation messages. This has a lower severity level than warning."}
 * @ojvalue {number} 3 {"description": "Indicates an application condition or situation that might require users' attention. This has a lower severity than error."}
 * @ojvalue {number} 4 {"description": "Used when data inaccuracies occur when completing a field and that needs fixing before user can continue. This has a lower severity level than fatal."}
 * @ojvalue {number} 5 {"description": "Used when a critical application error or an unknown failure occurs. This is the highest severity level."}
 */

/**
 * The supported severity types of the message.
 * @typedef {'confirmation' | 'info' | 'warning' | 'error' | 'fatal'} ItemMessage.SEVERITY_TYPE
 * @ojsignature {target:"Type", value:"'confirmation' | 'info' | 'warning' | 'error' | 'fatal'"}
 * @ojvalue {string} "confirmation" {"description": "Indicates a confirmation that an operation or task was completed. This is the lowest severity level."}
 * @ojvalue {string} "info" {"description": "Indicates information or operation messages. This has a lower severity level than warning."}
 * @ojvalue {string} "warning" {"description": "Indicates an application condition or situation that might require users' attention. This has a lower severity than error."}
 * @ojvalue {string} "error" {"description": "Used when data inaccuracies occur when completing a field and that needs fixing before user can continue. This has a lower severity level than fatal."}
 * @ojvalue {string} "fatal" {"description": "Used when a critical application error or an unknown failure occurs. This is the highest severity level."}
 */

/**
 * End of jsdoc
 */







/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * The interface for ItemWithOptionalData
 *
 *
 * @since 9.0.0
 * @export
 * @interface ItemWithOptionalData
 * @ojsignature {target: "Type",
 *               value: "interface ItemWithOptionalData<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 */

/**
 * The metadata for the item
 *
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof ItemWithOptionalData
 * @instance
 * @name metadata
 * @type {ItemMetadata}
 * @ojsignature {target: "Type",
 *               value: "ItemMetadata<K>"}
 */

/**
 * The data for the item
 *
 *
 * @since 9.0.0
 * @export
 * @expose
 * @memberof ItemWithOptionalData
 * @instance
 * @name data
 * @type {Object}
 * @ojsignature {target: "Type",
 *               value: "?D"}
 */

/**
 * End of jsdoc
 */



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @since 4.1.0
 * @export
 * @interface Item
 * @extends ItemWithOptionalData
 * @ojsignature {target: "Type",
 *               value: "interface Item<K, D> extends ItemWithOptionalData<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines the items returned in the Map<K, Item<K, D>> from the DataProvider method {@link DataProvider#fetchByKeys}
 */

/**
 * The metadata for the item
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof Item
 * @instance
 * @name metadata
 * @type {ItemMetadata}
 * @ojsignature {target: "Type",
 *               value: "ItemMetadata<K>"}
 */

/**
 * The data for the item
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof Item
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
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * The interface for SortCapability
 *
 *
 * @export
 * @interface SortCapability
 * @since 4.2.0
 * @ojsignature {target: "Type",
 *               value: "interface SortCapability<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 * @classdesc Defines the result from the DataProvider method {@link DataProvider#getCapability} for capability "sort"
 */

/**
 * Number of attributes that can be sorted at the same time.  Possible values are:
 * <ul>
 * <li>"none": no sorting is supported.</li>
 * <li>"single": only one attribute can be sorted at a time.</li>
 * <li>"multiple": more than one attribute can be sorted at a time.</li>
 * </ul>
 *
 *
 * @since 4.2.0
 * @export
 * @expose
 * @memberof SortCapability
 * @instance
 * @name attributes
 * @type {"none" | "single" | "multiple"}
 */

/**
 * End of jsdoc
 */








var __DataProvider = {};
__DataProvider.FetchByKeysMixin = oj.FetchByKeysMixin;
__DataProvider.FetchByOffsetMixin = oj.FetchByOffsetMixin;
__DataProvider.FilterFactory = oj.FilterFactory;
__DataProvider.DataProviderRefreshEvent = oj.DataProviderRefreshEvent;
__DataProvider.DataProviderMutationEvent = oj.DataProviderMutationEvent;
__DataProvider.AttributeFilterOperator = oj.AttributeFilterOperator;
__DataProvider.CompoundFilterOperator = oj.CompoundFilterOperator;
__DataProvider.DataCache = oj.DataCache;

  ;return __DataProvider;
});