/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore';
import { observableArray, isObservable, observable } from 'knockout';
import { Collection, Events, Model } from 'ojs/ojmodel';

/**
 * @namespace oj.KnockoutUtils
 * @classdesc Utility methods for blending Knockout observables with the data model
 * @export
 * @since 1.0
 * @hideconstructor
 * @ojtsmodule
 * @ojtsimport knockout
 */
const KnockoutUtils = function () {};
oj._registerLegacyNamespaceProp('KnockoutUtils', KnockoutUtils);

KnockoutUtils.internalObjectProperty = 'oj._internalObj';
KnockoutUtils.underUpdateProp = 'oj._underUpdate';
KnockoutUtils.collUpdatingProp = 'oj.collectionUpdating';
KnockoutUtils.subscriptionProp = 'oj.collectionSubscription';
KnockoutUtils.updatingCollectionFunc = 'oj.collectionUpdatingFunc';

/**
 * Turns the attributes in a model object (or the attributes of all models in a collection object) into Knockout observables for use with components' view models.
 * @param {Object} m The model or collection containing the attributes to be converted to Knockout observables.
 * @param {function(Object)=} callback Called once per model so that a caller can add their own Knockout computed observables to the model.
 * @param {boolean=} array Should function return an observable array if m is an oj.Collection, vs. an array of observables?
 *
 * @return {Object|undefined} array of Knockout observables or an observable array
 * @ojsignature {target: "Type", for: "returns", value: "ko.Observable<any>|ko.ObservableArray<any>"}
 * @memberof oj.KnockoutUtils
 * @export
 */
KnockoutUtils.map = function (m, callback, array) {
  var koObject;

  function _makeUpdateModel(argProp) {
    return function (value) {
      // arguments.callee refers to the callback function itself, so we can use the stored '_prop' object (see below)
      if (!koObject[KnockoutUtils.underUpdateProp]) {
        // Make sure we don't circuluarly fire the event
        m.set(argProp, value);
      }
    };
  }

  if (m instanceof Collection) {
    var prealloc = new Array(m._getLength());
    koObject = array ? observableArray(prealloc) : prealloc;

    // Need access to original wrapped collection
    KnockoutUtils._storeOriginalObject(koObject, m);

    var index;
    var i;
    if (array) {
      for (i = 0; i < m._modelIndices.length; i++) {
        index = m._modelIndices[i];
        koObject()[index] = KnockoutUtils.map(m._atInternal(index, null, true, false), callback);
      }
    } else {
      for (i = 0; i < m._modelIndices.length; i++) {
        index = m._modelIndices[i];
        koObject[index] = KnockoutUtils.map(m._atInternal(index, null, true, false), callback);
      }
    }

    // Subscribe to the observable Array, if it is one
    var updateCollection = function (changes) {
      try {
        if (!koObject[KnockoutUtils.underUpdateProp]) {
          koObject[KnockoutUtils.collUpdatingProp] = true;

          // Process change information
          for (var j = 0; j < changes.length; j++) {
            var _index = changes[j].index;
            var model = KnockoutUtils._getModel(changes[j].value);
            var status = changes[j].status;
            if (status === 'added') {
              if (_index >= m.length - 1) {
                m.add(model);
              } else {
                m.add(model, { at: _index });
              }
            } else if (status === 'deleted') {
              m._removeInternal(model, _index);
            }
          }
          if (m.comparator) {
            koObject[KnockoutUtils.underUpdateProp] = true;
            // These could have been resorted--need to alter the observable array
            koObject.sort(function (a, b) {
              return KnockoutUtils._callSort(a, b, m.comparator, m, this);
            });
            koObject[KnockoutUtils.underUpdateProp] = false;
          }
        }
      } finally {
        koObject[KnockoutUtils.collUpdatingProp] = false;
      }
    };
    if (array && koObject.subscribe) {
      koObject[KnockoutUtils.updatingCollectionFunc] = updateCollection;
      koObject[KnockoutUtils.subscriptionProp] = koObject.subscribe(
        updateCollection,
        null,
        'arrayChange'
      );
    }

    var updateObservableArrayRemove = function (model, collection, options) {
      try {
        if (koObject[KnockoutUtils.collUpdatingProp]) {
          return;
        }
        koObject[KnockoutUtils.underUpdateProp] = true;
        var _index = options.index;
        koObject.splice(_index, 1);
      } finally {
        koObject[KnockoutUtils.underUpdateProp] = false;
      }
    };

    var updateObservableArrayAdd = function (model, collection, options) {
      try {
        if (koObject[KnockoutUtils.collUpdatingProp]) {
          return;
        }
        if (collection instanceof Collection) {
          koObject[KnockoutUtils.underUpdateProp] = true;
          var _index = collection._localIndexOf(model);
          if (_index !== undefined && _index > -1) {
            // Make sure to map with original callback from closure, if any
            var newObservable = KnockoutUtils.map(model, callback);
            if (options.fillIn) {
              // First, make sure there's enough room, that index actually exists in koObject...
              var currLen = Array.isArray(koObject) ? koObject.length : koObject().length;
              for (var ii = currLen; ii < _index; ii++) {
                koObject.splice(
                  ii,
                  0,
                  KnockoutUtils.map(collection._atInternal(ii, null, true, false), callback)
                );
              }
              // If we're just filling in on a virtual collection, for example, then just set don't add
              koObject.splice(_index, 1, newObservable);
            } else {
              koObject.splice(_index, 0, newObservable);
            }
          }
        }
      } finally {
        koObject[KnockoutUtils.underUpdateProp] = false;
      }
    };

    var updateObservableArrayReset = function (collection) {
      try {
        if (koObject[KnockoutUtils.collUpdatingProp]) {
          return;
        }
        if (collection instanceof Collection) {
          koObject[KnockoutUtils.underUpdateProp] = true;
          if (isObservable(koObject)) {
            if (koObject[KnockoutUtils.subscriptionProp]) {
              koObject[KnockoutUtils.subscriptionProp].dispose();
            }
            koObject.removeAll();
            if (koObject[KnockoutUtils.updatingCollectionFunc]) {
              koObject.subscribe(
                koObject[KnockoutUtils.updatingCollectionFunc],
                null,
                'arrayChange'
              );
            }
          } else {
            koObject = [];
          }
        }
      } finally {
        koObject[KnockoutUtils.underUpdateProp] = false;
      }
    };

    var updateObservableArraySort = function (collection) {
      try {
        if (koObject[KnockoutUtils.collUpdatingProp]) {
          return;
        }
        if (collection instanceof Collection) {
          koObject[KnockoutUtils.underUpdateProp] = true;
          // Redo the knockout observable array

          koObject.sort(function (a, b) {
            return KnockoutUtils._callSort(a, b, m.comparator, collection, this);
          });
        }
      } finally {
        koObject[KnockoutUtils.underUpdateProp] = false;
      }
    };

    // Register these, ignoring the silent flags from normal API calls--knockout always needs to be updated
    m.OnInternal(Events.EventType.ADD, updateObservableArrayAdd, undefined, undefined, true);
    m.OnInternal(
      Events.EventType.REMOVE,
      updateObservableArrayRemove,
      undefined,
      undefined,
      true
    );
    m.OnInternal(
      Events.EventType.RESET,
      updateObservableArrayReset,
      undefined,
      undefined,
      true
    );
    m.OnInternal(
      Events.EventType.SORT,
      updateObservableArraySort,
      undefined,
      undefined,
      true
    );
  } else {
    if (m === undefined) {
      return undefined;
    }

    koObject = {};

    var data = m.attributes;

    var props = Object.keys(data);
    for (var j = 0; j < props.length; j++) {
      var prop = props[j];
      var converted = observable(m.get(prop));
      koObject[prop] = converted;

      var updateModel = _makeUpdateModel(prop);
      updateModel._prop = prop;

      // Subscribe to any changes pushed by Knockout into the observable
      if (converted.subscribe) {
        converted.subscribe(updateModel);
      }
    }

    var updateObservable = function (model) {
      try {
        koObject[KnockoutUtils.underUpdateProp] = true;
        var attrs = model.changedAttributes();
        var updateProps = Object.keys(attrs);
        for (var k = 0; k < updateProps.length; k++) {
          var updateProp = updateProps[k];
          if (koObject[updateProp]) {
            koObject[updateProp](model.get(updateProp));
          } else {
            // no updateProp yet
            koObject[updateProp] = observable(model.get(updateProp));
          }
        }
      } finally {
        koObject[KnockoutUtils.underUpdateProp] = false;
      }
    };
    m.OnInternal(Events.EventType.CHANGE, updateObservable, undefined, undefined, true);
    // Need access to original wrapped model
    KnockoutUtils._storeOriginalObject(koObject, m);

    // Activate user callback if specified, to allow user computed observables, etc.
    if (callback) {
      callback(koObject);
    }
  }

  return koObject;
};

KnockoutUtils._getModel = function (val) {
  if (val instanceof Model) {
    return val;
  }

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  if (hasOwnProperty.call(val, KnockoutUtils.internalObjectProperty)) {
    return val[KnockoutUtils.internalObjectProperty];
  }
  return val;
};

KnockoutUtils._callSort = function (a, b, comparator, collection, caller) {
  return Collection.SortFunc(
    KnockoutUtils._getModel(a),
    KnockoutUtils._getModel(b),
    comparator,
    collection,
    caller
  );
};

// Attempt to hide original object from enumeration of properties
KnockoutUtils._storeOriginalObject = function (object, value) {
  // Store any callback along with model for use in event-driven mapping of new additions
  Object.defineProperty(object, KnockoutUtils.internalObjectProperty, {
    value: value,
    enumerable: false
  });
};

const map = KnockoutUtils.map;

export { map };
