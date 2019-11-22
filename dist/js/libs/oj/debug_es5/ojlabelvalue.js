/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojcomponentcore', 'ojs/ojlabel'], 
/*
* @param {Object} oj 
*/
function(oj)
{
  "use strict";
var __oj_label_value_metadata = 
{
  "properties": {
    "colspan": {
      "type": "number",
      "value": 1
    },
    "labelEdge": {
      "type": "string",
      "enumValues": [
        "inherit",
        "inside",
        "start",
        "top"
      ],
      "value": "inherit"
    },
    "labelWidth": {
      "type": "string",
      "value": "inherit"
    }
  },
  "methods": {
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "refresh": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};


/**
 * @ojcomponent oj.ojLabelValue
 * @since 5.1.0
 * @ojshortdesc A label value is used to lay out a label and value, it is most commonly used in a form layout.
 *
 * @ojsignature {target: "Type", value:"class ojLabelValue extends JetElement<ojLabelValueSettableProperties>"}
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["labelEdge", "labelWidth", "colspan"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 2
 *
 * @classdesc
 * <h3 id="optionOverview-section">
 *   JET LabelValue
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#optionOverview-section"></a>
 * </h3>
 * <p>The oj-label-value element is used to group label(s) and value(s) elements into a single
 * layout element that is most commonly a child of oj-form-layout.  This component gives some
 * flexibility to what shows up in the label portion and what shows up in the value portion of
 * an oj-form-layout element sequence of laid out elements (most commonly which are label/value pairs).
 * The 'label' and 'value' slots are used to add elements to either the 'label' or 'value' parts
 * of a label/value form layout item.
 *
 * <p>For example:
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-form-layout max-columns='2' label-edge='start' label-width="50%">
 *   &lt;oj-label-value>
 *     &lt;my-label slot="label" for="my1">&lt;/my-label>
 *     &lt;my-input slot="value" id="my1">&lt;/my-input>
 *   &lt;/oj-label-value>
 *   &lt;oj-label-value>
 *     &lt;my-label slot="label" for="my2">&lt;/my-label>
 *   &lt;/oj-label-value>
 *   &lt;oj-label-value>
 *     &lt;my-input slot="value" id="my2">&lt;/my-input>
 *   &lt;/oj-label-value>
 * &lt;/oj-form-layout>
 * </code></pre>
 *
 * <p>Any slot child elements not in either a 'label' or 'value' slot will be removed from the DOM.
 * This includes the default slot.
 * </p>
 */

/**
 * @member
 * @name colspan
 * @expose
 * @memberof oj.ojLabelValue
 * @ojshortdesc Specifies how many columns this label/value pair will occupy in the parent form layout. See the Help documentation for more information.
 * @instance
 * @type {number}
 * @default 1
 * @since 6.2.0
 * @desc Specifies how many columns this label/value pair will occupy in the parent oj-form-layout.
 * <p>This attribute only has an effect if the parent oj-form-layout has direction="row".</p>
 * <p>If there are fewer columns left in the current row than the colspan value specified, then the remaining available columns will be used.</p>
 * <p>By default, the label portion will occupy the same location and width as the label portion of any other label-value pairs, and the value portion will extend over the remaining columns. The default location and width can be changed with the label-edge and label-width attributes on the oj-label-value, respectively.</p>
 * <p>If a percentage is specified for label-width, it is relative to all columns the element occupy. For example, if colspan is 2 and label-width is set to 50%, the label portion will occupy 1 column, and the value portion will occupy 1 column.</p>
 * @example <caption>Initialize the oj-label-value with the <code class="prettyprint">colspan</code> attribute specified:</caption>
 * &lt;oj-label-value colspan="2">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 * &lt;/oj-label-value>
 *
 * @example <caption>Get or set the <code class="prettyprint">colspan</code> property after initialization:</caption>
 * // getter
 * var cols = myLabelValue.colspan;
 *
 * // setter
 * myLabelValue.colspan = 3;
 */

/**
 * @member
 * @name labelEdge
 * @expose
 * @memberof oj.ojLabelValue
 * @ojshortdesc Specifies how the label is aligned with its value component.
 * @instance
 * @type {string}
 * @default "inherit"
 * @ojvalue {string} "inside" Label is on top of its value component, with a smaller font-size applied to any oj-label child.
 * @ojvalue {string} "start" Label is inline with the start of its value component
 * @ojvalue {string} "top" Label is on top of its value component.
 * @ojvalue {string} "inherit"  Label will inherit label-edge from its closest custom element ancestor element.
 * @desc Specifies how the label is aligned with its value component.
 * <p>If the value is 'inherit', it will inherit label-edge from its closest custom element ancestor element. If the ancestor doesn't have a label-edge attribute, the default is "top".</p>
 * <p><b>Note: For 'inherit' to work correctly, the application must use data binding (i.e. calling ko.applyBindings on
 * an ancestor node of the oj-label-value).</b></p>
 *
 * @example <caption>Initialize the oj-label-value with the <code class="prettyprint">label-edge</code> attribute specified:</caption>
 * &lt;oj-label-value label-edge="top">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 * &lt;/oj-label-value>
 *
 * @example <caption>Get or set the <code class="prettyprint">labelEdge</code> property after initialization:</caption>
 * // getter
 * var edge = myLabelValue.labelEdge;
 *
 * // setter
 * myLabelValue.labelEdge = 'start';
 */

/**
 * @member
 * @name labelWidth
 * @expose
 * @memberof oj.ojLabelValue
 * @ojshortdesc Specifies the label width. See the Help documentation for more information.
 * @instance
 * @type {string}
 * @default "inherit"
 * @desc Specifies the label width.
 * <p>This can be any legal <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/width">CSS width</a> or 'inherit',
 * which will inherit label-width from its closest custom element ancestor element.  If the value is "inherit" and ancestor doesn't have a label-width attribute, the default is "33%".</p>
 *
 * @example <caption>Initialize the oj-form-layout with the <code class="prettyprint">label-width</code> attribute specified:</caption>
 * &lt;oj-form-layout label-width="50%">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-text-area id="textareacontrol" value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 * &lt;/oj-form-layout>
 *
 * @example <caption>Get or set the <code class="prettyprint">labelWidth</code> property after initialization:</caption>
 * // getter
 * var width = myLabelValue.labelWidth;
 *
 * // setter
 * myLabelValue.labelWidth = '60px';
 */

/**
 * Sets a property or a single subproperty for complex properties and notifies the component
 * of the change, triggering a [property]Changed event.
 *
 * @function setProperty
 * @param {string} property - The property name to set. Supports dot notation for subproperty access.
 * @param {*} value - The new value to set the property to.
 * @return {void}
 *
 * @expose
 * @memberof oj.ojLabelValue
 * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
 * @instance
 *
 * @example <caption>Set a single subproperty of a complex property:</caption>
 * myComponent.setProperty('complexProperty.subProperty1.subProperty2', "someValue");
 */

/**
 * Retrieves a value for a property or a single subproperty for complex properties.
 * @function getProperty
 * @param {string} property - The property name to get. Supports dot notation for subproperty access.
 * @return {*}
 *
 * @expose
 * @memberof oj.ojLabelValue
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
 * @expose
 * @memberof oj.ojLabelValue
 * @instance
 *
 * @example <caption>Set a batch of properties:</caption>
 * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
 */

/**
 * Refreshes the visual state of the component.
 *
 * @function refresh
 *
 * @expose
 * @memberof oj.ojLabelValue
 * @ojshortdesc Refreshes the component.
 * @return {void}
 * @instance
 */

/**
 * <p>The <code class="prettyprint">label</code> slot is used to specify the 'label' part of a label/value form layout item.</p>
 *
 * @ojslot label
 * @memberof oj.ojLabelValue
 *
 * @example <caption>Initialize a label/value form layout item:</caption>
 * &lt;oj-label-value>
 *   &lt;oj-label for="textWindow" slot="label">Type here&lt;/oj-label>
 *   &lt;oj-textarea id="textWindow" slot="value" rows="5" style="width: 100%; min-width: 100%">&lt;/oj-textarea>
 * &lt;/oj-label-value>
 */

/**
 * <p>The <code class="prettyprint">value</code> slot is used to specify the 'value' part of a label/value form layout item.</p>
 *
 * @ojslot value
 * @memberof oj.ojLabelValue
 *
 * @example <caption>Initialize a label/value form layout item:</caption>
 * &lt;oj-label-value>
 *   &lt;oj-label for="textWindow" slot="label">Type here&lt;/oj-label>
 *   &lt;oj-textarea id="textWindow" slot="value" rows="5" style="width: 100%; min-width: 100%">&lt;/oj-textarea>
 * &lt;/oj-label-value>
 */

/**
 * The _ojLabelValue constructor function.
 *
 * @constructor
 * @private
 */
// eslint-disable-next-line no-unused-vars
function ojLabelValue(context) {
  var element = context.element;
  var labelOjFlexItem;
  var valueOjFlexItem;

  this.createDOM = function () {
    element.classList.add('oj-label-value', 'oj-form'); // Create the flex wrapper div

    var ojFlexDiv = document.createElement('div');
    ojFlexDiv.classList.add('oj-flex');
    ojFlexDiv.setAttribute('data-oj-context', '');
    ojFlexDiv.setAttribute('data-oj-internal', ''); // Create the label div

    labelOjFlexItem = document.createElement('div');
    labelOjFlexItem.classList.add('oj-flex-item');
    labelOjFlexItem.setAttribute('data-oj-context', '');
    labelOjFlexItem.setAttribute('data-oj-internal', ''); // Create the value div

    valueOjFlexItem = document.createElement('div');
    valueOjFlexItem.classList.add('oj-flex-item');
    valueOjFlexItem.setAttribute('data-oj-context', '');
    valueOjFlexItem.setAttribute('data-oj-internal', ''); // move the slot children to the appropriate div

    while (element.firstElementChild) {
      var child = element.firstElementChild;

      switch (child.getAttribute('slot')) {
        case 'label':
          labelOjFlexItem.appendChild(child); // @HTMLUpdateOK reparenting child nodes

          break;

        case 'value':
          valueOjFlexItem.appendChild(child); // @HTMLUpdateOK reparenting child nodes

          break;

        default:
          element.removeChild(child); // @HTMLUpdateOK removing any non 'label'/'value' slot children

          break;
      }
    }

    ojFlexDiv.appendChild(labelOjFlexItem); // @HTMLUpdateOK appending internally created DOM element

    ojFlexDiv.appendChild(valueOjFlexItem); // @HTMLUpdateOK appending internally created DOM element

    element.appendChild(ojFlexDiv); // @HTMLUpdateOK appending internally created DOM element
  };
  /**
   * The main render function.  This function gets called on initial render,
   * when oj-label-value attributes are modified.
   *
   * @memberof oj.ojLabelValue
   * @instance
   * @private
   */


  this.updateDOM = function () {
    var customElementAncestor = _findClosestCustomElementAncestor(); // Resolve labelEdge to an explict value either from oj-label-value or from ancestor oj-form-layout


    var labelEdge = _getLabelEdge(customElementAncestor);

    var labelWidth = labelEdge === 'start' ? _getLabelWidth(customElementAncestor) : '100%';

    var direction = _getParentFormLayoutDirection(customElementAncestor);

    if (labelEdge === 'start') {
      element.classList.add('oj-formlayout-labels-inline');
      element.classList.remove('oj-form-control-label-inside');
    } else if (labelEdge === 'inside') {
      element.classList.add('oj-form-control-label-inside');
      element.classList.remove('oj-formlayout-labels-inline');
    } else {
      // labelEdge === 'top'
      element.classList.remove('oj-formlayout-labels-inline');
      element.classList.remove('oj-form-control-label-inside');
    } // To pick up the correct styles, we need to add the form layout class name that
    // is used for direction = 'row'


    if (direction === 'row') {
      element.classList.add('oj-formlayout-form-across');
    } else {
      element.classList.remove('oj-formlayout-form-across');
    }

    labelOjFlexItem.style.webkitFlex = '0 1 ' + labelWidth;
    labelOjFlexItem.style.flex = '0 1 ' + labelWidth;
    labelOjFlexItem.style.maxWidth = labelWidth;
    labelOjFlexItem.style.width = labelWidth;
    valueOjFlexItem.style.webkitFlex = '1 1 0';
    valueOjFlexItem.style.flex = '1 1 0';
  };

  function _getLabelEdge(customElementAncestor) {
    var labelEdge = 'top'; // default value if "inherit" and ancestor doesn't support labelEdge

    if (element.labelEdge === 'inherit') {
      // We will inherit from custom element if it supports labelEdge
      if (customElementAncestor && 'labelEdge' in customElementAncestor) {
        labelEdge = customElementAncestor.labelEdge;
      }
    } else {
      labelEdge = element.labelEdge;
    }

    return labelEdge;
  }

  function _getParentFormLayoutDirection(customElementAncestor) {
    var direction = 'column'; // default value of oj-form-layout

    if (customElementAncestor && 'direction' in customElementAncestor) {
      direction = customElementAncestor.direction;
    }

    return direction;
  }

  function _getLabelWidth(customElementAncestor) {
    var labelWidth = '33%'; // default value if "inherit" and ancestor doesn't support labelWidth

    if (element.labelWidth === 'inherit') {
      // We will inherit from custom element if it supports labelWidth
      if (customElementAncestor && 'labelWidth' in customElementAncestor) {
        labelWidth = customElementAncestor.labelWidth; // for '%' labelWidth, we need to devide the value by the number of columns this component
        // is spanning (which can be less that the colspan property value);

        var CssUnitsRegex = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/;
        var parts = labelWidth.match(CssUnitsRegex);

        if (parts[2] === '%') {
          // find the actual colspan for this element and divide the percentage by the number of cols.
          // This is only done for the "inherit" case.  If a specific value is set on the oj-label-value,
          // then we use that value without modifying it.
          var colspan = Number(element.getAttribute('data-oj-colspan')); // if it is 0, then the parent component didn't update this and we use the default.

          if (colspan > 0) {
            labelWidth = parts[1] / colspan + parts[2];
          }
        }
      }
    } else {
      labelWidth = element.labelWidth;
    }

    return labelWidth;
  } // searches ancestor elements, until and interesting tag-name is found,
  // returns null if no interesting element is found.


  function _findClosestCustomElementAncestor() {
    var ancestor = element.parentElement; // walk up parents until we find the first custom element

    for (; ancestor; ancestor = ancestor.parentElement) {
      // Is it a custom element?
      if (ancestor.tagName.indexOf('-') !== -1) {
        return ancestor;
      }
    }

    return null; // no custom element ancestor
  }
}



/* global __oj_label_value_metadata:false */

/* global ojLabelValue */
(function () {
  __oj_label_value_metadata.extension._CONSTRUCTOR = ojLabelValue;
  oj.CustomElementBridge.register('oj-label-value', {
    metadata: __oj_label_value_metadata
  });
})();

});