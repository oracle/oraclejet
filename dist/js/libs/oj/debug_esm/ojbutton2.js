/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsx, jsxs } from 'preact/jsx-runtime';
import { recentTouchEnd, makeFocusable, getNoJQFocusHandlers } from 'ojs/ojdomutils';
import { startDetectContextMenuGesture, stopDetectContextMenuGesture } from 'ojs/ojgestureutils';
import { getUniqueId, Root, customElement } from 'ojs/ojvcomponent';
import { Component, createRef } from 'preact';
import { VMenu } from 'ojs/ojvmenu';
import 'ojs/ojvcomponent-binding';
import { getCachedCSSVarValues } from 'ojs/ojthemeutils';

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Button2_1;
function getChromingDefault() {
    return getCachedCSSVarValues(['--oj-private-button-global-chroming-default'])[0];
}
/**
 * @ojmetadata description "Buttons direct users to initiate or take actions and work with a single tap, click, or keystroke."
 * @ojmetadata displayName "Button"
 * @ojmetadata main "ojs/ojbutton"
 * @ojmetadata extension {
 *   "vbdt": {
 *     "module": "ojs/ojbutton",
 *     "styleClasses": [
 *       {
 *         "styleGroup": [
 *           "oj-button-sm",
 *           "oj-button-lg",
 *           "oj-button-xl"
 *         ],
 *         "description": "Makes the button small, large, or extra large."
 *       },
 *       {
 *         "styleGroup": [
 *           "oj-button-confirm"
 *         ],
 *         "description": "Identifies an action to confirm. Designed for use with a push button."
 *       },
 *       {
 *         "styleGroup": [
 *           "oj-button-primary"
 *         ],
 *         "description": "Draws attention to the button, often identifying the primary action in a set of buttons. Designed for use with a push button. " +
 *                        "In some themes, this class does nothing."
 *       },
 *       {
 *         "styleGroup": [
 *           "oj-button-full-width"
 *         ],
 *         "description": "Apply 100% full-width to the button."
 *       },
 *       {
 *         "styleGroup": [
 *           "oj-focus-highlight"
 *         ],
 *         "description": "Allows per-instance control of the focus highlight policy (not typically required). See the Help documentation for more information."
 *       }
 *     ],
 *     "defaultColumns": "2",
 *     "minColumns": "1"
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-button",
 *     "uxSpecs": [
 *       "button"
 *     ]
 *   }
 * }
 * @ojmetadata help "https://docs.oracle.com/en/middleware/developer-tools/jet/19/reference-api/oj.ojButton.html"
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "label",
 *       "display",
 *       "chroming",
 *       "disabled"
 *     ]
 *   }
 * ]
 * @ojmetadata since "0.6.0"
 *
 * @ojmetadata status [
 *   {
 *     "type": "maintenance",
 *     "since": "15.0.0",
 *     "value": ["oj-c-button"]
 *   }
 * ]
 * @ojmetadata requirements [
 *    {
 *      type: "anyOf",
 *      label: "accessibility",
 *      properties: ["label", "aria-label", "aria-labelledby", "aria-describedby"],
 *      slots: [""]
 *    }
 * ]
 * @ojmetadata styleClasses [
 *   {
 *     "name": "button-size",
 *     "kind": "set",
 *     "displayName": "Button Size",
 *     "description": "Makes the button small, large, or extra large.",
 *     "help": "#button-size",
 *     "styleRelation": "exclusive",
 *     "styleItems": [
 *       {
 *         "name": "oj-button-sm",
 *         "kind": "class",
 *         "displayName": "Small",
 *         "description": "Makes the button small."
 *       },
 *       {
 *         "name": "oj-button-lg",
 *         "kind": "class",
 *         "displayName": "Large",
 *         "description": "Makes the button large."
 *       },
 *       {
 *         "name": "oj-button-xl",
 *         "kind": "class",
 *         "displayName": "X-Large",
 *         "description": "Makes the button extra large.",
 *         "status": [
 *           {
 *             "type": "deprecated",
 *             "since": "9.0.0",
 *             "description": "This class will be removed in the future."
 *           }
 *         ]
 *       }
 *     ]
 *   },
 *   {
 *     "name": "oj-button-confirm",
 *     "kind": "class",
 *     "displayName": "Confirm",
 *     "description": "Identifies an action to confirm. Designed for use with a push button.",
 *     "status": [
 *       {
 *         "type": "deprecated",
 *         "since": "9.0.0",
 *         "description": "This class will be removed in the future."
 *       }
 *     ],
 *     "help": "#oj-button-confirm"
 *   },
 *   {
 *     "name": "oj-button-primary",
 *     "kind": "class",
 *     "displayName": "Primary",
 *     "description": "Draws attention to the button, often identifying the primary action in a set of buttons." +
 *                    "Designed for use with a push button. In some themes, this class does nothing.",
 *     "status": [
 *       {
 *         "type": "deprecated",
 *         "since": "8.0.0",
 *         "description": "This class will be removed in the future. Please use 'callToAction' chroming instead."
 *       }
 *     ],
 *     "help": "#oj-button-primary"
 *   },
 *   {
 *     "name": "oj-button-full-width",
 *     "kind": "class",
 *     "displayName": "Full Width",
 *     "description": "Apply 100% full-width to the button.",
 *     "help": "#oj-button-full-width"
 *   },
 *   {
 *     "name": "oj-focus-highlight",
 *     "kind": "class",
 *     "displayName": "Focus Styling",
 *     "description": "Allows per-instance control of the focus highlight policy (not typically required). See the Help documentation for more information.",
 *     "help": "#oj-focus-highlight"
 *   }
 * ]
 */
let Button2 = Button2_1 = class Button2 extends Component {
    constructor(props) {
        super(props);
        this._rootRef = createRef();
        /**
         * contextmenu gesture handler
         */
        this._handleContextMenuGesture = (event, eventType) => {
            const contextMenuEvent = {
                event: event,
                eventType: eventType
            };
            event.preventDefault(); // don't show native context menu
            this.setState({ contextMenuTriggerEvent: contextMenuEvent });
        };
        /**
         * touchstart event listener
         */
        this._handleTouchstart = (event) => {
            this.setState({ active: true });
        };
        /**
         * touchend event listener
         */
        this._handleTouchend = (event) => {
            this.setState({ active: false });
        };
        /**
         * focus in event listener
         */
        this._handleFocusIn = (event) => {
            if (event.target === event.currentTarget) {
                this._handleFocus(event);
            }
            this.setState({ focus: true });
            if (this._rootRef.current) {
                this.focusInHandler(this._rootRef.current);
            }
        };
        /**
         * focus out event listener
         */
        this._handleFocusOut = (event) => {
            if (event.target === event.currentTarget) {
                this._handleBlur(event);
            }
            this.setState({ focus: false });
            if (this._rootRef.current) {
                this.focusOutHandler(this._rootRef.current);
            }
        };
        /**
         * mouseenter event listener
         */
        this._handleMouseenter = (event) => {
            // On touch device, a tap (touchstart and touchend) can create synthetic mouseenter event
            // if the button is not already the activeElement.
            // do this for real mouse enters, but not 300ms after a tap
            if (!recentTouchEnd()) {
                // If the user mousedown on another button, keep the mouse button down and
                // mouseenter this button, we don't want to add the active state to this button.
                // We add the active state only if this button is the one the user mousedown on.
                if (this === Button2_1._lastActive) {
                    this.setState({ active: true });
                }
                this.setState({ hover: true });
            }
        };
        /**
         * mouseleave event listener
         */
        this._handleMouseleave = (event) => {
            this.setState({ hover: false, active: false });
        };
        /**
         * mousedown event listener
         */
        this._handleMousedown = (event) => {
            // don't show active/pressed-down state unless left mouse button, since only that button will click the button after mouseup
            // do this for real mousedowns, but not 300ms after a tap
            if (event.which === 1 && !recentTouchEnd()) {
                this.setState({ active: true });
                Button2_1._lastActive = this;
                const docMouseupListener = () => {
                    Button2_1._lastActive = null;
                    document.removeEventListener('mouseup', docMouseupListener, true);
                };
                // Use capture listener so that we don't have to worry about someone calling stopPropagation on the mouseup event
                document.addEventListener('mouseup', docMouseupListener, true);
            }
        };
        /**
         * mouseup event listener
         */
        this._handleMouseup = (event) => {
            this.setState({ active: false });
        };
        /**
         * click event listener
         */
        this._handleClick = (event) => {
            // We only fire ojAction event once on multi-click, in which case event.detail will be 1 on the first click.
            // event.detail will be 0 if the keyboard is used to activate the button.
            if (event.detail <= 1) {
                this.props.onOjAction?.({ originalEvent: event });
            }
        };
        /**
         * keydown event listener
         */
        this._handleKeydown = (event) => {
            if (event.keyCode === 32 || event.keyCode === 13) {
                this.setState({ active: true });
            }
        };
        /**
         * keyup event listener
         */
        this._handleKeyup = (event) => {
            this.setState({ active: false });
        };
        /**
         * focus event listener
         */
        this._handleFocus = (event) => {
            this._rootRef?.current?.dispatchEvent(new FocusEvent('focus', { relatedTarget: event.relatedTarget }));
        };
        /**
         * blur event listener
         */
        this._handleBlur = (event) => {
            // Update active state here in case the button element loses focus between keydown and keyup, it would be left in an "active" state
            this.setState({ active: false });
            this._rootRef?.current.dispatchEvent(new FocusEvent('blur', { relatedTarget: event.relatedTarget }));
        };
        /**
         * context menu close call back
         */
        this._onCloseCallback = (event) => {
            if (this.state.contextMenuTriggerEvent) {
                this.setState({ contextMenuTriggerEvent: null });
            }
        };
        this.state = {};
        this.uniquePrefix = props.id ? props.id + getUniqueId() : getUniqueId();
    }
    render(props, state) {
        const defaultSlot = props.children;
        let startIconContent = this._processIcon(props.startIcon, 'oj-button-icon oj-start');
        let endIconContent = this._processIcon(props.endIcon, 'oj-button-icon oj-end');
        let ariaLabel = props['aria-label'];
        let ariaLabelledBy = props['aria-labelledby'];
        let ariaDescribedBy = props['aria-describedby'];
        const hasDefaultAriaAttribute = ariaLabel || ariaLabelledBy;
        let defaultContent = null;
        let clickHandler = null;
        let ariaLabelledById = null;
        let title = props.title;
        const buttonLabel = props.label || defaultSlot;
        if (buttonLabel) {
            title = this.state.derivedTitle || title || props.label;
            if (props.display === 'icons' && (startIconContent || endIconContent)) {
                // For icon-only buttons
                if (props.label) {
                    if (!hasDefaultAriaAttribute) {
                        // If there is a label property, put an aria-label directly on the <button>
                        ariaLabel = props.label;
                    }
                    defaultContent = (jsx("span", { ref: (elem) => (this._defaultSlotRef = elem), children: defaultContent }));
                }
                else {
                    if (!hasDefaultAriaAttribute) {
                        // If there is no label property, wrap the Default slot in a hidden span and use aria-labelledby
                        ariaLabelledById = this.uniquePrefix + '|text';
                        ariaLabelledBy = ariaLabelledById;
                    }
                    defaultContent = (jsx("span", { ref: (elem) => (this._defaultSlotRef = elem), class: "oj-button-text oj-helper-hidden-accessible", id: ariaLabelledById, children: buttonLabel }));
                }
            }
            else if (props.display === 'label') {
                if (props.startIcon) {
                    startIconContent = this._processIcon(props.startIcon, 'oj-button-icon oj-helper-hidden oj-start');
                }
                if (props.endIcon) {
                    endIconContent = this._processIcon(props.endIcon, 'oj-button-icon oj-helper-hidden oj-end');
                }
                if (!hasDefaultAriaAttribute) {
                    ariaLabelledById = this.uniquePrefix + '|text';
                    ariaLabelledBy = ariaLabelledById;
                }
                defaultContent = (jsx("span", { ref: (elem) => (this._defaultSlotRef = elem), class: "oj-button-text", id: ariaLabelledById, children: buttonLabel }));
            }
            else {
                if (!hasDefaultAriaAttribute) {
                    ariaLabelledById = this.uniquePrefix + '|text';
                    ariaLabelledBy = ariaLabelledById;
                }
                defaultContent = (jsx("span", { ref: (elem) => (this._defaultSlotRef = elem), class: "oj-button-text", id: ariaLabelledById, children: buttonLabel }));
            }
        }
        else {
            defaultContent = (jsx("span", { ref: (elem) => (this._defaultSlotRef = elem), children: defaultContent }));
        }
        const labelContent = (jsxs("div", { class: "oj-button-label", children: [startIconContent, defaultContent, endIconContent] }));
        let buttonContent;
        // We won't need any of the event listeners on disabled button
        if (props.disabled) {
            buttonContent = (jsx("button", { class: "oj-button-button", "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-label": ariaLabel, disabled: true, children: labelContent }));
        }
        else {
            clickHandler = this._handleClick;
            buttonContent = (jsx("button", { class: "oj-button-button", ref: (elem) => (this._buttonRef = elem), "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-label": ariaLabel, onTouchStart: this._handleTouchstart, onTouchEnd: this._handleTouchend, onTouchCancel: this._handleTouchend, onMouseEnter: this._handleMouseenter, onMouseLeave: this._handleMouseleave, onMouseDown: this._handleMousedown, onMouseUp: this._handleMouseup, onfocusin: this._handleFocusIn, onfocusout: this._handleFocusOut, onKeyDown: this._handleKeydown, onKeyUp: this._handleKeyup, children: labelContent }));
        }
        const rootClasses = this._getRootClasses(startIconContent, endIconContent);
        return (jsxs(Root, { class: rootClasses, id: props.id, title: title, onClick: clickHandler, "aria-describedby": ariaDescribedBy, ref: this._rootRef, children: [buttonContent, this._renderContextMenu()] }));
    }
    _renderContextMenu() {
        if (!this.state.contextMenuTriggerEvent || !this.props.contextMenu) {
            return null;
        }
        return (jsx(VMenu, { eventObj: this.state.contextMenuTriggerEvent, launcherElement: this._buttonRef, onCloseCallback: this._onCloseCallback, children: [this.props.contextMenu] }));
    }
    _processIcon(icon, slotClass) {
        let iconContent;
        if (Array.isArray(icon)) {
            iconContent = icon.map((elem) => {
                return this._processIcon(elem, slotClass);
            });
        }
        else if (icon) {
            iconContent = jsx("span", { class: slotClass, children: icon });
        }
        return iconContent;
    }
    /**
     * Get all the classes to put on the root element
     */
    _getRootClasses(startIconContent, endIconContent) {
        let defaultState = true;
        // Set the className property
        let classList = 'oj-button ' + Button2_1._chromingMap[this.props.chroming];
        classList += ' ' + this._getDisplayOptionClass(startIconContent, endIconContent);
        if (this.props.disabled) {
            defaultState = false;
            classList += ' oj-disabled';
        }
        else {
            classList += ' oj-enabled';
            // Check hover, active, and focus state only if the button is enabled.
            // Disabled button cannot have hover, active, and focus state.
            if (this.state.hover) {
                defaultState = false;
                classList += ' oj-hover';
            }
            if (this.state.active) {
                defaultState = false;
                classList += ' oj-active';
            }
        }
        if (defaultState) {
            classList += ' oj-default';
        }
        return classList;
    }
    /**
     * Get the class related to the display type of the button (icon-only, text-only, etc.)
     */
    _getDisplayOptionClass(startIconContent, endIconContent) {
        const multipleIcons = startIconContent && endIconContent;
        const atLeastOneIcon = startIconContent || endIconContent;
        const displayIsIcons = this.props.display === 'icons';
        const displayIsLabel = this.props.display === 'label';
        let buttonClass;
        //if display value is label and it contain some label,
        if (displayIsLabel) {
            buttonClass = 'oj-button-text-only';
        }
        else if (atLeastOneIcon) {
            if (displayIsIcons) {
                if (multipleIcons) {
                    buttonClass = 'oj-button-icons-only';
                }
                else {
                    buttonClass = 'oj-button-icon-only';
                }
            }
            else if (multipleIcons) {
                buttonClass = 'oj-button-text-icons';
            }
            else if (startIconContent) {
                buttonClass = 'oj-button-text-icon-start';
            }
            else {
                buttonClass = 'oj-button-text-icon-end';
            }
        }
        else {
            buttonClass = 'oj-button-text-only';
        }
        return buttonClass;
    }
    _addMutationObserver() {
        // No need to create the observer again if we already have one
        if (this._mutationObserver) {
            return;
        }
        const config = {
            subtree: true,
            characterData: true
        };
        /**
         * mutation listener
         */
        const callback = () => {
            const title = this._getTextContent();
            if (title != this.state.derivedTitle) {
                // We only set this to trigger re-render
                this.setState({ derivedTitle: title });
            }
        };
        this._mutationObserver = new MutationObserver(callback);
        this._mutationObserver.observe(this._defaultSlotRef, config);
    }
    _needsContextMenuDetection(props) {
        return props.contextMenu && !props.disabled;
    }
    /**
     * Setup resources when the virtual component is mounted
     */
    componentDidMount() {
        this._updateDerivedTitle();
        if (this._needsContextMenuDetection(this.props)) {
            startDetectContextMenuGesture(this._rootRef.current, this._handleContextMenuGesture);
        }
        this._rootRef.current.addEventListener('touchstart', this._handleTouchstart, { passive: true });
        this._rootRef.current.addEventListener('touchend', this._handleTouchend, { passive: false });
        this._rootRef.current.addEventListener('touchcancel', this._handleTouchend, {
            passive: true
        });
        makeFocusable({
            applyHighlight: true,
            setupHandlers: (focusInHandler, focusOutHandler) => {
                let noJQHandlers = getNoJQFocusHandlers(focusInHandler, focusOutHandler);
                this.focusInHandler = noJQHandlers.focusIn;
                this.focusOutHandler = noJQHandlers.focusOut;
            }
        });
    }
    componentDidUpdate(oldProps) {
        if (oldProps.display != this.props.display) {
            this._updateDerivedTitle();
        }
        this._updateContextMenuDetection(oldProps);
        if (this.props.disabled && oldProps.disabled != this.props.disabled) {
            this.setState({ hover: false });
        }
    }
    _updateDerivedTitle() {
        const props = this.props;
        let title;
        if (props.display === 'icons' &&
            (props.startIcon || props.endIcon) &&
            !props.label &&
            !props.title) {
            title = this._getTextContent();
            // Add a mutation observer if we are using the slot content as title, so that we can update the title if the content changes
            this._addMutationObserver();
        }
        // title is undefined if the button is displaying text, there is a label, or there is a title on the oj-button
        // we still need to call setState if it's different from the current derivedTitle
        if (title != this.state.derivedTitle) {
            this.setState({ derivedTitle: title });
        }
    }
    /**
     * Update context menu detection
     */
    _updateContextMenuDetection(oldProps) {
        const oldNeedsDetect = this._needsContextMenuDetection(oldProps);
        const newNeedsDetect = this._needsContextMenuDetection(this.props);
        if (oldNeedsDetect != newNeedsDetect) {
            if (newNeedsDetect) {
                startDetectContextMenuGesture(this._rootRef.current, this._handleContextMenuGesture);
            }
            else {
                stopDetectContextMenuGesture(this._rootRef.current);
            }
        }
    }
    static getDerivedStateFromProps(props) {
        if (props.disabled) {
            return { contextMenuTriggerEvent: null };
        }
        return null;
    }
    /**
     * Get nullable text content from a slot or slot array as a concatenated string
     */
    _getTextContent() {
        let content = this._defaultSlotRef.textContent;
        content = content.trim();
        if (content !== '') {
            return content;
        }
        return null;
    }
    /**
     * Release resources when the virtual component is unmounted
     */
    componentWillUnmount() {
        if (this._mutationObserver) {
            this._mutationObserver.disconnect();
            this._mutationObserver = null;
        }
        stopDetectContextMenuGesture(this._rootRef.current);
    }
    refresh() {
        this.setState({ active: false });
    }
    focus() {
        this._buttonRef?.focus();
    }
    blur() {
        this._buttonRef?.blur();
    }
};
Button2._chromingMap = {
    solid: 'oj-button-full-chrome',
    outlined: 'oj-button-outlined-chrome',
    borderless: 'oj-button-half-chrome',
    full: 'oj-button-full-chrome',
    half: 'oj-button-half-chrome',
    callToAction: 'oj-button-cta-chrome',
    danger: 'oj-button-danger-chrome oj-button-full-chrome'
};
// Assume that css loaded here
Button2.defaultProps = {
    disabled: false,
    display: 'all',
    chroming: getChromingDefault()
};
Button2._metadata = { "slots": { "": {}, "startIcon": {}, "endIcon": {}, "contextMenu": {} }, "properties": { "disabled": { "type": "boolean" }, "display": { "type": "string", "enumValues": ["all", "label", "icons"] }, "label": { "type": "string" }, "translations": { "type": "object" }, "chroming": { "type": "string", "enumValues": ["full", "solid", "borderless", "callToAction", "danger", "half", "outlined"], "binding": { "consume": { "name": "containerChroming" } } } }, "events": { "ojAction": { "bubbles": true } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["id", "title", "aria-label", "aria-labelledby", "aria-describedby"] }, "methods": { "refresh": {}, "focus": {}, "blur": {} } };
Button2 = Button2_1 = __decorate([
    customElement('oj-button')
], Button2);

export { Button2 };
