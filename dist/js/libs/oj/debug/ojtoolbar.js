/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'jquery', 'ojs/ojthemeutils', 'ojs/ojcomponentcore', 'ojs/ojlogger'], function (oj, $, ThemeUtils, Components, Logger) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

  (function () {
    // Toolbar wrapper function, to keep "private static members" private
    /**
     * @ojcomponent oj.ojToolbar
     * @ojdisplayname Toolbar
     * @augments oj.baseComponent
     * @ojrole toolbar
     * @since 0.6.0
     * @ojshortdesc A toolbar displays a strip of control elements such as buttons and menu buttons, often grouped by separators.
     *
     * @ojpropertylayout {propertyGroup: "common", items: ["chroming"]}
     * @ojvbdefaultcolumns 12
     * @ojvbmincolumns 2
     *
     * @ojoracleicon 'oj-ux-ico-toolbar'
     * @ojuxspecs ['toolbar']
     *
     * @classdesc
     * <h3 id="toolbarOverview-section">
     *   JET Toolbar
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#toolbarOverview-section"></a>
     * </h3>
     *
     * <p>Description: Themeable, WAI-ARIA-compliant toolbar element.
     *
     * <pre class="prettyprint"><code>&lt;oj-toolbar id="myToolbar">
     *     &lt;oj-button id="myButton">
     *          &lt;span>My Button&lt;/span>
     *     &lt;/oj-button>
     * &lt;/oj-toolbar>
     * </code></pre>
     *
     * <p>The JET Toolbar can contain [JET Buttons]{@link oj.ojButton}, [JET Menu Buttons]{@link oj.ojMenuButton}, [JET Buttonsets]{@link oj.ojButtonset}, and non-focusable content
     * such as separator icons.  Toolbar provides WAI-ARIA-compliant focus management.
     *
     * <p>A toolbar that contains radios should contain all radios in the radio group.
     *
     * <p>Multiple toolbars can be laid out as a set using the <a href="ToolbarSets.html#oj-toolbars">.oj-toolbars</a>
     * and <a href="ToolbarSets.html#oj-toolbar-row">.oj-toolbar-row</a> style classes.
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
     * <p>The application is responsible for applying <code class="prettyprint">aria-label</code> and/or
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
     *
     * <p>Disabled content: JET supports an accessible luminosity contrast ratio,
     * as specified in <a href="http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">WCAG 2.0 - Section 1.4.3 "Contrast"</a>,
     * in the themes that are accessible.  (See the "Theming" chapter of the JET Developer Guide for more information on which
     * themes are accessible.)  Note that Section 1.4.3 says that text or images of text that are part of an inactive user
     * interface component have no contrast requirement.  Because disabled content may not meet the minimum contrast ratio
     * required of enabled content, it cannot be used to convey meaningful information.</p>
     *
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
     * <h3 id="binding-section">
     *   Declarative Binding
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#binding-section"></a>
     * </h3>
     *
     * <p>For elements like Toolbar and Menu that contain a number of like items, applications may wish to use <code class="prettyprint">oj-bind-for-each</code>
     * to stamp out the contents as follows:
     *
     * <pre class="prettyprint">
     * <code>&lt;oj-toolbar id="myToolbar">
     *     &lt;oj-bind-for-each data="[[myButtons]]">
     *         &lt;template>
     *             &lt;oj-button :id="[[$current.data.id]]">
     *                 &lt;span>
     *                     &lt;oj-bind-text value="[[$current.data.label]]">&lt;/oj-bind-text>
     *                 &lt;/span>
     *             &lt;/oj-button>
     *         &lt;/template>
     *     &lt;/oj-bind-for-each>
     * &lt;/oj-toolbar>
     * </code></pre>
     *
     */

    // API doc for inherited methods with no JS in this file:
    /**
     * Returns a <code class="prettyprint">jQuery</code> object containing the root element of the Toolbar component.
     *
     * @method
     * @name oj.ojToolbar#widget
     * @memberof oj.ojToolbar
     * @instance
     * @ignore
     * @return {jQuery} the root element of the component
     */

    /**
     * Removes the toolbar functionality completely. This will return the element back to its pre-init state,
     * and remove the toolbar's focus management from the contained buttons.
     *
     * @method
     * @name oj.ojToolbar#destroy
     * @memberof oj.ojToolbar
     * @instance
     * @ignore
     */

    //-----------------------------------------------------
    //                   Slots
    //-----------------------------------------------------
    /**
     * <p>The &lt;oj-toolbar> element accepts <code class="prettyprint">oj-button</code>, <code class="prettyprint">oj-buttonset-many</code>,
     * <code class="prettyprint">oj-buttonset-one</code>, <code class="prettyprint">oj-menu-button</code> and non-focusable content such as separator icon elements as children.</p>
     *
     * @ojchild Default
     * @memberof oj.ojToolbar
     * @ojpreferredcontent ["ButtonElement","ButtonsetManyElement","ButtonsetOneElement","MenuButtonElement"]
     *
     * @example <caption>Initialize the Toolbar with child content specified:</caption>
     * &lt;oj-toolbar>
     *   &lt;oj-button>Button Text 1&lt;/oj-button>
     *   &lt;span role="separator" aria-orientation="vertical" class="oj-toolbar-separator">&lt;/span>
     *   &lt;oj-button>Button Text 2&lt;/oj-button>
     *   &lt;span role="separator" aria-orientation="vertical" class="oj-toolbar-separator">&lt;/span>
     *   &lt;oj-button>Button Text 3&lt;/oj-button>
     * &lt;/oj-toolbar>
     */

    //-----------------------------------------------------
    //                   Fragments
    //-----------------------------------------------------
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

    //-----------------------------------------------------
    //                   Styling
    //-----------------------------------------------------

    // ---------------- oj-toolbar-separator --------------
    /**
     * Separators should be placed around any buttonsets in the toolbar, and anywhere else in the toolbar that a separator is desirable. <br/>
     * For accessibility, additionally apply role and aria-orientation as shown.
     * @ojstyleclass oj-toolbar-separator
     * @ojdisplayname Separator
     * @ojstyleselector "oj-toolbar span"
     * @memberof oj.ojToolbar
     * @ojtsexample
     * &lt;oj-toolbar id="myToolbar" aria-label="Foo" aria-controls="bar">
     *   &lt;oj-button ...>&lt;/oj-button>
     *   &lt;span role="separator" aria-orientation="vertical" class="oj-toolbar-separator">&lt;/span>
     *   &lt;oj-button ...>&lt;/oj-button>
     * &lt;/oj-toolbar>
     */
    // ---------------- oj-toolbar-top-border --------------
    /**
     * Applies a top border to the toolbar, or to the oj-toolbars element, in themes not having this border by default.
     * @ojstyleclass oj-toolbar-top-border
     * @ojdisplayname Top Border
     * @memberof oj.ojToolbar
     * @ojtsexample
     * &lt;oj-toolbar id="myToolbar" aria-label="Foo" aria-controls="bar" class="oj-toolbar-top-border">
     *   &lt;oj-button ...>&lt;/oj-button>
     *   &lt;span role="separator" aria-orientation="vertical" class="oj-toolbar-separator">&lt;/span>
     *   &lt;oj-button ...>&lt;/oj-button>
     * &lt;/oj-toolbar>
     */
    // ---------------- oj-toolbar-bottom-border --------------
    /**
     * Applies a bottom border to the toolbar, or to the oj-toolbars element, in themes not having this border by default.
     * @ojstyleclass oj-toolbar-bottom-border
     * @ojdisplayname Bottom Border
     * @memberof oj.ojToolbar
     * @ojtsexample
     * &lt;oj-toolbar id="myToolbar" aria-label="Foo" aria-controls="bar" class="oj-toolbar-bottom-border">
     *   &lt;oj-button ...>&lt;/oj-button>
     *   &lt;span role="separator" aria-orientation="vertical" class="oj-toolbar-separator">&lt;/span>
     *   &lt;oj-button ...>&lt;/oj-button>
     * &lt;/oj-toolbar>
     */
    // ---------------- oj-toolbar-no-chrome --------------
    /**
     * Removes chrome (background and border) from the toolbar(s), in themes having this chrome by default.
     * @ojstyleclass oj-toolbar-no-chrome
     * @ojdisplayname No Chrome
     * @memberof oj.ojToolbar
     * @ojtsexample
     * &lt;oj-toolbar id="myToolbar" aria-label="Foo" aria-controls="bar" class="oj-toolbar-no-chrome">
     *   &lt;oj-button ...>&lt;/oj-button>
     *   &lt;span role="separator" aria-orientation="vertical" class="oj-toolbar-separator">&lt;/span>
     *   &lt;oj-button ...>&lt;/oj-button>
     * &lt;/oj-toolbar>
     */
    /**
     * @ojstylevariableset oj-toolbar-css-set1
     * @ojstylevariable oj-toolbar-button-margin {description: "Horizontal margin around a button in a toolbar", formats: ["length"], help: "#css-variables"}
     * @ojstylevariable oj-toolbar-borderless-button-margin {description: "Horizontal margin around a borderless button in a toolbar", formats: ["length"], help: "#css-variables"}
     * @ojstylevariable oj-toolbar-separator-margin {description: "Horizontal margin around a separator in a toolbar",formats: ["length"], help: "#css-variables"}
     * @memberof oj.ojToolbar
     */
    // --------------------------------------------------- oj.ojToolbar Styling End -----------------------------------------------------------

    (function () {
      const _OJ_TOOLBAR = 'oj-toolbar';
      const _OJ_MENU_BUTTON = 'OJ-MENU-BUTTON';
      const _OJ_BUTTON = 'OJ-BUTTON';

      oj.__registerWidget('oj.ojToolbar', $.oj.baseComponent, {
        widgetEventPrefix: 'oj',

        options: {
          /**
           * <p>Indicates in what states the toolbar's buttons and buttonsets have chrome (background and border).
           *
           * <p>This option only affects buttons and buttonsets that have never had their own <code class="prettyprint">chroming</code> option set.  This allows
           * individual buttons and buttonsets to opt out of their toolbar's chroming if needed.
           *
           * <p>The default chroming varies by theme.
           *
           * <p>Once a value has been set on this option, that value applies regardless of theme.
           *
           * @expose
           * @memberof oj.ojToolbar
           * @ojshortdesc Indicates in what states the toolbar's buttons and buttonsets has chrome (background and border).
           * @instance
           * @since 1.2.0
           *
           * @type {string}
           * @ojvalue {string} "solid" Solid buttons stand out, and direct the user's attention to the most important actions in the UI.
           * @ojvalue {string} "outlined" Outlined buttons are salient, but lighter weight than solid buttons. Outlined buttons are useful for secondary actions.
           * @ojvalue {string} "borderless" Borderless buttons are the least prominent variation and are useful for supplemental actions that require minimal emphasis.
           * @ojvalue {string} "full" In typical themes, full-chrome buttons always have chrome.
           * @ojvalue {string} "half" In typical themes, half-chrome buttons acquire chrome only in their hover, active, and selected states.
           * @ojdeprecated [{target:'propertyValue', for:"half", since: "6.0.0", description: "This value will be removed in the future. Please use borderless instead."},
           *                {target:'propertyValue', for:"full", since: "6.0.0", description: "This value will be removed in the future. Please use solid instead."}]
           * @example <caption>Initialize the Toolbar with the <code class="prettyprint">chroming</code> attribute specified:</caption>
           * &lt;oj-toolbar chroming='borderless'>&lt;/oj-toolbar>
           *
           * @example <caption>Get or set the <code class="prettyprint">chroming</code> property after initialization:</caption>
           * // getter
           * var chromingValue = myToolbar.chroming;
           *
           * // setter
           * myToolbar.chroming = 'borderless';
           *
           * @example <caption>Set the default in the theme (CSS) :</caption>
           * --oj-private-toolbar-global-chroming-default: borderless !default;
           */
          chroming: 'borderless'

          /**
           * <p>JET Toolbar does not support a
           * <code class="prettyprint">disabled</code> option.  The following
           * one-liner can be used to disable or enable all buttons in a toolbar:
           *
           * @member
           * @name disabled
           * @memberof oj.ojToolbar
           * @instance
           * @ignore
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
           * @ignore
           * @property {Event} event <code class="prettyprint">jQuery</code> event object
           * @property {Object} ui Empty object included for consistency with other events
           */
          // create event declared in superclass, but we still want the above API doc
        },

        _InitOptions: function (originalDefaults, constructorOptions) {
          this._super(originalDefaults, constructorOptions);

          if ('disabled' in constructorOptions) {
            Logger.warn(
              "Caller attempted to set the 'disabled' option on Toolbar, but Toolbar does not support the 'disabled' option.  See API doc."
            );
          }
        },

        _ComponentCreate: function () {
          this._super();

          var elem = this.element[0];
          elem.setAttribute(Components._OJ_CONTAINER_ATTR, this.widgetName); // @HTMLUpdateOK
          elem.classList.add(_OJ_TOOLBAR);
          elem.classList.add('oj-component');
          elem.setAttribute('role', 'toolbar');
          this._hasInitialFocusHandler = false;

          this._setup();
        },

        // Override to set custom launcher
        _NotifyContextMenuGesture: function (menu, event, eventType) {
          // Set launcher to the current tabbable button
          // For toggle buttons, launcher must be the hidden focusable input, but for Shift-F10 we want the CM aligned to the Button's root element, not that
          // hidden input.  This is no change from the default for push buttons, since in that case the root element and launcher (input) are the same.
          var currentButton = this.element.find(':oj-button[tabindex=0]'); // For now leaving pseudo selectors as jQuery ( for details)
          this._OpenContextMenu(event, eventType, {
            launcher: currentButton,
            position: { of: eventType === 'keyboard' ? currentButton.ojButton('widget') : event }
          });
        },

        // eslint-disable-next-line no-unused-vars
        _setOption: function (key, value) {
          // Override of protected base class method.  Method name needn't be quoted since is in externs.js.
          if (key === 'disabled') {
            Logger.warn(
              "Caller attempted to set the 'disabled' option on Toolbar, but Toolbar does not support the 'disabled' option.  See API doc.  Ignoring the call."
            );
            return;
          }

          // Call super() after the "disabled" check returns, to avoid super() setting oj-disabled, etc.
          // Call it before handling chroming case, so that when that case calls refresh() on Button/Buttonset, callees see the new value of the option.
          // (Previously called super() at end, so that optionChange (fired at end of super) is fired at very end.)
          this._superApply(arguments);

          if (key === 'chroming') {
            // refresh the top-level buttons, and refresh the buttonsets to make them refresh their buttons, so that all toolbar buttons are refreshed.
            // Reason: to make them re-fetch their chroming option, in case it's still set to the default dynamic getter,
            // which takes its value from the containing buttonset or toolbar if present.
            // TBD: Consider only calling refresh() on children that haven't had their chroming option set, i.e. those still using the dynamic getter.
            this._refreshChildren();
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
         *   <li>After a programmatic change to the <code class="prettyprint">checked</code> status of a radio button in the toolbar
         *       (which should be done via Buttonset's [value]{@link oj.ojButtonsetOne#value} option).  This applies only to radios,
         *       not to checkboxes or push buttons.</li>
         *   <li>After the reading direction (LTR vs. RTL) changes.</li>
         * </ul>
         *
         * @expose
         * @memberof oj.ojToolbar
         * @ojshortdesc Refreshes the toolbar.
         * @return {void}
         * @instance
         *
         * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
         * myToolbar.refresh();
         */
        refresh: function () {
          this._super();
          this._setup();
          this._refreshTabindex();
        },

        _setup: function () {
          // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
          var self = this;
          var elem = this.element[0];
          this.isRtl = this._GetReadingDirection() === 'rtl';

          // initialize as an empty JQuery object so we don't fall over if focus hasn't been introduced before a click is made
          this.$enabledButtons = $();

          // When toolbar is binding listeners to buttons, use the Toolbar's eventNamespace, not the Button's
          // eventNamespace, to facilitate later unbinding only the Toolbar listeners.

          // For checkbox/radio, we're binding to inputs, not labels.

          // Put listeners on every button, b/c it's too unreliable to put them on the toolbar node and rely on event bubbling.
          // - E.g. bubbling doesn't work for antonym buttons (is this still true after the refactoring?) -- see comment on Button._setLabelOption().
          // - Likewise, focus mgmt can't just break if app listener stops propagation.
          // - Both of these problems still happen when using the delegation / selector overload of .on(); there is no special JQ bubbling magic.

          if (this._IsCustomElement()) {
            if (!this._hasInitialFocusHandler) {
              // Don't add more than one initial focus handler (for the case where toolbar is refreshed but not yet focused)
              // defer setting up button-specific event handling until the first focusin event is triggered
              this._focusinListener = function (event) {
                // eslint-disable-line no-unused-vars
                self._handleInitialFocus(event.target);
              };
              elem.addEventListener('focusin', this._focusinListener, true);
              this._hasInitialFocusHandler = true;
            }

            // find any current supported children to refresh in case they were already initialized and need to update their 'chroming' values
            this.topLevelChildren = elem.querySelectorAll(
              'oj-button, oj-menu-button, oj-buttonset-one, oj-buttonset-many'
            );

            // refresh the top-level buttons, and refresh the buttonsets to make them refresh their buttons, so that all toolbar buttons are refreshed.
            // Reason: to make them re-fetch their chroming option, in case it's still set to the default dynamic getter,
            // which takes its value from the containing buttonset or toolbar if present.
            // TBD: Consider only calling refresh() on children that haven't had their chroming option set, i.e. those still using the dynamic getter.
            this._refreshChildren();
          } else {
            const _OJ_BUTTON_FIND = ':oj-button';
            this.$buttons = this.element
              .find(_OJ_BUTTON_FIND)
              .off('keydown' + this.eventNamespace)
              .on('keydown' + this.eventNamespace, function (event) {
                self._handleKeyDown(event, $(this));
              })

              .off('click' + this.eventNamespace)
              // eslint-disable-next-line no-unused-vars
              .on('click' + this.eventNamespace, function (event) {
                if (!$(this).ojButton('option', 'disabled')) {
                  // Normally the button will be tabbable after the click, since (a) if we reach here, the clicked button is enabled, and
                  // (b) an unchecked radio before the click will normally be checked after the click.  But just in case it's unchecked
                  // (e.g. due to app listener), we let callee run it thru _mapToTabbable() before using, as usual.
                  self._setTabStop($(this));
                }
              })
              .off('focus' + this.eventNamespace)
              // eslint-disable-next-line no-unused-vars
              .on('focus' + this.eventNamespace, function (event) {
                self._handleFocus($(this));
              });

            // refresh the top-level buttons, and refresh the buttonsets to make them refresh their buttons, so that all toolbar buttons are refreshed.
            // Reason: to make them re-fetch their chroming option, in case it's still set to the default dynamic getter,
            // which takes its value from the containing buttonset or toolbar if present.
            // TBD: Consider only calling refresh() on children that haven't had their chroming option set, i.e. those still using the dynamic getter.
            this.$buttonsets = this.element.find(':oj-buttonset').ojButtonset('refresh');
            this.$topLevelButtons = this.$buttons
              .not(this.$buttonsets.find(_OJ_BUTTON_FIND))
              .ojButton('refresh');
          }
        },

        _handleFocus: function ($button) {
          if (!this._IsCustomElement() && this.$enabledButtons.length === 0) {
            // the subset of Toolbar buttons that are enabled.  Disabled buttons are not tabbable.
            this.$enabledButtons = this.$buttons.filter(function () {
              return !$(this).ojButton('option', 'disabled') && $(this).is(':visible');
            });

            this._initTabindexes(this._lastTabStop == null);
            this.$enabledButtons[0].focus();
          } else {
            this._setTabStop($button);
          }
        },

        // For custom element only, return if a button with oj-button class is disabled.
        // This can either be an oj-button, oj-menu-button, or a span inside oj-buttonset-*.
        // We check the disabled property on custom elements instead of oj-disabled class because
        // there is delay between setting the property and having the class updated.
        _isButtonDisabled: function (button) {
          var disabled;
          if (button.tagName === _OJ_BUTTON || button.tagName === _OJ_MENU_BUTTON) {
            disabled = button.disabled;
          } else {
            // "button" is a span around an oj-option that represents a button in oj-buttonset-one or oj-buttonset-many
            disabled = button.parentNode.disabled;
            if (!disabled) {
              var ojOption = button.querySelector('oj-option');
              disabled = ojOption && ojOption.disabled;
            }
          }
          return disabled;
        },

        // For custom element only, we setup this handler for any focusin event on the toolbar. We then remove this handler, and setup the rest of the handlers we need
        // once all of our children have finished being initialized.
        _handleInitialFocus: function (targetElement) {
          // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
          var self = this;
          var elem = this.element[0];
          var disabledChangedEventType = 'disabledChanged';

          // remove this event handling as we only want to run this setup logic on the first focusin event
          elem.removeEventListener('focusin', this._focusinListener, true);
          this._hasInitialFocusHandler = false;

          this.topLevelChildren = elem.querySelectorAll(
            'oj-button, oj-menu-button, oj-buttonset-one, oj-buttonset-many'
          );

          // Add a MutationObserver to handle add and remove of descendants
          if (!this._mutationObserver) {
            var ojElementNames = [
              _OJ_BUTTON,
              _OJ_MENU_BUTTON,
              'OJ-BUTTONSET-ONE',
              'OJ-BUTTONSET-MANY',
              'OJ-OPTION'
            ];
            this._disabledChangedListener = this.refresh.bind(this);
            this._mutationObserver = new MutationObserver(function (mutationList) {
              // mutationList is an array of MutationRecord
              mutationList.forEach(function (mutation) {
                if (mutation.type === 'childList') {
                  var i;
                  // addedNodes and removedNodes are NodeList
                  if (mutation.addedNodes) {
                    for (i = 0; i < mutation.addedNodes.length; i++) {
                      if (ojElementNames.indexOf(mutation.addedNodes[i].nodeName) >= 0) {
                        mutation.addedNodes[i].addEventListener(
                          disabledChangedEventType,
                          self._disabledChangedListener
                        );
                      }
                    }
                  }
                  if (mutation.removedNodes) {
                    for (i = 0; i < mutation.removedNodes.length; i++) {
                      if (ojElementNames.indexOf(mutation.removedNodes[i].nodeName) >= 0) {
                        mutation.removedNodes[i].removeEventListener(
                          disabledChangedEventType,
                          self._disabledChangedListener
                        );
                      }
                    }
                  }
                }
              });
            });
            this._mutationObserver.observe(elem, { childList: true, subtree: true });
          }

          // Toolbar custom element can listen to disabledChanged event on descendants to refresh itself
          var ojElements = elem.querySelectorAll(
            'oj-button, oj-menu-button, oj-buttonset-one, oj-buttonset-many, oj-option'
          );
          ojElements.forEach(function (ojElement) {
            // This can be called on the same element more than once, so try to remove any listener first
            ojElement.removeEventListener(disabledChangedEventType, self._disabledChangedListener);
            ojElement.addEventListener(disabledChangedEventType, self._disabledChangedListener);
          });

          var buttons = elem.querySelectorAll(
            'oj-button, oj-menu-button, oj-buttonset-one .oj-button, oj-buttonset-many .oj-button'
          );
          this.$buttons = $(buttons)
            .off('keydown' + this.eventNamespace)
            .on('keydown' + this.eventNamespace, function (event) {
              var $button = $(this);
              self._handleKeyDown(event, $button);
            })

            .off('click' + this.eventNamespace)
            // eslint-disable-next-line no-unused-vars
            .on('click' + this.eventNamespace, function (event) {
              var $button = $(this);
              if (!$button.hasClass('oj-disabled')) {
                // Normally the button will be tabbable after the click, since (a) if we reach here, the clicked button is enabled, and
                // (b) an unchecked radio before the click will normally be checked after the click.  But just in case it's unchecked
                // (e.g. due to app listener), we let callee run it thru _mapToTabbable() before using, as usual.
                self._setTabStop($button);
              }
            })
            .off('focusin' + this.eventNamespace)
            // eslint-disable-next-line no-unused-vars
            .on('focusin' + this.eventNamespace, function (event) {
              var $button = $(this);
              self._handleFocus($button);
            });

          // the subset of Toolbar buttons that are enabled.  Disabled buttons are not tabbable.
          if (this._IsCustomElement()) {
            this.$enabledButtons = this.$buttons.filter(function () {
              return !self._isButtonDisabled(this) && $(this).is(':visible');
            });
          } else {
            this.$enabledButtons = this.$buttons.filter(function () {
              return !$(this).ojButton('option', 'disabled') && $(this).is(':visible');
            });
          }

          this._initTabindexes(this._lastTabStop == null);
          if (this.$enabledButtons && this.$enabledButtons.length > 0) {
            if (targetElement) {
              let targetButton =
                targetElement.nodeName === 'INPUT' ? targetElement.parentElement : targetElement;
              targetButton.focus();
            } else {
              let btn = this._getButtonFocusElem(this.$enabledButtons[0]);
              if (btn) {
                btn.focus();
              }
            }
          }
        },

        // Update list of enabled buttons and refresh tabindex settings
        _refreshTabindex: function () {
          var self = this;
          // We need to re-select buttons because with refresh buttons in toolbar may be added/deleted.
          if (this._IsCustomElement()) {
            this.$buttons = $(
              this.element[0].querySelectorAll(
                'oj-button, oj-menu-button, oj-buttonset-one .oj-button, oj-buttonset-many .oj-button'
              )
            );
          } else {
            this.$buttons = this.element.find(':oj-button');
          }
          // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
          if (this.$buttons !== undefined) {
            // the subset of Toolbar buttons that are enabled.  Disabled buttons are not tabbable.
            if (this._IsCustomElement()) {
              this.$enabledButtons = this.$buttons.filter(function () {
                return !self._isButtonDisabled(this) && $(this).is(':visible');
              });
            } else {
              this.$enabledButtons = this.$buttons.filter(function () {
                return !$(this).ojButton('option', 'disabled') && $(this).is(':visible');
              });
            }

            this._initTabindexes(this._lastTabStop == null);
          }
        },

        // Returns the focusable inner element of the button.
        _getButtonFocusElem: function (button) {
          // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
          var focusElem = button; // Set to button by default
          if (button !== undefined && this._IsCustomElement()) {
            var expectedTag = 'button';
            if (button.classList.contains('oj-button-toggle')) {
              // the underlying input element is one of the button's children
              expectedTag = 'input';
            }
            var children = button.children;
            for (var i = 0; i < children.length; i++) {
              var child = children[i];
              if (child.tagName.toLowerCase() === expectedTag) {
                focusElem = child;
                break;
              }
            }
          }
          return focusElem;
        },

        // For create, make only the first enabled button tabbable.  (We decided to have Shift-Tab go to first, not last, button.)
        // For refreshes, keep the existing tabstop if we can, otherwise proceed as with create.
        // Either way, if that button is a radio and some radio in its group is checked, make that one tabbable instead.
        // If there are no enabled buttons, makes them all untabbable.
        // No return value.
        _initTabindexes: function (isCreate) {
          // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
          // even for refreshes where we'll wind up keeping the same tabstop, must make everything untabbable first, to ensure any new buttons become untabbable.
          var $last = $(this._lastTabStop);
          this._lastTabStop = undefined;

          if (this._IsCustomElement()) {
            for (var i = 0; i < this.$buttons.length; i++) {
              this._getButtonFocusElem(this.$buttons[i]).setAttribute('tabindex', '-1');
            }
          } else {
            this.$buttons.attr('tabindex', '-1');
          }

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
          this._setTabStop($newTabStop);
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
        _mapToTabbable: function ($button) {
          // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
          var focusElems = [];
          for (var i = 0; i < this.$enabledButtons.length; i++) {
            focusElems.push(this._getButtonFocusElem(this.$enabledButtons[i]));
          }
          var $enabledButtonFocusElems = $(focusElems);
          return $button.map(function (index, elem) {
            // Buttons other than radios, and checked radios, are always tabbable if they're enabled, which this method requires.
            // Radios w/ name="" (incl name omitted) are not in a radio group, not even with other radios with w/ name="".  Radios
            // with no groupmates are always tabbable, since either they're checked, or they're unchecked with no checked groupmate.
            if (elem.type !== 'radio' || elem.checked || elem.name === '') {
              return elem;
            }
            // elem is unchecked radio in real (not "") group, which is tabbable iff no groupmate is checked.  Per above doc, we know that
            // all of its potentially checked groupmates are in $enabledButtons.
            var $checkedRadio = _radioGroup(elem, $enabledButtonFocusElems).filter(':checked'); // For now leaving pseudo selectors as jQuery ( for details)
            return $checkedRadio.length ? $checkedRadio[0] : elem;
          });
        },

        // Set which button is in the tab sequence.
        // $button should contain 0 or 1 button to be made tabbable (since at most one should be tabbable at a time).
        //   If 0 (i.e. no enabled buttons), all will become untabbable.  If 1, it must be tabbable in every way (e.g. enabled) except possibly
        //   being an unchecked radio with a checked groupmate, which this method will map to its checked groupmate, which
        //   we know is enabled thus tabbable since we require that checked radios with enabled groupmates not be disabled.
        // No return value.
        _setTabStop: function (_button) {
          var $button = _button;

          if (this._IsCustomElement()) {
            $button = this._mapToTabbable($(this._getButtonFocusElem($button[0])));
          } else {
            $button = this._mapToTabbable($button);
          }

          var button = $button[0]; // button is undefined iff $button is empty iff we need to clear all tabstops b/c there are no enabled buttons to make tabbable
          var last = this._lastTabStop; // last is undefined iff $(last) is empty iff there are no existing tabstops to clear (b/c _initTabindexes just ran
          // or previously there were no enabled buttons to make tabbable)

          // Cases: both are undefined: have no tabstops; want to keep it that way (b/c none enabled), so do nothing
          //        both are node X: X is the tabstop; want to keep it that way, so do nothing
          //        last is node X; button is undefined: X is the tabstop; want to clear it w/o replacing it (b/c none enabled).  This logic does that.
          //        last is undefined; button is node X: no existing tabstop; want to make X the tabstop.  This logic does that.
          //        last is node X; button is node Y: X is the tabstop; want to clear it and make Y the tabstop.  This logic does that.
          if (button !== last) {
            $(last).attr('tabindex', '-1'); // no-op iff $(last) is empty iff (see comment above)
            $button.attr('tabindex', '0'); // no-op iff $button is empty iff (see comment above)
            this._lastTabStop = button;
          }
        },

        // No return value.
        _handleKeyDown: function (event, $button) {
          // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
          switch (event.which) {
            case $.ui.keyCode.UP: // up arrow
            case $.ui.keyCode.DOWN: // down arrow
              if ($button.attr('type') !== 'radio') {
                break;
              }
            // fall thru for radio only.  See comments below.
            // eslint-disable-next-line no-fallthrough
            case $.ui.keyCode.LEFT: // left arrow
            case $.ui.keyCode.RIGHT: // right arrow
              event.preventDefault();
              // reselect enabled buttons
              if (this._IsCustomElement()) {
                this.$enabledButtons = this.$buttons.filter(function () {
                  return !$(this).hasClass('oj-disabled') && $(this).is(':visible');
                });
              } else {
                this.$enabledButtons = this.$buttons.filter(function () {
                  return !$(this).ojButton('option', 'disabled') && $(this).is(':visible');
                });
              }

              var length = this.$enabledButtons.length;
              if (length < 2) {
                // nowhere to navigate to; currently focused button is the only enabled one in toolbar
                break;
              }

              var oldIndex = this.$enabledButtons.index($button);
              //
              var increment =
                event.which === $.ui.keyCode.DOWN ||
                // eslint-disable-next-line no-bitwise
                (event.which === $.ui.keyCode.RIGHT) ^ this.isRtl
                  ? 1
                  : -1;
              var newIndex = (oldIndex + increment + length) % length; // wrap around if at start/end of toolbar

              // When radios are inside an element with role=toolbar, WAI-ARIA doesn't specify how to reconcile its recommended
              // Toolbar behavior (left/right arrows move focus w/o selecting) and radio behavior (all 4 arrow keys both move focus
              // and check/select that radio).  A11y office recommended treating radios in a Buttonset or Toolbar like other buttons:
              // Arrow moves focus without selecting, Spacebar selects, which we prefer too.
              // Previously we did that for only left/right arrows, and disabled up/down arrows, but since both native and WAI-ARIA-
              // compliant radios support up/down arrows, and since JAWS automatically instructs the user to use up/down arrows even
              // when the radio group is inside a role=toolbar, we now support up/down arrows for radios via the fall-thru above
              // (but still focus only, not select).
              this._getButtonFocusElem(this.$enabledButtons.eq(newIndex)[0]).focus();
              break;

            default:
              break;
            // Don't need Space/Enter handlers.  For all buttons except already-checked radios in some browsers, Space/Enter fire a click event
            // (natively or manually), which already calls _setTabStop.  For checked radios (which are focused if they're getting
            // this key event), _setTabStop has already been called for whichever happened 2nd:  focus (an already checked radio) or
            // check (an already focused radio) via click/Space/Enter.  If checking was done programmatically (via Bset.checked option), we require a refresh().
          }
        },

        _destroy: function () {
          // Override of protected base class method.  Method name needn't be quoted since is in externs.js.
          // this entire stmt can be removed once restoreAttrs code is running.
          var elem = this.element[0];
          elem.classList.remove(_OJ_TOOLBAR);
          elem.classList.remove('oj-component');
          elem.removeAttribute(Components._OJ_CONTAINER_ATTR);
          elem.removeAttribute('role');

          // Since we're not destroying the buttons themselves, the restoreAttrs code will NOT take care of this.
          this.$buttons.attr('tabindex', '0'); // bsets in a toolbar should not have focusMgmt turned on, so this is OK, but should revert to orig value, not assume 0.

          // Refresh the top-level buttons, and refresh the buttonsets to make them refresh their buttons, so that all toolbar buttons are refreshed.
          // Reason: to make them re-fetch their chroming option, in case it's still set to the default dynamic getter,
          // which takes its value from the containing toolbar, which is no longer present.
          // Call refresh *after* removing _OJ_CONTAINER_ATTR, so the buttons/sets no longer detect that they're in a toolbar.
          // TBD: Consider only calling refresh() on children that haven't had their chroming option set, i.e. those still using the dynamic getter.
          this._refreshChildren();
        },

        // Refreshes the toolbar's child components.
        _refreshChildren: function () {
          // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
          if (!this._IsCustomElement()) {
            this.$buttonsets.ojButtonset('refresh');
            this.$topLevelButtons.ojButton('refresh');
          } else {
            // This relies on the button and buttonset components being implemented with JQUI - this will need to be revisited once that is no longer the case
            for (var i = 0; i < this.topLevelChildren.length; i++) {
              var child = this.topLevelChildren[i];
              if (child.tagName === _OJ_BUTTON || child.tagName === _OJ_MENU_BUTTON) {
                // must check to make sure the child button element has been initialized
                if (Components.__GetWidgetConstructor(this._getButtonFocusElem(child), 'ojButton')) {
                  child.refresh();
                }
              } else if (
                child.tagName === 'OJ-BUTTONSET-ONE' ||
                child.tagName === 'OJ-BUTTONSET-MANY'
              ) {
                // must check to make sure the child buttonset element has been initialized
                if (Components.__GetWidgetConstructor(child, 'ojButtonset')) {
                  child.refresh();
                }
              }
            }
          }
        }
      });
    })();

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
     * @private
     */
    function _radioGroup(radio, $elems) {
      var name = radio.name;
      var $radios;

      if (name) {
        name = name.replace(/'/g, "\\'"); // escape single quotes
        var selector = ":radio[name='" + name + "']:oj-button"; // For now leaving pseudo selectors as jQuery ( for details)
        $radios = $elems.filter(selector);
      } else {
        $radios = $elems.filter(radio).filter(':oj-button'); // For now leaving pseudo selectors as jQuery ( for details)
      }
      return $radios;
    }
  })(); // end of Toolbar wrapper function

  // Set theme-based defaults
  Components.setDefaultOptions({
    ojToolbar: {
      chroming: Components.createDynamicPropertyGetter(function () {
        return ThemeUtils.getCachedCSSVarValues(['--oj-private-toolbar-global-chroming-default'])[0];
      })
    }
  });

  (function () {
var __oj_toolbar_metadata = 
{
  "properties": {
    "chroming": {
      "type": "string",
      "enumValues": [
        "borderless",
        "full",
        "half",
        "outlined",
        "solid"
      ]
    },
    "translations": {
      "type": "object",
      "value": {}
    }
  },
  "methods": {
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
    __oj_toolbar_metadata.extension._WIDGET_NAME = 'ojToolbar';
    oj.CustomElementBridge.register('oj-toolbar', {
      metadata: oj.CollectionUtils.mergeDeep(__oj_toolbar_metadata, {
        properties: {
          chroming: {
            binding: {
              provide: [
                {
                  name: 'containerChroming',
                  default: oj.ThemeUtils.getCachedCSSVarValues([
                    '--oj-private-toolbar-global-chroming-default'
                  ])[0]
                }
              ]
            }
          }
        }
      })
    });
  })();

});
