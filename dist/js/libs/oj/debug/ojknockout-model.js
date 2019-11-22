/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'knockout', 'ojs/ojmodel'], function(oj, ko, Model)
{
  "use strict";


/* global ko:false, Model:false */

/**
 * @namespace oj.KnockoutUtils
 * @classdesc Utility methods for blending Knockout observables with the data model
 * @export
 * @since 1.0
 * @hideconstructor
 * @ojtsmodule
 * @ojtsimport knockout
 */
oj.KnockoutUtils = function () {};
// mapping variable definition, used in a no-require environment. Maps the oj.KnockoutUtils object to the name used in the require callback.
// eslint-disable-next-line no-unused-vars
var KnockoutUtils = oj.KnockoutUtils;

oj.KnockoutUtils.internalObjectProperty = 'oj._internalObj';
oj.KnockoutUtils.underUpdateProp = 'oj._underUpdate';
oj.KnockoutUtils.collUpdatingProp = 'oj.collectionUpdating';
oj.KnockoutUtils.subscriptionProp = 'oj.collectionSubscription';
oj.KnockoutUtils.updatingCollectionFunc = 'oj.collectionUpdatingFunc';

/**
 * Turns the attributes in a model object (or the attributes of all models in a collection object) into Knockout observables for use with components' view models.
 * @param {Object} m The model or collection containing the attributes to be converted to Knockout observables.
 * @param {function(Object)=} callback Called once per model so that a caller can add their own Knockout computed observables to the model.
 * @param {boolean=} array Should function return an observable array if m is an oj.Collection, vs. an array of observables?
 *
 * @return {Object|undefined} array of Knockout observables or an observable array
 * @ojsignature {target: "Type", for: "returns", value: "Array<ko.Observable<any>>|ko.ObservableArray<any>"}
 * @export
 */
oj.KnockoutUtils.map = function (m, callback, array) {
  var koObject;

  function _makeUpdateModel(argProp) {
    return function (value) {
      // arguments.callee refers to the callback function itself, so we can use the stored '_prop' object (see below)
      if (!koObject[oj.KnockoutUtils.underUpdateProp]) {
        // Make sure we don't circuluarly fire the event
        m.set(argProp, value);
      }
    };
  }

  if (m instanceof Model.Collection) {
    var prealloc = new Array(m._getLength());
    koObject = array ? ko.observableArray(prealloc) : prealloc;

    // Need access to original wrapped collection
    oj.KnockoutUtils._storeOriginalObject(koObject, m);

    var index;
    var i;
    if (array) {
      for (i = 0; i < m._modelIndices.length; i++) {
        index = m._modelIndices[i];
        koObject()[index] = oj.KnockoutUtils.map(m._atInternal(index, null, true, false), callback);
      }
    } else {
      for (i = 0; i < m._modelIndices.length; i++) {
        index = m._modelIndices[i];
        koObject[index] = oj.KnockoutUtils.map(m._atInternal(index, null, true, false), callback);
      }
    }

    // Subscribe to the observable Array, if it is one
    var updateCollection = function (changes) {
      try {
        if (!koObject[oj.KnockoutUtils.underUpdateProp]) {
          koObject[oj.KnockoutUtils.collUpdatingProp] = true;

          // Process change information
          for (var j = 0; j < changes.length; j++) {
            var _index = changes[j].index;
            var model = oj.KnockoutUtils._getModel(changes[j].value);
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
            koObject[oj.KnockoutUtils.underUpdateProp] = true;
                    // These could have been resorted--need to alter the observable array
            koObject.sort(function (a, b) {
              return oj.KnockoutUtils._callSort(a, b, m.comparator, m, this);
            });
            koObject[oj.KnockoutUtils.underUpdateProp] = false;
          }
        }
      } catch (e) {
        throw e;
      } finally {
        koObject[oj.KnockoutUtils.collUpdatingProp] = false;
      }
    };
    if (array && koObject.subscribe) {
      koObject[oj.KnockoutUtils.updatingCollectionFunc] = updateCollection;
      koObject[oj.KnockoutUtils.subscriptionProp] =
        koObject.subscribe(updateCollection, null, 'arrayChange');
    }

    var updateObservableArrayRemove = function (model, collection, options) {
      try {
        if (koObject[oj.KnockoutUtils.collUpdatingProp]) {
          return;
        }
        // if (collection instanceof oj.Collection) {
        koObject[oj.KnockoutUtils.underUpdateProp] = true;
        var _index = options.index;
        koObject.splice(_index, 1);
        // }
      } catch (e) {
        throw e;
      } finally {
        koObject[oj.KnockoutUtils.underUpdateProp] = false;
      }
    };

    var updateObservableArrayAdd = function (model, collection, options) {
      try {
        if (koObject[oj.KnockoutUtils.collUpdatingProp]) {
          return;
        }
        if (collection instanceof Model.Collection) {
          koObject[oj.KnockoutUtils.underUpdateProp] = true;
          var _index = collection._localIndexOf(model);
          if (_index !== undefined && _index > -1) {
            // Make sure to map with original callback from closure, if any
            var newObservable = oj.KnockoutUtils.map(model, callback);
            if (options.fillIn) {
              // First, make sure there's enough room, that index actually exists in koObject...
              var currLen = Array.isArray(koObject) ? koObject.length : koObject().length;
              for (var ii = currLen; ii < _index; ii++) {
                koObject.splice(ii, 0,
                                oj.KnockoutUtils.map(collection._atInternal(ii, null, true, false),
                                                     callback));
              }
              // If we're just filling in on a virtual collection, for example, then just set don't add
              koObject.splice(_index, 1, newObservable);
            } else {
              koObject.splice(_index, 0, newObservable);
            }
          }
        }
      } catch (e) {
        throw e;
      } finally {
        koObject[oj.KnockoutUtils.underUpdateProp] = false;
      }
    };

    var updateObservableArrayReset = function (collection) {
      try {
        if (koObject[oj.KnockoutUtils.collUpdatingProp]) {
          return;
        }
        if (collection instanceof Model.Collection) {
          koObject[oj.KnockoutUtils.underUpdateProp] = true;
          // koObject.splice(0, koObject().length);
          if (ko.isObservable(koObject)) {
            if (koObject[oj.KnockoutUtils.subscriptionProp]) {
              koObject[oj.KnockoutUtils.subscriptionProp].dispose();
            }
            koObject.removeAll();
            if (koObject[oj.KnockoutUtils.updatingCollectionFunc]) {
              koObject.subscribe(koObject[oj.KnockoutUtils.updatingCollectionFunc],
                                 null, 'arrayChange');
            }
          } else {
            koObject = [];
          }
        }
      } catch (e) {
        throw e;
      } finally {
        koObject[oj.KnockoutUtils.underUpdateProp] = false;
      }
    };

    var updateObservableArraySort = function (collection) {
      try {
        if (koObject[oj.KnockoutUtils.collUpdatingProp]) {
          return;
        }
        if (collection instanceof Model.Collection) {
          koObject[oj.KnockoutUtils.underUpdateProp] = true;
          // Redo the knockout observable array

          koObject.sort(function (a, b) {
            return oj.KnockoutUtils._callSort(a, b, m.comparator, collection, this);
          });
        }
      } catch (e) {
        throw e;
      } finally {
        koObject[oj.KnockoutUtils.underUpdateProp] = false;
      }
    };

    // Register these, ignoring the silent flags from normal API calls--knockout always needs to be updated
    m.OnInternal(Model.Events.EventType.ADD, updateObservableArrayAdd,
                 undefined, undefined, true);
    m.OnInternal(Model.Events.EventType.REMOVE, updateObservableArrayRemove,
                 undefined, undefined, true);
    m.OnInternal(Model.Events.EventType.RESET, updateObservableArrayReset,
                 undefined, undefined, true);
    m.OnInternal(Model.Events.EventType.SORT, updateObservableArraySort,
                 undefined, undefined, true);
  } else {
    if (m === undefined) {
      return undefined;
    }

    koObject = {};

    var data = m.attributes;

    var props = Object.keys(data);
    for (var j = 0; j < props.length; j++) {
      var prop = props[j];
      var converted = ko.observable(m.get(prop));
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
        koObject[oj.KnockoutUtils.underUpdateProp] = true;
        var attrs = model.changedAttributes();
        var updateProps = Object.keys(attrs);
        for (var k = 0; k < updateProps.length; k++) {
          var updateProp = updateProps[k];
          if (koObject[updateProp]) {
            koObject[updateProp](model.get(updateProp));
          } else {
            // no updateProp yet
            koObject[updateProp] = ko.observable(model.get(updateProp));
          }
        }
      } catch (e) {
        throw e;
      } finally {
        koObject[oj.KnockoutUtils.underUpdateProp] = false;
      }
    };
    m.OnInternal(Model.Events.EventType.CHANGE, updateObservable, undefined, undefined, true);
    // Need access to original wrapped model
    oj.KnockoutUtils._storeOriginalObject(koObject, m);

    // Activate user callback if specified, to allow user computed observables, etc.
    if (callback) {
      callback(koObject);
    }
  }

  return koObject;
};

oj.KnockoutUtils._getModel = function (val) {
  if (val instanceof Model.Model) {
    return val;
  }

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  if (hasOwnProperty.call(val, oj.KnockoutUtils.internalObjectProperty)) {
    return val[oj.KnockoutUtils.internalObjectProperty];
  }
  return val;
};

oj.KnockoutUtils._callSort = function (a, b, comparator, collection, caller) {
  return Model.Collection.SortFunc(oj.KnockoutUtils._getModel(a),
                                oj.KnockoutUtils._getModel(b),
                                comparator, collection, caller);
};


// Attempt to hide original object from enumeration of properties
oj.KnockoutUtils._storeOriginalObject = function (object, value) {
  // Store any callback along with model for use in event-driven mapping of new additions
  Object.defineProperty(object, oj.KnockoutUtils.internalObjectProperty,
                        { value: value, enumerable: false });
};

  ;return oj.KnockoutUtils;
});