/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcontext', 'hammerjs', 'ojs/ojoffcanvas', 'touchr'],
/*
* @param {Object} oj 
* @param {jQuery} $
* @param {Object} Hammer
*/
function(oj, $, Context, Hammer, OffcanvasUtils) 
{
  "use strict";

/* global OffcanvasUtils:false, Context:false */
/**
 * @namespace oj.SwipeToRevealUtils
 * @ojtsmodule
 * @since 1.2.0
 * @export
 * @ojdeprecated {since: '7.0.0', description: 'Use ojSwipeActions instead.'}
 * @hideconstructor
 *
 *
 * @classdesc
 * This class provides functions for setting up and handling swipe to reveal on an offcanvas element.  The offcanvas
 * element contains contextual actions that users can perform on the element that user perform the swipe gesture on.
 * This is most commonly found in ListView where user swipes on an item to reveal contextual actions that can be done on the item.
 *
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"stylingDoc"}
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 * <h3 id="accessibility-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#accessibility-section"></a>
 * </h3>
 *
 * <p>Application must ensure that the context menu is available and setup with the
 * equivalent menu items so that keyboard-only users can perform all the swipe actions
 * just by using the keyboard.
 */
oj.SwipeToRevealUtils = {};
// mapping variable definition, used in a no-require environment. Maps the oj.SwipeToRevealUtils object to the name used in the require callback.
// eslint-disable-next-line no-unused-vars
var SwipeToRevealUtils = oj.SwipeToRevealUtils;

/**
 * Setup listeners needed for swipe actions capability.
 *
 * @export
 * @param {Element} elem the DOM element (of the offcanvas) that hosts the swipe actions
 * @param {Object=} options the options to set for swipe actions
 * @param {number=} options.threshold the threshold that triggers default action.  If no default action is found (no item with style
 *                 "oj-swipetoreveal-default") then this value is ignored.  If percentage value is specified it will be calculated
 *                 based on the width of the element with class "oj-offcanvas-outer-wrapper".  A default value is determined if not specified.
 *                 An "ojdefaultaction" event will be fired when threshold is exceed upon release.
 * @return {void}
 *
 * @see #tearDownSwipeActions
 * @see oj.OffcanvasUtils.html#setupPanToReveal
 */
oj.SwipeToRevealUtils.setupSwipeActions = function (elem, options) {
  var drawer;
  var direction;
  var offcanvas;
  var outerWrapper;
  var threshold;
  var minimum;
  var drawerShown;
  var busyContext;
  var evt;
  var checkpoint;
  var defaultAction;
  var distance;

  drawer = $(elem);
  // checks if it's already registered
  if (drawer.hasClass('oj-swipetoreveal')) {
    return;
  }

  drawer.addClass('oj-swipetoreveal');

  direction = drawer.hasClass('oj-offcanvas-start') ? 'end' : 'start';

  offcanvas = {};
  offcanvas.selector = drawer;
  offcanvas._animateWrapperSelector = 'oj-offcanvas-inner-wrapper';
  OffcanvasUtils.setupPanToReveal(offcanvas);

  outerWrapper = OffcanvasUtils._getOuterWrapper(drawer);

  // the panning triggers a click event at the end (since we are doing translation on move, the relative position has not changed)
  // this is to prevent the click event from bubbling (to list item for example, see )
  drawerShown = false;
  outerWrapper.on('click.swipetoreveal', function (event) {
    if (drawerShown) {
      event.stopImmediatePropagation();
      drawerShown = false;
    }
  });

  // However, this does not get trigger in hybrid app, see .
  // this change ensures that it always get reset
  outerWrapper._touchStartListener = function (event) {
    drawerShown = false;
    // prevent click event from firing when tapping on outer wrapper (like list item) while offcanvas is still open
    if (drawer.hasClass('oj-offcanvas-open') && drawer[0].offsetWidth > 0 && !drawer[0].contains(event.target)) {
      event.preventDefault();
    }
  };
  outerWrapper[0].addEventListener('touchstart', outerWrapper._touchStartListener, { passive: false });

  drawer
    .on('ojpanstart', function (event, ui) {
      // if the swipe direction does not match the offcanvas's edge, veto it
      if (ui.direction !== direction) {
        event.preventDefault();
      } else {
        busyContext = Context.getContext(outerWrapper.get(0)).getBusyContext();
        busyContext.whenReady().then(function () {
          // setup default style class, must be done before outerWidth is calculated
          drawer.children().addClass('oj-swipetoreveal-action')
                           .css('min-width', '');

          // find if there's any default action item specified
          defaultAction = drawer.children('.oj-swipetoreveal-default').get(0);

          // figure out the threshold for default action and the minimum distance
          // to keep the offcanvas open
          if (minimum == null) {
            if (options != null) {
              threshold = options.threshold;
            }

            if (threshold != null) {
              threshold = parseInt(threshold, 10);

              // check if it's percentage value
              if (/%$/.test(options.threshold)) {
                threshold = (threshold / 100) * outerWrapper.outerWidth();
              }
            } else {
              // by default it will be 55% of the outer wrapper
              threshold = outerWrapper.outerWidth() * 0.55;
            }
            // by default the minimum will be the lesser of the width of the offcanvas and half of the outer wrapper
            minimum = Math.min(outerWrapper.outerWidth() * 0.3, drawer.outerWidth());
          }
        });

        // used to determine if it's a quick swipe
        checkpoint = (new Date()).getTime();
      }
    })
    .on('ojpanmove', function (event, ui) {
      if (!drawerShown) {
        drawer.children().css('min-width', 0);
      }

      drawerShown = true;

      // check if pan pass the threshold position, the default action item gets entire space.
      if (defaultAction != null) {
        if (ui.distance > threshold) {
          drawer.children().each(function () {
            if (this !== defaultAction) {
              $(this).addClass('oj-swipetoreveal-hide-when-full');
            }
          });
        } else {
          drawer.children().removeClass('oj-swipetoreveal-hide-when-full');
        }
      }
    })
    .on('ojpanend', function (event, ui) {
      distance = ui.distance;
      if (defaultAction != null && distance > threshold) {
        // default action
        evt = $.Event('ojdefaultaction');
        drawer.trigger(evt, offcanvas);
        event.preventDefault();
      }

      // if pan pass the minimum threshold position, keep the toolbar open
      if (distance < minimum) {
        // check if this is a swipe, the time should be < 200ms and the distance must be > 10px
        if ((new Date()).getTime() - checkpoint > 200 || distance < 10) {
          event.preventDefault();
        }
      }
    });
};

/**
 * Removes the listener that was added in setupSwipeActions.  Page authors should call tearDownSwipeActions when the content container is no longer needed.
 *
 * @export
 * @param {Element} elem the DOM element (of the offcanvas) that hosts the swipe actions
 * @return {void}
 *
 * @see #setupSwipeActions
 * @see oj.OffcanvasUtils.html#tearDownPanToReveal
 */
oj.SwipeToRevealUtils.tearDownSwipeActions = function (elem) {
  var drawer;
  var offcanvas;
  var outerWrapper;

  drawer = $(elem);

  drawer.removeClass('oj-swipetoreveal');

  offcanvas = {};
  offcanvas.selector = drawer;

  outerWrapper = OffcanvasUtils._getOuterWrapper(drawer);
  if (outerWrapper != null) {
    outerWrapper.off('.swipetoreveal');
  }

  OffcanvasUtils.tearDownPanToReveal(offcanvas);

  // remove touchstart listener
  outerWrapper[0].removeEventListener('touchstart', outerWrapper._touchStartListener, { passive: false });
  delete outerWrapper._touchStartListener;
};

/**
 * The following CSS classes can be applied by the page author as needed.
 * <p>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Class</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>oj-swipetoreveal-more</td>
 *       <td>Designed for use with an action item that shows more available actions that users can perform.
 *           <p>Is applied to the element that represents the more action item inside the offcanvas element.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-swipetoreveal-flag</td>
 *       <td>Designed for use with an action item that tags the associated item in the host like listview item.
 *           <p>Is applied to the element that represents the flag action item inside the offcanvas element.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-swipetoreveal-alert</td>
 *       <td>Designed for use with an action item that performs an explicit action like deleting the associated listview item.
 *           <p>Is applied to the element that represents the alert action item inside the offcanvas element.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-swipetoreveal-default</td>
 *       <td>Designed for use with an action item that should get all the space when user swipes pass the threshold distance.
 *           <p>Is applied to the element that represents the default action item inside the offcanvas element.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
 * @memberof oj.SwipeToRevealUtils
 */

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
 *       <td>Offcanvas wrapper element</td>
 *       <td><kbd>Swipe</kbd></td>
 *       <td>Reveals the offcanvas element.  Depending on the distance relative to the target is swiped, the offcanvas will either be closed (swipe distance too short), opened, or the default action is performed (swipe distance passed the specified threshold).</td>
 *     </tr>
 *     <tr>
 *       <td>Offcanvas wrapper element</td>
 *       <td><kbd>Pan</kbd></td>
 *       <td>Reveals the offcanvas element.  If a default action is specified, the default action will get the entire space of the offcanvas after the user panned past a specified distance threshold.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.SwipeToRevealUtils
 */

  ;return oj.SwipeToRevealUtils;
});