/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'ojs/ojcomponentcore', 'ojs/ojcustomelement'], 
       function(oj)
{

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojSwitcher
 * @ojsignature {
 *                target: "Type",
 *                value: "class ojSwitcher extends JetElement<ojSwitcherSettableProperties>"
 *               }
 * @since 4.0.0
 * @ojstatus preview
 * @ojshortdesc Dynamically decides which child element should be made visible.
 * @classdesc The switcher element dynamically decides which child element should be made visible. It will make a child element visible only if it's <code class="prettyprint">slot</code> attribute's value matches with switcher's <code class="prettyprint">value</code> property.
 * <p> If child content is expensive to render, use <a href="oj.ojDefer.html">oj-defer</a> to defer rendering until child element is made visible. 
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-switcher value="[[selectedValue]]">
 *  &lt;div slot="home">...&lt;div>
 *  &lt;div slot="about">...&lt;div>
 *  &lt;div slot="settings">...&lt;div>
 *  ...
 * &lt;/oj-switcher>
 * </code></pre>
 */


/**
 * Sets a property or a single subproperty for complex properties and notifies the component
 * of the change, triggering a [property]Changed event.
 * 
 * @function setProperty
 * @param {string} property - The property name to set. Supports dot notation for subproperty access.
 * @param {any} value - The new value to set the property to.
 * @return {void}
 * @expose
 * @memberof oj.ojSwitcher
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
 * @memberof oj.ojSwitcher
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
 * @memberof oj.ojSwitcher
 * @instance
 * 
 * @example <caption>Set a batch of properties:</caption>
 * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
 */ 
/**
 * Refreshes the visual state of the component.
 * 
 * @function refresh
 * @return {void}
 * @expose
 * @memberof oj.ojSwitcher
 * @instance
 */ 

/**
 * @member
 * @name value
 * @memberof oj.ojSwitcher
 * @instance
 * @type {string}
 * @default undefined
 * @ojshortdesc Gets and Sets value for this switcher.
 * @desc <code class="prettyprint">value</code> of the switcher. Setting <code class="prettyprint">value</code> will make all child elements with matching <code class="prettyprint">slot</code> attribute as visible and hides elements which are not matching.
 * @example <caption>Initialize the Switcher with the <code class="prettyprint">value</code> attribute specified:</caption>
 *  &lt;oj-switcher value='settings'> ... &lt;/oj-switcher>
 * @example <caption>Read value property:</caption>
 * var selectedValue = mySwitcher.value;
 * @example <caption>Change value property:</caption>
 * mySwitcher.value = 'settings';
 */

/**
 * @ignore
 */
var switcherMetadata =
        {
          "properties": {
            "value": {
              "type": "string",
              "value": ""
            }
          },
          "extension": {
            _CONSTRUCTOR: ojSwitcher,
            _CONTROLS_SUBTREE_HIDDEN: true
          }
        };

/**
 * @constructor
 * @private
 */
function ojSwitcher(context) {
  var ATTR_SWITCHER_SLOT = "slot";
  var SWITCHER_VALUE_ATTR = "value";
  var SWITCHER_ORIG_DISPLAY_STYLE = "_ojSwitcher_orig_display_style";
  var self = this;
  var element = context.element;
  var isInitialRender = true;
  var _slotMap = null;
    
  // Our version of GCC has a bug where the second param of MutationObserver.observe must be of 
  // type MutationObserverInit which isn't a real class that we can instantiate. Work around is to
  // create the MutationObserver on an alias of 'this' and call observe in a different function.
  // TODO Cleanup when we replace GCC with uglify in 5.0.0.
  self._caseElementMutationObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        if (mutation.addedNodes) {
          //For each newly added child node, apply the switcher value 
          Array.prototype.forEach.call(mutation.addedNodes, function (item) {
            if (item.nodeType === 1) {
              var itemSlotAttributeValue = item.getAttribute(ATTR_SWITCHER_SLOT);
              _applyValueToItem(item, itemSlotAttributeValue);
              //force to re calculate slot map nex time
              _resetSlotMap();
            }
          });
        }
        if (mutation.removedNodes) {
          //For each removed child node restore original display style property
          Array.prototype.forEach.call(mutation.removedNodes, function (item) {
            if (item.nodeType === 1) {
              if (item[SWITCHER_ORIG_DISPLAY_STYLE] !== undefined) {
                item.style.display = item[SWITCHER_ORIG_DISPLAY_STYLE];
              }
              //force to re calculate slot map nex time
              _resetSlotMap();
            }
          });
        }
      }
    });
  });

  function _resetSlotMap() {
    _slotMap = null;
  }

  function _getSlotMap() {
    if (!_slotMap) {
      _slotMap = oj.BaseCustomElementBridge.getSlotMap(element);
    }
    return _slotMap;
  }

  function _hide(item) {
    var isCurrentlyVisible = !(item.style.display === "none");
    if (isCurrentlyVisible) {
      item.style.display = "none";
      oj.Components.subtreeHidden(item);
    }
  }

  function _show(item) {
    var isCurrentlyVisible = !(item.style.display === "none");
    if (!isCurrentlyVisible) {
      item.style.display = "";
      oj.Components.subtreeShown(item, isInitialRender ? {'initialRender': true} : undefined);
    } else if (isInitialRender) {
      oj.Components.subtreeShown(item, {'initialRender': true});
    }
  }

  this.createDOM = function() {
    self._caseElementMutationObserver.observe(element, {"childList": true});
  };

  this.updateDOM = function() {
    var slots = _getSlotMap();
    for (var key in slots) {
      slots[key].forEach(function (item) {
        _applyValueToItem(item, key);
      });
    }
    if (isInitialRender)
      isInitialRender = false;
  };

  function _applyValueToItem(item, itemSlotAttributeValue) {
    var switcherValue = element[SWITCHER_VALUE_ATTR];
    if (item[SWITCHER_ORIG_DISPLAY_STYLE] === undefined) {
      Object.defineProperty(item, SWITCHER_ORIG_DISPLAY_STYLE, {'value': item.style.display});
    }
    if (itemSlotAttributeValue === switcherValue) {
      _show(item);
    } else {
      _hide(item);
    }
  }
}

oj.CustomElementBridge.registerMetadata('oj-switcher', null, switcherMetadata);
oj.CustomElementBridge.register('oj-switcher', {'metadata': oj.CustomElementBridge.getMetadata('oj-switcher')});

});