/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojoption', 'ojs/ojcore-base', 'jquery', 'ojs/ojdomutils', 'ojs/ojthemeutils', 'ojs/ojcomponentcore', 'ojs/ojchildmutationobserver', 'ojs/ojlabelledbyutils', 'ojs/ojcustomelement-utils', 'ojs/ojbutton2'], function (ojoption, oj, $, DomUtils, ThemeUtils, Components, ChildMutationObserver, LabelledByUtils, ojcustomelementUtils, ojbutton2) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  ChildMutationObserver = ChildMutationObserver && Object.prototype.hasOwnProperty.call(ChildMutationObserver, 'default') ? ChildMutationObserver['default'] : ChildMutationObserver;
  LabelledByUtils = LabelledByUtils && Object.prototype.hasOwnProperty.call(LabelledByUtils, 'default') ? LabelledByUtils['default'] : LabelledByUtils;

var __oj_menu_button_metadata = 
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
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "display": {
      "type": "string",
      "enumValues": [
        "all",
        "icons",
        "label"
      ],
      "value": "all"
    },
    "label": {
      "type": "string"
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
  "events": {
    "ojAction": {}
  },
  "extension": {}
};
  /* global __oj_menu_button_metadata */
  (function () {
    __oj_menu_button_metadata.extension._WIDGET_NAME = 'ojButton';
    __oj_menu_button_metadata.extension._TRACK_CHILDREN = 'nearestCustomElement';
    __oj_menu_button_metadata.extension._GLOBAL_TRANSFER_ATTRS = [
      'href',
      'aria-label',
      'aria-labelledby',
      'aria-describedby'
    ];
    oj.CustomElementBridge.register('oj-menu-button', {
      metadata: __oj_menu_button_metadata,
      innerDomFunction: function (element) {
        return element.getAttribute('href') ? 'a' : 'button';
      }
    });
  })();

var __oj_buttonset_one_metadata = 
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
    "describedBy": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "display": {
      "type": "string",
      "enumValues": [
        "all",
        "icons",
        "label"
      ],
      "value": "all"
    },
    "focusManagement": {
      "type": "string",
      "enumValues": [
        "none",
        "oneTabstop"
      ],
      "value": "oneTabstop"
    },
    "labelledBy": {
      "type": "string"
    },
    "translations": {
      "type": "object",
      "value": {}
    },
    "value": {
      "type": "any",
      "writeback": true
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
  /* global __oj_buttonset_one_metadata */
  (function () {
    __oj_buttonset_one_metadata.extension._WIDGET_NAME = 'ojButtonset';
    __oj_buttonset_one_metadata.extension._ALIASED_PROPS = { value: 'checked' };
    oj.CustomElementBridge.register('oj-buttonset-one', {
      metadata: __oj_buttonset_one_metadata
    });
  })();

var __oj_buttonset_many_metadata = 
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
    "describedBy": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "display": {
      "type": "string",
      "enumValues": [
        "all",
        "icons",
        "label"
      ],
      "value": "all"
    },
    "focusManagement": {
      "type": "string",
      "enumValues": [
        "none",
        "oneTabstop"
      ],
      "value": "oneTabstop"
    },
    "labelledBy": {
      "type": "string"
    },
    "translations": {
      "type": "object",
      "value": {}
    },
    "value": {
      "type": "Array<any>",
      "writeback": true
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
  /* global __oj_buttonset_many_metadata */
  (function () {
    __oj_buttonset_many_metadata.extension._WIDGET_NAME = 'ojButtonset';
    __oj_buttonset_many_metadata.extension._ALIASED_PROPS = { value: 'checked' };
    oj.CustomElementBridge.register('oj-buttonset-many', {
      metadata: __oj_buttonset_many_metadata
    });
  })();

  /* eslint-disable quote-props */
  /* eslint-disable quotes */

  // Backdoor for using widget-based implmentation instead of VComponent implementation for oj-button.
  // Apps can enable it by mapping ojs/ojbutton2 to ojs/ojbuttonlegacy in requirejs.config.
  // We can't register oj-button in ojbuttonlegacy because it needs to be done at the same time as
  // ojButton widget.  Otherwise the framework may try to create oj-button custom element prematurely.
  //
  if (oj.ButtonLegacy) {
    // The metadata is usually generated from jsdoc during the build.
    // However, including jsdoc will cause it to appear in the actual API doc, so we specify the metadata directly.

    // eslint-disable-next-line camelcase
    var __oj_button_legacy_metadata = {
      properties: {
        chroming: {
          type: 'string',
          enumValues: ['borderless', 'callToAction', 'danger', 'full', 'half', 'outlined', 'solid']
        },
        disabled: {
          type: 'boolean',
          value: false
        },
        display: {
          type: 'string',
          enumValues: ['all', 'icons', 'label'],
          value: 'all'
        },
        translations: {
          type: 'object',
          value: {}
        }
      },
      methods: {
        refresh: {},
        setProperty: {},
        getProperty: {},
        setProperties: {},
        getNodeBySubId: {},
        getSubIdByNode: {}
      },
      events: {
        ojAction: {}
      },
      extension: {}
    };

    (function () {
      __oj_button_legacy_metadata.extension._WIDGET_NAME = 'ojButton';
      __oj_button_legacy_metadata.extension._TRACK_CHILDREN = 'nearestCustomElement';
      __oj_button_legacy_metadata.extension._GLOBAL_TRANSFER_ATTRS = [
        'href',
        'aria-label',
        'aria-labelledby',
        'aria-describedby'
      ];
      oj.CustomElementBridge.register('oj-button', {
        metadata: __oj_button_legacy_metadata,
        innerDomFunction: function (element) {
          return element.getAttribute('href') ? 'a' : 'button';
        }
      });
    })();
  }

  (function () {
    // Button / Buttonset wrapper function, to keep "private static members" private
    // -----------------------------------------------------------------------------
    // "private static members" shared by all buttons and buttonsets
    // -----------------------------------------------------------------------------
    var _lastActive;
    var _lastToggleActive;

    var BASE_CLASSES = 'oj-button oj-component oj-enabled oj-default'; // oj-enabled is a state class, but convenient to include in this var instead
    var STATE_CLASSES = 'oj-hover oj-active oj-selected';
    var TYPE_CLASSES =
      'oj-button-icons-only oj-button-icon-only oj-button-text-icons oj-button-text-icon-start oj-button-text-icon-end oj-button-text-only';
    var CHROMING_CLASSES =
      'oj-button-full-chrome oj-button-half-chrome oj-button-outlined-chrome oj-button-cta-chrome oj-button-danger-chrome';

    var _chromingMap = {
      solid: 'oj-button-full-chrome',
      outlined: 'oj-button-outlined-chrome',
      borderless: 'oj-button-half-chrome',
      full: 'oj-button-full-chrome',
      half: 'oj-button-half-chrome',
      callToAction: 'oj-button-cta-chrome',
      danger: 'oj-button-danger-chrome oj-button-full-chrome'
    };

    var _interestingContainers = {
      button: ['ojButtonset', 'ojToolbar'],
      buttonset: ['ojToolbar']
    };

    /**
     * @ojcomponent oj.ojButton
     * @augments oj.baseComponent
     * @since 0.6.0
     * @ojdeprecated [
     *  {
     *    type: "maintenance",
     *    since: "15.0.0",
     *    value: ["oj-c-button"]
     *  }
     * ]
     *
     * @ojshortdesc Buttons direct users to initiate or take actions and work with a single tap, click, or keystroke.
     * @ojrole button
     * @ojsignature [{
     *                target: "Type",
     *                value: "class ojButton<SP extends ojButtonSettableProperties = ojButtonSettableProperties> extends baseComponent<SP>"
     *               }
     *              ]
     *
     * @ojpropertylayout {propertyGroup: "common", items: ["label", "display", "chroming", "disabled"]}
     * @ojvbdefaultcolumns 2
     * @ojvbmincolumns 1
     *
     * @ojuxspecs ['button']
     *
     * @classdesc
     * <h3 id="buttonOverview-section">
     *   JET Button
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonOverview-section"></a>
     * </h3>
     *
     * <p>Description: Themeable, WAI-ARIA-compliant push buttons, with appropriate styles for hover, active, checked, and disabled.
     *
     * <p>To create toggle buttons, see the [JET Buttonset]{@link oj.ojButtonset}.
     *
     * <pre class="prettyprint"><code>&lt;oj-button id="myButton">
     *     &lt;span>My Button&lt;/span>
     * &lt;/oj-button>
     * </code></pre>
     *
     * <h3 id="pushButtons-section">
     *   Push Buttons
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pushButtons-section"></a>
     * </h3>
     *
     * <p>Push buttons are ordinary buttons that do not stay pressed in when clicked.
     * Push buttons are created from <code class="prettyprint">oj-button</code> elements.
     *
     * <h3 id="buttonsetToolbar-section">
     *   Buttonsets and Toolbars
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonsetToolbar-section"></a>
     * </h3>
     *
     * <p>The [JET Buttonset]{@link oj.ojButtonset} component can be used to create toggle buttons or group related buttons, such as a group of radios or checkboxes.  Buttonset provides
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
     * <p>For accessibility, it is not required to set an aria label on a JET button as it uses the text in the default slot to generate an aria label.
     * Therefore the default slot should be filled even if the button is <a href="#display">icon-only (display=icons)</a>. However,
     * you can override the default behavior by setting <code class="prettyprint">aria-label</code> or <code class="prettyprint">aria-labelledby</code>.
     * For providing additional description, you can set <code class="prettyprint">aria-describedby</code> with id of span with custom description
     * {@ojinclude "name":"accessibilityCommon"}
     *
     * <h3 id="migration-section">
     *   Migration
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
     *  </h3>
     *  To migrate from oj-button to oj-c-button, you need to revise the import statement and references to oj-c-button in your app.  Please note the changes between the two components below.
     *  <h5>Label attribute</h5>
     *  <p>The default slot is no longer supported.  Text labels must be provide using the label attribute.</p>
     *  <h5>Context Menu</h5>
     *   <p>The context menu is no longer supported. </p>
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
    // API doc for inherited methods with no JS in this file:

    /**
     * <p>The default slot is the button's text label, if no label attribute is specified. The <code class="prettyprint">&lt;oj-button></code> element accepts plain text or DOM nodes as children for the default slot.
     * A default slot label is required for all buttons for accessibility purposes, if no label attribute is specified. The label can be hidden using the display attribute.</p>
     *
     * <p>If a text node is provided it will be wrapped in a span.</p>
     *
     * Note that if both a default slot and a label attribute are provided, the attribute takes precedence over the default slot.
     *
     * @ojchild Default
     * @memberof oj.ojButton
     * @ojshortdesc The default slot is the button's text label. The oj-button element accepts plain text or DOM nodes as children for the default slot.
     *
     * @example <caption>Initialize the Button with child content specified:</caption>
     * &lt;oj-button>
     *   &lt;span>myValue&lt;/span>
     * &lt;/oj-button>
     *
     * @example <caption>Initialize the Button with data-bound child content specified in a span:</caption>
     * &lt;oj-button>
     *   &lt;span>
     *     &lt;oj-bind-text value='[[myText]]'>&lt;/oj-bind-text>
     *   &lt;/span>
     * &lt;/oj-button>
     *
     * @example <caption>Initialize the Button with data-bound child content specified without a container element:</caption>
     * &lt;oj-button>
     *   &lt;oj-bind-text value='[[myText]]'>&lt;/oj-bind-text>
     * &lt;/oj-button>
     */

    /**
     * <p>The default slot is the menu button's text label. The <code class="prettyprint">&lt;oj-menu-button></code> element accepts plain text or DOM nodes as children for the default slot.
     * A default slot label is required for all menu buttons for accessibility purposes. The label can be hidden using the display attribute.</p>
     *
     * <p>If a text node is provided it will be wrapped in a span.</p>
     *
     * @ojchild Default
     * @memberof oj.ojMenuButton
     * @ojshortdesc The default slot is the button's text label. The oj-menu-button element accepts plain text or DOM nodes as children for the default slot.
     *
     * @example <caption>Initialize the Menu Button with child content specified:</caption>
     * &lt;oj-menu-button>
     *   &lt;span>myValue&lt;/span>
     * &lt;/oj-menu-button>
     *
     * @example <caption>Initialize the Menu Button with data-bound child content specified in a span:</caption>
     * &lt;oj-menu-button>
     *   &lt;span>
     *     &lt;oj-bind-text value='[[myText]]'>&lt;/oj-bind-text>
     *   &lt;/span>
     * &lt;/oj-menu-button>
     *
     * @example <caption>Initialize the Menu Button with data-bound child content specified without a container element:</caption>
     * &lt;oj-menu-button>
     *   &lt;oj-bind-text value='[[myText]]'>&lt;/oj-bind-text>
     * &lt;/oj-menu-button>
     */

    /**
     * <p>The <code class="prettyprint">startIcon</code> slot is the button's start icon. The  <code class="prettyprint">&lt;oj-button></code> element accepts DOM nodes as children with the startIcon slot.</p>
     *
     * @ojslot startIcon
     * @memberof oj.ojButton
     * @ojshortdesc The startIcon slot is the button's start icon. The oj-button element accepts DOM nodes as children with the startIcon slot.
     *
     * @ojtsexample
     * &lt;oj-button>
     *   &lt;span slot='startIcon' class='myIconClass'>&lt;/span>
     *   &lt;span>myValue&lt;/span>
     * &lt;/oj-button>
     */

    /**
     * <p>The <code class="prettyprint">startIcon</code> slot is the menu button's start icon. The  <code class="prettyprint">&lt;oj-menu-button></code> element accepts DOM nodes as children with the startIcon slot.</p>
     *
     * @ojslot startIcon
     * @memberof oj.ojMenuButton
     * @ojshortdesc The startIcon slot is the button's start icon. The oj-menu-button element accepts DOM nodes as children with the startIcon slot.
     *
     * @example <caption>Initialize the Menu Button with child content specified for the startIcon:</caption>
     * &lt;oj-menu-button>
     *   &lt;span slot='startIcon' class='myIconClass'>&lt;/span>
     *   &lt;span>myValue&lt;/span>
     * &lt;/oj-menu-button>
     */

    /**
     * <p>The <code class="prettyprint">endIcon</code> slot is the button's end icon. The  <code class="prettyprint">&lt;oj-button></code> element accepts DOM nodes as children with the endIcon slot.</p>
     *
     * @ojslot endIcon
     * @memberof oj.ojButton
     * @ojshortdesc The endIcon slot is the button's end icon. The oj-button element accepts DOM nodes as children with the endIcon slot.
     *
     * @ojtsexample
     * &lt;oj-button>
     *   &lt;span>myValue&lt;/span>
     *   &lt;span slot='endIcon' class='myIconClass'>&lt;/span>
     * &lt;/oj-button>
     */

    /**
     * <p>The <code class="prettyprint">endIcon</code> slot is the menu button's end icon. The  <code class="prettyprint">&lt;oj-menu-button></code> element accepts DOM nodes as children with the endIcon slot. If no end icon is provided, a default end icon is used.</p>
     *
     * @ojslot endIcon
     * @memberof oj.ojMenuButton
     * @ojshortdesc The endIcon slot is the button's end icon. The oj-menu button element accepts DOM nodes as children with the endIcon slot.
     *
     * @example <caption>Initialize the Menu Button with child content specified for the endIcon:</caption>
     * &lt;oj-menu-button>
     *   &lt;span>myValue&lt;/span>
     *   &lt;span slot='endIcon' class='myIconClass'>&lt;/span>
     * &lt;/oj-menu-button>
     */

    /**
     * <p>The <code class="prettyprint">menu</code> menu associated with the menu button. The <code class="prettyprint">oj-menu-button</code> element accepts a single <code class="prettyprint">oj-menu</code> element as a child with the menu slot. See the [JET Menu]{@link oj.ojMenu} for more information on setting up a menu.</p>
     *
     * @ojslot menu
     * @ojmaxitems 1
     * @memberof oj.ojMenuButton
     * @ojshortdesc The menu associated with the menu button. The oj-menu-button element accepts a single oj-menu element as a child with the menu slot.
     * @ojpreferredcontent ["MenuElement"]
     *
     * @example <caption>Initialize the Menu Button with child content specified for the menu:</caption>
     * &lt;oj-menu-button>
     *   &lt;span>myValue&lt;/span>
     *   &lt;oj-menu slot="menu" style="display:none" aria-label="This menu button's menu">
     *   ...
     *   &lt;/oj-menu>
     * &lt;/oj-menu-button>
     */

    // Fragments:

    /**
     * <p>See also the <a href="#styling-section">oj-focus-highlight</a> discussion.
     *
     * <p>Disabled content: JET supports an accessible luminosity contrast ratio,
     * as specified in <a href="http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">WCAG 2.0 - Section 1.4.3 "Contrast"</a>,
     * in the themes that are accessible.  (See the "Theming" chapter of the JET Developer Guide for more information on which
     * themes are accessible.)  Note that Section 1.4.3 says that text or images of text that are part of an inactive user
     * interface component have no contrast requirement.  Because disabled content may not meet the minimum contrast ratio
     * required of enabled content, it cannot be used to convey meaningful information.<p>
     *
     * @ojfragment accessibilityCommon
     * @memberof oj.ojButton
     * @instance
     */

    /**
     * <p>Built-in KO bindings, like KO's <code class="prettyprint">disable</code> binding, should not be used for state with a JS API, since that is tatamount to
     * updating the DOM directly.  The component attribute should be bound instead.
     *
     * <p>State with no JS API should be set by manipulating the DOM directly in an allowable way, and then calling <code class="prettyprint">refresh()</code>
     * on the affected component(s).  E.g. the reading direction (LTR / RTL) is changed by by setting the <code class="prettyprint">"dir"</code> attribute on the
     * <code class="prettyprint">&lt;html></code> node and calling <code class="prettyprint">refresh()</code>.
     *
     * <p>When using a built-in Knockout binding, keep in mind that those bindings do not
     * execute the necessary <code class="prettyprint">refresh()</code> call after updating the DOM.  Updates that flow from the component to the observable,
     * as a result of user interaction, are not problematic.  But updates in the other direction, that programmatically update the DOM because the observable changed,
     * will not be picked up until the next <code class="prettyprint">refresh()</code>.
     *
     * @ojfragment stateCommon
     * @memberof oj.ojButton
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
     * <p>* Some types of Push and Menu Buttons support <kbd>Enter</kbd>, not <kbd>Space</kbd>.
     *
     * <p>See the [Menu]{@link oj.ojMenu} keyboard doc for keystrokes that apply when focus is on the menu.
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojButton
     * @instance
     */
    oj.__registerWidget('oj.ojButton', $.oj.baseComponent, {
      defaultElement: '<button>', // added to externs.js, since this is an override of a superclass member.  (That's the rule for public methods, what about protected fields?)  Would @override do the job and be better than externing?
      widgetEventPrefix: 'oj',
      // options is in externs.js, so no need for quotes
      options: {
        /**
         * {@ojinclude "name":"buttonCommonChroming"}
         *
         * @name chroming
         * @instance
         * @memberof oj.ojButton
         * @type {string}
         * @ojvalue {string} "solid" Solid buttons stand out, and direct the user's attention to the most important actions in the UI.
         * @ojvalue {string} "outlined" Outlined buttons are salient, but lighter weight than solid buttons. Outlined buttons are useful for secondary actions.
         * @ojvalue {string} "borderless" Borderless buttons are the least prominent variation. Borderless buttons are useful for supplemental actions that require minimal emphasis.
         * @ojvalue {string} "callToAction" A Call To Action (CTA) button guides the user to take or complete the action that is the main goal of the page or page section. There should only be one CTA button on a page at any given time.
         * @ojvalue {string} "danger" A Danger button alerts the user to a dangerous situation.
         * @ojvalue {string} "full" Please use solid instead. In typical themes, full-chrome buttons always have chrome.
         * @ojvalue {string} "half" In typical themes, half-chrome buttons acquire chrome only in their hover, active, and selected states.
         * @ojshortdesc Indicates in what states the button has chrome (background and border).
         * @ojdeprecated [{target:'propertyValue', for:"half", since: "6.0.0", description: "This value will be removed in the future. Please use borderless instead."},
         *                {target:'propertyValue', for:"full", since: "6.0.0", description: "This value will be removed in the future. Please use solid instead."}]
         * @example <caption>Initialize the Button with the <code class="prettyprint">chroming</code> attribute specified:</caption>
         * &lt;oj-button chroming='borderless'>&lt;/oj-button>
         *
         * @example <caption>Get or set the <code class="prettyprint">chroming</code> property after initialization:</caption>
         * // getter
         * var chromingValue = myButton.chroming;
         *
         * // setter
         * myButton.chroming = 'borderless';
         *
         * @example <caption>Set the default in the theme (CSS) :</caption>
         * --oj-private-buttonset-global-chroming-default: borderless !default;
         */

        /**
         * {@ojinclude "name":"buttonCommonChroming"}
         *
         * @name chroming
         * @instance
         * @memberof oj.ojMenuButton
         * @type {string}
         * @ojvalue {string} "solid" Solid buttons stand out, and direct the user's attention to the most important actions in the UI.
         * @ojvalue {string} "outlined" Outlined buttons are salient, but lighter weight than solid buttons. Outlined buttons are useful for secondary actions.
         * @ojvalue {string} "borderless" Borderless buttons are the least prominent variation. Borderless buttons are useful for supplemental actions that require minimal emphasis.
         * @ojvalue {string} "full" Please use solid instead. In typical themes, full-chrome buttons always have chrome.
         * @ojvalue {string} "half" In typical themes, half-chrome buttons acquire chrome only in their hover, active, and selected states.
         * @ojshortdesc Indicates in what states the button has chrome (background and border).
         * @ojdeprecated [{target:'propertyValue', for:"half", since: "6.0.0", description: "This value will be removed in the future. Please use borderless instead."},
         *                {target:'propertyValue', for:"full", since: "6.0.0", description: "This value will be removed in the future. Please use solid instead."}]
         *
         * @example <caption>Initialize the Button with the <code class="prettyprint">chroming</code> attribute specified:</caption>
         * &lt;oj-button chroming='borderless'>&lt;/oj-button>
         *
         * @example <caption>Get or set the <code class="prettyprint">chroming</code> property after initialization:</caption>
         * // getter
         * var chromingValue = myButton.chroming;
         *
         * // setter
         * myButton.chroming = 'borderless';
         *
         * @example <caption>Set the default in the theme (CSS) :</caption>
         * --oj-private-button-global-chroming-default: borderless;
         */

        /**
         * <p>Indicates in what states the button has chrome (background and border).
         *
         * <p>The default chroming varies by theme and containership as follows:
         * <ul>
         *   <li>If the button is in a buttonset or toolbar, then the default chroming is the current <code class="prettyprint">chroming</code> value of the nearest such container.</li>
         *   <li>Else, the default chroming value is controlled by the theme.
         * </ul>
         *
         * <p>Once a value has been set on this button attribute, that value applies regardless of theme and containership.
         *
         * @expose
         * @memberof oj.ojButton
         * @instance
         * @since 1.2.0
         * @ojfragment buttonCommonChroming
         */
        chroming: 'solid',

        /**
         * {@ojinclude "name":"buttonCommonDisabled"}
         *
         * @name disabled
         * @memberof oj.ojButton
         * @instance
         * @type {boolean}
         * @default false
         * @ojshortdesc Specifies that the button element should be disabled.
         *
         * @example <caption>Initialize the Button with the <code class="prettyprint">disabled</code> attribute specified:</caption>
         * &lt;oj-button disabled='true'>&lt;/oj-button>
         *
         * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
         * // getter
         * var disabledValue = myButton.disabled;
         *
         * // setter
         * myButton.disabled = true;
         */

        /**
         * {@ojinclude "name":"buttonCommonDisabled"}
         *
         * @name disabled
         * @memberof oj.ojMenuButton
         * @instance
         * @type {boolean}
         * @default false
         * @ojshortdesc Specifies that the button element should be disabled.
         *
         * @example <caption>Initialize the Menu Button with the <code class="prettyprint">disabled</code> attribute specified:</caption>
         * &lt;oj-menu-button disabled='true'>&lt;/oj-menu-button>
         *
         * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
         * // getter
         * var disabledValue = myMenuButton.disabled;
         *
         * // setter
         * myMenuButton.disabled = true;
         */

        /**
         * <p>Disables the button if set to <code class="prettyprint">true</code>.
         *
         * <p>After create time, the <code class="prettyprint">disabled</code> state should be set via this API, not by setting the underlying DOM attribute.
         *
         * @expose
         * @memberof oj.ojButton
         * @instance
         * @ojfragment buttonCommonDisabled
         */
        disabled: false,

        /**
         * {@ojinclude "name":"buttonCommonDisplay"}
         *
         * <p>For accessibility, a JET Button must always have a label set via the default slot, even if it is icon-only.
         *
         * @name display
         * @memberof oj.ojButton
         * @instance
         * @type {string}
         * @ojvalue {string} "all" Display both the label and icons.
         * @ojvalue {string} "icons" Display only the icons.
         * @ojvalue {string} "label" Display only the label.
         * @default "all"
         * @ojshortdesc Specifies whether the button displays label and icons, or just icons.
         *
         * @example <caption>Initialize the Button with the <code class="prettyprint">display</code> attribute specified:</caption>
         * &lt;oj-button display='icons'>&lt;/oj-button>
         *
         * @example <caption>Get or set the <code class="prettyprint">display</code> property after initialization:</caption>
         * // getter
         * var displayValue = myButton.display;
         *
         * // setter
         * myButton.display = 'icons';
         */

        /**
         * {@ojinclude "name":"buttonCommonDisplay"}
         *
         * <p>For accessibility, a JET Menu Button must always have a label set via the default slot, even if it is icon-only.
         *
         * @name display
         * @instance
         * @memberof oj.ojMenuButton
         * @type {string}
         * @ojvalue {string} "all" Display both the label and icons.
         * @ojvalue {string} "icons" Display only the icons.
         * @ojvalue {string} "label" Display only the label.
         * @default "all"
         * @ojshortdesc Specifies whether the button displays label and icons, or just icons.
         *
         * @example <caption>Initialize the Menu Button with the <code class="prettyprint">display</code> attribute specified:</caption>
         * &lt;oj-menu-button display='icons'>&lt;/oj-menu-button>
         *
         * @example <caption>Get or set the <code class="prettyprint">display</code> property after initialization:</caption>
         * // getter
         * var displayValue = myMenuButton.display;
         *
         * // setter
         * myMenuButton.display = 'icons';
         */

        /**
         * <p>Whether to display both the label and icons (<code class="prettyprint">"all"</code>)
         * or just the label (<code class="prettyprint">"label"</code>)
         * or just the icons (<code class="prettyprint">"icons"</code>).  In the latter case, the label is displayed in a tooltip instead, unless a
         * tooltip was already supplied at create time.
         *
         * @expose
         * @memberof oj.ojButton
         * @instance
         * @ojfragment buttonCommonDisplay
         */
        display: 'all',

        /**
         * <p>Text to show in the button.  The label attribute takes precedence over the default DOM slot.
         *
         * <p>Values set on this option, at create time or later, are treated as plain text, not HTML.  If the label is specified via
         * DOM at create time, that HTML content is kept.
         *
         * <p>For accessibility, a JET Button must always have a label, even if it is <a href="#display">icon-only</a>.
         *
         * @expose
         * @memberof oj.ojButton
         * @instance
         * @type {?string}
         * @ojtranslatable
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
         * @ignore
         * @expose
         * @memberof oj.ojButton
         * @instance
         * @type {Object}
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
        icons: {
          /**
           * <p>The start icon of the button.  See the top-level <code class="prettyprint">icons</code> option for details.
           *
           * @ignore
           * @expose
           * @alias icons.start
           * @memberof! oj.ojButton
           * @instance
           * @type {?string}
           * @default null
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
           * @ignore
           * @expose
           * @alias icons.end
           * @memberof! oj.ojButton
           * @instance
           * @type {?string}
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
         * <p>See [Menu's]{@link oj.ojMenu} Accessibility section for a discussion of how <code class="prettyprint">aria-label</code> ,
         * <code class="prettyprint">aria-labelledby</code> and <code class="prettyprint">aria-descibedby</code> are handled for menu buttons and other menu launchers.
         *
         * @expose
         * @memberof oj.ojButton
         * @instance
         * @type {Element|Array.<Element>|string|jQuery|NodeList}
         * @default null
         * @ignore
         * @ojtsignore
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
        menu: null,

        // Events
        /**
         * <p>Triggered when a button is clicked. This will be triggered by keyboard events as well as mouse/touch events.
         *
         * <p>To ensure keyboard accessibility, the only correct, supported way to react to the click of a button is to listen
         * for this event. Click listeners should not be used.
         *
         * @expose
         * @event
         * @memberof oj.ojButton
         * @ojshortdesc Triggered when a button is clicked, whether by keyboard, mouse, or touch events.  To meet accessibility requirements, the only supported way to react to the click of a button is to listen for this event.
         * @instance
         * @ojcancelable
         * @ojbubbles
         * @ojeventgroup common
         * @since 5.0.0
         */
        action: null
      },

      _InitOptions: function (originalDefaults, constructorOptions) {
        this._super(originalDefaults, constructorOptions);

        // if custom element we are supporting slots
        if (this._IsCustomElement()) {
          this._processSlots();
        }

        this._initButtonTypes(); // init this.type and this.buttonElement, used below

        // At create time, disabled and label can be set via either option or DOM.
        // If app set the option, then that wins over the DOM, in which case _ComponentCreate() will later set that value on the DOM.
        // Else DOM wins, in which case we set the option from the DOM here, with any remaining tasks done later in _ComponentCreate().

        if (!this._IsCustomElement()) {
          if (!('disabled' in constructorOptions)) {
            // if app didn't set option, then set the option from the DOM
            // For anchors, this line always sets disabled option to false.  (Neither JQUI nor JET look for the .oj-disabled class for anchors,
            // so the only way to disable an anchor button at create time is via the API.  At refresh time, JQUI did look
            // for the .oj-disabled class, but our refresh doesn't handle disabled.)
            this.option('disabled', !!this.element[0].disabled, { _context: { internalSet: true } }); // writeback not needed since "not in constructorOptions" means "not bound"
          }
        }

        if (!('label' in constructorOptions)) {
          // if app didn't set option, then set the option from the DOM
          this.keepDomLabel = true;
          this.option(
            'label',
            this.type === 'inputPush' ? this.buttonElement.val() : this.buttonElement[0].innerHTML, // @HTMLUpdateOK getter not setter
            { _context: { internalSet: true } }
          ); // writeback not needed since "not in constructorOptions" means "not bound"
        }

        if (!this._IsCustomElement()) {
          // if this is a menuButton and app didn't set icons.end to its own icon or to null to suppress the icon, then default to built-in menuButton dropdown icon
          if (
            this.options.menu &&
            (!constructorOptions.icons || constructorOptions.icons.end === undefined)
          ) {
            this.option('icons.end', 'oj-component-icon oj-button-menu-dropdown-icon', {
              _context: { writeback: true, internalSet: true }
            });
          }
        }
      },

      _ComponentCreate: function () {
        this._super();

        // facilitate removing menuButton handlers separately, if app sets/clears the "menu" option
        this.menuEventNamespace = this.eventNamespace + 'menu';

        this._initButtonTypes2();
        this.hasTitle = !!this.rootElement.getAttribute('title');

        var self = this;
        var toggleButton = this._isToggle;

        _addClasses(this.rootElement, BASE_CLASSES);
        _setChromingClass(this.rootElement, this.options.chroming);

        // Called for touchend/cancel on both button and document.  Listening only on button isn't completely reliable
        // on at least iOS and Android since the touchend can happen slightly off of the button.  Listening only on the
        // document runs the risk that we won't hear it because someone eats it.  Could use capture listener to dodge
        // that risk, but just listening on both seems to work great.
        var endHandler = function () {
          self.rootElement.classList.remove('oj-active');
          self.rootElement.classList.remove('oj-hover');
          self._toggleDefaultClasses();
        };

        this._touchStartHandler = function () {
          if (self._IsEffectivelyDisabled()) {
            return;
          }

          self.rootElement.classList.add('oj-active');
          self._toggleDefaultClasses();

          // don't pass "touchend touchcancel", due to semantics of one() : it's called once per event type.
          // It's almost always touchend, not touchcancel, that is fired, so the touchend listeners would pile up.
          // The likelihood is very small that the double edge case would occur where both endHandler is needed,
          // AND the touch ends with touchcancel rather than touchend, and the result would only be that the hover
          // style sticks to the button.
          self.document.one('touchend', endHandler);
        };

        if (DomUtils.isTouchSupported()) {
          this.buttonElement[0].addEventListener('touchstart', this._touchStartHandler, {
            passive: true
          });
          this.buttonElement.bind(
            'touchend' + this.eventNamespace + ' touchcancel' + this.eventNamespace,
            endHandler
          );
        }

        this.buttonElement
          .bind('mouseenter' + this.eventNamespace, function () {
            if (self._IsEffectivelyDisabled()) {
              return;
            }
            if (!self._isSelectedInButtonsetOne()) {
              self.rootElement.classList.add('oj-hover');
              // do this for real mouse enters, but not 300ms after a tap
              if (!DomUtils.recentTouchEnd()) {
                if (this === _lastActive) {
                  self.rootElement.classList.add('oj-active');
                }
              }
              self.rootElement.classList.remove('oj-default');
              self.rootElement.classList.remove('oj-focus-only');
            }
          })
          .bind('mouseleave' + this.eventNamespace, function () {
            self.rootElement.classList.remove('oj-hover');

            if (self._IsEffectivelyDisabled()) {
              return;
            }
            self.rootElement.classList.remove('oj-active');
            self._toggleDefaultClasses();
          });

        this._disabledClickHandler = function (event) {
          if (self._IsEffectivelyDisabled()) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
        };

        this._ojActionClickHandler = function (event) {
          self._trigger('action', event, {});
        };

        // Must do this in capture phase to avoid race condition where app's click
        // handlers on anchor buttons can be called if their listeners get registered
        // before ours, e.g. if their KO click binding is before the ojComponent binding.
        if (this._IsCustomElement()) {
          this.rootElement.addEventListener('click', this._disabledClickHandler, true);
          this.rootElement.addEventListener('click', this._ojActionClickHandler, false);
        } else {
          this.buttonElement[0].addEventListener('click', this._disabledClickHandler, true);
        }

        this._focusable({
          element: $(this.rootElement),
          applyHighlight: true,
          afterToggle: function () {
            self._toggleDefaultClasses();
          }
        });

        if (toggleButton) {
          this.element.bind('change' + this.eventNamespace, function (event) {
            self._applyCheckedStateFromDom(true); // we just get one change event for entire radio group, even though up to 2 changed, so must refresh entire radio group, not just this button

            // if in a buttonset that tracks checked state (i.e. checkbox set or single
            // radio group), then set that option and fire optionChange event
            var buttonset = self._getEnclosingContainerComponent('buttonset');
            var checkedState = buttonset && buttonset._getCheckedFromDom(buttonset.$buttons);
            if (buttonset && checkedState !== undefined) {
              buttonset.option('checked', checkedState, {
                _context: { writeback: true, originalEvent: event, internalSet: true }
              });
            }
          });

          // Required for FF, where click-drag on checkbox/radio btn's label(JET decorates label as button for toggle buttons )
          // will not yield in to click event and also trasfers focus out of the <input> element and hence breaks arrow navigation.
          // To fix, If mouse moves between mouseDown/mouseUp (drag) with in the boundaries of button then focus should be set
          // on the button which will ensure proper arrow key navigation(see  for more details).
          this.buttonElement
            .bind('mousedown' + this.eventNamespace, function () {
              if (self._IsEffectivelyDisabled()) {
                return;
              }
              _lastToggleActive = this;
              if (!self._isSelectedInButtonsetOne()) {
                self.rootElement.classList.add('oj-active');
              }
              self.document.one('mouseup', function () {
                _lastToggleActive = null;
                self.rootElement.classList.remove('oj-active');
              });
            })
            .bind('mouseup' + this.eventNamespace, function () {
              if (self._IsEffectivelyDisabled()) {
                return;
              }
              self.rootElement.classList.remove('oj-active');
              if (this === _lastToggleActive) {
                self.element.focus();
              }
            });
        }

        if (this.type === 'checkbox') {
          this.buttonElement.bind('click' + this.eventNamespace, function () {
            if (self._IsEffectivelyDisabled()) {
              return false;
            }
            return undefined;
          });

          // role="button" requires both Space and Enter support, but radios and checkboxes natively support only Space, so add Enter.
          // Update: now that we're not using role=button for checkboxes, we don't strictly need this.
          // This fire-click-on-Enter logic gives Enter the same behavior as Space for checkboxes in Chrome, FF, and IE9:
          // In Chrome28 and IE9, for Space and Enter on Checkboxes, first the "checked" value updates, then change event, then click event.
          // In FF22, for Space and Enter on Checkboxes, first the "checked" value updates, then click event, then change event.
          // Unlike the radio Enter handler, we get this good behavior by only firing "click".
          this.element.bind('keyup' + this.eventNamespace, function (event) {
            if (event.keyCode === $.ui.keyCode.ENTER) {
              if (!self._IsEffectivelyDisabled()) {
                // console.log("checkbox Enter handler firing click event");
                self.element.click();
              }
            }
          });
        } else if (this.type === 'radio') {
          this.buttonElement.bind('click' + this.eventNamespace, function () {
            if (self._IsEffectivelyDisabled()) {
              return false;
            }
            return undefined;
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
          this.element.bind('keyup' + this.eventNamespace, function (event) {
            if (event.keyCode === $.ui.keyCode.ENTER) {
              if (!self.element[0].checked && !self._IsEffectivelyDisabled()) {
                // console.log("radio Enter handler found radio unchecked, so checking it and firing click event");

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
        } else {
          // neither checkbox nor radio, so not a toggle button, so element, buttonElement (and rootElement in JQUI) are all the same node
          this.buttonElement
            .bind('mousedown' + this.eventNamespace, function (event) {
              if (self._IsEffectivelyDisabled()) {
                return false;
              }

              // don't show active/pressed-down state unless left mouse button, since only that button will click the button after mouseup
              // do this for real mousedowns, but not 300ms after a tap
              if (event.which === 1 && !DomUtils.recentTouchEnd()) {
                if (!self._isSelectedInButtonsetOne()) {
                  self.rootElement.classList.add('oj-active');
                }
                self.rootElement.classList.remove('oj-default');
                self.rootElement.classList.remove('oj-focus-only');
                _lastActive = this;
                self.document.one('mouseup', function () {
                  // TODO: prob need capture listener like Menu for reliability
                  _lastActive = null;
                });
              }

              return undefined;
            })
            .bind('mouseup' + this.eventNamespace, function () {
              if (self._IsEffectivelyDisabled()) {
                return false;
              }
              self.rootElement.classList.remove('oj-active');
              self._toggleDefaultClasses();
              return undefined;
            })
            .bind('keydown' + this.eventNamespace, function (event) {
              if (self._IsEffectivelyDisabled()) {
                // ...then bail out always, also eating event unless key is Tab or left/right arrow, since:
                // - Must allow Tab so KB user can't get stuck here.
                // - Nice to allow Buttonset/Toolbar's left/right arrow handling too, but not strictly essential as long as user
                //   can Tab out and back in, since (if app refreshed Buttonset/Toolbar after disabling button as required), the
                //   tab-back-in will go to an enabled button of the Buttonset/Toolbar, or skip Buttonset/Toolbar if all buttons disabled.
                // - Must eat Enter/Space/DownArrow to prevent that functionality from occurring. (For non-anchor buttons, the native
                //   disabled status prevents some of those on at least some platforms.)
                // Since anchor buttons don't have a native disabled status, they remain focusable when disabled, and thus are most
                // susceptible to having key events while disabled. (We ensure they are not tabbable, but they remain focusable)
                return (
                  event.keyCode === $.ui.keyCode.TAB ||
                  event.keyCode === $.ui.keyCode.LEFT ||
                  event.keyCode === $.ui.keyCode.RIGHT
                );
              }

              var isSpace = event.keyCode === $.ui.keyCode.SPACE;
              var isAnchor = self.type === 'anchor';

              // now that anchor doesn't support Space, still keep this line, in case users try to click via Space
              if (isAnchor && isSpace) {
                event.preventDefault(); // prevent scrolling down one page when clicking anchor button via Spacebar.  Only prevent for anchor!
              }
              if ((isSpace && !isAnchor) || event.keyCode === $.ui.keyCode.ENTER) {
                if (!self._isSelectedInButtonsetOne()) {
                  self.rootElement.classList.add('oj-active');
                }
                self.rootElement.classList.remove('oj-default');
                self.rootElement.classList.remove('oj-focus-only');
              }
              return undefined;
            })
            // see #8559, we bind to blur here in case the button element loses
            // focus between keydown and keyup, it would be left in an "active" state
            .bind('keyup' + this.eventNamespace + ' blur' + this.eventNamespace, function () {
              self.rootElement.classList.remove('oj-active');
              self._toggleDefaultClasses();
            });

          if (this.type === 'anchor') {
            // Chrome is not updating document.activeElement on click of <a> which is needed for ojPopup and
            // setting tabIndex to a non-negative value will fix this. Refer 
            // isNaN(..) returns true when tabIndex is undefined (or 'undefined', which the original impl checked for...)
            var tabIndex = this.buttonElement[0].getAttribute('tabindex');
            if (tabIndex === null || isNaN(tabIndex)) {
              // Don't override if user already set a tabIndex.
              this.buttonElement[0].setAttribute('tabindex', '0');
            }
          }
        } // end of: if (checkbox) {} else if (radio) {} else {}

        // at create time, we want only the "if disabled" part of callee, not the "if enabled" part, so only call if disabled
        if (this.options.disabled) {
          this._manageAnchorTabIndex(false, true);
        }

        this._updateEffectivelyDisabled();

        var buttonset = self._getEnclosingContainerComponent('buttonset');
        if (this._IsCustomElement() || (buttonset && buttonset._IsCustomElement())) {
          this._setDisplayOptionOnDom();
        } else {
          this._handleLabelAndIconsAtCreateTime();
        }

        this._setupMenuButton(null);

        // call this at the *end* of _ComponentCreate, since it needs to know whether any state classes like oj-active, oj-disabled, oj-selected, oj-hover, .oj-focus
        // have been applied.
        this._toggleDefaultClasses();

        // _childMutationObserver would have been created in _setDisplayOptionOnDom if one is needed
        if (this._childMutationObserver) {
          // Start observing the button element for changes to children
          this._childMutationObserver.observe();
        }
      },

      _NotifyContextMenuGesture: function (menu, event, eventType) {
        // For toggle buttons, launcher must be the hidden focusable input, but for Shift-F10 we want the CM aligned to the root element, not that
        // launcher.  rootElement works for push buttons too.
        this._OpenContextMenu(event, eventType, {
          position: { of: eventType === 'keyboard' ? $(this.rootElement) : event }
        });
      },

      _addMutationObserver: function () {
        // No need to create it again if we already have one
        if (this._childMutationObserver || !this._IsCustomElement()) {
          return;
        }

        var self = this;
        this._childMutationObserver = new ChildMutationObserver(this.rootElement, function (
          mutations
        ) {
          mutations.forEach(function (mutation) {
            var doUpdate;

            if (mutation.type === 'childList') {
              var node = mutation.addedNodes && mutation.addedNodes[0];
              var target = mutation.target;
              if (
                node &&
                node.nodeType === 3 &&
                target &&
                target.nodeType === 1 &&
                target.classList.contains('oj-button-label')
              ) {
                // Handle the case where there is no span around the text binding in the source HTML.
                // In this case the ko comment nodes stay in the oj-button-label div, but the resulting
                // text node is moved down to the oj-button-text span. When the binding is updated, we need
                // to replace oj-button-text content with the new text node to avoid it being shown.
                self._childMutationObserver.disconnect();
                doUpdate = true;

                var buttonTextElem = self.buttonElement[0].querySelector('.oj-button-text');
                if (buttonTextElem) {
                  buttonTextElem.textContent = node.textContent;
                }
                node.parentNode.removeChild(node);
              }
            } else if (mutation.type === 'characterData') {
              // Handle the case where there is a span around the text binding in the source HTML.
              // In this case the comment nodes and resulting text node are both moved down to the
              // oj-button-text span. When the binding is updated, it will update the oj-button-text
              // content directly.
              self._childMutationObserver.disconnect();
              doUpdate = true;
            }

            if (doUpdate) {
              // _setDisplayOptionOnDom will update the oj-button title attribute to new text content
              // if necessary.
              self._setDisplayOptionOnDom();

              self._childMutationObserver.observe();
            }
          });
        });
      },

      _removeMutationObserver: function () {
        if (this._childMutationObserver) {
          this._childMutationObserver.disconnect();
          this._childMutationObserver = null;
        }
      },

      _processSlots: function () {
        var self = this;
        var elem = this.element[0];
        var rootElem = elem.parentNode;
        var isMenuButton = rootElem.tagName === 'OJ-MENU-BUTTON';

        // we are responsible for reparenting any slots because of use of inner elem
        var rootSlots = ojcustomelementUtils.CustomElementUtils.getSlotMap(rootElem);

        // don't add context menu here since we do not ever need to move it
        var supportedSlots;
        if (isMenuButton) {
          supportedSlots = ['startIcon', '', 'endIcon', 'menu'];
        } else {
          supportedSlots = ['startIcon', '', 'endIcon'];
        }

        // move all desired slots down one level
        $.each(supportedSlots, function (i, slotName) {
          if (rootSlots[slotName] && slotName !== '') {
            $.each(rootSlots[slotName], function (_i, node) {
              elem.appendChild(node);
            });
          }
        });

        // be sure to not remove the context menu slot
        var children = rootElem.children;
        for (var len = children.length, idx = len - 1; idx >= 0; idx--) {
          var child = children[idx];
          if (child !== elem && child.getAttribute('slot') !== 'contextMenu') {
            rootElem.removeChild(child);
          }
        }

        // all slots are now within the inner button element
        var slots = ojcustomelementUtils.CustomElementUtils.getSlotMap(elem);

        // rearrange slots
        $.each(supportedSlots, function (i, slotName) {
          if (slots[slotName]) {
            $.each(slots[slotName], function (_i, node) {
              elem.appendChild(node);
              if (slotName === '') {
                var currentText = node;
                var wrapperSpan = currentText;
                if (currentText.nodeType === 3) {
                  wrapperSpan = document.createElement('span');
                  currentText.parentNode.insertBefore(wrapperSpan, currentText); // @HTMLUpdateOK
                  wrapperSpan.appendChild(currentText);
                }
                wrapperSpan.classList.add('oj-button-text');
                self._setTextSpanIdAndLabelledBy(wrapperSpan);
              } else if (slotName === 'startIcon') {
                node.classList.add('oj-button-icon');
                node.classList.add('oj-start');
              } else if (slotName === 'endIcon') {
                node.classList.add('oj-button-icon');
                node.classList.add('oj-end');
              } else if (slotName === 'menu') {
                $(node).uniqueId();
                self.menuSlot = '#' + node.id;
                if (slots.endIcon === undefined) {
                  var dropDownElem = document.createElement('span');
                  var dropdownIconClass = 'oj-button-menu-dropdown-icon';
                  if (slots.startIcon === undefined && self.options.display === 'icons') {
                    dropdownIconClass = 'oj-button-menu-icon-only-dropdown-icon';
                  }
                  dropDownElem.className =
                    'oj-button-icon oj-end oj-component-icon ' + dropdownIconClass;
                  dropDownElem.setAttribute('slot', 'endIcon');
                  elem.insertBefore(dropDownElem, node); // @HTMLUpdateOK
                }
              }
            });
          }
        });

        // wrap button content in a label for consistent DOM/theming structure
        var wrapperDiv = document.createElement('div');
        wrapperDiv.className = 'oj-button-label';
        while (elem.hasChildNodes()) {
          wrapperDiv.appendChild(elem.firstChild); // @HTMLUpdateOK
        }
        elem.appendChild(wrapperDiv); // @HTMLUpdateOK
      },

      // Helper function to return the correct menu reference between custom element and non custom element components.
      _getMenuNode: function () {
        // Private, not an override (not in base class). Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        if (this._IsCustomElement()) {
          return this.menuSlot;
        }
        return this.options.menu;
      },

      // Part 1 of type-specific component init.  Called from _InitOptions, so very limited component state is available!
      _initButtonTypes: function () {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        // for toggle buttons (radio/checkbox), element is <input>, buttonElement is <label>,
        // and rootElement is a new wrapper element we create.  This is true in JQUI; in CustomElements not exposing toggle buttons.
        var elem = this.element[0];
        if (elem.tagName === 'INPUT' && elem.type === 'checkbox') {
          this.type = 'checkbox';
          this._isToggle = true;
        } else if (elem.tagName === 'INPUT' && elem.type === 'radio') {
          this.type = 'radio';
          this._isToggle = true;
        } else if (
          elem.tagName === 'INPUT' &&
          (elem.type === 'button' || elem.type === 'submit' || elem.type === 'reset')
        ) {
          // for push buttons (next 3 cases), element, buttonElement, and rootElement are all the same elem in JQUI.
          // In CustomElements, element and buttonElement are the same elem, and rootElement is the parent custom element.
          // We ignore <label> if present.
          this.type = 'inputPush';
        } else if (elem.tagName === 'BUTTON') {
          this.type = 'button';
        } else if (elem.tagName === 'A') {
          this.type = 'anchor';
        } else {
          throw new Error('JET Button not supported on this element type');
        }

        if (this._isToggle) {
          // TBD: rather than requiring the label to be supplied, should we just create one for them if it's not there?
          var labelSelector = "label[for='" + this.element[0].getAttribute('id') + "']";
          this.buttonElement = this.element.siblings().filter(labelSelector);
        } else {
          this.buttonElement = this.element;
        }
      },

      // Part 2 of type-specific component init, called from _ComponentCreate().
      _initButtonTypes2: function () {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        var elem = this.element[0];
        if (this._isToggle) {
          this.buttonElement[0].classList.add('oj-button-label');

          elem.classList.add('oj-button-input');
          elem.classList.add('oj-helper-hidden-accessible');
          elem.setAttribute('data-oj-internal', ''); // automation support
          var spanElem = document.createElement('span');
          this.element[0].parentNode.insertBefore(spanElem, this.buttonElement[0]); // @HTMLUpdateOK
          spanElem.appendChild(this.buttonElement[0]); // add root node around label/input.  @HTMLUpdateOK trusted string
          spanElem.appendChild(this.element[0]); // add root node around label/input.  @HTMLUpdateOK trusted string

          this.rootElement = this.element[0].parentNode; // the new root
          this.rootElement.classList.add('oj-button-toggle');

          var checked = elem.checked;
          if (checked) {
            this.rootElement.classList.add('oj-selected');
            this.rootElement.classList.remove('oj-default');
            this.rootElement.classList.remove('oj-focus-only');
          }
          // else no need to removeClass since this code runs only at create time
        } else if (this._IsCustomElement()) {
          this.rootElement = this.element[0].parentNode;
          elem.classList.add('oj-button-button');
        } else {
          this.rootElement = this.element[0];
          // oj-button-jqui was renamed to oj-button-toggle
          // we still need this styling for jqueryui ojButton. For example,
          // oj-input-number creates ojButtonset and ojButtons widgets internally.
          if (!this._IsCustomElement()) {
            elem.classList.add('oj-button-toggle');
          }
        }
      },

      /**
       * Returns a <code class="prettyprint">jQuery</code> object containing the root element of the Button component.
       * @ignore
       * @expose
       * @memberof oj.ojButton
       * @instance
       * @return {jQuery} the root element of the component
       *
       * @example <caption>Invoke the <code class="prettyprint">widget</code> method:</caption>
       * var widget = $( ".selector" ).ojButton( "widget" );
       */
      widget: function () {
        // Override of public base class method.  Method name needn't be quoted since is in externs.js.
        return $(this.rootElement);
      },

      _destroy: function () {
        // Override of protected base class method.  Method name needn't be quoted since is in externs.js.
        this._removeMenuBehavior(this._getMenuNode());
        this.buttonElement[0].removeEventListener('click', this._disabledClickHandler, true);
        this.buttonElement[0].removeEventListener('click', this._ojActionClickHandler, false);

        this.buttonElement[0].removeEventListener('touchstart', this._touchStartHandler, {
          passive: true
        });
        delete this._touchStartHandler;

        // TBD: won't need this after the restore-attrs feature is in place.
        var elem = this.element[0];
        elem.classList.remove('oj-helper-hidden-accessible');
        elem.removeAttribute('aria-labelledby');
        elem.removeAttribute('aria-describedby');
        this.element.removeUniqueId();

        // If disabled, we want to run the "changing from disabled to enabled" part of callee, to restore original tabindex.
        // If enabled, don't want to run any part of callee.
        if (this.options.disabled) {
          this._manageAnchorTabIndex(true, false);
        }

        var isToggle = this._isToggle;

        // TBD: won't need this after the restore-attrs feature is in place.
        if (!isToggle) {
          _removeClasses(
            this.rootElement,
            BASE_CLASSES +
              ' oj-button-toggle ' +
              STATE_CLASSES +
              ' ' +
              TYPE_CLASSES +
              ' ' +
              CHROMING_CLASSES
          );
        }

        var buttonText = this.buttonElement[0].querySelector('.oj-button-text');
        if (buttonText) {
          this.buttonElement[0].innerHTML = buttonText.innerHTML; // @HTMLUpdateOK reparent existing DOM
        }

        if (!isToggle) {
          // TBD: won't need this after the restore-attrs feature is in place.
          if (!this.hasTitle) {
            this.rootElement.removeAttribute('title');
          }
        } else {
          this.buttonElement[0].classList.remove('oj-button-label'); // TBD: won't need this after the restore-attrs feature is in place.

          // : If the button is stamped out by a KO foreach (with or without a containing buttonset), and the foreach
          // observable is updated to no longer include the button, then _destroy() is called.  Due to the ordering of tasks, if
          // JQ's unwrap() is called directly, the nodes winds up back into the DOM.  To avoid this, we previously successfully
          // put the JQ unwrap() call in a setTimeout(0), and now we do the following:
          //
          //  - DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
          DomUtils.unwrap(this.element);
        }

        if (_lastToggleActive === this.buttonElement[0]) {
          _lastToggleActive = null; // clear _lastToggleActive flag, while destroying the button.
        }

        //  - blur event needs to be explicitly removed
        this.buttonElement.off('blur');

        this._removeMutationObserver();
      },

      _NotifyDetached: function () {
        // In browsers [Chrome v35, Firefox v24.5, IE9, Safari v6.1.4], blur and mouseleave events are generated for hidden content but not detached content,
        // so when the component is detached from the document, we must use this hook to remove the oj-focus, oj-focus-highlight, oj-hover, and oj-active classes, to
        // ensure that button is displayed without those classes when it is re-attached to the DOM. Refer .
        // _super() now removes those 3 classes, so just need to call _tDC() afterwards.
        this._super();
        this._toggleDefaultClasses();
      },

      __setAncestorComponentDisabled: function (disabled) {
        this._super(disabled); // sets this._ancestorDisabled
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
      _updateEffectivelyDisabled: function () {
        var elem = this.element[0];
        var effectivelyDisabled = this._IsEffectivelyDisabled();

        // Unlike JQUI, root element should have exactly one of .oj-enabled and .oj-disabled at any point in time, for all flavors of Button.
        // _setOption._super() sets .oj-disabled to potentially wrong value since it doesn't know about "effectively disabled".  This fixes it up.
        if (effectivelyDisabled) {
          this.rootElement.classList.add('oj-disabled');
          this.rootElement.classList.remove('oj-enabled'); // _setOption._super() doesn't try to set this
        } else {
          this.rootElement.classList.remove('oj-disabled');
          this.rootElement.classList.add('oj-enabled'); // _setOption._super() doesn't try to set this
        }

        if (this.type !== 'anchor') {
          // i.e. <button> or <input> (including type=radio|checkbox|other)
          // <button> and <input> (including type=radio|checkbox|other) have this property, but <a> doesn't
          elem.disabled = effectivelyDisabled; // JQUI's _setOption sets this for <a>'s too, which seems harmless but is incorrect.

          // _setOption._super() puts aria-disabled on the rootElement.  Per A11y team, don't put aria-disabled on element already having disabled
          // attr.  (And if we DID apply aria-disabled, for radios/checkboxes it should go on the element / input, not the buttonElement / label or rootElement,
          // so the _setOption._super() behavior used by JQUI button is doubly wrong.)  Further, _setOption._super() can set it wrong since it doesn't know
          // about "effectively disabled".  This fixes it up.
          this.rootElement.removeAttribute('aria-disabled');
        } else {
          // else is <a>
          // _setOption._super() puts aria-disabled on the rootElement. For <a>'s, element and rootElement are both the <a> in JQUI,
          // but are different in CustomElements.  aria-disabled belongs on element.  Also, the value it sets is potentially wrong since it
          // doesn't know about "effectively disabled".
          elem.setAttribute('aria-disabled', effectivelyDisabled); // set element attr to correct value in both JQUI and Custom Elements.
          if (this._IsCustomElement()) this.rootElement.removeAttribute('aria-disabled');
        }

        if (effectivelyDisabled) {
          // TBD: when the handling of oj-active in baseComponent._setOption("disabled") is finalized, review whether this should be handled there instead.
          // baseComponent._setOption("disabled") removes oj-active, oj-hover, oj-focus, and oj-focus-highlight, but _updateEffectivelyDisabled is called in a number of other
          // cases too, so do it here too to be safe.
          var classList = this.widget()[0].classList;
          classList.remove('oj-active');
          classList.remove('oj-default');
          classList.remove('oj-focus-only');
          classList.remove('oj-hover');
          classList.remove('oj-focus');
          classList.remove('oj-focus-highlight');
          _lastActive = null; // avoid (very slight) possibility that first mouseIn after button is subsequently re-enabled will set oj-active

          // when disabling a menu button, dismiss the menu if open
          this._dismissMenu(this._getMenuNode());
        } else {
          this._toggleDefaultClasses();
        }
      },

      _setOption: function (key, value, flags) {
        // Override of protected base class method.  Method name needn't be quoted since is in externs.js.
        var oldValue = this.options[key];
        this._super(key, value, flags);
        // TBD: Currently the below code relies on super already having been called.  Consider removing that dependency
        // and calling super at end instead, so that optionChange (fired at end of super) is fired at very end.

        switch (key) {
          case 'chroming':
            _setChromingClass(this.rootElement, value);
            break;
          case 'disabled':
            // call this from _setOption, not _updateEffectivelyDisabled, as discussed in callee
            this._manageAnchorTabIndex(oldValue, value);

            // must call this *after* _super(), as discussed in callee
            this._updateEffectivelyDisabled();

            // Legacy code for widgets.  Toolbar custom element will listen for property change event on buttons.
            if (!this._IsCustomElement()) {
              // If this button is inside a toolbar, the toolbar needs to be refreshed for new disabled setting
              var $toolbarElem = this._getEnclosingContainerElement('toolbar');
              if ($toolbarElem.length) {
                $toolbarElem.ojToolbar('refresh');
              }
            }
            break;
          case 'label':
            this._setLabelOption();
            break;
          case 'display':
            if (this.type !== 'inputPush') {
              // <input type=button|submit|reset> doesn't support child nodes, thus no icons, icon-only buttons, etc.
              this._setDisplayOptionOnDom();
            }
            break;
          case 'icons':
            this._setIconsOption(true);
            break;
          case 'menu': // setting/clearing the menu sets whether this is a menuButton
            this._setupMenuButton(oldValue);
            break;
          default:
            break;
        }
      },

      // @inheritdoc
      refresh: function () {
        // Override of public base class method (unlike JQUI).  Method name needn't be quoted since is in externs.js.
        this._super();

        // TODO:
        // - JSDoc says to call refresh() when Button reparented.  Instead, app should call oj.Components.subtreeAttached(), and our
        //   _NotifyAttached override should do the handling.
        // - There are other things we should do in the "no longer in buttonset" case, like removing buttonset listeners.  Anything else too?
        // - The reason the jsdoc doesn't mention the "moved into Buttonset (possibly from another buttonset)" case is that in that case
        //   Bset.refresh() must be called.  However, not sure that it's doing all the necessary things for the "from another Bset" case.

        // Handle the rare case where we just got reparented out of a disabled Buttonset
        if (this._ancestorDisabled && !this._getEnclosingContainerElement('buttonset').length) {
          this.__setAncestorComponentDisabled(false);
        }

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
      _applyCheckedStateFromDom: function (wholeGroup) {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        if (this.type === 'radio') {
          (wholeGroup ? _radioGroup(this.element[0]) : this.element).each(function () {
            var $radioWidget = $(this).data('oj-ojButton'); // definitely exists because _radioGroup() checks for :oj-button

            if (this.checked) {
              $radioWidget.rootElement.classList.add('oj-selected');
              $radioWidget.rootElement.classList.remove('oj-default');
              $radioWidget.rootElement.classList.remove('oj-focus-only');
            } else {
              $radioWidget.rootElement.classList.remove('oj-selected');
              $radioWidget._toggleDefaultClasses();
            }
          });
        } else if (this.type === 'checkbox') {
          if (this.element[0].checked) {
            this.rootElement.classList.add('oj-selected');
            this.rootElement.classList.remove('oj-default');
            this.rootElement.classList.remove('oj-focus-only');
          } else {
            this.rootElement.classList.remove('oj-selected');
            this._toggleDefaultClasses();
          }
        }
      },

      /*
       * Method name sums it up.  Should only be called at create time.
       */
      _handleLabelAndIconsAtCreateTime: function () {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        if (this.type === 'inputPush') {
          // <input type=button|submit|reset> doesn't support child nodes, thus no icons, etc.
          this._setLabelOnDomOfSpanlessButton();
        } else {
          // <button>, <a>, checkboxes, and radios
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
      _setLabelOnDomAtCreateTime: function () {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        var buttonElement = this.buttonElement[0];
        var textSpan = document.createElement('span');
        textSpan.className = 'oj-button-text';

        if (this.keepDomLabel) {
          while (buttonElement.hasChildNodes()) {
            textSpan.appendChild(buttonElement.firstChild); // @HTMLUpdateOK reparent existing DOM
          }
        } else {
          buttonElement.innerHTML = ''; // @HTMLUpdateOK
          textSpan.textContent = this.options.label;
        }

        // Due to FF bug (see Bugzilla's ), <button> with flex/inline-flex display doesn't work. Workaround by wrapping <button> contents with a <div> and setting the latter display flex/inline-flex
        if (this.type === 'button') {
          var contentContainer = document.createElement('div');
          contentContainer.className = 'oj-button-label';
          contentContainer.appendChild(textSpan); // @HTMLUpdateOK append span containing trusted content and existing DOM, per above comments on lines referencing textSpan.
          this.element[0].appendChild(contentContainer); // @HTMLUpdateOK attach detached wrapped DOM created from trusted string and existing DOM
        } else {
          buttonElement.appendChild(textSpan); // @HTMLUpdateOK attach detached DOM created from trusted string and existing DOM
        }

        // Need to set "aria-labelledby" attribute of (button/anchor) element to point to label span as fix for  (accessibility: icon-only button label is read twice by screen reader)
        // This is only a problem for <button> and <a> at the time of writing, so the fix is only applied to these two button types.
        if (
          (this.type === 'button' || this.type === 'anchor') &&
          !this.element[0].hasAttribute('aria-label') &&
          !this.element[0].hasAttribute('aria-labelledby')
        ) {
          this._setTextSpanIdAndLabelledBy(textSpan);
        }
        return $(textSpan);
      },

      _setTextSpanIdAndLabelledBy: function (textSpan) {
        $(textSpan).uniqueId(); // assign id so that this.element can have "aria-labelledby" attribute pointing to the textspan
        if (
          !this.element[0].hasAttribute('aria-label') &&
          !this.element[0].hasAttribute('aria-labelledby')
        ) {
          this.element[0].setAttribute('aria-labelledby', textSpan.getAttribute('id'));
        }
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
      _setLabelOption: function () {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        if (this.type === 'inputPush') {
          // <input type=button|submit|reset> doesn't support child nodes, thus no icons, etc.
          this._setLabelOnDomOfSpanlessButton();
        } else {
          var textSpan = this.buttonElement[0].querySelector('.oj-button-text');
          textSpan.textContent = this.options.label;
          this._setDisplayOptionOnDom($(textSpan));
        }
      },

      /*
       * This method should only be called when the button is a "spanless" button, i.e. <input type=button|submit|reset>. It is called when the label is set,
       * both at create time and when it is set later.
       */
      _setLabelOnDomOfSpanlessButton: function () {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        // TBD: The "if label" check is from JQUI.  Is there some reason that setting "" should be ignored?
        // Probably not too harmful since they should set "display" option to "icons" instead, or set " " if they really want to.
        if (this.options.label) {
          this.element.val(this.options.label); // escaping is automatic; e.g. if label is <span>foo</span>, then val() sets that literal string on the input's "value" attr.
        }
      },

      _setIconsOption: function () {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        if (this.type === 'inputPush') {
          // <input type=button|submit|reset> doesn't support child nodes, thus no icons, etc.
          return;
        }

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
      _setIconOnDom: function (isStart) {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        var contentContainer = this.buttonElement[0];
        if (this.type === 'button') {
          contentContainer = this.element.children('div.oj-button-label')[0];
        }

        var iconSpanSelector;
        var standardIconClasses;
        var appIconClass;
        var lastIvar;
        if (isStart) {
          iconSpanSelector = '.oj-button-icon.oj-start';
          standardIconClasses = 'oj-button-icon oj-start';
          appIconClass = this.options.icons.start;
          lastIvar = '_lastStartIcon';
        } else {
          iconSpanSelector = '.oj-button-icon.oj-end';
          standardIconClasses = 'oj-button-icon oj-end';
          appIconClass = this.options.icons.end;
          lastIvar = '_lastEndIcon';
        }

        var iconSpan = contentContainer.querySelectorAll(iconSpanSelector);
        var idx;
        var icon;

        if (appIconClass) {
          if (iconSpan.length) {
            // remove the app icon class we set last time
            var oldAppIconClass = this[lastIvar];
            for (idx = 0; idx < iconSpan.length; idx++) {
              icon = iconSpan[idx];
              _removeClasses(icon, oldAppIconClass);
              _addClasses(icon, appIconClass);
            }
          } else {
            var spanElem = document.createElement('span');
            spanElem.className = standardIconClasses + ' ' + appIconClass;
            if (isStart) {
              contentContainer.insertBefore(spanElem, contentContainer.firstChild); // @HTMLUpdateOK prepend trusted new DOM to button elem
            } else {
              contentContainer.appendChild(spanElem); // @HTMLUpdateOK append trusted new DOM to button elem
            }
          }
        } else {
          for (idx = 0; idx < iconSpan.length; idx++) {
            icon = iconSpan[idx];
            icon.parentNode.removeChild(icon);
          }
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
      _setDisplayOptionOnDom: function (textSpan, hasStartIcon, hasEndIcon) {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        // The case for menu buttons and top level buttons
        var buttonLabelElem = this.buttonElement.children('.oj-button-label');

        // The case for buttonset buttons
        if (!buttonLabelElem.length) {
          var buttonset = this._getEnclosingContainerComponent('buttonset');
          if (this._IsCustomElement() || (buttonset && buttonset._IsCustomElement())) {
            buttonLabelElem = this.buttonElement.children('oj-option');
          } else {
            buttonLabelElem = this.buttonElement;
          }
        }

        if (textSpan === undefined) {
          // eslint-disable-next-line no-param-reassign
          textSpan = buttonLabelElem.children('.oj-button-text');
        }
        if (hasStartIcon === undefined) {
          // eslint-disable-next-line no-param-reassign
          hasStartIcon =
            !!this.options.icons.start || buttonLabelElem.children("[slot='startIcon']").length;
        }
        if (hasEndIcon === undefined) {
          // eslint-disable-next-line no-param-reassign
          hasEndIcon =
            !!this.options.icons.end || buttonLabelElem.children("[slot='endIcon']").length;
        }

        var multipleIcons = hasStartIcon && hasEndIcon;
        var atLeastOneIcon = hasStartIcon || hasEndIcon;
        var displayIsIcons = this.options.display === 'icons';

        var displayIsLabel = this.options.display === 'label';
        if (displayIsLabel) {
          if (buttonLabelElem.children("[slot='startIcon']")) {
            buttonLabelElem.children("[slot='startIcon']")[0].classList.add('oj-helper-hidden');
          }
          if (buttonLabelElem.children("[slot='endIcon']")) {
            buttonLabelElem.children("[slot='endIcon']")[0].classList.add('oj-helper-hidden');
          }
        } else if (atLeastOneIcon && displayIsIcons) {
          if (textSpan[0]) {
            textSpan[0].classList.add('oj-helper-hidden-accessible');
          }

          if (!this.hasTitle) {
            var buttonText = textSpan[0] ? textSpan[0].textContent : '';
            this.rootElement.setAttribute('title', $.trim(buttonText)); // use buttonText, which is escaped, not options.label, which isn't!
          }

          this._addMutationObserver();
        } else {
          if (textSpan[0]) {
            textSpan[0].classList.remove('oj-helper-hidden-accessible');
          }

          if (!this.hasTitle) {
            this.rootElement.removeAttribute('title');
          }

          this._removeMutationObserver();
        }

        var buttonClass;
        // if display value is label and it contain some text,
        if (displayIsLabel) {
          buttonClass = 'oj-button-text-only';
        }
        if (atLeastOneIcon) {
          if (displayIsIcons) {
            if (multipleIcons) {
              buttonClass = 'oj-button-icons-only';
            } else {
              buttonClass = 'oj-button-icon-only';
            }
          } else if (multipleIcons) {
            buttonClass = 'oj-button-text-icons';
          } else if (hasStartIcon) {
            buttonClass = 'oj-button-text-icon-start';
          } else {
            buttonClass = 'oj-button-text-icon-end';
          }
        } else {
          buttonClass = 'oj-button-text-only';
        }

        _removeClasses(this.rootElement, TYPE_CLASSES);
        this.rootElement.classList.add(buttonClass);
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
      // over the tabindex, so Button needn't do anything special at that time.
      //
      // Likewise, for the routine case that a Button is inited before its Buttonset/Toolbar, those components will take
      // over the tabindex when they're inited, so it's harmless for Button to have already set a tabindex that those
      // components will overwrite, and to have already set an ivar that those components will ignore.
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
      _manageAnchorTabIndex: function (oldDisabled, disabled) {
        // bail if:
        // - truthiness of disabled option is same as before, e.g. changed from "a" to "b"
        // - not a standalone anchor button
        if (
          !oldDisabled === !disabled ||
          this.type !== 'anchor' ||
          this._getEnclosingContainerElement('buttonset').length ||
          this._getEnclosingContainerElement('toolbar').length
        ) {
          return;
        }

        var elem = this.element[0];
        if (disabled) {
          // enabled button becoming disabled, at create time or later. (Not destroy time, since that logic only passes disabled=false.)
          // If the existing tabindex is unset (attr() returns undefined) or invalid (not a (stringified) integer), set the
          // ivar to null, in which case when we later restore the old value, we just clear the attr.  Obviously correct
          // in unset case. For invalid case, we prefer not to set anything invalid on the dom, and per MDN
          // unset and invalid tabindexes are handled the same.
          var attr = elem.getAttribute('tabindex');
          this._oldAnchorTabIndex = this._isInteger(Number(attr)) ? attr : null;

          elem.setAttribute('tabindex', -1);
        } else if (this._oldAnchorTabIndex == null) {
          // disabled button becoming enabled after create time, incl. destroy time.  (Not create time, since that logic only passes disabled=true.)
          elem.removeAttribute('tabindex');
        } else {
          elem.setAttribute('tabindex', this._oldAnchorTabIndex);
          // no need to clear ivar
        }
      },

      // IE11 and several modern platforms don't support Number.isInteger(), so use MDN's polyfill:
      _isInteger: function (value) {
        return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
      },

      _selectorMap: {
        buttonset: '.oj-buttonset',
        toolbar: '.oj-toolbar',
        buttonsetone: 'oj-buttonset-one'
      },

      _constructorMap: {
        buttonset: 'ojButtonset',
        toolbar: 'ojToolbar'
      },

      // Utility routine to see if component inside a buttonset-one and currently selected
      _isSelectedInButtonsetOne: function () {
        var inButtosetOne = this._getEnclosingContainerElement('buttonsetone').length === 1;
        return inButtosetOne && this.rootElement.classList.contains('oj-selected');
      },

      // component param is "buttonset" or "toolbar" or "buttonsetone"
      // Returns non-null JQ object that's length 1 iff this button is contained in a container of the specified type
      _getEnclosingContainerElement: function (component) {
        return $(this.rootElement).closest(this._selectorMap[component]);
      },

      // component param is "buttonset" or "toolbar"
      // Returns buttonset/toolbar component, or null if none.
      _getEnclosingContainerComponent: function (component) {
        var elem = this._getEnclosingContainerElement(component)[0];
        var constructor = Components.__GetWidgetConstructor(elem, this._constructorMap[component]);
        return constructor && constructor('instance');
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
      _setupMenuButton: function (oldMenuOption) {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        if (this._getMenuNode() && this.element[0].tagName === 'INPUT') {
          // both push and toggle buttons based on <input>
          throw new Error('Menu Button functionality is not supported on input elements.');
        }

        this._removeMenuBehavior(oldMenuOption);

        if (this._getMenuNode()) {
          var self = this;
          this.element
            .attr('aria-haspopup', true)
            .attr('role', 'button')
            .on('keydown' + this.menuEventNamespace, function (event) {
              if (
                event.which === $.ui.keyCode.DOWN ||
                event.which === $.ui.keyCode.ENTER ||
                event.which === $.ui.keyCode.SPACE
              ) {
                self._toggleMenu(event, 'firstItem');
                event.preventDefault();
                return true;
              } else if (event.which === $.ui.keyCode.ESCAPE) {
                var bubbleEscUp = !self.rootElement.classList.contains('oj-selected');
                self._dismissMenu(self._getMenuNode(), event);
                return bubbleEscUp;
              }

              return true;
            })
            .on('click' + this.menuEventNamespace, function (event) {
              // console.log("mb click handler");
              var menu = self._getMenu();
              if (!menu.__spaceEnterDownInMenu) {
                // console.log("mb click handler showing menu");
                // Ideally a click (Enter/Space) would toggle (open/close) the menu without moving focus to it, per WAI-ARIA.
                // But on IE, JAWS is not recognizing the menu on click/Enter/Space.
                // Workaround for this, cleared with A11y team, is to move focus to menu like DownArrow. Ref .
                self._toggleMenu(event, 'menu');
              }
              menu.__spaceEnterDownInMenu = false;
              event.preventDefault();
              return true;
            });
        }
      },

      /*
       * This method removes menuButton functionality from the button and specified menu
       *
       * param menuOption - a current or previous value of the "menu" option
       */
      _removeMenuBehavior: function (menuOption) {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        this.element.removeAttr('aria-haspopup').removeAttr('role').off(this.menuEventNamespace);

        this._dismissMenu(menuOption);

        // access menu elem directly, rather than using _getMenuOnly(menuOption).widget(), so listener is cleared even if component no longer exists.
        $(menuOption).off(this.menuEventNamespace);
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
      _getMenu: function () {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        // The JET Menu of the first element found.
        // Per architect discussion, get it every time rather than caching the menu.
        var menu = this._getMenuOnly(this._getMenuNode());

        // if no element found, or if element has no JET Menu
        if (!menu) {
          throw new Error(
            'JET Button: "menu" option specified, but does not reference a valid JET Menu.'
          );
        }

        if (!this._menuListenerSet) {
          var self = this;

          var closeEvent;
          // Use the close event type that's appropriate for the menu, not the button.  It's possible that
          // a button widget is used with an oj-menu custom element.  Since the event listener is bound
          // to the menu, we need to check the type of menu component.
          if (!menu._IsCustomElement()) {
            closeEvent = 'ojclose';
          } else {
            closeEvent = 'ojClose';
          }

          // must use "on" syntax rather than clobbering whatever "close" handler the app may have set via the menu's "option" syntax
          menu.widget().on(closeEvent + this.menuEventNamespace, function (event) {
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
      _getMenuOnly: function (menuOption) {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        // Call instance() since need to access non-public Menu api's like __dismiss()
        var constructor = Components.__GetWidgetConstructor($(menuOption)[0], 'ojMenu');
        return constructor && constructor('instance');
      },

      /*
       * Toggle the menuButton menu on and off if there is one and we're not disabled.
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
      _toggleMenu: function (event, focus) {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        if (this._IsEffectivelyDisabled()) {
          return;
        }

        // No need to fire click event, since not appropriate for DownArrow, and already fired for user click.

        var menu = this._getMenu();
        var menuElem = menu.widget();

        // If the menu is already opened, click MenuButton again will close the menu.
        if (this._menuVisible) {
          this._dismissMenu(this._getMenuNode(), event);
          return;
        }

        menu.open(event, { launcher: this.element, initialFocus: focus });

        // bail if launch was cancelled by a beforeOpen listener
        if (!menuElem.is(':visible')) {
          return;
        }

        this._menuVisible = true;

        // If menu has neither aria-label nor aria-labelledby after menu.open() calls the beforeOpen listeners, then set aria-labelledby
        // referencing the menu button, and remove it when the menu is closed.  This approach provides a useful default while allowing
        // the menu to be shared by several launchers.
        if (!menuElem[0].getAttribute('aria-label') && !menuElem[0].getAttribute('aria-labelledby')) {
          this.element.uniqueId(); // add id if not already there
          this._setAriaLabelledBy = true;
          menuElem[0].setAttribute('aria-labelledby', this.element[0].getAttribute('id'));
        }

        // Per UX requirements, menuButtons should look pressed/checked iff the menu is open:
        // - For push buttons, per architectural review, just add/remove oj-selected even though it's a push button.
        //     - Per a11y review, that's fine, but do NOT apply aria-pressed to push buttons, which would turn it into a toggle button for AT users.  He said that
        //       would just confuse things, and that the visual pressed-in look was just eye candy in this case, not semantics that we need to show to AT users.
        // - If checkbox menuButtons were supported, obviously we'd toggle the pressed look by checking/unchecking the button, which in turn would toggle oj-selected.
        //   In that case, we'd fire DOM checked event (right?) and if wrapped in Buttonset, update its checked option and fire optionChange event.
        // ER 19167450
        // calling open on a already open menu now first dismisses it.  the button
        // dismissal handler removes the "oj-select" style.  move the logic that sets
        // the oj-select to after the menu is open.
        this.rootElement.classList.add('oj-selected');
        this.rootElement.classList.remove('oj-default');
        this.rootElement.classList.remove('oj-focus-only');
      },

      /*
       * Dismisses the menuButton menu if *we* launched it
       *
       * param menuOption required.  An old or current value of the menu option, indicating which menu to close.
       * param event optional.  Pass iff dismissing due to UI event.
       */
      _dismissMenu: function (menuOption, event) {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        // this._menuVisible is set iff *we* launched the menu.  If *something else* launched it, don't dismiss it.
        if (this._menuVisible) {
          // Doesn't throw if menu not found. Something is likely wrong in that case, but don't sweat it unless they try to *launch* an MIA menu.
          var menu = this._getMenuOnly(menuOption);
          if (menu) {
            // TODO: this should be called by __dismiss(), rather than the caller having to call this too.
            menu.__collapseAll(event, true); // close open submenus before hiding the popup so that submenus will not be shown on reopen

            menu.__dismiss(event); // causes _menuDismissHandler(event) to be called
          }
        }
      },

      /*
       * Handles menu dismissals, whether or not we dismissed it ourselves.
       * See comments on similar code in _toggleMenu().
       *
       * Also called by the beforeOpen listener we put on the menu, *if* the launch was by something else,
       * including our own context menu.  So if something steals our menu, we deselect the button.
       *
       * param event must remain optional, since some callers of _dismissMenu have no event
       */
      _menuDismissHandler: function () {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        if (this._setAriaLabelledBy) {
          $(this._getMenuNode()).removeAttr('aria-labelledby');
          this._setAriaLabelledBy = false;
        }

        // console.log(this.options.label + ": button._menuDismissHandler called");
        // Since only push buttons are supported for menu buttons, the only reason for .oj-selected to be present is if it's an open menu button,
        // so we remove the class since the menu is being dismissed.
        this.rootElement.classList.remove('oj-selected');
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
      _toggleDefaultClasses: function () {
        var otherStates = $(this.rootElement).is('.oj-hover, .oj-active, .oj-selected, .oj-disabled');
        var defaultState;
        var focusedOnly;

        if (otherStates) {
          defaultState = false;
          focusedOnly = false;
        } else {
          var focused = $(this.rootElement).is('.oj-focus');
          defaultState = !focused;
          focusedOnly = focused;
        }

        if (defaultState) {
          this.rootElement.classList.add('oj-default');
        } else {
          this.rootElement.classList.remove('oj-default');
        }

        if (focusedOnly) {
          this.rootElement.classList.add('oj-focus-only');
        } else {
          this.rootElement.classList.remove('oj-focus-only');
        }
      }
    });

    /**
     * @ojcomponent oj.ojMenuButton
     * @ojdisplayname Menu Button
     * @since 4.0.0
     *
     * @augments oj.ojButton
     * @ojshortdesc A menu button launches a menu when clicked.
     * @ojrole button
     *
     * @ojpropertylayout {propertyGroup: "common", items: ["label", "display", "chroming", "disabled"]}
     * @ojvbdefaultcolumns 2
     * @ojvbmincolumns 1
     *
     * @ojoracleicon 'oj-ux-ico-menu-button'
     * @ojuxspecs ['menu-button']
     *
     * @classdesc
     * <h3 id="menubuttonOverview-section">
     *   JET Menu Button
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#menubuttonOverview-section"></a>
     * </h3>
     *
     * <pre class="prettyprint"><code>&lt;oj-menu-button id="menuButton">
     *   &lt;oj-menu id="menu" slot="menu" style="display:none">
     *       &lt;oj-option>Item 1&lt;/oj-option>
     *       &lt;oj-option>Item 2&lt;/oj-option>
     *       &lt;oj-option>Item 3&lt;/oj-option>
     *   &lt;/oj-menu>
     * &lt;/oj-menu-button></code></pre>
     *
     * <h3 id="buttonsetToolbar-section">
     *   Buttonsets and Toolbars
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonsetToolbar-section"></a>
     * </h3>
     *
     * <p>The [JET Buttonset]{@link oj.ojButtonset} component can be used to create toggle buttons or group related buttons.  It cannot be used
     * to create menu buttons or regular push buttons. Buttonset provides visual and semantic grouping and WAI-ARIA-compliant focus management.  See the Buttonset API doc for more information.
     *
     * <p>Menu buttons, push buttons, and buttonsets can be placed in a [JET Toolbar]{@link oj.ojToolbar}.  Like Buttonset, Toolbar is themable and provides WAI-ARIA-compliant
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
     * <p>For accessibility, it is not required to set an aria label on a JET Menu Button as it uses the text in the default slot to generate an aria label.
     * Therefore the default slot should be filled even if the button is <a href="#display">icon-only (display=icons)</a>. However,
     * you can override the default behavior by setting <code class="prettyprint">aria-label</code> or <code class="prettyprint">aria-labelledby</code>.
     * {@ojinclude "name":"accessibilityCommon"}
     *
     *
     *
     * <h3 id="perf-section">
     *   Performance
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
     * </h3>
     *
     * <p>In lieu of stamping a menu button in a table, dataGrid, or other container, consider placing a single Menu Button outside of the
     * container that acts on the currently selected row or cell.
     *
     * <h3 id="state-section">
     *   Setting Component State
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#state-section"></a>
     * </h3>
     *
     * {@ojinclude "name":"stateCommon"}
     */
    // --------------------------------------------------- oj.ojMenuButton Styling Start ------------------------------------------------------------
    /**
     * @classdesc The following CSS classes can be applied by the page author as needed.<br/>
     */
    // ---------------- oj-button size --------------
    /**
     * Makes the button small or large.<br>
     * @ojstyleset button-size
     * @ojdisplayname Button Size
     * @ojstylesetitems ["button-size.oj-button-sm", "button-size.oj-button-lg"]
     * @ojstylerelation exclusive
     * @memberof oj.ojMenuButton
     */
    /**
     * @ojstyleclass button-size.oj-button-sm
     * @ojshortdesc Makes the button small.
     * @ojdisplayname Small
     * @memberof! oj.ojMenuButton
     */
    /**
     * @ojstyleclass button-size.oj-button-lg
     * @ojshortdesc Makes the button large.
     * @ojdisplayname Large
     * @memberof! oj.ojMenuButton
     */
    // --------------------------------------------------- oj.ojMenuButton Styling End ------------------------------------------------------------

    /**
     * @ojcomponent oj.ojButtonsetOne
     * @since 0.6.0
     *
     * @augments oj.ojButtonset
     * @ojshortdesc A buttonset one is a grouping of related buttons where only one button may be selected.
     * @ojrole button
     * @ojrole radiogroup
     *
     * @ojpropertylayout {propertyGroup: "common", items: ["display", "chroming", "disabled"]}
     * @ojpropertylayout {propertyGroup: "data", items: ["value"]}
     * @ojvbdefaultcolumns 12
     * @ojvbmincolumns 1
     *
     * @ojoracleicon 'oj-ux-ico-button-set-one'
     * @ojuxspecs ['toggle-button']
     *
     * @classdesc
     * <h3 id="buttonsetOverview-section">
     *   JET Buttonset One
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonsetOverview-section"></a>
     * </h3>
     *
     * <p>Description: Themeable, WAI-ARIA-compliant visual and semantic grouping container for [JET Buttons]{@link oj.ojButton}.
     *
     * <p>The JET ButtonsetOne can be used to group related buttons, where only one button may be selected.  Buttonset provides
     * visual and semantic grouping and WAI-ARIA-compliant focus management.
     *
     * <p>When a Buttonset is created or refreshed, it creates JET Buttons out of all contained <code class="prettyprint">oj-option</code>
     * DOM elements by wrapping them and calling <code class="prettyprint">.ojButton()</code> on the generated content. The Buttonset will remove all
     * non <code class="prettyprint">oj-option</code> DOM elements from the Buttonset.
     *
     * <p><code class="prettyprint">oj-option</code>s inside of the buttonset should specify the <code class="prettyprint">oj-option</code>
     * <code class="prettyprint">value</code> attribute, since the <code class="prettyprint">oj-buttonset-one</code> <code class="prettyprint">value</code> attribute refers to that attribute.
     *
     * <pre class="prettyprint"><code>&lt;oj-buttonset-one id="myButtonset">
     *   &lt;oj-option value="myValue0">Value0&lt;/oj-option>
     *   &lt;oj-option value="myValue1">Value1&lt;/oj-option>
     * &lt;/oj-buttonset-one></code></pre>
     *
     * {@ojinclude "name":"buttonsetCommon"}
     *
     * <pre class="prettyprint">
     * <code>&lt;oj-buttonset-one id="drinkset">
     *       &lt;oj-bind-for-each data="[[drinkValues]]">
     *         &lt;template>
     *           &lt;oj-option value="[[$current.data.id]]">
     *             &lt;span>
     *               &lt;oj-bind-text value="[[$current.data.label]]">&lt;/oj-bind-text>
     *             &lt;/span>
     *           &lt;/oj-option>
     *         &lt;/template>
     *       &lt;/oj-bind-for-each>
     *   &lt;/oj-buttonset-one>
     * </code></pre>
     */
    // --------------------------------------------------- oj.ojButtonsetOne Styling Start ------------------------------------------------------------
    /**
     * @classdesc The following CSS classes can be applied by the page author as needed.<br/>
     */
    // -----------------oj-buttonset-width-auto --------------
    /**
     * <p>Forces Buttonset Buttons' widths to be determined by the total width of their icons and label contents, overriding any theming defaults.</p>
     * <p>Optionally, specify the overall width of the Buttonset for further width control.</p>
     * <p>Can be applied to Buttonset's root element, or on an ancestor such as Toolbar or document.</p>
     * @ojstyleclass oj-buttonset-width-auto
     * @ojshortdesc Sets button set width to content size.
     * @ojdisplayname Auto-Width
     * @memberof oj.ojButtonsetOne
     */
    // ----------------- oj-buttonset-width-equal --------------
    /**
     * <p>Forces Buttonset Buttons' widths to be equal, overriding any theming defaults.</p>
     * <p>Note that the overall width of the Buttonset defaults to 100%; set the max-width (recommended) or width of the Buttonset for further width control.</p>
     * <p>Can be applied to Buttonset's root element, or on an ancestor such as Toolbar or document.</p>
     * @ojstyleclass oj-buttonset-width-equal
     * @ojshortdesc Sets button set width to be equal.
     * @ojdisplayname Equal Width
     * @memberof oj.ojButtonsetOne
     */
    // ---------------- oj-button size --------------
    /**
     * Makes the button small or large.<br>
     * @ojstyleset button-size
     * @ojdisplayname Button Size
     * @ojstylesetitems ["button-size.oj-button-sm", "button-size.oj-button-lg"]
     * @ojstylerelation exclusive
     * @memberof oj.ojButtonsetOne
     */
    /**
     * @ojstyleclass button-size.oj-button-sm
     * @ojshortdesc Makes the button small.
     * @ojdisplayname Small
     * @memberof! oj.ojButtonsetOne
     */
    /**
     * @ojstyleclass button-size.oj-button-lg
     * @ojshortdesc Makes the button large.
     * @ojdisplayname Large
     * @memberof! oj.ojButtonsetOne
     */
    // --------------------------------------------------- oj.ojButtonsetOne Styling End ------------------------------------------------------------

    /**
     * @ojcomponent oj.ojButtonsetMany
     * @since 0.6.0
     *
     * @augments oj.ojButtonset
     * @ojshortdesc A buttonset many is a grouping of related buttons where any number of buttons may be selected.
     * @ojrole button
     * @ojrole group
     *
     * @ojpropertylayout {propertyGroup: "common", items: ["display", "chroming", "disabled"]}
     * @ojpropertylayout {propertyGroup: "data", items: ["value"]}
     * @ojvbdefaultcolumns 12
     * @ojvbmincolumns 1
     *
     * @ojoracleicon 'oj-ux-ico-button-set-many'
     * @ojuxspecs ['toggle-button']
     *
     * @classdesc
     * <h3 id="buttonsetOverview-section">
     *   JET Buttonset Many
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonsetOverview-section"></a>
     * </h3>
     *
     * <p>Description: Themeable, WAI-ARIA-compliant visual and semantic grouping container for [JET Buttons]{@link oj.ojButton}.
     *
     * <p>The JET ButtonsetMany can be used to group related buttons, where any number of the buttons can be selected.  Buttonset provides
     * visual and semantic grouping and WAI-ARIA-compliant focus management.
     *
     * <p>When a Buttonset is created or refreshed, it creates JET Buttons out of all contained <code class="prettyprint">oj-option</code>
     * DOM elements by wrapping them and calling <code class="prettyprint">.ojButton()</code> on the generated content. The Buttonset will remove all
     * non <code class="prettyprint">oj-option</code> DOM elements from the Buttonset.
     *
     * <p><code class="prettyprint">oj-option</code>s in the buttonset should specify the <code class="prettyprint">oj-option</code>
     * <code class="prettyprint">value</code> attribute, since the <code class="prettyprint">oj-buttonset-mnay</code> <code class="prettyprint">value</code> attribute refers to that attribute.
     *
     * <pre class="prettyprint"><code>&lt;oj-buttonset-many id="myButtonset">
     *   &lt;oj-option value="myValue0">Value0&lt;/oj-option>
     *   &lt;oj-option value="myValue1">Value1&lt;/oj-option>
     * &lt;/oj-buttonset-many></code></pre>
     *
     * {@ojinclude "name":"buttonsetCommon"}
     *
     * <pre class="prettyprint">
     * <code>&lt;oj-buttonset-many id="drinkset">
     *       &lt;oj-bind-for-each data="[[drinkValues]]">
     *         &lt;template>
     *           &lt;oj-option value="[[$current.data.id]]">
     *             &lt;span>
     *               &lt;oj-bind-text value="[[$current.data.label]]">&lt;/oj-bind-text>
     *             &lt;/span>
     *           &lt;/oj-option>
     *         &lt;/template>
     *       &lt;/oj-bind-for-each>
     *   &lt;/oj-buttonset-many>
     * </code></pre>
     */
    // --------------------------------------------------- oj.ojButtonsetMany Styling Start ------------------------------------------------------------
    /**
     * @classdesc The following CSS classes can be applied by the page author as needed.<br/>
     */
    // ----------------- oj-buttonset-width-auto --------------
    /**
     * <p>Forces Buttonset Buttons' widths to be determined by the total width of their icons and label contents, overriding any theming defaults.</p>
     * <p>Optionally, specify the overall width of the Buttonset for further width control.</p>
     * <p>Can be applied to Buttonset's root element, or on an ancestor such as Toolbar or document.</p>
     * @ojstyleclass oj-buttonset-width-auto
     * @ojshortdesc Sets button set width to content size.
     * @ojdisplayname Auto-Width
     * @memberof oj.ojButtonsetMany
     */
    // ----------------- oj-buttonset-width-equal --------------
    /**
     * <p>Forces Buttonset Buttons' widths to be equal, overriding any theming defaults.</p>
     * <p>Note that the overall width of the Buttonset defaults to 100%; set the max-width (recommended) or width of the Buttonset for further width control.</p>
     * <p>Can be applied to Buttonset's root element, or on an ancestor such as Toolbar or document.</p>
     * @ojstyleclass oj-buttonset-width-equal
     * @ojshortdesc Sets button set width to be equal.
     * @ojdisplayname Equal Width
     * @memberof oj.ojButtonsetMany
     */
    // ---------------- oj-button size --------------
    /**
     * Makes the button small or large.<br>
     * @ojstyleset button-size
     * @ojdisplayname Button Size
     * @ojstylesetitems ["button-size.oj-button-sm", "button-size.oj-button-lg"]
     * @ojstylerelation exclusive
     * @memberof oj.ojButtonsetMany
     */
    /**
     * @ojstyleclass button-size.oj-button-sm
     * @ojshortdesc Makes the button small.
     * @ojdisplayname Small
     * @memberof! oj.ojButtonsetMany
     */
    /**
     * @ojstyleclass button-size.oj-button-lg
     * @ojshortdesc Makes the button large.
     * @ojdisplayname Large
     * @memberof! oj.ojButtonsetMany
     */
    // --------------------------------------------------- oj.ojButtonsetMany Styling End ------------------------------------------------------------

    /**
     * @ojcomponent oj.ojButtonset
     * @augments oj.baseComponent
     * @since 0.6.0
     * @abstract
     * @classdesc
     * @hideconstructor
     */

    /**
     * <h3 id="touch-section">
     *   Touch End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
     * </h3>
     *
     * {@ojinclude "name":"touchDoc"}
     *
     * <h3 id="keyboard-section">
     *   Keyboard End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
     * </h3>
     *
     * {@ojinclude "name":"keyboardDoc"}
     *
     * <h3 id="keyboard-appdev-section">
     *   Keyboard Application Developer Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-appdev-section"></a>
     * </h3>
     *
     * <p>The application should not do anything to interfere with the Buttonset's focus management, such as setting the <code class="prettyprint">tabindex</code>
     * of the buttons.  Also, enabled buttons should remain user-visible, without which arrow-key navigation to the button would cause the focus to seemingly disappear.
     *
     * <p>The buttonset's focus management should be turned off when placing the buttonset in a [JET Toolbar]{@link oj.ojToolbar}.  See the <code class="prettyprint">focusManagement</code> attribute.
     * In this case, the "Keyboard End User Information" documented above is superseded by the Toolbar's documented keyboard behavior.
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>The application is responsible for applying <code class="prettyprint">aria-label</code> and/or
     * <code class="prettyprint">aria-controls</code> attributes like the following to the buttonset element, if applicable per the instructions that follow:
     *
     * <pre class="prettyprint">
     * <code>aria-label="Choose only one beverage."
     * aria-controls="myTextEditor"
     * </code></pre>
     *
     * <p>An <code class="prettyprint">aria-label</code> conveying the "choose only one" semantics should be included for a buttonset-one.
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
     * <h3 id="rtl-section">
     *   Reading direction
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
     * </h3>
     *
     * <p>The only supported way to set the reading direction (LTR or RTL) is to set the <code class="prettyprint">"dir"</code> attribute on the
     * <code class="prettyprint">&lt;html></code> element of the page.  As with any JET component, in the unusual case that the reading direction
     * is changed post-create, the buttonset must be <code class="prettyprint">refresh()</code>ed, or the page must be reloaded.
     *
     * <h3 id="binding-section">
     *   Declarative Binding
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#binding-section"></a>
     * </h3>
     *
     * <p>For components like Buttonset and Menu that contain a number of like items, applications may wish to use an <code class="prettyprint">oj-bind-for-each</code>
     * to stamp out the contents as follows:
     *
     * @ojfragment buttonsetCommon
     * @memberof oj.ojButtonset
     * @instance
     */
    // ---------------------------------- Styling oj-button ------------------------------------
    /**
     * @classdesc The following CSS classes can be applied by the page author as needed.<br/>
     */
    // ---------------- oj-button size --------------
    /**
     * Makes the button small, large, or extra large.<br>
     * The class is applied to the Button's root element.
     * @ojstyleset button-size
     * @ojdisplayname Button Size
     * @ojstylesetitems ["button-size.oj-button-sm", "button-size.oj-button-lg", "button-size.oj-button-xl"]
     * @ojstylerelation exclusive
     * @memberof oj.ojButton
     * @ojtsexample
     * &lt;oj-button class="oj-button-sm">
     *    &lt;!--  content -->
     * &lt;/oj-button>
     */
    /**
     * @ojstyleclass button-size.oj-button-sm
     * @ojshortdesc Makes the button small.
     * @ojdisplayname Small
     * @memberof! oj.ojButton
     */
    /**
     * @ojstyleclass button-size.oj-button-lg
     * @ojshortdesc Makes the button large.
     * @ojdisplayname Large
     * @memberof! oj.ojButton
     */
    /**
     * @ojstyleclass button-size.oj-button-xl
     * @ojshortdesc Makes the button extra large.
     * @ojdisplayname X-Large
     * @ojdeprecated [{since: "9.0.0", description: "This class will be removed in the future."}]
     * @memberof! oj.ojButton
     */
    // ---------------- oj-button-full-width --------------
    /**
     * Apply 100% full-width to the button.
     * The class is applied to the Button's root element.
     * It is intended for buttons which stretch to the edge, not for buttons with padding.
     *
     * @ojstyleclass oj-button-full-width
     * @ojshortdesc Apply 100% full-width to the button.
     * @ojdisplayname Full Width
     * @ojunsupportedthemes ["Alta"]
     * @memberof oj.ojButton
     * @ojtsexample
     * &lt;oj-button class="oj-button-full-width">
     *    &lt;!--  content -->
     * &lt;/oj-button>
     */
    // ---------------- oj-button-primary --------------
    /**
     * Draws attention to the button, often identifying the primary action in a set of buttons. Designed for use with a push button. In some themes, this class does nothing.<br>
     * The class is applied to the Button's root element.
     * @ojstyleclass oj-button-primary
     * @ojdisplayname Primary
     * @ojdeprecated [{since: "8.0.0", description: "This class will be removed in the future. Please use 'callToAction' chroming instead."}]
     * @memberof oj.ojButton
     * @ojtsexample
     * &lt;oj-button class="oj-button-primary">
     *    &lt;!--  content -->
     * &lt;/oj-button>
     */
    // ---------------- oj-button-confirm --------------
    /**
     * Identifies an action to confirm. Designed for use with a push button.<br>
     * This class is applied to the Button's root element.
     * @ojstyleclass oj-button-confirm
     * @ojdisplayname Confirm
     * @ojdeprecated [{since: "9.0.0", description: "This class will be removed in the future."}]
     * @memberof oj.ojButton
     * @ojtsexample
     * &lt;oj-button class="oj-button-confirm">
     *    &lt;!--  content -->
     * &lt;/oj-button>
     */
    // ---------------- oj-focus-highlight --------------
    /**
     * Under normal circumstances this class is applied automatically. It is documented here for the rare cases that an app developer needs per-instance control.<br/><br/>
     * The <code class="prettyprint"><span>oj-focus-highlight</span></code> class applies focus styling that may not be desirable when the focus results from pointer interaction (touch or mouse), but which is needed for accessibility when the focus occurs by a non-pointer mechanism, for example keyboard or initial page load.<br/><br/>
     * The application-level behavior for this component is controlled in the theme by the <code class="prettyprint"><span class="pln">$focusHighlightPolicy </span></code>SASS variable; however, note that this same variable controls the focus highlight policy of many components and patterns. The values for the variable are:<br/><br/>
     * <code class="prettyprint"><span class="pln">nonPointer: </span></code>oj-focus-highlight is applied only when focus is not the result of pointer interaction. Most themes default to this value.<br/>
     * <code class="prettyprint"><span class="pln">all: </span></code> oj-focus-highlight is applied regardless of the focus mechanism.<br/>
     * <code class="prettyprint"><span class="pln">none: </span></code> oj-focus-highlight is never applied. This behavior is not accessible, and is intended for use when the application wishes to use its own event listener to precisely control when the class is applied (see below). The application must ensure the accessibility of the result.<br/><br/>
     * To change the behavior on a per-instance basis, the application can set the SASS variable as desired and then use event listeners to toggle this class as needed.<br/>
     * @ojstyleclass oj-focus-highlight
     * @ojdisplayname Focus Styling
     * @ojshortdesc Allows per-instance control of the focus highlight policy (not typically required). See the Help documentation for more information.
     * @memberof oj.ojButton
     * @ojtsexample
     * &lt;oj-button class="oj-focus-highlight">
     *    &lt;!--  content -->
     * &lt;/oj-button>
     */
    //-----------------------------------------------------
    //                   Styling
    //-----------------------------------------------------
    // ---------------- default button ---------------------
    /**
     * @ojstylevariableset oj-button-css-set1
     * @ojdisplayname Default buttons
     * @ojstylevariable oj-button-height                {description: "Button height",                formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-border-radius         {description: "Button border radius",         formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-font-size             {description: "Button font size",             formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-font-weight           {description: "Button font weight",           formats: ["font_weight"]}
     * @ojstylevariable oj-button-icon-size             {description: "Button icon size",             formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-text-to-edge-padding  {description: "Button text to edge padding",  formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-icon-to-text-padding  {description: "Button icon to text padding",  formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-icon-to-edge-padding  {description: "Button icon to edge padding",  formats: ["length", "percentage"]}
     * @memberof oj.ojButton
     */
    // ---------------- small button -----------------------
    /**
     * @ojstylevariableset oj-button-css-set2
     * @ojdisplayname Small buttons
     * @ojstylevariable oj-button-sm-height                {description: "Small button height",                formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-sm-font-size             {description: "Small button font size",             formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-sm-icon-size             {description: "Small button icon size",             formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-sm-text-to-edge-padding  {description: "Small button text to edge padding",  formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-sm-icon-to-text-padding  {description: "Small button icon to text padding",  formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-sm-icon-to-edge-padding  {description: "Small button icon to edge padding",  formats: ["length", "percentage"]}
     * @memberof oj.ojButton
     */
    // ---------------- large button -----------------------
    /**
     * @ojstylevariableset oj-button-css-set3
     * @ojdisplayname Large buttons
     * @ojstylevariable oj-button-lg-height                {description: "Large button height",                formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-lg-font-size             {description: "Large button font size",             formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-lg-icon-size             {description: "Large button icon size",             formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-lg-text-to-edge-padding  {description: "Large button text to edge padding",  formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-lg-icon-to-text-padding  {description: "Large button icon to text padding",  formats: ["length", "percentage"]}
     * @ojstylevariable oj-button-lg-icon-to-edge-padding  {description: "Large button icon to edge padding",  formats: ["length", "percentage"]}
     * @memberof oj.ojButton
     */
    // ---------------- borderless buttons -----------------------
    /**
     * @ojstylevariableset oj-button-css-set4
     * @ojdisplayname Borderless buttons
     * @ojstylevariable oj-button-borderless-chrome-text-color                     {description: "Borderless chrome button text color",                         formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-bg-color-hover                 {description: "Borderless chrome button hover background color",             formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-border-color-hover             {description: "Borderless chrome button hover border color",                 formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-text-color-hover               {description: "Borderless chrome button hover text color",                   formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-bg-color-active                {description: "Borderless chrome button active background color",            formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-border-color-active            {description: "Borderless chrome button active border color",                formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-text-color-active              {description: "Borderless chrome button active text color",                  formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-bg-color-selected              {description: "Borderless chrome button selected background color",          formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-border-color-selected          {description: "Borderless chrome button selected border color",              formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-text-color-selected            {description: "Borderless chrome button selected text color",                formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-bg-color-selected-hover        {description: "Borderless chrome button selected hover background color",    formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-border-color-selected-hover    {description: "Borderless chrome button selected hover border color",        formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-text-color-selected-hover      {description: "Borderless chrome button selected hover text color",          formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-text-color-disabled            {description: "Borderless chrome button disabled text color",                formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-bg-color-selected-disabled     {description: "Borderless chrome button disabled selected background color", formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-border-color-selected-disabled {description: "Borderless chrome button disabled selected border color",     formats:  ["color"]}
     * @ojstylevariable oj-button-borderless-chrome-text-color-selected-disabled   {description: "Borderless chrome button disabled selected text color",       formats:  ["color"]}
     * @memberof oj.ojButton
     */
    // ---------------- outlined buttons -----------------------
    /**
     * @ojstylevariableset oj-button-css-set5
     * @ojdisplayname Outlined buttons
     * @ojstylevariable oj-button-outlined-chrome-bg-color                         {description: "Outlined chrome button background color",                     formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-border-color                     {description: "Outlined chrome button border color",                         formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-text-color                       {description: "Outlined chrome button text color",                           formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-bg-color-hover                   {description: "Outlined chrome button hover background color",               formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-border-color-hover               {description: "Outlined chrome button hover border color",                   formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-text-color-hover                 {description: "Outlined chrome button hover text color",                     formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-bg-color-active                  {description: "Outlined chrome button active background color",              formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-border-color-active              {description: "Outlined chrome button active border color",                  formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-text-color-active                {description: "Outlined chrome button active text color",                    formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-bg-color-selected                {description: "Outlined chrome button selected background color",            formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-border-color-selected            {description: "Outlined chrome button selected border color",                formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-text-color-selected              {description: "Outlined chrome button selected text color",                  formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-bg-color-selected-hover          {description: "Outlined chrome button selected hover background color",      formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-border-color-selected-hover      {description: "Outlined chrome button selected hover border color",          formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-text-color-selected-hover        {description: "Outlined chrome button selected hover text color",            formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-bg-color-disabled                {description: "Outlined chrome button disabled background color",            formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-border-color-disabled            {description: "Outlined chrome button disabled border color",                formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-text-color-disabled              {description: "Outlined chrome button disabled text color",                  formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-bg-color-selected-disabled       {description: "Outlined chrome button selected disabled background color",   formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-border-color-selected-disabled   {description: "Outlined chrome button selected disabled border color",       formats:  ["color"]}
     * @ojstylevariable oj-button-outlined-chrome-text-color-selected-disabled     {description: "Outlined chrome button selected disabled text color",         formats:  ["color"]}
     * @memberof oj.ojButton
     */
    // ---------------- solid buttons -----------------------
    /**
     * @ojstylevariableset oj-button-css-set6
     * @ojdisplayname Solid buttons
     * @ojstylevariable oj-button-solid-chrome-bg-color              {description: "Solid chrome button background color",           formats: ["color"]}
     * @ojstylevariable oj-button-solid-chrome-border-color          {description: "Solid chrome button border color",               formats: ["color"]}
     * @ojstylevariable oj-button-solid-chrome-text-color            {description: "Solid chrome button text color",                 formats: ["color"]}
     * @ojstylevariable oj-button-solid-chrome-bg-color-hover        {description: "Solid chrome button hover background color",     formats: ["color"]}
     * @ojstylevariable oj-button-solid-chrome-border-color-hover    {description: "Solid chrome button hover border color",         formats: ["color"]}
     * @ojstylevariable oj-button-solid-chrome-text-color-hover      {description: "Solid chrome button hover text color",           formats: ["color"]}
     * @ojstylevariable oj-button-solid-chrome-bg-color-active       {description: "Solid chrome button active background color",    formats: ["color"]}
     * @ojstylevariable oj-button-solid-chrome-border-color-active   {description: "Solid chrome button active border color",        formats: ["color"]}
     * @ojstylevariable oj-button-solid-chrome-text-color-active     {description: "Solid chrome button active text color",          formats: ["color"]}
     * @ojstylevariable oj-button-solid-chrome-bg-color-selected     {description: "Solid chrome button selected background color",  formats: ["color"]}
     * @ojstylevariable oj-button-solid-chrome-border-color-selected {description: "Solid chrome button selected border color",      formats: ["color"]}
     * @ojstylevariable oj-button-solid-chrome-text-color-selected   {description: "Solid chrome button selected text color",        formats: ["color"]}
     * @ojstylevariable oj-button-solid-chrome-bg-color-selected-hover         {description: "Solid chrome button selected hover background color",     formats:  ["color"]}
     * @ojstylevariable oj-button-solid-chrome-border-color-selected-hover     {description: "Solid chrome button selected hover border color",         formats:  ["color"]}
     * @ojstylevariable oj-button-solid-chrome-text-color-selected-hover       {description: "Solid chrome button selected hover text color",           formats:  ["color"]}
     * @ojstylevariable oj-button-solid-chrome-bg-color-disabled               {description: "Solid chrome button disabled background color",           formats:  ["color"]}
     * @ojstylevariable oj-button-solid-chrome-border-color-disabled           {description: "Solid chrome button disabled border color",               formats:  ["color"]}
     * @ojstylevariable oj-button-solid-chrome-text-color-disabled             {description: "Solid chrome button disabled text color",                 formats:  ["color"]}
     * @ojstylevariable oj-button-solid-chrome-bg-color-selected-disabled      {description: "Solid chrome button disabled selected background color",  formats:  ["color"]}
     * @ojstylevariable oj-button-solid-chrome-border-color-selected-disabled  {description: "Solid chrome button disabled selected border color",      formats:  ["color"]}
     * @ojstylevariable oj-button-solid-chrome-text-color-selected-disabled    {description: "Solid chrome button disabled selected text color",        formats:  ["color"]}
     * @memberof oj.ojButton
     */
    // ---------------- call to action buttons -----------------------
    /**
     * @ojstylevariableset oj-button-css-set7
     * @ojdisplayname Call to action buttons
     * @ojstylevariable oj-button-call-to-action-chrome-bg-color             {description: "Call to action chrome button background color",         formats:  ["color"]}
     * @ojstylevariable oj-button-call-to-action-chrome-border-color         {description: "Call to action chrome button border color",             formats:  ["color"]}
     * @ojstylevariable oj-button-call-to-action-chrome-text-color           {description: "Call to action chrome button text color",               formats:  ["color"]}
     * @ojstylevariable oj-button-call-to-action-chrome-bg-color-hover       {description: "Call to action chrome button hover background color",   formats:  ["color"]}
     * @ojstylevariable oj-button-call-to-action-chrome-border-color-hover   {description: "Call to action chrome button hover border color",       formats:  ["color"]}
     * @ojstylevariable oj-button-call-to-action-chrome-text-color-hover     {description: "Call to action chrome button hover text color",         formats:  ["color"]}
     * @ojstylevariable oj-button-call-to-action-chrome-bg-color-active      {description: "Call to action chrome button active background color",  formats:  ["color"]}
     * @ojstylevariable oj-button-call-to-action-chrome-border-color-active  {description: "Call to action chrome button active border color",      formats:  ["color"]}
     * @ojstylevariable oj-button-call-to-action-chrome-text-color-active    {description: "Call to action chrome button active text color",        formats:  ["color"]}
     * @memberof oj.ojButton
     */
    // ---------------------------------- Styling oj-button end------------------------------------

    // ---------------------------------- oj-buttonset virtual doclets ------------------------------------
    // API doc for inherited methods with no JS in this file:

    // Fragments:

    /**
     * <p>The &lt;oj-buttonset-one> element accepts <code class="prettyprint">oj-option</code> elements as children. See the [oj-option]{@link oj.ojOption} documentation for details about
     * accepted children and slots.</p>
     *
     * @ojchild Default
     * @memberof oj.ojButtonsetOne
     * @ojshortdesc The oj-buttonset-one element accepts oj-option elements as children.
     * @ojpreferredcontent ["OptionElement"]
     *
     * @example <caption>Initialize the Buttonset with child content specified:</caption>
     * &lt;oj-buttonset-one>
     *   &lt;oj-option value="btn1">Button 1&lt;/oj-option>
     *   &lt;oj-option value="btn2">Button 2&lt;/oj-option>
     *   &lt;oj-option value="btn3">Button 3&lt;/oj-option>
     * &lt;/oj-buttonset-one>
     */

    /**
     * <p>The &lt;oj-buttonset-many> element accepts <code class="prettyprint">oj-option</code> elements as children. See the [oj-option]{@link oj.ojOption} documentation for details about
     * accepted children and slots.</p>
     *
     * @ojchild Default
     * @memberof oj.ojButtonsetMany
     * @ojshortdesc The oj-buttonset-many element accepts oj-option elements as children.
     * @ojpreferredcontent ["OptionElement"]
     *
     * @example <caption>Initialize the Buttonset with child content specified:</caption>
     * &lt;oj-buttonset-many>
     *   &lt;oj-option value="btn1">Button 1&lt;/oj-option>
     *   &lt;oj-option value="btn2">Button 2&lt;/oj-option>
     *   &lt;oj-option value="btn3">Button 3&lt;/oj-option>
     * &lt;/oj-buttonset-many>
     */

    /**
     * <p>All Buttonset touch interaction is with the individual buttons.  See the [JET Button]{@link oj.ojButton} touch gesture doc.
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojButtonset
     * @instance
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
     * @instance
     */
    oj.__registerWidget('oj.ojButtonset', $.oj.baseComponent, {
      // private.  Was an undocumented JQUI option, which we removed, so I moved from options to here and added underscore.  Leave unquoted so gets renamed by GCC as desired.
      _items:
        'button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a',

      widgetEventPrefix: 'oj',

      // options is in externs.js.  TODO: same as other prototype fields.
      options: {
        /**
         * The <code class="prettyprint">value</code> attribute indicates which <code class="prettyprint">oj-option</code> in the Buttonset is selected.
         * It corresponds to the <code class="prettyprint">value</code> attribute of the <code class="prettyprint">oj-option</code>, which should always be set.
         *
         * <code class="prettyprint">value</code> is any type equal to the <code class="prettyprint">value</code> attribute of the selected <code class="prettyprint">oj-option</code>.  The attribute is
         * <code class="prettyprint">null</code> if and only if no <code class="prettyprint">oj-option</code> is selected.  Thus, an n-<code class="prettyprint">oj-option</code> group has n+1 valid
         * <code class="prettyprint">value</code> values: the n <code class="prettyprint">oj-option</code> values, and <code class="prettyprint">null</code> .
         *
         * {@ojinclude "name":"buttonsetCommonValue"}
         *
         * @name value
         * @memberof oj.ojButtonsetOne
         * @instance
         * @type {any}
         * @default null
         * @ojwriteback
         * @ojshortdesc Indicates which oj-option in the buttonset is selected.
         * @ojeventgroup common
         *
         * @example <caption>Initialize the Buttonset with the <code class="prettyprint">value</code> attribute specified:</caption>
         * &lt;oj-buttonset-one value='bold'>&lt;/oj-buttonset-one>
         *
         * @example <caption>Get or set the <code class="prettyprint">value</code> property after initialization:</caption>
         * // Get one
         * var value = myButtonset.value;
         *
         * // Set one.  (No property change event will be fired.)
         * myButtonset.value = 'bold';
         */
        /**
         * The <code class="prettyprint">value</code> attribute indicates which <code class="prettyprint">oj-option</code>s in the Buttonset are selected.
         * It corresponds to the <code class="prettyprint">value</code> attribute of those elements, which should always be set.
         *
         * <code class="prettyprint">value</code> is a possibly empty, non-<code class="prettyprint">null</code> string array containing the <code class="prettyprint">value</code>
         * attributes of the selected <code class="prettyprint">oj-option</code>s.  This array has "set", not "list", semantics; i.e. order is neither important nor guaranteed.
         * Thus, an n-<code class="prettyprint">oj-option</code> set has 2^n valid <code class="prettyprint">value</code> values: the 2^n possible subsets of n <code class="prettyprint">oj-option</code>s.
         *
         * {@ojinclude "name":"buttonsetCommonValue"}
         *
         * @name value
         * @memberof oj.ojButtonsetMany
         * @instance
         * @type {Array.<any>|null}
         * @default null
         * @ojwriteback
         * @ojshortdesc Indicates which oj-options in the buttonset are selected.
         * @ojeventgroup common
         *
         * @example <caption>Initialize the Buttonset with the <code class="prettyprint">value</code> attribute specified:</caption>
         * &lt;oj-buttonset-many value='{{["bold", "italic"]}}'>&lt;/oj-buttonset-many>
         *
         * @example <caption>Get or set the <code class="prettyprint">value</code> property after initialization:</caption>
         * // Get one (if many)
         * var value = myButtonset.value[0];
         *
         * // Get all
         * var values = myButtonset.value;
         *
         * // Set one.  (If many. No property change event will be fired.)
         * myButtonset.value[1] = 'bold';
         *
         * // Set all.
         * myButtonset.value = ["bold", "italic"];
         */
        /**
         * <p>In all other cases, <code class="prettyprint">value</code> is <code class="prettyprint">null</code>.
         *
         * <p>It's still possible for the <code class="prettyprint">value</code> attribute and DOM to get out of sync by other means.
         * In this case, the app is responsible for updating the <code class="prettyprint">value</code> attribute.  A typical case is
         * when the set of Buttons contained in the Buttonset changes, possibly due to a Knockout binding, in which case the app must first call
         * <code class="prettyprint">refresh</code> (as in all cases when the DOM changes underneath a component), and then
         * update the <code class="prettyprint">value</code> attribute to the desired value.
         *
         * <p>Often there is no need to listen for this event, since the
         * <code class="prettyprint">value</code> binding, discussed above, will update the bound observable whenever the
         * <code class="prettyprint">value</code> state changes.  The declarative binding is often preferable to an explicit listener.
         *
         * <p>A click listener should not be used to detect changes to the <code class="prettyprint">value</code> state.
         * The attribute <code class="prettyprint">value</code> binding and/or
         * the <code class="prettyprint">valueChange</code> event should be used instead.
         *
         * @memberof oj.ojButtonset
         * @instance
         * @ojfragment buttonsetCommonValue
         */
        checked: null,

        /**
         * {@ojinclude "name":"buttonsetCommonChroming"}
         *
         * @name chroming
         * @memberof oj.ojButtonsetOne
         * @instance
         * @type {string}
         * @ojvalue {string} "solid" Solid buttons stand out, and direct the user's attention to the most important actions in the UI. Note that this option is not supported in the Redwood theme.
         * @ojvalue {string} "outlined" Outlined buttons are salient, but lighter weight than solid buttons. Outlined buttons are useful for secondary actions.
         * @ojvalue {string} "borderless" Borderless buttons are the least prominent variation. Borderless buttons are useful for supplemental actions that require minimal emphasis.
         * @ojvalue {string} "full" Please use solid instead. In typical themes, full-chrome buttons always have chrome.
         * @ojvalue {string} "half" In typical themes, half-chrome buttons acquire chrome only in their hover, active, and selected states.
         * @ojshortdesc Indicates in what states the buttonset has chrome (background and border).
         * @ojdeprecated [{target:'propertyValue', for:"half", since: "6.0.0", description: "This value will be removed in the future. Please use borderless instead."},
         *                {target:'propertyValue', for:"full", since: "6.0.0", description: "This value will be removed in the future. Please use solid instead."}]
         *
         *
         * @example <caption>Initialize the Buttonset with the <code class="prettyprint">chroming</code> attribute specified:</caption>
         * &lt;oj-buttonset-one chroming='borderless'>&lt;/oj-buttonset-one>
         *
         * @example <caption>Get or set the <code class="prettyprint">chroming</code> property after initialization:</caption>
         * // getter
         * var chromingValue = myButtonset.chroming;
         *
         * // setter
         * myButtonset.chroming = 'borderless';
         *
         * @example <caption>Set the default in the theme (CSS) :</caption>
         * --oj-private-buttonset-global-chroming-default: borderless !default;
         */
        /**
         * {@ojinclude "name":"buttonsetCommonChroming"}
         *
         * @name chroming
         * @memberof oj.ojButtonsetMany
         * @instance
         * @type {string}
         * @ojvalue {string} "solid" Solid buttons stand out, and direct the user's attention to the most important actions in the UI. Note that this option is not supported in the Redwood theme.
         * @ojvalue {string} "outlined" Outlined buttons are salient, but lighter weight than solid buttons. Outlined buttons are useful for secondary actions.
         * @ojvalue {string} "borderless" Borderless buttons are the least prominent variation. Borderless buttons are useful for supplemental actions that require minimal emphasis.
         * @ojvalue {string} "full" Please use solid instead. In typical themes, full-chrome buttons always have chrome.
         * @ojvalue {string} "half" In typical themes, half-chrome buttons acquire chrome only in their hover, active, and selected states.
         * @ojshortdesc Indicates in what states the button has chrome (background and border).
         * @ojdeprecated [{target:'propertyValue', for:"half", since: "6.0.0", description: "This value will be removed in the future. Please use borderless instead."},
         *                {target:'propertyValue', for:"full", since: "6.0.0", description: "This value will be removed in the future. Please use solid instead."}]
         * @ojshortdesc Indicates in what states the buttonset has chrome (background and border).
         *
         * @example <caption>Initialize the Buttonset with the <code class="prettyprint">chroming</code> attribute specified:</caption>
         * &lt;oj-buttonset-many chroming='borderless'>&lt;/oj-buttonset-many>
         *
         * @example <caption>Get or set the <code class="prettyprint">chroming</code> property after initialization:</caption>
         * // getter
         * var chromingValue = myButtonset.chroming;
         *
         * // setter
         * myButtonset.chroming = 'borderless';
         *
         * @example <caption>Set the default in the theme (CSS) :</caption>
         * --oj-private-buttonset-global-chroming-default: borderless !default;
         */

        /**
         * <p>Indicates in what states the buttonset's buttons have chrome (background and border).
         *
         * <p>A buttonset's chroming must be set by setting this buttonset attribute (or setting the [chroming]{@link oj.ojToolbar#chroming} attribute
         * of a containing toolbar).
         *
         * <p>The default chroming varies by theme and containership as follows:
         * <ul>
         *   <li>If the buttonset is in a toolbar, then the default chroming is the current value of the toolbar's [chroming]{@link oj.ojToolbar#chroming} attribute.</li>
         *   <li>Else, the default chroming value is controlled by the theme.
         * </ul>
         *
         * <p>Once a value has been set on this buttonset attribute, that value applies regardless of theme and containership.
         *
         * @expose
         * @memberof oj.ojButtonset
         * @instance
         * @since 1.2.0
         * @ojfragment buttonsetCommonChroming
         */
        chroming: 'solid',

        /**
         * {@ojinclude "name":"buttonsetCommonDisplay"}
         *
         * @name display
         * @memberof oj.ojButtonsetOne
         * @instance
         * @type {string}
         * @ojvalue {string} "all" Display both the label and icons.
         * @ojvalue {string} "icons" Display only the icons.
         * @ojvalue {string} "label" Display only the label.
         * @default "all"
         * @ojshortdesc Specifies whether the buttonset displays label and icons, or just icons.
         *
         * @example <caption>Initialize the Buttonset with the <code class="prettyprint">display</code> attribute specified:</caption>
         * &lt;oj-buttonset-one display='icons'>&lt;/oj-buttonset-one>
         *
         * @example <caption>Get or set the <code class="prettyprint">display</code> property after initialization:</caption>
         * // getter
         * var displayValue = myButtonset.display;
         *
         * // setter
         * myButtonset.display = 'icons';
         */
        /**
         * {@ojinclude "name":"buttonsetCommonDisplay"}
         *
         * @name display
         * @memberof oj.ojButtonsetMany
         * @instance
         * @type {string}
         * @ojvalue {string} "all" Display both the label and icons.
         * @ojvalue {string} "icons" Display only the icons.
         * @ojvalue {string} "label" Display only the label.
         * @default "all"
         * @ojshortdesc Specifies whether the buttonset displays label and icons, or just icons.
         *
         * @example <caption>Initialize the Buttonset with the <code class="prettyprint">display</code> attribute specified:</caption>
         * &lt;oj-buttonset-many display='icons'>&lt;/oj-buttonset-many>
         *
         * @example <caption>Get or set the <code class="prettyprint">display</code> property after initialization:</caption>
         * // getter
         * var displayValue = myButtonset.display;
         *
         * // setter
         * myButtonset.display = 'icons';
         */
        /**
         * <p>Whether to display both the label and icons (<code class="prettyprint">"all"</code>)
         * or just the label (<code class="prettyprint">"label"</code>)
         * or just the icons (<code class="prettyprint">"icons"</code>) of the buttons.  In the latter case, the label is displayed in a tooltip instead.
         *
         * <p>The <code class="prettyprint">display</code> attribute will be ignored if no icons exist in the button.
         *
         * @expose
         * @memberof oj.ojButtonset
         * @instance
         * @ojfragment buttonsetCommonDisplay
         */
        display: 'all',

        /**
         * {@ojinclude "name":"buttonsetCommonDisabled"}
         *
         * @member
         * @name disabled
         * @memberof oj.ojButtonsetOne
         * @instance
         * @type {boolean}
         * @default false
         * @ojshortdesc Specifies that the buttonset element should be disabled.
         *
         * @example <caption>Initialize the Buttonset with the <code class="prettyprint">disabled</code> attribute specified:</caption>
         * &lt;oj-buttonset-one disabled='true'>&lt;/oj-buttonset-one>
         *
         * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
         * // getter
         * var disabledValue = myButtonset.disabled;
         *
         * // setter
         * myButtonset.disabled = true;
         */
        /**
         * {@ojinclude "name":"buttonsetCommonDisabled"}
         *
         * @member
         * @name disabled
         * @memberof oj.ojButtonsetMany
         * @instance
         * @type {boolean}
         * @default false
         * @ojshortdesc Specifies that the buttonset element should be disabled.
         *
         * @example <caption>Initialize the Buttonset with the <code class="prettyprint">disabled</code> attribute specified:</caption>
         * &lt;oj-buttonset-many disabled='true'>&lt;/oj-buttonset-many>
         *
         * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
         * // getter
         * var disabledValue = myButtonset.disabled;
         *
         * // setter
         * myButtonset.disabled = true;
         */
        /**
         * <p>Setting the Buttonset's <code class="prettyprint">disabled</code> attribute effectively disables all its Buttons, without affecting
         * their <code class="prettyprint">disabled</code> attributes.  Thus, a Button is effectively disabled if either its own
         * <code class="prettyprint">disabled</code> attribute is set, or the Buttonset's <code class="prettyprint">disabled</code> attribute is set.
         *
         * @member
         * @name disabled
         * @memberof oj.ojButtonset
         * @instance
         * @ojfragment buttonsetCommonDisabled
         */
        // disabled option declared in superclass, but we still want the above API doc

        // Consider getting rid of this option in the future.  Under his proposal (whose particulars we agreed needed to be ironed out),
        // rather than using this option to turn off Bset's handling, Bset would always handle arrow keys and preventDefault or stopPropagation.  Arrow
        // keys would no longer wrap around when reach end of Bset, in which case Bset would let the event bubble up to Toolbar (or to whoever if
        // not in a TB).  Any edge cases?  e.g. with tabstops, TB contents with special arrow-key behavior like inputTexts, etc.?
        /**
         * {@ojinclude "name":"buttonsetCommonFocusManagement"}
         *
         * @name focusManagement
         * @memberof oj.ojButtonsetOne
         * @instance
         * @type {string}
         * @ojvalue {string} "oneTabstop" Focus management is enabled.  The Buttonset is a single tabstop with arrow-key navigation.
         * @ojvalue {string} "none" Focus management is disabled, to avoid interfering with the focus management of a containing component.
         * @default "oneTabstop"
         * @ojshortdesc Should be set to none when the buttonset is placed within a toolbar.
         *
         * @example <caption>Initialize the Buttonset with the <code class="prettyprint">focusManagement</code> attribute specified:</caption>
         * &lt;oj-buttonset-one focus-management='none'>&lt;/oj-buttonset-one>
         *
         * @example <caption>Get or set the <code class="prettyprint">focusManagement</code> property after initialization:</caption>
         * // getter
         * var focusManagementValue = myButtonset.focusManagement;
         *
         * // setter
         * myButtonset.focusManagement = 'none';
         */
        /**
         * {@ojinclude "name":"buttonsetCommonFocusManagement"}
         *
         * @name focusManagement
         * @memberof oj.ojButtonsetMany
         * @instance
         * @type {string}
         * @ojvalue {string} "oneTabstop" Focus management is enabled.  The Buttonset is a single tabstop with arrow-key navigation.
         * @ojvalue {string} "none" Focus management is disabled, to avoid interfering with the focus management of a containing component.
         * @default "oneTabstop"
         * @ojshortdesc Should be set to none when the buttonset is placed within a toolbar.
         *
         * @example <caption>Initialize the Buttonset with the <code class="prettyprint">focusManagement</code> attribute specified:</caption>
         * &lt;oj-buttonset-many focus-management='none'>&lt;/oj-buttonset-many>
         *
         * @example <caption>Get or set the <code class="prettyprint">focusManagement</code> property after initialization:</caption>
         * // getter
         * var focusManagementValue = myButtonset.focusManagement;
         *
         * // setter
         * myButtonset.focusManagement = 'none';
         */
        /**
         * The <code class="prettyprint">focusManagement</code> attribute should be set to <code class="prettyprint">"none"</code> when the
         * Buttonset is placed in a [JET Toolbar]{@link oj.ojToolbar}.  This allows the Toolbar to manage the focus with no interference from the Buttonset,
         * so that arrow keys move within the entire Toolbar, not just within the Buttonset.
         *
         * @expose
         * @memberof oj.ojButtonset
         * @instance
         * @ojfragment buttonsetCommonFocusManagement
         */
        focusManagement: 'oneTabstop',

        /**
         * {@ojinclude "name":"buttonsetCommonLabelledBy"}
         *
         * @name labelledBy
         * @memberof oj.ojButtonsetOne
         * @public
         * @instance
         * @type {string|null}
         * @ojshortdesc Establishes a relationship between this component and another element, typically an oj-label custom element. See the Help documentation for more information.
         *
         * @example <caption>Get or set the <code class="prettyprint">labelledBy</code> property after initialization:</caption>
         * // getter
         * var labelId = myButtonset.labelledBy;
         *
         * // setter
         * myButtonset.labelledBy = "labelId";
         */
        /**
         * {@ojinclude "name":"buttonsetCommonLabelledBy"}
         *
         * @name labelledBy
         * @memberof oj.ojButtonsetMany
         * @public
         * @instance
         * @type {string|null}
         * @ojshortdesc Establishes a relationship between this component and another element, typically an oj-label custom element. See the Help documentation for more information.
         *
         * @example <caption>Get or set the <code class="prettyprint">labelledBy</code> property after initialization:</caption>
         * // getter
         * var labelId = myButtonset.labelledBy;
         *
         * // setter
         * myButtonset.labelledBy = "labelId";
         */
        /**
         * It is used to establish a relationship between this component and another element.
         * A common use is to tie the oj-label and the oj-buttonset together for accessibility.
         * The oj-label custom element has an id, and you use the labelled-by attribute
         * to tie the two components together to facilitate correct screen reader behavior.
         *
         * @expose
         * @memberof oj.ojButtonset
         * @instance
         * @ojfragment buttonsetCommonLabelledBy
         */
        labelledBy: null,

        /**
         * {@ojinclude "name":"buttonsetCommonDescribedBy"}
         *
         * @name describedBy
         * @memberof oj.ojButtonsetOne
         * @public
         * @instance
         * @type {?string}
         * @ojshortdesc buttonset's oj-label automatically sets described-by to make it accessible.
         * It is not meant to be set by application developer.
         *
         * @example <caption>Get or set the <code class="prettyprint">describedBy</code> property after initialization:</caption>
         * // getter
         * var descById = myComp.describedBy;
         *
         * // setter
         * myComp.describedBy = "someId";
         */
        /**
         * {@ojinclude "name":"buttonsetCommonDescribedBy"}
         *
         * @name describedBy
         * @memberof oj.ojButtonsetMany
         * @public
         * @instance
         * @type {?string}
         * @ojshortdesc buttonset's oj-label automatically sets described-by to make it accessible.
         * It is not meant to be set by application developer.
         *
         * @example <caption>Get or set the <code class="prettyprint">describedBy</code> property after initialization:</caption>
         * // getter
         * var descById = myComp.describedBy;
         *
         * // setter
         * myComp.describedBy = "someId";
         */
        /**
         * The oj-label sets the described-by attribute programmatically on the buttonset component.
         * This attribute is not meant to be set by an application developer directly.
         * The described-by is copied to the aria-describedby
         * attribute on the component's inner dom element, and it is needed
         * for accessibility.
         * @expose
         * @memberof oj.ojButtonset
         * @instance
         * @ojfragment buttonsetCommonDescribedBy
         */
        describedBy: null

        // Events
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
      _setCheckedOnDom: function (checked, $buttons) {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        var type = $.type(checked);
        var valid;
        var allCheckboxes;
        var elem = this.element[0];

        // whether buttonset contains exclusively checkboxes, therefore is buttonset many
        allCheckboxes =
          elem.tagName === 'OJ-BUTTONSET-MANY' ||
          ($buttons.length > 0 && $buttons.filter('input[type=checkbox]').length === $buttons.length);

        // requires an array in buttonset many case
        if (allCheckboxes && type !== 'array') {
          throw new Error("Invalid 'checked' value set on JET Buttonset: " + checked);
        }

        valid = this._setCheckedOnButtons(checked, $buttons, type, allCheckboxes);

        valid = valid || checked === null || checked === undefined;

        if (!valid && (!this._IsCustomElement() || $buttons.length === elem.children.length)) {
          throw new Error("Invalid 'checked' value set on JET Buttonset: " + checked);
        }
      },
      // does comparsion and sets checked on inputs
      // for custom elements it will accept objects as values on inputs and will get the value from oj option rather than the input
      // compares references first
      // if any references match it will not do object comparison
      // if there are no reference matches and it is custom element and it is an object or array containing at least one object do deep comparison on the objects
      _setCheckedOnButtons: function (checked, $buttons, type, isMany) {
        // loop once for reference comparison
        var checkedFoundCount = this._shallowCompare(checked, $buttons, isMany);

        // loop second for deep object comparison, supported in custom elements only, and only if no references were found in prior check
        if (this._shouldDeepCompare(checked, isMany, checkedFoundCount)) {
          checkedFoundCount = this._deepCompare(checked, $buttons, isMany, checkedFoundCount);
        }

        return isMany ? checkedFoundCount === checked.length : checkedFoundCount === 1;
      },

      // compares references and increments the match counter
      _shallowCompare: function (checked, $buttons, isMany) {
        var self = this;
        var checkedFoundCount = 0;
        $buttons.each(function () {
          // gets value off ojOption in custom element case
          var value = self._getInputValue(this);

          // if a buttonset many, checked is an array so do indexOf for reference comparison
          // if a buttonset one, check reference
          if (isMany ? checked.indexOf(value) > -1 : value === checked) {
            this.checked = true;
            checkedFoundCount += 1;
          } else {
            this.checked = false;
          }
        });
        return checkedFoundCount;
      },
      // checks if deep comparison needed
      // if buttonset many - deep compare if we have not found all of our values in the value array
      // if buttonset one -  deep compare if we did not find the value
      _shouldDeepCompare: function (checked, isMany, checkedFoundCount) {
        return isMany ? checkedFoundCount !== checked.length : !checkedFoundCount;
      },

      // compares objects deeply using
      _deepCompare: function (checked, $buttons, isMany, checkedFoundCount) {
        var resultCheckedFoundCount = checkedFoundCount;
        var self = this;
        $buttons.each(function () {
          // gets value off ojOption in custom element case
          var value = self._getInputValue(this);

          // if array loop over values and only compare objects
          if (isMany) {
            for (var i = 0; i < checked.length; i++) {
              // need to compare all types within many due to parsing
              if (self._deepCompareValues(value, checked[i])) {
                this.checked = true;
                resultCheckedFoundCount += 1;
              }
            }
          } else if (self._deepCompareValues(value, checked)) {
            this.checked = true;
            resultCheckedFoundCount += 1;
          }
        });
        return resultCheckedFoundCount;
      },

      // performs deep comparison using public method if available otherwise internal compareValues
      _deepCompareValues: function (value, checked) {
        // ojCompareValues is a custom comparator that returns 0 if the values are equal
        return $.type(value) === 'object' && value.ojCompareValues
          ? value.ojCompareValues(value, checked) === 0
          : oj.Object.compareValues(value, checked);
      },

      // gets value from ojOption in custom element case
      _getInputValue: function (input) {
        return this._IsCustomElement() ? this._getOjOptionFromInput(input).value : input.value;
      },

      // gets the oj option associated with an input
      _getOjOptionFromInput: function (input) {
        // oj option is first child of preceeding label
        return input.previousElementSibling.children[0];
      },

      // if all buttons are radios with same group, returns value attr of selected radio (string), or null if none selected
      // else if all buttons are checkboxes, returns non-null, possibly empty string array containing values of selected checkboxes
      // else returns undefined.  In the API we use null, not undefined, for this case, so callers should map undefined to null before setting on DOM.
      // NOTE: Called from _InitOptions, so very limited component state is available!
      _getCheckedFromDom: function ($buttons) {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        var checked;
        var isRadio = null;
        var name = null;
        var self = this;

        $buttons.each(function () {
          // at this point, all previous buttons, if any, were all radios in same group, or were all checkboxes
          var tagName = this.tagName.toLowerCase();
          if (tagName !== 'input') {
            checked = undefined;
            return false; // stop iterating
          }

          var currentType = this.type.toLowerCase();
          var currentIsRadio;
          var currentName;

          if (currentType === 'radio') {
            currentIsRadio = true;
            currentName = this.name.toLowerCase();
          } else if (currentType === 'checkbox') {
            currentIsRadio = false;
            currentName = null;
          } else {
            checked = undefined;
            return false; // stop iterating
          }

          // at this point, current button is input of type radio or checkbox

          // If this is not the first button, then bail if:
          // - this is a radio and previous were checkboxes or vice versa
          // - this is a radio in a different group than previous ones, which can happen
          //   if the group names are different, or if the names are all "", in which
          //   case each radio is in a separate radio group.
          if (
            checked !== undefined && // must be !== not !=
            (currentIsRadio !== isRadio || currentName !== name || (isRadio && !name))
          ) {
            checked = undefined;
            return false; // stop iterating
          }

          // at this point, all buttons so far including this one are either all radios in same group, or are all checkboxes

          var value = self._getInputValue(this);
          if (checked === undefined) {
            // this is first button
            if (currentIsRadio) {
              if (this.checked) {
                checked = value;
              } else {
                checked = null;
              }
            } else if (this.checked) {
              checked = [value];
            } else {
              checked = [];
            }
            isRadio = currentIsRadio;
            name = currentName;
          } else if (this.checked) {
            if (isRadio) {
              checked = value;
            } else {
              checked.push(value);
            }
          } // else not first button and not checked, so leave "checked" at whatever value we set on previous iteration
          return undefined;
        });

        return checked;
      },

      _CompareOptionValues: function (option, value1, value2) {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        if (option === 'checked') {
          // handle null, string, and (rare) identically equal arrays
          if (value1 === value2) {
            return true;
          }
          return (
            $.type(value1) === 'array' &&
            $.type(value2) === 'array' &&
            this._compareArraysAsSets(value1, value2)
          );
        }

        return this._superApply(arguments);
      },

      // Params must be arrays.  Returns true iff the arrays have the same set of elements regardless of order.
      _compareArraysAsSets: function (first, second) {
        return (
          !first.some(function (elem) {
            return second.indexOf(elem) < 0;
          }) &&
          !second.some(function (elem) {
            return first.indexOf(elem) < 0;
          })
        );
      },

      // remove non oj-options from DOM
      _removeNonOjOptions: function () {
        this.element.children(':not(oj-option)').remove();
      },

      // Add the custom option renderer to all oj options
      _processOjOptions: function () {
        var self = this;
        var ojOptions = this.element[0].querySelectorAll('oj-option');

        $.each(ojOptions, function (i, option) {
          // eslint-disable-next-line no-param-reassign
          option.customOptionRenderer = self._customOptionRenderer.bind(self);
        });
      },

      // Call render on all the oj options directly
      _customOptionRenderer: function (option) {
        this._removeOptionDecoration(option);
        this._addOptionDecoration(option);
      },

      // Wrap the oj option in a label and add an input as a sibling
      _addOptionDecoration: function (option) {
        // add classes to slots and wrap text if applicable
        this._addOptionClasses(option);

        // is the buttonset one or many
        var isOne = this.element[0].tagName === 'OJ-BUTTONSET-ONE';
        var type = isOne ? 'radio' : 'checkbox';

        // get values from the oj option to set on the input
        var value = option.value;
        var disabled = option.disabled;

        // create label/input to decorate oj option
        var input = document.createElement('input');
        var label = document.createElement('label');

        // input needs an id so label can set the for attribute
        $(input).uniqueId();
        input.value = value;
        input.type = type;
        input.disabled = disabled;

        // set the label for attribute
        var id = input.id;
        label.htmlFor = id;

        // if a radio buttonset need a uniform name, create one using the first input id
        if (isOne) {
          if (!this._name) {
            this._name = '_n_' + id;
          }
          input.name = this._name;
        }

        // rearrange the dom
        option.parentNode.insertBefore(label, option); // @HTMLUpdateOK
        label.appendChild(option); // @HTMLUpdateOK
        label.parentNode.insertBefore(input, label.nextElementSibling); // @HTMLUpdateOK

        // reset buttonset group properties
        this._setup(false);
        this._setCheckedOnDom(this.options.checked, this.$buttons); // throws if checked option invalid
        this.$buttons.each(function () {
          $(this).data('oj-ojButton')._applyCheckedStateFromDom(false);
        });
      },

      // remove the dom that we generated excluding the wrapped span
      // destroy the button and leave just what was originally there
      _removeOptionDecoration: function (option) {
        var parentLabel = option.parentNode;

        if (parentLabel.tagName === 'LABEL') {
          this._removeOptionClasses(option);

          var input = $(parentLabel).siblings('.oj-button-input');

          input.ojButton('destroy');

          input.removeUniqueId();

          input.remove();
          parentLabel.parentNode.insertBefore(option, parentLabel); // @HTMLUpdateOK
          parentLabel.parentNode.removeChild(parentLabel);
        }
      },

      // add needed CSS Classes to slots and wrap the text spans
      _addOptionClasses: function (option) {
        var slotMap = ojcustomelementUtils.CustomElementUtils.getSlotMap(option);
        var text = slotMap[''] ? slotMap[''] : null;
        var startIcon = slotMap.startIcon ? slotMap.startIcon[0] : null;
        var endIcon = slotMap.endIcon ? slotMap.endIcon[0] : null;

        if (startIcon) {
          startIcon.classList.add('oj-button-icon');
          startIcon.classList.add('oj-start');
        }

        if (text) {
          for (var i = 0; i < text.length; i++) {
            var currentText = text[i];
            var wrapperSpan = currentText;
            if (currentText.nodeType === 3) {
              wrapperSpan = document.createElement('span');
              currentText.parentNode.insertBefore(wrapperSpan, currentText); // @HTMLUpdateOK
              wrapperSpan.appendChild(currentText); // @HTMLUpdateOK
            }

            wrapperSpan.classList.add('oj-button-text');
          }
        }

        if (endIcon) {
          endIcon.classList.add('oj-button-icon');
          endIcon.classList.add('oj-end');
        }
      },

      // remove needed CSS Classes to slots
      _removeOptionClasses: function (option) {
        var slotMap = ojcustomelementUtils.CustomElementUtils.getSlotMap(option);
        var text = slotMap[''] ? slotMap[''] : null;
        var startIcon = slotMap.startIcon ? slotMap.startIcon[0] : null;
        var endIcon = slotMap.endIcon ? slotMap.endIcon[0] : null;

        if (startIcon) {
          startIcon.classList.remove('oj-button-icon');
          startIcon.classList.remove('oj-start');
        }

        if (text) {
          for (var i = 0; i < text.length; i++) {
            text[i].classList.remove('oj-button-text');
          }
        }

        if (endIcon) {
          endIcon.classList.remove('oj-button-icon');
          endIcon.classList.remove('oj-end');
        }
      },

      _InitOptions: function (originalDefaults, constructorOptions) {
        this._super(originalDefaults, constructorOptions);

        this.$buttons = this.element.find(this._items);

        // At create time, checked can be set via either option or DOM, i.e. the "checked" properties of the buttons.
        // If app set the option, then that wins over the DOM, in which case _ComponentCreate() will later set that value on the DOM.
        // Else DOM wins, in which case we set the option from the DOM here, with any remaining tasks done later in _ComponentCreate().

        if (!('checked' in constructorOptions)) {
          // if app didn't set option, then set the option from the DOM
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
          if ($.type(checked) === 'array' || this.element[0].tagName === 'OJ-BUTTONSET-MANY') {
            this.options.checked = [];
          }

          if (checked !== undefined) {
            this.option('checked', checked, { _context: { internalSet: true } }); // writeback not needed since "not in constructorOptions" means "not bound"
          }
        }
      },

      _ComponentCreate: function () {
        this._super();

        var elem = this.element[0];
        elem.setAttribute(Components._OJ_CONTAINER_ATTR, this.widgetName); // @HTMLUpdateOK
        elem.classList.add('oj-buttonset');
        elem.classList.add('oj-component');
        this._setRole(this.options.focusManagement);

        if (this._IsCustomElement()) {
          this._removeNonOjOptions();
          this._processOjOptions();
        }

        this._setup(true);
      },

      _NotifyContextMenuGesture: function (menu, event, eventType) {
        // Set launcher to the current tabbable button
        // For toggle buttons, launcher must be the hidden focusable input, but for Shift-F10 we want the CM aligned to the Button's root element, not that
        // hidden input.  This is no change from the default for push buttons, since in that case the root element and launcher (input) are the same.
        var currentButton = this.element.find(':oj-button[tabindex=0]');
        this._OpenContextMenu(event, eventType, {
          launcher: currentButton,
          position: { of: eventType === 'keyboard' ? currentButton.ojButton('widget') : event }
        });
      },

      _propagateDisabled: function (disabled) {
        var _disabled = !!disabled;
        this.$buttons.each(function () {
          $(this).data('oj-ojButton').__setAncestorComponentDisabled(_disabled);
        });
      },

      _setRole: function (focusManagement) {
        var elem = this.element[0];
        if (focusManagement === 'oneTabstop') {
          elem.setAttribute('role', 'toolbar');
        } else {
          elem.removeAttribute('role');
        }
      },

      // eslint-disable-next-line no-unused-vars
      _setOption: function (key, value, flags) {
        // Override of protected base class method.  Method name needn't be quoted since is in externs.js.
        var oldValue = this.options[key];

        // previously called super at end, so that optionChange (fired at end of super) is fired at very end, but now must call at start, so that
        // when the chroming case calls Button.refreshrefresh(), callee sees the new value of the option.
        this._superApply(arguments);

        if (key === 'disabled') {
          this._propagateDisabled(value);
          this._refreshTabStop();

          // Legacy code for widgets.  Toolbar custom element will listen for property change event on buttons.
          if (!this._IsCustomElement()) {
            // If this button is inside a toolbar, the toolbar needs to be refreshed for new disabled setting
            var $toolbarElem = $(this.element).closest('.oj-toolbar');
            if ($toolbarElem.length) {
              $toolbarElem.ojToolbar('refresh');
            }
          }
        } else if (key === 'checked') {
          // This "checked" block should run only if app called option(), but not if called because user clicked button,
          // since in the latter case, we know we passed a valid non-undefined value, and DOM is already up to date.
          // Fortunately, this is guaranteed, since _setOption is no longer called in the latter case.
          this._setCheckedOnDom(value, this.$buttons); // throws if checked option invalid

          // Set oj-selected on all buttons' DOM:
          this.$buttons.each(function () {
            $(this).data('oj-ojButton')._applyCheckedStateFromDom(false);
          });
        } else if (key === 'focusManagement') {
          this._setRole(value);
        } else if (key === 'chroming') {
          _setChromingClass(this.element[0], value);

          // refresh the buttons to make them re-fetch their chroming option, in case it's still set to the default dynamic getter,
          // which takes its value from the containing buttonset or toolbar if present.
          // TBD: Consider only calling refresh() on children that haven't had their chroming option set, i.e. those still using the dynamic getter.
          this.$buttons.ojButton('refresh');
        } else if (key === 'display') {
          this.$buttons.ojButton('option', key, value);
        } else if (key === 'labelledBy') {
          var $elem = this.element;
          this._labelledByUpdatedForSet($elem[0].id, oldValue, value, $elem);
        } else if (key === 'describedBy') {
          // This sets the aria-describedby on the correct dom node
          this._describedByUpdated(oldValue, value);
        }
      },

      // TODO: JSDoc says: "refresh() is required ... after a change to the disabled status of any of the buttons in the buttonset."  Instead, shouldn't
      // Button._setOption("disabled") look for a containing Buttonset and do the necessary housekeeping?
      // @inheritdoc
      refresh: function () {
        // Override of public base class method (unlike JQUI).  Method name needn't be quoted since is in externs.js.
        this._super();

        // Should not need to call refresh on oj-options. If the content of an oj-option is modified then
        // app should call refresh on the option not the container and that should trigger a re-render
        // only need to add custom renderer for case where something is added that the buttonset did not
        // know about before
        if (this._IsCustomElement()) {
          this._processOjOptions();
        }

        // Call this after _super(), which updates the list of containers (toolbar) that the buttonset is in, which must be updated
        // when _setup calls the chroming option getter.
        this._setup(false);
      },

      _setup: function (isCreate) {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        var self = this;
        var elem = this.element[0];
        this.isRtl = this._GetReadingDirection() === 'rtl';
        _setChromingClass(elem, this.options.chroming);

        if (isCreate && !this.initCheckedFromDom && !this._IsCustomElement()) {
          // if app provided a "checked" option, it wins over whatever's in the DOM.
          this._setCheckedOnDom(this.options.checked, this.$buttons); // throws if checked option invalid

          // At create time, whether set from DOM or option, checked option and checked props are now in synch, so we just need to
          // set .oj-selected on each button.  This is done below by either the _applyCheckedStateFromDom()
          // call (for existing buttons) or the initializer call (for new buttons).
        }

        if (!isCreate) {
          // it's refresh time.
          // If the DOM's checked state is out of synch with the checked option, it's either because
          // the app directly set the "checked" attr of an existing Button in the Buttonset, which we don't support (they should
          // have used the component API instead), or the set of buttons in the set has changed (possibly because a KO foreach
          // binding added/removed buttons).  In the latter case, we require that the app update the "checked" option, by setting
          // the bound observable (if present) or calling option() (otherwise).

          this.$buttons = this.element.find(this._items); // only needed at refresh time, since at create time this was already done in _InitOptions()
        }

        // buttonset styling should only be applied if this is a multi-button buttonset.  When a single button is wrapped in a buttonset, that's an implementation
        // detail to get the "checked" option; users still see it as a standalone button, and it should be themed as such.
        if (this.$buttons.length > 1) {
          elem.classList.add('oj-buttonset-multi');
        } else {
          elem.classList.remove('oj-buttonset-multi');
        }

        this.$buttons
          // refresh any buttons underneath us that already exist, like JQUI does
          // TBD:  Now that Bset has a checked option, the recursive refreshing of the Bset's buttons is necessary in more cases than before.
          //   Review whether it's still desirable to add a refresh() param that would allow turning off this recursive
          //   refreshing.  That was previously approved, but changing the default (compared to JQUI) was not approved.
          //   The refresh param wouldn't help for creates; for that we'd need to add a Buttonset option.
          //   See also _destroy() code comment.
          .filter(':oj-button')
          .ojButton('refresh')
          .each(function () {
            $(this).data('oj-ojButton')._applyCheckedStateFromDom(false); // set .oj-selected
          })
          .end()

          // Create buttons underneath us
          .not(':oj-button')
          .ojButton({ display: this.options.display }) // sets .oj-selected
          .end();

        // Update rounded corners, etc.
        for (var i = 0, len = this.$buttons.length; i < len; i++) {
          var btn = this.$buttons.eq(i).ojButton('widget')[0];
          btn.classList.remove('oj-buttonset-first');
          btn.classList.remove('oj-buttonset-last');
          if (i === 0) {
            btn.classList.add('oj-buttonset-first');
          } else if (i === len - 1) {
            btn.classList.add('oj-buttonset-last');
          }
        }

        // Must do this after creating the buttons above since callee calls Button API.
        // Must do this before the focus mgmt code, which needs to know which buttons are effectively disabled.
        // Must do this at refresh time, not just create time, in case new buttons were added to the Bset (whether
        // reparented or created e.g. by KO foreach).
        this._propagateDisabled(this.options.disabled);

        if (this.options.focusManagement === 'oneTabstop') {
          // When buttonset is binding listeners to buttons, use the Buttonset's eventNamespace, not the Button's
          // eventNamespace, to facilitate later unbinding only the Buttonset listeners.

          // For checkbox/radio, we're binding to inputs, not labels.

          // Put listeners on every button, b/c it's too unreliable to put them on the buttonset node and rely on event bubbling.
          // - E.g. bubbling doesn't work for antonym buttons (is this still true after the refactoring?) -- see comment on Button._setLabelOption().
          // - Likewise, focus mgmt can't just break if app listener stops propagation.
          // - Both of these problems still happen when using the delegation / selector overload of .on(); there is no special JQ bubbling magic.

          this.$buttons
            .unbind('keydown' + this.eventNamespace)
            .bind('keydown' + this.eventNamespace, function (event) {
              self._handleKeyDown(event, $(this));
            })

            .unbind('click' + this.eventNamespace)
            .bind('click' + this.eventNamespace, function () {
              if (!$(this).data('oj-ojButton')._IsEffectivelyDisabled()) {
                // Normally the button will be tabbable after the click, since (a) if we reach here, the clicked button is enabled, and
                // (b) an unchecked radio before the click will normally be checked after the click.  But just in case it's unchecked
                // (e.g. due to app listener), we let callee run it thru _mapToTabbable() before using, as usual.
                self._setTabStop($(this));
              }
            })
            .unbind('focus' + this.eventNamespace)
            .bind('focus' + this.eventNamespace, function () {
              self._setTabStop($(this));
            });

          // the subset of Buttonset buttons that are enabled.  Effectively disabled buttons are not tabbable.
          this.$enabledButtons = this.$buttons.filter(function () {
            return !$(this).data('oj-ojButton')._IsEffectivelyDisabled();
          });

          this._initTabindexes(isCreate);
        }

        // since oj-label depends on oj-buttonset having an ID, check if the element has an id
        // and if not it will be generated and set on the oj-buttonset
        this.element.uniqueId();

        // copy labelledBy to aria-labelledBy
        this._labelledByUpdatedForSet(elem.id, null, this.options.labelledBy, this.element);

        // set describedby on the element as aria-describedby
        var describedBy = this.options.describedBy;

        if (describedBy) {
          this._describedByUpdated(describedBy);
        }
      },

      /**
       * If custom element, get the labelledBy option, and set this
       * onto the root dom element as aria-labelledby. We append "|label" so it matches the id that
       * is on the oj-label's label element.
       * @memberof oj.ojButtonset
       * @instance
       * @private
       */
      _labelledByUpdatedForSet: LabelledByUtils._labelledByUpdatedForSet,

      /**
       * When describedBy changes, we need to update the aria-described attribute.
       * @memberof oj.ojButtonset
       * @instance
       * @private
       */
      _describedByUpdated: LabelledByUtils._describedByUpdated,

      /**
       * Returns a jquery object of the elements representing the
       * content nodes (oj-option). This is used in LabelledByUtils to add
       * aria-describedby to the oj-option when there is a help icon
       * @protected
       * @override
       * @memberof oj.ojButtonset
       */
      _GetContentElement: function () {
        if (this.$buttons != null) {
          return this.$buttons;
        }

        this.$buttons = this.element.find(this._items);
        return this.$buttons;
      },

      // Update the current tabStop after _setOption("disabled")
      // Prereq: _propagateDisabled() must be called before this refresh
      _refreshTabStop: function () {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        if (this.options.focusManagement === 'oneTabstop') {
          // the subset of Buttonset buttons that are enabled.  Effectively disabled buttons are not tabbable.
          this.$enabledButtons = this.$buttons.filter(function () {
            return !$(this).data('oj-ojButton')._IsEffectivelyDisabled();
          });

          this._initTabindexes(false); // call initTabindexes in refresh mode
        }
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
        this.$buttons.attr('tabindex', '0');

        var $newTabStop; // callee might map this to radio groupmate

        // TBD: for refreshes when $last is an effectively disabled radio with a checked enabled groupmate and they are in the buttonset, the groupmate would be
        // a valid tabstop, but this defaults to the first.
        if (isCreate || !$last.is(this.$enabledButtons)) {
          // is create, or is refresh but must treat like create b/c $last is empty, or not enabled, or no longer in the buttonset
          $newTabStop = this.$enabledButtons.first(); // if empty (none enabled), no tabstop will be set
        } else {
          // is a refresh, and $last is non-empty and is an enabled button still in the buttonset.  May be a radio whose groupmate
          // has become checked, in which case callee will map it to that groupmate.
          $newTabStop = $last;
        }
        this._setTabStop($newTabStop);
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
      _mapToTabbable: function ($button) {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        var $enabledButtons = this.$enabledButtons;
        return $button.map(function (index, elem) {
          // Buttons other than radios, and checked radios, are always tabbable if they're enabled, which this method requires.
          // Radios w/ name="" (incl name omitted) are not in a radio group, not even with other radios with w/ name="".  Radios
          // with no groupmates are always tabbable, since either they're checked, or they're unchecked with no checked groupmate.
          if (elem.type !== 'radio' || elem.checked || elem.name === '') {
            return elem;
          }

          // elem is unchecked radio in real (not "") group, which is tabbable iff no groupmate is checked.  Per above doc, we know that
          // all of its potentially checked groupmates are in $enabledButtons.
          var $checkedRadio = _radioGroup(elem, $enabledButtons).filter(':checked');
          return $checkedRadio.length ? $checkedRadio[0] : elem;
        });
      },

      // Set which button is in the tab sequence.
      // $button should contain 0 or 1 button to be made tabbable (since at most one should be tabbable at a time).
      //   If 0 (i.e. no enabled buttons), all will become untabbable.  If 1, it must be tabbable in every way (e.g. enabled) except possibly
      //   being an unchecked radio with a checked groupmate, which this method will map to its checked groupmate, which
      //   we know is enabled thus tabbable since we require that checked radios with enabled groupmates not be disabled.
      // No return value.
      _setTabStop: function ($button) {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        //        if (!window.setTabStopCounter) window.setTabStopCounter=1; // REMOVE, is only for console.log's
        //        console.log("in _setTabStop: " + window.setTabStopCounter++ + ".  Orig (premap) button checked: " + $button[0].checked); // + " and is:");
        //        console.log($button[0]);

        // eslint-disable-next-line no-param-reassign
        $button = this._mapToTabbable($button);
        var button = $button[0]; // button is undefined iff $button is empty iff we need to clear all tabstops b/c there are no enabled buttons to make tabbable
        var last = this._lastTabStop; // last is undefined iff $(last) is empty iff there are no existing tabstops to clear (b/c _initTabindexes just ran
        // or previously there were no enabled buttons to make tabbable)

        //        console.log("mapped button and last button are:");  console.log(button);  console.log(last);  console.log(".");

        // Cases: both are undefined: have no tabstops; want to keep it that way (b/c none enabled), so do nothing
        //        both are node X: X is the tabstop; want to keep it that way, so do nothing
        //        last is node X; button is undefined: X is the tabstop; want to clear it w/o replacing it (b/c none enabled).  This logic does that.
        //        last is undefined; button is node X: no existing tabstop; want to make X the tabstop.  This logic does that.
        //        last is node X; button is node Y: X is the tabstop; want to clear it and make Y the tabstop.  This logic does that.
        if (button !== last) {
          // console.log("setting tab stop to " + $button.attr("id"));  console.log("$(last).length:");  console.log($(last).length);
          if ($button[0]) {
            $button[0].setAttribute('tabindex', '0'); // no-op iff $button is empty iff (see comment above)
          }
          this._lastTabStop = button;
        }
      },

      // No return value.
      _handleKeyDown: function (event, $button) {
        // Private, not an override (not in base class).  Method name unquoted so will be safely optimized (renamed) by GCC as desired.
        switch (event.which) {
          case $.ui.keyCode.UP: // up arrow
          case $.ui.keyCode.DOWN: // down arrow
            if ($button[0].getAttribute('type') !== 'radio') {
              break;
            }
          // fall thru for radio only.  See comments below.
          // eslint-disable-next-line no-fallthrough
          case $.ui.keyCode.LEFT: // left arrow
          case $.ui.keyCode.RIGHT: // right arrow
            event.preventDefault();

            var $enabledButtons = this.$enabledButtons;
            var length = $enabledButtons.length;
            if (length < 2) {
              // nowhere to navigate to; currently focused button is the only enabled one in buttonset
              break;
            }

            var oldIndex = $enabledButtons.index($button);
            var increment =
              event.which === $.ui.keyCode.DOWN || (event.which === $.ui.keyCode.RIGHT) !== this.isRtl
                ? 1
                : -1;
            var newIndex = (oldIndex + increment + length) % length; // wrap around if at start/end of buttonset

            // When radios are inside an element with role=toolbar, WAI-ARIA doesn't specify how to reconcile its recommended
            // Toolbar behavior (left/right arrows move focus w/o selecting) and radio behavior (all 4 arrow keys both move focus
            // and check/select that radio).  A11y office recommended treating radios in a Buttonset or Toolbar like other buttons:
            // Arrow moves focus without selecting, Spacebar selects, which we prefer too.
            // Previously we did that for only left/right arrows, and disabled up/down arrows, but since both native and WAI-ARIA-
            // compliant radios support up/down arrows, and since JAWS automatically instructs the user to use up/down arrows even
            // when the radio group is inside a role=toolbar, we now support up/down arrows for radios via the fall-thru above
            // (but still focus only, not select).
            $enabledButtons.eq(newIndex).focus();
            break;

          // Don't need Space/Enter handlers.  For all buttons except already-checked radios in some browsers, Space/Enter fire a click event
          // (natively or manually), which already calls _setTabStop.  For checked radios (which are focused if they're getting
          // this key event), _setTabStop has already been called for whichever happened 2nd:  focus (an already checked radio) or
          // check (an already focused radio) via click/Space/Enter.  We don't support programmatically checking the button; it must
          // be done via the "checked" option.
          default:
            break;
        }
      },

      _destroy: function () {
        // Override of protected base class method.  Method name needn't be quoted since is in externs.js.
        var elem = this.element[0];
        _removeClasses(elem, 'oj-buttonset oj-component ' + CHROMING_CLASSES);
        elem.removeAttribute(Components._OJ_CONTAINER_ATTR);
        elem.removeAttribute('role');

        if (this.options.focusManagement === 'oneTabstop') {
          this.$buttons.attr('tabindex', '0');
        }

        this.$buttons
          .map(function () {
            return $(this).ojButton('widget')[0];
          })
          // do .removeClass outside the filter in case button has been destroyed but still has these Buttonset styles on it.
          // TBD: if this has definitely been taken care of already for destroyed buttons, then move inside filter.
          .removeClass('oj-buttonset-first oj-buttonset-last')
          .end()

          // Recursively destroy Bset's buttons like JQUI.
          // TBD: The recursive destroy makes it impossible to ungroup the buttons if desired, i.e. destroy the Buttonset without destroying its buttons.
          //   As discussed in _setup() code comment, it was approved to add refresh() and/or destroy() params that would allow turning off
          //   the recursive behavior, but changing the default (compared to JQUI) was not approved.
          //   When not destroying the buttons, must instead restore the buttons to a not-in-buttonset state, i.e. remove Bset stuff, restore any
          //   Button stuff we removed, etc.
          .ojButton('destroy');
      }
    });

    // SECURITY NOTE: To avoid injection attacks, do NOT compute the class via string concatenation, i.e. don't do "oj-button-" + chroming + "-chrome"
    function _setChromingClass(elem, chroming) {
      _removeClasses(elem, CHROMING_CLASSES);
      elem.classList.add(_chromingMap[chroming]);
    }

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
     * @private
     */
    function _radioGroup(radio, $elems) {
      var name = radio.name;
      var form = radio.form;
      var $radios;

      if (name) {
        name = name.replace(/'/g, "\\'"); // escape single quotes
        var selector = ":radio[name='" + name + "']:oj-button";
        if ($elems) {
          $radios = $elems.filter(selector);
        } else if (form) {
          $radios = $(form).find(selector);
        } else {
          $radios = $(selector, radio.ownerDocument).filter(function () {
            return !this.form;
          });
        }
      } else {
        $radios = ($elems ? $elems.filter(radio) : $(radio)).filter(':oj-button');
      }
      return $radios;
    }

    // searches actualContainers array for each elem of interestingContainers in order, until one is found,
    // walks up the tree to find that container, and returns its widget constructor.  Returns null if no containers found.
    function _findContainer(element, actualContainers, interestingContainers) {
      for (var i = 0; i < interestingContainers.length; ++i) {
        var containerName = interestingContainers[i];
        if (actualContainers.indexOf(containerName) >= 0) {
          // walk up parents until find the container
          // eslint-disable-next-line no-param-reassign
          for (; ; element = element.parentNode) {
            var func = Components.__GetWidgetConstructor(element, containerName);
            if (func) {
              return func;
            }
          }
        }
      }
      return null;
    }

    function _getChromingDefault(componentName, element, actualContainers) {
      var containerConstructor = _findContainer(
        element,
        actualContainers,
        _interestingContainers[componentName]
      );
      // If the component is in an interesting container (buttonset or toolbar), then the default chroming is the current value of the chroming option of the nearest such container.
      if (containerConstructor) {
        return containerConstructor('option', 'chroming');
      }
      // Else, if $___ChromingOptionDefault is set in the current theme, then this expr returns that value for use as the chroming default.
      // Else, returns undefined, so that the prototype default is used.
      return ThemeUtils.getCachedCSSVarValues([
        '--oj-private-' + componentName + '-global-chroming-default'
      ])[0];
    }

    function _addClasses(elem, classes) {
      var oldClasses = elem.className;
      if (oldClasses) {
        var oldClassArray = oldClasses.split(' ');
        var newClassArray = classes.split(' ');
        for (var i = newClassArray.length; i >= 0; i--) {
          if (oldClassArray.indexOf(newClassArray[i]) >= 0) {
            newClassArray.splice(i, 1);
          }
        }
        if (newClassArray.length > 0) {
          // eslint-disable-next-line no-param-reassign
          elem.className = oldClasses + ' ' + newClassArray.join(' ');
        }
      } else {
        // eslint-disable-next-line no-param-reassign
        elem.className = classes;
      }
    }

    function _removeClasses(elem, classes) {
      var oldClasses = elem.className;
      if (oldClasses) {
        var oldClassArray = oldClasses.split(' ');
        var removeClassArray = classes.split(' ');
        var changed = false;
        for (var i = 0; i < removeClassArray.length; i++) {
          var idx = oldClassArray.indexOf(removeClassArray[i]);
          if (idx >= 0) {
            oldClassArray.splice(idx, 1);
            changed = true;
          }
        }
        if (changed) {
          // eslint-disable-next-line no-param-reassign
          elem.className = oldClassArray.join(' ');
        }
      }
    }

    // Set theme-based defaults
    Components.setDefaultOptions({
      ojButton: {
        chroming: Components.createDynamicPropertyGetter(function (context) {
          return _getChromingDefault('button', context.element, context.containers);
        })
      },
      ojButtonset: {
        chroming: Components.createDynamicPropertyGetter(function (context) {
          return _getChromingDefault('buttonset', context.element, context.containers);
        })
      }
    });
  })(); // end of Button / Buttonset wrapper function

});
