/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojdnd', 'ojs/ojlistview'], function(oj, $)
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

/*jslint browser: true,devel:true*/
/**
 * @ignore
 * @export
 * @class oj.ListViewDndContext
 * @classdesc Drag and Drop Utils for ojListView
 * @param {Object} listview the ListView instance
 * @constructor
 */
oj.ListViewDndContext = function(listview)
{
  this.listview = listview;
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.ListViewDndContext, oj.Object, "oj.ListViewDndContext");

oj.ListViewDndContext.C_KEY = 67;
oj.ListViewDndContext.V_KEY = 86;
oj.ListViewDndContext.X_KEY = 88;

/******************************** common helpers ***********************************************/

/**
 * Retrieve options for drag or drop
 * @param {string} op either drag or drop 
 * @return {Object} options for drag or drop
 * @private
 */
oj.ListViewDndContext.prototype._getDndOptions = function(op)
{
    var dnd = this.listview.GetOption("dnd");
    if (dnd != null && dnd[op])
    {
        return dnd[op]['items'];
    }

    return null;
};

/**
 * Retrieve options for drag
 * @return {Object} options for drag
 * @private
 */
oj.ListViewDndContext.prototype._getDragOptions = function()
{
    return this._getDndOptions('drag');
};

/**
 * Retrieve options for drop
 * @return {Object} options for drop
 * @private
 */
oj.ListViewDndContext.prototype._getDropOptions = function()
{
    return this._getDndOptions('drop');
};

/**
 * @return {boolean} whether item reordering is enable
 * @private
 */
oj.ListViewDndContext.prototype._isItemReordering = function()
{
    var option = this._getDndOptions('reorder');
    return (option == "enabled");
};

/**
 * Gets the default drag affordance marker class
 * @return {string} affordance marker class
 * @private
 */
oj.ListViewDndContext.prototype._getDragAffordanceClass = function()
{
    return "oj-listview-drag-handle";
};

oj.ListViewDndContext.prototype._findItem = function(target)
{
    return this.listview.FindItem(target);
};

/**
 * Gets selected items
 * @return {Array.<Element>} an array of selected item's elements.
 * @private
 */
oj.ListViewDndContext.prototype._getSelectedItems = function()
{
    var items, selection, i, elem;

    items = [];

    if (this.listview._isSelectionEnabled())
    {
        // if it's item then use selection
        selection = this.listview.GetOption("selection");
        for (i=0; i<selection.length; i++)
        {
            elem = this.listview.FindElementByKey(selection[i]);
            // make sure item is focusable also
            if (elem != null && !this.listview.SkipFocus($(elem)))
            {     
                items.push(elem);
            }
        }
    }
    else
    {
        // if there's no selection, use the active item
        elem = this._getActiveItem();
        if (elem != null)
        {
            items.push(elem);
        }
    }

    // include the item right click on, if it's not in the selection already
    if (this.m_contextMenuItem != null && this.m_contextMenuItem.length > 0 && items.indexOf(this.m_contextMenuItem.get(0)) == -1)
    {
        items.push(this.m_contextMenuItem.get(0));
    }

    return items;
};

/**
 * @return {Element}
 * @private
 */
oj.ListViewDndContext.prototype._getActiveItem = function()
{
    if (this.listview.m_active == null)
    {
        return null;
    }
    else
    {
        return this.listview.m_active['elem'][0];
    }
};

/**
 * Gets the key and index from an item
 * @param {jQuery} item
 * @private
 */
oj.ListViewDndContext.prototype._getKeyAndIndex = function(item)
{
    var key, items, index;

    key = this.listview.GetKey(item.get(0));
    items = this.listview._getItemsCache();
    index = items.index(item); 

    return {key: key, index: index};
};

/**
 * Called by content handler once the content of an item is rendered
 * @param {Element} elem the item element
 * @param {Object} context the context object used for the item
 */
oj.ListViewDndContext.prototype.itemRenderComplete = function(elem, context)
{
    var dragHandle, ariaLabelledBy;

    // if it's a group, use the div instead
    if (!$(elem).hasClass(this.listview.getItemStyleClass()))
    {
        elem = elem.firstElementChild;
    }

    dragHandle = $(elem).find("."+this._getDragAffordanceClass());
    if (dragHandle != null && dragHandle.length > 0)
    {
        ariaLabelledBy = dragHandle.attr("aria-labelledby");        
        if (ariaLabelledBy == null)
        {
            dragHandle.attr("aria-labelledby", this.listview._createSubId('instr'));
        }
        else
        {
            dragHandle.attr("aria-labelledby", ariaLabelledBy + ' ' + this.listview._createSubId('instr'));
        }

        // for touch draggable needs to be set prior to touch interaction
        if (this.listview._isTouchSupport())
        {
            dragHandle.attr("draggable", "true");
        }
    }
};
/******************************** Mouse down/up, touch start/end helpers ***********************************************/
/** 
 * Sets draggable style class on item
 * @param {jQuery} item the listview item
 * @return {boolean} true if no style class has applied, false otherwise
 * @private
 */
oj.ListViewDndContext.prototype._setItemDraggable = function(item)
{
    var cls, dragHandle;

    // if the item contains the drag affordance, then bail
    cls = this._getDragAffordanceClass();
    dragHandle = item.find("."+cls);
    if (dragHandle != null && dragHandle.length > 0)
    {
        return true;
    }

    item.addClass("oj-draggable");
    return false;
};

/** 
 * Unsets draggable style class on item
 * @param {jQuery} item the listview item
 * @private
 */
oj.ListViewDndContext.prototype._unsetItemDraggable = function(item)
{
    // would be no-op if there's an affordance
    item.removeClass("oj-draggable");
};

/**
 * Sets draggable attribute on either the item or affordance.
 * See HandleMouseDownOrTouchStart method
 * @param {jQuery} target target from mouse down or touch start event
 * @private
 */
oj.ListViewDndContext.prototype._setDraggable = function(target)
{
    var cls, item, dragger, skipped, activeItem;

    if (this._getDragOptions() != null || this._isItemReordering())
    {
        cls = this._getDragAffordanceClass();
        if (target.hasClass(cls))
        {
            dragger = $(target);
        }
        else
        {
            item = this._findItem(target);
            if (item != null)
            {
                skipped = this._setItemDraggable(item);
                if (skipped)
                {
                    // contains affordance, bail out.
                    return;
                }
            }

            // if dragging an item, it must be already the current item
            activeItem = this._getActiveItem();
            if (activeItem != null)
            {
                // in order to initiate drag the item must be the current active item
                if (item != null && item[0] == activeItem)
                {
                    dragger = item;
                }
                else
                {
                    // the active item would change, so remove oj-draggable now
                    $(activeItem).removeClass("oj-draggable");
                }   
            } 
        }

        if (dragger != null)
        {
            dragger.attr("draggable", true);
        }
    }
};

/**
 * Unsets draggable attribute on either the item or affordance.
 * See HandleMouseUpOrPanMove method
 * @param {jQuery} target target from mouse up or touch end event
 * @private
 */
oj.ListViewDndContext.prototype._unsetDraggable = function(target)
{
    var cls, dragger;

    if (this._getDragOptions() != null || this._isItemReordering())
    {
        cls = this._getDragAffordanceClass();
        if (target.hasClass(cls))
        {
            dragger = $(target);
        }
        else
        {
            dragger = this._findItem(target);
        }

        if (dragger != null)
        {
            dragger.removeAttr("draggable");
        }
    }
};
/*********************************** Drag and drop handler ***********************************************/
/**
 * Invoke user callback function specified in a drag or drop option
 * @param {string} dndType  the dnd option type ('drag' or 'drop')
 * @param {string} callbackType  the callback type such as 'dragStart'
 * @param {Event} event  the jQuery Event object from drag and drop event
 * @param {Object} [ui]  additional properties to pass to callback function
 * @return {boolean|undefined|number} the return value from the callback function, returns -1 if there's no callback function
 * @private
 */
oj.ListViewDndContext.prototype._invokeDndCallback = function(dndType, callbackType, event, ui)
{
        var options, callback, returnValue;

        options = dndType === 'drag' ? this._getDragOptions() : this._getDropOptions();
        if (options)
        {
            // First let the callback decide if data can be accepted
            callback = options[callbackType];          
            if (callback && typeof callback == 'function')
            {
                try
                {
                    // Hoist dataTransfer object from DOM event to jQuery event
                    event.dataTransfer = event.originalEvent.dataTransfer;
        
                    // Invoke callback function
                    returnValue = callback(event, ui);
                }
                catch (e)
                {
                    oj.Logger.error('Error: ' + e);
                }
            }
            else
            {
                return -1;
            }
        }
  
        return returnValue;
};

/**
 * Sets the data and drag image on the data transfer object
 * @param {Event} event  the jQuery Event object from drag and drop event
 * @param {Array.<string>} dataTypes the datatypes specified in option
 * @param {Array.<Element>} items an array of item elements
 * @private
 */
oj.ListViewDndContext.prototype._setDragItemDataTransfer = function(event, dataTypes, items)
{
    var isStatic, i, itemDataArray = [], data, originalEvent;

    for (i=0; i<items.length; i++)
    {
        data = this.listview._getDataForItem(items[i]);
        if (data)
        {
            // for Elements we'll use the the innerHTML in data transfer
            if (data.innerHTML && data.tagName && data.tagName == "LI")
            {
                itemDataArray.push(data.innerHTML);
            }
            else
            {
                itemDataArray.push(data);
            }
        }
    }

    // Use the row data array as drag data and create drag image
    if (itemDataArray.length > 0)
    {
        this._setDragItemData(event.originalEvent, dataTypes, itemDataArray);
        this._setDragItemImage(event.originalEvent, items);

        return {'items': itemDataArray};
    }

    return null;
};

/**
 * Set the data of the selected rows into the dataTransfer object
 * @param {Event} nativeEvent  DOM event object 
 * @param {string | Array.<string>} dataTypes  a data type or array of data types
 * @param {Array.<Object>} itemDataArray  array of row data
 * @private
 */
oj.ListViewDndContext.prototype._setDragItemData = function(nativeEvent, dataTypes, itemDataArray)
{
    var dataTransfer, jsonStr, i;

    dataTransfer = nativeEvent.dataTransfer;
    jsonStr = JSON.stringify(itemDataArray);
  
    if (typeof dataTypes == 'string')
    {
        dataTransfer.setData(dataTypes, jsonStr);
    }
    else if (dataTypes)
    {
        for (i = 0; i < dataTypes.length; i++)
        {
            dataTransfer.setData(dataTypes[i], jsonStr);
        }
    }

    // tag datatransfer so we could determine whether this is dnd within same listview
    dataTransfer.setData("text/ojlistview-dragsource-id", this.listview.element.get(0).id);
};

/**
 * Create and sets the drag image into the dataTransfer object
 * @param {Event} nativeEvent  DOM event object 
 * @param {Array.<Element>} items array of row data
 * @private
 */
oj.ListViewDndContext.prototype._setDragItemImage = function(nativeEvent, items)
{
    var target, dragImage, i, minTop = Number.MAX_VALUE, offsetTop, offsetWidth, clone, container, left = 0, top = 0;

    target = nativeEvent.target;

    if (items.length > 1)
    {
        dragImage = $(document.createElement("ul"));
        dragImage.get(0).className = this.listview.element.get(0).className;
        dragImage.addClass("oj-listview-drag-image")
                 .css({"width":this.listview.element.css("width"),
                       "height":this.listview.element.css("height")});
        
        // need to figure out which is the top item
        for (i=0; i<items.length; i++)
        {
            minTop = Math.min(minTop, items[i].offsetTop);
        }

        // now construct the drag image
        for (i=0; i<items.length; i++)
        {
            offsetTop = items[i].offsetTop - minTop;
            offsetWidth = items[i].offsetWidth;
            clone = $(items[i].cloneNode(true));  
            clone.removeClass("oj-selected oj-focus oj-hover")
                 .css({"position":"absolute",
                       "top":offsetTop,
                       "width":offsetWidth});            
            dragImage.append(clone); //@HTMLUpdateOK
        }
    }
    else
    {
        // calculate offset if drag on affordance
        if ($(target).hasClass(this._getDragAffordanceClass()))
        {
            left = Math.max(0, target.offsetLeft - items[0].offsetLeft) + target.offsetWidth/2;
            top = target.offsetTop + target.offsetHeight/2;
        }

        clone = $(items[0].cloneNode(true));
        clone.removeClass("oj-selected oj-focus oj-hover")
             .addClass("oj-drag");

        dragImage = $(document.createElement("ul"));
        dragImage.get(0).className = this.listview.element.get(0).className;
        dragImage.addClass("oj-listview-drag-image")
                 .css({"width":this.listview.element.css("width"),
                       "height":items[0].offsetHeight * 2})
                 .append(clone); //@HTMLUpdateOK
    }

    $("body").append(dragImage); //@HTMLUpdateOK
    this.m_dragImage = dragImage;
    nativeEvent.dataTransfer.setDragImage(dragImage.get(0), left, top);
};

/**
 * Returns the default data type
 * @return {string} the default data type
 * @private
 */
oj.ListViewDndContext.prototype._getDefaultDataType = function()
{
    return "text/ojlistview-items-data";
};

/**
 * Drag start event handler
 * @param {Event} event  jQuery event object
 * @return {boolean|number|undefined} a value passed back to jQuery.  Returning false will
 *         cause jQuery to call event.preventDefault and event.stopPropagation.
 *         Returning true or other values has no side effect.
 *         In the case of dragstart, returning false cancels the drag operation.
 * @private
 */
oj.ListViewDndContext.prototype._handleDragStart = function(event)
{
    var options, dataTypes, items, ui, ret;

    options = this._getDragOptions();
    if (options != null || this._isItemReordering())
    {
        if (options != null)
        {
            dataTypes = options['dataTypes'];
        }
        else
        {
            dataTypes = this._getDefaultDataType();
        }

        if ($(event.target).hasClass(this._getDragAffordanceClass()))
        {
            // if it's affordance then use event target
            items = [];
            items.push(this._findItem(event.target)[0]);
        }
        else
        {
            items = this._getSelectedItems();
        }

        if (items.length > 0)
        {
            // if reordering, make sure there's only one item, otherwise it's invalid
            if (options == null && items.length > 1)
            {
                return false;
            }

            this.m_dragItems = items;
            this.m_currentDragItem = $(items[0]);

            ui = this._setDragItemDataTransfer(event, dataTypes, items);
            if (ui)
            {
                ret = this._invokeDndCallback('drag', 'dragStart', event, ui);

                // dragStart is optional
                if (ret === -1)
                {
                    return;
                }
                else
                {
                    // but if it's specified, it could abort drag by returning false
                    return ret;
                }
            }
            else
            {
                // no data, abort drag
                return false;
            }
        }
    }

    // don't return anything since apps can register their own custom event handler
};

/**
 * Drag event handler
 * @param {Event} event  jQuery event object
 * @private
 */
oj.ListViewDndContext.prototype._handleDrag = function(event)
{
    // invoke callback
    return this._invokeDndCallback('drag', 'drag', event);
};

/**
 * Delete the drag image
 * @private
 */
oj.ListViewDndContext.prototype._destroyDragImage = function()
{
    if (this.m_dragImage != null)
    {
        this.m_dragImage.remove();
        this.m_dragImage = null;
    }
};

/**
 * Drag end event handler
 * @param {Event} event  jQuery event object
 * @private
 */
oj.ListViewDndContext.prototype._handleDragEnd = function(event)
{
    var i;

    // remove css class and make sure it's visible again
    if (this.m_currentDragItem != null && this.m_dragItems != null)
    {
        // for drag affordance case
        this.m_currentDragItem.find("."+this._getDragAffordanceClass())
                              .removeAttr("draggable");

        this.m_currentDragItem.removeClass("oj-drag oj-draggable")
                              .removeAttr("draggable");

        for (i=0; i<this.m_dragItems.length; i++)
        {
            $(this.m_dragItems[i]).removeClass("oj-listview-drag-item");           
        }
    }

    // remove drop target, if any
    this._cleanupDropTarget();

    // clean up drag image
    this._destroyDragImage();

    // invoke callback
    this._invokeDndCallback('drag', 'dragEnd', event);

    // reset drag variables (except this.m_dragItems)
    this.m_dragImage = null;
    this.m_currentDragItem = null;
};

/**
 * Return true if the data types from dnd event match one of the values in an array
 * @param {Event} event  jQuery event object for a drag and drop event
 * @return {boolean} true if one of the types in dragDataTypes and allowedTypes matches       
 * @private
 */
oj.ListViewDndContext.prototype._matchDragDataType = function(event)
{
    var dragDataTypes, options, allowedTypes, allowedTypeArray, i;

    options = this._getDropOptions();
  
    // if no drop option is specified and reordering is enable, we'll allow drop
    if (this._isItemReordering() && options == null)
    {
        return true;
    }

    if (options && options['dataTypes'])
    {
        allowedTypes = options['dataTypes'];
        allowedTypeArray = (typeof allowedTypes == 'string') ? [allowedTypes] : allowedTypes;
    
        // dragDataTypes can be either an array of strings (Chrome) or a 
        // DOMStringList (Firefox and IE).  For cross-browser compatibility, use its 
        // length and index to traverse it.
        dragDataTypes = event.originalEvent.dataTransfer.types;
        for (i = 0; i < dragDataTypes.length; i++)
        {
            if (allowedTypeArray.indexOf(dragDataTypes[i]) >= 0)
            {
                return true;
            }
        }
    }

    return false;
};

/**
 * Invoke user callback function specified in a drop option
 * @param {string} callbackType  the callback type such as 'dragStart'
 * @param {Event} event  the jQuery Event object from drag and drop event
 * @param {Object} [ui]  additional properties to pass to callback function
 * @return {boolean|undefined|number} the return value from the callback function, returns -1 if there is no callback function
 * @private
 */
oj.ListViewDndContext.prototype._invokeDropCallback = function(callbackType, event, ui)
{
    var returnValue = this._invokeDndCallback('drop', callbackType, event, ui);
    if (returnValue === undefined || returnValue === -1)
    {
        if (this._matchDragDataType(event))
        {
            event.preventDefault();
        }
    }

    return returnValue;
};

/**
 * Create drop target based on item
 * @param {jQuery} item the item to create drop target based on
 * @return {jQuery} the drop target
 * @private
 */
oj.ListViewDndContext.prototype._createDropTarget = function(item)
{
    var dropTarget;

    if (this.m_dropTarget == null)
    {
        dropTarget = $(item.get(0).cloneNode(false));
        dropTarget.addClass("oj-drop")
                  .removeClass("oj-drag oj-draggable oj-hover oj-focus oj-selected")
                  .css({"display": "block", "height": item.outerHeight()});
        
        this.m_dropTarget = dropTarget;
    }

    return this.m_dropTarget;
};

/**
 * Clean up group item drop target artifacts
 * @private
 */
oj.ListViewDndContext.prototype._cleanupGroupItem = function()
{
    // for group item
    if (this.m_currentDropItem != null && this.m_dropTargetIndex === -1)
    {
        this.m_currentDropItem.children("."+this.listview.getGroupItemStyleClass()).removeClass("oj-drop");
    }
};

/**
 * Clean up for the case of empty list
 * @private
 */
oj.ListViewDndContext.prototype._cleanupEmptyList = function()
{
    // if it's drop on an empty list
    if (this.m_currentDropItem != null && this.m_currentDropItem.hasClass(this.listview.getEmptyTextStyleClass()))
    {
        this.m_currentDropItem.removeClass("oj-drop");
        this.m_currentDropItem.get(0).textContent = this.listview._getEmptyText();        
    }
};

/**
 * Clean up drop target artifacts
 * @private
 */
oj.ListViewDndContext.prototype._cleanupDropTarget = function()
{
    if (this.m_dropTarget != null)
    {
        this.m_dropTarget.css("height", "0");
        this.m_dropTarget.remove();
        this.m_dropTarget = null;
    }

    this._cleanupEmptyList();
    this._cleanupGroupItem();
};

/**
 * Drag enter event handler
 * @param {Event} event  jQuery event object
 * @private
 */
oj.ListViewDndContext.prototype._handleDragEnter = function(event)
{
    var item, returnValue;

    item = this._findItem(event.target);
    returnValue = this._invokeDropCallback('dragEnter', event, {'item': item.get(0)});
    if (returnValue != -1)
    {
        return returnValue;
    }
};

/**
 * Sets the current drop item
 * @param {jQuery} item the item to set as current drop item
 * @private
 */
oj.ListViewDndContext.prototype._setCurrentDropItem = function(item)
{
    if (this.m_currentDropItem != null)
    {
        this.m_currentDropItem.removeClass("oj-valid-drop oj-invalid-drop");
    }

    this.m_currentDropItem = item;
    this.m_currentDropItem.addClass("oj-valid-drop");
};

/**
 * Sets the accessible text according to the drop position
 * @param {jQuery} item the drop target reference
 * @param {string} position either 'before' or 'after'
 * @private
 */
oj.ListViewDndContext.prototype._setAccInfo = function(item, position)
{
    var label, key, msg;

    // we'll see if there is a label associated with the item, if not, look for text inside the item
    label = item.attr("aria-label");
    if (label == null)
    {
        label = item.text();
    }

    key = "accessibleReorder" + position.charAt(0).toUpperCase() + position.substr(1) + "Item";
    msg = this.listview.ojContext.getTranslatedString(key, {"item": label});
    this.listview._setAccInfoText(msg);
};

/**
 * Adjust the max height of group item
 * @private
 */
oj.ListViewDndContext.prototype._adjustGroupItemStyle = function()
{
    // for touch we'll need to remove max height set
    if (this.m_maxHeightAdjusted == null && this.listview._isTouchSupport())
    {
        this.listview.element.find("ul."+this.listview.getGroupStyleClass()).each(function(index)
        {
            $(this).attr("oldMaxHeight", $(this).css("maxHeight").toString());
            $(this).css("maxHeight", 10000);
        });        

        this.m_maxHeightAdjusted = "adjusted";
    }
};

/**
 * Reverse of _adjustGroupItemStyle
 * @private
 */
oj.ListViewDndContext.prototype._restoreGroupItemStyle = function()
{
    if (this.listview._isTouchSupport())
    {
        this.listview.element.find("ul."+this.listview.getGroupStyleClass()).each(function(index)
        {
            $(this).css("maxHeight", parseInt($(this).attr("oldMaxHeight"), 10));
            $(this).removeAttr("oldMaxHeight");
        });        
    }

    this.m_maxHeightAdjusted = null;
};

/**
 * Drag over event handler
 * @param {Event} event  jQuery event object
 * @private
 */
oj.ListViewDndContext.prototype._handleDragOver = function(event)
{
    var item, dropTarget, i, returnValue, index, emptyItem;

    // must have drop or reorder option specified 
    if (this._getDropOptions() == null && !this._isItemReordering())
    {
        return;
    }

    // do any neccessary group item
    this._adjustGroupItemStyle();

    // checks whether this is initially dragging over the drag item 
    if (this.m_dragItems != null && $(this.m_dragItems[0]).css("display") != "none")
    {
        // take out the current drag item and create drop target
        item = $(this.m_dragItems[0]);

        dropTarget = this._createDropTarget(item);

        for (i=0; i<this.m_dragItems.length; i++)
        {
            $(this.m_dragItems[i]).addClass("oj-listview-drag-item");           
        }

        dropTarget.insertBefore(item); //@HTMLUpdateOK
        this.m_dropTargetIndex = dropTarget.index();
    }
    else
    {
        // if drag over callback allows drop or if it's item reordering
        item = this._findItem(event.target);
        if (item != null && item.length > 0)
        {
            // this will check for matching data types
            returnValue = this._invokeDropCallback('dragOver', event, {'item': item.get(0)});

            // note drop is allowed in the case where reordering is enabled, but only if there's no dragStart callback
            // to prevent the drop
            if ((returnValue === -1 && this._isItemReordering()) || returnValue === false || event.isDefaultPrevented())
            {
                // if it is non-group item
                if (item.hasClass(this.listview.getItemStyleClass()))
                {
                    this._cleanupGroupItem();

                    // if a drop target has not been created for this item
                    if (!item.hasClass("oj-drop"))
                    {
                        dropTarget = this._createDropTarget(item);

                        index = item.index();
                        if (this.m_dropTargetIndex == null || this.m_dropTargetIndex < index)
                        {
                            dropTarget.insertAfter(item); //@HTMLUpdateOK
                            this.m_dropPosition = "after";
                        }
                        else
                        {
                            dropTarget.insertBefore(item); //@HTMLUpdateOK
                            this.m_dropPosition = "before";
                        }

                        this._setAccInfo(item, this.m_dropPosition);
                        this._setCurrentDropItem(item);
                        this.m_dropTargetIndex = dropTarget.index();
                    }
                }
                else
                {
                    // there won't be a drop target placeholder, remove any previous ones
                    this._cleanupDropTarget();

                    // for group item
                    item.children("."+this.listview.getGroupItemStyleClass()).addClass("oj-drop");
                    this._setCurrentDropItem(item);
                    this.m_dropTargetIndex = -1;
                    this.m_dropPosition = "inside";
                    this._setAccInfo(item, this.m_dropPosition);
                }
                event.preventDefault();
            }
            else
            { 
                // don't remove the drop target if we have inside the empty area of the list of a group item
                // this happens mostly in card layout view
                if (!$(event.target).hasClass(this.listview.getGroupStyleClass()))
                {
                    // not a valid drop target
                    item.addClass("oj-invalid-drop");

                    // remove any drop target placeholder
                    this._cleanupDropTarget();
                }
            }
        }
        else
        {
            // drop on an empty list
            emptyItem = this.listview.element.children("."+this.listview.getEmptyTextStyleClass());
            if (emptyItem != null && emptyItem.length > 0)
            {
                emptyItem.addClass("oj-drop");
                emptyItem.get(0).textContent = "";

                this._setCurrentDropItem(emptyItem);
                event.preventDefault();
            }
        }
    }

    return returnValue;
};

/**
 * Return true if the mouse/touch point of a dnd event is in an element.
 * This is identical to _isDndEventInElement in TableDndContext.js
 * @param {Event} event  jQuery event object
 * @param {EventTarget} element  DOM element
 * @return {boolean} whether mouse/touch point is in an element
 */
oj.ListViewDndContext.prototype._isDndEventInElement = function(event, element)
{
    var rect, domEvent;

    rect = element.getBoundingClientRect();
    domEvent = event.originalEvent;
  
    // clientX and clientY are only available on the original DOM event
    return (domEvent.clientX >= rect.left && domEvent.clientX < rect.right &&
            domEvent.clientY >= rect.top && domEvent.clientY < rect.bottom);
};

/**
 * Drag leave event handler
 * @param {Event} event  jQuery event object
 * @private
 */
oj.ListViewDndContext.prototype._handleDragLeave = function(event)
{
    var item, returnValue;

    if (this.m_currentDropItem == null)
    {
        return;
    }

    item = this._findItem(event.target);
    if (item != null && item.length > 0)
    {
        item.removeClass("oj-valid-drop oj-invalid-drop");

        returnValue = this._invokeDropCallback('dragLeave', event, {'item': item.get(0)});

        // Remove the drop target indicator if we are no longer in listview since
        // this may be the last dnd event we get.
        if (!this._isDndEventInElement(event, event.currentTarget))
        {
            this._cleanupDropTarget();
            this._restoreGroupItemStyle();
        }
    }
    else
    {
        // empty list case
        if (!this._isDndEventInElement(event, event.currentTarget))
        {
            this._cleanupEmptyList();
        }
    }

    if (returnValue != -1)
    {
        return returnValue;
    }
};

/**
 * Drop event handler
 * @param {Event} event  jQuery event object
 * @private
 */
oj.ListViewDndContext.prototype._handleDrop = function(event)
{
    var source, ui, returnValue, item, key, dataSource;

    if (this.m_currentDropItem == null)
    {
        return;
    }

    source = event.originalEvent.dataTransfer.getData("text/ojlistview-dragsource-id");

    // invoke callback
    if (this.m_currentDropItem.hasClass(this.listview.getEmptyTextStyleClass()))
    {
        ui = {};
    }
    else
    {
        ui = {'item': this.m_currentDropItem.get(0), 'position': this.m_dropPosition};
    }

    // add the reorder param
    if (this._isItemReordering() && source === this.listview.element.get(0).id)
    {
        ui['reorder'] = true;
    }
    else
    {
        ui['reorder'] = false;
    }

    // fire drop event
    returnValue = this._invokeDropCallback('drop', event, ui);

    // fire reorder event
    if (ui['reorder'])
    {
        ui['items'] = this.m_dragItems;
        ui['reference'] = ui['item'];
        this.listview.Trigger("reorder", event, ui);

        // the drop should be complete regardless the value of callback
        event.preventDefault();
    }

    // cleanup
    if (this.m_currentDropItem != null)
    {
        this.m_currentDropItem.removeClass("oj-valid-drop");
    }
    this._cleanupDropTarget();
    this._restoreGroupItemStyle();
    this._destroyDragImage();

    // reset drop variables
    this.m_currentDropItem = null;
    this.m_dropTargetIndex = -1;
    this.m_dropPosition = null;

    if (returnValue === -1)
    {
        return;
    }
    else
    { 
        return returnValue;
    }
};

/*********************************** Context menu ***********************************************/
/**
 * Add a default context menu to listview if there is none. If there is
 * a context menu set on the listview options we use that one. Add listeners
 * for context menu before show and select.
 * @param {string=} contextMenu the contextMenu selector
 * @private
 */
oj.ListViewDndContext.prototype.addContextMenu = function(contextMenu)
{
    var self = this, id, menuContainer, listItems, menuItemsSet;

    // only add context menu if item reordering is enabled
    if (!this._isItemReordering())
    {
        return;
    }

    if (contextMenu == undefined)
    {
        contextMenu = this.listview.GetOption("contextMenu");
    }

    // check whether context menu is specified by app
    if (contextMenu != null)
    {
        // this keeps track of which menu items were generated by the listview dynamically
        // this way on a refresh we know to recreate them in case there was a locale or
        // translations change
        if (this.m_menuItemsSet == null)
        {
            this.m_menuItemsSet = [];
        }
        
        menuContainer = $(contextMenu);
        listItems = menuContainer.find('[data-oj-command]');
        menuItemsSet = [];
        listItems.each(function() {
            var command, anchor, newListItem;
            anchor = $(this).children('a');
            if (anchor.length === 0)
            {
                // transform menu item as needed
                if ($(this).attr('data-oj-command').indexOf('oj-listview-') == 0)
                {
                    command = $(this).attr('data-oj-command').substring(12);
                    newListItem = self._buildContextMenuItem(command);
                    newListItem.get(0).className = $(this).get(0).className;
                    $(this).replaceWith(newListItem); //@HTMLUpdateOK
                }
            }
            else
            {
                // menu item been processed already
                command = $(this).attr('data-oj-command');

                // mapping for paste
                if (command == "pasteBefore")
                {
                    command = "paste-before";
                }
                else if (command == "pasteAfter")
                {
                    command = "paste-after";
                }
            }
 
            if (command != null)
            {
                menuItemsSet.push(command);
            }
        });

        this.m_menuItemsSet = menuItemsSet;

        if (menuItemsSet.length > 0)
        {
            if (menuContainer.data('oj-ojMenu'))
            {
                menuContainer.ojMenu('refresh');
            }

            menuContainer.on("ojbeforeopen", this._handleContextMenuBeforeOpen.bind(this));
            menuContainer.on("ojselect", this._handleContextMenuSelect.bind(this));
        }
    }
};

/**
 * Builds a menu for a command, takes care of submenus where appropriate
 * @param {string} command the command that the datagrid should build a menu item for
 * @private
 */
oj.ListViewDndContext.prototype._buildContextMenuItem = function(command)
{
    if (command === 'paste-before')
    {
        return this._buildContextMenuListItem('pasteBefore');
    }
    else if (command === 'paste-after')
    {
        return this._buildContextMenuListItem('pasteAfter');
    }
    else
    {
        return this._buildContextMenuListItem(command);
    }
};

/**
 * Builds a context menu list item from a command
 * @param {string} command the string to look up command value for as well as translation
 * @return {Object} a jQuery object with HTML containing a list item
 * @private
 */
oj.ListViewDndContext.prototype._buildContextMenuListItem = function(command)
{
    var listItem = $('<li></li>');
    listItem.attr('data-oj-command', command);
    listItem.append(this._buildContextMenuLabel(command)); //@HTMLUpdateOK
    return listItem;
};

/**
 * Builds a context menu label by looking up command translation
 * @param {string} command the string to look up translation for
 * @return {jQuery|string} a jQuery object with HTML containing a label
 * @private
 */
oj.ListViewDndContext.prototype._buildContextMenuLabel = function(command)
{
    // convert to the translation key convention
    var key = 'label' + command.charAt(0).toUpperCase() + command.slice(1);
    return $('<a href="#"></a>').text(this.listview.ojContext.getTranslatedString(key));
};

/**
 * Handles cut action
 * @param {Event} event jQuery event
 * @private
 */
oj.ListViewDndContext.prototype._handleCut = function(event)
{
    var items;

    // first restore style of any previously cut items
    if (this.m_clipboard != null)
    {
        $(this.m_clipboard).removeClass("oj-listview-cut");
    }

    items = this._getSelectedItems();
    $(items).addClass("oj-listview-cut");
    this.m_clipboard = items;

    // fire cut event
    this.listview.Trigger('cut', event, {'items': items});
};

/**
 * Handles copy action
 * @param {Event} event jQuery event
 * @private
 */
oj.ListViewDndContext.prototype._handleCopy = function(event)
{
    var items;

    // first restore style of any previously cut items
    if (this.m_clipboard != null)
    {
        $(this.m_clipboard).removeClass("oj-listview-cut");
    }

    items = this._getSelectedItems();
    this.m_clipboard = items;

    // fire cut event
    this.listview.Trigger('copy', event, {'items': items});
};

/**
 * Handles paste action
 * @param {Event} event jQuery event
 * @param {jQuery} item the reference item of the paste
 * @param {string} position either before/after/inside
 * @private
 */
oj.ListViewDndContext.prototype._handlePaste = function(event, item, position)
{
    // fire paste event
    this.listview.Trigger("paste", event, {'item': item.get(0)});
    
    // restore cut item style
    $(this.m_clipboard).removeClass("oj-listview-cut");

    // fire reorder event
    this.listview.Trigger("reorder", event, {'items': this.m_clipboard, 'position': position, 'reference': item.get(0)});

    // clear the clipboard
    this.m_clipboard = null;
};

/**
 * Select handler for context menu items
 * @param {Event} event jQuery event object
 * @param {Object} ui additional info from event
 * @private
 */
oj.ListViewDndContext.prototype._handleContextMenuSelect = function(event, ui)
{
    // should never happen
    if (this.m_contextMenuItem == null)
    {
        return;
    }

    switch(ui.item.attr("data-oj-command")) 
    {
        case "cut":
            this._handleCut(event);
            break;
        case "copy":
            this._handleCopy(event);
            break;
        case "paste":
            var inside = true;
        case "pasteBefore":
            var before = true;
        case "pasteAfter":
            var position = "after";
            if (inside)
            {
                position = "inside";
            }
            else if (before)
            {
                position = "before";
            }

            this._handlePaste(event, this.m_contextMenuItem, position);

            // cleanup
            this.m_contextMenuItem = null;

            break;
    }
};

/**
 * Append or show menu item based on command
 * @param {jQuery} menuContainer the menu container
 * @param {string} command the command of the menu item
 * @private
 */
oj.ListViewDndContext.prototype._appendToMenuContainer = function(menuContainer, command)
{
    // whether default context menu is used
    if (this.m_menuItemsSet != null)
    {
        if (command == "paste-before")
        {
            command = "pasteBefore";
        }
        else if (command == "paste-after")
        {
            command = "pasteAfter";
        }

        // show the menu item
        menuContainer.find("[data-oj-command='"+command+"']")
                     .removeClass("oj-disabled");
    }
}

/**
 * Before open handler so that ListView can customize content of context menu based on item
 * @param {Event} event jQuery event object
 * @param {Object} ui ui object
 * @private
 */
oj.ListViewDndContext.prototype._handleContextMenuBeforeOpen = function(event, ui)
{
    var menuContainer, item;

    menuContainer = $(event.target);

    // disable all menu items first, needs to be done even if there's no default menu items since
    // there could be one from before refresh
    menuContainer.find("[data-oj-command]")
                 .addClass("oj-disabled");

    item = ui['openOptions']['launcher'];
    if (item == null || this.m_menuItemsSet == null || this.m_menuItemsSet.length == 0)
    {
        // refresh to take effect
        menuContainer.ojMenu("refresh");
        return;
    }

    // now add menu items
    if (item.children().first().hasClass(this.listview.getGroupItemStyleClass()))
    {
        // check if cut action was performed
        if (this.m_clipboard != null)
        {
            this._appendToMenuContainer(menuContainer, "paste");
        }
    }
    else
    {
        this._appendToMenuContainer(menuContainer, "cut");
        this._appendToMenuContainer(menuContainer, "copy");
        // check if cut action was performed
        if (this.m_clipboard != null)
        {
            this._appendToMenuContainer(menuContainer, "paste-before");
            this._appendToMenuContainer(menuContainer, "paste-after");
        }
    }

    // refresh to take effect
    menuContainer.ojMenu("refresh");

    this.m_contextMenuItem = item;
};

/**
 * Handles key down event
 * @param {Event} event the keydown event
 * @return {boolean} true if key event is handled, false otherwise
 * @private
 */

oj.ListViewDndContext.prototype.HandleKeyDown = function(event)
{
    var keyCode, active, position;

    // only add context menu if item reordering is enabled
    if (!this._isItemReordering() || this.m_menuItemsSet == null || this.m_menuItemsSet.length == 0)
    {
        return false;
    }

    if (event.ctrlKey || event.metaKey)
    {
        keyCode = event.keyCode;
        if (keyCode === oj.ListViewDndContext.X_KEY && this.m_menuItemsSet.indexOf("cut") > -1)
        {
            this._handleCut(event);
            return true;
        }
        else if (keyCode === oj.ListViewDndContext.C_KEY && this.m_menuItemsSet.indexOf("copy") > -1)
        {
            this._handleCopy(event);
            return true;
        }
        else if (keyCode === oj.ListViewDndContext.V_KEY)
        {
            if (this.m_clipboard != null)
            {
                active = $(this._getActiveItem());
                if (active.children().first().hasClass(this.listview.getGroupItemStyleClass()))
                {
                    if (this.m_menuItemsSet.indexOf("paste") > -1)
                    {
                        position = "inside";
                    }
                }
                else
                {
                    if (this.m_menuItemsSet.indexOf("paste-before") > -1)
                    {  
                        position = "before";
                    }
                    else if (this.m_menuItemsSet.indexOf("paste-after") > -1)
                    {  
                        position = "after";
                    }
                }
 
                if (position != null)
                {   
                    this._handlePaste(event, active, position);
                    return true;
                }
            }
        }
    }

    return false;
};
});
