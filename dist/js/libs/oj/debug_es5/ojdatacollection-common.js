/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
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
  var inputElems = []; // a nodes without href are not focusable

  var nodes = node.querySelectorAll("input, select, button, a[href], textarea, object, [tabIndex]:not([tabIndex='-1'])");
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

      focusElems[i].setAttribute(DataCollectionUtils._DATA_OJ_TABMOD, tabIndex); // @HTMLUpdateOK

      focusElems[i].setAttribute(DataCollectionUtils._TAB_INDEX, -1); // @HTMLUpdateOK

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
      focusElems[i].setAttribute(DataCollectionUtils._TAB_INDEX, tabIndex); // @HTMLUpdateOK
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
/**
 * Merges additional styling with an element's existing styling.
 * @param {Element} element the element to apply the merged styling to
 * @param {string} initStyle the current style string of the element
 * @param {string} addedStyle the additional style string to apply to the element
 */


DataCollectionUtils.applyMergedInlineStyles = function (element, initStyle, addedStyle) {
  var addedStyleObj = DataCollectionUtils.convertStringToStyleObj(addedStyle);
  var initStyleObj = DataCollectionUtils.convertStringToStyleObj(initStyle);
  var mergedStyle = Object.assign({}, addedStyleObj, initStyleObj);
  DataCollectionUtils.applyStyleObj(element, mergedStyle);
};
/**
 * Converts an HTML inline style string to a style object whose keys represent style properties
 * and whose values represent the style values.
 * @param {string} the HTML inline style string to be converted
 * @private
 */


DataCollectionUtils.convertStringToStyleObj = function (styleString) {
  var retObj = {};

  if (styleString.split) {
    var splitArr = styleString.split(';');

    for (var i = 0; i < splitArr.length; i++) {
      var property = splitArr[i];

      if (property !== '') {
        var propArr = property.split(':');

        if (propArr.length === 2) {
          retObj[propArr[0].trim()] = propArr[1].trim();
        }
      }
    }
  }

  return retObj;
};
/**
 * Applies an object whose keys represent style properties and whose values represent the style
 * values to a given element.
 * @param {element} the element to apply the style object to
 * @param {Object} the style object to be converted
 * @private
 */


DataCollectionUtils.applyStyleObj = function (element, styleObj) {
  var stylePropArr = Object.keys(styleObj);
  var styleValArr = Object.values(styleObj);

  for (var i = 0; i < stylePropArr.length; i++) {
    /* eslint-disable no-param-reassign */
    element.style[stylePropArr[i]] = styleValArr[i];
  }
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
/** **************** keyboard event handling methods ****************** */


DataCollectionUtils.KEYBOARD_KEYS = {
  _SPACEBAR: ' ',
  _SPACEBAR_IE: 'SpaceBar',
  _SPACEBAR_CODE: 32,
  _ENTER: 'Enter',
  _ENTER_CODE: 13,
  _UP: 'ArrowUp',
  _UP_IE: 'Up',
  _UP_CODE: 38,
  _DOWN: 'ArrowDown',
  _DOWN_IE: 'Down',
  _DOWN_CODE: 40,
  _LEFT: 'ArrowLeft',
  _LEFT_IE: 'Left',
  _LEFT_CODE: 37,
  _RIGHT: 'ArrowRight',
  _RIGHT_IE: 'Right',
  _RIGHT_CODE: 39,
  _HOME: 'Home',
  _HOME_CODE: 36,
  _END: 'End',
  _END_CODE: 35,
  _TAB: 'Tab',
  _TAB_CODE: 9,
  _ESCAPE: 'Escape',
  _ESCAPE_IE: 'Esc',
  _ESCAPE_CODE: 27,
  _F2: 'F2',
  _F2_CODE: 113
};
/**
 * @private
 */

DataCollectionUtils.isEnterKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._ENTER || eventKey === DataCollectionUtils.KEYBOARD_KEYS._ENTER_CODE;
};
/**
 * @private
 */


DataCollectionUtils.isSpaceBarKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._SPACEBAR || eventKey === DataCollectionUtils.KEYBOARD_KEYS._SPACEBAR_IE || eventKey === DataCollectionUtils.KEYBOARD_KEYS._SPACEBAR_CODE;
};
/**
 * @private
 */


DataCollectionUtils.isEscapeKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._ESCAPE || eventKey === DataCollectionUtils.KEYBOARD_KEYS._ESCAPE_IE || eventKey === DataCollectionUtils.KEYBOARD_KEYS._ESCAPE_CODE;
};
/**
 * @private
 */


DataCollectionUtils.isTabKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._TAB || eventKey === DataCollectionUtils.KEYBOARD_KEYS._TAB_CODE;
};
/**
 * @private
 */


DataCollectionUtils.isF2KeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._F2 || eventKey === DataCollectionUtils.KEYBOARD_KEYS._F2_CODE;
};
/**
 * @private
 */


DataCollectionUtils.isHomeKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._HOME || eventKey === DataCollectionUtils.KEYBOARD_KEYS._HOME_CODE;
};
/**
 * @private
 */


DataCollectionUtils.isEndKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._END || eventKey === DataCollectionUtils.KEYBOARD_KEYS._END_CODE;
};
/**
 * @private
 */


DataCollectionUtils.isArrowUpKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._UP || eventKey === DataCollectionUtils.KEYBOARD_KEYS._UP_IE || eventKey === DataCollectionUtils.KEYBOARD_KEYS._UP_CODE;
};
/**
 * @private
 */


DataCollectionUtils.isArrowDownKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._DOWN || eventKey === DataCollectionUtils.KEYBOARD_KEYS._DOWN_IE || eventKey === DataCollectionUtils.KEYBOARD_KEYS._DOWN_CODE;
};
/**
 * @private
 */


DataCollectionUtils.isArrowLeftKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._LEFT || eventKey === DataCollectionUtils.KEYBOARD_KEYS._LEFT_IE || eventKey === DataCollectionUtils.KEYBOARD_KEYS._LEFT_CODE;
};
/**
 * @private
 */


DataCollectionUtils.isArrowRightKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._RIGHT || eventKey === DataCollectionUtils.KEYBOARD_KEYS._RIGHT_IE || eventKey === DataCollectionUtils.KEYBOARD_KEYS._RIGHT_CODE;
};

;return DataCollectionUtils;
});