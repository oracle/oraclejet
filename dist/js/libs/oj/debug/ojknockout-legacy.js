/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['jqueryui-amd/widget', 'ojs/ojkoshared', 'knockout', 'ojs/ojlogger', 'ojs/ojcore', 'jquery', 'ojs/ojknockout-base', 'ojs/ojdomutils'], function (widget, BindingProviderImpl, ko, Logger, oj, $, ojknockoutBase, DomUtils) { 'use strict';

  BindingProviderImpl = BindingProviderImpl && Object.prototype.hasOwnProperty.call(BindingProviderImpl, 'default') ? BindingProviderImpl['default'] : BindingProviderImpl;
  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

  /**
   * This is extension of the ComponentBinding class defined in ojknockout-base.
   * The class is extended with functionality needed by old data-bind knockout components - __ojComponentPrivate.
   * @ignore
   */
  const ComponentBinding = ojknockoutBase.ComponentBinding;

  /**
   * Creates a binding instance and registers it with Knockout.js.
   * Note that in order to use this method you have to map ojknockout to ojknockout-legacy in your require.config object.
   * @ojdeprecated {since: '16.0.0', description: 'Any code relying on this functionality should be migrated to using the custom element equivalents.'}
   *
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
   * @return {ComponentBinding} binding instance
   */
  ComponentBinding.create = function (name, options) {
    if (name == null) {
      throw new Error('Binding name is required!');
    }

    var instance = new ComponentBinding(name, options);

    var handlers = ko.bindingHandlers;

    var names = Array.isArray(name) ? name : [name];

    for (var i = 0; i < names.length; i++) {
      var nm = names[i];
      ComponentBinding._REGISTERED_NAMES.push(nm);

      handlers[nm] = instance;
    }

    return instance;
  };

  /**
   * Retrieves the default component binding instance registered with Knockout.js.
   * Note that in order to use this method you have to map ojknockout to ojknockout-legacy in your require.config object.
   * @ojdeprecated {since: '16.0.0', description: 'Any code relying on this functionality should be migrated to using the custom element equivalents.'}
   *
   * @return {ComponentBinding} default binding instance
   * @export
   */
  ComponentBinding.getDefaultInstance = function () {
    return ComponentBinding._INSTANCE;
  };

  /**
   * Sets up custom handling for attributes that will be managed by this binding
   * instance.
   * Note that in order to use this method you have to map ojknockout to ojknockout-legacy in your require.config object.
   * @ojdeprecated {since: '16.0.0', description: 'Any code relying on this functionality should be migrated to using the custom element equivalents.'}
   *
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
  ComponentBinding.prototype.setupManagedAttributes = function (opts) {
    var forName = opts.for;
    forName = forName == null ? '@global' : forName;

    var managers = this._managedAttrOptions[forName] || [];

    managers.push(opts);

    this._managedAttrOptions[forName] = managers;
  };

  /**
   * @private
   */
  ComponentBinding.prototype.Init = function (names, options) {
    ComponentBinding.superclass.Init.call(this);

    if (typeof options === 'string') {
      // eslint-disable-next-line no-param-reassign
      options = { componentName: options };
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
  ComponentBinding.prototype._getBindingOptions = function () {
    return this._bindingOptions;
  };

  /**
   * @private
   */
  ComponentBinding.prototype._init = function (
    element,
    valueAccessor,
    allBindingsAccessor,
    viewModel,
    bindingContext
  ) {
    // Invoke child bindings first to allow on-the-fly generation of child content
    ko.applyBindingsToDescendants(bindingContext, element);

    return { controlsDescendantBindings: true };
  };

  /**
   * @private
   */
  ComponentBinding.prototype._update = function (
    element,
    valueAccessor,
    allBindingsAccessor,
    viewModel,
    bindingContext
  ) {
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
      componentComputeds = [];

      // when cleanup() is called by the node disposal, there is no need to destroy the component because cleanNode() will
      // do it for us
      if (destroyComponent && component) {
        component('destroy');
        component = null;
      }
      if (changeTracker) {
        changeTracker.dispose();
        changeTracker = null;
      }

      jelem.off(ComponentBinding._HANDLER_NAMESPACE);
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

      var updaterCallback = function (changes) {
        var mutationOptions = ComponentBinding.__removeDotNotationOptions(changes);

        comp('option', changes);
        var keys = Object.keys(mutationOptions);

        for (var k = 0; k < keys.length; k++) {
          var key = keys[k];
          comp('option', key, mutationOptions[key]);
        }
      };

      changeTracker = new ojknockoutBase.ComponentChangeTracker(
        updaterCallback,
        BindingProviderImpl.getGlobalChangeQueue()
      );

      // Create a compatible valueAccessor for backward compatibility with the managed attributes and custom bindings that
      // expect the ojComponent value to be defined inline. We can use already-resolved binding value here because the component
      // will be recreated whenever the binding value changes, and this method will be called with the new binding value

      var compatibleValueAccessor = function () {
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
        destroyCallback: function () {
          component = null;
        },
        readOnlyProperties: {}
      };

      component = this._initComponent(element, componentContext);
    }

    // Since we want the update() method to be invoked by Knockout only once, we are suspending dependency detection
    ko.ignoreDependencies(function () {
      ko.computed(
        function () {
          // invoking valueAccessor() adds a dependency on the bidning value and the possible observable ViewModel
          // to this computed, and unwrapping the observable adds a dependency on the observable binding value
          var bindingValue = ko.utils.unwrapObservable(valueAccessor());

          if (typeof bindingValue !== 'object') {
            Logger.error('ojComponent binding should evaluate to an object');
          }

          var componentName = this._bindingOptions.componentName;

          var nameOpt;
          var nameOptionFound = false;

          if (componentName == null && bindingValue != null) {
            var nameAttrs = [ComponentBinding._COMPONENT_OPTION, 'role'];

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
          }

          // Suspend dependency detection for this computed during createComponent(). Changes to the component options
          // will be tracked separately
          ko.ignoreDependencies(createComponent, this, [componentName, nameOpt, bindingValue]);
        },
        this,
        { disposeWhenNodeIsRemoved: element }
      );
    }, this);

    // cleanup() called by the node disposal should not be destroying components, as they will be destroyed by .cleanNode()
    ko.utils.domNodeDisposal.addDisposeCallback(
      element,
      cleanup.bind(this, false /* destroyComponent flag*/)
    );
  };

  /**
   * @private
   */
  ComponentBinding.prototype._initComponent = function (element, ctx) {
    var disposed = false;
    var stage = 0; // init

    var specifiedManagedAttrs = {};

    var jelem = $(element);

    var comp = ctx.component;
    var componentName = ctx.componentName;

    var self = this;

    var destroyEventType = '_ojDestroy';

    var destroyListener = function (evt) {
      if (evt.target && evt.target === element) {
        // ensure that we do not try to destroy the component again during node cleanup
        ctx.destroyCallback();

        var destroyCallback = self._bindingOptions.beforeDestroy;
        if (destroyCallback) {
          destroyCallback(
            element,
            comp,
            ctx.valueAccessor,
            ctx.allBindingsAccessor,
            ctx.bindingContext
          );
        }

        ComponentBinding._deliverCreateDestroyEventToManagedProps(
          false,
          specifiedManagedAttrs,
          element,
          comp,
          ctx.valueAccessor,
          ctx.allBindingsAccessor,
          ctx.bindingContext
        );

        disposed = true;
        ctx.changeTracker.dispose();
        element.removeEventListener(destroyEventType, destroyListener);
      }
    };

    element.addEventListener(destroyEventType, destroyListener);

    var managedAttrMap = ComponentBinding._resolveManagedAttributes(
      this._managedAttrOptions,
      ctx.specifiedOptions,
      componentName
    );

    // Always use managed attribute behavior from the default instance
    var defaultInstance = ComponentBinding.getDefaultInstance();
    if (this !== defaultInstance) {
      var defaultManagedMap = defaultInstance._getManagedAttributes(
        ctx.specifiedOptions,
        componentName
      );
      // Override default managed attribute map with values from this binding's map.
      // Note that there is no need to clone defaultManagedMap because a new instance gets created
      // every time _getManagedAttributes() is called
      oj.CollectionUtils.copyInto(defaultManagedMap, managedAttrMap);
      managedAttrMap = defaultManagedMap;
    }

    var resolvedInitialOptions = {};

    var propertyReadFunc = function () {
      var prop = this._property;

      var value = ComponentBinding._toJS(ctx.valueAccessor()[prop]);

      if (stage === 0) {
        // init, no change
        var managedPropEntry = managedAttrMap[prop];
        if (managedPropEntry != null) {
          specifiedManagedAttrs[prop] = managedPropEntry;
          var initFunc = managedPropEntry.init;
          if (initFunc != null) {
            var initProps =
              initFunc(
                prop,
                value,
                element,
                comp,
                ctx.valueAccessor,
                ctx.allBindingsAccessor,
                ctx.bindingContext
              ) || {};

            var initKeys = Object.keys(initProps);

            // ensure that the array properties returned by the init function are cloned
            for (var ip = 0; ip < initKeys.length; ip++) {
              var ikey = initKeys[ip];
              resolvedInitialOptions[ikey] = ComponentBinding.__cloneIfArray(initProps[ikey]);
            }
          }
        } else {
          resolvedInitialOptions[prop] = ComponentBinding.__cloneIfArray(value);
        }
      } else if (!disposed) {
        // this is a post-init change
        if (managedAttrMap[prop] != null) {
          var updateFunc = managedAttrMap[prop].update;
          if (updateFunc != null) {
            var updateProps =
              updateFunc(
                prop,
                value,
                element,
                comp,
                ctx.valueAccessor,
                ctx.allBindingsAccessor,
                ctx.bindingContext
              ) || {};

            var updateKeys = Object.keys(updateProps);

            for (var k = 0; k < updateKeys.length; k++) {
              var p = updateKeys[k];
              ctx.changeTracker.addChange(p, ComponentBinding.__cloneIfArray(updateProps[p]));
            }
          }
        } else if (!ctx.readOnlyProperties[prop]) {
          // ignore chnages to read-only properties
          ctx.changeTracker.addChange(prop, ComponentBinding.__cloneIfArray(value));
        }
      }
    };

    for (var k = 0; k < ctx.specifiedOptions.length; k++) {
      // ko.computed is used to set up dependency tracking for the bindings's attribute
      // Any observable evaulated during the initial invocation of the function is going to be treated as a dependency
      // by Knockout. Once that dependency changes, the fuction below will be called again, in which case we will know
      // to deliver the change
      ctx.computeds.push(
        ko.computed(propertyReadFunc, {
          _property: ctx.specifiedOptions[k] /* 'this' object for the 'read' function*/
        })
      );
    }

    stage = 1; // post-init

    ComponentBinding._registerWritebacks(jelem, ctx);

    var mutationOptions = ComponentBinding.__removeDotNotationOptions(resolvedInitialOptions);

    // Initialization of the component happens here
    comp(resolvedInitialOptions);

    Object.keys(mutationOptions).forEach(function (mo) {
      comp('option', mo, mutationOptions[mo]);
    });

    var createCallback = this._bindingOptions.afterCreate;
    if (createCallback) {
      createCallback(element, comp, ctx.valueAccessor, ctx.allBindingsAccessor, ctx.bindingContext);
    }

    ComponentBinding._deliverCreateDestroyEventToManagedProps(
      true,
      specifiedManagedAttrs,
      element,
      comp,
      ctx.valueAccessor,
      ctx.allBindingsAccessor,
      ctx.bindingContext
    );

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
  ComponentBinding.prototype._getManagedAttributes = function (specifiedOptions, componentName) {
    return ComponentBinding._resolveManagedAttributes(
      this._managedAttrOptions,
      specifiedOptions,
      componentName
    );
  };

  /**
   * @private
   */
  ComponentBinding._resolveManagedAttributes = function (optionMap, specifiedOptions, componentName) {
    var managedAttrMap = {};

    var applicableOptions = [];

    var attrsField = 'attributes';

    var traverseOptions = function (name, followLinks) {
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

    traverseOptions(componentName, true);

    // If this is a JET component, check managed options registered for the ancestors
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
  ComponentBinding._HANDLER_NAMESPACE = '.oj_ko';

  /**
   * @private
   */
  ComponentBinding._registerWritebacks = function (jelem, ctx) {
    var writablePropMap = {
      '^slider$': [{ event: 'slidechange', getter: _extractValueFromChangeEvent }],
      '^oj*': [{ event: 'ojoptionchange', getter: _extractOptionChange.bind(undefined, ctx) }]
    };

    var cachedWriterFunctionEvaluators = {};

    var keys = Object.keys(writablePropMap);

    for (var k = 0; k < keys.length; k++) {
      var pattern = keys[k];
      if (ctx.componentName.match(pattern)) {
        var eventInfos = writablePropMap[pattern];
        for (var i = 0; i < eventInfos.length; i++) {
          var info = eventInfos[i];

          jelem.on(
            info.event + ComponentBinding._HANDLER_NAMESPACE,
            {
              // JQuery will pass this object as event.data
              getter: info.getter
            },
            function (evt, data) {
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
                    var optionMap = accessor[ComponentBinding._OPTION_MAP];
                    var expr = optionMap == null ? null : optionMap[name];

                    var target = accessor[name];

                    ComponentBinding._writeValueToProperty(
                      name,
                      target,
                      nameValues[name],
                      expr,
                      ctx.bindingContext,
                      cachedWriterFunctionEvaluators
                    );
                  }
                } finally {
                  ctx.changeTracker.resume(name);
                }
              }
            }
          );
        }
        break;
      }
    }
  };

  /**
   * @private
   */
  ComponentBinding._writeValueToProperty = function (
    name,
    target,
    value,
    propertyExpression,
    bindingContext,
    cachedWriterFunctionEvaluators
  ) {
    if (target == null || !ko.isObservable(target)) {
      if (!(name in cachedWriterFunctionEvaluators)) {
        var inContextWriter = null;
        var writerExpr = ojknockoutBase.__ExpressionUtils.getPropertyWriterExpression(propertyExpression);
        if (writerExpr != null) {
          // These writer expressions are already being cached, so we are not passing a second
          // to the function below and are not asking for the returned eveluator to be cached
          inContextWriter = BindingProviderImpl.createEvaluator(writerExpr, bindingContext);
        }
        // eslint-disable-next-line no-param-reassign
        cachedWriterFunctionEvaluators[name] = inContextWriter;
      }

      var func = cachedWriterFunctionEvaluators[name];

      if (func) {
        var writer = ojknockoutBase.__ExpressionUtils.getWriter(func(bindingContext));
        writer(ComponentBinding.__cloneIfArray(value));
      }
    } else if (ko.isWriteableObservable(target)) {
      target(ComponentBinding.__cloneIfArray(value));
    }
  };

  /**
   * @private
   */
  ComponentBinding._toJS = function (_prop) {
    // ko.toJS creates a cloned object for both plain javascript objects and Object subclasses. We need to avoid it
    // for the latter case to ensure that complex Model objects can be used as binding properties without being cloned

    var prop = ko.utils.unwrapObservable(_prop);

    if ((Array.isArray(prop) || oj.CollectionUtils.isPlainObject(prop)) && prop.ojConvertToJS) {
      prop = ko.toJS(prop);
    }

    return prop;
  };

  /**
   * @private
   */
  ComponentBinding.__removeDotNotationOptions = function (options) {
    var mutationOptions = {};

    var keys = Object.keys(options);

    for (var k = 0; k < keys.length; k++) {
      var opt = keys[k];
      if (opt.indexOf('.') >= 0) {
        mutationOptions[opt] = options[opt];
        // eslint-disable-next-line no-param-reassign
        delete options[opt];
      }
    }

    return mutationOptions;
  };

  /**
   * @private
   */
  ComponentBinding._deliverCreateDestroyEventToManagedProps = function (
    isCreate,
    managedAttrMap,
    element,
    comp,
    valueAccessor,
    allBindingsAccessor,
    bindingContext
  ) {
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
  ComponentBinding._isNameRegistered = function (bindingName) {
    return ComponentBinding._REGISTERED_NAMES.indexOf(bindingName) >= 0;
  };

  /**
   * @ignore
   */
  ComponentBinding._REGISTERED_NAMES = [];

  /**
   * @ignore
   */
  ComponentBinding._COMPONENT_OPTION = 'component';

  /**
   * @ignore
   */
  ComponentBinding._OPTION_MAP = '_ojOptions';

  /**
   * @private
   */
  ComponentBinding._INSTANCE = ComponentBinding.create(['__ojComponentPrivate', 'jqueryUI']);

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
    }

    // Remove the old (pre-V2) binding from the accessor map
    var bindingName = _findOwnBinding(accessorMap);
    if (bindingName != null) {
      // eslint-disable-next-line no-param-reassign
      accessorMap = _modifyOjComponentBinding(
        node,
        bindingName,
        wrapped,
        bindingContext,
        accessorMap
      );
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
      if (ComponentBinding._isNameRegistered(key)) {
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
    });

    // clone the original accessor map
    // eslint-disable-next-line no-param-reassign
    accessorMap = oj.CollectionUtils.copyInto({}, accessorMap);

    // Add accessor for the V2 version of the Component binding
    // eslint-disable-next-line no-param-reassign
    accessorMap[bindingName] = _getOjComponent2BindingAccessor(
      bindingContext,
      bindingMap,
      info.bindingExpr
    );

    return accessorMap;
  }

  /**
   * @ignore
   */
  function _getOjComponent2BindingAccessor(bindingContext, attributeMap, bindingExpr) {
    var accessorFunc = function () {
      var accessor = {};
      Object.keys(attributeMap).forEach(function (option) {
        var expression = attributeMap[option];

        // bindingContext will be passed as as the first parameter to the evaluator
        var getter = BindingProviderImpl.createEvaluator(expression, bindingContext).bind(
          null,
          bindingContext
        );

        Object.defineProperty(accessor, option, {
          get: getter,
          enumerable: true
        });
      });

      Object.defineProperty(accessor, ComponentBinding._OPTION_MAP, {
        value: attributeMap
        /* not enumerable */
      });

      return accessor;
    };

    // Define toString() for the custom accessor function since we do not want the entire function body to show up in
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

    return { attrList: list, bindingExpr: selfVal };
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
      ko.renderTemplate(
        template,
        model,
        {
          afterRender: function (renderedElement) {
            $(renderedElement)._ojDetectCleanData();
          }
        },
        context.parentElement
      );
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
      ko.renderTemplate(
        template,
        model,
        {
          afterRender: function (renderedElement) {
            $(renderedElement)._ojDetectCleanData();
          }
        },
        context.parentElement
      );
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
    return { tooltip: value };
  }

  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    attributes: ['tooltip'],
    init: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleManagedTooltipAttributes(name, value, bindingContext);
    },
    update: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleManagedTooltipAttributes(name, value, bindingContext);
    },
    for: 'tooltipOptionRenderer'
  });

  // Default declarations for all components supporting tooltips
  (function () {
    var componentsArray = [
      'ojChart',
      'ojDiagram',
      'ojNBox',
      'ojPictoChart',
      'ojSunburst',
      'ojTagCloud',
      'ojThematicMap',
      'ojTreemap',
      'ojDialGauge',
      'ojLedGauge',
      'ojRatingGauge',
      'ojSparkChart',
      'ojStatusMeterGauge',
      'ojGantt'
    ];
    for (var i = 0; i < componentsArray.length; i++) {
      ComponentBinding.getDefaultInstance().setupManagedAttributes({
        for: componentsArray[i],
        use: 'tooltipOptionRenderer'
      });
    }
  })();

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
    return { pieCenter: value };
  }

  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    attributes: ['pieCenter'],
    init: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleManagedChartAttributes(name, value, bindingContext);
    },
    update: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleManagedChartAttributes(name, value, bindingContext);
    },
    for: 'ojChart'
  });

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
      var parent = context.parentElement;

      // runs the template
      var childContext = bindingContext.createChildContext(context.data, null, function (binding) {
        // eslint-disable-next-line no-param-reassign
        binding.$optionContext = context;
      });
      ko.renderTemplate(template, childContext, null, parent);

      // tell the combobox not to do anything
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

      return { optionRenderer: optionRenderer };
    }

    return null;
  }

  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    attributes: ['optionTemplate'],
    init: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      var result = _handleComboboxManagedAttributes(name, value, bindingContext);
      if (result !== null) {
        return result;
      }
      return undefined;
    },
    update: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleComboboxManagedAttributes(name, value, bindingContext);
    },
    for: 'ComboboxOptionRenderer'
  });

  /**
   * Default declaration for ojCombobox
   */
  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    for: 'ojCombobox',
    use: 'ComboboxOptionRenderer'
  });

  /**
   * Default declaration for ojSelect
   */
  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    for: 'ojSelect',
    use: 'ComboboxOptionRenderer'
  });

  /**
   * Default declaration for ojInputSearch
   */
  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    for: 'ojInputSearch',
    use: 'ComboboxOptionRenderer'
  });

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
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
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

      $element
        .off(eventNamespace)
        .removeClass('oj-menu-context-menu-launcher')[0]
        .removeEventListener('click', clickListener, true);

      // remove touchstart listener registered with passive option
      $element[0].removeEventListener('touchstart', touchstartMousedownKeydownListener, {
        passive: false
      });

      clearTimeout(pressHoldTimer);

      var oldMenuData = $element.data('_ojLastContextMenu');

      // If binding's bound value is changing at RT, remove listener from old menu.
      // To avoid memory leak (capture of old menu node), don't assign the node to a var.
      if (oldMenuData) {
        _getContextMenuNode(oldMenuData.selector, oldMenuData.id).off(eventNamespace);
      }

      var contextMenuListenerSet = false;

      // 3) Get menu selector/id: ---

      // Accepts anything $() accepts, i.e. same things component CM option accepts,
      // including selector like "#myMenuId", element, JQ object, etc. Also accepts
      // {}, meaning "use the HTML contextmenu attribute.  Else malformed.
      var menuSelector = ko.utils.unwrapObservable(valueAccessor());

      // if menuSelector is {}, use the id from the contextmenu attr instead. See getContextMenuNode comments.
      var menuId = $.isPlainObject(menuSelector) ? element.getAttribute('contextmenu') : null;

      // Remember how to find menu, without caching menu itself, so that if binding's bound observable is later
      // changed to point to some other menu, we can clean up the old menu.
      // If/when KO binding is disposed, .data data is discarded, so no leak.
      $element.data('_ojLastContextMenu', { selector: menuSelector, id: menuId });

      // 4) Add listeners to element having context menu (not menu element) : ---

      // Use capture phase to make sure we cancel it before any regular bubble listeners hear it.
      element.addEventListener('click', clickListener, true);

      // register touchstart with passive option
      $element[0].addEventListener('touchstart', touchstartMousedownKeydownListener, {
        passive: false
      });

      $element
        .on(
          'mousedown' + eventNamespace + ' keydown' + eventNamespace + ' ',
          touchstartMousedownKeydownListener
        )
        // if the touch ends before the 750ms is up, it's not a long enough tap-and-hold to show the CM
        .on('touchend' + eventNamespace + ' touchcancel' + eventNamespace, function () {
          touchInProgress = false;
          clearTimeout(pressHoldTimer);
          return true;
        })
        .on('keydown' + eventNamespace + ' contextmenu' + eventNamespace, function (event) {
          if (
            event.type === 'contextmenu' || // right-click.  pressHold for Android but not iOS
            (event.keyCode === 121 && event.shiftKey)
          ) {
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
        })

        // Does 2 things:
        // 1) Prevents native context menu / callout from appearing in Mobile Safari.  E.g. for links, native CM has "Open in New Tab".
        // 2) In Mobile Safari and Android Chrome, prevents pressHold from selecting the text and showing the selection handles and (in Safari) the Copy/Define callout.
        // In UX discussion, we decided to prevent both of these things for now.  App can theme directly if they have specific needs.
        // Per discussion with architects, do #2 only for touch devices, so that text selection isn't prevented on desktop.  Since #1
        // is a no-op for non-touch, we can accomplish this by omitting the entire style class, which does 1 and 2, for non-touch.
        // Per comments in scss file, the suppression of 1 and 2 has issues in old versions of Mobile Safari.
        .addClass(DomUtils.isTouchSupported() ? 'oj-menu-context-menu-launcher' : '');

      // At least some of the time, the pressHold gesture also fires a click event same as a short tap.  Prevent that here.
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
      }

      // , on Chrome preventDefault on "keyup" will avoid triggering contextmenu event
      // which will display native contextmenu.This also need to be added on document as event target is not menu launcher.
      function preventKeyUpEventIfMenuOpen(event) {
        if (event.keyCode === 121 && event.shiftKey) {
          // Shift-F10
          if (getContextMenuNode().is(':visible')) {
            event.preventDefault();
          }
        }
      }

      // lazily get the Menu component in case it is inited after the ojContextMenu binding is applied to launcher.
      function getContextMenu() {
        // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
        var constructor = oj.Components.__GetWidgetConstructor(getContextMenuNode()[0], 'ojMenu');

        // The JET Menu of the first element found.
        // Per architect discussion, get it every time rather than caching the menu.
        var contextMenu = constructor && constructor('instance');

        // if no element found, or if element has no JET Menu
        if (!contextMenu) {
          throw new Error(
            'ojContextMenu binding bound to "' +
              (menuId || menuSelector) +
              '", which does not reference a valid JET Menu.'
          );
        }

        if (!contextMenuListenerSet) {
          // must use "on" syntax rather than clobbering whatever "close" handler the app may have set via the menu's "option" syntax
          contextMenu.widget().on('ojclose' + eventNamespace, function () {
            document.removeEventListener('keyup', preventKeyUpEventIfMenuOpen);
          });

          contextMenuListenerSet = true;
        }

        return contextMenu;
      }

      // All gets of the menu element must use this function, rather than calling $(menuSelector) directly,
      // in case menuId was provided instead.
      function getContextMenuNode() {
        return _getContextMenuNode(menuSelector, menuId);
      }

      function _getContextMenuNode(selector, id) {
        return id
          ? $(document.getElementById(id)) // Do NOT use $('#' + id), due to escaping issues
          : $(selector).first();
      }

      function launch(event, eventType, pressHold) {
        // ensure that pressHold doesn't result in a click.  Set this before the bailouts below.
        isPressHold = pressHold;

        var menu = getContextMenu();

        // In Mobile Safari only, mousedown fires *after* the touchend, which causes at least 2 problems:
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
            // prettier-ignore
            setTimeout(function () { // @HTMLUpdateOK delaying our own callback
              menu.__contextMenuPressHoldJustEnded(false);
            }, touchendMousedownThreshold);
          });
        }

        // On platforms like Android Chrome where long presses already fire the contextmenu event, the pressHold
        // logic causes the menu to open twice, once for the pressHold, once for the contextmenu.  There's no
        // guarantee which will happen first, but as long as they happen within doubleOpenThreshold ms
        // of each other, this logic should prevent the double open.
        // Note: Another option is a platform-specific solution where we only use pressHold for platforms that need
        // it (that don't already fire a contextmenu event for pressHold), but architectural preference is to avoid
        // platform-specific solutions if possible.
        if (
          (doubleOpenType === 'touchstart' && event.type === 'contextmenu') ||
          (doubleOpenType === 'contextmenu' && event.type === 'touchstart')
        ) {
          doubleOpenType = null;
          clearTimeout(doubleOpenTimer);
          return;
        }

        // if a nested element or component already showed a JET context menu for this event, don't replace it with ours.
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
        menu.__openingContextMenu = false;

        // if the launch wasn't cancelled by a beforeOpen listener
        if (menu.widget().is(':visible')) {
          event.preventDefault(); // don't show native context menu
          document.addEventListener('keyup', preventKeyUpEventIfMenuOpen);

          // see double-open comments above
          if (event.type === 'touchstart' || event.type === 'contextmenu') {
            doubleOpenType = event.type;
            // prettier-ignore
            doubleOpenTimer = setTimeout(function () { // @HTMLUpdateOK delaying our own callback
              doubleOpenType = null;
            }, doubleOpenThreshold);
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
        }
        // for mousedown-after-touchend Mobile Safari issue explained above where __contextMenuPressHoldJustEnded is set.
        if (event.type === 'mousedown' && getContextMenu().__contextMenuPressHoldJustEnded()) {
          return undefined;
        }

        // reset isPressHold flag for all events that can start a click.
        isPressHold = false;

        // start a pressHold timer on touchstart.  If not cancelled before 750ms by touchend/etc., will launch the CM.
        if (event.type === 'touchstart') {
          touchInProgress = true;
          // prettier-ignore
          pressHoldTimer = setTimeout( // @HTMLUpdateOK delaying our own callback
            launch.bind(undefined, event, 'touch', true),
            pressHoldThreshold
          );
        }

        return true;
      }
    }
  };

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
      var parent = context.parentElement;
      // runs the template
      var childContext = bindingContext.createChildContext(context.data, null, function (binding) {
        // eslint-disable-next-line no-param-reassign
        binding.$key = context.key;
        // eslint-disable-next-line no-param-reassign
        binding.$metadata = context.metadata;
        // eslint-disable-next-line no-param-reassign
        binding.$headerContext = context;
      });

      _executeTemplate(context, template, parent, childContext, nodeStore);

      // tell the datagrid not to do anything
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
      var parent = context.parentElement;
      // runs the template
      var childContext = bindingContext.createChildContext(context.data, null, function (binding) {
        // eslint-disable-next-line no-param-reassign
        binding.$keys = context.keys;
        // eslint-disable-next-line no-param-reassign
        binding.$metadata = context.metadata;
        // eslint-disable-next-line no-param-reassign
        binding.$cellContext = context;
        // eslint-disable-next-line no-param-reassign
        binding.$cell = context.cell;
      });

      _executeTemplate(context, template, parent, childContext, nodeStore);

      // tell the datagrid not to do anything
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
        $(parent.childNodes[i])._ojDetectCleanData({ cleanParent: true });
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
      nodesArray = ko.utils.parseHtmlFragment(
        document.getElementById(useTemplate).innerHTML, // @HTMLUpdateOK
        document
      );
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

  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    attributes: ['header', 'cell'],
    init: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      if (name === 'header') {
        // find row template and creates a renderer
        var row = value.row;
        if (row != null) {
          var rowTemplate = row.template;
          if (rowTemplate != null) {
            row.renderer = _getDataGridHeaderRenderer(bindingContext, rowTemplate);
          }
        }

        // find column template and creates a renderer
        var column = value.column;
        if (column != null) {
          var columnTemplate = column.template;
          if (columnTemplate != null) {
            column.renderer = _getDataGridHeaderRenderer(bindingContext, columnTemplate);
          }
        }

        // find column template and creates a renderer
        var rowEnd = value.rowEnd;
        if (rowEnd != null) {
          var rowEndTemplate = rowEnd.template;
          if (rowEndTemplate != null) {
            rowEnd.renderer = _getDataGridHeaderRenderer(bindingContext, rowEndTemplate);
          }
        }

        // find column template and creates a renderer
        var columnEnd = value.columnEnd;
        if (columnEnd != null) {
          var columnEndTemplate = columnEnd.template;
          if (columnEndTemplate != null) {
            columnEnd.renderer = _getDataGridHeaderRenderer(bindingContext, columnEndTemplate);
          }
        }
        return { header: value };
      } else if (name === 'cell') {
        // find the cell template and creates a renderer
        var cellTemplate = value.template;
        if (cellTemplate != null) {
          // eslint-disable-next-line no-param-reassign
          value.renderer = _getDataGridCellRenderer(bindingContext, cellTemplate);
        }
        return { cell: value };
      }
      return undefined;
    },
    update: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      if (name === 'header') {
        // find row template and creates a renderer
        var row = value.row;
        if (row != null) {
          var rowTemplate = row.template;
          if (rowTemplate != null) {
            row.renderer = _getDataGridHeaderRenderer(bindingContext, rowTemplate);
          }
        }

        // find column template and creates a renderer
        var column = value.column;
        if (column != null) {
          var columnTemplate = column.template;
          if (columnTemplate != null) {
            column.renderer = _getDataGridHeaderRenderer(bindingContext, columnTemplate);
          }
        }

        // find column template and creates a renderer
        var rowEnd = value.rowEnd;
        if (rowEnd != null) {
          var rowEndTemplate = rowEnd.template;
          if (rowEndTemplate != null) {
            rowEnd.renderer = _getDataGridHeaderRenderer(bindingContext, rowEndTemplate);
          }
        }

        // find column template and creates a renderer
        var columnEnd = value.columnEnd;
        if (columnEnd != null) {
          var columnEndTemplate = columnEnd.template;
          if (columnEndTemplate != null) {
            columnEnd.renderer = _getDataGridHeaderRenderer(bindingContext, columnEndTemplate);
          }
        }
        return { header: value };
      } else if (name === 'cell') {
        // find the cell template and creates a renderer
        var cellTemplate = value.template;
        if (cellTemplate != null) {
          // eslint-disable-next-line no-param-reassign
          value.renderer = _getDataGridCellRenderer(bindingContext, cellTemplate);
        }
        return { cell: value };
      }
      return null;
    },

    for: 'ojDataGrid'
  });

  /**
   * @private
   */
  function _handleManagedDiagramAttributes(name, value, bindingContext) {
    if (name === 'template') {
      return { _templateFunction: _getDvtDataRenderer(bindingContext, value) };
    }
    return null;
  }

  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    attributes: ['template'],
    init: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleManagedDiagramAttributes(name, value, bindingContext);
    },
    update: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleManagedDiagramAttributes(name, value, bindingContext);
    },
    for: 'ojDiagram'
  });

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

  /*
   * Even though this is undocmented publicly and not used internally, there's a small chance that applications may be calling
   * this directly so not safe to remove
   */
  const koStringTemplateEngine = {};
  oj._registerLegacyNamespaceProp('koStringTemplateEngine', koStringTemplateEngine);

  /**
   * @export
   */
  koStringTemplateEngine.install = function () {
    // define a template source that tries to key into an object first to find a template string
    var localKo = ko;
    if (localKo.templates) {
      return;
    }

    var _templateText = {}; // Stores the text property for the template object.
    var _templateData = {}; // Stores the data property for the template object.

    // data = {},
    // eslint-disable-next-line new-cap
    var _engine = new localKo.nativeTemplateEngine();

    /**
     *  @constructor
     *  @private
     */
    var StringTemplate = function (template) {
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
    };

    //
    // Override knockout's makeTemplateSource(), returning the new stringTemplate
    //
    _engine.makeTemplateSource = function (template, templateDocument) {
      if (typeof template === 'string') {
        // eslint-disable-next-line no-param-reassign
        templateDocument = templateDocument || document;
        var elem = templateDocument.getElementById(template);

        if (elem) {
          // eslint-disable-next-line new-cap
          return new localKo.templateSources.domElement(elem);
        }
        return new StringTemplate(template);
      }
      if ((template && template.nodeType === 1) || template.nodeType === 8) {
        // eslint-disable-next-line new-cap
        return new localKo.templateSources.anonymousTemplate(template);
      }

      return undefined;
    };

    // make the templates accessible
    // ko.templates = _templateText;
    localKo.templates = _templateText;

    // make this new template engine our default engine
    localKo.setTemplateEngine(_engine);
  };

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
      var parent = context.parentElement;
      // runs the template
      var childContext = bindingContext.createChildContext(context.data, null, function (binding) {
        // eslint-disable-next-line no-param-reassign
        binding.$itemContext = context;
      });
      ko.renderTemplate(
        template,
        childContext,
        {
          afterRender: function (renderedElement) {
            $(renderedElement)._ojDetectCleanData();
          }
        },
        parent,
        'replaceNode'
      );

      // tell the listview not to do anything
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

      return { item: value };
    }

    return null;
  }

  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    attributes: ['item'],
    init: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      var result = _handleListViewManagedAttributes(name, value, bindingContext);
      if (result != null) {
        return result;
      }
      return undefined;
    },
    update: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleListViewManagedAttributes(name, value, bindingContext);
    },

    for: 'ojListViewRenderer'
  });

  /**
   * Default declaration for ojListView
   */
  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    for: 'ojListView',
    use: 'ojListViewRenderer'
  });

  /**
   * Default declaration for ojListView
   */
  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    for: 'ojNavigationList',
    use: 'ojListViewRenderer'
  });

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
    return { center: value };
  }

  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    attributes: ['center'],
    init: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleManagedGaugeAttributes(name, value, bindingContext);
    },
    update: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleManagedGaugeAttributes(name, value, bindingContext);
    },
    for: 'ojStatusMeterGauge'
  });

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
    return { rootNodeContent: value };
  }

  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    attributes: ['rootNodeContent'],
    init: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleManagedSunburstAttributes(name, value, bindingContext);
    },
    update: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleManagedSunburstAttributes(name, value, bindingContext);
    },
    for: 'ojSunburst'
  });

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
      rendererOption = function (params) {
        var childContext = null;
        var parentElement = null;
        if (_type === 'header') {
          childContext = bindingContext.createChildContext(null, null, function (binding) {
            // eslint-disable-next-line no-param-reassign
            binding.$columnIndex = params.columnIndex;
            // eslint-disable-next-line no-param-reassign
            binding.$headerContext = params.headerContext;
            // eslint-disable-next-line no-param-reassign
            binding.$data = params.data;
          });
          parentElement = params.headerContext.parentElement;
        } else if (_type === 'cell') {
          var childData = params.row;
          childContext = bindingContext.createChildContext(childData, null, function (binding) {
            // eslint-disable-next-line no-param-reassign
            binding.$columnIndex = params.columnIndex;
            // eslint-disable-next-line no-param-reassign
            binding.$cellContext = params.cellContext;
          });
          parentElement = params.cellContext.parentElement;
        }
        if (_type === 'footer') {
          childContext = bindingContext.createChildContext(null, null, function (binding) {
            // eslint-disable-next-line no-param-reassign
            binding.$columnIndex = params.columnIndex;
            // eslint-disable-next-line no-param-reassign
            binding.$footerContext = params.footerContext;
          });
          parentElement = params.footerContext.parentElement;
        }
        ko.renderTemplate(
          _template,
          childContext,
          {
            afterRender: function (renderedElement) {
              $(renderedElement)._ojDetectCleanData();
            }
          },
          parentElement,
          'replaceNode'
        );
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
      ko.renderTemplate(
        template,
        childContext,
        {
          afterRender: function (renderedElement) {
            $(renderedElement)._ojDetectCleanData();
          }
        },
        params.rowContext.parentElement,
        'replaceNode'
      );
    };
  }

  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    attributes: [_COLUMNS_ATTR, _COLUMNS_DEFAULT_ATTR, _ROW_TEMPLATE_ATTR],
    init: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
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
            column.footerRenderer = _getTableColumnTemplateRenderer(
              bindingContext,
              'footer',
              footerTemplate
            );
          }
          if (headerTemplate != null) {
            column.headerRenderer = _getTableColumnTemplateRenderer(
              bindingContext,
              'header',
              headerTemplate
            );
          }
        }
        if (name === _COLUMNS_ATTR) {
          return { columns: value };
        }

        return { columnsDefault: value };
      } else if (name === _ROW_TEMPLATE_ATTR) {
        return { rowRenderer: _getTableRowTemplateRenderer(bindingContext, value) };
      }
      return undefined;
    },
    update: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
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
            column.footerRenderer = _getTableColumnTemplateRenderer(
              bindingContext,
              'footer',
              footerTemplate
            );
          }
          if (headerTemplate != null) {
            column.headerRenderer = _getTableColumnTemplateRenderer(
              bindingContext,
              'header',
              headerTemplate
            );
          }
        }
        if (name === _COLUMNS_ATTR) {
          widgetConstructor({ columns: value });
        } else {
          widgetConstructor({ columnsDefault: value });
        }
      } else if (name === _ROW_TEMPLATE_ATTR) {
        return { rowRenderer: _getTableRowTemplateRenderer(bindingContext, value) };
      }
      return null;
    },
    for: 'ojTable'
  });

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
      return { areaLayers: value };
    } else if (name === 'pointDataLayers') {
      for (i = 0; i < value.length; i++) {
        template = value[i].template;
        if (template != null) {
          // eslint-disable-next-line no-param-reassign
          value[i]._templateRenderer = _getDvtDataRenderer(bindingContext, template);
        }
      }
      return { pointDataLayers: value };
    }
    return null;
  }

  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    attributes: ['areaLayers', 'pointDataLayers'],
    init: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleManagedMapAttributes(name, value, bindingContext);
    },
    update: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleManagedMapAttributes(name, value, bindingContext);
    },
    for: 'ojThematicMap'
  });

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
    return { nodeContent: value };
  }

  ComponentBinding.getDefaultInstance().setupManagedAttributes({
    attributes: ['nodeContent'],
    init: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleManagedTreemapAttributes(name, value, bindingContext);
    },
    update: function (
      name,
      value,
      element,
      widgetConstructor,
      valueAccessor,
      allBindingsAccessor,
      bindingContext
    ) {
      return _handleManagedTreemapAttributes(name, value, bindingContext);
    },
    for: 'ojTreemap'
  });

});
