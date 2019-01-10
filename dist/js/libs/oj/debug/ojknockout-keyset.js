/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout', 'ojs/ojkeyset'], function(oj, ko)
{
/* global ko:false */

/**
 * Create an observable version of a KeySet.
 *
 * @export
 * @param {(ExpandedKeySet|ExpandAllKeySet)=} initialValue The KeySet to observe.
 * @class ObservableExpandedKeySet
 * @classdesc Observable implementation of ExpandedKeySet that keeps track of mutation of KeySet.
 * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["ExpandedKeySet", "ExpandAllKeySet"]}
 * @ojsignature [{target: "Type", value: "class ObservableExpandedKeySet<K>", genericParameters: [{"name": "K", "description": "Type of Key"}]},
 *               {target: "Type", value: "ExpandedKeySet<K>|ExpandAllKeySet<K>", for:"initialValue"}]
 */
var ObservableExpandedKeySet = function (initialValue) {
  // by default if initialValue wasn't specified then we create an ExpandedKeySet
  var _initialValue = initialValue || new oj.ExpandedKeySet();

  var result = ko.observable(_initialValue);
  Object.setPrototypeOf(result, ObservableExpandedKeySet.proto);
  return result;
};

ObservableExpandedKeySet.proto = Object.create(ko.observable.fn);

// mutation functions
ko.utils.arrayForEach(['add', 'addAll', 'clear', 'delete'], function (methodName) {
  ObservableExpandedKeySet.proto[methodName] = function () {
    // Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
    // (for consistency with mutating regular observables)
    var underlyingKeySet = this.peek();
    var methodCallResult = underlyingKeySet[methodName].apply(underlyingKeySet, arguments);
    // this should call valueWillMutate, update latestValue, valueHasMutate
    this(methodCallResult);

    // the mutation methods always return a new KeySet so we should return the ObservableExpandedKeySet itself
    return this;
  };
});

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

;return {
  'ObservableExpandedKeySet': ObservableExpandedKeySet
}

});