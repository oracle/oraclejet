/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'hammerjs', 'promise', 'ojs/ojjquery-hammer', 'ojs/ojoffcanvas'],
       /*
        * @param {Object} oj 
        * @param {jQuery} $
        * @param {Object} Hammer
        */
       function(oj, $, Hammer)
 
{

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @class Utility methods for swipe to reveal.
 * @since 1.2.0
 * @export
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
 *
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Class(es)</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>oj-swipetoreveal-more</td>
 *       <td>Apply styles to the more action item.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-swipetoreveal-flag</td>
 *       <td>Apply styles to the flag action item.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-swipetoreveal-alert</td>
 *       <td>Apply styles to the alert action item.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-swipetoreveal-default</td>
 *       <td>Apply to the default action that should get all the space when user swipes pass the threshold distance.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 */
oj.SwipeToRevealUtils = {};

/**
 * Setup listeners needed for swipe actions capability.  
 *
 * @export
 * @param {Element} elem the DOM element (of the offcanvas) that hosts the swipe actions
 * @param {Object=} options the options to set for swipe actions
 * @param {number} options.threshold the threshold that triggers default action.  If no default action is found (no item with style  
 *                 "oj-swipetoreveal-default") then this value is ignored.  If percentage value is specified it will be calculated
 *                 based on the width of the element with class "oj-offcanvas-outer-wrapper".  A default value is determined if not specified.
 *                 An "ojdefaultaction" event will be fired when threshold is exceed upon release.
 *
 * @see #tearDownSwipeActions
 * @see oj.OffcanvasUtils.html#setupPanToReveal
 */
oj.SwipeToRevealUtils.setupSwipeActions = function(elem, options)
{
    var drawer, direction, offcanvas, outerWrapper, threshold, minimum, drawerShown, evt, checkpoint, defaultAction, distance;

    drawer = $(elem);
    // checks if it's already registered
    if (drawer.hasClass("oj-swipetoreveal"))
    {
        return;
    }

    drawer.addClass("oj-swipetoreveal");

    direction = drawer.hasClass("oj-offcanvas-start") ? "end" : "start";

    offcanvas = {};
    offcanvas["selector"] = drawer;
    oj.OffcanvasUtils.setupPanToReveal(offcanvas);

    outerWrapper = oj.OffcanvasUtils._getOuterWrapper(drawer);

    if (options != null)
    {
        threshold = options['threshold'];
    }

    if (threshold != null)
    {
        threshold = parseInt(threshold, 10);

        // check if it's percentage value
        if (/%$/.test(options['threshold']))
        {
            threshold = (threshold / 100) * outerWrapper.outerWidth();
        }
    }
    else
    {
        // by default it will be 55% of the outer wrapper
        threshold = outerWrapper.outerWidth() * 0.55;
    }
    // by default the minimum will be the lesser of the width of the offcanvas and half of the outer wrapper
    minimum = Math.min(outerWrapper.outerWidth() * 0.3, drawer.outerWidth());

    drawerShown = false;
    outerWrapper.on("click.swipetoreveal", function(event)
    {
        if (drawerShown)
        {
            event.stopImmediatePropagation();   
            drawerShown = false;
        }
    });

    drawer
    .on("ojpanstart", function(event, ui) 
    {
        // if the swipe direction does not match the offcanvas's edge, veto it
        if (ui['direction'] != direction)
        {
            event.preventDefault();
        }
        else
        {
            // setup default style class
            drawer.children().addClass("oj-swipetoreveal-action");

            // find if there's any default action item specified
            defaultAction = drawer.children(".oj-swipetoreveal-default").get(0);

            // used to determine if it's a quick swipe
            checkpoint = (new Date()).getTime();
        }
    })
    .on("ojpanmove", function(event, ui)
    {
        drawerShown = true;

        // check if pan pass the threshold position, the default action item gets entire space.
        if (defaultAction != null)
        {
            if (ui['distance'] > threshold)
            {
                drawer.children().each(function() {
                    if (this != defaultAction)
                    {
                        $(this).addClass("oj-swipetoreveal-hide-when-full");
                    }                  
                });
            }
            else
            {
                drawer.children().removeClass("oj-swipetoreveal-hide-when-full");
            }
        }
    })
    .on("ojpanend", function(event, ui) 
    {
        distance = ui['distance'];
        if (defaultAction != null && distance > threshold)
        {
            // default action
            evt = $.Event("ojdefaultaction");
            drawer.trigger(evt, offcanvas);
            event.preventDefault();
        }

        // if pan pass the minimum threshold position, keep the toolbar open
        if (distance < minimum)
        {
            // check if this is a swipe, the time should be < 200ms and the distance must be > 10px
            if ((new Date()).getTime() - checkpoint > 200 || distance < 10)
            {
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
 *
 * @see #setupSwipeActions
 * @see oj.OffcanvasUtils.html#tearDownPanToReveal
 */
oj.SwipeToRevealUtils.tearDownSwipeActions = function(elem)
{
    var drawer, offcanvas, outerWrapper;

    drawer = $(elem);

    offcanvas = {};
    offcanvas["selector"] = drawer;

    outerWrapper = oj.OffcanvasUtils._getOuterWrapper(drawer);
    if (outerWrapper != null)
    {
        outerWrapper.off("click.swipetoreveal");
    }

    oj.OffcanvasUtils.tearDownPanToReveal(offcanvas);
};
});
