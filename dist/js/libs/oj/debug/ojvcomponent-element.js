/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['require', 'exports', 'ojs/ojvcomponent', 'ojs/ojvdom', 'ojs/ojcustomelement', 'ojs/ojcore-base', 'ojs/ojdefaultsutils', 'ojs/ojcontext', 'ojs/ojcustomelement-utils'], function (require, exports, ojvcomponent, ojvdom, ojcustomelement, oj, ojdefaultsutils, Context, ojcustomelementUtils) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) { return e; } else {
            var n = {};
            if (e) {
                Object.keys(e).forEach(function (k) {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                });
            }
            n['default'] = e;
            return n;
        }
    }

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

    /**
     * @license
     * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */

    /**
     * Class decorator for ElementVComponent custom elements. Takes the tag name
     * of the custom element.
     * @param {string} tagName The custom element tag name
     * @name customElement
     * @function
     * @memberof! ElementVComponent
     * @ojdecorator
     */

    /**
     * Property decorator for ElementVComponent properties whose default value is determined at
     * runtime and returned via the getter method passed to the decorator.
     * @param {Function} defaultGetter The method to call to retrieve the default value
     * @name dynamicDefault
     * @function
     * @memberof! ElementVComponent
     * @ojdecorator
     */

    /**
     * Property decorator for ElementVComponent read-only writeback properties.
     * @name readOnly
     * @function
     * @memberof! ElementVComponent
     * @ojdecorator
     */

    /**
     * Method decorator for ElementVComponent methods that should be exposed on the custom element.
     * Non decorated ElementVComponent methods will not be made available on the custom element.
     * @name method
     * @function
     * @memberof! ElementVComponent
     * @ojdecorator
     */

    /**
     * Property decorator for ElementVComponent properties which are not component properties,
     * but are global properties that the ElementVComponent wishes to get updates for, e.g. tabIndex or aria-label.
     * @name rootProperty
     * @function
     * @memberof! ElementVComponent
     * @ojdecorator
     */

    /**
     * Method decorator for ElementVComponent that binds a specified method to the component instance 'this'
     * and passes provided options to the addEventListener()/removeEventListener() calls, when the method is used as a listener.
     * @param {object=} options The options for this decorator
     * @param {boolean=} options.passive True indicates that the listener will never call preventDefault().
     * @param {boolean=} options.capture True indicates that events of this type will be dispatched to the registered listener
     *                                  before being dispatched to any target beneath it in the DOM tree.
     * @name listener
     * @function
     * @memberof! ElementVComponent
     * @ojdecorator
     */

    /**
     * Property decorator for ElementVComponent event callback properties to indicate they bubble.
     * @param {object=} options The options for this decorator
     * @param {boolean} options.bubbles True if only the component can update the property
     * @name event
     * @function
     * @memberof! ElementVComponent
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
     * @class ElementVComponent
     * @param {Object} props The passed in component properties
     * @ojsignature [{
     *                target: "Type",
     *                value: "abstract class ElementVComponent<P extends object = any, S extends object = any>",
     *                genericParameters: [{"name": "P", "description": "Type of the props object"},
     *                                    {"name": "S", "description": "Type of the state object"}]
     *               },
     *               {target: "Type", value: "Readonly<P>", for: "props"}]
     * @constructor
     * @since 9.0.0
     * @ojtsimport {module: "ojmetadata", type: "AMD", importName:"MetadataTypes"}
     * @classdesc <p>
     * <b>Note: the ElementVComponent API is currently in Experimental status.</b>
     * The APIs discussed in this documentation are subject to change.  More specifically,
     * ElementVComponent authors may be required to make changes to their component implementations
     * when upgrading to future versions of JET.
     * </p>
     * <p>
     * The ElementVComponent base class provides a mechanism for defining JET
     * <a href="CompositeOverview.html">Custom Components</a>.
     * Like the JET <a href="ComponentTypeOverview.html#corecomponents">Core Components</a>
     * and composite components, ElementVComponent-based components
     * are exposed as custom elements. From the application developer’s perspective, these
     * custom elements are (essentially) indistinguishable from JET’s other component types.
     * Where ElementVComponents differ is in the component implementation strategy: ElementVComponents produce
     * content via virtual DOM rendering.
     * </p>
     * <p>
     * To create a new ElementVComponent-based custom component, the component author typically does the following:
     * <ul>
     *   <li>Implements a class that extends ElementVComponent. This class must be authored in TypeScript.</li>
     *   <li>Overrides the <a href="#render">render()</a> method to return a virtual DOM representation
     *       of the component’s content.</li>
     *   <li>Sets the &#64;customElement() decorator with the custom element tag name passed in as a parameter.</li>
     *   <li>Defines the public contract of the custom element.
     *   <ul>
     *     <li><b>Properties: </b>defined as members of the Props class.</li>
     *     <li><b>Methods: </b>defined as methods of the ElementVComponent class and marked for exposure on the custom element using the &#64;method decorator.</li>
     *     <li><b>Events: </b>defined as members of the Props class using the naming convention on[EventName] and having type
     *     <a href="#Action">Action</a> or <a href="#CancelableAction">CancelableAction</a>.</li>
     *     <li><b>Slots: </b>defined as members of the Props class having type <a href="#Slot">Slot</a>.</li>
     *   </ul>
     * </ul>
     * </p>
     * <p>
     * Given the above, JET generates an HTMLElement subclass and registers this as a custom
     * element with the browser. These ElementVComponent-based custom elements can then be used anywhere
     * that other JET components are used, and application developers can leverage typical JET
     * functionality such as data binding, slotting, etc.
     * </p>
     * <p>
     * A minimal ElementVComponent subclass is shown below:
     * </p>
     * <pre class="prettyprint"><code>
     * import { h, ElementVComponent, customElement } from "ojs/ojvcomponent";
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
     * export class SampleEmployee extends ElementVComponent&lt;Props> {
     *
     *   protected render(): ElementVComponent.VNode {
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
     * Every ElementVComponent class must provide an implementation of the <a href="#render">render()</a> method.
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
     * import { h, ElementVComponent, customElement, listener } from "ojs/ojvcomponent";
     *
     * &#64;customElement('oj-sample-component')
     * export class SampleComponent extends ElementVComponent {
     *
     *   &#64;listener({ passive: true })
     *   private _touchStartHandler(event) {
     *     // handler code
     *   }
     *
     *   protected render(): ElementVComponent.VNode {
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
     * or a ElementVComponent instance when using the class syntax after the node has been inserted
     * into the DOM. The ref callback will be called again with null when the node has been
     * unmounted. See the <a href="#lifecycle">lifecycle doc</a> for ref callback
     * ordering in relation to other lifecycle methods.
     * </p>
     * <pre class="prettyprint"><code>
     * import { h, ElementVComponent, customElement } from "ojs/ojvcomponent";
     *
     * &#64;customElement('oj-sample-component')
     * export class SampleComponent extends ElementVComponent {
     *   private _scrollingDiv: HTMLDivElement;
     *
     *   protected render(): ElementVComponent.VNode {
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
     * the ElementVComponent diffing logic will compare the old and new virtual node lists in order,
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
     *   protected render(): ElementVComponent.VNode {
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
     * import { h, ElementVComponent, customElement } from "ojs/ojvcomponent";
     *
     * class Props { &hellip; }
     *
     * type State = {
     *   foo: boolean,
     *   bar: boolean
     * }
     *
     * &#64;customElement('oj-sample-component')
     * export class SampleComponent extends ElementVComponent&lt;Props, State> {
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
     * import { h, ElementVComponent, customElement, dynamicDefault } from "ojs/ojvcomponent";
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
     * export class SampleComponent extends ElementVComponent&lt;Props> {
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
     *   <li><a href="#ElementVComponent">constructor()</a></li>
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
     *   <li>Default slot - exposed through the <code>children</code> member with type <code><a href="#Children">Children</a></code>.</li>
     *   <li>Ordinary slot - exposed through a member with type <code><a href="#Slot">Slot</a></code> whose name corresponds to the slot name.</li>
     *   <li>Template slots - exposed through a member with type <code><a href="#TemplateSlot">TemplateSlot&lt;SlotContextType></a></code> whose name corresponds to the slot name.  <code>SlotContextType</code> represents the data type for this template slot (corresponding to the type of the $current object).</li>
     *   <li>Dynamic slots - any slots that are not explicitly declared as one of the three previous types
     *       will be exposed in a Map of type <code><a href="#DynamicSlots">DynamicSlots</a></code>.
     *       This may be useful in cases where the set of expected slots cannot be statically defined, but is determined
     *       by the component through other means at runtime.  The dynamic slot map can only contain ordinary slots.</li>
     *   <li>Dynamic template slots - similar to <code><a href="#DynamicSlots">DynamicSlots</a></code> except slot content should
     *       only be template nodes which will be exposed in a Map of type <code><a href="#DynamicTemplateSlots">DynamicTemplateSlots</a></code>.
     *       <b>Note that a component may only support one type of dynamic slot. So if a property of type DynamicSlots exists,
     *       there cannot be another property of type DynamicTemplateSlots.</b></li>
     * </ul>
     * Note that in all of the cases above, the component author must declare the corresponding properties in their Props class in order to receive access to slot content.
     * </p>
     * <p>
     * During component rendering, default slot content can simply be inlined as with any other virtual DOM content.  Components can test for the existence of the <code>children</code> property to decide whether to render default content.
     * </p>
     * <pre class="prettyprint"><code>
     * class Props {
     *   children?:  ElementVComponent.Children;
     * }
     *
     * &#64;customElement('oj-sample-component')
     * export class SampleComponent extends ElementVComponent&lt;Props> {
     *
     *   protected render(): ElementVComponent.VNode {
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
     * export class SampleComponent extends ElementVComponent&lt;Props> {
     *
     *   protected render(): ElementVComponent.VNode {
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
     * export class SampleComponent extends ElementVComponent&lt;Props> {
     *
     *   protected render(): ElementVComponent.VNode {
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
     * export class SampleComponent extends ElementVComponent&lt;Props> {
     *
     *   protected render(): ElementVComponent.VNode {
     *     return (
     *       &lt;div style="border-style: solid; width:200px;">
     *         { this.props.cards?.[this.props.currentCard] }
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
     * import { h, ElementVComponent, customElement, listener } from "ojs/ojvcomponent";
     *
     * class Props {&hellip;}
     *
     * &#64;customElement('oj-sample-collection')
     * export class SampleCollection extends ElementVComponent&lt;Props> {
     *   constructor(props: Readonly&lt;Props>) {
     *     super(props);
     *   }
     *
     *   &#64;listener()
     *   private _handleClick(event) { &hellip; }
     *
     *   protected render(): ElementVComponent.VNode {
     *     return (
     *       &lt;div onClick={this._handleClick}/>
     *     );
     *   }
     * }
     * </code></pre>
     */

    // TYPEDEFS

    /**
    * @typedef {Function} ElementVComponent.Action
    * @ojsignature [{target:"Type", value:"<Detail extends object = {}>", for:"genericTypeParameters"},
    *               {target: "Type", value: "(detail?: Detail) => void"}]
    */

    /**
    * @typedef {Function} ElementVComponent.CancelableAction
    * @ojsignature [{target:"Type", value:"<Detail extends object = {}>", for:"genericTypeParameters"},
    *               {target: "Type", value: "(detail?: Detail) => Promise<void>"}]
    */

    /**
    * @typedef {Object} ElementVComponent.DynamicSlots
    * @ojsignature [{target: "Type", value: "Record<string, ElementVComponent.Slot" }]
    */

    /**
    * @typedef {Object} ElementVComponent.DynamicTemplateSlots
    * @ojsignature [{target:"Type", value:"<Data>", for:"genericTypeParameters"},
    *               {target: "Type", value: "Record<string, ElementVComponent.TemplateSlot<Data>" }]
    */

    /**
    * @typedef {Function} ElementVComponent.Slot
    * @ojsignature [{target: "Type", value: "ElementVComponent.VNode | ElementVComponent.VNode[]"}]
    */

    /**
    * @typedef {Function} ElementVComponent.TemplateSlot
    * @ojsignature [{target:"Type", value:"<Data>", for:"genericTypeParameters"},
    *               {target: "Type", value: "(data: Data) => ElementVComponent.Slot"}]
    */

    /**
     * @typedef {Object} ElementVComponent.ElementVComponentClass
     * @ojsignature [{target:"Type", value:"<P>", for:"genericTypeParameters"},
     *               {target: "Type", value: "new (props: P) => ElementVComponent<P, any>"}]
     */

    /**
     * @typedef {Object} ElementVComponent.RenderFunction
     * @ojsignature [{target:"Type", value:"<P>", for:"genericTypeParameters"},
     *               {target: "Type", value: "(props: P, content: ElementVComponent.VNode[]) => ElementVComponent.VNode"}]
     */

    /**
     * @typedef {Object} ElementVComponent.VNodeType
     * @ojsignature [{target:"Type", value:"<P>", for:"genericTypeParameters"},
     *               {target: "Type", value: "string | ElementVComponent.ElementVComponentClass<P> | ElementVComponent.RenderFunction<P>"}]
     */

    // STATIC METHODS

    /**
     * Creates a virtual node for an HTML element of the given type, props, and children.
     * @function h
     * @memberof ElementVComponent
     * @param {any} type An HTML or SVG tag name
     * @param {Object} props The properties to set in the real DOM node
     * @param {...Object} children Optional child DOM
     * @ojsignature [{target:"Type", value:"<P>", for:"genericTypeParameters"},
     *               {target: "Type", value: "ElementVComponent.VNodeType<P>", for: "type"},
     *               {target: "Type", value: "P", for: "props"},
     *               {target: "Type", value: "Array<ElementVComponent.VNode|Node>", for: "children"},
     *               {target: "Type", value: "ElementVComponent.VNode", for: "returns"}]
     * @return {Object}
     * @expose
     * @ignore
     */


    /**
     * Utility to convert a JSX 'class' attribute value to an object for easier component
     * manipulation.
     * <pre class="prettyprint"><code>
     * import { h, ElementVComponent, classPropToObject } from "ojs/ojvcomponent";
     *
     * class Props {
     *   class?: string | object = {};
     * }
     *
     * export class SampleComponent extends ElementVComponent&lt;Props> {
     *   protected render(): ElementVComponent.VNode {
     *     // Make a copy of the readonly return value from classPropToObject and add additional classes
     *     const classObj = Object.assign({}, classPropToObject(this.props.class), { newClass: true }
     *     return (
     *       &lt;div class={ classObj } />
     *     );
     *   }
     * }
     * </code></pre>
     * @function classPropToObject
     * @memberof ElementVComponent
     * @param {string|object|null} classProp An HTML or SVG tag name
     * @ojsignature [{target: "Type", value: "Readonly<object>", for: "returns"}]
     * @return {Object}
     * @ignore
     */


    /**
     * Utility to convert an ElementVComponent's child content into a flattened readonly array of virtual DOM nodes (VNodes).<br/><br/>
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
     * @memberof ElementVComponent
     * @param {?(object|Array<object>)} children Children of an ElementVComponent
     * @ojsignature [{target: "Type", for: "children", value: "ElementVComponent.Children|ElementVComponent.Slot|ElementVComponent.VNode|ElementVComponent.VNode[]|null"},
     *               {target: "Type", for: "returns", value: "Readonly<ElementVComponent.VNode[]>"}
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
     * @memberof ElementVComponent
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
     * @memberof ElementVComponent
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
     * @memberof ElementVComponent
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
     * @memberof ElementVComponent
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
     * @return {ElementVComponent.VNode}
     *
     * @memberof ElementVComponent
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
     * @memberof ElementVComponent
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
     * @memberof ElementVComponent
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
     * @memberof ElementVComponent
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
     * will return either the id set on the ElementVComponent by the parent or a unique string that
     * can be used for a prefix for child elements if one wasn't set by the parent.
     * This method can only be called after the ElementVComponent
     * has been instantiated and will return undefined if called from the constructor.
     * @function uniqueId
     * @return {string}
     *
     * @memberof ElementVComponent
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
     * @memberof ElementVComponent
     * @ojprotected
     * @instance
     * @expose
     */

    class ElementVComponent extends ojvcomponent.VComponent {
    }
    const flattenChildren = ojvcomponent.flattenChildren;

    class VComponentState extends ojcustomelementUtils.ElementState {
        getTemplateEngine() {
            return VComponentState._cachedTemplateEngine;
        }
        getTrackChildrenOption() {
            return this.Element['_vcomp'] ? 'none' : 'immediate';
        }
        GetPreCreatedPromise() {
            const preCreatePromise = super.GetPreCreatedPromise();
            if (!VComponentState._cachedTemplateEngine && this._hasDirectTemplateChildren()) {
                return preCreatePromise.then(() => this._getTemplateEnginePromise());
            }
            return preCreatePromise;
        }
        IsTransferAttribute(attrName) {
            const vcomp = this.Element['_vcomp'];
            const bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this.Element);
            const rootPropsMap = bridge._EXTENSION._ROOT_PROPS_MAP;
            return vcomp && rootPropsMap && !!rootPropsMap[attrName];
        }
        GetDescriptiveTransferAttributeValue(attrName) {
            const bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this.Element);
            const props = bridge._getVComponentProps();
            return props[attrName];
        }
        _getTemplateEnginePromise() {
            return new Promise(function (resolve, reject) { require(['ojs/ojtemplateengine'], function (m) { resolve(_interopNamespace(m)); }, reject) }).then((eng) => {
                VComponentState._cachedTemplateEngine = eng.default;
            });
        }
        _hasDirectTemplateChildren() {
            const childNodeList = this.Element.childNodes;
            for (var i = 0; i < childNodeList.length; i++) {
                const child = childNodeList[i];
                if (child.localName === 'template') {
                    return true;
                }
            }
            return false;
        }
    }

    /**
     * @license
     * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */

    /**
     * @class
     * @ignore
     */
    const VirtualElementBridge = {};
    VirtualElementBridge._DEFAULT_SLOT_PROP = 'children';

    /**
     * Prototype for the JET component definitional bridge instance
     */
    VirtualElementBridge.proto = Object.create(oj.BaseCustomElementBridge.proto);

    oj.CollectionUtils.copyInto(VirtualElementBridge.proto, {
      AddComponentMethods: function (proto) {
        // eslint-disable-next-line no-param-reassign
        proto.setProperty = function (prop, value) {
          var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
          if (!bridge.SaveEarlyPropertySet(this, prop, value)) {
            bridge.SetProperty(this, prop, value, this, true);
          }
        };
        // eslint-disable-next-line no-param-reassign
        proto.getProperty = function (prop) {
          // 'this' is the property object we pass to the definitional element contructor to track internal property changes
          var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
          return bridge.GetProperty(this, prop, this);
        };
      },

      AttributeChangedCallback: function (attr, oldValue, newValue) {
        // Invoke callback on the superclass
        oj.BaseCustomElementBridge.proto.AttributeChangedCallback.call(this, attr, oldValue, newValue);

        // The browser triggers this callback even if old and new values are the same
        // so we should do an equality check ourselves to prevent extra work.
        // This logic below is for handling global attributes which are refelected when
        // set via property setters so we don't need to check the whether any props are flagged as dirty.
        if (oldValue !== newValue) {
          // VComponents need to update _LIVE_CONTROLLED_PROPS even during the patching case
          var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
          // If we haven't already called HandleAttributeChanged in superclass, check to see
          // if we should call it to update _LIVE_CONTROLLED_PROPS for attributes updated during
          // the VComponent render() patching cycle
          if (
            !bridge.ShouldHandleAttributeChanged(this) &&
            oj.BaseCustomElementBridge.proto.ShouldHandleAttributeChanged.call(bridge, this)
          ) {
            var vcomp = this._vcomp;
            if (!vcomp || vcomp.isCustomElementFirst()) {
              bridge.HandleAttributeChanged(this, attr, oldValue, newValue);
            }
          }
        }
      },

      CreateComponent: function (element) {
        // Create the component if this is the first time or if
        // this is a custom element-first component, recreate on
        // reconnect. _vcomp would only be non null for the
        // VComponent-first case.
        let vcomp = element._vcomp;
        if (!vcomp) {
          const elementInfo = this._initSlotMapAndRootProps(element);
          const vprops = this._getVComponentProps();
          const descriptor = ojcustomelementUtils.CustomElementUtils.getElementDescriptor(element.tagName);
          vcomp = new descriptor._CONSTRUCTOR(vprops);

          vcomp._uniqueId = elementInfo.uniqueId;

          // eslint-disable-next-line no-param-reassign
          element._vcomp = vcomp;

          vcomp.setCallbacks(this._getCallbacks(element));
          this._mountCustomElement(element, vcomp, vprops, elementInfo.slotMap);
        }

        // _vcomp may be set by bridge or customElement.ts. For the petit-dom initated case,
        // we let the bridge call mounted after the custom element root is inserted
        // into the DOM
        vcomp.mounted();
      },

      // eslint-disable-next-line no-unused-vars
      DefineMethodCallback: function (proto, method, methodMeta) {
        // eslint-disable-next-line no-param-reassign
        proto[method] = function () {
          // The VComponent is asynchronously instantiated by CreateComponent so we
          // need to check that this has happened before we call any methods defined on it.
          // Custom elements are upgraded synchronously meaning the method will be available
          // on the HTMLElement, but we tell applications to wait on the component busy context
          // before accessing properties and methods due to the asynch CreateComponent call.
          if (!this._vcomp) {
            var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
            bridge.State.throwError('Cannot access methods before element is upgraded.');
          }
          return this._vcomp[method].apply(this._vcomp, arguments);
        };
      },

      DefinePropertyCallback: function (proto, property, propertyMeta) {
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
          this._BRIDGE._updateProperty(this._ELEMENT, property, value, propertyMeta, bOuterSet);
        }

        function innerSet(value) {
          set.bind(this)(value, false);
        }

        // Called on the custom element
        function outerSet(value) {
          // VComponent-first elements should only be updated by its parent during rendering
          // and not through the live DOM updates. We will ignore outer sets
          // for VComponent-first elements to avoid being out of sync with the
          // state the parent believes its child to be in.
          var vcomp = this._vcomp;
          var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
          if (!vcomp || vcomp.isCustomElementFirst()) {
            set.bind(bridge._PROPS_PROXY)(value, true);
          } else if (vcomp && !vcomp.isCustomElementFirst()) {
            bridge.State.throwError('Cannot set properties on a VComponent-first element.');
          }
        }

        function get() {
          // See note in below in outerGet() about accessing properties from the
          // custom element for the VComponent-first case
          var value = this._BRIDGE._PROPS[property];
          // If the attribute has not been set, return the default value
          if (value === undefined) {
            value = this._BRIDGE._getDefaultValue(property, propertyMeta);
            this._BRIDGE._PROPS[property] = value;
          }
          return value;
        }

        function innerGet() {
          return get.bind(this)();
        }

        // Called on the custom element
        function outerGet() {
          var vcomp = this._vcomp;
          // VComponent-first elements should only be updated by its parent during rendering
          // and not through the live DOM updates. We will ignore outer gets
          // for VComponent-first elements, since they are an implementation detail of the parent element
          // and should not be interacted with in the DOM. This case will be treated as an unsupported error case
          // and always return undefined.
          if (vcomp && !vcomp.isCustomElementFirst()) {
            return undefined;
          }
          var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
          return get.bind(bridge._PROPS_PROXY)();
        }

        // Don't add event listener properties for inner props
        if (!propertyMeta._derived) {
          oj.BaseCustomElementBridge.__DefineDynamicObjectProperty(
            proto._propsProto,
            property,
            innerGet,
            innerSet
          );
        }
        oj.BaseCustomElementBridge.__DefineDynamicObjectProperty(proto, property, outerGet, outerSet);
      },

      GetAttributes: function (metadata) {
        var attrs = oj.BaseCustomElementBridge.proto.GetAttributes.call(this, metadata);

        // Components can indicate additional global attributes they want to be notified about
        // via metadata. These attributes can be used by the component to then update the root
        // global attributes.
        var rootPropsMap = metadata.extension && metadata.extension._ROOT_PROPS_MAP;
        if (rootPropsMap) {
          Object.keys(rootPropsMap).forEach(function (prop) {
            attrs.push(ojcustomelementUtils.AttributeUtils.getGlobalAttrForProp(prop));
          });
        }
        return attrs;
      },

      ShouldHandleAttributeChanged: function (element) {
        if (!oj.BaseCustomElementBridge.proto.ShouldHandleAttributeChanged.call(this, element)) {
          return false;
        }

        // We only care about attribute change notifications if we're CustomElement-first,
        // since we need to re-render if the application has modified a controlled root property
        // directly on a custom element.
        //
        // Note that if the vcomp has not yet been created, we allow attribute changed
        // processing to continue, as oj.BaseCustomElementBridge has binding-related work
        // that it may need to perform.
        var vcomp = element._vcomp;
        return !vcomp || (vcomp.isCustomElementFirst() && !vcomp.isPatching());
      },

      HandleAttributeChanged: function (element, attr, oldValue, newValue) {
        var vcomp = element._vcomp;
        var rootPropsMap = this._EXTENSION._ROOT_PROPS_MAP;
        if (vcomp && rootPropsMap) {
          var prop = ojcustomelementUtils.AttributeUtils.getGlobalPropForAttr(attr) || attr;
          if (rootPropsMap[prop] && oldValue !== newValue) {
            // Get the property value if there is one so we pass the correctly typed value
            // to the VComponent unless that value is null in which case we should remove
            // the property from controlled props since this will get merged to the VComponent's
            // this.props and we don't pass values into this.props if undefined.
            if (newValue == null) {
              delete this._LIVE_CONTROLLED_PROPS[prop];
              // Only update the _VCOMP_CONTROLLED_PROPS if the update was not triggered
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
            }

            // Only rerender if we're not updating during a VComponent patching of controlled
            // global properties
            if (!vcomp.isPatching()) {
              this._queueRender(element);
            }
          }
        }
      },

      // eslint-disable-next-line no-unused-vars
      HandleReattached: function (element) {
        this._verifyConnectDisconnect(element, 1);
      },

      // eslint-disable-next-line no-unused-vars
      HandleDetached: function (element) {
        this._verifyConnectDisconnect(element, 0);
      },

      _verifyConnectDisconnect: function (element, state) {
        // Don't handle disconnect/reconnect unless custom element first.
        // PetitDom will handle calling mounted/unmounted for these cases.
        if (!element._vcomp || !element._vcomp.isCustomElementFirst()) {
          return;
        }
        if (this._verifyingState === -1) {
          window.queueMicrotask(
            function () {
              // This checks that we don't call any lifecycle hooks
              // for reparent case where _verifyingState has been
              // updated but the initial state we called
              // this Promise with is different
              if (this._verifyingState === state) {
                if (this._verifyingState === 0) {
                  this._unmountAndReset(element);
                } else {
                  element._vcomp.notifyMounted();
                }
              }
              this._verifyingState = -1;
            }.bind(this)
          );
        }
        this._verifyingState = state;
      },

      InitializeElement: function (element) {
        if (!element._vcomp) {
          if (oj.Components) {
            oj.Components.markPendingSubtreeHidden(element);
          }
          oj.BaseCustomElementBridge.__InitProperties(element, element);
          // After initializing properties from DOM attributes, go through
          // event metadata and writeback properties to add action and
          // writeback callbacks
          const eventsMeta = this.METADATA.events;
          if (eventsMeta) {
            this.InitializeActionCallbacks(element, eventsMeta);
          }
          const writebackProps = this._EXTENSION._WRITEBACK_PROPS;
          if (writebackProps) {
            this.InitializeWritebackCallbacks(writebackProps);
          }
        }
      },

      InitializePrototype: function (proto) {
        // Invoke callback on the superclass
        oj.BaseCustomElementBridge.proto.InitializePrototype.call(this, proto);

        Object.defineProperty(proto, '_propsProto', { value: {} });
      },

      initializeBridge: function (element, descriptor) {
        // Invoke callback on the superclass
        oj.BaseCustomElementBridge.proto.initializeBridge.call(this, element, descriptor);

        // Flag used to detect a verified connected/disconnected state
        // -1 = not verifying
        // 0 = disconnected
        // 1 = connected
        this._verifyingState = -1;

        this._EXTENSION = this.METADATA.extension || {};

        this._CONSTRUCTOR = descriptor._CONSTRUCTOR;

        // For tracking all properties (source of truth for property storage)
        this._PROPS = {};

        // Stores internal property change events that are waiting to be fired.
        this._EVENT_QUEUE = [];

        // Has getters/setters and calls to set properties on this._PROPS
        if (element._propsProto) {
          this._PROPS_PROXY = Object.create(element._propsProto);
          this._PROPS_PROXY._BRIDGE = this;
          this._PROPS_PROXY._ELEMENT = element;
        }

        // We need to maintain two sets of controlled properties in the bridge. One set of controlled properties
        // should always reflect the current state of the DOM even after internal changes that occur during
        // patching and a second version that does not reflect the internal changes that we merge to the props
        // we pass to the VComponent for rendering. This former collection is what petit-dom will use as the
        // 'old' root props for patching. This will allow petit-dom to correctly respond to both application and
        // VComponent updates to controlled properties.
        this._LIVE_CONTROLLED_PROPS = {};
        this._VCOMP_CONTROLLED_PROPS = {};
      },

      InitializeActionCallbacks: function (element, eventsMeta) {
        Object.keys(eventsMeta).forEach((event) => {
          const eventMeta = eventsMeta[event];
          const eventProp = ojcustomelementUtils.AttributeUtils.eventTypeToEventListenerProperty(event);
          this._PROPS[eventProp] = (detailObj) => {
            const detail = Object.assign({}, detailObj);
            // If we're firing a cancelable event, inject an accept function into
            // the event detail so the consumer can asynchronously cancel the event.
            // We only support an asynchronously cancelable event at the moment.
            const cancelable = !!eventMeta.cancelable;
            const acceptPromises = [];
            if (cancelable) {
              detail.accept = (promise) => {
                acceptPromises.push(promise);
              };
            }
            const eventDescriptor = { detail, bubbles: !!eventMeta.bubbles, cancelable };

            const customEvent = new CustomEvent(event, eventDescriptor);
            const eventPromise = this._queueFireEventsTask(customEvent, element);

            if (cancelable) {
              return eventPromise.then(() => {
                return customEvent.defaultPrevented
                  ? Promise.reject()
                  : Promise.all(acceptPromises).then(
                      () => Promise.resolve(),
                      (reason) => Promise.reject(reason)
                    );
              });
            }
            return undefined;
          };
        });
      },

      InitializeWritebackCallbacks: function (writebackProps) {
        writebackProps.forEach((prop) => {
          // e.g. value -> onValueChanged
          const callbackProp = ojcustomelementUtils.AttributeUtils.propertyNameToChangedCallback(prop);
          this._PROPS[callbackProp] = (value) => {
            // The inner set will trigger a call to _updateProperty
            // to mutate the property and queue the property changed event
            this._PROPS_PROXY[prop] = value;
          };
        });
      },

      HandlePropertyChanged: function (element, property, value, previousValue, isOuter, subprop) {
        // Override of oj.BaseCustomElementBridge so we can fire events asynchronously
        this._queuePropertyChangedEvent(element, property, value, previousValue, isOuter, subprop);
      },

      ValidateAndSetProperty: function (propNameFun, componentProps, property, value, element) {
        var _value = this.ValidatePropertySet(element, property, value);
        VirtualElementBridge.__SetProperty(propNameFun, componentProps, property, _value);
      },

      _mountCustomElement: function (element, vcomp, vprops, slotMap) {
        // Cache the slot content because custom elements don't support reslotting
        // if _content already exists, this is a reconnect case
        if (!this._content) {
          this._content = VirtualElementBridge._processSlotContent(element, slotMap);
        }
        // Make a copy of the controlled props so we get a snapshot before mounting.
        // We want to avoid the case where a VComponent updates the custom element
        // controlled properties during mount and the controlled props are updated
        // before a queued render is called.
        var controlledPropsCopy = Object.assign({}, this._LIVE_CONTROLLED_PROPS);
        // mountContent appends child nodes to element
        vcomp.mountContent(vprops, this._content, element, controlledPropsCopy);
      },

      /**
       * All property mutations are done synchronously for both internal and external sets,
       * with property changed events firing asynchronously.
       * @param {HTMLElement} element The custom element to process a property change for
       * @param {Object} propertyUpdate An object containing isOuter, name, value, meta keys
       * @private
       */
      _updateProperty: function (element, property, value, meta, isOuter) {
        // Synchronously mutate the property value and add the property
        // changed event to the event queue
        // Properties can be set before the component is created. These early
        // sets are actually saved until after component creation and played back.
        if (!this.SaveEarlyPropertySet(element, property, value)) {
          var previousValue = this._PROPS[property];
          if (!oj.BaseCustomElementBridge.__CompareOptionValues(property, meta, value, previousValue)) {
            // Skip validation for inner sets so we don't throw an error when updating readOnly
            // writeable properties
            let validatedValue = value;
            if (isOuter) {
              validatedValue = this.ValidatePropertySet(element, property, value);
            }
            // Instead of updating undefined in our property bag, delete the key
            // so later when we copy props for vcomponent rendering, we can use
            // Object.assign without overriding default values when the value is undefined
            if (validatedValue === undefined) {
              delete this._PROPS[property];
            } else {
              this._PROPS[property] = validatedValue;
            }
            this.State.dirtyProps.add(property);

            // Queue a property change event to fire
            this._queuePropertyChangedEvent(
              element,
              property,
              validatedValue,
              previousValue,
              isOuter,
              null
            );

            // This will get called before connected callback so short circuit render for that case
            // Trigger a re-render unless the updated property is a read-only writeback property update
            if (element._vcomp && !meta.readOnly) {
              this._queueRender(element);
            }
          }
        }
      },

      _queuePropertyChangedEvent: function (element, property, value, previousValue, isOuter, subprop) {
        // Only queue a property changed event before the component is instantiated for
        // inner property sets, e.g. read-only writeback properties
        if (!this._SKIP_PROP_CHANGE_EVENT && (!isOuter || this.State.isComplete)) {
          const updatedFrom = isOuter ? 'external' : 'internal';
          const customEvent = this._getPropertyChangedEvent(
            property,
            value,
            previousValue,
            updatedFrom,
            subprop
          );
          this._queueFireEventsTask(customEvent, element);
        }
      },

      /**
       * Queues events to be fired asynchronously
       * @param {CustomEvent} customEvent The event to queue
       * @param {HTMLElement} element The custom element to fire a [property]Changed event for
       * @return void
       * @private
       */
      _queueFireEventsTask: function (customEvent, element) {
        this._EVENT_QUEUE.push(customEvent);

        if (!this._eventsQueued) {
          const busyContext = Context.getContext(element).getBusyContext();
          const busyCallback = busyContext.addBusyState({
            description: ojcustomelementUtils.CustomElementUtils.getElementInfo(element) + ' event queued.'
          });
          this._eventsQueued = new Promise((resolve) => {
            window.queueMicrotask(
              function () {
                var queuedEvent = this._EVENT_QUEUE.shift();
                try {
                  while (queuedEvent) {
                    element.dispatchEvent(queuedEvent);
                    queuedEvent = this._EVENT_QUEUE.shift();
                  }
                } catch (error) {
                  throw error;
                } finally {
                  resolve();
                  busyCallback();
                  this._eventsQueued = null;
                }
              }.bind(this)
            );
          });
        }

        return this._eventsQueued;
      },

      _getPropertyChangedEvent: function (property, value, previousValue, updatedFrom, subprop) {
        // There are cases where a subproperty set can trigger a top level property set
        // if the top level property was not instantiated to an empty object. We don't want
        // to fire two events for that case. The oj.BaseCustomElementBridge has logic to fire
        // the subproperty change event there.
        var detail = {};
        if (subprop) {
          detail.subproperty = subprop;
        }
        detail.value = value;
        detail.previousValue = previousValue;
        detail.updatedFrom = updatedFrom;

        // The bridge sets the ready to fire flag after the component has been instantiated.
        // We shouldn't fire property changed events before then unless the update comes from internally
        // for cases like readOnly property updates.
        return new CustomEvent(property + 'Changed', { detail: detail });
      },

      /**
       * Registers an asynchronous component render as a result of a state or property update.
       * @param {HTMLElement} element The custom element to queue a render for
       * @return void
       * @private
       */
      _queueRender: function (element) {
        element._vcomp.queueRender(element, 'propsUpdate');
      },

      /**
       * We need to make a copy of the properties any time we hand off props to the vcomp,
       * as we mutate our own copy and vcomp should not be exposed to these changes
       * (until we hand off a new copy). We will also augment the props we pass to the vcomp
       * with any controlled properties and slots the component has registered.
       * @private
       */
      _getVComponentProps: function () {
        const staticDefaults = ojdefaultsutils.DefaultsUtils.getStaticDefaults(this._CONSTRUCTOR, this.METADATA, true);
        let propsCopy = Object.create(staticDefaults);

        // Copy the current root props into this.props so component can initialize property dependent state
        Object.assign(propsCopy, this._PROPS, this._VCOMP_CONTROLLED_PROPS);

        // We need to remove readOnly properties so they're not available to VComponents in this.props
        const readOnlyProps = this._EXTENSION._READ_ONLY_PROPS;
        if (readOnlyProps) {
          readOnlyProps.forEach((prop) => delete propsCopy[prop]);
        }
        return propsCopy;
      },

      /**
       * Returns an object containing override callbacks for VComponent functionality so that we can
       * cause different behavior for the custom element-first case.
       *
       * @private
       */
      _getCallbacks: function (element) {
        return {
          getPropsForRender: () => {
            return this._getVComponentProps();
          },
          patch: (props) => {
            // The errors thrown by the VComponent logic after a busy state
            // is registered in the queueRender() method will be caught by queueRender()
            // try-catch block. The caller will resolve the busy state for that case.
            var controlledPropsCopy = Object.assign({}, this._LIVE_CONTROLLED_PROPS);
            element._vcomp.patchContent(props, controlledPropsCopy, this._content);

            // Store unslotted nodes
            VirtualElementBridge._storeUnslottedNodes(element, this._slotVNodes);
          },
          convertChildrenToSlotProps: (children) => {
            // Only process children after initial render for the custom element first case
            if (!this._slotProps) {
              // Save the slot nodes so we can store unslotted nodes after render
              this._slotVNodes = children;

              // Generate the map of slot property names to vnode arrays
              var slotMap = _generateSlotMap(children, this.METADATA, this._EXTENSION);

              // Convert to map of slot property names as the right types
              // 1) VNode[] for default children property
              // 2) () => VNode[] for named non template slots
              // 3) (context) => VNode[] for template slots
              this._slotProps = _generateSlotPropsMap(
                element,
                slotMap,
                this.METADATA.slots,
                this._EXTENSION._DYNAMIC_SLOT
              );
            }
            return this._slotProps;
          }
        };
      },

      /**
       * Initializes controlled roop props based on the controlled properties specified in the metadata
       * and the attributes of the specified element
       * @param {HTMLElement} element
       * @private
       */
      _initializeControlledProps: function (element) {
        var rootPropsMap = this._EXTENSION._ROOT_PROPS_MAP;
        if (rootPropsMap) {
          var liveRootProps = this._LIVE_CONTROLLED_PROPS;
          var vcompRootProps = this._VCOMP_CONTROLLED_PROPS;
          Object.keys(rootPropsMap).forEach(function (prop) {
            var attr = ojcustomelementUtils.AttributeUtils.getGlobalAttrForProp(prop);
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

      _getDefaultValue: function (property) {
        // A read only copy of the default value
        return ojdefaultsutils.DefaultsUtils.getFrozenDefault(property, this._CONSTRUCTOR, this.METADATA);
      },

      _unmountAndReset: function (element) {
        // We want to unmount custom element-first cases
        // so that we recreate the component on reconnect,
        // but keep around the bridge so we have all the
        // property values. Only state would be lost on reconnect.
        element._vcomp.notifyUnmounted();

        // When we unmount, we will reset certain flags
        // so we can recreate from scratch the next time
        // we reconnected to the DOM
        this._bCreateCalled = false;

        // Store slot content so we're ready to redistribute on connect
        VirtualElementBridge._storeAllSlotContent(element, this._slotVNodes);

        // Null out the vcomp instance
        // eslint-disable-next-line no-param-reassign
        element._vcomp = null;
      },

      _initSlotMapAndRootProps: function (element) {
        // Return an object containing the slotMap and uniqueId for an element
        if (!this._slotMap) {
          if (oj.Components) {
            oj.Components.unmarkPendingSubtreeHidden(element);
          }
          // Cache a uniqueID on the vcomponent instance
          this._uniqueId = ojcustomelementUtils.ElementUtils.getUniqueId(element.id);

          this._slotMap = ojcustomelementUtils.CustomElementUtils.getSlotMap(element);

          // Initialize controlled root properties now that we know bindings have resolved and
          // data bound global attributes should be resolved.
          this._initializeControlledProps(element);

          // Define the _vcomp property on the element to be set by the CreateComponent call
          Object.defineProperty(element, '_vcomp', { writable: true, value: null, enumerable: false });
        }
        return {
          slotMap: this._slotMap,
          uniqueId: this._uniqueId
        };
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

      const registration = {
        descriptor, bridgeProto: VirtualElementBridge.proto, stateClass: VComponentState
      };
      if (ojcustomelementUtils.CustomElementUtils.registerElement(tagName, registration)) {
        customElements.define(tagName, VirtualElementBridge.proto.getClass(descriptor));
      }
    };

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
          element._nodeStorage = document.createElement('div');
          // eslint-disable-next-line no-param-reassign
          element._nodeStorage.style.display = 'none';
          element.appendChild(element._nodeStorage);
        }
        // Array of virtual nodes we will pass to the VComponent mountContent method
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
      var branchedProps;
      // Set subproperty, initializing parent objects along the way unless the top level
      // property is not defined since setting it to an empty object will trigger a property changed
      // event. Instead, branch and set at the end. We only have listeners on top level properties
      // so setting a subproperty will not trigger a property changed event along the way.
      var topProp = propNameFun(propPath[0]);
      if (propPath.length > 1 && !componentProps[topProp]) {
        branchedProps = {};
        propsObj = branchedProps;
      }

      // Walk to the correct location
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
      }

      // Update the original component properties if we branched
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
          var node = vnode._node;
          // Check to see if the node has been disconnected in the last rerender
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
     * Given a custom element and its slotMap, store all slot nodes.
     * Called when the custom element is unmounted.
     * @param {Element} element The custom element
     * @param {Array} slotVNodes The current array of slot vnodes for the element
     * @return {void}
     * @private
     */
    VirtualElementBridge._storeAllSlotContent = function (element, slotVNodes) {
      if (slotVNodes && element._nodeStorage) {
        slotVNodes.forEach(function (vnode) {
          var node = vnode._node;
          // Check to see if the node has been disconnected in the last rerender
          // and move to the storage node and notify that node that it's been hidden.
          // Petit-dom handles calling subtreeShown when appending children into DOM.
          element._nodeStorage.appendChild(node);
          if (oj.Components) {
            oj.Components.subtreeHidden(node);
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
     *                       See CustomElementUtils.getSlotAssignment() for slot name details.
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
          return { _node: node, _isWrapped: true };
        case Node.TEXT_NODE:
          return { _text: node.nodeValue, _node: node, _isWrapped: true };
        case Node.ELEMENT_NODE:
          var content = [];
          // Wrap child nodes for petit-dom patching.
          // There is no reslotting, but the component may slot
          // a different child node on subsequent renders (e.g. oj-switcher tab switching)
          // so we need to ensure the vnode is as 'real' as possible to ensure the DOM
          // will be updated correctly during patching.
          node.childNodes.forEach(function (childNode) {
            // These are just child nodes of the slotted parent node so we don't need to pass
            // a slot for the child
            var wrappedChild = _wrapNode(childNode);
            // Skip non text/element nodes like comment nodes
            if (wrappedChild) {
              content.push(wrappedChild);
            }
          });
          var vnode = {
            type: node.tagName.toLowerCase(),
            props: node,
            content: content,
            _node: node,
            _isWrapped: true
          };
          // IE does not have slot property support so the slot attribute will not
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
      // dynamicSlot is an object of form { prop: [propName], isTemplate: [1 for true and 0 for false]}
      const dynamicSlot = ext._DYNAMIC_SLOT;
      // TODO do we throw an error or log a warning if we encounter a slot item
      // that should go into a dynamic prop but there's no dynamic prop, basically
      // mean the slot content was marked in correctly?
      const dynamicSlotProp = dynamicSlot ? dynamicSlot.prop : null;
      const slotMap = {};

      children.forEach(function (vnode) {
        // Text nodes and comment nodes don't have a vnode.props
        // field and always map to the default slot. Note that normally
        // comment nodes aren't slottable, but we need them for the template case.
        var slot = vnode.props ? vnode.props.slot : '';
        // If slot name is defined check to see if it exists in the metadata as a named slot. If it doesn't
        // then it may be a dynamic slot so stash it as under the slot property for dynamic slots.
        let slotProp = VirtualElementBridge._DEFAULT_SLOT_PROP;
        if (slot) {
          // Don't do slots[slot] check bc the value is 0 | 1 indicating whether
          // something is a template slot
          slotProp = slot in slots ? slot : dynamicSlotProp;
        }

        if (slotProp === dynamicSlotProp) {
          // Stop processing if node doesn't match any named slots and component
          // does not define a dynamic slot.
          if (!dynamicSlotProp) {
            return;
          }
          // Dynamic slots
          if (!slotMap[slotProp]) {
            slotMap[slotProp] = { [slot]: [] };
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
     * @param {Object} slots A map of slot to objects where a template slot
     *                    will have a 'data' property in its object and a normal
     *                    slot will not.
     * @param {Object?} dynamicSlot A map of the form
     *                            { prop: [dynamic prop name],
     *                              isTemplate: [1 for true, 0 for false]}
     * @return {object}
     * @private
     */
    function _generateSlotPropsMap(element, slotMap, slots, dynamicSlot) {
      var propsMap = {};
      Object.keys(slotMap).forEach((slot) => {
        var slotContent = slotMap[slot];
        // The template slot case only supports render functions
        if (slot === VirtualElementBridge._DEFAULT_SLOT_PROP) {
          propsMap[slot] = slotContent;
        } else if (Array.isArray(slotContent)) {
          propsMap[slot] = slots[slot].data ? getSlotRenderer(element, slotContent) : slotContent;
        } else {
          // Dynamic slot case
          if (!propsMap[slot]) {
            propsMap[slot] = {};
          }
          Object.keys(slotContent).forEach((dynSlot) => {
            propsMap[slot][dynSlot] =
              dynamicSlot && dynamicSlot.isTemplate
                ? getSlotRenderer(element, slotContent[dynSlot])
                : slotContent[dynSlot];
          });
        }
      });
      return propsMap;
    }

    /**
     * Helper to return either the vnodes for an ordinary slot or
     * a slot render function if the vnode DOM element is a template node.
     * @param {Element} element The custom element
     * @param {object} vnodes The vnode array to return/process for the slot
     * @return {object}
     * @private
     */
    function getSlotRenderer(element, vnodes) {
      const domNode = _unwrapNode(vnodes[0]);
      if (domNode.nodeName !== 'TEMPLATE') {
        throw new Error(
          `Template node expected for template slot, but found ${domNode.nodeName} instead.`
        );
      }
      return function (context) {
        const bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(element);
        const cachedTemplateEngine = bridge.State.getTemplateEngine();
        // Execute the template engine and wrap the resulting DOM nodes
        if (!cachedTemplateEngine) {
          throw new Error('Unexpected call to render a template slot');
        }
        const domNodes = cachedTemplateEngine.execute(element, domNode, context);
        return domNodes.map((node) => {
          const vnode = _wrapNode(node);
          // Pass a reference to the template engine's clean method so
          // petit-dom can call it before removing any template nodes from the DOM
          vnode._clean = cachedTemplateEngine.clean.bind(null, node);
          return vnode;
        });
      };
    }

    function customElement(tagName) {
        return function (constructor) {
            const componentRender = constructor.prototype.render;
            constructor.prototype.render = function () {
                let vnode = componentRender.call(this);
                if (vnode.type !== tagName) {
                    vnode = ojvdom.h(tagName, null, vnode);
                }
                _verifyProps(vnode.props, constructor['metadata']);
                return vnode;
            };
            constructor.prototype.mount = function (props, content, uncontrolledRootProps) {
                this._vnode = this._renderForMount(props, content);
                const mountNode = (this._ref = ojvdom.mountCustomElement(this._vnode, uncontrolledRootProps));
                Object.defineProperty(mountNode, '_vcomp', {
                    value: this,
                    enumerable: false,
                    writable: true
                });
                return mountNode;
            };
            constructor.prototype.patch = function (props, content, uncontrolledRootProps, oldUncontrolledRootProps) {
                const oldProps = this.props;
                const oldState = this.state;
                const oldVnode = this._vnode;
                this._vnode = this._renderForPatch(props, content);
                this._vnode['_node'] = this._ref;
                this._patching = true;
                try {
                    ojvdom.patchCustomElement(this._vnode, oldVnode, uncontrolledRootProps, oldUncontrolledRootProps);
                }
                finally {
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
                    ojvdom.mountCustomElementContent(this._vnode, controlledRootProps);
                }
                finally {
                    this._patching = false;
                }
            };
            constructor.prototype.patchContent = function (props, controlledRootProps, content) {
                const oldProps = this.props;
                const oldState = this.state;
                const oldVnode = this._vnode;
                this._vnode = this._renderForPatch(props, content);
                this._vnode['_node'] = this._ref;
                this._patching = true;
                try {
                    ojvdom.patchCustomElementContent(this._vnode, oldVnode, controlledRootProps);
                }
                finally {
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
            constructor.prototype.notifyUnmounted = function () {
                this._cancelQueuedRender();
                ojvdom.removeChildren(this._ref, this._vnode.content);
                if (this.isCustomElementFirst()) {
                    ojvdom.removeListeners(this._ref, this._vnode.props);
                }
                this.unmounted();
                ojvdom.patchRef(this._vnode.ref, null);
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
                return (allowedProps[prop] ||
                    verifiedRootPropMap[prop] ||
                    ojcustomelementUtils.AttributeUtils.isEventListenerProperty(prop));
            }
            function _verifyProps(props, metadata) {
                for (var prop in props) {
                    if (!_isValidRootProp(prop, metadata)) {
                        throw new Error('Component can only render controlled global properties or DOM event listeners on the root custom element. ' +
                            prop +
                            ' will not be rendered.');
                    }
                }
            }
            VirtualElementBridge.register(tagName, constructor);
        };
    }

    function method() {
        return function (target, propertyKey, descriptor) { };
    }
    function rootProperty() {
        return (target, propertyKey) => { };
    }
    function readOnly(target, propertyKey) { }
    function event({ bubbles: boolean } = { bubbles: false }) {
        return (target, propertyKey) => { };
    }

    Object.defineProperty(exports, 'classPropToObject', {
        enumerable: true,
        get: function () {
            return ojvcomponent.classPropToObject;
        }
    });
    Object.defineProperty(exports, 'dynamicDefault', {
        enumerable: true,
        get: function () {
            return ojvcomponent.dynamicDefault;
        }
    });
    Object.defineProperty(exports, 'h', {
        enumerable: true,
        get: function () {
            return ojvcomponent.h;
        }
    });
    Object.defineProperty(exports, 'listener', {
        enumerable: true,
        get: function () {
            return ojvcomponent.listener;
        }
    });
    exports.ElementVComponent = ElementVComponent;
    exports.customElement = customElement;
    exports.event = event;
    exports.flattenChildren = flattenChildren;
    exports.method = method;
    exports.readOnly = readOnly;
    exports.rootProperty = rootProperty;

    Object.defineProperty(exports, '__esModule', { value: true });

});
