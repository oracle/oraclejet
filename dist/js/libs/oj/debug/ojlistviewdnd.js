/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojlogger', 'ojdnd', 'ojs/ojlistview'], function(oj, $, Logger)
{
  "use strict";

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/* global Logger:false */

/**
 * @ignore
 * @export
 * @class oj.ListViewDndContext
 * @classdesc Drag and Drop Utils for ojListView
 * @param {Object} listview the ListView instance
 * @constructor
 */
oj.ListViewDndContext = function (listview) {
  this.listview = listview;
};

// Subclass from oj.Object
oj.Object.createSubclass(oj.ListViewDndContext, oj.Object, 'oj.ListViewDndContext');

oj.ListViewDndContext.C_KEY = 67;
oj.ListViewDndContext.V_KEY = 86;
oj.ListViewDndContext.X_KEY = 88;

oj.ListViewDndContext.CUT_COMMAND = 'cut';
oj.ListViewDndContext.COPY_COMMAND = 'copy';
oj.ListViewDndContext.PASTE_COMMAND = 'paste';
oj.ListViewDndContext.PASTE_BEFORE_COMMAND = 'pasteBefore';
oj.ListViewDndContext.PASTE_AFTER_COMMAND = 'pasteAfter';

/**
 * Clears the internal of dnd context.  Called by _resetInternal in ListView.
 */
oj.ListViewDndContext.prototype.reset = function () {
  // this cache might not be clear if dnd never did happened
  this._unsetSelectionDraggable();

  this.m_itemsDragged = null;
  this.m_dragImage = null;
  this.m_currentDragItem = null;
  this.m_dragItems = null;
  this.m_contextMenuItem = null;
  this.m_cachedOffset = null;
};

/** ****************************** common helpers ***********************************************/

/**
 * Retrieve options for drag or drop
 * @param {string} op either drag or drop
 * @return {Object} options for drag or drop
 * @private
 */
oj.ListViewDndContext.prototype._getDndOptions = function (op) {
  var dnd = this.listview.GetOption('dnd');
  if (dnd != null && dnd[op]) {
    return dnd[op].items;
  }

  return null;
};

/**
 * Retrieve options for drag
 * @return {Object} options for drag
 * @private
 */
oj.ListViewDndContext.prototype._getDragOptions = function () {
  return this._getDndOptions('drag');
};

/**
 * Retrieve options for drop
 * @return {Object} options for drop
 * @private
 */
oj.ListViewDndContext.prototype._getDropOptions = function () {
  return this._getDndOptions('drop');
};

/**
 * Return true if reordering enabled.
 * @return {boolean} whether item reordering is enable
 * @protected
 */
oj.ListViewDndContext.prototype.IsItemReOrdering = function () {
  var option = this._getDndOptions('reorder');
  return (option === 'enabled');
};

/**
 * Gets the default drag affordance marker class
 * @return {string} affordance marker class
 * @protected
 */
oj.ListViewDndContext.prototype.GetDragAffordanceClass = function () {
  return 'oj-listview-drag-handle';
};

/**
 * Gets the drag Image class. Need to be override by navlist.
 * @return {string} drag image class
 * @protected
 */
oj.ListViewDndContext.prototype.GetDragImageClass = function () {
  return 'oj-listview-drag-image';
};

/**
 * Gets the drag Item class.  Need to be override by navlist.
 * @return {string} drag Item class
 * @protected
 */
oj.ListViewDndContext.prototype.GetDragItemClass = function () {
  return 'oj-listview-drag-item';
};

/**
 * Gets the cut command style class.  Need to be override by navlist.
 * @return {string} cut command style class
 * @protected
 */
oj.ListViewDndContext.prototype.GetCutStyleClass = function () {
  return 'oj-listview-cut';
};

/**
 * Gets the style class prefix.  Need to be override by navlist.
 * @return {string} style class prefix
 * @protected
 */
oj.ListViewDndContext.prototype.GetCommandPrefix = function () {
  return 'oj-listview-';
};

oj.ListViewDndContext.prototype._findItem = function (target) {
  if ($(target).get(0).classList.contains('oj-listview-first-drop-target')) {
    return $(this.m_dropTargetElem);
  }
  return this.listview.FindItem(target);
};

/**
 * Gets selected items
 * @param {boolean=} excludeContextMenuItem true if to exclude the the item user right clicked on, false or undefined otherwise.
 * @return {Array.<Element>} an array of selected item's elements.
 * @private
 */
oj.ListViewDndContext.prototype._getSelectedItems = function (excludeContextMenuItem) {
  var items = [];

  if (this.listview._isSelectionEnabled()) {
    // if it's item then use selection
    var selection = this.listview.GetOption('selection');
    for (var i = 0; i < selection.length; i++) {
      var elem = this.listview.FindElementByKey(selection[i]);
      // make sure item is focusable also
      if (elem != null && !this.listview.SkipFocus($(elem))) {
        items.push(elem);
      }
    }
  } else {
    // if there's no selection, use the active item
    var activeElem = this._getActiveItem();
    if (activeElem != null) {
      items.push(activeElem);
    }
  }

  // if the rightclicked item is not in the selection, we will only use that item.
  if (!excludeContextMenuItem &&
      this.m_contextMenuItem != null &&
      this.m_contextMenuItem.length > 0) {
    // verify contextMenuItem is still valid
    if (!this.listview.element.get(0).contains(this.m_contextMenuItem.get(0))) {
      this.m_contextMenuItem = null;
    } else if (items.indexOf(this.m_contextMenuItem.get(0)) === -1) {
      items = [this.m_contextMenuItem.get(0)];
    }
  }

  return items;
};

/**
 * @return {Element}
 * @private
 */
oj.ListViewDndContext.prototype._getActiveItem = function () {
  if (this.listview.m_active == null) {
    return null;
  }

  return this.listview.m_active.elem[0];
};

/**
 * Called by content handler once the content of an item is rendered
 * @param {Element} elem the item element
 * @param {Object} context the context object used for the item
 */
// eslint-disable-next-line no-unused-vars
oj.ListViewDndContext.prototype.itemRenderComplete = function (elem, context) {
  // if it's a group, use the div instead
  if (!$(elem).hasClass(this.listview.getItemStyleClass())) {
    // eslint-disable-next-line no-param-reassign
    elem = elem.firstElementChild;
  }

  var dragHandle = $(elem).find('.' + this.GetDragAffordanceClass());
  if (dragHandle != null && dragHandle.length > 0) {
    var ariaLabelledBy = dragHandle.attr('aria-labelledby');
    if (ariaLabelledBy == null) {
      dragHandle.attr('aria-labelledby', this.listview._createSubId('instr'));
    } else {
      dragHandle.attr('aria-labelledby', ariaLabelledBy + ' ' + this.listview._createSubId('instr'));
    }

    // for touch draggable needs to be set prior to touch interaction
    if (this.listview._isTouchSupport()) {
      dragHandle.attr('draggable', 'true');
    }
  }
};
/** ****************************** Mouse down/up, touch start/end helpers ***********************************************/
oj.ListViewDndContext.prototype._unsetSelectionDraggable = function () {
  if (this.m_draggableSelection) {
    $.each(this.m_draggableSelection, function (index, elem) {
      $(elem).removeClass('oj-draggable');
      if (this.listview._isTouchSupport()) {
        $(elem).removeAttr('draggable');
      }
    }.bind(this));
  }
};

/**
 * Make every item in the current selection draggable.
 * Invoke by listview when selection has changed
 * @private
 */
oj.ListViewDndContext.prototype.setSelectionDraggable = function () {
  var elems = [];

  // clear previous draggable selections
  this._unsetSelectionDraggable();

  // make current selection draggable
  var selection = this.listview.GetOption('selection');
  for (var i = 0; i < selection.length; i++) {
    var elem = this.listview.FindElementByKey(selection[i]);
        // make sure item is focusable also
    if (elem != null && !this.listview.SkipFocus($(elem))) {
      elems.push(elem);
      $(elem).addClass('oj-draggable');
      // for touch draggable needs to be set prior to touch interaction
      if (this.listview._isTouchSupport()) {
        $(elem).attr('draggable', 'true');
      }
    }
  }

  this.m_draggableSelection = elems;
};

/**
 * Sets draggable style class on item
 * @param {jQuery} item the listview item
 * @return {boolean} true if no style class has applied, false otherwise
 * @private
 */
oj.ListViewDndContext.prototype._setItemDraggable = function (item) {
  // if the item contains the drag affordance, then bail
  var cls = this.GetDragAffordanceClass();
  var dragHandle = item.find('.' + cls);
  if (dragHandle != null && dragHandle.length > 0) {
    return true;
  }

  item.addClass('oj-draggable');
  return false;
};

/**
 * Unsets draggable style class on item
 * @param {jQuery} item the listview item
 * @private
 */
oj.ListViewDndContext.prototype._unsetItemDraggable = function (item) {
  // would be no-op if there's an affordance
  item.removeClass('oj-draggable');
};

/**
 * Sets draggable attribute on either the item or affordance.
 * See HandleMouseDownOrTouchStart method
 * @param {jQuery} target target from mouse down or touch start event
 * @private
 */
oj.ListViewDndContext.prototype._setDraggable = function (target) {
  if (this._getDragOptions() != null || this.IsItemReOrdering()) {
    var cls = this.GetDragAffordanceClass();
    var dragger;

    if (target.hasClass(cls)) {
      dragger = $(target);
    } else {
      var item = this._findItem(target);
      if (!this.shouldDragCurrentItem()) {
        if (item != null) {
          var skipped = this._setItemDraggable(item);
          if (skipped) {
            // contains affordance, bail out.
            return;
          }
        }

        // if dragging an item, it must be already the current item or one of the selected item
        var selectedItems = this._getSelectedItems(true);
        if (selectedItems.length > 0) {
          // in order to initiate drag the item must be the current active item
          if (item != null && selectedItems.indexOf(item[0]) > -1) {
            dragger = item;
          } else {
            // the active item would change, so remove oj-draggable now
            // note for multiple selection case see setSelectionDraggable
            $(selectedItems[0]).removeClass('oj-draggable');
          }
        }
      } else {
        dragger = item;
      }
    }

    if (dragger != null) {
      dragger.attr('draggable', true);
    }
  }
};

/**
 * Unsets draggable attribute on either the item or affordance.
 * See HandleMouseUpOrPanMove method
 * @param {jQuery} target target from mouse up or touch end event
 * @private
 */
oj.ListViewDndContext.prototype._unsetDraggable = function (target) {
  if (this._getDragOptions() != null || this.IsItemReOrdering()) {
    var cls = this.GetDragAffordanceClass();
    var dragger;

    if (target.hasClass(cls)) {
      dragger = $(target);
    } else {
      dragger = this._findItem(target);
    }

    if (dragger != null) {
      dragger.removeAttr('draggable');
      this._unsetItemDraggable(dragger);
    }
  }
};

/**
 * Determine if drag and drop is currently in progress
 * @return {boolean} true if dnd is in progress, false otherwise
 */
oj.ListViewDndContext.prototype.isDndInProgress = function () {
  return (this.m_dragImage != null);
};
/** ********************************* Drag and drop handler ***********************************************/
/**
 * Invoke user callback function specified in a drag or drop option
 * @param {string} dndType  the dnd option type ('drag' or 'drop')
 * @param {string} callbackType  the callback type such as 'dragStart'
 * @param {Event} event  the jQuery Event object from drag and drop event
 * @param {Object} [ui]  additional properties to pass to callback function
 * @return {boolean|undefined|number} the return value from the callback function, returns -1 if there's no callback function
 * @private
 */
oj.ListViewDndContext.prototype._invokeDndCallback = function (dndType, callbackType, event, ui) {
  var returnValue;

  var options = dndType === 'drag' ? this._getDragOptions() : this._getDropOptions();
  if (options) {
    // First let the callback decide if data can be accepted
    var callback = options[callbackType];
    if (callback && typeof callback === 'function') {
      try {
        if (this.listview.ojContext._IsCustomElement()) {
          // For custom element, pass original DOM event and ignore return value.
          callback(event.originalEvent, ui);

          // preventDefault is called on the original event
          if (event.originalEvent.defaultPrevented) {
            event.preventDefault();
          }
        } else {
          // Hoist dataTransfer object from DOM event to jQuery event
          // eslint-disable-next-line no-param-reassign
          event.dataTransfer = event.originalEvent.dataTransfer;

          // Invoke callback function
          returnValue = callback(event, ui);
        }
      } catch (e) {
        Logger.error('Error: ' + e);
      }
    } else {
      returnValue = -1;
    }
  } else {
    returnValue = -1;
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
oj.ListViewDndContext.prototype._setDragItemDataTransfer = function (event, dataTypes, items) {
  var itemDataArray = [];

  for (var i = 0; i < items.length; i++) {
    var data = this.listview._getDataForItem(items[i]);
    if (data) {
      // for Elements we'll use the the inner HTML in data transfer
      if (data.innerHTML && data.tagName && data.tagName === 'LI') { // @HTMLUpdateOK
        itemDataArray.push(data.innerHTML); // @HTMLUpdateOK
      } else {
        itemDataArray.push(data);
      }
    }
  }

  // Use the row data array as drag data and create drag image
  if (itemDataArray.length > 0) {
    this._setDragItemData(event.originalEvent, dataTypes, itemDataArray);
    this.SetDragItemImage(event.originalEvent, items);

    return { items: itemDataArray };
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
oj.ListViewDndContext.prototype._setDragItemData =
  function (nativeEvent, dataTypes, itemDataArray) {
    var dataTransfer = nativeEvent.dataTransfer;
    var jsonStr = JSON.stringify(itemDataArray);

    if (typeof dataTypes === 'string') {
      dataTransfer.setData(dataTypes, jsonStr);
    } else if (dataTypes) {
      for (var i = 0; i < dataTypes.length; i++) {
        dataTransfer.setData(dataTypes[i], jsonStr);
      }
    }

    // tag datatransfer so we could determine whether this is dnd within same listview
    dataTransfer.setData(this.GetDragSourceType(), this.listview.element.get(0).id);
  };

/**
 * Creates the drag image element
 * @private
 */
oj.ListViewDndContext.prototype._createDragImage = function () {
  var dragImage = document.createElement('ul');
  dragImage.className = this.listview.element.get(0).className;
  dragImage.classList.add(this.GetDragImageClass());

  if (this.listview.ojContext._IsCustomElement()) {
    var predefined = ['oj-component', 'oj-complete'].concat(this.listview.GetContainerStyleClass().split(' '));
    this.listview.GetRootElement().get(0).classList.forEach(function (name) {
      if (predefined.indexOf(name) === -1) {
        dragImage.classList.add(name);
      }
    });
  }

  return dragImage;
};

oj.ListViewDndContext.prototype._calculateOffset = function (elem) {
  var style = window.getComputedStyle(elem);
  var offset = parseFloat(style.marginLeft) + parseFloat(style.marginRight) +
    parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) +
    parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

  return offset;
};

oj.ListViewDndContext.prototype._calculateAffordanceOffset = function (item, affordance) {
  if (this.m_cachedOffset == null) {
    this.m_cachedOffset = Math.max(0, affordance.offsetLeft - item.offsetLeft)
      + (affordance.offsetWidth / 2);

    var itemOffset = this._calculateOffset(item);
    var listviewOffset = this._calculateOffset(this.listview.getListContainer().get(0));
    this.m_cachedOffset += Math.max(listviewOffset, itemOffset - listviewOffset);
  }

  return this.m_cachedOffset;
};

/**
 * Create and sets the drag image into the dataTransfer object
 * @param {Event} nativeEvent  DOM event object
 * @param {Array.<Element>} items array of row data
 * @protected
 */
oj.ListViewDndContext.prototype.SetDragItemImage = function (nativeEvent, items) {
  var dragImage;
  var offsetTop;
  var clone;
  var left = 0;
  var top = 0;
  var target = nativeEvent.target;
  var isCardLayout = this.listview.isCardLayout();

  if (items.length > 1) {
    dragImage = $(this._createDragImage());
    dragImage.css({
      width: this.listview.element.css('width'),
      height: this.listview.element.css('height')
    });

    var i;
    var minTop = Number.MAX_VALUE;

    // need to figure out which is the top item
    for (i = 0; i < items.length; i++) {
      minTop = Math.min(minTop, items[i].offsetTop);
    }

    // now construct the drag image
    for (i = 0; i < items.length; i++) {
      offsetTop = items[i].offsetTop - minTop;
      var offsetWidth = items[i].offsetWidth;
      clone = $(items[i].cloneNode(true));
      clone.removeClass('oj-selected oj-focus oj-hover')
        .css({
          position: 'absolute',
          top: offsetTop,
          width: offsetWidth
        });
      if (!isCardLayout) {
        clone.addClass('oj-listview-item-drag-image');
      }
      dragImage.append(clone); // @HTMLUpdateOK
    }
  } else {
    // calculate offset if drag on affordance
    if ($(target).hasClass(this.GetDragAffordanceClass())) {
      offsetTop = 0;
      if ($.contains(items[0], target.offsetParent)) {
        offsetTop = target.offsetTop;
      }

      left = this._calculateAffordanceOffset(items[0], target);
      top = offsetTop + (target.offsetHeight / 2);
    } else {
      left = Math.max(0, nativeEvent.offsetX);
      top = Math.max(0, nativeEvent.offsetY);
    }

    clone = $(items[0].cloneNode(true));
    clone.removeClass('oj-selected oj-focus oj-hover')
      .addClass('oj-drag');
    if (!isCardLayout) {
      clone.addClass('oj-listview-item-drag-image');
    }

    dragImage = $(this._createDragImage());
    dragImage.css({
      width: this.GetDragImageWidth(items[0]),
      height: items[0].offsetHeight * 2
    })
    .append(clone); // @HTMLUpdateOK
  }

  // copying class might not be sufficient since it could be on the custom element root
  if (isCardLayout) {
    dragImage.addClass('oj-listview-card-layout');
  }

  $('body').append(dragImage); // @HTMLUpdateOK
  this.m_dragImage = dragImage;
  nativeEvent.dataTransfer.setDragImage(dragImage.get(0), left, top);
};

/**
 * Returns the Drag image width. Need to be overriden by navlist.
 * @return {string} width
 * @protected
 */
oj.ListViewDndContext.prototype.GetDragImageWidth = function () {
  return this.listview.element.css('width');
};

/**
 * Returns the default data type. Need to be overriden by navlist
 * @return {string} the default data type
 * @protected
 */
oj.ListViewDndContext.prototype.GetDefaultDataType = function () {
  return 'text/ojlistview-items-data';
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
oj.ListViewDndContext.prototype._handleDragStart = function (event) {
  var options = this._getDragOptions();
  if (options != null || this.IsItemReOrdering()) {
    var dataTypes;
    if (options != null) {
      dataTypes = options.dataTypes;
    } else {
      dataTypes = this.GetDefaultDataType();
    }

    var items;
    if ($(event.target).hasClass(this.GetDragAffordanceClass()) || this.shouldDragCurrentItem()) {
      // if it's affordance then use event target
      items = [];
      items.push(this._findItem(event.target)[0]);
    } else {
      items = this._getSelectedItems(true);
    }

    if (items.length > 0) {
      this.m_dragItems = items;
      this.m_currentDragItem = $(items[0]);

      var ui = this._setDragItemDataTransfer(event, dataTypes, items);
      if (ui) {
        var ret = this._invokeDndCallback('drag', 'dragStart', event, ui);

        // dragStart is optional
        if (ret === -1) {
          return undefined;
        }

        // but if it's specified, it could abort drag by returning false
        return ret;
      }

      // no data, abort drag
      return false;
    }
  }

  // don't return anything since apps can register their own custom event handler
  return undefined;
};

/**
 * Drag event handler
 * @param {Event} event  jQuery event object
 * @private
 */
oj.ListViewDndContext.prototype._handleDrag = function (event) {
  // invoke callback
  return this._invokeDndCallback('drag', 'drag', event);
};

/**
 * Delete the drag image
 * @private
 */
oj.ListViewDndContext.prototype._destroyDragImage = function () {
  if (this.m_dragImage != null) {
    this.m_dragImage.remove();
    this.m_dragImage = null;
  }
};

/**
 * Drag end event handler
 * @param {Event} event  jQuery event object
 * @private
 */
oj.ListViewDndContext.prototype._handleDragEnd = function (event) {
  // remove css class and make sure it's visible again
  if (this.m_currentDragItem != null && this.m_dragItems != null) {
    // for drag affordance case
    this.m_currentDragItem.find('.' + this.GetDragAffordanceClass())
      .removeAttr('draggable');

    this.m_currentDragItem.removeClass('oj-drag oj-draggable')
      .removeAttr('draggable');

    for (var i = 0; i < this.m_dragItems.length; i++) {
      var dragItem = this.m_dragItems[i];
      dragItem.classList.remove('oj-listview-drag-source');
      dragItem.classList.remove(this.GetDragItemClass());
      $(dragItem).css('display', '');
    }
  }

  // remove drop target, if any
  this._cleanupDropTarget();

  // clean up drag image
  this._destroyDragImage();

  // remove style classes from selected items that were draggable
  this._unsetSelectionDraggable();

  // invoke callback
  this._invokeDndCallback('drag', 'dragEnd', event);

  // save dragItems for potential drop within same listview (reordering)
  this.m_itemsDragged = this.m_dragItems;

  // reset drag variables (except this.m_dragItems)
  this.m_dragImage = null;
  this.m_currentDragItem = null;
  this.m_dragItems = null;

  // focus should now be at document body, since blur event was skipped, do the tabindex change here
  this.listview._doBlur();
};

/**
 * Return true if the data types from dnd event match one of the values in an array
 * @param {Event} event  jQuery event object for a drag and drop event
 * @return {boolean} true if one of the types in dragDataTypes and allowedTypes matches
 * @private
 */
oj.ListViewDndContext.prototype._matchDragDataType = function (event) {
  var options = this._getDropOptions();
  if (options && options.dataTypes) {
    var allowedTypes = options.dataTypes;
    var allowedTypeArray = (typeof allowedTypes === 'string') ? [allowedTypes] : allowedTypes;

    // dragDataTypes can be either an array of strings (Chrome) or a
    // DOMStringList (Firefox and IE).  For cross-browser compatibility, use its
    // length and index to traverse it.
    var dragDataTypes = event.originalEvent.dataTransfer.types;
    for (var i = 0; i < dragDataTypes.length; i++) {
      if (allowedTypeArray.indexOf(dragDataTypes[i]) >= 0) {
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
oj.ListViewDndContext.prototype._invokeDropCallback = function (callbackType, event, ui) {
  var returnValue = this._invokeDndCallback('drop', callbackType, event, ui);
  if (returnValue === undefined || returnValue === -1) {
    if (this._matchDragDataType(event)) {
      event.preventDefault();
    }
  }

  return returnValue;
};

/**
 * @private
 */
oj.ListViewDndContext.prototype._getDropIndicator = function () {
  return this.m_dragItems != null ? 'space' : 'line';
};

/**
 * Create drop target based on item
 * @param {jQuery} item the item to create drop target based on
 * @return {jQuery} the drop target
 * @private
 */
oj.ListViewDndContext.prototype._createDropTarget = function (item) {
  var type = this._getDropIndicator();

  if (this.m_dropTarget == null) {
    var dropTarget;
    if (type === 'space') {
      dropTarget = $(item.get(0).cloneNode(false));
      dropTarget.addClass('oj-drop')
        .removeClass('oj-drag oj-draggable oj-hover oj-focus')
        .css({
          display: 'block',
          height: item.outerHeight(),
          width: item.outerWidth()
        });
    } else if (type === 'line') {
      dropTarget = document.createElement('li');
      dropTarget.classList.add('oj-listview-drop-target');
    }

    this.m_dropTarget = $(dropTarget);
  }

  if (type === 'line') {
    var elem = item.get(0);
    elem.classList.add('oj-drop');
    if (this.m_dropTargetElem != null) {
      this.m_dropTargetElem.classList.remove('oj-drop');
    }
    this.m_dropTargetElem = elem;
    var top = (elem.offsetTop + elem.offsetHeight) - this._getDropIndicatorHeight();
    // if it's the last item and gridlines are visible, need to make an adjustment
    if (item.get(0).nextElementSibling == null && this.listview._isGridlinesVisible()) {
      top -= 1;
    }
    this.m_dropTarget.get(0).style.top = top + 'px';
  }

  return this.m_dropTarget;
};

/**
 * Gets and cached the height of the drop indicator
 * @private
 */
oj.ListViewDndContext.prototype._getDropIndicatorHeight = function () {
  if (!isNaN(this.m_dropIndicatorHeight)) {
    return this.m_dropIndicatorHeight;
  }

  if (this.m_dropTarget) {
    var dropIndicator = this.m_dropTarget.get(0);
    this.listview.element.get(0).appendChild(dropIndicator);
    this.m_dropIndicatorHeight = dropIndicator.offsetHeight;
    if (this.listview._isGridlinesVisible()) {
      this.m_dropIndicatorHeight -= 1;
    }
    return this.m_dropIndicatorHeight;
  }
  return 0;
};

/**
 * Clean up group item drop target artifacts
 * @private
 */
oj.ListViewDndContext.prototype._cleanupGroupItem = function () {
  // for group item
  if (this.m_currentDropItem != null && this.m_dropTargetIndex === -1) {
    this.m_currentDropItem.children('.' + this.listview.getGroupItemStyleClass()).removeClass('oj-drop');
  }
};

/**
 * Clean up for the case of empty list
 * @private
 */
oj.ListViewDndContext.prototype._cleanupEmptyList = function () {
  // if it's drop on an empty list
  if (this.m_currentDropItem != null &&
      this.m_currentDropItem.hasClass(this.listview.getEmptyTextStyleClass())) {
    this.m_currentDropItem.removeClass('oj-drop');
    this.m_currentDropItem.get(0).textContent = this.listview._getEmptyText();
  }
};

/**
 * Clean up drop target artifacts
 * @private
 */
oj.ListViewDndContext.prototype._cleanupDropTarget = function () {
  if (this.m_dropTarget != null) {
    this.m_dropTarget.css('height', '0');
    this.m_dropTarget.remove();
    this.m_dropTarget = null;
  }

  if (this.m_dropTargetElem != null) {
    this.m_dropTargetElem.classList.remove('oj-drop');
  }

  if (this.m_firstDropTarget != null) {
    this.m_firstDropTarget.parentNode.removeChild(this.m_firstDropTarget);
    this.m_firstDropTarget = null;
  }

  this._cleanupEmptyList();
  this._cleanupGroupItem();
};

/**
 * Drag enter event handler
 * @param {Event} event  jQuery event object
 * @private
 */
oj.ListViewDndContext.prototype._handleDragEnter = function (event) {
  var item = this._findItem(event.target);
  if (item != null && item.length > 0) {
    var returnValue = this._invokeDropCallback('dragEnter', event, { item: item.get(0) });
    if (returnValue !== -1) {
      return returnValue;
    }
  }
  return undefined;
};

/**
 * Sets the current drop item
 * @param {jQuery} item the item to set as current drop item
 * @private
 */
oj.ListViewDndContext.prototype._setCurrentDropItem = function (item) {
  if (this.m_currentDropItem != null) {
    this.m_currentDropItem.removeClass('oj-valid-drop oj-invalid-drop');
  }

  this.m_currentDropItem = item;
  this.m_currentDropItem.addClass('oj-valid-drop');
};

/**
 * Sets the accessible text according to the drop position
 * @param {jQuery} item the drop target reference
 * @param {string} position either 'before' or 'after'
 * @private
 */
oj.ListViewDndContext.prototype._setAccInfo = function (item, position) {
  // we'll see if there is a label associated with the item, if not, look for text inside the item
  var label = item.attr('aria-label');
  if (label == null) {
    label = item.text();
  }

  var key = 'accessibleReorder' + position.charAt(0).toUpperCase() + position.substr(1) + 'Item';
  var msg = this.listview.ojContext.getTranslatedString(key, { item: label });
  this.listview._setAccInfoText(msg);
};

/**
 * Adjust the max height of group item
 * @private
 */
oj.ListViewDndContext.prototype._adjustGroupItemStyle = function () {
  // for touch we'll need to remove max height set
  if (this.m_maxHeightAdjusted == null && this.listview._isTouchSupport()) {
    this.listview.element.find('ul.' +
                               this.listview.getGroupStyleClass()).each(function () {
                                 $(this).attr('oldMaxHeight', $(this).css('maxHeight').toString());
                                 $(this).css('maxHeight', 10000);
                               });

    this.m_maxHeightAdjusted = 'adjusted';
  }
};

/**
 * Reverse of _adjustGroupItemStyle
 * @private
 */
oj.ListViewDndContext.prototype._restoreGroupItemStyle = function () {
  if (this.listview._isTouchSupport()) {
    this.listview.element.find('ul.' +
                               this.listview.getGroupStyleClass()).each(function () {
                                 $(this).css('maxHeight', parseInt($(this).attr('oldMaxHeight'), 10));
                                 $(this).removeAttr('oldMaxHeight');
                               });
  }

  this.m_maxHeightAdjusted = null;
};

/**
 * Sets/updates the drop position
 * @private
 */
oj.ListViewDndContext.prototype._setDropPosition = function (item, dropTarget) {
  var type = this._getDropIndicator();

  if (type === 'line') {
    dropTarget.insertAfter(item); // @HTMLUpdateOK
    return 'after';
  }

  var index = item.index();
  if (this.m_dropTargetIndex == null || this.m_dropTargetIndex < index) {
    dropTarget.insertAfter(item); // @HTMLUpdateOK
    return 'after';
  }

  dropTarget.insertBefore(item); // @HTMLUpdateOK
  return 'before';
};

/**
 * Handles the special case of inserting before the first item (at root or in group node)
 * @private
 */
oj.ListViewDndContext.prototype._checkFirstItemDropTarget = function (item, dropTarget, target) {
  if (target.classList.contains('oj-listview-first-drop-target')) {
    // in the top drop area
    this.m_dropPosition = 'before';
    // eslint-disable-next-line no-param-reassign
    dropTarget.style.top = '0px';
    return;
  }

  if (this._getDropIndicator() === 'line') {
    if (item.previousElementSibling === null) {
      // first item
      if (this.m_firstDropTarget == null) {
        var topDropTarget = document.createElement('li');
        topDropTarget.classList.add('oj-listview-first-drop-target');
        topDropTarget.style.top = '0px';
        item.parentNode.appendChild(topDropTarget);
        this.m_firstDropTarget = topDropTarget;
      } else {
        // first item, but not in the top drop area
        this.m_dropPosition = 'after';
        // eslint-disable-next-line no-param-reassign
        dropTarget.style.top = ((item.offsetTop + item.offsetHeight) - this._getDropIndicatorHeight()) + 'px';
      }
    } else if (this.m_firstDropTarget) {
      // not the first item, remove any first drop target artifacts
      this.m_firstDropTarget.parentNode.removeChild(this.m_firstDropTarget);
      this.m_firstDropTarget = null;
    }
  }
};

/**
 * Drag over event handler
 * @param {Event} event  jQuery event object
 * @private
 */
oj.ListViewDndContext.prototype._handleDragOver = function (event) {
  var item;
  var dropTarget;
  var returnValue;

  // do any neccessary group item
  this._adjustGroupItemStyle();

  // checks whether this is initially dragging over the drag item
  if (this.m_dragItems != null && $(this.m_dragItems[0]).css('display') !== 'none') {
    // take out the current drag item and create drop target
    item = $(this.m_dragItems[0]);

    // this will check for matching data types
    returnValue = this._invokeDropCallback('dragOver', event, { item: item.get(0) });

    // note drop is allowed in the case where reordering is enabled and drag source is itself, but only if there's no dragOver callback
    // to prevent the drop
    if ((returnValue === -1 && this.IsItemReOrdering() && this.isDndInProgress()) ||
        returnValue === false || event.isDefaultPrevented()) {
      dropTarget = this._createDropTarget(item);

      for (var i = 0; i < this.m_dragItems.length; i++) {
        // we have to override inline style instead of doing it inside style class since
        // custom style class could override it
        $(this.m_dragItems[i]).addClass(this.GetDragItemClass())
          .css('display', 'none');
      }

      dropTarget.insertBefore(item); // @HTMLUpdateOK
      this.m_dropTargetIndex = dropTarget.index();
    } else {
      // not reorder or dnd within ListView, so apply dnd across collection styling
      item.get(0).classList.remove('oj-hover');
      item.get(0).classList.add('oj-listview-drag-source');
    }
  } else {
    // if drag over callback allows drop or if it's item reordering
    item = this._findItem(event.target);
    if (item != null && item.length > 0) {
      // this will check for matching data types
      returnValue = this._invokeDropCallback('dragOver', event, { item: item.get(0) });

      // note drop is allowed in the case where reordering is enabled and drag source is itself, but only if there's no dragOver callback
      // to prevent the drop
      if ((returnValue === -1 && this.IsItemReOrdering() && this.isDndInProgress()) ||
          returnValue === false || event.isDefaultPrevented()) {
        // if it is non-group item
        if (item.hasClass(this.listview.getItemStyleClass())) {
          this._cleanupGroupItem();

          // if a drop target has not been created for this item
          if (!item.hasClass('oj-drop')) {
            dropTarget = this._createDropTarget(item);
            this.m_dropPosition = this._setDropPosition(item, dropTarget);
            this._setAccInfo(item, this.m_dropPosition);
            this._setCurrentDropItem(item);
            this.m_dropTargetIndex = dropTarget.index();
          } else {
            dropTarget = this.m_dropTarget;
          }
          // handle special case for first item (root or in a group)
          this._checkFirstItemDropTarget(item.get(0), dropTarget.get(0), event.target);
        } else {
          // there won't be a drop target placeholder, remove any previous ones
          this._cleanupDropTarget();

          // for group item
          item.children('.' + this.listview.getGroupItemStyleClass()).addClass('oj-drop');
          this._setCurrentDropItem(item);
          this.m_dropTargetIndex = -1;
          this.m_dropPosition = 'inside';
          this._setAccInfo(item, this.m_dropPosition);
        }
        event.preventDefault();
      } else if (!$(event.target).hasClass(this.listview.getGroupStyleClass())) {
        // don't remove the drop target if we have inside the empty area of the list of a group item
        // this happens mostly in card layout view
        // not a valid drop target
        item.addClass('oj-invalid-drop');

        // remove any drop target placeholder
        this._cleanupDropTarget();
      }
    } else {
      // drop on an empty list
      var emptyItem = this._getAndUpdateEmptyItem();
      if (emptyItem != null && emptyItem.length > 0) {
        this._setCurrentDropItem(emptyItem);
        event.preventDefault();
      }
    }
  }

  return returnValue;
};

/**
 * @private
 */
oj.ListViewDndContext.prototype._getAndUpdateEmptyItem = function () {
  var emptyItem = this.listview.element.children('.' + this.listview.getEmptyTextStyleClass());
  if (emptyItem.length === 0) {
    emptyItem = $(this.listview.element[0].querySelector('.oj-listview-no-data-item'));
  } else {
    emptyItem.get(0).textContent = '';
  }
  emptyItem.addClass('oj-drop');
  return emptyItem;
};

/**
 * Return true if the mouse/touch point of a dnd event is in an element.
 * This is identical to _isDndEventInElement in TableDndContext.js
 * @param {Event} event  jQuery event object
 * @param {EventTarget} element  DOM element
 * @return {boolean} whether mouse/touch point is in an element
 */
oj.ListViewDndContext.prototype._isDndEventInElement = function (event, element) {
  var rect = element.getBoundingClientRect();
  var domEvent = event.originalEvent;

  // clientX and clientY are only available on the original DOM event
  return (domEvent.clientX >= rect.left && domEvent.clientX < rect.right &&
          domEvent.clientY >= rect.top && domEvent.clientY < rect.bottom);
};

/**
 * Drag leave event handler
 * @param {Event} event  jQuery event object
 * @private
 */
oj.ListViewDndContext.prototype._handleDragLeave = function (event) {
  var returnValue;

  if (this.m_currentDropItem == null) {
    return undefined;
  }

  var item = this._findItem(event.target);
  if (item != null && item.length > 0) {
    item.removeClass('oj-valid-drop oj-invalid-drop');

    returnValue = this._invokeDropCallback('dragLeave', event, { item: item.get(0) });

    // Remove the drop target indicator if we are no longer in listview since
    // this may be the last dnd event we get.
    if (!this._isDndEventInElement(event, event.currentTarget) && item.hasClass('oj-drop')) {
      this._cleanupDropTarget();
      this._restoreGroupItemStyle();
    }
  } else if (!this._isDndEventInElement(event, event.currentTarget)) {
    // empty list case
    this._cleanupEmptyList();
  }

  if (returnValue !== -1) {
    return returnValue;
  }
  return undefined;
};

/**
 * @private
 */
oj.ListViewDndContext.prototype._isEmptyItem = function (item) {
  return item.hasClass(this.listview.getEmptyTextStyleClass()) ||
    item.hasClass('oj-listview-no-data-item');
};

/**
 * Drop event handler
 * @param {Event} event  jQuery event object
 * @private
 */
oj.ListViewDndContext.prototype._handleDrop = function (event) {
  if (this.m_currentDropItem == null) {
    return undefined;
  }

  var source = event.originalEvent.dataTransfer.getData(this.GetDragSourceType());

  // invoke callback
  var ui;
  if (this._isEmptyItem(this.m_currentDropItem)) {
    ui = {};
  } else {
    ui = { item: this.m_currentDropItem.get(0), position: this.m_dropPosition };
  }

  // add the reorder param
  if (this.IsItemReOrdering() && source === this.listview.element.get(0).id) {
    ui.reorder = true;
  } else {
    ui.reorder = false;
  }

  // cleanup artifacts before firing events
  if (this.m_currentDropItem != null) {
    this.m_currentDropItem.removeClass('oj-valid-drop');
  }
  this._cleanupDropTarget();
  this._restoreGroupItemStyle();
  this._destroyDragImage();

  // fire drop event
  var returnValue = this._invokeDropCallback('drop', event, ui);

  // fire reorder event
  if (ui.reorder) {
    // the order in which dragEnd and drop event is called is inconsistent, hence the check
    // Always we should check for this.m_dragItems as it will be null only if dragend already invoked
    // and items are copied to this.m_itemsDragged.
    ui.items = this.m_dragItems == null ? this.m_itemsDragged : this.m_dragItems;

    this.listview.Trigger('reorder', event, this.CreateReorderPayload(ui.items, ui.position, ui.item));

    // the drop should be complete regardless the value of callback
    event.preventDefault();
  }

  // reset drop variables
  this.m_currentDropItem = null;
  this.m_dropTargetIndex = -1;
  this.m_dropPosition = null;
  this.m_itemsDragged = null;

  if (returnValue === -1) {
    return undefined;
  }

  return returnValue;
};

/**
 * Returns payload object for reorder event. Navlist overrides this.
 * @param {Array} items, items to be moved.
 * @param {string} position, the drop position relative to the reference item.
 * @param {Element} reference, the item where the moved items are drop on.
 * @returns {Object} payload object
 * @protected
 */
oj.ListViewDndContext.prototype.CreateReorderPayload = function (items, position, reference) {
  return {
    items: items,
    position: position,
    reference: reference
  };
};

/** ********************************* Context menu ***********************************************/
/**
 * Prepares the context menu before it is opened.  Invoked by notifyContextMenuGesture.
 * @param {Element} contextMenu the context menu root element
 */
oj.ListViewDndContext.prototype.prepareContextMenu = function (contextMenu) {
  var self = this;

  // only add context menu if item reordering is enabled
  if (!this.IsItemReOrdering()) {
    return;
  }

  var menuContainer = $(contextMenu);
  if (this.m_contextMenu !== contextMenu) {
    this.m_contextMenu = contextMenu;

    if (contextMenu.tagName === 'OJ-MENU') {
      contextMenu.addEventListener('ojBeforeOpen', this._handleContextMenuBeforeOpen.bind(this));
      contextMenu.addEventListener('ojAction', this._handleContextMenuSelect.bind(this));
    } else {
      menuContainer.on('ojbeforeopen', this._handleContextMenuBeforeOpen.bind(this));
      menuContainer.on('ojselect', this._handleContextMenuSelect.bind(this));
    }
  }

  var menuItemsSet = this._getCommands(contextMenu, function (menuItem, command) {
    var newListItem = self._buildContextMenuItem(command, menuItem.tagName);
    if (menuItem.tagName === 'OJ-OPTION') {
      // eslint-disable-next-line no-param-reassign
      menuItem.innerHTML = newListItem.get(0).innerHTML; // @HTMLUpdateOK
      $(menuItem).attr('data-oj-command', newListItem.attr('data-oj-command'));
    } else {
      newListItem.get(0).className = $(menuItem).get(0).className;
      $(menuItem).replaceWith(newListItem); // @HTMLUpdateOK
    }
  });

  // this keeps track of which menu items were generated by the listview dynamically
  // this way on a refresh we know to recreate them in case there was a locale or
  // translations change
  this.m_menuItemsSet = menuItemsSet;

  if (menuItemsSet.length > 0) {
    if (menuContainer.data('oj-ojMenu')) {
      if (contextMenu.tagName === 'OJ-MENU') {
        contextMenu.refresh();
      } else {
        $(contextMenu).ojMenu('refresh');
      }
    }
  }
};

/**
 * Returns selector to extract only the context menu items with valid commands.
 * Navlist has remove menu item which needs to be ignored by listview.
 * @returns {string} jquery selector string.
 */
oj.ListViewDndContext.prototype._getDndContextMenuItemSelector = function () {
  var self = this;
  var query = '';
  var commands = [
    'cut', 'copy', 'paste', 'paste-before', 'paste-after', 'pasteBefore', 'pasteAfter'
  ];

  if (!this.m_dndMenuItemSelector) {
    commands.forEach(function (command, index) {
      query += '[data-oj-command=' + self.GetCommandPrefix() + command + '],';
      query += '[data-oj-command=' + command + ']';
      if (index < commands.length - 1) {
        query += ',';
      }
    });
    this.m_dndMenuItemSelector = query;
  }
  return this.m_dndMenuItemSelector;
};

/**
 * Retrieves a list of commands from the context menu.
 * @param {Element} contextMenu the context menu element
 * @param {function(Element, string)=} callback the function to invoke on each menu item found
 * @return {Array} a list of commands
 * @private
 */
oj.ListViewDndContext.prototype._getCommands = function (contextMenu, callback) {
  var self = this;
  var capabilities = [];
  var listItems = $(contextMenu).find(this._getDndContextMenuItemSelector());
  listItems.each(function () {
    var command;
    var anchor = $(this).children('a');

    if (anchor.length === 0) {
      if ($(this).attr('data-oj-command').indexOf(self.GetCommandPrefix()) === 0) {
        command = $(this).attr('data-oj-command').substring(self.GetCommandPrefix().length);
        if (callback) {
          callback(this, command);
        }
      }
    } else {
      command = $(this).attr('data-oj-command');

      // mapping for paste
      if (command === oj.ListViewDndContext.PASTE_BEFORE_COMMAND) {
        command = 'paste-before';
      } else if (command === oj.ListViewDndContext.PASTE_AFTER_COMMAND) {
        command = 'paste-after';
      }
    }

    if (command) {
      capabilities.push(command);
    }
  });

  return capabilities;
};

/**
 * Builds a menu for a command, takes care of submenus where appropriate
 * @param {string} command the command that the listview should build a menu item for
 * @param {string} tagName to use to create the menu item
 * @private
 */
oj.ListViewDndContext.prototype._buildContextMenuItem = function (command, tagName) {
  if (command === 'paste-before') {
    return this._buildContextMenuListItem(oj.ListViewDndContext.PASTE_BEFORE_COMMAND, tagName);
  } else if (command === 'paste-after') {
    return this._buildContextMenuListItem(oj.ListViewDndContext.PASTE_AFTER_COMMAND, tagName);
  }

  return this._buildContextMenuListItem(command, tagName);
};

/**
 * Builds a context menu list item from a command
 * @param {string} command the string to look up command value for as well as translation
 * @param {string} tagName to use to create the menu item
 * @return {Object} a jQuery object with HTML containing a list item
 * @private
 */
oj.ListViewDndContext.prototype._buildContextMenuListItem = function (command, tagName) {
  var listItem = $(document.createElement(tagName)); // @HTMLUpdateOK
  listItem.attr('data-oj-command', command);
  listItem.append(this._buildContextMenuLabel(command, tagName === 'OJ-OPTION')); // @HTMLUpdateOK
  return listItem;
};

/**
 * Builds a context menu label by looking up command translation
 * @param {string} command the string to look up translation for
 * @param {boolean=} useOjOption whether oj-option tag should be used
 * @return {jQuery|string} a jQuery object with HTML containing a label
 * @private
 */
oj.ListViewDndContext.prototype._buildContextMenuLabel = function (command, useOjOption) {
  // convert to the translation key convention
  var key = 'label' + command.charAt(0).toUpperCase() + command.slice(1);
  var textNode = document.createTextNode(this.listview.ojContext.getTranslatedString(key));

  // for custom elements, no <a> tag is required
  if (useOjOption) {
    return textNode;
  }
  return $('<a href="#"></a>').append(textNode); // @HTMLUpdateOK
};

/**
 * Handles cut action
 * @param {Event} event jQuery event
 * @private
 */
oj.ListViewDndContext.prototype._handleCut = function (event) {
  // first restore style of any previously cut items
  if (this.m_clipboard != null) {
    $(this.m_clipboard).removeClass(this.GetCutStyleClass());
  }

  var items = this.GetCutItems(event);
  // focus should be moved back to listview after context menu is closed
  this.listview.ojContext.element.focus();
  $(items).addClass(this.GetCutStyleClass());
  this.m_clipboard = items;

  // fire cut event
  this.listview.Trigger('cut', event, { items: items });
};

/**
 * Returns cut items. Navlist overrides this.
 * @param {Event} event jQuery event
 * @returns {Array} array of items to be moved
 */
// eslint-disable-next-line no-unused-vars
oj.ListViewDndContext.prototype.GetCutItems = function (event) {
  return this._getSelectedItems();
};

/**
 * Handles copy action
 * @param {Event} event jQuery event
 * @private
 */
oj.ListViewDndContext.prototype._handleCopy = function (event) {
  // first restore style of any previously cut items
  if (this.m_clipboard != null) {
    $(this.m_clipboard).removeClass(this.GetCutStyleClass());
  }

  var items = this._getSelectedItems();
  this.m_clipboard = items;

  // fire cut event
  this.listview.Trigger('copy', event, { items: items });
};

/**
 * Handles paste action
 * @param {Event} event jQuery event
 * @param {jQuery} item the reference item of the paste
 * @param {string} position either before/after/inside
 * @private
 */
oj.ListViewDndContext.prototype._handlePaste = function (event, item, position) {
  // fire paste event
  this.listview.Trigger('paste', event, { item: item.get(0) });

  // restore cut item style
  $(this.m_clipboard).removeClass(this.GetCutStyleClass());

  // fire reorder event
  this.listview.Trigger('reorder', event,
                        this.CreateReorderPayload(this.m_clipboard,
                                                  position,
                                                  /** @type {Element} */ (item.get(0))));

  // clear the clipboard
  this.m_clipboard = null;
};

/**
 * Select handler for context menu items
 * @param {Event} event jQuery event object
 * @param {Object=} ui additional info from event
 * @private
 */
oj.ListViewDndContext.prototype._handleContextMenuSelect = function (event, ui) {
  // should never happen
  if (this.m_contextMenuItem == null) {
    return;
  }

  var item = ui ? ui.item : $(event.target);
  switch (item.attr('data-oj-command')) {
    case oj.ListViewDndContext.CUT_COMMAND:
      this._handleCut(event);
      break;

    case oj.ListViewDndContext.COPY_COMMAND:
      this._handleCopy(event);
      break;

    case oj.ListViewDndContext.PASTE_COMMAND:
      this._handlePaste(event, this.m_contextMenuItem, 'inside');

      // cleanup
      this.m_contextMenuItem = null;
      break;

    case oj.ListViewDndContext.PASTE_BEFORE_COMMAND:
      this._handlePaste(event, this.m_contextMenuItem, 'before');

      // cleanup
      this.m_contextMenuItem = null;
      break;

    case oj.ListViewDndContext.PASTE_AFTER_COMMAND:
      this._handlePaste(event, this.m_contextMenuItem, 'after');

      // cleanup
      this.m_contextMenuItem = null;

      break;

    default:
      break;
  }
};

/**
 * Append or show menu item based on command
 * @param {jQuery} menuContainer the menu container
 * @param {string} command the command of the menu item
 * @private
 */
oj.ListViewDndContext.prototype._appendToMenuContainer = function (menuContainer, command) {
  // whether default context menu is used
  if (this.m_menuItemsSet != null) {
    if (command === 'paste-before') {
      // eslint-disable-next-line no-param-reassign
      command = oj.ListViewDndContext.PASTE_BEFORE_COMMAND;
    } else if (command === 'paste-after') {
      // eslint-disable-next-line no-param-reassign
      command = oj.ListViewDndContext.PASTE_AFTER_COMMAND;
    }

    // show the menu item
    menuContainer.find("[data-oj-command='" + command + "']")
      .removeClass('oj-disabled');
  }
};

/**
 * Before open handler so that ListView can customize content of context menu based on item
 * @param {Event} event jQuery event object
 * @param {Object=} ui ui object
 * @private
 */
oj.ListViewDndContext.prototype._handleContextMenuBeforeOpen = function (event, ui) {
  var menuContainer = $(event.target);

  // disable all menu items first, needs to be done even if there's no default menu items since
  // there could be one from before refresh
  menuContainer.find(this._getDndContextMenuItemSelector())
    .addClass('oj-disabled');

  var item = ui ? ui.openOptions.launcher : event.detail.openOptions.launcher;
  if (item == null || this.m_menuItemsSet == null || this.m_menuItemsSet.length === 0) {
    // refresh to take effect
    if (menuContainer.get(0).tagName !== 'OJ-MENU') {
      menuContainer.ojMenu('refresh');
    }
    return;
  }

  // now add menu items
  if (item.children().first().hasClass(this.listview.getGroupItemStyleClass())) {
    // check if cut action was performed
    if (this.m_clipboard != null) {
      this._appendToMenuContainer(menuContainer, 'paste');
    }
  } else {
    this._appendToMenuContainer(menuContainer, 'cut');
    this._appendToMenuContainer(menuContainer, 'copy');
    // check if cut action was performed
    if (this.m_clipboard != null) {
      this._appendToMenuContainer(menuContainer, 'paste-before');
      this._appendToMenuContainer(menuContainer, 'paste-after');
    }
  }

  // refresh to take effect
  if (menuContainer.get(0).tagName !== 'OJ-MENU') {
    menuContainer.ojMenu('refresh');
  }

  this.m_contextMenuItem = item;
};

/**
 * Handles key down event
 * @param {Event} event the keydown event
 * @return {boolean} true if key event is handled, false otherwise
 * @private
 */
oj.ListViewDndContext.prototype.HandleKeyDown = function (event) {
  if (event.ctrlKey || event.metaKey) {
    var keyCode = event.keyCode;
    // quickly short circuit it if it's not one of the supported keys
    if (keyCode === oj.ListViewDndContext.X_KEY ||
        keyCode === oj.ListViewDndContext.C_KEY ||
        oj.ListViewDndContext.V_KEY) {
      // only if item reordering is enabled
      if (!this.IsItemReOrdering()) {
        return false;
      }

      // capabilities depends on what's specified in context menu
      var contextMenu = this.listview.ojContext._GetContextMenu();
      if (contextMenu == null) {
        return false;
      }

      // no clipboard commands found
      var commands = this._getCommands(contextMenu);
      if (commands.length === 0) {
        return false;
      }

      if (keyCode === oj.ListViewDndContext.X_KEY && commands.indexOf('cut') > -1) {
        this._handleCut(event);
        return true;
      } else if (keyCode === oj.ListViewDndContext.C_KEY && commands.indexOf('copy') > -1) {
        this._handleCopy(event);
        return true;
      } else if (keyCode === oj.ListViewDndContext.V_KEY) {
        if (this.m_clipboard != null) {
          var active = $(this._getActiveItem());
          var position;
          if (active.children().first().hasClass(this.listview.getGroupItemStyleClass())) {
            if (commands.indexOf('paste') > -1) {
              position = 'inside';
            }
          } else if (commands.indexOf('paste-before') > -1) {
            position = 'before';
          } else if (commands.indexOf('paste-after') > -1) {
            position = 'after';
          }

          if (position != null) {
            this._handlePaste(event, active, position);
            return true;
          }
        }
      }
    }
  }

  return false;
};

/**
 * Return true to drag current item. Need to be overriden by navlist.
 * @return {boolean} true to drag current item.
 * @private
 */
oj.ListViewDndContext.prototype.shouldDragCurrentItem = function () {
  return false;
};

/**
 * Returns drag source type. Need to be overriden by navlist.
 * @return {string} drag source type.
 * @private
 */
oj.ListViewDndContext.prototype.GetDragSourceType = function () {
  return 'text/ojlistview-dragsource-id';
};

});