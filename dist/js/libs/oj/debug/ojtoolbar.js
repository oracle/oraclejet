/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore'], 
      
       function(oj, $)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

(function() { // Toolbar wrapper function, to keep "private static members" private

/**
 * @ojcomponent oj.ojToolbar
 * @augments oj.baseComponent
 * @since 0.6
 * 
 * @classdesc
 * <h3 id="toolbarOverview-section">
 *   JET Toolbar Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#toolbarOverview-section"></a>
 * </h3>
 * 
 * <p>Description: Themeable, WAI-ARIA-compliant toolbar component.
 * 
 * <p>The JET Toolbar component can contain [JET Buttons]{@link oj.ojButton}, [JET Buttonsets]{@link oj.ojButtonset}, and non-focusable content 
 * such as separator icons.  Toolbar provides WAI-ARIA-compliant focus management.
 * 
 * <p>A toolbar that contains radios should contain all radios in the radio group.
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
 * <p>Any buttonsets placed in the toolbar should have <code class="prettyprint">focusManagement</code> set to <code class="prettyprint">"none"</code>, 
 * so as not to compete with the toolbar's focus management.  
 * 
 * <p>The application should not do anything to interfere with the Toolbar's focus management, such as setting the <code class="prettyprint">tabindex</code> 
 * of the buttons.  Also, enabled buttons should remain user-visible, without which arrow-key navigation to the button would cause the focus to 
 * seemingly disappear.
 * 
 * 
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * 
 * <p>JET Toolbar takes care of focus management, as noted above.  
 * 
 * <p>As shown in the online demos, the application is responsible for applying <code class="prettyprint">aria-label</code> and/or 
 * <code class="prettyprint">aria-controls</code> attributes to the toolbar element, if applicable per the instructions that follow:
 * 
 * <p>If this toolbar is (or might be) placed in context with other toolbars, then the application should apply an 
 * <code class="prettyprint">aria-label</code> to the toolbar element to distinguish it, e.g. an "Edit" toolbar.  The 
 * <code class="prettyprint">aria-label</code> is optional when there is only one toolbar.
 * 
 * <p>If the toolbar is controlling something else on the page, e.g. bold / italic / underline buttons controlling a rich 
 * text editor, then the application should apply an <code class="prettyprint">aria-controls</code> attribute to the toolbar element, 
 * e.g. <code class="prettyprint">aria-controls="myTextEditor"</code>.
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
 * <p>The following CSS classes can be applied by the page author as needed.
 * 
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Class</th>
 *       <th>Can be applied to</th>
 *       <th>Use</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>oj-toolbar-separator</td>
 *       <td>A span in the toolbar serving as an accessible toolbar separator</td>
 *       <td>Separators should be placed around any buttonsets in the toolbar, and anywhere else in the toolbar that 
 *           a separator is desirable.  Use the following markup for accessibility:
 *           <pre class="prettyprint">
 *           <code>&lt;span role="separator" aria-orientation="vertical" class="oj-toolbar-separator"></span>
 *           </code></pre>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>oj-toolbar-top-border</td>
 *       <td>Toolbar's root element, or the oj-toolbars element</td>
 *       <td>Applies a top border to the toolbar, or to the oj-toolbars element, in themes not having this border by default.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-toolbar-bottom-border</td>
 *       <td>Toolbar's root element, or the oj-toolbars element</td>
 *       <td>Applies a bottom border to the toolbar, or to the oj-toolbars element, in themes not having this border by default.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-toolbar-no-chrome</td>
 *       <td>Toolbar's root element, or the oj-toolbars element</td>
 *       <td>Removes "chrome" (background and border) from the toolbar(s), in themes having this chrome by default.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-toolbars</td>
 *       <td>An outer div representing a multiple toolbar layout</td>
 *       <td>Contains one or more oj-toolbar-row elements.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-toolbar-row</td>
 *       <td>Child divs of the oj-toolbars element</td>
 *       <td>Each oj-toolbar-row div is a row containing one or more toolbars.</td>
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
 * is changed post-create, the toolbar must be <code class="prettyprint">refresh()</code>ed, or the page must be reloaded. 
 * 
 * 
 * <h3 id="pseudos-section">
 *   Pseudo-selectors
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
 * </h3>
 * 
 * <p>The <code class="prettyprint">:oj-toolbar</code> pseudo-selector can be used in jQuery expressions to select JET Toolbars.  For example:
 * 
 * <pre class="prettyprint">
 * <code>$( ":oj-toolbar" ) // selects all JET Toolbars on the page
 * $myEventTarget.closest( ":oj-toolbar" ) // selects the closest ancestor that is a JET Toolbar
 * </code></pre>
 * 
 * 
 * <h3 id="binding-section">
 *   Declarative Binding
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#binding-section"></a>
 * </h3>
 * 
 * <p>For components like Toolbar and Menu that contain a number of like items, applications may wish to use a <code class="prettyprint">foreach</code> Knockout binding 
 * to stamp out the contents.  This binding cannot live on the same node as the JET <code class="prettyprint">ojComponent</code> binding, and must instead live on a nested 
 * virtual element as follows:
 * 
 * <pre class="prettyprint">
 * <code>&lt;div id="myToolbar"
 *      data-bind="ojComponent: {component: 'ojToolbar'}">
 *     &lt;!-- ko foreach: myButtons -->
 *         &lt;button data-bind="attr: {id: id}, 
 *                            ojComponent: { component: 'ojButton', label: label }">
 *         &lt;/button>
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
 * </ol>
 * 
 * <p>Also, event names for all JET components are prefixed with "oj", instead of component-specific prefixes like "toolbar" or "menu".  
 * E.g. if JQUI had a toolbar component, and if it followed the usual pattern, then it would have a <code class="prettyprint">toolbarcreate</code> 
 * event, while JET's is called <code class="prettyprint">ojcreate</code>, as shown in the doc for that event.
 * Reason:  This makes the API more powerful.  It allows apps to listen to "foo" events from <em>all</em> JET components via:
 * 
 * <pre class="prettyprint">
 * <code>$( ".selector" ).on( "ojfoo", myFunc);
 * </code></pre>
 * 
 * or to "foo" events only from JET Toolbars (the JQUI functionality) via:
 * 
 * <pre class="prettyprint">
 * <code>$( ".selector" ).on( "ojfoo", ":oj-toolbar", myFunc);
 * </code></pre>
 * 
 * 
 * <!-- - - - - Above this point, the tags are for the class.
 *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
 * 
 * 
 * @desc Creates a JET Toolbar.
 * 
 * @param {Object=} options a map of option-value pairs to set on the component
 * 
 * @example <caption>Initialize the toolbar with no options specified:</caption>
 * $( ".selector" ).ojToolbar();
 * 
 * @example <caption>Initialize the toolbar with a callback specified:</caption>
 * $( ".selector" ).ojToolbar( { "create": function( event, ui ) {} } );
 * 
 * @example <caption>Initialize the toolbar via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div id="beverages" data-bind="ojComponent: { component: 'ojToolbar', 
 *                                               create: setupToolbar }">
 */
oj.__registerWidget("oj.ojToolbar", $['oj']['baseComponent'], {
    widgetEventPrefix : "oj", 

    options: { // options is in externs.js.  TODO: same as other prototype fields.
        /** 
         * <p>Indicates in what states the toolbar's buttons and buttonsets have chrome (background and border).
         * 
         * <p>This option only affects buttons and buttonsets that have never had their own <code class="prettyprint">chroming</code> option set.  This allows 
         * individual buttons and buttonsets to opt out of their toolbar's chroming if needed.  
         * 
         * <p>The default chroming varies by theme.  Each theme can set its default by setting 
         * <code class="prettyprint">$toolbarChromingOptionDefault</code> as seen in the example below.
         *
         * <p>Once a value has been set on this option, that value applies regardless of theme.
         * 
         * @expose
         * @memberof oj.ojToolbar
         * @instance
         * @since 1.2.0
         * 
         * @type {string}
         * @ojvalue {string} "full" In typical themes, full-chrome buttons always have chrome.
         * @ojvalue {string} "half" In typical themes, half-chrome buttons acquire chrome only in their hover, active, and selected states. Half-chroming is recommended for buttons in a toolbar.  
         *     (This is the toolbar default in most themes.)
         * @ojvalue {string} "outlined" In typical themes, outlined buttons are similar to half-chrome buttons, but have a border in the default state.
         * @default Varies by theme. <code class="prettyprint">"half"</code> if <code class="prettyprint">$toolbarChromingOptionDefault</code> 
         *          not specified in theme.
         *
         * @example <caption>Initialize the toolbar with the <code class="prettyprint">chroming</code> option specified:</caption>
         * $( ".selector" ).ojToolbar( { "chroming": "half" } );
         *
         * @example <caption>Get or set the <code class="prettyprint">chroming</code> option, after initialization:</caption>
         * // getter
         * var display = $( ".selector" ).ojToolbar( "option", "chroming" );
         *
         * // setter
         * $( ".selector" ).ojToolbar( "option", "chroming", "full" );
         * 
         * @example <caption>Set the default in the theme (SCSS) :</caption>
         * $toolbarChromingOptionDefault: half !default;
         */
        chroming: "half"

        /**
         * <p>JET Toolbar does not support a 
         * <code class="prettyprint">disabled</code> option.  The following 
         * one-liner can be used to disable or enable all buttons in a toolbar:
         * 
         * <pre class="prettyprint">
         * <code>$("#myToolbar").find(":oj-button").ojButton("option", "disabled", myBoolean);
         * </code></pre>
         * 
         * 
         * @member
         * @name disabled
         * @memberof oj.ojToolbar
         * @instance
         */
        // disabled option declared in superclass, but we still want the above API doc
        
        // Events
        
        /**
         * Triggered when the toolbar is created.
         *
         * @event 
         * @name create
         * @memberof oj.ojToolbar
         * @instance
         * @property {Event} event <code class="prettyprint">jQuery</code> event object
         * @property {Object} ui Empty object included for consistency with other events
         * 
         * @example <caption>Initialize the toolbar with the <code class="prettyprint">create</code> callback specified:</caption>
         * $( ".selector" ).ojToolbar({
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

    _InitOptions: function(originalDefaults, constructorOptions) {
        this._super(originalDefaults, constructorOptions);
        
        if ('disabled' in constructorOptions)
            oj.Logger.warn("Caller attempted to set the 'disabled' option on Toolbar, but Toolbar does not support the 'disabled' option.  See API doc.");
    },

    _ComponentCreate: function() {
        this._super();
        
        this.element
            .attr(oj.Components._OJ_CONTAINER_ATTR, this['widgetName'])
            .addClass( "oj-toolbar oj-component" )
            .attr( "role", "toolbar" );

        this._setup(true);
    },

    // Override to set custom launcher
    _NotifyContextMenuGesture: function(menu, event, eventType) {
        // Set launcher to the current tabbable button
        // For toggle buttons, launcher must be the hidden focusable input, but for Shift-F10 we want the CM aligned to the Button's root element, not that 
        // hidden input.  This is no change from the default for push buttons, since in that case the root element and launcher (input) are the same.
        var currentButton = this.element.find(":oj-button[tabindex=0]");
        this._OpenContextMenu(event, eventType, {
            "launcher": currentButton, 
            "position": {"of": eventType==="keyboard" ? currentButton.ojButton("widget") : event}
        });
    },

    _setOption: function( key, value ) { // Override of protected base class method.  Method name needn't be quoted since is in externs.js.
        if ( key === "disabled" ) {
            oj.Logger.warn("Caller attempted to set the 'disabled' option on Toolbar, but Toolbar does not support the 'disabled' option.  See API doc.  Ignoring the call.");
            return;
        }

        // Call super() after the "disabled" check returns, to avoid super() setting oj-disabled, etc.
        // Call it before handling chroming case, so that when that case calls refresh() on Button/Buttonset, callees see the new value of the option.
        // (Previously called super() at end, so that optionChange (fired at end of super) is fired at very end.)
        this._superApply( arguments );

        if ( key === "chroming" ) {
            // refresh the top-level buttons, and refresh the buttonsets to make them refresh their buttons, so that all toolbar buttons are refreshed.
            // Reason: to make them re-fetch their chroming option, in case it's still set to the default dynamic getter, 
            // which takes its value from the containing buttonset or toolbar if present.
            // TBD: Consider only calling refresh() on children that haven't had their chroming option set, i.e. those still using the dynamic getter.
            this.$buttonsets.ojButtonset( "refresh" );
            this.$topLevelButtons.ojButton( "refresh" );
        }
    },

    /**
     * Refreshes the toolbar, including the following:
     * 
     * <ul>
     *   <li>Re-applies focus management / keyboard navigation.
     *   <li>Rechecks the reading direction (LTR vs. RTL).
     * </ul>
     * 
     * 
     * <p>A <code class="prettyprint">refresh()</code> is required in the following circumstances:
     * <ul>
     *   <li>After buttons or buttonsets are added to, removed from, or reordered within the toolbar.</li>
     *   <li>After a change to the [disabled]{@link oj.ojButton#disabled} status of any of the buttons in the toolbar.</li>
     *   <li>After a programmatic change to the <code class="prettyprint">checked</code> status of a radio button in the toolbar
     *       (which should be done via Buttonset's [checked]{@link oj.ojButtonset#checked} option).  This applies only to radios, 
     *       not to checkboxes or push buttons.</li>
     *   <li>After the reading direction (LTR vs. RTL) changes.</li>
     * </ul>
     * 
     * <p>This method does not accept any arguments.
     * 
     * @expose 
     * @memberof oj.ojToolbar
     * @instance
     * 
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * $( ".selector" ).ojToolbar( "refresh" );
     */
    refresh: function() {
        this._super();
        this._setup(false);
    },
    
    _setup: function(isCreate) { // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        var self = this;
        this.isRtl = this._GetReadingDirection() === "rtl";
        
        // When toolbar is binding listeners to buttons, use the Toolbar's eventNamespace, not the Button's 
        // eventNamespace, to facilitate later unbinding only the Toolbar listeners.

        // For checkbox/radio, we're binding to inputs, not labels.

        // Put listeners on every button, b/c it's too unreliable to put them on the toolbar node and rely on event bubbling.
        // - E.g. bubbling doesn't work for antonym buttons (is this still true after the refactoring?) -- see comment on Button._setLabelOption().
        // - Likewise, focus mgmt can't just break if app listener stops propagation.
        // - Both of these problems still happen when using the delegation / selector overload of .on(); there is no special JQ bubbling magic.

        this.$buttons = this.element.find( ":oj-button" )
            .unbind( "keydown" + this.eventNamespace )
            .bind( "keydown" + this.eventNamespace, function(event) { 
                self._handleKeyDown(event, $(this)); 
            })
            
            .unbind( "click" + this.eventNamespace )
            .bind( "click" + this.eventNamespace, function(event) {
                if ( !$(this).ojButton("option", "disabled") ) { 
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
        
        // refresh the top-level buttons, and refresh the buttonsets to make them refresh their buttons, so that all toolbar buttons are refreshed.
        // Reason: to make them re-fetch their chroming option, in case it's still set to the default dynamic getter, 
        // which takes its value from the containing buttonset or toolbar if present.
        // TBD: Consider only calling refresh() on children that haven't had their chroming option set, i.e. those still using the dynamic getter.
        this.$buttonsets = this.element.find( ":oj-buttonset" )
            .ojButtonset( "refresh" );
        this.$topLevelButtons = this.$buttons.not( this.$buttonsets.find( ":oj-button" ) )
            .ojButton( "refresh" );

        // the subset of Toolbar buttons that are enabled.  Disabled buttons are not tabbable.
        this.$enabledButtons = this.$buttons.filter(function(index) {
            return !$( this ).ojButton( "option", "disabled" );
        });
        
        this._initTabindexes(isCreate);
    },
    
    // For create, make only the first enabled button tabbable.  (We decided to have Shift-Tab go to first, not last, button.)
    // For refreshes, keep the existing tabstop if we can, otherwise proceed as with create.
    // Either way, if that button is a radio and some radio in its group is checked, make that one tabbable instead.
    // If there are no enabled buttons, makes them all untabbable.
    // No return value.
    _initTabindexes: function(isCreate) { // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        // even for refreshes where we'll wind up keeping the same tabstop, must make everything untabbable first, to ensure any new buttons become untabbable.
        var $last = $(this._lastTabStop);
        this._lastTabStop = undefined;
        this.$buttons.attr( "tabindex", "-1" );
        var $newTabStop; // callee might map this to radio groupmate
        
        // TBD: for refreshes when $last is a disabled radio with a checked enabled groupmate and they are in the toolbar, the groupmate would be 
        // a valid tabstop, but this defaults to the first.
        if (isCreate || !$last.is(this.$enabledButtons)) {
            // is create, or is refresh but must treat like create b/c $last is empty, or not enabled, or no longer in the toolbar
            $newTabStop = this.$enabledButtons.first(); // if empty (none enabled), no tabstop will be set
        } else {
            // is a refresh, and $last is non-empty and is an enabled button still in the toolbar.  May be a radio whose groupmate
            // has become checked, in which case callee will map it to that groupmate.
            $newTabStop = $last;
        }
        this._setTabStop( $newTabStop );
    },
    
    // For each button in $button (in our usage always 0-1 button hence $button singular), if that button is an unchecked radio 
    // with a checked groupmate (which means it's not tabbable), then map it to the checked one (checked enabled radios are 
    // tabbable, and we know it's enabled per the argument below).
    // 
    // $button contains 0 or more buttons to map.  Must be enabled since disabled buttons aren't tabbable.
    // Returns the mapped JQ object (which the caller will make the tabstop).
    // 
    // We know that this.$enabledButtons contains all buttons in $button, and all of their potentially checked radio-groupmates, since:
    // - The above "enabled" requirement guarantees that $button's contents are all in $enabledButtons.
    // - The prohibition against radio groupmates that are not in the toolbar, and the prohibition against checked disabled groupmates 
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
    // - Clearing all tabstops and restoring on tab-out of toolbar:  FF provides no reliable way to find out whether a blur is exiting the entire 
    //   toolbar.  The obvious setTimeout workaround needed to be unacceptably long (e.g. 250ms) and even then was unreliable.  If we ever fail 
    //   to restore the tabstop, the toolbar becomes untabbable and inaccessible.
    // - Every other approach had similar robustness issues. 
    _mapToTabbable: function( $button ) { // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        var $enabledButtons = this.$enabledButtons;
        return $button.map(function(index, elem) {
            // Buttons other than radios, and checked radios, are always tabbable if they're enabled, which this method requires.
            // Radios w/ name="" (incl name omitted) are not in a radio group, not even with other radios with w/ name="".  Radios 
            // with no groupmates are always tabbable, since either they're checked, or they're unchecked with no checked groupmate.
            if (elem.type != "radio" || elem.checked || elem.name == "") { 
                return elem;
            } else {
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
    _setTabStop: function( $button ) { // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
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
    _handleKeyDown: function(event, $button) { // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        switch (event.which) {
            case $.ui.keyCode.LEFT:  // left arrow
            case $.ui.keyCode.RIGHT: // right arrow
                event.preventDefault();
                
                var $enabledButtons = this.$enabledButtons;
                var length = $enabledButtons.length;
                if (length<2) // nowhere to navigate to; currently focused button is the only enabled one in toolbar
                    break;
                
                var oldIndex = $enabledButtons.index($button);
                var increment = ((event.which == $.ui.keyCode.RIGHT) ^ this.isRtl) ? 1 : -1;
                var newIndex = (oldIndex+increment+length)%length; // wrap around if at start/end of toolbar
                
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
            // check (an already focused radio) via click/Space/Enter.  If checking was done programmatically (via Bset.checked option), we require a refresh().
        }
    },
    
    _destroy: function() { // Override of protected base class method.  Method name needn't be quoted since is in externs.js.
        // this entire stmt can be removed once restoreAttrs code is running.
        this.element
            .removeClass( "oj-toolbar oj-component" )
            .removeAttr(oj.Components._OJ_CONTAINER_ATTR)
            .removeAttr( "role" );
    
        // Since we're not destroying the buttons themselves, the restoreAttrs code will NOT take care of this.
        this.$buttons.attr( "tabindex", "0" ); // bsets in a toolbar should not have focusMgmt turned on, so this is OK, but should revert to orig value, not assume 0.

        // Refresh the top-level buttons, and refresh the buttonsets to make them refresh their buttons, so that all toolbar buttons are refreshed.
        // Reason: to make them re-fetch their chroming option, in case it's still set to the default dynamic getter, 
        // which takes its value from the containing toolbar, which is no longer present.
        // Call refresh *after* removing _OJ_CONTAINER_ATTR, so the buttons/sets no longer detect that they're in a toolbar.
        // TBD: Consider only calling refresh() on children that haven't had their chroming option set, i.e. those still using the dynamic getter.
        this.$buttonsets.ojButtonset( "refresh" );
        this.$topLevelButtons.ojButton( "refresh" );
    }
    
    // API doc for inherited methods with no JS in this file:

    /**
     * Returns a <code class="prettyprint">jQuery</code> object containing the root element of the Toolbar component.
     * 
     * @method
     * @name oj.ojToolbar#widget
     * @memberof oj.ojToolbar
     * @instance
     * @return {jQuery} the root element of the component
     * 
     * @example <caption>Invoke the <code class="prettyprint">widget</code> method:</caption>
     * var widget = $( ".selector" ).ojToolbar( "widget" );
     */

    /**
     * Removes the toolbar functionality completely. This will return the element back to its pre-init state, 
     * and remove the toolbar's focus management from the contained buttons.
     * 
     * <p>This method does not accept any arguments.
     * 
     * @method
     * @name oj.ojToolbar#destroy
     * @memberof oj.ojToolbar
     * @instance
     * 
     * @example <caption>Invoke the <code class="prettyprint">destroy</code> method:</caption>
     * $( ".selector" ).ojToolbar( "destroy" );
     */
    
    // Fragments:
    
    /**
     * <p>All Toolbar touch interaction is with the individual buttons.  See the [JET Button]{@link oj.ojButton} touch gesture doc.
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojToolbar
     */
    
    /**
     * <p>JET Toolbar is a single tabstop, with arrow-key navigation within the toolbar, as follows:
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
     * @memberof oj.ojToolbar
     */
});

// -----------------------------------------------------------------------------
// "private static members" shared by all toolbars: 
// -----------------------------------------------------------------------------

/**
 * This is the same as _radioGroup() in Buttonset's code, minus the code branches that toolbar's caller never reaches.
 * In the cases that toolbar's caller reaches, the behavior should be the same.  So if Buttonset and Toolbar ever share code, 
 * keep Buttonset's copy of this function for use by both components.
 * 
 * In all cases, the return value includes only radios that are an :oj-button, i.e. radios that have been buttonized.
 * 
 * Where this method looks for radio groupmates:  This method will only look in $elems, and will not attempt to weed out any 
 * false positives as defined below.  (So return value includes the specified radio iff it's an :oj-button in $elems.)
 * 
 * Radios w/ name="" (incl name omitted) are not in a radio group (i.e. no SelectOne semantics), not even with other radios with 
 * w/ name="".  So if radio is nameless, the return value will include only radio (or nothing at all if it isn't an :oj-button, or 
 * if $elems doesn't include radio).  
 * 
 * False positives: radios with nonempty names that match radio's name, but are actually not groupmates (i.e. no SelectOne 
 * relationship), e.g. because they're from a different form.
 * 
 * 
 * @param {!Element} radio  a radio button.  Not a JQ object, other button or element type, or null.
 * @param {jQuery=} $elems  optional JQ object, containing 0 or more elems that aren't necessarily radios or buttons, in which to look for groupmates.
 *                          E.g. the elements in a buttonset or toolbar.  Must not contain any false positives as defined above.
 */
var _radioGroup = function( radio, $elems ) {
    var name = radio.name,
        $radios;
    if ( name ) {
        name = name.replace( /'/g, "\\'" ); // escape single quotes
        var selector = ":radio[name='" + name + "']:oj-button";
        $radios = $elems.filter( selector );
    } else {
        $radios = $elems.filter(radio).filter(":oj-button");
    }
    return $radios;
};

}() ); // end of Toolbar wrapper function


// Set theme-based defaults
oj.Components.setDefaultOptions({
    // same Q as for Button: does this correctly handle the case where the theme has no $var, in which case we want there to effectively be no dynamic getter so that the prototype default is used?
    'ojToolbar': {
        'chroming': oj.Components.createDynamicPropertyGetter( function(context) {
            return (oj.ThemeUtils.parseJSONFromFontFamily('oj-toolbar-option-defaults') || {})["chroming"];
        })
    }
});
(function() {
var ojToolbarMeta = {
  "properties": {
    "chroming": {
      "type": "string"
    },
    "disabled": {}
  },
  "methods": {
    "destroy": {},
    "refresh": {},
    "widget": {}
  },
  "extension": {
    "_widgetName": "ojToolbar"
  }
};
oj.Components.registerMetadata('ojToolbar', 'baseComponent', ojToolbarMeta);
oj.Components.register('oj-toolbar', oj.Components.getMetadata('ojToolbar'));
})();
});
