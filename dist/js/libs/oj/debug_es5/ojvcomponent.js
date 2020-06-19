(function() {function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

define(['exports', 'ojs/ojcore-base', 'ojs/ojcontext', 'ojs/ojdefaultsutils', 'ojs/ojcustomelement'], function (exports, oj, Context, ojdefaultsutils, ojcustomelement) {
  'use strict';
  /**
   * @license
   * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */

  /**
   * Class decorator for VComponent custom elements. Takes the tag name
   * of the custom element.
   * @param {string} tagName The custom element tag name
   * @return {Function}
   * @name customElement
   * @function
   * @memberof! VComponent
   * @ojdecorator
   */

  /**
   * Property decorator for VComponent properties whose default value is determined at
   * runtime and returned via the getter method passed to the decorator.
   * @param {Function} defaultGetter The method to call to retrieve the default value
   * @return {Function}
   * @name dynamicDefault
   * @function
   * @memberof! VComponent
   * @ojdecorator
   */

  /**
   * Property decorator for VComponent properties which the component may update with
   * new values. Takes an optional object with a readOnly key that should be true if the
   * property is only updated by the component.
   * @param {object=} options The options for this decorator
   * @param {boolean} options.readOnly True if only the component can update the property
   * @return {Function}
   * @name _writeback
   * @function
   * @memberof! VComponent
   * @ojdecorator
   * @ignore
   */

  /**
   * Method decorator for VComponent methods that should be exposed on the custom element.
   * Non decorated VComponent methods will not be made available on the custom element.
   * @return {Function}
   * @name method
   * @function
   * @memberof! VComponent
   * @ojdecorator
   */

  /**
   * Property decorator for VComponent properties which are not component properties,
   * but are global properties that the VComponent wishes to get updates for, e.g. tabIndex or aria-label.
   * @return {Function}
   * @name rootProperty
   * @function
   * @memberof! VComponent
   * @ojdecorator
   */

  /**
   * Method decorator for VComponent that binds a specified method to the component instance ('this')
   * and passes provided options to the addEventListener()/removeEventListener() calls, when the method is used as a listener.
   * @param {object=} options Listener options, e.g. {passive:true}
   * @return {Function}
   * @name listener
   * @ojsignature {target: "Type", for: "options", value: "{capture?: boolean = false, passive?: boolean}"}
   * @function
   * @memberof! VComponent
   * @ojdecorator
   */

  /**
   * Property decorator for VComponent event callback properties to indicate they bubble.
   * @param {object=} options The options for this decorator
   * @param {boolean} options.bubbles True if only the component can update the property
   * @return {Function}
   * @name event
   * @function
   * @memberof! VComponent
   * @ojdecorator
   */

  /**
   * @license
   * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */

  /**
   * @class VComponent
   * @param {Object} props The passed in component properties
   * @ojsignature [{
   *                target: "Type",
   *                value: "abstract class VComponent<P extends object = any, S extends object = any>",
   *                genericParameters: [{"name": "P", "description": "Type of the props object"},
   *                                    {"name": "S", "description": "Type of the state object"}]
   *               },
   *               {target: "Type", value: "Readonly<P>", for: "props"}]
   * @constructor
   * @since 9.0.0
   * @ojtsimport {module: "ojmetadata", type: "AMD", importName:"MetadataTypes"}
   * @ojmodule ojvcomponent
   * @classdesc The VComponent base class provides a mechanism for defining JET
   * <a href="CompositeOverview.html">Custom Components</a>.
   * Like the JET <a href="ComponentTypeOverview.html#corecomponents">Core Components</a>
   * and composite components, VComponent-based components
   * are exposed as custom elements. From the application developer’s perspective, these
   * custom elements are (essentially) indistinguishable from JET’s other component types.
   * Where VComponents differ is in the component implementation strategy: VComponents produce
   * content via virtual DOM rendering.
   * <p>
   * To create a new VComponent-based custom component, the component author typically does the following:
   * <ul>
   *   <li>Implements a class that extends VComponent. This class must be authored in TypeScript.</li>
   *   <li>Overrides the <a href="#render">render()</a> method to return a virtual DOM representation
   *       of the component’s content.</li>
   *   <li>Sets the &#64;customElement() decorator with the custom element tag name passed in as a parameter.</li>
   *   <li>Defines the public contract of the custom element.
   *   <ul>
   *     <li><b>Properties: </b>defined as members of the Props class.</li>
   *     <li><b>Methods: </b>defined as methods of the VComponent class and marked for exposure on the custom element using the &#64;method() decorator.</li>
   *     <li><b>Events: </b>defined as members of the Props class using the naming convention on[EventName] and having type
   *     <a href="#Action">Action</a> or <a href="#CancelableAction">CancelableAction</a>.</li>
   *     <li><b>Slots: </b>defined as members of the Props class having type <a href="#Slot">Slot</a>.</li>
   *   </ul>
   * </ul>
   * </p>
   * <p>
   * Given the above, JET generates an HTMLElement subclass and registers this as a custom
   * element with the browser. These VComponent-based custom elements can then be used anywhere
   * that other JET components are used, and application developers can leverage typical JET
   * functionality such as data binding, slotting, etc.
   * </p>
   * <p>
   * A minimal VComponent subclass is shown below:
   * </p>
   * <pre class="prettyprint"><code>
   * import { h, VComponent, customElement } from "ojs/ojvcomponent";
   * import "ojs/ojavatar";
   *
   * class Props {
   *   initials?: string = '';
   *   fullName?: string = '';
   *   department?: 'Billing' | 'Sales' | 'Engineering';
   *   rank?: Rank = { level: 1, title: 'entry level' };
   * }
   *
   * type Rank = {
   *   level: number,
   *   title: string
   * };
   *
   * &#64;customElement('oj-sample-employee')
   * export class SampleEmployee extends VComponent&lt;Props> {
   *
   *   protected render(): VComponent.VNode {
   *     return (
   *       &lt;div>
   *         &lt;oj-avatar initials={this.props.initials} />
   *         &lt;span>{this.props.fullName}&lt;/span>
   *       &lt;/div>
   *     );
   *   }
   * }
   * </code></pre>
   *
   * <h3 id="rendering">
   *  Rendering
   *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#rendering"></a>
   * </h3>
   * <p>
   * Every VComponent class must provide an implementation of the <a href="#render">render()</a> method.
   * This method returns a tree of virtual DOM nodes that represents the component's content.
   * The return value can take one of two forms:
   * <ol>
   *   <li>The render function can return a single virtual DOM node representing the root
   *       custom element and any child content specified as virtual DOM children.  If the
   *       component needs to modify root attributes, needs to set a ref callback on the root
   *       custom element, or contains multiple virtual DOM children, this return value form
   *       <i>must</i> be used.
   *   <li>If the component's content consists of a single virtual DOM child, a single virtual
   *       DOM node representing the child node may be returned, omitting a node representing
   *       the root custom element.</li>
   * </ol>
   * While it is always acceptable to include a virtual DOM node representing the root
   * custom element as in #1, the return form in #2 is supported as a convenience.  In many cases, the root
   * virutal DOM node can be omitted.
   * </p>
   * <p>
   * Virtual DOM nodes are plain old JavaScript objects that specify the node type
   * (typically the element’s tag name), properties and children. This information is
   * used by the underlying virtual DOM engine to produce live DOM (i.e. by calling
   * document.createElement()).
   * </p>
   * <p>
   * Virtual DOM nodes can be created in one of two ways:
   * <ul>
   *   <li>By calling the virtual DOM node factory function, which is exported
   *    from the ojs/ojvcomponent module under the name "h".  The <code>h</code>
   *    factory function takes the type, properties and children and returns a
   *    virtual DOM node.</li>
   *   <li>Declaratively via TSX (a TypeScript flavor of JSX).</li>
   * </ul>
   * </p>
   * <p>
   * The latter approach is strongly preferred as it results in more readable code. A build-time transformation step
   * will ultimately convert the TSX markup into calls to <code>h()</code> that will be executed at run-time.
   * </p>
   * <p>
   * Note that in either case, the virtual DOM factory function must be imported as
   * an import named "h".
   * </p>
   * <p>
   * The <a href="#render">render()</a> method will be called whenever component state or properties change to return the new VDOM. The virtual
   * component will then diff the VDOM and patch the live DOM with updates. As custom elements,
   * these virtual components are used in the same way as other JET components, supporting data binding
   * and slotting.
   * </p>
   * <p>
   *
   * <h3 id="jsx">
   *  JSX Syntax
   *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#jsx"></a>
   * </h3>
   * <p>
   * Virtual component render functions support the use of JSX which is an XML
   * syntax that looks similar to HTML, but supports a different attribute syntax.
   * </p>
   *
   * <h4>JSX Attributes</h4>
   * <p>
   * Component properties, global HTMLElement properties, event listeners, ref, and key attributes
   * can all be specified using the virtual component JSX attribute syntax. JSX expects the
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement">HTMLElement</a>
   * property names for all JSX attributes except for class and for. In cases where an attribute does not have an
   * equivalent property on the HTMLElement (data-, aria-, role, etc), the attribute name
   * should be used. The style attribute is special cased and only supports object values
   * e.g. style={ {color: 'blue', fontSize: '12px'} }. Primitive JSX attribute values can
   * be set directly using the equal operator, or within {...} brackets for JavaScript values
   * e.g. the style example above.</p>
   *
   * The JET <a href="CustomElementOverview.html#ce-databind-syntax-section">data binding syntax</a>
   * using double curly or square brackets is not supported when using JSX.  Additionally, subproperty
   * syntax (e.g. complexProperty.subProperty={...}) is not supported; when dealing with complex-typed properties,
   * the full value must be specified (i.e. complexProperty={ {subProperty: ...} }).
   * </p>
   *
   * <h4>class</h4>
   * <p>
   * The class JSX attribute supports space delimited class names in addition to an
   * Object whose keys are individual style classes and whose values are booleans to determine
   * whether those style classes should be present in the DOM.
   * (e.g. class={ {'oj-hover': isHovered} }).
   * </p>
   *
   * <h4>Event Listeners</h4>
   * <p>
   * Event listeners follow a 'on'[EventName] naming syntax e.g.
   * onClick={clickListener} and unlike data bound on-click listeners set on the root
   * custom element, JSX event listeners will only receive a single event parameter.
   * Use the &#64;listener decorator to bind an event listener to the component instance - 'this'.
   * The &#64;listener decorator accepts an options object that would be passed to the
   * DOM addEventListener() method for specifying capture or passive listeners.
   *
   * </p>
   * <pre class="prettyprint"><code>
   * import { h, VComponent, customElement, listener } from "ojs/ojvcomponent";
   *
   * &#64;customElement('oj-sample-component')
   * export class SampleComponent extends VComponent {
   *
   *   &#64;listener({ passive: true })
   *   private _touchStartHandler(event) {
   *     // handler code
   *   }
   *
   *   protected render(): VComponent.VNode {
   *     return (
   *       &lt;div onTouchstart={this._touchStartHandler}>
   *         &hellip;
   *       &lt;/div>
   *     );
   *   }
   * }
   * </code></pre>
   *
   * <h4 id="refs">
   *  Refs
   *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#refs"></a>
   * </h4>
   * <p>
   * While we recommend that rendering is done declaratively, for use cases where
   * a reference to a DOM node is necessary, a ref attribute
   * along with a callback can be set on the virtual node within the render function.
   * The callback function will be called with either a DOM node when using the element syntax
   * or a VComponent instance when using the class syntax after the node has been inserted
   * into the DOM. The ref callback will be called again with null when the node has been
   * unmounted. See the <a href="#lifecycle">lifecycle doc</a> for ref callback
   * ordering in relation to other lifecycle methods.
   * </p>
   * <pre class="prettyprint"><code>
   * import { h, VComponent, customElement } from "ojs/ojvcomponent";
   *
   * &#64;customElement('oj-sample-component')
   * export class SampleComponent extends VComponent {
   *   private _scrollingDiv: HTMLDivElement;
   *
   *   protected render(): VComponent.VNode {
   *     return (
   *       &lt;div ref={this._setScrollingDiv}>
   *         &hellip;
   *       &lt;/div>
   *     );
   *   }
   *
   *   protected mounted(): void {
   *     this._adjustScrollingDiv();
   *   }
   *
   *   protected updated(oldProps: Readonly&lt;Props>, oldState: Readonly&lt;State>): void
   *     this._adjustScrollingDiv();
   *   }
   *
   *   private _setScrollingDiv = (elem) => {
   *     this._scrollingDiv = elem as HTMLDivElement;
   *   }
   *
   *   private _adjustScrollingDiv(): void {
   *     // Perform some calculations
   *     &hellip;
   *     this._scrollingDiv.style.height = calculatedValue;
   *   }
   *
   * }
   * </code></pre>
   *
   * <h4>Keys</h4>
   * <p>
   * When rendering lists of virtual nodes, it may be beneficial to set key attributes
   * in JSX to help distinguish between insertions, deletions, and updates. Without keys,
   * the VComponent diffing logic will compare the old and new virtual node lists in order,
   * so an insertion before the first virtual node will result in a diff for all subsequent
   * virtual nodes without the key attribute. The key can be of type string or number.
   * </p>
   *
   * <h4>Root Attributes</h4>
   * <p>
   * In general, we do not recommend modifying core HTML properties on the custom element to
   * avoid overriding application set values. However in cases where this is necessary
   * (e.g. moving or copying attributes for accessibility), authors should register properties
   * they plan to update or listen to changes from as members of their Props class, marked with the &#64;rootProperty decorator.
   * These root properties will then be populated in the component's <code>this.props</code> object as
   * long as they are present in the live DOM; unlike component properties, no default values will be made available
   * in <code>this.props</code> for root properties. When rendering, only core HTML properties that are specifically marked with the &#64;rootProperty decorator will be
   * reflected in the live DOM on the root custom element; any other core HTML properties will be ignored.
   * Components will be notified of changes to root properties similar to component properties and trigger a rerender.
   * </p>
   *
   * <p>
   * Style and class properties can be set on the root custom element and are applied additively to the application-provided
   * style and class.  Event listeners can be added using the on[PropertyName] syntax in the root element within the component's
   * <a href="#render">render()</a> method and will be added or removed using the DOM's addEventListener and removeEventListener methods.
   * Style, class, and event listeners can always be specified on the root custom element and do not need to be declared
   * as members of the Props class unlike other root properties.
   * </p>
   *
   * <pre class="prettyprint"><code>
   *   protected render(): VComponent.VNode {
   *     return (
   *       &lt;oj-sample-component onClick={this._clickListener} style={ {color: red} } class='my-class-name'>
   *         &lt;div>&hellip;&lt;/div>
   *       &lt;/oj-sample-component>
   *     );
   *   }
   * </code></pre>
   *
   * <p>
   * Components often need to generate unique IDs for internal DOM. The <a href="#uniqueId">uniqueId()</a> method can
   * be called to retrieve an id that is unique to the component instance (matching the live DOM if it has been specified)
   * that can be used e.g. as a prefix for IDs on internal DOM.
   * </p>
   *
   * <h3 id="updates">
   *  State Updates
   *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#updates"></a>
   * </h3>
   * <p>
   * Components may track internal state that is not reflected through their
   * properties. There is a state mechanism for supporting this. Components
   * should initialize their state objects in their constructors. After that,
   * components should treat their <code>this.state</code> objects as immutable
   * and call <a href="#updateState">updateState</a> to request a
   * state update.
   * </p>
   * <p> The updateState() method does not immediately update the state of the component,
   * it just puts the update in a queue to be processed later. The framework will batch
   * multiple updates together to make rendering more efficient. It will schedule
   * the change and rerender the component. Consider using function callback instead
   * of an object when updating the state in order to avoid stale data for the state.
   * Calls to updateState() will only cause the component to rerender if the end result
   * differs from the original state.
   * </p>
   * <pre class="prettyprint"><code>
   * import { h, VComponent, customElement } from "ojs/ojvcomponent";
   *
   * class Props { &hellip; }
   *
   * type State = {
   *   foo: boolean,
   *   bar: boolean
   * }
   *
   * &#64;customElement('oj-sample-component')
   * export class SampleComponent extends VComponent&lt;Props, State> {
   *   constructor(props: Readonly&lt;Props>) {
   *     // State should be instantiated in the constructor
   *     this.state = {
   *       foo: true,
   *       bar: false
   *     }
   *   }
   *
   *   &#64;listener()
   *   private _handleClick() {
   *     // Update state in response to user interaction, triggering a
   *     // re-render.
   *     this.updateState({ foo: false });
   *   }
   * }
   * </code></pre>
   *
   * <h3 id="defaults">
   *  Default Values
   *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#defaults"></a>
   * </h3>
   * <p>
   * Static default values for components can be provided using direct value assignments
   * on the corresponding members in the Props class.  In addition, dynamic default values
   * can be specified using the &#64;dynamicDefault() decorator with a parameter representing
   * a method that should be called to retrieve the default value at runtime.</p>
   *
   * <p>Object- or Array-typed default values will recursively frozen before being returned
   * as property values to prevent subsequent modification.  Any Objects that are not POJOs
   * <i>will not be frozen</i> (including references to them inside other Objects or Arrays) and
   * it is the component's responsibility to ensure that default values of this type (e.g. class instances)
   * are immutable.
   * </p>
   * <pre class="prettyprint"><code>
   * import { h, VComponent, customElement, dynamicDefault } from "ojs/ojvcomponent";
   *
   * function computeDynamicDefault(): string { &hellip; }
   *
   * class Props {
   *   primitiveProperty?: number = 0;
   *   complexProperty?: {index: number} = {index: 0};
   *   classProperty?: MyType = new ImmutableMyTypeImpl();
   *   &#64;dynamicDefault(computeDynamicDefault) dynamicProperty?: string;
   * }
   *
   * &#64;customElement('oj-sample-component')
   * export class SampleComponent extends VComponent&lt;Props> {
   *   &hellip;
   * }
   * </code></pre>
   *
   * <h3 id="lifecycle">
   *  Lifecycle Methods
   *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#lifecycle"></a>
   * </h3>
   * <p>
   * In addition to the required render method, virtual components have several optional lifecycle
   * methods that give the component hooks to setup/cleanup global listeners, do geometry management,
   * and update state. See the API doc for each lifecycle method for details.
   * </p>
   *
   * <h4>Mount</h4>
   * <ul>
   *   <li><a href="#VComponent">constructor()</a></li>
   *   <li>(static) <a href="#initStateFromProps">initStateFromProps()</a></li>
   *   <li><a href="#render">render()</a></li>
   *   <li><a href="#refs">ref callbacks</a></li>
   *   <li><a href="#mounted">mounted()</a></li>
   * </ul>
   *
   * <h4>Update</h4>
   * <ul>
   *   <li>(static) <a href="#updateStateFromProps">updateStateFromProps()</a></li>
   *   <li><a href="#render">render()</a></li>
   *   <li><a href="#refs">ref callbacks</a></li>
   *   <li><a href="#update">updated()</a></li>
   * </ul>
   *
   * <h4>Unmount</h4>
   * <ul>
   *   <li><a href="#unmounted">unmounted()</a></li>
   *   <li><a href="#refs">ref callbacks</a></li>
   *
   * </ul>
   *
   * <h3 id="slots">
   *  Slotting
   *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#slots"></a>
   * </h3>
   * <p>
   * Component authors declare their expected slots as members of their Props class.  The various slot types are exposed as follows:
   * <ul>
   *   <li>Default slot - exposed through the <code>children</code> member with type <code><a href="#VNode">VNode</a>[]</code>.</li>
   *   <li>Ordinary slot - exposed through a member with type <code><a href="#Slot">Slot</a></code> whose name corresponds to the slot name.</li>
   *   <li>Template slots - exposed through a member with type <code><a href="#Slot">Slot&lt;SlotContextType></a></code> whose name corresponds to the slot name.  <code>SlotContextType</code> represents the data type for this template slot (corresponding to the type of the $current object).</li>
   *   <li>Dynamic slots - any slots that are not explicitly declared as one of the three previous types will be exposed in a Map of type <code><a href="#DynamicSlots">DynamicSlots</a></code>.  This may be useful in cases where the set of expected slots cannot be statically defined, but is determined
   *       by the component through other means at runtime.  The dynamic slot map may contain either ordinary slots or template slots.</li>
   * </ul>
   * Note that in all of the cases above, the component author must declare the corresponding properties in their Props class in order to receive access to slot content.
   * </p>
   * <p>
   * During component rendering, default slot content can simply be inlined as with any other virtual DOM content.  Components can test for the existence of the <code>children</code> property to decide whether to render default content.
   * </p>
   * <pre class="prettyprint"><code>
   * class Props {
   *   children?: VNode[];
   * }
   *
   * &#64;customElement('oj-sample-component')
   * export class SampleComponent extends VComponent&lt;Props> {
   *
   *   protected render(): VComponent.VNode {
   *     return (
   *       &lt;div style="border-style: solid; width:200px;">
   *         { this.props.children || &lt;span>Default Content&lt;/span> }
   *       &lt;/div>
   *     );
   *   }
   * }
   * </code></pre>
   * <p>
   * Ordinary slots are exposed as render functions at runtime and can simply be called to retrieved the corresponding content.
   * </p>
   * <pre class="prettyprint"><code>
   * class Props {
   *   header?: Slot;
   * }
   *
   * &#64;customElement('oj-sample-component')
   * export class SampleComponent extends VComponent&lt;Props> {
   *
   *   protected render(): VComponent.VNode {
   *     return (
   *       &lt;div style="border-style: solid; width:200px;">
   *         { this.props.header?.() || &lt;span>Default Header Content&lt;/span> }
   *       &lt;/div>
   *     );
   *   }
   * }
   * </code></pre>
   * <p>
   * Template slots are also exposed as render functions at runtime, but additional take an argument representing the template data.
   * </p>
   * <pre class="prettyprint"><code>
   * type Item {
   *   index: number;
   *   text: string;
   * }
   *
   * class Props {
   *   itemTemplate?: Slot&lt;Item>;
   *   items?: string[];
   * }
   *
   * &#64;customElement('oj-sample-component')
   * export class SampleComponent extends VComponent&lt;Props> {
   *
   *   protected render(): VComponent.VNode {
   *     return (
   *       const templateFunction = this.itemTemplate || this._defaultTemplate;
   *       &lt;ul>
   *         items.map( (item, index) =>
   *           &lt;li>
   *             { templateFunction({index: index, text: item}) }
   *           &lt;/li>);
   *       &lt;/ul>
   *     );
   *   }
   * }
   * </code></pre>
   * <p>
   * Dynamic slots are rendered exactly like ordinary and template slots once the component determines what slot to render.
   * </p>
   * <pre class="prettyprint"><code>
   * class Props {
   *   cards?: DynamicSlots;
   *   currentCard: string;
   * }
   *
   * &#64;customElement('oj-sample-component')
   * export class SampleComponent extends VComponent&lt;Props> {
   *
   *   protected render(): VComponent.VNode {
   *     return (
   *       &lt;div style="border-style: solid; width:200px;">
   *         { this.props.cards?.[this.props.currentCard]?.() }
   *       &lt;/div>
   *     );
   *  }
   * }
   * </code></pre>
   *
   * <h3 id="perf">
   *  Performance Considerations
   *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf"></a>
   * </h3>
   * <p>
   * Every time a component's render function is called, everything contained is created anew.
   * As a result, complex properties (e.g. non-primitive values like Object types, event listeners),
   * should be created outside of the render function's scope. Otherwise, e.g. the component would
   * be specifying a different instance of an event listener each time the component is rendered
   * which would result in unnecessary DOM changes. Event listeners should be declared as instance functions
   * marked with the &#64;listener decorator which will ensure that they are property bound.
   * Non-primitive values should be saved in variables
   * outside of the render function.
   * </p>
   * <pre class="prettyprint"><code>
   * import { h, VComponent, customElement, listener } from "ojs/ojvcomponent";
   *
   * class Props {&hellip;}
   *
   * &#64;customElement('oj-sample-collection')
   * export class SampleCollection extends VComponent&lt;Props> {
   *   constructor(props: Readonly&lt;Props>) {
   *     super(props);
   *   }
   *
   *   &#64;listener()
   *   private _handleClick(event) { &hellip; }
   *
   *   protected render(): VComponent.VNode {
   *     return (
   *       &lt;div onClick={this._handleClick}/>
   *     );
   *   }
   * }
   * </code></pre>
   */
  // TYPEDEFS

  /**
  * @typedef {Function} VComponent.Action
  * @ojsignature [{target:"Type", value:"<Detail extends object = {}>", for:"genericTypeParameters"},
  *               {target: "Type", value: "(detail?: Detail) => void"}]
  */

  /**
  * @typedef {Function} VComponent.CancelableAction
  * @ojsignature [{target:"Type", value:"<Detail extends object = {}>", for:"genericTypeParameters"},
  *               {target: "Type", value: "(detail?: Detail) => Promise<void>"}]
  */

  /**
  * @typedef {Object} VComponent.DynamicSlots
  * @ojsignature [{target:"Type", value:"<Data = undefined>", for:"genericTypeParameters"},
  *               {target: "Type", value: "Record<string, VComponent.Slot<Data>" }]
  */

  /**
  * @typedef {Function} VComponent.Slot
  * @ojsignature [{target:"Type", value:"<Data = undefined>", for:"genericTypeParameters"},
  *               {target: "Type", value: "(data?: Data) => VComponent.VNode[]"}]
  */

  /**
   * @typedef {Object} VComponent.VComponentClass
   * @ojsignature [{target:"Type", value:"<P>", for:"genericTypeParameters"},
   *               {target: "Type", value: "new (props: P) => VComponent<P, any>"}]
   */

  /**
   * @typedef {Object} VComponent.RenderFunction
   * @ojsignature [{target:"Type", value:"<P>", for:"genericTypeParameters"},
   *               {target: "Type", value: "(props: P, content: VComponent.VNode[]) => VComponent.VNode"}]
   */

  /**
   * @typedef {Object} VComponent.VNodeType
   * @ojsignature [{target:"Type", value:"<P>", for:"genericTypeParameters"},
   *               {target: "Type", value: "string | VComponent.VComponentClass<P> | VComponent.RenderFunction<P>"}]
   */
  // STATIC METHODS

  /**
   * Creates a virtual node for an HTML element of the given type, props, and children.
   * @function h
   * @memberof VComponent
   * @param {any} type An HTML or SVG tag name
   * @param {Object} props The properties to set in the real DOM node
   * @param {...Object} children Optional child DOM
   * @ojsignature [{target:"Type", value:"<P>", for:"genericTypeParameters"},
   *               {target: "Type", value: "VComponent.VNodeType<P>", for: "type"},
   *               {target: "Type", value: "P", for: "props"},
   *               {target: "Type", value: "Array<VComponent.VNode|Node>", for: "children"},
   *               {target: "Type", value: "VComponent.VNode", for: "returns"}]
   * @return {Object}
   * @expose
   * @ignore
   */

  /**
   * Utility to convert a JSX 'class' attribute value to an object for easier component
   * manipulation.
   * <pre class="prettyprint"><code>
   * import { h, VComponent, classPropToObject } from "ojs/ojvcomponent";
   *
   * class Props {
   *   class?: string | object = {};
   * }
   *
   * export class SampleComponent extends VComponent&lt;Props> {
   *   protected render(): VComponent.VNode {
   *     // Make a copy of the readonly return value from classPropToObject and add additional classes
   *     const classObj = Object.assign({}, classPropToObject(this.props.class), { newClass: true }
   *     return (
   *       &lt;div class={ classObj } />
   *     );
   *   }
   * }
   * </code></pre>
   * @function classPropToObject
   * @memberof VComponent
   * @param {string|object|null} classProp An HTML or SVG tag name
   * @ojsignature [{target: "Type", value: "Readonly<object>", for: "returns"}]
   * @return {Object}
   * @expose
   * @ignore
   */

  /**
   * An optional static lifecycle method used to initialize derived state.
   * Called before the render method on the first flow through the
   * lifecycle. Components should return a partial state that will be merged
   * into any state that was initialized in the constructor, or null if
   * no changes are needed.
   *
   * @function initStateFromProps
   * @memberof VComponent
   * @param {Object} props The component's initial properties
   * @param {Object} state The component's initial state
   * @return {Object|null}
   * @ojsignature [{target: "Type", value: "Readonly<P>", for: "props"},
   *              {target: "Type", value: "Readonly<S>", for: "state"},
   *              {target: "Type", value: "Partial<S>|null", for: "returns"}]
   * @ojprotected
   * @expose
   */

  /**
   * An optional static lifecycle method used to update derived state.
   * Called before the render method on update flows through the lifecycle.
   * Components should return either a partial state that will be merged
   * into component state or null if no changes are needed. Logic that relies on old
   * and new state or property values should be done in <a href="#update">updated()</a>
   * instead.
   * @function updateStateFromProps
   * @memberof VComponent
   * @param {Object} props The new component properties
   * @param {Object} state The new state
   * @return {Object|null}
   * @ojsignature [{target: "Type", value: "Readonly<P>", for: "props"},
   *              {target: "Type", value: "Readonly<S>", for: "state"},
   *              {target: "Type", value: "Partial<S>|null", for: "returns"}]
   * @ojprotected
   * @expose
   */
  // INSTANCE PROPERTIES

  /**
   * The passed in component properties. This property should not be directly modified e.g.
   * this.props = {} or this.props.someProp = 'foo'.
   * @name props
   * @memberof VComponent
   * @type {Object}
   * @default {}
   * @ojsignature [{target: "Type", value: "Readonly<P>"}]
   * @ojprotected
   * @instance
   * @expose
   */

  /**
   * The component state. State updates should be done through the updateState or updateStateFromProps methods
   * and not by direct modification of this property in order to ensure that the component
   * is rerendered.
   * @expose
   * @name state
   * @memberof VComponent
   * @type {Object}
   * @default {}
   * @ojsignature [{target: "Type", value: "Readonly<S>"}]
   * @ojprotected
   * @instance
   */
  // INSTANCE METHODS

  /**
   * Required lifecycle method which returns the component's virtual subtree.
   * @function render
   * @return {VComponent.VNode}
   *
   * @memberof VComponent
   * @ojprotected
   * @abstract
   * @instance
   * @expose
   */

  /**
   * An optional lifecycle method called after the
   * virtual component has been initially rendered and inserted into the
   * DOM. Data fetches and global listeners can be added here.
   * This will not be called for reparenting cases. State and property
   * updates should be done here instead of the constructor.
   * @function mounted
   * @return {void}
   *
   * @memberof VComponent
   * @ojprotected
   * @instance
   * @expose
   */

  /**
   * An optional component lifecycle method called after the
   * render method in updating (state or property change) cases.
   * Additional DOM manipulation can be done here. State and property
   * updates that need access to old and values should also be done here.
   * Note that when updating state or property in updated(),
   * the component should compare old and new values.
   * @function updated
   * @param {Object} oldProps The previous value of the component properties.
   * @param {Object} oldState The previous value of the component state.
   * @return {void}
   * @ojsignature [{target: "Type", value: "Readonly<P>", for: "oldProps"},
   *               {target: "Type", value: "Readonly<S>", for: "oldState"},
   *              {target: "Type", value: "void", for: "returns"}]
   *
   * @memberof VComponent
   * @ojprotected
   * @instance
   * @expose
   */

  /**
   * An optional component lifecycle method called after the
   * virtual component has been removed from the DOM. This will not
   * be called for reparenting cases. Global listener cleanup can
   * be done here.
   * @function unmounted
   * @return {void}
   *
   * @memberof VComponent
   * @ojprotected
   * @instance
   * @expose
   */

  /**
   * The <a href="#uniqueId">uniqueId()</a> method can
   * be called to retrieve an id that is unique to the component instance (matching the live DOM if it has been specified)
   * that can be used e.g. as a prefix for IDs on internal DOM.
   *
   * For components needing to generate a unique ID for internal DOM, this utility method
   * will return either the id set on the VComponent by the parent or a unique string that
   * can be used for a prefix for child elements if one wasn't set by the parent.
   * This method can only be called after the VComponent
   * has been instantiated and will return undefined if called from the constructor.
   * @function uniqueId
   * @return {string}
   *
   * @memberof VComponent
   * @ojprotected
   * @instance
   * @expose
   */

  /**
   * Updates an internal component state. State updates always trigger an asynchronous rerender.<br/>
   * Note that the method accepts either partial state for the component or a callback that
   * returns a partial state.
   * The callback receives up-to-date component state and property values and can be
   * used to dynamically compute the next state. State updates that rely on state or
   * property values should use the callback form to ensure the latest values are used.
   * @function updateState
   * @param {Object | function} state Accepts a partial state object or a callback that returns
   *                  a partial state object that will be merged into component state.
   *                  The updater function takes a reference to the component state
   *                  at the time the change is being applied and the component properties object.
   * @return {void}
   * @ojsignature {target: "Type", value: "((state: Readonly<S>, props: Readonly<P>) => Partial<S>) | Partial<S>", for: "state"}
   * @memberof VComponent
   * @ojprotected
   * @instance
   * @expose
   */

  /**
   * Updates a writeback component property. Note that a property update does not
   * trigger a component render.
   * @function _updateProperty
   * @param {string} prop The name of the property
   * @param {any} value The new property value
   * @return {void}
   * @ojsignature [{target: "Type", value: "keyof P", for: "prop"},
   *               {target: "Type", value: "P[keyof P]", for: "value"}]
   *
   * @memberof VComponent
   * @ojprotected
   * @instance
   * @ignore
   */

  var EMPTYO = Object.freeze({});

  function classPropToObject(classProp) {
    if (!classProp) {
      return EMPTYO;
    }

    if (typeof classProp === 'string') {
      return classProp.split(' ').reduce(function (acc, val) {
        if (val) {
          acc[val] = true;
        }

        return acc;
      }, {});
    }

    return classProp;
  }

  var PetitDom;

  (function (PetitDom) {
    PetitDom.LISTENER_OPTIONS_SYMBOL = Symbol();
    var SKIPKEYS = new Set(['key', 'ref', 'children']);
    var isArray = Array.isArray;

    var isVNode = function isVNode(c) {
      return c && (c.type != null || c._text != null || c._node);
    };

    var isComponent = function isComponent(c) {
      return (c === null || c === void 0 ? void 0 : c.mount) && (c === null || c === void 0 ? void 0 : c.patch) && (c === null || c === void 0 ? void 0 : c.unmount);
    };

    function h(type, props) {
      var content,
          isSVG = false,
          isVComponent = false,
          isCustomElement;

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      if (typeof type !== 'string') {
        isVComponent = typeof type === 'function' && isComponent(type.prototype);
        isCustomElement = isVComponent && type.prototype.mountContent;
        content = args;
      } else {
        isSVG = type === 'svg';
        isCustomElement = !isSVG && oj.ElementUtils.isValidCustomElementName(type);
        var len = args.length;

        if (len === 1) {
          var contArg = args[0];

          if (isArray(contArg)) {
            content = maybeFlatten(contArg, isSVG);
          } else if (isVNode(contArg)) {
            contArg.isSVG = isSVG;
            content = [contArg];
          } else {
            content = [{
              _text: contArg == null ? '' : contArg
            }];
          }
        } else if (len > 1) {
          content = maybeFlatten(args, isSVG);
        } else {
          content = args;
        }
      }

      var needsWritableProps = isVComponent || isCustomElement;
      return {
        type: type,
        isSVG: isSVG,
        isComponent: isVComponent,
        isCustomElement: isCustomElement,
        key: props === null || props === void 0 ? void 0 : props.key,
        props: props || (needsWritableProps ? Object.create(null) : EMPTYO),
        content: content,
        ref: props === null || props === void 0 ? void 0 : props.ref
      };
    }

    PetitDom.h = h;

    function maybeFlatten(arr, isSVG) {
      for (var i = 0; i < arr.length; i++) {
        var ch = arr[i];

        if (isArray(ch)) {
          return flattenChildren(arr, i, arr.slice(0, i), isSVG);
        } else if (!isVNode(ch)) {
          arr[i] = {
            _text: ch == null ? '' : ch
          };
        } else if (isSVG && !ch.isSVG) {
          ch.isSVG = true;
        }
      }

      return arr;
    }

    function flattenChildren(children, start, arr, isSVG) {
      for (var i = start; i < children.length; i++) {
        var ch = children[i];

        if (isArray(ch)) {
          flattenChildren(ch, 0, arr, isSVG);
        } else if (isVNode(ch)) {
          if (isSVG && !ch.isSVG) {
            ch.isSVG = true;
          }

          arr.push(ch);
        } else if (ch == null || typeof ch === 'string') {
          arr.push({
            _text: ch == null ? '' : ch
          });
        } else {
          arr.push(ch);
        }
      }

      return arr;
    }

    var SVG_NS = 'http://www.w3.org/2000/svg';
    var XLINK_NS = 'http://www.w3.org/1999/xlink';
    var NS_ATTRS = {
      show: XLINK_NS,
      actuate: XLINK_NS,
      href: XLINK_NS
    };

    function defShouldUpdate(p1, p2, c1, c2) {
      if (c1 !== c2) return true;

      for (var key in p1) {
        if (p1[key] !== p2[key]) return true;
      }

      return false;
    }

    function mountCustomElement(vnode, uncontrolledRootProps) {
      var type = vnode.type,
          props = vnode.props,
          content = vnode.content;
      var node = document.createElement(type);
      patchDOM(node, uncontrolledRootProps, null, true);
      patchDOM(node, props, null, true);
      appendChildren(node, content);
      vnode._node = node;
      return node;
    }

    PetitDom.mountCustomElement = mountCustomElement;

    function mountCustomElementContent(vnode, controlledRootProps) {
      var node = vnode._node;
      patchDOM(node, vnode.props, controlledRootProps, true);
      appendChildren(node, vnode.content);
      patchRef(vnode.ref, node);
    }

    PetitDom.mountCustomElementContent = mountCustomElementContent;

    function mount(c) {
      var isVComponent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var node;

      if (c._node) {
        return c._node;
      } else if (c._text != null) {
        node = document.createTextNode(c._text);
      } else {
        var type = c.type,
            props = c.props,
            content = c.content,
            isSVG = c.isSVG;

        if (typeof type === 'string') {
          if (!isSVG) {
            node = document.createElement(type);
          } else {
            node = document.createElementNS(SVG_NS, type);
          }

          patchDOM(node, props, null, isVComponent || c.isCustomElement);

          if (isTemplateElement(node)) {
            appendChildrenForTemplate(node, content);
          } else {
            appendChildren(node, content);
          }
        } else if (typeof type === 'function') {
          if (c.isComponent) {
            var instance;
            var constr = type;
            var splitProps = sortControlled(constr, props, c.isCustomElement);
            c._uncontrolled = splitProps.uncontrolled;
            instance = new constr(splitProps.controlled);
            instance._uniqueId = oj.__AttributeUtils.getUniqueId(props.id);
            node = instance.mount(splitProps.controlled, content, splitProps.uncontrolled);
            c._data = instance;
          } else {
            var render = type;
            var vnode = render(props, content);
            node = mount(vnode);
            c._data = vnode;
          }
        }
      }

      if (node == null) {
        throw new Error('Unknown node type!');
      }

      c._node = node;
      return node;
    }

    PetitDom.mount = mount;

    function mountForTemplate(c) {
      var node;

      if (c._text != null) {
        node = document.createTextNode(c._text);
      } else {
        var type = c.type,
            props = c.props,
            content = c.content,
            isSVG = c.isSVG;

        if (typeof type === 'string') {
          if (!isSVG) {
            node = document.createElement(type);
          } else {
            node = document.createElementNS(SVG_NS, type);
          }

          patchDOMForTemplate(node, props, null, c.isCustomElement);
          appendChildrenForTemplate(node, content);
        }
      }

      if (node == null) {
        throw new Error('content inside <template> elements is limited to HTML elements and text');
      }

      c._node = node;
      return node;
    }

    function isTemplateElement(node) {
      return node.nodeName === 'TEMPLATE';
    }

    function afterMountHooks(vnode) {
      if (vnode.isComponent) {
        var vcomp = vnode._data;
        patchRef(vnode.ref, vcomp);
        patchRef(vcomp._vnode.props.ref, vnode._node);

        if (!vnode.isCustomElement) {
          vcomp.mounted();
        }
      } else if (typeof vnode.type !== 'function') {
        patchRef(vnode.ref, vnode._node);
      }
    }

    function appendChildren(parent, children) {
      var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : children.length - 1;
      var oldch = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

      while (start <= end) {
        var ch = children[start++];

        if (ch._node) {
          var node = ch._node;
          insertBeforeChild(parent, ch, oldch);

          if (node.nodeType === 1 && oj.Components) {
            oj.Components.subtreeShown(node);
          }
        } else {
          insertBeforeChild(parent, ch, oldch);
        }
      }
    }

    function appendChildrenForTemplate(parent, children) {
      var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : children.length - 1;
      var oldch = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

      while (start <= end) {
        var ch = children[start++];
        mountForTemplate(ch);
        insertBeforeChild(parent, ch, oldch);
      }
    }

    function removeChildren(parent, children) {
      var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : children.length - 1;
      var cleared = void 0;

      if (parent.childNodes.length === end - start + 1) {
        parent.textContent = '';
        cleared = true;
      }

      while (start <= end) {
        var ch = children[start++];

        if (!cleared) {
          removeAndUnmountChild(parent, ch);
        }
      }
    }

    function unmount(ch) {
      if (isArray(ch)) {
        for (var i = 0; i < ch.length; i++) {
          unmount(ch[i]);
        }
      } else {
        if (ch.isComponent) {
          var vcomp = ch._data;
          vcomp.unmount(ch._node);
        } else if (ch.content != null) {
          unmount(ch.content);
        }

        if (ch.isComponent || typeof ch.type !== 'function') {
          patchRef(ch.ref, null);
        }
      }
    }

    PetitDom.unmount = unmount;

    function isControlledProp(constr, prop) {
      var _a, _b;

      var meta = constr.metadata;
      return ((_b = (_a = meta === null || meta === void 0 ? void 0 : meta.extension) === null || _a === void 0 ? void 0 : _a._ROOT_PROPS_MAP) === null || _b === void 0 ? void 0 : _b[prop]) != null;
    }

    function isListener(prop) {
      return oj.__AttributeUtils.eventListenerPropertyToEventType(prop) !== null;
    }

    function sortControlled(constr, props, isCustomElement) {
      var staticDefaults = ojdefaultsutils.DefaultsUtils.getStaticDefaults(constr, constr.metadata, true);
      var splitProps = {
        controlled: Object.create(staticDefaults),
        uncontrolled: {}
      };

      for (var propName in props) {
        var value = props[propName];

        if (value !== undefined) {
          if (!isCustomElement || !oj.__AttributeUtils.isGlobalOrData(propName) || isControlledProp(constr, propName)) {
            splitProps.controlled[propName] = value;
          } else {
            splitProps.uncontrolled[propName] = value;
          }
        }
      }

      return splitProps;
    }

    function patchDOM(el, props, oldProps, isVComponent) {
      if (props) {
        addOrUpdateProps(el, props, oldProps || EMPTYO, isVComponent);
      }

      if (oldProps) {
        removeOldProps(el, props || EMPTYO, oldProps, isVComponent);
      }
    }

    function patchDOMForTemplate(el, props, oldProps, isCustomElement) {
      if (props) {
        var propKeys = Object.keys(props);
        propKeys.forEach(function (key) {
          if (SKIPKEYS.has(key)) {
            return;
          }

          var value = props[key];
          el.setAttribute(key, value);
        });
      }

      if (oldProps) {}
    }

    function addOrUpdateProps(el, props, oldProps, isVComponent) {
      var propKeys = Object.keys(props);
      propKeys.forEach(function (key) {
        if (SKIPKEYS.has(key)) {
          return;
        }

        var value = props[key];
        var oldValue = oldProps[key];

        if (value !== oldValue) {
          if (key === 'style') {
            patchProperties(el.style, value || EMPTYO, oldValue || EMPTYO, '');
          } else if (key === 'class') {
            patchClassName(el, value, oldValue, isVComponent);
          } else if (!maybePatchListener(el, key, value, oldValue) && !maybePatchAttribute(el, key, value, isVComponent)) {
            el[key] = value;
          }
        }
      });
    }

    function removeOldProps(el, props, oldProps, isVComponent) {
      var propKeys = Object.keys(oldProps);
      propKeys.forEach(function (key) {
        if (key === 'key' || key === 'ref') {
          return;
        }

        var oldValue = oldProps[key];

        if (!(key in props)) {
          if (key === 'style') {
            patchProperties(el.style, EMPTYO, oldValue || EMPTYO, '');
          } else if (key === 'class') {
            patchClassName(el, null, oldValue, isVComponent);
          } else if (!maybePatchListener(el, key, null, oldValue) && !maybePatchAttribute(el, key, null, isVComponent)) {
            el[key] = undefined;
          }
        }
      });
    }

    function patchProperties(propertyHolder, props, oldProps, unsetValue) {
      for (var key in props) {
        var oldv = oldProps[key];
        var newv = props[key];

        if (oldv !== newv) {
          propertyHolder[key] = newv;
        }
      }

      for (var _key2 in oldProps) {
        if (!(_key2 in props)) {
          propertyHolder[_key2] = unsetValue;
        }
      }
    }

    function patchClassName(el, value, oldValue, isVComponent) {
      if (isVComponent) {
        patchClassNameAsMap(el, value, oldValue);
      } else {
        patchClassNameAsString(el, value);
      }
    }

    function patchClassNameAsString(el, value) {
      if (value) {
        var classStr = _typeof(value) === 'object' ? Object.keys(value).filter(function (key) {
          return value[key];
        }).join(' ') : value;
        el.setAttribute('class', classStr);
      } else {
        el.removeAttribute('class');
      }
    }

    function patchClassNameAsMap(el, value, oldValue) {
      var oldValueMap = classPropToObject(oldValue);
      var valueMap = classPropToObject(value);

      for (var key in oldValueMap) {
        if (oldValueMap[key] && !valueMap[key]) {
          el.classList.remove(key);
        }
      }

      for (var _key3 in valueMap) {
        if (valueMap[_key3] && !oldValueMap[_key3]) {
          el.classList.add(_key3);
        }
      }
    }

    function maybePatchListener(el, key, value, oldValue) {
      if (value || oldValue) {
        var eventType = eventListenerPropertyToEventType(key);

        if (eventType) {
          patchListener(el, eventType, value, oldValue);
          return true;
        }
      }

      return false;
    }

    function patchListener(el, eventType, value, oldValue) {
      if (oldValue) {
        el.removeEventListener(eventType, oldValue, oldValue[PetitDom.LISTENER_OPTIONS_SYMBOL]);
      }

      if (value) {
        el.addEventListener(eventType, value, value[PetitDom.LISTENER_OPTIONS_SYMBOL]);
      }
    }

    function maybePatchAttribute(el, key, value, isVComponent) {
      if (isVComponent && oj.__AttributeUtils.isGlobalOrData(key) || !isVComponent && key !== 'value' && key !== 'checked') {
        var attr = oj.__AttributeUtils.getNativeAttr(key);

        if (value === true) {
          el.setAttribute(attr, '');
        } else if (value === false) {
          el.removeAttribute(attr);
        } else {
          if (value != null) {
            var ns = NS_ATTRS[attr];

            if (ns !== undefined) {
              el.setAttributeNS(ns, attr, value);
            } else {
              el.setAttribute(attr, value);
            }
          } else {
            el.removeAttribute(attr);
          }
        }

        return true;
      }

      return false;
    }

    function eventListenerPropertyToEventType(property) {
      if (/^on[A-Z]/.test(property)) {
        return property.substr(2, 1).toLowerCase() + property.substr(3);
      }

      return null;
    }

    function patchCustomElement(newch, oldch, uncontrolledRootProps, oldUncontrolledRootProps) {
      var parentNode = oldch._node;

      if (oldch === newch) {
        return;
      }

      patchDOM(parentNode, uncontrolledRootProps, oldUncontrolledRootProps, true);
      patchDOM(parentNode, newch.props, oldch.props, true);
      diffChildren(parentNode, newch.content, oldch.content);
      patchRef(newch.ref, parentNode, oldch.ref);
    }

    PetitDom.patchCustomElement = patchCustomElement;

    function patchCustomElementContent(newch, oldch, controlledRootProps) {
      var parentNode = oldch._node;

      if (oldch === newch) {
        return;
      }

      var oldRootProps = {};
      var oldProps = oldch.props;

      for (var prop in oldProps) {
        if (isListener(prop) || prop === 'class' || prop === 'style') {
          oldRootProps[prop] = oldProps[prop];
        }
      }

      Object.assign(oldRootProps, controlledRootProps);
      patchDOM(parentNode, newch.props, oldRootProps, true);
      diffChildren(parentNode, newch.content, oldch.content);
      patchRef(newch.ref, parentNode, oldch.ref);
    }

    PetitDom.patchCustomElementContent = patchCustomElementContent;

    function patch(newch, oldch, parent) {
      var isVComponent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var childNode = oldch._node;

      if (oldch === newch) {
        return childNode;
      }

      if (isTemplateElement(childNode)) {
        newch._node = childNode;
        return childNode;
      }

      if (newch._node) {
        if (childNode !== newch._node) {
          replaceAndUnmountChild(parent, newch, oldch);
        }

        return newch._node;
      }

      var t1, t2;

      if ((t1 = oldch._text) != null && (t2 = newch._text) != null) {
        if (t1 !== t2) {
          childNode.nodeValue = t2;
        }
      } else if (oldch.type === newch.type && oldch.isSVG === newch.isSVG) {
        var type = oldch.type;

        if (typeof type === 'function') {
          if (oldch.isComponent) {
            var vcomp = oldch._data;
            var constr = type;
            var splitProps = sortControlled(constr, newch.props, newch.isCustomElement);
            newch._uncontrolled = splitProps.uncontrolled;
            vcomp.patch(splitProps.controlled, newch.content, splitProps.uncontrolled, oldch._uncontrolled);
            newch._data = vcomp;
            patchRef(newch.ref, vcomp, oldch.ref);
          } else {
            var shouldUpdateFn = type['shouldUpdate'] || defShouldUpdate;

            if (shouldUpdateFn(newch.props, oldch.props, newch.content, oldch.content)) {
              var render = type;
              var vnode = render(newch.props, newch.content);
              childNode = patch(vnode, oldch._data, parent);
              newch._data = vnode;
            } else {
              newch._data = oldch._data;
            }
          }
        } else if (typeof type === 'string') {
          if (oldch.isCustomElement && contentChangeRequiresRemount(newch.content, oldch.content)) {
            childNode = replaceAndUnmountChild(parent, newch, oldch);
          } else {
            patchDOM(childNode, newch.props, oldch.props, isVComponent || oldch.isCustomElement);
            diffChildren(childNode, newch.content, oldch.content);
            patchRef(newch.ref, childNode, oldch.ref);
          }
        } else {
          throw new Error("Error while patching. Unknown node type '".concat(type, "'."));
        }
      } else {
        if (parent) {
          childNode = replaceAndUnmountChild(parent, newch, oldch);
        }
      }

      newch._node = childNode;
      return childNode;
    }

    PetitDom.patch = patch;

    function canPatch(v1, v2) {
      return v1.key == null && v2.key == null || v1.key === v2.key;
    }

    function diffChildren(parent, children, oldChildren) {
      var newStart = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var newEnd = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : children.length - 1;
      var oldStart = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var oldEnd = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : oldChildren.length - 1;
      if (children === oldChildren) return;
      var oldCh;
      var k = diffCommonPrefix(children, oldChildren, newStart, newEnd, oldStart, oldEnd, canPatch, parent);
      newStart += k;
      oldStart += k;
      k = diffCommonSufffix(children, oldChildren, newStart, newEnd, oldStart, oldEnd, canPatch, parent);
      newEnd -= k;
      oldEnd -= k;

      if (newStart > newEnd && oldStart > oldEnd) {
        return;
      }

      if (newStart <= newEnd && oldStart > oldEnd) {
        oldCh = oldChildren[oldStart];
        appendChildren(parent, children, newStart, newEnd, oldCh);
        return;
      }

      if (oldStart <= oldEnd && newStart > newEnd) {
        removeChildren(parent, oldChildren, oldStart, oldEnd);
        return;
      }

      var oldRem = oldEnd - oldStart + 1;
      var newRem = newEnd - newStart + 1;
      k = -1;

      if (oldRem < newRem) {
        k = indexOf(children, oldChildren, newStart, newEnd, oldStart, oldEnd, canPatch);

        if (k >= 0) {
          oldCh = oldChildren[oldStart];
          appendChildren(parent, children, newStart, k - 1, oldCh);
          var upperLimit = k + oldRem;
          newStart = k;

          while (newStart < upperLimit) {
            patch(children[newStart++], oldChildren[oldStart++], parent);
          }

          var oldChSibling = oldChildren[oldEnd + 1];
          appendChildren(parent, children, newStart, newEnd, oldChSibling);
          return;
        }
      } else if (oldRem > newRem) {
        k = indexOf(oldChildren, children, oldStart, oldEnd, newStart, newEnd, canPatch);

        if (k >= 0) {
          removeChildren(parent, oldChildren, oldStart, k - 1);

          var _upperLimit = k + newRem;

          oldStart = k;

          while (oldStart < _upperLimit) {
            patch(children[newStart++], oldChildren[oldStart++], parent);
          }

          removeChildren(parent, oldChildren, oldStart, oldEnd);
          return;
        }
      }

      if (oldStart === oldEnd) {
        removeAndUnmountChild(parent, oldChildren[oldStart]);
        appendChildren(parent, children, newStart, newEnd, oldChildren[oldStart + 1]);
        return;
      }

      if (newStart === newEnd) {
        removeChildren(parent, oldChildren, oldStart, oldEnd);
        insertBeforeChild(parent, children[newStart], oldChildren[oldEnd + 1]);
        return;
      }

      var failed = diffOND(parent, children, oldChildren, newStart, newEnd, oldStart, oldEnd);
      if (failed) diffWithMap(parent, children, oldChildren, newStart, newEnd, oldStart, oldEnd);
    }

    function diffCommonPrefix(s1, s2, start1, end1, start2, end2, eq, parent) {
      var k = 0,
          c1,
          c2;

      while (start1 <= end1 && start2 <= end2 && eq(c1 = s1[start1], c2 = s2[start2])) {
        if (parent) patch(c1, c2, parent);
        start1++;
        start2++;
        k++;
      }

      return k;
    }

    function diffCommonSufffix(s1, s2, start1, end1, start2, end2, eq, parent) {
      var k = 0,
          c1,
          c2;

      while (start1 <= end1 && start2 <= end2 && eq(c1 = s1[end1], c2 = s2[end2])) {
        if (parent) patch(c1, c2, parent);
        end1--;
        end2--;
        k++;
      }

      return k;
    }

    var PATCH = 2;
    var INSERTION = 4;
    var DELETION = 8;

    function diffOND(parent, children, oldChildren) {
      var newStart = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var newEnd = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : children.length - 1;
      var oldStart = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var oldEnd = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : oldChildren.length - 1;
      var rows = newEnd - newStart + 1;
      var cols = oldEnd - oldStart + 1;
      var dmax = rows + cols;
      var v = [];
      var d, k, r, c, pv, cv, pd;

      outer: for (d = 0; d <= dmax; d++) {
        if (d > 50) return true;
        pd = d - 1;
        pv = d ? v[d - 1] : [0, 0];
        cv = v[d] = [];

        for (k = -d; k <= d; k += 2) {
          if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
            c = pv[pd + k + 1];
          } else {
            c = pv[pd + k - 1] + 1;
          }

          r = c - k;

          while (c < cols && r < rows && canPatch(oldChildren[oldStart + c], children[newStart + r])) {
            c++;
            r++;
          }

          if (c === cols && r === rows) {
            break outer;
          }

          cv[d + k] = c;
        }
      }

      var diff = Array(d / 2 + dmax / 2);
      var deleteMap = {};
      var oldCh;
      var diffIdx = diff.length - 1;

      for (d = v.length - 1; d >= 0; d--) {
        while (c > 0 && r > 0 && canPatch(oldChildren[oldStart + c - 1], children[newStart + r - 1])) {
          diff[diffIdx--] = PATCH;
          c--;
          r--;
        }

        if (!d) break;
        pd = d - 1;
        pv = d ? v[d - 1] : [0, 0];
        k = c - r;

        if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
          r--;
          diff[diffIdx--] = INSERTION;
        } else {
          c--;
          diff[diffIdx--] = DELETION;
          oldCh = oldChildren[oldStart + c];

          if (oldCh.key != null) {
            deleteMap[oldCh.key] = oldStart + c;
          }
        }
      }

      applyDiff(parent, diff, children, oldChildren, newStart, oldStart, deleteMap);
    }

    function applyDiff(parent, diff, children, oldChildren, newStart, oldStart, deleteMap) {
      var moveMap = {};

      for (var i = 0, oldChIdx = oldStart; i < diff.length; i++) {
        var _op = diff[i];

        if (_op === PATCH) {
          oldChIdx++;
        } else if (_op === DELETION) {
          var oldCh = oldChildren[oldChIdx++];

          if (oldCh.key == null || moveMap[oldCh.key] == null) {
            removeAndUnmountChild(parent, oldCh);
          }
        }
      }

      for (var _i = 0, chIdx = newStart, _oldChIdx = oldStart; _i < diff.length; _i++) {
        var op = diff[_i];
        var mounted = false;

        if (op === PATCH) {
          patch(children[chIdx++], oldChildren[_oldChIdx++], parent);
        } else if (op === INSERTION) {
          var ch = children[chIdx++];
          var oldMatchIdx = null;

          if (ch.key != null) {
            oldMatchIdx = deleteMap[ch.key];
          }

          if (oldMatchIdx != null) {
            patch(ch, oldChildren[oldMatchIdx], parent);
            moveMap[ch.key] = oldMatchIdx;
          }

          insertBeforeChild(parent, ch, _oldChIdx < oldChildren.length ? oldChildren[_oldChIdx] : null);
        } else if (op === DELETION) {
          _oldChIdx++;
        }
      }
    }

    function diffWithMap(parent, children, oldChildren, newStart, newEnd, oldStart, oldEnd) {
      var newLen = newEnd - newStart + 1;
      var oldLen = oldEnd - oldStart + 1;
      var minLen = Math.min(newLen, oldLen);
      var tresh = Array(minLen + 1);
      tresh[0] = -1;

      for (var i = 1; i < tresh.length; i++) {
        tresh[i] = oldEnd + 1;
      }

      var link = Array(minLen);
      var keymap = {},
          unkeyed = [];

      for (var _i2 = oldStart; _i2 <= oldEnd; _i2++) {
        var oldCh = oldChildren[_i2];
        var key = oldCh.key;

        if (key != null) {
          keymap[key] = _i2;
        } else {
          unkeyed.push(_i2);
        }
      }

      var idxUnkeyed = 0;

      for (var _i3 = newStart; _i3 <= newEnd; _i3++) {
        var ch = children[_i3];
        var idxInOld = ch.key == null ? unkeyed[idxUnkeyed++] : keymap[ch.key];

        if (idxInOld != null) {
          var _k = findK(tresh, idxInOld);

          if (_k >= 0) {
            tresh[_k] = idxInOld;
            link[_k] = {
              newi: _i3,
              oldi: idxInOld,
              prev: link[_k - 1]
            };
          }
        }
      }

      var k = tresh.length - 1;

      while (tresh[k] > oldEnd) {
        k--;
      }

      var ptr = link[k];
      var diff = Array(oldLen + newLen - k);
      var curNewi = newEnd,
          curOldi = oldEnd;
      var d = diff.length - 1;

      while (ptr) {
        var _ptr = ptr,
            newi = _ptr.newi,
            oldi = _ptr.oldi;

        while (curNewi > newi) {
          diff[d--] = INSERTION;
          curNewi--;
        }

        while (curOldi > oldi) {
          diff[d--] = DELETION;
          curOldi--;
        }

        diff[d--] = PATCH;
        curNewi--;
        curOldi--;
        ptr = ptr.prev;
      }

      while (curNewi >= newStart) {
        diff[d--] = INSERTION;
        curNewi--;
      }

      while (curOldi >= oldStart) {
        diff[d--] = DELETION;
        curOldi--;
      }

      applyDiff(parent, diff, children, oldChildren, newStart, oldStart, keymap);
    }

    function findK(ktr, j) {
      var lo = 1;
      var hi = ktr.length - 1;

      while (lo <= hi) {
        var mid = Math.ceil((lo + hi) / 2);
        if (j < ktr[mid]) hi = mid - 1;else lo = mid + 1;
      }

      return lo;
    }

    function indexOf(a, suba, aStart, aEnd, subaStart, subaEnd, eq) {
      var j = subaStart,
          k = -1;
      var subaLen = subaEnd - subaStart + 1;

      while (aStart <= aEnd && aEnd - aStart + 1 >= subaLen) {
        if (eq(a[aStart], suba[j])) {
          if (k < 0) k = aStart;
          j++;
          if (j > subaEnd) return k;
        } else {
          k = -1;
          j = subaStart;
        }

        aStart++;
      }

      return -1;
    }

    function contentChangeRequiresRemount(content, oldContent) {
      if (content === oldContent) {
        return false;
      }

      if (content.length !== oldContent.length) {
        return true;
      }

      return content.some(function (node, index) {
        var _a, _b;

        var oldNode = oldContent[index];

        if (node.type !== oldNode.type) {
          return true;
        }

        return ((_a = node.props) === null || _a === void 0 ? void 0 : _a.slot) !== ((_b = oldNode.props) === null || _b === void 0 ? void 0 : _b.slot);
      });
    }

    function replaceAndUnmountChild(parent, newch, oldch) {
      if (oldch._clean) {
        oldch._clean();
      }

      var needsMount = newch._node == null;

      if (needsMount) {
        mount(newch);
      }

      var newNode = newch._node;
      getDomContainer(parent).replaceChild(newNode, oldch._node);
      unmount(oldch);
      oldch._node = newNode;

      if (needsMount) {
        afterMountHooks(newch);
      }

      return newNode;
    }

    function removeAndUnmountChild(parent, oldch) {
      if (oldch._clean) {
        oldch._clean();
      }

      getDomContainer(parent).removeChild(oldch._node);
      unmount(oldch);
    }

    function insertBeforeChild(parent, newch, oldch) {
      var needsMount = newch._node == null;

      if (needsMount) {
        mount(newch);
      }

      var newNode = newch._node;
      getDomContainer(parent).insertBefore(newNode, (oldch === null || oldch === void 0 ? void 0 : oldch._node) || null);

      if (needsMount) {
        afterMountHooks(newch);
      }
    }

    function patchRef(newRefCallback, ref) {
      var oldRefCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (oldRefCallback !== newRefCallback) {
        if (typeof oldRefCallback === 'function') {
          oldRefCallback(null);
        }

        if (typeof newRefCallback === 'function') {
          newRefCallback(ref);
        }
      }
    }

    function getDomContainer(node) {
      if (isTemplateElement(node)) {
        var content = node.content;

        if (content) {
          return content;
        }
      }

      return node;
    }
  })(PetitDom || (PetitDom = {}));

  var VComponent = /*#__PURE__*/function () {
    function VComponent(props) {
      _classCallCheck(this, VComponent);

      this._pendingPropsUpdate = false;
      this.props = props;
    }

    _createClass(VComponent, [{
      key: "updated",
      value: function updated(oldProps, oldState) {}
    }, {
      key: "mounted",
      value: function mounted() {}
    }, {
      key: "unmounted",
      value: function unmounted() {}
    }, {
      key: "uniqueId",
      value: function uniqueId() {
        return this._uniqueId;
      }
    }, {
      key: "_updateProperty",
      value: function _updateProperty(prop, value) {
        var shouldRender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (this.props[prop] !== value) {
          this._getCallback('_updateProperty')(prop, value, shouldRender);
        }
      }
    }, {
      key: "updateState",
      value: function updateState(state) {
        if (!this._pendingStateUpdaters) {
          this._pendingStateUpdaters = [];
        }

        this._pendingStateUpdaters.push(state);

        this.queueRender(this._ref, 'stateUpdate');
      }
    }, {
      key: "mount",
      value: function mount(props, content) {
        var uncontrolledRootProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        this._vnode = this._renderForMount(props, content);
        return this._ref = PetitDom.mount(this._vnode, true);
      }
    }, {
      key: "patch",
      value: function patch(props, content, uncontrolledRootProps, oldUncontrolledRootProps) {
        var oldProps = this.props;
        var oldState = this.state;
        var oldVnode = this._vnode;
        this._vnode = this._renderForPatch(props, content);
        PetitDom.patch(this._vnode, oldVnode, this._ref.parentNode, true);
        this.updated(oldProps, oldState);
      }
    }, {
      key: "unmount",
      value: function unmount(node) {
        PetitDom.unmount(this._vnode);
        this.unmounted();
      }
    }, {
      key: "queueRender",
      value: function queueRender(element, reason) {
        var _this = this;

        var _a, _b;

        if ((_b = (_a = this).isPatching) === null || _b === void 0 ? void 0 : _b.call(_a)) return;

        if (reason === 'propsUpdate') {
          this._pendingPropsUpdate = true;
        }

        if (!this._busyStateCallbackForRender) {
          var busyContext = Context.getContext(element).getBusyContext();
          this._busyStateCallbackForRender = busyContext.addBusyState({
            description: this.uniqueId() + ' is waiting to render.'
          });
          window.requestAnimationFrame(function () {
            var busyStateCallbackForRender = _this._busyStateCallbackForRender;
            var pendingPropsUpdate = _this._pendingPropsUpdate;
            var pendingStateUpdaters = _this._pendingStateUpdaters;
            _this._busyStateCallbackForRender = null;
            _this._pendingPropsUpdate = false;
            _this._pendingStateUpdaters = null;

            try {
              var props = _this._getCallback('getPropsForRender')();

              var newState = _this._doUpdateState(props, pendingStateUpdaters);

              if (pendingPropsUpdate || newState && !_this._areStatesEqual(_this.state, newState)) {
                _this._pendingState = newState;

                _this._getCallback('patch')(props, _this._ref.parentNode);
              }
            } catch (error) {
              throw error;
            } finally {
              busyStateCallbackForRender();
              _this._pendingState = null;
            }
          });
        }
      }
    }, {
      key: "_renderForMount",
      value: function _renderForMount(props, content) {
        if (this.state) {
          var initStateFromProps = this.constructor.initStateFromProps;

          if (initStateFromProps) {
            var newPartialState = initStateFromProps.call(this.constructor, props, this.state);
            this.state = this._getNewState(newPartialState);
          }
        }

        return this._render(props, content);
      }
    }, {
      key: "_renderForPatch",
      value: function _renderForPatch(props, content) {
        if (this.state) {
          var updateStateFromProps = this.constructor.updateStateFromProps;
          var newPartialState;

          if (updateStateFromProps) {
            newPartialState = updateStateFromProps.call(this.constructor, props, this._pendingState || this.state, this.props);
          }

          this.state = this._getNewState(newPartialState, this._pendingState);
        }

        var vnode = this._render(props, content);

        return vnode;
      }
    }, {
      key: "_render",
      value: function _render(props, content) {
        if (content && content.length) {
          Object.assign(props, this._getCallback('convertChildrenToSlotProps')(content));
        }

        this.props = props;
        return this.render();
      }
    }, {
      key: "_doUpdateState",
      value: function _doUpdateState(props, updaters) {
        if (!updaters || updaters.length === 0) {
          return null;
        }

        var newState = updaters.reduce(function (acc, updater) {
          var updatedState = typeof updater === 'function' ? updater(acc, props) : updater;
          return Object.assign(acc, updatedState);
        }, Object.assign({}, this.state));
        return newState;
      }
    }, {
      key: "_areStatesEqual",
      value: function _areStatesEqual(oldState, newState) {
        return Object.keys(newState).every(function (key) {
          return oldState[key] === newState[key];
        });
      }
    }, {
      key: "_getCallback",
      value: function _getCallback(name) {
        if (!this._callbacks) {
          this._callbacks = this._getBuiltInCallbacks();
        }

        return this._callbacks[name];
      }
    }, {
      key: "_getBuiltInCallbacks",
      value: function _getBuiltInCallbacks() {
        var _this2 = this;

        var callbacks = {
          _updateProperty: function _updateProperty(prop, value) {
            var _a, _b;

            var changedEvent = oj.__AttributeUtils.propertyNameToChangeEventType(prop);

            var changedProp = oj.__AttributeUtils.eventTypeToEventListenerProperty(changedEvent);

            (_b = (_a = _this2.props)[changedProp]) === null || _b === void 0 ? void 0 : _b.call(_a, {
              value: value,
              previousValue: _this2.props[prop],
              updatedFrom: 'internal'
            });
          },
          getPropsForRender: function getPropsForRender() {
            return _this2.props;
          },
          patch: function patch(props, parent) {
            _this2.patch(props, parent);
          },
          convertChildrenToSlotProps: function convertChildrenToSlotProps(children) {
            return {
              children: children
            };
          }
        };
        callbacks['_vcomp'] = true;
        return callbacks;
      }
    }, {
      key: "_getNewState",
      value: function _getNewState(newPartialState) {
        var pendingState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (newPartialState || pendingState) {
          return Object.assign({}, pendingState || this.state, newPartialState);
        }

        return this.state;
      }
    }]);

    return VComponent;
  }();

  var h = PetitDom.h;
  /**
   * @license
   * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */

  /**
   * @class
   * @ignore
   */

  var VirtualElementBridge = {};
  VirtualElementBridge._DEFAULT_SLOT_PROP = 'children';
  /**
   * Prototype for the JET component definitional bridge instance
   */

  VirtualElementBridge.proto = Object.create(oj.BaseCustomElementBridge.proto);
  oj.CollectionUtils.copyInto(VirtualElementBridge.proto, {
    AddComponentMethods: function AddComponentMethods(proto) {
      // eslint-disable-next-line no-param-reassign
      proto.setProperty = function (prop, value) {
        var bridge = oj.BaseCustomElementBridge.getInstance(this);

        if (!bridge.SaveEarlyPropertySet(prop, value)) {
          bridge.SetProperty(this, prop, value, this, true);
        }
      }; // eslint-disable-next-line no-param-reassign


      proto.getProperty = function (prop) {
        // 'this' is the property object we pass to the definitional element contructor to track internal property changes
        var bridge = oj.BaseCustomElementBridge.getInstance(this);
        return bridge.GetProperty(this, prop, this);
      };
    },
    AttributeChangedCallback: function AttributeChangedCallback(attr, oldValue, newValue) {
      // Invoke callback on the superclass
      oj.BaseCustomElementBridge.proto.AttributeChangedCallback.call(this, attr, oldValue, newValue); // The browser triggers this callback even if old and new values are the same
      // so we should do an equality check ourselves to prevent extra work

      if (oldValue !== newValue) {
        // VComponents need to update _LIVE_CONTROLLED_PROPS even during the patching case
        var bridge = oj.BaseCustomElementBridge.getInstance(this); // If we haven't already called HandleAttributeChanged in superclass, check to see
        // if we should call it to update _LIVE_CONTROLLED_PROPS for attributes updated during
        // the VComponent render() patching cycle

        if (!bridge.ShouldHandleAttributeChanged(this) && oj.BaseCustomElementBridge.proto.ShouldHandleAttributeChanged.call(bridge, this)) {
          var vcomp = this._vcomp;

          if (!vcomp || vcomp.isCustomElementFirst()) {
            bridge.HandleAttributeChanged(this, attr, oldValue, newValue);
          }
        }
      }
    },
    CreateComponent: function CreateComponent(element) {
      if (!element._vcomp) {
        if (oj.Components) {
          oj.Components.unmarkPendingSubtreeHidden(element);
        }

        var descriptor = oj.BaseCustomElementBridge.__GetDescriptor(element.tagName);

        var slotMap = oj.BaseCustomElementBridge.getSlotMap(element); // Initialize controlled root properties now that we know bindings have resolved and
        // data bound global attributes should be resolved.

        this._initializeControlledProps(element);

        var vprops = this._getVComponentProps();

        var vcomp = new descriptor._CONSTRUCTOR(vprops); // Cache a uniqueID on the vcomponent instance

        vcomp._uniqueId = oj.__AttributeUtils.getUniqueId(element.id);
        Object.defineProperty(element, '_vcomp', {
          value: vcomp,
          enumerable: false
        });
        vcomp.setCallbacks(this._getCallbacks(element));

        this._mountCustomElement(element, element._vcomp, vprops, slotMap);
      }

      element._vcomp.mounted(); // Set flag when we can fire property change events


      this.__READY_TO_FIRE = true; // Resolve the component busy state

      this.resolveDelayedReadyPromise();
    },
    // eslint-disable-next-line no-unused-vars
    DefineMethodCallback: function DefineMethodCallback(proto, method, methodMeta) {
      // eslint-disable-next-line no-param-reassign
      proto[method] = function () {
        // The VComponent is asynchronously instantiated by CreateComponent so we
        // need to check that this has happened before we call any methods defined on it.
        // Custom elements are upgraded synchronously meaning the method will be available
        // on the HTMLElement, but we tell applications to wait on the component busy context
        // before accessing properties and methods due to the asynch CreateComponent call.
        if (!this._vcomp) {
          var bridge = oj.BaseCustomElementBridge.getInstance(this);
          bridge.throwError(this, 'Cannot access methods before element is upgraded.');
        }

        return this._vcomp[method].apply(this._vcomp, arguments);
      };
    },
    DefinePropertyCallback: function DefinePropertyCallback(proto, property, propertyMeta) {
      /**
       * Property sets are processed differently whether they are coming from the application
       * or interally from the component. All outer application sets will be processed synchronously
       * since that would be the expected behavior, while internal component sets will be processed
       * asynchronously. This allows the application to update a property, like oj-table's selection,
       * which will then cause the component to update an associated property first-selected-row and
       * trigger the [property]Changed events after all the properties have been updated. Otherwise,
       * the application will receive a selectionChanged event when the firstSelectedRow property could
       * be out of sync. Rendering is done asynchronously regardless of whether an application or component update
       * occured.
       * @param {any} value The property value to set
       * @param {boolean} bOuterSet True if the set is coming from the custom element
       *                            instead of the bridge's _PROPS_PROXY
       */
      function set(value, bOuterSet) {
        var propertyUpdate = {
          isOuter: bOuterSet,
          name: property,
          value: value,
          meta: propertyMeta
        }; // For 9.0.0, making property mutations synchronous whether they're internal or external
        // (renders will still be async).  This means when updating multiple properties that the
        // property change events will be fired after each mutation rather than after all mutations
        // This will be revisited in the future.

        this._BRIDGE._updateProperty(this._ELEMENT, propertyUpdate, true);
      }

      function innerSet(value) {
        set.bind(this)(value, false);
      } // Called on the custom element


      function outerSet(value) {
        // VComponent-first elements should only be updated by its parent during rendering
        // and not through the live DOM updates. We will ignore outer sets
        // for VComponent-first elements to avoid being out of sync with the
        // state the parent believes its child to be in.
        var vcomp = this._vcomp;
        var bridge = oj.BaseCustomElementBridge.getInstance(this);

        if (!vcomp || vcomp.isCustomElementFirst()) {
          set.bind(bridge._PROPS_PROXY)(value, true);
        } else if (vcomp && !vcomp.isCustomElementFirst()) {
          bridge.throwError(this, 'Cannot set properties on a VComponent-first element.');
        }
      }

      function get() {
        var value = this._BRIDGE._PROPS[property]; // If the attribute has not been set, return the default value

        if (value === undefined) {
          value = this._BRIDGE._getDefaultValue(property, propertyMeta);
          this._BRIDGE._PROPS[property] = value;
        }

        return value;
      }

      function innerGet() {
        return get.bind(this)();
      } // Called on the custom element


      function outerGet() {
        var vcomp = this._vcomp; // VComponent-first elements should only be updated by its parent during rendering
        // and not through the live DOM updates. We will ignore outer gets
        // for VComponent-first elements, since they are an implementation detail of the parent element
        // and should not be interacted with in the DOM. This case will be treated as an unsupported error case
        // and always return undefined.

        if (vcomp && !vcomp.isCustomElementFirst()) {
          return undefined;
        }

        var bridge = oj.BaseCustomElementBridge.getInstance(this);
        return get.bind(bridge._PROPS_PROXY)();
      } // Don't add event listener properties for inner props


      if (!propertyMeta._derived) {
        oj.BaseCustomElementBridge.__DefineDynamicObjectProperty(proto._propsProto, property, innerGet, innerSet);
      }

      oj.BaseCustomElementBridge.__DefineDynamicObjectProperty(proto, property, outerGet, outerSet);
    },
    GetAttributes: function GetAttributes(metadata) {
      var attrs = oj.BaseCustomElementBridge.proto.GetAttributes.call(this, metadata); // Components can indicate additional global attributes they want to be notified about
      // via metadata. These attributes can be used by the component to then update the root
      // global attributes.

      var rootPropsMap = metadata.extension && metadata.extension._ROOT_PROPS_MAP;

      if (rootPropsMap) {
        Object.keys(rootPropsMap).forEach(function (prop) {
          attrs.push(oj.__AttributeUtils.getGlobalAttrForProp(prop));
        });
      }

      return attrs;
    },
    // This setting is involved in tracking child elements used for slots
    // for VComponents created as custom elements. The method is called when the
    // element is connected to the DOM, but it is not created yet.
    // Tracking children is prevented for vcomp-first elements, since such elements are
    // rendered first and children are already passed to them through props.
    // The GetTrackChildrenOption() is called on mount operation for already rendered component.
    // If tracking is not prevented at this point, the component would wait for its internal content.
    GetTrackChildrenOption: function GetTrackChildrenOption(element) {
      return element._vcomp ? 'none' : 'immediate';
    },
    ShouldHandleAttributeChanged: function ShouldHandleAttributeChanged(element) {
      if (!oj.BaseCustomElementBridge.proto.ShouldHandleAttributeChanged.call(this, element)) {
        return false;
      } // We only care about attribute change notifications if we're CustomElement-first,
      // since we need to re-render if the application has modified a controlled root property
      // directly on a custom element.
      //
      // Note that if the vcomp has not yet been created, we allow attribute changed
      // processing to continue, as BaseCustomElementBridge has binding-related work
      // that it may need to perform.


      var vcomp = element._vcomp;
      return !vcomp || vcomp.isCustomElementFirst() && !vcomp.isPatching();
    },
    HandleAttributeChanged: function HandleAttributeChanged(element, attr, oldValue, newValue) {
      var vcomp = element._vcomp;
      var rootPropsMap = this._EXTENSION._ROOT_PROPS_MAP;

      if (vcomp && rootPropsMap) {
        var prop = oj.__AttributeUtils.getGlobalPropForAttr(attr) || attr;

        if (rootPropsMap[prop] && oldValue !== newValue) {
          // Get the property value if there is one so we pass the correctly typed value
          // to the VComponent unless that value is null in which case we should remove
          // the property from controlled props since this will get merged to the VComponent's
          // this.props and we don't pass values into this.props if undefined.
          if (newValue == null) {
            delete this._LIVE_CONTROLLED_PROPS[prop]; // Only update the _VCOMP_CONTROLLED_PROPS if the update was not triggered
            // by the vcomponent during patching

            if (!vcomp.isPatching()) {
              delete this._VCOMP_CONTROLLED_PROPS[prop];
            }
          } else {
            var propValue = element[prop];
            this._LIVE_CONTROLLED_PROPS[prop] = propValue != null ? propValue : newValue;

            if (!vcomp.isPatching()) {
              this._VCOMP_CONTROLLED_PROPS[prop] = this._LIVE_CONTROLLED_PROPS[prop];
            }
          } // Only rerender if we're not updating during a VComponent patching of controlled
          // global properties


          if (!vcomp.isPatching()) {
            this._queueRender(element);
          }
        }
      }
    },
    // eslint-disable-next-line no-unused-vars
    HandleReattached: function HandleReattached(element) {
      this._verifyConnectDisconnect(element, 1);
    },
    // eslint-disable-next-line no-unused-vars
    HandleDetached: function HandleDetached(element) {
      this._verifyConnectDisconnect(element, 0);
    },
    _verifyConnectDisconnect: function _verifyConnectDisconnect(element, state) {
      if (this._verifyingState === -1) {
        window.queueMicrotask(function () {
          // This checks that we don't call any lifecycle hooks
          // for reparent case where _verifyingState has been
          // updated but the initial state we called
          // this Promise with is different
          if (this._verifyingState === state) {
            if (this._verifyingState === 0) {
              element._vcomp.unmounted();
            } else {
              element._vcomp.mounted();
            }
          }

          this._verifyingState = -1;
        }.bind(this));
      }

      this._verifyingState = state;
    },
    InitializeElement: function InitializeElement(element) {
      if (!element._vcomp) {
        if (oj.Components) {
          oj.Components.markPendingSubtreeHidden(element);
        }

        oj.BaseCustomElementBridge.__InitProperties(element, element); // After initializing properties from DOM attributes, go through
        // event metadata and add appropriate callbacks


        this.InitializeEventCallbacks(element);
      }
    },
    InitializePrototype: function InitializePrototype(proto) {
      // Invoke callback on the superclass
      oj.BaseCustomElementBridge.proto.InitializePrototype.call(this, proto);
      Object.defineProperty(proto, '_propsProto', {
        value: {}
      });
    },
    InitializeBridge: function InitializeBridge(element, descriptor) {
      // Invoke callback on the superclass
      oj.BaseCustomElementBridge.proto.InitializeBridge.call(this, element, descriptor); // Flag used to detect a verified connected/disconnected state
      // -1 = not verifying
      // 0 = disconnected
      // 1 = connected

      this._verifyingState = -1;
      this._EXTENSION = this.METADATA.extension || {};
      this._CONSTRUCTOR = descriptor._CONSTRUCTOR; // For tracking all properties (source of truth for property storage)

      this._PROPS = {}; // Stores any requested property updates, gets processed synchronously for outer sets, but asynch for inner sets

      this._PROP_CHANGE_QUEUE = []; // Stores property change events that are waiting to be fired.  When multiple property updates are being processed in _PROP_CHANGE_QUEUE,
      // events are stored in _PROP_CHANGE_EVENT_QUEUE until property updates have been reflected, then all events are fired

      this._PROP_CHANGE_EVENT_QUEUE = []; // Has getters/setters and calls to set properties on this._PROPS

      if (element._propsProto) {
        this._PROPS_PROXY = Object.create(element._propsProto);
        this._PROPS_PROXY._BRIDGE = this;
        this._PROPS_PROXY._ELEMENT = element;
      } // We need to maintain two sets of controlled properties in the bridge. One set of controlled properties
      // should always reflect the current state of the DOM even after internal changes that occur during
      // patching and a second version that does not reflect the internal changes that we merge to the props
      // we pass to the VComponent for rendering. This former collection is what petit-dom will use as the
      // 'old' root props for patching. This will allow petit-dom to correctly respond to both application and
      // VComponent updates to controlled properties.


      this._LIVE_CONTROLLED_PROPS = {};
      this._VCOMP_CONTROLLED_PROPS = {};
    },
    InitializeEventCallbacks: function InitializeEventCallbacks(element) {
      var _this3 = this;

      var eventsMeta = this.METADATA.events;

      if (eventsMeta) {
        Object.keys(eventsMeta).forEach(function (event) {
          var eventMeta = eventsMeta[event];

          var eventProp = oj.__AttributeUtils.eventTypeToEventListenerProperty(event);

          _this3._PROPS[eventProp] = function (detailObj) {
            var detail = Object.assign({}, detailObj); // If we're firing a cancelable event, inject an accept function into
            // the event detail so the consumer can asynchronously cancel the event.
            // We only support an asynchronously cancelable event at the moment.

            var cancelable = !!eventMeta.cancelable;
            var acceptPromises = [];

            if (cancelable) {
              detail.accept = function (promise) {
                acceptPromises.push(promise);
              };
            }

            var eventDescriptor = {
              detail: detail,
              bubbles: !!eventMeta.bubbles,
              cancelable: cancelable
            };
            var customEvent = new CustomEvent(event, eventDescriptor);
            element.dispatchEvent(customEvent);

            if (cancelable) {
              return customEvent.defaultPrevented ? Promise.reject() : Promise.all(acceptPromises).then(function () {
                return Promise.resolve();
              }, function (reason) {
                return Promise.reject(reason);
              });
            }

            return undefined;
          };
        });
      }
    },
    PlaybackEarlyPropertySets: function PlaybackEarlyPropertySets(element) {
      if (!element._vcomp) {
        oj.BaseCustomElementBridge.proto.PlaybackEarlyPropertySets.call(this, element);
      }
    },
    GetPreCreatePromise: function GetPreCreatePromise(element) {
      var promise = oj.BaseCustomElementBridge.proto.GetPreCreatePromise.call(this, element); // If the template engine has not yet been loaded, and we have have some template elements as direct children,
      // chain the base class's pre-create promise with the promise for the template engine becoming
      // loaded and cached
      // eslint-disable-next-line no-use-before-define

      if (!_cachedTemplateEngine && _hasDirectTemplateChildren(element)) {
        promise = promise.then(function () {
          return _getTemplateEnginePromise();
        });
      }

      return promise;
    },
    ValidateAndSetProperty: function ValidateAndSetProperty(propNameFun, componentProps, property, value, element) {
      var _value = this.ValidatePropertySet(element, property, value);

      VirtualElementBridge.__SetProperty(propNameFun, componentProps, property, _value);
    },
    _mountCustomElement: function _mountCustomElement(element, vcomp, vprops, slotMap) {
      // Cache the slot content because custom elements don't support reslotting
      this._content = VirtualElementBridge._processSlotContent(element, slotMap); // Make a copy of the controlled props so we get a snapshot before mounting.
      // We want to avoid the case where a VComponent updates the custom element
      // controlled properties during mount and the controlled props are updated
      // before a queued render is called.

      var controlledPropsCopy = Object.assign({}, this._LIVE_CONTROLLED_PROPS); // mountContent appends child nodes to element

      vcomp.mountContent(vprops, this._content, element, controlledPropsCopy);
    },

    /**
     * Property update callback to pass to VComponent.  Delegates to _PROPS_PROXY
     * which calls the inner set methods
     * @param {HTMLElement} element The custom element to process a property change for
     * @param {string} prop The property to update
     * @param {any} value The new property value
     * @return void
     * @private
     */
    _queuePropertyUpdate: function _queuePropertyUpdate(element, prop, value, queueRender) {
      this._PROPS_PROXY[prop] = value;

      if (queueRender) {
        this._queueRender(element);
      }
    },

    /**
     * Pushes a property update to the queue. Processes the queue synchronously or asynchronously based on the specified flag.
     * Called by both inner and outer sets.
     *
     * @param {HTMLElement} element The custom element to process a property change for
     * @param {Object} propertyUpdate An object containing isOuter, name, value, meta keys
     * @param {boolean} sync whether to process the property synchronously
     * @private
     */
    _updateProperty: function _updateProperty(element, propertyUpdate, sync) {
      this._PROP_CHANGE_QUEUE.push(propertyUpdate); // Process the property set queue immediately for outer sets, but asynchronously for inner sets


      if (sync) {
        this._processPropertyQueue(element);
      } else if (!this._propsProcessingQueued) {
        // We do not need to add a busy state here because
        // the properties are processed as microtasks and
        // should be completed by the time the application
        // needs to interact with the component
        this._propsProcessingQueued = true;
        window.queueMicrotask(function () {
          this._processPropertyQueue(element);

          this._propsProcessingQueued = false;
        }.bind(this));
      }
    },

    /**
     * Process and apply the current set of property updates.
     * @param {HTMLElement} element The custom element to process a property change for
     * @return void
     * @private
     */
    _processPropertyQueue: function _processPropertyQueue(element) {
      var propertyUpdate = this._PROP_CHANGE_QUEUE.shift();

      while (propertyUpdate) {
        var name = propertyUpdate.name;
        var value = propertyUpdate.value;
        var meta = propertyUpdate.meta; // Properties can be set before the component is created. These early
        // sets are actually saved until after component creation and played back.

        if (!this.SaveEarlyPropertySet(name, value)) {
          var previousValue = this._PROPS[name];

          if (!oj.BaseCustomElementBridge.__CompareOptionValues(name, meta, value, previousValue)) {
            // Skip validation for inner sets so we don't throw an error when updating readOnly
            // writeable properties
            if (propertyUpdate.isOuter) {
              value = this.ValidatePropertySet(element, name, value);
            } // Instead of updating undefined in our property bag, delete the key
            // so later when we copy props for vcomponent rendering, we can use
            // Object.assign without overriding default values when the value is undefined


            if (value === undefined) {
              delete this._PROPS[name];
            } else {
              this._PROPS[name] = value;
            } // Queue a property change event to fire


            propertyUpdate.previousValue = previousValue;

            this._PROP_CHANGE_EVENT_QUEUE.push(propertyUpdate); // This will get called before connected callback so short circuit render for that case
            // Only force render for outer sets, internal sets can optionally trigger renders and will
            // be queued separately by the VComponent


            if (element._vcomp && propertyUpdate.isOuter) {
              this._queueRender(element);
            }
          }
        }

        propertyUpdate = this._PROP_CHANGE_QUEUE.shift();
      }

      this._firePropertyChangeEvents(element);
    },

    /**
     * Processes the current property changed queue and fires the appropriate
     * [property]Changed event from the custom element.
     * @param {HTMLElement} element The custom element to fire a [property]Changed event for
     * @return void
     * @private
     */
    _firePropertyChangeEvents: function _firePropertyChangeEvents(element) {
      var propertyUpdate = this._PROP_CHANGE_EVENT_QUEUE.shift();

      while (propertyUpdate) {
        oj.BaseCustomElementBridge.__FirePropertyChangeEvent(element, propertyUpdate.name, propertyUpdate.value, propertyUpdate.previousValue, propertyUpdate.isOuter ? 'external' : 'internal');

        propertyUpdate = this._PROP_CHANGE_EVENT_QUEUE.shift();
      }
    },

    /**
     * Registers an asynchronous component render as a result of a state or property update.
     * @param {HTMLElement} element The custom element to queue a render for
     * @return void
     * @private
     */
    _queueRender: function _queueRender(element) {
      element._vcomp.queueRender(element, 'propsUpdate');
    },

    /**
     * We need to make a copy of the properties any time we hand off props to the vcomp,
     * as we mutate our own copy and vcomp should not be exposed to these changes
     * (until we hand off a new copy). We will also augment the props we pass to the vcomp
     * with any controlled properties and slots the component has registered.
     * @private
     */
    _getVComponentProps: function _getVComponentProps() {
      var staticDefaults = ojdefaultsutils.DefaultsUtils.getStaticDefaults(this._CONSTRUCTOR, this.METADATA, true);
      var propsCopy = Object.create(staticDefaults); // Copy the current root props into this.props so component can initialize property dependent state

      return Object.assign(propsCopy, this._PROPS, this._VCOMP_CONTROLLED_PROPS);
    },

    /**
     * Returns an object containing override callbacks for VComponent functionality so that we can
     * cause different behavior for the custom element-first case.
     *
     * @private
     */
    _getCallbacks: function _getCallbacks(element) {
      var _this4 = this;

      return {
        _updateProperty: this._queuePropertyUpdate.bind(this, element),
        getPropsForRender: function getPropsForRender() {
          return _this4._getVComponentProps();
        },
        patch: function patch(props) {
          // The errors thrown by the VComponent logic after a busy state
          // is registered in the queueRender() method will be caught by queueRender()
          // try-catch block. The caller will resolve the busy state for that case.
          var controlledPropsCopy = Object.assign({}, _this4._LIVE_CONTROLLED_PROPS);

          element._vcomp.patchContent(props, controlledPropsCopy, _this4._content); // Store unslotted nodes


          VirtualElementBridge._storeUnslottedNodes(element, _this4._slotVNodes);
        },
        convertChildrenToSlotProps: function convertChildrenToSlotProps(children) {
          // Only process children after initial render for the custom element first case
          if (!_this4._slotProps) {
            // Save the slot nodes so we can store unslotted nodes after render
            _this4._slotVNodes = children; // Generate the map of slot property names to vnode arrays

            var slotMap = _generateSlotMap(children, _this4.METADATA, _this4._EXTENSION); // Convert to map of slot property names as the right types
            // 1) VNode[] for default children property
            // 2) () => VNode[] for named non template slots
            // 3) (context) => VNode[] for template slots


            _this4._slotProps = _generateSlotPropsMap(element, slotMap);
          }

          return _this4._slotProps;
        }
      };
    },

    /**
     * Initializes controlled roop props based on the controlled properties specified in the metadata
     * and the attributes of the specified element
     * @param {HTMLElement} element
     * @private
     */
    _initializeControlledProps: function _initializeControlledProps(element) {
      var rootPropsMap = this._EXTENSION._ROOT_PROPS_MAP;

      if (rootPropsMap) {
        var liveRootProps = this._LIVE_CONTROLLED_PROPS;
        var vcompRootProps = this._VCOMP_CONTROLLED_PROPS;
        Object.keys(rootPropsMap).forEach(function (prop) {
          var attr = oj.__AttributeUtils.getGlobalAttrForProp(prop);

          if (element.hasAttribute(attr)) {
            // Try and get the property so the type is correct, if not available
            // get the attribute value, e.g. data-, aria-, tabindex (since property is tabIndex)
            var propValue = element[prop];
            liveRootProps[prop] = propValue != null ? propValue : element.getAttribute(attr);
            vcompRootProps[prop] = liveRootProps[prop];
          }
        });
      }
    },
    _getDefaultValue: function _getDefaultValue(property) {
      // A read only copy of the default value
      return ojdefaultsutils.DefaultsUtils.getFrozenDefault(property, this._CONSTRUCTOR, this.METADATA);
    }
  });
  /**
   * @export
   */

  VirtualElementBridge.register = function (tagName, constr) {
    var metadata = constr.metadata;
    var descriptor = {};
    descriptor[oj.BaseCustomElementBridge.DESC_KEY_META] = metadata;
    descriptor._CONSTRUCTOR = constr;

    if (oj.BaseCustomElementBridge.__Register(tagName, descriptor, VirtualElementBridge.proto)) {
      customElements.define(tagName.toLowerCase(), VirtualElementBridge.proto.getClass(descriptor));
    }
  };
  /**
   * @private
   */


  function _hasDirectTemplateChildren(element) {
    var childNodeList = element.childNodes;

    for (var i = 0; i < childNodeList.length; i++) {
      var child = childNodeList[i];

      if (child.localName === 'template') {
        return true;
      }
    }

    return false;
  }
  /**
   * @private
   */


  var _cachedTemplateEngine;
  /**
   * @private
   */


  function _getTemplateEnginePromise() {
    return new Promise(function (resolve, reject) {
      require(['ojs/ojtemplateengine'], function (eng) {
        _cachedTemplateEngine = eng;
        resolve(eng);
      }, reject);
    });
  }
  /**
   * Creates a storage node for a custom element, moves all slot content to
   * the storage node and returns an Array of virtual nodes representing the
   * slot content or null if the custom element has no slot content.
   * @param {Element} element The custom element
   * @param {Object} slotMap
   * @return {Array}
   * @private
   */


  VirtualElementBridge._processSlotContent = function (element, slotMap) {
    var content = [];

    if (element.childNodes) {
      // Needed to replicate what shadow DOM does since we don't have a
      // shadow root to hide slot content that do not map to a component
      // defined slot.
      if (!element._nodeStorage) {
        // eslint-disable-next-line no-param-reassign
        element._nodeStorage = document.createElement('div'); // eslint-disable-next-line no-param-reassign

        element._nodeStorage.style.display = 'none';
        element.appendChild(element._nodeStorage);
      } // Array of virtual nodes we will pass to the VComponent mountContent method


      var assignableNodes = [];
      var entries = Object.entries(slotMap);
      entries.forEach(function (entry) {
        var slot = entry[0];
        entry[1].forEach(function (node) {
          // Create a lightweight virtual node that contains a reference
          // back to the original slot content and slot value
          content.push(_wrapNode(node, slot));
          assignableNodes.push(node);
        });
      });
      assignableNodes.forEach(function (assignableNode) {
        element._nodeStorage.appendChild(assignableNode); // @HTMLUpdateOK
        // Notifies JET components inside nodeStorage that they have been hidden
        // For upstream or indirect dependency we will still rely components being registered on the oj namespace.


        if (oj.Components) {
          oj.Components.subtreeHidden(assignableNode);
        }
      });
    }

    return content;
  };
  /**
   * @param {function} propNameFun A function that returns the actual property name to use, e.g. an alias
   * @param {Object} componentProps The object to set the new property value on which is the
   *                                element for outer property sets and the property bag for inner sets.
   * @param {string} property The property name
   * @param {Object} value The value to set for the property
   * @ignore
   */


  VirtualElementBridge.__SetProperty = function (propNameFun, componentProps, property, value) {
    var propsObj = componentProps;
    var propPath = property.split('.');
    var branchedProps; // Set subproperty, initializing parent objects along the way unless the top level
    // property is not defined since setting it to an empty object will trigger a property changed
    // event. Instead, branch and set at the end. We only have listeners on top level properties
    // so setting a subproperty will not trigger a property changed event along the way.

    var topProp = propNameFun(propPath[0]);

    if (propPath.length > 1 && !componentProps[topProp]) {
      branchedProps = {};
      propsObj = branchedProps;
    } // Walk to the correct location


    for (var i = 0; i < propPath.length; i++) {
      var subprop = propNameFun(propPath[i]);
      var objValue = propsObj[subprop];

      if (i === propPath.length - 1) {
        propsObj[subprop] = value;
      } else if (!objValue) {
        propsObj[subprop] = {};
      } else if (Object.isFrozen(objValue)) {
        // If value is frozen, make a copy since we freeze default values
        propsObj[subprop] = oj.CollectionUtils.copyInto({}, objValue, undefined, true);
      }

      propsObj = propsObj[subprop];
    } // Update the original component properties if we branched


    if (branchedProps) {
      // eslint-disable-next-line no-param-reassign
      componentProps[topProp] = branchedProps[topProp];
    }
  };
  /**
   * Given a custom element and its slotMap, checks all slotted nodes to see
   * if they were removed during patching and moves that node to the storage node.
   * Otherwise, unslotted content will get an unmounted call and knockout variables
   * receiving updates when not attached to the DOM will become out of sync.
   * @param {Element} element The custom element
   * @param {Array} slotVNodes The current array of slot vnodes for the element
   * @return {void}
   * @private
   */


  VirtualElementBridge._storeUnslottedNodes = function (element, slotVNodes) {
    if (slotVNodes && element._nodeStorage) {
      slotVNodes.forEach(function (vnode) {
        var node = vnode._node; // Check to see if the node has been disconnected in the last rerender
        // and move to the storage node and notify that node that it's been hidden.
        // Petit-dom handles calling subtreeShown when appending children into DOM.

        if (!node.isConnected) {
          element._nodeStorage.appendChild(node);

          if (oj.Components) {
            oj.Components.subtreeHidden(node);
          }
        }
      });
    }
  };
  /**
   * Helper function that takes a DOM node and wraps it in a lightweight vnode object
   * @param {Element} node The DOM node to wrap
   * @param {string?} slot An optional slot name for the vnode props. This can be different
   *                       from the slot attribute value and is only needed for children that
   *                       will be passed as content to the VComponent mount/patch methods
   *                       See oj.BaseCustomElementBridge.getSlotAssignment() for slot name details.
   * @return {object}
   * @private
   */


  function _wrapNode(node, slot) {
    switch (node.nodeType) {
      // Comment nodes are not considered slottable, but
      // we need these in the template case. For normal slots,
      // the map we get from the bridge shouldn't contain any comment
      // nodes. We don't care about DOM updates in that case since it's
      // not supported. For template slots, if the root node is an
      // oj-bind-if for example, we want that to work correctly when udpates
      // occur.
      case Node.COMMENT_NODE:
        return {
          _node: node
        };

      case Node.TEXT_NODE:
        return {
          _text: node.nodeValue,
          _node: node
        };

      case Node.ELEMENT_NODE:
        var content = []; // Wrap child nodes for petit-dom patching.
        // There is no reslotting, but the component may slot
        // a different child node on subsequent renders (e.g. oj-switcher tab switching)
        // so we need to ensure the vnode is as 'real' as possible to ensure the DOM
        // will be updated correctly during patching.

        node.childNodes.forEach(function (childNode) {
          // These are just child nodes of the slotted parent node so we don't need to pass
          // a slot for the child
          var wrappedChild = _wrapNode(childNode); // Skip non text/element nodes like comment nodes


          if (wrappedChild) {
            content.push(wrappedChild);
          }
        });
        var vnode = {
          type: node.tagName.toLowerCase(),
          _node: node,
          props: node,
          content: content
        }; // IE does not have slot property support so the slot attribute will not
        // get mapped to a slot property. We will need to populate it ourselves.

        if (slot != null && vnode.props.slot !== slot) {
          vnode.props.slot = slot;
        }

        return vnode;

      default:
        return null;
    }
  }
  /**
   * Helper function that unwraps a DOM node from a vnode
   * @param {object} vnode The vnode to unwrap
   * @return {Element}
   * @private
   */


  function _unwrapNode(vnode) {
    return vnode && vnode._node;
  }
  /**
   * Generates a slot property map of VNode[]
   * @param {Array} children The vnodes to process
   * @param {object} metadata The component metadata
   * @return {object}
   * @private
   */


  function _generateSlotMap(children, metadata, ext) {
    var slots = metadata.slots || {};
    var dynamicSlotProp = ext._DYNAMIC_SLOT_PROP;
    var slotMap = {};
    children.forEach(function (vnode) {
      // Text nodes and comment nodes don't have a vnode.props
      // field and always map to the default slot. Note that normally
      // comment nodes aren't slottable, but we need them for the template case.
      var slot = vnode.props ? vnode.props.slot : ''; // If slot name is defined check to see if it exists in the metadata as a named slot. If it doesn't
      // then it may be a dynamic slot so stash it as under the slot property for dynamic slots.

      var slotProp = VirtualElementBridge._DEFAULT_SLOT_PROP;

      if (slot) {
        slotProp = slots[slot] ? slot : dynamicSlotProp;
      }

      if (slotProp === dynamicSlotProp) {
        // Stop processing if node doesn't match any named slots and component
        // does not define a dynamic slot.
        if (!dynamicSlotProp) {
          return;
        } // Dynamic slots


        if (!slotMap[slotProp]) {
          slotMap[slotProp] = _defineProperty({}, slot, []);
        }

        if (!slotMap[slotProp][slot]) {
          slotMap[slotProp][slot] = [];
        }

        slotMap[slotProp][slot].push(vnode);
      } else if (slotProp) {
        // Named and default slots
        if (!slotMap[slotProp]) {
          slotMap[slotProp] = [];
        }

        slotMap[slotProp].push(vnode);
      }
    });
    return slotMap;
  }
  /**
   * Converts a slot map to the correct slot property types
   * @param {Element} element The custom element
   * @param {object} slotMap The slot map to process
   * @return {object}
   * @private
   */


  function _generateSlotPropsMap(element, slotMap) {
    var propsMap = {};
    Object.keys(slotMap).forEach(function (slot) {
      var slotContent = slotMap[slot]; // The default slot is returned as VNode[], but all others are returned as render functions

      if (slot === VirtualElementBridge._DEFAULT_SLOT_PROP) {
        propsMap[slot] = slotContent;
      } else if (Array.isArray(slotContent)) {
        propsMap[slot] = getSlotRenderFunc(element, slotContent);
      } else {
        // Dynamic slot case
        if (!propsMap[slot]) {
          propsMap[slot] = {};
        }

        Object.keys(slotContent).forEach(function (dynSlot) {
          propsMap[slot][dynSlot] = getSlotRenderFunc(element, slotContent[dynSlot]);
        });
      }
    });
    return propsMap;
  }
  /**
   * Helper to create a slot render function and lazily execute a template engine
   * if a context object is passed to the slot render, returning the vnodes otherwise.
   * @param {Element} element The custom element
   * @param {object} vnodes The vnode array to return/process for the slot
   * @return {object}
   * @private
   */


  function getSlotRenderFunc(element, vnodes) {
    return function (context) {
      // Dynamically check to see if the slot render function was called with
      // a context object. If it was and the slot node is a template node,
      // execute the template engine and wrap the resulting DOM nodes. Otherwise
      // return the vnodes directly.
      if (context) {
        var templateNode = _unwrapNode(vnodes[0]);

        if (templateNode.nodeName === 'TEMPLATE') {
          if (!_cachedTemplateEngine) {
            throw new Error('Unexpected call to render a template slot');
          }

          var domNodes = _cachedTemplateEngine.execute(element, templateNode, context);

          return domNodes.map(function (node) {
            var vnode = _wrapNode(node); // Pass a reference to the template engine's clean method so
            // petit-dom can call it before removing any template nodes from the DOM


            vnode._clean = _cachedTemplateEngine.clean.bind(null, node);
            return vnode;
          });
        }
      }

      return vnodes;
    };
  }

  function customElement(tagName) {
    return function (constructor) {
      var componentRender = constructor.prototype.render;

      constructor.prototype.render = function () {
        var vnode = componentRender.call(this);

        if (vnode.type !== tagName) {
          vnode = PetitDom.h(tagName, null, vnode);
        }

        _verifyProps(vnode.props, constructor['metadata']);

        return vnode;
      };

      constructor.prototype.mount = function (props, content, uncontrolledRootProps) {
        this._vnode = this._renderForMount(props, content);
        var mountNode = this._ref = PetitDom.mountCustomElement(this._vnode, uncontrolledRootProps);
        Object.defineProperty(mountNode, '_vcomp', {
          value: this,
          enumerable: false
        });
        return mountNode;
      };

      constructor.prototype.patch = function (props, content, uncontrolledRootProps, oldUncontrolledRootProps) {
        var oldProps = this.props;
        var oldState = this.state;
        var oldVnode = this._vnode;
        this._vnode = this._renderForPatch(props, content);
        this._vnode['_node'] = this._ref;
        this._patching = true;

        try {
          PetitDom.patchCustomElement(this._vnode, oldVnode, uncontrolledRootProps, oldUncontrolledRootProps);
        } finally {
          this._patching = false;
        }

        this.updated(oldProps, oldState);
      };

      constructor.prototype.mountContent = function (props, content, rootElem, controlledRootProps) {
        this._isCustomElementFirst = true;
        this._ref = rootElem;
        this._vnode = this._renderForMount(props, content);
        this._vnode._node = rootElem;
        this._patching = true;

        try {
          PetitDom.mountCustomElementContent(this._vnode, controlledRootProps);
        } finally {
          this._patching = false;
        }
      };

      constructor.prototype.patchContent = function (props, controlledRootProps, content) {
        var oldProps = this.props;
        var oldState = this.state;
        var oldVnode = this._vnode;
        this._vnode = this._renderForPatch(props, content);
        this._vnode['_node'] = this._ref;
        this._patching = true;

        try {
          PetitDom.patchCustomElementContent(this._vnode, oldVnode, controlledRootProps);
        } finally {
          this._patching = false;
        }

        this.updated(oldProps, oldState);
      };

      constructor.prototype.setCallbacks = function (callbacks) {
        this._callbacks = callbacks;
      };

      constructor.prototype.isCustomElementFirst = function () {
        return this._isCustomElementFirst === true;
      };

      constructor.prototype.isPatching = function () {
        return this._patching;
      };

      function _isValidRootProp(prop, metadata) {
        var _a;

        var allowedProps = {
          class: true,
          style: true,
          ref: true,
          key: true
        };
        var verifiedRootPropMap = ((_a = metadata.extension) === null || _a === void 0 ? void 0 : _a['_ROOT_PROPS_MAP']) || {};
        return allowedProps[prop] || verifiedRootPropMap[prop] || oj.__AttributeUtils.eventListenerPropertyToEventType(prop) !== null;
      }

      function _verifyProps(props, metadata) {
        for (var prop in props) {
          if (!_isValidRootProp(prop, metadata)) {
            throw new Error('Component can only render controlled global properties or DOM event listeners on the root custom element. ' + prop + ' will not be rendered.');
          }
        }
      }

      VirtualElementBridge.register(tagName, constructor);
    };
  }

  function listener(options) {
    return function (target, key, descriptor) {
      var fn = descriptor === null || descriptor === void 0 ? void 0 : descriptor.value;
      return {
        configurable: true,
        get: function get() {
          var boundFn = fn.bind(this);
          boundFn[PetitDom.LISTENER_OPTIONS_SYMBOL] = options;
          Object.defineProperty(this, key, {
            configurable: true,
            get: function get() {
              return boundFn;
            },
            set: function set(value) {
              fn = value;
              delete this[key];
            }
          });
          return boundFn;
        },
        set: function set(value) {
          fn = value;
        }
      };
    };
  }

  function dynamicDefault(defaultGetter) {
    return function (target, propertyKey) {
      var key = Symbol();
      return {
        get: function get() {
          var value = this[key];
          return value === undefined ? defaultGetter() : value;
        },
        set: function set(value) {
          this[key] = value;
        }
      };
    };
  }

  function method() {
    return function (target, propertyKey, descriptor) {};
  }

  function rootProperty() {
    return function (target, propertyKey) {};
  }

  function _writeback() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      readOnly: false
    },
        boolean = _ref.readOnly;

    return function (target, propertyKey) {};
  }

  function event() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      bubbles: false
    },
        boolean = _ref2.bubbles;

    return function (target, propertyKey) {};
  }

  exports.VComponent = VComponent;
  exports._writeback = _writeback;
  exports.classPropToObject = classPropToObject;
  exports.customElement = customElement;
  exports.dynamicDefault = dynamicDefault;
  exports.event = event;
  exports.h = h;
  exports.listener = listener;
  exports.method = method;
  exports.rootProperty = rootProperty;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
}())