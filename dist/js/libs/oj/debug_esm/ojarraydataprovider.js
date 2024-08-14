/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { SortUtils } from 'ojs/ojdataprovider';
import { EventTargetMixin } from 'ojs/ojeventtarget';
import { ArrayDataProviderImpl, getCapability, createOptimizedKeySet, createOptimizedKeyMap, getVal } from 'ojs/ojarraydataproviderimpl';

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
 * @final
 * @class ArrayDataProvider
 * @implements DataProvider
 * @classdesc This class implements {@link DataProvider}.
 *            Object representing data available from an array or observableArray. If a plain array is used then it is considered to be immutable.
 *            If an observableArray is used then for mutations, please use the observableArray functions or always call valueHasMutated() if
 *            mutating the underlying array. The decision on whether to use an array or observableArray should therefore be guided
 *            by whether the data will be mutable. This dataprovider can be used by [ListView]{@link oj.ojListView}, [NavigationList]{@link oj.ojNavigationList},
 *            [TabBar]{@link oj.ojTabBar}, and [Table]{@link oj.ojTable}.<br><br>
 *            See the ArrayDataProvider and Table - Base Table demos for examples.<br><br>
 *            The default sorting algorithm used when a sortCriteria is passed into fetchFirst is natural sort.
 *
 * <h3 id="events-section">
 *   Events
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
 * </h3>
 * Consumers can add event listeners to listen for the following event types and respond to data change.
 * <h4 id="event:mutate" class="name">
 *   mutate
 * </h4>
 * This event is fired when items have been added or removed from the data.
 * <p>
 * Event payload is found under <code class="prettyprint">event.detail</code>, which implements the {@link DataProviderMutationEventDetail} interface.
 * </p>
 *
 * <h4 id="event:refresh" class="name">
 *   refresh
 * </h4>
 * This event is fired when the data has been refreshed and components need to re-fetch the data.
 * <p>
 * This event contains no additional event payload.
 * </p>
 *
 * <i>Example of consumer listening for the "mutate" event type:</i>
 * <pre class="prettyprint"><code>let listener = function(event) {
 *   if (event.detail.remove) {
 *     const removeDetail = event.detail.remove;
 *     // Handle removed items
 *   }
 * };
 * dataProvider.addEventListener("mutate", listener);
 * </code></pre>
 *
 * @param {(Array|function():Array)} data data supported by the components
 *                                      <p>This can be either an Array, or a Knockout observableArray.</p>
 * @param {ArrayDataProvider.DeprecatedOptions=} options Options for the ArrayDataProvider
 * @ojsignature [{target: "Type",
 *               value: "class ArrayDataProvider<K, D> implements DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
 *               {target: "Type",
 *               value: "ArrayDataProvider.Options<K, D> | ArrayDataProvider.DeprecatedOptions<D>",
 *               for: "options"}
 * ]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 * "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
 * "FetchListResult","FetchListParameters"]}
 * @ojtsmodule
 * @ojtsexample
 * // First initialize an array
 * let deptArray = [{DepartmentId: 10, DepartmentName: 'Administration', LocationId: 200},
 *                  {DepartmentId: 20, DepartmentName: 'Marketing', LocationId: 200},
 *                  {DepartmentId: 30, DepartmentName: 'Purchasing', LocationId: 200}];
 * // Then create an ArrayDataProvider object with the array
 * let dataprovider = new ArrayDataProvider(deptArray, {keyAttributes: 'DepartmentId'});
 * @example
 * // First initialize an array
 * const deptArray = [{DepartmentId: 10, DepartmentName: 'Administration', LocationId: 200},
 *                  {DepartmentId: 20, DepartmentName: 'Marketing', LocationId: 200},
 *                  {DepartmentId: 30, DepartmentName: 'Purchasing', LocationId: 200}];
 * // Then create an ArrayDataProvider object with the array
 * const dataprovider = new ArrayDataProvider(deptArray, {keyAttributes: 'DepartmentId'});
 * @ojtsexample
 * // Data and Key array
 * let deptArray = [{DepartmentId: 10, DepartmentName: 'Administration', LocationId: 200},
 *                  {DepartmentId: 20, DepartmentName: 'Marketing', LocationId: 200},
 *                  {DepartmentId: 30, DepartmentName: 'Purchasing', LocationId: 200}];
 * let keysArray = [10, 20, 30];
 * let dataprovider = new ArrayDataProvider(deptArray, {keyAttributes: 'DepartmentId', keys: keysArray});
 * @example
 * // Data and Key array
 * const deptArray = [{DepartmentId: 10, DepartmentName: 'Administration', LocationId: 200},
 *                  {DepartmentId: 20, DepartmentName: 'Marketing', LocationId: 200},
 *                  {DepartmentId: 30, DepartmentName: 'Purchasing', LocationId: 200}];
 * const keysArray = [10, 20, 30];
 * const dataprovider = new ArrayDataProvider(deptArray, {keyAttributes: 'DepartmentId', keys: keysArray});
 */

/**
 * @typedef {Object} ArrayDataProvider.Options
 * @property {ArrayDataProvider.SortComparators=} sortComparators - Optional sortComparator for custom sort.
 * <p>
 * Sort follows JavaScript's localeCompare <code>{numeric: true}</code>.
 * Please check {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare#numeric_sorting|String.prototype.localeCompare()} for details.
 * </p>
 * <p>
 * For numbers, we convert them into strings then compare them with localeCompare, which may not sort floating point numbers based on their numeric values.
 * If you want to sort floating point numbers based on their numeric values, sortComparator can be used to do a custom sort.
 * </p>
 * <p>
 * For undefined and null values, they are considered as the largest values during sorting. For an empty string, it is considered as the smallest value during sorting.
 * </p>
 * @property {SortCriterion=} implicitSort - Optional array of {@link SortCriterion} used to specify sort information when the data loaded into the dataprovider is already sorted.
 * This is used for cases where we would like display some indication that the data is already sorted.
 * For example, ojTable will display the column sort indicator for the corresponding column in either ascending or descending order upon initial render.
 * This option is not used for cases where we want the ArrayDataProvider to apply a sort on initial fetch.
 * For those cases, please wrap in a ListDataProviderView and set the sortCriteria property on it.
 * @property {any=} keys - Optional keys for the data. If not supplied, then the keys are generated according options.keyAttributes. If that is also not supplied then index is used as key.
 *                                                 <p>If this option is specified, the caller is responsible for maintaining both the keys and data arrays to keep them in sync.
 *                                                 When the data need to be changed, the corresponding changes must be made to the keys array first before the data change.</p>
 * @property {string=} keyAttributes - Optionally the field name which stores the key in the data. Can be a string denoting a single key attribute or an array
 *                                                  of strings for multiple key attributes. Please note that the ids in ArrayDataProvider must always be unique. Please do not introduce duplicate ids, even during temporary mutation operations. @index causes ArrayDataProvider to use index as key and @value will cause ArrayDataProvider to
 *                                                  use all attributes as key. @index is the default.
 *                                                  <p>With "@index", the key generation is based on the item index only initially.  The key for an item, once assigned,
 *                                                  will not change even if the item index changes (e.g. by inserting/removing items from the array).  Assigned keys will
 *                                                  never be reassigned.  If the array is replaced with new items, the new items will be assigned keys that are different
 *                                                  from their indices.  In general, caller should specify keyAttributes whenever possible and should never assume that the
 *                                                  generated keys are the same as the item indices.</p>
 *                                                  <p>This option is ignored if the "keys" option is specified.</p>
 * @property {string=} textFilterAttributes - Optionally specify which attributes the filter should be applied on when a TextFilter filterCriteria is specified. If this option is not specified then the filter will be applied to all attributes.
 * @ojsignature [
 *  {target: "Type", value: "<K, D>", for: "genericTypeParameters"},
 *  {target: "Type", value: "ArrayDataProvider.SortComparators<D>", for: "sortComparators"},
 *  {target: "Type", value: "Array<SortCriterion<D>>", for: "implicitSort"},
 *  {target: "Type", value: "K[] | (() => K[])", for: "keys"},
 *  {target: "Type", value: "string | string[]", for: "keyAttributes"},
 *  {target: "Type", value: "string[]", for: "textFilterAttributes"},
 * ]
 * @ojtsexample <caption>Examples for sortComparator</caption>
 * // Custom comparator for date
 * let comparator = function (a, b) {
 *    if (a === b) {
 *      return 0;
 *    }
 *
 *    const dateA = new Date(a).getTime();
 *    const dateB = new Date(b).getTime();
 *    return dateA > dateB ? 1 : -1;
 * };
 * // Then create an ArrayDataProvider object and set Date field to use the this comparator
 * this.dataprovider = new ArrayDataProvider(JSON.parse(deptArray), {
 *    keyAttributes: "DepartmentId",
 *    sortComparators: { comparators: new Map().set("Date", comparator) },
 * });
 * @ojtsexample
 * // Custom comparator for number
 * let comparator = function (a, b) {
 *    return a - b;
 *  };
 * // Then create an ArrayDataProvider object and set Salary field to use the this comparator
 * this.dataprovider = new ArrayDataProvider(JSON.parse(deptArray), {
 *    keyAttributes: "DepartmentId",
 *    sortComparators: { comparators: new Map().set("Salary", comparator) },
 * });
 */

/**
 * @typedef {Object} ArrayDataProvider.DeprecatedOptions
 * @property {ArrayDataProvider.SortComparators=} sortComparators - Optional sortComparator to use for sort.
 * @property {SortCriterion=} implicitSort - Optional array of {@link SortCriterion} used to specify sort information when the data loaded into the dataprovider is already sorted.
 * This is used for cases where we would like display some indication that the data is already sorted.
 * For example, ojTable will display the column sort indicator for the corresponding column in either ascending or descending order upon initial render.
 * This option is not used for cases where we want the ArrayDataProvider to apply a sort on initial fetch.
 * For those cases, please wrap in a ListDataProviderView and set the sortCriteria property on it.
 * @property {any=} keys - Optional keys for the data. If not supplied, then the keys are generated according options.keyAttributes. If that is also not supplied then index is used as key.
 *                                                 <p>If this option is specified, the caller is responsible for maintaining both the keys and data arrays to keep them in sync.
 *                                                 When the data need to be changed, the corresponding changes must be made to the keys array first before the data change.</p>
 * @property {string=} idAttribute - <span class="important">Deprecated: this option is deprecated and will be removed in the future.
 *                                                  Please use the keyAttributes option instead.</span><br><br>
 *                                                  Optionally the field name which stores the id in the data. Can be a string denoting a single key attribute or an array
 *                                                  of strings for multiple key attributes. Dot notation can be used to specify nested attribute (e.g. 'attr.id'). Please note that the ids in ArrayDataProvider must always be unique. Please do not introduce duplicate ids, even during temporary mutation operations.
 *                                                  @index causes ArrayDataProvider to use index as key and @value will cause ArrayDataProvider to
 *                                                  use all attributes as key. @index is the default.
 * @property {string=} keyAttributes - Optionally the field name which stores the key in the data. Can be a string denoting a single key attribute or an array
 *                                                  of strings for multiple key attributes. Please note that the ids in ArrayDataProvider must always be unique. Please do not introduce duplicate ids, even during temporary mutation operations. @index causes ArrayDataProvider to use index as key and @value will cause ArrayDataProvider to
 *                                                  use all attributes as key. @index is the default.
 *                                                  <p>With "@index", the key generation is based on the item index only initially.  The key for an item, once assigned,
 *                                                  will not change even if the item index changes (e.g. by inserting/removing items from the array).  Assigned keys will
 *                                                  never be reassigned.  If the array is replaced with new items, the new items will be assigned keys that are different
 *                                                  from their indices.  In general, caller should specify keyAttributes whenever possible and should never assume that the
 *                                                  generated keys are the same as the item indices.</p>
 *                                                  <p>This option is ignored if the "keys" option is specified.</p>
 * @property {string=} textFilterAttributes - Optionally specify which attributes the filter should be applied on when a TextFilter filterCriteria is specified. If this option is not specified then the filter will be applied to all attributes.
 * @ojsignature [
 *  {target: "Type", value: "<D>", for: "genericTypeParameters"},
 *  {target: "Type", value: "ArrayDataProvider.SortComparators<D>", for: "sortComparators"},
 *  {target: "Type", value: "Array<SortCriterion<D>>", for: "implicitSort"},
 *  {target: "Type", value: "any", for: "keys"},
 *  {target: "Type", value: "string|string[]", for: "idAttribute"},
 *  {target: "Type", value: "string|string[]", for: "keyAttributes"},
 *  {target: "Type", value: "string[]", for: "textFilterAttributes"},
 * ]
 * @ojdeprecated {since: '10.1.0', description: 'Use type Options instead of object for options'}
 */

/**
 * @inheritdoc
 * @memberof ArrayDataProvider
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * @inheritdoc
 * @memberof ArrayDataProvider
 * @instance
 * @method
 * @name createOptimizedKeySet
 */

/**
 * @inheritdoc
 * @memberof ArrayDataProvider
 * @instance
 * @method
 * @name createOptimizedKeyMap
 */

/**
 * @inheritdoc
 * @memberof ArrayDataProvider
 * @instance
 * @method
 * @name fetchFirst
 */

/**
 * @inheritdoc
 * @memberof ArrayDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * @inheritdoc
 * @memberof ArrayDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * @inheritdoc
 * @memberof ArrayDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * @inheritdoc
 * @memberof ArrayDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * @inheritdoc
 * @memberof ArrayDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * @inheritdoc
 * @memberof ArrayDataProvider
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @inheritdoc
 * @memberof ArrayDataProvider
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @inheritdoc
 * @memberof ArrayDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 */

/**
 * A static method that determines whether this DataProvider defines a certain feature.
 *
 * @since 14.0.0
 * @param {string} capabilityName capability name. Defined capability names are:
 *                  "dedup", "eventFiltering", "fetchByKeys", "fetchByOffset", "fetchCapability", "fetchFirst", "filter", and "sort".
 * @return {Object} capability information or null if undefined
 * @export
 * @expose
 * @instance
 * @memberof ArrayDataProvider
 * @name getCapability
 * @static
 * @method
 * @ojsignature {target: "Type",
 *               value: "(capabilityName: string): any"}
 *
 */

class ArrayDataProvider {
    constructor(data, options) {
        this.data = data;
        this.options = options;
        this._subscribeObservableArray(data);
        let keysSpecified = false;
        if (options != null && options.keys != null) {
            keysSpecified = true;
            this._keys = options.keys;
        }
        this._impl = new ArrayDataProviderImpl({
            ...options,
            get keyAttributes() {
                return options?.keyAttributes ?? options?.idAttribute;
            }
        }, {
            getData: () => this._getRowData(),
            getKeys: () => this._getKeys(),
            generateKeysIfNeeded: (generateKeys) => this._generateKeysIfNeeded(generateKeys),
            mergeSortCriteria: (sortCriteria) => this._mergeSortCriteria(sortCriteria),
            getSortComparator: (sortCriteria) => this._getSortComparator(sortCriteria),
            dispatchEvent: (event) => this.dispatchEvent(event),
            supportAbortController: true,
            getKeyForDelete: (change, generatedKeys) => this._getKeyForDelete(change, generatedKeys),
            spliceKeys: (...args) => this._keys.splice(...args),
            keysSpecified
        });
    }
    containsKeys(containsParameters) {
        return this._impl.containsKeys(containsParameters);
    }
    fetchByKeys(fetchParameters) {
        return this._impl.fetchByKeys(fetchParameters);
    }
    fetchByOffset(params) {
        return this._impl.fetchByOffset(params);
    }
    fetchFirst(params) {
        return this._impl.fetchFirst(params);
    }
    getCapability(capabilityName) {
        return getCapability(capabilityName);
    }
    static getCapability(capabilityName) {
        return getCapability(capabilityName);
    }
    getTotalSize() {
        return this._impl.getTotalSize();
    }
    isEmpty() {
        return this._impl.isEmpty();
    }
    createOptimizedKeySet(initialSet) {
        return createOptimizedKeySet(initialSet);
    }
    createOptimizedKeyMap(initialMap) {
        return createOptimizedKeyMap(initialMap);
    }
    _getRowData() {
        return unwrapArrayIfNeeded(this.data);
    }
    _getKeys() {
        return unwrapArrayIfNeeded(this._keys);
    }
    _subscribeObservableArray(data) {
        if (!(data instanceof Array)) {
            if (!this._isObservableArray(data)) {
                throw new Error('Invalid data type. ArrayDataProvider only supports Array or observableArray.');
            }
            data['subscribe']((changes) => this._impl.queueMutationEvent(changes), null, 'arrayChange');
            data['subscribe']((changes) => this._impl.flushQueue(), null, 'change');
        }
    }
    _getKeyForDelete(change, generatedKeys) {
        let id = this._impl.getId(change.value);
        if (id == null) {
            if (generatedKeys) {
                id = change.index;
            }
            else {
                id = this._getKeys()[change.index];
            }
        }
        return id;
    }
    _isObservableArray(obj) {
        return typeof obj === 'function' && obj.subscribe && !(obj['destroyAll'] === undefined);
    }
    _generateKeysIfNeeded(generateKeys) {
        if (this._keys == null) {
            this._keys = generateKeys();
            return true;
        }
        return false;
    }
    _getSortComparator(sortCriteria) {
        return (x, y) => {
            const sortComparators = this.options != null ? this.options.sortComparators : null;
            let i, direction, attribute, comparator, xval, yval;
            for (i = 0; i < sortCriteria.length; i++) {
                direction = sortCriteria[i].direction;
                attribute = sortCriteria[i].attribute;
                comparator = null;
                if (sortComparators != null) {
                    comparator = sortComparators.comparators.get(attribute);
                }
                xval = getVal(x.value, attribute);
                yval = getVal(y.value, attribute);
                if (!comparator) {
                    comparator = SortUtils.getNaturalSortComparator();
                }
                const descendingResult = direction === 'descending' ? -1 : 1;
                const comparatorResult = comparator(xval, yval) * descendingResult;
                if (comparatorResult !== 0) {
                    return comparatorResult;
                }
            }
            return 0;
        };
    }
    _mergeSortCriteria(sortCriteria) {
        const implicitSort = this.options != null ? this.options.implicitSort : null;
        if (implicitSort != null) {
            if (sortCriteria == null) {
                return implicitSort;
            }
        }
        else {
            return sortCriteria;
        }
    }
}
const unwrapArrayIfNeeded = (arr) => {
    return arr && !(arr instanceof Array) ? arr() : arr;
};
EventTargetMixin.applyMixin(ArrayDataProvider);
oj._registerLegacyNamespaceProp('ArrayDataProvider', ArrayDataProvider);

export default ArrayDataProvider;
