/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'ojs/ojhtmlutils', 'ojs/ojlogger', 'promise', 'ojs/ojcustomelement', 'ojs/ojcomposite-knockout'], function(oj, HtmlUtils, Logger)
{
/* global Promise:false */

/**
 * <p>
 *  JET allows developers to create custom components which can be composites of other components, HTML, JavaScript, or CSS.
 *  These reusable pieces of UI can be embedded as <a href="CustomElementOverview.html">custom HTML elements</a> and are
 *  registered using the Composite APIs described below. These custom components will be referred to
 *  as "composites" throughout the rest of this doc. Please see the <a href="CompositeOverview.html">JET Custom Components</a>
 *  concept doc for more information on how to create and use these custom components.
 * </p>
 *
 * @namespace
 * @ojtsmodule
 * @since 2.0.0
 */
oj.Composite = {};
// this is the variable name that the AMD module will return in the require callback (used in a no-require environment)
// eslint-disable-next-line no-unused-vars
var Composite = oj.Composite;

/**
 * Returns a Promise resolving with the composite metadata with the given name or null if the composite has not been registered.
 * @param {string} name The component name, which should contain a dash '-' and not be a reserved tag name.
 * @return {Promise|null}
 * @ojdeprecated {since: '5.0.0', description: 'Use Composite.getComponentMetadata instead.'}
 * @ojsignature {target: "Type", value: "Promise<oj.Composite.Metadata>|null", for: "returns", jsdocOverride: true}
 *
 * @export
 * @memberof oj.Composite
 *
 */
oj.Composite.getMetadata = function (name) {
  var metadata = oj.Composite.getComponentMetadata(name);
  return metadata ? Promise.resolve(metadata) : null;
};

/**
 * Returns the composite metadata with the given name or null if the composite has not been registered.
 * @param {string} name The component name, which should contain a dash '-' and not be a reserved tag name.
 * @return {Object|null}
 *
 * @export
 * @memberof oj.Composite
 * @since 5.0.0
 * @ojstatus preview
 * @ojsignature {target: "Type", value: "oj.Composite.Metadata|null", for: "returns", jsdocOverride: true}
 *
 */
oj.Composite.getComponentMetadata = function (name) {
  // We have one registry where custom elements, definitional elements, and composites are all stored with
  // the JET framework so we need to check to see if the element is a composite before returning its metadata
  var info = oj.BaseCustomElementBridge.getRegistered(name);
  if (info && info.composite) {
    // Descriptor is guaranteed to be there for registered elements because we throw an error at registration
    // time if none is given
    var descriptor = oj.BaseCustomElementBridge.__GetDescriptor(name);
    return descriptor[oj.BaseCustomElementBridge.DESC_KEY_META];
  }
  return null;
};

/**
 * Registers a composite component.
 * @param {string} name The component name, which should contain a dash '-' and not be a reserved tag name.
 * @param {Object} descriptor The registration descriptor. The descriptor will contain keys for Metadata, View, ViewModel
 * and CSS that are detailed below. At a minimum a composite must register Metadata and View files, but all others are optional.
 * The composite resources should be mapped directly to each descriptor key. The support for an object with an 'inline' key mapped
 * to the resource has been deprecated in 5.0.0.
 * See the <a href="CompositeOverview.html#registration">registration section</a> above for a sample usage.
 * @param {oj.Composite.Metadata} descriptor.metadata A JSON formatted object describing the composite APIs. See the <a href="CompositeOverview.html#metadata">metadata documentation</a> for more info.
 * @param {string|Array.<Node>|DocumentFragment} descriptor.view A string, array of DOM nodes, or document fragment representing the HTML that will be used for the composite.
 *                                 <b>The array of DOM nodes and document fragment types are deprecated in 5.0.0.</b>
 * @param {string} descriptor.css (Deprecated) A string containing the composite CSS. <b>Note that this key should not be used if the composite
 *                                styles contain references to any external resources.</b>
 * @param {function(oj.Composite.ViewModelContext):void|Object} [descriptor.viewModel] This option is only applicable to composites hosting a Knockout template
 *                                      with a ViewModel and ultimately resolves to a constructor function or object instance.
 *                                      If the initial ViewModel resolves to an object instance, the initialize lifecycle listener
 *                                      will be called. See the <a href="CompositeOverview.html#ViewModel">initialize documentation</a> for more information.
 * @param {function(string, string, Object, function(string):any):any} [descriptor.parseFunction] The function that will be called to parse attribute values.
 *                                                              Note that this function is only called for non bound attributes. The parseFunction will take the following parameters:
 * <ul>
 *  <li>{string} value: The value to parse.</li>
 *  <li>{string} name: The name of the property.</li>
 *  <li>{Object} meta: The metadata object for the property which can include its type, default value,
 *      and any extensions that the composite has provided on top of the required metadata.</li>
 *  <li>{function(string):any} defaultParseFunction: The default parse function for the given attribute
 *      type which is used when a custom parse function isn't provided and takes as its parameter
 *      the value to parse.</li>
 * </ul>
 * @ojsignature [
 *               {target: "Type",
 *                value: "<P extends PropertiesType= PropertiesType>(name: string, descriptor: {
 *                metadata: Metadata;
 *                view: string;
 *                viewModel?: {new(context: ViewModelContext<P>): ViewModel<P>};
 *                parseFunction?: ((value: string, name: string, meta: object, defaultParseFunction?: (value: string) => any) => any);}): void"}]
 * @return {void}
 *
 *
 * @ojdeprecated [{target: "property", for: "descriptor.css", since: "4.1.0", description: "Please use require-css, a RequireJS CSS plugin for CSS loading instead."},
 *               {target: "parameterType", for: "descriptor.view", value: ["Array.<Node>", "DocumentFragment"], since: "5.0.0", description: "Please use the string type instead."},
 *               {target: "parameterType", for: "descriptor.viewModel", value: "Object", since: "5.0.0", description: "Please return a constructor function instead."}]
 *
 * @export
 * @memberof oj.Composite
 *
 */
oj.Composite.register = function (name, descriptor) {
  oj.CompositeElementBridge.register(name, descriptor);
};

/**
 * Finds the containing composite component for a given node. If the immediate enclosing
 * composite component is contained by another composite, the method will keep
 * walking up the composite hierarchy until the top-level composite
 * or the optional 'stopBelow' element is reached
 *
 * @param {Node} node the DOM node whose containing composite should be returned
 * @param {Element=} stopBelow the element where search should stop
 * @return {Element|null} the containing composite
 *
 * This method is currently intended for internal use only, and it is not exported
 * @ignore
 */
oj.Composite.getContainingComposite = function (node, stopBelow) {
  var composite = null;

  var _node = node;
  while (_node) {
    _node = oj.CompositeTemplateRenderer.getEnclosingComposite(_node);
    // : we should ignore oj-module component since it is not a relevant enclosing composite for this call
    if (_node && _node.nodeName.toLowerCase() !== 'oj-module') {
      // eslint-disable-next-line no-bitwise
      if (stopBelow && !(node.compareDocumentPosition(stopBelow) & 16/* contained by*/)) {
        break;
      }
      composite = _node;
    }
  }

  return composite;
};


/**
 * @ignore
 */
oj.Composite.getBindingProviderName = function (elem) {
  return (elem ? elem[oj.Composite.__BINDING_PROVIDER] : null);
};

/**
 * @ignore
 */
oj.Composite.__COMPOSITE_PROP = '__oj_composite';

/**
 * @ignore
 */
oj.Composite.__BINDING_PROVIDER = '__oj_binding_prvdr';


// TYPEDEFS

/**
 * @typedef {Object} oj.Composite.Metadata This typedef only contains the top level run time metadata properties.
 * Please see the <a href=CompositeOverview.html#metadata>Metadata</a> section for the full set of run time and design time metadata properties.
 * @property {string} name
 * @property {string} version
 * @property {string} jetVersion
 * @property {Object=} properties
 * @property {Object=} methods
 * @property {Object=} events
 * @property {Object=} slots
 */

/**
 * @typedef {Object} oj.Composite.ViewModel
 * @property {function(oj.Composite.ViewModelContext):(Promise|void)=} [activated] Invoked after the ViewModel is initialized.
 *                                                                               This method can return a Promise which will delay additional
 *                                                                               lifecycle phases until it is resolved and can be used as a
 *                                                                               hook for data fetching.
 * @property {function(oj.Composite.ViewModelContext):void=} [connected] Invoked after the View is first inserted into the DOM and then each
 *                                                                     time the composite is reconnected to the DOM after being disconnected.
 *                                                                     Note that if the composite needs to add/remove event listeners, we
 *                                                                     recommend using this and the disconnected methods.
 * @property {function(oj.Composite.ViewModelContext):void=} [bindingsApplied] Invoked after the bindings are applied on this View.
 * @property {function(oj.Composite.PropertyChangedContext):void=} [propertyChanged] Invoked when properties are updated and before the
 *                                                                                 [property]Changed event is fired.
 * @property {function(Element):void=} [disconnected] Invoked when this composite component is disconnected from the DOM.
 *
 * @property {function(oj.Composite.ViewModelContext):void=} initialize Invoked only if the ViewModel specified during registration is
 *                                                                      an object instance as opposed to a constructor function. If the registered
 *                                                                      ViewModel is a constructor function, the same context object will be passed
 *                                                                      to the constructor function instead. This method can return 1) nothing in
 *                                                                      which case the original model instance will be used, 2) a new model instance
 *                                                                      which will replace the original, or 3) a Promise which resolves to a new model
 *                                                                      instance which will replace the original and delay additional lifecycle phases
 *                                                                      until it is resolved.
 * @property {function(Element):void=} attached Invoked after the View is inserted into the DOM and will only be called once.
 *                                                                    Note that if the composite needs to add/remove event listeners,
 *                                                                    we recommend using the connected/disconnected methods.
 * @property {function(oj.Composite.ViewModelContext):void=} detached Invoked when this composite component is detached from the DOM.
 * @ojdeprecated [{target: "property", for: "initialize", since: "5.0.0", description: "Please pass a constructor function to Composite.register() instead."},
 *               {target: "property", for: "attached", since: "4.2.0", description: "Please use the connected method instead."},
 *               {target: "property", for: "detached", since: "4.2.0", description: "Please use the disconnected method instead."}]
 * @ojsignature [{target:"Type", value:"<P extends PropertiesType= PropertiesType>", for: "genericTypeParameters"},
 *               {target: "Type", value: "((context: ViewModelContext<P>) => Promise<any> | void)", for: "activated"},
 *               {target: "Type", value: "((context: ViewModelContext<P>) => void)", for: "connected"},
 *               {target: "Type", value: "((context: ViewModelContext<P>) => void)", for: "bindingsApplied"},
 *               {target: "Type", value: "((context: PropertyChangedContext<P>) => void)", for: "propertyChanged"},
 *               {target: "Type", value: "((element: Element) => void)", for: "disconnected"}]
 */

/**
 * @typedef {Object} oj.Composite.ViewModelContext
 * @property {Element} element The composite element.
 * @property {Object} properties A map of the composite component's current properties and values.
 * @property {Object} slotCounts A map of slot name to assigned nodes count for the View.
 * @property {string} unique A unique string that can be used for unique id generation.
 * @property {string} uniqueId The ID of the composite component if specified. Otherwise, it is the same as unique.
 *
 * @property {Object} props A Promise evaluating to the composite component's properties.
 * @property {Object} slotNodeCounts A Promise evaluating to a map of slot name to assigned nodes count for the View.
 * @ojdeprecated [{target: "property", for: "props", since: "5.0.0", description: "Please use the 'properties' property instead."},
 *               {target: "property", for: "slotNodeCounts", since: "5.0.0", description: "Please use the 'slotCounts' property instead."}]
 * @ojsignature [{target:"Type", value:"<P extends PropertiesType= PropertiesType>", for: "genericTypeParameters"},
 *               {target: "Type", value: "P", for: "properties"}]
 */

/**
 * @typedef {Object} oj.Composite.PropertyChangedContext
 * @property {string} property The property that changed.
 * @property {any} value The current value of the property that changed.
 * @property {any} previousValue The previous value of the property that changed.
 * @property {"external"|"internal"} updatedFrom Indicates how the property update occurred. The value will be "external" if the update
 *                                               occured from the application, e.g. the element's property setter, setAttribute, or a
 *                                               data binding update. The value will be "internal" if the update occurred from the
 *                                               component, e.g. after user interaction with a text field or selection.
 * @property {Object=} subproperty An object holding information about the subproperty that changed.
 * @property {string} subproperty.path The subproperty path that changed, starting from the top level property with subproperties delimited by '.'.
 * @property {any} subproperty.value The current value of the subproperty that changed.
 * @property {any} subproperty.previousValue The previous value of the subproperty that changed.
 * @ojsignature [{target:"Type", value:"<P extends PropertiesType= PropertiesType>", for: "genericTypeParameters"},
 *               {target: "Type", value: "keyof P", for: "property"},
 *               {target: "Type", value: "P[keyof P]", for: "value"},
 *               {target: "Type", value: "P[keyof P]", for: "previousValue"}]
 */

/**
 * If you are writing your composite in TypeScript and wish to have stricter type checking done for your composite properties,
 * you can optionally define a type in your ViewModel which lists all component properties, their types, and parameterize your composite ViewModel
 * and methods based that type.
 * <p>
 * For example, if you are writing a composite with two properties customTitle and help,
 * <pre class="prettyprint"><code>
 * // Create a type representing all the properties of your composite
 * type ExampleComponentProperties = {
 *   'customTitle': string,
 *   'help' : {
 *      definition: string
 *    }
 * }
 * // Parameterize your ViewModel and methods on this type
 * class ExampleComponentModel implements ViewModel&lt;ExampleComponentProperties>{
 *   activated = (context: ViewModelContext&lt;ExampleComponentProperties>) => {
 *     let title = context.properties.customTitle; //guranteed to be string
 *     let helpDef = context.properties.help.definition; //guranteed to be string
 *   }
 * }
 * </code></pre>
 * If no type is provided, this default type will be used and you need not parameterize your ViewModel.
 * @typedef {Object} oj.Composite.PropertiesType
 * @ojsignature [{target:"Type", value:"{[key:string] : any;}"}]
 */

/* global Promise:false, HtmlUtils:false, Logger:false */

/**
 * JET component custom element bridge.
 *
 * Composite connnected callbacks occur asynchronously so we cannot
 * guarantee that child composite properties can be accessed before the
 * child busy state resolves.
 *
 * Composite code and applications should always wait on the element or page level
 * busy context before accessing properties or methods.
 *
 * @class
 * @ignore
 */
oj.CompositeElementBridge = {};

/**
 * Prototype for the JET component custom element bridge instance
 */
oj.CompositeElementBridge.proto = Object.create(oj.BaseCustomElementBridge.proto);

oj.CollectionUtils.copyInto(oj.CompositeElementBridge.proto,
  {
    beforePropertyChangedEvent: function (element, property, detail) {
      var vmContext = { property: property };
      oj.CollectionUtils.copyInto(vmContext, detail);
      oj.CompositeTemplateRenderer.invokeViewModelMethod(this._VIEW_MODEL,
                                                         'propertyChanged',
                                                         [vmContext]);
    },

    AddComponentMethods: function (proto) {
      // Add subproperty getter/setter
      var setPropertyHelper = function (element, bridge, prop, value, propertyBag, isOuterSet) {
        if (!bridge.SaveEarlyPropertySet(prop, value)) {
          var setResult = bridge.SetProperty(element, prop, value, propertyBag, isOuterSet);
          if (setResult.propertySet) {
            if (setResult.isSubproperty) {
              // Retrieve the property tracker for the top level property and notify that a subproperty has
              // changed so any View bound subproperties will trigger a View update
              var propertyTracker = oj.CompositeElementBridge._getPropertyTracker(bridge,
                setResult.property);
              propertyTracker.valueHasMutated();
            }
          }
        }
      };
      // eslint-disable-next-line no-param-reassign
      proto.setProperty = function (prop, value) {
        var bridge = oj.BaseCustomElementBridge.getInstance(this);
        setPropertyHelper(this, bridge, prop, value, this, true);
      };
      // eslint-disable-next-line no-param-reassign
      proto.getProperty = function (prop) {
        var bridge = oj.BaseCustomElementBridge.getInstance(this);
        return bridge.GetProperty(this, prop, this);
      };
      // eslint-disable-next-line no-param-reassign
      proto._propsProto.setProperty = function (prop, value) {
        // 'this' is the property object we pass to the ViewModel to track internal property changes
        setPropertyHelper(this._ELEMENT, this._BRIDGE, prop, value, this, false);
      };
      // eslint-disable-next-line no-param-reassign
      proto._propsProto.getProperty = function (prop) {
        // 'this' is the property object we pass to the ViewModel to track internal property changes
        return this._BRIDGE.GetProperty(this, prop, this);
      };
      // Always add automation methods, but if the ViewModel defines overrides, wrap the overrides
      // and pass the default implementation in as the last parameter to the ViewModel's method.
      // eslint-disable-next-line no-param-reassign
      proto.getNodeBySubId = function (locator) {
        var bridge = oj.BaseCustomElementBridge.getInstance(this);
        var viewModel = bridge._getViewModel(this);
        if (viewModel.getNodeBySubId) {
          return viewModel.getNodeBySubId(locator, bridge._getNodeBySubId.bind(this));
        }
        return bridge._getNodeBySubId.bind(this)(locator);
      };
      // eslint-disable-next-line no-param-reassign
      proto.getSubIdByNode = function (node) {
        var bridge = oj.BaseCustomElementBridge.getInstance(this);
        var viewModel = bridge._getViewModel(this);
        if (viewModel.getSubIdByNode) {
          return viewModel.getSubIdByNode(node, bridge._getSubIdByNode.bind(this));
        }
        return bridge._getSubIdByNode.bind(this)(node);
      };
    },

    CreateComponent: function (element) {
      // Setup the ViewModel context to pass to lifecycle listeners
      var slotNodeCounts = {};
      // Generate slot map before we update DOM with view nodes
      var slotMap = oj.BaseCustomElementBridge.getSlotMap(element);
      var slots = Object.keys(slotMap);
      for (var i = 0; i < slots.length; i++) {
        var slot = slots[i];
        slotNodeCounts[slot] = slotMap[slot].length;
      }
      this._SLOT_MAP = slotMap;
      var vmContext = {
        element: element,
        props: Promise.resolve(this._PROPS),
        properties: this._PROPS,
        slotNodeCounts: Promise.resolve(slotNodeCounts),
        slotCounts: slotNodeCounts,
        unique: oj.BaseCustomElementBridge.__GetUnique()
      };
      vmContext.uniqueId = element.id ? element.id : vmContext.unique;
      this._VM_CONTEXT = vmContext;

      var model = oj.BaseCustomElementBridge
          .__GetDescriptor(element.tagName)[oj.BaseCustomElementBridge.DESC_KEY_VIEW_MODEL];
      if (typeof model === 'function') {
        // eslint-disable-next-line new-cap
        model = new model(vmContext);
      } else { // The initialize callback is deprecated in 5.0.0. If the function returns a value, use it as the new model instance.
        model = oj.CompositeTemplateRenderer.invokeViewModelMethod(model,
                                                                   'initialize',
                                                                   [vmContext])
          || model;
      }
      this._VIEW_MODEL = model;

      // This method can return a Promise which will delay additional lifecycle phases until it is resolved.
      var activatedPromise = oj.CompositeTemplateRenderer.invokeViewModelMethod(model,
                                                                                'activated',
                                                                                [vmContext])
          || Promise.resolve(true);

      var bridge = this;
      activatedPromise.then(function () {
        var params = {
          props: bridge._PROPS,
          slotMap: bridge._SLOT_MAP,
          slotNodeCounts: slotNodeCounts,
          unique: bridge._VM_CONTEXT.unique,
          uniqueId: bridge._VM_CONTEXT.uniqueId,
          viewModel: bridge._VIEW_MODEL,
          viewModelContext: bridge._VM_CONTEXT
        };

        // Store the name of the binding provider on the element when we are about
        // to insert the view. This will allow custom elements within the view to look
        // up the binding provider used by the composite (currently only KO).
        Object.defineProperty(element, oj.Composite.__BINDING_PROVIDER, { value: 'knockout' });
        // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
        if (oj.Components) {
          oj.Components.unmarkPendingSubtreeHidden(element);
        }

        var cache = oj.BaseCustomElementBridge.__GetCache(element.tagName);
        // Need to clone nodes first
        var view = oj.CompositeElementBridge._getDomNodes(cache.view, element);
        oj.CompositeTemplateRenderer.renderTemplate(params, element, view);

        // Set flag when we can fire property change events
        bridge.__READY_TO_FIRE = true;

        // Resolve the component busy state
        bridge.resolveDelayedReadyPromise();
      }).catch(function (reason) {
        // Resolve the busy state if the activated Promise is rejected
        bridge.throwError(element, reason);
      });
    },

    DefineMethodCallback: function (proto, method, methodMeta) {
      // eslint-disable-next-line no-param-reassign
      proto[method] = function () {
        var methodName = methodMeta.internalName || method;
        var bridge = oj.BaseCustomElementBridge.getInstance(this);
        var viewModel = bridge._getViewModel(this);
        return viewModel[methodName].apply(viewModel, arguments);
      };
    },

    DefinePropertyCallback: function (proto, property, propertyMeta) {
      var set = function (value, bOuterSet) {
        // Properties can be set before the component is created. These early
        // sets are actually saved until after component creation and played back.
        if (!this._BRIDGE.SaveEarlyPropertySet(property, value)) {
          // Property trackers are observables are referenced when the property is set or retrieved,
          // which allows us to automatically update the View when the property is mutated.
          var propertyTracker = oj.CompositeElementBridge._getPropertyTracker(this._BRIDGE,
                                                                              property);
          var previousValue = propertyTracker.peek();
          if (!oj.BaseCustomElementBridge.__CompareOptionValues(property,
                                                                propertyMeta,
                                                                value,
                                                                previousValue)) { // We should consider supporting custom comparators
            // Skip validation for inner sets so we don't throw an error when updating readOnly writeable properties
            if (bOuterSet) {
              // eslint-disable-next-line no-param-reassign
              value = this._BRIDGE.ValidatePropertySet(this._ELEMENT, property, value);
            }

            if (propertyMeta._eventListener) {
              this._BRIDGE.SetEventListenerProperty(this._ELEMENT, property, value);
            }
            propertyTracker(value);

            if (!propertyMeta._derived) {
              var updatedFrom = bOuterSet ? 'external' : 'internal';
              oj.BaseCustomElementBridge.__FirePropertyChangeEvent(this._ELEMENT,
                property, value, previousValue, updatedFrom);
            }
          } else {
            Logger.info(oj.BaseCustomElementBridge.getElementInfo(this._ELEMENT) + ": Ignoring property set for property '" +
              property + "' with same value.");
          }
        }
      };

      // Called on the ViewModel props object
      var innerSet = function (value) {
        set.bind(this)(value, false);
      };

      // Called on the custom element
      var outerSet = function (value) {
        var bridge = oj.BaseCustomElementBridge.getInstance(this);
        set.bind(bridge._PROPS)(value, true);
      };

      var get = function (bOuterSet) {
        var propertyTracker = oj.CompositeElementBridge._getPropertyTracker(this._BRIDGE, property);
        // If the attribute has not been set, return the default value
        // Calling .peek() lets us check the propertyTracker value without creating a dependency
        var value = bOuterSet ? propertyTracker.peek() : propertyTracker();
        if (value === undefined) {
          value = this._BRIDGE.GetDefaultValue(propertyMeta);
          propertyTracker(value);
        }
        return value;
      };

      // Called on the ViewModel props object
      var innerGet = function () {
        return get.bind(this, false)();
      };

      // Called on the custom element
      var outerGet = function () {
        var bridge = oj.BaseCustomElementBridge.getInstance(this);
        return get.bind(bridge._PROPS, true)();
      };

      // Don't add event listener properties for inner props
      if (!propertyMeta._derived) {
        oj.BaseCustomElementBridge.__DefineDynamicObjectProperty(proto._propsProto,
                                                                 property,
                                                                 innerGet,
                                                                 innerSet);
      }
      oj.BaseCustomElementBridge.__DefineDynamicObjectProperty(proto, property, outerGet, outerSet);
    },

    GetMetadata: function (descriptor) {
      // Composites have a public getMetadata API so we cannot directly modify the
      // original metadata object when we add additional info for on[PropertyName] properties
      return descriptor._metadata;
    },

    HandleDetached: function (element) {
      // Invoke callback on the superclass
      oj.BaseCustomElementBridge.proto.HandleDetached.call(this, element);

      // Detached is deprecated in 4.2.0 for disconnected
      oj.CompositeTemplateRenderer.invokeViewModelMethod(this._VIEW_MODEL,
                                                         'detached',
                                                         [element]);
      oj.CompositeTemplateRenderer.invokeViewModelMethod(this._VIEW_MODEL,
                                                         'disconnected',
                                                         [element]);
    },

    HandleReattached: function (element) {
      // Invoke callback on the superclass
      oj.BaseCustomElementBridge.proto.HandleReattached.call(this, element);

      oj.CompositeTemplateRenderer.invokeViewModelMethod(this._VIEW_MODEL,
                                                         'connected',
                                                         [this._VM_CONTEXT]);
    },

    InitializeElement: function (element) {
      // Invoke callback on the superclass
      oj.BaseCustomElementBridge.proto.InitializeElement.call(this, element);

      // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
      if (oj.Components) {
        oj.Components.markPendingSubtreeHidden(element);
      }

      var descriptor;

      // Cache the View
      var cache = oj.BaseCustomElementBridge.__GetCache(element.tagName);
      if (!cache.view) {
        descriptor = oj.BaseCustomElementBridge.__GetDescriptor(element.tagName);

        var view = descriptor[oj.BaseCustomElementBridge.DESC_KEY_VIEW];
        // when multiple instances of the same CCA are on the same page, because of the async
        // nature, we could end up with multiple promises created on the same view. The first
        // resolved promise will set up cache.view, all others should just use the cached
        // view instead of parsing it again. So here we check existence of cache in the resolve
        // callback to avoid parsing the view multiple times.
        if (!cache.view) {
          if (typeof (view) === 'string') {
            cache.view = oj.CompositeElementBridge._getDomNodes(view, element);
          } else {
            cache.view = view;
          }
        }
      }

      // Cache the CSS
      if (!cache.css) {
        if (!descriptor) {
          descriptor = oj.BaseCustomElementBridge.__GetDescriptor(element.tagName);
        }

        // The CSS Promise will be null if loaded by the require-css plugin
        var css = descriptor[oj.BaseCustomElementBridge.DESC_KEY_CSS];
        // CSS is optional so we need to check if it was provided
        if (css) {
          var style = document.createElement('style');
          style.type = 'text/css';
          if (style.styleSheet) { // for IE
            style.styleSheet.cssText = css;
          } else {
            style.appendChild(document.createTextNode(css)); // @HTMLUpdateOK
          }
          document.head.appendChild(style); // @HTMLUpdateOK
          // Set a flag that we've already processed and appended the style to the
          // document head so we only do this once for all composite instances
          cache.css = true;
        }
      }

      // Loop through all element attributes to get initial properties
      oj.BaseCustomElementBridge.__InitProperties(element, this._PROPS);
    },

    InitializePrototype: function (proto) {
      // Invoke callback on the superclass
      oj.BaseCustomElementBridge.proto.InitializePrototype.call(this, proto);

      Object.defineProperty(proto, '_propsProto', { value: {} });
    },

    InitializeBridge: function (element) {
      // Invoke callback on the superclass
      oj.BaseCustomElementBridge.proto.InitializeBridge.call(this, element);

      if (element._propsProto) {
        this._PROPS = Object.create(element._propsProto);
        this._PROPS._BRIDGE = this;
        this._PROPS._ELEMENT = element;
      }
    },

    _getNodeBySubId: function (locator) {
      // The locator subId can fall into one of 3 categories below:
      // 1) The target node belongs to a JET component or composite with a subId map
      // 2) The target node maps directly to a subId
      // 3) The composite does not have a match for the subId

      // The returned subId map the following key/value pairs:
      // {
      //    [subId]: {
      //      alias: [alias or null for non JET components],
      //      node: [node]
      //    }
      // }
      var map = oj.CompositeElementBridge.__GetSubIdMap(this);
      var match = map[locator.subId];
      if (match) {
        if (match.alias) { // Case #1
          var clone = oj.CollectionUtils.copyInto({}, locator, undefined, true);
          clone.subId = match.alias;
          var component = match.node;
          // Check to see if we should call the method on the element or widget
          if (component.getNodeBySubId) {
            return component.getNodeBySubId(clone);
          }

          // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
          return oj.Components.__GetWidgetConstructor(component)('getNodeBySubId', clone);
        }

        return match.node; // Case #2
      }

      return null; // Case #3
    },

    _getSubIdByNode: function (node) {
      // The node can fall into one of 3 categories below:
      // 1) The node is not a child of this composite.
      // 2) The node is a child of an inner composite and we need to convert its aliased subId
      // 3) The node is a child of this composite
      // 3a) The node is mapped directly to a subId
      // 3b) The node is owned by an element that has a getSubIdByNode method and we need to convert its aliased subId

      // Case #1
      if (!this.contains(node)) {
        return null;
      }

      // The returned node map has the following key/value pairs where nodeKey is
      // the value of the node's data-oj-subid[-map] attribute:
      // [nodeKey]: { map: [subIdMap], node: [node] }
      var nodeMap = oj.CompositeElementBridge.__GetNodeMap(this);
      var nodeKey;
      var match;
      var locator;

      // Case #2
      var composite = oj.Composite.getContainingComposite(node, this);
      if (composite != null) {
        nodeKey = composite.node.getAttribute('data-oj-subid-map');
        match = nodeMap[nodeKey];
        if (match) {
          if (composite.getSubIdByNode) {
            locator = composite.getSubIdByNode(node);
            if (locator) {
              var alias = match.map[locator.subId];
              locator.subId = alias;
              return locator;
            }
          }
        }
        // Return null if we did not expose the node even though the inner composite does
        return null;
      }

      // Case #3
      // Walk up DOM tree until we find the containing node with the subId mapping
      var curNode = node;
      while (curNode !== this) {
        // We do not support an element having both attributes. If both are specified, -map takes precedence.
        nodeKey = curNode.getAttribute('data-oj-subid-map')
          || curNode.getAttribute('data-oj-subid');
        if (nodeKey) {
          break;
        }
        curNode = curNode.parentNode;
      }

      match = nodeMap[nodeKey];
      if (match) {
        var map = match.map;
        if (!map) { // Case #3a
          return { subId: nodeKey };
        }

        var component = match.node;
        // Check to see if we should call the method on the element or widget
        if (component.getSubIdByNode) {
          locator = component.getSubIdByNode(node);
        } else {
          // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
          locator = oj.Components.__GetWidgetConstructor(component)('getSubIdByNode', node);
        }

        if (locator) {
          locator.subId = match.map[locator.subId];
          return locator;
        }
      }

      return null;
    },

    _getViewModel: function (element) {
      if (!this._VIEW_MODEL) {
        this.throwError(element, 'Cannot access methods before element is upgraded.');
      }
      return this._VIEW_MODEL;
    }

  });

/** ***********************/
/* PUBLIC STATIC METHODS */
/** ***********************/

/**
 * See oj.Composite.register doc for details
 * @ignore
 *
 */
oj.CompositeElementBridge.register = function (tagName, descriptor) {
  // Convert any descriptor objects using the deprecated inline keys to the new API
  var descrip = {};
  descrip[oj.BaseCustomElementBridge.DESC_KEY_META] =
    oj.CompositeElementBridge._getResource(descriptor, oj.BaseCustomElementBridge.DESC_KEY_META);
  descrip[oj.BaseCustomElementBridge.DESC_KEY_VIEW] =
    oj.CompositeElementBridge._getResource(descriptor, oj.BaseCustomElementBridge.DESC_KEY_VIEW);
  descrip[oj.BaseCustomElementBridge.DESC_KEY_CSS] =
    oj.CompositeElementBridge._getResource(descriptor, oj.BaseCustomElementBridge.DESC_KEY_CSS);
  descrip[oj.BaseCustomElementBridge.DESC_KEY_VIEW_MODEL] =
    oj.CompositeElementBridge._getResource(descriptor,
                                           oj.BaseCustomElementBridge.DESC_KEY_VIEW_MODEL);
  descrip[oj.BaseCustomElementBridge.DESC_KEY_PARSE_FUN] =
    descriptor[oj.BaseCustomElementBridge.DESC_KEY_PARSE_FUN];

  if (oj.BaseCustomElementBridge.__Register(tagName,
                                            descrip,
                                            oj.CompositeElementBridge.proto,
                                            true)) {
    var metadata = descrip[oj.BaseCustomElementBridge.DESC_KEY_META];
    if (!metadata) {
      // Metadata is required starting in 3.0.0, but to be backwards compatible, just log a warning.
      Logger.warn("Composite registered'" + tagName.toLowerCase() + "' without Metadata.");
      metadata = {};
    }
    var view = descrip[oj.BaseCustomElementBridge.DESC_KEY_VIEW];
    if (view == null) {
      throw new Error("Cannot register composite '" + tagName.toLowerCase() + "' without a View.");
    }

    // __ProcessEventListeners returns a copy of the metadata so we're not updating the original here.
    descrip._metadata = oj.BaseCustomElementBridge.__ProcessEventListeners(metadata, false);
    customElements.define(tagName.toLowerCase(),
                          oj.CompositeElementBridge.proto.getClass(descrip));
  }
};

/** ***************************/
/* NON PUBLIC STATIC METHODS */
/** ***************************/

/**
 * @ignore
 */
oj.CompositeElementBridge._getDomNodes = function (content, element) {
  var i;
  var clonedContent;
  if (typeof content === 'string') {
    return HtmlUtils.stringToNodeArray(content);
  } else if (oj.CompositeElementBridge._isDocumentFragment(content)) {
    clonedContent = content.cloneNode(true);
    var nodes = [];
    for (i = 0; i < clonedContent.childNodes.length; i++) {
      nodes.push(clonedContent.childNodes[i]);
    }
    return nodes;
  } else if (Array.isArray(content)) {
    clonedContent = [];
    for (i = 0; i < content.length; i++) {
      clonedContent.push(content[i].cloneNode(true));
    }
    return clonedContent;
  }

  var bridge = oj.BaseCustomElementBridge.getInstance(element);
  // TODO update this error message once we remove support for Array of DOM nodes and DocumentFragment
  bridge.throwError(
    element,
    'The composite View is not one of the following supported types: string, Array of DOM nodes, DocumentFragment');

  return undefined; // Not really reachable by ESLint doesn't know that
};

/**
 * Creates the subId and node maps needed for automation
 * @ignore
 */
oj.CompositeElementBridge._generateSubIdMap = function (bridge, element) {
  if (!bridge._SUBID_MAP) {
    // The format of the map will be { [composite subId] : {alias: [alias], node: [node] } }
    var subIdMap = {};
    var nodeMap = {};

    // data-oj-subid or data-oj-subid-map attributes can be defined on nested objects so we need
    // to walk the composite tree skipping over slots
    var children = element.children;
    for (var i = 0; i < children.length; i++) {
      oj.CompositeElementBridge._walkSubtree(subIdMap, nodeMap, children[i]);
    }

    // eslint-disable-next-line no-param-reassign
    bridge._NODE_MAP = nodeMap;
    // eslint-disable-next-line no-param-reassign
    bridge._SUBID_MAP = subIdMap;
  }
};

/**
 * Walks a composite subtree, parsing and generating subId mappings.
 * @ignore
 */
oj.CompositeElementBridge._walkSubtree = function (subIdMap, nodeMap, node) {
  if (!node.hasAttribute('slot')) {
    oj.CompositeElementBridge._addNodeToSubIdMap(subIdMap, nodeMap, node);
    // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
    if (!oj.BaseCustomElementBridge.getRegistered(node.tagName) &&
        !oj.Components.__GetWidgetConstructor(node)) {
      var children = node.children;
      for (var i = 0; i < children.length; i++) {
        oj.CompositeElementBridge._walkSubtree(subIdMap, nodeMap, children[i]);
      }
    }
  }
};

/**
 * Checks to see if a node has defined subIds and adds them to the composite's
 * cached subId -> node and node -> subId maps for automation.
 * @ignore
 */
oj.CompositeElementBridge._addNodeToSubIdMap = function (subIdMap, nodeMap, node) {
  var nodeSubId = node.getAttribute('data-oj-subid');
  var nodeSubIdMapStr = node.getAttribute('data-oj-subid-map');
  // We do not support an element having both attributes. If both are specified, -map takes precedence.
  if (nodeSubIdMapStr) {
    var parsedValue = JSON.parse(nodeSubIdMapStr);
    if (typeof parsedValue === 'object' && !(parsedValue instanceof Array)) {
      var nodeSubIdMap = parsedValue;
      var reverseMap = {};
      var keys = Object.keys(nodeSubIdMap);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        // eslint-disable-next-line no-param-reassign
        subIdMap[key] = { alias: nodeSubIdMap[key], node: node };
        reverseMap[nodeSubIdMap[key]] = key;
      }
      // eslint-disable-next-line no-param-reassign
      nodeMap[nodeSubIdMapStr] = { map: reverseMap, node: node };
    }
  } else if (nodeSubId) {
    // eslint-disable-next-line no-param-reassign
    subIdMap[nodeSubId] = { node: node };
    // eslint-disable-next-line no-param-reassign
    nodeMap[nodeSubId] = { node: node };
  }
};

/**
 * Returns the subId to node mapping for the composite's View.
 * @ignore
 */
oj.CompositeElementBridge.__GetSubIdMap = function (element) {
  var bridge = oj.BaseCustomElementBridge.getInstance(element);
  oj.CompositeElementBridge._generateSubIdMap(bridge, element);
  return bridge._SUBID_MAP;
};

/**
 * Returns the node to subId mapping for the composite's View. The returned map has the
 * following key/value pairs where nodeKey is value of the node's data-oj-subid[-map] attribute:
 * {
 *   [nodeKey]: {
 *     map: [subIdMap],
 *     node: [node]
 *   }
 * }
 * @return {Map}
 * @ignore
 */
oj.CompositeElementBridge.__GetNodeMap = function (element) {
  var bridge = oj.BaseCustomElementBridge.getInstance(element);
  oj.CompositeElementBridge._generateSubIdMap(bridge, element);
  return bridge._NODE_MAP;
};

/**
 * @ignore
 */
oj.CompositeElementBridge._getPropertyTracker = function (bridge, property) {
  if (!bridge._TRACKERS) {
    // eslint-disable-next-line no-param-reassign
    bridge._TRACKERS = {};
  }
  if (!bridge._TRACKERS[property]) {
    // eslint-disable-next-line no-param-reassign
    bridge._TRACKERS[property] = oj.CompositeTemplateRenderer.createTracker();
  }
  return bridge._TRACKERS[property];
};

/**
 * @ignore
 */
oj.CompositeElementBridge._getResource = function (descriptor, key) {
  var resource = descriptor[key];
  if (resource != null) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    if (hasOwnProperty.call(resource, 'inline')) {
      return resource.inline;
    } else if (hasOwnProperty.call(resource, 'promise')) {
      throw new Error("The 'promise' resource type for descriptor key '" + key +
                      "' is no longer supported." +
                      ' The resource should be passed directly as the value instead.');
    } else {
      return resource;
    }
  }
  return undefined;
};

/**
 * @ignore
 */
oj.CompositeElementBridge._isDocumentFragment = function (content) {
  if (window.DocumentFragment) {
    return content instanceof DocumentFragment;
  }

  return content && content.nodeType === 11;
};

/**
 * @ojoverviewdoc ComponentPackOverview - [5]JET Pack Metadata
 * @classdesc
 * {@ojinclude "name":"componentPackOverviewDoc"}
 */

/**
 * <h2 id="usage">Overview
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h2>
 * <p>
 *  As development teams become more familiar with JET and gain experience with implementing and packaging reusable bits of application functionality as
 *  <a href="CompositeOverview.html">custom JET Web Components</a>, they encounter more complex use cases where multiple components have dependencies upon
 *  a set of shared development resources, including:  related Components, JavaScript base and utility classes, CSS files, icons, translation bundles, etc.
 * </p>
 * <p>
 *  The following JET component types can assist both JET Web Component producers and consumers with managing these complex use cases:
 *  <ul>
 *    <li><b>JET Component Packs, or JET Packs</b>, define versioned sets of JET Web Components that can be managed, packaged, and delivered as a whole.  JET Packs
 *      consist of metadata and additional artifacts that allow downstream consumers, such as Oracle Visual Builder Cloud Service (VBCS) or the JET Command Line interface,
 *      to automate the configuration and initialization of deployed applications that are built with these Components, including shared resources (e.g., CSS resources,
 *      utility JavaScript files, base JavaScript classes extended by multiple Web Components, etc.), and information about 3rd party packages.</li>
 *    <li><b>JET Reference Components</b> define a versioned external 3rd party library dependency – JET Packs, JET Resource Components, and individual JET Web Components can include
 *      a JET Reference Component as part of their <code>dependencies</code> metadata.  JET Reference Components consist of metadata for automating the installation of the corresponding
 *      3rd party library, as well as the necessary RequireJS configuration for calling into this 3rd party library from a deployed JET application.</li>
 *    <li><b>JET Resource Components</b> define and package resources shared by a set of JET Web Components – JET Packs, other JET Resource Components, and individual JET Web Components
 *      can include a JET Resource Component as part of their <code>dependencies</code> metadata.  Shared resources can include shared CSS, JavaScript base classes & utility code,
 *      icons, translation bundles, etc.</li>
 *  </ul>
 * </p>
 *
 * <h2 id="metadata">Metadata Structure
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#metadata"></a>
 * </h2>
 * <p>
 *   Metatata for JET Packs, JET Reference Components, and JET Resource Components is specified in a component.json file that is expected at the root
 *   of the Component's packaging.  Metadata properties like "name", "version", "jetVersion", "description", and "displayName" should be familiar from the
 *   <a href="MetadataOverview.html">metadata JSON</a> that is defined for JET Web Components.  The complete metadata structure for
 *   JET Packs, JET Reference Components, and JET Resource Components is as follows:
 * </p>
 *
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Required</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="rt">name</td>
 *       <td>yes</td>
 *       <td>{string}</td>
 *       <td>The component name.
 *           The component name must meet the following requirements (based upon the <a href="https://www.w3.org/TR/custom-elements/#custom-elements-core-concepts">W3C Custom Element spec</a>):
 *           <ul>
 *             <li>The name can include only letters, digits, '-', and '_'.</li>
 *             <li>The letters in the name should be all lowercase.
 *             <li>The name cannot be one of the following reserved names:
 *             <ul>
 *               <li>annotation-xml
 *               <li>color-profile
 *               <li>font-face
 *               <li>font-face-src
 *               <li>font-face-uri
 *               <li>font-face-format
 *               <li>font-face-name
 *               <li>missing-glyph
 *             </ul>
 *           </ul>
 *           <h6>Note:</h6>
 *           The <b>full name</b> of a component consists of its <code>pack</code> metadata value and its <code>name</code> metadata value, appended
 *           together with a hyphen separating them:&nbsp;&nbsp;<code><i>[pack_value]</i>-<i>[name_value]</i></code>.  For both JET Core
 *           Components and for JET Custom Components, <b>this full name corresponds to the Component's custom element tag name</b>.  The names of
 *           standalone JET Components that are <b>not</b> members of a JET Pack have the following additional requirements:
 *           <ul>
 *             <li>At least one hyphen is required.</li>
 *             <li>The first segment (up to the first hyphen) is a namespace prefix. <b>The namespace prefix 'oj' is reserved for components that are
 *               bundled with the JET release.</b></li>
 *             <li>The first hyphen must be followed by at least one character.</li>
 *           <ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td class="rt">version</td>
 *       <td>yes</td>
 *       <td>{string}</td>
 *       <td>The component version. Note that changes to the metadata even for minor updates like updating the
 *         jetVersion should result in at least a minor component version change, e.g. 1.0.0 -> 1.0.1.</td>
 *     </tr>
 *     <tr>
 *       <td class="name">jetVersion</td>
 *       <td>no</td>
 *       <td>{string}</td>
 *       <td>The <a href="http://semver.org/">semantic version</a> of the supported JET version(s).
 *         JET Component authors should not specify a semantic version range that includes unreleased JET major versions
 *         as major releases may contain non backwards compatible changes.  Authors should instead recertify components
 *         with each major release and update the metadata or release a new version that is compatible with the new
 *         release changes.</td>
 *     </tr>
 *     <tr>
 *       <td class="name">bundles</td>
 *       <td>no</td>
 *       <td>{Object}</td>
 *       <td>Optional <a href="http://requirejs.org/docs/api.html#config-bundles">RequireJS-style bundles configuration</a> metadata that applies to
 *         JET Packs and JET Reference Components:
 *           <ul>
 *             <li>JET Packs may contain bundles that consist of multiple AMD modules (for example, each component could be packaged as a separate module).</li>
 *             <li>JET Reference Components may refer to 3rd party packages that include AMD-style bundles.</li>
 *           </ul>
 *         This configuration metadata allows RequireJS to map individual module names to the containing bundle.
 *         <p>The configuration object has the following properties:
 *            <table class="params">
 *              <thead>
 *                <tr>
 *                  <th>Key</th>
 *                  <th>Type</th>
 *                  <th>Description</th>
 *                </tr>
 *              </thead>
 *              <tbody>
 *                <tr>
 *                  <td class="name"><i>[bundle name]</i></td>
 *                  <td>{Array&lt;{string}>}</td>
 *                  <td>An array of module names contained within the specified bundle.</td>
 *                </tr>
 *              </tbody>
 *            </table>
 *            </br>
 *            Both the bundle names and the module names must correspond to paths that RequireJS is capable of loading.  This typically means prefixing these names
 *            with a prefix that is known to be path-mapped, such as:
 *              <ul>
 *                <li>the <code>pack</code> name for JET Packs</li>
 *                <li>some path that is specified by a JET Reference Component's <code>paths</code> metadata</li>
 *              </ul>
 *            Tools that consume JET Packs or JET Reference Components should merge the component.json <code>bundles</code> property into the application’s RequireJS config
 *            at build time, thus allowing the application to run against the bundled artifacts.
 *         </p>
 *         <h6>Example:</h6>
 *         Assuming we have an “oj-foo” JET Pack that defines two bundles, the bundles property might be configured as follows:
 *  <pre class="prettyprint"><code>
 *  "bundles":
 *    {"oj-foo/some-bundle":
 *       ["oj-foo/component-one/loader", "oj-foo/component-two/loader"],
 *     "oj-foo/another-bundle":
 *       ["oj-foo/component-three/loader", "oj-foo/component-four/loader"],
 *    }
 *  </code></pre>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td class="name">dependencies</td>
 *       <td>no</td>
 *       <td>{Object}</td>
 *       <td>Dependency to semantic version mapping for JET Component dependencies.
 *         <h6>Example:</h6>
 *         <pre class="prettyprint"><code>dependencies:  {"oj-foo-composite1": "1.2.0", "oj-foo-composite2": "^2.1.0"}</code></pre>
 *         <h6>Note:</h6>
 *           <ul>
 *             <li>Always use the <b>full name</b> of the component when declaring a dependency upon it.</li>
 *             <li>JET Packs use their <code>dependencies</code> metadata to specify the <b>exact</b> semantic versions of the JET Custom Components, JET Reference Components,
 *               and JET Resource Components that constitute the JET Pack – consequently, semantic version ranges are <b><i>not</i></b> permitted in JET Packs.</li>
 *             <li>JET Packs do not support nesting – in other words a JET Pack may not declare a dependency upon another JET Pack.</li>
 *           </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td class="name">description</td>
 *       <td>no</td>
 *       <td>{string}</td>
 *       <td>A high-level description for the component.</td>
 *     </tr>
 *     <tr>
 *       <td class="name">displayName</td>
 *       <td>no</td>
 *       <td>{string}</td>
 *       <td>A user friendly, translatable name of the component.</td>
 *     </tr>
 *     <tr>
 *       <td class="name">extension</td>
 *       <td>no</td>
 *       <td>{Object}</td>
 *       <td>Placeholder for Extension metadata.  Each section is identified by a key that specifies the downstream tool that will process this metadata.
 *         <h6>For example:</h6>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Name</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="name">vbcs</td>
 *               <td>{string}</td>
 *               <td>Indentifies an object with VBCS-specific metadata</td>
 *             </tr>
 *           </tbody>
 *         </table>
 *         </br>
 *         Please consult the documentation for the downstream tool to determine what (if any) extension metadata is supported.
 *      </td>
 *     </tr>
 *     <tr>
 *       <td class="name">license</td>
 *       <td>no</td>
 *       <td>{string}</td>
 *       <td>A reference to the license under which use of the component is granted. The value can be:
 *         <ul>
 *           <li>the name of the license text file packaged with the component</li>
 *           <li>a URL to a remote license file</li>
 *         </ul>
 *         If unspecified, downstream consumers can look for a default, case-insensitive license file at the root of the component package.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td class="name">pack</td>
 *       <td>no</td>
 *       <td>{string}</td>
 *       <td>Identifies the component as belonging to the specified JET Pack.
 *         <p>A JET Pack is a versioned set of JET Components with additional metadata that enables applications to easily install and configure path mappings to the artifacts in that JET Pack.
 *           <ul>
 *             <li>If specified, then there should exist a JET Pack whose name is the <code>pack</code> value, and which lists this component's <b>full name</b> in its
 *               <code>dependencies</code> metadata.</li>
 *             <li>If unspecified, then this is a standalone JET Component that is not a member of any JET Pack.</li>
 *             <li>JET Packs do not supported nesting and are therefore, by definition, standalone JET Components.</li>
 *           </ul>
 *         </p>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td class="name">package</td>
 *       <td>no</td>
 *       <td>{string}</td>
 *       <td>This metadata property is only valid for JET Reference Components, where it is a <b>REQUIRED</b> property.
 *         <p>Specifies the name of the AMD-compatible <a href="https://www.npmjs.com/">npm</a> package that is referenced by this component.  This is needed to allow the consuming application
 *           to identify the 3rd party library, for conflict resolution purposes as well as for security scanning and patching.
 *         </p>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td class="name">paths</td>
 *       <td>no</td>
 *       <td>{Object | Array&lt;{Object}>}</td>
 *       <td>Specifies path metadata that is used to generate RequireJS path mappings.
 *         <p>Each object is defined as follows:</p>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Key</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="name">npm</td>
 *               <td>{Object}</td>
 *               <td>Specifies paths to use when configuring a path mapping to an npm package.  <b>This is only valid for JET Reference Components.</b>  At least one of the
 *                 following sub-properties must be specified:
 *                 <table class="params">
 *                   <thead>
 *                     <tr>
 *                       <th>Key</th>
 *                       <th>Type</th>
 *                       <th>Description</th>
 *                     </tr>
 *                   </thead>
 *                   <tbody>
 *                     <tr>
 *                       <td class="name">min</td>
 *                       <td>{string}</td>
 *                       <td>Path to the optimized form of the library, relative to the root of the npm package.</td>
 *                     </tr>
 *                     <tr>
 *                       <td class="name">debug</td>
 *                       <td>{string}</td>
 *                       <td>Path to the debug form of the library, relative to the root of the npm package.</td>
 *                     </tr>
 *                   </tbody>
 *                 </table>
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name">cdn</td>
 *               <td>{Object}</td>
 *               <td>Specifies url-based paths to use when configuring a path mapping to a CDN-hosted artifact.  It is strongly recommended that urls be specified with <code>https:</code>,
 *                 as this is required for HTTP/2 and the consuming app may be configured to disallow non-secure urls.  At least one of the following sub-properties must be specified:
 *                 <table class="params">
 *                   <thead>
 *                     <tr>
 *                       <th>Key</th>
 *                       <th>Type</th>
 *                       <th>Description</th>
 *                     </tr>
 *                   </thead>
 *                   <tbody>
 *                     <tr>
 *                       <td class="name">min</td>
 *                       <td>{string}</td>
 *                       <td>The full url to the location of the optimized form of the artifact.</td>
 *                     </tr>
 *                     <tr>
 *                       <td class="name">debug</td>
 *                       <td>{string}</td>
 *                       <td>The full url to the location of the debug form of the artifact.</td>
 *                     </tr>
 *                   </tbody>
 *                 </table>
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name">name</td>
 *               <td>{string}</td>
 *               <td>Optional value to use on the left hand side of the RequireJS path mapping when installing a JET Reference Component into an application. If not specified,
 *                 then the name defaults to the value of the <code>package</code> property, excluding any <a href="https://docs.npmjs.com/misc/scope">scope</a>.</td>
 *             </tr>
 *           </tbody>
 *         </table>
 *         <h6>Notes:</h6>
 *         <ul>
 *           <li>If the <code>paths</code> value is an array, then each array item is of the type described above.  When an array is specified, each element must resolve to a unique value
 *             for the <code>name</code> property.  (In practical terms, that means that only one element in the array can leverage the <code>package</code> property value for its default
 *             <code>name</code> value.)</li>
 *           <li>In addition to its use for JET Reference Components, <code>paths</code> is also valid for JET Packs and JET Resource Components <b>with the following restrictions</b>:
 *             <ol>
 *               <li>Only a single path mapping is allowed (in other words, the value cannot be an array);</li>
 *               <li>The <code>name</code> sub-property is ignored – the left hand side of the RequireJS path mapping always defaults to the JET Pack or JET Resource Component <code>name</code>
 *                 property value;</li>
 *               <li>The <code>npm</code> sub-property is ignored – JET Packs and JET Resource Components can leverage the <code>cdn</code> sub-property to configure loading those artifacts
 *                 at runtime from a CDN;</li>
 *               <li>The information in the <code>paths</code> property is ignored for JET Resource Components that are part of a JET Pack – only the JET Pack itself will be path mapped.</li>
 *             </ol>
 *           </li>
 *         </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td class="name">type</td>
 *       <td>no</td>
 *       <td>{"composite" | "core" | "pack" | "reference" | "resource"}
 *         <p><b>Default:</b>&nbsp;&nbsp;"composite"</p>
 *       </td>
 *       <td>Identifies the type of this JET Component.
 *         <p>Supported values are:</p>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Value</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="name">composite</td>
 *               <td>Identifies the component as a <a href="ComponentTypeOverview.html#customcomponents">custom JET Web Component</a>, also known as a "Composite Component".
 *                 <b>This is the default, if <code>type</code> is unspecified.</b></td>
 *             </tr>
 *             <tr>
 *               <td class="name">core</td>
 *               <td>Identifies the component as a <a href="ComponentTypeOverview.html#corecomponents">JET Web Component</a> that is bundled with a particular version of JET.</td>
 *             </tr>
 *             <tr>
 *               <td class="name">pack</td>
 *               <td>Identifies the component as a <a href="ComponentTypeOverview.html#componentpacks">JET Component Pack</a>, or <b>JET Pack</b>.  A JET Pack is a versioned set
 *                 of JET Web Components with additional metadata that enables applications to easily install and configure path mappings to the artifacts in that JET Pack.
 *                 <p>The <code>dependencies</code> metadata property is used to specify the versioned components that make up the JET Pack.</p></td>
 *             </tr>
 *             <tr>
 *               <td class="name">reference</td>
 *               <td>Identifies the component as a <a href="ComponentTypeOverview.html#referencecomponents">JET Reference Component</a>, which describes a versioned external 3rd party library.
 *                 <p>A JET Reference Component can be referenced in the <code>dependencies</code> metadata of a JET Pack, a JET Resource Component, or an individual JET Web Component.</p>
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name">resource</td>
 *               <td>Identifes the component as a <a href="ComponentTypeOverview.html#resourcecomponents">JET Resource Component</a>, which describes a versioned set of shared resources
 *                 (such as shared CSS, JavaScript base classes & utility code, icons, translation bundles, etc.)
 *                 <p>A JET Resource Component can be referenced in the <code>dependencies</code> metadata of a JET Pack, another JET Resource Component, or an individual JET Web Component.</p>
 *               </td>
 *             </tr>
 *           </tbody>
 *         </table>
 *         <p>Metadata for JET Web Components are described in more detail in the <a href="MetadataOverview.html">JET Metadata</a> topic.</p>
 *      </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment componentPackOverviewDoc
 * @memberof ComponentPackOverview
 */

/**
 * @ojoverviewdoc ComponentTypeOverview - [1]JET Component Types
 * @classdesc
 * {@ojinclude "name":"componentTypeOverviewDoc"}
 */
/**
 * <h2 id="usage">Overview
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h2>
 * <p>
 *  JET Components are used to develop enterprise web applications.  In addition to offering Web Components, implemented as
 *  <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements">HTML custom elements</a>, JET supports
 *  other component types that help both producers and consumers package, install, and configure a set of related Web Components along
 *  with their dependencies and shared resources.  The full set of JET Component types are described below.
 * </p>
 *
 * <h2 id="corecomponents">JET Core Components
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#corecomponents"></a>
 * </h2>
 * <p>
 * <b>JET Core Components</b> are Web Components that are packaged and delivered with a particular release of JET.  These include standard
 * <a href="CustomElementOverview.html">custom element</a> widgets like buttons, input controls, data collection controls, data visualization controls, etc.
 * </p>
 * <p>
 * See <a href="MetadataOverview.html">JET Metadata</a> for a discussion of the metadata structures that describe JET Web Components.
 * </p>
 *
 * <h2 id="customcomponents">JET Custom Components
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#customcomponents"></a>
 * </h2>
 * <p>
 * <b>JET Custom Components</b> are Web Components, typically developed, packaged, and distributed by other development teams, built on top of the JET Composite
 * Component Architecture.  These are also known as <a href="CompositeOverview.html">composite components</a>.
 * </p>
 * <p>
 * See <a href="MetadataOverview.html">JET Metadata</a> for a discussion of the metadata structures that describe JET Web Components.
 * </p>
 *
 * <h2 id="componentpacks">JET Component Packs
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#componentpacks"></a>
 * </h2>
 * <p>
 * <b>JET Component Packs, or JET Packs</b>, define versioned sets of JET Web Components that can be managed, packaged, and delivered as a whole.  JET Packs
 * consist of metadata and additional artifacts that allow downstream consumers to automate the configuration and initialization of deployed applications that are built
 * with these Components, including shared resources (e.g., CSS resources, utility JavaScript files, base JavaScript classes extended by multiple Web Components, etc.),
 * and information about 3rd party packages.
 * </p>
 * <p>
 * See <a href="ComponentPackOverview.html">JET Pack Metadata</a> for a discussion of the metadata structures that describe JET Packs and other components that manage
 * dependencies and shared resources.
 * </p>
 *
 * <h2 id="referencecomponents">JET Reference Components
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#referencecomponents"></a>
 * </h2>
 * <p>
 * <b>JET Reference Components</b> define a versioned external 3rd party library dependency – JET Packs, JET Resource Components, and individual JET Web Components can include
 * a JET Reference Component as part of their <code>dependencies</code> metadata.  JET Reference Components consist of metadata for automating the installation of the corresponding AMD-compatible
 * 3rd party library, as well as the necessary RequireJS configuration for calling into this 3rd party library from a deployed JET application.
 * </p>
 * <p>
 * See <a href="ComponentPackOverview.html">JET Pack Metadata</a> for a discussion of the JET Reference Component metadata structure.
 * </p>
 *
 * <h2 id="resourcecomponents">JET Resource Components
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#resourcecomponents"></a>
 * </h2>
 * <p>
 * <b>JET Resource Components</b> define and package resources shared by a set of JET components – JET Packs, other JET Resource Components, and individual JET Web Components can include
 * a JET Resource Component as part of their <code>dependencies</code> metadata.  Shared resources can include shared CSS, JavaScript base classes & utility code, icons, translation bundles, etc.
 * </p>
 * <p>
 * See <a href="ComponentPackOverview.html">JET Pack Metadata</a> for a discussion of the JET Resource Component metadata structure.
 * </p>
 *
 * @ojfragment componentTypeOverviewDoc
 * @memberof ComponentTypeOverview
 */

/**
 * @ojoverviewdoc CompositeOverview - [3]JET Custom Components
 * @classdesc
 * {@ojinclude "name":"compositeOverviewDoc"}
 */

/**
 * <h2 id="usage">Overview
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h2>
 * <p>
 *  JET allows developers to create custom Web Components which can be composites of other components, HTML, JavaScript, or CSS.
 *  These reusable pieces of UI can be embedded as <a href="CustomElementOverview.html">custom HTML elements</a> and are
 *  registered using the <a href="oj.Composite.html">Composite API</a>. These custom Web Components will be referred to
 *  as "composites" throughout the rest of this doc.
 * </p>
 *
 * <h2 id="usage">Using a Composite
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#usage"></a>
 * </h2>
 * <p>
 *   Once registered within a page, a composite component can be used in the DOM as a custom HTML element like in the example below.
 *   A composite element will be recognized by the framework only after its module is loaded by the application. Once the element is
 *   recognized, the framework will register a busy state for the element and will begin the process of 'upgrading' the element.
 *   The element will not be ready for interaction (e.g. retrieving properties or calling methods) until the upgrade process is
 *   complete with the exception of property setters and the setProperty and setProperties methods.
 *   The application should listen to either the page-level or an element-scoped BusyContext before attempting to interact with
 *   any JET custom elements. See the <a href="oj.BusyContext.html">BusyContext</a> documentation on how BusyContexts can be scoped.
 * </p>
 * <pre class="prettyprint"><code>
 * &lt;my-chart type="bubble" data="{{dataModel}}">&lt;/my-chart>
 * </code></pre>
 * <p>
 *   The upgrade of JET composite elements relies on any data binding resolving, the management of which is done by a binding provider.
 *   The binding provider is responsible for setting and updating attribute expressions and any custom elements within its managed
 *   subtree will not finish upgrading until it applies bindings on that subtree. By default, there is a single binding provider for a page,
 *   but subtree specific binding providers can be added by using the <code>data-oj-binding-provider</code> attribute with values of
 *   "none" and "knockout". The default binding provider is knockout, but if a page or DOM subtree does not use any expression syntax or
 *   knockout, the application can set <code>data-oj-binding-provider="none"</code> on that element so its dependent JET composite custom
 *   elements do not need to wait for bindings to be applied to finish upgrading.
 * </p>
 * <p>
 *  Since a composite is registered as a custom HTML element, the same set of rules for attribute/property setting, data binding,
 *  method access, slotting, and event listening that apply to JET custom elements apply to composites. Please see the general
 *  <a href="CustomElementOverview.html">JET Component Overview</a> documentation to for more details.
 * </p>
 *
 * <h2 id="writing">Writing a Composite
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#writing"></a>
 * </h2>
 *
 * <h3 id="registration">Packaging and Registration
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#registration"></a>
 * </h3>
 * <p>
 * Composite components should be packaged as a standalone module in a folder matching the tag name it will be registered with, e.g. 'my-chart'.
 * An application would use a composite by requiring it as a module, e.g. 'jet-composites/my-chart/loader'. The composite module could be
 * stored locally in the app which is the recommended approach, but could also be stored on a different server, or a CDN.  Note that there are
 * XHR restrictions when using the RequireJS text plugin which may need additional RequireJS config settings.  Please see the
 * <a href="https://github.com/requirejs/text#xhr-restrictions">text plugin documentation</a> for the full set of limitations and options.
 * By using RequireJS path mappings, the application can control where individual composites are loaded from.
 * See below for a sample RequireJS composite path configuration.
 *
 * Note that the 'jet-composites/my-chart' mapping is only required if the 'my-chart' composite module maps to a folder other than
 * 'someSubFolder/jet-composites/my-chart' using the configuration below.
 * <pre class="prettyprint"><code>
 * requirejs.config(
 * {
 *   baseUrl: 'js',
 *   paths:
 *   {
 *     'jet-composites': 'someSubFolder/jet-composites',
 *     'jet-composites/my-chart': 'https://someCDNurl',
 *     'jet-composites/my-table': 'https://someServerUrl'
 *   }
 * }
 * </code></pre>
 * </p>
 *
 * <p>
 * All composite modules should contain a loader.js file which will handle registering and specifying the dependencies for a composite component.
 * We recommend using RequireJS to define your composite module with relative file dependencies.
 * Registration is done via the <a href="oj.Composite.html#register">Composite.register</a> API.
 * By registering a composite component, an application links an HTML tag with provided
 * Metadata, View, ViewModel and CSS which will be used to render the composite. These optional
 * pieces can be provided via a descriptor object passed into the register API. See below for sample loader.js file configurations.
 * </p>
 *
 * Note that in this example we are using require-css, a RequireJS plugin for loading css which will load the styles within our page
 * so we do not need to pass any css into the register call. This is the recommended way to load CSS, especially for cases
 * where the composite styles contain references to any external resources.
 * <pre class="prettyprint"><code>
 * define(['ojs/ojcomposite', 'text!./my-chart.html', './my-chart', 'text!./my-chart.json', 'css!./my-chart'],
 *   function(Composite, view, viewModel, metadata) {
 *     Composite.register('my-chart',
 *     {
 *       metadata: JSON.parse(metadata),
 *       view: view,
 *       viewModel: viewModel
 *     });
 *   }
 * );
 * </code></pre>
 *
 * This example shows how to register a custom parse function which will be called to parse attribute values defined in the metadata.
 * <pre class="prettyprint"><code>
 * define(['ojs/ojcomposite', 'text!./my-chart.html', './my-chart', 'text!./my-chart.json'],
 *   function(Composite, view, viewModel, metadata) {
 *     var myChartParseFunction = function(value, name, meta, defaultParseFunction) {
 *       // Custom parsing logic goes here which can also return defaultParseFunction(value) for
 *       // values the composite wants to default to the default parsing logic for.
 *       // This function is only called for non bound attributes.
 *     }
 *
 *     Composite.register('my-chart',
 *     {
 *       metadata: JSON.parse(metadata),
 *       view: view,
 *       viewModel: viewModel,
 *       parseFunction: myChartParseFunction
 *     });
 *   }
 * );
 * </code></pre>
 *
 * <h3 id="metadata">Metadata
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#metadata"></a>
 * </h3>
 * <p>
 *  Composite Metadata should be provided in a component.json file and contains information about the
 *  composite used at run time to wire properties accessors and methods on the custom element. The JET
 *  Metadata schema also allows composite authors to include information that would benefit a design time
 *  environment and is described in more detail in the <a href="MetadataOverview.html">Metadata Overview</a>
 *  doc.
 * </p>
 * <h4>Example of Run Time Metadata</h4>
 * <p>
 *  The JET framework will ignore "extension" fields. Extension fields cannot be defined at
 *  the first level of the "properties", "methods", "events", or "slots" objects.
 * </p>
 * <pre class="prettyprint"><code>
 * {
 *  "name": "demo-card",
 *  "version": "1.0.2",
 *  "jetVersion": ">=3.0.0 <5.0.0",
 *  "properties": {
 *    "currentImage" : {
 *      "type": "string",
 *      "readOnly": true
 *    },
 *    "images": {
 *      "type": "Array<string>"
 *    },
 *    "isShown": {
 *      "type": "boolean",
 *      "value": true
 *    }
 *  },
 *  "methods": {
 *    "nextImage": {
 *      "internalName": "_nextImg"
 *      "extension": "This is where a composite can store additional data."
 *    },
 *    "prevImage": {}
 *   },
 *   "events": {
 *     "cardclick": {}
 *   }
 * }
 * </code></pre>
 *
 * <h3 id="view">View
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#viewmodel"></a>
 * </h3>
 * <p>
 * The composite View is the template HTML that will be stamped into the DOM when bindings are applied to the composite.
 * </p>
 *
 * <h4 id="viewprops">View Variables
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#viewmodel"></a>
 * </h4>
 * <p>
 * The View has access to several '$' variables along with any public variables defined in the composite's ViewModel.
 * Public ViewModel variables can be accessed by referencing the variable names directly without needing to access them from another
 * object. The View's '$' variables are similar to what is available on context object passed to the composite ViewModel constructor
 * and are listed below.
 * <ul>
 *   <li>$properties: A map of the composite component's current properties and values.</li>
 *   <li>$slotCounts: A map of slot name to assigned nodes count for the View.</li>
 *   <li>$unique: A unique string that can be used for unique id generation.</li>
 *   <li>$uniqueId: The ID of the composite component if specified. Otherwise, it is the same as unique.</li>
 *   <li>$props: Deprecated since 5.0.0, use $properties instead. A Promise evaluating to the composite component's properties.</li>
 *   <li>$slotNodeCounts: Deprecated since 5.0.0, use $slotCounts instead. A Promise evaluating to a map of slot name to assigned nodes count for the View.</li>
 * </ul>
 * </p>
 *
 * <h4 id="slotting">Slotting
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#slotting"></a>
 * </h4>
 * <p>
 * The View can also contain slots where application provided DOM can go.
 * Complex composite components which can contain additional composites and/or content for child facets defined in its
 * associated View can be constructed via slotting. There are two ways to define a composite's slots, using either an
 * <a href="oj.ojBindSlot.html">oj-bind-slot</a> element or an <a href="oj.ojBindSlot.html">oj-bind-template-slot</a>
 * element to indicate that that slot's content will be stamped using an application provided template. See the relevant
 * slot API docs for more information.
 * </p>
 *
 * <h4 id="bindorder-section">
 *   Binding Order
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#bindorder-section"></a>
 * </h4>
 * <p>The following steps will occur when processing the binding for a composite component:
 * <ol>
 *  <li>Apply bindings to children using the composite component's binding context.</li>
 *  <li>Create a slot map assigning component child nodes to View slot elements.
 *    <ol>
 *      <li>At this point the component child nodes are removed from the DOM and live in the slot map.</li>
 *    </ol>
 *  </li>
 *  <li>Insert the View and apply bindings to it with the ViewModel's binding context.
 *    <ol>
 *      <li>The composite's children will be 'slotted' into their assigned View slots.</li>
 *      <li>The oj-bind-slot's slot attribute, which is "" by default, will override its assigned node's slot attribute.</li>
 *    </ol>
 *  </li>
 * </ol>
 * </p>
 *
 * <h3 id="viewmodel">ViewModel
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#viewmodel"></a>
 * </h3>
 * <p>
 * If a constructor function is provided at registration, a new instance of the ViewModel will be created for each composite element.
 * The ViewModel is where the composite's internal logic lives and can expose public variables that the View can bind to. The ViewModel
 * constructor is called with a <a href=#ViewModelContext>context</a> object that allows the ViewModel logic to access
 * the composite element, the current set of properties, and other keys.
 * </p>
 *
 * <h4 id="viewmodelprops">Interacting with Properties
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#viewmodelprops"></a>
 * </h4>
 * <p>
 * The ViewModel can access and update properties from the context.properties object. Any updates to context.properties will be interpreted
 * as an internal property change. This is where readOnly and writeback property updates can be done, e.g. context.properties.value = 'new value'.
 * Updates to properties on the composite element will be interpreted as coming from the application and updates to readOnly properties will
 * be blocked. These internal property updates will trigger [property]Changed events and can be differentiated from application triggered property
 * udpates using the updatedFrom field on the [property]Changed events. All ViewModel property updates will result in 'internal' set as
 * the updatedFrom field.
 * </p>
 * <p>
 * The context.properties object also has setProperty, getProperty, setProperties methods similar to the composite element. The
 * setProperty method should be used when updating subproperties so [property]Changed events are fired with the subproperty
 * field populated correctly.
 * </p>
 * <p>
 * The ViewModel can listen to property changes by registering a <a href="oj.Composite.html#ViewModel">propertyChanged</a> callback. The callback
 * is called with a <a href="oj.Composite.html#PropertyChangedContext">context</a> object that has the same set of properties as a [property]Changed
 * event. This listener will be called before the [property]Changed event is fired allowing the composite to react first.
 * </p>
 *
 * <h4 id="lifecycle">Lifecycle Callbacks
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#lifecycle"></a>
 * </h4>
 * <p>
 * A set of optional callback methods can be implemented on the ViewModel and will be called at each stage of the composite
 * lifecycle. These callbacks can be used to delay composite rendering, perform expensive actions like data fetches, and react
 * to property changes. To see the full set of lifecycle callbacks, see the <a href=oj.Composite.html#ViewModel>oj.Composite.ViewModel</a>
 * typedef for details.
 * </p>
 *
 * <h4 id="events">Firing Custom Events
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events"></a>
 * </h4>
 * <p>
 * If the composite needs to fire any events, it should done using the
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent">CustomEvent</a> constructor, which JET provides a
 * polyfill for on IE. Events should be documented in the metadata for design time environments.
 * </p>
 *
 * <h3 id="styling">CSS
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling"></a>
 * </h3>
 * <p>
 * Composite component styling can be done via provided CSS. The JET framework will add the <code>oj-complete</code> class to the composite DOM
 * element after metadata properties have been resolved. To prevent a flash of unstyled content before the composite properties have been setup,
 * the composite CSS can include the following rule to hide the composite until the <code>oj-complete</code> class is set on the element.
 * <pre class="prettyprint"><code>
 * my-chart:not(.oj-complete) {
 *   visibility: hidden;
 * }
 * </code></pre>
 * </p>
 *
 * <p>
 * Composite CSS will not be scoped to the composite component and selectors will need to be appropriately selective. We recommend scoping CSS classes
 * and prefixing class names with the composite name as seen in the example below. <b>Note that we do not recommend overriding JET component CSS.
 * Composites should only update JET component styling via SASS variables.</b>
 * <pre class="prettyprint"><code>
 * my-chart .my-chart-text {
 *   color: white;
 * }
 * </code></pre>
 * </p>
 *
 * @ojfragment compositeOverviewDoc
 * @memberof CompositeOverview
 */

/**
 * @ojoverviewdoc MetadataOverview - [4]JET Metadata
 * @classdesc
 * {@ojinclude "name":"metadataOverviewDoc"}
 */

/**
 * <h2 id="usage">Overview
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h2>
 * <p>
 *  Metadata for a JET Web Component consists of a JSON formatted object which defines the properties, methods, slots, and events fired by the
 *  Web Component. <b>The names of the Web Component's properties, event listeners, and methods should avoid collision with the existing
 *  <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement">HTMLElement</a> properties, event listeners, and methods.
 *  Additionally, the Web Component should not re-define any
 *  <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes">global attributes</a> or events.</b>
 * </p>
 *
 * <p>
 *  The Metadata JSON object should have the following required properties: "name", "version", "jetVersion" and
 *  the following optional properties: "description", "dependencies", "icon", "displayName", "properties", "methods", "events", or "slots".
 *  See the tables below for descriptions of these properties. The Metadata can be extended by appending any extra information in an "extension"
 *  field except at the first level of the "properties", "methods", "events" or "slots" objects. Any metadata in an extension field will be ignored.
 * </p>
 *
 * <p>
 *  Keys defined in the "properties" top level object should map to the JET Web Component's properties following
 *  the same naming convention described in the <a href="CustomElementOverview.html#ce-proptoattr-section">Property-to-Attribute mapping</a> section.
 *  Non expression bound Web Component attributes will be correctly evaluated only if they are a primitive JavaScript type (boolean, number, string)
 *  or a JSON object. Note that JSON syntax requires that strings use double quotes. Attributes evaluating to any other types must be bound via expression syntax.
 *  Boolean attributes are considered true if set to the case-insensitive attribute name, the empty string or have no value assignment.
 *  JET Web Components will also evalute boolean attributes set explicitly to 'true' or 'false' to their respective boolean values. All other values are invalid.
 * </p>
 *
 * <p>
 *  Not all information provided in the Metadata is required at run time and those not indicated to be required at run time in the tables
 *  below can be omitted to reduce the Metadata download size. Any non run time information can be used for design time tools and property editors and could
 *  be kept in a separate JSON file which applications can use directly or merge with the run time metadata as needed, but would not be required by the loader.js
 *  file. For methods and events, only the method/event name is required at run time.
 * </p>
 *
 * <p>
 *  Note that every release of JET includes a <code>'metadata/components'</code> directory with JSON files for each Web Component that is bundled
 *  as part of that release.  Web Components that are bundled as part of a JET release are also referred to as <b>JET Core Components</b>.  These
 *  JSON files use the exact same metadata structure as those that are packaged with <b>JET Custom Components</b> (also known as
 *  <a href="CompositeOverview.html">composite components</a>), such that design time tools and property editors can leverage the same metadata
 *  when integrating any JET Web Component into their environments.
 * </p>
 *
 * <h2 id="structure">Metadata Structure
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#structure"></a>
 * </h2>
 * <h3 id="top">Top Level Keys
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#top"></a>
 * </h3>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Used at Runtime</th>
 *       <th>Required</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="rt">name</td>
 *       <td>yes</td>
 *       <td>yes</td>
 *       <td>{string}</td>
 *       <td>The component name.
 *           The component name must meet the following requirements (based upon the <a href="https://www.w3.org/TR/custom-elements/#custom-elements-core-concepts">W3C Custom Element spec</a>):
 *           <ul>
 *             <li>The name can include only letters, digits, '-', and '_'.</li>
 *             <li>The letters in the name should be all lowercase.
 *             <li>The name cannot be one of the following reserved names:
 *             <ul>
 *               <li>annotation-xml
 *               <li>color-profile
 *               <li>font-face
 *               <li>font-face-src
 *               <li>font-face-uri
 *               <li>font-face-format
 *               <li>font-face-name
 *               <li>missing-glyph
 *             </ul>
 *           </ul>
 *           <h6>Note:</h6>
 *           The <b>full name</b> of a component consists of its <code>pack</code> metadata value (if specified) and its <code>name</code> metadata
 *           value, appended together with a hyphen separating them:&nbsp;&nbsp;<code><i>[pack_value]</i>-<i>[name_value]</i></code>.
 *           <b>This full name corresponds to the Component's custom element tag name</b>.  The names of standalone JET Components that are
 *           <b>not</b> members of a <a href="ComponentPackOverview.html">JET Pack</a> have the following additional requirements:
 *           <ul>
 *             <li>At least one hyphen is required.</li>
 *             <li>The first segment (up to the first hyphen) is a namespace prefix. <b>The namespace prefix 'oj' is reserved for components that are
 *               bundled with the JET release.</b></li>
 *             <li>The first hyphen must be followed by at least one character.</li>
 *           <ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td class="rt">version</td>
 *       <td>yes</td>
 *       <td>yes</td>
 *       <td>{string}</td>
 *       <td>The component version. Note that changes to the metadata even for minor updates like updating the
 *         jetVersion should result in at least a minor component version change, e.g. 1.0.0 -> 1.0.1.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">jetVersion</td>
 *       <td>yes</td>
 *       <td>yes</td>
 *       <td>{string}</td>
 *       <td>The <a href="http://semver.org/">semantic version</a> of the supported JET version(s).
 *         JET Component authors should not specify a semantic version range that includes unreleased JET major versions
 *         as major releases may contain non backwards compatible changes. Authors should instead recertify components
 *         with each major release and update the metadata or release a new version that is compatible with the new
 *         release changes.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">properties</td>
 *       <td>yes</td>
 *       <td>no</td>
 *       <td>{Object<string,<string>}</td>
 *       <td>See <a href="#properties">Properties</a> table below for details.</td>
 *     </tr>
*     <tr>
 *       <td class="rt">methods</td>
 *       <td>yes</td>
 *       <td>no</td>
 *       <td>{Object<string,<string>}</td>
 *       <td>See <a href="#methods">Methods</a> table below for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">events</td>
 *       <td>yes</td>
 *       <td>no</td>
 *       <td>{Object<string,<string>}</td>
 *       <td>See <a href="#events">Events</a> table below for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">slots</td>
 *       <td>yes</td>
 *       <td>no</td>
 *       <td>{Object<string,<string>}</td>
 *       <td>See <a href="#slots">Slots</a> table below for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>compositeDependencies</code></td>
 *       <td>no</td>
 *       <td>no</td>
 *       <td>{Object<string, string>}</td>
 *       <td>Dependency to semantic version mapping for composite dependencies.
 *         3rd party libraries should not be included in this mapping.
 *         <code>{"composite1": "1.2.0", "composite2": ">=2.1.0"}</code>
 *         <p><b><i>This metadata property is deprecated as of JET 5.0.0.</i></b>  Please use the "dependencies" metadata property instead.</p>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>dependencies</code></td>
 *       <td>no</td>
 *       <td>no</td>
 *       <td>{Object<string, string>}</td>
 *       <td>Dependency to semantic version mapping for JET Component dependencies.
 *         3rd party libraries should not be included directly in this mapping; instead, define the 3rd party library with a
 *         <a href="ComponentTypeOverview.html#referencecomponents">JET Reference Component</a> and include the dependency upon that Reference Component.
 *         <h6>Example:</h6>
 *         <pre class="prettyprint"><code>dependencies:  {"oj-foo-composite1": "1.2.0", "oj-foo-composite2": "^2.1.0"}</code></pre>
 *         <h6>Note:</h6>
 *         <ul>
 *           <li>Always use the <b>full name</b> of the component when declaring a dependency upon it.</li>
             <li>Dependencies upon JET Custom Components, JET Reference Components, and JET Resource Components may use semantic version range syntax to specify the range of versions
               that are acceptable to fulfill the dependency requirement.</li>
 *         </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>description</code></td>
 *       <td>no</td>
 *       <td>no</td>
 *       <td>{string}</td>
 *       <td>A high-level description for the component.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>displayName</code></td>
 *       <td>no</td>
 *       <td>no</td>
 *       <td>{string}</td>
 *       <td>A user friendly, translatable name of the component.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>extension</code></td>
 *       <td>no</td>
 *       <td>no</td>
 *       <td>{Object}</td>
 *       <td>Placeholder for Extension metadata.  Each section is identified by a key that specifies the downstream tool that will process this metadata.
 *         <h6>For example:</h6>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Name</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="name"><code>vbcs</code></td>
 *               <td>{string}</td>
 *               <td>Indentifies an object with VBCS-specific metadata</td>
 *             </tr>
 *           </tbody>
 *         </table>
 *         </br>
 *         Please consult the documentation for the downstream tool to determine what (if any) extension metadata is supported.
 *      </td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>help</code></td>
 *       <td>no</td>
 *       <td>no</td>
 *       <td>{string}</td>
 *       <td>Specifies a URL to detailed API documentation for this component.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>icon</code></td>
 *       <td>no</td>
 *       <td>no</td>
 *       <td>{Object}</td>
 *       <td>One or more optional images for representing the component within a design time environment's component palette. The object has the following properties:
 *         <h6>Properties</h6>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Name</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="name"><code>iconPath</code></td>
 *               <td>{string}</td>
 *               <td>A relative path to the default (enabled) icon.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>selectedIconPath</code></td>
 *               <td>{string}</td>
 *               <td>A relative path to the icon that represents the selected state of the component.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>hoverIconPath</code></td>
 *               <td>{string}</td>
 *               <td>A relative path to the icon that represents the hover state of the component.</td>
 *             </tr>
 *           </tbody>
 *         </table>
 *      </td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>license</code></td>
 *       <td>no</td>
 *       <td>no</td>
 *       <td>{string}</td>
 *       <td>A reference to the license under which use of the component is granted.  The value can be:
 *         <ul>
 *           <li>the name of the license text file packaged with the component</li>
 *           <li>a URL to a remote license file</li>
 *         </ul>
 *         If unspecified, downstream consumers can look for a default, case-insensitive license file at the root of the component package.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td class="name">pack</td>
 *       <td>no</td>
 *       <td>no</td>
 *       <td>{string}</td>
 *       <td>Identifies the component as belonging to the specified JET Component Pack, or <b>JET Pack</b>.
 *         <p>A <a href="ComponentPackOverview.html">JET Pack</a> is a versioned set of JET Components with additional metadata that enables
 *           applications to easily install and configure path mappings to the components and shared resources in that JET Pack.
 *           <ul>
 *             <li>If specified, then there should exist a JET Pack whose name is the <code>pack</code> value, and which lists this component's <b>full name</b> in its
 *               <code>dependencies</code> metadata.</li>
 *             <li>If unspecified, then this is a standalone JET Component that is not a member of any JET Pack.</li>
 *           </ul>
 *         </p>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>propertyLayout</code></td>
 *       <td>no</td>
 *       <td>no</td>
 *       <td>{Array<{Object}>}</td>
 *       <td>An optional ordered array of one or more <b><i>propertyLayoutGroup</i></b> objects.  A propertyLayoutGroup enables a component author to order
 *           and shape the groupings of their properties in the design time environment for their component.  Each propertyLayoutGroup object is defined as follows:
 *         <h6>Properties</h6>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Name</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="name"><code>propertyGroup</code></td>
 *               <td>{string}</td>
 *               <td>The property group name associated with this propertyLayoutGroup.  Reserved values include:
 *                 <ul>
 *                   <li><code>"common"</code> - an ordered group of properties that are commonly used for configuring this
 *                       component, so they should be prominently highlighted and the design time environment should provide
 *                       extra assistance</li>
 *                   <li><code>"data"</code> - an ordered group of properties associated with data binding</li>
 *                 </ul>
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>displayName</code></td>
 *               <td>{string}</td>
 *               <td>An optional user friendly, translatable name for this propertyLayoutGroup.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>items</code></td>
 *               <td>{Array<{string | Object}>}</td>
 *               <td>An ordered array of one or more items in this propertyLayoutGroup:
 *                 <ul>
 *                   <li>Items of type {string} represent the names of component properties or sub-properties.</li>
 *                   <li>Items of type {Object} represent a nested layout structure.</li>
 *                 </ul>
 *               </td>
 *             </tr>
 *           </tbody>
 *         </table>
 *         <h6>Notes</h6>
 *         <ul>
 *           <li>Component authors are <b>not</b> required to map all of their properties within their component's <code>propertyLayout</code> object.
 *               Design time environments are expected to implement designs that enable access to both mapped and unmapped properties.</li>
 *           <li>Nested propertyLayoutGroups enable support for design time environments that expose collapsible sections of related properties –
 *               in which case, a section heading is suggested by that propertyLayoutGroup's <code>displayName</code>.</li>
 *           <li>If the design time environment does not support nested property groupings, then the assumption is that
 *               nested propertyLayoutGroups will be inlined within their common parent propertyLayoutGroup.</li>
 *         </ul>
 *         <h6>Example</h6>
 *         A typical Property Inspector layout for the oj-input-text component might look as follows:
 *  <pre class="prettyprint"><code>
 *  "propertyLayout":
 *    [
 *      {
 *        "propertyGroup": "common",
 *        "displayName": "Common",
 *        "items": ["labelHint", "placeholder", "required", "disabled", "readonly"]
 *      },
 *      {
 *        "propertyGroup": "data",
 *        "displayName": "Data",
 *        "items": ["value"]
 *      }
 *    ]
 *  </code></pre>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>styleClasses</code></td>
 *       <td>no</td>
 *       <td>no</td>
 *       <td>{Array.<{Object}>}</td>
 *       <td>Optional array of groupings of style class names that are applicable to this component.  Each grouping object has the following properties:
 *         <h6>Properties</h6>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Name</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="name"><code>styleGroup</code></td>
 *               <td>{Array.<{string}>}</td>
 *               <td>Array of mutually exclusive style class names that belong to this group.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>description</code></td>
 *               <td>{string}</td>
 *               <td>A translatable high-level description for this group of styleClasses.</td>
 *             </tr>
 *           </tbody>
 *         </table>
 *      </td>
 *     </tr>
 *     <tr>
 *       <td class="name">type</td>
 *       <td>no</td>
 *       <td>no</td>
 *       <td>{"composite" | "core" | "pack" | "reference" | "resource"}
 *         <p><b>Default:</b>&nbsp;&nbsp;"composite"</p>
 *       </td>
 *       <td>Identifies the type of this JET Component.
 *         <p>Supported values are:</p>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Value</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="name">composite</td>
 *               <td>Identifies the component as a <a href="ComponentTypeOverview.html#customcomponents">custom JET Web Component</a>, also known as a "Composite Component".
                   <b>This is the default, if <code>type</code> is unspecified.</b></td>
 *             </tr>
 *             <tr>
 *               <td class="name">core</td>
 *               <td>Identifies the component as a <a href="ComponentTypeOverview.html#corecomponents">JET Web Component</a> that is bundled with a particular version of JET.</td>
 *             </tr>
 *             <tr>
 *               <td class="name">pack</td>
 *               <td>Identifies the component as a <a href="ComponentTypeOverview.html#componentpacks">JET Component Pack</a>, or <b>JET Pack</b>.  A JET Pack is a versioned set
 *                 of JET Web Components with additional metadata that enables applications to easily install and configure path mappings to the artifacts in that JET Pack.
 *                 <p>The <code>dependencies</code> metadata property is used to specify the versioned components that make up the JET Pack.</p></td>
 *             </tr>
 *             <tr>
 *               <td class="name">reference</td>
 *               <td>Identifies the component as a <a href="ComponentTypeOverview.html#referencecomponents">JET Reference Component</a>, which describes a versioned external 3rd party library.
 *                 <p>A JET Reference Component can be referenced in the <code>dependencies</code> metadata of a JET Pack, a JET Resource Component, or an individual JET Web Component.</p>
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name">resource</td>
 *               <td>Identifes the component as a <a href="ComponentTypeOverview.html#resourcecomponents">JET Resource Component</a>, which describes a versioned set of shared resources
 *                 (such as shared CSS, JavaScript base classes & utility code, icons, translation bundles, etc.)
 *                 <p>A JET Resource Component can be referenced in the <code>dependencies</code> metadata of a JET Pack, another JET Resource Component, or an individual JET Web Component.</p>
 *               </td>
 *             </tr>
 *           </tbody>
 *         </table>
 *         <p>Metadata for JET Packs, JET Reference Components, and JET Resource Components are described in more detail in the <a href="ComponentPackOverview.html">JET Packs</a> topic.</p>
 *      </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="properties">Property Keys
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#properties"></a>
 * </h3>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Value</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>[property name]</code></td>
 *       <td>Object containing the following properties:
 *         <h6>Properties</h6>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Name</th>
 *               <th>Used at Runtime</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="rt">enumValues</td>
 *               <td>yes</td>
 *               <td>{Array<string>}</td>
 *               <td>An optional list of valid enum values for a string property. An error is thrown if a property value does not
 *                 match one of the provided enumValues.</td>
 *             </tr>
 *             <tr>
 *               <td class="rt">properties</td>
 *               <td>yes</td>
 *               <td>{Object}</td>
 *               <td>A nested properties object for complex properties. Subproperties exposed using nested properties objects in the metadata can
 *                 be set using dot notation in the attribute.
 *                 See the <a href="CustomElementOverview.html#ce-properties-subproperties-section">Subproperties</a> section for more details on
 *                 working with subproperties.</td>
 *             </tr>
 *             <tr>
 *               <td class="rt">readOnly</td>
 *               <td>yes</td>
 *               <td>{boolean}</td>
 *               <td>Determines whether a property can be updated outside of the ViewModel.
 *                 False by default. If readOnly is true, the property can only be updated by the ViewModel or by the
 *                 components within the composite component. This property only needs to be defined for the top level property,
 *                 with subproperties inheriting that value.</td>
 *             </tr>
 *             <tr>
 *               <td class="rt">type</td>
 *               <td>yes</td>
 *               <td>{string}</td>
 *               <td>The type of the property, following
 *                 <a href="https://developers.google.com/closure/compiler/docs/js-for-compiler#types">Google's Closure Compiler</a> syntax.
 *                 We will parse string, number, boolean, array and object types for non data-bound attributes, but will not provide
 *                 type checking for array and object elements. However, for documentation purposes, it may still be beneficial to provide
 *                 array and object element details using the Closure Compiler syntax.</td>
 *             </tr>
 *             <tr>
 *               <td class="rt">value</td>
 *               <td>yes</td>
 *               <td>{object}</td>
 *               <td>An optional default value for a property. For complex properties, the default value can be specified as an object for
 *                   top level property or at the leaf subproperty levels, but not both.</td>
 *             </tr>
 *             <tr>
 *               <td class="rt">writeback</td>
 *               <td>yes</td>
 *               <td>{boolean}</td>
 *               <td>Applicable when the application uses two way data binding to bind an expression to a property. If the property
 *                 is marked as writeback, the JET Web Component can directly update the value of the bound expression after a user interaction
 *                 like selection. False by default. This property only needs to be defined for the top level property, with subproperties
 *                 inheriting that value.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>description</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>A description for the property.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>displayName</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>A user friendly, translatable name of the property.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>eventGroup</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>Optional group name for this property's corresponding <b><i>[property]</i>Changed event</b> in a
 *                   design time environment.  Reserved values are:
 *                 <ul>
 *                   <li><code>"common"</code> - Applications will commonly want to react to changes to this property at runtime,
 *                     so its corresponding property change event should be prominently highlighted and the design time environment
 *                     should provide extra assistance.</li>
 *                 </ul>
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>exclusiveMaximum</code></td>
 *               <td>no</td>
 *               <td>{number}|{string}</td>
 *               <td>Validation metadata - specifies the <i>exclusive</i> high end of a possible range of values (e.g., "exclusiveMaximum": 1.0 → valid property value is <1.0). If the value is a string, then it is assumed to represent a dateTime value in the ISO 8601 extended date/time format.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>exclusiveMinimum</code></td>
 *               <td>no</td>
 *               <td>{number}|{string}</td>
 *               <td>Validation metadata - specifies the <i>exclusive</i> low end of a possible range of values (e.g., "exclusiveMinimum": 0.0 → valid property value is >0.0). If the value is a string, then it is assumed to represent a dateTime value in the ISO 8601 extended date/time format.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>extension</code></td>
 *               <td>no</td>
 *               <td>{Object}</td>
 *               <td>Placeholder for Extension metadata.  Each section is identified by a key that specifies the downstream tool that will process this metadata.
 *                 <h6>For example:</h6>
 *                 <table class="params">
 *                   <thead>
 *                     <tr>
 *                       <th>Name</th>
 *                       <th>Type</th>
 *                       <th>Description</th>
 *                     </tr>
 *                   </thead>
 *                   <tbody>
 *                     <tr>
 *                       <td class="name"><code>vbcs</code></td>
 *                       <td>{string}</td>
 *                       <td>Indentifies an object with VBCS-specific metadata</td>
 *                     </tr>
 *                   </tbody>
 *                 </table>
 *                 </br>
 *                 Please consult the documentation for the downstream tool to determine what (if any) extension metadata is supported.
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>format</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>Format hint for a primitive type that can be used for simple validation in the design time environment,
 *                   or to invoke a specialized customizer control or set of controls.  The following set of reserved format
 *                   keywords are supported:
 *                 <h6>{number} type formats</h6>
 *                 <table class="params">
 *                   <thead>
 *                     <tr>
 *                       <th>Keyword</th>
 *                       <th>Description</th>
 *                     </tr>
 *                   </thead>
 *                   <tbody>
 *                     <tr>
 *                       <td class="name"><code>double</code></td>
 *                       <td>floating point number with double precision</td>
 *                     </tr>
 *                     <tr>
 *                       <td class="name"><code>float</code></td>
 *                       <td>floating point number with single precision</td>
 *                     </tr>
 *                     <tr>
 *                       <td class="name"><code>int32</code></td>
 *                       <td>signed 32-bit integer</td>
 *                     </tr>
 *                     <tr>
 *                       <td class="name"><code>int64</code></td>
 *                       <td>signed 64-bit integer</td>
 *                     </tr>
 *                   </tbody>
 *                 </table>
 *                 <h6>{string} type formats</h6>
 *                 <table class="params">
 *                   <thead>
 *                     <tr>
 *                       <th>Keyword</th>
 *                       <th>Description</th>
 *                     </tr>
 *                   </thead>
 *                   <tbody>
 *                     <tr>
 *                       <td class="name"><code>binary</code></td>
 *                       <td>sequence of octets</td>
 *                     </tr>
 *                     <tr>
 *                       <td class="name"><code>byte</code></td>
 *                       <td>sequence of base64-encoded characters</td>
 *                     </tr>
 *                     <tr>
 *                       <td class="name"><code>color</code></td>
 *                       <td>CSS color value</td>
 *                     </tr>
 *                     <tr>
 *                       <td class="name"><code>date</code></td>
 *                       <td>date in RFC 3339 format, using the "full-date" profile</td>
 *                     </tr>
 *                     <tr>
 *                       <td class="name"><code>date-time</code></td>
 *                       <td>date-time in RFC 3339 format, using the "date-time" profile</td>
 *                     </tr>
 *                     <tr>
 *                       <td class="name"><code>email</code></td>
 *                       <td>Internet email address in RFC 5322 format</td>
 *                     </tr>
 *                     <tr>
 *                       <td class="name"><code>time</code></td>
 *                       <td>time in RFC 3339 format, using the "full-time" profile</td>
 *                     </tr>
 *                     <tr>
 *                       <td class="name"><code>password</code></td>
 *                       <td>hint to UIs to obscure input</td>
 *                     </tr>
 *                     <tr>
 *                       <td class="name"><code>uri</code></td>
 *                       <td>Uniform Resource Identifier in RFC 3986 format</td>
 *                     </tr>
 *                   </tbody>
 *                 </table>
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>help</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>Specifies a URL to detailed API documentation for this component property.  The value
 *                   can be either an absolute URL, or an anchor string to be appended at the end of the
 *                   Component-level <code>help</code> value after a hash ('&#x23') character.
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>maximum</code></td>
 *               <td>no</td>
 *               <td>{number}|{string}</td>
 *               <td>Validation metadata - specifies the <i>inclusive</i> high end of a possible range of values (e.g., "maximum": 1.0 → valid property value is <=1.0).
 *               If the value is a string, then it is assumed to represent a dateTime value in the ISO 8601 extended date/time format.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>minimum</code></td>
 *               <td>no</td>
 *               <td>{number}|{string}</td>
 *               <td>Validation metadata - specifies the <i>inclusive</i> low end of a possible range of values (e.g., "minimum": 0.0 → valid property value is >=0.0).
 *               If the value is a string, then it is assumed to represent a dateTime value in the ISO 8601 extended date/time format.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>pattern</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>Javascript regular expression that can be used to validate a string value at design time
 *                   <h6>Example:</h6>
 *                   To validate a string that matches the format of a U.S. Social Security number, you could specify the following:
 *                   <code>"pattern": "^\d{3}-?\d{2}-?\d{4}$"</code>
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>placeholder</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>User-friendly, translatable hint text that appears in an empty input field at design time.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>propertyEditorValues</code></td>
 *               <td>no</td>
 *               <td>{Object}</td>
 *               <td>Design time metadata that lists suggested property values, and optional information about each suggested value.
 *                   <p>Each key represents a suggested property value – if <code>enumValues</code> runtime metadata is specified, then
 *                   it is expected that some or all of the keys will match the values in the <code>enumValues</code> array.  Conversely,
 *                   the absence of <code>enumValues</code> runtime metadata indicates that the property can accept values in addition
 *                   to those suggested by its <code>propertyEditorValues</code> metadata.</p>
 *                   The corresponding value for each key is an Object with the following properties:
 *                   <h6>Properties</h6>
 *                   <table class="params">
 *                     <thead>
 *                       <tr>
 *                         <th>Name</th>
 *                         <th>Type</th>
 *                         <th>Description</th>
 *                       </tr>
 *                     </thead>
 *                     <tbody>
 *                       <tr>
 *                         <td class="name"><code>description</code></td>
 *                         <td>{string}</td>
 *                         <td>A translatable description for the value.</td>
 *                       </tr>
 *                       <tr>
 *                         <td class="name"><code>displayName</code></td>
 *                         <td>{string}</td>
 *                         <td>A displayable, translatable label for the value.</td>
 *                       </tr>
 *                       <tr>
 *                         <td class="name"><code>icon</code></td>
 *                         <td>{Object}</td>
 *                         <td>One or more optional images for representing the value. The object has the following properties:
 *                           <h6>Properties</h6>
 *                           <table class="params">
 *                             <thead>
 *                               <tr>
 *                                 <th>Name</th>
 *                                 <th>Type</th>
 *                                 <th>Description</th>
 *                               </tr>
 *                             </thead>
 *                             <tbody>
 *                               <tr>
 *                                 <td class="name"><code>iconPath</code></td>
 *                                 <td>{string}</td>
 *                                 <td>A relative path to the icon that represents the value.</td>
 *                               </tr>
 *                               <tr>
 *                                 <td class="name"><code>selectedIconPath</code></td>
 *                                 <td>{string}</td>
 *                                 <td>A relative path to the icon that represents the selected state of the value.</td>
 *                               </tr>
 *                               <tr>
 *                                 <td class="name"><code>hoverIconPath</code></td>
 *                                 <td>{string}</td>
 *                                 <td>A relative path to the icon that represents the hover state of the value.</td>
 *                               </tr>
 *                             </tbody>
 *                           </table>
 *                         </td>
 *                       </tr>
 *                     </tbody>
 *                   </table>
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>propertyGroup</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>Optional group name for this property in a design time environment.  Reserved values include:
 *                   <ul>
 *                     <li><code>"common"</code> - This property is commonly used for configuring this component,
 *                       so it should be prominently highlighted and the design time environment should provide
 *                       extra assistance.</li>
 *                     <li><code>"data"</code> - This property is commonly associated with data binding.</li>
 *                   </ul>
 *                   Nested group names can be specified using a period ('.') as a separator.  For example,
 *                   a Charting component can choose to prominently group properties relating to a business chart's
 *                   Legend with the <code>propertyGroup</code> specified as "common.legend"
 *                   <h6>Notes</h6>
 *                   <ul>
 *                     <li>Component authors are <b>not</b> required to map all of their properties to a particular
 *                         <code>propertyGroup</code>.  Design time environments are expected to implement designs
 *                         that enable access to both mapped and unmapped properties.</li>
 *                     <li>Component authors can optionally specify their preferred layout and ordering of component
 *                         properties within a <code>propertyGroup</code> by providing additional Component-level
 *                         <code>propertyLayout</code> metadata.</li>
 *                     <li>Conversely, if a property is mapped to a particular <code>propertyGroup</code> but
 *                         is <b>not</b> referenced in the corresponding <code>propertyLayout</code> metadata,
 *                         then its layout and ordering is undefined.</li>
 *                   </ul>
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>required</code></td>
 *               <td>no</td>
 *               <td>{boolean}</td>
 *               <td>Specifies whether the property must have a valid value at run time. False by default.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>translatable</code></td>
 *               <td>no</td>
 *               <td>{boolean}</td>
 *               <td>True if the <em>value</em> of this property (or its sub-properties, unless explicitly overridden)
 *                   is eligible to be_included_when application resources are translated for Internationalization. False by default.
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>units</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>User-friendly, translatable text string specifying what units are represented by a property value -- e.g., "pixels".</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>visible</code></td>
 *               <td>no</td>
 *               <td>{boolean}</td>
 *               <td>Specifies whether the property should be visible at design time. True by default.</td>
 *             </tr>
 *           </tbody>
 *         </table>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="methods">Method Keys
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#methods"></a>
 * </h3>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Value</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>[method name]</code></td>
 *       <td>Object containing the following properties:
 *         <h6>Properties</h6>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Name</th>
 *               <th>Used at Runtime</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="rt">internalName</td>
 *               <td>yes</td>
 *               <td>{string}</td>
 *               <td>An optional ViewModel method name that is different from, but maps to this method.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>description</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>A description for the method.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>displayName</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>A user friendly, translatable name of the method.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>extension</code></td>
 *               <td>no</td>
 *               <td>{Object}</td>
 *               <td>Placeholder for Extension metadata.  Each section is identified by a key that specifies the downstream tool that will process this metadata.
 *                 <h6>For example:</h6>
 *                 <table class="params">
 *                   <thead>
 *                     <tr>
 *                       <th>Name</th>
 *                       <th>Type</th>
 *                       <th>Description</th>
 *                     </tr>
 *                   </thead>
 *                   <tbody>
 *                     <tr>
 *                       <td class="name"><code>vbcs</code></td>
 *                       <td>{string}</td>
 *                       <td>Indentifies an object with VBCS-specific metadata</td>
 *                     </tr>
 *                   </tbody>
 *                 </table>
 *                 </br>
 *                 Please consult the documentation for the downstream tool to determine what (if any) extension metadata is supported.
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>help</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>Specifies a URL to detailed API documentation for this component method.  The value
 *                   can be either an absolute URL, or an anchor string to be appended at the end of the
 *                   Component-level <code>help</code> value after a hash ('&#x23') character.
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>params</code></td>
 *               <td>no</td>
 *               <td>{Array<{Object}>}</td>
 *               <td>An array of objects describing the method parameter.  Each parameter object has the following properties:
 *                 <h6>Properties</h6>
 *                 <table class="params">
 *                  <thead>
 *                   <tr>
 *                    <th>Name</th>
 *                    <th>Type</th>
 *                    <th>Description</th>
 *                   </tr>
 *                  </thead>
 *                  <tbody>
 *                   <tr>
 *                    <td class="name"><code>description</code></td>
 *                    <td>{string}</td>
 *                    <td>A translatable description of the parameter</td>
 *                   </tr>
 *                   <tr>
 *                    <td class="name"><code>name</code></td>
 *                    <td>{string}</td>
 *                    <td>The name of the parameter.</td>
 *                   </tr>
 *                   <tr>
 *                    <td class="name"><code>type</code></td>
 *                    <td>{string}</td>
 *                    <td>The type of the property, typically following <a href="https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler">Google's Closure Compiler</a> syntax. The metadata also supports Typescript data types.</td>
 *                   </tr>
 *                 </tbody>
 *                </table>
 *              </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>return</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>The return type of the method, following Closure Compiler syntax.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>visible</code></td>
 *               <td>no</td>
 *               <td>{boolean}</td>
 *               <td>Specifies whether the method should be visible at design time. True by default.</td>
 *             </tr>
 *           </tbody>
 *         </table>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="events">Event Keys
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events"></a>
 * </h3>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Value</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>[event name]</code></td>
 *       <td>Object containing the following properties:
 *         <h6>Properties</h6>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Name</th>
 *               <th>Used at Runtime</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="name"><code>bubbles</code></td>
 *               <td>no</td>
 *               <td>{boolean}</td>
 *               <td>Indicates whether the event bubbles up through the DOM or not. Defaults to false.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>cancelable</code></td>
 *               <td>no</td>
 *               <td>{boolean}</td>
 *               <td>Indicates whether the event is cancelable or not. Defaults to false.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>description</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>A description for the event.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>detail</code></td>
 *               <td>no</td>
 *               <td>{object}</td>
 *               <td>Describes the properties available on the event's detail property, which contains data passed
 *                   when initializing the event. The metadata object has the following properties:
 *                 <h6>Properties</h6>
 *                 <table class="params">
 *                   <thead>
 *                     <tr>
 *                       <th>Name</th>
 *                       <th>Type</th>
 *                       <th>Description</th>
 *                     </tr>
 *                   </thead>
 *                   <tbody>
 *                     <tr>
 *                       <td class="name"><code>[field name]</code></td>
 *                       <td>{Object}</td>
 *                       <td>Information about the specified field in the event's payload.  The object
 *                         has the following properties:
 *                         <h6>Properties</h6>
 *                         <table class="params">
 *                           <thead>
 *                             <tr>
 *                               <th>Name</th>
 *                               <th>Type</th>
 *                               <th>Description</th>
 *                             </tr>
 *                           </thead>
 *                           <tbody>
 *                             <tr>
 *                               <td class="name"><code>description</code></td>
 *                               <td>{string}</td>
 *                               <td>An optional, translatable description of this field</td>
 *                             </tr>
 *                             <tr>
 *                               <td class="name"><code>type</code></td>
 *                               <td>{string}</td>
 *                               <td>The type of this field's value</td>
 *                             </tr>
 *                             <tr>
 *                               <td class="name"><code>eventGroup</code></td>
 *                               <td>{string}</td>
 *                               <td>Optional flag that maps this field for special consideration in a design time
 *                                   environment -- the value should match the <code>eventGroup</code> value of
 *                                   the containing Event metadata element)
 *                               </td>
 *                             </tr>
 *                            </tbody>
 *                          </table>
 *                       </td>
 *                     </tr>
 *                   </tbody>
 *                 </table>
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>displayName</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>A user friendly, translatable name of the event.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>eventGroup</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>Optional group name for this event in a design time environment.  Reserved values are:
 *                 <ul>
 *                   <li><code>"common"</code> - Applications will commonly want to invoke application logic
 *                       in response to this event, so it should be prominently highlighted and the design time
 *                       environment should provide extra assistance.</li>
 *                 </ul>
 *                 If an event is mapped to an <code>eventGroup</code>, then members of that event's
 *                 <code>detail</code> metadata can be also be flagged with that same <code>eventGroup</code>
 *                 name – this enables the design time environment to map event payload details with any extra
 *                 assistance afforded by that grouping.
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>extension</code></td>
 *               <td>no</td>
 *               <td>{Object}</td>
 *               <td>Placeholder for Extension metadata.  Each section is identified by a key that specifies the downstream tool that will process this metadata.
 *                 <h6>For example:</h6>
 *                 <table class="params">
 *                   <thead>
 *                     <tr>
 *                       <th>Name</th>
 *                       <th>Type</th>
 *                       <th>Description</th>
 *                     </tr>
 *                   </thead>
 *                   <tbody>
 *                     <tr>
 *                       <td class="name"><code>vbcs</code></td>
 *                       <td>{string}</td>
 *                       <td>Indentifies an object with VBCS-specific metadata</td>
 *                     </tr>
 *                   </tbody>
 *                 </table>
 *                 </br>
 *                 Please consult the documentation for the downstream tool to determine what (if any) extension metadata is supported.
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>help</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>Specifies a URL to detailed API documentation for this component event.  The value
 *                   can be either an absolute URL, or an anchor string to be appended at the end of the
 *                   Component-level <code>help</code> value after a hash ('&#x23') character.
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>visible</code></td>
 *               <td>no</td>
 *               <td>{boolean}</td>
 *               <td>Specifies whether the event should be visible at design time. True by default.</td>
 *             </tr>
 *           </tbody>
 *         </table>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="slots">Slot Keys
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#slots"></a>
 * </h3>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Value</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>[slot name]</code></td>
 *       <td>Object containing the following properties:
 *         <h6>Properties</h6>
 *         <table class="params">
 *           <thead>
 *             <tr>
 *               <th>Name</th>
 *               <th>Used at Runtime</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="name"><code>data</code></td>
 *               <td>no</td>
 *               <td>{Object}</td>
 *               <td>
 *                 An object whose keys are the variable names available on $current and whose values are objects that
 *                 provide additional information about the variable as described in the table below. These variables
 *                 extend what's available on the application context and will be exposed as subproperties
 *                 on the $current variable and any application provided aliases.
 *                 This property only applies to template slots.
 *                 <h6>Properties</h6>
 *                 <table class="params">
 *                   <thead>
 *                     <tr>
 *                       <th>Name</th>
 *                       <th>Type</th>
 *                       <th>Description</th>
 *                     </tr>
 *                   </thead>
 *                   <tbody>
 *                     <tr>
 *                       <td class="name"><code>description</code></td>
 *                       <td>{string}</td>
 *                       <td>The description for the data property.</td>
 *                     </tr>
 *                     <tr>
 *                       <td class="name"><code>type</code></td>
 *                       <td>{string}</td>
 *                       <td>The data property type.</td>
 *                     </tr>
 *                   </tbody>
 *                 </table>
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>description</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>A description for the slot.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>displayName</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>A user friendly, translatable name of the slot.</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>extension</code></td>
 *               <td>no</td>
 *               <td>{Object}</td>
 *               <td>Placeholder for Extension metadata.  Each section is identified by a key that specifies the downstream tool that will process this metadata.
 *                 <h6>For example:</h6>
 *                 <table class="params">
 *                   <thead>
 *                     <tr>
 *                       <th>Name</th>
 *                       <th>Type</th>
 *                       <th>Description</th>
 *                     </tr>
 *                   </thead>
 *                   <tbody>
 *                     <tr>
 *                       <td class="name"><code>vbcs</code></td>
 *                       <td>{string}</td>
 *                       <td>Indentifies an object with VBCS-specific metadata</td>
 *                     </tr>
 *                   </tbody>
 *                 </table>
 *                 </br>
 *                 Please consult the documentation for the downstream tool to determine what (if any) extension metadata is supported.
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>help</code></td>
 *               <td>no</td>
 *               <td>{string}</td>
 *               <td>Specifies a URL to detailed API documentation for this component slot.  The value
 *                   can be either an absolute URL, or an anchor string to be appended at the end of the
 *                   Component-level <code>help</code> value after a hash ('&#x23') character.
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>maxItems</code></td>
 *               <td>no</td>
 *               <td>{number}</td>
 *               <td>Specifies the maximum number of elements that the design time environment should allow
 *                   to be added to this slot.  If unspecified, the default is that there is no maximum.
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>minItems</code></td>
 *               <td>no</td>
 *               <td>{number}</td>
 *               <td>Specifies the minimum number of elements that the design time environment should allow
 *                   to be added to this slot.  If unspecified, the default is 0.
 *               </td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>visible</code></td>
 *               <td>no</td>
 *               <td>{boolean}</td>
 *               <td>Specifies whether the slot should be visible at design time. True by default.</td>
 *             </tr>
 *           </tbody>
 *         </table>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 * <h6>Note:</h6>
 * By convention, the slot name for a component's Default slot is the empty string:  <code>""</code>.
 *
 * @ojfragment metadataOverviewDoc
 * @memberof MetadataOverview
 */

  return oj.Composite;
});