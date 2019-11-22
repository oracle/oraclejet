/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcontext', 'knockout', 'ojs/ojkeysetimpl', 'ojs/ojknockouttemplateutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojlogger',  'ojs/ojkoshared', 'ojs/ojtemplateengine', 'jqueryui-amd/widget'], 
function(oj, $, Context, ko, KeySetImpl, KnockoutTemplateUtils, ResponsiveKnockoutUtils, Logger, BindingProviderImpl, templateEngine)
{
  "use strict";
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



/* jslint browser: true, devel: true */

/* global ComponentChangeTracker:false, ko:false, GlobalChangeQueue:false, BindingProviderImpl: false, Logger:false */

/**
 * To create a custom binding,
 * use oj.ComponentBinding.create(). Using prototypal inheritance to extend
 * oj.ComponentBinding is not supported.
 * @export
 * @class oj.ComponentBinding
 * @classdesc JQueryUI component binding for Knockout.js.
 * @param {string|Array.<string>} name - the name of the binding or an
 * array of strings in case the binding needs to be registered under several names
 * @param {?(Object|string)=} options - property object
 * @see oj.ComponentBinding.create
 * @constructor
 * @since 1.0
 * @hideconstructor
 * @ojtsignore
 */
oj.ComponentBinding = function (name, options) {
  this.Init(name, options);
};

oj.Object.createSubclass(oj.ComponentBinding, oj.Object, 'oj.ComponentBinding');
/**
 * Creates a binding instance and registers it with Knockout.js
 * @export
 * @param {string|Array.<string>} name - the name of the binding or an
 * array of strings in case the binding needs to be registered under several names
 * @param {?(Object|string)=} options - property object with the following fields:
 * <ul>
 *   <li>{string} 'componentName' - name of the component
 *       Not specifying this parameter indicates that the binding should use the 'component' attribute
 *       on itself to determine the constructor name
 *   </li>
 *   <li>{Function} 'afterCreate'- a callback invoked after the component instance has been created.
 *        The function will receive the following parameters:
 *        <ul>
 *           <li>{Element} element - DOM element associated with this binding</li>
 *           <li>{Function} widgetConstructor - constructor for the JQueryUI widget created
 *            by this binding. The constructor is already bound to the associated
 *            JQuery element</li>
 *           <li>{Function} valueAccessor - a JavaScript function that you can call to
 *           get a map of current binding attributes</li>
 *           <li>{Object} allBindings -  a JavaScript object that you can use to access all the model values bound
 *           to this DOM element</li>
 *           <li>{Object} bindingContext -  an object that holds the binding context available to this element's bindings.
 *           This object includes special properties including $parent, $parents, and $root that can be used to access
 *           data that is bound against ancestors of this context</li>
 *        </ul>
 *   </li>
 *   <li>{Function} 'beforeDestroy'- a callback invoked before the component instance is detroyed
 *        The function will receive the same parameters as the 'afterCreate' callback above.
 *   </li>
 * </ul>
 * When this parameter is specified as a string, it will be interpreted as a single 'componentName' option
 * @return {oj.ComponentBinding} binding instance
 */

oj.ComponentBinding.create = function (name, options) {
  if (name == null) {
    throw new Error('Binding name is required!');
  }

  var instance = new oj.ComponentBinding(name, options);
  var handlers = ko.bindingHandlers;
  var names = Array.isArray(name) ? name : [name];

  for (var i = 0; i < names.length; i++) {
    var nm = names[i];

    oj.ComponentBinding._REGISTERED_NAMES.push(nm);

    handlers[nm] = instance;
  }

  return instance;
};
/**
 * Retrieves the default component binding instance registered with Knockout.js
 * @return {oj.ComponentBinding} default binding instance
 * @export
 */


oj.ComponentBinding.getDefaultInstance = function () {
  return oj.ComponentBinding._INSTANCE;
};
/**
 * Sets up custom handling for attributes that will be managed by this binding
 * instance
 * @param {Object} opts - property object with the following fields:
 * <ul>
 *   <li>'attributes' - string array of attribue names</li>
 *   <li>{Function} 'init' - a function called when a managed attribute is initialized.
 *        The function will receive the following parameters:
 *        <ul>
 *           <li>{string} name - attribute name</li>
 *           <li>{Object} value - attribute value</li>
 *           <li>{Element} element - DOM element where this binding is being attached</li>
 *           <li>{Function} widgetConstructor - constructor for the JQueryUI widget created
 *            by this binding. The constructor is already bound to the associated
 *            JQuery element</li>
 *           <li>{Function} valueAccessor - a JavaScript function that you can call to
 *           get a map of current binding attributes</li>
 *           <li>{Object} allBindings -  a JavaScript object that you can use to access all the model values bound
 *           to this DOM element</li>
 *           <li>{Object} bindingContext -  an object that holds the binding context available to this element's bindings.
 *           This object includes special properties including $parent, $parents, and $root that can be used to access
 *           data that is bound against ancestors of this context</li>
 *        </ul>
 *        The optional return value of the function is a name-to-value map of
 *        properties that should be set on the component
 *   </li>
 *   <li>{Function} 'update' - a function called when a managed attribute is updated.
 *        The function will receive the same parameters as the 'init' callback above.
 *        The optional return value of the function is a name-to-value map of
 *        properties that should be set on the component at the time when other
 *        accumulated changes are delivered
 *   </li>
 *   <li>{Function} 'afterCreate'- a callback invoked after the component instance has been created.
 *        The function will receive the following parameters:
 *        <ul>
 *           <li>{string} name - attribute name</li>
 *           <li>{Element} element - DOM element associated with this binding</li>
 *           <li>{Function} widgetConstructor - constructor for the JQueryUI widget created
 *            by this binding. The constructor is already bound to the associated
 *            JQuery element</li>
 *           <li>{Function} valueAccessor - a JavaScript function that you can call to
 *           get a map of current binding attributes</li>
 *           <li>{Object} allBindings -  a JavaScript object that you can use to access all the model values bound
 *           to this DOM element</li>
 *           <li>{Object} bindingContext -  an object that holds the binding context available to this element's bindings.
 *           This object includes special properties including $parent, $parents, and $root that can be used to access
 *           data that is bound against ancestors of this context</li>
 *        </ul>
 *   </li>
 *   <li>{string} 'for' (optional) - a string representing component type or constructor
 *        name restricting the applicability of these managed attributes
 *   </li>
 *   <li>{Array.<string>} 'use' (optional) - an string array of component types whose managed attribute behavior
 *       should be used for the component type specified with the 'for' attribute
 *   </li>
 *   <li>{Function} 'beforeDestroy'- a callback invoked before the component instance is detroyed
 *        The function will receive the same parameters as the 'afterCreate' callback above.
 *   </li>
 * </ul>
 * @return {void}
 * @export
 */


oj.ComponentBinding.prototype.setupManagedAttributes = function (opts) {
  var forName = opts.for;
  forName = forName == null ? '@global' : forName;
  var managers = this._managedAttrOptions[forName] || [];
  managers.push(opts);
  this._managedAttrOptions[forName] = managers;
};
/**
 * Delivers all accumulated component changes across all instances of this binding.
 * Calling this method is optional - the changes will be delivered after a 1ms timeout
 * if this method is never invoked. However, you may call this method to speed up
 * component updates when the aplication code is done updating the view models.
 * @return {void}
 * @export
 */


oj.ComponentBinding.deliverChanges = function () {
  BindingProviderImpl.getGlobalChangeQueue().deliverChanges();
};
/**
 * @private
 */


oj.ComponentBinding.prototype.Init = function (names, options) {
  oj.ComponentBinding.superclass.Init.call(this);

  if (typeof options === 'string') {
    // eslint-disable-next-line no-param-reassign
    options = {
      componentName: options
    };
  }

  this._bindingOptions = options || {};
  this._bindingNames = Array.isArray(names) ? names : [names];
  this.init = this._init.bind(this);
  this.update = this._update.bind(this);
  this._managedAttrOptions = {};
};
/**
 * @private
 */


oj.ComponentBinding.prototype._getBindingOptions = function () {
  return this._bindingOptions;
};
/**
 * @private
 */


oj.ComponentBinding.prototype._init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
  // Invoke child bindings first to allow on-the-fly generation of child content
  ko.applyBindingsToDescendants(bindingContext, element);
  return {
    controlsDescendantBindings: true
  };
};
/**
 * @private
 */


oj.ComponentBinding.prototype._update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
  // an array of ko.computed() that would need cleaning up
  var componentComputeds = [];
  var stage = 0; // init

  var component;
  var changeTracker;
  var jelem = $(element);

  function cleanup(destroyComponent) {
    componentComputeds.forEach(function (computed) {
      computed.dispose();
    });
    componentComputeds = []; // when cleanup() is called by the node disposal, there is no need to destroy the component because cleanNode() will
    // do it for us

    if (destroyComponent && component) {
      component('destroy');
      component = null;
    }

    if (changeTracker) {
      changeTracker.dispose();
      changeTracker = null;
    }

    jelem.off(oj.ComponentBinding._HANDLER_NAMESPACE);
  }

  function createComponent(componentName, nameOption, bindingValue) {
    if (componentName == null) {
      // null component name is legal - we just won't create a components
      return;
    }

    var comp = jelem[componentName];

    if (typeof comp !== 'function') {
      Logger.error('Component %s is not found', componentName);
      return;
    }

    comp = comp.bind(jelem);

    var updaterCallback = function updaterCallback(changes) {
      var mutationOptions = oj.ComponentBinding.__removeDotNotationOptions(changes);

      comp('option', changes);
      var keys = Object.keys(mutationOptions);

      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];
        comp('option', key, mutationOptions[key]);
      }
    };

    changeTracker = new ComponentChangeTracker(updaterCallback, BindingProviderImpl.getGlobalChangeQueue()); // Create a compatible valueAccessor for backward compatibility with the managed attributes and custom bindings that
    // expect the ojComponent value to be defined inline. We can use already-resolved binding value here because the component
    // will be recreated whenever the binding value changes, and this method will be called with the new binding value

    var compatibleValueAccessor = function compatibleValueAccessor() {
      return bindingValue;
    };

    var specifiedOptions = Object.keys(bindingValue).filter(function (value) {
      return !(value == null || value === nameOption);
    });
    var componentContext = {
      component: comp,
      changeTracker: changeTracker,
      componentName: componentName,
      specifiedOptions: specifiedOptions,
      computeds: componentComputeds,
      valueAccessor: compatibleValueAccessor,
      allBindingsAccessor: allBindingsAccessor,
      bindingContext: bindingContext,
      destroyCallback: function destroyCallback() {
        component = null;
      },
      readOnlyProperties: {}
    };
    component = this._initComponent(element, componentContext);
  } // Since we want the update() method to be invoked by Knockout only once, we are suspending dependency detection


  ko.ignoreDependencies(function () {
    ko.computed(function () {
      // invoking valueAccessor() adds a dependency on the bidning value and the possible observable ViewModel
      // to this computed, and unwrapping the observable adds a dependency on the observable binding value
      var bindingValue = ko.utils.unwrapObservable(valueAccessor());

      if (_typeof(bindingValue) !== 'object') {
        Logger.error('ojComponent binding should evaluate to an object');
      }

      var componentName = this._bindingOptions.componentName;
      var nameOpt;
      var nameOptionFound = false;

      if (componentName == null && bindingValue != null) {
        var nameAttrs = [oj.ComponentBinding._COMPONENT_OPTION, 'role'];

        for (var n = 0; !nameOptionFound && n < nameAttrs.length; n++) {
          nameOpt = nameAttrs[n];

          if (nameOpt in bindingValue) {
            nameOptionFound = true;
            componentName = bindingValue[nameOpt];
          }
        }

        if (!nameOptionFound) {
          Logger.error('component attribute is required for the ojComponent binding');
        }

        componentName = ko.utils.unwrapObservable(componentName);
      }

      if (stage === 0) {
        stage = 1;
      } else {
        // Suspend dependency detection for this computed during cleanup()
        ko.ignoreDependencies(cleanup, this, [true]);
      } // Suspend dependency detection for this computed during createComponent(). Changes to the component options
      // will be tracked separately


      ko.ignoreDependencies(createComponent, this, [componentName, nameOpt, bindingValue]);
    }, this, {
      disposeWhenNodeIsRemoved: element
    });
  }, this); // cleanup() called by the node disposal should not be destroying components, as they will be destroyed by .cleanNode()

  ko.utils.domNodeDisposal.addDisposeCallback(element, cleanup.bind(this, false
  /* destroyComponent flag*/
  ));
};
/**
 * @private
 */


oj.ComponentBinding.prototype._initComponent = function (element, ctx) {
  var disposed = false;
  var stage = 0; // init

  var specifiedManagedAttrs = {};
  var jelem = $(element);
  var comp = ctx.component;
  var componentName = ctx.componentName;
  var self = this;
  var destroyEventType = '_ojDestroy';

  var destroyListener = function destroyListener(evt) {
    if (evt.target && evt.target === element) {
      // ensure that we do not try to destroy the component again during node cleanup
      ctx.destroyCallback();
      var destroyCallback = self._bindingOptions.beforeDestroy;

      if (destroyCallback) {
        destroyCallback(element, comp, ctx.valueAccessor, ctx.allBindingsAccessor, ctx.bindingContext);
      }

      oj.ComponentBinding._deliverCreateDestroyEventToManagedProps(false, specifiedManagedAttrs, element, comp, ctx.valueAccessor, ctx.allBindingsAccessor, ctx.bindingContext);

      disposed = true;
      ctx.changeTracker.dispose();
      element.removeEventListener(destroyEventType, destroyListener);
    }
  };

  element.addEventListener(destroyEventType, destroyListener);

  var managedAttrMap = oj.ComponentBinding._resolveManagedAttributes(this._managedAttrOptions, ctx.specifiedOptions, componentName); // Always use managed attribute behavior from the default instance


  var defaultInstance = oj.ComponentBinding.getDefaultInstance();

  if (this !== defaultInstance) {
    var defaultManagedMap = defaultInstance._getManagedAttributes(ctx.specifiedOptions, componentName); // Override default managed attribute map with values from this binding's map.
    // Note that there is no need to clone defaultManagedMap because a new instance gets created
    // every time _getManagedAttributes() is called


    oj.CollectionUtils.copyInto(defaultManagedMap, managedAttrMap);
    managedAttrMap = defaultManagedMap;
  }

  var resolvedInitialOptions = {};

  var propertyReadFunc = function propertyReadFunc() {
    var prop = this._property;

    var value = oj.ComponentBinding._toJS(ctx.valueAccessor()[prop]);

    if (stage === 0) {
      // init, no change
      var managedPropEntry = managedAttrMap[prop];

      if (managedPropEntry != null) {
        specifiedManagedAttrs[prop] = managedPropEntry;
        var initFunc = managedPropEntry.init;

        if (initFunc != null) {
          var initProps = initFunc(prop, value, element, comp, ctx.valueAccessor, ctx.allBindingsAccessor, ctx.bindingContext) || {};
          var initKeys = Object.keys(initProps); // ensure that the array properties returned by the init function are cloned

          for (var ip = 0; ip < initKeys.length; ip++) {
            var ikey = initKeys[ip];
            resolvedInitialOptions[ikey] = oj.ComponentBinding.__cloneIfArray(initProps[ikey]);
          }
        }
      } else {
        resolvedInitialOptions[prop] = oj.ComponentBinding.__cloneIfArray(value);
      }
    } else if (!disposed) {
      // this is a post-init change
      if (managedAttrMap[prop] != null) {
        var updateFunc = managedAttrMap[prop].update;

        if (updateFunc != null) {
          var updateProps = updateFunc(prop, value, element, comp, ctx.valueAccessor, ctx.allBindingsAccessor, ctx.bindingContext) || {};
          var updateKeys = Object.keys(updateProps);

          for (var k = 0; k < updateKeys.length; k++) {
            var p = updateKeys[k];
            ctx.changeTracker.addChange(p, oj.ComponentBinding.__cloneIfArray(updateProps[p]));
          }
        }
      } else if (!ctx.readOnlyProperties[prop]) {
        // ignore chnages to read-only properties
        ctx.changeTracker.addChange(prop, oj.ComponentBinding.__cloneIfArray(value));
      }
    }
  };

  for (var k = 0; k < ctx.specifiedOptions.length; k++) {
    // ko.computed is used to set up dependency tracking for the bindings's attribute
    // Any observable evaulated during the initial invocation of the function is going to be treated as a dependency
    // by Knockout. Once that dependency changes, the fuction below will be called again, in which case we will know
    // to deliver the change
    ctx.computeds.push(ko.computed(propertyReadFunc, {
      _property: ctx.specifiedOptions[k]
      /* 'this' object for the 'read' function*/

    }));
  }

  stage = 1; // post-init

  oj.ComponentBinding._registerWritebacks(jelem, ctx);

  var mutationOptions = oj.ComponentBinding.__removeDotNotationOptions(resolvedInitialOptions); // Initialization of the component happens here


  comp(resolvedInitialOptions);
  Object.keys(mutationOptions).forEach(function (mo) {
    comp('option', mo, mutationOptions[mo]);
  });
  var createCallback = this._bindingOptions.afterCreate;

  if (createCallback) {
    createCallback(element, comp, ctx.valueAccessor, ctx.allBindingsAccessor, ctx.bindingContext);
  }

  oj.ComponentBinding._deliverCreateDestroyEventToManagedProps(true, specifiedManagedAttrs, element, comp, ctx.valueAccessor, ctx.allBindingsAccessor, ctx.bindingContext);

  resolvedInitialOptions = null;
  return comp;
};
/**
 * @private
 */


function _extractValueFromChangeEvent(event, eventData) {
  var prop = 'value';
  var nameVal = {};
  nameVal[prop] = eventData[prop];
  return nameVal;
}
/**
 * @private
 */


function _extractOptionChange(ctx, event, eventData) {
  var nameVal = {};
  var metadata = eventData.optionMetadata;

  if (metadata) {
    var shouldWrite = metadata.writeback === 'shouldWrite';

    if (shouldWrite) {
      var name = eventData.option;
      nameVal[name] = eventData.value;

      if (metadata.readOnly) {
        ctx.readOnlyProperties[name] = true;
      }
    }
  }

  return nameVal;
}
/**
 * @private
 */


oj.ComponentBinding.prototype._getManagedAttributes = function (specifiedOptions, componentName) {
  return oj.ComponentBinding._resolveManagedAttributes(this._managedAttrOptions, specifiedOptions, componentName);
};
/**
 * @private
 */


oj.ComponentBinding._resolveManagedAttributes = function (optionMap, specifiedOptions, componentName) {
  var managedAttrMap = {};
  var applicableOptions = [];
  var attrsField = 'attributes';

  var traverseOptions = function traverseOptions(name, followLinks) {
    var managers = optionMap[name];

    if (managers != null) {
      for (var n = managers.length - 1; n >= 0; n--) {
        var opt = managers[n];

        if (opt[attrsField] != null) {
          applicableOptions.push(opt);
        }

        if (followLinks) {
          var parents = opt.use;

          if (parents != null) {
            parents = Array.isArray(parents) ? parents : [parents];

            for (var i = 0; i < parents.length; i++) {
              traverseOptions(parents[i], true);
            }
          }
        }
      }
    }
  };

  traverseOptions(componentName, true); // If this is a JET component, check managed options registered for the ancestors

  var ojNamespace = 'oj';
  var widgetClass = $[ojNamespace][componentName];

  if (widgetClass != null) {
    var proto = Object.getPrototypeOf(widgetClass.prototype);

    while (proto != null && ojNamespace === proto.namespace) {
      traverseOptions(proto.widgetName, true);
      proto = Object.getPrototypeOf(proto);
    }
  }

  traverseOptions('@global', false);

  if (applicableOptions.length > 0) {
    for (var k = 0; k < specifiedOptions.length; k++) {
      var attr = specifiedOptions[k];

      for (var l = 0; l < applicableOptions.length; l++) {
        var opts = applicableOptions[l];
        var attributes = opts[attrsField];

        if (attributes.indexOf(attr) >= 0) {
          managedAttrMap[attr] = {
            init: opts.init,
            update: opts.update,
            afterCreate: opts.afterCreate,
            beforeDestroy: opts.beforeDestroy
          };
          break;
        }
      }
    }
  }

  return managedAttrMap;
};
/**
 * @private
 */


oj.ComponentBinding._HANDLER_NAMESPACE = '.oj_ko';
/**
 * @private
 */

oj.ComponentBinding._registerWritebacks = function (jelem, ctx) {
  var writablePropMap = {
    '^slider$': [{
      event: 'slidechange',
      getter: _extractValueFromChangeEvent
    }],
    '^oj*': [{
      event: 'ojoptionchange',
      getter: _extractOptionChange.bind(undefined, ctx)
    }]
  };
  var cachedWriterFunctionEvaluators = {};
  var keys = Object.keys(writablePropMap);

  for (var k = 0; k < keys.length; k++) {
    var pattern = keys[k];

    if (ctx.componentName.match(pattern)) {
      var eventInfos = writablePropMap[pattern];

      for (var i = 0; i < eventInfos.length; i++) {
        var info = eventInfos[i];
        jelem.on(info.event + oj.ComponentBinding._HANDLER_NAMESPACE, {
          // JQuery will pass this object as event.data
          getter: info.getter
        }, function (evt, data) {
          // Ignore optionChange events that bubbled up from child components
          if (evt.target !== jelem[0]) {
            return;
          }

          var nameValues = evt.data.getter(evt, data);
          var accessor = ctx.valueAccessor();
          var names = Object.keys(nameValues);

          for (var nm = 0; nm < names.length; nm++) {
            var name = names[nm];
            ctx.changeTracker.suspend(name);

            try {
              if (ctx.specifiedOptions.indexOf(name) >= 0) {
                var optionMap = accessor[oj.ComponentBinding._OPTION_MAP];
                var expr = optionMap == null ? null : optionMap[name];
                var target = accessor[name];

                oj.ComponentBinding._writeValueToProperty(name, target, nameValues[name], expr, ctx.bindingContext, cachedWriterFunctionEvaluators);
              }
            } finally {
              ctx.changeTracker.resume(name);
            }
          }
        });
      }

      break;
    }
  }
};
/**
 * @private
 */


oj.ComponentBinding._writeValueToProperty = function (name, target, value, propertyExpression, bindingContext, cachedWriterFunctionEvaluators) {
  if (target == null || !ko.isObservable(target)) {
    if (!(name in cachedWriterFunctionEvaluators)) {
      var inContextWriter = null;

      var writerExpr = oj.__ExpressionUtils.getPropertyWriterExpression(propertyExpression);

      if (writerExpr != null) {
        // These writer expressions are already being cached, so we are not passing a second
        // to the function below and are not asking for the returned eveluator to be cached
        inContextWriter = BindingProviderImpl.createEvaluator(writerExpr, bindingContext);
      } // eslint-disable-next-line no-param-reassign


      cachedWriterFunctionEvaluators[name] = inContextWriter;
    }

    var func = cachedWriterFunctionEvaluators[name];

    if (func) {
      var writer = oj.__ExpressionUtils.getWriter(func(bindingContext));

      writer(oj.ComponentBinding.__cloneIfArray(value));
    }
  } else if (ko.isWriteableObservable(target)) {
    target(oj.ComponentBinding.__cloneIfArray(value));
  }
};
/**
 * @private
 */


oj.ComponentBinding._toJS = function (_prop) {
  // ko.toJS creates a cloned object for both plain javascript objects and Object subclasses. We need to avoid it
  // for the latter case to ensure that complex Model objects can be used as binding properties without being cloned
  var prop = ko.utils.unwrapObservable(_prop);

  if ((Array.isArray(prop) || oj.CollectionUtils.isPlainObject(prop)) && prop.ojConvertToJS) {
    prop = ko.toJS(prop);
  }

  return prop;
};
/**
 * @ignore
 */


oj.ComponentBinding.__cloneIfArray = function (value) {
  if (Array.isArray(value)) {
    // eslint-disable-next-line no-param-reassign
    value = value.slice();
  }

  return value;
};
/**
 * @private
 */


oj.ComponentBinding.__removeDotNotationOptions = function (options) {
  var mutationOptions = {};
  var keys = Object.keys(options);

  for (var k = 0; k < keys.length; k++) {
    var opt = keys[k];

    if (opt.indexOf('.') >= 0) {
      mutationOptions[opt] = options[opt]; // eslint-disable-next-line no-param-reassign

      delete options[opt];
    }
  }

  return mutationOptions;
};
/**
 * @private
 */


oj.ComponentBinding._deliverCreateDestroyEventToManagedProps = function (isCreate, managedAttrMap, element, comp, valueAccessor, allBindingsAccessor, bindingContext) {
  var props = Object.keys(managedAttrMap);

  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    var entry = managedAttrMap[prop];
    var callback = isCreate ? entry.afterCreate : entry.beforeDestroy;

    if (callback) {
      callback(prop, element, comp, valueAccessor, allBindingsAccessor, bindingContext);
    }
  }
};
/**
 * @private
 */


oj.ComponentBinding.__getKnockoutVersion = function () {
  if (oj.__isAmdLoaderPresent() && ko) {
    return ko.version;
  }

  return '';
};
/**
 * @private
 */


oj.ComponentBinding._isNameRegistered = function (bindingName) {
  return oj.ComponentBinding._REGISTERED_NAMES.indexOf(bindingName) >= 0;
};
/**
 * @ignore
 */


oj.ComponentBinding._REGISTERED_NAMES = [];
/**
 * @ignore
 */

oj.ComponentBinding._COMPONENT_OPTION = 'component';
/**
 * @ignore
 */

oj.ComponentBinding._OPTION_MAP = '_ojOptions';
/**
 * Redefine ko.utils.domNodeDisposal.cleanExternalData, so that JET components can avoid removing the wrapper node during
 * KO cleanup
 * @private
 */

(function () {
  var name = 'cleanExternalData';
  var disposal = ko.utils.domNodeDisposal;
  var wrapped = disposal[name];

  disposal[name] = function (node) {
    // This module doe snot have an explicit dependency on ojcomponentcore,
    // so check for the oj.Components instance dynamically
    var func = oj.DomUtils ? oj.DomUtils.setInKoCleanExternal : null;

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
 */


oj.ComponentBinding._INSTANCE = oj.ComponentBinding.create(['ojComponent', 'jqueryUI']);



/* global ko:false */

/**
 * This is added so that we could cleanup any ko references on the element when it is removed.
 * @export
 */
$.widget('oj._ojDetectCleanData', {
  options: {
    /**
     * @type {boolean}
     * @default <code class="prettyprint">false</code>
     */
    cleanParent: false
  },
  _destroy: function _destroy() {
    var disposal = ko.utils.domNodeDisposal;
    var cleanExternalData = 'cleanExternalData'; // need to temporarily short circuit the domNodeDisposal call otherwise
    // the _destroy override would be invoked again

    var oldCleanExternal = disposal[cleanExternalData];

    disposal[cleanExternalData] = function () {};

    try {
      // provide the option to clean from the parent node for components like ojdatagrid so that the comment
      // and text nodes aren't memory leaked with ko when remove/_destroy is not called on all node types
      if (this.options.cleanParent && this.element[0].parentNode != null) {
        ko.cleanNode(this.element[0].parentNode);
      } else {
        ko.cleanNode(this.element[0]);
      }
    } finally {
      disposal[cleanExternalData] = oldCleanExternal;
    }
  }
});



/* global _getDvtRenderer:false */

/**
 * Common method to handle managed attributes for both init and update
 * @param {string} name the name of the attribute
 * @param {Object} value the value of the attribute
 * @param {Object} bindingContext the ko binding context
 * @return {Object} the modified attribute
 * @private
 */
function _handleManagedChartAttributes(name, value, bindingContext) {
  if (name === 'pieCenter' && value.template) {
    // eslint-disable-next-line no-param-reassign
    value._renderer = _getDvtRenderer(bindingContext, value.template);
  }

  return {
    pieCenter: value
  };
}

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  attributes: ['pieCenter'],
  init: function init(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleManagedChartAttributes(name, value, bindingContext);
  },
  update: function update(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleManagedChartAttributes(name, value, bindingContext);
  },
  for: 'ojChart'
});



/* global ko:false */

/**
 * Returns a renderer function executes the template specified in the binding attribute.
 * (for example, a knockout template).
 * @param {Object} bindingContext the ko binding context
 * @param {string} template the name of the template
 * @return {Function} the renderer function
 * @private
 */
function _getComboboxOptionRenderer(bindingContext, template) {
  return function (context) {
    var parent = context.parentElement; // runs the template

    var childContext = bindingContext.createChildContext(context.data, null, function (binding) {
      // eslint-disable-next-line no-param-reassign
      binding.$optionContext = context;
    });
    ko.renderTemplate(template, childContext, null, parent); // tell the combobox not to do anything

    return null;
  };
}
/**
 * Common method to handle managed attributes for both init and update
 * @param {string} name the name of the attribute
 * @param {Object} value the value of the attribute
 * @param {Object} bindingContext the ko binding context
 * @return {Object} the modified attribute
 * @private
 */


function _handleComboboxManagedAttributes(name, value, bindingContext) {
  if (name === 'optionTemplate' && value !== null) {
    // find the option template and creates a renderer
    var template = String(value);

    var optionRenderer = _getComboboxOptionRenderer(bindingContext, template);

    return {
      optionRenderer: optionRenderer
    };
  }

  return null;
}

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  attributes: ['optionTemplate'],
  init: function init(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    var result = _handleComboboxManagedAttributes(name, value, bindingContext);

    if (result !== null) {
      return result;
    }

    return undefined;
  },
  update: function update(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleComboboxManagedAttributes(name, value, bindingContext);
  },
  for: 'ComboboxOptionRenderer'
});
/**
 * Default declaration for ojCombobox
 */

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  for: 'ojCombobox',
  use: 'ComboboxOptionRenderer'
});
/**
 * Default declaration for ojSelect
 */

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  for: 'ojSelect',
  use: 'ComboboxOptionRenderer'
});
/**
 * Default declaration for ojInputSearch
 */

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  for: 'ojInputSearch',
  use: 'ComboboxOptionRenderer'
});



/* global Logger:false */

/**
 * @private
 * @constructor
 * Keeps track of changes for a single component
 */
function ComponentChangeTracker(component, queue) {
  this.Init(component, queue);
} // Subclass from oj.Object


oj.Object.createSubclass(ComponentChangeTracker, oj.Object, 'ComponentBinding.ComponentChangeTracker');
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
    Logger.error('ComponentChangeTracker suspendCount underflow');
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



/* global ko:false */

/* jslint browser: true, devel: true*/
// TODO: do we have JSDoc / API doc for bindings?  (Latest answer: no for now, just doc it briefly in baseComponent's contextMenu option for now.)
// TODO: split up init and update so get from DOM on init only, and update only sets it on DOM.  That way,
//       can update observable to null, without having to additionally clear DOM attr to avoid having it restored from DOM attr.
//       Vet with Max first.
// TODO: keep binding and DOM in synch, a la disabled option in JQUI, similar to todo for contextMenu feature on JET base class.
// TODO: share code with baseComponent._SetupContextMenu?  Should this have any of the configurability of that method?
//       where would shared code live?
ko.bindingHandlers.ojContextMenu = {
  // eslint-disable-next-line no-unused-vars
  update: function update(element, valueAccessor, allBindings, viewModel, bindingContext) {
    // 1) declare vars including functions: ---
    var eventNamespace = '.ojContextMenu';
    var $element = $(element);
    var pressHoldTimer;
    var pressHoldThreshold = 750; // per UX spec.  Point of reference: JQ Mobile uses 750ms by default.

    var isPressHold = false; // to prevent pressHold from generating a click

    var touchInProgress = false;
    var doubleOpenTimer; // to prevent double open.  see usage below.

    var doubleOpenThreshold = 300; // made up this number.  TBD: Tweak as needed to make all platforms happy.

    var doubleOpenType = null; // "touchstart" or "contextmenu"
    // 2) Clean up from previously bound value, if any: ---

    $element.off(eventNamespace).removeClass('oj-menu-context-menu-launcher')[0].removeEventListener('click', clickListener, true); // remove touchstart listener registered with passive option

    $element[0].removeEventListener('touchstart', touchstartMousedownKeydownListener, {
      passive: false
    });
    clearTimeout(pressHoldTimer);
    var oldMenuData = $element.data('_ojLastContextMenu'); // If binding's bound value is changing at RT, remove listener from old menu.
    // To avoid memory leak (capture of old menu node), don't assign the node to a var.

    if (oldMenuData) {
      _getContextMenuNode(oldMenuData.selector, oldMenuData.id).off(eventNamespace);
    }

    var contextMenuListenerSet = false; // 3) Get menu selector/id: ---
    // Accepts anything $() accepts, i.e. same things component CM option accepts,
    // including selector like "#myMenuId", element, JQ object, etc. Also accepts
    // {}, meaning "use the HTML contextmenu attribute.  Else malformed.

    var menuSelector = ko.utils.unwrapObservable(valueAccessor()); // if menuSelector is {}, use the id from the contextmenu attr instead. See getContextMenuNode comments.

    var menuId = $.isPlainObject(menuSelector) ? element.getAttribute('contextmenu') : null; // Remember how to find menu, without caching menu itself, so that if binding's bound observable is later
    // changed to point to some other menu, we can clean up the old menu.
    // If/when KO binding is disposed, .data data is discarded, so no leak.

    $element.data('_ojLastContextMenu', {
      selector: menuSelector,
      id: menuId
    }); // 4) Add listeners to element having context menu (not menu element) : ---
    // Use capture phase to make sure we cancel it before any regular bubble listeners hear it.

    element.addEventListener('click', clickListener, true); // register touchstart with passive option

    $element[0].addEventListener('touchstart', touchstartMousedownKeydownListener, {
      passive: false
    });
    $element.on('mousedown' + eventNamespace + ' ' + 'keydown' + eventNamespace + ' ', touchstartMousedownKeydownListener) // if the touch ends before the 750ms is up, it's not a long enough tap-and-hold to show the CM
    .on('touchend' + eventNamespace + ' ' + 'touchcancel' + eventNamespace, function () {
      touchInProgress = false;
      clearTimeout(pressHoldTimer);
      return true;
    }).on('keydown' + eventNamespace + ' ' + 'contextmenu' + eventNamespace, function (event) {
      if (event.type === 'contextmenu' // right-click.  pressHold for Android but not iOS
      || event.which === 121 && event.shiftKey) {
        // Shift-F10
        var eventType;

        if (touchInProgress) {
          eventType = 'touch';
        } else if (event.type === 'keydown') {
          eventType = 'keyboard';
        } else {
          eventType = 'mouse';
        }

        launch(event, eventType, false);
      }

      return true;
    }) // Does 2 things:
    // 1) Prevents native context menu / callout from appearing in Mobile Safari.  E.g. for links, native CM has "Open in New Tab".
    // 2) In Mobile Safari and Android Chrome, prevents pressHold from selecting the text and showing the selection handles and (in Safari) the Copy/Define callout.
    // In UX discussion, we decided to prevent both of these things for now.  App can theme directly if they have specific needs.
    // Per discussion with architects, do #2 only for touch devices, so that text selection isn't prevented on desktop.  Since #1
    // is a no-op for non-touch, we can accomplish this by omitting the entire style class, which does 1 and 2, for non-touch.
    // Per comments in scss file, the suppression of 1 and 2 has issues in old versions of Mobile Safari.
    .addClass(oj.DomUtils.isTouchSupported() ? 'oj-menu-context-menu-launcher' : ''); // At least some of the time, the pressHold gesture also fires a click event same as a short tap.  Prevent that here.

    function clickListener(event) {
      if (isPressHold) {
        // For Mobile Safari capture phase at least, returning false doesn't work; must use pD() and sP() explicitly.
        // Since it's wonky, do both for good measure.
        event.preventDefault();
        event.stopPropagation();
        isPressHold = false;
        return false;
      }

      return undefined;
    } // , on Chrome preventDefault on "keyup" will avoid triggering contextmenu event
    // which will display native contextmenu.This also need to be added on document as event target is not menu launcher.


    function preventKeyUpEventIfMenuOpen(event) {
      if (event.which === 121 && event.shiftKey) {
        // Shift-F10
        if (getContextMenuNode().is(':visible')) {
          event.preventDefault();
        }
      }
    } // lazily get the Menu component in case it is inited after the ojContextMenu binding is applied to launcher.


    function getContextMenu() {
      // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
      var constructor = oj.Components.__GetWidgetConstructor(getContextMenuNode()[0], 'ojMenu'); // The JET Menu of the first element found.
      // Per architect discussion, get it every time rather than caching the menu.


      var contextMenu = constructor && constructor('instance'); // if no element found, or if element has no JET Menu

      if (!contextMenu) {
        throw new Error('ojContextMenu binding bound to "' + (menuId || menuSelector) + '", which does not reference a valid JET Menu.');
      }

      if (!contextMenuListenerSet) {
        // must use "on" syntax rather than clobbering whatever "close" handler the app may have set via the menu's "option" syntax
        contextMenu.widget().on('ojclose' + eventNamespace, function () {
          document.removeEventListener('keyup', preventKeyUpEventIfMenuOpen);
        });
        contextMenuListenerSet = true;
      }

      return contextMenu;
    } // All gets of the menu element must use this function, rather than calling $(menuSelector) directly,
    // in case menuId was provided instead.


    function getContextMenuNode() {
      return _getContextMenuNode(menuSelector, menuId);
    }

    function _getContextMenuNode(selector, id) {
      return id ? $(document.getElementById(id)) // Do NOT use $('#' + id), due to escaping issues
      : $(selector).first();
    }

    function launch(event, eventType, pressHold) {
      // ensure that pressHold doesn't result in a click.  Set this before the bailouts below.
      isPressHold = pressHold;
      var menu = getContextMenu(); // In Mobile Safari only, mousedown fires *after* the touchend, which causes at least 2 problems:
      // 1) CM launches after 750ms (good), then disappears when lift finger (bad), because touchend -->
      // mousedown, which calls Menu's "clikAway" mousedown listener, which dismisses Menu.
      // 2) The isPressHold logic needs to reset the isPressHold ivar on any event that can start a click,
      // including mousedown.  This problem causes the mousedown listener to incorrectly clear the ivar
      // after a pressHold, which broke the whole mechanism.
      // SOLUTION FOR 1-2:  On each launch (at 750ms), set a one-time touchend listener that will set a
      // var and clear it 50ms later.  While the var is set, both mousedown listeners can disregard the
      // mousedown.  Make the var a static var in Menu, since Menu's listener is static, and since this
      // launcher component can get/set it via an (effectively static) menu method.
      // NON-SOLUTIONS:  Cancelling touchstart or touchend, via pD() and sP(), doesn't cancel iPad's mousedown.
      // Cancelling mousedown from here doesn't work even if capture phase, since ojMenu's listener is capture phase.
      // TIMING: The following block should be before the doubleOpen bailout.

      if (isPressHold) {
        $element.one('touchend' + eventNamespace, function () {
          var touchendMousedownThreshold = 50; // 50ms.  Make as small as possible to prevent unwanted side effects.

          menu.__contextMenuPressHoldJustEnded(true);

          setTimeout(function () {
            menu.__contextMenuPressHoldJustEnded(false);
          }, touchendMousedownThreshold); // @HTMLUpdateOK delaying our own callback
        });
      } // On platforms like Android Chrome where long presses already fire the contextmenu event, the pressHold
      // logic causes the menu to open twice, once for the pressHold, once for the contextmenu.  There's no
      // guarantee which will happen first, but as long as they happen within doubleOpenThreshold ms
      // of each other, this logic should prevent the double open.
      // Note: Another option is a platform-specific solution where we only use pressHold for platforms that need
      // it (that don't already fire a contextmenu event for pressHold), but architectural preference is to avoid
      // platform-specific solutions if possible.


      if (doubleOpenType === 'touchstart' && event.type === 'contextmenu' || doubleOpenType === 'contextmenu' && event.type === 'touchstart') {
        doubleOpenType = null;
        clearTimeout(doubleOpenTimer);
        return;
      } // if a nested element or component already showed a JET context menu for this event, don't replace it with ours.


      if (event.isDefaultPrevented()) {
        return;
      }

      var position = {
        mouse: {
          my: 'start top',
          at: 'start bottom',
          of: event
        },
        touch: {
          my: 'start>40 center',
          at: 'start bottom',
          of: event,
          collision: 'flipfit'
        },
        keyboard: {
          my: 'start top',
          at: 'start bottom',
          of: 'launcher'
        }
      };
      var openOptions = {
        launcher: $element,
        initialFocus: 'menu',
        position: position[eventType]
      };
      menu.__openingContextMenu = true; // Hack.  See todo on this ivar in Menu.open().

      menu.open(event, openOptions);
      menu.__openingContextMenu = false; // if the launch wasn't cancelled by a beforeOpen listener

      if (menu.widget().is(':visible')) {
        event.preventDefault(); // don't show native context menu

        document.addEventListener('keyup', preventKeyUpEventIfMenuOpen); // see double-open comments above

        if (event.type === 'touchstart' || event.type === 'contextmenu') {
          doubleOpenType = event.type;
          doubleOpenTimer = setTimeout(function () {
            doubleOpenType = null;
          }, doubleOpenThreshold); // @HTMLUpdateOK delaying our own callback
        }
      }
    }

    function touchstartMousedownKeydownListener(event) {
      // touchstart listener is not registered with jQuery
      // so we have to make sure to convert the native event
      // to a jQuery event which is what is being expected
      // by the downstream code (calls to event.isDefaultPrevented() etc)
      if (event.type === 'touchstart') {
        // eslint-disable-next-line no-param-reassign
        event = $.Event(event);
      } // for mousedown-after-touchend Mobile Safari issue explained above where __contextMenuPressHoldJustEnded is set.


      if (event.type === 'mousedown' && getContextMenu().__contextMenuPressHoldJustEnded()) {
        return undefined;
      } // reset isPressHold flag for all events that can start a click.


      isPressHold = false; // start a pressHold timer on touchstart.  If not cancelled before 750ms by touchend/etc., will launch the CM.

      if (event.type === 'touchstart') {
        touchInProgress = true;
        pressHoldTimer = setTimeout(launch.bind(undefined, event, 'touch', true), pressHoldThreshold // @HTMLUpdateOK delaying our own callback
        );
      }

      return true;
    }
  }
};



/* global ko:false */

/**
 * Returns a header renderer function executes the template specified in the binding attribute.
 * (for example, a knockout template).
 * @param {Object} bindingContext the ko binding context
 * @param {Function|string} template the name of the template
 * @return {Function} the renderer function
 * @private
 */
function _getDataGridHeaderRenderer(bindingContext, template) {
  var nodeStore = {};
  return function (context) {
    var parent = context.parentElement; // runs the template

    var childContext = bindingContext.createChildContext(context.data, null, function (binding) {
      // eslint-disable-next-line no-param-reassign
      binding.$key = context.key; // eslint-disable-next-line no-param-reassign

      binding.$metadata = context.metadata; // eslint-disable-next-line no-param-reassign

      binding.$headerContext = context;
    });

    _executeTemplate(context, template, parent, childContext, nodeStore); // tell the datagrid not to do anything


    return null;
  };
}
/**
 * Returns a cell renderer function executes the template specified in the binding attribute.
 * (for example, a knockout template).
 * @param {Object} bindingContext the ko binding context
 * @param {Function|string} template the name of the template
 * @return {Function} the renderer function
 * @private
 */


function _getDataGridCellRenderer(bindingContext, template) {
  var nodeStore = {};
  return function (context) {
    var parent = context.parentElement; // runs the template

    var childContext = bindingContext.createChildContext(context.data, null, function (binding) {
      // eslint-disable-next-line no-param-reassign
      binding.$keys = context.keys; // eslint-disable-next-line no-param-reassign

      binding.$metadata = context.metadata; // eslint-disable-next-line no-param-reassign

      binding.$cellContext = context; // eslint-disable-next-line no-param-reassign

      binding.$cell = context.cell;
    });

    _executeTemplate(context, template, parent, childContext, nodeStore); // tell the datagrid not to do anything


    return null;
  };
}
/**
 * Execute a template and applies relevant afterRender function
 * @param {Object} context the ko binding context
 * @param {Function|string} template the template function or string
 * @param {Element} parent the parent element of the binding
 * @param {Object} childContext the context applied to binding
 * @param {Object} nodeStore place to store the nodeArray
 * @private
 */


function _executeTemplate(context, template, parent, childContext, nodeStore) {
  var useTemplate = _resolveDataGridTemplate(template, context);

  var nodesArray = _getClonedNodeArray(useTemplate, nodeStore);

  ko.virtualElements.setDomNodeChildren(parent, nodesArray);
  ko.applyBindingsToDescendants(childContext, parent);

  for (var i = 0; i < parent.childNodes.length; i++) {
    if (parent.childNodes[i].nodeType === 1) {
      $(parent.childNodes[i])._ojDetectCleanData({
        cleanParent: true
      });

      break;
    }
  }
}
/**
 * Get an array of nodes from the template or cached template nodes
 * @param {string} useTemplate the template function or string
 * @param {Object} nodeStore place to store the nodeArray
 * @returns {Array} cloned node array from the template or node store
 * @private
 */


function _getClonedNodeArray(useTemplate, nodeStore) {
  var nodesArray = nodeStore[useTemplate];

  if (nodesArray == null) {
    nodesArray = ko.utils.parseHtmlFragment(document.getElementById(useTemplate).innerHTML, // @HTMLUpdateOK
    document); // @HTMLUpdateOK
    // eslint-disable-next-line no-param-reassign

    nodeStore[useTemplate] = nodesArray;
  }

  var newNodesArray = nodesArray.map(function (obj) {
    return obj.cloneNode(true);
  });
  return newNodesArray;
}
/**
 * If they specify a function for the template get the string of the template by
 * calling the function and passing the cell or header context
 * @param {Function|string} template
 * @param {Object} context
 * @private
 */


function _resolveDataGridTemplate(template, context) {
  if (typeof template === 'function') {
    return template(context);
  }

  return template;
}

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  attributes: ['header', 'cell'],
  init: function init(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    if (name === 'header') {
      // find row template and creates a renderer
      var row = value.row;

      if (row != null) {
        var rowTemplate = row.template;

        if (rowTemplate != null) {
          row.renderer = _getDataGridHeaderRenderer(bindingContext, rowTemplate);
        }
      } // find column template and creates a renderer


      var column = value.column;

      if (column != null) {
        var columnTemplate = column.template;

        if (columnTemplate != null) {
          column.renderer = _getDataGridHeaderRenderer(bindingContext, columnTemplate);
        }
      } // find column template and creates a renderer


      var rowEnd = value.rowEnd;

      if (rowEnd != null) {
        var rowEndTemplate = rowEnd.template;

        if (rowEndTemplate != null) {
          rowEnd.renderer = _getDataGridHeaderRenderer(bindingContext, rowEndTemplate);
        }
      } // find column template and creates a renderer


      var columnEnd = value.columnEnd;

      if (columnEnd != null) {
        var columnEndTemplate = columnEnd.template;

        if (columnEndTemplate != null) {
          columnEnd.renderer = _getDataGridHeaderRenderer(bindingContext, columnEndTemplate);
        }
      }

      return {
        header: value
      };
    } else if (name === 'cell') {
      // find the cell template and creates a renderer
      var cellTemplate = value.template;

      if (cellTemplate != null) {
        // eslint-disable-next-line no-param-reassign
        value.renderer = _getDataGridCellRenderer(bindingContext, cellTemplate);
      }

      return {
        cell: value
      };
    }

    return undefined;
  },
  update: function update(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    if (name === 'header') {
      // find row template and creates a renderer
      var row = value.row;

      if (row != null) {
        var rowTemplate = row.template;

        if (rowTemplate != null) {
          row.renderer = _getDataGridHeaderRenderer(bindingContext, rowTemplate);
        }
      } // find column template and creates a renderer


      var column = value.column;

      if (column != null) {
        var columnTemplate = column.template;

        if (columnTemplate != null) {
          column.renderer = _getDataGridHeaderRenderer(bindingContext, columnTemplate);
        }
      } // find column template and creates a renderer


      var rowEnd = value.rowEnd;

      if (rowEnd != null) {
        var rowEndTemplate = rowEnd.template;

        if (rowEndTemplate != null) {
          rowEnd.renderer = _getDataGridHeaderRenderer(bindingContext, rowEndTemplate);
        }
      } // find column template and creates a renderer


      var columnEnd = value.columnEnd;

      if (columnEnd != null) {
        var columnEndTemplate = columnEnd.template;

        if (columnEndTemplate != null) {
          columnEnd.renderer = _getDataGridHeaderRenderer(bindingContext, columnEndTemplate);
        }
      }

      return {
        header: value
      };
    } else if (name === 'cell') {
      // find the cell template and creates a renderer
      var cellTemplate = value.template;

      if (cellTemplate != null) {
        // eslint-disable-next-line no-param-reassign
        value.renderer = _getDataGridCellRenderer(bindingContext, cellTemplate);
      }

      return {
        cell: value
      };
    }

    return null;
  },
  for: 'ojDataGrid'
});



/* global _getDvtDataRenderer:false */

/**
 * @private
 */
function _handleManagedDiagramAttributes(name, value, bindingContext) {
  if (name === 'template') {
    return {
      _templateFunction: _getDvtDataRenderer(bindingContext, value)
    };
  }

  return null;
}

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  attributes: ['template'],
  init: function init(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleManagedDiagramAttributes(name, value, bindingContext);
  },
  update: function update(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleManagedDiagramAttributes(name, value, bindingContext);
  },
  for: 'ojDiagram'
});


(function () {
  var _ASSIGNMENT_TARGET_EXP = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;
  var _KO_WRITER_KEY = '_ko_property_writers';
  /**
   * @ignore
   * @private
   */

  oj.__ExpressionUtils = {};

  oj.__ExpressionUtils.getPropertyWriterExpression = function (expression) {
    var reserveddWords = ['true', 'false', 'null', 'undefined'];

    if (expression == null || reserveddWords.indexOf(expression) >= 0) {
      return null;
    } // Remove the white space on both ends to ensure that the _ASSIGNMENT_TARGET_EXP regexp
    // is matched properly
    // eslint-disable-next-line no-param-reassign


    expression = expression.trim(); // Matches something that can be assigned to--either an isolated identifier or something ending with a property accessor
    // This is designed to be simple and avoid false negatives, but could produce false positives (e.g., a+b.c).
    // This also will not properly handle nested brackets (e.g., obj1[obj2['prop']];).

    var match = expression.match(_ASSIGNMENT_TARGET_EXP);

    if (match === null) {
      return null;
    }

    var target = match[1] ? 'Object(' + match[1] + ')' + match[2] : expression;
    return '{' + _KO_WRITER_KEY + ': function(v){' + target + '=v;}}';
  };

  oj.__ExpressionUtils.getWriter = function (evaluator) {
    return evaluator[_KO_WRITER_KEY];
  };
})();



/* global KnockoutTemplateUtils:false, ResponsiveKnockoutUtils: false */
// bleed KnockoutTemplateUtils and ResponsiveKnockoutUtils back into oj to keep backward compatibility.
oj.KnockoutTemplateUtils = KnockoutTemplateUtils;
oj.ResponsiveKnockoutUtils = ResponsiveKnockoutUtils;



/* global ko:false, BindingProviderImpl:false */

/**
 * @ignore
 */
BindingProviderImpl.addPostprocessor({
  getBindingAccessors: _replaceComponentBindingWithV2
});
/**
 * This function modifies the return value of getBindingAccessors()
 * to separate bindings for each tracked attributess in the 'inline' ojComponent binding
 * @param node
 * @param bindingContext
 * @param accessorMap
 * @param wrapped
 * @ignore
 */

function _replaceComponentBindingWithV2(node, bindingContext, accessorMap, wrapped) {
  if (accessorMap == null) {
    return null;
  } // Remove the old (pre-V2) binding from the accessor map


  var bindingName = _findOwnBinding(accessorMap);

  if (bindingName != null) {
    // eslint-disable-next-line no-param-reassign
    accessorMap = _modifyOjComponentBinding(node, bindingName, wrapped, bindingContext, accessorMap);
  }

  return accessorMap;
}
/**
 * @ignore
 */


function _findOwnBinding(accessorMap) {
  var keys = Object.keys(accessorMap);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    if (oj.ComponentBinding._isNameRegistered(key)) {
      return key;
    }
  }

  return null;
}
/**
 * @param node
 * @param bindingName
 * @param wrapped
 * @param bindingContext
 * @param accessorMap
 * @ignore
 */


function _modifyOjComponentBinding(node, bindingName, wrapped, bindingContext, accessorMap) {
  var info = _getBindingValueInfo(node, bindingName, wrapped, bindingContext);

  var bindingList = info.attrList;

  if (bindingList == null) {
    // binding is specified externally (as opposed to an 'inline' object literal)
    return accessorMap;
  }

  var bindingMap = {};

  _keyValueArrayForEach(bindingList, function (key, value) {
    bindingMap[key] = value;
  }); // clone the original accessor map
  // eslint-disable-next-line no-param-reassign


  accessorMap = oj.CollectionUtils.copyInto({}, accessorMap); // Add accessor for the V2 version of the Component binding
  // eslint-disable-next-line no-param-reassign

  accessorMap[bindingName] = _getOjComponent2BindingAccessor(bindingContext, bindingMap, info.bindingExpr);
  return accessorMap;
}
/**
 * @ignore
 */


function _getOjComponent2BindingAccessor(bindingContext, attributeMap, bindingExpr) {
  var accessorFunc = function accessorFunc() {
    var accessor = {};
    Object.keys(attributeMap).forEach(function (option) {
      var expression = attributeMap[option]; // bindingContext will be passed as as the first parameter to the evaluator

      var getter = BindingProviderImpl.createEvaluator(expression, bindingContext).bind(null, bindingContext);
      Object.defineProperty(accessor, option, {
        get: getter,
        enumerable: true
      });
    });
    Object.defineProperty(accessor, oj.ComponentBinding._OPTION_MAP, {
      value: attributeMap
      /* not enumerable */

    });
    return accessor;
  }; // Define toString() for the custom accessor function since we do not want the entire function body to show up in
  // the log whenever a binding evaluation error occurs


  accessorFunc.toString = function () {
    return bindingExpr;
  };

  return accessorFunc;
}
/**
 * @param node
 * @param bindingName
 * @param wrapped
 * @param bindingContext
 * @ignore
 */


function _getBindingValueInfo(node, bindingName, wrapped, bindingContext) {
  var list = null;
  var bindingString = BindingProviderImpl.getBindingsString(node, wrapped, bindingContext);
  var keyValueArray = ko.jsonExpressionRewriting.parseObjectLiteral(bindingString);
  var selfVal = null;

  _keyValueArrayForEach(keyValueArray, function (key, value) {
    if (key === bindingName) {
      selfVal = value;
      return true;
    }

    return false;
  });

  if (selfVal != null) {
    // check for object literal
    if (selfVal.indexOf('{') === 0) {
      list = ko.jsonExpressionRewriting.parseObjectLiteral(selfVal);
    }
  }

  return {
    attrList: list,
    bindingExpr: selfVal
  };
}

function _keyValueArrayForEach(array, callback) {
  for (var i = 0; i < array.length; i++) {
    var entry = array[i];
    var key = entry.key;
    var value = entry.value;

    if (key != null && value != null && callback(key.trim(), value.trim())) {
      break;
    }
  }
}

BindingProviderImpl.addPostprocessor({
  nodeHasBindings: function nodeHasBindings(node, wrappedReturn) {
    if (!oj.BaseCustomElementBridge) {
      return wrappedReturn;
    }

    return wrappedReturn || node.nodeType === 1 && oj.BaseCustomElementBridge.getRegistered(node.nodeName);
  },
  getBindingAccessors: function getBindingAccessors(node, bindingContext, wrappedReturn) {
    if (node.nodeType === 1 && oj.BaseCustomElementBridge) {
      var name = node.nodeName;
      var info = oj.BaseCustomElementBridge.getRegistered(name);

      if (info) {
        // eslint-disable-next-line no-param-reassign
        wrappedReturn = wrappedReturn || {}; // eslint-disable-next-line no-param-reassign

        wrappedReturn._ojCustomElement = function () {
          return {
            composite: info.composite
          };
        };
      }
    }

    return wrappedReturn;
  }
});



/* global ko:false */

/**
 * @ignore
 */
(function () {
  var _ATTRIBUTE_CHANGED = 'attribute-changed';
  ko.bindingHandlers._ojCustomElement = {
    after: ['attr'],
    // Ensure attr binding is processed first so to handle :disabled case since we only process on init
    init: function init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      // Apply child bindings first
      ko.applyBindingsToDescendants(bindingContext, element);
      return {
        controlsDescendantBindings: true
      };
    },
    update: function update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var _expressionHandler;

      var attributeListener; // This instance won't be created unless oj.BaseCustomElementBridge is defined so this call is safe

      var bridge = oj.BaseCustomElementBridge.getInstance(element);

      function cleanup() {
        if (_expressionHandler) {
          _expressionHandler.teardown();

          _expressionHandler = null;
        }

        if (attributeListener) {
          element.removeEventListener(_ATTRIBUTE_CHANGED, attributeListener);
          attributeListener = null;
        }
      }

      function setup(isComposite) {
        var metadataProps = oj.BaseCustomElementBridge.getProperties(bridge);
        _expressionHandler = new oj.__ExpressionPropertyUpdater(element, bindingContext, isComposite); // Dummy metadata for passing to the ExpressionPropertyUpdater for DOM listener attributes i.e. on-*

        var domListenerMetadata = {
          _domListener: true
        }; // Set a flag on the bridge to indicate that we are initializing expressions from the DOM
        // to avoid overriding any property sets that could have occured after

        bridge.__INITIALIZING_PROPS = true; // setupExpression will only update properties defined in metadata so it's safe to iterate through all element attributes
        // including ones defined on the base HTML prototype

        var attrs = element.attributes; // attrs is a NamedNodeMap

        for (var i = 0; i < attrs.length; i++) {
          var attr = attrs[i];

          var propName = oj.__AttributeUtils.attributeToPropertyName(attr.nodeName);

          var eventName = oj.__AttributeUtils.eventListenerPropertyToEventType(propName);

          var isDomEvent = eventName && !metadataProps[propName];

          _expressionHandler.setupExpression(attr.value, propName, isDomEvent ? domListenerMetadata : metadataProps[propName.split('.')[0]]);
        }

        bridge.__INITIALIZING_PROPS = false;

        attributeListener = function attributeListener(evt) {
          var detail = evt.detail;
          var _attr = detail.attribute;

          var _propName = oj.__AttributeUtils.attributeToPropertyName(_attr);

          var _eventName = oj.__AttributeUtils.eventListenerPropertyToEventType(_propName);

          var _isDomEvent = _eventName && !metadataProps[_propName];

          var metadata = _isDomEvent ? domListenerMetadata : metadataProps[_propName.split('.')[0]]; // send metadata for top level property

          _expressionHandler.setupExpression(detail.value, _propName, metadata);
        };

        element.addEventListener(_ATTRIBUTE_CHANGED, attributeListener);
      } // Since we are tracking all our dependencies explicitly, we are suspending dependency detection here.
      // update() will be called only once as a result


      ko.ignoreDependencies(function () {
        ko.computed(function () {
          // Access valueAccesor to ensure that the binding is re-initialzied when an
          // observable ViewModel is mutated
          var isComposite = valueAccessor().composite;

          if (!ko.computedContext.isInitial()) {
            cleanup();
          }

          setup(isComposite);
          bridge.playbackEarlyPropertySets(element);

          oj._KnockoutBindingProvider.getInstance().__NotifyBindingsApplied(element);
        }, null, {
          disposeWhenNodeIsRemoved: element
        });
      });
      ko.utils.domNodeDisposal.addDisposeCallback(element, cleanup);
    }
  };
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



/* global ko:false, ComponentChangeTracker:false, Logger:false, BindingProviderImpl:false */

/**
 * @ignore
 * @constructor
 * @private
 */
oj.__ExpressionPropertyUpdater = function (element, bindingContext, skipThrottling) {
  var _throttler = _setupComponentChangeTracker();

  var _domListeners = {};
  var _expressionListeners = {};
  var _changeListeners = {};
  var _settingProperties = {};
  var _CHANGED_EVENT_SUFFIX = 'Changed'; // This function should be called when the bindings are applied initially and whenever the expression attribute changes

  this.setupExpression = function (attrVal, propName, metadata) {
    // If no metadata was passed in, just return bc this is not a component property.
    if (!metadata) {
      return undefined;
    } // See if attribute is a component property/subproperty by checking for metadata


    var meta = _getPropertyMetadata(propName, metadata);

    if (!meta) {
      return undefined;
    }

    var info = oj.__AttributeUtils.getExpressionInfo(attrVal);

    var oldListener = _expressionListeners[propName];

    if (oldListener) {
      oldListener.dispose();
      _expressionListeners[propName] = null;
    } // Clean up property change listeners to handler the case when the type of the expression changes


    var changeListener = _changeListeners[propName];

    if (changeListener) {
      element.removeEventListener(propName + _CHANGED_EVENT_SUFFIX, changeListener);
      _changeListeners[propName] = null;
    }

    if (metadata._domListener) {
      var event = oj.__AttributeUtils.eventListenerPropertyToEventType(propName); // If the attribute is removed, there won't be a new expression so the remove call
      // below can't be relied upon.  So clean up here as well to handle that case


      _setDomListener(bindingContext, event, null);
    }

    var readOnly = metadata.readOnly;
    var expr = info.expr;

    if (expr) {
      var evaluator = BindingProviderImpl.createEvaluator(expr, bindingContext);

      if (!readOnly) {
        var initialRead = true;
        ko.ignoreDependencies(function () {
          _expressionListeners[propName] = ko.computed( // The read() function for the computed will be called when the computed is created and whenever any of
          // the expression's dependency changes
          function () {
            var value = evaluator(bindingContext);
            var unwrappedValue = ko.utils.unwrapObservable(value);

            if (metadata._domListener) {
              var _event = oj.__AttributeUtils.eventListenerPropertyToEventType(propName);

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
                  unwrappedValue = _createSimpleEventListenerWrapper(bindingContext, unwrappedValue);
                }
              }

              if (!initialRead && _throttler) {
                _throttler.addChange(propName, unwrappedValue);
              } else {
                _setElementProperty(propName, unwrappedValue);
              }
            }
          });
        });
        initialRead = false;
      } // Only listen for property changes for writeable properties


      if (metadata.writeback && !info.downstreamOnly) {
        _changeListeners[propName] = _listenToPropertyChanges(propName, expr, evaluator);
      }

      return true;
    }

    return false;
  };

  this.teardown = function () {
    var i;
    var names = Object.keys(_expressionListeners);

    for (i = 0; i < names.length; i++) {
      var listener = _expressionListeners[names[i]]; // listener might be null if this attribute changed from an expression to a literal

      if (listener) {
        listener.dispose();
      }
    }

    _expressionListeners = {}; // reset change listeners

    names = Object.keys(_changeListeners);

    for (i = 0; i < names.length; i++) {
      var prop = names[i].split('.')[0];
      element.removeEventListener(prop + _CHANGED_EVENT_SUFFIX, _changeListeners[prop]);
    }

    _changeListeners = {}; // dom event listeners

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

    var domListener = function domListener(event) {
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
      var property = oj.__AttributeUtils.eventTypeToEventListenerProperty(event);

      var attribute = oj.__AttributeUtils.propertyNameToAttribute(property);

      var message = "Invalid type '" + _typeof(listener) + "' found for attribute '" + attribute + "'. Expected value of type 'function'.";

      if (oj.BaseCustomElementBridge && oj.BaseCustomElementBridge.getRegistered(element.tagName)) {
        // Delegate so ready promise can be rejected
        var bridge = oj.BaseCustomElementBridge.getInstance(element);
        bridge.throwError(element, message);
      } else {
        // copied from oj.BaseCustomElementBridge.getElementInfo
        var elementInfo = element.tagName.toLowerCase() + " with id '" + element.id + "'";
        throw new Error(elementInfo + ': ' + message);
      }
    }
  }

  function _listenToPropertyChanges(propName, expr, evaluator) {
    var splitProps = propName.split('.');
    var topProp = splitProps[0];

    var listener = function listener(evt) {
      if (!_isSettingProperty(topProp)) {
        var written = false;
        var reason;
        ko.ignoreDependencies(function () {
          var value = evt.detail.value; // If the propName has '.' we need to walk the top level value and writeback
          // subproperty value

          for (var i = 1; i < splitProps.length; i++) {
            var subprop = splitProps[i];
            value = value[subprop];
          }

          var target = evaluator(bindingContext);

          if (ko.isObservable(target)) {
            if (ko.isWriteableObservable(target)) {
              target(oj.ComponentBinding.__cloneIfArray(value));
              written = true;
            } else {
              reason = 'the observable is not writeable';
            }
          } else {
            var writerExpr = oj.__ExpressionUtils.getPropertyWriterExpression(expr);

            if (writerExpr != null) {
              var wrirerEvaluator = BindingProviderImpl.createEvaluator(writerExpr, bindingContext);

              var func = oj.__ExpressionUtils.getWriter(wrirerEvaluator(bindingContext));

              func(oj.ComponentBinding.__cloneIfArray(value));
              written = true;
            } else {
              reason = 'the expression is not a valid update target';
            }
          }
        });

        if (!written) {
          if (reason) {
            Logger.info("The expression '%s' for property '%s' was not updated because %s.", expr, propName, reason);
          }
        }
      }
    };

    element.addEventListener(topProp + _CHANGED_EVENT_SUFFIX, listener);
    return listener;
  }

  function _setElementProperty(propName, value) {
    _startSettingProperty(propName);

    try {
      element.setProperty(propName, value);
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
      Logger.error('Property count undefrlow');
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

    var updater = function updater(changes) {
      var keys = Object.keys(changes);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i]; // We rely on the flag set by the _startSettingProperty() to determine whether
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



/* global ko:false, BindingProviderImpl:false */

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
    nodeHasBindings: function nodeHasBindings(node, wrappedReturn) {
      var bindings = _getBindings(node);

      return wrappedReturn || bindings._ATTR_BIND != null || bindings._STYLE_BIND != null || bindings._EVENT_BIND != null;
    },
    getBindingAccessors: function getBindingAccessors(node, bindingContext, wrappedReturn) {
      if (node.nodeType === 1) {
        // eslint-disable-next-line no-param-reassign
        wrappedReturn = wrappedReturn || {};

        var bindings = _getBindings(node);

        var i;
        var attr; // Style bindings

        var styleAttrs = bindings._STYLE_BIND;

        if (styleAttrs) {
          if (wrappedReturn.style) {
            throw new Error('Cannot have both style data-bind and JET style binding on ' + node.tagName + ' with id ' + node.id);
          } // If :style is set, any additional :style.* attributes would have thrown an error earlier


          if (styleAttrs === 'style') {
            // eslint-disable-next-line no-param-reassign
            wrappedReturn[styleAttrs] = _getValueEvaluator(node, styleAttrs, node.getAttribute(_getBoundAttrName(styleAttrs)), bindingContext, 'object');
          } else {
            var styleEvaluators = {};

            for (i = 0; i < styleAttrs.length; i++) {
              attr = styleAttrs[i];

              var styleProp = oj.__AttributeUtils.attributeToPropertyName(attr.substring(6));

              styleEvaluators[styleProp] = _getValueEvaluator(node, attr, node.getAttribute(_getBoundAttrName(attr)), bindingContext, 'string');
            } // eslint-disable-next-line no-param-reassign


            wrappedReturn.style = _getObjectEvaluator(styleEvaluators);
          }
        } // All other attribute bindings


        var boundAttrs = bindings._ATTR_BIND;

        if (boundAttrs) {
          if (wrappedReturn.attr) {
            throw new Error('Cannot have both attr data-bind and JET attribute binding on ' + node.tagName + ' with id ' + node.id);
          }

          var attrEvaluators = {};

          for (i = 0; i < boundAttrs.length; i++) {
            attr = boundAttrs[i]; // For the class attribute, we also support array and object types so we should check
            // for arrays and convert to a computed that returns a string for knockout. For object
            // types we pass to knockout's css binding instead of attr so pass the attrEvaluators object
            // and the wrappedReturn to the method to determine which to use.

            if (attr === 'class') {
              _setClassEvaluator(wrappedReturn, attrEvaluators, node, node.getAttribute(_getBoundAttrName(attr)), bindingContext);
            } else {
              attrEvaluators[attr] = _getValueEvaluator(node, attr, node.getAttribute(_getBoundAttrName(attr)), bindingContext, 'string');
            }
          } // eslint-disable-next-line no-param-reassign


          wrappedReturn.attr = _getObjectEvaluator(attrEvaluators);
        } // Event bindings for native HTML elements


        var eventAttrs = bindings._EVENT_BIND;

        if (eventAttrs) {
          // Delegate to ExpressionPropertyUpdater, which is also responsible for
          // setting up the event bindings for custom elements.
          var expressionHandler = new oj.__ExpressionPropertyUpdater(node, bindingContext, true);

          for (i = 0; i < eventAttrs.length; i++) {
            var attrNode = eventAttrs[i];

            var propName = oj.__AttributeUtils.attributeToPropertyName(attrNode.nodeName);

            expressionHandler.setupExpression(attrNode.value, propName, {
              _domListener: true
            });
          }

          ko.utils.domNodeDisposal.addDisposeCallback(node, function () {
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

    var dataExp = oj.__AttributeUtils.getExpressionInfo(dataValue).expr;

    if (!dataExp) {
      try {
        var literalValue = JSON.parse(dataValue);

        if (Array.isArray(literalValue)) {
          dataExp = dataValue;
        } else {
          throw new Error('got value ' + dataValue);
        }
      } catch (e) {
        throw new Error('The value on the oj-bind-for-each data attribute should be either a JSON array or an expression : ' + e);
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

    var koOpenComment = document.createComment(binding);
    var koCloseComment = document.createComment('/ko');
    parent.insertBefore(koOpenComment, node); // @HTMLUpdateOK

    var newNodes = [ojOpenComment, koOpenComment];
    var child; // Copy oj-bind-x children into the comment node

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

        if (child.nodeType === 1 && child.nodeName.toLowerCase() === 'template') {
          if (!koOpenComment._templateNode) {
            Object.defineProperty(koOpenComment, '_templateNode', {
              value: child,
              enumerable: false
            });
          } else {
            throw new Error('Multiple templates found: oj-bind-for-each requires a single template element as its direct child');
          }
        }
      } // check for the template since it is a required attribute for oj-bind-for-each.


      if (!koOpenComment._templateNode) {
        throw new Error('Template not found: oj-bind-for-each requires a single template element as its direct child');
      }
    }

    parent.insertBefore(koCloseComment, node); // @HTMLUpdateOK

    newNodes.push(koCloseComment);
    parent.replaceChild(ojCloseComment, node); // @HTMLUpdateOK

    newNodes.push(ojCloseComment);
    return newNodes;
  }

  function _getExpression(attrValue, stringify) {
    if (attrValue != null) {
      var exp = oj.__AttributeUtils.getExpressionInfo(attrValue).expr;

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

  function _setClassEvaluator(wrappedReturn, attrEvaluators, elem, value, bindingContext) {
    var evaluator;
    var resolvedValue;
    var isArray;

    var exp = oj.__AttributeUtils.getExpressionInfo(value).expr;

    if (exp == null) {
      resolvedValue = oj.__AttributeUtils.coerceValue(elem, 'class', value, 'any');
      isArray = Array.isArray(resolvedValue);

      evaluator = function evaluator() {
        return isArray ? resolvedValue.join(' ') : resolvedValue;
      };
    } else {
      evaluator = BindingProviderImpl.createEvaluator(exp, bindingContext).bind(null, bindingContext);
      var classObs = evaluator();

      if (typeof classObs === 'function') {
        resolvedValue = classObs();
        isArray = Array.isArray(resolvedValue);

        if (isArray) {
          evaluator = ko.pureComputed(function () {
            return classObs().join(' ');
          });
        }
      } else {
        // Non observable data bound attribute
        resolvedValue = classObs;
        isArray = Array.isArray(resolvedValue);

        if (isArray) {
          evaluator = function evaluator() {
            return resolvedValue.join(' ');
          };
        }
      }
    }

    if (typeof resolvedValue === 'string' || isArray) {
      // eslint-disable-next-line no-param-reassign
      attrEvaluators.class = evaluator;
    } else {
      // eslint-disable-next-line no-param-reassign
      wrappedReturn.css = evaluator;
    }
  }

  function _getValueEvaluator(elem, attr, value, bindingContext, type) {
    var exp = oj.__AttributeUtils.getExpressionInfo(value).expr;

    if (exp == null) {
      return function () {
        return type === 'object' ? oj.__AttributeUtils.coerceValue(elem, attr, value, type) : value;
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
      // Using the weird notation below instead of:
      // var isCustomElement = oj.BaseCustomElementBridge && oj.BaseCustomElementBridge.getRegistered(node.nodeName);
      // because it causes minification error for some reason.
      var isCustomElement = oj.BaseCustomElementBridge ? !!oj.BaseCustomElementBridge.getRegistered(node.nodeName) : false; // Iterate through all attributes on the element and find those that are using our
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
        } // Handle event binding for native HTML elements.
        // The event binding for custom elements is handled by the bridge.


        if (!isCustomElement && attr.name.substring(0, 3) === 'on-') {
          boundEvents.push(attr);
        }
      }

      if (boundStyle.length) {
        if (bindings._STYLE_BIND) {
          throw new Error('Cannot have both style and style.* data bound attributes on ' + node.tagName + ' with id ' + node.id);
        } else {
          bindings._STYLE_BIND = boundStyle;
        }
      }

      if (boundAttrs.length) {
        bindings._ATTR_BIND = boundAttrs;
      }

      if (boundEvents.length) {
        bindings._EVENT_BIND = boundEvents;
      } // Cache attribute map as a non-enumerable property so we don't have to loop again
      // in getBindingAccessors


      Object.defineProperty(node, _BINDINGS, {
        value: bindings
      });
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



/* global Promise:false */

/**
 * @ignore
 * @constructor
 * @private
 */
oj._KnockoutBindingProvider = function () {
  /**
   * @ignore
   */
  this._resolveWhenChildrenBindingsApplied = function (elem, trackOption) {
    var childrenPromises = this._getChildrenBindingsAppliedPromises(elem);

    if (trackOption === 'none' || childrenPromises.length === 0) {
      oj.BaseCustomElementBridge.getInstance(elem).resolveBindingProvider(this);
    } else {
      var promises = [];

      while (childrenPromises.length > 0) {
        var callbackItem = childrenPromises.shift();

        if (trackOption === 'nearestCustomElement' || trackOption === 'immediate' && callbackItem.immediate === true) {
          promises.push(callbackItem.promiseCallback);
        }
      }

      Promise.all(promises).then(function () {
        this._resolveWhenChildrenBindingsApplied(elem, trackOption);
      }.bind(this));
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
    // This method is only called from the CustomElementBinding where we know the
    // oj.BaseCustomElementBridge class is available
    var trackOption = oj.BaseCustomElementBridge.getTrackChildrenOption(elem);

    this._resolveWhenChildrenBindingsApplied(elem, trackOption);
  };
};
/**
 * @ignore
 */


oj._KnockoutBindingProvider.getInstance = function () {
  return oj._KnockoutBindingProvider._instance;
};
/**
 * @ignore
 */


oj._KnockoutBindingProvider._instance = new oj._KnockoutBindingProvider();



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
 *           <a href="./CustomElementOverview.html#ce-databind-global-section">global attribute</a>
 *           data binding doc for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">css</td>
 *       <td>:class="[[classList]]"</td>
 *       <td>Supports the normal space delimited string of classes,
 *           an array of classes, or a map of class to boolean values
 *           for toggling classes in the DOM. See the custom element
 *           <a href="./CustomElementOverview.html#ce-databind-class-section">class</a>
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
 *           <a href="./CustomElementOverview.html#ce-events-section">event</a>
 *           data binding doc for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">foreach</td>
 *       <td>oj-bind-for-each</td>
 *       <td>See the <a href="./oj.ojBindForEach.html">oj-bind-for-each</a> binding element doc
 *           for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">html</td>
 *       <td>oj-bind-dom</td>
 *       <td>See the <a href="./oj.ojBindDom.html">oj-bind-dom</a> binding element doc
 *           for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">if</td>
 *       <td>oj-bind-if</td>
 *       <td>See the <a href="./oj.ojBindIf.html">oj-bind-if</a> binding element doc
 *           for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">template</td>
 *       <td>oj-bind-template-slot if being used inside a composite or oj-module for other cases</td>
 *       <td>See the <a href="./oj.ojBindTemplateSlot.html">oj-bind-template-slot</a> binding element and
 *           <a href="./oj.ojModule.html">oj-module</a> element doc
 *           for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">text</td>
 *       <td>oj-bind-text</td>
 *       <td>See the <a href="./oj.ojBindText.html">oj-bind-text</a> binding element doc
 *           for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">visible</td>
 *       <td>:style.display="[[ CONDITION ? '' : 'none' ]]"</td>
 *       <td> See the custom element
 *           <a href="./CustomElementOverview.html#ce-databind-style-section">style</a>
 *           data binding doc for details.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 *
 * @ojfragment bindingOverviewDoc
 * @memberof BindingOverview
 */



/* global ko:false */

/**
 * Returns a renderer function and executes the template specified in the binding attribute. (for example, a knockout template).
 * @param {Object} bindingContext the ko binding context
 * @param {string} template the name of the template
 * @return {Function} the renderer function
 * @private
 */
function _getDvtRenderer(bindingContext, template) {
  return function (context) {
    var model = bindingContext.createChildContext(context.context);
    ko.renderTemplate(template, model, {
      afterRender: function afterRender(renderedElement) {
        $(renderedElement)._ojDetectCleanData();
      }
    }, context.parentElement);
    return null;
  };
}
/**
 * Returns a renderer function and executes the template specified in the binding attribute for data items. (for example, a knockout template).
 * @param {Object} bindingContext the ko binding context
 * @param {string} template the name of the template
 * @return {Function} the renderer function
 * @private
 */
// eslint-disable-next-line no-unused-vars


function _getDvtDataRenderer(bindingContext, template) {
  return function (context) {
    var model = bindingContext.createChildContext(context.data);
    ko.renderTemplate(template, model, {
      afterRender: function afterRender(renderedElement) {
        $(renderedElement)._ojDetectCleanData();
      }
    }, context.parentElement);
    return null;
  };
}
/**
 * Common method to handle managed attributes for both init and update
 * @param {string} name the name of the attribute
 * @param {Object} value the value of the attribute
 * @param {Object} bindingContext the ko binding context
 * @return {Object} the modified attribute
 * @private
 */


function _handleManagedTooltipAttributes(name, value, bindingContext) {
  if (name === 'tooltip' && value.template) {
    // eslint-disable-next-line no-param-reassign
    value._renderer = _getDvtRenderer(bindingContext, value.template);
  }

  return {
    tooltip: value
  };
}

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  attributes: ['tooltip'],
  init: function init(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleManagedTooltipAttributes(name, value, bindingContext);
  },
  update: function update(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleManagedTooltipAttributes(name, value, bindingContext);
  },
  for: 'tooltipOptionRenderer'
}); // Default declarations for all components supporting tooltips

(function () {
  var componentsArray = ['ojChart', 'ojDiagram', 'ojNBox', 'ojPictoChart', 'ojSunburst', 'ojTagCloud', 'ojThematicMap', 'ojTreemap', 'ojDialGauge', 'ojLedGauge', 'ojRatingGauge', 'ojSparkChart', 'ojStatusMeterGauge', 'ojGantt'];

  for (var i = 0; i < componentsArray.length; i++) {
    oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
      for: componentsArray[i],
      use: 'tooltipOptionRenderer'
    });
  }
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



/**
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

/* global ko:false, Symbol:false, Map:false, KeySetImpl:false, Context:false, BindingProviderImpl: false, Promise:false, templateEngine:false */
(function () {
  'use strict'; // index.js
  // --------
  // Fast For Each
  //
  // Employing sound techniques to make a faster Knockout foreach binding.
  // --------
  //      Utilities

  var MAX_LIST_SIZE = 9007199254740991;
  var supportsDocumentFragment = document && typeof document.createDocumentFragment === 'function'; // Mimic a KO change item 'add'

  function valueToChangeAddItem(value, index, key) {
    return {
      status: 'added',
      value: value,
      index: index,
      key: key
    };
  } // Mimic a KO change item 'delete'


  function valueToChangeDeleteItem(index) {
    return {
      status: 'deleted',
      value: {},
      index: index
    };
  } // KO 3.4 doesn't seem to export this utility function so it's here just to be sure


  function createSymbolOrString(identifier) {
    // return typeof Symbol === 'function' ? Symbol(identifier) : identifier;
    return identifier;
  } // Array.prototype.map doesn't execute the mapping function on indices that don't have assigned values
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

    while (parent && !oj.ElementUtils.isValidCustomElementName(parent.localName)) {
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
  } // store a symbol for caching the pending delete info index in the data item objects


  var PENDING_DELETE_INDEX_KEY = createSymbolOrString('_ko_ffe_pending_delete_index');
  /**
   * @constructor
   * @private
   * @since 4.1.0
   */

  function OjForEach(element, value, context) {
    this.element = value.element || element;
    this.element._templateNode.__ojBindingContext = context;
    this.data = value.data;
    this.as = value.as;
    this.changeQueue = [];
    this.firstLastNodesList = [];
    this.indexesToDelete = [];
    this.rendering_queued = false;
    this.pendingDeletes = []; // Remove existing content.

    ko.virtualElements.emptyNode(this.element);

    this._initChildrenBindingsAppliedPromise();

    if (this.data.fetchFirst) {
      // the data is a DataProvider object
      this.fetchData();
    } else {
      // Prime content
      var primeData = ko.unwrap(this.data);
      this.onArrayChange(arrayMap(primeData, valueToChangeAddItem));
    }

    this.addSubscriptions();
  }

  OjForEach.PENDING_DELETE_INDEX_KEY = PENDING_DELETE_INDEX_KEY;

  OjForEach.prototype.addSubscriptions = function () {
    // Watch for changes
    if (ko.isObservable(this.data)) {
      if (!this.data.indexOf) {
        // Make sure the observable is trackable.
        this.data = this.data.extend({
          trackArrayChanges: true
        });
      }

      this.changeSubs = this.data.subscribe(this.onArrayChange, this, 'arrayChange');
    } else if (this.data.fetchFirst) {
      // add listener to handle DataProvider events
      this.dataMutateHandler = this.handleDataMutateEvent.bind(this);
      this.dataRefreshHandler = this.handleDataRefreshEvent.bind(this);
      this.data.addEventListener('mutate', this.dataMutateHandler);
      this.data.addEventListener('refresh', this.dataRefreshHandler);
    }
  };

  OjForEach.prototype.removeSubscriptions = function () {
    if (this.changeSubs) {
      this.changeSubs.dispose();
    } else if (this.data.removeEventListener) {
      this.data.removeEventListener('mutate', this.dataMutateHandler);
      this.data.removeEventListener('refresh', this.dataRefreshHandler);
    }
  };

  OjForEach.prototype.registerBusyState = function () {
    var containerElement = this.element.parentNode;
    var busyContext = Context.getContext(containerElement).getBusyContext();
    return busyContext.addBusyState({
      description: 'oj-bind-for-each binding on a node with the Id ' + containerElement.id + 'is loading data.'
    });
  }; // initializes a promise for expanding an element and applying bindings to its children


  OjForEach.prototype._initChildrenBindingsAppliedPromise = function () {
    var currentContext = this.element._templateNode.__ojBindingContext.$current;
    var parentTrackingContext = currentContext ? {
      _nearestCustomParent: currentContext._nearestCustomParent,
      _immediate: currentContext._immediate
    } : null;
    var nearestCustomParent = findNearestCustomParent(this.element, parentTrackingContext);
    var isImmediate = findImmediateState(this.element, nearestCustomParent, parentTrackingContext);
    this.trackingContext = {
      _nearestCustomParent: nearestCustomParent,
      _immediate: isImmediate
    };
    this._childrenBindingsPromiseResolver = oj._KnockoutBindingProvider.getInstance().__RegisterBindingAppliedPromiseForChildren(nearestCustomParent, isImmediate);
  }; // resolves _whenChildrenBindingsApplied promise for the element


  OjForEach.prototype._resolveChildrenBindingsAppliedPromise = function () {
    if (this._childrenBindingsPromiseResolver) {
      this._childrenBindingsPromiseResolver();

      this._childrenBindingsPromiseResolver = null;
    }
  }; // This function is used to retrieve data from data provider - on initial update and
  // to handle refresh operation


  OjForEach.prototype.fetchData = function () {
    var busyStateCallback = this.registerBusyState();
    var iterator = this.data.fetchFirst({
      size: -1
    })[Symbol.asyncIterator](); // function passed to iterator.next() promise on success, until result.done is set to true

    var getProcessResultsFunc = function getProcessResultsFunc(changeSet, onArrayChangeCallback, callbackObj, dataPromise) {
      return function (result) {
        if (callbackObj.dataPromise === dataPromise) {
          var value = result.value;
          var entryIndex = changeSet.length;

          for (var i = 0; i < value.metadata.length && i < value.data.length; i++) {
            changeSet.push(valueToChangeAddItem(value.data[i], entryIndex, value.metadata[i].key));
            entryIndex += 1;
          }

          if (result.done) {
            onArrayChangeCallback.call(callbackObj, changeSet);
            busyStateCallback();
          } else {
            var dataPromiseLocal = iterator.next(); // eslint-disable-next-line no-param-reassign

            callbackObj.dataPromise = dataPromiseLocal;
            dataPromiseLocal.then(getProcessResultsFunc(changeSet, onArrayChangeCallback, callbackObj, dataPromiseLocal), function () {
              busyStateCallback();
            });
          }
        } else {
          busyStateCallback();
        }
      };
    };

    var dataPromiseLocal = iterator.next();
    this.dataPromise = dataPromiseLocal;
    dataPromiseLocal.then(getProcessResultsFunc([], this.onArrayChange, this, dataPromiseLocal), function () {
      busyStateCallback();
    });
  }; // This function populates an array of indexes either from event indexes or
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
  }; // Handler that processes "mutate" event from DataProvider


  OjForEach.prototype.handleDataMutateEvent = function (event) {
    var addDetail = event.detail.add;
    var removeDetail = event.detail.remove;
    var updateDetail = event.detail.update;
    var changes = [];
    var eventKeys;
    var dataIndex;
    var dataIndexes;
    var busyStateCallback;
    var self = this;

    if (addDetail) {
      var eventData = addDetail.data;
      eventKeys = addDetail.keys; // afterKeys is deprecated, but continue to support it until we can remove it.
      // getIndexesForEvent can take either array or set as its argument.

      dataIndexes = this.getIndexesForEvent(addDetail.indexes, addDetail.addBeforeKeys ? addDetail.addBeforeKeys : addDetail.afterKeys);

      var getCurrentIndex = function getCurrentIndex(entryIndex) {
        var currentIndex = dataIndexes.length > entryIndex ? dataIndexes[entryIndex] : this.firstLastNodesList.length + entryIndex; // add entry to the end

        if (currentIndex === undefined) {
          return this.firstLastNodesList.length;
        }

        return currentIndex;
      };

      if (!Array.isArray(eventData)) {
        // data were not sent, should fetch data using keys
        busyStateCallback = this.registerBusyState();
        this.data.fetchByKeys({
          keys: eventKeys
        }).then(function (keyResult) {
          // got map of keys to oj.Item - each item is an object with data and metadata props
          if (keyResult.results.size > 0) {
            var _dataIndex = 0;
            eventKeys.forEach(function (keyValue) {
              var dataItem = keyResult.results.get(keyValue).data;
              changes.push(valueToChangeAddItem(dataItem, getCurrentIndex(_dataIndex), keyValue));
              _dataIndex += 1;
            });
            self.onArrayChange(changes);
          }

          busyStateCallback();
        }, function () {
          busyStateCallback();
        });
      } else {
        // data were sent with the event, don't have to fetch them
        dataIndex = 0; // used to iterate trough eventData

        eventKeys.forEach(function (keyValue) {
          changes.push(valueToChangeAddItem(eventData[dataIndex], getCurrentIndex(dataIndex), keyValue));
          dataIndex += 1;
        }, this);
      }
    } else if (removeDetail) {
      // get indexes to delete using either indexes or given keys
      dataIndexes = this.getIndexesForEvent(removeDetail.indexes, removeDetail.keys);
      dataIndexes = dataIndexes.filter(function (value) {
        return value !== undefined;
      });
      changes = dataIndexes.map(valueToChangeDeleteItem);
    } else if (updateDetail) {
      eventKeys = updateDetail.keys;
      dataIndexes = this.getIndexesForEvent(updateDetail.indexes, eventKeys);

      if (!Array.isArray(updateDetail.data)) {
        // data were not sent, need to fetch data
        busyStateCallback = this.registerBusyState();
        this.data.fetchByKeys({
          keys: eventKeys
        }).then(function (keyResult) {
          var _dataIndex = 0;

          if (keyResult.results.size > 0) {
            eventKeys.forEach(function (keyValue) {
              if (dataIndexes[_dataIndex] !== undefined) {
                var dataItem = keyResult.results.get(keyValue).data;
                changes.push(valueToChangeDeleteItem(dataIndexes[_dataIndex]));
                changes.push(valueToChangeAddItem(dataItem, dataIndexes[_dataIndex], keyValue));
              }

              _dataIndex += 1;
            });
            self.onArrayChange(changes);
          }

          busyStateCallback();
        }, function () {
          busyStateCallback();
        });
      } else {
        // got event data, don't have to fetch them
        dataIndex = 0;
        eventKeys.forEach(function (keyValue) {
          if (dataIndexes[dataIndex] !== undefined) {
            changes.push(valueToChangeDeleteItem(dataIndexes[dataIndex]));
            changes.push(valueToChangeAddItem(updateDetail.data[dataIndex], dataIndexes[dataIndex], keyValue));
          }

          dataIndex += 1;
        });
      }
    } // perform changes using specified changes set


    if (changes.length > 0) {
      this.onArrayChange(changes);
    }
  }; // Handler that processes "refresh" event from DataProvider


  OjForEach.prototype.handleDataRefreshEvent = function () {
    // clean up existing content
    this.changeQueue = [];
    this.firstLastNodesList = [];
    this.indexesToDelete = [];
    this.rendering_queued = false;
    this.pendingDeletes = [];
    ko.virtualElements.emptyNode(this.element); // refetch data and recreate the child nodes

    this.fetchData();
  }; // If the array changes we register the change.


  OjForEach.prototype.onArrayChange = function (changeSet) {
    var self = this;
    var changeMap = {
      added: [],
      deleted: []
    };
    var statusAdded = 'added';
    var statusDeleted = 'deleted'; // knockout array change notification index handling:
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
      this.changeQueue.push({
        status: 'clearDeletedIndexes'
      });
    }

    this.changeQueue.push.apply(this.changeQueue, changeMap[statusAdded]); // Once a change is registered, the ticking count-down starts for the processQueue.

    if (this.changeQueue.length > 0 && !this.rendering_queued) {
      this.rendering_queued = true;
      self.processQueue();
    }

    this._resolveChildrenBindingsAppliedPromise();
  }; // Reflect all the changes in the queue in the DOM, then wipe the queue.


  OjForEach.prototype.processQueue = function () {
    var self = this;
    var lowestIndexChanged = MAX_LIST_SIZE;
    ko.utils.arrayForEach(this.changeQueue, function (changeItem) {
      if (typeof changeItem.index === 'number') {
        lowestIndexChanged = Math.min(lowestIndexChanged, changeItem.index);
      } // console.log(self['data'](), "CI", JSON.stringify(changeItem, null, 2), JSON.stringify($(self.element).text()))


      self[changeItem.status](changeItem); // console.log("  ==> ", JSON.stringify($(self.element).text()))
    });
    this.flushPendingDeletes();
    this.rendering_queued = false; // Update our indexes.

    this.updateIndexes(lowestIndexChanged);
    this.changeQueue = [];
  }; // Process a changeItem with {status: 'added', ...}

  /**
   * @expose
   * @ignore
   */


  OjForEach.prototype.added = function (changeItem) {
    var index = changeItem.index;
    var valuesToAdd = changeItem.isBatch ? changeItem.values : [changeItem.value];
    var keysToAdd = changeItem.isBatch ? changeItem.keys : [changeItem.key];
    var referenceElement = this.getLastNodeBeforeIndex(index); // gather all childnodes for a possible batch insertion

    var allChildNodes = [];

    for (var i = 0, len = valuesToAdd.length; i < len; ++i) {
      var childNodes;
      var currentChildContext; // we check if we have a pending delete with reusable nodesets for this data, and if yes, we reuse one nodeset

      var pendingDelete = this.getPendingDeleteFor(valuesToAdd[i]);

      if (pendingDelete && pendingDelete.nodesets.length) {
        childNodes = pendingDelete.nodesets.pop();
        currentChildContext = pendingDelete.currentChildContext;
      } else {
        currentChildContext = {
          data: valuesToAdd[i],
          index: index + i,
          observableIndex: ko.observable()
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
        childNodes = templateEngine.execute(this.element, this.element._templateNode, currentChildContext, this.as);
      } // Note discussion at https://github.com/angular/angular.js/issues/7851


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
    var len;
    var i;
    var containerNode = this.element;

    if (nodeOrNodeArrayToInsert.length === 1) {
      ko.virtualElements.insertAfter(containerNode, nodeOrNodeArrayToInsert[0], insertAfterNode); // @HTMLUpdateOK
    } else if (supportsDocumentFragment) {
      var frag = document.createDocumentFragment();

      for (i = 0, len = nodeOrNodeArrayToInsert.length; i !== len; ++i) {
        frag.appendChild(nodeOrNodeArrayToInsert[i]);
      }

      ko.virtualElements.insertAfter(containerNode, frag, insertAfterNode); // @HTMLUpdateOK
    } else {
      // Nodes are inserted in reverse order - pushed down immediately after
      // the last node for the previous item or as the first node of element.
      for (i = nodeOrNodeArrayToInsert.length - 1; i >= 0; --i) {
        var child = nodeOrNodeArrayToInsert[i];

        if (!child) {
          break;
        }

        ko.virtualElements.insertAfter(containerNode, child, insertAfterNode); // @HTMLUpdateOK
      }
    }

    return nodeOrNodeArrayToInsert;
  }; // checks if the deleted data item should be handled with delay for a possible reuse at additions


  OjForEach.prototype.shouldDelayDeletion = function (data) {
    return data && (_typeof(data) === 'object' || typeof data === 'function');
  }; // gets the pending deletion info for this data item


  OjForEach.prototype.getPendingDeleteFor = function (data) {
    var index = data && data[PENDING_DELETE_INDEX_KEY];
    if (index === undefined) return null;
    return this.pendingDeletes[index];
  }; // tries to find the existing pending delete info for this data item, and if it can't, it registeres one


  OjForEach.prototype.getOrCreatePendingDeleteFor = function (data) {
    var pd = this.getPendingDeleteFor(data);

    if (pd) {
      return pd;
    }

    pd = {
      data: data,
      nodesets: []
    }; // eslint-disable-next-line no-param-reassign

    data[PENDING_DELETE_INDEX_KEY] = this.pendingDeletes.length;
    this.pendingDeletes.push(pd);
    return pd;
  }; // Process a changeItem with {status: 'deleted', ...}

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
  }; // removes a set of nodes from the DOM


  OjForEach.prototype.removeNodes = function (nodes) {
    if (!nodes.length) {
      return;
    }

    var removeFn = function removeFn() {
      var parent = nodes[0].parentNode;

      for (var i = nodes.length - 1; i >= 0; --i) {
        templateEngine.clean(nodes[i]);
        parent.removeChild(nodes[i]);
      }
    };

    removeFn();
  }; // flushes the pending delete info store
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
  }; // We batch our deletion of item indexes in our parallel array.
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
  }; // Updates observableIndex property for the data


  OjForEach.prototype.updateIndexes = function (fromIndex) {
    for (var i = fromIndex, len = this.firstLastNodesList.length; i < len; ++i) {
      var ctx = this.firstLastNodesList[i].currentChildContext;

      if (ctx && ctx.observableIndex) {
        ctx.observableIndex(i);
      }
    }
  }; // Getter used in ko.computed callback that monitors array replacements


  OjForEach.prototype.getData = function () {
    return this.data;
  }; // Setter used in ko.computed callback that monitors array replacements


  OjForEach.prototype.setData = function (data) {
    this.removeSubscriptions();
    this.data = data;
    this.addSubscriptions();
  };

  ko.bindingHandlers._ojBindForEach_ = {
    // Valid valueAccessors:
    //    {data: array, as: string}
    init: function init(element, valueAccessor, bindings, vm, context) {
      var ffe;
      var value;
      ko.computed(function () {
        // : watch for array modifications, that are not covered by addSubscriptions() call:
        // - non-observable array replacement triggered by CCA
        // - array data defined with expression
        value = valueAccessor();

        if (ffe) {
          var updatedValues = value.data;
          var currentValues = ffe.getData();
          var currentArray;
          var updatedArray; // retrive the array data that might be defined as an observable

          ko.ignoreDependencies(function () {
            currentArray = ko.unwrap(currentValues);
            updatedArray = ko.unwrap(updatedValues);
          }); // initialize options for ko.utils.compareArrays
          // 'dontLimitMoves':true recommended for newer code, 'sparse':true is used for trackArray changes

          var compareArrayOptions = {
            sparse: true,
            dontLimitMoves: true
          };
          var changeSet = ko.utils.compareArrays(currentArray, updatedArray, compareArrayOptions);
          ffe.setData(updatedValues);
          ffe.onArrayChange(changeSet);
        }
      }, null, {
        disposeWhenNodeIsRemoved: element
      });
      ffe = new OjForEach(element, value, context);
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        ffe.removeSubscriptions();
      });
      return {
        controlsDescendantBindings: true
      };
    }
  };
  ko.virtualElements.allowedBindings._ojBindForEach_ = true;
})();



/* global ko:false */
//
// Define a template source that allows the use of a knockout array (ko[])
// to provide storage for a template string.
//
// This simplifies template assignment and template usage for the user, as shown in the following example:
//
// Template Assignment:
//
//   ko.templates["myKey"] = templateText;
//
// Template Usage:
//
//   <div data-bind="template: {name: myKey}">
//

/* jslint browser: true*/

/**
 * @export
 */
oj.koStringTemplateEngine = {};
/**
 * @export
 */

oj.koStringTemplateEngine.install = function () {
  // define a template source that tries to key into an object first to find a template string
  if (ko.templates) {
    return;
  }

  var _templateText = {}; // Stores the text property for the template object.

  var _templateData = {}; // Stores the data property for the template object.
  // data = {},
  // eslint-disable-next-line new-cap

  var _engine = new ko.nativeTemplateEngine();
  /**
   *  @constructor
   *  @private
   */


  var StringTemplate = function StringTemplate(template) {
    this._templateName = template;

    this.text = function (value) {
      // When passed no parameters, return the template object.
      if (!value) {
        return _templateText[this._templateName];
      }

      _templateText[this._templateName] = value;
      return undefined;
    };

    this.data = function (key, value) {
      if (!_templateData[this._templateName]) {
        _templateData[this._templateName] = {};
      }

      if (arguments.length === 1) {
        return _templateData[this._templateName][key];
      }

      _templateData[this._templateName][key] = value;
      return undefined;
    };
  }; //
  // Override knockout's makeTemplateSource(), returning the new stringTemplate
  //


  _engine.makeTemplateSource = function (template, templateDocument) {
    if (typeof template === 'string') {
      // eslint-disable-next-line no-param-reassign
      templateDocument = templateDocument || document;
      var elem = templateDocument.getElementById(template);

      if (elem) {
        // eslint-disable-next-line new-cap
        return new ko.templateSources.domElement(elem);
      }

      return new StringTemplate(template);
    }

    if (template && template.nodeType === 1 || template.nodeType === 8) {
      // eslint-disable-next-line new-cap
      return new ko.templateSources.anonymousTemplate(template);
    }

    return undefined;
  }; // make the templates accessible
  // ko.templates = _templateText;


  ko.templates = _templateText; // make this new template engine our default engine

  ko.setTemplateEngine(_engine);
};



/* global ko:false */

/**
 * Returns a renderer function executes the template specified in the binding attribute.
 * (for example, a knockout template).
 * @param {Object} bindingContext the ko binding context
 * @param {string} template the name of the template
 * @return {Function} the renderer function
 * @private
 */
function _getListViewItemRenderer(bindingContext, template) {
  return function (context) {
    var parent = context.parentElement; // runs the template

    var childContext = bindingContext.createChildContext(context.data, null, function (binding) {
      // eslint-disable-next-line no-param-reassign
      binding.$itemContext = context;
    });
    ko.renderTemplate(template, childContext, {
      afterRender: function afterRender(renderedElement) {
        $(renderedElement)._ojDetectCleanData();
      }
    }, parent, 'replaceNode'); // tell the listview not to do anything

    return null;
  };
}
/**
 * Common method to handle managed attributes for both init and update
 * @param {string} name the name of the attribute
 * @param {Object} value the value of the attribute
 * @param {Object} bindingContext the ko binding context
 * @return {Object} the modified attribute
 * @private
 */


function _handleListViewManagedAttributes(name, value, bindingContext) {
  if (name === 'item') {
    // find the cell template and creates a renderer
    var template = value.template;

    if (template != null) {
      // eslint-disable-next-line no-param-reassign
      value.renderer = _getListViewItemRenderer(bindingContext, template);
    }

    return {
      item: value
    };
  }

  return null;
}

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  attributes: ['item'],
  init: function init(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    var result = _handleListViewManagedAttributes(name, value, bindingContext);

    if (result != null) {
      return result;
    }

    return undefined;
  },
  update: function update(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleListViewManagedAttributes(name, value, bindingContext);
  },
  for: 'ojListViewRenderer'
});
/**
 * Default declaration for ojListView
 */

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  for: 'ojListView',
  use: 'ojListViewRenderer'
});
/**
 * Default declaration for ojListView
 */

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  for: 'ojNavigationList',
  use: 'ojListViewRenderer'
});



/**
 *
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
 * <p>Also note that if the &lt;oj-bind-for-each&gt; element is being used to programmatically build an HTML table,
 * it must be placed in the view of an oj-module and loaded via ModuleElementUtils.</p>
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
 * The array or an oj.DataProvider that you wish to iterate over. Required property.
 * Note that the &lt;oj-bind-for-each&gt; will dynamically update the generated
 * DOM in response to changes if the value is an observableArray, or in response
 * to oj.DataProvider events.
 * @expose
 * @name data
 * @memberof oj.ojBindForEach
 * @ojshortdesc The array or oj.DataProvider that you wish to iterate over. See  the Help documentation for more information.
 * @instance
 * @type {array|Object}
 * @ojsignature {target: "Type", value:"Array<D>|oj.DataProvider<K, D>", jsdocOverride:true}
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
 * @ojslotitemprops oj.ojBindForEach.DefaultItemContext
 * @instance
 * @expose
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
 *
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
 * @classdesc
 * <h3 id="overview-section">
 *   If Binding
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview-section"></a>
 * </h3>
 * <p>Use &lt;oj-bind-if&gt; to conditionally render its contents only if a provided test
 * returns true. Note that the &lt;oj-bind-if&gt; element will be removed from the DOM
 * after binding is applied. For slotting, applications need to wrap the oj-bind-if element
 * inside another HTML element (e.g. &lt;span&gt;) with the slot attribute. The oj-bind-if element does not support
 * the slot attribute.</p>
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
 *
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



/* global _getDvtRenderer:false */

/**
 * Common method to handle managed attributes for both init and update
 * @param {string} name the name of the attribute
 * @param {Object} value the value of the attribute
 * @param {Object} bindingContext the ko binding context
 * @return {Object} the modified attribute
 * @private
 */
function _handleManagedGaugeAttributes(name, value, bindingContext) {
  if (name === 'center' && value.template) {
    // eslint-disable-next-line no-param-reassign
    value._renderer = _getDvtRenderer(bindingContext, value.template);
  }

  return {
    center: value
  };
}

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  attributes: ['center'],
  init: function init(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleManagedGaugeAttributes(name, value, bindingContext);
  },
  update: function update(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleManagedGaugeAttributes(name, value, bindingContext);
  },
  for: 'ojStatusMeterGauge'
});



/* global _getDvtRenderer:false */

/**
 * Common method to handle managed attributes for both init and update
 * @param {string} name the name of the attribute
 * @param {Object} value the value of the attribute
 * @param {Object} bindingContext the ko binding context
 * @return {Object} the modified attribute
 * @private
 */
function _handleManagedSunburstAttributes(name, value, bindingContext) {
  if (name === 'rootNodeContent' && value.template) {
    // eslint-disable-next-line no-param-reassign
    value._renderer = _getDvtRenderer(bindingContext, value.template);
  }

  return {
    rootNodeContent: value
  };
}

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  attributes: ['rootNodeContent'],
  init: function init(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleManagedSunburstAttributes(name, value, bindingContext);
  },
  update: function update(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleManagedSunburstAttributes(name, value, bindingContext);
  },
  for: 'ojSunburst'
});



/* global ko:false */

/* jslint browser: true, devel: true*/

/**
 * @private
 * @const
 */
var _COLUMNS_ATTR = 'columns';
/**
 * @private
 * @const
 */

var _COLUMNS_DEFAULT_ATTR = 'columnsDefault';
/**
 * The row template will be used to render the row elements.
 * The row, status, and component objects will be available
 * in the template context.
 * @private
 * @const
 */

var _ROW_TEMPLATE_ATTR = 'rowTemplate';
/**
 * Create and return a renderer which the component will call. That renderer
 * will render the template.
 * @param {Object} bindingContext  Binding Context
 * @param {string} type  'cell' or 'header' or 'row'
 * @param {string} template  template name
 * @return {Object} Renderer
 * @private
 */

function _getTableColumnTemplateRenderer(bindingContext, type, template) {
  var rendererOption = {};

  (function (_template, _type) {
    rendererOption = function rendererOption(params) {
      var childContext = null;
      var parentElement = null;

      if (_type === 'header') {
        childContext = bindingContext.createChildContext(null, null, function (binding) {
          // eslint-disable-next-line no-param-reassign
          binding.$columnIndex = params.columnIndex; // eslint-disable-next-line no-param-reassign

          binding.$headerContext = params.headerContext; // eslint-disable-next-line no-param-reassign

          binding.$data = params.data;
        });
        parentElement = params.headerContext.parentElement;
      } else if (_type === 'cell') {
        var childData = params.row;
        childContext = bindingContext.createChildContext(childData, null, function (binding) {
          // eslint-disable-next-line no-param-reassign
          binding.$columnIndex = params.columnIndex; // eslint-disable-next-line no-param-reassign

          binding.$cellContext = params.cellContext;
        });
        parentElement = params.cellContext.parentElement;
      }

      if (_type === 'footer') {
        childContext = bindingContext.createChildContext(null, null, function (binding) {
          // eslint-disable-next-line no-param-reassign
          binding.$columnIndex = params.columnIndex; // eslint-disable-next-line no-param-reassign

          binding.$footerContext = params.footerContext;
        });
        parentElement = params.footerContext.parentElement;
      }

      ko.renderTemplate(_template, childContext, {
        afterRender: function afterRender(renderedElement) {
          $(renderedElement)._ojDetectCleanData();
        }
      }, parentElement, 'replaceNode');
    };
  })(template, type);

  return rendererOption;
}
/**
 * Create and return a renderer which the component will call. That renderer
 * will render the template.
 * @param {string} template  template name
 * @return {Object} Renderer
 * @private
 */


function _getTableRowTemplateRenderer(bindingContext, template) {
  return function (params) {
    var childData = params.row;
    var childContext = bindingContext.createChildContext(childData, null, function (binding) {
      // eslint-disable-next-line no-param-reassign
      binding.$rowContext = params.rowContext;
    });
    ko.renderTemplate(template, childContext, {
      afterRender: function afterRender(renderedElement) {
        $(renderedElement)._ojDetectCleanData();
      }
    }, params.rowContext.parentElement, 'replaceNode');
  };
}

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  attributes: [_COLUMNS_ATTR, _COLUMNS_DEFAULT_ATTR, _ROW_TEMPLATE_ATTR],
  init: function init(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    if (name === _COLUMNS_ATTR || name === _COLUMNS_DEFAULT_ATTR) {
      for (var i = 0; i < value.length; i++) {
        var column = value[i];
        var template = column.template;
        var footerTemplate = column.footerTemplate;
        var headerTemplate = column.headerTemplate;

        if (template != null) {
          column.renderer = _getTableColumnTemplateRenderer(bindingContext, 'cell', template);
        }

        if (footerTemplate != null) {
          column.footerRenderer = _getTableColumnTemplateRenderer(bindingContext, 'footer', footerTemplate);
        }

        if (headerTemplate != null) {
          column.headerRenderer = _getTableColumnTemplateRenderer(bindingContext, 'header', headerTemplate);
        }
      }

      if (name === _COLUMNS_ATTR) {
        return {
          columns: value
        };
      }

      return {
        columnsDefault: value
      };
    } else if (name === _ROW_TEMPLATE_ATTR) {
      return {
        rowRenderer: _getTableRowTemplateRenderer(bindingContext, value)
      };
    }

    return undefined;
  },
  update: function update(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    if (name === _COLUMNS_ATTR || name === _COLUMNS_DEFAULT_ATTR) {
      for (var i = 0; i < value.length; i++) {
        var column = value[i];
        var template = column.template;
        var footerTemplate = column.footerTemplate;
        var headerTemplate = column.headerTemplate;

        if (template != null) {
          column.renderer = _getTableColumnTemplateRenderer(bindingContext, 'cell', template);
        }

        if (footerTemplate != null) {
          column.footerRenderer = _getTableColumnTemplateRenderer(bindingContext, 'footer', footerTemplate);
        }

        if (headerTemplate != null) {
          column.headerRenderer = _getTableColumnTemplateRenderer(bindingContext, 'header', headerTemplate);
        }
      }

      if (name === _COLUMNS_ATTR) {
        widgetConstructor({
          columns: value
        });
      } else {
        widgetConstructor({
          columnsDefault: value
        });
      }
    } else if (name === _ROW_TEMPLATE_ATTR) {
      return {
        rowRenderer: _getTableRowTemplateRenderer(bindingContext, value)
      };
    }

    return null;
  },
  for: 'ojTable'
});



/* global _getDvtDataRenderer:false */

/**
 * Common method to handle managed attributes for both init and update
 * @param {string} name the name of the attribute
 * @param {Object} value the value of the attribute
 * @param {Object} bindingContext the ko binding context
 * @return {Object} the modified attribute
 * @private
 */
function _handleManagedMapAttributes(name, value, bindingContext) {
  var i;
  var template;

  if (name === 'areaLayers') {
    for (i = 0; i < value.length; i++) {
      var areaDataLayer = value[i].areaDataLayer;

      if (areaDataLayer) {
        template = areaDataLayer.template;

        if (template != null) {
          areaDataLayer._templateRenderer = _getDvtDataRenderer(bindingContext, template);
        }
      }
    }

    return {
      areaLayers: value
    };
  } else if (name === 'pointDataLayers') {
    for (i = 0; i < value.length; i++) {
      template = value[i].template;

      if (template != null) {
        // eslint-disable-next-line no-param-reassign
        value[i]._templateRenderer = _getDvtDataRenderer(bindingContext, template);
      }
    }

    return {
      pointDataLayers: value
    };
  }

  return null;
}

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  attributes: ['areaLayers', 'pointDataLayers'],
  init: function init(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleManagedMapAttributes(name, value, bindingContext);
  },
  update: function update(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleManagedMapAttributes(name, value, bindingContext);
  },
  for: 'ojThematicMap'
});



/* global _getDvtRenderer:false */

/**
 * Common method to handle managed attributes for both init and update
 * @param {string} name the name of the attribute
 * @param {Object} value the value of the attribute
 * @param {Object} bindingContext the ko binding context
 * @return {Object} the modified attribute
 * @private
 */
function _handleManagedTreemapAttributes(name, value, bindingContext) {
  if (name === 'nodeContent' && value.template) {
    // eslint-disable-next-line no-param-reassign
    value._renderer = _getDvtRenderer(bindingContext, value.template);
  }

  return {
    nodeContent: value
  };
}

oj.ComponentBinding.getDefaultInstance().setupManagedAttributes({
  attributes: ['nodeContent'],
  init: function init(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleManagedTreemapAttributes(name, value, bindingContext);
  },
  update: function update(name, value, element, widgetConstructor, valueAccessor, allBindingsAccessor, bindingContext) {
    return _handleManagedTreemapAttributes(name, value, bindingContext);
  },
  for: 'ojTreemap'
});

});