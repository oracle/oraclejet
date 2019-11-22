/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj)
{
  "use strict";




/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 *
 * @since 5.1.0
 * @export
 * @interface oj.TreeDataProvider
 * @ojtsmodule
 * @extends oj.DataProvider
 * @ojsignature {target: "Type",
 *               value: "interface TreeDataProvider<K, D> extends DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @classdesc
 * TreeDataProvider is the basic interface for getting runtime data which JET components that display hierarchical list of items (such as [oj-tree-view]{@link oj.ojTreeView}) can use.
 * <p>
 * This interface extends DataProvider, with the addition of a <code class="prettyprint">getChildDataProvider</code> method.
 * </p><p>
 * Unless otherwise noted, all methods operate on the set of sibling items with the same parent.
 * For example, <code class="prettyprint">fetchFirst</code> returns an iterable for the sibling items with the same parent; <code class="prettyprint">getTotalSize</code> returns a promise that
 * resolves to the number of items with the same parent.
 * </p><p>
 * To retrieve the children of an item, consumers use the <code class="prettyprint">getChildDataProvider</code> method to get another TreeDataProvider for the children of that item.
 * </p><p>
 * JET provides some implementations of this interface, such as {@link oj.ArrayTreeDataProvider}.
 * </p><p>
 * Applications can also create their own implementations of this interface and use them with JET components that support it.  For example, an application can create a TreeDataProvider implementation
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
 * All events should be fired at the root-level TreeDataProvider instance, so that consumers only need to add one listener for the entire tree.
 * Events should not be fired at child-level TreeDataProvider returned by getChildDataProvider, as there is no bubbling support for DataProvider events.
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
 *
 * <h3 id="events-section">
 *   Filtering
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
 * </h3>
 * If the TreeDataProvider instance returns a FetchCapability object when getCapability() is called
 * for capabilityName "filter" then filtering is defined. Note that it is up to the TreeDataProvider
 * implementation to define the exact behavior of filtering and whether the DataProvider instances returned
 * by getChildDataProvider() define filtering as well. For example, filtering may only be defined at the
 * root TreeDataProvider and the DataProviders returned by getChildDataProvider() would already be
 * filtered. Or filtering may be defined the lower levels which indicates that they can be filtered.
 * It is expected that in most cases the filterCriterion will be applied to leaf nodes of the TreeDataProvider.
 */
oj.TreeDataProvider = function () {}; // mapping variable definition, used in a no-require environment. Maps the oj.TreeDataProvider function object to the name used in the require callback.
// eslint-disable-next-line no-unused-vars


var TreeDataProvider = oj.TreeDataProvider;
/**
 * Get the data provider for the children of the row identified by parentKey.
 *
 *
 * @since 5.1.0
 * @param {any} parentKey key of the row to get child data provider for.
 * @return {TreeDataProvider | null} A TreeDataProvider if the row can (but doesn't have to) have children; or null if the row cannot have children.
 *   Use the <code class="prettyprint">isEmpty</code> method on the returned TreeDataProvider to determine if it currently has children.
 * @export
 * @expose
 * @memberof oj.TreeDataProvider
 * @instance
 * @method
 * @name getChildDataProvider
 * @ojsignature {target: "Type",
 *               value: "(parentKey: K): TreeDataProvider<K, D> | null"}
 */

/**
 * End of jsdoc
 */

  ;return oj.TreeDataProvider;
});