/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsx } from 'preact/jsx-runtime';
import { Root, customElement } from 'ojs/ojvcomponent';
import { Component, createRef } from 'preact';
import { recentPointer } from 'ojs/ojdomutils';
import { isEventClickthroughDisabled } from 'ojs/ojdatacollection-common';

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
 * @ojmetadata help "https://docs.oracle.com/en/middleware/developer-tools/jet/19/reference-api/oj.ojActionCard.html"
 * @ojmetadata since "9.1.0"
 */
let ActionCard = class ActionCard extends Component {
    constructor(props) {
        super(props);
        this._rootRef = createRef();
        // Stop ojAction propagation when the user is requesting it by adding the attribute to disable clickthrough.
        // This permit users the ability to tune nested components like buttons inside cards.
        this._handleOjAction = (event) => {
            if (this._isFromActiveSource(event)) {
                event.stopPropagation();
            }
        };
        this._handleStart = (event) => {
            if (!this._isFromActiveSource(event)) {
                this.setState({ active: true });
            }
        };
        this._handleUpEnd = (event) => {
            if (!this._isFromActiveSource(event) && this.state.active) {
                this.setState({ active: false });
            }
        };
        this._handleClick = (event) => {
            if (!this._isFromActiveSource(event)) {
                this.props.onOjAction?.({ originalEvent: event });
            }
        };
        this._handleTouchcancel = (event) => {
            if (!this._isFromActiveSource(event)) {
                this.setState({ active: false });
            }
        };
        this._handleMove = (event) => {
            if (this.state.active && !this._isFromActiveSource(event)) {
                this.setState({ active: false });
            }
        };
        this._handleKeydown = (event) => {
            if (!this._isFromActiveSource(event) &&
                !event.repeat &&
                (event.key === 'Enter' || event.key === ' ')) {
                this.setState({ active: true });
            }
        };
        this._handleKeyup = (event) => {
            if (!this._isFromActiveSource(event) && (event.key === 'Enter' || event.key === ' ')) {
                this.setState({ active: false });
                this.props.onOjAction?.({ originalEvent: event });
            }
        };
        /**
         * focusin event listener
         */
        this._handleFocusin = (event) => {
            this.setState({ focus: true });
        };
        /**
         * focusout event listener
         */
        this._handleFocusout = (event) => {
            this.setState({ focus: false });
        };
        this.state = {
            active: false,
            focus: false
        };
    }
    render(props, state) {
        /* we would prefer to use the :active pseudo class here, however this does not work as expected on
         * Safari and Mac/IOS Firefox, so we are stuck managing the active state manually. */
        let classString = 'oj-actioncard';
        if (state.active) {
            classString += ' oj-active';
        }
        if (state.focus && !recentPointer()) {
            classString += ' oj-focus-highlight';
        }
        // Default for card to be a tabstop, unless otherwise specified.
        const tabIndex = props.tabIndex ?? 0;
        return (jsx(Root, { tabIndex: tabIndex, class: classString, role: "button", onKeyUp: this._handleKeyup, onMouseUp: this._handleUpEnd, onKeyDown: this._handleKeydown, onMouseDown: this._handleStart, onTouchStart: this._handleStart, onTouchEnd: this._handleUpEnd, onTouchCancel: this._handleTouchcancel, onTouchMove: this._handleMove, onfocusin: this._handleFocusin, onfocusout: this._handleFocusout, onClick: this._handleClick, onojAction: this._handleOjAction, ref: this._rootRef, children: this.props.children }));
    }
    componentDidMount() {
        this._rootRef.current.addEventListener('touchstart', this._handleStart, { passive: true });
        this._rootRef.current.addEventListener('touchend', this._handleUpEnd, { passive: false });
        this._rootRef.current.addEventListener('touchcancel', this._handleTouchcancel, {
            passive: true
        });
        this._rootRef.current.addEventListener('touchmove', this._handleMove, { passive: true });
    }
    /**
     * Search originating event node for dataTag, if not parent, and ancestors for tag, up until this node.
     * @memberof oj.ojActionCard
     * @param {event} event the originating event node for dataTag, if not parent, and ancestors for tag, up until this node.
     * @private
     */
    _isFromActiveSource(event) {
        return isEventClickthroughDisabled(event, this._rootRef.current);
    }
};
ActionCard._metadata = { "slots": { "": {} }, "events": { "ojAction": { "bubbles": true } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["tabIndex", "role"] } };
ActionCard = __decorate([
    customElement('oj-action-card')
], ActionCard);

/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

export { ActionCard };
