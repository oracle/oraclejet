/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import 'ojs/ojcomponentcore';
import $ from 'jquery';
import 'ojs/ojcustomelement';
import { CustomElementUtils } from 'ojs/ojcustomelement-utils';

/**
 * @constructor
 * @private
 */
// eslint-disable-next-line no-unused-vars
function ojOption(context) {
  /**
   * Append each node to the element.
   * @private
   */
  function _appendNodes(elem, nodes) {
    $.each(nodes, function (i, node) {
      elem.appendChild(node);
    });
  }

  /**
   * Remove node from the element.
   * @private
   */
  function _removeNodes(elem, nodes) {
    $.each(nodes, function (i, node) {
      elem.removeChild(node);
    });
  }

  /**
   * Rearrange slots in the right order and remove unwanted slots.
   * @private
   */
  function _arrangeSlots(elem) {
    // get the slotMap
    var slots = CustomElementUtils.getSlotMap(elem);
    var supportedSlots = ['startIcon', '', 'endIcon'];

    // remove unwanted slots
    $.each(slots, function (slotName, nodes) {
      if (supportedSlots.indexOf(slotName) === -1) {
        _removeNodes(elem, nodes);
      }
    });

    // rearrange slots
    $.each(supportedSlots, function (i, slotName) {
      if (slots[slotName]) {
        _appendNodes(elem, slots[slotName]);
      }
    });
  }

  this.updateDOM = function () {
    var customRenderer = context.element.customOptionRenderer;

    // reorder the slots and remove unwanted slots
    _arrangeSlots(context.element);

    if (customRenderer && typeof customRenderer === 'function') {
      customRenderer(context.element);
    }
  };
}

/**
 * @protected
 * @ignore
 */
(function () {
  // not documented
var __oj_option_metadata = 
{
  "properties": {
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "value": {
      "type": "any"
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
  __oj_option_metadata.properties.customOptionRenderer = {};
  __oj_option_metadata.extension._CONSTRUCTOR = ojOption;
  oj.CustomElementBridge.register('oj-option', { metadata: __oj_option_metadata });
})();

/**
 * @ojcomponent oj.ojOption
 * @since 4.0.0
 * @ojshortdesc An option represents a value for JET elements that display a list of values.
 * @ojrole option
 *
 * @ojsignature class ojOption extends JetElement<ojOptionSettableProperties>
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["value", "disabled"]}
 *
 * @ojoracleicon 'oj-ux-ico-get-options'
 *
 * @classdesc
 * <h3 id="optionOverview-section">
 *   JET Option
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#optionOverview-section"></a>
 * </h3>
 * <p>The oj-option element is used to declare values for JET elements that display list of values.
 * It's supported by the following elements:
 * <ul>
 * <li>oj-buttonset-one</li>
 * <li>oj-buttonset-many</li>
 * <li>oj-checkboxset</li>
 * <li>oj-combobox-one</li>
 * <li>oj-combobox-many</li>
 * <li>oj-menu</li>
 * <li>oj-radioset</li>
 * <li>oj-select-one</li>
 * <li>oj-select-many</li>
 * <li>oj-menu-select-many</li>
 * <li>oj-swipe-actions</li>
 * </ul>
 * </p>
 * <p>For example:
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-select-one>
 *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
 *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
 *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
 *   &lt;oj-option value="option 4">option 4&lt;/oj-option>
 * &lt;/oj-select-one>
 * </code></pre>
 */

/**
 * <p>Disables the oj-option if set to <code class="prettyprint">true</code>.
 *
 * @name disabled
 * @ojshortdesc Disables the option if set to true.
 * @expose
 * @memberof oj.ojOption
 * @instance
 * @type {boolean}
 * @default false
 *
 * @example <caption>Initialize the oj-option with the <code class="prettyprint">disabled</code> attribute specified:</caption>
 * &lt;oj-option disabled="[[isDisabled]]" value="option1">Option1&lt;/oj-option>
 *
 * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
 * // getter
 * var disabledValue = myOption.disabled;
 *
 * // setter
 * myOption.disabled = true;
 */

/**
 * <p>Specifies the oj-option's value. The value is associated with the oj-option element whose display value may be different.
 *
 * @name value
 * @ojshortdesc The value of the option.
 * @expose
 * @memberof oj.ojOption
 * @instance
 * @type {any}
 *
 * @example <caption>Initialize the oj-option with the <code class="prettyprint">value</code> attribute specified:</caption>
 * &lt;oj-option value="option1">Option1&lt;/oj-option>
 *
 * @example <caption>Get or set the <code class="prettyprint">value</code> property after initialization:</caption>
 * // getter
 * var optionValue = myOption.value;
 *
 * // setter
 * myOption.value = 'option1';
 */

/**
 * <p>Child content for oj-option. This is normally the text node that displays for oj-option.</p>
 *
 * @ojchild Default
 * @ojshortdesc The default slot for the option's content.
 * @memberof oj.ojOption
 *
 * @example <caption>Initialize the oj-option with child content specified:</caption>
 * &lt;oj-option>
 *   Option label
 * &lt;/oj-option>
 */

/**
 * <p>Named slot for the oj-option's start icon.</p>
 *
 * @ojslot startIcon
 * @ojshortdesc The slot for the option's start icon.
 * @memberof oj.ojOption
 *
 * @example <caption>Initialize the oj-option with the <code class="prettyprint">startIcon</code> slot specified:</caption>
 * &lt;oj-option>
 *   &lt;span slot='startIcon'>&lt;img src='start.png' alt='Start'>&lt;/span>
 * &lt;/oj-option>
 */

/**
 * <p>Named slot for the oj-option's end icon.</p>
 *
 * @ojslot endIcon
 * @ojshortdesc The slot for the option's end icon.
 * @memberof oj.ojOption
 *
 * @example <caption>Initialize the oj-option with the <code class="prettyprint">endIcon</code> slot specified:</caption>
 * &lt;oj-option>
 *   &lt;span slot='endIcon'>&lt;img src='end.png' alt='End'>&lt;/span>
 * &lt;/oj-option>
 */

/**
 * Sets a property or a single subproperty for complex properties and notifies the component
 * of the change, triggering a [property]Changed event.
 *
 * @function setProperty
 * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
 * @param {string} property - The property name to set. Supports dot notation for subproperty access.
 * @param {any} value - The new value to set the property to.
 * @return {void}
 *
 * @expose
 * @memberof oj.ojOption
 * @instance
 *
 * @example <caption>Set a single subproperty of a complex property:</caption>
 * myComponent.setProperty('complexProperty.subProperty1.subProperty2', "someValue");
 */
/**
 * Retrieves a value for a property or a single subproperty for complex properties.
 * @function getProperty
 * @param {string} property - The property name to get. Supports dot notation for subproperty access.
 * @return {any}
 *
 * @expose
 * @memberof oj.ojOption
 * @instance
 *
 * @example <caption>Get a single subproperty of a complex property:</caption>
 * var subpropValue = myComponent.getProperty('complexProperty.subProperty1.subProperty2');
 */
/**
 * Refreshes the visual state of the component.
 *
 * @function refresh
 * @return {void}
 * @expose
 * @memberof oj.ojOption
 * @instance
 */
/**
 * Performs a batch set of properties.
 * @function setProperties
 * @param {Object} properties - An object containing the property and value pairs to set.
 * @return {void}
 *
 * @expose
 * @memberof oj.ojOption
 * @instance
 *
 * @example <caption>Set a batch of properties:</caption>
 * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
 */
