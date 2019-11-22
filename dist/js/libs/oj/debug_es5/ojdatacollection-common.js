/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery'], function(oj, $)
{
  "use strict";


/**
 * This class contains utility methods used by the data collection components (DataGrid, Listview, and Table).
 * @private
 */
var DataCollectionUtils = function DataCollectionUtils() {};
/**
 * @private
 */


DataCollectionUtils._TAB_INDEX = 'tabIndex';
/**
 * @private
 */

DataCollectionUtils._DATA_OJ_TABMOD = 'data-oj-tabmod';
/** ******************* focusable/editable element related methods *****************/

/**
 * Finds all the focusable elements in a node
 * @param {Element} node
 * @param {boolean=} skipVisibilityCheck
 * @return {Element[]} An array of all of the focusable elements in a node
 * @private
 */

DataCollectionUtils.getFocusableElementsInNode = function (node, skipVisibilityCheck) {
  var inputElems = [];
  var nodes = node.querySelectorAll("input, select, button, a, textarea, object, [tabIndex]:not([tabIndex='-1'])");
  var nodeCount = nodes.length; // in IE, each 'option' after 'select' elem will be counted as an input element(and cause duplicate input elems returned)
  // this will cause problem with TAB/Shift-TAB (recognizing whether to go to next cell or to tab within the current cell

  for (var i = 0; i < nodeCount; i++) {
    var elem = nodes[i];

    if (!elem.disabled && (skipVisibilityCheck || elem.style.display !== 'none')) {
      var tabIndex = parseInt(elem.getAttribute(DataCollectionUtils._TAB_INDEX), 10);

      if (isNaN(tabIndex) || tabIndex >= 0) {
        inputElems.push(elem);
      }
    }
  }

  return inputElems;
};
/**
 * Make all focusable elements within the specified element unfocusable
 * @param {Element} element
 * @param {boolean=} skipVisibilityCheck
 * @param {boolean=} excludeActiveElement
 * @return {Element[]} An array of the disabled elements
 * @private
 */


DataCollectionUtils.disableAllFocusableElements = function (element, skipVisibilityCheck, excludeActiveElement) {
  var disabledElems = []; // make all focusable elements non-focusable, since we want to manage tab stops

  var focusElems = DataCollectionUtils.getFocusableElementsInNode(element, skipVisibilityCheck);

  for (var i = 0; i < focusElems.length; i++) {
    if (!excludeActiveElement || focusElems[i] !== document.activeElement) {
      var tabIndex = parseInt(focusElems[i].getAttribute(DataCollectionUtils._TAB_INDEX), 10); // store the tabindex as an attribute

      focusElems[i].setAttribute(DataCollectionUtils._DATA_OJ_TABMOD, tabIndex);
      focusElems[i].setAttribute(DataCollectionUtils._TAB_INDEX, -1);
      disabledElems.push(focusElems[i]);
    }
  }

  return disabledElems;
};
/**
 * Enable all focusable elements within the specified element that were previously disabled
 * @param {Element} element
 * @return {Element[]} An array of the enabled elements
 * @private
 */


DataCollectionUtils.enableAllFocusableElements = function (element) {
  // make all non-focusable elements focusable again
  var focusElems = element.querySelectorAll('[' + DataCollectionUtils._DATA_OJ_TABMOD + ']');

  for (var i = 0; i < focusElems.length; i++) {
    var tabIndex = parseInt(focusElems[i].getAttribute(DataCollectionUtils._DATA_OJ_TABMOD), 10);
    focusElems[i].removeAttribute(DataCollectionUtils._DATA_OJ_TABMOD); // restore tabIndex as needed

    if (isNaN(tabIndex)) {
      focusElems[i].removeAttribute(DataCollectionUtils._TAB_INDEX);
    } else {
      focusElems[i].setAttribute(DataCollectionUtils._TAB_INDEX, tabIndex);
    }
  }

  return focusElems;
};
/**
 * Handle a tab that is pressed when in actionable mode
 * @param {Event} event the event causing the actionable tab
 * @param {Element|undefined|null} element to unset actionable
 * @returns {boolean} true if we have shifted focus within the actionable cell
 * @private
 */


DataCollectionUtils.handleActionableTab = function (event, element) {
  var focusElems = DataCollectionUtils.getFocusableElementsInNode(element);

  if (focusElems.length > 0 && event.target === focusElems[focusElems.length - 1]) {
    // recycle to first focusable element in the cell
    focusElems[0].focus();
    return true;
  } // let the tab go to the next item in the cell on its own


  return false;
};
/**
 * Handle a tab that is pressed when in actionable mode
 * @param {Event} event the event causing the actionable tab
 * @param {Element|undefined|null} element to unset actionable
 * @returns {boolean} true if we have shifted focus within the actionable cell
 * @private
 */


DataCollectionUtils.handleActionablePrevTab = function (event, element) {
  var focusElems = DataCollectionUtils.getFocusableElementsInNode(element);

  if (focusElems.length > 0 && event.target === focusElems[0]) {
    // recycle to last focusable element in the cell
    focusElems[focusElems.length - 1].focus();
    return true;
  } // let the tab go to the previous item in the cell on its own


  return false;
};
/** ******************* general collection utility methods *****************/

/**
 * Get the default scroll bar width of the given element
 * @param {Element} element the element to get the default scroll bar width of
 * @private
 */


DataCollectionUtils.getDefaultScrollBarWidth = function (element) {
  var scrollBarWidth;

  if (element && element.style) {
    // save current styling to ensure it is restored once completed
    var visibility = element.style.visibility;
    var position = element.style.position;
    var overflowY = element.style.overflowY;
    var height = element.style.height;
    var width = element.style.width;
    /* eslint-disable no-param-reassign */

    element.style.visibility = 'hidden';
    element.style.position = 'absolute';
    element.style.overflowY = 'hidden';
    element.style.height = '50px';
    element.style.width = '50px'; // since offsetWidth includes padding and borders that clientWidth does not,
    // first save the initial difference when overflow is hidden to use below

    var initialDiff = element.offsetWidth - element.clientWidth; // set overflow to 'scroll', and then find the difference in offsetWidth and clientWidth
    // compared to the initial difference found above

    element.style.overflowY = 'scroll';
    scrollBarWidth = element.offsetWidth - element.clientWidth - initialDiff;
    element.style.width = width;
    element.style.height = height;
    element.style.overflowY = overflowY;
    element.style.position = position;
    element.style.visibility = visibility;
    /* eslint-enable no-param-reassign */
  }

  return scrollBarWidth;
};
/**
 * Disables unwanted default browser styling on the element specified
 * @param {Element} element the element to disable unwanted browser styling on
 * @private
 */


DataCollectionUtils.disableDefaultBrowserStyling = function (element) {
  // attribute to disable auto links for phone numbers on ie/edge which break accessibility
  element.setAttribute('x-ms-format-detection', 'none');
};
/** ******************* selected KeySet related methods *****************/

/**
 * Checks whether the given KeySet instances represent equivalent sets
 * @param {KeySet} keySet1 the first KeySet
 * @param {KeySet} keySet2 the second KeySet
 * @returns {boolean} true if the given KeySet instances represent equivalent sets
 * @private
 */


DataCollectionUtils.areKeySetsEqual = function (keySet1, keySet2) {
  if (keySet1 === keySet2) {
    return true;
  }

  var isAddAll = keySet1.isAddAll();

  if (isAddAll !== keySet2.isAddAll()) {
    return false;
  }

  var valueSet1;
  var valueSet2;

  if (isAddAll) {
    valueSet1 = keySet1.deletedValues();
    valueSet2 = keySet2.deletedValues();
  } else {
    valueSet1 = keySet1.values();
    valueSet2 = keySet2.values();
  }

  if (valueSet1.size !== valueSet2.size) {
    return false;
  }

  var valueIterator1 = valueSet1.values();
  var valueIterator2 = valueSet2.values();
  var result1 = valueIterator1.next();
  var result2 = valueIterator2.next();

  while (!result1.done) {
    if (!oj.KeyUtils.equals(result1.value, result2.value)) {
      return false;
    }

    result1 = valueIterator1.next();
    result2 = valueIterator2.next();
  }

  return true;
};

;return DataCollectionUtils;
});