/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import BindingProviderImpl from 'ojs/ojkoshared';
import oj$1 from 'ojs/ojcore';
import { isElementRegistered, isComposite, isVComponent, getMetadata } from 'ojs/ojcustomelement-registry';
import { version, utils, unwrap, ignoreDependencies, computed, isObservable, isWriteableObservable, contextFor, computedContext, cleanNode, bindingHandlers, applyBindingsToDescendants, observable, pureComputed, virtualElements } from 'knockout';
import * as DomUtils from 'ojs/ojdomutils';
import { setInKoCleanExternal } from 'ojs/ojdomutils';
import { error, info } from 'ojs/ojlogger';
import { AttributeUtils, CustomElementUtils, JetElementError, OJ_BIND_CONVERTED_NODE, ElementUtils } from 'ojs/ojcustomelement-utils';
import { performMonitoredWriteback } from 'ojs/ojmonitoring';
import { CONSUMED_CONTEXT, getPropagationMetadataViaCache, STATIC_PROPAGATION } from 'ojs/ojbindpropagation';
import KeySetImpl from 'ojs/ojkeysetimpl';
import Context from 'ojs/ojcontext';
import templateEngine from 'ojs/ojtemplateengine-ko';
import oj$2 from 'ojs/ojcore-base';
import * as KnockoutTemplateUtils from 'ojs/ojknockouttemplateutils';
import * as ResponsiveKnockoutUtils from 'ojs/ojresponsiveknockoututils';

/**
 * @ojoverviewdoc BindingOverview - [4]JET Binding Elements
 * @classdesc
 * {@ojinclude "name":"bindingOverviewDoc"}
 */

/**
 * <h2 id="overview">Overview
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h2>
 *
 * <p>
 *  JET provides a set of binding elements that exist in the DOM only before bindings are applied.
 *  After the bindings are applied, the elements are removed from the document's DOM. However, the
 *  bindings they have defined will continue to function, i.e they will still be reacting to any
 *  changes in binding parameters, etc. These elements are intended to allow declaratively handling
 *  logic that would otherwise need to be done programatically, e.g. conditionals, loops, text binding,
 *  etc. Binding elements are removed from the DOM after bindings are applied in order to not interfere
 *  with page layout.
 * </p>
 * <p>
 *  Note that since binding elements will be removed from the DOM after bindings are applied, for
 *  slotting, applications need to wrap binding elements inside another HTML element (e.g. &lt;span&gt;)
 *  with the slot attribute. JET binding elements do not support the slot attribute.
 * </p>
 *
 * <h2 id="knockout">Knockout Equivalents
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#knockout"></a>
 * </h2>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Knockout Binding</th>
 *       <th>JET Equivalent</th>
 *       <th>Notes</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="rt">attr</td>
 *       <td>:[attribute]="[[attrValue]]", e.g. :id="[[inputId]]"</td>
 *       <td>See the custom element
 *           <a href="CustomElementOverview.html#ce-databind-global-section">global attribute</a>
 *           data binding doc for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">css</td>
 *       <td>:class="[[classList]]"</td>
 *       <td>Supports the normal space delimited string of classes,
 *           an array of classes, or a map of class to boolean values
 *           for toggling classes in the DOM. See the custom element
 *           <a href="CustomElementOverview.html#ce-databind-class-section">class</a>
 *           data binding doc for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">event</td>
 *       <td>on-[event]</td>
 *       <td>No ":" prefix needed even on native HTML elements. The parameters
 *           passed to the on- listeners include two additional params.
 *           this.clickListener=function(event, data, bindingContext) {..}
 *           If the component has its own event equivalent, use those instead.
 *           Eg: oj-button should use on-oj-action not on-click. See the custom element
 *           <a href="CustomElementOverview.html#ce-events-section">event</a>
 *           data binding doc for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">foreach</td>
 *       <td>oj-bind-for-each</td>
 *       <td>See the <a href="oj.ojBindForEach.html">oj-bind-for-each</a> binding element doc
 *           for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">html</td>
 *       <td>oj-bind-dom</td>
 *       <td>See the <a href="oj.ojBindDom.html">oj-bind-dom</a> binding element doc
 *           for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">if</td>
 *       <td>oj-bind-if</td>
 *       <td>See the <a href="oj.ojBindIf.html">oj-bind-if</a> binding element doc
 *           for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">template</td>
 *       <td>oj-bind-template-slot if being used inside a composite or oj-module for other cases</td>
 *       <td>See the <a href="oj.ojBindTemplateSlot.html">oj-bind-template-slot</a> binding element and
 *           <a href="oj.ojModule.html">oj-module</a> element doc
 *           for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">text</td>
 *       <td>oj-bind-text</td>
 *       <td>See the <a href="oj.ojBindText.html">oj-bind-text</a> binding element doc
 *           for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">visible</td>
 *       <td>:style.display="[[ CONDITION ? '' : 'none' ]]"</td>
 *       <td> See the custom element
 *           <a href="CustomElementOverview.html#ce-databind-style-section">style</a>
 *           data binding doc for details.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 *
 * @ojfragment bindingOverviewDoc
 * @memberof BindingOverview
 */

BindingProviderImpl.addPostprocessor({
  nodeHasBindings: function (node, wrappedReturn) {
    if (!oj$1.BaseCustomElementBridge) {
      return wrappedReturn;
    }
    return wrappedReturn || (node.nodeType === 1 && isElementRegistered(node.nodeName));
  },

  getBindingAccessors: function (node, bindingContext, wrappedReturn) {
    if (node.nodeType === 1) {
      var name = node.nodeName;

      if (isElementRegistered(name)) {
        // eslint-disable-next-line no-param-reassign
        wrappedReturn = wrappedReturn || {};

        // eslint-disable-next-line no-param-reassign
        wrappedReturn._ojCustomElement = function () {
          const isComposite$1 = isComposite(name);
          const isVComponent$1 = isVComponent(name);
          return { skipThrottling: isComposite$1 || isVComponent$1 };
        };
      }
    }

    return wrappedReturn;
  }
});

/**
 * To create a custom binding,
 * use ComponentBinding.create(). Using prototypal inheritance to extend
 * ComponentBinding is not supported.
 * @export
 * @class ComponentBinding
 * @classdesc JQueryUI component binding for Knockout.js.
 * @param {string|Array.<string>} name - the name of the binding or an
 * array of strings in case the binding needs to be registered under several names
 * @param {?(Object|string)=} options - property object
 * @see ComponentBinding.create
 * @constructor
 * @since 1.0
 * @hideconstructor
 * @ojtsignore
 * @ojmodule ojknockout
 */
const ComponentBinding = function (name, options) {
  if (this.Init) {
    this.Init(name, options);
  }
};

oj$1.Object.createSubclass(ComponentBinding, oj$1.Object, 'oj.ComponentBinding');
oj$1._registerLegacyNamespaceProp('ComponentBinding', ComponentBinding);

/**
 * Delivers all accumulated component changes across all instances of this binding.
 * Calling this method is optional - the changes will be delivered after a 1ms timeout
 * if this method is never invoked. However, you may call this method to speed up
 * component updates when the aplication code is done updating the view models.
 * @return {void}
 * @export
 */
ComponentBinding.deliverChanges = function () {
  BindingProviderImpl.getGlobalChangeQueue().deliverChanges();
};

/**
 * @ignore
 */
ComponentBinding.__cloneIfArray = function (value) {
  if (Array.isArray(value)) {
    // eslint-disable-next-line no-param-reassign
    value = value.slice();
  }
  return value;
};

/**
 * @private
 */
ComponentBinding.__getKnockoutVersion = function () {
  return version;
};

/**
 * Redefine ko.utils.domNodeDisposal.cleanExternalData, so that JET components can avoid removing the wrapper node during
 * KO cleanup
 * @private
 */
(function () {
  var name = 'cleanExternalData';
  var disposal = utils.domNodeDisposal;
  var wrapped = disposal[name];

  disposal[name] = function (node) {
    // This module does not have an explicit dependency on ojcomponentcore,
    // so check for the Components instance dynamically
    var func = DomUtils ? setInKoCleanExternal : null;
    if (func) {
      func(node);
    }
    try {
      wrapped(node);
    } finally {
      if (func) {
        func(null);
      }
    }
  };
})();

/**
 * @private
 * @constructor
 * Keeps track of changes for a single component
 */
const ComponentChangeTracker = function (component, queue) {
  this.Init(component, queue);
};

// Subclass from oj.Object
oj$1.Object.createSubclass(
  ComponentChangeTracker,
  oj$1.Object,
  'ComponentBinding.ComponentChangeTracker'
);

/**
 * @param {Function} updateCallback
 * @param {Object} queue
 */
ComponentChangeTracker.prototype.Init = function (updateCallback, queue) {
  ComponentChangeTracker.superclass.Init.call(this);
  this._updateCallback = updateCallback;
  this._queue = queue;
  this._changes = {};
  this._suspendCountMap = {};
};

ComponentChangeTracker.prototype.addChange = function (property, value) {
  if (this._isSuspended(property) || this._disposed) {
    return;
  }
  this._changes[property] = value;
  this._queue.registerComponentChanges(this);
};

ComponentChangeTracker.prototype.dispose = function () {
  this._disposed = true;
};

ComponentChangeTracker.prototype.resume = function (option) {
  var count = this._suspendCountMap[option] || 0;
  count -= 1;
  if (count < 0) {
    error('ComponentChangeTracker suspendCount underflow');
    return;
  }

  if (count === 0) {
    delete this._suspendCountMap[option];
  } else {
    this._suspendCountMap[option] = count;
  }
};

ComponentChangeTracker.prototype.suspend = function (option) {
  var count = this._suspendCountMap[option] || 0;
  this._suspendCountMap[option] = count + 1;
};

ComponentChangeTracker.prototype.applyChanges = function (changes) {
  if (!this._disposed) {
    this._updateCallback(changes);
  }
};

ComponentChangeTracker.prototype.flushChanges = function () {
  var changes = this._changes;
  this._changes = {};
  return changes;
};

ComponentChangeTracker.prototype._isSuspended = function (option) {
  var count = this._suspendCountMap[option] || 0;
  return count >= 1;
};

const __ExpressionUtils = {};
oj$1._registerLegacyNamespaceProp('__ExpressionUtils', __ExpressionUtils);
(function () {
  var _ASSIGNMENT_TARGET_EXP = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;
  var _KO_WRITER_KEY = '_ko_property_writers';

  /**
   * @ignore
   * @private
   */

  __ExpressionUtils.getPropertyWriterExpression = function (expression) {
    var reserveddWords = ['true', 'false', 'null', 'undefined'];

    if (expression == null || reserveddWords.indexOf(expression) >= 0) {
      return null;
    }

    // Remove the white space on both ends to ensure that the _ASSIGNMENT_TARGET_EXP regexp
    // is matched properly
    // eslint-disable-next-line no-param-reassign
    expression = expression.trim();

    // Matches something that can be assigned to--either an isolated identifier or something ending with a property accessor
    // This is designed to be simple and avoid false negatives, but could produce false positives (e.g., a+b.c).
    // This also will not properly handle nested brackets (e.g., obj1[obj2['prop']];).
    var match = expression.match(_ASSIGNMENT_TARGET_EXP);

    if (match === null) {
      return null;
    }

    var target = match[1] ? 'Object(' + match[1] + ')' + match[2] : expression;

    return '{' + _KO_WRITER_KEY + ': function(v){' + target + '=v;}}';
  };

  __ExpressionUtils.getWriter = function (evaluator) {
    return evaluator[_KO_WRITER_KEY];
  };
})();

/**
 * @ignore
 * @constructor
 * @private
 */
const ExpressionPropertyUpdater = function (element, bindingContext, skipThrottling) {
  var _throttler = _setupComponentChangeTracker();

  var _domListeners = {};
  var _expressionListeners = {};
  var _changeListeners = {};
  var _settingProperties = {};
  var _CHANGED_EVENT_SUFFIX = 'Changed';

  // This function should be called when the bindings are applied initially and whenever the expression attribute changes
  /**
   * Sets up property binding. This method is called both when the bindings are applied and in response to an attribute change.
   * @param {string|undefined} attrVal attribute value or undefined if there is none
   * @param {string} propName property name
   * @param {Object} metadata property metadata
   * @param {Function|undefined} providedValueSetter function that should be called with the result of the initial evalution of the expression
   * @param {string|undefined} providedPropName the key of the $provided map that points to an observable holding a provided value.
   * If the attrVal parameter is undefined, the observable will be used to set up property binding
   * @ignore
   */
  this.setupPropertyBinding = function (
    attrVal,
    propName,
    metadata,
    providedValueSetter,
    providedPropName
  ) {
    // If no metadata was passed in, just return bc this is not a component property.
    if (!metadata) {
      return;
    }

    // See if attribute is a component property/subproperty by checking for metadata
    var meta = _getPropertyMetadata(propName, metadata);
    if (!meta) {
      return;
    }

    var oldListener = _expressionListeners[propName];
    if (oldListener) {
      oldListener.dispose();
      _expressionListeners[propName] = null;
    }

    // Clean up property change listeners to handler the case when the type of the expression changes
    var changeListener = _changeListeners[propName];
    if (changeListener) {
      element.removeEventListener(propName + _CHANGED_EVENT_SUFFIX, changeListener);
      _changeListeners[propName] = null;
    }

    if (metadata._domListener) {
      var event = AttributeUtils.eventListenerPropertyToEventType(propName);
      // If the attribute is removed, there won't be a new expression so the remove call
      // below can't be relied upon.  So clean up here as well to handle that case
      _setDomListener(bindingContext, event, null);
    }

    let evaluator;
    let expr;
    let downstreamOnly;

    if (attrVal === undefined) {
      // Implicit bindings are used only when the corresponding attribute is not set

      // Get an observable for the provided value if we have metadata for its name
      let observable;
      if (!providedPropName) {
        observable = null;
      } else if (bindingContext.$provided) {
        observable = bindingContext.$provided.get(providedPropName);
      }

      // If the observable is present, we set up the implicit binding
      if (observable) {
        evaluator = () => unwrap(observable); // evaluator is using an implicit binding to a property provided by a container component
      }
    } else {
      const info = AttributeUtils.getExpressionInfo(attrVal);
      expr = info.expr;
      if (expr) {
        evaluator = BindingProviderImpl.createEvaluator(expr, bindingContext);
        downstreamOnly = info.downstreamOnly;
      }
    }

    if (evaluator) {
      if (!metadata.readOnly) {
        var initialRead = true;
        ignoreDependencies(function () {
          _expressionListeners[propName] = computed(
            // The read() function for the computed will be called when the computed is created and whenever any of
            // the expression's dependency changes
            function () {
              var value = evaluator(bindingContext);
              var unwrappedValue = utils.unwrapObservable(value);

              if (metadata._domListener) {
                var _event = AttributeUtils.eventListenerPropertyToEventType(propName);
                _setDomListener(bindingContext, _event, unwrappedValue);
              } else {
                // We cannot share the same storage with KO because we want to be able to compare values,
                // so make a copy of the array before setting it.
                if (Array.isArray(unwrappedValue)) {
                  unwrappedValue = unwrappedValue.slice();
                }

                if (metadata._eventListener) {
                  // Need to wrap the function so that it gets called with extra params
                  // No need to throw an error for the non-function case here because
                  // the bridge will throw it for us
                  if (unwrappedValue && unwrappedValue instanceof Function) {
                    unwrappedValue = _createSimpleEventListenerWrapper(
                      bindingContext,
                      unwrappedValue
                    );
                  }
                }

                if (!initialRead && _throttler) {
                  _throttler.addChange(propName, unwrappedValue);
                } else {
                  _setElementProperty(propName, unwrappedValue);
                }

                if (initialRead && providedValueSetter) {
                  providedValueSetter(unwrappedValue);
                }
              }
            }
          );
        });
        initialRead = false;
      }

      // Only listen for property changes for writeable properties
      if (expr !== undefined && metadata.writeback && !downstreamOnly) {
        _changeListeners[propName] = _listenToPropertyChanges(propName, expr, evaluator);
      }
    }
  };

  this.teardown = function () {
    var i;
    var names = Object.keys(_expressionListeners);
    for (i = 0; i < names.length; i++) {
      var listener = _expressionListeners[names[i]];
      // listener might be null if this attribute changed from an expression to a literal
      if (listener) {
        listener.dispose();
      }
    }
    _expressionListeners = {};

    // reset change listeners
    names = Object.keys(_changeListeners);
    for (i = 0; i < names.length; i++) {
      var prop = names[i].split('.')[0];
      element.removeEventListener(prop + _CHANGED_EVENT_SUFFIX, _changeListeners[prop]);
    }
    _changeListeners = {};

    // dom event listeners
    names = Object.keys(_domListeners);
    for (i = 0; i < names.length; i++) {
      var event = names[i];
      element.removeEventListener(event, _domListeners[event]);
    }
    _domListeners = {};

    if (_throttler) {
      _throttler.dispose();
    }
  };

  function _getCurrent(_bindingContext) {
    return _bindingContext.$current || _bindingContext.$data;
  }

  function _createSimpleEventListenerWrapper(_bindingContext, listener) {
    var current = _getCurrent(_bindingContext);
    return function (event) {
      listener(event, current, _bindingContext);
    };
  }

  function _createMutableEventListenerWrapper(_bindingContext) {
    var current = _getCurrent(_bindingContext);
    var eventListener;
    var domListener = function (event) {
      if (eventListener) {
        eventListener(event, current, _bindingContext);
      }
    };
    domListener.setListener = function (listener) {
      eventListener = listener;
    };
    return domListener;
  }

  function _setDomListener(_bindingContext, event, listener) {
    var domListener = _domListeners[event];
    if (!domListener) {
      // Create the wrapper
      domListener = _createMutableEventListenerWrapper(_bindingContext);
      _domListeners[event] = domListener;
      element.addEventListener(event, domListener);
    }
    if (listener == null || listener instanceof Function) {
      domListener.setListener(listener);
    } else {
      // this isn't actually a property, just transforming names...
      var property = AttributeUtils.eventTypeToEventListenerProperty(event);
      var attribute = AttributeUtils.propertyNameToAttribute(property);
      var message = `Invalid type '${typeof listener}' found for attribute '${attribute}'.\
 Expected value of type 'function'."`;
      if (isElementRegistered(element.tagName)) {
        const elementState = CustomElementUtils.getElementState(element);
        elementState.rejectBindingProvider(message);
      }
      throw new JetElementError(element, message);
    }
  }

  function _listenToPropertyChanges(propName, expr, evaluator) {
    var splitProps = propName.split('.');
    var topProp = splitProps[0];
    var listener = function (evt) {
      if (!_isSettingProperty(topProp)) {
        let failure;
        let writer;
        ignoreDependencies(function () {
          var value = evt.detail.value;
          // If the propName has '.' we need to walk the top level value and writeback
          // subproperty value
          for (var i = 1; i < splitProps.length; i++) {
            var subprop = splitProps[i];
            value = value[subprop];
          }

          var target = evaluator(bindingContext);

          if (isObservable(target)) {
            if (isWriteableObservable(target)) {
              writer = target;
            } else {
              failure = 'the observable is not writeable';
            }
          } else {
            var writerExpr = __ExpressionUtils.getPropertyWriterExpression(expr);
            if (writerExpr != null) {
              const writerEvaluator = BindingProviderImpl.createEvaluator(
                writerExpr,
                bindingContext
              );
              writer = __ExpressionUtils.getWriter(writerEvaluator(bindingContext));
            } else {
              failure = 'the expression is not a valid update target';
            }
          }
          if (!writer) {
            if (failure) {
              info(
                "The expression '%s' for property '%s' was not updated because %s.",
                expr,
                propName,
                failure
              );
            }
          } else {
            performMonitoredWriteback(
              propName,
              writer,
              evt,
              ComponentBinding.__cloneIfArray(value)
            );
          }
        });
      }
    };

    element.addEventListener(topProp + _CHANGED_EVENT_SUFFIX, listener);
    return listener;
  }

  function _setElementProperty(propName, value) {
    _startSettingProperty(propName);
    try {
      element.setProperty(propName, value);
    } catch (err) {
      CustomElementUtils.getElementState(element).rejectBindingProvider(err);
      throw err;
    } finally {
      _endSettingProperty(propName);
    }
  }

  function _startSettingProperty(propName) {
    var count = _settingProperties[propName] || 0;
    count += 1;
    _settingProperties[propName] = count;
  }

  function _endSettingProperty(propName) {
    var count = _settingProperties[propName];
    if (!count) {
      error('Property count undefrlow');
      return;
    }
    count -= 1;
    if (count === 0) {
      _settingProperties[propName] = null;
    } else {
      _settingProperties[propName] = count;
    }
  }

  function _isSettingProperty(propName) {
    return _settingProperties[propName];
  }

  function _getPropertyMetadata(propName, metadata) {
    var propPath = propName.split('.');
    var meta = metadata;
    propPath.shift(); // current metadata is already for top level property
    for (var j = 0; j < propPath.length; j++) {
      meta = meta.properties;
      if (!meta) {
        break;
      }
      meta = meta[propPath[j]];
    }
    return meta;
  }

  function _setupComponentChangeTracker() {
    //  We are not throttling property updates for JET composites and native HTML elements because:
    //  1) Existing customers may expect that properties be updated immediately
    //  2) KO templates do not have any optimizations for simulteneous property updates
    //  3) Updates to embeddded JET components will still be throttled
    if (skipThrottling) {
      return null;
    }

    var updater = function (changes) {
      var keys = Object.keys(changes);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        // We rely on the flag set by the _startSettingProperty() to determine whether
        // the property is being changed in response to a subscription notification
        // from KO. Change events from all sets made NOT in response to a KO update
        // trigger an an attempt to write the value back into the associated expression.
        // If the writeback is not possible for any reason, we consider that the binding
        // has been 'obscured' by a local property set, and further update notifications
        // are are going to be ignored. This means that we are stuck with calling
        // _startSettingProperty() for all properties in the batch update.
        // The downside for this approach is that property changes made in response
        // to a property set from within the same batch will NOT be written back
        // into the KO expression. The likelihood of the writeback bugs because
        // of this is very low IMO: we have few properties with writeback enabled,
        // and the behavior for the component changing a property whose value is being set
        // in the same batch is already undefined. If some app runs into an issue, the
        // workaround will be to call oj.ComponentBinding.deliverChanges() after each observable
        // change.
        _startSettingProperty(key);
      }
      try {
        element.setProperties(changes);
      } finally {
        for (var n = 0; n < keys.length; n++) {
          var k = keys[n];
          _endSettingProperty(k);
        }
      }
    };

    return new ComponentChangeTracker(updater, BindingProviderImpl.getGlobalChangeQueue());
  }
};

/**
 * @ignore
 * @constructor
 * @private
 */
const _KnockoutBindingProvider = function () {
  /**
   * @ignore
   */
  this._resolveWhenChildrenBindingsApplied = function (elem, trackOption) {
    var childrenPromises = this._getChildrenBindingsAppliedPromises(elem);
    if (trackOption === 'none' || childrenPromises.length === 0) {
      CustomElementUtils.getElementState(elem).resolveBindingProvider(this);
    } else {
      var promises = [];
      while (childrenPromises.length > 0) {
        var callbackItem = childrenPromises.shift();
        if (
          trackOption === 'nearestCustomElement' ||
          (trackOption === 'immediate' && callbackItem.immediate === true)
        ) {
          promises.push(callbackItem.promiseCallback);
        }
      }
      Promise.all(promises).then(
        function () {
          this._resolveWhenChildrenBindingsApplied(elem, trackOption);
        }.bind(this)
      );
    }
  };

  this._getChildrenBindingsAppliedPromises = function (elem, create) {
    if (!elem._whenChildrenBindingsApplied && create) {
      Object.defineProperty(elem, '_whenChildrenBindingsApplied', {
        value: [],
        enumerable: false
      });
    }
    return elem._whenChildrenBindingsApplied || [];
  };

  /**
   * @ignore
   */
  this.__RegisterBindingAppliedPromiseForChildren = function (parent, immediate) {
    var promiseResolver = null;
    if (parent) {
      var childrenPromise = new Promise(function (resolve) {
        promiseResolver = resolve;
      });
      this._getChildrenBindingsAppliedPromises(parent, true);
      parent._whenChildrenBindingsApplied.push({
        immediate: immediate,
        promiseCallback: childrenPromise
      });
    }
    return promiseResolver;
  };

  /**
   * @ignore
   */
  this.__NotifyBindingsApplied = function (elem) {
    var trackOption = CustomElementUtils.getElementState(elem).getTrackChildrenOption();
    this._resolveWhenChildrenBindingsApplied(elem, trackOption);
  };

  /**
   * @ignore
   */
  this.__NotifyBindingsDisposed = function (elem) {
    CustomElementUtils.getElementState(elem).disposeBindingProvider(elem);
  };

  /**
   * Provides a promise for JET's Knockout throttling timeout
   * @return {Promise} a promise for JET's Knockout throttling timeout completing or a promise that will be resolved immediately for the case
   * when there is no outstanding throttling timeout
   * @ignore
   */
  this.__GetThrottlePromise = function () {
    return BindingProviderImpl.getGlobalChangeQueue().getThrottlePromise();
  };

  /**
   * A wrapper function used by VTemplateEngine that extends binding context with given extra properties.
   * @ignore
   */
  this.__ExtendBindingContext = function (context, current, alias, templateAlias, cacheKey) {
    return BindingProviderImpl.extendBindingContext(
      context,
      current,
      alias,
      templateAlias,
      cacheKey
    );
  };

  /**
   * A wrapper function used by VTemplateEngine that gets binding context object applied in a node.
   * @ignore
   */
  this.__ContextFor = function (node) {
    // Note: the context for oj_bind_for_each template is stored on __ojBindingContext property.
    return node.__ojBindingContext ? node.__ojBindingContext : contextFor(node);
  };

  /**
   * A wrapper function used by VTemplateEngine that accepts an observable or plain value and returns a plain value.
   * @ignore
   */
  this.__UnwrapObservable = function (value) {
    return utils.unwrapObservable(value);
  };

  /**
   * A wrapper function used by VTemplateEngine to check if a value is observable.
   * @ignore
   */
  this.__IsObservable = function (value) {
    return isObservable(value);
  };

  /**
   * A wrapper function used by VTemplateEngine to create a computed observable.
   * @ignore
   */
  this.__KoComputed = function (evaluator, targetObject, options) {
    return computed(evaluator, targetObject, options);
  };

  /**
   * A wrapper function used by VTemplateEngine to check if called during the first evaluation of the current computed observable.
   * @ignore
   */
  this.__KoIsInitial = function () {
    return computedContext.isInitial();
  };

  /**
   * @ignore
   */
  this.__CleanNode = function (n) {
    cleanNode(n);
  };
};

/**
 * @ignore
 */
_KnockoutBindingProvider.getInstance = function () {
  return _KnockoutBindingProvider._instance;
};

/**
 * @ignore
 */
_KnockoutBindingProvider._instance = new _KnockoutBindingProvider();
oj._registerLegacyNamespaceProp('_KnockoutBindingProvider', _KnockoutBindingProvider);

/* eslint-disable no-use-before-define */

/**
 * @ignore
 */
(function () {
  bindingHandlers._ojCustomElement = {
    after: ['attr'], // Ensure attr binding is processed first so to handle :disabled case since we only process on init
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var _expressionHandler;
      var attributeListener;

      // TODO: this code is a workaround for JET-57399. It should be removed when the issue is fixed.
      if (
        bindingContext &&
        bindingContext.$provided &&
        !(bindingContext.$provided instanceof Map)
      ) {
        // eslint-disable-next-line no-param-reassign
        bindingContext.$provided = new Map(Object.entries(bindingContext.$provided));
      }

      const compMetadata = getMetadata(element.tagName);
      const metadataProps = compMetadata.properties || {};

      // Compute data about the provided and consumed properties.
      // Also get the function that would perform necessary clean up when the bindings on the provider element are being cleaned
      const {
        provide: provideMap,
        consume: consumeMap,
        cleanup: disposeProviderListeners
      } = _setupProvideAndConsumeMaps(element, compMetadata);

      // Called both when KO's cleanNode() is invoked and when the observable view model is mutated
      function cleanup() {
        if (_expressionHandler) {
          _expressionHandler.teardown();
          _expressionHandler = null;
        }

        if (attributeListener) {
          element.removeEventListener(_ATTRIBUTE_CHANGED, attributeListener);
          attributeListener = null;
        }

        _KnockoutBindingProvider.getInstance().__NotifyBindingsDisposed(element);
      }

      // Called only when KO's cleanNode() is invoked
      function finalCleanup() {
        cleanup();
        disposeProviderListeners();
      }

      function setup(skipThrottling, isInitial) {
        _expressionHandler = new ExpressionPropertyUpdater(element, bindingContext, skipThrottling);

        // Dummy metadata for passing to the ExpressionPropertyUpdater for DOM listener attributes i.e. on-*
        var domListenerMetadata = { _domListener: true };

        // Set a flag on the bridge to indicate that we are initializing expressions from the DOM
        // to avoid overriding any property sets that could have occured after
        const elementState = CustomElementUtils.getElementState(element);
        elementState.beginApplyingBindings();

        // setupPropertyBinding will only update properties defined in metadata so it's safe to iterate through all element attributes
        // including ones defined on the base HTML prototype
        var attrs = element.attributes; // attrs is a NamedNodeMap
        for (var i = 0; i < attrs.length; i++) {
          var attr = attrs[i];
          var propName = AttributeUtils.attributeToPropertyName(attr.nodeName);
          let initialValueSetter;
          let topPropName;
          const isDomEvent =
            AttributeUtils.isEventListenerProperty(propName) && !metadataProps[propName];

          if (!isDomEvent) {
            topPropName = propName.split('.')[0];
            const info = provideMap.get(topPropName);
            // Initial value for provided properties needs to be set only when setup() is called for the very first time.
            // After that, we will be using property change listeners to update the values
            initialValueSetter = isInitial && info ? info.set : undefined;
          }

          _expressionHandler.setupPropertyBinding(
            attr.value,
            propName,
            isDomEvent ? domListenerMetadata : metadataProps[topPropName],
            // Pass in a setter to store the initial value if this property will be
            // provided to descendants
            initialValueSetter
          );
        }

        // Now set up implicit consumption of bindings for properties whose attributes are not set and whose
        // metadata is set up to consume provided properties
        consumeMap.forEach((consumingPropValue, consumingProp) => {
          if (
            typeof consumingProp === 'string' &&
            !element.hasAttribute(AttributeUtils.propertyNameToAttribute(consumingProp))
          ) {
            const provideInfo = provideMap.get(consumingProp);
            // Initial value for provided properties needs to be set only when setup() is called for the very first time.
            // After that, we will be using property change listeners to update the values
            const initialValueSetter = isInitial && provideInfo ? provideInfo.set : undefined;
            _expressionHandler.setupPropertyBinding(
              undefined,
              consumingProp,
              metadataProps[consumingProp],
              initialValueSetter,
              consumingPropValue
            );
          } else if (consumingProp === CONSUMED_CONTEXT) {
            // Pass context values via __oj_private_contexts property since component properties are available to the
            // EnvironmentWrapper class.
            const provided = bindingContext.$provided;
            const providedValues = new Map();
            consumingPropValue.forEach((context) => {
              if (provided && provided.has(context)) {
                providedValues.set(context, unwrap(provided.get(context)));
              }
            });
            element.setProperty('__oj_private_contexts', providedValues);
          }
        });

        attributeListener = function (evt) {
          var detail = evt.detail;
          var _attr = detail.attribute;
          var _propName = AttributeUtils.attributeToPropertyName(_attr);
          var _isDomEvent =
            AttributeUtils.isEventListenerProperty(_propName) && !metadataProps[_propName];

          var metadata = _isDomEvent ? domListenerMetadata : metadataProps[_propName.split('.')[0]]; // send metadata for top level property
          _expressionHandler.setupPropertyBinding(
            detail.value,
            _propName,
            metadata,
            undefined /* no need to get initial value on attribute change */,
            consumeMap.get(_propName)
          );
        };

        element.addEventListener(_ATTRIBUTE_CHANGED, attributeListener);
      }

      // Use ko.computed to track changes to the binding context. The binding will be cleaned u and recreated when a change
      // is detected
      computed(
        function () {
          // Access valueAccesor to ensure that the binding is re-initialized when an
          // observable ViewModel is mutated
          var skipThrottling = valueAccessor().skipThrottling;

          const isInitial = computedContext.isInitial();
          if (!isInitial) {
            cleanup();
          }

          setup(skipThrottling, isInitial);
        },
        null,
        { disposeWhenNodeIsRemoved: element }
      );

      utils.domNodeDisposal.addDisposeCallback(element, finalCleanup);

      const contextWithProvideInfo = _getChildContext(bindingContext, provideMap);
      applyBindingsToDescendants(contextWithProvideInfo, element);

      _KnockoutBindingProvider.getInstance().__NotifyBindingsApplied(element);

      return { controlsDescendantBindings: true };
    }
  };

  const _ATTRIBUTE_CHANGED = 'attribute-changed';
  const _CHANGE_SUFFIX = 'Changed';

  function _setupProvideAndConsumeMaps(element, compMetadata) {
    // A map of a property name to a record with the following structure:
    // {set: {Function}, vars: Array<{name: {String}, obs: {Function}, transform: {Record<string, string>}}>} (the 'set' key representing
    // the setter for updating the value (the setter may be updating more than one observable if the value is being provided
    // under different names), the 'vars' key representing an array of records with a 'name' key
    // being the provided name, the 'obs' key being the associated observable, and the 'transform' key being an optional
    // transform map
    const provide = new Map();

    // A map of a property name to a name of a provided property that should be consumed via an implicit binding
    const consume = new Map();

    // Example 'provide binding' metadata:
    // binding: {provide: [{name: "containerLabelEdge", default: "inside"}, {name: "labelEdge", transform: {top: "provided", start: "provided"}}]}

    // Example 'consume binding' metadata:
    // binding: {consume: {name: "containerLabelEdge"}}

    const changeListeners = Object.create(null);

    const provideConsumeMeta = getPropagationMetadataViaCache(element.localName, compMetadata); // will return null if the component has no provide/consume metadata
    if (provideConsumeMeta !== null) {
      const metadataProps = compMetadata.properties || {};
      // eslint-disable-next-line no-restricted-syntax
      for (const [pName, [provideMeta, consumeMeta]] of provideConsumeMeta) {
        if (provideMeta !== undefined) {
          // 1) populate the 'provide' map including
          //    a) using any root-level (static) values
          //    b) collecting initial values for properties whose attributes have literal values

          // The binding will be provided to descendants only if the corresponding attribute is set
          // or if the default value is provided via metadata
          const observables = [];
          const vars = [];
          if (pName === STATIC_PROPAGATION) {
            // Populate the map with name => {name,default} values without creating observables
            // since the values are static.
            provideMeta.forEach((info) => {
              provide.set(info.name, info);
            });
          } else {
            // iterate over provided bindings (there may be more than one!) that a single attribute produces
            provideMeta.forEach((info) => {
              const name = info.name;
              if (name === undefined) {
                throw new Error('name attribute for the binding/provide metadata is required!');
              }
              const defaultVal = info.default;
              const obs = _createObservableWithTransform(info.transform, defaultVal);
              observables.push(obs);
              vars.push({ name, obs });
            });
          }

          if (vars.length > 0) {
            // create a setter function that can update several observables at once
            const set = _getSingleSetter(observables);
            provide.set(pName, { set, vars });

            // Call the setter function whenever a  proeprty change event is fired
            const changeListener = _setupChangeListenerForProvidedProperty(set);
            const evtName = pName + _CHANGE_SUFFIX;
            element.addEventListener(evtName, changeListener);
            // Store listener in a map for future cleanup
            changeListeners[evtName] = changeListener;

            // If the attribute is present, and its value is not an expression, we won't be getting the initial value
            // when the expression is evaluated, so we have to coerce and store the initial value here
            const attrName = AttributeUtils.propertyNameToAttribute(pName);
            const hasAttribute = element.hasAttribute(attrName);
            if (hasAttribute) {
              const attrVal = element.getAttribute(attrName);
              if (!AttributeUtils.getExpressionInfo(attrVal).expr) {
                set(
                  AttributeUtils.attributeToPropertyValue(
                    element,
                    attrName,
                    attrVal,
                    metadataProps[pName]
                  )
                );
              }
            }
          }
        }
        if (consumeMeta !== undefined) {
          // 2) populate the 'consume' map
          if (pName === CONSUMED_CONTEXT) {
            consume.set(pName, consumeMeta);
          } else {
            const name = consumeMeta.name;
            if (name === undefined) {
              throw new Error("'name' property on the binding/consume metadata is required!");
            }
            consume.set(pName, name);
          }
        }
      }
    }

    function cleanup() {
      const changeListenerKeys = Object.keys(changeListeners);
      changeListenerKeys.forEach((key) => element.removeEventListener(key, changeListeners[key]));
    }

    return { provide, consume, cleanup };
  }

  function _setupChangeListenerForProvidedProperty(setter) {
    return (evt) => setter(evt.detail.value);
  }

  function _getChildContext(bindingContext, provideMap) {
    if (provideMap.size === 0) {
      return bindingContext;
    }
    const oldProvided = bindingContext.$provided;
    const newProvided = new Map(oldProvided);
    provideMap.forEach((propValue) => {
      if (propValue.vars) {
        // Set dynamically provided values
        const vars = propValue.vars;
        vars.forEach((info) => {
          const obs = info.obs;
          newProvided.set(info.name, obs);
        });
      } else {
        // Set statically provided values
        newProvided.set(propValue.name, propValue.default);
      }
    });
    return bindingContext.extend({ $provided: newProvided });
  }

  function _createObservableWithTransform(transform, initialVal) {
    const observable$1 = observable(initialVal);
    if (transform) {
      return pureComputed({
        // eslint-disable-next-line no-prototype-builtins
        write: (value) => observable$1(transform.hasOwnProperty(value) ? transform[value] : value),
        read: () => observable$1()
      });
    }
    return observable$1;
  }

  function _getSingleSetter(observables) {
    return (val) => observables.forEach((observable) => observable(val));
  }
})();

/**
 * @ignore
 */
(function () {
  var _BINDINGS = '_ojbindingsobj';

  BindingProviderImpl.registerPreprocessor('oj-bind-text', function (node) {
    return _replaceWithKo(node, 'text', 'value', true);
  });

  BindingProviderImpl.registerPreprocessor('oj-bind-if', function (node) {
    return _replaceWithKo(node, 'if', 'test', false);
  });

  BindingProviderImpl.registerPreprocessor('oj-bind-for-each', _replaceWithKoForEach);

  BindingProviderImpl.addPostprocessor({
    nodeHasBindings: function (node, wrappedReturn) {
      var bindings = _getBindings(node);
      return (
        wrappedReturn ||
        bindings._ATTR_BIND != null ||
        bindings._STYLE_BIND != null ||
        bindings._EVENT_BIND != null
      );
    },
    getBindingAccessors: function (node, bindingContext, wrappedReturn) {
      if (node.nodeType === 1) {
        // eslint-disable-next-line no-param-reassign
        wrappedReturn = wrappedReturn || {};
        var bindings = _getBindings(node);
        var i;
        var attr;

        // Style bindings
        var styleAttrs = bindings._STYLE_BIND;
        if (styleAttrs) {
          if (wrappedReturn.style) {
            throw new Error(
              'Cannot have both style data-bind and JET style binding on ' +
                node.tagName +
                ' with id ' +
                node.id
            );
          }

          // If :style is set, any additional :style.* attributes would have thrown an error earlier
          if (styleAttrs === 'style') {
            // eslint-disable-next-line no-param-reassign
            wrappedReturn[styleAttrs] = _getValueEvaluator(
              node,
              styleAttrs,
              node.getAttribute(_getBoundAttrName(styleAttrs)),
              bindingContext,
              'object'
            );
          } else {
            var styleEvaluators = {};
            for (i = 0; i < styleAttrs.length; i++) {
              attr = styleAttrs[i];
              var styleProp = AttributeUtils.attributeToPropertyName(attr.substring(6));
              styleEvaluators[styleProp] = _getValueEvaluator(
                node,
                attr,
                node.getAttribute(_getBoundAttrName(attr)),
                bindingContext,
                'string'
              );
            }
            // eslint-disable-next-line no-param-reassign
            wrappedReturn.style = _getObjectEvaluator(styleEvaluators);
          }
        }

        // All other attribute bindings
        var boundAttrs = bindings._ATTR_BIND;
        if (boundAttrs) {
          if (wrappedReturn.attr) {
            throw new Error(
              'Cannot have both attr data-bind and JET attribute binding on ' +
                node.tagName +
                ' with id ' +
                node.id
            );
          }

          var attrEvaluators = {};
          for (i = 0; i < boundAttrs.length; i++) {
            attr = boundAttrs[i];
            // For the class attribute we support a string, an array and object types.
            // For all the types we pass to knockout's css binding that also handles arrays and strings
            // since version 3.5.0.
            if (attr === 'class') {
              _setClassEvaluator(
                wrappedReturn,
                node,
                node.getAttribute(_getBoundAttrName(attr)),
                bindingContext
              );
            } else {
              attrEvaluators[attr] = _getValueEvaluator(
                node,
                attr,
                node.getAttribute(_getBoundAttrName(attr)),
                bindingContext,
                'string'
              );
            }
          }

          // eslint-disable-next-line no-param-reassign
          wrappedReturn.attr = _getObjectEvaluator(attrEvaluators);
        }

        // Event bindings for native HTML elements
        var eventAttrs = bindings._EVENT_BIND;
        if (eventAttrs) {
          // Delegate to ExpressionPropertyUpdater, which is also responsible for
          // setting up the event bindings for custom elements.
          var expressionHandler = new ExpressionPropertyUpdater(node, bindingContext, true);

          for (i = 0; i < eventAttrs.length; i++) {
            var attrNode = eventAttrs[i];
            var propName = AttributeUtils.attributeToPropertyName(attrNode.nodeName);
            expressionHandler.setupPropertyBinding(attrNode.value, propName, {
              _domListener: true
            });
          }

          utils.domNodeDisposal.addDisposeCallback(node, function () {
            if (expressionHandler) {
              expressionHandler.teardown();
              expressionHandler = null;
            }
          });
        }
      }
      return wrappedReturn;
    }
  });

  function _replaceWithKo(node, bindableAttr, nodeAttr, stringify) {
    var expr = _getExpression(node.getAttribute(nodeAttr), stringify);
    if (!expr) {
      return undefined;
    }

    var binding = 'ko ' + bindableAttr + ':' + expr;
    return _getReplacementNodes(node, bindableAttr, binding);
  }

  function _replaceWithKoForEach(node) {
    var dataValue = node.getAttribute('data');
    var dataExp = AttributeUtils.getExpressionInfo(dataValue).expr;
    if (!dataExp) {
      try {
        var literalValue = JSON.parse(dataValue);
        if (Array.isArray(literalValue)) {
          dataExp = dataValue;
        } else {
          throw new Error('got value ' + dataValue);
        }
      } catch (e) {
        throw new Error(
          'The value on the oj-bind-for-each data attribute should be either a JSON array or an expression : ' +
            e
        );
      }
    }

    var asExp = _getExpression(node.getAttribute('as'), true);
    if (!dataExp) {
      return undefined;
    }

    var binding = 'ko _ojBindForEach_:{data:' + dataExp;
    binding += asExp ? ',as:' + asExp + '}' : '}';
    return _getReplacementNodes(node, '_ojBindForEach_', binding);
  }

  function _getReplacementNodes(node, bindableAttr, binding) {
    // Wrap the ko comment we will generate with an additional wrapper
    // with all of the attribute info that was on the original DOM node.
    // <!--oj-bind-for-each data='[[users]]' -->
    var nodeName = node.tagName.toLowerCase();
    var ojcommenttext = nodeName;
    var attrs = node.attributes;
    for (var i = 0; i < attrs.length; i++) {
      // jsperf says string concat is faster than array join, but
      // varies across browsers whether text += or text = text + is faster
      // the below method is fastest on Chrome and not bad on FF
      var attr = attrs[i];
      ojcommenttext += ' ';
      ojcommenttext += attr.name;
      ojcommenttext += "='";
      ojcommenttext += attr.value;
      ojcommenttext += "'";
    }

    var parent = node.parentNode;
    var ojOpenComment = document.createComment(ojcommenttext);
    var ojCloseComment = document.createComment('/' + nodeName);
    parent.insertBefore(ojOpenComment, node); // @HTMLUpdateOK
    // eslint-disable-next-line no-param-reassign
    node[OJ_BIND_CONVERTED_NODE] = ojOpenComment;

    var koOpenComment = document.createComment(binding);
    var koCloseComment = document.createComment('/ko');
    parent.insertBefore(koOpenComment, node); // @HTMLUpdateOK

    var newNodes = [ojOpenComment, koOpenComment];
    var child;
    // Copy oj-bind-x children into the comment node
    if (bindableAttr === 'if') {
      while (node.childNodes.length > 0) {
        child = node.childNodes[0];
        parent.insertBefore(child, node); // @HTMLUpdateOK
        newNodes.push(child);
      }
    } else if (bindableAttr === '_ojBindForEach_') {
      while (node.childNodes.length > 0) {
        child = node.childNodes[0];
        parent.insertBefore(child, node); // @HTMLUpdateOK
        newNodes.push(child);
      }
    }
    parent.insertBefore(koCloseComment, node); // @HTMLUpdateOK
    newNodes.push(koCloseComment);

    parent.replaceChild(ojCloseComment, node);
    newNodes.push(ojCloseComment);

    return newNodes;
  }

  function _getExpression(attrValue, stringify) {
    if (attrValue != null) {
      var exp = AttributeUtils.getExpressionInfo(attrValue).expr;
      if (exp == null) {
        if (stringify) {
          exp = "'" + attrValue + "'";
        } else {
          exp = attrValue;
        }
      }
      return exp;
    }

    return null;
  }

  function _setClassEvaluator(wrappedReturn, elem, value, bindingContext) {
    var evaluator;
    var exp = AttributeUtils.getExpressionInfo(value).expr;
    if (exp == null) {
      var resolvedValue = AttributeUtils.coerceValue(elem, 'class', value, 'any');
      evaluator = function () {
        return Array.isArray(resolvedValue) ? resolvedValue.join(' ') : resolvedValue;
      };
    } else {
      var classValueEvaluator = BindingProviderImpl.createEvaluator(exp, bindingContext).bind(
        null,
        bindingContext
      );
      // create computed to handle cases when an expression evaluates into an observable or
      // when expression evaluates into a function that mutates the value based on observable.
      evaluator = pureComputed(function () {
        var classValue = unwrap(classValueEvaluator());
        return Array.isArray(classValue) ? classValue.join(' ') : classValue;
      });
    }
    // eslint-disable-next-line no-param-reassign
    wrappedReturn.css = evaluator;
  }

  function _getValueEvaluator(elem, attr, value, bindingContext, type) {
    var exp = AttributeUtils.getExpressionInfo(value).expr;
    if (exp == null) {
      return function () {
        return type === 'object' ? AttributeUtils.coerceValue(elem, attr, value, type) : value;
      };
    }
    return BindingProviderImpl.createEvaluator(exp, bindingContext).bind(null, bindingContext);
  }

  function _getObjectEvaluator(attrEvaluators) {
    return function () {
      var evaluatedExprs = {};
      var attrs = Object.keys(attrEvaluators);
      for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];
        evaluatedExprs[attr] = attrEvaluators[attr]();
      }
      return evaluatedExprs;
    };
  }

  function _getBindings(node) {
    if (node.nodeType !== 1) {
      return {};
    }

    if (!node[_BINDINGS]) {
      // Iterate through all attributes on the element and find those that are using our
      // data bind attibute syntax
      var bindings = {};
      var boundAttrs = [];
      var boundStyle = [];
      var boundEvents = [];
      var attrs = node.attributes; // attrs is a NamedNodeMap
      for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];
        var unboundAttrName = _getUnboundAttrName(attr.name);
        if (unboundAttrName) {
          // An element can have a style binding or several style.* bindings.
          // Throw an error if both are present.
          if (unboundAttrName === 'style') {
            bindings._STYLE_BIND = unboundAttrName;
          } else if (unboundAttrName.substring(0, 6) === 'style.') {
            boundStyle.push(unboundAttrName);
          } else {
            boundAttrs.push(unboundAttrName);
          }
        }

        // Handle event binding for native HTML elements.
        // The event binding for custom elements is handled by the bridge.
        if (!isElementRegistered(node.nodeName) && attr.name.substring(0, 3) === 'on-') {
          boundEvents.push(attr);
        }
      }

      if (boundStyle.length) {
        if (bindings._STYLE_BIND) {
          throw new Error(
            'Cannot have both style and style.* data bound attributes on ' +
              node.tagName +
              ' with id ' +
              node.id
          );
        } else {
          bindings._STYLE_BIND = boundStyle;
        }
      }

      if (boundAttrs.length) {
        bindings._ATTR_BIND = boundAttrs;
      }

      if (boundEvents.length) {
        bindings._EVENT_BIND = boundEvents;
      }

      // Cache attribute map as a non-enumerable property so we don't have to loop again
      // in getBindingAccessors
      Object.defineProperty(node, _BINDINGS, { value: bindings });
    }
    return node[_BINDINGS];
  }

  function _getUnboundAttrName(attr) {
    if (attr && attr.charAt(0) === ':') {
      return attr.slice(1);
    }
    return null;
  }

  function _getBoundAttrName(attr) {
    return ':' + attr;
  }
})();

/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 *
 * @license
 * Knockout Fast Foreach v0.6.0 (2016-07-28T11:02:54.197Z)
 * By: Brian M Hunt (C) 2015 | License: MIT
 *
 * Adds `fastForEach` to `ko.bindingHandlers`.
 *
 * Modification notice: The code is obtained from https://github.com/brianmhunt/knockout-fast-foreach
 * and modified by Oracle JET team to be included into Oracle JET project.
 * @ignore
 */

(function () {
  'use strict';

  // index.js
  // --------
  // Fast For Each
  //
  // Employing sound techniques to make a faster Knockout foreach binding.
  // --------

  //      Utilities
  var MAX_LIST_SIZE = 9007199254740991;

  var supportsDocumentFragment = document && typeof document.createDocumentFragment === 'function';

  // Mimic a KO change item 'add'
  function valueToChangeAddItem(value, index, key) {
    return {
      status: 'added',
      value: value,
      index: index,
      key: key
    };
  }

  // Mimic a KO change item 'delete'
  function valueToChangeDeleteItem(index) {
    return {
      status: 'deleted',
      value: {},
      index: index
    };
  }

  // KO 3.4 doesn't seem to export this utility function so it's here just to be sure
  function createSymbolOrString(identifier) {
    // return typeof Symbol === 'function' ? Symbol(identifier) : identifier;
    return identifier;
  }

  // Array.prototype.map doesn't execute the mapping function on indices that don't have assigned values
  // so it would be a NOP for new Array(5).  Call this for loop based version instead
  function arrayMap(array, mapping) {
    var result;
    if (array) {
      var length = array.length;
      result = new Array(length);
      for (var i = 0; i < length; i++) {
        result[i] = mapping(array[i], i, array);
      }
    }
    return result;
  }

  function findNearestCustomParent(element, parentTrackingContext) {
    var parent = element.parentNode;
    while (parent && !ElementUtils.isValidCustomElementName(parent.localName)) {
      parent = parent.parentNode;
    }
    if (!parent) {
      parent = parentTrackingContext ? parentTrackingContext._nearestCustomParent : null;
    }
    return parent;
  }

  function findImmediateState(element, nearestCustomParent, parentTrackingContext) {
    var isImmediate = false;
    var nestedElement = !!parentTrackingContext;
    if (element.parentNode === nearestCustomParent) {
      isImmediate = true;
    } else if (nestedElement && !element.parentNode.parentNode) {
      isImmediate = parentTrackingContext._immediate;
    }
    return isImmediate;
  }

  function getTemplateNodes(elem) {
    var defaultTemplate;
    var noDataTemplate;
    var nodes = virtualElements.childNodes(elem);
    for (var i = 0; i < nodes.length; i++) {
      var testNode = nodes[i];
      if (testNode.nodeType === 1 && testNode.nodeName.toLowerCase() === 'template') {
        var slotAttr = CustomElementUtils.getSlotAssignment(testNode);
        if (!defaultTemplate && (!slotAttr || slotAttr === '')) {
          defaultTemplate = testNode;
        } else if (!noDataTemplate && slotAttr === 'noData') {
          noDataTemplate = testNode;
        } else {
          // error condition
          var errMessage;
          switch (slotAttr) {
            case '':
              errMessage =
                'Multiple default templates found: oj-bind-for-each requires a single default template element as its direct child';
              break;
            case 'noData':
              errMessage =
                'Multiple noData templates found: oj-bind-for-each requires a single noData template element as its direct child';
              break;
            default:
              errMessage =
                'Unknown template slot detected - ' +
                slotAttr +
                ': oj-bind-for-each supports a single default template and a single noData template';
          }
          throw new Error(errMessage);
        }
      }
    }
    if (!defaultTemplate) {
      throw new Error(
        'Default template not found: oj-bind-for-each requires a single default template element as its direct child'
      );
    }
    // eslint-disable-next-line no-param-reassign
    elem._templateNode = defaultTemplate;
    // eslint-disable-next-line no-param-reassign
    elem._noDataTemplateNode = noDataTemplate;
  }

  var insertAfterAndInvokeAttached = function (container, nodeOrNodeArray, insertAfterNode) {
    if (Array.isArray(nodeOrNodeArray)) {
      var frag = document.createDocumentFragment();

      for (let i = 0, len = nodeOrNodeArray.length; i !== len; ++i) {
        frag.appendChild(nodeOrNodeArray[i]);
      }

      virtualElements.insertAfter(container, frag, insertAfterNode); // @HTMLUpdateOK

      if (oj$2.Components) {
        for (let i = 0, len = nodeOrNodeArray.length; i !== len; ++i) {
          oj$2.Components.subtreeAttached(nodeOrNodeArray[i]);
        }
      }
    } else {
      virtualElements.insertAfter(container, nodeOrNodeArray, insertAfterNode); // @HTMLUpdateOK
      if (oj$2.Components) {
        oj$2.Components.subtreeAttached(nodeOrNodeArray);
      }
    }
  };

  // store a symbol for caching the pending delete info index in the data item objects
  var PENDING_DELETE_INDEX_KEY = createSymbolOrString('_ko_ffe_pending_delete_index');

  // Abandoned promise rejection for data provider
  var _ABANDONED_PROMISE_CHAIN = 'oj-bind-for-each: abandoned promise';

  /**
   * @constructor
   * @private
   * @since 4.1.0
   */
  function OjForEach(element, value, context) {
    this.element = value.element || element;
    // convert oj-bind-x components into template
    applyBindingsToDescendants(context, this.element);
    getTemplateNodes(this.element);

    // Find the correct context for the template - it is either the context
    // applied on this oj-bind-for-each element or a context applied on a swapped template
    // when oj-bind-slot was processed. We need to use the correct context for the template.
    this.element._templateNode.__ojBindingContext = contextFor(this.element._templateNode);
    this.data = value.data;
    this.as = value.as;
    this.changeQueue = [];
    this.firstLastNodesList = [];
    this.indexesToDelete = [];
    this.rendering_queued = false;
    this.pendingDeletes = [];

    // The headDataPromise and tailDataPromise are used to provide an order for Data Provider events:
    // - mutate events wait for the fetch event and any previous mutate events to finish
    // - the refresh event issued during ongoing fetch or mutation cancels ongoing chain
    // The headDataPromise is acting as an ID for the promise chain and tailDataPromise is
    // the latest promise in the chain of promises - used for chaining upcoming mutaition promises to it.
    // When the entire chain is resolved, the headDataPromise and tailDataPromise should be reset to null;
    this.headDataPromise = null;
    this.tailDataPromise = null;

    // Remove existing content.
    virtualElements.emptyNode(this.element);
    this._initChildrenBindingsAppliedPromise();

    var primeData = unwrap(this.data);
    if (primeData.fetchFirst) {
      // the data is a DataProvider object
      this.currentDataProvider = primeData;
      this.fetchData();
    } else {
      this.onArrayChange(arrayMap(primeData, valueToChangeAddItem));
    }
    this.addSubscriptions();
  }

  OjForEach.PENDING_DELETE_INDEX_KEY = PENDING_DELETE_INDEX_KEY;

  OjForEach.prototype.addSubscriptions = function () {
    var isObservable$1 = isObservable(this.data);
    if (this.currentDataProvider) {
      this.dataMutateHandler = this.handleDataMutateEvent.bind(this);
      this.dataRefreshHandler = this.handleDataRefreshEvent.bind(this);
      this.currentDataProvider.addEventListener('mutate', this.dataMutateHandler);
      this.currentDataProvider.addEventListener('refresh', this.dataRefreshHandler);
      if (isObservable$1) {
        this.changeSubs = this.data.subscribe(this.onDataChange, this, 'change');
      }
    } else if (isObservable$1) {
      if (!this.data.indexOf) {
        // observable but not an observable array
        // Make sure the observable is trackable.
        this.data = this.data.extend({ trackArrayChanges: true });
      }
      this.changeArraySubs = this.data.subscribe(this.onArrayDataChange, this, 'arrayChange');
      this.changeSubs = this.data.subscribe(this.onDataChange, this, 'change');
    }
  };

  OjForEach.prototype.removeSubscriptions = function () {
    if (this.changeSubs) {
      this.changeSubs.dispose();
    }
    if (this.changeArraySubs) {
      this.changeArraySubs.dispose();
    }
    if (this.currentDataProvider) {
      this.currentDataProvider.removeEventListener('mutate', this.dataMutateHandler);
      this.currentDataProvider.removeEventListener('refresh', this.dataRefreshHandler);
    }
  };

  OjForEach.prototype.onArrayDataChange = function (changeSet) {
    // temporary member, cleared on change event
    this.arrayChangeSet = changeSet;
  };

  OjForEach.prototype.onDataChange = function (changedData) {
    if (this.arrayChangeSet) {
      this.onArrayChange(this.arrayChangeSet);
      this.arrayChangeSet = null;
    } else {
      this.setData({
        data: this.data,
        dataProvider: changedData.fetchFirst ? changedData : null
      });
      this.recreateContent(changedData);
    }
  };

  OjForEach.prototype.recreateContent = function (changedData) {
    // clean up existing content
    this.changeQueue = [];
    this.firstLastNodesList = [];
    this.indexesToDelete = [];
    this.rendering_queued = false;
    this.pendingDeletes = [];
    this._noDataNodes = null;
    virtualElements.emptyNode(this.element);
    if (changedData.fetchFirst) {
      // refetch data and recreate the child nodes
      this.fetchData();
    } else {
      this.onArrayChange(arrayMap(changedData, valueToChangeAddItem));
    }
  };

  OjForEach.prototype.registerBusyState = function () {
    var containerElement = this.element.parentNode;
    var busyContext = Context.getContext(containerElement).getBusyContext();
    return busyContext.addBusyState({
      description:
        'oj-bind-for-each binding on a node with the Id ' + containerElement.id + 'is loading data.'
    });
  };

  // initializes a promise for expanding an element and applying bindings to its children
  OjForEach.prototype._initChildrenBindingsAppliedPromise = function () {
    var currentContext = this.element._templateNode.__ojBindingContext.$current;
    var parentTrackingContext = currentContext
      ? {
          _nearestCustomParent: currentContext._nearestCustomParent,
          _immediate: currentContext._immediate
        }
      : null;
    var nearestCustomParent = findNearestCustomParent(this.element, parentTrackingContext);
    var isImmediate = findImmediateState(this.element, nearestCustomParent, parentTrackingContext);
    this.trackingContext = {
      _nearestCustomParent: nearestCustomParent,
      _immediate: isImmediate
    };
    this._childrenBindingsPromiseResolver = _KnockoutBindingProvider
      .getInstance()
      .__RegisterBindingAppliedPromiseForChildren(nearestCustomParent, isImmediate);
  };

  // resolves _whenChildrenBindingsApplied promise for the element
  OjForEach.prototype._resolveChildrenBindingsAppliedPromise = function () {
    if (this._childrenBindingsPromiseResolver) {
      this._childrenBindingsPromiseResolver();
      this._childrenBindingsPromiseResolver = null;
    }
  };

  // Helper function that resets head and tail promises, then the entire chain is resolved
  // and there are no pending promises
  OjForEach.prototype.resetChainIfCompleted = function (currentDataPromise) {
    if (currentDataPromise === this.tailDataPromise) {
      this.headDataPromise = null;
      this.tailDataPromise = null;
    }
  };

  // Helper function that processes promise rejection and rethrows an error
  // unless the error is a valid or already caught one
  OjForEach.prototype.promiseRejectHelper = function (reason, busyStateCallback, currentPromise) {
    busyStateCallback();
    this.resetChainIfCompleted(currentPromise);
    if (reason._CAUGHT_PROMISE_REJECTION || reason.message === _ABANDONED_PROMISE_CHAIN) {
      info(reason);
    } else {
      if (reason instanceof Error) {
        // should reuse existing error to stop extra throws down the chain, can't rethrow a new one
        // the chain gets an original error
        // eslint-disable-next-line no-param-reassign
        reason._CAUGHT_PROMISE_REJECTION = true;
        throw reason;
      }
      throw new Error(reason);
    }
  };

  // This function is used to retrieve data from data provider - on initial update and
  // to handle refresh operation
  OjForEach.prototype.fetchData = function () {
    var busyStateCallback = this.registerBusyState();
    var iterator = this.currentDataProvider.fetchFirst({ size: -1 })[Symbol.asyncIterator]();
    var dataPromiseResolve;
    var dataPromiseReject;
    var headPromise;

    // function passed to iterator.next() promise on success, until result.done is set to true
    var getProcessResultsFunc = function (changeSet, onArrayChangeCallback, callbackObj) {
      return function (result) {
        if (callbackObj.headDataPromise === headPromise) {
          // current promise
          var value = result.value;
          var entryIndex = changeSet.length;
          for (var i = 0; i < value.metadata.length && i < value.data.length; i++) {
            changeSet.push(valueToChangeAddItem(value.data[i], entryIndex, value.metadata[i].key));
            entryIndex += 1;
          }
          if (result.done) {
            // finish up
            onArrayChangeCallback.call(callbackObj, changeSet);
            busyStateCallback();
            dataPromiseResolve();
            callbackObj.resetChainIfCompleted(headPromise);
          } else {
            iterator
              .next()
              .then(
                getProcessResultsFunc(changeSet, onArrayChangeCallback, callbackObj),
                function (reason) {
                  busyStateCallback();
                  dataPromiseReject(reason);
                  callbackObj.resetChainIfCompleted(headPromise);
                }
              );
          }
        } else {
          // abandoned promise
          busyStateCallback();
          dataPromiseReject(new Error(_ABANDONED_PROMISE_CHAIN));
        }
      };
    };

    // New head promise is created for the chain start.
    // The promise will be resolved on result.done() or rejected on errors.
    // All rejections are caught in the catch block and analyzed.
    // The abandoned promise rejections are ignored,
    // other rejections are thrown and marked with _CAUGHT_PROMISE_REJECTION
    // in order to prevent rethrowing in chained promises.
    headPromise = new Promise(
      function (resolve, reject) {
        dataPromiseResolve = resolve;
        dataPromiseReject = reject;
        iterator.next().then(
          getProcessResultsFunc([], this.onArrayChange, this),
          function (reason) {
            busyStateCallback();
            dataPromiseReject(reason);
            this.resetChainIfCompleted(headPromise);
          }.bind(this)
        );
      }.bind(this)
    );

    // the catch handles a case when the head promise does not have a chain and we need to catch valid rejection
    headPromise.catch(function (reason) {
      if (reason.message !== _ABANDONED_PROMISE_CHAIN) {
        if (reason instanceof Error) {
          // should reuse existing error to stop extra throws down the chain, can't rethrow a new one
          // the chain gets an original error
          // eslint-disable-next-line no-param-reassign
          reason._CAUGHT_PROMISE_REJECTION = true;
          throw reason;
        }
        throw new Error(reason);
      }
    });

    this.headDataPromise = headPromise;
    this.tailDataPromise = headPromise;
  };

  // This function populates an array of indexes either from event indexes or
  // from event keys
  OjForEach.prototype.getIndexesForEvent = function (eventIndexes, eventKeys) {
    var dataIndexes = [];
    var i;
    if (Array.isArray(eventIndexes)) {
      // use indexes if possible
      for (i = 0; i < eventIndexes.length; i++) {
        dataIndexes.push(eventIndexes[i]);
      }
    } else if (eventKeys) {
      // retrieve indexes from keys
      // eventKeys can be a Set or an Array, so we need to get the key count differently
      var eventKeysCount = Array.isArray(eventKeys) ? eventKeys.length : eventKeys.size;
      var eventKeySet = new KeySetImpl(eventKeys);
      var keyIndexMap = new Map();
      var count = 0;
      for (i = 0; i < this.firstLastNodesList.length && count < eventKeysCount; i++) {
        var nodeKey = this.firstLastNodesList[i].key;
        var eventKey = eventKeySet.get(nodeKey);
        if (eventKey !== eventKeySet.NOT_A_KEY) {
          keyIndexMap.set(eventKey, i);
          count += 1;
        }
      }

      eventKeys.forEach(function (keyValue) {
        dataIndexes.push(keyIndexMap.get(keyValue));
      });
    }
    return dataIndexes;
  };

  // Handler that processes "mutate" event from DataProvider
  OjForEach.prototype.handleDataMutateEvent = function (event) {
    // object that contains head and current promises, that we can't pass directly
    // to the function through the closure scope
    var busyStateCallback;
    var promiseContainer = {};
    var currentPromise;
    var self = this;

    if (this.tailDataPromise) {
      busyStateCallback = this.registerBusyState();
      currentPromise = this.tailDataPromise.then(function () {
        // success
        busyStateCallback();
        return self.getDataMutationHelper(event, promiseContainer);
      });
      currentPromise.catch(function (reason) {
        // error handler
        self.promiseRejectHelper(reason, busyStateCallback, currentPromise);
      });
    } else {
      currentPromise = this.getDataMutationHelper(event, promiseContainer);
      this.headDataPromise = currentPromise;
    }
    this.tailDataPromise = currentPromise;
    promiseContainer.head = this.headDataPromise;
    promiseContainer.current = currentPromise;
  };

  // Helper function that processes mutation event. If the event is asyncronous,
  // the function returns a promise, otherwise the function just updates existing data set,
  // returns either Promise for async mutation or undefined for sync mutation.
  OjForEach.prototype.getDataMutationHelper = function (event, promiseContainer) {
    var addDetail = event.detail.add;
    var removeDetail = event.detail.remove;
    var updateDetail = event.detail.update;
    var busyStateCallback;
    var dataPromise; // Define the promise when data are fetched - add or update event.

    // Used by doUpdates() and doAdditions(). The values could be assigned after fetch
    // if fetch is needed.
    var addData = addDetail && addDetail.data;
    var updateData = updateDetail && updateDetail.data;

    // Define helper methods for updates, removals and additions, that will be used for
    // both cases, when data are available and data are fetched
    var doUpdates = () => {
      if (updateData) {
        var dataIndex = 0;
        var changes = [];
        var dataIndexes = this.getIndexesForEvent(updateDetail.indexes, updateDetail.keys);
        updateDetail.keys.forEach(function (keyValue) {
          if (dataIndexes[dataIndex] !== undefined) {
            var dataItem = updateData[dataIndex];
            changes.push(valueToChangeDeleteItem(dataIndexes[dataIndex]));
            changes.push(valueToChangeAddItem(dataItem, dataIndexes[dataIndex], keyValue));
          }
          dataIndex += 1;
        });
        this.onArrayChange(changes);
      }
    };
    var doRemovals = () => {
      if (removeDetail) {
        // Get indexes to delete using either indexes or given keys
        var dataIndexes = this.getIndexesForEvent(removeDetail.indexes, removeDetail.keys);
        dataIndexes = dataIndexes.filter(function (value) {
          return value !== undefined;
        });
        this.onArrayChange(dataIndexes.map(valueToChangeDeleteItem));
      }
    };
    var doAdditions = () => {
      if (addData) {
        // The 'afterKeys' prop is deprecated, but continue to support it until we can remove it.
        // The getIndexesForEvent() method can take either array or set as its argument.
        var dataIndexes = this.getIndexesForEvent(
          addDetail.indexes,
          addDetail.addBeforeKeys ? addDetail.addBeforeKeys : addDetail.afterKeys
        );

        var getCurrentIndex = function (entryIndex) {
          var currentIndex =
            dataIndexes.length > entryIndex
              ? dataIndexes[entryIndex]
              : this.firstLastNodesList.length + entryIndex; // add entry to the end
          if (currentIndex === undefined) {
            return this.firstLastNodesList.length;
          }
          return currentIndex;
        };

        var changes = [];
        var dataIndex = 0; // Used to iterate trough eventData
        addDetail.keys.forEach(function (keyValue) {
          var dataItem = addData[dataIndex];
          changes.push(valueToChangeAddItem(dataItem, getCurrentIndex(dataIndex), keyValue));
          dataIndex += 1;
        }, this);
        this.onArrayChange(changes);
      }
    };

    // Some data were not sent, need to fetch data and work with promises.
    if ((updateDetail && !Array.isArray(updateData)) || (addDetail && !Array.isArray(addData))) {
      var updatePromise =
        updateDetail && !Array.isArray(updateData)
          ? this.currentDataProvider.fetchByKeys({ keys: updateDetail.keys })
          : Promise.resolve();
      var addPromise =
        addDetail && !Array.isArray(addData)
          ? this.currentDataProvider.fetchByKeys({ keys: addDetail.keys })
          : Promise.resolve();

      busyStateCallback = this.registerBusyState();
      dataPromise = Promise.all([updatePromise, addPromise]).then((keyResults) => {
        // successfully got all the data
        // if promise is current, retrieve records and update data set;
        // else throw valid rejection error
        if (promiseContainer.head === this.headDataPromise) {
          // Perform updates
          var updateKeyResults = keyResults[0];
          if (updateKeyResults && updateKeyResults.results.size > 0) {
            updateData = [...updateDetail.keys].map((key) => {
              return updateKeyResults.results.get(key).data;
            });
          }
          doUpdates();

          // Perform removals
          doRemovals();

          // Perform additions
          var addKeyResults = keyResults[1];
          if (addKeyResults && addKeyResults.results.size > 0) {
            addData = [...addDetail.keys].map((key) => {
              return addKeyResults.results.get(key).data;
            });
          }
          doAdditions();

          busyStateCallback();
          this.resetChainIfCompleted(promiseContainer.current);
        } else {
          // Promise is not current
          busyStateCallback();
          throw new Error(_ABANDONED_PROMISE_CHAIN);
        }
      });
      dataPromise.catch((reason) => {
        this.promiseRejectHelper(reason, busyStateCallback, promiseContainer.current);
      });
    } else {
      // We have all the data upfront - just do updates, removals and additions.
      doUpdates();
      doRemovals();
      doAdditions();
    }

    return dataPromise;
  };

  // Handler that processes "refresh" event from DataProvider
  OjForEach.prototype.handleDataRefreshEvent = function () {
    this.recreateContent(this.currentDataProvider);
  };

  // Renders noData template if necessary
  OjForEach.prototype._addNoData = function () {
    if (this.firstLastNodesList.length === 0 && this.element._noDataTemplateNode) {
      this._noDataNodes = templateEngine.execute(
        this.element,
        this.element._noDataTemplateNode,
        {},
        null
      );
      this.insertAllAfter(this._noDataNodes);
    }
  };

  // Removes nodes from noData Template, if they exist
  OjForEach.prototype._removeNoData = function () {
    if (this._noDataNodes) {
      this._noDataNodes.forEach((node) => {
        templateEngine.clean(node, this.element);
        node.parentNode.removeChild(node);
      });
      this._noDataNodes = null;
    }
  };

  // If the array changes we register the change.
  OjForEach.prototype.onArrayChange = function (changeSet) {
    this._removeNoData();
    var self = this;
    var changeMap = {
      added: [],
      deleted: []
    };
    var statusAdded = 'added';
    var statusDeleted = 'deleted';

    // knockout array change notification index handling:
    // - sends the original array indexes for deletes
    // - sends the new array indexes for adds
    // - sorts them all by index in ascending order
    // because of this, when checking for possible batch additions, any delete can be between to adds with neighboring indexes, so only additions should be checked
    for (var i = 0, len = changeSet.length; i < len; i++) {
      if (changeMap[statusAdded].length && changeSet[i].status === statusAdded) {
        var lastAdd = changeMap[statusAdded][changeMap[statusAdded].length - 1];
        var lastIndex = lastAdd.isBatch ? lastAdd.index + lastAdd.values.length - 1 : lastAdd.index;
        if (lastIndex + 1 === changeSet[i].index) {
          if (!lastAdd.isBatch) {
            // transform the last addition into a batch addition object
            lastAdd = {
              isBatch: true,
              status: statusAdded,
              index: lastAdd.index,
              values: [lastAdd.value],
              keys: [lastAdd.key]
            };
            changeMap[statusAdded].splice(changeMap[statusAdded].length - 1, 1, lastAdd);
          }
          lastAdd.values.push(changeSet[i].value);
          lastAdd.keys.push(changeSet[i].key);
        } else {
          changeMap[changeSet[i].status].push(changeSet[i]);
        }
      } else {
        changeMap[changeSet[i].status].push(changeSet[i]);
      }
    }

    if (changeMap[statusDeleted].length > 0) {
      this.changeQueue.push.apply(this.changeQueue, changeMap[statusDeleted]);
      this.changeQueue.push({ status: 'clearDeletedIndexes' });
    }
    this.changeQueue.push.apply(this.changeQueue, changeMap[statusAdded]);
    // Once a change is registered, the ticking count-down starts for the processQueue.
    if (this.changeQueue.length > 0 && !this.rendering_queued) {
      this.rendering_queued = true;
      self.processQueue();
    }
    this._addNoData();
    this._resolveChildrenBindingsAppliedPromise();
  };

  // Reflect all the changes in the queue in the DOM, then wipe the queue.
  OjForEach.prototype.processQueue = function () {
    var self = this;
    var lowestIndexChanged = MAX_LIST_SIZE;

    utils.arrayForEach(this.changeQueue, function (changeItem) {
      if (typeof changeItem.index === 'number') {
        lowestIndexChanged = Math.min(lowestIndexChanged, changeItem.index);
      }
      // console.log(self['data'](), "CI", JSON.stringify(changeItem, null, 2), JSON.stringify($(self.element).text()))
      self[changeItem.status](changeItem);
      // console.log("  ==> ", JSON.stringify($(self.element).text()))
    });
    this.flushPendingDeletes();
    this.rendering_queued = false;

    // Update our indexes.
    this.updateIndexes(lowestIndexChanged);

    this.changeQueue = [];
  };

  // Process a changeItem with {status: 'added', ...}
  /**
   * @expose
   * @ignore
   */
  OjForEach.prototype.added = function (changeItem) {
    var index = changeItem.index;
    var valuesToAdd = changeItem.isBatch ? changeItem.values : [changeItem.value];
    var keysToAdd = changeItem.isBatch ? changeItem.keys : [changeItem.key];
    var referenceElement = this.getLastNodeBeforeIndex(index);
    // gather all childnodes for a possible batch insertion
    var allChildNodes = [];

    for (var i = 0, len = valuesToAdd.length; i < len; ++i) {
      var childNodes;
      var currentChildContext;

      // we check if we have a pending delete with reusable nodesets for this data, and if yes, we reuse one nodeset
      var pendingDelete = this.getPendingDeleteFor(valuesToAdd[i]);
      if (pendingDelete && pendingDelete.nodesets.length) {
        childNodes = pendingDelete.nodesets.pop();
        currentChildContext = pendingDelete.currentChildContext;
      } else {
        currentChildContext = {
          data: valuesToAdd[i],
          index: index + i,
          observableIndex: observable()
        };
        Object.defineProperties(currentChildContext, {
          _nearestCustomParent: {
            value: this.trackingContext._nearestCustomParent,
            enumerable: false
          },
          _immediate: {
            value: this.trackingContext._immediate,
            enumerable: false
          }
        });
        childNodes = templateEngine.execute(
          this.element,
          this.element._templateNode,
          currentChildContext,
          this.as
        );
      }

      // Note discussion at https://github.com/angular/angular.js/issues/7851
      allChildNodes.push.apply(allChildNodes, Array.prototype.slice.call(childNodes));
      this.firstLastNodesList.splice(index + i, 0, {
        first: childNodes[0],
        last: childNodes[childNodes.length - 1],
        key: keysToAdd ? keysToAdd[i] : null,
        currentChildContext: currentChildContext
      });
    }

    this.insertAllAfter(allChildNodes, referenceElement);
  };

  OjForEach.prototype.getNodesForIndex = function (index) {
    var result = [];
    var ptr = this.firstLastNodesList[index].first;
    var last = this.firstLastNodesList[index].last;

    result.push(ptr);
    while (ptr && ptr !== last) {
      ptr = ptr.nextSibling;
      result.push(ptr);
    }
    return result;
  };

  OjForEach.prototype.getLastNodeBeforeIndex = function (index) {
    if (index < 1 || index - 1 >= this.firstLastNodesList.length) {
      return null;
    }
    return this.firstLastNodesList[index - 1].last;
  };

  OjForEach.prototype.insertAllAfter = function (nodeOrNodeArrayToInsert, insertAfterNode) {
    var i;
    var containerNode = this.element;

    if (nodeOrNodeArrayToInsert.length === 1) {
      insertAfterAndInvokeAttached(containerNode, nodeOrNodeArrayToInsert[0], insertAfterNode);
    } else if (supportsDocumentFragment) {
      insertAfterAndInvokeAttached(containerNode, nodeOrNodeArrayToInsert, insertAfterNode);
    } else {
      // Nodes are inserted in reverse order - pushed down immediately after
      // the last node for the previous item or as the first node of element.
      for (i = nodeOrNodeArrayToInsert.length - 1; i >= 0; --i) {
        var child = nodeOrNodeArrayToInsert[i];
        if (!child) {
          break;
        }
        insertAfterAndInvokeAttached(containerNode, child, insertAfterNode);
      }
    }
    return nodeOrNodeArrayToInsert;
  };

  // checks if the deleted data item should be handled with delay for a possible reuse at additions
  OjForEach.prototype.shouldDelayDeletion = function (data) {
    return data && (typeof data === 'object' || typeof data === 'function');
  };

  // gets the pending deletion info for this data item
  OjForEach.prototype.getPendingDeleteFor = function (data) {
    var index = data && data[PENDING_DELETE_INDEX_KEY];
    if (index === undefined) return null;
    return this.pendingDeletes[index];
  };

  // tries to find the existing pending delete info for this data item, and if it can't, it registeres one
  OjForEach.prototype.getOrCreatePendingDeleteFor = function (data) {
    var pd = this.getPendingDeleteFor(data);
    if (pd) {
      return pd;
    }
    pd = {
      data: data,
      nodesets: []
    };
    // eslint-disable-next-line no-param-reassign
    data[PENDING_DELETE_INDEX_KEY] = this.pendingDeletes.length;
    this.pendingDeletes.push(pd);
    return pd;
  };

  // Process a changeItem with {status: 'deleted', ...}
  /**
   * @expose
   * @ignore
   */
  OjForEach.prototype.deleted = function (changeItem) {
    // if we should delay the deletion of this data, we add the nodeset to the pending delete info object
    if (this.shouldDelayDeletion(changeItem.value)) {
      var pd = this.getOrCreatePendingDeleteFor(changeItem.value);
      pd.nodesets.push(this.getNodesForIndex(changeItem.index));
      pd.currentChildContext = this.firstLastNodesList[changeItem.index].currentChildContext;
    } else {
      // simple data, just remove the nodes
      this.removeNodes(this.getNodesForIndex(changeItem.index));
    }
    this.indexesToDelete.push(changeItem.index);
  };

  // removes a set of nodes from the DOM
  OjForEach.prototype.removeNodes = function (nodes) {
    if (!nodes.length) {
      return;
    }

    var removeFn = () => {
      var parent = nodes[0].parentNode;
      for (var i = nodes.length - 1; i >= 0; --i) {
        templateEngine.clean(nodes[i], this.element);
        parent.removeChild(nodes[i]);
      }
    };

    removeFn();
  };

  // flushes the pending delete info store
  // this should be called after queue processing has finished, so that data items and remaining (not reused) nodesets get cleaned up
  OjForEach.prototype.flushPendingDeletes = function () {
    for (var i = 0, len = this.pendingDeletes.length; i !== len; ++i) {
      var pd = this.pendingDeletes[i];
      while (pd.nodesets.length) {
        this.removeNodes(pd.nodesets.pop());
      }
      if (pd.data && pd.data[PENDING_DELETE_INDEX_KEY] !== undefined) {
        delete pd.data[PENDING_DELETE_INDEX_KEY];
      }
    }
    this.pendingDeletes = [];
  };

  // We batch our deletion of item indexes in our parallel array.
  // See brianmhunt/knockout-fast-foreach#6/#8
  /**
   * @expose
   * @ignore
   */
  OjForEach.prototype.clearDeletedIndexes = function () {
    // We iterate in reverse on the presumption (following the unit tests) that KO's diff engine
    // processes diffs (esp. deletes) monotonically ascending i.e. from index 0 -> N.
    for (var i = this.indexesToDelete.length - 1; i >= 0; --i) {
      this.firstLastNodesList.splice(this.indexesToDelete[i], 1);
    }
    this.indexesToDelete = [];
  };

  // Updates observableIndex property for the data
  OjForEach.prototype.updateIndexes = function (fromIndex) {
    for (var i = fromIndex, len = this.firstLastNodesList.length; i < len; ++i) {
      var ctx = this.firstLastNodesList[i].currentChildContext;
      if (ctx && ctx.observableIndex) {
        ctx.observableIndex(i);
      }
    }
  };

  // Getter used in ko.computed callback that monitors array replacements
  OjForEach.prototype.getData = function () {
    return { data: this.data, dataProvider: this.currentDataProvider };
  };

  // Setter used in ko.computed callback that monitors array replacements
  OjForEach.prototype.setData = function (obj) {
    this.removeSubscriptions();
    this.data = obj.data;
    this.currentDataProvider = obj.dataProvider;
    this.addSubscriptions();
  };

  bindingHandlers._ojBindForEach_ = {
    // Valid valueAccessors:
    //    {data: array, as: string}
    init: function init(element, valueAccessor, bindings, vm, context) {
      var ffe;
      var value;

      computed(
        function () {
          // : watch for array modifications, that are not covered by addSubscriptions() call:
          // - non-observable array replacement triggered by CCA
          // - array data defined with expression
          value = valueAccessor();
          if (ffe) {
            var updatedValues = value.data;
            var currentValues = ffe.getData().data;
            var currentPrimeData;
            var updatedPrimeData;
            // retrive the array data that might be defined as an observable
            ignoreDependencies(function () {
              currentPrimeData = unwrap(currentValues);
              updatedPrimeData = unwrap(updatedValues);
            });
            ffe.setData({
              data: updatedValues,
              dataProvider: updatedPrimeData.fetchFirst ? updatedPrimeData : null
            });
            if (Array.isArray(currentPrimeData) && Array.isArray(updatedPrimeData)) {
              // compare arrays and update rendered DOM
              // initialize options for ko.utils.compareArrays
              // 'dontLimitMoves':true recommended for newer code, 'sparse':true is used for trackArray changes
              var compareArrayOptions = { sparse: true, dontLimitMoves: true };
              var changeSet = utils.compareArrays(
                currentPrimeData,
                updatedPrimeData,
                compareArrayOptions
              );
              ffe.onArrayChange(changeSet);
            } else {
              // recreate content in all other cases
              ffe.recreateContent(updatedPrimeData);
            }
          }
        },
        null,
        { disposeWhenNodeIsRemoved: element }
      );

      ffe = new OjForEach(element, value, context);

      utils.domNodeDisposal.addDisposeCallback(element, function () {
        ffe.removeSubscriptions();
      });
      return { controlsDescendantBindings: true };
    }
  };

  virtualElements.allowedBindings._ojBindForEach_ = true;
})();

oj$1._registerLegacyNamespaceProp('ResponsiveKnockoutUtils', ResponsiveKnockoutUtils);
oj$1._registerLegacyNamespaceProp('KnockoutTemplateUtils', KnockoutTemplateUtils);

/**
 * @ignore
 */
(function () {
  BindingProviderImpl.addPostprocessor({
    nodeHasBindings: function (node, nodeHasBindings) {
      return nodeHasBindings || (node.nodeType === 1 && node.nodeName.toLowerCase() === 'oj-if');
    },
    getBindingAccessors: function (node, bindingContext, _wrappedReturn) {
      let wrappedReturn = _wrappedReturn;
      if (node.nodeType === 1 && node.localName === 'oj-if') {
        const evaluator = _getEvaluator(node, bindingContext);
        wrappedReturn = wrappedReturn || {};
        wrappedReturn.if = () => {
          return unwrap(evaluator(bindingContext));
        };
        wrappedReturn.style = () => {
          return { display: 'contents' };
        };
      }
      return wrappedReturn;
    }
  });

  function _getEvaluator(node, bindingContext) {
    if (!node.hasAttribute('test')) {
      throw new Error("Missing the required 'test' attribute on <oj-if>");
    }
    const attrValue = node.getAttribute('test');
    const exprInfo = AttributeUtils.getExpressionInfo(attrValue);
    return BindingProviderImpl.createEvaluator(
      exprInfo.expr ? exprInfo.expr : attrValue,
      bindingContext
    );
  }
})();

/**
 * @ojmodule ojknockout
 * @ojcomponent oj.ojIf
 * @ojshortdesc An oj-if renders its contents only if a provided test returns true.
 * @ojsignature {target: "Type", value: "class ojIf extends HTMLElement"}
 * @ojhtmlelement
 * @since 17.0.0
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["test"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 1
 *
 * @ojoracleicon 'oj-ux-ico-if'
 *
 * @classdesc
 * <h3 id="overview-section">
 *   JET If Element
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview-section"></a>
 * </h3>
 * <p>Use &lt;oj-if&gt; to conditionally render its contents only if a provided test
 * returns true. Unlike &lt;[oj-bind-if]{@link oj.ojBindIf}&gt; this element will not be removed from
 * the DOM after bindings are applied. The element stays in the DOM and can therefore directly be used
 * as the slot content of a custom element. The element has display:contents style
 * applied on it to make it transparent for any css styles that a parent container wants to
 * pass to its descendants.
 * </p>
 *
 * @example <caption>Initialize the oj-if:</caption>
 * &lt;oj-if test='[[myTest]]'>
 *   &lt;div>Conditional content: &lt;oj-bind-text value="[[myValue]]">&lt;/oj-bind-text>&lt;/div>
 * &lt;/oj-if>
 */

/**
 * The test condition for the if clause. The children of the element will
 * only be rendered if the test is true.
 * @expose
 * @name test
 * @memberof oj.ojIf
 * @instance
 * @type {boolean}
 * @example <caption>Initialize the oj-if:</caption>
 * &lt;oj-if test='[[myTest]]'>
 *   &lt;div>Conditional content: &lt;oj-bind-text value="[[myValue]]">&lt;/oj-bind-text>&lt;/div>
 * &lt;/oj-if>
 */

/**
 * <p>The <code class="prettyprint">oj-if</code> default slot is used to
 * specify content that will be rendered when the test condition evaluates to
 * true.
 *
 * @ojchild Default
 * @memberof oj.ojIf
 * @instance
 * @expose
 */

/**
 * @ojmodule ojknockout
 * @ojcomponent oj.ojBindForEach
 * @ojshortdesc An oj-bind-for-each binds items of an array to the specified markup section. The markup section is duplicated for each array item when element is rendered.
 * @ojbindingelement
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @ojtsimport knockout
 * @ojsignature {target: "Type",
 *               value: "class ojBindForEach<K, D> extends HTMLElement",
 *               genericParameters: [{"name": "K", "description": "Type of key when passing data via a DataProvider"},
 *                                   {"name": "D", "description": "Type of row data being iterated"}]}
 * @since 4.1.0
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["data"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 1
 *
 * @ojoracleicon 'oj-ux-ico-for-each'
 *
 * @classdesc
 * <h3 id="oj-for-each-overview-section">
 *   ForEach Binding
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#oj-for-each-overview-section"></a>
 * </h3>
 * <p>Use &lt;oj-bind-for-each&gt; to bind items of an array to the specified markup section.
 * The markup section is duplicated for each array item when element is rendered.
 * &lt;oj-bind-for-each&gt; requires the application to specify a single &lt;template&gt; element
 * as its direct child.  The markup being stamped out should be placed inside of this &lt;template&gt; element.
 * </p>
 * <p>Note that the &lt;oj-bind-for-each&gt; element will be removed from the DOM after binding is applied.
 * For slotting, applications need to wrap the oj-bind-for-each element inside another HTML element (e.g. &lt;span&gt;) with the slot attribute.
 * The oj-bind-for-each element does not support the slot attribute.</p>
 * <p>Also note that if you want to build an HTML table using &lt;oj-bind-for-each&gt; element the html content must be parsed
 * by <a href="HtmlUtils.html#.stringToNodeArray">HtmlUtils.stringToNodeArray()</a> method. Keep in mind that the composite
 * views and the oj-module views that are loaded via ModuleElementUtils are already using that method. Thus to create
 * a table you can either place the content into a view or call HtmlUtils.stringToNodeArray() explicitly to process the content.</p>
 *
 * @example <caption>Initialize the oj-bind-for-each - access data using <code>$current</code>:</caption>
 *  &lt;oj-bind-for-each data='[{"type":"Apple"},{"type":"Orange"}]'>
 *    &lt;template>
 *      &lt;p>&lt;oj-bind-text value='[[$current.data.type]]'>&lt;/oj-bind-text>&lt;/p>
 *    &lt;/template>
 *  &lt;/oj-bind-for-each>
 *
 * @example <caption>Initialize the oj-bind-for-each - access data using alias:</caption>
 *  &lt;oj-bind-for-each data="[[fruits]]">
 *    &lt;template data-oj-as="fruit">
 *      &lt;p>&lt;oj-bind-text value="[[fruit.data.type]]">&lt;/oj-bind-text>&lt;/p>
 *    &lt;/template>
 *  &lt;/oj-bind-for-each>
 */

/**
 * The array or an DataProvider that you wish to iterate over. Required property.
 * Note that the &lt;oj-bind-for-each&gt; will dynamically update the generated
 * DOM in response to changes if the value is an observableArray, or in response
 * to DataProvider events.
 * @expose
 * @name data
 * @memberof oj.ojBindForEach
 * @ojshortdesc The array or DataProvider that you wish to iterate over. See  the Help documentation for more information.
 * @instance
 * @type {array|Object}
 * @ojsignature {target: "Type", value:"Array<D>|DataProvider<K, D>", jsdocOverride:true}
 */

/**
 * An alias for the array item. This can be especially useful
 * if multiple oj-bind-for-each elements are nested to provide access to the data
 * for each level of iteration.
 * @expose
 * @name as
 * @memberof oj.ojBindForEach
 * @ojshortdesc An alias for the array item. This is useful if multiple oj-bind-for-each elements are nested to provide access to the data for each iteration level.
 * @instance
 * @type {string}
 * @ojtsignore
 * @ojdeprecated {since: '6.2.0', description: 'Set the alias directly on the template element using the data-oj-as attribute instead.'}
 */
// default slot
/**
 * <p>The <code class="prettyprint">oj-bind-for-each</code> default slot is used to specify the template for binding items of an array.
 * The slot content must be a &lt;template> element.</p>
 * <p>When the template is executed for each item, it will have access to the same binding context that is applied to the &lt;oj-bind-for-each&gt; element.
 * In addition the binding context will contain the following properties:</p>
 * <ul>
 *   <li>$current - An object that contains information for the current item. (See the table below for a list of properties available on $current) </li>
 *   <li>alias - If <b>as</b> attribute was specified, the value will be used to provide an application-named alias for <code>$current</code>.
 *               This can be especially useful if multiple oj-bind-for-each elements are nested to provide access to the data for each level of iteration.
 *   </li>
 * </ul>
 *
 * @ojchild Default
 * @ojmaxitems 1
 * @ojshortdesc The oj-bind-for-each default slot is used to specify the template for binding items of an array if no named slots were defined by the application.
 * @memberof oj.ojBindForEach
 * @ojtemplateslotprops oj.ojBindForEach.DefaultItemContext
 * @instance
 * @expose
 */

/**
 * <p>The <code class="prettyprint">noData</code> slot is used to specify the content to display when the data is empty.
 * The slot content must be a &lt;template> element.  If the slot is not specified no content will be rendered.
 * The template slot will be executed with an empty context object.
 *
 * @ojslot noData
 * @ojshortdesc The noData slot is used to specify the content to render when the data is empty.
 * @ojmaxitems 1
 * @memberof oj.ojBindForEach
 * @ojtemplateslotprops {}
 * @ojtemplateslotrendertype "RenderNoDataTemplate"
 *
 * @ojtsexample <caption>Initialize the oj-bind-for-each with a noData slot specified:</caption>
 * &lt;oj-bind-for-each>
 *   &lt;template>
 *    &lt;oj-bind-text value="[[$current.data.name]]">&lt;/oj-bind-text>
 *   &lt;template>
 *   &lt;template slot='noData'>
 *     &lt;span>&lt;oj-button>Add item&lt;/span>
 *   &lt;template>
 * &lt;/oj-bind-for-each>
 */

/**
 * @typedef {Object} oj.ojBindForEach.DefaultItemContext
 * @property {Object} data The current array item being rendered.
 * @property {number} index Zero-based index of the current array item being rendered. The index value is not updated in response to array additions and removals and is only recommended for static arrays.
 * @property {number} observableIndex An observable that refers to the zero-based index of the current array item being rendered. The <code>observableIndex</code> value is updated in response to array additions and removals and can be used for both static and dynamic arrays.
 * @ojsignature [{for: "data", target: "Type", value: "D"},
 *               {for: "genericTypeParameters", target: "Type", value: "<D>"},
 *               {for: "observableIndex", target: "Type", value: "ko.Observable<number>"}]
 */

/**
 * @ojmodule ojknockout
 * @ojcomponent oj.ojBindIf
 * @ojshortdesc An oj-bind-if renders its contents only if a provided test returns true.
 * @ojsignature {target: "Type", value: "class ojBindIf extends HTMLElement"}
 * @ojbindingelement
 * @since 4.1.0
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["test"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 1
 *
 * @ojoracleicon 'oj-ux-ico-if'
 *
 * @classdesc
 * <h3 id="overview-section">
 *   If Binding
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview-section"></a>
 * </h3>
 * <p>Use &lt;oj-bind-if&gt; to conditionally render its contents only if a provided test
 * returns true. Note that the &lt;oj-bind-if&gt; element will be removed from the DOM
 * after binding is applied.For slotting, applications need to wrap the oj-bind-if element
 * inside another HTML element (e.g. &lt;span&gt;) with the slot attribute. The oj-bind-if element does not support
 * the slot attribute. </p>
 *
 * <p>Consider using &lt;oj-if&gt; element if you want conditionally render
 * content of a slot or if you want the element to stay in the DOM. See &lt;[oj-if]{@link oj.ojIf}&gt; for more details.</p>
 *
 * @example <caption>Initialize the oj-bind-if:</caption>
 * &lt;oj-bind-if test='[[myTest]]'>
 *   &lt;div>My Contents&lt;/div>
 * &lt;/oj-bind-if>
 */

/**
 * The test condition for the if clause. The children of the element will
 * only be rendered if the test is true.
 * @expose
 * @name test
 * @memberof oj.ojBindIf
 * @instance
 * @type {boolean}
 * @example <caption>Initialize the oj-bind-if:</caption>
 * &lt;oj-bind-if test='[[myTest]]'>
 *   &lt;div>My Contents&lt;/div>
 * &lt;/oj-bind-if>
 */

/**
 * <p>The <code class="prettyprint">oj-bind-if</code> default slot is used to
 * specify content that will be rendered when the test condition evaluates to
 * true.
 *
 * @ojchild Default
 * @memberof oj.ojBindIf
 * @instance
 * @expose
 */

/**
 * @ojmodule ojknockout
 * @ojcomponent oj.ojBindText
 * @ojshortdesc An oj-bind-text binds a text node to an expression.
 * @ojsignature {target: "Type", value: "class ojBindText extends HTMLElement"}
 * @ojbindingelement
 * @since 4.1.0
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["value"]}
 * @ojvbdefaultcolumns 2
 * @ojvbmincolumns 1
 *
 * @ojoracleicon 'oj-ux-ico-select-text'
 *
 * @classdesc
 * <h3 id="overview-section">
 *   Text Binding
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview-section"></a>
 * </h3>
 * <p>Use &lt;oj-bind-text&gt; to generate a text node with the resolved expression. Note that the
 * &lt;oj-bind-text&gt; element will be removed from the DOM after binding is
 * applied, and any child elements it has will be removed. For slotting, applications
 * need to wrap the oj-bind-text element inside another HTML element (e.g. &lt;span&gt;) with the slot attribute.
 * The oj-bind-text element does not support the slot attribute.</p>
 *
 * <p>Note: Since the element sets its value using a text node, it is safe to set any string value
 * without risking HTML or script injection.</p>
 *
 * @example <caption>Initialize the oj-bind-text:</caption>
 * &lt;span>
 *   &lt;oj-bind-text value='[[myText]]'>&lt;/oj-bind-text>
 * &lt;/span>
 */

/**
 * The value of the text node.
 * @expose
 * @name value
 * @memberof oj.ojBindText
 * @instance
 * @type {string}
 * @ojtranslatable
 * @example <caption>Initialize the oj-bind-text:</caption>
 * &lt;span>
 *   &lt;oj-bind-text value='[[myText]]'>&lt;/oj-bind-text>
 * &lt;/span>
 */

export { ComponentBinding, ComponentChangeTracker, __ExpressionUtils };
