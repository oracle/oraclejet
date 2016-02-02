define([], function() {
  // Internal use only.  All APIs and functionality are subject to change at any time.
  
/**
 * @preserve Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * This class contains all utility methods used by the Grid.
 * @param {Object} dataGrid the dataGrid using the utils
 * @constructor
 */
var DvtDataGridUtils = function(dataGrid)
{
    this.scrollbarSize = -1;
    this.dataGrid = dataGrid;

    var userAgent = (navigator && navigator.userAgent) ? navigator.userAgent.toLowerCase() : null;

    this.os = this._determineOS(userAgent);
    this.platform = this._determinePlatform(userAgent);
};

// Platform Constants
DvtDataGridUtils.IE_PLATFORM = "ie";
DvtDataGridUtils.GECKO_PLATFORM = "gecko";
DvtDataGridUtils.WEBKIT_PLATFORM = "webkit";
DvtDataGridUtils.UNKNOWN_PLATFORM = "unknown";
DvtDataGridUtils.EDGE_PLATFORM = "edge";

// OS Constants
DvtDataGridUtils.WINDOWS_OS = "Windows";
DvtDataGridUtils.SOLARIS_OS = "Solaris";
DvtDataGridUtils.MAC_OS = "Mac";
DvtDataGridUtils.UNKNOWN_OS = "Unknown";

// @internal
DvtDataGridUtils.prototype.calculateScrollbarSize = function()
{
    // Create the measurement node
    var scrollDiv = document.createElement("div");
    scrollDiv.style.cssText = "width:100px;height:100px;overflow:scroll;position:absolute;top:-9999px;";
    document.body.appendChild(scrollDiv); //@HTMLUpdateOK

    // Get the scrollbar width/height
    this.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    // Delete the DIV
    document.body.removeChild(scrollDiv);
};

/**
 * Gets the size of the native scrollbar
 */
DvtDataGridUtils.prototype.getScrollbarSize = function()
{
    if (this.scrollbarSize == -1)
    {
        this.calculateScrollbarSize();
    }
    return this.scrollbarSize;
};

/**
 * Determine if the current agent is touch device
 */
DvtDataGridUtils.prototype.isTouchDevice = function()
{
    if (this.isTouch == undefined)
    {
        var agentName = navigator.userAgent.toLowerCase();
        if (agentName.indexOf("mobile") != -1 || agentName.indexOf("android") != -1)
        {
            this.isTouch = true;
        }
        else
        {
            this.isTouch = false;
        }
    }
    return this.isTouch;
};

/**
 * Copied from AdfDhtmlCommonUtils used in Faces
 * Adds a CSS className to the dom node if it doesn't already exist in the classNames list and
 * returns <code>true</code> if the class name was added.
 * @param {HTMLElement|null} domElement DOM Element to add style class name to
 * @param {string|null} className Name of style class to add
 * @return {boolean|null} <code>true</code> if the style class was added
 */
DvtDataGridUtils.prototype.addCSSClassName = function(domElement, className)
{
    var added, currentClassName, classNameIndex, newClassName;
    added = false;

    if (className != null && domElement != null)
    {
        currentClassName = domElement.className;

        // get the current location of the className to add in the classNames list
        classNameIndex = DvtDataGridUtils._getCSSClassNameIndex(currentClassName, className);

        // the className doesn't exist so add it
        if (classNameIndex == -1)
        {
            newClassName = currentClassName
                    ? className + " " + currentClassName
                    : className;

            domElement.className = newClassName;

            added = true;
        }
    }

    return added;
};

/**
 * Copied from AdfDhtmlCommonUtils used in Faces
 * Removes a CSS className to the dom node if it existd in the classNames list and
 * returns <code>true</code> if the class name was removed.
 * @param {HTMLElement|null} domElement DOM Element to remove style class name from
 * @param {string|null} className Name of style class to remove
 * @return {boolean|null} <code>true</code> if the style class was removed
 */
DvtDataGridUtils.prototype.removeCSSClassName = function(domElement, className)
{
    var removed, currentClassName, classNameIndex, classNameEndIndex, beforestring, afterstring, newClassName;
    removed = false;

    if (className != null && domElement != null)
    {
        currentClassName = domElement.className;

        classNameIndex = DvtDataGridUtils._getCSSClassNameIndex(currentClassName, className);

        // only need to do work if CSS class name is present
        if (classNameIndex != -1)
        {
            classNameEndIndex = classNameIndex + className.length;

            // the new classNames string is the string before our className and leading whitespace plus
            // the string after our className and trailing whitespace
            beforestring = (classNameIndex == 0)
                    ? null
                    : currentClassName.substring(0, classNameIndex);
            afterstring = (classNameEndIndex == currentClassName.length)
                    ? null
                    : currentClassName.substring(classNameEndIndex + 1); // skip space

            if (beforestring == null)
            {
                if (afterstring == null)
                {
                    newClassName = "";
                }
                else
                {
                    newClassName = afterstring;
                }
            }
            else
            {
                if (afterstring == null)
                {
                    newClassName = beforestring;
                }
                else
                {
                    newClassName = beforestring + afterstring;
                }
            }

            domElement.className = newClassName;

            removed = true;
        }
    }

    return removed;
};

/**
 * @param {HTMLElement|Element|EventTarget|null} domElement DOM Element to check for the style <code>className</code>
 * @param {string} className the CSS className to check for
 * @return {boolean} <code>true</code> if the className is in the element's list of classes
 */
DvtDataGridUtils.prototype.containsCSSClassName = function(domElement, className)
{
    if (className != null && domElement != null)
    {
        return DvtDataGridUtils._getCSSClassNameIndex(domElement.className, className) != -1;
    }
    return false;
};

/**
 * Copied from AdfDhtmlCommonUtils used in Faces
 * Returns the index at which <code>className</code> appears within <code>currentClassName</code>
 * with either a space or the beginning or end of <code>currentClassName</code> on either side.
 * This function optimizes the runtime speed by not creating objects in most cases and assuming
 * 1) It is OK to only check for spaces as whitespace characters
 * 2) It is rare for the searched className to be a substring of another className, therefore
 *    if we get a hit on indexOf, we have almost certainly found our className
 * 3) It is even rarer for the searched className to be a substring of more than one className,
 *    therefore, repeating the search from the end of the string should almost always either return
 *    our className or the original search hit from indexOf
 * @param {string} currentClassName Space-separated class name string to search
 * @param {string} className string to search for within currentClassName
 * @return {number} index of className in currentClassName, or -1 if it doesn't exist
 */
DvtDataGridUtils._getCSSClassNameIndex = function(currentClassName, className)
{
    var classNameLength, currentClassNameLength, nameIndex, hasStart, endIndex, hasEnd, lastNameIndex;
    // if no current class
    // SVG element className property is not of type string
    if (!currentClassName || !currentClassName.indexOf)
    {
        return -1;
    }

    // if the strings are equivalent, then the start index is the beginning of the string
    if (className === currentClassName)
    {
        return 0;
    }

    classNameLength = className.length;
    currentClassNameLength = currentClassName.length;

    // check if our substring exists in the string at all
    nameIndex = currentClassName.indexOf(className);

    // if our substring exists then our class exists if either:
    // 1) It is at the beginning of the classNames string and has a following space
    // 2) It is at the end of the classNames string and has a leading space
    // 3) It has a space on either side
    if (nameIndex >= 0)
    {
        hasStart = (nameIndex == 0) || (currentClassName.charAt(nameIndex - 1) == " ");
        endIndex = nameIndex + classNameLength;
        hasEnd = (endIndex == currentClassNameLength) || (currentClassName.charAt(endIndex) == " ");

        //one of the three condition above has been met so our string is in the parent string
        if (hasStart && hasEnd)
        {
            return nameIndex;
        }

        // our substring exists in the parent string but didn't meet the above conditions,  Were
        // going to be lazy and retest, searchig for our substring from the back of the classNames
        // string
        lastNameIndex = currentClassName.lastIndexOf(className);

        // if we got the same index as the search from the beginning then we aren't in here
        if (lastNameIndex != nameIndex)
        {
            // recheck the three match cases
            hasStart = currentClassName.charAt(lastNameIndex - 1);
            endIndex = lastNameIndex + classNameLength;
            hasEnd = (endIndex == currentClassNameLength) || (currentClassName.charAt(endIndex) == " ");

            if (hasStart && hasEnd)
            {
                return lastNameIndex;
            }

            // this should only happen if the searched for className is a substring of more
            // than one className in the classNames list, so it is OK for this to be slow.  We
            // also know at this point that we definitely didn't get a match at either the very
            // beginning or very end of the classNames string, so we can safely append spaces
            // at either end
            return currentClassName.indexOf(" " + className + " ");

        }
    }


    // no match
    return -1;


};

/**
 * Returns either the ctrl key or the command key in Mac OS
 * @param {Event} event
 */
DvtDataGridUtils.prototype.ctrlEquivalent = function(event)
{
    var isMac = (this.os === DvtDataGridUtils.MAC_OS);
    return (isMac ? event.metaKey : event.ctrlKey);
};

/**
 * Gets the scroll left of an element.  This method abstracts the inconsistency of scrollLeft
 * behavior in RTL mode between browsers.
 * @param {Element} element the dom element to retrieve scroll left
 * @private
 */
DvtDataGridUtils.prototype.getElementScrollLeft = function(element)
{
    var width, elemWidth;
    if (this.dataGrid.getResources().isRTLMode())
    {
        // see mozilla Bug 383026 scrollLeft property now returns negative values in rtl environment
        if (this.platform == DvtDataGridUtils.GECKO_PLATFORM || this.platform == DvtDataGridUtils.IE_PLATFORM || this.platform == DvtDataGridUtils.EDGE_PLATFORM)
        {
            return Math.abs(element['scrollLeft']);
        }
        else
        {
            // webkit browser
            width = this.dataGrid.getScrollableWidth();
            elemWidth = element['clientWidth'];
            return Math.max(0, width - elemWidth - element['scrollLeft']);
        }
    }

    return element['scrollLeft'];

};

/**
 * Sets the scroll left of an element.  This method abstracts the inconsistency of scrollLeft
 * behavior in RTL mode between browsers.
 * @param {Element} element the dom element to set scroll left
 * @param {Number} scrollLeft the scroll left of the dom element
 * @private
 */
DvtDataGridUtils.prototype.setElementScrollLeft = function(element, scrollLeft)
{
    var width, elemWidth, newPos;
    if (this.dataGrid.getResources().isRTLMode())
    {
        if (this.platform === DvtDataGridUtils.GECKO_PLATFORM)
        {
            // see mozilla Bug 383026 scrollLeft property now returns negative values in rtl environment
            element['scrollLeft'] = -scrollLeft;
        }
        else if (this.platform == DvtDataGridUtils.IE_PLATFORM || this.platform == DvtDataGridUtils.EDGE_PLATFORM)
        {
            element['scrollLeft'] = scrollLeft;
        }
        else
        {
            // webkit based browsers
            width = this.dataGrid.getScrollableWidth();
            elemWidth = element['clientWidth'];
            newPos = width - elemWidth - scrollLeft;
            element['scrollLeft'] = newPos;
        }
    }
    else
    {
        element['scrollLeft'] = scrollLeft;
    }
};

/**
 * Determines the operating system. This value should be cached to prevent costly calculations. This value should be
 * treated as a guess, as this code is copied from AdfAgent.guessOS().
 * @param {string} userAgent The lowercase user agent string, if available.
 * @return {string} The DvtDataGridUtils.***_OS constant describing the platform.
 * @private
 */
DvtDataGridUtils.prototype._determineOS = function(userAgent)
{
    if (userAgent)
    {
        if (userAgent.indexOf('win') != -1)
        {
            return DvtDataGridUtils.WINDOWS_OS;
        }
        else if (userAgent.indexOf('mac') != -1)
        {
            return DvtDataGridUtils.MAC_OS;
        }
        else if (userAgent.indexOf('sunos') != -1)
        {
            return DvtDataGridUtils.SOLARIS_OS;
        }
    }

    return DvtDataGridUtils.UNKNOWN_OS;
};

/**
 * Determines the name of the platform. This value should be cached to prevent costly calculations.
 * Copied from DvtAgent (which itself is copied from AdfAgent)
 * @param {string} userAgent The lowercase user agent string, if available.
 * @return {string} The DvtDataGridUtils.***_PLATFORM constant describing the platform.
 * @private
 */
DvtDataGridUtils.prototype._determinePlatform = function(userAgent)
{
    if (userAgent)
    {
        if (userAgent.indexOf("opera") != -1) // check opera first, since it mimics other browsers
        {
            return DvtDataGridUtils.UNKNOWN_PLATFORM;
        }
        else if (userAgent.indexOf("trident") != -1 || userAgent.indexOf("msie") != -1)
        {
            return DvtDataGridUtils.IE_PLATFORM;
        }
        else if (userAgent.indexOf("edge") != -1)
        {
            return DvtDataGridUtils.EDGE_PLATFORM;            
        }
        else if ((userAgent.indexOf("applewebkit") != -1) || (userAgent.indexOf("safari") != -1))
        {
            return DvtDataGridUtils.WEBKIT_PLATFORM;
        }
        else if (userAgent.indexOf("gecko/") != -1)
        {
            return DvtDataGridUtils.GECKO_PLATFORM;
        }
    }

    return DvtDataGridUtils.UNKNOWN_PLATFORM;
};

/**
 * Determines the what mousewheel event the browser recognizes
 * If firefox then DOMMouseScroll else mousewheel
 * @return {string} The event which the browser uses to track mosuewheel events
 * @private
 */
DvtDataGridUtils.prototype.getMousewheelEvent = function()
{
    return this.platform === DvtDataGridUtils.GECKO_PLATFORM ? "DOMMouseScroll" : "mousewheel";
};

/**
 * Determines what mousewheel event the browser recognizes
 * using click-wheel on mouse, always vertical in this case
 * FF 3.X uses event.detail which is the number of clicks
 * 40 mimics what IE 10 and Chrome currently do in scrolling
 * @param {Event} event the mousewheel scroll event
 * @return {Object} change in X and Y if applicable through a mousewheel event, properties are deltaX, deltaY
 * @private
 */
DvtDataGridUtils.prototype.getMousewheelScrollDelta = function(event)
{
    var deltaX, deltaY;
    //Mac touchpad case
    if (event.wheelDeltaX)
    {
        deltaX = event.wheelDeltaX;
        deltaY = event.wheelDeltaY;
    }
    else
    {
        deltaX = 0;
        deltaY = event.detail ? event.detail * (-40) : event.wheelDelta;
    }

    return {"deltaX": deltaX, "deltaY": deltaY};
};

/**
 * Empty out (clear all children and attributes) from an element
 * @param {Element} elem the dom element to empty out
 * @private
 */
DvtDataGridUtils.prototype.empty = function(elem)
{
    while (elem.firstChild)
    {
        this.dataGrid._remove(elem.firstChild);
    }
};

/**
 * Does the browser support transitions
 * @private
 */
DvtDataGridUtils.prototype.supportsTransitions = function() {
    var b = document.body || document.documentElement,
            s = b.style,
            p = 'transition',
            ieBefore11 = /MSIE \d/.test(navigator.userAgent) &&
            (document.documentMode == null || document.documentMode < 11);

    if (ieBefore11)
    {
        return false;
    }

    if (typeof s[p] == 'string') {
        return true;
    }

    // Tests for vendor specific prop
    var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
    p = p.charAt(0).toUpperCase() + p.substr(1);

    for (var i = 0; i < v.length; i++)
    {
        if (typeof s[v[i] + p] == 'string') {
            return true;
        }
    }

    return false;
};

/**
 * Return whether the node is editable or clickable
 * @param {Element} node  Node
 * @param {Element} databody  Databody
 * @return {boolean} true or false
 * @private
 */
DvtDataGridUtils.prototype._isNodeEditableOrClickable = function(node, databody)
{
    var nodeName, tabIndex, origTabIndex;
    while (null != node && node != databody)
    {
        nodeName = node.nodeName;

        // If the node is a text node, move up the hierarchy to only operate on elements
        // (on at least the mobile platforms, the node may be a text node)
        if (node.nodeType == 3) // 3 is Node.TEXT_NODE
        {
            node = node.parentNode;
            continue;
        }

        tabIndex = parseInt(node.getAttribute('tabIndex'), 10);
        // datagrid overrides the tab index, so we should check if the data-oj-tabindex is populated
        origTabIndex = parseInt(node.getAttribute(this.dataGrid.getResources().getMappedAttribute('tabindex')), 10);

        if (tabIndex != null && tabIndex >= 0)
        {
            if (this.containsCSSClassName(node, this.dataGrid.getResources().getMappedStyle('cell'))
                    || this.containsCSSClassName(node, this.dataGrid.getResources().getMappedStyle('headercell')))
            {
                // this is the cell element
                return false;
            }
            else
            {
                return true;
            }
        }
        else if (nodeName.match(/^INPUT|SELECT|OPTION|BUTTON|^A\b|TEXTAREA/))
        {
            // ignore elements with tabIndex == -1
            if (tabIndex != -1 || origTabIndex != -1)
            {
                return true;
            }
        }
        node = node.parentNode;
    }
    return false;
};
/**
 * The DvtDataGridOptions object provides convenient methods to access the options passed to the Grid.
 * @constructor
 * @param {Object=} options -options set on the grid.
 */
var DvtDataGridOptions = function(options)
{
    this.options = options;
};

/**
 * Helper method to extract properties
 * @param {string=} arg1 - key to extract in object
 * @param {string=} arg2 - key to extract in the value of object[arg1]
 * @param {string=} arg3 - key to extract in the value of object[arg1][arg2]
 * @param {string=} arg4 - key to extract in the value of object[arg1][arg2][arg3]
 * @return {string|number|Object|boolean|null}
 */
DvtDataGridOptions.prototype.extract = function(arg1, arg2, arg3, arg4)
{
    var val1, val2, val3;
    if (arg1 != null)
    {
        val1 = this.options[arg1];
        if (arg2 != null && val1 != null)
        {
            val2 = val1[arg2];
            if (arg3 != null && val2 != null)
            {
                val3 = val2[arg3];
                if (arg4 != null && val3 != null)
                {
                    return val3[arg4];
                }
                return val3;
            }
            return val2;
        }
        return val1;
    }
    return null;
};

/**
 * Evaluate the a function, if it is a constant return it
 * @param {string|number|Object|boolean|null} value - function or string of the raw property
 * @param {Object} obj - object to pass into value if it is a function
 * @return {string|number|Object|boolean|null} the evaluated value(obj) if value a function, else return value
 */
DvtDataGridOptions.prototype.evaluate = function(value, obj)
{
    if (typeof value == 'function')
    {
        return value.call(this, obj);
    }
    return value;
};

/**
 * Get the property that was set on the option
 * @param {string} prop - the property to get from options
 * @param {string} axis - subobject to get row/column/cell
 * @return {string|number|Object|boolean|null} the raw value of the property
 */
DvtDataGridOptions.prototype.getRawProperty = function(prop, axis)
{
    var arg1, arg2, arg3;
    if (axis == "row" || axis == "column")
    {
        arg1 = "header";
        arg2 = axis;
        arg3 = prop;
    }
    else if (axis == "cell")
    {
        arg1 = "cell";
        arg2 = prop;
    }

    return this.extract(arg1, arg2, arg3);
};

/**
 * Get the evaluated property of the options
 * @param {string} prop - the property to get from options
 * @param {string} axis - subobject to get row/column/cell
 * @param {Object} obj - object to pass into property if it is a function
 * @return {string|number|Object|boolean|null} the evaluated property
 */
DvtDataGridOptions.prototype.getProperty = function(prop, axis, obj)
{
    if (obj === undefined)
    {
        return this.extract(prop, axis);
    }
    else
    {
        return this.evaluate(this.getRawProperty(prop, axis), obj);
    }
};

/**
 * Get the null or default value if no value set
 * @param {string|number|Object|boolean|null} value - the value of the property
 * @param {boolean|null} defValue - the default value of the property
 * @return {string|number|Object|boolean|null} - value if not null, defValue if value is null, null if neither null
 */
DvtDataGridOptions.prototype.nullOrDefault = function(value, defValue)
{
    if (value != null)
    {
        return value;
    }
    if (defValue != null)
    {
        return defValue;
    }
    return null;
};

////////////////////////// Grid options /////////////////////////////////

/**
 * Get the row banding interval from the grid options
 * @return {string|number|Object|boolean} the row banding interval
 */
DvtDataGridOptions.prototype.getRowBandingInterval = function()
{
    var bandingInterval = this.getProperty("bandingInterval", "row");
    if (bandingInterval != null)
    {
        return bandingInterval;
    }
    return 0;
};

/**
 * Get the column banding interval from the grid options
 * @return {string|number|Object|boolean} the column banding interval
 */
DvtDataGridOptions.prototype.getColumnBandingInterval = function()
{
    var bandingInterval = this.getProperty("bandingInterval", "column");
    if (bandingInterval != null)
    {
        return bandingInterval;
    }
    return 0;
};

/**
 * Get the empty text from the grid options
 * @return {string|number|Object|boolean|null} the empty text
 */
DvtDataGridOptions.prototype.getEmptyText = function()
{
    return this.getProperty("emptyText");
};

/**
 * Get the horizontal gridlines from the grid options
 * @return {string|number|Object|boolean|null} horizontal gridlines visible/hidden
 */
DvtDataGridOptions.prototype.getHorizontalGridlines = function()
{
    var horizontalGridlines;
    horizontalGridlines = this.extract("gridlines", "horizontal");
    if (horizontalGridlines != null)
    {
        return horizontalGridlines;
    }
    return "visible";
};

/**
 * Get the vertical gridlines from the grid options
 * @return {string|number|Object|boolean|null} vertical gridlines visible/hidden
 */
DvtDataGridOptions.prototype.getVerticalGridlines = function()
{
    var verticalGridlines;
    verticalGridlines = this.extract("gridlines", "vertical");
    if (verticalGridlines != null)
    {
        return verticalGridlines;
    }
    return "visible";
};

/**
 * Get the inital row scroll position from the grid options
 * @return {string|number|Object|boolean|null} index or key of the row to show
 */
DvtDataGridOptions.prototype.getRowScrollPosition = function()
{
    var rowScrollPosition;
    rowScrollPosition = this.extract("scrollPosition", "key", "row");
    if (rowScrollPosition != null)
    {
        return rowScrollPosition;
    }
    return this.extract("scrollPosition", "index", "row");
};

/**
 * Get the inital column scroll position from the grid options
 * @return {string|number|Object|boolean|null} index or key of the column to show
 */
DvtDataGridOptions.prototype.getColumnScrollPosition = function()
{
    var columnScrollPosition;
    columnScrollPosition = this.extract("scrollPosition", "key", "column");
    if (columnScrollPosition != null)
    {
        return columnScrollPosition;
    }
    return this.extract("scrollPosition", "index", "column");
};

/**
 * Get the inital column scroll position from the grid options
 * @return {string|number|Object|boolean|null} index or key of the column to show
 */
DvtDataGridOptions.prototype.getScrollPositionMode = function()
{
    var scrollPosition;
    scrollPosition = this.getProperty("scrollPosition");
    if (scrollPosition == undefined)
    {
        return null;
    }
    if (scrollPosition['key'] != undefined)
    {
        return 'key';
    }
    if (scrollPosition['index'] != undefined)
    {
        return 'index';
    }
    return null;
};

/**
 * Get the selection mode cardinality (none, single multiple)
 * @return {string|number|Object|boolean|null} none/single/multiple
 */
DvtDataGridOptions.prototype.getSelectionCardinality = function()
{
    var mode, key, val;
    mode = this.getProperty("selectionMode");
    if (mode == undefined)
    {
        return "none";
    }

    key = this.getSelectionMode();
    val = mode[key];
    if (val != null)
    {
        return val;
    }
    return "none";
};

/**
 * Get the selection mode (row,cell)
 * @return {string|number|Object|boolean|null} row/cell
 */
DvtDataGridOptions.prototype.getSelectionMode = function()
{
    var mode, cardinality;
    mode = this.getProperty("selectionMode");
    if (mode == undefined)
    {
        return "cell";
    }

    cardinality = mode['row'];
    if (cardinality != null && cardinality != "none")
    {
        return "row";
    }
    return "cell";
};

/**
 * Get the current selection from the grid options
 * @return {Array|null} the current selection from options
 */
DvtDataGridOptions.prototype.getSelection = function()
{
    return this.getProperty("selection");
};

/**
 * Get the current cell from the grid options
 * @return {Object|null} the current cell from options
 */
DvtDataGridOptions.prototype.getCurrentCell = function()
{
    return this.getProperty("currentCell");
};
////////////////////////// Grid header/cell options /////////////////////////////////
/**
 * Is the given header sortable
 * @param {string} axis - axis to check if sort enabled
 * @param {Object} obj - header context
 * @return {string|number|Object|boolean|null} default or null
 */
DvtDataGridOptions.prototype.isSortable = function(axis, obj)
{
    return this.nullOrDefault(this.getProperty("sortable", axis, obj), false);
};

/**
 * Is the given header resizable
 * @param {string} axis - axis to check if resizing enabled
 * @param {Object} dir - width/height
 * @return {string|number|Object|boolean|null} enable, disable, or null
 */
DvtDataGridOptions.prototype.isResizable = function(axis, dir, obj)
{
    var v = this.extract('header', axis, 'resizable', dir);
    if (obj != undefined)
    {
        return this.evaluate(v, obj);
    }
    return v;
};

/**
 * Gets the dnd rorderable option
 * @param {string} axis the axis to get the reorder property from
 * @return {string|number|Object|boolean|null} enable, disable, or null
 */
DvtDataGridOptions.prototype.isMoveable = function(axis)
{
    return this.nullOrDefault(this.extract("dnd", "reorder", axis), false);
};

/**
 * Get the inline style property on an object
 * @param {string} axis - axis to get style of
 * @param {Object} obj - context
 * @return {string|number|Object|boolean|null} inline style
 */
DvtDataGridOptions.prototype.getInlineStyle = function(axis, obj)
{
    return this.getProperty("style", axis, obj);
};

/**
 * Get the style class name property on an object
 * @param {string} axis - axis to get class name of
 * @param {Object} obj - context
 * @return {string|number|Object|boolean|null} class name
 */
DvtDataGridOptions.prototype.getStyleClass = function(axis, obj)
{
    return this.getProperty("className", axis, obj);
};

/**
 * Get the renderer of an axis
 * @param {string} axis - axis to get style of
 * @return {string|number|Object|boolean|null} axis renderer
 */
DvtDataGridOptions.prototype.getRenderer = function(axis)
{
    // return type expected to be function, so just return without further
    // evaluation
    return this.getRawProperty("renderer", axis);
};

/**
 * Get the scroll mode
 * @return {string} the scroll mode, which can be either "scroll", "loadMoreOnScroll", "auto".
 */
DvtDataGridOptions.prototype.getScrollPolicy = function()
{
    var mode = this.getProperty("scrollPolicy");
    if (mode == null)
    {
        mode = "auto";
    }

    return mode;
};
/**
 * Class used to keep track of whcih elements have been resized, has an object
 * containing two objects 'row' and 'column', which should have objects of
 * index:{size}. this.sizes = {axis:{index:{size}}}
 * @constructor
 */
var DvtDataGridSizingManager = function()
{
    this.sizes = {'column': {}, 'row': {}};
};

/**
 * Set a size in the sizes object in the sizing manager
 * @param {string} axis - column/row
 * @param {number} headerKey - key of the element
 * @param {number} size - the size to put in the object
 */
DvtDataGridSizingManager.prototype.setSize = function(axis, headerKey, size)
{
    this.sizes[axis][headerKey] = size;
};

/**
 * Get a size from the sizing manager for a given axis and index,
 * @param {string} axis - column/row
 * @param {number} headerKey - key of the element
 * @return {number|null} a size if it exists
 */
DvtDataGridSizingManager.prototype.getSize = function(axis, headerKey)
{
    if (this.sizes[axis].hasOwnProperty(headerKey)) {
        return this.sizes[axis][headerKey];
    }
    return null;
};

/**
 * Empty the sizing manager sizes
 */
DvtDataGridSizingManager.prototype.clear = function()
{
    this.sizes = {'column': {}, 'row': {}};
};
/**
 * Creates a new DataGrid
 * @constructor
 * @export
 */
var DvtDataGrid = function()
{
    this.MAX_COLUMN_THRESHOLD = 20;
    this.MAX_ROW_THRESHOLD = 30;

    this.m_utils = new DvtDataGridUtils(this);

    this.m_discontiguousSelection = false;

    this.m_sizingManager = new DvtDataGridSizingManager();

    this.m_rowHeaderWidth = null;
    this.m_colHeaderHeight = null;

    // a mapping of style class+inline style combo to a dimension
    // to reduce the need to do excessive offsetWidth/offsetHeight
    this.m_styleClassDimensionMap = {};

    this.m_stopDatabodyScroll = false;
    this.m_captureScrolling = false;

    // cached whether row/column count are unknown
    this.m_isEstimateRowCount = undefined;
    this.m_isEstimateColumnCount = undefined;
    this.m_stopRowFetch = false;
    this.m_stopRowHeaderFetch = false;
    this.m_stopColumnFetch = false;
    this.m_stopColumnHeaderFetch = false;

    // not done initializing until initial headers/cells are fetched
    this.m_initialized = false;

    this.callbacks = {};

    this.m_readinessStack = [];
};

// constants for key codes
DvtDataGrid.DOWN_KEY = 40;
DvtDataGrid.UP_KEY = 38;
DvtDataGrid.LEFT_KEY = 37;
DvtDataGrid.RIGHT_KEY = 39;
DvtDataGrid.F10_KEY = 121;
DvtDataGrid.X_KEY = 88;
DvtDataGrid.V_KEY = 86;
DvtDataGrid.TAB_KEY = 9;
DvtDataGrid.HOME_KEY = 36;
DvtDataGrid.END_KEY = 35;
DvtDataGrid.PAGEUP_KEY = 33;
DvtDataGrid.PAGEDOWN_KEY = 34;
DvtDataGrid.NUM5_KEY = 53;

// constants for update animation
DvtDataGrid.UPDATE_ANIMATION_FADE_INOUT = 1;
DvtDataGrid.UPDATE_ANIMATION_SLIDE_INOUT = 2;
DvtDataGrid.UPDATE_ANIMATION_DURATION = 250;

// constants for expand/collapse animation
DvtDataGrid.EXPAND_ANIMATION_DURATION = 500;
DvtDataGrid.COLLAPSE_ANIMATION_DURATION = 400;

// swipe gesture constants
DvtDataGrid.MAX_OVERSCROLL_PIXEL = 50;
DvtDataGrid.BOUNCE_ANIMATION_DURATION = 500;
DvtDataGrid.DECELERATION_FACTOR = 0.0006;
DvtDataGrid.TAP_AND_SCROLL_RESET = 300;
DvtDataGrid.MIN_SWIPE_DURATION = 200;
DvtDataGrid.MAX_SWIPE_DURATION = 400;
DvtDataGrid.MIN_SWIPE_DISTANCE = 10;

// constants for touch gestures
DvtDataGrid.CONTEXT_MENU_TAP_HOLD_DURATION = 750;
DvtDataGrid.HEADER_TAP_SHORT_HOLD_DURATION = 300;

//visibility constants
/**
 * @export
 */
DvtDataGrid.VISIBILITY_STATE_HIDDEN = 'hidden';
/**
 * @export
 */
DvtDataGrid.VISIBILITY_STATE_REFRESH = 'refresh';
/**
 * @export
 */
DvtDataGrid.VISIBILITY_STATE_RENDER = 'render';
/**
 * @export
 */
DvtDataGrid.VISIBILITY_STATE_VISIBLE = 'visible';

/**
 * Sets options on DataGrid
 * @export
 * @param {Object} options - the options to set on the data grid
 */
DvtDataGrid.prototype.SetOptions = function(options)
{
    this.m_options = new DvtDataGridOptions(options);
};

/**
 * Update options on DataGrid
 * @export
 * @param {Object} options - the options to set on the data grid
 */
DvtDataGrid.prototype.UpdateOptions = function(options)
{
    var candidate;

    //We should check each updated option (candidate) from the list of updated options (first loop)
    //against options already presented in the internal DvtDataGridOptions (this.m_options) object in
    //purpose to keep them in sync.
    for (candidate in options)
    {
        if (candidate in this.m_options['options'])
        {
            if (this.m_options['options'][candidate] != options[candidate])
            {
                this.m_options['options'][candidate] = options[candidate];
            }
        }
    }
    //now update it
    for (candidate in options)
    {
        if (!this._updateDataGrid(candidate))
        {
            this.empty();
            this.refresh(this.m_root);
            break;
        }
    }
};

/**
 * Partial update for DataGrid
 * @private
 * @param {string} option - the option to update the data grid based on
 * @return {boolean} true if redraw is not required otherwise return false
 */
DvtDataGrid.prototype._updateDataGrid = function(option)
{
    var obj;

    switch (option)
    {
        case "bandingInterval":
            this._removeBanding();
            this.updateColumnBanding();
            this.updateRowBanding();
            break;
        case "gridlines":
            this._updateGridlines();
            break;
        case "scrollPosition":
            this.setInitialScrollPosition();
            break;
        case "selectionMode":
            //Do nothing
            break;
        case "emptyText":
            //Do nothing
            break;
        case "header":
            obj = this.m_options['options']['header'];
            this._updateHeaderOptions(obj);
            break;
        case "selection":
            obj = this.m_options.getSelection();
            this._updateSelection(obj);
            break;
        case "currentCell":
            obj = this.m_options.getCurrentCell();
            this._updateActive(obj);
            break;
        default:
            return false;
    }
    return true;
};

/**
 * Update selection from option
 * @private
 * @param {Object} selection the selection from options
 */
DvtDataGrid.prototype._updateSelection = function(selection)
{
    // selection should not be null
    if (selection == null)
    {
        return;
    }

    // check whether selection is enabled
    if (this._isSelectionEnabled())
    {
        // don't clear the selection so the old one can be passed in
        // sets the new selection
        this.SetSelection(selection);
    }
    else
    {
        // selection is not enable, still need to clear the selection in options
        selection.length = 0;
    }
};

/**
 * Update header option
 * @private
 * @param {Object} obj - the obj is header object
 */
DvtDataGrid.prototype._updateHeaderOptions = function(obj)
{
    var colObj, opt, headers, element, key, refresh;

    //Process the sortable and the resizable options by traversing through
    //the header object: header -> column/row -> sortable or
    //header -> column/row -> resizable -> width/heigh

    //for both sortable and resizable options
    //it process the "enable/disable" values for all columns or
    //function for individual ones.

    //tested for columns only at this moment

    refresh = false;

    for (element in obj)
    {
        if (element == "column" || element == "row")
        {
            if (refresh)
            {
                break;
            }
            if (element == "column")
            {
                if (this.m_colHeader)
                {
                    headers = this.m_colHeader['firstChild']['childNodes'];
                }
            }
            else
            {
                if (this.m_rowHeader)
                {
                    headers = this.m_rowHeader['firstChild']['childNodes'];
                }
            }

            if (headers)
            {
                colObj = obj[element];
                for (opt in colObj)
                {
                    //All redraw if option value is function
                    if (!this._processHeaders(headers, opt, colObj[opt]))
                    {
                        refresh = true;
                        break;
                    }
                }
            }
        }
    }
    if (refresh)
    {
        this.empty();
        this.refresh(this.m_root);
    }
};

/**
 * Helper method to process header relaited options
 * @private
 * @param {array} headers - the array of the grid header objects
 * @param {string} opt - updated option
 * @param {string | function} value - the value of the updated option
 * @return {boolean} false if option value is function otherwise return true
 */
DvtDataGrid.prototype._processHeaders = function(headers, opt, value)
{
    var i, attribute, val;

    attribute = this.getResources().getMappedAttribute(opt);
    val = value;

    if (value['width'])
    {
        val = value['width'];
    }
    else if (value['height'])
    {
        val = value['height'];
    }

    for (i = 0; i < headers.length; i++)
    {
        if (val == 'disable')
        {
            headers[i].setAttribute(attribute, "false");
        }
        else if (val == 'enable')
        {
            headers[i].setAttribute(attribute, "true");
        }
        else // if value is function
        {
            return false;
        }
    }
    return true;
};
/**
 * Update gridlines
 * @private
 */
DvtDataGrid.prototype._updateGridlines = function()
{
    var i, j, row, rowCount, horizontalGridlines, verticalGridlines, rows, dir;

    horizontalGridlines = this.m_options.getHorizontalGridlines();
    verticalGridlines = this.m_options.getVerticalGridlines();
    rows = this.m_databody['firstChild']['childNodes'];
    rowCount = rows.length;
    dir = this.getResources().isRTLMode() ? "right" : "left";
    for (i = 0; i < rowCount; i += 1)
    {
        row = rows[i]['childNodes'];
        for (j = 0; j < row.length; j += 1)
        {
            if (verticalGridlines === 'hidden' || (this._isLastColumn(j + this.m_startCol) && this.getRowHeaderWidth() + this.getElementDir(row[j], dir) + this.calculateColumnWidth(row[j]) >= this.getWidth()))
            {
                if (dir === 'left')
                {
                    row[j]['style']['borderRightStyle'] = 'none';
                }
                else
                {
                    row[j]['style']['borderLeftStyle'] = 'none';
                }
            }
            else
            {
                if (dir === 'left')
                {
                    row[j]['style']['borderRightStyle'] = '';
                }
                else
                {
                    row[j]['style']['borderLeftStyle'] = '';
                }
            }
            if (horizontalGridlines === 'hidden' || (this._isLastRow(i + this.m_startRow) && this.getRowBottom(rows[i], null) >= this.getHeight()))
            {
                row[j]['style']['borderBottomStyle'] = 'none';
            }
            else
            {
                row[j]['style']['borderBottomStyle'] = '';
            }
        }
    }
};

/**
 * Gets options on DataGrid
 * @return {Object} the options set on the data grid
 */
DvtDataGrid.prototype.GetOptions = function()
{
    if (this.m_options == null)
    {
        this.m_options = new DvtDataGridOptions();
    }

    return this.m_options;
};

/**
 * Sets resources on DataGrid
 * @export
 * @param {Object} resources - the resources to set on the data grid
 */
DvtDataGrid.prototype.SetResources = function(resources)
{
    this.m_resources = resources;
};

/**
 * Gets resources from DataGrid
 * @export
 * @return {Object} the resources set on the data grid
 */
DvtDataGrid.prototype.getResources = function()
{
    return this.m_resources;
};

/**
 * Gets start row index from DataGrid
 * @export
 * @return {number} the start row index
 */
DvtDataGrid.prototype.getStartRow = function()
{
    return this.m_startRow;
};

/**
 * Gets start row header index from DataGrid
 * @export
 * @return {number} the start row header index
 */
DvtDataGrid.prototype.getStartRowHeader = function()
{
    return this.m_startRowHeader;
};

/**
 * Gets start column index from DataGrid
 * @export
 * @return {number} the start column index
 */
DvtDataGrid.prototype.getStartColumn = function()
{
    return this.m_startCol;
};

/**
 * Gets start column header index from DataGrid
 * @export
 * @return {number} the start column header index
 */
DvtDataGrid.prototype.getStartColumnHeader = function()
{
    return this.m_startColHeader;
};

/**
 * Gets mapped style from the resources
 * @private
 * @param {string} key the key to get style on
 * @return {string} the style from the resources
 */
DvtDataGrid.prototype.getMappedStyle = function(key)
{
    return this.getResources().getMappedStyle(key);
};

/**
 * Sets the data source on DataGrid
 * @export
 * @param {Object} dataSource - the data source to set on the data grid
 */
DvtDataGrid.prototype.SetDataSource = function(dataSource)
{
    this._removeDataSourceEventListeners();

    if (dataSource != null)
    {
        this.m_handleModelEventListener = this.handleModelEvent.bind(this);
        this.m_handleExpandEventListener = this.handleExpandEvent.bind(this);
        this.m_handleCollapseEventListener = this.handleCollapseEvent.bind(this);

        dataSource.on("change", this.m_handleModelEventListener, this);
        // if it's not flattened datasource, these will be ignored
        dataSource.on("expand", this.m_handleExpandEventListener, this);
        dataSource.on("collapse", this.m_handleCollapseEventListener, this);
    }
    this.m_dataSource = dataSource;
};

/**
 * Gets the data source from the DataGrid
 * @export
 * @return {Object} the data source set on the data grid
 */
DvtDataGrid.prototype.getDataSource = function()
{
    return this.m_dataSource;
};

/**
 * Set the internal visibility of datagrid
 * @param {string} state a string for the visibility
 * @export
 */
DvtDataGrid.prototype.setVisibility = function(state)
{
    this.m_visibility = state;
};

/**
 * Get the internal visibility of datagrid
 * @return {string} visibility
 * @export
 */
DvtDataGrid.prototype.getVisibility = function()
{
    if (this.m_visibility == null)
    {
        if (this.m_root.offsetParent != null)
        {
            this.setVisibility(DvtDataGrid.VISIBILITY_STATE_VISIBLE);
        }
        else
        {
            this.setVisibility(DvtDataGrid.VISIBILITY_STATE_HIDDEN);
        }
    }
    return this.m_visibility;
};

/**
 * Set the callback for remove
 * @param {function} callback a callback for the remove function
 * @export
 */
DvtDataGrid.prototype.SetRemoveCallback = function(callback)
{
    this.m_removeCallback = callback;
};

/**
 * Remove an element from the DOM, if it is not being reattached
 * @param {Element} element the element to remove
 * @export
 */
DvtDataGrid.prototype._remove = function(element)
{
    // check if there is a callback set for remove
    // callback allows jQuery to clean the node on a remove
    if (this.m_removeCallback != null)
    {
        this.m_removeCallback.call(null, element);
    }
    else
    {
        element['parentNode'].removeChild(element);
    }
};

/**
 * Set the callback for creating a when ready promise
 * @param {function} callback a callback for the remove function
 * @export
 */
DvtDataGrid.prototype.SetCreateReadyPromiseCallback = function(callback)
{
    this.m_createReadyPromise = callback;
};

/**
 * Set the callback for resolving a ready promise
 * @param {function} callback a callback for the remove function
 * @export
 */
DvtDataGrid.prototype.SetResolveReadyPromiseCallback = function(callback)
{
    this.m_resolveReadyPromise = callback;
};

/**
  * Invoke whenever a task is started. Moves the component out of the ready state if necessary.
  */
DvtDataGrid.prototype._signalTaskStart = function()
{
    if (this.m_readinessStack)
    {
        if (this.m_readinessStack.length == 0)
        {
            this.m_createReadyPromise();
        }
        this.m_readinessStack.push(1);
    }
};

/**
 * Invoke whenever a task finishes. Resolves the readyPromise if component is ready to move into ready state.
 */
DvtDataGrid.prototype._signalTaskEnd = function()
{
    if (this.m_readinessStack && this.m_readinessStack.length > 0)
    {
        this.m_readinessStack.pop();
        if (this.m_readinessStack.length == 0)
        {
            this.m_resolveReadyPromise();
        }
    }
};

/**
 * Get the indexes from the data source and call back to a function once they are available.
 * The callback should be a function(keys, indexes)
 * @param {Object} keys the keys to find the index of with properties row, column
 * @param {function} callback the callback to pass the keys back to
 * @private
 */
DvtDataGrid.prototype._indexes = function(keys, callback)
{
    var self = this, indexes;
    indexes = this.getDataSource().indexes(keys);
    if (typeof indexes['then'] === 'function')
    {
        // start async indexes call
        self._signalTaskStart();
        indexes.then(function(obj) {
            callback.call(self, obj, keys);
            // end async indexes call
            self._signalTaskEnd();
        }, function()
        {
            callback.call(self, {'row': -1, 'column': -1}, keys);
            // end async indexes call
            self._signalTaskEnd();
        });
    }
    else
    {
        callback.call(self, indexes, keys);
    }
};

/**
 * Get the keys from the data source and call back to a function once they are available.
 * The callback should be a function(indexes, keys)
 * @param {Object} indexes the indexes to find the keys of with properties row, column
 * @param {function} callback the callback to pass the indexes back to
 * @private
 */
DvtDataGrid.prototype._keys = function(indexes, callback)
{
    var self = this, keys;
    keys = this.getDataSource().keys(indexes);
    if (typeof keys['then'] === 'function')
    {
        // start async call
        self._signalTaskStart();
        keys.then(function(obj) {
            callback.call(self, obj, indexes);
            // end async indexes call
            self._signalTaskEnd();
        }, function()
        {
            callback.call(self, {'row': null, 'column': null}, indexes);
            // end async indexes call
            self._signalTaskEnd();
        });
    }
    else
    {
        callback.call(self, keys, indexes);
    }
};

/**
 * Helper method to get keys from the DOM rather than the data source.
 * If the indexes do not exist in the DOM the key will be null for the row/column
 * @param {Object} indexes the indexes to find the keys of with properties row, column
 * @private
 * @return {Object} the keys in an object with row/column
 */
DvtDataGrid.prototype._getLocalKeys = function(indexes)
{
    var keys = {'row': null, 'column': null};

    if (indexes['row'] != null)
    {
        keys['row'] = this._getKey(this.m_databody['firstChild']['childNodes'][indexes['row'] - this.m_startRow]);
    }

    if (indexes['column'] != null)
    {
        keys['column'] = this._getKey(this._getColumnHeaderByIndex(indexes['column'], this.m_ColumnHeaderLevelCount - 1));
    }
    return keys;
};

/**
 * Register a callback when creating the header context or cell context.
 * @param {function(Object)} callback the callback function to inject addition or modify
 *        properties in the context.
 * @export
 */
DvtDataGrid.prototype.SetCreateContextCallback = function(callback)
{
    this.m_createContextCallback = callback;
};

/**
 * Whether high watermark scrolling is used
 * @return {boolean} true if high watermark scrolling is used, false otherwise
 * @private
 */
DvtDataGrid.prototype._isHighWatermarkScrolling = function()
{
    return (this.m_options.getScrollPolicy() != "scroll");
};

/**
 * Destructor method that should be called when the widget is destroyed. Removes event
 * listeners on the document.
 * @export
 */
DvtDataGrid.prototype.destroy = function()
{
    delete this.m_fetching;
    this._removeDataSourceEventListeners();
    this._removeDomEventListeners();
    delete this.m_styleClassDimensionMap;
    this.m_styleClassDimensionMap = {};
};

/**
 * Remove data source event listeners
 * @private
 */
DvtDataGrid.prototype._removeDataSourceEventListeners = function()
{
    if (this.m_dataSource != null)
    {
        this.m_dataSource.off("change", this.m_handleModelEventListener);
        this.m_dataSource.off("expand", this.m_handleExpandEventListener);
        this.m_dataSource.off("collapse", this.m_handleCollapseEventListener);
    }
};

/**
 * Remove dom event listeners
 * @private
 */
DvtDataGrid.prototype._removeDomEventListeners = function()
{
    document.removeEventListener("mousemove", this.m_docMouseMoveListener, false);
    document.removeEventListener("mouseup", this.m_docMouseUpListener, false);
    // unregister all listeners

    if (this.m_root != null)
    {
        if (this.m_handleDatabodyKeyDown)
        {
            this.m_root.removeEventListener("keydown", this.m_handleDatabodyKeyDown, false);
        }
        if (this.m_handleRootFocus)
        {
            this.m_root.removeEventListener("focus", this.m_handleRootFocus, false);
        }
        if (this.m_handleRootBlur)
        {
            this.m_root.removeEventListener("blur", this.m_handleRootBlur, false);
        }
    }
};

/**
 * Get the DataGrid root element
 * @return {Element} the root element
 */
DvtDataGrid.prototype.getRootElement = function()
{
    return this.m_root;
};

/**
 * Get the cached width of the root element. If not cached, sets the cached width.
 * @return {number} the cached width of the root element
 * @protected
 */
DvtDataGrid.prototype.getWidth = function()
{
    if (this.m_width == null)
    {
        //clientWidth since we use border box and care about the content of our root div
        this.m_width = this.getRootElement()['clientWidth'];
    }

    return this.m_width;
};

/**
 * Get the cached height of the root element. If not cached, sets the cached height.
 * @return {number} the cached height of the root element
 * @protected
 */
DvtDataGrid.prototype.getHeight = function()
{
    if (this.m_height == null)
    {
        //clientHeight since we use border box and care about the content of our root div
        this.m_height = this.getRootElement()['clientHeight'];
    }

    return this.m_height;
};

/**
 * Gets the scrollable width of the grid.
 * @return {number} the scrollable width of the grid
 * @protected
 */
DvtDataGrid.prototype.getScrollableWidth = function()
{
    var scrollerContent = this.m_scroller['firstChild'];
    return this.getElementWidth(scrollerContent);
};

/**
 * Get the viewport width, which is defined as 1.5 the size of the width of Grid
 * @return {number} the viewport width
 */
DvtDataGrid.prototype.getViewportWidth = function()
{
    var width = this.getWidth();
    return Math.round(width * 1.5);
};

/**
 * Get the viewport height, which is defined as 1.5 the size of the height of Grid
 * @return {number} the viewport height
 */
DvtDataGrid.prototype.getViewportHeight = function()
{
    var height = this.getHeight();
    return Math.round(height * 1.5);
};

/**
 * Calculate the fetch size for rows or columns
 * @param {string} axis - the axis 'row'/'column' to get fetch size on
 * @return {number} the fetch size
 */
DvtDataGrid.prototype.getFetchSize = function(axis)
{
    // get the cached fetch size, this should be clear when the size changes
    if (axis == "row")
    {
        if (this.m_rowFetchSize == null)
        {
            this.m_rowFetchSize = Math.round(this.getViewportHeight() / this.getDefaultRowHeight());
        }

        return this.m_rowFetchSize;
    }
    if (axis == "column")
    {
        if (this.m_columnFetchSize == null)
        {
            this.m_columnFetchSize = Math.round(this.getViewportWidth() / this.getDefaultColumnWidth());
        }
        return this.m_columnFetchSize;
    }

    return 0;
};

/**
 * If the empty text option is 'default' return default empty translated text,
 * otherwise return the emptyText set in the options
 * @return {string} the empty text
 */
DvtDataGrid.prototype.getEmptyText = function()
{
    var emptyText, resources;
    emptyText = this.m_options.getEmptyText();
    if (emptyText == null)
    {
        resources = this.getResources();
        emptyText = resources.getTranslatedText("msgNoData");
    }
    return emptyText;
};

/**
 * Build an empty text div and populate it with empty text
 * @return {Element} the empty text element
 * @private
 */
DvtDataGrid.prototype._buildEmptyText = function()
{
    var emptyText, empty, height;
    emptyText = this.getEmptyText();
    empty = document.createElement("div");
    empty['id'] = this.createSubId("empty");
    empty['className'] = this.getMappedStyle("emptytext");
    height = this.m_endColHeader >= 0 ? this.getColumnHeaderHeight() : 0;
    this.setElementDir(empty, height, 'top');
    empty.textContent = emptyText;
    this.m_empty = empty;
    return  empty;
};

/**
 * Determine the size of the buffer that triggers fetching of rows. For example,
 * if the size of the buffer is zero, then the fetch will be triggered when the
 * scroll position reached the end of where the current range ends
 * @return {number} the row threshold
 */
DvtDataGrid.prototype.getRowThreshold = function()
{
    return 0;
};

/**
 * Determine the size of the buffer that triggers fetching of columns. For example,
 * if the size of the buffer is zero, then the fetch will be triggered when the
 * scroll position reached the end of where the current range ends.
 * @return {number} the column threshold
 */
DvtDataGrid.prototype.getColumnThreshold = function()
{
    return 0;
};


/*
 * Caches the default datagrid dimensions located in the style sheet, creates
 * just one div to reduce createElement calls. This function should get called once on create.
 * Values found in style are:
 *  column width
 *  row height
 */
DvtDataGrid.prototype.setDefaultDimensions = function()
{
    var div, resources;
    div = document.createElement('div');
    div['style']['visibilty'] = 'hidden';

    resources = this.getResources();
    div['className'] = resources.getMappedStyle("colheadercell") + " " + resources.getMappedStyle("headercell");
    document.body.appendChild(div); //@HTMLUpdateOK
    // Not using offsetWidth/Height due to 
    this.m_defaultColumnWidth = Math.floor(div.getBoundingClientRect()['width']);

    div['className'] = resources.getMappedStyle("row");
    this.m_defaultRowHeight = Math.floor(div.getBoundingClientRect()['height']);

    document.body.removeChild(div);
};

/**
 * Get the default row height which comes from the style sheet
 * @return {number} the default row height
 */
DvtDataGrid.prototype.getDefaultRowHeight = function()
{
    if (this.m_defaultRowHeight == null)
    {
        this.setDefaultDimensions();
    }
    return this.m_defaultRowHeight;
};

/**
 * Get the default column width which comes from the stylesheet
 * @return {number} the default column width
 */
DvtDataGrid.prototype.getDefaultColumnWidth = function()
{
    if (this.m_defaultColumnWidth == null)
    {
        this.setDefaultDimensions();
    }
    return this.m_defaultColumnWidth;
};

/**
 * Method to determine the height of a row. Checks the sizing manager, then checks its inline style,
 * then a lookup by className, then falls back on the deafult.
 * @param {Element} elem - the row to find the height of
 * @param {string} key - the key of the row to find the height of
 * @return {number} the height of the row
 */
DvtDataGrid.prototype.getRowHeight = function(elem, key)
{
    var rowHeight, className;
    // check sizing manager first, the sizing manager should contain any non default
    // value so that cells can match the headers where the styles are set
    rowHeight = this.m_sizingManager.getSize('row', key);
    if (rowHeight != null)
    {
        return rowHeight;
    }

    // check if inline style set on element
    if (elem['style']['height'] != '')
    {
        rowHeight = this.getElementHeight(elem);
        //in the event that row height is set via an additional style only on row header store the value
        this.m_sizingManager.setSize('row', key, rowHeight);
        return rowHeight;
    }

    // check style class mapping, mapping prevents multiple offsetHeight calls on headers with the same class name
    className = elem['className'];
    rowHeight = this.m_styleClassDimensionMap[className];
    if (rowHeight == null)
    {
        // exhausted all options, use offsetHeight then, remove element in the case of shim element
        rowHeight = this.getElementHeight(elem);
    }

    //the value isn't the default the cell will use meaning it's from an external
    //class, so store it in the sizing manager cell can pick it up
    if (rowHeight != this.getDefaultRowHeight())
    {
        this.m_sizingManager.setSize('row', key, rowHeight);
    }

    this.m_styleClassDimensionMap[className] = rowHeight;
    return rowHeight;
};

/**
 * Method to determine the height of a row. Checks the sizing manager, then checks its inline style,
 * then a lookup by className, then falls back on the deafult.
 * @param {Element} elem - the column to find the width of
 * @param {string} key - the key of the column to find the width of
 * @return {number} the width of the column
 */
DvtDataGrid.prototype.getColumnWidth = function(elem, key)
{
    var columnWidth, className;
    //check the sizing manager first
    columnWidth = this.m_sizingManager.getSize('column', key);
    if (columnWidth != null)
    {
        return columnWidth;
    }
    //if there was an inline style set
    if (elem['style']['width'] != '')
    {
        columnWidth = this.getElementWidth(elem);
        this.m_sizingManager.setSize('column', key, columnWidth);
        return columnWidth;
    }

    // check style class mapping
    className = elem['className'];
    columnWidth = this.m_styleClassDimensionMap[className];
    if (columnWidth == null)
    {
        // exhausted all options, use offsetHeight then
        columnWidth = this.getElementWidth(elem);
    }

    //in the event that row height is set via an additional class only on row header store the value
    if (columnWidth != this.getDefaultColumnWidth())
    {
        this.m_sizingManager.setSize('column', key, columnWidth);
    }
    this.m_styleClassDimensionMap[className] = columnWidth;
    return columnWidth;
};

/**
 * Helper method to create subid based on the root element's id
 * @param {string} subId - the id to append to the root element id
 * @return {string} the subId to append to the root element id
 */
DvtDataGrid.prototype.createSubId = function(subId)
{
    var id = this.getRootElement()['id'];
    if (id == null)
    {
        id = "";
    }

    return [id, subId].join(":");
};

/**
 * Checks whether header fetching is completed
 * @return {boolean} true if header fetching completed, else false
 */
DvtDataGrid.prototype.isHeaderFetchComplete = function()
{
    return (this.m_fetching['row'] === false && this.m_fetching['column'] === false);
};

/**
 * Checks whether header AND cell fetching is completed
 * @return {boolean} true if header AND cell fetching completed, else false
 */
DvtDataGrid.prototype.isFetchComplete = function()
{
    return (this.isHeaderFetchComplete() && this.m_fetching['cells'] === false);
};

/**
 * Checks whether the index is the last row
 * @param {number} index
 * @return {boolean} true if it's the last row, false otherwise
 */
DvtDataGrid.prototype._isLastRow = function(index)
{
    if (this._isCountUnknown("row"))
    {
        // if row count is unknown, then the last row is if the index is before the last row fetched
        // and there's no more rows from datasource
        return (index === this.m_endRow && this.m_stopRowFetch);
    }
    else
    {
        // if column count is known, then just check the index with the total column count
        return (index + 1 === this.getDataSource().getCount("row"));
    }
};

/**
 * Checks whether the index is the last column
 * @param {number} index
 * @return {boolean} true if it's the last column, false otherwise
 */
DvtDataGrid.prototype._isLastColumn = function(index)
{
    if (this._isCountUnknown("column"))
    {
        // if column count is unknown, then the last column is if the index is the last column fetched
        // and there's no more columns from datasource
        return (index === this.m_endCol && this.m_stopColumnFetch);
    }
    else
    {
        // if column count is known, then just check the index with the total column count
        return (index + 1 === this.getDataSource().getCount("column"));
    }
};

/**
 * Removes all of the datagrid children built by DvtDataGrid, this excludes context menus/popups
 */
DvtDataGrid.prototype.empty = function()
{
    //remove everything that will be rebuilt
    if (this.m_empty)
    {
        this.m_root.removeChild(this.m_empty);
    }
    if (this.m_corner)
    {
        this.m_root.removeChild(this.m_corner);
    }
    if (this.m_bottomCorner)
    {
        this.m_root.removeChild(this.m_bottomCorner);
    }
    if (this.m_columnHeaderScrollbarSpacer)
    {
        this.m_root.removeChild(this.m_columnHeaderScrollbarSpacer);
    }
    if (this.m_rowHeaderScrollbarSpacer)
    {
        this.m_root.removeChild(this.m_rowHeaderScrollbarSpacer);
    }

    this.m_root.removeChild(this.m_placeHolder);
    this.m_root.removeChild(this.m_status);
    this.m_root.removeChild(this.m_accSummary);
    this.m_root.removeChild(this.m_accInfo);
    this.m_root.removeChild(this.m_stateInfo);
    this.m_root.removeChild(this.m_contextInfo);
    this.m_root.removeChild(this.m_scroller);
    // elements that may contain other components
    this._remove(this.m_colHeader);
    this._remove(this.m_rowHeader);
    this._remove(this.m_databody);
};

/**
 * Re-renders the data grid. Resets all the necessary properties.
 * @param {Element} root - the root dom element for the DataGrid.
 * @export
 */
DvtDataGrid.prototype.refresh = function(root)
{
    this._removeDomEventListeners();
    this.resetInternal();
    this.render(root);
};

/**
 * Resets internal state of data grid.
 * @private
 */
DvtDataGrid.prototype.resetInternal = function()
{
    this.m_initialized = false;
    this.m_readinessStack = [];
    this._signalTaskStart();
    this._signalTaskEnd();

    //cursor
    this.m_cursor = null;

    //dom elements
    this.m_corner = null;
    this.m_bottomCorner = null;
    this.m_columnHeaderScrollbarSpacer = null;
    this.m_rowHeaderScrollbarSpacer = null;
    this.m_colHeader = null;
    this.m_rowHeader = null;
    this.m_databody = null;
    this.m_scroller = null;
    this.m_empty = null;
    this.m_accInfo = null;
    this.m_accSummary = null;
    this.m_contextInfo = null;
    this.m_placeHolder = null;
    this.m_stateInfo = null;
    this.m_status = null;

    //fetching
    this.m_isEstimateRowCount = undefined;
    this.m_isEstimateColumnCount = undefined;
    this.m_stopRowFetch = false;
    this.m_stopRowHeaderFetch = false;
    this.m_stopColumnFetch = false;
    this.m_stopColumnHeaderFetch = false;
    this.m_rowFetchSize = null;
    this.m_columnFetchSize = null;
    this.m_fetching = null;

    //dimensions
    this.m_sizingManager.clear();
    this.m_styleClassDimensionMap = {};
    this.m_height = null;
    this.m_width = null;
    this.m_scrollHeight = null;
    this.m_scrollWidth = null;
    this.m_avgRowHeight = undefined;
    this.m_avgColWidth = undefined;
    this.m_defaultColumnWidth = null;
    this.m_defaultRowHeight = null;
    this.m_colHeaderHeight = null;
    this.m_rowHeaderWidth = null;
    this.m_rowHeaderLevelWidths = null;
    this.m_columnHeaderLevelHeights = null;

    //active
    this.m_active = null;
    this.m_prevActive = null;

    //dnd
    this.m_databodyDragState = false;
    this.m_databodyMove = false;
    this.m_moveRow = null;
    this.m_moveRowHeader = null;
    this.m_dropTarget = null;
    this.m_dropTargetHeader = null;

    //selection
    this.m_discontiguousSelection = false;

    //event listeners
    this.m_docMouseMoveListener = null;
    this.m_docMouseUpListener = null;
    this.m_handleDatabodyKeyDown = null;
    this.m_handleRootFocus = null;
    this.m_handleRootBlur = null;
    this.m_modelEvents = null;

    //scrolling
    this.m_stopDatabodyScroll = false;
    this.m_captureScrolling = false;
    this.m_hasHorizontalScroller = null;
    this.m_hasVerticalScroller = null;
    this.m_currentScrollLeft = null;
    this.m_currentScrollTop = null;

    //resizing
    this.m_resizing = false;
    this.m_resizingElement = null;

    //data states
    this.m_startRow = null;
    this.m_startCol = null;
    this.m_endRow = null;
    this.m_endCol = null;
    this.m_startRowPixel = null;
    this.m_startColPixel = null;
    this.m_endRowPixel = null;
    this.m_endColPixel = null;
    this.m_startRowHeader = null;
    this.m_startColHeader = null;
    this.m_endRowHeader = null;
    this.m_endColHeader = null;
    this.m_startRowHeaderPixel = null;
    this.m_startColHeaderPixel = null;
    this.m_endRowHeaderPixel = null;
    this.m_endColHeaderPixel = null;
    this.m_rowHeaderLevelCount = null;
    this.m_columnHeaderLevelCount = null;

    this.m_sortInfo = null;
    this.m_resizeRequired = null;
    this.m_externalFocus = null;
};

/**
 * DataGrid should initialize if there's no outstanding fetch, it is unitialized
 * and the databody is attached to the root.
 * @private
 * @returns {boolean} true if we have the properties that signify an end to initialize
 */
DvtDataGrid.prototype._shouldInitialize = function()
{
    return (this.isFetchComplete() && !this.m_initialized && this.m_databody.parentNode != null)
};

/**
 * Handle the end of datagrid initialization whether at the end of rendering or fetching
 * @private
 * @param {boolean=} hasData false if there is no data and thus should skip resizing
 * @returns {boolean} true if we have the properties that signify an end to initialize
 */
DvtDataGrid.prototype._handleInitialization = function(hasData)
{
    if (hasData == true)
    {
        this.resizeGrid();
        this.setInitialScrollPosition();
        this.fillViewport(this.m_currentScrollLeft, this.m_currentScrollTop);

        if (this.isFetchComplete())
        {
            this._updateActive(this.m_options.getCurrentCell());
            this.m_initialized = true;
            this.fireEvent('ready', {});
            this._runModelEventQueue();
        }
    }
    else
    {
        this.m_initialized = true;
        this.fireEvent('ready', {});
        this._runModelEventQueue();
    }
};

/**
 * Run the events in the model event list
 * @private
 */
DvtDataGrid.prototype._runModelEventQueue = function()
{
    var i;
    // check the model event queue to see if there are outstanding events
    if (this.m_modelEvents != null)
    {
        for (i = 0; i < this.m_modelEvents.length; i++)
        {
            this.handleModelEvent(this.m_modelEvents[i]);
        }
        // empty the queue
        this.m_modelEvents.length = 0;
    }
};

/**
 * Renders the DataGrid, initializes DataGrid properties.
 * @param {Element} root - the root dom element for the DataGrid.
 * @export
 */
DvtDataGrid.prototype.render = function(root)
{
    // if this is the same instance and state wasn't clear out from last time
    if (this.m_databody != null)
    {
        this.destroy();
        this.resetInternal();
    }

    this.m_timingStart = new Date();
    this.m_fetching = {
    };

    // since headers and cells are independently fetched, they could be returned
    // at a different time, therefore we'll need var to keep track the current range
    // for each one of them
    this.m_startRow = 0;
    this.m_startCol = 0;
    this.m_endRow = -1;
    this.m_endCol = -1;
    this.m_startRowPixel = 0;
    this.m_startColPixel = 0;
    this.m_endRowPixel = 0;
    this.m_endColPixel = 0;

    this.m_startRowHeader = 0;
    this.m_startColHeader = 0;
    this.m_endRowHeader = -1;
    this.m_endColHeader = -1;
    this.m_startRowHeaderPixel = 0;
    this.m_startColHeaderPixel = 0;
    this.m_endRowHeaderPixel = 0;
    this.m_endColHeaderPixel = 0;

    this.m_currentScrollLeft = 0;
    this.m_currentScrollTop = 0;

    this.buildGrid(root);
};

/**
 * Builds the DataGrid, adds root children (headers, scrollers, databody, corners),
 * initializes event listeners, and sets inital scroll position.
 * @param {Element} root - the root dom element for the DataGrid.
 */
DvtDataGrid.prototype.buildGrid = function(root)
{
    var status, accSummary, accInfo, stateInfo, rtl, colHeader, rowHeader, scroller, databody, empty, i, contextInfo, placeHolder;

    this.m_root = root;
    //class name set on component create
    this.m_root.setAttribute("role", "application");
    //this.m_root.setAttribute("aria-describedby", this.createSubId("summary"));

    // set a tab index so it can be focus and keyboard navigation to work
    root.tabIndex = 0;

    status = this.buildStatus();
    root.appendChild(status); //@HTMLUpdateOK
    this.m_status = status;

    accSummary = this.buildAccSummary();
    root.appendChild(accSummary); //@HTMLUpdateOK
    this.m_accSummary = accSummary;

    accInfo = this.buildAccInfo();
    root.appendChild(accInfo); //@HTMLUpdateOK
    this.m_accInfo = accInfo;

    stateInfo = this.buildStateInfo();
    root.appendChild(stateInfo); //@HTMLUpdateOK
    this.m_stateInfo = stateInfo;

    contextInfo = this.buildContextInfo();
    root.appendChild(contextInfo); //@HTMLUpdateOK
    this.m_contextInfo = contextInfo;

    placeHolder = this.buildPlaceHolder();
    root.appendChild(placeHolder); //@HTMLUpdateOK
    this.m_placeHolder = placeHolder;

    if (this.getDataSource() != null)
    {
        //in the event that the empty text was set when there was no datasource
        this.m_empty = null;

        rtl = this.getResources().isRTLMode();
        colHeader = this.buildHeaders("column", this.getMappedStyle("colheader"));
        rowHeader = this.buildHeaders("row", this.getMappedStyle("rowheader"));
        scroller = this.buildScroller();
        databody = this.buildDatabody(scroller);

        if (rtl)
        {
            colHeader['style']['direction'] = "rtl";
            databody['style']['direction'] = "rtl";
            scroller['style']['direction'] = "rtl";
        }

        this.m_isResizing = false;
        this.m_resizingElement = null;
        this.m_databodyDragState = false;

        // store the listeners so we can remove them later (bind creates a new function)
        this.m_handleDatabodyKeyDown = this.handleDatabodyKeyDown.bind(this);
        this.m_handleRootFocus = this.handleRootFocus.bind(this);
        this.m_handleRootBlur = this.handleRootBlur.bind(this);
        this.m_docMouseMoveListener = this.handleMouseMove.bind(this);
        this.m_docMouseUpListener = this.handleMouseUp.bind(this);

        //touch event handling
        if (this.m_utils.isTouchDevice())
        {
            //databody touch listeners
            databody.addEventListener("touchstart", this.handleTouchStart.bind(this), false);
            databody.addEventListener("touchmove", this.handleTouchMove.bind(this), false);
            databody.addEventListener("touchend", this.handleTouchEnd.bind(this), false);
            databody.addEventListener("touchcancel", this.handleTouchCancel.bind(this), false);

            //column header listeners
            colHeader.addEventListener("touchstart", this.handleHeaderTouchStart.bind(this), false);
            colHeader.addEventListener("touchmove", this.handleHeaderTouchMove.bind(this), false);
            colHeader.addEventListener("touchend", this.handleHeaderTouchEnd.bind(this), false);
            colHeader.addEventListener("touchcancel", this.handleHeaderTouchCancel.bind(this), false);

            //row header listeners
            rowHeader.addEventListener("touchstart", this.handleHeaderTouchStart.bind(this), false);
            rowHeader.addEventListener("touchmove", this.handleHeaderTouchMove.bind(this), false);
            rowHeader.addEventListener("touchend", this.handleHeaderTouchEnd.bind(this), false);
            rowHeader.addEventListener("touchcancel", this.handleHeaderTouchCancel.bind(this), false);

            //root listeners
            root.addEventListener('focus', this.m_handleRootFocus, true);
            root.addEventListener('blur', this.m_handleRootBlur, true);
        }
        else
        {
            //non-touch event listening
            //document level listeners
            document.addEventListener("mousemove", this.m_docMouseMoveListener, false);
            document.addEventListener("mouseup", this.m_docMouseUpListener, false);

            //root level listeners
            root.addEventListener("keydown", this.m_handleDatabodyKeyDown, false);
            root.addEventListener('focus', this.m_handleRootFocus, true);
            root.addEventListener('blur', this.m_handleRootBlur, true);

            //databody listeners
            databody.addEventListener(this.m_utils.getMousewheelEvent(), this.handleDatabodyMouseWheel.bind(this), false);
            databody.addEventListener("mousedown", this.handleDatabodyMouseDown.bind(this), false);
            databody.addEventListener("mousemove", this.handleDatabodyMouseMove.bind(this), false);
            databody.addEventListener("mouseup", this.handleDatabodyMouseUp.bind(this), false);
            databody.addEventListener("mouseout", this.handleDatabodyMouseOut.bind(this), false);
            databody.addEventListener("mouseover", this.handleDatabodyMouseOver.bind(this), false);

            //header listeners
            rowHeader.addEventListener("mousedown", this.handleHeaderMouseDown.bind(this), false);
            colHeader.addEventListener("mousedown", this.handleHeaderMouseDown.bind(this), false);
            rowHeader.addEventListener("mouseover", this.handleHeaderMouseOver.bind(this), false);
            colHeader.addEventListener("mouseover", this.handleHeaderMouseOver.bind(this), false);
            rowHeader.addEventListener("mousemove", this.handleRowHeaderMouseMove.bind(this), false);
            rowHeader.addEventListener("mouseup", this.handleHeaderMouseUp.bind(this), false);
            rowHeader.addEventListener("mouseout", this.handleHeaderMouseOut.bind(this), false);
            colHeader.addEventListener("mouseout", this.handleHeaderMouseOut.bind(this), false);
            rowHeader.addEventListener("click", this.handleHeaderClick.bind(this), false);
            colHeader.addEventListener("click", this.handleHeaderClick.bind(this), false);

            //scroller listeners
            scroller.addEventListener("mousedown", this.handleScrollerMouseDown.bind(this), false);
            scroller.addEventListener("mouseup", this.handleScrollerMouseUp.bind(this), false);
        }

        // inserting the databody to the live DOM is what we will use to be sure that grid has been initialized
        root.insertBefore(colHeader, status); //@HTMLUpdateOK
        root.insertBefore(rowHeader, status); //@HTMLUpdateOK
        root.insertBefore(scroller, status); //@HTMLUpdateOK
        root.insertBefore(databody, status); //@HTMLUpdateOK

        // check if data is fetched and size the grid
        if (this._shouldInitialize())
        {
            this._handleInitialization(true);
        }
    }
    else
    {
        //if no datasource render empty text
        empty = this._buildEmptyText();
        this.m_root.appendChild(empty); //@HTMLUpdateOK
        this._handleInitialization(false);
    }
};

/**
 * Size the headers based on current width and height.
 * @private
 */
DvtDataGrid.prototype.resizeHeaders = function()
{
    var width, height, colHeader, rowHeader, colHeaderHeight, rowHeaderWidth, dir;

    if (!this.m_initialized)
    {
        return;
    }

    width = this.getWidth();
    height = this.getHeight();
    colHeader = this.m_colHeader;
    rowHeader = this.m_rowHeader;

    colHeaderHeight = this.getColumnHeaderHeight();
    rowHeaderWidth = this.getRowHeaderWidth();

    dir = this.getResources().isRTLMode() ? "right" : "left";
    this.setElementDir(rowHeader, 0, dir);
    this.setElementDir(rowHeader, colHeaderHeight, 'top');
    this.setElementHeight(rowHeader, height - colHeaderHeight);
    this.setElementDir(colHeader, rowHeaderWidth, dir);
    this.setElementWidth(colHeader, width - rowHeaderWidth);

    if (!this.m_utils.isTouchDevice())
    {
        this.buildCorners();
    }
};

/**
 * Handle resize of grid to a new width and height.
 * @param {number} width the new width
 * @param {number} height the new height
 * @export
 */
DvtDataGrid.prototype.HandleResize = function(width, height)
{
    //can either get the client width or subtract the border width.
    width = this.getRootElement()['clientWidth'];
    height = this.getRootElement()['clientHeight'];
    // don't do anything if nothing has changed
    if (width != this.m_width || height != this.m_height)
    {
        // assign new width and height
        this.m_width = width;
        this.m_height = height;

        this.m_rowFetchSize = null;
        this.m_columnFetchSize = null;

        // if it's not initialize (or fetching), then just skip now
        // handleCellsFetchSuccess will attempt to fill the viewport
        if (this.m_initialized)
        {
            // call resize logic
            this.resizeGrid();
            if (this.isFetchComplete())
            {
                // check viewport
                this.fillViewport(this.m_currentScrollLeft, this.m_currentScrollTop);
            }
        }
    }
};

/**
 * Size the headers, scroller, databody based on current width and height.
 * @private
 */
DvtDataGrid.prototype.resizeGrid = function()
{
    var width, height, colHeader, rowHeader, scroller, databody,
            colHeaderHeight, rowHeaderWidth, databodyContentWidth, databodyWidth, databodyContentHeight, databodyHeight,
            isTouchDevice, isDatabodyHorizontalScrollbarRequired, isDatabodyVerticalScrollbarRequired, scrollbarSize,
            dir, empty, endTime, scrollerHeight, scrollerWidth;

    // check if there's no data
    if (this._databodyEmpty())
    {
        //could be getting here in the handle resize of an empty grid
        if (this.m_empty == null)
        {
            empty = this._buildEmptyText();
            this.m_root.appendChild(empty); //@HTMLUpdateOK
        }
        return;
    }

    width = this.getWidth();
    height = this.getHeight();
    colHeader = this.m_colHeader;
    rowHeader = this.m_rowHeader;
    scroller = this.m_scroller;
    databody = this.m_databody;

    // cache these since they will be used in multiple places and we want to minimize reflow
    colHeaderHeight = this.getColumnHeaderHeight();
    rowHeaderWidth = this.getRowHeaderWidth();
    databodyContentWidth = this.getElementWidth(databody['firstChild']);
    databodyContentHeight = this.getElementHeight(databody['firstChild']);

    //adjusted to make the databody wrap the databody content, and the scroller to fill the remaing part of the grid
    //this way our scrollbars are always at the edges of our viewport
    scrollerHeight = height - colHeaderHeight;
    scrollerWidth = width - rowHeaderWidth;
    databodyWidth = Math.min(databodyContentWidth, scrollerWidth);
    databodyHeight = Math.min(databodyContentHeight, scrollerHeight);

    isTouchDevice = this.m_utils.isTouchDevice();
    scrollbarSize = this.m_utils.getScrollbarSize();

    //determine which scrollbars are required, if needing one forces need of the other, allows rendering within the root div
    isDatabodyHorizontalScrollbarRequired = this.isDatabodyHorizontalScrollbarRequired(scrollerWidth);
    if (isDatabodyHorizontalScrollbarRequired)
    {
        isDatabodyVerticalScrollbarRequired = this.isDatabodyVerticalScrollbarRequired(scrollerHeight - scrollbarSize);
    }
    else
    {
        isDatabodyVerticalScrollbarRequired = this.isDatabodyVerticalScrollbarRequired(scrollerHeight);
        if (isDatabodyVerticalScrollbarRequired)
        {
            isDatabodyHorizontalScrollbarRequired = this.isDatabodyHorizontalScrollbarRequired(scrollerWidth - scrollbarSize);
        }
    }

    this.m_hasHorizontalScroller = isDatabodyHorizontalScrollbarRequired;
    this.m_hasVerticalScroller = isDatabodyVerticalScrollbarRequired;

    //appropriatley set the width and height in the scrollabr case
    if (isDatabodyHorizontalScrollbarRequired)
    {
        //if the scroller position is bigger than the databody
        if (((scrollerHeight - scrollbarSize) < databodyHeight))
        {
            //if the visible height is going to be less than the databody height, set the databody height to the visible height
            databodyHeight = scrollerHeight - scrollbarSize;
        }
    }
    if (isDatabodyVerticalScrollbarRequired)
    {
        //if the visible width is going to be less than the databody width, set the databody width to the visible width
        if (((scrollerWidth - scrollbarSize) < databodyWidth))
        {
            databodyWidth = scrollerWidth - scrollbarSize;
        }
    }

    dir = this.getResources().isRTLMode() ? "right" : "left";
    this.setElementDir(rowHeader, 0, dir);
    this.setElementDir(rowHeader, colHeaderHeight, 'top');
    this.setElementHeight(rowHeader, databodyHeight);
    this.setElementDir(colHeader, rowHeaderWidth, dir);
    this.setElementWidth(colHeader, databodyWidth);
    this.setElementDir(databody, colHeaderHeight, 'top');
    this.setElementDir(databody, rowHeaderWidth, dir);
    this.setElementWidth(databody, databodyWidth);
    this.setElementHeight(databody, databodyHeight);
    this.setElementDir(scroller, colHeaderHeight, 'top');
    this.setElementDir(scroller, rowHeaderWidth, dir);
    this.setElementWidth(scroller, scrollerWidth);
    this.setElementHeight(scroller, scrollerHeight);

    // cache the scroll width and height to minimize reflow
    this.m_scrollWidth = databodyContentWidth - databodyWidth;
    this.m_scrollHeight = databodyContentHeight - databodyHeight;

    // check if we need to remove border on the last column header
    this._adjustColumnHeader();

    this.buildCorners();

    // now we do not need to resize
    this.m_resizeRequired = false;

    endTime = new Date();
};

/**
 * Adjust the border style setting on the last column header if neccessary
 * @private
 */
DvtDataGrid.prototype._adjustColumnHeader = function()
{
    var borderStyle, lastHeader;

    if (this.m_colHeader != null && this.m_endColHeader >= 0)
    {
        //do not put borders on last header cell
        if ((this.getRowHeaderWidth() + this.m_endColHeaderPixel >= this.getWidth()))
        {
            borderStyle = this.getResources().isRTLMode() ? "borderLeftStyle" : "borderRightStyle";
            lastHeader = this._getColumnHeaderByIndex(this.m_endColHeader, this.m_columnHeaderLevelCount - 1);
            lastHeader['style'][borderStyle] = 'none';
        }
    }
};

/**
 * Build the corners of the grid. If they exist, removes them and rebuilds them.
 * @private
 */
DvtDataGrid.prototype.buildCorners = function()
{
    var scrollbarSize, colHeaderHeight, rowHeaderWidth, bottomCorner,
            corner, dir, rowHeaderScrollbarSpacer, columnHeaderScrollbarSpacer,
            colHeaderWidth, rowHeaderHeight, scrollerWidth, scrollerHeight;

    scrollbarSize = this.m_utils.getScrollbarSize();
    scrollerWidth = this.getElementWidth(this.m_scroller);
    scrollerHeight = this.getElementHeight(this.m_scroller);
    colHeaderHeight = this.getColumnHeaderHeight();
    colHeaderWidth = this.getElementWidth(this.m_colHeader);
    rowHeaderWidth = this.getRowHeaderWidth();
    rowHeaderHeight = this.getElementHeight(this.m_rowHeader);
    dir = this.getResources().isRTLMode() ? "right" : "left";

    //rather than removing and appending the nodes every time just adjust the live ones

    if (this.m_endRowHeader != -1 && this.m_endColHeader != -1)
    {
        // render corner
        if (this.m_corner != null)
        {
            corner = this.m_corner;
        }
        else
        {
            corner = document.createElement("div");
            corner['id'] = this.createSubId("corner");
            corner['className'] = this.getMappedStyle("topcorner");
        }

        this.setElementWidth(corner, rowHeaderWidth);
        this.setElementHeight(corner, colHeaderHeight);

        if (this.m_corner == null)
        {
            this.m_root.appendChild(corner); //@HTMLUpdateOK
            this.m_corner = corner;
        }
    }
    if (this.m_corner != null && corner == null)
    {
        this.m_root.removeChild(this.m_corner);
        this.m_corner = null;
    }

    //no bottom left corner if there are no row headers
    if (this.m_endRowHeader != -1)
    {
        if (this.m_hasHorizontalScroller)
        {
            if (this.m_rowHeaderScrollbarSpacer != null)
            {
                rowHeaderScrollbarSpacer = this.m_rowHeaderScrollbarSpacer;
            }
            else
            {
                rowHeaderScrollbarSpacer = document.createElement("div");
                rowHeaderScrollbarSpacer['id'] = this.createSubId("rhSbSpacer");
                rowHeaderScrollbarSpacer['className'] = this.getMappedStyle("rowheaderspacer");
            }

            this.setElementDir(rowHeaderScrollbarSpacer, (rowHeaderHeight + colHeaderHeight), 'top');
            this.setElementDir(rowHeaderScrollbarSpacer, 0, dir);
            this.setElementWidth(rowHeaderScrollbarSpacer, rowHeaderWidth);
            this.setElementHeight(rowHeaderScrollbarSpacer, scrollerHeight - rowHeaderHeight);

            if (this.m_rowHeaderScrollbarSpacer == null)
            {
                this.m_root.appendChild(rowHeaderScrollbarSpacer); //@HTMLUpdateOK
                this.m_rowHeaderScrollbarSpacer = rowHeaderScrollbarSpacer;
            }
        }
        else
        {
            if (this.m_rowHeaderScrollbarSpacer != null)
            {
                this.m_root.removeChild(this.m_rowHeaderScrollbarSpacer);
            }
            this.m_rowHeaderScrollbarSpacer = null;
        }
    }

    //no top right corner if there are no col headers
    if (this.m_endColHeader != -1)
    {
        // render scrollbar spacer in column header if needed
        if (this.m_hasVerticalScroller)
        {
            if (this.m_columnHeaderScrollbarSpacer != null)
            {
                columnHeaderScrollbarSpacer = this.m_columnHeaderScrollbarSpacer;
            }
            else
            {
                columnHeaderScrollbarSpacer = document.createElement("div");
                columnHeaderScrollbarSpacer['id'] = this.createSubId("chSbSpacer");
                columnHeaderScrollbarSpacer['className'] = this.getMappedStyle("colheaderspacer");
            }

            this.setElementDir(columnHeaderScrollbarSpacer, (rowHeaderWidth + colHeaderWidth), dir);
            this.setElementDir(columnHeaderScrollbarSpacer, 0, 'top');
            this.setElementWidth(columnHeaderScrollbarSpacer, scrollerWidth - colHeaderWidth);
            this.setElementHeight(columnHeaderScrollbarSpacer, colHeaderHeight);

            if (this.m_columnHeaderScrollbarSpacer == null)
            {
                this.m_root.appendChild(columnHeaderScrollbarSpacer); //@HTMLUpdateOK
                this.m_columnHeaderScrollbarSpacer = columnHeaderScrollbarSpacer;
            }
        }
        else
        {
            if (this.m_columnHeaderScrollbarSpacer != null)
            {
                this.m_root.removeChild(this.m_columnHeaderScrollbarSpacer);
            }
            this.m_columnHeaderScrollbarSpacer = null;
        }
    }

    // render bottom corner (for both scrollbars) if needed
    if (this.m_hasHorizontalScroller && this.m_hasVerticalScroller)
    {
        if (this.m_bottomCorner != null)
        {
            bottomCorner = this.m_bottomCorner;
        }
        else
        {
            bottomCorner = document.createElement("div");
            bottomCorner['id'] = this.createSubId("bcorner");
            bottomCorner['className'] = this.getMappedStyle("bottomcorner");
        }

        this.setElementDir(bottomCorner, (rowHeaderHeight + colHeaderHeight), 'top');
        this.setElementDir(bottomCorner, (rowHeaderWidth + colHeaderWidth), dir);
        this.setElementWidth(bottomCorner, scrollerWidth - colHeaderWidth);
        this.setElementHeight(bottomCorner, scrollerHeight - rowHeaderHeight);

        if (this.m_bottomCorner == null)
        {
            this.m_root.appendChild(bottomCorner); //@HTMLUpdateOK
            this.m_bottomCorner = bottomCorner;
        }
    }
    if (this.m_bottomCorner != null && bottomCorner == null)
    {
        this.m_root.removeChild(this.m_bottomCorner);
        this.m_bottomCorner = null;
    }
};

/**
 * Sets the inital scroller postion. If initial scroll is set via key, will find the indexes from the data source
 * and call back to _intialScrollPositionCallback, otherwise will just call _intialScrollPositionCallback with the indexes
 * provided.
 */
DvtDataGrid.prototype.setInitialScrollPosition = function()
{
    var scrollMode, columnScrollPosition, rowScrollPosition, databody, firstRow, firstCell;
    scrollMode = this.m_options.getScrollPositionMode();
    if (this.m_scroller != undefined)
    {
        if (scrollMode != null)
        {
            columnScrollPosition = this.m_options.getColumnScrollPosition();
            rowScrollPosition = this.m_options.getRowScrollPosition();

            if (columnScrollPosition == null && rowScrollPosition == null)
            {
                // no information provided in the scrollPosition option so bail
                return;
            }

            if (scrollMode === 'key')
            {
                // if they specify only 1 key, get the other key that dataSource.indexes requires
                // from the first row or cell locally
                if (rowScrollPosition == null || columnScrollPosition == null)
                {
                    databody = this.m_databody;
                    firstRow = databody != null ? databody['firstChild']['firstChild'] : null;
                    firstCell = firstRow != null ? firstRow['firstChild'] : null;

                    if (rowScrollPosition == null && firstRow != null)
                    {
                        rowScrollPosition = this._getKey(firstRow);
                    }
                    else if (columnScrollPosition == null && firstCell != null)
                    {
                        rowScrollPosition = this._getKey(firstCell);
                    }
                }

                // need to use _indexes because the row/column could be off screen
                // get the indexes of the given keys and pass in a callback to kick off a scroller event
                this._indexes({'row': rowScrollPosition, 'column': columnScrollPosition}, this._intialScrollPositionCallback);
            }
            else
            {
                // if they specify only 1 index, set the other index to 0
                if (rowScrollPosition == null)
                {
                    rowScrollPosition = 0;
                }
                else if (columnScrollPosition == null)
                {
                    rowScrollPosition = 0;
                }

                this._intialScrollPositionCallback({'row': rowScrollPosition, 'column': columnScrollPosition});
            }
        }
    }
};

/**
 * Sets the inital scroller postion, based on average column width and height
 * @param {Object} indexes the indexes to scroll to with property row and column, values are numbers
 * @private
 */
DvtDataGrid.prototype._intialScrollPositionCallback = function(indexes)
{
    //scroll to index puts the desired index at the bottom of the viewport
    var columnScrollPosition, rowScrollPosition, initialScrollLeft, initialScrollTop = 0;
    columnScrollPosition = indexes['column'] === -1 ? 0 : indexes['column'];
    rowScrollPosition = indexes['row'] === -1 ? 0 : indexes['row'];

    initialScrollLeft = columnScrollPosition * this.m_avgColWidth;
    initialScrollTop = rowScrollPosition * this.m_avgRowHeight;

    this._initiateScroll(initialScrollLeft, initialScrollTop);
};

/**
 * Determine if horizontal scrollbar is needed
 * @param {number|null=} expectedWidth - databody width
 * @return {boolean} true if horizontal scrollbar required
 */
DvtDataGrid.prototype.isDatabodyHorizontalScrollbarRequired = function(expectedWidth)
{
    var databody, scroller, expected;
    // if expected width of the databody is not specified, extract from style
    databody = this.m_databody;
    if (expectedWidth == null)
    {
        expected = this.getElementWidth(databody);
    }
    else
    {
        expected = expectedWidth;
    }

    scroller = databody['firstChild'];
    if (this.getElementWidth(scroller) > expected)
    {
        return true;
    }
    return false;
};

/**
 * Determine if vertical scrollbar is needed
 * @param {number|null=} expectedHeight - databody height
 * @return {boolean} true if vertical scrollbar required
 * @private
 */
DvtDataGrid.prototype.isDatabodyVerticalScrollbarRequired = function(expectedHeight)
{
    var databody, scroller, expected;
    // if expected height of the databody is not specified, extract from style
    databody = this.m_databody;
    if (expectedHeight == null)
    {
        expected = this.getElementHeight(databody);
    }
    else
    {
        expected = expectedHeight;
    }

    scroller = databody['firstChild'];
    if (this.getElementHeight(scroller) > expected)
    {
        return true;
    }
    return false;
};

/**
 * todo: merge with buildAccInfo, we just need one status role div.
 * Build a status bar div
 * @return {Element} the root of the status bar
 * @private
 */
DvtDataGrid.prototype.buildStatus = function()
{
    var root = document.createElement("div");
    root['id'] = this.createSubId("status");
    root['className'] = this.getMappedStyle("status");
    root.setAttribute("role", "status");

    return root;
};

/**
 * Build the offscreen div used by screenreader for action such as sort
 * @return {Element} the root of the accessibility info div
 */
DvtDataGrid.prototype.buildAccInfo = function()
{
    var root = document.createElement("div");
    root['id'] = this.createSubId("info");
    root['className'] = this.getMappedStyle("info");
    root.setAttribute("role", "status");

    return root;
};

/**
 * Build the offscreen div used by screenreader for summary description
 * @return {Element} the root of the accessibility summary div
 */
DvtDataGrid.prototype.buildAccSummary = function()
{
    var root = document.createElement("div");
    root['id'] = this.createSubId("summary");
    root['className'] = this.getMappedStyle("info");

    return root;
};

/**
 * Build the offscreen div used by screenreader for state information
 * @return {Element} the root of the accessibility state info div
 */
DvtDataGrid.prototype.buildStateInfo = function()
{
    var root = document.createElement("div");
    root['id'] = this.createSubId("state");
    root['className'] = this.getMappedStyle("info");

    return root;
};

/**
 * Build the offscreen div used by screenreader for cell context information
 * @return {Element} the root of the accessibility context info div
 */
DvtDataGrid.prototype.buildContextInfo = function()
{
    var root = document.createElement("div");
    root['id'] = this.createSubId("context");
    root['className'] = this.getMappedStyle("info");

    return root;
};

/**
 * Build the offscreen div used by screenreader used for reading current cell context information
 * @return {Element} the root of the accessibility current cell context info div
 */
DvtDataGrid.prototype.buildPlaceHolder = function()
{
    var root = document.createElement("div");
    root['id'] = this.createSubId("placeHolder");
    root['className'] = this.getMappedStyle("info");

    return root;
};

/**
 * Sets the text on the offscreen div.  The text contains a summary text describing the grid
 * including structure information
 * @private
 */
DvtDataGrid.prototype.populateAccInfo = function()
{
    var summary, summaryExpanded;

    summary = this.getResources().getTranslatedText('accessibleSummaryExact', {'rownum': (this.m_endRow + 1), 'colnum': (this.m_endCol + 1)});

    // if it's hierarchical, then include specific accessible info about what's expanded
    if (this.getDataSource().getExpandedKeys)
    {
        summaryExpanded = this.getResources().getTranslatedText('accessibleSummaryExpanded', {'num': this.getDataSource().getExpandedKeys().length});
        summary = summary + ". " + summaryExpanded;
    }

    // add instruction text
    summary += ". ";

    // set the summary text on the screen reader div
    this.m_accSummary.textContent = summary;
};

/**
 * Implements Accessible interface.
 * Sets accessible information on the DataGrid.
 * This is currently used by the Row Expander to alert screenreader of such
 * information as depth, expanded state, index etc
 * @param {Object} context an object containing attribute context or state to set m_accessibleContext/state
 * @export
 */
DvtDataGrid.prototype.SetAccessibleContext = function(context)
{
    var label, ancestors, col, i, parent, row, cell, text;

    if (context != null)
    {
        // got row context info
        if (context['context'] != null)
        {
            // save it for updateContextInfo to consume later
            this.m_accessibleContext = context['context'];
        }

        // got disclosure state info
        if (context['state'] != null)
        {
            this.m_stateInfo.textContent = context['state'];
        }

        // got ancestors info
        if (context['ancestors'] != null && this._isDatabodyCellActive())
        {
            label = '';
            ancestors = context['ancestors'];
            col = this.m_active['indexes']['column'];
            if (col != null && col >= 0)
            {
                // constructs the appropriate parent context info text
                for (i = 0; i < ancestors.length; i++)
                {
                    if (i > 0)
                    {
                        label = label.concat(', ');
                    }
                    parent = ancestors[i];
                    row = this._findRowByKey(parent['key']);
                    if (row != null)
                    {
                        cell = row.childNodes[col - this.m_startCol];
                        // we are just going to extract any text content (or find first aria-label if null?)
                        text = cell.textContent;
                        // remove any carriage return, tab etc.
                        if (text != null)
                        {
                            text = text.replace(/\n|<br\s*\/?>/gi, '').trim();
                        }
                        else
                        {
                            text = '';
                        }
                        label = label.concat(parent['label']).concat(' ').concat(text);
                    }
                }
            }

            // prepend to existing context info
            this.m_accessibleContext = label.concat(', ').concat(this.m_accessibleContext);
        }
    }
};

/**
 * Sets the accessibility state info text
 * @param {string} key the message key
 * @param {Object=} args the optional arguments passed to bundle
 * @private
 */
DvtDataGrid.prototype._updateStateInfo = function(key, args)
{
    var text = this.getResources().getTranslatedText(key, args);
    if (text != null)
    {
        this.m_stateInfo.textContent = text;
    }
};

/**
 * Sets the accessibility context info text
 * @param {Object} context the context info about the cell
 * @param {number=} context.row the row index
 * @param {number=} context.column the column index
 * @param {number=} context.level the level of the header if there is one
 * @param {number=} context.rowHeader the rowHeader index
 * @param {number=} context.columnHeader the rowHeader index
 * @param {string=} skip whether to skip row or column
 * @private
 */
DvtDataGrid.prototype._updateContextInfo = function(context, skip)
{
    var row, column, info, text, level, rowHeader, columnHeader;

    row = context['row'];
    column = context['column'];
    level = context['level'];
    rowHeader = context['rowHeader'];
    columnHeader = context['columnHeader'];
    info = "";

    // row context.  Skip if there is an outstanding accessible row context
    if (this.m_accessibleContext == null && !isNaN(row) && skip != 'row')
    {
        text = this.getResources().getTranslatedText('accessibleRowContext', {'index': row + 1});
        if (text != null)
        {
            info = text;
        }
    }

    // column context
    if (!isNaN(column) && skip != 'column')
    {
        text = this.getResources().getTranslatedText('accessibleColumnContext', {'index': column + 1});
        if (text != null)
        {
            if (info.length === 0)
            {
                info = text;
            }
            else
            {
                info = info + ' ' + text;
            }
        }
    }

    // rowHeader context
    if (!isNaN(rowHeader) && skip != 'rowHeader')
    {
        text = this.getResources().getTranslatedText('accessibleRowHeaderContext', {'index': rowHeader + 1});
        if (text != null)
        {
            info = info.length === 0 ? text : info + ' ' + text;
        }
    }

    // columHeader context
    if (!isNaN(columnHeader) && skip != 'columnHeader')
    {
        text = this.getResources().getTranslatedText('accessibleColumnHeaderContext', {'index': columnHeader + 1});
        if (text != null)
        {
            info = info.length === 0 ? text : info + ' ' + text;
        }
    }

    // level context
    if (!isNaN(level) && skip != 'level')
    {
        text = this.getResources().getTranslatedText('accessibleLevelContext', {'level': level + 1});
        if (text != null)
        {
            info = info.length === 0 ? text : info + ' ' + text;
        }
    }

    // merge with accesssible context (from row expander)
    if (this.m_accessibleContext != null)
    {
        info = info + ', ' + this.m_accessibleContext;
        // reset
        this.m_accessibleContext = null;
    }

    this.m_contextInfo.textContent = info;
};

/**
 * Determine whether the row/column count is unknown.
 * @param {string} axis the row/column axis
 * @return {boolean} true if the count for the axis is unknown, false otherwise
 * @private
 */
DvtDataGrid.prototype._isCountUnknown = function(axis)
{
    var datasource, rowPrecision, colPrecision, rowCount, colCount;

    datasource = this.getDataSource();
    if (axis === 'row')
    {
        if (this.m_isEstimateRowCount === undefined)
        {
            rowPrecision = datasource.getCountPrecision('row');
            rowCount = datasource.getCount('row');
            if (rowPrecision === 'estimate' || rowCount < 0)
            {
                this.m_isEstimateRowCount = true;
            }
            else
            {
                this.m_isEstimateRowCount = false;
            }
        }

        return this.m_isEstimateRowCount;
    }
    else if (axis === 'column')
    {
        if (this.m_isEstimateColumnCount === undefined)
        {
            colPrecision = datasource.getCountPrecision('column');
            colCount = datasource.getCount('column');
            if (colPrecision === 'estimate' || colCount < 0)
            {
                this.m_isEstimateColumnCount = true;
            }
            else
            {
                this.m_isEstimateColumnCount = false;
            }
        }

        return this.m_isEstimateColumnCount;
    }

    // unrecognize axis, just assume the count is known
    return false;
};

/**
 * Convenient method which returns true if row count is unknown or high watermark scrolling is used.
 * @param {string} axis the row/column axis
 * @return {boolean} true if count is unknown or high watermark scrolling is used, false otherwise.
 * @private
 */
DvtDataGrid.prototype._isCountUnknownOrHighwatermark = function(axis)
{
    return (this._isCountUnknown(axis) || this._isHighWatermarkScrolling());
};

/**
 * Build a header div
 * @param {string} axis - 'row' or 'column'
 * @param {string} styleClass - class to set on the header
 * @return {Element} the root of the header
 */
DvtDataGrid.prototype.buildHeaders = function(axis, styleClass)
{
    var root = document.createElement("div");
    root['id'] = this.createSubId(axis + "Header");
    root['className'] = styleClass + " " + this.getMappedStyle("header");

    if (axis === 'column')
    {
        this.m_colHeader = root;
    }
    else if (axis === 'row')
    {
        this.m_rowHeader = root;
    }

    this.fetchHeaders(axis, 0, root);

    return root;
};

/**
 * Fetch the headers by calling the fetch headers method on the data source. Pass
 * callbacks for success and error to the data source.
 * @param {string} axis - 'row' or 'column'
 * @param {number} start - index to start fetching at
 * @param {Element} header - the root element of the axis header
 * @param {number=} fetchSize - number of headers to fetch
 * @param {Object=} callbacks - the optional callbacks to invoke when the fetch success or fail
 * @protected
 */
DvtDataGrid.prototype.fetchHeaders = function(axis, start, header, fetchSize, callbacks)
{
    var headerRange, successCallback;
    // check if we are already fetching
    if (!this.m_fetching[axis])
    {
        this.m_fetching[axis] = {'start': start};
    }
    else
    {
        return;
    }

    // fetch size could be explicitly specified.  If not, use the calculated one.
    if (fetchSize == undefined)
    {
        fetchSize = this.getFetchSize(axis);
    }

    headerRange = {
        "axis": axis, "start": start, "count": fetchSize, "header": header
    };

    // check if overriding callbacks are specified
    if (callbacks != null && callbacks['success'] != null)
    {
        successCallback = callbacks['success'];
    }
    else
    {
        successCallback = this.handleHeadersFetchSuccess;
    }

    this.showStatusText();
    // start fetch
    this._signalTaskStart();
    this.getDataSource().fetchHeaders(headerRange, {
        "success": successCallback, "error": this.handleHeadersFetchError
    }, {'success': this, 'error': this});
};

/**
 * Checks whether header fetch result match the request
 * @param {Object} headerRange the header range for the response
 * @protected
 */
DvtDataGrid.prototype.isHeaderFetchResponseValid = function(headerRange)
{
    var axis, requestStart, responseStart;

    axis = headerRange['axis'];
    requestStart = headerRange['start'];
    responseStart = this.m_fetching[axis]['start'];

    // note we are not checking size since the actual return size might be different
    // then the request size (ex, no more rows)
    return (requestStart == responseStart);
};

/**
 * Handle a successful call to the data source fetchHeaders
 * @param {Array.<(Object|string)>} results - an array of headers returned from the dataSource
 * @param {Object} headerRange - {"axis":,"start":,"count":,"header":}
 * @param {boolean} rowInsert - if this is triggered by a row insert event
 * @protected
 */
DvtDataGrid.prototype.handleHeadersFetchSuccess = function(results, headerRange, rowInsert)
{
    var axis, root, start, count;

    // validate result matches what we currently asks for
    if (!this.isHeaderFetchResponseValid(headerRange))
    {
        // end fetch
        this._signalTaskEnd();
        // not valid, so ignore result
        return;
    }

    // remove fetching message
    axis = headerRange["axis"];
    this.m_fetching[axis] = false;

    root = headerRange["header"];
    start = headerRange["start"];
    count = this.getDataSource().getCount(axis);

    if (axis === "column")
    {
        this.buildColumnHeaders(root, results, start, count);
        if (results.getCount() < headerRange['count'])
        {
            this.m_stopColumnHeaderFetch = true;
        }
    }
    else if (axis === "row")
    {
        this.buildRowHeaders(root, results, start, count, rowInsert);
        if (results.getCount() < headerRange['count'])
        {
            this.m_stopRowHeaderFetch = true;
        }
    }

    if (this.isFetchComplete())
    {
        this.hideStatusText();
        if (this._shouldInitialize() && !rowInsert)
        {
            this._handleInitialization(true);
        }
    }

    if (this.m_initialized)
    {
        // check if we need to sync header scroll position
        this._syncScroller();
    }

    // end fetch
    this._signalTaskEnd();
};

/**
 * Handle an unsuccessful call to the data source fetchHeaders
 * @param {Error} error - the error returned from the data source
 * @param {Object} headerRange - keys of {axis,start,count,header}
 */
DvtDataGrid.prototype.handleHeadersFetchError = function(error, headerRange)
{
    // remove fetching message
    var axis = headerRange["axis"];
    this.m_fetching[axis] = false;
    // end fetch
    this._signalTaskEnd();
};

/**
 * Build a header context object for a header and return it
 * The header elem and the data can be set to null for cases where there are no headers
 * but varying height and width are desired
 * @param {string} axis - 'row' or 'column'
 * @param {number} index - the index of the header
 * @param {Object|null} data - the data the cell contains
 * @param {Object} metadata - the metadata the cell contains
 * @param {Element|null} elem - the header element
 * @param {number} level - the header level
 * @param {number} extent - the header extent
 * @param {number} depth - the header depth
 * @return {Object} the header context object, keys of {axis,index,data,key,datagrid}
 */
DvtDataGrid.prototype.createHeaderContext = function(axis, index, data, metadata, elem, level, extent, depth)
{
    var headerContext, key, prop;
    headerContext = {
    };
    headerContext['axis'] = axis;
    headerContext['index'] = index;
    headerContext['data'] = data;
    headerContext['component'] = this;
    headerContext['datasource'] = this.getDataSource();
    headerContext['level'] = level;
    headerContext['depth'] = depth;
    headerContext['extent'] = extent;

    //set the parent element to the content div
    if (elem != null)
    {
        headerContext['parentElement'] = elem['firstChild'];
    }

    key = metadata['key'];
    if (key != null && elem != null)
    {
        // store the key in the header element for fast retrieval
        this._setKey(elem, key);
    }

    // merge properties from metadata into cell context
    // the properties in metadata would have precedence
    for (prop in metadata)
    {
        if (metadata.hasOwnProperty(prop))
        {
            headerContext[prop] = metadata[prop];
        }
    }

    // invoke callback to allow ojDataGrid to change datagrid reference
    if (this.m_createContextCallback != null)
    {
        this.m_createContextCallback.call(this, headerContext);
    }

    return headerContext;
};

/**
 * Build column headers from the header data and start index.
 * @param {Element} headerRoot - the root element of the column headers
 * @param {Object} headerSet - the header data returned from the data source
 * @param {number} start - the column index that the to start building at
 * @param {string} totalCount - the total number of columns in the table
 */
DvtDataGrid.prototype.buildColumnHeaders = function(headerRoot, headerSet, start, totalCount)
{
    var scroller, renderer, totalColumnWidth, left, headerCount, c, index, isAppend, fragment, returnVal, avgWidth, className;

    //set the header level count
    if (this.m_columnHeaderLevelCount == null)
    {
        this.m_columnHeaderLevelCount = headerSet.getLevelCount();
    }
    headerCount = headerSet.getCount();

    // check if this is the first time column header is populated
    if (!headerRoot.hasChildNodes())
    {
        scroller = document.createElement("div");
        scroller['className'] = this.getMappedStyle("scroller") + (this.m_utils.isTouchDevice() ? " " + this.getMappedStyle("scroller-mobile") : "");

        // if no column headers
        if (headerCount == 0)
        {
            //remove any height set inline style and remove class name
            headerRoot['className'] = '';
            this.setElementHeight(headerRoot, 0);
            this.setElementHeight(scroller, 0);
            this.m_stopColumnHeaderFetch = true;
        }
    }
    else
    {
        // if unknown count and there's no more column, mark it so we won't try to fetch again
        if (headerCount == 0 && this._isCountUnknown("column"))
        {
            this.m_stopColumnHeaderFetch = true;
            return;
        }
        scroller = headerRoot['firstChild'];
        //add class name back if header populated later
        if (this.m_endColHeader == -1 && headerRoot['className'] == '')
        {
            headerRoot['className'] = this.getMappedStyle('colheader') + ' ' + this.getMappedStyle('header');
            headerRoot['style']['height'] = '';
            scroller['style']['height'] = '';
        }
    }

    renderer = this.m_options.getRenderer("column");
    totalColumnWidth = 0;
    isAppend = start > this.m_endColHeader;
    left = isAppend ? this.m_endColHeaderPixel : this.m_startColHeaderPixel;
    fragment = document.createDocumentFragment();
    c = 0;
    className = this.getMappedStyle("headercell") + " " + this.getMappedStyle("colheadercell");
    while (headerCount - c > 0)
    {
        if (isAppend)
        {
            index = start + c;
        }
        else
        {
            index = start + (headerCount - 1 - c);
        }

        returnVal = this.buildLevelHeaders(fragment, index, 0, isAppend ? left + totalColumnWidth : left - totalColumnWidth, 0, isAppend, false, renderer, headerSet, 'column', className, this.m_columnHeaderLevelCount);
        //increment the count over the extent of the header
        c += returnVal['count'];
        totalColumnWidth += returnVal['totalWidth'];
        //set the height of the columnHeader container to that of the total of the levels
        if (this.m_colHeaderHeight == null)
        {
            this.m_colHeaderHeight = returnVal['totalHeight'];
            this.setElementHeight(headerRoot, this.m_colHeaderHeight);
        }
    }

    if (isAppend)
    {
        scroller.appendChild(fragment); //@HTMLUpdateOK
    }
    else
    {
        scroller.insertBefore(fragment, scroller['firstChild']); //@HTMLUpdateOK
    }

    // whether this is adding columns to the left or right
    if (!isAppend)
    {
        // to the left
        this.m_startColHeader = this.m_startColHeader - headerCount;
        this.m_startColHeaderPixel = this.m_startColHeaderPixel - totalColumnWidth;
    }
    else
    {
        // to the right, in case of long scroll this should alwats be the end header of the set
        this.m_endColHeader = start + headerCount - 1;
        this.m_endColHeaderPixel = this.m_endColHeaderPixel + totalColumnWidth;
    }

    if (!headerRoot.hasChildNodes())
    {
        headerRoot.appendChild(scroller); //@HTMLUpdateOK
    }

    // stop subsequent fetching if highwatermark scrolling is used and we have reach the last row, flag it.
    if (!this._isCountUnknown("column") && this._isHighWatermarkScrolling() && this.m_endColHeader + 1 >= totalCount)
    {
        this.m_stopColumnHeaderFetch = true;
    }
};

/**
 * Build headers along an axis recursively building them within the set
 * @param {Element} fragment the fragment to append the headers to
 * @param {number} index the index to begin rendering at
 * @param {number} level the level of the header to build at
 * @param {number} left the left value of the headers
 * @param {number} top the top value to start at
 * @param {boolean} isAppend is appending after
 * @param {boolean} insert is row or column insert
 * @param {function=} renderer header renderer
 * @param {Object} headerSet object
 * @param {string} axis column or row
 * @param {string} className string of the class names to be applied to the headers
 * @param {number} totalLevels the number of levels on the header
 * @returns {Object}
 */
DvtDataGrid.prototype.buildLevelHeaders = function(fragment, index, level, left, top, isAppend, insert, renderer, headerSet, axis, className, totalLevels)
{
    var getLevelDimension, getHeaderDimension, levelDimension, headerDimension, dimensionToAdjust, dimensionToAdjustValue, dimensionSecond, dimensionSecondValue,
            totalLevelDimension, totalHeaderDimension, start, end, getGrouping, extentInfo, headerExtent, patchBefore, patchAfter, groupingContainer,
            header, returnVal, i, levelDimensionValue, headerDimensionValue, totalHeaderDimensionValue, headerCount, headerData, headerMetadata, headerContext,
            headerContent, headerDepth, inlineStyle, styleClass, nextIndex, totalLevelDimensionValue, returnObj, content, textWrapper, sortIcon, d;

    levelDimensionValue = 0;
    totalLevelDimensionValue = 0;
    totalHeaderDimensionValue = 0;
    headerCount = 0;

    if (axis === 'row')
    {
        getLevelDimension = this._getRowHeaderLevelWidth.bind(this);
        getHeaderDimension = this.getRowHeight.bind(this);
        getGrouping = this._getRowHeaderContainer.bind(this);
        levelDimension = 'width';
        headerDimension = 'height';
        dimensionToAdjust = 'top';
        dimensionToAdjustValue = top;
        dimensionSecond = this.getResources().isRTLMode() ? "right" : "left";
        dimensionSecondValue = left;
        totalLevelDimension = 'totalWidth';
        totalHeaderDimension = 'totalHeight';
        start = this.m_startRowHeader;
        end = this.m_endRowHeader;
    }
    else
    {
        getLevelDimension = this._getColumnHeaderLevelHeight.bind(this);
        getHeaderDimension = this.getColumnWidth.bind(this);
        getGrouping = this._getColumnHeaderContainer.bind(this);
        levelDimension = 'height';
        headerDimension = 'width';
        dimensionToAdjust = this.getResources().isRTLMode() ? "right" : "left";
        dimensionToAdjustValue = left;
        dimensionSecond = 'top';
        dimensionSecondValue = top;
        totalLevelDimension = 'totalHeight';
        totalHeaderDimension = 'totalWidth';
        start = this.m_startColHeader;
        end = this.m_endColHeader;
    }

    //get the extent info
    extentInfo = headerSet.getExtent(index, level);
    headerExtent = extentInfo['extent'];
    patchBefore = extentInfo['more']['before'];
    patchAfter = extentInfo['more']['after'];
    headerDepth = headerSet.getDepth(index, level);

    // if the data source says to patch before this header
    // and the index is 1 more than what is currently in the viewport
    // get the groupingContainer and add to it
    if (patchBefore && index === end + 1)
    {
        // get the grouping of the container at the previous index
        groupingContainer = getGrouping(index - 1, level, 0);
        // increment the extent stored in the grouping container
        this._setAttribute(groupingContainer, 'extent', this._getAttribute(groupingContainer, 'extent', true) + headerExtent);
        header = groupingContainer['firstChild'];
        levelDimensionValue = this.getElementDir(header, levelDimension);
        // add columns to that grouping container
        for (i = 0; i < headerExtent; i)
        {
            if (axis === 'column')
            {
                returnVal = this.buildLevelHeaders(groupingContainer, index + i, level + headerDepth, dimensionToAdjustValue, dimensionSecondValue + levelDimensionValue, isAppend, insert, renderer, headerSet, axis, className, totalLevels);
            }
            else
            {
                returnVal = this.buildLevelHeaders(groupingContainer, index + i, level + headerDepth, dimensionSecondValue + levelDimensionValue, dimensionToAdjustValue, isAppend, insert, renderer, headerSet, axis, className, totalLevels);
            }
            // increment the left and total and count and skip ahead to the next header
            dimensionToAdjustValue += returnVal[totalHeaderDimension];
            totalHeaderDimensionValue += returnVal[totalHeaderDimension];
            headerCount += returnVal['count'];
            i += returnVal['count'];
        }
        // adjust the header size based on the total of the new sizes passed back
        this.setElementDir(header, this.getElementDir(header, headerDimension) + totalHeaderDimensionValue, headerDimension);
    }
    // if the data source says to patch after this header
    // and the index is 1 less than what is currently in the viewport
    // get the groupingContainer and add to it
    else if (patchAfter && index === start - 1)
    {
        // get the grouping of the container at the previous index
        groupingContainer = getGrouping(index + 1, level, 0);
        // increment the extent stored in the grouping container
        this._setAttribute(groupingContainer, 'extent', this._getAttribute(groupingContainer, 'extent', true) + headerExtent);
        // decrement the start stored in the grouping container, since inserting before
        this._setAttribute(groupingContainer, 'start', this._getAttribute(groupingContainer, 'start', true) - headerExtent);
        header = groupingContainer['firstChild'];
        levelDimensionValue = this.getElementDir(header, levelDimension);
        for (i = 0; i < headerExtent; i)
        {
            if (axis === 'column')
            {
                returnVal = this.buildLevelHeaders(groupingContainer, index - i, level + headerDepth, dimensionToAdjustValue, dimensionSecondValue + levelDimensionValue, isAppend, insert, renderer, headerSet, axis, className, totalLevels);
            }
            else
            {
                returnVal = this.buildLevelHeaders(groupingContainer, index - i, level + headerDepth, dimensionSecondValue + levelDimensionValue, dimensionToAdjustValue, isAppend, insert, renderer, headerSet, axis, className, totalLevels);
            }
            dimensionToAdjustValue -= returnVal[totalHeaderDimension];
            totalHeaderDimensionValue += returnVal[totalHeaderDimension];
            headerCount += returnVal['count'];
            i += returnVal['count'];
        }
        this.setElementDir(header, this.getElementDir(header, headerDimension) + totalHeaderDimensionValue, headerDimension);
        this.setElementDir(header, dimensionToAdjustValue, dimensionToAdjust);
    }
    else
    {
        //get the information from the headers
        headerData = headerSet.getData(index, level);
        headerMetadata = headerSet.getMetadata(index, level);

        //create the header content area
        headerContent = document.createElement("div");
        headerContent['className'] = this.getMappedStyle("headercellcontent");

        //create the header element and append the content to it
        header = document.createElement("div");
        header.appendChild(headerContent); //@HTMLUpdateOK

        //build headerContext to pass to renderer
        headerContext = this.createHeaderContext(axis, index, headerData, headerMetadata, header, level, headerExtent, headerDepth);
        header['id'] = this._createHeaderId(axis, headerContext['key']);
        header[this.getResources().getMappedAttribute('context')] = headerContext;
        inlineStyle = this.m_options.getInlineStyle(axis, headerContext);
        styleClass = this.m_options.getStyleClass(axis, headerContext);

        //add inline styles to the column header cell
        if (inlineStyle != null)
        {
            header['style']['cssText'] = inlineStyle;
        }

        //add class names to the column header cell
        header['className'] = className;
        if (styleClass != null)
        {
            header['className'] += " " + styleClass;
        }

        // iterate over all levels to determine the dimension value for depth greater than 1
        for (d = 0; d < headerDepth; d++)
        {
            levelDimensionValue += getLevelDimension(level + d, header);
        }
        this.setElementDir(header, dimensionToAdjustValue, dimensionToAdjust);
        this.setElementDir(header, dimensionSecondValue, dimensionSecond);
        this.setElementDir(header, levelDimensionValue, levelDimension);

        //find the size in case it depends on the classes, will be set in the appropriate case
        headerDimensionValue = getHeaderDimension(header, headerContext['key']);
        this._setAttribute(header, 'depth', headerDepth);

        //if this is an outer level then add a groupingContainer around it
        if (level != totalLevels - 1)
        {
            groupingContainer = document.createElement("div");
            groupingContainer['className'] = this.getMappedStyle('groupingcontainer');
            groupingContainer.appendChild(header); //@HTMLUpdateOK
            this._setAttribute(groupingContainer, 'start', isAppend ? index : index - headerExtent + 1);
            this._setAttribute(groupingContainer, 'extent', headerExtent);
            this._setAttribute(groupingContainer, 'level', level);
        }

        if (level + headerDepth == totalLevels)
        {
            // set the px width on the header regardless of unit type currently on it
            this.setElementDir(header, headerDimensionValue, headerDimension);
            totalHeaderDimensionValue += headerDimensionValue;
            headerCount++;
            totalLevelDimensionValue = levelDimensionValue;
            if (!(isAppend || insert))
            {
                dimensionToAdjustValue -= headerDimensionValue;
                this.setElementDir(header, dimensionToAdjustValue, dimensionToAdjust);
            }
        }
        else
        {
            for (i = 0; i < headerExtent; i++)
            {
                nextIndex = isAppend ? index + i : index - i;
                if (axis === 'column')
                {
                    returnVal = this.buildLevelHeaders(groupingContainer, nextIndex, level + headerDepth, dimensionToAdjustValue, dimensionSecondValue + levelDimensionValue, isAppend, insert, renderer, headerSet, axis, className, totalLevels);
                }
                else
                {
                    returnVal = this.buildLevelHeaders(groupingContainer, nextIndex, level + headerDepth, dimensionSecondValue + levelDimensionValue, dimensionToAdjustValue, isAppend, insert, renderer, headerSet, axis, className, totalLevels);
                }
                headerDimensionValue = returnVal[totalHeaderDimension];
                dimensionToAdjustValue = isAppend ? dimensionToAdjustValue + headerDimensionValue : dimensionToAdjustValue - headerDimensionValue;
                totalHeaderDimensionValue += headerDimensionValue;
                headerCount += returnVal['count'];
                i += returnVal['count'] - 1;
            }
            totalLevelDimensionValue = levelDimensionValue + returnVal[totalLevelDimension];
            if (!(isAppend || insert))
            {
                this.setElementDir(header, dimensionToAdjustValue, dimensionToAdjust);
            }
            this.setElementDir(header, totalHeaderDimensionValue, headerDimension);
        }

        //do not put borders on last header cell, treat the index as the index + extent
        if (axis === 'column')
        {
            if ((this._isLastColumn(index + headerExtent - 1) && this.getRowHeaderWidth() + dimensionToAdjustValue + headerDimensionValue >= this.getWidth()))
            {
                if (dimensionToAdjust === 'left')
                {
                    header['style']['borderRightStyle'] = 'none';
                }
                else
                {
                    header['style']['borderLeftStyle'] = 'none';
                }
            }
        }
        else
        {
            //do not put bottom border on last row, pass the index + extent to see if it's the last index
            if (this._isLastRow(index + headerExtent - 1) && this.getColumnHeaderHeight() + dimensionToAdjustValue + headerDimensionValue >= this.getHeight())
            {
                header['style']['borderBottomStyle'] = 'none';
            }
        }

        //add resizable attribute if resize enabled
        if (this._isHeaderResizeEnabled(axis, headerContext))
        {
            this._setAttribute(header, 'resizable', "true");
        }

        // Temporarily add groupingContainer or header into this.m_root to have them in active DOM before rendering contents
        if (groupingContainer != null)
        {
            this.m_root.appendChild(groupingContainer); //@HTMLUpdateOK
        }
        else
        {
            this.m_root.appendChild(header); //@HTMLUpdateOK
        }

        if (renderer != null)
        {
            // if an element is returned from the renderer and the parent of that element is null, we will append
            // the returned element to the parentElement.  If non-null, we won't do anything, assuming that the
            // rendered content has already added into the DOM somewhere.
            content = renderer.call(this, headerContext);
            if (content != null)
            {
                if (content['parentNode'] === null)
                {
                    headerContent.appendChild(content); //@HTMLUpdateOK
                }
                else if (content['parentNode'] != null)
                {
                    // parent node exists, do nothing
                }
                else if (content.toString)
                {
                    textWrapper = document.createElement("span");
                    textWrapper['className'] = this.getMappedStyle("headercelltext");
                    textWrapper.appendChild(document.createTextNode(content.toString())); //@HTMLUpdateOK
                    headerContent.appendChild(textWrapper); //@HTMLUpdateOK
                }
            }

            // make all focusable elements non-focusable, since we want to manage tab stops
            this._disableAllFocusableElements(header);
        }
        else
        {
            if(headerData == null)
            {
                headerData = "";
            }
            textWrapper = document.createElement("span");
            textWrapper['className'] = this.getMappedStyle("headercelltext");
            textWrapper.appendChild(document.createTextNode(headerData.toString())); //@HTMLUpdateOK
            headerContent.appendChild(textWrapper); //@HTMLUpdateOK
        }

        if (axis === 'column')
        {
            // check if we need to render sort icons
            if (this._isSortEnabled(axis, headerContext))
            {
                if (headerMetadata['sortDirection'] != null && this.m_sortInfo == null)
                {
                    this.m_sortInfo = {};
                    this.m_sortInfo['key'] = headerMetadata['key'];
                    this.m_sortInfo['direction'] = headerMetadata['sortDirection'];
                    this.m_sortInfo['axis'] = axis;
                }

                sortIcon = this._buildSortIcon(headerContext);
                header.appendChild(sortIcon); //@HTMLUpdateOK
                this._setAttribute(header, 'sortable', "true");
            }
        }

        if (isAppend) // Moves groupingContainer/header from this.m_root to fragment
        {
            // if we are appending to the end, if there is a grouping container append that, if not just append the row header
            if (groupingContainer != null)
            {
                fragment.appendChild(groupingContainer); //@HTMLUpdateOK
            }
            else
            {
                fragment.appendChild(header); //@HTMLUpdateOK
            }
        }
        else
        {
            // if we are not appending to the end
            // if there is a grouping container append that to the fragment
            if (groupingContainer != null)
            {
                // if the fragment already has a firstChild we want to insert before it
                if (fragment['firstChild'])
                {
                    //if the firstChild is a groupingContainer just insert before it
                    if (this.m_utils.containsCSSClassName(fragment['firstChild'], this.getMappedStyle('groupingcontainer')))
                    {
                        fragment.insertBefore(groupingContainer, fragment['firstChild']); //@HTMLUpdateOK
                    }
                    //if the firstChild is a cell need to insert after it
                    else if (this.m_utils.containsCSSClassName(fragment['firstChild'], this.getMappedStyle('headercell')))
                    {
                        fragment.insertBefore(groupingContainer, fragment['firstChild']['nextSibling']); //@HTMLUpdateOK
                    }
                }
                else
                {
                    fragment.appendChild(groupingContainer); //@HTMLUpdateOK
                }
            }
            // if the fragment itself is a grouping container insert before the other grouping containers
            else if (this.m_utils.containsCSSClassName(fragment, this.getMappedStyle('groupingcontainer')))
            {
                fragment.insertBefore(header, fragment['firstChild']['nextSibling']); //@HTMLUpdateOK
            }
            // otherwise just insert the header at the beginning of the fragment
            else
            {
                fragment.insertBefore(header, fragment['firstChild']); //@HTMLUpdateOK
            }
        }
    }

    // return value is the totalHeight of the rendered headers at this level,
    // the total count of headers rendered at that level,
    // and the totalWidth of the levels underneath it
    returnObj = {};
    returnObj[totalLevelDimension] = totalLevelDimensionValue;
    returnObj[totalHeaderDimension] = totalHeaderDimensionValue;
    returnObj['count'] = headerCount;
    return returnObj;
};

/**
 * Build row headers from the header data and start index.
 * @param {Element} headerRoot - the root element of the row headers
 * @param {Object} headerSet - the header data returned from the data source
 * @param {number} start - the row index that the to start building at
 * @param {string} totalCount - the total number of rows in the table
 * @param {boolean=} rowInsert - if the row headers are being inserted
 * @param {boolean=} animation - flag for rowheader expand/collapse support
 */
DvtDataGrid.prototype.buildRowHeaders = function(headerRoot, headerSet, start, totalCount, rowInsert, animation)
{
    var headerCount, scroller, renderer, isAppend, top, totalRowHeight, className,
            fragment, index, prev, rowHeaderContent, referenceRow, returnVal, c;

    if (this.m_rowHeaderLevelCount == null)
    {
        this.m_rowHeaderLevelCount = headerSet.getLevelCount();
    }

    headerCount = headerSet.getCount();

    if (!animation)
    {
        // check if this is the first time row header is populated
        if (!headerRoot.hasChildNodes())
        {
            scroller = document.createElement("div");
            scroller['className'] = this.getMappedStyle("scroller") + (this.m_utils.isTouchDevice() ? " " + this.getMappedStyle("scroller-mobile") : "");

            if (headerCount == 0)
            {
                //remove any height set inline style and remove class name
                headerRoot['className'] = '';
                this.setElementWidth(headerRoot, 0);
                this.setElementWidth(scroller, 0);
                this.m_stopRowHeaderFetch = true;
            }
        }
        else
        {
            // if unknown count and there's no more row, mark it so we won't try to fetch again
            if (headerCount == 0 && this._isCountUnknown("row"))
            {
                this.m_stopRowHeaderFetch = true;
                return;
            }
            scroller = headerRoot['firstChild'];
            //add class name back if header populated later
            if (this.m_endRowHeader == -1 && headerRoot['className'] == '')
            {
                headerRoot['className'] = this.getMappedStyle('rowheader') + ' ' + this.getMappedStyle('header');
                headerRoot['style']['width'] = '';
                scroller['style']['width'] = '';
            }
        }
    }
    renderer = this.m_options.getRenderer("row");

    // whether this is adding rows to bottom (append) or top (insert)
    isAppend = start > this.m_endRowHeader ? true : false;

    if (isAppend)
    {
        top = this.m_endRowHeaderPixel;
    }
    else if (rowInsert)
    {
        rowHeaderContent = headerRoot['firstChild'];
        referenceRow = rowHeaderContent['childNodes'][start - this.m_startRowHeader];
        top = this.getElementDir(referenceRow, 'top');
    }
    else
    {
        top = this.m_startRowHeaderPixel;
    }

    // if total row count is unknown, then calculate it using current count and fetch count
    if (totalCount == -1)
    {
        totalCount = this.m_endRowHeader + headerCount;
    }

    totalRowHeight = 0;
    fragment = document.createDocumentFragment();
    c = 0;
    className = this.getMappedStyle("row") + " " + this.getMappedStyle("headercell") + " " + this.getMappedStyle("rowheadercell");

    while (headerCount - c > 0)
    {
        if (isAppend)
        {
            index = start + c;
        }
        else
        {
            index = start + (headerCount - 1 - c);
        }
        returnVal = this.buildLevelHeaders(fragment, index, 0, 0, isAppend ? top + totalRowHeight : top - totalRowHeight, isAppend, rowInsert, renderer, headerSet, 'row', className, this.m_rowHeaderLevelCount);
        c += returnVal['count'];
        totalRowHeight += returnVal['totalHeight'];
        if (this.m_rowHeaderWidth == null)
        {
            this.m_rowHeaderWidth = returnVal['totalWidth'];
            this.setElementWidth(headerRoot, this.m_rowHeaderWidth);
        }
    }
    if (animation)
    {
        return fragment;
    }

    if (isAppend && headerCount != 0)
    {
        scroller.appendChild(fragment); //@HTMLUpdateOK
        //if appending a row header, make sure the previous fragment has a bottom border if it was the last
        if (this.m_endRowHeader != -1 && headerCount != 0)
        {
            //get the last header in the scroller
            prev = scroller['childNodes'][this.m_endRowHeader - this.m_startRowHeader];
            if (prev != null)
            {
                prev['firstChild']['style']['borderBottomStyle'] = '';
            }
        }
        //in case of a long scroll the end should always be the start plus the count - 1 for 0 indexing
        this.m_endRowHeader = start + headerCount - 1;
        this.m_endRowHeaderPixel = this.m_endRowHeaderPixel + totalRowHeight;
    }
    else if (rowInsert)
    {
        rowHeaderContent.insertBefore(fragment, referenceRow); //@HTMLUpdateOK
        if (start < this.m_startRowHeader)
        {
            // added before the start
            this.m_startRowHeader = start;
            this.m_startRowHeaderPixel = Math.max(0, this.m_startRowHeaderPixel - totalRowHeight);

        }
        //update the endRowHeader and endRowheaderPixel no matter where we insert
        this.m_endRowHeader = this.m_endRowHeader + headerCount;

        this.m_endRowHeaderPixel = Math.max(0, this.m_endRowHeaderPixel + totalRowHeight);
        this.pushRowHeadersDown(referenceRow, totalRowHeight);
    }
    else
    {
        scroller.insertBefore(fragment, scroller['firstChild']); //@HTMLUpdateOK
        this.m_startRowHeader = Math.max(0, this.m_startRowHeader - headerCount);
        this.m_startRowHeaderPixel = Math.max(0, this.m_startRowHeaderPixel - totalRowHeight);
    }

    if (!rowInsert)
    {
        headerRoot.appendChild(scroller); //@HTMLUpdateOK
    }

    // stop subsequent fetching if highwatermark scrolling is used and we have reach the last row, flag it.
    if (!this._isCountUnknown("row") && this._isHighWatermarkScrolling() && this.m_endRowHeader + 1 >= totalCount)
    {
        this.m_stopRowHeaderFetch = true;
    }

};

/**
 * Get the row header container surrounding the row headers at that level.
 * The structure of a container is as follows
 * firstChild: header at that level
 * subsequent: children are grouping containers except at the innermost level
 * @param {number} index
 * @param {number} level
 * @param {number} currentLevel
 * @param {Array=} rowHeaders
 * @returns {Element|null}
 * @private
 */
DvtDataGrid.prototype._getRowHeaderContainer = function(index, level, currentLevel, rowHeaders)
{
    var headerIndex, headerExtent, headerDepth, i;
    if (rowHeaders == null)
    {
        rowHeaders = this.m_rowHeader['firstChild']['childNodes'];
        // if we are on the scroller children there is no first header so start at the first header in the list
        i = 0;
    }
    else
    {
        // if we are on a groupingContainer skip the first header which should be a row header at that level
        i = 1;
    }

    // if the innermost parent then just return the parent
    if (currentLevel === this.m_rowHeaderLevelCount - 1)
    {
        return rowHeaders[0]['parentNode'];
    }

    // loop over all headers skipping firstChild of groups
    for (i; i < rowHeaders.length; i++)
    {
        // if the index is between that header start and start+extent dig deeper
        headerIndex = this._getAttribute(rowHeaders[i], 'start', true);
        headerExtent = this._getAttribute(rowHeaders[i], 'extent', true);
        headerDepth = this._getAttribute(rowHeaders[i]['firstChild'], 'depth', true);
        if (index >= headerIndex && index < headerIndex + headerExtent)
        {
            if (level < currentLevel + headerDepth)
            {
                return rowHeaders[i];
            }
            return this._getRowHeaderContainer(index, level, currentLevel + headerDepth, rowHeaders[i]['childNodes']);
        }
    }
    return null;
};

/**
 * Get the row header at a particular index and level
 * @param {number} index
 * @param {number} level
 * @returns {Element|null}
 * @private
 */
DvtDataGrid.prototype._getRowHeaderByIndex = function(index, level)
{
    var relativeIndex, rowHeaderContent, rowHeaderContainer, start;
    if (level < 0)
    {
        return null;
    }
    // if there is only one level just get the header by index in the row ehader
    if (this.m_rowHeaderLevelCount === 1)
    {
        rowHeaderContent = this.m_rowHeader['firstChild']['childNodes'];
        relativeIndex = index - this.m_startRowHeader;
        return rowHeaderContent[relativeIndex];
    }
    // otherwise get the row header container
    rowHeaderContainer = this._getRowHeaderContainer(index, level, 0);
    if (rowHeaderContainer == null)
    {
        return null;
    }

    if (level <= (this._getAttribute(rowHeaderContainer, 'level', true) + this._getAttribute(rowHeaderContainer['firstChild'], 'depth', true) - 1))
    {
        return rowHeaderContainer['firstChild'];
    }

    // if the innermost level then get the child of the container at the index
    start = this._getAttribute(rowHeaderContainer, 'start', true);
    relativeIndex = index - start + 1;
    return rowHeaderContainer['childNodes'][relativeIndex];
};

/**
 * Get the row header width at a particulat level, which will be cached if set once at that level
 * This permits the user to set the level width on the first row header at that width using renderers.
 * If it is not cached get the width
 * @param {number} level the level to get the width of
 * @param {Element} element the row header to get the width of if not cached
 * @returns {number} the width of that level
 * @private
 */
DvtDataGrid.prototype._getRowHeaderLevelWidth = function(level, element)
{
    var width;
    if (this.m_rowHeaderLevelWidths == null)
    {
        this.m_rowHeaderLevelWidths = [];
    }

    width = this.m_rowHeaderLevelWidths[level];
    if (width != null)
    {
        return width;
    }
    width = this.getElementWidth(element);
    this.m_rowHeaderLevelWidths[level] = width;
    return width;
};

/**
 * Get the column header container surrounding the column headers.
 * The structure of a container is as follows:
 * firstChild: header at that level
 * subsequent children: grouping containers except at the innermost level
 * @param {number} index
 * @param {number} level
 * @param {number} currentLevel
 * @param {Array=} columnHeaders
 * @returns {Element|null}
 * @private
 */
DvtDataGrid.prototype._getColumnHeaderContainer = function(index, level, currentLevel, columnHeaders)
{
    var headerIndex, headerExtent, headerDepth, i;
    if (columnHeaders == null)
    {
        columnHeaders = this.m_colHeader['firstChild']['childNodes'];
        // if we are on the scroller children there is no first header so start at the first header in the list
        i = 0;
    }
    else
    {
        // if we are on a groupingContainer skip the first header which should be a row header at that level
        i = 1;
    }
    // if at the innermost level just return the parent
    if (currentLevel === this.m_columnHeaderLevelCount - 1)
    {
        return columnHeaders[0]['parentNode'];
    }

    // loop over all headers skipping firstChild of groups
    for (i; i < columnHeaders.length; i++)
    {
        // if the index is between that header start and start+extent dig deeper
        headerIndex = this._getAttribute(columnHeaders[i], 'start', true);
        headerExtent = this._getAttribute(columnHeaders[i], 'extent', true);
        headerDepth = this._getAttribute(columnHeaders[i]['firstChild'], 'depth', true);
        if (index >= headerIndex && index < headerIndex + headerExtent)
        {
            if (level < currentLevel + headerDepth)
            {
                return columnHeaders[i];
            }
            return this._getColumnHeaderContainer(index, level, currentLevel + headerDepth, columnHeaders[i]['childNodes']);
        }
    }
    return null;
};

/**
 * Get the column header at a particular index and level
 * @param {number} index
 * @param {number} level
 * @returns {Element|null}
 * @private
 */
DvtDataGrid.prototype._getColumnHeaderByIndex = function(index, level)
{
    var relativeIndex, columnHeaderContent, columnHeaderContainer, start;
    if (level < 0)
    {
        return null;
    }
    // if there is only one level just get the header by index in the row ehader
    if (this.m_columnHeaderLevelCount === 1)
    {
        columnHeaderContent = this.m_colHeader['firstChild']['childNodes'];
        relativeIndex = index - this.m_startColHeader;
        return columnHeaderContent[relativeIndex];
    }
    // otherwise get the column header container
    columnHeaderContainer = this._getColumnHeaderContainer(index, level, 0);
    if (columnHeaderContainer == null)
    {
        return null;
    }

    if (level <= (this._getAttribute(columnHeaderContainer, 'level', true) + this._getAttribute(columnHeaderContainer['firstChild'], 'depth', true) - 1))
    {
        return columnHeaderContainer['firstChild'];
    }

    // if the innermost level then get the child of the container at the index
    start = this._getAttribute(columnHeaderContainer, 'start', true);
    relativeIndex = index - start + 1;
    return columnHeaderContainer['childNodes'][relativeIndex];
};

/**
 * Get the column header height at a particulat level, which will be cached if set once at that level
 * This permits the user to set the level height on the first column header at that height using renderers.
 * If it is not cached get the height
 * @param {number} level the level to get the height of
 * @param {Element} element the column header to get the height of if not cached
 * @returns {number} the height of that level
 * @private
 */
DvtDataGrid.prototype._getColumnHeaderLevelHeight = function(level, element)
{
    var height;
    if (this.m_columnHeaderLevelHeights == null)
    {
        this.m_columnHeaderLevelHeights = [];
    }

    height = this.m_columnHeaderLevelHeights[level];
    if (height != null)
    {
        return height;
    }
    height = this.getElementHeight(element);
    this.m_columnHeaderLevelHeights[level] = height;
    return height;
};

/**
 * Get the attribute value that we have set in our mapping attribute
 * @param {Element} element
 * @param {string} attributeKey
 * @param {boolean} parse
 * @returns {number|string}
 */
DvtDataGrid.prototype._getAttribute = function(element, attributeKey, parse)
{
    var value = element.getAttribute(this.getResources().getMappedAttribute(attributeKey));
    if (parse)
    {
        return parseInt(value, 10);
    }
    return value;
};

/**
 * Set a mapped attribute
 * @param {Element} element
 * @param {string} attributeKey
 * @param {string|number|boolean} value
 */
DvtDataGrid.prototype._setAttribute = function(element, attributeKey, value)
{
    element.setAttribute(this.getResources().getMappedAttribute(attributeKey), value);
};

/**
 * Build a scroller div and add scroll listeners  to it
 * @return {Element} the root of the scroller
 */
DvtDataGrid.prototype.buildScroller = function()
{
    var root = document.createElement("div");
    root['id'] = this.createSubId("scroller");
    root['className'] = this.getMappedStyle("scrollers");
    // workaround for mozilla bug 616594, where overflow div would make it focusable
    root['tabIndex'] = '-1';
    if (!root.addEventListener)
    {
        root.attachEvent("onscroll", this.handleScroll.bind(this));
    }
    else
    {
        root.addEventListener("scroll", this.handleScroll.bind(this), false);
    }

    this.m_scroller = root;
    return root;
};

/**
 * Build the databody, fetching cells as well
 * @param {Element} scroller - the root of the scroller element
 * @return {Element} the root of databody
 */
DvtDataGrid.prototype.buildDatabody = function(scroller)
{
    var root = document.createElement("div");
    root['id'] = this.createSubId("databody");
    root['className'] = this.getMappedStyle("databody");
    this.m_databody = root;

    this.fetchCells(root, scroller, 0, 0);

    return root;
};

/**
 * Fetch cells to put in the databody. Calls fetch cells on the data source,
 * setting callbacks for success and failure.
 * @param {Element} databody - the root of the databody element
 * @param {Element} scroller - the root of the scroller element
 * @param {number} rowStart - the row to start fetching at
 * @param {number} colStart - the column to start fetching at
 * @param {number|null=} rowCount - the total number of rows in the data source, if undefined then calculated
 * @param {number=} colCount - the total number of columns in the data source, if undefined then calculated
 * @param {callbacks=} callbacks - specifies success and error callbacks.  If undefined then default callbacks are used
 * @protected
 */
DvtDataGrid.prototype.fetchCells = function(databody, scroller, rowStart, colStart, rowCount, colCount, callbacks)
{
    var rowRange, columnRange, successCallback;

    // checks if we are already fetching cells
    if (!this.m_fetching['cells'])
    {
        this.m_fetching['cells'] = {'row': rowStart, 'column': colStart};
    }
    else
    {
        return;
    }

    if (rowCount == null)
    {
        rowCount = this.getFetchSize("row");
    }

    if (colCount == null)
    {
        colCount = this.getFetchSize("column");
    }

    rowRange = {
        "axis": "row", "start": rowStart, "count": rowCount
    };
    columnRange = {
        "axis": "column", "start": colStart, "count": colCount, "databody": databody, "scroller": scroller
    };

    // if there is a override success callback specified, use it, otherwise use default one
    if (callbacks != null && callbacks['success'] != null)
    {
        successCallback = callbacks['success'];
    }
    else
    {
        successCallback = this.handleCellsFetchSuccess;
    }

    this.showStatusText();
    // start fetch
    this._signalTaskStart();
    this.getDataSource().fetchCells([rowRange, columnRange], {
        "success": successCallback, "error": this.handleCellsFetchError
    }, {'success': this, 'error': this});
};

/**
 * Checks whether the response matches the current request
 * @param {Object} cellRange the cell range of the response
 * @protected
 */
DvtDataGrid.prototype.isCellFetchResponseValid = function(cellRange)
{
    var rowRange, responseRowStart, columnRange, responseColumnStart, requestCellRanges, requestRowStart, requestColumnStart;

    rowRange = cellRange[0];
    responseRowStart = rowRange['start'];

    columnRange = cellRange[1];
    responseColumnStart = columnRange['start'];

    requestCellRanges = this.m_fetching['cells'];
    requestRowStart = requestCellRanges['row'];
    requestColumnStart = requestCellRanges['column'];

    // note we are not checking size since the actual return size might be different
    // then the request size (ex, no more rows)
    return (requestRowStart == responseRowStart && requestColumnStart == responseColumnStart);
};

/**
 * Returns true if this is a long scroll (or initial scroll)
 * @return {boolean} true if it is a long or initial scroll, false otherwise
 */
DvtDataGrid.prototype.isLongScroll = function()
{
    return (this.m_startRowPixel == this.m_endRowPixel && this.m_startColPixel == this.m_endColPixel);
};

/**
 * Checks whether the result is within the current viewport
 * @param {Object} cellSet - a CellSet object which encapsulates the result set of cells
 * @param {Array.<Object>} cellRange - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 * @private
 */
DvtDataGrid.prototype.isCellFetchResponseInViewport = function(cellSet, cellRange)
{
    var rowRange, rowStart, rowEnd, columnRange, columnStart, columnEnd, rowStartPixel, rowEndPixel,
            columnStartPixel, columnEndPixel, viewportTop, viewportBottom, viewportLeft, viewportRight, rowCount, columnCount;

    if (isNaN(this.m_avgRowHeight) || isNaN(this.m_avgColWidth))
    {
        // initial scroll these are not defined so just return true
        return true;
    }

    rowRange = cellRange[0];
    rowStart = rowRange['start'];
    rowCount = cellSet.getCount("row");
    rowEnd = rowStart + rowCount;

    columnRange = cellRange[1];
    columnStart = columnRange['start'];
    columnCount = cellSet.getCount("column");
    columnEnd = columnStart + columnCount;

    // calculate the bound covered by the cellset
    rowStartPixel = this.m_avgRowHeight * rowStart;
    rowEndPixel = this.m_avgRowHeight * rowEnd;
    columnStartPixel = this.m_avgColWidth * columnStart;
    columnEndPixel = this.m_avgColWidth * columnEnd;

    // the viewport bounds, take databody width/height to account for scrollbar, header, border
    viewportTop = this.m_currentScrollTop;
    viewportBottom = this.m_currentScrollTop + this.getElementHeight(this.m_databody);
    viewportLeft = this.m_currentScrollLeft;
    viewportRight = this.m_currentScrollLeft + this.getElementWidth(this.m_databody);

    // if the all the rows and all the columns are fetched then obviously it
    // will be within the viewport
    if (!this._isCountUnknown('row') && this.getDataSource().getCount('row') == rowCount && rowEndPixel < viewportBottom)
    {
        // adjust the rowEndPixel so that it will pass the condition
        rowEndPixel = viewportBottom;
    }

    if (!this._isCountUnknown('column') && this.getDataSource().getCount('column') == columnCount && columnEndPixel < viewportRight)
    {
        // adjust the columnEndPixel so that it will pass the condition
        columnEndPixel = viewportRight;
    }

    // return true if the viewport fits inside the fetched range
    return (viewportTop >= rowStartPixel && viewportBottom <= rowEndPixel && viewportLeft >= columnStartPixel && viewportRight <= columnEndPixel);
};

/**
 * Handle a successful call to the data source fetchCells. Create new row and
 * cell DOM elements when necessary and then insert them into the databody.
 * @param {Object} cellSet - a CellSet object which encapsulates the result set of cells
 * @param {Array.<Object>} cellRange - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 * @param {boolean} rowInsert - if this is triggered by a row insert event
 * @protected
 */
DvtDataGrid.prototype.handleCellsFetchSuccess = function(cellSet, cellRange, rowInsert)
{
    var totalRowCount, totalColumnCount, defaultHeight, rowRange, rowStart, rowCount,
            rowRangeNeedsUpdate, columnRange, columnStart, columnCount, columnRangeNeedsUpdate,
            databody, top, referenceRow, scroller, inner, databodyContent,
            isAppend, fragment, totalRowHeight, i, j, avgHeight, avgWidth, duration, self,
            rows, totalColumnWidth, prev, addResult, rowheaders;
    totalRowCount = this.getDataSource().getCount("row");
    totalColumnCount = this.getDataSource().getCount("column");

    self = this;
    duration = DvtDataGrid.EXPAND_ANIMATION_DURATION;

    // if rowInsert is specified we can skip a couple of checks
    if (rowInsert === undefined)
    {
        rowInsert = false;

        // checks whether result matches what we requested
        if (!this.isCellFetchResponseValid(cellRange))
        {
            // end fetch
            this._signalTaskEnd();
            // ignore result if it is not valid
            return;
        }

        // checks if the response covers the viewport
        if (this.isLongScroll() && !this.isCellFetchResponseInViewport(cellSet, cellRange))
        {
            // clear cells fetching flag
            this.m_fetching['cells'] = false;

            // only start fetching again when the mouse has been released (note the flag is only set on mouse down)
            if (!this.m_captureScrolling)
            {
                // ignore the response and fetch another set for the current viewport
                this.handleLongScroll(this.m_currentScrollLeft, this.m_currentScrollTop);
            }
            // end fetch
            this._signalTaskEnd();
            return;
        }
    }

    defaultHeight = this.getDefaultRowHeight();

    rowRange = cellRange[0];
    rowStart = rowRange['start'];
    rowCount = cellSet.getCount("row");

    // for short fetch it would be equal for long fetch it would be > (bottom) or < (top)
    rowRangeNeedsUpdate = rowCount > 0 && (rowStart > this.m_endRow || rowStart + rowCount <= this.m_startRow);

    // if no results returned and count is unknown, flag it so we won't try to fetch again
    // OR if highwater mark scrolling is used and count is known and we have reach the last row, stop fetching
    // OR if result set is less than what's requested, then assumes we have fetched the last row
    if ((rowCount == 0 && this._isCountUnknown('row') && rowRange['count'] > 0) ||
            (rowRangeNeedsUpdate && this._isHighWatermarkScrolling() && !this._isCountUnknown('row') && (this.m_endRow + rowCount + 1 >= totalRowCount)) ||
            (rowCount < rowRange['count']))
    {
        this.m_stopRowFetch = true;
    }

    columnRange = cellRange[1];
    columnStart = columnRange['start'];
    columnCount = cellSet.getCount("column");

    columnRangeNeedsUpdate = columnCount > 0 && (columnStart > this.m_endCol || columnStart + columnCount == this.m_startCol);

    // if no results returned and count is unknown, flag it so we won't try to fetch again
    // OR if highwater mark scrolling is used and count is known and we have reach the last column, stop fetching
    // OR if result set is less than what's requested, then assumes we have fetched the last column
    if ((columnCount == 0 && this._isCountUnknown('column') && columnRange['count'] > 0) ||
            (columnRangeNeedsUpdate && this._isHighWatermarkScrolling() && !this._isCountUnknown('column') && (this.m_endCol + columnCount + 1 >= totalColumnCount)) ||
            (columnCount < columnRange['count']))
    {
        this.m_stopColumnFetch = true;
    }

    databody = this.m_databody;
    rowheaders = this.m_rowHeader;
    if (databody == null)
    {
        // try to search for it in the param
        databody = columnRange['databody'];
    }

    scroller = this.m_scroller;
    if (scroller == null)
    {
        // try to search for it in the param
        scroller = columnRange['scroller'];
    }

    // complete the structure of scroller if it does not exists yet
    if (!scroller.hasChildNodes())
    {
        inner = document.createElement("div");
        scroller.appendChild(inner); //@HTMLUpdateOK
    }
    else
    {
        inner = scroller['firstChild'];
    }

    if (!databody.hasChildNodes())
    {
        // first time databody is constructed
        databodyContent = document.createElement("div");
        databodyContent['className'] = this.getMappedStyle("scroller") + (this.m_utils.isTouchDevice() ? " " + this.getMappedStyle("scroller-mobile") : "");
    }
    else
    {
        databodyContent = databody['firstChild'];
    }

    // if these are new rows (append or insert in the middle)
    if (rowRangeNeedsUpdate || rowInsert)
    {
        // whether this is adding rows to bottom (append) or top (insert)
        isAppend = !rowInsert && rowStart >= this.m_startRow ? true : false;

        if (isAppend)
        {
            referenceRow = databodyContent['childNodes'][rowStart - this.m_startRow];
            top = this.m_endRowPixel;
        }
        else
        {
            if (rowInsert)
            {
                referenceRow = databodyContent['childNodes'][rowStart - this.m_startRow];
                top = this.getElementDir(referenceRow, 'top');
            }
            else
            {
                top = this.m_startRowPixel;
            }
        }

        fragment = document.createDocumentFragment();
        addResult = this._addRows(fragment, (isAppend || rowInsert), top, rowStart, rowCount, columnStart, columnRangeNeedsUpdate, cellSet);
        totalRowHeight = addResult['totalRowHeight'];
        avgWidth = addResult['avgWidth'];
        avgHeight = totalRowHeight / rowCount;

        if (isAppend)
        {
            databodyContent.appendChild(fragment); //@HTMLUpdateOK
            // make sure there is a bottom border if adding a row to the bottom
            if (this.m_endRow != -1 && rowCount != 0)
            {
                //get the previous last row
                prev = databodyContent['childNodes'][this.m_endRow - this.m_startRow];
                if (prev != null)
                {
                    prev = prev['childNodes'];
                    for (i = 0; i < prev.length; i += 1)
                    {
                        prev[i]['style']['borderBottomStyle'] = '';
                    }
                }
            }
            // update row range info if neccessary
            this.m_endRow = rowStart + rowCount - 1;
            this.m_endRowPixel = this.m_endRowPixel + totalRowHeight;

            // initial fetch case where databody is empty
            if (!databody.hasChildNodes())
            {
                databody.appendChild(databodyContent); //@HTMLUpdateOK
            }
        }
        else if (rowInsert)
        {
            // find the row in which the new row will be inserted
            databodyContent.insertBefore(fragment, referenceRow); //@HTMLUpdateOK

            // update row range info if neccessary
            if (rowStart < this.m_startRow)
            {
                // added in the middle
                this.m_startRow = rowStart;
                this.m_startRowPixel = Math.max(0, this.m_startRowPixel - totalRowHeight);
            }
            //update the endRow and endRowPixel no matter where we insert
            this.m_endRow = this.m_endRow + rowCount;
            this.m_endRowPixel = this.m_endRowPixel + totalRowHeight;
            this.pushRowsDown(referenceRow, totalRowHeight);
        }
        else
        {
            databodyContent.insertBefore(fragment, databodyContent['firstChild']); //@HTMLUpdateOK

            // update row range info if neccessary
            this.m_startRow = this.m_startRow - rowCount;
            this.m_startRowPixel = Math.max(0, this.m_startRowPixel - totalRowHeight);
        }
    }
    else if (columnRangeNeedsUpdate)
    {
        // no new rows, but new columns
        rows = databodyContent['childNodes'];
        // assert number of rows is the same as what's in the databody
        if (rowCount == rows.length)
        {
            avgWidth = this._addColumns(rows, rowStart, rowCount, columnStart, cellSet);
        }
    }

    // if the total row count is unknown, then calculate it based on the current height and the added row height
    if (totalColumnCount != -1 && !this._isHighWatermarkScrolling())
    {
        totalColumnWidth = totalColumnCount * avgWidth;
    }
    else
    {
        totalColumnWidth = this.m_endColPixel;
    }
    // added to only do this on initialization
    // check to see if the average width and height has change and update the canvas and the scroller accordingly
    if (avgWidth != undefined && (this.m_avgColWidth == 0 || this.m_avgColWidth == undefined))
    {
        // the average column width should only be set once, it will only change when the column width varies between columns, but
        // in such case the new average column width would not be any more precise than previous one.
        this.m_avgColWidth = avgWidth;
        this.setElementWidth(databodyContent, totalColumnWidth);
        this.setElementWidth(inner, totalColumnWidth);
    }
    // if count is unknown, we'll need to update canvas if content is added
    else if ((totalColumnCount == -1 || this._isHighWatermarkScrolling()) && totalColumnWidth > this.getElementWidth(databodyContent))
    {
        this.setElementWidth(databodyContent, totalColumnWidth);
        this.setElementWidth(inner, totalColumnWidth);
    }

    // if the total row count is unknown, then calculate it based on the current height and the added row height
    if (totalRowCount != -1 && !this._isHighWatermarkScrolling())
    {
        totalRowHeight = totalRowCount * avgHeight;
    }
    else
    {
        totalRowHeight = this.m_endRowPixel;
    }

    if (avgHeight != undefined && (this.m_avgRowHeight == 0 || this.m_avgRowHeight == undefined))
    {
        // the average row height should only be set once, it will only change when the row height varies between rows, but
        // in such case the new average row height would not be any more precise than previous one.
        this.m_avgRowHeight = avgHeight;
        this.setElementHeight(databodyContent, totalRowHeight);
        this.setElementHeight(inner, totalRowHeight);
    }
    else if (((totalRowCount == -1 || this._isHighWatermarkScrolling()) && totalRowHeight > this.getElementHeight(databodyContent)) || (totalRowCount * avgHeight != this.getElementHeight(databodyContent)))
    {
        // in the insert case or unknown row count case
        this.setElementHeight(databodyContent, totalRowHeight);
        this.setElementHeight(inner, totalRowHeight);
    }

    // update column range info if neccessary
    if (columnRangeNeedsUpdate)
    {
        // add to left or to right
        if (columnStart < this.m_startCol)
        {
            this.m_startCol = this.m_startCol - columnCount;
        }
        else
        {
            //in virtual fetch end should always be set to last
            this.m_endCol = columnStart + columnCount - 1;
        }
    }

    // fetch is done
    this.m_fetching['cells'] = false;
    if (this.m_initialized)
    {
        // check if we need to sync header and databody scroll position
        this._syncScroller();
    }

    // size the grid if fetch is done
    if (this.isFetchComplete())
    {
        this.hideStatusText();

        // highlight focus cell or header if specified
        if (this.m_scrollIndexAfterFetch != null)
        {
            this.scrollToIndex(this.m_scrollIndexAfterFetch);
            //wait for the scroll event to be fired to avoid using cell.focus() to bring into view, the case where it's in the viewport but hasn't been scrolled to yet
        }
        else if (this.m_scrollHeaderAfterFetch != null)
        {
            // if the there is a header that needs to be scrolled to after fetch scroll to the header
            this.scrollToHeader(this.m_scrollHeaderAfterFetch);
        }
        else if (!this.isActionableMode())
        {
            //highliht the active cell if we are virtualized scroll and scrolled away from the active and came back
            //also on a move event insert this will preserve the active cell
            this._highlightActive();
        }

        // apply current selection range to newly fetched cells
        // this is more efficient than looping over ranges when rendering cell
        if (this._isSelectionEnabled())
        {
            this.applySelection(rowStart, rowStart + rowCount, columnStart, columnStart + columnCount);
        }

        // update accessibility info
        this.populateAccInfo();

        // force bitmap (to GPU) to be generated now rather than when doing actual 3d translation to minimize
        // the delay
        if (this.m_utils.isTouchDevice() && window.hasOwnProperty('WebKitCSSMatrix'))
        {
            databody.style.webkitTransform = "translate3d(0, 0, 0)";
            if (this.m_rowHeader != null)
            {
                this.m_rowHeader.style.webkitTransform = "translate3d(0, 0, 0)";
            }
            if (this.m_colHeader != null)
            {
                this.m_colHeader.style.webkitTransform = "translate3d(0, 0, 0)";
            }
        }

        // initialize/resize/fillViewport/trigger ready event
        if (this._shouldInitialize())
        {
            this._handleInitialization(true);
        }
        else if (this.m_initialized)
        {
            if (this._isScrollerContentOutOfSync() || this.m_resizeRequired == true ||
                    //the case where a delete brought down the size of the databody and the fillViewport made it larger than the scroller again
                        // also the case when a resize of the entire grid made the databody bigger than it was before
                        (this.m_endRowHeaderPixel > this.getElementHeight(databody) && this.getElementHeight(this.m_scroller) > this.getElementHeight(databody)) ||
                        (this.m_endColHeaderPixel > this.getElementWidth(databody) && this.getElementWidth(this.m_scroller) > this.getElementWidth(databody)))
            {
                this.resizeGrid();
            }
            else
            {
                this.m_scrollWidth = this.getElementWidth(databodyContent) - this.getElementWidth(databody);
                this.m_scrollHeight = this.getElementHeight(databodyContent) - this.getElementHeight(databody);
            }
            this.fillViewport(this.m_currentScrollLeft, this.m_currentScrollTop);
            if (this.isFetchComplete())
            {
                this.fireEvent('ready', {});
            }
        }
    }

    // end fetch
    this._signalTaskEnd();
    //this.dumpRanges();
};

/**
 * Insert rows with animation.
 * @param {Element} rowFragment
 * @param {Element} rowHeaderFragment
 * @param {number} rowStart the starting row index
 * @private
 */
DvtDataGrid.prototype._insertRowsWithAnimation = function(rowFragment, rowHeaderFragment, rowStart, totalRowHeight)
{
    var self, isAppend, databodyContent, rowHeaderSupport, rowHeaderContent, referenceRow, referenceRowHeader, referenceRowTop,
            insertStartPixel, i, row, rowHeader, newTop, deltaY, lastAnimatedElement, transitionListener;

    self = this;
    // animation start
    self._signalTaskStart();
    isAppend = rowStart > this.m_endRow;
    databodyContent = this.m_databody['firstChild'];
    rowHeaderSupport = rowHeaderFragment == null ? false : true;

    // row to be inserted after is the reference row
    referenceRow = databodyContent['childNodes'][rowStart - this.m_startRow - 1];
    referenceRowTop = this.getElementDir(referenceRow, 'top');
    insertStartPixel = referenceRowTop + this.getElementHeight(referenceRow);
    this.changeStyleProperty(referenceRow, this.getCssSupport('z-index'), 10);

    if (rowHeaderSupport)
    {
        rowHeaderContent = this.m_rowHeader['firstChild'];
        referenceRowHeader = rowHeaderContent['childNodes'][rowStart - this.m_startRow - 1];
        this.changeStyleProperty(referenceRowHeader, this.getCssSupport('z-index'), 10);
    }

    // loop over the fragment and assign proper top values to the fragment and then hide them
    // with transform behind the reference row
    for (i = 0; i < rowFragment.childNodes.length; i++)
    {
        row = rowFragment.childNodes[i];
        newTop = insertStartPixel + this.getElementDir(row, 'top');
        deltaY = referenceRowTop - newTop;

        // move row to actual new position
        this.setElementDir(row, newTop, 'top');

        // move row to behind reference row
        this.addTransformMoveStyle(row, 0, 0, 'linear', 0, deltaY, 0);

        if (rowHeaderSupport)
        {
            rowHeader = rowHeaderFragment.childNodes[i];
            this.setElementDir(rowHeader, newTop, 'top');
            this.addTransformMoveStyle(rowHeader, 0, 0, 'linear', 0, deltaY, 0);
        }
    }

    // loop over the row after the insert point, assign new top values, but keep
    // them where they are using transforms
    for (i = rowStart - this.m_startRow; i < databodyContent.childNodes.length; i++)
    {
        row = databodyContent.childNodes[i];
        newTop = totalRowHeight + this.getElementDir(row, 'top');
        deltaY = -totalRowHeight;

        // move row to actual new position
        this.setElementDir(row, newTop, 'top');

        // move row to original position
        this.addTransformMoveStyle(row, 0, 0, 'linear', 0, deltaY, 0);

        if (rowHeaderSupport)
        {
            rowHeader = rowHeaderContent.childNodes[i];
            this.setElementDir(rowHeader, newTop, 'top');
            this.addTransformMoveStyle(rowHeader, 0, 0, 'linear', 0, deltaY, 0);
        }
    }

    // need to resize first in order to ensure visible region is big enough to handle new rows
    this.m_endRow += rowFragment.childNodes.length;
    this.m_endRowPixel += totalRowHeight;
    if (rowHeaderSupport)
    {
        this.m_endRowHeader += rowHeaderFragment.childNodes.length;
        this.m_endRowHeaderPixel += totalRowHeight;
    }
    this.setElementHeight(databodyContent, this.m_endRowPixel - this.m_startRowPixel);
    this.setElementHeight(this.m_scroller['firstChild'], this.m_endRowPixel - this.m_startRowPixel);
    this.resizeGrid();

    // find the row in which the new rows will be inserted and insert
    if (isAppend)
    {
        databodyContent.appendChild(rowFragment); //@HTMLUpdateOK
        if (rowHeaderSupport)
        {
            rowHeaderContent.appendChild(rowHeaderFragment); //@HTMLUpdateOK
        }
    }
    else
    {
        databodyContent.insertBefore(rowFragment, referenceRow['nextSibling']); //@HTMLUpdateOK
        if (rowHeaderSupport)
        {
            rowHeaderContent.insertBefore(rowHeaderFragment, referenceRowHeader['nextSibling']); //@HTMLUpdateOK
        }
    }
    this.updateRowBanding();

    lastAnimatedElement = databodyContent['lastChild'];
    transitionListener = function()
    {
        self._handleAnimationEnd();
        lastAnimatedElement.removeEventListener('transitionend', transitionListener, false);
    };

    lastAnimatedElement.addEventListener('transitionend', transitionListener, false);

    setTimeout(function()
    {
        var i, duration, timing;
        duration = DvtDataGrid.EXPAND_ANIMATION_DURATION;
        timing = 'ease-out';
        //add animation rules to the inserted rows
        for (i = databodyContent.childNodes.length - 1; i >= rowStart - self.m_startRow; i--)
        {
            self.addTransformMoveStyle(databodyContent.childNodes[i], duration + "ms", 0, timing, 0, 0, 0);
            if (rowHeaderSupport)
            {
                self.addTransformMoveStyle(rowHeaderContent.childNodes[i], duration + "ms", 0, timing, 0, 0, 0);
            }
        }
    }, 0);
};

/**
 * Add columns to existing rows.
 * @param {Array} rows an array of existing row elements
 * @param {integer} rowStart the start row index of the cell set
 * @param {integer} rowCount the row count of the cell set
 * @param {integer} columnStart the start row index of the cell set
 * @param {Object} cellSet the result cell set from fetch operation
 * @return {number} the average width of the columns
 * @private
 */
DvtDataGrid.prototype._addColumns = function(rows, rowStart, rowCount, columnStart, cellSet)
{
    var renderer, columnBandingInterval, horizontalGridlines, verticalGridlines, row, avgWidth, i, returnVal;

    renderer = this.m_options.getRenderer("cell");
    columnBandingInterval = this.m_options.getColumnBandingInterval();
    horizontalGridlines = this.m_options.getHorizontalGridlines();
    verticalGridlines = this.m_options.getVerticalGridlines();

    for (i = 0; i < rowCount; i += 1)
    {
        row = rows[i];

        // add the cells into existing row
        returnVal = this.addCellsToRow(cellSet, row, rowStart + i, renderer, false, columnStart, (i == rowCount - 1), columnBandingInterval, horizontalGridlines, verticalGridlines);
        avgWidth = returnVal['avgWidth'];
    }

    return avgWidth;
};

/**
 * Add rows to the specified document element.
 * @param {Element} fragment the element in which the rows are added to
 * @param {boolean} isAppendOrInsert true if this is insert row to bottom or in the middle
 * @param {integer} top the top pixel position of the first row to be add
 * @param {integer} rowStart the start row index of the cell set
 * @param {integer} rowCount the row count of the cell set
 * @param {integer} columnStart the start row index of the cell set
 * @param {boolean} columnRangeNeedsUpdate true if column range needs update, false otherwise
 * @param {Object} cellSet the result cell set from fetch operation
 * @return {integer} the total row height
 * @private
 */
DvtDataGrid.prototype._addRows = function(fragment, isAppendOrInsert, top, rowStart, rowCount, columnStart, columnRangeNeedsUpdate, cellSet)
{
    var renderer, columnBandingInterval, rowBandingInterval, horizontalGridlines, verticalGridlines, row,
            avgWidth, totalRowHeight, index, height, i, returnVal;

    renderer = this.m_options.getRenderer("cell");
    columnBandingInterval = this.m_options.getColumnBandingInterval();
    rowBandingInterval = this.m_options.getRowBandingInterval();
    horizontalGridlines = this.m_options.getHorizontalGridlines();
    verticalGridlines = this.m_options.getVerticalGridlines();

    totalRowHeight = 0;
    for (i = 0; i < rowCount; i += 1)
    {
        if (isAppendOrInsert)
        {
            index = rowStart + i;
        }
        else
        {
            index = rowStart + (rowCount - 1 - i);
        }
        row = document.createElement("div");
        row['className'] = this.getMappedStyle("row");
        if ((Math.floor(index / rowBandingInterval) % 2 === 1))
        {
            row['className'] += " " + this.getMappedStyle("banded");
        }
        this.m_root.appendChild(row); //@HTMLUpdateOK

        // add the cells into the new row
        returnVal = this.addCellsToRow(cellSet, row, index, renderer, true, columnStart, (i == rowCount - 1 && columnRangeNeedsUpdate), columnBandingInterval, horizontalGridlines, verticalGridlines, top);

        avgWidth = returnVal['avgWidth'];
        height = returnVal['height'];
        totalRowHeight = totalRowHeight + height;

        if (isAppendOrInsert)
        {
            row['style']['top'] = top + 'px';
            top = top + height;
            fragment.appendChild(row); //@HTMLUpdateOK
        }
        else
        {
            top = top - height;
            row['style']['top'] = top + 'px';
            fragment.insertBefore(row, fragment['firstChild']); //@HTMLUpdateOK
        }
    }

    return {"avgWidth": avgWidth, "totalRowHeight": totalRowHeight, "top": top};
};

/**
 * Returns true if the scroller dimension is out of sync with the databody content.
 * In which case we'll need to call ResizeGrid to re-layout the grid.
 * @return {boolean} true if the scroller dimension is out of sync with the databody content, false otherwise.
 * @private
 */
DvtDataGrid.prototype._isScrollerContentOutOfSync = function()
{
    var scrollerHeight, scrollerWidth, scrollerContent, scrollerContentHeight, scrollerContentWidth;

    // if scroller is not built yet just return false
    if (this.m_scroller == null)
    {
        return false;
    }

    scrollerHeight = this.getElementHeight(this.m_scroller);
    scrollerWidth = this.getElementWidth(this.m_scroller);
    scrollerContent = this.m_scroller['firstChild'];
    scrollerContentHeight = this.getElementHeight(scrollerContent);
    scrollerContentWidth = this.getElementWidth(scrollerContent);

    // if the content height is greater than scroller height but there's no vertical scrollbar or
    // if the content width is greater than scroller width but there's no horizontal scrollbar
    if ((this.m_endRowPixel > scrollerHeight && scrollerWidth == scrollerContentWidth) ||
            (this.m_endColPixel > scrollerWidth && scrollerHeight == scrollerContentHeight))
    {
        return true;
    }

    return false;
};

/**
 * Push the row and all of its next siblings down.
 * @param {Element} row the starting row to push down.
 * @param {number} adjustment the amount in pixel to push down.
 * @private
 */
DvtDataGrid.prototype.pushRowsDown = function(row, adjustment)
{
    while (row)
    {
        var top = this.getElementDir(row, 'top') + adjustment;
        row['style']['top'] = top + 'px';
        row = row['nextSibling'];
    }
};

/**
 * Push the row header and all of its next siblings up.
 * @param {Element} row the starting row to push up.
 * @param {number} adjustment the amount in pixel to push up.
 * @private
 */
DvtDataGrid.prototype.pushRowsUp = function(row, adjustment)
{
    this.pushRowsDown(row, -adjustment);
};

/**
 * Push the row header and all of its next siblings down.
 * @param {Element} rowHeader the starting rowHeader to push down.
 * @param {number} adjustment the amount in pixel to push down.
 * @private
 */
DvtDataGrid.prototype.pushRowHeadersDown = function(rowHeader, adjustment)
{
    while (rowHeader)
    {
        var top = this.getElementDir(rowHeader, 'top') + adjustment;
        rowHeader['style']['top'] = top + 'px';
        rowHeader = rowHeader['nextSibling'];
    }
};

/**
 * Push the row and all of its next siblings up.
 * @param {Element} rowHeader the starting rowHeader to push up.
 * @param {number} adjustment the amount in pixel to push up.
 * @private
 */
DvtDataGrid.prototype.pushRowHeadersUp = function(rowHeader, adjustment)
{
    this.pushRowsDown(rowHeader, -adjustment);
};

/**
 * Build a cell context object for a cell and return it
 * @param {object} indexes - the row and column index of the cell
 * @param {Object} data - the data the cell contains
 * @param {Object} metadata - the metadata the cell contains
 * @param {Element} elem - the cell element
 * @return {Object} the cell context object, keys of {indexes,data,keys,datagrid}
 */
DvtDataGrid.prototype.createCellContext = function(indexes, data, metadata, elem)
{
    var cellContext, prop;

    cellContext = {
    };
    //set the parent to the cell content div
    cellContext['parentElement'] = elem['firstChild'];
    cellContext['indexes'] = indexes;
    cellContext['data'] = data;
    cellContext['component'] = this;
    cellContext['datasource'] = this.getDataSource();

    // merge properties from metadata into cell context
    // the properties in metadata would have precedence
    for (prop in metadata)
    {
        if (metadata.hasOwnProperty(prop))
        {
            cellContext[prop] = metadata[prop];
        }
    }

    // invoke callback to allow ojDataGrid to change datagrid reference
    if (this.m_createContextCallback != null)
    {
        this.m_createContextCallback.call(this, cellContext);
    }

    return cellContext;
};

/**
 * Creates the cell id from the keys
 * @param {Object} keys the row and colunmn key of the cell
 * @private
 */
DvtDataGrid.prototype._createCellId = function(keys)
{
    return this.createSubId('r' + keys['row'] + 'c' + keys['column']);
};

/**
 * Creates the header id from the axis and key
 * @param {string} axis row/column
 * @param {string} key the header key
 * @private
 */
DvtDataGrid.prototype._createHeaderId = function(axis, key)
{
    return this.createSubId(axis.charAt(0) + key);
};

/**
 * Creates the cell element
 * @param {Object} metadata the metadata for the cell
 * @protected
 */
DvtDataGrid.prototype.createCellElement = function(metadata)
{
    return document.createElement("div");
};

/**
 * Gets the width of the row header
 * @return {number} the width of the row header in pixel.
 * @protected
 */
DvtDataGrid.prototype.getRowHeaderWidth = function()
{
    if (this.m_endRowHeader === -1)
    {
        // check if there's no row header
        return 0;
    }
    return this.m_rowHeaderWidth;
};

/**
 * Gets the height of the column header
 * @return {number} the height of the column header in pixel.
 * @protected
 */
DvtDataGrid.prototype.getColumnHeaderHeight = function()
{
    if (this.m_endColHeader === -1)
    {
        // check if there's no column header
        return 0;
    }
    return this.m_colHeaderHeight;
};

/**
 * Gets the bottom value relative to the datagrid in pixel.
 * @param {Element} row the row element
 * @param {number} bottom the bottom value in pixel relative to the databody
 * @return {number} the bottom value relative to the datagrid in pixels.
 * @private
 */
DvtDataGrid.prototype.getRowBottom = function(row, bottom)
{
    var colHeaderHeight, top, height;

    // gets the height of the column header, if any
    colHeaderHeight = this.getColumnHeaderHeight();
    // if a bottom value is specified use that
    if (bottom != null)
    {
        return colHeaderHeight + bottom;
    }
    else
    {
        // otherwise try find it from the row element
        top = this.getElementDir(row, 'top');
        height = this.calculateRowHeight(row);
        if (!isNaN(top) && !isNaN(height))
        {
            return colHeaderHeight + top + height;
        }
    }

    return colHeaderHeight;
};

/**
 * Adds cells to a row. Iterate over the cells passed in, create new div elements
 * for them settign appropriate styles, and append or prepend them to the row based on the start column.
 * @param {Object} cellSet - the result set of cell data
 * @param {Element} row - the row element to add cells to
 * @param {number} rowIndex - the index of the row element
 * @param {function(Object)} renderer - the cell renderer
 * @param {boolean} isRowFetch - true if we fetched this row
 * @param {number} columnStart - the index to start start adding at
 * @param {boolean} updateColumnRangeInfo - true if we want to return average width
 * @param {number} columnBandingInterval - the column banding interval
 * @param {boolean} horizontalGridlines - true if horizontal lines visible
 * @param {boolean} verticalGridlines - true if vertical lines visible
 * @param {number=} bottom - the bottom of the last row in databody in pixels
 * @return {Object} an object containing avgWidth if updateColumnRange is true and height of the row
 */
DvtDataGrid.prototype.addCellsToRow = function(cellSet, row, rowIndex, renderer, isRowFetch, columnStart, updateColumnRangeInfo, columnBandingInterval, horizontalGridlines, verticalGridlines, bottom)
{
    var isAppend, cellContent, firstColumn, inlineStyleClass, cellStyleClass, currentLeft, dir, totalWidth, columnCount, indexes,
            cellData, cellMetadata, cellContext, j, cell, inlineStyle, width, content, columnIndex, selectionAffordanceAppend,
            textWrapper, shimHeaderContext, styleClass, height, rowKey, shimHeader;
    // appending columns to the right? todo: > or >=
    isAppend = (columnStart >= this.m_startCol);

    firstColumn = row['firstChild'];

    // if this is new row fetch or not appending column
    if (isRowFetch || !isAppend)
    {
        currentLeft = this.m_startColPixel;
    }
    else
    {
        currentLeft = this.m_endColPixel;
    }

    //if on a  touch device and the row has the selection icons in it, want to insert the cells before the selection affordances (there can be one or two per row)
    if (this.m_utils.isTouchDevice())
    {
        if (this.m_utils.containsCSSClassName(row['lastChild'], this.getMappedStyle('toucharea')))
        {
            if (this.m_utils.containsCSSClassName(row['children'][row['children']['length'] - 2], this.getMappedStyle('toucharea')))
            {
                selectionAffordanceAppend = row['children'][row['children']['length'] - 2];
            }
            else
            {
                selectionAffordanceAppend = row['lastChild'];
            }
        }
    }
    dir = this.getResources().isRTLMode() ? "right" : "left";
    totalWidth = 0;
    columnCount = cellSet.getCount("column");
    for (j = 0; j < columnCount; j += 1)
    {
        if (isAppend || isRowFetch)
        {
            columnIndex = columnStart + j;
        }
        else
        {
            columnIndex = columnStart + (columnCount - 1 - j);
        }

        indexes = {"row": rowIndex, "column": columnIndex};
        cellData = cellSet.getData(indexes);
        cellMetadata = cellSet.getMetadata(indexes);

        cell = this.createCellElement(cellMetadata);
        cell.setAttribute("tabIndex", -1);

        cellContent = document.createElement("div");
        cellContent['className'] = this.getMappedStyle("cellcontent");
        cell.appendChild(cellContent); //@HTMLUpdateOK

        cellContext = this.createCellContext(indexes, cellData, cellMetadata, cell);
        cell['id'] = this._createCellId(cellContext['keys']);
        cell[this.getResources().getMappedAttribute('context')] = cellContext;

        // on initial render of the row, cache the row key and the height of the row
        if (this._getKey(row) == null)
        {
            rowKey = cellContext['keys']['row'];
            this._setKey(row, rowKey);

            //if there's no headers, check to make sure we get the row height correct,
            //by getting it from the row header options, should happen once per row
            if (this.m_endRowHeader == -1)
            {
                shimHeaderContext = this.createHeaderContext('row', rowIndex, null, {'key': rowKey}, null, 0, 0, 1);
                inlineStyle = this.m_options.getInlineStyle('row', shimHeaderContext);
                styleClass = this.m_options.getStyleClass('row', shimHeaderContext);
                shimHeader = document.createElement('div');
                shimHeader['style']['cssText'] = inlineStyle;
                shimHeader['className'] = this.getMappedStyle('row') + ' ' + styleClass;
                //sets height in the sizing manager if necessary
                height = this.getRowHeight(shimHeader, rowKey);
            }
            else
            {
                height = this.getRowHeight(row, rowKey);
            }
            // set the px height on the row regardless of unit type currently on it
            this.setElementHeight(row, height);
        }

        //before setting our own styles, else we will overwrite them
        inlineStyle = this.m_options.getInlineStyle("cell", cellContext);
        if (inlineStyle != null)
        {
            cell['style']['cssText'] = inlineStyle;
        }

        //don't want developer setting height or width through inline styles on cell
        //should be done through header styles, or through the stylesheet
        if (cell['style']['height'] != '')
        {
            cell['style']['height'] = '';
        }
        if (cell['style']['width'] != '')
        {
            cell['style']['width'] = '';
        }

        //determine if the newly fetched row should be banded
        if ((Math.floor(columnIndex / columnBandingInterval) % 2 === 1))
        {
            cellStyleClass = this.getMappedStyle("cell") + " " + this.getMappedStyle("banded");
        }
        else
        {
            cellStyleClass = this.getMappedStyle("cell");
        }
        inlineStyleClass = this.m_options.getStyleClass("cell", cellContext);
        if (inlineStyleClass != null)
        {
            cell['className'] = cellStyleClass + " " + inlineStyleClass;
        }
        else
        {
            cell['className'] = cellStyleClass;
        }

        //use a shim element so that we don't have to manage class name ordering
        //in the case of no headers this gets called everytime, so added rowIndex=0 to make sure it's only the first time
        if (this.m_endColHeader == -1 && rowIndex == 0 && !this.m_initialized)
        {
            shimHeaderContext = this.createHeaderContext('column', columnIndex, null, {'key': cellContext['keys']['column']}, null, 0, 0, 1);
            inlineStyle = this.m_options.getInlineStyle('column', shimHeaderContext);
            styleClass = this.m_options.getStyleClass('column', shimHeaderContext);
            shimHeader = document.createElement('div');
            shimHeader['style']['cssText'] = inlineStyle;
            shimHeader['className'] = this.getMappedStyle('colheadercell') + ' ' + this.getMappedStyle('headercell') + ' ' + styleClass;
            //will set it in the sizing manager so the cells can fetch it
            width = this.getColumnWidth(shimHeader, cellContext['keys']['column']);
        }
        else
        {
            width = this.getColumnWidth(cell, cellContext['keys']['column']);
        }
        // set the px width on the cell regardless of unit type currently on it
        this.setElementWidth(cell, width);

        //do not put borders on far edge column, edge row, turn off gridlines
        if (verticalGridlines === 'hidden' || (this._isLastColumn(columnIndex) && this.getRowHeaderWidth() + currentLeft + width >= this.getWidth()))
        {
            if (dir === 'left')
            {
                cell['style']['borderRightStyle'] = 'none';
            }
            else
            {
                cell['style']['borderLeftStyle'] = 'none';
            }
        }

        if (horizontalGridlines === 'hidden')
        {
            cell['style']['borderBottomStyle'] = 'none';
        }
        else if (this._isLastRow(rowIndex))
        {
            // bottom is an optional parameter that is the bottom of the previous row
            // add the height of this row (once per row) to get the bottom pixel val
            if (bottom != null && columnIndex == columnStart)
            {
                bottom += this.getElementHeight(row);
            }
            if (this.getRowBottom(row, bottom) >= this.getHeight())
            {
                cell['style']['borderBottomStyle'] = 'none';
            }
        }

        if (isAppend || isRowFetch)
        {
            this.setElementDir(cell, currentLeft, dir);
        }
        else
        {
            this.setElementDir(cell, currentLeft - width, dir);
        }

        //add cell to live DOM while rendering, row is now in live DOM so do this first
        if (isAppend || isRowFetch)
        {
            //if on a  touch device and the row has the selection icons in it, want do do an insert before
            if (selectionAffordanceAppend)
            {
                row.insertBefore(cell, selectionAffordanceAppend); //@HTMLUpdateOK
                currentLeft = currentLeft + width;
            }
            else
            {
                row.appendChild(cell); //@HTMLUpdateOK
                currentLeft = currentLeft + width;
            }
        }
        else
        {
            row.insertBefore(cell, firstColumn); //@HTMLUpdateOK
            firstColumn = cell;
            currentLeft = currentLeft - width;
        }

        if (renderer != null)
        {
            // if an element is returned from the renderer and the parent of that element is null, we will append
            // the returned element to the parentElement.  If non-null, we won't do anything, assuming that the
            // rendered content has already added into the DOM somewhere.
            content = renderer.call(this, cellContext);
            if (content != null)
            {
                // allow return of document fragment from jquery create/js document.createDocumentFragment
                if (content['parentNode'] === null || content['parentNode'] instanceof DocumentFragment)
                {
                    cellContent.appendChild(content); //@HTMLUpdateOK
                }
                else if (content['parentNode'] != null)
                {
                    // parent node exists, do nothing
                }
                else if (content.toString)
                {
                    textWrapper = document.createElement("span");
                    textWrapper['className'] = this.getMappedStyle("celltext");
                    textWrapper.appendChild(document.createTextNode(content.toString())); //@HTMLUpdateOK
                    cellContent.appendChild(textWrapper); //@HTMLUpdateOK
                }
            }

            // make all focusable elements non-focusable, since we want to manage tab stops
            this._disableAllFocusableElements(cell);
        }
        else
        {
            if (cellData == null)
            {
                cellData = "";
            }
            textWrapper = document.createElement("span");
            textWrapper['className'] = this.getMappedStyle("celltext");
            textWrapper.appendChild(document.createTextNode(cellData.toString())); //@HTMLUpdateOK
            cellContent.appendChild(textWrapper); //@HTMLUpdateOK
        }

        // update column range info if neccessary
        if (updateColumnRangeInfo)
        {
            if (isAppend || isRowFetch)
            {
                this.m_endColPixel = this.m_endColPixel + width;
            }
            else
            {
                this.m_startColPixel = this.m_startColPixel - width;
            }
            totalWidth = totalWidth + width;
        }
    }

    if (updateColumnRangeInfo && columnCount > 0)
    {
        return {'avgWidth': (totalWidth / columnCount), 'height': height};
    }
    return {'avgWidth': null, 'height': height};
};

/**
 * Handle an unsuccessful call to the data source fetchCells
 * @param {Error} errorStatus - the error returned from the data source
 * @param {Array.<Object>} cellRange - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 */
DvtDataGrid.prototype.handleCellsFetchError = function(errorStatus, cellRange)
{
    var rowRange, columnRange;

    // remove fetch message
    this.m_fetching['cells'] = false;

    // hide status message
    this.hideStatusText();

    // update datagrid in responds to failed fetch
    if (this.m_databody['firstChild'] == null)
    {
        // if it's initial fetch, then show no data
        if (this._shouldInitialize())
        {
            this._handleInitialization(true);
        }
    }
    else
    {
        // failed while fetching more data.  stop any future fetching
        rowRange = cellRange[0];
        columnRange = cellRange[1];

        if (columnRange['start'] + columnRange['count'] - 1 > this.m_endCol)
        {
            this.m_stopColumnFetch = true;
            // stop header fetch as well
            this.m_stopColumnHeaderFetch = true;
        }

        if (rowRange['start'] + rowRange['count'] - 1 > this.m_endRow)
        {
            this.m_stopRowFetch = true;
            // stop header fetch as well
            this.m_stopRowHeaderFetch = true;
        }
    }
};

/**
 * Display the 'fetching' status message
 */
DvtDataGrid.prototype.showStatusText = function()
{
    var left, msg;
    msg = this.getResources().getTranslatedText("msgFetchingData");

    if (this.m_status['style']['display'] == "block")
    {
        return;
    }

    this.m_status.textContent = msg;
    this.m_status['style']['display'] = "block";

    left = this.getWidth() / 2 - this.m_status['offsetWidth'] / 2;
    this.m_status['style']['left'] = left + 'px';
};

/**
 * Hide the 'fetching' status message
 */
DvtDataGrid.prototype.hideStatusText = function()
{
    this.m_status['style']['display'] = "none";
};

/********************* focusable/editable element related methods *****************/
/**
 * Finds all the focusable elements in a node
 * @param {Element} node
 * @param {boolean=} skipTabIndexCheck
 * @return {Array} An array of all of the focusable elements in a node
 */
DvtDataGrid.prototype.getFocusableElementsInNode = function(node, skipTabIndexCheck)
{
    var inputElems, nodes, elem, nodeCount, inputRegExp, i, attr;
    inputElems = [];
    attr = this.getResources().getMappedAttribute('tabMod');

    if (document.evaluate)
    {
        // FF and IE are not case sensitive with x-path, but webkit browser are (GoogleChrome and Safari only recognize lower case)
        // to be safe, we check for both lower and upper case
        nodes = document.evaluate(".//input|.//select|.//textarea|.//button|.//a|.//INPUT|.//SELECT|.//TEXTAREA|.//BUTTON|.//A|.//*[@tabindex>=0]|.//*[@" + attr + ">=0]",
                node, null, XPathResult.ANY_TYPE, null);
        elem = nodes.iterateNext();
        while (elem)
        {
            if (!elem.disabled && (skipTabIndexCheck || !elem.tabIndex || elem.tabIndex > 0 || parseInt(elem.getAttribute(attr)) >= 0) && this.isElementVisible(elem, node))
            {
                inputElems.push(elem);
            }

            elem = nodes.iterateNext();
        }
    }
    else
    {
        nodes = node.getElementsByTagName("*");
        nodeCount = nodes.length;
        inputRegExp = /^INPUT|SELECT|BUTTON|^A\b|TEXTAREA/;
        // we don't want to use AdfDhtmlPivotTablePeer._INPUT_REGEXP because it has OPTION in the regexp
        // in IE, each 'option' after 'select' elem will be counted as an input element(and cause duplicate input elems returned)
        // this will cause problem with TAB/Shift-TAB (recognizing whether to go to next cell or to tab within the current cell
        for (i = 0; i < nodeCount; i += 1)
        {
            elem = nodes[i];
            if (elem.tagName.match(inputRegExp) && !elem.disabled && (skipTabIndexCheck || !elem.tabIndex || elem.tabIndex >= 0 || parseInt(elem.getAttribute(attr)) >= 0) && this.isElementVisible(elem, node))
            {
                inputElems.push(elem);
            }
        }
    }
    return inputElems;
};

/**
 * Whether an element is visible
 * @param {Element} elem
 * @param {Element} node
 * @private
 */
DvtDataGrid.prototype.isElementVisible = function(elem, node)
{
    return true;
};

/**
 * Make all focusable elements within the specified cell unfocusable
 * @param {Element} cell
 * @private
 */
DvtDataGrid.prototype._disableAllFocusableElements = function(cell)
{
    var focusElems, i, tabIndex, attr;
    attr = this.getResources().getMappedAttribute('tabMod');

    // make all focusable elements non-focusable, since we want to manage tab stops
    focusElems = this.getFocusableElementsInNode(cell);
    for (i = 0; i < focusElems.length; i++)
    {
        tabIndex = parseInt(focusElems[i].tabIndex, 10);
        if (isNaN(tabIndex) || tabIndex >= 0)
        {
            // store the tabindex as an attribute
            focusElems[i].setAttribute(attr, isNaN(tabIndex) ? -1 : tabIndex);
            focusElems[i].setAttribute('tabIndex', -1);
        }
    }
};

/**
 * Make all focusable elements within the specified cell that were made unfocusable before focusable again
 * @param {Element} cell
 * @private
 */
DvtDataGrid.prototype._enableAllFocusableElements = function(cell)
{
    var focusElems, i, tabIndex, attr;
    attr = this.getResources().getMappedAttribute('tabMod');

    // make all non-focusable elements focusable again
    focusElems = this.getFocusableElementsInNode(cell, false);
    for (i = 0; i < focusElems.length; i++)
    {
        tabIndex = parseInt(focusElems[i].getAttribute(attr), 10);
        focusElems[i].removeAttribute(attr);
        // restore tabIndex as needed
        if (tabIndex == -1)
        {
            focusElems[i].removeAttribute("tabIndex");
        }
        else
        {
            focusElems[i].setAttribute("tabIndex", tabIndex);
        }
    }
};

/**
 * Determine whether the element is a focusable element.
 * @param {Element} elem the element to check
 * @return {boolean} true if element is a focusable element, false otherwise.
 * @private
 */
DvtDataGrid.prototype._isFocusableElement = function(elem)
{
    var tagName = elem.tagName;
    return (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || tagName === 'BUTTON' || tagName === 'A' || (elem.getAttribute("tabIndex") != null && parseInt(elem.getAttribute("tabIndex"), 10) >= 0 && this.findCell(elem) != elem));
};

/**
 * Sets focus on first focusable element contained by an element
 * @param {Element} elem
 * @return {boolean} true if focus is set successfully, false otherwise
 */
DvtDataGrid.prototype._setFocusToFirstFocusableElement = function(elem)
{
    var elems = this.getFocusableElementsInNode(elem, true);
    if (elems.length > 0)
    {
        elems[0].focus();
        return true;
    }

    return false;
};

/**
 * Determine if the data grid is in actionable mode.
 * @return returns true if the data grid is in actionable mode, false otherwise.
 * @protected
 */
DvtDataGrid.prototype.isActionableMode = function()
{
    return (this.m_keyMode == "actionable");
};

/**
 * Sets whether the data grid is in actionable mode
 * @param {boolean} flag true to set grid to actionable mode, false otherwise
 * @protected
 */
DvtDataGrid.prototype.setActionableMode = function(flag)
{
    if (flag)
    {
        this.m_keyMode = "actionable";
    }
    else
    {
        this.m_keyMode = "navigation";
    }

    // update screen reader alert
    this._setAccInfoText(this.m_keyMode === 'actionable' ? 'accessibleActionableMode' : 'accessibleNavigationMode');
};

/************************************** scrolling/virtualization ************************************/

/**
 * Handle a scroll event calling scrollTo
 * @param {Event} event - the scroll event triggering the method
 */
DvtDataGrid.prototype.handleScroll = function(event)
{
    // scroll on touch is handled directly by touch handlers
    if (this.m_utils.isTouchDevice())
    {
        return;
    }

    if (this.m_silentScroll == true)
    {
        this.m_silentScroll = false;
        return;
    }

    var scrollLeft, scrollTop, scroller;
    if (!event)
    {
        event = window['event'];
    }

    if (!event['target'])
    {
        scroller = event['srcElement'];
    }
    else
    {
        scroller = event['target'];
    }

    scrollLeft = this.m_utils.getElementScrollLeft(scroller);
    scrollTop = scroller['scrollTop'];

    this.scrollTo(scrollLeft, scrollTop);
};

/**
 * Retrieve the maximum scrollable width.
 * @return {number} the maximum scrollable width.  Returns MAX_VALUE
 *         if canvas size is unknown.
 * @private
 */
DvtDataGrid.prototype._getMaxScrollWidth = function()
{
    if (this._isCountUnknownOrHighwatermark('column') && !this.m_stopColumnFetch)
    {
        return Number.MAX_VALUE;
    }
    return this.m_scrollWidth;
};

/**
 * Retrieve the maximum scrollable height.
 * @return {number} the maximum scrollable width.  Returns MAX_VALUE
 *         if canvas size is unknown.
 * @private
 */
DvtDataGrid.prototype._getMaxScrollHeight = function()
{
    if (this._isCountUnknownOrHighwatermark('row') && !this.m_stopRowFetch)
    {
        return Number.MAX_VALUE;
    }
    return this.m_scrollHeight;
};

/**
 * Handle a programtic scroll
 * @export
 * @param {Object} options an object containing the scrollTo information
 * @param {Object} options.position scroll to an x,y location which is relative to the origin of the grid
 * @param {Object} options.position.scrollX the x position of the scrollable region, this should always be positive
 * @param {Object} options.position.scrollY the Y position of the scrollable region, this should always be positive
 *
 */
DvtDataGrid.prototype.scroll = function(options)
{
    var scrollLeft, scrollTop;
    if (options['position'] != null)
    {
        scrollLeft = Math.max(0, Math.min(this._getMaxScrollWidth(), options['position']['scrollX']));
        scrollTop = Math.max(0, Math.min(this._getMaxScrollHeight(), options['position']['scrollY']));
        this._initiateScroll(scrollLeft, scrollTop);
    }
};

/**
 * Used by mouse wheel and touch scrolling to set the scroll position,
 * since the deltas are obtained instead of new scroll position.
 * @param {number} deltaX - the change in X position
 * @param {number} deltaY - the change in Y position
 */
DvtDataGrid.prototype.scrollDelta = function(deltaX, deltaY)
{
    var scrollLeft, scrollTop;
    // prevent 'diagonal' scrolling
    if (deltaX != 0 && deltaY != 0)
    {
        // direction depends on which way moves the most
        if (Math.abs(deltaX) > Math.abs(deltaY))
        {
            deltaY = 0;
            this.m_extraScrollOverY = null;
        }
        else
        {
            deltaX = 0;
            this.m_extraScrollOverX = null;
        }
    }

    scrollLeft = Math.max(0, Math.min(this._getMaxScrollWidth(), this.m_currentScrollLeft - deltaX));
    scrollTop = Math.max(0, Math.min(this._getMaxScrollHeight(), this.m_currentScrollTop - deltaY));
    this._initiateScroll(scrollLeft, scrollTop);
};

/**
 * Initiate a scroll, this will differentiate between scrolling on touch vs desktop
 * @param {number} scrollLeft
 * @param {number} scrollTop
 */
DvtDataGrid.prototype._initiateScroll = function(scrollLeft, scrollTop)
{
    if (!this.m_utils.isTouchDevice())
    {
        this.m_utils.setElementScrollLeft(this.m_scroller, scrollLeft);
        this.m_scroller['scrollTop'] = scrollTop;
    }
    else
    {
        // for touch we'll call scrollTo directly instead of relying on scroll event to fire due to performance
        this.scrollTo(scrollLeft, scrollTop);
    }
};

/**
 * Checks whether we should stop scrolling the databody because there's no rows.  This is to avoid
 * showing blank spaces.
 * @param {number} scrollLeft - the position the scroller left should be
 * @param {number} scrollTop - the position the scroller top should be
 * @return {boolean} true if should stop scrolling databody, false otherwise
 * @private
 */
DvtDataGrid.prototype._shouldScrollDatabody = function(scrollLeft, scrollTop)
{
    var viewportLeft, viewportRight, viewportTop, viewportBottom;

    viewportLeft = scrollLeft;
    viewportRight = scrollLeft + this.getElementWidth(this.m_databody);
    viewportTop = scrollTop;
    viewportBottom = scrollTop + this.getElementHeight(this.m_databody);

    // check the viewport bounds against what's in the databody
    // todo: find out why viewportRight and m_endColPixel is off by 2 pixels
    if (this.m_endRowPixel < viewportBottom || this.m_startRowPixel > viewportTop || this.m_endColPixel < viewportRight - 2 || this.m_startColPixel > viewportLeft)
    {
        return false;
    }

    return true;
};

/**
 * Disable touch scroll animation by setting durations to 0
 * @private
 */
DvtDataGrid.prototype._disableTouchScrollAnimation = function()
{
    this.m_databody['firstChild'].style.webkitTransitionDuration = '0ms';
    this.m_rowHeader['firstChild'].style.webkitTransitionDuration = '0ms';
    this.m_colHeader['firstChild'].style.webkitTransitionDuration = '0ms';
};

/**
 * Set the scroller position, using translate3d when permitted
 * @param {number} scrollLeft - the position the scroller left should be
 * @param {number} scrollTop - the position the scroller top should be
 */
DvtDataGrid.prototype.scrollTo = function(scrollLeft, scrollTop)
{
    this.m_currentScrollLeft = scrollLeft;
    this.m_currentScrollTop = scrollTop;

    // check if this is a long scroll
    // don't do this for touch, the check must be done AFTER transition ends otherwise
    // animation will become sluggish, see _syncScroller
    if (!this.m_utils.isTouchDevice())
    {
        if ((scrollLeft + this.getViewportWidth()) < this.m_startColPixel ||
                scrollLeft > this.m_endColPixel ||
                (scrollTop + this.getViewportHeight()) < this.m_startRowPixel ||
                scrollTop > this.m_endRowPixel)
        {
            this.handleLongScroll(scrollLeft, scrollTop);
        }
        else
        {
            this.fillViewport(scrollLeft, scrollTop);
        }

        // check if we should stop scrolling the databody because data has not catch up yet.
        if (!this._shouldScrollDatabody(scrollLeft, scrollTop))
        {
            this.m_stopDatabodyScroll = true;
            return;
        }
    }

    this.m_stopDatabodyScroll = false;

    // update header and databody scroll position
    this._syncScroller();

    // check if we need to adjust scroller dimension
    this._adjustScrollerSize();

    // check if there's a cell to focus
    if (this.m_cellToFocus != null)
    {
        this.m_cellToFocus.focus();
        this.m_cellToFocus = null;
    }

    //if there's an index we wanted to sctoll to after fetch it has now been scrolled to by scrollToIndex, so highlight it
    if (this.m_scrollIndexAfterFetch != null)
    {
        if (this._isInViewport(this.m_scrollIndexAfterFetch) === DvtDataGrid.INSIDE)
        {
            if (this._isDatabodyCellActive() &&
                    this.m_scrollIndexAfterFetch['row'] == this.m_active['indexes']['row'] &&
                    this.m_scrollIndexAfterFetch['column'] == this.m_active['indexes']['column'])
            {
                this._highlightActive();
            }
            //should be able to scroll to index without highlighting it
            this.m_scrollIndexAfterFetch = null;
        }
    }
};

/**
 * Callback to run when the final transition ends
 * @private
 */
DvtDataGrid.prototype._scrollTransitionEnd = function()
{
    var databody;

    if (this.m_scrollTransitionEnd != null)
    {
        databody = this.m_databody['firstChild'];

        // remove existing listener
        databody.removeEventListener("webkitTransitionEnd", this.m_scrollTransitionEnd);
    }

    //center touch affordances if row selection multiple
    if (this._isSelectionEnabled())
    {
        this._scrollTouchSelectionAffordance();
    }

    // Fire scroll event after physical scrolling finishes
    this.fireEvent('scroll', {'event': null, 'ui':{'scrollX': this.m_currentScrollLeft, 'scrollY': this.m_currentScrollTop}});

    // check how the viewport needs to be filled, through long scroll or HWS fillViewport.
    // This should be replaced once we optimize sort going to the newly sorted location.
    if ((this.m_currentScrollLeft + this.getViewportWidth()) < this.m_startColPixel ||
            this.m_currentScrollLeft > this.m_endColPixel ||
            (this.m_currentScrollTop + this.getViewportHeight()) < this.m_startRowPixel ||
            this.m_currentScrollTop > this.m_endRowPixel)
    {
        this.handleLongScroll(this.m_currentScrollLeft, this.m_currentScrollTop);
    }
    else
    {
        this.fillViewport(this.m_currentScrollLeft, this.m_currentScrollTop);
    }
};

/**
 * Perform the bounce back animation when a swipe gesture causes over scrolling
 * @private
 */
DvtDataGrid.prototype._bounceBack = function()
{
    var scrollLeft, scrollTop, databody, colHeader, rowHeader, dir;

    scrollLeft = this.m_currentScrollLeft;
    scrollTop = this.m_currentScrollTop;

    databody = this.m_databody['firstChild'];
    colHeader = this.m_colHeader['firstChild'];
    rowHeader = this.m_rowHeader['firstChild'];

    // remove existing listener
    databody.removeEventListener("webkitTransitionEnd", this.m_bounceBack);

    databody.style.webkitTransitionDuration = DvtDataGrid.BOUNCE_ANIMATION_DURATION + 'ms';
    colHeader.style.webkitTransitionDuration = DvtDataGrid.BOUNCE_ANIMATION_DURATION + 'ms';
    rowHeader.style.webkitTransitionDuration = DvtDataGrid.BOUNCE_ANIMATION_DURATION + 'ms';

    // process to run after bounce back animation ends
    if (this.m_scrollTransitionEnd == null)
    {
        this.m_scrollTransitionEnd = this._scrollTransitionEnd.bind(this);
    }
    databody.addEventListener("webkitTransitionEnd", this.m_scrollTransitionEnd);

    // scroll back to actual scrollLeft/scrollTop positions
    if (this.getResources().isRTLMode())
    {
        databody.style.webkitTransform = "translate3d(" + scrollLeft + "px, " + (-scrollTop) + "px, 0)";
        colHeader.style.webkitTransform = "translate3d(" + scrollLeft + "px, 0, 0)";
    }
    else
    {
        databody.style.webkitTransform = "translate3d(" + (-scrollLeft) + "px, " + (-scrollTop) + "px, 0)";
        colHeader.style.webkitTransform = "translate3d(" + (-scrollLeft) + "px, 0, 0)";
    }
    rowHeader.style.webkitTransform = "translate3d(0, " + (-scrollTop) + "px, 0)";

    // reset
    this.m_extraScrollOverX = null;
    this.m_extraScrollOverY = null;
};

/**
 * Make sure the databody/headers and the scroller are in sync, which could happen when scrolling
 * stopped awaiting fetch to complete.
 * @private
 */
DvtDataGrid.prototype._syncScroller = function()
{
    var scrollLeft, scrollTop, databody, colHeader, rowHeader, dir, prevScrollLeft, prevScrollTop;

    scrollLeft = this.m_currentScrollLeft;
    scrollTop = this.m_currentScrollTop;

    databody = this.m_databody['firstChild'];
    colHeader = this.m_colHeader['firstChild'];
    rowHeader = this.m_rowHeader['firstChild'];

    // use translate3d for smoother scrolling
    // this checks determine whether this is webkit and translated3d is supported
    if (this.m_utils.isTouchDevice() && window.hasOwnProperty('WebKitCSSMatrix'))
    {
        // check if the swipe gesture causes over scrolling of scrollable area
        if (this.m_extraScrollOverX != null || this.m_extraScrollOverY != null)
        {
            // swipe horizontal or vertical
            if (this.m_extraScrollOverX != null)
            {
                scrollLeft = scrollLeft + this.m_extraScrollOverX;
            }
            else
            {
                scrollTop = scrollTop + this.m_extraScrollOverY;
            }

            // bounce back animation function
            if (this.m_bounceBack == null)
            {
                this.m_bounceBack = this._bounceBack.bind(this);
            }

            databody.addEventListener("webkitTransitionEnd", this.m_bounceBack);
        }
        else
        {
            if (databody.style.webkitTransitionDuration == '0ms')
            {
                // no transition, just call the handler directly
                this._scrollTransitionEnd();
            }
            else
            {
                if (this.m_scrollTransitionEnd == null)
                {
                    this.m_scrollTransitionEnd = this._scrollTransitionEnd.bind(this);
                }
                databody.addEventListener("webkitTransitionEnd", this.m_scrollTransitionEnd);
            }
        }

        // actual scrolling of databody and headers
        if (this.getResources().isRTLMode())
        {
            databody.style.webkitTransform = "translate3d(" + scrollLeft + "px, " + (-scrollTop) + "px, 0)";
            colHeader.style.webkitTransform = "translate3d(" + scrollLeft + "px, 0, 0)";
        }
        else
        {
            databody.style.webkitTransform = "translate3d(" + (-scrollLeft) + "px, " + (-scrollTop) + "px, 0)";
            colHeader.style.webkitTransform = "translate3d(" + (-scrollLeft) + "px, 0, 0)";
        }
        rowHeader.style.webkitTransform = "translate3d(0, " + (-scrollTop) + "px, 0)";
    }
    else
    {
        dir = this.getResources().isRTLMode() ? "right" : "left";
        prevScrollLeft = this.getElementDir(databody, dir);
        prevScrollTop = this.getElementDir(databody, 'top');
        this.setElementDir(databody, -scrollLeft, dir);
        this.setElementDir(databody, -scrollTop, 'top');
        this.setElementDir(colHeader, -scrollLeft, dir);
        this.setElementDir(rowHeader, -scrollTop, 'top');
        // If detect an actual scroll, fire scroll event
        if (prevScrollTop !== -scrollTop || prevScrollLeft !== -scrollLeft)
        {
            this.fireEvent('scroll', {'event': null, 'ui':{'scrollX': scrollLeft, 'scrollY': scrollTop}});
        }
    }
};

/**
 * Adjust the scroller when we scroll to the ends of the scroller.  The scroller dimension might
 * need adjustment due to 1) variable column width or row height due to custom sizing 2) the row
 * or column count is not exact.
 * @private
 */
DvtDataGrid.prototype._adjustScrollerSize = function()
{
    var scrollerContent, scrollerContentHeight, scrollerContentWidth, databodyContent;
    scrollerContent = this.m_scroller['firstChild'];
    scrollerContentHeight = this.getElementHeight(scrollerContent);
    scrollerContentWidth = this.getElementWidth(scrollerContent);
    databodyContent = this.m_databody['firstChild'];

    // if (1) actual content is higher than scroller (regardless of the current position) OR
    //    (2) we have reached the last row and the actual content is shorter than scroller
    if ((this.m_endRowPixel > scrollerContentHeight) ||
            (this.getDataSource().getCount('row') == (this.m_endRow + 1) && !this._isCountUnknown('row') && this.m_endRowPixel < scrollerContentHeight))
    {
        this.setElementHeight(scrollerContent, this.m_endRowPixel);
        this.setElementHeight(databodyContent, this.m_endRowPixel);
    }

    // if (1) actual content is wider than scroller (regardless of the current position) OR
    //    (2) we have reached the last column and the actual content is narrower than scroller
    if ((this.m_endColPixel > scrollerContentWidth) ||
            (this.getDataSource().getCount('column') == (this.m_endCol + 1) && !this._isCountUnknown('column') && this.m_endColPixel < scrollerContentWidth))
    {
        this.setElementWidth(scrollerContent, this.m_endColPixel);
        this.setElementWidth(databodyContent, this.m_endColPixel);
    }
};

/**
 * Handle scroll to position that is completely outside of the current row/column range
 * For example, in Chrome it is possible to cause a "jump" back to the start position
 * This might also be needed if we decide to use delay scroll (to detect long scroll) to avoid
 * excessive fetching.
 * @param {number} scrollLeft - the position the scroller left should be
 * @param {number} scrollTop - the position the scroller top should be
 */
DvtDataGrid.prototype.handleLongScroll = function(scrollLeft, scrollTop)
{
    var startRow, startCol, startRowPixel, startColPixel;

    // do a fetch based on current scroll position
    startRow = Math.round(Math.max(0, scrollTop - this.getHeight() / 2) / this.m_avgRowHeight);
    startCol = Math.round(Math.max(0, scrollLeft - this.getWidth() / 2) / this.m_avgColWidth);
    startRowPixel = startRow * this.m_avgRowHeight;
    startColPixel = startCol * this.m_avgColWidth;

    // reset ranges
    this.m_startRow = startRow;
    this.m_endRow = -1;
    this.m_startRowHeader = startRow;
    this.m_endRowHeader = -1;
    this.m_startRowPixel = startRowPixel;
    this.m_endRowPixel = startRowPixel;
    this.m_startRowHeaderPixel = startRowPixel;
    this.m_endRowHeaderPixel = startRowPixel;

    this.m_startCol = startCol;
    this.m_endCol = -1;
    this.m_startColHeader = startCol;
    this.m_endColHeader = -1;
    this.m_startColPixel = startColPixel;
    this.m_endColPixel = startColPixel;
    this.m_startColHeaderPixel = startColPixel;
    this.m_endColHeaderPixel = startColPixel;

    // custom success callback so that we can reset all ranges and fields
    // initiate fetch of headers and cells
    this.fetchHeaders("row", startRow, this.m_rowHeader, undefined, {'success': function(headerSet, headerRange)
        {
            this.handleRowHeadersFetchSuccessForLongScroll(headerSet, headerRange, startRowPixel);
        }});
    this.fetchHeaders("column", startCol, this.m_colHeader, undefined, {'success': function(headerSet, headerRange)
        {
            this.handleColumnHeadersFetchSuccessForLongScroll(headerSet, headerRange);
        }});
    this.fetchCells(this.m_databody, this.m_scroller, startRow, startCol, null, null, {'success': function(cellSet, cellRange)
        {
            this.handleCellsFetchSuccessForLongScroll(cellSet, cellRange, startRow, startCol, startRowPixel, startColPixel);
        }});
};

/**
 * Handle a successful call to the data source fetchHeaders for long scroll
 * @param {Object} headerSet - the result of the fetch
 * @param {Object} headerRange - {"axis":,"start":,"count":,"header":}
 * @param {number} startRowPixel - the pixel to beign insert at
 * @protected
 */
DvtDataGrid.prototype.handleRowHeadersFetchSuccessForLongScroll = function(headerSet, headerRange, startRowPixel)
{
    var headerContent = this.m_rowHeader['firstChild'];
    if (headerContent != null)
    {
        this.m_utils.empty(headerContent);
    }
    this.handleHeadersFetchSuccess(headerSet, headerRange);
};

/**
 * Handle a successful call to the data source fetchHeaders for long scroll
 * @param {Array.<(Object|string)>} headerSet - an array of headers returned from the dataSource
 * @param {Object} headerRange - {"axis":,"start":,"count":,"header":}
 * @protected
 */
DvtDataGrid.prototype.handleColumnHeadersFetchSuccessForLongScroll = function(headerSet, headerRange)
{
    var headerContent = this.m_colHeader['firstChild'];
    if (headerContent != null)
    {
        this.m_utils.empty(headerContent);
    }
    this.handleHeadersFetchSuccess(headerSet, headerRange);
};

/**
 * Handle a successful call to the data source fetchCells. Create new row and
 * cell DOM elements when necessary and then insert them into the databody.
 * @param {Object} cellSet - a CellSet object which encapsulates the result set of cells
 * @param {Array.<Object>} cellRange - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 * @param {number} startRow the row to start insert at
 * @param {number} startCol the col to start insert at
 * @param {number} startRowPixel the row pixel to start insert at
 * @param {number} startColPixel the col pixel to start insert at
 * @protected
 */
DvtDataGrid.prototype.handleCellsFetchSuccessForLongScroll = function(cellSet, cellRange, startRow, startCol, startRowPixel, startColPixel)
{
    var databodyContent = this.m_databody['firstChild'];
    if (databodyContent != null)
    {
        this.m_utils.empty(databodyContent);
    }

    // now calls fetch success proc
    this.handleCellsFetchSuccess(cellSet, cellRange);
};

/**
 * Make sure the viewport is filled of cells
 * @param {number} scrollLeft - the position of the scroller left
 * @param {number} scrollTop - the position of the scroller top
 */
DvtDataGrid.prototype.fillViewport = function(scrollLeft, scrollTop)
{
    var viewportRight, databodyContent, fetchStartCol, fetchSize, viewportBottom, fetchStartRow;
    databodyContent = this.m_databody['firstChild'];

    //the viewport is the scroller, width and height
    viewportRight = scrollLeft + this.getElementWidth(this.m_scroller);
    // scroll position passes the header content or reach the right (left for rtl) if count is unknown
    if (!this.m_stopColumnHeaderFetch && (viewportRight > this.m_endColHeaderPixel || (viewportRight == this.m_endColHeaderPixel && this._isCountUnknownOrHighwatermark("column"))))
    {
        // add column headers to right
        this.fetchHeaders("column", this.m_endColHeader + 1, this.m_colHeader);

        // clean up left column headers
        if (!this._isHighWatermarkScrolling() && ((this.m_endColHeader - this.m_startColHeader) > this.MAX_COLUMN_THRESHOLD))
        {
            this.removeColumnHeadersFromLeft(this.m_colHeader);
        }
    }
    else if (scrollLeft < this.m_startColHeaderPixel)
    {
        // add column headers to left
        fetchStartCol = Math.max(0, this.m_startColHeader - this.getFetchSize("column"));
        fetchSize = Math.max(0, this.m_startColHeader - fetchStartCol);
        this.fetchHeaders("column", fetchStartCol, this.m_colHeader, fetchSize);

        // clean up right column headers
        if (!this._isHighWatermarkScrolling() && ((this.m_endColHeader - this.m_startColHeader) > this.MAX_COLUMN_THRESHOLD))
        {
            this.removeColumnHeadersFromRight(this.m_colHeader);
        }
    }

    // scroll position passes the databody content or reach the right (left if rtl) if count is unknown
    if (!this.m_stopColumnFetch && (viewportRight > this.m_endColPixel || (viewportRight == this.m_endColPixel && this._isCountUnknownOrHighwatermark("column"))))
    {
        // add columns to right
        this.fetchCells(this.m_databody, this.m_scroller, this.m_startRow, this.m_endCol + 1, this.m_endRow - this.m_startRow + 1);

        // clean up left columns
        if (!this._isHighWatermarkScrolling() && (this.m_endCol - this.m_startCol) > this.MAX_COLUMN_THRESHOLD)
        {
            this.removeColumnsFromLeft(this.m_databody);
        }
    }
    else if (scrollLeft < this.m_startColPixel)
    {
        // add columns to left
        fetchStartCol = Math.max(0, this.m_startCol - this.getFetchSize("column"));
        fetchSize = Math.max(0, this.m_startCol - fetchStartCol);
        this.fetchCells(this.m_databody, this.m_scroller, this.m_startRow, fetchStartCol, this.m_endRow - this.m_startRow + 1, fetchSize);

        // clean up left columns
        if (!this._isHighWatermarkScrolling() && (this.m_endCol - this.m_startCol) > this.MAX_COLUMN_THRESHOLD)
        {
            this.removeColumnsFromRight(this.m_databody);
        }
    }

    viewportBottom = scrollTop + this.getElementHeight(this.m_scroller);

    // scroll position passes the header content or reach the bottom if count is unknown
    if (!this.m_stopRowHeaderFetch && (viewportBottom > this.m_endRowHeaderPixel || (viewportBottom == this.m_endRowHeaderPixel && this._isCountUnknownOrHighwatermark("row"))))
    {
        // add row headers to bottom
        this.fetchHeaders("row", this.m_endRowHeader + 1, this.m_rowHeader);

        // clean up top row headers
        if (!this._isHighWatermarkScrolling() && (this.m_endRowHeader - this.m_startRowHeader) > this.MAX_ROW_THRESHOLD)
        {
            this.removeRowHeadersFromTop(this.m_rowHeader);
        }
    }

    else if (Math.max(0, (scrollTop - this.getRowThreshold())) < this.m_startRowHeaderPixel)
    {
        // if we reach the top row then stop
        if (this.m_startRowHeader == 0)
        {
            return;
        }

        // add row headers to top
        fetchStartRow = Math.max(0, this.m_startRowHeader - this.getFetchSize("row"));
        fetchSize = Math.max(0, this.m_startRowHeader - fetchStartRow);
        this.fetchHeaders("row", fetchStartRow, this.m_rowHeader, fetchSize);

        // clean up bottom row headers
        if (!this._isHighWatermarkScrolling() && (this.m_endRowHeader - this.m_startRowHeader) > this.MAX_ROW_THRESHOLD)
        {
            this.removeRowHeadersFromBottom(this.m_rowHeader);
        }
    }

    // scroll position passes the databody content or reach the bottom if count is unknown
    if (!this.m_stopRowFetch && (viewportBottom > this.m_endRowPixel || (viewportBottom == this.m_endRowPixel && this._isCountUnknownOrHighwatermark("row"))))
    {
        // add rows to bottom
        this.fetchCellsToBottom();

        // clean up top rows
        if (!this._isHighWatermarkScrolling() && (this.m_endRow - this.m_startRow) > this.MAX_ROW_THRESHOLD)
        {
            this.removeRowsFromTop(this.m_databody);
        }
    }
    else if (Math.max(0, (scrollTop - this.getRowThreshold())) < this.m_startRowPixel)
    {
        // if we reach the top row then stop
        if (this.m_startRow == 0)
        {
            return;
        }

        // add rows to top
        this.fetchCellsToTop();

        // clean up bottom rows
        if (!this._isHighWatermarkScrolling() && (this.m_endRow - this.m_startRow) > this.MAX_ROW_THRESHOLD)
        {
            this.removeRowsFromBottom(this.m_databody);
        }
    }
};

/**
 * Fetch cells and append results to the bottom
 * @protected
 */
DvtDataGrid.prototype.fetchCellsToBottom = function()
{
    this.fetchCells(this.m_databody, this.m_scroller, this.m_endRow + 1, this.m_startCol, null, this.m_endCol - this.m_startCol + 1);
};

/**
 * Fetch cells and insert results to the top
 * @protected
 */
DvtDataGrid.prototype.fetchCellsToTop = function()
{
    var fetchSize, fetchStartRow;
    // add rows to top
    fetchStartRow = Math.max(0, this.m_startRow - this.getFetchSize("row"));
    fetchSize = Math.max(0, this.m_startRow - fetchStartRow);
    this.fetchCells(this.m_databody, this.m_scroller, fetchStartRow, this.m_startCol, fetchSize, this.m_endCol - this.m_startCol + 1);
};

/**
 * Remove column headers to the left of the current viewport
 * @param {Element} colHeader - the root of the column headers
 */
DvtDataGrid.prototype.removeColumnHeadersFromLeft = function(colHeader)
{
    var colHeaderContent, colThreshold, returnVal;

    colHeaderContent = colHeader['firstChild'];
    colThreshold = this.getColumnThreshold();
    if (this.m_startColHeaderPixel >= this.m_currentScrollLeft - colThreshold)
    {
        return;
    }

    returnVal = this.removeColumnHeadersFromLeftOfContainer(colHeaderContent, null, this.m_startColHeaderPixel, colThreshold);

    this.m_startColHeaderPixel += returnVal['widthChange'];
    this.m_startColHeader += returnVal['extentChange'];
};

/**
 * Removes all of the column headers in the containing div up until the right value is less than the scroll left minus the column threshold.
 * It is recuresively called on inner levels in the multi-level header case.
 * @param {Element} columnHeadersContainer
 * @param {Element|null} firstChild
 * @param {number} resizerWidth
 * @param {number} colThreshold
 * @returns {Object} object with keys extentChange, which denotes how many header
 *      indexes were removed under the parent and removedColumnsWidth which is the
 *      total width of the headers removed
 */
DvtDataGrid.prototype.removeColumnHeadersFromLeftOfContainer = function(columnHeadersContainer, firstChild, resizerWidth, colThreshold)
{
    var columnHeaders, element, isColumnHeader, columnHeader, width, removedColumnsWidth = 0, removedColumns = 0, returnVal;

    columnHeaders = columnHeadersContainer['childNodes'];
    element = firstChild == null ? columnHeadersContainer['firstChild'] : firstChild['nextSibling'];
    if (element == null)
    {
        return {'extentChange': 0, 'widthChange': 0};
    }
    isColumnHeader = this.m_utils.containsCSSClassName(element, this.getMappedStyle('colheadercell'));
    columnHeader = isColumnHeader ? element : element['firstChild'];
    width = this.getElementWidth(columnHeader);

    while (resizerWidth + width < this.m_currentScrollLeft - colThreshold)
    {
        this._remove(element);
        removedColumnsWidth += width;
        removedColumns += isColumnHeader ? 1 : this._getAttribute(element, 'extent', true);
        resizerWidth += width;

        element = firstChild == null ? columnHeadersContainer['firstChild'] : firstChild['nextSibling'];
        if (element == null)
        {
            return {'extentChange': removedColumns, 'widthChange': removedColumnsWidth};
        }
        isColumnHeader = this.m_utils.containsCSSClassName(element, this.getMappedStyle('colheadercell'));
        columnHeader = isColumnHeader ? element : element['firstChild'];
        width = this.getElementWidth(columnHeader);
    }

    if (!isColumnHeader)
    {
        returnVal = this.removeColumnHeadersFromLeftOfContainer(element, element['firstChild'], resizerWidth, colThreshold);
        this._setAttribute(element, 'start', this._getAttribute(element, 'start', true) + returnVal['extentChange']);
        this._setAttribute(element, 'extent', this._getAttribute(element, 'extent', true) - returnVal['extentChange']);
        this.setElementDir(columnHeader, this.getElementDir(columnHeader, 'left') + returnVal['widthChange'], 'left');
        this.setElementWidth(columnHeader, this.getElementWidth(columnHeader) - returnVal['widthChange']);

        removedColumns += returnVal['extentChange'];
        removedColumnsWidth += returnVal['widthChange'];
    }

    return {'extentChange': removedColumns, 'widthChange': removedColumnsWidth};
};


/**
 * Remove cells to the left of the current viewport
 * @param {Element} databody - the root of the databody
 */
DvtDataGrid.prototype.removeColumnsFromLeft = function(databody)
{
    var databodyContent, rows, indexToRemove, left, colThreshold, columns, i, column, prevLeft, j, row, k;
    databodyContent = databody['firstChild'];
    rows = databodyContent['childNodes'];
    indexToRemove = 0;
    left = 0;
    colThreshold = this.getColumnThreshold();

    // no rows in databody, nothing to remove
    if (rows.length < 1)
    {
        return;
    }

    // just use the first row to find the cut off point
    columns = rows[0]['childNodes'];
    for (i = 0; i < columns.length; i += 1)
    {
        column = columns[i];
        prevLeft = left;
        left = this.getElementDir(column, 'left');
        if (left > (this.m_currentScrollLeft - colThreshold))
        {
            indexToRemove = i - 1;
            this.m_startCol = this.m_startCol + indexToRemove;
            this.m_startColPixel = prevLeft;

            break;
        }
    }

    for (j = 0; j < rows.length; j += 1)
    {
        row = rows[j];
        for (k = 0; k < indexToRemove; k += 1)
        {
            this._remove(row['firstChild']);
        }
    }
};

/**
 * Remove column headers to the right of the current viewport
 * @param {Element} colHeader - the root of the column headers
 */
DvtDataGrid.prototype.removeColumnHeadersFromRight = function(colHeader)
{
    var colHeaderContent, threshold;
    colHeaderContent = colHeader['firstChild'];
    threshold = this.m_currentScrollLeft + this.getViewportWidth() + this.getColumnThreshold();

    // don't clean up if end of row header is not below the bottom of viewport
    if (this.m_endColHeaderPixel <= threshold)
    {
        return;
    }

    if (this.m_stopColumnHeaderFetch)
    {
        this.m_stopColumnHeaderFetch = false;
    }
    this.removeColumnHeadersFromRightOfContainer(colHeaderContent, threshold);

};

/**
 * Removes all of the column headers in the containing div up until the left value is less than the specified threshold.
 * It is recuresively called on inner levels in the multi-level header case.
 * @param {Element} columnHeadersContainer
 * @param {number} threshold
 * @returns {Object} object with keys extentChange, which denotes how many header
 *      indexes were removed under the parent and widthChange which is the
 *      total width of the headers removed
 */
DvtDataGrid.prototype.removeColumnHeadersFromRightOfContainer = function(columnHeadersContainer, threshold)
{
    var element, columnHeader, isColumnHeader, width, removedColumns = 0, removedColumnsWidth = 0, returnVal;

    element = columnHeadersContainer['lastChild'];
    isColumnHeader = this.m_utils.containsCSSClassName(element, this.getMappedStyle('colheadercell'));
    columnHeader = isColumnHeader ? element : element['firstChild'];
    width = this.getElementWidth(columnHeader);

    while (this.m_endColHeaderPixel - width > threshold)
    {
        this._remove(element);

        removedColumnsWidth += width;
        removedColumns += isColumnHeader ? 1 : this._getAttribute(element, 'extent', true);

        this.m_endColHeaderPixel -= width;
        this.m_endColHeader -= isColumnHeader ? 1 : this._getAttribute(element, 'extent', true);

        element = columnHeadersContainer['lastChild'];
        isColumnHeader = this.m_utils.containsCSSClassName(element, this.getMappedStyle('colheadercell'));
        columnHeader = isColumnHeader ? element : element['firstChild'];
        width = this.getElementWidth(columnHeader);
    }

    if (!isColumnHeader)
    {
        returnVal = this.removeColumnHeadersFromRightOfContainer(element, threshold);

        this._setAttribute(element, 'extent', this._getAttribute(element, 'extent', true) - returnVal['extentChange']);
        this.setElementWidth(columnHeader, this.getElementWidth(columnHeader) - returnVal['widthChange']);

        removedColumns += returnVal['extentChange'];
        removedColumnsWidth += returnVal['widthChange'];
    }

    return {'extentChange': removedColumns, 'widthChange': removedColumnsWidth};
};

/**
 * Remove cells to the right of the current viewport
 * @param {Element} databody - the root of the databody
 */
DvtDataGrid.prototype.removeColumnsFromRight = function(databody)
{
    var databodyContent, threshold, columns, column, width, rows, j, row;
    databodyContent = databody['firstChild'];
    rows = databodyContent['childNodes'];
    threshold = this.m_currentScrollLeft + this.getViewportWidth() + this.getColumnThreshold();

    // don't clean up if end of row header is not below the bottom of viewport
    if (this.m_endColPixel <= threshold)
    {
        return;
    }

    if (this.m_stopColumnFetch)
    {
        this.m_stopColumnFetch = false;
    }

    columns = rows[1];
    column = columns['lastChild'];
    width = this.getElementWidth(column);
    while (this.m_endColPixel - width > threshold)
    {
        for (j = 0; j < rows.length; j += 1)
        {
            row = rows[j];
            this._remove(row['lastChild']);
        }
        this.m_endColPixel = this.m_endColPixel - width;
        this.m_endCol -= 1;

        column = columns['lastChild'];
        width = this.getElementWidth(column);
    }
};

/**
 * Remove row headers above the current viewport
 * @param {Element} rowHeader - the root of the row headers
 */
DvtDataGrid.prototype.removeRowHeadersFromTop = function(rowHeader)
{
    var rowHeaderContent, rowThreshold, returnVal;
    rowHeaderContent = rowHeader['firstChild'];
    rowThreshold = this.getRowThreshold();
    if (this.m_startRowHeaderPixel >= this.m_currentScrollTop - rowThreshold)
    {
        return;
    }

    returnVal = this.removeRowHeadersFromTopOfContainer(rowHeaderContent, null, this.m_startRowHeaderPixel, rowThreshold);

    this.m_startRowHeaderPixel += returnVal['heightChange'];
    this.m_startRowHeader += returnVal['extentChange'];
};

/**
 * Removes all of the row headers in the containing div up until the bottom value is less than the scroll top minus the threshold.
 * It is recuresively called on inner levels in the multi-level header case.
 * @param {Element} rowHeadersContainer
 * @param {Element} firstChild
 * @param {number} resizerHeight
 * @param {number} rowThreshold
 * @returns {Object} object with keys extentChange, which denotes how many header
 *      indexes were removed under the parent and heightChange which is the
 *      total height of the headers removed
 */
DvtDataGrid.prototype.removeRowHeadersFromTopOfContainer = function(rowHeadersContainer, firstChild, resizerHeight, rowThreshold)
{
    var rowHeaders, element, rowHeader, isRowHeader, height, removedRows = 0, removedRowsHeight = 0, returnVal;

    rowHeaders = rowHeadersContainer['childNodes'];
    element = firstChild == null ? rowHeadersContainer['firstChild'] : firstChild['nextSibling'];
    if (element == null)
    {
        return {'extentChange': 0, 'heightChange': 0};
    }
    isRowHeader = this.m_utils.containsCSSClassName(element, this.getMappedStyle('rowheadercell'));
    rowHeader = isRowHeader ? element : element['firstChild'];
    height = this.getElementHeight(rowHeader);

    while (resizerHeight + height < this.m_currentScrollTop - rowThreshold)
    {
        this._remove(element);
        removedRowsHeight += height;
        removedRows += isRowHeader ? 1 : this._getAttribute(element, 'extent', true);
        resizerHeight += height;

        element = firstChild == null ? rowHeadersContainer['firstChild'] : firstChild['nextSibling'];
        if (element == null)
        {
            return {'extentChange': removedRows, 'heightChange': removedRowsHeight};
        }
        isRowHeader = this.m_utils.containsCSSClassName(element, this.getMappedStyle('rowheadercell'));
        rowHeader = isRowHeader ? element : element['firstChild'];
        height = this.getElementHeight(rowHeader);
    }

    if (!isRowHeader)
    {
        returnVal = this.removeRowHeadersFromTopOfContainer(element, element['firstChild'], resizerHeight, rowThreshold);
        this._setAttribute(element, 'start', this._getAttribute(element, 'start', true) + returnVal['extentChange']);
        this._setAttribute(element, 'extent', this._getAttribute(element, 'extent', true) - returnVal['extentChange']);
        this.setElementDir(rowHeader, this.getElementDir(rowHeader, 'top') + returnVal['heightChange'], 'top');
        this.setElementHeight(rowHeader, this.getElementHeight(rowHeader) - returnVal['heightChange']);

        removedRows += returnVal['extentChange'];
        removedRowsHeight += returnVal['heightChange'];
    }

    return {'extentChange': removedRows, 'heightChange': removedRowsHeight};
};

/**
 * Remove rows/cells above the current viewport
 * @param {Element} databody - the root of the databody
 */
DvtDataGrid.prototype.removeRowsFromTop = function(databody)
{
    var databodyContent, rowThreshold, row, height;
    databodyContent = databody['firstChild'];
    rowThreshold = this.getRowThreshold();
    if (this.m_startRowPixel >= this.m_currentScrollTop - rowThreshold)
    {
        return;
    }

    row = databodyContent['firstChild'];
    height = this.getElementHeight(row);
    // remove all rows from top until the threshold is reached
    while (this.m_startRowPixel + height < this.m_currentScrollTop - rowThreshold)
    {
        this._remove(row);

        this.m_startRowPixel = this.m_startRowPixel + height;
        this.m_startRow += 1;

        row = databodyContent['firstChild'];
        // if there's no more rows to remove from the databody
        if (row == null)
        {
            break;
        }
        height = this.getElementHeight(row);
    }
};

/**
 * Remove row headers below the current viewport
 * @param {Element} rowHeader - the root of the row headers
 */
DvtDataGrid.prototype.removeRowHeadersFromBottom = function(rowHeader)
{
    var rowHeaderContent, threshold;
    rowHeaderContent = rowHeader['firstChild'];
    threshold = this.m_currentScrollTop + this.getViewportHeight() + this.getRowThreshold();

    // don't clean up if end of row header is not below the bottom of viewport
    if (this.m_endRowHeaderPixel <= threshold)
    {
        return;
    }

    if (this.m_stopRowHeaderFetch)
    {
        this.m_stopRowHeaderFetch = false;
    }
    this.removeRowHeadersFromBottomOfContainer(rowHeaderContent, threshold);
};

/**
 * Removes row headers from bottom of the containing div while top value greater
 * than threshold. Called recursively for multi-level headers
 * @param {Element} rowHeadersContainer
 * @param {number} threshold
 * @returns {Object}
 */
DvtDataGrid.prototype.removeRowHeadersFromBottomOfContainer = function(rowHeadersContainer, threshold)
{
    var element, rowHeader, isRowHeader, height, removedRows = 0, removedRowsHeight = 0, returnVal;

    element = rowHeadersContainer['lastChild'];
    isRowHeader = this.m_utils.containsCSSClassName(element, this.getMappedStyle('rowheadercell'));
    rowHeader = isRowHeader ? element : element['firstChild'];
    height = this.getElementHeight(rowHeader);

    while (this.m_endRowHeaderPixel - height > threshold)
    {
        this._remove(element);

        removedRowsHeight += height;
        removedRows += isRowHeader ? 1 : this._getAttribute(element, 'extent', true);

        this.m_endRowHeaderPixel -= height;
        this.m_endRowHeader -= isRowHeader ? 1 : this._getAttribute(element, 'extent', true);

        element = rowHeadersContainer['lastChild'];
        isRowHeader = this.m_utils.containsCSSClassName(element, this.getMappedStyle('rowheadercell'));
        rowHeader = isRowHeader ? element : element['firstChild'];
        height = this.getElementHeight(rowHeader);
    }

    if (!isRowHeader)
    {
        returnVal = this.removeRowHeadersFromBottomOfContainer(element, threshold);

        this._setAttribute(element, 'extent', this._getAttribute(element, 'extent', true) - returnVal['extentChange']);
        this.setElementHeight(rowHeader, this.getElementHeight(rowHeader) - returnVal['heightChange']);

        removedRows += returnVal['extentChange'];
        removedRowsHeight += returnVal['heightChange'];
    }

    return {'extentChange': removedRows, 'heightChange': removedRowsHeight};
};

/**
 * Remove rows/cells below the current viewport
 * @param {Element} databody - the root of the databody
 */
DvtDataGrid.prototype.removeRowsFromBottom = function(databody)
{
    var databodyContent, threshold, row, height;
    databodyContent = databody['firstChild'];
    threshold = this.m_currentScrollTop + this.getViewportHeight() + this.getRowThreshold();

    // don't clean up if end of row header is not below the bottom of viewport
    if (this.m_endRowPixel <= threshold)
    {
        return;
    }

    if (this.m_stopRowFetch)
    {
        this.m_stopRowFetch = false;
    }

    row = databodyContent['lastChild'];
    height = this.getElementHeight(row);
    while (this.m_endRowPixel - height > threshold)
    {
        this._remove(row);

        this.m_endRowPixel = this.m_endRowPixel - height;
        this.m_endRow -= 1;

        row = databodyContent['lastChild'];
        height = this.getElementHeight(row);
    }
};

/**
 * Handles mouse down on the scroller
 * @param {Event} event the mouse down event
 * @protected
 */
DvtDataGrid.prototype.handleScrollerMouseDown = function(event)
{
    // start keeping track of scrolling.  This is used to determine whether long scroll
    // should be invoke and also when to start fetching
    this.m_captureScrolling = true;
};

/**
 * Handles mouse up on the scroller
 * @param {Event} event the mouse up event
 * @protected
 */
DvtDataGrid.prototype.handleScrollerMouseUp = function(event)
{
    this.m_captureScrolling = false;

    // see if we need to check data covered the viewport
    if (this.isFetchComplete() && this.m_stopDatabodyScroll)
    {
        this.fillViewport(this.m_currentScrollLeft, this.m_currentScrollTop);
    }
};

/**
 * Debugging method to dump out current range info
 */
DvtDataGrid.prototype.dumpRanges = function()
{
    if (console != undefined && console.log)
    {
        console.log("=================");
        console.log("Start Row: " + this.m_startRow);
        console.log("  End Row: " + this.m_endRow);
        console.log("Start Column: " + this.m_startCol);
        console.log("  End Column: " + this.m_endCol);
        console.log("=================");
    }
};
/*********************************** end scrolling/virtualization ************************************/

/*********************************** start dom event handling ***************************************/
/**
 * Handle the context menu gesture
 * @param {Event} evenet the event of the context menu gesture
 * @param {string} eventType keyboard/touch/mouse
 * @param {function} callback where to pass the data back
 * @export
 */
DvtDataGrid.prototype.handleContextMenuGesture = function(event, eventType, callback)
{
    var index, element, capabilities, launcher, target;
    // if we are on a touch device and in a cell we need to set the correct active
    // and call focus before triggering the context menu to open. headers take
    // care of this by setting active in the 300ms callback for tap+short hold
    target = event['originalEvent'].target;
    element = this.findCell(target);
    if (eventType === 'touch' && element != null)
    {
        index = {"row": this.getRowIndex(element['parentNode']), "column": this.getCellIndex(element)};

        // if right click and inside multiple selection or current active do not change anything
        if ((!this.isMultipleSelection() || !this._isContainSelection(index)) ||
                (this._isDatabodyCellActive() && index['row'] != this.m_active['indexes']['row'] && index['column'] != this.m_active['indexes']['column']))
        {
            if (this._isSelectionEnabled())
            {
                this.handleDatabodyClickSelection(event['originalEvent']);
            }
            else
            {
                //activate on a tap
                this.handleDatabodyClickActive(event['originalEvent']);
            }
        }
    }

    // first check if we are invoking on an editable or clickable element, if so bail
    if (this.m_utils._isNodeEditableOrClickable(target, this.m_root))
    {
        return;
    }

    // enable and disable context menu items depending on capability of the datasource and options
    // if the action was performed on a cell
    if (element != null)
    {
        // if fired from inside a multiple selection
        if (this.isMultipleSelection() && this._isContainSelection(this.getCellIndex(element)))
        {
            launcher = this._getActiveElement();
            // if there is an active cell we want that to be the launcher of the context menu so
            // that focus can be restored to it. If it fired form the keyboard open with launcher and context
            // of the active cell, if right click or touch open with the context of the clicked cell
            if (this._isDatabodyCellActive())
            {
                capabilities = eventType === 'keyboard' ? this._getCellCapability(launcher) : this._getCellCapability(launcher, element);
            }
            // there is the case where header is active and entire row/column selected
            else
            {
                // the launcher will be the active header, and the context of the menu will be relative to the active header
                capabilities = this._getHeaderCapability(launcher, element);
            }
        }
        else
        {
            // open on the cell with its context
            launcher = element;
            capabilities = this._getCellCapability(launcher);
        }
    }
    else
    {
        element = this.findHeader(target);
        if (element == null)
        {
            // not a header or cell don't do anything
            return;
        }
        capabilities = this._getHeaderCapability(element);
        launcher = element;
    }

    callback.call(null, {'capabilities': capabilities, 'launcher': launcher}, event, eventType);
};

/**
 * Get the capabilities for context menu opened on a cell
 * @param {Element} cell the cell whose context we want
 * @param {Element=} actualCell the cell with context menu opened on it
 * @return {Object} capabilities object with props resize, resizeWidth, resizeHeight, sortRow, sortCol, cut, paste
 * @private
 */
DvtDataGrid.prototype._getCellCapability = function(cell, actualCell)
{
    var capabilities, rowHeader, columnHeader, resizable, sortable,
            sameColumn = true, sameRow = true, disable, enable, sorted;
    disable = 'disable';
    enable = 'enable';
    capabilities = {'resize': disable, 'resizeWidth': disable, 'resizeHeight': disable,
        'sortRow': disable, 'sortCol': disable, 'cut': disable, 'paste': disable,
        'sortColAsc': disable, 'sortColDsc': disable};

    // if there is an actual cell that means we want the context relative to that cell,
    // so if it is the same column, our column operations (resize width, sort column) can
    // be utilized. If it's in the same row the row operations (resize height, sort row, cut, paste)
    // can be utilized
    if (actualCell != null)
    {
        sameColumn = this.getCellIndex(cell) === this.getCellIndex(actualCell);
        sameRow = cell.parentNode === actualCell.parentNode;
        if (sameRow === false && sameColumn === false)
        {
            return capabilities;
        }
    }
    rowHeader = this.getHeaderFromCell(cell, 'row');
    columnHeader = this.getHeaderFromCell(cell, 'column');
    resizable = this.getResources().getMappedAttribute('resizable');
    sortable = this.getResources().getMappedAttribute('sortable');
    if (columnHeader != null && sameColumn)
    {
        if (columnHeader.getAttribute(resizable) === 'true')
        {
            capabilities['resize'] = enable;
            capabilities['resizeWidth'] = enable;
        }
        if (columnHeader.getAttribute(sortable) === 'true')
        {
            capabilities['sortCol'] = enable;
            capabilities['sortColAsc'] = enable;
            capabilities['sortColDsc'] = enable;
            sorted = columnHeader.getAttribute(this.getResources().getMappedAttribute('sortDir'));
            if (sorted === 'ascending')
            {
                capabilities['sortColAsc'] = disable;
            }
            else if (sorted === 'descending')
            {
                capabilities['sortColDsc'] = disable;
            }
        }
    }
    if (sameRow)
    {
        if (this._isMoveEnabled('row'))
        {
            capabilities['cut'] = enable;
            capabilities['paste'] = enable;
        }
        if (rowHeader != null)
        {
            if (rowHeader.getAttribute(resizable) === 'true')
            {
                capabilities['resize'] = enable;
                capabilities['resizeHeight'] = enable;
            }
            if (rowHeader.getAttribute(sortable) === 'true')
            {
                capabilities['sortRow'] = enable;
            }
        }
    }
    return capabilities;
};

/**
 * Get the capabilities for context menu opened on a header
 * @param {Element} header the header whose context we want
 * @param {Element} actualCell the cell that we are actually opening on
 * @return {Object} capabilities object with props resizeWidth, resizeHeight, sortRow, sortCol
 * @private
 */
DvtDataGrid.prototype._getHeaderCapability = function(header, actualCell)
{
    var capabilities, resizable, sortable, sameColumn = true, sameRow = true, disable, enable, sorted;
    disable = 'disable';
    enable = 'enable';
    capabilities = {'resize': disable, 'resizeWidth': disable, 'resizeHeight': disable,
        'sortRow': disable, 'sortCol': disable, 'cut': disable, 'paste': disable,
        'sortColAsc': disable, 'sortColDsc': disable};

    // if there is an actual cell that means we want the context relative to that cell,
    // so if it is the same column, our column operations (resize width, sort column) can
    // be utilized. If it's in the same row the row operations (resize height, sort row, cut, paste)
    // can be utilized
    if (actualCell != null)
    {
        sameColumn = this.getHeaderCellIndex(header) === this.getCellIndex(actualCell);
        sameRow = this._getKey(header) === this._getKey(actualCell.parentNode);
        if (sameRow === false && sameColumn === false)
        {
            return capabilities;
        }
    }

    resizable = this.getResources().getMappedAttribute('resizable');
    sortable = this.getResources().getMappedAttribute('sortable');
    if (header !== null)
    {
        if (this.m_utils.containsCSSClassName(header, this.getMappedStyle('colheadercell')) && sameColumn)
        {
            if (header.getAttribute(resizable) === 'true')
            {
                capabilities['resizeWidth'] = enable;
                capabilities['resize'] = enable;
            }
            capabilities['resizeHeight'] = this.m_options.isResizable('column', 'height');
            if (header.getAttribute(sortable) === 'true')
            {
                capabilities['sortCol'] = enable;
                capabilities['sortColAsc'] = enable;
                capabilities['sortColDsc'] = enable;
                sorted = header.getAttribute(this.getResources().getMappedAttribute('sortDir'));
                if (sorted === 'ascending')
                {
                    capabilities['sortColAsc'] = disable;
                }
                else if (sorted === 'descending')
                {
                    capabilities['sortColDsc'] = disable;
                }
            }
        }
        else if (sameRow)
        {
            if (this._isMoveEnabled('row'))
            {
                capabilities['cut'] = enable;
                capabilities['paste'] = enable;
            }
            if (header.getAttribute(resizable) === 'true')
            {
                capabilities['resize'] = enable;
                capabilities['resizeHeight'] = enable;
            }
            capabilities['resizeWidth'] = this.m_options.isResizable('row', 'width');
            if (header.getAttribute(sortable) === 'true')
            {
                capabilities['sortRow'] = enable;
            }
        }
    }
    capabilities['resize'] = capabilities['resizeHeight'] === enable ||
            capabilities['resizeWidth'] === enable ? enable : disable;

    return capabilities;
};

/**
 * Handle the callback from the widget to resize or sort.
 * @export
 * @param {Event} event - the original contextmenu event
 * @param {string} id - the id returned from the context menu
 * @param {string} value - the value set in the dialog on resizing
 */
DvtDataGrid.prototype.handleContextMenuReturn = function(event, id, value)
{
    var target, direction;

    // the target is the active element at all times
    if (this.m_active != null)
    {
        target = this._getActiveElement();
    }

    if (id === this.m_resources.getMappedCommand('resizeHeight') || id === this.m_resources.getMappedCommand('resizeWidth'))
    {
        if ((this.isResizeEnabled()))
        {
            // target may not be event.target
            this.handleContextMenuResize(event, id, value, target);
        }
    }
    else if (id === this.m_resources.getMappedCommand('sortColAsc') || id === this.m_resources.getMappedCommand('sortColDsc'))
    {
        direction = id === this.m_resources.getMappedCommand('sortColAsc') ? 'ascending' : 'descending';
        if (this.m_utils.containsCSSClassName(target, this.getMappedStyle('cell')))
        {
            target = this.getHeaderFromCell(target, 'column');
        }
        if (this._isDOMElementSortable(target))
        {
            this._handleCellSort(event, direction, target);
        }
    }
    else if (id === this.m_resources.getMappedCommand('sortRowAsc') || id === this.m_resources.getMappedCommand('sortRowDsc'))
    {
        direction = id === this.m_resources.getMappedCommand('sortRowAsc') ? 'ascending' : 'descending';
        if (this.m_utils.containsCSSClassName(target, this.getMappedStyle('cell')))
        {
            target = this.getHeaderFromCell(target, 'row');
        }
        if (this._isDOMElementSortable(target))
        {
            this._handleCellSort(event, direction, target);
        }
    }
    else if (id === this.m_resources.getMappedCommand('cut'))
    {
        this._handleCut(event, target);
    }
    else if (id === this.m_resources.getMappedCommand('paste'))
    {
        this._handlePaste(event, target);
    }
    else if (id === this.m_resources.getMappedCommand('discontiguousSelection'))
    {
        // handle discontiguous selection context menu
        this.setDiscontiguousSelectionMode(value);
    }
};

/**
 * Determined if sort is supported for the specified axis.
 * @param {string} axis the axis which we check whether sort is supported.
 * @param {Object} headerContext the header context object
 * @private
 */
DvtDataGrid.prototype._isSortEnabled = function(axis, headerContext)
{
    var capability, sortable;
    capability = this.getDataSource().getCapability("sort");
    sortable = this.m_options.isSortable(axis, headerContext);
    if ((sortable === "enable" || sortable === "auto") && (capability === "full" || capability === axis))
    {
        return true;
    }

    return false;
};

/**
 * Determined if sort is supported for the specified element.
 * @param {HMTLElement} element to check if sorting should be on
 * @private
 */
DvtDataGrid.prototype._isDOMElementSortable = function(element)
{
    var header = this.findHeader(element);
    if (header == null)
    {
        return false;
    }
    return header.getAttribute(this.getResources().getMappedAttribute('sortable')) == "true";
};

/**
 * Check if selection enabled by options on the grid
 * @return {boolean} true if selection enabled
 * @private
 */
DvtDataGrid.prototype._isSelectionEnabled = function()
{
    return (this.m_options.getSelectionCardinality() != "none");
};

/**
 * Check whether multiple row/cell selection is allowed by options on the grid
 * @return {boolean} true if multipl selection enabled
 */
DvtDataGrid.prototype.isMultipleSelection = function()
{
    return (this.m_options.getSelectionCardinality() == "multiple");
};

/**
 * Check if resizing enabled on any header by options on the grid
 * @return {boolean} true if resize enabled
 */
DvtDataGrid.prototype.isResizeEnabled = function()
{
    var row = this.m_options.isResizable("row"), column = this.m_options.isResizable("column");
    return (row["width"] !== "disable" || row["height"] !== "disable" || column["width"] !== "disable" || column["height"] !== "disable");
};

/**
 * Check if resizing enabled on a specific header
 * @param {string} axis the axis which we check whether sort is supported.
 * @param {Object} headerContext the header context object
 * @return {boolean} true if resize enabled
 */
DvtDataGrid.prototype._isHeaderResizeEnabled = function(axis, headerContext)
{
    var resizable;
    if (axis == 'column')
    {
        resizable = this.m_options.isResizable(axis, 'width', headerContext);
        return resizable == 'enable' ? true : false;
    }
    else if (axis == 'row')
    {
        resizable = this.m_options.isResizable(axis, 'height', headerContext);
        return resizable == 'enable' ? true : false;
    }
    return false;
};

/**
 * Handle mousemove events on the document
 * @param {Event} event - mousemove event on the document
 */
DvtDataGrid.prototype.handleMouseMove = function(event)
{
    if (this.isResizeEnabled() && (this.m_databodyDragState == false))
    {
        this.handleResize(event);
    }
};

/**
 * Handle row header mousemove events on the document
 * @param {Event} event - mousemove event on the document
 */
DvtDataGrid.prototype.handleRowHeaderMouseMove = function(event)
{
    if (this.m_databodyMove)
    {
        this._handleMove(event);
    }
};

/**
 * Handle mousedown events on the headers
 * @param {Event} event - mousedown event on the headers
 */
DvtDataGrid.prototype.handleHeaderMouseDown = function(event)
{
    var row, processed;

    this._exitActionableMode();

    //only perform events on left mouse, (right in rtl culture)
    if (event.button === 0)
    {
        //if mousedown in an icon it the click event will handle mousedown/up
        if ((this.m_utils.containsCSSClassName(event.target, this.getMappedStyle('sortascending')) ||
                this.m_utils.containsCSSClassName(event.target, this.getMappedStyle('sortdescending')))
                && this._isDOMElementSortable(event.target))
        {
            event.preventDefault();
            this._handleSortIconMouseDown(event.target);
            return;
        }

        //handle resize movements first if we're on the border
        if (this.isResizeEnabled())
        {
            processed = this.handleResizeMouseDown(event);
        }

        row = this.findRow(event.target);
        //if our move is enabled make sure our row has the active cell in it
        if (!this.m_isResizing && this._isMoveOnRowEnabled(row))
        {
            this.m_databodyMove = true;
            this.m_currentX = event['pageX'];
            this.m_currentY = event['pageY'];
            processed = true;
        }
    }

    // activate header on click or right click
    // this will also clear the selection
    if (!this.m_isResizing)
    {
        if (!this.m_root.contains(document.activeElement) || document.activeElement === this.m_root)
        {
            this.m_externalFocus = true;
        }
        this.handleHeaderClickActive(event);
    }

    if (processed === true)
    {
        event.preventDefault();
    }
};

/**
 * Handle mouseup events on the document
 * @param {Event} event - mouseup event on the document
 */
DvtDataGrid.prototype.handleMouseUp = function(event)
{
    //if we mouseup outside the grid we want to cancel the selection and return the row
    if (this.m_databodyMove && this.m_moveRow != null)
    {
        this._handleMoveMouseUp(event, false);
    }
    else if (this.isResizeEnabled())
    {
        this.handleResizeMouseUp(event);
    }
    this.m_databodyMove = false;
};

DvtDataGrid.prototype.handleHeaderMouseOver = function(event)
{
    this.m_utils.addCSSClassName(this.findHeader(event.target), this.getMappedStyle('hover'));
    if (this._isDOMElementSortable(event.target))
    {
        this._handleSortMouseOver(event);
    }
};

DvtDataGrid.prototype.handleHeaderMouseOut = function(event)
{
    this.m_utils.removeCSSClassName(this.findHeader(event.target), this.getMappedStyle('hover'));
    if (this._isDOMElementSortable(event.target))
    {
        this._handleSortMouseOut(event);
    }
};

DvtDataGrid.prototype.handleHeaderMouseUp = function(event)
{
    if (this.m_databodyMove && this.m_moveRow != null)
    {
        this._handleMoveMouseUp(event, true);
    }
};

/**
 * Event handler for when row/column header is clicked
 * @protected
 * @param {Event} event - click event on the headers
 */
DvtDataGrid.prototype.handleHeaderClick = function(event)
{
    if ((this.m_utils.containsCSSClassName(event.target, this.getMappedStyle('sortascending')) ||
            this.m_utils.containsCSSClassName(event.target, this.getMappedStyle('sortdescending')))
            && this._isDOMElementSortable(event.target))
    {
        this._handleHeaderSort(event);
        event.preventDefault();
    }
};

/**
 * Event handler for when mouse down anywhere in the databody
 * @protected
 * @param {Event} event - mousedown event on the databody
 */
DvtDataGrid.prototype.handleDatabodyMouseDown = function(event)
{
    // reset actionable mode whenever user clicks in the databody
    this._exitActionableMode();

    //only perform events on left mouse, (right in rtl culture)
    if (event.button === 0)
    {
        if (this._isMoveOnRowEnabled(this.find(event.target, 'row')))
        {
            this.m_databodyMove = true;
            this.m_currentX = event['pageX'];
            this.m_currentY = event['pageY'];
        }
    }

    if (!this.m_root.contains(document.activeElement) || document.activeElement === this.m_root)
    {
        this.m_externalFocus = true;
    }

    // if click or right click we want to adjust the selction
    // no else so that we can select a cell in the same row as long as no drag
    // check if selection is enabled
    if (this._isSelectionEnabled())
    {
        this.handleDatabodyClickSelection(event);

        // only allow drag on left click
        if (this.isMultipleSelection() && event.button === 0)
        {
            this.m_databodyDragState = true;
        }
    }
    else
    {
        // if selection is disable, we'll still need to highlight the active cell
        this.handleDatabodyClickActive(event);
    }
};

DvtDataGrid.prototype.handleDatabodyMouseOut = function(event)
{
    var row, selectionMode;
    if (!this.m_databodyMove)
    {
        selectionMode = this.m_options.getSelectionMode();
        row = this.findRow(event.target);
        if (selectionMode === 'cell')
        {
            this.m_utils.removeCSSClassName(this.findCell(event.target), this.getMappedStyle('hover'));
        }
        else if (selectionMode === 'row')
        {
            this.m_utils.removeCSSClassName(row, this.getMappedStyle('hover'));
        }
    }
};

DvtDataGrid.prototype.handleDatabodyMouseOver = function(event)
{
    var row, selectionMode;
    if (!this.m_databodyMove)
    {
        selectionMode = this.m_options.getSelectionMode();
        row = this.findRow(event.target);
        if (selectionMode === 'cell')
        {
            this.m_utils.addCSSClassName(this.findCell(event.target), this.getMappedStyle('hover'));
        }
        else if (selectionMode === 'row')
        {
            this.m_utils.addCSSClassName(row, this.getMappedStyle('hover'));
        }
    }
};

/**
 * Event handler for when mouse move anywhere in the databody
 * @protected
 * @param {Event} event - mousemove event on the databody
 */
DvtDataGrid.prototype.handleDatabodyMouseMove = function(event)
{
    //handle move first because it should happen first on the second click
    if (this.m_databodyMove)
    {
        this._handleMove(event);
    }
    else if (this.m_databodyDragState)
    {
        this.handleDatabodySelectionDrag(event);
    }
};

/**
 * Event handler for when mouse down anywhere in the databody
 * @protected
 * @param {Event} event - mouseup event on the databody
 */
DvtDataGrid.prototype.handleDatabodyMouseUp = function(event)
{
    this.m_databodyDragState = false;
    if (this.m_databodyMove && this.m_moveRow != null)
    {
        this._handleMoveMouseUp(event, true);
    }
};

/**
 * Event handler for when user press down a key in the databody
 * @protected
 * @param {Event} event - keydown event on the databody
 */
DvtDataGrid.prototype.handleDatabodyKeyDown = function(event)
{
    var newCellIndex, cell, processed;

    // if context menu calls enter/esc it will not stop propegation so
    // the event can bubble to here, it will prevent default instead so
    // we should not handle it
    if (event.defaultPrevented)
    {
        return;
    }

    // if selection is disable OR we are in navigation mode, tab key should go to the previous/next focusable
    // element outside of the datagrid, so in such case we should just let the event bubble
    if (event.keyCode === DvtDataGrid.TAB_KEY && (!this._isSelectionEnabled() || !this.isActionableMode()))
    {
        return;
    }

    // check if header is active
    if (this.m_active != null && this.m_active['type'] == 'header')
    {
        // fire key down event (internal.  Used only by row expander for now)
        this._fireKeyDownEvent(event);

        processed = this.handleHeaderKeyDown(event);
    }
    else
    {
        if (this._isSelectionEnabled() && this.m_selectionFrontier != null)
        {
            cell = this.getElementsInRange(this.createRange(this.m_selectionFrontier));
            if (cell == null)
            {
                return;
            }
        }

        // fire key down event (internal.  Used only by row expander for now)
        this._fireKeyDownEvent(event);

        processed = this._handleCutPasteKeydown(event);
        if (!processed)
        {
            if (this._isSelectionEnabled())
            {
                processed = this.handleSelectionKeyDown(event);
            }
            else
            {
                processed = this.handleActiveKeyDown(event);
            }
        }
    }
    if (processed === true)
    {
        event.preventDefault();
    }
};

/**
 * Handles when a key down is pressed on the databody or headers
 * @param {Event} event the DOM event
 * @private
 */
DvtDataGrid.prototype._fireKeyDownEvent = function(event)
{
    var cell, header, rowKey, details;

    cell = this.findCell(event.target);
    if (cell == null)
    {
        header = this.findHeader(event.target);
        if (header == null)
        {
            // should not happen
            return;
        }
        rowKey = this._getKey(header);
    }
    else
    {
        rowKey = this._getKey(cell['parentNode']);
    }

    // the event contains the context info
    details = {
        'event': event, 'ui': {
            'rowKey': rowKey
        }
    };

    this.fireEvent('keydown', details);
};

/**
 * Find top and left offset of an element relative to the (0,0) point on the page
 * @param {Element} element - the element to find left and top offset of
 * @return {Array.<number>} - [leftOffset, topOffset]
 */
DvtDataGrid.prototype.findPos = function(element)
{
    var parentPos, transform;
    if (element)
    {
        parentPos = this.findPos(element['offsetParent']);
        transform = this.getElementTranslationXYZ(element['offsetParent']);
        return [
            parseInt(parentPos[0], 10) + parseInt(element['offsetLeft'], 10) + transform[0],
            parseInt(parentPos[1], 10) + parseInt(element['offsetTop'], 10) + transform[1]
        ];
    }
    return [0, 0];
};

/**
 * Get an elements transform3d X,Y,Z
 * @param {Element} element - the element to find transform3d X,Y,Z of
 * @return {Array.<number>} - [transformX, transformY, transformZ]
 */
DvtDataGrid.prototype.getElementTranslationXYZ = function(element)
{
    var cs, transform, matrixArray, transformX, transformY, transformZ;
    if (element)
    {
        cs = document.defaultView.getComputedStyle(element, null);
        transform = cs.getPropertyValue("-webkit-transform") ||
                cs.getPropertyValue("-moz-transform") ||
                cs.getPropertyValue("-ms-transform") ||
                cs.getPropertyValue("-o-transform") ||
                cs.getPropertyValue("transform");
        matrixArray = transform.substr(7, transform.length - 8).split(', ');
        transformX = isNaN(parseInt(matrixArray[4], 10)) ? 0 : parseInt(matrixArray[4], 10);
        transformY = isNaN(parseInt(matrixArray[5], 10)) ? 0 : parseInt(matrixArray[5], 10);
        transformZ = isNaN(parseInt(matrixArray[6], 10)) ? 0 : parseInt(matrixArray[6], 10);
        return [transformX, transformY, transformZ];
    }
    return [0, 0, 0];
};



/**
 * Event handler for when mouse wheel is used on the databody
 * @param {Event} event - mousewheel event on the databody
 */
DvtDataGrid.prototype.handleDatabodyMouseWheel = function(event)
{
    var delta, deltaX, deltaY;
    // prevent scrolling of the page
    event.preventDefault();

    delta = this.m_utils.getMousewheelScrollDelta(event);

    deltaX = delta['deltaX'];
    deltaY = delta['deltaY'];

    this.scrollDelta(deltaX, deltaY);
};

/**************** touch related methods ********************/

/**
 * Event handler for when touch is started on the databody
 * @param {Event} event - touchstart event on the databody
 */
DvtDataGrid.prototype.handleTouchStart = function(event)
{
    var fingerCount, dir, selection, target;

    fingerCount = event.touches.length;
    // move = one finger swipe (or two?)
    if (fingerCount == 1)
    {
        // get the coordinates of the touch
        this.m_startX = event.touches[0].pageX;
        this.m_startY = event.touches[0].pageY;

        // need these to detect whether touch is hold and move vs. swipe
        this.m_currentX = this.m_startX;
        this.m_currentY = this.m_startY;
        this.m_prevX = this.m_startX;
        this.m_prevY = this.m_startY;
        this.m_startTime = (new Date()).getTime();

        // flag it
        this.m_touchActive = true;

        target = event.touches[0].target;
        //if multiple select enabled check to see if the touch start was on a select affordance
        if (this.isMultipleSelection())
        {
            //if the target is not the container, but rather the icon itself, choose the container instead
            if (target['className'] === this.getMappedStyle("selectaffordancetop") || target['className'] === this.getMappedStyle("selectaffordancebottom"))
            {
                target = target['parentNode'];
            }

            //determine which icon was clicked on
            dir = target === this.m_topSelectIconContainer ? 'top' : target === this.m_bottomSelectIconContainer ? 'bottom' : null;

            if (dir)
            {
                //keeps track of multiple select mode
                this.m_touchMultipleSelect = true;
                selection = this.GetSelection();
                if (dir === 'top')
                {
                    //anchor is bottom right of selection for selecting top affordance
                    this.m_touchSelectAnchor = selection[selection.length - 1]['endIndex'];
                }
                else
                {
                    //anchor is top left of selection for selecting bottom affordance
                    this.m_touchSelectAnchor = selection[selection.length - 1]['startIndex'];
                }
            }
        }

        //if not multiple select, check for row reorder
        if (!this.m_touchMultipleSelect && this._isMoveOnRowEnabled(this.find(event.touches[0].target, 'row')))
        {
            this.m_databodyMove = true;
        }
    }
    else
    {
        // more than one finger touched so cancel
        this.handleTouchCancel(event);
    }
};

/**
 * Event handler for when touch moves on the databody
 * @param {Event} event - touchmove event on the databody
 */
DvtDataGrid.prototype.handleTouchMove = function(event)
{
    var diffX, diffY;

    if (this.m_touchActive)
    {
        event.preventDefault();
        this.m_currentX = event.touches[0].pageX;
        this.m_currentY = event.touches[0].pageY;

        diffX = this.m_currentX - this.m_prevX;
        diffY = this.m_currentY - this.m_prevY;
        if (this.getResources().isRTLMode())
        {
            diffX = diffX * -1;
        }

        if (this.m_touchMultipleSelect)
        {
            this.handleDatabodySelectionDrag(event);
        }
        else if (this.m_databodyMove)
        {
            this._removeTouchSelectionAffordance();
            this._handleMove(event);
        }
        else
        {
            this._handleNonSwipeScroll(diffX, diffY);
        }

        this.m_prevX = this.m_currentX;
        this.m_prevY = this.m_currentY;
    }
    else
    {
        this.handleTouchCancel(event);
    }
};

/**
 * Event handler for when touch ends on the databody
 * @param {Event} event - touchend event on the databody
 */
DvtDataGrid.prototype.handleTouchEnd = function(event)
{
    var duration;

    if (this.m_touchActive && !event.defaultPrevented)
    {
        if (this.m_touchMultipleSelect)
        {
            event.preventDefault();
            this.m_touchMultipleSelect = false;
        }
        else
        {
            duration = (new Date()).getTime() - this.m_startTime;
            if (this.m_currentX == this.m_startX && this.m_currentY == this.m_startY)
            {
                // this means we performed a tap within the row with the active cell
                // and it wasn't actually a move, also only change selection on a tap
                // outside of the current selection, if it was longer than context menu the
                // handleContextMenuGesture will have changed this
                this.m_databodyMove = false;
                if (this._isSelectionEnabled() && duration < DvtDataGrid.CONTEXT_MENU_TAP_HOLD_DURATION)
                {
                    this.handleDatabodyClickSelection(event);
                    return;
                }
                else
                {
                    //activate on a tap
                    this.handleDatabodyClickActive(event);
                    return;
                }
            }

            if (this.m_databodyMove)
            {
                event.preventDefault();
                this.m_databodyMove = false;
                this._handleMoveMouseUp(event, true);
                return;
            }

            this._handleSwipe(event);
        }

    }

    this.handleTouchCancel(event);
};

/**
 * Calculate the momentum based on the distance and duration of the swipe
 * @param {number} current the current touch position
 * @param {number} start the start touch position
 * @param {number} time the duration of the swipe
 * @param {number} currentScroll the current scroll position
 * @param {number} maxScroll the maximum scroll position
 * @param {boolean} rtl true if right to left, false if left to right, undefined if determining momentum in Y direction
 * @return {Object} an object with three keys:
 *                      destination - the point to scroll to with the momentum
 *                      overScroll - the pixel amount that is scrolled beyond the scrollable region
 *                      duration - the duration of the scroll to that destination
 * @private
 */
DvtDataGrid.prototype._calculateMomentum = function(current, start, time, currentScroll, maxScroll, rtl)
{
    var distance, speed, destination, duration, overScroll;

    distance = current - start;
    speed = Math.abs(distance) / time;
    destination = (speed * speed) / (2 * DvtDataGrid.DECELERATION_FACTOR) * (distance < 0 ? -1 : 1);
    duration = speed / DvtDataGrid.DECELERATION_FACTOR;

    if (rtl)
    {
        destination = destination * -1;
    }

    // if the distance overshoots, then we'll have to adjust and recalculate the duration
    if (currentScroll - destination > maxScroll)
    {
        // too far bottom/right
        overScroll = Math.max(DvtDataGrid.MAX_OVERSCROLL_PIXEL * -1, destination);
        destination = currentScroll - maxScroll;
        distance = maxScroll - currentScroll;
        duration = distance / speed;
    }
    else if (currentScroll - destination < 0)
    {
        // too far top/left
        overScroll = Math.min(DvtDataGrid.MAX_OVERSCROLL_PIXEL, destination);
        destination = currentScroll;
        distance = currentScroll;
        duration = distance / speed;
    }

    return {
        destination: Math.round(destination),
        duration: Math.max(100, duration),
        overScroll: overScroll
    };
};

/**
 * Event handler for when touch is cancelled on the databody
 * @param {Event} event - touchcancel event on the databody
 */
DvtDataGrid.prototype.handleTouchCancel = function(event)
{
    if (this.m_databodyMove)
    {
        this._handleMoveMouseUp(event, false);
        this.m_databodyMove = false;
    }
    this.m_touchSelectAnchor = null;
    this.m_touchMultipleSelect = false;
    // reset the variables back to default values
    this.m_touchActive = false;
    this.m_startX = 0;
    this.m_startY = 0;
    this.m_prevX = 0;
    this.m_prevY = 0;
    this.m_currentX = 0;
    this.m_currentY = 0;
    this.m_startTime = 0;
};

/**
 * Event handler for when touch is started on the header
 * @param {Event} event - touchstart event on the header
 */
DvtDataGrid.prototype.handleHeaderTouchStart = function(event)
{
    var header, fingerCount;

    //store start time of touch
    this.m_touchStart = (new Date()).getTime();

    fingerCount = event.touches.length;
    // move = one finger swipe (or two?)
    if (fingerCount == 1)
    {
        // get the coordinates of the touch
        this.m_startX = event.touches[0].pageX;
        this.m_startY = event.touches[0].pageY;

        // need these to detect whether touch is hold and move vs. swipe
        this.m_currentX = this.m_startX;
        this.m_currentY = this.m_startY;
        this.m_prevX = this.m_startX;
        this.m_prevY = this.m_startY;

        // flag it
        this.m_touchActive = true;
        header = this.findHeader(event.target);

        //after 300ms set the header active color as feedback if finger still down and not resizing
        //Jim suggested the change to a shorter value and it looks much cleaner and easier to use
        //No longer remove after 1000ms because we are setting active if context menu is brought up
        //Don't change the active on an in header scroll either
        setTimeout(function() {
            if (this.m_touchActive && !this.m_isResizing &&
                    this.m_currentX == this.m_startX && this.m_currentY == this.m_startY)
            {
                this._removeTouchSelectionAffordance();
                //tap and hold sets header active
                this._setActive(header, event, true);
            }
        }.bind(this), DvtDataGrid.HEADER_TAP_SHORT_HOLD_DURATION);

        if (this.isResizeEnabled())
        {
            this.handleResize(event);
            this.handleResizeMouseDown(event);
        }

        //allow row reorder on headers if our move is enabled make sure our row has the active cell in it
        if (!this.m_isResizing && this._isMoveOnRowEnabled(this.findRow(event.target)))
        {
            this.m_databodyMove = true;
        }
    }
    else
    {
        // more than one finger touched so cancel
        this.handleHeaderTouchCancel(event);
    }
};


/**
 * Event handler for when touch moves on the header
 * @param {Event} event - touchmove event on the header
 */
DvtDataGrid.prototype.handleHeaderTouchMove = function(event)
{
    var diffX, diffY, header;

    if (this.m_touchActive)
    {
        event.preventDefault();

        this.m_currentX = event.touches[0].pageX;
        this.m_currentY = event.touches[0].pageY;

        diffX = this.m_currentX - this.m_prevX;
        diffY = this.m_currentY - this.m_prevY;

        if (this.m_isResizing && this.isResizeEnabled())
        {
            this.handleResize(event);
        }
        else if (this.m_databodyMove)
        {
            this._removeTouchSelectionAffordance();
            this._handleMove(event);
        }
        else
        {
            // can't swipe column headers in Y and row headers in X
            header = this.findHeader(event.target);
            if (this.getHeaderCellAxis(header) == 'column')
            {
                this._handleNonSwipeScroll(diffX, 0);
            }
            else
            {
                this._handleNonSwipeScroll(0, diffY);
            }
        }

        this.m_prevX = this.m_currentX;
        this.m_prevY = this.m_currentY;
    }
    else
    {
        this.handleTouchCancel(event);
    }
};

/**
 * Event handler for when touch ends on the header
 * @param {Event} event - touchend event on the header
 */
DvtDataGrid.prototype.handleHeaderTouchEnd = function(event)
{
    var touchEnd, touchLength, tapMax = DvtDataGrid.HEADER_TAP_SHORT_HOLD_DURATION, header;

    //calculate the end of touch time for tap and hold
    touchEnd = (new Date()).getTime();
    touchLength = touchEnd - this.m_touchStart;

    if (this.m_touchActive && !event.defaultPrevented)
    {
        // if resizing handle resize first so that we don't conflict and forget to end
        if (this.m_isResizing && this.isResizeEnabled())
        {
            this.handleResizeMouseUp(event);
            if (this.m_currentX != this.m_startX && this.m_currentY != this.m_startY)
            {
                event.preventDefault();
            }
        }
        // if a short tap sort
        else if (this.m_currentX == this.m_startX && this.m_currentY == this.m_startY && touchLength < tapMax)
        {
            if (this._isDOMElementSortable(event.target))
            {
                event.preventDefault();
                this._handleHeaderSort(event);
                this._removeTouchSelectionAffordance();
            }
        }
        // if reordering a row
        else if (this.m_databodyMove)
        {
            event.preventDefault();
            this.m_databodyMove = false;
            this._handleMoveMouseUp(event, true);
        }
        //handle potential swipe
        else
        {
            header = this.findHeader(event.target);
            this._handleSwipe(event, this.getHeaderCellAxis(header));
        }
        //tap and long hold shows context menu, through the wrapper layer
    }
    this.handleHeaderTouchCancel(event);
};

/**
 * Event handler for when touch is cancelled on the header
 * @param {Event} event - touchcancel event on the header
 */
DvtDataGrid.prototype.handleHeaderTouchCancel = function(event)
{
    if (this.m_databodyMove)
    {
        this._handleMoveMouseUp(event, false);
        this.m_databodyMove = false;
    }
    // reset the variables back to default values
    this.m_touchActive = false;
    this.m_startX = 0;
    this.m_startY = 0;
    this.m_prevX = 0;
    this.m_prevY = 0;
    this.m_currentX = 0;
    this.m_currentY = 0;
};

/**
 * Handle a touch scroll that is a slow drag
 * @param {type} event
 */
DvtDataGrid.prototype._handleNonSwipeScroll = function(diffX, diffY)
{
    var time = (new Date()).getTime();
    // for non-swipe scroll use 0ms to prevent jiggling
    this._disableTouchScrollAnimation();

    this.scrollDelta(diffX, diffY);

    // reset start position if this is a tap and scroll, so that we can handle
    // user doing a swipe at the end
    if (time - this.m_startTime > DvtDataGrid.TAP_AND_SCROLL_RESET)
    {
        this.m_startX = this.m_currentX;
        this.m_startY = this.m_currentY;
        this.m_startTime = (new Date()).getTime();
    }
};

/**
 * Event handler for when touch swipe may have been detected
 * @param {Event} event - touchcancel event on the header
 * @param {string=} axis - if a header the header axis so we don't swipe in the direction
 */
DvtDataGrid.prototype._handleSwipe = function(event, axis)
{
    var duration, rtl, diffX, diffY, momentumX, momentumY, transitionDuration;
    duration = (new Date()).getTime() - this.m_startTime;
    rtl = this.getResources().isRTLMode();
    diffX = this.m_currentX - this.m_startX;
    diffY = this.m_currentY - this.m_startY;
    // if right to left the difference is the opposite on swipe
    if (rtl)
    {
        diffX = diffX * -1;
    }
    // detect whether this is a swipe
    if (Math.abs(diffX) < DvtDataGrid.MIN_SWIPE_DISTANCE && Math.abs(diffY) < DvtDataGrid.MIN_SWIPE_DISTANCE && duration < DvtDataGrid.MIN_SWIPE_DURATION)
    {
        event.preventDefault();
        //center touch affordances if row selection multiple
        if (this._isSelectionEnabled())
        {
            this._scrollTouchSelectionAffordance();
        }
    }
    // swipe case
    else if (duration < DvtDataGrid.MAX_SWIPE_DURATION)
    {
        event.preventDefault();
        if (axis != 'row')
        {
            // calculate momentum
            momentumX = this._calculateMomentum(this.m_currentX, this.m_startX, duration, this.m_currentScrollLeft, this.m_scrollWidth, rtl);
            if (!isNaN(momentumX.overScroll))
            {
                // don't overscroll if there's more rows to fetch
                if (momentumX.overScroll > 0 || this.m_stopColumnFetch)
                {
                    this.m_extraScrollOverX = momentumX.overScroll * -1;
                }
            }
        }
        else
        {
            momentumX = {duration: 0, destination: 0};
            diffX = 0;
        }

        if (axis != 'column')
        {
            momentumY = this._calculateMomentum(this.m_currentY, this.m_startY, duration, this.m_currentScrollTop, this.m_scrollHeight);
            if (!isNaN(momentumY.overScroll))
            {
                // don't overscroll if there's more rows to fetch
                if (momentumY.overScroll > 0 || this.m_stopRowFetch)
                {
                    this.m_extraScrollOverY = momentumY.overScroll * -1;
                }
            }
        }
        else
        {
            momentumY = {duration: 0, destination: 0};
            diffY = 0;
        }

        transitionDuration = Math.max(momentumX.duration, momentumY.duration);
        this.m_databody['firstChild'].style.webkitTransitionDuration = transitionDuration + 'ms';
        this.m_rowHeader['firstChild'].style.webkitTransitionDuration = transitionDuration + 'ms';
        this.m_colHeader['firstChild'].style.webkitTransitionDuration = transitionDuration + 'ms';
        this.scrollDelta(diffX + momentumX.destination, diffY + momentumY.destination);
    }
};

/************* end touch related methods ********************/

/**
 * Callback on a widget listener
 * @param {string} functionName - the function name to look up in the callbacks
 * @param {Object} details - the object to pass into the callback function
 * @return {boolean} true if event passes, false if vetoed
 */
DvtDataGrid.prototype.fireEvent = function(functionName, details)
{
    var callback;
    if (functionName == null || details == null)
    {
        return;
    }

    callback = this.callbacks[functionName];
    if (callback != null)
    {
        return callback(details);
    }
    return true;
};

/**
 * Add a callback function to the callbacks object
 * @param {string} functionName - the function name to callback on
 * @param {Object.<Function>} handler - the function to callback to
 * @export
 */
DvtDataGrid.prototype.addListener = function(functionName, handler)
{
    this.callbacks[functionName] = handler;
};
/*********************************** end dom event handling ***************************************/

/**
 * Set the style height on an element in pixels
 * @param {HTMLElement} elem - the element to set height on
 * @param {number} height - the pixel height to set the element to
 */
DvtDataGrid.prototype.setElementHeight = function(elem, height)
{
    elem['style']['height'] = height + "px";
};

/**
 * Get a number of the style height of an element
 * @param {HTMLElement} elem - the element to get height on
 * @return {number} the style height of the element
 */
DvtDataGrid.prototype.getElementHeight = function(elem)
{
    var height;
    if (elem['style']['height'].indexOf('px') > -1)
    {
        return parseInt(elem['style']['height'], 10);
    }
    else
    {
        if (!document.body.contains(elem))
        {
            elem['style']['visibility'] = "hidden";
            document.body.appendChild(elem); //@HTMLUpdateOK
            // Not using offsetHeight due to 
            height = Math.floor(elem.getBoundingClientRect()['height']);
            document.body.removeChild(elem);
            elem['style']['visibility'] = "";
        }
        else
        {
            height = Math.floor(elem.getBoundingClientRect()['height']);
        }
        return height;
    }
};

/**
 * Set the style width on an element in pixels
 * @param {HTMLElement} elem - the element to set width on
 * @param {number} width - the pixel width to set the element to
 */
DvtDataGrid.prototype.setElementWidth = function(elem, width)
{
    elem['style']['width'] = width + "px";
};

/**
 * Get a number of the style pixel width of an element
 * @param {HTMLElement} elem - the element to get width on
 * @return {number} the style width of the element
 */
DvtDataGrid.prototype.getElementWidth = function(elem)
{
    var width;
    if (elem['style']['width'].indexOf('px') > -1)
    {
        return parseInt(elem['style']['width'], 10);
    }
    else
    {
        if (!document.body.contains(elem))
        {
            elem['style']['visibility'] = "hidden";
            document.body.appendChild(elem); //@HTMLUpdateOK
            // Not using offsetWidth due to 
            width = Math.floor(elem.getBoundingClientRect()['width']);
            document.body.removeChild(elem);
            elem['style']['visibility'] = "";
        }
        else
        {
            width = Math.floor(elem.getBoundingClientRect()['width']);
        }
        return width;
    }
};

/**
 * Set the style left/right/top/bottom on an element in pixels
 * @param {HTMLElement} elem - the element to set width on
 * @param {number} pix - the pixel width to set the element to
 * @param {string} dir - 'left','right','top,'bottom'
 * */
DvtDataGrid.prototype.setElementDir = function(elem, pix, dir)
{
    elem['style'][dir] = pix + "px";
};

/**
 * Get a number of the style left/right/top/bottom of an element
 * @param {HTMLElement} elem - the element to get style left/right/top/bottom on
 * @param {string} dir - 'left','right','top,'bottom'
 * @return {number} the style left/right/top/bottom of the element
 */
DvtDataGrid.prototype.getElementDir = function(elem, dir)
{
    return parseInt(elem['style'][dir], 10);
};

/************************* Model change event *****************************************/
/**
 * @private
 */
DvtDataGrid.BEFORE = 1;

/**
 * @private
 */
DvtDataGrid.AFTER = 2;

/**
 * @private
 */
DvtDataGrid.INSIDE = 3;

/**
 * Checks whether an index (row/column) is within the range of the current viewport.
 * @param {Object} indexes the row and column indexes
 * @return {number} BEFORE if the index is before the current viewport, AFTER if the index is after
 *         the current viewport, INSIDE if the index is within the current viewport
 * @private
 */
DvtDataGrid.prototype._isInViewport = function(indexes)
{
    var rowIndex, columnIndex;

    rowIndex = indexes['row'];
    columnIndex = indexes['column'];

    if (rowIndex === -1 && columnIndex === -1)
    {
        // actually, this is an invalid index... should throw an error?
        return -1;
    }

    // if row index wasn't specified, just verify the column range
    if (rowIndex === -1)
    {
        if (columnIndex < this.m_startCol)
        {
            return DvtDataGrid.BEFORE;
        }

        if (columnIndex > this.m_endCol)
        {
            return DvtDataGrid.AFTER;
        }

        // if it's not before or after, it must be inside
        return DvtDataGrid.INSIDE;
    }

    // if column index wasn't specified, just verify the row range
    if (columnIndex === -1)
    {
        if (rowIndex < this.m_startRow)
        {
            return DvtDataGrid.BEFORE;
        }

        if (rowIndex > this.m_endRow)
        {
            return DvtDataGrid.AFTER;
        }

        // if it's not before or after, it must be inside
        return DvtDataGrid.INSIDE;
    }

    // both row and column index are defined, then check both ranges
    if (columnIndex >= this.m_startCol && columnIndex <= this.m_endCol && rowIndex >= this.m_startRow && rowIndex <= this.m_endRow)
    {
        return DvtDataGrid.INSIDE;
    }

    // undefined
    return -1;
};

/**
 * Model event handler
 * @param {Object} event the model change event
 * @protected
 */
DvtDataGrid.prototype.handleModelEvent = function(event)
{
    var operation, keys, cellSet, headerSet, indexes, source, indices, silent;

    // in case if the model event arrives before the grid is fully rendered,
    // queue the event and handle it later
    if (!this.m_initialized)
    {
        if (this.m_modelEvents == undefined)
        {
            this.m_modelEvents = [];
        }
        this.m_modelEvents.push(event);
        return;
    }

    operation = event['operation'];
    keys = event['keys'];
    if (event['header'])
    {
        headerSet = event['header'];
    }
    indices = event['indices'];
    source = event['source'];
    indexes = event['indexes'];
    silent = event['silent'];

    if (operation === 'insert')
    {
        cellSet = event['result'];
        this._adjustActive(operation, indexes);
        this._adjustSelectionOnModelChange(operation, keys, indexes);

        if (cellSet != null)
        {
            // range insert event with cellset returned
            // if we use FlattenedTreeDataGridDataSource (ojRowExpander) - allow expand animation
            if (source && source instanceof oj.FlattenedTreeDataGridDataSource)
            {
                this._handleModelInsertRangeEvent(cellSet, headerSet);
            }
            else
            {
                this._handleModelInsertRangeEvent(cellSet);
            }
        }
        else
        {
            this._handleModelInsertEvent(indexes, keys);
        }
    }
    else if (operation === 'update')
    {
        this._handleModelUpdateEvent(indexes, keys);
    }
    else if (operation === 'delete')
    {
        // adjust selection if neccessary
        // do this before the rows in the databody is mutate
        // (easier this way because of animation delays, plus the selection is immediately updated
        // to reflect the updated state)
        this._adjustActive(operation, indexes);
        this._adjustSelectionOnModelChange(operation, keys, indexes);

        if (source && source instanceof oj.FlattenedTreeDataGridDataSource && this.m_utils.supportsTransitions())
        {
            this._handleModelDeleteEventWithAnimation(keys);
        }
        //delete rows with animation
        else if (indices && this.m_utils.supportsTransitions())
        {
            this._handleModelDeleteEventWithAnimation(keys, indices);
        }
        else
        {
            this._handleModelDeleteEvent(indexes, keys, silent);
        }
    }
    else if (operation === 'refresh' || operation === 'reset')
    {
        this._handleModelRefreshEvent();
    }
    else if (operation === 'sync')
    {
        this._handleModelSyncEvent(event);
    }
};

/**
 * Adjust selection ranges if neccessary on insert or delete.
 * @param {String} operation the model event operation which triggers selection adjustment.
 * @param {Object} indexes the indexes that identify the rows that got inserted/deleted.
 * @private
 */
DvtDataGrid.prototype._adjustActive = function(operation, indexes)
{
    var activeRowIndex, i, rowIndex, activeHeader, adjustment = 0;

    if (this.m_active != null)
    {
        if(this.m_active['type'] == 'cell')
        {
            activeHeader = false;
            activeRowIndex = this.m_active['indexes']['row'];
        }
        else if (this.m_active['axis'] === 'row')
        {
            activeHeader = true;
            activeRowIndex = this.m_active['index'];
        }
        else
        {
            return;
        }
    }
    else
    {
        return;
    }

    if (!Array.isArray(indexes))
    {
        indexes = new Array(indexes);
    }

    //if we are getting this from a move event
    if (this.m_moveActive === true)
    {
        if (operation === 'insert')
        {
            if (!activeHeader)
            {
                this.m_active['indexes']['row'] = indexes[0]['row'];
            }
            else
            {
                this.m_active['index'] = indexes[0]['row'];
            }
            return;
        }
        else if (operation === 'delete' && indexes[0]['row'] === activeRowIndex)
        {
            // do not clear the active since we know the active should be the
            // same once the moved row is returned via insert
            return;
        }
    }

    adjustment = operation === 'insert' ? 1 : -1;

    for (i = 0; i < indexes.length; i++)
    {
        rowIndex = indexes[i]['row'];
        if (rowIndex < activeRowIndex)
        {
            if (!activeHeader)
            {
                this.m_active['indexes']['row'] += adjustment;
            }
            else
            {
                this.m_active['index'] += adjustment;
            }
        }
        else if (rowIndex === activeRowIndex && operation === 'delete')
        {
            this._setActive(null);
        }
    }
};

/**
 * Adjust selection ranges if neccessary on insert or delete.
 * @param {String} operation the model event operation which triggers selection adjustment.
 * @param {Object} keys the keys that identify the rows that got inserted/deleted.
 * @param {Object} indexes the indexes that identify the rows that got inserted/deleted.
 * @private
 */
DvtDataGrid.prototype._adjustSelectionOnModelChange = function(operation, keys, indexes)
{
    var selection, i, rowKey, rowIndex, j, range, startRowKey, endRowKey, startRowIndex, endRowIndex, newRowKey, adjustment, movedRow;

    // make it an array if it's a single entry event
    if (!Array.isArray(keys))
    {
        keys = new Array(keys);
    }

    if (!Array.isArray(indexes))
    {
        indexes = new Array(indexes);
    }

    selection = this.GetSelection();

    if (keys == null || indexes == null || keys.length != indexes.length || selection.length == 0)
    {
        // on a move reset the selection
        if (this.m_moveActive && operation == 'insert')
        {
            if (this._isSelectionEnabled() && this._isDatabodyCellActive())
            {
                if (this.m_options.getSelectionMode() == 'cell')
                {
                    movedRow = this.createRange(this.m_active['indexes'], this.m_active['indexes'], keys[0], keys[0]);
                }
                else
                {
                    movedRow = this.createRange(indexes[0], indexes[0], keys[0], keys[0]);
                }
                this.m_selectionFrontier = this.m_active['indexes'];
                selection.push(movedRow);
            }
            this.m_moveActive = false;
        }
        // we are done
        return;
    }

    adjustment = operation === 'insert' ? 1 : -1;

    for (i = 0; i < keys.length; i++)
    {
        rowKey = keys[i]['row'];
        rowIndex = indexes[i]['row'];

        // have to do this backwards since we'll be mutating the array at the same time
        j = selection.length;
        while (j--)
        {
            range = selection[j];
            startRowKey = range['startKey']['row'];
            endRowKey = range['endKey']['row'];
            startRowIndex = range['startIndex']['row'];
            endRowIndex = range['endIndex']['row'];

            if (startRowKey == rowKey)
            {
                if (endRowKey == rowKey)
                {
                    // single row in range, and it has been deleted, so remove from selection
                    if (operation == 'delete')
                    {
                        selection.splice(j, 1);
                        continue;
                    }
                }

                // adjust start key, index stays the same
                // adjust end index, end key stays the same
                // get the key of the next row, which will become the new start key
                newRowKey = this._getKey(this.m_databody['firstChild']['childNodes'][range['startIndex']['row'] + 1 - this.m_startRow]);
                range['startKey']['row'] = newRowKey;
                range['endIndex']['row'] += adjustment;
            }
            else if (endRowKey == rowKey)
            {
                // adjust end key and end index
                // get the key of the next row, which will become the new start key
                newRowKey = this._getKey(this.m_databody['firstChild']['childNodes'][range['endIndex']['row'] - 1 - this.m_startRow]);
                range['endKey']['row'] = newRowKey;
                range['endIndex']['row'] += adjustment;
            }
            else if (rowIndex < startRowIndex)
            {
                // before start index, so adjust both start and end index
                range['startIndex']['row'] += adjustment;
                range['endIndex']['row'] += adjustment;
            }
            else if (rowIndex < endRowIndex)
            {
                // something in between start and end selection, adjust the end index
                range['endIndex']['row'] += adjustment;
            }
        }
    }
};

/**
 * Handles model insert event
 * @param {Object} indexes the indexes that identifies the row that got updated.
 * @param {Object} keys the key that identifies the row that got updated.
 * @private
 */
DvtDataGrid.prototype._handleModelInsertEvent = function(indexes, keys)
{
    var flag, row, rowHeader;
    // checks if the new row/column is in the viewport
    flag = this._isInViewport(indexes);
    //If the model inserted is just the next model fetch it
    if (flag === DvtDataGrid.INSIDE || (flag === DvtDataGrid.AFTER && indexes['row'] == (this.m_endRow + 1)))
    {
        // an insert can only be a insert new row or new column.  A cell insert is
        // automatically treated as row insert, keys['row'/'column'] can be the number 0
        if (keys['row'] != null)
        {
            //if we have added to an empty grid just refresh, so we can fetch all headers
            if (this._databodyEmpty())
            {
                this.empty();
                this.refresh(this.m_root);
            }
            else
            {
                this.fetchHeaders("row", indexes['row'], this.m_rowHeader, 1, {"success": this._handleHeaderInsertsFetchSuccess});
                this.fetchCells(this.m_databody, this.m_scroller, indexes['row'], this.m_startCol, 1, this.m_endCol - this.m_startCol + 1, {"success": this._handleCellInsertsFetchSuccess});
            }
        }
        else if (keys['column'] != null)
        {
            // todo: handle column insert
        }
    }
    else
    {
        if (flag === DvtDataGrid.BEFORE)
        {
            this.m_startRow++;
            this.m_startRowHeader++;
            this.m_endRow++;
            this.m_endRowHeader++;
            this.m_startRowPixel += this.m_avgRowHeight;
            this.m_startRowHeaderPixel += this.m_avgRowHeight;
            this.m_endRowPixel += this.m_avgRowHeight;
            this.m_endRowHeaderPixel += this.m_avgRowHeight;
            row = this.m_databody['firstChild']['firstChild'];
            if (row != null)
            {
                this.pushRowsDown(row, this.m_avgRowHeight);
            }
            rowHeader = this.m_rowHeader['firstChild']['firstChild'];
            if (rowHeader != null)
            {
                this.pushRowsDown(rowHeader, this.m_avgRowHeight);
            }
        }

        this.scrollToIndex(indexes);
    }
};

/**
 * Handle a successful call to the data source fetchCells. Update the row and
 * cell DOM elements when necessary.
 * @param {Object} cellSet - a CellSet object which encapsulates the result set of cells
 * @param {Array.<Object>} cellRanges - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 */
DvtDataGrid.prototype._handleCellInsertsFetchSuccess = function(cellSet, cellRanges)
{
    var rowStart;

    // so that grid will be resize
    this.m_initialized = false;

    // insert the row
    this.handleCellsFetchSuccess(cellSet, cellRanges, this.m_endRow >= cellRanges[0]['start']);

    // make sure the new row is in range
    rowStart = cellRanges[0]['start'];
    this._scrollRowIntoViewport(rowStart);

    // clean up rows outside of viewport (for non-highwatermark scrolling only)
    if (!this._isHighWatermarkScrolling())
    {
        this._cleanupViewport();
    }
    this.updateRowBanding();
    this.m_stopRowFetch = false;
    if (this.m_endRowHeader != -1)
    {
        this.m_stopRowHeaderFetch = false;
    }

    // Need to fill viewport in the case of a silent delete of multiple records with an insert following.
    // i.e. a splice of the data which removes 2 models silently and adds 1 back in, need to add the last model to fill view
    this.fillViewport(this.m_currentScrollLeft, this.m_currentScrollTop);
};

/**
 * Handle a successful call to the data source fetchHeaderss. Update the row header DOM elements when necessary.
 * @param {Object} headerSet - a HeaderSet object which encapsulates the result set of cells
 * @param {Array.<Object>} headerRanges - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 */
DvtDataGrid.prototype._handleHeaderInsertsFetchSuccess = function(headerSet, headerRanges)
{
    // so that grid will be resize
    this.m_resizeRequired = true;
    // insert the row
    this.handleHeadersFetchSuccess(headerSet, headerRanges, this.m_endRowHeader >= headerRanges['start']);
};

/**
 * Scrolls the row with index into the viewport
 * @param {number} index the row index
 * @private
 */
DvtDataGrid.prototype._scrollRowIntoViewport = function(index)
{
    var absIndex, databodyContent, row, viewportTop, viewportBottom, rowTop, diff;

    absIndex = index - this.m_startRow;
    databodyContent = this.m_databody['firstChild'];
    row = databodyContent['childNodes'][absIndex];
    if (row == null)
    {
        // something is wrong the newly inserted row does not exists
        return;
    }

    viewportTop = this.m_currentScrollTop;
    viewportBottom = this.m_currentScrollTop + this.getElementHeight(this.m_databody);

    rowTop = row.offsetTop;
    diff = viewportTop - rowTop;
    if (diff > 0)
    {
        // row added to top, scroll up
        this.scrollDelta(0, diff);
    }
    else
    {
        diff = viewportBottom - rowTop;
        if (diff < 0)
        {
            // row added to bottom, scroll down
            this.scrollDelta(0, diff);
        }
    }
};

/**
 * Remove any rows that are outside of the viewport.
 * @private
 */
DvtDataGrid.prototype._cleanupViewport = function()
{
    var viewportTop, viewportBottom;

    viewportTop = this.m_currentScrollTop;
    viewportBottom = this.m_currentScrollTop + this.getElementHeight(this.m_databody);

    if (viewportTop > this.m_startRowPixel)
    {
        // clean up top rows
        if ((this.m_endRow - this.m_startRow) > this.MAX_ROW_THRESHOLD)
        {
            this.removeRowsFromTop(this.m_databody);
        }
    }
    else if (viewportBottom < this.m_endRowPixel)
    {
        // clean up bottom rows
        if ((this.m_endRow - this.m_startRow) > this.MAX_ROW_THRESHOLD)
        {
            this.removeRowsFromBottom(this.m_databody);
        }
    }

    if (viewportTop > this.m_startRowHeaderPixel)
    {
        // clean up top rows
        if ((this.m_endRowHeader - this.m_startRowHeader) > this.MAX_ROW_THRESHOLD)
        {
            this.removeRowHeadersFromTop(this.m_rowHeader);
        }
    }
    else if (viewportBottom < this.m_endRowPixel)
    {
        // clean up bottom rows
        if ((this.m_endRowHeader - this.m_startRowHeader) > this.MAX_ROW_THRESHOLD)
        {
            this.removeRowHeadersFromBottom(this.m_rowHeader);
        }
    }
};

/**
 * Handles model range insert event
 * @param {Object} cellSet the range of cells inserted.
 * @param {Object} headerSet the row headers.
 * @param {Object} obj
 * @private
 */
DvtDataGrid.prototype._handleModelInsertRangeEvent = function(cellSet, headerSet)
{
    var rowStart, rowCount, columnStart, columnCount, rowHeaderFragment, rowFragment,
            headerCount, c, index, totalRowHeight, returnVal, className, renderer, rowRange,
            columnRange, headerRange;

    // reconstruct the cell ranges from result
    rowStart = cellSet.getStart("row");
    rowCount = cellSet.getCount("row");
    columnStart = cellSet.getStart("column");
    columnCount = cellSet.getCount("column");

    // if it should animate
    if (this.m_utils.supportsTransitions())
    {
        //create  a fragment with all of the row headers
        if (headerSet != null)
        {
            rowHeaderFragment = document.createDocumentFragment();
            headerCount = headerSet.getCount();
            // add the headers to the row header
            totalRowHeight = 0;
            c = 0;
            className = this.getMappedStyle("row") + " " + this.getMappedStyle("headercell") + " " + this.getMappedStyle("rowheadercell");
            renderer = this.m_options.getRenderer("row");
            while (headerCount - c > 0)
            {
                index = rowStart + c;
                returnVal = this.buildLevelHeaders(rowHeaderFragment, index, 0, 0, this.m_startRowPixel + totalRowHeight, true, false, renderer, headerSet, 'row', className, this.m_rowHeaderLevelCount);
                c += returnVal['count'];
                totalRowHeight += returnVal['totalHeight'];
            }
        }

        rowFragment = document.createDocumentFragment();
        returnVal = this._addRows(rowFragment, true, this.m_startRowPixel, rowStart, rowCount, columnStart, false, cellSet);

        this._insertRowsWithAnimation(rowFragment, rowHeaderFragment, rowStart, returnVal['totalRowHeight']);
    }
    else
    {
        rowRange = {"axis": "row", "start": rowStart, "count": rowCount};
        columnRange = {"axis": "column", "start": columnStart, "count": columnCount};
        if (headerSet != null)
        {
            headerRange = {'axis': 'row', 'header': this.m_rowHeader, 'start': rowStart, 'count': headerSet.getCount()};
            this.m_fetching['row'] = headerRange;
            this._handleHeaderInsertsFetchSuccess(headerSet, headerRange);
        }
        // insert the rows
        this._handleCellInsertsFetchSuccess(cellSet, [rowRange, columnRange]);
    }
};

/**
 * Handles model update event
 * @param {Object} indexes the indexes that identifies the row that got updated.
 * @param {Object} keys the key that identifies the row that got updated.
 * @private
 */
DvtDataGrid.prototype._handleModelUpdateEvent = function(indexes, keys)
{
    var flag;

    // if the new row/column is in the viewport
    flag = this._isInViewport(indexes);
    if (flag === DvtDataGrid.INSIDE)
    {
        //if there is a row header update it
        if (this.m_endRowHeader != -1)
        {
            // fetch the updated row header and row
            this.fetchHeaders("row", indexes['row'], this.m_rowHeader, 1, {
                "success": this._handleHeaderUpdatesFetchSuccess,
                "error": this.handleHeadersFetchError
            });
        }

        this.fetchCells(this.m_databody, this.m_scroller, indexes['row'], this.m_startCol, 1, this.m_endCol - this.m_startCol + 1, {
            "success": this._handleCellUpdatesFetchSuccess,
            "error": this.handleCellsFetchError
        });
    }

    // if it's not in range then do nothing
};

/**
 * Handle a successful call to the data source fetchHeaderss. Update the row header DOM elements when necessary.
 * @param {Object} headerSet - a HeaderSet object which encapsulates the result set of cells
 * @param {Array.<Object>} headerRange - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 * @private
 */
DvtDataGrid.prototype._handleHeaderUpdatesFetchSuccess = function(headerSet, headerRange)
{
    var axis, rowStart, rowHeaderContent, rowIndex, row, fragment;

    axis = headerRange["axis"];
    this.m_fetching[axis] = false;

    rowStart = headerRange["start"];
    rowHeaderContent = this.m_rowHeader['firstChild'];

    // gets the relative index to the dom
    rowIndex = rowStart - this.m_startRowHeader;
    row = rowHeaderContent.childNodes[rowIndex];

    fragment = this.buildRowHeaders(this.m_rowHeader, headerSet, rowIndex, 1, true, true);
    rowHeaderContent.replaceChild(fragment, row);
    if (this.m_active != null && this.m_active['type'] === 'header' && this.m_active['axis'] === 'row' && this._getKey(row) === this.m_active['key'])
    {
        this._highlightActive();
    }
    // end fetch
    this._signalTaskEnd();
    // should animate the fragment in the future like updateCells
};

/**
 * Handle a successful call to the data source fetchCells. Update the row and
 * cell DOM elements when necessary.
 * @param {Object} cellSet - a CellSet object which encapsulates the result set of cells
 * @param {Array.<Object>} cellRange - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 * @private
 */
DvtDataGrid.prototype._handleCellUpdatesFetchSuccess = function(cellSet, cellRange)
{
    var rowStart, databodyContent, renderer, columnBandingInterval, rowBandingInterval, rowIndex, row;

    //fetch complete
    this.m_fetching['cells'] = false;

    rowStart = cellRange[0]['start'];
    databodyContent = this.m_databody['firstChild'];

    renderer = this.m_options.getRenderer("cell");
    columnBandingInterval = this.m_options.getColumnBandingInterval();
    rowBandingInterval = this.m_options.getRowBandingInterval();

    // gets the relative index to the dom
    rowIndex = rowStart - this.m_startRow;
    row = databodyContent.childNodes[rowIndex];

    // update the cells in the row
    this._updateCellsInRow(cellSet, row, rowIndex, renderer, this.m_startCol, columnBandingInterval);

    // end fetch
    this._signalTaskEnd();
};

/**
 * Retrieves the type of update animation to use.
 * @return {number} the type of update animation.  See constants.
 * @private
 */
DvtDataGrid.prototype._getUpdateAnimation = function()
{
    return DvtDataGrid.UPDATE_ANIMATION_SLIDE_INOUT;
};

/**
 * Retrieves the update animation duration.
 * @return {number} the animation duration.
 * @private
 */
DvtDataGrid.prototype._getUpdateAnimationDuration = function()
{
    return DvtDataGrid.UPDATE_ANIMATION_DURATION;
};

/**
 * Adds cells to a row. Iterate over the cells passed in, create new div elements
 * for them settign appropriate styles, and append or prepend them to the row based on the start column.
 * @param {Object} cellSet - the result set of cell data
 * @param {Element} row - the row element to update cells
 * @param {number} rowIndex - the index of the row element
 * @param {function(Object)} renderer - the cell renderer
 * @param {number} columnStart - the index to start start adding at
 * @param {number} columnBandingInterval - the column banding interval
 * @private
 */
DvtDataGrid.prototype._updateCellsInRow = function(cellSet, row, rowIndex, renderer, columnStart, columnBandingInterval)
{
    var animationDuration, self, width;

    animationDuration = this._getUpdateAnimationDuration();

    // check whether animation should be used
    if (animationDuration === 0 || !this.m_utils.supportsTransitions())
    {
        // clear the content of the row first
        this.m_utils.empty(row);

        // calls addCellsToRow
        this.addCellsToRow(cellSet, row, rowIndex, renderer, true, columnStart, false, columnBandingInterval);

        // re-apply selection and active cell since content changed
        if (this._isSelectionEnabled())
        {
            this.applySelection();
        }
        this._highlightActive();
    }
    else
    {
        self = this;
        // animation start
        self._signalTaskStart();
        row.addEventListener('transitionend', function()
        {
            row['style']['left'] = '';
            self.removeTransformMoveStyle(row);
            row.removeEventListener('transitionend', arguments.callee, false);
            // re-apply selection and active cell since content changed
            if (self._isSelectionEnabled())
            {
                self.applySelection();
            }
            self._highlightActive();

            // end animation
            self._signalTaskEnd();
        });

        //hide the row
        width = this.getElementWidth(this.m_databody);
        this.setElementDir(row, width, 'left');

        // clear the content of the row and refill it with new data
        this.m_utils.empty(row);
        this.addCellsToRow(cellSet, row, rowIndex, renderer, true, columnStart, false, columnBandingInterval);

        // hide fetching text now that we are done
        this.hideStatusText();

        //kick off animation
        this.addTransformMoveStyle(row, animationDuration + 'ms', 0, 'linear', -1 * width, 0, 0);
    }
};

/**
 * Handles model delete event
 * @param {Array|Object} indexes the indexes that identifies the row that got deleted.
 * @param {Array|Object} keys the key that identifies the row that got deleted.
 * @param {boolean} silent true if the datagrid should not fill the databody
 * @private
 */
DvtDataGrid.prototype._handleModelDeleteEvent = function(indexes, keys, silent)
{
    var key, i, rowKey, row, height, referenceRow, databodyContent, beforeRowsHeight, insideRowsHeight, afterRowsHeight,
            databodyContentHeight, rowHeader, flag, index, beforeRowsDeleted, insideRowsDeleted, totalHeight, scrollerContent;

    // make it an array if it's a single entry event
    if (!Array.isArray(keys))
    {
        keys = new Array(keys);
        indexes = new Array(indexes);
    }

    beforeRowsHeight = 0;
    insideRowsHeight = 0;
    afterRowsHeight = 0;
    beforeRowsDeleted = 0;
    insideRowsDeleted = 0;
    for (i = 0; i < keys.length; i++)
    {
        key = keys[i];
        index = indexes[i];
        if (key['row'] != null)
        {
            height = 0;
            rowKey = key['row'];
            flag = this._isInViewport(index);
            if (flag === DvtDataGrid.BEFORE)
            {
                //should only happen in virtual scrolling
                beforeRowsDeleted++;
                beforeRowsHeight += this.m_avgRowHeight;
                this.m_startRowPixel -= this.m_avgRowHeight;
                this.m_endRowPixel -= this.m_avgRowHeight;
                if (this.m_endRowHeader != -1)
                {
                    this.m_startRowHeaderPixel -= this.m_avgRowHeight;
                    this.m_endRowHeaderPixel -= this.m_avgRowHeight;
                }
                row = this.m_databody['firstChild']['firstChild'];
                if (row != null)
                {
                    this.pushRowsUp(row, this.m_avgRowHeight);
                }
                rowHeader = this.m_rowHeader['firstChild']['firstChild'];
                if (rowHeader != null)
                {
                    this.pushRowsUp(rowHeader, this.m_avgRowHeight);
                }
            }
            else if (flag === DvtDataGrid.INSIDE)
            {
                insideRowsDeleted++;
                row = this._findRowByKey(rowKey);
                if (row != null)
                {
                    height = this.calculateRowHeight(row);
                    referenceRow = row['nextSibling'];
                    this._remove(row);
                    this.pushRowsUp(referenceRow, height);
                    this.m_endRowPixel -= height;
                }
                rowHeader = this._findRowHeaderByKey(rowKey);
                if (rowHeader != null)
                {
                    height = this.calculateRowHeaderHeight(rowHeader);
                    referenceRow = rowHeader['nextSibling'];
                    this._remove(rowHeader);
                    this.pushRowHeadersUp(referenceRow, height);
                    this.m_endRowHeaderPixel -= height;
                }
                insideRowsHeight = insideRowsHeight + height;
            }
            else //flag === DvtDataGrid.AFTER
            {
                //only include after rows if virtual scroll
                if (this.m_options.getScrollPolicy() === 'scroll')
                {
                    afterRowsHeight += this.m_avgRowHeight;
                }
            }
        }
    }

    this.m_startRow -= beforeRowsDeleted;
    this.m_endRow = this.m_endRow - beforeRowsDeleted - insideRowsDeleted;
    if (this.m_endRowHeader != -1)
    {
        this.m_startRowHeader -= beforeRowsDeleted;
        this.m_endRowHeader = this.m_endRowHeader - beforeRowsDeleted - insideRowsDeleted;
    }
    totalHeight = beforeRowsHeight + insideRowsHeight + afterRowsHeight;

    // adjust the databody height
    databodyContent = this.m_databody['firstChild'];
    scrollerContent = this.m_scroller['firstChild'];
    databodyContentHeight = this.getElementHeight(databodyContent) - totalHeight;
    this.setElementHeight(databodyContent, databodyContentHeight);
    this.setElementHeight(scrollerContent, databodyContentHeight);
    this.resizeGrid();

    if (!silent && this.m_moveActive != true)
    {
        // so that grid will be resize
        this.m_resizeRequired = true;
        // check viewport to see if we need to fetch because of deleted row causing empty spaces
        this.m_stopRowFetch = false;
        if (this.m_endRowHeader != -1)
        {
            this.m_stopRowHeaderFetch = false;
        }
        this.fillViewport(this.m_currentScrollLeft, this.m_currentScrollTop);
    }
    this.updateRowBanding();
};

/**
 * Handles model delete event with animation
 * @param {Array} keys the key that identifies the row that got deleted.
 * @param {Array=} indices
 * @private
 */
DvtDataGrid.prototype._handleModelDeleteEventWithAnimation = function(keys, indices)
{
    if (indices)
    {
        this._removeRowsWithAnimation(keys, indices);
    }
    else
    {
        this._collapseRowsWithAnimation(keys);
    }
};

/**
 * Helper function to calculate gaps in the selection if any.
 * @param {Array.<number>} indices indices that identifies rows that got deleted.
 * @return {Array.<Array.<number>>} idxs.
 * @private
 */
DvtDataGrid.prototype._getSelectionGaps = function(indices)
{
    var i, idx, idxs, first;

    idx = [];
    idxs = [];
    first = true;

    for (i = 0; i < indices.length - 1; i++)
    {
        if (indices[i + 1] - indices[i] == 1)
        {
            idx.push(indices[i]);
            first = false;
        }
        else
        {
            if (first)
            {
                idx.push(indices[i]);
            }
            else
            {
                idx.push(indices[i]);
            }
            idxs.push(idx);
            idx = [];
            first = true;
        }
    }
    idx.push(indices[indices.length - 1]);
    idxs.push(idx);

    return idxs;
};

/**
 * Helper method to get row by it's local position.
 * @param {number} pos the local position of the row.
 * @return {Element} row
 * @private
 */
DvtDataGrid.prototype._getRowByLocalPosition = function(pos)
{
    var rowKey;
    rowKey = this._getLocalKeys({'row': pos}).row;
    return this._findRowByKey(rowKey);
};

/**
 * Helper method to process animated rows in responce on the model delete event
 * @param {Object} keys the key that identifies the row that got deleted.
 * @param {Array} indices
 * @param {Array.<Array.<number>>=} indices
 * @private
 */
DvtDataGrid.prototype._removeRowsWithAnimation = function(keys, indices)
{
    var self, key, i, j, k, rowKey, row, totalHeight, height, referenceRow, databodyContent,
            rowHeader, duration, lastTopRow, start, firstRowCase,
            duration_slide, duration_del, delay_slide, delay_del, easing, gaps,
            transition_duration, transition_delay, transition_timing_function, opacity, transform,
            rwn, adjustment, rwp, gap_size;

    self = this;
    // animation start
    self._signalTaskStart();

    gaps = self._getSelectionGaps(indices);
    row = self._getRowByLocalPosition(indices[indices.length - 1]);
    referenceRow = row['nextSibling'];
    gap_size = 0;

    duration_slide = 600;
    duration_del = 400;
    delay_slide = 150;
    delay_del = 0;
    easing = "Cubic-bezier(0.70,0.00,0.51,1.29)";

    transition_duration = self.getCssSupport('transition-duration');
    transition_delay = self.getCssSupport('transition-delay');
    transition_timing_function = self.getCssSupport('transition-timing-function');
    opacity = self.getCssSupport('opacity');
    transform = self.getCssSupport('transform');

    duration = DvtDataGrid.DELETE_ANIMATION_DURATION;
    firstRowCase = true;
    databodyContent = self.m_databody['firstChild'];
    lastTopRow = self._getRowByLocalPosition(indices[0]);
    if (lastTopRow['previousSibling'].childElementCount != 0)
    {
        lastTopRow = lastTopRow['previousSibling'];
        firstRowCase = false;
    }

    for (i = 0; i < keys.length; i++)
    {
        key = keys[i];

        // delete row or column
        if (key['row'])
        {
            rowKey = key['row'];
            // find the row locally, we can't ask the datasource for its index since
            // it's already removed.
            row = self._findRowByKey(rowKey);
            if (row != null)
            {
                height = self.calculateRowHeight(row);
                //add animation CSS rules to each row's style
                self.changeStyleProperty(row, transition_duration, duration_del + "ms");
                self.changeStyleProperty(row, transition_delay, delay_del + "ms");
                self.changeStyleProperty(row, transition_timing_function, easing);
                self.changeStyleProperty(row, opacity, 0);
            }
            else
            {
                // outside of viewport
                height = self.m_avgRowHeight;
            }

            rowHeader = self._findRowHeaderByKey(rowKey);
            if (rowHeader != null)
            {
                //TODO implement collapse animation for rowHeaders here

                height = self.calculateRowHeaderHeight(rowHeader);
                referenceRow = rowHeader['nextSibling'];
                self.pushRowHeadersUp(referenceRow, height);
                self._remove(rowHeader);
                rowHeader['style']['display'] = 'none';
                self.m_endRowHeader = self.m_endRowHeader - 1;
                self.m_endRowHeaderPixel = self.m_endRowHeaderPixel - height;
            }

            // adjust range
            self.m_endRow = self.m_endRow - 1;
            self.m_endRowPixel = self.m_endRowPixel - height;

            totalHeight = totalHeight + height;
        }
        else if (keys['column'])
        {
            // todo: handle remove column
        }
    }

    //slide up rest of rows if required
    if (gaps.length > 1)
    {
        for (i = 0; i < gaps.length - 1; i++)
        {
            gap_size += gaps[i].length;
            adjustment = height * gap_size;
            for (j = gaps[i][gaps[i].length - 1] + 1; j < gaps[i + 1][0]; j++)
            {
                row = self._getRowByLocalPosition(j);
                self.addTransformMoveStyle(row, duration_slide + "ms", delay_slide + "ms", easing, 0, "-" + adjustment, 0);
            }
        }
    }

    rwn = referenceRow;
    adjustment = height * keys.length;

    while (rwn)
    {
        rwp = rwn['previousSibling'];
        self.addTransformMoveStyle(rwn, duration_slide + "ms", delay_slide + "ms", easing, 0, "-" + adjustment, 0);
        rwn = rwn['nextSibling'];
        if (!rwn)
        {
            rwp.addEventListener('transitionend', function()
            {
                //delete all required rows at the end of the animation process
                for (j = 0; j < keys.length; j++)
                {
                    if (keys[j]['row'])
                    {
                        row = self._findRowByKey(keys[j]['row']);
                        self._remove(row);
                        row['style']['display'] = 'none';
                    }
                }
                start = -1;
                for (k = 1; k < databodyContent.childElementCount; k++)
                {
                    row = databodyContent.childNodes[k];
                    if (self._getKey(lastTopRow))
                    {
                        if (self._getKey(lastTopRow) == self._getKey(databodyContent.childNodes[k]))
                        {
                            start = k + 1;
                        }
                    }
                    //clean all animation (transition) parameters for each animated row if required
                    self.changeStyleProperty(row, self.getCssSupport('z-index'), 0, "remove");
                    self.removeTransformMoveStyle(row);

                    //and assign correct top values instead
                    if (start > 0)
                    {
                        databodyContent.childNodes[k].style.top = lastTopRow.offsetTop + height * (k - start + 1) + 'px';
                    }
                    else
                    {
                        if (firstRowCase)
                        {
                            databodyContent.childNodes[k].style.top = lastTopRow.offsetTop + height * (k - 1) + 'px';
                        }
                    }
                }

                // adjust the databody height
                self.setElementHeight(databodyContent, self.getElementHeight(databodyContent) - totalHeight);
                self.setElementHeight(self.m_scroller['firstChild'], self.getElementHeight(databodyContent) - totalHeight);

                // now resize the grid
                self.resizeGrid();

                // check viewport to see if we need to fetch because of deleted row causing empty spaces
                self.m_stopRowFetch = false;
                self.fillViewport(self.m_currentScrollLeft, self.m_currentScrollTop);
                self.updateRowBanding();
                //Note: JSLint 2 issues: Don't make functions within a loop, don't use arguments.callee
                this.removeEventListener('transitionend', arguments.callee, false);
            }, false);
        }
    }
};

/**
 * Helper method to process animated rows in responce on the model delete event
 * @param {Object} keys set of keys that identifies rows that got deleted.
 * @private
 */
DvtDataGrid.prototype._collapseRowsWithAnimation = function(keys)
{
    var self, duration, databodyContent, referenceRow, referenceRowHeader, lastAnimationElement,
            i, rowKey, row, rowsToRemove, rowHeadersToRemove, totalRowHeight, rowHeader,
            tranisitionListener, referenceRowTop, referenceRowHeaderTop, rowHeaderSupport;

    self = this;
    // animation start
    self._signalTaskStart();
    duration = DvtDataGrid.COLLAPSE_ANIMATION_DURATION;
    rowsToRemove = [];
    totalRowHeight = 0;
    rowHeaderSupport = this.m_endRowHeader == -1 ? false : true;
    databodyContent = this.m_databody['firstChild'];

    referenceRow = this._findRowByKey(keys[0]['row'])['previousSibling'];
    referenceRowTop = this.getElementDir(referenceRow, 'top');

    //all inherited animated rows should be hidden under previous rows in view
    row = referenceRow;
    while (row)
    {
        if (this.getElementDir(row, 'top') < this.m_currentScrollTop)
        {
            break;
        }
        this.changeStyleProperty(row, this.getCssSupport('z-index'), 10);
        row = row['previousSibling'];
    }

    if (rowHeaderSupport)
    {
        rowHeadersToRemove = [];
        referenceRowHeader = this._findRowHeaderByKey(keys[0]['row'])['previousSibling'];
        referenceRowHeaderTop = this.getElementDir(referenceRowHeader, 'top');
        row = referenceRowHeader;
        while (row)
        {
            if (this.getElementDir(row, 'top') < this.m_currentScrollTop)
            {
                break;
            }
            this.changeStyleProperty(row, this.getCssSupport('z-index'), 10);
            row = row['previousSibling'];
        }
    }

    // get the rows we need to remove and set the new top to align row bottom with
    // the reference row bottom, but keep it where it is for the time being
    for (i = 0; i < keys.length; i++)
    {
        rowKey = keys[i]['row'];
        row = this._findRowByKey(rowKey);
        if (row != null)
        {
            rowsToRemove.push(row);
            totalRowHeight += this.getElementHeight(row);
            this.setElementDir(row, this.getElementDir(row, 'top') - totalRowHeight, 'top');
            this.addTransformMoveStyle(row, 0, 0, 'linear', 0, totalRowHeight, 0);
        }
        if (rowHeaderSupport)
        {
            rowHeader = this._findRowHeaderByKey(rowKey);
            if (rowHeader != null)
            {
                rowHeadersToRemove.push(rowHeader);
                this.setElementDir(rowHeader, this.getElementDir(rowHeader, 'top') - totalRowHeight, 'top');
                this.addTransformMoveStyle(rowHeader, 0, 0, 'linear', 0, totalRowHeight, 0);
            }
        }
    }

    // for all the rows after the collapse change the top values appropriately
    while (row['nextSibling'])
    {
        // change the row top but keep it where it is
        row = row['nextSibling'];
        this.setElementDir(row, this.getElementDir(row, 'top') - totalRowHeight, 'top');
        this.addTransformMoveStyle(row, 0, 0, 'linear', 0, totalRowHeight, 0);
        if (rowHeaderSupport)
        {
            rowHeader = rowHeader['nextSibling'];
            this.setElementDir(rowHeader, this.getElementDir(rowHeader, 'top') - totalRowHeight, 'top');
            this.addTransformMoveStyle(rowHeader, 0, 0, 'linear', 0, totalRowHeight, 0);
        }
    }

    // listen to the last rows transition end
    lastAnimationElement = databodyContent['lastChild'];
    tranisitionListener = function()
    {
        var i;
        for (i = 0; i < rowsToRemove.length; i++)
        {
            self._remove(rowsToRemove[i]);
            if (rowHeaderSupport)
            {
                self._remove(rowHeadersToRemove[i]);
            }
        }

        self.setElementHeight(databodyContent, self.m_endRowPixel - self.m_startRowPixel);
        self.setElementHeight(self.m_scroller['firstChild'], self.m_endRowPixel - self.m_startRowPixel);
        self.resizeGrid();
        self.updateRowBanding();
        self.fillViewport(self.m_currentScrollLeft, self.m_currentScrollTop);
        self._handleAnimationEnd();
        lastAnimationElement.removeEventListener('transitionend', tranisitionListener, false);
    };

    lastAnimationElement.addEventListener('transitionend', tranisitionListener, false);

    // clean up the variables in the event they are needed before animation end
    this.m_endRow -= rowsToRemove.length;
    this.m_endRowPixel -= totalRowHeight;
    this.m_stopRowFetch = false;
    if (rowHeaderSupport)
    {
        this.m_endRowHeader -= rowHeadersToRemove.length;
        this.m_endRowHeaderPixel -= totalRowHeight;
        this.m_stopRowHeaderFetch = false;
    }

    // animate all rows
    row = referenceRow['nextSibling'];
    if (rowHeaderSupport)
    {
        rowHeader = referenceRowHeader['nextSibling'];
    }
    setTimeout(function() {
        while (row)
        {
            // change the row top but keep it where it is
            self.addTransformMoveStyle(row, duration + "ms", 0, 'ease-out', 0, 0, 0);
            row = row['nextSibling'];
            if (rowHeaderSupport)
            {
                self.addTransformMoveStyle(rowHeader, duration + "ms", 0, 'ease-out', 0, 0, 0);
                rowHeader = rowHeader['nextSibling'];
            }
        }
    }, 0);
};

/**
 * Clean up the datagrid animations by resetting transform vars and z-index
 * @private
 */
DvtDataGrid.prototype._handleAnimationEnd = function()
{
    var i, databodyContent, rowHeaderContent;
    // cleanRows
    databodyContent = this.m_databody['firstChild'];
    rowHeaderContent = this.m_rowHeader['firstChild'];
    for (i = 0; i < databodyContent.childNodes.length; i++)
    {
        this.removeTransformMoveStyle(databodyContent.childNodes[i]);
        this.changeStyleProperty(databodyContent.childNodes[i], this.getCssSupport('z-index'), null, 'remove');
        if (this.m_endRowHeader != -1)
        {
            this.removeTransformMoveStyle(rowHeaderContent.childNodes[i]);
            this.changeStyleProperty(rowHeaderContent.childNodes[i], this.getCssSupport('z-index'), null, 'remove');
        }
    }
    // end animation
    this._signalTaskEnd();
};

/**
 * Find the row element by row key
 * @param {Object} key the row key
 * @return {Element} the row element
 * @private
 */
DvtDataGrid.prototype._findRowByKey = function(key)
{
    var databodyContent, rows, row, i, rowKey;

    if (this.m_databody == null)
    {
        return null;
    }

    databodyContent = this.m_databody['firstChild'];
    rows = databodyContent['childNodes'];
    for (i = 0; i < rows.length; i++)
    {
        row = rows[i];
        rowKey = this._getKey(row);
        if (rowKey == key)
        {
            return row;
        }
    }

    // can't find it, the row is not in viewport
    return null;
};

/**
 * Find the row header element by row key
 * @param {Object} key the row key
 * @return {Element} the row element
 * @private
 */
DvtDataGrid.prototype._findRowHeaderByKey = function(key)
{
    var rowHeaders, rowHeader, i, rowKey;

    if (this.m_rowHeader == null)
    {
        return null;
    }

    //getElementsByClassName support is IE9 and up
    rowHeaders = this.m_rowHeader.getElementsByClassName(this.getMappedStyle('rowheadercell'));
    for (i = 0; i < rowHeaders.length; i++)
    {
        rowHeader = rowHeaders[i];
        rowKey = this._getKey(rowHeader);
        if (rowKey == key)
        {
            return rowHeader;
        }
    }

    // can't find it, the row is not in viewport
    return null;
};

/**
 * Find the row header element by column key
 * @param {Object} key the column key
 * @return {Element} the column element
 * @private
 */
DvtDataGrid.prototype._findColumnHeaderByKey = function(key)
{
    var columnHeaders, columnHeader, i, columnKey;

    if (this.m_colHeader == null)
    {
        return null;
    }

    //getElementsByClassName support is IE9 and up
    columnHeaders = this.m_colHeader.getElementsByClassName(this.getMappedStyle('colheadercell'));
    for (i = 0; i < columnHeaders.length; i++)
    {
        columnHeader = columnHeaders[i];
        columnKey = this._getKey(columnHeader);
        if (columnKey == key)
        {
            return columnHeader;
        }
    }

    // can't find it, the row is not in viewport
    return null;
};

/**
 * Handles model refresh event
 * @private
 */
DvtDataGrid.prototype._handleModelRefreshEvent = function()
{
    var visibility = this.getVisibility();

    // if we are visible, make sure we are visible, and just refresh the datagrid
    // if we are hidden we want to change the state to refresh so the wrapper know to call refresh when we are shown.
    // if we are already in state refresh we do not need to update.
    // if we are in state render we do not want to update that.
    if (visibility === DvtDataGrid.VISIBILITY_STATE_VISIBLE)
    {
        this.empty();
        // if the app developer doesn't notify the grid that it has become hidden
        // check to make sure, if it isn't hidden, refresh if it is
        // supported in IE9+
        if (this.m_root.offsetParent != null)
        {
            this.refresh(this.m_root);
        }
        else
        {
            this.setVisibility(DvtDataGrid.VISIBILITY_STATE_REFRESH);
        }

    }
    else if (visibility === DvtDataGrid.VISIBILITY_STATE_HIDDEN)
    {
        this.empty();
        this.setVisibility(DvtDataGrid.VISIBILITY_STATE_REFRESH);
    }
};

/**
 * Handles data source fetch end (model sync) event
 * @param {Object} event the model event
 * @private
 */
DvtDataGrid.prototype._handleModelSyncEvent = function(event)
{
    var startRow, pageSize, startRowPixel, startCol, startColPixel;
    //Currently these are set to zero for now, may come from the event later
    startRow = 0;
    startRowPixel = 0;
    startCol = 0;
    startColPixel = 0;
    pageSize = event['pageSize'];

    //cancel previous fetch calls
    this.m_fetching = {};

    // reset ranges
    this.m_startRow = startRow;
    this.m_endRow = -1;
    this.m_startRowHeader = startRow;
    this.m_endRowHeader = -1;
    this.m_startRowPixel = startRowPixel;
    this.m_endRowPixel = startRowPixel;
    this.m_startRowHeaderPixel = startRowPixel;
    this.m_endRowHeaderPixel = startRowPixel;
    this.m_startCol = startCol;
    this.m_endCol = -1;
    this.m_startColHeader = startCol;
    this.m_endColHeader = -1;
    this.m_startColPixel = startColPixel;
    this.m_endColPixel = startColPixel;
    this.m_startColHeaderPixel = startColPixel;
    this.m_endColHeaderPixel = startColPixel;
    this.m_rowHeaderLevelCount = undefined;
    this.m_columnHeaderLevelCount = undefined;

    this.m_stopDatabodyScroll = false;
    this.m_captureScrolling = false;
    this.m_avgRowHeight = undefined;
    this.m_avgColWidth = undefined;

    this.m_isEstimateRowCount = undefined;
    this.m_isEstimateColumnCount = undefined;
    this.m_stopRowFetch = false;
    this.m_stopRowHeaderFetch = false;
    this.m_stopColumnFetch = false;
    this.m_stopColumnHeaderFetch = false;

    //clear selections
    this.m_selection = null;
    this.m_active = null;
    this.m_prevActive = null;

    if (this.m_empty != null)
    {
        this.m_root.removeChild(this.m_empty);
        this.m_empty = null;
    }

    this.m_initialized = false;
    this.fetchHeaders("row", startRow, this.m_rowHeader, pageSize, {'success': function(headerSet, headerRange)
        {
            this.handleRowHeadersFetchSuccessForLongScroll(headerSet, headerRange, startRowPixel);
        }});
    this.fetchHeaders("column", startCol, this.m_colHeader, undefined, {'success': function(headerSet, headerRange)
        {
            this.handleColumnHeadersFetchSuccessForLongScroll(headerSet, headerRange);
        }});

    this.fetchCells(this.m_databody, this.m_scroller, startRow, startCol, pageSize, null, {'success': function(cellSet, cellRange)
        {
            this.handleCellsFetchSuccessForLongScroll(cellSet, cellRange);
        }});
    this.setInitialScrollPosition();
};

/************************************ active cell navigation ******************************/
/**
 * Sets the active cell by index
 * @param {Object} index row and column index
 * @param {Event} event the DOM event causing the active cell change
 * @param {boolean} clearSelection true if we should clear the selection on active change
 * @private
 * @return {boolean} true if active was changed, false if not
 */
DvtDataGrid.prototype._setActiveByIndex = function(index, event, clearSelection)
{
    return this._setActive(this._getCellByIndex(index), event, clearSelection);
}

/**
 * Updates the active cell based on external set, do not fire events
 * @param {Object} activeObject set by application could be sparse
 * @private
 */
DvtDataGrid.prototype._updateActive = function(activeObject)
{
    //the activeObject is potentially sparse, try to get an element from it
    var level, newActiveElement;
    if (activeObject == null)
    {
        this._setActive(null, null, null, true);
    }
    else if (activeObject['keys'] != null)
    {
       newActiveElement = this._getCellByKeys(activeObject['keys']);
    }
    else if (activeObject['indexes'] != null)
    {
        newActiveElement = this._getCellByIndex(activeObject['indexes']);
    }
    else if (activeObject['axis'] != null)
    {
        level = activeObject['level'] == null ? 0 : activeObject['level'];
        if (activeObject['axis'] == 'column')
        {
            if (activeObject['key'] != null)
            {
                newActiveElement = this._findColumnHeaderByKey(activeObject['key']);
            }
            else if (activeObject['index'] != null)
            {
                newActiveElement = this._getColumnHeaderByIndex(activeObject['index'], level);
            }
        }
        else if (activeObject['axis'] == 'row')
        {
            if (activeObject['key'] != null)
            {
                newActiveElement = this._findRowHeaderByKey(activeObject['key']);
            }
            else if (activeObject['index'] != null)
            {
                newActiveElement = this._getRowHeaderByIndex(activeObject['index'], level);
            }
        }
    }

    if (newActiveElement != null)
    {
        this._setActive(newActiveElement, null, null, true);
    }
};

/**
 * Sets the active cell or header by element
 * @param {Element|null} element to set active to
 * @param {Event=} event the DOM event causing the active cell change
 * @param {boolean=} clearSelection true if we should clear the selection on active change
 * @param {boolean=} silent true if we should not fire events
 * @returns {Boolean} true if active was changed, false if not
 */
DvtDataGrid.prototype._setActive = function(element, event, clearSelection, silent)
{
    if (element != null)
    {
        var active = this._createActiveObject(element);
        // see if the active cell is actually changing
        if (this._compareActive(active, this.m_active))
        {
            // fire vetoable beforeCurrentCell event
            if (silent || this._fireBeforeCurrentCellEvent(active, this.m_active, event))
            {
                this.m_prevActive = this.m_active;
                this.m_active = active;
                this._scrollToActive(active);
                if (clearSelection && this._isSelectionEnabled())
                {
                    this._clearSelection();
                }
                this._unhighlightActiveObject(this.m_prevActive);
                this._highlightActiveObject(this.m_active, this.m_prevActive);
                this._manageMoveCursor();
                if (!silent)
                {
                    this._fireCurrentCellEvent(active, event);
                }
                return true;
            }
        }
    }
    else if (!this.m_scrollIndexAfterFetch && !this.m_scrollHeaderAfterFetch)
    {
        if (silent || this._fireBeforeCurrentCellEvent(active, this.m_active, event))
        {
            this.m_prevActive = this.m_active;
            this.m_active = null;
            this._unhighlightActiveObject(this.m_prevActive);
            if (!silent)
            {
                this._fireCurrentCellEvent(active, event);
            }
        }
        return true;
    }
    return false;
};

/**
 * Create an active object from an element active object contains:
 * For header: type, axis, index, key, level
 * For cell: indexes, keys
 * @param {Element} element - the element to create an active object from
 * @return {Object} an active object
 */
DvtDataGrid.prototype._createActiveObject = function(element)
{
    var context = element[this.getResources().getMappedAttribute('context')]
    if (this.m_utils.containsCSSClassName(element, this.getMappedStyle('headercell')))
    {
        return {
            'type': 'header',
            'axis': context['axis'],
            'index': this.getHeaderCellIndex(element),
            'key': context['key'],
            'level': context['level']
        };
    }
    else
    {
        return {
            'type': 'cell',
            'indexes': {
                'row': this.getRowIndex(element['parentNode']),
                'column': this.getCellIndex(element)
            },
            'keys': {
                'row': context['keys']['row'],
                'column': context['keys']['column']
            }
        }
    }
};

/**
 * Retrieve the active element.
 * @return {Element|null} the active cell or header cell
 * @private
 */
DvtDataGrid.prototype._getActiveElement = function()
{
    return this._getElementFromActiveObject(this.m_active);
};

/**
 * Retrieve the element based on an active object.
 * @param {Object} active the object to get the element of
 * @return {Element|null} the active cell or header cell
 * @private
 */
DvtDataGrid.prototype._getElementFromActiveObject = function(active)
{
    var elements;
    if (active != null)
    {
        if (active['type'] == 'header')
        {
            if (active['axis'] === 'row')
            {
                return this._findRowHeaderByKey(active['key']);
            }
            else if (active['axis'] === 'column')
            {
                return this._findColumnHeaderByKey(active['key']);
            }
        }
        else
        {
            elements = this.getElementsInRange(this.createRange(active['indexes']))
            if (elements != null)
            {
                return elements[0];
            }
        }
    }
    return null;
};

/**
 * Compare two active objects to see if they are equal
 * @param {Object} active an active object
 * @param {Object} active a comparison active object
 * @return {boolean} true if not equal
 */
DvtDataGrid.prototype._compareActive = function(active1, active2)
{
    if (active1 == null && active2 == null)
    {
        return false;
    }
    else if ((active1 == null && active2 != null) || (active1 != null && active2 == null))
    {
        return true;
    }
    else if (active1['type'] == active2['type'])
    {
        if (active1['type'] == 'header')
        {
            if (active1['index'] != active2['index'] ||
                    active1['key'] != active2['key'] ||
                    active1['axis'] != active2['axis'] ||
                    active1['level'] != active2['level'])
            {
                return true;
            }
        }
        else
        {
            if (active1['indexes']['row'] != active2['indexes']['row'] ||
                    active1['indexes']['column'] != active2['indexes']['column'] ||
                    active1['keys']['row'] != active2['keys']['row'] ||
                    active1['keys']['column']!= active2['keys']['column'])
            {
                return true;
            }
        }
    }
    else
    {
        return true;
    }
    return false;
};

/**
 * Fires an event before the current cell changes
 * @param {Object} newActive the new active information
 * @param {Object} oldActive the new active information
 * @param {Event} event the DOM event
 * @private
 * @return {boolean} true if event should continue
 */
DvtDataGrid.prototype._fireBeforeCurrentCellEvent = function(newActive, oldActive, event)
{
    // the event contains the context info
    var details =
    {
        'event': event,
        'ui':
        {
            'currentCell': newActive,
            'previousCurrentCell': oldActive
        }
    };

    return this.fireEvent('beforeCurrentCell', details);
};

/**
 * Fires an event to tell the datagrid to update the currentCell option
 * @param {Object} active the new active information
 * @param {Event} event the DOM event
 * @private
 */
DvtDataGrid.prototype._fireCurrentCellEvent = function(active, event)
{
    // the event contains the context info
    var details =
    {
        'event': event,
        'ui': active
    };

    return this.fireEvent('currentCell', details);
};

/**
 * Is the databody cell active
 * @return {boolean} true if active element is a cell
 * @private
 */
DvtDataGrid.prototype._isDatabodyCellActive = function()
{
    return (this.m_active != null && this.m_active['type'] == 'cell')
};

/**
 * Update the context info based on active changess
 * @param {Object} activeObject
 * @param {Object} prevActiveObject
 */
DvtDataGrid.prototype._updateActiveContext = function(activeObject, prevActiveObject)
{
    var axis, index, level, contextObj, skip;
    if (activeObject['type'] === 'header')
    {
        axis = activeObject['axis'];
        index = activeObject['index'];
        level = activeObject['level'];

        contextObj = {};
        if (activeObject['axis'] === 'row')
        {
            if (this.m_rowHeaderLevelCount > 1)
            {
                if (prevActiveObject == null ? true : !(level === prevActiveObject['level'] && axis === prevActiveObject['axis']))
                {
                    contextObj['level'] = level;
                }
            }
            if (prevActiveObject == null ? true : !(index === prevActiveObject['index'] && axis === prevActiveObject['axis']))
            {
                contextObj['rowHeader'] = index;
            }
        }
        else
        {
            if (this.m_columnHeaderLevelCount > 1)
            {
                if (prevActiveObject == null ? true : !(level === prevActiveObject['level'] && axis === prevActiveObject['axis']))
                {
                    contextObj['level'] = level;
                }
            }
            if (prevActiveObject == null ? true : !(index === prevActiveObject['index'] && axis === prevActiveObject['axis']))
            {
                contextObj['columnHeader'] = index;
            }
        }
        // update context info
        this._updateContextInfo(contextObj, skip);
    }
    else
    {
        // check whether the prev and current active cell is in the same row/column so that we can
        // skip row/column header info in aria-labelledby (to make the description more brief)
        if (prevActiveObject != null && prevActiveObject['type'] == 'cell' && activeObject != null && !this.m_externalFocus)
        {
           if (activeObject['indexes']['row'] === prevActiveObject['indexes']['row'])
           {
               skip = "row";
           }
           else if (activeObject['indexes']['column'] === prevActiveObject['indexes']['column'])
           {
               skip = "column";
           }
        }
        // update context info
        this._updateContextInfo(activeObject['indexes'], skip);
    }
}

/**
 * Handles click to make a cell active
 * @param {Event} event
 * @private
 */
DvtDataGrid.prototype.handleDatabodyClickActive = function(event)
{
    var cell = this.findCell(event.target);
    if (cell != null)
    {
        this._setActive(cell, event);
    }
};

/**
 * Handles click to select a header
 * @param {Event} event
 */
DvtDataGrid.prototype.handleHeaderClickActive = function(event)
{
    var header = this.findHeader(event.target);
    if (header != null)
    {
        if (this._isSelectionEnabled())
        {
            this._clearSelection();
        }
        this._setActive(header, event);
    }
};

/**
 * Scroll to the active object
 * @param {Event} event
 */
DvtDataGrid.prototype._scrollToActive = function(activeObject)
{
    if (activeObject['type'] === 'header')
    {
        this.scrollToHeader(activeObject);
    }
    else
    {
        this.scrollToIndex(activeObject['indexes']);
    }
};

/**
 * Retrieve the active cell.
 * @return {Element|null} the active cell
 * @private
 */
DvtDataGrid.prototype._getCellByIndex = function(indexes)
{
    var elements = this.getElementsInRange(this.createRange(indexes))
    if (elements != null)
    {
        return elements[0];
    }
    return null;
};

/**
 * Retrieve cell by keys
 * @param {Object} keys
 * @return {Element|null} the active cell
 * @private
 */
DvtDataGrid.prototype._getCellByKeys = function(keys)
{
    var row = this._findRowByKey(keys['row']);
    if (row != null)
    {
        var cells = row['childNodes'];
        for (var i=0; i<cells.length; i++)
        {
            if (cells[i][this.getResources().getMappedAttribute('context')]['keys']['column'] === keys['column'])
            {
                return cells[i];
            }
        }
    }
    return null;
};

/**
 * Retrieve the index of a row
 * @param {Element|EventTarget} row
 * @return {number}
 */
DvtDataGrid.prototype.getRowIndex = function(row)
{
    var index = this.m_startRow;
    while (row['previousSibling'])
    {
        index += 1;
        row = row['previousSibling'];
    }
    return index;
};

/**
 * Retrieve the (column) index of a cell
 * @param {Element|EventTarget} cell
 * @return {number}
 */
DvtDataGrid.prototype.getCellIndex = function(cell)
{
    var index = this.m_startCol;
    while (cell['previousSibling'])
    {
        index += 1;
        cell = cell['previousSibling'];
    }
    return index;
};

/**
 * Retrieve the index of a header cell
 * @param {Element} header header cell element
 * @return {number}
 */
DvtDataGrid.prototype.getHeaderCellIndex = function(header)
{
    var axis, index;
    axis = this.getHeaderCellAxis(header);
    if (axis === 'row')
    {
        // if there are multiple levels on the row header
        if (this.m_rowHeaderLevelCount > 1)
        {
            // get the groupingContainer's start value and set thtat to the index
            index = this._getAttribute(header['parentNode'], 'start', true);
            //if this is the groupingContainer's first child rturn that value
            if (header === header['parentNode']['firstChild'])
            {
                return index;
            }
            //decrement the index by one for the first header element at the level above it
            index--;
        }
        else
        {
            index = this.m_startRowHeader;
        }
    }
    else if (axis === 'column')
    {
        // if there are multiple levels on the row header
        if (this.m_columnHeaderLevelCount > 1)
        {
            // get the groupingContainer's start value and set thtat to the index
            index = this._getAttribute(header['parentNode'], 'start', true);
            //if this is the groupingContainer's first child rturn that value
            if (header === header['parentNode']['firstChild'])
            {
                return index;
            }
            //decrement the index by one for the first header element at the level above it
            index--;
        }
        else
        {
            index = this.m_startColHeader;
        }
    }

    while (header['previousSibling'])
    {
        index += 1;
        header = header['previousSibling'];
    }

    return index;
};

/**
 * Retrieve the axis of a header cell
 * @param {Element} header header cell element
 * @return {string|null} row or column
 */
DvtDataGrid.prototype.getHeaderCellAxis = function(header)
{
    if (this.m_utils.containsCSSClassName(header, this.getMappedStyle('colheadercell')))
    {
        return 'column';
    }
    else if (this.m_utils.containsCSSClassName(header, this.getMappedStyle('rowheadercell')))
    {
        return 'row';
    }
    return null;
};

/**
 * Retrieve the level of a header cell
 * @param {Element} header header cell element
 * @return {number|null} row or column
 */
DvtDataGrid.prototype.getHeaderCellLevel = function(header)
{
    var level;
    if (this.m_utils.containsCSSClassName(header, this.getMappedStyle('colheadercell')))
    {
        if (this.m_columnHeaderLevelCount === 1)
        {
            return 0;
        }

    }
    else if (this.m_utils.containsCSSClassName(header, this.getMappedStyle('rowheadercell')))
    {
        if (this.m_rowHeaderLevelCount === 1)
        {
            return 0;
        }
    }
    else
    {
        return null;
    }

    level = this._getAttribute(header['parentNode'], 'level', true);
    if (header === header['parentNode']['firstChild'])
    {
        return level;
    }
    // plus one case is if we are on the innermost level the headers do not have their own
    // grouping containers so if it is the first child it is the level of the grouping container
    // but all subsequent children are the next level in
    return level + this.getHeaderCellDepth(header['parentNode']['firstChild']);
};

/**
 * Retrieve the depth of a header cell
 * @param {Element} header header cell element
 * @return {number|null} row or column depth
 */
DvtDataGrid.prototype.getHeaderCellDepth = function(header)
{
    return this._getAttribute(header, 'depth', true);
};

/**
 * Find the cell element (recursively if needed)
 * @private
 * @param {Element|EventTarget} elem
 * @return {Element|EventTarget}
 */
DvtDataGrid.prototype.findCell = function(elem)
{
    return this.find(elem, "cell");
};

/**
 * Find the cell element (recursively if needed)
 * @param {Element|EventTarget} elem
 * @param {string} key
 * @param {string=} className
 * @return {Element|EventTarget}
 */
DvtDataGrid.prototype.find = function(elem, key, className)
{
    // if element is null or if we reach the root of DataGrid
    if (elem == null || elem == this.getRootElement())
    {
        return null;
    }

    // recursively walk up the element and find the class name that matches the cell class name
    if (className == undefined)
    {
        className = this.getMappedStyle(key);
    }

    if (className == null)
    {
        return null;
    }

    // if the element contains the cell class name, then it's a cell, otherwise go up
    if (this.m_utils.containsCSSClassName(elem, className))
    {
        return elem;
    }
    return this.find(elem['parentNode'], key, className);
};

/**
 * Highlight the current active element
 * @param {Array} classNames string of classNames to add to active element
 * @private
 */
DvtDataGrid.prototype._highlightActive = function(classNames)
{
    this._highlightActiveObject(this.m_active, this.m_prevActive, classNames);
};


/**
 * Unhighlight the current active element
 * @param {Array} classNames string of classNames to remove from active element
 * @private
 */
DvtDataGrid.prototype._unhighlightActive = function(classNames)
{
    this._unhighlightActiveObject(this.m_active, classNames);
};

/**
 * Highlight the specified object
 * @param {Object} activeObject active to unhighlight
 * @param {Object} prevActiveObject last active to base aria properties on
 * @param {Array} classNames string of classNames to add to active element
 * @private
 */
DvtDataGrid.prototype._highlightActiveObject = function(activeObject, prevActiveObject, classNames)
{
    if (classNames == null)
    {
        classNames = ['focus'];
    }
    if (activeObject != null)
    {
        var element = this._getElementFromActiveObject(activeObject);
        this._highlightElement(element, classNames);
        this._setAriaProperties(activeObject, prevActiveObject, element);
    }
};

/**
 * Unhighlight the specified object
 * @param {Object} activeObject to unhighlight
 * @param {Array} classNames string of classNames to remove from active element
 * @private
 */
DvtDataGrid.prototype._unhighlightActiveObject = function(activeObject, classNames)
{
    if (classNames == null)
    {
        classNames = ['focus'];
    }
    if (activeObject != null)
    {
        var element = this._getElementFromActiveObject(activeObject);
        this._unhighlightElement(element, classNames);
        this._unsetAriaProperties(element);
    }
};

/**
 * Highlight an element adding classes in the provided array
 * @param {Element} element
 * @param {Array} classNames
 */
DvtDataGrid.prototype._highlightElement = function(element, classNames)
{
    var className, i;
    for (i = 0; i < classNames.length; i++)
    {
        className = this.getMappedStyle(classNames[i]);
        this.m_utils.addCSSClassName(element, className);
    }
};

/**
 * Unhighlight an element removing classes in the provided array
 * @param {Element} element
 * @param {Array} classNames
 */
DvtDataGrid.prototype._unhighlightElement = function(element, classNames)
{
    var className, i;
    for (i = 0; i < classNames.length; i++)
    {
        className = this.getMappedStyle(classNames[i]);
        this.m_utils.removeCSSClassName(element, className);
    }
};

/**
 * Reset all wai-aria properties on a cell or header.
 * @param {Object} activeObject active to unhighlight
 * @param {Object} prevActiveObject last active to base aria properties on
 * @param {Element} element the element to reset all wai-aria properties
 * @private
 */
DvtDataGrid.prototype._setAriaProperties = function(activeObject, prevActiveObject, element)
{
    var label;
    label = this.getLabelledBy(activeObject, prevActiveObject, element);
    this._updateActiveContext(activeObject, prevActiveObject);

    element.setAttribute("tabIndex", 0);
    element.setAttribute("aria-labelledby", label);

    // check to see if we should focus on the cell later
    if (this.m_cellToFocus == null || this.m_cellToFocus != element)
    {
        element.focus();
    }
};

/**
 * Reset all wai-aria properties on a cell or header.
 * @param {Element} element the element to reset all wai-aria properties.
 */
DvtDataGrid.prototype._unsetAriaProperties = function(element)
{
    if (element != null)
    {
        // reset focus index
        element.setAttribute("tabIndex", -1);
        // remove aria related attributes
        element.removeAttribute("aria-labelledby");
    }
};

/**
 * Returns the wai-aria labelled by property for a cell
 * @param {Element} cell the element for the cell
 * @param {string=} skip if "row" then skip getting the row header info, if "column" then skip getting the column header info
 *                  if undefined, then both row and column header info should be retrieved
 * @return {string} the wai-aria labelled by property for the cell
 */
DvtDataGrid.prototype.getLabelledBy = function(activeObject, prevActiveObject, element)
{
    var label, previousElement, direction, key, rowHeader, columnHeader, previousRowIndex, previousColumnIndex;
    label = "";

    if (activeObject['type'] == 'header')
    {
        // get the previous active header to compare what the screen reader needs to read for parent Ids,
        // should only need this if multi level header
        if (prevActiveObject != null && prevActiveObject['type'] == 'header' && !this.m_externalFocus)
        {
            if (prevActiveObject['axis'] === 'row' && this.m_rowHeaderLevelCount > 1)
            {
                previousElement = this._getRowHeaderByIndex(prevActiveObject['index'], prevActiveObject['level']);
            }
            else if (prevActiveObject['axis'] === 'column' && this.m_columnHeaderLevelCount > 1)
            {
                previousElement = this._getColumnHeaderByIndex(prevActiveObject['index'], prevActiveObject['level']);
            }
        }

        label = this.createSubId("context") + this._getHeaderAndParentIds(element, previousElement);
        direction = element.getAttribute(this.getResources().getMappedAttribute('sortDir'));
        if (direction === "ascending")
        {
            key = "accessibleSortAscending";
            label = label + " " + this.createSubId("state");
        }
        else if (direction === "descending")
        {
            key = "accessibleSortDescending";
            label = label + " " + this.createSubId("state");
        }

        if (this.m_externalFocus === true)
        {
            label = [this.createSubId("summary"), label].join(" ");
            this.m_externalFocus = false;
        }

        if (key != null)
        {
            this._updateStateInfo(key, {'id': ''});
        }


        element.setAttribute("tabIndex", 0);

    }
    else
    {
        if (prevActiveObject != null)
        {
            if (prevActiveObject['type'] === 'header')
            {
                previousRowIndex = prevActiveObject['axis'] === 'row' ? prevActiveObject['index'] : null;
                previousColumnIndex = prevActiveObject['axis'] === 'column' ? prevActiveObject['index'] : null;
            }
            else
            {
                previousRowIndex = prevActiveObject['indexes']['row'];
                previousColumnIndex = prevActiveObject['indexes']['column'];
            }
        }

        // the row header, if any
        if (this.m_endRowHeader != -1 && (activeObject['indexes']['row'] != previousRowIndex || this.m_externalFocus))
        {
            rowHeader = this.getHeaderFromCell(element, 'row');
            if (previousRowIndex != null)
            {
                previousElement = this._getRowHeaderByIndex(previousRowIndex, this.m_rowHeaderLevelCount - 1);
            }
            label = this._getHeaderAndParentIds(rowHeader, previousElement);
        }
        // the row header, if any
        if (this.m_endColHeader != -1 && (activeObject['indexes']['column'] != previousColumnIndex || this.m_externalFocus))
        {
            columnHeader = this.getHeaderFromCell(element, 'column');
            if (previousColumnIndex != null)
            {
                previousElement = this._getColumnHeaderByIndex(previousColumnIndex, this.m_columnHeaderLevelCount - 1);
            }
            if (label == "")
            {
                label = this._getHeaderAndParentIds(columnHeader, previousElement);
            }
            else
            {
                label = [label, this._getHeaderAndParentIds(columnHeader, previousElement)].join(" ");
            }
        }

        // finally the state info
        if (label == "")
        {
            label = element['id'];
        }
        else
        {
            label = [label, element['id']].join(" ");
        }
        label = [this.createSubId("context"), label, this.createSubId("state")].join(" ");

        if (this.m_externalFocus)
        {
            label = [this.createSubId("summary"), label].join(" ");
            this.m_externalFocus = false;
        }
    }
    return label;
};

/**
 * Returns the header that is in line with a cell along an axis.
 * Key Note: in the case of row, we return the row not the headercell
 * @param {Element} cell the element for the cell
 * @param {string} axis the axis along which to find the header, 'row', 'column'
 * @return {Element} the header Element along the axis
 */
DvtDataGrid.prototype.getHeaderFromCell = function(cell, axis)
{
    var row, rowIndex, colIndex;
    if (axis === 'row')
    {
        if (this.m_rowHeader != null)
        {
            row = cell['parentNode'];
            rowIndex = this.findIndexOf(row) + this.m_startRow;
            if (rowIndex > -1)
            {
                return this._getRowHeaderByIndex(rowIndex, this.m_rowHeaderLevelCount - 1);
            }
        }
    }
    else if (axis === 'column')
    {
        if (this.m_colHeader != null)
        {
            colIndex = this.findIndexOf(cell) + this.m_startCol;
            if (colIndex > -1)
            {
                return this._getColumnHeaderByIndex(colIndex, this.m_columnHeaderLevelCount - 1);
            }
        }
    }
    return null;
};

/**
 * Helper method to find the index of a child from its parent
 * @param {Element} elem an HTML element
 * @return {number} the index of the element relative to its parent
 */
DvtDataGrid.prototype.findIndexOf = function(elem)
{
    var child, children, index, i;

    children = elem['parentNode']['childNodes'];
    index = -1;
    for (i = 0; i < children.length; i += 1)
    {
        child = children[i];
        if (child === elem)
        {
            return index + 1;
        }

        if (child.nodeName == 'DIV')
        {
            index++;
        }
    }

    return index;
};

/**
 * Creates a range object given the start and end index, will add in keys if they are passed in
 * @param {Object} startIndex - the start index of the range
 * @param {Object=} endIndex - the end index of the range.  Optional, if not specified it represents a single cell/row
 * @param {Object=} startKey - the start key of the range.  Optional, if not specified it represents a single cell/row
 * @param {Object=} endKey - the end key of the range.  Optional, if not specified it represents a single cell/row
 * @return {Object} a range object representing the start and end index, along with the start and end key.
 */
DvtDataGrid.prototype.createRange = function(startIndex, endIndex, startKey, endKey)
{
    var startRow, endRow, startColumn, endColumn, startRowKey, endRowKey, startColumnKey, endColumnKey;
    if (endIndex)
    {
        // -1 means unbound
        if (startIndex['row'] < endIndex['row'] || endIndex['row'] == -1)
        {
            startRow = startIndex['row'];
            endRow = endIndex['row'];
            if (startKey)
            {
                startRowKey = startKey['row'];
                endRowKey = endKey['row'];
            }
        }
        else
        {
            startRow = endIndex['row'];
            endRow = startIndex['row'];
            if (startKey)
            {
                startRowKey = endKey['row'];
                endRowKey = startKey['row'];
            }
        }

        // row based selection does not have column specified for range
        if (!isNaN(startIndex['column']) && !isNaN(endIndex['column']))
        {
            // -1 means unbound
            if (startIndex['column'] < endIndex['column'] || endIndex['column'] == -1)
            {
                startColumn = startIndex['column'];
                endColumn = endIndex['column'];
                if (startKey)
                {
                    startColumnKey = startKey['column'];
                    endColumnKey = endKey['column'];
                }
            }
            else
            {
                startColumn = endIndex['column'];
                endColumn = startIndex['column'];
                if (startKey)
                {
                    startColumnKey = endKey['column'];
                    endColumnKey = startKey['column'];
                }
            }

            startIndex = {
                "row": startRow, "column": startColumn
            };
            endIndex = {
                "row": endRow, "column": endColumn
            };
            if (startKey)
            {
                startKey = {
                    "row": startRowKey, "column": startColumnKey
                };
                endKey = {
                    "row": endRowKey, "column": endColumnKey
                };
            }
        }
        else
        {
            startIndex = {
                "row": startRow
            };
            endIndex = {
                "row": endRow
            };
            if (startKey)
            {
                startKey = {
                    "row": startRowKey, "column": startColumnKey
                };
                endKey = {
                    "row": endRowKey, "column": endColumnKey
                };
            }
        }
    }

    if (startKey)
    {
        return {"startIndex": startIndex, "endIndex": endIndex, "startKey": startKey, "endKey": endKey};
    }

    return {"startIndex": startIndex, "endIndex": endIndex};
};


/**
 * Creates a range object given the start and end index
 * @param {Object} startIndex - the start index of the range
 * @param {Object|null} endIndex - the end index of the range.
 * @param {function} callback - the callback for the range to call when its fully fetched
 * @private
 */
DvtDataGrid.prototype._createRangeWithKeys = function(startIndex, endIndex, callback)
{
    this._keys(startIndex, this._createRangeStartKeyCallback.bind(this, endIndex, callback));
};

/**
 * Creates a range object given the start and end index
 * @param {Object|null} endIndex - the end index of the range.
 * @param {function} callback - the callback for the range to call when its fully fetched
 * @param {Object} startKey - the start key of the range
 * @param {Object} startIndex - the start index of the range
 * @private
 */
DvtDataGrid.prototype._createRangeStartKeyCallback = function(endIndex, callback, startKey, startIndex)
{
    //keys will be the same
    if (endIndex === startIndex)
    {
        this._createRangeEndKeyCallback(startKey, startIndex, callback, startKey, startIndex);
    }
    //new keys needed
    else if (endIndex)
    {
        this._keys(endIndex, this._createRangeEndKeyCallback.bind(this, startKey, startIndex, callback));
    }
    //create range from single key
    else
    {
        callback.call(this, {"startIndex": startIndex, "endIndex": startIndex, "startKey": startKey, "endKey": startKey});
    }
};

/**
 * Creates a range object given the start and end index
 * @param {Object} startKey - the start key of the range
 * @param {Object} startIndex - the start index of the range
 * @param {function} callback - the callback for the range to call when its fully fetched
 * @param {Object} endKey - the end key of the range.
 * @param {Object} endIndex - the end index of the range.
 * @private
 */
DvtDataGrid.prototype._createRangeEndKeyCallback = function(startKey, startIndex, callback, endKey, endIndex)
{
    callback.call(this, this.createRange(startIndex, endIndex, startKey, endKey));
};

/**
 * Retrieve the end index of the range, return start index if end index is undefined
 * @param {Object} range
 * @return {Object}
 */
DvtDataGrid.prototype.getEndIndex = function(range)
{
    return (range['endIndex'] == null) ? range['startIndex'] : range['endIndex'];
};

/**
 * Grabs all the elements in the databody which are within the specified range.
 * @param range - the range in which to get the elements
 * @param {number=} startRow
 * @param {number=} endRow
 * @param {number=} startCol
 * @param {number=} endCol
 * @return {Array}
 */
DvtDataGrid.prototype.getElementsInRange = function(range, startRow, endRow, startCol, endCol)
{
    var startIndex, endIndex, rangeStartRow, rangeEndRow, rangeStartColumn, rangeEndColumn, nodes, databodyContent, rows, i, columns, j, cell, row;
    if (startRow == undefined)
    {
        startRow = this.m_startRow;
    }
    if (endRow == undefined)
    {
        endRow = this.m_endRow + 1;
    }

    startIndex = range['startIndex'];
    endIndex = this.getEndIndex(range);

    rangeStartRow = startIndex['row'];
    rangeEndRow = endIndex['row'];
    // index = -1 means unbounded index
    if (rangeEndRow == -1)
    {
        rangeEndRow = Number.MAX_VALUE;
    }

    // check if in the rendered range
    if (endRow < rangeStartRow || rangeEndRow < startRow)
    {
        return null;
    }

    if (!isNaN(startIndex['column']) && !isNaN(endIndex['column']))
    {
        rangeStartColumn = startIndex['column'];
        rangeEndColumn = endIndex['column'];
        // index = -1 means unbounded index
        if (rangeEndColumn == -1)
        {
            rangeEndColumn = Number.MAX_VALUE;
        }

        // check if in the rendered range
        if ((this.m_endCol + 1) < rangeStartColumn || rangeEndColumn < this.m_startCol)
        {
            return null;
        }
    }

    nodes = [];
    // now walk the databody to find the nodes in range
    databodyContent = this.m_databody['firstChild'];
    rows = databodyContent['childNodes'];

    // the range is within the databody, calculate the relative position
    rangeStartRow = Math.max(0, rangeStartRow - this.m_startRow);
    rangeEndRow = Math.min(rows.length, rangeEndRow - this.m_startRow + 1);

    // cell case
    if (!isNaN(rangeStartColumn) && !isNaN(rangeEndColumn))
    {
        if (startCol == undefined)
        {
            startCol = this.m_startCol;
        }

        rangeStartColumn = Math.max(0, rangeStartColumn - this.m_startCol);
        rangeEndColumn = rangeEndColumn - this.m_startCol + 1;
        for (i = rangeStartRow; i < rangeEndRow; i += 1)
        {
            columns = rows[i]['childNodes'];
            for (j = rangeStartColumn; j < Math.min(columns.length, rangeEndColumn); j += 1)
            {
                cell = columns[j];
                nodes.push(cell);
            }
        }
    }
    else
    {// row case
        for (i = rangeStartRow; i < rangeEndRow; i += 1)
        {
            row = rows[i];
            nodes.push(row);
        }
    }

    return nodes;
};

/**
 * Checks whether the key event contains key strokes for reading active cell content
 * @param {event} event the dom event
 * @return {boolean} true if the event is for reading active cell content, false otherwise.
 * @protected
 */
DvtDataGrid.prototype.isReadCurrentContent = function(event)
{
    // the key combo is Ctrl+Alt+5
    return (event.altKey && this.m_utils.ctrlEquivalent(event) && event.keyCode === DvtDataGrid.NUM5_KEY);
};

/**
 * Read the full content of the active cell (or frontier cell) to the screen reader
 * @protected
 * @returns {boolean} true if there is content to read out
 */
DvtDataGrid.prototype.readCurrentContent = function()
{
    var current, range, cell, currentCell, subid, needToModify, labelledBy;

    if (this.m_active == null)
    {
        return false;
    }

    if (this.m_active['type'] == 'header')
    {
        current = {};
        if (this.m_active['axis'] === 'row')
        {
            if (this.m_rowHeaderLevelCount > 1)
            {
                current['level'] = this.m_active['level'];
            }
            current['rowHeader'] = this.m_active['index'];
        }
        else
        {
            if (this.m_columnHeaderLevelCount > 1)
            {
                current['level'] = this.m_active['level'];
            }
            current['columnHeader'] = this.m_active['index'];
        }
        currentCell = this._getActiveElement();
    }
    else
    {
        current = this.m_active['indexes'];
        if (this._isSelectionEnabled() && this.isMultipleSelection())
        {
            if (this.m_selectionFrontier != null)
            {
                current = this.m_selectionFrontier;
            }
        }
        // make sure there is an active cell or frontier cell
        if (current == null)
        {
            return false;
        }

        // find the cell div
        range = this.createRange(current);
        cell = this.getElementsInRange(range);
        if (cell == null || cell.length == 0)
        {
            return false;
        }

        currentCell = cell[0];
    }

    // update aria properties with full context reference, don't focus it yet
    this._setAriaProperties(this. _createActiveObject(currentCell), null, currentCell);

    // the aria-labelledby needs to be different from last time
    // when it's read otherwise the screenreader will not read it
    // therefore, toggle the aria-labelledby with a dummy reference
    subid = this.createSubId("placeHolder");
    needToModify = true;
    labelledBy = currentCell.getAttribute("aria-labelledby");
    if (labelledBy != null && labelledBy.indexOf(subid) != -1)
    {
        needToModify = false;
    }

    // add the reference to dummy subid if needed (see comment above)
    if (needToModify)
    {
        // the dummy div needs to have something (i.e. space or empty string doesn't work)
        this.m_placeHolder.textContent = "&nbsp";
        labelledBy = currentCell.getAttribute("aria-labelledby");
        currentCell.setAttribute("aria-labelledby", labelledBy + ' ' + subid);
    }
    else
    {
        this.m_utils.empty(this.m_placeHolder);
    }

    // focus active cell so the content is read
    currentCell.focus();
    return true;
};

/**
 * Handle a keyboard event when in actionable mode
 * @param {Event} event the keydown event
 * @param {Element} element the cell/header that is acted on
 * @returns {Boolean}
 */
DvtDataGrid.prototype._handleActionableModeKeyDown = function(event, element, isHeader)
{
    var keyCode, target, shiftKey, ctrlKey, focusElems;
    keyCode = event.keyCode;
    shiftKey = event.shiftKey;
    ctrlKey = this.m_utils.ctrlEquivalent(event);
    target = event.target;

    // Esc key goes to navigation mode
    if (keyCode == DvtDataGrid.ESC_KEY)
    {
        this._exitActionableMode();
        // focus back on the active cell
        this._highlightActive();
        return true;
    }
    else if (keyCode === DvtDataGrid.TAB_KEY)
    {
        // check if it's the last element in the cell
        focusElems = this.getFocusableElementsInNode(element);
        if (focusElems.length > 0 && event.target == focusElems[focusElems.length - 1])
        {
            // recycle to first focusable element in the cell
            focusElems[0].focus();
            return true;
        }
        else if (focusElems.length > 0 && event.target == focusElems[0] && shiftKey)
        {
            // recycle to last focusable element in the cell
            focusElems[focusElems.length - 1].focus();
            return true;
        }
    }
    else if (this.isNavigationKey(keyCode) && !ctrlKey)
    {
        // if the target is focusable, do nothing
        if (this._isFocusableElement(target))
        {
            // allow default behavior
            return false;
        }
        // if arrow key is used and there's no focusable element inside the cell
        // it breaks the actionable mode
        if (!this._isContainFocusableElement(element))
        {
            this._exitActionableMode(element);
        }

        if (isHeader)
        {
            return this.handleHeaderArrowKeys(keyCode, event);
        }
        else
        {
            if (this._isSelectionEnabled())
            {
                this._updateStateInfo('accessibleStateSelected');
            }
            return this.handleCellArrowKeys(keyCode, (shiftKey && this.isMultipleSelection()), event);
        }
    }
    return false;
};

/**
 * Enter actionable mode
 * @param {Element} element to set actionable
 * @returns {Boolean} false
 */
DvtDataGrid.prototype._enterActionableMode = function(element)
{
    // focus on first focusable item in the cell
    if (this._setFocusToFirstFocusableElement(element))
    {
        this.setActionableMode(true);

        // enable all focusable elements
        this._enableAllFocusableElements(element);
    }
    return false;
};

/**
 * Exit actionable mode on the active cell if in actionable mode
 * @returns {Boolean} false
 */
DvtDataGrid.prototype._exitActionableMode = function()
{
    var elem;
    if (this.isActionableMode())
    {
        elem = this._getActiveElement();
        this.setActionableMode(false);
        this._disableAllFocusableElements(elem);
    }
};

/**
 * Handles key event for active cell
 * @param {Event} event
 * @return  boolean true if the event was processed
 */
DvtDataGrid.prototype.handleActiveKeyDown = function(event)
{
    var keyCode, target, cell, ctrlKey;

    keyCode = event.keyCode;
    target = event.target;
    cell = this.findCell(target);
    ctrlKey = this.m_utils.ctrlEquivalent(event);

    if (this.isActionableMode())
    {
        return this._handleActionableModeKeyDown(event, cell, false);
    }
    else
    {
        // F2 key or Enter key goes to actionable mode
        if (keyCode == DvtDataGrid.F2_KEY || keyCode == DvtDataGrid.ENTER_KEY)
        {
            return this._enterActionableMode(cell);
        }
        if (this.isNavigationKey(keyCode) && !this.m_utils.ctrlEquivalent(event))
        {
            // we are here when navigation keys are pressed and we are no longer in actionable mode
            return this.handleCellArrowKeys(keyCode, false, event);
        }
    }

    // check keystroke for reading content to screen reader
    if (this.isReadCurrentContent(event))
    {
        return this.readCurrentContent();
    }

    return false;
};

/**
 *
 * @param {number} keyCode
 * @return {boolean}
 */
DvtDataGrid.prototype.isNavigationKey = function(keyCode)
{
    return (this.isArrowKey(keyCode) || keyCode == DvtDataGrid.HOME_KEY || keyCode == DvtDataGrid.END_KEY || keyCode == DvtDataGrid.PAGEUP_KEY || keyCode == DvtDataGrid.PAGEDOWN_KEY);
};

/**
 *
 * @param {number} keyCode
 * @return {boolean}
 */
DvtDataGrid.prototype.isArrowKey = function(keyCode)
{
    return (keyCode == DvtDataGrid.UP_KEY || keyCode == DvtDataGrid.DOWN_KEY || keyCode == DvtDataGrid.LEFT_KEY || keyCode == DvtDataGrid.RIGHT_KEY);
};

/**
 * Creates an index object for the cell/row
 * @param {number=} row - the start index of the range
 * @param {number=} column - the end index of the range.  Optional, if not specified it represents a single cell/row
 * @return {Object} an index object
 */
DvtDataGrid.prototype.createIndex = function(row, column)
{
    if (row != null)
    {
        if (column != null)
        {
            return {"row": row, "column": column};
        }
        return {"row": row};
    }

    return null;
};

/**
 * Handles key event for header
 * @param {Event} event
 * @return  boolean true if the event was processed
 */
DvtDataGrid.prototype.handleHeaderKeyDown = function(event)
{
    var axis, index, elem, keyCode, processed = false, level, ctrlKey, start, end;

    // if no active header, then return
    if (this.m_active['type'] != 'header')
    {
        return;
    }
    axis = this.m_active['axis'];
    index = this.m_active['index'];
    level = this.m_active['level'];
    elem = this._getActiveElement();
    keyCode = event.keyCode;
    ctrlKey = this.m_utils.ctrlEquivalent(event);

    if (this.isActionableMode())
    {
        processed = this._handleActionableModeKeyDown(event, elem, true);
    }
    else if (this.isArrowKey(keyCode) && !ctrlKey)
    {
        processed = this.handleHeaderArrowKeys(keyCode, event);
    }
    else if (keyCode == DvtDataGrid.F2_KEY)
    {
        this._enterActionableMode(elem);
    }
    else if (keyCode == DvtDataGrid.SPACE_KEY)
    {
        // select entire row or column
        if (this._isSelectionEnabled() && this.isMultipleSelection())
        {
            if (axis === "row")
            {
                if (this.m_rowHeaderLevelCount - 1 === level)
                {
                    start = index;
                    end = index;
                }
                else
                {
                    start = this._getAttribute(elem['parentNode'], 'start', true);
                    end = start + this._getAttribute(elem['parentNode'], 'extent', true) - 1;
                }

                //handle the space key in headers
                this._selectEntireRow(start, end, event);

                // announce to screen reader, no need to include context info
                this._setAccInfoText('accessibleRowSelected', {'row': index + 1});

                processed = true;
            }
            else if (axis === "column")
            {
                //should only select column in cell selection mode
                if (this.m_options.getSelectionMode() == 'cell')
                {
                    if (this.m_columnHeaderLevelCount - 1 === level)
                    {
                        start = index;
                        end = index;
                    }
                    else
                    {
                        start = this._getAttribute(elem['parentNode'], 'start', true);
                        end = start + this._getAttribute(elem['parentNode'], 'extent', true) - 1;
                    }

                    //handle the space key in headers
                    this._selectEntireColumn(start, end, event);

                    // announce to screen reader, no need to include context info
                    this._setAccInfoText('accessibleColumnSelected', {'column': index + 1});

                    processed = true;
                }
            }
        }
    }
    else if (keyCode == DvtDataGrid.ENTER_KEY)
    {
        // sort, first check if the column is sortable
        if (elem.getAttribute(this.getResources().getMappedAttribute("sortable")) == "true")
        {
            this._handleKeyboardSort(elem, event);
            //handle the enter key if the header is sortable
            processed = true;
        }
        else
        {
            // enter actionable mode but don't prevent default so the action is taken
            this._enterActionableMode(elem);
        }
    }
    else if (keyCode == DvtDataGrid.PAGEUP_KEY)
    {
        if (axis === 'row')
        {
            // selects the first available row header
            elem = this._getRowHeaderByIndex(0, level);
            this._setActive(elem, event);
            processed = true;
        }
    }
    else if (keyCode == DvtDataGrid.PAGEDOWN_KEY)
    {
        if (axis === 'row')
        {
            // selects the last available row header
            if (!this._isCountUnknown("row") && !this._isHighWatermarkScrolling())
            {
                index = Math.max(0, this.getDataSource().getCount("row") - 1);
            }
            else
            {
                index = Math.max(0, this.m_endRowHeader);
            }
            elem = this._getRowHeaderByIndex(index, level);
            this._setActive(elem, event);
            processed = true;
        }
    }
    else if (keyCode == DvtDataGrid.HOME_KEY)
    {
        if (axis === 'column')
        {
            // selects the first cell of the current row
            elem = this._getColumnHeaderByIndex(0, level);
            this._setActive(elem, event);
            processed = true;
        }
    }
    else if (keyCode == DvtDataGrid.END_KEY)
    {
        if (axis === 'column')
        {
            // selects the last cell of the current row
            if (!this._isCountUnknown("column") && !this._isHighWatermarkScrolling())
            {
                index = Math.max(0, this.getDataSource().getCount("column") - 1);
            }
            else
            {
                index = Math.max(0, this.m_endColHeader);
            }
            // selects the first cell of the current row
            elem = this._getColumnHeaderByIndex(index, level);
            this._setActive(elem, event);
            processed = true;
        }
    }
    // read out on ctrl+alt+5 on headers
    else if (this.isReadCurrentContent(event))
    {
        processed = this.readCurrentContent();
    }
    else
    {
        processed = this._handleCutPasteKeydown(event);
    }
    return processed;
};

/**
 * Handles arrow keys navigation on header
 * @param {number} keyCode description
 * @param {Event} event the DOM event that caused the arrow key
 * @return  boolean true if the event was processed
 */
DvtDataGrid.prototype.handleHeaderArrowKeys = function(keyCode, event)
{
    var axis, index, level, elem, newCellIndex, newElement, newIndex, newLevel, depth;

    // ensure that there's no outstanding fetch requests
    if (!this.isFetchComplete())
    {
        //act like it's processed until we finish the fetch
        return true;
    }

    if (this.getResources().isRTLMode())
    {
        if (keyCode == DvtDataGrid.LEFT_KEY)
        {
            keyCode = DvtDataGrid.RIGHT_KEY;
        }
        else if (keyCode == DvtDataGrid.RIGHT_KEY)
        {
            keyCode = DvtDataGrid.LEFT_KEY;
        }
    }

    axis = this.m_active['axis'];
    index = this.m_active['index'];
    level = this.m_active['level'];
    elem = this._getActiveElement();
    depth = elem != null ? this._getAttribute(elem, 'depth', true) : 1;

    switch (keyCode)
    {
        case DvtDataGrid.LEFT_KEY:
            if (axis === 'column' && index > 0)
            {
                if (this.m_columnHeaderLevelCount === 1)
                {
                    newIndex = index - 1;
                    newElement = elem['previousSibling'];
                    newLevel = level;
                }
                else
                {
                    newElement = this._getColumnHeaderByIndex(index - 1, level);
                    newIndex = newElement != null ? this._getAttribute(newElement['parentNode'], 'start', true) : index - 1;
                    newLevel = newElement != null ? this.getHeaderCellLevel(newElement) : level;
                    if (newIndex < 0)
                    {
                        break;
                    }
                }

                this.scrollToHeader({axis: axis, index: newIndex, level:newLevel});
                this._setActive(newElement, event);
            }
            else if (axis === 'row' && level > 0)
            {
                //moving down a level in the header
                newElement = this._getRowHeaderByIndex(index, level - 1);
                newIndex = this._getAttribute(newElement['parentNode'], 'start', true);
                newLevel = this.getHeaderCellLevel(newElement);
                this.scrollToHeader({axis: axis, index: newIndex, level:newLevel});
                this._setActive(newElement, event);
            }
            break;
        case DvtDataGrid.RIGHT_KEY:
            if (axis === 'row')
            {
                if (level + depth >= this.m_rowHeaderLevelCount)
                {
                    // row header, move to databody
                    // make the first cell of the current row active
                    // no need to scroll since it will be in the viewport
                    newCellIndex = this.createIndex(index, 0);
                    if (this._isSelectionEnabled())
                    {
                        this.selectAndFocus(newCellIndex, event);
                    }
                    else
                    {
                        this._setActiveByIndex(newCellIndex, event);
                    }
                }
                else
                {
                    //moving down a level in the header
                    newElement = this._getRowHeaderByIndex(index, level + depth);
                    newIndex = this._getAttribute(newElement['parentNode'], 'start', true);
                    newLevel = this.getHeaderCellLevel(newElement);
                    this.scrollToHeader({axis: axis, index: newIndex, level:newLevel});
                    this._setActive(newElement, event);
                }
            }
            else
            {
                if (this.m_columnHeaderLevelCount === 1)
                {
                    newIndex = index + 1;
                    newElement = elem['nextSibling'];
                    newLevel = level;
                }
                else
                {
                    if (level === this.m_columnHeaderLevelCount - 1)
                    {
                        newIndex = index + 1;
                        newElement = this._getColumnHeaderByIndex(newIndex, level);
                    }
                    else
                    {
                        newIndex = elem != null ? this._getAttribute(elem['parentNode'], 'start', true) + this._getAttribute(elem['parentNode'], 'extent', true) : index + 1;
                        newElement = this._getColumnHeaderByIndex(newIndex, level);
                    }
                    newLevel = newElement != null ? this.getHeaderCellLevel(newElement) : level;
                }

                if (!(newIndex > this.m_endColHeader && this.m_stopColumnHeaderFetch) && (this._isCountUnknown("column") || newIndex < this.getDataSource().getCount("column")))
                {
                    this.scrollToHeader({axis: axis, index: newIndex, level:newLevel});
                    this._setActive(newElement, event);
                }
            }
            break;
        case DvtDataGrid.UP_KEY:
            if (axis === 'row' && index > 0)
            {
                if (this.m_rowHeaderLevelCount === 1)
                {
                    newIndex = index - 1;
                    newElement = elem['previousSibling'];
                    newLevel = level;
                }
                else
                {
                    if (level === this.m_rowHeaderLevelCount - 1)
                    {
                        newIndex = index - 1;
                        newElement = this._getRowHeaderByIndex(newIndex, level);
                    }
                    else
                    {
                        newElement = this._getRowHeaderByIndex(this._getAttribute(elem['parentNode'], 'start', true) - 1, level);
                        newIndex = newElement != null ? this._getAttribute(newElement['parentNode'], 'start', true) : index - 1;
                    }
                    newLevel = newElement != null ? this.getHeaderCellLevel(newElement) : level;
                    if (newIndex < 0)
                    {
                        break;
                    }
                }
                this.scrollToHeader({axis: axis, index: newIndex, level:newLevel});
                this._setActive(newElement, event);
            }
            else if (axis === 'column' && level > 0)
            {
                //moving down a level in the header
                newElement = this._getColumnHeaderByIndex(index, level - 1);
                newIndex = this._getAttribute(newElement['parentNode'], 'start', true);
                newLevel = this.getHeaderCellLevel(newElement);
                this.scrollToHeader({axis: axis, index: newIndex, level:newLevel});
                this._setActive(newElement, event);
            }
            break;
        case DvtDataGrid.DOWN_KEY:
            if (axis === 'column')
            {
                if (level + depth >= this.m_columnHeaderLevelCount)
                {
                    // column header, move to databody
                    // make the cell of the first row and current column active
                    // no need to scroll since it will be in the viewport
                    newCellIndex = this.createIndex(0, index);
                    if (this._isSelectionEnabled())
                    {
                        this.selectAndFocus(newCellIndex, event);
                    }
                    else
                    {
                        this._setActiveByIndex(newCellIndex, event);
                    }
                }
                else
                {
                    //moving down a level in the header
                    newElement = this._getColumnHeaderByIndex(index, level + depth);
                    newIndex = this._getAttribute(newElement['parentNode'], 'start', true);
                    newLevel = this.getHeaderCellLevel(newElement);
                    this.scrollToHeader({axis: axis, index: newIndex, level:newLevel});
                    this._setActive(newElement, event);
                }
            }
            else
            {
                if (this.m_rowHeaderLevelCount === 1)
                {
                    newIndex = index + 1;
                    newElement = elem['nextSibling'];
                    newLevel = level;
                }
                else
                {
                    if (level === this.m_rowHeaderLevelCount - 1)
                    {
                        newIndex = index + 1;
                        newElement = this._getRowHeaderByIndex(newIndex, level);
                    }
                    else
                    {
                        newIndex = elem != null ? this._getAttribute(elem['parentNode'], 'start', true) + this._getAttribute(elem['parentNode'], 'extent', true) : index + 1;
                        newElement = this._getRowHeaderByIndex(newIndex, level);
                    }
                    newLevel = newElement != null ? this.getHeaderCellLevel(newElement) : level;
                }

                if (!(newIndex > this.m_endRowHeader && this.m_stopRowHeaderFetch) && (this._isCountUnknown("row") || newIndex < this.getDataSource().getCount("row")))
                {
                    this.scrollToHeader({axis: axis, index: newIndex, level:newLevel});
                    this._setActive(newElement, event);
                }
            }
            break;
    }
    return true;
};

/**
 * Get the Id's in a string to put in the accessibility labelledby
 * @param {Element=} header
 * @param {Element=} previousHeader
 * @returns {string}
 */
DvtDataGrid.prototype._getHeaderAndParentIds = function(header, previousHeader)
{
    var i, parents, idString = '', previousParents = [];
    if (header == null)
    {
        // header not rendered
        return '';
    }

    parents = this._getHeaderAndParents(header);
    if (previousHeader != null)
    {
        previousParents = this._getHeaderAndParents(previousHeader);
    }
    for (i = 0; i < parents.length; i++)
    {
        // always add the header that we are focusing
        if (previousParents[i] != parents[i] || i === parents.length - 1)
        {
            idString += ' ' + parents[i]['id'];
        }
    }
    return idString;
};

/**
 * Get the nested headers above the header and including the header.
 * Puts them in an array starting with the outermost.
 * @param {Element} header
 * @returns {Array}
 */
DvtDataGrid.prototype._getHeaderAndParents = function(header)
{
    var axis, level, headerLevels, headers = [header];
    axis = this.getHeaderCellAxis(header);
    level = this.getHeaderCellLevel(header);
    if (axis === 'row')
    {
        headerLevels = this.m_rowHeaderLevelCount;
    }
    else
    {
        headerLevels = this.m_columnHeaderLevelCount;
    }

    if (headerLevels === 1)
    {
        return headers;
    }
    else if (level === headerLevels - 1)
    {
        header = header['parentNode']['firstChild'];
        headers.unshift(header);
        level -= 1;
    }

    while (level > 0)
    {
        header = header['parentNode']['parentNode']['firstChild'];
        headers.unshift(header);
        level -= 1;
    }
    return headers;
};

/**
 * Handles arrow keys navigation on cell
 * @param {number} keyCode description
 * @param {boolean=} isExtend
 * @param {Event} event the DOM event causing the arrow keys
 */
DvtDataGrid.prototype.handleCellArrowKeys = function(keyCode, isExtend, event)
{
    var currentCellIndex, row, column, newCellIndex, focusFunc;

    // ensure that there's no outstanding fetch requests
    if (!this.isFetchComplete())
    {
        //act as if processed to prevent page scrolling before fetch done
        return true;
    }

    if (isExtend)
    {
        currentCellIndex = this.m_selectionFrontier;
    }
    else
    {
        currentCellIndex = this.m_active['indexes'];
    }

    if (currentCellIndex == null)
    {
        return;
    }

    if (this.getResources().isRTLMode())
    {
        if (keyCode == DvtDataGrid.LEFT_KEY)
        {
            keyCode = DvtDataGrid.RIGHT_KEY;
        }
        else if (keyCode == DvtDataGrid.RIGHT_KEY)
        {
            keyCode = DvtDataGrid.LEFT_KEY;
        }
    }

    // invoke different function for handling focusing on active cell depending on whether selection is enabled
    focusFunc = this._isSelectionEnabled() ? this.selectAndFocus.bind(this) : this._setActiveByIndex.bind(this);
    row = currentCellIndex['row'];
    column = currentCellIndex['column'];

    // navigation to cell using arrow keys.  We are using index instead of dom element
    // because the dom element might not be there in all cases
    switch (keyCode)
    {
        case DvtDataGrid.LEFT_KEY:
            if (column > 0)
            {
                // for left and right key in row selection mode, we'll be only shifting active cell and
                // selection will not be affected
                if (this.m_options.getSelectionMode() == "row")
                {
                    // ensure active cell index is used for row since it might use frontier if extended
                    newCellIndex = this.createIndex(this.m_active['indexes']['row'], column - 1);
                    this.scrollToIndex(newCellIndex, isExtend);
                    this._setActiveByIndex(newCellIndex, event);
                }
                else
                {
                    newCellIndex = this.createIndex(row, column - 1);
                    this.scrollToIndex(newCellIndex, isExtend);
                    if (isExtend)
                    {
                        this.extendSelection(newCellIndex, event);
                    }
                    else
                    {
                        focusFunc(newCellIndex, event);
                    }

                    // announce to screen reader that we have reached first column
                    if (column - 1 === 0)
                    {
                        this._setAccInfoText('accessibleFirstColumn');
                    }
                }
            }
            else
            {
                if (!isExtend)
                {
                    this.scrollToHeader({axis: 'row', index: row, level:this.m_rowHeaderLevelCount - 1});
                    // reached the first column, go to row header if available
                    this._setActive(this._getRowHeaderByIndex(row, this.m_rowHeaderLevelCount - 1), event, true);
                }
            }
            break;
        case DvtDataGrid.RIGHT_KEY:
            // if condition for unknown count and known count cases on whether we have reached the end
            if (!this._isLastColumn(column))
            {
                // for left and right key in row selection mode, we'll be only shifting active cell and
                // selection will not be affected
                if (this.m_options.getSelectionMode() == "row")
                {
                    // ensure active cell index is used for row since it might use frontier if extended
                    newCellIndex = this.createIndex(this.m_active['indexes']['row'], column + 1);
                    this.scrollToIndex(newCellIndex, isExtend);
                    this._setActiveByIndex(newCellIndex, event);
                }
                else
                {
                    newCellIndex = this.createIndex(row, column + 1);
                    this.scrollToIndex(newCellIndex, isExtend);
                    if (isExtend)
                    {
                        this.extendSelection(newCellIndex, event);
                    }
                    else
                    {
                        focusFunc(newCellIndex, event);
                    }

                    // announce to screen reader that we have reached last column
                    if (this._isLastColumn(column + 1))
                    {
                        this._setAccInfoText('accessibleLastColumn');
                    }
                }
            }
            else if (!isExtend)
            {
                // if anchor cell is in the last column, and they arrow right (without Shift), then collapse the range to just the focus cell.  (Matches Excel and intuition.)
                focusFunc(currentCellIndex, event);
                this.scrollToIndex(currentCellIndex);
            }
            break;
        case DvtDataGrid.UP_KEY:
            if (row > 0)
            {
                newCellIndex = this.createIndex(row - 1, column);
                this.scrollToIndex(newCellIndex, isExtend);
                if (isExtend)
                {
                    this.extendSelection(newCellIndex, event);
                }
                else
                {
                    focusFunc(newCellIndex, event);
                }

                // announce to screen reader that we have reached first row
                if (row - 1 === 0)
                {
                    this._setAccInfoText('accessibleFirstRow');
                }
            }
            else
            {
                //if in multiple selection don't clear the selection
                if (!isExtend)
                {
                    this.scrollToHeader({axis: 'column', index: column, level:this.m_columnHeaderLevelCount - 1});
                    // reached the first row, go to column header if available
                    this._setActive(this._getColumnHeaderByIndex(column, this.m_columnHeaderLevelCount - 1), event, true);
                }
            }
            break;
        case DvtDataGrid.DOWN_KEY:
            if (!this._isLastRow(row))
            {
                newCellIndex = this.createIndex(row + 1, column);
                this.scrollToIndex(newCellIndex, isExtend);
                if (isExtend)
                {
                    this.extendSelection(newCellIndex, event);
                }
                else
                {
                    focusFunc(newCellIndex, event);
                }

                // announce to screen reader that we have reached last row
                if (this._isLastRow(row + 1))
                {
                    this._setAccInfoText('accessibleLastRow');
                }
            }
            else if (!isExtend)
            {
                // if anchor cell is in the last row, and they arrow down (without Shift), then collapse the range to just the focus cell.  (Matches Excel and intuition.)
                focusFunc(currentCellIndex, event);
                this.scrollToIndex(currentCellIndex);
            }
            break;
        case DvtDataGrid.HOME_KEY:
            // selects the first cell of the current row
            newCellIndex = this.createIndex(row, 0);
            this.scrollToIndex(newCellIndex);
            focusFunc(newCellIndex, event);
            break;
        case DvtDataGrid.END_KEY:
            // selects the last cell of the current row
            if (!this._isCountUnknown("column") && !this._isHighWatermarkScrolling())
            {
                newCellIndex = this.createIndex(row, Math.max(0, this.getDataSource().getCount("column") - 1));
            }
            else
            {
                newCellIndex = this.createIndex(row, Math.max(0, this.m_endCol));
            }
            this.scrollToIndex(newCellIndex);
            focusFunc(newCellIndex, event);
            break;
        case DvtDataGrid.PAGEUP_KEY:
            // selects the first cell of the current column
            newCellIndex = this.createIndex(0, column);
            this.scrollToIndex(newCellIndex);
            focusFunc(newCellIndex, event);
            break;
        case DvtDataGrid.PAGEDOWN_KEY:
            // selects the last cell of the current column
            if (!this._isCountUnknown("column") && !this._isHighWatermarkScrolling())
            {
                newCellIndex = this.createIndex(Math.max(0, this.getDataSource().getCount("row") - 1), column);
            }
            else
            {
                newCellIndex = this.createIndex(Math.max(0, this.m_endRow), column);
            }
            this.scrollToIndex(newCellIndex);
            focusFunc(newCellIndex, event);
            break;
    }

    return true;
};

/**
 * Scrolls to an  index
 * @param {Object} index - the end index of the selection.
 * @param {boolean=} isExtend - true if we should not focus the the new index
 */
DvtDataGrid.prototype.scrollToIndex = function(index, isExtend)
{
    var row, column, deltaX, deltaY, scrollTop, databodyContent, rowElem, viewportTop, viewportBottom,
            rowTop, rowHeight, scrollLeft, cell, cellLeft, cellWidth, viewportLeft, viewportRight, scrollRows;
    row = index['row'];
    column = index['column'];

    deltaX = 0;
    deltaY = 0;

    // check if index is completely outside of rendered
    if (row < this.m_startRow || row > this.m_endRow)
    {
        if (row < this.m_startRow)
        {
            scrollTop = this.m_avgRowHeight * row;
        }
        else
        {
            scrollTop = this.m_avgRowHeight * (row + 1) - this.getElementHeight(this.m_databody);
        }
        deltaY = this.m_currentScrollTop - scrollTop;

        // remember to focus on the row after fetch
        this.m_scrollIndexAfterFetch = index;
        scrollRows = true;
    }
    else
    {
        // it's rendered, find location and scroll to it
        databodyContent = this.m_databody['firstChild'];
        rowElem = databodyContent['childNodes'][row - this.m_startRow];

        viewportTop = this.m_currentScrollTop;
        viewportBottom = this.m_currentScrollTop + this.getElementHeight(this.m_databody);
        rowTop = this.getElementDir(rowElem, 'top');
        rowHeight = this.calculateRowHeight(rowElem);
        if (rowTop + rowHeight > viewportBottom)
        {
            deltaY = viewportBottom - (rowTop + rowHeight);
        }
        else if (rowTop < viewportTop)
        {
            deltaY = viewportTop - rowTop;
        }
    }

    // if column is defined and it's not already a fetch outside of rendered
    // use scrollRows to know it was not pre-defined
    if (!isNaN(column) && scrollRows != true)
    {
        // check if index is completely outside of rendered
        // approximate scroll position
        if (column < this.m_startCol || column > this.m_endCol)
        {
            if (column < this.m_startCol)
            {
                scrollLeft = this.m_avgColWidth * column;
            }
            else
            {
                scrollLeft = this.m_avgColWidth * (column + 1) - this.getElementWidth(this.m_databody);
            }
            deltaX = this.m_currentScrollLeft - scrollLeft;

            // remember to focus on the cell after fetch
            this.m_scrollIndexAfterFetch = index;
        }
        else
        {
            // it's rendered, find location and scroll to it
            databodyContent = this.m_databody['firstChild'];
            rowElem = databodyContent['childNodes'][row - this.m_startRow];
            cell = rowElem['childNodes'][column - this.m_startCol];
            cellLeft = this.getElementDir(cell, 'left');
            cellWidth = this.getElementWidth(cell);

            viewportLeft = this.m_currentScrollLeft;
            viewportRight = this.m_currentScrollLeft + this.getElementWidth(this.m_databody);
            if (cellLeft < viewportLeft)
            {
                deltaX = viewportLeft - cellLeft;
            }
            else if (cellLeft + cellWidth > viewportRight)
            {
                deltaX = viewportRight - (cellLeft + cellWidth);
            }
        }
    }

    // scroll if either horiz or vert scroll pos has changed
    if (deltaX != 0 || deltaY != 0)
    {
        if (cell != null && isExtend !== true)
        {
            // delay focus on cell until databody has scrolled (by the scroll event handler)
            this.m_cellToFocus = cell;
        }
        this.scrollDelta(deltaX, deltaY);
    }//if there's an index we wanted to scroll to after fetch it has now been scrolled to by scrollToIndex, so highlight it
    else if (this.m_scrollIndexAfterFetch != null)
    {
        this._setActiveByIndex(this.m_scrollIndexAfterFetch);
        this.m_scrollIndexAfterFetch = null;
    }
};

/**
 * Scrolls to an  index
 * @param {Object} headerInfo
 * @param {string} headerInfo.axis
 * @param {number} headerInfo.index
 * @param {number} headerInfo.level
 */
DvtDataGrid.prototype.scrollToHeader = function(headerInfo)
{
    var delta, startIndex, endIndex, averageDiff, diff, currentScroll, newScroll, headerMin, headerDiff,
            header, viewportMin, viewportMax, viewportDiff, axis, index, level;
    axis = headerInfo['axis'];
    index = headerInfo['index'];
    level = headerInfo['level'];
    delta = 0;

    if (axis === 'row')
    {
        startIndex = this.m_startRowHeader;
        endIndex = this.m_endRowHeader;
        averageDiff = this.m_avgRowHeight;
        diff = this.getElementHeight(this.m_databody);
        currentScroll = this.m_currentScrollTop;
    }
    else if (axis === 'column')
    {
        startIndex = this.m_startColHeader;
        endIndex = this.m_endColHeader;
        averageDiff = this.m_avgColWidth;
        diff = this.getElementWidth(this.m_databody);
        currentScroll = this.m_currentScrollLeft;
    }
    // check if index is completely outside of rendered
    if (index < startIndex || index > endIndex)
    {
        if (index < startIndex)
        {
            newScroll = averageDiff * index;
        }
        else
        {
            newScroll = averageDiff * (index + 1) - diff;
        }
        delta = currentScroll - newScroll;

        // remember to focus on the row after fetch
        this.m_scrollHeaderAfterFetch = headerInfo;
    }
    else
    {
        if (axis === 'row')
        {
            header = this._getRowHeaderByIndex(index, level);
            viewportMin = this.m_currentScrollTop;
            viewportMax = this.m_currentScrollTop + this.getElementHeight(this.m_databody);
            viewportDiff = viewportMax - viewportMin;
            headerMin = this.getElementDir(header, 'top');
            headerDiff = this.getElementHeight(header);
        }
        else if (axis === 'column')
        {
            header = this._getColumnHeaderByIndex(index, level);
            viewportMin = this.m_currentScrollLeft;
            viewportMax = this.m_currentScrollLeft + this.getElementWidth(this.m_databody);
            viewportDiff = viewportMax - viewportMin;
            headerMin = this.getElementDir(header, 'left');
            headerDiff = this.getElementWidth(header);
        }


        if (viewportDiff > headerDiff)
        {
            if (headerMin + headerDiff > viewportMax)
            {
                delta = viewportMax - (headerMin + headerDiff);
            }
            else if (headerMin < viewportMin)
            {
                delta = viewportMin - headerMin;
            }
        }
        else
        {
            delta = viewportMin - headerMin;
        }
    }

    // scroll if either horiz or vert scroll pos has changed
    if (delta != 0)
    {
        if (header != null)
        {
            // delay focus on cell until databody has scrolled (by the scroll event handler)
            this.m_cellToFocus = header;
        }
        axis === 'row' ? this.scrollDelta(0, delta) : this.scrollDelta(delta, 0);

    }

    //if there's an index we wanted to sctoll to after fetch it has now been scrolled to by scrollToIndex, so highlight it
    if (this.m_scrollHeaderAfterFetch != null && header != null)
    {
        this._setActive(header);
        this.m_scrollHeaderAfterFetch = null;
    }
};

/**
 * Locate the header element.  Look up recursively from its parent if neccessary.
 * @param {Element} elem the starting point to locate the header element
 * @param {string} headerCellClassName the name of the header cell class name
 * @return {Element|null} the header element
 * @private
 */
DvtDataGrid.prototype.findHeader = function(elem, headerCellClassName)
{
    if (headerCellClassName == undefined)
    {
        headerCellClassName = this.getMappedStyle("headercell");
    }

    if (headerCellClassName != null)
    {
        if (this.m_utils.containsCSSClassName(elem, headerCellClassName))
        {
            // found header element
            return elem;
        }
        else if (elem['parentNode'])
        {
            // recursive call with parent node
            return this.findHeader(elem['parentNode'], headerCellClassName);
        }
        else if (elem === this.m_root)
        {
            // short circuit to terminal when root is reached
            return null;
        }
    }

    // all other case returns null
    return null;
};

/**
 * Ensures row banding is set on the proper rows
 * @private
 */
DvtDataGrid.prototype.updateRowBanding = function()
{
    var rowBandingInterval, rows, i, index, bandingClass;
    rowBandingInterval = this.m_options.getRowBandingInterval();
    if (rowBandingInterval > 0)
    {
        rows = this.m_databody['firstChild']['childNodes'];
        bandingClass = this.getMappedStyle("banded");
        for (i = 0; i < rows.length; i++)
        {
            index = this.m_startRow + i;
            if ((Math.floor(index / rowBandingInterval) % 2 === 1))
            {
                if (!this.m_utils.containsCSSClassName(rows[i], bandingClass))
                {
                    this.m_utils.addCSSClassName(rows[i], bandingClass);
                }
            }
            else
            {
                if (this.m_utils.containsCSSClassName(rows[i], bandingClass))
                {
                    this.m_utils.removeCSSClassName(rows[i], bandingClass);
                }
            }
        }
    }
};

/**
 * Ensures column banding is set on the proper rows
 * @private
 */
DvtDataGrid.prototype.updateColumnBanding = function()
{
    var columnBandingInterval, rows, i, index, bandingClass, j, row;
    columnBandingInterval = this.m_options.getColumnBandingInterval();
    if (columnBandingInterval > 0)
    {
        rows = this.m_databody['firstChild']['childNodes'];
        bandingClass = this.getMappedStyle("banded");
        for (i = 0; i < rows.length; i += 1)
        {
            row = rows[i]['childNodes'];
            for (j = 0; j < row.length; j += 1)
            {
                index = this.m_startCol + j;
                if ((Math.floor(index / columnBandingInterval) % 2 === 1))
                {
                    if (!this.m_utils.containsCSSClassName(row[j], bandingClass))
                    {
                        this.m_utils.addCSSClassName(row[j], bandingClass);
                    }
                }
                else
                {
                    if (this.m_utils.containsCSSClassName(row[j], bandingClass))
                    {
                        this.m_utils.removeCSSClassName(rows[j], bandingClass);
                    }
                }
            }
        }
    }
};

/**
 * Remove banding (both row and column)
 * @private
 */
DvtDataGrid.prototype._removeBanding = function()
{
    var rows, row, i, j, bandingClass;
    rows = this.m_databody['firstChild']['childNodes'];
    bandingClass = this.getMappedStyle("banded");
    for (i = 0; i < rows.length; i++)
    {
        if (this.m_utils.containsCSSClassName(rows[i], bandingClass))
        {
            this.m_utils.removeCSSClassName(rows[i], bandingClass);
        }
        row = rows[i]['childNodes'];
        for (j = 0; j < row.length; j += 1)
        {
            if (this.m_utils.containsCSSClassName(row[j], bandingClass))
            {
                this.m_utils.removeCSSClassName(row[j], bandingClass);
            }
        }
    }
};

/**
 * Sets the accessibility status text
 * @param {string} key the message key
 * @param {Object|Array|null} args to pass into the translator
 * @private
 */
DvtDataGrid.prototype._setAccInfoText = function(key, args)
{
    var text = this.getResources().getTranslatedText(key, args);
    if (text != null)
    {
        this.m_accInfo.textContent = text;
    }
};

/**
 * Handles expand event from the flattened datasource.
 * @param {Object} event the expand event
 * @private
 */
DvtDataGrid.prototype.handleExpandEvent = function(event)
{
    var row, rowKey;
    rowKey = event['rowKey'];
    row = this._findRowByKey(rowKey);
    row.setAttribute("aria-expanded", true);

    // update screen reader alert
    this._setAccInfoText("accessibleRowExpanded");
    this.populateAccInfo();
};

/**
 * Handles collapse event from the flattened datasource.
 * @param {Object} event the collapse event
 * @private
 */
DvtDataGrid.prototype.handleCollapseEvent = function(event)
{
    var row, rowKey;
    rowKey = event['rowKey'];
    row = this._findRowByKey(rowKey);
    row.setAttribute("aria-expanded", false);

    // update screen reader alert
    this._setAccInfoText("accessibleRowCollapsed");
    this.populateAccInfo();
};

/**
 * Set the key on an element.
 * @param {Element} element the element to get key of
 * @param {Object|string|number} key the key to set
 * @private
 */
DvtDataGrid.prototype._setKey = function(element, key)
{
    if (element != null)
    {
        element[this.getResources().getMappedAttribute('key')] = key;
    }
};

/**
 * Retrieve the key from an element.
 * @param {Element} element the element to retrieve the key from.
 * @return {string|null} the key of the element
 * @private
 */
DvtDataGrid.prototype._getKey = function(element)
{
    if (element != null)
    {
        return element[this.getResources().getMappedAttribute('key')];
    }
    return null;
};

/**
 * Retrieve the active row key.
 * @param {boolean=} prev if we want the previous row key instead
 * @return {string|null} the key of the active row
 * @private
 */
DvtDataGrid.prototype._getActiveRowKey = function(prev)
{
    if (prev && this.m_prevActive != null)
    {
        if (this.m_prevActive['type'] == 'header' && this.m_prevActive['axis'] === 'row')
        {
            return this.m_prevActive['key'];
        }
        else if (this.m_prevActive['type'] == 'cell')
        {
            return this.m_prevActive['keys']['row'];
        }
    }
    else if (this.m_active != null)
    {
        if (this.m_active['type'] == 'header' && this.m_active['axis'] === 'row')
        {
            return this.m_active['key'];
        }
        else if (this.m_active['type'] == 'cell')
        {
            return this.m_active['keys']['row'];
        }
    }
    return null;
};

/**
 * Retrieve the active row.
 * @return {Element|null} the active row
 * @private
 */
DvtDataGrid.prototype._getActiveRow = function()
{
    if (this.m_active != null)
    {
        return this._findRowByKey(this.m_active['keys']['row']);
    }
    return null;
};

///////////////////// move methods////////////////////////
/**
 * Handles cut event from the flattened datasource.
 * @param {Object} event the cut event
 * @return {boolean} true if the event was processed here
 * @private
 */
DvtDataGrid.prototype._handleCutPasteKeydown = function(event)
{
    //make sure that move is allowed to the row
    if (this._isMoveOnRowEnabled(this.findRow(event['target'])))
    {
        if (event.keyCode == DvtDataGrid.X_KEY && this.m_utils.ctrlEquivalent(event))
        {
            return this._handleCut(event);
        }
        else if (event.keyCode == DvtDataGrid.V_KEY && this.m_utils.ctrlEquivalent(event))
        {
            return this._handlePaste(event);
        }
        else if (event.keyCode == DvtDataGrid.ESC_KEY && this.m_cutRow != null)
        {
            this.m_utils.removeCSSClassName(this.m_cutRow, this.getMappedStyle('cut'));
            this.m_cutRow = null;
            if (this.m_cutRowHeader !== null)
            {
                this.m_utils.removeCSSClassName(this.m_cutRowHeader, this.getMappedStyle('cut'));
                this.m_cutRowHeader = null;
            }
            return true;
        }
    }
    return false;
};

/**
 * Handles cut event from the flattened datasource.
 * @param {Object} event the cut event
 * @param {Element} target the target element
 * @return {boolean} true if the event was processed here
 * @private
 */
DvtDataGrid.prototype._handleCut = function(event, target)
{
    var rowKey;
    if (target == null)
    {
        target = event.target;
    }
    if (this.m_cutRow != null)
    {
        this.m_utils.removeCSSClassName(this.m_cutRow, this.getMappedStyle('cut'));
    }
    rowKey = this._getKey(this.find(target, 'row'));
    //cut row header with row
    this.m_cutRow = this._findRowByKey(rowKey);
    this.m_cutRowHeader = this._findRowHeaderByKey(rowKey);
    this.m_utils.addCSSClassName(this.m_cutRow, this.getMappedStyle('cut'));
    if (this.m_cutRowHeader !== null)
    {
        this.m_utils.addCSSClassName(this.m_cutRowHeader, this.getMappedStyle('cut'));
    }
    return true;
};

/**
 * Handles cut event from the flattened datasource.
 * @param {Object} event the cut event
 * @param {Element} target the target element
 *
 * @private
 */
DvtDataGrid.prototype._handlePaste = function(event, target)
{
    var row;
    if (target == null)
    {
        target = event.target;
    }
    if (this.m_cutRow != null)
    {
        this.m_utils.removeCSSClassName(this.m_cutRow, this.getMappedStyle('cut'));
        if (this.m_cutRowHeader !== null)
        {
            //remove css from row header too
            this.m_utils.removeCSSClassName(this.m_cutRowHeader, this.getMappedStyle('cut'));
        }
        row = this.find(target, 'row');
        if (this.m_cutRow !== row)
        {
            if (this._isSelectionEnabled())
            {
                // unhighlight and clear selection
                this._clearSelection();
            }
            if (this._isDatabodyCellActive())
            {
                this._unhighlightActive();
            }
            this.m_moveActive = true;
            this.getDataSource().move(this._getKey(this.m_cutRow), this._getKey(row));
        }
        this.m_cutRow = null;
        return true;
    }
    return false;
};

/**
 * Handles cut event from the flattened datasource.
 * @param {Object} event the cut event
 * @private
 */
DvtDataGrid.prototype._handleMove = function(event)
{
    var deltaY, height, rowKey;
    //initialize the move
    if (this.m_moveRow == null)
    {
        //get the move row key to set the move row/rowHeader
        rowKey = this._getKey(this.find(event.target, 'row'));
        this.m_moveRow = this._findRowByKey(rowKey);
        this.m_moveRowHeader = this._findRowHeaderByKey(rowKey);

        //need to store the height inline if not already because top values will be changing
        if (this.m_moveRow['style']['height'] != null)
        {
            this.setElementHeight(this.m_moveRow, this.calculateRowHeight(this.m_moveRow));
        }

        //add the move style class to the css
        this.m_utils.addCSSClassName(this.m_moveRow, this.getMappedStyle('drag'));
        this.m_originalTop = this.getElementDir(this.m_moveRow, 'top');

        this.m_dropTarget = document.createElement("div");
        this.m_utils.addCSSClassName(this.m_dropTarget, this.getMappedStyle('drop'));
        this.setElementHeight(this.m_dropTarget, this.calculateRowHeight(this.m_moveRow));
        this.setElementDir(this.m_dropTarget, this.m_originalTop, 'top');
        this.m_databody['firstChild'].appendChild(this.m_dropTarget); //@HTMLUpdateOK

        //if there is a move row header add a drop target there and set appropriate styles
        if (this.m_moveRowHeader !== null)
        {
            //need to store the height inline if not already because top values will be changing
            if (this.m_moveRowHeader['style']['height'] != null)
            {
                this.setElementHeight(this.m_moveRowHeader, this.calculateRowHeight(this.m_moveRowHeader));
            }
            this.m_utils.addCSSClassName(this.m_moveRowHeader, this.getMappedStyle('drag'));
            this.m_dropTargetHeader = document.createElement("div");
            this.m_utils.addCSSClassName(this.m_dropTargetHeader, this.getMappedStyle('drop'));
            this.setElementHeight(this.m_dropTargetHeader, this.calculateRowHeight(this.m_moveRowHeader));
            this.setElementDir(this.m_dropTargetHeader, this.m_originalTop, 'top');
            this.m_rowHeader['firstChild'].appendChild(this.m_dropTargetHeader); //@HTMLUpdateOK
        }
    }

    //calculate the change in Y direction
    if (!this.m_utils.isTouchDevice())
    {
        this.m_prevY = this.m_currentY;
        this.m_currentY = event['pageY'];
    }
    deltaY = this.m_currentY - this.m_prevY;
    height = this.calculateRowHeight(this.m_moveRow);

    //adjust the top height of the moveRow and moveRowHeader
    this.setElementDir(this.m_moveRow, (this.getElementDir(this.m_moveRow, 'top') + deltaY), 'top');
    if (this.m_moveRowHeader !== null)
    {
        this.setElementDir(this.m_moveRowHeader, (this.getElementDir(this.m_moveRowHeader, 'top') + deltaY), 'top');
    }

    //see if the element has crossed the halfway point of the nextSibling
    if (this.m_moveRow['nextSibling'] != null && this.m_moveRow['nextSibling'] != this.m_dropTarget &&
            this.getElementDir(this.m_moveRow['nextSibling'], 'top') < (this.getElementDir(this.m_moveRow, 'top') + (height / 2)))
    {
        this._moveDropRows('nextSibling');
    }
    else if (this.m_moveRow['previousSibling'] != null &&
            this.getElementDir(this.m_moveRow['previousSibling'], 'top') > (this.getElementDir(this.m_moveRow, 'top') - (height / 2)))
    {
        this._moveDropRows('previousSibling');
    }
};

/**
 * Determined if move is supported for the specified axis.
 * @param {string} sibling nextSibling/previosusSibling
 * @private
 */
DvtDataGrid.prototype._moveDropRows = function(sibling)
{
    var newTop, databodyScroller, newSiblingTop, headerScroller;
    databodyScroller = this.m_moveRow['parentNode'];
    //move the drop target and the adjacent row
    if (sibling == 'nextSibling')
    {
        newTop = this.m_originalTop + this.calculateRowHeight(this.m_moveRow[sibling]);
        newSiblingTop = this.m_originalTop;
    }
    else
    {
        newTop = this.getElementDir(this.m_moveRow[sibling], 'top');
        newSiblingTop = newTop + this.calculateRowHeight(this.m_moveRow);
    }

    this.setElementDir(this.m_dropTarget, newTop, 'top');
    this.setElementDir(this.m_moveRow[sibling], newSiblingTop, 'top');
    if (this.m_moveRowHeader !== null)
    {
        headerScroller = this.m_moveRowHeader['parentNode'];
        this.setElementDir(this.m_dropTargetHeader, newTop, 'top');
        this.setElementDir(this.m_moveRowHeader[sibling], newSiblingTop, 'top');
    }

    //store the new top value
    this.m_originalTop = newTop;

    this.m_utils.removeCSSClassName(this.m_moveRow['previousSibling'], this.getMappedStyle('activedrop'));

    //move the moveRow and rowHeader so we can continue to pull the adjacent header
    if (sibling === 'nextSibling')
    {
        databodyScroller.insertBefore(this.m_moveRow, this.m_moveRow[sibling][sibling]); //@HTMLUpdateOK
        if (this.m_moveRowHeader !== null)
        {
            headerScroller.insertBefore(this.m_moveRowHeader, this.m_moveRowHeader[sibling][sibling]); //@HTMLUpdateOK
        }
    }
    else
    {
        databodyScroller.insertBefore(this.m_moveRow, this.m_moveRow[sibling]); //@HTMLUpdateOK
        if (this.m_moveRowHeader !== null)
        {
            headerScroller.insertBefore(this.m_moveRowHeader, this.m_moveRowHeader[sibling]); //@HTMLUpdateOK
        }
    }
    this.m_utils.addCSSClassName(this.m_moveRow['previousSibling'], this.getMappedStyle('activedrop'));
};

/**
 * Determined if move is supported for the specified axis.
 * @param {string} axis the axis which we check whether move is supported.
 * @private
 */
DvtDataGrid.prototype._isMoveEnabled = function(axis)
{
    var capability, moveable;
    capability = this.getDataSource().getCapability("move");
    moveable = this.m_options.isMoveable('row');
    if (moveable === "enable" && (capability === "full" || capability === axis))
    {
        return true;
    }

    return false;
};

/**
 * Handles a mouse up after move
 * @param {Event} event MouseUp Event
 * @param {boolean} validUp true if in the databody or rowHeader
 * @private
 */
DvtDataGrid.prototype._handleMoveMouseUp = function(event, validUp)
{
    if (this.m_moveRow != null)
    {
        //remove the the drop target div from the databody/rowHeader
        this._remove(this.m_dropTarget);
        this.m_moveRow['style']['zIndex'] = '';
        if (this.m_moveRowHeader !== null)
        {
            this._remove(this.m_dropTargetHeader);
            this.m_moveRowHeader['style']['zIndex'] = '';
        }
        if (this.m_active != null && this.m_active['axis'] != 'column')
        {
            this.m_moveActive = true;
        }

        //clear selection
        if (this._isSelectionEnabled())
        {
            // unhighlight and clear selection
            this._clearSelection();
        }

        //if the mousup was in the rowHeader or databody
        if (validUp == true)
        {
            this.getDataSource().move(this._getKey(this.m_moveRow), this.m_moveRow['nextSibling'] === null ? null : this._getKey(this.m_moveRow['nextSibling']));
        }
        else
        {
            this.getDataSource().move(this._getKey(this.m_moveRow), this._getKey(this.m_moveRow));
        }
        this.m_moveRow = null;
        this.m_databodyMove = false;
    }
};

/**
 * Check if a row can be moved, meaning it is the active row and move is enabled
 * @param {Element|null} row the row to move
 * @returns {Boolean} true if the row can be moved
 */
DvtDataGrid.prototype._isMoveOnRowEnabled = function(row)
{
    //make sure it is not row in the column header/null
    if (row == null || this.m_utils.containsCSSClassName(row['parentNode'], this.getMappedStyle('colheader')))
    {
        return false;
    }
    if (this._isMoveEnabled('row'))
    {
        if (this._getActiveRowKey() === this._getKey(row))
        {
            return true;
        }
    }
    return false;
};

/**
 * Applies the draggable class to the new active row and row header, removes it if the active has changed
 */
DvtDataGrid.prototype._manageMoveCursor = function()
{
    var className, activeKey, prevActiveKey, activeRow, prevActiveRow, activeRowHeader, prevActiveRowHeader;
    className = this.getMappedStyle('draggable');
    activeKey = this._getActiveRowKey();
    prevActiveKey = this._getActiveRowKey(true);
    activeRow = this._findRowByKey(activeKey);
    prevActiveRow = this._findRowByKey(prevActiveKey);

    //remove draggable class name
    if (this.m_utils.containsCSSClassName(prevActiveRow, className))
    {
        this.m_utils.removeCSSClassName(prevActiveRow, className);
        prevActiveRowHeader = this._findRowHeaderByKey(prevActiveKey);
        if (this.m_utils.containsCSSClassName(prevActiveRowHeader, className))
        {
            this.m_utils.removeCSSClassName(prevActiveRowHeader, className);
        }
    }

    //if move enabled and draggable class name
    if (this._isMoveOnRowEnabled(activeRow))
    {
        activeRowHeader = this._findRowHeaderByKey(activeKey);
        this.m_utils.addCSSClassName(activeRow, className);
        this.m_utils.addCSSClassName(activeRowHeader, className);
    }
};

/**
 * Handles focus on the root and its children by setting focus class on the root
 * @param {Event} event
 */
DvtDataGrid.prototype.handleRootFocus = function(event)
{
    var newCellIndex;
    this.m_utils.addCSSClassName(this.m_root, this.getMappedStyle('focus'));

    // if nothing is active, and came from the outside of the datagrid, activate first cell
    if (!this.m_root.contains(document.activeElement) || (document.activeElement === this.m_root && this.m_root.tabIndex == 0))
    {
        this.m_externalFocus = true;
        if (this.m_active == null && !this._databodyEmpty())
        {
            newCellIndex = this.createIndex(0, 0);

            // make sure it's visible
            this.scrollToIndex(newCellIndex);

            // select or focus it
            if (this._isSelectionEnabled())
            {
                this.selectAndFocus(newCellIndex, event);
            }
            else
            {
                this._setActiveByIndex(newCellIndex);
            }
        }
        else if (this.m_active != null)
        {
            this._highlightActive();
        }
    }
    this.m_root.tabIndex = -1;
};

/**
 * Handles blur on the root and its children by removing focus class on the root
 * @param {Event} event
 */
DvtDataGrid.prototype.handleRootBlur = function(event)
{
    var active;
    // There is no cross-browser way to tell if the whole grid is out of focus on blur today.
    // document.activeElement returns null in chrome and firefox on blur events.
    // relatedTarget doesn't return a value in firefox and IE though there a tickets to fix.
    // We could implement a non-timeout solution that exiting and re-entering
    // the grid via tab key would not read the summary text upon re-entry (initial would work)
    setTimeout(function(){
        if (!this.m_root.contains(document.activeElement))
        {
            this.m_root.tabIndex = 0;
            active = this._getActiveElement();
            if (active != null)
            {
                this._unsetAriaProperties(active);
            }
        }
    }.bind(this), 100);

    //don't change the color on move
    if (this.m_moveRow == null)
    {
        this.m_utils.removeCSSClassName(this.m_root, this.getMappedStyle('focus'));
    }
};

/**
 * Calculate the a row's height using top or endRowPixel
 * @param {Element} row the row to calculate height on
 * @return {number} the row height
 */
DvtDataGrid.prototype.calculateRowHeight = function(row)
{
    if (row['style']['height'] != '')
    {
        return this.getElementHeight(row);
    }
    if (row['nextSibling'] != null)
    {
        return this.getElementDir(row['nextSibling'], 'top') - this.getElementDir(row, 'top');
    }
    return this.m_endRowPixel - this.getElementDir(row, 'top');
};

/**
 * Calculate the a row headers's height using top or endRowHeaderPixel
 * @param {Element} rowHeader the rowHeader to calculate height on
 * @return {number} the rowHeader height
 */
DvtDataGrid.prototype.calculateRowHeaderHeight = function(rowHeader)
{
    if (rowHeader['style']['height'] != '')
    {
        return this.getElementHeight(rowHeader);
    }
    if (rowHeader['nextSibling'] != null)
    {
        return this.getElementDir(rowHeader['nextSibling'], 'top') - this.getElementDir(rowHeader, 'top');
    }
    return this.m_endRowHeaderPixel - this.getElementDir(rowHeader, 'top');
};

/**
 * Calculate the a column's width using left/right or endColumnPixel
 * @param {Element} cell the cell to calculate width on
 * @return {number} the cell width
 */
DvtDataGrid.prototype.calculateColumnWidth = function(cell)
{
    if (cell['style']['width'] != '')
    {
        return this.getElementWidth(cell);
    }
    var dir = this.getResources().isRTLMode() ? "right" : "left";
    if (cell['nextSibling'] != null)
    {
        return this.getElementDir(cell['nextSibling'], dir) - this.getElementDir(cell, dir);
    }
    return this.m_endColPixel - this.getElementDir(cell, dir);
};

/**
 * Calculate the a column headers's width using left/right or endColumnHeaderPixel
 * @param {Element} columnHeader the columnHeader to calculate width on
 * @return {number} the columnHeader width
 */
DvtDataGrid.prototype.calculateColumnHeaderWidth = function(columnHeader)
{
    if (columnHeader['style']['width'] != '')
    {
        return this.getElementWidth(columnHeader);
    }
    var dir = this.getResources().isRTLMode() ? "right" : "left";
    if (columnHeader['nextSibling'] != null)
    {
        return this.getElementDir(columnHeader['nextSibling'], dir) - this.getElementDir(columnHeader, dir);
    }
    return this.m_endColHeaderPixel - this.getElementDir(columnHeader, dir);
};

/**
 * @return {boolean} true if the databody is empty
 */
DvtDataGrid.prototype._databodyEmpty = function()
{
    if (this.m_databody['firstChild'] == null)
    {
        return true;
    }
    return false;
};

/**
 * Change or add CSS property of element
 * @param {Element} target the element to which css property will be added
 * @param {string} prop the style property name
 * @param {string} value the value of css property
 * @param {string} action the flag variable if it is require to remove css property
 * @private
 */
DvtDataGrid.prototype.changeStyleProperty = function(target, prop, value, action)
{
    if (typeof prop != "undefined")
    {
        target.style[prop] = (action == "remove") ? "" : value;
    }
};

/**
 * Add set of required animation rules to the element
 * @param {Element} target the element to which animation rules will be added
 * @param {number} duration the duration of animation
 * @param {number} delay the delay of animation
 * @param {string} timing the easing function
 * @param {number} x the final position (in pixels) of the current animation
 * @param {number} y the final position (in pixels) of the current animation
 * @param {number} z the final position (in pixels) of the current animation
 * @private
 */
DvtDataGrid.prototype.addTransformMoveStyle = function(target, duration, delay, timing, x, y, z)
{
    this.changeStyleProperty(target, this.getCssSupport('transition-delay'), delay);
    this.changeStyleProperty(target, this.getCssSupport('transition-timing-function'), timing);
    this.changeStyleProperty(target, this.getCssSupport('transition-duration'), duration);
    this.changeStyleProperty(target, this.getCssSupport('transform'), 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)');
};

/**
 * Add set of required animation rules to the element
 * @param {Element} target the element to which animation rules will be added
 * @private
 */
DvtDataGrid.prototype.removeTransformMoveStyle = function(target)
{
    this.changeStyleProperty(target, this.getCssSupport('transition-delay'), null, 'remove');
    this.changeStyleProperty(target, this.getCssSupport('transition-timing-function'), null, 'remove');
    this.changeStyleProperty(target, this.getCssSupport('transition-duration'), null, 'remove');
    this.changeStyleProperty(target, this.getCssSupport('transform'), null, 'remove');
};

/**
 * Check if CSS property is supported by appropriate vendors
 * @param {string} cssprop css property
 * @return {string} css property with appropiate vendor's prefix
 * @private
 */
DvtDataGrid.prototype.getCssSupport = function(cssprop)
{
    var vendors, root, i, css3mc;

    vendors = ['', '-moz-', '-webkit-', '-o-', '-ms-', '-khtml-'];
    root = document.documentElement;

    function toCamel(str)
    {
        return str.replace(/\-([a-z])/gi, function(match, val)
        {
            // convert first letter after "-" to uppercase
            return val.toUpperCase();
        });
    }

    for (i = 0; i < vendors.length; i++)
    {
        css3mc = toCamel(vendors[i] + cssprop);
        // if property starts with 'Ms'
        if (css3mc.substr(0, 2) == 'Ms')
        {
            // Convert 'M' to lowercase
            css3mc = 'm' + css3mc.substr(1);
        }
        if (css3mc in root.style)
        {
            return css3mc;
        }
    }

    return undefined;
};

/**
 * @preserve Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

// constants for key codes
DvtDataGrid.ENTER_KEY = 13;
DvtDataGrid.ESC_KEY = 27;
DvtDataGrid.F2_KEY = 113;
DvtDataGrid.F8_KEY = 119;
DvtDataGrid.SPACE_KEY = 32;

/**
 * Checks whether there are any focusable element inside a cell
 * @param {Element} elem the element to check focus inside
 * @return {boolean}
 */
DvtDataGrid.prototype._isContainFocusableElement = function(elem)
{
    var elems = this.getFocusableElementsInNode(elem);
    return (elems.length > 0);
};

/**
 * Unhighlights the selection.  Does not change selection, focus cell, anchor, or frontier
 */
DvtDataGrid.prototype.unhighlightSelection = function()
{
    var i, ranges;
    ranges = this.GetSelection();
    for (i = 0; i < ranges.length; i += 1)
    {
        this.unhighlightRange(ranges[i]);
    }
};

/**
 * Unhighlights the range.
 * @param {Object} range
 */
DvtDataGrid.prototype.unhighlightRange = function(range)
{
    var elems = this.getElementsInRange(range);
    this.unhighlightElems(elems);
};

/**
 * Highlights the range.
 * @param {Object} range
 * @param {boolean=} updateAccInfo
 */
DvtDataGrid.prototype.highlightRange = function(range, updateAccInfo)
{
    var elems, count;

    elems = this.getElementsInRange(range);
    this.highlightElems(elems);

    if (updateAccInfo)
    {
        // if there's islands of cells, then we'll have to count them
        if (this.GetSelection().length == 1)
        {
            count = elems.length;
        }
        else
        {
            count = this._getCurrentSelectionCellCount();
        }
        this._setAccInfoText('accessibleMultiCellSelected', {'num': count});
    }
};

/**
 * Calculate the total number of cells within the current selection ranges.
 * @private
 */
DvtDataGrid.prototype._getCurrentSelectionCellCount = function()
{
    var total, selection, elems, i;

    total = 0;
    selection = this.GetSelection();
    for (i = 0; i < selection.length; i++)
    {
        // count the number of elements in each selection range
        elems = this.getElementsInRange(selection[i]);
        total = total + elems.length;
    }

    return total;
};

/**
 * Unhighlight elements
 * @param {Array} elems
 */
DvtDataGrid.prototype.unhighlightElems = function(elems)
{
    var i, elem;
    if (elems == null || elems.length == 0)
    {
        return;
    }

    for (i = 0; i < elems.length; i += 1)
    {
        elem = elems[i];
        this._unhighlightElement(elem, ['selected']);
    }
};

/**
 * Highlight elements
 * @param {Array} elems
 */
DvtDataGrid.prototype.highlightElems = function(elems)
{
    var i, elem;
    if (elems == null || elems.length == 0)
    {
        return;
    }

    for (i = 0; i < elems.length; i += 1)
    {
        elem = elems[i];
        this._highlightElement(elem, ['selected']);
    }
};

/**
 * Apply current selection to a range.  This is called when a newly set of cells are
 * rendered and selection needs to be applied on them.
 * @param {number} startRow
 * @param {number} endRow
 * @param {number} startCol
 * @param {number} endCol
 */
DvtDataGrid.prototype.applySelection = function(startRow, endRow, startCol, endCol)
{
    var i, ranges, elems;
    ranges = this.GetSelection();
    for (i = 0; i < ranges.length; i += 1)
    {
        elems = this.getElementsInRange(ranges[i], startRow, endRow, startCol, endCol);
        this.highlightElems(elems);
    }
};

/**
 * Handles click and drag to select multiple cells/rows
 * @param {Event} event
 */
DvtDataGrid.prototype.handleDatabodySelectionDrag = function(event)
{
    var index, cell;

    if (this.m_utils.isTouchDevice())
    {
        cell = this.findCell(document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY));
    }
    else
    {
        cell = this.findCell(event.target);
    }

    if (cell != null)
    {
        index = {
            "row": this.getRowIndex(cell['parentNode']), "column": this.getCellIndex(cell)
        };
        this.extendSelection(index, event);
    }

};

/**
 * Checks whether a cell is selected.  This is used in touch logic in handleDatabodyClickSelection.
 * @param {Element} cell the cell element
 * @return {boolean} true if the cell is selected, false otherwise.
 * @private
 */
DvtDataGrid.prototype._isSelected = function(cell)
{
    var selectedClassName = this.getMappedStyle("selected");
    //if row selection, selection is set on the row, not the cell
    if (this.m_options.getSelectionMode() == "row" && selectedClassName != null)
    {
        return this.m_utils.containsCSSClassName(this.findRow(cell), selectedClassName);
    }
    if (selectedClassName != null)
    {
        return this.m_utils.containsCSSClassName(cell, selectedClassName);
    }

    // should not end up here
    return false;
};

/**
 * Deselect a cell/row.  This is used in touch logic in handleDatabodyClickSelection.
 * @param {Object} index the cell index of the cell/row to deselect
 * @private
 */
DvtDataGrid.prototype._deselect = function(index)
{
    var rowIndex, columnIndex, indexToRemove, ranges, i, range, startIndex, endIndex, rangeStartRow,
            rangeEndRow, rangeStartColumn, rangeEndColumn;

    if (this.m_options.getSelectionMode() == "row")
    {
        // drop the column index
        index = this.createIndex(index['row']);
    }

    rowIndex = index['row'];
    columnIndex = index['column'];

    // find the range in current selection
    indexToRemove = -1;
    ranges = this.GetSelection();
    for (i = 0; i < ranges.length; i += 1)
    {
        range = ranges[i];
        startIndex = range['startIndex'];
        endIndex = this.getEndIndex(range);

        rangeStartRow = startIndex['row'];
        rangeEndRow = endIndex['row'];

        if (rangeStartRow != rowIndex || rangeEndRow != rowIndex)
        {
            continue;
        }

        if (!isNaN(startIndex['column']) && !isNaN(endIndex['column']))
        {
            rangeStartColumn = startIndex['column'];
            rangeEndColumn = endIndex['column'];

            if (rangeStartColumn != columnIndex || rangeEndColumn != columnIndex)
            {
                continue;
            }

            // both row and column index matches, we are done
            indexToRemove = i;
            break;
        }
        else
        {
            // if column index is defined in index, skip this range
            if (!isNaN(columnIndex))
            {
                continue;
            }

            // no column index, and row matches
            indexToRemove = i;
            break;
        }
    }

    // unhighlight index and remove from selection
    if (indexToRemove != -1)
    {
        this.unhighlightRange(ranges[indexToRemove]);
        ranges.splice(indexToRemove, 1);
    }
};

/**
 * Handles click to select multiple cells/rows
 * @param {Event} event
 */
DvtDataGrid.prototype.handleDatabodyClickSelection = function(event)
{
    var index, cell, ctrlKey, shiftKey;

    cell = this.findCell(event.target);
    if (cell != null)
    {
        index = {
            "row": this.getRowIndex(cell['parentNode']), "column": this.getCellIndex(cell)
        };
    }

    if (index != null && index != undefined)
    {
        if (this.isMultipleSelection() && event.button === 2 && this._isContainSelection(index))
        {
            //if right click and inside multiple selection do not change anything
            return;
        }

        // make sure the cell is visible
        this.scrollToIndex(index);

        ctrlKey = this.m_utils.ctrlEquivalent(event);
        shiftKey = event.shiftKey;
        if (this.isMultipleSelection())
        {
            if (this.m_utils.isTouchDevice())
            {
                //remove the touch affordance on a new tap, unhighlight the active cell, and select the new one
                this._removeTouchSelectionAffordance();
                if (this.m_active != null)
                {
                    this._unhighlightActive();
                }
                this.selectAndFocus(index, event, false);
            }
            else
            {
                if (!ctrlKey && !shiftKey)
                {
                    this.selectAndFocus(index, event, false);
                }
                else if (!ctrlKey && shiftKey)
                {
                    this.extendSelection(index, event);
                    // active cell doesn't change in this case
                }
                else
                {
                    this.selectAndFocus(index, event, true);
                }
            }
        }
        else
        {
            this.selectAndFocus(index, event, false);
        }
    }
};

/**
 * Determine if the specified cell index is inside the current selection.
 * @param {Object} index the cell index
 * @param {Array=} ranges the selection to see if the index is in, allows us to check old ranges
 * @return {boolean} true is the cell index specified is inside the selection, false otherwise
 * @private
 */
DvtDataGrid.prototype._isContainSelection = function(index, ranges)
{
    var range, startIndex, endIndex, rangeStartRow, rangeEndRow, rangeStartColumn, rangeEndColumn, i;
    if (ranges == null)
    {
        ranges = this.GetSelection();
    }
    for (i = 0; i < ranges.length; i += 1)
    {
        range = ranges[i];
        startIndex = range['startIndex'];
        endIndex = this.getEndIndex(range);

        rangeStartRow = startIndex['row'];
        rangeEndRow = endIndex['row'];

        // checks if row outside of range
        if (index['row'] < rangeStartRow || (rangeEndRow != -1 && index['row'] > rangeEndRow))
        {
            // skip
            continue;
        }

        if (!isNaN(startIndex['column']) && !isNaN(endIndex['column']))
        {
            rangeStartColumn = startIndex['column'];
            rangeEndColumn = endIndex['column'];

            // checks if row outside of range
            if (index['column'] < rangeStartColumn || (rangeEndColumn != -1 && index['column'] > rangeEndColumn))
            {
                // skip
                continue;
            }

            // within range return immediately
            return true;
        }
        else
        {
            // no column specified, meaning all columns
            return true;
        }
    }

    return false;
};

/**
 * Compare the two selection to see if they are identical.
 * @param {Object} selection1 the first selection
 * @param {Object} selection2 the seonc selection
 * @return {boolean} true if the selections are identical, false otherwise
 * @private
 */
DvtDataGrid.prototype._compareSelections = function(selection1, selection2)
{
    var i, j, foundMatch;

    // currently assumes all selections will be the same if old and new selection are equal
    // now allows not to fire on every drag event
    // todo: needs to handle discontigous selection case

    if (selection1.length !== selection2.length)
    {
        return false;
    }

    for (i = 0; i < selection1.length; i += 1)
    {
        foundMatch = false;
        for (j = 0; j < selection2.length; j += 1)
        {
            if (selection1[i]['startIndex']['row'] === selection2[j]['startIndex']['row'] &&
                    selection1[i]['startIndex']['column'] === selection2[j]['startIndex']['column'] &&
                    selection1[i]['endIndex']['row'] === selection2[j]['endIndex']['row'] &&
                    selection1[i]['endIndex']['column'] === selection2[j]['endIndex']['column'])
            {
                foundMatch = true;
            }
        }
        if (foundMatch === false)
        {
            return false;
        }
    }

    return true;
};

/**
 * Find the row element (recursively if needed)
 * @private
 * @param {Element|EventTarget} elem
 * @return {Element|EventTarget}
 */
DvtDataGrid.prototype.findRow = function(elem)
{
    // recursively walk up the element and find the class name that matches the row class name
    return this.find(elem, "row");
};

/**
 * Unhighlight and clear the current selection. If you are modifying the selection
 * object you should not call this method. It should only be used in the case of a
 * true clear where the selection winds up empty. This fires an event that the selection
 * has changed if it contained values beforehand.
 * @private
 */
DvtDataGrid.prototype._clearSelection = function()
{
    var previous;

    // unhighlight previous selection
    this.unhighlightSelection();
    this._removeTouchSelectionAffordance();

    // clear the selection and fire the
    previous = this.GetSelection();
    this.m_selection = [];

    this._compareSelectionAndFire(null, previous);
};

/************************* key handler methods ************************************/
/**
 * Sets whether the data grid is in discontiguous selection mode
 * @param {boolean} flag true to set grid to discontiguous selection mode
 * @private
 */
DvtDataGrid.prototype.setDiscontiguousSelectionMode = function(flag)
{
    this.m_discontiguousSelection = flag;

    // announce to screen reader
    this._setAccInfoText(flag ? "accessibleRangeSelectModeOn" : "accessibleRangeSelectModeOff");
};

/**
 * Handles key event for selection
 * @param {Event} event
 * @return {boolean} true if the event is processed
 */
DvtDataGrid.prototype.handleSelectionKeyDown = function(event)
{
    var keyCode, target, cell, ctrlKey, shiftKey, column, row, processed = false;

    keyCode = event.keyCode;
    target = event.target;
    cell = this.findCell(target);
    ctrlKey = this.m_utils.ctrlEquivalent(event);

    if (this.isActionableMode())
    {
        processed = this._handleActionableModeKeyDown(event, cell, false);
    }
    else
    {
        // F2 key or Enter key goes to actionable mode
        if (keyCode == DvtDataGrid.F2_KEY || keyCode == DvtDataGrid.ENTER_KEY)
        {
            this._enterActionableMode(cell)
        }
        else if (keyCode == DvtDataGrid.ESC_KEY)
        {
            // if shift+f8 key mode, exit it
            if (this.m_discontiguousSelection)
            {
                this.setDiscontiguousSelectionMode(false);
            }
        }
        else if (this.isNavigationKey(keyCode))
        {
            ctrlKey = this.m_utils.ctrlEquivalent(event);
            shiftKey = event.shiftKey;
            this._updateStateInfo('accessibleStateSelected');
            if (!ctrlKey)
            {
                processed = this.handleCellArrowKeys(keyCode, (shiftKey && this.isMultipleSelection()), event);
            }
        }
        else if (event.shiftKey && keyCode == DvtDataGrid.F8_KEY)
        {
            this.setDiscontiguousSelectionMode(!this.m_discontiguousSelection);
            // eat the shift+F8 event to avoid firefox default behavior
            processed = true;
        }
        else if (keyCode == DvtDataGrid.SPACE_KEY)
        {
            ctrlKey = this.m_utils.ctrlEquivalent(event);
            shiftKey = event.shiftKey;
            if (this.m_options.getSelectionMode() == "cell" && this.isMultipleSelection() && ((shiftKey && !ctrlKey) || ctrlKey))
            {
                if (ctrlKey)
                {
                    // selects the current column
                    column = this.m_active['indexes']['column'];
                    this._selectEntireColumn(column, column, event);
                    // announce to screen reader
                    this._setAccInfoText('accessibleColumnSelected', {'column': this.m_active['keys']['column']});
                }
                else
                {
                    // selects the current row
                    row = this.m_active['indexes']['row'];
                    this._selectEntireRow(row, row, event);
                    // announce to screen reader
                    this._setAccInfoText('accessibleRowSelected', {'row': this.m_active['keys']['row']});
                }
                processed = true;
            }
        }
    }

    // check keystroke for reading content to screen reader
    if (this.isReadCurrentContent(event))
    {
        this.readCurrentContent();
        processed = true;
    }

    return processed;
};

/**
 * Selects the entire row of cells
 * @param {number} rowStart the end row index
 * @param {number} rowEnd the start row index
 * @param {Event} event the dom event that triggers the selection
 * @private
 */
DvtDataGrid.prototype._selectEntireRow = function(rowStart, rowEnd, event)
{
    var startIndex, endIndex;

    // create the start and end index then selects the range
    startIndex = this.createIndex(rowStart, 0);
    endIndex = this.createIndex(rowEnd, -1);

    this._selectRange(startIndex, endIndex, event);
};

/**
 * Selects the entire column of cells
 * @param {number} columnStart the column start index
 * @param {number} columnEnd the column end index
 * @param {Event} event the dom event that triggers the selection
 * @private
 */
DvtDataGrid.prototype._selectEntireColumn = function(columnStart, columnEnd, event)
{
    var startIndex, endIndex;

    // create the start and end index then selects the range
    startIndex = this.createIndex(0, columnStart);
    endIndex = this.createIndex(-1, columnEnd);

    this._selectRange(startIndex, endIndex, event);
};

/**
 * Selects a range of cells.
 * @param {Object} startIndex the start row/column indexes
 * @param {Object} endIndex the end row/column indexes
 * @param {Event} event the dom event that triggers the selection
 * @private
 */
DvtDataGrid.prototype._selectRange = function(startIndex, endIndex, event)
{
    // no longer clear selection, if it is cleared here we can't return anything for previous selection
    this.unhighlightSelection();
    this._createRangeWithKeys(startIndex, endIndex, this._selectRangeCallback.bind(this, event));
};

/**
 * Callback for once the new range is constructed
 * @param {Event} event the dom event that triggers the selection
 * @param {Object} newRange the new range to be selected
 * @private
 */
DvtDataGrid.prototype._selectRangeCallback = function(event, newRange)
{
    var selection, previous;

    // We need to pass the option change event the previous selection.
    // We also need to overwrite the old selection instance with a new one
    // so clone the old one, update, and then replace so that the object passed
    // as the previous matches the old reference and the new selection is a new
    // reference, create a brand new selection
    previous = this.GetSelection();
    selection = [];
    selection.push(newRange);
    this.m_selection = selection;

    this.highlightRange(newRange);

    if (this._isDatabodyCellActive())
    {
        // reset frontier to be the same as active
        this.m_selectionFrontier = this.m_active['indexes'];

        this._highlightActive();
    }

    // fire selection event if the selection has changed
    this._compareSelectionAndFire(event, previous);
};

/**
 * Retrieve the current selection
 * @return {Array} an array of ranges
 * @export
 */
DvtDataGrid.prototype.GetSelection = function()
{
    if (this.m_selection == null)
    {
        this.m_selection = [];
    }
    return this.m_selection;
};

/**
 * Sets a range of selections
 * @param {Array} selection
 * @export
 */
DvtDataGrid.prototype.SetSelection = function(selection)
{
    var previous;

    // it can be null but cannot be undefined
    if (selection != undefined)
    {
        if (selection == null)
        {
            selection = [];
        }

        //if we set the selection we should ungihlight the old one
        this.unhighlightSelection();

        previous = this.GetSelection();
        this.m_selection = selection;

        // if it's not render yet, don't apply selection
        if (this.m_databody != null)
        {
            this.applySelection(this.m_startRow, this.m_endRow, this.m_startCol, this.m_endCol);
        }
        // do not fire selection event when set on us externally, it will be taken
        // care of in the wrappers option layer
    }
};

/**
 * Fires selection event
 * @param {Event} event the dom event that triggers the selection
 * @protected
 */
DvtDataGrid.prototype.fireSelectionEvent = function(event, previousSelection)
{
    var details = {
        'event': event, 'ui': {
            'selection': this.GetSelection(),
            'previousSelection': previousSelection
        }
    };
    this.fireEvent('select', details);
};

/**
 * Shift+click to extend the selection
 * @param {Object} index - the end index of the selection.
 * @param {Event} event - the DOM event causing the selection to to be extended
 */
DvtDataGrid.prototype.extendSelection = function(index, event)
{
    var anchor;
    // find the the top left index
    if (this.m_utils.isTouchDevice())
    {
        anchor = this.m_touchSelectAnchor;
    }
    else
    {
        anchor = this.m_active['indexes'];
    }
    if (anchor == null)
    {
        return;
    }

    // reset focus on previous selection frontier
    this._resetSelectionFrontierFocus();

    // assign frontier before we change index;
    this.m_selectionFrontier = index;

    if (this.m_options.getSelectionMode() == "row")
    {
        // drop the column index
        index = this.createIndex(index['row']);
    }
    this._createRangeWithKeys(anchor, index, this._extendSelectionCallback.bind(this, event));
};

/**
 * Once the range is created from the index continue to extend the selection
 * @param {Event} event - the DOM event causing the selection to to be extended
 * @param {Object} newRange - the new range of the selection.
 * @private
 */
DvtDataGrid.prototype._extendSelectionCallback = function(event, newRange)
{
    var selection, previous, currentRange, startIndexesMatch, endIndexesMatch;

    previous = this.GetSelection();
    currentRange = previous[previous.length - 1];

    // checks if selection has changed
    startIndexesMatch = (currentRange['startIndex']['row'] == newRange['startIndex']['row']);
    if (currentRange['startIndex']['column'] != null && newRange['startIndex']['column'] != null)
    {
        startIndexesMatch = startIndexesMatch && (currentRange['startIndex']['column'] == newRange['startIndex']['column']);
    }

    endIndexesMatch = (currentRange['endIndex']['row'] == newRange['endIndex']['row']);
    if (currentRange['endIndex']['column'] != null && newRange['endIndex']['column'] != null)
    {
        endIndexesMatch = endIndexesMatch && (currentRange['endIndex']['column'] == newRange['endIndex']['column']);
    }

    if (startIndexesMatch && endIndexesMatch)
    {
        return;
    }

    // We also need to overwrite the old selection instance with a new one
    // so clone the old one, update, and then replace so that the object passed
    // as the previous matches the old reference and the new selection is a new
    // reference
    selection = previous.slice(0);
    // replace the current range
    selection.pop();
    selection.push(newRange);
    this.m_selection = selection;

    this.unhighlightRange(currentRange);
    this.highlightRange(newRange, true);

    // focus on the frontier cell
    this._makeSelectionFrontierFocus();

    this._compareSelectionAndFire(event, previous);

    // per excel, user have to hit shift+f8 again to create another discontiguous selection
    // unless is discontiguous selection mode through touch
    if (this.m_discontiguousSelection && !this.m_utils.isTouchDevice())
    {
        this.setDiscontiguousSelectionMode(false);
    }
};

/**
 * Reset focus on selection frontier
 * @private
 */
DvtDataGrid.prototype._resetSelectionFrontierFocus = function()
{
    var range, cell;

    // make sure there is a selection frontier and it's not the same as the active cell
    if (this.m_selectionFrontier == null || (this._isDatabodyCellActive() && this.m_selectionFrontier['row'] == this.m_active['indexes']['row'] && this.m_selectionFrontier['column'] == this.m_active['indexes']['column']))
    {
        return;
    }

    range = this.createRange(this.m_selectionFrontier);
    cell = this.getElementsInRange(range);

    if (cell != null && cell.length > 0)
    {
        this._unsetAriaProperties(cell[0]);
    }
};

/**
 * Make the selection frontier focusable.
 * @private
 */
DvtDataGrid.prototype._makeSelectionFrontierFocus = function()
{
    var range, rowOrCell, cell;

    // make sure there is a selection frontier and it's not the same as the active cell
    if (this.m_selectionFrontier == null || (this._isDatabodyCellActive() && this.m_selectionFrontier['row'] == this.m_active['indexes']['row'] && this.m_selectionFrontier['column'] == this.m_active['indexes']['column']))
    {
        return;
    }

    // unset focus properties on active cell first
    if (this._isDatabodyCellActive())
    {
        range = this.createRange(this.m_active['indexes']);
        cell = this.getElementsInRange(range);

        if (cell != null && cell.length > 0)
        {
            this._unsetAriaProperties(cell[0]);
        }
    }

    range = this.createRange(this.m_selectionFrontier);
    rowOrCell = this.getElementsInRange(range);
    if (rowOrCell == null || rowOrCell.length == 0)
    {
        return;
    }

    // update context info
    this._updateContextInfo(this.m_selectionFrontier);

    // focus on the cell (or first cell in the row)
    cell = this.m_utils.containsCSSClassName(rowOrCell[0], this.getMappedStyle('row')) ? rowOrCell[0]['firstChild'] : rowOrCell[0];
    this._setAriaProperties(this._createActiveObject(cell), null, cell);

};

/**
 * Selects the focus on the specified element, if ctrl+click to add cell/row to the current selection,
 * set the augment flag
 * Select and focus is an asynchronus call
 * @param {Object} index - the end index of the selection.
 * @param {Event} event - the event causing the selection and setting active
 * @param {boolean=} augment - true if we are augmenting the selecition, default to false
 */
DvtDataGrid.prototype.selectAndFocus = function(index, event, augment)
{
    if (augment == null)
    {
        augment = false
    }

    // reset any focus properties set on frontier cell
    this._resetSelectionFrontierFocus();

    // update active cell
    if (!this._setActiveByIndex(index, event))
    {
        return;
    }
    // need the selection frontier maintained until final callback

    // update selection model
    if (this.m_options.getSelectionMode() == "row")
    {
        // drop the column index
        index = this.createIndex(index['row']);
    }
    // ensure end index is specified when push to selection
    this._createRangeWithKeys(index, index, this._selectAndFocusRangeCallback.bind(this, index, event, augment));
};

/**
 * Continue to selectAndFocus and _selectAndFocusActiveCallback
 * @param {Object} index - the end index of the selection.
 * @param {Event} event - the event causing the selection to to be changed
 * @param {boolean} augment - true if selection being augmented
 * @param {Object} range - the range of the selection.
 * @private
 */
DvtDataGrid.prototype._selectAndFocusRangeCallback = function(index, event, augment, range)
{
    var selection, previous;

    previous = this.GetSelection();
    selection = previous.slice(0);
    if (!augment)
    {
        // if we are not augmenting the selection modify the old one appropriately
        if (!this.m_discontiguousSelection)
        {
            this.unhighlightSelection();
            // this should be a new selection
            selection = [];
        }
        // this is for the Shift + F8 navigate case, we are adding to the selection on every arrow,
        // but if the user is trying to navigate away we are always popping the last selection off because
        // it was just used to navigate away, do not do this on touch because their is no navigation concept
        else if (this._isDatabodyCellActive() && this.m_prevActive != null && this.m_prevActive['type'] == 'cell' &&
                this.m_selectionFrontier['row'] == this.m_prevActive['indexes']['row'] &&
                this.m_selectionFrontier['column'] == this.m_prevActive['indexes']['column'] &&
                !this.m_utils.isTouchDevice())
        {
            // remove the last selection
            selection.pop();

            // unhighlight previous (active and selection)
            // only if it's not in an existing selection
            if (!this._isContainSelection(this.m_prevActive['indexes'], selection))
            {
                this._unhighlightElement(this._getCellByIndex(this.m_prevActive['indexes']), ['selected']);
            }
        }
    }

    this.m_selectionFrontier = index;

    // We need to overwrite the old selection instance with a new one
    // so clone the old one, update, and then replace so that the object passed
    // as the previous matches the old reference and the new selection is a new
    // reference
    selection.push(range);
    this.m_selection = selection;

    // highlight index
    this._highlightElement(this._getCellByIndex(index), ['selected']);

    this._compareSelectionAndFire(event, previous);
};

/********************* end key handler methods ************************************/

/********************* focusable/editable element related methods *****************/
/**
 * Compare the selection to a clone and fire selection event if it has changed
 * @param {Event} event the DOM event to pass off in the selection event
 * @param {Object} clone the old selection object
 * @private
 */
DvtDataGrid.prototype._compareSelectionAndFire = function(event, clone)
{
    var selection = this.GetSelection();
    //only deal with touch affordances if multiple selection on touch
    if (this.m_utils.isTouchDevice() && this.isMultipleSelection() && selection.length > 0)
    {
        this._addTouchSelectionAffordance(event);
        this._moveTouchSelectionAffordance();
    }

    // fire event if selection has changed
    if (!this._compareSelections(selection, clone))
    {
        this.fireSelectionEvent(event, clone);
    }
};

/**
 * Add the touch affordance to the grid. It will be added to the row containing the active cell in row/cell selection mode.
 * Sets the position of the affordance to be on the corner of a cell in cell selection or the center of the viewport in row
 * selection.
 * @param {Event} event the event that drives the need for touch affordance
 * @private
 */
DvtDataGrid.prototype._addTouchSelectionAffordance = function(event)
{
    //icon in the corner
    var cell, iconSize, topIcon, bottomIcon, row, selectionMode, left, dir;
    if (this.m_topSelectIconContainer == null && this.m_bottomSelectIconContainer == null)
    {
        dir = this.getResources().isRTLMode() ? "right" : "left";
        iconSize = this._getTouchSelectionAffordanceSize();

        //cache the containers so we always know where they are since selection object isn't always current
        //wrap the icon in a container so the touch area is larger than the icon
        this.m_topSelectIconContainer = document.createElement('div');
        this.m_topSelectIconContainer['className'] = this.getMappedStyle('toucharea');
        this.setElementDir(this.m_topSelectIconContainer, -iconSize / 2, 'top');
        topIcon = document.createElement('div');
        topIcon['className'] = this.getMappedStyle('selectaffordancetop');
        topIcon.setAttribute('role', 'button');
        topIcon.setAttribute('aria-label', this.getResources().getTranslatedText('accessibleSelectionAffordanceTop'));
        this.m_topSelectIconContainer.appendChild(topIcon); //@HTMLUpdateOK

        this.m_bottomSelectIconContainer = document.createElement('div');
        this.m_bottomSelectIconContainer['className'] = this.getMappedStyle('toucharea');
        this.setElementDir(this.m_bottomSelectIconContainer, -1 * iconSize / 2, 'bottom');
        bottomIcon = document.createElement('div');
        bottomIcon['className'] = this.getMappedStyle('selectaffordancebottom');
        bottomIcon.setAttribute('role', 'button');
        bottomIcon.setAttribute('aria-label', this.getResources().getTranslatedText('accessibleSelectionAffordanceBottom'));
        this.m_bottomSelectIconContainer.appendChild(bottomIcon); //@HTMLUpdateOK

        selectionMode = this.m_options.getSelectionMode();
        if (selectionMode === 'row')
        {
            left = (this.getElementWidth(this.m_databody) / 2) + this.m_currentScrollLeft - (iconSize / 2);
            this.setElementDir(this.m_topSelectIconContainer, left, dir);
            this.setElementDir(this.m_bottomSelectIconContainer, left, dir);
        }
        else
        {
            cell = this.findCell(event.target);
            left = this.getElementDir(cell, dir) - (iconSize / 2);
            this.setElementDir(this.m_topSelectIconContainer, left, dir);
            this.setElementDir(this.m_bottomSelectIconContainer, left + this.calculateColumnWidth(cell), dir);
        }

        row = this.getElementsInRange(this.createRange(this.m_active['indexes']))[0]['parentNode'];
        row.appendChild(this.m_topSelectIconContainer); //@HTMLUpdateOK
        row.appendChild(this.m_bottomSelectIconContainer); //@HTMLUpdateOK
    }
};

/**
 * Finds and removes the touch selection icons from the DOM
 * @private
 */
DvtDataGrid.prototype._removeTouchSelectionAffordance = function()
{
    if (this._isDatabodyCellActive() && this.m_topSelectIconContainer && this.m_topSelectIconContainer['parentNode'])
    {
        this.m_topSelectIconContainer['parentNode'].removeChild(this.m_topSelectIconContainer);
        this.m_bottomSelectIconContainer['parentNode'].removeChild(this.m_bottomSelectIconContainer);
    }
};

/**
 * Finds and moves the touch selection affordances based on the old and new selection
 * @private
 */
DvtDataGrid.prototype._moveTouchSelectionAffordance = function()
{
    var selection, topRow, bottomRow, selectionMode, topIconCell, bottomIconCell, elementsInRange, dir;

    selection = this.GetSelection();
    if (selection.length > 0)
    {
        selectionMode = this.m_options.getSelectionMode();

        topRow = this._findRowByKey(selection[selection.length - 1]['startKey']['row']);
        bottomRow = this._findRowByKey(selection[selection.length - 1]['endKey']['row']);

        if (this.m_topSelectIconContainer != null && this.m_bottomSelectIconContainer != null)
        {
            if (selectionMode === 'row')
            {
                topRow.appendChild(this.m_topSelectIconContainer); //@HTMLUpdateOK
                bottomRow.appendChild(this.m_bottomSelectIconContainer); //@HTMLUpdateOK
            }
            else
            {
                dir = this.getResources().isRTLMode() ? "right" : "left";

                //get the cells for left/right alignment
                elementsInRange = this.getElementsInRange(selection[selection.length - 1]);
                topIconCell = elementsInRange[0];
                bottomIconCell = elementsInRange[elementsInRange.length - 1];

                topRow.appendChild(this.m_topSelectIconContainer); //@HTMLUpdateOK
                bottomRow.appendChild(this.m_bottomSelectIconContainer); //@HTMLUpdateOK

                this.setElementDir(this.m_topSelectIconContainer, this.getElementDir(topIconCell, dir) - (this._getTouchSelectionAffordanceSize() / 2), dir);
                this.setElementDir(this.m_bottomSelectIconContainer, this.getElementDir(bottomIconCell, dir) + this.calculateColumnWidth(bottomIconCell) - (this._getTouchSelectionAffordanceSize() / 2), dir);
            }
        }
    }
};

/**
 * Moves the touch selection affordances horizontally in the row to ensure they are in the viewport.
 * Only moved in row selection.
 * @private
 */
DvtDataGrid.prototype._scrollTouchSelectionAffordance = function()
{
    var selectionMode, newLeft, dir;
    selectionMode = this.m_options.getSelectionMode();
    if (selectionMode === 'row')
    {
        if (this.m_topSelectIconContainer != null)
        {
            dir = this.getResources().isRTLMode() ? "right" : "left";
            newLeft = (this.getElementWidth(this.m_databody) / 2) + this.m_currentScrollLeft;
            this.setElementDir(this.m_topSelectIconContainer, newLeft, dir);
            this.setElementDir(this.m_bottomSelectIconContainer, newLeft, dir);
        }
    }
};

/**
 * Get the touch affordance icon size
 * @return {number} the touch affordance icon size
 * @private
 */
DvtDataGrid.prototype._getTouchSelectionAffordanceSize = function()
{
    var div, divWidth;
    if (this.m_touchSelectionAffordanceSize == null)
    {
        div = document.createElement('div');
        div['className'] = this.getMappedStyle('toucharea');
        div['style']['visibilty'] = 'hidden';
        div['style']['top'] = '0px';
        div['style']['visibilty'] = '0px';
        this.m_root.appendChild(div); //@HTMLUpdateOK
        divWidth = div['offsetWidth'];
        this.m_root.removeChild(div);
        this.m_touchSelectionAffordanceSize = divWidth;
    }
    return this.m_touchSelectionAffordanceSize;
};

/**
 * @preserve Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
DvtDataGrid.RESIZE_OFFSET = 5;
DvtDataGrid.RESIZE_TOUCH_OFFSET = 8;

/**
 * Handles what to do when the mouse moves. Sets the cursor based on .manageHeaderCursor(),
 * If this.m_isResizing is set to true, treats movement as resizing, calling .handleResizeMouseMove()
 * @param {Event} event - a mousemove event
 */
DvtDataGrid.prototype.handleResize = function(event)
{
    var header;
    //if not resizing, monitor the cursor position, otherwise handle resizing
    if (this.m_isResizing === false)
    {
        header = this.find(event['target'], 'header');
        //only if we are inside our grid's headers, multiple grid case
        if (header != null && (header == this.m_rowHeader || header == this.m_colHeader))
        {
            this.m_cursor = this.manageHeaderCursor(event);
            if (this.m_resizingElement != null)
            {
                if (this.m_cursor == 'default')
                {
                    this.m_resizingElement['style']['cursor'] = '';
                    if (this.m_resizingElementSibling != null)
                    {
                        this.m_resizingElementSibling['style']['cursor'] = '';
                    }
                }
                else
                {
                    this.m_resizingElement['style']['cursor'] = this.m_cursor;
                    if (this.m_resizingElementSibling != null)
                    {
                        this.m_resizingElementSibling['style']['cursor'] = this.m_cursor;
                    }
                }
            }
        }
    }
    else
    {
        this.handleResizeMouseMove(event);
    }
};

/**
 * On mousedown, if the cursor was set to row/col -resize, set the required resize values.
 * @param {Event} event - a mousedown event
 * @return {boolean} true if event processed
 */
DvtDataGrid.prototype.handleResizeMouseDown = function(event)
{
    if (this.m_cursor === 'col-resize' || this.m_cursor === 'row-resize')
    {
        this.m_isResizing = true;
        if (this.m_utils.isTouchDevice())
        {
            this.m_lastMouseX = event.touches[0]['pageX'];
            this.m_lastMouseY = event.touches[0]['pageY'];
        }
        else
        {
            this.m_lastMouseX = event['pageX'];
            this.m_lastMouseY = event['pageY'];
        }

        this.m_overResizeLeft = 0;
        this.m_overResizeMinLeft = 0;
        this.m_overResizeTop = 0;
        this.m_overResizeMinTop = 0;
        this.m_overResizeRight = 0;
        this.m_overResizeBottom = 0;
        
        this.m_orginalResizeDimensions = {
            'width': this.getElementWidth(this.m_resizingElement),
            'height': this.getElementHeight(this.m_resizingElement)                            
        };
        
        return true;
    }
    return false;
};

/**
 * On mouseup, if we were resizing, handle cursor and callback firing.
 * @param {Event} event - a mouseup event
 */
DvtDataGrid.prototype.handleResizeMouseUp = function(event)
{
    var size, details, newHeight, newWidth;
    if (this.m_isResizing === true)
    {
        newWidth = this.getElementWidth(this.m_resizingElement);     
        newHeight = this.getElementHeight(this.m_resizingElement);        
        if (newWidth != this.m_orginalResizeDimensions['width'] || newHeight != this.m_orginalResizeDimensions['height'])
        {
            //set the information we want to callback with in the resize event and callback
            size = (this.m_cursor === 'col-resize') ? this.m_resizingElement['style']['width'] : this.m_resizingElement['style']['height'];
            details = {
                'event': event, 
                'ui': {
                    'header': this._getKey(this.m_resizingElement), 
                    'oldDimensions' : {
                        'width': this.m_orginalResizeDimensions['width'],
                        'height': this.m_orginalResizeDimensions['height']
                    },
                    'newDimensions' : {
                        'width': this.getElementWidth(this.m_resizingElement),
                        'height': this.getElementHeight(this.m_resizingElement)       
                    },
                    // deprecating this part in 2.1.0
                    'size': size
                }
            };
            this.fireEvent('resize', details);
        }
        //no longer resizing
        this.m_isResizing = false;
        this.m_cursor = 'default';
        this.m_resizingElement['style']['cursor'] = '';
        if (this.m_resizingElementSibling != null)
        {
            this.m_resizingElementSibling['style']['cursor'] = '';
        }

        this.m_resizingElement = null;
        this.m_resizingElementSibling = null;
        this.m_orginalResizeDimensions = null;
    }
};

/**
 * Check if has data-resizable attribute is set to 'true' on a header
 * @param {HMTLElement} element - element to check if has data-resizable true
 * @return {boolean} true if data-resizable attribute is 'true'
 */
DvtDataGrid.prototype._isDOMElementResizable = function(element)
{
    if (element == null)
    {
        return false;
    }
    return element.getAttribute(this.getResources().getMappedAttribute('resizable')) === "true";
};

/**
 * Determine what the document cursor should be for header cells.
 * @param {Event} event - a mousemove event
 * @return {string} the cursor type for a given mouse location
 */
DvtDataGrid.prototype.manageHeaderCursor = function(event)
{
    var elem = event['target'], resizeHeaderMode, edges, cursorX, cursorY, offsetPixel,
            widthResizable, heightResizable, siblingResizable, rtl, index, level, sibling, parent,
            leftEdgeCheck, rightEdgeCheck, topEdgeCheck, bottomEdgeCheck;
    //determine the element/header type that should be used for resizing if applicable
    elem = this.find(event['target'], 'colheadercell');
    if (!elem)
    {
        elem = this.find(event['target'], 'rowheadercell');
        resizeHeaderMode = 'row';
    }
    else
    {
        resizeHeaderMode = 'column';
    }

    if (!elem)
    {
        return 'default';
    }

    index = this.getHeaderCellIndex(elem);
    level = this.getHeaderCellLevel(elem);

    if (resizeHeaderMode === 'column')
    {
        heightResizable = this.m_options.isResizable(resizeHeaderMode)['height'] === "enable" ? true : false;
        widthResizable = this._isDOMElementResizable(elem);
        // previous is the previous index same level
        sibling = this._getColumnHeaderByIndex(index - 1, level);
        siblingResizable = this._isDOMElementResizable(sibling);
        // parent is the previous level the same index
        parent = this._getColumnHeaderByIndex(index, level - 1);
    }
    else if (resizeHeaderMode === 'row')
    {
        widthResizable = this.m_options.isResizable(resizeHeaderMode)['width'] === "enable" ? true : false;
        heightResizable = this._isDOMElementResizable(elem);
        // previous is the previous index same level
        sibling = this._getRowHeaderByIndex(index - 1, level);
        siblingResizable = this._isDOMElementResizable(sibling);
        // parent is the previous level the same index
        parent = this._getRowHeaderByIndex(index, level - 1);
    }

    //touch requires an area 24px for touch gestures
    if (this.m_utils.isTouchDevice())
    {
        cursorX = event.touches[0]['pageX'];
        cursorY = event.touches[0]['pageY'];
        offsetPixel = DvtDataGrid.RESIZE_TOUCH_OFFSET;
    }
    else
    {
        cursorX = event['pageX'];
        cursorY = event['pageY'];
        offsetPixel = DvtDataGrid.RESIZE_OFFSET;
    }
    edges = this.getHeaderEdgePixels(elem);
    rtl = this.getResources().isRTLMode();

    leftEdgeCheck = cursorX < edges[0] + offsetPixel;
    topEdgeCheck = cursorY < edges[1] + offsetPixel;
    rightEdgeCheck = cursorX > edges[2] - offsetPixel;
    bottomEdgeCheck = cursorY > edges[3] - offsetPixel;

    //check to see if resizable was enabled on the grid and then check the position of the cursor to the element border
    //we always choose the element preceding the border (so for rows the header before the bottom border)
    if (resizeHeaderMode === 'column')
    {
        // can we resize the width of this header
        if (widthResizable && (rtl ? leftEdgeCheck : rightEdgeCheck))
        {
            this.m_resizingElement = elem;
            return 'col-resize';
        }
        // can we resize the width of the previous header
        else if (siblingResizable && (rtl ? rightEdgeCheck : leftEdgeCheck))
        {
            this.m_resizingElement = sibling;
            this.m_resizingElementSibling = elem;
            if (this.m_resizingElement !== null)
            {
                return 'col-resize';
            }
        }
        else if (heightResizable)
        {
            // can we resize the height of this header
            if (bottomEdgeCheck)
            {
                this.m_resizingElement = elem;
                return 'row-resize';
            }
            // can we resize the height of the parent header
            else if (topEdgeCheck)
            {
                this.m_resizingElement = parent;
                this.m_resizingElementSibling = elem;
                return 'row-resize';
            }
        }
    }
    else if (resizeHeaderMode === 'row')
    {
        if (heightResizable && bottomEdgeCheck)
        {
            this.m_resizingElement = elem;
            return 'row-resize';
        }
        else if (siblingResizable && topEdgeCheck)
        {
            this.m_resizingElement = sibling;
            this.m_resizingElementSibling = elem;
            if (this.m_resizingElement !== null)
            {
                return 'row-resize';
            }
        }
        if (widthResizable)
        {
            if ((rtl ? leftEdgeCheck : rightEdgeCheck))
            {
                this.m_resizingElement = elem;
                return 'col-resize';
            }
            else if ((rtl ? rightEdgeCheck : leftEdgeCheck))
            {
                this.m_resizingElement = parent;
                this.m_resizingElementSibling = elem;
                if (this.m_resizingElement !== null)
                {
                    return 'col-resize';
                }
            }
        }
    }
    return 'default';
};

/**
 * On mousemove see which type of resizing we are doing and call the appropriate resizer after calculating
 * the new elements width based on current and last X and Y page coordinates.
 * @param {Event} event - a mousemove event
 */
DvtDataGrid.prototype.handleResizeMouseMove = function(event)
{
    var resizeHeaderMode, oldElementWidth, newElementWidth, oldElementHeight, newElementHeight;
    //update stored mouse position
    this.m_currentMouseX = event['pageX'];
    this.m_currentMouseY = event['pageY'];

    if (this.m_utils.isTouchDevice())
    {
        this.m_currentMouseX = event.touches[0]['pageX'];
        this.m_currentMouseY = event.touches[0]['pageY'];
    }
    else
    {
        this.m_currentMouseX = event['pageX'];
        this.m_currentMouseY = event['pageY'];
    }

    //check to see if we are resizing a column or row
    if (this.m_utils.containsCSSClassName(this.m_resizingElement, this.getMappedStyle('colheadercell')))
    {
        resizeHeaderMode = 'column';
    }
    else
    {
        resizeHeaderMode = 'row';
    }

    //handle width resizing for columns/rows
    if (this.m_cursor === 'col-resize')
    {
        if (resizeHeaderMode === 'column')
        {
            oldElementWidth = this.calculateColumnHeaderWidth(this.m_resizingElement);
            newElementWidth = this.getNewElementWidth('column', oldElementWidth);
            this.resizeColWidth(oldElementWidth, newElementWidth);
        }
        else if (resizeHeaderMode === 'row')
        {
            oldElementWidth = this.getElementWidth(this.m_resizingElement);
            newElementWidth = this.getNewElementWidth('row', oldElementWidth);
            this.resizeRowWidth(newElementWidth, newElementWidth - oldElementWidth);
        }
    }
    //handle height resizing for columns/rows
    else if (this.m_cursor === 'row-resize')
    {
        if (resizeHeaderMode === 'row')
        {
            oldElementHeight = this.calculateRowHeaderHeight(this.m_resizingElement);
            newElementHeight = this.getNewElementHeight('row', oldElementHeight);
            this.resizeRowHeight(oldElementHeight, newElementHeight);
        }
        else if (resizeHeaderMode === 'column')
        {
            oldElementHeight = this.getElementHeight(this.m_resizingElement);
            newElementHeight = this.getNewElementHeight('column', oldElementHeight);
            this.resizeColHeight(newElementHeight, newElementHeight - oldElementHeight);
        }
    }

    //rebuild the corners
    this.buildCorners();

    // re-align touch affordances
    if (this.m_utils.isTouchDevice())
    {
        this._moveTouchSelectionAffordance();
    }

    //update the last mouse X/Y
    this.m_lastMouseX = this.m_currentMouseX;
    this.m_lastMouseY = this.m_currentMouseY;
};

/**
 * Resize the width of column headers, and the column cells. Also resize the
 * scroller and databody accordingly. Set the left(or right) style value on all
 * cells/columns following(preceeding) the resizing element. Update the end
 * column pixel as well.
 * @param {number} oldElementWidth - the elements width prior to resizing
 * @param {number} newElementWidth - the elements width after resizing
 */
DvtDataGrid.prototype.resizeColWidth = function(oldElementWidth, newElementWidth)
{
    var widthChange, oldScrollerWidth, newScrollerWidth;
    widthChange = newElementWidth - oldElementWidth;
    if (widthChange != 0)
    {
        oldScrollerWidth = this.getElementWidth(this.m_scroller['firstChild']);
        newScrollerWidth = oldScrollerWidth + widthChange;
        if (!this._databodyEmpty())
        {
            this.setElementWidth(this.m_scroller['firstChild'], newScrollerWidth);
            this.setElementWidth(this.m_databody['firstChild'], newScrollerWidth);
        }

        //helper to update all elements this effects
        this.resizeColumnWidthAndShift(widthChange);

        this.m_endColPixel += widthChange;
        this.m_endColHeaderPixel += widthChange;
        this.m_avgColWidth = newScrollerWidth / this.getDataSource().getCount('column');

        this.manageResizeScrollbars();
    }
};

/**
 * Resize the height of row headers, and the rows cells. Also resize the
 * scroller and databody accordingly. Update the end row pixel as well.
 * @param {number} oldElementHeight - the elements height prior to resizing
 * @param {number} newElementHeight - the elements height after resizing
 */
DvtDataGrid.prototype.resizeRowHeight = function(oldElementHeight, newElementHeight)
{
    var heightChange, oldScrollerHeight, newScrollerHeight;
    heightChange = newElementHeight - oldElementHeight;
    if (heightChange != 0)
    {
        oldScrollerHeight = this.getElementHeight(this.m_scroller['firstChild']);
        newScrollerHeight = oldScrollerHeight + heightChange;
        if (!this._databodyEmpty())
        {
            this.setElementHeight(this.m_scroller['firstChild'], newScrollerHeight);
            this.setElementHeight(this.m_databody['firstChild'], newScrollerHeight);
        }

        //set row height on the appropriate databody row, set the new value in the sizingManager
        this.resizeRowHeightAndShift(heightChange);

        this.m_endRowPixel += heightChange;
        this.m_endRowHeaderPixel += heightChange;
        this.m_avgRowHeight = newScrollerHeight / this.getDataSource().getCount('row');

        this.manageResizeScrollbars();
    }
};

/**
 * Resize the height of column headers. Also resize the scroller and databody
 * accordingly.
 * @param {number} newElementHeight - the column header height after resizing
 * @param {number} heightChange - the change in height
 */
DvtDataGrid.prototype.resizeColHeight = function(newElementHeight, heightChange)
{
    if (heightChange != 0)
    {
        var level = this.getHeaderCellLevel(this.m_resizingElement) + this.getHeaderCellDepth(this.m_resizingElement) - 1;
        this.m_columnHeaderLevelHeights[level] += heightChange;
        this.resizeColumnHeightsAndShift(heightChange, level);

        this.m_colHeaderHeight += heightChange;
        this.setElementHeight(this.m_colHeader, this.m_colHeaderHeight);
        this.manageResizeScrollbars();
    }
};

/**
 * Resize the width of row headers. Also resize the scroller and databody
 * accordingly.
 * @param {number} newElementWidth - the row header width after resizing
 * @param {number} widthChange - the change in width
 */
DvtDataGrid.prototype.resizeRowWidth = function(newElementWidth, widthChange)
{
    if (widthChange != 0)
    {
        var level = this.getHeaderCellLevel(this.m_resizingElement) + this.getHeaderCellDepth(this.m_resizingElement) - 1;
        this.m_rowHeaderLevelWidths[level] += widthChange;
        this.resizeRowWidthsAndShift(widthChange, level);

        this.m_rowHeaderWidth += widthChange;
        this.setElementWidth(this.m_rowHeader, this.m_rowHeaderWidth);
        this.manageResizeScrollbars();
    }
};

/**
 * Determine what the new element width should be based on minimum values.
 * Accounts for the overshoot potential of passing up the boundries set.
 * @param {string} axis - the axis along which we need a new width
 * @param {number} oldElementWidth - the element width prior to resizing
 * @return {number} the element width after resizing
 */
DvtDataGrid.prototype.getNewElementWidth = function(axis, oldElementWidth)
{
    var minWidth, databodyWidth, deltaWidth, newElementWidth, oldScrollerWidth, halfGridWidth;
    //to account for the 24px resing width
    minWidth = this._getMinValue('width', axis);
    databodyWidth = this.getElementWidth(this.m_databody);
    deltaWidth = this.getResources().isRTLMode() ? this.m_lastMouseX - this.m_currentMouseX : this.m_currentMouseX - this.m_lastMouseX;
    newElementWidth = oldElementWidth + deltaWidth + this.m_overResizeLeft + this.m_overResizeMinLeft + this.m_overResizeRight;
    oldScrollerWidth = this.getElementWidth(this.m_scroller['firstChild']);
    halfGridWidth = Math.round(this.getWidth() / 2);

    //check to make sure the element exceeds the minimum width
    if (newElementWidth < minWidth)
    {
        this.m_overResizeMinLeft += deltaWidth - minWidth + oldElementWidth;
        newElementWidth = minWidth;
    }
    else
    {
        this.m_overResizeMinLeft = 0;
        this.m_overResizeLeft = 0;
    }
    //check to make sure row header width don't exceed half of the grid width
    if (axis === 'row')
    {
        if (newElementWidth > halfGridWidth)
        {
            this.m_overResizeRight += deltaWidth - halfGridWidth + oldElementWidth;
            newElementWidth = halfGridWidth;
        }
        else
        {
            this.m_overResizeRight = 0;
        }
    }
    return newElementWidth;
};

/**
 * Determine what the new element height should be based on minimum values.
 * Accounts for the overshoot potential of passing up the boundries set.
 * @param {string} axis - the axis along which we need a new width
 * @param {number} oldElementHeight - the element height prior to resizing
 * @return {number} the element height after resizing
 */
DvtDataGrid.prototype.getNewElementHeight = function(axis, oldElementHeight)
{
    var databodyHeight, minHeight, deltaHeight, newElementHeight, oldScrollerHeight, halfGridHeight;
    minHeight = this._getMinValue('height', axis);
    databodyHeight = this.getElementHeight(this.m_databody);
    deltaHeight = this.m_currentMouseY - this.m_lastMouseY;
    newElementHeight = oldElementHeight + deltaHeight + this.m_overResizeTop + this.m_overResizeMinTop + this.m_overResizeBottom;
    oldScrollerHeight = this.getElementHeight(this.m_scroller['firstChild']);
    halfGridHeight = Math.round(this.getHeight() / 2);

    //Check to make sure the element height exceeds the minimum height
    if (newElementHeight < minHeight)
    {
        this.m_overResizeMinTop += deltaHeight - minHeight + oldElementHeight;
        newElementHeight = minHeight;
    }
    else
    {
        this.m_overResizeMinTop = 0;
        this.m_overResizeTop = 0;
    }
    //check to make sure column header width don't exceed half of the grid height
    if (axis === 'column')
    {
        if (newElementHeight > halfGridHeight)
        {
            this.m_overResizeBottom += deltaHeight - halfGridHeight + oldElementHeight;
            newElementHeight = halfGridHeight;
        }
        else
        {
            this.m_overResizeBottom = 0;
        }
    }
    return newElementHeight;
};

/**
 * Determine what the minimum value for the resizing element is
 * @param {string} dimension - the width or height
 * @param {string} axis - the axis
 * @return {number} the minimum height for the element
 * @private
 */
DvtDataGrid.prototype._getMinValue = function(dimension, axis)
{
    var index, level, elem, minValue, extent, currentDimensionValue, inner, innerDimensionValue, depth;
    elem = this.m_resizingElement;
    level = this.getHeaderCellLevel(elem);
    depth = this.getHeaderCellDepth(elem);
    minValue = this.m_utils.isTouchDevice() ? 2 * DvtDataGrid.RESIZE_TOUCH_OFFSET : 2 * DvtDataGrid.RESIZE_OFFSET;
    if ((axis === 'column' && (this.m_columnHeaderLevelCount === 1 || (dimension === 'height' && depth === 1))) ||
            (axis === 'row' && (this.m_rowHeaderLevelCount === 1 || (dimension === 'width' && depth === 1))))
    {
        return minValue;
    }
    index = this.getHeaderCellIndex(elem);
    extent = this._getAttribute(this.m_resizingElement['parentNode'], 'extent', true);
    currentDimensionValue = this.getElementDir(elem, dimension);

    if (axis === 'column')
    {
        if (dimension === 'width')
        {
            inner = this._getColumnHeaderByIndex(index + extent - 1, this.m_columnHeaderLevelCount - 1);
            innerDimensionValue = this.getElementDir(inner, dimension);
        }
        else
        {
            innerDimensionValue = this._getColumnHeaderLevelHeight(level + depth - 1, elem);
        }
    }
    else if (axis === 'row')
    {
        if (dimension === 'height')
        {
            inner = this._getRowHeaderByIndex(index + extent - 1, this.m_rowHeaderLevelCount - 1);
            innerDimensionValue = this.getElementDir(inner, dimension);
        }
        else
        {
            innerDimensionValue = this._getRowHeaderLevelWidth(level + depth - 1, elem);
        }
    }
    return currentDimensionValue - (innerDimensionValue - minValue);
};

/**
 * Manages the databody and scroller sizing when the scrollbars are added and
 * removed scrollbars from the grid. This allows the grid container to maintain
 * size as it renders scrollbars inside rahther than out. Method mimics resizeGrid
 */
DvtDataGrid.prototype.manageResizeScrollbars = function()
{
    var width, height, colHeader, rowHeader, scroller, databody, colHeaderHeight, rowHeaderWidth,
            databodyContentWidth, databodyWidth, databodyContentHeight, databodyHeight, isDatabodyHorizontalScrollbarRequired,
            isDatabodyVerticalScrollbarRequired, scrollbarSize, dir, scrollerHeight, scrollerWidth,
            deltaX = 0, deltaY = 0;

    width = this.getWidth();
    height = this.getHeight();
    colHeader = this.m_colHeader;
    rowHeader = this.m_rowHeader;
    scroller = this.m_scroller;
    databody = this.m_databody;

    // cache these since they will be used in multiple places and we want to minimize reflow
    colHeaderHeight = this.getColumnHeaderHeight();
    rowHeaderWidth = this.getRowHeaderWidth();
    scrollerHeight = height - colHeaderHeight;
    scrollerWidth = width - rowHeaderWidth;

    dir = this.getResources().isRTLMode() ? "right" : "left";

    if (!this._databodyEmpty())
    {
        databodyContentWidth = this.getElementWidth(databody['firstChild']);
        databodyContentHeight = this.getElementHeight(databody['firstChild']);

        //adjusted to make the databody wrap the databody content, and the scroller to fill the remaing part of the grid
        //this way our scrollbars are always at the edges of our viewport

        databodyWidth = Math.min(databodyContentWidth, scrollerWidth);
        databodyHeight = Math.min(databodyContentHeight, scrollerHeight);

        scrollbarSize = this.m_utils.getScrollbarSize();

        //determine which scrollbars are required, if needing one forces need of the other, allows rendering within the root div
        isDatabodyHorizontalScrollbarRequired = this.isDatabodyHorizontalScrollbarRequired(scrollerWidth);
        if (isDatabodyHorizontalScrollbarRequired)
        {
            isDatabodyVerticalScrollbarRequired = this.isDatabodyVerticalScrollbarRequired(scrollerHeight - scrollbarSize);
        }
        else
        {
            isDatabodyVerticalScrollbarRequired = this.isDatabodyVerticalScrollbarRequired(scrollerHeight);
            if (isDatabodyVerticalScrollbarRequired)
            {
                isDatabodyHorizontalScrollbarRequired = this.isDatabodyHorizontalScrollbarRequired(scrollerWidth - scrollbarSize);
            }
        }

        //There what seems to be a browser bug on scrollbars appearing when the values are the same for scroller, and scroller[firstchild]
        //This was in the old code, but didn't get put into the updated version
        if (!isDatabodyVerticalScrollbarRequired && !isDatabodyHorizontalScrollbarRequired && this.m_hasHorizontalScroller && this.m_hasVerticalScroller)
        {
            //workaround for scrollbars not hiding
            scroller['style']['overflow'] = "visible";
        }
        if ((isDatabodyVerticalScrollbarRequired && isDatabodyHorizontalScrollbarRequired && !this.m_hasHorizontalScroller && !this.m_hasVerticalScroller)
                || (isDatabodyVerticalScrollbarRequired && !this.m_hasVerticalScroller)
                || (isDatabodyHorizontalScrollbarRequired && !this.m_hasHorizontalScroller))
        {
            scroller['style']['overflow'] = "auto";

        }

        this.m_hasHorizontalScroller = isDatabodyHorizontalScrollbarRequired;
        this.m_hasVerticalScroller = isDatabodyVerticalScrollbarRequired;

        //appropriatley set the width and height in the scrollabr case
        if (isDatabodyHorizontalScrollbarRequired)
        {
            //if the scroller position is bigger than the databody
            if (((scrollerHeight - scrollbarSize) < databodyHeight))
            {
                //if the visible height is going to be less than the databody height, set the databody height to the visible height
                databodyHeight = scrollerHeight - scrollbarSize;
            }
        }
        if (isDatabodyVerticalScrollbarRequired)
        {
            //if the visible width is going to be less than the databody width, set the databody width to the visible width
            if (((scrollerWidth - scrollbarSize) < databodyWidth))
            {
                databodyWidth = scrollerWidth - scrollbarSize;
            }
        }

        this.setElementHeight(rowHeader, databodyHeight);
        this.setElementWidth(colHeader, databodyWidth);
        this.setElementWidth(databody, databodyWidth);
        this.setElementHeight(databody, databodyHeight);
        this.setElementWidth(scroller, scrollerWidth);
        this.setElementHeight(scroller, scrollerHeight);

        // cache the scroll width and height to minimize reflow
        this.m_scrollWidth = databodyContentWidth - databodyWidth;
        this.m_scrollHeight = databodyContentHeight - databodyHeight;
    }

    if (this.m_empty != null)
    {
        this.setElementDir(this.m_empty, colHeaderHeight, 'top');
        this.setElementDir(this.m_empty, rowHeaderWidth, dir);
    }

    this.setElementDir(rowHeader, colHeaderHeight, 'top');
    this.setElementDir(colHeader, rowHeaderWidth, dir);
    this.setElementDir(databody, colHeaderHeight, 'top');
    this.setElementDir(databody, rowHeaderWidth, dir);
    this.setElementDir(scroller, colHeaderHeight, 'top');
    this.setElementDir(scroller, rowHeaderWidth, dir);

    this.buildCorners();

    // on touch devices the scroller doesn't automatically scroll into view when resizing the last columns or rows to be smaller
    if (this.m_utils.isTouchDevice())
    {
        // if the visible window plus the scrollLeft is bigger than the scrollable region maximum, rescroll the window
        if (this.m_currentScrollLeft > this.m_scrollWidth)
        {
            deltaX = this.m_scrollWidth - this.m_currentScrollLeft;
        }

        if (this.m_currentScrollTop > this.m_scrollHeight)
        {
            deltaY = this.m_scrollHeight - this.m_currentScrollTop;
        }

        if (deltaX != 0 || deltaY != 0)
        {
            // eliminate bounce back for touch scroll
            this._disableTouchScrollAnimation();
            this.scrollDelta(deltaX, deltaY);
        }
    }
};

/**
 * Resizes all cell in the resizing element's column, and updates the left(right)
 * postion on the cells and column headers that follow(preceed) that column.
 * @param {number} widthChange - the change in width of the resizing element
 */
DvtDataGrid.prototype.resizeColumnWidthAndShift = function(widthChange)
{
    var dir, databodyRows, i, newStart, j, index, cells, cell, newWidth;
    dir = this.getResources().isRTLMode() ? "right" : "left";

    // hide the databody and col header for performance
    this.m_databody['style']['display'] = 'none';
    this.m_colHeader['style']['display'] = 'none';

    //get the index of the header, if it is a nested header make it the last child index
    index = this.getHeaderCellIndex(this.m_resizingElement);
    if (this.m_columnHeaderLevelCount > 1
            && this.m_resizingElement === this.m_resizingElement['parentNode']['firstChild']
            && this.m_resizingElement['nextSibling'] != null) // has children
    {
        index += this._getAttribute(this.m_resizingElement['parentNode'], 'extent', true) - 1;
    }

    // move column headers within the container and adjust the widths appropriately
    this._shiftHeadersAlongAxisInContainer(this.m_colHeader['firstChild'], index, widthChange, dir, this.getMappedStyle('colheadercell'), 'column');

    // shift the cells widths and left/right values in the databody
    if (this.m_databody['firstChild'] != null)
    {
        databodyRows = this.m_databody['firstChild']['childNodes'];
        for (i = 0; i < databodyRows.length; i++)
        {
            cells = databodyRows[i]['childNodes'];
            // set the new width on the appropriate column
            cell = cells[index - this.m_startCol];
            if (newWidth == null)
            {
                newWidth = this.getElementWidth(cell) + widthChange;
            }
            this.setElementWidth(cell, newWidth);

            // move the columns within the data body to account for width change
            for (j = index - this.m_startCol + 1; j < this.m_endCol - this.m_startCol + 1; j += 1)
            {
                cell = cells[j];
                newStart = this.getElementDir(cell, dir) + widthChange;
                this.setElementDir(cell, newStart, dir);
            }
        }
    }

    //restore visibility
    this.m_databody['style']['display'] = '';
    this.m_colHeader['style']['display'] = '';
};

/**
 * Resizes the resizing elements row, and updates the top
 * postion on the rows and row headers that follow that column.
 * @param {number} heightChange - the change in width of the resizing element
 */
DvtDataGrid.prototype.resizeRowHeightAndShift = function(heightChange)
{
    var databodyRows, i, newStart, index, row, newHeight;

    // hide the databody and row header for performance
    this.m_databody['style']['display'] = 'none';
    this.m_rowHeader['style']['display'] = 'none';

    //get the index of the header, if it is a nested header make it the last child index
    index = this.getHeaderCellIndex(this.m_resizingElement);
    if (this.m_rowHeaderLevelCount > 1
            && this.m_resizingElement === this.m_resizingElement['parentNode']['firstChild']
            && this.m_resizingElement['nextSibling'] != null) // has children)
    {
        index += this._getAttribute(this.m_resizingElement['parentNode'], 'extent', true) - 1;
    }

    // move row headers within the container
    this._shiftHeadersAlongAxisInContainer(this.m_rowHeader['firstChild'], index, heightChange, 'top', this.getMappedStyle('rowheadercell'), 'row');

    // shift the rows in the databody
    if (this.m_databody['firstChild'] != null)
    {
        databodyRows = this.m_databody['firstChild']['childNodes'];
        row = databodyRows[index - this.m_startRow];
        newHeight = this.getElementHeight(row) + heightChange;
        this.setElementHeight(row, newHeight);
        // +1 for the header we just did
        for (i = index - this.m_startRow + 1; i < databodyRows.length; i++)
        {
            row = databodyRows[i];
            newStart = this.getElementDir(row, 'top') + heightChange;
            this.setElementDir(row, newStart, 'top');
        }
    }

    this.m_databody['style']['display'] = '';
    this.m_rowHeader['style']['display'] = '';
};

/**
 * This method recursively shifts a group over until it reaches the index where the group width/height needs to be adjusted
 * @param {Element} headersContainer the header grouping or scroller
 * @param {number} index the index that is being adjusted
 * @param {number} dimensionChange the change in width or height
 * @param {string} dir top, left, or right the appropriate value to adjust along the axis
 * @param {string} className the header cell className along that axis
 * @param {string} axis the axis we are shifting on
 * @private
 */
DvtDataGrid.prototype._shiftHeadersAlongAxisInContainer = function(headersContainer, index, dimensionChange, dir, className, axis)
{
    var element, header, isHeader, groupingContainer, headerStart, headers, i, newStart, newVal, levelCount, depth;

    // get the last element in the container
    element = headersContainer['lastChild'];
    // is the last element a header or a group
    isHeader = this.m_utils.containsCSSClassName(element, className);
    // what is the index of the container/header
    if (isHeader)
    {
        groupingContainer = element['parentNode'];
        header = element;
        headerStart = this.getHeaderCellIndex(header);
    }
    else
    {
        groupingContainer = element;
        header = element['firstChild'];
        headerStart = this._getAttribute(groupingContainer, 'start', true);
    }

    // if the group is after the specified index move all the dir values under that group
    while (index < headerStart)
    {
        if (isHeader)
        {
            //move this header to the right left up down
            newStart = this.getElementDir(header, dir) + dimensionChange;
            this.setElementDir(header, newStart, dir);

            element = element['previousSibling'];
            isHeader = this.m_utils.containsCSSClassName(element, className);
            groupingContainer = element['parentNode'];
            header = element;
            headerStart = this.getHeaderCellIndex(header);
        }
        else
        {
            //move all children of a group
            headers = groupingContainer.getElementsByClassName(className);
            for (i = 0; i < headers.length; i++)
            {
                newStart = this.getElementDir(headers[i], dir) + dimensionChange;
                this.setElementDir(headers[i], newStart, dir);
            }

            element = element['previousSibling'];
            isHeader = this.m_utils.containsCSSClassName(element, className);
            groupingContainer = element;
            header = element['firstChild'];
            headerStart = this._getAttribute(groupingContainer, 'start', true);
        }
    }

    if (axis == 'column')
    {
        //the last header we moved to should be the one that needs its width updated
        newVal = this.getElementWidth(header) + dimensionChange;
        this.setElementWidth(header, newVal);
    }
    else
    {
        newVal = this.getElementHeight(header) + dimensionChange;
        this.setElementHeight(header, newVal);
    }

    // if we aren't innermost then repeat for its children
    if (!isHeader && header['nextSibling'] != null) // has children
    {
        this._shiftHeadersAlongAxisInContainer(element, index, dimensionChange, dir, className, axis);
    }
    else
    {
        //store the width/height change in the sizing manager, only care about innermost
        this.m_sizingManager.setSize(axis, this._getKey(header), newVal);
    }
};

/**
 * Resizes all cell in the resizing element's column, and updates the left(right)
 * postion on the cells and column headers that follow(preceed) that column.
 * @param {number} heightChange - the change in width of the resizing element
 * @param {number} level - the level we are resizing
 */
DvtDataGrid.prototype.resizeColumnHeightsAndShift = function(heightChange, level)
{
    // hide the databody and col header for performace
    this.m_databody['style']['display'] = 'none';
    this.m_colHeader['style']['display'] = 'none';

    // move column headers within the container
    this._shiftHeadersDirInContainer(this.m_colHeader['firstChild'], heightChange, level, 'top', this.getMappedStyle('colheadercell'), 'column');

    this.m_databody['style']['display'] = '';
    this.m_colHeader['style']['display'] = '';
};

/**
 * Resizes all cell in the resizing element's column, and updates the left(right)
 * postion on the cells and column headers that follow(preceed) that column.
 * @param {number} widthChange - the change in width of the resizing element
 * @param {number} level - the level we are resizing
 */
DvtDataGrid.prototype.resizeRowWidthsAndShift = function(widthChange, level)
{
    var dir = this.getResources().isRTLMode() ? "right" : "left";

    // hide the databody and row header for performace
    this.m_databody['style']['display'] = 'none';
    this.m_rowHeader['style']['display'] = 'none';

    // move row headers within the container
    this._shiftHeadersDirInContainer(this.m_rowHeader['firstChild'], widthChange, level, dir, this.getMappedStyle('rowheadercell'), 'row');

    this.m_databody['style']['display'] = '';
    this.m_rowHeader['style']['display'] = '';
};

/**
 * Shifts the headers after a particular level over and adjusts the dimension of that level across the whole container
 * @param {Element} headersContainer
 * @param {number} dimensionChange
 * @param {number} level
 * @param {string} dir
 * @param {string} className
 * @param {string} axis
 * @private
 */
DvtDataGrid.prototype._shiftHeadersDirInContainer = function(headersContainer, dimensionChange, level, dir, className, axis)
{
    var groupings, i, grouping, isHeader, headerLevel, headers, newDir, j, headerDepth;
    groupings = headersContainer['childNodes'];
    // for all children in the group
    for (i = 0; i < groupings.length; i++)
    {
        grouping = groupings[i];
        isHeader = this.m_utils.containsCSSClassName(grouping, className);
        //if it is a group
        if (!isHeader)
        {
            headerLevel = this._getAttribute(grouping, 'level', true);
            // if before or on the level we need to go deeper into the grouping
            if (headerLevel <= level)
            {
                this._shiftHeadersDirInContainer(grouping, dimensionChange, level, dir, className, axis);
            }
            else
            {
                // if level is higher then we need to adjust the dir of all the headers under that group
                headers = grouping.getElementsByClassName(className);
                for (j = 0; j < headers.length; j++)
                {
                    newDir = this.getElementDir(headers[j], dir) + dimensionChange;
                    this.setElementDir(headers[j], newDir, dir);
                }
            }
        }
        else
        {
            headerLevel = this.getHeaderCellLevel(grouping);
            headerDepth = this.getHeaderCellDepth(grouping);

            // if we have a header at that level adjust it's value
            if (headerLevel <= level && level < headerLevel + headerDepth)
            {
                if (axis === 'column')
                {
                    newDir = this.getElementHeight(grouping, dir) + dimensionChange;
                    this.setElementHeight(grouping, newDir);
                }
                else
                {
                    newDir = this.getElementWidth(grouping, dir) + dimensionChange;
                    this.setElementWidth(grouping, newDir);
                }
            }
            // if we have a header inside the group then adjust its dimension
            else if (headerLevel > level)
            {
                newDir = this.getElementDir(grouping, dir) + dimensionChange;
                this.setElementDir(grouping, newDir, dir);
            }
        }
    }
};

/**
 * Takes the original target of the context menu and maps it to the appropriate
 * column/row header to resize and selects the right resize function.
 * @param {Event} event - the event that spawned context menu
 * @param {string} id - 'width' or 'height'
 * @param {string} val - new width or height to resize to
 * @param {Element} target - the target element
 */
DvtDataGrid.prototype.handleContextMenuResize = function(event, id, val, target)
{
    var initialWidth, initialHeight, newWidth, newHeight, value, details;
    value = parseInt(val, 10);
    if (this.m_utils.containsCSSClassName(target, this.getMappedStyle('cell')))
    {
        if (id === this.m_resources.getMappedCommand('resizeHeight'))
        {
            target = this.getHeaderFromCell(target, 'row');
        }
        else
        {
            target = this.getHeaderFromCell(target, 'column');
        }
    }

    this.m_resizingElement = target;
    initialWidth = this.getElementWidth(target);
    initialHeight = this.getElementHeight(target)
    if (id === this.m_resources.getMappedCommand('resizeWidth'))
    {
        if (initialWidth !== value)
        {
            if (this.m_utils.containsCSSClassName(this.m_resizingElement, this.getMappedStyle('colheadercell')))
            {
                if (this._isDOMElementResizable(this.m_resizingElement))
                {
                    this.resizeColWidth(initialWidth, value);
                }
            }
            else
            {
                this.resizeRowWidth(value, value - initialWidth);
            }
        }
    }
    else if (id === this.m_resources.getMappedCommand('resizeHeight'))
    {
        initialHeight = this.getElementHeight(target);
        if (initialHeight !== value)
        {
            if (this.m_utils.containsCSSClassName(this.m_resizingElement, this.getMappedStyle('colheadercell')))
            {
                this.resizeColHeight(value, value - initialHeight);
            } else
            {
                if (this._isDOMElementResizable(this.m_resizingElement))
                {
                    this.resizeRowHeight(initialHeight, value);
                }
            }
        }
    }
    
    newWidth = this.getElementWidth(target);
    newHeight = this.getElementHeight(target)
    if (newWidth != initialWidth || newHeight != initialHeight)
    {
        //set the information we want to callback with in the resize event and callback
        details = {
            'event': event, 
            'ui': {
                'header': this._getKey(this.m_resizingElement), 
                'oldDimensions' : {
                    'width': initialWidth,
                    'height': initialHeight
                },
                'newDimensions' : {
                    'width': newWidth,
                    'height': newHeight           
                },
                // deprecating this part in 2.1.0
                'size': value
            }
        };    
        this.fireEvent('resize', details);
        
        this.buildCorners();
        // re-align touch affordances
        if (this.m_utils.isTouchDevice())
        {
            this._moveTouchSelectionAffordance();
        }        
    }
    
    this.m_resizingElement = null;
};

/**
 * Get the edges (left,right,top,bottom) pixel locations relative to the page
 * @param {HTMLElement} elem - the element to find edges of
 * @return {Array.<number>} An array of numbers [leftEdge, topEdge, rightEdge, bottomEdge]
 */
DvtDataGrid.prototype.getHeaderEdgePixels = function(elem)
{
    var elementXY, leftEdge, topEdge, rightEdge, bottomEdge, targetWidth, targetHeight;
    elementXY = this.findPos(elem);
    leftEdge = elementXY[0];
    topEdge = elementXY[1];
    if (this.m_utils.containsCSSClassName(elem, this.getMappedStyle('colheadercell')))
    {
        targetWidth = this.calculateColumnHeaderWidth(elem);
        targetHeight = this.getElementHeight(elem);
    }
    else
    {
        targetWidth = this.getElementWidth(elem);
        targetHeight = this.calculateRowHeaderHeight(elem);
    }
    rightEdge = leftEdge + targetWidth;
    bottomEdge = topEdge + targetHeight;
    return [leftEdge, topEdge, rightEdge, bottomEdge];
};

/**
 * @preserve Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

DvtDataGrid.SORT_ANIMATION_DURATION = 800;

/**
 * Event handler for handling mouse over event on headers.
 * @param {Event} event the DOM event
 * @private
 */
DvtDataGrid.prototype._handleSortMouseOver = function(event)
{
    if (!this._databodyEmpty())
    {
        // checks if the mouse out is trigger by leaving the sort icons
        // the event can now enter the sort container
        var header = this.findHeader(event.target);
        if (header)
        {
            this._showOrHideSortIcon(header, false);
        }

        //if we are hovering the icon add hover class
        if (this.m_utils.containsCSSClassName(event.target, this.getMappedStyle("sortascending"))
                || this.m_utils.containsCSSClassName(event.target, this.getMappedStyle("sortdescending")))
        {
            this.m_utils.addCSSClassName(event.target, this.getMappedStyle("hover"));
        }
    }
};

/**
 * Event handler for handling mouse out event on headers.
 * @param {Event} event the DOM event
 * @private
 */
DvtDataGrid.prototype._handleSortMouseOut = function(event)
{
    if (!this._databodyEmpty())
    {
        var header = this.findHeader(event.target);
        //if there is no header or we didn't just exit the content of the header
        if (header == null || event.relatedTarget == null ? true : header !== this.findHeader(event.relatedTarget))
        {
            this._showOrHideSortIcon(header, true);
        }

        //if we are done hovering the icon remove hover class
        if (this.m_utils.containsCSSClassName(event.target, this.getMappedStyle("sortascending"))
                || this.m_utils.containsCSSClassName(event.target, this.getMappedStyle("sortdescending")))
        {
            this.m_utils.removeCSSClassName(event.target, this.getMappedStyle("hover"));
            this.m_utils.removeCSSClassName(event.target, this.getMappedStyle("selected"));
        }
    }
};

/**
 * Add the selcted color on mousedown
 * @param {Element} icon the icon to set selected on
 * @private
 */
DvtDataGrid.prototype._handleSortIconMouseDown = function(icon)
{
    if (!this._databodyEmpty())
    {
        this.m_utils.addCSSClassName(icon, this.getMappedStyle("selected"));
    }
};

/**
 * Show or hide the sort indicator icons.
 * @param {Element} header the dom element of the header to switch icon direction in
 * @param {string} direction asecnding or descending to switch to
 * @private
 */
DvtDataGrid.prototype._toggleSortIconDirection = function(header, direction)
{
    var icon;
    if (header != null)
    {
        // shows the sort indicator
        icon = this._getSortIcon(header);
        if (direction === 'descending' && this.m_utils.containsCSSClassName(icon, this.getMappedStyle("sortascending")))
        {
            this.m_utils.removeCSSClassName(icon, this.getMappedStyle("sortascending"));
            this.m_utils.addCSSClassName(icon, this.getMappedStyle("sortdescending"));
        }
        else if (direction === 'ascending' && this.m_utils.containsCSSClassName(icon, this.getMappedStyle("sortdescending")))
        {
            this.m_utils.removeCSSClassName(icon, this.getMappedStyle("sortdescending"));
            this.m_utils.addCSSClassName(icon, this.getMappedStyle("sortascending"));
        }
    }
};

/**
 * Show or hide the sort indicator icons.
 * @param {Element} header the dom event
 * @param {boolean} hide true if hide the icons, false to show the icons
 * @private
 */
DvtDataGrid.prototype._showOrHideSortIcon = function(header, hide)
{
    var icon, sorted = false;
    // shows the sort indicator
    if (header != null)
    {
        icon = this._getSortIcon(header);
        if (this.m_sortInfo != null)
        {
            sorted = this.m_sortInfo['key'] === this._getKey(header);
        }
        if (hide === false && !sorted)
        {
            this.m_utils.removeCSSClassName(icon, this.getMappedStyle("disabled"));
            this.m_utils.addCSSClassName(icon, this.getMappedStyle("default"));
        }
        else if (hide === true && !sorted)
        {
            this.m_utils.removeCSSClassName(icon, this.getMappedStyle("default"));
            this.m_utils.addCSSClassName(icon, this.getMappedStyle("disabled"));
        }
    }
};

/**
 * Creates the sort indicator icons and the panel around them.
 * @param {Object} headerContext a header context object, contianing key
 * @return {Element} the sort indicator icons panel
 * @private
 */
DvtDataGrid.prototype._buildSortIcon = function(headerContext)
{
    var sortIcon, iconClassString, key, direction, sortContainer;
    //sort container is used to create fade effect
    sortContainer = document.createElement("div");
    sortContainer['className'] = this.getMappedStyle("sortcontainer");

    sortIcon = document.createElement("div");
    iconClassString = this.getMappedStyle("icon") + " " + this.getMappedStyle("clickableicon");
    key = this.m_sortInfo != null ? this.m_sortInfo['key'] : null;

    //handles the case where we scroll the header which was sorted on, off screen and come back to them
    if (headerContext['key'] === key)
    {
        direction = this.m_sortInfo != null ? this.m_sortInfo['direction'] : null;
        if (direction === 'ascending')
        {
            sortIcon['className'] = this.getMappedStyle("sortascending") + " " + iconClassString + " " + this.getMappedStyle("default");
        }
        else if (direction === 'descending')
        {
            sortIcon['className'] = this.getMappedStyle("sortdescending") + " " + iconClassString + " " + this.getMappedStyle("default");
        }
    }
    else
    {
        iconClassString += " " + this.getMappedStyle("disabled");
        sortIcon['className'] = this.getMappedStyle("sortascending") + " " + iconClassString;
    }
    sortContainer.appendChild(sortIcon); //@HTMLUpdateOK
    return sortContainer;
};

/**
 * Handles sorting using keyboard (enter key while focus on header).  See HandleHeaderKeyDown.
 * @param {Element} header header being sorted on
 * @param {Event} event DOM keyboard event triggering sort
 * @private
 */
DvtDataGrid.prototype._handleKeyboardSort = function(header, event)
{
    if (!this._databodyEmpty())
    {
        var direction = header.getAttribute(this.getResources().getMappedAttribute('sortDir'));
        if (direction == null || direction === "descending")
        {
            direction = "ascending";
        }
        else
        {
            direction = "descending";
        }

        this._doHeaderSort(event, header, direction);
    }
};

/**
 * Handles click on the header, this would perform the sort operation.
 * @param {Event} event the DOM event
 * @param {string} direction asecnding or descending to sort on
 * @private
 */
DvtDataGrid.prototype._handleHeaderSort = function(event, direction)
{
    var target, header;
    if (!this._databodyEmpty())
    {
        target = event.target;

        header = this.findHeader(target);
        if (header != null)
        {
            // use the class name to determine if it's asecnding or descending
            if (direction == null)
            {
                if (this.m_sortInfo != null && this.m_sortInfo['key'] === this._getKey(header))
                {
                    if (this.m_sortInfo['direction'] === 'ascending')
                    {
                        direction = 'descending';
                    }
                    else
                    {
                        direction = 'ascending';
                    }
                }
                else
                {
                    //we should get here on inital touch sort only
                    direction = 'ascending';
                }
            }
            this._doHeaderSort(event, header, direction);
        }
    }
};

/**
 * Handles click on the header, this would perform the sort operation.
 * @param {Event} event the DOM event
 * @param {string} direction asecnding or descending to switch to
 * @param {Element} header the header to sort on
 * @private
 */
DvtDataGrid.prototype._handleCellSort = function(event, direction, header)
{
    var target;
    target = event.target;
    if (header != null && !this._databodyEmpty())
    {
        this._doHeaderSort(event, header, direction);
    }
};

/**
 * Handles click on the header, this would perform the sort operation.
 * @param {Event} event the DOM event
 * @param {Element} header the header element
 * @param {string} direction the sort direction
 * @private
 */
DvtDataGrid.prototype._doHeaderSort = function(event, header, direction)
{
    var key, axis, criteria;
    if (this.m_isSorting != true)
    {
        this.m_delayedSort = null;

        // get the key and axis
        key = this._getKey(header);
        axis = this._getAxis(header);

        this._removeSortSelection();

        // needed for toggle and screenreader
        header.setAttribute(this.getResources().getMappedAttribute('sortDir'), direction);
        this.m_sortInfo = {'event': event, 'key': key, 'axis': axis, 'direction': direction};

        //flip the icon direction
        this._toggleSortIconDirection(header, direction);
        this._addSortSelection();

        // creates the criteria object and invoke sort on the data source
        if (direction != null && key != null && axis != null)
        {
            this.m_isSorting = true;
            // show status message
            this.showStatusText();

            // invoke sort
            criteria = {"axis": axis, "key": key, "direction": direction};
            this.getDataSource().sort(criteria, {"success": this._handleSortSuccess.bind(this), "error": this._handleSortError.bind(this)});
        }

        // update screen reader alert
        this._setAccInfoText(direction === 'ascending' ? 'accessibleSortAscending' : 'accessibleSortDescending', {'id': key});
    }
    else
    {
        this.m_delayedSort = {'event': event, 'header': header, 'direction': direction};
    }
};

/**
 * Callback method invoked when the sort operation failed.
 * @private
 */
DvtDataGrid.prototype._handleSortError = function()
{
    this.hideStatusText();
};

/**
 * Remove the selected style class from the previous sorted sort icon, and add disabled back to it
 * @private
 */
DvtDataGrid.prototype._removeSortSelection = function()
{
    var oldSortedHeader, oldsortIcon;
    if (this.m_sortInfo != null)
    {
        //get the header that was sorted on and the icon within it based on the values stored in this.m_sortInfo
        oldSortedHeader = this._findColumnHeaderByKey(this.m_sortInfo['key']);
        oldSortedHeader.removeAttribute(this.getResources().getMappedAttribute('sortDir'));
        oldsortIcon = this._getSortIcon(oldSortedHeader);
        //flip icon back to ascending
        this._toggleSortIconDirection(oldSortedHeader, 'ascending');
        if (this.m_sortInfo['direction'] === 'descending')
        {
            //switch back to the default ascending icon
            this.m_utils.removeCSSClassName(oldsortIcon, this.getMappedStyle("sortdescending"));
            this.m_utils.addCSSClassName(oldsortIcon, this.getMappedStyle("sortascending"));
        }
        //disable the icon to hide it, remove the selected style
        this.m_utils.addCSSClassName(oldsortIcon, this.getMappedStyle('disabled'));
        this.m_utils.removeCSSClassName(oldsortIcon, this.getMappedStyle('default'));
        this.m_utils.removeCSSClassName(this._getSortContainer(oldSortedHeader), this.getMappedStyle('enabled'));
    }
};

/**
 * Add the selected style class to the newly sorted sort icon and remove disabled from it
 * @private
 */
DvtDataGrid.prototype._addSortSelection = function()
{
    var sortedHeader, sortIcon;
    if (this.m_sortInfo != null)
    {
        //get the header that is sorted on and the icon within it based on the values stored in this.m_sortInfo
        sortedHeader = this._findColumnHeaderByKey(this.m_sortInfo['key']);
        sortIcon = this._getSortIcon(sortedHeader);

        //select the icon to show it, remove the disabled style
        this.m_utils.addCSSClassName(sortIcon, this.getMappedStyle('default'));
        this.m_utils.removeCSSClassName(sortIcon, this.getMappedStyle('disabled'));
        this.m_utils.removeCSSClassName(sortIcon, this.getMappedStyle('selected'));
        this.m_utils.addCSSClassName(this._getSortContainer(sortedHeader), this.getMappedStyle('enabled'));
    }
};

/**
 * Determine the axis of the header.
 * @param {Element} header the header to determine the axis, returns either "row" or "column".
 * @return {string|null} the axis of the header
 * @private
 */
DvtDataGrid.prototype._getAxis = function(header)
{
    var columnHeaderCellClassName, rowHeaderCellClassName;

    columnHeaderCellClassName = this.getMappedStyle("colheadercell");
    rowHeaderCellClassName = this.getMappedStyle("rowheadercell");

    if (this.m_utils.containsCSSClassName(header, columnHeaderCellClassName))
    {
        return "column";
    }

    if (this.m_utils.containsCSSClassName(header, rowHeaderCellClassName))
    {
        return "row";
    }

    return null;
};

/**
 * Callback method invoked when the sort operation completed successfully.
 * @private
 */
DvtDataGrid.prototype._handleSortSuccess = function()
{
    // hide the message
    this.hideStatusText();

    // sort is completed successfully, now fetch the sorted data
    if (this._isDatabodyCellActive())
    {
        // scroll position should go to the new active cell location if virtual
        this._indexes({'row': this.m_active['keys']['row'], 'column': this.m_active['keys']['column']}, this._handlePreSortScrolling);
    }
    else
    {
        // scroll position should remain unchanged if high watermark or virtual without an active cell
        this._fetchForSort(this.m_startRow, this.m_endRow - this.m_startRow + 1, false);
    }
};

/**
 * Handle scrolling of the datagrid before fetching the data
 * @param {Object} indexes index of the new location of the active cell
 */
DvtDataGrid.prototype._handlePreSortScrolling = function(indexes)
{
    var rowIndex, startRow, cellTop, cellBottom, startRowPixel, isInRenderedRange, isHighWatermark, isInVisibleRange;
    rowIndex = indexes['row'] === -1 ? 0 : indexes['row'];
    cellTop = rowIndex * this.m_avgRowHeight;
    cellBottom = cellTop + this.m_avgRowHeight

    isHighWatermark = this._isHighWatermarkScrolling();
    isInRenderedRange = this._isInViewport(indexes) != -1;
    isInVisibleRange = this.m_currentScrollTop <= cellTop && cellBottom <= this.m_currentScrollTop + this.getElementHeight(this.m_databody);

    // cell is in rendered range and visible, or high watermark regardless of visibilty,
    // do a refetch of the current viewport and no scrolling
    if (isInVisibleRange || (isHighWatermark)) //&& !isInRenderedRange))
    {
        this._fetchForSort(this.m_startRow, this.m_endRow - this.m_startRow + 1, false);
    }

    // we have deceided not to prescroll on high watermark because the active cell
    // was hard to follow through the animation, if we wanted that behavior in the
    // future simlpy follow the format commented out below and above
    // cell is in rendered range but not visible on high watermak,
    // do a scroll to the new position with a refresh of the whole viewport
    //else if (isHighWatermark && isInRenderedRange)
    //{
    //    // set a new scrollTop to the top of that cell or the closest it can be
    //    this.m_currentScrollTop = Math.min(cellTop, this.m_scrollHeight);
    //    this._fetchForSort(this.m_startRow, this.m_endRow - this.m_startRow + 1, true);
    //}
    //
    // in virtual scrolling and not outside of the visible range scroll to the new location and refresh
    else
    {
        // get the scroll top that it will need to be
        this.m_currentScrollTop = Math.min(cellTop, this._getMaxScrollHeight());

        //find the start row we need to fetch at that scroll position
        startRow = Math.floor(this.m_currentScrollTop / this.m_avgRowHeight);

        startRowPixel = startRow * this.m_avgRowHeight;
        // reset ranges on rows
        this.m_startRow = startRow;
        this.m_endRow = -1;
        this.m_startRowHeader = startRow;
        this.m_endRowHeader = -1;
        this.m_startRowPixel = startRowPixel;
        this.m_endRowPixel = startRowPixel;
        this.m_startRowHeaderPixel = startRowPixel;
        this.m_endRowHeaderPixel = startRowPixel;

        this._fetchForSort(startRow, null, true);
    }
};

/**
 * A method to fetch data with the correct sort callbacks
 * @param {number} startRow
 * @param {number} rowCount
 * @param {boolean} scroll true if we need to pre scroll the datagrid
 */
DvtDataGrid.prototype._fetchForSort = function(startRow, rowCount, scroll)
{
    var rowHeaderFragment = document.createDocumentFragment();
    this.fetchHeaders("row", startRow, rowHeaderFragment, rowCount, {"success": this.handleHeadersFetchSuccessForSort.bind(this), "error": this.handleCellsFetchError});
    this.fetchCells(this.m_databody, this.m_scroller, startRow, this.m_startCol, rowCount, this.m_endCol - this.m_startCol + 1, {"success": this.handleCellsFetchSuccessForSort.bind(this, rowHeaderFragment, scroll), "error": this.handleCellsFetchError});
};

/**
 * Handle a successful call to the data source fetchHeaders for sorting. Used to populate the new headers fragment.
 * @param {Array.<(Object|string)>} headerSet - an array of headers returned from the dataSource
 * @param {Object} headerRange - {"axis":,"start":,"count":,"header":}
 * @param {boolean} rowInsert - if this is triggered by a row insert event
 * @protected
 */
DvtDataGrid.prototype.handleHeadersFetchSuccessForSort = function(headerSet, headerRange, rowInsert)
{
    var axis, headerFragment, start, headerCount, c, index, totalRowHeight, returnVal, className, renderer;
    axis = headerRange["axis"];
    start = headerRange["start"];
    headerFragment = headerRange["header"];
    headerCount = headerSet.getCount();

    // remove fetching message
    this.m_fetching[axis] = false;

    // add the headers to the row header
    totalRowHeight = 0;
    c = 0;
    className = this.getMappedStyle("row") + " " + this.getMappedStyle("headercell") + " " + this.getMappedStyle("rowheadercell");
    renderer = this.m_options.getRenderer("row");
    while (headerCount - c > 0)
    {
        index = start + c;
        returnVal = this.buildLevelHeaders(headerFragment, index, 0, 0, this.m_startRowPixel + totalRowHeight, true, rowInsert, renderer, headerSet, 'row', className, this.m_rowHeaderLevelCount);
        c += returnVal['count'];
        totalRowHeight += returnVal['totalHeight'];
    }
    this.m_endRowHeader = this.m_startRowHeader + headerCount - 1;
    this.m_endRowHeaderPixel = this.m_startRowHeaderPixel + totalRowHeight;

    // end fetch
    this._signalTaskEnd();
};

/**
 * Handle a successful call to the data source fetchCells after sort.
 * @param {Element} newRowHeaderElements a document fragment containing the row headers and the fragment
 * @param {boolean=} scroll true if we need to pre scroll
 * @param {Object} cellSet a CellSet object which encapsulates the result set of cells
 * @param {Array.<Object>} cellRange [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 */
DvtDataGrid.prototype.handleCellsFetchSuccessForSort = function(newRowHeaderElements, scroll, cellSet, cellRange)
{
    var rowRange, rowStart, rowCount, columnRange, columnStart, columnCount, newRowElements, oldRowElements,
            oldRowHeaderElements, duration, returnVal, animate;

    this.m_fetching['cells'] = false;

    duration = DvtDataGrid.SORT_ANIMATION_DURATION;

    // size the grid if fetch is done
    if (this.isFetchComplete())
    {
        this.hideStatusText();
    }

    // obtain params for _addRows
    rowRange = cellRange[0];
    rowStart = rowRange['start'];
    rowCount = cellSet.getCount("row");

    columnRange = cellRange[1];
    columnStart = columnRange['start'];
    columnCount = cellSet.getCount("column");

    // the rows AFTER sort should be inside the newRowElements fragment
    newRowElements = document.createDocumentFragment();

    returnVal = this._addRows(newRowElements, true, this.m_startRowPixel, rowStart, rowCount, columnStart, false, cellSet);
    this.m_endRow = this.m_startRowHeader + rowCount - 1;
    this.m_endRowPixel = this.m_startRowPixel + returnVal['totalRowHeight'];

    oldRowElements = this.m_databody['firstChild'];
    oldRowHeaderElements = this.m_rowHeader['firstChild'];

    if (scroll == true)
    {
        // disable animation on virtual scrolling
        animate = this._isHighWatermarkScrolling();

        // scroll the databody
        if (!this.m_utils.isTouchDevice())
        {
            this.m_silentScroll = true;
            this.m_scroller['scrollTop'] = this.m_currentScrollTop;
            this._syncScroller();
        }
        else
        {
            // for touch we'll call scrollTo directly instead of relying on scroll event to fire due to performance
            this._disableTouchScrollAnimation();
            this.scrollTo(this.m_currentScrollLeft, this.m_currentScrollTop);
        }
    }

    // if there's only one row we don't need to animate
    // don't animate on multi-level headers
    if (!duration || duration == 0 || !this.m_utils.supportsTransitions() || rowCount === 1 ||
            (this.m_rowHeaderLevelCount > 1 && this.m_rowHeaderLevelCount != null) || animate === false)
    {
        // start task since both animation/non use handle sort end
        this._signalTaskStart();
        this._handleSortEnd(newRowElements, newRowHeaderElements);
    }
    else
    {
        this.processSortAnimationToPosition(duration, 0, "ease-in", oldRowHeaderElements, newRowHeaderElements, oldRowElements, newRowElements);
    }

    // end fetch
    this._signalTaskEnd();
};

/**
 * Handles a sort complete by replacing the dom with the new headers and cells,
 * restoring active and firing a sort event
 * @param {Element} newRowElements
 * @param {Element} newRowHeaderElements
 */
DvtDataGrid.prototype._handleSortEnd = function(newRowElements, newRowHeaderElements)
{
    var headerContent, databodyContent;
    if (newRowHeaderElements.childNodes.length > 1)
    {
        headerContent = this.m_rowHeader['firstChild'];
        this.m_utils.empty(headerContent);
        headerContent.appendChild(newRowHeaderElements); //@HTMLUpdateOK
    }

    databodyContent = this.m_databody['firstChild'];
    this.m_utils.empty(databodyContent);
    databodyContent.appendChild(newRowElements); //@HTMLUpdateOK

    // restore active cell
    this._restoreActive();
    this.m_isSorting = false;
    this._fireSortEvent();
    this._doDelayedSort();

    // end animation/sort
    this._signalTaskEnd();
};

/**
 * The main method for animation of the DataGrid rows from before-sort to the after-sort potitions
 * @param {number} duration the duration of animation
 * @param {number} delay_offset the initial delay of animation
 * @param {string} timing the easing function
 * @param {Element} oldRowHeaderElements the DOM structure on which the animation will be performed. Initially contains DOM elements in before sorting order
 * @param {Element} newRowHeaderElements the element that contains set of sub-elements in "after-sorting" order
 * @param {Object} oldElementSet the DOM structure on which the animation will be performed. Initially contains DOM elements in before sorting order
 * @param {Element} newElementSet the element that contains set of sub-elements in "after-sorting" order
 * @private
 */
DvtDataGrid.prototype.processSortAnimationToPosition = function(duration, delay_offset, timing, oldRowHeaderElements, newRowHeaderElements, oldElementSet, newElementSet)
{
    var self, rowKey, animationInformation, oldTop, newTop, rowsForAppend, rowHeadersForAppend, i, child,
            rowHeaderSupport, oldBottom, newBottom, newElementSetClone, newRowHeaderElementsClone,
            viewportTop, viewportBottom, lastAnimationElement;

    // initialize variables
    self = this;
    // animation start
    this._signalTaskStart();
    rowsForAppend = [];
    rowHeadersForAppend = [];
    rowHeaderSupport = newRowHeaderElements.childNodes.length > 1 ? true : false;
    viewportTop = this.m_currentScrollTop;
    viewportBottom = viewportTop + this.getElementHeight(this.m_databody);

    // clone the rows/headers
    newElementSetClone = newElementSet.cloneNode(true);
    newRowHeaderElementsClone = newRowHeaderElements ? newRowHeaderElements.cloneNode(true) : null;

    //animation information will be an object of objects as follows {key:{oldTop:val, newTop:val}}
    animationInformation = {};

    // loop over the old elements and set their old and new tops
    for (i = 0; i < oldElementSet.childNodes.length; i++)
    {
        child = oldElementSet.childNodes[i];
        rowKey = this._getKey(child);
        oldTop = this.getElementDir(child, 'top');
        oldBottom = oldTop + this.getElementHeight(child);
        // if the row is not visible at all, it will not need to move
        if (oldBottom < viewportTop || oldTop > viewportBottom)
        {
            newTop = oldTop;
        }
        // if the row is visible at all, set the newTop to be off screen for now
        else
        {
            newTop = viewportBottom;
        }
        animationInformation[rowKey] = {oldTop: oldTop, newTop: newTop};
    }

    // loop over the new elements and set their old and new tops
    for (i = 0; i < newElementSet.childNodes.length; i++)
    {
        child = newElementSet.childNodes[i];
        rowKey = this._getKey(child);
        newTop = this.getElementDir(child, 'top');

        //the new keys aren't cloned so make sure they clone
        this._setKey(newElementSetClone.childNodes[i], rowKey);
        this._setKey(newRowHeaderElementsClone.childNodes[i], rowKey);

        // if in the old elements, just replace its newTop value
        if (animationInformation.hasOwnProperty(rowKey))
        {
            animationInformation[rowKey].newTop = newTop;
        }
        // if not in the old elements, create an entry for it with oldTop just outside of view
        else
        {
            oldTop = viewportBottom;
            newBottom = newTop + this.getElementHeight(child);
            animationInformation[rowKey] = {oldTop: oldTop, newTop: newTop};

            // if new element will be in view at all, we will need to add it to the live DOM
            // for animation, and set the top to the bottom of the viewport
            if (newBottom >= viewportTop && newTop < viewportBottom)
            {
                child = newElementSetClone.childNodes[i];
                this.setElementDir(child, animationInformation[rowKey].oldTop, 'top');
                rowsForAppend.push(child);
                if (rowHeaderSupport)
                {
                    child = newRowHeaderElementsClone.childNodes[i ];
                    this.setElementDir(child, animationInformation[rowKey].oldTop, 'top');
                    rowHeadersForAppend.push(child);
                }
            }
        }
    }

    // append the old elements now, couldn't do it before because as we append we
    // lose proper indexing in the clone set
    for (i = 0; i < rowsForAppend.length; i++)
    {
        oldElementSet.appendChild(rowsForAppend[i]); //@HTMLUpdateOK
        if (rowHeaderSupport)
        {
            oldRowHeaderElements.appendChild(rowHeadersForAppend[i]); //@HTMLUpdateOK
        }
    }

    // find out which element is the last to actually animate
    for (i = oldElementSet.childNodes.length - 1; i >= 0; i--)
    {
        child = oldElementSet.childNodes[i];
        rowKey = this._getKey(child);
        if (animationInformation[rowKey].newTop - animationInformation[rowKey].oldTop != 0)
        {
            lastAnimationElement = child;
            break;
        }
    }

    // if nothing is animated which could happen, we can just bail and not animate
    if (lastAnimationElement != null)
    {
        //register transitionend listener on the last row transitioning before applying the transition
        lastAnimationElement.addEventListener('transitionend', this._handleSortEnd.bind(this, newElementSet, newRowHeaderElements), false);

        setTimeout(function()
        {
            var deltaY, delay, animationInfo, i;
            //main animation loop
            for (i = 0; i < oldElementSet.childNodes.length; i++)
            {
                delay = delay_offset * i + "ms";
                child = oldElementSet.childNodes[i];
                //animate rows added to the old set from the new one to its original positions
                animationInfo = animationInformation[self._getKey(child)];
                deltaY = animationInfo.newTop - animationInfo.oldTop;
                //only animate if there is a change in position
                if (deltaY != 0)
                {
                    self.addTransformMoveStyle(child, duration / 2 + "ms", delay, timing, 0, deltaY, 0);
                    if (rowHeaderSupport)
                    {
                        self.addTransformMoveStyle(oldRowHeaderElements.childNodes[i], duration / 2 + "ms", delay, timing, 0, deltaY, 0);
                    }
                }
            }
        }, 0);
    }
    else
    {
        this._handleSortEnd(newElementSet, newRowHeaderElements);
    }
};

/**
 * Restore the active cell after sort.
 * @private
 */
DvtDataGrid.prototype._restoreActive = function()
{
    var row, columnHeader, cellIndex;
    if (this.m_active != null)
    {
        if (this.m_active['type'] == 'cell')
        {
            row = this._findRowByKey(this.m_active['keys']['row']);
            columnHeader = this._findColumnHeaderByKey(this.m_active['keys']['column']);
            if (row != null && columnHeader != null)
            {
                cellIndex = this.createIndex(this.getRowIndex(row), this.getHeaderCellIndex(columnHeader));

                // make sure it's visible
                this.scrollToIndex(cellIndex);

                // select it if selection enabled
                if (this._isSelectionEnabled())
                {
                    // this will clear the selection if there's multiple selection before sort
                    // this is the behavior we want since the ranges in the previous selection
                    // will in most cases be invalid after sort.  The only one we can maintain and
                    // make sense to do is the active cell
                    this.selectAndFocus(cellIndex);
                }
                else
                {
                    // make it active
                    this._setActiveByIndex(cellIndex);
                }
            }
            else
            {
                this._setActive(null, null, true);
                // clear selection it if selection enabled
                if (this._isSelectionEnabled())
                {
                    this._clearSelection();
                }
            }
        }
        else if (this.m_active['axis'] == 'row')
        {
            row = this._findRowHeaderByKey(this.m_active['key']);
            if (row != null)
            {
                // make it active
                this._setActive(row);
            }
            else
            {
                this._setActive(null);
            }
        }
    }
};

/**
 * Get the default sort icon size
 * @return {number} the default sort icon size
 */
DvtDataGrid.prototype.getSortIconSize = function()
{
    var div, divWidth;
    if (this.m_sortIconSize == null)
    {
        div = document.createElement('div');
        div['className'] = this.getMappedStyle("sortascending") + " " + this.getMappedStyle("icon") + " " + this.getMappedStyle("clickableicon");
        div['style']['visibilty'] = 'hidden';
        div['style']['top'] = '0px';
        div['style']['visibilty'] = '0px';
        this.m_root.appendChild(div); //@HTMLUpdateOK
        divWidth = div['offsetWidth'];
        this.m_root.removeChild(div);
        this.m_sortIconSize = divWidth;
    }
    return this.m_sortIconSize;
};

/**
 * Gets the sort icon froma  header Element
 * @param {Element} header the header to get sort icon for
 * @private
 */
DvtDataGrid.prototype._getSortIcon = function(header)
{
    //presently guaranteed to be the first child of the last child of the parent
    return header['lastChild']['firstChild'];
};

/**
 * Gets the sort container froma  header Element
 * @param {Element} header the header to get sort container for
 * @private
 */
DvtDataGrid.prototype._getSortContainer = function(header)
{
    //presently guaranteed to be thethe last child of the parent
    return header['lastChild'];
};

/**
 * Fire Sort event
 * @private
 */
DvtDataGrid.prototype._fireSortEvent = function()
{
    var details = {
        'event': this.m_sortInfo['event'], 'ui': {
            'header': this.m_sortInfo['key'],
            'direction': this.m_sortInfo['direction']
        }
    };
    this.fireEvent("sort", details);
};

/**
 * Start a delayed sort
 * @private
 */
DvtDataGrid.prototype._doDelayedSort = function()
{
    if (this.m_delayedSort != null)
    {
        this._doHeaderSort(this.m_delayedSort['event'], this.m_delayedSort['header'], this.m_delayedSort['direction']);
    }
    else
    {
        // no pending sort so cleanup
        this.fillViewport(this.m_currentScrollLeft, this.m_currentScrollTop);
    }
};

return DvtDataGrid;
});