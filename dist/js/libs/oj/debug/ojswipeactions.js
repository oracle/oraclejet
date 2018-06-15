/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojswipetoreveal', 'ojs/ojoption'],
       /*
        * @param {Object} oj 
        * @param {jQuery} $
        */
       function(oj, $)
 
{

/**
 * Copyright (c) 2018, Oracle and/or its affiliates.
 * All rights reserved.
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

(function() {

/*!
 * JET SwipeActions @VERSION
 *
 *
 * Depends:
 *  jquery.ui.widget.js
 */

/**
 * @ojcomponent oj.ojSwipeActions
 * @augments oj.baseComponent
 * @since 5.1.0
 * @ojstatus preview
 * 
 * @ojshortdesc Adds swipe-to-reveal functionality to elements such as items in ListView.
 * @classdesc
 * <h3 id="swipeActionsOverview-section">
 *   JET SwipeActions Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#swipeActionsOverview-section"></a>
 * </h3>
 * <p>Description: SwipeActions can be added to an item in ListView to add swipe-to-reveal functionality when user swipes an item.
 *    The SwipeActions contains a <code class="prettyprint">start</code> and/or an <code class="prettyprint">end</code> slot, each represent the action bar to display when 
 *    user swipes in a particular direction.  The <code class="prettyprint">oj-option</code> element is used to represent each item in the action bar.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-list-view>
 *   &lt;template slot='itemTemplate'>
 *     &lt;li class='oj-swipeactions-container'>
 *       &lt;oj-swipe-actions on-oj-action='[[listener]]'>
 *         &lt;-- Content of item goes to the default slot -->
 *         &lt;span>Item content&lt;/span>
 *         &lt;-- Display when user swipes from end to start of the item -->
 *         &lt;template slot='end'>
 *           &lt;oj-option>Action 1&lt;/oj-option>
 *           &lt;oj-option class='oj-swipeactions-default'>Action 2&lt;/oj-option>
 *         &lt;/template>
 *       &lt;/oj-swipe-actions>
 *     &lt;/li>
 *   &lt;/template>
 * &lt;/oj-list-view>
 * </code>
 * </pre>
 *
 * <h3 id="actionIcon-section">
 *   Icon
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#actionIcon-section"></a>
 * </h3>
 *
 * <p>SwipeActions currently supports the rendering of icon for each options. To render the icon, the 
 * <code class="prettyprint">startIcon</code> slot of the <code class="prettyprint">oj-option</code>
 * should be specified. See the <code class="prettyprint">oj-option</code> doc for details about accepted children and slots.</p>
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
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="accessibility-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#accessibility-section"></a>
 * </h3>
 *
 * <p>Although the swipe actions are accessible with the keyboard using a skip link (that becomes visible when focused), it is recommended that applications provide an alternative way for the users to perform all the swipe actions.
 */
oj.__registerWidget('oj.ojSwipeActions', $['oj']['baseComponent'],
{
    version: '1.0.0',
    defaultElement: '<div>',
    widgetEventPrefix : "oj", 

    options: 
    {            
        /**
         * <p>Triggered when an action item is selected or when the default action is triggered.
         *
         * @expose
         * @event
         * @memberof oj.ojSwipeActions
         * @instance
         */
        action: null
    },

    _ComponentCreate: function() 
    {
        var self = this, touchStarted = false, enterPressed = false, ojOption, defaultActionTriggered = false, accLink, offcanvas;

        this._super();

        this.element.uniqueId();
        this.element[0].classList.add("oj-swipeactions", "oj-component");
        this.element[0].setAttribute("tabIndex", "-1");

        // pass true to catch these events on all menus, not just enabled menus
        this._on(true, {
            "touchstart": function(event)
            {
                // if touch to dismiss swipe actions, prevent listview item to get selected or activated
                offcanvas = self.element[0].querySelector(".oj-offcanvas-open");
                if (offcanvas != null && offcanvas.offsetWidth > 0)
                {
                    // this will prevent click event from firing, listen for touchend instead
                    event.preventDefault();
                }
                touchStarted = true;
            },
            "touchend": function(event) 
            {
                if (touchStarted)
                {
                    self._handleAction(event);
                }
                touchStarted = false;
            },
            "keydown": function(event)
            {
                // ESC key
                if (event.keyCode === 27)
                {
                    offcanvas = event.target.parentNode.parentNode;
                    if (offcanvas.classList.contains("oj-offcanvas-open"))
                    {
                        self._close({'selector': offcanvas, '_animate': false});
                        event.preventDefault();
                    }
                }
                else if (event.keyCode === 13)
                {
                    // enter key could have incorrectly propagated from acc links to action
                    // use this to ensure enter originates from action
                    if (event.target.classList.contains("oj-swipeactions-action-panel"))
                    {
                        enterPressed = true;
                    }
                }
            },
            "keyup": function(event)
            {
                // ENTER key
                if (event.keyCode === 13 && enterPressed)
                {
                    self._handleAction(event);
                }
                enterPressed = false;
            }, 
            "ojdefaultaction": function(event, offcanvas)
            {
                ojOption = $(offcanvas['selector']).children("oj-option.oj-swipetoreveal-default");
                if (ojOption.length > 0)
                {
                    self._fireActionEvent(ojOption[0], null);
                    // can't close offcanvas here until it has been opened, set a flag and close it in ojopen handler
                    defaultActionTriggered = true;
                }
            },
            "ojopen": function(event, offcanvas)
            {
                if (defaultActionTriggered)
                {
                    self._close(offcanvas);
                }
                defaultActionTriggered = false;
            },
            "ojclose": function(event, offcanvas)
            {
                // remove any existing hide link
                accLink = $(offcanvas['selector']).children(".oj-swipeactions-hide-actions-link");
                if (accLink.length > 0)
                {
                    accLink[0].parentNode.removeChild(accLink[0]);
                }
            }
        });

        this._focusable({
            'applyHighlight': true,
            'setupHandlers': function( focusInHandler, focusOutHandler) {
                self._focusInHandler = focusInHandler;
                self._focusOutHandler = focusOutHandler;
            }
        });

        this._setup();
    },

    /**
     * Close an offcanvas
     * @private
     */
    _close: function(offcanvasInfo)
    {
        var busyContext, busyStateResolve;

        busyContext = oj.Context.getContext(this.element[0]).getBusyContext();
        busyStateResolve = busyContext.addBusyState({'description': 'closing offcanvas'});
        oj.OffcanvasUtils.close(offcanvasInfo).then(function()
        {
            busyStateResolve();
        });
    },

    /**
     * Handles when user click or enter on an action/option
     * @private
     */
    _handleAction: function(event)
    {
        var ojOption = $(event.target).parents("oj-option");
        if (ojOption.length > 0)
        {
            this._fireActionEvent(ojOption[0], event);
            this._close({'selector': ojOption[0].parentNode});
        }
    },

    /**
     * Sets up resources needed by this SwipeActions
     * @memberof! oj.ojSwipeActions
     * @instance
     * @override
     * @protected
     */
    _SetupResources: function()
    {
        this._super();
        this._setupOrReleaseOffcanvas(oj.SwipeToRevealUtils.tearDownSwipeActions);
        this._setupOrReleaseOffcanvas(oj.SwipeToRevealUtils.setupSwipeActions);
    },

    /**
     * Release resources held by listview
     * @memberof! oj.ojSwipeActions
     * @instance
     * @override
     * @protected
     */
    _ReleaseResources: function()
    {
        this._super();
        this._setupOrReleaseOffcanvas(oj.SwipeToRevealUtils.tearDownSwipeActions);
    },

    /**
     * @private
     */
    _setupOrReleaseOffcanvas: function(func)
    {
        this._applyOffcanvas("oj-offcanvas-start", func);
        this._applyOffcanvas("oj-offcanvas-end", func);
    },

    /**
     * @private
     */
    _closeAllOffcanvas: function()
    {
        var self = this, closer;

        closer = function(offcanvas)
        {
            self._close({"selector": offcanvas});
        };

        this._applyOffcanvas("oj-offcanvas-start", closer);
        this._applyOffcanvas("oj-offcanvas-end", closer);
    },

    /**
     * @private
     */
    _applyOffcanvas: function(selector, func)
    {
        var offcanvas = this.element[0].querySelector("."+selector);
        if (offcanvas)
        {
            func(offcanvas);
        }
    },

    /**
     * Trigger an action event
     * @private
     */
    _fireActionEvent: function(ojOption, event)
    {
        var detail, params;

        detail = {};
        if (event)
        {
            detail['originalEvent'] = event instanceof $.Event ? event.originalEvent : event;            
        }

        params = {'detail': detail};
        params['cancelable'] = true;
        params['bubbles'] = true;

        oj.DomUtils.dispatchEvent(ojOption, new CustomEvent("ojAction", params));
    },

    /**
     * Re-initialize the swipe actions after having made some external modifications.
     *
     * <p>This method does not accept any arguments.
     *
     * @ojshortdesc Re-initialize the swipe actions.
     * @expose
     * @memberof oj.ojSwipeActions
     * @return {void}
     * @instance
     *
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * mySwipeActions.refresh();
     */
    refresh: function() 
    {
        this._super();

        this._setupOrReleaseOffcanvas(oj.SwipeToRevealUtils.tearDownSwipeActions);
        this._setup();
        this._setupOrReleaseOffcanvas(oj.SwipeToRevealUtils.setupSwipeActions);
    },

    /**
     * @private
     */
    _createOffcanvas: function(slotMap, slot)
    {
        var offcanvas;

        var template = slotMap[slot];
        if (template && template.length > 0 && template[0].tagName === "TEMPLATE")
        {
            offcanvas = document.createElement("div");
            offcanvas.className = (slot === "start") ? "oj-offcanvas-start" : "oj-offcanvas-end";
            this.element[0].appendChild(offcanvas);
            this._renderAccessibleLink(offcanvas);
        }
    },

    /**
     * @private
     */
    _setup: function() 
    { 
        var self = this, slotMap, content;

        this.element[0].classList.add("oj-offcanvas-inner-wrapper");
        this.element[0].parentNode.classList.add("oj-offcanvas-outer-wrapper");

        slotMap = oj.BaseCustomElementBridge.getSlotMap(this.element[0]);        

        // default slot is content
        content = slotMap[""];
        if (content && content.length > 0)
        {
            content[0].classList.add("oj-swipeactions-content");
        }

        // create the offcanvas for the start/end slots
        this._createOffcanvas(slotMap, "start");
        this._createOffcanvas(slotMap, "end");

        // listen for pan to happen and only render it when reveal wasn't veto'ed
        $(this.element).on("ojpanstart", function(event, ui)
        {
            if (!event.isDefaultPrevented())
            {
                self._renderOffcanvas(event.target);
            }
        })
    },

    /**
     * @private
     */
    _renderOffcanvas: function(offcanvas, callback)
    {
        var self = this, slotMap, template, busyContext, busyStateResolve;

        offcanvas.setAttribute("role", "toolbar");
        offcanvas.setAttribute("data-oj-context", "");

        slotMap = oj.BaseCustomElementBridge.getSlotMap(this.element[0]);        

        template = offcanvas.classList.contains("oj-offcanvas-start") ? slotMap["start"][0] : slotMap["end"][0];
        busyContext = oj.Context.getContext(self.element[0]).getBusyContext();
        busyStateResolve = busyContext.addBusyState({'description': 'rendering ojoptions'});

        oj.Config.__getTemplateEngine().then(
            function(engine)
            {
                self._render(engine, offcanvas, template);
                if (callback)
                {
                    // wait for oj-option to render before invoking callback
                    busyContext = oj.Context.getContext(offcanvas).getBusyContext();
                    busyContext.whenReady().then(function()
                    {
                        callback()
                        busyStateResolve();
                    });
                }
                else
                {
                    busyStateResolve();
                }
            },
            function(reason)
            {
                busyStateResolve();
                throw "Error loading template engine: "+reason;
            }
        );
    },

    /**
     * Show all accessible links
     * @private
     */
    _showAccessibleLinks: function()
    {
        var links, i, margin = 0;

        links = this.element[0].querySelectorAll("a.oj-helper-hidden-accessible");
        for (i=0; i<links.length; i++)
        {
            links[i].style.left = margin + "px";
            links[i].className = "oj-swipeactions-accessible-link";
            margin = margin + links[i].offsetWidth + 5;
        }
    },

    /**
     * Hide all accessible links
     * @private
     */
    _hideAccessibleLinks: function()
    {
        var links, i;

        links = this.element[0].querySelectorAll("a.oj-swipeactions-accessible-link");
        for (i=0; i<links.length; i++)
        {
            links[i].className = "oj-helper-hidden-accessible";
        }
    },

    /**
     * @private
     */
    _isIE11: function()
    {
        var agent = oj.AgentUtils.getAgentInfo();
        return agent['browser'] === "ie" && agent['browserVersion'] === 11;
    },

    /**
     * Renders a hidden link that provides an accessible way to show the swipe actions
     * @private
     */
    _renderAccessibleLink: function(offcanvas)
    {
        var link, isAndroid, startLink, isTriggerByTouch = false, self = this, offcanvasInfo, hideLink, busyContext, busyStateResolve;

        link = document.createElement("a");
        link.setAttribute("tabIndex", "0");
        link.setAttribute("href", "#");
        link.textContent = this.getTranslatedString(offcanvas.classList.contains("oj-offcanvas-start") ? "ariaShowStartActionsDescription" : "ariaShowEndActionsDescription");

        // Due to Chrome bug https://bugs.chromium.org/p/chromium/issues/detail?id=657157
        // Talkback will not be able to activate link/button when it is not visible, so we cannot use oj-helper-hidden-accessible
        // using absoluate will make it invisible within the listview item but activatable when it receive accessible focus
        isAndroid = (oj.AgentUtils.getAgentInfo()['os'] === oj.AgentUtils.OS.ANDROID);
        if (isAndroid)
        {
            link.style.color = "transparent";
            link.className = "oj-swipeactions-accessible-link";
            if (offcanvas.classList.contains("oj-offcanvas-end"))
            {
                startLink = this.element[0].querySelector("a.oj-swipeactions-accessible-link");
                if (startLink != null)
                {
                    link.style.marginLeft = (startLink.offsetWidth + 5) + "px";
                }
            }

            link.addEventListener("touchstart", function(event)
            {
                // whether the touch event is triggered by a touch or talkback double tap
                isTriggerByTouch = (event.touches[0].force > 0);
            });
        }
        else
        {
            link.className = "oj-helper-hidden-accessible";
        }

        link.addEventListener("focus", function()
        {
            // show it when it has focus
            if (!isAndroid)
            {
                self._showAccessibleLinks();
            }
            // make sure all offcanvas are close
            self._closeAllOffcanvas();
        });

        link.addEventListener("blur", function(event)
        {
            // VoiceOver will trigger a blur with null relatedTarget
            if (event.relatedTarget != null && !event.relatedTarget.classList.contains("oj-swipeactions-accessible-link"))
            {
                // need this timeout to hide otherwise VoiceOver will not be able to shift focus
                setTimeout(function()
                {
                    if (!isAndroid)
                    {
                        self._hideAccessibleLinks();
                    }
                }, 0);
            }
            // IE11 does not support relatedTarget field, so we'll use setTimeout to check if focus switched to something
            // that is not an accessible link
            else if (event.relatedTarget == null && self._isIE11())
            {
                setTimeout(function()
                {
                    if (!document.activeElement.classList.contains("oj-swipeactions-accessible-link"))
                    {
                        self._hideAccessibleLinks();                
                    }
                }, 0);
            }
        });

        link.addEventListener("click", function(event)
        {
            // isTriggerByTouch will only be true if user touches the link on Android
            if (isTriggerByTouch)
            {
                return;
            }

            // to prevent enter key processed by ListView
            event.stopPropagation();

            self._renderOffcanvas(offcanvas, function()
            {
                $(offcanvas).children("oj-option").addClass("oj-swipetoreveal-action")
                            .children().attr("tabIndex", 0);

                offcanvasInfo = {};
                offcanvasInfo["selector"] = offcanvas;
                // we are going to manage dismissal otherwise VoiceOver will close the offcanvas prematurely
                offcanvasInfo["autoDismiss"] = "none";
                // turn animation off otherwise Talkback will not be able to focus on the item correctly
                offcanvasInfo["_animate"] = false;

                hideLink = document.createElement("a");
                hideLink.className = "oj-swipeactions-hide-actions-link";
                hideLink.setAttribute("tabIndex", "0");
                hideLink.setAttribute("href", "#");
                hideLink.setAttribute("aria-label", self.getTranslatedString("ariaHideActionsDescription"));

                hideLink.addEventListener("click", function(event)
                {
                    self._close(offcanvasInfo);
                });

                // on Android with TalkBack, click event is not fired when activate
                if (isAndroid)
                {
                    hideLink.addEventListener("touchend", function(event)
                    {
                        self._close(offcanvasInfo);
                    });
                }

                busyContext = oj.Context.getContext(self.element[0]).getBusyContext();
                busyStateResolve = busyContext.addBusyState({'description': 'opening offcanvas'});
                oj.OffcanvasUtils.open(offcanvasInfo).then(function()
                {
                    offcanvas.appendChild(hideLink);
                    busyStateResolve();
                });
            });
        });

        this.element[0].appendChild(link);
    },

    /**
     * @private
     */
    _render: function(templateEngine, offcanvas, template)
    {
        var self = this, ojOptions, nodes;

        // remove any existing oj-options from previous render
        $(offcanvas).children("oj-option").remove();

        ojOptions = [];
        nodes = templateEngine.execute(this.element[0], template, null);
        nodes.forEach(
            function(node)
            {
                // nodes could contain comments and other artifacts
                if (node.tagName === "OJ-OPTION")
                {
                    ojOptions.push(node);
                }
            }
        );

        ojOptions.forEach(
            function(option) 
            {
                option["customOptionRenderer"] = self._customOptionRenderer.bind(self);
                offcanvas.appendChild(option);
            }
        );
    },
    
    /**
     * @private
     */
    _customOptionRenderer: function(option) 
    {
        var self = this, children, container, inner, textIconContainer, slotMap, iconSlot, text, textSlot;

        // check if it's alraedy rendered
        children = $(option).children("div");
        if (children.length > 0)
        {
            return;
        }

        option.setAttribute("role", "button");

        // assign default action (by using SwipeToRevealUtils marker class)
        if (option.classList.contains("oj-swipeactions-default"))
        {
            option.classList.add("oj-swipetoreveal-default");
        }

        container = document.createElement("div");
        container.className = "oj-flex-bar oj-swipeactions-action-panel";
        container.addEventListener("focus", function(event)
        {
            self._focusInHandler($(container));
        });

        container.addEventListener("blur", function(event)
        {
            self._focusOutHandler($(container));
        });

        inner = document.createElement("div");
        inner.className = "oj-flex-bar-center-absolute";
        container.appendChild(inner); // @HTMLUpdateOK append trusted new DOM

        textIconContainer = document.createElement("div");
        textIconContainer.className = "oj-flex oj-sm-flex-direction-column";
        inner.appendChild(textIconContainer); // @HTMLUpdateOK append trusted new DOM

        slotMap = oj.BaseCustomElementBridge.getSlotMap(option);

        iconSlot = slotMap["startIcon"];
        if (iconSlot)
        {
            iconSlot.forEach(
                function(node) 
                {
                    textIconContainer.appendChild(node); // @HTMLUpdateOK append trusted new DOM           
                }
            );
        }

        text = document.createElement("div");
        text.className = "oj-flex-item oj-swipeactions-action-text";
        textIconContainer.appendChild(text); // @HTMLUpdateOK append trusted new DOM
        textSlot = slotMap[""];
        if (textSlot)
        {
            textSlot.forEach(
                function(node) 
                {
                    text.appendChild(node); // @HTMLUpdateOK reparent trusted child DOM in menu item
                }        
            );
        }

        $(option).prepend(container); // @HTMLUpdateOK append trusted new DOM
    }
});
}() );

// Slots

/**
 * <p>When using SwipeActions within ListView, any content for the item in ListView should be added as child element in SwipeActions.
 *
 * @ojchild Default
 * @memberof oj.ojSwipeActions
 *
 * @example <caption>Initialize the SwipeActions to display some text inside the item of ListView:</caption>
 * &lt;oj-list-view>
 *   &lt;template slot='itemTemplate'>
 *     &lt;oj-swipe-actions>
 *       &lt;span>Item content&lt;/span>
 *     &lt;/oj-swipe-actions>
 *   &lt;/template>
 * &lt;/oj-list-view>
 */

/**
 * <p>The <code class="prettyprint">start</code> slot is used to specify the options to appears when user swipes from start to end on its container. The slot must be a &lt;template> element.</p>  
 *
 * <p>When the template is executed, it will have access to the parent binding context.  For example, in the case of ListView, $current should return the data of the row containing the swipe actions.</p>
 *
 * @ojstatus preview
 * @ojslot start
 * @memberof oj.ojSwipeActions
 *
 * @example <caption>Initialize the SwipeActions with a set of options that appears when user swipes from start to end:</caption>
 * &lt;oj-swipe-actions>
 *   &lt;template slot='start'>
 *     &lt;oj-option value='action1'>Action 1&lt;/oj-option>
 *     &lt;oj-option value='action2'>Action 2&lt;/oj-option>
 *   &lt;template>
 * &lt;/oj-swipe-actions>
 */

/**
 * <p>The <code class="prettyprint">end</code> slot is used to specify the action bar that appears when user swipes from end to start on its container. The slot must be a &lt;template> element.</p>  
 *
 * <p>When the template is executed, it will have access to the parent binding context.  For example, in the case of ListView, $current should return the data of the row containing the swipe actions.</p>
 *
 * @ojstatus preview
 * @ojslot end
 * @memberof oj.ojSwipeActions
 *
 * @example <caption>Initialize the SwipeActions with a set of options that appears when user swipes from end to start:</caption>
 * &lt;oj-swipe-actions>
 *   &lt;template slot='end'>
 *     &lt;oj-option value='action1'>Action 1&lt;/oj-option>
 *     &lt;oj-option value='action2'>Action 2&lt;/oj-option>
 *   &lt;template>
 * &lt;/oj-swipe-actions>
 */

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
 *       <td>oj-swipeactions-container</td>
 *       <td>Designed for use with item in oj-list-view that contains the oj-swipe-actions element, specifically this will remove the padding around the content of the item so that the swipe actions can take the full height.
 *           <p>Is applied to the root of each item in oj-list-view containing the oj-swipe-actions element.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-swipeactions-neutral</td>
 *       <td>Designed for use with an action item that shows more available actions that users can perform.
 *           <p>Is applied to the <code class="prettyprint">oj-option</code> element that represents the action item.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-swipeactions-attention</td>
 *       <td>Designed for use with an action item that tags the associated item in oj-list-view.
 *           <p>Is applied to the <code class="prettyprint">oj-option</code> element that represents the action item.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-swipeactions-danger</td>
 *       <td>Designed for use with an action item that performs an explicit action like deleting the associated item in oj-list-view.  
 *           <p>Is applied to the <code class="prettyprint">oj-option</code> element that represents the action item.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-swipeactions-default</td>
 *       <td>Designed for use with an action item that should get all the space when user swipes pass the threshold distance.  This is usually the last item within the template.
 *           <p>Is applied to the <code class="prettyprint">oj-option</code> element that represents the default action item.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
 * @memberof oj.ojSwipeActions
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
 *       <td>oj-swipeactions-container element</td>
 *       <td><kbd>Swipe</kbd></td>
 *       <td>Reveals the swipe actions.  Depending on the distance relative to the target is swiped, the oj-swipe-actions will either be closed (swipe distance too short), opened, or the default action is performed (swipe distance passed a certain threshold).</td>
 *     </tr>
 *     <tr>
 *       <td>oj-swipeactions-container element</td>
 *       <td><kbd>Pan</kbd></td>
 *       <td>Reveals the swipe actions.  If a default action is specified, the default action will take over all the space of other action items after the user panned past a certain distance.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-swipe-action element</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Triggers the action associated with the swipe action.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojSwipeActions
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
 *       <td>Show actions link</td>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Shows the start/end swipe actions.</td>
 *     </tr>
 *     <tr>
 *       <td>Hide actions link</td>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Hides the start/end swipe actions.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan = "3">Swipe action</td>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Trigger the action associated with the swipe action.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Hide the swipe actions.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Tab</kbd></td>
 *       <td>Navigate to the next swipe action.  If it is the last swipe action, navigate to the hide actions link.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojSwipeActions
 */

(function() {
var ojSwipeActionsMeta = {
  "properties": {},
  "events": {
    "action": {}
  },
  "extension": {
    _WIDGET_NAME: "ojSwipeActions"
  }
};
oj.CustomElementBridge.registerMetadata('oj-swipe-actions', 'baseComponent', ojSwipeActionsMeta);
oj.CustomElementBridge.register('oj-swipe-actions', {'metadata': oj.CustomElementBridge.getMetadata('oj-swipe-actions')});
})();
});