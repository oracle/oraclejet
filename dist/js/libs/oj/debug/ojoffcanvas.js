/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'jquery', 'hammerjs', 'ojs/ojcontext', 'ojs/ojthemeutils', 'ojs/ojcomponentcore', 'ojs/ojlogger', 'ojs/ojdomutils', 'ojs/ojfocusutils', 'ojs/ojjquery-hammer', 'ojs/ojpopupcore'], function (exports, oj, $, Hammer, Context, ThemeUtils, Components, Logger, DomUtils, FocusUtils, ojjqueryHammer, ojpopupcore) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;
  FocusUtils = FocusUtils && Object.prototype.hasOwnProperty.call(FocusUtils, 'default') ? FocusUtils['default'] : FocusUtils;

  /**
   * @namespace
   * @since 1.1.0
   * @ojdeprecated {since: '12.0.0', description: 'Please use &lt;oj-drawer-layout> or &lt;oj-drawer-layout> components instead.'}
   * @ojtsmodule
   * @hideconstructor
   * @ojimportmembers Offcanvas
   * @export
   *
   *
   * @classdesc
   * This class provides functions used for controlling offcanvas regions.  Offcanvas regions can be used in either static (simply displaying and hiding in response to user interactions) or responsive (using media queries to dynamically move application content between the main viewport and offcanvas regions) contexts.  The OffcanvasUtils methods can be used to directly control the display of an offcanvas region in both the static and responsive cases.
   *
   * <p>Note for performance reasons, if the Offcanvas content is expensive to render, you should wrap it in an <code class="prettyprint">oj-defer</code> element (API doc {@link oj.ojDefer}) to defer the rendering of that content.<br/>
   * See the Offcanvas - Deferred Rendering demo for an example.</p>
   *
   * <h3 id="events-section">
   *   Events
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
   * </h3>
   *
   *
   * <table class="generic-table events-table">
   *   <thead>
   *     <tr>
   *       <th>Event</th>
   *       <th>Description</th>
   *       <th>Example</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>ojbeforeclose</td>
   *       <td>Triggered immediately before the offcanvas is closed. It can be canceled to prevent the content from closing by returning a false in the event listener.</td>
   *       <td>$(".selector").on("ojbeforeclose", function(event, offcanvas) {});</td>
   *     </tr>
   *     <tr>
   *       <td>ojbeforeopen<br>
   *       <td>Triggered immediately before the offcanvas is open. It can be canceled to prevent the content from opening by returning a false in the event listener.</td>
   *       <td>$(".selector").on("ojbeforeopen", function(event, offcanvas) {});</td>
   *     </tr>
   *     <tr>
   *       <td>ojclose<br>
   *       <td>Triggered after the offcanvas has been closed.</td>
   *       <td>$(".selector").on("ojclose", function(event, offcanvas) {});</td>
   *     </tr>
   *     <tr>
   *       <td>ojopen<br>
   *       <td>Triggered after the offcanvas has been open (after animation completes).</td>
   *       <td>$(".selector").on("ojopen", function(event, offcanvas) {});</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * <h3 id="touch-section">
   *   Touch End User Information
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
   * </h3>
   *
   * {@ojinclude "name":"touchDoc"}
   *
   * <h3 id="keyboard-section">
   *   Keyboard End User Information
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
   * </h3>
   *
   * {@ojinclude "name":"keyboardDoc"}
   *
   */

  // mapping variable definition, used in a no-require environment. Maps the OffcanvasUtils object to the name used in the require callback.
  // eslint-disable-next-line no-unused-vars
  const OffcanvasUtils = {};
  oj._registerLegacyNamespaceProp('OffcanvasUtils', OffcanvasUtils);

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._DATA_EDGE_KEY = 'oj-offcanvasEdge';
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._DATA_OFFCANVAS_KEY = 'oj-offcanvas';
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._DATA_MEDIA_QUERY_KEY = 'oj-mediaQueryListener';
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._DATA_HAMMER_KEY = 'oj-offcanvasHammer';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.SELECTOR_KEY = 'selector';
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.CONTENT_KEY = 'content';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.EDGE_START = 'start';
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.EDGE_END = 'end';
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.EDGE_TOP = 'top';
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.EDGE_BOTTOM = 'bottom';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.DISPLAY_MODE_KEY = 'displayMode';
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.DISPLAY_MODE_PUSH = 'push';
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.DISPLAY_MODE_OVERLAY = 'overlay';
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.DISPLAY_MODE_REFLOW = 'reflow';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.MODALITY_KEY = 'modality';
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.MODALITY_NONE = 'none';
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.MODALITY_MODAL = 'modal';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.DISMISS_HANDLER_KEY = '_dismissHandler';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.OPEN_PROMISE_KEY = '_openPromise';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.CLOSE_PROMISE_KEY = '_closePromise';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.GLASS_PANE_KEY = '_glassPane';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.SURROGATE_KEY = '_surrogate';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.ANIMATE_WRAPPER_KEY = '_animateWrapper';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.ANIMATE_KEY = '_animate';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.SURROGATE_ATTR = 'data-oj-offcanvas-surrogate-id';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.OUTER_WRAPPER_SELECTOR = 'oj-offcanvas-outer-wrapper';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.OPEN_SELECTOR = 'oj-offcanvas-open';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.TRANSITION_SELECTOR = 'oj-offcanvas-transition';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.REFLOW_WRAPPER_SELECTOR = 'oj-offcanvas-pin';
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.REFLOW_TRANSITION_SELECTOR = 'oj-offcanvas-pin-transition';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.GLASSPANE_SELECTOR = 'oj-offcanvas-glasspane';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.GLASSPANE_DIM_SELECTOR = 'oj-offcanvas-glasspane-dim';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.VETO_BEFOREOPEN_MSG = 'ojbeforeopen veto';
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils.VETO_BEFORECLOSE_MSG = 'ojbeforeclose veto';

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._shiftSelector = {
    start: 'oj-offcanvas-shift-start',
    end: 'oj-offcanvas-shift-end',
    top: 'oj-offcanvas-shift-down',
    bottom: 'oj-offcanvas-shift-up'
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._drawerSelector = {
    start: 'oj-offcanvas-start',
    end: 'oj-offcanvas-end',
    top: 'oj-offcanvas-top',
    bottom: 'oj-offcanvas-bottom'
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._getDisplayMode = function (offcanvas) {
    var displayMode = offcanvas[OffcanvasUtils.DISPLAY_MODE_KEY];
    if (
      displayMode !== OffcanvasUtils.DISPLAY_MODE_OVERLAY &&
      displayMode !== OffcanvasUtils.DISPLAY_MODE_PUSH &&
      displayMode !== OffcanvasUtils.DISPLAY_MODE_REFLOW
    ) {
      // default displayMode in iOS is push and in android and windows are overlay
      displayMode = ThemeUtils.getCachedCSSVarValues([
        '--oj-private-off-canvas-global-display-mode-default'
      ])[0];
    }

    return displayMode;
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._getDrawer = function (offcanvas) {
    return $(offcanvas[OffcanvasUtils.SELECTOR_KEY]);
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._isModal = function (offcanvas) {
    return offcanvas[OffcanvasUtils.MODALITY_KEY] === OffcanvasUtils.MODALITY_MODAL;
  };

  /**
   * Returns whether the drawer is currently open.
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._isOpen = function (drawer) {
    return drawer.hasClass(OffcanvasUtils.OPEN_SELECTOR);
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._getOuterWrapper = function (drawer) {
    return drawer.closest('.' + OffcanvasUtils.OUTER_WRAPPER_SELECTOR);
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._getAnimateWrapper = function (offcanvas) {
    var drawer = OffcanvasUtils._getDrawer(offcanvas);
    if (
      OffcanvasUtils._noInnerWrapper(offcanvas) ||
      offcanvas[OffcanvasUtils.DISPLAY_MODE_KEY] === OffcanvasUtils.DISPLAY_MODE_OVERLAY
    ) {
      return drawer;
    }

    if (offcanvas[OffcanvasUtils.ANIMATE_WRAPPER_KEY]) {
      return drawer.closest('.' + offcanvas[OffcanvasUtils.ANIMATE_WRAPPER_KEY]);
    }

    return drawer.parent();
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._getShiftSelector = function (edge) {
    var selector = OffcanvasUtils._shiftSelector[edge];
    if (!selector) {
      throw new Error('Invalid edge: ' + edge);
    }

    return selector;
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._isRTL = function () {
    return DomUtils.getReadingDirection() === 'rtl';
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._setTransform = function (wrapper, transform) {
    wrapper.css({
      '-webkit-transform': transform,
      transform: transform
    });
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._getTranslationX = function (edge, width, negate) {
    var minus = edge === OffcanvasUtils.EDGE_END;
    if (OffcanvasUtils._isRTL() || negate) {
      minus = !minus;
    }

    return 'translate3d(' + (minus ? '-' : '') + width + ', 0, 0)';
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._setTranslationX = function (wrapper, edge, width) {
    OffcanvasUtils._setTransform(wrapper, OffcanvasUtils._getTranslationX(edge, width, false));
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._getTranslationY = function (edge, height) {
    var minus = edge === OffcanvasUtils.EDGE_BOTTOM ? '-' : '';
    return 'translate3d(0, ' + minus + height + ', 0)';
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._setTranslationY = function (wrapper, edge, height) {
    OffcanvasUtils._setTransform(wrapper, OffcanvasUtils._getTranslationY(edge, height));
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._getTranslationY2 = function (height, negate) {
    var minus = negate ? '-' : '';
    return 'translate3d(0, ' + minus + height + ', 0)';
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._setAnimateClass = function (offcanvas, drawer, $main, dtranslation, mtranslation) {
    drawer.addClass(OffcanvasUtils.TRANSITION_SELECTOR);
    OffcanvasUtils._setTransform(drawer, dtranslation);
    $main.addClass(OffcanvasUtils.TRANSITION_SELECTOR);
    OffcanvasUtils._setTransform($main, mtranslation);
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._saveEdge = function (offcanvas) {
    var edge = offcanvas.edge;
    var drawer = OffcanvasUtils._getDrawer(offcanvas);

    if (!edge || !edge.length) {
      if (drawer.hasClass('oj-offcanvas-start')) {
        edge = OffcanvasUtils.EDGE_START;
      } else if (drawer.hasClass('oj-offcanvas-end')) {
        edge = OffcanvasUtils.EDGE_END;
      } else if (drawer.hasClass('oj-offcanvas-top')) {
        edge = OffcanvasUtils.EDGE_TOP;
      } else if (drawer.hasClass('oj-offcanvas-bottom')) {
        edge = OffcanvasUtils.EDGE_BOTTOM;
      } else {
        // default to start edge
        edge = OffcanvasUtils.EDGE_START;
      }
    }
    $.data(drawer[0], OffcanvasUtils._DATA_EDGE_KEY, edge);

    return edge;
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._getEdge = function (drawer) {
    return $.data(drawer[0], OffcanvasUtils._DATA_EDGE_KEY);
  };

  /**
   * This method is called right before open and after close animation
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._toggleClass = function (offcanvas, wrapper, isOpen) {
    var displayMode = offcanvas[OffcanvasUtils.DISPLAY_MODE_KEY];
    var drawer = OffcanvasUtils._getDrawer(offcanvas);
    var drawerClass = OffcanvasUtils.OPEN_SELECTOR;
    var wrapperClass =
      displayMode === OffcanvasUtils.DISPLAY_MODE_OVERLAY
        ? OffcanvasUtils.TRANSITION_SELECTOR + ' oj-offcanvas-overlay'
        : OffcanvasUtils.TRANSITION_SELECTOR;

    // toggle offcanvas and inner wrapper classes
    if (isOpen) {
      drawer.addClass(drawerClass);
      if (offcanvas[OffcanvasUtils.ANIMATE_KEY] === undefined) {
        wrapper.addClass(wrapperClass);
      }
    } else {
      // remove oj-focus-highlight
      if (offcanvas.makeFocusable) {
        DomUtils.makeFocusable({
          element: drawer,
          remove: true
        });
      }

      // restore the original tabindex
      var oTabIndex = offcanvas.tabindex;
      if (oTabIndex === undefined) {
        drawer.removeAttr('tabindex');
      } else {
        drawer.attr('tabindex', oTabIndex);
      }

      drawer.removeClass(drawerClass);
      wrapper.removeClass(wrapperClass);
    }
  };

  /**
   * Focus is automatically moved to the first item that matches the following:
   * The first element within the offcanvas with the autofocus attribute
   * The first :tabbable element inside the offcanvas
   * The offcanvas itself
   *
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._setFocus = function (_offcanvas) {
    var offcanvas = _offcanvas;
    var drawer = OffcanvasUtils._getDrawer(offcanvas);
    var focusables = drawer.find('[autofocus]');
    var focusNode;

    if (focusables.length === 0) {
      focusables = drawer.find(':tabbable');
    }
    if (focusables.length === 0) {
      var oTabIndex = drawer.attr('tabindex');
      if (oTabIndex !== undefined) {
        // save the original tabindex
        offcanvas.tabindex = oTabIndex;
      }
      // set tabIndex so the div is focusable
      drawer.attr('tabindex', '-1');
      focusNode = drawer;

      DomUtils.makeFocusable({
        element: drawer,
        applyHighlight: true
      });

      offcanvas.makeFocusable = true;
    } else {
      focusNode = focusables[0];
    }

    FocusUtils.focusElement(focusNode);
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._isAutoDismiss = function (offcanvas) {
    return offcanvas.autoDismiss !== 'none';
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._calcTransitionTime = function ($elem) {
    var propertyArray = $elem.css('transitionProperty').split(',');
    var delayArray = $elem.css('transitionDelay').split(',');
    var durationArray = $elem.css('transitionDuration').split(',');
    var maxTime = 0;

    for (var i = 0; i < propertyArray.length; i++) {
      var duration = durationArray[i % durationArray.length];
      var durationMs =
        duration.indexOf('ms') > -1 ? parseFloat(duration) : parseFloat(duration) * 1000;
      if (durationMs > 0) {
        var delay = delayArray[i % delayArray.length];
        var delayMs = delay.indexOf('ms') > -1 ? parseFloat(delay) : parseFloat(delay) * 1000;

        maxTime = Math.max(maxTime, delayMs + durationMs);
      }
    }

    return maxTime + 100;
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._onTransitionEnd = function (target, handler) {
    var endEvents = 'transitionend.oc webkitTransitionEnd.oc';
    var transitionTimer;
    var listener = function () {
      if (transitionTimer) {
        clearTimeout(transitionTimer);
        transitionTimer = null;
      }
      // remove handler
      target.off(endEvents, listener);

      handler(target);
    };

    // add transition end listener
    target.on(endEvents, listener);

    transitionTimer = setTimeout(listener, OffcanvasUtils._calcTransitionTime(target));
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._closeWithCatch = function (offcanvas) {
    //  - offcanvas: error occurs when you veto the ojbeforeclose event
    OffcanvasUtils.close(offcanvas).catch(function (reason) {
      Logger.warn('Offcancas close failed: ' + reason);
    });
  };

  // check offcanvas.autoDismiss
  // update offcanvas.dismisHandler
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._registerCloseHandler = function (_offcanvas) {
    var offcanvas = _offcanvas;
    // unregister the old handler if exists
    OffcanvasUtils._unregisterCloseHandler(offcanvas);

    if (OffcanvasUtils._isAutoDismiss(offcanvas)) {
      var drawer = OffcanvasUtils._getDrawer(offcanvas);

      // save dismisHandler
      var dismisHandler = function (event) {
        var target = event.target;

        // Ignore mouse events on the scrollbar. FF and Chrome, raises focus events on the
        // scroll container too.
        if (
          DomUtils.isChromeEvent(event) ||
          (event.type === 'focus' && !$(target).is(':focusable'))
        ) {
          return;
        }

        var key = $.data(drawer[0], OffcanvasUtils._DATA_OFFCANVAS_KEY);
        if (key == null) {
          // offcanvas already destroyed, unregister the handler
          OffcanvasUtils._unregisterCloseHandler(offcanvas);
          return;
        }

        // if there is an open modal dialog, do not autoDismiss
        if (oj.ZOrderUtils.hasModalDialogOpen()) {
          return;
        }

        // if event target is not the offcanvas dom subtrees, dismiss it
        if (!DomUtils.isLogicalAncestorOrSelf(drawer[0], target)) {
          OffcanvasUtils._closeWithCatch(offcanvas);
        }
      };
      offcanvas[OffcanvasUtils.DISMISS_HANDLER_KEY] = dismisHandler;

      var documentElement = document.documentElement;
      if (DomUtils.isTouchSupported()) {
        documentElement.addEventListener('touchstart', dismisHandler, {
          passive: true,
          capture: true
        });
      }

      documentElement.addEventListener('mousedown', dismisHandler, true);
      documentElement.addEventListener('focus', dismisHandler, true);
    }

    // register swipe handler
    OffcanvasUtils._registerSwipeHandler(offcanvas);
  };

  // check offcanvas.autoDismiss
  // update offcanvas.dismisHandler
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._unregisterCloseHandler = function (_offcanvas) {
    var offcanvas = _offcanvas;
    var dismisHandler = offcanvas[OffcanvasUtils.DISMISS_HANDLER_KEY];
    if (dismisHandler) {
      var documentElement = document.documentElement;

      if (DomUtils.isTouchSupported()) {
        documentElement.removeEventListener('touchstart', dismisHandler, {
          passive: true,
          capture: true
        });
      }

      documentElement.removeEventListener('mousedown', dismisHandler, true);
      documentElement.removeEventListener('focus', dismisHandler, true);
      delete offcanvas[OffcanvasUtils.DISMISS_HANDLER_KEY];

      offcanvas[OffcanvasUtils.DISMISS_HANDLER_KEY] = null;
    }

    // unregister swipe handler
    OffcanvasUtils._unregisterSwipeHandler(offcanvas);
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._registerSwipeHandler = function (_offcanvas) {
    if (DomUtils.isTouchSupported()) {
      var offcanvas = _offcanvas;
      var selector = offcanvas[OffcanvasUtils.SELECTOR_KEY];
      var drawer = $(selector);
      var edge = OffcanvasUtils._getEdge(drawer);
      var swipeEvent;
      var options;
      var drawerHammer;

      if (
        (edge === OffcanvasUtils.EDGE_START && !OffcanvasUtils._isRTL()) ||
        (edge === OffcanvasUtils.EDGE_END && OffcanvasUtils._isRTL())
      ) {
        options = {
          recognizers: [[Hammer.Swipe, { direction: Hammer.DIRECTION_LEFT }]]
        };

        swipeEvent = 'swipeleft';
      } else if (
        (edge === OffcanvasUtils.EDGE_START && OffcanvasUtils._isRTL()) ||
        (edge === OffcanvasUtils.EDGE_END && !OffcanvasUtils._isRTL())
      ) {
        options = {
          recognizers: [[Hammer.Swipe, { direction: Hammer.DIRECTION_RIGHT }]]
        };

        swipeEvent = 'swiperight';
      } else if (edge === OffcanvasUtils.EDGE_TOP) {
        options = {
          recognizers: [[Hammer.Swipe, { direction: Hammer.DIRECTION_UP }]]
        };

        swipeEvent = 'swipeup';
      } else if (edge === OffcanvasUtils.EDGE_BOTTOM) {
        options = {
          recognizers: [[Hammer.Swipe, { direction: Hammer.DIRECTION_DOWN }]]
        };

        swipeEvent = 'swipedown';
      }

      drawerHammer = drawer.ojHammer(options).on(swipeEvent, function (event) {
        if (event.target === drawer[0]) {
          event.preventDefault();
          OffcanvasUtils._closeWithCatch(offcanvas);
        }
      });

      // keep the hammer in the offcanvas jquery data
      $.data($(selector)[0], OffcanvasUtils._DATA_HAMMER_KEY, {
        event: swipeEvent,
        hammer: drawerHammer
      });
    }
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._unregisterSwipeHandler = function (offcanvas) {
    var drawer = OffcanvasUtils._getDrawer(offcanvas);
    if (drawer.length > 0) {
      var dHammer = $.data(drawer[0], OffcanvasUtils._DATA_HAMMER_KEY);
      if (dHammer) {
        dHammer.hammer.off(dHammer.event);
      }
    }
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._isFixed = function (drawer) {
    return OffcanvasUtils._getOuterWrapper(drawer).hasClass('oj-offcanvas-page');
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._isReflow = function (offcanvas) {
    return offcanvas[OffcanvasUtils.DISPLAY_MODE_KEY] === OffcanvasUtils.DISPLAY_MODE_REFLOW;
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._noInnerWrapper = function (offcanvas) {
    return (
      offcanvas[OffcanvasUtils.CONTENT_KEY] ||
      OffcanvasUtils._isFixed(OffcanvasUtils._getDrawer(offcanvas)) ||
      OffcanvasUtils._isReflow(offcanvas)
    );
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._toggleOuterWrapper = function (offcanvas, drawer, test) {
    var edge = OffcanvasUtils._getEdge(drawer);
    var shiftSelector = OffcanvasUtils._getShiftSelector(edge);
    var outerWrapper = OffcanvasUtils._getOuterWrapper(drawer);

    oj.Assert.assertPrototype(outerWrapper, $);

    var isOpen = outerWrapper.hasClass(shiftSelector);
    if (!test) {
      outerWrapper.toggleClass(shiftSelector, !isOpen);
    }

    return isOpen;
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._afterCloseHandler = function (offcanvas) {
    var wrapper = OffcanvasUtils._getAnimateWrapper(offcanvas);
    // bail if pan to reveal is in progress
    if (wrapper.get(0).style.transform !== '') {
      return;
    }

    //  - customsyntax memory leak: offcanvas needs to implement _disconnected
    // unregister dismiss handler
    OffcanvasUtils._unregisterCloseHandler(offcanvas);

    var drawer = OffcanvasUtils._getDrawer(offcanvas);
    var isReflow = OffcanvasUtils._isReflow(offcanvas);

    // validate offcanvas
    var curOffcanvas = null;
    try {
      curOffcanvas = $.data(drawer[0], OffcanvasUtils._DATA_OFFCANVAS_KEY);
    } catch (e) {
      // Throw away error.
    }
    if (curOffcanvas !== offcanvas) {
      return;
    }

    // After animation, set display:none and remove transition class
    if (isReflow) {
      drawer.removeClass(
        OffcanvasUtils.OPEN_SELECTOR + ' ' + OffcanvasUtils.REFLOW_TRANSITION_SELECTOR
      );
    } else {
      OffcanvasUtils._toggleClass(offcanvas, wrapper, false);
    }

    // Remove the glassPane if offcanvas is modal
    OffcanvasUtils._removeModality(offcanvas);

    if (isReflow) {
      OffcanvasUtils._getOuterWrapper(drawer).removeClass(OffcanvasUtils.REFLOW_WRAPPER_SELECTOR);
    }

    // fire after close event
    drawer.trigger('ojclose', offcanvas);

    // remove data associate with the offcanvas
    $.removeData(drawer[0], OffcanvasUtils._DATA_OFFCANVAS_KEY);
  };

  /**
   * Set whether the offcanvas is fixed inside the viewport
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._setVisible = function (selector, _visible, edge) {
    var drawer = $(selector);
    var visible = !!_visible;

    // close the offcanvas without animation if it's open
    if (visible && OffcanvasUtils._isOpen(drawer)) {
      // hide offcanvas without animation
      OffcanvasUtils._close(selector, false);
    }

    // toggle "oj-offcanvas-" + edge class
    drawer.toggleClass(OffcanvasUtils._drawerSelector[edge], !visible);
  };

  /**
   * Setup offcanvas for the responsive layout.
   * This method adds a listener based on the media query specified in offcanvas.query.
   * When the media query matches the listener is called and offcanvas behavior is removed.
   * When the media query does not match the listener is called and off canvas behavior is added.
   *
   * @export
   * @param {Object} offcanvas An Object contains the properties in the following table.
   * @property {string} offcanvas.selector Document selector identifying the offcanvas element
   * @property {('start'|'end'|'top'|'bottom')=} offcanvas.edge the edge of the offcanvas, valid values are start, end, top, bottom. This property is optional if the offcanvas element has a "oj-offcanvas-" + <edge> class specified.
   * @property {string|null} offcanvas.query the media query determine when the offcanvas is fixed inside the viewport.
   * @return {void}
   * @memberof OffcanvasUtils
   *
   * @see #tearDownResponsive
   *
   * @example <caption>Setup the offcanvas:</caption>
   *    var offcanvas = {
   *      "selector": "#startDrawer",
   *      "edge": "start",
   *      "query": oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP)
   *    };
   *
   * OffcanvasUtils.setupResponsive(offcanvas);
   *
   */
  OffcanvasUtils.setupResponsive = function (offcanvas) {
    var mqs = offcanvas.query;
    if (mqs !== null) {
      var selector = offcanvas[OffcanvasUtils.SELECTOR_KEY];
      var query = window.matchMedia(mqs);

      // save the edge
      var edge = OffcanvasUtils._saveEdge(offcanvas);
      var mqListener = function (event) {
        // when event.matches=true fix the offcanvas inside the visible viewport.
        OffcanvasUtils._setVisible(selector, event.matches, edge);
      };

      query.addListener(mqListener);
      OffcanvasUtils._setVisible(selector, query.matches, edge);

      // keep the listener in the offcanvas jquery data
      $.data($(selector)[0], OffcanvasUtils._DATA_MEDIA_QUERY_KEY, {
        mqList: query,
        mqListener: mqListener
      });
    }
  };

  /**
   * Removes the listener that was added in setupResponsive.  Page authors should call tearDownResponsive when the offcanvas is no longer needed.
   *
   * @export
   * @param {Object} offcanvas An Object contains the properties in the following table.
   * @property {string} offcanvas.selector Document selector identifying the offcanvas element
   * @return {void}
   * @memberof OffcanvasUtils
   *
   * @see #setupResponsive
   *
   * @example <caption>TearDown the offcanvas:</caption>
   *    var offcanvas = {
   *      "selector": "#startDrawer"
   *    };
   *
   * OffcanvasUtils.tearDownResponsive(offcanvas);
   *
   */
  OffcanvasUtils.tearDownResponsive = function (offcanvas) {
    var drawer = OffcanvasUtils._getDrawer(offcanvas);
    var mql = $.data(drawer[0], OffcanvasUtils._DATA_MEDIA_QUERY_KEY);
    if (mql) {
      mql.mqList.removeListener(mql.mqListener);
      $.removeData(drawer[0], OffcanvasUtils._DATA_MEDIA_QUERY_KEY);
    }
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._openPush = function (offcanvas, resolve, reject, edge) {
    var drawer = OffcanvasUtils._getDrawer(offcanvas);
    var $main = $(offcanvas[OffcanvasUtils.CONTENT_KEY]);
    oj.Assert.assertPrototype($main, $);

    // since drawer and main are animated seperately,
    // only resolve true when both transitions are ended
    var pending = true;

    var size = offcanvas.size;
    var translation;

    // transition end handler
    var endHandler = function ($elem) {
      // After animation, remove transition class
      $elem.removeClass(OffcanvasUtils.TRANSITION_SELECTOR);

      if (pending) {
        pending = false;
      } else {
        //  - opening offcanvas automatically scrolls to the top
        //  - perf: fif jank: nav drawer and list view items
        // Moving the focus before animation works fine with the "start" and "top" drawers, but not
        // with the "end" and "bottom" drawers. (There may be a browser bug causing problems)
        if (edge === OffcanvasUtils.EDGE_END || edge === OffcanvasUtils.EDGE_BOTTOM) {
          OffcanvasUtils._setFocus(offcanvas);
        }

        // fire after open event
        drawer.trigger('ojopen', offcanvas);

        //  - push and overlay demos don't work in ie11
        // register dismiss handler as late as possible because IE raises focus event
        // on the launcher that will close the offcanvas if autoDismiss is true
        OffcanvasUtils._registerCloseHandler(offcanvas);

        resolve(true);
      }
    };

    // set display block to get size of offcanvas
    drawer.addClass(OffcanvasUtils.OPEN_SELECTOR);

    // set translationX or Y
    window.setTimeout(function () {
      // if size is not specified, outerWidth/outerHeight is used
      if (edge === OffcanvasUtils.EDGE_START || edge === OffcanvasUtils.EDGE_END) {
        if (size === undefined) {
          size = drawer.outerWidth(true) + 'px';
        }

        //  - offcanvas: drawer push animation is incorrect in rtl mode
        //      OffcanvasUtils._setTransform(drawer,
        //                                      OffcanvasUtils._getTranslationX(edge, size, true));
        translation = OffcanvasUtils._getTranslationX(edge, size, false);
      } else {
        if (size === undefined) {
          size = drawer.outerHeight(true) + 'px';
        }

        OffcanvasUtils._setTransform(
          drawer,
          OffcanvasUtils._getTranslationY2(size, edge === OffcanvasUtils.EDGE_TOP)
        );

        translation = OffcanvasUtils._getTranslationY2(size, edge !== OffcanvasUtils.EDGE_TOP);
      }

      // before animation
      window.setTimeout(function () {
        // add transition class
        OffcanvasUtils._setAnimateClass(
          offcanvas,
          drawer,
          $main,
          'translate3d(0, 0, 0)',
          translation
        );

        OffcanvasUtils._toggleOuterWrapper(offcanvas, drawer, false);

        // add transition end listener
        OffcanvasUtils._onTransitionEnd($main, endHandler);
        OffcanvasUtils._onTransitionEnd(drawer, endHandler);
      }, 0); // before animation
    }, 0); // set translationX or Y

    // insert a glassPane if offcanvas is modal
    OffcanvasUtils._applyModality(offcanvas, drawer);

    //  - opening offcanvas automatically scrolls to the top
    //  - perf: fif jank: nav drawer and list view items
    // Moving the focus before animation works fine with the "start" and "top" drawers, but not with
    // the "end" and "bottom" drawers. (There may be a browser bug causing problems)
    if (edge === OffcanvasUtils.EDGE_START || edge === OffcanvasUtils.EDGE_TOP) {
      OffcanvasUtils._setFocus(offcanvas);
    }
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._openOverlay = function (offcanvas, resolve, reject, edge) {
    var drawer = OffcanvasUtils._getDrawer(offcanvas);

    // Before animation, remove display:none and add transition class
    OffcanvasUtils._toggleClass(offcanvas, drawer, true);

    var size = offcanvas.size;
    if (size) {
      if (edge === OffcanvasUtils.EDGE_START || edge === OffcanvasUtils.EDGE_END) {
        OffcanvasUtils._setTransform(drawer, OffcanvasUtils._getTranslationX(edge, size, true));
      } else {
        OffcanvasUtils._setTransform(drawer, OffcanvasUtils._getTranslationY(edge, size));
      }
    }

    // show the drawer
    window.setTimeout(function () {
      OffcanvasUtils._toggleOuterWrapper(offcanvas, drawer, false);
    }, 20); // chrome is fine with 0ms but FF needs ~10ms or it wont animate

    // insert a glassPane if offcanvas is modal
    OffcanvasUtils._applyModality(offcanvas, drawer);

    //  - opening offcanvas automatically scrolls to the top
    //  - perf: fif jank: nav drawer and list view items
    // Moving the focus before animation works fine with the "start" and "top" drawers, but not with
    // the "end" and "bottom" drawers. (There may be a browser bug causing problems)
    if (edge === OffcanvasUtils.EDGE_START || edge === OffcanvasUtils.EDGE_TOP) {
      OffcanvasUtils._setFocus(offcanvas);
    }

    // add transition end listener
    OffcanvasUtils._onTransitionEnd(drawer, function () {
      // After animation, remove transition class
      drawer.removeClass(OffcanvasUtils.TRANSITION_SELECTOR);

      //  - opening offcanvas automatically scrolls to the top
      //  - perf: fif jank: nav drawer and list view items
      // Moving the focus before animation works fine with the "start" and "top" drawers, but not
      // with the "end" and "bottom" drawers. (There may be a browser bug causing problems)
      if (edge === OffcanvasUtils.EDGE_END || edge === OffcanvasUtils.EDGE_BOTTOM) {
        OffcanvasUtils._setFocus(offcanvas);
      }
      // fire after open event
      drawer.trigger('ojopen', offcanvas);

      //  - push and overlay demos don't work in ie11
      // register dismiss handler as late as possible because IE raises focus event
      // on the launcher that will close the offcanvas if autoDismiss is true
      OffcanvasUtils._registerCloseHandler(offcanvas);

      resolve(true);
    });
  };

  /*
   * @memberof OffcanvasUtils
   * @private

  OffcanvasUtils._openReflow = function (offcanvas, resolve, reject, edge) {
    var drawer = OffcanvasUtils._getDrawer(offcanvas);
    var $main = $(offcanvas[OffcanvasUtils.CONTENT_KEY]);
    oj.Assert.assertPrototype($main, $);

    var size = offcanvas.size;

    // set display block to get size of offcanvas
    drawer.addClass(OffcanvasUtils.OPEN_SELECTOR);

    // set translationX
    window.setTimeout(function () {
      // if size is not specified, outerWidth is used
      if (size === undefined) {
        size = drawer.outerWidth(true) + 'px';
      }
      drawer.addClass(OffcanvasUtils.REFLOW_TRANSITION_SELECTOR);

      // make the outer wrapper a flex layout
      OffcanvasUtils._getOuterWrapper(drawer).addClass(OffcanvasUtils.REFLOW_WRAPPER_SELECTOR);

      // clear transform only work if set style
      OffcanvasUtils._setTransform(drawer, 'none');

      // animate on min-width
      window.setTimeout(function () {
        drawer.css('min-width', size);

        OffcanvasUtils._toggleOuterWrapper(offcanvas, drawer, false);
      }, 10);
    }, 0);    // set translationX

    // insert a glassPane if offcanvas is modal
    OffcanvasUtils._applyModality(offcanvas, drawer);

    //  - opening offcanvas automatically scrolls to the top
    //  - perf: fif jank: nav drawer and list view items
    // Moving the focus before animation works fine with the "start" and "top" drawers, but not with
    // the "end" and "bottom" drawers. (There may be a browser bug causing problems)
    if (edge === OffcanvasUtils.EDGE_START || edge === OffcanvasUtils.EDGE_TOP) {
      OffcanvasUtils._setFocus(offcanvas);
    }

    // add transition end listener
    OffcanvasUtils._onTransitionEnd(drawer,
      function () {
        // After animation, remove transition class
        drawer.removeClass(OffcanvasUtils.TRANSITION_SELECTOR);

        //  - opening offcanvas automatically scrolls to the top
        //  - perf: fif jank: nav drawer and list view items
        // Moving the focus before animation works fine with the "start" and "top" drawers, but not
        // with the "end" and "bottom" drawers. (There may be a browser bug causing problems)
        if (edge === OffcanvasUtils.EDGE_END || edge === OffcanvasUtils.EDGE_BOTTOM) {
          OffcanvasUtils._setFocus(offcanvas);
        }

        // fire after open event
        drawer.trigger('ojopen', offcanvas);

        //  - push and overlay demos don't work in ie11
        // register dismiss handler as late as possible because IE raises focus event
        // on the launcher that will close the offcanvas if autoDismiss is true
        OffcanvasUtils._registerCloseHandler(offcanvas);

        resolve(true);
      });
  };
   */

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._closePush = function (offcanvas, resolve, reject, drawer, animation) {
    var $main = $(offcanvas[OffcanvasUtils.CONTENT_KEY]);
    // since drawer and main are animated seperately,
    // only resolve true when both transitions are ended
    var pending = true;

    //  - issue in ojoffcanvas when used inside ojtabs
    var endHandler = function () {
      if (!pending) {
        // clear transform translation on $main
        $main.removeClass(OffcanvasUtils.TRANSITION_SELECTOR);
        OffcanvasUtils._setTransform($main, '');
        OffcanvasUtils._afterCloseHandler(offcanvas);
        resolve(true);
      }
      pending = false;
    };

    // clear transform
    OffcanvasUtils._setTransform(drawer, '');
    OffcanvasUtils._setTransform($main, '');
    OffcanvasUtils._toggleOuterWrapper(offcanvas, drawer, false);

    // dim glassPane
    if (OffcanvasUtils._isModal(offcanvas)) {
      offcanvas[OffcanvasUtils.GLASS_PANE_KEY].removeClass(OffcanvasUtils.GLASSPANE_DIM_SELECTOR);
    }

    if (animation) {
      // Before animation, add transition class
      $main.addClass(OffcanvasUtils.TRANSITION_SELECTOR);
      drawer.addClass(OffcanvasUtils.TRANSITION_SELECTOR);

      // add transition end listener
      OffcanvasUtils._onTransitionEnd(drawer, endHandler);
      OffcanvasUtils._onTransitionEnd($main, endHandler);
    } else {
      pending = false;
      endHandler();
    }
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._closeOverlay = function (offcanvas, resolve, reject, drawer, animation) {
    var endHandler = function () {
      OffcanvasUtils._afterCloseHandler(offcanvas);
      resolve(true);
    };

    // clear transform
    OffcanvasUtils._toggleOuterWrapper(offcanvas, drawer, false);

    // dim glassPane
    if (OffcanvasUtils._isModal(offcanvas)) {
      offcanvas[OffcanvasUtils.GLASS_PANE_KEY].removeClass(OffcanvasUtils.GLASSPANE_DIM_SELECTOR);
    }

    if (animation) {
      drawer.addClass(OffcanvasUtils.TRANSITION_SELECTOR);

      // add transition end listener
      OffcanvasUtils._onTransitionEnd(drawer, endHandler);
    } else {
      endHandler();
    }
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._openOldDrawer = function (offcanvas, resolve, reject, edge, displayMode) {
    var drawer = OffcanvasUtils._getDrawer(offcanvas);
    var wrapper = OffcanvasUtils._getAnimateWrapper(offcanvas);
    oj.Assert.assertPrototype(wrapper, $);

    // Before animation, remove display:none and add transition class
    OffcanvasUtils._toggleClass(offcanvas, wrapper, true);

    var size;
    if (edge === OffcanvasUtils.EDGE_START || edge === OffcanvasUtils.EDGE_END) {
      // if size is missing, outerWidth is used
      size = drawer.outerWidth(true) + 'px';

      // don't set transform for OffcanvasUtils.DISPLAY_MODE_OVERLAY
      if (displayMode === OffcanvasUtils.DISPLAY_MODE_PUSH) {
        OffcanvasUtils._setTranslationX(wrapper, edge, size);
      }
    } else {
      // if size is missing, outerHeight is used
      size = drawer.outerHeight(true) + 'px';

      // don't set transform for OffcanvasUtils.DISPLAY_MODE_OVERLAY
      if (displayMode === OffcanvasUtils.DISPLAY_MODE_PUSH) {
        OffcanvasUtils._setTranslationY(wrapper, edge, size);
      }
    }

    // show the drawer
    window.setTimeout(function () {
      OffcanvasUtils._toggleOuterWrapper(offcanvas, drawer, false);
    }, 10); // chrome is fine with 0ms but FF needs ~10ms or it wont animate

    // insert a glassPane if offcanvas is modal
    OffcanvasUtils._applyModality(offcanvas, drawer);

    //  - opening offcanvas automatically scrolls to the top
    //  - perf: fif jank: nav drawer and list view items
    // Moving the focus before animation works fine with the "start" and "top" drawers, but not with
    // the "end" and "bottom" drawers. (There may be a browser bug causing problems)
    if (edge === OffcanvasUtils.EDGE_START || edge === OffcanvasUtils.EDGE_TOP) {
      OffcanvasUtils._setFocus(offcanvas);
    }

    // add transition end listener
    OffcanvasUtils._onTransitionEnd(wrapper, function () {
      // After animation, remove transition class
      wrapper.removeClass(OffcanvasUtils.TRANSITION_SELECTOR);

      //  - opening offcanvas automatically scrolls to the top
      //  - perf: fif jank: nav drawer and list view items
      // Moving the focus before animation works fine with the "start" and "top" drawers, but not
      // with the "end" and "bottom" drawers. (There may be a browser bug causing problems)
      if (edge === OffcanvasUtils.EDGE_END || edge === OffcanvasUtils.EDGE_BOTTOM) {
        OffcanvasUtils._setFocus(offcanvas);
      }

      // fire after open event
      drawer.trigger('ojopen', offcanvas);

      //  - push and overlay demos don't work in ie11
      // register dismiss handler as late as possible because IE raises focus event
      // on the launcher that will close the offcanvas if autoDismiss is true
      OffcanvasUtils._registerCloseHandler(offcanvas);

      resolve(true);
    });
  };

  /*
   * @memberof OffcanvasUtils
   * @private

  OffcanvasUtils._closeReflow = function (offcanvas, resolve, reject, drawer, animation) {
    var endHandler = function () {
      OffcanvasUtils._afterCloseHandler(offcanvas);
      resolve(true);
    };

    // clear transform
    OffcanvasUtils._toggleOuterWrapper(offcanvas, drawer, false);

    // dim glassPane
    if (OffcanvasUtils._isModal(offcanvas)) {
      offcanvas[OffcanvasUtils.GLASS_PANE_KEY]
        .removeClass(OffcanvasUtils.GLASSPANE_DIM_SELECTOR);
    }

    if (animation) {
      // Before animation, add transition class
      drawer.addClass(OffcanvasUtils.TRANSITION_SELECTOR);
      OffcanvasUtils._setTransform(drawer, '');
      drawer.css('min-width', '0');

      // add transition end listener
      OffcanvasUtils._onTransitionEnd(drawer, endHandler);
    } else {
      endHandler();
    }
  };
   */

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._closeOldDrawer = function (offcanvas, resolve, reject, drawer, animation) {
    var displayMode = offcanvas[OffcanvasUtils.DISPLAY_MODE_KEY];
    var wrapper = OffcanvasUtils._getAnimateWrapper(offcanvas);

    var endHandler = function () {
      OffcanvasUtils._afterCloseHandler(offcanvas);
      resolve(true);
    };

    // clear transform
    if (displayMode === OffcanvasUtils.DISPLAY_MODE_PUSH) {
      OffcanvasUtils._setTransform(wrapper, '');
    }
    OffcanvasUtils._toggleOuterWrapper(offcanvas, drawer, false);

    // dim glassPane
    if (OffcanvasUtils._isModal(offcanvas)) {
      offcanvas[OffcanvasUtils.GLASS_PANE_KEY].removeClass(OffcanvasUtils.GLASSPANE_DIM_SELECTOR);
    }

    if (animation) {
      // Before animation, add transition class
      wrapper.addClass(OffcanvasUtils.TRANSITION_SELECTOR);

      // add transition end listener
      OffcanvasUtils._onTransitionEnd(wrapper, endHandler);
    } else {
      endHandler();
    }
  };

  /**
   * Shows the offcanvas by sliding it into the viewport.  This method fire an ojbeforeopen event which can be vetoed by attaching a listener and returning false.  If the open is not vetoed, this method will fire an ojopen event once animation has completed.
   *
   *<p>Upon opening a offcanvas, focus is automatically moved to the first item that matches the following:</p>
   *<ol>
   *  <li>The first element within the offcanvas with the <code>autofocus</code> attribute</li>
   *  <li>The first <code>:tabbable</code> element inside the offcanvas</li>
   *  <li>The offcanvas itself</li>
   *</ol>
   *
   * @export
   * @param {Object} offcanvas An Object contains the properties in the following table.
   * @property {string} offcanvas.selector Document selector identifying the offcanvas element.
   * @property {string} offcanvas.content Document selector identifying the main content.
   * @property {('start'|'end'|'top'|'bottom')=} offcanvas.edge the edge of the offcanvas, valid values are start, end, top, bottom. This property is optional if the offcanvas element has a "oj-offcanvas-" + <edge> class specified.
   * @property {('push'|'overlay')=} offcanvas.displayMode how to show the offcanvas, valid values are push or overlay. Default: defined by theme.
   * @property {('focusLoss'|'none')=} offcanvas.autoDismiss close behavior, valid values are focusLoss and none. If autoDismiss is default(focusLoss) then any click outside the offcanvas will close it.
   * @property {string=} offcanvas.size size width or height of the offcanvas: width if edge is start or end and height if edge is to and bottom. Default to the computed width or height of the offcanvas.
   * @property {('modal'|'modeless')=} offcanvas.modality The modality of the offcanvas. Valid values are modal and modeless. Default: modeless. If the offcanvas is modal, interaction with the main content area is disabled like in a modal dialog.
   * @return {Promise.<boolean>} A promise that is resolved to boolean true when all transitions have completed. The promise is rejected if the ojbeforeopen event is vetoed.
   * @see #close
   * @see #toggle
   *
   * @memberof OffcanvasUtils
   *
   * @example <caption>Slide the offcanvas into the viewport:</caption>
   *    var offcanvas = {
   *      "selector": "#startDrawer",
   *      "content": "#mainContent",
   *      "edge": "start",
   *      "displayMode": "push",
   *      "size": "200px"
   *    };
   *
   * OffcanvasUtils.open(offcanvas);
   *
   */
  OffcanvasUtils.open = function (offcanvas) {
    var drawer = OffcanvasUtils._getDrawer(offcanvas);
    var oldOffcanvas = $.data(drawer[0], OffcanvasUtils._DATA_OFFCANVAS_KEY);
    if (oldOffcanvas) {
      // if we are in the middle of closing, then return the previous saved promise
      if (oldOffcanvas[OffcanvasUtils.CLOSE_PROMISE_KEY]) {
        return oldOffcanvas[OffcanvasUtils.CLOSE_PROMISE_KEY];
      }

      // if we are in the middle of opening, then return the previous saved promise
      if (oldOffcanvas[OffcanvasUtils.OPEN_PROMISE_KEY]) {
        return oldOffcanvas[OffcanvasUtils.OPEN_PROMISE_KEY];
      }
    }

    var resolveBusyState;
    var veto = false;
    var promise = new Promise(function (resolve, reject) {
      oj.Assert.assertPrototype(drawer, $);

      // save the edge
      var edge = OffcanvasUtils._saveEdge(offcanvas);

      // fire before open event
      var event = $.Event('ojbeforeopen');
      drawer.trigger(event, offcanvas);
      if (event.result === false) {
        reject(OffcanvasUtils.VETO_BEFOREOPEN_MSG);
        veto = true;
        return;
      }

      var displayMode = OffcanvasUtils._getDisplayMode(offcanvas);
      var isReflow = OffcanvasUtils._isReflow(offcanvas);

      // only support horizontal offcanvas for reflow
      if (isReflow && (edge === OffcanvasUtils.EDGE_TOP || edge === OffcanvasUtils.EDGE_BOTTOM)) {
        displayMode = OffcanvasUtils.DISPLAY_MODE_PUSH;
      }

      // save a copy of offcanvas object in offcanvas jquery data
      var myOffcanvas = $.extend({}, offcanvas);
      myOffcanvas[OffcanvasUtils.DISPLAY_MODE_KEY] = displayMode;
      $.data(drawer[0], OffcanvasUtils._DATA_OFFCANVAS_KEY, myOffcanvas);

      // throw an error if CONTENT_KEY is specified and the html markup contains an inner wrapper.
      if (offcanvas[OffcanvasUtils.CONTENT_KEY]) {
        if (!OffcanvasUtils._noInnerWrapper(offcanvas)) {
          throw new Error(
            "Error: Both main content selector and the inner wrapper <div class='oj-offcanvas-inner-wrapper'> are provided. Please remove the inner wrapper."
          );
        }

        // Add a busy state for the animation.  The busy state resolver will be invoked
        // when the animation is completed
        var busyContext = Context.getContext(drawer[0]).getBusyContext();
        resolveBusyState = busyContext.addBusyState({
          description:
            "The offcanvas selector ='" +
            offcanvas[OffcanvasUtils.SELECTOR_KEY] +
            "' doing the open animation."
        });

        if (isReflow) {
          // OffcanvasUtils._openReflow(myOffcanvas, resolve, reject, edge);
        } else if (displayMode === OffcanvasUtils.DISPLAY_MODE_PUSH) {
          OffcanvasUtils._openPush(myOffcanvas, resolve, reject, edge);
        } else {
          OffcanvasUtils._openOverlay(myOffcanvas, resolve, reject, edge);
        }
      } else {
        OffcanvasUtils._openOldDrawer(myOffcanvas, resolve, reject, edge, displayMode);
      }
    });

    promise = promise.then(
      function (value) {
        if (resolveBusyState) {
          resolveBusyState();
        }
        return value;
      },
      function (error) {
        if (resolveBusyState) {
          resolveBusyState();
        }
        throw error;
      }
    );

    // save away the current promise
    if (!veto) {
      var nOffcanvas = $.data(drawer[0], OffcanvasUtils._DATA_OFFCANVAS_KEY);
      if (nOffcanvas) {
        nOffcanvas[OffcanvasUtils.OPEN_PROMISE_KEY] = promise;

        // notify subtree
        Components.subtreeShown(drawer[0]);
      }
    }

    return /** @type{Promise.<boolean>} */ (promise);
  };

  /**
   * Hides the offcanvas by sliding it out of the viewport.  This method fires an ojbeforeclose event which can be vetoed by attaching a listener and returning false.  If the close is not vetoed, this method will fire an ojclose event once animation has completed.
   *
   * @export
   * @param {Object} offcanvas An Object contains the properties in the following table.
   * @property {string} offcanvas.selector Document selector identifying the offcanvas element
   * @return {Promise.<boolean>} A promise that is resolved to boolean true when all transitions have completed. The promise is rejected if the ojbeforeclose event is vetoed.
   * @see #open
   * @see #toggle
   *
   * @memberof OffcanvasUtils
   *
   * @example <caption>Slide the offcanvas out of the viewport:</caption>
   *    var offcanvas = {
   *      "selector": "#startDrawer"
   *    };
   *
   * OffcanvasUtils.close(offcanvas);
   *
   */
  OffcanvasUtils.close = function (offcanvas) {
    return OffcanvasUtils._close(
      offcanvas[OffcanvasUtils.SELECTOR_KEY],
      offcanvas[OffcanvasUtils.ANIMATE_KEY] === undefined
    );
  };

  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._close = function (selector, animation) {
    var drawer = $(selector);

    oj.Assert.assertPrototype(drawer, $);

    var offcanvas = $.data(drawer[0], OffcanvasUtils._DATA_OFFCANVAS_KEY);

    // if we are in the middle of closing, then return the previous saved promise
    if (offcanvas && offcanvas[OffcanvasUtils.CLOSE_PROMISE_KEY]) {
      return offcanvas[OffcanvasUtils.CLOSE_PROMISE_KEY];
    }

    var resolveBusyState;
    var veto = false;
    var promise = new Promise(function (resolve, reject) {
      if (OffcanvasUtils._isOpen(drawer)) {
        // if offcanvas not present, we are done
        if (offcanvas == null) {
          resolve(true);
        }

        if (selector !== offcanvas[OffcanvasUtils.SELECTOR_KEY]) {
          resolve(true);
        }

        // if the outer wrapper doesn't have the correct shift selector, we are done
        if (!OffcanvasUtils._toggleOuterWrapper(offcanvas, drawer, true)) {
          resolve(true);
        }

        // fire before close event
        var event = $.Event('ojbeforeclose');
        drawer.trigger(event, offcanvas);
        if (event.result === false) {
          reject(OffcanvasUtils.VETO_BEFORECLOSE_MSG);
          veto = true;
          return;
        }

        // Add a busy state for the animation.  The busy state resolver will be invoked
        // when the animation is completed
        if (animation) {
          var busyContext = Context.getContext(drawer[0]).getBusyContext();
          resolveBusyState = busyContext.addBusyState({
            description:
              "The offcanvas selector ='" +
              offcanvas[OffcanvasUtils.SELECTOR_KEY] +
              "' doing the close animation."
          });
        }

        var displayMode = offcanvas[OffcanvasUtils.DISPLAY_MODE_KEY];
        if (offcanvas[OffcanvasUtils.CONTENT_KEY]) {
          if (displayMode === OffcanvasUtils.DISPLAY_MODE_PUSH) {
            OffcanvasUtils._closePush(offcanvas, resolve, reject, drawer, animation);
          } else {
            OffcanvasUtils._closeOverlay(offcanvas, resolve, reject, drawer, animation);
          }
        } else {
          OffcanvasUtils._closeOldDrawer(offcanvas, resolve, reject, drawer, animation);
        }
      } else {
        resolve(true);
      }
    });

    promise = promise.then(
      function (value) {
        if (resolveBusyState) {
          resolveBusyState();
        }
        return value;
      },
      function (error) {
        if (resolveBusyState) {
          resolveBusyState();
        }
        throw error;
      }
    );

    // save away the current promise
    if (!veto) {
      offcanvas = $.data(drawer[0], OffcanvasUtils._DATA_OFFCANVAS_KEY);
      if (offcanvas) {
        offcanvas[OffcanvasUtils.CLOSE_PROMISE_KEY] = promise;

        // notify subtree
        Components.subtreeHidden(drawer[0]);
      }
    }

    return /** @type{Promise.<boolean>} */ (promise);
  };

  /**
   * Toggles the offcanvas in or out of the viewport.  This method simply delegates to the open or close methods as appropriate.
   *
   * @export
   * @param {Object} offcanvas An Object contains the properties in the following table.
   * @property {string} offcanvas.selector Document selector identifying the offcanvas element.
   * @property {string} offcanvas.content Document selector identifying the main content.
   * @property {('start'|'end'|'top'|'bottom')=} offcanvas.edge the edge of the offcanvas, valid values are start, end, top, bottom. This property is optional if the offcanvas element has a "oj-offcanvas-" + <edge> class specified.
   * @property {('push'|'overlay')=} offcanvas.displayMode how to show the offcanvas, valid values are push or overlay. Default: defined by theme.
   * @property {('focusLoss'|'none')=} offcanvas.autoDismiss close behavior, valid values are focusLoss and none. If autoDismiss is default(focusLoss) then any click outside the offcanvas will close it.
   * @property {string=} offcanvas.size size width or height of the offcanvas: width if edge is start or end and height if edge is to and bottom. Default to the computed width or height of the offcanvas.
   * @property {('modal'|'modeless')=} offcanvas.modality The modality of the offcanvas. Valid values are modal and modeless. Default: modeless. If the offcanvas is modal, interaction with the main content area is disabled like in a modal dialog.
   * @return {Promise.<boolean>} A promise that is resolved to boolean true when all transitions have completed
   * @see #open
   * @see #close
   *
   * @memberof OffcanvasUtils
   *
   * @example <caption>Toggle the offcanvas in or out of the viewport:</caption>
   *    var offcanvas = {
   *      "selector": "#startDrawer",
   *      "edge": "start",
   *      "displayMode": "overlay"
   *    };
   *
   * OffcanvasUtils.toggle(offcanvas);
   *
   */
  OffcanvasUtils.toggle = function (offcanvas) {
    var drawer = OffcanvasUtils._getDrawer(offcanvas);
    oj.Assert.assertPrototype(drawer, $);

    if (OffcanvasUtils._isOpen(drawer)) {
      return OffcanvasUtils.close(offcanvas);
    }

    return OffcanvasUtils.open(offcanvas);
  };

  /**
   * Creates an overlay div with the oj-offcanvas-glasspane selector
   * append to the end of the drawer's container
   * @param {!jQuery} drawer the drawer
   * @return {jQuery} the overlay div
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._addGlassPane = function (drawer) {
    var overlay = $('<div>');
    overlay.addClass(OffcanvasUtils.GLASSPANE_SELECTOR);
    overlay.attr('role', 'presentation');
    overlay.attr('aria-hidden', 'true');

    // append glassPane at the end
    overlay.appendTo(drawer.parent()); // @HTMLUpdateOK
    overlay.on(
      'keydown keyup keypress mousedown mouseup mouseover mouseout click focusin focus',
      function (event) {
        event.stopPropagation();
        event.preventDefault();
      }
    );

    return overlay;
  };

  /**
   * Creates a script element before the target layer bound to the simple jquery UI
   * surrogate component.
   *
   * @param {!jQuery} layer stacking context
   * @return {jQuery}
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._createSurrogate = function (layer) {
    //  - offcanvas utils use of <script>
    var surrogate = $('<span></span>').css('display', 'none').attr('aria-hidden', 'true');

    var layerId = layer.attr('id');

    var surrogateId;
    if (layerId) {
      surrogateId = [layerId, 'surrogate'].join('_');
      surrogate.attr('id', surrogateId);
    } else {
      surrogateId = surrogate.uniqueId();
    }
    surrogate.insertBefore(layer); // @HTMLUpdateOK

    // loosely associate the offcanvas to the surrogate element
    layer.attr(OffcanvasUtils.SURROGATE_ATTR, surrogateId); // @HTMLUpdateOK

    return surrogate;
  };

  /**
   * bring the drawer to the front to keep this order:  mainContent, glassPane, drawer
   * so we don't need to use z-index
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._swapOrder = function (_offcanvas, drawer) {
    var offcanvas = _offcanvas;
    // create a surrogate in front of the mainContent to be used in _restoreOrder
    offcanvas[OffcanvasUtils.SURROGATE_KEY] = OffcanvasUtils._createSurrogate(drawer);

    drawer.appendTo(drawer.parent()); // @HTMLUpdateOK
  };

  /**
   * restore the order before _swapOrder
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._restoreOrder = function (offcanvas) {
    var drawer = OffcanvasUtils._getDrawer(offcanvas);
    var surrogate = offcanvas[OffcanvasUtils.SURROGATE_KEY];

    if (drawer && surrogate && drawer.attr(OffcanvasUtils.SURROGATE_ATTR) === surrogate.attr('id')) {
      drawer.insertAfter(surrogate); // @HTMLUpdateOK
      // remove link to the surrogate element
      drawer.removeAttr(OffcanvasUtils.SURROGATE_ATTR);
      surrogate.remove();
    }
  };

  /**
   * Apply modality
   * If offcanvas is modal, add a glasspane and keep the dom structure in the following order:
   * mainContent, glassPane and drawer so we don't need to apply z-index
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._applyModality = function (_offcanvas, drawer) {
    var offcanvas = _offcanvas;
    if (OffcanvasUtils._isModal(offcanvas)) {
      // insert glassPane in front of the mainContent
      offcanvas[OffcanvasUtils.GLASS_PANE_KEY] = OffcanvasUtils._addGlassPane(drawer);

      // bring the drawer <div> to the front
      // to keep this order:  mainContent, glassPane, drawer
      OffcanvasUtils._swapOrder(offcanvas, drawer);

      //  - acc: talkback reports on elements on background page whilst navdrawer open
      var $main = $(offcanvas[OffcanvasUtils.CONTENT_KEY]);
      $main.attr('aria-hidden', 'true');

      window.setTimeout(function () {
        offcanvas[OffcanvasUtils.GLASS_PANE_KEY].addClass(OffcanvasUtils.GLASSPANE_DIM_SELECTOR);
      }, 0);
    }
  };

  /**
   * Remove modality
   * If offcanvas is modal, remove glasspane and restore the dom element orders
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._removeModality = function (offcanvas) {
    if (OffcanvasUtils._isModal(offcanvas)) {
      offcanvas[OffcanvasUtils.GLASS_PANE_KEY].remove();
      // restore the order
      OffcanvasUtils._restoreOrder(offcanvas);

      //  - acc: talkback reports on elements on background page whilst navdrawer open
      var $main = $(offcanvas[OffcanvasUtils.CONTENT_KEY]);
      $main.removeAttr('aria-hidden');
    }
  };

  /**
   * Setup offcanvas for pan to reveal.
   * This method adds a touch listener to handle revealing the offcanvas as user pans on the outer wrapper.  The following events are fired by this method:
   * ojpanstart - fired when pan to reveal gesture initiated by the user.  The event includes the direction and distance of the pan.  If it is vetoed
   *              then pan to reveal is terminated
   * ojpanmove  - fired as user continues the pan gesture.  The event includes the direction and distance of the pan.
   * ojpanend   - fired when pan to reveal gesture ends.  The event includes the direction and distance of the pan.  If it is vetoed then the offcanvas
   *              will be closed.
   *
   * @export
   * @param {Object} offcanvas An Object contains the properties in the following table.
   * @property {string} offcanvas.selector Document selector identifying the offcanvas element
   * @property {('start'|'end'|'top'|'bottom')=} offcanvas.edge the edge of the offcanvas, valid values are start, end. This property is optional if the offcanvas element has a "oj-offcanvas-" + <edge> class specified.
   * @property {string=} offcanvas.size size width of the offcanvas.  Default to the computed width of the offcanvas.
   * @return {void}
   *
   * @memberof OffcanvasUtils
   * @ojtsignore
   *
   * @see #tearDownPanToReveal
   *
   * @example <caption>Setup the offcanvas:</caption>
   *    var offcanvas = {
   *      "selector": "#startDrawer"
   *    };
   *
   * OffcanvasUtils.setupPanToReveal(offcanvas);
   *
   */
  OffcanvasUtils.setupPanToReveal = function (_offcanvas) {
    var offcanvas = _offcanvas;
    var drawer;
    var size;
    var outerWrapper;
    var wrapper;
    var mOptions;
    var proceed;
    var direction;
    var ui;
    var evt;
    var delta;
    var edge;
    var endEvents;
    var listener;
    var isRTL;

    if ($(offcanvas).attr('oj-data-pansetup') != null) {
      // already setup
      return;
    }

    // mark as setup
    $(offcanvas).attr('oj-data-pansetup', 'true');

    // pan to reveal only works for push display mode, so enforce it
    offcanvas.displayMode = 'push';

    drawer = OffcanvasUtils._getDrawer(offcanvas);

    outerWrapper = OffcanvasUtils._getOuterWrapper(drawer);

    // use hammer for swipe
    mOptions = {
      // ensure pinch zoom work properly
      touchAction: 'pinch-zoom',
      recognizers: [[Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL }]]
    };

    // workaround for Hammer with iOS 13 issue, see: https://github.com/hammerjs/hammer.js/issues/1237
    var agent = oj.AgentUtils.getAgentInfo();
    if (agent.os === oj.AgentUtils.OS.IOS || agent.os === oj.AgentUtils.OS.ANDROID) {
      // force Hammer to only accept TouchEvent and not PointerEvent
      mOptions.inputClass = Hammer.TouchInput;
    }

    // flag to signal whether pan to reveal should proceed
    proceed = false;

    edge = offcanvas.edge;
    if (edge == null) {
      if (drawer.hasClass('oj-offcanvas-start')) {
        edge = 'start';
      } else {
        edge = 'end';
      }
    }

    isRTL = OffcanvasUtils._isRTL();

    $(outerWrapper)
      .ojHammer(mOptions)
      .on('panstart', function (event) {
        direction = null;

        switch (event.gesture.direction) {
          case Hammer.DIRECTION_LEFT:
            // diagonal case
            if (Math.abs(event.gesture.deltaY) < Math.abs(event.gesture.deltaX)) {
              direction = isRTL ? 'end' : 'start';
            }
            break;
          case Hammer.DIRECTION_RIGHT:
            // diagonal case
            if (Math.abs(event.gesture.deltaY) < Math.abs(event.gesture.deltaX)) {
              direction = isRTL ? 'start' : 'end';
            }
            break;
          default:
        }

        if (direction === null) {
          return;
        }

        // check for pan up/down at a certain angle which gives abnormal values
        if (event.gesture.angle < 0 && (event.gesture.deltaX < -100 || event.gesture.deltaY < -100)) {
          return;
        }

        ui = { direction: direction, distance: Math.abs(event.gesture.deltaX) };
        evt = $.Event('ojpanstart');
        drawer.trigger(evt, ui);

        if (!evt.isDefaultPrevented()) {
          var busyContext = Context.getContext(outerWrapper.get(0)).getBusyContext();
          busyContext.whenReady().then(function () {
            // need the size to display the canvas when release
            size = offcanvas.size;
            if (size == null) {
              size = drawer.outerWidth();
              offcanvas.size = size;
            }

            // proceed only when there's content
            if (size > 0) {
              proceed = true;
            } else {
              OffcanvasUtils._toggleClass(offcanvas, wrapper, false);
            }
          });

          // make sure it's in closed state
          offcanvas._closePromise = null;

          // cancel any close animation transition handler
          wrapper = OffcanvasUtils._getAnimateWrapper(offcanvas);
          wrapper.off('.oc');

          // sets the appropriate offcanvas class
          OffcanvasUtils._toggleClass(offcanvas, wrapper, true);

          // stop touch event from bubbling to prevent for example pull to refresh from happening
          event.gesture.srcEvent.stopPropagation();
          // prevent page from scrolling
          event.gesture.srcEvent.preventDefault();

          // stop bubbling
          event.stopPropagation();
        }
      })
      .on('panmove', function (event) {
        // don't do anything if start is vetoed
        if (!proceed) {
          return;
        }

        delta = event.gesture.deltaX;
        if (
          (direction === 'start' && delta > 0 && !isRTL) ||
          (direction === 'start' && delta < 0 && isRTL) ||
          (direction === 'end' && delta < 0 && !isRTL) ||
          (direction === 'end' && delta > 0 && isRTL)
        ) {
          OffcanvasUtils._setTranslationX(wrapper, edge, '0px');
          return;
        }

        delta = Math.abs(delta);
        drawer.css('width', delta);

        // don't do css transition animation while panning
        wrapper.removeClass(OffcanvasUtils.TRANSITION_SELECTOR);
        OffcanvasUtils._setTranslationX(wrapper, edge, delta + 'px');

        ui = { direction: direction, distance: delta };
        evt = $.Event('ojpanmove');
        drawer.trigger(evt, ui);

        // stop touch event from bubbling to prevent for example pull to refresh from happening
        event.gesture.srcEvent.stopPropagation();

        // stop bubbling
        event.stopPropagation();
      })
      .on('panend', function (event) {
        // don't do anything if start is vetoed
        if (!proceed) {
          return;
        }

        // reset flag
        proceed = false;

        delta = Math.abs(event.gesture.deltaX);
        ui = { distance: delta };
        evt = $.Event('ojpanend');
        drawer.trigger(evt, ui);

        // stop bubbling
        event.stopPropagation();

        if (!evt.isDefaultPrevented()) {
          OffcanvasUtils._animateWrapperAndDrawer(wrapper, drawer, edge, size, offcanvas);

          $.data(drawer[0], OffcanvasUtils._DATA_OFFCANVAS_KEY, offcanvas);
          $.data(drawer[0], OffcanvasUtils._DATA_EDGE_KEY, edge);

          OffcanvasUtils._registerCloseHandler(offcanvas);

          return;
        }

        // nothing to animate, still need to close the offcanvas and do clean up
        if (wrapper[0].style.transform === 'translate3d(0px, 0px, 0px)') {
          OffcanvasUtils._toggleClass(offcanvas, wrapper, false);
          wrapper.removeClass(OffcanvasUtils.TRANSITION_SELECTOR);
          drawer.trigger('ojclose', offcanvas);
          return;
        }

        // close the toolbar
        endEvents = 'transitionend webkitTransitionEnd otransitionend oTransitionEnd';
        listener = function () {
          // reset offcanvas class
          OffcanvasUtils._toggleClass(offcanvas, wrapper, false);

          wrapper.removeClass(OffcanvasUtils.TRANSITION_SELECTOR);

          // remove handler
          wrapper.off(endEvents, listener);

          // fire close event after completely closed
          drawer.trigger('ojclose', offcanvas);
        };

        // add transition end listener
        wrapper.on(endEvents, listener);

        // restore item position
        wrapper.addClass(OffcanvasUtils.TRANSITION_SELECTOR);
        OffcanvasUtils._setTranslationX(wrapper, 'start', '0px');
      });
  };

  // animate both the wrapper and drawer at the same time
  /**
   * @memberof OffcanvasUtils
   * @private
   */
  OffcanvasUtils._animateWrapperAndDrawer = function (wrapper, drawer, edge, size, offcanvas) {
    var tt = 400;
    var fps = 60;
    var ifps;
    var matrix;
    var values;
    var current;
    var first;
    var final;
    var reqId;
    var inc;
    var lastFrame;
    var func;
    var currentFrame;
    var adjInc;

    // since we can't synchronize two css transitions, we'll have to do the animation ourselves using
    // requestAnimationFrame
    // make sure wrapper animation is off
    wrapper.removeClass(OffcanvasUtils.TRANSITION_SELECTOR);

    // ideal ms per frame
    ifps = Math.round(1000 / fps);
    matrix = wrapper.css('transform');
    if (matrix === 'none') {
      // could happen if this method was called after canvas is closed
      return;
    }
    values = matrix.split('(')[1].split(')')[0].split(',');
    var agent = oj.AgentUtils.getAgentInfo();
    // this is the position of translateX value (IE11 the matrix looks different)
    var index = agent.browser === 'ie' && agent.browserVersion === 11 ? 12 : 4;
    current = parseInt(values[index], 10);

    first = current;
    // the final size/destination
    final = edge === 'end' ? 0 - size : size;
    if (OffcanvasUtils._isRTL()) {
      final = 0 - final;
    }

    // calculate the increment needed to complete transition in 400ms with 60fps
    inc = Math.max(1, Math.abs(final - current) / (tt / ifps));
    lastFrame = new Date().getTime();
    func = function () {
      // check if it got interrupted by close
      if (first !== current && wrapper.get(0).style.transform === '') {
        window.cancelAnimationFrame(reqId);
        return;
      }

      currentFrame = new Date().getTime();
      // see how much we'll need to compensate if fps drops below ideal
      adjInc = Math.max(inc, inc * Math.max((currentFrame - lastFrame) / ifps));
      lastFrame = currentFrame;
      if (current < final) {
        current = Math.min(final, current + adjInc);
      } else if (current > final) {
        current = Math.max(final, current - adjInc);
      }

      OffcanvasUtils._setTranslationX(wrapper, edge, Math.abs(current) + 'px');
      drawer.css('width', Math.abs(current) + 'px');

      // make sure to cancel the animation frame if we are done
      if (current === final) {
        window.cancelAnimationFrame(reqId);
        wrapper.addClass(OffcanvasUtils.TRANSITION_SELECTOR);

        // fire after completely open
        drawer.trigger('ojopen', offcanvas);
      } else {
        reqId = window.requestAnimationFrame(func);
      }
    };

    reqId = window.requestAnimationFrame(func);
  };

  /**
   * Removes the listener that was added in setupPanToReveal.  Page authors should call tearDownPanToReveal when the offcanvas is no longer needed.
   *
   * @export
   * @param {Object} offcanvas An Object contains the properties in the following table.
   * @property {string} offcanvas.selector Document selector identifying the offcanvas element
   * @return {void}
   * @see #setupPanToReveal
   *
   * @memberof OffcanvasUtils
   * @ojtsignore
   *
   * @example <caption>TearDown the offcanvas:</caption>
   *    var offcanvas = {
   *      "selector": "#startDrawer"
   *    };
   *
   * OffcanvasUtils.tearDownPanToReveal(offcanvas);
   *
   */
  OffcanvasUtils.tearDownPanToReveal = function (offcanvas) {
    var drawer = OffcanvasUtils._getDrawer(offcanvas);
    var outerWrapper = OffcanvasUtils._getOuterWrapper(drawer);

    // remove all listeners
    $(outerWrapper).off('panstart panmove panend');
  };

  const close = OffcanvasUtils.close;
  const open = OffcanvasUtils.open;
  const setupResponsive = OffcanvasUtils.setupResponsive;
  const setupPanToReveal = OffcanvasUtils.setupPanToReveal;
  const tearDownResponsive = OffcanvasUtils.tearDownResponsive;
  const tearDownPanToReveal = OffcanvasUtils.tearDownPanToReveal;
  const toggle = OffcanvasUtils.toggle;
  const _getOuterWrapper = OffcanvasUtils._getOuterWrapper;

  exports._getOuterWrapper = _getOuterWrapper;
  exports.close = close;
  exports.open = open;
  exports.setupPanToReveal = setupPanToReveal;
  exports.setupResponsive = setupResponsive;
  exports.tearDownPanToReveal = tearDownPanToReveal;
  exports.tearDownResponsive = tearDownResponsive;
  exports.toggle = toggle;

  Object.defineProperty(exports, '__esModule', { value: true });

});
