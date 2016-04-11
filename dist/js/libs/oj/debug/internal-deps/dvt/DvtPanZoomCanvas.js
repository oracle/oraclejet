/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

(function(dvt) {
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.



//TODO: remove focusEvent
/**
 * @extends {dvt.Container}
 * @constructor
 * @class dvt.ComboBox ComboBox UI control
 * @param {dvt.Context} context Platform specific context object
 * @param {String} id Optional id for this object
 * @param {Object} styleMap The object containing style specifications for this component
 */
dvt.ComboBox = function(context, id, styleMap) {
  this.Init(context, id, styleMap);
};

/*
 * make dvt.ComboBox a subclass of dvt.Container
 */
dvt.Obj.createSubclass(dvt.ComboBox, dvt.Container);

dvt.ComboBox._HIDE_DROPDOWN_DELAY = 100;//in ms
dvt.ComboBox._DROPDOWN_OUTOFFOCUS_CHECK = 100;//in ms


/**
 * Initialization method called by the constructor
 *
 * @param {dvt.Context} context Platform specific context object
 * @param {String} id Optional id for this object
 * @param {object} styleMap The object containing style specifications for this component
 */
dvt.ComboBox.prototype.Init = function(context, id, styleMap)
{
  dvt.ComboBox.superclass.Init.call(this, context, null, id);

  this._styleMap = styleMap;

  //array of button states to use for main button when given item is selected
  this._itemButtonStates = [];
  this._items = [];
  this._tooltips = [];
  this._selectedIndex = 0;

  //flag indicating if the main button states should change when
  //the selected item changes
  this._bStaticButtonStates = false;

  //BUG FIX #10142865: flag indicating that the dropdown has been hidden and
  //should be removed
  this._bRemoveDropdown = false;

  this._maxItemDim = new dvt.Rectangle(0, 0, 0, 0);
  this._itemDim = new dvt.Rectangle(0, 0, 0, 0);

  this._tooltipManager = context.getTooltipManager();
  this._isTouchDevice = dvt.Agent.isTouchDevice();

  //create the button representing the collapsed state
  this._button = this.createButton(id + '_cl');
  this.addChild(this._button);

  //create the content area of the button, which appears over the button
  //itself instead of in the button so that the content doesn't
  //have to be copied for each button state
  this._contentArea = new dvt.Container(context);
  this._contentArea.setMouseEnabled(false);
  this.addChild(this._contentArea);

  //create timer to auto-hide the dropdown after focus moves out of combobox
  this._hideDropdownTimer = new dvt.Timer(context, dvt.ComboBox._HIDE_DROPDOWN_DELAY,
      this.HandleHideDropdownTimer, this, 1);

  this._outOfFocusCheckTimer = new dvt.Timer(context, dvt.ComboBox._DROPDOWN_OUTOFFOCUS_CHECK,
      this.HandleOutOfFocusCheckTimer, this, 1);
  this._dropdownItemClickEvent = false;
};


dvt.ComboBox.prototype._stopHideDropdownTimer = function() {
  if (this._hideDropdownTimer) {
    this._hideDropdownTimer.stop();
    this._hideDropdownTimer = null;
  }
};


/**
 * Get the index of the selected item.
 * @return {Number}  index of selected item
 */
dvt.ComboBox.prototype.getSelectedIndex = function() {
  return this._selectedIndex;
};


/**
 * Set the index of the selected item.
 * @param {Number} selectedIndex index of item to select
 */
dvt.ComboBox.prototype.setSelectedIndex = function(selectedIndex) {
  this._selectedIndex = selectedIndex;

  //only update the content if the states are not static
  if (! this._bStaticButtonStates) {
    //update the content area for the selected item
    this.UpdateContentArea();
  }

  this.FireChangeEvent(selectedIndex);
};


/**
 * Create the button representing the collapsed combo box.
 * @param {string} id Button id
 * @return {dvt.Button} button representing the collapsed combo box
 */
dvt.ComboBox.prototype.createButton = function(id) {
  var button = new dvt.Button(this.getCtx(),
      this.createUpState(id),
      this.createDownState(id),
      this.createOverState(id),
      null,
      id);
  button.setCallback(this.HandleExpandClick, this);
  if (!this._isTouchDevice)
    button.addEvtListener(dvt.MouseEvent.MOUSEDOWN, this.HandleButtonDown, false, this);
  button.setToggleEnabled(true);
  return button;
};


/**
 * Create the "up" state of the collapsed combo box button.
 *
 * @return display object representing "up" state
 */
dvt.ComboBox.prototype.createUpState = function(id) {
  var context = this.getCtx();

  var s = new dvt.Rect(context, 0, 0, this._itemDim.w, this._itemDim.h, id + '_up');
  s.setCornerRadius(dvt.ButtonLAFUtils.ROUND_RECT_ELLIPSE);

  //Note: no border
  s.setInvisibleFill();

  s.addChild(dvt.ComboBox.DrawArrow(context, s.getWidth(), s.getHeight()));
  return s;
};


/**
 * Create the "over" state of the collapsed combo box button.
 *
 * @return display object representing "over" state
 */
dvt.ComboBox.prototype.createOverState = function(id) {
  var context = this.getCtx();

  var s = new dvt.Rect(context, 0, 0, this._itemDim.w, this._itemDim.h, id + '_up');
  s.setCornerRadius(dvt.ButtonLAFUtils.ROUND_RECT_ELLIPSE);

  s.setSolidStroke(dvt.ButtonLAFUtils.BORDER_COLOR);
  //  s.setFill(new dvt.GradientFill(dvt.ButtonLAFUtils.GRADIENT_LIGHT, 1));      // not passing arrays !!
  s.setFill(new dvt.LinearGradientFill(0, [dvt.ButtonLAFUtils.GRADIENT_DARK, dvt.ButtonLAFUtils.GRADIENT_LIGHT]));  //temp

  s.addChild(dvt.ComboBox.DrawArrow(context, s.getWidth(), s.getHeight()));
  return s;
};


/**
 * Create the "down" state of the collapsed combo box button.
 *
 * @return display object representing "down" state
 */
dvt.ComboBox.prototype.createDownState = function(id) {
  var context = this.getCtx();

  var s = new dvt.Rect(context, 0, 0, this._itemDim.w, this._itemDim.h, id + '_up');
  s.setSolidStroke(dvt.ButtonLAFUtils.BORDER_COLOR);
  //  s.setFill(new dvt.GradientFill(dvt.ButtonLAFUtils.GRADIENT_DARK, 1));     // not passing arrays!!
  s.setFill(new dvt.LinearGradientFill(0, [dvt.ButtonLAFUtils.GRADIENT_LIGHT, dvt.ButtonLAFUtils.GRADIENT_DARK]));   // temp
  s.setCornerRadius(dvt.ButtonLAFUtils.ROUND_RECT_ELLIPSE);

  s.addChild(dvt.ComboBox.DrawArrow(context, s.getWidth(), s.getHeight()));
  return s;
};

/**
  * Set the static button states to use for the main button.
  *
  * @param {dvt.Displayable} enaState  enabled state
  * @param {dvt.Displayable} ovrState  over state
  * @param {dvt.Displayable} dwnState  down state
  */
//  Note: this method is only called by panelCard
dvt.ComboBox.prototype.setStaticButtonStates = function(enaState, ovrState, dwnState) {
  this._button.setUpState(enaState);
  this._button.setDownState(dwnState);
  this._button.setOverState(ovrState);

  //set the flag indicating that the button states are static
  this._bStaticButtonStates = true;
};


/**
 * Add an item to the ComboBox.
 *
 * @param {DvtDisplayablej}  s          display object to add to the ComboBox
 * @param {String}           tooltip    tooltip to show for the item
 * @param {dvt.Displayable}   enaState   enabled state to use for item button in dropdown
 * @param {dvt.Displayable}   ovrState   over state to use for item button in dropdown
 * @param {dvt.Displayable}   dwnState   down state to use for item button in dropdown
 */
dvt.ComboBox.prototype.addItem = function(obj, tooltip, enaState, ovrState, dwnState)
{
  obj.setMouseEnabled(false);                //disable mouse interaction with item

  this._items.push(obj);
  this._tooltips.push(tooltip);

  // get/set max item width & height

  var itdim = dvt.ButtonLAFUtils._getDimForced(this.getCtx(), (enaState ? enaState : obj));
  var maxItemDim = this._getMaxItemDim();
  var context = this.getCtx();

  if (itdim.w > maxItemDim.w) {
    maxItemDim.w = itdim.w;
    this._itemDim.w = itdim.w + 16;
  }
  if (itdim.h > maxItemDim.h) {
    maxItemDim.h = itdim.h;
    this._itemDim.h = itdim.h;
  }
  this._maxItemDim = maxItemDim;


  //store the array of states for the item button in the dropdown
  var buttonStates = null;

  if (enaState && ovrState && dwnState) {
    buttonStates = [];
    buttonStates[dvt.Button.STATE_ENABLED] = enaState;
    buttonStates[dvt.Button.STATE_OVER] = ovrState;
    buttonStates[dvt.Button.STATE_DOWN] = dwnState;
  }
  this._itemButtonStates.push(buttonStates);

  //only create a new button and update the content if the states are not static
  if (! this._bStaticButtonStates) {
    //create a new button, taking the new item's dimensions into account
    this.removeChild(this._button);
    this._button = this.createButton(obj.getId());
    this.addChildAt(this._button, 0);

    //update the content area for the selected item
    this.UpdateContentArea();
  }
};


/**
 * Get an item in the ComboBox.
 *
 * @param i index of the item to get
 *
 * @return Sprite item in the ComboBox
 */
dvt.ComboBox.prototype.getItem = function(i) {
  return this._items[i];
};


/**
 * Get the number of items in the ComboBox.
 *
 * @return number of items in the ComboBox
 */
dvt.ComboBox.prototype.getItemCount = function() {
  return this._items.length;
};


/**
 * Get the index of the item in the ComboBox.
 *
 * @param s item to get index for
 *
 * @return index of the item in the ComboBox, or -1 if not found
 */
dvt.ComboBox.prototype.getItemIndex = function(s) {
  for (var i = 0; i < this.getItemCount(); i++) {
    if (this.getItem(i) === s)
      return i;
  }
  return - 1;
};


/**
 * Get the selected item.
 *
 * @return selected item
 */
dvt.ComboBox.prototype.getSelectedItem = function() {
  var selIndex = this.getSelectedIndex();
  if (selIndex < 0 || selIndex > this._items.length - 1)
    return null;

  return this._items[selIndex];
};


/**
 * @protected
 * Fire a change event.
 * @param {number} index index of the selected item
 * @return {boolean} true if event was successfully dispatched, false otherwise
 */
dvt.ComboBox.prototype.FireChangeEvent = function(index) {
  var comboBoxEvent = new dvt.ComboBoxEvent(dvt.ComboBoxEvent.SUBTYPE_ITEM_CHANGE, index);
  this.FireListener(comboBoxEvent);

  return true;
};


/**
 * Handle a click on the collapsed combo box to show its dropdown.
 *
 * @param  {MouseEvent}   event
 */
dvt.ComboBox.prototype.HandleExpandClick = function(event)
{

  dvt.EventManager.consumeEvent(event);    //don't want click to fall through to other components

  //BUG FIX #10142865: if the previous dropdown was hidden but hasn't been
  //removed yet, then remove it now before the new dropdown is created
  if (this._bRemoveDropdown) {
    this.RemoveDropdown();
  }

  var context = this.getCtx();

  //create the dropdown containing all the items
  this._dropdown = this.createDropdown();
  var dddim = dvt.ButtonLAFUtils._getDimForced(context, this._dropdown);
  this.addChild(this._dropdown);

  var dim = this._button.getDimensions();

  //BiDi: in right-to-left locale, shift dropdown towards the left
  var transX;
  if (dvt.Agent.isRightToLeft(context)) {
    transX = - dddim.w + dim.w * 1 / 4;
  }
  //position the dropdown relative to the button (based on UI spec)
  else {
    transX = dim.w * 3 / 4;
  }
  this._dropdown.setTranslate(transX, dim.h * 3 / 4);

  //disable the expand button until the dropdown is dismissed
  this._button.setMouseEnabled(false);
  this._button.setToggled(true);

  this.FireListener(new dvt.ComboBoxEvent(dvt.ComboBoxEvent.SUBTYPE_SHOW_DROPDOWN));

  //add a mouse focus change listener to the stage to detect
  //when we should auto-hide the dropdown
  var stage = context.getStage();
  if (stage) {
    if (this._isTouchDevice) {
      stage.addEvtListener(dvt.TouchEvent.TOUCHSTART, this.HandleStageMouseFocusChange, true, this);
    } else {
      stage.addEvtListener(dvt.MouseEvent.MOUSEUP, this.HandleStageMouseFocusChange, true, this);
    }
  }
};


/**
 * Handle an event from the timer used to auto-hide the dropdown.
 *
 * @param event TimerEvent
 */
dvt.ComboBox.prototype.HandleHideDropdownTimer = function(event) {
  //hide the dropdown
  this.HideDropdown();

  //only update the content if the button states are not static
  if (! this._bStaticButtonStates) {
    //update the content area to show the currently selected item
    this.UpdateContentArea();
  }
};


/**
 * Handle a mouse focus change event on the stage.
 *
 * @param even FocusEvent
 */
dvt.ComboBox.prototype.HandleStageMouseFocusChange = function(event) {

  this._dropdownItemClickEvent = false;
  this._outOfFocusCheckTimer.reset();
  this._outOfFocusCheckTimer.start();
};


/**
 * Handle an event from the timer used to check focus change.
 * If the user clicked outside of the dropdown - hide the dropdown
 *
 * @param event TimerEvent
 */
dvt.ComboBox.prototype.HandleOutOfFocusCheckTimer = function(event) {
  if (!this._dropdownItemClickEvent) {
    //reset and start the timer to auto-hide the dropdown;
    //the timer will be stopped if an item in the dropdown was selected
    this._hideDropdownTimer.reset();
    this._hideDropdownTimer.start();
  }
};


/**
 * Create the dropdown showing all the available items to select.
 *
 * @return {dvt.Path} display object representing the dropdown
 */
dvt.ComboBox.prototype.createDropdown = function() {
  //constants for padding around items in dropdown
  var comboBoxStyles = this._styleMap ? this._styleMap['comboBox'] : null;
  var topPadding = dvt.StyleUtils.getStyle(comboBoxStyles, dvt.ControlPanel.CP_PADDING_TOP, 0);
  var leftPadding = dvt.StyleUtils.getStyle(comboBoxStyles, dvt.ControlPanel.CP_PADDING_LEFT, 0);
  var bottomPadding = dvt.StyleUtils.getStyle(comboBoxStyles, dvt.ControlPanel.CP_PADDING_BOTTOM, 0);
  var rightPadding = dvt.StyleUtils.getStyle(comboBoxStyles, dvt.ControlPanel.CP_PADDING_RIGHT, 0);
  var interItemPadding = dvt.StyleUtils.getStyle(comboBoxStyles, dvt.ControlPanel.CP_PADDING_INNER, 0);

  var currY = topPadding;
  var context = this.getCtx();
  var dim;
  var itemSprite;
  var item;
  var content = new dvt.Container(context, '__dd');
  var thisRef = this;
  function createProxy(tooltip) {
    var proxy = {};
    proxy.HandleClick = function(event) {
      thisRef.HandleDropdownItemClick(event);
    };
    proxy.HandleMouseDown = function(event) {
      thisRef.HandleButtonDown(event);
    };
    proxy.getTooltip = function() {
      return tooltip;
    };
    return proxy;
  }

  for (var i = 0; i < this._items.length; i++) {
    item = this._items[i];
    dim = dvt.ButtonLAFUtils._getDimForced(context, item);

    //move each item below the previous one
    itemSprite = new dvt.Container(context, '__it' + i);
    itemSprite.setTranslate(leftPadding, currY);

    itemSprite.addChild(item);
    item.setMouseEnabled(true);
    item.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());

    currY += dim.h + interItemPadding;

    //add event listeners to each item
    if (this._eventManager) {
      this._eventManager.associate(item, createProxy(this._tooltips[i]));
    }
    content.addChild(itemSprite);
  }

  var dd = dvt.ButtonLAFUtils.drawDropdownShape(context,
      this._getMaxItemDim().w + leftPadding + rightPadding,
      currY + bottomPadding - interItemPadding, comboBoxStyles);
  dd.addChild(content);

  //draw the background behind all the items now that we know the size of the dropdown
  var borderColor = dvt.StyleUtils.getStyle(this._styleMap, dvt.CSSStyle.BORDER_COLOR, null);
  var borderAlpha = dvt.StyleUtils.getStyle(this._styleMap, dvt.ControlPanel.FRAME_ROLLOUT_ALPHA, 1);
  var bgColor = dvt.StyleUtils.getStyle(this._styleMap, dvt.CSSStyle.BACKGROUND_COLOR, null);
  var bgAlpha = dvt.StyleUtils.getStyle(this._styleMap, dvt.ControlPanel.BG_ALPHA, 1);

  dd.setSolidStroke(borderColor, borderAlpha);
  if (bgColor)
    dd.setSolidFill(bgColor, bgAlpha);

  return dd;
};


/**
 * Handle a mouse down
 *
 * @param event MouseEvent
 */
dvt.ComboBox.prototype.HandleButtonDown = function(event) {
  // logEvent(event, "DvtCombo");
  dvt.EventManager.consumeEvent();
};


/**
 * @protected
 * Handle a mouse click on an item in the dropdown.
 * @param {dvt.MouseEvent} event MouseEvent
 */
dvt.ComboBox.prototype.HandleDropdownItemClick = function(event) {
  this._dropdownItemClickEvent = true;

  //stop the dropdown auto-hide timer
  this._hideDropdownTimer.stop();

  //don't want click to fall through to other components
  dvt.EventManager.consumeEvent(event);

  //update after the event so that animation is smooth
  // event.updateAfterEvent();

  //hide the dropdown and set the new selected item index
  //get the root sprite of the item
  var eventTarget = dvt.ComboBox.getRootDropdownItemSprite(event.target);

  var index;
  //get the index of the item
  if (this._dropdown && eventTarget) {
    var content = this._dropdown.getChildAt(0);
    if (content) {
      index = content.getChildIndex(eventTarget);
    }
  }
  this.HideDropdown();
  this.setSelectedIndex(index);
};


/**
 * Get the root DropdownItemSprite of the given object in the dropdown.
 *
 * @param displayObject display object in an item in the dropdown
 *
 * @return root DropdownItemSprite parent for the object
 */
dvt.ComboBox.getRootDropdownItemSprite = function(displayObject) {
  var n;
  var id;
  while (displayObject) {
    id = displayObject.getId();
    if (id && displayObject instanceof dvt.Container && id.substr(0, 4) == '__it') {
      n = displayObject;
      break;
    }
    displayObject = displayObject.getParent();
  }

  return n;
};


/**
 * Hide the dropdown and enable the main button again.
 */
dvt.ComboBox.prototype.HideDropdown = function() {

  if (this._dropdown) {
    this._dropdown.setVisible(false);
    this._button.setToggled(false);
    this.FireListener(new dvt.ComboBoxEvent(dvt.ComboBoxEvent.SUBTYPE_HIDE_DROPDOWN));
    //BUG FIX #10142865: don't remove the dropdown yet, because we want
    //the item the mouse was over to register a mouse rollout event
    //first so that when we next show the dropdown, which will contain
    //the same item, the item won't appear to be highlighted at first;
    //instead, just set the flag to remove the dropdown later
    //this._dropdown.getParent().removeChild(this._dropdown);
    //this._dropdown = null;
    this._bRemoveDropdown = true;
  }

  //remove the mouse focus change listener from the stage now
  //that the dropdown is no longer visible
  //bug 9885226: ACC:keyBoard togggle for show/hide controlPanel is borken
  var stage = this.getCtx().getStage();
  if (stage) {
    if (this._isTouchDevice) {
      stage.removeEvtListener(dvt.TouchEvent.TOUCHSTART, this.HandleStageMouseFocusChange, true, this);
    } else {
      stage.removeEvtListener(dvt.MouseEvent.MOUSEUP, this.HandleStageMouseFocusChange, true, this);
    }
  }
  //enable expand button again
  this._button.setMouseEnabled(true);
};


/**
 * Remove the dropdown from the display list.
 */
dvt.ComboBox.prototype.RemoveDropdown = function() {
  //BUG FIX #10142865: remove the dropdown from the display list after
  //the item in it has had time to register a mouse rollout event
  //so that it doesn't appear to be highlighted the next time the
  //dropdown is displayed
  //turn off the flag because we're removing the dropdown now
  this._bRemoveDropdown = false;
  if (this._dropdown) {
    this._dropdown.setVisible(false);
    this._dropdown.getParent().removeChild(this._dropdown);
    this._dropdown = null;
  }
};


/**
 * Get the maximum size of the items.
 *
 * @return maximum size of the items
 */
dvt.ComboBox.prototype._getMaxItemDim = function() {
  return this._maxItemDim;
};


/**
 * @override
 */
dvt.ComboBox.prototype.getDimensions = function() {
  if (this._button != null) {
    return this._button.getDimensions();
  }
  return new dvt.Rectangle(0, 0, 0, 0);
};

/**
 * Get dropdown button
 * @return {dvt.Button}
 */
dvt.ComboBox.prototype.getButton = function() {
  return this._button;
};

/**
 * Get dropdown items
 * @return {array} array of DvtContainers
 */
dvt.ComboBox.prototype.getItems = function() {
  return this._items;
};


/**
 * Update the content area of the collapsed combo box to
 * show the selected item.
 */
dvt.ComboBox.prototype.UpdateContentArea = function() {
  //flag indicating if the content should re-use the item itself
  var bUseItem = true;

  //if the states for the main button are specified by the item,
  //then use them
  var selIndex = this.getSelectedIndex();
  if (this._itemButtonStates && this._itemButtonStates.length > selIndex) {

    var buttonStates = this._itemButtonStates[selIndex];
    if (buttonStates && buttonStates.length > 2) {
      this._button.setUpState(buttonStates[dvt.Button.STATE_ENABLED]);
      this._button.setOverState(buttonStates[dvt.Button.STATE_OVER]);
      this._button.setDownState(buttonStates[dvt.Button.STATE_DOWN]);

      //toggle the flag because the button states are specified
      bUseItem = false;
    }
  }

  //if using the item itself in the button, update the content with it
  if (bUseItem) {
    //remove old content
    if (this._contentArea.getNumChildren() > 0) {
      this._contentArea.removeChildAt(0);
    }
    //add currently selected item
    this._contentArea.addChild(this.getSelectedItem());
  }
};


/**
 * Draw the arrow in the collapsed combo box button.
 *
 * @param s Sprite in which to draw arrow
 */
dvt.ComboBox.DrawArrow = function(context, ww, hh) {
  var padding = 4;

  var aPoints = [];
  aPoints.push(ww - 12, hh / 2 - padding / 2);
  aPoints.push(ww - 4, hh / 2 - padding / 2);
  aPoints.push(ww - 8, hh / 2 + padding / 2);
  aPoints.push(ww - 12, hh / 2 - padding / 2);

  var shape = new dvt.Polygon(context, aPoints, null);
  shape.setSolidStroke(dvt.ButtonLAFUtils.BORDER_COLOR);
  shape.setSolidFill(dvt.ButtonLAFUtils.BORDER_COLOR);
  shape.setMouseEnabled(false);

  return shape;
};


/**
 * Hide the dropdown and enable the main button again.
 */
dvt.ComboBox.prototype.closeDropdown = function() {
  this.HideDropdown();
};

dvt.ComboBox.prototype.setEventManager = function(eventManager) {
  this._eventManager = eventManager;
};



/**
 * @constructor
 * DropdownItemSprite Class to use as item in dropdown.
 */
var DropdownItemSprite = function(context, x, y, w, h, id) {
  this.Init(context, x, y, w, h, id);
};

/*
 * make DropdownItemSprite a subclass of dvt.Rect
 */
dvt.Obj.createSubclass(DropdownItemSprite, dvt.Rect);

DropdownItemSprite.prototype.Init = function(context, x, y, w, h, id) {
  dvt.Rect.superclass.Init.call(this, context);
};


/**
 * @constructor
 *
 * @param {string} subtype The type of dvt.ComboBoxEvent
 * @param {number} index The selected index, if this is a SUBTYPE_ITEM_CHANGE event
 */
dvt.ComboBoxEvent = function(subtype, index) {
  this.Init(subtype, index);
};


/**
 * The type of this event
 *
 * @const
 */
dvt.ComboBoxEvent.TYPE = 'comboBoxEvent';


/**
 * This event subtype is fired when the combo box selection changes
 *
 * @const
 */
dvt.ComboBoxEvent.SUBTYPE_ITEM_CHANGE = 'cbItemChange';


/**
 * This event subtype is fired when the dropdown is shown
 *
 * @const
 */
dvt.ComboBoxEvent.SUBTYPE_SHOW_DROPDOWN = 'cbShowDropdown';


/**
 * This event subtype is fired when the dropdown is hidden
 *
 * @const
 */
dvt.ComboBoxEvent.SUBTYPE_HIDE_DROPDOWN = 'cbHideDropdown';

dvt.Obj.createSubclass(dvt.ComboBoxEvent, dvt.Obj);


/**
 * Initialization method called by the constructor.
 *
 * @param {string} subtype The subtype of dvt.ComboBoxEvent
 * @param {number} index The selected index, if this is a SUBTYPE_ITEM_CHANGE event
 * @protected
 */
dvt.ComboBoxEvent.prototype.Init = function(subtype, index) {
  this.type = dvt.ComboBoxEvent.TYPE;

  if (index === undefined) {
    index = -1;
  }
  this.subtype = subtype;
  this._index = index;
};


/**
 * Get the index of the selected item.
 * @return {number} index of the selected item
 */
dvt.ComboBoxEvent.prototype.getIndex = function() {
  return this._index;
};
/**
 * @constructor
 * PanControl for use with Diagram.
 */
var DvtPanControl = function(context, panButton, recenterButton, panZoomCanvas, control, styleMap) {
  this.Init(context, panButton, recenterButton, panZoomCanvas, control, styleMap);
};

DvtPanControl.PAN_TIMER_INTERVAL = 50; //in ms
DvtPanControl.PAN_TIMER_ACCELERATE_COUNT = 2 * //seconds
    (1000 / DvtPanControl.PAN_TIMER_INTERVAL);//iterations per second

dvt.Obj.createSubclass(DvtPanControl, dvt.Container);

/*--------------------------------------------------------------------*/
/*  Init()                                                            */
/*--------------------------------------------------------------------*/
/**
 * Helper method called by the constructor to initialize this object.
 * @param {dvt.Context} context An object maintaining application specific context, as well as well as providing
 *                             access to platform specific data and objects, such as the factory
 * @param {dvt.Button} panButton Pan button used by the control
 * @param {dvt.Button} recenterButton Recenter button used by the control
 * @param {dvt.PanZoomCanvas} panZoomCanvas The PanZoomCanvas this control will be associated with
 * @param {Number} control Hex value indicates the Controls displayed
 * @param {Map} styleMap Style map
 */
DvtPanControl.prototype.Init = function(context, panButton, recenterButton, panZoomCanvas, control, styleMap) {
  DvtPanControl.superclass.Init.call(this, context);

  this._panTimer = new dvt.Timer(context, DvtPanControl.PAN_TIMER_INTERVAL,
      this.HandlePanTimer, this);
  this._tooltipManager = context.getTooltipManager();
  this._bPanMouseDown = false;
  this._panZoomCanvas = panZoomCanvas;
  this._panCenter = new dvt.Point(20, 20);

  if (control) {
    this._controls = control;
  }
  else {
    this._controls = dvt.ControlPanel.CONTROLS_ALL;
  }

  panButton.addChild(recenterButton);
  if (recenterButton) {
    this._panCenterSprite = recenterButton;
    this._panCenterSprite.setVisible(false);
    this._panCenterSprite.addEvtListener(dvt.TouchEvent.TOUCHSTART, this.HandlePanCenterClick, false, this);
    if (!dvt.Agent.isTouchDevice()) {
      this._panCenterSprite.addEvtListener(dvt.MouseEvent.CLICK, this.HandlePanCenterClick, false, this);
      this._panCenterSprite.addEvtListener(dvt.MouseEvent.MOUSEDOWN, this.HandlePanCenterDown, false, this);
      this._panCenterSprite.addEvtListener(dvt.MouseEvent.MOUSEUP, this.HandlePanCenterUp, false, this);
      this._panCenterSprite.addEvtListener(dvt.MouseEvent.MOUSEOVER, this.HandlePanCenterRollOver, false, this);
      this._panCenterSprite.addEvtListener(dvt.MouseEvent.MOUSEOUT, this.HandlePanCenterRollOut, false, this);
    }

    // - pan control rotates when hovering over the re-center button
    this._panCenterSprite.addEvtListener(dvt.MouseEvent.MOUSEMOVE, this.HandlePanCenterMouseMove, false, this);
  }

  this._panButton = panButton;
  this._panButton.addEvtListener(dvt.TouchEvent.TOUCHSTART, this.HandlePanClick, false, this);
  if (!dvt.Agent.isTouchDevice()) {
    this._panButton.addEvtListener(dvt.MouseEvent.CLICK, this.HandlePanClick, false, this);
    this._panButton.addEvtListener(dvt.MouseEvent.MOUSEDOWN, this.HandlePanMouseDown, false, this);
    this._panButton.addEvtListener(dvt.MouseEvent.MOUSEUP, this.HandlePanMouseUp, false, this);
    this._panButton.addEvtListener(dvt.MouseEvent.MOUSEOVER, this.HandlePanRollOver, false, this);
    this._panButton.addEvtListener(dvt.MouseEvent.MOUSEOUT, this.HandlePanRollOut, false, this);
    this._panButton.addEvtListener(dvt.MouseEvent.MOUSEMOVE, this.HandlePanMouseMove, false, this);
  }

  this._panControl = dvt.ButtonLAFUtils.createPanButtonBackground(context, styleMap);
  this._panControl.addChild(this._panButton);
  this.addChild(this._panControl);
};


/**
 * Handle a click on the pan control.
 *
 * @param event MouseEvent
 */
DvtPanControl.prototype.HandlePanClick = function(event) {
  //don't want click to fall through to other components
  dvt.EventManager.consumeEvent(event);
};


/**
 * Handle a mouse down on the pan control.
 *
 * @param event MouseEvent
 */
DvtPanControl.prototype.HandlePanMouseDown = function(event) {

  //don't want click to fall through to other components
  dvt.EventManager.consumeEvent(event);

  this._bPanMouseDown = true;
  //  this._panButton._mouseDownHandler(event);

  //hide the pan center button
  if (this._panCenterSprite)
    this._panCenterSprite.setVisible(false);

  //hide the static compass arrows and show the dynamic directional arrow
  //this._panCompassArrows.visible = false;
  //this._panDirectionalArrow.visible = true;
  //rotate the directional arrow to point towards the mouse
  var stagePoint = this._panZoomCanvas.GetRelativeMousePosition(event);
  var localPoint = this._panButton.stageToLocal(stagePoint);
  this._rotatePanControlDirectionalArrow(localPoint.x, localPoint.y, this._panButton.downState);

  //save the mouse point
  this._panMousePoint = new dvt.Point(localPoint.x, localPoint.y);

  //start the pan timer for continuous panning while the mouse button
  //is held down
  this._panTimer.start();
  this._panTimerCount = 0;
};


/**
 * Handle a mouse up on the pan control.
 *
 * @param event MouseEvent
 */
DvtPanControl.prototype.HandlePanMouseUp = function(event) {

  if (this._bPanMouseDown) {
    //don't want click to fall through to other components
    dvt.EventManager.consumeEvent(event);
    this._bPanMouseDown = false;

    //show the pan center button
    if (this._panCenterSprite) {
      this._panCenterSprite.setVisible(true);
    }

    //show the static compass arrows and hide the dynamic directional arrow
    //this._panCompassArrows.visible = true;
    //this._panDirectionalArrow.visible = false;
    //stop the pan timer and reset it for use next time
    this._panTimer.stop();
    //     this._panTimer.reset();

  }

  this._panButton._mouseOutHandler(event);

  this._tooltipManager.hideTooltip();
};


/**
 * Handle a mouse roll over on the pan control.
 *
 * @param event MouseEvent
 */
DvtPanControl.prototype.HandlePanRollOver = function(event) {
  //show the pan center button
  if (this._panCenterSprite) {
    this._panCenterSprite.setVisible(true);
  }
  this._tooltipManager.showTooltip(event.pageX, event.pageY, dvt.Bundle.getTranslatedString(dvt.Bundle.SUBCOMPONENT_PREFIX, 'CONTROL_PANEL_PAN'), event.target);
};


/**
 * Handle a mouse roll out on the pan control.
 *
 * @param event MouseEvent
 */
DvtPanControl.prototype.HandlePanRollOut = function(event) {
  this.HandlePanMouseUp(event);

  //hide the pan center button
  if (this._panCenterSprite) {
    this._panCenterSprite.setVisible(false);
  }
};


/**
 * Handle a mouse move on the pan control.
 *
 * @param event MouseEvent
 */
DvtPanControl.prototype.HandlePanMouseMove = function(event) {

  //don't want click to fall through to other components
  dvt.EventManager.consumeEvent(event);

  var stagePoint = this._panZoomCanvas.GetRelativeMousePosition(event);
  var localPoint = this._panButton.stageToLocal(stagePoint);
  if (this._bPanMouseDown) {
    //rotate the directional arrow to point towards the mouse
    this._rotatePanControlDirectionalArrow(localPoint.x, localPoint.y, this._panButton.downState);

    //save the mouse point
    this._panMousePoint = new dvt.Point(localPoint.x, localPoint.y);

  //     event.updateAfterEvent();
  }
  //BUG FIX #7352517: rotate the arrows shown when the mouse is over
  //the pan control
  else {
    //rotate the directional arrow to point towards the mouse
    this._rotatePanControlDirectionalArrow(localPoint.x, localPoint.y, this._panButton.overState);
  }
};


/**
 * Handle a pan timer event to pan the view.
 */
DvtPanControl.prototype.HandlePanTimer = function() {

  if (this._bPanMouseDown) {
    //TODO: ???
    //     event.updateAfterEvent();

    //get the difference between the mouse position and the center of the pan control
    var diffY = this._panCenter.y - this._panMousePoint.y;
    var diffX = this._panCenter.x - this._panMousePoint.x;

    //calculate the slope and angle of the mouse from the center of the pan control
    //var slope = diffY / diffX;
    var angleRads = Math.atan2(diffY, diffX);

    //normalize dx and dy increments
    var deltaX = Math.cos(angleRads);
    var deltaY = Math.sin(angleRads);

    //multiply the normalized increment by this factor to determine
    //the pan distance
    var factor = 15;
    this._panTimerCount++;
    if (this._panTimerCount > DvtPanControl.PAN_TIMER_ACCELERATE_COUNT)
      factor *= 3;
    this._panZoomCanvas.panBy(factor * deltaX, factor * deltaY);
  }
};


/**
 * Handle a mouse click on the center of the pan control.
 *
 * @param event MouseEvent
 */
DvtPanControl.prototype.HandlePanCenterClick = function(event) {

  //don't want click to fall through to other components
  dvt.EventManager.consumeEvent(event);
  this._panZoomCanvas.zoomAndCenter();
};


/**
 * Handle a mouse down on the center of the pan control.
 *
 * @param event MouseEvent
 */
DvtPanControl.prototype.HandlePanCenterDown = function(event) {

  //don't want down to fall through to other components
  dvt.EventManager.consumeEvent(event);

  //  this._panCenterSprite._mouseDownHandler(event);
};


/**
 * Handle a mouse up on the center of the pan control.
 *
 * @param event MouseEvent
 */
DvtPanControl.prototype.HandlePanCenterUp = function(event) {

  //don't want up to fall through to other components
  dvt.EventManager.consumeEvent(event);
  this._tooltipManager.hideTooltip();
};


/**
 * Handle a mouse roll over on the center of the pan control.
 *
 * @param event MouseEvent
 */
DvtPanControl.prototype.HandlePanCenterRollOver = function(event) {
  this._tooltipManager.showTooltip(event.pageX, event.pageY, dvt.Bundle.getTranslatedString(dvt.Bundle.SUBCOMPONENT_PREFIX, 'CONTROL_PANEL_ZOOMANDCENTER'), event.target);

  // - Wrong tooltip for pan control center button
  // - pan control rotates when hovering over the re-center button
  this._panCenterSprite.setVisible(true);
  dvt.EventManager.consumeEvent(event);
};


/**
 * Handle a mouse roll out on the center of the pan control.
 *
 * @param event MouseEvent
 */
DvtPanControl.prototype.HandlePanCenterRollOut = function(event) {
  this._tooltipManager.hideTooltip();

  // - Wrong tooltip for pan control center button
  // - pan control rotates when hovering over the re-center button
  dvt.EventManager.consumeEvent(event);
};


/**
 * Handle a mouse move on the center of the pan control.
 *
 * @param event MouseEvent
 */
DvtPanControl.prototype.HandlePanCenterMouseMove = function(event) {
  // - pan control rotates when hovering over the re-center button
  dvt.EventManager.consumeEvent(event);
};


/**
 * Rotate the pan control directional arrow to point towards the mouse.
 *
 * @param localX local mouse X coord
 * @param localY local mouse Y coord
 * @param displayObj DisplayObject to rotate
 */
DvtPanControl.prototype._rotatePanControlDirectionalArrow = function(localX, localY, displayObj) {
  var xOffset = localX - this._panCenter.x;
  var yOffset = localY - this._panCenter.y;

  // var angleDeg = Math.atan2(yOffset, xOffset) * RAD_TO_DEG;
  var angleRad = Math.atan2(yOffset, xOffset);

  //adjust the angle by 45 degrees because the image has the arrow pointing
  //down to the right at an angle of 45 degrees
  // displayObj.rotation = angleDeg - 45;
  displayObj.setRotation(angleRad - Math.PI / 4);
};
/**
 * @constructor
 */
var DvtControlPanelEvent = function(subtype) {
  this.Init(DvtControlPanelEvent.TYPE);
  this._subtype = subtype;
};

dvt.Obj.createSubclass(DvtControlPanelEvent, dvt.BaseComponentEvent);

DvtControlPanelEvent.TYPE = 'dvtPZCPExpand';
DvtControlPanelEvent.SUBTYPE_SHOW = 'show';
DvtControlPanelEvent.SUBTYPE_HIDE = 'hide';

DvtControlPanelEvent.prototype.getSubType = function() {
  return this._subtype;
};
/**
 * A control panel used by dvt.PanZoomCanvas for pan and zoom controls.
 * @param {dvt.Context} context The rendering context
 * @param {dvt.PanZoomComponent} view The component that this control panel belongs to
 * @param {number} state Whether the initial state is collapsed or expanded
 * @constructor
 */
dvt.ControlPanel = function(context, view, state) {
  this.Init(context, view, state);
};

dvt.Obj.createSubclass(dvt.ControlPanel, dvt.Container);

/** @const **/
dvt.ControlPanel.STATE_COLLAPSED = 1;
/** @const **/
dvt.ControlPanel.STATE_EXPANDED = 2;
/** @const **/
dvt.ControlPanel.CONTROLS_ALL = 0xffffff;
/** @const **/
dvt.ControlPanel.CONTROLS_ZOOM_SLIDER = 0x000001;
/** @const **/
dvt.ControlPanel.CONTROLS_CENTER_BUTTON = 0x000010;
/** @const **/
dvt.ControlPanel.CONTROLS_ZOOM_TO_FIT_BUTTON = 0x000100;
/** @const **/
dvt.ControlPanel.CONTROLS_ZOOM = 0x001001; // include CONTROLS_ZOOM_SLIDER
/** @const **/
dvt.ControlPanel.DEFAULT_ZOOM_LEVELS = [0, .25, .5, .75, 1];
/** @const **/
dvt.ControlPanel.CONTROL_PANEL_BEHAVIOR_KEY = 'controlPanelBehavior';


//DvtPanZoomControl style names, used in style map
/**
 * Attribute for background opacity
 * @const
 */
dvt.ControlPanel.BG_ALPHA = 'backgroundAlpha';


/**
 * Attribute for background opacity on hover
 * @const
 */
dvt.ControlPanel.BG_ROLLOVER_ALPHA = 'backgroundHoverAlpha';


/**
 * Attribute for background opacity on drag
 * @const
 */
dvt.ControlPanel.BG_DRAG_ALPHA = 'backgroundDragAlpha';


/**
 * Attribute for border opacity
 * @const
 */
dvt.ControlPanel.FRAME_ROLLOUT_ALPHA = 'borderAlpha';


/**
 * Attribute for border opacity on hover
 * @const
 */
dvt.ControlPanel.FRAME_ROLLOVER_ALPHA = 'borderHoverAlpha';


/**
 * Attribute for border opacity on drag
 * @const
 */
dvt.ControlPanel.FRAME_DRAG_ALPHA = 'borderDragAlpha';


/**
 * Attribute for button width style
 * @const
 */
dvt.ControlPanel.CP_BUTTON_WIDTH = 'buttonWidth';


/**
 * Attribute for button height style
 * @const
 */
dvt.ControlPanel.CP_BUTTON_HEIGHT = 'buttonHeight';


/**
 * Attribute for open/close button width style
 * @const
 */
dvt.ControlPanel.CP_OPEN_CLOSE_BUTTON_WIDTH = 'openCloseButtonWidth';


/**
 * Attribute for tab size style
 * @const
 */
dvt.ControlPanel.CP_TAB_SIZE = 'tabSize';


/**
 * Attribute for top padding style
 * @const
 */
dvt.ControlPanel.CP_PADDING_TOP = 'paddingTop';


/**
 * Attribute for side padding style
 * @const
 */
dvt.ControlPanel.CP_PADDING_SIDE = 'paddingSide';


/**
 * Attribute for bottom padding style
 * @const
 */
dvt.ControlPanel.CP_PADDING_BOTTOM = 'paddingBottom';


/**
 * Attribute for left padding style
 * @const
 */
dvt.ControlPanel.CP_PADDING_LEFT = 'paddingLeft';


/**
 * Attribute for right padding style
 * @const
 */
dvt.ControlPanel.CP_PADDING_RIGHT = 'paddingRight';


/**
 * Attribute for inner padding style (padding used between elements)
 * @const
 */
dvt.ControlPanel.CP_PADDING_INNER = 'paddingInner';


/**
 * Attribute for querying panel drawer styles
 * @const
 */
dvt.ControlPanel.CP_PANEL_DRAWER_STYLES = 'panelDrawerStyles';


/**
 * Attribute for image width style
 * @const
 */
dvt.ControlPanel.CP_IMAGE_WIDTH = 'imageWidth';


/**
 * Attribute for image height style
 * @const
 */
dvt.ControlPanel.CP_IMAGE_HEIGHT = 'imageHeight';


/**
 * Attribute for querying center button (pan button) existence
 * @const
 */
dvt.ControlPanel.CP_CENTER_BUTTON_DISPLAYED = 'centerButtonDisplayed';


/**
 * Helper method called by the constructor to initialize this object.
 * @param {dvt.Context} context The rendering context
 * @param {dvt.PanZoomComponent} view The component that this control panel belongs to
 * @param {number} state Whether the initial state is collapsed or expanded
 * @protected
 */
dvt.ControlPanel.prototype.Init = function(context, view, state) {
  dvt.ControlPanel.superclass.Init.call(this, context);

  this._bMouseDragPanning = false;
  this._bMouseOver = false;

  this._panZoomCanvas = view.getPanZoomCanvas();
  this._controls = view.getDisplayedControls();
  this._buttonImages = view.getResourcesMap();

  this._tooltipManager = context.getTooltipManager();


  this._styleMap = null;
  this._view = view;
  if (this._view) {
    // retrieve the control panel style map including skinning defaults from the parent component
    this._styleMap = this._view.getSubcomponentStyles();
    if (!this._styleMap[dvt.ControlPanel.CP_CENTER_BUTTON_DISPLAYED]) {
      // disable the pan control if necessary and update the parent displayed controls value
      this._controls = this._controls & ~dvt.ControlPanel.CONTROLS_CENTER_BUTTON;
      this._view.setDisplayedControls(this._controls);
    }
  }

  this._zoomLevels = dvt.ControlPanel.DEFAULT_ZOOM_LEVELS;
  this._bTransition = false;

  this._bgAlpha = this._styleMap[dvt.ControlPanel.BG_ALPHA];

  this._eventManager = new DvtControlPanelEventManager(context, null, view);
  this._eventManager.addRolloverType(dvt.ControlPanel);
  this._eventManager.addListeners(this);
  this._eventManager.associate(this, this);

  this._state = state;

  //TOOD: disable tabbing for control panel tools
  this.tabChildren = false;
  this.setPixelHinting(true);
};

/**
 * Get the state of this control panel.
 * @return {number} returns STATE_EXPANDED or STATE_COLLAPSED
 */
dvt.ControlPanel.prototype.getState = function() {
  return this._state;
};


/**
 * Set the discrete zoom levels that appear in the zoom slider.
 * @param {Array} zoomLevels array of discrete zoom levels to show in the zoom slider
 */
dvt.ControlPanel.prototype.setZoomLevels = function(zoomLevels) {
  if (! zoomLevels) {
    zoomLevels = dvt.ControlPanel.DEFAULT_ZOOM_LEVELS;
  }
  this._zoomLevels = zoomLevels;
};


/**
 * Get the discrete zoom levels that appear in the zoom slider.
 * @return {Array} array of discrete zoom levels to show in the zoom slider
 */
dvt.ControlPanel.prototype.getZoomLevels = function() {
  return this._zoomLevels;
};

/**
 * Notify the control panel that mouse drag panning has started.
 */
dvt.ControlPanel.prototype.mouseDragPanningStarted = function() {
  this._bMouseDragPanning = true;
  //disable interaction
  this._background.setMouseEnabled(false);
  this._frame.setMouseEnabled(false);

  //change alphas of background and frame
  this._background.setAlpha(this._styleMap[dvt.ControlPanel.BG_DRAG_ALPHA]);
  this._frame.setAlpha(this._styleMap[dvt.ControlPanel.FRAME_DRAG_ALPHA]);
};


/**
 * Notify the control panel that mouse drag panning has ended.
 */
dvt.ControlPanel.prototype.mouseDragPanningEnded = function() {
  this._bMouseDragPanning = false;
  //enable interaction
  this._background.setMouseEnabled(true);
  this._frame.setMouseEnabled(true);

  //change alphas based on whether the mouse is currently over
  //the control panel
  var bMouseOver = this._bMouseOver;//TODO???hitTestPoint(stage.mouseX, stage.mouseY, true);
  if (bMouseOver) {
    this.HandleRollOver(null);
  }
  else {
    this.HandleRollOut(null);
  }
};


/**
 * Rotate a given DisplayObject to pseudo-flip it horizontally for BiDi.
 * Vertically the DisplayObject must be the exact image of itself because it will
 * end up upside down.
 *
 * @param {dvt.Container} dispObj DisplayObject to rotate
 */
dvt.ControlPanel.prototype.rotateControlPanelDisplayObject = function(dispObj) {
  dispObj.setRotation(Math.PI);

  var dim = dvt.ButtonLAFUtils._getDimForced(this._context, dispObj);
  dispObj.setTranslate(dispObj.getTranslateX() + dim.w, dispObj.getTranslateY() + dim.h);
};


//BUG FIX #10154856: show single row of controls in TMap
/**
 * Determine whether the horizontal arm of the control panel shows a single row or
 * two rows.
 * The default is false, meaning that the control panel shows two rows.
 *
 * @return {boolean} true if the horizontal arm of the control panel shows a single row
 */
dvt.ControlPanel.prototype.isSingleHorzRow = function() {
  return true;
};


//BUG FIX #10154856: show single row of controls in TMap
/**
 * Get the height of the horizontal bar of the control panel.
 *
 * @return {number} height of the horizontal bar of the control panel
 */
dvt.ControlPanel.prototype.getViewPanelHeight = function() {
  var h = 0;
  if (this.isSingleHorzRow())
    h = dvt.ControlPanelLAFUtils.getViewPanelHalfHeight();
  else
    h = dvt.ControlPanelLAFUtils.getViewPanelHeight();
  var defaultHeight = dvt.StyleUtils.getStyle(this._styleMap, dvt.ControlPanel.CP_TAB_SIZE, 0);
  return Math.max(defaultHeight, h);
};


/**
 * Get the width of the vertical bar of the control panel.
 *
 * @return {number} the width of the vertical bar of the control panel
 */
dvt.ControlPanel.prototype.getViewPanelWidth = function() {
  return dvt.StyleUtils.getStyle(this._styleMap, dvt.ControlPanel.CP_TAB_SIZE, 0);
};


/**
 * Render the collapsed state of the panel.
 * @return {dvt.Container} container representing collapsed state
 * @protected
 */
dvt.ControlPanel.prototype.RenderCollapsed = function() {
  var context = this.getCtx();

  var contentBar = new dvt.Container(context);
  var hh = this.getViewPanelHeight();

  var bR2L = dvt.Agent.isRightToLeft(context);
  this._background = dvt.ControlPanelLAFUtils.createEmptyViewClosedShape(context, hh, this._styleMap, bR2L);
  this._frame = dvt.ControlPanelLAFUtils.createEmptyViewClosedFrame(context, hh, this._styleMap, bR2L);

  //Note: get dimensions before adding expand button
  this._collapsedDim = dvt.ButtonLAFUtils._getDimForced(context, this._frame);

  //create the control panel expand button
  this._expandButton = dvt.ButtonLAFUtils.createExpandButton(this.getCtx(), this._buttonImages, this.getViewPanelHeight(), this._styleMap,
      bR2L ? dvt.ButtonLAFUtils.DIR_RIGHT : dvt.ButtonLAFUtils.DIR_LEFT);
  this._expandButton.setCallback(this.HandleExpandClick, this);
  this._expandButton.setTooltip(dvt.Bundle.getTranslatedString(dvt.Bundle.SUBCOMPONENT_PREFIX, 'CONTROL_PANEL'));
  this._eventManager.associate(this._expandButton, this._expandButton);

  this._frame.addChild(this._expandButton);

  contentBar.addChild(this._background);
  contentBar.addChild(this._frame);

  return contentBar;
};


/**
 * Creates and adds zoom to fit button to the vertical bar of the control panel
 * @param {dvt.Container} vertContentBar display object representing the vertical bar
 * @param {number} currY current Y coordinate
 * @return {number} updated current Y coordinate
 * @private
 */
dvt.ControlPanel.prototype._addZoomToFitButton = function(vertContentBar, currY) {

  //create the zoom to fit button
  if ((this._controls & dvt.ControlPanel.CONTROLS_ZOOM_TO_FIT_BUTTON) != 0) {
    var paddingInner = dvt.StyleUtils.getStyle(this._styleMap['vbar'], dvt.ControlPanel.CP_PADDING_INNER, 0);
    var paddingSide = dvt.StyleUtils.getStyle(this._styleMap['vbar'], dvt.ControlPanel.CP_PADDING_LEFT, 0);
    this._zoomToFitButton = dvt.ButtonLAFUtils.createZoomToFitButton(this.getCtx(), this._buttonImages, this._styleMap);
    this._zoomToFitButton.setTranslate(paddingSide, this._zoomToFitButton.getTranslateY() + currY);
    this._zoomToFitButton.setCallback(this.HandleZoomToFitClick, this);
    this._zoomToFitButton.setTooltip(dvt.Bundle.getTranslatedString(dvt.Bundle.SUBCOMPONENT_PREFIX, 'CONTROL_PANEL_ZOOMTOFIT'));
    this._eventManager.associate(this._zoomToFitButton, this._zoomToFitButton);

    var dim = dvt.ButtonLAFUtils._getDimForced(this.getCtx(), this._zoomToFitButton);
    vertContentBar.addChild(this._zoomToFitButton);
    currY += dim.h;
    currY += paddingInner;
  }
  return currY;
};


/**
 * Creates and adds zoom controls (zoom in, zoom out, zoom slider) to the vertical bar of the control panel
 * @param {dvt.Container} vertContentBar display object representing the vertical bar
 * @param {number} currY current Y coordinate
 * @return {number} updated current Y coordinate
 * @private
 */
dvt.ControlPanel.prototype._addZoomControls = function(vertContentBar, currY) {

  var paddingInner = dvt.StyleUtils.getStyle(this._styleMap['vbar'], dvt.ControlPanel.CP_PADDING_INNER, 0);
  var paddingSide = dvt.StyleUtils.getStyle(this._styleMap['vbar'], dvt.ControlPanel.CP_PADDING_LEFT, 0);
  if ((this._controls & dvt.ControlPanel.CONTROLS_ZOOM) != 0) {

    //create the zoom in button
    this._zoomInButton = dvt.ButtonLAFUtils.createZoomInButton(this.getCtx(), this._buttonImages, this._styleMap);
    this._zoomInButton.setTranslate(paddingSide, this._zoomInButton.getTranslateY() + currY);
    this._zoomInButton.setCallback(this.HandleZoomInClick, this);
    this._zoomInButton.setTooltip(dvt.Bundle.getTranslatedString(dvt.Bundle.SUBCOMPONENT_PREFIX, 'CONTROL_PANEL_ZOOMIN'));
    this._eventManager.associate(this._zoomInButton, this._zoomInButton);

    var dim = dvt.ButtonLAFUtils._getDimForced(this.getCtx(), this._zoomInButton);
    vertContentBar.addChild(this._zoomInButton);
    currY += (dim.h + paddingInner);

    //create the zoom out button
    this._zoomOutButton = dvt.ButtonLAFUtils.createZoomOutButton(this.getCtx(), this._buttonImages, this._styleMap);
    this._zoomOutButton.setTranslate(paddingSide, this._zoomOutButton.getTranslateY() + currY);
    this._zoomOutButton.setCallback(this.HandleZoomOutClick, this);
    this._zoomOutButton.setTooltip(dvt.Bundle.getTranslatedString(dvt.Bundle.SUBCOMPONENT_PREFIX, 'CONTROL_PANEL_ZOOMOUT'));
    this._eventManager.associate(this._zoomOutButton, this._zoomOutButton);

    dim = dvt.ButtonLAFUtils._getDimForced(this.getCtx(), this._zoomOutButton);
    vertContentBar.addChild(this._zoomOutButton);
    currY += dim.h;
    this.enableZoomControls();
  }
  return currY;
};


/**
 * Creates vertical bar background and border
 * @param {dvt.Container} horzContentBar display object representing the horizontal bar
 * @param {dvt.Container} vertContentBar display object representing the vertical bar
 * @param {number} nHorzContentBarChildren number of child objects on the horizontal bar
 * @param {number} currY current Y coordinate
 * @return {number} updated current Y coordinate
 * @private
 */
dvt.ControlPanel.prototype._createVBarBackground = function(horzContentBar, vertContentBar, nHorzContentBarChildren, currY) {

  var context = this.getCtx();
  if (vertContentBar) {

    // Bug 9686175 - controlPanel looks bad when featuresOff="pan zoom cardSync changeLayout"
    // if zoom-to-fit is the only button left on vertContentBar and there is no buttonss in
    // horzContentBar, make bottom right corner square (not round)

    //  - inconsistent control panel changes for different values of featuresoff
    // featuresOff = "pan zoom"
    var nVertContentBarChildren = vertContentBar.getNumChildren();
    var roundedCorner =
        (nVertContentBarChildren > 1 || this._zoomToFitButton == null || nHorzContentBarChildren > 1 ||
        (nHorzContentBarChildren > 0 && nVertContentBarChildren == 1));

    var openside = null; // alta style
    if (this._styleMap && this._styleMap[dvt.ControlPanel.CP_PANEL_DRAWER_STYLES]) {
      if (nHorzContentBarChildren > 0)
        openside = dvt.ControlPanelLAFUtils.OPEN_TOP;
      else
        openside = dvt.ControlPanelLAFUtils.OPEN_RIGHT;
    }

    var dim = dvt.ButtonLAFUtils._getDimForced(context, horzContentBar);

    currY += 4;
    var cpHeight = roundedCorner ? currY : Math.max(dim.h, currY);
    var paddingBottom = dvt.StyleUtils.getStyle(this._styleMap['vbar'], dvt.ControlPanel.CP_PADDING_BOTTOM, 0);
    cpHeight += paddingBottom;

    var zoomShape = dvt.ControlPanelLAFUtils.renderEmptyZoomShape(context, cpHeight, this._styleMap, openside, this.getViewPanelHeight());
    var zoomFrame = dvt.ControlPanelLAFUtils.renderEmptyZoomFrame(context, cpHeight, roundedCorner, this._styleMap, openside, this.getViewPanelHeight());

    zoomShape.setTranslate(vertContentBar.getTranslateX(), vertContentBar.getTranslateY());

    this._background.addChild(zoomShape);
    vertContentBar.addChildAt(zoomFrame, 0);
  }

  return currY;
};


/**
 * Positions elements on the vertical bar
 * @param {dvt.Container} horzContentBar display object representing the horizontal bar
 * @param {dvt.Container} vertContentBar display object representing the vertical bar
 * @param {number} currY current Y coordinate
 * @private
 */
dvt.ControlPanel.prototype._positionVBarElements = function(horzContentBar, vertContentBar, currY) {

  var context = this.getCtx();
  var bBiDi = dvt.Agent.isRightToLeft(context);

  var buttonWidth = dvt.StyleUtils.getStyle(this._styleMap, dvt.ControlPanel.CP_OPEN_CLOSE_BUTTON_WIDTH, 0);

  if (! this._additionalContent &&
      (this._controls & dvt.ControlPanel.CONTROLS_CENTER_BUTTON) == 0) {

    if (bBiDi) {
      horzContentBar.setTranslateX(0 - horzContentBar.getTranslateX());
      horzContentBar.setTranslateY(0);

      if (vertContentBar) {
        horzContentBar.setTranslateX(horzContentBar.getTranslateX() - buttonWidth);
        vertContentBar.setTranslateY(0);
      }
    }
    else {
      if (vertContentBar) {
        var cpWidth = this.getViewPanelWidth();
        vertContentBar.setTranslate(0, 0);
        horzContentBar.setTranslate(horzContentBar.getTranslateX() + cpWidth, 0);
      }
      else {
        horzContentBar.setTranslate(horzContentBar.getTranslateX(), 0);
      }
    }
  }
  else if (bBiDi && vertContentBar) {
    var dimHorizontal = dvt.ButtonLAFUtils._getDimForced(context, horzContentBar);
    var barWidth = this.getViewPanelWidth();
    horzContentBar.setTranslateX(0);
    vertContentBar.setTranslateX(dimHorizontal.w + dimHorizontal.x - barWidth);
  }
};


/**
 * Creates pan control and adds it to the horizontal bar of the control panel
 * @param {dvt.Container} horzContentBar display object representing the horizontal bar
 * @param {number} nHorzContentBarChildren number of child objects on the horizontal bar
 * @return {number} updated number of child objects on the horizontal bar
 * @private
 */
dvt.ControlPanel.prototype._createHBarPanControl = function(horzContentBar, nHorzContentBarChildren) {

  var context = this.getCtx();

  //BUG FIX #10154856: determine if the control panel is showing a single or
  //double row of controls
  var bSingleRow = this.isSingleHorzRow();

  // hide panControl if it is off
  if ((this._controls & dvt.ControlPanel.CONTROLS_CENTER_BUTTON) != 0) {
    this._panControl = dvt.ButtonLAFUtils.createPanControl(context, this._panZoomCanvas, this._controls, this._buttonImages, this._styleMap);

    //BUG FIX #10154856: create underlays to erase the view of the intersection
    //between the horz and vert arms of the control panel under the pan control,
    //and to show a solid background behind the pan control so that it blends
    //in with the rest of the control panel
    if (bSingleRow) {
      this._panControlUnderlay = dvt.ButtonLAFUtils.createPanButtonUnderlay(context, this._styleMap);
      this._panControlUnderlay2 = dvt.ButtonLAFUtils.createPanButtonUnderlay(context, this._styleMap);

      //need to add this one first, because it will be used to erase everything
      //underneath
      horzContentBar.addChild(this._panControlUnderlay2);
      //add this one second, because it will be visible behind the pan control
      horzContentBar.addChild(this._panControlUnderlay);

      //TODO: Note don't have BlendMode in html5
      //need to set container blendMode to LAYER so that we can use ERASE on
      //bottom-most underlay
      //       this.blendMode = BlendMode.LAYER;
      //       panControlUnderlay2.blendMode = BlendMode.ERASE;
    }

    horzContentBar.addChild(this._panControl);
    nHorzContentBarChildren++;
  }

  return nHorzContentBarChildren;
};


/**
 * Creates a container that holds additional content created by subclasses. Adds the container to the horizontal bar.
 * See PopulateHorzContentBar() method for details about additional content.
 * @param {dvt.Container} horzContentBar display object representing the horizontal bar
 * @param {number} nHorzContentBarChildren number of child objects on the horizontal bar
 * @return {number} updated number of child objects on the horizontal bar
 * @private
 */
dvt.ControlPanel.prototype._createHBarAdditionalContent = function(horzContentBar, nHorzContentBarChildren) {

  var context = this.getCtx();

  //allow subclasses to put their custom tools in the horzContentBar
  this._additionalContent = new dvt.Container(context);
  this.PopulateHorzContentBar(this._additionalContent);

  // dont render additionalContent if no children
  if (this._additionalContent.getNumChildren() > 0) {
    horzContentBar.addChild(this._additionalContent);
    nHorzContentBarChildren++;
  }
  else {
    this._additionalContent = null;
  }
  return nHorzContentBarChildren;

};


/**
 * Creates a collapse button for the horizontal bar
 * @param {dvt.Container} horzContentBar display object representing the horizontal bar
 * @private
 */
dvt.ControlPanel.prototype._createHBarCollapseButton = function(horzContentBar) {
  this._collapseButton = dvt.ButtonLAFUtils.createCollapseButton(this.getCtx(), this._buttonImages, this.getViewPanelHeight(), this._styleMap,
      dvt.Agent.isRightToLeft(this.getCtx()) ? dvt.ButtonLAFUtils.DIR_RIGHT : dvt.ButtonLAFUtils.DIR_LEFT);
  this._collapseButton.setCallback(this.HandleCollapseClick, this);
  this._collapseButton.setTooltip(dvt.Bundle.getTranslatedString(dvt.Bundle.SUBCOMPONENT_PREFIX, 'CONTROL_PANEL'));
  this._eventManager.associate(this._collapseButton, this._collapseButton);
  horzContentBar.addChild(this._collapseButton);
};


/**
 * Positions elements on the horizontal bar of the control panel
 * @param {boolean} bBiDi true if right-to-left, false otherwise
 * @param {number} currX current X coordinate
 * @return {number} updated current X coordinate
 * @private
 */
dvt.ControlPanel.prototype._positionHBarElements = function(bBiDi, currX) {
  var context = this._context;
  var dim = null;
  var collapseButtonWidth = dvt.StyleUtils.getStyle(this._styleMap, dvt.ControlPanel.CP_OPEN_CLOSE_BUTTON_WIDTH, 0);
  var buttonWidth = dvt.StyleUtils.getStyle(this._styleMap, dvt.ControlPanel.CP_BUTTON_WIDTH, 0);
  var panelWidth = this.getViewPanelWidth();
  var panelHeight = this.getViewPanelHeight();
  var buttonPaddingSide = dvt.StyleUtils.getStyle(this._styleMap['hbar'], dvt.ControlPanel.CP_PADDING_LEFT, 0);
  var buttonPaddingInner = dvt.StyleUtils.getStyle(this._styleMap['hbar'], dvt.ControlPanel.CP_PADDING_INNER, 0);

  if (bBiDi) {
    this._collapseButton.setTranslateX(0);
    currX += collapseButtonWidth;

    if (this._additionalContent) {
      dim = dvt.ButtonLAFUtils._getDimForced(context, this._additionalContent);
      currX += buttonPaddingInner;
      this._additionalContent.setTranslate(currX, (panelHeight - dim.h) / 2);

      currX += Math.max(dim.w, buttonWidth);
    }

    if (this._panControl) {
      currX += buttonPaddingInner;
      var yy = 3.5;

      this._panControl.setTranslate(currX, yy);

      //BUG FIX #10154856: keep underlays in sync with pan control position
      if (this._panControlUnderlay) {
        this._panControlUnderlay.setTranslate(currX, yy);
      }

      if (this._panControlUnderlay2) {
        this._panControlUnderlay2.setTranslate(currX, yy);
      }
      dim = dvt.ButtonLAFUtils._getDimForced(context, this._panControl);//40, 40
      currX += dim.w;
    }
    currX += buttonPaddingSide;
  }
  else {
    //position pan control
    if (this._panControl)
    {
      //offset the pan control slightly
      currX += buttonPaddingSide;
      var xx = buttonPaddingSide;
      var yy = 3.5;
      this._panControl.setTranslate(xx, yy);

      //BUG FIX #10154856: keep underlays in sync with pan control position
      if (this._panControlUnderlay) {
        this._panControlUnderlay.setTranslate(xx, yy);
      }
      if (this._panControlUnderlay2) {
        this._panControlUnderlay2.setTranslate(xx, yy);
      }

      dim = dvt.ButtonLAFUtils._getDimForced(context, this._panControl);
      currX += buttonPaddingInner + dim.w;
      currX += 1;//49
    }

    //position additional content
    if (this._additionalContent) {
      dim = dvt.ButtonLAFUtils._getDimForced(context, this._additionalContent);
      if (currX == 0)
        currX += buttonPaddingSide;
      this._additionalContent.setTranslate(currX, (panelHeight - dim.h) / 2);

      currX += dim.w;
      currX += buttonPaddingInner;
      currX = Math.max(currX, panelWidth);
    }

    //position collapse button
    this._collapseButton.setTranslateX(currX);
    currX += collapseButtonWidth;
  }
  return currX;
};


/**
 * Creates horizontal bar background and border
 * @param {dvt.Container} horzContentBar display object representing the horizontal bar
 * @param {dvt.Container} vertContentBar display object representing the vertical bar
 * @param {number} nHorzContentBarChildren number of child objects on the horizontal bar
 * @param {boolean} bBiDi true if right-to-left, false otherwise
 * @param {number} currX current X coordinate
 * @private
 */
dvt.ControlPanel.prototype._createHBarBackground = function(horzContentBar, vertContentBar, nHorzContentBarChildren, bBiDi, currX) {
  var context = this._context;
  var buttonWidth = dvt.StyleUtils.getStyle(this._styleMap, dvt.ControlPanel.CP_OPEN_CLOSE_BUTTON_WIDTH, 0);
  var panelWidth = dvt.StyleUtils.getStyle(this._styleMap, dvt.ControlPanel.CP_TAB_SIZE, 0);
  var panelDrawerStyle = dvt.StyleUtils.getStyle(this._styleMap, dvt.ControlPanel.CP_PANEL_DRAWER_STYLES, null);
  var backgroundWidth = panelDrawerStyle ? currX : currX - buttonWidth;
  var backgroundHeight = this.getViewPanelHeight();
  var backgroundFrameOffsetX = 0;
  var backgroundShapeOffsetX = 0;
  if (!panelDrawerStyle) {
    backgroundFrameOffsetX = bBiDi ? buttonWidth : 0;
    backgroundShapeOffsetX = bBiDi ? buttonWidth : 0;
  }
  else if (panelDrawerStyle && nHorzContentBarChildren == 0)
    backgroundShapeOffsetX = bBiDi ? -panelWidth : panelWidth;

  if (nHorzContentBarChildren > 0 || panelDrawerStyle) {
    var viewFrame = null;
    var viewShape = null;

    var r = parseInt(dvt.StyleUtils.getStyle(this._styleMap, dvt.CSSStyle.BORDER_RADIUS, 0));
    if (panelDrawerStyle) {
      var openSide = nHorzContentBarChildren > 0 && vertContentBar != null ? dvt.ControlPanelLAFUtils.OPEN_BOTTOM : dvt.ControlPanelLAFUtils.OPEN_LEFT;
      viewFrame = dvt.ControlPanelLAFUtils.makeViewOpenShapeHelperOpenSide(context, r, backgroundWidth, backgroundHeight, openSide, panelWidth);
      viewShape = dvt.ControlPanelLAFUtils.makeViewOpenShapeHelperOpenSide(context, r, backgroundWidth, backgroundHeight, openSide, panelWidth);
    }
    else {
      viewFrame = dvt.ControlPanelLAFUtils.createEmptyViewOpenShape(context, backgroundWidth, this.getViewPanelHeight(), !bBiDi, this._styleMap);
      viewShape = dvt.ControlPanelLAFUtils.createEmptyViewOpenShape(context, backgroundWidth, this.getViewPanelHeight(), !bBiDi, this._styleMap);
    }
    viewFrame.setSolidStroke(dvt.StyleUtils.getStyle(this._styleMap, dvt.CSSStyle.BORDER_COLOR, null));
    viewFrame.setFill(null);
    viewFrame.setTranslate(horzContentBar.getTranslateX() + backgroundFrameOffsetX, horzContentBar.getTranslateY());
    horzContentBar.addChildAt(viewFrame, 0);

    viewShape.setSolidFill(dvt.StyleUtils.getStyle(this._styleMap, dvt.CSSStyle.BACKGROUND_COLOR, null));
    viewShape.setTranslate(horzContentBar.getTranslateX() + backgroundShapeOffsetX, horzContentBar.getTranslateY());
    this._background.addChild(viewShape);
  }
};


/**
 * Render the expanded state of the panel.
 * @return {dvt.Container} display object representing expanded state
 * @protected
 */
dvt.ControlPanel.prototype.RenderExpanded = function() {

  var context = this.getCtx();
  var s = new dvt.Container(context);

  this._background = new dvt.Container(context);
  this._frame = new dvt.Container(context);
  s.addChild(this._background);
  s.addChild(this._frame);

  var bBiDi = dvt.Agent.isRightToLeft(context);

  //initialize the starting locations for content bar tools
  var currX = 0;

  //create the horizontal content bar, which contains the pan control,
  //layout combo box and control panel collapse button
  var horzContentBar = new dvt.Container(context);
  var nHorzContentBarChildren = 0;

  nHorzContentBarChildren = this._createHBarPanControl(horzContentBar, nHorzContentBarChildren);
  this._createHBarCollapseButton(horzContentBar); //create before additional content,
  //additional content dropdown will be on top of collapse button
  nHorzContentBarChildren = this._createHBarAdditionalContent(horzContentBar, nHorzContentBarChildren);

  currX = this._positionHBarElements(bBiDi, currX);

  //create the vertical content bar, which contains the zoom-to-fit
  //button, zoom in button, zoom out button, and zoom slider

  var vertContentBar = null;
  var currY = this._getVBarButtonsOffsetY(nHorzContentBarChildren);
  //BUG FIX #10154856: if showing a single horizontal row, offset the start of the
  //vertical controls to leave room for the pan control
  if (this.isSingleHorzRow() &&
      (this._controls & dvt.ControlPanel.CONTROLS_CENTER_BUTTON) != 0)
    currY += (dvt.ControlPanelLAFUtils.getViewPanelHeight() - this.getViewPanelHeight());

  if ((this._controls & dvt.ControlPanel.CONTROLS_ZOOM_TO_FIT_BUTTON) != 0 ||
      (this._controls & dvt.ControlPanel.CONTROLS_ZOOM) != 0) {

    vertContentBar = new dvt.Container(context);
    vertContentBar.setTranslateY(horzContentBar.getTranslateY() + this.getViewPanelHeight());

    currY = this._addZoomToFitButton(vertContentBar, currY);
    currY = this._addZoomControls(vertContentBar, currY);

    this._frame.addChild(vertContentBar);
  }

  // - pan control in control panel difficult to use
  //problem is part of the vertical content bar overlap the pan control
  this._createHBarBackground(horzContentBar, vertContentBar, nHorzContentBarChildren, bBiDi, currX);
  this._frame.addChild(horzContentBar);
  this._positionVBarElements(horzContentBar, vertContentBar, currY);

  //render background after all tools have been added so that
  //we know the size of the content bar
  this._createVBarBackground(horzContentBar, vertContentBar, nHorzContentBarChildren, currY);
  this._expandedDim = dvt.ButtonLAFUtils._getDimForced(context, s);

  return s;
};


/**
 * Populate the horzContentBar with additional tools.
 * This implementation does nothing.  Subclasses should override to include
 * custom tools in the control panel.
 *
 * @param {dvt.Container} contentSprite sprite to contain additional tools that will be
 *                         added to the horzContentBar
 */
dvt.ControlPanel.prototype.PopulateHorzContentBar = function(contentSprite) {
  //do nothing
};


/**
 * Toggle the state of the control panel between expanded and collapsed.
 */
dvt.ControlPanel.prototype.toggleExpandCollapse = function() {
  if (!this._bTransition) {
    if (this._state === dvt.ControlPanel.STATE_EXPANDED) {
      this._doCollapse();
    }
    else if (this._state === dvt.ControlPanel.STATE_COLLAPSED) {
      this._doExpand();
    }
  }
};


/**
 * Get the dimensions of the panel in its collapsed state.
 * @return {dvt.Rectangle} dimensions of collapsed panel
 */
dvt.ControlPanel.prototype.getCollapsedDim = function() {
  return this._collapsedDim;
};

/**
 * Get the dimensions of the panel in its expanded state.
 * @return {dvt.Rectangle} dimensions of expanded panel
 */
dvt.ControlPanel.prototype.getExpandedDim = function() {
  return this._expandedDim;
};


/**
 * Handle a mouse click on the expand button.
 * @param {dvt.MouseEvent} event MouseEvent
 * @protected
 */
dvt.ControlPanel.prototype.HandleExpandClick = function(event) {
  //don't want click to fall through to other components
  dvt.EventManager.consumeEvent(event);

  if (!this._bTransition) {
    this._doExpand();
    this._tooltipManager.hideTooltip();
  }
};


/**
 * Handles transition from collapsed state to expanded state.
 *
 * @private
 */
dvt.ControlPanel.prototype._doExpand = function() {
  //make sure _doCollapse and _doExpand cannot be called
  this._bTransition = true;
  this.setMouseEnabled(false);

  //render the expanded control panel
  var s = this.RenderExpanded();
  this.addChild(s);

  //apply alphas based on mouse position
  this._applyAlphasForMouse();

  //transition from the collapsed control panel to the expanded one
  this.transitionExpand(this.getChildAt(0), s);

  //BUG FIX #8719343: fire expand event
  this.fireExpandEvent();
};


/**
 * Apply alphas based on whether the mouse is over the control panel.
 * @private
 */
dvt.ControlPanel.prototype._applyAlphasForMouse = function() {
  //apply alphas based on whether the mouse is over the control panel
  var bMouseOver = false;
  var stage = this.getCtx().getStage();
  if (stage) {
    bMouseOver = true;//TODO???hitTestPoint(stage.mouseX, stage.mouseY, true);
  }
  if (bMouseOver) {
    this._applyAlphasRollover();
  }
  else {
    this._applyAlphasRollout();
  }
};


/**
 * Handle a mouse click on the collapse button.
 * @param {dvt.MouseEvent} event MouseEvent
 * @protected
 */
dvt.ControlPanel.prototype.HandleCollapseClick = function(event) {
  //don't want click to fall through to other components
  dvt.EventManager.consumeEvent(event);

  if (!this._bTransition) {
    this._doCollapse();
  }
};


/**
 * Handles transition from expanded state to collapsed state.
 *
 * @private
 */
dvt.ControlPanel.prototype._doCollapse = function() {
  //make sure _doCollapse and _doExpand cannot be called
  this._bTransition = true;

  //render the collapsed control panel
  var s = this.RenderCollapsed();
  this.addChild(s);

  //apply alphas based on mouse position
  this._applyAlphasForMouse();

  //transition from the expanded control panel to the collapsed one
  this.transitionCollapse(this.getChildAt(0), s);

  //BUG FIX #8719343: fire collapse event
  this.fireCollapseEvent();
};


/**
 * Animate the transition from the collapsed control to the expanded control.
 *
 * @param {dvt.Container} oldContent collapsed control
 * @param {dvt.Container} newContent expanded control
*/
dvt.ControlPanel.prototype.transitionExpand = function(oldContent, newContent) {
  var odim = oldContent.getDimensions();
  var openCloseButtonWidth = dvt.StyleUtils.getStyle(this._styleMap, dvt.ControlPanel.CP_OPEN_CLOSE_BUTTON_WIDTH, 0);

  // No need to animate if control panel was initially added to the DOM indicating this is an initial render
  if (odim && odim.w != 0) {
    var ndim = newContent.getDimensions();
    //fade out old, fade in new
    var animator = new dvt.Animator(this.getCtx(), .25);
    oldContent.setAlpha(1);
    newContent.setAlpha(0);
    animator.addProp(dvt.Animator.TYPE_NUMBER, oldContent, oldContent.getAlpha, oldContent.setAlpha, 0);
    animator.addProp(dvt.Animator.TYPE_NUMBER, newContent, newContent.getAlpha, newContent.setAlpha, 1);

    //grow new control from size of old
    // newContent.width = oldContent.width;
    // t.$(newContent).scaleX = 1.0;
    newContent.setScaleX(odim.w / ndim.w);
    animator.addProp(dvt.Animator.TYPE_NUMBER, newContent, newContent.getScaleX, newContent.setScaleX, 1);

    //BiDi: need to change x position also, because panel expands out to the left
    if (dvt.Agent.isRightToLeft(this.getCtx())) {
      newContent.setTranslateX(oldContent.getTranslateX());
      var dimWidth = ndim.w + ndim.x;
      animator.addProp(dvt.Animator.TYPE_NUMBER, newContent, newContent.getTranslateX, newContent.setTranslateX,
                       oldContent.getTranslateX() + openCloseButtonWidth - dimWidth);
    }

    // newContent.height = oldContent.height;
    // t.$(newContent).scaleY = 1.0;
    newContent.setScaleY(odim.h / ndim.h);
    animator.addProp(dvt.Animator.TYPE_NUMBER, newContent, newContent.getScaleY, newContent.setScaleY, 1);

    //remove the old control at the end of the transition
    // t.removeChild(oldContent);
    // t.play();
    animator.setOnEnd(function() {
      oldContent.getParent().removeChild(oldContent);
      this._bTransition = false;
      this.setMouseEnabled(true);
      //update state
      this._state = dvt.ControlPanel.STATE_EXPANDED;
    }, this);

    animator.play();
  } else {
    this._state = dvt.ControlPanel.STATE_EXPANDED;
    oldContent.getParent().removeChild(oldContent);
    this.PositionExpanded(newContent);
  }
};

/**
 * @protected
 * Position the control panel in expanded state
 * @param {dvt.Container} content control panel content
 */
dvt.ControlPanel.prototype.PositionExpanded = function(content) {
  var transX;
  if (dvt.Agent.isRightToLeft(this.getCtx())) {
    var openCloseButtonWidth = dvt.StyleUtils.getStyle(this._styleMap, dvt.ControlPanel.CP_OPEN_CLOSE_BUTTON_WIDTH, 0);
    var ndim = dvt.DisplayableUtils.getDimensionsForced(this.getCtx(), content);
    var dimWidth = Math.floor(ndim.w + ndim.x);
    transX = openCloseButtonWidth - dimWidth;
  }
  else
    transX = 0;

  content.setTranslate(transX, 0);
};


/**
 * Animate the transition from the expanded control to the collapsed control.
 *
 * @param {dvt.Container} oldContent expanded control
 * @param {dvt.Container} newContent collapsed control
 */
dvt.ControlPanel.prototype.transitionCollapse = function(oldContent, newContent) {
  var animator = new dvt.Animator(this.getCtx(), .25);

  //fade out old, fade in new
  oldContent.setAlpha(1);
  newContent.setAlpha(0);
  animator.addProp(dvt.Animator.TYPE_NUMBER, oldContent, oldContent.getAlpha, oldContent.setAlpha, 0);
  animator.addProp(dvt.Animator.TYPE_NUMBER, newContent, newContent.getAlpha, newContent.setAlpha, 1);

  //shrink old control to size of new
  var ndim = this.getCollapsedDim();
  var odim = this.getExpandedDim();
  animator.addProp(dvt.Animator.TYPE_NUMBER, oldContent, oldContent.getScaleX, oldContent.setScaleX, ndim.w / odim.w);

  //BiDi: need to change x position also, because panel collapses to the right
  if (dvt.Agent.isRightToLeft(this.getCtx())) {
    animator.addProp(dvt.Animator.TYPE_NUMBER, oldContent, oldContent.getTranslateX, oldContent.setTranslateX,
                     newContent.getTranslateX());
  }
  animator.addProp(dvt.Animator.TYPE_NUMBER, oldContent, oldContent.getScaleY, oldContent.setScaleY, ndim.h / odim.h);

  //remove the old control at the end of the transition
  animator.setOnEnd(function() {
    oldContent.getParent().removeChild(oldContent);
    this._bTransition = false;
    //update state
    this._state = dvt.ControlPanel.STATE_COLLAPSED;
  }, this);

  animator.play();
};


/**
 * Fire expand event.
 * @return {boolean} true if event was dispatched successfully, false otherwise
 */
dvt.ControlPanel.prototype.fireExpandEvent = function() {
  var event = new DvtControlPanelEvent(DvtControlPanelEvent.SUBTYPE_SHOW);
  this.FireListener(event);
  return true;
};


/**
 * Fire collapse event.
 * @return {boolean} true if event was dispatched successfully, false otherwise
 */
dvt.ControlPanel.prototype.fireCollapseEvent = function() {
  var event = new DvtControlPanelEvent(DvtControlPanelEvent.SUBTYPE_HIDE);
  this.FireListener(event);
  return true;
};

// Mouse event handling
/**
 * Handle roll over event
 * @param {dvt.MouseEvent} event mouse event
 * @protected
 */
dvt.ControlPanel.prototype.HandleRollOver = function(event) {
  this._bMouseOver = true;
  if (!this._bMouseDragPanning)
  {
    this._applyAlphasRollover();
  }
};

/**
 * Handle roll out event
 * @param {dvt.MouseEvent} event mouse event
 * @protected
 */
dvt.ControlPanel.prototype.HandleRollOut = function(event) {
  this._bMouseOver = false;
  if (!this._bMouseDragPanning)
  {
    this._applyAlphasRollout();
  }
};


/**
 * Apply alphas to the background and frame for when the
 * mouse is over the control panel.
 * @private
 */
dvt.ControlPanel.prototype._applyAlphasRollover = function() {
  this._background.setAlpha(this._styleMap[dvt.ControlPanel.BG_ROLLOVER_ALPHA]);
  this._frame.setAlpha(this._styleMap[dvt.ControlPanel.FRAME_ROLLOVER_ALPHA]);

  //BUG FIX #10154856: fade underlay just like control panel fill
  if (this._panControlUnderlay) {
    this._panControlUnderlay.setAlpha(this._styleMap[dvt.ControlPanel.BG_ROLLOVER_ALPHA]);
  }
};


/**
 * Apply alphas to the background and frame for when the
 * mouse is not over the control panel.
 * @private
 */
dvt.ControlPanel.prototype._applyAlphasRollout = function() {
  this._background.setAlpha(this._bgAlpha);
  this._frame.setAlpha(this._styleMap[dvt.ControlPanel.FRAME_ROLLOUT_ALPHA]);

  //BUG FIX #10154856: fade underlay just like control panel fill
  if (this._panControlUnderlay) {
    this._panControlUnderlay.setAlpha(this._bgAlpha);
  }
};

/**
 * Checks whether Pan control is shown
 * @return {boolean} true if panel control is shown, false otherwise
 */
dvt.ControlPanel.prototype.isPanControlShown = function() {
  return (this._controls & dvt.ControlPanel.CONTROLS_CENTER_BUTTON) > 0;
};


/**
 * @override
 */
dvt.ControlPanel.prototype.getDimensions = function() {
  if (! this._dim) {
    this._dim = dvt.ControlPanel.superclass.getDimensions.call(this);
  }
  return this._dim;
};

/**
 * Render control panel
 */
dvt.ControlPanel.prototype.renderComponent = function() {
  var s;
  if (this._state == dvt.ControlPanel.STATE_COLLAPSED) {
    s = this.RenderCollapsed();
  } else {
    s = this.RenderExpanded();
    this.PositionExpanded(s);  //Position the expanded control panel
  }
  this._background.setAlpha(this._bgAlpha);
  this._frame.setAlpha(this._styleMap[dvt.ControlPanel.FRAME_ROLLOUT_ALPHA]);
  this.addChild(s);
};

/**
 * Return button images
 * @return {object}  The object containing button images
 */
dvt.ControlPanel.prototype.getButtonImages = function() {
  return this._buttonImages;
};


/**
 * Returns top padding for vertical bar
 * @param {number} nHorzContentBarChildren number of children in horizontal content bar.
 *
 * @return {number} number of pixels specified as top padding for vertical bar
 * @private
 */
dvt.ControlPanel.prototype._getVBarButtonsOffsetY = function(nHorzContentBarChildren) {
  // we need extra room if we have pan control or if this is Alta style and horizontal bar is empty
  if ((this._controls & dvt.ControlPanel.CONTROLS_CENTER_BUTTON) ||
      this._styleMap && this._styleMap[dvt.ControlPanel.CP_PANEL_DRAWER_STYLES] && nHorzContentBarChildren == 0)
    return dvt.StyleUtils.getStyle(this._styleMap['vbar'], dvt.ControlPanel.CP_PADDING_TOP, 0);
  else
    return 0;
};

/**
 * Enable zoom controls
 */
dvt.ControlPanel.prototype.enableZoomControls = function() {
  var currZoom = this._panZoomCanvas.getZoom();
  var nextZoom = this._panZoomCanvas.getNextZoomLevel(currZoom);
  var prevZoom = this._panZoomCanvas.getPrevZoomLevel(currZoom);
  if (this._zoomInButton)
    this._zoomInButton.setEnabled(currZoom != nextZoom);
  if (this._zoomOutButton)
    this._zoomOutButton.setEnabled(currZoom != prevZoom);
};

/**
 * Enable zoom in control
 * @param {boolean} enabled  true to enable zoom in control, false to disable.
 */
dvt.ControlPanel.prototype.enableZoomInControl = function(enabled) {
  if (this._zoomInButton)
    this._zoomInButton.setEnabled(enabled);
};

/**
 * Enable zoom out control
 * @param {boolean} enabled  true to enable zoom out control, false to disable.
 */
dvt.ControlPanel.prototype.enableZoomOutControl = function(enabled) {
  if (this._zoomOutButton)
    this._zoomOutButton.setEnabled(enabled);
};

/**
 * Handles a mouse click on the zoom in button.
 * @param {dvt.MouseEvent} event Mouse event
 * @protected
 */
dvt.ControlPanel.prototype.HandleZoomInClick = function(event) {
  var currZoom = this._panZoomCanvas.getZoom();
  var newZoom = this._panZoomCanvas.getNextZoomLevel(currZoom);

  var animator = new dvt.Animator(this.getCtx(), this._panZoomCanvas.getAnimationDuration());
  this._panZoomCanvas.zoomTo(newZoom, undefined, undefined, animator);
  animator.play();
};

/**
 * Handles a mouse click on the zoom out button.
 * @param {dvt.MouseEvent} event Mouse event
 * @protected
 */
dvt.ControlPanel.prototype.HandleZoomOutClick = function(event) {
  var currZoom = this._panZoomCanvas.getZoom();
  var newZoom = this._panZoomCanvas.getPrevZoomLevel(currZoom);
  var context = this.getCtx();
  var animator = new dvt.Animator(context, this._panZoomCanvas.getAnimationDuration());

  this._panZoomCanvas.zoomTo(newZoom, undefined, undefined, animator);

  animator.play();
};

/**
 * Handles a mouse click on the zoom to fit button.
 * @param {dvt.MouseEvent} event Mouse event
 * @protected
 */
dvt.ControlPanel.prototype.HandleZoomToFitClick = function(event) {
  var animator = new dvt.Animator(this.getCtx(), this._panZoomCanvas.getAnimationDuration());
  this._panZoomCanvas.zoomToFit(animator);
  animator.play();
};

/**
 * Returns this control panel event manager
 * @return {dvt.EventManager} event manager
 */
dvt.ControlPanel.prototype.getEventManager = function() {
  return this._eventManager;
};


/**
 * Check if the control panel is disclosed
 * @return {boolean} return true if control panel is disclosed
 */
dvt.ControlPanel.prototype.isDisclosed = function() {
  return this.getState() == dvt.ControlPanel.STATE_EXPANDED;
};

/**
 * Get the control panel displayable to perform specific action
 * Used by Automation APIs
 * @param {string} type  control panel action type
 * @param {string} stampId  item stamp id if the action is performed on a combo box
 * @return {dvt.Displayable}  displayable
 */
dvt.ControlPanel.prototype.getActionDisplayable = function(type, stampId) {
  if (type == 'disclosure')
    return this.isDisclosed() ? this._collapseButton : this._expandButton;

  if (this.isDisclosed()) {
    if (type == 'zoomToFit' && this._zoomToFitButton && this._zoomToFitButton.isEnabled()) {
      return this._zoomToFitButton;
    } else if (type == 'zoomIn' && this._zoomInButton && this._zoomInButton.isEnabled()) {
      return this._zoomInButton;
    } else if (type == 'zoomOut' && this._zoomOutButton && this._zoomOutButton.isEnabled()) {
      return this._zoomOutButton;
    }
  }
  return null;
};
/**
 * Default values and utility functions for PanZoomControlPanel versioning.
 * @class
 */
var DvtControlPanelDefaults = new Object();

dvt.Obj.createSubclass(DvtControlPanelDefaults, dvt.Obj);


/**
 * Contains overrides for the 'alta' skin.
 */
DvtControlPanelDefaults.SKIN_ALTA = {
  'fill-type': 'solid',
  'backgroundAlpha': 1,
  'backgroundDragAlpha': 1,
  'borderDragAlpha': 1,
  'panelDrawerStyles': true,
  'buttonWidth': 42,
  'buttonHeight': 42,
  'buttonRadius': 0,
  'openCloseButtonWidth': 42,
  'tabSize': 42,
  'paddingTop': 15,
  'paddingSide': -1,
  'imageWidth': 24,
  'imageHeight': 24,
  'centerButtonDisplayed': false,
  'scrollbarBackground': 'linear-gradient(bottom, #dce2e7 0%, #f8f8f8 8%)',
  'scrollbarBorderColor': '#dce2e7',
  'scrollbarHandleColor': '#abb0b4',
  'scrollbarHandleHoverColor' : '#333333',
  'scrollbarHandleActiveColor' : '#333333',
  'comboBox': {
    'paddingTop': 0,
    'paddingBottom': 0,
    'paddingLeft': 0,
    'paddingRight': 0,
    'paddingInner': 0,
    'itemHeight': 30,
    'imagePadding': 0,
    'itemPadding': 10
  },
  'vbar': {
    'paddingTop': 0,
    'paddingBottom': 0,
    'paddingLeft': 0,
    'paddingRight': 0,
    'paddingInner': 0
  },
  'hbar': {
    'paddingTop': 0,
    'paddingBottom': 0,
    'paddingLeft': 0,
    'paddingRight': 0,
    'paddingInner': 0
  }
};


/**
 * Contains overrides for the 'skyros' skin.
 */
DvtControlPanelDefaults.SKIN_SKYROS = {
  'fill-type': 'solid'
};


/**
 * Contains control panel defaults.
 */
DvtControlPanelDefaults.DEFAULT = {
  'fill-type': 'gradient',
  'border-color': '#ffffff',
  'background-color': '#ffffff',
  'border-radius': 6,
  'backgroundAlpha': .5,
  'backgroundHoverAlpha': 1.0,
  'backgroundDragAlpha': .5,
  'borderAlpha': 1,
  'borderHoverAlpha': 1,
  'borderDragAlpha': .5,
  'tabSize': 26,
  'buttonWidth': 22,
  'buttonHeight': 22,
  'buttonRadius': 3,
  'paddingTop': 5,
  'paddingSide': 5,
  'imageWidth': 22,
  'imageHeight': 20,
  'openCloseButtonWidth': 10,
  'centerButtonDisplayed': true,
  'comboBox': {
    'paddingTop': 2,
    'paddingBottom': 6,
    'paddingLeft': 3,
    'paddingRight': 3,
    'paddingInner': 2,
    'itemHeight': 22,
    'radius': 4,
    'imagePadding': 2,
    'itemPadding': 7
  },
  'vbar': {
    'paddingTop': 2.5,
    'paddingBottom': 2.5,
    'paddingLeft': 2,
    'paddingRight': 2,
    'paddingInner': 2
  },
  'hbar': {
    'paddingTop': 2,
    'paddingBottom': 2,
    'paddingLeft': 3,
    'paddingRight': 3,
    'paddingInner': 2
  }
};


/**
 * Combines the user options with the defaults for the specified version.  Returns the
 * combined options object.  This object will contain internal attribute values and
 * should be accessed in internal code only.
 * @param {object} userOptions The object containing options specifications for this component.
 * @return {object} The combined options object.
 */
DvtControlPanelDefaults.calcOptions = function(userOptions) {
  var defaults = DvtControlPanelDefaults._getDefaults(userOptions);

  // Use defaults if no overrides specified
  if (!userOptions)
    return defaults;
  else // Merge the options object with the defaults
    return dvt.JsonUtils.merge(userOptions, defaults);
};


/**
 * Returns the default options object for the specified version of the component.
 * @param {object} userOptions The object containing options specifications for this component.
 * @private
 */
DvtControlPanelDefaults._getDefaults = function(userOptions) {
  var defaults = null;
  if (userOptions && userOptions['skin'] === 'skyros')
    defaults = dvt.JsonUtils.merge(DvtControlPanelDefaults.SKIN_SKYROS, DvtControlPanelDefaults.DEFAULT);
  else if (userOptions && userOptions['skin'] === 'alta')
    defaults = dvt.JsonUtils.merge(DvtControlPanelDefaults.SKIN_ALTA, DvtControlPanelDefaults.DEFAULT);
  else
    defaults = dvt.JsonUtils.clone(DvtControlPanelDefaults.DEFAULT);
  return defaults;
};
// Copyright (c) 2012, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 * @constructor
 */
var DvtControlPanelEventManager = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

dvt.Obj.createSubclass(DvtControlPanelEventManager, dvt.EventManager);


/**
 * Click event handler.
 * @protected
 */
DvtControlPanelEventManager.prototype.OnMouseDown = function(event) {
  var obj = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));
  DvtControlPanelEventManager.superclass.OnMouseDown.call(this, event);

  // Done if there is no object
  if (!obj) {
    return;
  }

  if (obj.HandleMouseDown) {
    obj.HandleMouseDown(event);
  }
  event.stopPropagation();
};

DvtControlPanelEventManager.prototype.OnMouseUp = function(event) {
  var obj = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));
  DvtControlPanelEventManager.superclass.OnMouseUp.call(this, event);

  // Done if there is no object
  if (!obj) {
    return;
  }

  if (obj.HandleMouseUp) {
    obj.HandleMouseUp(event);
  }
  event.stopPropagation();
};

DvtControlPanelEventManager.prototype.OnMouseOut = function(event) {
  var obj = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));
  DvtControlPanelEventManager.superclass.OnMouseOut.call(this, event);

  // Done if there is no object
  if (!obj) {
    return;
  }

  if (obj.HandleMouseOut) {
    obj.HandleMouseOut(event);
  }
  event.stopPropagation();
};

/**
 * Click event handler.
 * @protected
 */
DvtControlPanelEventManager.prototype.OnClick = function(event) {

  var obj = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));
  DvtControlPanelEventManager.superclass.OnClick.call(this, event);

  // Done if there is no object
  if (!obj) {
    return;
  }

  if (obj.HandleClick) {
    obj.HandleClick(event);
  }
  event.stopPropagation();
};


/**
 * Roll Over event handler
 * @protected
 */
DvtControlPanelEventManager.prototype.OnRollOver = function(event) {
  DvtControlPanelEventManager.superclass.OnRollOver.call(this, event);
  var obj = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));

  // Return if no object is found
  if (!obj) {
    return;
  }

  if (obj.HandleRollOver) {
    obj.HandleRollOver(event);
  }
};


/**
 * Roll Out event handler
 * @protected
 */
DvtControlPanelEventManager.prototype.OnRollOut = function(event) {
  DvtControlPanelEventManager.superclass.OnRollOut.call(this, event);
  var obj = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));

  // Return if no object is found
  if (!obj) {
    return;
  }

  if (obj.HandleRollOut) {
    obj.HandleRollOut(event);
  }
};


/**
 * @override
 */
DvtControlPanelEventManager.prototype.OnComponentTouchClick = function(event) {
  var obj = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));

  // Return if no object is found
  if (!obj) {
    return;
  }

  if (obj.HandleClick) {
    obj.HandleClick(event);
  }
  event.stopPropagation();
};


/**
 * @override
 */
DvtControlPanelEventManager.prototype.HandleImmediateTouchStartInternal = function(event) {
  event.blockTouchHold();
  dvt.EventManager.consumeEvent(event);
};

/*
 * dvt.ControlPanelLAFUtils Utility class for providing LAF for buttons in the control panel.
 */
dvt.ControlPanelLAFUtils = {};

dvt.Obj.createSubclass(dvt.ControlPanelLAFUtils, dvt.Obj);

dvt.ControlPanelLAFUtils.OPEN_TOP = 'top';
dvt.ControlPanelLAFUtils.OPEN_RIGHT = 'right';
dvt.ControlPanelLAFUtils.OPEN_LEFT = 'left';
dvt.ControlPanelLAFUtils.OPEN_BOTTOM = 'bottom';

dvt.ControlPanelLAFUtils.VIEW_PANEL_HEIGHT = 47;
dvt.ControlPanelLAFUtils.VIEW_PANEL_HALF_HEIGHT = 26;

dvt.ControlPanelLAFUtils.SIN_PI_4 = Math.sin(Math.PI / 4);
dvt.ControlPanelLAFUtils.TAN_PI_8 = Math.tan(Math.PI / 8);


/**
 * Returns the height of the horizontal bar of the control panel to allow
 * showing double rows of controls
 * @return {number} height of the horizontal bar for double rows
 */
dvt.ControlPanelLAFUtils.getViewPanelHeight = function() {
  return dvt.ControlPanelLAFUtils.VIEW_PANEL_HEIGHT;
};


/**
 * Returns the height of the horizontal bar of the control panel to allow
 * showing only a single row of controls, like in TMap.
 * @return {number} height of the horizontal bar for single row
 */
dvt.ControlPanelLAFUtils.getViewPanelHalfHeight = function() {
  //BUG FIX #10154856: show single row of controls in horizontal arm of control panel in TMap
  return dvt.ControlPanelLAFUtils.VIEW_PANEL_HALF_HEIGHT;
};


/**
 * Create the background for the view part of the expanded control panel.
 *
 * @param {dvt.Context} context Platform specific context object
 * @param {number} nw width of the view part of the control panel
 * @param {number} nh height of the view part of the control panel
 * @param {boolean} bL2R true if the reading direction is left-to-right, so that the
 *        control panel is in the top left corner of the view
 * @param {Object} styleMap The object containing style specifications for this component
 * @return {dvt.Path} background for the view part of the expanded control panel
 */
dvt.ControlPanelLAFUtils.createEmptyViewOpenShape = function(context, nw, nh, bL2R, styleMap) {
  //BUG FIX #10154856: pass in height to show single row of controls in
  //horizontal arm of control panel in TMap
  if (! nw)
    nw = 86;
  if (! nh)
    nh = 47;
  if (bL2R === undefined)
    bL2R = true;

  var r = parseInt(dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BORDER_RADIUS, 0));
  var ww = nw - (2 * r);
  var hh = nh - (2 * r);

  var xx = 0;
  var yy = 0;

  var mc = dvt.ControlPanelLAFUtils.makeViewOpenShapeHelper(context, r, ww, hh, xx, yy, bL2R);

  return mc;
};

dvt.ControlPanelLAFUtils.makeViewOpenShapeHelper = function(context, r, ww, hh, xx, yy, bL2R) {
  var x = ww + r;
  var y = hh + r;

  //bottom right corner
  var cmds = dvt.PathUtils.moveTo(x + r, y + r);
  cmds += dvt.PathUtils.lineTo(x - ww, y + r);
  x = x - ww;
  y = y;

  //bottom left corner
  cmds += dvt.PathUtils.lineTo(x - r, y + r);
  cmds += dvt.PathUtils.lineTo(x - r, y - hh);
  x = x;
  y = y - hh;

  if (bL2R) {
    //top left corner
    cmds += dvt.PathUtils.quadTo(- r + x, - dvt.ControlPanelLAFUtils.TAN_PI_8 * r + y,
        - dvt.ControlPanelLAFUtils.SIN_PI_4 * r + x,
        - dvt.ControlPanelLAFUtils.SIN_PI_4 * r + y) +
        dvt.PathUtils.quadTo(- dvt.ControlPanelLAFUtils.TAN_PI_8 * r + x, - r + y, x, - r + y) +
        dvt.PathUtils.lineTo(x, - r + y);
    cmds += dvt.PathUtils.lineTo(x + ww + r, - r + y);
    x = x + ww;
    y = y;
    //top right corner
    cmds += dvt.PathUtils.lineTo(x + r, y + hh);
  }
  else
  {
    //top left corner
    cmds += dvt.PathUtils.lineTo(x - r, - r + y);
    cmds += dvt.PathUtils.lineTo(x + ww, - r + y);
    x = x + ww;
    y = y;
    //top right corner
    cmds += dvt.PathUtils.quadTo(dvt.ControlPanelLAFUtils.TAN_PI_8 * r + x, - r + y,
        dvt.ControlPanelLAFUtils.SIN_PI_4 * r + x,
        - dvt.ControlPanelLAFUtils.SIN_PI_4 * r + y) +
        dvt.PathUtils.quadTo(r + x, - dvt.ControlPanelLAFUtils.TAN_PI_8 * r + y, r + x, y) +
        dvt.PathUtils.lineTo(x + r, y + hh);
  }

  cmds += dvt.PathUtils.closePath();
  return new dvt.Path(context, cmds);
};


/**
 * Create the background for the collapsed control panel.
 *
 * @param {dvt.Context} context Platform specific context object
 * @param {number} nh height of the empty control panel
 * @param {Object} styleMap The object containing style specifications for this component
 * @param {boolean} bL2R true if the reading direction is left-to-right, so that the
 *        control panel is in the top left corner of the view
 * @return {dvt.Path} background for the collapsed control panel
 */
dvt.ControlPanelLAFUtils.createEmptyViewClosedShape = function(context, nh, styleMap, bR2L) {
  //BUG FIX #10154856: pass in height to show single row of controls in
  //horizontal arm of control panel in TMap
  if (!nh)
    nh = 47;

  var r = parseInt(dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BORDER_RADIUS, 0));
  var buttonWidth = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_OPEN_CLOSE_BUTTON_WIDTH, 0);
  var buttonHeight = Math.max(nh, dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_BUTTON_HEIGHT, nh));

  var arPoints = dvt.ButtonLAFUtils.GetButtonPathCommands(buttonWidth, buttonHeight, r, bR2L);
  arPoints = arPoints.concat('Z');
  var mc = new dvt.Path(context, arPoints, 'cls_shape');

  var color = dvt.StyleUtils.getStyle(styleMap, dvt.PanelDrawer.TAB_BG_COLOR_INACTIVE, null);
  if (!color)
    color = dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BACKGROUND_COLOR, null);
  mc.setSolidFill(color);

  return mc;
};


/**
 * Create the frame for the collapsed control panel.
 *
 * @param {dvt.Context} context Platform specific context object
 * @param {number} nh height of the empty control panel
 * @param {Object} styleMap The object containing style specifications for this component
 * @param {boolean} bL2R true if the reading direction is left-to-right, so that the
 *        control panel is in the top left corner of the view
 * @return {dvt.Path} frame for the collapsed control panel
 */
dvt.ControlPanelLAFUtils.createEmptyViewClosedFrame = function(context, nh, styleMap, bR2L) {
  //BUG FIX #10154856: pass in height to show single row of controls in
  //horizontal arm of control panel in TMap
  if (!nh)
    nh = 47;
  var r = parseInt(dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BORDER_RADIUS, 0));
  var buttonWidth = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_OPEN_CLOSE_BUTTON_WIDTH, 0);
  var buttonHeight = Math.max(nh, dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_BUTTON_HEIGHT, nh));

  var arPoints = dvt.ButtonLAFUtils.GetButtonPathCommands(buttonWidth, buttonHeight, r, bR2L);
  arPoints = arPoints.concat('Z');
  var mc = new dvt.Path(context, arPoints, 'cls_shape');
  mc.setSolidStroke(dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BORDER_COLOR, null));
  mc.setFill(null);
  return mc;
};


/**
 * Render the background for the vertical bar of the expanded control panel.
 *
 * @param {dvt.Context} context Platform specific context object
 * @param {number} nh height of the vertical bar of the control panel
 * @param {Object} styleMap The object containing style specifications for this component
 * @param {string} openSide dvt.ControlPanelLAFUtils.OPEN_TOP or dvt.ControlPanelLAFUtils.OPEN_RIGHT
 * @param {number} openSideSize horizontal bar height
 */
dvt.ControlPanelLAFUtils.renderEmptyZoomShape = function(context, nh, styleMap, openSide, openSideSize) {
  if (!nh) {
    nh = 137;
  }
  var r = parseInt(dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BORDER_RADIUS, 0));
  var cpWidth = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_TAB_SIZE, 0);
  var ww = cpWidth - (2 * r);
  var hh = nh + 7 - (2 * r);
  var xx = 0;
  var yy = 0;

  // Fill
  var mc;
  if (openSide && openSideSize)
    mc = dvt.ControlPanelLAFUtils.makeZoomShapeHelperOpenSide(context, r, cpWidth, nh, openSide, openSideSize);
  else
    mc = dvt.ControlPanelLAFUtils.makeZoomShapeHelper(context, r, ww, hh, xx, yy);
  mc.setSolidFill(dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BACKGROUND_COLOR, null));

  return mc;
};


/**
 * Render the border for the vertical bar of the expanded control panel.
 *
 * @param {dvt.Context} context Platform specific context object
 * @param {number} nh height of the vertical bar of the control panel
 * @param {boolean} roundBottomRight indicator for rounding bottom right
 * @param {Object} styleMap The object containing style specifications for this component
 * @param {string} openSide dvt.ControlPanelLAFUtils.OPEN_TOP or dvt.ControlPanelLAFUtils.OPEN_RIGHT
 * @param {number} openSideSize horizontal bar height
 */
dvt.ControlPanelLAFUtils.renderEmptyZoomFrame = function(context, nh, roundBottomRight, styleMap, openSide, openSideSize) {
  if (!nh)
    nh = 137;
  if (!roundBottomRight)
    roundBottomRight = true;

  var r = parseInt(dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BORDER_RADIUS, 0));
  var cpWidth = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_TAB_SIZE, 0);
  var ww = cpWidth - (2 * r);
  var hh = nh + 7 - (2 * r);
  var xx = 0;
  var yy = 0;

  // Line Style
  var mc = null;
  if (openSide && openSideSize)
    mc = dvt.ControlPanelLAFUtils.makeZoomShapeHelperOpenSide(context, r, cpWidth, nh, openSide, openSideSize);
  else
    mc = dvt.ControlPanelLAFUtils.makeZoomShapeHelper(context, r, ww, hh, xx, yy, roundBottomRight);
  mc.setSolidStroke(dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BORDER_COLOR, null));
  mc.setFill(null);
  return mc;
};

dvt.ControlPanelLAFUtils.makeZoomShapeHelper = function(context, r, ww, hh, xx, yy, roundBottomRight) {
  if (!roundBottomRight) {
    roundBottomRight = true;
  }
  var x = ww + r;
  var y = hh;

  var cmds = dvt.PathUtils.moveTo(x + r, y);

  // Bug 9686175 - controlPanel looks bad when featuresOff="pan zoom cardSync changeLayout"
  if (roundBottomRight) {
    cmds += dvt.PathUtils.quadTo(r + x, dvt.ControlPanelLAFUtils.TAN_PI_8 * r + y,
        dvt.ControlPanelLAFUtils.SIN_PI_4 * r + x,
        dvt.ControlPanelLAFUtils.SIN_PI_4 * r + y) +
        dvt.PathUtils.quadTo(dvt.ControlPanelLAFUtils.TAN_PI_8 * r + x, r + y, x, r + y) +
        dvt.PathUtils.lineTo(x, r + y);
  }
  else {
    cmds += dvt.PathUtils.lineTo(x + r, y + r);
  }
  cmds += dvt.PathUtils.lineTo(x - ww, r + y);
  x = x - ww;
  y = y;

  cmds += dvt.PathUtils.quadTo(- dvt.ControlPanelLAFUtils.TAN_PI_8 * r + x, r + y,
      - dvt.ControlPanelLAFUtils.SIN_PI_4 * r + x,
      dvt.ControlPanelLAFUtils.SIN_PI_4 * r + y) +
      dvt.PathUtils.quadTo(- r + x, dvt.ControlPanelLAFUtils.TAN_PI_8 * r + y, - r + x, y) +
      dvt.PathUtils.lineTo(- r + x, y) + dvt.PathUtils.lineTo(- r + x, y - hh);
  x = x;
  y = y - hh;

  cmds += dvt.PathUtils.lineTo(x + ww + r, y) + dvt.PathUtils.lineTo(x + ww + r, y + hh) + dvt.PathUtils.closePath();
  return new dvt.Path(context, cmds);
};


/**
 * Creates a path used for the vertical bar according to the specified dimensions
 *
 * @param {dvt.Context} context Platform specific context object
 * @param {number} r radius for the generated shape
 * @param {number} width width of the generated shape
 * @param {number} height height of the generated shape
 * @param {string} openSide dvt.ControlPanelLAFUtils.OPEN_TOP or dvt.ControlPanelLAFUtils.OPEN_RIGHT
 * @param {number} openSideSize horizontal bar height
 * @return {dvt.Path}  a path for the vertical bar
 */
dvt.ControlPanelLAFUtils.makeZoomShapeHelperOpenSide = function(context, r, width, height, openSide, openSideSize) {
  var arPoints = dvt.ControlPanelLAFUtils.GetShapePathCommands(context, width, height, r, openSide, openSideSize);
  return new dvt.Path(context, arPoints);
};


/**
 * Creates a path used for the horizontal bar according to the specified dimensions
 *
 * @param {dvt.Context} context Platform specific context object
 * @param {number} r radius for the generated shape
 * @param {number} width width of the generated shape
 * @param {number} height height of the generated shape
 * @param {string} openSide dvt.ControlPanelLAFUtils.OPEN_TOP or dvt.ControlPanelLAFUtils.OPEN_RIGHT or dvt.ControlPanelLAFUtils.OPEN_BOTTOM
 * @param {number} openSideSize horizontal bar height
 * @return {dvt.Path}  a path for the horizontal bar
 */
dvt.ControlPanelLAFUtils.makeViewOpenShapeHelperOpenSide = function(context, r, width, height, openSide, openSideSize) {
  var arPoints = dvt.ControlPanelLAFUtils.GetShapePathCommands(context, width, height, r, openSide, openSideSize);
  return new dvt.Path(context, arPoints);
};


/**
 * Returns an array of commands for the dvt.Path. The array is used to generate vertical or horizontal bar shape
 *
 * @param {dvt.Context} context Platform specific context object
 * @param {number} width width of the generated shape
 * @param {number} height height of the generated shape
 * @param {number} r radius for the generated shape
 * @param {string} openSide dvt.ControlPanelLAFUtils.OPEN_TOP or dvt.ControlPanelLAFUtils.OPEN_RIGHT or dvt.ControlPanelLAFUtils.OPEN_BOTTOM
 * @param {number} openSideSize horizontal bar height
 * @return {Array} array is used to generate vertical or horizontal bar shape
 */
dvt.ControlPanelLAFUtils.GetShapePathCommands = function(context, width, height, r, openSide, openSideSize) {
  var arPoints;
  var bidi = dvt.Agent.isRightToLeft(context);
  if (openSide == dvt.ControlPanelLAFUtils.OPEN_TOP && !bidi) { //vertical bar
    arPoints = ['M', width, 0,
                'L', width, height - r,
                'A', r, r, 0, 0, 1, width - r, height,
                'L', 0, height,
                'L', 0, 0];
  }
  if (openSide == dvt.ControlPanelLAFUtils.OPEN_TOP && bidi) { //vertical bar
    arPoints = ['M', width, 0,
                'L', width, height,
                'L', r, height,
                'A', r, r, 0, 0, 1, 0, height - r,
                'L', 0, 0];
  }
  else if (openSide == dvt.ControlPanelLAFUtils.OPEN_RIGHT && !bidi) { //vertical bar
    arPoints = ['M', width, openSideSize,
                'L', width, height - r,
                'A', r, r, 0, 0, 1, width - r, height,
                'L', 0, height,
                'L', 0, 0,
                'L', width, 0];
  }
  else if (openSide == dvt.ControlPanelLAFUtils.OPEN_RIGHT && bidi) { //vertical bar
    arPoints = ['M', 0, 0,
                'L', width, 0,
                'L', width, height,
                'L', r, height,
                'A', r, r, 0, 0, 1, 0, height - r,
                'L', 0, openSideSize];
  }
  else if (openSide == dvt.ControlPanelLAFUtils.OPEN_LEFT && !bidi) { //horizontal bar
    arPoints = ['M', 0, 0,
                'L', width - r, 0,
                'A', r, r, 0, 0, 1, width, r,
                'L', width, height - r,
                'A', r, r, 0, 0, 1, width - r, height,
                'L', 0, height];
  }
  else if (openSide == dvt.ControlPanelLAFUtils.OPEN_LEFT && bidi) { //horizontal bar
    arPoints = ['M', width, height,
                'L', r, height,
                'A', r, r, 0, 0, 1, 0, height - r,
                'L', 0, r,
                'A', r, r, 0, 0, 1, r, 0,
                'L', width, 0];
  }
  else if (openSide == dvt.ControlPanelLAFUtils.OPEN_BOTTOM && !bidi) { //horizontal bar
    arPoints = ['M', 0, height,
                'L', 0, 0,
                'L', width - r, 0,
                'A', r, r, 0, 0, 1, width, r,
                'L', width, height - r,
                'A', r, r, 0, 0, 1, width - r, height,
                'L', openSideSize, height];
  }
  else if (openSide == dvt.ControlPanelLAFUtils.OPEN_BOTTOM && bidi) { //horizontal bar
    arPoints = ['M', width, height,
                'L', width, 0,
                'L', r, 0,
                'A', r, r, 0, 0, 0, 0, r,
                'L', 0, height - r,
                'A', r, r, 0, 0, 0, r, height,
                'L', width - openSideSize, height];
  }
  return arPoints;
};
/**
 * A component that supports panning and zooming
 * @param {dvt.Context} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @constructor
 * @protected
 */
dvt.PanZoomComponent = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

dvt.Obj.createSubclass(dvt.PanZoomComponent, dvt.BaseComponent);

/**
 * @const
 */
dvt.PanZoomComponent.BOX_SHADOW = 'box-shadow';
/**
 * @const
 */
dvt.PanZoomComponent.CONTROL_PANEL_BEHAVIOR_INIT_COLLAPSED = 'initCollapsed';
/**
 * @const
 */
dvt.PanZoomComponent.CONTROL_PANEL_BEHAVIOR_INIT_EXPANDED = 'initExpanded';
/**
 * @const
 */
dvt.PanZoomComponent.CONTROL_PANEL_BEHAVIOR_HIDDEN = 'hidden';
/**
 * @const
 */
dvt.PanZoomComponent.PAN_ZOOM_KEY = 'panZoomInfo';
/**
 * @const
 */
dvt.PanZoomComponent.SKIN_NAME = 'skin';
/**
 * @const
 * @private
 */
dvt.PanZoomComponent._ATTR_INLINE_STYLE = 'inlineStyle';
/**
 * @const
 * @private
 */
dvt.PanZoomComponent._ATTR_CTRLPANEL_BACKGROUND_COLOR = 'cpBackgroundColor';
/**
 * @const
 * @private
 */
dvt.PanZoomComponent._ATTR_CTRLPANEL_BORDER_COLOR = 'cpBorderColor';
/**
 * @const
 * @private
 */
dvt.PanZoomComponent._ATTR_CTRLPANEL_BOX_SHADOW = 'cpBoxShadow';
/**
 * @const
 * @private
 */
dvt.PanZoomComponent._ATTR_CTRLPANEL_BORDER_RADIUS = 'cpBorderRadius';
/**
 * @const
 * @private
 */
dvt.PanZoomComponent._ATTR_TAB_BG_COLOR_INACTIVE = 'tabBgColorInactive';
/**
 * @const
 * @private
 */
dvt.PanZoomComponent._ATTR_TAB_BORDER_COLOR_INACTIVE = 'tabBorderColorInactive';
/**
 * Disclosed legend event key used for PPR
 * @const
 */
dvt.PanZoomComponent.LEGEND_DISCLOSED_EVENT_KEY = 'isLegendDisclosed';

/**
 * Initializes a component that supports panning and zooming
 * @param {dvt.Context} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @protected
 */
dvt.PanZoomComponent.prototype.Init = function(context, callback, callbackObj) {
  dvt.PanZoomComponent.superclass.Init.call(this, context, callback, callbackObj);
  this._controlPanelBehavior = dvt.PanZoomComponent.CONTROL_PANEL_BEHAVIOR_INIT_COLLAPSED;
  this._displayedControls = dvt.PanZoomCanvas.DEFAULT_DISPLAYED_CONTROLS;
  //IE10, Flash toolkit and FF version 17 do not support vector-effects=non-scaling-stroke so we still need to set stroke width based on zoom
  this._bSupportsVectorEffects = (!dvt.Agent.isEnvironmentBatik() && !dvt.Agent.isPlatformIE() && !(dvt.Agent.isPlatformGecko() && dvt.Agent.getVersion() <= 17));
  this._resourcesMap = null;
  this._subcomponentStyles = null;
  this._skinName = '';
};

/**
 * Returns a numerical state representing the controls that should be displayed in the control panel
 * @return {Number}
 */
dvt.PanZoomComponent.prototype.getDisplayedControls = function() {
  return this._displayedControls;
};

/**
 * Returns the dvt.PanZoomCanvas associated with this component
 * @return {dvt.PanZoomCanvas}
 */
dvt.PanZoomComponent.prototype.getPanZoomCanvas = function() {
  return this._panZoomCanvas;
};
/**
 * Returns a map of the current resources for this component
 * @return {Object}
 */
dvt.PanZoomComponent.prototype.getResourcesMap = function() {
  if (!this._resourcesMap) {
    if (!this.Options)
      this._resourcesMap = {
      };
    else
      this._resourcesMap = this.Options['_resources'];
  }
  return this._resourcesMap;
};

/**
 * Returns the skin name
 * @return {String}
 */
dvt.PanZoomComponent.prototype.getSkinName = function() {
  return this._skinName;
};


/**
 * Returns a map containing style defaults for this component's subcomponents
 * @return {Object}
 */
dvt.PanZoomComponent.prototype.getSubcomponentStyles = function() {
  return this._subcomponentStyles;
};

/**
 * Parses a json object containing styling info for this component
 * @param {Object} jsonObj A JSON object containing styling info
 */
dvt.PanZoomComponent.prototype.parseComponentJson = function(jsonObj) {
  var inlineStyle = new dvt.CSSStyle(jsonObj[dvt.PanZoomComponent._ATTR_INLINE_STYLE]);
  var endGradientColor = inlineStyle.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
  if (endGradientColor)
    this.SetEndGradientColor(endGradientColor);

  var cpStyleMap = new Object();
  var skinName = jsonObj[dvt.PanZoomComponent.SKIN_NAME];
  if (skinName) {
    this._setSkinName(skinName);
    cpStyleMap[dvt.PanZoomComponent.SKIN_NAME] = skinName;

    // control panel, search panel, panel drawer styles
    if (typeof(dvt.PanelDrawer) != 'undefined') { //panel drawer availability indicates that component might use control panel, legend, search or palette
      dvt.StyleUtils.setStyle(cpStyleMap, dvt.CSSStyle.BACKGROUND_COLOR, jsonObj[dvt.PanZoomComponent._ATTR_CTRLPANEL_BACKGROUND_COLOR]);
      dvt.StyleUtils.setStyle(cpStyleMap, dvt.CSSStyle.BORDER_COLOR, jsonObj[dvt.PanZoomComponent._ATTR_CTRLPANEL_BORDER_COLOR]);
      dvt.StyleUtils.setStyle(cpStyleMap, dvt.CSSStyle.BORDER_RADIUS, jsonObj[dvt.PanZoomComponent._ATTR_CTRLPANEL_BORDER_RADIUS]);
      dvt.StyleUtils.setStyle(cpStyleMap, dvt.PanZoomComponent.BOX_SHADOW, jsonObj[dvt.PanZoomComponent._ATTR_CTRLPANEL_BOX_SHADOW]);
      dvt.StyleUtils.setStyle(cpStyleMap, dvt.PanelDrawer.TAB_BG_COLOR_INACTIVE, jsonObj[dvt.PanZoomComponent._ATTR_TAB_BG_COLOR_INACTIVE]);
      dvt.StyleUtils.setStyle(cpStyleMap, dvt.PanelDrawer.TAB_BORDER_COLOR_INACTIVE, jsonObj[dvt.PanZoomComponent._ATTR_TAB_BORDER_COLOR_INACTIVE]);
    }

    //merge skinned styles with defaults
    this.setSubcomponentStyles(DvtControlPanelDefaults.calcOptions(cpStyleMap));
  }
};

/**
 * Parses an xmlNode object containing styling info for this component
 * @param {dvt.XmlNode} xmlNode An xml node containing styling info
 */
dvt.PanZoomComponent.prototype.parseComponentAttrs = function(xmlNode) {
  var inlineStyle = new dvt.CSSStyle(xmlNode.getAttr(dvt.PanZoomComponent._ATTR_INLINE_STYLE));
  var endGradientColor = inlineStyle.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
  if (endGradientColor)
    this.SetEndGradientColor(endGradientColor);

  var cpStyleMap = new Object();
  var skinName = xmlNode.getAttr(dvt.PanZoomComponent.SKIN_NAME);
  if (skinName) {
    this._setSkinName(skinName);
    cpStyleMap[dvt.PanZoomComponent.SKIN_NAME] = skinName;
  }

  // control panel, search panel, panel drawer styles
  if (typeof(dvt.PanelDrawer) != 'undefined') {
    dvt.StyleUtils.setStyle(cpStyleMap, dvt.CSSStyle.BACKGROUND_COLOR, xmlNode.getAttr(dvt.PanZoomComponent._ATTR_CTRLPANEL_BACKGROUND_COLOR));
    dvt.StyleUtils.setStyle(cpStyleMap, dvt.CSSStyle.BORDER_COLOR, xmlNode.getAttr(dvt.PanZoomComponent._ATTR_CTRLPANEL_BORDER_COLOR));
    dvt.StyleUtils.setStyle(cpStyleMap, dvt.CSSStyle.BORDER_RADIUS, xmlNode.getAttr(dvt.PanZoomComponent._ATTR_CTRLPANEL_BORDER_RADIUS));
    dvt.StyleUtils.setStyle(cpStyleMap, dvt.PanZoomComponent.BOX_SHADOW, xmlNode.getAttr(dvt.PanZoomComponent._ATTR_CTRLPANEL_BOX_SHADOW));
    dvt.StyleUtils.setStyle(cpStyleMap, dvt.PanelDrawer.TAB_BG_COLOR_INACTIVE, xmlNode.getAttr(dvt.PanZoomComponent._ATTR_TAB_BG_COLOR_INACTIVE));
    dvt.StyleUtils.setStyle(cpStyleMap, dvt.PanelDrawer.TAB_BORDER_COLOR_INACTIVE, xmlNode.getAttr(dvt.PanZoomComponent._ATTR_TAB_BORDER_COLOR_INACTIVE));
  }

  //merge skinned styles with defaults
  this.setSubcomponentStyles(DvtControlPanelDefaults.calcOptions(cpStyleMap));
};

/**
 * @override
 */
dvt.PanZoomComponent.prototype.render = function(options, width, height) {
  this.Width = width;
  this.Height = height;
  this._isResize = !options;

  // - buttons not responding in firefox if hierarchy viewer present
  //If component is resized before initializing the canvas, don't render the component
  //There is nothing to resize without pan zoom canvas
  if (this.IsResize() && !this.getPanZoomCanvas())
    return;

  this.PreRender();

  // Process data
  if (!this.IsResize()) {
    if (typeof options == 'object')
      this.SetOptions(options);
    else
      this._loadXml(options);
  }

  this.Render(options, width, height);
  this.UpdateAriaAttributes();
};

/**
 * Sets the control panel behavior to initExpanded, initCollapsed (default), or hidden.
 * @param {String} behavior The control panel behavior
 */
dvt.PanZoomComponent.prototype.setControlPanelBehavior = function(behavior) {
  this._controlPanelBehavior = behavior;
};

/**
 * Sets flags for which controls are displayed in the control panel
 * @param {Number} controls The flags representing the displayed controls
 */
dvt.PanZoomComponent.prototype.setDisplayedControls = function(controls) {
  this._displayedControls = controls;
};

/**
 * Returns whether or not the current rendering technology supports vector effects.
 * @return {boolean}
 */
dvt.PanZoomComponent.prototype.supportsVectorEffects = function() {
  return this._bSupportsVectorEffects;
};

/**
 * Returns a control panel for the dvt.PanZoomCanvas
 * @return {dvt.ControlPanel}
 * @protected
 */
dvt.PanZoomComponent.prototype.GetControlPanel = function() {
  var cpBehavior = this.GetControlPanelBehavior();
  if (cpBehavior != dvt.PanZoomComponent.CONTROL_PANEL_BEHAVIOR_HIDDEN) {
    var cpState = (cpBehavior == dvt.PanZoomComponent.CONTROL_PANEL_BEHAVIOR_INIT_COLLAPSED ?
        dvt.ControlPanel.STATE_COLLAPSED : dvt.ControlPanel.STATE_EXPANDED);
    return new dvt.ControlPanel(this.getCtx(), this, cpState);
  } else {
    return null;
  }
};

/**
 * Returns the control panel behavior which is either initExpanded, initCollapsed, or hidden
 * @return {String}
 * @protected
 */
dvt.PanZoomComponent.prototype.GetControlPanelBehavior = function() {
  return this._controlPanelBehavior;
};

/**
 * Returns a component specific xml parser
 * @return {Object}
 * @protected
 */
dvt.PanZoomComponent.prototype.GetXmlDomParser = function() {
  // subclasses should override
  return null;
};

/**
 * Returns a string to xml parser
 * @return {dvt.XmlParser}
 * @protected
 */
dvt.PanZoomComponent.prototype.GetXmlStringParser = function() {
  return new dvt.XmlParser(this.getCtx());
};

/**
 * A hook for handling a canvas pan event
 * @param {dvt.PanEvent} event The pan event sent form the dvt.PanZoomCanvas
 * @protected
 */
dvt.PanZoomComponent.prototype.HandlePanEvent = function(event) {
  // subclasses should override
};

/**
 * A hook for handling a canvas zoom event
 * @param {dvt.ZoomEvent} event The zoom event sent form the dvt.PanZoomCanvas
 * @protected
 */
dvt.PanZoomComponent.prototype.HandleZoomEvent = function(event) {
  // subclasses should override
};

/**
 * Returns whether the current render was caused by a resize event
 * @return {boolean}
 * @protected
 */
dvt.PanZoomComponent.prototype.IsResize = function() {
  return this._isResize;
};

/**
 * A hook for component logic before new data is processed and Render is called
 * @protected
 */
dvt.PanZoomComponent.prototype.PreRender = function() {
  // subclasses should override
};

/**
 * Rendering method called after PreRender and new data is processed
 * @protected
 */
dvt.PanZoomComponent.prototype.Render = function() {
  // Create gradient background for Fusion skin
  if (this._endGradientColor || !this.getSkinName()) {
    if (!this._backgroundPane) {
      this._backgroundPane = new dvt.Rect(this.getCtx(), 0, 0, 0, 0);
      this.addChild(this._backgroundPane);
    }
    this._backgroundPane.setWidth(this.getWidth());
    this._backgroundPane.setHeight(this.getHeight());
    this._backgroundPane.setFill(this._getBackgroundGradient(this._endGradientColor));
  }

  // Create the pan zoom canvas or update its size for a resize event
  if (!this.IsResize()) {
    if (this._panZoomCanvas) {
      this.removeChild(this._panZoomCanvas);
      this._panZoomCanvas = null;
    }

    // Create the pan zoom canvas
    this._panZoomCanvas = new dvt.PanZoomCanvas(this.getCtx(), this.getWidth(), this.getHeight(), this);
    this._panZoomCanvas.addEvtListener(dvt.PanEvent.TYPE, this.HandlePanEvent, false, this);
    this._panZoomCanvas.addEvtListener(dvt.ZoomEvent.TYPE, this.HandleZoomEvent, false, this);
    this.addChild(this._panZoomCanvas);

    // Set up the control panel for the pan zoom canvas
    var controlPanel = this.GetControlPanel();
    if (controlPanel) {
      controlPanel.addEvtListener(DvtControlPanelEvent.TYPE, this._handleControlPanelEvent, false, this);
      this._panZoomCanvas.setControlPanel(controlPanel);
    }
    // Render the control panel and canvas
    this._panZoomCanvas.renderComponent();
  } else {
    this._panZoomCanvas.setSize(this.getWidth(), this.getHeight());
  }
  var clipPath = new dvt.ClipPath('comp');
  clipPath.addRect(this.getTranslateX(), this.getTranslateY(), this.getWidth(), this.getHeight());
  this.setClipPath(clipPath);
};

/**
 * Sets the end color for the background radial gradient.  Component background color should be set in component div.
 * This method is to support Fusion skins with radial gradients that are not supported by browsers.
 * @param {String} endColor The end color for the radial gradient.
 * @protected
 */
dvt.PanZoomComponent.prototype.SetEndGradientColor = function(endColor) {
  this._endGradientColor = endColor;
};

/**
 * @override
 */
dvt.PanZoomComponent.prototype.SetOptions = function(options) {
  this.Options = this.Defaults ? this.Defaults.calcOptions(options) : options;
};

/**
 * Returns a radial gradient fill. Optional end radial gradient color can be provided.
 * @param {String} color The end color to use for the background gradient
 * @return {dvt.RadialGradientFill}
 * @private
 */
dvt.PanZoomComponent.prototype._getBackgroundGradient = function(color) {
  var startColor = '#FFFFFF';
  var midOneColor = '#FFFFFF';
  var midTwoColor = '#AECDEA';
  var endColor = '#7396C8';
  var arColors;
  var bgAlpha = 1;

  if (color && color != endColor) {
    //: get alpha from the given color
    bgAlpha = dvt.ColorUtils.getAlpha(color);

    var rrRatio = (dvt.ColorUtils.getRed(midTwoColor) - dvt.ColorUtils.getRed(endColor)) / (0xff - dvt.ColorUtils.getRed(endColor));
    var ggRatio = (dvt.ColorUtils.getGreen(midTwoColor) - dvt.ColorUtils.getGreen(endColor)) / (0xff - dvt.ColorUtils.getGreen(endColor));
    var bbRatio = (dvt.ColorUtils.getBlue(midTwoColor) - dvt.ColorUtils.getBlue(endColor)) / (0xff - dvt.ColorUtils.getBlue(endColor));
    var rr = dvt.ColorUtils.getRed(color);
    var gg = dvt.ColorUtils.getGreen(color);
    var bb = dvt.ColorUtils.getBlue(color);
    var newRR = Math.round(rr + rrRatio * (0xff - rr));
    var newGG = Math.round(gg + ggRatio * (0xff - gg));
    var newBB = Math.round(bb + bbRatio * (0xff - bb));
    var newColor = dvt.ColorUtils.makeRGB(newRR, newGG, newBB);
    //: make sure to get the RGB (without alpha) from
    //the given color so that the browser doesn't misinterpret the
    //#aarrggbb format (it may assume the color is really #aarrgg)
    var bgRgb = dvt.ColorUtils.getRGB(color);
    arColors = new Array(startColor, midOneColor, newColor, bgRgb);
  }
  else {
    arColors = [startColor, midOneColor, midTwoColor, endColor];
  }

  var arAlphas = [bgAlpha, bgAlpha, bgAlpha, bgAlpha];
  var arStops = [0, 45 / 255, 190 / 255, 1];

  var xx = 0;
  var yy = 0;
  var ww = this.Width;
  var hh = this.Height;
  var n = 1.7;
  var gw = ww * n * n;
  var gh = hh * n;
  var gx = xx + ((ww - gw) / 2);
  var gy = yy - 35;
  var cx = gx + gw / 2;
  var cy = gy + gh / 2;
  //TODO: not sure how to corectly calculate single r for a non-square
  //bounding rect...
  var r = 1.5 * Math.min(gw / 2, gh / 2);
  var arBounds = [gx, gy, gw, gh];

  return new dvt.RadialGradientFill(arColors, arAlphas, arStops, cx, cy, r, arBounds);
};

/**
 * Creates and sends a adfPropertyChange event to the peer for control panel state saving
 * @param {DvtControlPanelEvent} event The event fired by the control panel on collapse/expand
 * @private
 */
dvt.PanZoomComponent.prototype._handleControlPanelEvent = function(event) {
  var spEvent = dvt.EventFactory.newAdfPropertyChangeEvent(dvt.ControlPanel.CONTROL_PANEL_BEHAVIOR_KEY, event.getSubType() == DvtControlPanelEvent.SUBTYPE_SHOW ? dvt.PanZoomComponent.CONTROL_PANEL_BEHAVIOR_INIT_EXPANDED : dvt.PanZoomComponent.CONTROL_PANEL_BEHAVIOR_INIT_COLLAPSED);
  this.dispatchEvent(spEvent);
};

/**
 * Parses an xml string to retrieve rendering data
 * @param {String} xmlString The xml string to parse
 * @private
 */
dvt.PanZoomComponent.prototype._loadXml = function(xmlString) {
  // Don't parse null/empty xml strings coming from resize notify
  if (xmlString == null || xmlString.length == 0)
    return;

  var parser = this.GetXmlStringParser();
  if (parser) {
    var rootXmlNode = parser.parse(xmlString);
    if (rootXmlNode) {
      if (rootXmlNode.getName() === 'r')
        rootXmlNode = rootXmlNode.getFirstChild();

      if (rootXmlNode)
        this.GetXmlDomParser().loadXmlInitial(rootXmlNode);
    }
  }
};

/**
 * Sets the current skin name
 * @param {String} skinName The name of the skin
 * @private
 */
dvt.PanZoomComponent.prototype._setSkinName = function(skinName) {
  this._skinName = skinName;
};

/**
 * Sets the current subcomponent style map
 * @param {Object} styleMap The map of subcomponent style attributes
 */
dvt.PanZoomComponent.prototype.setSubcomponentStyles = function(styleMap) {
  this._subcomponentStyles = styleMap;
};

/**
 * Parses and retrieves numeric max width value from from options and calculates preferred max width
 * @param {string} rawMaxWidthValue max width value passed with options
 * @param {number} availableWidth
 * @return {number} max width value
 * @private
 */
dvt.PanZoomComponent.prototype._getLegendMaxWidthValue = function(rawMaxWidthValue, availableWidth) {
  var maxWidth = availableWidth;
  if (!rawMaxWidthValue)
    return maxWidth;

  maxWidth = dvt.StringUtils.trim(rawMaxWidthValue);
  if (dvt.StringUtils.endsWith(maxWidth, '%')) {
    maxWidth = dvt.StringUtils.trim(maxWidth.replace(/\%$/, ''));
    if (!isNaN(parseFloat(maxWidth))) {
      maxWidth = parseFloat(maxWidth) / 100 * availableWidth;
    }
  }
  else if (dvt.StringUtils.endsWith(maxWidth, 'px')) {
    maxWidth = maxWidth.replace(/px$/, '');
  }

  maxWidth = isNaN(parseFloat(maxWidth)) ? availableWidth : parseFloat(maxWidth);
  return Math.min(maxWidth, availableWidth);
};
// Copyright (c) 2011, 2016, Oracle and/or its affiliates. All rights reserved.
/**
  *  Creates a canvas that supports panning and zooming.
  *  @extends {dvt.Container}
  *  @class dvt.PanZoomCanvas is a platform independent class representing a
  *  pannable, zoomable canvas.
  *  @constructor
  *  @param {dvt.Context} context The context object
  *  @param {number} ww The width of the canvas
  *  @param {number} hh The height of the canvas
  */
dvt.PanZoomCanvas = function(context, ww, hh, view)
{
  this.Init(context, ww, hh, view);
};

dvt.Obj.createSubclass(dvt.PanZoomCanvas, dvt.Container);

dvt.PanZoomCanvas.DEFAULT_PAN_INCREMENT = 15;
dvt.PanZoomCanvas.DEFAULT_ZOOM_INCREMENT = .05;
dvt.PanZoomCanvas.DEFAULT_ANIMATION_DURATION = .5;

dvt.PanZoomCanvas.DEFAULT_DISPLAYED_CONTROLS = dvt.ControlPanel.CONTROLS_ALL;

dvt.PanZoomCanvas.prototype.Init = function(context, ww, hh, view)
{
  dvt.PanZoomCanvas.superclass.Init.call(this, context);

  this._view = view;

  this._ww = ww;
  this._hh = hh;

  this._px = 0;
  this._py = 0;
  this._mx = 0;
  this._my = 0;

  this._minPanX = null;
  this._maxPanX = null;
  this._minPanY = null;
  this._maxPanY = null;
  this._minZoom = .1;
  this._maxZoom = 1;

  this._panIncrement = dvt.PanZoomCanvas.DEFAULT_PAN_INCREMENT;
  this._zoomIncrement = dvt.PanZoomCanvas.DEFAULT_ZOOM_INCREMENT;
  this._bTiltPanningEnabled = false;
  this._zoomToFitPadding = 20;

  this._controlPanel = null;

  this._bPanningEnabled = true;
  this._bZoomingEnabled = true;
  this._bZoomToFitEnabled = true;

  this._backgroundPane = new dvt.Rect(this.getCtx(),
                                     0, 0, this._ww, this._hh);
  this.addChild(this._backgroundPane);
  this._backgroundPane.setInvisibleFill();

  this._contentPane = new dvt.Container(this.getCtx());
  this.addChild(this._contentPane);
  this._contentPane.setMatrix(new dvt.Matrix());

  this._animationDuration = dvt.PanZoomCanvas.DEFAULT_ANIMATION_DURATION;

  this._eventManager = new dvt.PanZoomCanvasEventManager(context, this.FireListener, this);
  this._eventManager.addListeners(this);

  this._clipIdSuffix = 1;
  this.SetClipRect(ww, hh);

  //flag indicating if constraints should be treated as elastic, so that overflow is possible, with bounce back
  this._bElasticConstraints = false;
  //anim for bouncing back elastic constraints
  this._elasticConstraintsAnim = null;
};


/**
 * Sets the pan zoom canvas size with an optional parameter to set a clipPath
 * @param {number} ww The new width of the pan zoom canvas.
 * @param {number} hh The new height of the pan zoom canvas.
 * @param {boolean} bAdjustSizeOnly If true, only the pan zoom canvas size is adjusted and no clip path is set.
 */
dvt.PanZoomCanvas.prototype.setSize = function(ww, hh, bAdjustSizeOnly) {
  this._ww = ww;
  this._hh = hh;
  // Thematic Map uses this method to update canvas width temporarily before a zoom to fit to position the map within
  // a smaller bounds when legend is fixed without actually decreasing the canvas size
  if (!bAdjustSizeOnly) {
    this._backgroundPane.setWidth(ww);
    this._backgroundPane.setHeight(hh);
    //position control panel again, in case it's on the right side for BiDi
    if (this._controlPanel)
      this.PositionControlPanel();
    this.SetClipRect(ww, hh);
  }
};

dvt.PanZoomCanvas.prototype.getSize = function() {
  return new dvt.Dimension(this._ww, this._hh);
};


/**
 *  Sets a clipping region for the panZoomCanvas.
 *  @param {number} ww width
 *  @param {number} hh height
 */
dvt.PanZoomCanvas.prototype.SetClipRect = function(ww, hh) {
  var clipPath = new dvt.ClipPath('pzc');
  clipPath.addRect(this.getTranslateX(), this.getTranslateY(), ww, hh);
  this.setClipPath(clipPath);
};


/**
  * Get the content pane of the canvas.  The content pane is the
  * object that will be panned and zoomed.  Content should be
  * added as a child of the content pane, not the canvas itself.
  * @return {dvt.Container} the content pane of the canvas
  */
dvt.PanZoomCanvas.prototype.getContentPane = function()
{
  return this._contentPane;
};

dvt.PanZoomCanvas.prototype.setContentPane = function(contentPane) {
  this._contentPane = contentPane;
};


/**
  * Get the background pane of the canvas.  The background
  * pane appears behind the content pane, and should be used
  * for styling.
  * @return {dvt.Rect} the background pane of the canvas
  */
dvt.PanZoomCanvas.prototype.getBackgroundPane = function()
{
  return this._backgroundPane;
};


/**
 * Gets the matrix for this pan zoom canvas
 * @param {dvt.Animator} an optional animator which may continue a destination value for this matrix
 * @return {dvt.Matrix} the matrix
 */
dvt.PanZoomCanvas.prototype.getContentPaneMatrix = function(animator) {
  if (animator) {
    var mat = animator.getDestVal(this._contentPane, this._contentPane.getMatrix);
    if (mat) {
      return mat;
    }
  }
  return this._contentPane.getMatrix();
};


/**
  * Get the current zoom level.
  * @param {dvt.Animator} animator (optional) The animator to check for a more current value
  * @return {number} the current zoom level
  */
dvt.PanZoomCanvas.prototype.getZoom = function(animator)
{
  return this.getContentPaneMatrix(animator).getA();
};


/**
  * Get the current horizontal pan position.
  * @param {dvt.Animator} animator (optional) The animator to check for a more current value
  * @return {number} the current horizontal pan position
  */
dvt.PanZoomCanvas.prototype.getPanX = function(animator)
{
  return this.getContentPaneMatrix(animator).getTx();
};


/**
  * Get the current vertical pan position.
  * @param {dvt.Animator} animator (optional) The animator to check for a more current value
  * @return {number} the current vertical pan position
  */
dvt.PanZoomCanvas.prototype.getPanY = function(animator)
{
  return this.getContentPaneMatrix(animator).getTy();
};


/**
  * Set the padding to leave around the content when it is zoomed-to-fit.
  * The default value is 20.
  * @param {number} n new zoom-to-fit padding
  */
dvt.PanZoomCanvas.prototype.setZoomToFitPadding = function(n)
{
  this._zoomToFitPadding = n;
};


/**
  * Get the padding to leave around the content when it is zoomed-to-fit.
  * @return {number} zoom-to-fit padding
  */
dvt.PanZoomCanvas.prototype.getZoomToFitPadding = function()
{
  return this._zoomToFitPadding;
};


/**
  * Pan by the given amount.
  * @param {number} dx horizontal amount to pan by
  * @param {number} dy vertical amount to pan by
  * @param {dvt.Animator} animator optional animator to use to animate the pan
  */
dvt.PanZoomCanvas.prototype.panBy = function(dx, dy, animator)
{
  if (!this.isPanningEnabled()) {
    return;
  }

  var oldX = this.getPanX(animator);
  var oldY = this.getPanY(animator);
  var newX = this.ConstrainPanX(oldX + dx);
  var newY = this.ConstrainPanY(oldY + dy);

  var deltaX = newX - oldX;
  var deltaY = newY - oldY;

  var mat = null;
  if (animator)
  {
    mat = animator.getDestVal(this._contentPane, this._contentPane.getMatrix);
    if (mat)
    {
      mat = mat.clone();
    }
  }
  if (!mat)
  {
    mat = this._contentPane.getMatrix().clone();
  }

  mat.translate(deltaX, deltaY);

  var thisRef = this;
  var fireStartEventFunc = function() {
    thisRef.FirePanEvent(dvt.PanEvent.SUBTYPE_PANNING, newX, newY, oldX, oldY, animator);
  };
  var fireEndEventFunc = function() {
    thisRef.FirePanEvent(dvt.PanEvent.SUBTYPE_PANNED, newX, newY, oldX, oldY, animator);
  };

  if (animator)
  {
    animator.addProp(dvt.Animator.TYPE_MATRIX,
                     this._contentPane,
                     this._contentPane.getMatrix,
                     this._contentPane.setMatrix,
                     mat);
    dvt.Playable.prependOnInit(animator, fireStartEventFunc);
    dvt.Playable.appendOnEnd(animator, fireEndEventFunc);
  }
  else
  {
    fireStartEventFunc();
    this._contentPane.setMatrix(mat);
    fireEndEventFunc();
  }
};


/**
  * Pan to the given position.
  * @param {number} xx horizontal position to pan to
  * @param {number} yy vertical position to pan to
  * @param {dvt.Animator} animator optional animator to use to animate the pan
  */
dvt.PanZoomCanvas.prototype.panTo = function(xx, yy, animator)
{
  if (!this.isPanningEnabled()) {
    return;
  }

  var dx = xx - this.getPanX(animator);
  var dy = yy - this.getPanY(animator);
  this.panBy(dx, dy, animator);
};


/**
  * Zoom by the given amount.
  * @param {number} dz amount to zoom by
  * @param {number} xx horizontal center of zoom (if not specified, treated as the horizontal center of the canvas)
  * @param {number} yy vertical center of zoom (if not specified, treated as the vertical center of the canvas)
  * @param {dvt.Animator} animator optional animator to use to animate the zoom
  */
dvt.PanZoomCanvas.prototype.zoomBy = function(dz, xx, yy, animator)
{
  if (!this.isZoomingEnabled()) {
    return;
  }

  if (!xx && xx !== 0)
  {
    xx = this._ww / 2;
  }
  if (!yy && yy !== 0)
  {
    yy = this._hh / 2;
  }

  var oldZoom = this.getZoom(animator);
  var newZoom = this.ConstrainZoom(oldZoom * dz);
  this.adjustZoomControls(newZoom);

  if (dvt.PanZoomCanvas.RoundFloatForCompare(oldZoom) == dvt.PanZoomCanvas.RoundFloatForCompare(newZoom))
  {
    return;
  }

  var deltaZoom = newZoom / oldZoom;

  var mat = null;
  if (animator)
  {
    mat = animator.getDestVal(this._contentPane, this._contentPane.getMatrix);
    if (mat)
    {
      mat = mat.clone();
    }
  }
  if (!mat)
  {
    mat = this._contentPane.getMatrix().clone();
  }

  // determine the new matrix after zooming
  mat.scale(deltaZoom, deltaZoom, xx, yy);

  // shift the update matrix back into bounds
  var xDiff = this.ConstrainPanX(mat.getTx()) - mat.getTx();
  var yDiff = this.ConstrainPanY(mat.getTy()) - mat.getTy();
  this.FireZoomEvent(dvt.ZoomEvent.SUBTYPE_ADJUST_PAN_CONSTRAINTS, newZoom, oldZoom, animator, null, xx, yy, xDiff, yDiff);

  // shift the update matrix back into bounds again in case the zooming listener changes the pan constraints
  xDiff = this.ConstrainPanX(mat.getTx()) - mat.getTx();
  yDiff = this.ConstrainPanY(mat.getTy()) - mat.getTy();
  mat.translate(xDiff, yDiff);

  var thisRef = this;
  var fireStartEventFunc = function() {
    thisRef.FireZoomEvent(dvt.ZoomEvent.SUBTYPE_ZOOMING, newZoom, oldZoom, animator, null, xx, yy, xDiff, yDiff);
  };
  var fireEndEventFunc = function() {
    //use current zoom level at time of firing event as new zoom level
    //in event, because if continously scrolling the mouse wheel, each
    //zoom animation gets interrupted by the next one, so each event
    //doesn't actually zoom all the way to the desired scale until the
    //last event
    thisRef.FireZoomEvent(dvt.ZoomEvent.SUBTYPE_ZOOMED, thisRef.getZoom(), oldZoom, animator, null, xx, yy, xDiff, yDiff);
  };

  if (animator)
  {
    animator.addProp(dvt.Animator.TYPE_MATRIX,
                     this._contentPane,
                     this._contentPane.getMatrix,
                     this._contentPane.setMatrix,
                     mat);
    dvt.Playable.prependOnInit(animator, fireStartEventFunc);
    dvt.Playable.appendOnEnd(animator, fireEndEventFunc);
  }
  else
  {
    fireStartEventFunc();
    this._contentPane.setMatrix(mat);
    fireEndEventFunc();
  }
};


/**
  * Zoom to the given scale.
  * @param {number} zz new scale
  * @param {number} xx horizontal center of zoom (if not specified, treated as the horizontal center of the canvas)
  * @param {number} yy vertical center of zoom (if not specified, treated as the vertical center of the canvas)
  * @param {dvt.Animator} animator optional animator to use to animate the zoom
  */
dvt.PanZoomCanvas.prototype.zoomTo = function(zz, xx, yy, animator)
{
  if (!this.isZoomingEnabled()) {
    return;
  }

  var dz = zz / this.getZoom(animator);
  this.zoomBy(dz, xx, yy, animator);
};


/**
  * Pan the content pane to be centered in the canvas.
  * @param {dvt.Animator} animator optional animator to use to animate the zoom-to-fit
  * @param {dvt.Rectangle} fitBounds optional bounds in content pane coordinate system to zoom-to-fit to
  */
dvt.PanZoomCanvas.prototype.center = function(animator, fitBounds) {
  var panningEnabled = this.isPanningEnabled();
  this.setPanningEnabled(true);
  var bounds = fitBounds;
  if (!bounds)
    bounds = this._contentPane.getDimensions();

  var cxBounds = (bounds.x + bounds.w / 2) * this.getZoom();
  var cyBounds = (bounds.y + bounds.h / 2) * this.getZoom();
  var dx = (this._ww / 2) - cxBounds;
  var dy = (this._hh / 2) - cyBounds;
  this.panTo(dx, dy, animator);
  this.setPanningEnabled(panningEnabled);
};


/**
  * Zoom and pan the content pane to fit the canvas size.
  * @param {dvt.Animator} animator optional animator to use to animate the zoom-to-fit
  * @param {dvt.Rectangle} fitBounds optional bounds in content pane coordinate system to zoom-to-fit to
  */
dvt.PanZoomCanvas.prototype.zoomToFit = function(animator, fitBounds)
{
  if (!this.isZoomToFitEnabled()) {
    return;
  }

  var panningEnabled = this.isPanningEnabled();
  var zoomingEnabled = this.isZoomingEnabled();
  this.setPanningEnabled(true);
  this.setZoomingEnabled(true);
  try {
    var bounds = fitBounds ? fitBounds : this._contentPane.getDimensions();

    var event = this.FireZoomEvent(dvt.ZoomEvent.SUBTYPE_ZOOM_TO_FIT_CALC_BOUNDS, null, null, animator, bounds);
    bounds = event.getZoomToFitBounds();
    if (!bounds)
      return;

    var dzx = (this._ww - 2 * this._zoomToFitPadding) / (bounds.w);
    var dzy = (this._hh - 2 * this._zoomToFitPadding) / (bounds.h);
    var dz = Math.min(dzx, dzy);
    dz = this.ConstrainZoom(dz);

    var cxBounds = (bounds.x + bounds.w / 2) * dz;
    var cyBounds = (bounds.y + bounds.h / 2) * dz;
    var dx = (this._ww / 2) - cxBounds;
    var dy = (this._hh / 2) - cyBounds;

    var thisRef = this;
    var fireStartEventFunc = function() {
      thisRef.FireZoomEvent(dvt.ZoomEvent.SUBTYPE_ZOOM_TO_FIT_BEGIN, null, null, animator, bounds);
    };
    var fireEndEventFunc = function() {
      thisRef.FireZoomEvent(dvt.ZoomEvent.SUBTYPE_ZOOM_TO_FIT_END, null, null, animator, bounds);
    };

    if (!animator)
      fireStartEventFunc();
    else
      dvt.Playable.prependOnInit(animator, fireStartEventFunc);

    this.zoomTo(dz, 0, 0, animator);
    this.panTo(dx, dy, animator);

    if (animator) {
      dvt.Playable.appendOnEnd(animator, fireEndEventFunc);
    }
    else {
      fireEndEventFunc();
    }
  }
  finally {
    this.setPanningEnabled(panningEnabled);
    this.setZoomingEnabled(zoomingEnabled);
  }
};


/**
  * Calculate the zoom-to-fit scale.
  * @param {dvt.Rectangle} bounds optional bounds in content pane coordinate system to calculate zoom-to-fit scale to
  */
dvt.PanZoomCanvas.prototype.calcZoomToFitScale = function(bounds)
{
  if (!bounds) {
    bounds = this._contentPane.getDimensions();
  }

  var event = this.FireZoomEvent(dvt.ZoomEvent.SUBTYPE_ZOOM_TO_FIT_CALC_BOUNDS, null, null, null, bounds);

  bounds = event.getZoomToFitBounds();

  var dzx = (this._ww - 2 * this._zoomToFitPadding) / (bounds.w);
  var dzy = (this._hh - 2 * this._zoomToFitPadding) / (bounds.h);
  var dz = Math.min(dzx, dzy);
  dz = this.ConstrainZoom(dz);

  return dz;
};


/**
  * Calculate the zoom-to-fit dimensions.
  */
dvt.PanZoomCanvas.prototype.calcZoomToFitBounds = function()
{
  var bounds = this._contentPane.getDimensions();

  var event = this.FireZoomEvent(dvt.ZoomEvent.SUBTYPE_ZOOM_TO_FIT_CALC_BOUNDS, null, null, null, bounds);

  bounds = event.getZoomToFitBounds();

  bounds.x -= this._zoomToFitPadding;
  bounds.y -= this._zoomToFitPadding;
  bounds.w += 2 * this._zoomToFitPadding;
  bounds.h += 2 * this._zoomToFitPadding;

  return bounds;
};


/**
 * Get the current viewport in the coordinate system of the content pane.
 * @return  {dvt.Rectangle}  current viewport
 */
dvt.PanZoomCanvas.prototype.getViewport = function()
{
  var topLeftGlobal = this.localToStage(new dvt.Point(0, 0));
  var bottomRightGlobal = this.localToStage(new dvt.Point(this._ww, this._hh));
  var topLeftLocal = this.getContentPane().stageToLocal(topLeftGlobal);
  var bottomRightLocal = this.getContentPane().stageToLocal(bottomRightGlobal);
  return new dvt.Rectangle(topLeftLocal.x, topLeftLocal.y,
      bottomRightLocal.x - topLeftLocal.x,
      bottomRightLocal.y - topLeftLocal.y);
};


/**
 * @protected
 * Set whether constraints should be elastic, with overflow and bounce back.
 */
dvt.PanZoomCanvas.prototype.SetElasticConstraints = function(bElastic) {
  this._bElasticConstraints = bElastic;

  //if turning on, stop any previously running bounce back anim
  if (bElastic) {
    if (this._elasticConstraintsAnim) {
      if (this._elasticConstraintsAnim.isRunning()) {
        this._elasticConstraintsAnim.stop();
      }
      this._elasticConstraintsAnim = null;
    }
  }
  //if turning off, animate the bounce back to constraint values
  else {
    var currX = this.getPanX();
    var currY = this.getPanY();
    var currZoom = this.getZoom();
    this._bElasticPan = (currX != this.ConstrainPanX(currX) || currY != this.ConstrainPanY(currY));
    this._bElasticZoom = (currZoom != this.ConstrainZoom(currZoom));
    if (this._bElasticPan || this._bElasticZoom) {
      this._elasticConstraintsAnim = new dvt.Animator(this.getCtx(), .4);
      //do cubicOut easing so that the anim happens fast at the beginning and slows down at the end,
      //to make it seem like an elastic
      this._elasticConstraintsAnim.setEasing(dvt.Easing.cubicOut);
      //if zoom beyond constraint, constrain it
      if (this._bElasticZoom) {
        this.zoomBy(1, .5 * this._ww, .5 * this._hh, this._elasticConstraintsAnim);
      }
      //if pan is beyond constraints, constrain it
      if (this._bElasticPan) {
        this.panBy(0, 0, this._elasticConstraintsAnim);
      }

      dvt.Playable.appendOnEnd(this._elasticConstraintsAnim, this._elasticConstraintsAnimOnEnd, this);
      if (this._bElasticPan)
        this.FirePanEvent(dvt.PanEvent.SUBTYPE_ELASTIC_ANIM_BEGIN, null, null, null, null, this._elasticConstraintsAnim);
      if (this._bElasticZoom)
        this.FireZoomEvent(dvt.ZoomEvent.SUBTYPE_ELASTIC_ANIM_BEGIN, null, null, null, null, this._elasticConstraintsAnim);
      this._elasticConstraintsAnim.play();
    }
  }
};


/**
 * @protected
 * Determine whether constraints are elastic, with overflow and bounce back.
 */
dvt.PanZoomCanvas.prototype.IsElasticConstraints = function() {
  return this._bElasticConstraints;
};


/**
 * @private
 */
dvt.PanZoomCanvas.prototype._elasticConstraintsAnimOnEnd = function() {
  this._elasticConstraintsAnim = null;
  if (this._bElasticPan)
    this.FirePanEvent(dvt.PanEvent.SUBTYPE_ELASTIC_ANIM_END);
  if (this._bElasticZoom)
    this.FireZoomEvent(dvt.ZoomEvent.SUBTYPE_ELASTIC_ANIM_END);
};


/**
 * @private
 * Damping function for elastic pan constraints.
 */
dvt.PanZoomCanvas.prototype._panDampingFunc = function(delta, whole) {
  //parabola centered at (0,0) expanding to the right: y ^ 2 = 4 * a * x
  var a = .01 * whole;
  return Math.sqrt(4 * a * delta);
};


/**
 * @private
 * Damping function for elastic zoom constraints.
 */
dvt.PanZoomCanvas.prototype._zoomDampingFunc = function(delta, whole) {
  //parabola centered at (0,0) expanding to the right: y ^ 2 = 4 * a * x
  var a = .002 * whole;
  return Math.sqrt(4 * a * delta);
};


/**
 * @protected
 * Constrain horizontal panning if needed
 * @param {number} xx new horizontal position
 * @return {number} adjusted horizontal position
 */
dvt.PanZoomCanvas.prototype.ConstrainPanX = function(xx)
{
  var offsetX = xx;
  if (this._minPanX != null && offsetX < this._minPanX)
  {
    //if elastic constraints, damp the constraint overflow delta
    if (this.IsElasticConstraints()) {
      var dx = this._minPanX - offsetX;
      offsetX = this._minPanX - this._panDampingFunc(dx, this._ww);
    }
    else {
      offsetX = this._minPanX;
    }
  }
  if (this._maxPanX != null && offsetX > this._maxPanX)
  {
    //if elastic constraints, damp the constraint overflow delta
    if (this.IsElasticConstraints()) {
      var dx = offsetX - this._maxPanX;
      offsetX = this._maxPanX + this._panDampingFunc(dx, this._ww);
    }
    else {
      offsetX = this._maxPanX;
    }
  }
  return offsetX;
};


/**
 * @protected
 * Constrain vertical panning if needed
 * @param {number} xx new vertical position
 * @return {number} adjusted vertical position
 */
dvt.PanZoomCanvas.prototype.ConstrainPanY = function(yy)
{
  var offsetY = yy;
  if (this._minPanY != null && offsetY < this._minPanY)
  {
    //if elastic constraints, damp the constraint overflow delta
    if (this.IsElasticConstraints()) {
      var dy = this._minPanY - offsetY;
      offsetY = this._minPanY - this._panDampingFunc(dy, this._hh);
    }
    else {
      offsetY = this._minPanY;
    }
  }
  if (this._maxPanY != null && offsetY > this._maxPanY)
  {
    //if elastic constraints, damp the constraint overflow delta
    if (this.IsElasticConstraints()) {
      var dy = offsetY - this._maxPanY;
      offsetY = this._maxPanY + this._panDampingFunc(dy, this._hh);
    }
    else {
      offsetY = this._maxPanY;
    }
  }
  return offsetY;
};


/**
 * Applies zoom constraints to the specified zoom level
 *
 * @param {number} zz the specified zoom level
 *
 * @return {number} the constrained zoom level
 * @protected
 */
dvt.PanZoomCanvas.prototype.ConstrainZoom = function(zz)
{
  var newZ = Math.max(0, zz); // zoom can't be negative
  if (this._minZoom && newZ < this._minZoom)
  {
    //if elastic constraints, damp the constraint overflow delta
    if (this.IsElasticConstraints()) {
      var dz = this._minZoom - newZ;
      newZ = this._minZoom - this._zoomDampingFunc(dz, this._maxZoom - this._minZoom); //TO DO: what if no min/max?
    }
    else {
      newZ = this._minZoom;
    }
  }
  if (this._maxZoom && newZ > this._maxZoom)
  {
    //if elastic constraints, damp the constraint overflow delta
    if (this.IsElasticConstraints()) {
      var dz = newZ - this._maxZoom;
      newZ = this._maxZoom + this._zoomDampingFunc(dz, this._maxZoom - this._minZoom); //TO DO: what if no min/max?
    }
    else {
      newZ = this._maxZoom;
    }
  }
  return newZ;
};

dvt.PanZoomCanvas.RoundFloatForCompare = function(n)
{
  return Math.round(n * 100000);
};

dvt.PanZoomCanvas.prototype.renderComponent = function() {
  var controlPanel = this.getControlPanel();
  if (controlPanel) {
    this.addChild(controlPanel);
    this.PositionControlPanel();
    controlPanel.renderComponent();
  }
};

dvt.PanZoomCanvas.prototype.setControlPanel = function(controlPanel) {
  this._controlPanel = controlPanel;
};

/**
 * Returns the Control panel component
 * @return {dvt.ControlPanel} Control panel component
 */
dvt.PanZoomCanvas.prototype.getControlPanel = function() {
  return this._controlPanel;
};


/**
 * @protected
 * Positions Control panel in a component viewport
 */
dvt.PanZoomCanvas.prototype.PositionControlPanel = function() {
  var styleMap = this._view.getSubcomponentStyles();
  var posX = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_PADDING_SIDE, 0);
  var posY = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_PADDING_TOP, 0);

  var openCloseButtonWidth = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_OPEN_CLOSE_BUTTON_WIDTH, 0);
  var transX;
  if (dvt.Agent.isRightToLeft(this.getCtx())) {
    transX = this._ww - openCloseButtonWidth - posX;
  }
  else {
    transX = posX;
  }
  this._controlPanel.setTranslate(transX, posY);
};


/**
 * @protected
 * Get the position relative to the stage of the given mouse event.
 * @param {object} event mouse event
 * @return {dvt.Point}
 */
dvt.PanZoomCanvas.prototype.GetRelativeMousePosition = function(event) {
  return this.getCtx().pageToStageCoords(event.pageX, event.pageY);
};


/**
 * @protected
 */
dvt.PanZoomCanvas.prototype.FirePanEvent = function(subType, newX, newY, oldX, oldY, animator)
{
  var panEvent = new dvt.PanEvent(subType, newX, newY, oldX, oldY, animator);
  this.FireListener(panEvent);
};


/**
 * Fires a dvt.ZoomEvent to listeners
 *
 * @param {string}  subType  subtype of the event
 * @param {number}  newZoom  new zoom factor
 * @param {number}  oldZoom  old zoom factor
 * @param {dvt.Animator}  animator  optional animator used to animate the zoom
 * @param {dvt.Rectangle}  zoomToFitBounds  bounds to use for zoom-to-fit
 * @param {number}  xx  horizontal center of zoom
 * @param {number}  yy  vertical center of zoom
 * @param {number}  tx  the horizontal translation applied after the zoom
 * @param {number}  ty  the vertical translation applied after the zoom
 * @protected
 */
dvt.PanZoomCanvas.prototype.FireZoomEvent = function(subType, newZoom, oldZoom, animator, zoomToFitBounds, xx, yy, tx, ty)
{
  var zoomEvent = new dvt.ZoomEvent(subType, newZoom, oldZoom, animator, zoomToFitBounds, new dvt.Point(xx, yy), tx, ty);
  this.FireListener(zoomEvent);
  return zoomEvent;
};


dvt.PanZoomCanvas.prototype.zoomAndCenter = function() {
  this.FireZoomEvent(dvt.ZoomEvent.SUBTYPE_ZOOM_AND_CENTER);
};


/**
 * Get the next incremental, increasing, zoom level.
 *
 * @param currZoom current zoom level
 *
 * @return next zoom level
 */
dvt.PanZoomCanvas.prototype.getNextZoomLevel = function(currZoom) {
  var zoomLevel = currZoom;

  zoomLevel += this.getZoomIncrement();
  if (zoomLevel > this.getMaxZoom())
    zoomLevel = this.getMaxZoom();

  return zoomLevel;
};


/**
 * Get the previous incremental, decreasing, zoom level.
 *
 * @param currZoom current zoom level
 *
 * @return previous zoom level
 */
dvt.PanZoomCanvas.prototype.getPrevZoomLevel = function(currZoom) {
  var zoomLevel = currZoom;

  zoomLevel -= this.getZoomIncrement();
  if (zoomLevel < this.getMinZoom())
    zoomLevel = this.getMinZoom();

  return zoomLevel;
};


/**
 * Set the increment to use for zooming.
 * The increment should be a percentage between 0 and 1.
 * The default is .05.
 *
 * @param n zoom increment
 */
dvt.PanZoomCanvas.prototype.setZoomIncrement = function(n) {
  this._zoomIncrement = n;
};


/**
 * Get the increment to use for zooming.
 *
 * @return zoom increment
 */
dvt.PanZoomCanvas.prototype.getZoomIncrement = function() {
  return this._zoomIncrement;
};


/**
 * Set the increment to use for panning.
 * The increment should be in pixels.
 * The default is 15.
 *
 * @param n pan increment
 */
dvt.PanZoomCanvas.prototype.setPanIncrement = function(n) {
  this._panIncrement = n;
};


/**
 * Get the increment to use for panning.
 *
 * @return pan increment
 */
dvt.PanZoomCanvas.prototype.getPanIncrement = function() {
  return this._panIncrement;
};


/**
 * Set the minimum zoom factor allowed.
 * The default is .1.
 *
 * @param n minimum zoom factor
 */
dvt.PanZoomCanvas.prototype.setMinZoom = function(n) {
  this._minZoom = n;
};


/**
 * Get the minimum zoom factor allowed.
 *
 * @return minimum zoom factor
 */
dvt.PanZoomCanvas.prototype.getMinZoom = function() {
  return this._minZoom;
};


/**
 * Set the maximum zoom factor allowed.
 *
 * @param n maximum zoom factor
 */
dvt.PanZoomCanvas.prototype.setMaxZoom = function(n) {
  if (n < 0)
    n = 1;
  this._maxZoom = n;
};


/**
 * Get the maximum zoom factor allowed.
 *
 * @return maximum zoom factor
 */
dvt.PanZoomCanvas.prototype.getMaxZoom = function() {
  return this._maxZoom;
};


/**
 * Set the minimum x coord allowed.
 * The default is NaN, meaning there is no minimum.
 *
 * @param n minimum x coord
 */
dvt.PanZoomCanvas.prototype.setMinPanX = function(n) {
  this._minPanX = n;
};


/**
 * Get the minimum x coord allowed.
 *
 * @return minimum x coord
 */
dvt.PanZoomCanvas.prototype.getMinPanX = function() {
  return this._minPanX;
};


/**
 * Set the maximum x coord allowed.
 * The default is NaN, meaning there is no maximum.
 *
 * @param n maximum x coord
 */
dvt.PanZoomCanvas.prototype.setMaxPanX = function(n) {
  this._maxPanX = n;
};


/**
 * Get the maximum x coord allowed.
 *
 * @return maximum x coord
 */
dvt.PanZoomCanvas.prototype.getMaxPanX = function() {
  return this._maxPanX;
};


/**
 * Set the minimum y coord allowed.
 * The default is NaN, meaning there is no minimum.
 *
 * @param n minimum y coord
 */
dvt.PanZoomCanvas.prototype.setMinPanY = function(n) {
  this._minPanY = n;
};


/**
 * Get the minimum y coord allowed.
 *
 * @return minimum y coord
 */
dvt.PanZoomCanvas.prototype.getMinPanY = function() {
  return this._minPanY;
};


/**
 * Set the maximum y coord allowed.
 * The default is NaN, meaning there is no maximum.
 *
 * @param n maximum y coord
 */
dvt.PanZoomCanvas.prototype.setMaxPanY = function(n) {
  this._maxPanY = n;
};


/**
 * Get the maximum y coord allowed.
 *
 * @return maximum y coord
 */
dvt.PanZoomCanvas.prototype.getMaxPanY = function() {
  return this._maxPanY;
};


/**
 * Set whether tilt panning is enabled.
 *
 * @param b true to enable tilt panning, false to disable it
 */
dvt.PanZoomCanvas.prototype.setTiltPanningEnabled = function(b) {
  this._bTiltPanningEnabled = b;
};


/**
 * Determine whether tilt panning is enabled.
 *
 * @return true if tilt panning is enabled, false if disabled
 */
dvt.PanZoomCanvas.prototype.isTiltPanningEnabled = function(b) {
  return this._bTiltPanningEnabled;
};


/**
 * Sets the animation duration (in seconds) for zoom interactions
 *
 * @param animationDuration the animation duration (in seconds)
 */
dvt.PanZoomCanvas.prototype.setAnimationDuration = function(animationDuration) {
  this._animationDuration = animationDuration;
};


/**
 * Gets the animation duration (in seconds) for zoom interactions
 *
 * @return the animation duration (in seconds)
 */
dvt.PanZoomCanvas.prototype.getAnimationDuration = function() {
  return this._animationDuration;
};

dvt.PanZoomCanvas.prototype.setPanningEnabled = function(panningEnabled) {
  this._bPanningEnabled = panningEnabled;
};

dvt.PanZoomCanvas.prototype.isPanningEnabled = function() {
  return this._bPanningEnabled;
};

dvt.PanZoomCanvas.prototype.setZoomingEnabled = function(zoomingEnabled) {
  this._bZoomingEnabled = zoomingEnabled;
};

dvt.PanZoomCanvas.prototype.isZoomingEnabled = function() {
  return this._bZoomingEnabled;
};

dvt.PanZoomCanvas.prototype.setZoomToFitEnabled = function(zoomToFitEnabled) {
  this._bZoomToFitEnabled = zoomToFitEnabled;
};

dvt.PanZoomCanvas.prototype.isZoomToFitEnabled = function() {
  return this._bZoomToFitEnabled;
};

dvt.PanZoomCanvas.prototype.adjustZoomControls = function(next) {
  if (this._controlPanel) {
    var currZoom = this.getZoom();

    if (next == this.getMinZoom() && next == this.getMaxZoom()) {
      this._controlPanel.enableZoomInControl(false);
      this._controlPanel.enableZoomOutControl(false);
    }
    else if (currZoom <= next && next == this.getMaxZoom()) {
      this._controlPanel.enableZoomInControl(false);
      this._controlPanel.enableZoomOutControl(true);
    }
    else if (currZoom >= next && next == this.getMinZoom()) {
      this._controlPanel.enableZoomInControl(true);
      this._controlPanel.enableZoomOutControl(false);
    }
    else {
      this._controlPanel.enableZoomInControl(true);
      this._controlPanel.enableZoomOutControl(true);
    }
  }
};


/**
 * Stores current touch targets (for zoom events)
 * @param {array} targets an array of the current touch targets
 */
dvt.PanZoomCanvas.prototype.setCurrentTouchTargets = function(targets) {
  this._currTargets = targets;
};


/**
 * Returns current touch targets (for zoom events)
 * @return {array} an array of the current touch targets
 */
dvt.PanZoomCanvas.prototype.getCurrentTouchTargets = function() {
  return this._currTargets;
};


/**
 * Resets touch info, touch map and timers. The method is called after DnD event when touches stored by dvt.PanZoomCanvasEventManager become irrelevant.
 */
dvt.PanZoomCanvas.prototype.resetTouchTargets = function() {
  if (dvt.Agent.isTouchDevice()) {
    this._currTargets = null;
    this._eventManager.TouchManager.reset();
  }
};

/**
 * Ends pan zoom operations
 */
dvt.PanZoomCanvas.prototype.panZoomEnd = function() {
  // Fix for the  - ie9/10 initiate dnd then release, diagram snaps to mouse position
  // When AFBlockingGlassPane is added the mouseover events are not comming at the right time. The mouseout and subsequent mouseup are lost.
  // To fix the behavior this method is called by the component when DnD is initiated to compensate the absence of mouseout events.
  this._eventManager.PanZoomEnd();
};

/**
 * Enables/disables user interaction
 * @param {boolean} bEnabled True to enable interaction
 */
dvt.PanZoomCanvas.prototype.setInteractionEnabled = function(bEnabled) {
  if (!bEnabled)
    this._eventManager.removeListeners(this);
  else
    this._eventManager.addListeners(this);
};
// Copyright (c) 2011, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 * @constructor
 * @param {dvt.Context} context The rendering context
 * @param {function} callback The callback for this dvt.PanZoomCanvasEventManager
 * @param {Object} callbackObj The callback object for this dvt.PanZoomCanvasEventManager
 */
dvt.PanZoomCanvasEventManager = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

dvt.Obj.createSubclass(dvt.PanZoomCanvasEventManager, dvt.EventManager);

/**
 * @const
 */
dvt.PanZoomCanvasEventManager.EVENT_INFO_PANNED_KEY = 'panned';

/**
 * @param {dvt.Context} context The rendering context
 * @param {function} callback The callback for this dvt.PanZoomCanvasEventManager
 * @param {Object} callbackObj The callback object for this dvt.PanZoomCanvasEventManager
 * @protected
 */
dvt.PanZoomCanvasEventManager.prototype.Init = function(context, callback, callbackObj) {
  dvt.PanZoomCanvasEventManager.superclass.Init.call(this, context, callback, callbackObj);
  this._pzc = callbackObj;
  this._zoomAnimator = null;
  this._bPanning = false;
  this._bPanned = false;
  this._bZooming = false;
  this._bDragging = false;
  //momentum-based panning (turned on for both touch and desktop)
  this._bMomentumPanning = true;//dvt.Agent.isTouchDevice();
};

/**
 * Key used saving panning touch events in the touch manager
 * @private
 */
dvt.PanZoomCanvasEventManager._PAN_TOUCH_KEY = 'panTouch';
/**
 * Key used saving zooming touch events in the touch manager
 * @private
 */
dvt.PanZoomCanvasEventManager._ZOOM_TOUCH_KEY = 'zoomTouch';
/**
 * Used for the momentum timer interval
 * @private
 */
dvt.PanZoomCanvasEventManager._MOMENTUM_START_TIMER_INTERVAL = 50;


/**
 * @override
 */
dvt.PanZoomCanvasEventManager.prototype.addListeners = function(displayable) {
  dvt.PanZoomCanvasEventManager.superclass.addListeners.call(this, displayable);
  displayable.addEvtListener(dvt.MouseEvent.MOUSEWHEEL, this.OnMouseWheel, false, this);
};


/**
 * @override
 */
dvt.PanZoomCanvasEventManager.prototype.removeListeners = function(displayable) {
  dvt.PanZoomCanvasEventManager.superclass.removeListeners.call(this, displayable);
  displayable.removeEvtListener(dvt.MouseEvent.MOUSEWHEEL, this.OnMouseWheel, false, this);
};


/**
 * @override
 */
dvt.PanZoomCanvasEventManager.prototype.OnMouseDown = function(event) {
  this._bDragging = false;
  this._bPanned = false;
  if (event.button != dvt.MouseEvent.RIGHT_CLICK_BUTTON) {
    var pos = this._callbackObj.GetRelativeMousePosition(event);
    this._mx = pos.x;
    this._my = pos.y;
    this._px = this._mx;
    this._py = this._my;
    this._bDown = true;

    //for elastic constraints, save the original values
    this._origPanX = this._callbackObj.getPanX();
    this._origPanY = this._callbackObj.getPanY();
    this._origZoom = this._callbackObj.getZoom();

    if (this._bMomentumPanning) {
      //save current time for momentum-based panning
      this._currTime = new Date().getTime();
    }
  }
  //if momentum panning was running, stop it
  if (this._momentumTimer && this._momentumTimer.isRunning()) {
    this._momentumTimer.stop();
    this._momentumTimer.reset();
  }
};

/**
 * @override
 */
dvt.PanZoomCanvasEventManager.prototype.OnMouseMove = function(event) {
  if (this._bDown) {
    this._bDragging = true;
    var pos = this._callbackObj.GetRelativeMousePosition(event);
    var xx = pos.x;
    var yy = pos.y;

    if (event.ctrlKey) {
      if (!this._bZooming) {
        this._callback.call(this._callbackObj, new dvt.ZoomEvent(dvt.ZoomEvent.SUBTYPE_DRAG_ZOOM_BEGIN));
        this._bZooming = true;
        if (this._pzc.getControlPanel()) {
          this._pzc.getControlPanel().mouseDragPanningStarted();
        }
        //turn on elastic constraints for the duration of this drag
        this._callbackObj.SetElasticConstraints(true);
      }
      //for elastic constraints, use a zoomTo so that the delta is relative to the mouseDown point,
      //resulting in more consistent values and smoother elastic animation
      //var dz = 1 + (this._my - yy) / 100;
      //to emulate the behavior from the line above, which scaled by 1% for each pixel, need to
      //take that 1% with the correct sign and raise it to the power of the total number of pixels moved
      var sign = (this._py >= yy) ? 1 : -1;
      var zz = this._origZoom * Math.pow(1 + sign * .01, Math.abs(this._py - yy));
      if (!this._callbackObj.isPanningEnabled()) {
        //this._callbackObj.zoomBy(dz, null, null);
        this._callbackObj.zoomTo(zz, null, null);
      }
      else {
        //this._callbackObj.zoomBy(dz, this._px, this._py);
        this._callbackObj.zoomTo(zz, this._px, this._py);
      }
    }
    else {
      this._handlePanMove(xx, yy);
    }

    this._mx = xx;
    this._my = yy;
  }
};

/**
 * @override
 */
dvt.PanZoomCanvasEventManager.prototype.OnMouseUp = function(event) {
  this._bDown = false;
  this._bDragging = false;

  if (this._bPanning) {
    this._handlePanEnd();
  }
  if (this._bZooming) {
    this._handleZoomEnd();
  }
  dvt.PanZoomCanvasEventManager.superclass.OnMouseUp.call(this, event);
};

/**
 * @override
 */
dvt.PanZoomCanvasEventManager.prototype.OnClick = function(event) {
  if (this._bDragging || this._bPanned) {
    this._bDragging = false;
    this._bPanned = false;
    dvt.EventManager.consumeEvent(event);
  }
};

/**
 * @override
 */
dvt.PanZoomCanvasEventManager.prototype.OnMouseOut = function(event) {
  // simulate mouse up event if needed
  if (this._bDown && (this._bPanning || this._bZooming)) {
    if (!event.relatedTarget || event.relatedTarget == null) {
      this.OnMouseUp(event);
    }
  }

  dvt.PanZoomCanvasEventManager.superclass.OnMouseOut.call(this, event);
};

/**
 * @protected
 * Handler for the mouse wheel event
 * @param {dvt.MouseEvent} event mouse wheel event
 */
dvt.PanZoomCanvasEventManager.prototype.OnMouseWheel = function(event) {
  if (!event.wheelDelta || event.wheelDelta === 0 || !this._callbackObj.isZoomingEnabled()) {
    return;
  }

  var currZoom = this._callbackObj.getZoom();
  //TODO: re-enable animation after fixing how it works in conjunction with overview window
  var animator = null;//new dvt.Animator(this.getCtx(), this.getAnimationDuration());
  //if there is already a zoom animator running, clean it up
  if (this._zoomAnimator) {
    var oldZoomAnim = this._zoomAnimator;
    //stop the old animator
    this._zoomAnimator.stop();
    //get the destination zoom level of the old animator so that we can add to it
    currZoom = this._callbackObj.getZoom(oldZoomAnim);
    this._zoomAnimator = null;
    oldZoomAnim = null;

    //change the easing function so that it's fast at the start to
    //blend in more seamlessly with the animation we just stopped
    //partway through
    if (animator) {
      animator.setEasing(dvt.Easing.cubicOut);
    }
  }
  this._zoomAnimator = animator;

  var delta = event.wheelDelta;
  //reverse the sign of the delta in Firefox so that mouse wheel up zooms in and mouse wheel down zooms out
  if (dvt.Agent.isPlatformGecko()) {
    delta = -delta;
  }

  //: divide by the absolute value of the delta so that the zoom only changes by the increment,
  //just like in native Flash
  var zz = currZoom * (1 + this._callbackObj.getZoomIncrement() * delta / Math.abs(delta));
  var pos = this._callbackObj.GetRelativeMousePosition(event);

  //cancel the mouse wheel event so that the browser doesn't scroll the page
  var docUtils = this.getCtx().getDocumentUtils();
  docUtils.cancelDomEvent(event);

  //elastic constraints don't work right for mouse wheel zooming
  //(cause errors when zooming out in zooming.jspx Diagram demo page)
  //this._callbackObj.SetElasticConstraints(true);
  if (!this._callbackObj.isPanningEnabled()) {
    this._callbackObj.zoomTo(zz, null, null, this._zoomAnimator);
  }
  else {
    this._callbackObj.zoomTo(zz, pos.x, pos.y, this._zoomAnimator);
  }
  //this._callbackObj.SetElasticConstraints(false);

  if (this._zoomAnimator) {
    dvt.Playable.appendOnEnd(this._zoomAnimator, this._clearZoomAnimator, this);
    this._zoomAnimator.play();
  }
};

/**
 * Clears the zoom animator
 * @private
 */
dvt.PanZoomCanvasEventManager.prototype._clearZoomAnimator = function() {
  this._zoomAnimator = null;
};

/**
 * Handles events for the momentum start timer
 * @private
 */
dvt.PanZoomCanvasEventManager.prototype._handleMomentumStartTimer = function() {
  //do nothing
};

/**
 * Handles events for the momentum timer
 * @private
 */
dvt.PanZoomCanvasEventManager.prototype._handleMomentumTimer = function() {
  //percent to slow down momentum each iteration
  var fraction = .04;//.02;
  //quadratic damping function
  var ratio = 1 - fraction * this._momentumIterCount;
  ratio *= ratio;
  var interval = this._momentumTimer.getInterval();//dvt.PanZoomCanvasEventManager._MOMENTUM_START_TIMER_INTERVAL;
  //deltas to pan by for this iteration
  var dx = ratio * this._momentumXperMS * interval;
  var dy = ratio * this._momentumYperMS * interval;
  //add deltas to accumulated values
  this._momentumDx += dx;
  this._momentumDy += dy;
  //add accumulated deltas to the last drag pan position
  var newX = this._origPanX + this._mx - this._px + this._momentumDx;
  var newY = this._origPanY + this._my - this._py + this._momentumDy;
  this._callbackObj.panTo(newX, newY);
  var bStop = false;
  //stop just before ratio goes to 0
  if (this._momentumIterCount >= (1 / fraction) - 1) {
    bStop = true;
  }
  else {
    //stop if we've hit elastic constraints
    var currX = this._callbackObj.getPanX();
    var currY = this._callbackObj.getPanY();
    //if the difference between the desired and actual pan positions is greater than the delta for this timer
    //iteration, we must be hitting the elastic constraints, so stop iterating
    if (Math.abs(currX - newX) > Math.abs(dx) || Math.abs(currY - newY) > Math.abs(dy)) {
      bStop = true;
    }
  }

  if (bStop) {
    this._momentumTimer.stop();
    this._momentumTimer.reset();
    //turn off elastic constraints when momentum stops
    this._callbackObj.SetElasticConstraints(false);
  }
  else {
    this._momentumIterCount++;
  }
};


/**
 * @override
 */
dvt.PanZoomCanvasEventManager.prototype.HandleImmediateTouchStartInternal = function(event) {
  if (this._callbackObj.isZoomingEnabled())
    this.TouchManager.processAssociatedTouchAttempt(event, dvt.PanZoomCanvasEventManager._ZOOM_TOUCH_KEY, this.ZoomStartTouch, this);

  if (this._callbackObj.isPanningEnabled())
    this.TouchManager.processAssociatedTouchAttempt(event, dvt.PanZoomCanvasEventManager._PAN_TOUCH_KEY, this.PanStartTouch, this);
};


/**
 * @override
 */
dvt.PanZoomCanvasEventManager.prototype.HandleImmediateTouchMoveInternal = function(event) {
  if (this._callbackObj.isZoomingEnabled())
    this.TouchManager.processAssociatedTouchMove(event, dvt.PanZoomCanvasEventManager._ZOOM_TOUCH_KEY);

  if (this._callbackObj.isPanningEnabled())
    this.TouchManager.processAssociatedTouchMove(event, dvt.PanZoomCanvasEventManager._PAN_TOUCH_KEY);

  //  Only prevent default browser behavior if panning or zooming is enabled
  if (this._callbackObj.isZoomingEnabled() || this._callbackObj.isPanningEnabled())
    event.preventDefault();
};


/**
 * @override
 */
dvt.PanZoomCanvasEventManager.prototype.HandleImmediateTouchEndInternal = function(event) {
  if (this._callbackObj.isZoomingEnabled())
    this.TouchManager.processAssociatedTouchEnd(event, dvt.PanZoomCanvasEventManager._ZOOM_TOUCH_KEY);

  if (this._callbackObj.isPanningEnabled())
    this.TouchManager.processAssociatedTouchEnd(event, dvt.PanZoomCanvasEventManager._PAN_TOUCH_KEY);
};


/**
 * Handles zoom start for touch device
 * @param {dvt.TouchEvent} event Touch event to handle
 * @param {dvt.Touch} touch Touch object for the event
 * @protected
 */
dvt.PanZoomCanvasEventManager.prototype.ZoomStartTouch = function(event, touch) {
  var touchIds = this.TouchManager.getTouchIdsForObj(dvt.PanZoomCanvasEventManager._ZOOM_TOUCH_KEY);
  if (touchIds.length <= 1) {
    this.TouchManager.saveProcessedTouch(touch.identifier, dvt.PanZoomCanvasEventManager._ZOOM_TOUCH_KEY, null, dvt.PanZoomCanvasEventManager._ZOOM_TOUCH_KEY, dvt.PanZoomCanvasEventManager._ZOOM_TOUCH_KEY, this.ZoomMoveTouch, this.ZoomEndTouch, this);
    this._mx = touch.pageX;
    this._my = touch.pageY;
    this._px = this._mx;
    this._py = this._my;

    //for elastic constraints, save the original values
    this._origPanX = this._callbackObj.getPanX();
    this._origPanY = this._callbackObj.getPanY();
    this._origZoom = this._callbackObj.getZoom();

    //: save the original finger distance
    this._origDist = null;
    touchIds = this.TouchManager.getTouchIdsForObj(dvt.PanZoomCanvasEventManager._ZOOM_TOUCH_KEY);
    this._callbackObj.setCurrentTouchTargets(this.TouchManager.getStartTargetsByIds(touchIds));
  }

  //if momentum panning was running, stop it
  if (this._momentumTimer && this._momentumTimer.isRunning()) {
    this._momentumTimer.stop();
    this._momentumTimer.reset();
  }
};


/**
 * Handles zoom move for touch device
 * @param {dvt.TouchEvent} event Touch event to handle
 * @param {dvt.Touch} touch Touch object for the event
 * @protected
 */
dvt.PanZoomCanvasEventManager.prototype.ZoomMoveTouch = function(event, touch) {
  var touchIds = this.TouchManager.getTouchIdsForObj(dvt.PanZoomCanvasEventManager._ZOOM_TOUCH_KEY);
  if (touchIds.length == 2) {
    var data = this.TouchManager.getMultiTouchData(touchIds);
    if (data) {
      // set a flag so we won't try to pan while zooming
      if (!this._bZooming) {
        this._bZooming = true;
        this.TouchManager.blockTouchHold();
        this._callback.call(this._callbackObj, new dvt.ZoomEvent(dvt.ZoomEvent.SUBTYPE_DRAG_ZOOM_BEGIN));

        if (this._pzc.getControlPanel())
          this._pzc.getControlPanel().mouseDragPanningStarted();
      }
      //turn on elastic constraints for the duration of this drag
      this._callbackObj.SetElasticConstraints(true);

      //:
      //the original distance should be the current distance minus the current delta distance
      if (this._origDist == null) {
        this._origDist = data.dist - data.dz;
      }
      //the new zoom should be the original zoom multiplied by the ratio of current finger distance to original
      //finger distance (e.g. if you move your fingers twice as far apart as they originally were, the view should
      //zoom by a factor of 2)
      var zz = this._origZoom * (data.dist / this._origDist);
      //the center point of the zoom needs to be converted to stage-relative coords
      var cp = this._pzc.getCtx().pageToStageCoords(data.cx, data.cy);

      this.hideTooltip();
      this._callbackObj.setCurrentTouchTargets(this.TouchManager.getStartTargetsByIds(touchIds));
      this._callbackObj.zoomTo(zz, cp.x, cp.y);
      //the center point delta is in page coords, which should be okay for panning
      this._callbackObj.panBy(data.dcx, data.dcy);
    }
  }

};


/**
 * Handles zoom end for touch device
 * @param {dvt.TouchEvent} event Touch event to handle
 * @param {dvt.Touch} touch Touch object for the event
 * @protected
 */
dvt.PanZoomCanvasEventManager.prototype.ZoomEndTouch = function(event, touch) {
  if (this._bZooming) {
    //: clear the original finger distance
    this._origDist = null;
    this.TouchManager.unblockTouchHold();
    this._handleZoomEnd();
  }
  var touchIds = this.TouchManager.getTouchIdsForObj(dvt.PanZoomCanvasEventManager._ZOOM_TOUCH_KEY);
  this._callbackObj.setCurrentTouchTargets(this.TouchManager.getStartTargetsByIds(touchIds));
  if (touchIds.length == 0)
    this._callback.call(this._callbackObj, new dvt.ZoomEvent(dvt.ZoomEvent.SUBTYPE_ZOOM_END));
};

/**
 * Handles pan start for touch device
 * @param {dvt.TouchEvent} event Touch event to handle
 * @param {dvt.Touch} touch Touch object for the event
 * @protected
 */
dvt.PanZoomCanvasEventManager.prototype.PanStartTouch = function(event, touch) {
  if (!this._bZooming) {
    var touchIds = this.TouchManager.getTouchIdsForObj(dvt.PanZoomCanvasEventManager._PAN_TOUCH_KEY);
    if (touchIds.length <= 1) {
      this.TouchManager.saveProcessedTouch(touch.identifier, dvt.PanZoomCanvasEventManager._PAN_TOUCH_KEY, null, dvt.PanZoomCanvasEventManager._PAN_TOUCH_KEY, dvt.PanZoomCanvasEventManager._PAN_TOUCH_KEY, this.PanMoveTouch, this.PanEndTouch, this);
      this._mx = touch.pageX;
      this._my = touch.pageY;
      this._px = this._mx;
      this._py = this._my;

      //for elastic constraints, save the original values
      this._origPanX = this._callbackObj.getPanX();
      this._origPanY = this._callbackObj.getPanY();
      this._origZoom = this._callbackObj.getZoom();

      if (this._bMomentumPanning) {
        //save current time for momentum-based panning
        this._currTime = new Date().getTime();
      }
    }
  }
  //if momentum panning was running, stop it
  if (this._momentumTimer && this._momentumTimer.isRunning()) {
    this._momentumTimer.stop();
    this._momentumTimer.reset();
  }
};

/**
 * Handles pan move for touch device
 * @param {dvt.TouchEvent} event Touch event to handle
 * @param {dvt.Touch} touch Touch object for the event
 * @protected
 */
dvt.PanZoomCanvasEventManager.prototype.PanMoveTouch = function(event, touch) {
  if (!this._bZooming) {
    var touchIds = this.TouchManager.getTouchIdsForObj(dvt.PanZoomCanvasEventManager._PAN_TOUCH_KEY);
    if (touchIds.length == 1) {
      var xx = touch.pageX;
      var yy = touch.pageY;
      this._handlePanMove(xx, yy);
      this._mx = xx;
      this._my = yy;
    }
  }
};

/**
 * Handles pan end for touch device
 * @param {dvt.TouchEvent} event Touch event to handle
 * @param {dvt.Touch} touch Touch object for the event
 * @protected
 */
dvt.PanZoomCanvasEventManager.prototype.PanEndTouch = function(event, touch) {
  if (!this._bZooming && this._bPanning) {
    this._handlePanEnd();
    this.SetEventInfo(event, 'panned', true);
  }
};

/**
 * Handles a zoom end event by passing a dvt.ZoomEvent to the callback and updating the control panel
 * @private
 */
dvt.PanZoomCanvasEventManager.prototype._handleZoomEnd = function() {
  this._callback.call(this._callbackObj, new dvt.ZoomEvent(dvt.ZoomEvent.SUBTYPE_DRAG_ZOOM_END));
  this._bZooming = false;
  if (this._pzc.getControlPanel())
    this._pzc.getControlPanel().mouseDragPanningEnded();

  //turn off elastic constraints, which will animate a bounce back to constrained values, if necessary
  this._callbackObj.SetElasticConstraints(false);
};

/**
 * Handles a pan move event by passing a dvt.PanEvent to the callback and updating the control panel
 * @param {Number} xx The x position to move to
 * @param {Number} yy The y position to move to
 * @private
 */
dvt.PanZoomCanvasEventManager.prototype._handlePanMove = function(xx, yy) {
  if (!this._bPanning) {
    this._callback.call(this._callbackObj, new dvt.PanEvent(dvt.PanEvent.SUBTYPE_DRAG_PAN_BEGIN));
    this._bPanning = true;
    if (this._pzc.getControlPanel()) {
      this._pzc.getControlPanel().mouseDragPanningStarted();
    }
    //turn on elastic constraints for the duration of this drag
    this._callbackObj.SetElasticConstraints(true);

    if (this._bMomentumPanning) {
      //keep track of last N mouse moves for momentum-based panning
      this._arLastNMouseMoves = [];
    }
  }

  //for elastic constraints, use a panTo so that the delta is relative to the mouseDown point,
  //resulting in more consistent values and smoother elastic animation
  //this._callbackObj.panBy(xx - this._mx, yy - this._my);
  this._callbackObj.panTo(this._origPanX + xx - this._px, this._origPanY + yy - this._py);

  if (this._bMomentumPanning) {
    //get new timestamp for momentum-based panning
    this._lastTime = this._currTime;
    this._currTime = new Date().getTime();

    //create or reset the timer to determine if we should start momentum-based panning
    if (this._momentumStartTimer) {
      if (this._momentumStartTimer.isRunning()) {
        this._momentumStartTimer.stop();
      }
      this._momentumStartTimer.reset();
    }
    else {
      this._momentumStartTimer = new dvt.Timer(this._context, dvt.PanZoomCanvasEventManager._MOMENTUM_START_TIMER_INTERVAL, this._handleMomentumStartTimer, this, 1);
    }
    //save the info for this mouse move
    this._arLastNMouseMoves.push({dt: (this._currTime - this._lastTime), dx: (xx - this._mx), dy: (yy - this._my)});
    //only save last N moves, so drop the oldest
    if (this._arLastNMouseMoves.length > 5) {
      this._arLastNMouseMoves.splice(0, 1);
    }
    //start the timer to indicate if we should start momentum-based panning;
    //if the timer expires, we won't do momentum-based panning, if the timer hasn't expired when the
    //mouseup occurs, then we'll start momentum-based panning
    this._momentumStartTimer.start();
  }
};


/**
 * Helper function called on mouseup or touchend events. Handles end of panning movement.
 * @private
 */
dvt.PanZoomCanvasEventManager.prototype._handlePanEnd = function() {
  this._callback.call(this._callbackObj, new dvt.PanEvent(dvt.PanEvent.SUBTYPE_DRAG_PAN_END));
  this._bPanning = false;
  this._bPanned = true;
  if (this._pzc.getControlPanel()) {
    this._pzc.getControlPanel().mouseDragPanningEnded();
  }
  //if the momentum-based panning start timer is still running, that means that the mouseup happened
  //very quickly after the last mouse move, so we want to start momentum-based panning
  if (this._momentumStartTimer && this._momentumStartTimer.isRunning()) {
    this._momentumStartTimer.stop();
    this._momentumStartTimer.reset();
    //create or reset the momentum panning timer
    if (!this._momentumTimer) {
      //initialize with start timer interval, but it will later be changed based on mousemove event intervals
      this._momentumTimer = new dvt.Timer(this._context, dvt.PanZoomCanvasEventManager._MOMENTUM_START_TIMER_INTERVAL, this._handleMomentumTimer, this);
    }
    else {
      this._momentumTimer.reset();
    }

    //use the last N mousemoves to average the x,y deltas per ms
    var dt = 0;
    var dx = 0;
    var dy = 0;
    var numMoves = this._arLastNMouseMoves.length;
    while (this._arLastNMouseMoves.length > 0) {
      var objMove = this._arLastNMouseMoves.pop();
      dt += objMove.dt;
      dx += objMove.dx;
      dy += objMove.dy;
    }
    this._arLastNMouseMoves = null;
    this._momentumXperMS = dx / dt;
    this._momentumYperMS = dy / dt;
    //use timer interval similar to mousemove interval
    this._momentumTimer.setInterval(Math.ceil(dt / numMoves));//@HTMLUpdateOk
    this._momentumIterCount = 1;
    this._momentumDx = 0;
    this._momentumDy = 0;
    //We disable and enable panning on DnD operations. The check should prevent momentum panning when panning is temporary disabled
    if (this._pzc.isPanningEnabled())
      this._momentumTimer.start();
  }
  else {
    //turn off elastic constraints, which will animate a bounce back to constrained values, if necessary
    this._callbackObj.SetElasticConstraints(false);
  }
};

/**
 * Ends pan zoom operations
 * @protected
 */
dvt.PanZoomCanvasEventManager.prototype.PanZoomEnd = function() {
  this.OnMouseUp(null);
};

/**
 * @override
 */
dvt.PanZoomCanvasEventManager.prototype.GetTouchResponse = function() {
  if (this._pzc.isPanningEnabled() || this._pzc.isZoomingEnabled())
    return dvt.EventManager.TOUCH_RESPONSE_TOUCH_HOLD;
  return dvt.EventManager.TOUCH_RESPONSE_AUTO;
};

/**
 * @override
 */
dvt.PanZoomCanvasEventManager.prototype.StoreInfoByEventType = function(key) {
  if (key == dvt.PanZoomCanvasEventManager.EVENT_INFO_PANNED_KEY) {
    return false;
  }
  return dvt.PanZoomCanvasEventManager.superclass.StoreInfoByEventType.call(this, key);
};
/**
 *  @param {dvt.EventManager} manager The owning dvt.EventManager
 *  @class dvt.PanZoomCanvasKeyboardHandler
 *  @extends {dvt.KeyboardHandler}
 *  @constructor
 */
dvt.PanZoomCanvasKeyboardHandler = function(component, manager) {
  this.Init(component, manager);
};

dvt.Obj.createSubclass(dvt.PanZoomCanvasKeyboardHandler, dvt.KeyboardHandler);


/**
 * @override
 */
dvt.PanZoomCanvasKeyboardHandler.prototype.Init = function(component, manager) {
  dvt.PanZoomCanvasKeyboardHandler.superclass.Init.call(this, manager);
  this._component = component;
};


/**
 * @override
 */
dvt.PanZoomCanvasKeyboardHandler.prototype.processKeyDown = function(event) {
  var keyCode = event.keyCode;
  var canvas = this._component.getPanZoomCanvas();
  if (keyCode == dvt.KeyboardEvent.PAGE_UP) {
    //TODO handle BiDi panning left/right
    if (event.ctrlKey || event.shiftKey)
      canvas.panBy(canvas.getPanIncrement(), 0);
    else
      canvas.panBy(0, canvas.getPanIncrement());
  }
  else if (keyCode == dvt.KeyboardEvent.PAGE_DOWN) {
    if (event.ctrlKey || event.shiftKey)
      canvas.panBy(-canvas.getPanIncrement(), 0);
    else
      canvas.panBy(0, -canvas.getPanIncrement());
  }
  else if (keyCode == dvt.KeyboardEvent.FORWARD_SLASH) {
    var controlPanel = canvas.getControlPanel();
    if (controlPanel)
      controlPanel.toggleExpandCollapse();
  }
  else if (dvt.KeyboardEvent.isEquals(event) || dvt.KeyboardEvent.isPlus(event)) {
    canvas.zoomTo(canvas.getZoom() + canvas.getZoomIncrement());
  }
  else if (dvt.KeyboardEvent.isMinus(event) || dvt.KeyboardEvent.isUnderscore(event)) {
    canvas.zoomTo(canvas.getZoom() - canvas.getZoomIncrement());
  }
  else if ((keyCode == dvt.KeyboardEvent.ZERO || keyCode == dvt.KeyboardEvent.NUMPAD_ZERO) && !event.ctrlKey && !event.shiftKey) {
    canvas.zoomToFit();
  }
  else {
    return dvt.PanZoomCanvasKeyboardHandler.superclass.processKeyDown.call(this, event);
  }
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 *  Creates a dvt.CollapsiblePanel
 *  @class dvt.CollapsiblePanel
 *  @extends {dvt.Container}
 *  @constructor
 *  @param {dvt.Context} context The context object
 *  @param {id} The id of the CollapsiblePanel
 *  @param {x} The leftmost position of the CollapsiblePanel
 *  @param {y} The topmost position of the CollapsiblePanel
 */
dvt.CollapsiblePanel = function(context, maxWidth, maxHeight, collapseDir, buttonImages, styleMap, disclosed, isFixed) {
  this.Init(context, maxWidth, maxHeight, collapseDir, buttonImages, styleMap, disclosed, isFixed);
};
/**
 * @const
 */
dvt.CollapsiblePanel.COLLAPSE_NORTHEAST = 'col_northeast';
/**
 * @const
 */
dvt.CollapsiblePanel.COLLAPSE_SOUTHEAST = 'col_southeast';
/**
 * @const
 */
dvt.CollapsiblePanel.COLLAPSE_NORTHWEST = 'col_northwest';
/**
 * @const
 */
dvt.CollapsiblePanel.COLLAPSE_SOUTHWEST = 'col_southwest';
/**
 * @const
 */
dvt.CollapsiblePanel.ANIMATIONDURATION = 0.25;
/**
 * @const
 */
dvt.CollapsiblePanel.BODYCOLOR = '#EBEFF5';
/**
 * @const
 */
dvt.CollapsiblePanel.TITLEBARCLOSEICON_WIDTH = 10;
/**
 * @const
 */
dvt.CollapsiblePanel.TITLEBARCLOSEICON_HEIGHT = 10;
/**
 * @const
 */
dvt.CollapsiblePanel.BUTTONHEIGHT = 25;
/**
 * @const
 */
dvt.CollapsiblePanel.BUTTONWIDTH = 10;

/**
 * @const
 * @private
 */
dvt.CollapsiblePanel._CONTENT_PADDING = 5;

dvt.Obj.createSubclass(dvt.CollapsiblePanel, dvt.Container);


/**
 * Initialization method called by the constructor
 *
 * @param {dvt.Context} context Platform specific context object
 * @param {number} maxWidth The maximum width of the collapsible panel
 * @param {number} maxHeight The maximum height of the collapsible panel
 * @param {string} collapseDir Collapse direction
 * @param {dvt.XmlNode} buttonImages The map of button images
 * @param {object} styleMap The object containing style specifications for this component
 * @param {boolean} disclosed Flag that indicates whether the panel is disclosed
 * @param {boolean} isFixed Flag that indicates whether the panel is collapsible
 * @protected
 */
dvt.CollapsiblePanel.prototype.Init = function(context, maxWidth, maxHeight, collapseDir, buttonImages, styleMap, disclosed, isFixed) {
  dvt.CollapsiblePanel.superclass.Init.call(this, context);

  this._maxWidth = maxWidth;
  this._maxHeight = maxHeight;

  this.setCollapseDirection(collapseDir);
  this._buttonImages = buttonImages;
  this._isFixed = isFixed ? isFixed : dvt.Agent.isEnvironmentBatik();
  this._expandTooltip = null;
  this._collapseTooltip = null;
  this._animation = null;

  this._styleMap = styleMap;
  this._borderColor = dvt.StyleUtils.getStyle(this._styleMap, dvt.CSSStyle.BORDER_COLOR, null);
  this._borderRadius = parseInt(dvt.StyleUtils.getStyle(this._styleMap, dvt.CSSStyle.BORDER_RADIUS, null));
  this._bgColor = dvt.StyleUtils.getStyle(this._styleMap, dvt.CSSStyle.BACKGROUND_COLOR, null);
  this._bgAlpha = dvt.StyleUtils.getStyle(this._styleMap, dvt.ControlPanel.BG_ALPHA, 1);

  if (disclosed !== undefined)
    this._collapse = !disclosed;
  else
    this._collapse = false;

  this._contentContainer = new dvt.Container(context);
  this.addChild(this._contentContainer);
  this._contentContainer.setTranslate(dvt.CollapsiblePanel._CONTENT_PADDING, dvt.CollapsiblePanel._CONTENT_PADDING);

  this.addEvtListener(dvt.MouseEvent.MOUSEOVER, this.HandleMouseOver, false, this);
  this.addEvtListener(dvt.MouseEvent.MOUSEOUT, this.HandleMouseOut, false, this);
};


/**
 * @private
 * Creates collapse/expand button
 */
dvt.CollapsiblePanel.prototype._drawButton = function() {
  // only draw collapse/expand button if not in print or fixed mode
  if (!this._isFixed) {
    this._buttonFrame = dvt.ControlPanelLAFUtils.createEmptyViewClosedFrame(this.getCtx(), dvt.CollapsiblePanel.BUTTONHEIGHT, this._styleMap, false);
    this._buttonFrame.setAlpha(this._styleMap[dvt.ControlPanel.FRAME_ROLLOUT_ALPHA]);
    this.addChild(this._buttonFrame);
    var west = (this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_NORTHWEST || this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_SOUTHWEST);
    if (this.isCollapsed())
      this._collapseExpandButton = dvt.ButtonLAFUtils.createExpandButton(this.getCtx(), this._buttonImages, dvt.CollapsiblePanel.BUTTONHEIGHT, this._styleMap,
          west ? dvt.ButtonLAFUtils.DIR_LEFT : dvt.ButtonLAFUtils.DIR_RIGHT);
    else
      this._collapseExpandButton = dvt.ButtonLAFUtils.createCollapseButton(this.getCtx(), this._buttonImages, dvt.CollapsiblePanel.BUTTONHEIGHT, this._styleMap,
          west ? dvt.ButtonLAFUtils.DIR_LEFT : dvt.ButtonLAFUtils.DIR_RIGHT);
    this._buttonFrame.addChild(this._collapseExpandButton);
    this._buttonFrame.setTranslateX(west ? this._width : -dvt.CollapsiblePanel.BUTTONWIDTH);

    if (dvt.Agent.isTouchDevice()) {
      this._collapseExpandButton.addEvtListener(dvt.TouchEvent.TOUCHSTART, this.OnButtonClick, false, this);
    } else {
      this._collapseExpandButton.addEvtListener(dvt.MouseEvent.CLICK, this.OnButtonClick, false, this);
      this._collapseExpandButton.addEvtListener(dvt.MouseEvent.MOUSEOVER, this.OnButtonHoverOver, false, this);
      this._collapseExpandButton.addEvtListener(dvt.MouseEvent.MOUSEOUT, this.OnButtonHoverOut, false, this);
    }
  }
};

dvt.CollapsiblePanel.prototype.setBackgroundFill = function(fill) {
  this._background.setFill(fill);
};

dvt.CollapsiblePanel.prototype.setBackgroundStroke = function(stroke) {
  this._background.setStroke(stroke);
};

dvt.CollapsiblePanel.prototype.setButtonTooltips = function(expand, collapse) {
  this._expandTooltip = expand;
  this._collapseTooltip = collapse;
};

dvt.CollapsiblePanel.prototype.addContent = function(object) {
  this._contentContainer.addChild(object);
  object.addEvtListener(dvt.ResizeEvent.RESIZE_EVENT, this.HandleResize, false, this);

  var dims = this._contentContainer.getDimensions();
  this._width = Math.min(this._maxWidth, dims.w + 2 * dvt.CollapsiblePanel._CONTENT_PADDING);
  this._height = Math.min(this._maxHeight, dims.h + 2 * dvt.CollapsiblePanel._CONTENT_PADDING);

  if (!this._background) {
    this._background = this._createRoundRectangle(this._width, this._height);
    this.addChildAt(this._background, 0);
    this._drawButton();
  //    if(this._shadow)
  //      this.addDrawEffect(this._shadow);
  } else {
    this._background.setCmds(this._getOutlinePath(this._width, this._height));
    var west = this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_NORTHWEST || this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_SOUTHWEST;
    if (this._buttonFrame && west)
      this._buttonFrame.setTranslateX(this._width);
  }

  if (this._collapse) {
    this._collapseExpand(false);
  }
};

/**
 * Resizes the collapisble panel when a resize happens on the child object
 * @param {dvt.ResizeEvent} event The resize event with the new child dimensions
 * @protected
 */
dvt.CollapsiblePanel.prototype.HandleResize = function(event) {
  var resizeWidth = event.getWidth() + 2 * dvt.CollapsiblePanel._CONTENT_PADDING;
  var resizeHeight = event.getHeight() + 2 * dvt.CollapsiblePanel._CONTENT_PADDING;

  this._background.setCmds(this._getOutlinePath(resizeWidth, resizeHeight));
  var west = this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_NORTHWEST || this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_SOUTHWEST;
  if (this._buttonFrame && west)
    this._buttonFrame.setTranslateX(resizeWidth);

  //fire resize event so parent component can reposition
  this.FireListener(new dvt.ResizeEvent(resizeWidth, resizeHeight, 0, 0));
};


/**
 * Returns whether the collapsible panel is in collapsed state.
 * @return {boolean}  True if the collapsible panel is in collapsed state.  Default to false.
 */
dvt.CollapsiblePanel.prototype.isCollapsed = function() {
  return this._collapse;
};


/**
 * Toggles expand/collapse state of the CollapsiblePanel
 * @param {boolean} collapse True to collapse the collapsiblePanel, false to expand
 */
dvt.CollapsiblePanel.prototype.setCollapsed = function(collapse) {
  if (this._collapse != collapse) {
    this._collapse = collapse;
    this._collapseExpand(true);
    this.FireListener(new dvt.CollapsiblePanelEvent(collapse ? dvt.CollapsiblePanelEvent.SUBTYPE_HIDE :
                                                              dvt.CollapsiblePanelEvent.SUBTYPE_SHOW));
  }
};


/**
 * Sets the direction this collapsible panel collapses in
 * @param {String} collapseDir The collapse direction
 */
dvt.CollapsiblePanel.prototype.setCollapseDirection = function(collapseDir) {
  this._collapseDir = collapseDir ? collapseDir : dvt.CollapsiblePanel.COLLAPSE_NORTHEAST;
  if (dvt.Agent.isRightToLeft(this.getCtx())) {
    if (this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_NORTHEAST)
      this._collapseDir = dvt.CollapsiblePanel.COLLAPSE_NORTHWEST;
    else if (this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_NORTHWEST)
      this._collapseDir = dvt.CollapsiblePanel.COLLAPSE_NORTHEAST;
    else if (this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_SOUTHEAST)
      this._collapseDir = dvt.CollapsiblePanel.COLLAPSE_SOUTHWEST;
    else if (this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_SOUTHWEST)
      this._collapseDir = dvt.CollapsiblePanel.COLLAPSE_SOUTHEAST;
  }
};

dvt.CollapsiblePanel.prototype.getMaxWidth = function() {
  return this._maxWidth;
};


/**
 * Returns the maximum width the content for this collapsible panel can be
 * taking into account the padding.
 * @return {number} The maximum width the content for this collapsible panel
 */
dvt.CollapsiblePanel.prototype.getMaxContentWidth = function() {
  return this._maxWidth - (2 * dvt.CollapsiblePanel._CONTENT_PADDING);
};

dvt.CollapsiblePanel.prototype.getMaxHeight = function() {
  return this._maxHeight;
};

dvt.CollapsiblePanel.prototype.getMaxContentHeight = function() {
  return this._maxHeight - (2 * dvt.CollapsiblePanel._CONTENT_PADDING);
};


/**
 * @private
 * Returns a point to move by used in animation
 * @param {dvt.Point} point The original point that represent one of the corners on collapsibel panel
 * @param {boolean} isScale True to scale the point
 */
dvt.CollapsiblePanel.prototype._getRefPoint = function(point, isScale) {
  if (!this.isCollapsed()) {
    if (isScale)
      return new dvt.Point(1 / point.x, 1 / point.y);
    else
      return new dvt.Point(- point.x, - point.y);
  }

  return point;
};


/**
 * Internal method to update the expand/collapse state of the CollapsiblePanel
 * @param {boolean} animate True for animation
 * @private
 */
dvt.CollapsiblePanel.prototype._collapseExpand = function(animate) {
  if (this._animation) {
    this._animationStopped = true;
    this._animation.stop(true);
  }

  var north = this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_NORTHWEST || this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_NORTHEAST;
  var west = this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_NORTHWEST || this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_SOUTHWEST;

  var translateX = west ? 0 : this._width;
  var translateY = north ? 0 : this._height;

  var scalePoint = new dvt.Point(1 / this._width, 1 / this._height);
  var translatePoint = new dvt.Point(translateX, translateY);
  var adjustment = north ? 0 : dvt.CollapsiblePanel.BUTTONHEIGHT;
  var translatePoint2 = new dvt.Point(west ? -this._width : this._width, translateY - adjustment);

  if (!animate) {
    this._background.setAlpha(0);
    if (this._buttonFrame)
      this._buttonFrame.setAlpha(0);
  }

  //TODO figure out actual movement for non animation
  var scaleAnim = new dvt.AnimScaleBy(this.getCtx(), this._background, this._getRefPoint(scalePoint, true), animate ? dvt.CollapsiblePanel.ANIMATIONDURATION : 0.00001);
  var moveAnim = new dvt.AnimMoveBy(this.getCtx(), this._buttonFrame, this._getRefPoint(translatePoint2), animate ? dvt.CollapsiblePanel.ANIMATIONDURATION : 0.00001);
  var moveAnim2 = new dvt.AnimMoveBy(this.getCtx(), this._background, this._getRefPoint(translatePoint), animate ? dvt.CollapsiblePanel.ANIMATIONDURATION : 0.00001);

  this._animation = new dvt.ParallelPlayable(this.getCtx(), scaleAnim, moveAnim, moveAnim2);

  // If an animation was created, play it
  if (this._animation) {
    this.getCtx().getTooltipManager().hideTooltip();

    // Disable event listeners temporarily
    this.removeEvtListener(dvt.MouseEvent.MOUSEOVER, this.HandleMouseOver, false, this);
    this.removeEvtListener(dvt.MouseEvent.MOUSEOUT, this.HandleMouseOut, false, this);
    if (this._collapseExpandButton) {
      this._collapseExpandButton.removeEvtListener(dvt.TouchEvent.TOUCHSTART, this.OnButtonClick, false, this);
      this._collapseExpandButton.removeEvtListener(dvt.MouseEvent.CLICK, this.OnButtonClick, false, this);
      this._collapseExpandButton.removeEvtListener(dvt.MouseEvent.MOUSEOVER, this.OnButtonHoverOver, false, this);
      this._collapseExpandButton.removeEvtListener(dvt.MouseEvent.MOUSEOUT, this.OnButtonHoverOut, false, this);
    }

    if (this.isCollapsed())
      this._contentContainer.setAlpha(0);

    // Start the animation
    this._animation.setOnEnd(this.OnAnimationEnd, this);
    this._animation.play();
  }

};

dvt.CollapsiblePanel.prototype._createRoundRectangle = function(width, height) {
  var rect = new dvt.Path(this.getCtx(), this._getOutlinePath(width, height));
  var alpha = this._styleMap[dvt.ControlPanel.FRAME_ROLLOUT_ALPHA];
  rect.setSolidFill(this._bgColor, this._bgAlpha);
  rect.setSolidStroke(this._borderColor, alpha);
  return rect;
};

dvt.CollapsiblePanel.prototype._getOutlinePath = function(width, height) {
  var r = this._borderRadius;
  var cmds;
  var west = this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_NORTHWEST || this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_SOUTHWEST;
  if (height <= dvt.CollapsiblePanel.BUTTONHEIGHT)
    height = dvt.CollapsiblePanel.BUTTONHEIGHT;
  // when collapsing to the west, northwest corner rounded, northeast corner square
  // when collapsing to the east, northwest corner square, northeast corner rounded
  if (this._isFixed || west)
    cmds = dvt.PathUtils.moveTo(r, 0);
  else
    cmds = dvt.PathUtils.moveTo(0, 0);

  cmds += dvt.PathUtils.lineTo(width - r, 0);

  if (!this._isFixed && west) {
    cmds += dvt.PathUtils.lineTo(width, 0);
    cmds += dvt.PathUtils.lineTo(width, r);
  } else {
    cmds += dvt.PathUtils.quadTo(width, 0, width, r);
  }

  // square if one row and west
  if (!this._isFixed && height == dvt.CollapsiblePanel.BUTTONHEIGHT && west) {
    cmds += dvt.PathUtils.lineTo(width, height);
  } else {
    cmds += dvt.PathUtils.lineTo(width, height - r);
    cmds += dvt.PathUtils.quadTo(width, height, width - r, height);
  }

  cmds += dvt.PathUtils.lineTo(r, height);
  // square if one row and east
  if (!this._isFixed && height == dvt.CollapsiblePanel.BUTTONHEIGHT && !west) {
    cmds += dvt.PathUtils.lineTo(0, height);
  } else {

    cmds += dvt.PathUtils.quadTo(0, height, 0, height - r);
  }

  if (this._isFixed || west) {
    cmds += dvt.PathUtils.lineTo(0, r);
    cmds += dvt.PathUtils.quadTo(0, 0, r, 0);
  }

  cmds += dvt.PathUtils.closePath();
  return cmds;
};


/**
 * @protected
 * Handles animation behavior at the end of the animation.
 */
dvt.CollapsiblePanel.prototype.OnAnimationEnd = function() {
  // Reset the animation stopped flag
  this._animationStopped = false;

  // Remove the animation reference
  this._animation = null;

  var stroke = this._background.getStroke().clone();
  stroke.setAlpha(this._styleMap[dvt.ControlPanel.FRAME_ROLLOUT_ALPHA]);
  this._background.setStroke(stroke);

  var alpha = this._styleMap[dvt.ControlPanel.BG_ROLLOUT_ALPHA];
  var fill = this._background.getFill().clone();
  fill.setAlpha(alpha);
  this._background.setFill(fill);

  if (this._buttonFrame)
    this._buttonFrame.setAlpha(this._styleMap[dvt.ControlPanel.FRAME_ROLLOUT_ALPHA]);

  if (!this.isCollapsed())
    this._contentContainer.setAlpha(1);

  // Restore event listeners
  var west = (this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_NORTHWEST || this._collapseDir == dvt.CollapsiblePanel.COLLAPSE_SOUTHWEST);
  if (this._collapseExpandButton) {
    if (this.isCollapsed())
      this._collapseExpandButton = dvt.ButtonLAFUtils.createExpandButton(this.getCtx(), this._buttonImages, dvt.CollapsiblePanel.BUTTONHEIGHT, this._styleMap,
          west ? dvt.ButtonLAFUtils.DIR_LEFT : dvt.ButtonLAFUtils.DIR_RIGHT);
    else
      this._collapseExpandButton = dvt.ButtonLAFUtils.createCollapseButton(this.getCtx(), this._buttonImages, dvt.CollapsiblePanel.BUTTONHEIGHT, this._styleMap,
          west ? dvt.ButtonLAFUtils.DIR_LEFT : dvt.ButtonLAFUtils.DIR_RIGHT);
    this._buttonFrame.addChild(this._collapseExpandButton);
    this._buttonFrame.removeChildAt(0);

    if (dvt.Agent.isTouchDevice()) {
      this._collapseExpandButton.addEvtListener(dvt.TouchEvent.TOUCHSTART, this.OnButtonClick, false, this);
    } else {
      this._collapseExpandButton.addEvtListener(dvt.MouseEvent.CLICK, this.OnButtonClick, false, this);
      this._collapseExpandButton.addEvtListener(dvt.MouseEvent.MOUSEOVER, this.OnButtonHoverOver, false, this);
      this._collapseExpandButton.addEvtListener(dvt.MouseEvent.MOUSEOUT, this.OnButtonHoverOut, false, this);
    }
  }
};


/**
 * @protected
 * Hides the tooltip and toggles collapsible panel state
 * @param {dvt.MouseEvent} evt The trigger event
 */
dvt.CollapsiblePanel.prototype.OnButtonClick = function(evt) {
  this.getCtx().getTooltipManager().hideTooltip();
  this.setCollapsed(!this.isCollapsed());
};


/**
 * @protected
 * Displays tooltip on hover event
 * @param {dvt.MouseEvent} evt The trigger event
 */
dvt.CollapsiblePanel.prototype.OnButtonHoverOver = function(evt) {
  var tooltip = this.isCollapsed() ? this._expandTooltip : this._collapseTooltip;
  if (tooltip != null)
    this.getCtx().getTooltipManager().showTooltip(evt.pageX, evt.pageY, tooltip, this._collapseExpandButton, true);
};


/**
 * @protected
 */
dvt.CollapsiblePanel.prototype.OnButtonHoverOut = function(evt) {
  this.getCtx().getTooltipManager().hideTooltip();
};


/**
 * @protected
 */
dvt.CollapsiblePanel.prototype.HandleMouseOver = function(event) {
  var stroke = this._background.getStroke().clone();
  stroke.setAlpha(this._styleMap[dvt.ControlPanel.FRAME_ROLLOVER_ALPHA]);
  this._background.setStroke(stroke);

  var alpha = this._styleMap[dvt.ControlPanel.BG_ROLLOVER_ALPHA];
  var fill = this._background.getFill().clone();
  fill.setAlpha(alpha);
  this._background.setFill(fill);

  if (this._buttonFrame)
    this._buttonFrame.setAlpha(this._styleMap[dvt.ControlPanel.FRAME_ROLLOVER_ALPHA]);
};


/**
 * @protected
 */
dvt.CollapsiblePanel.prototype.HandleMouseOut = function(event) {
  var stroke = this._background.getStroke().clone();
  stroke.setAlpha(this._styleMap[dvt.ControlPanel.FRAME_ROLLOUT_ALPHA]);
  this._background.setStroke(stroke);

  var fill = this._background.getFill().clone();
  fill.setAlpha(this._bgAlpha);
  this._background.setFill(fill);

  if (this._buttonFrame)
    this._buttonFrame.setAlpha(this._styleMap[dvt.ControlPanel.FRAME_ROLLOUT_ALPHA]);
};
/**
 * @constructor
 */
dvt.CollapsiblePanelEvent = function(subtype) {
  this.Init(dvt.CollapsiblePanelEvent.TYPE);
  this._subtype = subtype;
};

dvt.Obj.createSubclass(dvt.CollapsiblePanelEvent, dvt.BaseComponentEvent);

dvt.CollapsiblePanelEvent.TYPE = 'dvtCollapsiblePanelEvent';
dvt.CollapsiblePanelEvent.SUBTYPE_HIDE = 'hide';
dvt.CollapsiblePanelEvent.SUBTYPE_SHOW = 'show';

dvt.CollapsiblePanelEvent.prototype.getSubType = function() {
  return this._subtype;
};
/*
 * dvt.ImageLAFUtils Utility class for image
 */
dvt.ImageLAFUtils = {
};

dvt.Obj.createSubclass(dvt.ImageLAFUtils, dvt.Obj);

dvt.ImageLAFUtils.loadIcon = function(context, uri) {
  var image = new dvt.Image(context, uri);
  image.setMouseEnabled(false);

  dvt.ImageLoader.loadImage(context, uri, function(imgDim) {
    // set image size
    if (imgDim != null && imgDim.width && imgDim.height) {
      image.setWidth(imgDim.width);
      image.setHeight(imgDim.height);
    }
  });

  return image;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.


/**
 * dvt.ButtonLAFUtils Utility class for providing LAF for buttons in the control panel.
 */
dvt.ButtonLAFUtils = {};

dvt.Obj.createSubclass(dvt.ButtonLAFUtils, dvt.Obj);
/**
 * @const
 */
dvt.ButtonLAFUtils.EXPAND_COLLAPSE_BUTTON_IMG_OFFSET = -6;
/**
 * @const
 */
dvt.ButtonLAFUtils.CONTROL_BUTTON_WIDTH = 23;
/**
 * @const
 */
dvt.ButtonLAFUtils.CONTROL_BUTTON_HEIGHT = 21;
/**
 * @const
 */
dvt.ButtonLAFUtils.ZOOM_BUTTON_HEIGHT = 20;
/**
 * @const
 */
dvt.ButtonLAFUtils.OPEN_CLOSE_IMAGE_WIDTH = 22;
/**
 * @const
 */
dvt.ButtonLAFUtils.OPEN_CLOSE_IMAGE_HEIGHT = 20;
/**
 * @const
 */
dvt.ButtonLAFUtils.VIEW_PANEL_HEIGHT = 47;
/**
 * @const
 */
dvt.ButtonLAFUtils.VIEW_PANEL_HALF_HEIGHT = 26;
/**
 * @const
 */
dvt.ButtonLAFUtils.SIN_PI_4 = Math.sin(Math.PI / 4);
/**
 * @const
 */
dvt.ButtonLAFUtils.TAN_PI_8 = Math.tan(Math.PI / 8);
/**
 * @const
 */
dvt.ButtonLAFUtils.BORDER_COLOR = '#7C8191';
/**
 * @const
 */
dvt.ButtonLAFUtils.GRADIENT_DARK = '#E0E1E1';
/**
 * @const
 */
dvt.ButtonLAFUtils.GRADIENT_LIGHT = '#F0F1F2';
/**
 * @const
 */
dvt.ButtonLAFUtils.ROUND_RECT_ELLIPSE = 8;
/**
 * @const
 */
dvt.ButtonLAFUtils.DEFAULT_FILL_TYPE = 'solid';
/**
 * @const
 */
dvt.ButtonLAFUtils.DEFAULT_BORDER_COLOR = '#7BA0D9';
/**
 * @const
 */
dvt.ButtonLAFUtils.DEFAULT_MID_COLOR = '#3474D3';
/**
 * @const
 */
dvt.ButtonLAFUtils.DEFAULT_END_COLOR = '#BFD8FB';


//Button image keys
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._ZOOMIN_ENA = 'zoominUp';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._ZOOMIN_OVR = 'zoominOver';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._ZOOMIN_DWN = 'zoominDown';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._ZOOMIN_DISABLED = 'zoominDisabled';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._ZOOMTOFIT_ENA = 'zoomtofitUp';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._ZOOMTOFIT_OVR = 'zoomtofitOver';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._ZOOMTOFIT_DWN = 'zoomtofitDown';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._ZOOMOUT_ENA = 'zoomoutUp';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._ZOOMOUT_OVR = 'zoomoutOver';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._ZOOMOUT_DWN = 'zoomoutDown';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._ZOOMOUT_DISABLED = 'zoomoutDisabled';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._PAN_ENA = 'pandialUp';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._PAN_OVR = 'pandialOver';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._PAN_DWN = 'pandialDown';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._RECENTER_ENA = 'recenterUp';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._RECENTER_OVR = 'recenterOver';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._RECENTER_DWN = 'recenterDown';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._RESET_ENA = 'resetUp';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._RESET_OVR = 'resetOver';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._RESET_DWN = 'resetDown';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._DRILLUP_ENA = 'drillupUp';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._DRILLUP_OVR = 'drillupOver';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._DRILLUP_DWN = 'drillupDown';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._DRILLDOWN_ENA = 'drilldownUp';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._DRILLDOWN_OVR = 'drilldownOver';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._DRILLDOWN_DWN = 'drilldownDown';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._MAX_ENA = 'maxUp';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._MAX_OVR = 'maxOver';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._MAX_DWN = 'maxDown';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._RESTORE_ENA = 'restoreUp';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._RESTORE_OVR = 'restoreOver';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._RESTORE_DWN = 'restoreDown';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._COLLAPSE_ENA = 'collapseEna';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._COLLAPSE_OVR = 'collapseOvr';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._COLLAPSE_DWN = 'collapseDwn';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._EXPAND_ENA = 'expandEna';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._EXPAND_OVR = 'expandOvr';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._EXPAND_DWN = 'expandDwn';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._QUICKQUERY_ENA = 'quickQueryEna';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._QUICKQUERY_OVR = 'quickQueryOvr';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._QUICKQUERY_DWN = 'quickQueryDwn';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._CLEARRESULTS_ENA = 'clearResultsEna';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._CLEARRESULTS_OVR = 'clearResultsOvr';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._CLEARRESULTS_DWN = 'clearResultsDwn';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._UP = 'Up';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._OVER = 'Over';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._DOWN = 'Down';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._SEL = 'Sel';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._R2L = '_r';
/**
 * @const
 * @private
 */
dvt.ButtonLAFUtils._SYNC = 'synchronize';
/**
 * @const
 */
dvt.ButtonLAFUtils.DIR_RIGHT = 'right';
/**
 * @const
 */
dvt.ButtonLAFUtils.DIR_LEFT = 'left';


/**
 * Creates pan control
 * @param {dvt.Context} context Platform specific context object
 * @param {dvt.PanZoomCanvas} panZoomCanvas The PanZoomCanvas this button will be associated with
 * @param {Object} imageURIs The map containing image URIs for the component
 * @param {number} controls The bit mask specifying which controls to show
 * @param {object} styleMap The object containing style specifications for this component
 * @return {DvtPanControl} a container used for the pan control
 */
dvt.ButtonLAFUtils.createPanControl = function(context, panZoomCanvas, controls, imageURIs, styleMap)
{
  var panUpState = dvt.ButtonLAFUtils._createPanButtonState(context, imageURIs[dvt.ButtonLAFUtils._PAN_ENA], styleMap);
  //need to offset the down state so that we can rotate the arrow around the center of the pan control
  var panDownState = new dvt.Container(context);
  panDownState.setTranslate(20, 20);
  var downImage = dvt.ButtonLAFUtils._createPanButtonState(context, imageURIs[dvt.ButtonLAFUtils._PAN_DWN], styleMap);
  downImage.setTranslate(- 20, - 20);
  panDownState.addChild(downImage);

  //need to offset the over state so that we can rotate the arrow around the center of the pan control
  var panOverState = new dvt.Container(context);
  panOverState.setTranslate(20, 20);
  var overImage = dvt.ButtonLAFUtils._createPanButtonState(context, imageURIs[dvt.ButtonLAFUtils._PAN_OVR], styleMap);
  overImage.setTranslate(- 20, - 20);
  panOverState.addChild(overImage);

  var panButton = new dvt.Button(context, panUpState, panOverState, panDownState);

  if ((controls & dvt.ControlPanel.CONTROLS_CENTER_BUTTON) > 0) {
    //center of pan control is smaller circle that can be used to center the view on the selected node
    var recenterButton = new dvt.Button(context,
        dvt.ButtonLAFUtils._createRecenterButtonState(context, imageURIs[dvt.ButtonLAFUtils._RECENTER_ENA], styleMap),
        dvt.ButtonLAFUtils._createRecenterButtonState(context, imageURIs[dvt.ButtonLAFUtils._RECENTER_OVR], styleMap),
        dvt.ButtonLAFUtils._createRecenterButtonState(context, imageURIs[dvt.ButtonLAFUtils._RECENTER_DWN], styleMap));
    recenterButton.setTranslate(9, 9);
  }

  return new DvtPanControl(context, panButton, recenterButton, panZoomCanvas, controls, styleMap);
};


/**
 * Creates a container used for the drill up button.
 * @param {dvt.Context} context Platform specific context object
 * @param {Object} imageURIs The map containing image URIs for the component
 * @param {object} styleMap The object containing style specifications for this component
 * @return {dvt.Button} a container used for the drill up button
 */
dvt.ButtonLAFUtils.createDrillUpButton = function(context, imageURIs, styleMap) {
  var ena = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_ENABLED,
      imageURIs[dvt.ButtonLAFUtils._DRILLUP_ENA], styleMap);
  var ovr = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_OVER,
      imageURIs[dvt.ButtonLAFUtils._DRILLUP_OVR], styleMap);
  var dwn = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_DOWN,
      imageURIs[dvt.ButtonLAFUtils._DRILLUP_DWN], styleMap);
  var dis = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_ENABLED,
      imageURIs[dvt.ButtonLAFUtils._DRILLUP_ENA], styleMap, null, null, 0.4);
  return new dvt.Button(context, ena, ovr, dwn, dis);
};


/**
 * Creates a container used for the drill down button.
 * @param {dvt.Context} context Platform specific context object
 * @param {Object} imageURIs The map containing image URIs for the component
 * @param {object} styleMap The object containing style specifications for this component
 * @return {dvt.Button} a container used for the drill down button
 */
dvt.ButtonLAFUtils.createDrillDownButton = function(context, imageURIs, styleMap) {
  var ena = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_ENABLED,
      imageURIs[dvt.ButtonLAFUtils._DRILLDOWN_ENA], styleMap);
  var ovr = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_OVER,
      imageURIs[dvt.ButtonLAFUtils._DRILLDOWN_OVR], styleMap);
  var dwn = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_DOWN,
      imageURIs[dvt.ButtonLAFUtils._DRILLDOWN_DWN], styleMap);
  var dis = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_ENABLED,
      imageURIs[dvt.ButtonLAFUtils._DRILLDOWN_ENA], styleMap, null, null, 0.4);
  return new dvt.Button(context, ena, ovr, dwn, dis);
};


/**
 * Creates a container used for the reset button.
 * @param {dvt.Context} context Platform specific context object
 * @param {Object} imageURIs The map containing image URIs for the component
 * @param {object} styleMap The object containing style specifications for this component
 * @return {dvt.Button} a container used for the reset button
 */
dvt.ButtonLAFUtils.createResetButton = function(context, imageURIs, styleMap) {
  var ena = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_ENABLED,
      imageURIs[dvt.ButtonLAFUtils._RESET_ENA], styleMap);
  var ovr = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_OVER,
      imageURIs[dvt.ButtonLAFUtils._RESET_OVR], styleMap);
  var dwn = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_DOWN,
      imageURIs[dvt.ButtonLAFUtils._RESET_DWN], styleMap);
  var dis = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_ENABLED,
      imageURIs[dvt.ButtonLAFUtils._RESET_ENA], styleMap);
  return new dvt.Button(context, ena, ovr, dwn, dis);
};


/**
 * Creates a container used for the zoom-to-fit button.
 * @param {dvt.Context} context Platform specific context object
 * @param {Object} imageURIs The map containing image URIs for the component
 * @param {object} styleMap The object containing style specifications for this component
 * @return {dvt.Button} a container used for the zoom-to-fit button
 */
dvt.ButtonLAFUtils.createZoomToFitButton = function(context, imageURIs, styleMap) {
  var ena = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_ENABLED,
      imageURIs[dvt.ButtonLAFUtils._ZOOMTOFIT_ENA], styleMap);
  var ovr = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_OVER,
      imageURIs[dvt.ButtonLAFUtils._ZOOMTOFIT_OVR], styleMap);
  var dwn = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_DOWN,
      imageURIs[dvt.ButtonLAFUtils._ZOOMTOFIT_DWN], styleMap);
  return new dvt.Button(context, ena, ovr, dwn);
};


/**
 * Creates a container used for the zoom-in button.
 * @param {dvt.Context} context Platform specific context object
 * @param {Object} imageURIs The map containing image URIs for the component
 * @param {object} styleMap The object containing style specifications for this component
 * @return {dvt.Button} a container used for the zoom-in button
 */
dvt.ButtonLAFUtils.createZoomInButton = function(context, imageURIs, styleMap) {
  var ena = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_ENABLED,
      imageURIs[dvt.ButtonLAFUtils._ZOOMIN_ENA], styleMap);
  var ovr = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_OVER,
      imageURIs[dvt.ButtonLAFUtils._ZOOMIN_OVR], styleMap);
  var dwn = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_DOWN,
      imageURIs[dvt.ButtonLAFUtils._ZOOMIN_DWN], styleMap);
  var dis = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_DISABLED,
      imageURIs[dvt.ButtonLAFUtils._ZOOMIN_DISABLED], styleMap);
  return new dvt.Button(context, ena, ovr, dwn, dis);
};


/**
 * Creates a container used for the zoom-out button.
 * @param {dvt.Context} context Platform specific context object
 * @param {Object} imageURIs The map containing image URIs for the component
 * @param {object} styleMap The object containing style specifications for this component
 * @return {dvt.Button} a container used for the zoom-out button
 */
dvt.ButtonLAFUtils.createZoomOutButton = function(context, imageURIs, styleMap) {
  var ena = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_ENABLED,
      imageURIs[dvt.ButtonLAFUtils._ZOOMOUT_ENA], styleMap);
  var ovr = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_OVER,
      imageURIs[dvt.ButtonLAFUtils._ZOOMOUT_OVR], styleMap);
  var dwn = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_DOWN,
      imageURIs[dvt.ButtonLAFUtils._ZOOMOUT_DWN], styleMap);
  var dis = dvt.ButtonLAFUtils._createButtonBaseImage(context, dvt.Button.STATE_DISABLED,
      imageURIs[dvt.ButtonLAFUtils._ZOOMOUT_DISABLED], styleMap);
  return new dvt.Button(context, ena, ovr, dwn, dis);
};


/**
 * Creates a container used for the layout switcher button.
 * @param {dvt.Context} context Platform specific context object
 * @param {number} controls Button identifier
 * @param {string} bname Name used to resolve image name
 * @param {number} state Button state - ena, ovr, dwn
 * @param {Object} images The map string that contains image urls for the control
 * @param {object} styleMap The object containing style specifications for this component
 * @return {dvt.Displayable} a container used for the layout switcher button
 */
dvt.ButtonLAFUtils.createLayoutItemButtonState = function(context, controls, bname, state, images, styleMap) {
  var r = dvt.StyleUtils.getStyle(styleMap, 'buttonRadius', 0);
  var w = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_BUTTON_WIDTH, 0);
  var h = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_BUTTON_WIDTH, 0);

  var shape = dvt.ButtonLAFUtils._createBaseButtonShape(context, state, r, w, h, styleMap);
  dvt.ButtonLAFUtils._setButtonColors(state, shape, w, h + (r * 2), 0, 0, styleMap, true);

  var attrb = dvt.ButtonLAFUtils._getLayoutURI(context, state, bname);
  var image = dvt.ButtonLAFUtils._loadIcon(context, images[attrb], w, h);
  if (image)
    shape.addChild(image);
  return shape;
};


// TODO JSDOC
dvt.ButtonLAFUtils._getLayoutURI = function(context, state, bname, bSel)
{
  var attrb = bname;
  var r2l = '';

  if (state == dvt.Button.STATE_ENABLED)
    state = dvt.ButtonLAFUtils._UP;
  else if (state == dvt.Button.STATE_OVER)
    state = dvt.ButtonLAFUtils._OVER;
  else if (state == dvt.Button.STATE_DOWN)
    state = dvt.ButtonLAFUtils._DOWN;

  if (bSel) {
    attrb += dvt.ButtonLAFUtils._SEL;
    if (dvt.Agent.isRightToLeft(context))
      r2l = dvt.ButtonLAFUtils._R2L;
  }
  attrb += state + r2l;

  return attrb;
};


/**
 * Creates a shape used for the panel card switcher button.
 * @param {dvt.Context} context Platform specific context object
 * @param {number} state Button state - ena, ovr, dwn
 * @param {object} styleMap The object containing style specifications for this component
 * @param {Object} images The map string that contains image urls for the control
 * @return {dvt.Displayable} a shape for the panel card switcher button
 */
dvt.ButtonLAFUtils.createPanelCardButtonState = function(context, state, styleMap, images)
{
  var attrb = dvt.ButtonLAFUtils._getLayoutURI(context, state, dvt.ButtonLAFUtils._SYNC, true);
  var shape = dvt.ButtonLAFUtils._createButtonBaseImage(context, state,
      images[attrb], styleMap);
  return shape;
};


/**
 * Creates a shape used for the panel card combo box button.
 * @param {dvt.Context} context Platform specific context object
 * @param {number} state Button state - ena, ovr, dwn
 * @param {number} ww Button width
 * @param {number} hh Button height
 * @param {object} styleMap The object containing style specifications for this component
 * @param {Object} images The map string that contains image urls for the control
 * @return {dvt.Displayable} a shape for the panel card combo box button
 */
dvt.ButtonLAFUtils.createPanelCardSyncItemState = function(context, state, ww, hh, styleMap, images)
{
  var r = dvt.StyleUtils.getStyle(styleMap, 'buttonRadius', 0);
  var base = dvt.ButtonLAFUtils._createBaseButtonShape(context, state, r, ww, hh, styleMap);
  dvt.ButtonLAFUtils._setButtonColors(state, base, ww, hh + (r * 2), 0, 0, styleMap, true);
  return base;
};

/**
 * Creates a shape used for the control panel button.
 * @param {dvt.Context} context Platform specific context object
 * @param {string} bname Name used to resolve image name
 * @param {number} state Button state - ena, ovr, dwn
 * @param {object} styleMap The object containing style specifications for this component
 * @param {Object} images The map string that contains image urls for the control
 * @return {dvt.Displayable} a shape for the control panel button
 */
dvt.ButtonLAFUtils.createControlButtonState = function(context, bname, state, images, styleMap)
{
  var attrb = dvt.ButtonLAFUtils._getLayoutURI(context, state, bname);
  var shape = dvt.ButtonLAFUtils._createButtonBaseImage(context, state, images[attrb], styleMap);
  return shape;
};


/**
 * Creates an Expand Button
 * @param {dvt.Context} context Platform specific context object
 * @param {object} imageURIs The JSON object containing image URIs for the component
 * @param {number} h height of the close button
 * @param {object} styleMap The object containing style specifications for this component
 * @param {string} dir side of the page the panel is on, caller is responsible for passing
 *                    correct dir based on RTL
 * @return {dvt.Button} The Expand button
 */
dvt.ButtonLAFUtils.createExpandButton = function(context, imageURIs, h, styleMap, dir) {
  var right = (dir == dvt.ButtonLAFUtils.DIR_RIGHT);
  var ena = dvt.ButtonLAFUtils._createCollapseExpandButtonState(context, dvt.Button.STATE_ENABLED, h, right ? imageURIs[dvt.ButtonLAFUtils._COLLAPSE_ENA] : imageURIs[dvt.ButtonLAFUtils._EXPAND_ENA], styleMap, right);
  var ovr = dvt.ButtonLAFUtils._createCollapseExpandButtonState(context, dvt.Button.STATE_OVER, h, right ? imageURIs[dvt.ButtonLAFUtils._COLLAPSE_OVR] : imageURIs[dvt.ButtonLAFUtils._EXPAND_OVR], styleMap, right);
  var dwn = dvt.ButtonLAFUtils._createCollapseExpandButtonState(context, dvt.Button.STATE_DOWN, h, right ? imageURIs[dvt.ButtonLAFUtils._COLLAPSE_DWN] : imageURIs[dvt.ButtonLAFUtils._EXPAND_DWN], styleMap, right);
  return new dvt.Button(context, ena, ovr, dwn);
};


/**
 * Creates a collapse Button
 * @param {dvt.Context} context Platform specific context object
 * @param {object} imageURIs The JSON object containing image URIs for the component
 * @param {number} h height of the close button
 * @param {object} styleMap The object containing style specifications for this component
 * @param {string} dir side of the page the panel is on, caller is responsible for passing
 *                    correct dir based on RTL
 * @return {dvt.Button} The collapse button
 */
dvt.ButtonLAFUtils.createCollapseButton = function(context, imageURIs, h, styleMap, dir) {
  var right = (dir == dvt.ButtonLAFUtils.DIR_RIGHT);
  var ena = dvt.ButtonLAFUtils._createCollapseExpandButtonState(context, dvt.Button.STATE_ENABLED, h, right ? imageURIs[dvt.ButtonLAFUtils._EXPAND_ENA] : imageURIs[dvt.ButtonLAFUtils._COLLAPSE_ENA], styleMap, right);
  var ovr = dvt.ButtonLAFUtils._createCollapseExpandButtonState(context, dvt.Button.STATE_OVER, h, right ? imageURIs[dvt.ButtonLAFUtils._EXPAND_OVR] : imageURIs[dvt.ButtonLAFUtils._COLLAPSE_OVR], styleMap, right);
  var dwn = dvt.ButtonLAFUtils._createCollapseExpandButtonState(context, dvt.Button.STATE_DOWN, h, right ? imageURIs[dvt.ButtonLAFUtils._EXPAND_DWN] : imageURIs[dvt.ButtonLAFUtils._COLLAPSE_DWN], styleMap, right);
  return new dvt.Button(context, ena, ovr, dwn);
};


/**
 * Creates a Quick query Button
 * @param {dvt.Context} context Platform specific context object
 * @param {object} imageURIs The JSON object containing image URIs for the component
 * @return {dvt.Button} The Quick query button
 */
dvt.ButtonLAFUtils.createQuickQueryButton = function(context, imageURIs) {
  var ena = dvt.ButtonLAFUtils._createQuickQueryButtonState(context, dvt.Button.STATE_ENABLED, imageURIs[dvt.ButtonLAFUtils._QUICKQUERY_ENA]);
  var ovr = dvt.ButtonLAFUtils._createQuickQueryButtonState(context, dvt.Button.STATE_OVER, imageURIs[dvt.ButtonLAFUtils._QUICKQUERY_OVR]);
  var dwn = dvt.ButtonLAFUtils._createQuickQueryButtonState(context, dvt.Button.STATE_DOWN, imageURIs[dvt.ButtonLAFUtils._QUICKQUERY_DWN]);
  return new dvt.Button(context, ena, ovr, dwn);
};


/**
 * Creates a Clear results Button
 * @param {dvt.Context} context Platform specific context object
 * @param {object} imageURIs The JSON object containing image URIs for the component
 * @return {dvt.Button} The Clear results button
 */
dvt.ButtonLAFUtils.createClearResultsButton = function(context, imageURIs) {
  var ena = dvt.ButtonLAFUtils._createQuickQueryButtonState(context, dvt.Button.STATE_ENABLED, imageURIs[dvt.ButtonLAFUtils._CLEARRESULTS_ENA]);
  var ovr = dvt.ButtonLAFUtils._createQuickQueryButtonState(context, dvt.Button.STATE_OVER, imageURIs[dvt.ButtonLAFUtils._CLEARRESULTS_OVR]);
  var dwn = dvt.ButtonLAFUtils._createQuickQueryButtonState(context, dvt.Button.STATE_DOWN, imageURIs[dvt.ButtonLAFUtils._CLEARRESULTS_DWN]);
  return new dvt.Button(context, ena, ovr, dwn);
};


/**
 * Creates a shape used for the panel card combo box button.
 * @param {dvt.Context} context Platform specific context object
 * @param {number} state Button state - ena, ovr, dwn
 * @param {string} uri Image URL for the button state
 * @param {object} styleMap The object containing style specifications for this component
 * @param {number=} w Optional button width
 * @param {number=} h Optional button height
 * @param {number=} alpha Optional opacity for the image
 * @return {dvt.Displayable} a shape for the panel card combo box button
 */
dvt.ButtonLAFUtils._createButtonBaseImage = function(context, state, uri, styleMap, w, h, alpha) {

  var r = dvt.StyleUtils.getStyle(styleMap, 'buttonRadius', 0);
  if (w === 'undefined' || w == null)
    w = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_BUTTON_WIDTH, 0);
  if (h === 'undefined' || h == null)
    h = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_BUTTON_WIDTH, 0);

  var base = dvt.ButtonLAFUtils._drawBaseButton(context, state, r, w, h, styleMap);
  var image = dvt.ButtonLAFUtils._loadIcon(context, uri, w, h);
  if (image) {
    if (alpha != null)
      image.setAlpha(alpha);
    base.addChild(image);
  }

  return base;
};

dvt.ButtonLAFUtils._loadIcon = function(context, uri, buttonWidth, buttonHeight) {
  var image = new dvt.Image(context, uri);
  image.setMouseEnabled(false);

  dvt.ImageLoader.loadImage(context, uri, function(imgDim) {
    // set image size
    if (imgDim != null && imgDim.width && imgDim.height) {
      image.setWidth(imgDim.width);
      image.setHeight(imgDim.height);
      var translateY = buttonHeight / 2 - imgDim.height / 2;
      var translateX = buttonWidth / 2 - imgDim.width / 2;
      image.setTranslate(translateX, translateY);
    }
  });

  return image;
};

/**
 * Creates a shape used in the pan button.
 * @private
 * @param {dvt.Context} context Platform specific context object
 * @param {Object} uri The map of button images
 * @param {object} styleMap The object containing style specifications for this component
 * @return {dvt.Shape} shape used in pan button
 */
dvt.ButtonLAFUtils._createPanButtonState = function(context, uri, styleMap) {
  var mc = new dvt.Container(context);
  var hitZone = new dvt.Circle(context, 20, 20, 20);
  hitZone.setAlpha(0);
  var color = dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BACKGROUND_COLOR, null);
  hitZone.setSolidFill(color);
  mc.addChild(hitZone);

  var image = dvt.ImageLAFUtils.loadIcon(context, uri);
  if (image) {
    mc.addChild(image);
  }
  return mc;
};


/**
 * Creates a shape used in the re-center button.
 * @private
 * @param {dvt.Context} context Platform specific context object
 * @param {Object} uri The map of button images
 * @param {object} styleMap The object containing style specifications for this component
 * @return {dvt.Shape} shape used in re-center button
 */
dvt.ButtonLAFUtils._createRecenterButtonState = function(context, uri, styleMap)
{
  var shape = new dvt.Container(context);
  var hitZone = new dvt.Circle(context, 11, 11, 8);
  hitZone.setAlpha(0);

  var color = dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BACKGROUND_COLOR, null);
  hitZone.setSolidFill(color);

  shape.addChild(hitZone);

  var image = dvt.ImageLAFUtils.loadIcon(context, uri);
  if (image) {
    shape.addChild(image);
  }

  return shape;
};


/**
 * Create a displayable object used in the button to collapse the control panel.
 * @private
 * @param {dvt.Context} context Platform specific context object
 * @param {number} state button state
 * @param {number} nh height of the close button
 * @param {Object} uri The map of button images
 * @param {Object} styleMap
 * @param {boolean} right true if the panel is on the right side
 * @return {dvt.Path} displayable object used in collapse button
 */
dvt.ButtonLAFUtils._createCollapseExpandButtonState = function(context, state, nh, uri, styleMap, right) {

  //BUG FIX #10154856: pass in height so we can show single row in
  //horizontal arm of control panel in TMap
  if (!nh)
    nh = 47;
  var sprite = dvt.ButtonLAFUtils._drawOpenCloseButtonHelper(context, state, nh, styleMap, right);
  var iconLoader = dvt.ImageLAFUtils.loadIcon(context, uri);

  //center the icon in the button
  if (iconLoader) {
    var imageW = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_IMAGE_WIDTH, 0);
    var imageH = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_IMAGE_HEIGHT, 0);

    sprite.addChild(iconLoader);

    var buttonWidth = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_OPEN_CLOSE_BUTTON_WIDTH, 0);
    var offsetX = (buttonWidth - imageW) / 2;

    //BUG FIX #10154856: calculate y coord instead of hardcoding because we may
    //show 1 or 2 rows of controls in horizontal arm of control panel
    //(calculation should yield same as old code for 2 rows)
    //icon height is 20
    var offsetY = (nh - imageH) / 2;
    iconLoader.setTranslate(offsetX, offsetY);
  }
  return sprite;
};


/**
 * Create a sprite used in the button to perform a search.
 *
 * @param state button state
 *
 * @return Sprite used in search button
 */
dvt.ButtonLAFUtils._createQuickQueryButtonState = function(context, state, uri) {
  var iconLoader = dvt.ImageLAFUtils.loadIcon(context, uri);
  iconLoader.setMouseEnabled(true);
  return iconLoader;
};


/**
 * Creates the background for the pan button.
 * @param {dvt.Context} context Platform specific context object
 * @param {object} styleMap The object containing style specifications for this component
 * @return {dvt.Shape} pan button background
 */
dvt.ButtonLAFUtils.createPanButtonBackground = function(context, styleMap)
{
  var shape = dvt.ButtonLAFUtils._drawPanButtonBase(context);
  var r = 20;
  var ww = 2 * r;
  var hh = ww;
  var xx = 0;
  var yy = 0;

  var bgColor = dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BACKGROUND_COLOR, null);
  var borderColor = dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BORDER_COLOR, null);
  var fillType = dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.FILL_TYPE, null);

  if (fillType == 'solid') {
    shape.setSolidStroke(borderColor);
    shape.setSolidFill(bgColor);
  }
  else {

    var line_rot = 36;// (1.2) * Math.PI;
    var line_colors = ['#8D93A5', '#E0EAEB', borderColor];
    var line_alphas = [1, 1, 1];
    var line_ratios = [0, 125 / 255, 1];
    shape.setStroke(new dvt.LinearGradientStroke(line_rot, line_colors, line_alphas, line_ratios, [xx, yy, ww, hh], 1));

    var rot = 90;// (1.5) * Math.PI;
    var fill_colors = [bgColor, bgColor, '#5A83BE', bgColor];
    var fill_alphas = [.90, .10, 0, .70];
    var fill_ratios = [0, 105 / 255, 150 / 255, 1];
    shape.setFill(new dvt.LinearGradientFill(rot, fill_colors, fill_alphas, fill_ratios, [xx, yy, ww, hh]));
  }

  return shape;
};


/**
 * Creates pan button underlay
 * @param {dvt.Context} context Platform specific context object
 * @param {object} styleMap The object containing style specifications for this component
 * @return {dvt.Shape} pan button underlay
 */
dvt.ButtonLAFUtils.createPanButtonUnderlay = function(context, styleMap)
{
  var shape = dvt.ButtonLAFUtils._drawPanButtonBase(context);
  var color = dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BACKGROUND_COLOR, null);

  shape.setSolidStroke(color);
  shape.setSolidFill(color);
  return shape;
};


dvt.ButtonLAFUtils._drawPanButtonBase = function(context) {
  var r = 20;
  var x = r;
  var y = r;

  var cmds = dvt.PathUtils.moveTo(x + r, y) +
             dvt.PathUtils.quadTo(r + x, dvt.ButtonLAFUtils.TAN_PI_8 * r + y, dvt.ButtonLAFUtils.SIN_PI_4 * r + x,
                                 dvt.ButtonLAFUtils.SIN_PI_4 * r + y) +
             dvt.PathUtils.quadTo(dvt.ButtonLAFUtils.TAN_PI_8 * r + x, r + y, x, r + y) +
             dvt.PathUtils.quadTo(-dvt.ButtonLAFUtils.TAN_PI_8 * r + x, r + y, -dvt.ButtonLAFUtils.SIN_PI_4 * r + x,
                                 dvt.ButtonLAFUtils.SIN_PI_4 * r + y) +
             dvt.PathUtils.quadTo(-r + x, dvt.ButtonLAFUtils.TAN_PI_8 * r + y, -r + x, y) +
             dvt.PathUtils.quadTo(-r + x, -dvt.ButtonLAFUtils.TAN_PI_8 * r + y, -dvt.ButtonLAFUtils.SIN_PI_4 * r + x,
                                 -dvt.ButtonLAFUtils.SIN_PI_4 * r + y) +
             dvt.PathUtils.quadTo(-dvt.ButtonLAFUtils.TAN_PI_8 * r + x, -r + y, x, -r + y) +
             dvt.PathUtils.quadTo(dvt.ButtonLAFUtils.TAN_PI_8 * r + x, -r + y, dvt.ButtonLAFUtils.SIN_PI_4 * r + x,
                                 -dvt.ButtonLAFUtils.SIN_PI_4 * r + y) +
             dvt.PathUtils.quadTo(r + x, -dvt.ButtonLAFUtils.TAN_PI_8 * r + y, r + x, y) + dvt.PathUtils.closePath();

  return new dvt.Path(context, cmds, 'draw_pan_button');
};


dvt.ButtonLAFUtils._setGradientBorder = function(shape, ww, hh, xx, yy)
{
  shape.setSolidStroke('#FFFFFF');

  var line_rot = 63;//TODO? (1.35) * Math.PI;
  var line_colors = ['#8D93A5', '#E0EAEB', '#FFFFFF'];
  var line_alphas = [1, 1, 1];
  var line_ratios = [0, 155 / 255, 1];

  shape.setStroke(new dvt.LinearGradientStroke(line_rot, line_colors, line_alphas, line_ratios, [xx, yy, ww, hh], 1));
};


/**
 * @private
 * Helper methods that fills button shape and sets a stroke if necessary
 * @param {number} state One of the button states : STATE_ENABLED, dvt.Button.STATE_OVER, dvt.Button.STATE_DOWN or dvt.Button.STATE_DISABLED
 * @param {dvt.Path} shape A button shape
 * @param {number} ww Button width
 * @param {number} hh Button height
 * @param {number} xx Button horizontal offset
 * @param {number} yy Button vertical offset
 * @param {boolean} isDropdownItem True if this is a dropdown item (we might give a different treatment to a dropdown item vs a button on control panel)
 * @param {object} styleMap The object containing style specifications for this component
 */
dvt.ButtonLAFUtils._setButtonColors = function(state, shape, ww, hh, xx, yy, styleMap, isDropdownItem)
{
  var panelDrawerStyle = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_PANEL_DRAWER_STYLES, null);
  if (panelDrawerStyle) {
    if (!isDropdownItem || (isDropdownItem && state == dvt.Button.STATE_ENABLED))
      shape.setInvisibleFill();
    else if (state == dvt.Button.STATE_OVER || state == dvt.Button.STATE_DOWN) //dropdown items
      shape.setFill(new dvt.SolidFill('#EBECED'));
  }
  else if (styleMap[dvt.PanZoomComponent.SKIN_NAME] == dvt.CSSStyle.SKIN_SKYROS) {
    switch (state) {
      case dvt.Button.STATE_OVER:
        shape.setFill(new dvt.SolidFill('#FFFFFF', 0.7));
        shape.setStroke(new dvt.SolidStroke(dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BORDER_COLOR, null)));
        break;
      case dvt.Button.STATE_DOWN:
        shape.setFill(new dvt.SolidFill('#B3C6DB'));
        shape.setStroke(new dvt.SolidStroke(dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BORDER_COLOR, null)));
        break;
      case dvt.Button.STATE_DISABLED:
      case dvt.Button.STATE_ENABLED:
      default:
        shape.setInvisibleFill();
    }
  }
  else {
    var fill_colors, fill_alphas, fill_ratios;
    var rot = 90;
    switch (state)
    {
      case dvt.Button.STATE_DISABLED:
      case dvt.Button.STATE_ENABLED:
        fill_colors = ['#5B868A', '#FFFFFF', '#FFFFFF', '#5B868A'];
        fill_alphas = [.01, 0, .05, .01];
        fill_ratios = [0, 120 / 255, 130 / 255, 1];
        break;
      case dvt.Button.STATE_OVER:
        dvt.ButtonLAFUtils._setGradientBorder(shape, ww, hh, xx, yy);
        fill_colors = ['#FFFFFF', '#4671B0', '#4671B0', '#FFFFFF'];
        fill_alphas = [.50, .20, .10, .70];
        fill_ratios = [0, 120 / 255, 130 / 255, 1];
        break;
      case dvt.Button.STATE_DOWN:
        dvt.ButtonLAFUtils._setGradientBorder(shape, ww, hh, xx, yy);
        fill_colors = ['#E0EAEB', '#5B868A', '#4671B0'];
        fill_alphas = [.10, .30, .60];
        fill_ratios = [0, 130 / 255, 1];
        break;
      default: break;
    }

    shape.setFill(new dvt.LinearGradientFill(rot, fill_colors, fill_alphas, fill_ratios, [xx, yy, ww, hh]));
  }
};


/**
 * @private
 * Helper methods that fills shape and sets a stroke for close button
 * @param {dvt.Context} context Platform specific context object
 * @param {number} state One of the button states : STATE_ENABLED, dvt.Button.STATE_OVER, dvt.Button.STATE_DOWN or dvt.Button.STATE_DISABLED
 * @param {dvt.Path} shape A button shape
 * @param {number} ww Button width
 * @param {number} hh Button height
 * @param {number} xx Button horizontal offset
 * @param {number} yy Button vertical offset
 * @param {object} styleMap The object containing style specifications for this component
 */
dvt.ButtonLAFUtils._setCloseButtonColors = function(context, state, shape, ww, hh, xx, yy, styleMap)
{
  var panelDrawerStyle = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_PANEL_DRAWER_STYLES, null);
  if (panelDrawerStyle)
    shape.setInvisibleFill();
  else {
    var stroke, fill;
    var fillType = dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.FILL_TYPE, null);
    var borderColor = dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BORDER_COLOR, null);
    if (fillType == 'solid') {
      var bgColor = dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BACKGROUND_COLOR, null);
      var bgAlpha, strokeAlpha;
      switch (state) {
        case dvt.Button.STATE_ENABLED:
          bgAlpha = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.BG_ALPHA, 1);
          strokeAlpha = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.FRAME_ROLLOUT_ALPHA, 1);
          break;
        case dvt.Button.STATE_DOWN:
        case dvt.Button.STATE_OVER:
          bgAlpha = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.BG_ROLLOVER_ALPHA, 1);
          strokeAlpha = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.FRAME_ROLLOVER_ALPHA, 1);
          break;
        default: break;
      }
      fill = new dvt.SolidFill(bgColor, bgAlpha);
      stroke = new dvt.SolidStroke(borderColor, strokeAlpha);
    } else {
      var fill_colors, fill_alphas, fill_ratios;
      var rot = 0;
      switch (state) {
        case dvt.Button.STATE_ENABLED:
          fill_colors = ['#FFFFFF', '#5B868A', '#5B868A'];
          fill_alphas = [0, .20, .30];
          fill_ratios = [0, 130 / 255, 1];
          break;
        case dvt.Button.STATE_OVER:
          fill_colors = ['#FFFFFF', '#FFFFFF', '#4671B0', '#4671B0'];
          fill_alphas = [.10, .20, .10, .60];
          fill_ratios = [0, 120 / 255, 130 / 255, 1];
          break;
        case dvt.Button.STATE_DOWN:
          fill_colors = ['#4671B0', '#5B868A', '#5B868A'];
          fill_alphas = [.50, .20, .40];
          fill_ratios = [0, 130 / 255, 1];
          break;
        default: break;
      }
      fill = new dvt.LinearGradientFill(rot, fill_colors, fill_alphas, fill_ratios, [xx, yy, ww, hh]);
      stroke = new dvt.SolidStroke(borderColor, 1, 0.8);
    }

    shape.setStroke(stroke);
    shape.setFill(fill);
  }
};



dvt.ButtonLAFUtils._setSliderButtonColors = function(state, shape, ww, hh, xx, yy)
{
  var rot = 90;
  var fill_colors, fill_alphas, fill_ratios;

  switch (state)
  {
    case dvt.Button.STATE_ENABLED:
      var lineThickness = 0.25;
      shape.setSolidStroke('#FFFFFF', 1, lineThickness);
      fill_colors = ['#FFFFFF', '#4671B0', '#E0EAEB', '#FFFFFF'];
      fill_alphas = [.60, .30, .30, .80];
      fill_ratios = [0, 125 / 255, 130 / 255, 1];
      break;
    case dvt.Button.STATE_OVER:
      dvt.ButtonLAFUtils._setGradientBorder(shape, ww, hh, xx, yy);
      fill_colors = ['#4671B0', '#FFFFFF', '#FFFFFF', '#FFFFFF'];
      fill_alphas = [.40, .30, .70, 1];
      fill_ratios = [0, 70 / 255, 200 / 255, 1];
      break;
    case dvt.Button.STATE_DOWN:
      dvt.ButtonLAFUtils._setGradientBorder(shape, ww, hh, xx, yy);
      fill_colors = ['#FFFFFF', '#4671B0', '#E0EAEB'];
      fill_alphas = [.60, .50, .80];
      fill_ratios = [0, 130 / 255, 1];
      break;
    default: break;
  }

  shape.setFill(new dvt.LinearGradientFill(rot, fill_colors, fill_alphas, fill_ratios, [xx, yy, ww, hh]));
};

/**
 * Gets the points used to draw the Button Shape
 * @param {number} buttonWidth width of button
 * @param {number} buttonHeight height of button
 * @param {number} r radius of curved corners
 * @param {boolean} right is true if the panel is on the right
 * @return {Array} The Array of points
 */
dvt.ButtonLAFUtils.GetButtonPathCommands = function(buttonWidth, buttonHeight, r, right) {
  var arPoints;
  if (!right) {
    arPoints = ['M', 0, 0,
                'L', buttonWidth - r, 0,
                'A', r, r, 0, 0, 1, buttonWidth, r,
                'L', buttonWidth, buttonHeight - r,
                'A', r, r, 0, 0, 1, buttonWidth - r, buttonHeight,
                'L', 0, buttonHeight];
  }
  else {
    arPoints = ['M', buttonWidth, 0,
                'L', r, 0,
                'A', r, r, 0, 0, 0, 0, r,
                'L', 0, buttonHeight - r,
                'A', r, r, 0, 0, 0, r, buttonHeight,
                'L', buttonWidth, buttonHeight];
  }
  return arPoints;
};


//BUG FIX #10154856: pass in height to show single row of controls in
//horizontal arm of control panel in TMap
/**
 * Creates a shape for the open close button
 * @private
 * @param {dvt.Context} context Platform specific context object
 * @param {number} state button state
 * @param {number} nh height of the open-close button
 * @param {Object} styleMap The object containing style specifications for this component
 * @param {boolean} right true if the panel is on the right side
 * @return {dvt.Path} frame for the collapsed control panel
 */
dvt.ButtonLAFUtils._drawOpenCloseButtonHelper = function(context, state, nh, styleMap, right)
{
  if (!nh)
    nh = 47;

  var xx = 0;
  var yy = 0;
  var r = parseInt(dvt.StyleUtils.getStyle(styleMap, dvt.CSSStyle.BORDER_RADIUS, 0));
  var buttonWidth = dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_OPEN_CLOSE_BUTTON_WIDTH, 0);
  var buttonHeight = Math.max(nh, dvt.StyleUtils.getStyle(styleMap, dvt.ControlPanel.CP_BUTTON_HEIGHT, nh));

  var arPoints = dvt.ButtonLAFUtils.GetButtonPathCommands(buttonWidth, buttonHeight, r, right);
  var shape = new dvt.Path(context, arPoints);
  dvt.ButtonLAFUtils._setCloseButtonColors(context, state, shape, buttonWidth, buttonHeight, xx, yy, styleMap);

  return shape;
};


dvt.ButtonLAFUtils._drawBaseButton = function(context, state, r, ww, hh, styleMap)
{
  var shape = dvt.ButtonLAFUtils._createBaseButtonShape(context, state, r, ww, hh, styleMap);
  dvt.ButtonLAFUtils._setButtonColors(state, shape, ww, hh + (r * 2), 0, 0, styleMap);

  return shape;
};

dvt.ButtonLAFUtils._createBaseButtonShape = function(context, state, r, ww, hh, styleMap) {
  if (styleMap[dvt.PanZoomComponent.SKIN_NAME] == dvt.CSSStyle.SKIN_SKYROS) {
    return new dvt.Rect(context, 0, 0, ww, hh);
  } else {
    ww = ww - (2 * r);
    hh = hh - (2 * r);
    var x = ww + r;
    var y = hh + r;

    var cmds = dvt.PathUtils.moveTo(x + r, y) + dvt.PathUtils.quadTo(r + x, dvt.ButtonLAFUtils.TAN_PI_8 * r + y, dvt.ButtonLAFUtils.SIN_PI_4 * r + x, dvt.ButtonLAFUtils.SIN_PI_4 * r + y) + dvt.PathUtils.quadTo(dvt.ButtonLAFUtils.TAN_PI_8 * r + x, r + y, x, r + y) + dvt.PathUtils.lineTo(x, y + r) + dvt.PathUtils.lineTo(x - ww, r + y);
    x = x - ww;
    y = y;

    cmds += dvt.PathUtils.quadTo(- dvt.ButtonLAFUtils.TAN_PI_8 * r + x, r + y, - dvt.ButtonLAFUtils.SIN_PI_4 * r + x, dvt.ButtonLAFUtils.SIN_PI_4 * r + y) + dvt.PathUtils.quadTo(- r + x, dvt.ButtonLAFUtils.TAN_PI_8 * r + y, - r + x, y) + dvt.PathUtils.lineTo(x - r, y) + dvt.PathUtils.lineTo(x - r, y - hh);
    x = x;
    y = y - hh;

    cmds += dvt.PathUtils.quadTo(- r + x, - dvt.ButtonLAFUtils.TAN_PI_8 * r + y, - dvt.ButtonLAFUtils.SIN_PI_4 * r + x, - dvt.ButtonLAFUtils.SIN_PI_4 * r + y) + dvt.PathUtils.quadTo(- dvt.ButtonLAFUtils.TAN_PI_8 * r + x, - r + y, x, - r + y) + dvt.PathUtils.lineTo(x, - r + y) + dvt.PathUtils.lineTo(x + ww, - r + y);
    x = x + ww;
    y = y;

    cmds += dvt.PathUtils.quadTo(dvt.ButtonLAFUtils.TAN_PI_8 * r + x, - r + y, dvt.ButtonLAFUtils.SIN_PI_4 * r + x, - dvt.ButtonLAFUtils.SIN_PI_4 * r + y) + dvt.PathUtils.quadTo(r + x, - dvt.ButtonLAFUtils.TAN_PI_8 * r + y, r + x, y) + dvt.PathUtils.lineTo(x + r, y + hh) + dvt.PathUtils.closePath();
    return new dvt.Path(context, cmds);
  }
};

/**
 * Draw the background for the dropdown from the layout or panel card sync buttons.
 *
 * @param s sprite to draw into
 * @param ww width of dropdown
 * @param hh height of dropdown
 * @param {object} styleMap The object containing style specifications for this component
 */
dvt.ButtonLAFUtils.drawDropdownShape = function(context, ww, hh, styleMap) {
  var r = dvt.StyleUtils.getStyle(styleMap, 'radius', 0);
  ww -= 2 * r;
  hh -= r;
  var x = ww + r;
  var y = (hh);

  var cmds = dvt.PathUtils.moveTo(x + r, y) + dvt.PathUtils.quadTo(r + x, dvt.ButtonLAFUtils.TAN_PI_8 * r + y, dvt.ButtonLAFUtils.SIN_PI_4 * r + x, dvt.ButtonLAFUtils.SIN_PI_4 * r + y) + dvt.PathUtils.quadTo(dvt.ButtonLAFUtils.TAN_PI_8 * r + x, r + y, x, r + y) + dvt.PathUtils.lineTo(x, r + y) + dvt.PathUtils.lineTo(x - ww, r + y);

  x = x - ww;
  y = y;
  cmds += dvt.PathUtils.quadTo(- dvt.ButtonLAFUtils.TAN_PI_8 * r + x, r + y, - dvt.ButtonLAFUtils.SIN_PI_4 * r + x, dvt.ButtonLAFUtils.SIN_PI_4 * r + y) + dvt.PathUtils.quadTo(- r + x, dvt.ButtonLAFUtils.TAN_PI_8 * r + y, - r + x, y) + dvt.PathUtils.lineTo(- r + x, y) + dvt.PathUtils.lineTo(- r + x, y - hh);

  x = x;
  y = y - hh;

  cmds += dvt.PathUtils.lineTo(x + ww + r, y) + dvt.PathUtils.lineTo(x + ww + r, y + hh) + dvt.PathUtils.closePath();

  var shape = new dvt.Path(context, cmds);
  return shape;
};

/*
 * Temporarily add the display object to the stage to get dimensions.
 * Remove it from stage after done
 */
dvt.ButtonLAFUtils._getDimForced = function(context, obj) {
  //NOTE: if obj is button, getDimensions on its 1st child
  if (obj instanceof dvt.Button) {
    obj = obj.getChildAt(0);
  }
  return dvt.DisplayableUtils.getDimForced(context, obj);
};


/**
 * Apply Style on button object
 * @public
 * @param {dvt.Path} dispObj button path object
 * @param {buttonStyle} dvt.CSSStyle  Style object
 */
dvt.ButtonLAFUtils.parseStyle = function(dispObj, buttonStyle) {
  var fillType = dvt.ButtonLAFUtils.DEFAULT_FILL_TYPE;
  var borderColor = dvt.ButtonLAFUtils.DEFAULT_BORDER_COLOR;
  var backgroundColor = dvt.ButtonLAFUtils.DEFAULT_MID_COLOR;
  var background;

  if (buttonStyle) {
    if (buttonStyle.getStyle(dvt.CSSStyle.FILL_TYPE)) {
      fillType = buttonStyle.getStyle(dvt.CSSStyle.FILL_TYPE);
    }
    if (buttonStyle.getStyle(dvt.CSSStyle.BORDER_COLOR)) {
      borderColor = buttonStyle.getStyle(dvt.CSSStyle.BORDER_COLOR);
    }
    if (buttonStyle.getStyle(dvt.CSSStyle.BACKGROUND_COLOR)) {
      backgroundColor = buttonStyle.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
    }
    if (buttonStyle.getStyle(dvt.CSSStyle.BACKGROUND)) {
      background = buttonStyle.getStyle(dvt.CSSStyle.BACKGROUND);
    }
  }

  var stroke = new dvt.SolidStroke(borderColor);

  var fill;
  if (fillType == 'solid') {
    fill = new dvt.SolidFill(backgroundColor);
  }
  else {
    var fill_colors;
    var fill_alphas;
    var fill_ratios;
    var degree;
    if (background && background.indexOf('linear-gradient') >= 0) {
      var linearGradient = dvt.GradientParser.parseCSSGradient(background);
      if (linearGradient) {
        degree = linearGradient.getAngle();
        fill_colors = linearGradient.getColors();
        fill_alphas = linearGradient.getAlphas();
        fill_ratios = linearGradient.getRatios();
      }
    } else {
      var midColor = backgroundColor;
      var endColor = dvt.ButtonLAFUtils.DEFAULT_END_COLOR;
      if (midColor != dvt.ButtonLAFUtils.DEFAULT_MID_COLOR) {
        endColor = dvt.ColorUtils.inferColor(dvt.ButtonLAFUtils.DEFAULT_MID_COLOR, dvt.ButtonLAFUtils.DEFAULT_END_COLOR, midColor);
      }
      fill_colors = [midColor, endColor];
      fill_alphas = [.60, .80];
      fill_ratios = [0, 1];
      degree = -270;
    }
    fill = new dvt.LinearGradientFill(degree, fill_colors, fill_alphas, fill_ratios);
  }
  dispObj.setFill(fill);
  dispObj.setStroke(stroke);
};
dvt.exportProperty(dvt.PanZoomComponent.prototype, 'render', dvt.PanZoomComponent.prototype.render);
})(dvt);

  return dvt;
});
