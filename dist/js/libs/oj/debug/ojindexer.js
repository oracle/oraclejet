/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'hammerjs', 'promise', 'ojs/ojjquery-hammer', 'ojs/ojcomponentcore'],
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
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

(function() {

/*!
 * JET Indexer @VERSION
 *
 *
 * Depends:
 *  jquery.ui.widget.js
 */

/**
 * @ojcomponent oj.ojIndexer
 * @augments oj.baseComponent
 * @since 1.2.0
 * 
 * @classdesc
 * <h3 id="indexerOverview-section">
 *   JET Indexer Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#indexerOverview-section"></a>
 * </h3>
 * <p>Description: The JET Indexer is usually associated with a scrollable JET ListView.  It provides a list of prefixes/characters that 
 *                 corresponds to group headers in ListView.  When a prefix/character is selected the corresponding group header will be 
 *                 scroll to the top of the ListView.
 * </p>
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
 * <p>
 * The indexer component is accessible - it sets and maintains the appropriate aria- attributes, 
 * including <code class="prettyprint">aria-valuenow</code>, <code class="prettyprint">aria-valuemax</code>,
 * <code class="prettyprint">aria-valuemin</code> and <code class="prettyprint">aria-orientation</code>.
 * <p>
 * Application developer should associate a ListView with the Indexer by specifying the id of the ListView in the aria-controls attribute in the Indexer.
 * </p>
 * 
 * <!-- - - - - Above this point, the tags are for the class.
 *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
 * @desc Creates an ojIndexer component
 * 
 * @param {Object=} options a map of option-value pairs to set on the component
 * 
 * @example <caption>Initialize component using widget API</caption>
 * &lt;ul id="indexer1" aria-controls="listview1"/&gt;<br/>
 * $("#indexer").ojIndexer({'option', 'data', listview.getIndexerModel()});
 */
oj.__registerWidget('oj.ojIndexer', $['oj']['baseComponent'],
{
    defaultElement: "<ul>",
    version: "1.2",
    widgetEventPrefix : "oj", 

    options: 
    {            
      /**
        * The data model for the Indexer which must be a oj.IndexerModel.  Currently this option can only be 
        * set to the return value of the getIndexerModel method on the ListView instance.
        * The data attribute should always be specified.  If not specified, then an empty indexer is rendered.
        *
        * @expose
        * @memberof! oj.ojIndexer
        * @instance
        * @type {oj.IndexerModel}
        * @default <code class="prettyprint">null</code>
        *
        * @example <caption>Initialize the Indexer with an IndexModel:</caption>
        * $( ".selector" ).ojIndexer({ "data": listview.getIndexerModel()});
        */
        data: null
    },

    /**
     * Creates the indexer
     * @override
     * @memberof! oj.ojIndexer
     * @protected
     */
    _ComponentCreate : function () 
    {
        this._super();
        this._setup();
    },

    /**
     * Initialize the indexer after creation
     * @protected
     * @override
     * @memberof! oj.ojIndexer
     */
    _AfterCreate : function ()
    {
        var container;

        this._super();
        this._createIndexerContent();
        this._setAriaProperties();
        this._createInstructionText();

        // register a resize listener and swipe handler        
        container = this._getIndexerContainer()[0];
        this._registerResizeListener(container);
        this._registerTouchHandler(container);
    },

    /**
     * Destroy the indexer
     * @memberof! oj.ojIndexer
     * @override
     * @private
     */
    _destroy: function()
    {
        var container, model;

        this._super();
        this._unsetAriaProperties();
        this.element.removeClass("oj-component-initnode");

        container = this._getIndexerContainer()[0];
        this._unregisterResizeListener(container);
        this._unregisterTouchHandler(container);

        model = this._getIndexerModel();
        if (model != null && this.m_indexerModelListener)
        {
            model.off(oj.IndexerModel.EventType.CHANGE, this.m_indexerModelListener);
        }

        oj.DomUtils.unwrap(this.element, $(container));
    },

    /**
     * Sets a single option
     * @memberof! oj.ojIndexer
     * @override
     * @private
     */
    _setOption: function(key, value)
    {
        this._superApply(arguments);
        if (key == "data")
        {
            this.refresh();
        }
    },

    /**
     * Returns a jQuery object containing the root dom element of the indexer
     * @expose
     * @override
     * @memberof! oj.ojIndexer
     * @instance
     * @return {jQuery} the root DOM element of the indexer
     */
    widget: function() 
    {
        return this._getIndexerContainer();
    },

    /**
     * Redraw the entire indexer after having made some external modification.
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof! oj.ojIndexer
     * @instance
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * $( ".selector" ).ojIndexer( "refresh" );
     */
    refresh: function()
    {
        this._super();

        this.element.empty();
        this._createIndexerContent();
        this._setAriaProperties();
        this.m_current = null;
    },

    /**
     * Return the subcomponent node represented by the documented locator attribute values.
     * <p>
     * To lookup the node that represents the specific prefix in the indexer the locator object should have the following:
     * <ul>
     * <li><b>subId</b>: 'oj-indexer-prefix'</li>
     * <li><b>prefix</b>: the prefix in the indexer</li>
     * </ul>
     *
     * @expose
     * @memberof! oj.ojIndexer
     * @instance
     * @override
     * @param {Object} locator An Object containing at minimum a subId property
     *        whose value is a string, documented by the component, that allows
     *         the component to look up the subcomponent associated with that
     *        string.  It contains:<p>
     *        component: optional - in the future there may be more than one
     *        component contained within a page element<p>
     *        subId: the string, documented by the component, that the component
     *        expects in getNodeBySubId to locate a particular subcomponent
     * @returns {Array.<(Element|null)>|Element|null} the subcomponent located by the subId string passed
     *          in locator, if found.<p>
     */
    getNodeBySubId: function(locator)
    {
        var subId, prefix, prefixes, i, j, node, includes;
 
        if (locator == null)
        {
            return this.element ? this.element[0] : null;
        }

        subId = locator['subId'];
        if (subId === 'oj-indexer-prefix')
        {
            prefix = locator['prefix'];
            prefixes = this.element.children("li");
            for (i=0; i<prefixes.length; i++)
            {
                node = prefixes.get(i);
                if ($(node).attr("data-range") == prefix)
                {
                    return node;
                }
                else
                {
                    // it's a separator, check the prefixes included in the range
                    includes = $(node).attr("data-includes");
                    if (includes != null)
                    {
                        includes = includes.split("|");
                        for (j=0; j<includes.length; j++)
                        {
                            if (includes[j] == prefix)
                            {
                                return node;
                            }
                        }
                    }
                }
            }
        }
        // Non-null locators have to be handled by the component subclasses
        return null;
    },

    /**
     * <p>Returns the subId string for the given child DOM node.  For more details, see
     * <a href="#getNodeBySubId">getNodeBySubId</a>.
     *
     * @expose
     * @memberof! oj.ojIndexer
     * @instance
     * @override
     * @param {!Element} node - child DOM node
     * @return {Object|null} The subId for the DOM node, or <code class="prettyprint">null</code> when none is found.
     */
    getSubIdByNode: function(node)
    {
        var prefix;

        if (node != null)
        {   
            prefix = $(node).attr("data-range");
            if (prefix != null)
            {
                return {'subId': 'oj-indexer-prefix', 'prefix': prefix};
            }
        }

        return null;
    },

    /****************************** core rendering **********************************/
    /**
     * Sets wai-aria properties on root element
     * @private
     */
    _setAriaProperties: function()
    {
        this.element.attr("role", "slider")
                    .attr("aria-orientation", "vertical")
                    .attr("aria-describedby", this.element.prop("id") + ":desc")
                    .attr("aria-valuemin", 0)
                    .attr("aria-valuemax", Math.max(0, this.element.children().length-1));
    },

    /**
     * Removes wai-aria properties on root element
     * @private
     */
    _unsetAriaProperties: function()
    {
        this.element.removeAttr("role")
                    .removeAttr("aria-orientation")
                    .removeAttr("aria-describedby")
                    .removeAttr("aria-valuemin")
                    .removeAttr("aria-valuemax")
                    .removeAttr("aria-valuetext");
    },

    /**
     * Create instruction text for screen reader
     * @private
     */
    _createInstructionText: function()
    {
        var key, text;

        if (oj.DomUtils.isTouchSupported())
        {
            key = "ariaTouchInstructionText"
        }
        else
        {
            key = "ariaKeyboardInstructionText"
        }

        text = $(document.createElement("div"));
        text.prop("id", this.element.prop("id") + ":desc")
        text.addClass("oj-helper-hidden-accessible")
            .text(this.getTranslatedString(key));

        this._getIndexerContainer().append(text); // @HtmlUpdateOK
    },

    /**
     * Retrieves the div around the root element, create one if needed.
     * @return {jQuery} the div around the root element 
     * @private
     */    
    _getIndexerContainer: function()
    {
        if (this.m_container == null)
        {
            this.m_container = this._createIndexerContainer();
        }
        return this.m_container;
    },

    /**
     * Creates the div around the root element.
     * @return {jQuery} the div around the root element
     * @private
     */    
    _createIndexerContainer: function()
    {
        var container = $(document.createElement('div'));
        container.addClass("oj-indexer oj-component");
        this.element.parent()[0].replaceChild(container[0], this.element[0]); //@HTMLUpdateOK
        container.prepend(this.element); //@HTMLUpdateOK

        return container;
    },

    /**
     * @private
     */
    _createIndexerContent: function()
    {
        var model, root, prefixes, availablePrefixes, prefixOthers, height, first, itemHeight, max, skip, i, prefix, item, last, others;

        model = this._getIndexerModel();
        if (model == null)
        {
            return;
        }

        root = this.element;
        prefixes = model.getIndexablePrefixes();
        availablePrefixes = model.getPrefixes();
        prefixOthers = this.getTranslatedString("indexerOthers");
        height = this.widget().outerHeight();
 
        // the first character is always present, use it to test height
        first = this._createItem(prefixes[0], availablePrefixes);
        root.append(first); // @HtmlUpdateOK

        itemHeight = first.outerHeight();
        max = Math.floor(height / itemHeight);

        // first +1 is to include the '#', second +1 is to include rendering of the symbol between letters
        this._getIndexerContainer().removeClass("oj-indexer-abbr");
        skip = Math.floor((prefixes.length+1) / max) + 1;
        if (skip > 1)
        {
            // the height of item is a little different
            this._getIndexerContainer().addClass("oj-indexer-abbr");
        }

        for (i=1+skip; i<prefixes.length; i=i+skip+1)
        {
            if (skip > 1)
            {
                item = this._createSeparator(prefixes, i-skip, i-1);
                root.append(item); // @HtmlUpdateOK
            }
            else
            {
                i--;
            }

            prefix = prefixes[i];
            item = this._createItem(prefix, availablePrefixes);
            root.append(item); // @HtmlUpdateOK
        }

        // the last character is always present
        last = this._createItem(prefixes[prefixes.length-1], availablePrefixes);
        root.append(last); // @HtmlUpdateOK

        // the special others character is always present
        others = this._createItem(prefixOthers);
        others.attr("data-others", "true");
        root.append(others); // @HtmlUpdateOK
    },

    /**
     * @private
     */
    _createItem: function(prefix, availablePrefixes)
    {
        var item = $(document.createElement("li"));
        item.attr("data-range", prefix)
            .text(prefix);

        if (availablePrefixes != null && availablePrefixes.indexOf(prefix) == -1)
        {
            item.addClass("oj-disabled");
        }            

        return item;
    },

    /**
     * @private
     */
    _createSeparator: function(indexString, from, to)
    {
        var item, i, includes = "";

        item = $(document.createElement("li"));
        item.addClass("oj-indexer-ellipsis")
            .attr("data-range", indexString[from + Math.round((to-from)/2)]);
        for (i=from; i<to; i++)
        {
            includes = includes + indexString[i] + "|";
        }
        includes = includes + indexString[to];
        item.attr("data-includes", includes);
        return item;
    },
    /**************************** end core rendering **********************************/

    /******************************** event handler **********************************/
    /**
     * Initialize the indexer
     * @private
     */
    _setup: function()
    {
        var self = this, model;

        this.element
            .uniqueId()
            .addClass("oj-component-initnode")
            .attr("tabIndex", 0);

        this._on(this.element, {
            "click": function(event) 
            {
                self._handleClick(event);
            },
            "keydown": function(event)
            {
                self._handleKeyDown(event);
            },
            "focus": function(event)
            {
                self._handleFocus(event);
            },
            "blur": function(event)
            {
                self._handleBlur(event);
            }
        });

        model = this._getIndexerModel();
        if (model != null)
        {
            this.m_indexerModelListener = function()
            {
                self.refresh();
            };
            model.on(oj.IndexerModel.EventType.CHANGE, this.m_indexerModelListener);
        }
    },

    /**
     * Event handler for when mouse click anywhere in the indexer
     * @param {Event} event mouseclick event
     * @private
     */
    _handleClick: function(event)
    {
        var target;

        //only perform events on left mouse, (right in rtl culture)
        if (event.button === 0)
        {
            target = $(event.target);
            this._setCurrent(target);
        }
    },

    /**
     * Handler for focus event
     * @param {Event} event the focus event
     * @private
     */
    _handleFocus: function(event)
    {
        this._getIndexerContainer().addClass("oj-focus-ancestor");
        if (this.m_current == null)
        {
            this._setFocus(this.element.children("li").first());
        }
    },

    /**
     * Handler for blur event
     * @param {Event} event the blur event
     * @private
     */
    _handleBlur: function(event)
    {
        this._getIndexerContainer().removeClass("oj-focus-ancestor");
    },

    /**
     * Event handler for when user press down a key
     * @param {Event} event keydown event
     * @private
     */
    _handleKeyDown: function(event)
    {
        var next, processed = false;

        switch (event.keyCode)
        {
            // UP key
            case 38:
                next = this.m_current.prev();
                break;
            // DOWN key
            case 40:
                next = this.m_current.next();
                break;
            // ENTER key
            case 13:
                this._setCurrent(this.m_current);
                processed = true;
                break;
        };

        if (next != null && next.length > 0)
        {
            processed = true;
            this._setFocus(next);
        }   

        if (processed)
        {
            event.preventDefault();
        }
    },

    _setFocus: function(item)
    {
        if (this.m_current != null)
        {
            this.m_current.removeClass("oj-focus");
        }
        item.addClass("oj-focus");

        this._updateAriaProperties(item);        
        this.m_current = item;
    },

    /**
     * Retrieves the indexer model.
     * @private
     */
    _getIndexerModel: function()
    {
        var model = this.option("data");
        if (model != null && (model.setPrefix == undefined || model.getIndexablePrefixes == undefined || model.getPrefixes == undefined))
        {
            throw "Invalid IndexerModel";
        }
        return model;
    },

    /**
     * Sets the character item as current
     * @param {jQuery} item
     * @private
     */
    _setCurrent: function(item)
    {
        var prefix = item.attr("data-range");
        if (item.attr("data-others"))
        {
            prefix = oj.IndexerModel.PREFIX_OTHERS;
        }    

        this._setCurrentPrefix(prefix);
    },

    /**
     * Sets the prefix as current
     * @param {string} prefix
     * @private
     */
    _setCurrentPrefix: function(prefix)
    {
        var self = this, item, val;

        // sets on the IndexerModel
        this._getIndexerModel().setPrefix(prefix).then(function(val)
        {
            // the resolve value is the prefix that actually scrolls to
            if (val != null)
            {               
                item = self._findItem(val);
                if (item != null)
                {
                    self._setFocus(item);
                }
            }
        });
    },

    /**
     * Update wai-aria properties 
     * @param {jQuery} item the item 
     * @private
     */
    _updateAriaProperties: function(item)
    {
        var includes, val, valueText = "";

        includes = item.attr("data-includes");

        if (includes != null)
        {
            includes = includes.split("|");
            // length should always be > 0
            if (includes.length > 0)
            {
                valueText = this.getTranslatedString("ariaInBetweenText", {"first": includes[0], "second": includes[includes.length-1]});
            }
        }
        else
        {
            val = item.attr("data-range");
            // checks if it's the special others prefix
            if (val === oj.IndexerModel.PREFIX_OTHERS)
            {
                valueText = this.getTranslatedString("ariaOthersLabel");
            }
            else
            {
                valueText = val;
            }
        }

        // convey to screen reader that it's disabled
        if (item.hasClass("oj-disabled"))
        {
            valueText = valueText + ". " + this.getTranslatedString("ariaDisabledLabel");
        }

        this.element.attr("aria-valuetext", valueText);
        this.element.attr("aria-valuenow", item.index());
    },

    /**
     * Finds the item with the specified prefix
     * @param {string} prefix
     * @return {jQuery} the item, null if not found
     * @private
     */
    _findItem: function(prefix)
    {
        var children, i, item, value, includes;

        children = this.element.children();
        for (i=0; i<children.length; i++)
        {
            item = children.get(i);
            value = $(item).attr("data-range");
            includes = $(item).attr("data-includes");

            if ((value != null && value == prefix) || (includes != null && includes.indexOf(prefix) > -1))
            {
                return $(item);
            }
        }

        return null;
    },

    /**
     * Unregister event listeners for resize the container DOM element.
     * @param {Element} element the container DOM element
     * @private
     */
    _unregisterResizeListener: function(element)
    {
        if (element && this._resizeHandler)
        {
            // remove existing listener
            oj.DomUtils.removeResizeListener(element, this._resizeHandler);    
        }
    },

    /**
     * Register event listeners for resize the container DOM element.
     * @param {Element} element  DOM element
     * @private
     */
    _registerResizeListener: function(element)
    {         
        if (element)
        {
            if (this._resizeHandler == null)
            {
                this._resizeHandler = this._handleResize.bind(this);
            }

            oj.DomUtils.addResizeListener(element, this._resizeHandler);
        }
    },

    /**
     * Unregister panning handler
     * @param {Element} element  DOM element
     * @private
     */
    _unregisterTouchHandler: function(element)
    {
        $(element).off("panstart panmove panend");
    },

    /**
     * Register panning handler
     * @param {Element} element  DOM element
     * @private
     */
    _registerTouchHandler: function(element)
    {    
        var self = this, options, target, x, y, currentTarget, currentPrefix, currentY, previousY, delta, range, index, prefix;
        
        options = {
        "recognizers": [
          [Hammer.Pan, {"direction": Hammer["DIRECTION_VERTICAL"]}
          ]
        ]};

        $(element)
        .ojHammer(options)
        .on("panstart", function(event)
        {
            target = event['gesture']['target'];
            // for x, don't use the target, use x relative to the indexer to ensure it reflects item in Indexer 
            // even if the finger is off the Indexer
            x = self.element[0].getBoundingClientRect().left + 5;
            y = target.getBoundingClientRect().top;
            self._setCurrent($(target));

            currentTarget = target;
            currentPrefix = target.getAttribute("data-range");
            currentY = y;
        })
        .on("panmove", function(event)
        {
            // calculate point instead of using screenX/Y from touch is better since
            // 1) x stays constant
            // 2) in voiceover user could have pan anywhere on the screen
            previousY = currentY;
            currentY = y + event['gesture']['deltaY'];

            target = document.elementFromPoint(x, currentY);

            // should not happen
            if (target == null)
            {
                return;
            }

            delta = currentY - previousY;

            if (currentTarget == target)
            {
                range = target.getAttribute("data-includes");
                // if the prefix is a range (dot), then try to set the next prefix inside the range current
                // for example, if move on * which represents range BCD, if current is C then move up should go to B and move down should go to D
                if (range != null)
                {
                    range = range.split("|");
                    index = range.indexOf(currentPrefix);
                    prefix = null;
                    if (delta > 0 && index < range.length-1)
                    {
                        prefix = range[index+1];
                    }
                    else if (delta < 0 && index > 0)
                    {
                        prefix = range[index-1];
                    }

                    if (prefix != null)
                    {
                        currentPrefix = prefix;
                        self._setCurrentPrefix(prefix);                           
                    }
                }
            }
            else
            {
                if (target.hasAttribute("data-range"))
                {                 
                    range = target.getAttribute("data-includes");
                    prefix = null;
                    // if the target is a range (dot), check to see if we should set the prefix to the beginning of
                    // range or end of range.  For example, if you have A * E with * represents BCD, coming from A should go to B
                    // where as coming from E should go to D.
                    if (range != null)
                    {
                        if (delta > 0 && target == currentTarget.nextElementSibling)
                        {
                            prefix = range[0];
                        }
                        else if (delta < 0 && target == currentTarget.previousElementSibling)
                        {
                            prefix = range[range.length-1];
                        }
                    }         

                    if (prefix == null)
                    {
                        prefix = target.getAttribute("data-range");
                    }

                    currentTarget = target;
                    currentPrefix = prefix;

                    self._setCurrentPrefix(currentPrefix);                           
                }
            }
        })
        .on("panend", function(event)
        {
            currentTarget = null;
            currentPrefix = null;
            currentY = null;
            prefix = null;
        });
    },

    /**
     * The resize handler.
     * @param {number} width the new width
     * @param {number} height the new height
     * @private
     */
    _handleResize: function(width, height)
    {
        if (width > 0 && height > 0)
        {
            this.refresh();
        }
    }
        
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
 *       <td>Characters</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Selects the character in the indexer, which scrolls to the corresponding group header in the associated ListView.  
 *           When tap on the ellipsis character, the character in between will be selected.</td>
 *     </tr>
 *     <tr>
 *       <td>Characters</td>
 *       <td><kbd>Pan</kbd></td>
 *       <td>Selects the character in the indexer, which scrolls to the corresponding group header in the associated ListView.  
 *           When pan up and down the ellipsis character, the indexer will select the range of characters represented by the ellipsis.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojIndexer
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
 *       <td rowspan = "3" nowrap>Indexer Prefix</td>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move focus to the prefix below.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Move focus to the prefix above.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Selects the current prefix.  No op if the item is already selected.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojIndexer
 */

//////////////////     SUB-IDS     //////////////////

/**
 * <p>Sub-ID for the ojIndexer component.  See the <a href="#getNodeBySubId">getNodeBySubId</a>
 * method for details.</p>
 *
 * @ojsubid oj-indexer-prefix
 * @memberof oj.ojIndexer
 *
 * @example <caption>Get the node that represents the specified prefix 'A' in the indexer:</caption>
 * var node = $( ".selector" ).ojIndexer( "getNodeBySubId", {'subId': 'oj-indexer-prefix', 'prefix': 'A'} );
 */

    });

}() );
/**
 * Implementation of the IndexerModel used by ListView.
 * @export
 * @param {Object} listview the internal ListView instance
 * @class oj.ListViewIndexerModel
 * @implements oj.IndexerModel
 * @classdesc Implementation of IndexerModel used by ListView. 
 * @extends oj.EventSource
 * @constructor
 * @ignore
 */
oj.ListViewIndexerModel = function(listview)
{
    this.listview = listview;
    this.Init();
};

// Subclass from oj.EventSource 
oj.Object.createSubclass(oj.ListViewIndexerModel, oj.EventSource, "oj.ListViewIndexerModel");

/**
 * @export
 * Returns the prefixes displayed by the Indexer.
 * @returns {Array.<string>} an array of prefixes
 * @memberof! oj.ListViewIndexerModel
 */
oj.ListViewIndexerModel.prototype.getIndexablePrefixes = function()
{
    var prefixes = this.listview.ojContext.getTranslatedString("indexerCharacters");
    return prefixes.split("|");
};

/**
 * @export
 * Returns the prefixes that are currently available.  When associated with a ListView, these prefixes are the ones that have a
 * corresponding group header.  Note that this set is based on the group headers that are currently fetched so it might not be complete.   
 * @return {Array.<string>} an array of prefixes that are available.
 * @memberof! oj.ListViewIndexerModel
 */
oj.ListViewIndexerModel.prototype.getPrefixes = function()
{
    if (this.availablePrefixes == null)
    {
        this.availablePrefixes = this._getAvailablePrefixes();
    }

    return this.availablePrefixes;
};

/**
 * Returns the prefixes that are currently available.
 * @private
 */
oj.ListViewIndexerModel.prototype._getAvailablePrefixes = function()
{
    var results = [];

    var groupItems = this.listview._getGroupItemsCache();
    if (groupItems != null)
    {
        var prefixes = this.getIndexablePrefixes();
        for (var i=0; i<prefixes.length; i++)
        {
            var prefix = prefixes[i];
            groupItems.each(function(index) 
            {
                var content = $(this).text();
                if (content.indexOf(prefix) == 0)
                {
                    results.push(prefix);
                    return false;
                }            
            });
        }
    }

    return results;
};

/**
 * @export
 * Sets the current prefix.  When associated with a ListView, this will scroll the ListView to the corresponding group header.
 * @param {String} prefix the current prefix
 * @return {Promise} a Promise object which when resolve will return the prefix that the IndexerModel actually sets as current.
 * @memberof! oj.ListViewIndexerModel
 */
oj.ListViewIndexerModel.prototype.setPrefix = function(prefix)
{
    if (prefix == oj.IndexerModel.PREFIX_OTHERS)
    {
        return this._setOtherPrefix();
    }
    else
    {
        return this._setPrefix(prefix);
    }
};

/**
 * Sets the 'Other' prefix as current
 * @private
 */
oj.ListViewIndexerModel.prototype._setOtherPrefix = function()
{
    var prefixes, self = this, match, groupItems, content, i, prefix;

    prefixes = this.getIndexablePrefixes();

    return new Promise(function(resolve, reject) 
    {
        match = null;
        groupItems = self.listview._getGroupItemsCache();
        if (groupItems != null)
        {
            // find the group header that DOES NOT match ANY of the prefixes
            groupItems.each(function(index) 
            {
                content = $(this).text();
                for (i=0; i<prefixes.length; i++)
                {
                    prefix = prefixes[i];
                    if (content.indexOf(prefix) == 0)
                    {
                        // skip and check next group header
                        return true;
                    }            
                }

                match = this;
                return false;
            });
        }    

        if (match)
        {
            self.listview._scrollToGroupHeader(match);
            resolve(oj.IndexerModel.PREFIX_OTHERS);
        }
        else
        {
            resolve(null);
        }
    });
};

/**
 * Sets the specified prefix as current.
 * @private
 */
oj.ListViewIndexerModel.prototype._setPrefix = function(prefix)
{
    var prefixes, index, self = this, match = null, groupHeader;

    prefixes = this.getIndexablePrefixes();
    index = prefixes.indexOf(prefix);

    return new Promise(function(resolve, reject) 
    {
        if (index == -1)
        {
            // if it's not even in the indexable prefixes, then we don't need to process anymore
            resolve(null);
        }
        else
        {
            // try to find the group header, use the next prefix as needed
            while (index < prefixes.length)
            {
                prefix = prefixes[index];
                groupHeader = self._findGroupHeader(prefix);
                if (groupHeader != null)
                {
                    self.listview._scrollToGroupHeader(groupHeader);
                    match = prefix;
                    break;
                }

                index++;
            }

            resolve(match);
        }
    });
};

/**
 * Finds the group header with the specified prefix
 * @private
 */
oj.ListViewIndexerModel.prototype._findGroupHeader = function(prefix)
{
    var match, groupItems, content;

    groupItems = this.listview._getGroupItemsCache();
    if (groupItems != null)
    {
        groupItems.each(function(index) 
        {
            content = $(this).text();
            if (content.indexOf(prefix) == 0)
            {
                match = this;
                return false;
            }            
        });
    }

    return match;
};

/**
 * Fires a change event to its listeners
 * @protected
 */
oj.ListViewIndexerModel.prototype.fireChangeEvent = function()
{
    this.availablePrefixes = null;
    this.handleEvent(oj.IndexerModel.EventType['CHANGE'], {});
};
/*jslint browser: true,devel:true*/
/**
 * The interface for oj.IndexerModel which should be implemented by all object instances
 * bound to the data parameter for ojIndexer. oj.IndexerModel implementations should
 * also support event subscription by extending oj.EventSource or oj.DataSource.
 * @export
 * @interface
 */
oj.IndexerModel = function()
{
};

/**
 * Constant for the prefix that represents all non-letters including numbers and symbols.
 * @export
 * @expose
 * @memberof! oj.IndexerModel
 * @instance
 */
oj.IndexerModel.PREFIX_OTHERS = '__others__';

/**
 * @export
 * Event types
 * @enum {string}
 */
oj.IndexerModel.EventType =
{
    /**
     * Triggered when the underlying model has changed.
     */
    'CHANGE': 'change'
};

/**
 * Sets the current prefix.  When associated with a ListView, this will scroll the ListView to the corresponding group header.
 * @param {String} prefix the current prefix
 * @return {Promise} a Promise object which when resolve will return the prefix that the IndexerModel actually sets as current.
 * @export
 * @expose
 * @memberof! oj.IndexerModel
 * @instance
 */
oj.IndexerModel.prototype.setPrefix = function(prefix)
{
};

/**
 * Returns the prefixes displayed by the Indexer.  For example, the alphabets of a particular language.
 * @returns {Array.<string>} an array of prefixes
 * @export
 * @expose
 * @memberof! oj.IndexerModel
 * @instance
 */
oj.IndexerModel.prototype.getIndexablePrefixes = function()
{
};

/**
 * Returns the prefixes that are currently available.  When associated with a ListView, these prefixes are the ones that have a
 * corresponding group header.  Note that this set is based on the group headers that are currently fetched so it might not be complete.   
 * @return {Array.<string>} an array of prefixes that are available.
 * @export
 * @expose
 * @memberof! oj.IndexerModel
 * @instance
 */
oj.IndexerModel.prototype.getPrefixes = function()
{
};
});
