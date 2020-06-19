define(['exports', 'ojs/ojdomutils', 'ojs/ojvcomponent', 'ojs/ojthemeutils'], function (exports, DomUtils, ojvcomponent, ThemeUtils) { 'use strict';

    /**
     * @license
     * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */

    /**
     * @ignore
     * @ojcomponent oj.ojButton2
     * @ojtsvcomponent
     * @ojsignature {target: "Type", value: "class ojButton2 extends JetElement<ojButton2SettableProperties>"}
     * @since 8.0.0
     * @ojshortdesc Buttons direct users to initiate or take actions and work with a single tap, click, or keystroke.
     *
     * @ojrole button
     *
     * @ojpropertylayout {propertyGroup: "common", items: ["chroming", "disabled"]}
     * @ojvbdefaultcolumns 2
     * @ojvbmincolumns 1
     *
     * @ojuxspecs ['button']
     *
     * @classdesc
     * <h3 id="buttonOverview-section">
     *   JET Button2
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonOverview-section"></a>
     * </h3>
     *
     * <p>Description: Themeable, WAI-ARIA-compliant push buttons, with appropriate styles for hover, active, checked, and disabled.
     *
     * <p>To create toggle buttons, see the [JET Buttonset]{@link oj.ojButtonset}.
     *
     * <pre class="prettyprint"><code>&lt;oj-button2 id="myButton">
     *     &lt;span>My Button&lt;/span>
     * &lt;/oj-button2>
     * </code></pre>
     *
     * <h3 id="pushButtons-section">
     *   Push Buttons
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pushButtons-section"></a>
     * </h3>
     *
     * <p>Push buttons are ordinary buttons that do not stay pressed in when clicked.
     * Push buttons are created from <code class="prettyprint">oj-button2</code> elements.
     *
     *
     * <h3 id="touch-section">
     *   Touch End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
     * </h3>
     *
     * {@ojinclude "name":"touchDoc"}
     *
     *
     * <h3 id="keyboard-section">
     *   Keyboard End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
     * </h3>
     *
     * {@ojinclude "name":"keyboardDoc"}
     *
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>For accessibility, a JET Button2 that doesn't have any text in its default slot (making it an icon-only button) should include an aria-label attribute
     * that indicate its purpose.
     *
     * {@ojinclude "name":"accessibilityCommon"}
     *
     *
     * <h3 id="styling-section">
     *   Styling
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
     * </h3>
     *
     * {@ojinclude "name":"stylingDoc"}
     *
     *
     * <h3 id="perf-section">
     *   Performance
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
     * </h3>
     *
     * <p>In lieu of stamping a button in a table, dataGrid, or other container, consider placing a single Button outside the
     * container that acts on the currently selected row or cell.
     *
     * <h3 id="state-section">
     *   Setting Component State
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#state-section"></a>
     * </h3>
     *
     * {@ojinclude "name":"stateCommon"}
     */


    // SLOTS

    /**
     * <p>The default slot is the button's text label. The <code class="prettyprint">&lt;oj-button2></code> element accepts plain text or DOM nodes as children for the default slot.
     * Either the <code class="prettyprint">label</code> attribute or a default slot label is required for all buttons for accessibility purposes.</p>
     *
     * <p>If <code class="prettyprint">&lt;oj-bind-text></code> is used to provide the label, it must be wrapped in a <code class="prettyprint">&lt;span></code>.</p>
     *
     * <p>The <code class="prettyprint">label</code> attribute is recommended, as it provides additional functionality for icon-only buttons.
     * The Default slot is ignored when the <code class="prettyprint">label</code> attribute is specified.</p>
     *
     * @ojchild Default
     * @memberof oj.ojButton2
     * @ojshortdesc The default slot is the button's text label. The oj-button2 element accepts plain text or DOM nodes as children for the default slot.
     *
     * @example <caption>Initialize the Button with child content specified:</caption>
     * &lt;oj-button2>
     *   &lt;span>myValue&lt;/span>
     * &lt;/oj-button2>
     *
     * @example <caption>Initialize the Button with data-bound child content specified in a span:</caption>
     * &lt;oj-button2>
     *   &lt;span data-bind='text: myText'>&lt;/span>
     * &lt;/oj-button2>
     *
     * @example <caption>Initialize the Button with data-bound child content specified without a container element:</caption>
     * &lt;oj-button2>
     *   &lt;!-- ko text: myText -->&lt;!--/ko-->
     * &lt;/oj-button2>
     */

    /**
     * <p>The <code class="prettyprint">endIcon</code> slot is the button's end icon. The  <code class="prettyprint">&lt;oj-button2></code> element accepts DOM nodes as children with the endIcon slot.</p>
     *
     * @ojslot endIcon
     * @memberof oj.ojButton2
     * @ojshortdesc The endIcon slot is the button's end icon. The oj-button2 element accepts DOM nodes as children with the endIcon slot.
     *
     * @example <caption>Initialize the Button with child content specified for the endIcon:</caption>
     * &lt;oj-button2>
     *   &lt;span>myValue&lt;/span>
     *   &lt;span slot='endIcon' class='myIconClass'>&lt;/span>
     * &lt;/oj-button2>
     */

    /**
     * <p>The <code class="prettyprint">startIcon</code> slot is the button's start icon. The  <code class="prettyprint">&lt;oj-button2></code> element accepts DOM nodes as children with the startIcon slot.</p>
     *
     * @ojslot startIcon
     * @memberof oj.ojButton2
     * @ojshortdesc The startIcon slot is the button's start icon. The oj-button2 element accepts DOM nodes as children with the startIcon slot.
     *
     * @example <caption>Initialize the Button with child content specified for the startIcon:</caption>
     * &lt;oj-button2>
     *   &lt;span slot='startIcon' class='myIconClass'>&lt;/span>
     *   &lt;span>myValue&lt;/span>
     * &lt;/oj-button2>
     */


    // ATTRIBUTES

    /**
     * {@ojinclude "name":"buttonCommonChroming"}
     *
     * @name chroming
     * @instance
     * @memberof oj.ojButton2
     * @type {string}
     * @ojvalue {string} "solid" Solid buttons stand out, and direct the user's attention to the most important actions in the UI.
     * @ojvalue {string} "outlined" Outlined buttons are salient, but lighter weight than solid buttons. Outlined buttons are useful for secondary actions.
     * @ojvalue {string} "borderless" Borderless buttons are the least prominent variation. Borderless buttons are useful for supplemental actions that require minimal emphasis.
     * @ojvalue {string} "callToAction" A Call To Action (CTA) button guides the user to take or complete the action that is the main goal of the page or page section. There should only be one CTA button on a page at any given time.
     * @ojshortdesc Indicates in what states the button has chrome (background and border).
     *
     * @example <caption>Initialize the Button with the <code class="prettyprint">chroming</code> attribute specified:</caption>
     * &lt;oj-button2 chroming='borderless'>&lt;/oj-button2>
     *
     * @example <caption>Get or set the <code class="prettyprint">chroming</code> property after initialization:</caption>
     * // getter
     * var chromingValue = myButton.chroming;
     *
     * // setter
     * myButton.chroming = 'borderless';
     *
     * @example <caption>Set the default in the theme (SCSS) :</caption>
     * $buttonChromingOptionDefault: borderless !default;
     */

    /**
     * {@ojinclude "name":"buttonCommonDisabled"}
     *
     * @name disabled
     * @memberof oj.ojButton2
     * @instance
     * @type {boolean}
     * @default false
     * @ojshortdesc Specifies that the button element should be disabled.
     *
     * @example <caption>Initialize the Button with the <code class="prettyprint">disabled</code> attribute specified:</caption>
     * &lt;oj-button2 disabled='true'>&lt;/oj-button2>
     *
     * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
     * // getter
     * var disabledValue = myButton.disabled;
     *
     * // setter
     * myButton.disabled = true;
     */

    /**
     * {@ojinclude "name":"buttonCommonDisplay"}
     *
     * <p>For accessibility, a JET Button must always have a label set via the default slot, even if it is icon-only.
     *
     * @name display
     * @memberof oj.ojButton2
     * @instance
     * @type {string}
     * @ojvalue {string} "all" Display both the label and icons.
     * @ojvalue {string} "icons" Display only the icons.
     * @default "all"
     * @ojshortdesc Specifies whether the button displays label and icons, or just icons.
     *
     * @example <caption>Initialize the Button with the <code class="prettyprint">display</code> attribute specified:</caption>
     * &lt;oj-button2 display='icons'>&lt;/oj-button2>
     *
     * @example <caption>Get or set the <code class="prettyprint">display</code> property after initialization:</caption>
     * // getter
     * var displayValue = myButton.display;
     *
     * // setter
     * myButton.display = 'icons';
     */

    /**
     * <p>Specifies the text label for the button.</p>
     * <p>If the <code class="prettyprint">display</code> attribute is set to "icons", this attribute also provides the following:
     * <ol>
     *   <li>If the custom element doesn't have an aria-label or aria-labelledby attribute specified, this will be used as the aria-label.</li>
     *   <li>If the custom element doesn't have a tooltip specified, this will be used as the tooltip.</li>
     * </ol>
     * </p>
     * <p>When this attribute has a value, the Default slot will be ignored.</p>
     *
     * @name label
     * @instance
     * @memberof oj.ojButton2
     * @type {string}
     * @ojshortdesc Specifies the text label for the button.
     *
     * @example <caption>Initialize the Button with the <code class="prettyprint">label</code> attribute specified:</caption>
     * &lt;oj-button2 label='Button 1'>&lt;/oj-button2>
     *
     * @example <caption>Get or set the <code class="prettyprint">label</code> property after initialization:</caption>
     * // getter
     * var labelValue = myButton.label;
     *
     * // setter
     * myButton.label = 'Button 1';
     */


    // EVENTS

    /**
     * <p>Triggered when a button is clicked. This will be triggered by keyboard events as well as mouse/touch events.</p>
     *
     * <p>When double-clicking or multi-clicking (as determined by the browser), only the first click will trigger the ojAction event.</p>
     *
     * <p>To ensure keyboard accessibility, the only correct, supported way to react to the click of a button is to listen
     * for this event. Click listeners should not be used.</p>
     *
     * @expose
     * @event
     * @name action
     * @memberof oj.ojButton2
     * @ojshortdesc Triggered when a button is clicked, whether by keyboard, mouse, or touch events.  To meet accessibility requirements, the only supported way to react to the click of a button is to listen for this event.
     * @instance
     * @ojcancelable
     * @ojbubbles
     * @ojeventgroup common
     * @since 5.0.0
     */


    // METHODS

    /**
     * Retrieves a value for a property or a single subproperty for complex properties.
     * @function getProperty
     * @param {string} property - The property name to get. Supports dot notation for subproperty access.
     * @return {any}
     *
     * @expose
     * @memberof oj.ojButton2
     * @instance
     *
     * @example <caption>Get a single subproperty of a complex property:</caption>
     * var subpropValue = myComponent.getProperty('complexProperty.subProperty1.subProperty2');
     */

    /**
     * Performs a batch set of properties.
     * @function setProperties
     * @param {Object} properties - An object containing the property and value pairs to set.
     * @return {void}
     *
     * @expose
     * @memberof oj.ojButton2
     * @instance
     *
     * @example <caption>Set a batch of properties:</caption>
     * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
     */

    /**
     * Sets a property or a single subproperty for complex properties and notifies the component
     * of the change, triggering a [property]Changed event.
     *
     * @function setProperty
     * @param {string} property - The property name to set. Supports dot notation for subproperty access.
     * @param {any} value - The new value to set the property to.
     *
     * @expose
     * @memberof oj.ojButton2
     * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
     * @instance
     * @return {void}
     *
     * @example <caption>Set a single subproperty of a complex property:</caption>
     * myComponent.setProperty('complexProperty.subProperty1.subProperty2', "someValue");
     */


    // Fragments:

    /**
     * <p>Disabled content: JET supports an accessible luminosity contrast ratio,
     * as specified in <a href="http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">WCAG 2.0 - Section 1.4.3 "Contrast"</a>,
     * in the themes that are accessible.  (See the "Theming" chapter of the JET Developer Guide for more information on which
     * themes are accessible.)  Note that Section 1.4.3 says that text or images of text that are part of an inactive user
     * interface component have no contrast requirement.  Because disabled content may not meet the minimum contrast ratio
     * required of enabled content, it cannot be used to convey meaningful information.<p>
     *
     * @ojfragment accessibilityCommon
     * @memberof oj.ojButton2
     * @instance
     */

    /**
     * <p>Built-in KO bindings, like KO's <code class="prettyprint">disable</code> binding, should not be used for state with a JS API, since that is tantamount to
     * updating the DOM directly.  The component attribute should be bound instead.
     *
     * @ojfragment stateCommon
     * @memberof oj.ojButton2
     * @instance
     */

    /**
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
     *       <td>Push Button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Push the button.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <p>See also the [Menu]{@link oj.ojMenu} touch gesture doc.
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojButton2
     * @instance
     */

    /**
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
     *       <td>Push Button</td>
     *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
     *       <td>Push the button.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojButton2
     * @instance
     */

    /**
     * <p>The following CSS classes can be applied by the page author as needed.
     *
     * <table class="generic-table styling-table">
     *   <thead>
     *     <tr>
     *       <th>Class</th>
     *       <th>Description</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td>oj-button-sm<br>
     *           oj-button-lg<br>
     *           oj-button-xl</td>
     *       <td>Makes the button small, large, or extra large. Is applied to the Button's root element.</td>
     *     </tr>
     *     <tr>
     *       <td>oj-button-confirm</td>
     *       <td>Identifies an action to confirm. Designed for use with a push button. Is applied to the Button's root element.</td>
     *       </td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
     * @memberof oj.ojButton2
     * @instance
     */

    /**
     * <p>Indicates in what states the button has chrome (background and border).
     *
     * <p>The default chroming varies by theme and containership as follows:
     * <ul>
     *   <li>If <code class="prettyprint">$buttonChromingOptionDefault</code> is set in the current theme, then that value is the chroming default.</li>
     *   <li>Else, the default chroming is <code class="prettyprint">"solid"</code>.</li>
     * </ul>
     *
     * <p>Once a value has been set on this button attribute, that value applies regardless of theme and containership.
     *
     * @expose
     * @memberof oj.ojButton2
     * @instance
     * @since 1.2.0
     * @ojfragment buttonCommonChroming
     */

    /**
     * <p>Disables the button if set to <code class="prettyprint">true</code>.
     *
     * <p>After create time, the <code class="prettyprint">disabled</code> state should be set via this API, not by setting the underlying DOM attribute.
     *
     * @expose
     * @memberof oj.ojButton2
     * @instance
     * @ojfragment buttonCommonDisabled
     */

    /**
     * <p>Whether to display both the label and icons (<code class="prettyprint">"all"</code>)
     * or just the icons (<code class="prettyprint">"icons"</code>).  In the latter case, the label is displayed in a tooltip instead, unless a
     * tooltip was already supplied at create time.
     *
     * @expose
     * @memberof oj.ojButton2
     * @instance
     * @ojfragment buttonCommonDisplay
     */

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var Button2_1;
    class Props {
        constructor() {
            this.disabled = false;
            this.display = 'all';
            this.translations = {};
        }
    }
    __decorate([
        ojvcomponent.dynamicDefault(getChromingDefault)
    ], Props.prototype, "chroming", void 0);
    function getChromingDefault() {
        return ((ThemeUtils.parseJSONFromFontFamily('oj-button-option-defaults') || {}).chroming || 'solid');
    }
    exports.Button2 = Button2_1 = class Button2 extends ojvcomponent.VComponent {
        constructor(props) {
            super(props);
            this._setDefaultSlotRef = (element) => {
                this._defaultSlotRef = element;
            };
            this.state = {};
        }
        render() {
            var _a, _b;
            const props = this.props;
            const defaultSlot = props.children;
            const startIconContent = this._processIcon((_a = props.startIcon) === null || _a === void 0 ? void 0 : _a.call(props), 'oj-button-icon oj-start');
            const endIconContent = this._processIcon((_b = props.endIcon) === null || _b === void 0 ? void 0 : _b.call(props), 'oj-button-icon oj-end');
            let ariaLabel = null;
            let ariaLabelledBy = null;
            let title = null;
            let defaultContent = null;
            let clickHandler = null;
            const buttonLabel = props.label || defaultSlot;
            if (buttonLabel) {
                title = props.title || props.label || this.state.derivedTitle;
                if (props.display === 'icons' && (startIconContent || endIconContent)) {
                    if (props.label) {
                        ariaLabel = props.label;
                    }
                    else {
                        ariaLabelledBy = this.uniqueId() + '|text';
                        defaultContent = (ojvcomponent.h("span", { class: 'oj-button-text oj-helper-hidden-accessible', id: ariaLabelledBy }, buttonLabel));
                    }
                }
                else {
                    title = props.title;
                    ariaLabelledBy = this.uniqueId() + '|text';
                    defaultContent = (ojvcomponent.h("span", { class: 'oj-button-text', id: ariaLabelledBy }, buttonLabel));
                }
            }
            defaultContent = ojvcomponent.h("span", { ref: this._setDefaultSlotRef }, defaultContent);
            const labelContent = (ojvcomponent.h("div", { class: 'oj-button-label' },
                startIconContent,
                defaultContent,
                endIconContent));
            let buttonContent;
            if (props.disabled) {
                buttonContent = (ojvcomponent.h("button", { class: 'oj-button-button', "aria-labelledby": ariaLabelledBy, "aria-label": ariaLabel, disabled: true }, labelContent));
            }
            else {
                clickHandler = this._handleClick;
                buttonContent = (ojvcomponent.h("button", { class: 'oj-button-button', "aria-labelledby": ariaLabelledBy, "aria-label": ariaLabel, onTouchstart: this._handleTouchstart, onTouchend: this._handleTouchend, onTouchcancel: this._handleTouchend, onMouseenter: this._handleMouseenter, onMouseleave: this._handleMouseleave, onMousedown: this._handleMousedown, onMouseup: this._handleMouseup, onKeydown: this._handleKeydown, onKeyup: this._handleKeyup, onFocusin: this._handleFocusin, onFocusout: this._handleFocusout }, labelContent));
            }
            const rootClasses = this._getRootClasses(startIconContent, endIconContent);
            return (ojvcomponent.h("oj-button2", { class: rootClasses, title: title, onClick: clickHandler }, buttonContent));
        }
        _processIcon(icon, slotClass) {
            let iconContent;
            if (Array.isArray(icon)) {
                iconContent = icon.map((elem) => {
                    return this._processIcon(elem, slotClass);
                });
            }
            else if (icon) {
                iconContent = ojvcomponent.h("span", { class: slotClass }, icon);
            }
            return iconContent;
        }
        _getRootClasses(startIconContent, endIconContent) {
            let defaultState = true;
            let classList = 'oj-button ' + Button2_1._chromingMap[this.props.chroming];
            classList += ' ' + this._getDisplayOptionClass(startIconContent, endIconContent);
            if (this.props.disabled) {
                defaultState = false;
                classList += ' oj-disabled';
            }
            else {
                classList += ' oj-enabled';
                if (this.state.hover) {
                    defaultState = false;
                    classList += ' oj-hover';
                }
                if (this.state.active) {
                    defaultState = false;
                    classList += ' oj-active';
                }
                if (this.state.focus) {
                    if (defaultState) {
                        classList += ' oj-focus-only';
                    }
                    defaultState = false;
                    classList += ' oj-focus';
                    if (!DomUtils.recentPointer()) {
                        classList += ' oj-focus-highlight';
                    }
                }
            }
            if (defaultState) {
                classList += ' oj-default';
            }
            return classList;
        }
        _getDisplayOptionClass(startIconContent, endIconContent) {
            const multipleIcons = startIconContent && endIconContent;
            const atLeastOneIcon = startIconContent || endIconContent;
            const displayIsIcons = this.props.display === 'icons';
            let buttonClass;
            if (atLeastOneIcon) {
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
            if (this._mutationObserver) {
                return;
            }
            const config = {
                subtree: true,
                characterData: true
            };
            const callback = () => {
                const title = this._getTextContent();
                if (title != this.state.derivedTitle) {
                    this.updateState({ derivedTitle: title });
                }
            };
            this._mutationObserver = new MutationObserver(callback);
            this._mutationObserver.observe(this._defaultSlotRef, config);
        }
        mounted() {
            if (this.props.display === 'icons' && !this.props.label && !this.props.title) {
                let title = this._getTextContent();
                this.updateState({ derivedTitle: title });
                this._addMutationObserver();
            }
        }
        _getTextContent() {
            let content = this._defaultSlotRef.textContent;
            content = content.trim();
            if (content !== '') {
                return content;
            }
            return null;
        }
        unmounted() {
            if (this._mutationObserver) {
                this._mutationObserver.disconnect();
            }
        }
        _handleTouchstart(event) {
            this.updateState({ active: true });
        }
        _handleTouchend(event) {
            this.updateState({ active: false });
        }
        _handleMouseenter(event) {
            if (!DomUtils.recentTouchEnd()) {
                if (this === Button2_1._lastActive) {
                    this.updateState({ active: true });
                }
                this.updateState({ hover: true });
            }
        }
        _handleMouseleave(event) {
            this.updateState({ hover: false, active: false });
        }
        _handleMousedown(event) {
            if (event.which === 1 && !DomUtils.recentTouchEnd()) {
                this.updateState({ active: true });
                Button2_1._lastActive = this;
                const docMouseupListener = () => {
                    Button2_1._lastActive = null;
                    document.removeEventListener('mouseup', docMouseupListener, true);
                };
                document.addEventListener('mouseup', docMouseupListener, true);
            }
        }
        _handleMouseup(event) {
            this.updateState({ active: false });
        }
        _handleClick(event) {
            var _a, _b;
            if (event.detail <= 1) {
                (_b = (_a = this.props).onOjAction) === null || _b === void 0 ? void 0 : _b.call(_a, { originalEvent: event });
            }
        }
        _handleKeydown(event) {
            if (event.keyCode === 32 || event.keyCode === 13) {
                this.updateState({ active: true });
            }
        }
        _handleKeyup(event) {
            this.updateState({ active: false });
        }
        _handleFocusin(event) {
            this.updateState({ focus: true });
        }
        _handleFocusout(event) {
            this.updateState({ focus: false });
        }
        refresh() {
            this.render();
        }
    };
    exports.Button2._chromingMap = {
        solid: 'oj-button-full-chrome',
        outlined: 'oj-button-outlined-chrome',
        borderless: 'oj-button-half-chrome',
        full: 'oj-button-full-chrome',
        half: 'oj-button-half-chrome',
        callToAction: 'oj-button-cta-chrome'
    };
    exports.Button2.metadata = { "extension": { "_DEFAULTS": Props, "_ROOT_PROPS_MAP": { "title": true } }, "slots": { "": {}, "startIcon": {}, "endIcon": {} }, "properties": { "disabled": { "type": "boolean", "value": false }, "display": { "type": "string", "enumValues": ["all", "icons"], "value": "all" }, "label": { "type": "string" }, "translations": { "type": "object|null", "value": {} }, "chroming": { "type": "string", "enumValues": ["borderless", "callToAction", "full", "half", "outlined", "solid"] } }, "events": { "ojAction": { "bubbles": true } } };
    __decorate([
        ojvcomponent.listener({ passive: true })
    ], exports.Button2.prototype, "_handleTouchstart", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.Button2.prototype, "_handleTouchend", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.Button2.prototype, "_handleMouseenter", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.Button2.prototype, "_handleMouseleave", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.Button2.prototype, "_handleMousedown", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.Button2.prototype, "_handleMouseup", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.Button2.prototype, "_handleClick", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.Button2.prototype, "_handleKeydown", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.Button2.prototype, "_handleKeyup", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.Button2.prototype, "_handleFocusin", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.Button2.prototype, "_handleFocusout", null);
    exports.Button2 = Button2_1 = __decorate([
        ojvcomponent.customElement('oj-button2')
    ], exports.Button2);

    Object.defineProperty(exports, '__esModule', { value: true });

});
