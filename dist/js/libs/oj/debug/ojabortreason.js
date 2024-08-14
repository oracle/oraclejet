/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(function () { 'use strict';

	/**
	 * The AbortReason interface defines the exception contract that will be provided when JET components abort fetch requests.
	 *
	 * @since 17.0.0
	 * @export
	 * @interface AbortReason
	 * @extends DOMException
	 * @ojsignature {target: "Type", value: "interface AbortReason extends DOMException"}
	 * @classdesc The AbortReason interface defines the exception contract that will be provided when JET components abort fetch requests.
	 * @ojtsexample <caption>How to abort fetchByKeys</caption>
	 * // abort on an AbortController instance will abort all requests that are associated
	 * // with the signal from that abortController.
	 * const abortController = new AbortController();
	 * let keySet = new Set();
	 * keySet.add(1001);
	 * keySet.add(556);
	 * // component passes AbortSignal as part of FetchByKeysParameters to fetchByKeys
	 * // on dataProvider
	 * try {
	 *  let value = await dataprovider.fetchByKeys({keys: keySet, signal: abortController.signal});
	 * } catch (err) {
	 *  // if the data fetch has been aborted, retrieving data from the fetched result
	 *  // will be rejected with DOMException named AbortError
	 *  if (err.severity === 'info') {
	 *    // if the data fetch has been aborted from a jet component as a performance concern, an <u><a href="AbortReason.html">AbortReason</a></u> will be provided.
	 *    console.log(err.message);
	 *  }
	 * }
	 * // later when abort is desired, component can invoke abort() on the cached
	 * // abort controller to abort any outstanding data retrieval it requested
	 * // on asyncIterator.
	 * if (abort_is_desired) {
	 *   abortController.abort();
	 * }
	 */

	/**
	 * The level of severity of why the fetch was aborted.
	 *
	 * @since 17.0.0
	 * @export
	 * @expose
	 * @memberof AbortReason
	 * @instance
	 * @name severity
	 * @type {('error' | 'warn' | 'log' | 'info' | 'none')}
	 */

});
