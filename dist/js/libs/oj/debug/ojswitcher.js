/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
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
 * @since 4.0.0
 * @ojstatus preview
 * @classdesc The switcher element dynamically decides which child element should be made visible. It will make a child element visible only if it's <code class="prettyprint">slot</code> attribute's value matches with switcher's <code class="prettyprint">value</code> property.
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
 * @param {*} value - The new value to set the property to.
 * 
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
 * @return {*}
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
 * 
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
 * 
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
 * @default <code class="prettyprint">undefined</code>
 * @desc <code class="prettyprint">value</code> of the switcher. Setting <code class="prettyprint">value</code> will make all child elements with matching <code class="prettyprint">slot</code> attribute as visible and hides elements which are not matching.
 * @example <caption>Initialize the Switcher with the <code class="prettyprint">value</code> attribute specified:</caption>
 *  &lt;oj-switcher value='settings'> ... &lt;/oj-switcher>
 * @example <caption>Read value property:</caption>
 * var selectedValue = mySwitcher.value;
 * @example <caption>Change value property:</caption>
 * mySwitcher.value = 'settings';
 */

function renderer(ele) {
  var switcher = ele['_ojSwitcher'];
  var isInitialRender = false;
  if (!switcher) {
    isInitialRender = true;
    switcher = new _ojSwitcher(ele);
    switcher.init();
    Object.defineProperty(ele, '_ojSwitcher', {'value': switcher});
  }
  switcher.applyValue(isInitialRender);
};

var switcherMetadata =
        {
          "properties": {
            "value": {
              "type": "string"
            }
          },
          "extension": {
            _RENDER_FUNC: renderer
          }
        };
/**
 * @constructor
 * @private
 */
function _ojSwitcher(element) {
  var _ATTR_SWITCHER_SLOT = "slot",
          _SWITCHER_VALUE_ATTR = "value",
          _SWITCHER_ORIG_DISPLAY_STYLE = "_ojSwitcher_orig_display_style",
          _ELEMENT_MUTATIONS_CONFIG,
          self = this;

  _ELEMENT_MUTATIONS_CONFIG = {
    "childList": true
  };

  self._slotMap = null;

  self._caseElementMutationObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        if (mutation.addedNodes) {
          //For each newly added child node, apply the switcher value 
          Array.prototype.forEach.call(mutation.addedNodes, function (item) {
            if (item.nodeType === 1) {
              var itemSlotAttributeValue = item.getAttribute(_ATTR_SWITCHER_SLOT);
              self._applyValueToItem(item, itemSlotAttributeValue, false);
              //force to re calculate slot map nex time
              self._resetSlotMap();
            }
          });
        }
        if (mutation.removedNodes) {
          //For each removed child node restore original display style property
          Array.prototype.forEach.call(mutation.removedNodes, function (item) {
            if (item.nodeType === 1) {
              if (item[_SWITCHER_ORIG_DISPLAY_STYLE] !== undefined) {
                item.style.display = item[_SWITCHER_ORIG_DISPLAY_STYLE];
              }
              //force to re calculate slot map nex time
              self._resetSlotMap();
            }
          });
        }
      }
    });
  });

  self._resetSlotMap = function () {
    self._slotMap = null;
  };

  self._getSlotMap = function () {
    if (!self._slotMap) {
      self._slotMap = oj.CustomElementBridge.getSlotMap(element);
    }
    return self._slotMap;
  };

  self.init = function () {
    self._caseElementMutationObserver.observe(element, _ELEMENT_MUTATIONS_CONFIG);
  };


  function _hide(item) {
    var isCurrentlyVisible = !(item.style.display === "none");
    if (isCurrentlyVisible) {
      item.style.display = "none";
      oj.Components.subtreeHidden(item);
    }
  }

  function _show(item, isInitialRender) {
    var isCurrentlyVisible = !(item.style.display === "none");
    if (!isCurrentlyVisible) {
      item.style.display = "";
      oj.Components.subtreeShown(item, isInitialRender ? {'initialRender': true} : undefined);
    } else if (isInitialRender) {
      oj.Components.subtreeShown(item, {'initialRender': true});
    }
  }

  self.applyValue = function (isInitialRender) {
    var slots = self._getSlotMap();
    for (var key in slots) {
      slots[key].forEach(function (item) {
        self._applyValueToItem(item, key, isInitialRender);
      });
    }
  };

  self._applyValueToItem = function (item, itemSlotAttributeValue, isInitialRender) {
    var switcherValue = element[_SWITCHER_VALUE_ATTR];
    if (item[_SWITCHER_ORIG_DISPLAY_STYLE] === undefined) {
      Object.defineProperty(item, _SWITCHER_ORIG_DISPLAY_STYLE, {'value': item.style.display});
    }
    if (itemSlotAttributeValue === switcherValue) {
      _show(item, isInitialRender);
    } else {
      _hide(item);
    }
  }

}
oj.CustomElementBridge.registerMetadata('oj-switcher', null, switcherMetadata);
oj.CustomElementBridge.register('oj-switcher', {'metadata': oj.CustomElementBridge.getMetadata('oj-switcher')});
});
