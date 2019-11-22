/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'hammerjs', 'ojs/ojcontext', 'ojs/ojthemeutils', 'ojs/ojcomponentcore', 'ojs/ojanimation', 'ojs/ojlogger', 'ojs/ojconfig', 'ojs/ojjquery-hammer', 'ojs/ojpopupcore', 'ojs/ojoption'], 
       function(oj, $, Hammer, Context, ThemeUtils, Components, AnimationUtils, Logger, Config)
{
  "use strict";
var __oj_menu_metadata = 
{
  "properties": {
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "openOptions": {
      "type": "object",
      "properties": {
        "display": {
          "type": "string",
          "enumValues": [
            "auto",
            "dropDown",
            "sheet"
          ],
          "value": "auto"
        },
        "initialFocus": {
          "type": "string",
          "enumValues": [
            "firstItem",
            "menu",
            "none"
          ],
          "value": "menu"
        },
        "launcher": {
          "type": "string|Element"
        },
        "position": {
          "type": "object",
          "properties": {
            "at": {
              "type": "object",
              "properties": {
                "horizontal": {
                  "type": "string",
                  "enumValues": [
                    "center",
                    "end",
                    "left",
                    "right",
                    "start"
                  ]
                },
                "vertical": {
                  "type": "string",
                  "enumValues": [
                    "bottom",
                    "center",
                    "top"
                  ]
                }
              }
            },
            "collision": {
              "type": "string",
              "enumValues": [
                "fit",
                "flip",
                "flipcenter",
                "flipfit",
                "none"
              ],
              "value": "flipfit"
            },
            "my": {
              "type": "object",
              "properties": {
                "horizontal": {
                  "type": "string",
                  "enumValues": [
                    "center",
                    "end",
                    "left",
                    "right",
                    "start"
                  ],
                  "value": "start"
                },
                "vertical": {
                  "type": "string",
                  "enumValues": [
                    "bottom",
                    "center",
                    "top"
                  ],
                  "value": "top"
                }
              }
            },
            "of": {
              "type": "string|object"
            },
            "offset": {
              "type": "object",
              "properties": {
                "x": {
                  "type": "number",
                  "value": 0
                },
                "y": {
                  "type": "number",
                  "value": 0
                }
              }
            }
          }
        }
      }
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "ariaFocusSkipLink": {
          "type": "string"
        },
        "labelCancel": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "refresh": {},
    "close": {},
    "open": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateStart": {},
    "ojAnimateEnd": {},
    "ojBeforeOpen": {},
    "ojClose": {},
    "ojOpen": {},
    "ojAction": {}
  },
  "extension": {}
};


/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* global Hammer:false, Promise:false, Components:false, Logger:false, ThemeUtils:false, Context:false, AnimationUtils:false, Config:false */
(function () {
  // -----------------------------------------------------------------------------
  // "private static members" shared by all menus
  // -----------------------------------------------------------------------------
  // Array to track all opened menu popups. All the menus opened by Menu Buttons/ Context Menu/using menu.open() and standalone menus having open submenus, will be added to list
  // and later will be removed on __dismiss()/_close() on menu popup/standalone menu.
  var _openPopupMenus = []; // See usage for explanation.  Can be boolean (doesn't need to be re-entrant int), since
  // baseComponent.touchendMousedownThreshold is much less than baseComponent.pressHoldThreshold.

  var _contextMenuPressHoldJustEnded = false;
  /**
   * Key used to store the menu's position object as a jQuery data property.
   * @const
   * @private
   * @type {string}
   */

  var _POSITION_DATA = 'oj-menu-position'; // Used to suppress focus ring for Mac Safari due to platform repainting bug.
  // This returns true for Mac Safari, but not for desktop Chrome, FF, IE11, Edge;
  // Mac Chrome, FF; iOS Safari; or Android Chrome.
  // Using "Mac" instead of "Macintosh" in this check would return true for Mac
  // Safari and iOS Safari, but none of the others.

  var _IS_MAC_SAFARI = oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.MAC && oj.AgentUtils.getAgentInfo().browser === oj.AgentUtils.BROWSER.SAFARI;

  var _config = ThemeUtils.parseJSONFromFontFamily('oj-menu-config') || {};

  var _SHEETS_HAVE_CANCEL_ITEM = _config.sheetCancelAffordance === 'menuItem';

  var _SHEETS_HAVE_SWIPE_DOWN_TO_DISMISS = _config.sheetSwipeDownBehavior === 'dismiss';

  var _DROPDOWN_MODALITY = _config.dropDownModality || 'modeless'; // backward-compatible value


  var _SHEET_MODALITY = _config.sheetModality || 'modal'; // "bottom-0", "bottom-12", or "bottom-10%", per standard JQUI position utility syntax. Put the
  // minus on position's "at", not "my", so that %'s (which we're not using, but themers might) are relative to window,
  // not menu, thus closer to behavior of using % margin in CSS.  SCSS code comment on our $var says we use "at".


  var _SHEET_POSITION_AT = 'bottom-' + (_config.sheetMarginBottom || 0);

  var _HAMMER_OPTIONS = _SHEETS_HAVE_SWIPE_DOWN_TO_DISMISS && {
    recognizers: [[Hammer.Swipe, {
      direction: Hammer.DIRECTION_DOWN
    }]]
  };

  var _SUBID_CANCEL = 'oj-menu-cancel-command';

  function _findImmediateMenuItems(activeMenu) {
    var menuItems = [];
    var deferredChild = activeMenu.children('oj-defer').first();
    var children;

    if (deferredChild.length > 0) {
      children = deferredChild.children('.oj-menu-item, oj-menu-select-many');
    } else {
      children = activeMenu.children('.oj-menu-item, oj-menu-select-many');
    }

    for (var i = 0; i < children.length; i++) {
      var child = $(children[i]);

      if (child.is('.oj-menu-item')) {
        menuItems.push(child[0]);
      } else if (child[0].nodeName === 'OJ-MENU-SELECT-MANY') {
        menuItems = $.merge(menuItems, child.children('.oj-menu-item'));
      }
    }

    return menuItems;
  }
  /**
   * @typedef {Object} oj.ojMenu.PositionAlign
   * @property {"top"|"bottom"|"center"} [vertical] Vertical alignment.
   * @property {"start"|"end"|"left"|"center"|"bottom"} [horizontal] Horizontal alignment. <p>
   * <ul>
   *  <li><b>"start"</b> evaluates to "left" in LTR mode and "right" in RTL mode.</li>
   *  <li><b>"end"</b> evaluates to "right" in LTR mode and "left" in RTL mode.</li>
   * </ul>
   *
   */

  /**
   * @typedef {Object} oj.ojMenu.PositionPoint
   * @property {number} [x] Horizontal alignment offset.
   * @property {number} [y] Vertical alignment offset.
   */

  /**
   * @typedef {Object} oj.ojMenu.Position
   * @property {Object} [my] Defines which edge on the menu to align with the target ("of") element.
   * @property {Object} [at] Defines which position on the target element ("of") to align the positioned element
   *                                  against.
   * @property {Object} [offset] Defines a point offset in pixels from the ("my") alignment.
   * @property {string|Object} [of] Which element to position the menu against.  The default is the
   * <code class="prettyprint">launcher</code> argument passed to the
   * <code class="prettyprint">open</code> method. <p>
   *
   * If the value is a string, it should be a selector or the literal string value
   * of <code class="prettyprint">window</code>.  Otherwise, a point of x,y.  When a point
   * is used, the values are relative to the whole document.  Page horizontal and vertical
   * scroll offsets need to be factored into this point - see UIEvent
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/pageX">pageX</a>,
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/pageY">pageY</a>.
   *
   * @property {"flip"|"fit"|"flipfit"|"flipcenter"|"none"} [collision] Rule for alternate alignment. <p>
   * <ul>
   *  <li><b>"flip"</b> the element to the opposite side of the target and the
   *             collision detection is run again to see if it will fit. Whichever side
   *             allows more of the element to be visible will be used. </li>
   * <li><b>"fit"</b> shift the element away from the edge of the window. </li>
   * <li><b>"flipfit"</b> first applies the flip logic, placing the element
   *  on whichever side allows more of the element to be visible. Then the fit logic
   *  is applied to ensure as much of the element is visible as possible.</li>
   * <li><b>flipcenter</b> first applies the flip rule and follows with center alignment.</li>
   * <li><b>"none"</b> no collision detection.</li>
   * </ul>
   * @ojsignature [{target:"Type", value:"oj.ojMenu.PositionAlign", for:"my", jsdocOverride:true},
   *               {target:"Type", value:"oj.ojMenu.PositionAlign", for:"at", jsdocOverride:true},
   *               {target:"Type", value:"oj.ojMenu.PositionPoint", for:"offset", jsdocOverride:true},
   *               {target:"Type", value:"string|oj.ojMenu.PositionPoint", for:"of", jsdocOverride:true}]
   */

  /**
   * @typedef {Object} oj.ojMenu.OpenOptions
   * @property {string} [display] Determines whether the menu is displayed as a drop down menu or a sheet menu.
   * @property {string} [initialFocus] Determines focus behavior when the menu is initially opened.
   * @property {string|Element} [launcher] The DOM node (which may or may not be a JET element) that launches this menu.
   * @property {Object} [position] Determines the position of a drop down menu when launched. Ignored for sheet menus.
   * @ojsignature {target:"Type", value:"oj.ojMenu.Position", for:"position", jsdocOverride:true}
   */

  /**
   * @ojcomponent oj.ojMenu
   * @ojdisplayname Menu
   * @augments oj.baseComponent
   * @ojrole menu
   * @since 0.6.0
   * @ojshortdesc A menu displays a list of options in a popup.
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["openOptions.display", "openOptions.initialFocus", "disabled"]}
   * @ojvbdefaultcolumns 2
   * @ojvbmincolumns 1
   *
   * @classdesc
   * <h3 id="menuOverview-section">
   *   JET Menu
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#menuOverview-section"></a>
   * </h3>
   *
   * <p>Description: Themeable, WAI-ARIA-compliant popup menu with touch, mouse and keyboard interactions for navigation.
   *
   * <p>A JET Menu is created using an ( <code class="prettyprint">&lt;oj-menu></code> ) tag with an ( <code class="prettyprint">&lt;oj-option></code> ) tag representing each menu item:
   *
   * <pre class="prettyprint">
   * <code>&lt;oj-menu id="menu" style="display:none" aria-label="Order Edit">
   *   &lt;oj-option>Item 1&lt;/oj-option>
   *   &lt;oj-option>Item 2&lt;/oj-option>
   *   &lt;oj-option>Item 3
   *     &lt;oj-menu id="submenu">
   *       &lt;oj-option>Item 3-1&lt;/oj-option>
   *       &lt;oj-option>Item 3-2&lt;/oj-option>
   *       &lt;oj-option>Item 3-3&lt;/oj-option>
   *       &lt;oj-option>Item 3-4&lt;/oj-option>
   *       &lt;oj-option>Item 3-5&lt;/oj-option>
   *     &lt;/oj-menu>
   *   &lt;/oj-option>
   *   &lt;oj-option>Item 4&lt;/oj-option>
   *   &lt;oj-option>Item 5&lt;/oj-option>
   * &lt;/oj-menu>
   * </code></pre>
   *
   * <p>JET Menus are not intended to be scrollable, as large, unwieldy menus are not good UX.  Ideally menus should have a manageable number of items; if this is not
   * possible, then it is preferable to organize contents into submenus, rather than introducing scrolling.
   *
   *
   * <h3 id="popup-section">
   *   Popup Menus
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#popup-section"></a>
   * </h3>
   *
   * <p>JET Menu is a popup component, for use with [context menu]{@link oj.baseComponent#contextMenu}, [menu button]{@link oj.ojButton#menu},
   * or similar functionality.  It is not intended to sit inline on the page.  See also the [JET NavigationList]{@link oj.ojNavigationList} component.
   *
   * <p>For this reason, the component is automatically hidden until it is opened.  However, this styling is not applied until the component is initialized.
   * To avoid a FOUC (flash of unstyled content), applications are encouraged to apply <code class="prettyprint">style="display:none"</code> to the menu markup,
   * as shown in the above code sample.
   *
   *
   * <h3 id="submenus-section">
   *   Submenus
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#submenus-section"></a>
   * </h3>
   *
   * <p>Submenus can be created by specifying nested <code class="prettyprint">oj-menu</code> elements under the desired <code class="prettyprint">oj-option</code> elements.
   *
   * <p>When a submenu is present, a default submenu icon will be automatically added to the parent menu item (see <a href="#itemIcons-section">Menu Item Icons</a>).
   *
   * <p>Sheet menus are not appropriate when submenus are present. Therefore, submenus and there parent menus are always displayed as a drop down regardless of the
   * <code class="prettyprint">open-options.display</code> attribute's value.
   *
   *
   * <h3 id="dividers-section">
   *   Dividers
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#dividers-section"></a>
   * </h3>
   *
   * <p>Divider elements can be created by including menu items that contain only spaces and/or dashes, or nothing at all:
   *
   * <pre class="prettyprint">
   * <code>&lt;oj-menu id="menu" style="display:none" aria-label="Order Edit">
   *   &lt;oj-option>Item 1&lt;/oj-option>
   *   &lt;oj-option>---&lt;/oj-option>
   *   &lt;oj-option>Item 2&lt;/oj-option>
   * &lt;/oj-menu>
   * </code></pre>
   *
   * <p>For WAI-ARIA compliance, JET automatically adds <code class="prettyprint">role="separator"</code> to the divider element.
   *
   *
   * <h3 id="itemIcons-section">
   *   Menu Item Icons
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#itemIcons-section"></a>
   * </h3>
   *
   * <p>Menu items currently support the rendering of start and end icons. Submenu icons are inserted automatically. To replace the default
   * submenu icon with a custom icon, the <code class="prettyprint">endIcon</code> slot should be specified. To render additional start
   * or end icons for a menu item, the <code class="prettyprint">startIcon</code> or <code class="prettyprint">endIcon</code> slot of the
   * <code class="prettyprint">oj-option</code> should be specified. See the <code class="prettyprint">oj-option</code> doc for details about
   * accepted children and slots.</p>
   *
   *
   * <h3 id="dismissal-section">
   *   Dismissal
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#dismissal-section"></a>
   * </h3>
   *
   * <p>JET Menus auto-dismiss in the expected cases, such as focus loss and menu item selection.  In addition, Sheet Menus
   * offer the following optional dismissal affordances:
   *
   * <ul>
   * <li>A "Cancel" menu item is displayed for Sheet Menus if the
   *     <code class="prettyprint">$menuSheetCancelAffordance</code> SASS variable is set to
   *     <code class="prettyprint">"menuItem"</code>.  See its
   *     <a href="#translations.labelCancel">translation</a> and <a href="#oj-menu-cancel-command">subId</a>.</li>
   * <li>The user can dismiss Sheet Menus via a downward swipe on the menu if the
   *     <code class="prettyprint">$menuSheetSwipeDownBehavior</code> SASS variable is set to
   *     <code class="prettyprint">"dismiss"</code>.</li>
   * </ul>
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
   * <p>The app should supply either an <code class="prettyprint">aria-label</code> or <code class="prettyprint">aria-labelledby</code>
   * attribute on the menu's root element, except possibly for menu buttons as discussed below. These attributes should not be supplied
   * for submenus, which are labeled automatically.
   *
   * <p>If a menu is shared by different launchers, and should have a different label for each launcher, then a
   * <a href="#event:beforeOpen">ojBeforeOpen</a> listener can be used to set a different label per launch.
   *
   * <p>For a menu launched exclusively by one or more [menu buttons]{@link oj.ojButton#menu}, these attributes are optional.  When the
   * menu is opened via the menu button UI, if neither attribute is present after all <a href="#event:beforeOpen">ojBeforeOpen</a>
   * listeners have been called, then <code class="prettyprint">aria-labelledby</code> will be set on the menu, referencing the menu
   * button, and will be removed when the menu is closed.  This approach provides a useful default label, while allowing the app to
   * supply a different label if desired, and while allowing the menu to be shared by several menu buttons and/or other launchers.
   *
   * <p>Disabled content: JET supports an accessible luminosity contrast ratio,
   * as specified in <a href="http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">WCAG 2.0 - Section 1.4.3 "Contrast"</a>,
   * in the themes that are accessible.  (See the "Theming" chapter of the JET Developer Guide for more information on which
   * themes are accessible.)  Note that Section 1.4.3 says that text or images of text that are part of an inactive user
   * interface component have no contrast requirement.  Because disabled content may not meet the minimum contrast ratio
   * required of enabled content, it cannot be used to convey meaningful information.<p>
   *
   *
   * <h3 id="reparenting-section">
   *   Reparenting
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#reparenting-section"></a>
   * </h3>
   *
   *  <p id="reparenting-strategy">
   *     When a menu is opened, it will be reparented in the document and reparented back when closed.
   *     The goal of this design is to maintain as much of the page author's document structure as possible, while
   *     avoiding most of the clipping and positioning issues of a completely inline design.
   *  </p>
   *  <p>
   *     If opened from another popup, the menu will be reparented to the nearest parent popup.
   *     Otherwise, the menu will be reparented to a container in the document body.
   *  </p>
   *  <p>
   *     The context of opening is defined by the resolved <code class="prettyprint">openOptions.launcher</code> value,
   *     which can be set via the <a href="#openOptions.launcher">attribute</a>, via the argument to the <a href="#open">open()</a>
   *     method, or via a <a href="#event:beforeOpen">ojBeforeOpen</a> listener.
   *  <p>
   *     All menus are assigned the same z-index values. The layering between peer popups reflects the opening order.
   *     In addition, the page author has control over z-index weights by way of the menu's layer.
   *     The menu's layer defines the "stacking context" and assignd the "oj-menu-layer" style.
   *  </p>
   *  <p>
   *     Some notable consequences of this design:
   *  </p>
   *  <ul>
   *    <li>Events raised within the menu will not bubble up to the menu's original ancestors.  Instead, listeners for menu events should
   *        be applied to either the menu's root element, or the document.</li>
   *    <li>Likewise, developers should not use CSS descendant selectors, or similar logic, that assumes that the menu will remain a child
   *        of its original parent.</li>
   *  </ul>
   *
   *
   * <h3 id="perf-section">
   *   Performance
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
   * </h3>
   *
   * <p>If a menu launcher (such as a [menu button]{@link oj.ojButton#menu} or item with a [context menu]{@link oj.baseComponent#contextMenu})
   * is stamped inside a table, dataGrid, or other container, the resulting set of launchers should share a single menu defined outside the container.
   *
   *
   * <h3 id="rtl-section">
   *   Reading direction
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
   * </h3>
   *
   * <p>The only supported way to set the reading direction (LTR or RTL) is to set the <code class="prettyprint">"dir"</code> attribute on the
   * <code class="prettyprint">&lt;html></code> element of the page.  As with any JET component, in the unusual case that the reading direction
   * is changed post-init, the menu must be <code class="prettyprint">refresh()</code>ed, or the page must be reloaded.
   *
   *
   * <h3 id="binding-section">
   *   Declarative Binding
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#binding-section"></a>
   * </h3>
   *
   * <p>For components like Menu and Buttonset that contain a number of like items, applications may wish to use an <code class="prettyprint">oj-bind-for-each</code> Knockout binding
   * to stamp out the contents as follows:
   *
   * <pre class="prettyprint">
   * <code>&lt;oj-menu id="menu" style="display:none" aria-label="Order Edit">
   *     &lt;oj-bind-for-each data="[[menuItems]]">
   *         &lt;template>
   *             &lt;oj-option :id="[[$current.data.id]]" :disabled="[[$current.data.disabled]]">
   *                 &lt;span>
   *                     &lt;oj-bind-text value="[[$current.data.label]]">&lt;/oj-bind-text>
   *                 &lt;/span>
   *             &lt;/oj-option>
   *         &lt;/template>
   *     &lt;/oj-bind-for-each>
   * &lt;/oj-menu>
   * </code></pre>
   *
   *
   * <!-- - - - - Above this point, the tags are for the class.
   *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
   *
   */


  oj.__registerWidget('oj.ojMenu', $.oj.baseComponent, {
    defaultElement: '<ul>',
    // added to externs.js, since this is an override of a superclass member.  (That's the rule for public methods, what about protected fields?)  TODO: Would @override do the job and be better than externing?
    delay: 300,
    // Doesn't get renamed even when unquoted and not in (our) externs.js file, so I'm leaving it unquoted for now.  TBD: This is private, but do NOT rename to _delay since there's an inherited instance method by that name, so rename so something else prefixed with _.
    role: 'menu',
    // private.  I moved from options to here since no longer public option.  Leave unquoted so gets renamed by GCC as desired.
    widgetEventPrefix: 'oj',
    options: {
      // options is in externs.js, so no need for quotes

      /**
       * Disables the menu if set to <code class="prettyprint">true</code>.
       *
       * @member
       * @name disabled
       * @memberof oj.ojMenu
       * @instance
       * @type {boolean}
       * @default false
       *
       * @example <caption>Initialize the menu with the <code class="prettyprint">disabled</code> attribute specified:</caption>
       * &lt;oj-menu disabled='true'>&lt;/oj-menu>
       *
       * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
       * // getter
       * var disabledValue = myMenu.disabled;
       *
       * // setter
       * myMenu.disabled = true;
       */
      // disabled option declared in superclass, but we still want the above API doc
      // Deprecated in release 2.1.0.  Should be removed when that release End-of-Lifes.
      // At that time, update the "if not ul" check in _ComponentCreate per comment there, and update non-ul unit tests to ensure we throw in that case.

      /**
       * Selector for the elements that serve as the menu container, including submenus.
       *
       * <p>Note: The <code class="prettyprint">menuSelector</code> attribute should not be changed after initialization. Existing submenus will not be updated.
       *
       * @expose
       * @memberof oj.ojMenu
       * @instance
       * @ignore
       * @type {string}
       * @default "ul"
       * @deprecated 2.1.0 Menus should always be created from an unordered list ( <code class="prettyprint">&lt;ul></code> ).
       *   This API will be removed in a future release.
       */
      menuSelector: 'ul',

      /**
       * <p>A collection of settings impacting the launch of a menu.  These <code class="prettyprint">openOptions</code>
       * may be accessed and overridden individually or collectively, as seen in the examples.
       *
       * <p>The values set here can be overridden on a per-launch basis by passing the corresponding params into the
       * <a href="#open">open</a> method.  Those per-launch values can be further customized by a
       * <a href="#event:beforeOpen">ojBeforeOpen</a> listener.
       *
       * <p>The built-in [menu button]{@link oj.ojMenuButton} and [context menu]{@link oj.baseComponent#contextMenu} functionality
       * overrides some of the Menu's <code class="prettyprint">openOptions</code>, for WAI-ARIA compliance and other reasons.
       * Thus, if the app really wants to customize
       * those values, it must do so in a <code class="prettyprint">ojBeforeOpen</code> listener.  If the built-in menu button
       * or context menu functionality is modified in this way, it is the app's responsibility to ensure that the result is
       * both correct and accessible.
       *
       * @expose
       * @memberof oj.ojMenu
       * @ojshortdesc Specifies settings for launching a menu. See the Help documentation for more information.
       * @instance
       * @type {Object}
       * @ojsignature { target: "Type",
       *                value: "oj.ojMenu.OpenOptions",
       *                jsdocOverride: true }
       *
       * @example <caption>Initialize the menu, setting some <code class="prettyprint">openOptions</code> values.</caption>
       * &lt;oj-menu open-options.initial-focus='true' open-options.launcher='myLauncher'>&lt;/oj-menu>
       *
       * @example <caption>Get or set the <code class="prettyprint">openOptions</code> attribute, after initialization:</caption>
       * // Get one
       * var value = myMenu.openOptions.launcher;
       *
       * // Get all
       * var values = myMenu.openOptions;
       *
       * // Set one, leaving the others intact
       * myMenu.setProperty('openOptions.initialFocus', 'none');
       *
       * // Set many.  Any existing openOptions not listed are lost
       * myMenu.openOptions = { 'launcher': 'myLauncher',
       *                        'initialFocus': 'firstItem',
       *                        'position': myPositionObj };
       */
      openOptions: {
        /**
         * <p>Determines whether the menu is displayed as a drop down menu or a sheet menu.
         *
         * <p>The default value is <code class="prettyprint">"auto"</code>, in which case the behavior depends on the
         * type of device, as determined by the <code class="prettyprint">Config.getDeviceRenderMode</code> method.
         * If the application is running on a phone device, the menu will display as a sheet.
         * Otherwise, the menu will display as a drop down.
         *
         * <p>Sheet menus are not appropriate when submenus are present.  Thus, menus having submenus are always displayed as
         * a drop down, regardless of the values of this option.
         *
         * @expose
         * @alias openOptions.display
         * @ojshortdesc Specifies whether the menu displays as a drop down or as a sheet. See the Help documentation for more information.
         * @memberof! oj.ojMenu
         * @instance
         * @since 2.1.0
         *
         * @type {string}
         * @default "auto"
         * @ojvalue {string} "auto" Displays the menu as a sheet or drop down, depending on the screen width.
         * @ojvalue {string} "dropDown" Displays the menu as a drop down.
         * @ojvalue {string} "sheet" Displays the menu as a sheet.
         *
         * @example <caption>Initialize the menu with the <code class="prettyprint">openOptions.display</code> sub-option specified:</caption>
         * &lt;oj-menu open-options.display='dropDown'>&lt;/oj-menu>
         *
         * @example <caption>Get or set the <code class="prettyprint">openOptions.display</code> sub-option, after initialization:</caption>
         * // getter
         * var display = myMenu.openOptions.display;
         *
         * // setter:
         * myMenu.setProperty('openOptions.display', 'sheet');
         */
        display: 'auto',

        /**
         * Determines focus behavior when the menu is initially opened.
         *
         * @expose
         * @alias openOptions.initialFocus
         * @ojshortdesc Specifies focus behavior when the menu is initially opened.
         * @memberof! oj.ojMenu
         * @instance
         * @type {string}
         * @default "menu"
         * @ojvalue {string} "none" Leaves focus where it is, e.g. on the launching component.  The application must verify that the result is accessible.
         * @ojvalue {string} "menu" Focuses the menu itself, with no menu item focused (e.g. typical Context Menu behavior).
         * @ojvalue {string} "firstItem" Focuses the first menu item (e.g. MenuButton <kbd>DownArrow</kbd> behavior).
         *
         * @example <caption>Initialize the menu with the <code class="prettyprint">openOptions.initialFocus</code> sub-option specified:</caption>
         * &lt;oj-menu open-options.initial-focus='firstItem'>&lt;/oj-menu>
         *
         * @example <caption>Get or set the <code class="prettyprint">openOptions.initialFocus</code> sub-option, after initialization:</caption>
         * // getter
         * var initialFocus = myMenu.openOptions.initialFocus;
         *
         * // setter:
         * myMenu.setProperty('openOptions.initialFocus', 'none');
         */
        initialFocus: 'menu',

        /**
         * <p>The DOM node (which may or may not be a JET element) that launches this menu.
         * This node must be focusable, as focus is returned to it upon menu dismissal.
         *
         * <p>The launcher must either be specified in this component option, or on each menu launch -- see <a href="#open">open()</a>
         * and <a href="#event:beforeOpen">ojBeforeOpen</a>.
         *
         * @expose
         * @alias openOptions.launcher
         * @ojshortdesc Specifies the DOM node that launches this menu. See the Help documentation for more information.
         * @memberof! oj.ojMenu
         * @instance
         * @type {string|Element}
         * @default null
         *
         * @example <caption>Initialize the menu with the <code class="prettyprint">openOptions.launcher</code> sub-option specified:</caption>
         * &lt;oj-menu open-options.launcher='myLauncher'>&lt;/oj-menu>
         *
         * @example <caption>Get or set the <code class="prettyprint">openOptions.launcher</code> sub-option, after initialization:</caption>
         * // getter
         * var launcher = myMenu.openOptions.launcher;
         *
         * // setter:
         * myMenu.setProperty('openOptions.launcher', 'myLauncher');
         */
        launcher: null,

        /**
         * <p>Determines the position of a drop down menu when launched via the <code class="prettyprint">open()</code> method or via menu button or
         * context menu functionality.  Ignored for sheet menus.
         *
         * <p>The "my" and "at" properties define alignment points relative to the menu and other element.  The "my" property represents the menu's
         * alignment where the "at" property represents the other element that can be identified by "of" or defauts to the launcher when the menu
         * opens.  The values of these properties describe horizontal and vertical alignments.</p>
         *
         * <ul>
         * <li>JET supports <code class="prettyprint">start</code> and <code class="prettyprint">end</code> values wherever <code class="prettyprint">left</code>
         * and <code class="prettyprint">right</code> are supported.  The <code class="prettyprint">start</code> value means "left in LTR; right in RTL",
         * while the <code class="prettyprint">end</code> value means "right in LTR; left in RTL."</li>
         * </ul>
         *
         * <p>Menu also supports the following extended syntax for the <code class="prettyprint">of</code> field:
         *
         * <ul>
         * <li>The <code class="prettyprint">"event"</code> keyword means "position the menu relative to the UI event that opened the menu."</li>
         * <li>The <code class="prettyprint">"launcher"</code> keyword means "position the menu relative to the launcher element."</li>
         * </ul>
         *
         * <p>By default, when the <code class="prettyprint">of</code> field is not set, the menu is positioned relative to the launcher.</p>
         *
         * <p>The default position value varies between menus and submenus as follows:
         * <ul>
         *   <li>Top level menu default: <code class="prettyprint">{ my: { horizontal: "start", vertical: "top" }, at: { horizontal: "start", vertical: "bottom" }, offset: { x: 0, y: 0 }, collision: "flipfit" }</code></li>
         *   <li>Submenu default: <code class="prettyprint">{ my: { horizontal: "start", vertical:  "top" }, at: { horizontal: "end", vertical: "top" }, offset: { x: 0, y: 0 }, collision: "flipfit" }</code></li>
         * </ul>
         *
         * <b>Deprecated v5.0.0 jQuery UI position syntax; Use of a percent unit with "my" or "at" is not supported.</b>
         *
         * @expose
         * @alias openOptions.position
         * @ojshortdesc Specifies the position of a drop down menu when launched. See the Help documentation for more information.
         * @memberof! oj.ojMenu
         * @instance
         * @type {Object}
         *
         * @example <caption>Initialize the menu with the <code class="prettyprint">openOptions.position</code> option specified:</caption>
         * &lt;oj-menu open-options.position.my.horizontal='start'>&lt;/oj-menu>
         *
         * @example <caption>Get or set the <code class="prettyprint">openOptions.position</code> sub-option, after initialization:</caption>
         * // Get one field of position object
         * var position = myMenu.openOptions.position.my;
         *
         * // Get entire position object
         * var position = myMenu.openOptions.position;
         *
         * // Set one field of position object, leaving the others intact
         * myMenu.setProperty('openOptions.position.at.horizontal', 'right');
         *
         * // Set entire position object. Any fields not listed are lost.
         * myMenu.setProperty('openOptions.position', {"my": {"horizontal": "start", "vertical": "bottom"},
         *                                             "at": {"horizontal": "end", "vertical": "top" },
         *                                             "offset": {"x": 0, "y":5}});
         */
        position: {
          /**
           * Defines which edge on the menu to align with the target ("of") element.
           *
           * @expose
           * @memberof! oj.ojMenu
           * @instance
           * @alias openOptions.position.my
           * @name openOptions.position.my
           * @type {{horizontal:string, vertical:string}}
           */
          my: {
            /**
             * Defines the horizontal alignment of the menu.
             * @expose
             * @memberof! oj.ojMenu
             * @instance
             * @alias openOptions.position.my.horizontal
             * @name openOptions.position.my.horizontal
             * @type {string}
             * @default 'start'
             * @ojvalue {string} "start" evaluates to "left" in LTR mode and "right" in RTL mode.
             * @ojvalue {string} "end" evaluates to "right" in LTR mode and "left" in RTL mode.
             * @ojvalue {string} "left"
             * @ojvalue {string} "center"
             * @ojvalue {string} "right"
             */
            horizontal: 'start',

            /**
             * Defines the vertical alignment of the menu.
             * @expose
             * @memberof! oj.ojMenu
             * @instance
             * @alias openOptions.position.my.vertical
             * @name openOptions.position.my.vertical
             * @type {string}
             * @default 'top'
             * @ojvalue {string} "top"
             * @ojvalue {string} "center"
             * @ojvalue {string} "bottom"
             */
            vertical: 'top'
          },

          /**
           * Defines a point offset in pixels from the ("my") alignment.
           * @expose
           * @memberof! oj.ojMenu
           * @instance
           * @alias openOptions.position.offset
           * @name openOptions.position.offset
           * @type {{x:number, y:number}}
           */
          offset: {
            /**
             * Horizontal alignment offset.
             * @expose
             * @memberof! oj.ojMenu
             * @instance
             * @alias openOptions.position.offset.x
             * @name openOptions.position.offset.x
             * @type {number}
             * @default 0
             */
            x: 0,

            /**
             * Vertical alignment offset.
             * @expose
             * @memberof! oj.ojMenu
             * @instance
             * @alias openOptions.position.offset.y
             * @name openOptions.position.offset.y
             * @type {number}
             * @default 0
             */
            y: 0
          },

          /**
           * Defines which position on the target element ("of") to align the positioned element
           * against.
           *
           * @expose
           * @memberof! oj.ojMenu
           * @instance
           * @alias openOptions.position.at
           * @name openOptions.position.at
           * @type {{horizontal:string, vertical:string}}
           */
          at: {
            /**
             * Defines the horizontal alignment of what the menu is aligned to. For top-level menus, the default value is "start". For submenus, the default value is "end".
             * @expose
             * @memberof! oj.ojMenu
             * @ojshortdesc Defines the horizontal alignment of what the menu is aligned to. See the Help documentation for more information.
             * @instance
             * @alias openOptions.position.at.horizontal
             * @name openOptions.position.at.horizontal
             * @type {string}
             * @ojvalue {string} "start" evaluates to "left" in LTR mode and "right" in RTL mode.
             * @ojvalue {string} "end" evaluates to "right" in LTR mode and "left" in RTL mode.
             * @ojvalue {string} "left"
             * @ojvalue {string} "center"
             * @ojvalue {string} "right"
             */
            horizontal: 'start',

            /**
             * Defines the vertical alignment of what the menu is aligned to. For top-level menus, the default value is "bottom". For submenus, the default value is "top".
             * @expose
             * @memberof! oj.ojMenu
             * @ojshortdesc Defines the vertical alignment of what the menu is aligned to. See the Help documentation for more information.
             * @instance
             * @alias openOptions.position.at.vertical
             * @name openOptions.position.at.vertical
             * @type {string}
             * @ojvalue {string} "top"
             * @ojvalue {string} "center"
             * @ojvalue {string} "bottom"
             */
            vertical: 'bottom'
          },

          /**
           * Which element to position the menu against.  The default is the
           * <code class="prettyprint">launcher</code> argument passed to the
           * <code class="prettyprint">open</code> method.
           *
           * If the value is a string, it should be a selector or the literal string value
           * of <code class="prettyprint">window</code>.  Otherwise, a point of x,y.  When a point
           * is used, the values are relative to the whole document.  Page horizontal and vertical
           * scroll offsets need to be factored into this point - see UIEvent
           * <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/pageX">pageX</a>,
           * <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/pageY">pageY</a>.
           *
           * @example <caption>Finding the point for an svg element:</caption>
           * var rect = svgDom.getBoundingClientRect();
           * var position = {of:{x:rect.left + window.pageXOffset, y:rect.top + window.pageYOffset}};
           *
           * @expose
           * @memberof! oj.ojMenu
           * @ojshortdesc Which element to position the menu against. See the Help documentation for more information.
           * @instance
           * @alias openOptions.position.of
           * @name openOptions.position.of
           * @type {string|{x: number, y: number}}
           */
          of: undefined,

          /**
           * Rule for alternate alignment.
           *
           * @expose
           * @memberof! oj.ojMenu
           * @instance
           * @alias openOptions.position.collision
           * @name openOptions.position.collision
           * @type {string}
           * @default 'flipfit'
           * @ojvalue {string} "flip" the element to the opposite side of the target and the
           *  collision detection is run again to see if it will fit. Whichever side
           *  allows more of the element to be visible will be used.
           * @ojvalue {string} "fit" shift the element away from the edge of the window.
           * @ojvalue {string} "flipfit" first applies the flip logic, placing the element
           *  on whichever side allows more of the element to be visible. Then the fit logic
           *  is applied to ensure as much of the element is visible as possible.
           * @ojvalue {string} "flipcenter" first applies the flip rule and follows with center alignment.
           * @ojvalue {string} "none" no collision detection.
           */
          // : Ensure menu stays onscreen (hence no autoscrolling/jumping the page to move it back onscreen), even when when
          // the screen is very small (phones, small desktop browser windows).  If the menu height is less than the viewport height, but
          // greater than the viewport height y-above and y-below the launcher, then with the default "flip" policy, the menu will appear
          // y-above or y-below the launcher, and the window will autoscroll vertically to display the menu, while with the "flipfit" policy, the
          // menu will appear z-above the launcher as needed to stay onscreen, so the window does not need to autoscroll vertically. Likewise horizontally.
          collision: 'flipfit'
        }
      },
      // Omitting the usual verbiage about whether the "other" sub-options are clobbered by a given setter syntax,
      // since only one sub-option currently.
      // TBD: restore that verbiage (copy from openOptions) if gain 2nd sub-option.

      /**
       * <p>A collection of settings impacting the launch of submenus.
       *
       * <p>This option affects submenus, while the similar <code class="prettyprint">openOptions</code> affects the top-level menu.
       *
       * @expose
       * @memberof oj.ojMenu
       * @instance
       * @ignore
       * @type {Object}
       */
      submenuOpenOptions: {
        /**
         * <p>Determines the position of submenus.
         *
         * <p>Please refer to the jQuery UI [Position]{@link http://api.jqueryui.com/position/} utility for details about the various choices.
         * In addition to that syntax, note that JET supports the following reading direction-aware extended syntax in the
         * <code class="prettyprint">my</code> and <code class="prettyprint">at</code> fields:
         *
         * <ul>
         * <li>JET supports <code class="prettyprint">start</code> and <code class="prettyprint">end</code> values wherever <code class="prettyprint">left</code>
         * and <code class="prettyprint">right</code> are supported.  The <code class="prettyprint">start</code> value means "left in LTR; right in RTL",
         * values in the <code class="prettyprint">my</code> and <code class="prettyprint">at</code> fields wherever <code class="prettyprint">left</code>
         * and <code class="prettyprint">right</code> are supported.  The <code class="prettyprint">start</code> value means "left in LTR; right in RTL",
         * while the <code class="prettyprint">end</code> value means "right in LTR; left in RTL."</li>
         *
         * <li>Similarly, JET supports <code class="prettyprint">></code> and <code class="prettyprint">&lt;</code> operators wherever <code class="prettyprint">+</code>
         * and <code class="prettyprint">-</code> are supported.  The <code class="prettyprint">></code> value means "+ in LTR; - in RTL",
         * while the <code class="prettyprint">&lt;</code> value means "- in LTR; + in RTL."  E.g. a <code class="prettyprint">my</code> value
         * of <code class="prettyprint">"start>40"</code> shifts the submenu 40px "endward," while a <code class="prettyprint">my</code> value
         * of <code class="prettyprint">"start&lt;40"</code> shifts the submenu 40px "startward."</li>
         * </ul>
         *
         * <p>By default, the submenu is positioned relative to the parent menu item, but if a value is set on
         * the <code class="prettyprint">of</code> field, then the submenu is positioned relative to that element or position instead.
         *
         * @expose
         * @alias submenuOpenOptions.position
         * @memberof! oj.ojMenu
         * @instance
         * @ignore
         * @type {Object}
         * @default { "my": "start top", "at": "end top", "collision": "flipfit" }
         */
        position: {
          /** @expose */
          my: 'start top',

          /** @expose */
          at: 'end top',
          collision: 'flipfit' // see comments on openOptions.position.collision

        }
      },
      // Events

      /**
       * Triggered when a default animation is about to start, such as when the component is
       * being opened/closed or a child item is being added/removed. The default animation can
       * be cancelled by calling <code class="prettyprint">event.preventDefault</code>.
       *
       * <caption>The default animations are controlled via the theme (SCSS) :</caption>
       * <pre class="prettyprint"><code>
       * // dropdown menu
       * $menuDropDownOpenAnimation: (effect: "zoomIn", transformOrigin: "#myPosition", duration: $animationDurationShort) !default;
       * $menuDropDownCloseAnimation: (effect: "none") !default;
       *
       * // sheet menu
       * $menuSheetOpenAnimation: (effect: "slideIn", direction: "top", duration: $animationDurationShort) !default;
       * $menuSheetCloseAnimation: (effect: "slideOut", direction: "bottom", duration: $animationDurationShort) !default;
       *
       * </code></pre>
       * @ojshortdesc Triggered when a default animation is about to start, such as when the component is
       * being opened/closed or a child item is being added/removed. The default animation can
       * be cancelled by calling event.preventDefault.
       *
       * @expose
       * @event
       * @memberof oj.ojMenu
       * @ojshortdesc Triggered when a default animation is about to start, such as when the component is being opened/closed or a child item is being added/removed.
       * @instance
       * @ojcancelable
       * @ojbubbles
       * @property {"open"|"close"} action The action that is starting the animation.
       *            The number of actions can vary from element to element.
       *            Suggested values are:
       *                    <ul>
       *                      <li>"open" - when a menu element is opened</li>
       *                      <li>"close" - when a menu element is closed</li>
       *                    </ul>
       * @property {!Element} element target of animation
       * @property {!function():void} endCallback If the event listener calls
       *            event.preventDefault to cancel the default animation, it must call the
       *            endCallback function when it finishes its own animation handling and any
       *            custom animation has ended.
       *
       * @example <caption>Add a listener for the
       *          <code class="prettyprint">ojAnimateStart</code> event to override the default
       *          "open" animation:</caption>
       * myMenu.addEventListener("ojAnimateStart", function( event )
       *   {
       *     // verify that the component firing the event is a component of interest and action
       *      is open
       *     if (event.detail.action == "open") {
       *       event.preventDefault();
       *       oj.AnimationUtils.fadeIn(event.detail.element).then(event.detail.endCallback);
       *   });
       *
       * @example <caption>Add a listener for the
       *          <code class="prettyprint">ojAnimateStart</code> event to override the default
       *          "close" animation:</caption>
       * myMenu.addEventListener("ojAnimateStart", function( event )
       *   {
       *     // verify that the component firing the event is a component of interest and action
       *      is close
       *     if (event.detail.action == "close") {
       *       event.preventDefault();
       *       oj.AnimationUtils.fadeOut(event.detail.element).then(event.detail.endCallback);
       *   });
       */
      animateStart: null,

      /**
       * Triggered when a default animation has ended, such as when the component is being
       * opened/closed or a child item is being added/removed. This event is not triggered if
       * the application has called preventDefault on the animateStart
       * event.
       *
       * @expose
       * @event
       * @memberof oj.ojMenu
       * @ojshortdesc Triggered when a default animation has ended, such as when the component is being opened/closed or a child item is being added/removed.
       * @instance
       * @ojcancelable
       * @ojbubbles
       * @property {!Element} element target of animation
       * @property {"open"|"close"} action The action that is ending the animation.
       *                   The number of actions can vary from element to element.
       *                   Suggested values are:
       *                    <ul>
       *                      <li>"open" - when a menu element is opened</li>
       *                      <li>"close" - when a menu element is closed</li>
       *                    </ul>
       *
       * @example <caption>Add a listener for the
       *          <code class="prettyprint">ojAnimateEnd</code> event to listen for the "open"
       *          ending animation:</caption>
       * myMenu.addEventListener("ojAnimateEnd", function( event )
       *   {
       *     // verify that the component firing the event is a component of interest and action
       *      is open
       *     if (event.detail.action == "open") {}
       *   });
       *
       * @example <caption>Add a listener for the
       *          <code class="prettyprint">ojAnimateEnd</code> event to listen for the "close"
       *          ending animation:</caption>
       * myMenu.addEventListener("ojAnimateEnd", function( event )
       *   {
       *     // verify that the component firing the event is a component of interest and action
       *      is close
       *     if (event.detail.action == "close") {}
       *   });
       */
      animateEnd: null,
      // Benefit of making openOptions live is this:
      //
      // - For MenuButton and ContextMenu, the app doesn't control the call to Menu.open().
      // - Our internal call to this method may pass in overrides to things like "initialFocus", in cases where the Right Thing for (say) MenuButtons differs
      //   from Menu's default option value (which may be tailored to, say, contextMenus).
      //     - This way, we don't have to rely on the app to set these things correctly, and we don't have to permanently set the Menu's options, which may be
      //       shared between (say) a MenuButton, a ContextMenu, and some custom app usage of the menu.
      // - The remaining piece of the puzzle is to give the app a way to override the values set in our internal call to open().  A live payload field handles this.
      //
      // If ever needed, we can add a "submenuOpenOptions" payload field alongside the "openOptions" field.

      /**
       * <p>Triggered before this menu is launched via the <a href="#open">open</a> method or via menu button or context menu functionality.
       * The launch can be cancelled by calling <code class="prettyprint">event.preventDefault()</code>.
       *
       * <p>The <code class="prettyprint">event.detail.openOptions</code> payload field contains the settings being used for this menu launch,
       * resulting from merging the <code class="prettyprint">openOptions</code> passed to <code class="prettyprint">open()</code>, if any,
       * with the <code class="prettyprint">openOptions</code> component option.
       *
       * <p>This field is "live", meaning that the listener can alter fields such as <code class="prettyprint">position</code> to affect this launch without
       * affecting the component option.  Since these changes are applied to the merged object, they supersede both the <code class="prettyprint">openOptions</code>
       * passed to <code class="prettyprint">open()</code> and the <code class="prettyprint">openOptions</code> component option.
       *
       * <p>If any of the above techniques are used to alter the built-in [menu button]{@link oj.ojButton#menu} or [context menu]{@link oj.baseComponent#contextMenu}
       * functionality, it is the app's responsibility to ensure that the result is both correct and accessible.
       *
       * @expose
       * @event
       * @memberof oj.ojMenu
       * @ojshortdesc Triggered before this menu is launched. See the Help documentation for more information.
       * @instance
       * @ojcancelable
       * @ojbubbles
       * @property {Object} openOptions effecting the open operation
       * @ojsignature {target:"Type", value:"oj.ojMenu.OpenOptions", for:"openOptions", jsdocOverride:true}
       */
      beforeOpen: null,

      /**
       * <p>Triggered after this menu is closed.
       *
       * @expose
       * @event
       * @memberof oj.ojMenu
       * @instance
       * @since 2.0.0
       * @property {Event} event a custom event
       */
      close: null,

      /**
       * Triggered when the menu is created.
       *
       * @event
       * @name create
       * @memberof oj.ojMenu
       * @instance
       * @ignore
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Currently empty
       */
      // create event declared in superclass, but we still want the above API doc

      /**
       * <p>Triggered when the active menu item changes.  Private; do not use.
       *
       * <p>Internal notes:
       *
       * <p>We've replaced JQUI's focus/blur events with this internal event, and made their focus/blur methods internal.
       * It's been agreed with the architects that if we ever need any of this API
       * to be public, we'll have a focusedItem option, read-only or R/W, with an optionChange event, instead
       * of the removed API.  (Exact name TBD, but they favored focusedRow, with "ed",  for Table if it had an option rather than
       * a method.)  If for some reason we keep a separate event instead of an optionChange event, do NOT call this event
       * "focusedItem", since that will prevent ever having an "focusedItem" option since same namespace.  Instead, call this
       * "focusedItemChange" in that case.
       *
       * <p>In the meantime, we'll keep firing this private event, since it's used so extensively and usefully in the unit tests to make sure
       * other stuff works, and since keeping this working and tested means that we can just change the name to optionChange if
       * we ever need the public event.
       *
       * <p>The difference between this method and JQUI's focus event is that it fires for blurs too, it doesn't fire if the old
       * and new active item are the same, and we fire a single event, not both a blur and focus, when the active state moves from item A to
       * item B.
       *
       * @event
       * @name _activeItem
       * @memberof oj.ojMenu
       * @instance
       * @private
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.previousItem the previously focused menu item
       * @property {jQuery} ui.item the currently focused menu item
       *
       * @example <caption>Initialize the menu with the <code class="prettyprint">_activeItem</code> callback specified:</caption>
       * $( ".selector" ).ojMenu({
       *     "_activeItem": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">oj_activeitem</code> event:</caption>
       * // $( ".selector" ) must select either the menu root, or the document, due to reparenting
       * $( ".selector" ).on( "oj_activeitem", function( event, ui ) {} );
       */

      /**
       * <p>Triggered after this menu is launched via the <a href="#open">open</a> method or via menu button or context menu functionality.
       *
       * @expose
       * @event
       * @memberof oj.ojMenu
       * @ojshortdesc Triggered after this menu is launched.
       * @instance
       * @since 2.0.0
       * @property {Event} event a custom event
       */
      open: null,

      /**
       * <p>Triggered when a menu item (other than the built-in <a href="#dismissal-section">"Cancel"</a> item) is selected.
       *
       * <p>To ensure keyboard accessibility, the only correct, supported way to react to the selection of a menu item is to listen
       * for this event.  Click listeners and <code class="prettyprint">href</code> navigation should not be used.
       *
       * <p>To find the value of the menu item that triggered an action event, the event.target.value should be used.
       *
       * @expose
       * @event
       * @memberof oj.ojMenu
       * @ojshortdesc Triggered when a menu item is selected. To ensure keyboard accessibility, the only correct, supported way to react to the selection of a menu item is to listen for this event. See the Help documentation for more information.
       * @instance
       * @ojcancelable
       * @ojbubbles
       * @ojeventgroup common
       * @since 4.0.0
       * @example <caption>Find the value of the selected menu item:</caption>
       *   myMenu.addEventListener("ojAction", function( event )
       *   {
       *     // the target of the action event is the selected &lt;oj-option> element
       *     var itemSelected = event.target;
       *
       *     // find the 'value' of the selected &lt;oj-option> element
       *     var selectedValue = itemSelected.value;
       *   });
       */
      action: null
    },

    /**
     * @memberof oj.ojMenu
     * @instance
     * @protected
     * @override
     */
    _ComponentCreate: function _ComponentCreate() {
      // Override of protected base class method.  Method name needn't be quoted since is in externs.js.
      this._super(); // Create aliases, that won't be renamed, for the private methods that are called by unit tests.  These unit tests come
      // from JQUI, in which these methods were actually public.  With these aliases, we don't have to @expose private method names
      // (which prevents renaming and bloats minified code), and our internal calls to these methods can be this._focus rather than this["_focus"].
      // TBD: perhaps the unit tests could simulate keyboard events rather than calling these methods.


      this._focusForTesting = this._focus;
      this._nextForTesting = this._next;
      this._selectForTesting = this._select; // Cancel menu item is supported for custom elements, so we only need the following check for the old syntax

      if (!this._IsCustomElement()) {
        this._createAsTopLevelMenu();
      } else {
        this.element.hide(); // insist menu is initially hidden
        // fixup the position option if custom element menu or submenu

        var options = this.options;
        options.openOptions.position = oj.PositionUtils.coerceToJet(options.openOptions.position);
        var deferredChild = this.element[0].querySelector('oj-defer');

        if (deferredChild) {
          // oj-menu supports only one oj-defer as immediate child of the menu
          // Adding data-oj-context in order to ensure all components within the oj-defer
          // are upgraded and rendered before positioning the menu ()
          // TODO: Consider a general solution to handle busy context of menu children
          // to handle asynchronous initialization of menu items beyond this case
          deferredChild.setAttribute('data-oj-context', true);
        }
      }
    },
    _createAsTopLevelMenu: function _createAsTopLevelMenu() {
      var self = this;
      this.activeMenu = this.element; // flag used to prevent firing of the click handler as the event bubbles up through nested menus

      this.mouseHandled = false;

      this._setupSwipeBehavior();

      this.element.uniqueId().addClass('oj-menu oj-component').hide().attr({
        role: this.role,
        tabIndex: '0',
        'aria-hidden': 'true'
      }); // pass true to catch these events on all menus, not just enabled menus

      this._on(true, {
        // Required to stick the focus on disabled menu.
        'mousedown .oj-menu-item': function mousedownOjMenuItem(event) {
          if (this.options.disabled) {
            event.preventDefault();
          }
        },
        click: function click(event) {
          if (this.options.disabled) {
            event.preventDefault();
          }
        },
        // On Esc key focus should be shifted to launcher and dismiss menu.
        // the TAB key should also implicitly dismiss the menu
        keydown: function keydown(event) {
          if (this.options.disabled) {
            if (event.keyCode === $.ui.keyCode.ESCAPE || event.keyCode === $.ui.keyCode.TAB) {
              if (event.keyCode === $.ui.keyCode.TAB) {
                event.preventDefault();
              }

              this._focusLauncherAndDismiss(event);
            }
          }
        }
      }); // needed since _setOption() is not automatically called at create time.
      // TBD: Would be a little better to toggle these 2 things rather than only setting them if true, as in superclass _setOption().


      if (this.options.disabled) {
        this.element.addClass('oj-disabled').attr('aria-disabled', 'true');
      }

      var handleMouseEnterMenuItem = function (event) {
        // the focusHandled var ensures that this handler only runs for the target
        // menu item, not for the parent menu items to which the event bubbles. Without it, submenu item becomes
        // non-selectable if mouse outside menu on way from parent item to sub (), and flakiness
        // where sometimes a tap on a menu item inside the submenu doesn't "take" in touch scenarios.
        if (this.focusHandled) {
          return;
        }

        this.focusHandled = true;
        var target = $(event.currentTarget);

        try {
          this._focusIsFromPointer = true;

          this._focus(event, target);
        } finally {
          this._focusIsFromPointer = false;
        }
      }.bind(this);

      var handleMouseLeave = function (event) {
        // Only handle mouseleave if the mouse is leaving the menu, not if
        // the menu is disappearing out from under the mouse.  The latter
        // happens when the mouse is over a submenu, and the submenu is closed
        // via the keyboard (e.g. leftArrow, Esc).  If the callee is called at
        // that time, then a timer clears this.active, which breaks KB nav.
        if (!$(event.target).is(':visible')) {
          return;
        }

        this._collapse(event, 'eventSubtree');
      }.bind(this);

      this._touchStartHandler = function () {
        // when the touchstart event bubbles out of the root menu element, we're done with it, so
        // reset this flag to its initial value of false in preparation for the next touch
        this.focusHandled = false;
      };

      this.element[0].addEventListener('touchstart', this._touchStartHandler, {
        passive: true
      });

      this._delegatedHandleMouseEnterMenuItem = function (event) {
        var selector = '.oj-menu-item';
        var container = event.currentTarget;
        var targetElement = event.target.closest(selector);

        if (targetElement && container.contains(targetElement)) {
          handleMouseEnterMenuItem($.Event(event, {
            currentTarget: targetElement
          }));
        }
      }; // : Bad touch device behavior because the JQUI code relies on the above mouseenter handler to call _focus(),
      // but for parent menu items on touch devices, mouseenter is called only if the previous tap was somewhere outside the
      // parent menu item, not if it was in the submenu.  So call that mouseenter handler on touchstart:


      this.element[0].addEventListener('touchstart', this._delegatedHandleMouseEnterMenuItem, {
        passive: true
      });

      this._on({
        // Prevent focus from sticking to links inside menu after clicking
        // them (focus should always stay on UL during navigation).
        // 'mousedown .oj-menu-item > a': function (event) {
        //  event.preventDefault();
        // },
        'click .oj-disabled > a': function clickOjDisabledA(event) {
          event.preventDefault();
        },
        click: function click() {
          // when the click event bubbles out of the root menu element, we're done with it, so
          // reset this flag to its initial value of false in preparation for the next click
          this.mouseHandled = false;
        },
        mouseover: function mouseover() {
          // when the mouseover event bubbles out of the root menu element, we're done with it, so
          // reset this flag to its initial value of false in preparation for the next mouse hover.
          // Note that this flag is reset in mouseover event and not in a mouseenter event; mouseover
          // bubbles to the root element, but mouseenter does not.
          this.focusHandled = false;
        },
        'click .oj-menu-item:has(a)': function clickOjMenuItemHasA(event) {
          var target = $(event.target).closest('.oj-menu-item'); // the mouseHandled var ensures that the click is handled only for the originally clicked
          // menu item, not for the parent menu items to which it bubbles.

          if (!this.mouseHandled && target.not('.oj-disabled').length) {
            this.mouseHandled = true; // prevent page scrolling and appending # to page URL, which can interfere with routing, etc.
            // Do this before the bailout so these things are prevented when user clicks a 2nd time on parent menu item.
            // No need to additionally do this for Enter/Space handler, because menu root, not the anchor, has browser focus
            // in that case, so anchor click behavior doesn't happen, so doesn't need to be prevented.

            event.preventDefault();

            if (this.active && this.active.closest(target).length && this.active.get(0) !== target.get(0)) {
              // If current active menu item  is decendent of (and not equal to) target menu item then
              // sub menu of the curent target is already open and hence no need to
              // 1. expand the sub menu
              // 2. as current target is a menu item having sub menu no need to invoke this._select(event).
              return;
            } // Open submenu on click


            if (target.has('.oj-menu').length) {
              this._expand(event);
            } else {
              // Invoke _select() only for leaf menu items
              this._select(event);

              if (!this.element.is(':focus')) {
                // Redirect focus to the menu
                this.element.trigger('focus', [true]); // If the active item is on the top level, let it stay active.
                // Otherwise, blur the active item since it is no longer visible.

                if (this.active && this.active.parents('.oj-menu').length === 1) {
                  if (this._clearTimer) {
                    this._clearTimer();
                  }
                }
              }
            }
          }
        },
        'mouseenter .oj-menu-item': handleMouseEnterMenuItem,
        mouseleave: handleMouseLeave,
        'mouseleave .oj-menu': handleMouseLeave,
        focus: function focus(event, keepActiveItem) {
          if (!keepActiveItem && event.target !== this.element[0] && !(this._focusSkipLink && event.target === this._focusSkipLink.getLink()[0])) {
            // If there's already an active item, keep it active
            // If not, make the first item active
            // TBD: is there a reason that JQUI needed to redundantly call _focus() on this.active when this.active was already set?
            //      Or should we only call it when it's not set and we're calling it on the first menu item?
            var item = this.active || $(_findImmediateMenuItems(this.element)).first(0);

            this._focus(event, item);
          }
        },
        keydown: this._keydown,
        keyup: function keyup(event) {
          if (event.keyCode === $.ui.keyCode.ENTER || event.keyCode === $.ui.keyCode.SPACE) {
            this.__spaceEnterDownInMenu = false;
          }
        }
      });

      this._focusable({
        // suppress focus ring for Mac Safari due to platform repainting bug in which previous item's outline is not fully erased
        applyHighlight: !_IS_MAC_SAFARI,
        recentPointer: function recentPointer() {
          return self._focusIsFromPointer;
        },
        setupHandlers: function setupHandlers(focusInHandler, focusOutHandler) {
          self._focusInHandler = focusInHandler;
          self._focusOutHandler = focusOutHandler;
        }
      }); // callback that overrides the position['using'] for auto dismissal when aligning element is cropped.


      this._usingCallback = $.proxy(this._usingHandler, this);

      this._setup();
    },
    _createAsSubmenu: function _createAsSubmenu() {
      // set special container name as this should have submenu defaults
      this.element.attr(Components._OJ_CONTAINER_ATTR, this.widgetName);
      this.element.uniqueId().addClass('oj-menu oj-component oj-menu-submenu oj-menu-dropdown') // submenus are always dropdown
      .hide().attr({
        role: this.role,
        tabIndex: '0',
        'aria-hidden': 'true'
      });

      this._setup();
    },
    // Resolves a Mobile Safari issue that occurs because mousedown fires after the touchend.
    // To be called only by baseComponent's contextMenu logic, which explains the issue more fully.
    // Gets/sets a static var, since the listener that needs to know whether to bail out is static
    // (shared by all menu instances).
    __contextMenuPressHoldJustEnded: function __contextMenuPressHoldJustEnded(val) {
      if (arguments.length) {
        _contextMenuPressHoldJustEnded = val;
        return undefined;
      }

      return _contextMenuPressHoldJustEnded;
    },
    _processOjOptions: function _processOjOptions() {
      function _findImmediateOptions(activeMenu) {
        var menuItems = [];
        var deferredChild = activeMenu.children('oj-defer').first();
        var children;

        if (deferredChild.length > 0) {
          children = deferredChild.children('oj-option, oj-menu-select-many');
        } else {
          children = activeMenu.children('oj-option, oj-menu-select-many');
        }

        for (var i = 0; i < children.length; i++) {
          var child = $(children[i]);

          if (child[0].nodeName === 'OJ-OPTION') {
            menuItems.push(child[0]);
          } else if (child[0].nodeName === 'OJ-MENU-SELECT-MANY') {
            menuItems = $.merge(menuItems, child.children('oj-option'));
          }
        }

        return $(menuItems);
      }

      this._maxEndIconCount = 0;
      this._maxStartIconCount = 0;
      this._startIconWidth = 0;
      this._endIconWidth = 0;

      var ojOptions = _findImmediateOptions(this.element); // clear out any roles or classes that we may have previously set


      this._clearOption(ojOptions);

      for (var i = 0; i < ojOptions.length; i++) {
        var option = ojOptions[i];
        option.customOptionRenderer = this._customOptionRenderer.bind(this);
      }
    },
    _customOptionRenderer: function _customOptionRenderer(optionDom) {
      function getPrevSibling(element) {
        if (element.previousElementSibling && element.previousElementSibling.nodeName === 'OJ-OPTION') {
          return element.previousElementSibling;
        } else if (element.previousElementSibling && element.previousElementSibling.nodeName === 'OJ-MENU-SELECT-MANY') {
          var node = element.previousElementSibling.lastElementChild;

          if (node.nodeName === 'OJ-OPTION') {
            return node;
          } else if (node.previousElementSibling) {
            return node.previousElementSibling;
          }

          return getPrevSibling(node);
        } else if (!element.previousElementSibling && element.parentElement.nodeName === 'OJ-MENU-SELECT-MANY') {
          return getPrevSibling(element.parentElement);
        }

        return undefined;
      }

      function getNextSibling(element) {
        if (element.nextElementSibling && element.nextElementSibling.nodeName === 'OJ-OPTION') {
          return element.nextElementSibling;
        } else if (element.nextElementSibling && element.nextElementSibling.nodeName === 'OJ-MENU-SELECT-MANY') {
          return element.nextElementSibling.firstElementChild;
        } else if ((!element.nextElementSibling || element.nextElementSibling.nodeName !== 'OJ-OPTION') && element.parentElement.nodeName === 'OJ-MENU-SELECT-MANY') {
          return getNextSibling(element.parentElement);
        }

        return undefined;
      }

      function initDividerNeighbors(dividerDom) {
        var sibling = getPrevSibling(dividerDom);

        if (sibling) {
          $(sibling).addClass('oj-menu-item-before-divider');
        }

        sibling = getNextSibling(dividerDom);

        if (sibling) {
          $(sibling).addClass('oj-menu-item-after-divider');
        }
      }

      function initLogicalFirstLastChildOverride(element) {
        // if the menu item is the .oj-menu-item:first-child of the oj-menu-select-many and
        // logical top, add a marker selector
        if (!element.previousElementSibling && !getPrevSibling(element)) {
          $(element).addClass('oj-top');
        } // if the menu item is the .oj-menu-item:last-child of the oj-select-many and
        // the logical bottom, add the marker class.  the oj-select-many can have a hidden
        // storage node as the last item due to the oj-bind-if in the view template


        if ((!element.nextElementSibling || element.nextElementSibling.nodeName !== 'OJ-OPTION') && !getNextSibling(element)) {
          $(element).addClass('oj-bottom');
        }
      } // Implement custom rendering here...


      var ojOption = $(optionDom);
      var isCheckableMenuItem = ojOption.parent().prop('nodeName') === 'OJ-MENU-SELECT-MANY';
      var self = this;
      this._hasSubmenus = false; // if 'a' tag already exists, we need to remove it and re-render content

      var anchors = ojOption.children('a[ojmenu="opt"]');
      var customAnchor;

      for (var i = 0; i < anchors.length; i++) {
        customAnchor = $(anchors[i]); // reset existing slots, and remove the custom anchor

        customAnchor.children().removeClass('oj-menu-item-icon').removeClass('oj-menu-item-end-icon');
        customAnchor.replaceWith(customAnchor.contents()); // @HTMLUpdateOK replace previous anchor with trusted new DOM
      } // remove generated checkbox icons


      ojOption.children('span[ojmenu="opt"]').remove(); // test to see if this is a divider

      if (!/[^\-\u2014\u2013\s]/.test(ojOption.text())) {
        // hyphen, em dash, en dash
        this._initDividers(ojOption);

        initDividerNeighbors(optionDom);
      } else {
        this._initMenuItems(ojOption); // create 'a' tag


        var a = document.createElement('a');
        a.setAttribute('href', '#'); // tag with ojmenu attribute to identify it later

        a.setAttribute('ojmenu', 'opt');
        customAnchor = $(a);
        customAnchor.uniqueId().attr({
          tabIndex: '-1',
          role: this._itemRole(ojOption)
        });

        if (isCheckableMenuItem) {
          customAnchor.attr('aria-checked', 'false');
          initLogicalFirstLastChildOverride(optionDom);
        }

        ojOption.prepend(a); // @HTMLUpdateOK append trusted new DOM to menu item
        // reparent the slots, and make sure any necessary styling is applied

        var slots = oj.BaseCustomElementBridge.getSlotMap(optionDom); // handle startIcon slot

        var startIcons = slots.startIcon;

        if (startIcons || isCheckableMenuItem) {
          if (isCheckableMenuItem) {
            var checkedIcon = document.createElement('span');
            checkedIcon.setAttribute('slot', 'startIcon');
            checkedIcon.setAttribute('ojmenu', 'opt');
            checkedIcon.setAttribute('class', 'oj-menucheckbox-icon');

            if (!startIcons) {
              startIcons = [checkedIcon];
            } else {
              startIcons.splice(0, 0, checkedIcon);
            }
          }

          var startIconCount = startIcons.length;
          self._maxStartIconCount = Math.max(self._maxStartIconCount, startIconCount);
          $.each(startIcons, function (_i, node) {
            $(node).addClass('oj-menu-item-icon');
            customAnchor.append(node); // @HTMLUpdateOK reparent trusted child DOM in menu item
            // positioning logic doesn't need to run if there is only 1 start icon

            if (startIconCount > 1) {
              self._positionStartIcon(node, _i, startIconCount);
            }
          });
        } // check number of endIcons before handling default slots in case there are submenu icons specified


        var endIconCount = 0;
        var endIcons = slots.endIcon;

        if (endIcons) {
          endIconCount = endIcons.length;
          self._maxEndIconCount = Math.max(self._maxEndIconCount, endIconCount);
        } // handle default slot


        var defaultSlots = slots[''];
        $.each(defaultSlots, function (_i, node) {
          // handle the submenu case
          if ($(node).is('oj-menu')) {
            self._setupSubmenu(customAnchor, $(node), endIconCount === 0);

            self._hasSubmenus = true;
          } else {
            customAnchor.append(node); // @HTMLUpdateOK reparent trusted child DOM in menu item
          }
        }); // handle endIcon slot

        if (endIcons) {
          $.each(endIcons, function (_i, node) {
            $(node).addClass('oj-menu-item-end-icon');
            customAnchor.append(node); // @HTMLUpdateOK reparent trusted child DOM in menu item
            // positioning logic doesn't need to run if there is only 1 end icon

            if (endIconCount > 1) {
              self._positionEndIcon(node, _i, endIconCount);
            }
          });
        } // check for disabled state in case all we need to do is update disabled attribute


        if (optionDom.disabled) {
          ojOption.addClass('oj-disabled');
          customAnchor.attr('aria-disabled', 'true');
        } else {
          ojOption.removeClass('oj-disabled');
          customAnchor.removeAttr('aria-disabled');
        }
      }
    },
    // Helper method to position start icons
    _positionStartIcon: function _positionStartIcon(node, index, count) {
      var marginProperty;

      if (this.isRtl) {
        marginProperty = 'margin-right';
      } else {
        marginProperty = 'margin-left';
      }

      var margin = parseInt($(node).css(marginProperty), 10); // margins are negative for start icons

      this._startIconWidth = -1 * margin;
      $(node).css(marginProperty, margin * (count - index) + 'px');
    },
    // Helper method to position end icons
    _positionEndIcon: function _positionEndIcon(node, index, count) {
      var marginProperty;
      var widthProperty;

      if (this.isRtl) {
        marginProperty = 'margin-left';
        widthProperty = 'margin-right';
      } else {
        marginProperty = 'margin-right';
        widthProperty = 'margin-left';
      }

      var margin = parseInt($(node).css(marginProperty), 10); // margins are negative for end icons

      this._endIconWidth = -1 * parseInt($(node).css(widthProperty), 10);
      $(node).css(marginProperty, margin + this._endIconWidth * (count - index - 1) + 'px');
    },
    // Helper method to handle menu item padding updates
    _updateMenuPadding: function _updateMenuPadding($menu) {
      var anchors = $(_findImmediateMenuItems($menu)).children();
      var iconCount = anchors.children('.oj-menu-item-icon:not(.oj-menu-cancel-icon)').length; // icons other than cancel item's icon

      $menu.toggleClass('oj-menu-icons', !!iconCount).toggleClass('oj-menu-text-only', !iconCount);

      if (this._maxStartIconCount && this._maxStartIconCount > 1) {
        this._applyAnchorIconPadding(anchors, this._startIconWidth, this._maxStartIconCount, true);
      }

      var endIconCount = anchors.children('.oj-menu-item-end-icon').length;
      $menu.toggleClass('oj-menu-end-icons', !!endIconCount);

      if (this._maxEndIconCount && this._maxEndIconCount > 1) {
        this._applyAnchorIconPadding(anchors, this._endIconWidth, this._maxEndIconCount, false);
      }
    },
    // Helper method to apply icon padding to menu item anchors
    _applyAnchorIconPadding: function _applyAnchorIconPadding(anchors, iconWidth, count, isStart) {
      var paddingProperty;

      if (this.isRtl && isStart || !this.isRtl && !isStart) {
        paddingProperty = 'padding-right';
      } else {
        paddingProperty = 'padding-left';
      }

      anchors.each(function () {
        var padding = parseInt($(this).css(paddingProperty), 10);
        $(this).css(paddingProperty, padding + iconWidth * (count - 1) + 'px');
      });
    },

    /**
     * @instance
     * @private
     * @param {!jQuery.Event|Event} event
     */
    _clickAwayHandler: function _clickAwayHandler(event) {
      // Focus event needs to be captured because, in case of menu button (where focus is still on menu button instead of open menu), if user does
      // a taboff to another element then menu should be closed. With this we also no need to have additional "blur" handler on menu to close the menu/submenus.
      // Despite of focus/mousedown, still keydown listener is required for contextmenu events especially for menubutton with browser default context menu
      // and user pressed contextmenu keyboard key(not right mouse click).
      if (event.type === 'focus' || event.type === 'mousedown' || event.type === 'touchstart' || event.keyCode === 121 && event.shiftKey || event.keyCode === 93) {
        // Windows contextMenu key (93) or Shift-F10 (121)
        // Resolves a Mobile Safari issue that occurs because mousedown fires after the touchend.
        // baseComponent's contextMenu logic explains the issue more fully.
        if (event.type === 'mousedown' && _contextMenuPressHoldJustEnded) {
          return;
        }

        var self = this; // Clone _openPopupMenus as __dismiss() will remove the open menu from _openPopupMenus list

        var openPopupMenus = _openPopupMenus.slice(0, _openPopupMenus.length);

        $.each(openPopupMenus, function (index, menu) {
          // This logic dismisses/collapses the menu if event is outside the menu and any of the following are true:
          // - Event is a touchstart (which may or may not become a pressHold) or left/middle mousedown, unless (event is in launcher and this is not a context menu).  "Unless" clause needed for menuButton.
          // - Event is focusing something outside of both the menu and launcher.
          // - Event is a context-menu-launching event other than pressHold.  (i.e. right-click or CM keys)
          if (!$(event.target).closest(menu.element).length && ( // if event target is outside of menu element AND one of the following is true then close the menu.
          event.type === 'keydown' || event.type === 'mousedown' && event.which === 3 || // 1. if it's a context-menu-launching event other than pressHold (see event.which on outer if)
          !$(event.target).closest(menu._launcher).length || // 2. When focus is moved on to other than launcher or left/middle mousedown or touchstart on element other than launcher
          menu._launcherClickShouldDismiss && (event.type === 'mousedown' && event.which !== 3 || event.type === 'touchstart'))) {
            // 3. If event is a (left/middle-mousedown or touchstart) on launcher and current menu is contextmenu (see )
            // Don't do it again if the menu is already being dismissed
            if (!menu._dismissEvent) {
              // eslint-disable-next-line no-param-reassign
              menu._dismissEvent = event;

              var promise = menu._collapse(event, 'eventSubtree'); // "eventSubtree" is effectively "all" since we check that event is outside menu.  "all" would be clearer, but just in case, leaving it as is.
              // Wait for subtree to be collapsed before dismissing self.
              // There is no default close animation, but this allows app to define
              // cascading close animation if it wants to.


              self._runOnPromise(promise, function () {
                menu.__dismiss(event); // eslint-disable-next-line no-param-reassign


                menu._dismissEvent = null;
              });
            }
          }
        });
      }
    },

    /**
     * @memberof oj.ojMenu
     * @instance
     * @protected
     * @param {string} key option name
     * @param {?Object} value of the target option identified by the key
     * @override
     */
    // eslint-disable-next-line no-unused-vars
    _setOption: function _setOption(key, value) {
      // Override of protected base class method.  Method name needn't be quoted since is in externs.js.
      this._superApply(arguments); // TBD: consider calling super at end, so that optionChange (fired at end of super) is fired at very end


      switch (key) {
        case 'translations':
          // no refresh() needed to just change text of existing inited menu item
          if (this._cancelAnchor) {
            this._cancelAnchor.text(this.options.translations.labelCancel);
          }

          break;

        default:
          break;
      }
    },

    /**
     * @memberof oj.ojMenu
     * @instance
     * @protected
     * @override
     */
    _destroy: function _destroy() {
      // Override of protected base class method.  Method name needn't be quoted since is in externs.js.
      if (this.element.is(':visible')) {
        this.__dismiss();
      }

      this._setWhenReady('none');

      if (this._clearTimer) {
        this._clearTimer();
      }

      delete this._clearTimer;
      this.element[0].removeEventListener('touchstart', this._touchStartHandler, {
        passive: true
      });
      delete this._touchStartHandler;
      this.element[0].removeEventListener('touchstart', this._delegatedHandleMouseEnterMenuItem, {
        passive: true
      });
      delete this._delegatedHandleMouseEnterMenuItem; // Destroy (sub)menus

      this.element.removeAttr('aria-activedescendant').removeClass('oj-component').find('.oj-menu').addBack().removeClass('oj-menu oj-menu-submenu oj-menu-icons oj-menu-end-icons oj-menu-text-only').removeAttr('role').removeAttr('tabIndex').removeAttr('aria-labelledby').removeAttr('aria-hidden').removeAttr('aria-disabled').removeUniqueId().show(); // Destroy menu items

      this.element.find('.oj-menu-item').removeClass('oj-menu-item').removeAttr('role').children('a').removeAttr('aria-disabled').removeUniqueId().removeClass('oj-hover').removeAttr('tabIndex').removeAttr('role').removeAttr('aria-haspopup').children().each(function () {
        var elem = $(this);

        if (elem.data('oj-ojMenu-submenu-icon')) {
          elem.remove();
        }
      }); // Destroy anchors

      this.element.find('a').removeAttr('aria-expanded'); // Destroy menu dividers

      this.element.find('.oj-menu-divider').removeClass('oj-menu-divider').removeAttr('role');
      delete this._popupServiceEvents;
      delete this._usingCallback;
      var clearCloseDelayTimer = this._clearCloseDelayTimer;
      delete this._clearCloseDelayTimer;

      if (clearCloseDelayTimer) {
        clearCloseDelayTimer();
      }

      this.element.ojHammer('destroy');

      this._super();
    },
    _keydown: function _keydown(event) {
      /* jshint maxcomplexity:20*/
      var preventDefault = true;

      function escape(value) {
        // eslint-disable-next-line no-useless-escape
        return value.replace(/[-\[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      }

      switch (event.keyCode) {
        case $.ui.keyCode.HOME:
          this._move('first', 'first', event);

          break;

        case $.ui.keyCode.END:
          this._move('last', 'last', event);

          break;

        case $.ui.keyCode.UP:
          this._previous(event);

          break;

        case $.ui.keyCode.DOWN:
          this._next(event);

          break;

        case $.ui.keyCode.LEFT:
        case $.ui.keyCode.RIGHT:
          var isExpand = event.keyCode === $.ui.keyCode.RIGHT !== this.isRtl;

          if (isExpand) {
            if (this.active && !this.active.is('.oj-disabled')) {
              this._expand(event);
            }
          } else {
            this._collapse(event, 'active');
          }

          break;

        case $.ui.keyCode.ENTER:
        case $.ui.keyCode.SPACE:
          this._handleEnterSpace(event);

          this.__spaceEnterDownInMenu = true;
          var self = this; // The spaceEnterDelay and __spaceEnterDownInMenu code addresses an issue where closing a menu, from within the menu via
          // Space or Enter, can immediately reopen the menu, because the keyUp can happen after focus has jumped to the button,
          // which clicks the button, which reopens the menu.  Repros most readily (only??) in Firefox.
          // TODO: try calling preventDefault() on the event in Menu (which is good practice anyway since it's handling the event), and
          // checking isDefaultPrevented() in Button.  If works, should be cleaner / more reliable than this existing fix.

          var spaceEnterDelay = 100; // 1 not enough in FF; 100 seems to do it.  If continued problems, try increasing this value.

          setTimeout(function () {
            self.__spaceEnterDownInMenu = false;
          }, spaceEnterDelay);
          break;
        // tab within a menu will implicitly dismiss

        case $.ui.keyCode.TAB:
          event.preventDefault();

          this._focusLauncherAndDismiss(event);

          break;
        // this handles enabled menus.  For disabled menus, see this handler: this._on(true, {...});

        case $.ui.keyCode.ESCAPE:
          if (this._launcher) {
            // if menu is currently open
            // <a> or nothing.  Always the same as this.active now that we change them in lockstep.
            var activeItemId = this.element.attr('aria-activedescendant');
            var closestParentMenu = $(document.getElementById(activeItemId)).parents('.oj-menu').first();
            var submenuOpen = closestParentMenu.length > 0 && closestParentMenu[0] !== this.element[0];

            if (submenuOpen) {
              this._collapse(event, 'active');
            } else {
              this._focusLauncherAndDismiss(event);
            }
          } else {
            this._collapse(event, 'active');
          }

          break;

        default:
          preventDefault = false;
          var prev = this.previousFilter || '';
          var character = String.fromCharCode(event.keyCode);
          var skip = false;
          clearTimeout(this.filterTimer);

          if (character === prev) {
            skip = true;
          } else {
            character = prev + character;
          }

          var regex = new RegExp('^' + escape(character), 'i');
          var match = $(_findImmediateMenuItems(this.activeMenu)).filter(function () {
            return regex.test($(this).children('a').text());
          });
          match = skip && match.index(this.active.next()) !== -1 ? this.active.nextAll('.oj-menu-item') : match; // If no matches on the current filter, reset to the last character pressed
          // to move down the menu to the first item that starts with that character

          if (!match.length) {
            character = String.fromCharCode(event.keyCode);
            regex = new RegExp('^' + escape(character), 'i');
            match = $(_findImmediateMenuItems(this.activeMenu)).filter(function () {
              return regex.test($(this).children('a').text());
            });
          }

          if (match.length) {
            this._focus(event, match);

            if (match.length > 1) {
              this.previousFilter = character;
              this.filterTimer = setTimeout(function () {
                delete this.previousFilter;
              }.bind(this), 1000);
            } else {
              delete this.previousFilter;
            }
          } else {
            delete this.previousFilter;
          }

      }

      if (preventDefault) {
        event.preventDefault();
      }
    },

    /*
     * Called for Space and Enter
     */
    _handleEnterSpace: function _handleEnterSpace(event) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      if (this.active && !this.active.is('.oj-disabled')) {
        if (this.active.children("a[aria-haspopup='true']").length) {
          this._expand(event);
        } else {
          this._select(event);
        }
      }
    },

    /**
     * Refreshes the disclosed state of the menu. JET elements require a <code class="prettyprint">refresh()</code>
     * after the DOM is programmatically changed underneath the component.  The menu will implicitly refresh each
     * time it is open. Calling refresh before the menu is open will trigger any content contained within an
     * <code class="prettyprint">oj-defer</code> to disclose before the menu is actually open.
     *
     * @expose
     * @memberof oj.ojMenu
     * @ojshortdesc Refreshes the disclosed state of the menu. See the Help documentation for more information.
     * @instance
     * @return {void}
     *
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * myMenu.refresh();
     */
    refresh: function refresh() {
      // Override of public base class method (unlike JQUI).  Method name needn't be quoted since is in externs.js.
      function createInitializedSubmenus(self) {
        var submenus = self.element.find('oj-menu:not(.oj-menu-submenu)');

        for (var i = 0; i < submenus.length; i++) {
          // element might not be upgraded so just toggle its visibility and wait to be upgraded
          $(submenus[i]).attr('aria-hidden', 'true').hide();
          var busyContext = Context.getContext(submenus[i]).getBusyContext();
          busyContext.whenReady().then(function (submenu) {
            submenu.refresh();
          }.bind(self, submenus[i]));
        }
      }

      this._super(); // custom element menus are not create-initialized until they are first open


      if (this._IsCustomElement() && !this._wasCreated) {
        var parentOption = this.element.parent();

        if (parentOption.is('oj-option')) {
          // If the menu is located under an option, it's a submenu.  Checking for
          // a parent menu is just validation that would require a negative test
          // for code coverage.
          this._isSubmenu = true;

          this._createAsSubmenu();
        }

        if (!this._isSubmenu) {
          // triggers nested oj-defer to disclose content
          Components.subtreeShown(this.element[0]);

          this._createAsTopLevelMenu();

          createInitializedSubmenus(this);
        }

        this._wasCreated = true;
      } else {
        // top-level menu has been create initialized
        // look for sub-menus that might have been added to the dom after the top-level menu
        // was created that have not been create-initialized
        createInitializedSubmenus(this);

        this._setup();
      }

      this._reposition();
    },
    _reposition: function _reposition() {
      function isMenuLargerThanViewport(domElement) {
        var rect = domElement.getBoundingClientRect();
        return rect.width > document.documentElement.clientWidth || rect.height > document.documentElement.clientHeight;
      }

      var element = this.element;

      if (!element.is(':visible') || isMenuLargerThanViewport(element[0])) {
        // skip if the menu is hidden or larger than the viewport
        return;
      } // reevaluate open menu positions


      var position = element.data(_POSITION_DATA);
      element.position(position); // Do the same for open submenus.  Don't bother with the position.of check this time, since
      // their position.of is essentially always the parent menu, not some other thing on the page.

      var subMenus = element.find('.oj-menu');
      subMenus.each(function () {
        var menu = $(this);

        if (menu.is(':visible')) {
          position = menu.data(_POSITION_DATA);
          menu.position(position);
        }
      });
    },
    _setup: function _setup() {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      this.isRtl = this._GetReadingDirection() === 'rtl';

      if (!this._IsCustomElement()) {
        this._setupWidgetMenus();
      } else {
        this._processOjOptions();

        if (this._isSubmenu) {
          this.options.openOptions.launcher = this.element.parent();
        } // ensure menu padding is updated


        this._updateMenuPadding(this.element);
      } // If the active item has been removed, blur the menu


      if (this.active && !$.contains(this.element[0], this.active[0])) {
        this._blur();
      }
    },
    _setupWidgetMenus: function _setupWidgetMenus() {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      var self = this;
      var submenus = this.element.find(this.options.menuSelector); // <ul>'s except root <ul>

      var menus = submenus.add(this.element); // <ul>'s including root <ul>

      var children = menus.children(); // <li>'s in root menu and submenus

      this._hasSubmenus = !!submenus.length; // Anything that used to be a divider, but now has an "a", should become a menu element.

      children.filter('.oj-menu-divider').has('a').removeClass('oj-menu-divider oj-menu-item') // remove oj-menu-item if somehow present to ensure that it enters following block
      .removeAttr('role'); // Don't refresh list items that are already adapted
      // TBD: .has prob has better perf than :has

      var uninitedItems = children.filter(':not(.oj-menu-item):has(a)');
      var uninitedAnchors = uninitedItems.children('a');

      this._initMenuItems(uninitedItems);

      this._initAnchors(uninitedAnchors);

      var dividers = children.filter(function (index, item) {
        // menu items without anchors containing spaces and/or dashes only
        // this test relies on the fact that _initMenuItems() has already been called
        var $item = $(item);
        return $item.is(':not(.oj-menu-item)') && !/[^\-\u2014\u2013\s]/.test($item.text()); // hyphen, em dash, en dash
      });

      this._initDividers(dividers); // ensure "before/after-divider" classes are applied iff appropriate


      this._initDividerNeighbors(children, dividers); // Add aria-disabled to any disabled menu item, and remove it from any recently enabled menu item


      children.filter('.oj-disabled').children('a').attr('aria-disabled', 'true');
      children.filter(':not(.oj-disabled)').children('a').removeAttr('aria-disabled'); // Initialize nested menus

      submenus.filter(':not(.oj-menu)').addClass('oj-menu oj-menu-submenu oj-menu-dropdown') // submenus are always dropdown
      .hide().attr({
        role: this.role,
        'aria-hidden': 'true'
      }).each(function () {
        var menu = $(this); // <ul>

        self._setupSubmenu(self._getSubmenuAnchor(menu), menu, true);
      });
      menus.each(function () {
        // For each menu incl. submenus, apply either "oj-menu-icons" or "oj-menu-text-only" to that menu, depending on whether that menu
        // (excluding its submenus) contains at least one menu item having an icon.
        // This facilitates leaving space for a "column" of icons iff at least one icon is present, and doing so for each menu/submenu independently.
        // We exclude the cancel item's icon from the count, as that icon is always present if the cancel item is, but it's themed to show up iff
        // oj-menu-icons is present, i.e. iff at least one other icon is present.
        self._updateMenuPadding($(this));
      });
    },
    // helper method to create and add a submenu icon to the item provided
    _setupSubmenu: function _setupSubmenu(item, submenu, addIcon) {
      item.attr('aria-haspopup', 'true').attr('aria-expanded', 'false'); // per a11y team, live on <a>, not <ul> like JQUI

      if (addIcon) {
        var submenuIcon = $('<span>');
        submenuIcon // separate stmt rather than chaining, since GCC can't tell that this is the setter overload of .data().
        .addClass('oj-menu-submenu-icon oj-component-icon').data('oj-ojMenu-submenu-icon', true); // TODO: can't we just look for the class at destroy time rather than adding this data?

        item.append(submenuIcon); // @HTMLUpdateOK append trusted new DOM to menu item
      }

      submenu.attr('aria-labelledby', item.attr('id'));
    },

    /**
     * @private
     * @param {jQuery} items - non-divider <li>'s that haven't already been inited.
     */
    _initMenuItems: function _initMenuItems(items) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      items.addClass('oj-menu-item').attr('role', 'presentation');
    },

    /**
     * @private
     * @param {jQuery} anchors - <a>'s that haven't already been inited.
     */
    _initAnchors: function _initAnchors(anchors) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      for (var i = 0; i < anchors.length; i++) {
        var anchor = $(anchors[i]);
        anchor.uniqueId().attr({
          tabIndex: '-1',
          role: this._itemRole(anchor.parent())
        });
      }
    },

    /**
     * @private
     * @param {jQuery} dividers - divider <li>'s.
     */
    _initDividers: function _initDividers(dividers) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      dividers.addClass('oj-menu-divider').attr('role', 'separator');
    },

    /**
     * @private
     * @param {jQuery} dividers - divider <li>'s.
     */
    _initDividerNeighbors: function _initDividerNeighbors(items, dividers) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      items.removeClass('oj-menu-item-before-divider oj-menu-item-after-divider');
      dividers.prev().addClass('oj-menu-item-before-divider');
      dividers.next().addClass('oj-menu-item-after-divider');
    },

    /**
     * @private
     */
    _clearOption: function _clearOption(option) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      option.removeClass('oj-menu-item-before-divider oj-menu-item-after-divider oj-menu-divider oj-menu-item').removeAttr('role');
    },

    /*
     * Given a list of one or more submenus (typically <ul>'s), finds the <a>'s that are their labels.
     */
    _getSubmenuAnchor: function _getSubmenuAnchor(submenu) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      return submenu.prev('a');
    },
    _getSubmenuWidget: function _getSubmenuWidget(submenu) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      var constructor = Components.__GetWidgetConstructor(submenu, 'ojMenu');

      return constructor('instance');
    },
    _itemRole: function _itemRole(option) {
      if (option.parent().prop('nodeName') === 'OJ-MENU-SELECT-MANY') {
        return 'menuitemcheckbox';
      }

      return 'menuitem';
    },
    // given a menu item, returns JQ object with any adjacent group dividers and optionally, that item
    _getAdjacentDividers: function _getAdjacentDividers(menuItem, includeItem) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      var result = menuItem.prev('.oj-menu-divider').add(menuItem.next('.oj-menu-divider'));

      if (includeItem) {
        result = result.add(menuItem);
      }

      return result;
    },

    /**
     * Focuses the specified menu item and triggers the menu's <code class="prettyprint">_activeItem</code> event.
     *
     * @memberof oj.ojMenu
     * @instance
     * @private
     * @param {Event} event - What triggered the menu item to gain focus.  May be <code class="prettyprint">null</code>, but may not be omitted.
     * @param {!jQuery} item - The menu item to focus.  Its containing submenu, if any, must already be expanded. Must not be null or length 0.
     */
    _focus: function _focus(event, item) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      var previousItem = this.active ? this.active : $();

      if (item.is(previousItem)) {
        return; // if item already has focus do nothing
      } // JQUI called blur() here.  This "if blah clear timer" is the only thing from that call that we (presumably) still want to do here.


      if (!(event && event.type === 'focus')) {
        if (this._clearTimer) {
          this._clearTimer();
        }
      } // eslint-disable-next-line no-param-reassign


      item = item.first(); // li.  Length 1.

      this._makeActive(item, event);

      var containingMenu = item.parents('.oj-menu').first(); // ul.  Length-1.  Might be top or submenu.

      var parentMenuItem = containingMenu.closest('.oj-menu-item'); // li. Length 0 iff item is in top menu.
      // Remove oj-focus-ancestor class from all menu items and group dividers in the newly focused menu item's menu and submenus of that menu

      containingMenu.find('.oj-focus-ancestor').removeClass('oj-focus-ancestor'); // Highlight active parent menu item, if any, and adjacent group dividers, if any

      this._getAdjacentDividers(parentMenuItem, true).addClass('oj-focus-ancestor');

      if (event && event.type === 'keydown') {
        this._close();
      } else {
        this._clearTimer = this._setTimer(function () {
          delete this._clearTimer;
          return this._close();
        }, this._getSubmenuBusyStateDescription('closing'), this.delay);
      }

      var nested = this._IsCustomElement() ? item.children('oj-menu') : item.children('.oj-menu'); // immediately nested submenu.  length 0 or 1.

      var previousFocusInSubmenu = nested.length > 0 && previousItem.length > 0 && $.contains(nested[0], previousItem[0]);

      if (nested.length && event && /^mouse|click/.test(event.type) && !this.active.hasClass('oj-disabled') && !previousFocusInSubmenu) {
        this._startOpening(event, nested);
      }

      this.activeMenu = item.parents('.oj-menu').first();
    },

    /*
     * Sets this.active (<li>), aria-activedescendant (<a>), and oj-focus (<li> and adjacent group dividers) in lockstep.
     * Never set those things outside of _makeActive() and _removeActive(), so they stay in synch!
     *
     * param item length-1 JQ object containing the <li> to focus
     */
    _makeActive: function _makeActive(item, event) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      function isClippedInViewport(domElement) {
        var rect = domElement.getBoundingClientRect();
        return rect.top < 0 || rect.bottom > document.documentElement.clientHeight || rect.left < 0 || rect.right > document.documentElement.clientWidth;
      } // don't need to check for "both items null/empty", and don't need to null-check item, since item required to be length-1 JQ object


      var same = item.is(this.active);

      if (same) {
        return;
      }

      var previousItem = this.active ? this.active : $();
      var anchor = item.children('a');
      this.active = item;
      this.element.attr('aria-activedescendant', anchor.attr('id'));

      this._focusOutHandler(previousItem);

      this._focusInHandler(item);

      this._getAdjacentDividers(previousItem).removeClass('oj-focus');

      this._getAdjacentDividers(item).addClass('oj-focus'); // see private API doc on the private _activeItem event declaration in this file


      this._trigger('_activeItem', event, {
        previousItem: previousItem,
        item: item,
        privateNotice: 'The _activeItem event is private.  Do not use.'
      });

      if (event && /^key/.test(event.type) && isClippedInViewport(anchor[0])) {
        // if the event is a key event, force the target menu item to scroll into view if it is clipped in the viewport
        anchor[0].scrollIntoView();
      }
    },

    /*
     * Unsets this.active (<li>), aria-activedescendant (<a>), and oj-focus (<li> and adjacent group dividers) in lockstep.
     * Never set those things outside of _makeActive() and _removeActive(), so they stay in synch!
     *
     * Don't call this if you are immediately going to call _makeActive, to avoid firing the event twice (and redundant work).
     */
    _removeActive: function _removeActive(event) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      if (this.active) {
        // then there is definitely a change, from "something focused" to "nothing focused", so proceed.
        var previousItem = this.active; // non-null, so don't need null-check

        this.active = null;
        this.element.removeAttr('aria-activedescendant');

        this._focusOutHandler(previousItem);

        this._getAdjacentDividers(previousItem).removeClass('oj-focus'); // see private API doc on the private _activeItem event declaration in this file


        this._trigger('_activeItem', event, {
          previousItem: previousItem,
          item: $(),
          privateNotice: 'The _activeItem event is private.  Do not use.'
        });
      }
    },

    /**
     * @memberof oj.ojMenu
     * @instance
     * @private
     * @param {Event=} event - What triggered the menu item to blur.  May be <code class="prettyprint">null</code> or omitted.
     */
    _blur: function _blur(event) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      if (this._clearTimer) {
        this._clearTimer();
      }

      this._removeActive(event);
    },

    /*
     * param {Event} event - What triggered the menu to close. Payload for select (if applicable) and close events.
     * param {Object} selectUi - Payload for select event.  Non-null iff close caused by a menu item selection.
     */
    _focusLauncherAndDismiss: function _focusLauncherAndDismiss(event, selectUi) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      // if the focus fails because the launcher has disappeared, e.g. due to a responsive layout change,
      // no warnings are logged, and the document body winds up focused during the subsequent reparenting,
      // which per the architects is the right thing (i.e. don't introduce any fancy handling for this case).
      if (this._launcher) {
        // restore focus
        this._launcher.focus();
      }

      this.__dismiss(event, selectUi);
    },

    /**
     * Closes the menu. This method does not accept any arguments.
     *
     * @expose
     * @method
     * @name oj.ojMenu#close
     * @ojshortdesc Closes the menu.
     * @memberof oj.ojMenu
     * @instance
     * @return {void}
     *
     * @example <caption>Invoke the <code class="prettyprint">close</code> method:</caption>
     * myMenu.close();
     */
    close: function close() {
      this.__dismiss();
    },

    /*
     * Internal method, e.g. called by Button for MenuButton functionality.
     * Could make it public if ever needed.
     * param {Event} event - What triggered the menu to close. Payload for select (if applicable) and close events.
     * param {Object} selectUi - Payload for select event.  Non-null iff close caused by a menu item selection.
     */
    __dismiss: function __dismiss(event, selectUi) {
      // Internal visibility; called by Button's MenuButton functionality.  Not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      if (this._isOperationPending('close', '__dismiss', [event, selectUi])) {
        return;
      } // no-op for a closed menu


      var status = oj.ZOrderUtils.getStatus(this.element);

      if (!(status === oj.ZOrderUtils.STATUS.OPEN)) {
        return;
      }

      var isOpen = this.element.is(':visible');

      this._setWhenReady('close');
      /** @type {!Object.<oj.PopupService.OPTION, ?>} */


      var psOptions = {};
      psOptions[oj.PopupService.OPTION.POPUP] = this.element; // capture local state in a context used by the after close callback

      psOptions[oj.PopupService.OPTION.CONTEXT] = {
        event: event,
        selectUi: selectUi,
        isOpen: isOpen
      };
      oj.PopupService.getInstance().close(psOptions);
    },

    /**
     * Get the default animation for a menu
     *
     * @memberof oj.ojMenu
     * @instance
     * @private
     * @param {string} menuType - The menu type (dropdown or sheet)
     * @param {string} action - The action to animate (open, close)
     * @return {Object} The default animation for the menu type
     */
    _getDefaultAnimation: function _getDefaultAnimation(menuType, action) {
      var defaults = ThemeUtils.parseJSONFromFontFamily('oj-menu-option-defaults').animation;
      var animation = defaults[menuType][action];
      return animation;
    },

    /**
     * Return a boolean to indicate if animation is disabled
     *
     * @memberof oj.ojMenu
     * @instance
     * @private
     * @return {boolean} true if animation is disabled; false otherwise.
     */
    _isAnimationDisabled: function _isAnimationDisabled() {
      // Disable animation if this is not custom element, or the menu is being
      // dismissed and immediately reopened.
      return !this._IsCustomElement() || this._disableAnimation;
    },

    /**
     * Replace animation options with runtime property values
     *
     * @memberof oj.ojMenu
     * @instance
     * @private
     * @param {any} effects - The animation options
     * @param {Object} propertyMap - The runtime property values
     * @return {any} The resolved animation effects
     */
    _replaceAnimationOptions: function _replaceAnimationOptions(effects, propertyMap) {
      var resultEffects = effects;

      if (propertyMap && effects && typeof effects !== 'string') {
        var effectsAsString = JSON.stringify(effects);
        var keys = Object.keys(propertyMap);

        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          effectsAsString = effectsAsString.replace(new RegExp(key, 'g'), propertyMap[key]);
        }

        resultEffects = JSON.parse(effectsAsString);
      }

      return resultEffects;
    },

    /**
     * Utility method to run a task when a promise is resolved, or run it
     * immediately if there is no promise.
     *
     * @memberof oj.ojMenu
     * @instance
     * @private
     * @param {Promise|null} promise - The promise to wait on
     * @param {function()} task - The task to run
     * @return {IThenable|null} A new promise or null
     */
    _runOnPromise: function _runOnPromise(promise, task) {
      if (promise) {
        return promise.then(task);
      }

      return task();
    },

    /**
     * Before callback is invoked while the menu is still visible and still parented in the zorder
     * container. Close animation is performed here.
     * @memberof! oj.ojMenu
     * @instance
     * @private
     * @param {!Object.<oj.PopupService.OPTION, ?>} psOptions property bag for closing the menu
     * @return {Promise|void}
     */
    _beforeCloseHandler: function _beforeCloseHandler(psOptions) {
      var rootElement = psOptions[oj.PopupService.OPTION.POPUP]; // For custom element:
      // Fire action event before menu closed, so that app action handlers can do their thing
      // without waiting for the animation to finish.

      if (this._IsCustomElement()) {
        var context = psOptions[oj.PopupService.OPTION.CONTEXT];
        var selectUi = context.selectUi; // trigger action event on the oj-option element

        if (selectUi && selectUi.item.length) {
          // the following event construction is taken from the '_triggerCustomEvent' logic, but we can't
          // use that method since the child <oj-option> is not a full fledged JET element.
          var detail = {};
          var eventName = 'ojAction';
          var itemElement = selectUi.item[0];
          var event = context.event;
          detail.originalEvent = event.originalEvent;
          var params = {
            detail: detail
          };
          params.cancelable = true;
          params.bubbles = true;
          var customEvent = new CustomEvent(eventName, params);
          itemElement.dispatchEvent(customEvent);
          context.event = customEvent; // Use the action event as the close event's originalEvent
        }
      }

      if (this._isAnimationDisabled()) {
        rootElement.attr('aria-hidden', 'true').hide();
        return undefined;
      }

      var animationOptions = this._getDefaultAnimation(this._sheetMenuIsOpen ? 'sheet' : 'dropdown', 'close');

      var promise = AnimationUtils.startAnimation(rootElement[0], 'close', oj.PositionUtils.addTransformOriginAnimationEffectsOption(rootElement, animationOptions), this);
      promise.then(function () {
        rootElement.attr('aria-hidden', 'true').hide();
      });
      return promise;
    },

    /**
     * Close finalization callback.
     *
     * @memberof! oj.ojMenu
     * @instance
     * @private
     * @param {!Object.<oj.PopupService.OPTION, ?>} psOptions property bag for closing the menu
     * @return {void}
     */
    _afterCloseHandler: function _afterCloseHandler(psOptions) {
      // restore local variable state from #__dismiss
      var context = psOptions[oj.PopupService.OPTION.CONTEXT];
      var event = context.event;
      var selectUi = context.selectUi;
      var isOpen = context.isOpen;
      this.element.removeData(_POSITION_DATA);
      this._launcher = undefined;
      this._sheetMenuIsOpen = false; // Preserve original logic for old-style component:
      // Fire select event after menu closed, so that app select handlers can do their thing
      // without worrying about the fact that the menu is still sitting there.
      // Fire select event before close event, because logical, and so that it can be the close event's
      // originalEvent.

      if (!this._IsCustomElement() && selectUi) {
        var selectResults = this._trigger2('select', event, selectUi);

        event = selectResults.event; // Use the select event as the close event's originalEvent
      } // just in case it's possible for __dismiss() to get called when menu is already closed, avoid firing spurious event:


      if (isOpen) {
        this._trigger('close', event, {});
      }

      this._currentOpenOptions = null; // Remove menu from openPopupMenus list

      var i = _openPopupMenus.indexOf(this);

      _openPopupMenus.splice(i, 1);

      this._destroyVoiceOverAssist();
    },

    /**
     * <p>Returns a copy of the <code class="prettyprint">openOptions</code> object applicable to the current launch, or the <a href="#openOptions">option</a>
     * value otherwise.
     *
     * <p>If the menu is shared among several launchers, this API can be used to find out what element launched the menu, as seen in the example below.
     *
     * <p>Detailed semantics:
     *
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Menu state</th>
     *       <th>Value</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td>Menu is open, or transitioning between open and closed, including when this method is called from an <a href="#event:open">open</a>,
     *           <a href="#event:action">action</a>, or <a href="#event:close">close</a>  listener. (For <a href="#event:beforeOpen">ojBeforeOpen</a>, see next row.)</td>
     *       <td>A copy of the object used for the most recent launch is returned.  See the <a href="#openOptions">openOptions</a>
     *           option, the <a href="#open">open()</a> method, and the <a href="#event:beforeOpen">ojBeforeOpen</a> event for details on how that
     *           object is constructed.</td>
     *     </tr>
     *     <tr>
     *       <td>This method is called from a <a href="#event:beforeOpen">ojBeforeOpen</a> listener.</td>
     *       <td>A copy of the merged object "so far" is returned. The object ultimately used for the launch may differ if it is changed by
     *           a <code class="prettyprint">ojBeforeOpen</code> listener after this method is called.  Unlike the original copy passed to the
     *           <code class="prettyprint">ojBeforeOpen</code> listener, the copy returned by this method is not "live" and cannot be used to affect the launch.</td>
     *     </tr>
     *     <tr>
     *       <td>Menu is closed.  (All states not listed above.)</td>
     *       <td>A copy of the <a href="#openOptions">option</a> value is returned.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @expose
     * @memberof oj.ojMenu
     * @instance
     * @ignore
     * @since 2.0.0
     *
     * @return {!Object} the <code class="prettyprint">openOptions</code> object
     */
    getCurrentOpenOptions: function getCurrentOpenOptions() {
      // Public, not an override (not in base class), so use @expose with unquoted method name.
      return $.extend(true, {}, this._currentOpenOptions || this.options.openOptions); // return a deep copy
    },

    /**
     * <p>Launches this menu after firing the <a href="#event:beforeOpen">ojBeforeOpen</a> event.  Listeners to that event can cancel the launch
     * via <code class="prettyprint">event.preventDefault()</code>.  If the launch is not canceled, then the the <a href="#event:open">open</a> event
     * is fired after the launch.
     *
     * <p>This method's optional <code class="prettyprint">openOptions</code>param can be used to specify per-launch values for the settings in the
     * corresponding component options, without altering those options.  Those per-launch values can be further customized by a
     * <code class="prettyprint">ojBeforeOpen</code> listener.
     *
     * <p>Menus launched manually (as opposed to those launched by built-in functionality such as the [menu button]{@link oj.ojButton#menu} and
     * [context menu]{@link oj.baseComponent#contextMenu} functionality) must be launched via this API, not by simply unhiding the Menu DOM (such as
     * via jQuery's <code class="prettyprint">show()</code> API.
     *
     * @expose
     * @memberof oj.ojMenu
     * @ojshortdesc Launches this menu after firing the ojBeforeOpen event. See the Help documentation for more information.
     * @instance
     * @return {void}
     * @ojsignature { target: "Type",
     *                value: "oj.ojMenu.OpenOptions",
     *                for: "openOptions",
     *                jsdocOverride: true }
     * @fires oj.ojMenu#ojBeforeOpen
     * @fires oj.ojMenu#ojAnimationStart
     * @fires oj.ojMenu#ojAnimationEnd
     * @fires oj.ojMenu#ojOpen
     *
     * @param {Event=} event What triggered the menu launch.  May be <code class="prettyprint">null</code>.  May be omitted if subsequent params are omitted.
     * @param {Object=} openOptions Options to merge with the <code class="prettyprint">openOptions</code> option.  May be <code class="prettyprint">null</code>.  May be omitted if subsequent params are omitted.
     *
     * @example <caption>Invoke the <code class="prettyprint">open</code> method:</caption>
     * // override the launcher for this launch only, without affecting the other
     * // openOptions, and without affecting the component's openOptions option
     * myMenu.open(myEvent, {'launcher': 'myLauncher'});
     */
    open: function open(event, openOptions) {
      // Public, not an override (not in base class), so use @expose with unquoted method name.
      var submenuOpenOptions = arguments[2];

      if (this._isOperationPending('open', 'open', [event, openOptions, submenuOpenOptions])) {
        return;
      } // The remaining menu open actions should proceed only when any autodismiss actions for the same menu have completed


      var menuOpenActions = function (menuEvent, menuOpenOptions) {
        if (this._IsCustomElement()) {
          this.refresh();
        }

        this.element.removeAttr('aria-activedescendant');
        this.element.find('.oj-focus').removeClass('oj-focus');
        this.focusHandled = false;
        this._focusIsFromPointer = false;
        this.mouseHandled = false;
        this.activeMenu = this.element;
        this.active = null; //
        // Important:  Merge [submenu]openOptions *before* calling _trigger(), and don't use the merged values until *after* the call.
        // Reason:  Per doc on open() and beforeOpen event, we pass the merged openOptions to beforeOpen listeners as a "live" object,
        // so the listener can both read and write the values used for this launch.  We may eventually pass submenuOpenOptions too, either to
        // beforeOpen or to beforeSubmenuOpen, if we ever have that.
        //
        // Merge needs 2 steps:
        // 1) Shallow merge (i.e. don't pass true as first arg to extend) of the 2 openOptions objects, into a new object.  Shallow so that the per-launch position object completely overrides the
        // component option's position object rather than merging with it.
        // 2) Then a deep copy of all object-valued fields in the merged object.  Position is the only such field, and it doesn't contain any objects of its own,
        // so this is actually just a shallow copy of position.  This is so that if beforeOpen listener mutates the position object, the position object in the component option remains unchanged.
        // Step 2 isn't needed for submenuOptions, since it isn't passed to beforeOpen.
        // $.fn.position copies the object passed to it before modifying it, so Step 2 isn't needed for that reason.
        // eslint-disable-next-line no-param-reassign

        menuOpenOptions = $.extend({}, this.options.openOptions, menuOpenOptions); // eslint-disable-next-line no-param-reassign

        menuOpenOptions.position = $.extend({}, menuOpenOptions.position);

        if (this._IsCustomElement()) {
          this._setPosition(menuOpenOptions.position);
        }

        submenuOpenOptions = $.extend({}, this.options.submenuOpenOptions, submenuOpenOptions); // getCurrentOpenOptions() returns a deep copy of this._currentOpenOptions if set.  Put the live copy in the ivar, and have that method make the copy, so that the method picks up
        // beforeOpen listeners' changes to the live copy.  The old value of the ivar is non-null iff the menu is already open from a previous launch.  Grab the old value so we can restore it
        // if this (new) launch is cancelled, in which case the old launch stays up and subsequent calls to the method should return the old value.

        var oldOpenOptions = this._currentOpenOptions;
        this._currentOpenOptions = menuOpenOptions;

        oj.PositionUtils._normalizeEventForPosition(menuEvent); // see callee doc
        // Hack:  __openingContextMenu is set and unset by baseComponent._OpenContextMenu(), since Menu needs to know whether the
        // menu is open as a context menu vs. some other kind of menu including menu button,
        // as this affects whether subsequent mousedown/touchstart on launcher should dismiss menu.  IIRC, the upcoming Popup Fmwk
        // will address this need, but if not, fix it separately, perhaps by adding a new openOptions sub-option so it can be passed to menu.open().


        this._launcherClickShouldDismiss = this.element[0].__openingContextMenu; // TBD: if we ever pass submenuOpenOptions to a listener, must copy its position object first like we do for openOptions, above.

        var beforeOpenResults = this._trigger2('beforeOpen', menuEvent, {
          openOptions: menuOpenOptions
        });

        if (!beforeOpenResults.proceed) {
          this._currentOpenOptions = oldOpenOptions; // see comment above

          this._disableAnimation = false;
          return;
        } // Close menu if already open


        if (oj.ZOrderUtils.getStatus(this.element) === oj.ZOrderUtils.STATUS.OPEN) {
          // Disable animation since we'll be reopening the menu
          this._disableAnimation = true; // if getCurrentOpenOptions() is called during the close event marking the end of the previous launch,
          // then it should return the details for the old launch

          this._currentOpenOptions = oldOpenOptions; // Use the beforeOpen event as the close event's originalEvent

          this.__dismiss(beforeOpenResults.event); // sets this._currentOpenOptions to null
          // In case the menu is being opened by a different launcher, we don't
          // want the _clickAwayHandler for the old launcher to dismiss it.


          this._dismissEvent = null;
          this._currentOpenOptions = menuOpenOptions; // restore this launch's value
        }

        var launcher = menuOpenOptions.launcher;

        if (!this._IsCustomElement()) {
          launcher = $.type(launcher) === 'string' ? $(launcher) : launcher;
        } else {
          launcher = $.type(launcher) === 'string' ? $(document.getElementById(launcher)) : $(launcher);
        }

        if (!launcher || !launcher.length) {
          // need launcher so can return focus to it.
          Logger.warn('When calling Menu.open(), must specify openOptions.launcher via the component option, method param, or beforeOpen listener.  Ignoring the call.');
          this._currentOpenOptions = null;
          this._disableAnimation = false;
          return;
        }

        var isDropDown = this._isDropDown(menuOpenOptions.display);

        this._toggleCancelDom(isDropDown);

        var position;
        var modality;

        if (isDropDown) {
          // always true if there are submenus
          // .oj-menu-dropdown already added to any submenus in _setup, since dropdown/sheet status can't
          // vary by launch when there are submenus.
          this.element.addClass('oj-menu-dropdown').removeClass('oj-menu-sheet');
          modality = _DROPDOWN_MODALITY;
          var openOptionsPosition = oj.PositionUtils.normalizeHorizontalAlignment(menuOpenOptions.position, this.isRtl); // convert the position option back to JQuery format if custom element menu or submenu

          if (this._IsCustomElement()) {
            // fixup the position option if custom element menu or submenu
            // eslint-disable-next-line no-param-reassign
            openOptionsPosition = oj.PositionUtils.coerceToJet(openOptionsPosition, this.options.openOptions.position);
            position = oj.PositionUtils.coerceToJqUi(openOptionsPosition);
          } else {
            position = openOptionsPosition;
          }

          position.of = oj.PositionUtils.normalizePositionOf(position.of, launcher, menuEvent);
        } else {
          // sheet menu, implying no submenus
          this.element.addClass('oj-menu-sheet').removeClass('oj-menu-dropdown');
          modality = _SHEET_MODALITY;
          position = {
            my: 'bottom',
            at: _SHEET_POSITION_AT,
            of: window,
            collision: 'flipfit'
          };
        } // Close all other open menus


        var currentMenu = this.element[0]; // Clone _openPopupMenus as __dismiss() will remove the open menu from _openPopupMenus list

        var openPopupMenus = _openPopupMenus.slice(0, _openPopupMenus.length);

        $.each(openPopupMenus, function (index, menu) {
          if (menu.element[0] !== currentMenu) {
            menu._collapse(menuEvent, 'eventSubtree'); // TBD: should this be "all"?


            menu.__dismiss(menuEvent);
          }
        }); // cache the merged value for use while the (outer) menu is still open

        this._submenuPosition = oj.PositionUtils.normalizeHorizontalAlignment(submenuOpenOptions.position, this.isRtl);
        var usingCallback = this._usingCallback; // if they provided a using function that is not our callback, stash it
        // away so that we can delegate to it in our proxy.

        if ($.isFunction(position.using)) {
          position.origUsing = position.using;
        } // override with our proxy to handle positioning of the tail


        position.using = usingCallback;
        this.element.data(_POSITION_DATA, position);

        this._setWhenReady('open');
        /** @type {!Object.<oj.PopupService.OPTION, ?>} */


        var psOptions = {};
        psOptions[oj.PopupService.OPTION.POPUP] = this.element;
        psOptions[oj.PopupService.OPTION.LAUNCHER] = launcher;
        psOptions[oj.PopupService.OPTION.POSITION] = position;
        psOptions[oj.PopupService.OPTION.EVENTS] = this._getPopupServiceEvents();
        psOptions[oj.PopupService.OPTION.LAYER_SELECTORS] = 'oj-menu-layer';
        psOptions[oj.PopupService.OPTION.MODALITY] = modality; // local variables passed to the before and after open callbacks.

        psOptions[oj.PopupService.OPTION.CONTEXT] = {
          event: menuEvent,
          initialFocus: menuOpenOptions.initialFocus,
          launcher: launcher,
          isDropDown: isDropDown
        };
        psOptions[oj.PopupService.OPTION.CUSTOM_ELEMENT] = this._IsCustomElement();
        var popupService = oj.PopupService.getInstance();
        var openCallback = popupService.open.bind(popupService, psOptions);
        var deferredChild = this.element[0].querySelector('oj-defer');

        if (deferredChild) {
          // oj-defer was scoped as a dom level busy context in the component create.
          // Wait until all components within oj-defer have been upgraded and rendered
          // before trying to show and then position the popup. The busy state guarding
          // open animation, created by _setWhenReady above, is scoped to an ancestor
          // busy context. The oj-defer busy context and busy states associated with
          // contained components will be tracked via this sub context.
          var busyContext = oj.Context.getContext(deferredChild).getBusyContext();
          busyContext.whenReady().then(openCallback);
        } else {
          openCallback();
        }

        this._disableAnimation = false;
      }.bind(this, event, openOptions); // If autodismiss is in progress for this same menu


      if (this._dismissEvent) {
        // Wait for autoDismiss to complete before proceeding to open the menu
        var busyContext = Context.getContext(this.element[0]).getBusyContext();
        busyContext.whenReady().then(menuOpenActions);
      } else {
        menuOpenActions();
      }
    },

    /**
     * @memberof oj.ojMenu
     * @instance
     * @private
     * @param {?Object} position object set as an option or passed as an argument to the open
     *                  method.
     */
    _setPosition: function _setPosition(position) {
      var options = this.options; // new position extends the existing object
      // covert to jet internal position format

      options.openOptions.position = oj.PositionUtils.coerceToJet(position, options.openOptions.position);
    },

    /**
     * Before open callback is called after the menu has been reparented into the
     * zorder container. Open animation is performed here.
     * @memberof! oj.ojMenu
     * @instance
     * @private
     * @param {!Object.<oj.PopupService.OPTION, ?>} psOptions property bag for opening the menu
     * @return {Promise|void}
     */
    _beforeOpenHandler: function _beforeOpenHandler(psOptions) {
      var promise;
      var rootElement = psOptions[oj.PopupService.OPTION.POPUP];
      var position = psOptions[oj.PopupService.OPTION.POSITION];
      var context = psOptions[oj.PopupService.OPTION.CONTEXT];
      var event = context.event;
      var isDropDown = context.isDropDown;
      var initialFocus = context.initialFocus;
      rootElement.show();
      rootElement.position(position); // establish this._focusSkipLink, if iOS or Android

      this._initVoiceOverAssist(initialFocus);

      if (initialFocus === 'firstItem') {
        // Establish "logical" focus ( aria-activedescendant) before open animation so mouseover
        // is not negated by initial focus after the menu is fully open.
        var firstItem = this._getFirstItem();

        this._focus(event, firstItem);
      }

      if (!this._isAnimationDisabled()) {
        var animationOptions = this._getDefaultAnimation(isDropDown ? 'dropdown' : 'sheet', 'open');

        promise = AnimationUtils.startAnimation(rootElement[0], 'open', oj.PositionUtils.addTransformOriginAnimationEffectsOption(rootElement, animationOptions), this);
      }

      return promise;
    },

    /**
     * Called after the menu is shown. Perform open finalization.
     * @memberof! oj.ojMenu
     * @instance
     * @private
     * @param {!Object.<oj.PopupService.OPTION, ?>} psOptions property bag for opening the menu
     * @return {Promise|void}
     */
    _afterOpenHandler: function _afterOpenHandler(psOptions) {
      // From the context passed from the open restore local variable state.
      var context = psOptions[oj.PopupService.OPTION.CONTEXT];
      var event = context.event;
      var launcher = context.launcher;
      var isDropDown = context.isDropDown;
      var initialFocus = context.initialFocus; // store launcher so we can return focus to it, e.g. if Esc pressed.  Ivar is non-null iff
      // menu is currently open.

      this._launcher = launcher;
      this._sheetMenuIsOpen = !isDropDown; // Add current menu to openPopupMenus so that it will be closed on focus lost/click away.

      _openPopupMenus.push(this);

      if (initialFocus === 'firstItem' || initialFocus === 'menu') {
        var focusElement;

        if (this._focusSkipLink && initialFocus === 'menu') {
          // iOS and Android VO support.  Focus is not switched unless the aria-activedescendant
          // is set (aka 'firstItem') or dom focus is to an anchor tag.
          focusElement = this._focusSkipLink.getLink();
        } else {
          focusElement = this.element;
        } // Delay stealing focus "next-tick" so if the event triggering the menu to open has time
        // to finish the normal sequence on the launcher.  Otherwise, a rogue event could be
        // dispatched to the menu outside the normal sequence. For example, if the menu was open on
        // mousedown, the mouseup and click could be fired on the menu.  Or, open on keydown and
        // keypress and keyup targeted at the menu instead of the launcher.


        if (this._IsCustomElement()) {
          window.setImmediate(function () {
            focusElement.focus();
          });
        } else {
          // For jquery ui components, move immediate focus.  The synchronous button qunit tests expect this behavior.
          focusElement.focus();
        }
      }

      this._trigger('open', event, {});
    },
    _initVoiceOverAssist: function _initVoiceOverAssist(initialFocus) {
      if (initialFocus !== 'menu') {
        return;
      }

      var isVOSupported = oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.IOS || oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.ANDROID;

      if (!isVOSupported) {
        return;
      }

      var firstItem = this._getFirstItem();

      if (firstItem.length < 1) {
        // couldn't find a valid menu item
        return;
      } // get a sub-id


      var id = this.element.attr('id');

      if (oj.StringUtils.isEmptyOrUndefined(id)) {
        id = this.uuid;
      }

      var focusSkipLinkId = [id, 'focusSkipLink'].join('_');

      var callback = function () {
        // force focus to the anchor of the first item in the "next-tick"
        // to give a sticky double tap long touch hold time to target the
        // original launcher for the touchend event
        window.setImmediate(function (self, first) {
          first.find('a').first().focus();

          self._focus(null, first);
        }.bind(this, this, firstItem));
      }.bind(this);

      var message = this.options.translations.ariaFocusSkipLink;
      var options = {
        insertBefore: true,
        preventKeyEvents: false
      };
      this._focusSkipLink = new oj.PopupSkipLink(firstItem, message, callback, focusSkipLinkId, options);
    },
    _destroyVoiceOverAssist: function _destroyVoiceOverAssist() {
      if (this._focusSkipLink) {
        this._focusSkipLink.destroy();

        delete this._focusSkipLink;
      }
    },
    _getFirstItem: function _getFirstItem() {
      var firstItem = this.element.find('.oj-menu-item').first();
      return firstItem;
    },
    _startOpening: function _startOpening(event, submenu) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      if (this._clearTimer) {
        this._clearTimer();
      }

      if (this._IsCustomElement()) {
        submenu[0].refresh();
      }

      this._clearTimer = this._setTimer(function () {
        delete this._clearTimer;
        return this._close().then(function () {
          this._open(event, submenu);
        }.bind(this));
      }, this._getSubmenuBusyStateDescription('closing and opening'), this.delay);
    },
    // opens a *sub*menu
    _open: function _open(event, submenu) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      // Don't open if already open.
      // Calling position() again when the submenu is animating will mess up
      // the calculation and make the submenu appear in different positions.
      if (submenu.attr('aria-hidden') !== 'true' || !this.active) {
        return;
      }

      var position;

      if (this._IsCustomElement()) {
        var submenuWidget = this._getSubmenuWidget(submenu);

        var beforeOpenResults = submenuWidget._trigger2('beforeOpen', event);

        if (!beforeOpenResults.proceed) {
          return;
        }

        position = oj.PositionUtils.coerceToJqUi(submenuWidget.options.openOptions.position);
        position = oj.PositionUtils.normalizeHorizontalAlignment(position, this.isRtl);
      } else {
        position = this._submenuPosition;
      }

      position = $.extend({
        of: this.active
      }, position); // normalizeHorizontalAlignment() was already called on the ivar

      if (this._clearTimer) {
        this._clearTimer();
      }

      this.element.find('.oj-menu').not(submenu.parents('.oj-menu')).hide().attr('aria-hidden', 'true').removeData(_POSITION_DATA);
      submenu.show().removeAttr('aria-hidden').position(position).data(_POSITION_DATA, position);

      this._getSubmenuAnchor(submenu).attr('aria-expanded', 'true');

      if (!this._isAnimationDisabled()) {
        var busyContext = Context.getContext(this.element[0]).getBusyContext();
        var resolveBusyState = busyContext.addBusyState({
          description: this._getSubmenuBusyStateDescription('opening')
        });

        var animation = this._getDefaultAnimation('submenu', 'open');

        animation = this._replaceAnimationOptions(animation, {
          '#myPosition': position.my
        });
        AnimationUtils.startAnimation(submenu[0], 'open', animation, this).then(resolveBusyState);
      }
    },

    /*
     * Same as calling _collapse(event, "eventSubtree") or _collapse(event, "all"), except that, if delay param is not passed, it collapses the menu immediately.
     */
    __collapseAll: function __collapseAll(event, all, delay) {
      var promise;

      if (this._clearTimer) {
        this._clearTimer();
      }

      var self = this;

      var collapseMenu = function collapseMenu() {
        delete self._clearTimer; // If we were passed an event, look for the submenu that contains the event

        var currentMenu = all ? self.element : $(event && event.target).closest(self.element.find('.oj-menu')); // If we found no valid submenu ancestor, use the main menu to close all sub menus anyway

        if (!currentMenu.length) {
          currentMenu = self.element;
        }

        var closePromise = self._close(currentMenu);

        closePromise = self._runOnPromise(closePromise, function () {
          self._blur(event);

          self.activeMenu = currentMenu;
        });
        return closePromise;
      };

      if (delay) {
        if (this._isAnimationDisabled()) {
          self._clearTimer = self._setTimer(collapseMenu, self._getSubmenuBusyStateDescription('closing'), delay);
        } else {
          promise = new Promise(function (resolve) {
            self._clearTimer = self._setTimer(collapseMenu, self._getSubmenuBusyStateDescription('closing'), delay, function () {
              resolve(true);
            });
          });
        }
      } else {
        promise = collapseMenu();
      }

      if (promise) {
        // Need to add busy state since submenu animation doesn't go through PopupService events
        var resolveBusyState = Context.getContext(this.element[0]).getBusyContext().addBusyState({
          description: 'closing submenus'
        }); // IMPORTANT: Do not change promise to the one returned by then().  Doing
        // so will introduce an additional delay and disrupt the continuity of
        // busy state with any subsequent operation.

        promise.then(resolveBusyState);
      }

      return promise;
    },
    // With no arguments, closes the currently active menu - if nothing is active
    // it closes all menus.  If passed an argument, it will search for menus BELOW
    _close: function _close(startMenu) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      var closePromise; // TODO: Consider refatoring _close moving into the __dismiss logic.  The _close logic
      //      will hide levels of nested menus.  The __dismiss knocks down the root
      //      menu.  Both _close and _dismiss are called from _closeAll which closes
      //      all submenus and the main menu.

      if (!startMenu) {
        // eslint-disable-next-line no-param-reassign
        startMenu = this.active ? this.active.parents('.oj-menu').first() : this.element;
      }

      var self = this;

      var defaultAnimation = self._getDefaultAnimation('submenu', 'close');

      var menus = startMenu.find('.oj-menu');

      var hideSubmenus = function hideSubmenus(submenus) {
        submenus.hide().attr('aria-hidden', 'true').removeData(_POSITION_DATA);

        self._getSubmenuAnchor(submenus).attr('aria-expanded', 'false');
      };

      if (this._isAnimationDisabled()) {
        // If animation is hard-disabled, just hide all submenus at once
        hideSubmenus(menus);
        startMenu.find('.oj-focus-ancestor').removeClass('oj-focus-ancestor');
        closePromise = Promise.resolve(true);
      } else {
        // If there is animation, recursively hide submenus level by level,
        // starting from the innermost level.
        // There is no default close animation, but this allows app to define
        // cascading close animation if it wants to.
        // Define a recurive function that close all submenus of a menu
        var closeSubmenus = function closeSubmenus(currentMenu) {
          var masterPromise = null; // Get <li> child elements of the current menu.  Submenus are rendered as
          // <ul> children of <li> elements.

          var items = $(_findImmediateMenuItems(currentMenu)); // Find all the immediate child menus and iterate through them

          var childMenus = items.children('.oj-menu');
          childMenus.each(function (index, submenu) {
            var jSubmenu = $(submenu); // Define a function that animate the closing and hiding of the iterated menu

            var animateMenuClose = function animateMenuClose() {
              var position = jSubmenu.data(_POSITION_DATA);

              var animation = self._replaceAnimationOptions(defaultAnimation, {
                '#myPosition': position.my
              });

              return AnimationUtils.startAnimation(submenu, 'close', animation, self).then(function () {
                hideSubmenus(jSubmenu);
              });
            };

            if (jSubmenu.is(':visible')) {
              // If the iterated menu is visible, try to close its child menus first
              var promise = closeSubmenus(jSubmenu); // Wait for child menus to close before closing the iterated menu.
              //
              // Keep track of the closing promise for each menu that is visible
              // There should be at most one visible submenu at each level

              masterPromise = self._runOnPromise(promise, animateMenuClose);
            } else {
              // If the iterated menu is not visible, just hide it and set other attributes
              hideSubmenus(jSubmenu);
              masterPromise = Promise.resolve(true);
            }
          }); // After iterating through all child menus, return a master promise

          return masterPromise;
        }; // Start calling the recursive function from the outermost menu


        closePromise = closeSubmenus(startMenu);
        closePromise = this._runOnPromise(closePromise, function () {
          startMenu.find('.oj-focus-ancestor').removeClass('oj-focus-ancestor');
        });
      }

      return closePromise;
    },

    /**
     * Closes one or more open submenus.
     *
     * @memberof oj.ojMenu
     * @instance
     * @private
     * @param {Event=} event - What triggered the menu to collapse.  May be <code class="prettyprint">null</code>.
     *                         May be omitted if the <code class="prettyprint">which</code> parameter is omitted.
     * @param {string=} which - Optional; defaults to <code class="prettyprint">"active"</code>.  Values are the following <code class="prettyprint">string</code>s:
     *     <ul>
     *       <li><code class="prettyprint">"active"</code>: Closes the currently active submenu.</li>
     *       <li><code class="prettyprint">"all"</code>: Closes all submenus.</li>
     *       <li><code class="prettyprint">"eventSubtree"</code>: Closes submenus below but not including the menu that is or contains the target of the triggering event.</li>
     *     </ul>
     */
    _collapse: function _collapse(event, which) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      var promise;

      if (which == null || which === 'active') {
        var newItem = this.activeMenu && this.activeMenu.closest('.oj-menu-item', this.element);

        if (newItem && newItem.length) {
          var self = this;
          promise = this._close();
          promise = this._runOnPromise(promise, function () {
            self._focus(event, newItem);
          });
        }
      } else if (which === 'all' || which === 'eventSubtree') {
        promise = this.__collapseAll(event, which === 'all', this.delay);
      } else {
        Logger.warn('Invalid param ' + which + ' passed to Menu._collapse().  Ignoring the call.');
      }

      return promise;
    },

    /**
     * Opens the submenu below the currently focused item, if one exists.
     *
     * @memberof oj.ojMenu
     * @instance
     * @private
     * @param {Event=} event - What triggered the menu to expand.  May be <code class="prettyprint">null</code> or omitted.
     */
    _expand: function _expand(event) {
      var newItem;
      var submenu;

      if (this.active) {
        submenu = this.active.children('.oj-menu ').first();

        var childMenuItems = _findImmediateMenuItems(submenu);

        if (childMenuItems.length > 0) {
          newItem = $(childMenuItems[0]);
        }
      }

      if (newItem && newItem.length) {
        this._open(event, submenu);

        if (this._clearTimer) {
          this._clearTimer();
        } // Delay so Firefox will not hide activedescendant change in expanding submenu from AT


        this._clearTimer = this._setTimer(function () {
          delete this._clearTimer;

          this._focus(event, newItem);
        }, this._getBusyStateDescription('focusing an item'));
      }
    },

    /**
     * Focuses the next menu item, wrapping at the bottom, as if <kbd>DownArrow</kbd> had been pressed.
     *
     * @memberof oj.ojMenu
     * @instance
     * @private
     * @param {Event=} event - What triggered the focus to move.  May be <code class="prettyprint">null</code> or omitted.
     */
    _next: function _next(event) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      this._move('next', 'first', event);
    },

    /**
     * Focuses the previous menu item, wrapping at the top, as if <kbd>UpArrow</kbd> had been pressed.
     *
     * @memberof oj.ojMenu
     * @instance
     * @private
     * @param {Event=} event - What triggered the focus to move.  May be <code class="prettyprint">null</code> or omitted.
     */
    _previous: function _previous(event) {
      this._move('prev', 'last', event);
    },
    _move: function _move(direction, filter, event) {
      var next;

      var menuItems = _findImmediateMenuItems(this.activeMenu);

      var i = menuItems.indexOf(this.active ? this.active[0] : null);

      if (i > -1) {
        if (direction === 'first') {
          next = menuItems[0];
        } else if (direction === 'last') {
          next = menuItems[menuItems.length - 1];
        } else if (direction === 'next') {
          // if next and not beyond the last menu item, choose next; otherwise, choose first.
          if (i + 1 < menuItems.length) {
            next = menuItems[i + 1];
          } else {
            next = menuItems[0];
          }
        } else if (direction === 'prev') {
          // if prev and not before the first, choose prev; otherwise, choose last.
          if (i - 1 > -1) {
            next = menuItems[i - 1];
          } else {
            next = menuItems[menuItems.length - 1];
          }
        }
      } else if (filter === 'first') {
        next = menuItems[0];
      } else {
        next = menuItems[menuItems.length - 1];
      }

      this._focus(event, $(next));
    },

    /* TODO: update JSdoc to be something like this revised version, once todo's in code are resolved.
     * Let selectItem be the currently focused menu item if any, else the menu item containing the target of the supplied event if any, else null.
     *
     * If selectItem is non-null, this method selects that item, collapses all submenus, and triggers the menu's
     * <code class="prettyprint">select</code> event.
     *
     * Internally, this method should not be invoked for parent menu items or disabled menu items. But still there is a chance of
     * invoking _select() externally. (Not anymore now that it's private.) In that case, if focused menu item is a disabled or parent menu item then a warning message will be logged.
     */

    /**
     * Selects the currently focused menu item, collapses all submenus and triggers the menu's <code class="prettyprint">select</code> event.
     *
     * @memberof oj.ojMenu
     * @instance
     * @private
     * @param {Event=} event - What triggered the selection.  May be <code class="prettyprint">null</code> or omitted.
     */
    _select: function _select(event) {
      // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
      // If no menu item is focused, then infer one from the event if possible.  TBD: still need this now that not public?  Or is this.active always set?
      if (!this.active && event && event.target) {
        var menuItem = $(event.target).closest('.oj-menu-item');

        if (menuItem.closest(this.element).length) {
          this._makeActive(menuItem, event);
        }
      } // payload for select event


      var ui = this.active.is(this._cancelItem) ? undefined // don't fire select for Cancel item
      : {
        item: this.active
      }; // must grab this.active before calling __collapseAll, which clears this.active
      // The menu item has been selected, so we can collapse all menus immediately with no timeout via __collapseAll.
      // If we call the version with a timeout, _collapse(event, "all"), then mouseleave event handler will invoke _collapse(event, "eventSubtree") on event.target
      // which will clear our scheduled _collapse(event, "all") on this.element, so that submenu will not be collapsed,
      // which means that when the menu is later re-launched, the submenu is already open.

      var promise = this.__collapseAll(event, true);

      this._runOnPromise(promise, function () {
        this._focusLauncherAndDismiss(event, ui);
      }.bind(this));
    },

    /**
     * @instance
     * @private
     */
    _surrogateRemoveHandler: function _surrogateRemoveHandler() {
      // In all cases except when the dialog is already open, removal of the
      // surrogate during opening or closing will result in implicit removal.
      // 1) CLOSING: Handled in oj.ZOrderUtils.removeFromAncestorLayer.  If the
      //    surrogate doesn't exist the layer containing the popup dom is detached.
      // 2) OPENING: in the PopupServiceImpl#open _finalize, if the surrogate doesn't
      //    exist after in the open state, this remove callback is invoked.
      //
      // Custom element will call _NotifyDetached after element.remove but
      // but jquery UI instances will invoke the _destory method.
      var element = this.element;
      var status = oj.ZOrderUtils.getStatus(element);

      if (status === oj.ZOrderUtils.STATUS.OPEN) {
        element.remove();
      }
    },

    /**
     * @instance
     * @private
     * @return {!Object.<oj.PopupService.EVENT, function(...)>}
     */
    _getPopupServiceEvents: function _getPopupServiceEvents() {
      if (!this._popupServiceEvents) {
        /** @type {!Object.<oj.PopupService.EVENT, function(...)>} **/
        var events = {};
        this._popupServiceEvents = events;
        events[oj.PopupService.EVENT.POPUP_CLOSE] = this._closeAll.bind(this);
        events[oj.PopupService.EVENT.POPUP_REMOVE] = this._surrogateRemoveHandler.bind(this);
        events[oj.PopupService.EVENT.POPUP_REFRESH] = this._reposition.bind(this);
        events[oj.PopupService.EVENT.POPUP_AUTODISMISS] = this._clickAwayHandler.bind(this);
        events[oj.PopupService.EVENT.POPUP_BEFORE_OPEN] = this._beforeOpenHandler.bind(this);
        events[oj.PopupService.EVENT.POPUP_AFTER_OPEN] = this._afterOpenHandler.bind(this);
        events[oj.PopupService.EVENT.POPUP_BEFORE_CLOSE] = this._beforeCloseHandler.bind(this);
        events[oj.PopupService.EVENT.POPUP_AFTER_CLOSE] = this._afterCloseHandler.bind(this);
      }

      return this._popupServiceEvents;
    },

    /**
     * @instance
     * @private
     */
    _closeAll: function _closeAll() {
      // TODO: Don't want to animate when force close a menu. This flag is not
      // hooked in the beforeCloseHandler.  There is only a custom element check. Doesn't
      // currently matter because the menu doesn't support custom element syntax yet.
      this._disableAnimation = true;

      this._close(this.element);

      this.__dismiss(null); // Forced menu dismissal doesn't queue the close event for some reason. The busy
      // state is resolved on the close event from the mediator.  Force the busy state to release.


      this._setWhenReady('none');
    },

    /**
     * @private
     * @param {Object} pos "my" element associated with the position object
     * @param {Object} props directions as to where the element should be moved
     */
    _usingHandler: function _usingHandler(pos, props) {
      var rootMenu = props.element.element;
      rootMenu.css(pos); // Capture the position data so that we can set transform-origin later on

      oj.PositionUtils.captureTransformOriginAnimationEffectsOption(rootMenu, props); // call on the original using

      var position = rootMenu.data(_POSITION_DATA);
      var origUsing = position.origUsing;

      if (origUsing) {
        origUsing(pos, props);
      } // implicitly dismiss the menu when the position.of is clipped in an overflow container.


      if (oj.PositionUtils.isAligningPositionClipped(props)) {
        this._clearCloseDelayTimer = this._setTimer(this._closeAll, this._getSubmenuBusyStateDescription('closing'), 1);
      }
    },
    // @inheritdoc
    getNodeBySubId: function getNodeBySubId(locator) {
      switch (locator && locator.subId) {
        case _SUBID_CANCEL:
          // only return it if it's currently in the DOM, never when it's detached
          return this._cancelDomAttached ? this._cancelItem[0] : null;

        default:
          return this._super(locator);
      }
    },

    /**
     * {@ojinclude "name":"getSubIdByNodeDesc"}
     *
     * @expose
     * @ignore
     * @memberof oj.ojMenu
     * @instance
     * @since 2.1.0
     *
     * @param {!Element} node {@ojinclude "name":"getSubIdByNodeNodeParam"}
     * @return {Object|null} {@ojinclude "name":"getSubIdByNodeReturn"}
     *
     * @example <caption>{@ojinclude "name":"getSubIdByNodeCaption"}</caption>
     * {@ojinclude "name":"getSubIdByNodeExample"}
     */
    getSubIdByNode: function getSubIdByNode(node) {
      return this._cancelItem && this._cancelItem.is($(node).parents().addBack(node)) ? {
        subId: _SUBID_CANCEL
      } : this._super(node);
    },

    /**
     * Called on menu open.
     * @private
     * @param {string} display - the display value for the current launch, before resolving "auto"
     */
    _isDropDown: function _isDropDown(display) {
      if (this._hasSubmenus) {
        return true;
      }

      switch (display) {
        case 'dropDown':
          return true;

        case 'sheet':
          return false;

        default:
          return Config.getDeviceRenderMode() !== 'phone';
      }
    },

    /**
     * Called on menu open. Adds or removes the Cancel menu item and its divider, as needed.
     * @private
     * @param {boolean} isDropDown
     */
    _toggleCancelDom: function _toggleCancelDom(isDropDown) {
      function getItemBeforeDivider(menu, cancelDom) {
        var menuItems = _findImmediateMenuItems(menu);

        var i = menuItems.indexOf(cancelDom[1]); // find the divider

        return $(menuItems[i - 1]);
      }

      if (!_SHEETS_HAVE_CANCEL_ITEM) {
        return; // shouldn't add cancel DOM, and no need to remove it since it could never have been added
      }

      if (isDropDown) {
        if (this._cancelDomAttached) {
          getItemBeforeDivider(this.element, this._getCancelDom()).removeClass('oj-menu-item-before-divider');

          this._getCancelDom().detach();

          this._cancelDomAttached = false;
        }
      } else {
        // if detached, adds it.  If attached, ensures it's at the end of the menu where it belongs,
        // even if app or component has appended menu items.
        var cancelDom = this._getCancelDom();

        cancelDom.appendTo(this.element); // @HTMLUpdateOK trusted string per annotations in callee

        getItemBeforeDivider(this.element, cancelDom).addClass('oj-menu-item-before-divider');
        this._cancelDomAttached = true;
      }
    },

    /**
     * Called on menu open when menu needs to add a cancel item for this launch.
     * @private
     * @return {jQuery} JQ object with Cancel divider and Cancel menu item in correct order
     */
    _getCancelDom: function _getCancelDom() {
      if (!this._cancelDom) {
        var divider = $('<li></li>', this.document[0]); // @HTMLUpdateOK trusted string

        var a = $("<a href='#'></a>", this.document[0]) // @HTMLUpdateOK trusted string
        .text(this.options.translations.labelCancel);
        $("<span class='oj-menu-item-icon oj-component-icon oj-menu-cancel-icon'></span>", this.document[0]).prependTo(a); // @HTMLUpdateOK trusted string

        var li = $('<li></li>', this.document[0]).addClass('oj-menu-item-cancel oj-menu-item-after-divider').append(a); // @HTMLUpdateOK trusted string

        this._initDividers(divider);

        this._initAnchors(a);

        this._initMenuItems(li);

        this._cancelAnchor = a;
        this._cancelItem = li;
        this._cancelDom = $([divider[0], li[0]]); // need array-of-elem syntax to guarantee order
      }

      return this._cancelDom;
    },

    /**
     * Called at create. Sets up Hammer swipe-down-to-dismiss-menu listener if enabled via SASS var.
     * @private
     */
    _setupSwipeBehavior: function _setupSwipeBehavior() {
      if (!_SHEETS_HAVE_SWIPE_DOWN_TO_DISMISS) {
        return;
      }

      this.element.ojHammer(_HAMMER_OPTIONS);

      this._on({
        swipedown: function swipedown(event) {
          // important to check "sheet menu currently open", not "last launch was sheet menu",
          // since a single swipe can fire 2 swipe events, and the 2nd one finds the menu already
          // closed and NPE's if it enters the "if" block
          if (this._sheetMenuIsOpen && event.gesture.pointerType === 'touch') {
            // Hammer events fire for mouse too
            this.__collapseAll(event, true);

            this._focusLauncherAndDismiss(event);
          }
        }
      });
    },

    /**
     * Creates a Promise exposed by the {@link oj.ojMenu#whenReady} method.
     *
     * @param {string} operation valid values are "open", "close" or "none"
     * @memberof oj.ojMenu
     * @instance
     * @private
     */
    _setWhenReady: function _setWhenReady(operation) {
      /** @type {oj.PopupWhenReadyMediator} */
      var mediator = this._whenReadyMediator;

      if (mediator) {
        mediator.destroy();
        delete this._whenReadyMediator;
      } // operation === none


      if (['open', 'close'].indexOf(operation) < 0) {
        return;
      }

      this._whenReadyMediator = new oj.PopupWhenReadyMediator(this.element, operation, 'ojMenu', this._IsCustomElement());
    },

    /**
     * Checks to see if there is a pending "open" or "close" operation.  If pending and it
     * is the same as the requested operation, the request silently fails.  If the current
     * operation is the inverse operation, we queue the current operation after the pending
     * operation is resolved.
     *
     * @memberof oj.ojMenu
     * @instance
     * @private
     * @param {string} operation currently requested
     * @param {string} methodName to invoke to trigger the target operation
     * @param {Array} methodArgs passed to a queue operation
     * @return {boolean} <code>true</code> if a close or open operation is pending completion.
     */
    _isOperationPending: function _isOperationPending(operation, methodName, methodArgs) {
      /** @type {oj.PopupWhenReadyMediator} **/
      var mediator = this._whenReadyMediator;

      if (mediator) {
        return mediator.isOperationPending(this, operation, methodName, methodArgs);
      }

      return false;
    },

    /**
     * Adds a busy state with the specified description.
     *
     * Asynchronously, after the specified delay in ms, calls callback with "this" bound to this menu instance,
     * and then resolves the busy state.
     *
     * Returns a "cancel" function that if called:
     * - Cancels the timer, so that the callback is never called (unless it has already been called).
     * - Resolves the busy state.
     *
     * @memberof oj.ojMenu
     * @instance
     * @private
     * @param {function()} callback
     * @param {string} description
     * @param {number=} delay in ms. Defaults to 0.
     * @param {function()=} notifier - A function to notify the caller of several conditions so that it can clean up:
     *                                 1. The timer is cancelled before "callback" is called
     *                                 2. "callback" is called and doesn't return a promise
     *                                 3. "callback" is called, returns a promise, and the promise is resolved
     * @return {function()} a "cancel" function as described above
     */
    _setTimer: function _setTimer(callback, description, delay, notifier) {
      // Call this line each time rather than caching busyContext
      var resolve = Context.getContext(this.element[0]).getBusyContext().addBusyState({
        description: description
      }); // resolve() bombs if called a 2nd time, so prevent that possibility by wrapping it in a function that can't call
      // it twice, and never calling resolve() directly. If that "bombs 2nd time" behavior is removed from the BusyContext
      // framework, can remove this "resolveOnce" wrapper var, and just call resolve() below.

      var resolveOnce = function resolveOnce() {
        if (resolve) {
          resolve();
          resolve = null;

          if (notifier) {
            notifier();
          }
        }
      };

      var self = this;
      var id = setTimeout(function () {
        var result = callback.bind(self)();

        if (result && result instanceof Promise) {
          // If the callback returns a promise, resolve busy state when the promise resolves.
          result.then(resolveOnce);
        } else {
          // If the callback doesn't return a promise, just resolve the busy state
          resolveOnce();
        }
      }, delay || 0);
      return function () {
        clearTimeout(id);
        resolveOnce();
      };
    },
    // action is "focusing an item", ...
    _getBusyStateDescription: function _getBusyStateDescription(action) {
      return "Menu with id '" + this.element.attr('id') + "' is busy " + action + '.';
    },
    // action is "opening", "closing", "closing and opening", ...
    _getSubmenuBusyStateDescription: function _getSubmenuBusyStateDescription(action) {
      return this._getBusyStateDescription(action + ' a submenu');
    },

    /**
     * Notifies the component that its subtree has been removed from the document
     * programmatically after the component has been created.
     *
     * @memberof oj.ojMenu
     * @instance
     * @protected
     * @override
     */
    _NotifyDetached: function _NotifyDetached() {
      // detaching an open menu results in implicit dismissal
      if (oj.ZOrderUtils.getStatus(this.element) === oj.ZOrderUtils.STATUS.OPEN) {
        this._closeAll();
      }

      this._super();
    } // Override contextMenu slot definition to remove it from the jsdoc as it is not supported for menus

    /**
     * @ojslot contextMenu
     * @memberof oj.ojMenu
     * @ignore
     */
    // API doc for inherited methods with no JS in this file:

    /**
     * <p>The &lt;oj-menu> element accepts <code class="prettyprint">oj-option</code> and <code class="prettyprint">oj-menu-select-many</code> as child elements.  See
     * the [oj-option]{@link oj.ojOption} documentation for details about accepted children and slots.</p>
     *
     * @ojchild Default
     * @memberof oj.ojMenu
     * @ojshortdesc The oj-menu element accepts oj-option and oj-menu-select-many as child elements.
     *
     * @example <caption>Initialize the Menu with child content specified:</caption>
     * &lt;oj-menu>
     *   &lt;oj-option value="option1">Option 1&lt;/oj-option>
     *   &lt;oj-option value="option2">Option 2&lt;/oj-option>
     *   &lt;oj-option value="option3">Option 3&lt;/oj-option>
     * &lt;/oj-menu>
     */

    /**
     * Returns a <code class="prettyprint">jQuery</code> object containing the root element of the Menu component.
     *
     * @method
     * @name oj.ojMenu#widget
     * @memberof oj.ojMenu
     * @instance
     * @ignore
     * @return {jQuery} the root element of the component
     */

    /**
     * Removes the menu functionality completely. This will return the element back to its pre-init state.
     *
     * @method
     * @name oj.ojMenu#destroy
     * @memberof oj.ojMenu
     * @instance
     * @ignore
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
     *       <td>Menu Item</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Invoke the menu item's action.</td>
     *     </tr>
     *     <tr>
     *       <td>Menu</td>
     *       <td><kbd>Swipe Down</kbd></td>
     *       <td>Dismiss the menu, if "swipe to dismiss" is enabled by the application.</td>
     *     </tr>
     *     <tr>
     *       <td>JET Component or HTML Element having a JET Context Menu</td>
     *       <td><kbd>Press & Hold</kbd></td>
     *       <td>Open the context menu.</td>
     *     </tr>
     *     <tr>
     *       <td>Outside of Menu</td>
     *       <td><kbd>Touch</kbd></td>
     *       <td>Close the menu.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <p>Disabled items do not allow any touch interaction.
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojMenu
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
     *       <td rowspan = "5">Menu Item</td>
     *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
     *       <td>Invoke the focused menu item's action.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Move focus to the previous menu item, wrapping around at the top.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Move focus to the next menu item, wrapping around at the bottom.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Home</kbd></td>
     *       <td>Move focus to the first menu item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>End</kbd></td>
     *       <td>Move focus to the last menu item.</td>
     *     </tr>
     *     <tr>
     *       <td>Menu Item in Top-level Menu</td>
     *       <td><kbd>Esc</kbd></td>
     *       <td>Close the menu and move focus to the launcher.</td>
     *     </tr>
     *     <tr>
     *       <td>JET Component or HTML Element having a JET Context Menu</td>
     *       <td><kbd>Shift + F10</kbd></td>
     *       <td>Open the context menu.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <p>* RTL refers to pages written in a right-to-left language such as Arabic.
     *
     * <p>Typing a letter moves focus to the first item whose title starts with that character. Repeating the same character cycles through matching items.
     * Typing more characters within the one second timer matches those characters.
     *
     * <p>Note that the "Search for text when I start typing" feature in Firefox can interfere with web content that accepts keystrokes, such as this "type a letter" feature of JET Menu.
     *
     * <p>Disabled items can receive keyboard focus, but do not allow any other interaction.
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojMenu
     */

  });

  Components.setDefaultOptions({
    ojMenu: // properties for all menu components
    {
      openOptions: Components.createDynamicPropertyGetter(function (context) {
        var position;

        if (oj.BaseCustomElementBridge.getRegistered(context.element.tagName) != null) {
          if (context.containers.indexOf('ojMenu') >= 0) {
            position = {
              my: {
                horizontal: 'start',
                vertical: 'top'
              },
              at: {
                horizontal: 'end',
                vertical: 'top'
              },
              offset: {
                x: 0,
                y: 0
              },
              collision: 'flipfit'
            };
          } else {
            position = {
              my: {
                horizontal: 'start',
                vertical: 'top'
              },
              at: {
                horizontal: 'start',
                vertical: 'bottom'
              },
              offset: {
                x: 0,
                y: 0
              },
              collision: 'flipfit'
            };
          }
        } else {
          position = {
            my: 'start top',
            at: 'start bottom',
            collision: 'flipfit'
          };
        }

        return {
          position: position
        };
      })
    }
  }); // ////////////////     SUB-IDS     //////////////////

  /**
   * <p>Sub-ID for the <a href="#dismissal-section">"Cancel"</a> menu item.</p>
   *
   * @ojsubid oj-menu-cancel-command
   * @memberof oj.ojMenu
   * @since 2.1.0
   *
   * @example <caption>Get the node for the "Cancel" menu item:</caption>
   * var node = myMenu.getNodeBySubId( {'subId': 'oj-menu-cancel-command'} );
   */
})();



/* global __oj_menu_metadata:false */
(function () {
  __oj_menu_metadata.extension._WIDGET_NAME = 'ojMenu';
  oj.CustomElementBridge.register('oj-menu', {
    metadata: __oj_menu_metadata
  });
})();

});