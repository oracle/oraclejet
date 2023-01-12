/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['jquery', 'ojs/ojcore-base', 'ojs/ojdomutils'], function ($, oj, DomUtils) { 'use strict';

  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

  /**
   * Focus utilities.
   * @ignore
   */
  const FocusUtils = { _TABBABLE: ':tabbable,iframe' };

  // These functions inspired by AdfFocusUtils

  /**
   * Tests whether the specified element contains the keyboard focus.
   * @param {!Element} element Element for which to check if it contains focus.
   * @returns {boolean} True if the element contains focus, false otherwise.
   */
  FocusUtils.containsFocus = function (element) {
    var activeElem = document.activeElement;
    // FIX : if either elem is undefined, just return false
    if (!element || !activeElem) {
      return false;
    }

    return DomUtils.isAncestorOrSelf(element, activeElem);
  };

  /**
   * Sets focus to the specified element.
   * @param {!Element} element Element to focus.
   */
  FocusUtils.focusElement = function (element) {
    element.focus();
  };

  /**
   * Sets focus to the first tabbable element inside the given element, which
   * may be the given element itself.
   * @param {!Element} element Element to start searching for a tabbable element in.
   * @returns {Element} The DOM element that was focused, if any.
   */
  FocusUtils.focusFirstTabStop = function (element) {
    var focusElement = FocusUtils.getFirstTabStop(element);

    if (focusElement) {
      FocusUtils.focusElement(focusElement);
    }

    return focusElement;
  };

  /**
   * Return true if the activeElement is the first tabbable. Used to ensure that tabbing cycles through dialogs/popups.
   * @param {!Element} element Element containing tabbable elements.
   * @returns {boolean} <code>true</code> if the active element is the first tabbable.
   */
  FocusUtils.isFirstActiveElement = function (element) {
    var jqElem = $(element);
    var jqFocusables = jqElem.find(FocusUtils._TABBABLE);

    if (jqFocusables == null || jqFocusables.length === 0) return false;
    var first = jqFocusables[0];

    if (document.activeElement === first) return true;

    //
    // Return true if the activeElement is in the "first tabble set".
    // Check to see if the first tabbable and the active element are members
    // of the same radio set.
    // If this is the case, then return true.
    //
    if (
      first.name === document.activeElement.name &&
      first.type === 'radio' &&
      document.activeElement.type === 'radio'
    ) {
      return true;
    }
    return false;
  };

  /**
   * Return true if the activeElement is the last tabbable. Used to ensure that tabbing cycles through dialogs/popups.
   * @param {!Element} element Element containing tabbable elements.
   * @returns {boolean} <code>true</code> if the active element is the last tabbable.
   */
  FocusUtils.isLastActiveElement = function (element) {
    var jqElem = $(element);
    var jqFocusables = jqElem.find(FocusUtils._TABBABLE);

    if (jqFocusables == null || jqFocusables.length === 0) return false;
    var last = jqFocusables[jqFocusables.length - 1];

    if (document.activeElement === last) return true;

    //
    // Return true if the activeElement is in the "first tabble set".
    // Check to see if the last tabbable and the active element are members
    // of the same radio set.
    // If this is the case, then return true.
    //
    if (
      last.name === document.activeElement.name &&
      last.type === 'radio' &&
      document.activeElement.type === 'radio'
    ) {
      return true;
    }
    return false;
  };

  /**
   * Get the first tabbable element inside the given element, which may be the
   * given element itself.
   * @param {!Element} element Element to start searching for a tabbable element in.
   * @returns {Element} The first tabbable element inside the given element.
   */
  FocusUtils.getFirstTabStop = function (element) {
    var jqElem = $(element);
    if (jqElem.is(FocusUtils._TABBABLE)) {
      return element;
    }
    var jqFocusables = jqElem.find(FocusUtils._TABBABLE);
    if (jqFocusables && jqFocusables.length > 0) {
      //
      // Handle set-based content (radiosets).
      // Return the first selected radioset item.
      // Note that there are two cases
      //   Common case - a single radioset
      //   Other case - multiple radiosets
      // In both cases we return the first selected radioset item.
      //
      if (jqFocusables[0].classList.contains('oj-radio')) {
        var selectedItem = jqFocusables.filter('.oj-selected.oj-radio');
        if (selectedItem && selectedItem.length) {
          return selectedItem[0];
        }
        return jqFocusables[0];
      }
      return jqFocusables[0];
    }
    return null;
  };

  /**
   * Get the last tabbable element inside the given element, which may be the
   * given element itself.
   * @param {!Element} element Element to start searching for a tabbable element in.
   * @returns {Element} The last tabbable element inside the given element.
   */
  FocusUtils.getLastTabStop = function (element) {
    var jqElem = $(element);
    var jqFocusables = jqElem.find(FocusUtils._TABBABLE);

    if (jqFocusables && jqFocusables.length > 0) {
      //
      // Handle set-based content (radiosets).
      // Return the last selected radioset item.
      //
      if (jqFocusables[jqFocusables.length - 1].classList.contains('oj-radio')) {
        var selectedItem = jqFocusables.filter('.oj-selected.oj-radio');
        if (selectedItem && selectedItem.length) {
          return selectedItem[selectedItem.length - 1];
        }
        return jqFocusables[jqFocusables.length - 1];
      }
      return jqFocusables[jqFocusables.length - 1];
    }
    return null;
  };

  /**
   * Extends the jquery ":focusable" pseudo selector check for a Safari browser specific
   * exception - an anchor element not having a tabindex attribute.
   *
   * @param {Element} element target dom element to test if it will take focus
   * @returns {boolean} <code>true</code> if the target element is focusable
   */
  FocusUtils.isFocusable = function (element) {
    if ($(element).is(':focusable')) {
      // An anchor element in safari will not take focus unless it has a tabindex.
      // http://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#Clicking_and_focus
      if (
        element.nodeName === 'A' &&
        !element.hasAttribute('tabindex') &&
        oj.AgentUtils.getAgentInfo().browser === oj.AgentUtils.BROWSER.SAFARI
      ) {
        return false;
      }
      return true;
    }

    return false;
  };

  return FocusUtils;

});
