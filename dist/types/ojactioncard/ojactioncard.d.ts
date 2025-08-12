/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Action, Bubbles, ExtendGlobalProps, ObservedGlobalProps } from 'ojs/ojvcomponent';
import { Component, ComponentChildren } from 'preact';
type Props = ObservedGlobalProps<'tabIndex' | 'role'> & {
    /**
     * @description
     * <p>The <code class="prettyprint">Default</code> slot is the actions's body. It should not be explicitly named.</p>
     * @example <caption>Displays the content in the central area of the action</caption>
     * &lt;oj-action-card>
     *    Default Card
     * &lt;/oj-action-card>
     * @ojmetadata description "The default slot is the content of the card. The oj-action-card element accepts plain text or DOM nodes as children for the default slot."
     * @ojmetadata displayName "default"
     * @ojmetadata help "#Default"
     */
    children?: ComponentChildren;
    /**
     * @description
     * <p>Triggered when an action card is clicked. This will be triggered by keyboard events as well as mouse/touch events.</p>
     *
     * <p>When double-clicking or multi-clicking (as determined by the browser), only the first click will trigger the ojAction event.</p>
     *
     * <p>To ensure keyboard accessibility, the only correct, supported way to react to the click of a card is to listen
     * for this event. Click listeners should not be used.</p>
     * @since 9.1.0
     * @ojmetadata description "Triggered when the card is clicked, tapped, or upon keyboard ENTER"
     * @ojmetadata help "#event:ojAction"
     */
    onOjAction?: Action<ActionDetail> & Bubbles;
};
type State = {
    active?: boolean;
    focus?: boolean;
};
type ActionDetail = {
    /**
     * @ignore
     */
    originalEvent: Event;
};
/**
 * @classdesc
 * <h3 id="ActionCardOverview-section">
 *   JET Action
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#CardOverview-section"></a>
 * </h3>
 * <p>Description: Themeable, WAI-ARIA-compliant element that represents a card.</p>
 * <p>A JET Action Card provides a styled rectangular area with hover/focus/active state rendering,
 * along with an ojAction event.  It is used to enclosed a layout card component or
 * or generic html.
 *
 * The action card is intended for consumption by waterfall containers.
 *
 *
 * <pre class="prettyprint">
 * <code>
 *&lt;oj-action-card on-oj-action="[[actionHandler]]">
 *   Sample Text
 * &lt;/oj-action-card>
 *
 *</code></pre>
 *
 * <p> As oj-action-card does not style the enclosed content, the
 * application is responsible for ensuring that text colors used will satisfy the 3.1 contrast ratio between
 * background color and text to comply with accessibility requirements.</p>
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Action Card</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Invoke the card's action.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Action Card</td>
 *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
 *       <td>Invoke the card's action</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>For accessibility, a JET Action Card that doesn't have any text in its default slot (making it an icon-only button) should include an aria-label attribute
 * that indicate its purpose.</p>
 * <p>A clarification in accessibility rules states that any element with role=button should not have interactive elements inside:</p>
 *  <pre><code>https://www.w3.org/TR/html-aria/#allowed-descendants-of-aria-roles</code></pre>
 *
 *
 *
 *  <h3 id="migration-section">
 * Migration
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
 * </h3>
 *  To migrate from oj-action-card to oj-c-action-card, you need to revise the import statement.
 *  <h5>Background Color</h5>
 *  CSS background-color is not yet supported in oj-c-action-card.
 *
 *
 *
 * @ojmetadata description "An Action Card is an actionable container rendering related information"
 * @ojmetadata displayName "Action Card"
 * @ojmetadata main "ojs/ojactioncard"
 * @ojmetadata extension {
 *   "oracle": {
 *     "icon": "oj-ux-ico-object-card",
 *     "uxSpecs": ["card"]
 *   },
 *   "vbdt": {
 *     "module": "ojs/ojactioncard",
 *     "defaultColumns": "1",
 *     "minColumns": "1"
 *   }
 * }
 *
 *
 * @ojmetadata styleVariableSet {"name": "ojactioncard-css-set1", "displayName": "Action Card CSS",
 *                                "description": "CSS variable that specify action card hover scale",
 *                                "styleVariables": [
 *                                  {
 *                                    "name": "oj-action-card-scale-hover",
 *                                    "description": "Action card hover scale",
 *                                    "help": "#ojactioncard-css-set1"
 *                                  }
 *                                ]
 *                              }
 * @ojmetadata help "%JET_API_DOC_URL%oj.ojActionCard.html"
 * @ojmetadata since "9.1.0"
 */
/**
 * This export corresponds to the ActionCard Preact component. For the oj-action-card custom element, import ActionCardElement instead.
 */
export declare class ActionCard extends Component<ExtendGlobalProps<Props>, State> {
    private readonly _rootRef;
    constructor(props: Readonly<Props>);
    render(props: ExtendGlobalProps<Props>, state: Readonly<State>): import("preact").JSX.Element;
    componentDidMount(): void;
    /**
     * Search originating event node for dataTag, if not parent, and ancestors for tag, up until this node.
     * @memberof oj.ojActionCard
     * @param {event} event the originating event node for dataTag, if not parent, and ancestors for tag, up until this node.
     * @private
     */
    private _isFromActiveSource;
    private _handleOjAction;
    private readonly _handleStart;
    private readonly _handleUpEnd;
    private readonly _handleClick;
    private readonly _handleTouchcancel;
    private readonly _handleMove;
    private readonly _handleKeydown;
    private readonly _handleKeyup;
    /**
     * focusin event listener
     */
    private readonly _handleFocusin;
    /**
     * focusout event listener
     */
    private readonly _handleFocusout;
}
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-action-card custom element. For the ActionCard Preact component, import ActionCard instead.
 */
export interface ActionCardElement extends JetElement<ActionCardElementSettableProperties>, ActionCardElementSettableProperties {
    addEventListener<T extends keyof ActionCardElementEventMap>(type: T, listener: (this: HTMLElement, ev: ActionCardElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ActionCardElementSettableProperties>(property: T): ActionCardElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ActionCardElementSettableProperties>(property: T, value: ActionCardElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ActionCardElementSettableProperties>): void;
    setProperties(properties: ActionCardElementSettablePropertiesLenient): void;
}
export namespace ActionCardElement {
    interface ojAction extends CustomEvent<ActionDetail & {}> {
    }
}
export interface ActionCardElementEventMap extends HTMLElementEventMap {
    'ojAction': ActionCardElement.ojAction;
}
export interface ActionCardElementSettableProperties extends JetSettableProperties {
}
export interface ActionCardElementSettablePropertiesLenient extends Partial<ActionCardElementSettableProperties> {
    [key: string]: any;
}
export interface ActionCardIntrinsicProps extends Partial<Readonly<ActionCardElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    /**
     * <p>Triggered when an action card is clicked. This will be triggered by keyboard events as well as mouse/touch events.</p>
     *
     * <p>When double-clicking or multi-clicking (as determined by the browser), only the first click will trigger the ojAction event.</p>
     *
     * <p>To ensure keyboard accessibility, the only correct, supported way to react to the click of a card is to listen
     * for this event. Click listeners should not be used.</p>
     */
    onojAction?: (value: ActionCardElementEventMap['ojAction']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-action-card': ActionCardIntrinsicProps;
        }
    }
}
