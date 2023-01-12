/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import KeySetImpl$1 from 'ojs/ojkeysetimpl';

/**
 * A set of unique keys that will not change once it's created.  It contains mutation methods that will create a copy of this set.
 * @export
 * @interface ImmutableKeySet
 * @classdesc A set of unique keys that will not change once it's created.  It contains mutation methods that will create a copy of this set.
 * @since 14.0.0
 * @ojsignature {target: "Type", value: "interface ImmutableKeySet<K>", genericParameters: [{"name": "K", "description": "Type of Key"}]}
 */

/**
 * @typedef {Object} ImmutableKeySet.ImmutableSet<V> An immutable Set of unique values.
 * @ojsignature {target: "Type",
 *               value: "{ size: number; has(value: V): boolean; values(): IterableIterator<V>; }"}
 */

/**
 * An object that contains either set of keys or set of deleted keys depending on whether or not this set represents all keys.
 *
 * @since 14.0.0
 * @export
 * @expose
 * @memberof ImmutableKeySet
 * @instance
 * @name keys
 * @readonly
 * @type {any}
 * @ojsignature {target: "Type",
 *               value: "{ all: true, keys?: never, deletedKeys: ImmutableKeySet.ImmutableSet<K>} | {all: false, keys: ImmutableKeySet.ImmutableSet<K>, deletedKeys?: never }"}
 */

/**
 * Returns a new ImmutableKeySet based on this set with the specified keys included.
 *
 * @since 14.0.0
 * @param {Set|Array} keys a set of keys to add to this set.
 * @return {ImmutableKeySet} a new ImmutableKeySet with the specified keys included, or the same instance if nothing was added.
 * @method
 * @name add
 * @memberof ImmutableKeySet
 * @instance
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): ImmutableKeySet<K>"}
 */

/**
 * Returns a new ImmutableKeySet that represents all keys are included in this set.
 *
 * @since 14.0.0
 * @return {ImmutableKeySet} a new ImmutableKeySet that represents all keys are included in this set, or the same instance if this
 *                           set already include all keys.
 * @method
 * @name addAll
 * @memberof ImmutableKeySet
 * @instance
 * @ojsignature {target: "Type", value: "(): ImmutableKeySet<K>"}
 */

/**
 * Returns a new ImmutableKeySet based on this set with the specified keys excluded.
 *
 * @since 14.0.0
 * @param {Set|Array} keys a set of keys to remove from this set.
 * @return {KeySet} a new ImmutableKeySet with the specified keys excluded.
 * @method
 * @name delete
 * @memberof ImmutableKeySet
 * @instance
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): ImmutableKeySet<K>"}
 */

/**
 * Returns whether this set should include all keys.
 *
 * @since 14.0.0
 * @return {boolean} true if this set should include all keys, false otherwise.
 * @method
 * @name isAddAll
 * @memberof ImmutableKeySet
 * @instance
 */

/**
 * Returns whether the specified key is contained in this set.
 *
 * @since 14.0.0
 * @param {any} key the key to check whether it is contained in this set.
 * @return {boolean} true if the specified key is contained in this set, false otherwise.
 * @method
 * @name has
 * @memberof ImmutableKeySet
 * @instance
 * @ojsignature {target: "Type", value: "K", for: "key"}
 */

/**
 * Returns a new ImmutableKeySet containing no keys, or the same instance if this set is already empty.
 *
 * @since 14.0.0
 * @return {ImmutableKeySet} a new ImmutableKeySet with no keys.
 * @method
 * @name clear
 * @memberof ImmutableKeySet
 * @instance
 * @ojsignature {target: "Type", value: "(): KeySet<K>"}
 */

/**
 * The base class for KeySetImpl and AllKeySetImpl.  Represents an immutable set of keys.
 * @class KeySet
 * @export
 * @expose
 * @classdesc The base class for KeySetImpl and AllKeySetImpl.  Represents an immutable set of keys.
 * @constructor
 * @hideconstructor
 * @abstract
 * @since 4.1.0
 * @ojsignature {target: "Type", value: "abstract class KeySet<K>", genericParameters: [{"name": "K", "description": "Type of Key"}]}
 */

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

// end of jsdoc

/**
 * Create a new immutable KeySet containing the keys of items.
 * Use this KeySet when specifying individual keys to select or expand.
 *
 * @param {(Set|Array)=} keys A set of keys to initialize this KeySet with.
 *
 * @class KeySetImpl
 * @classdesc The KeySetImpl class contains a set of keys of items.
 * @extends {KeySet}
 * @implements {ImmutableKeySet}
 * @final
 * @since 7.0.0
 * @ojsignature [{target: "Type", value: "class KeySetImpl<K> extends KeySet<K> implements ImmutableKeySet<K>", genericParameters: [{"name": "K", "description": "Type of Key"}]},
 *               {target: "Type", value: "Set<K>|Array<K>", for:"keys"}]
 * @example <caption>Creates a new KeySetImpl with an initial set of keys:</caption>
 * require(['ojs/ojkeyset'],
 *   function(keySet) {
 *     var KeySetImpl = new keySet.KeySetImpl(['item1', 'item3']);
 *   }
 * );
 */

/**
 * An object that contains set of keys that are included in this set.
 *
 * @since 14.0.0
 * @export
 * @expose
 * @memberof KeySetImpl
 * @instance
 * @name keys
 * @readonly
 * @type {any}
 * @ojsignature {target: "Type",
 *               value: "{ all: true, keys?: never, deletedKeys: ImmutableKeySet.ImmutableSet<K>} | {all: false, keys: ImmutableKeySet.ImmutableSet<K>, deletedKeys?: never }"}
 */

/**
 * Returns a new KeySet based on this set with the specified keys included.
 * When a key is added to this KeySet it implies the key will become expanded (when this
 * is used for expansion) or selected (when this is used for selection).
 * If none of the keys specified are being added, then it will be a no-op and this KeySet is
 * returned.
 *
 * @param {Set|Array} keys a set of keys to add to this KeySet.
 * @return {KeySetImpl} a new KeySet with the specified keys included.
 * @export
 * @expose
 * @instance
 * @method
 * @name add
 * @memberof KeySetImpl
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): KeySetImpl<K>"}
 */

/**
 * Returns a new KeySet that represents a set with all keys.  This will return a
 * AllKeySetImpl instance.
 *
 * @return {AllKeySetImpl} a new KeySet that represents a set with all keys.
 * @export
 * @expose
 * @instance
 * @method
 * @name addAll
 * @memberof KeySetImpl
 * @ojsignature {target: "Type", value: "(): AllKeySetImpl<K>"}
 */

/**
 * Determines whether this is a set that represents all keys.  Since this KeySet
 * does not represent all keys, thie method will always return false.
 *
 * @return {boolean} true if this is a set that reprsents all keys, false otherwise.
 * @export
 * @expose
 * @instance
 * @method
 * @name isAddAll
 * @memberof KeySetImpl
 */

/**
 * Returns a new KeySet based on this set with the specified keys excluded.
 * When a key is removed from this KeySet it implies the key will become collapsed (when this
 * is used for expansion) or de-selected (when this is used for selection).
 * If none of the keys specified are being deleted, then this KeySet is returned.
 *
 * @param {Set|Array} keys a set of keys to remove from this KeySet.
 * @return {KeySetImpl} a new KeySet with the specified keys excluded.
 * @export
 * @expose
 * @instance
 * @method
 * @name delete
 * @memberof KeySetImpl
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): KeySetImpl<K>"}
 */

/**
 * Returns a new KeySet containing no keys.  Specifically, invoking clear will collapse all keys (
 * when this is used for expansion) or clear selection (when this is used for selection).
 * If this KeySet already contains no keys then it is a no-op and the current KeySet is returned.
 *
 * @return {KeySetImpl} a new KeySet with no keys.
 * @export
 * @expose
 * @instance
 * @method
 * @name clear
 * @memberof KeySetImpl
 * @ojsignature {target: "Type", value: "(): KeySetImpl<K>"}
 */

/**
 * Determines whether the specified key is in this set.
 * Specifically, this returns true if the key is expanded (when this is used for expansion)
 * or selected (when this is used for selection), and false otherwise.
 *
 * @param {any} key the key to check whether it is in this set.
 * @return {boolean} true if the specified key is in the set, false otherwise.
 * @export
 * @expose
 * @instance
 * @method
 * @name has
 * @memberof KeySetImpl
 * @ojsignature {target: "Type", value: "K", for:"key"}
 */

/**
 * Returns the keys in this KeySet in the order they are added.
 * Specifically, this returns a set of keys that are expanded (when this is used for expansion)
 * or selected (when this is used for selection).
 *
 * @return {Set} the keys in this KeySet in the order they are added.
 * @export
 * @expose
 * @instance
 * @method
 * @name values
 * @memberof KeySetImpl
 * @ojsignature {target: "Type", value: "Set<K>", for:"returns"}
 */

/**
 * Create a new immutable KeySet that represents a set with all keys.
 * Use this KeySet to select or expand all keys.
 *
 * @class AllKeySetImpl
 * @classdesc
 * The AllKeySetImpl class is a KeySet that represents a set with all keys.  This is used
 * for example, to select or expand all items in a component.
 * <p>
 * Note AllKeySetImpl does not actually hold nor have method to return all the keys.  Rather,
 * it provides an efficient way to let the component know that it should, for example, select
 * or expand all items without actually having all the keys present in the set.
 * <p>
 * If the application do require access to the set of all the keys, it should get them directly
 * from the associated <a href="DataProvider.html">DataProvider</a>, or other efficient ways
 * that are specific to the application.
 * @extends {KeySet}
 * @implements {ImmutableKeySet}
 * @final
 * @since 7.0.0
 * @ojsignature {target: "Type", value: "class AllKeySetImpl<K> extends KeySet<K> implements ImmutableKeySet<K>", genericParameters: [{"name": "K", "description": "Type of Key"}]}
 * @example <caption>Creates a new AllKeySetImpl to select all keys</caption>
 * require(['ojs/ojkeyset'],
 *   function(keySet) {
 *     var AllKeySetImpl = new keySet.AllKeySetImpl();
 *   }
 * );
 */

/**
 * An object that contains set of deleted keys that are excluded from this set.
 *
 * @since 14.0.0
 * @export
 * @expose
 * @memberof AllKeySetImpl
 * @instance
 * @name keys
 * @readonly
 * @type {any}
 * @ojsignature {target: "Type",
 *               value: "{ all: true, keys?: never, deletedKeys: ImmutableKeySet.ImmutableSet<K>} | {all: false, keys: ImmutableKeySet.ImmutableSet<K>, deletedKeys?: never }"}
 */

/**
 * Returns a new KeySet with the specified keys included in the set.
 * When a key is added to this KeySet it implies the key will become expanded (when this
 * is used for expansion) or selected (when this is used for selection).
 * If the keys specified have not been explicitly deleted from this KeySet before then
 * this will be a no-op as this KeySet by default includes all keys.
 *
 * @param {Set|Array} keys a set of keys to add to this KeySet.
 * @return {AllKeySetImpl} a new KeySet with the specified keys included.
 * @export
 * @expose
 * @instance
 * @method
 * @name add
 * @memberof! AllKeySetImpl
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): AllKeySetImpl<K>"}
 */

/**
 * Returns a new KeySet that represents a set with all keys.  If this KeySet already is
 * a set with all keys and no keys have been explicitly removed from this KeySet before,
 * then this will be a no-op and it would just return itself.
 * Invoking addAll will cause all keys to be expanded (when this is used for
 * expansion) or selected (when this is used for selection).
 *
 * @return {AllKeySetImpl} a new KeySet that represents a set with all keys.
 * @expose
 * @export
 * @instance
 * @method
 * @name addAll
 * @memberof! AllKeySetImpl
 * @ojsignature {target: "Type", value: "(): AllKeySetImpl<K>"}
 */

/**
 * Determines whether this is a set that represents all keys.  Since this KeySet represents
 * all keys, this method will always return true.
 *
 * @return {boolean} true if this is a set that reprsents all keys, false otherwise.
 * @expose
 * @export
 * @instance
 * @method
 * @name isAddAll
 * @memberof! AllKeySetImpl
 */

/**
 * Returns a new KeySet based on this set with the specified keys deleted.  In the case of
 * AllKeySetImpl this represents the keys to exclude from all keys.
 * When a key is removed from this KeySet it implies the key will become collapsed (when this
 * is used for expansion) or de-selected (when this is used for selection).
 * If the keys specified are already deleted then it will be a no-op and this KeySet is returned.
 *
 * @param {Set|Array} keys a set of keys to remove from this KeySet.
 * @return {AllKeySetImpl} a new KeySet with the specified keys excluded.
 * @expose
 * @export
 * @instance
 * @method
 * @name delete
 * @memberof! AllKeySetImpl
 * @ojsignature {target: "Type", value: "(keys: Set<K>|Array<K>): AllKeySetImpl<K>"}
 */

/**
 * Returns a new KeySet containing no keys.  Specifically, invoking clear will collapse all keys (
 * when this is used for expansion) or clear selection (when this is used for selection).
 *
 * @return {KeySetImpl} a new KeySet with no keys.
 * @expose
 * @export
 * @instance
 * @method
 * @name clear
 * @memberof! AllKeySetImpl
 * @ojsignature {target: "Type", value: "(): KeySetImpl<K>"}
 */

/**
 * Determines whether the specified key is in this set.
 * Specifically, this returns true if the key is expanded (when this is used for expansion)
 * or selected (when this is used for selection), and false otherwise.
 *
 * @param {any} key the key to check whether it is in this set.
 * @return {boolean} true if the specified key is in this set, false otherwise.
 * @expose
 * @export
 * @instance
 * @method
 * @name has
 * @memberof! AllKeySetImpl
 * @ojsignature {target: "Type", value: "K", for: "key"}
 */

/**
 * Returns a set of keys of the items that are excluded from this set.
 * Specifically, this returns a set of keys that are collapsed (when this is used for expansion)
 * or de-selected (when this is used for selection).
 *
 * @return {Set} the keys of the deleted items.
 * @expose
 * @export
 * @instance
 * @method
 * @name deletedValues
 * @memberof! AllKeySetImpl
 * @ojsignature {target: "Type", value: "Set<K>", for: "returns"}
 */

// end of jsdoc

class KeySet {
}
oj._registerLegacyNamespaceProp('KeySet', KeySet);

class KeySetImpl extends KeySet {
    constructor(keys) {
        super();
        this.keys = {
            all: false,
            keys: undefined
        };
        this.keys.keys = new Set(keys);
    }
    has(key) {
        return _has(this.keys.keys, key);
    }
    add(keys) {
        const set = new Set(this.keys.keys.values());
        keys.forEach((key) => {
            if (!_has(set, key)) {
                set.add(key);
            }
        });
        if (set.size === this.keys.keys.size) {
            return this;
        }
        return new KeySetImpl(set);
    }
    delete(keys) {
        const set = new Set(this.keys.keys.values());
        keys.forEach((key) => {
            const ret = _find(set, key);
            if (ret.value) {
                set.delete(ret.key);
            }
        });
        if (set.size === this.keys.keys.size) {
            return this;
        }
        return new KeySetImpl(set);
    }
    addAll() {
        return new AllKeySetImpl([]);
    }
    clear() {
        if (this.keys.keys.size === 0) {
            return this;
        }
        return new KeySetImpl([]);
    }
    isAddAll() {
        return false;
    }
    values() {
        return new Set(this.keys.keys.values());
    }
}
class AllKeySetImpl extends KeySet {
    constructor(keys) {
        super();
        this.keys = {
            all: true,
            deletedKeys: undefined
        };
        this.keys.deletedKeys = new Set(keys);
    }
    has(key) {
        return !_has(this.keys.deletedKeys, key);
    }
    add(keys) {
        const set = new Set(this.keys.deletedKeys.values());
        keys.forEach((key) => {
            const ret = _find(set, key);
            if (ret.value) {
                set.delete(ret.key);
            }
        });
        if (set.size === this.keys.deletedKeys.size) {
            return this;
        }
        return new AllKeySetImpl(set);
    }
    delete(keys) {
        const set = new Set(this.keys.deletedKeys.values());
        keys.forEach((key) => {
            if (!_has(set, key)) {
                set.add(key);
            }
        });
        if (set.size === this.keys.deletedKeys.size) {
            return this;
        }
        return new AllKeySetImpl(set);
    }
    addAll() {
        if (this.keys.deletedKeys.size === 0) {
            return this;
        }
        return new AllKeySetImpl([]);
    }
    clear() {
        return new KeySetImpl([]);
    }
    isAddAll() {
        return true;
    }
    deletedValues() {
        return new Set(this.keys.deletedKeys.values());
    }
}
const _has = (keys, keyToFind) => {
    return _find(keys, keyToFind).value;
};
const _find = (keys, keyToFind) => {
    if (keys.size === 0) {
        return { value: false };
    }
    if (typeof keyToFind === 'string' ||
        typeof keyToFind === 'number' ||
        typeof keyToFind === 'boolean') {
        return { value: keys.has(keyToFind), key: keyToFind };
    }
    const iterator = keys[Symbol.iterator]();
    let key = iterator.next();
    while (!key.done) {
        if (oj.KeyUtils.equals(key.value, keyToFind)) {
            return { value: true, key: key.value };
        }
        key = iterator.next();
    }
    return { value: false };
};
oj._registerLegacyNamespaceProp('KeySetImpl', KeySetImpl);
oj._registerLegacyNamespaceProp('AllKeySetImpl', AllKeySetImpl);

var KeySet$1 = function () {};
// Subclass from oj.Object
oj.Object.createSubclass(KeySet$1, oj.Object, 'KeySet');

/**
 * Sets the internal Set object.
 *
 * @param {Set} set the internal Set object to replace with.
 * @protected
 */
KeySet$1.prototype.SetInternal = function (set) {
  this._keys = set;
};

/**
 * Adds or deletes a set of keys from the internal Set object.
 * @param {boolean} isAdd true if add operation, false if delete operation
 * @param {Set|Array} keys keys to add or delete
 * @return {KeySet} returns current KeySet if add or delete is not performed, or a new KeySet with the
 *                     specified keys included (add) or excluded (delete).
 * @protected
 */
KeySet$1.prototype.AddOrDeleteInternal = function (isAdd, keys) {
  var newSet;
  var keySet;

  newSet = isAdd ? this._add(keys) : this._remove(keys);
  if (newSet == null) {
    return this;
  }

  keySet = /** @type {KeySet} */ (Object.create(Object.getPrototypeOf(this)));
  keySet.SetInternal(newSet);
  return keySet;
};

/**
 * Adds the specified keys to the internal Set object.
 * @param {Set|Array} keys a set of keys to add
 * @return {Set} a new Set based on this internal Set with the specified keys appended to the end, or null if nothing was added.
 * @private
 */
KeySet$1.prototype._add = function (keys) {
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
KeySet$1.prototype._remove = function (keys) {
  var self = this;
  var newSet = null;
  var keyToDelete;

  // first check if there's anything to remove
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
KeySet$1.prototype.GetInternalSize = function () {
  return this._keys.size;
};

/**
 * Return a clone of the internal Set
 * @return {Set} the clone of the internal Set
 * @protected
 */
KeySet$1.prototype.Clone = function () {
  return new Set(this._keys);
};

KeySetImpl$1.call(KeySet$1.prototype);

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
var ExpandedKeySet = function (keys) {
  this.InitializeWithKeys(keys);
};
oj._registerLegacyNamespaceProp('ExpandedKeySet', ExpandedKeySet);
// Subclass from KeySet
oj.Object.createSubclass(ExpandedKeySet, KeySet$1, 'ExpandedKeySet');

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
  return /** @type {!ExpandedKeySet} */ (this.AddOrDeleteInternal(true, keys));
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
  // eslint-disable-next-line no-use-before-define
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
  return /** @type {!ExpandedKeySet} */ (this.AddOrDeleteInternal(false, keys));
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
var ExpandAllKeySet = function () {
  this.InitializeWithKeys(null);
};
oj._registerLegacyNamespaceProp('ExpandAllKeySet', ExpandAllKeySet);
// Subclass from KeySet
oj.Object.createSubclass(ExpandAllKeySet, KeySet$1, 'ExpandAllKeySet');

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
  return /** @type {!ExpandAllKeySet} */ (this.AddOrDeleteInternal(false, keys));
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
  return /** @type {!ExpandAllKeySet} */ (this.AddOrDeleteInternal(true, keys));
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

export { AllKeySetImpl, ExpandAllKeySet, ExpandedKeySet, KeySet, KeySetImpl, KeySetUtils };
