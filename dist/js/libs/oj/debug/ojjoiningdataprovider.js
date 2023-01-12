/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojmap', 'ojs/ojset', 'ojs/ojeventtarget', 'ojs/ojlogger'], function (ojMap, ojSet, ojeventtarget, Logger) { 'use strict';

    ojMap = ojMap && Object.prototype.hasOwnProperty.call(ojMap, 'default') ? ojMap['default'] : ojMap;
    ojSet = ojSet && Object.prototype.hasOwnProperty.call(ojSet, 'default') ? ojSet['default'] : ojSet;

    /**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

    /* jslint browser: true,devel:true*/
    /**
     *
     * @since 10.0.0
     * @export
     * @final
     * @class JoiningDataProvider
     * @implements DataProvider
     * @classdesc
     * <p>JoiningDataProvider is a wrapping DataProvider that performs client-side joins
     * from a base data provider to other data providers and returns the joined records.
     * </p>
     * <p>Whenever possible, server-side joins are encouraged.  If FetchByKeysCapability.implementation
     * on joined DataProvider is not 'batchLookup', using JoiningDataProvider may encounter performance issue.
     * </p>
     * <p>
     * In addition to the base data provider's attributes, the fetch methods' parameter of a JoiningDataProvider
     *   can also take joined data providers' attributes in the 'attributes' option.  If no attributes are provided,
     *   all fields will be returned.
     * </p>
     * @param {DataProvider} baseDataProvider The base data provider.
     * <p>The metadata from this data provider will be the metadata for the JoiningDataProvider,
     * and all data from this data provider will be part of the data for the JoiningDataProvider.
     * </p>
     * <p>The resulting data for the JoiningDataProvider will be the set of attributes from the base data provider,
     * plus the set of attributes specified by the "joins" option.
     * Data returned by each data provider specified in the "joins" options will be merged into the JoiningDataProvider as an object.
     * </p>
     * @param {Object} options Options for the JoiningDataProvider.
     * @ojsignature [{target: "Type",
     *               value: "class JoiningDataProvider<K, D extends BD, BD> implements DataProvider<K, D>",
     *               genericParameters:[
     *                  {"name": "K", "description": "Type of key"},
     *                  {"name": "D", "description": "Type of returned data"},
     *                  {"name": "BD", "description": "Type of base data"}]},
     *               {target: "Type", value: "DataProvider<K, BD>", for: "baseDataProvider"},
     *               {target: "Type", value: "JoiningDataProvider.Options<D, BD> | JoiningDataProvider.DataProviderOptions<D, BD>", for: "options"}]
     * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "FetchByKeysParameters",
     *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults", "DataMapping",
     *   "FetchListResult","FetchListParameters", "FetchAttribute"]}
     * @ojtsmodule
     * @ojtsexample
     * let employee = [
     *   { id: 1001, departmentId: 2001, managerId: 1011, firstName: "Chris", lastName: "Black", title: "Software Engineer" },
     *   { id: 1011, departmentId: 2002, managerId: 1021, firstName: "Jenifer", lastName: "Cooper", title: "Manager" },
     *   { id: 1021, departmentId: 2003, managerId: 1031, firstName: "Kurt", lastName: "Jonhson", title: "VP" },
     *   { id: 1022, departmentId: 2003, managerId: 1031, firstName: "Mike", lastName: "Chrison", title: "VP", manager: { firstName: "Guangping", lastName: null } }
     * ];
     * let department = [
     *   { id: 2001, locationId: 1, VPId: 1021, name: "JET" },
     *   { id: 2002, locationId: 1, VPId: 1022, name: "Visual Builder" }
     * ];
     * let location = [
     *   { id: 1, city: "Redwood City", state: "California" }
     * ];
     *
     * // initialize basic DataProvider
     * let dpEmployee = new ArrayDataProvider(employee, { keyAttributes: 'id' });
     * let dpDepartment = new ArrayDataProvider(department, { keyAttributes: 'id' });
     * let dpLocation = new ArrayDataProvider(location, { keyAttributes: 'id' });
     *
     * // join for department
     * let locJoin = { foreignKeyMapping: { foreignKey: 'locationId' }, joinedDataProvider: dpLocation };
     * let VPJoin = { foreignKeyMapping: { foreignKey: 'VPId' }, joinedDataProvider: dpEmployee };
     * let dpJoinDepartment = new JoiningDataProvider(dpDepartment,
     *   { joins: { location: locJoin, VP: VPJoin } });
     *
     * let deptJoin = { foreignKeyMapping: { foreignKey: 'departmentId' }, joinedDataProvider: dpJoinDepartment };
     * let mgrJoin = { foreignKeyMapping: { foreignKey: 'managerId' }, joinedDataProvider: dpEmployee };
     *
     * let dpJoinEmployee = new JoiningDataProvider(dpEmployee,
     *   { joins: { manager: mgrJoin, department: deptJoin } });
     *
     * // Using joined dataprovider attributes for fetch methods
     * // The returned fields will include all fields from base data provider and department plus title from manager.
     * dpJoinEmployee.fetchByOffset({ offset: 0, attributes: ['manager.title'] });
     */

    /**
     * @typedef {Object} JoiningDataProvider.Options
     * @property {Object} joins - <p>A map of attribute name to information about DataProviders to join in.</p>
     * <p>The returned data for each row from the joined DataProvider will be merged as an object under the attribute name in the JoiningDataProvider.
     * </p>
     * @ojsignature [{target: "Type", value: "<D, BD>", for: "genericTypeParameters"},
     *               {target: "Type", value: "Record<keyof Omit<D, keyof BD>, DataProviderJoinInfo<D, any, any>>", for: "joins"}]
     */

    /**
     * @typedef {Object} JoiningDataProvider.DataProviderOptions
     * @property {Object} joins - <p>A map of attribute name to information about DataProviders to join in.</p>
     * <p>The returned data for each row from the joined DataProvider will be merged as an object under the attribute name in the JoiningDataProvider.
     * </p>
     * @ojsignature [{target: "Type", value: "<D, BD>", for: "genericTypeParameters"},
     *               {target: "Type", value: "Record<keyof Omit<D, keyof BD>, DataProviderJoinInfo<D, any, any>>", for: "joins"}]
     * @ojdeprecated {since: '10.1.0', description: 'Use type Options instead of object for options'}
     */

    /**
     * @inheritdoc
     * @memberof JoiningDataProvider
     * @instance
     * @method
     * @name containsKeys
     */

    /**
     * @inheritdoc
     * @memberof JoiningDataProvider
     * @instance
     * @method
     * @name createOptimizedKeySet
     */

    /**
     * @inheritdoc
     * @memberof JoiningDataProvider
     * @instance
     * @method
     * @name createOptimizedKeyMap
     */

    /**
     * Get an AsyncIterable object for iterating the data.
     * <p>
     * AsyncIterable contains a Symbol.asyncIterator method that returns an AsyncIterator.
     * AsyncIterator contains a “next” method for fetching the next block of data.
     * </p><p>
     * The "next" method returns a promise that resolves to an object, which contains a "value" property for the data and a "done" property
     * that is set to true when there is no more data to be fetched.  The "done" property should be set to true only if there is no "value"
     * in the result.  Note that "done" only reflects whether the iterator is done at the time "next" is called.  Future calls to "next"
     * may or may not return more rows for a mutable data source.
     * </p>
     * <p>
     * Please see the <a href="DataProvider.html#custom-implementations-section">DataProvider documentation</a> for
     * more information on custom implementations.
     * </p>
     *
     * @param {FetchListParameters=} params fetch parameters
     * @return {AsyncIterable.<FetchListResult>} AsyncIterable with {@link FetchListResult}
     * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
     * @export
     * @expose
     * @memberof JoiningDataProvider
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
     * @inheritdoc
     * @memberof JoiningDataProvider
     * @instance
     * @method
     * @name fetchByKeys
     */

    /**
     * @inheritdoc
     * @memberof JoiningDataProvider
     * @instance
     * @method
     * @name fetchByOffset
     */

    /**
     * @inheritdoc
     * @memberof JoiningDataProvider
     * @instance
     * @method
     * @name getCapability
     */

    /**
     * @inheritdoc
     * @memberof JoiningDataProvider
     * @instance
     * @method
     * @name getTotalSize
     */

    /**
     * @inheritdoc
     * @memberof JoiningDataProvider
     * @instance
     * @method
     * @name isEmpty
     */

    /**
     * @inheritdoc
     * @memberof JoiningDataProvider
     * @instance
     * @method
     * @name addEventListener
     */

    /**
     * @inheritdoc
     * @memberof JoiningDataProvider
     * @instance
     * @method
     * @name removeEventListener
     */

    /**
     * @inheritdoc
     * @memberof JoiningDataProvider
     * @instance
     * @method
     * @name dispatchEvent
     */

    // end of jsdoc

    class JoiningDataProvider {
        constructor(baseDataProvider, options) {
            var _a, _b;
            this.baseDataProvider = baseDataProvider;
            this.options = options;
            this._mapJoinAttributes = new Map();
            this._fks = [];
            this._transform = [];
            this._joinDPs = [];
            this.JoiningAsyncIterable = (_b = class {
                    constructor(_parent, params, _asyncIterator) {
                        this._parent = _parent;
                        this.params = params;
                        this._asyncIterator = _asyncIterator;
                        this[_a] = () => {
                            return new this._parent.JoiningAsyncIterator(this._parent, this._asyncIterator, this.params);
                        };
                    }
                },
                _a = Symbol.asyncIterator,
                _b);
            this.JoiningAsyncIterator = class {
                constructor(_parent, _baseIterator, _params) {
                    this._parent = _parent;
                    this._baseIterator = _baseIterator;
                    this._params = _params;
                }
                _fetchNext() {
                    var _b;
                    const signal = (_b = this._params) === null || _b === void 0 ? void 0 : _b.signal;
                    if (signal && signal.aborted) {
                        const reason = signal.reason;
                        return Promise.reject(new DOMException(reason, 'AbortError'));
                    }
                    return new Promise((resolve, reject) => {
                        if (signal) {
                            const reason = signal.reason;
                            signal.addEventListener('abort', (e) => {
                                return reject(new DOMException(reason, 'AbortError'));
                            });
                        }
                        return resolve(this._baseIterator.next().then((result) => {
                            return result;
                        }));
                    });
                }
                ['next']() {
                    const promise = this._fetchNext();
                    return promise.then((baseResult) => {
                        if (baseResult != undefined &&
                            baseResult.value != undefined &&
                            this._parent.options != undefined) {
                            return this._parent
                                ._joiningData(baseResult.value.data, this._parent.options)
                                .then((joinedData) => {
                                baseResult.value.data = joinedData;
                                return baseResult;
                            });
                        }
                        else {
                            return baseResult;
                        }
                    });
                }
            };
            this.FetchByKeysResults = class {
                constructor(_parent, fetchParameters, results) {
                    this._parent = _parent;
                    this.fetchParameters = fetchParameters;
                    this.results = results;
                    this[JoiningDataProvider._FETCHPARAMETERS] = fetchParameters;
                    this[JoiningDataProvider._RESULTS] = results;
                }
            };
            this.FetchByOffsetResults = class {
                constructor(_parent, fetchParameters, results, done) {
                    this._parent = _parent;
                    this.fetchParameters = fetchParameters;
                    this.results = results;
                    this.done = done;
                    this[JoiningDataProvider._FETCHPARAMETERS] = fetchParameters;
                    this[JoiningDataProvider._RESULTS] = results;
                    this[JoiningDataProvider._DONE] = done;
                }
            };
            this.Item = class {
                constructor(_parent, metadata, data) {
                    this._parent = _parent;
                    this.metadata = metadata;
                    this.data = data;
                    this[JoiningDataProvider._METADATA] = metadata;
                    this[JoiningDataProvider._DATA] = data;
                }
            };
            this.ItemMetadata = class {
                constructor(_parent, key) {
                    this._parent = _parent;
                    this.key = key;
                    this[JoiningDataProvider._KEY] = key;
                }
            };
            this._getJoinSpec(options);
        }
        fetchFirst(params) {
            const baseParams = params;
            if (params && params.attributes) {
                baseParams.attributes = this._seperateBaseJoinAttributes(params);
            }
            else {
                this._mapJoinAttributes = null;
            }
            const asyncIterable = this.baseDataProvider.fetchFirst(baseParams);
            return new this.JoiningAsyncIterable(this, params, asyncIterable[Symbol.asyncIterator]());
        }
        fetchByKeys(params) {
            let baseParams = params;
            if (params && params.attributes) {
                const baseAttributes = this._seperateBaseJoinAttributes(params);
                baseParams = {
                    keys: params.keys,
                    attributes: baseAttributes,
                    scope: params.scope
                };
            }
            else {
                this._mapJoinAttributes = null;
            }
            const signal = params === null || params === void 0 ? void 0 : params.signal;
            if (signal && signal.aborted) {
                const reason = signal.reason;
                return Promise.reject(new DOMException(reason, 'AbortError'));
            }
            return new Promise((resolve, reject) => {
                if (signal) {
                    const reason = signal.reason;
                    signal.addEventListener('abort', (e) => {
                        return reject(new DOMException(reason, 'AbortError'));
                    });
                }
                resolve(this.baseDataProvider.fetchByKeys(baseParams).then((baseResults) => {
                    const results = new ojMap();
                    if (baseResults != undefined && baseResults.results != undefined) {
                        const data = [];
                        const metaData = [];
                        const keyValues = [];
                        let i = 0;
                        params.keys.forEach((key) => {
                            keyValues[i] = key;
                            i++;
                        });
                        this._fetchByKeyResultsToArray(baseResults, keyValues, metaData, data);
                        return this._joiningData(data, this.options).then((joinData) => {
                            i = 0;
                            params.keys.forEach((key) => {
                                results.set(key, new this.Item(this, metaData[i], joinData[i]));
                                i++;
                            });
                            return new this.FetchByKeysResults(this, params, results);
                        });
                    }
                }));
            });
        }
        fetchByOffset(params) {
            let baseParams = params;
            if (params && params.attributes) {
                const baseAttributes = this._seperateBaseJoinAttributes(params);
                baseParams = {
                    attributes: baseAttributes,
                    clientId: params.clientId,
                    filterCriterion: params.filterCriterion,
                    offset: params.offset,
                    size: params.size,
                    sortCriteria: params.sortCriteria
                };
            }
            else {
                this._mapJoinAttributes = null;
            }
            const signal = params === null || params === void 0 ? void 0 : params.signal;
            if (signal && signal.aborted) {
                const reason = signal.reason;
                return Promise.reject(new DOMException(reason, 'AbortError'));
            }
            return new Promise((resolve, reject) => {
                if (signal) {
                    const reason = signal.reason;
                    signal.addEventListener('abort', (e) => {
                        return reject(new DOMException(reason, 'AbortError'));
                    });
                }
                return resolve(this.baseDataProvider
                    .fetchByOffset(baseParams)
                    .then((baseResult) => {
                    if (baseResult.results != undefined) {
                        const metaData = [];
                        const data = [];
                        for (let i = 0; i < baseResult.results.length; i++) {
                            metaData[i] = baseResult.results[i].metadata;
                            data[i] = baseResult.results[i].data;
                        }
                        const resultArray = [];
                        return this._joiningData(data, this.options).then((joinData) => {
                            for (let i = 0; i < baseResult.results.length; i++) {
                                resultArray[i] = new this.Item(this, metaData[i], joinData[i]);
                            }
                            return new this.FetchByOffsetResults(this, params, resultArray, baseResult.done);
                        });
                    }
                }));
            });
        }
        containsKeys(params) {
            return this.baseDataProvider.containsKeys(params).then((baseResults) => {
                return baseResults;
            });
        }
        getTotalSize() {
            return this.baseDataProvider.getTotalSize().then((totalSize) => {
                return totalSize;
            });
        }
        isEmpty() {
            return this.baseDataProvider.isEmpty();
        }
        getCapability(capabilityName) {
            if (capabilityName === 'sort' || capabilityName === 'filter') {
                return null;
            }
            else {
                return this.baseDataProvider.getCapability(capabilityName);
            }
        }
        createOptimizedKeySet(initialSet) {
            return new ojSet(initialSet);
        }
        createOptimizedKeyMap(initialMap) {
            if (initialMap) {
                const map = new ojMap();
                initialMap.forEach(function (value, key) {
                    map.set(key, value);
                });
                return map;
            }
            return new ojMap();
        }
        _getJoinSpec(options) {
            const joins = options.joins;
            this._joinAlias = Object.keys(joins);
            for (let i = 0; i < this._joinAlias.length; i++) {
                const alias = this._joinAlias[i];
                const joinInfo = joins[alias];
                if (joinInfo != undefined) {
                    if (joinInfo.foreignKeyMapping.foreignKey != undefined) {
                        this._fks[i] = joinInfo.foreignKeyMapping.foreignKey;
                    }
                    else if (joinInfo.foreignKeyMapping.foreignKeys != undefined) {
                        this._fks[i] = joinInfo.foreignKeyMapping.foreignKeys;
                    }
                    else {
                        this._fks[i] = null;
                    }
                    if (joinInfo.foreignKeyMapping.transform != undefined) {
                        this._transform[i] = joinInfo.foreignKeyMapping.transform;
                    }
                    else {
                        this._transform[i] = null;
                    }
                    this._joinDPs[i] = joinInfo.joinedDataProvider;
                }
                else {
                    this._fks[i] = null;
                    this._joinDPs[i] = null;
                }
            }
        }
        _seperateBaseJoinAttributes(params) {
            this._mapJoinAttributes = new Map();
            const origAttr = params.attributes;
            let iBase = 0;
            let baseAttributes = [];
            for (let attr of origAttr) {
                let alias;
                let attributes;
                if (attr instanceof String || typeof attr === 'string') {
                    alias = attr;
                    attributes = attr;
                }
                else {
                    alias = attr.name;
                    attributes = attr.attributes;
                }
                let bJoinAlias = false;
                for (let j = 0; this._joinAlias != null && j < this._joinAlias.length; j++) {
                    if (alias === this._joinAlias[j]) {
                        bJoinAlias = true;
                        break;
                    }
                }
                if (bJoinAlias) {
                    if (this._mapJoinAttributes.has(alias)) {
                        let joinAttrs = this._mapJoinAttributes.get(alias);
                        if (attributes != undefined) {
                            if (joinAttrs == undefined) {
                                joinAttrs = [];
                            }
                            joinAttrs = joinAttrs.concat(attributes);
                            this._mapJoinAttributes.set(alias, joinAttrs);
                        }
                    }
                    else {
                        this._mapJoinAttributes.set(alias, attributes);
                    }
                }
                else {
                    baseAttributes[iBase] = attributes;
                    iBase++;
                }
            }
            for (let k = 0; this._fks != null && k < this._fks.length; k++) {
                const fk = this._fks[k];
                if (!baseAttributes.includes(fk)) {
                    if (fk instanceof Array) {
                        baseAttributes = baseAttributes.concat(fk);
                    }
                    else {
                        baseAttributes[iBase] = this._fks[k];
                        iBase++;
                    }
                }
            }
            return baseAttributes;
        }
        _joiningData(baseData, options) {
            if (baseData == undefined || baseData.length == 0 || options.joins == undefined) {
                return Promise.resolve(baseData);
            }
            const fkValues = [];
            const promises = [];
            this._getFKValues(baseData, this._fks, this._transform, fkValues);
            for (let i = 0; i < this._joinAlias.length; i++) {
                const joinDP = this._joinDPs[i];
                const capability = joinDP.getCapability('fetchByKeys');
                if (capability == null || capability.implementation !== 'batchLookup') {
                    Logger.warn(`Warning: The joined data provider named '${this._joinAlias[i]}' does not support 'batchLookup' implementation for FetchByKeysCapability.`);
                }
                if (joinDP == null) {
                    promises[i] = null;
                }
                else {
                    if (this._mapJoinAttributes == null) {
                        promises[i] = joinDP.fetchByKeys({ keys: fkValues[i] });
                    }
                    else if (!this._mapJoinAttributes.has(this._joinAlias[i])) {
                        promises[i] = null;
                    }
                    else {
                        const attr = this._mapJoinAttributes.get(this._joinAlias[i]);
                        promises[i] = joinDP.fetchByKeys({
                            keys: fkValues[i],
                            attributes: attr
                        });
                    }
                }
            }
            return Promise.all(promises).then((results) => {
                const resultMetadata = [];
                const resultData = [];
                for (let i = 0; results != null && i < results.length; i++) {
                    if (this._mapJoinAttributes == null || this._mapJoinAttributes.has(this._joinAlias[i])) {
                        this._fetchByKeyResultsToArray(results[i], fkValues[i], resultMetadata, resultData);
                        this._assignAliasData(baseData, this._joinAlias[i], resultData);
                    }
                }
                return baseData;
            });
        }
        _getFKValues(baseData, fks, transform, fkValues) {
            for (let i = 0; i < fks.length; i++) {
                const vals = [];
                for (let j = 0; j < baseData.length; j++) {
                    if (baseData[j] != null && fks[i] != null) {
                        if (transform != undefined && transform[i] != undefined && transform[i] != null) {
                            const transformParam = new Object();
                            if (fks[i] instanceof Array) {
                                for (let fk of fks[i]) {
                                    transformParam[fk] = baseData[j][fk];
                                }
                            }
                            else {
                                transformParam[fks[i]] = baseData[j][fks[i]];
                            }
                            vals[j] = transform[i](transformParam);
                        }
                        else {
                            if (fks[i] instanceof Array) {
                                vals[j] = [];
                                for (let k = 0; k < fks[i].length; k++) {
                                    vals[j][k] = baseData[j][fks[i][k]];
                                }
                            }
                            else {
                                vals[j] = baseData[j][fks[i]];
                            }
                        }
                    }
                    else {
                        vals[j] = null;
                    }
                }
                fkValues[i] = vals;
            }
        }
        _fetchByKeyResultsToArray(result, keyValues, metaData, data) {
            if (result != undefined && result.results != undefined && result.results.size !== 0) {
                for (let i = 0; i < keyValues.length; i++) {
                    const item = result.results.get(keyValues[i]);
                    if (item != undefined) {
                        metaData[i] = item.metadata;
                        data[i] = item.data;
                    }
                    else {
                        metaData[i] = null;
                        data[i] = null;
                    }
                }
            }
        }
        _assignAliasData(baseData, alias, aliasData) {
            for (let i = 0; i < baseData.length; i++) {
                if (baseData[i] != null && aliasData != undefined) {
                    baseData[i][alias] = aliasData[i];
                }
            }
        }
    }
    JoiningDataProvider._REFRESH = 'refresh';
    JoiningDataProvider._MUTATE = 'mutate';
    JoiningDataProvider._ADDEVENTLISTENER = 'addEventListener';
    JoiningDataProvider._DATA = 'data';
    JoiningDataProvider._METADATA = 'metadata';
    JoiningDataProvider._FETCHPARAMETERS = 'fetchParameters';
    JoiningDataProvider._RESULTS = 'results';
    JoiningDataProvider._DONE = 'done';
    JoiningDataProvider._KEY = 'key';
    ojeventtarget.EventTargetMixin.applyMixin(JoiningDataProvider);

    return JoiningDataProvider;

});
