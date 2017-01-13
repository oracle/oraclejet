/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout', 'ojs/ojknockout', 'promise'], function(oj, ko)
{
/**
 * @ignore
 * @constructor
 */
function PropertyUpdater(element, props, bindingContext, parseFunction)
{
  this.setup = function(metadata)
  {
    // Since we are tracking all our dependencies explicitly, we are suspending dependency detection here.
    // update() will be called only once as a result

    var metadataProps = metadata['properties'];
    if (metadataProps)
    {
      var expressionHandler = this._expressionHandler = 
                    new oj.__ExpressionPropertyUpdater(element, bindingContext);
      
      // Override set/removeAttribute so we get notifications when DOM changes
      originalMethods.setAttribute = element.setAttribute,
      originalMethods.removeAttribute = element.removeAttribute
      element.setAttribute = function(name, value)
      {
        changeAttribute(name, value, originalMethods.setAttribute, false);
      };
      element.removeAttribute = function(name)
      {
        changeAttribute(name, null, originalMethods.removeAttribute, true);
      };
      var changeAttribute = function(name, value, operation, bRemove)
      {
        name = name.toLowerCase();
        var previousValue = element.getAttribute(name);
        operation.apply(element, arguments);
        var newValue = element.getAttribute(name);
        if (newValue !== previousValue)
        {
          var propName = oj.__AttributeUtils.attributeToPropertyName(name);
          _setPropertyFromAttribute(props, metadataProps[propName], propName, newValue, expressionHandler, bRemove);
        }
      }

      var names = Object.keys(metadataProps);

      _setInitializing(true);

      try
      {
        names.forEach(
          function(name)
          {
            var attrName = oj.__AttributeUtils.propertyNameToAttribute(name);
            var elemHasAttr = element.hasAttribute(attrName);
            var propertyMetadata = metadataProps[name];
            if (elemHasAttr)
            {
              var attrVal = element.getAttribute(attrName);
              _setPropertyFromAttribute(props, propertyMetadata, name, attrVal, expressionHandler, false);
            }
            // Set default values from metadata for properties not defined by attribute values or were readOnly
            // and bound to upstream-only expressions
            if (!elemHasAttr || propertyMetadata['readOnly'])
            {
              try 
              {
                _setDefaulting(true);
                element[name] = propertyMetadata['value'];
              }
              finally
              {
                _setDefaulting(false);
              }
            }
          }
        );

        element.classList.add('oj-complete');
      }
      finally
      {
        _setInitializing(false);
      }
    }
    return this;
  }

  this.isInitializing = function()
  {
    return _initializing;
  }

  this.isDefaulting = function()
  {
    return _defaulting;
  }

  function _setPropertyFromAttribute(props, metadata, propName, attrVal, expressionHandler, bRemove)
  {    
    // Only deal with element defined attribute changes
    if (!metadata)
      return;

    if (!expressionHandler.setupExpression(attrVal, propName, metadata) && !metadata['readOnly'])
    {
      var value;
      if (bRemove)
      {
        // Coercion is skipped if we are resetting the property to the default metadata value when the attribute is removed
        value = metadata['value'];
      }
      else
      {
        // Use the composite's custom parse function if one is provided
        if (parseFunction)
        {
          value = parseFunction(attrVal, propName, metadata, 
            function(value) 
            {
              return oj.__AttributeUtils.coerceValue(propName, value, metadata['type']); 
            }
          );
        }
        else 
        {
          value = oj.__AttributeUtils.coerceValue(propName, attrVal, metadata['type']);
        }
      }
      element[propName] = value;
    }
  }


  this.teardown = function(element)
  {
    this._expressionHandler.teardown();
    // reset overridden methods
    var names = Object.keys(originalMethods);
    var i;
    for (i=0; i<names.length; i++)
    {
      var method = names[i];
      element[method] = originalMethods[method];
    }
    originalMethods = {};

  }

  function _setInitializing(flag)
  {
    _initializing = flag;
  }

  function _setDefaulting(flag)
  {
    _defaulting = flag;
  }




  var originalMethods = {};
  var _initializing;
  var _defaulting;
}

ko['bindingHandlers']['_ojNodeStorage_'] =
{
  'init': function()
  {
    return {'controlsDescendantBindings' : true};
  }
}

ko['bindingHandlers']['_ojSlot_'] =
{
  'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
  {

    function cleanup(bindingContext)
    {
      var nodeStorage = bindingContext['__oj_nodestorage'];
      // Move all non default slot children to nodeStorage
      if (nodeStorage)
      {
        // Check to see if we've processed this node as an assigned node by seeing if we've
        // added a 'data-oj-slot' property to the node
        var node;
        while (node = ko.virtualElements.firstChild(element))
        {
          if (node['__oj_slots'] != null)
            nodeStorage.appendChild(node);
        }
      }
    }
    ko.utils.domNodeDisposal.addDisposeCallback(element, cleanup.bind(null, bindingContext));

    var slots = bindingContext['__oj_slots'];

    var values = valueAccessor();
    var unwrap = ko.utils.unwrapObservable;
    var slotName =  unwrap(values['name']) || '';
    var index =  unwrap(values['index']);
    var assignedNodes = index != null ? [slots[slotName][index]] : slots[slotName];

    if (assignedNodes)
    {
      for (var i = 0; i < assignedNodes.length; i++)
      {
        // Save references to nodes we need to cleanup ._slot field
        var node = assignedNodes[i];
        // Get the slot value of this oj-slot element so we can assign it to its
        // assigned nodes for downstream slotting
        node['__oj_slots'] = unwrap(values['slot']) || '';
      }
      ko.virtualElements.setDomNodeChildren(element, assignedNodes);

      // If no assigned nodes, let ko apply bindings to default slot content
      return {'controlsDescendantBindings' : true};
    }
  }
}

// Allow _ojSlot_ binding on virtual elements (comment nodes) which is done during knockout's preprocessNode method
ko.virtualElements.allowedBindings['_ojSlot_'] = true;

(function()
{

  oj.__KO_CUSTOM_BINDING_PROVIDER_INSTANCE.addPostprocessor
  (
    {
      'nodeHasBindings': function(node, wrappedReturn)
      {
        return wrappedReturn || (node.nodeType === 1 && oj.Composite.__GetDescriptor(node.nodeName.toLowerCase()));
      },

      'getBindingAccessors': function(node, bindingContext, wrappedReturn)
      {
        if (node.nodeType === 1)
        {
          var name = node.nodeName.toLowerCase();
          var descriptor = oj.Composite.__GetDescriptor(name);
          if (descriptor)
          {
            wrappedReturn = wrappedReturn || {};

            var compositionBinding  = 'ojComposite';

            if (wrappedReturn[compositionBinding])
            {

              throw "Cannot use " + compositionBinding +  " binding on a custom element whose name is already registered for a composite binding";
            }

            var bindingValue = {'name': name};

            wrappedReturn[compositionBinding] = function() {return bindingValue;}

          }
        }

        return wrappedReturn;
      },

      'preprocessNode': function(node, wrappedReturn)
      {
        var newNodes;
        if (node.nodeType === 1)
        {
          if ('oj-slot' === node.nodeName.toLowerCase())
          {
            var attrs = ['name', 'slot', 'index'];

            var binding = 'ko _ojSlot_:{'
            var valueExpressions = [];

            for (var i=0; i<attrs.length; i++)
            {
              var attr = attrs[i];
              var expr = _getExpression(node.getAttribute(attr));
              if (expr)
              {
                valueExpressions.push(attr + ':' + expr);
              }
            }
            binding += valueExpressions.join(',');
            binding += '}';

            var openComment = document.createComment(binding);

            var closeComment = document.createComment('/ko');

            newNodes = [openComment];

            var parent  = node.parentNode;
            parent.insertBefore(openComment, node);

            // Copy the 'fallback content' children into the comment node
            while (node.childNodes.length > 0)
            {
              var child = node.childNodes[0];
              parent.insertBefore(child, node);
              newNodes.push(child);
            }

            newNodes.push(closeComment);

            parent.replaceChild(closeComment, node);
          }
        }
        return newNodes? newNodes: wrappedReturn;
      }
    }

  );

  function _getExpression(attrValue)
  {
    if (attrValue != null)
    {
      var exp = oj.__AttributeUtils.getExpressionInfo(attrValue).expr;
      if (exp == null)
      {
        exp = "'" + attrValue + "'";
      }
      return exp;
    }

    return null;
  }

}
)();

/**
 * <p>
 * A composite component is a reusable piece of UI that can be embedded as a custom HTML element and
 * can be composed of other composites, JET components, HTML, JavaScript, or CSS.
 * </p>
 *
 * <h2 id="registration">Packaging and Registration
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#registration"></a>
 * </h2>
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
 * <pre class="prettyprint">
 * <code>
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
 * </code>
 * </pre>
 * </p>
 * 
 * <p>
 * All composite modules should contain a loader.js file which will handle registering and specifying the dependencies for a composite component.
 * We recommend using RequireJS to define your composite module with relative file dependencies.  
 * Registration is done via the <a href="#register">oj.Composite.register</a> API.
 * By registering a composite component, an application links an HTML tag with provided
 * Metadata, View, ViewModel and CSS which will be used to render the composite. These optional
 * pieces can be provided via a descriptor object passed into the register API which defines how
 * each piece will be loaded, either inline or as a Promise. See below for sample loader.js file configurations.
 * </p>
 *
 * Note that in this example we are using a RequireJS plugin for loading css which will load the styles within our page
 * so we do not need to pass any css into the register call.
 * <pre class="prettyprint">
 * <code>
 * define(['text!./my-chart.html', './my-chart', 'text!./my-chart.json', 'css!./my-chart'],
 *   function(view, viewModel, metadata) {
 *     oj.Composite.register('my-chart',
 *     {
 *       metadata: {inline: JSON.parse(metadata)},
 *       view: {inline: view},
 *       viewModel: {inline: viewModel}
 *     });
 *   }
 * );
 * </code>
 * </pre>
 *
 * This example shows how to pass inline CSS to the register call.
 * <pre class="prettyprint">
 * <code>
 * define(['text!./my-chart.html', './my-chart', 'text!./my-chart.json'],
 *   function(view, viewModel, metadata) {
 *     oj.Composite.register('my-chart',
 *     {
 *       metadata: {inline: JSON.parse(metadata)},
 *       view: {inline: view},
 *       viewModel: {inline: viewModel},
 *       css: {inline: 'my-chart {font-size:20px; color:blue;}'}
 *     });
 *   }
 * );
 * </code>
 * </pre>
 *
 * This example shows how to register a custom parse function which will be called to parse attribute values defined in the metadata.
 * <pre class="prettyprint">
 * <code>
 * define(['text!./my-chart.html', './my-chart', 'text!./my-chart.json'],
 *   function(view, viewModel, metadata) {
 *     var myChartParseFunction = function(value, name, meta, defaultParseFunction) {
 *       // Custom parsing logic goes here which can also return defaultParseFunction(value) for
 *       // values the composite wants to default to the default parsing logic for.
 *       // This function is only called for non bound attributes.
 *     }
 * 
 *     oj.Composite.register('my-chart',
 *     {
 *       metadata: {inline: JSON.parse(metadata)},
 *       view: {inline: view},
 *       viewModel: {inline: viewModel},
 *       parseFunction: myChartParseFunction
 *     });
 *   }
 * );
 * </code>
 * </pre>
 *
 * <h2 id="usage">Usage
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#usage"></a>
 * </h2>
 * <p>Once registered within a page, a composite component can be used in the DOM as a custom HTML element like in the example below.  Currently, composites need
 * to be in a knockout activated subtree, but this requirement may change in future releases.
 * </p>
 * <pre class="prettyprint">
 * <code>
 * &lt;my-chart type="bubble" data="{{dataModel}}">&lt;/my-chart>
 * </code>
 * </pre>
 *
 * <h2 id="metadata">Metadata
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#metadata"></a>
 * </h2>
 * <p>Metadata can be provided via JSON format which will be used to define the composite component's properites, methods, and events.
 *  The Metadata can be extended by appending any extra information in an "extension" field except at the first level of 
 *  the "properties", "methods", and "events" objects. Any metadata in an extension field will be ignored.
 *  The Metadata JSON object can have the following top level properties, "properties", "methods", "events", which can contain additional
 *  information described in the tables below for each top level property. Any types should be
 *  <a href="https://developers.google.com/closure/compiler/docs/js-for-compiler#types">Closure Compiler compatible</a>.</p>
 * <p>Keys defined in the "properties" top level object should map to the composite component's properties following
 *  the same naming convention described in the <a href="#attr-to-prop-mapping">Attribute-to-Property mapping</a> section.
 *  Non expression bound composite component attributes will be correctly evaluated only if they are a primitive JavaScript type (boolean, number, string)
 *  or a JSON object. Attributes evaluating to any other types must be bound via expression syntax.  
 *  Boolean attributes are considered true if set to the case-insensitive attribute name, the empty string or have no value assignment. 
 *  JET composite components will also evalute boolean attributes set explicitly to 'true' or 'false' to their respective boolean values. All other values are invalid.</p>
 * <p>Not all information provided in the Metadata is required at run time and those not indicated to be required at run time in the tables
 *  below can be omitted to reduce the Metadata download size. Any non run time information can be used for design time tools and property editors and could
 *  be kept in a separate JSON file which applications can use directly or merge with the run time metadata as needed, but would not be required by the loader.js
 *  file. For methods, only the method name is required at run time and for events, only run time environments that care about available events
 *  need to include the event name.  Otherwise, no event info needs to be included for run time.</p>
 *
 * <h3>Properties</h3>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>description</code></td>
 *       <td>{string}</td>
 *       <td>A description for the property. Not used at run time.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>readOnly</code></td>
 *       <td>{boolean}</td>
 *       <td>Determines whether a property can be updated outside of the ViewModel.
 *          False by default. If readOnly is true, the property can only be updated by the ViewModel or by the
 *          components within the composite.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>type</code></td>
 *       <td>{string}</td>
 *       <td>The type of the property, following Closure Compiler syntax.
 *          Complex properties can be expressed using the Closure Compiler record type
 *          syntax or additional nested properties objects.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>value</code></td>
 *       <td>{object}</td>
 *       <td>An optional default value for a property.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>writeback</code></td>
 *       <td>{boolean}</td>
 *       <td>Determines whether an expression bound to this property should be written back to. False by default.
 *          If writeback is true, any updates to the property will result in an update to the expression.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3>Methods</h3>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>description</code></td>
 *       <td>{string}</td>
 *       <td>A description for the method. Not used at run time.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>internalName</code></td>
 *       <td>{string}</td>
 *       <td>An optional ViewModel method name that is different from, but maps to this method.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>params</code></td>
 *       <td>{Array<{description: string, name: string, type: string}>}</td>
 *       <td>An array of objects describing the method parameter. Not used at run time.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>return</code></td>
 *       <td>{string}</td>
 *       <td>The return type of the method, following Closure Compiler syntax. Not used at run time.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3>Events</h3>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>bubbles</code></td>
 *       <td>{boolean}</td>
 *       <td>Indicates whether the event bubbles up through the DOM or not. Defaults to false. Not used at run time.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>cancelable</code></td>
 *       <td>{boolean}</td>
 *       <td>Indicates whether the event is cancelable or not. Defaults to false. Not used at run time.</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>description</code></td>
 *       <td>{string}</td>
 *       <td>A description for the event. Not used at run time.</td>
 *     </tr>
 *     <tr>
 *       <td>detail</td>
 *       <td>{object}</td>
 *       <td>Describes the properties available on the event's detail property which contains data passed when initializing the event. Not used at run time.</p>
 *          <h6>Properties</h6>
 *          <table class="params">
 *            <thead>
 *              <tr>
 *                <th>Name</th>
 *                <th>Type</th>
 *              </tr>
 *            </thead>
 *            <tbody>
 *              <tr>
 *                <td class="name"><code>[field name]</code></td>
 *                <td>{description: string, type: string}</td>
 *              </tr>
 *            </tbody>
 *          </table>
 *        </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3>Example of Run Time Metadata</h3>
 * <p>Note that in the example below, the cardClick event is not needed if the run time does not need to know about available events.
 *   The JET composite binding does do anything with the events metadata and ignores "extension" fields. Extension fields cannot
 *   be defined at the first level of the "properties", "methods", and "events" objects.</p>
 * <pre class="prettyprint">
 * <code>
 * {
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
 *     "cardClick": {}
 *   }
 * }
 * </code>
 * </pre>
 *
 * <h2 id="properties">Properties
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#properties"></a>
 * </h2>
 * <p>
 * Properties defined in provided Metadata will be made available through the $props property of the View binding context
 * and through the props property on the context passed to the provided ViewModel constructor function or lifecycle listeners
 * if an object instance is passed. Unlike the $props property for the View, the props property made available to the
 * ViewModel will be a Promise which will contain the properties object when resolved. The application can access
 * the composite component properties by accessing them directly from the DOM element. Using the DOM setAttribute and
 * removeAttribute APIs will also result in property updates. Changes made to properties will
 * result in a [propertyName]-changed event being fired for that property regardless of where they are modified.
 * </p>
 *
 * <h3 id="attr-to-prop-mapping">Attribute-to-Property Mapping
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#attr-to-prop-mapping"></a>
 * </h3>
 * <p>
 * The following rules apply when mapping attribute to property names:
 * <ul>
 *  <li>Attribute names are converted to lowercase, e.g. a "chartType" attribute will map to a "charttype" property.</li>
 *  <li>Attribute names with dashes are converted to camelCase by capitalizing the first character after a dash and then removing the dashes,
 *    e.g. a "chart-type" attribute will map to a "chartType" property.</li>
 * </ul>
 * The reverse occurs when mapping property to attribute names.
 * </p>
 *
 * <h2 id="styling">Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling"></a>
 * </h2>
 * <p>
 * Composite component styling can be done via provided css. The application should note that
 * CSS will not be scoped to the composite component and selectors will need to be appropriately selective.
 * The JET framework will add the <code>oj-complete</code> class to the composite DOM element after metadata properties have been resolved.
 * To prevent a flash of unstyled content before the composite properties have been setup, the composite css can include the following rule to hide the
 * composite until the <code>oj-complete</code> class is set on the element.
 * <pre class="prettyprint">
 * <code>
 * my-chart:not(.oj-complete) {
 *   visibility: hidden;
 * }
 * </code>
 * </pre>
 * </p>
 *
 * <h2 id="events">Events
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events"></a>
 * </h2>
 * <p>
 * Composite components fire the following events. Any custom composite events should be created and fired by the composite's ViewModel and documented in the metadata
 * for design and run time environments as needed.
 * <ul>
 *  <li><b><i>pending</i></b> - Fired to notify the application that a composite component is about to render.</li>
 *  <li><b><i>ready</i></b> - Fired after bindings are applied on the composite component's children. Child pending events will be fired before the parent
 *    composite component's ready event. Note that this does not gaurantee that its children are ready at this point as they could be performing
 *    their own asynchronous operations. Applications may use the pending and ready events  to determine when a composite
 *    component and its children are fully ready (i.e. when the number of received ready events matches the number of received pending events).</li>
 *  <li><b><i>[propertyName]-changed</i></b> - Fired when a property is modified and contains the following fields in its event detail object:
 *    <ul>
 *      <li>previousValue - The previous property value</li>
 *      <li>value - The new property value</li>
 *      <li>updatedFrom - Where the property was updated from. Supported values are:
 *        <ul>
 *          <li>default - The default value specified in the metadata.</li>
 *          <li>internal - The View or ViewModel</li>
 *          <li>external - The DOM Element either by its property setter, setAttribute, or external data binding.</li>
 *        </ul>
 *      </li>
 *    </ul>
 *  </li>
 * </ul>
 * </p>
 *  
 * <h2 id="lifecycle">Lifecycle
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#lifecycle"></a>
 * </h2>
 * <p>
 * If a ViewModel is provided for a composite component, the following optional
 * callback methods can be defined on its ViewModel and will be called at each stage of the composite
 * component's lifecycle. The ViewModel provided at registration can either be a function which will be 
 * treated as a constructor that will be invoked to create the ViewModel instance or an object which will
 * be treated as a singleton instance. The following are the default names of the callback methods, which
 * can also be configured in oj.Composite.defaults.
 *
 * <h4 class="name">initialize<span class="signature">(context)</span></h4>
 * <div class="description">
 * This optional method may be implemented on the ViewModel to perform initialization tasks.
 * This method will be invoked only if the ViewModel specified during registration is an object instance as opposed to a constructor function.
 * If the registered ViewModel is a constructor function, the same context object will be passed to the constructor function instead.
 * If this method returns a Promise, activation will be delayed until the Promise is resolved.
 * </div>
 * <h5>Parameters:</h5>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>context</code></td>
 *       <td>Object</td>
 *       <td>An object with the following key-value pairs:
 *          <h6>Properties:</h6>
 *          <table class="params">
 *            <thead>
 *              <tr>
 *                <th>Name</th>
 *                <th>Type</th>
 *                <th>Description</th>
 *              </tr>
 *            </thead>
 *            <tbody>
 *              <tr>
 *                <td class="name"><code>element</code></td>
 *                <td>Node</td>
 *                <td>DOM element where the View is attached.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>props</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to the composite component's properties.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotNodeCounts</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to a map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>unique</code></td>
 *                <td>string</td>
 *                <td>A unique string that can be used for unique id generation.</td>
 *              </tr>
 *            </tbody>
 *          </table>
 *        </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h4 class="name">activated<span class="signature">(context)</span></h4>
 * <div class="description">
 * This optional method may be implemented on the ViewModel and will be invoked after the ViewModel is initialized.
 * </div>
 * <h5>Parameters:</h5>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>context</code></td>
 *       <td>Object</td>
 *       <td>An object with the following key-value pairs:
 *          <h6>Properties:</h6>
 *          <table class="params">
 *            <thead>
 *              <tr>
 *                <th>Name</th>
 *                <th>Type</th>
 *                <th>Description</th>
 *              </tr>
 *            </thead>
 *            <tbody>
 *              <tr>
 *                <td class="name"><code>element</code></td>
 *                <td>Node</td>
 *                <td>DOM element where the View is attached.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>props</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to the composite component's properties.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotNodeCounts</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to a map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>unique</code></td>
 *                <td>string</td>
 *                <td>A unique string that can be used for unique id generation.</td>
 *              </tr>
 *            </tbody>
 *          </table>
 *        </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h4 class="name">attached<span class="signature">(context)</span></h4>
 * <div class="description">
 * This optional method may be implemented on the ViewModel and will be invoked after the View is inserted into the document DOM.
 * </div>
 * <h5>Parameters:</h5>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>context</code></td>
 *       <td>Object</td>
 *       <td>An object with the following key-value pairs:
 *          <h6>Properties:</h6>
 *          <table class="params">
 *            <thead>
 *              <tr>
 *                <th>Name</th>
 *                <th>Type</th>
 *                <th>Description</th>
 *              </tr>
 *            </thead>
 *            <tbody>
 *              <tr>
 *                <td class="name"><code>element</code></td>
 *                <td>Node</td>
 *                <td>DOM element where the View is attached.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>props</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to the composite component's properties.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotNodeCounts</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to a map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>unique</code></td>
 *                <td>string</td>
 *                <td>A unique string that can be used for unique id generation.</td>
 *              </tr>
 *            </tbody>
 *          </table>
 *        </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h4 class="name">bindingsApplied<span class="signature">(context)</span></h4>
 * <div class="description">
 * This optional method may be implemented on the ViewModel and will be invoked after the bindings are applied on this View.
 * </div>
 * <h5>Parameters:</h5>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>context</code></td>
 *       <td>Object</td>
 *       <td>An object with the following key-value pairs:
 *          <h6>Properties:</h6>
 *          <table class="params">
 *            <thead>
 *              <tr>
 *                <th>Name</th>
 *                <th>Type</th>
 *                <th>Description</th>
 *              </tr>
 *            </thead>
 *            <tbody>
 *              <tr>
 *                <td class="name"><code>element</code></td>
 *                <td>Node</td>
 *                <td>DOM element where the View is attached.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>props</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to the composite component's properties.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotNodeCounts</code></td>
 *                <td>Promise</td>
 *                <td>A Promise evaluating to a map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>unique</code></td>
 *                <td>string</td>
 *                <td>A unique string that can be used for unique id generation.</td>
 *              </tr>
 *            </tbody>
 *          </table>
 *        </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h4 class="name">dispose<span class="signature">(element)</span></h4>
 * <div class="description">
 * This optional method may be implemented on the ViewModel and will be invoked when this composite component is being disposed.
 * </div>
 * <h5>Parameters:</h5>
 * <table class="params">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>element</code></td>
 *       <td>Node</td>
 *       <td>The composite component DOM element.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * <h2 id="writeback">Data Binding and Expression Writeback
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#writeback"></a>
 * </h2>
 * <p>Besides string literals, composite attributes can be set using expression syntax which is currently compatible with knockout expression syntax.
 * Applications can control expression writeback in the composite component by using {{}} syntax for two-way writable binding expressions
 * or [[]] for one-way only expressions. In the example below, the salesData expression will not be written back to if the 'data' property
 * is updated by the composite component's ViewModel. The 'data' property will contain the current value, but the salesData expression will not
 * be updated. Alternatively, if the 'axisLabels' property is updated by the ViewModel, both the 'axisLabel' property and the showAxisLabels expression
 * will contain the updated value. Updating a readOnly property will disconnect the expression binding since the expression will no longer be
 * in sync with the property value. The property will still update and a property change event, [propertyName]-changed, will still be fired when 
 * the property value changes regardless of whether the expression is written back to.
 * <pre class="prettyprint">
 * <code>
 * &lt;my-chart data="[[salesData]]" axis-labels={{showAxisLabels}} ... >
 * &lt;/my-chart>
 * </code>
 * </pre>
 * </p>
 * <h3>readOnly</h3>
 * <p>The composite component Metadata also defines properties to control expression writeback and property updates.
 * If a property's readOnly option is omitted, the value is false by default, meaning the property can be updated outside of the
 * composite component.  If readOnly is true, the property can only be updated inside of the composite component by the ViewModel or View.
 * </p>
 * <h3>writeback</h3>
 * <p>If a property's Metadata defines its writeback property as true (false by default), any bound attribute expressions will
 * be updated when the property is updated unless the attribute binding was done with a one-way "[[]]"" binding syntax.</p>
 *
 * <h2 id="slotting">Slotting
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#slotting"></a>
 * </h2>
 * <p>
 * Complex composite components which can contain additional composites and/or content for child facets defined in its associated View can be constructed via slotting.
 * </p>
 * <h3>Definitions</h3>
 * <h4>Assignable Node</h4>
 * <h5>Properties</h5>
 * <ul>
 *  <li>Nodes with slot attributes will be assigned to the corresponding named slots (if
 *    present) and all other assignable nodes (Text or Element) will be assigned to
 *    the default slot (if present).</li>
 *  <li>The slot attribute of a node is only applied once. If the View contains a
 *    composite and the node's assigned slot is a child of that composite, the slot
 *    attribute of the assigned slot is inherited for the slotting of that composite.</li>
 *  <li>Nodes with slot attributes that reference slots not present in the View will not appear in the DOM.</li>
 *  <li>If the View does not contain a default slot, nodes assigned to the default slot will not appear in the DOM.</li>
 *  <li>Nodes that are not assigned to a slot will not appear in the DOM.</li>
 * </ul>
 *
 * <h4>Slot</h4>
 * <h5>Properties</h5>
 * <ul>
 *  <li>A default slot is a slot element whose slot name is the empty string or missing.</li>
 *  <li>More than one node can be assigned to the same slot.</li>
 *  <li>A slot can also have a slot attribute and be assigned to another slot.</li>
 *  <li>A slot can have fallback content which are its child nodes that will be used in the DOM in its place if it has no assigned nodes.</li>
 *  <li>A slot can also also have an index attribute to allow the slot's assigned nodes
 *    to be individually slotted (e.g. in conjunction with a Knockout foreach binding).</li>
 * </ul>
 *
 * <h3>Applying Bindings</h3>
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
 *      <li>The oj-slot's slot attribute, which is "" by default, will override its assigned node's slot attribute.</li>
 *    </ol>
 *  </li>
 * </ol>
 * </p>
 *
 * <h4>Example #1: Basic Usage</h4>
 * Note that the IDs are provided for sample purposes only.
 * <h5>Initial DOM</h5>
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-a>
 *  &lt;div id="A" slot="foo">&lt;/div>
 *  &lt;div id="B" slot="bar">&lt;/div>
 *  &lt;div id="C">&lt;/div>
 *  &lt;div id="D" slot="foo">&lt;/div>
 *  &lt;div id="E" slot="cat">&lt;/div>
 * &lt;/oj-a>
 * </code>
 * </pre>
 *
 * <h5>View</h5>
 * <pre class="prettyprint">
 * <code>
 * &lt;!-- oj-a View -->
 * &lt;div id="outerFoo">
 *  &lt;oj-slot name="foo">&lt;/oj-slot>
 * &lt;/div>
 * &lt;div id="outerBar">
 *  &lt;oj-slot name="bar">&lt;/oj-slot>
 * &lt;/div>
 * &lt;div id="outerBaz">
 *  &lt;oj-slot name="baz">
 *    &lt;!-- Default Content -->
 *    &lt;img id="F">&lt;/img>
 *    &lt;div id="G">&lt;/div>
 *  &lt;/oj-slot>
 * &lt;/div>
 * &lt;div id="outerDefault">
 *  &lt;oj-slot>
 *    &lt;!-- Default Content -->
 *    &lt;div id="H">&lt;/div>
 *  &lt;/oj-slot>
 * &lt;/div>
 * </code>
 * </pre>
 *
 * <h5>Final DOM</h5>
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-a>
 *  &lt;div id="outerFoo">  
 *      &lt;div id="A" slot="foo">&lt;/div>
 *      &lt;div id="D" slot="foo">&lt;/div>
 *  &lt;/div>
 *  &lt;div id="outerBar">
 *      &lt;div id="B" slot="bar">&lt;/div>
 *   &lt;/div>
 *  &lt;div id="outerBaz">
 *      &lt;img id="F">&lt;/img>
 *      &lt;div id="G">&lt;/div>
 *  &lt;/div>
 *  &lt;div id="outerDefault">
 *      &lt;div id="C">&lt;/div>
 *  &lt;/div>
 * &lt;/oj-a>
 * </code>
 * </pre>
 *
 * <h4>Example #2: Slot Attribute Evaluation</h4>
 * <p>When a node is assigned to a slot, its slot value is not used for subsequent
 *  slot assignments when child bindings are applied. Instead that slot's slot attribute,
 *  which by default is "", overrides the assigned node's slot attribute. No actual
 *  DOM changes will be made to the assigned node's slot attribute, but its evaluated
 *  slot value will be managed internally and used for applying subsequent child bindings.</p>
 *
 * <h5>Initial DOM</h5>
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-a>
 *  &lt;div id="A" slot="foo">&lt;/div>
 * &lt;/oj-a>
 * </code>
 * </pre>
 *
 * <h5>View</h5>
 * <pre class="prettyprint">
 * <code>
 * &lt;!-- oj-a View -->
 * &lt;oj-b>
 *  &lt;oj-slot name="foo">&lt;/oj-slot>
 * &lt;/oj-b>
 *
 * &lt;!-- oj-b View -->
 * &lt;div id="outerFoo">
 *  &lt;oj-slot name="foo">&lt;/oj-slot>
 * &lt;/div>
 * &lt;div id="outerDefault">
 *  &lt;oj-slot>&lt;/oj-slot>
 * &lt;/div>
 * </code>
 * </pre>
 *
 * <p>When applying bindings for the oj-a View, the oj-slot binding will replace
 * slot foo with div A. Slot foo's slot attribute ("") overrides div A's ("foo")
 * so that the evaluated slot value ("") will be used when applying subsequent child bindings.<p>
 * <pre class="prettyprint">
 * <code>
 * &lt;!-- DOM -->
 * &lt;oj-a>
 *  &lt;!-- Start oj-a View -->
 *  &lt;oj-b>
 *    &lt;!-- Evaluated slot value is "" -->
 *    &lt;div id="A" slot="foo">&lt;/div>
 *  &lt;/oj-b>
 *  &lt;!-- End oj-a View -->
 * &lt;/oj-a>
 * </code>
 * </pre>
 *
 * <p>When applying bindings for the oj-b View, the oj-slot binding will replace
 *  oj-b's default slot with div A since it's evaluated slot value is "".</p>
 * <pre class="prettyprint">
 * <code>
 * &lt;!-- DOM -->
 * &lt;oj-a>
 *  &lt;!-- Start oj-a View -->
 *  &lt;oj-b>
 *    &lt;!-- Start oj-b View -->
 *    &lt;div id="outerFoo">
 *    &lt;/div>
 *    &lt;div id="outerDefault">
 *      &lt;div id="A" slot="foo">&lt;/div>
 *    &lt;/div>
 *    &lt;!-- End oj-b View -->
 *  &lt;/oj-b>
 *  &lt;!-- End oj-a View -->
 * &lt;/oj-a>
 * </code>
 * </pre>
 * 
 * @namespace
 */
oj.Composite = {};

/**
 * Default configuration values.
 * Composite component conventions may be overridden for the entire application after the ojs/ojcomposite
 * module is loaded. For example:
 * <p><code class="prettyprint">
 * oj.Composite.defaults.bindingsAppliedMethod = 'applied';
 * </code></p>
 * @property {string} initializeMethod The name of the initialialization method. Defaults to 'initialize'.
 * @property {string} activatedMethod The name of the method invoked after the Model is instantiated. Defaults to 'activated'.
 * @property {string} attachedMethod The name of the method invoked when the View is inserted into the document DOM. Defaults to 'attached'.
 * @property {string} bindingsAppliedMethod The name of the method invoked after the bindings are applied on the View. Defaults to 'bindingsApplied'.
 * @property {string} disposeMethod The name of the dispose method. Defaults to 'dispose'.
 *
 * @export
 * @memberof oj.Composite
 */
oj.Composite.defaults =
{
  'initializeMethod': 'initialize',
  'activatedMethod': 'activated',
  'attachedMethod': 'attached',
  'bindingsAppliedMethod': 'bindingsApplied',
  'disposeMethod': 'dispose'
};

/**
 * Registers a composite component
 * @param {string} name The component name, which should contain a dash '-' and not be a reserved tag name.
 * @param {Object} descriptor The registration descriptor. The descriptor will contain keys for Metadata, View, ViewModel
 * and CSS that are detailed below. A View is required, but all others are optional.
 * See the <a href="#registration">registration section</a> above for a sample usage.
 * The value for each key is a plain Javascript object that describes the loading
 * behavior. One of the following keys must be set on the object:
 * <ul>
 * <li>promise - specifies the promise instance</li>
 * <li>inline - provides the object inline</li>
 * </ul>
 * @param {Object} descriptor.metadata Describes how component Metadata is loaded. The object must contain one of the keys
 * documented above and ultimately resolve to a JSON object.
 * @param {Object} descriptor.view Describes how component's View is loaded. The object must contain one of the keys
 * documented above and ultimately resolve to a string, array of DOM nodes, or document fragment.
 * @param {Object} descriptor.css Describes how component's CSS is loaded. If specified, the object must contain one of the keys
 * documented above and ultimately resolve to a string if loaded inline or as a Promise.
 * @param {Object} descriptor.viewModel Describes how component's ViewModel is loaded. If specified, the object must contain one of the keys
 * documented above. This option is only applicable to composites hosting a Knockout template
 * with a ViewModel and ultimately resolve to a constructor function or object instance
 * @param {function(string, string, Object, function(string))} descriptor.parseFunction The function that will be called to parse attribute values.
 * Note that this function is only called for non bound attributes. The parseFunction will take the following parameters:
 * <ul>
 *  <li>{string} value: The value to parse.</li>
 *  <li>{string} name: The name of the property.</li>
 *  <li>{Object} meta: The metadata object for the property which can include its type, default value, 
 *      and any extensions that the composite has provided on top of the required metadata.</li>
 *  <li>{function(string)} defaultParseFunction: The default parse function for the given attribute 
 *      type which is used when a custom parse function isn't provided and takes as its parameters 
 *      the value to parse.</li>
 * </ul>
 *
 * @export
 * @memberof oj.Composite
 *
 */
oj.Composite.register = function(name, descriptor)
{
  if (name)
    oj.Composite._registry[name.toLowerCase()] = descriptor;
}

/**
 * @ignore
 */
oj.Composite.__GetDescriptor = function(name)
{
  if (name)
    return oj.Composite._registry[name.toLowerCase()];
  return null;
}

/**
 * Saves the metadata Promise for the given composite
 * @param {string} name The composite component name.
 * @param {Promise} metadata The metadata Promise.
 * @ignore
 */
oj.Composite.__SaveMetadata = function(name, metadata)
{
  if (name) 
  {
    var descriptor = oj.Composite._registry[name.toLowerCase()];
    if (descriptor)
      descriptor['_metadata'] = metadata;
  }
}

/**
 * Returns the metadata JSON object for the given composite component name.
 * @param {string} name The composite component name.
 * @return {Promise} metadata The metadata Promise.
 * @ignore
 * @export
 */
oj.Composite.getMetadata = function(name)
{
  if (name) 
  {
    var descriptor = oj.Composite._registry[name.toLowerCase()];
    if (descriptor)
      return descriptor['_metadata'];
  }
  return null;
}

/**
 * @ignore
 */
oj.Composite._registry = {};

ko['bindingHandlers']['ojComposite'] =
{
  'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
  {
    return {'controlsDescendantBindings' : true};
  },

  'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
  {
    var _INTERRUPTED_ERROR = new Error();
    var childViewModel;
    var propertyUpdater;
    var pendingLoadId = -1;
    var nodeDisposed = false;
    var compMetadata;
    var props = {};
    var nodeStorage;

    function cleanup(isNodeDispose, bindingContext)
    {
      if (propertyUpdater)
      {
        propertyUpdater.teardown(element);
        propertyUpdater = null;
      }

      nodeDisposed = isNodeDispose;

      _invokeCompositeViewModelMethod(childViewModel, 'disposeMethod', [element]);

      childViewModel = null;

      if (compMetadata)
      {
        _resetElement(element, compMetadata);
      }

      // cleanup nodeStorage after view slotting is complete
      if (nodeStorage)
      {
        element.removeChild(nodeStorage);
        nodeStorage = null;
      }

      compMetadata = null;
      props = {};
    }

    // Wraps a callback functions to associate it with the the current Load Id
    function wrapToCheckLoadId(func)
    {
      var checker = function(id)
      {
        if (nodeDisposed || id != pendingLoadId)
        {
          throw _INTERRUPTED_ERROR;
        }

        // Exclude the first argument (load Id) when invoking the callback
        return func.apply(this, Array.prototype.slice.call(arguments, 1));

      }.bind(null, pendingLoadId);

      return checker;
    }

    var unwrap = ko.utils.unwrapObservable;


    // Since we are tracking all our dependencies explicitly, we are suspending dependency detection here.
    // update() will be called only once as a result
    ko.ignoreDependencies(
      function()
      {
        ko.computed(
          function()
          {
            // Increment the load Id to ensure that we discard any old pending promises
            pendingLoadId++;
            _fireEvent('pending', element);

            cleanup(false, bindingContext);

            var value = unwrap(valueAccessor()) || {};

            var name = unwrap(value['name']);

            var descriptor = oj.Composite.__GetDescriptor(name);

            if (!descriptor)
            {
              throw "Composite is missing a descriptor";
            }

            var metadataPromise = _getResourcePromise(descriptor, "metadata");
            oj.Composite.__SaveMetadata(name, metadataPromise);
            var propertiesInitializedPromise = null;
            if (metadataPromise)
            {
              propertiesInitializedPromise = metadataPromise.then(
                wrapToCheckLoadId (
                  function(metadata)
                  {
                    if (metadata)
                    {
                      compMetadata = metadata;

                      propertyUpdater = new PropertyUpdater(element, props, bindingContext, descriptor["parseFunction"]);
                      _setupProperties(element, props, metadata, propertyUpdater);
                      propertyUpdater.setup(metadata);
                    }
                    else
                    {
                      element.classList.add('oj-complete');
                      oj.Logger.warn("ojComposite is being loaded without metadata. No element properties will be set up");
                    }

                    return props;
                  }
                )
              );
            }
            else
            {
              element.classList.add('oj-complete');
            }

            var resolveSlotsPromise;
            var slotsPromise = new Promise(function(resolve) {
              resolveSlotsPromise = resolve;
            });

            var unique = _getUnique();
            var vmContext = {
              'element': element,
              'props': propertiesInitializedPromise,
              'slotNodeCounts': slotsPromise,
              'unique': unique
            };
            var modelInstancePromise = null;
            var modelPromise = _getResourcePromise(descriptor, "viewModel");
            if (modelPromise)
            {
              modelInstancePromise = modelPromise.then(
                wrapToCheckLoadId(
                  function(model)
                  {
                    if (typeof model === 'function')
                    {
                      model = new model(vmContext);
                    }
                    else
                    {
                      // If the function returns a value, use it as the new model instance
                      model = _invokeCompositeViewModelMethod(model, 'initializeMethod', [vmContext]) || model;
                    }

                    return model;
                  }
                )
              );
            }

            var activatedPromise = null;
            if (modelInstancePromise) {
              activatedPromise = modelInstancePromise.then(
                wrapToCheckLoadId(
                  function(model)
                  {
                    return _invokeCompositeViewModelMethod(model, 'activatedMethod', [vmContext]);
                  }
                )
              );
            }

            var viewPromise =  _getResourcePromise(descriptor, "view");
            if (viewPromise)
            {
              viewPromise = viewPromise.then (
                 wrapToCheckLoadId(
                  function(view)
                  {
                    return _getDomNodes(view);
                  }
                 )
              );
            }

            var cssPromise =  _getResourcePromise(descriptor, "css");
            if (cssPromise)
            {
              cssPromise = cssPromise.then (
                wrapToCheckLoadId(
                  function(css)
                  {
                    var style = document.createElement('style');
                    style.type = 'text/css';
                    if (style.styleSheet) // for IE
                    {
                      style.styleSheet.cssText = css;
                    }
                    else
                    {
                      style.appendChild(document.createTextNode(css));
                    }
                    document.head.appendChild(style);
                  }
                )
              );
            }

            // apply bindings to original DOM in composite context before creating slot map
            ko.applyBindingsToDescendants(bindingContext, element);

            var masterPromise = Promise.all([viewPromise, modelInstancePromise, propertiesInitializedPromise, cssPromise, activatedPromise]);
            masterPromise.then(
              function(id, values)
              {
                if (nodeDisposed || id != pendingLoadId)
                {
                  return;
                }
                var view = values[0];
                if (!view)
                {
                  throw "ojComposite is missing a View";
                }

                // generate slot map before we update DOM with view nodes
                var slotMap = _createSlotMap(element);
                var slotNodeCounts = {};
                for (var slot in slotMap)
                {
                  slotNodeCounts[slot] = slotMap[slot].length;
                }
                resolveSlotsPromise(slotNodeCounts);

                // Store composite children on a hidden node while slotting to avoid stale knockout bindings
                // when observables are updated while children are disconnected from DOM. The _storeNodes methods
                // also adds the storage node to the view so it's added to the DOM in setDomNodChildren
                nodeStorage = _storeNodes(element, view);
                ko.virtualElements.setDomNodeChildren(element, view);

                childViewModel = values[1];
                _invokeCompositeViewModelMethod(childViewModel, 'attachedMethod', [vmContext]);

                var childBindingContext = bindingContext['createChildContext'](childViewModel,
                  undefined, function (ctx)
                  {
                    ctx['__oj_slots'] = slotMap;
                    ctx['__oj_nodestorage'] = nodeStorage;
                    ctx['$slotNodeCounts'] = slotNodeCounts;
                    ctx['$props'] = props;
                    ctx['$unique'] = unique;
                  }
                );

                // Setup view model methods before apply bindings
                if (compMetadata && childViewModel)
                {
                  _setupMethods(element, compMetadata, childViewModel);
                }

                ko.applyBindingsToDescendants(childBindingContext, element);

                _invokeCompositeViewModelMethod(childViewModel, 'bindingsAppliedMethod', [vmContext]);

                _fireEvent('ready', element);

              }.bind(null, pendingLoadId),
              /* reject callback */
              function(id, reason)
              {
                // Ignore failures that were interrupted due to the response no longer being expected
                if (reason === _INTERRUPTED_ERROR)
                {
                  return;
                }

                if (reason != null)
                {
                  oj.Logger.error(reason);
                }

              }.bind(null, pendingLoadId)
            );
          },
          null,
          {'disposeWhenNodeIsRemoved' : element}
        )
      }
    );

    ko.utils.domNodeDisposal.addDisposeCallback(element, cleanup.bind(null, true, bindingContext));


  }
}

/**
 * @ignore
 */
function _getResourcePromise(descriptor, resourceType)
{
  var promise = null;
  var value = descriptor[resourceType];
  if (value != null)
  {
    var key = Object.keys(value)[0];
    var val = value[key];

    if (key == null)
    {
      throw "Invalid component descriptor key";
    }

    switch(key)
    {
      case 'inline':
        promise = Promise.resolve(val);
        break;
      case 'promise':
        promise = val;
        break;
      default:
        throw "Invalid descriptor key " + key + " for the resopurce type: " + resourceType;
    }
  }
  return promise;
}

/**
 * @ignore
 */
function _invokeCompositeViewModelMethod(model, key, args)
{
  if (model == null)
  {
    return;
  }
  var name = oj.Composite.defaults[key];
  if (name != null && model)
  {
    var handler = model[name];
    if (typeof handler === 'function')
    {
      return ko.ignoreDependencies(handler, model, args);
    }
  }
}

// TODO: Copied from ModuleBinding.js - consider sharing
/**
 * @ignore
 */
function _getDomNodes(content)
{
  if (typeof content === 'string')
  {
    content = ko.utils.parseHtmlFragment(content);
  }
  else if (_isDocumentFragment(content))
  {
    content = ko.utils.arrayPushAll([], content.childNodes);
  }
  else if (Array.isArray(content))
  {
    content = ko.utils.arrayPushAll([], content);
  }
  else
  {
    throw "The View (" + content + ") has an unsupported type";
  }
  return content;
}

/**
 * @ignore
 */
function _isDocumentFragment(content)
{
  if (window['DocumentFragment'])
  {
    return content instanceof DocumentFragment;
  }
  else
  {
    return content && content.nodeType === 11;
  }
}

/**
 * @ignore
 */
function _setupProperties(element, props, metadata, propertyUpdater)
{
  _enumMetadataProperty(metadata, 'properties',
    function(name, propMetadata)
    {
      _defineDynamicCompositeProperty(element, props, name, propMetadata, propertyUpdater);
    }
  );
}

/**
 * @ignore
 */
function _setupMethods(element, metadata, model)
{
  _enumMetadataProperty(metadata, 'methods',
    function(name)
    {
      var internalName = metadata['methods'][name]['internalName'];
      if (internalName)
        element[name] = model[internalName].bind(model);
      else
        element[name] = model[name].bind(model);
    }
  );
}

/**
 * @ignore
 */
function _defineDynamicCompositeProperty(element, props, name, metadata, propertyUpdater)
{
  var propertyTracker = ko.observable();

  var innerSet = function(val, bOuterSet)
  {
    var old = propertyTracker.peek();

    if(old !== val) // We should consider supporting custom comparators
    {
      propertyTracker(val);
      if (!propertyUpdater.isInitializing() || propertyUpdater.isDefaulting())
      {
        var updatedFrom = propertyUpdater.isDefaulting() ? 'default' : (bOuterSet ? 'external' : 'internal');
        _firePropertyChangeEvent(element, name, val, old, updatedFrom);
      }
    }
  }

  var outerSet = function(val)
  {
    if (metadata['readOnly'] && !propertyUpdater.isDefaulting())
    {
      throw "Read-only property " + name + " cannot be set";
    }
    innerSet(val, true);
  }

  var get = function()
  {
    return propertyTracker();
  }

  var outerGet = function()
  {
    return propertyTracker.peek();
  }

  _defineDynamicObjectProperty(props, name, get, function(val) { innerSet(val, false) });
  _defineDynamicObjectProperty(element, name, outerGet, outerSet);
}

/**
 * @ignore
 */
function _defineDynamicObjectProperty(obj, name, getter, setter)
{
  Object.defineProperty(
    obj,
    name,
    {
      'configurable': true, // configurable needs to be true so we can delete in cleanup()
      'enumerable': true,
      'get': getter,
      'set': setter
    }
  );
}

/**
 * @ignore
 */
function _firePropertyChangeEvent(element, name, value, previousValue, updatedFrom)
{
  var evt = new CustomEvent(name + "-changed",
  {
    'detail':
    {
      'value': value,
      'previousValue': previousValue,
      'updatedFrom': updatedFrom
    }
  });

  element.dispatchEvent(evt);
}

/**
 * @ignore
 */
function _enumMetadataProperty(metadata, property, callback)
{
  if (!metadata)
  {
    return;
  }

  var properties  = metadata[property] || {};

  var names = Object.keys(properties);
  names.forEach(
    function(name)
    {
      callback(name, properties[name]);
    }
  );
}

/**
 * @ignore
 */
function _resetElement(element, metadata)
{
  ['methods', 'properties'].forEach(
    function(type)
    {
      _enumMetadataProperty(metadata, type,
        function(name)
        {
          delete element[name];
        }
      );
    }
  );
}
/**
 * @ignore
 */
function _isSlotAssignable(node)
{
  return node.nodeType === 1 || node.nodeType === 3;
}

/**
 * @ignore
 */
function _createSlotMap(element)
{
  var slotMap = {};
  var childNodeList = element.childNodes;
  for (var i = 0; i < childNodeList.length; i++)
  {
    var child = childNodeList[i];
    // Only assign Text and Element nodes to a slot
    if (_isSlotAssignable(child))
    {
      // Ignore text nodes that only contain whitespace
      if (child.nodeType === 3 && !child.nodeValue.trim())
      {
        continue;
      }

      // Text nodes and elements with no slot attribute map to the default slot
      var savedSlot = child['__oj_slots'];
      var slot = savedSlot != null ? savedSlot : child.getAttribute && child.getAttribute('slot');
      if (!slot)
        slot = '';

      if (!slotMap[slot])
      {
        slotMap[slot] = [];
      }
      slotMap[slot].push(child);
    }
  }
  return slotMap;
}

/**
 * @ignore
 */
function _storeNodes(element, view)
{
  var nodeStorage;
  var childNodes = element.childNodes;
  if (childNodes)
  {
    nodeStorage = document.createElement('div');
    nodeStorage.setAttribute('data-bind', '_ojNodeStorage_')
    nodeStorage.style.display = 'none';
    view.push(nodeStorage);
    var assignableNodes = [];
    for (var i = 0; i < childNodes.length; i++)
    {
      var node = childNodes[i];
      if (_isSlotAssignable(node))
      {
        assignableNodes.push(node);
      }
    }
    assignableNodes.forEach(function (node) {
      nodeStorage.appendChild(node);
    });
  }
  return nodeStorage;
}

/**
 * @ignore
 */
function _getUnique()
{
  return _UNIQUE + _UNIQUE_INCR++;
}

/**
 * @ignore
 */
function _fireEvent(type, element)
{
  element.dispatchEvent(new CustomEvent(type, {bubbles: true}));
}

var _UNIQUE_INCR = 0;
var _UNIQUE = '_ojcomposite';

});
