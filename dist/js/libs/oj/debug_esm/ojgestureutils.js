/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import $ from 'jquery';
import { PRESS_HOLD_THRESHOLD, isTouchSupported } from 'ojs/ojdomutils';

/* jslint browser: true*/

/**
 * Gesture utilities provided internally for JET components, currently only context menu gesture are available.
 * Moved from ojcomponentcore and made into static methods.
 * @ignore
 */
const GestureUtils = {};

/**
 * Event namespace used by context menu internal event registration.
 * Previously we got the namespace from the widget.
 */
GestureUtils._EVENT_NAMESPACE = '.contextMenu';

/**
 * Utility method to tear down any artifacts created by GestureUtils.startDetectContextMenuGesture
 * @param {Element} rootNode the root element of the component
 */
GestureUtils.stopDetectContextMenuGesture = function (rootNode) {
  if (rootNode._clickListener) {
    $(rootNode)
      .off(GestureUtils._EVENT_NAMESPACE)
      .removeClass('oj-menu-context-menu-launcher')[0]
      .removeEventListener('click', rootNode._clickListener, true);

    // the other 2 contextMenu timeouts don't need to be cleared here
    clearTimeout(rootNode._contextMenuPressHoldTimer);

    // eslint-disable-next-line no-param-reassign
    delete rootNode._clickListener;
    // eslint-disable-next-line no-param-reassign
    delete rootNode._contextMenuPressHoldTimer;
  }
  if (rootNode._touchStartAndMouseDownListener) {
    rootNode.removeEventListener('touchstart', rootNode._touchStartAndMouseDownListener, {
      passive: false
    });
    // eslint-disable-next-line no-param-reassign
    delete rootNode._touchStartAndMouseDownListener;
  }
  if (rootNode._touchMoveListener) {
    rootNode.removeEventListener('touchmove', rootNode._touchMoveListener, { passive: true });
    // eslint-disable-next-line no-param-reassign
    delete rootNode._touchMoveListener;
  }
};

/**
 * Utility method to setup context menu gesture detection on a component
 * @param {Element} rootNode the root node of the component
 * @param {function(Event, string)} callback callback to invoke on the component when context menu gesture is detected
 */
GestureUtils.startDetectContextMenuGesture = function (rootNode, callback) {
  // Note: Whether or not we use Hammer to detect press-hold, this code would need to do the following things seen below:
  //
  // (1) Prevent the compatibility mousedown event from triggering Menu's clickAway logic.
  // (2) Prevent press-hold from also generating a click (unless Hammer does this automatically; I'm guessing it doesn't).
  // (3) Ensure we don't respond to *both* press-hold and contextmenu events on Android.
  //
  // So the only thing that Hammer would replace is:
  //
  // (4) Detecting the press-hold.
  //
  // Not currently using Hammer for (4), since:
  //
  // - This code predates Hammer, and was already stable after extensive iteration / fine-tuning.
  // - We use the same listeners for parts of 1-4. If moved 4 off to Hammer (separate listener), just need to ensure that
  //   we don't introduce any race conditions, etc.  (May be easy or hard, just need to look.)
  // - Hammer only wants to have one instance per DOM node, else they fight to control some things like touch-action. So
  //   a prereq for having this baseComponent logic put Hammer on components is to work out a protocol for super- and sub-
  //   classes to share the same instance and not step on each other.  Not insurmountable; just need to have the conversation.
  //   Tracked by ER 21357133, which links to detailed wiki.

  var pressHoldThreshold = PRESS_HOLD_THRESHOLD; // launch CM at 750ms per UX spec
  var isPressHold = false; // to prevent pressHold from generating a click
  var contextMenuPressHoldTimer;

  var touchInProgress = false;

  // 5px is Hammer default.  (Didn't check whether they apply that separately to x and y like us, or to the hypotenuse,
  // but it's within a couple px either way -- think 3-4-5 triangle.)
  var maxAllowedMovement = 5;
  var touchPageX;
  var touchPageY;

  var doubleOpenTimer; // to prevent double open.  see usage below.
  var doubleOpenThreshold = 300; // made up this number.  TBD: Tweak as needed to make all platforms happy.
  var doubleOpenType = null; // "touchstart" or "contextmenu"

  var namespace = GestureUtils._EVENT_NAMESPACE;

  var contextMenuPressHoldJustEnded = false;

  function launch(event, eventType, pressHold) {
    // ensure that pressHold doesn't result in a click.  Set this before the bailouts below.
    isPressHold = pressHold;

    // In Mobile Safari only, mousedown fires *after* the touchend, which causes at least 2 problems:
    // 1) CM launches after 750ms (good), then disappears when lift finger (bad), because touchend -->
    // mousedown, which calls Menu's "clikAway" mousedown listener, which dismisses Menu.
    // 2) The isPressHold logic needs to reset the isPressHold ivar on any event that can start a click,
    // including mousedown.  This problem causes the mousedown listener to incorrectly clear the ivar
    // after a pressHold, which broke the whole mechanism.
    // SOLUTION FOR 1-2:  On each launch (at 750ms), set a one-time touchend listener that will set a
    // var and clear it 50ms later.  While the var is set, both mousedown listeners can disregard the
    // mousedown.  Make the var a static var in Menu, since Menu's listener is static, and since this
    // launcher component can get/set it via an (effectively static) menu method.
    // NON-SOLUTIONS:  Cancelling touchstart or touchend, via pD() and sP(), doesn't cancel iPad's mousedown.
    // Cancelling mousedown from here doesn't work even if capture phase, since ojMenu's listener is capture phase.
    // TIMING: The following block should be before the doubleOpen bailout.
    if (isPressHold) {
      $(rootNode).one('touchend' + namespace, function () {
        var touchendMousedownThreshold = 50; // 50ms.  Make as small as possible to prevent unwanted side effects.
        contextMenuPressHoldJustEnded = true;
        setTimeout(function () {
          contextMenuPressHoldJustEnded = false;
        }, touchendMousedownThreshold);
      });
    }

    // On platforms like Android Chrome where long presses already fire the contextmenu event, the pressHold
    // logic causes the menu to open twice, once for the pressHold, once for the contextmenu.  There's no
    // guarantee which will happen first, but as long as they happen within doubleOpenThreshold ms
    // of each other, this logic should prevent the double open.
    // Note: Another option is a platform-specific solution where we only use pressHold for platforms that need
    // it (that don't already fire a contextmenu event for pressHold), but architectural preference is to avoid
    // platform-specific solutions if possible.
    if (
      (doubleOpenType === 'touchstart' && event.type === 'contextmenu') ||
      (doubleOpenType === 'contextmenu' && event.type === 'touchstart') ||
      (doubleOpenType === 'keydown' && event.type === 'contextmenu')
    ) {
      // FF 60.2.2esr (32-bit) Win fires a rogue contextmenu event following the prevented keydown. What's odd is
      // preventing the keydown for shift+F10 prevents keypress but still files the contextmenu event.
      // Seems like "fallout" (behavior not yet correct) from bug https://bugzilla.mozilla.org/show_bug.cgi?id=1382199
      // For this case, prevent the native context menu within double open timeout window
      if (doubleOpenType === 'keydown' && event.type === 'contextmenu') event.preventDefault();
      doubleOpenType = null;
      clearTimeout(doubleOpenTimer);
      return;
    }

    // If a nested element or component already showed a JET context menu for this event, don't replace it with ours.
    // Hack: must check defaultPrevented on the nested event too, because for touchstart events on iOS7 at least, when
    // the outer component reaches this point, event is a different JQ wrapper event than the one on which the inner
    // component previously called preventDefault, although they both wrap the same native originalEvent.  The new wrapper
    // never had its isDefaultPrevented field set to the returnTrue method, so must check the nested originalEvent.
    // This never seems to happen with right-click and Shift-F10 events.  Has nothing to do with the setTimeout: the events
    // received by the rootNode.on("touchstart"...) code are different (firstWrapper==secondWrapper returns false).
    // TODO: link to JQ bug once filed.
    if (
      (event.isDefaultPrevented && event.isDefaultPrevented()) ||
      (event.originalEvent && event.originalEvent.defaultPrevented) ||
      event.defaultPrevented
    ) {
      return;
    }

    // for downstream modules still dependent on originalEvent that used
    // to be added by JQuery
    if (event.type === 'touchstart' || event.type === 'touchmove') {
      // eslint-disable-next-line no-param-reassign
      event.originalEvent = event;
    }

    callback(event, eventType);

    // if _NotifyContextMenuGesture() (or subclass override of it) actually opened the CM, and if that launch wasn't
    // cancelled by a beforeOpen listener...
    if ((event.isDefaultPrevented && event.isDefaultPrevented()) || event.defaultPrevented) {
      // see double-open comments above
      if (event.type === 'touchstart' || event.type === 'contextmenu' || event.type === 'keydown') {
        doubleOpenType = event.type;
        doubleOpenTimer = setTimeout(function () {
          doubleOpenType = null;
        }, doubleOpenThreshold);
      }
    }
  }

  // At least some of the time, the pressHold gesture also fires a click event same as a short tap.  Prevent that here.
  var _clickListener = function (event) {
    if (isPressHold) {
      // For Mobile Safari capture phase at least, returning false doesn't work; must use pD() and sP() explicitly.
      event.preventDefault();
      event.stopPropagation();
      isPressHold = false;
    }
  };

  // eslint-disable-next-line no-param-reassign
  rootNode._clickListener = _clickListener;

  // Use capture phase to make sure we cancel it before any regular bubble listeners hear it.
  rootNode.addEventListener('click', _clickListener, true);

  var _touchStartAndMouseDownListener = function (event) {
    // for mousedown-after-touchend Mobile Safari issue explained above where __contextMenuPressHoldJustEnded is set.
    if (event.type === 'mousedown' && contextMenuPressHoldJustEnded) {
      return undefined;
    }

    // reset isPressHold flag for all events that can start a click.
    isPressHold = false;

    // start a pressHold timer on touchstart.  If not cancelled before 750ms by touchend/etc., will launch the CM.
    // isolate the context menu long tap to a single touch point.
    if (event.type === 'touchstart' && event.touches.length === 1) {
      // note starting position so touchmove handler can tell if touch moved too much
      var firstTouch = event.touches[0];
      touchPageX = firstTouch.pageX;
      touchPageY = firstTouch.pageY;

      touchInProgress = true;
      // prettier-ignore
      contextMenuPressHoldTimer = setTimeout( // @HTMLUpdateOK
        launch.bind(undefined, event, 'touch', true),
        pressHoldThreshold
      );
      // eslint-disable-next-line no-param-reassign
      rootNode._contextMenuPressHoldTimer = contextMenuPressHoldTimer;
    }

    return true;
  };

  // eslint-disable-next-line no-param-reassign
  rootNode._touchStartAndMouseDownListener = _touchStartAndMouseDownListener;

  rootNode.addEventListener('touchstart', _touchStartAndMouseDownListener, { passive: false });

  var _touchMoveListener = function (event) {
    var firstTouch = event.touches[0];
    if (
      Math.abs(touchPageX - firstTouch.pageX) > maxAllowedMovement ||
      Math.abs(touchPageY - firstTouch.pageY) > maxAllowedMovement
    ) {
      touchInProgress = false;
      clearTimeout(contextMenuPressHoldTimer);
    }
    return true;
  };

  // eslint-disable-next-line no-param-reassign
  rootNode._touchMoveListener = _touchMoveListener;

  rootNode.addEventListener('touchmove', _touchMoveListener, { passive: true });

  $(rootNode)
    .on('mousedown' + namespace, _touchStartAndMouseDownListener)
    // if the touch moves too much, it's not a pressHold
    // if the touch ends before the 750ms is up, it's not a long enough pressHold to show the CM
    .on('touchend' + namespace + ' touchcancel' + namespace, function () {
      touchInProgress = false;
      clearTimeout(contextMenuPressHoldTimer);
      return true;
    })
    .on('keydown' + namespace + ' contextmenu' + namespace, function (event) {
      if (
        event.type === 'contextmenu' || // right-click.  pressHold for Android but not iOS
        (event.keyCode === 121 && event.shiftKey)
      ) {
        // Shift-F10
        var eventType;
        if (touchInProgress) {
          eventType = 'touch';
        } else if (event.type === 'keydown') {
          eventType = 'keyboard';
        } else {
          eventType = 'mouse';
        }

        launch(event, eventType, false);
      }

      return true;
    });

  // Does 2 things:
  // 1) Prevents native context menu / callout from appearing in Mobile Safari.  E.g. for links, native CM has "Open in New Tab".
  // 2) In Mobile Safari and Android Chrome, prevents pressHold from selecting the text and showing the selection handles and (in Safari) the Copy/Define callout.
  // In UX discussion, we decided to prevent both of these things for all JET components for now.  If problems, can always, say, add protected method allowing
  // subclass to opt out (e.g. if they need 1 and/or 2 to work).
  // Per discussion with architects, do #2 only for touch devices, so that text selection isn't prevented on desktop.  Since #1
  // is a no-op for non-touch, we can accomplish this by omitting the entire style class, which does 1 and 2, for non-touch.
  // Per comments in scss file, the suppression of 1 and 2 has issues in old versions of Mobile Safari.
  if (isTouchSupported()) {
    $(rootNode).addClass('oj-menu-context-menu-launcher');
  }
};

const startDetectContextMenuGesture = GestureUtils.startDetectContextMenuGesture;
const stopDetectContextMenuGesture = GestureUtils.stopDetectContextMenuGesture;

export { startDetectContextMenuGesture, stopDetectContextMenuGesture };
