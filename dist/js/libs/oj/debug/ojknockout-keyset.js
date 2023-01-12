/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'knockout', 'ojs/ojkeyset'], function (exports, ko, ojkeyset) { 'use strict';

    class ObservableExpandedKeySet {
        constructor(initialValue) {
            this._proto = Object.create(ko.observable.fn);
            const _initialValue = initialValue || new ojkeyset.ExpandedKeySet();
            const _result = ko.observable(_initialValue);
            const self = this;
            ko.utils.arrayForEach(['add', 'addAll', 'clear', 'delete'], function (methodName) {
                self._proto[methodName] = function () {
                    const underlyingKeySet = this.peek();
                    const methodCallResult = underlyingKeySet[methodName].apply(underlyingKeySet, arguments);
                    this(methodCallResult);
                    return this;
                };
            });
            Object.setPrototypeOf(_result, this._proto);
            return _result;
        }
    }

    /**
     * Create an observable version of a KeySet.
     *
     * @export
     * @param {(ExpandedKeySet|ExpandAllKeySet)=} initialValue The KeySet to observe.
     * @class ObservableExpandedKeySet
     * @classdesc Observable implementation of ExpandedKeySet that keeps track of mutation of KeySet.
     * Since KeySet is immutable, all mutation methods return a new KeySet,
     * and therefore applications must update the associated attribute with the new KeySet.  The ObservableExpandedKeySet
     * provides a convenient way for applications to mutate the KeySet directly without the need to update the associated
     * attribute.
     * @ojdeprecated {since: '7.0.0', description: 'Use ObservableKeySet instead.'}
     * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["ExpandedKeySet", "ExpandAllKeySet", "KeySetImpl", "AllKeySetImpl"]}
     * @ojsignature [{target: "Type", value: "class ObservableExpandedKeySet<K>", genericParameters: [{"name": "K", "description": "Type of Key"}]},
     *               {target: "Type", value: "ExpandedKeySet<K>|ExpandAllKeySet<K>", for:"initialValue"}]
     */

    /**
     * Updates the observable with a KeySet that includes the specified keys.
     *
     * @param {Set|Array} keys a set of keys to add to this KeySet.
     * @return {ObservableExpandedKeySet} this observable KeySet.
     * @method
     * @name add
     * @memberof ObservableExpandedKeySet
     * @instance
     * @ojsignature [{target: "Type", value: "Set<K>|Array<K>", for:"keys"},
     *               {target: "Type", value: "ObservableExpandedKeySet<K>", for: "returns"}]
     */

    /**
     * Updates the observable with a KeySet that has all keys.
     *
     * @return {ObservableExpandedKeySet} this observable KeySet.
     * @method
     * @name addAll
     * @memberof ObservableExpandedKeySet
     * @instance
     * @ojsignature {target: "Type", value: "ObservableExpandedKeySet<K>", for: "returns"}
     */

    /**
     * Updates the observable with a KeySet that contains no keys.
     *
     * @return {ObservableExpandedKeySet} this observable KeySet.
     * @method
     * @name clear
     * @memberof ObservableExpandedKeySet
     * @instance
     * @ojsignature {target: "Type", value: "ObservableExpandedKeySet<K>", for: "returns"}
     */

    /**
     * Updates the observable with a KeySet that excludes the specified keys.
     *
     * @param {Set|Array} keys a set of keys to remove from this KeySet.
     * @return {ObservableExpandedKeySet} this observable KeySet.
     * @method
     * @name delete
     * @memberof ObservableExpandedKeySet
     * @instance
     * @ojsignature [{target: "Type", value: "Set<K>|Array<K>", for:"keys"},
     *               {target: "Type", value: "ObservableExpandedKeySet<K>", for: "returns"}]
     */

    class ObservableKeySet {
        constructor(initialValue) {
            this._proto = Object.create(ko.observable.fn);
            const _initialValue = initialValue || new ojkeyset.KeySetImpl();
            const _result = ko.observable(_initialValue);
            const self = this;
            ko.utils.arrayForEach(['add', 'addAll', 'clear', 'delete'], function (methodName) {
                self._proto[methodName] = function () {
                    const underlyingKeySet = this.peek();
                    const methodCallResult = underlyingKeySet[methodName].apply(underlyingKeySet, arguments);
                    this(methodCallResult);
                    return this;
                };
            });
            Object.setPrototypeOf(_result, this._proto);
            return _result;
        }
    }

    /**
     * Creates an observable whose value is a KeySet.
     *
     * @export
     * @param {KeySet=} initialValue The KeySet to observe.
     * @class ObservableKeySet
     * @classdesc
     * Creates an <a href="https://knockoutjs.com/documentation/observables.html">observable</a> whose value is a <a href="KeySet.html">KeySet</a>.
     * <p>
     * Applications should use ObservableKeySet if they want to track or notify components to changes to a KeySet.
     * ObservableKeySet works just like an observable and it exposes a set of mutation methods that are similar to the
     * ones found in KeySet, which when invoked will update the underlying value in the observable with the updated KeySet.
     * This gives applications a convenient way to directly update KeySets which are designed to be immutable.
     * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["ExpandedKeySet", "ExpandAllKeySet", "KeySetImpl", "AllKeySetImpl"]}
     * @ojsignature [{target: "Type", value: "class ObservableKeySet<K>", genericParameters: [{"name": "K", "description": "Type of Key"}]},
     *               {target: "Type", value: "KeySetImpl<K>|AllKeySetImpl<K>", for:"initialValue"}]
     */
    /**
     * Equivalent to the <a href="KeySet.html#add">add</a> method on KeySet.  Calls add method on the underlying KeySet
     * and updates the observable with the returned KeySet.
     *
     * @param {Set|Array} keys a set of keys to add to this KeySet.
     * @return {ObservableKeySet} this observable KeySet.
     * @method
     * @name add
     * @memberof ObservableKeySet
     * @instance
     * @ojsignature [{target: "Type", value: "Set<K>|Array<K>", for:"keys"},
     *               {target: "Type", value: "ObservableKeySet<K>", for: "returns"}]
     */

    /**
     * Equivalent to the <a href="KeySet.html#addAll">addAll</a> method on KeySet.  Calls addAll method on the underlying KeySet
     * and updates the observable with the returned KeySet.
     *
     * @return {ObservableKeySet} this observable KeySet.
     * @method
     * @name addAll
     * @memberof ObservableKeySet
     * @instance
     * @ojsignature {target: "Type", value: "ObservableKeySet<K>", for: "returns"}
     */

    /**
     * Equivalent to the <a href="KeySet.html#clear">clear</a> method on KeySet.  Calls clear method on the underlying KeySet
     * and updates the observable with the returned KeySet.
     *
     * @return {ObservableKeySet} this observable KeySet.
     * @method
     * @name clear
     * @memberof ObservableKeySet
     * @instance
     * @ojsignature {target: "Type", value: "ObservableKeySet<K>", for: "returns"}
     */

    /**
     * Equivalent to the <a href="KeySet.html#delete">delete</a> method on KeySet.  Calls delete method on the underlying KeySet
     * and updates the observable with the returned KeySet.
     *
     * @param {Set|Array} keys a set of keys to remove from this KeySet.
     * @return {ObservableKeySet} this observable KeySet.
     * @method
     * @name delete
     * @memberof ObservableKeySet
     * @instance
     * @ojsignature [{target: "Type", value: "Set<K>|Array<K>", for:"keys"},
     *               {target: "Type", value: "ObservableKeySet<K>", for: "returns"}]
     */

    exports.ObservableExpandedKeySet = ObservableExpandedKeySet;
    exports.ObservableKeySet = ObservableKeySet;

    Object.defineProperty(exports, '__esModule', { value: true });

});
