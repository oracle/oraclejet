/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore'], 
       /*
        * @param {Object} oj 
        * @param {jQuery} $
        */
       function(oj, $)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

// jim retrieved from https://raw.github.com/jquery/jquery-ui/1-10-stable/ui/jquery.ui.button.js on 6/29/2013, and then modified

// -------------------------------------------------------------------------------------------------------
// This file contains both the Button and Buttonset components,
// so that they can share the same wrapper function / closure containing shared "private static members".
// -------------------------------------------------------------------------------------------------------

(function() // Button / Buttonset wrapper function, to keep "private static members" private
{

/**
 * @ojcomponent oj.ojButton
 * @augments oj.baseComponent
 * @since 0.6
 *
 * @classdesc
 * <h3 id="buttonOverview-section">
 *   JET Button Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonOverview-section"></a>
 * </h3>
 *
 * <p>Description: Themeable, WAI-ARIA-compliant push buttons and toggle buttons, with appropriate styles for hover, active, checked, and disabled.
 *
 * <p>There are two types of JET Buttons: push buttons and toggle buttons.
 *
 *
 * <h3 id="pushButtons-section">
 *   Push Buttons
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pushButtons-section"></a>
 * </h3>
 *
 * <p>Push buttons are ordinary buttons that do not stay pressed in when clicked.
 * Push buttons are created from buttons, anchors, and inputs of type button, submit, and reset.  
 * 
 * <p>Button elements are typically a good general-purpose choice.
 * 
 * <p>Anchor-based buttons are recommended only if native anchor functionality such as href navigation is desired.  If only a click listener is needed, 
 * button-based buttons are recommended.
 * 
 * <p>Inputs of type button, submit, and reset are less frequently useful because they don't support icons, and because of the Web 1.0 nature of submit/reset buttons.
 *
 *
 * <h3 id="toggleButtons-section">
 *   Toggle Buttons
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#toggleButtons-section"></a>
 * </h3>
 *
 * <p>Toggle buttons are buttons that toggle between a selected state and an unselected state when clicked.
 * Toggle buttons are created from radio buttons and checkboxes (inputs of type radio and checkbox).
 *
 * <p>For toggle buttons, the input must have a corresponding label element, which must be a sibling of the input that precedes the input.
 * The label's <code class="prettyprint">for</code> attribute must refer to the input's <code class="prettyprint">id</code> attribute.
 *
 * <p>A new wrapper element is created around the label and input, so that the component has a single root, while avoiding the accessibility problems
 * caused by nesting the input inside the label.
 *
 * <p>The label-precedes-input requirement ensures compatibility with the JET <code class="prettyprint">ojComponent</code> binding on the input element,
 * which expects all relevant DOM elements, including label, to be already available with all their attributes resolved.
 *
 * <p>The wrapper and label are styled to appear as the button, while the underlying input is updated on click.
 *
 * <p> Note that a given radio button must not be both checked and disabled, unless all radios in the group are disabled, since this removes
 * the entire radio group from the tab order in mainstream browsers.  This issue applies to native radios and is not unique to JET.
 *
 *
 * <h3 id="buttonsetToolbar-section">
 *   Buttonsets and Toolbars
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonsetToolbar-section"></a>
 * </h3>
 *
 * <p>The [JET Buttonset]{@link oj.ojButtonset} component can be used to group related buttons, such as a group of radios or checkboxes.  Buttonset provides
 * visual and semantic grouping and WAI-ARIA-compliant focus management.  See the Buttonset API doc for more information.
 *
 * <p>Also, buttons and buttonsets can be placed in a [JET Toolbar]{@link oj.ojToolbar}.  Like Buttonset, Toolbar is themable and provides WAI-ARIA-compliant
 * focus management.  See the Toolbar API doc for more information.
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
 * <p>For accessibility, a JET Button must always have a <a href="#label">label</a>, even if it is <a href="#display">icon-only</a>.
 *
 * <p>See also the <a href="#styling-section">oj-focus-highlight</a> discussion.
 *
 * <p>Disabled content: JET supports an accessible luminosity contrast ratio,
 * as specified in <a href="http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">WCAG 2.0 - Section 1.4.3 "Contrast"</a>,
 * in the themes that are accessible.  (See the "Theming" chapter of the JET Developer Guide for more information on which
 * themes are accessible.)  Note that Section 1.4.3 says that text or images of text that are part of an inactive user
 * interface component have no contrast requirement.  Because disabled content may not meet the minimum contrast ratio
 * required of enabled content, it cannot be used to convey meaningful information.<p>
 *
 *
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 * 
 * 
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Class(es)</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>oj-button-sm<br>
 *           oj-button-lg<br>
 *           oj-button-xl</td>
 *       <td>Alternate button sizes.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-button-primary</td>
 *       <td>Draws attention to a push button, often identifies the primary action in a set of buttons.  Designed for use with a push button. In some themes, this class does nothing.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-button-confirm</td>
 *       <td>Identifies an action to confirm. Designed for use with a push button.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-focus-highlight</td>
 *       <td>{@ojinclude "name":"ojFocusHighlightDoc"}</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 *
 * <h3 id="eventHandling-section">
 *   Event Handling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#eventHandling-section"></a>
 * </h3>
 *
 * <p>It's most reliable to register click handlers directly on the button, rather than on an ancestor.  For example, if any of the button's DOM is swapped out in a click
 * handler (e.g. alternating the text and icon between "Play" and "Pause"), the bubbling will stop if the click target was part of the content that was removed in the swap.
 *
 * <p>In lieu of a shared listener on an ancestor, syntax like <code class="prettyprint">$( "#ancestor :oj-button" ).click( myFunc );</code> can be used to set a handler on many
 * buttons at once.
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
 * 
 * <h3 id="pseudos-section">
 *   Pseudo-selectors
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
 * </h3>
 *
 * <p>The <code class="prettyprint">:oj-button</code> pseudo-selector can be used in jQuery expressions to select JET Buttons.  For example:
 *
 * <pre class="prettyprint">
 * <code>$( ":oj-button" ) // selects all JET Buttons on the page
 * $myEventTarget.closest( ":oj-button" ) // selects the closest ancestor that is a JET Button
 * </code></pre>
 *
 *
 * <h3 id="state-section">
 *   Setting Component State
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#state-section"></a>
 * </h3>
 *
 * <p>In JET, when setting component state after create time, the correct approach depends on whether the component has a JS API for that state.
 *
 * <p>State with a JS API, such as Button's disabled state, checked state, and label, should be set after creation via that API (which in those examples is
 * <code class="prettyprint">option()</code>), not by directly manipulating the DOM after creation.  This can be done by calling that JS API directly, or by binding
 * a component option like <code class="prettyprint">disabled</code> to an observable using the <code class="prettyprint">ojComponent</code> binding.
 * In the latter case, updates should always be made via the observable, since updates to the observable will update the option, while updates flow from the
 * component option to the observable only for UI interaction, not for programmatic updates via the API.
 *
 * <p>Built-in KO bindings, like KO's <code class="prettyprint">disable</code> binding, should not be used for state with a JS API, since that is tatamount to
 * updating the DOM directly.  The component option should be bound instead, via JET's <code class="prettyprint">ojComponent</code> binding.
 *
 * <p>If a button's checked state needs to be set programmatically, then it should be wrapped in a Buttonset so that its <code class="prettyprint">checked</code>
 * option can be used.  It is OK for a Buttonset to contain only one Button.
 *
 * <p>State with no JS API should be set by manipulating the DOM directly in an allowable way, and then calling <code class="prettyprint">refresh()</code>
 * on the affected component(s).  E.g. the reading direction (LTR / RTL) is changed by by setting the <code class="prettyprint">"dir"</code> attribute on the
 * <code class="prettyprint">&lt;html></code> node and calling <code class="prettyprint">refresh()</code>.
 *
 * <p>When using a built-in Knockout binding (as opposed to the <code class="prettyprint">ojComponent</code> binding), keep in mind that those bindings do not
 * execute the necessary <code class="prettyprint">refresh()</code> call after updating the DOM.  Updates that flow from the component to the observable,
 * as a result of user interaction, are not problematic.  But updates in the other direction, that programmatically update the DOM because the observable changed,
 * will not be picked up until the next <code class="prettyprint">refresh()</code>.
 *
 *
 * <h3 id="jqui2jet-section">
 *   JET for jQuery UI developers
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#jqui2jet-section"></a>
 * </h3>
 *
 * <!-- TODO: discuss component state, refresh(), etc. -->
 * <ol>
 *   <li>All JQUI and JET components inherit <code class="prettyprint">disable()</code> and <code class="prettyprint">enable()</code> methods from the base class.  This API
 *       duplicates the functionality of the <code class="prettyprint">disabled</code> option.  In JET, to keep the API as lean as possible, we
 *       have chosen not to document these methods outside of this section.</li>
 *   <li>JQUI Button has a Boolean <code class="prettyprint">text</code> option indicating whether to hide the label when icons are present.
 *       In JET, we prefer to avoid Booleans for future flexibility, so JET Button instead has an expandable <code class="prettyprint">display</code> option accepting
 *       the values <code class="prettyprint">"all"</code> and <code class="prettyprint">"icons"</code>.</li>
 *   <li>In JQUI Button, the <code class="prettyprint">icons</code> option accepts keys named <code class="prettyprint">"primary"</code> and
 *       <code class="prettyprint">"secondary"</code>.  For clarity, these options have been renamed in JET Button to <code class="prettyprint">"start"</code> and
 *       <code class="prettyprint">"end"</code>, our standard directionality-neutral terms for (in LTR) "left" and "right".</li>
 *   <li>JET Button can be effectively disabled without having its <code class="prettyprint">disabled</code> option set.  See [Buttonset.disabled]{@link oj.ojButtonset#disabled}.</li>
 * </ol>
 *
 *
 * <p>Also, event names for all JET components are prefixed with "oj", instead of component-specific prefixes like "button" or "menu".
 * E.g. the JQUI <code class="prettyprint">buttoncreate</code> event is <code class="prettyprint">ojcreate</code> in JET, as shown in the doc for that event.
 * Reason:  This makes the API more powerful.  It allows apps to listen to "foo" events from <em>all</em> JET components via:
 *
 * <pre class="prettyprint">
 * <code>$( ".selector" ).on( "ojfoo", myFunc);
 * </code></pre>
 *
 * or to "foo" events only from JET Buttons (the JQUI functionality) via:
 *
 * <pre class="prettyprint">
 * <code>$( ".selector" ).on( "ojfoo", ":oj-button", myFunc);
 * </code></pre>
 *
 *
 * <!-- - - - - Above this point, the tags are for the class.
 *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
 *
 *
 * @desc Creates a JET Button.
 *
 * @param {Object=} options a map of option-value pairs to set on the component
 *
 * @example <caption>Initialize the button with no options specified:</caption>
 * $( ".selector" ).ojButton();
 *
 * @example <caption>Initialize the button with some options and callbacks specified:</caption>
 * $( ".selector" ).ojButton( { "label": "Copy", "create": function( event, ui ) {} } );
 *
 * @example <caption>Initialize a push button via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;button id="paste" data-bind="ojComponent: { component: 'ojButton',
 *                                              label: 'Paste',
 *                                              create: setupButton }">
 *
 * @example <caption>Initialize a toggle button via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;label for="check">Toggle&lt;/label>
 * &lt;input type="checkbox" id="check" data-bind="ojComponent: {component: 'ojButton'}"/>
 */
oj.__registerWidget("oj.ojButton", $['oj']['baseComponent'],
{
    defaultElement: "<button>", // added to externs.js, since this is an override of a superclass member.  (That's the rule for public methods, what about protected fields?)  Would @override do the job and be better than externing?
    widgetEventPrefix : "oj",
    options: // options is in externs.js, so no need for quotes
    {
        /**
         * <p>Indicates in what states the button has chrome (background and border).  
         * 
         * <p>The default chroming varies by theme and containership as follows:
         * <ul>
         *   <li>If the button is in a buttonset or toolbar, then the default chroming is the current <code class="prettyprint">chroming</code> value of the nearest such container.</li>
         *   <li>Else, if <code class="prettyprint">$buttonChromingOptionDefault</code> is set in the current theme as seen in the example below, then that value is the chroming default.</li>
         *   <li>Else, the default chroming is <code class="prettyprint">"full"</code>.</li>
         * </ul>
         * 
         * <p>Once a value has been set on this button option, that value applies regardless of theme and containership.
         * 
         * @expose
         * @memberof oj.ojButton
         * @instance
         * @since 1.2.0
         * 
         * @type {string}
         * @ojvalue {string} "full" In typical themes, full-chrome buttons always have chrome.
         * @ojvalue {string} "half" In typical themes, half-chrome buttons acquire chrome only in their hover, active, and selected states. Half-chroming is recommended for buttons in a toolbar.  
         *     (This is the toolbar default in most themes.)
         * @ojvalue {string} "outlined" In typical themes, outlined buttons are similar to half-chrome buttons, but have a border in the default state.
         * @default Varies by theme and containership as detailed above.
         *
         * @example <caption>Initialize the button with the <code class="prettyprint">chroming</code> option specified:</caption>
         * $( ".selector" ).ojButton( { "chroming": "half" } );
         *
         * @example <caption>Get or set the <code class="prettyprint">chroming</code> option, after initialization:</caption>
         * // getter
         * var display = $( ".selector" ).ojButton( "option", "chroming" );
         *
         * // setter
         * $( ".selector" ).ojButton( "option", "chroming", "full" );
         * 
         * @example <caption>Set the default in the theme (SCSS) :</caption>
         * $buttonChromingOptionDefault: half !default;
         */
        chroming: "full",

        /**
         * <p>Disables the button if set to <code class="prettyprint">true</code>.
         *
         * <p>If the button is in a buttonset, setting the buttonset's <code class="prettyprint">disabled</code> option effectively disables all its Buttons, without affecting
         * their <code class="prettyprint">disabled</code> options.  Thus, a Button is effectively disabled if either its own
         * <code class="prettyprint">disabled</code> option is set, or the Buttonset's <code class="prettyprint">disabled</code> option is set.
         *
         * <p>After create time, the <code class="prettyprint">disabled</code> state should be set via this API, not by setting the underlying DOM attribute.
         *
         * <p>The 2-way <code class="prettyprint">disabled</code> binding offered by the <code class="prettyprint">ojComponent</code> binding
         * should be used instead of Knockout's built-in <code class="prettyprint">disable</code> and <code class="prettyprint">enable</code> bindings,
         * as the former sets the API, while the latter sets the underlying DOM attribute.
         *
         * @expose
         * @memberof oj.ojButton
         * @instance
         * @type {boolean}
         * @default <code class="prettyprint">false</code> for <code class="prettyprint">&lt;a></code> based Buttons; the DOM <code class="prettyprint">disabled</code> value otherwise
         *
         * @example <caption>Initialize the button with the <code class="prettyprint">disabled</code> option specified:</caption>
         * $( ".selector" ).ojButton( { "disabled": true } );
         *
         * @example <caption>Get or set the <code class="prettyprint">disabled</code> option, after initialization:</caption>
         * // getter
         * var disabled = $( ".selector" ).ojButton( "option", "disabled" );
         *
         * // setter
         * $( ".selector" ).ojButton( "option", "disabled", true );
         */
        disabled: false,

        /**
         * <p>Whether to display both the <a href="#label">label</a> and <a href="#icons">icons</a> (<code class="prettyprint">"all"</code>) 
         * or just the icons (<code class="prettyprint">"icons"</code>).  In the latter case, the label is displayed in a tooltip instead, unless a 
         * tooltip was already supplied at create time.
         *
         * <p>For accessibility, a JET Button must always have a label, even if it is icon-only.
         *
         * <p>The <code class="prettyprint">display</code> option will be ignored if no icons are specified via the <code class="prettyprint">icons</code> option.
         *
         * @expose
         * @memberof oj.ojButton
         * @instance
         * @type {string}
         * @ojvalue {string} "all" Display both the label and icons.
         * @ojvalue {string} "icons" Display only the icons.
         * @default <code class="prettyprint">"all"</code>
         *
         * @example <caption>Initialize the button with the <code class="prettyprint">display</code> option specified:</caption>
         * $( ".selector" ).ojButton( { "display": "icons" } );
         *
         * @example <caption>Get or set the <code class="prettyprint">display</code> option, after initialization:</caption>
         * // getter
         * var display = $( ".selector" ).ojButton( "option", "display" );
         *
         * // setter
         * $( ".selector" ).ojButton( "option", "display", "icons" );
         */
        display: "all",

        /**
         * <p>Text to show in the button.
         *
         * <p>When not specified at create time, the element's HTML content is used, or its
         * <code class="prettyprint">value</code> attribute if the element is an input element of type button, submit, or reset, or
         * the HTML content of the associated label element if the element is an input of type radio or checkbox.
         *
         * <p>After create time, the label should be set via this API, not by modifying the underlying DOM.
         *
         * <p>The 2-way <code class="prettyprint">label</code> binding offered by the <code class="prettyprint">ojComponent</code>
         * binding should be used instead of Knockout's built-in <code class="prettyprint">text</code> binding, as the former
         * sets the API, while the latter sets the underlying DOM attribute.
         *
         * <p>Values set on this option, at create time or later, are treated as plain text, not HTML.  If the label is specified via
         * DOM at create time as described above, that HTML content is kept.
         *
         * <p>For accessibility, a JET Button must always have a label, even if it is <a href="#display">icon-only</a>.
         *
         * @expose
         * @memberof oj.ojButton
         * @instance
         * @type {?string}
         * @default the label from the DOM
         *
         * @example <caption>Initialize the button with the <code class="prettyprint">label</code> option specified:</caption>
         * $( ".selector" ).ojButton( { "label": "custom label" } );
         *
         * @example <caption>Get or set the <code class="prettyprint">label</code> option, after initialization:</caption>
         * // getter
         * var label = $( ".selector" ).ojButton( "option", "label" );
         *
         * // setter
         * $( ".selector" ).ojButton( "option", "label", "custom label" );
         */
        label: null,

        /**
         * <p>Icons to display in the button.  Support is as follows:
         * <ul>
         *   <li>Any combination of start and end icons can be specified, with or without the label (see <code class="prettyprint">display</code> option).</li>
         *   <li>Icons are supported for push buttons created from buttons and anchors, and for toggle buttons (radios and checkboxes).</li>
         *   <li>Icons are not supported for push buttons created from inputs of type button, submit, and reset.</li>
         * </ul>
         *
         * <p>The start icon is displayed before the label text (on the left in LTR), and the end icon is displayed after the
         * label (on the right in LTR).  In RTL, the positions are reversed.
         *
         * <p>The <code class="prettyprint">start</code> and <code class="prettyprint">end</code> properties accept one or more
         * style class names (as seen in the examples), or <code class="prettyprint">null</code>, indicating "no icon."
         *
         * @expose
         * @memberof oj.ojButton
         * @instance
         * @type {Object}
         * @default <code class="prettyprint">{ start: null, end: foo }</code>, where foo is
         * <code class="prettyprint">"oj-component-icon oj-button-menu-dropdown-icon"</code> if this is a menu button, and
         * <code class="prettyprint">null</code> otherwise.  See the <code class="prettyprint">menu</code> option.
         *
         * @example <caption>Initialize the button, specifying both icons:</caption>
         * $( ".selector" ).ojButton({ "icons": { start: "demo-icon-font demo-bookmark-icon-16",
         *                                        end: "demo-icon-font demo-grid-icon-16" } });
         *
         * @example <caption>Get or set the <code class="prettyprint">icons</code> option, after initialization:</caption>
         * // getter
         * var icons = $( ".selector" ).ojButton( "option", "icons" );
         *
         * // setter, specifying both icons:
         * $( ".selector" ).ojButton( "option", "icons", { start: "oj-fwk-icon-caret-start oj-fwk-icon",
         *                                                 end: "demo-icon-font demo-grid-icon-16" } );
         */
        icons:
        {
            /**
             * <p>The start icon of the button.  See the top-level <code class="prettyprint">icons</code> option for details.
             *
             * @expose
             * @alias icons.start
             * @memberof! oj.ojButton
             * @instance
             * @type {?string}
             * @default <code class="prettyprint">null</code>
             *
             * @example <caption>Get or set the <code class="prettyprint">icons.start</code> sub-option, after initialization:</caption>
             * // getter
             * var startIcon = $( ".selector" ).ojButton( "option", "icons.start" );
             *
             * // setter:
             * $( ".selector" ).ojButton( "option", "icons.start", "oj-fwk-icon-caret-start oj-fwk-icon" );
             */
            start: null,
            /**
             * <p>The end icon of the button.  See the top-level <code class="prettyprint">icons</code> option for details.
             *
             * @expose
             * @alias icons.end
             * @memberof! oj.ojButton
             * @instance
             * @type {?string}
             * @default <code class="prettyprint">null</code>
             *
             * @default <code class="prettyprint">"oj-component-icon oj-button-menu-dropdown-icon"</code> if this is a menu button, and
             * <code class="prettyprint">null</code> otherwise.  See the <code class="prettyprint">menu</code> option.
             *
             * @example <caption>Get or set the <code class="prettyprint">icons.end</code> sub-option, after initialization:</caption>
             * // getter
             * var startIcon = $( ".selector" ).ojButton( "option", "icons.end" );
             *
             * // setter:
             * $( ".selector" ).ojButton( "option", "icons.end", "demo-icon-font demo-grid-icon-16" );
             */
            end: null
        },

        /**
         * <p>Identifies the [JET Menu]{@link oj.ojMenu} that the button should launch. If specified, the button is a menu button.
         *
         * <p>The value can be an HTML element, JQ selector, JQ object, NodeList, or array of elements. In all cases, the first indicated element is used.
         *
         * <p>By default, menu buttons have a downward pointing "dropdown" arrow for their end icon.  See the <code class="prettyprint">icons</code> option for details.
         *
         * <p>Menu button functionality is supported for Buttons based on button or anchor tags.  (Buttons based on input tags either do not support the dropdown icon,
         * or do not make sense for use as a menu button, or both.)  Buttons are recommended over anchors, as anchor-based buttons are intended for use when native 
         * anchor functionality such as href navigation is needed.
         *
         * <p>See [Menu's]{@link oj.ojMenu} Accessibility section for a discussion of how <code class="prettyprint">aria-label</code> and 
         * <code class="prettyprint">aria-labelledby</code> are handled for menu buttons and other menu launchers.
         *
         * @expose
         * @memberof oj.ojButton
         * @instance
         * @type {Element|Array.<Element>|string|jQuery|NodeList}
         * @default <code class="prettyprint">null</code>
         *
         * @example <caption>Initialize a menu button:</caption>
         * $( ".selector" ).ojButton({ "menu": "#myMenu" });
         *
         * @example <caption>Get or set the <code class="prettyprint">menu</code> option, after initialization:</caption>
         * // getter
         * var menu = $( ".selector" ).ojButton( "option", "menu" );
         *
         * // setter
         * $( ".selector" ).ojButton( "option", "menu", ".my-marker-class" );
         */
        menu: null

        // Events

        /**
         * Triggered when the button is created.
         *
         * @event
         * @name create
         * @memberof oj.ojButton
         * @instance
         * @property {Event} event <code class="prettyprint">jQuery</code> event object
         * @property {Object} ui Currently empty
         *
         * @example <caption>Initialize the button with the <code class="prettyprint">create</code> callback specified:</caption>
         * $( ".selector" ).ojButton({
         *     "create": function( event, ui ) {}
         * });
         *
         * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
         * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
         */
        // create event declared in superclass, but we still want the above API doc
    },

    _InitOptions: function(originalDefaults, constructorOptions) {
        this._super(originalDefaults, constructorOptions);

        this._initButtonTypes(); // init this.type and this.buttonElement, used below

        // At create time, disabled and label can be set via either option or DOM.
        // If app set the option, then that wins over the DOM, in which case _ComponentCreate() will later set that value on the DOM.
        // Else DOM wins, in which case we set the option from the DOM here, with any remaining tasks done later in _ComponentCreate().

        if (!('disabled' in constructorOptions)) // if app didn't set option, then set the option from the DOM
        {   // For anchors, this line always sets disabled option to false.  (Neither JQUI nor JET look for the .oj-disabled class for anchors,
            // so the only way to disable an anchor button at create time is via the API.  At refresh time, JQUI did look
            // for the .oj-disabled class, but our refresh doesn't handle disabled.)
            this.option('disabled',
                        !!this.element.prop( "disabled" ),
                        {'_context': {internalSet: true}}); // writeback not needed since "not in constructorOptions" means "not bound"
        }

        if (!('label' in constructorOptions)) // if app didn't set option, then set the option from the DOM
        {
            this.keepDomLabel = true;
            this.option('label',
                        this.type === "inputPush" ? this.buttonElement.val() : this.buttonElement.html(), // @HTMLUpdateOK getter not setter
                        {'_context': {internalSet: true}}); // writeback not needed since "not in constructorOptions" means "not bound"
        }

        // if this is a menuButton and app didn't set icons.end to its own icon or to null to suppress the icon, then default to built-in menuButton dropdown icon
        if (this.options.menu && (!constructorOptions.icons || constructorOptions.icons.end === undefined))
        {
            this.option('icons.end',
                        "oj-component-icon oj-button-menu-dropdown-icon",
                        {'_context': {writeback: true, internalSet: true}});
        }
    },

    _ComponentCreate: function() {
        this._super();

        // Add "form reset" handler to form (if any) that updates checked state of all buttons on form.
        // Register on the form once with a "static" button namespace, not once per button with each particular button's namespace,
        // so handler doesn't get removed if this particular button is destroyed.
        this.element.closest( "form" )
            .unbind( "reset" + BUTTON_EVENT_NAMESPACE )
            .bind( "reset" + BUTTON_EVENT_NAMESPACE, function() {
                var form = $( this );
                setTimeout(function() {
                    var $buttons = form.find( ":oj-button" ).each(function() {
                        $( this ).data( "oj-ojButton" )._applyCheckedStateFromDom(false);
                    });

                    // if last button in form has been destroyed or moved out, remove the handler
                    if (!$buttons.length)
                        form.unbind( "reset" + BUTTON_EVENT_NAMESPACE );
                }, 1 );
            } );

        // facilitate removing menuButton handlers separately, if app sets/clears the "menu" option
        this.menuEventNamespace = this.eventNamespace + "menu";

        this._initButtonTypes2();
        this.hasTitle = !!this.rootElement.attr( "title" );

        var self = this,
            options = this.options,
            toggleButton = this._isToggle,
            activeClass = !toggleButton ? "oj-active" : "";

        this.rootElement.addClass( BASE_CLASSES );
        _setChromingClass(this.rootElement, this.options.chroming);
        
        // Called for touchend/cancel on both button and document.  Listening only on button isn't completely reliable, 
        // apparently due to user-friendly "close enough" heuristics on iOS and Android where the touchend can happen 
        // slightly off of the button and the platform still counts it as a button click.  Listening only on the 
        // document runs the risk that we won't hear it because someone eats it.  Could use capture listener to dodge 
        // that risk, but just listening on both seems to work great.
        // Tried setting a flag in button.touchstart, so that the end listener could bail out if flag not set, 
        // but not needed, added complexity, and may have contributed to the above unreliability due to the above 
        // heuristics (platform might tolerate touchstart not being quite on the button, similar to touchend).
        var endHandler = function() {
            // Mouse handlers that apply active and hover styles will bail out if this ivar indicates 
            // that the last touch was within the last n ms.  This avoids having the mouse compatibility 
            // events set those styles 300ms after the tap, which would result in the hover style 
            // getting left on the button, and possibly in a flash of the active style.
            self._lastTouch = Date.now();

            self.rootElement.removeClass( activeClass );
            self.rootElement.removeClass( "oj-hover" ); // TODO: needed here, or just in mouse handlers?
            self._toggleDefaultClasses();
        };

        this.document.bind( "touchend" + this.eventNamespace + " " + "touchcancel" + this.eventNamespace, endHandler);
        
        this.buttonElement
            .bind( "touchstart" + this.eventNamespace, function() {
                if ( self._IsEffectivelyDisabled() )
                    return;

                $( this ).addClass( activeClass );
                self._toggleDefaultClasses();
            })
            .bind( "touchend" + this.eventNamespace + " " + "touchcancel" + this.eventNamespace, endHandler)
            .bind( "mouseenter" + this.eventNamespace, function() {
                if ( self._IsEffectivelyDisabled() )
                    return;
                
                // do this for real mouse enters, but not 300ms after a tap
                if (!self._recentTouch()) {
                    if ( this === _lastActive )
                        self.rootElement.addClass( "oj-active" );

                    self.rootElement.addClass( "oj-hover" )
                                    .removeClass( "oj-default oj-focus-only" );
               }
            })
            .bind( "mouseleave" + this.eventNamespace, function() {
                self.rootElement.removeClass( "oj-hover" );

                if ( self._IsEffectivelyDisabled() )
                    return;
                self.rootElement.removeClass( activeClass );
                self._toggleDefaultClasses();
            });

        this._disabledClickHandler = function( event ) {
            if ( self._IsEffectivelyDisabled() )
            {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        };

        // Must do this in capture phase to avoid race condition where app's click 
        // handlers on anchor buttons can be called if their listeners get registered 
        // before ours, e.g. if their KO click binding is before the ojComponent binding.
        this.buttonElement[0].addEventListener("click", this._disabledClickHandler, true);

        this._focusable({
            'element': this.rootElement, 
            'applyHighlight': true, 
            'afterToggle' : function() {
                self._toggleDefaultClasses();
            }
        });

        if ( toggleButton )
        {
            this.element.bind( "change" + this.eventNamespace, function( event ) {
                self._applyCheckedStateFromDom(true); // we just get one change event for entire radio group, even though up to 2 changed, so must refresh entire radio group, not just this button

                // if in a buttonset that tracks checked state (i.e. checkbox set or single
                // radio group), then set that option and fire optionChange event
                var buttonset = self._getEnclosingContainerComponent("buttonset");
                var checkedState = buttonset && buttonset._getCheckedFromDom(buttonset.$buttons);
                if (buttonset && checkedState!==undefined)
                {
                    buttonset.option("checked", checkedState,  {'_context': {writeback: true, originalEvent: event, internalSet: true}});
                }
            });

            // Required for FF, where click-drag on checkbox/radio btn's label(JET decorates label as button for toggle buttons )
            // will not yield in to click event and also trasfers focus out of the <input> element and hence breaks arrow navigation.
            // To fix, If mouse moves between mouseDown/mouseUp (drag) with in the boundaries of button then focus should be set
            // on the button which will ensure proper arrow key navigation(see  for more details).
            this.buttonElement
                .bind("mousedown" + this.eventNamespace, function(event) {
                    if (self._IsEffectivelyDisabled())
                        return;
                    _lastToggleActive = this;
                    self.document.one("mouseup", function() {
                        _lastToggleActive = null;
                    });
                })
                .bind("mouseup" + this.eventNamespace, function(event) {
                    if (self._IsEffectivelyDisabled())
                        return;
                    if (this === _lastToggleActive) {
                        self.element.focus();
                    }
                });
        }

        if ( this.type === "checkbox" )
        {
            this.buttonElement.bind( "click" + this.eventNamespace, function(event) {
                if ( self._IsEffectivelyDisabled() )
                    return false;
            });

            // role="button" requires both Space and Enter support, but radios and checkboxes natively support only Space, so add Enter.
            // Update: now that we're not using role=button for checkboxes, we don't strictly need this.
            // This fire-click-on-Enter logic gives Enter the same behavior as Space for checkboxes in Chrome, FF, and IE9:
            // In Chrome28 and IE9, for Space and Enter on Checkboxes, first the "checked" value updates, then change event, then click event.
            // In FF22, for Space and Enter on Checkboxes, first the "checked" value updates, then click event, then change event.
            // Unlike the radio Enter handler, we get this good behavior by only firing "click".
            this.element.bind( "keyup" + this.eventNamespace, function(event) {
                if ( event.keyCode === $.ui.keyCode.ENTER ) {
                    if ( !self._IsEffectivelyDisabled() ) {
                        //console.log("checkbox Enter handler firing click event");
                        self.element.click();
                    }
                }
            });
        } else if ( this.type === "radio" )
        {
            this.buttonElement.bind( "click" + this.eventNamespace, function() {
                if ( self._IsEffectivelyDisabled() )
                {
                    return false;
                }
            });

            // role="button" requires both Space and Enter support, but radios and checkboxes natively support only Space, so add Enter.
            // Update: now that we're not using role=button for radios, we don't strictly need this.
            // For radios, this handler gives Enter in Chrome28/ IE9/ FF22 the same behavior as Space on Chrome.  Since Space in IE/FF is
            // different than Space in Chrome, this means that Enter and Space are not quite the same within those browsers.
            // For Space and Enter on unchecked radios in Chrome28 and IE9:
            //   - first the "Checked" value updates, then change event, then click event.
            // For already-checked radios, where activation would just check it again:
            //   - Space and Enter in Chrome28, and Enter in IE9:  do nothing.
            //   - Space in IE9:  first the "Checked" value updates, then click event.  (No change event since nothing changed.)
            //     (This is the only Chrome/IE9 Space/Enter difference.)
            // In FF22:
            //   - Space on unchecked radios: first the "Checked" value updates, then click event, then change event.
            //   - Enter on unchecked radios is same as Chrome.  (Different event ordering than FF.)
            //   - Space on checked radios is like IE9: first the "Checked" value updates, then click event.  (No change event since nothing changed.)
            //   - Enter on checked radios is same as Chrome.  (Do-nothing.)
            this.element.bind( "keyup" + this.eventNamespace, function(event) {
                if ( event.keyCode === $.ui.keyCode.ENTER )
                {
                    if ( !self.element[0].checked && !self._IsEffectivelyDisabled() ) {
                        //console.log("radio Enter handler found radio unchecked, so checking it and firing click event");

                        // Unlike the checkbox Enter handler, we set checked=true and fire changed before firing click, without which
                        // we didn't get the exact behavior described above.  Without setting checked, the click handlers in all 3 desktop
                        // browsers saw the "old" "checked" value when Enter was pressed on radios, which broke Buttonset's focus mgmt logic.
                        // If we set checked, then change no longer fires automatically, in at least some browsers, so we have to fire it
                        // manually, both for apps that rely on it, and because our code relies on our change listener to update the "checked" styling.
                        self.element[0].checked = true;
                        self.element.change();
                        self.element.click();
                    }
                }
            });
        } else // neither checkbox nor radio, so not a toggle button, so element, buttonElement, and rootElement are all the same node
        {
            this.buttonElement
                .bind( "mousedown" + this.eventNamespace, function( event ) {
                    if ( self._IsEffectivelyDisabled() ) {
                        return false;
                    }

                    // don't show active/pressed-down state unless left mouse button, since only that button will click the button after mouseup
                    // do this for real mousedowns, but not 300ms after a tap
                    if ( event.which === 1 && !self._recentTouch() )
                    {
                        $( this ).addClass( "oj-active" )
                                 .removeClass( "oj-default oj-focus-only" );
                        _lastActive = this;
                        self.document.one( "mouseup", function() { // TODO: prob need capture listener like Menu for reliability
                            _lastActive = null;
                        });
                    }
                })
                .bind( "mouseup" + this.eventNamespace, function() {
                    if ( self._IsEffectivelyDisabled() )
                        return false;
                    $( this ).removeClass( "oj-active" );
                    self._toggleDefaultClasses();
                })
                .bind( "keydown" + this.eventNamespace, function(event) {
                    if ( self._IsEffectivelyDisabled() )
                        // ...then bail out always, also eating event unless key is Tab or left/right arrow, since:
                        // - Must allow Tab so KB user can't get stuck here. 
                        // - Nice to allow Buttonset/Toolbar's left/right arrow handling too, but not strictly essential as long as user 
                        //   can Tab out and back in, since (if app refreshed Buttonset/Toolbar after disabling button as required), the 
                        //   tab-back-in will go to an enabled button of the Buttonset/Toolbar, or skip Buttonset/Toolbar if all buttons disabled.
                        // - Must eat Enter/Space/DownArrow to prevent that functionality from occurring. (For non-anchor buttons, the native 
                        //   disabled status prevents some of those on at least some platforms.)
                        return event.keyCode === $.ui.keyCode.TAB || event.keyCode === $.ui.keyCode.LEFT || event.keyCode === $.ui.keyCode.RIGHT;

                    var isSpace = event.keyCode === $.ui.keyCode.SPACE;
                    var isAnchor = self.type === "anchor";
                    
                    // now that anchor doesn't support Space, still keep this line, in case users try to click via Space
                    if ( isAnchor && isSpace ) {
                        event.preventDefault(); // prevent scrolling down one page when clicking anchor button via Spacebar.  Only prevent for anchor!
                    }
                    if ( (isSpace && !isAnchor) || event.keyCode === $.ui.keyCode.ENTER ) {
                        $( this ).addClass( "oj-active" )
                                 .removeClass( "oj-default oj-focus-only" );
                    }
                })
                // see #8559, we bind to blur here in case the button element loses
                // focus between keydown and keyup, it would be left in an "active" state
                .bind( "keyup" + this.eventNamespace + " blur" + this.eventNamespace, function() {
                    $( this ).removeClass( "oj-active" );
                    self._toggleDefaultClasses();
                });

            if ( this.type === "anchor" )
            {
                //Chrome is not updating document.activeElement on click of <a> which is needed for ojPopup and
                //setting tabIndex to a non-negative value will fix this. Refer 
                var tabIndex = this.buttonElement.attr( "tabindex" );
                if( tabIndex === 'undefined' || tabIndex === null || isNaN(tabIndex) ) // Don't override if user already set a tabIndex.
                {
                    this.buttonElement.attr( "tabindex", "0" );
                }
            }
        } // end of: if (checkbox) {} else if (radio) {} else {}

        // at create time, we want only the "if disabled" part of callee, not the "if enabled" part, so only call if disabled
        if (this.options.disabled) 
            this._manageAnchorTabIndex(false, true);

        this._updateEffectivelyDisabled();
        this._handleLabelAndIconsAtCreateTime();
        this._setupMenuButton(null);

        // call this at the *end* of _ComponentCreate, since it needs to know whether any state classes like oj-active, oj-disabled, oj-selected, oj-hover, .oj-focus
        // have been applied.
        this._toggleDefaultClasses();
    },

    // was there a touch within the last n ms? 
    _recentTouch: function()
    {
        return Date.now() - this._lastTouch < 500; // must be at least 300 for the "300ms" delay
    },

    _NotifyContextMenuGesture: function(menu, event, eventType)
    {
        // For toggle buttons, launcher must be the hidden focusable input, but for Shift-F10 we want the CM aligned to the root element, not that 
        // launcher.  This is no change from the default for push buttons, since in that case rootElement and launcher (element) are the same.
        this._OpenContextMenu(event, eventType, {
            "position": {"of": eventType==="keyboard" ? this.rootElement : event}
        });
    },

    // Part 1 of type-specific component init.  Called from _InitOptions, so very limited component state is available!
    _initButtonTypes: function() // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        // for toggle buttons (radio/checkbox), element is <input>, buttonElement is <label>,
        // and rootElement is a new wrapper element we create.
        if ( this.element.is("input[type=checkbox]") ) {
            this.type = "checkbox";
            this._isToggle = true;
        } else if ( this.element.is("input[type=radio]") ) {
            this.type = "radio";
            this._isToggle = true;
        }

        // for push buttons (next 3 cases), element, buttonElement, and rootElement are all the same elem.  We ignore <label> if present.
        else if ( this.element.is("input[type=button],input[type=submit],input[type=reset]") )
            this.type = "inputPush";
        else if ( this.element.is("button"))
            this.type = "button";
        else if ( this.element.is("a"))
            this.type = "anchor";
        else
            throw new Error("JET Button not supported on this element type");

        if ( this._isToggle )
        {
            // TBD: rather than requiring the label to be supplied, should we just create one for them if it's not there?
            var labelSelector = "label[for='" + this.element.attr("id") + "']";
            this.buttonElement = this.element.siblings().filter( labelSelector );
        } else {
            this.buttonElement = this.element;
        }
    },

    // Part 2 of type-specific component init, called from _ComponentCreate().
    _initButtonTypes2: function() // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        if ( this._isToggle )
        {
            this.buttonElement.addClass( "oj-button-label" );

            this.element
                .addClass( "oj-button-input oj-helper-hidden-accessible" )
                .add(this.buttonElement) // doesn't mutate this.element

                .wrapAll("<span></span>"); // add root node around label/input.  @HTMLUpdateOK trusted string

            this.rootElement = this.element.parent(); // the new root
            this.rootElement.addClass( "oj-button-toggle" );

            var checked = this.element[0].checked;
            if ( checked ) {
                this.rootElement.addClass( "oj-selected" )
                                .removeClass( "oj-default oj-focus-only" );
            }
            // else no need to removeClass since this code runs only at create time

        } else
        {
            this.rootElement = this.element;
        }
    },

    /**
     * Returns a <code class="prettyprint">jQuery</code> object containing the root element of the Button component.
     *
     * @expose
     * @memberof oj.ojButton
     * @instance
     * @return {jQuery} the root element of the component
     *
     * @example <caption>Invoke the <code class="prettyprint">widget</code> method:</caption>
     * var widget = $( ".selector" ).ojButton( "widget" );
     */
    widget: function() // Override of public base class method.  Method name needn't be quoted since is in externs.js.
    {
        return this.rootElement;
    },

    _destroy: function() // Override of protected base class method.  Method name needn't be quoted since is in externs.js.
    {
        this._removeMenuBehavior(this.options.menu);
        this.document.off( this.eventNamespace );
        this.buttonElement[0].removeEventListener("click", this._disabledClickHandler, true);

        // TBD: won't need this after the restore-attrs feature is in place.
        this.element
            .removeClass( "oj-helper-hidden-accessible" )
            .removeAttr("aria-labelledby")
            .removeUniqueId();

        // If disabled, we want to run the "changing from disabled to enabled" part of callee, to restore original tabindex.
        // If enabled, don't want to run any part of callee.
        if (this.options.disabled) 
            this._manageAnchorTabIndex(true, false);

        var isToggle = this._isToggle;

        // TBD: won't need this after the restore-attrs feature is in place.
        if ( !isToggle )
            this.rootElement.removeClass( BASE_CLASSES + " " + STATE_CLASSES + " " + TYPE_CLASSES + " " + CHROMING_CLASSES );

        this.buttonElement.html( this.buttonElement.find(".oj-button-text").html() ); // @HTMLUpdateOK reparent existing DOM

        if ( !isToggle )
        {
            // TBD: won't need this after the restore-attrs feature is in place.
            if ( !this.hasTitle )
                this.rootElement.removeAttr( "title" );
        } else
        {
            this.buttonElement.removeClass( "oj-button-label" ); // TBD: won't need this after the restore-attrs feature is in place.

            // : If the button is stamped out by a KO foreach (with or without a containing buttonset), and the foreach
            // observable is updated to no longer include the button, then _destroy() is called.  Due to the ordering of tasks, if
            // JQ's unwrap() is called directly, the nodes winds up back into the DOM.  To avoid this, we previously successfully
            // put the JQ unwrap() call in a setTimeout(0), and now we do the following:
            //
            //  - DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
            oj.DomUtils.unwrap(this.element);
        }

        if( _lastToggleActive === this.buttonElement[0] )
        {
            _lastToggleActive = null; //clear _lastToggleActive flag, while destroying the button.
        }
    },

    _NotifyDetached: function() {
        // In browsers [Chrome v35, Firefox v24.5, IE9, Safari v6.1.4], blur and mouseleave events are generated for hidden content but not detached content,
        // so when the component is detached from the document, we must use this hook to remove the oj-focus, oj-focus-highlight, oj-hover, and oj-active classes, to 
        // ensure that button is displayed without those classes when it is re-attached to the DOM. Refer .
        // _super() now removes those 3 classes, so just need to call _tDC() afterwards.
        this._super();
        this._toggleDefaultClasses();
    },

    __setAncestorComponentDisabled: function( disabled )
    {
        this._super( disabled ); // sets this._ancestorDisabled
        this._updateEffectivelyDisabled();
    },

    // Prereq:  this.options.disabled and this._ancestorDisabled must already be set to their updated values before calling this method.
    //
    // When called by __setAncestorComponentDisabled(), it has already set this._ancestorDisabled.
    //
    // When called by _setOption("disabled"), its _super() has already done the following things:
    // - Set this.options.disabled.
    // - Applied .oj-disabled and aria-disabled to rootElement, often incorrectly per comments below.  The below code fixes it up.  The _super() code has tbd to fix this.
    // - If option is being set to true, it's removed .oj-hover/focus/focus-highlight/active.  (See comment below.)
    _updateEffectivelyDisabled: function()
    {
        var effectivelyDisabled = this._IsEffectivelyDisabled();

        // Unlike JQUI, root element should have exactly one of .oj-enabled and .oj-disabled at any point in time, for all flavors of Button.
        // _setOption._super() sets .oj-disabled to potentially wrong value since it doesn't know about "effectively disabled".  This fixes it up.
        this.rootElement.toggleClass( "oj-disabled", effectivelyDisabled );
        this.rootElement.toggleClass( "oj-enabled", !effectivelyDisabled ); // _setOption._super() doesn't try to set this

        if (this.type !== "anchor") // i.e. <button> or <input> (including type=radio|checkbox|other)
        {
            // <button> and <input> (including type=radio|checkbox|other) have this property, but <a> doesn't
            this.element.prop( "disabled", effectivelyDisabled ); // JQUI's _setOption sets this for <a>'s too, which seems harmless but is incorrect.

            // _setOption._super() puts aria-disabled on the rootElement.  Per A11y team, don't put aria-disabled on element already having disabled
            // attr.  (And if we DID apply aria-disabled, for radios/checkboxes it should go on the element / input, not the buttonElement / label or rootElement,
            // so the _setOption._super() behavior used by JQUI button is doubly wrong.)  Further, _setOption._super() can set it wrong since it doesn't know
            // about "effectively disabled".  This fixes it up.
            this.rootElement.removeAttr( "aria-disabled" );
        } else { // else is <a>
            // Unlike radios/checkboxes, _setOption._super() puts aria-disabled on the correct element for <a>'s since element and rootElement are both the <a>.
            // However, it sets it to potentially wrong value since it doesn't know about "effectively disabled".  This fixes it up.
            this.rootElement.attr( "aria-disabled", effectivelyDisabled );
        }

        if (effectivelyDisabled)
        {
            // TBD: when the handling of oj-active in baseComponent._setOption("disabled") is finalized, review whether this should be handled there instead.
            // baseComponent._setOption("disabled") removes oj-active, oj-hover, oj-focus, and oj-focus-highlight, but _updateEffectivelyDisabled is called in a number of other 
            // cases too, so do it here too to be safe.
            this.widget().removeClass("oj-active oj-default oj-focus-only oj-hover oj-focus oj-focus-highlight");
            _lastActive = null; // avoid (very slight) possibility that first mouseIn after button is subsequently re-enabled will set oj-active

            // when disabling a menu button, dismiss the menu if open
            this._dismissMenu(this.options.menu);
        }
        else
        {
            this._toggleDefaultClasses();
        }
    },

    _setOption: function( key, value, flags ) // Override of protected base class method.  Method name needn't be quoted since is in externs.js.
    {
        var oldValue = this.options[key];
        this._super( key, value, flags );
        // TBD: Currently the below code relies on super already having been called.  Consider removing that dependency
        // and calling super at end instead, so that optionChange (fired at end of super) is fired at very end.

        switch (key)
        {
            case "chroming":
                _setChromingClass(this.rootElement, value);
                break;
            case "disabled":
                // call this from _setOption, not _updateEffectivelyDisabled, as discussed in callee
                this._manageAnchorTabIndex(oldValue, value);

                // must call this *after* _super(), as discussed in callee
                this._updateEffectivelyDisabled();
                break;
            case "label":
                this._setLabelOption();
                break;
            case "display":
                if ( this.type !== "inputPush" ) // <input type=button|submit|reset> doesn't support child nodes, thus no icons, icon-only buttons, etc.
                    this._setDisplayOptionOnDom();
                break;
            case "icons":
                this._setIconsOption(true);
                break;
            case "menu": // setting/clearing the menu sets whether this is a menuButton
                this._setupMenuButton(oldValue);
                break;
        }
    },

    /**
     * Refreshes the button. JET components require a <code class="prettyprint">refresh()</code> after a supported DOM change is made
     * that affects the component, of which the component would otherwise be unaware.  In particular, if the Button is reparented from
     * inside a Buttonset or Toolbar to a location that's not in a Buttonset or Toolbar, then <code class="prettyprint">refresh()</code> 
     * must be called.
     *
     * <p>Note that anything having a JS API, such as the Button's label, disabled state, and checked state, must be set via the API, not
     * by mutating the DOM and calling <code class="prettyprint">refresh()</code>.  (For the checked state, see Buttonset's
     * <code class="prettyprint">checked</code> option.)
     *
     * @expose
     * @memberof oj.ojButton
     * @instance
     *
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * $( ".selector" ).ojButton( "refresh" );
     */
    refresh: function() // Override of public base class method (unlike JQUI).  Method name needn't be quoted since is in externs.js.
    {
        this._super();

        // TODO:
        // - JSDoc says to call refresh() when Button reparented.  Instead, app should call oj.Components.subtreeAttached(), and our 
        //   _NotifyAttached override should do the handling.
        // - There are other things we should do in the "no longer in buttonset" case, like removing buttonset listeners.  Anything else too?
        // - The reason the jsdoc doesn't mention the "moved into Buttonset (possibly from another buttonset)" case is that in that case
        //   Bset.refresh() must be called.  However, not sure that it's doing all the necessary things for the "from another Bset" case.

        // Handle the rare case where we just got reparented out of a disabled Buttonset
        if ( this._ancestorDisabled && !this._getEnclosingContainerElement("buttonset").length )
            this.__setAncestorComponentDisabled(false);
        
        // re-fetch the chroming option, so that if it's still set to the default dynamic getter, which takes its value from the containing 
        // buttonset or toolbar if present, refresh() will update the visible chroming.  This is needed for cases like the following, all of 
        // which call button.refresh() : 
        // - The button previously wasn't in a buttonset or toolbar, but now is, or vice versa.  This is common at init time, when the bset/
        //   toolbar is created after their buttons, in which case the bset/toolbar refreshes their buttons.  Can also happen due to reparenting 
        //   the button into or out of the bset/toolbar. "into": app must refresh bset/toolbar, which refreshes their buttons.  "out of": app 
        //   must refresh the button.
        // - The app sets the chroming option of the containing buttonset or toolbar, which refreshes their buttons.
        // Do this after the _super() call, which updates the list of containers (buttonset/toolbar) that the component is in.
        _setChromingClass(this.rootElement, this.options.chroming);
    },

    // If this button is radio/checkbox, then this method gets the checked state from DOM's
    // "checked" prop and toggles oj-selected accordingly.
    // If wholeGroup param is true, and this button is a radio, then do that for all buttons in the group.
    _applyCheckedStateFromDom: function(wholeGroup) // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        if ( this.type === "radio" )
        {
            (wholeGroup ? _radioGroup( this.element[0] ) : this.element ).each(function() {
                var $radioWidget = $( this ).data( "oj-ojButton" ); // definitely exists because _radioGroup() checks for :oj-button

                if ( this.checked )
                {
                    $radioWidget.rootElement.addClass( "oj-selected" )
                                            .removeClass( "oj-default oj-focus-only" );
                } else
                {
                    $radioWidget.rootElement.removeClass( "oj-selected" );
                    $radioWidget._toggleDefaultClasses();
                }
            });
        } else if ( this.type === "checkbox" )
        {
            if ( this.element[0].checked )
            {
                this.rootElement.addClass( "oj-selected" )
                                .removeClass( "oj-default oj-focus-only" );
            } else
            {
                this.rootElement.removeClass( "oj-selected" );
                this._toggleDefaultClasses();
            }
        }
    },

    /*
     * Method name sums it up.  Should only be called at create time.
     */
    _handleLabelAndIconsAtCreateTime: function() // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        if ( this.type === "inputPush" ) { // <input type=button|submit|reset> doesn't support child nodes, thus no icons, etc.
            this._setLabelOnDomOfSpanlessButton();
        } else { // <button>, <a>, checkboxes, and radios
            var textSpan = this._setLabelOnDomAtCreateTime();
            var hasStartIcon = this._setIconOnDom(true);
            var hasEndIcon = this._setIconOnDom(false);

            this._setDisplayOptionOnDom(textSpan, hasStartIcon, hasEndIcon);
        }
    },

    /*
     * Replace the button contents with a span containing the label:
     * - If app didn't set the label option, then reparent their DOM label to the new span.
     * - If app set the label option, then set escaped version onto label span.
     * Either way, button contents are completely replaced with the new span.
     *
     * Should only be called at create time.
     *
     * return the new textSpan
     */
    _setLabelOnDomAtCreateTime: function() // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        var buttonElement = this.buttonElement;
        var textSpan = $( "<span class='oj-button-text'></span>", this.document[0] );

        if (this.keepDomLabel) {
            textSpan.append(buttonElement.contents()); // @HTMLUpdateOK reparent existing DOM
        } else {
            buttonElement.empty();
            textSpan.text(this.options.label); // performs escaping; e.g. if label is <a>foo</a>, then text() replaces the span's contents with a text node containing that literal string (rather than setting innerHtml).
        }

        // Due to FF bug (see Bugzilla's Bug 984869), <button> with flex/inline-flex display doesn't work. Workaround by wrapping <button> contents with a <div> and setting the latter display flex/inline-flex
        if (this.type === "button") {
            var contentContainer = $("<div></div>").addClass("oj-button-label");
            contentContainer.append(textSpan);
            this.element.append(contentContainer); // @HTMLUpdateOK attach detached wrapped DOM created from trusted string and existing DOM
        } else {
            buttonElement.append(textSpan); // @HTMLUpdateOK attach detached DOM created from trusted string and existing DOM
        }

        // Need to set "aria-labelledby" attribute of (button/anchor) element to point to label span as fix for  (accessibility: icon-only button label is read twice by screen reader)
        // This is only a problem for <button> and <a> at the time of writing, so the fix is only applied to these two button types.
        if (this.type === "button" || this.type === "anchor") {
            textSpan.uniqueId(); // assign id so that this.element can have "aria-labelledby" attribute pointing to the textspan
            this.element.attr("aria-labelledby", textSpan.attr("id"));
        }
        return textSpan;
    },

    /*
     * Following is an old TBD from before the refactoring.  Now that we've sharply reduced the amount of unnecessary DOM replacement when
     * options like label and icons are set, is this still an issue?  If so, can we further minimize the churn to fix it?
     * TBD: Per http://www.quirksmode.org/blog/archives/2007/01/a_note_about_ev.html, if a click handler blows away the thing that was
     * clicked, it stops the click event from bubbling any further.  For antonym buttons like Play/Pause where the app puts a click handler
     * on the button that toggles its label and/or icons, this method replaces the clicked element, e.g. a <span> inside the <button>,
     * stopping the bubble. [UPDATE: we keep the span now but change its contents.  Does that fix it?].  This makes bubbling brittle.
     * Consider improving and/or doc'ing the issue.
     */

    /*
     * This method takes care of everything that needs to happen when the "label" option is set *after* create time.
     */
    _setLabelOption: function() // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        if ( this.type === "inputPush" ) { // <input type=button|submit|reset> doesn't support child nodes, thus no icons, etc.
            this._setLabelOnDomOfSpanlessButton();
        } else {
            var textSpan = this.buttonElement.find( '.oj-button-text' );
            textSpan.text(this.options.label); // performs escaping; e.g. if label is <a>foo</a>, then text() replaces the span's contents with a text node containing that literal string (rather than setting innerHtml).
            this._setDisplayOptionOnDom(textSpan);
        }
    },

    /*
     * This method should only be called when the button is a "spanless" button, i.e. <input type=button|submit|reset>. It is called when the label is set,
     * both at create time and when it is set later.
     */
    _setLabelOnDomOfSpanlessButton: function() // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        // TBD: The "if label" check is from JQUI.  Is there some reason that setting "" should be ignored?
        // Probably not too harmful since they should set "display" option to "icons" instead, or set " " if they really want to.
        if ( this.options.label )
            this.element.val( this.options.label ); // escaping is automatic; e.g. if label is <span>foo</span>, then val() sets that literal string on the input's "value" attr.
    },

    _setIconsOption: function() // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        if ( this.type === "inputPush" ) // <input type=button|submit|reset> doesn't support child nodes, thus no icons, etc.
            return;

        var hasStartIcon = this._setIconOnDom(true);
        var hasEndIcon = this._setIconOnDom(false);
        this._setDisplayOptionOnDom(undefined, hasStartIcon, hasEndIcon);
    },

    /*
     * This method sets either the start or end icon on the DOM, depending on the param, adding or removing the
     * icon span as needed.  It is called both at create time and when the icon changes later.
     *
     * param isStart boolean, whether is start or end icon
     * return boolean indicating whether an icon was set on DOM
     */
    _setIconOnDom: function(isStart) // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        var contentContainer = this.buttonElement;
        if (this.type === "button")
            contentContainer = this.element.children("div.oj-button-label");

        if (isStart) {
            var iconSpanSelector = '.oj-button-icon.oj-start';
            var standardIconClasses = 'oj-button-icon oj-start';
            var appIconClass = this.options.icons.start;
            var lastIvar = "_lastStartIcon";
            var pendTo = "prependTo";
        } else {
            iconSpanSelector = '.oj-button-icon.oj-end';
            standardIconClasses = 'oj-button-icon oj-end';
            appIconClass = this.options.icons.end;
            lastIvar = "_lastEndIcon";
            pendTo = "appendTo";
        }

        var iconSpan = contentContainer.find( iconSpanSelector );

        if ( appIconClass ) {
            if ( iconSpan.length ) {
                // remove the app icon class we set last time
                var oldAppIconClass = this[lastIvar];
                iconSpan.removeClass(oldAppIconClass);
            } else {
                iconSpan = $( "<span></span>" )
                    .addClass( standardIconClasses )
                    [pendTo]( contentContainer ); // @HTMLUpdateOK append or prepend trusted new DOM to button elem
            }
            iconSpan.addClass( appIconClass );
        } else {
            iconSpan.remove();
        }

        // remember the app icon class we set, so we can remove it next time
        this[lastIvar] = appIconClass;

        return !!appIconClass;
    },

    /*
     * Hides / shows the label, and adds / removes the rootElement tooltip, depending on whether
     * display is "icons" (and whether there are in fact icons).  Doesn't add/remove the
     * tooltip if app provided one initially.
     *
     * Sets the corresponding root style class, e.g. "oj-button-text-only" or "oj-button-text-icon-start".
     *
     * Note: if rootAttributes ever supports "title", then need to call this *after* _SetRootAttributes so
     * app has a chance to set their own tooltip for checkbox/radio.
     *
     * Must be called when display, icons, or label options are set.
     * (If icons.end ever supports "auto" and is set to "auto", then must be called when menu option is set.)
     *
     * Caller must check that it's not a spanless button before calling this method.
     *
     * All params optional.
     */
    _setDisplayOptionOnDom: function(textSpan, hasStartIcon, hasEndIcon) // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        if (textSpan === undefined)
            textSpan = this.buttonElement.find( '.oj-button-text' );
        if (hasStartIcon === undefined)
            hasStartIcon = !!this.options.icons.start;
        if (hasEndIcon === undefined)
            hasEndIcon = !!this.options.icons.end;

        var multipleIcons = hasStartIcon && hasEndIcon;
        var atLeastOneIcon = hasStartIcon || hasEndIcon;
        var displayIsIcons = this.options.display === "icons";

        if ( atLeastOneIcon && displayIsIcons )
        {
            textSpan.addClass( "oj-helper-hidden-accessible" );

            if ( !this.hasTitle )
            {
                var buttonText = /** @type {string}  tell GCC is getter, not setter, overload of text() */
                                 (textSpan.text());
                this.rootElement.attr( "title", $.trim( buttonText ) ); // use buttonText, which is escaped, not options.label, which isn't!
            }
        } else
        {
            textSpan.removeClass( "oj-helper-hidden-accessible" );

            if ( !this.hasTitle )
                this.rootElement.removeAttr( "title" );
        }

        var buttonClass =
            !atLeastOneIcon
                ? "oj-button-text-only"
                : displayIsIcons
                    ? multipleIcons ? "oj-button-icons-only" : "oj-button-icon-only"
                    : multipleIcons
                        ? "oj-button-text-icons"
                        : hasStartIcon
                            ? "oj-button-text-icon-start"
                            : "oj-button-text-icon-end";

        this.rootElement.removeClass( TYPE_CLASSES )
                        .addClass( buttonClass );
    },

    // Anchors are the only Button type lacking a native disabled API, so this tabindex logic is needed to prevent 
    // them from being tabbable when disabled.  We only set the tabindex for anchors, and only when the Button is 
    // standalone (not in a Buttonset or Toolbar), since those components already manage the tabindex.
    // 
    // Each time a standalone anchor Button is set to disabled, including create time, we set its tabindex to -1, and 
    // stash its old tabindex in an ivar, so that we can restore it when it is later enabled, and at destroy time.
    // This handles the common case where the button's "is standalone" status never changes.
    // 
    // For the rare case that a Button is reparented into one of those components, those components will take 
    // over the tabIndex, so Button needn't do anything special at that time.
    // 
    // For the rare case that a Button is reparented out of one of those components, so as to become standalone, we 
    // take no action, and in fact should NOT call this method, for the following reasons:
    // - Already, for all button types (not just anchor), the app must fix up the tabindex of a button reparented out of 
    //   these containers, since it might be -1. There's little reason to handle anchors specially.
    // - We prefer not to introduce special handling just for this rare edge case.
    // - We don't want to guess whether the tabindex was set by the former container (which we try to fix up), vs. being 
    //   set a moment ago by the app (which we hope not to clobber).
    // - If the button is disabled, we don't want to call the regular "set tabindex and stash old tabindex" logic, since 
    //   the old tabindex is often -1 set by the old container.  Stashing -1 would mean that the next enable or destroy 
    //   incorrectly sets -1 on the tabindex. And we don't want to special-case that logic for this rare reparenting case.
    //   Also, disabled buttons from those containers already have the desired -1 value (unless app changed it, which is 
    //   their decision), so no action needed anyway.
    // 
    // Since this logic never runs when in a Buttonset, callers don't need to worry about "effectively disabled", and can 
    // just pass the old/new values of this.options.disabled.
    // 
    // This method should NOT be called by refresh(), since there's no need, and since refresh() is called when reparented 
    // out of a buttonset/toolbar.  Per above, this method should NOT be called at that time.
    // 
    // This method should be called by _setOption("disabled") and at create time, NOT by _updateEffectivelyDisabled() 
    // (which is called in both of those cases), since _updateEffectivelyDisabled() can be called 
    // indirectly by refresh() when the button was just reparented out of a disabled Buttonset.  Since this logic never 
    // runs when in a Buttonset, calling from _updateEffectivelyDisabled() is not needed.
    _manageAnchorTabIndex: function( oldDisabled, disabled )
    {
        // bail if:
        // - truthiness of disabled option is same as before, e.g. changed from "a" to "b"
        // - not a standalone anchor button
        if (!oldDisabled == !disabled || this.type !== "anchor" 
                || this._getEnclosingContainerElement("buttonset").length 
                || this._getEnclosingContainerElement("toolbar").length)
            return;

        if (disabled) { // enabled button becoming disabled, at create time or later. (Not destroy time, since that logic only passes disabled=false.)
            // If the existing tabindex is unset (attr() returns undefined) or invalid (not a (stringified) integer), set the 
            // ivar to null, in which case when we later restore the old value, we just clear the attr.  Obviously correct 
            // in unset case. For invalid case, we prefer not to set anything invalid on the dom, and per MDN 
            // unset and invalid tabindexes are handled the same.
            var attr = this.element.attr("tabindex");
            this._oldAnchorTabIndex = this._isInteger(Number(attr)) ? attr: null;
            
            this.element.attr("tabindex", -1);
        } else { // disabled button becoming enabled after create time, incl. destroy time.  (Not create time, since that logic only passes disabled=true.)
            this._oldAnchorTabIndex == null 
                ? this.element.removeAttr("tabindex")
                : this.element.attr("tabindex", this._oldAnchorTabIndex);
            // no need to clear ivar
        };
    },

    // IE11 and several modern platforms don't support Number.isInteger(), so use MDN's polyfill:
    _isInteger: function( value )
    {
        return typeof value === "number" && 
            isFinite(value) && 
            Math.floor(value) === value;
    },

    _selectorMap: {
        "buttonset": ".oj-buttonset", 
        "toolbar":   ".oj-toolbar" 
    },

    _constructorMap: {
        "buttonset": "ojButtonset", 
        "toolbar":   "ojToolbar" 
    },

    // component param is "buttonset" or "toolbar".
    // Returns non-null JQ object that's length 1 iff this button is contained in a container of the specified type
    _getEnclosingContainerElement: function(component)
    {
        return this.rootElement.closest(this._selectorMap[component]);
    },

    // component param is "buttonset" or "toolbar"
    // Returns buttonset/toolbar component, or null if none.
    _getEnclosingContainerComponent: function(component)
    {
        var elem = this._getEnclosingContainerElement(component)[0];
        var constructor = oj.Components.getWidgetConstructor(elem, this._constructorMap[component]);
        return constructor && constructor("instance");
    },

    /*
     * Call this method at create time and whenever the "menu" option is set by the app.
     *
     * - This method first removes menuButton stuff from the element and from any Menu previously set on this Button.
     * - Then, if the Button's "menu" option is set, then it sets the needed listeners on the button.
     *
     * We don't set listeners on the menu until _getMenu() is called on the first launch,
     * so that the menu needn't be inited before the button.
     */
    _setupMenuButton: function(oldMenuOption) // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        if ( this.options.menu && this.element.is("input")) // both push and toggle buttons based on <input>
            throw new Error("Menu Button functionality is not supported on input elements.");

        this._removeMenuBehavior(oldMenuOption);

        if ( this.options.menu )
        {
            var self = this;
            this.element
                .attr("aria-haspopup", true)
                .on( "keydown" + this.menuEventNamespace, function( event ) {
                    if (event.which === $.ui.keyCode.DOWN)
                    {
                        self._showMenu(event, "firstItem");
                        event.preventDefault();
                        return true;
                    } else if (event.which === $.ui.keyCode.ESCAPE)
                    {
                        var bubbleEscUp = self._checkMenuParent(self.rootElement);
						self._dismissMenu(self.options.menu, event);
                        return bubbleEscUp;
//						return false;
                    }

                    return true;
                })
                .on( "click" + this.menuEventNamespace, function( event ) {
                    //console.log("mb click handler");
                    var menu = self._getMenu();
                    if (!menu.__spaceEnterDownInMenu)
                    {
                        // console.log("mb click handler showing menu");
                        // Ideally a click (Enter/Space) would toggle (open/close) the menu without moving focus to it, per WAI-ARIA.
                        // But on IE, JAWS is not recognizing the menu on click/Enter/Space.
                        // Workaround for this, cleared with A11y team, is to move focus to menu like DownArrow. Ref .
                        self._showMenu(event, "firstItem");
                    }
                    menu.__spaceEnterDownInMenu = false;
                    event.preventDefault();
                    return true;
                });
        }
    },

	_checkMenuParent: function(element) {

		// 1st approach: Check closest parent.
/*
		var idx, bubbleUp = false,
			parentsToCheck = ['oj-dialog', 'oj-popup']; // Dialog and Popup class names

		// 1st approach: Check closest parent.
		if(!(element.hasClass('oj-selected'))) {
			for( idx in parentsToCheck) {
				if(element.closest('.'+parentsToCheck[idx]).hasClass(parentsToCheck[idx])) {
					bubbleUp = true;
					break;
				}
			}
		}
		return bubbleUp;
*/

		// 2nd approach: Do not check any closest parent (more generic).
		 return !(element.hasClass('oj-selected'));
	},

    /*
     * This method removes menuButton functionality from the button and specified menu
     *
     * param menuOption - a current or previous value of the "menu" option
     */
    _removeMenuBehavior: function(menuOption) { // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        this.element
            .removeAttr( "aria-haspopup" )
            .off( this.menuEventNamespace );

        this._dismissMenu(menuOption);

        // access menu elem directly, rather than using _getMenuOnly(menuOption).widget(), so listener is cleared even if component no longer exists.
        $(menuOption).off( this.menuEventNamespace );
        this._menuListenerSet = false;
    },

    /*
     * Lazy getter for the menu.  It finds the menu instance pointed to by the "menu" option, registers menuButton listeners on it, and returns the menu.
     *
     * This method should be called only by the "user is launching the menu" listeners, which should only be registered if the "menu" option is set.  Do not call at create time.
     *
     * We wait until menu-launch time to lazily get and configure the menu, to avoid an init-order dependency.  It should be OK to init the button before the menu.
     *
     * This method throws if no Menu found, which is app error since Menu should be inited by the time a user launches the menu.
     *
     * (Do NOT return null just because button is disabled, since that would mean disabled menuButtons lose their dropdown arrow, and possibly other problems.)
     */
    _getMenu: function() { // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        // The JET Menu of the first element found.
        // Per architect discussion, get it every time rather than caching the menu.
        var menu = this._getMenuOnly(this.options.menu); 

        // if no element found, or if element has no JET Menu
        if (!menu)
            throw new Error('JET Button: "menu" option specified, but does not reference a valid JET Menu.');

        if (!this._menuListenerSet) {        
            var self = this;

            // must use "on" syntax rather than clobbering whatever "close" handler the app may have set via the menu's "option" syntax
            menu.widget().on( "ojclose" + this.menuEventNamespace, function( event, ui ) {
                self._menuDismissHandler(event);
            });
            this._menuListenerSet = true;
        }

        return menu;
    },

    /*
     * Returns the JET Menu of the (first) element specified by the menuOption param, which should be a (current or old) 
     * value of the menu option.  Returns null if no element found, or if element has no JET Menu.
     * 
     * Most callers should call _getMenu instead, as _getMenuOnly() performs no init, and doesn't throw if no menu found.
     * This method is suitable as a helper for _getMenu, or (say) to close an open menu (which isn't needed if menu is already gone).
     * 
     * If you need the menu's *element* (not component), then it's better to call $(foo) than 
     * menu=this._getMenuOnly(foo); elem=menu && menu.widget(),
     * since $(foo) works when the element is found but its component is not (and is more efficient).
     * 
     * If you need the menu's element *and* component, and should throw if they're missing, then just call 
     * menu=this._getMenu(); elem=menu.widget(),
     */
    _getMenuOnly: function(menuOption) { // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        // Call instance() since need to access non-public Menu api's like __dismiss()
        var constructor = oj.Components.getWidgetConstructor($(menuOption)[0], "ojMenu");
        return constructor && constructor("instance");
    },

    /*
     * Shows the menuButton menu if there is one and we're not disabled.
     *
     * MenuButton types:
     * - We support menuButtons on push buttons based on <button> and <a>.
     *     - Architects require that we support menuButtons on at least some types of push buttons.
     *       I.e. if checkbox-based menuButtons were supported, it would not be OK for that to be the only type that's supported.
     * - <input type=button|submit|reset> work fine using the same code path as <button> and <a>, but architects approved proposal
     *   not to support them for following reasons:
     *     - submit/reset menubuttons are semantically / behaviorally absurd.
     *     - these types don't support icons, i.e. the dropdown icon.
     *     - reduces exposure to issues like we had for checkboxes, without sacrificing anything since these flavors were undesirable
     *       for menuButton use anyway.
     *  - Radios are inappropriate for menuButtons.  Alternate clicks should open and close the menu, with corresponding visual
     *    feedback from button, but radios are idempotent: they stay pressed on repeated clicks.
     *  - Architects approved proposal not to support checkboxes for following reasons:
     *      - Checkbox-based menuButtons were considered a bit odd, and we had zero requirements for it.
     *      - The only thing they buy anyone is the checked state corresponding to the menu-open state, but there are several ways for
     *        apps to find out if the menu is open, e.g. check its "hidden" status, check whether the oj-selected class is present, etc.
     *      - They proved to be somewhat brittle, with *different* event-ordering problems in each browser.  Even if we spent the time
     *        to fix it, they could still be a source of problems later, which didn't seem worth it for a flavor no one wanted.
     *
     * param event required
     * param focus required
     */
    _showMenu: function(event, focus) // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        if (this._IsEffectivelyDisabled())
            return;

        // No need to fire click event, since not appropriate for DownArrow, and already fired for user click.

        var menu = this._getMenu();
        var menuElem = menu.widget();
        menu.open(event, {"launcher": this.element, "initialFocus": focus});

        // bail if launch was cancelled by a beforeOpen listener
        if (!menuElem.is(":visible")) 
            return;

        this._menuVisible = true;

        // If menu has neither aria-label nor aria-labelledby after menu.open() calls the beforeOpen listeners, then set aria-labelledby
        // referencing the menu button, and remove it when the menu is closed.  This approach provides a useful default while allowing 
        // the menu to be shared by several launchers.
        if (!menuElem.attr("aria-label") && !menuElem.attr("aria-labelledby")) {
            this.element.uniqueId(); // add id if not already there
            this._setAriaLabelledBy = true;
            menuElem.attr("aria-labelledby", this.element.attr("id"));
        }

        // Per UX requirements, menuButtons should look pressed/checked iff the menu is open:
        // - For push buttons, per architectural review, just add/remove oj-selected even though it's a push button.
        //     - Per a11y review, that's fine, but do NOT apply aria-pressed to push buttons, which would turn it into a toggle button for AT users.  He said that
        //       would just confuse things, and that the visual pressed-in look was just eye candy in this case, not semantics that we need to show to AT users.
        // - If checkbox menuButtons were supported, obviously we'd toggle the pressed look by checking/unchecking the button, which in turn would toggle oj-selected.
        //   In that case, we'd fire DOM checked event (right?) and if wrapped in Buttonset, update its checked option and fire optionChange event.
        //ER 19167450
        //calling open on a already open menu now first dismisses it.  the button
        //dismissal handler removes the "oj-select" style.  move the logic that sets
        //the oj-select to after the menu is open.
        this.rootElement.addClass( "oj-selected" )
                        .removeClass( "oj-default oj-focus-only" );
    },

    /*
     * Dismisses the menuButton menu if *we* launched it
     *
     * param menuOption required.  An old or current value of the menu option, indicating which menu to close.
     * param event optional.  Pass iff dismissing due to UI event.
     */
    _dismissMenu: function(menuOption, event) // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        // this._menuVisible is set iff *we* launched the menu.  If *something else* launched it, don't dismiss it.
        if (this._menuVisible)
        {
            // Doesn't throw if menu not found. Something is likely wrong in that case, but don't sweat it unless they try to *launch* an MIA menu.
            var menu = this._getMenuOnly(menuOption); 
            if (menu) {
                // TODO: this should be called by __dismiss(), rather than the caller having to call this too.
                menu.__collapseAll( event, true ); // close open submenus before hiding the popup so that submenus will not be shown on reopen
                
                menu.__dismiss(event); // causes _menuDismissHandler(event) to be called
            }
        }
    },

    /*
     * Handles menu dismissals, whether or not we dismissed it ourselves.
     * See comments on similar code in _showMenu().
     *
     * Also called by the beforeOpen listener we put on the menu, *if* the launch was by something else,
     * including our own context menu.  So if something steals our menu, we deselect the button.
     *
     * param event must remain optional, since some callers of _dismissMenu have no event
     */
    _menuDismissHandler: function(event) // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        if (this._setAriaLabelledBy) {
            $(this.options.menu).removeAttr("aria-labelledby");
            this._setAriaLabelledBy = false;
        }

        //console.log(this.options.label + ": button._menuDismissHandler called");
        // Since only push buttons are supported for menu buttons, the only reason for .oj-selected to be present is if it's an open menu button,
        // so we remove the class since the menu is being dismissed.
        this.rootElement.removeClass( "oj-selected" );
        this._toggleDefaultClasses();

        this._menuVisible = false;
    },

    /*
     * Let the "state classes" be oj-active, oj-disabled, oj-selected, oj-hover, and oj-focus.
     * This method ensures that the root element has:
     *   - the oj-default class iff it has none of the state classes, and
     *   - the oj-focus-only class iff it has oj-focus but no other state classes.
     * Note that oj-focus-highlight should never be present without oj-focus, so there's no need to check for that separately.
     */
    _toggleDefaultClasses: function()
    {
        var otherStates = this.rootElement.is( ".oj-hover, .oj-active, .oj-selected, .oj-disabled" );
        var defaultState, focusedOnly;

        if (otherStates) {
            defaultState = false;
            focusedOnly = false;
        } else {
            var focused = this.rootElement.is( ".oj-focus" );
            defaultState = !focused;
            focusedOnly = focused;
        }

        this.rootElement.toggleClass( "oj-default", defaultState );
        this.rootElement.toggleClass( "oj-focus-only", focusedOnly );
    }

    // API doc for inherited methods with no JS in this file:

    /**
     * Removes the button functionality completely. This will return the element back to its pre-init state.
     *
     * <p>This method does not accept any arguments.
     *
     * @method
     * @name oj.ojButton#destroy
     * @memberof oj.ojButton
     * @instance
     *
     * @example <caption>Invoke the <code class="prettyprint">destroy</code> method:</caption>
     * $( ".selector" ).ojButton( "destroy" );
     */
    
    // Fragments:

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
     *     <tr>
     *       <td>Toggle Button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Toggle the button.</td>
     *     </tr>
     *     <tr>
     *       <td>Menu Button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Open the menu.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <p>See also the [Menu]{@link oj.ojMenu} touch gesture doc.
     * 
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojButton
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
     *       <td><kbd>Enter</kbd> or <kbd>Space</kbd>*</td>
     *       <td>Push the button.</td>
     *     </tr>
     *     <tr>
     *       <td>Toggle Button</td>
     *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
     *       <td>Toggle the button.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="2">Menu Button</td>
     *       <td><kbd>Enter</kbd>, <kbd>Space</kbd>*, or <kbd>DownArrow</kbd></td>
     *       <td>Open the menu.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Esc</kbd></td>
     *       <td>Close the menu.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <p>* Buttons based on anchor elements support <kbd>Enter</kbd>, not <kbd>Space</kbd>.
     *
     * <p>See the [Menu]{@link oj.ojMenu} keyboard doc for keystrokes that apply when focus is on the menu.
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojButton
     */
});

/**
 * @ojcomponent oj.ojButtonset
 * @augments oj.baseComponent
 * @since 0.6
 *
 * @classdesc
 * <h3 id="buttonsetOverview-section">
 *   JET Buttonset Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonsetOverview-section"></a>
 * </h3>
 *
 * <p>Description: Themeable, WAI-ARIA-compliant visual and semantic grouping container for [JET Buttons]{@link oj.ojButton}.
 *
 * <p>The JET Buttonset component can be used to group related buttons, such as a group of radios or checkboxes.  Buttonset provides
 * visual and semantic grouping and WAI-ARIA-compliant focus management.
 *
 * <p>When a Buttonset is created or refreshed, it creates JET Buttons out of all contained DOM elements supported by JET Button
 * that are not already Buttons, by calling <code class="prettyprint">.ojButton()</code> on them.
 *
 * <p>A buttonset that contains radios should contain all radios in the radio group.  Checkboxes and radios in the buttonset should specify the
 * <code class="prettyprint">value</code> attribute, since the <code class="prettyprint">checked</code> option refers to that attribute.
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
 * <h3 id="keyboard-appdev-section">
 *   Keyboard Application Developer Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-appdev-section"></a>
 * </h3>
 *
 * <p>The application should not do anything to interfere with the Buttonset's focus management, such as setting the <code class="prettyprint">tabindex</code>
 * of the buttons.  Also, enabled buttons should remain user-visible, without which arrow-key navigation to the button would cause the focus to seemingly disappear.
 *
 * <p>The buttonset's focus management should be turned off when placing the buttonset in a [JET Toolbar]{@link oj.ojToolbar}.  See the <code class="prettyprint">focusManagement</code> option.
 * In this case, the "Keyboard End User Information" documented above is superseded by the Toolbar's documented keyboard behavior.
 *
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>As shown in the online demos, the application is responsible for applying <code class="prettyprint">aria-label</code> and/or
 * <code class="prettyprint">aria-controls</code> attributes like the following to the buttonset element, if applicable per the instructions that follow:
 *
 * <pre class="prettyprint">
 * <code>aria-label="Choose only one beverage."
 * aria-controls="myTextEditor"
 * </code></pre>
 *
 * <p>An <code class="prettyprint">aria-label</code> conveying the "choose only one" semantics should be included for a buttonset consisting of a radio group.
 *
 * <p>The <code class="prettyprint">aria-controls</code> attribute should be included if the buttonset is controlling something else on the page, e.g.
 * bold / italic / underline buttons controlling a rich text editor.  If the buttonset is contained in a toolbar, <code class="prettyprint">aria-controls</code>
 * should be placed on the toolbar, not on the buttonsets within the toolbar.
 *
 * <p>Disabled content: JET supports an accessible luminosity contrast ratio,
 * as specified in <a href="http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">WCAG 2.0 - Section 1.4.3 "Contrast"</a>,
 * in the themes that are accessible.  (See the "Theming" chapter of the JET Developer Guide for more information on which
 * themes are accessible.)  Note that Section 1.4.3 says that text or images of text that are part of an inactive user
 * interface component have no contrast requirement.  Because disabled content may not meet the minimum contrast ratio
 * required of enabled content, it cannot be used to convey meaningful information.<p>
 *
 *
  * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 * 
 * 
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Class(es)</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>oj-buttonset-width-auto</td>
 *       <td>Forces Buttonset Buttons' widths to be determined by the total width of their icons and label contents, overriding any theming defaults. Can be applied on Buttonset, or on an ancestor such as Toolbar or document. Optionally, specify the overall width of the Buttonset for further width control.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-buttonset-width-equal</td>
 *       <td>Forces Buttonset Buttons' widths to be equal, overriding any theming defaults. Can be applied on Buttonset, or on an ancestor such as Toolbar or document. Note that the overall width of the Buttonset defaults to 100%; set the max-width (recommended) or width of the Buttonset for further width control.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 *
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * <p>The only supported way to set the reading direction (LTR or RTL) is to set the <code class="prettyprint">"dir"</code> attribute on the
 * <code class="prettyprint">&lt;html></code> element of the page.  As with any JET component, in the unusual case that the reading direction
 * is changed post-create, the buttonset must be <code class="prettyprint">refresh()</code>ed, or the page must be reloaded.
 *
 *
 * <h3 id="pseudos-section">
 *   Pseudo-selectors
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
 * </h3>
 *
 * <p>The <code class="prettyprint">:oj-buttonset</code> pseudo-selector can be used in jQuery expressions to select JET Buttonsets.  For example:
 *
 * <pre class="prettyprint">
 * <code>$( ":oj-buttonset" ) // selects all JET Buttonsets on the page
 * $myEventTarget.closest( ":oj-buttonset" ) // selects the closest ancestor that is a JET Buttonset
 * </code></pre>
 *
 *
 * <h3 id="binding-section">
 *   Declarative Binding
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#binding-section"></a>
 * </h3>
 *
 * <p>For components like Buttonset and Menu that contain a number of like items, applications may wish to use a <code class="prettyprint">foreach</code> Knockout binding
 * to stamp out the contents.  This binding cannot live on the same node as the JET <code class="prettyprint">ojComponent</code> binding, and must instead live on a nested
 * virtual element as follows:
 *
 * <pre class="prettyprint">
 * <code>&lt;div id="drinkset" aria-label="Choose only one beverage."
 *      data-bind="ojComponent: {component: 'ojButtonset', checked: drink}">
 *     &lt;!-- ko foreach: drinkRadios -->
 *         &lt;label data-bind="attr: {for: id}">&lt;/label>
 *         &lt;input type="radio" name="beverage"
 *                data-bind="value: id, attr: {id: id},
 *                           ojComponent: { component: 'ojButton', label: label }"/>
 *     &lt;!-- /ko -->
 * &lt;/div>
 * </code></pre>
 *
 *
 * <h3 id="jqui2jet-section">
 *   JET for jQuery UI developers
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#jqui2jet-section"></a>
 * </h3>
 *
 * <ol>
 *   <li>All JQUI and JET components inherit <code class="prettyprint">disable()</code> and <code class="prettyprint">enable()</code> methods from the base class.  This API
 *       duplicates the functionality of the <code class="prettyprint">disabled</code> option.  In JET, to keep the API as lean as possible, we
 *       have chosen not to document these methods outside of this section.</li>
 *   <li>JQUI Buttonset has an undocumented <code class="prettyprint">items</code> option allowing apps to get and set the selector used by Buttonset to find all its
 *       buttonizable descendants.  This option has been removed in JET, as we do not want this to be settable.</li>
 *   <li>The focus management functionality is new in JET.</li>
 *   <li>JET Buttonset's [disabled]{@link oj.ojButtonset#disabled} option effectively disables its Buttons without affecting their <code class="prettyprint">disabled</code>
 *       options.</li>
 * </ol>
 *
 * <p>Also, event names for all JET components are prefixed with "oj", instead of component-specific prefixes like "buttonset" or "menu".
 * E.g. the JQUI <code class="prettyprint">buttonsetcreate</code> event is <code class="prettyprint">ojcreate</code> in JET, as shown in the doc for that event.
 * Reason:  This makes the API more powerful.  It allows apps to listen to "foo" events from <em>all</em> JET components via:
 *
 * <pre class="prettyprint">
 * <code>$( ".selector" ).on( "ojfoo", myFunc);
 * </code></pre>
 *
 * or to "foo" events only from JET Buttonsets (the JQUI functionality) via:
 *
 * <pre class="prettyprint">
 * <code>$( ".selector" ).on( "ojfoo", ":oj-buttonset", myFunc);
 * </code></pre>
 *
 *
 * <!-- - - - - Above this point, the tags are for the class.
 *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
 *
 *
 * @desc Creates a JET Buttonset.
 *
 * @param {Object=} options a map of option-value pairs to set on the component
 *
 * @example <caption>Initialize the buttonset with no options specified:</caption>
 * $( ".selector" ).ojButtonset();
 *
 * @example <caption>Initialize the buttonset with some options and callbacks specified:</caption>
 * $( ".selector" ).ojButtonset( { "disabled": true, "create": function( event, ui ) {} } );
 *
 * @example <caption>Initialize the buttonset via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div id="beverages" data-bind="ojComponent: { component: 'ojButtonset',
 *                                               disabled: true,
 *                                               create: setupButtonset }">
 */
oj.__registerWidget("oj.ojButtonset", $['oj']['baseComponent'],
{
    // private.  Was an undocumented JQUI option, which we removed, so I moved from options to here and added underscore.  Leave unquoted so gets renamed by GCC as desired.
    _items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a",

    widgetEventPrefix : "oj",

    options: // options is in externs.js.  TODO: same as other prototype fields.
    {
        /**
         * The <code class="prettyprint">checked</code> option indicates which radio or checkboxes in the Buttonset are selected.
         * It corresponds to the <code class="prettyprint">value</code> attribute of those elements, which should always be set.
         *
         * <p>If this Buttonset consists of a single radio group, and no other buttons, then <code class="prettyprint">checked</code>
         * is a string equal to the <code class="prettyprint">value</code> attribute of the checked radio.  The option is
         * <code class="prettyprint">null</code> if and only if no radio is selected.  Thus, an n-radio group has n+1 valid
         * <code class="prettyprint">checked</code> values: the n radio values, and <code class="prettyprint">null</code> .
         *
         * <p>If this Buttonset consists of one or more checkboxes, and no other buttons, then <code class="prettyprint">checked</code> is
         * a possibly empty, non-<code class="prettyprint">null</code> string array containing the <code class="prettyprint">value</code>
         * attributes of the checked checkboxes.  This array has "set", not "list", semantics; i.e. order is neither important nor guaranteed.
         * Thus, an n-checkbox set has 2^n valid <code class="prettyprint">checked</code> values: the 2^n possible subsets of n checkboxes.
         *
         * <p>In all other cases, <code class="prettyprint">checked</code> is <code class="prettyprint">null</code>.
         *
         * <p>After create time, the <code class="prettyprint">checked</code> state should be set via this API, not by setting the underlying DOM attribute.
         *
         * <p>The 2-way <code class="prettyprint">checked</code> binding offered by the <code class="prettyprint">ojComponent</code> binding
         * should be used instead of Knockout's built-in <code class="prettyprint">checked</code> or <code class="prettyprint">attr</code> bindings,
         * as the former sets the API, while the latter two set the underlying DOM attribute.
         *
         * <p>It's still possible for the <code class="prettyprint">checked</code> option and DOM to get out of synch by other means.  
         * In this case, the app is responsible for updating the <code class="prettyprint">checked</code> option.  A typical case is 
         * when the set of Buttons contained in the Buttonset changes, possibly due to a Knockout binding, in which case the app must first call 
         * <code class="prettyprint">refresh</code> (as in all cases when the DOM changes underneath a component), and then  
         * update the <code class="prettyprint">checked</code> option to the desired value.
         *
         * <p>Often there is no need to listen for this event, since the <code class="prettyprint">ojComponent</code>
         * <code class="prettyprint">checked</code> binding, discussed above, will update the bound observable whenever the
         * <code class="prettyprint">checked</code> state changes.  The declarative binding is often preferable to an explicit listener.
         *
         * <p>A click listener should not be used to detect changes to the <code class="prettyprint">checked</code> state.
         * The <code class="prettyprint">ojComponent</code> <code class="prettyprint">checked</code> binding and/or
         * the <code class="prettyprint">optionChange</code> event should be used instead.
         *
         * @expose
         * @memberof oj.ojButtonset
         * @instance
         * @type {?string|Array.<string>|undefined}
         * @default If not initially set, is initialized to reflect the initial DOM state
         *
         * @example <caption>Initialize a buttonset with the <code class="prettyprint">checked</code> option specified:</caption>
         * // radio
         * $( ".selector" ).ojButtonset( { "checked": "tea" } );
         *
         * // checkbox
         * $( ".selector" ).ojButtonset( { "checked": ["bold", "italic"] } );
         *
         * @example <caption>Get or set the <code class="prettyprint">checked</code> option, after initialization:</caption>
         * // getter
         * var display = $( ".selector" ).ojButtonset( "option", "checked" );
         *
         * // radio setter
         * $( ".selector" ).ojButtonset( "option", "checked", "tea" );
         *
         * // checkbox setter
         * $( ".selector" ).ojButtonset( "option", "checked", ["bold", "italic"] );
         */
        checked: null,

        /** 
         * <p>Indicates in what states the buttonset's buttons have chrome (background and border).  
         * 
         * <p>A buttonset's chroming must be set by setting this buttonset option (or setting the [chroming]{@link oj.ojToolbar#chroming} option 
         * of a containing toolbar), rather than setting the [chroming]{@link oj.ojButton#chroming} option on each of its buttons.
         * 
         * <p>This option only affects buttons that have never had their own <code class="prettyprint">chroming</code> option set.  This allows 
         * individual buttons to opt out of their buttonset's chroming if needed.  Note, however, that built-in themes expect all buttons in a 
         * buttonset to share the same chroming.
         * 
         * <p>Thus, in built-in themes, the <code class="prettyprint">chroming</code> option of buttons in a buttonset must either be unset 
         * (recommended) or set to the same value as the buttonset's <code class="prettyprint">chroming</code> option.
         * 
         * <p>The default chroming varies by theme and containership as follows:
         * <ul>
         *   <li>If the buttonset is in a toolbar, then the default chroming is the current value of the toolbar's [chroming]{@link oj.ojToolbar#chroming} option.</li>
         *   <li>Else, if <code class="prettyprint">$buttonsetChromingOptionDefault</code> is set in the current theme as seen in the example below, then that value is the chroming default.</li>
         *   <li>Else, the default chroming is <code class="prettyprint">"full"</code>.</li>
         * </ul>
         * 
         * <p>Once a value has been set on this buttonset option, that value applies regardless of theme and containership.
         * 
         * @expose
         * @memberof oj.ojButtonset
         * @instance
         * @since 1.2.0
         * 
         * @type {string}
         * @ojvalue {string} "full" In typical themes, full-chrome buttons always have chrome.
         * @ojvalue {string} "half" In typical themes, half-chrome buttons acquire chrome only in their hover, active, and selected states. Half-chroming is recommended for buttons in a toolbar.  
         *     (This is the toolbar default in most themes.)
         * @ojvalue {string} "outlined" In typical themes, outlined buttons are similar to half-chrome buttons, but have a border in the default state.
         * @default Varies by theme and containership as detailed above.
         *
         * @example <caption>Initialize the buttonset with the <code class="prettyprint">chroming</code> option specified:</caption>
         * $( ".selector" ).ojButtonset( { "chroming": "half" } );
         *
         * @example <caption>Get or set the <code class="prettyprint">chroming</code> option, after initialization:</caption>
         * // getter
         * var display = $( ".selector" ).ojButtonset( "option", "chroming" );
         *
         * // setter
         * $( ".selector" ).ojButtonset( "option", "chroming", "full" );
         * 
         * @example <caption>Set the default in the theme (SCSS) :</caption>
         * $buttonsetChromingOptionDefault: half !default;
         */
        chroming: "full",

        /**
         * <p>Setting the Buttonset's <code class="prettyprint">disabled</code> option effectively disables all its Buttons, without affecting
         * their <code class="prettyprint">disabled</code> options.  Thus, a Button is effectively disabled if either its own
         * <code class="prettyprint">disabled</code> option is set, or the Buttonset's <code class="prettyprint">disabled</code> option is set.
         *
         * @member
         * @name disabled
         * @memberof oj.ojButtonset
         * @instance
         * @type {boolean}
         * @default <code class="prettyprint">false</code>
         *
         * @example <caption>Initialize the buttonset with the <code class="prettyprint">disabled</code> option specified:</caption>
         * $( ".selector" ).ojButtonset( { "disabled": true } );
         *
         * @example <caption>Get or set the <code class="prettyprint">disabled</code> option, after initialization:</caption>
         * // getter
         * var disabled = $( ".selector" ).ojButtonset( "option", "disabled" );
         *
         * // setter
         * $( ".selector" ).ojButtonset( "option", "disabled", true );
         */
        // disabled option declared in superclass, but we still want the above API doc

        // Blake wants us to consider getting rid of this option in the future.  Under his proposal (whose particulars we agreed needed to be ironed out),
        // rather than using this option to turn off Bset's handling, Bset would always handle arrow keys and preventDefault or stopPropagation.  Arrow
        // keys would no longer wrap around when reach end of Bset, in which case Bset would let the event bubble up to Toolbar (or to whoever if
        // not in a TB).  Any edge cases?  e.g. with tabstops, TB contents with special arrow-key behavior like inputTexts, etc.?
        /**
         * The <code class="prettyprint">focusManagement</code> option should be set to <code class="prettyprint">"none"</code> when the
         * Buttonset is placed in a [JET Toolbar]{@link oj.ojToolbar}.  This allows the Toolbar to manage the focus with no interference from the Buttonset,
         * so that arrow keys move within the entire Toolbar, not just within the Buttonset.
         *
         * @expose
         * @memberof oj.ojButtonset
         * @instance
         * @type {string}
         * @ojvalue {string} "oneTabstop" Focus management is enabled.  The Buttonset is a single tabstop with arrow-key navigation.
         * @ojvalue {string} "none" Focus management is disabled, to avoid interfering with the focus management of a containing component.
         * @default <code class="prettyprint">"oneTabstop"</code>
         *
         * @example <caption>Initialize the buttonset with the <code class="prettyprint">focusManagement</code> option specified:</caption>
         * $( ".selector" ).ojButtonset( { "focusManagement": "none" } );
         *
         * @example <caption>Get or set the <code class="prettyprint">focusManagement</code> option, after initialization:</caption>
         * // getter
         * var display = $( ".selector" ).ojButtonset( "option", "focusManagement" );
         *
         * // setter
         * $( ".selector" ).ojButtonset( "option", "focusManagement", "none" );
         */
        focusManagement: "oneTabstop"

        // Events

        /**
         * Triggered when the buttonset is created.
         *
         * @event
         * @name create
         * @memberof oj.ojButtonset
         * @instance
         * @property {Event} event <code class="prettyprint">jQuery</code> event object
         * @property {Object} ui Currently empty
         *
         * @example <caption>Initialize the buttonset with the <code class="prettyprint">create</code> callback specified:</caption>
         * $( ".selector" ).ojButtonset({
         *     "create": function( event, ui ) {}
         * });
         *
         * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
         * $( ".selector" ).on( "ojcreate", function( event, ui ) {
         *     // verify that the component firing the event is a component of interest
         *     if ($(event.target).is(".mySelector")) {}
         * });
         */
        // create event declared in superclass, but we still want the above API doc
    },

    // If this is a radio or checkbox buttonset, and the specified checked value is valid,
    //   then sets it on the buttons' checked properties in the DOM,
    // Else if it's the non-radio, non-checkbox case and null was passed, which is the one and only valid value for that case,
    //   then doesn't change DOM.
    // Else it's an invalid value,
    //   so throws.
    // Does not set oj-selected, so must call _applyCheckedStateFromDom() after this.
    //   TBD: optionally, this method could do that work, perhaps controlled by a param
    // This method is called by _setOption("checked", ...) and _ComponentCreate > _setup.
    // Does NOT require the buttons to already be JET Buttons (useful for _setup caller).
    _setCheckedOnDom: function(checked, $buttons) // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        var type = $.type(checked);
        var valid, allCheckboxes;

        if (type === "null" || type === "array")
        {
            // whether buttonset contains exclusively checkboxes
            allCheckboxes = $buttons.filter("input[type=checkbox]").length === $buttons.length;
        }

        if (allCheckboxes && type === "null")
        {
            // null not a valid value for checkbox set.  This is case (c2) below.
            throw new Error("Invalid 'checked' value set on JET Buttonset: " + checked);
        }

        if (type === "string" || type === "null")
        {
            // Cases when it's string or null:
            // (a) Radio: *all* buttons are radios in same group, and that the checked value to be set is null or matches one of the radio values.
            // Result:  Set on DOM.
            // (b) Not a set:  Buttonset is neither a radioset nor checkboxset, and checked is null, the only valid value.
            // Result:  Nothing to set on DOM.
            // (c) Invalid:  Throw.  Cases:
            //     (c1) Radio group, and the checked value is non-null and doesn't match any of the radio values.
            //     (c2) Checkboxset, checked is null, which is invalid.  Already bailed out for this case above.
            //     (c3) Checkboxset, checked is string, which is invalid.
            //     (c4) Not a set, and checked is not null.

            // before setting DOM for *any* buttons, verify that it's Case (a).
            var name = $buttons[0].name;
            var validRadios = (name || $buttons.length<=1) // if name is "" and there's >1 radio, then they're in separate radio groups
                && $buttons.filter("input[type=radio][name=" + name + "]").length === $buttons.length
                && (checked===null || $buttons.filter("[value=" + checked + "]").length);

            if ( validRadios ) // Case (a)
            {
                $buttons.each(function() {
                    this.checked = (this.value === checked);
                });
            }

            // validRadios true iff case (a).  (checked===null) is true for (a), (b), and (c2), but we already bailed out for (c2) above.
            // so this says "valid if (a) or (b)"
            valid = validRadios || checked===null;
        } else if (type === "array") // only valid for a checkbox set
        {
            // Before setting any buttons, verify that the checked value to be set is valid:
            // Verify that all buttons are checkboxes, since is array.
            // Then, in a sorted copy of the array (concat makes a copy), verify no dupes and
            // that all entries are values in the buttonset
            var last;
            valid = allCheckboxes && checked.concat().sort().every(function(elem, index, array) {
                var retVal = elem !== last && $buttons.filter("[value=" + elem + "]").length;
                last = elem;
                return retVal;
            });

            if (valid)
            {
                $buttons.each(function() {
                    this.checked = (checked.indexOf(this.value) > -1);
                });
            }
        } else
        {
            // value is invalid (not the right type for *any* kind of buttonset)
            valid = false;
        }

        if (!valid)
            throw new Error("Invalid 'checked' value set on JET Buttonset: " + checked);
    },

    // if all buttons are radios with same group, returns value attr of selected radio (string), or null if none selected
    // else if all buttons are checkboxes, returns non-null, possibly empty string array containing values of selected checkboxes
    // else returns undefined.  In the API we use null, not undefined, for this case, so callers should map undefined to null before setting on DOM.
    // NOTE: Called from _InitOptions, so very limited component state is available!
    _getCheckedFromDom: function($buttons) // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        var checked = undefined;
        var isRadio = null;
        var name = null;

        $buttons.each(function(index) {
            // at this point, all previous buttons, if any, were all radios in same group, or were all checkboxes
            var tagName = this.tagName.toLowerCase();
            if (tagName !== "input")
            {
                checked = undefined;
                return false; // stop iterating
            }

            var currentType = this.type.toLowerCase();
            var currentIsRadio;
            var currentName;

            if (currentType === "radio"){
                currentIsRadio = true;
                currentName = this.name.toLowerCase();
            } else if (currentType === "checkbox")
            {
                currentIsRadio = false;
                currentName = null;
            } else
            {
                checked = undefined;
                return false; // stop iterating
            }

            // at this point, current button is input of type radio or checkbox

            // If this is not the first button, then bail if:
            // - this is a radio and previous were checkboxes or vice versa
            // - this is a radio in a different group than previous ones, which can happen
            //   if the group names are different, or if the names are all "", in which
            //   case each radio is in a separate radio group.
            if ( (checked !== undefined) // must be !== not !=
                 && ( currentIsRadio !== isRadio
                      || currentName !== name
                      || (isRadio && !name) ) )
            {
                checked = undefined;
                return false; // stop iterating
            }

            // at this point, all buttons so far including this one are either all radios in same group, or are all checkboxes

            if (checked === undefined) // this is first button
            {
                checked = currentIsRadio
                    ? this.checked ? this.value : null
                    : this.checked ? [this.value] : [];
                isRadio = currentIsRadio;
                name = currentName;
            } else if (this.checked)
            {
                if (isRadio)
                    checked = this.value;
                else
                    checked.push(this.value);
            } // else not first button and not checked, so leave "checked" at whatever value we set on previous iteration
        });

        return checked;
    },

    _CompareOptionValues: function(option, value1, value2) // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
      if (option === 'checked')
      {
        // handle null, string, and (rare) identically equal arrays
        if (value1 === value2)
            return true;
        else // handle arrays.  order needn't be same
            return $.type(value1) === "array" && $.type(value2) === "array"
                   && this._compareArraysAsSets(value1, value2);
      }

      return this._superApply(arguments);
    },

    // Params must be arrays.  Returns true iff the arrays have the same set of elements regardless of order.
    _compareArraysAsSets: function(first, second) {
        return !first.some(function (elem) {
            return second.indexOf(elem)<0;
        }) && !second.some(function (elem) {
            return first.indexOf(elem)<0;
        });
    },

    _InitOptions: function(originalDefaults, constructorOptions) {
        this._super(originalDefaults, constructorOptions);

        this.$buttons = this.element.find( this._items );

        // At create time, checked can be set via either option or DOM, i.e. the "checked" properties of the buttons.
        // If app set the option, then that wins over the DOM, in which case _ComponentCreate() will later set that value on the DOM.
        // Else DOM wins, in which case we set the option from the DOM here, with any remaining tasks done later in _ComponentCreate().

        if (!('checked' in constructorOptions)) // if app didn't set option, then set the option from the DOM
        {
            this.initCheckedFromDom = true;
            var checked = this._getCheckedFromDom(this.$buttons); // doesn't rely on any component state, e.g. this.foo

            // 3 cases:  (1) checkbox set, (2) radio group, and (3) none of the above.
            // Conceptually, the default value is [] for (1), and null for (2) and (3).
            // However, the value to which it's actually inited, in the declaration, is null in all 3 cases.
            //
            // Per discussion with architect, we want to update the option value in all cases where it's different than the
            // init value of null, but only fire the event if the new value is different than the conceptual default.
            //
            // The only problem case is when the new value is [], "no checkboxes checked".  To avoid firing the event in this
            // case, while still handling all other cases correctly, we update the ivar to [], the conceptual default,
            // for all checkbox / array cases, before calling option().
            //
            // Writeback is not relevant here, since this code block handles the case where no option value was supplied, in
            // which case there must not be an observable to write to.
            if ($.type(checked) === "array")
                this.options.checked = [];

            if (checked !== undefined)
                this.option("checked", checked,  {'_context': {internalSet: true}}); // writeback not needed since "not in constructorOptions" means "not bound"
        }
    },

    _ComponentCreate: function()
    {
        this._super();

        this.element
            .attr(oj.Components._OJ_CONTAINER_ATTR, this['widgetName'])
            .addClass( "oj-buttonset oj-component" )
        this._setRole(this.options.focusManagement);

        this._setup(true);
    },

    _NotifyContextMenuGesture: function(menu, event, eventType)
    {
        // Set launcher to the current tabbable button
        // For toggle buttons, launcher must be the hidden focusable input, but for Shift-F10 we want the CM aligned to the Button's root element, not that 
        // hidden input.  This is no change from the default for push buttons, since in that case the root element and launcher (input) are the same.
        var currentButton = this.element.find(":oj-button[tabindex=0]");
        this._OpenContextMenu(event, eventType, {
            "launcher": currentButton, 
            "position": {"of": eventType==="keyboard" ? currentButton.ojButton("widget") : event}
        });
},

    _propagateDisabled: function( disabled ) {
        disabled = !!disabled;
        this.$buttons.each(function() {
            $( this ).data( "oj-ojButton" ).__setAncestorComponentDisabled(disabled);
        });
    },

    _setRole: function(focusManagement)
    {
        if (focusManagement === "oneTabstop")
            this.element.attr( "role", "toolbar" );
        else
            this.element.removeAttr( "role" );
    },

    _setOption: function( key, value, flags ) // Override of protected base class method.  Method name needn't be quoted since is in externs.js.
    {
        // previously called super at end, so that optionChange (fired at end of super) is fired at very end, but now must call at start, so that 
        // when the chroming case calls Button.refresh(), callee sees the new value of the option.
        this._superApply( arguments );

        if ( key === "disabled" )
            this._propagateDisabled( value );
        else if ( key === "checked" )
        {
            // This "checked" block should run only if app called option(), but not if called because user clicked button,
            // since in the latter case, we know we passed a valid non-undefined value, and DOM is already up to date.
            // Fortunately, this is guaranteed, since _setOption is no longer called in the latter case.
            this._setCheckedOnDom(value, this.$buttons); // throws if checked option invalid

            // Set oj-selected on all buttons' DOM:
            this.$buttons.each(function() {
                $( this ).data( "oj-ojButton" )._applyCheckedStateFromDom(false);
            });
        } else if ( key === "focusManagement" ) {
            this._setRole(value);
        } else if ( key === "chroming" ) {
            _setChromingClass(this.element, value);
            
            // refresh the buttons to make them re-fetch their chroming option, in case it's still set to the default dynamic getter, 
            // which takes its value from the containing buttonset or toolbar if present.
            // TBD: Consider only calling refresh() on children that haven't had their chroming option set, i.e. those still using the dynamic getter.
            this.$buttons.ojButton( "refresh" );
        }
    },

    // TODO: JSDoc says: "refresh() is required ... after a change to the disabled status of any of the buttons in the buttonset."  Instead, shouldn't 
    // Button._setOption("disabled") look for a containing Buttonset and do the necessary housekeeping?
    /**
     * Refreshes the buttonset, including the following:
     *
     * <ul>
     *   <li>Creates JET Buttons out of all contained DOM elements supported by JET Button that are not already Buttons, by calling <code class="prettyprint">ojButton()</code> on them.</li>
     *   <li>Re-applies focus management / keyboard navigation.</li>
     *   <li>Applies special styles to the first and last button of the buttonset (e.g. for rounded corners, depending on theming).</li>
     *   <li>Rechecks the reading direction (LTR vs. RTL).</li>
     * </ul>
     *
     * <p>A <code class="prettyprint">refresh()</code> is required in the following circumstances:
     * <ul>
     *   <li>After buttons are added to, removed from, or reordered within the buttonset.</li>
     *   <li>After the buttonset is reparented from inside a toolbar to a location that's not in a toolbar.</li>
     *   <li>After a change to the [disabled]{@link oj.ojButton#disabled} status of any of the buttons in the buttonset.</li>
     *   <li>After the reading direction (LTR vs. RTL) changes.</li>
     * </ul>
     *
     * @expose
     * @memberof oj.ojButtonset
     * @instance
     *
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * $( ".selector" ).ojButtonset( "refresh" );
     */
    refresh: function() // Override of public base class method (unlike JQUI).  Method name needn't be quoted since is in externs.js.
    {
        this._super();

        // Call this after _super(), which updates the list of containers (toolbar) that the buttonset is in, which must be updated 
        // when _setup calls the chroming option getter.
        this._setup(false);
    },

    _setup: function(isCreate) // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        var self = this;
        this.isRtl = this._GetReadingDirection() === "rtl";
        _setChromingClass(this.element, this.options.chroming);

        if (isCreate)
        {
            if (!this.initCheckedFromDom) {
                // if app provided a "checked" option, it wins over whatever's in the DOM.
                this._setCheckedOnDom(this.options.checked, this.$buttons); // throws if checked option invalid
            }

            // At create time, whether set from DOM or option, checked option and checked props are now in synch, so we just need to
            // set .oj-selected on each button.  This is done below by either the _applyCheckedStateFromDom()
            // call (for existing buttons) or the initializer call (for new buttons).
        } else { // it's refresh time.
            // If the DOM's checked state is out of synch with the checked option, it's either because
            // the app directly set the "checked" attr of an existing Button in the Buttonset, which we don't support (they should
            // have used the component API instead), or the set of buttons in the set has changed (possibly because a KO foreach
            // binding added/removed buttons).  In the latter case, we require that the app update the "checked" option, by setting
            // the bound observable (if present) or calling option() (otherwise).

            this.$buttons = this.element.find( this._items ); // only needed at refresh time, since at create time this was already done in _InitOptions()
        }

        // buttonset styling should only be applied if this is a multi-button buttonset.  When a single button is wrapped in a buttonset, that's an implementation
        // detail to get the "checked" option; users still see it as a standalone button, and it should be themed as such.
        this.element.toggleClass("oj-buttonset-multi", this.$buttons.length>1);

        this.$buttons
            // refresh any buttons underneath us that already exist, like JQUI does
            // TBD:  Now that Bset has a checked option, the recursive refreshing of the Bset's buttons is necessary in more cases than before.
            //   Review whether it's still desirable to add a refresh() param that would allow turning off this recursive
            //   refreshing.  That was previously approved, but changing the default (compared to JQUI) was not approved.
            //   The refresh param wouldn't help for creates; for that we'd need to add a Buttonset option.
            //   See also _destroy() code comment.
            .filter( ":oj-button" )
                .ojButton( "refresh" )
                .each(function() {
                    $( this ).data( "oj-ojButton" )._applyCheckedStateFromDom(false); // set .oj-selected
                })
            .end()

            // Create buttons underneath us
            .not( ":oj-button" )
                .ojButton() // sets .oj-selected
            .end()

            // Update rounded corners, etc.
            .map(function() {
                return $( this ).ojButton( "widget" )[ 0 ];
            })
                .removeClass( "oj-buttonset-first oj-buttonset-last" )
                .filter( ":first" )
                    .addClass( "oj-buttonset-first" )
                .end()
                .filter( ":last" )
                    .addClass( "oj-buttonset-last" )
                .end()
            .end();

        // Must do this after creating the buttons above since callee calls Button API.
        // Must do this before the focus mgmt code, which needs to know which buttons are effectively disabled.
        // Must do this at refresh time, not just create time, in case new buttons were added to the Bset (whether
        // reparented or created e.g. by KO foreach).
        this._propagateDisabled( this.options.disabled );

        if (this.options.focusManagement==="oneTabstop")
        {
            // When buttonset is binding listeners to buttons, use the Buttonset's eventNamespace, not the Button's
            // eventNamespace, to facilitate later unbinding only the Buttonset listeners.

            // For checkbox/radio, we're binding to inputs, not labels.

            // Put listeners on every button, b/c it's too unreliable to put them on the buttonset node and rely on event bubbling.
            // - E.g. bubbling doesn't work for antonym buttons (is this still true after the refactoring?) -- see comment on Button._setLabelOption().
            // - Likewise, focus mgmt can't just break if app listener stops propagation.
            // - Both of these problems still happen when using the delegation / selector overload of .on(); there is no special JQ bubbling magic.

            this.$buttons
                .unbind( "keydown" + this.eventNamespace )
                .bind( "keydown" + this.eventNamespace, function(event) {
                    self._handleKeyDown(event, $(this));
                })

                .unbind( "click" + this.eventNamespace )
                .bind( "click" + this.eventNamespace, function(event) {
                    if ( !$( this ).data( "oj-ojButton" )._IsEffectivelyDisabled() )
                    {
                        // Normally the button will be tabbable after the click, since (a) if we reach here, the clicked button is enabled, and
                        // (b) an unchecked radio before the click will normally be checked after the click.  But just in case it's unchecked
                        // (e.g. due to app listener), we let callee run it thru _mapToTabbable() before using, as usual.
                        self._setTabStop( $(this) );
                    }
                })
                .unbind( "focus" + this.eventNamespace )
                .bind( "focus" + this.eventNamespace, function(event) {
                    self._setTabStop( $(this) );
                });

            // the subset of Buttonset buttons that are enabled.  Effectively disabled buttons are not tabbable.
            this.$enabledButtons = this.$buttons.filter(function(index) {
                return !$( this ).data( "oj-ojButton" )._IsEffectivelyDisabled();
            });

            this._initTabindexes(isCreate);
        }
    },

    // For create, make only the first enabled button tabbable.  (We decided to have Shift-Tab go to first, not last, button.)
    // For refreshes, keep the existing tabstop if we can, otherwise proceed as with create.
    // Either way, if that button is a radio and some radio in its group is checked, make that one tabbable instead.
    // If there are no enabled buttons, makes them all untabbable.
    // No return value.
    _initTabindexes: function(isCreate) // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        // even for refreshes where we'll wind up keeping the same tabstop, must make everything untabbable first, to ensure any new buttons become untabbable.
        var $last = $(this._lastTabStop);
        this._lastTabStop = undefined;
        this.$buttons.attr( "tabindex", "-1" );
        var $newTabStop; // callee might map this to radio groupmate

        // TBD: for refreshes when $last is an effectively disabled radio with a checked enabled groupmate and they are in the buttonset, the groupmate would be
        // a valid tabstop, but this defaults to the first.
        if (isCreate || !$last.is(this.$enabledButtons))
        {
            // is create, or is refresh but must treat like create b/c $last is empty, or not enabled, or no longer in the buttonset
            $newTabStop = this.$enabledButtons.first(); // if empty (none enabled), no tabstop will be set
        } else
        {
            // is a refresh, and $last is non-empty and is an enabled button still in the buttonset.  May be a radio whose groupmate
            // has become checked, in which case callee will map it to that groupmate.
            $newTabStop = $last;
        }
        this._setTabStop( $newTabStop );
    },

    // For each button in $button (in our usage always 0-1 button hence $button singular), if that button is an unchecked radio
    // with a checked groupmate (which means it's not tabbable), then map it to the checked one (checked enabled radios are
    // tabbable, and we know it's enabled per the argument below).
    //
    // $button contains 0 or more buttons to map.  Must be enabled since effectively disabled buttons aren't tabbable.
    // Returns the mapped JQ object (which the caller will make the tabstop).
    //
    // We know that this.$enabledButtons contains all buttons in $button, and all of their potentially checked radio-groupmates, since:
    // - The above "enabled" requirement guarantees that $button's contents are all in $enabledButtons.
    // - The prohibition against radio groupmates that are not in the buttonset, and the prohibition against checked disabled groupmates
    //   of enabled radios, guarantee that if $button is a radio, then all of its potentially checked groupmates are enabled and thus in
    //   $enabledButtons.
    //
    // Firefox browser issue:   (TODO: should we doc this?  File FF and/or JET bug?)
    //
    // When this method maps an unchecked radio to its checked groupmate, the caller ensures that the former still has focus, but the latter
    // is the tabstop for when the user tabs out and back in.  When tabbing / Shift-Tabbing from the unchecked radio in the direction of the
    // checked one, Chrome and IE9 are smart enough to tab out of the radio group to the adjacent tabstop as desired.  But in FF, focus goes to
    // the checked one, which is not what we want.
    //
    // Reason: Chrome and IE9 are smart enough never to tab within a radio group.  If focus is in the radio group, Tab and Shift-Tab exit the radio group.
    // But in FF, [a radio is reachable via Tab/Shift-Tab from within the group] if [it's enabled, tabindex != -1, and either checked or has no
    // checked groupmates], i.e. [it would be reachable via Tab/Shift-Tab from outside the group if all its groupmates happened to be untabbable
    // (e.g. disabled)].  In other words, FF is the only one that fails to distinguish between radios that could be valid tabstops from outside, and
    // those that should be valid tabstops from inside.
    //
    // This impl improves on the native behavior.  In FF, in an unchecked radio group, every single radio is a tabstop.  Our use of tabindex=-1
    // guarantees that we never tab within the group in that case.  It's only a checked groupmate that can be tabbed to from within. (So at
    // most one unwanted tabstop.)
    //
    // After much time and effort, the latter issue seems to be infeasible to fix in any robust, non-brittle way.  E.g.:
    // - Clearing all tabstops and restoring on tab-out of buttonset:  FF provides no reliable way to find out whether a blur is exiting the entire
    //   buttonset.  The obvious setTimeout workaround needed to be unacceptably long (e.g. 250ms) and even then was unreliable.  If we ever fail
    //   to restore the tabstop, the buttonset becomes untabbable and inaccessible.
    // - Every other approach had similar robustness issues.
    _mapToTabbable: function( $button ) // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        var $enabledButtons = this.$enabledButtons;
        return $button.map(function(index, elem) {
            // Buttons other than radios, and checked radios, are always tabbable if they're enabled, which this method requires.
            // Radios w/ name="" (incl name omitted) are not in a radio group, not even with other radios with w/ name="".  Radios
            // with no groupmates are always tabbable, since either they're checked, or they're unchecked with no checked groupmate.
            if (elem.type != "radio" || elem.checked || elem.name == "")
                return elem;
            else
            {
                // elem is unchecked radio in real (not "") group, which is tabbable iff no groupmate is checked.  Per above doc, we know that
                // all of its potentially checked groupmates are in $enabledButtons.
                var $checkedRadio = _radioGroup(elem, $enabledButtons).filter(":checked");
                return ($checkedRadio.length ? $checkedRadio[0] : elem);
            }
        });
    },

    // Set which button is in the tab sequence.
    // $button should contain 0 or 1 button to be made tabbable (since at most one should be tabbable at a time).
    //   If 0 (i.e. no enabled buttons), all will become untabbable.  If 1, it must be tabbable in every way (e.g. enabled) except possibly
    //   being an unchecked radio with a checked groupmate, which this method will map to its checked groupmate, which
    //   we know is enabled thus tabbable since we require that checked radios with enabled groupmates not be disabled.
    // No return value.
    _setTabStop: function( $button ) // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
//        if (!window.setTabStopCounter) window.setTabStopCounter=1; // REMOVE, is only for console.log's
//        console.log("in _setTabStop: " + window.setTabStopCounter++ + ".  Orig (premap) button checked: " + $button[0].checked); // + " and is:");
//        console.log($button[0]);

        $button = this._mapToTabbable( $button );
        var button = $button[0]; // button is undefined iff $button is empty iff we need to clear all tabstops b/c there are no enabled buttons to make tabbable
        var last = this._lastTabStop; // last is undefined iff $(last) is empty iff there are no existing tabstops to clear (b/c _initTabindexes just ran
                                      // or previously there were no enabled buttons to make tabbable)

//        console.log("mapped button and last button are:");  console.log(button);  console.log(last);  console.log(".");

        // Cases: both are undefined: have no tabstops; want to keep it that way (b/c none enabled), so do nothing
        //        both are node X: X is the tabstop; want to keep it that way, so do nothing
        //        last is node X; button is undefined: X is the tabstop; want to clear it w/o replacing it (b/c none enabled).  This logic does that.
        //        last is undefined; button is node X: no existing tabstop; want to make X the tabstop.  This logic does that.
        //        last is node X; button is node Y: X is the tabstop; want to clear it and make Y the tabstop.  This logic does that.
        if ( button !== last) {
            //console.log("setting tab stop to " + $button.attr("id"));  console.log("$(last).length:");  console.log($(last).length);

            $(last).attr( "tabindex", "-1" ); // no-op iff $(last) is empty iff (see comment above)
            $button.attr( "tabindex", "0" ); // no-op iff $button is empty iff (see comment above)
            this._lastTabStop = button;
        }
    },

    // No return value.
    _handleKeyDown: function(event, $button) // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
    {
        switch (event.which) {
            case $.ui.keyCode.LEFT:  // left arrow
            case $.ui.keyCode.RIGHT: // right arrow
                event.preventDefault();

                var $enabledButtons = this.$enabledButtons;
                var length = $enabledButtons.length;
                if (length<2) // nowhere to navigate to; currently focused button is the only enabled one in buttonset
                    break;

                var oldIndex = $enabledButtons.index($button);
                var increment = ((event.which == $.ui.keyCode.RIGHT) ^ this.isRtl) ? 1 : -1;
                var newIndex = (oldIndex+increment+length)%length; // wrap around if at start/end of buttonset

                // A11y office recommended treating radios like other buttons: Arrow moves focus without selecting, Spacebar selects,
                // which we prefer too.  Since we're using role='button', not 'radio', we don't need to follow the WAI-ARIA radio behavior
                // where Arrow moves focus and selects, Ctrl-Arrow moves focus without selecting.
                $enabledButtons.eq(newIndex).focus();
                break;
            case $.ui.keyCode.UP:   // up arrow
            case $.ui.keyCode.DOWN: // down arrow
                // Per above comment, treating radios like buttons, which have no native or WAI-ARIA-mandated up/down arrow behavior,
                // so disable native focus-and-select behavior.
                if ( $button.attr("type")=="radio" )
                    event.preventDefault();
                break;

            // Don't need Space/Enter handlers.  For all buttons except already-checked radios in some browsers, Space/Enter fire a click event
            // (natively or manually), which already calls _setTabStop.  For checked radios (which are focused if they're getting
            // this key event), _setTabStop has already been called for whichever happened 2nd:  focus (an already checked radio) or
            // check (an already focused radio) via click/Space/Enter.  We don't support programmatically checking the button; it must
            // be done via the "checked" option.
        }
    },

    _destroy: function() // Override of protected base class method.  Method name needn't be quoted since is in externs.js.
    {
        this.element
            .removeClass( "oj-buttonset oj-component " + CHROMING_CLASSES )
            .removeAttr(oj.Components._OJ_CONTAINER_ATTR)
            .removeAttr( "role" );

        if (this.options.focusManagement==="oneTabstop")
            this.$buttons.attr( "tabindex", "0" );

        this.$buttons
            .map(function() {
                return $( this ).ojButton( "widget" )[ 0 ];
            })
                // do .removeClass outside the filter in case button has been destroyed but still has these Buttonset styles on it.
                // TBD: if this has definitely been taken care of already for destroyed buttons, then move inside filter.
                .removeClass( "oj-buttonset-first oj-buttonset-last" )
            .end()

            // Recursively destroy Bset's buttons like JQUI.
            // TBD: The recursive destroy makes it impossible to ungroup the buttons if desired, i.e. destroy the Buttonset without destroying its buttons.
            //   As discussed in _setup() code comment, it was approved to add refresh() and/or destroy() params that would allow turning off
            //   the recursive behavior, but changing the default (compared to JQUI) was not approved.
            //   When not destroying the buttons, must instead restore the buttons to a not-in-buttonset state, i.e. remove Bset stuff, restore any
            //   Button stuff we removed, etc.
            .ojButton( "destroy" );
    }

    // API doc for inherited methods with no JS in this file:

    /**
     * Returns a <code class="prettyprint">jQuery</code> object containing the root element of the Buttonset component.
     *
     * @method
     * @name oj.ojButtonset#widget
     * @memberof oj.ojButtonset
     * @instance
     * @return {jQuery} the root element of the component
     *
     * @example <caption>Invoke the <code class="prettyprint">widget</code> method:</caption>
     * var widget = $( ".selector" ).ojButtonset( "widget" );
     */

    /**
     * Removes the buttonset functionality completely, including focus management, and recursively <code class="prettyprint">destroy()</code>s
     * the contained buttons. This will return the element back to its pre-init state.
     *
     * <p>This method does not accept any arguments.
     *
     * @method
     * @name oj.ojButtonset#destroy
     * @memberof oj.ojButtonset
     * @instance
     *
     * @example <caption>Invoke the <code class="prettyprint">destroy</code> method:</caption>
     * $( ".selector" ).ojButtonset( "destroy" );
     */
    
    // Fragments:
    
    /**
     * <p>All Buttonset touch interaction is with the individual buttons.  See the [JET Button]{@link oj.ojButton} touch gesture doc.
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojButtonset
     */
    
    /**
     * <p>JET Buttonset is a single tabstop, with arrow-key navigation within the buttonset, as follows:
     *
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Key</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Navigate to the previous enabled button on the left, wrapping around at the end.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Navigate to the next enabled button on the right, wrapping around at the end.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <p>See also the [JET Button]{@link oj.ojButton} keyboard doc, for details on interacting with
     * the individual buttons.
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojButtonset
     */
});

// -----------------------------------------------------------------------------
// "private static members" shared by all buttons and buttonsets
// -----------------------------------------------------------------------------

var _lastActive;
var _lastToggleActive;

// "static" namespace for events associated with all buttons on page/form/etc., not just one.  E.g. see form reset handler at top of _ComponentCreate().
// this.eventNamespace, used for individual button instances, is .ojButtonX, whereX = 0, 1, 2, etc.
var BUTTON_EVENT_NAMESPACE = ".ojButton",

    BASE_CLASSES = "oj-button oj-component oj-enabled oj-default", // oj-enabled is a state class, but convenient to include in this var instead
    STATE_CLASSES = "oj-hover oj-active oj-selected", 
    TYPE_CLASSES = "oj-button-icons-only oj-button-icon-only oj-button-text-icons oj-button-text-icon-start oj-button-text-icon-end oj-button-text-only",
    CHROMING_CLASSES = "oj-button-full-chrome oj-button-half-chrome oj-button-outlined-chrome",

    _chromingMap = {
        "full": "oj-button-full-chrome", 
        "half": "oj-button-half-chrome", 
        "outlined": "oj-button-outlined-chrome"
    },

    // SECURITY NOTE: To avoid injection attacks, do NOT compute the class via string concatenation, i.e. don't do "oj-button-" + chroming + "-chrome"
    _setChromingClass = function( $elem, chroming )
    {
        $elem.removeClass(CHROMING_CLASSES)
             .addClass(_chromingMap[chroming]);
    },

    /**
     * In all cases, the return value includes only radios that are an :oj-button, i.e. radios that have been buttonized.
     *
     * Where this method looks for radio groupmates:
     *
     * - If $elems is present (even if empty),
     *     - This method will only look in that set, and will not attempt to weed out any false positives as defined below.
     *       (So in this case, return value includes the specified radio iff it's an :oj-button in $elems.)
     * - Else this method looks in exactly the places where groupmates (including the original radio) would live, i.e. not in
     *   the places false positives would live.  (So in both of the following cases, return value includes the specified radio
     *   iff it's an :oj-button.)  Specifically:
     *     - If radio is in a form, this method will only look in that form.
     *     - Else, this method will look in the radio's document, but not in any forms.
     *
     * Radios w/ name="" (incl name omitted) are not in a radio group (i.e. no SelectOne semantics), not even with other radios with
     * w/ name="".  So if radio is nameless, the return value will include only radio (or nothing at all if it isn't an :oj-button, or
     * if $elems is passed and it doesn't include radio).
     *
     * False positives: radios with nonempty names that match radio's name, but are actually not groupmates (i.e. no SelectOne
     * relationship), e.g. because they're from a different form.
     *
     *
     * @param {!Element} radio  a radio button.  Not a JQ object, other button or element type, or null.
     * @param {jQuery=} $elems  optional JQ object, containing 0 or more elems that aren't necessarily radios or buttons, in which to look for groupmates.
     *                          E.g. the elements in a buttonset or toolbar.  Must not contain any false positives as defined above.
     */
    _radioGroup = function( radio, $elems )
    {
        var name = radio.name,
            form = radio.form,
            $radios;
        if ( name )
        {
            name = name.replace( /'/g, "\\'" ); // escape single quotes
            var selector = ":radio[name='" + name + "']:oj-button";
            if ( $elems )
            {
                $radios = $elems.filter( selector );
            } else if ( form )
            {
                $radios = $( form ).find( selector );
            } else
            {
                $radios = $( selector, radio.ownerDocument )
                    .filter(function() {
                        return !this.form;
                    });
            }
        } else
        {
            $radios = ($elems ? $elems.filter( radio ) : $( radio )).filter(":oj-button");
        }
        return $radios;
    },

    // searches actualContainers array for each elem of interestingContainers in order, until one is found, 
    // walks up the tree to find that container, and returns its widget constructor.  Returns null if no containers found.
    _findContainer = function( element, actualContainers, interestingContainers )
    {
        for (var i=0; i<interestingContainers.length; ++i) {
            var containerName = interestingContainers[i];
            if (actualContainers.indexOf(containerName) >= 0) {
                // walk up parents until find the container
                for (; ; element = element.parentNode) {
                    var func = oj.Components.getWidgetConstructor(element, containerName);
                    if (func) {
                        return func;
                    }
                }
            }
        }
        return null;
    },

    _interestingContainers = {
        "button":    ["ojButtonset", "ojToolbar"], 
        "buttonset": ["ojToolbar"]
    },

    _getChromingDefault = function( componentName, element, actualContainers )
    {
        var containerConstructor = _findContainer(element, actualContainers, _interestingContainers[componentName]);
    
        // If the component is in an interesting container (buttonset or toolbar), then the default chroming is the current value of the chroming option of the nearest such container.
        if (containerConstructor) {
            return containerConstructor("option", "chroming");
        } else {
            // Else, if $___ChromingOptionDefault is set in the current theme, then this expr returns that value for use as the chroming default.
            // Else, returns undefined, so that the prototype default is used.
            return (oj.ThemeUtils.parseJSONFromFontFamily('oj-' + componentName + '-option-defaults') || {})["chroming"];
        }
    };

// Set theme-based defaults
oj.Components.setDefaultOptions({
    'ojButton': {
        'chroming': oj.Components.createDynamicPropertyGetter( function(context) {
            return _getChromingDefault("button", context["element"], context["containers"]);
         })
    },
    'ojButtonset': {
        'chroming': oj.Components.createDynamicPropertyGetter( function(context) {
            return _getChromingDefault("buttonset", context["element"], context["containers"]);
        })
    }
});

}() ); // end of Button / Buttonset wrapper function

(function() {
var ojButtonMeta = {
  "properties": {
    "chroming": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean"
    },
    "display": {
      "type": "string"
    },
    "icons": {
      "type": "Object"
    },
    "label": {
      "type": "string"
    },
    "menu": {
      "type": "string"
    }
  },
  "methods": {
    "destroy": {},
    "refresh": {},
    "widget": {}
  },
  "extension": {
    "_hasWrapper": true,
    "_innerElement": 'button',
    "_widgetName": "ojButton"
  }
};
oj.Components.registerMetadata('ojButton', 'baseComponent', ojButtonMeta);
oj.Components.register('oj-button', oj.Components.getMetadata('ojButton'));
})();

(function() {
var ojToggleButtonMeta = {
  "properties": {
    "chroming": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean"
    },
    "display": {
      "type": "string"
    },
    "icons": {
      "type": "Object"
    },
    "label": {
      "type": "string"
    },
    "menu": {
      "type": "string"
    }
  },
  "methods": {
    "destroy": {},
    "refresh": {},
    "widget": {}
  },
  "extension": {
    "_hasWrapper": true,
    "_defaultAttrs": {'type': 'checkbox'},
    "_innerElement": 'input',
    "_widgetName": "ojButton"
  }
};
oj.Components.registerMetadata('ojToggleButton', 'baseComponent', ojToggleButtonMeta);
oj.Components.register('oj-toggle-button', oj.Components.getMetadata('ojToggleButton'));
})();

(function() {
var ojButtonsetMeta = {
  "properties": {
    "checked": {
      "type": "string|Array<string>"
    },
    "chroming": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean"
    },
    "focusManagement": {
      "type": "string"
    }
  },
  "methods": {
    "destroy": {},
    "refresh": {},
    "widget": {}
  },
  "extension": {
    "_widgetName": "ojButtonset"
  }
};
oj.Components.registerMetadata('ojButtonset', 'baseComponent', ojButtonsetMeta);
oj.Components.register('oj-buttonset', oj.Components.getMetadata('ojButtonset'));
})();
});
