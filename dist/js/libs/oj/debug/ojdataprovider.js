/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'ojs/ojeventtarget'], function(oj)
{
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
 * @interface oj.SortCriterion
 */

/**
 * sort attribute upon which the data should be sorted.
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.SortCriterion
 * @instance
 * @name attribute
 * @type {string}
 */

/**
 * sort direction, either "ascending" or "descending".
 * 
 * @ojstatus preview
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
 * @export
 * @interface oj.DataMapping
 * @ojsignature interface DataMapping <T>
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
 */

/**
 * SortCriterion mapping function which takes sortCriteria and returns the mapped sortCriteria
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.DataMapping
 * @instance
 * @name mapSortCriteria
 * @type {Function}
 */

/**
 * SortCriterion unmapping function which takes mapped sortCriteria and returns the unmapped sortCriteria
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.DataMapping
 * @instance
 * @name unmapSortCriteria
 * @type {Function}
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
 * @export
 * @ojsignature interface FetchFunc<T>
 */

/**
 * @ojsignature (FetchListParameters?): AsyncIterable<T>;
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
 * @export
 * @interface oj.FetchListParameters
 */

/**
 * Optional number of rows to fetch starting from offset.  If fewer than that number of rows exist, the fetch will succeed but be truncated.
 * 
 * @ojstatus preview
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
 * @export
 * @expose
 * @memberof oj.FetchListParameters
 * @instance
 * @name sortCriteria
 * @type {Array.<oj.SortCriterion>}
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
 * @export
 * @interface oj.FetchListResult
 */

/**
 * The {@link oj.FetchListParameters} used for the fetch call
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.FetchListResult
 * @instance
 * @name fetchParameters
 * @type {oj.FetchListParameters}
 */

/**
 * Array of data for each row
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.FetchListResult
 * @instance
 * @name data
 * @type {Array.<Object>}
 */

/**
 * Array of {link@ oj.ItemMetadata} for each row
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.FetchListResult
 * @instance
 * @name metadata
 * @type {Array.<oj.ItemMetadata>}
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
 * @export
 * @interface oj.ItemMetadata
 */

/**
 * The key for the row
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.ItemMetadata
 * @instance
 * @name key
 * @type {any}
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
 * The interface for oj.IteratingDataProvider
 * 
 * @ojstatus preview
 * @export
 * @interface oj.IteratingDataProvider
 * @extends EventTarget
 */
oj.IteratingDataProvider = function()
{
};

/**
 * Fetch the first block of data.
 * 
 * @ojstatus preview
 * @param {oj.FetchListParameters=} params fetch parameters
 * @return {AsyncIterable.<oj.FetchListResult>} AsyncIterable with {@link oj.FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof oj.IteratingDataProvider
 * @instance
 * @method
 * @name fetchFirst
 */

/**
 * Determines whether this DataProvider supports a certain feature.
 * 
 * @ojstatus preview
 * @param {string=} capabilityName capability name. If unspecified, 
 *                  returns all supported capabilities. Supported capability names are:
 *                  sort
 * @return {Object} capability information or null if unsupported
 * @export
 * @expose
 * @memberof oj.IteratingDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * End of jsdoc
 */
//# sourceMappingURL=FetchByOffset.js.map
//# sourceMappingURL=FetchByKeys.js.map
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
 * @class oj.IteratingDataProviderMutationEvent
 * @extends oj.GenericEvent
 * @classdesc Mutation event dispatched by oj.IteratingDataProvider
 * @param {oj.IteratingDataProviderMutationEventDetail} detail the event detail
 */

/**
 * Event detail
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.IteratingDataProviderMutationEvent
 * @instance
 * @name detail
 * @type {oj.IteratingDataProviderMutationEventDetail}
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
 * The interface for oj.FetchByKeys
 * 
 * @ojstatus preview
 * @export
 * @interface oj.FetchByKeys
 */

/**
 * Fetch rows by keys
 *
 * @ojstatus preview
 * @param {oj.FetchByKeysParameters} parameters fetch by key parameters
 * @return {Promise.<oj.FetchByKeysResults>} Returns Promise which resolves to {@link oj.FetchByKeysResults}.
 * @export
 * @expose
 * @memberof oj.FetchByKeys
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * Check if there are rows containing the specified keys
 *
 * @ojstatus preview
 * @param {oj.FetchByKeysParameters} parameters contains by key parameters
 * @return {Promise.<oj.ContainsKeysResults>} Returns Promise which resolves to {@link oj.ContainsKeysResults}.
 * @export
 * @expose
 * @memberof oj.FetchByKeys
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * The interface for oj.FetchByKeysParameters
 * 
 * @ojstatus preview
 * @export
 * @interface oj.FetchByKeysParameters
 */

/**
 * Keys for rows to fetch
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.FetchByKeysParameters
 * @instance
 * @name keys
 * @type {Set.<*>}
 */

/**
 * The interface for oj.FetchByKeysResults
 * 
 * @ojstatus preview
 * @export
 * @interface oj.FetchByKeysResults
 */

/**
 * The parameters used for the fetch call.
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.FetchByKeysResults
 * @instance
 * @name fetchParameters
 * @type {oj.FetchByKeysParameters}
 */

/**
 * Map of keys and corresponding {@link oj.Item}.
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.FetchByKeysResults
 * @instance
 * @name results
 * @type {Map.<*, oj.Item>}
 */

/**
 * The interface for oj.ContainsKeysResults
 * 
 * @ojstatus preview
 * @export
 * @interface oj.ContainsKeysResults
 */

/**
 * The parameters used for the containsKeys call.
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.ContainsKeysResults
 * @instance
 * @name containsParameters
 * @type {oj.FetchByKeysParameters}
 */

/**
 * Requested keys subset which are contained in the DataProvider.
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.ContainsKeysResults
 * @instance
 * @name results
 * @type {Set.<*>}
 */
//# sourceMappingURL=IteratingDataProvider.js.map
//# sourceMappingURL=IteratingDataProviderMutationEventDetail.js.map
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
 * @export
 * @interface oj.Item
 */

/**
 * The metadata for the item
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.Item
 * @instance
 * @name metadata
 * @type {oj.ItemMetadata}
 */

/**
 * The data for the item
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.Item
 * @instance
 * @name data
 * @type {Object}
 */

/**
 * End of jsdoc
 */

//# sourceMappingURL=ItemMetadata.js.map
//# sourceMappingURL=DataMapping.js.map
var IteratingDataProviderMutationEvent = (function (_super) {
    __extends(IteratingDataProviderMutationEvent, _super);
    function IteratingDataProviderMutationEvent(detail) {
        var _this = this;
        var eventOptions = {};
        eventOptions[IteratingDataProviderMutationEvent._DETAIL] = detail;
        _this = _super.call(this, 'mutate', eventOptions) || this;
        return _this;
    }
    return IteratingDataProviderMutationEvent;
}(oj.GenericEvent));
IteratingDataProviderMutationEvent._DETAIL = 'detail';
oj.IteratingDataProviderMutationEvent = IteratingDataProviderMutationEvent;
oj['IteratingDataProviderMutationEvent'] = IteratingDataProviderMutationEvent;
//# sourceMappingURL=IteratingDataProviderMutationEvent.js.map
//# sourceMappingURL=FetchListParameters.js.map
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
 * @interface oj.IteratingDataProviderAddOperationEventDetail
 * @extends oj.IteratingDataProviderOperationEventDetail
 */

/**
 * Optional keys of items located after the items involved in the operation. If null and
 * index not specified then insert at the end.
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.IteratingDataProviderAddOperationEventDetail
 * @instance
 * @name afterKeys
 * @type {Set.<*>}
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
 * The interface for oj.FetchByOffset
 * 
 * @ojstatus preview
 * @export
 * @interface oj.FetchByOffset
 */

/**
 * Fetch rows by offset
 *
 * @ojstatus preview
 * @param {oj.FetchByOffsetParameters} parameters fetch by offset parameters
 * @return {Promise.<oj.FetchByOffsetResults>} Returns Promise which resolves to {@link oj.FetchByOffsetResults}.
 * @export
 * @expose
 * @memberof oj.FetchByOffset
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * The interface for oj.FetchByOffsetParameters
 * 
 * @ojstatus preview
 * @export
 * @interface oj.FetchByOffsetParameters
 * @extends oj.FetchListParameters
 */

/**
 * The offset used for the fetch call.
 * 
 * @ojstatus preview
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
 * @export
 * @interface oj.FetchByOffsetResults
 */

/**
 * The parameters used for the fetch call.
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.FetchByOffsetResults
 * @instance
 * @name fetchParameters
 * @type {oj.FetchByOffsetParameters}
 */


/**
 * Array of {@link oj.Item}.
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.FetchByOffsetResults
 * @instance
 * @name results
 * @type {Array.<oj.Item>}
 */

/**
 * Indicates whether there are more items which can be fetched.
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.FetchByOffsetResults
 * @instance
 * @name done
 * @type {boolean}
 */
//# sourceMappingURL=IteratingDataProviderOperationEventDetail.js.map
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
 * @interface oj.IteratingDataProviderOperationEventDetail
 */

/**
 * keys of items involved in the operation
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.IteratingDataProviderOperationEventDetail
 * @instance
 * @name keys
 * @type {Set.<*>}
 */

/**
 * Optional metadata of items involved in the operation
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.IteratingDataProviderOperationEventDetail
 * @instance
 * @name metadata
 * @type {ItemMetadata.<Object>}
 */

/**
 * Optional data of items involved in the operation
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.IteratingDataProviderOperationEventDetail
 * @instance
 * @name data
 * @type {Array.<Object>}
 */

/**
 * Optional indexes of items involved in the operation
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.IteratingDataProviderOperationEventDetail
 * @instance
 * @name indexes
 * @type {Array.<number>}
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
 * The oj.DataProviderRefreshEvent class
 * 
 * @ojstatus preview
 * @export
 * @class oj.DataProviderRefreshEvent
 * @extends oj.GenericEvent
 * @classdesc Refresh Event dispatched by the DataProvider. This event is fired when
 * the data has been refreshed and components need to re-fetch the data.
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
 * This interface specifies as one atomic event all the mutation operations which
 * occurred. The keys for each operation must be disjoint from each other, e.g. for example
 * an add and remove cannot occur on the same item. In addition, any indexes specified must
 * be monotonically increasing.
 * 
 * @ojstatus preview
 * @export
 * @interface oj.IteratingDataProviderMutationEventDetail
 */

/**
 * Optional add operation detail
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.IteratingDataProviderMutationEventDetail
 * @instance
 * @name add
 * @type {oj.IteratingDataProviderAddOperationEventDetail}
 */

/**
 * Optional remove operation detail
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.IteratingDataProviderMutationEventDetail
 * @instance
 * @name remove
 * @type {oj.IteratingDataProviderOperationEventDetail}
 */

/**
 * Optional update operation detail
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.IteratingDataProviderMutationEventDetail
 * @instance
 * @name update
 * @type {oj.IteratingDataProviderOperationEventDetail}
 */

/**
 * End of jsdoc
 */
//# sourceMappingURL=Item.js.map
var DataProviderRefreshEvent = (function (_super) {
    __extends(DataProviderRefreshEvent, _super);
    function DataProviderRefreshEvent() {
        return _super.call(this, 'refresh') || this;
    }
    return DataProviderRefreshEvent;
}(oj.GenericEvent));
oj.DataProviderRefreshEvent = DataProviderRefreshEvent;
oj['DataProviderRefreshEvent'] = DataProviderRefreshEvent;
//# sourceMappingURL=DataProviderRefreshEvent.js.map
//# sourceMappingURL=IteratingDataProviderAddOperationEventDetail.js.map
//# sourceMappingURL=FetchListResult.js.map
//# sourceMappingURL=FetchFunc.js.map
//# sourceMappingURL=SortCriterion.js.map
});
