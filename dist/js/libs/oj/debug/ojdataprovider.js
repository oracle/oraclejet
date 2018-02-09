/**
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
 * @since 4.1.0
 * @deprecated This is deprecated.  Please use {@link oj.DataProvider} instead.
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
 * Return the total number of rows in this dataprovider
 * 
 * @ojstatus preview
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows. -1 is unknown row count.
 * @export
 * @expose
 * @memberof oj.IteratingDataProvider
 * @instance
 * @method
 * @name getTotalSize
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
 * @class oj.IteratingDataProviderMutationEvent
 * @implements Event
 * @since 4.1.0
 * @classdesc Mutation event dispatched by oj.IteratingDataProvider
 * @param {oj.IteratingDataProviderMutationEventDetail} detail the event detail
 * @deprecated This is deprecated.  Please use {@link oj.DataProviderMutationEvent} instead.
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
 * The interface for oj.FetchByOffsetCapability
 *
 * @ojstatus preview
 * @export
 * @interface oj.FetchByOffsetCapability
 * @since 4.2.0
 */

/**
 * The type of implementation for fetchByOffset method.  Possible values are:
 * <ul>
 * <li>"iteration": the implementation uses fetchFirst iteratively to find the result</li>
 * <li>"randomAccess": the implementation uses random access to find the result</li>
 * </ul>
 * 
 * @ojstatus preview
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
 * @since 4.1.0
 * @deprecated This is deprecated.  Please use {@link oj.DataProvider} instead.
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
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/*jslint browser: true,devel:true*/

/**
 * @ojstatus preview
 * @export
 * @interface oj.DataProviderOperationEventDetail
 * @since 4.2.0
 */

/**
 * keys of items involved in the operation
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.DataProviderOperationEventDetail
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
 * @memberof oj.DataProviderOperationEventDetail
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
 * @memberof oj.DataProviderOperationEventDetail
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
 * @memberof oj.DataProviderOperationEventDetail
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
 * @ojstatus preview
 * @export
 * @class oj.DataProviderMutationEvent
 * @implements Event
 * @since 4.2.0
 * @classdesc Mutation event dispatched by oj.DataProvider
 * @param {oj.DataProviderMutationEventDetail} detail the event detail
 */

/**
 * Event detail
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEvent
 * @instance
 * @name detail
 * @type {oj.DataProviderMutationEventDetail}
 */

/**
 * End of jsdoc
 */
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
}(GenericEvent));
IteratingDataProviderMutationEvent._DETAIL = 'detail';
oj.IteratingDataProviderMutationEvent = IteratingDataProviderMutationEvent;
oj['IteratingDataProviderMutationEvent'] = IteratingDataProviderMutationEvent;

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
 * The interface for oj.DataProvider
 * 
 * @ojstatus preview
 * @export
 * @interface oj.DataProvider
 * @extends EventTarget
 * @since 4.2.0
 */
oj.DataProvider = function()
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
 * @memberof oj.DataProvider
 * @instance
 * @method
 * @name fetchFirst
 */

/**
 * Determines whether this DataProvider supports a certain feature.
 * 
 * @ojstatus preview
 * @param {string} capabilityName capability name. Supported capability names are:
 *                  "fetchByKeys", "fetchByOffset", and "sort".
 * @return {Object} capability information or null if unsupported.
 * <ul>
 *   <li>If capabilityName is "fetchByKeys", returns a {@link oj.FetchByKeysCapability} object.</li>
 *   <li>If capabilityName is "fetchByOffset", returns a {@link oj.FetchByOffsetCapability} object.</li>
 *   <li>If capabilityName is "sort", returns a {@link oj.SortCapability} object.</li>
 * </ul>
 * @export
 * @expose
 * @memberof oj.DataProvider
 * @instance
 * @method
 * @name getCapability
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
 */

/**
 * Fetch rows by keys.
 * <p>
 * A generic implementation of this method is available from {@link oj.FetchByKeysMixin}.
 * It is for convenience and may not provide the most efficient implementation for your data provider.
 * Classes that implement the DataProvider interface are encouraged to provide a more efficient implementation.
 * </p>
 *
 * @ojstatus preview
 * @param {oj.FetchByKeysParameters} parameters fetch by key parameters
 * @return {Promise.<oj.FetchByKeysResults>} Returns Promise which resolves to {@link oj.FetchByKeysResults}.
 * @export
 * @expose
 * @memberof oj.DataProvider
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * Check if there are rows containing the specified keys.
 * <p>
 * A generic implementation of this method is available from {@link oj.FetchByKeysMixin}.
 * It is for convenience and may not provide the most efficient implementation for your data provider.
 * Classes that implement the DataProvider interface are encouraged to provide a more efficient implementation.
 * </p>
 *
 * @ojstatus preview
 * @param {oj.FetchByKeysParameters} parameters contains by key parameters
 * @return {Promise.<oj.ContainsKeysResults>} Returns Promise which resolves to {@link oj.ContainsKeysResults}.
 * @export
 * @expose
 * @memberof oj.DataProvider
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * Fetch rows by offset.
 * <p>
 * A generic implementation of this method is available from {@link oj.FetchByOffsetMixin}.
 * It is for convenience and may not provide the most efficient implementation for your data provider.
 * Classes that implement the DataProvider interface are encouraged to provide a more efficient implementation.
 * </p>
 *
 * @ojstatus preview
 * @param {oj.FetchByOffsetParameters} parameters fetch by offset parameters
 * @return {Promise.<oj.FetchByOffsetResults>} Returns Promise which resolves to {@link oj.FetchByOffsetResults}.
 * @export
 * @expose
 * @memberof oj.DataProvider
 * @instance
 * @method
 * @name fetchByOffset
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
 * @return {"yes" | "no" | "unknown"} string that indicates if this data provider is empty
 * @export
 * @expose
 * @memberof oj.DataProvider
 * @instance
 * @method
 * @name isEmpty
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
 * @interface oj.IteratingDataProviderAddOperationEventDetail
 * @extends oj.IteratingDataProviderOperationEventDetail
 * @since 4.1.0
 * @deprecated This is deprecated.  Please use {@link oj.DataProviderAddOperationEventDetail} instead.
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
 * @since 4.1.0
 * @deprecated This is deprecated.  Please use {@link oj.DataProvider} instead.
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
 * <p>If this is true, fetching the next block will likely return an empty array as the result.  A DataProvider can potentially make a stronger guarantee (if the DataProvider is running against an immutable repository or the DataProvider doesn’t attempt to retrieve a subsequent block if the DataProvider believes it is complete).  We don’t generally make the stronger guarantee since the repository may have been mutated since the previous response with done:true, such that new records would be returned.</p>
 * <p>If this is false, fetching the next block may or may not return an empty array as a result.</p>
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.FetchByOffsetResults
 * @instance
 * @name done
 * @type {boolean}
 * @deprecated This is deprecated.  Application can make another call to fetchByOffset with a new offset to find out if there are more items.
 */

 /**
  * end of jsdoc
  */

var FetchByKeysMixin = (function () {
    function FetchByKeysMixin() {
    }
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
                fetched += data.length;
                if (!foundAllKeys && !result['done']) {
                    if (limit != -1 && fetched >= limit) {
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
            var index = 1;
            while (this['_ojLastGetCapability' + index]) {
                ++index;
            }
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
 * @interface oj.IteratingDataProviderOperationEventDetail
 * @since 4.1.0
 * @deprecated This is deprecated.  Please use {@link oj.DataProviderOperationEventDetail} instead.
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
 * The interface for oj.SortCapability
 *
 * @ojstatus preview
 * @export
 * @interface oj.SortCapability
 * @since 4.2.0
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
 * @implements Event
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
 * @interface oj.DataProviderMutationEventDetail
 * @since 4.2.0
 */

/**
 * Optional add operation detail
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEventDetail
 * @instance
 * @name add
 * @type {oj.DataProviderAddOperationEventDetail}
 */

/**
 * Optional remove operation detail
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEventDetail
 * @instance
 * @name remove
 * @type {oj.DataProviderOperationEventDetail}
 */

/**
 * Optional update operation detail
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.DataProviderMutationEventDetail
 * @instance
 * @name update
 * @type {oj.DataProviderOperationEventDetail}
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
 * @since 4.1.0
 * @deprecated This is deprecated.  Please use {@link oj.DataProviderMutationEventDetail} instead.
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
 */

/**
 * The type of implementation for fetchByKeys and containsKeys methods.  Possible values are:
 * <ul>
 * <li>"iteration": the implementation uses fetchFirst iteratively to find the result</li>
 * <li>"lookup": the implementation uses direct lookup to find the result</li>
 * </ul>
 * 
 * @ojstatus preview
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
var FetchByOffsetMixin = (function () {
    function FetchByOffsetMixin() {
    }
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
            var index = 1;
            while (this['_ojLastGetCapability' + index]) {
                ++index;
            }
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


var DataProviderRefreshEvent = (function (_super) {
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
 * @ojstatus preview
 * @export
 * @interface oj.DataProviderAddOperationEventDetail
 * @extends oj.DataProviderOperationEventDetail
 * @since 4.2.0
 */

/**
 * Optional keys of items located after the items involved in the operation. If null and
 * index not specified then insert at the end.
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.DataProviderAddOperationEventDetail
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



var DataProviderMutationEvent = (function (_super) {
    __extends(DataProviderMutationEvent, _super);
    function DataProviderMutationEvent(detail) {
        var _this = this;
        var eventOptions = {};
        eventOptions[DataProviderMutationEvent._DETAIL] = detail;
        _this = _super.call(this, 'mutate', eventOptions) || this;
        return _this;
    }
    return DataProviderMutationEvent;
}(GenericEvent));
DataProviderMutationEvent._DETAIL = 'detail';
oj.DataProviderMutationEvent = DataProviderMutationEvent;
oj['DataProviderMutationEvent'] = DataProviderMutationEvent;



});
