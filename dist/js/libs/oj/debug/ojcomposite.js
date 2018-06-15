/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'promise', 'ojs/ojcustomelement', 'ojs/ojcomposite-knockout'], function(oj)
{
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
 * Registration is done via the <a href="#register">oj.Composite.register</a> API.
 * By registering a composite component, an application links an HTML tag with provided
 * Metadata, View, ViewModel and CSS which will be used to render the composite. These optional
 * pieces can be provided via a descriptor object passed into the register API. See below for sample loader.js file configurations.
 * </p>
 *
 * Note that in this example we are using require-css, a RequireJS plugin for loading css which will load the styles within our page
 * so we do not need to pass any css into the register call. This is the recommended way to load CSS, especially for cases
 * where the composite styles contain references to any external resources.
 * <pre class="prettyprint"><code>
 * define(['text!./my-chart.html', './my-chart', 'text!./my-chart.json', 'css!./my-chart'],
 *   function(view, viewModel, metadata) {
 *     oj.Composite.register('my-chart',
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
 *       metadata: JSON.parse(metadata),
 *       view: view,
 *       viewModel: viewModel,
 *       parseFunction: myChartParseFunction
 *     });
 *   }
 * );
 * </code></pre>
 *
 * <h2 id="usage">Usage
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
 * <p>
 *   The upgrade of JET composite elements relies on any data binding resolving, the management of which is done by a binding provider. 
 *   The binding provider is responsible for setting and updating attribute expressions and any custom elements within its managed 
 *   subtree will not finish upgrading until it applies bindings on that subtree. By default, there is a single binding provider for a page, 
 *   but subtree specific binding providers can be added by using the <code>data-oj-binding-provider</code> attribute with values of 
 *   "none" and "knockout". The default binding provider is knockout, but if a page or DOM subtree does not use any expression syntax or 
 *   knockout, the application can set <code>data-oj-binding-provider="none"</code> on that element so its dependent JET composite custom 
 *   elements do not need to wait for bindings to be applied to finish upgrading.
 * </p>
 * <pre class="prettyprint"><code>
 * &lt;my-chart type="bubble" data="{{dataModel}}">&lt;/my-chart>
 * </code></pre>
 *
 * <h2 id="metadata">Metadata
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#metadata"></a>
 * </h2>
 * <p>The composite Metadata is a JSON formatted object which defines the properties, methods, slots, and events fired by
 *  the composite. <b>The name of the composite component properties, event listeners, and methods should avoid collision 
 *  with the existing <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement">HTMLElement</a> properties, 
 *  event listeners, and methods. Additionally, the composite should not re-define any
 *  <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes">global attributes</a> or events.</b></p>
 *  
 * <p>The Metadata JSON object should have the following required properties: "name", "version", "jetVersion" and 
 *  the following optional properties: "description", "dependencies", "icon", "displayName", "properties", "methods", "events", or "slots". 
 *  See the tables below for descriptions of these properties. The Metadata can be extended by appending any extra information in an "extension" 
 *  field except at the first level of the "properties", "methods", "events" or "slots" objects. Any metadata in an extension field will be ignored.</p>
 *  
 * <p>Keys defined in the "properties" top level object should map to the composite component's properties following
 *  the same naming convention described in the <a href="#attr-to-prop-mapping">Property-to-Attribute mapping</a> section.
 *  Non expression bound composite component attributes will be correctly evaluated only if they are a primitive JavaScript type (boolean, number, string)
 *  or a JSON object. Note that JSON syntax requires that strings use double quotes. Attributes evaluating to any other types must be bound via expression syntax.  
 *  Boolean attributes are considered true if set to the case-insensitive attribute name, the empty string or have no value assignment. 
 *  JET composite components will also evalute boolean attributes set explicitly to 'true' or 'false' to their respective boolean values. All other values are invalid.</p>
 *  
 * <p>Not all information provided in the Metadata is required at run time and those not indicated to be required at run time in the tables
 *  below can be omitted to reduce the Metadata download size. Any non run time information can be used for design time tools and property editors and could
 *  be kept in a separate JSON file which applications can use directly or merge with the run time metadata as needed, but would not be required by the loader.js
 *  file. For methods and events, only the method/event name is required at run time.</p>
 *
 * <h3>Metadata Properties</h3>
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
 *       <td>The component tag name.
 *           The component name must meet the following requirements (based upon the <a href="https://www.w3.org/TR/custom-elements/#custom-elements-core-concepts">W3C Custom Element spec</a>):
 *           <ul>
 *             <li>The name can include only letters, digits, '-', and '_'.</li>
 *             <li>The letters in the name should be all lowercase.
 *             <li>At least one hyphen is required.
 *             <li>The first segment (up to the first hyphen) is supposed to be a namespace prefix. The prefix 'oj' is reserved for native JET components.
 *             <li>The first hyphen must be followed by at least one character.
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
 *             <ul>
 *           <ul> 
 *       </td>
 *     </tr>
 *     <tr>
 *       <td class="rt">version</td>
 *       <td>yes</td>
 *       <td>yes</td>
 *       <td>{string}</td>
 *       <td>The component version. Note that changes to the metadata even for minor updates like updating the
 *         jetVersion should result in at least a minor composite version change, e.g. 1.0.0 -> 1.0.1.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">jetVersion</td>
 *       <td>yes</td>
 *       <td>yes</td>
 *       <td>{string}</td>
 *       <td>The <a href="http://semver.org/">semantic version</a> of the supported JET version(s). 
 *         Composite authors should not specify a semantic version range that includes unreleased JET major versions
 *         as major releases may contain non backwards compatible changes. Authors should instead recertify composites 
 *         with each major release and update the composite metadata or release a new version that is compatible with the new
 *         release changes.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">properties</td>
 *       <td>yes</td> 
 *       <td>no</td>
 *       <td>{Object<string,<string>}</td>
 *       <td>See <a href="#properties-table">Properties</a> table below for details.</td>
 *     </tr> 
*     <tr>
 *       <td class="rt">methods</td>
 *       <td>yes</td>
 *       <td>no</td>
 *       <td>{Object<string,<string>}</td>
 *       <td>See <a href="#methods-table">Methods</a> table below for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">events</td>
 *       <td>yes</td> 
 *       <td>no</td>
 *       <td>{Object<string,<string>}</td>
 *       <td>See <a href="#events-table">Events</a> table below for details.</td>
 *     </tr>
 *     <tr>
 *       <td class="rt">slots</td>
 *       <td>yes</td>
 *       <td>no</td>
 *       <td>{Object<string,<string>}</td>
 *       <td>See <a href="#slots-table">Slots</a> table below for details.</td>
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
 *       <td>Dependency to semantic version mapping for composite dependencies. 
 *         3rd party libraries should not be included in this mapping.
 *         <code>{"composite1": "1.2.0", "composite2": ">=2.1.0"}</code></td> 
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
 *       <td>{Array<{Object}>}</td>
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
 *               <td>{Array<{string}>}</td>
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
 *   </tbody>
 * </table>
 *
 * <h3 id="properties-table">Properties</h3>
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
 *                 be set using dot notation in the attribute. See the <a href="#subproperties">Subproperties</a> section for more details on 
 *                 working with subproperties.</td>
 *             </tr>
 *             <tr>
 *               <td class="rt">readOnly</td>
 *               <td>yes</td>
 *               <td>{boolean}</td>
 *               <td>Determines whether a property can be updated outside of the ViewModel.
 *                 False by default. If readOnly is true, the property can only be updated by the ViewModel or by the
 *                 components within the composite. This property only needs to be defined for the top level property, 
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
 *               <td>An optional default value for a property. Only supported on the top level property and will not be evaluated if set on nested subproperties.</td>
 *             </tr>
 *             <tr>
 *               <td class="rt">writeback</td>
 *               <td>yes</td>
 *               <td>{boolean}</td>
 *               <td>Determines whether an expression bound to this property should be written back to. False by default.
 *                 If writeback is true, any updates to the property will result in an update to the expression. This property only needs to be defined
 *                 for the top level property, with subproperties inheriting that value.</td>
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
 *               <td>Additional design time metadata that enhances the <code>enumValues</code> run time metadata. 
 *                   The value is an Object with properties matching the values in the <code>enumValues</code> array. 
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
 *                   is eligible to be included when application resources are translated for Internationalization. False by default.
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
 * <h3 id="methods-table">Methods</h3>
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
 * <h3 id="events-table">Events</h3>
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
 *               <td>Describes the properties available on the the event's detail property, which contains data passed
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
 * <h3 id="slots-table">Slots</h3>
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
 *
 * <h3>Example of Run Time Metadata</h3>
 * <p>The JET framework will ignore "extension" fields. Extension fields cannot be defined at 
 *   the first level of the "properties", "methods", "events", or "slots" objects.</p>
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
 * <h2 id="properties">Properties
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#properties"></a>
 * </h2>
 * <p>
 * Properties defined in provided Metadata will be made available through the <code>$properties</code> property of the View binding context
 * and through the <code>properties</code> property on the context passed to the provided ViewModel constructor function or lifecycle listeners. 
 * The application can access the composite component properties by accessing them directly from the 
 * DOM element. Using the DOM setAttribute and removeAttribute APIs will also result in property updates. Changes made to properties will
 * result in a [property]Changed event being fired for that property if the property was modified internally by the composite or externally
 * by the application if the composite has been upgraded and its busy state resolved. Early property sets before the composite has been upgraded
 * while allowed, will not result in [property]Changed events and will be passed to the component as part of its initial state.
 * </p>
 *
 * <h3 id="attr-to-prop-mapping">Property-to-Attribute Mapping
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#attr-to-prop-mapping"></a>
 * </h3>
 * <p>
 * The following rules apply when mapping property to attribute names:
 * 
 * <ul>
 *  <li>Attribute names are case insensitive. CamelCased properties are mapped to 
 *    kebab-cased attribute names by inserting a dash before the uppercase letter and converting that letter to lower case, 
 *    e.g. a "chartType" property will be mapped to a "chart-type" attribute.</li>
 *  <li> The reverse occurs when mapping a property name from an attribute name.</li>
 * </ul>
 * </p>
 *
 * <h3 id="subproperties">Subproperties
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#subproperties"></a>
 * </h3>
 * <p>
 * Subproperties can be exposed and documented by adding nested properties objects in the composite <a href="#metadata">metadata</a>. Event listeners
 * should be added for the top level property, with applications checking the event's <a href="#events">subproperty</a> field to access information about the
 * subproperty changes. Subproperties can be set declaratively using dot notation, e.g. person.first-name="{{name}}".  Setting overlapping attributes, 
 * e.g. person="{{personInfo}}" person.first-name="{{name}}" will cause an error to be thrown.
 * </p> 
 * 
 * <p>Subproperties can also be set programmatically using the <code>set/getProperty</code> methods. 
 * Note that while setting the subproperty using dot notation via the element's top level property is allowed, the setProperty method must be used in order
 * to trigger a property change event.
 * <pre class="prettyprint"><code>
 * element.setProperty("person.firstName", Fred);
 * var firstName = element.getProperty("person.firstName");
 * </code></pre>
 * </p>
 * 
 * <h2 id="styling">Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling"></a>
 * </h2>
 * <p>
 * Composite component styling can be done via provided css. The JET framework will add the <code>oj-complete</code> class to the composite DOM 
 * element after metadata properties have been resolved. To prevent a flash of unstyled content before the composite properties have been setup, 
 * the composite css can include the following rule to hide the composite until the <code>oj-complete</code> class is set on the element.
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
 * <h2 id="events">Events
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events"></a>
 * </h2>
 * <p>
 * Composite components fire the following events. Any custom composite events should be created and fired by the composite's ViewModel and documented in the metadata
 * for design and run time environments as needed.  In addition to standard add/removeEventListener syntax, declarative event listeners will also be supported for
 * custom composite events and [property]Changed events.  As a result, if a composite declares an event of type "customType", applications can listen by setting the
 * "onCustomType" property or the "on-custom-type" attribute.  Similarly, property change listeners can be set via the appropriate "on[property]Changed" property or
 * "on-[property-name]-changed" attribute. Expression syntax can be used in the on-[event-name] attributes, but we do not support executing arbitrary JavaScript like those for
 * native event attributes like onclick.
 * <ul>
 *  <li><b><i>[property]Changed</i></b> - Fired when a property is modified and contains the following fields in its event detail object:
 *    <ul>
 *      <li>previousValue - The previous property value</li>
 *      <li>value - The new property value</li>
 *      <li>updatedFrom - Where the property was updated from. Supported values are:
 *        <ul>
 *          <li>internal - The View or ViewModel</li>
 *          <li>external - The DOM Element either by its property setter, setAttribute, or external data binding.</li>
 *        </ul>
 *      </li>
 *      <li>subproperty - An object containing information about the subproperty that changed with the following fields:
 *        <ul>
 *          <li>path - The subproperty path that changed</li>
 *          <li>previousValue - The previous subproperty value</li>
 *          <li>value - The new subproperty value</li>
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
 * be treated as a singleton instance. <b>The Object instance return type for the ViewModel
 * is deprecated in 5.0.0.</b>
 *
 * <h4 class="name">initialize<span class="signature">(context)</span></h4>
 * <p>
 * <b>Deprecated since 5.0.0.</b> This optional method may be implemented on the ViewModel to perform initialization tasks.
 * This method will be invoked only if the ViewModel specified during registration is an object instance as opposed to a constructor function.
 * If the registered ViewModel is a constructor function, the same context object will be passed to the constructor function instead.
 * This method can return 1) nothing in which case the original model instance will be used, 2) a new model instance which will replace the original, 
 * or 3) a Promise which resolves to a new model instance which will replace the original and delay additional lifecycle phases until it is resolved.
 * </p>
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
 *                <td class="name"><code>properties</code></td>
 *                <td>Object</td>
 *                <td>A map of the composite component's current properties and values.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>props</code></td>
 *                <td>Promise</td>
 *                <td><b>Deprecated: use properties instead.</b> A Promise evaluating to the composite component's properties.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotNodeCounts</code></td>
 *                <td>Promise</td>
 *                <td><b>Deprecated: use slotCounts instead.</b>A Promise evaluating to a map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotCounts</code></td>
 *                <td>Object</td>
 *                <td>A map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>unique</code></td>
 *                <td>string</td>
 *                <td>A unique string that can be used for unique id generation.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>uniqueId</code></td>
 *                <td>string</td>
 *                <td>The ID of the composite component if specified. Otherwise, it is the same as <code>unique</code>.</td>
 *              </tr>
 *            </tbody>
 *          </table>
 *        </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h4 class="name">activated<span class="signature">(context)</span></h4>
 * <p>
 * This optional method may be implemented on the ViewModel and will be invoked after the ViewModel is initialized.
 * This method can return a Promise which will delay additional lifecycle phases until it is resolved and can be used 
 * as a hook for data fetching.
 * </p>
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
 *                <td class="name"><code>properties</code></td>
 *                <td>Object</td>
 *                <td>A map of the composite component's current properties and values.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>props</code></td>
 *                <td>Promise</td>
 *                <td><b>Deprecated: use properties instead.</b> A Promise evaluating to the composite component's properties.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotNodeCounts</code></td>
 *                <td>Promise</td>
 *                <td><b>Deprecated: use slotCounts instead.</b>A Promise evaluating to a map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotCounts</code></td>
 *                <td>Object</td>
 *                <td>A map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>unique</code></td>
 *                <td>string</td>
 *                <td>A unique string that can be used for unique id generation.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>uniqueId</code></td>
 *                <td>string</td>
 *                <td>The ID of the composite component if specified. Otherwise, it is the same as <code>unique</code>.</td>
 *              </tr>
 *            </tbody>
 *          </table>
 *        </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h4 class="name">attached<span class="signature">(context)</span></h4>
 * <p>
 * This optional method is deprecated in 4.2.0 in favor of the connected method. This method is invoked after the
 * View is inserted into the DOM and will only be called once. Note that if the composite needs to add/remove event listeners,
 * we recommend using the connected/disconnected methods.
 * </p>
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
 *                <td class="name"><code>properties</code></td>
 *                <td>Object</td>
 *                <td>A map of the composite component's current properties and values.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>props</code></td>
 *                <td>Promise</td>
 *                <td><b>Deprecated: use properties instead.</b> A Promise evaluating to the composite component's properties.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotNodeCounts</code></td>
 *                <td>Promise</td>
 *                <td><b>Deprecated: use slotCounts instead.</b>A Promise evaluating to a map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotCounts</code></td>
 *                <td>Object</td>
 *                <td>A map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>unique</code></td>
 *                <td>string</td>
 *                <td>A unique string that can be used for unique id generation.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>uniqueId</code></td>
 *                <td>string</td>
 *                <td>The ID of the composite component if specified. Otherwise, it is the same as <code>unique</code>.</td>
 *              </tr>
 *            </tbody>
 *          </table>
 *        </td>
 *     </tr>
 *   </tbody>
 * </table>
 * 
 * <h4 class="name">connected<span class="signature">(context)</span></h4>
 * <p>
 * This optional method may be implemented on the ViewModel and will be invoked after the View is first inserted into the DOM and then
 * each time the composite is reconnected to the DOM after being disconnected. Note that if the composite needs to add/remove event listeners,
 * we recommend using this and the disconnected methods.
 * </p>
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
 *                <td class="name"><code>properties</code></td>
 *                <td>Object</td>
 *                <td>A map of the composite component's current properties and values.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>props</code></td>
 *                <td>Promise</td>
 *                <td><b>Deprecated: use properties instead.</b> A Promise evaluating to the composite component's properties.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotNodeCounts</code></td>
 *                <td>Promise</td>
 *                <td><b>Deprecated: use slotCounts instead.</b>A Promise evaluating to a map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotCounts</code></td>
 *                <td>Object</td>
 *                <td>A map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>unique</code></td>
 *                <td>string</td>
 *                <td>A unique string that can be used for unique id generation.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>uniqueId</code></td>
 *                <td>string</td>
 *                <td>The ID of the composite component if specified. Otherwise, it is the same as <code>unique</code>.</td>
 *              </tr>
 *            </tbody>
 *          </table>
 *        </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h4 class="name">bindingsApplied<span class="signature">(context)</span></h4>
 * <p>
 * This optional method may be implemented on the ViewModel and will be invoked after the bindings are applied on this View.
 * </p>
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
 *                <td class="name"><code>properties</code></td>
 *                <td>Object</td>
 *                <td>A map of the composite component's current properties and values.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>props</code></td>
 *                <td>Promise</td>
 *                <td><b>Deprecated: use properties instead.</b> A Promise evaluating to the composite component's properties.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotNodeCounts</code></td>
 *                <td>Promise</td>
 *                <td><b>Deprecated: use slotCounts instead.</b>A Promise evaluating to a map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>slotCounts</code></td>
 *                <td>Object</td>
 *                <td>A map of slot name to assigned nodes count for the View.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>unique</code></td>
 *                <td>string</td>
 *                <td>A unique string that can be used for unique id generation.</td>
 *              </tr>
 *              <tr>
 *                <td class="name"><code>uniqueId</code></td>
 *                <td>string</td>
 *                <td>The ID of the composite component if specified. Otherwise, it is the same as <code>unique</code>.</td>
 *              </tr>
 *            </tbody>
 *          </table>
 *        </td>
 *     </tr>
 *   </tbody>
 * </table>
 * 
 * <h4 class="name">propertyChanged<span class="signature">(context)</span></h4>
 * <p>
 * This optional method may be implemented on the ViewModel and will be invoked when properties are updated before the [property]Changed event is fired.
 * </p>
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
 *       <td>property</td>
 *       <td>string</td>
 *       <td>The property that changed.</td>
 *     </tr>
 *     <tr>
 *       <td>value</td>
 *       <td>*</td>
 *       <td>The current value of the property that changed.</td>
 *     </tr>
 *     <tr>
 *       <td>previousValue</td>
 *       <td>*</td>
 *       <td>The previous value of the property that changed.</td>
 *     </tr>
 *     <tr>
 *       <td>updatedFrom</td>
 *       <td>string</td>
 *       <td>
 *         Where the property was updated from. Supported values are:
 *         <ul>
 *           <li>external - By the application, using either the element's property setter, setAttribute, or external data binding.</li>
 *           <li>internal - By the component, e.g. after user interaction with a text field or selection.</li>
 *         </ul>  
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>subproperty</td>
 *       <td>Object</td>
 *       <td>An object holding information about the subproperty that changed.
 *         <table class="props">
 *           <thead>
 *             <tr>
 *               <th>Name</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td>path</td>
 *               <td>string</td>
 *               <td>
 *                 The subproperty path that changed, starting from the top level 
 *                 property with subproperties delimited by '.'.
 *               </td>
 *             </tr>
 *             <tr>
 *               <td>value</td>
 *               <td>*</td>
 *               <td>The current value of the subproperty that changed.</td>
 *             </tr>
 *             <tr>
 *               <td>previousValue</td>
 *               <td>*</td>
 *               <td>The previous value of the subproperty that changed.</td>
 *             </tr>
 *           </tbody>
 *         </table>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 * 
 * <h4 class="name">detached<span class="signature">(element)</span></h4>
 * <p>
 * This method is deprecated in 4.2.0 to the renamed disconnected method with the same behavior.
 * This optional method may be implemented on the ViewModel and will be invoked when this composite component is detached from the DOM.
 * </p>
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
 *
 * 
 * <h4 class="name">disconnected<span class="signature">(element)</span></h4>
 * <p>
 * This optional method may be implemented on the ViewModel and will be invoked when this composite component is disconnected from the DOM.
 * </p>
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
 * be updated. Please note that this will cause the expression and property values to be out of sync until the salesData expression is updated in the
 * application's ViewModel. Alternatively, if the 'axisLabels' property is updated by the ViewModel, both the 'axisLabel' property and the 
 * showAxisLabels expression will contain the updated value.
 * <pre class="prettyprint"><code>
 * &lt;my-chart data="[[salesData]]" axis-labels={{showAxisLabels}} ... >
 * &lt;/my-chart>
 * </code></pre>
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
 * The View can also contain slots where application provided DOM can go. Complex composite components which can contain additional composites 
 * and/or content for child facets defined in its associated View can be constructed via slotting. There are two ways to define a composite's 
 * slots, using either an <a href="oj.ojBindSlot.html">oj-bind-slot</a> or an <a href="oj.ojBindTemplateSlot.html">oj-bind-template-slot</a> 
 * element to indicate that that slot's content will be stamped using an application provided template. See the relevant slot API docs for 
 * more information.
 * </p>
 *
 * <h2 id="bindorder-section">
 *   Binding Order
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#bindorder-section"></a>
 * </h2>
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
 * @namespace
 * @since 2.0
 */
oj.Composite = {};

/**
 * Returns a Promise resolving with the composite metadata with the given name or null if the composite has not been registered.
 * @param {string} name The component name, which should contain a dash '-' and not be a reserved tag name.
 * @return {Promise|null}
 * @ojdeprecated {since: '5.0.0', description: 'Use oj.Composite.getComponentMetadata instead.'}
 * 
 * @export
 * @memberof oj.Composite
 *
 */
oj.Composite.getMetadata = function(name)
{
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
 *
 */
oj.Composite.getComponentMetadata = function(name)
{
  // We have one registry where custom elements, definitional elements, and composites are all stored with
  // the JET framework so we need to check to see if the element is a composite before returning its metadata
  var info = oj.BaseCustomElementBridge.getRegistered(name);
  if (info && info.composite)
  {
    // Descriptor is guaranteed to be there for registered elements because we throw an error at registration
    // time if none is given
    var descriptor = oj.BaseCustomElementBridge.__GetDescriptor(name);
    return descriptor[oj.BaseCustomElementBridge.DESC_KEY_META];
  }
  return null;
};

/**
 * Registers a composite component
 * @param {string} name The component name, which should contain a dash '-' and not be a reserved tag name.
 * @param {Object} descriptor The registration descriptor. The descriptor will contain keys for Metadata, View, ViewModel
 * and CSS that are detailed below. At a minimum a composite must register Metadata and View files, but all others are optional.
 * The composite resources should be mapped directly to each descriptor key. The support for an object with an 'inline' key mapped
 * to the resource has been deprecated in 5.0.0.
 * See the <a href="#registration">registration section</a> above for a sample usage.
 * @param {Object} descriptor.metadata A JSON formatted object describing the composite APIs. See the <a href="#metadata">metadata documentation</a> for more info.
 * @param {string} descriptor.view A string, array of DOM nodes, or document fragment representing the HTML that will be used for the composite.
 *                                 <b>The array of DOM nodes and document fragment types are deprecated in 5.0.0.</b>
 * @param {string} descriptor.css (Deprecated) A string containing the composite CSS. <b>Note that this key should not be used if the composite
 *                                styles contain references to any external resources and is deprecated in 4.1.0. require-css, a RequireJS CSS plugin, is the
 *                                current recommendation for CSS loading.</b>
 * @param {Object} descriptor.viewModel This option is only applicable to composites hosting a Knockout template
 *                                      with a ViewModel and ultimately resolves to a constructor function or object instance. 
 *                                      <b>The Object instance return type for the ViewModel is deprecated in 5.0.0.</b>
 *                                      If the initial ViewModel resolves to an object instance, the initialize lifecycle listener 
 *                                      will be called. See the <a href="#lifecycle">initialize documentation</a> for more information.
 * @param {function(string, string, Object, function(string))} descriptor.parseFunction The function that will be called to parse attribute values.
 *                                                              Note that this function is only called for non bound attributes. The parseFunction will take the following parameters:
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
oj.Composite.getContainingComposite = function(node, stopBelow)
{
  var composite = null;
 
  while(node)
  {
    node = oj.CompositeTemplateRenderer.getEnclosingComposite(node);
    //: we should ignore oj-module component since it is not a relevant enclosing composite for this call
    if (node && node.nodeName.toLowerCase() !== 'oj-module')
    {
      if (stopBelow && !(node.compareDocumentPosition(stopBelow) & 16/*contained by*/))
      {
        break;
      }
      composite = node;
    }
  }
 
  return composite;
};


/**
 * @ignore
 */
oj.Composite.getBindingProviderName = function(elem)
{
  return (elem ? elem[oj.Composite.__BINDING_PROVIDER] : null);
}

/**
 * @ignore
 */
oj.Composite.__COMPOSITE_PROP = '__oj_composite';

/**
 * @ignore
 */
oj.Composite.__BINDING_PROVIDER = '__oj_binding_prvdr';

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
  beforePropertyChangedEvent: function(element, property, detail)
  {
    var vmContext = {'property': property};
    oj.CollectionUtils.copyInto(vmContext, detail, undefined, true);
    oj.CompositeTemplateRenderer.invokeViewModelMethod(this._VIEW_MODEL, 'propertyChanged', [vmContext]);
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
    proto.getSubIdByNode = function(node) {
      var bridge = oj.BaseCustomElementBridge.getInstance(this);
      var viewModel = bridge._getViewModel(this);
      if (viewModel.getSubIdByNode)
        return viewModel.getSubIdByNode(node, bridge._getSubIdByNode.bind(this));
      else
        return bridge._getSubIdByNode.bind(this)(node);
    };
  },

  CreateComponent: function(element) 
  {
    // Setup the ViewModel context to pass to lifecycle listeners
    var slotNodeCounts = {};
    // Generate slot map before we update DOM with view nodes
    var slotMap = oj.BaseCustomElementBridge.getSlotMap(element, true);
    for (var slot in slotMap)
      slotNodeCounts[slot] = slotMap[slot].length;
    this._SLOT_MAP = slotMap;
    var vmContext = {
      'element': element,
      'props': Promise.resolve(this._PROPS),
      'properties': this._PROPS,
      'slotNodeCounts': Promise.resolve(slotNodeCounts),
      'slotCounts': slotNodeCounts,
      'unique': oj.BaseCustomElementBridge.__GetUnique()
    };
    vmContext['uniqueId'] = element.id ? element.id : vmContext['unique'];
    this._VM_CONTEXT = vmContext;

    var model = oj.BaseCustomElementBridge.__GetDescriptor(element.tagName)[oj.BaseCustomElementBridge.DESC_KEY_VIEW_MODEL];
    if (typeof model === 'function')
      model = new model(vmContext);
    else // The initialize callback is deprecated in 5.0.0. If the function returns a value, use it as the new model instance.
      model = oj.CompositeTemplateRenderer.invokeViewModelMethod(model, 'initialize', [vmContext]) || model;
    this._VIEW_MODEL = model;

    // This method can return a Promise which will delay additional lifecycle phases until it is resolved.
    var activatedPromise = oj.CompositeTemplateRenderer.invokeViewModelMethod(model, 'activated', [vmContext]) || Promise.resolve(true);

    var bridge = this;
    activatedPromise.then(function(values)
    {
      var params = {
        props: bridge._PROPS,
        slotMap: bridge._SLOT_MAP,
        slotNodeCounts: slotNodeCounts,
        unique: bridge._VM_CONTEXT['unique'],
        uniqueId: bridge._VM_CONTEXT['uniqueId'],
        viewModel: bridge._VIEW_MODEL,
        viewModelContext: bridge._VM_CONTEXT
      };
      
      // Store the name of the binding provider on the element when we are about 
      // to insert the view. This will allow custom elements within the view to look
      // up the binding provider used by the composite (currently only KO).
      Object.defineProperty(element, oj.Composite.__BINDING_PROVIDER, {value: 'knockout'});

      if (oj.Components)
      {
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
      bridge._throwError(element, reason);
    });
  },

  DefineMethodCallback: function (proto, method, methodMeta) 
  {
    proto[method] = function()
    {
      var methodName = methodMeta['internalName'] || method;
      var bridge = oj.BaseCustomElementBridge.getInstance(this);
      var viewModel = bridge._getViewModel(this);
      return viewModel[methodName].apply(viewModel, arguments);
    };
  },
  
  DefinePropertyCallback: function (proto, property, propertyMeta) 
  {
    var set = function(value, bOuterSet)
    {
      // Properties can be set before the component is created. These early
      // sets are actually saved until after component creation and played back.
      if (!this._BRIDGE.SaveEarlyPropertySet(property, value))
      {
        // Property trackers are observables are referenced when the property is set or retrieved,
        // which allows us to automatically update the View when the property is mutated.
        var propertyTracker = oj.CompositeElementBridge._getPropertyTracker(this._BRIDGE, property);
        var previousValue = propertyTracker.peek();
        if (!oj.BaseCustomElementBridge.__CompareOptionValues(property, propertyMeta, value, previousValue)) // We should consider supporting custom comparators
        {
          // Skip validation for inner sets so we don't throw an error when updating readOnly writeable properties
          if (bOuterSet)
            value = this._BRIDGE.ValidatePropertySet(this._ELEMENT, property, value)

          if (propertyMeta._eventListener)
          {
            this._BRIDGE.SetEventListenerProperty(this._ELEMENT, property, value);
          }
          propertyTracker(value);

          if (!propertyMeta._derived)
          {
            var updatedFrom = bOuterSet ? 'external' : 'internal';
            oj.BaseCustomElementBridge.__FirePropertyChangeEvent(this._ELEMENT, property, value, previousValue, updatedFrom);
          }
        }
      }
    }

    // Called on the ViewModel props object
    var innerSet = function(value)
    {
      set.bind(this)(value, false);
    }

    // Called on the custom element
    var outerSet = function(value)
    {
      var bridge = oj.BaseCustomElementBridge.getInstance(this);
      set.bind(bridge._PROPS)(value, true);
    }

    var get = function(bOuterSet)
    {
      var propertyTracker = oj.CompositeElementBridge._getPropertyTracker(this._BRIDGE, property);
      // If the attribute has not been set, return the default value
      // Calling .peek() lets us check the propertyTracker value without creating a dependency
      var value = bOuterSet ? propertyTracker.peek() : propertyTracker();
      if (value === undefined)
      {
        value = propertyMeta['value'];
        // Make a copy if the default value is an Object or Array to prevent modification
        // of the metadata copy and store in the propertyTracker so we have a copy
        // to modify in place for the object case
        if (Array.isArray(value))
          value = value.slice();
        else if (typeof value === 'object')
          value = oj.CollectionUtils.copyInto({}, value, undefined, true);
        propertyTracker(value);
      }
      return value;
    }

    // Called on the ViewModel props object
    var innerGet = function()
    {
      return get.bind(this, false)();
    }

    // Called on the custom element
    var outerGet = function()
    {
      var bridge = oj.BaseCustomElementBridge.getInstance(this);
      return get.bind(bridge._PROPS, true)();
    }

    // Don't add event listener properties for inner props
    if (!propertyMeta._derived)
      oj.BaseCustomElementBridge.__DefineDynamicObjectProperty(proto['_propsProto'], property, innerGet, innerSet);
    oj.BaseCustomElementBridge.__DefineDynamicObjectProperty(proto, property, outerGet, outerSet);
  },

  GetMetadata: function(descriptor)
  {
    // Composites have a public getMetadata API so we cannot directly modify the
    // original metadata object when we add additional info for on[PropertyName] properties
    return descriptor['_metadata'];
  },

  HandleDetached: function(element) 
  {
    // Invoke callback on the superclass
    oj.BaseCustomElementBridge.proto.HandleDetached.call(this, element);
    
    // Detached is deprecated in 4.2.0 for disconnected
    oj.CompositeTemplateRenderer.invokeViewModelMethod(this._VIEW_MODEL, 'detached', [element]);
    oj.CompositeTemplateRenderer.invokeViewModelMethod(this._VIEW_MODEL, 'disconnected', [element]);
  },  

  HandleReattached: function(element) {
    // Invoke callback on the superclass
    oj.BaseCustomElementBridge.proto.HandleReattached.call(this, element);

    oj.CompositeTemplateRenderer.invokeViewModelMethod(this._VIEW_MODEL, 'connected', [this._VM_CONTEXT]);
  },

  InitializeElement: function(element)
  {
    // Invoke callback on the superclass
    oj.BaseCustomElementBridge.proto.InitializeElement.call(this, element);

    if (oj.Components)
      oj.Components.markPendingSubtreeHidden(element);

    // Cache the View
    var cache = oj.BaseCustomElementBridge.__GetCache(element.tagName);
    if (!cache.view)
    {
      var view = oj.BaseCustomElementBridge.__GetDescriptor(element.tagName)[oj.BaseCustomElementBridge.DESC_KEY_VIEW];
      // when multiple instances of the same CCA are on the same page, because of the async 
      // nature, we could end up with multiple promises created on the same view. The first
      // resolved promise will set up cache.view, all others should just use the cached 
      // view instead of parsing it again. So here we check existence of cache in the resolve
      // callback to avoid parsing the view multiple times.
      if (!cache.view) 
      {
        if (typeof(view) === 'string')
          cache.view = oj.CompositeElementBridge._getDomNodes(view, element);
        cache.view = view;
      }
    }
    
    // Cache the CSS
    if (!cache.css)
    {
      // The CSS Promise will be null if loaded by the require-css plugin
      var css = oj.BaseCustomElementBridge.__GetDescriptor(element.tagName)[oj.BaseCustomElementBridge.DESC_KEY_CSS];
      // CSS is optional so we need to check if it was provided
      if (css)
      {
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) // for IE
          style.styleSheet.cssText = css;
        else
          style.appendChild(document.createTextNode(css)); // @HTMLUpdateOK
        document.head.appendChild(style); // @HTMLUpdateOK
        // Set a flag that we've already processed and appended the style to the 
        // document head so we only do this once for all composite instances
        cache.css = true;
      }
    }

    // Loop through all element attributes to get initial properties
    oj.BaseCustomElementBridge.__InitProperties(element, this._PROPS);
  },

  InitializePrototype: function(proto)
  {
    // Invoke callback on the superclass
    oj.BaseCustomElementBridge.proto.InitializePrototype.call(this, proto);
    
    Object.defineProperty(proto, '_propsProto', {value: {}});
  },

  InitializeBridge: function(element)
  {
    // Invoke callback on the superclass
    oj.BaseCustomElementBridge.proto.InitializeBridge.call(this, element);
    
    if (element['_propsProto'])
    {
      this._PROPS = Object.create(element['_propsProto']);
      this._PROPS._BRIDGE = this;
      this._PROPS._ELEMENT = element;
    }
  },

  _getNodeBySubId: function(locator) 
  {
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
    var match = map[locator['subId']];
    if (match)
    {
      if (match['alias']) // Case #1
      {
        var clone = oj.CollectionUtils.copyInto({}, locator, undefined, true)
        clone['subId'] = match['alias'];
        var component = match['node'];
        // Check to see if we should call the method on the element or widget
        if (component.getNodeBySubId) 
        {
          return component.getNodeBySubId(clone);
        } 
        else 
        {
          return oj.Components.__GetWidgetConstructor(component)('getNodeBySubId', clone);
        }
      }
      else
      {
        return match['node']; // Case #2
      }
    }

    return null; // Case #3
  },

  _getSubIdByNode: function(node)
  {
    // The node can fall into one of 3 categories below:
    // 1) The node is not a child of this composite.
    // 2) The node is a child of an inner composite and we need to convert its aliased subId
    // 3) The node is a child of this composite
    // 3a) The node is mapped directly to a subId
    // 3b) The node is owned by an element that has a getSubIdByNode method and we need to convert its aliased subId
  
    // Case #1
    if (!this.contains(node))
      return null;

    // The returned node map has the following key/value pairs where nodeKey is 
    // the value of the node's data-oj-subid[-map] attribute:
    // [nodeKey]: { map: [subIdMap], node: [node] }
    var nodeMap = oj.CompositeElementBridge.__GetNodeMap(this);

    // Case #2
    var composite = oj.Composite.getContainingComposite(node, this);
    if (composite != null)
    {
      var nodeKey = composite.node.getAttribute('data-oj-subid-map');
      var match = nodeMap[nodeKey];
      if (match)
      {
        if (composite.getSubIdByNode)
        {
          var locator = composite.getSubIdByNode(node);
          if (locator)
          {
            var alias = match['map'][locator['subId']];
            locator['subId'] = alias;
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
    while (curNode !== this)
    {
      // We do not support an element having both attributes. If both are specified, -map takes precedence.
      var nodeKey = curNode.getAttribute('data-oj-subid-map') || curNode.getAttribute('data-oj-subid');
      if (nodeKey)
        break;
      curNode = curNode.parentNode;
    }

    var match = nodeMap[nodeKey];
    if (match) 
    {
      var map = match['map'];
      if (!map) // Case #3a
      {
        return {'subId': nodeKey};
      }
      else // Case #3b
      {
        var component = match['node'];
        var locator;
        // Check to see if we should call the method on the element or widget
        if (component.getSubIdByNode) 
        {
          locator = component.getSubIdByNode(node);
        } 
        else 
        {
          locator = oj.Components.__GetWidgetConstructor(component)('getSubIdByNode', node);
        }

        if (locator)
        {
          locator['subId'] = match['map'][locator['subId']];
          return locator;
        }
      }
    }

    return null;
  },

  _getViewModel: function(element) 
  {
    if (!this._VIEW_MODEL)
    {
      this._throwError(element, "Cannot access methods before element is upgraded.");
    }
    return this._VIEW_MODEL;
  }
  
});

/*************************/
/* PUBLIC STATIC METHODS */
/*************************/

/**
 * See oj.Composite.register doc for details
 * @ignore
 *
 */
oj.CompositeElementBridge.register = function(tagName, descriptor)
{

  // Convert any descriptor objects using the deprecated inline keys to the new API
  var descrip = {};
  descrip[oj.BaseCustomElementBridge.DESC_KEY_META] = oj.CompositeElementBridge._getResource(descriptor, oj.BaseCustomElementBridge.DESC_KEY_META);
  descrip[oj.BaseCustomElementBridge.DESC_KEY_VIEW] = oj.CompositeElementBridge._getResource(descriptor, oj.BaseCustomElementBridge.DESC_KEY_VIEW);
  descrip[oj.BaseCustomElementBridge.DESC_KEY_CSS] = oj.CompositeElementBridge._getResource(descriptor, oj.BaseCustomElementBridge.DESC_KEY_CSS);
  descrip[oj.BaseCustomElementBridge.DESC_KEY_VIEW_MODEL] = oj.CompositeElementBridge._getResource(descriptor, oj.BaseCustomElementBridge.DESC_KEY_VIEW_MODEL);
  descrip[oj.BaseCustomElementBridge.DESC_KEY_PARSE_FUN] = descriptor[oj.BaseCustomElementBridge.DESC_KEY_PARSE_FUN];

  if (oj.BaseCustomElementBridge.__Register(tagName, descrip, oj.CompositeElementBridge.proto, true))
  {
    var metadata = descrip[oj.BaseCustomElementBridge.DESC_KEY_META];
    if (!metadata)
    {
      // Metadata is required starting in 3.0.0, but to be backwards compatible, just log a warning.
      oj.Logger.warn("Composite registered'" + tagName.toLowerCase() + "' without Metadata.");
      metadata = {};
    }
    else
    {
      // Check that the component name, version, and JET versions are defined in the metadata
      var name = metadata['name'];
      if (!name)
        oj.Logger.warn('Warning registering composite %s. Required property "name" missing from metadata.', tagName);
      else if (tagName != name)
        oj.Logger.warn('Warning registering composite %s. Registered name: %s does not match name: %s provided in metadata.', tagName, tagName, name);
      if (!metadata['version'])
        oj.Logger.warn('Warning registering composite %s. Required property "version" missing from metadata.', tagName);
      if (!metadata['jetVersion'])
        oj.Logger.warn('Warning registering composite %s. Required composite "jetVersion" missing from metadata.', tagName);
    }
    var view = descrip[oj.BaseCustomElementBridge.DESC_KEY_VIEW];
    if (view == null)
      throw new Error("Cannot register composite '" + tagName.toLowerCase() + "' without a View.");

    // __ProcessEventListeners returns a copy of the metadata so we're not updating the original here.
    descrip['_metadata'] = oj.BaseCustomElementBridge.__ProcessEventListeners(metadata, false);
    customElements.define(tagName.toLowerCase(), oj.CompositeElementBridge.proto.getClass(descrip));
  }
};

/*****************************/
/* NON PUBLIC STATIC METHODS */
/*****************************/

/**
 * @ignore
 */
oj.CompositeElementBridge._getDomNodes = function(content, element)
{
  if (typeof content === 'string')
  {
    return oj.__HtmlUtils.stringToNodeArray(content);
  }
  else if (oj.CompositeElementBridge._isDocumentFragment(content))
  {
    var clonedContent = content.cloneNode(true);
    var nodes = [];
    for (var i = 0; i < clonedContent.childNodes.length; i++)
      nodes.push(clonedContent.childNodes[i]);
    return nodes;
  }
  else if (Array.isArray(content))
  {
    var clonedContent = [];
    for (var i = 0; i < content.length; i++)
      clonedContent.push(content[i].cloneNode(true));
    return clonedContent;
  }
  else
  {
    var bridge = oj.BaseCustomElementBridge.getInstance(element);
    // TODO update this error message once we remove support for Array of DOM nodes and DocumentFragment
    bridge._throwError(element, "The composite View is not one of the following supported types: string, Array of DOM nodes, DocumentFragment");
  }
};

/**
 * Creates the subId and node maps needed for automation
 * @ignore
 */
oj.CompositeElementBridge._generateSubIdMap = function(bridge, element)
{
  if (!bridge._SUBID_MAP)
  {
    // The format of the map will be { [composite subId] : {alias: [alias], node: [node] } }
    var subIdMap = {};
    var nodeMap = {};

    // data-oj-subid or data-oj-subid-map attributes can be defined on nested objects so we need
    // to walk the composite tree skipping over slots
    var children = element.children;
    for (var i = 0; i < children.length; i++) {
      oj.CompositeElementBridge._walkSubtree(subIdMap, nodeMap, children[i]);
    }

    bridge._NODE_MAP = nodeMap;
    bridge._SUBID_MAP = subIdMap;
  }
};

/**
 * Walks a composite subtree, parsing and generating subId mappings.
 * @ignore
 */
oj.CompositeElementBridge._walkSubtree = function(subIdMap, nodeMap, node)
{
  if (!node.hasAttribute('slot'))
  {
    oj.CompositeElementBridge._addNodeToSubIdMap(subIdMap, nodeMap, node);
    if (!oj.BaseCustomElementBridge.getRegistered(node.tagName) && !oj.Components.__GetWidgetConstructor(node))
    {
      var children = node.children;
      for (var i = 0; i < children.length; i++)
      {
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
oj.CompositeElementBridge._addNodeToSubIdMap = function(subIdMap, nodeMap, node)
{
  var nodeSubId = node.getAttribute('data-oj-subid');
  var nodeSubIdMapStr = node.getAttribute('data-oj-subid-map');
  // We do not support an element having both attributes. If both are specified, -map takes precedence.
  if (nodeSubIdMapStr)
  {
    var parsedValue = JSON.parse(nodeSubIdMapStr);
    if (typeof parsedValue === 'object' && !(parsedValue instanceof Array))
    { 
      // Due to closure compiler issues with passing in result of JSON.parse which has type * into Object.keys 
      // which requires an Object, use for loop here instead of iterating over key Array.
      var nodeSubIdMap = parsedValue;
      var reverseMap = {};
      for (var key in nodeSubIdMap)
      {
        subIdMap[key] = {'alias': nodeSubIdMap[key], 'node': node};
        reverseMap[nodeSubIdMap[key]] = key;
      }
      nodeMap[nodeSubIdMapStr] = {'map': reverseMap, 'node': node};
    }
  }
  else if (nodeSubId)
  {
    subIdMap[nodeSubId] = {'node': node};
    nodeMap[nodeSubId] = {'node': node};
  }
};

/**
 * Returns the subId to node mapping for the composite's View.
 * @ignore
 */
oj.CompositeElementBridge.__GetSubIdMap = function(element)
{
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
oj.CompositeElementBridge.__GetNodeMap = function(element)
{
  var bridge = oj.BaseCustomElementBridge.getInstance(element);
  oj.CompositeElementBridge._generateSubIdMap(bridge, element);
  return bridge._NODE_MAP;
};

/**
 * @ignore
 */
oj.CompositeElementBridge._getPropertyTracker = function(bridge, property)
{
  if (!bridge._TRACKERS)
    bridge._TRACKERS = {};
  if (!bridge._TRACKERS[property])
    bridge._TRACKERS[property] = oj.CompositeTemplateRenderer.createTracker();
  return bridge._TRACKERS[property];
};

/**
 * @ignore
 */
oj.CompositeElementBridge._getResource = function(descriptor, key)
{
  var resource = descriptor[key];
  if (resource != null)
  {
    if (resource.hasOwnProperty('inline'))
      return resource['inline'];
    else if (resource.hasOwnProperty('promise'))
      throw new Error("The 'promise' resource type for descriptor key '" + key + "' is no longer supported." +
        " The resource should be passed directly as the value instead.");
    else
      return resource;
  }
};

/**
 * @ignore
 */
oj.CompositeElementBridge._isDocumentFragment = function(content)
{
  if (window['DocumentFragment'])
  {
    return content instanceof DocumentFragment;
  }
  else
  {
    return content && content.nodeType === 11;
  }
};


});