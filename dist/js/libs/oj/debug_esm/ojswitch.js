/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import 'ojs/ojcore';
import { EditableValueUtils } from 'ojs/ojeditablevalue';
import oj from 'ojs/ojcore-base';
import $ from 'jquery';
import { isAncestorOrSelf, unwrap, recentTouchEnd } from 'ojs/ojdomutils';
import FocusUtils from 'ojs/ojfocusutils';

(function () {
var __oj_switch_metadata = 
{
  "properties": {
    "describedBy": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "displayOptions": {
      "type": "object",
      "properties": {
        "converterHint": {
          "type": "Array<string>|string"
        },
        "helpInstruction": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        },
        "messages": {
          "type": "Array<string>|string"
        },
        "validatorHint": {
          "type": "Array<string>|string"
        }
      }
    },
    "help": {
      "type": "object",
      "properties": {
        "instruction": {
          "type": "string",
          "value": ""
        }
      }
    },
    "helpHints": {
      "type": "object",
      "properties": {
        "definition": {
          "type": "string",
          "value": ""
        },
        "source": {
          "type": "string",
          "value": ""
        }
      }
    },
    "labelEdge": {
      "type": "string",
      "enumValues": [
        "inside",
        "none",
        "provided"
      ]
    },
    "labelHint": {
      "type": "string",
      "value": ""
    },
    "labelledBy": {
      "type": "string"
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "readonly": {
      "type": "boolean",
      "value": false
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "switchOff": {
          "type": "string"
        },
        "switchOn": {
          "type": "string"
        }
      }
    },
    "userAssistanceDensity": {
      "type": "string",
      "enumValues": [
        "compact",
        "efficient",
        "reflow"
      ],
      "value": "reflow"
    },
    "valid": {
      "type": "string",
      "writeback": true,
      "enumValues": [
        "invalidHidden",
        "invalidShown",
        "pending",
        "valid"
      ],
      "readOnly": true
    },
    "value": {
      "type": "boolean",
      "writeback": true,
      "value": false
    }
  },
  "methods": {
    "getProperty": {},
    "refresh": {},
    "reset": {},
    "setProperties": {},
    "setProperty": {},
    "showMessages": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateEnd": {},
    "ojAnimateStart": {}
  },
  "extension": {}
};
  __oj_switch_metadata.extension._WIDGET_NAME = 'ojSwitch';
  __oj_switch_metadata.extension._INNER_ELEM = 'input';
  __oj_switch_metadata.extension._ALIASED_PROPS = { readonly: 'readOnly' };
  __oj_switch_metadata.extension._GLOBAL_TRANSFER_ATTRS = ['tabindex'];
  oj.CustomElementBridge.register('oj-switch', {
    metadata: oj.CollectionUtils.mergeDeep(__oj_switch_metadata, {
      properties: {
        readonly: {
          binding: { consume: { name: 'readonly' } }
        },
        userAssistanceDensity: {
          binding: { consume: { name: 'userAssistanceDensity' } }
        },
        labelEdge: {
          binding: { consume: { name: 'labelEdge' } }
        }
      }
    })
  });
})();

const OJ_SWITCH_THUMB = 'oj-switch-thumb';
const OJ_SWITCH_TRACK = 'oj-switch-track';
const ARIA_LABEL = 'aria-label';
const ARIA_DISABLED = 'aria-disabled';

(function () {
  /*!
   * JET Switch @VERSION
   */
  /**
   * @ojcomponent oj.ojSwitch
   * @ojdisplayname Switch
   * @augments oj.editableValue
   * @ojimportmembers oj.ojDisplayOptions
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojSwitch extends editableValue<boolean, ojSwitchSettableProperties>"
   *               },
   *               {
   *                target: "Type",
   *                value: "ojSwitchSettableProperties extends editableValueSettableProperties<boolean>",
   *                for: "SettableProperties"
   *               }
   *              ]
   * @since 0.7.0
   * @ojshortdesc A switch toggles between two mutually exclusive states — on and off.
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "disabled", "readonly"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["value"]}
   * @ojvbdefaultcolumns 6
   * @ojvbmincolumns 2
   *
   * @ojoracleicon 'oj-ux-ico-switch-on'
   * @ojuxspecs ['switch']
   *
   * @classdesc
   * <p>
   * The oj-switch component enhances <code class="prettyprint">input</code>
   * element and manages the selection of Boolean values.
   * </p>
   * {@ojinclude "name":"validationAndMessagingDoc"}
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
   * <p>
   * The component is accessible; it sets and maintains the appropriate aria- attributes,
   * like aria-checked and aria-disabled.
   * </p>
   * <p>
   * {@ojinclude "name":"accessibilityLabelEditableValue"}
   * {@ojinclude "name":"accessibilityDisabledEditableValue"}
   * </p>
   *
   * <h3 id="state-section">
   *   Setting the Value Attribute
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#state-section"></a>
   * </h3>
   * <p>The value attribute should be Boolean. If the value attribute is undefined, then it is
   * <code class="prettyprint">false</code>.
   * </p>
   *
   * @example <caption>Initialize the switch with no attributes specified:</caption>
   * &lt;oj-switch>&lt;/oj-switch>
   *
   * @example <caption>Initialize the switch with some attributes specified:</caption>
   * &lt;oj-switch value=true disabled=false>&lt;/oj-switch>
   */

  //-----------------------------------------------------
  //                   Fragments
  //-----------------------------------------------------
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
   *       <td>Switch Thumb</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Toggle switch value</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojSwitch
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
   *       <td>Switch Thumb</td>
   *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
   *       <td>Toggle switch value</td>
   *     </tr>
   *     <tr>
   *       <td>Switch Thumb</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the thumb. If hints, title or messages exist in a notewindow,
   *        pop up the notewindow.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * <p>Disabled items can not receive keyboard focus.
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojSwitch
   */

  //-----------------------------------------------------
  //                   Sub-ids
  //-----------------------------------------------------
  /**
   * <p>Sub-ID for the switch's track.</p>
   *
   * @ojsubid oj-switch-track
   * @memberof oj.ojSwitch
   *
   * @example <caption>Get the node for the track:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-switch-track'});
   */

  /**
   * <p>Sub-ID for the switch's thumb.</p>
   *
   * @ojsubid oj-switch-thumb
   * @memberof oj.ojSwitch
   *
   * @example <caption>Get the node for the thumb:</caption>
   * var node = myComponent.getNodeBySubId({'subId': 'oj-switch-thumb'});
   */

  //-----------------------------------------------------
  //                   Styling
  //-----------------------------------------------------
  // ---------------- oj-switch --------------
  /**
   * Top level switch class.
   * @ojstyleclass oj-switch
   * @ojdisplayname Switch
   * @memberof oj.ojSwitch
   */
  // ---------------- oj-focus-highlight --------------
  /**
   * Under normal circumstances this class is applied automatically.
   * It is documented here for the rare cases that an app developer needs per-instance control.<br/><br/>
   * The oj-focus-highlight class applies focus styling that may not be desirable when the focus results from pointer interaction (touch or mouse), but which is needed for accessibility when the focus occurs by a non-pointer mechanism, for example keyboard or initial page load.<br/><br/>
   * The application-level behavior for this component is controlled in the theme by the <code class="prettyprint"><span class="pln">$focusHighlightPolicy </span></code>SASS variable; however, note that this same variable controls the focus highlight policy of many components and patterns. The values for the variable are:<br/><br/>
   * <code class="prettyprint"><span class="pln">nonPointer: </span></code>oj-focus-highlight is applied only when focus is not the result of pointer interaction. Most themes default to this value.<br/>
   * <code class="prettyprint"><span class="pln">all: </span></code> oj-focus-highlight is applied regardless of the focus mechanism.<br/>
   * <code class="prettyprint"><span class="pln">none: </span></code> oj-focus-highlight is never applied. This behavior is not accessible, and is intended for use when the application wishes to use its own event listener to precisely control when the class is applied (see below). The application must ensure the accessibility of the result.<br/><br/>
   * To change the behavior on a per-instance basis, the application can set the SASS variable as desired and then use event listeners to toggle this class as needed.<br/>
   * @ojstyleclass oj-focus-highlight
   * @ojdisplayname Focus Styling
   * @ojshortdesc Allows per-instance control of the focus highlight policy (not typically required). See the Help documentation for more information.
   * @memberof oj.ojSwitch
   * @ojtsexample
   * &lt;oj-switch class="oj-focus-highlight">
   *   &lt;!-- Content -->
   * &lt;/oj-switch>
   */
  /**
   * @ojstylevariableset oj-switch-css-set1
   * @ojstylevariable oj-switch-track-height {description: "Switch track height", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-switch-track-width {description: "Switch track width", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-switch-track-border-radius {description: "Switch track border radius", formats: ["length","percentage"], help: "#css-variables"}
   * @ojstylevariable oj-switch-thumb-to-track-horizontal-margin {description: "Switch thumb to track horizontal margin", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-switch-thumb-height {description: "Switch thumb height", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-switch-thumb-width {description: "Switch thumb width", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-switch-thumb-border-radius {description: "Switch thumb border radius", formats: ["length","percentage"], help: "#css-variables"}
   * @memberof oj.ojSwitch
   */
  /**
   * CSS variables used by oj-switch when enabled
   * @ojstylevariableset oj-switch-css-set2
   * @ojdisplayname Enabled
   * @ojstylevariable oj-switch-track-bg-color {description: "Switch track background color when enabled", formats: ["color"], help: "#oj-switch-css-set2"}
   * @ojstylevariable oj-switch-track-border-color {description: "Switch track border color when enabled", formats: ["color"], help: "#oj-switch-css-set2"}
   * @ojstylevariable oj-switch-thumb-bg-color {description: "Switch thumb background color when enabled", formats: ["color"], help: "#oj-switch-css-set2"}
   * @ojstylevariable oj-switch-thumb-border-color {description: "Switch thumb border color when enabled", formats: ["color"], help: "#oj-switch-css-set2"}
   * @ojstylevariable oj-switch-thumb-box-shadow {description: "Switch thumb box shadow when enabled", help: "#oj-switch-css-set2"}
   * @memberof oj.ojSwitch
   */
  /**
   * CSS variables used by oj-switch when hovered
   * @ojstylevariableset oj-switch-css-set3
   * @ojdisplayname Hovered
   * @ojstylevariable oj-switch-track-bg-color-hover {description: "Switch track background color when hovered", formats: ["color"], help: "#oj-switch-css-set3"}
   * @ojstylevariable oj-switch-track-border-color-hover {description: "Switch track border color when hovered",formats: ["color"], help: "#oj-switch-css-set3"}
   * @ojstylevariable oj-switch-track-border-color-hover {description: "Switch track border color when hovered",formats: ["color"], help: "#oj-switch-css-set3"}
   * @ojstylevariable oj-switch-thumb-bg-color-hover {description: "Switch thumb background color when hovered", formats: ["color"], help: "#oj-switch-css-set3"}
   * @ojstylevariable oj-switch-thumb-border-color-hover {description: "Switch thumb border color when hovered",formats: ["color"], help: "#oj-switch-css-set3"}
   * @ojstylevariable oj-switch-thumb-box-shadow-hover {description: "Switch thumb box shadow when hovered", help: "#oj-switch-css-set3"}
   * @memberof oj.ojSwitch
   */
  /**
   * CSS variables used by oj-switch when selected and hovered
   * @ojstylevariableset oj-switch-css-set4
   * @ojdisplayname Selected hovered
   * @ojstylevariable oj-switch-track-bg-color-selected-hover {description: "Switch track background color when selected and hovered", formats: ["color"],
   *  help: "#oj-switch-css-set4"}
   * @ojstylevariable oj-switch-track-border-color-selected-hover {description: "Switch track border color when selected and hovered", formats: ["color"],
   *  help: "#oj-switch-css-set4"}
   * @ojstylevariable oj-switch-thumb-bg-color-selected-hover {description: "Switch thumb background color when selected and hovered", formats: ["color"],
   *  help: "#oj-switch-css-set4"}
   * @ojstylevariable oj-switch-thumb-border-color-selected-hover {description: "Switch thumb border color when selected and hovered", formats: ["color"],
   *  help: "#oj-switch-css-set4"}
   * @ojstylevariable oj-switch-thumb-box-shadow-selected-hover {description: "Switch thumb box shadow when selected and hovered", help: "#oj-switch-css-set4"}
   * @memberof oj.ojSwitch
   */
  /**
   * CSS variables used by oj-switch when active
   * @ojstylevariableset oj-switch-css-set5
   * @ojdisplayname Active
   * @ojstylevariable oj-switch-track-bg-color-active {description: "Switch track background color when active", formats: ["color"], help: "#oj-switch-css-set5"}
   * @ojstylevariable oj-switch-track-border-color-active {description: "Switch track border color when active",formats: ["color"], help: "#oj-switch-css-set5"}
   * @ojstylevariable oj-switch-thumb-bg-color-active {description: "Switch thumb background color when active", formats: ["color"], help: "#oj-switch-css-set5"}
   * @ojstylevariable oj-switch-thumb-border-color-active {description: "Switch thumb border color when active",formats: ["color"], help: "#oj-switch-css-set5"}
   * @ojstylevariable oj-switch-thumb-box-shadow-active {description: "Switch thumb box shadow when active", help: "#oj-switch-css-set5"}
   * @ojstylevariable oj-switch-thumb-width-active {description: "Switch thumb width when active", formats: ["length"], help: "#oj-switch-css-set5"}
   * @memberof oj.ojSwitch
   */
  /**
   * CSS variables used by oj-switch when selected and active
   * @ojstylevariableset oj-switch-css-set6
   * @ojdisplayname Selected active
   * @ojstylevariable oj-switch-track-bg-color-selected-active {description: "Switch track background color when selected and active", formats: ["color"],
   *  help: "#oj-switch-css-set6"}
   * @ojstylevariable oj-switch-track-border-color-selected-active {description: "Switch track border color when selected and active ",formats: ["color"],
   *  help: "#oj-switch-css-set6"}
   * @ojstylevariable oj-switch-thumb-bg-color-selected-active {description: "Switch thumb background color when selected and active", formats: ["color"],
   *  help: "#oj-switch-css-set6"}
   * @ojstylevariable oj-switch-thumb-border-color-selected-active {description: "Switch thumb border color when selected and active",formats: ["color"],
   *  help: "#oj-switch-css-set6"}
   * @ojstylevariable oj-switch-thumb-box-shadow-selected-active {description: "Switch thumb box shadow when selected and active", help: "#oj-switch-css-set6"}
   * @memberof oj.ojSwitch
   */
  /**
   * CSS variables used by oj-switch when disabled
   * @ojstylevariableset oj-switch-css-set7
   * @ojdisplayname Disabled
   * @ojstylevariable oj-switch-track-bg-color-disabled {description: "Switch track background color when disabled", formats: ["color"], help: "#oj-switch-css-set7"}
   * @ojstylevariable oj-switch-track-border-color-disabled {description: "Switch track border color when disabled",formats: ["color"], help: "#oj-switch-css-set7"}
   * @ojstylevariable oj-switch-thumb-bg-color-disabled {description: "Switch thumb background color when disabled", formats: ["color"], help: "#oj-switch-css-set7"}
   * @ojstylevariable oj-switch-thumb-border-color-disabled {description: "Switch thumb border color when disabled",formats: ["color"], help: "#oj-switch-css-set7"}
   * @memberof oj.ojSwitch
   */
  /**
   * CSS variables used by oj-switch when selected and disabled
   * @ojstylevariableset oj-switch-css-set8
   * @ojdisplayname Selected disabled
   * @ojstylevariable oj-switch-track-bg-color-selected-disabled {description: "Switch track background color when selected and disabled", formats: ["color"],
   *  help: "#oj-switch-css-set8"}
   * @ojstylevariable oj-switch-track-border-color-selected-disabled {description: "Switch track border color when selected and disabled",formats: ["color"],
   *  help: "#oj-switch-css-set8"}
   * @ojstylevariable oj-switch-thumb-bg-color-selected-disabled {description: "Switch thumb background color when selected and disabled", formats: ["color"],
   *  help: "#oj-switch-css-set8"}
   * @ojstylevariable oj-switch-thumb-border-color-selected-disabled {description: "Switch thumb border color when selected and disabled",formats: ["color"],
   *  help: "#oj-switch-css-set8"}
   * @memberof oj.ojSwitch
   */
  // --------------------------------------------------- oj.ojSwitch Styling end -----------------------------------------------------------

  oj.__registerWidget('oj.ojSwitch', $.oj.editableValue, {
    version: '1.1.0',
    defaultElement: '<input>',
    widgetEventPrefix: 'oj',

    options: {
      /**
       * <p>
       * Whether the component is disabled. The element's
       * <code class="prettyprint">disabled</code>
       *  property is used as its initial
       * value if it exists, when the attribute is not explicitly set. When neither is set,
       * <code class="prettyprint">disabled </code>
       * defaults to false.
       *
       * @example <caption>Initialize the switch with
       * <code class="prettyprint">disabled</code> attribute:</caption>
       * &lt;oj-switch disabled="true">&lt;/oj-switch>
       * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
       * // Getter
       * var disabled = myComponent.disabled;
       *
       * // Setter
       * myComponent.disabled = true;
       *
       * @expose
       * @ojshortdesc Specifies whether the component is disabled. The default is false.
       * @type {boolean}
       * @default false
       * @public
       * @instance
       * @memberof oj.ojSwitch
       */
      disabled: false,
      /**
       * <p>
       * The oj-label sets the labelledBy property programmatically on the form component
       * to make it easy for the form component to find its oj-label component (a
       * document.getElementById call.)
       * </p>
       * <p>
       * The application developer should use the 'for'/'id api
       * to link the oj-label with the form component;
       * the 'for' on the oj-label to point to the 'id' on the input form component.
       * This is the most performant way for the oj-label to find its form component.
       * </p>
       *
       * @example <caption>Initialize component with <code class="prettyprint">for</code> attribute:</caption>
       * &lt;oj-label for="switchId">Name:&lt;/oj-label>
       * &lt;oj-switch id="switchId">
       * &lt;/oj-switch>
       * // ojLabel then writes the labelled-by attribute on the oj-switch.
       * &lt;oj-label id="labelId" for="switchId">Name:&lt;/oj-label>
       * &lt;oj-switch id="switchId" labelled-by"labelId">
       * &lt;/oj-switch>
       *
       * @example <caption>Get or set the <code class="prettyprint">labelledBy</code> property after initialization:</caption>
       * // getter
       * var labelledBy = myComp.labelledBy;
       *
       * // setter
       * myComp.labelledBy = "labelId";
       * @ojshortdesc The oj-label sets the labelledBy property
       * programmatically on the form component.
       * @expose
       * @type {string|null}
       * @default null
       * @public
       * @instance
       * @since 7.0.0
       * @memberof oj.ojSwitch
       */
      labelledBy: null,
      /**
       * Whether the component is readonly. The readOnly property sets or returns whether an element is readOnly, or not.
       * A readOnly element cannot be modified. However, a user can tab to it, highlight it, focus on it, and copy the text from it.
       * If you want to prevent the user from interacting with the element, use the disabled property instead. The element's
       * <code class="prettyprint">readOnly</code> property is used as its initial value if it exists, when the attribute is not explicitly set.
       *  When neither is set, <code class="prettyprint">readOnly </code> defaults to false.
       * <p>
       * The default value for readonly is false. However, if the form component is a descendent of
       * <code class="prettyprint">oj-form-layout</code>, the default value for readonly could come from the
       * <code class="prettyprint">oj-form-layout</code> component's readonly attribute.
       * The <code class="prettyprint">oj-form-layout</code> uses the
       * <a href="MetadataTypes.html#PropertyBinding">MetadataTypes.PropertyBinding</a>
       * <code class="prettyprint">provide</code> property to provide its
       * <code class="prettyprint">readonly</code>
       * attribute value to be consumed by descendent components.
       * The form components are configured to consume the readonly property if an ancestor provides it and
       * it is not explicitly set.
       * For example, if the oj-form-layout's readonly attribute is set to true, and a descendent form component does
       * not have its readonly attribute set, the form component's readonly will be true.
       * </p>
       * @example <caption>Initialize the switch with
       * <code class="prettyprint">readOnly</code> attribute:</caption>
       * &lt;oj-switch readonly="true">&lt;/oj-switch>
       * @example <caption>Get or set the <code class="prettyprint">readonly</code> property after initialization:</caption>
       * // Getter
       * var readonly = myComponent.readonly;
       *
       * // Setter
       * myComponent.readonly = true;
       *
       *
       * @expose
       * @ojshortdesc Specifies whether the component is read-only. A read-only element cannot be modified, but user interaction is allowed. See the Help documentation for more information.
       * @type {boolean}
       * @alias readonly
       * @default false
       * @instance
       * @memberof oj.ojSwitch
       */
      readOnly: false,

      /**
       * The boolean state of the switch component.
       *
       * @example <caption>Initialize component (switch is ON) with
       * <code class="prettyprint">value</code> attribute:</caption>
       * &lt;oj-switch value="true">&lt;/oj-switch>
       * @example <caption>Get or set the <code class="prettyprint">value</code> property after initialization:</caption>
       * // Getter
       * var value = myComponent.value;
       *
       * // Setter
       * myComponent.value = true;
       *
       * @expose
       * @type {boolean}
       * @default false
       * @ojwriteback
       * @public
       * @instance
       * @memberof oj.ojSwitch
       * @ojeventgroup common
       */
      value: false
    },

    // P U B L I C    M E T H O D S

    /**
     * Returns a jQuery object containing the element visually representing the switch.
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof oj.ojSwitch
     * @instance
     * @return {jQuery} the switch
     * @ignore
     */
    widget: function () {
      return this._element2;
    },

    // @inheritdoc
    getNodeBySubId: function (locator) {
      var node = this._super(locator);
      var subId;
      var rootElement = this.widget();

      if (!node) {
        node = locator == null || locator.subId == null ? rootElement : null;
        if (!node && locator) {
          subId = locator.subId;
          if (subId === OJ_SWITCH_THUMB || subId === OJ_SWITCH_TRACK) {
            return rootElement.find('.' + subId)[0];
          }
        }
      }

      return node || null;
    },

    /**
     * Returns the subId locator for the given child DOM node.
     * <p>
     * If DOM node is null then method returns null.
     * </p>
     * <p>
     * If DOM node is not a child of the current component then method returns null.
     * </p>
     *
     * @expose
     * @override
     * @ignore
     * @memberof oj.ojSwitch
     * @instance
     * @param {!Element} node - child DOM node
     * @return {Object|null} The subId for the DOM node, or null when none is found.
     */
    getSubIdByNode: function (node) {
      var originalId = $(this.element).attr('id');
      var nodeId;
      var result = this._super(node);

      if (node != null) {
        if ($(node).hasClass(OJ_SWITCH_TRACK) || $(node).hasClass(OJ_SWITCH_THUMB)) {
          nodeId = $(node).parents('div.oj-switch').find('input.oj-component-initnode').attr('id');
          if (originalId === nodeId && $(node).hasClass(OJ_SWITCH_TRACK)) {
            result = { subId: OJ_SWITCH_TRACK };
          } else if (originalId === nodeId && $(node).hasClass(OJ_SWITCH_THUMB)) {
            result = { subId: OJ_SWITCH_THUMB };
          }
        }
      }

      return result;
    },

    // P R O T E C T E D    C O N S T A N T S   A N D   M E T H O D S

    /**
     * oj-switch doesn't use .oj-text-field-readonly for the focusable readonly content,
     * so we need to use a different selector.
     * @memberof oj.ojSwitch
     * @instance
     * @override
     * @protected
     * @return {Element|null}
     */
    _GetReadonlyFocusElement: function () {
      return this.widget()[0].querySelector('.oj-switch-thumb');
    },

    /**
     * @private
     * @const
     */
    _BUNDLE_KEY: {
      _SWITCH_OFF: 'SwitchOFF',
      _SWITCH_ON: 'SwitchON'
    },

    /**
     * Overridden to set the options.value. When constructorOptions value is undefined,
     * we read the CHECKED, DISABLED, READONLY OPTIONS on the checkbox and
     * build the switch options from that.
     *
     * @memberof oj.ojSwitch
     * @instance
     * @protected
     */
    _InitOptions: function (originalDefaults, constructorOptions) {
      var props;
      var val;

      props = [
        { attribute: 'disabled', validateOption: true },
        { attribute: 'readonly', option: 'readOnly', validateOption: true },
        {
          attribute: 'checked',
          option: 'value',
          validateOption: false,
          coerceDomValue: function (domValue) {
            return !!domValue;
          }
        },
        { attribute: 'title' }
      ];

      // For translations, the oj-switch component has the following keys:
      // SwitchON and SwitchOFF. Due to this unconventional naming, it is impossible
      // to configure these through HTML attributes. In order to support having
      // translations.switch-on and translations.switch-off (which would result in the
      // properties switchOn and switchOff), we need to map the new properties to the
      // existing translation keys.
      let newConstructorOptions = constructorOptions;
      const translations = constructorOptions.translations;
      if (translations) {
        // Make a copy of the current translations. This is needed for
        // backwards compatibility of applications that are still using
        // undocument translations keys for setting the translations for
        // the swtich states (SwitchON and SwitchOFF). We should not be
        // overriding this unless the new documented properties are provided.
        const newTranslations = Object.assign({}, translations);
        if (translations.switchOn !== undefined) {
          newTranslations.SwitchON = translations.switchOn;
        }
        if (translations.switchOff !== undefined) {
          newTranslations.SwitchOFF = translations.switchOff;
        }
        newConstructorOptions = Object.assign({}, constructorOptions, {
          translations: newTranslations
        });
      }

      this._super(originalDefaults, newConstructorOptions);

      // Only needed for non new element style
      if (!this._IsCustomElement()) {
        EditableValueUtils.initializeOptionsFromDom(props, constructorOptions, this);
        val = this.option('value');
        this.option({ value: !!val }, { _context: { writeback: true, internalSet: true } });
      }
    },

    /**
     * Create switch component
     *
     * @override
     * @protected
     * @memberof oj.ojSwitch
     * @instance
     */
    _ComponentCreate: function () {
      this._super();

      if (!this.element.is('input')) {
        throw new Error('ojSwitch can be bound to INPUT only.');
      }

      this._inputElementOriginalDisplay = this.element.css('display');
      this._inputElementTabIndex = this.element.attr('tabindex') || 0;
      this.element
        .css('display', 'none')
        .attr('type', 'checkbox')
        .attr('checked', this.option('value'))
        .attr('tabindex', '-1')
        .attr('disabled', this.option('disabled'))
        .attr('readonly', this.option('readOnly'));

      if (this.OuterWrapper) {
        this._element2 = $(this.OuterWrapper);
      } else {
        this._element2 = this.element.wrap('<div></div>').parent(); // @HTMLUpdateOK trusted string
      }
      this._element2.addClass('oj-switch oj-component oj-form-control');

      const switchContainerHTML = `
      <div class='oj-switch-container oj-form-control-container'>
        <div class='oj-switch-track'>
          <div class='oj-switch-thumb' tabIndex='${this._inputElementTabIndex}'></div>
        </div>
      </div>
      `;
      this._element2.append(switchContainerHTML); // @HTMLUpdateOK append or prepend trusted new DOM to switch elem

      this.switchThumb = this._element2.find('.oj-switch-thumb');
      this.switchThumb.attr('role', this._setSwitchRole());

      this.switchTrack = this._element2.find('.oj-switch-track');
    },

    _AfterCreate: function () {
      this._super();

      // Get aria-label and aria-labelledby attribute values from the component and move them to the thumb which is the dom that gets focus
      var target = this.switchThumb;
      this._SetAriaInfo(target);

      // Set this._ariaLabelElement so that we know where to go when setting aria-label from label-hint
      this._ariaLabelElement = this.switchThumb[0];

      this._setup();
    },

    /**
     * Set aria label information for the switch.  It will come from either aria-labelledby or aria-label
     * @protected
     * @memberof oj.ojSwitch
     * @ignore
     */
    _SetAriaInfo: function (target) {
      var component;

      // Grab the right component
      if (this.OuterWrapper) {
        component = this._element2[0];
      } else {
        component = this._element2[0].querySelector('input');
      }

      var labelElementId;
      if (this._IsCustomElement()) {
        // Custom element case
        if (this.options.labelledBy) {
          var defaultLabelId = this.uuid + '_Label';
          labelElementId = EditableValueUtils._getOjLabelAriaLabelledBy(
            this.options.labelledBy,
            defaultLabelId
          );
        }
      } else {
        // Non custom element case
        var label = this._GetLabelElement();
        if (label) {
          labelElementId = label.attr('id');
        }
      }

      // Apply the label to the target
      if (labelElementId) {
        // Set the aria-labelledby attribute of the thumb to the returned id
        target.attr('aria-labelledby', labelElementId);
      } else {
        // Check if the element has aria-label
        var ariaLabelString = component.getAttribute(ARIA_LABEL);
        if (ariaLabelString) {
          // Set the aria-label of the thumb to the returned string
          target.attr(ARIA_LABEL, ariaLabelString); // @HTMLUpdateOK
          // And remove it from the component
          component.removeAttribute(ARIA_LABEL);
        }
      }
    },

    /**
     * Return the element on which aria-label can be found.
     * Usually this is the root element, but some components have aria-label as a transfer attribute,
     * and aria-label set on the root element is transferred to the inner element.
     * @memberof oj.ojSwitch
     * @instance
     * @protected
     */
    _GetAriaLabelElement: function () {
      return this._ariaLabelElement ? this._ariaLabelElement : this._super();
    },

    /**
     * _setup is called on create and refresh.
     *
     * @memberof oj.ojSwitch
     * @instance
     * @private
     */
    _setup: function () {
      var rootElement = $(this.widget());

      this._setupEvents();

      if (rootElement === undefined) return;
      this.element.attr('checked', this.option('value')); // Switch vs Input synchonization

      rootElement.removeClass('oj-disabled oj-read-only oj-selected oj-hover oj-active');
      $(this.switchThumb).attr('tabindex', this._inputElementTabIndex);
      $(this.switchThumb).html(''); // @HTMLUpdateOK

      if (this.option('disabled') || this.option('readOnly')) {
        if (this.option('disabled')) {
          rootElement.addClass('oj-disabled');
          $(this.switchThumb).removeAttr('tabindex');
        } else {
          rootElement.addClass('oj-read-only');
          let readonlyValue = this._setReadOnlyValue();
          $(this.switchThumb).html(readonlyValue); // @HTMLUpdateOK internal strings
        }
      }

      if (this.option('value')) {
        rootElement.addClass('oj-selected');
      }

      // Aria
      $(this.switchThumb).attr('aria-checked', this.option('value'));

      $(this.switchThumb).removeAttr(ARIA_DISABLED);
      $(this.switchThumb).removeAttr('aria-readonly');
      rootElement.removeAttr(ARIA_DISABLED);
      if (!this._CanSetValue()) {
        if (this.option('disabled')) {
          $(this.switchThumb).attr(ARIA_DISABLED, 'true'); // @HTMLUpdateOK
        } else {
          $(this.switchThumb).attr('aria-readonly', 'true');
        }
      }
    },

    /**
     * Translate On/Off switch
     *
     * @protected
     * @memberof oj.ojSwitch
     * @instance
     */
    _setReadOnlyValue: function () {
      var strReturn = this._BUNDLE_KEY._SWITCH_OFF;
      if (this.option('value')) {
        strReturn = this._BUNDLE_KEY._SWITCH_ON;
      }
      return this.getTranslatedString(strReturn);
    },

    /**
     * Binding events to the switch component
     *
     * @protected
     * @memberof oj.ojSwitch
     * @instance
     */
    _setupEvents: function () {
      this._off(this._element2, 'keydown keyup mouseup touchend');
      if (this._CanSetValue()) {
        this._on(this._element2, this._switchEvents);
        this._AddHoverable(this._element2);
        this._AddActiveable(this._element2);
      }
      this._focusable({
        element: this.switchThumb,
        applyHighlight: true
      });
    },

    /**
     * @override
     * @private
     */
    _switchEvents: {
      keydown: function (event) {
        const keyCode = event.which || event.keyCode;
        // ENTER and SPACE will change the switch
        if (keyCode === $.ui.keyCode.ENTER || keyCode === $.ui.keyCode.SPACE) {
          $(event.currentTarget).addClass('oj-active');
          event.preventDefault();
        }
      },
      keyup: function (event) {
        const keyCode = event.which || event.keyCode;
        // ENTER and SPACE will change the switch
        if (keyCode === $.ui.keyCode.ENTER || keyCode === $.ui.keyCode.SPACE) {
          this._SetValue(!this.option('value'), event);
        }
      },
      mouseup: function (event) {
        // We should only be reacting to the changes if one clicks on the switch track or thumb (child DOM of track)
        if (!isAncestorOrSelf(this.switchTrack[0], event.target)) {
          // Event not originated from the thumb or track, so do not react
          return;
        }

        // LEFT MOUSE BUTTON will change the switch and we want to ignore touch events here
        // so we don't toggle the value twice.
        if (event.button === 0 && this._isRealMouseEvent(event)) {
          this._SetValue(!this.option('value'), event);
        }

        // Click JET-37778 - Clicking switch track should move focus to thumb
        // This is to make sure that the component retains the focus after one toggles the
        // value by clicking on the track. Otherwise the Dynamic form may fail to update the
        // model, since the focus would not be inside the form
        FocusUtils.focusElement(this.switchThumb[0]);
      },
      touchend: function (event) {
        // We should only be reacting to the changes if one taps on the switch track or thumb (child DOM of track)
        if (!isAncestorOrSelf(this.switchTrack[0], event.target)) {
          // Event not originated from the thumb or track, so do not react
          return;
        }

        this._SetValue(!this.option('value'), event);

        // Click JET-37778 - Clicking switch track should move focus to thumb
        // This is to make sure that the component retains the focus after one toggles the
        // value by clicking on the track. Otherwise the Dynamic form may fail to update the
        // model, since the focus would not be inside the form
        FocusUtils.focusElement(this.switchThumb[0]);
      }
    },

    /**
     * Returns the default styleclass for the component. Currently this is
     * used to pass to the ojLabel component, which will append -label and
     * add the style class onto the label. This way we can style the label
     * specific to the input component. For example, for inline labels, the
     * checkboxset/checkboxset components need to have margin-top:0, whereas all the
     * other inputs need it to be .5em. So we'll have a special margin-top style
     * for .oj-label-inline.oj-checkboxset-label
     * All input components must override
     *
     * @return {string}
     * @memberof oj.ojSwitch
     * @override
     * @protected
     */
    _GetDefaultStyleClass: function () {
      return 'oj-switch';
    },
    /**
     * Whether the a value can be set on the component. For example, if the component is
     * disabled or readOnly then setting value on component is a no-op.
     *
     * @see #_SetValue
     * @return {boolean}
     * @memberof oj.ojSwitch
     * @override
     * @protected
     */
    _CanSetValue: function () {
      var readOnly;
      var superCanSetValue = this._super();

      if (!superCanSetValue) {
        return false;
      }

      readOnly = this.options.readOnly || false;
      return !readOnly;
    },
    /**
     * Returns switch role for ARIA
     * ToDo: for IE it should be role="cehckbox"
     *
     * @return {string}
     * @memberof oj.ojSwitch
     * @override
     * @protected
     */
    _setSwitchRole: function () {
      return 'switch';
    },

    /**
     * @ignore
     * @protected
     * @override
     */
    _destroy: function () {
      if (this._CanSetValue()) {
        this._RemoveHoverable(this._element2);
        this._RemoveActiveable(this._element2);
      }
      this._element2.find('.oj-switch-track').remove();
      unwrap(this.element);
      this._RestoreAttributes(this.element);
      return this._super();
    },

    /**
     * Returns a jquery object of the launcher element representing the content nodes (switch).
     * @protected
     * @override
     * @memberof oj.ojSwitch
     */
    _GetMessagingLauncherElement: function () {
      return this._element2;
    },

    /**
     * Returns a jquery object of the elements representing the content nodes (switch thumb).
     * @protected
     * @override
     * @memberof oj.ojSwitch
     */
    _GetContentElement: function () {
      return this.switchThumb;
    },
    /**
     * Performs post processing after _SetOption() is called. Different options when changed perform
     * different tasks. See _AfterSetOption[OptionName] method for details.
     *
     * @param {string} option
     * @param {Object|string=} previous
     * @param {Object=} flags
     * @protected
     * @override
     * @memberof oj.ojSwitch
     * @instance
     */
    // eslint-disable-next-line no-unused-vars
    _AfterSetOption: function (option, previous, flags) {
      this._superApply(arguments);
      if (option === 'readOnly') {
        this._AfterSetOptionDisabledReadOnly(option, EditableValueUtils.readOnlyOptionOptions);
      }
    },

    /**
     * An override of the JQUI option method to set aliases for the oj-switch component's options.
     *
     * @param {string|Object=} optionName the option name (string, first two overloads), or the map (Object, last overload).
     *                                    Omitted in the third overload.
     * @param {Object=} value a value to set for the option.  Second overload only.
     *
     * @override
     * @memberof oj.ojSwitch
     * @instance
     * @ignore
     */
    // eslint-disable-next-line no-unused-vars
    option: function (optionName, value) {
      let args = arguments;
      let aliasedName = optionName;

      // Check if the optionName is one of the options that needs to be aliased
      if (optionName === 'translations.switchOn') {
        aliasedName = 'translations.SwitchON';
      } else if (optionName === 'translations.switchOff') {
        aliasedName = 'translations.SwitchOFF';
      }

      // replace the first arg with the aliasedName if it exists
      if (args.length > 0) {
        args[0] = aliasedName;
      }

      // Apply the new arguments
      return this._superApply(args);
    },

    /**
     * @override
     * @private
     */
    _setOption: function (key, value, flags) {
      var coercedValue;
      switch (key) {
        case 'disabled':
        case 'readOnly':
        case 'value':
          coercedValue = !!value;
          break;
        default:
          coercedValue = value;
      }
      // need to coerceValues first
      this._super(key, coercedValue, flags);

      if (key === 'labelledBy') {
        this._SetAriaInfo(this.switchThumb);
      }
    },

    /**
     * @private
     * @memberof oj.ojSwitch
     * @return {boolean} true if there is no touch detected within the last 500 ms
     */
    _isRealMouseEvent: function () {
      return !recentTouchEnd();
    },
    /**
     * Used for explicit cases where the component needs to be refreshed
     * (e.g., when the value option changes or other UI gestures).
     * @override
     * @protected
     * @memberof oj.ojSwitch
     */
    // eslint-disable-next-line no-unused-vars
    _Refresh: function (name, value, forceDisplayValueRefresh) {
      this._superApply(arguments);
      this._setup();
    }
  });
})();
