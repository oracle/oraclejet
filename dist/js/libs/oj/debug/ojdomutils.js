/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojthemeutils', 'ojs/ojcore-base', 'jquery'], function (exports, ThemeUtils, oj, $) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

  /**
   * DOM utilities.
   * @ignore
   */
  const DomUtils = {
    _HTML_START_TAG: '\x3chtml\x3e',
    _HTML_END_TAG: '\x3c/html\x3e',
    _LEGAL_ELEMENTS: {
      SPAN: 1,
      B: 1,
      I: 1,
      EM: 1,
      BR: 1,
      HR: 1,
      LI: 1,
      OL: 1,
      UL: 1,
      P: 1,
      TT: 1,
      BIG: 1,
      SMALL: 1,
      PRE: 1
    },
    _LEGAL_ATTRIBUTES: { class: 1, style: 1 }
  };

  /**
   * Returns true if the value is null or if the trimmed value is of zero length.
   *
   * @param {string|null} content
   * @return {boolean} true if the string is wrapped in <html> tag.
   */
  DomUtils.isHTMLContent = function (content) {
    if (
      content.indexOf(DomUtils._HTML_START_TAG) === 0 &&
      content.lastIndexOf(DomUtils._HTML_END_TAG) === content.length - 7
    ) {
      return true;
    }

    return false;
  };

  DomUtils.cleanHtml = function (value) {
    var offSpan = $(document.createElement('span')).get(0);
    offSpan.innerHTML = value; // @HTMLUpdateOK safe manipulation
    if (value && value.indexOf('\x3c') >= 0) {
      DomUtils._cleanElementHtml(offSpan);
    }
    return offSpan;
  };

  DomUtils._cleanElementHtml = function (node) {
    var children = node.childNodes;

    for (var count = children.length - 1; count >= 0; count--) {
      var child = children.item(count);
      if (child && child.nodeType === 1) {
        if (DomUtils._LEGAL_ELEMENTS[child.nodeName]) {
          var attrs = child.attributes;
          for (var i = attrs.length - 1; i >= 0; i--) {
            var attr = attrs[i];
            // jquery - the .attr() method returns undefined for attributes that have not been set.
            var childHasAttr = $(child).attr(attr.name) !== undefined;
            if (childHasAttr) {
              if (!DomUtils._LEGAL_ATTRIBUTES[attr.name]) {
                child.removeAttribute(attr.nodeName);
              }
            }
          }
          DomUtils._cleanElementHtml(child);
        } else if (child) {
          node.removeChild(child);
        }
      }
    }
  };

  /**
   * Checks to see if the "ancestorNode" is a ancestor of "node".
   *
   * @param {!Element} ancestorNode dom subtree to check to see if the target node exists
   * @param {!Element} node target node to check to see if it exists within a subtree rooted at the ancestorNode
   * @return {boolean} <code>true</code> if the "ancestorNode" is a ancestor of "node".
   */
  DomUtils.isAncestor = function (ancestorNode, node) {
    // These can cause problems in IE11: sometimes the node is just an "empty" object
    // oj.Assert.assertDomElement(ancestorNode);
    // oj.Assert.assertDomElement(node);

    var parentNode = node.parentNode;

    while (parentNode) {
      if (parentNode === ancestorNode) {
        return true;
      }

      parentNode = parentNode.parentNode;
    }

    return false;
  };

  /**
   * Checks to see if the "ancestorNode" is a ancestor of "node" or if they are the same.
   *
   * @param {!Element} ancestorNode dom subtree to check to see if the target node exists
   * @param {!Element} node target node to check to see if it exists within a subtree rooted at the ancestorNode
   * @return {boolean} <code>true</code> if the "ancestorNode" is a ancestor of "node" or if they are the same
   */
  DomUtils.isAncestorOrSelf = function (ancestorNode, node) {
    // These can cause problems in IE11: sometimes the node is just an "empty" object
    // oj.Assert.assertDomElement(ancestorNode);
    // oj.Assert.assertDomElement(node);

    return node === ancestorNode ? true : DomUtils.isAncestor(ancestorNode, node);
  };

  /**
   * Adds a resize listener for a block or inline-block element
   * @param {!Element} elem - node where the listener should be added
   * @param {!Function} listener - listener to be added. The listener will receive
   * two parameters: 1) the new width in pixels; 2) the new height in pixels
   * @param {number=} collapseEventTimeout - timeout in milliseconds for collapsing
   * multiple resize events into one
   * @param {boolean=} useResizeObserver - use ResizeObserver-based implementation if supported by the browser
   * @export
   */
  DomUtils.addResizeListener = function (elem, listener, collapseEventTimeout, useResizeObserver) {
    let map = DomUtils._RSZ_TRKR;
    if (useResizeObserver) {
      map = DomUtils._RSZ_TRKR_OBS;
      // remember that this particular listener is associated with a resize observer-based tracker
      DomUtils._OBS_BASED.set(listener, true);
    }
    let tracker = map.get(elem);
    if (tracker == null) {
      tracker = new DomUtils._ResizeTracker(elem, useResizeObserver);
      map.set(elem, tracker);
      tracker.start();
    }
    tracker.addListener(listener, collapseEventTimeout);
  };

  /**
   * Removes a resize listener
   * @param {!Element} elem - node whose listener should be removed
   * @param {!Function} listener - listener to be removed
   * @export
   */
  DomUtils.removeResizeListener = function (elem, listener) {
    const useResizeObserver = DomUtils._OBS_BASED.get(listener);
    const map = useResizeObserver ? DomUtils._RSZ_TRKR_OBS : DomUtils._RSZ_TRKR;
    const tracker = map.get(elem);
    if (tracker != null) {
      tracker.removeListener(listener);
      if (tracker.isEmpty()) {
        tracker.stop();
        map.delete(elem);
      }
    }
  };

  /**
   * Fixes resize listeners after a subtree has been connected to the DOM or after
   * its display:none stayle has been removed
   * @param {!Element} subtreeRoot - subtree root
   */
  DomUtils.fixResizeListeners = function (subtreeRoot) {
    $(subtreeRoot)
      .find('.oj-helper-detect-expansion')
      .parent()
      .each(function (index, div) {
        var tracker = DomUtils._RSZ_TRKR.get(div);
        if (tracker != null) {
          tracker.init(true);
        }
      });
  };

  /**
   * Determines whether a special 'meta' key was pressed when the event was fired.
   * For Mac OS, the 'meta' key is mapped to the 'Command' key, for all other platforms it is mapped
   * to the 'Control' key.
   * Note that this method will only work for the events that support .ctrlKey and .metaKey fields.
   * @param {!Object} evt - the event
   * @return true if the meta key is pressed, false otherwise
   */
  DomUtils.isMetaKeyPressed = function (evt) {
    var agentInfo = oj.AgentUtils.getAgentInfo();
    return oj.AgentUtils.OS.MAC === agentInfo.os ? evt.metaKey : evt.ctrlKey;
  };

  /**
   * Dispatches an event on the element
   * @param {!Element} element
   * @param {!Event} evt event object
   */
  DomUtils.dispatchEvent = function (element, evt) {
    // Workaround for Mozilla issue #329509 - dispatchEvent() throws an error if
    // the element is disabled and disconnected
    // Also, IE simply ignores the .dispatchEvent() call for disabled elements
    var dis = 'disabled';
    var oldDisabled = element[dis];
    try {
      // eslint-disable-next-line no-param-reassign
      element[dis] = false;
      element.dispatchEvent(evt);
    } finally {
      // eslint-disable-next-line no-param-reassign
      element[dis] = oldDisabled;
    }
  };

  /**
   * @private
   */
  DomUtils._invokeAfterPaint = (
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (fn) {
      return window.setTimeout(fn, 0); // @HTMLUpdateOK
    }
  ).bind(window);

  /**
   * @private
   */
  DomUtils._cancelInvokeAfterPaint = (
    window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    function (id) {
      return window.clearTimeout(id);
    }
  ).bind(window);

  /**
   * Utility class for tracking resize events for a given element and  sispatching them
   * to listeners
   * @constructor
   * @ignore
   * @private
   */
  DomUtils._ResizeTracker = function (div, useResizeObserver) {
    // Normalize div to an actual DOM element. Many qUnit
    // tests are incorrectly passing jQuery locators instead
    if (div instanceof $) {
      // eslint-disable-next-line no-param-reassign
      div = div[0];
    }

    // The 'data-oj-resize-notify' attribute has been added to be used in qunit tests.
    // Previously a test added a resize listener called on timeout, which made the test brittle.
    // Now a resize test might add the 'data-oj-resize-notify' attribute to the component
    // and get notified when the component receives resize notification.
    var _fireResizeDomEvent = div.hasAttribute('data-oj-resize-notify');
    var _listeners = $.Callbacks();
    var _collapsingManagers = [];
    var _collapsingListeners = [];

    var _RETRY_MAX_COUNT = 2;
    var _retrySetScroll = 0;
    var _invokeId = null;
    var _oldWidth = null;
    var _oldHeight = null;
    var _detectExpansion = null;
    var _detectContraction = null;
    var _scrollListener = null;
    var _resizeObserver = null;

    this.addListener = function (listener, collapseEventTimeout) {
      if (
        collapseEventTimeout === undefined ||
        isNaN(collapseEventTimeout) ||
        collapseEventTimeout === 0
      ) {
        _listeners.add(listener);
      } else {
        // See comments above for _fireResizeDomEvent.
        var _wrappedOrigListener = () => {
          listener.apply(null, arguments);
          div.dispatchEvent(new Event('oj-resize'));
        };
        _collapsingManagers.push(
          new DomUtils._collapsingListenerManager(
            _fireResizeDomEvent ? _wrappedOrigListener : listener,
            collapseEventTimeout
          )
        );
        _collapsingListeners.push(listener);
      }
    };

    this.removeListener = function (listener) {
      var index = _collapsingListeners.indexOf(listener);
      if (index >= 0) {
        _collapsingListeners.splice(index, 1);
        var removed = _collapsingManagers.splice(index, 1);
        removed[0].stop();
      } else {
        _listeners.remove(listener);
      }
    };

    this.isEmpty = function () {
      return !_listeners.has() && _collapsingListeners.length === 0;
    };

    this.start = function () {
      if (useResizeObserver && window.ResizeObserver instanceof Function) {
        _resizeObserver = new ResizeObserver(_resizeObserverCallback);
        _resizeObserver.observe(div, { box: 'border-box' });
      } else {
        _scrollListener = _handleScroll;

        var firstChild = div.childNodes[0];

        // This child DIV will track expansion events. It is meant to be 1px taller and wider than the DIV
        // whose resize events we are tracking. After we set its scrollTop and scrollLeft to 1, any increate in size
        // will fire a scroll event
        _detectExpansion = document.createElement('div');
        _detectExpansion.className = 'oj-helper-detect-expansion';
        var expansionChild = document.createElement('div');
        _detectExpansion.appendChild(expansionChild); // @HTMLUpdateOK expansionChild constructed by the code above
        if (firstChild != null) {
          div.insertBefore(_detectExpansion, firstChild); // @HTMLUpdateOK _detectExpansion constructed by the code above
        } else {
          div.appendChild(_detectExpansion); // @HTMLUpdateOK _detectExpansion constructed by the code above
        }

        _detectExpansion.addEventListener('scroll', _scrollListener, false);

        // This child DIV will track contraction events. Its height and width are set to 200%. After we set its scrollTop and
        // scrollLeft to the current height and width of its parent, any decrease in size will fire a scroll event
        _detectContraction = document.createElement('div');
        _detectContraction.className = 'oj-helper-detect-contraction';

        var contractionChild = document.createElement('div');
        contractionChild.style.width = '200%';
        contractionChild.style.height = '200%';
        _detectContraction.appendChild(contractionChild); // @HTMLUpdateOK contractionChild constructed by the code above
        div.insertBefore(_detectContraction, _detectExpansion); // @HTMLUpdateOK _detectContraction constructed by the code above

        _detectContraction.addEventListener('scroll', _scrollListener, false);

        this.init(false);
      }
    };

    this.stop = function () {
      if (_invokeId != null) {
        DomUtils._cancelInvokeAfterPaint(_invokeId);
        _invokeId = null;
      }
      if (_resizeObserver != null) {
        _resizeObserver.disconnect();
        _resizeObserver = null;
      } else if (_detectExpansion != null) {
        _detectExpansion.removeEventListener('scroll', _scrollListener);
        _detectContraction.removeEventListener('scroll', _scrollListener);
        // Check before removing to prevent CustomElement polyfill from throwing
        // a NotFoundError when removeChild is called with an element not in the DOM
        if (_detectExpansion.parentNode) {
          div.removeChild(_detectExpansion);
        }
        if (_detectContraction.parentNode) {
          div.removeChild(_detectContraction);
        }
      }
    };

    this.init = function (isFixup) {
      if (_detectExpansion) {
        var adjusted = _checkSize(isFixup);
        if (isFixup && !adjusted && _detectExpansion.offsetParent != null) {
          _adjust(_oldWidth, _oldHeight);
        }
      }
    };

    function _checkSize(fireEvent) {
      var adjusted = false;
      if (_detectExpansion.offsetParent != null) {
        var newWidth = _detectExpansion.offsetWidth;
        var newHeight = _detectExpansion.offsetHeight;

        if (_oldWidth !== newWidth || _oldHeight !== newHeight) {
          _retrySetScroll = _RETRY_MAX_COUNT;
          _adjust(newWidth, newHeight);
          adjusted = true;

          if (fireEvent) {
            _notifyListeners(true);
          }
        }
      }

      return adjusted;
    }

    function _resizeObserverCallback(entries) {
      // we are observing only one element, so there should be a single entry
      const outer = entries[0].borderBoxSize;
      // MDN states that borderBoxSize may be either a direct entry (true for Firefox) or
      // an array of entries (true for Chrome)
      const newWidth = outer ? (outer[0] || outer).inlineSize : div.offsetWidth;
      const newHeight = outer ? (outer[0] || outer).blockSize : div.offsetHeight;
      _notifyListeners(false, [newWidth, newHeight]);
    }

    // the size parameter will be dfined only for ResizeObserver
    function _notifyListeners(useAfterPaint, size) {
      var newWidth = size ? size[0] : div.offsetWidth;
      var newHeight = size ? size[1] : div.offsetHeight;
      var listenersWrapper = (width, height) => {
        _listeners.fire(width, height);
        if (_fireResizeDomEvent) {
          div.dispatchEvent(new Event('oj-resize'));
        }
      };
      if (_listeners.has()) {
        if (!useAfterPaint) {
          listenersWrapper(newWidth, newHeight);
        } else {
          if (_invokeId !== null) {
            DomUtils._cancelInvokeAfterPaint(_invokeId);
          }

          _invokeId = DomUtils._invokeAfterPaint(function () {
            _invokeId = null;
            listenersWrapper(newWidth, newHeight);
          });
        }
      }

      for (var i = 0; i < _collapsingManagers.length; i++) {
        _collapsingManagers[i].getCallback()(newWidth, newHeight);
      }
    }

    function _handleScroll(evt) {
      evt.stopPropagation();
      if (!_checkSize(true)) {
        // Workaround for the WebKit issue where scrollLeft gets reset to 0 without the DIV being expanded
        // We will retry to the set the scrollTop only twice to avoid infinite loops
        if (
          _retrySetScroll > 0 &&
          _detectExpansion.offsetParent != null &&
          (_detectExpansion.scrollLeft === 0 || _detectExpansion.scrollTop === 0)
        ) {
          _retrySetScroll -= 1;
          _adjust(_oldWidth, _oldHeight);
        }
      }
    }

    function _adjust(width, height) {
      _oldWidth = width;
      _oldHeight = height;

      var expansionChildStyle = _detectExpansion.firstChild.style;

      var delta = 1;

      // The following loop is a workaround for the WebKit issue with zoom < 100% -
      // the scrollTop/Left gets reset to 0 because it gets computed to a value less than 1px.
      // We will try up to the delta of 5 to support scaling down to 20% of the original size
      do {
        expansionChildStyle.width = width + delta + 'px';
        expansionChildStyle.height = height + delta + 'px';
        _detectExpansion.scrollLeft = delta;
        _detectExpansion.scrollTop = delta;
        delta += 1;
      } while ((_detectExpansion.scrollTop === 0 || _detectExpansion.scrollLeft === 0) && delta <= 5);

      _detectContraction.scrollLeft = width;
      _detectContraction.scrollTop = height;
    }
  };

  // a weak element-to-legacy-tracker map
  DomUtils._RSZ_TRKR = new WeakMap();
  // a weak element-observer-based-tracker map
  DomUtils._RSZ_TRKR_OBS = new WeakMap();
  // a weak map with true values for observer-based resize listeners
  DomUtils._OBS_BASED = new WeakMap();

  /**
   * Returns true if the name is a valid identifier
   *
   * @param {string} name
   * @return {boolean} true if the name is a valid identifier
   */
  DomUtils.isValidIdentifier = function (name) {
    return /^[A-Za-z][0-9A-Z_a-z-]*$/.test(name);
  };

  /**
   * @constructor
   * @ignore
   */

  DomUtils._collapsingListenerManager = function (originalCallback, timeout) {
    var _lastArgs = null;
    var _timerId = null;

    var _timerCallback = function () {
      originalCallback.apply(null, _lastArgs);
      _timerId = null;
    };

    var _callback = function () {
      _lastArgs = Array.prototype.slice.call(arguments);
      if (_timerId == null) {
        _timerId = window.setTimeout(_timerCallback, timeout);
      }
    };

    this.getCallback = function () {
      return _callback;
    };

    this.stop = function () {
      if (_timerId != null) {
        window.clearTimeout(_timerId);
        _timerId = null;
      }
    };
  };

  /**
   * @return {boolean} true if touch is supported
   */
  DomUtils.isTouchSupported = function () {
    return (
      'ontouchstart' in window || // C, FF, Safari, Edge
      navigator.msMaxTouchPoints > 0 || // IE10
      navigator.maxTouchPoints > 0
    ); // IE11
  };

  /**
   * @ignore
   */
  DomUtils.setInKoCleanExternal = function (node) {
    DomUtils._koCleanNode = node;
  };

  /**
   * Delegates to JQuery's unwrap() if the component's node is not currently
   * being removed by Knockout
   * @param {Object} locator
   * @param {Object=} replaceLocator - locator to be replaced. I fthis parameter is ommitted,
   * the parent node will be replaced
   * @ignore
   */
  DomUtils.unwrap = function (locator, replaceLocator) {
    var koCleanNode = DomUtils._koCleanNode;

    if (koCleanNode) {
      if (locator.get(0) === koCleanNode) {
        // skip unwrap
        return;
      }
    }

    if (replaceLocator) {
      replaceLocator.replaceWith(locator); // @HTMLUpdateOK
    } else {
      locator.unwrap();
    }
  };

  /**
   * Determines if the mouse event target is on browser chrome - i.e. "scrollbar".
   * If the event is not a mouse event with a clientX and clientY, the resultant will
   * be false.
   *
   * @param {Event} event native dom event
   * @returns {boolean} <code>true</code> if the target of the mouse event is browser
   *          chrome such as scrollbars.
   * @public
   */
  DomUtils.isChromeEvent = function (event) {
    // verify event is a mouse event
    if (!('clientX' in event) || !('clientY' in event)) {
      return false;
    }

    var agentInfo = oj.AgentUtils.getAgentInfo();

    if (oj.AgentUtils.OS.ANDROID === agentInfo.os || oj.AgentUtils.OS.IOS === agentInfo.os) {
      return false;
    }

    if (
      agentInfo.engine !== oj.AgentUtils.ENGINE.GECKO &&
      agentInfo.engine !== oj.AgentUtils.ENGINE.WEBKIT &&
      agentInfo.engine !== oj.AgentUtils.ENGINE.BLINK &&
      agentInfo.browser !== oj.AgentUtils.BROWSER.IE
    ) {
      // unknown engine/browser
      return false;
    }

    var isLTR = DomUtils.getReadingDirection() === 'ltr';
    // Safari puts the main scrollbar on the left in RTL
    var isMainScrollbarOnTheLeft = !isLTR && agentInfo.browser === oj.AgentUtils.BROWSER.SAFARI;

    var domTarget = event.target;
    var target = $(domTarget);

    var pos = domTarget.getBoundingClientRect();
    var sbw = DomUtils.getScrollBarWidth();

    if (
      isLTR &&
      (domTarget.nodeName === 'HTML' || target.css('overflow-x') !== 'visible') &&
      event.clientX > pos.right - sbw
    ) {
      // ltr scrollbar is always on the right
      return true;
    } else if (
      !isLTR &&
      !isMainScrollbarOnTheLeft &&
      domTarget.nodeName === 'HTML' &&
      event.clientX > pos.right - sbw
    ) {
      // RTL scrollbar on the document is still on the right
      return true;
    } else if (!isLTR && target.css('overflow-x') !== 'visible' && event.clientX < pos.left + sbw) {
      // RTL scrollbar is on the left
      return true;
    } else if (
      (domTarget.nodeName === 'HTML' || target.css('overflow-y') !== 'visible') &&
      event.clientY > pos.bottom - sbw
    ) {
      // below the scrollbar
      return true;
    }
    return false;
  };

  /**
   * @returns {number} width of the browser scrollbar
   */
  DomUtils.getScrollBarWidth = function () {
    // delegate to our (CSP compliant) version of jqueryUI's $.position.scrollBarWidth
    return $.position.scrollbarWidth();
  };

  /**
   * @returns {string!} "rtl" or "ltr"
   */
  DomUtils.getReadingDirection = function () {
    var dir = document.documentElement.getAttribute('dir');
    if (dir) {
      dir = dir.toLowerCase();
    }
    return dir === 'rtl' ? 'rtl' : 'ltr';
  };

  /**
   * Sets the bidi independent position of the horizontal scroll position that
   * is consistent across all browsers.
   * @param {Element} elem the element to set the scrollLeft on
   * @param {number} scrollLeft the element's new scrollLeft
   */
  DomUtils.setScrollLeft = function (elem, scrollLeft) {
    // eslint-disable-next-line no-param-reassign
    elem.scrollLeft = DomUtils.calculateScrollLeft(scrollLeft);
  };
  /**
   * Calculates the bidi independent position of the horizontal scroll position that
   * is consistent across all browsers.
   * @param {number} scrollLeft the element's new scrollLeft
   * @returns {number} new scroll left value
   */
  DomUtils.calculateScrollLeft = function (scrollLeft) {
    // eslint-disable-next-line no-param-reassign
    var resultScrollLeft = scrollLeft;
    if (DomUtils.getReadingDirection() === 'rtl') {
      var browser = oj.AgentUtils.getAgentInfo().browser;
      if (browser !== oj.AgentUtils.BROWSER.IE && browser !== oj.AgentUtils.BROWSER.EDGE) {
        // old ie/edge still have positive values for scrollLeft
        // webkit used to not support -scrollLeft and had to be calculated, chromium 
        // mozilla always supported this a -scrollLeft, mozilla 
        // expect a negative value for RTL
        // eslint-disable-next-line no-param-reassign
        resultScrollLeft = -scrollLeft;
      }
    }
    return resultScrollLeft;
  };

  /**
   * Converts a CSS length attribute into a integer value.
   * Conversion errors or non-number will result in a zero
   * resultant.
   *
   * @param {?} cssLength style attribute
   * @return {number} value as integer
   */
  DomUtils.getCSSLengthAsInt = function (cssLength) {
    if (!isNaN(cssLength)) {
      return parseInt(cssLength, 10);
    }

    if (cssLength && cssLength.length > 0 && cssLength !== 'auto') {
      var intLength = parseInt(cssLength, 10);

      if (isNaN(intLength)) {
        intLength = 0;
      }

      return intLength;
    }

    return 0;
  };

  /**
   * Converts a CSS attribute into a float value.
   * Conversion errors or non-number will result in a zero
   * resultant.
   *
   * @param {?} cssLength style attribute
   * @return {number} value as integer
   */
  DomUtils.getCSSLengthAsFloat = function (cssLength) {
    if (!isNaN(cssLength)) {
      return parseFloat(cssLength);
    }

    if (cssLength && cssLength.length > 0) {
      var floatLength = parseFloat(cssLength);

      if (isNaN(floatLength)) {
        floatLength = 0;
      }

      return floatLength;
    }

    return 0;
  };

  /**
   * Converts a CSS time unit (s, ms) into milliseconds.
   *
   * @param {?} cssTimeUnit value in css time unit
   * @return {number} value in milliseconds
   */
  DomUtils.getCSSTimeUnitAsMillis = function (cssTimeUnit) {
    if (!isNaN(cssTimeUnit)) {
      // assume time is already in milliseconds
      return parseInt(cssTimeUnit, 10);
    }

    if (cssTimeUnit && cssTimeUnit.length > 0) {
      var timeValue = parseFloat(cssTimeUnit);

      if (isNaN(timeValue)) {
        timeValue = 0;
      } else {
        var str = cssTimeUnit + '';
        var lastDigit;
        if (str.length > 2 && str.endsWith('ms')) {
          lastDigit = str.slice(-3, -2);
        } else if (str.length > 1 && str.endsWith('s')) {
          lastDigit = str.slice(-2, -1);
        }

        if (isNaN(lastDigit)) {
          // all bogus value that isn't in the format of [number]['s'|'ms']
          timeValue = 0;
        } else if (!str.endsWith('ms') && str.endsWith('s')) {
          timeValue *= 1000;
        }
      }

      return timeValue;
    }

    return 0;
  };

  /**
   * Key used to store the logical parent of the popup element
   * as a jQuery data property. The logical parent refers the launcher of a popup.
   * @const
   * @private
   * @type {string}
   */
  DomUtils._LOGICAL_PARENT_DATA = 'oj-logical-parent';

  /**
   * This method returns the launcher of a popup when it's open.
   * Returns undefined otherwise.
   *
   * @param {jQuery} element jquery element
   * @returns {any}
   * @see #setLogicalParent
   */
  DomUtils.getLogicalParent = function (element) {
    if (element) {
      return element.data(DomUtils._LOGICAL_PARENT_DATA);
    }

    return undefined;
  };

  /**
   * Set the logical parent as a jQuery data property
   *
   * @param {jQuery} element jquery element
   * @param {jQuery | null} parent jquery element
   * @see #getLogicalParent
   */
  DomUtils.setLogicalParent = function (element, parent) {
    if (!element) {
      return;
    }

    if (parent === null) {
      element.removeData(DomUtils._LOGICAL_PARENT_DATA);
    } else {
      element.data(DomUtils._LOGICAL_PARENT_DATA, parent);
    }
  };

  /**
   * Checks to see if the "ancestorNode" is a logical ancestor of "node"
   *
   * @param {!Element} ancestorNode dom subtree to check to see if the target node exists
   * @param {!Element} node target node to check to see if it exists within a subtree rooted at the ancestorNode
   * @return {boolean} <code>true</code> if the "ancestorNode" is a logical ancestor of "node" or if they are the same
   */
  DomUtils.isLogicalAncestorOrSelf = function (ancestorNode, node) {
    oj.Assert.assertDomElement(ancestorNode);
    oj.Assert.assertDomElement(node);

    var parentNode = node;
    while (parentNode) {
      if (parentNode === ancestorNode) {
        return true;
      }

      var logicalParent = DomUtils.getLogicalParent($(parentNode));
      if (logicalParent) {
        parentNode = logicalParent[0];
      } else {
        parentNode = parentNode.parentNode;
      }
    }

    return false;
  };

  /**
   * Checks whether the href represents a safe URL
   * @param {!string} href - HREF to test
   * @param {Array=} whitelist - optional list of the allowed protocols. Protocol name has to use lowercase letters and
   * be followed by a ':'. If the parameter is ommitted, ['http:', 'https:'] will be used
   * @throws {Exception} an error if the HREF represents an invalid URL
   * @ignore
   */
  DomUtils.validateURL = function (href, whitelist) {
    var allowed = whitelist || ['http:', 'https:'];

    var link = document.createElement('a');
    link.href = href;

    var protocol = link.protocol;
    if (protocol != null) {
      protocol = protocol.toLowerCase();
    }
    // if it isn't on the allowed list and it isn't '', throw an error.
    // IE11 returns '' for hrefs like 'abc', other browsers return 'https'
    // and we want to allow hrefs like 'abc' since those are relative urls.
    if (allowed.indexOf(protocol) < 0 && protocol !== '') {
      throw new Error(protocol + ' is not a valid URL protocol');
    }
  };

  /**
   * Cancels native context menu events for hybrid mobile applications.
   * @private
   */
  DomUtils._suppressNativeContextMenu = function () {
    if (
      $(document.body).hasClass('oj-hybrid') &&
      !$(document.body).hasClass('oj-hybrid-show-context-menu')
    ) {
      document.body.addEventListener(
        'contextmenu',
        function (event) {
          if (event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'TEXTAREA') {
            event.preventDefault();
          }
        },
        true
      );
    }
  };
  DomUtils._suppressNativeContextMenu();

  // standard duration of a pressHold gesture.  Point of reference: default
  // JQ Mobile threshold to be a press-and-hold is 750ms.
  DomUtils.PRESS_HOLD_THRESHOLD = 750;

  // ------------------------------------------------------------------------------------------------
  // Recent touch end
  // ------------------------------------------------------------------------------------------------

  /**
   * Returns true if a touchend or touchcancel has been detected anywhere in the document in the last 500 ms.
   * Note: This function adds event listeners only once per document load.
   *
   * @return {boolean} boolean indicating whether a touch has recently been detected
   */
  DomUtils.recentTouchEnd = (function () {
    // This function is immediately executed and returns the recentTouchEnd function
    // and therefore only execute once per document load.

    var touchTimestamp = 0;
    var TOUCH_THRESHOLD = 500;

    function _touchEndHandler() {
      touchTimestamp = Date.now();
    }

    // --- Document listeners ---
    document.addEventListener('touchend', _touchEndHandler, true);
    document.addEventListener('touchcancel', _touchEndHandler, true);

    // --- The function assigned to DomUtils.recentTouchEnd ---

    return function () {
      // must be at least 300 for the "300ms" delay
      return Date.now() - touchTimestamp < TOUCH_THRESHOLD;
    };
  })();

  /**
   * Returns true if a touchstart has been detected anywhere in the document in the last 800 ms.
   * Note: This function adds event listeners only once per document load.
   *
   * @return {boolean} boolean indicating whether a touch has recently been detected
   */
  DomUtils.recentTouchStart = (function () {
    // This function is immediately executed and returns the recentTouchStart function
    // and therefore only execute once per document load.

    var touchTimestamp = 0;
    // 800 because this is used to ignore mouseenter and focusin on 'press', and a 'press'
    // is usually detected after 750ms.
    var TOUCH_THRESHOLD = DomUtils.PRESS_HOLD_THRESHOLD + 50;

    function _touchStartHandler() {
      touchTimestamp = Date.now();
    }

    // --- Document listeners ---
    document.addEventListener('touchstart', _touchStartHandler, { passive: true, capture: true });

    // --- The function assigned to DomUtils.recentTouchStart ---

    return function () {
      // must be at least TOUCH_THRESHOLD for the  delay
      return Date.now() - touchTimestamp < TOUCH_THRESHOLD;
    };
  })();

  // ------------------------------------------------------------------------------------------------
  // Recent pointer
  // ------------------------------------------------------------------------------------------------

  /**
   * Returns true if a touchstart, touchend, mousedown, or mouseup has been detected anywhere in the
   * document in the last n ms, where n is calibrated across a variety of platforms to make this API
   * a maximally reliable indicator of whether the code now running was likely "caused by" the
   * specified touch and mouse interaction, vs. some other thing (e.g. mousemove, keyboard, or page
   * load).  E.g. the makeFocusable() / _focusable() mechanism uses this API to vary the focus theming
   * depending on whether the element was focused via keyboard or pointer.
   *
   * @return {boolean} boolean indicating whether a mouse button or finger has recently been down or up
   */
  DomUtils.recentPointer = (function () {
    // The comments in this function are tailored to the makeFocusable() usage.

    // - Let "pointer down" mean mousedown or touchstart, and "pointer up" likewise.  (Not MS pointer events.)
    // - Event order can be 1) mousedown>focus>mouseup (like push buttons) or 2) mousedown>mouseup>focus (like toggle buttons).
    // - For 2, semantics for "focus caused by pointer" must be "if pointer interaction in last n ms," rather than "if pointer is currently down".
    // - Those "last n ms" semantics are preferred for 1 as well, rather than relying on pointer up to cancel a state set by pointer down,
    //   since if the pointer up is never received, we'd get stuck in an inaccessible state.
    // - So both pointer down and pointer up set a timestamp, and recentPointer() returns true if Date.now() is within n ms of that timestamp,
    //   where n is higher for touchstart per below.

    // Timestamp of last mousedown/up or touchstart/end. Initial value of 0 (1/1/1970) guarantees that if element is focused before any
    // mouse/touch interaction, then recentPointer() is false, so focus ring appears as desired.
    var pointerTimestamp = 0;

    var pointerTimestampIsTouchStart; // whether the latest timestamp is for touchstart vs. touchend/mouse

    // On Edge (Surface Win10), the lag from the up event to resulting programmatic focus is routinely ~350ms, even when the 300ms "tap delay" has
    // been prevented and confirmed to be absent.  (In Chrome on same device the same lag is ~10 ms.)  So use 600ms to be safe.  Even on Chrome,
    // the lag from the down/up event to natively induced focus can routinely be well into the 1xx ms range. Can exceed 600 if needed. There is no
    // need for a tight bound; if there was pointer interaction in the last second or so, it's perfectly reasonable to suppress the focus ring.
    var POINTER_THRESHOLD_CUSHION = 600;

    // If the number of millis since the last pointer down or up is < this threshold, then recentPointer() considers it recent and returns true.
    // See also TOUCHSTART_THRESHOLD.
    var POINTER_THRESHOLD = POINTER_THRESHOLD_CUSHION;

    // For touchstart only, use 750+600ms so that focus set by a 750ms pressHold gesture (e.g. context menu) is recognized as touch-related.  Same
    // 600ms padding as for POINTER_THRESHOLD.  A high threshold is OK, as it is used only for actual pressHolds (and the unusual case where the
    // pointer up is never received), since for normal clicks and taps, the pointerUp replaces the "1350ms after touchstart" policy with a "600ms
    // after pointerUp" policy. On Edge and desktop FF (desktop version runs on hybrid devices like Surface), which lack touchstart, context menus
    // are launched by the contextmenu event, which happen after the pointer up in both browsers, so the fact that we're using the higher
    // threshold only for touchstart should not be a problem there.
    var TOUCHSTART_THRESHOLD = DomUtils.PRESS_HOLD_THRESHOLD + POINTER_THRESHOLD_CUSHION;

    // --- Document listeners ---

    // Use capture phase to make sure we hear the events before someone cancels them
    document.addEventListener(
      'mousedown',
      function () {
        // If the mousedown immediately follows a touchstart, i.e. if it seems to be the compatibility mousedown
        // corresponding to the touchstart, then we want to consider it a "recent pointer activity" until the end time
        // that is max(touchstartTime + TOUCHSTART_THRESHOLD, now + POINTER_THRESHOLD), where now is mousedownTime in this
        // case.  (I.e. it would defeat the purpose if the inevitable mousedown replaced the longer touchstart threshold with
        // a shorter one.)  We don't do this in the touchend/mouseup listeners, as those obviously happen after the pressHold
        // is over, in which case the following analysis applies:
        // - If the pressHold was < PRESS_HOLD_THRESHOLD ms,
        // - then the higher TOUCHSTART_THRESHOLD is not needed or relevant, since anything focused on pressHold
        //   (like a context menu) never happened,
        // - else the touchend/mouseup happened > PRESS_HOLD_THRESHOLD ms after the touchstart, so in the max() above,
        //   the 2nd quantity is always bigger (later).
        var now = Date.now();
        if (!pointerTimestampIsTouchStart || now > pointerTimestamp + DomUtils.PRESS_HOLD_THRESHOLD) {
          pointerTimestamp = now;
          pointerTimestampIsTouchStart = false;
        }
      },
      true
    );

    document.addEventListener(
      'touchstart',
      function () {
        pointerTimestamp = Date.now();
        pointerTimestampIsTouchStart = true;
      },
      { passive: true, capture: true }
    );

    document.addEventListener(
      'mouseup',
      function () {
        pointerTimestamp = Date.now();
        pointerTimestampIsTouchStart = false;
      },
      true
    );

    document.addEventListener(
      'touchend',
      function () {
        pointerTimestamp = Date.now();
        pointerTimestampIsTouchStart = false;
      },
      true
    );

    // --- The function assigned to DomUtils.recentPointer ---

    return function () {
      var millisSincePointer = Date.now() - pointerTimestamp;
      var threshold = pointerTimestampIsTouchStart ? TOUCHSTART_THRESHOLD : POINTER_THRESHOLD;
      return millisSincePointer < threshold;
    };
  })();

  // ------------------------------------------------------------------------------------------------
  // Utility for suppressing focus ring for mouse/touch interaction, but not KB or other interaction:
  // ------------------------------------------------------------------------------------------------

  /**
   * This API works like baseComponent's _focusable() API (see its detailed JSDoc), with the
   * similarities and differences listed below.  This API is intended for non-component callers;
   * components should typically call the baseComponent API via this._focusable().
   *
   * Comparison to baseComponent._focusable() :
   *
   * - This function's "options" param must be an object.  Only baseComponent._focusable()
   *   supports the backward-compatibility syntax where the options param can be the element.
   * - Same usage of oj-focus, oj-focus-highlight, and $focusHighlightPolicy.
   * - Same required invariant that oj-focus-highlight must not be set if oj-focus is not set.
   * - Same parameters with same semantics, plus the additional "component" and "remove" params
   *   discussed below.
   * - New options.component param, which takes a JET component instance.  (When a component is
   *   involved, typically that component should call this._focusable() rather than calling this
   *   version of the method directly.)
   *
   * If options.component is specified, then the following things work like the baseComponent
   * version of this API:
   *
   * - If the specified element is in the component subtree,
   *   then the classes will automatically be removed when the component is
   *   destroyed/disabled/detached, as detailed in the baseComponent JSDoc,
   *   else the caller has the same responsibility to remove the classes at those times.
   * - Same rules as to whether listeners are automatically cleaned up, or suppressed when the
   *   component is disabled, vs. being the caller's responsibility to handle those things.
   *
   * If options.component is NOT specified (for non-component callers), then those things are
   * the caller's responsibility.  Specifically:
   *
   * - Class removal can be done directly, as needed.
   * - To remove the listeners, see the following.
   *
   * Listener removal:
   *
   * - If options.component was specified, see above.
   * - Else if options.setupHandlers was specified, then only the caller knows what listeners were
   *   registered and how, so it is the caller's responsibility to remove them directly when needed.
   * - The remaining case is that options.component and options.setupHandlers were not specified.
   *   To remove from element e both the 2 classes and all listeners applied to e by all previous
   *   invocations of makeFocusable() where these options were not specified,
   *   call makeFocusable( {'element': e, 'remove': true} ).
   */
  // If this is named focusable(), Closure Compiler generates a warning, and fails to rename the function in minified code,
  // which suggests that focusable (not just _focusable) is apparently externed somewhere (although not in
  // 3rdparty\jquery\externs\jquery-1.8.js, main\javascript\externs.js, or build\tools\closure\compiler.jar\externs.zip\),
  // perhaps for JQUI's :focusable selector.  So name it makeFocusable().
  DomUtils.makeFocusable = (function () {
    var nextId = 0; // used for unique namespace, for "remove" functionality

    // This private var is shared by all callers that use makeFocusable() and don't supply their own focus highlight policy.
    // If the oj-focus-config SASS object ever acquires a 2nd field, should continue to call pJFFF() only once, statically.
    var FOCUS_HIGHLIGHT_POLICY = (ThemeUtils.parseJSONFromFontFamily('oj-focus-config') || {})
      .focusHighlightPolicy;

    /**
     * @param {function()} focusPolicyCallback Optional getter passed to makeFocusable() by callers wishing to get use a caller-
     *   specific focus policy mechanism instead of the built-in mechanism.
     * @param {function()} recentPointerCallback Optional function passed to makeFocusable() by callers wishing to use a caller-
     *   specific mechanism in addition to the built-in mechanism.
     * @return {boolean} boolean indicating whether it is appropriate to apply the <code class="prettyprint">oj-focus-highlight</code>
     *   CSS class for a focus happening at the time of this method call.
     */
    var shouldApplyFocusHighlight = function (focusPolicyCallback, recentPointerCallback) {
      var focusHighlightPolicy = focusPolicyCallback ? focusPolicyCallback() : FOCUS_HIGHLIGHT_POLICY;
      switch (focusHighlightPolicy) {
        case 'all':
          return true;
        case 'none':
          return false;
        default: // "nonPointer" or no value provided (e.g. SASS var missing)
          return !(DomUtils.recentPointer() || (recentPointerCallback && recentPointerCallback()));
      }
    };

    // the function assigned to DomUtils.makeFocusable
    var makeFocusable = function (options) {
      var element = options.element;

      var dataKey = 'ojFocusable';
      var namespacePrefix = '.' + dataKey;
      var namespaceSeparator = ' ' + namespacePrefix;

      if (options.remove) {
        element.removeClass('oj-focus oj-focus-highlight');

        // id's of listeners needing removal
        var ids = element.data(dataKey);
        if (ids == null) {
          return;
        }

        // map ids to namespaces.  "2" -> ".ojFocusable2".  "2,7" -> ".ojFocusable2 .ojFocusable7"
        var namespaces = namespacePrefix + ('' + ids).split(',').join(namespaceSeparator);
        element
          .off(namespaces) // remove the listeners
          .removeData(dataKey); // clear list of listener id's needing removal
        return;
      }

      var afterToggle = options.afterToggle || $.noop;

      function applyOnlyFocus(_element) {
        _element.addClass('oj-focus');
        afterToggle('focusin');
      }

      function applyBothClasses(_element) {
        _element.addClass('oj-focus');
        if (shouldApplyFocusHighlight(options.getFocusHighlightPolicy, options.recentPointer)) {
          _element.addClass('oj-focus-highlight');
        }
        afterToggle('focusin');
      }

      var addClasses = options.applyHighlight ? applyBothClasses : applyOnlyFocus;

      function removeClasses(_element) {
        _element.removeClass('oj-focus oj-focus-highlight');
        afterToggle('focusout');
      }

      var hasFocus = false;
      var setupHandlers =
        options.setupHandlers ||
        function (focusInHandler, focusOutHandler) {
          var component = options.component;
          var focusInListener = function (event) {
            focusInHandler($(event.currentTarget));
            hasFocus = true;
          };
          var focusOutListener = function (event) {
            // We should only do this once, even though this event may fire multiple times.
            if (hasFocus) {
              focusOutHandler($(event.currentTarget));
              hasFocus = false;
            }
          };

          if (component) {
            component._on(element, {
              focusin: focusInListener,
              focusout: focusOutListener
            });
          } else {
            // neither options.component nor options.setupHandlers were passed, so we must provide a
            // way for the caller to remove the listeners.  That's done via the "remove" param, which
            // uses the namespaces that we stash via data().
            var id = nextId;
            nextId += 1;

            // list of id's of existing listeners needing removal
            var _ids = element.data(dataKey);

            // append id to that list, or start new list if first one
            element.data(dataKey, _ids == null ? id : _ids + ',' + id);

            // add listeners namespaced by that id
            var handlers = {};
            var namespace = namespacePrefix + id;
            handlers['focusin' + namespace] = focusInListener;
            handlers['focusout' + namespace] = focusOutListener;
            element.on(handlers);
          }
        };

      setupHandlers(addClasses, removeClasses);
    };

    return makeFocusable;
  })();

  // ------------------------------------------------------------------------------------------------
  // Utility for supporting makeFocusable by providing setupHandlers in and out handlers
  // ------------------------------------------------------------------------------------------------
  DomUtils.getNoJQFocusHandlers = function (focusIn, focusOut) {
    var noJQFocusInHandler = function (element) {
      return focusIn($(element));
    };

    var noJQFocusOutHandler = function (element) {
      return focusOut($(element));
    };

    return { focusIn: noJQFocusInHandler, focusOut: noJQFocusOutHandler };
  };

  const isHTMLContent = DomUtils.isHTMLContent;
  const cleanHtml = DomUtils.cleanHtml;
  const isAncestor = DomUtils.isAncestor;
  const isAncestorOrSelf = DomUtils.isAncestorOrSelf;
  const addResizeListener = DomUtils.addResizeListener;
  const removeResizeListener = DomUtils.removeResizeListener;
  const fixResizeListeners = DomUtils.fixResizeListeners;
  const isMetaKeyPressed = DomUtils.isMetaKeyPressed;
  const dispatchEvent = DomUtils.dispatchEvent;
  const isValidIdentifier = DomUtils.isValidIdentifier;
  const isTouchSupported = DomUtils.isTouchSupported;
  const setInKoCleanExternal = DomUtils.setInKoCleanExternal;
  const unwrap = DomUtils.unwrap;
  const isChromeEvent = DomUtils.isChromeEvent;
  const getScrollBarWidth = DomUtils.getScrollBarWidth;
  const getReadingDirection = DomUtils.getReadingDirection;
  const setScrollLeft = DomUtils.setScrollLeft;
  const calculateScrollLeft = DomUtils.calculateScrollLeft;
  const getCSSLengthAsInt = DomUtils.getCSSLengthAsInt;
  const getCSSLengthAsFloat = DomUtils.getCSSLengthAsFloat;
  const getCSSTimeUnitAsMillis = DomUtils.getCSSTimeUnitAsMillis;
  const getLogicalParent = DomUtils.getLogicalParent;
  const setLogicalParent = DomUtils.setLogicalParent;
  const isLogicalAncestorOrSelf = DomUtils.isLogicalAncestorOrSelf;
  const validateURL = DomUtils.validateURL;
  const PRESS_HOLD_THRESHOLD = DomUtils.PRESS_HOLD_THRESHOLD;
  const recentTouchEnd = DomUtils.recentTouchEnd;
  const recentTouchStart = DomUtils.recentTouchStart;
  const recentPointer = DomUtils.recentPointer;
  const getNoJQFocusHandlers = DomUtils.getNoJQFocusHandlers;
  const makeFocusable = DomUtils.makeFocusable;

  exports.PRESS_HOLD_THRESHOLD = PRESS_HOLD_THRESHOLD;
  exports.addResizeListener = addResizeListener;
  exports.calculateScrollLeft = calculateScrollLeft;
  exports.cleanHtml = cleanHtml;
  exports.dispatchEvent = dispatchEvent;
  exports.fixResizeListeners = fixResizeListeners;
  exports.getCSSLengthAsFloat = getCSSLengthAsFloat;
  exports.getCSSLengthAsInt = getCSSLengthAsInt;
  exports.getCSSTimeUnitAsMillis = getCSSTimeUnitAsMillis;
  exports.getLogicalParent = getLogicalParent;
  exports.getNoJQFocusHandlers = getNoJQFocusHandlers;
  exports.getReadingDirection = getReadingDirection;
  exports.getScrollBarWidth = getScrollBarWidth;
  exports.isAncestor = isAncestor;
  exports.isAncestorOrSelf = isAncestorOrSelf;
  exports.isChromeEvent = isChromeEvent;
  exports.isHTMLContent = isHTMLContent;
  exports.isLogicalAncestorOrSelf = isLogicalAncestorOrSelf;
  exports.isMetaKeyPressed = isMetaKeyPressed;
  exports.isTouchSupported = isTouchSupported;
  exports.isValidIdentifier = isValidIdentifier;
  exports.makeFocusable = makeFocusable;
  exports.recentPointer = recentPointer;
  exports.recentTouchEnd = recentTouchEnd;
  exports.recentTouchStart = recentTouchStart;
  exports.removeResizeListener = removeResizeListener;
  exports.setInKoCleanExternal = setInKoCleanExternal;
  exports.setLogicalParent = setLogicalParent;
  exports.setScrollLeft = setScrollLeft;
  exports.unwrap = unwrap;
  exports.validateURL = validateURL;

  Object.defineProperty(exports, '__esModule', { value: true });

});
