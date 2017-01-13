/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'promise', 'ojs/ojcomponentcore'],
       /*
        * @param {Object} oj 
        * @param {jQuery} $
        */
       function(oj, $)
 
{

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @class Utility methods for setting up pull to refresh on content inside a container.
 * @since 1.2.0
 * @export
 *
 * @classdesc
 * This class provides functions for adding pull to refresh functionality to any container element which hosts refreshable content.
 * By default this class will generate default panel, which consists of the refresh icon, primary, and secondary text.  The application
 * can use the callback to provide their own panel.  When the release happens, the refresh function will be invoked and application should
 * use this to execute any logic required to refresh the content inside the panel.  For example, fetching new cotent for the ListView inside
 * the container.  The application must resolve or reject the Promise so that this class can do the neccessary cleanup.
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
oj.PullToRefreshUtils = {};

/**
 * Setup content container for pull to refresh capability.  This method adds touch listeners on the content container.  The following events are fired by this method:
 * ojpull is fired when user pulls the content container, the event contains the content element as well as the distance pulled in pixels.
 * ojrelease is fired when user releases the content container, the event contains the content element.
 * ojcomplete is fired when the refresh is done and the panel is completely closed.  The event contains the content element.
 *
 * @export
 * @param {Element} element the DOM element that hosts the content to refresh.  When the content is scrollable, the value of this parameter must be the scrollable element.  
 *                  Specifically, when using this with ListView, the ListView element might not necessarily be the scrollable element, but is one of its ancestors instead.
 * @param {function()} refreshFunc the function to invoke when refresh is triggered.  It must return a Promise.
 * @param {Object=} options optional values that controls aspects of pull to refresh
 * @param {number} options.threshold the number of pixel to pull until refresh is triggered
 * @param {string} options.primaryText the primary text to display
 * @param {string} options.secondaryText the secondary text to display
 *
 * @see #tearDownPullToRefresh
 */
oj.PullToRefreshUtils.setupPullToRefresh = function(element, refreshFunc, options)
{
    var outer, content, panel, checkTolerance, threshold, start, height, movex, icon, iconOffset, lastIconClass, title, ratio, iconClass;

    // make sure we are clean
    oj.PullToRefreshUtils.tearDownPullToRefresh(element);

    outer = $(document.createElement("div")).addClass("oj-pulltorefresh-outer");
    oj.PullToRefreshUtils._renderAccessibleLink(outer, refreshFunc, options);

    // create the element containing the content
    content = $(document.createElement("div")).addClass("oj-pulltorefresh-panel");    
    outer.append(content); // @HtmlUpdateOK

    // prepend it to the panel
    panel = $(element);
    panel.prepend(outer);

    panel
    .on("touchstart.pulltorefresh", function(event) 
    {
        // checks if we are still refreshing
        if ($.data(content[0], "data-pullstart") != null)
        {
             return;
        }

        // make sure we are at the top
        if (panel[0].scrollTop === 0)
        {
            oj.PullToRefreshUtils._handlePull(event, content, options);

            // extract these info up front instead of in move
            icon = content.find(".oj-pulltorefresh-icon");
            if (icon.length > 0)
            {
                iconOffset = icon.parent().outerHeight(true);
            }

            if (options && !isNaN(options['threshold']))
            {
                threshold = parseInt(options['threshold'], 10);
            }

            if (isNaN(threshold))
            {
                threshold = content.outerHeight(true);
            }
            else
            {
                threshold = Math.max(0, Math.min(threshold, content.outerHeight(true)));
            }

            // hide it
            content.css("height", 0);
            content.removeClass("oj-pulltorefresh-transition");
            $.data(content[0], "data-pullstart", event.originalEvent.touches[0].clientY);
            $.data(content[0], "data-pullstart-horiz", event.originalEvent.touches[0].clientX);

            checkTolerance = true;
        }
    })
    .on("touchmove.pulltorefresh", function(event) 
    {
        // first checks whether if the pull had started
        start = $.data(content[0], "data-pullstart");
        if (start == null)
        {
             return;
        }

        // see how far it's been pull
        height = event.originalEvent.touches[0].clientY - parseInt(start, 10);

        // wrong direction
        if (height < 0)
        {
            return;
        }

        // make sure the page doesn't scrolls
        event.preventDefault();

        // checks if we are still in the loading stage
        if ($.data(content[0], "data-loading") != null)
        {
            content.css("height", Math.max(height, threshold));
            return;
        }

        if (checkTolerance)
        {
            // we only want to check this once per pull
            checkTolerance = false;
            movex = event.originalEvent.touches[0].clientX - parseInt($.data(content[0], "data-pullstart-horiz"), 10);
            // check if the intention is swipe left, if it is don't show the panel yet
            if (Math.abs(movex) > height)
            {
                return;
            }
        }    

        content.css("height", height);

        // fire pull event
        oj.PullToRefreshUtils._fireEvent(event, "pull", content, height);

        if (icon != null && icon.length > 0)
        {
            // remove last class
            lastIconClass = $.data(content[0], "data-lasticonclass");
            if (lastIconClass != null)
            {
                icon.removeClass(lastIconClass);
            }

            // find the appropriate class
            ratio = Math.round((height / threshold) * 10) * 10;
            if (ratio >= 100)
            {
                iconClass = "oj-pulltorefresh-icon-full";
                title = oj.Translations.getTranslatedString('oj-pullToRefresh.titleIconFull');
            }
            else
            {
                iconClass = "oj-pulltorefresh-icon-" + ratio + "-percent";
                title = oj.Translations.getTranslatedString('oj-pullToRefresh.titleIcon' + ratio + 'percent');
            }
            icon.addClass(iconClass);
            icon.attr("title", title);

            $.data(content[0], "data-lasticonclass", iconClass);

            // check whether to show/hide primary/secondary text
            oj.PullToRefreshUtils._showHideDefaultText(content, height > iconOffset);            
        }
    })
    .on("touchcancel.pulltorefresh", function(event) 
    {
        oj.PullToRefreshUtils._cleanup(content);
    })
    .on("touchend.pulltorefresh", function(event) 
    {
        // first checks whether if the pull had started
        start = $.data(content[0], "data-pullstart");
        if (start == null)
        {
             return;
        }

        // checks if we are still in the loading stage
        if ($.data(content[0], "data-loading") != null)
        {
            return;
        }

        // less than threshold, hide panel and do nothing
        if (content.outerHeight() < threshold)
        {
            content.addClass("oj-pulltorefresh-transition")
                   .css("height", 0);

            oj.PullToRefreshUtils._cleanup(content);
        }
        else
        {
            oj.PullToRefreshUtils._handleRelease(event, content, refreshFunc);
        }
    });
};

oj.PullToRefreshUtils._handlePull = function(event, content, options)
{
    var primaryText, secondaryText, icon, iconOffset;

    oj.PullToRefreshUtils._fireEvent(event, "pull", content, 0);

    if (content.children().length == 0)
    {
        if (options)
        {
            primaryText = options['primaryText'];
            secondaryText = options['secondaryText'];
        }

        oj.PullToRefreshUtils._createDefaultContent(content, primaryText, secondaryText);
    }

    content.prev().text(oj.Translations.getTranslatedString('oj-pullToRefresh.ariaRefreshingLink'));

    // set it back to auto so we can get the actual height
    content.css("height", "auto");
    $.data(content[0], "data-panelheight", content.outerHeight());
};

oj.PullToRefreshUtils._handleRelease = function(event, content, refreshFunc)
{
    var height, icon, lastIconClass, listener;

    height = $.data(content[0], "data-panelheight");
    content.addClass("oj-pulltorefresh-transition")
           .css("height", height);

    oj.PullToRefreshUtils._fireEvent(event, "release", content, height);

    // mark that we are in loading stage
    $.data(content[0], "data-loading", true);

    icon = content.find(".oj-pulltorefresh-icon");
    if (icon.length > 0)
    {
        // remove last class
        lastIconClass = $.data(content[0], "data-lasticonclass");
        if (lastIconClass != null)
        {
            icon.removeClass(lastIconClass);
        }
        icon.addClass("oj-pulltorefresh-icon-full");
    }

    refreshFunc().then(function(val)
    {
        listener = function()
        {
            oj.PullToRefreshUtils._fireEvent(event, "complete", content, height);

            // cleanup after everything is complete
            oj.PullToRefreshUtils._cleanup(content);

            content.off("transitionend", listener);                  

            // clear the text, otherwise voice over will allow text to be focusable
            content.prev().text("");
        }

        // change text to complete
        content.prev().text(oj.Translations.getTranslatedString('oj-pullToRefresh.ariaRefreshCompleteLink'));
        // hide the link
        content.prev().prev().css("position", "");

        content.on("transitionend", listener);
        content.css("height", 0);
    });
};

/**
 * Removes the listener that was added in setupPullToRefresh.  Page authors should call tearDownPullToRefresh when the content container is no longer needed.
 * 
 * @export
 * @param {Element} element the DOM element that hosts the content to refresh
 *
 * @see #setupPullToRefresh
 */
oj.PullToRefreshUtils.tearDownPullToRefresh = function(element)
{
    // remove the content panel
    $(element).children(".oj-pulltorefresh-outer").remove();

    // remove all listeners
    $(element).off(".pulltorefresh");
};

/**
 * Helper method to fire specific event
 * @private
 */
oj.PullToRefreshUtils._fireEvent = function(originalEvent, key, content, distance)
{
    var event = $.Event("oj"+key);
    event['originalEvent'] = originalEvent;

    content.trigger(event, {'content': content, 'distance': distance});
};

/**
 * Creates default content inside refresh panel if one is not provided by the app through callbacks
 * @private
 */
oj.PullToRefreshUtils._createDefaultContent = function(content, primaryText, secondaryText)
{
    var icon, iconContainer, primary, secondary;

    content.addClass("oj-pulltorefresh-content")
           .attr("aria-hidden", "true");

    icon = $(document.createElement("div"));
    icon.addClass("oj-pulltorefresh-icon oj-pulltorefresh-icon-initial");
    iconContainer = $(document.createElement("div"));
    iconContainer.addClass("oj-pulltorefresh-icon-container");

    iconContainer.append(icon); // @HtmlUpdateOK
    $.data(content[0], "data-lasticonclass", "oj-pulltorefresh-icon-initial");
    content.append(iconContainer); // @HtmlUpdateOK

    if (primaryText != null)
    {
        primary = $(document.createElement("div"))
                      .addClass("oj-pulltorefresh-primary-text")
                      .text(primaryText);
        content.append(primary); // @HtmlUpdateOK

        // you can't have secondary text without primary text
        if (secondaryText != null)
        { 
            secondary = $(document.createElement("div"))
                            .addClass("oj-pulltorefresh-secondary-text")
                            .text(secondaryText);
            content.append(secondary); // @HtmlUpdateOK
        }
    }

};

/**
 * Show/hide primary/secondary text.  We don't want to show the text until the refresh icon
 * is fully visible otherwise they will overlap.
 * @private
 */
oj.PullToRefreshUtils._showHideDefaultText = function(content, show)
{
    var primaryText, secondaryText;

    primaryText = content.find(".oj-pulltorefresh-primary-text");
    secondaryText = content.find(".oj-pulltorefresh-secondary-text");

    if (show)
    {
        if (primaryText)
        {
            primaryText.show();
        }
        if (secondaryText)
        {
            secondaryText.show();
        }
    }
    else
    {
        if (primaryText)
        {
            primaryText.hide();
        }
        if (secondaryText)
        {
            secondaryText.hide();
        }
    }
};

/**
 * Renders link to provide accessible way to refresh content
 * @private
 */
oj.PullToRefreshUtils._renderAccessibleLink = function(panel, refreshFunc, options)
{
    var link, content, status;

    link = $(document.createElement("a"));
    link.text(oj.Translations.getTranslatedString('oj-pullToRefresh.ariaRefreshLink'));
    link.addClass("oj-helper-hidden-accessible")
        .attr("href", "#")
        .focus(function()
        { 
            // the link should be visible when tab to
            // note if removeClass("oj-helper-hidden-accessible") is used here then it would cause
            // weird behavior in Voiceover where the link will be skip immediately after focus
            link.css("position", "static");
        })
        .blur(function(event)
        {
            // Voiceover focus would immediately cause a blur when making the link visible
            if (event.relatedTarget != null)
            {
                link.css("position", "");
            }
        })
        .click(function(event)
        {
            content = panel.children().last();
            oj.PullToRefreshUtils._handlePull(event, content, options);
            oj.PullToRefreshUtils._handleRelease(event, content, refreshFunc);

            refreshFunc();
        });

    status = $(document.createElement("div"));
    status.addClass("oj-helper-hidden-accessible")
          .attr("aria-live", "polite");

    panel.append(link); // @HtmlUpdateOK
    panel.append(status); // @HtmlUpdateOK
};

/**
 * Cleanup internals
 * @private
 */
oj.PullToRefreshUtils._cleanup = function(content)
{
    var icon;

    $.removeData(content[0], "data-pullstart");
    $.removeData(content[0], "data-pullstart-horiz");
    $.removeData(content[0], "data-loading");

    // only clear if it's the default panel, give app full control on custom content
    icon = content.find(".oj-pulltorefresh-icon");
    if (icon.length > 0)
    {
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
 * @memberof oj.PullToRefreshUtils
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
 * @memberof oj.PullToRefreshUtils
 */
});
