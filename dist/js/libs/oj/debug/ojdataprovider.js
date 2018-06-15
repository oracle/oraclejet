/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'ojs/ojeventtarget'], function(oj)
{
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

/*jslint browser: true,devel:true*/
/**
 * The interface for oj.FetchByKeysParameters
 * 
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.FetchByKeysParameters
 * @ojsignature {target: "Type",
 *               value: "interface FetchByKeysParameters<K>"}
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
 * The interface for oj.FetchByKeysResults
 * 
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.FetchByKeysResults
 * @ojsignature {target: "Type",
 *               value: "interface FetchByKeysResults<K, D>"}
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
 *               value: "interface ContainsKeysResults<K>"}
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

/*jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.SortCriterion
 * @ojsignature {target: "Type",
 *               value: "interface SortCriterion<D>"}
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

/*jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.DataMapping
 * @ojsignature {target: "Type",
 *               value: "interface DataMapping <K, D, Kin, Din>"}
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
 *               value: "?(filterCriterion: FilterOperator<D>[]) => FilterOperator<Din>[]"}
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
 *               value: "?(sortCriteria: SortCriterion<D>[]) => SortCriterion<Din>[]"}
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
 *               value: "?(sortCriteria: SortCriterion<Din>[]) => SortCriterion<D>[]"}
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

/*jslint browser: true,devel:true*/
/**
 * The interface for oj.FetchFunc
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @ojsignature {target: "Type",
 *               value: "interface FetchFunc<K, D>"}
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

/*jslint browser: true,devel:true*/
/**
 * The interface for oj.FetchListParameters
 * 
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.FetchListParameters
 * @ojsignature {target: "Type",
 *               value: "interface FetchListParameters<D>"}
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
 *               value: "?SortCriterion<D>[]"}
 */

/**
 * Optional filter criterion to apply. The filter criterion would be composed of a
 * supported FilterOperator such as a AttributeFilterOperator or a CompoundFilterOperator.
 * 
 * @example
 * The following would be a valid filterCriterion:
 * {op: '$or', criteria: [{op: '$eq', attribute: 'name', value: 'Bob'}, {op: '$gt', attribute: 'level', value: 'Low'}]}
 * 
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.FetchListParameters
 * @instance
 * @name filterCriterion
 * @type {oj.FilterOperator}
 * @ojsignature {target: "Type",
 *               value: "?FilterOperator<D>"}
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

/*jslint browser: true,devel:true*/
/**
 * The interface for oj.FetchListResult
 * 
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.FetchListResult
 * @ojsignature {target: "Type",
 *               value: "interface FetchListResult<K, D>"}
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
 *               value: "ItemMetadata<K>[]"}
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

/*jslint browser: true,devel:true*/
/**
 * The interface for oj.ItemMetadata
 * 
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.ItemMetadata
 * @ojsignature {target: "Type",
 *               value: "interface ItemMetadata<K>"}
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

/*jslint browser: true,devel:true*/

/**
 * The interface for oj.AttributeFilterOperator
 *
 * @ojstatus preview
 * @export
 * @interface oj.AttributeFilterOperator
 * @extends oj.FilterOperator
 * @since 5.0.0
 * @ojsignature {target: "Type",
 *               value: "interface AttributeFilterOperator<D>"}
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
 * @property {string} $co The entire operator value must be a substring of the attribute value for a match.
 * @property {string} $eq The attribute and operator values must be identical for a match.
 * @property {string} $ew The entire operator value must be a substring of the attribute value matching at the end of the attribute value.  This criterion is satisfied if the two strings are identical.     
 * @property {string} $pr If the attribute has a non-empty or non-null value, or if it contains a non-empty node for complex attributes, there is a match.
 * @property {string} $gt If the attribute value is greater than the operator value, there is a match.
 * @property {string} $ge If the attribute value is greater than or equal to the operator value, there is a match. 
 * @property {string} $lt If the attribute value is less than the operator value, there is a match.
 * @property {string} $le If the attribute value is less than or equal to the operator value, there is a match.
 * @property {string} $ne The attribute and operator values are not identical.  
 * @property {string} $regex If the attribute value satisfies the regular expression, there is a match.
 * @property {string} $sw The entire operator value must be a substring of the attribute value, starting at the beginning of the attribute value.  This criterion is satisfied if the two strings are identical.   
 * @since 5.0.0
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

/*jslint browser: true,devel:true*/

/**
 * The interface for oj.CompoundFilterOperator
 *
 * @ojstatus preview
 * @export
 * @interface oj.CompoundFilterOperator
 * @extends oj.FilterOperator
 * @since 5.0.0
 * @ojsignature {target: "Type",
 *               value: "interface CompoundFilterOperator<D>"}
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
 *               value: "FilterOperator<D>[]"}
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
 * @property {string} $and The filter is only a match if both expressions evaluate to true.
 * @property {string} $or The filter is a match if either expression evaluates to true.
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

/*jslint browser: true,devel:true*/

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @interface oj.DataProviderAddOperationEventDetail
 * @extends oj.DataProviderOperationEventDetail
 * @ojsignature {target: "Type",
 *               value: "interface DataProviderAddOperationEventDetail<K, D> extends DataProviderOperationEventDetail<K, D>"}
 */

/**
 * Optional keys of items located after the items involved in the operation. If null and
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
 * @ojsignature {target: "Type",
 *               value: "?Set<K>"}
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

/*jslint browser: true,devel:true*/

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
 *               value: "interface DataProviderMutationEventDetail<K, D>"}
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

/*jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @class oj.DataProviderMutationEvent
 * @implements Event
 * @classdesc Mutation event dispatched by oj.DataProvider
 * @param {oj.DataProviderMutationEventDetail} detail the event detail
 * @ojsignature [{target: "Type",
 *               value: "class DataProviderMutationEvent<K, D> implements Event"},
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

/*jslint browser: true,devel:true*/

/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @interface oj.DataProviderOperationEventDetail
 * @ojsignature {target: "Type",
 *               value: "interface DataProviderOperationEventDetail<K, D>"}
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
 *               value: "?ItemMetadata<K>[]"}
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

/*jslint browser: true,devel:true*/

/**
 * The oj.DataProviderRefreshEvent class
 * 
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @class oj.DataProviderRefreshEvent
 * @implements Event
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

/*jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @since 4.2.0
 * @export
 * @interface oj.DataProvider
 * @extends EventTarget
 * @ojsignature {target: "Type",
 *               value: "interface DataProvider<K, D> extends EventTarget"}
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
oj.DataProvider = function()
{
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
 *               value: "(FetchListParameters?): AsyncIterable<FetchListResult<K, D>>"}
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

/*jslint browser: true,devel:true*/

/**
 * The interface for oj.FetchByKeysCapability
 *
 * @ojstatus preview
 * @export
 * @interface oj.FetchByKeysCapability
 * @since 4.2.0
 * @ojsignature {target: "Type",
 *               value: "interface FetchByKeysCapability<D>"}
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

/*jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @export
 * @class oj.FetchByKeysMixin
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

/*jslint browser: true,devel:true*/

/**
 * The interface for oj.FetchByOffsetCapability
 *
 * @ojstatus preview
 * @export
 * @interface oj.FetchByOffsetCapability
 * @since 4.2.0
 * @ojsignature {target: "Type",
 *               value: "interface FetchByOffsetCapability<D>"}
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

/*jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @export
 * @class oj.FetchByOffsetMixin
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

/*jslint browser: true,devel:true*/
/**
 * The interface for oj.FetchByOffsetParameters
 * 
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.FetchByOffsetParameters
 * @extends oj.FetchListParameters
 * @ojsignature {target: "Type",
 *               value: "interface FetchByOffsetParameters<D> extends FetchListParameters<D>"}
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

/*jslint browser: true,devel:true*/

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

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/*jslint browser: true,devel:true*/

/**
 * The interface for oj.FilterOperator
 *
 * @ojstatus preview
 * @export
 * @interface oj.FilterOperator
 * @since 5.0.0
 * @ojsignature {target: "Type",
 *               value: "interface FilterOperator<D>"}
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

/*jslint browser: true,devel:true*/
/**
 * The interface for oj.Item
 * 
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @interface oj.Item
 * @ojsignature {target: "Type",
 *               value: "interface Item<K, D>"}
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

/*jslint browser: true,devel:true*/

/**
 * The interface for oj.SortCapability
 *
 * @ojstatus preview
 * @export
 * @interface oj.SortCapability
 * @since 4.2.0
 * @ojsignature {target: "Type",
 *               value: "interface SortCapability<D>"}
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

});