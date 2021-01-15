(function() {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcontext', 'ojs/ojvdom'], function (exports, Context, ojvdom) {
  'use strict';

  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;
  /**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */

  /**
   * Property decorator for VComponent properties whose default value is determined at
   * runtime and returned via the getter method passed to the decorator.
   * @param {Function} defaultGetter The method to call to retrieve the default value
   * @name dynamicDefault
   * @function
   * @memberof! VComponent
   * @ojdecorator
   */

  /**
   * Method decorator for VComponent that binds a specified method to the component instance 'this'
   * and passes provided options to the addEventListener()/removeEventListener() calls, when the method is used as a listener.
   * @param {object=} options The options for this decorator
   * @param {boolean=} options.passive True indicates that the listener will never call preventDefault().
   * @param {boolean=} options.capture True indicates that events of this type will be dispatched to the registered listener
   *                                  before being dispatched to any target beneath it in the DOM tree.
   * @name listener
   * @function
   * @memberof! VComponent
   * @ojdecorator
   */

  /**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
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
   * @classdesc <p>
   * <b>Note: the VComponent API is currently in Experimental status.</b>
   * The APIs discussed in this documentation are subject to change.  More specifically,
   * VComponent authors may be required to make changes to their component implementations
   * when upgrading to future versions of JET.
   * </p>
   * <p>
   * The VComponent base class provides a mechanism for defining JET
   * <a href="CompositeOverview.html">Custom Components</a>.
   * Like the JET <a href="ComponentTypeOverview.html#corecomponents">Core Components</a>
   * and composite components, VComponent-based components
   * are exposed as custom elements. From the application developer’s perspective, these
   * custom elements are (essentially) indistinguishable from JET’s other component types.
   * Where VComponents differ is in the component implementation strategy: VComponents produce
   * content via virtual DOM rendering.
   * </p>
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
   *     <li><b>Methods: </b>defined as methods of the VComponent class and marked for exposure on the custom element using the &#64;method decorator.</li>
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
   *   children?: VComponent.Children;
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
   * @ignore
   */

  /**
   * Utility to convert a VComponent's child content into a flattened readonly array of virtual DOM nodes (VNodes).<br/><br/>
   * The returned VNode array is constructed as follows:
   * <ul>
   *   <li>Strings will get converted to VNodes.</li>
   *   <li>If content is null, returns the empty array.</li>
   *   <li>If content is a single VNode, returns an array containing the VNode.</li>
   *   <li>If the content is an array of VNodes, returns the array.</li>
   *   <li>If the content is an array of nested VNodes, returns the flattened array.</li>
   *   <li>Nulls and booleans will be removed from the returned array.</li>
   * </ul>
   * @function flattenChildren
   * @memberof VComponent
   * @param {?(object|Array<object>)} children Children of a VComponent
   * @ojsignature [{target: "Type", for: "children", value: "VComponent.Children|VComponent.VNode|VComponent.VNode[]|null"},
   *               {target: "Type", for: "returns", value: "Readonly<VComponent.VNode[]>"}
   *              ]
   * @return {Array<object>}
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

  var VComponent = /*#__PURE__*/function () {
    function VComponent(props) {
      _classCallCheck(this, VComponent);

      this._pendingPropsUpdate = false;
      this._renderInterrupted = false;
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
        this._vnode = this._renderForMount(props, content);
        return this._ref = ojvdom.mount(this._vnode, true);
      }
    }, {
      key: "patch",
      value: function patch(props, content) {
        var oldProps = this.props;
        var oldState = this.state;
        var oldVnode = this._vnode;

        var newVNode = this._renderForPatch(props, content);

        this._vnode = ojvdom.patch(newVNode, oldVnode, this._ref.parentNode, true);
        this.updated(oldProps, oldState);
      }
    }, {
      key: "notifyMounted",
      value: function notifyMounted() {
        this._renderIfNeeded();

        ojvdom.mounted(this._vnode);
        this.mounted();
      }
    }, {
      key: "notifyUnmounted",
      value: function notifyUnmounted() {
        this._cancelQueuedRender();

        ojvdom.unmount(this._vnode);
        this.unmounted();
      }
    }, {
      key: "queueRender",
      value: function queueRender(element, reason) {
        var _this = this;

        this._renderInterrupted = false;

        if (reason === 'propsUpdate') {
          this._pendingPropsUpdate = true;
        }

        if (!this._busyStateCallbackForRender) {
          var busyContext = Context.getContext(element).getBusyContext();
          this._busyStateCallbackForRender = busyContext.addBusyState({
            description: this.uniqueId() + ' is waiting to render.'
          });
          this._animation = window.requestAnimationFrame(function () {
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
              _this._cleanupRender(busyStateCallbackForRender);
            }
          });
        }
      }
    }, {
      key: "_cancelQueuedRender",
      value: function _cancelQueuedRender() {
        if (this._animation != null) {
          window.cancelAnimationFrame(this._animation);
          this._renderInterrupted = true;

          this._cleanupRender(this._busyStateCallbackForRender);

          this._busyStateCallbackForRender = null;
        }
      }
    }, {
      key: "_cleanupRender",
      value: function _cleanupRender(busyStateCallback) {
        if (busyStateCallback) {
          busyStateCallback();
        }

        this._pendingState = null;
        this._animation = null;
      }
    }, {
      key: "_renderIfNeeded",
      value: function _renderIfNeeded() {
        if (this._renderInterrupted) {
          this.queueRender(this._ref, 'resume');
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

  var h = ojvdom.h;
  var classPropToObject = ojvdom.classPropToObject;

  function listener(options) {
    return function (target, key, descriptor) {
      var fn = descriptor === null || descriptor === void 0 ? void 0 : descriptor.value;
      return {
        configurable: true,
        get: function get() {
          var boundFn = fn.bind(this);
          boundFn[ojvdom.LISTENER_OPTIONS_SYMBOL] = options;
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

  function flattenChildren(children) {
    return ojvdom.flattenContent(children);
  }

  exports.VComponent = VComponent;
  exports.classPropToObject = classPropToObject;
  exports.dynamicDefault = dynamicDefault;
  exports.flattenChildren = flattenChildren;
  exports.h = h;
  exports.listener = listener;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())