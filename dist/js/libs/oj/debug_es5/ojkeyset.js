/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojkeysetimpl'], function(oj, KeySetImpl)
{
  "use strict";


/* global KeySetImpl:false, Set:false */

/**
 * An immutable set of keys.
 * @class KeySet
 *
 * @classdesc The base class for ExpandedKeySet and ExpandAllKeySet.  Represents an immutable set of keys.
 * @constructor
 * @hideconstructor
 * @abstract
 * @since 4.1.0
 * @ojsignature {target: "Type", value: "abstract class KeySet<K>", genericParameters: [{"name": "K", "description": "Type of Key"}]}
 */
var KeySet = function KeySet() {}; // Subclass from oj.Object


oj.Object.createSubclass(KeySet, oj.Object, 'KeySet'); // make it available internally

oj.KeySet = KeySet;
/**
 * Sets the internal Set object.
 *
 * @param {Set} set the internal Set object to replace with.
 * @protected
 */

KeySet.prototype.SetInternal = function (set) {
  this._keys = set;
};
/**
 * Returns a new KeySet based on this set with the specified keys included.
 *
 * @param {Set|Array} keys a set of keys to add to this KeySet.
 * @return {KeySet} a new KeySet with the specified keys included.
 * @method
 * @name add
 * @memberof KeySet
 * @instance
 * @abstract
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): KeySet<K>"}
 */

/**
 * Returns a new KeySet that signals all keys are added to this set.
 *
 * @return {KeySet} a new KeySet that signals all keys are added to this set.
 * @method
 * @name addAll
 * @memberof KeySet
 * @instance
 * @abstract
 * @ojsignature {target: "Type", value: "(): KeySet<K>"}
 */

/**
 * Returns a new KeySet based on this set with the specified keys excluded.
 *
 * @param {Set|Array} keys a set of keys to remove from this KeySet.
 * @return {KeySet} a new KeySet with the specified keys excluded.
 * @method
 * @name delete
 * @memberof KeySet
 * @instance
 * @abstract
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): KeySet<K>"}
 */

/**
 * Returns whether this set should include all keys.
 *
 * @return {boolean} true if this set should include all keys, false otherwise.
 * @method
 * @name isAddAll
 * @memberof KeySet
 * @instance
 * @abstract
 */

/**
 * Returns whether the specified key is contained in this set.
 *
 * @param {any} key the key to check whether it is contained in this set.
 * @return {boolean} true if the specified key is contained in this set, false otherwise.
 * @method
 * @name has
 * @memberof KeySet
 * @instance
 * @abstract
 * @ojsignature {target: "Type", value: "K", for: "key"}
 */

/**
 * Returns a new KeySet containing no keys.
 *
 * @return {KeySet} a new KeySet with no keys.
 * @method
 * @name clear
 * @memberof KeySet
 * @instance
 * @abstract
 * @ojsignature {target: "Type", value: "(): KeySet<K>"}
 */

/**
 * Adds or deletes a set of keys from the internal Set object.
 * @param {boolean} isAdd true if add operation, false if delete operation
 * @param {Set|Array} keys keys to add or delete
 * @return {KeySet} returns current KeySet if add or delete is not performed, or a new KeySet with the
 *                     specified keys included (add) or excluded (delete).
 * @protected
 */


KeySet.prototype.AddOrDeleteInternal = function (isAdd, keys) {
  var newSet;
  var keySet;
  newSet = isAdd ? this._add(keys) : this._remove(keys);

  if (newSet == null) {
    return this;
  }

  keySet =
  /** @type {KeySet} */
  Object.create(Object.getPrototypeOf(this));
  keySet.SetInternal(newSet);
  return keySet;
};
/**
 * Adds the specified keys to the internal Set object.
 * @param {Set|Array} keys a set of keys to add
 * @return {Set} a new Set based on this internal Set with the specified keys appended to the end, or null if nothing was added.
 * @private
 */


KeySet.prototype._add = function (keys) {
  var self = this;
  var newSet = null;
  keys.forEach(function (key) {
    // checks if it's already contained in the Set, can't use has() since it does a reference comparison
    if (key !== self.NOT_A_KEY && self.get(key) === self.NOT_A_KEY) {
      if (newSet == null) {
        newSet = self.Clone();
      }

      newSet.add(key);
    }
  });
  return newSet;
};
/**
 * Helper method to remove the specified keys from its set
 * @param {Set|Array} keys an interable set of keys to remove
 * @return {Set|null} a new Set based on this internal Set with the keys removed, or null if nothing is removed.
 * @private
 */


KeySet.prototype._remove = function (keys) {
  var self = this;
  var newSet = null;
  var keyToDelete; // first check if there's anything to remove

  if (this._keys.size === 0) {
    return null;
  }

  keys.forEach(function (key) {
    // see if we can find a equivalent key in this Set since delete does a reference comparison to find the item to delete
    keyToDelete = self.get(key);

    if (keyToDelete !== self.NOT_A_KEY) {
      if (newSet == null) {
        newSet = self.Clone();
      }

      newSet.delete(keyToDelete);
    }
  });
  return newSet;
};
/**
 * Returns the size of this Set.
 * @return {number} the size of this Set.
 * @protected
 */


KeySet.prototype.GetInternalSize = function () {
  return this._keys.size;
};
/**
 * Return a clone of the internal Set
 * @return {Set} the clone of the internal Set
 * @protected
 */


KeySet.prototype.Clone = function () {
  return new Set(this._keys);
};

KeySetImpl.call(KeySet.prototype);



/* global KeySet:false, ExpandAllKeySet:false */

/**
 * Create a new immutable KeySet containing the keys of the expanded items.
 * Use this KeySet when specifying individual keys to expand.
 *
 * @param {(Set|Array)=} keys A set of keys to initialize this KeySet with.
 *
 * @class ExpandedKeySet
 * @classdesc The ExpandedKeySet class contains a set of keys of the expanded items.  See
 * also the <a href="ObservableExpandedKeySet.html">observable</a> version of this class.
 * @extends {KeySet}
 * @constructor
 * @final
 * @since 4.1.0
 * @ojdeprecated {since: '7.0.0', description: 'Use KeySetImpl instead.'}
 * @ojsignature [{target: "Type", value: "class ExpandedKeySet<K> extends KeySet<K>", genericParameters: [{"name": "K", "description": "Type of Key"}]},
 *               {target: "Type", value: "Set<K>|Array<K>", for:"keys"}]
 * @example <caption>Creates a new ExpandedKeySet with an initial set of keys to expand:</caption>
 * require(['ojs/ojkeyset'],
 *   function(keySet) {
 *     var expandedKeySet = new keySet.ExpandedKeySet(['group1', 'group3']);
 *   }
 * );
 */
var ExpandedKeySet = function ExpandedKeySet(keys) {
  this.InitializeWithKeys(keys);
}; // Subclass from KeySet


oj.Object.createSubclass(ExpandedKeySet, KeySet, 'ExpandedKeySet'); // make it available internally

oj.ExpandedKeySet = ExpandedKeySet;
/**
 * Returns a new KeySet based on this set with the specified keys included.
 * If none of the keys specified are added then this KeySet is returned.
 *
 * @param {Set|Array} keys a set of keys to add to this KeySet.
 * @return {ExpandedKeySet} a new KeySet with the specified keys included.
 * @expose
 * @instance
 * @alias add
 * @memberof ExpandedKeySet
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): ExpandedKeySet<K>"}
 */

ExpandedKeySet.prototype.add = function (keys) {
  return (
    /** @type {!ExpandedKeySet} */
    this.AddOrDeleteInternal(true, keys)
  );
};
/**
 * Returns a new KeySet that signals all keys are added to this set.
 *
 * @return {ExpandAllKeySet} a new KeySet that signals all keys are added to this set.
 * @expose
 * @instance
 * @alias addAll
 * @memberof ExpandedKeySet
 * @ojsignature {target: "Type", value: "(): ExpandAllKeySet<K>"}
 */


ExpandedKeySet.prototype.addAll = function () {
  return new ExpandAllKeySet();
};
/**
 * Returns whether this set should include all keys.
 *
 * @return {boolean} true if this set includes all keys, false otherwise.
 * @expose
 * @instance
 * @alias isAddAll
 * @memberof ExpandedKeySet
 */


ExpandedKeySet.prototype.isAddAll = function () {
  return false;
};
/**
 * Returns a new KeySet based on this set with the specified keys excluded.
 * If none of the keys specified are deleted then this KeySet is returned.
 *
 * @param {Set|Array} keys a set of keys to remove from this KeySet.
 * @return {ExpandedKeySet} a new KeySet with the specified keys excluded.
 * @expose
 * @instance
 * @alias delete
 * @memberof ExpandedKeySet
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): ExpandedKeySet<K>"}
 */


ExpandedKeySet.prototype.delete = function (keys) {
  return (
    /** @type {!ExpandedKeySet} */
    this.AddOrDeleteInternal(false, keys)
  );
};
/**
 * Returns a new KeySet containing no keys.  If this KeySet already contains no keys then
 * the current KeySet is returned.
 *
 * @return {ExpandedKeySet} a new KeySet with no keys.
 * @expose
 * @instance
 * @alias clear
 * @memberof ExpandedKeySet
 * @ojsignature {target: "Type", value: "(): ExpandedKeySet<K>"}
 */


ExpandedKeySet.prototype.clear = function () {
  return this.GetInternalSize() === 0 ? this : new ExpandedKeySet();
};
/**
 * Returns whether the specified key is contained in this set.
 *
 * @param {any} key the key to check whether it is contained in this set.
 * @return {boolean} true if the specified key is contained in this set, false otherwise.
 * @expose
 * @instance
 * @alias has
 * @memberof ExpandedKeySet
 * @ojsignature {target: "Type", value: "K", for:"key"}
 */


ExpandedKeySet.prototype.has = function (key) {
  return this.get(key) !== this.NOT_A_KEY;
};
/**
 * Returns the keys in this KeySet in the order they are added.
 *
 * @return {Set} the keys in this KeySet in the order they are added.
 * @expose
 * @instance
 * @alias values
 * @memberof ExpandedKeySet
 * @ojsignature {target: "Type", value: "Set<K>", for:"returns"}
 */


ExpandedKeySet.prototype.values = function () {
  return this.Clone();
};



/* global KeySet:false, ExpandedKeySet:false */

/**
 * Create a new immutable KeySet containing the keys of the collapsed items.
 * Use this KeySet when expanding all keys.
 *
 *
 * @class ExpandAllKeySet
 * @classdesc The ExpandAllKeySet class represents a set with all keys expanded.
 * @extends {KeySet}
 * @constructor
 * @final
 * @since 4.1.0
 * @ojdeprecated {since: '7.0.0', description: 'Use AllKeySetImpl instead.'}
 * @ojsignature {target: "Type", value: "class ExpandAllKeySet<K> extends KeySet<K>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}]}
 * @example <caption>Creates a new ExpandAllKeySet to expand all keys</caption>
 * require(['ojs/ojkeyset'],
 *   function(keySet) {
 *     var expandAllKeySet = new keySet.ExpandAllKeySet();
 *   }
 * );
 */
var ExpandAllKeySet = function ExpandAllKeySet() {
  this.InitializeWithKeys(null);
}; // Subclass from KeySet


oj.Object.createSubclass(ExpandAllKeySet, KeySet, 'ExpandAllKeySet'); // make it available internally

oj.ExpandAllKeySet = ExpandAllKeySet;
/**
 * Returns a new KeySet with the specified keys excluded from a set of collapsed keys.
 * If the keys specified are already added then this KeySet is returned.
 *
 * @param {Set|Array} keys a set of keys to add to this KeySet.
 * @return {ExpandAllKeySet} a new KeySet with the specified keys included.
 * @expose
 * @instance
 * @alias add
 * @memberof! ExpandAllKeySet
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): ExpandAllKeySet<K>"}
 */

ExpandAllKeySet.prototype.add = function (keys) {
  // add keys on expand all = remove collapsed keys
  return (
    /** @type {!ExpandAllKeySet} */
    this.AddOrDeleteInternal(false, keys)
  );
};
/**
 * Returns a new KeySet that signals all keys are added to this set.  If this KeySet already
 * has all keys added, then this KeySet is returned.
 *
 * @return {ExpandAllKeySet} a new KeySet that signals all keys are added to this set.
 * @expose
 * @instance
 * @alias addAll
 * @memberof! ExpandAllKeySet
 * @ojsignature {target: "Type", value: "(): ExpandAllKeySet<K>"}
 */


ExpandAllKeySet.prototype.addAll = function () {
  return this.GetInternalSize() === 0 ? this : new ExpandAllKeySet();
};
/**
 * Returns whether this set should include all keys.
 *
 * @return {boolean} true if this set includes all keys, false otherwise.
 * @expose
 * @instance
 * @alias isAddAll
 * @memberof! ExpandAllKeySet
 */


ExpandAllKeySet.prototype.isAddAll = function () {
  return true;
};
/**
 * Returns a new KeySet based on this set with the specified keys included in a set of collapsed keys.
 * If the keys specified are already deleted then this KeySet is returned.
 *
 * @param {Set|Array} keys a set of keys to remove from this KeySet.
 * @return {ExpandAllKeySet} a new KeySet with the specified keys excluded.
 * @expose
 * @instance
 * @alias delete
 * @memberof! ExpandAllKeySet
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): ExpandAllKeySet<K>"}
 */


ExpandAllKeySet.prototype.delete = function (keys) {
  // remove keys on expand all = add collapsed keys
  return (
    /** @type {!ExpandAllKeySet} */
    this.AddOrDeleteInternal(true, keys)
  );
};
/**
 * Returns a new KeySet containing no keys.
 *
 * @return {ExpandedKeySet} a new KeySet with no keys.
 * @expose
 * @instance
 * @alias clear
 * @memberof! ExpandAllKeySet
 * @ojsignature {target: "Type", value: "(): ExpandedKeySet<K>"}
 */


ExpandAllKeySet.prototype.clear = function () {
  return new ExpandedKeySet();
};
/**
 * Returns whether the specified key is contained in this set.
 *
 * @param {any} key the key to check whether it is contained in this set.
 * @return {boolean} true if the specified key is contained in this set, false otherwise.
 * @expose
 * @instance
 * @alias has
 * @memberof! ExpandAllKeySet
 * @ojsignature {target: "Type", value: "K", for: "key"}
 */


ExpandAllKeySet.prototype.has = function (key) {
  return this.get(key) === this.NOT_A_KEY;
};
/**
 * Returns a set of keys of the collapsed items.
 *
 * @return {Set} the keys of the collapsed items.
 * @expose
 * @instance
 * @alias deletedValues
 * @memberof! ExpandAllKeySet
 * @ojsignature {target: "Type", value: "Set<K>", for: "returns"}
 */


ExpandAllKeySet.prototype.deletedValues = function () {
  return this.Clone();
};



/* global KeySet:false, AllKeySetImpl:false */

/**
 * Create a new immutable KeySet containing the keys of items.
 * Use this KeySet when specifying individual keys to select or expand.
 *
 * @param {(Set|Array)=} keys A set of keys to initialize this KeySet with.
 *
 * @class KeySetImpl
 * @classdesc The KeySetImpl class contains a set of keys of items.
 * @extends {KeySet}
 * @constructor
 * @final
 * @since 7.0.0
 * @ojsignature [{target: "Type", value: "class KeySetImpl<K> extends KeySet<K>", genericParameters: [{"name": "K", "description": "Type of Key"}]},
 *               {target: "Type", value: "Set<K>|Array<K>", for:"keys"}]
 * @example <caption>Creates a new KeySetImpl with an initial set of keys:</caption>
 * require(['ojs/ojkeyset'],
 *   function(keySet) {
 *     var KeySetImpl = new keySet.KeySetImpl(['item1', 'item3']);
 *   }
 * );
 */
var KeySetImpl = function KeySetImpl(keys) {
  this.InitializeWithKeys(keys);
}; // Subclass from KeySet


oj.Object.createSubclass(KeySetImpl, KeySet, 'KeySetImpl'); // make it available internally

oj.KeySetImpl = KeySetImpl;
/**
 * Returns a new KeySet based on this set with the specified keys included.
 * When a key is added to this KeySet it implies the key will become expanded (when this
 * is used for expansion) or selected (when this is used for selection).
 * If none of the keys specified are being added, then it will be a no-op and this KeySet is
 * returned.
 *
 * @param {Set|Array} keys a set of keys to add to this KeySet.
 * @return {KeySetImpl} a new KeySet with the specified keys included.
 * @expose
 * @instance
 * @alias add
 * @memberof KeySetImpl
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): KeySetImpl<K>"}
 */

KeySetImpl.prototype.add = function (keys) {
  return (
    /** @type {!KeySetImpl} */
    this.AddOrDeleteInternal(true, keys)
  );
};
/**
 * Returns a new KeySet that represents a set with all keys.  This will return a
 * AllKeySetImpl instance.
 *
 * @return {AllKeySetImpl} a new KeySet that represents a set with all keys.
 * @expose
 * @instance
 * @alias addAll
 * @memberof KeySetImpl
 * @ojsignature {target: "Type", value: "(): AllKeySetImpl<K>"}
 */


KeySetImpl.prototype.addAll = function () {
  return new AllKeySetImpl();
};
/**
 * Determines whether this is a set that represents all keys.  Since this KeySet
 * does not represent all keys, thie method will always return false.
 *
 * @return {boolean} true if this is a set that reprsents all keys, false otherwise.
 * @expose
 * @instance
 * @alias isAddAll
 * @memberof KeySetImpl
 */


KeySetImpl.prototype.isAddAll = function () {
  return false;
};
/**
 * Returns a new KeySet based on this set with the specified keys excluded.
 * When a key is removed from this KeySet it implies the key will become collapsed (when this
 * is used for expansion) or de-selected (when this is used for selection).
 * If none of the keys specified are being deleted, then this KeySet is returned.
 *
 * @param {Set|Array} keys a set of keys to remove from this KeySet.
 * @return {KeySetImpl} a new KeySet with the specified keys excluded.
 * @expose
 * @instance
 * @alias delete
 * @memberof KeySetImpl
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): KeySetImpl<K>"}
 */


KeySetImpl.prototype.delete = function (keys) {
  return (
    /** @type {!KeySetImpl} */
    this.AddOrDeleteInternal(false, keys)
  );
};
/**
 * Returns a new KeySet containing no keys.  Specifically, invoking clear will collapse all keys (
 * when this is used for expansion) or clear selection (when this is used for selection).
 * If this KeySet already contains no keys then it is a no-op and the current KeySet is returned.
 *
 * @return {KeySetImpl} a new KeySet with no keys.
 * @expose
 * @instance
 * @alias clear
 * @memberof KeySetImpl
 * @ojsignature {target: "Type", value: "(): KeySetImpl<K>"}
 */


KeySetImpl.prototype.clear = function () {
  return this.GetInternalSize() === 0 ? this : new KeySetImpl();
};
/**
 * Determines whether the specified key is in this set.
 * Specifically, this returns true if the key is expanded (when this is used for expansion)
 * or selected (when this is used for selection), and false otherwise.
 *
 * @param {any} key the key to check whether it is in this set.
 * @return {boolean} true if the specified key is in the set, false otherwise.
 * @expose
 * @instance
 * @alias has
 * @memberof KeySetImpl
 * @ojsignature {target: "Type", value: "K", for:"key"}
 */


KeySetImpl.prototype.has = function (key) {
  return this.get(key) !== this.NOT_A_KEY;
};
/**
 * Returns the keys in this KeySet in the order they are added.
 * Specifically, this returns a set of keys that are expanded (when this is used for expansion)
 * or selected (when this is used for selection).
 *
 * @return {Set} the keys in this KeySet in the order they are added.
 * @expose
 * @instance
 * @alias values
 * @memberof KeySetImpl
 * @ojsignature {target: "Type", value: "Set<K>", for:"returns"}
 */


KeySetImpl.prototype.values = function () {
  return this.Clone();
};



/* global KeySet:false, KeySetImpl:false */

/**
 * Create a new immutable KeySet that represents a set with all keys.
 * Use this KeySet to select or expand all keys.
 *
 * @class AllKeySetImpl
 * @classdesc The AllKeySetImpl class represents a set with all keys.
 * @extends {KeySet}
 * @constructor
 * @final
 * @since 7.0.0
 * @ojsignature {target: "Type", value: "class AllKeySetImpl<K> extends KeySet<K>", genericParameters: [{"name": "K", "description": "Type of Key"}]}
 * @example <caption>Creates a new AllKeySetImpl to select all keys</caption>
 * require(['ojs/ojkeyset'],
 *   function(keySet) {
 *     var AllKeySetImpl = new keySet.AllKeySetImpl();
 *   }
 * );
 */
var AllKeySetImpl = function AllKeySetImpl() {
  this.InitializeWithKeys(null);
}; // Subclass from KeySet


oj.Object.createSubclass(AllKeySetImpl, KeySet, 'AllKeySetImpl'); // make it available internally

oj.AllKeySetImpl = AllKeySetImpl;
/**
 * Returns a new KeySet with the specified keys included in the set.
 * When a key is added to this KeySet it implies the key will become expanded (when this
 * is used for expansion) or selected (when this is used for selection).
 * If the keys specified are already added then it will be a no-op and this KeySet is returned.
 *
 * @param {Set|Array} keys a set of keys to add to this KeySet.
 * @return {AllKeySetImpl} a new KeySet with the specified keys included.
 * @expose
 * @instance
 * @alias add
 * @memberof! AllKeySetImpl
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): AllKeySetImpl<K>"}
 */

AllKeySetImpl.prototype.add = function (keys) {
  // add keys on all = remove deleted keys
  return (
    /** @type {!AllKeySetImpl} */
    this.AddOrDeleteInternal(false, keys)
  );
};
/**
 * Returns a new KeySet that represents a set with all keys.  If this KeySet already is
 * a set with all keys, then this would just return itself.
 * Specifically, invoking addAll will cause all keys to be expanded (when this is used for
 * expansion) or selected (when this is used for selection).
 *
 * @return {AllKeySetImpl} a new KeySet that represents a set with all keys.
 * @expose
 * @instance
 * @alias addAll
 * @memberof! AllKeySetImpl
 * @ojsignature {target: "Type", value: "(): AllKeySetImpl<K>"}
 */


AllKeySetImpl.prototype.addAll = function () {
  return this.GetInternalSize() === 0 ? this : new AllKeySetImpl();
};
/**
 * Determines whether this is a set that represents all keys.  Since this KeySet represents
 * all keys, this method will always return true.
 *
 * @return {boolean} true if this is a set that reprsents all keys, false otherwise.
 * @expose
 * @instance
 * @alias isAddAll
 * @memberof! AllKeySetImpl
 */


AllKeySetImpl.prototype.isAddAll = function () {
  return true;
};
/**
 * Returns a new KeySet based on this set with the specified keys deleted.
 * When a key is removed from this KeySet it implies the key will become collapsed (when this
 * is used for expansion) or de-selected (when this is used for selection).
 * If the keys specified are already deleted then it will be a no-op and this KeySet is returned.
 *
 * @param {Set|Array} keys a set of keys to remove from this KeySet.
 * @return {AllKeySetImpl} a new KeySet with the specified keys excluded.
 * @expose
 * @instance
 * @alias delete
 * @memberof! AllKeySetImpl
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): AllKeySetImpl<K>"}
 */


AllKeySetImpl.prototype.delete = function (keys) {
  // remove keys on all = add to excluded keys
  return (
    /** @type {!AllKeySetImpl} */
    this.AddOrDeleteInternal(true, keys)
  );
};
/**
 * Returns a new KeySet containing no keys.  Specifically, invoking clear will collapse all keys (
 * when this is used for expansion) or clear selection (when this is used for selection).
 *
 * @return {KeySetImpl} a new KeySet with no keys.
 * @expose
 * @instance
 * @alias clear
 * @memberof! AllKeySetImpl
 * @ojsignature {target: "Type", value: "(): KeySetImpl<K>"}
 */


AllKeySetImpl.prototype.clear = function () {
  return new KeySetImpl();
};
/**
 * Determines whether the specified key is in this set.
 * Specifically, this returns true if the key is expanded (when this is used for expansion)
 * or selected (when this is used for selection), and false otherwise.
 *
 * @param {any} key the key to check whether it is in this set.
 * @return {boolean} true if the specified key is in this set, false otherwise.
 * @expose
 * @instance
 * @alias has
 * @memberof! AllKeySetImpl
 * @ojsignature {target: "Type", value: "K", for: "key"}
 */


AllKeySetImpl.prototype.has = function (key) {
  return this.get(key) === this.NOT_A_KEY;
};
/**
 * Returns a set of keys of the items that are excluded from this set.
 * Specifically, this returns a set of keys that are collapsed (when this is used for expansion)
 * or de-selected (when this is used for selection).
 *
 * @return {Set} the keys of the deleted items.
 * @expose
 * @instance
 * @alias deletedValues
 * @memberof! AllKeySetImpl
 * @ojsignature {target: "Type", value: "Set<K>", for: "returns"}
 */


AllKeySetImpl.prototype.deletedValues = function () {
  return this.Clone();
};



/* global AllKeySetImpl:false, KeySetImpl:false */

/**
 * Contains a set of utility methods for working with KeySet.
 * @class
 * @ignore
 * @tsignore
 */
var KeySetUtils = {};
/**
 * Converts a KeySet into an array
 */

KeySetUtils.toArray = function (keyset) {
  var arr;
  var set = keyset.isAddAll() ? keyset.deletedValues() : keyset.values();

  if (Array.from) {
    arr = Array.from(set);
  } else {
    // IE11 does not support Array.from
    arr = [];
    set.forEach(function (value) {
      arr.push(value);
    });
  }

  arr.inverted = keyset.isAddAll();
  return arr;
};
/**
 * Converts an array into a KeySet
 */


KeySetUtils.toKeySet = function (arr) {
  var keyset = null;

  if (arr.inverted) {
    keyset = new AllKeySetImpl();
    keyset = keyset.delete(arr);
  } else {
    keyset = new KeySetImpl();
    keyset = keyset.add(arr);
  }

  return keyset;
};

;return {
  'KeySet': KeySet,
  'ExpandedKeySet': ExpandedKeySet,
  'ExpandAllKeySet': ExpandAllKeySet,
  'KeySetImpl': KeySetImpl,
  'AllKeySetImpl': AllKeySetImpl,
  'KeySetUtils': KeySetUtils
}

});