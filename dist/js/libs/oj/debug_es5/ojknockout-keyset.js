/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'knockout', 'ojs/ojkeyset'], function(oj, ko)
{
  "use strict";


/* global ko:false */

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
var ObservableExpandedKeySet = function ObservableExpandedKeySet(initialValue) {
  // by default if initialValue wasn't specified then we create an ExpandedKeySet
  var _initialValue = initialValue || new oj.ExpandedKeySet();

  var result = ko.observable(_initialValue);
  Object.setPrototypeOf(result, ObservableExpandedKeySet.proto);
  return result;
};

ObservableExpandedKeySet.proto = Object.create(ko.observable.fn); // mutation functions

ko.utils.arrayForEach(['add', 'addAll', 'clear', 'delete'], function (methodName) {
  ObservableExpandedKeySet.proto[methodName] = function () {
    // Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
    // (for consistency with mutating regular observables)
    var underlyingKeySet = this.peek();
    var methodCallResult = underlyingKeySet[methodName].apply(underlyingKeySet, arguments); // this should call valueWillMutate, update latestValue, valueHasMutate

    this(methodCallResult); // the mutation methods always return a new KeySet so we should return the ObservableExpandedKeySet itself

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



/* global ko:false */

/**
 * Create an observable version of a KeySet.
 *
 * @export
 * @param {KeySet=} initialValue The KeySet to observe.
 * @class ObservableKeySet
 * @classdesc Observable implementation of KeySet that keeps track of mutation of KeySet.
 * Since KeySet is immutable, all mutation methods return a new KeySet,
 * and therefore applications must update the associated attribute with the new KeySet.  The ObservableKeySet
 * provides a convenient way for applications to mutate the KeySet directly without the need to update the associated
 * attribute.
 * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["ExpandedKeySet", "ExpandAllKeySet", "KeySetImpl", "AllKeySetImpl"]}
 * @ojsignature [{target: "Type", value: "class ObservableKeySet<K>", genericParameters: [{"name": "K", "description": "Type of Key"}]},
 *               {target: "Type", value: "KeySetImpl<K>|AllKeySetImpl<K>", for:"initialValue"}]
 */
var ObservableKeySet = function ObservableKeySet(initialValue) {
  // by default if initialValue wasn't specified then we create a KeySetImpl
  var _initialValue = initialValue || new oj.KeySetImpl();

  var result = ko.observable(_initialValue);
  Object.setPrototypeOf(result, ObservableKeySet.proto);
  return result;
};

ObservableKeySet.proto = Object.create(ko.observable.fn); // mutation functions

ko.utils.arrayForEach(['add', 'addAll', 'clear', 'delete'], function (methodName) {
  ObservableKeySet.proto[methodName] = function () {
    // Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
    // (for consistency with mutating regular observables)
    var underlyingKeySet = this.peek();
    var methodCallResult = underlyingKeySet[methodName].apply(underlyingKeySet, arguments); // this should call valueWillMutate, update latestValue, valueHasMutate

    this(methodCallResult); // the mutation methods always return a new KeySet so we should return the ObservableKeySet itself

    return this;
  };
});
/**
 * Updates the observable with a KeySet that includes the specified keys.
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
 * Updates the observable with a KeySet that has all keys.
 *
 * @return {ObservableKeySet} this observable KeySet.
 * @method
 * @name addAll
 * @memberof ObservableKeySet
 * @instance
 * @ojsignature {target: "Type", value: "ObservableKeySet<K>", for: "returns"}
 */

/**
 * Updates the observable with a KeySet that contains no keys.
 *
 * @return {ObservableKeySet} this observable KeySet.
 * @method
 * @name clear
 * @memberof ObservableKeySet
 * @instance
 * @ojsignature {target: "Type", value: "ObservableKeySet<K>", for: "returns"}
 */

/**
 * Updates the observable with a KeySet that excludes the specified keys.
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

;return {
  'ObservableExpandedKeySet': ObservableExpandedKeySet,
  'ObservableKeySet': ObservableKeySet
}

});