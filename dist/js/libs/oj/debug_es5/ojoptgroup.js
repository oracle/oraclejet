/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore'], 
function(oj, $)
{
  "use strict";
//%COMPONENT_METADATA%
var __oj_optgroup_metadata = 
{
  "properties": {
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "label": {
      "type": "string"
    }
  },
  "methods": {
    "setProperty": {},
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};


/**
 * @constructor
 * @private
 */
// eslint-disable-next-line no-unused-vars
function ojOptGroup(context) {
  this.updateDOM = function () {
    var customRenderer = context.element.customOptgroupRenderer;

    if (customRenderer && typeof customRenderer === 'function') {
      customRenderer(context.element);
    }
  };
}



/**
 * @ojcomponent oj.ojOptgroup
 * @since 4.0.0
 * @ojdisplayname Option Group
 * @ojshortdesc An optgroup supports grouping of child oj-option elements.
 * @ojrole option
 *
 * @ojsignature class ojOptgroup extends JetElement<ojOptgroupSettableProperties>
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["label", "disabled"]}
 *
 * @classdesc
 * <h3 id="optgroupOverview-section">
 *   JET Optgroup
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#optgroupOverview-section"></a>
 * </h3>
 * <p>The oj-optgroup element is used to group [oj-option]{@link oj.ojOption} elements.</p>
 * <p>For example:
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-select-one>
 *   &lt;oj-optgroup label="group1 label">
 *     &lt;oj-option value="option 1">option 1&lt;/oj-option>
 *     &lt;oj-option value="option 2">option 2&lt;/oj-option>
 *   &lt;/oj-optgroup>
 *   &lt;oj-optgroup label="group2 label">
 *     &lt;oj-option value="option 3">option 3&lt;/oj-option>
 *     &lt;oj-option value="option 4">option 4&lt;/oj-option>
 *   &lt;/oj-optgroup>
 * &lt;/oj-select-one>
 * </code></pre>
 */

/**
 * <p>Disables the oj-optgroup if set to <code class="prettyprint">true</code>.
 *
 * @name disabled
 * @ojshortdesc Disables the group if set to true.
 * @expose
 * @memberof oj.ojOptgroup
 * @instance
 * @type {boolean}
 * @default false
 *
 * @example <caption>Initialize the oj-optgroup with the <code class="prettyprint">disabled</code> attribute specified:</caption>
 * &lt;oj-optgroup disabled="[[isDisabled]]">&lt;/oj-optgroup>
 *
 * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
 * // getter
 * var disabledValue = myOptgroup.disabled;
 *
 * // setter
 * myOptgroup.disabled = true;
 */

/**
 * <p>Specifies the oj-optgroup's label.
 *
 * @name label
 * @ojshortdesc The group label.
 * @ojrequired
 * @ojtranslatable
 * @expose
 * @memberof oj.ojOptgroup
 * @instance
 * @type {string}
 *
 * @example <caption>Initialize the oj-optgroup with the <code class="prettyprint">label</code> attribute specified:</caption>
 * &lt;oj-optgroup label="group1 label">&lt;/oj-optgroup>
 *
 * @example <caption>Get or set the <code class="prettyprint">label</code> property after initialization:</caption>
 * // getter
 * var labelValue = myOptgroup.label;
 *
 * // setter
 * myOptgroup.label = 'Group 1';
 */

/**
 * <p>The oj-optgroup element accepts <code class="prettyprint">oj-option</code> elements as children. See the [oj-option]{@link oj.ojOption} documentation for details about
 * accepted children and slots.</p>
 *
 * @ojchild Default
 * @memberof oj.ojOptgroup
 * @ojshortdesc The oj-optgroup element accepts oj-option elements as children.
 *
 * @example <caption>Initialize the oj-optgroup with child content specified:</caption>
 * &lt;oj-optgroup>
 *   &lt;oj-option value="option1">Option label&lt;/oj-option>
 * &lt;/oj-optgroup>
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
 * @expose
 * @memberof oj.ojOptgroup
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
 * @expose
 * @memberof oj.ojOptgroup
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
 * @memberof oj.ojOptgroup
 * @instance
 */

/**
 * Performs a batch set of properties.
 * @function setProperties
 * @param {Object} properties - An object containing the property and value pairs to set.
 * @return {void}
 * @expose
 * @memberof oj.ojOptgroup
 * @instance
 *
 * @example <caption>Set a batch of properties:</caption>
 * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
 */



/* global ojOptGroup:false */

/* global __oj_optgroup_metadata:false */

/**
 * @protected
 * @ignore
 */
(function () {
  // not documented
  __oj_optgroup_metadata.properties.customOptgroupRenderer = {};
  __oj_optgroup_metadata.extension._CONSTRUCTOR = ojOptGroup;
  oj.CustomElementBridge.register('oj-optgroup', {
    metadata: __oj_optgroup_metadata
  });
})();

});