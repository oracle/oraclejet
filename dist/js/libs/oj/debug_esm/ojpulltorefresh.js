/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import $ from 'jquery';
import Context from 'ojs/ojcontext';
import { isTouchSupported } from 'ojs/ojdomutils';
import { getTranslatedString } from 'ojs/ojtranslation';
import { Pan, DIRECTION_VERTICAL } from 'hammerjs';
import { parseJSONFromFontFamily } from 'ojs/ojthemeutils';
import 'ojs/ojjquery-hammer';
import 'ojs/ojcomponentcore';
import 'touchr';
import 'ojs/ojprogress-circle';

/**
 * @namespace PullToRefreshUtils
 * @since 1.2.0
 * @export
 * @hideconstructor
 *
 * @ojtsmodule
 *
 * @ojdeprecated {since: '7.0.0', description: 'Use ojRefresher instead.'}
 * @classdesc
 * This class provides functions for adding pull to refresh functionality to any container element which hosts refreshable content.
 * By default this class will generate a default panel, which consists of a refresh icon, a primary text, and a secondary text.  The application
 * can use the callback to provide their own panel.  When the release happens, the refresh function will be invoked and application should
 * use this to execute any logic required to refresh the content inside the panel.  For example, fetching new content for the ListView inside
 * the container.  The application must resolve or reject the Promise so that this class can do the necessary cleanup.
 *
 * <p>Warning: The pull to refresh gesture will not work with drag and drop enabled components. Drag and drop must be disabled in the component if
 * use of pull to refresh is needed.
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
 */
const PullToRefreshUtils = {};
// mapping variable definition, used in a no-require environment. Maps the PullToRefreshUtils object to the name used in the require callback.
// eslint-disable-next-line no-unused-vars
oj._registerLegacyNamespaceProp('PullToRefreshUtils', PullToRefreshUtils);
/**
 * Setup content container for pull to refresh capability.  This method adds touch listeners on the content container.  The following events are fired by this method:
 * ojpull is fired when user pulls the content container, the event contains the content element as well as the distance pulled in pixels.
 * ojrelease is fired when user releases the content container, the event contains the content element.
 * ojcomplete is fired when the refresh is done and the panel is completely closed.  The event contains the content element.
 *
 * @export
 * @param {Element} element the DOM element that hosts the content to refresh.  When the content is scrollable, the value of this parameter must be the scrollable element.
 *                  Specifically, when using this with ListView, the ListView element might not necessarily be the scrollable element, but is one of its ancestors instead.
 * @param {function():Promise.<any>} refreshFunc the function to invoke when refresh is triggered.  It must return a Promise.
 * @param {Object=} options optional values that controls aspects of pull to refresh
 * @param {number=} options.threshold the number of pixels to pull until refresh is triggered.  If not specified, a default value will be calculated based on the height of the panel consisting the refresh icon, primary text, and secondary text.
 * @param {string=} options.primaryText the primary text to display.  The primary text is usually used to describe the pull action.  If not specified then no primary text will be displayed.
 * @param {string=} options.secondaryText the secondary text to display.  The secondary text is used to add supplementary text.  If not specified then no secondary text will be displayed.
 * @param {Element=} options.refresherElement the refresher component that the PullToRefreshUtils are hooked into. If specified, the busyState will be attached to the refresher element. Otherwise, will use the scroller elmeent instead.
 * @return {void}
 *
 * @see #tearDownPullToRefresh
 */
PullToRefreshUtils.setupPullToRefresh = function (element, refreshFunc, options) {
  var outer;
  var content;
  var panel;
  var checkTolerance;
  var threshold;
  var start;
  var height;
  var movex;
  var icon;
  var iconOffset;
  var lastIconClass;
  var title;
  var heightRatio;
  var ratio;
  var iconClass;
  var mOptions;
  var isTouch;
  var type;
  var loadingIcon = (parseJSONFromFontFamily('oj-refresher-option-defaults') || {})
    .loadingIcon;

  // bind the refresherElement to the scrollerElement for busyState if it exists
  if (options && options.refresherElement) {
    $.data($(element)[0], 'data-pulltorefresh-refresher', options.refresherElement);
  }

  isTouch = isTouchSupported();

  // make sure we are clean
  PullToRefreshUtils.tearDownPullToRefresh(element);

  outer = $(document.createElement('div')).addClass('oj-pulltorefresh-outer');
  PullToRefreshUtils._renderAccessibleLink(element, outer, refreshFunc, options);

  // create the element containing the content
  content = $(document.createElement('div')).addClass('oj-pulltorefresh-panel');
  outer.append(content); // @HTMLUpdateOK

  // prepend it to the panel
  panel = $(element);
  panel.prepend(outer); // @HTMLUpdateOK outer is created by the component

  if (isTouch) {
    type = 'touch';
  } else {
    type = 'pan';
    mOptions = {
      recognizers: [[Pan, { direction: DIRECTION_VERTICAL }]]
    };
    panel.ojHammer(mOptions);
  }

  panel
    .on(type + 'start.pulltorefresh', function (event) {
      // checks if we are still refreshing
      if ($.data(content[0], 'data-pullstart') != null) {
        return;
      }

      // make sure we are at the top
      if (panel[0].scrollTop === 0) {
        PullToRefreshUtils._handlePull(event, content, options);

        // extract these info up front instead of in move
        icon = content.find('.oj-pulltorefresh-icon');
        if (icon.length > 0) {
          // initialize the progress circle with 0 value
          if (loadingIcon === 'progresscircle') {
            icon[0].setAttribute('value', '0');
          }
          iconOffset = icon.parent().outerHeight(true);
        }

        if (options && !isNaN(options.threshold)) {
          threshold = parseInt(options.threshold, 10);
        }

        if (isNaN(threshold)) {
          threshold = content.outerHeight(true);
        } else {
          threshold = Math.max(0, Math.min(threshold, content.outerHeight(true)));
        }

        // hide it
        content.css('height', 0);
        content.removeClass('oj-pulltorefresh-transition');
        if (isTouch) {
          $.data(content[0], 'data-pullstart', event.originalEvent.touches[0].clientY);
          $.data(content[0], 'data-pullstart-horiz', event.originalEvent.touches[0].clientX);
        } else {
          $.data(content[0], 'data-pullstart', 0);
        }

        checkTolerance = true;
      }
    })
    .on(type + 'move.pulltorefresh', function (event) {
      // first checks whether if the pull had started
      start = $.data(content[0], 'data-pullstart');
      if (start == null) {
        return;
      }

      // see how far it's been pull
      height = isTouch
        ? event.originalEvent.touches[0].clientY - parseInt(start, 10)
        : event.gesture.deltaY;

      // wrong direction
      if (height < 0) {
        // remove pull-to-refresh-action class to block children events in the panel element
        panel[0].classList.remove('oj-pulltorefresh-action');

        return;
      }

      // make sure the page doesn't scrolls
      event.preventDefault();

      // checks if we are in the middle of closing the panel
      if ($.data(content[0], 'data-closing') != null) {
        return;
      }

      // checks if we are still in the loading stage
      if ($.data(content[0], 'data-loading') != null) {
        content.css('height', Math.max(height, threshold));
        return;
      }

      if (checkTolerance) {
        movex = isTouch
          ? event.originalEvent.touches[0].clientX -
            parseInt($.data(content[0], 'data-pullstart-horiz'), 10)
          : event.gesture.deltaX;

        // check if the intention is swipe left, if it is don't show the panel yet
        if (Math.abs(movex) > height) {
          return;
        }

        // we only want to check this as long as the panel is not visible yet
        checkTolerance = false;
      }

      content.css('height', height);

      // apply pull-to-refresh-action class to block children events in the panel element
      panel[0].classList.add('oj-pulltorefresh-action');

      // fire pull event
      PullToRefreshUtils._fireEvent(event, 'pull', content, height);

      if (icon != null && icon.length > 0) {
        // Set the title and progress circle value
        // title uses multiples of 10 as ratio values.
        if (threshold > 0) {
          heightRatio = height / threshold;
        } else {
          heightRatio = 100;
        }
        if (isNaN(heightRatio) || heightRatio < 0) {
          heightRatio = 0;
        }
        ratio = Math.round(heightRatio * 10) * 10;
        if (ratio >= 100) {
          iconClass = 'oj-pulltorefresh-icon-full';
          title = getTranslatedString('oj-pullToRefresh.titleIconFull');
        } else {
          iconClass = 'oj-pulltorefresh-icon-' + ratio + '-percent';
          title = getTranslatedString(
            'oj-pullToRefresh.titleIcon' + ratio + 'percent'
          );
        }

        if (loadingIcon === 'progresscircle') {
          // recalculate ratio for progress circle
          ratio = Math.min(Math.round(heightRatio * 100), 100);
          icon[0].setAttribute('value', ratio);
        } else {
          // remove last class
          lastIconClass = $.data(content[0], 'data-lasticonclass');
          if (lastIconClass != null) {
            icon.removeClass(lastIconClass);
          }

          icon.addClass(iconClass);
        }

        $.data(content[0], 'data-lasticonclass', iconClass);
        icon.attr('title', title);

        // check whether to show/hide primary/secondary text
        PullToRefreshUtils._showHideDefaultText(content, height > iconOffset);
      }
    })
    .on(type + 'cancel.pulltorefresh', function () {
      PullToRefreshUtils._cleanup(content);
      // remove pull-to-refresh-action class to block children events in the panel element
      panel[0].classList.remove('oj-pulltorefresh-action');
    })
    .on(type + 'end.pulltorefresh', function (event) {
      // first checks whether if the pull had started
      start = $.data(content[0], 'data-pullstart');
      if (start == null) {
        return;
      }

      // checks if we are in the middle of closing the panel
      if ($.data(content[0], 'data-closing') != null) {
        return;
      }

      // checks if we are still in the loading stage
      if ($.data(content[0], 'data-loading') != null) {
        height = $.data(content[0], 'data-panelheight');
        content.css('height', height);
        return;
      }

      // less than threshold, hide panel and do nothing
      if (content.outerHeight() < threshold) {
        content.addClass('oj-pulltorefresh-transition').css('height', 0);

        PullToRefreshUtils._cleanup(content);
      } else {
        PullToRefreshUtils._handleRelease(event, element, content, refreshFunc);
      }

      // remove pull-to-refresh-action class to block children events in the panel element
      panel[0].classList.remove('oj-pulltorefresh-action');
    });
};

PullToRefreshUtils._handlePull = function (event, content, options) {
  var primaryText;
  var secondaryText;

  PullToRefreshUtils._fireEvent(event, 'pull', content, 0);

  if (content.children().length === 0) {
    if (options) {
      primaryText = options.primaryText;
      secondaryText = options.secondaryText;
    }

    PullToRefreshUtils._createDefaultContent(content, primaryText, secondaryText);
  }

  content
    .prev()
    .text(PullToRefreshUtils._getTranslatedString('oj-pullToRefresh.ariaRefreshingLink'));

  // set it back to auto so we can get the actual height
  content.css('height', 'auto');
  $.data(content[0], 'data-panelheight', content.outerHeight());
};

PullToRefreshUtils._handleRelease = function (event, element, content, refreshFunc) {
  var height;
  var icon;
  var lastIconClass;
  var busyContext;
  var busyStateResolve;
  var listener;
  var loadingIcon = (parseJSONFromFontFamily('oj-refresher-option-defaults') || {})
    .loadingIcon;

  height = $.data(content[0], 'data-panelheight');
  content.addClass('oj-pulltorefresh-transition').css('height', height);

  PullToRefreshUtils._fireEvent(event, 'release', content, height);

  // mark that we are in loading stage
  $.data(content[0], 'data-loading', true);

  icon = content.find('.oj-pulltorefresh-icon');
  if (icon.length > 0) {
    if (loadingIcon === 'progresscircle') {
      // change back to indeterminate state for loading
      icon[0].setAttribute('value', '-1');
    } else {
      // remove last class
      lastIconClass = $.data(content[0], 'data-lasticonclass');
      if (lastIconClass != null) {
        icon.removeClass(lastIconClass);
      }
      icon.addClass('oj-pulltorefresh-icon-full');
    }
  }

  // register busy state with host as the context, note you can't pull again until release is done
  // if refresher element exists, bind busystate to the refresher element.
  // check if the refresher element is set on the scroller element
  var busyElement = $.data($(element)[0], 'data-pulltorefresh-refresher')
    ? $.data($(element)[0], 'data-pulltorefresh-refresher')
    : element;
  busyContext = Context.getContext(busyElement).getBusyContext();
  busyStateResolve = busyContext.addBusyState({ description: 'PullToRefresh:handleRelease' });
  $.data($(busyElement)[0], 'data-pulltorefresh-busystate', busyStateResolve);

  refreshFunc().then(
    function () {
      listener = function () {
        PullToRefreshUtils._fireEvent(event, 'complete', content, height);

        // cleanup after everything is complete
        PullToRefreshUtils._cleanup(content);

        content.off('transitionend', listener);

        // clear the text, otherwise voice over will allow text to be focusable
        content.prev().text('');

        // clear busy state
        PullToRefreshUtils._resolveBusyState(element);
      };

      // change text to complete
      content
        .prev()
        .text(PullToRefreshUtils._getTranslatedString('oj-pullToRefresh.ariaRefreshCompleteLink'));
      // hide the link
      content.prev().prev().css('position', '');

      // mark that we are in the middle of closing the panel, we want this to complete without interruption
      $.data(content[0], 'data-closing', true);

      content.on('transitionend', listener);
      content.css('height', 0);
    },
    function () {
      listener = function () {
        // cleanup after everything is complete
        PullToRefreshUtils._cleanup(content);

        content.off('transitionend', listener);

        // clear the text, otherwise voice over will allow text to be focusable
        content.prev().text('');

        // clear busy state
        PullToRefreshUtils._resolveBusyState(element);
      };

      // hide the link
      content.prev().prev().css('position', '');

      // mark that we are in the middle of closing the panel, we want this to complete without interruption
      $.data(content[0], 'data-closing', true);

      content.on('transitionend', listener);
      content.css('height', 0);
    }
  );
};

/**
 * Removes the listener that was added in setupPullToRefresh.  Page authors should call tearDownPullToRefresh when the content container is no longer needed.
 *
 * @export
 * @param {Element} element the DOM element that hosts the content to refresh
 * @return {void}
 *
 * @see #setupPullToRefresh
 */
PullToRefreshUtils.tearDownPullToRefresh = function (element) {
  // remove the content panel
  $(element).children('.oj-pulltorefresh-outer').remove();

  // remove all listeners
  $(element).off('.pulltorefresh');

  // remove pointer-events: none class to prevent element from locking out pointer events
  element.classList.remove('oj-pulltorefresh-action');

  // free up busy state if it's not done already
  PullToRefreshUtils._resolveBusyState(element);
};

/**
 * Helper method to resolve busy state
 * @param {Element} element the DOM element that hosts the content to refresh
 * @private
 */
PullToRefreshUtils._resolveBusyState = function (element) {
  var elem;
  var busyStateResolve;

  // check if the refresher element is set on the scroller element
  var busyElement = $.data(element, 'data-pulltorefresh-refresher')
    ? $.data(element, 'data-pulltorefresh-refresher')
    : element;

  elem = $(busyElement)[0];

  busyStateResolve = /** @type {Function} */ ($.data(elem, 'data-pulltorefresh-busystate'));
  if (busyStateResolve) {
    busyStateResolve(null);
    $.removeData(elem, 'data-pulltorefresh-busystate');
  }
};

/**
 * Helper method to fire specific event
 * @private
 */
PullToRefreshUtils._fireEvent = function (originalEvent, key, content, distance) {
  var event = $.Event('oj' + key);
  event.originalEvent = originalEvent;

  content.trigger(event, { content: content, distance: distance });
};

/**
 * Creates default content inside refresh panel if one is not provided by the app through callbacks
 * @private
 */
PullToRefreshUtils._createDefaultContent = function (content, primaryText, secondaryText) {
  var icon;
  var iconContainer;
  var primary;
  var secondary;
  var loadingIcon = (parseJSONFromFontFamily('oj-refresher-option-defaults') || {})
    .loadingIcon;

  content.addClass('oj-pulltorefresh-content').attr('aria-hidden', 'true');

  if (loadingIcon === 'progresscircle') {
    // for redwood, use
    icon = document.createElement('oj-progress-circle');
    icon.classList.add('oj-pulltorefresh-icon');
    icon.setAttribute('value', '0');
    icon.setAttribute('size', 'sm');
    icon.setAttribute('data-oj-binding-provider', 'none');
  } else {
    icon = $(document.createElement('div'));
    icon.addClass('oj-icon oj-pulltorefresh-icon oj-pulltorefresh-icon-initial');
  }
  iconContainer = $(document.createElement('div'));
  iconContainer.addClass('oj-pulltorefresh-icon-container');

  iconContainer.append(icon); // @HTMLUpdateOK
  $.data(content[0], 'data-lasticonclass', 'oj-pulltorefresh-icon-initial');
  content.append(iconContainer); // @HTMLUpdateOK

  if (primaryText != null) {
    primary = $(document.createElement('div'))
      .addClass('oj-pulltorefresh-primary-text')
      .text(primaryText);
    content.append(primary); // @HTMLUpdateOK

    // you can't have secondary text without primary text
    if (secondaryText != null) {
      secondary = $(document.createElement('div'))
        .addClass('oj-pulltorefresh-secondary-text')
        .text(secondaryText);
      content.append(secondary); // @HTMLUpdateOK
    }
  }
};

/**
 * Show/hide primary/secondary text.  We don't want to show the text until the refresh icon
 * is fully visible otherwise they will overlap.
 * @private
 */
PullToRefreshUtils._showHideDefaultText = function (content, show) {
  var primaryText;
  var secondaryText;

  primaryText = content.find('.oj-pulltorefresh-primary-text');
  secondaryText = content.find('.oj-pulltorefresh-secondary-text');

  if (show) {
    if (primaryText) {
      primaryText.show();
    }
    if (secondaryText) {
      secondaryText.show();
    }
  } else {
    if (primaryText) {
      primaryText.hide();
    }
    if (secondaryText) {
      secondaryText.hide();
    }
  }
};

/**
 * Renders link to provide accessible way to refresh content
 * @private
 */
PullToRefreshUtils._renderAccessibleLink = function (element, panel, refreshFunc, options) {
  var link;
  var content;
  var status;

  link = $(document.createElement('a'));
  link.text(PullToRefreshUtils._getTranslatedString('oj-pullToRefresh.ariaRefreshLink'));
  link
    .addClass('oj-helper-hidden-accessible')
    .attr('href', '#')
    .focus(function () {
      // the link should be visible when tab to
      // note if removeClass("oj-helper-hidden-accessible") is used here then it would cause
      // weird behavior in Voiceover where the link will be skip immediately after focus
      link.css('position', 'static');
    })
    .blur(function (event) {
      // Voiceover focus would immediately cause a blur when making the link visible
      if (event.relatedTarget != null) {
        link.css('position', '');
      }
    })
    .click(function (event) {
      content = panel.children().last();
      PullToRefreshUtils._handlePull(event, content, options);
      PullToRefreshUtils._handleRelease(event, element, content, refreshFunc);
    });

  status = $(document.createElement('div'));
  status.addClass('oj-helper-hidden-accessible').attr('aria-live', 'polite');

  panel.append(link); // @HTMLUpdateOK
  panel.append(status); // @HTMLUpdateOK
};

/**
 * Get translated string given string.
 * This will select pullToRefresh translations, then Refresher translations if needed
 * @private
 */
PullToRefreshUtils._getTranslatedString = function (str) {
  var translatedString = getTranslatedString(str);

  // if translatedString is the same, pullToRefresh translations don't exist
  if (translatedString === str) {
    var strArray = str.split('.');
    var refresherString = 'oj-ojRefresher.' + strArray[1];
    translatedString = getTranslatedString(refresherString);
  }
  return translatedString;
};

/**
 * Cleanup internals
 * @private
 */
PullToRefreshUtils._cleanup = function (content) {
  var icon;

  $.removeData(content[0], 'data-pullstart');
  $.removeData(content[0], 'data-pullstart-horiz');
  $.removeData(content[0], 'data-loading');
  $.removeData(content[0], 'data-closing');

  // only clear if it's the default panel, give app full control on custom content
  icon = content.find('.oj-pulltorefresh-icon');
  if (icon.length > 0) {
    content.empty();
  }
};

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
 *       <td>Pull to refresh panel element</td>
 *       <td><kbd>Pan</kbd></td>
 *       <td>Shows the pull to refresh panel as user pan downward.  Refresh action is triggered if the user pan downward over a specified threshold.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof PullToRefreshUtils
 */

/**
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
 *       <td>Pull to refresh panel element</td>
 *       <td><kbd>Tab</kbd></td>
 *       <td>Shift focus to refresh action link.</td>
 *     </tr>
 *     <tr>
 *       <td>Link</td>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Invoke refresh action.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof PullToRefreshUtils
 */

const setupPullToRefresh = PullToRefreshUtils.setupPullToRefresh;
const tearDownPullToRefresh = PullToRefreshUtils.tearDownPullToRefresh;

export { setupPullToRefresh, tearDownPullToRefresh };
