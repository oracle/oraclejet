/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'jquery', 'ojs/ojthemeutils', 'ojs/ojcomponentcore', 'ojs/ojlogger', 'ojs/ojcontext', 'ojs/ojconfig', 'ojs/ojdomutils', 'touchr'], function (oj, $, ThemeUtils, Components, Logger, Context, Config, DomUtils, touchr) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

var __oj_conveyor_belt_metadata = 
{
  "properties": {
    "arrowVisibility": {
      "type": "string",
      "writeback": true,
      "enumValues": [
        "auto",
        "hidden",
        "visible"
      ]
    },
    "contentParent": {
      "type": "string",
      "writeback": true
    },
    "orientation": {
      "type": "string",
      "writeback": true,
      "enumValues": [
        "horizontal",
        "vertical"
      ],
      "value": "horizontal"
    },
    "scrollPosition": {
      "type": "number",
      "writeback": true,
      "value": 0
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "tipArrowNext": {
          "type": "string"
        },
        "tipArrowPrevious": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "getProperty": {},
    "refresh": {},
    "scrollElementIntoView": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
  /* global __oj_conveyor_belt_metadata:false */
  (function () {
    __oj_conveyor_belt_metadata.extension._WIDGET_NAME = 'ojConveyorBelt';
    oj.CustomElementBridge.register('oj-conveyor-belt', { metadata: __oj_conveyor_belt_metadata });
  })();

  /*
   ** Important:
   ** - This file is designed to be shared verbatim among the ADFui products.
   ** - Do not add framework-specific dependencies in this file (it must be self-contained).
   ** - Do not change this file without testing it in other ADFui products (ADF Faces, JET, etc.).
   */

  /**
   * Constructor.
   * @param {Object} elem DOM element associated with the conveyor
   * @param {string} orientation Direction of scrolling, either horizontal or vertical
   * @param {Object} contentParent DOM element whose children are the items to scroll
   * @param {boolean} bRtl True if the reading direction is right-to-left, otherwise false
   * @param {Object} buttonInfo Map of properties for the following button information:
   *  - arrowVisibility: 'visible'/'hidden' if arrow buttons should be visible/hidden
   *  - prevButtonStyleClass: Style class name to use for the scroll previous button,
   *  - nextButtonStyleClass: Style class name to use for the scroll next button,
   *  - prevButtonIcon: Icon element to use for the scroll previous button,
   *  - nextButtonIcon: Icon element to use for the scroll next button,
   * @param {Object} callbackInfo Map of properties for the following callback information:
   *  - scrollFunc: Callback function to animate scrolling a DOM element,
   *  - addResizeListener: Callback function to add a resize listener for a DOM element
   *  - removeResizeListener: Callback function to remove a resize listener for a DOM element
   *  - addStyleClassName: Callback function to add a style class name to a DOM element
   *  - removeStyleClassName: Callback functin to remove a style class name from a DOM element
   *  - hasStyleClassName: Callback function to check whether a style class name is applied
   *    to a DOM element,
   *  - filterContentElements: Callback function to filter the array of conveyor content elements,
   *  - subtreeAttached: Callback function to notify when a DOM subtree is attached,
   *  - subtreeDetached: Callback function to notify when a DOM subtree is detached,
   *  - addBusyState: Callback function to add a busy state to the busy context,
   *    has changed
   * @param {Object} styleInfo Map of properties for the following style information:
   *  - overflowContainerStyleClass: Style class name for the overflow container DOM element,
   *  - contentContainerStyleClass: Style class name for the content container DOM element,
   *  - itemStyleClass: Style class name for the DOM element of an item in the conveyor,
   *  - hiddenStyleClass: Style class name used to hide a DOM element
   * @param {Object} agentInfo Browser user agent information.
   * @class ConveyorBeltCommon
   * @memberof ConveyorBeltCommon
   * @protected
   * @constructor
   * @ignore
   * @ojtsignore
   */
  function ConveyorBeltCommon(elem, options, buttonInfo, callbackInfo, styleInfo) {
    //  orientation, contentParent, bRtl, buttonInfo, callbackInfo, styleInfo) {
    this._elem = elem;
    this._orientation = options.orientation;
    this._contentParent = options.contentParent;
    this._scrollPosition = options.scrollPosition;
    this._bRtl = options.bRtl;
    this._arrowVisibility = buttonInfo.arrowVisibility;
    this._prevButtonStyleClass = buttonInfo.prevButtonStyleClass;
    this._nextButtonStyleClass = buttonInfo.nextButtonStyleClass;
    this._prevButtonIcon = buttonInfo.prevButtonIcon;
    this._nextButtonIcon = buttonInfo.nextButtonIcon;

    this._scrollFunc = callbackInfo.scrollFunc;
    this._addResizeListenerFunc = callbackInfo.addResizeListener;
    this._removeResizeListenerFunc = callbackInfo.removeResizeListener;
    this._addStyleClassNameFunc = callbackInfo.addStyleClassName;
    this._removeStyleClassNameFunc = callbackInfo.removeStyleClassName;
    this._hasStyleClassNameFunc = callbackInfo.hasStyleClassName;
    this._filterContentElementsFunc = callbackInfo.filterContentElements;
    this._subtreeDetachedFunc = callbackInfo.subtreeDetached;
    this._subtreeAttachedFunc = callbackInfo.subtreeAttached;
    this._addBusyStateFunc = callbackInfo.addBusyState;
    this._handleFocus = callbackInfo.handleFocus;
    this._setScrollPositionProperty = callbackInfo.setScrollPositionProperty;

    this._overflowContainerStyleClass = styleInfo.overflowContainerStyleClass;
    this._contentContainerStyleClass = styleInfo.contentContainerStyleClass;
    this._itemStyleClass = styleInfo.itemStyleClass;
    this._hiddenStyleClass = styleInfo.hiddenStyleClass;

    this._bExternalScroll = true;
    this._firstVisibleItemIndex = 0;
    this._atStart = true;
    this._atEnd = false;
  }

  /**
   * Setup the conveyor belt.
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   */
  ConveyorBeltCommon.prototype.setup = function () {
    var self = this;
    var cbcClass = ConveyorBeltCommon;
    // create the content and overflow containers
    this._createInnerContainers();

    // create the next/prev buttons
    if (this._arrowVisibility === 'visible') {
      this._createPrevButton(this._prevButtonStyleClass, this._prevButtonIcon);
      this._createNextButton(this._nextButtonStyleClass, this._nextButtonIcon);

      var nextButton = this._nextButton;
      this._buttonWidth = Math.round($(nextButton).outerWidth(true));
      this._buttonHeight = Math.round($(nextButton).outerHeight(true));
    } else {
      this._buttonWidth = 0;
      this._buttonHeight = 0;
    }

    // hide the buttons until we know we need them
    this._hidePrevButton();
    this._hideNextButton();

    // handle the mouse wheel on the whole conveyor
    this._mouseWheelListener = function (event) {
      self._handleMouseWheel(event);
    };
    cbcClass._addBubbleEventListener(this._elem, 'mousewheel', this._mouseWheelListener, false);
    cbcClass._addBubbleEventListener(this._elem, 'wheel', this._mouseWheelListener, false);

    // handle swipe gestures on the overflow container, which excludes the next/prev buttons
    this._touchStartListener = function (event) {
      self._handleTouchStart(event);
    };
    cbcClass._addBubbleEventListener(
      this._overflowContainer,
      'touchstart',
      this._touchStartListener,
      true
    );
    this._touchMoveListener = function (event) {
      self._handleTouchMove(event);
    };
    cbcClass._addBubbleEventListener(
      this._overflowContainer,
      'touchmove',
      this._touchMoveListener,
      false
    );
    this._touchEndListener = function (event) {
      self._handleTouchEnd(event);
    };
    cbcClass._addBubbleEventListener(this._overflowContainer, 'touchend', this._touchEndListener);
    cbcClass._addBubbleEventListener(this._overflowContainer, 'touchcancel', this._touchEndListener);

    this._handleKeyDownFunc = function (event) {
      self._handleKeyDown(event);
    };

    cbcClass._addBubbleEventListener(this._elem, 'keydown', this._handleKeyDownFunc);

    this._handleFocusListener = function (event) {
      self._handleFocus(event);
    };
    this._elem.addEventListener('focus', this._handleFocusListener, {
      passive: false,
      capture: true
    });
    // initial value from the scrollPosition option
    this._origScroll = this._scrollPosition;

    // clear any old sizes so that new sizes will be calculated
    this._clearCachedSizes();
    // adjust overflow size
    this._adjustOverflowSize(true);
    // handle an initial resize
    this._handleResize(true);

    // eslint-disable-next-line no-unused-vars
    this._handleResizeFunc = function (width, height) {
      self._handleResize(false);
    };
    // listen for resizes on both the conveyor itself and on its content
    this._addResizeListenerFunc(this._elem, this._handleResizeFunc);
    this._addResizeListenerFunc(this._contentContainer, this._handleResizeFunc);

    // notify the child that it's being re-attached to the DOM AFTER attaching it
    // (the detached notification happened in _reparentChildrenToContentContainer())
    this._subtreeAttachedFunc(this._contentContainer);
  };

  /**
   * Handle a keydown event.
   * @param {Event} event <code class="prettyprint">jQuery</code> event object.
   * @return {void}
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._handleKeyDown = function (event) {
    if (event.defaultPrevented) {
      return; // Should do nothing if the default action has been cancelled
    }
    var tabindexAttr = this._elem.getAttribute('tabindex');
    if (tabindexAttr == null || tabindexAttr < 0) {
      return;
    }
    var key = event.key || event.keyCode;
    if (this._orientation === 'horizontal') {
      switch (key) {
        case ConveyorBeltCommon._KEYBOARD_KEYS._RIGHT:
        case ConveyorBeltCommon._KEYBOARD_KEYS._RIGHT_IE:
        case ConveyorBeltCommon._KEYBOARD_KEYS._RIGHT_CODE:
          if (this._bRtl) {
            this._scrollPrevOnKeyDown(event);
          } else {
            this._scrollNextOnKeyDown(event);
          }
          break;
        case ConveyorBeltCommon._KEYBOARD_KEYS._LEFT:
        case ConveyorBeltCommon._KEYBOARD_KEYS._LEFT_IE:
        case ConveyorBeltCommon._KEYBOARD_KEYS._LEFT_CODE:
          if (this._bRtl) {
            this._scrollNextOnKeyDown(event);
          } else {
            this._scrollPrevOnKeyDown(event);
          }
          break;
        default:
          return;
      }
    }

    if (this._orientation === 'vertical') {
      switch (key) {
        case ConveyorBeltCommon._KEYBOARD_KEYS._DOWN:
        case ConveyorBeltCommon._KEYBOARD_KEYS._DOWN_IE:
        case ConveyorBeltCommon._KEYBOARD_KEYS._DOWN_CODE:
          this._scrollNextOnKeyDown(event);
          break;
        case ConveyorBeltCommon._KEYBOARD_KEYS._UP:
        case ConveyorBeltCommon._KEYBOARD_KEYS._UP_IE:
        case ConveyorBeltCommon._KEYBOARD_KEYS._UP_CODE:
          this._scrollPrevOnKeyDown(event);
          break;
        default:
      }
    }
  };

  ConveyorBeltCommon.prototype._scrollNextOnKeyDown = function (event) {
    if (this._constrainScroll(this._calcNextScroll()) !== this._getCurrScroll()) {
      this._scrollNext();
      event.preventDefault();
    }
  };

  ConveyorBeltCommon.prototype._scrollPrevOnKeyDown = function (event) {
    if (this._constrainScroll(this._calcPrevScroll()) !== this._getCurrScroll()) {
      this._scrollPrev();
      event.preventDefault();
    }
  };

  /**
   * Destroy the conveyor belt.
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   */
  ConveyorBeltCommon.prototype.destroy = function () {
    // FIX : resolve busy state when destroying
    this._resolveBusyState();

    var elem = this._elem;
    var cbcClass = ConveyorBeltCommon;
    cbcClass._removeBubbleEventListener(elem, 'mousewheel', this._mouseWheelListener, false);
    cbcClass._removeBubbleEventListener(elem, 'wheel', this._mouseWheelListener, false);
    cbcClass._removeBubbleEventListener(
      this._overflowContainer,
      'touchstart',
      this._touchStartListener,
      true
    );
    cbcClass._removeBubbleEventListener(
      this._overflowContainer,
      'touchmove',
      this._touchMoveListener,
      false
    );
    cbcClass._removeBubbleEventListener(this._overflowContainer, 'touchend', this._touchEndListener);
    cbcClass._removeBubbleEventListener(
      this._overflowContainer,
      'touchcancel',
      this._touchEndListener
    );
    cbcClass._removeBubbleEventListener(this._overflowContainer, 'scroll', this._scrollListener);
    cbcClass._removeBubbleEventListener(this._elem, 'keydown', this._handleKeyDownFunc);
    this._elem.removeEventListener('focus', this._handleFocusListener, {
      passive: false,
      capture: true
    });
    this._mouseWheelListener = null;
    this._touchStartListener = null;
    this._touchMoveListener = null;
    this._touchEndListener = null;
    this._scrollListener = null;
    this._handleFocusListener = null;

    // remove listeners before reparenting original children and clearing member
    // variables
    this._removeResizeListenerFunc(elem, this._handleResizeFunc);
    this._removeResizeListenerFunc(this._contentContainer, this._handleResizeFunc);
    this._handleResizeFunc = null;

    // move the original content children from the _contentContainer back to the
    // original DOM element
    this._reparentChildrenFromContentContainer(this._contentContainer, elem);

    // the content container is a child of the overflow container
    elem.removeChild(this._overflowContainer);
    this._overflowContainer = null;

    if (this._nextButton != null && this._prevButton != null) {
      elem.removeChild(this._nextButton);
      elem.removeChild(this._prevButton);
      this._nextButton = null;
      this._prevButton = null;
    }
    this._contentContainer = null;
    this._clearCachedSizes();

    this._elem = null;
    this._scrollFunc = null;
    this._addResizeListenerFunc = null;
    this._removeResizeListenerFunc = null;
    this._addStyleClassNameFunc = null;
    this._removeStyleClassNameFunc = null;
    this._hasStyleClassNameFunc = null;
    this._filterContentElementsFunc = null;
    this._subtreeDetachedFunc = null;
    this._subtreeAttachedFunc = null;
    this._addBusyStateFunc = null;

    this._contentParent = null;
  };

  /**
   * Handle a component resize.
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   */
  ConveyorBeltCommon.prototype.handleResize = function () {
    this._handleResize(false);
  };

  /**
   * Set the scroll position.
   * @param {number} scroll Desired logical scroll position
   * @param {boolean} bImmediate True to make the change immediately, false to animate it
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   */
  ConveyorBeltCommon.prototype.setScroll = function (scroll, bImmediate) {
    this._setCurrScroll(scroll, bImmediate);
  };

  /**
   * Get the current scroll position.
   * @return {number} Logical scroll position
   * @memberof ConveyorBeltCommon
   * @instance
   */
  ConveyorBeltCommon.prototype.getScroll = function () {
    return this._getCurrScroll();
  };

  /**
   * Reparent the DOM child nodes from their old parent node to a new parent
   * content container node.
   * @param {Object} fromNode Old parent DOM node
   * @param {Object} toNode New parent DOM node
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._reparentChildrenToContentContainer = function (fromNode, toNode) {
    var fromNodeChildren = fromNode.childNodes;
    while (fromNodeChildren.length > 0) {
      var child = fromNodeChildren[0];

      // notify the child that it's being detached from the DOM BEFORE detaching it
      // (the re-attached notification will happen in setup())
      this._subtreeDetachedFunc(child);

      toNode.appendChild(child); // @HTMLUpdateOK

      if (child.nodeType === 1 && this._itemStyleClass) {
        this._addStyleClassNameFunc(child, this._itemStyleClass);
      }
    }
  };

  /**
   * Reparent the DOM child nodes from the content container to a new
   * parent node.
   * @param {Object} fromNode Old parent DOM node
   * @param {Object} toNode New parent DOM node
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._reparentChildrenFromContentContainer = function (fromNode, toNode) {
    var children = fromNode.childNodes;
    while (children.length > 0) {
      var child = children[0];
      toNode.appendChild(child); // @HTMLUpdateOK

      if (child.nodeType === 1 && this._itemStyleClass) {
        this._removeStyleClassNameFunc(child, this._itemStyleClass);
      }
    }
  };

  /**
   * Get the computed style of the given DOM element.
   * @param {Object} elem DOM element
   * @return {Object} Computed style for the element
   * @memberof ConveyorBeltCommon
   * @private
   */
  ConveyorBeltCommon._getComputedStyle = function (elem) {
    var elemOwnerDoc = elem.ownerDocument;
    var defView = elemOwnerDoc.defaultView;
    return defView.getComputedStyle(elem, null);
  };

  /**
   * Get the inner width of the given DOM element (inside borders and padding).
   * @param {Object} elem DOM element
   * @return {number} Width of element
   * @memberof ConveyorBeltCommon
   * @private
   */
  ConveyorBeltCommon._getElemInnerWidth = function (elem) {
    var cbcClass = ConveyorBeltCommon;
    var computedStyle = cbcClass._getComputedStyle(elem);
    // the computedStyle width is the inner width of the elem
    return cbcClass._getCSSLengthAsInt(computedStyle.width);
  };

  /**
   * Get the inner height of the given DOM element (inside borders and padding).
   * @param {Object} elem DOM element
   * @return {number} Height of element
   * @memberof ConveyorBeltCommon
   * @private
   */
  ConveyorBeltCommon._getElemInnerHeight = function (elem) {
    var cbcClass = ConveyorBeltCommon;
    var computedStyle = cbcClass._getComputedStyle(elem);
    // the computedStyle height is the inner height of the elem
    return cbcClass._getCSSLengthAsInt(computedStyle.height);
  };

  /**
   * Get the int value of a CSS length.
   * @param {string} cssLength cssLength as a string
   * @return {number} cssLength as an int
   * @memberof ConveyorBeltCommon
   * @private
   */
  ConveyorBeltCommon._getCSSLengthAsInt = function (cssLength) {
    // this function copied from AdfAgent.getCSSLengthAsInt
    if (cssLength.length > 0 && cssLength !== 'auto') {
      // Fix  - CONVEYOR BELT TAB SCROLLING DOESN'T SCROLL THE LAST ITEM ENTIRELY INTO VIEW
      // offsetWidth/offsetHeight property will round the value to an integer
      // similarly, round the cssLength to the nearest integer
      var intLength = Math.round(parseFloat(cssLength));

      if (isNaN(intLength)) {
        intLength = 0;
      }

      return intLength;
    }
    return 0;
  };

  /**
   * Add a bubble event listener to the given DOM node.
   * @param {Object} node DOM node
   * @param {string} type Event type
   * @param {function(Event):void} listener Listener function
   * @param {boolean} passive passive option for listener
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @private
   */
  ConveyorBeltCommon._addBubbleEventListener = function (node, type, listener, passive) {
    node.addEventListener(type, listener, { passive, capture: false });
  };

  /**
   * Remove a bubble event listener from the given DOM node.
   * @param {Object} node DOM node
   * @param {string} type Event type
   * @param {function(Event):void} listener Listener function
   * @param {boolean} passive passive option for listener
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @private
   */
  ConveyorBeltCommon._removeBubbleEventListener = function (node, type, listener, passive) {
    node.removeEventListener(type, listener, { passive, capture: false });
  };

  /**
   * Get the wheel delta from a mousewheel event.
   * @param {Event} event Event object
   * @return {number} Wheel delta
   * @memberof ConveyorBeltCommon
   * @private
   */
  ConveyorBeltCommon._getWheelDelta = function (event) {
    var wheelDelta = 0;
    if (event.deltaY != null || event.deltaX != null) {
      var deltaX = Math.abs(event.deltaX);
      var deltaY = Math.abs(event.deltaY);
      if (deltaX > deltaY) {
        wheelDelta = -event.deltaX;
      } else {
        wheelDelta = -event.deltaY;
      }
    } else if (event.wheelDelta != null) {
      var wheelDeltaX = Math.abs(event.wheelDeltaX);
      var wheelDeltaY = Math.abs(event.wheelDeltaY);
      if (wheelDeltaX > wheelDeltaY) {
        wheelDelta = event.wheelDeltaX;
      } else {
        wheelDelta = event.wheelDeltaY;
      }
    } else {
      wheelDelta = -event.detail;
    }
    if (event.deltaMode === 1) {
      wheelDelta *= 5;
    }
    return wheelDelta;
  };

  /**
   * Determine if this conveyor belt is horizontal or vertical.
   * @return {boolean} True if the conveyor belt is horizontal, false if vertical
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._isHorizontal = function () {
    return this._orientation === 'horizontal';
  };

  /**
   * Determine if this conveyor belt is empty.
   * @return {boolean} True if the conveyor belt is empty, false if not
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._isEmpty = function () {
    var contentParent = this._getContentParent();
    return !contentParent.hasChildNodes();
  };

  /**
   * Restore inner DOM to its initial state before sizes were calculated.
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._reinitializeInnerDom = function () {
    // restore inner DOM to initial state in order to accurately calculate new sizes

    // save original scroll value for use in _adjustOverflowSize()
    this._origScroll = this._getCurrScroll();
    this._setOverflowScroll(0);

    // hide the buttons until we know we need them
    this._hidePrevButton();
    this._hideNextButton();
  };

  /**
   * Clear cached sizes.
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._clearCachedSizes = function () {
    this._totalSize = null;
    this._sizes = null;
  };

  /**
   * Handle a component resize.
   * @param {boolean} bSetup True when called from setup, false otherwise
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._handleResize = function (bSetup) {
    // if this is not the first call, need to reinitialize the inner DOM before
    // we can accurately calculate new sizes (if this is the first call, DOM
    // is already in initial state)
    if (!bSetup) {
      this._reinitializeInnerDom();
    }
    this._clearCachedSizes();
    // measure content size
    this._totalSize = this._measureContents();
    // if this is not the first call, need to adjust the overflow size (if this
    // is the first call, the overflow size was already adjusted in setup)
    if (!bSetup) {
      this._adjustOverflowSize(false);
    }
    // center buttons orthogonal to conveyor orientation
    if (this._arrowVisibility === 'visible') {
      this._alignButtons();
    }
  };

  /**
   * Center the overflow buttons orthogonal to the conveyor orientation.
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._alignButtons = function () {
    var nextButton = this._nextButton;
    var prevButton = this._prevButton;
    var nextButtonStyle = nextButton.style;
    var prevButtonStyle = prevButton.style;
    var totalSize = this._totalSize;

    if (this._isHorizontal()) {
      nextButtonStyle.height = totalSize.h + 'px';
      prevButtonStyle.height = totalSize.h + 'px';
    } else {
      nextButtonStyle.width = totalSize.w + 'px';
      prevButtonStyle.width = totalSize.w + 'px';
    }
  };

  /**
   * Adjust the overflow size.
   * @param {boolean} bInit True for initialization, false for refresh
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._adjustOverflowSize = function (bInit) {
    var contentContainer = this._contentContainer;
    var bHoriz = this._isHorizontal();

    var cbcClass = ConveyorBeltCommon;
    var elemInnerSize = bHoriz
      ? cbcClass._getElemInnerWidth(this._elem)
      : cbcClass._getElemInnerHeight(this._elem);

    this._minScroll = 0;
    // take the button size into account for max scroll position
    this._maxScroll = bHoriz
      ? contentContainer.offsetWidth - elemInnerSize + this._buttonWidth
      : contentContainer.offsetHeight - elemInnerSize + this._buttonHeight;
    // constrain max scroll
    if (this._maxScroll < 0) {
      this._maxScroll = 0;
    }

    // hide buttons AFTER calculating sizes above, but BEFORE updating scroll position below
    this._hidePrevButton();
    this._hideNextButton();

    // refresh current scroll position AFTER calculating sizes above
    this._setCurrScroll(bInit ? this._scrollPosition : this._origScroll, true);
    this._origScroll = this._scrollPosition;
  };

  /**
   * Create the inner overflow and content containers.
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._createInnerContainers = function () {
    // the original children of the conveyor elem will be reparented to the contentContainer;
    // the conveyor elem will contain the overflowContainer, which will contain the contentContainer,
    // which will contain the original children

    var self = this;

    var elem = this._elem;
    var cbcClass = ConveyorBeltCommon;
    var overflowContainer = document.createElement('div');
    this._overflowContainer = overflowContainer;
    this._addStyleClassNameFunc(overflowContainer, this._overflowContainerStyleClass);
    var contentContainer = document.createElement('div');
    this._contentContainer = contentContainer;
    this._addStyleClassNameFunc(contentContainer, this._contentContainerStyleClass);

    // reparent children from elem to contentContainer before adding
    // content container to elem
    this._reparentChildrenToContentContainer(elem, contentContainer);

    elem.appendChild(overflowContainer); // @HTMLUpdateOK
    overflowContainer.appendChild(contentContainer); // @HTMLUpdateOK

    // the overflow container listens to DOM scroll events in case the scroll was triggered externally,
    // for example when the user tabs through the child content
    this._scrollListener = function (event) {
      self._handleScroll(event);
    };
    cbcClass._addBubbleEventListener(overflowContainer, 'scroll', this._scrollListener);
  };

  /**
   * Get the content elements of the conveyor.
   * @return {Array} array of content elements
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._getContentElements = function () {
    var arContentElements = [];

    // if there is a nested contentParent, then we need to put its children into
    // arContentElements instead of the children of the contentContainer
    var parent = this._contentParent ? this._contentParent : this._contentContainer;

    var contentChildren = parent.children;
    var numContentChildren = contentChildren.length;
    var i;
    for (i = 0; i < numContentChildren; i++) {
      var child = contentChildren[i];
      if (child.nodeType === 1 && child.tagName !== 'TEMPLATE' && child.offsetWidth !== 0) {
        arContentElements.push(child);
      }
    }

    var filterFunc = this._filterContentElementsFunc;
    arContentElements = filterFunc(arContentElements);

    // if the content elements are direct children of the contentContainer, meaning there's no nested
    // contentParent, then make sure they have the itemStyleClass applied to them in case they were
    // added dynamically
    if (parent === this._contentContainer && this._itemStyleClass) {
      for (i = 0; i < arContentElements.length; i++) {
        var contentElem = arContentElements[i];
        if (!this._hasStyleClassNameFunc(contentElem, this._itemStyleClass)) {
          this._addStyleClassNameFunc(contentElem, this._itemStyleClass);
        }
      }
    }

    return arContentElements;
  };

  /**
   * Create the prev button.
   * @param {string} buttonStyleClass Style class to use for the button
   * @param {Node} icon Button icon element
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._createPrevButton = function (buttonStyleClass, icon) {
    var self = this;
    var prevButton = document.createElement('div');
    this._prevButton = prevButton;
    prevButton.setAttribute('class', buttonStyleClass);
    // hide the button from screen readers because it is not keyboard accessible
    prevButton.setAttribute('aria-hidden', 'true');
    var cbcClass = ConveyorBeltCommon;
    cbcClass._addBubbleEventListener(prevButton, 'click', function () {
      self._scrollPrev();
    });

    prevButton.appendChild(icon); // @HTMLUpdateOK

    var elem = this._elem;
    elem.insertBefore(prevButton, this._overflowContainer); // @HTMLUpdateOK
  };

  /**
   * Create the next button.
   * @param {string} buttonStyleClass Style class to use for the button
   * @param {Node} icon Button icon element
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._createNextButton = function (buttonStyleClass, icon) {
    var self = this;
    var nextButton = document.createElement('div');
    this._nextButton = nextButton;
    nextButton.setAttribute('class', buttonStyleClass);
    // hide the button from screen readers because it is not keyboard accessible
    nextButton.setAttribute('aria-hidden', 'true');
    var cbcClass = ConveyorBeltCommon;
    cbcClass._addBubbleEventListener(nextButton, 'click', function () {
      self._scrollNext();
    });

    nextButton.appendChild(icon); // @HTMLUpdateOK

    var elem = this._elem;
    elem.appendChild(nextButton); // @HTMLUpdateOK
  };

  /**
   * Get the content parent.
   * @return {Object} parent DOM element of the content
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._getContentParent = function () {
    // if an explicit content parent was not specified, it will be the _contentContainer
    var contentParent = this._contentParent;
    if (!contentParent) {
      contentParent = this._contentContainer;
    }
    return contentParent;
  };

  /**
   * Measure the contents of the conveyor.
   * @return {Object} Total size of the contents
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._measureContents = function () {
    var arContentElements = this._getContentElements();
    var totalSize = { w: 0, h: 0 };
    var sizes = [];
    if (arContentElements.length > 0) {
      var children = arContentElements;
      var bHoriz = this._isHorizontal();
      var contentWidth = 0;

      // get the width of the contentContainer, not the contentParent, because
      // in JET, if the children are in a buttonset, for example, the offsetLeft
      // of the children is relative to the contentContainer, not the
      // contentParent
      var contentContainer = this._contentContainer;
      contentWidth = contentContainer.offsetWidth;

      var startOffset = 0;
      var prevSizeObj = null;
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.nodeType === 1) {
          var ww = child.offsetWidth;
          var hh = child.offsetHeight;
          var childId = child.id;
          var sizeObj = { w: ww, h: hh, id: childId };
          var childParent;
          // calculating the start assumes that the browser has done the appropriate layout;
          // subtract 1 from the end so it's the last pixel of this child, not the start of the next child
          if (bHoriz) {
            // FIX : in IE, the conveyor items all report offsetLeft=0,
            // so we need to get the offset from the parent wrapping table cell div
            // instead
            var offLeft = child.offsetLeft;
            if (!this._contentParent && offLeft === 0) {
              childParent = child.parentNode;
              offLeft = childParent.offsetLeft;
            }

            // if RTL, still want to save the start coords in logical, ascending order beginning with 0
            if (this._bRtl) {
              sizeObj.start = contentWidth - (offLeft + ww);
            } else {
              sizeObj.start = offLeft;
            }

            // Offset each item's start coord by the first item's offset to handle cases like text-align:right,
            // where the items may be right-aligned within the content container.  We still want our logical
            // coords to start at 0.
            if (i === 0) {
              startOffset = sizeObj.start;
            }
            sizeObj.start -= startOffset;

            totalSize.w = sizeObj.start + ww;
            totalSize.h = Math.max(totalSize.h, hh);
            sizeObj.end = totalSize.w - 1;
          } else {
            // FIX : in IE, the conveyor items all report offsetTop=0,
            // so we need to get the offset from the parent wrapping table cell div
            // instead
            var offTop = child.offsetTop;
            if (!this._contentParent && offTop === 0) {
              childParent = child.parentNode;
              offTop = childParent.offsetTop;
            }

            sizeObj.start = offTop;
            totalSize.w = Math.max(totalSize.w, ww);
            totalSize.h = sizeObj.start + hh;
            sizeObj.end = totalSize.h - 1;
          }

          // if this item overlaps the previous item, adjust the previous item to
          // end just before this item (can happen, for example, with horizontal
          // JET buttonsets)
          if (prevSizeObj) {
            if (prevSizeObj.end >= sizeObj.start) {
              var overlap = prevSizeObj.end - (sizeObj.start - 1);
              prevSizeObj.end -= overlap;
              if (bHoriz) {
                prevSizeObj.w -= overlap;
              } else {
                prevSizeObj.h -= overlap;
              }
            }
          }

          sizes.push(sizeObj);
          prevSizeObj = sizeObj;
        }
      }
    }
    this._sizes = sizes;
    return totalSize;
  };

  /**
   * Get the array of content sizes.
   * @return {Array} Array of content sizes
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._getSizes = function () {
    return this._sizes;
  };

  /**
   * Show the next button.
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._showNextButton = function () {
    this._removeStyleClassNameFunc(this._nextButton, this._hiddenStyleClass);
    this._atEnd = false;
  };

  /**
   * Show the prev button.
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._showPrevButton = function () {
    this._removeStyleClassNameFunc(this._prevButton, this._hiddenStyleClass);
    this._atStart = false;
  };

  /**
   * Hide the next button.
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._hideNextButton = function () {
    this._addStyleClassNameFunc(this._nextButton, this._hiddenStyleClass);
    this._atEnd = true;
  };

  /**
   * Hide the prev button.
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._hidePrevButton = function () {
    this._addStyleClassNameFunc(this._prevButton, this._hiddenStyleClass);
    this._atStart = true;
  };

  /**
   * Get the size of a next/prev button along the direction of conveyor orientation.
   * @return {number} Size of a button
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._getButtonSize = function () {
    var result = 0;
    if (this._arrowVisibility === 'visible') {
      result = this._isHorizontal() ? this._buttonWidth : this._buttonHeight;
    }
    return result;
  };

  /**
   * Update visibility of the next/prev buttons and adjust scroll position accordingly.
   * @param {number} scroll Desired scroll position
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._updateButtonVisibility = function (scroll) {
    var buttonSize = this._getButtonSize();
    var ovScroll = this._getCurrScroll();
    var bNeedsScroll = this._needsScroll();
    // if scrolling to the start, hide the prev button and reclaim its space
    if (scroll <= this._minScroll) {
      if (!this._atStart) {
        ovScroll -= buttonSize;
      }
      this._hidePrevButton();
    } else if (bNeedsScroll) {
      // if not at the start, show the prev button and allocate space for it
      if (this._atStart) {
        ovScroll += buttonSize;
      }
      this._showPrevButton();
    }

    // if scrolling to the end, hide the next button and reclaim its space
    if (scroll >= this._maxScroll) {
      this._hideNextButton();
    } else if (bNeedsScroll) {
      this._showNextButton();
    }
    // update the overflow container
    this._setOverflowScroll(ovScroll);
  };

  /**
   * Set the overflow scroll position.
   * @param {number} scroll Overflow logical scroll position
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._setOverflowScroll = function (scroll) {
    var container = this._overflowContainer;
    if (this._isHorizontal()) {
      DomUtils.setScrollLeft(container, scroll);
    } else {
      container.scrollTop = scroll;
    }
  };

  /**
   * Get the current overflow viewport size.
   * @return {number} Overflow viewport size
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._getCurrViewportSize = function () {
    var container = this._overflowContainer;
    return this._isHorizontal() ? container.offsetWidth : container.offsetHeight;
  };

  /**
   * Set the scroll position.
   * @param {number} scroll Desired logical scroll position
   * @param {boolean} bImmediate True to make the change immediately, false to animate it
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._setCurrScroll = function (scroll, bImmediate) {
    // don't do anything if we're already in the middle of scrolling
    if (!this._bScrolling) {
      // if this function is called, the conveyor internally initiated the scroll, so turn off the
      // flag for an externally triggered scroll
      this._bExternalScroll = false;
      this._setCurrScrollHelper(scroll, bImmediate);
    }
  };

  /**
   * Helper function to set scroll position.
   * @param {number} scroll Desired scroll position
   * @param {boolean} bImmediate True to make the change immediately, false to animate it
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._setCurrScrollHelper = function (scroll, bImmediate) {
    if (this._isEmpty()) {
      return;
    }

    this._bScrolling = true;
    // eslint-disable-next-line no-param-reassign
    scroll = this._constrainScroll(scroll);
    // update button visibility before scrolling
    this._updateButtonVisibility(scroll);
    var scrollFunc = this._scrollFunc;
    // if making the change immediately, simply call the anim end function
    if (bImmediate || !scrollFunc || scroll === this._getCurrScroll()) {
      // FIX : if this is an external scroll, set the current scroll
      // value again because it may be different from the passed in scroll value
      // due to showing/hiding scroll buttons (Note that for an external scroll,
      // the scroll has already happened before this function was called)
      this._onScrollAnimEnd(this._bExternalScroll ? this._getCurrScroll() : scroll);
    } else {
      // if animating the change, call out to the provided callback
      // FIX : add busy state before animating a scroll
      this._busyStateResolveFunc = this._addBusyStateFunc('scrolling');

      var cbcClass = ConveyorBeltCommon;
      // 1.1 px/ms is the desired animation speed, so calculate the duration based on the distance to scroll
      var duration = Math.abs(this._getCurrScroll() - scroll) / cbcClass._SCROLL_SPEED;
      var self = this;
      var onEndFunc = function () {
        self._onScrollAnimEnd(scroll);

        // FIX : resolve busy state after animating a scroll
        self._resolveBusyState();
      };
      // scrollFunc delegates to jQuery.animate() to animate scrollLeft.
      // Most browsers use negative scroll value in RTL, except for old ie/edge that still use positive values
      // DomUtils.calculateScrollLeft converts the logical scroll to the correct browser value.
      scrollFunc(this._overflowContainer, DomUtils.calculateScrollLeft(scroll), duration, onEndFunc);
    }
  };

  /**
   * Resolve an outstanding busy state.
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._resolveBusyState = function () {
    if (this._busyStateResolveFunc) {
      this._busyStateResolveFunc();
      this._busyStateResolveFunc = null;
    }
  };

  /**
   * Get the current scroll position.
   * @return {number} Logical scroll position
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._getCurrScroll = function () {
    var container = this._overflowContainer;
    return this._isHorizontal()
      ? Math.round(Math.abs(container.scrollLeft))
      : Math.round(container.scrollTop);
  };

  /**
   * Determine if the conveyor needs to show scroll buttons.
   * @return {boolean} True if scrolling is needed, false if not
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._needsScroll = function () {
    var contentContainer = this._contentContainer;
    var overflowContainer = this._overflowContainer;
    return this._isHorizontal()
      ? contentContainer.offsetWidth > overflowContainer.offsetWidth
      : contentContainer.offsetHeight > overflowContainer.offsetHeight;
  };

  /**
   * Constrain the scroll position.
   * @param {number} scroll Desired scroll position
   * @return {number} Constrained scroll position
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._constrainScroll = function (scroll) {
    if (!this._needsScroll() || scroll < this._minScroll) {
      return this._minScroll;
    } else if (scroll > this._maxScroll) {
      return this._maxScroll;
    }
    return scroll;
  };

  /**
   * Handle a mousewheel event.
   * @param {Event} event Event object
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._handleMouseWheel = function (event) {
    // if we're already scrolling, just consume the event
    var bConsumeEvent = this._bScrolling;
    if (this._needsScroll() && !this._bScrolling) {
      var cbcClass = ConveyorBeltCommon;
      var wheelDelta = cbcClass._getWheelDelta(event);
      var scroll;
      if (wheelDelta < 0 && !this._atEnd) {
        scroll = this._getCurrScroll() + Math.abs(wheelDelta);
      } else if (wheelDelta > 0 && !this._atStart) {
        scroll = this._getCurrScroll() - wheelDelta;
      }
      if (scroll != null) {
        bConsumeEvent = true;
        this._setCurrScroll(scroll, true);
      }
    }
    if (bConsumeEvent) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  /**
   * Handle a touchstart event.
   * @param {Event} event Event object
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._handleTouchStart = function (event) {
    var eventTouches = event.touches;
    if (this._needsScroll() && !this._bScrolling && eventTouches.length === 1) {
      this._bTouch = true;
      // save off some initial information at the start of a swipe
      this._firstTouch = eventTouches[0];
      this._touchLastCoord = this._isHorizontal() ? this._firstTouch.pageX : this._firstTouch.pageY;

      this._touchStartScroll = this._getCurrScroll();
      this._touchStartNextScroll = this._calcNextScroll();
      this._touchStartPrevScroll = this._calcPrevScroll();
      // FIX : save the initial at start or at end state
      this._touchInitialNotAtEnd = !this._atEnd;
      this._touchInitialNotAtStart = !this._atStart;
      this._trackingPoints = [];
      this._addTrackingPoint(this._touchLastCoord);
      this._targetCoord = 0;
    }
  };

  /**
   * Handle a touchmove event.
   * @param {Event} event Event object
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._handleTouchMove = function (event) {
    var bHoriz = this._isHorizontal();
    var eventTouches = event.touches;
    var currentTouch = eventTouches[0];
    this._touchCurrentCoord = bHoriz ? currentTouch.pageX : currentTouch.pageY;
    var diff = this._touchCurrentCoord - this._touchLastCoord;
    // in non-RTL, if swiping left or up, scroll next; otherwise scroll prev
    // in RTL, if swiping right or up, scroll next; otherwise scroll prev
    var bNext = bHoriz && this._bRtl ? diff > 0 : diff < 0;
    // determine whether the conveyor can be scrolled in the direction of the swipe
    var canScrollInSwipeDirection =
      (bNext && this._touchInitialNotAtEnd) || (!bNext && this._touchInitialNotAtStart);
    // only need to do something if we also received the touchstart and if we can
    // scroll in the swipe direction
    if (this._bTouch && this._firstTouch.id === currentTouch.id && canScrollInSwipeDirection) {
      this._addTrackingPoint(this._touchLastCoord);
      if (bHoriz && this._bRtl) {
        this._setCurrScroll(this._getCurrScroll() + diff, true);
      } else {
        this._setCurrScroll(this._getCurrScroll() - diff, true);
      }
      this._touchLastCoord = this._touchCurrentCoord;
      // if we're under the threshold, but we've already scrolled to the end,
      // then we don't need to continue trying to scroll and we don't need to
      // reset the scroll position at the end of the touch
      if (
        (this._touchInitialNotAtEnd && this._atEnd) ||
        (this._touchInitialNotAtStart && this._atStart)
      ) {
        this._bTouch = false;
      }
      // FIX : set a flag indicating we've scrolled for this touch event
      this._scrolledForThisTouch = true;
    }
    if (this._scrolledForThisTouch) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  /**
   * Handle a touchend event.
   * @param {Event} event Event object
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  ConveyorBeltCommon.prototype._handleTouchEnd = function (event) {
    this._bTouch = false;
    // FIX : reset the flag indicating if we've scrolled for this touch
    // event
    this._scrolledForThisTouch = false;
    if (this._trackingPoints != null) {
      this._addTrackingPoint(this._touchLastCoord);
      this._startDecelAnim();
    }
  };

  /**
   * Records movement for the last 100ms
   * @param {number} coord - x or y coordinate depending on the conveyorbelt orientation
   */
  ConveyorBeltCommon.prototype._addTrackingPoint = function (coord) {
    if (this._trackingPoints == null) {
      return;
    }
    var time = Date.now();
    while (this._trackingPoints.length > 0) {
      if (time - this._trackingPoints[0].time <= 100) {
        break;
      }
      this._trackingPoints.shift();
    }
    this._trackingPoints.push({ coord, time });
  };

  /*
   * Initialize animation of values coming to a stop
   */
  ConveyorBeltCommon.prototype._startDecelAnim = function () {
    var firstPoint = this._trackingPoints[0];
    var lastPoint = this._trackingPoints[this._trackingPoints.length - 1];

    var offset = lastPoint.coord - firstPoint.coord;
    var timeOffset = lastPoint.time - firstPoint.time;

    var D = timeOffset / 15;

    this._decVel = offset / D || 0; // prevent NaN

    if (Math.abs(this._decVel) > 1) {
      this._decelerating = true;
      requestAnimationFrame(this._stepDecelAnim.bind(this));
    }
  };

  /**
   * Animates values slowing down
   */
  ConveyorBeltCommon.prototype._stepDecelAnim = function () {
    if (!this._decelerating) {
      return;
    }
    var friction = ConveyorBeltCommon._TOUCH_SCROLL_FRICTION;
    var stopThreshold = ConveyorBeltCommon._TOUCH_SCROLL_STOP_THRESHOLD;
    this._decVel *= friction;

    this._targetCoord += this._decVel;

    if (Math.abs(this._decVel) > stopThreshold) {
      if (this._isHorizontal() && this._bRtl) {
        this._setCurrScroll(this._getCurrScroll() + this._targetCoord, true);
      } else {
        this._setCurrScroll(this._getCurrScroll() - this._targetCoord, true);
      }
      requestAnimationFrame(this._stepDecelAnim.bind(this));
    } else {
      this._decelerating = false;
    }
  };

  /**
   * Handle a DOM scroll event.
   * @param {Event} event Event object
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  ConveyorBeltCommon.prototype._handleScroll = function (event) {
    // if the scroll was triggered externally, for example by tabbing through
    // child items, then update the visual state of the conveyor to match the
    // new scroll state
    if (this._bExternalScroll && !this._bScrolling) {
      this._setCurrScrollHelper(this._getCurrScroll(), true);
    }
  };

  /**
   * Function called after a scroll finishes.
   * @param {number} scroll Scroll position
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._onScrollAnimEnd = function (scroll) {
    // set the desired value after the animation to make sure that the final value is exactly what was intended,
    // in case the animation introduced interpolation errors
    this._setOverflowScroll(scroll);
    this._setScrollPositionProperty(scroll);
    this._bExternalScroll = true;
    this._bScrolling = false;
  };

  /**
   * Scroll to the next set of items.
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._scrollNext = function () {
    if (!this._bScrolling) {
      this._setCurrScroll(this._calcNextScroll(), false);
    }
  };

  /**
   * Scroll to the previous set of items.
   * @return {void}
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._scrollPrev = function () {
    if (!this._bScrolling) {
      this._setCurrScroll(this._calcPrevScroll(), false);
    }
  };

  /**
   * Calculate the scroll position for the next set of items.
   * @return {number} Next scroll position
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._calcNextScroll = function () {
    var nextIndex = this._calcNextVisibleItemIndex();
    var scroll = 0;
    // if single item is bigger than viewport, then scroll by viewport size
    if (nextIndex === this._calcFirstVisibleItemIndex()) {
      scroll = this._getCurrScroll() + this._getCurrViewportSize();
    } else {
      scroll = this._calcStartScroll(nextIndex);
    }
    return scroll;
  };

  /**
   * Calculate the scroll position for the previous set of items.
   * @return {number} Previous scroll position
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._calcPrevScroll = function () {
    var prevIndex = this._calcPrevVisibleItemIndex();
    var scroll = 0;
    // if single item is bigger than viewport, then scroll by viewport size
    if (prevIndex === this._calcLastVisibleItemIndex()) {
      scroll = this._getCurrScroll() - this._getCurrViewportSize();
    } else {
      scroll = this._calcEndScroll(prevIndex);
    }
    // if at the end and scrolling prev, anticipate the next button becoming
    // visible and adjust the scroll position
    if (this._atEnd) {
      scroll += this._getButtonSize();
    }
    // if scrolling prev and the scroll position is less than or equal to the size of the prev button,
    // just scroll to the very beginning because the prev button should get hidden
    if (scroll <= this._getButtonSize()) {
      scroll = this._minScroll;
    }
    return scroll;
  };

  /**
   * Calculate the scroll position for the start of the specified item.
   * @param {number} index Index of the item to scroll to
   * @return {number} Scroll position
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._calcStartScroll = function (index) {
    var sizes = this._getSizes();
    var sizeObj = sizes[index];
    return sizeObj.start;
  };

  /**
   * Calculate the scroll position for the end of the specified item.
   * @param {number} index Index of the item to scroll to
   * @return {number} Scroll position
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._calcEndScroll = function (index) {
    var sizes = this._getSizes();
    var sizeObj = sizes[index];
    return sizeObj.end - this._getCurrViewportSize() + 1;
  };

  /**
   * Calculate the index of the first visible item.
   * @return {number} Index of first visible item
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._calcFirstVisibleItemIndex = function () {
    var currScroll = this._getCurrScroll();
    var i = this._calcItemIndex(currScroll);
    return i < 0 ? 0 : i;
  };

  /**
   * Calculate the index of the last visible item.
   * @return {number} Index of last visible item
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._calcLastVisibleItemIndex = function () {
    var elemSize = this._getCurrViewportSize();
    var currScroll = this._getCurrScroll() + elemSize - 1;
    var i = this._calcItemIndex(currScroll);
    var sizes = this._getSizes();
    return i < 0 ? sizes.length - 1 : i;
  };

  /**
   * Calculate the index of the previous visible item.
   * @return {number} Index of previous visible item
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._calcPrevVisibleItemIndex = function () {
    var currScroll = this._getCurrScroll() - 1;
    var i = this._calcItemIndex(currScroll);
    return i < 0 ? 0 : i;
  };

  /**
   * Calculate the index of the next visible item.
   * @return {number} Index of next visible item
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._calcNextVisibleItemIndex = function () {
    var elemSize = this._getCurrViewportSize();
    var currScroll = this._getCurrScroll() + elemSize;
    var i = this._calcItemIndex(currScroll);
    var sizes = this._getSizes();
    return i < 0 ? sizes.length - 1 : i;
  };

  /**
   * Calculate the index of the item at the given scroll position.
   * @param {number} scroll Scroll position
   * @return {number} Index of item at given scroll position
   * @memberof ConveyorBeltCommon
   * @instance
   * @private
   */
  ConveyorBeltCommon.prototype._calcItemIndex = function (scroll) {
    var sizes = this._getSizes();
    for (var i = 0; i < sizes.length; i++) {
      var sizeObj = sizes[i];
      if (scroll <= sizeObj.end) {
        return i;
      }
    }
    return -1;
  };

  /**
   * Scroll animation speed (px/ms).
   * @memberof ConveyorBeltCommon
   * @private
   */
  ConveyorBeltCommon._SCROLL_SPEED = 1.1;
  /**
   * Touch scroll friction.
   * @memberof ConveyorBeltCommon
   * @private
   */
  ConveyorBeltCommon._TOUCH_SCROLL_FRICTION = 0.7;
  /**
   * Touch scroll stop threshold.
   * @memberof ConveyorBeltCommon
   * @private
   */
  ConveyorBeltCommon._TOUCH_SCROLL_STOP_THRESHOLD = 0.1;

  ConveyorBeltCommon._KEYBOARD_KEYS = {
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
    _RIGHT_CODE: 39
  };

  /**
   * @ojcomponent oj.ojConveyorBelt
   * @augments oj.baseComponent
   * @since 0.6.0
   *
   * @ojshortdesc A conveyor belt manages overflow for its child elements and allows scrolling among them.
   * @class oj.ojConveyorBelt
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["orientation"]}
   * @ojvbdefaultcolumns 12
   * @ojvbmincolumns 2
   *
   * @ojoracleicon 'oj-ux-ico-conveyor-belt'
   * @ojuxspecs ['conveyor-belt']
   *
   * @classdesc
   * <h3 id="conveyorBeltOverview-section">
   *   JET ConveyorBelt
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#conveyorBeltOverview-section"></a>
   * </h3>
   *
   * <p>Description: Container element that manages overflow for its child
   * elements and allows scrolling among them.
   *
   * <p>Child elements of the ConveyorBelt must all be siblings at the same level.
   * The size of the ConveyorBelt must somehow be constrained in order for
   * there to be overflow to manage, for example by specifying CSS
   * <code class="prettyprint">max-width</code> or
   * <code class="prettyprint">max-height</code>.
   * <p>If the elements to be scrolled among are direct children of the
   * ConveyorBelt, then ConveyorBelt will ensure that they are laid out
   * appropriately for its orientation.  However, if the elements to be scrolled
   * among are contained by a single nested descendant element, the
   * <code class="prettyprint">content-parent</code>, then it is up to calling code
   * to ensure that the elements are laid out appropriately.  For example,
   * elements can be forced horizontal by using CSS
   * <code class="prettyprint">white-space:nowrap</code>, or vertical by using
   * <code class="prettyprint">display:block</code>.
   *
   * <pre class="prettyprint"><code>
   * &lt;oj-conveyor-belt>
   *   &lt;oj-button>Alpha&lt;/oj-button>
   *   &lt;oj-button>Beta&lt;/oj-button>
   *   &lt;oj-button>Gamma&lt;/oj-button>
   *   &lt;oj-button>Delta&lt;/oj-button>
   *   &lt;oj-button>Epsilon&lt;/oj-button>
   *   &lt;oj-button>Zeta&lt;/oj-button>
   * &lt;/oj-conveyor-belt>
   * </code></pre>
   *
   * <p id="conveyorBelt-filmStrip-section">JET FilmStrip and ConveyorBelt look similar, but are intended to be used
   * for different purposes.
   * <a class="bookmarkable-link" title="Bookmarkable Link" href="#conveyorBelt-filmStrip-section"></a>
   * <p>Use ConveyorBelt when you want to:
   * <ul>
   * <li>handle overflow without showing a scrollbar</li>
   * <li>keep all items accessible via tabbing and readable by a screen reader</li>
   * </ul>
   * <p>Use FilmStrip when you want to:
   * <ul>
   * <li>layout a set of items across discrete logical pages</li>
   * <li>control which and how many items are shown</li>
   * <li>hide items outside the current viewport from tab order and screen reader</li>
   * </ul>
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
   * <h3 id="keyboard-appdev-section">
   *   Keyboard Application Developer Information
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-appdev-section"></a>
   * </h3>
   *
   * <p>Providing keyboard support for the items in the conveyor belt is the
   * responsibility of the application developer, if the items do not already
   * support keyboard interaction.  This could be done, for example, by specifying
   * <code class="prettyprint">tabindex</code> on each item to enable tab
   * navigation.  Alternatively, this could be done by adding a keyboard listener
   * and responding to key events, like pressing the arrow keys.
   *
   *
   * <h3 id="a11y-section">
   *   Accessibility
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
   * </h3>
   *
   * <p>ConveyorBelt provides opt-in keyboard accessibility. To be able to scroll using keyboard,
   * it is required to set attribute <code class="prettyprint">tabindex=0</code>.
   * If Sighted keyboard-only users also need to be able to
   * access the items in the conveyor just by using the keyboard.
   * It is up to the child items of the ConveyorBelt to support keyboard
   * navigation.  If child items support tab navigation, the browser may scroll
   * them into view when they receive focus.  If child items support other forms
   * of keyboard navigation, for example by using the arrow keys, it is up to the
   * child items to scroll themselves into view.  This may be done, for example,
   * by calling the DOM function <code class="prettyprint">focus()</code> or
   * <code class="prettyprint">scrollIntoView()</code> on the item.
   * ConveyorBelt will be aware of tab based or programmatic scrolling and will
   * honor it, updating itself to toggle visibility of the overflow indicators as
   * needed.
   *
   *
   * <h3 id="rtl-section">
   *   Reading direction
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
   * </h3>
   *
   * <p>As with any JET element, in the unusual case that the directionality
   * (LTR or RTL) changes post-init, the conveyorBelt must be
   * <code class="prettyprint">refresh()</code>ed.
   */
  /**
   * <p>The &lt;oj-conveyor-belt> element manages overflow for its child elements and allows scrolling among them.
   * Child elements of the &lt;oj-conveyor-belt> must all be siblings at the same level.</p>
   * <p>If the elements to be scrolled among are nested descendants and not direct
   * children of the conveyor belt, the <code class="prettyprint">content-parent</code>
   * attribute should specify the nested elements direct parent.</p>
   *
   * @ojchild Default
   * @ojshortdesc The oj-conveyor-belt element manages overflow for its child elements and allows scrolling among them. See the Help documentation for more information.
   * @memberof oj.ojConveyorBelt
   *
   * @example <caption>Initialize the conveyor belt with child content specified:</caption>
   * &lt;oj-conveyor-belt>
   *   &lt;oj-button>Alpha&lt;/oj-button>
   *   &lt;oj-button>Beta&lt;/oj-button>
   *   &lt;oj-button>Gamma&lt;/oj-button>
   *   &lt;oj-button>Delta&lt;/oj-button>
   *   &lt;oj-button>Epsilon&lt;/oj-button>
   *   &lt;oj-button>Zeta&lt;/oj-button>
   * &lt;/oj-conveyor-belt>
   *
   * @example <caption>Initialize the conveyor belt with nested child content
   * specified:</caption>
   * &lt;oj-conveyor-belt content-parent='#myContentElem'>
   *   &lt;div id='myContentElem'>
   *     &lt;oj-button>Item 1&lt;/oj-button>
   *     &lt;oj-button>Item 2&lt;/oj-button>
   *     &lt;oj-button>Item 3&lt;/oj-button>
   *     &lt;oj-button>Item 4&lt;/oj-button>
   *     &lt;oj-button>Item 5&lt;/oj-button>
   *   &lt;/div>
   * &lt;/oj-conveyor-belt>
   */

  //----------------------------------------------
  //             SUB-IDS
  //----------------------------------------------
  /**
   * <p>Sub-ID for the start overflow indicator of a horizontal ConveyorBelt.</p>
   *
   * @ojsubid oj-conveyorbelt-start-overflow-indicator
   * @memberof oj.ojConveyorBelt
   *
   * @example <caption>Get the start overflow indicator:</caption>
   * var node = myConveyorBelt.getNodeBySubId({'subId': 'oj-conveyorbelt-start-overflow-indicator'} );
   */

  /**
   * <p>Sub-ID for the end overflow indicator of a horizontal ConveyorBelt.</p>
   *
   * @ojsubid oj-conveyorbelt-end-overflow-indicator
   * @memberof oj.ojConveyorBelt
   *
   * @example <caption>Get the end overflow indicator:</caption>
   * var node = myConveyorBelt.getNodeBySubId({'subId': 'oj-conveyorbelt-end-overflow-indicator'} );
   */

  /**
   * <p>Sub-ID for the top overflow indicator of a vertical ConveyorBelt.</p>
   *
   * @ojsubid oj-conveyorbelt-top-overflow-indicator
   * @memberof oj.ojConveyorBelt
   *
   * @example <caption>Get the top overflow indicator:</caption>
   * var node = myConveyorBelt.getNodeBySubId({'subId': 'oj-conveyorbelt-top-overflow-indicator'} );
   */

  /**
   * <p>Sub-ID for the bottom overflow indicator of a vertical ConveyorBelt.</p>
   *
   * @ojsubid oj-conveyorbelt-bottom-overflow-indicator
   * @memberof oj.ojConveyorBelt
   *
   * @example <caption>Get the bottom overflow indicator:</caption>
   * var node = myConveyorBelt.getNodeBySubId({'subId': 'oj-conveyorbelt-bottom-overflow-indicator'} );
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
   *       <td>ConveyorBelt</td>
   *       <td><kbd>Swipe</kbd></td>
   *       <td>Transition to an adjacent logical page of child items.</td>
   *     </tr>
   *     <tr>
   *       <td>Navigation Arrow</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Transition to an adjacent logical page of child items.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojConveyorBelt
   */

  /**
   * <p>If <code class="prettyprint">tabindex=0</code> ConveyorBelt supports the following keyboard interactions:
   *
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
   *       <td>ConveyorBelt</td>
   *       <td><kbd>RightArrow or DownArrow</kbd></td>
   *       <td>Scrolls the content Right/Down.</td>
   *     </tr>
   *     <tr>
   *       <td>ConveyorBelt</td>
   *       <td><kbd>LeftArrow or UpArrow</kbd></td>
   *       <td>Scrolls the content Left/Up</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojConveyorBelt
   */

  //-----------------------------------------------------
  //                   Styling
  //-----------------------------------------------------
  /**
   * @ojstylevariableset oj-conveyor-belt-css-set1
   * @ojstylevariable oj-conveyor-belt-box-shadow-width {description: "Conveyor belt box-shadow width", formats: ["length"]}
   * @memberof oj.ojConveyorBelt
   */

  (function () {
    // start static members and functions //////////////////////////////////////////

    // FIX : log warning message when "disabled" property set
    /**
     * Warning message when "disabled" property is set.
     * @const
     * @private
     * @type {string}
     */
    var _WARNING_DISABLED_OPTION = "JET ConveyorBelt: 'disabled' property not supported";

    // make sure the collapseEventTimeout param is less than the one used in the unit tests
    // in order to ensure that the filmStrip listener gets the resize event before the unit test
    /**
     * Timeout in milliseconds for collapse event.
     * @const
     * @private
     * @type {number}
     */
    var _RESIZE_LISTENER_COLLAPSE_EVENT_TIMEOUT = 25;

    /**
     * Escape an html fragment/text.
     * @param {string} text Text to escape.
     * @returns {string} Escaped text.
     * @memberof oj.ojFilmStrip
     * @private
     */
    function _escapeHtml(text) {
      // let jQuery escape the text
      var jqDiv = $('<div></div>');
      jqDiv.text(text);
      return jqDiv[0].innerHTML; // @HTMLUpdateOK
    }

    // end static members and functions ////////////////////////////////////////////

    oj.__registerWidget('oj.ojConveyorBelt', $.oj.baseComponent, {
      defaultElement: '<div>',
      widgetEventPrefix: 'oj',

      options: {
        /**
         * Specify the orientation of the conveyorBelt.
         *
         * @expose
         * @memberof oj.ojConveyorBelt
         * @instance
         * @ojwriteback
         * @type {string}
         * @ojvalue {string} "horizontal" Orient the conveyorBelt horizontally.
         * @ojvalue {string} "vertical" Orient the conveyorBelt vertically.
         * @default "horizontal"
         * @ojshortdesc Specifies the orientation of the conveyorBelt.
         *
         * @example <caption>Initialize the conveyorBelt with the
         * <code class="prettyprint">orientation</code> attribute specified:</caption>
         * &lt;oj-conveyor-belt orientation='vertical'>
         * &lt;/oj-conveyor-belt>
         *
         * @example <caption>Get or set the <code class="prettyprint">orientation</code>
         * property after initialization:</caption>
         * // getter
         * var orientation = myConveyorBelt.orientation;
         *
         * // setter
         * myConveyorBelt.orientation = 'vertical';
         */
        orientation: 'horizontal',
        /**
         * <p>Indicates whether overflow content arrows are visible or hidden.
         *
         * <p>The default value of this property varies by theme. If the default value is 'auto', then the behavior varies by device.
         *
         * @expose
         * @memberof oj.ojConveyorBelt
         * @instance
         * @since 9.0.0
         * @ojwriteback
         * @type {string}
         * @ojvalue {string} "auto" show overflow arrows on desktop, hide on mobile.
         * @ojvalue {string} "visible" always show overflow arrows.
         * @ojvalue {string} "hidden" never show overflow arrows.
         * @ojshortdesc Specifies visibility of overflow arrow buttons.
         *
         * @example <caption>Initialize the conveyorBelt with the
         * <code class="prettyprint">arrow-visibility</code> attribute specified:</caption>
         * &lt;oj-conveyor-belt arrow-visibility='auto'>
         * &lt;/oj-conveyor-belt>
         *
         * @example <caption>Get or set the <code class="prettyprint">arrow-visibility</code> property after initialization:</caption>
         * // getter
         * var arrowVisibilityValue = myConveyor.arrowVisibility;
         *
         * // setter
         * myConveyor.arrowVisibility = 'hidden';
         *
         * @example <caption>Set the default in the theme (SCSS) :</caption>
         * $conveyorBeltArrowVisibilityOptionDefault: visible !default;
         *
         */
        arrowVisibility: 'auto',
        /**
         * Specify the selector of the descendant DOM element in the conveyorBelt
         * that directly contains the items to scroll among.
         *
         * <p>This attribute value is <code class="prettyprint">null</code> by default,
         * meaning that the items to scroll among are direct children of the
         * oj-conveyor-belt.  In some cases, the items to scroll among
         * are not direct children of the oj-conveyor-belt, but are instead
         * nested in a descendant DOM element.  In such cases, this attribute should be
         * specified to point to the descendant DOM element whose direct children
         * are the items to scroll among.  For example, if the items to scroll
         * among are buttons in a buttonset, the buttons are direct children of
         * the DOM element representing the buttonset.  The buttonset would be
         * the direct child of the conveyorBelt.  If the
         * <code class="prettyprint">id</code> of the buttonset DOM element were
         * <code class="prettyprint">'myContentElem'</code>, then content-parent
         * would be specified as <code class="prettyprint">'#myContentElem'</code>.
         *
         * <p><b>WARNING:</b> The selector specified for this attribute should match
         * only a single descendant DOM element.  If multiple elements are matched,
         * then only the first one will be used.  Applications should not depend on
         * this behavior because we reserve the right to change it in the future in
         * order to allow and use multiple matching elements.
         *
         * @expose
         * @memberof oj.ojConveyorBelt
         * @instance
         * @ojwriteback
         * @type {?string}
         * @default null
         * @ojshortdesc Specify the selector of the descendant DOM element in the conveyorBelt that directly contains the items to scroll among.
         *
         * @example <caption>Initialize the conveyorBelt with the
         * <code class="prettyprint">content-parent</code> attribute specified:</caption>
         * &lt;oj-conveyor-belt content-parent='#myContentElem'>
         *   &lt;div id='myContentElem'>
         *     &lt;oj-button>Item 1&lt;/oj-button>
         *     &lt;oj-button>Item 2&lt;/oj-button>
         *     &lt;oj-button>Item 3&lt;/oj-button>
         *     &lt;oj-button>Item 4&lt;/oj-button>
         *     &lt;oj-button>Item 5&lt;/oj-button>
         *   &lt;/div>
         * &lt;/oj-conveyor-belt>
         *
         * @example <caption>Get or set the <code class="prettyprint">contentParent</code>
         * property after initialization:</caption>
         * // getter
         * var contentParent = myConveyorBelt.contentParent;
         *
         * // setter
         * myConveyorBelt.contentParent = '#myContentElem';
         */
        contentParent: null,
        /**
         * <p>Gets or sets the number of pixels that an element's content is scrolled from its initial position.
         *
         * <p>The default value of this property is 0.
         *
         * <p> There is no difference between LTR/RTL value assignment.
         * In both LTR and RTL values changes from 0 and max scroll position >=0  if we scroll to the end.
         * If we scroll to the beginning then the values changes from max scroll position >=0 to min scroll position = 0
         * When the value exceeds max/min the value is constrained to the max/min scroll position accordingly.
         *
         * @ojshortdesc Gets or sets the number of pixels that an element's content is scrolled from its initial position.
         * @expose
         * @public
         * @type {number}
         * @instance
         * @memberof oj.ojConveyorBelt
         * @default 0
         * @since 12.0.0
         * @ojwriteback
         *
         *
         * @example <caption>Get or set the <code class="prettyprint">scroll-position</code> property after initialization:</caption>
         * // getter
         * var scrollPosition = myConveyor.scrollPosition;
         *
         * // setter
         * myConveyor.scrollPosition = 10;
         *
         *
         */
        scrollPosition: 0

        /**
         * To avoid tight coupling between a ConveyorBelt and its contents, JET
         * ConveyorBelt does not support the <code class="prettyprint">disabled</code>
         * attribute.
         *
         * <p><b>WARNING:</b> Applications should not depend on this behavior
         * because we reserve the right to change it in the future in order to
         * support <code class="prettyprint">disabled</code> and propagate it to
         * child elements of ConveyorBelt.
         *
         * @member
         * @name disabled
         * @memberof oj.ojConveyorBelt
         * @instance
         * @type {boolean}
         * @default false
         * @ignore
         */
        // disabled attribute declared in superclass, but we still want the above API doc

        // Events

        /**
         * Triggered when the conveyorBelt is created.
         *
         * @event
         * @name create
         * @memberof oj.ojConveyorBelt
         * @instance
         * @ignore
         */
        // create event declared in superclass, but we still want the above API doc
      },

      /**
       * After _ComponentCreate and _AfterCreate,
       * the widget should be 100% set up. this._super should be called first.
       * @return {void}
       * @override
       * @protected
       * @instance
       * @memberof oj.ojConveyorBelt
       */
      _ComponentCreate: function () {
        // Override of protected base class method.
        // call superclass first
        this._super();

        var elem = this.element;
        elem.addClass('oj-conveyorbelt oj-component');

        var options = this.options;
        // FIX : log warning message when "disabled" attribute set
        if (options.disabled) {
          Logger.warn(_WARNING_DISABLED_OPTION);
        }

        // FIX : remove override of _init() and call _setup() from here
        this._setup();
      },

      // This method currently runs at create, init, and refresh time (since refresh() is called by _init()).
      /**
       * Refreshes the visual state of the conveyorBelt. JET elements require a
       * <code class="prettyprint">refresh()</code> after the DOM is
       * programmatically changed underneath the element.
       *
       * <p>This method does not accept any arguments.
       *
       * @return {void}
       * @expose
       * @memberof oj.ojConveyorBelt
       * @instance
       * @ojshortdesc Refreshes the visual state of the conveyorBelt.
       *
       * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
       * myConveyorBelt.refresh();
       */
      refresh: function () {
        // Override of public base class method.
        this._super();

        // Check if the reading direction have changed
        var bRTL = this._GetReadingDirection() === 'rtl';
        var bDirectionChanged = this._bRTL !== bRTL;

        // save and restore scroll position only if the reading direction is not changed
        var scroll;
        // save the current scroll position
        if (!bDirectionChanged) {
          scroll = this._cbCommon.getScroll();
        }

        // destroy the cbCommon and setup from scratch in case items were added/removed
        this._destroyCBCommon();
        this._setup();

        // restore the saved scroll position
        if (!bDirectionChanged) {
          this._cbCommon.setScroll(scroll, true);
        }
      },

      /**
       * Notifies the component that its subtree has been made visible
       * programmatically after the component has been created.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @protected
       * @override
       */
      _NotifyShown: function () {
        this._super();
        // FIX : perform a deferred layout
        if (this._needsSetup) {
          this._setup();
        } else if (this._cbCommon) {
          // with internal flexbox layout, conveyor doesn't get notified when
          // content resizes while hidden, so explicitly handle a resize when
          // shown again
          var cbCommon = this._cbCommon;
          cbCommon.handleResize();
        }
      },

      /**
       * Notifies the component that its subtree has been connected to the document
       * programmatically after the component has been created.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @protected
       * @override
       */
      _NotifyAttached: function () {
        this._super();
        // FIX : perform a deferred layout
        if (this._needsSetup) {
          this._setup();
        } else if (this._cbCommon) {
          // with internal flexbox layout, conveyor doesn't get notified when
          // content resizes while detached, so explicitly handle a resize when
          // attached again
          var cbCommon = this._cbCommon;
          cbCommon.handleResize();
        }
      },

      /**
       * Setup the conveyorBelt.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _setup: function () {
        // Private, not an override (not in base class).
        var self = this;
        var elem = this.element;
        var options = this.options;
        var orientation = options.orientation;

        if (orientation === 'vertical') {
          elem.addClass('oj-conveyorbelt-vertical');
        } else {
          elem.removeClass('oj-conveyorbelt-vertical');
        }

        // FIX : if conveyor is detached or hidden, we can't layout
        // correctly, so defer layout until conveyor is attached or shown
        if (!this._canCalculateSizes()) {
          this._needsSetup = true;
          return;
        }
        this._needsSetup = null;

        this._bRTL = this._GetReadingDirection() === 'rtl';
        if (!this._cbCommon) {
          var prevStyleClass = null;
          var nextStyleClass = null;
          var prevIcon = null;
          var nextIcon = null;

          var animateScrollFunc = null;
          var tooltipNext = _escapeHtml(this.getTranslatedString('tipArrowNext'));
          var tooltipPrevious = _escapeHtml(this.getTranslatedString('tipArrowPrevious'));
          if (orientation !== 'vertical') {
            prevStyleClass = 'oj-enabled oj-conveyorbelt-overflow-indicator oj-start oj-default';
            nextStyleClass = 'oj-enabled oj-conveyorbelt-overflow-indicator oj-end oj-default';
            prevIcon = this._createIcon('oj-conveyorbelt-overflow-icon oj-start', tooltipPrevious);
            nextIcon = this._createIcon('oj-conveyorbelt-overflow-icon oj-end', tooltipNext);
            animateScrollFunc = this._animateScrollLeft.bind(this);
          } else {
            prevStyleClass = 'oj-enabled oj-conveyorbelt-overflow-indicator oj-top oj-default';
            nextStyleClass = 'oj-enabled oj-conveyorbelt-overflow-indicator oj-bottom oj-default';
            prevIcon = this._createIcon('oj-conveyorbelt-overflow-icon oj-top', tooltipPrevious);
            nextIcon = this._createIcon('oj-conveyorbelt-overflow-icon oj-bottom', tooltipNext);
            animateScrollFunc = this._animateScrollTop.bind(this);
          }

          var buttonInfo = {};

          if (options.arrowVisibility === 'auto') {
            buttonInfo.arrowVisibility =
              Config.getDeviceRenderMode() === 'phone' ? 'hidden' : 'visible';
          } else {
            buttonInfo.arrowVisibility = options.arrowVisibility;
          }

          buttonInfo.prevButtonStyleClass = prevStyleClass;
          buttonInfo.nextButtonStyleClass = nextStyleClass;
          buttonInfo.prevButtonIcon = prevIcon;
          buttonInfo.nextButtonIcon = nextIcon;
          var styleInfo = {};
          styleInfo.overflowContainerStyleClass = 'oj-conveyorbelt-overflow-container';

          styleInfo.contentContainerStyleClass = 'oj-conveyorbelt-content-container';
          styleInfo.itemStyleClass = 'oj-conveyorbelt-item';
          styleInfo.hiddenStyleClass = 'oj-helper-hidden';
          var callbackInfo = {};
          callbackInfo.addResizeListener = function (_elem, listener) {
            DomUtils.addResizeListener(_elem, listener, _RESIZE_LISTENER_COLLAPSE_EVENT_TIMEOUT);
          };
          callbackInfo.removeResizeListener = DomUtils.removeResizeListener;
          callbackInfo.addStyleClassName = this._addStyleClassName;
          callbackInfo.removeStyleClassName = this._removeStyleClassName;
          callbackInfo.hasStyleClassName = this._hasStyleClassName;
          callbackInfo.filterContentElements = function (arContentElements) {
            return self._filterContentElements(arContentElements);
          };
          callbackInfo.subtreeDetached = Components.subtreeDetached;
          callbackInfo.subtreeAttached = Components.subtreeAttached;
          callbackInfo.addBusyState = function (description) {
            return self._addBusyState(description);
          };
          callbackInfo.setScrollPositionProperty = function (value) {
            self.option('scrollPosition', value, {
              _context: { internalSet: true, writeback: true }
            });
          };
          // disable scroll animation during testing
          if (Config.getAutomationMode() !== 'enabled') {
            callbackInfo.scrollFunc = animateScrollFunc;
          }
          var contentParentElem = null;
          if (options.contentParent) {
            // only use the first result returned from the contentParent selector
            contentParentElem = $(options.contentParent)[0];
          }
          callbackInfo.handleFocus = function (event) {
            // if focus is on the conveyorbelt itself do nothing
            if (self.element[0].isEqualNode(event.target)) {
              return;
            }
            var conveyorBeltItems;
            if (contentParentElem != null) {
              conveyorBeltItems = contentParentElem.children;
            } else {
              conveyorBeltItems = self.element[0].getElementsByClassName('oj-conveyorbelt-item');
            }
            for (var j = 0; j < conveyorBeltItems.length; j++) {
              if (conveyorBeltItems[j].isEqualNode(event.target)) {
                self.scrollElementIntoView(conveyorBeltItems[j]);
                break;
              }
            }
          };
          this._cbCommon = new ConveyorBeltCommon(
            elem[0],
            {
              orientation: orientation,
              contentParent: contentParentElem,
              bRtl: this._bRTL,
              scrollPosition: options.scrollPosition
            },
            buttonInfo,
            callbackInfo,
            styleInfo
          );
        }

        var cbCommon = this._cbCommon;
        cbCommon.setup();
        var children = elem.find('.oj-conveyorbelt-overflow-indicator');
        // need to setup listeners for styles on each button individually so that callbacks for that
        // listener are specific to each button and don't affect both buttons at the same time
        for (var i = 0; i < children.length; i++) {
          this._setupButtonMouseStyles($(children[i]));
        }
      },

      /**
       * Destroy the conveyorBelt.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @override
       * @protected
       */
      _destroy: function () {
        // Override of protected base class method.
        this._destroyCBCommon();
        var elem = this.element;
        elem.removeClass('oj-conveyorbelt oj-component oj-conveyorbelt-vertical');

        // call superclass last
        this._super();
      },

      /**
       * Set an option on the conveyorBelt.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @override
       * @protected
       */
      _setOption: function (key, value, flags) {
        // Override of protected base class method.
        // Method name needn't be quoted since is in externs.js.
        var bRecreate = false;
        var options = this.options;
        switch (key) {
          // when changing containerParent or orientation, just destroy and recreate
          // the ConveyorBeltCommon
          case 'containerParent':
          case 'arrowVisibility':
            bRecreate = true;
            break;
          case 'orientation':
            bRecreate = options.orientation !== value;
            break;
          case 'scrollPosition':
            if (options.scrollPosition !== value) {
              this._cbCommon.setScroll(value, true);
            }
            break;
          case 'disabled':
            // FIX : log warning message when "disabled" attribute set
            Logger.warn(_WARNING_DISABLED_OPTION);
            break;
          default:
            break;
        }
        // if recreating, destroy the ConveyorBeltCommon before calling superclass
        // _setOption
        if (bRecreate) {
          this._destroyCBCommon();
        }
        if (key !== 'scrollPosition') {
          // For 'scrollPosition' the option value assignment and option change event
          // are done later in this.option(..) in the scroll callback
          this._super(key, value, flags);
        }
        // if recreating, setup the new ConveyorBeltCommon after calling superclass
        // _setOption
        if (bRecreate) {
          this._setup();
        }
      },

      /**
       * Destroy the ConveyorBeltCommon.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _destroyCBCommon: function () {
        var cbCommon = this._cbCommon;
        if (cbCommon) {
          // FIX : detach mouse listeners from overflow indicators
          // before destroying cbCommon in order to avoid memory leaks
          var elem = this.element;
          var children = elem.find('.oj-conveyorbelt-overflow-indicator');
          children.off(this.eventNamespace);

          cbCommon.destroy();
        }
        this._cbCommon = null;
      },

      /**
       * Determine whether the conveyorBelt can calculate sizes (when it is
       * attached to the page DOM and not hidden).
       * @returns {boolean} true if sizes can be calculated, false if not
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _canCalculateSizes: function () {
        var div = document.createElement('div');
        var style = div.style;
        style.width = '10px';
        style.height = '10px';

        // make sure flexbox layout doesn't grow/shrink the item
        style['-webkit-flex'] = '0 0 auto';
        style.flex = '0 0 auto';

        var elem = this.element[0];
        elem.appendChild(div); // @HTMLUpdateOK
        var bCanCalcSizes = false;
        try {
          bCanCalcSizes = div.offsetWidth > 0 && div.offsetHeight > 0;
        } catch (e) {
          // do nothing
        }
        elem.removeChild(div);
        return bCanCalcSizes;
      },

      /**
       * Setup mouse listeners to change button styles.
       * @param {Object} element jQuery element to affect
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _setupButtonMouseStyles: function (element) {
        //  - conveyorbelt next/previous oj-hover color don't go away
        this._AddHoverable({
          element: element,
          afterToggle: function (eventtype) {
            if (eventtype === 'mouseenter') {
              element.removeClass('oj-default');
            } else if (eventtype === 'mouseleave') {
              element.addClass('oj-default');
            }
          }
        });

        this._AddActiveable({
          element: element,
          afterToggle: function (eventtype) {
            if (
              eventtype === 'mousedown' ||
              eventtype === 'touchstart' ||
              eventtype === 'mouseenter'
            ) {
              element.removeClass('oj-default');
            } else if (
              eventtype === 'mouseup' ||
              eventtype === 'touchend' ||
              eventtype === 'touchcancel' ||
              eventtype === 'mouseleave'
            ) {
              element.addClass('oj-default');
            }
          }
        });
      },

      /**
       * Create a DOM element for a button with an icon.
       * @param {string} iconStyleClass Style class for the icon
       * @returns {Element} Button with Icon DOM element
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _createIcon: function (iconStyleClass, tooltip) {
        var span = document.createElement('span');
        span.setAttribute('class', 'oj-component-icon ' + iconStyleClass);
        var innerButton = document.createElement('div');
        innerButton.setAttribute('class', 'oj-conveyorbelt-overflow-button');
        innerButton.setAttribute('role', 'button');
        innerButton.appendChild(span);
        innerButton.setAttribute('title', tooltip);

        return innerButton;
      },

      /**
       * Animate setting the scrollLeft DOM property.
       * @param {Element} elem DOM element to scroll
       * @param {number} value Scroll value
       * @param {number} duration Duration of animation, in ms
       * @param {function():void} onEndFunc Function to call when the animation ends
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _animateScrollLeft: function (elem, value, duration, onEndFunc) {
        var props = {};
        props.scrollLeft = value;
        // use swing instead of easeInOutCubic because easeInOutCubic isn't found
        // when running in the cookbook
        $(elem).animate(props, duration, 'swing', onEndFunc);
      },

      /**
       * Animate setting the scrollTop DOM property.
       * @param {Element} elem DOM element to scroll
       * @param {number} value Scroll value
       * @param {number} duration Duration of animation, in ms
       * @param {function():void} onEndFunc Function to call when the animation ends
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _animateScrollTop: function (elem, value, duration, onEndFunc) {
        var props = {};
        props.scrollTop = value;
        // use swing instead of easeInOutCubic because easeInOutCubic isn't found
        // when running in the cookbook
        $(elem).animate(props, duration, 'swing', onEndFunc);
      },

      /**
       * Add a style class name to an element.
       * @param {Object} elem Element to which to add style class.
       * @param {string} styleClass Style class name to add.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _addStyleClassName: function (elem, styleClass) {
        $(elem).addClass(styleClass);
      },

      /**
       * Remove a style class name from an element.
       * @param {Object} elem Element from which to remove style class.
       * @param {string} styleClass Style class name to remove.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _removeStyleClassName: function (elem, styleClass) {
        $(elem).removeClass(styleClass);
      },

      /**
       * Determine whether the given style class name is applied to the given
       * element.
       * @param {Object} elem Element to check for style class name.
       * @param {string} styleClass Style class name for which to look.
       * @returns {boolean} true if style class name is applied, false if not
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _hasStyleClassName: function (elem, styleClass) {
        return $(elem).hasClass(styleClass);
      },

      /**
       * Filter the given array of conveyor content elements to remove extraneous elements, like the
       * divs added by the resize listener.
       * @param {Array} arContentElements Array of conveyor content elements.
       * @returns {Array} filtered array of conveyor content elements
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _filterContentElements: function (arContentElements) {
        var ret = [];
        for (var i = 0; i < arContentElements.length; i++) {
          var contentElem = arContentElements[i];
          if (
            !this._hasStyleClassName(contentElem, 'oj-helper-detect-expansion') &&
            !this._hasStyleClassName(contentElem, 'oj-helper-detect-contraction')
          ) {
            ret.push(contentElem);
          }
        }
        return ret;
      },

      /**
       * Add a busy state to the busy context.
       *
       * @param {string} description Additional information about busy state.
       * @returns {Function} Resolve function called by the registrant when the busy state completes.
       *          The resultant function will throw an error if the busy state is no longer registered.
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _addBusyState: function (description) {
        var element = this.element;
        var context = Context.getContext(element[0]);
        var busyContext = context.getBusyContext();

        var desc = 'ConveyorBelt';
        var id = element.attr('id');
        desc += " (id='" + id + "')";
        desc += ': ' + description;

        var busyStateOptions = { description: desc };
        return busyContext.addBusyState(busyStateOptions);
      },

      // @inheritdoc
      getNodeBySubId: function (locator) {
        if (locator == null) {
          return this.element[0];
        }

        var subId = locator.subId;
        if (subId === 'oj-conveyorbelt-start-overflow-indicator') {
          return this.widget().find('.oj-conveyorbelt-overflow-indicator.oj-start')[0];
        }
        if (subId === 'oj-conveyorbelt-end-overflow-indicator') {
          return this.widget().find('.oj-conveyorbelt-overflow-indicator.oj-end')[0];
        }
        if (subId === 'oj-conveyorbelt-top-overflow-indicator') {
          return this.widget().find('.oj-conveyorbelt-overflow-indicator.oj-top')[0];
        }
        if (subId === 'oj-conveyorbelt-bottom-overflow-indicator') {
          return this.widget().find('.oj-conveyorbelt-overflow-indicator.oj-bottom')[0];
        }

        // Non-null locators have to be handled by the component subclasses
        return null;
      },

      // @inheritdoc
      getSubIdByNode: function (node) {
        var startIndicator = this.getNodeBySubId({
          subId: 'oj-conveyorbelt-start-overflow-indicator'
        });
        var endIndicator = this.getNodeBySubId({ subId: 'oj-conveyorbelt-end-overflow-indicator' });
        var topIndicator = this.getNodeBySubId({ subId: 'oj-conveyorbelt-top-overflow-indicator' });
        var bottomIndicator = this.getNodeBySubId({
          subId: 'oj-conveyorbelt-bottom-overflow-indicator'
        });
        var currentNode = node;
        var elem = this.element[0];
        while (currentNode && currentNode !== elem) {
          if (currentNode === startIndicator) {
            return { subId: 'oj-conveyorbelt-start-overflow-indicator' };
          } else if (currentNode === endIndicator) {
            return { subId: 'oj-conveyorbelt-end-overflow-indicator' };
          } else if (currentNode === topIndicator) {
            return { subId: 'oj-conveyorbelt-top-overflow-indicator' };
          } else if (currentNode === bottomIndicator) {
            return { subId: 'oj-conveyorbelt-bottom-overflow-indicator' };
          }

          currentNode = currentNode.parentElement;
        }
        return null;
      },

      /**
       * Scrolls child item of conveyor belt into the view.
       *
       *
       * @param {Element} elem DOM element to scroll
       * @return {void}
       * @expose
       * @memberof oj.ojConveyorBelt
       * @instance
       * @since 9.0.0
       * @ojshortdesc Scrolls child item of conveyor belt into the view.
       *
       * @example <caption>Invoke the <code class="prettyprint">scrollElementIntoView</code> method:</caption>
       * myConveyorBelt.scrollElementIntoView(element);
       */
      scrollElementIntoView: function (element) {
        var currentScroll = this._cbCommon.getScroll();
        var currentViewportSize = this._cbCommon._getCurrViewportSize();

        var contentWidth = this._cbCommon._contentContainer.offsetWidth;

        var elementOffLeft = element.offsetLeft;
        // FIX : in IE, the conveyor items all report offsetLeft=0,
        // so we need to get the offset from the parent wrapping table cell div
        // instead
        if (!this._cbCommon._contentParent && elementOffLeft === 0) {
          elementOffLeft = element.parentNode.offsetLeft;
        }

        // if RTL, still want to save the start coords in logical, ascending order beginning with 0
        if (this._cbCommon._bRtl) {
          elementOffLeft = contentWidth - (elementOffLeft + element.offsetWidth);
        }
        // FIX : in IE, the conveyor items all report offsetTop=0,
        // so we need to get the offset from the parent wrapping table cell div
        // instead
        var elementOffTop = element.offsetTop;
        if (!this._cbCommon._contentParent && elementOffTop === 0) {
          elementOffTop = element.parentNode.offsetTop;
        }
        if (this._cbCommon._isHorizontal()) {
          // horizontal conveyor belt
          // if the element is in the current horizontal view port, then we don't need to scroll
          if (
            elementOffLeft + element.offsetWidth <= currentScroll + currentViewportSize &&
            elementOffLeft >= currentScroll &&
            elementOffLeft > this._cbCommon._getButtonSize()
          ) {
            return;
          }

          // if vertical conveyor belt and the element is in the current vertical view port, then we don't need to scroll
        } else if (
          elementOffTop + element.offsetHeight <= currentScroll + currentViewportSize &&
          elementOffTop >= currentScroll &&
          elementOffTop > this._cbCommon._getButtonSize()
        ) {
          return;
        }

        var contentContainer = this._cbCommon._contentContainer;
        var cbcClass = ConveyorBeltCommon;
        var elemInnerSize = this._cbCommon._isHorizontal()
          ? cbcClass._getElemInnerWidth(this.element[0])
          : cbcClass._getElemInnerHeight(this.element[0]);
        this._cbCommon._minScroll = 0;
        // take the button size into account for max scroll position
        this._cbCommon._maxScroll = this._cbCommon._isHorizontal()
          ? contentContainer.offsetWidth - elemInnerSize + this._cbCommon._buttonWidth
          : contentContainer.offsetHeight - elemInnerSize + this._cbCommon._buttonHeight;
        // constrain max scroll
        if (this._cbCommon._maxScroll < 0) {
          this._cbCommon._maxScroll = 0;
        }
        var scroll = 0;
        if (this._cbCommon._isHorizontal()) {
          // scroll conveyor belt in case of a horizontal conveyorbelt
          scroll = elementOffLeft;
        } else {
          // scroll conveyor belt in case of a vertical conveyorbelt
          scroll = elementOffTop;
        }
        if (scroll <= this._cbCommon._getButtonSize()) {
          scroll = this._cbCommon._minScroll;
        }
        this._cbCommon._setCurrScroll(scroll, true);
      }
    }); // end of oj.__registerWidget

    // Set theme-based defaults
    Components.setDefaultOptions({
      ojConveyorBelt: {
        arrowVisibility: Components.createDynamicPropertyGetter(function () {
          return ThemeUtils.getCachedCSSVarValues([
            '--oj-private-conveyor-belt-global-arrow-visibility-default'
          ])[0];
        })
      }
    });
  })(); // end of ConveyorBelt wrapper function

});
