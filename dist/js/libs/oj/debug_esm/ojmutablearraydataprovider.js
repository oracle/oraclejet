/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
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
 * @class MutableArrayDataProvider
 * @implements DataProvider
 * @classdesc This class implements {@link DataProvider}.
 *            Object representing data available from an array.
 *            This dataprovider can be used by [ListView]{@link oj.ojListView}, [NavigationList]{@link oj.ojNavigationList},
 *            [TabBar]{@link oj.ojTabBar}, and [Table]{@link oj.ojTable}.<br><br>
 *            See the MutableArrayDataProvider and Table - Base Table demos for examples.<br><br>
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
 * @param {Array=} data data supported by the components.
 *  <p>If the data array is frozen, it will be used by MutableArrayDataProvider directly.
 *  If it is not frozen, MutableArrayDataProvider will make a shallow copy and use the copy.
 *  Mutations to the original array will not be reflected in MutableArrayDataProvider.
 *  The only way to mutate the data in MutableArrayDataProvider is by setting the "data" property to another array.
 *  </p>
 * @param {MutableArrayDataProvider.Options=} options Options for the ArrayDataProvider
 * @ojsignature [{target: "Type",
 *               value: "class MutableArrayDataProvider<K, D> implements DataProvider<K, D>",
 *               genericTypeParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
 *               {target: "Type",
 *               value: "MutableArrayDataProvider.Options<D>",
 *               for: "options"}]
 *
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 * "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
 * "FetchListResult","FetchListParameters"]}
 * @ojtsmodule
 * @ojtsexample
 * // First initialize an array
 * let deptArray = [{DepartmentId: 10, DepartmentName: 'Administration', LocationId: 200},
 *                  {DepartmentId: 20, DepartmentName: 'Marketing', LocationId: 200},
 *                  {DepartmentId: 30, DepartmentName: 'Purchasing', LocationId: 200}];
 * // Then create an MutableArrayDataProvider object with the array
 * let dataprovider = new MutableArrayDataProvider(deptArray, {keyAttributes: 'DepartmentId'});
 * @example
 * // First initialize an array
 * let deptArray = [{DepartmentId: 10, DepartmentName: 'Administration', LocationId: 200},
 *                  {DepartmentId: 20, DepartmentName: 'Marketing', LocationId: 200},
 *                  {DepartmentId: 30, DepartmentName: 'Purchasing', LocationId: 200}];
 * // Then create an MutableArrayDataProvider object with the array
 * let dataprovider = new MutableArrayDataProvider(deptArray, {keyAttributes: 'DepartmentId'});
 */

/**
 * @typedef {Object} MutableArrayDataProvider.SortComparators
 * @property {Object} comparators - Sort comparators. Map of attribute to comparator function.
 * @ojsignature [
 *   {target: "Type", value: "<D>", for: "genericTypeParameters"},
 *   {target: "Type", value: "Map<keyof D, (a: any, b: any) => number>", for: "comparators"}]
 */

/**
 * <p>The underlying data array.
 * </p>
 * <p>Applications can get and set this property directly, such as setting it to a different array.
 * </p>
 * <p>The array returned by the "data" property is frozen.  Applications cannot call array mutation methods
 * such as splice or push on "data" directly.  Applications need to make a copy of the array, mutate the copy,
 * and set it back into the "data" property.
 * </p>
 * <p>When setting this property, MutableArrayDataProvider will shallow compare the new data array with
 * the existing data array to determine if it can fire "mutate" event with add/remove/update details.
 * It will fire the "refresh" event if it cannot make that determination (e.g. if the two arrays are vastly different.)
 * </p>
 * @since 10.0.0
 * @name data
 * @export
 * @expose
 * @memberof MutableArrayDataProvider
 * @instance
 * @property {D[]} data
 * @ojsignature {target: "Type", value: "D[]"}
 */

/**
 * @typedef {Object} MutableArrayDataProvider.Options
 * @property {MutableArrayDataProvider.SortComparators=} sortComparators - Optional sortComparator for custom sort.
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
 * This option is not used for cases where we want the MutableArrayDataProvider to apply a sort on initial fetch.
 * For those cases, please wrap in a ListDataProviderView and set the sortCriteria property on it.
 * @property {string=} keyAttributes - Optionally the field name which stores the key in the data. Can be a string denoting a single key attribute or an array
 *                                                  of strings for multiple key attributes. Please note that the ids in MutableArrayDataProvider must always be unique. Please do not introduce duplicate ids, even during temporary mutation operations. @index causes MutableArrayDataProvider to use index as key and @value will cause MutableArrayDataProvider to
 *                                                  use all attributes as key. @index is the default.
 * @property {string=} textFilterAttributes - Optionally specify which attributes the filter should be applied on when a TextFilter filterCriteria is specified. If this option is not specified then the filter will be applied to all attributes.
 * @ojsignature [
 *  {target: "Type", value: "<D>", for: "genericTypeParameters"},
 *  {target: "Type", value: "MutableArrayDataProvider.SortComparators<D>", for: "sortComparators"},
 *  {target: "Type", value: "Array<SortCriterion<D>>", for: "implicitSort"},
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
 *    let dateA = new Date(a).getTime();
 *    let dateB = new Date(b).getTime();
 *    return dateA > dateB ? 1 : -1;
 * };
 * // Then create an MutableArrayDataProvider object and set Date field to use the this comparator
 * this.dataprovider = new MutableArrayDataProvider(JSON.parse(deptArray), {
 *    keyAttributes: "DepartmentId",
 *    sortComparators: { comparators: new Map().set("Date", comparator) },
 * });
 * @ojtsexample
 * // Custom comparator for number
 * let comparator = function (a, b) {
 *    return a - b;
 *  };
 * // Then create an MutableArrayDataProvider object and set Salary field to use the this comparator
 * this.dataprovider = new MutableArrayDataProvider(JSON.parse(deptArray), {
 *    keyAttributes: "DepartmentId",
 *    sortComparators: { comparators: new Map().set("Salary", comparator) },
 * });
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name createOptimizedKeySet
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name createOptimizedKeyMap
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name fetchFirst
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 */

// end of jsdoc

const compareArrays = (oldArray, newArray) => {
    const statusNotInOld = 'added';
    const statusNotInNew = 'deleted';
    oldArray = oldArray || [];
    newArray = newArray || [];
    if (oldArray.length < newArray.length) {
        return compareSmallArrayToBigArray(oldArray, newArray, statusNotInOld, statusNotInNew);
    }
    else {
        return compareSmallArrayToBigArray(newArray, oldArray, statusNotInNew, statusNotInOld);
    }
};
const compareSmallArrayToBigArray = (smlArray, bigArray, statusNotInSml, statusNotInBig) => {
    const myMin = Math.min;
    const myMax = Math.max;
    const editDistanceMatrix = [];
    let smlIndex;
    const smlIndexMax = smlArray.length;
    let bigIndex;
    const bigIndexMax = bigArray.length;
    const compareRange = bigIndexMax - smlIndexMax || 1;
    const maxDistance = smlIndexMax + bigIndexMax + 1;
    let thisRow;
    let lastRow;
    let bigIndexMaxForRow;
    let bigIndexMinForRow;
    for (smlIndex = 0; smlIndex <= smlIndexMax; smlIndex++) {
        lastRow = thisRow;
        editDistanceMatrix.push((thisRow = []));
        bigIndexMaxForRow = myMin(bigIndexMax, smlIndex + compareRange);
        bigIndexMinForRow = myMax(0, smlIndex - 1);
        for (bigIndex = bigIndexMinForRow; bigIndex <= bigIndexMaxForRow; bigIndex++) {
            if (!bigIndex) {
                thisRow[bigIndex] = smlIndex + 1;
            }
            else if (!smlIndex) {
                thisRow[bigIndex] = bigIndex + 1;
            }
            else if (smlArray[smlIndex - 1] === bigArray[bigIndex - 1]) {
                thisRow[bigIndex] = lastRow[bigIndex - 1];
            }
            else {
                const northDistance = lastRow[bigIndex] || maxDistance;
                const westDistance = thisRow[bigIndex - 1] || maxDistance;
                thisRow[bigIndex] = myMin(northDistance, westDistance) + 1;
            }
        }
    }
    const editScript = [];
    let meMinusOne;
    const notInSml = [];
    const notInBig = [];
    for (smlIndex = smlIndexMax, bigIndex = bigIndexMax; smlIndex || bigIndex;) {
        meMinusOne = editDistanceMatrix[smlIndex][bigIndex] - 1;
        if (bigIndex && meMinusOne === editDistanceMatrix[smlIndex][bigIndex - 1]) {
            --bigIndex;
            notInSml.push((editScript[editScript.length] = {
                status: statusNotInSml,
                value: bigArray[bigIndex],
                index: bigIndex
            }));
        }
        else if (smlIndex && meMinusOne === editDistanceMatrix[smlIndex - 1][bigIndex]) {
            --smlIndex;
            notInBig.push((editScript[editScript.length] = {
                status: statusNotInBig,
                value: smlArray[smlIndex],
                index: smlIndex
            }));
        }
        else {
            --bigIndex;
            --smlIndex;
        }
    }
    return editScript.reverse();
};

class MutableArrayDataProvider {
    set data(value) {
        const oldData = this._data?.slice() ?? [];
        let newData;
        if (Array.isArray(value)) {
            if (Object.isFrozen(value)) {
                newData = value;
            }
            else {
                newData = value.slice();
                Object.freeze(newData);
            }
        }
        else {
            newData = value == undefined ? [] : [].concat(value);
        }
        if ((oldData.length === 0 && newData.length > 0) ||
            (newData.length === 0 && oldData.length > 0)) {
            this._keys = null;
            this._data = newData;
            this._impl.flushQueue();
            this._impl.resetTotalFilteredRowCount();
        }
        else {
            this._generateKeysIfNeeded(() => this._impl.generateKeys());
            this._data = newData;
            this._changes = compareArrays(oldData, this._data);
            if (this._changes != null && this._changes.length > 0) {
                this._impl.queueMutationEvent(this._changes);
                this._impl.flushQueue();
            }
        }
    }
    get data() {
        return this._data;
    }
    get dataChanges() {
        return this._changes;
    }
    constructor(_data = [], options) {
        this._data = _data;
        this.options = options;
        this._impl = new ArrayDataProviderImpl(options, {
            getData: () => this._data,
            getKeys: () => this._keys,
            generateKeysIfNeeded: (generateKeys) => this._generateKeysIfNeeded(generateKeys),
            mergeSortCriteria: (sortCriteria) => this._mergeSortCriteria(sortCriteria),
            getSortComparator: (sortCriteria) => this._getSortComparator(sortCriteria),
            dispatchEvent: (event) => this.dispatchEvent(event),
            supportAbortController: false,
            getKeyForDelete: (change, generatedKeys) => this._getKeyForDelete(change, generatedKeys),
            spliceKeys: (...args) => this._keys.splice(...args),
            keysSpecified: false
        });
        this.data = _data;
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
    _getKeyForDelete(change, generatedKeys) {
        return this._keys[change.index];
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
                if (comparator != null) {
                    const descendingResult = direction == 'descending' ? -1 : 1;
                    const comparatorResult = comparator(xval, yval) * descendingResult;
                    if (comparatorResult != 0) {
                        return comparatorResult;
                    }
                }
                else {
                    let compareResult = 0;
                    const strX = typeof xval === 'string' ? xval : new String(xval).toString();
                    const strY = typeof yval === 'string' ? yval : new String(yval).toString();
                    if (direction === 'ascending') {
                        if (strX === 'null' || strX === 'undefined') {
                            return 1;
                        }
                        if (strY === 'null' || strY === 'undefined') {
                            return -1;
                        }
                        compareResult = strX.localeCompare(strY, undefined, {
                            numeric: true,
                            sensitivity: 'base'
                        });
                    }
                    else {
                        if (strX === 'null' || strX === 'undefined') {
                            return -1;
                        }
                        if (strY === 'null' || strY === 'undefined') {
                            return 1;
                        }
                        compareResult = strY.localeCompare(strX, undefined, {
                            numeric: true,
                            sensitivity: 'base'
                        });
                    }
                    if (compareResult != 0) {
                        return compareResult;
                    }
                }
            }
            return 0;
        };
    }
    _mergeSortCriteria(sortCriteria) {
        if (sortCriteria && sortCriteria.length > 0) {
            return sortCriteria;
        }
        else {
            return this.options?.implicitSort;
        }
    }
}
EventTargetMixin.applyMixin(MutableArrayDataProvider);

export default MutableArrayDataProvider;
