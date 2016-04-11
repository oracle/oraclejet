/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

(function(dvt) {
/**
 * Axis component.  This class should never be instantiated directly.  Use the
 * newInstance function instead.
 * @class
 * @constructor
 * @extends {dvt.BaseComponent}
 */
dvt.Axis = function() {};

dvt.Obj.createSubclass(dvt.Axis, dvt.BaseComponent);


/**
 * Returns a new instance of dvt.Axis.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @return {dvt.Axis}
 */
dvt.Axis.newInstance = function(context, callback, callbackObj) {
  var axis = new dvt.Axis();
  axis.Init(context, callback, callbackObj);
  return axis;
};


/**
 * Returns a copy of the default options for the specified skin.
 * @param {string} skin The skin whose defaults are being returned.
 * @return {object} The object containing defaults for this component.
 */
dvt.Axis.getDefaults = function(skin) 
{
  return (new DvtAxisDefaults()).getDefaults(skin);
};


/**
 * @override
 * @protected
 */
dvt.Axis.prototype.Init = function(context, callback, callbackObj) {
  dvt.Axis.superclass.Init.call(this, context, callback, callbackObj);

  // Create the defaults object
  this.Defaults = new DvtAxisDefaults();

  // Create the event handler and add event listeners
  this._eventManager = new DvtAxisEventManager(this);
  this._eventManager.addListeners(this);

  // Set up keyboard handler on non-touch devices if the axis is interactive
  if (!dvt.Agent.isTouchDevice())
    this._eventManager.setKeyboardHandler(new DvtAxisKeyboardHandler(this._eventManager, this));

  this._bounds = null;
};


/**
 * Minimum buffer for horizontal axis.
 */
dvt.Axis.MINIMUM_AXIS_BUFFER = 10;


/**
 * @override
 * @protected
 */
dvt.Axis.prototype.SetOptions = function(options) {
  if (options) {
    // Combine the user options with the defaults and store. If the axis isn't rendered, no need to apply defaults.
    this.Options = (options['rendered'] == 'off') ? options : this.Defaults.calcOptions(options);
  }
  else if (!this.Options) // Create a default options object if none has been specified
    this.Options = this.GetDefaults();
};


/**
 * Returns the preferred dimensions for this component given the maximum available space.
 * @param {object} options The object containing specifications and data for this component.
 * @param {Number} maxWidth The maximum width available.
 * @param {Number} maxHeight The maximum height available.
 * @return {dvt.Dimension} The preferred dimensions for the object.
 */
dvt.Axis.prototype.getPreferredSize = function(options, maxWidth, maxHeight) {
  // Update the options object.
  this.SetOptions(options);

  // Ask the axis to render its context in the max space and find the space used
  return DvtAxisRenderer.getPreferredSize(this, maxWidth, maxHeight);
};


/**
 * Renders the component at the specified size.
 * @param {object} options The object containing specifications and data for this component.
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 * @param {number=} x x position of the component.
 * @param {number=} y y position of the component.
 */
dvt.Axis.prototype.render = function(options, width, height, x, y) 
{
  // Update the options object.
  this.SetOptions(options);
  this._navigablePeers = [];

  this.Width = width;
  this.Height = height;

  // Clear any contents rendered previously
  this.removeChildren();

  // Set default values to undefined properties.
  if (!x) {
    x = 0;
  }

  if (!y) {
    y = 0;
  }

  // Render the axis
  var availSpace = new dvt.Rectangle(x, y, width, height);
  DvtAxisRenderer.render(this, availSpace);
};

/**
 * Registers the object peer with the axis.  The peer must be registered to participate
 * in interactivity.
 * @param {DvtAxisObjPeer} peer
 */
dvt.Axis.prototype.__registerObject = function(peer) {
  // peer is navigable if associated with axis item using datatip or drilling is enabled
  if (peer.getDatatip() != null || peer.getAction() != null || peer.isDrillable())
    this._navigablePeers.push(peer);
};

/**
 * Returns the keyboard navigables within the axis.
 * @return {array}
 */
dvt.Axis.prototype.__getKeyboardObjects = function() {
  return this._navigablePeers;
};

/**
 * Returns whether or not the axis has navigable peers
 * @return {boolean}
 */
dvt.Axis.prototype.isNavigable = function() {
  return this._navigablePeers.length > 0;
};

/**
 * Returns the keyboard-focused object of the axis
 * @return {DvtKeyboardNavigable} The focused object.
 */
dvt.Axis.prototype.getKeyboardFocus = function() {
  if (this._eventManager != null)
    return this._eventManager.getFocus();
  return null;
};

/**
 * Sets the navigable as the keyboard-focused object of the axis. It matches the id in case it has been rerendered.
 * @param {DvtKeyboardNavigable} navigable The focused object.
 * @param {boolean} isShowingFocusEffect Whether the keyboard focus effect should be used.
 */
dvt.Axis.prototype.setKeyboardFocus = function(navigable, isShowingFocusEffect) {
  if (this._eventManager == null)
    return;

  var peers = this.__getKeyboardObjects();
  var id = navigable.getId();
  var matchFound = false;
  for (var i = 0; i < peers.length; i++) {
    var otherId = peers[i].getId();
    if ((id instanceof Array && otherId instanceof Array && dvt.ArrayUtils.equals(id, otherId)) || id === otherId) {
      this._eventManager.setFocusObj(peers[i]);
      matchFound = true;
      if (isShowingFocusEffect)
        peers[i].showKeyboardFocusEffect();
      break;
    }
  }
  if (!matchFound)
    this._eventManager.setFocusObj(this._eventManager.getKeyboardHandler().getDefaultNavigable(peers));

  // Update the accessibility attributes
  var focus = this.getKeyboardFocus();
  if (focus) {
    var displayable = focus.getDisplayable();
    displayable.setAriaProperty('label', focus.getAriaLabel());
    this.getCtx().setActiveElement(displayable);
  }
};

/**
 * Processes the specified event.
 * @param {object} event
 * @param {object} source The component that is the source of the event, if available.
 */
dvt.Axis.prototype.processEvent = function(event, source) {
  // Dispatch the event to the callback if it originated from within this component.
  if (this === source) {
    this.dispatchEvent(event);
  }
};

/**
 * @override
 */
dvt.Axis.prototype.getEventManager = function() {
  return this._eventManager;
};


/**
 * Returns the axisInfo for the axis
 * @return {dvt.AxisInfo} the axisInfo
 */
dvt.Axis.prototype.getInfo = function() {
  return this.Info;
};


/**
 * Sets the object containing calculated axis information and support
 * for creating drawables.
 * @param {dvt.AxisInfo} axisInfo
 */
dvt.Axis.prototype.__setInfo = function(axisInfo) {
  this.Info = axisInfo;
};

/**
 * Returns the axis width
 * @return {number}
 */
dvt.Axis.prototype.getWidth = function() {
  return this.Width;
};


/**
 * Returns the axis height
 * @return {number}
 */
dvt.Axis.prototype.getHeight = function() {
  return this.Height;
};


/**
 * @override
 */
dvt.Axis.prototype.destroy = function() {
  if (this._eventManager) {
    this._eventManager.removeListeners(this);
    this._eventManager.destroy();
    this._eventManager = null;
  }

  // Call super last during destroy
  dvt.Axis.superclass.destroy.call(this);
};

/**
 * Stores the bounds for this axis
 * @param {dvt.Rectangle} bounds
 */
dvt.Axis.prototype.__setBounds = function(bounds) {
  this._bounds = bounds;
};

/**
 * Returns the bounds for this axis
 * @return {dvt.Rectangle} the object containing the bounds for this axis
 */
dvt.Axis.prototype.__getBounds = function() {
  return this._bounds;
};

/**
 * Returns the automation object for this axis
 * @return {dvt.Automation} The automation object
 */
dvt.Axis.prototype.getAutomation = function() {
  return new DvtAxisAutomation(this);
};
/**
 * Axis Constants
 * @class
 */
var DvtAxisConstants = {};

dvt.Obj.createSubclass(DvtAxisConstants, dvt.Obj);

/**
 * @const
 */
DvtAxisConstants.TICK_LABEL = 'tickLabel';

/**
 * @const
 */
DvtAxisConstants.TITLE = 'title';
/**
 *  Provides automation services for a DVT component.
 *  @class DvtAxisAutomation
 *  @param {dvt.Axis} dvtComponent
 *  @implements {dvt.Automation}
 *  @constructor
 */
var DvtAxisAutomation = function(dvtComponent) {
  this._axis = dvtComponent;

  this._options = this._axis.getOptions();
  this._axisInfo = this._axis.getInfo();
};

dvt.Obj.createSubclass(DvtAxisAutomation, dvt.Automation);


/**
 * Valid subIds inlcude:
 * <ul>
 * <li>item[groupIndex0]...[groupIndexN]</li>
 * <li>title</li>
 * </ul>
 * @override
 */
DvtAxisAutomation.prototype.GetSubIdForDomElement = function(displayable) {
  var logicalObj = this._axis.getEventManager().GetLogicalObject(displayable);
  if (logicalObj && (logicalObj instanceof dvt.SimpleObjPeer)) {
    if (logicalObj.getParams()['type'] == DvtAxisConstants.TITLE) // return chart axis title subId
      return 'title';
    else if (this._options['groups']) { // return group axis label subId
      var level = logicalObj.getParams()['level'];
      var labelIndex = this._axisInfo.getStartIndex(logicalObj.getParams()['index'], level);
      var indexList = '';
      // Loop from outermost level to desired level
      for (var levelIdx = 0; levelIdx <= level; levelIdx++) {
        var labels = this._axisInfo.getLabels(this._axis.getCtx(), levelIdx);
        // Find label at each level that belongs in hierarchy for the specified label, and append position to subId index list
        for (var i = 0; i < labels.length; i++) {
          var index = this._axisInfo.getLabelIndex(labels[i]); // true group axis label index
          if (this._axisInfo.getStartIndex(index, levelIdx) <= labelIndex && this._axisInfo.getEndIndex(index, levelIdx) >= labelIndex) {
            indexList += '[' + this._axisInfo.getPosition(index, levelIdx) + ']';
          }
        }
      }
      // Return subId
      if (indexList.length > 0)
        return 'item' + indexList;
    }
  }
  return null;
};


/**
 * Valid subIds inlcude:
 * <ul>
 * <li>item[groupIndex0]...[groupIndexN]</li>
 * <li>title</li>
 * </ul>
 * @override
 */
DvtAxisAutomation.prototype.getDomElementForSubId = function(subId) {
  if (subId == 'title') { // process chart axis title subId
    var title = this._axisInfo.getTitle();
    if (title)
      return title.getElem();
  }
  else if (this._axisInfo instanceof dvt.GroupAxisInfo) { // process group axis label subId
    var numIndices = subId.split('[').length - 1;
    var labelLevel = numIndices - 1;
    var labelIndex = 0;
    var startIndex = 0;
    // Loop from outermost level to specified level
    for (var levelIdx = 0; levelIdx <= labelLevel; levelIdx++) {
      var openParen = subId.indexOf('[');
      var closeParen = subId.indexOf(']');
      var groupIndex = subId.substring(openParen + 1, closeParen);
      subId = subId.substring(closeParen + 1);
      var labels = this._axisInfo.getLabels(this._axis.getCtx(), levelIdx);
      var index; // true group axis label index
      for (var j = 0; j < labels.length; j++) {
        index = this._axisInfo.getLabelIndex(labels[j]);
        if (this._axisInfo.getStartIndex(index, levelIdx) == startIndex) {
          labelIndex = index;
          break;
        }
      }
      for (var i = labelIndex; i < labels.length; i++) {
        index = this._axisInfo.getLabelIndex(labels[i]);
        if (this._axisInfo.getPosition(index, levelIdx) == groupIndex) {
          if (subId.length == 0)
            return labels[i].getElem();
          else
            startIndex = this._axisInfo.getStartIndex(index, levelIdx);
          break;
        }
      }
    }

  }
  return null;
};

/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {dvt.BaseComponentDefaults}
 */
var DvtAxisDefaults = function() {
  this.Init({'skyros': DvtAxisDefaults.VERSION_1, 'alta': DvtAxisDefaults.SKIN_ALTA, 'next': DvtAxisDefaults.SKIN_NEXT});
};

dvt.Obj.createSubclass(DvtAxisDefaults, dvt.BaseComponentDefaults);

/**
 * Contains overrides for the next generation skin.
 */
DvtAxisDefaults.SKIN_NEXT = {
  'skin': dvt.CSSStyle.SKIN_NEXT,
  'layout': {
    'titleGap': 6
  }
};


/**
 * Contains overrides for the 'alta' skin.
 */
DvtAxisDefaults.SKIN_ALTA = {
  'axisLine': {'lineColor': '#9E9E9E'},
  'majorTick': {'lineColor': 'rgba(196,206,215,0.4)', 'baselineColor': 'auto'},
  'minorTick': {'lineColor': 'rgba(196,206,215,0.2)'},
  'tickLabel': {'style': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA + 'white-space:normal;')},
  'titleStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12)
};


/**
 * Defaults for version 1.
 */
DvtAxisDefaults.VERSION_1 = {
  'position': null,
  'baselineScaling': 'zero',
  'axisLine': {'lineColor': '#8A8DAC', 'lineWidth': 1, 'rendered': 'on'},
  'majorTick': {'lineColor': 'rgba(138,141,172,0.4)', 'lineWidth': 1, 'rendered': 'auto', 'lineStyle': 'solid'},
  'minorTick': {'lineColor': 'rgba(138,141,172,0.20)', 'lineWidth': 1, 'rendered': 'off', 'lineStyle': 'solid'},
  'tickLabel': {
    'scaling': 'auto',
    'style': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_SKYROS + 'font-size: 11px; color: #333333;'), 'rotation': 'auto', 'rendered': 'on'
  },
  'titleStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_SKYROS + 'font-size: 11px; color: #737373;'),

  // For group axis, an optional offset expressed as a factor of the group size.
  'startGroupOffset': 0, 'endGroupOffset': 0,

  //*********** Internal Attributes *************************************************//
  'layout': {'titleGap': 4, 'radialLabelGap': 5, 'insideLabelGapWidth': 4, 'insideLabelGapHeight': 2, 'hierarchicalLabelGapHeight': 8, 'hierarchicalLabelGapWidth': 15},
  '_locale': 'en-us'
};


/**
 * Adjusts the gap size based on the component options.
 * @param {dvt.Context} context The axis component context.
 * @param {Object} options The axis options.
 * @param {Number} defaultSize The default gap size.
 * @return {Number}
 */
DvtAxisDefaults.getGapSize = function(context, options, defaultSize) {
  // adjust based on tick label font size
  var scalingFactor = Math.min(dvt.TextUtils.getTextStringHeight(context, options['tickLabel']['style']) / 14, 1);
  return Math.ceil(defaultSize * scalingFactor);
};
/**
 * Event Manager for dvt.Axis.
 * @param {dvt.Axis} axis
 * @class
 * @extends {dvt.EventManager}
 * @constructor
 */
var DvtAxisEventManager = function(axis) {
  this.Init(axis.getCtx(), axis.processEvent, axis);
  this._axis = axis;
};

dvt.Obj.createSubclass(DvtAxisEventManager, dvt.EventManager);


/**
 * Returns the parameters for the DvtComponentUIEvent for an object with the specified arguments.
 * @param {string} type The type of object that was the target of the event.
 * @param {object=} id The id of the object, if one exists.
 * @param {number=} index The index of the axis label, in regards to its level, if one is specified.
 * @param {number=} level The level of the axis label, if one is specified.
 * @return {object} the parameters for the DvtComponentUIEvent
 */
DvtAxisEventManager.getUIParams = function(type, id, index, level) {
  return {'type': type, 'id': id, 'index': index, 'level': level};
};

/**
 * @override
 */
DvtAxisEventManager.prototype.OnClick = function(event) {
  DvtAxisEventManager.superclass.OnClick.call(this, event);

  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;

  var action = this.processActionEvent(obj);

  // If an action occurs, the event should not bubble.
  if (action)
    event.stopPropagation();
};

/**
 * @override
 */
DvtAxisEventManager.prototype.HandleTouchClickInternal = function(evt) {
  var obj = this.GetLogicalObject(evt.target);
  if (!obj)
    return;

  var touchEvent = evt.touchEvent;
  var action = this.processActionEvent(obj);
  if (action && touchEvent)
    touchEvent.preventDefault();
};

/**
 * Processes an action on the specified group label.  Returns true if an action event is fired.
 * @param {DvtGroupAxisObjPeer} obj The group label that was clicked.
 * @return {boolean} True if an event was fired.
 */
DvtAxisEventManager.prototype.processActionEvent = function(obj) {
  if (obj && obj.getAction && obj.getAction()) {
    this.FireEvent(dvt.EventFactory.newActionEvent('action', obj.getAction(), obj.getId()), this._axis);
    return true;
  }

  // Drill Support
  if (obj instanceof DvtAxisObjPeer && obj.isDrillable()) {
    this.FireEvent(dvt.EventFactory.newChartDrillEvent(obj.getId(), null, obj.getGroup()), this._axis);
    return true;
  }

  return false;
};


/**
  *  @param {dvt.EventManager} manager The owning dvt.EventManager
  *  @param {dvt.Axis} axis
  *  @class DvtAxisKeyboardHandler
  *  @extends {dvt.KeyboardHandler}
  *  @constructor
  */
var DvtAxisKeyboardHandler = function(manager, axis)
{
  this.Init(manager, axis);
};

dvt.Obj.createSubclass(DvtAxisKeyboardHandler, dvt.KeyboardHandler);


/**
 * @override
 */
DvtAxisKeyboardHandler.prototype.Init = function(manager, axis) {
  DvtAxisKeyboardHandler.superclass.Init.call(this, manager);
  this._axis = axis;
};


/**
 * @override
 */
DvtAxisKeyboardHandler.prototype.processKeyDown = function(event) {
  var keyCode = event.keyCode;
  var currentNavigable = this._eventManager.getFocus();
  var nextNavigable = null;

  if (keyCode == dvt.KeyboardEvent.TAB) {
    if (currentNavigable) {
      dvt.EventManager.consumeEvent(event);
      nextNavigable = currentNavigable;
    }

    // navigate to the default
    var navigables = this._axis.__getKeyboardObjects();
    if (navigables.length > 0) {
      dvt.EventManager.consumeEvent(event);
      nextNavigable = this.getDefaultNavigable(navigables);
    }
  }
  else if (keyCode == dvt.KeyboardEvent.ENTER) {
    if (currentNavigable) {
      this._eventManager.processActionEvent(currentNavigable);
      dvt.EventManager.consumeEvent(event);
    }
  }
  else
    nextNavigable = DvtAxisKeyboardHandler.superclass.processKeyDown.call(this, event);

  return nextNavigable;
};
/**
 * Renderer for dvt.Axis.
 * @class
 */
var DvtAxisRenderer = new Object();

dvt.Obj.createSubclass(DvtAxisRenderer, dvt.Obj);

/**
 * Returns the preferred dimensions for this component given the maximum available space. This will never be called for
 * radial axis.
 * @param {dvt.Axis} axis
 * @param {number} availWidth
 * @param {number} availHeight
 * @return {dvt.Dimension} The preferred dimensions for the object.
 */
DvtAxisRenderer.getPreferredSize = function(axis, availWidth, availHeight) {
  // Calculate the axis extents and increments
  var axisInfo = DvtAxisRenderer._createAxisInfo(axis, new dvt.Rectangle(0, 0, availWidth, availHeight));
  var context = axis.getCtx();
  var options = axis.getOptions();

  // The axis will always return the full length of the dimension along which values are placed, so there's only one
  // size that we need to keep track of.  For example, this is the height on horizontal axes.
  var size = 0;
  var bHoriz = (options['position'] == 'top' || options['position'] == 'bottom');

  // No size if not rendered or either dimension is 0
  if (options['rendered'] == 'off' || availWidth <= 0 || availHeight <= 0)
    return bHoriz ? new dvt.Dimension(availWidth, 0) : new dvt.Dimension(0, availHeight);

  // Allocate space for the title
  if (options['title'])
    size = dvt.TextUtils.getTextStringHeight(context, options['titleStyle']) + DvtAxisRenderer._getTitleGap(axis);

  // Allocate space for the tick labels
  if (options['tickLabel']['rendered'] == 'on' && options['tickLabel']['position'] != 'inside') {
    if (bHoriz) {
      // Horizontal Axis
      var labelHeight = dvt.TextUtils.getTextStringHeight(context, options['tickLabel']['style']);
      if (axisInfo instanceof dvt.DataAxisInfo)
        size += labelHeight;
      else if (axisInfo instanceof dvt.TimeAxisInfo)
        size += (axisInfo.getLabels(context, 1) != null ? labelHeight * 2 : labelHeight);
      else if (axisInfo instanceof dvt.GroupAxisInfo)
        size = DvtAxisRenderer._getGroupAxisPreferredSize(axis, axisInfo, size, availHeight, bHoriz);
    }
    else {
      // Vertical Axis
      if (axisInfo instanceof dvt.DataAxisInfo)
        size += dvt.TextUtils.getMaxTextDimensions(axisInfo.getLabels(context)).w;
      else if (axisInfo instanceof dvt.TimeAxisInfo) {
        var innerLabels = axisInfo.getLabels(context);
        var innerLabelWidth = dvt.TextUtils.getMaxTextDimensions(innerLabels).w;
        var outerLabels = axisInfo.getLabels(context, 1);
        var outerLabelWidth = outerLabels != null ? dvt.TextUtils.getMaxTextDimensions(outerLabels).w : 0;
        size += Math.max(innerLabelWidth, outerLabelWidth);
      }
      else if (axisInfo instanceof dvt.GroupAxisInfo)
        size = DvtAxisRenderer._getGroupAxisPreferredSize(axis, axisInfo, size, availWidth, bHoriz);
    }
  }

  if (bHoriz)
    return new dvt.Dimension(availWidth, Math.min(size, availHeight));
  else
    return new dvt.Dimension(Math.min(size, availWidth), availHeight);
};

/**
 * Renders the axis and updates the available space.
 * @param {dvt.Axis} axis The axis being rendered.
 * @param {dvt.Rectangle} availSpace The available space.
 */
DvtAxisRenderer.render = function(axis, availSpace) {
  // Calculate the axis extents and increments
  var axisInfo = DvtAxisRenderer._createAxisInfo(axis, availSpace);
  var options = axis.getOptions();

  if (options['rendered'] == 'off')
    return;

  axis.__setBounds(availSpace.clone());

  // Render the title
  DvtAxisRenderer._renderTitle(axis, axisInfo, availSpace);

  // Render the tick labels
  DvtAxisRenderer._renderLabels(axis, axisInfo, availSpace);
};

/**
 * Creates and returns the dvt.AxisInfo for the specified axis.
 * @param {dvt.Axis} axis The axis being rendered.
 * @param {dvt.Rectangle} availSpace The available space.
 * @return {dvt.AxisInfo}
 * @private
 */
DvtAxisRenderer._createAxisInfo = function(axis, availSpace) {
  var axisInfo = dvt.AxisInfo.newInstance(axis.getCtx(), axis.getOptions(), availSpace);
  axis.__setInfo(axisInfo);
  return axisInfo;
};

/**
 * Returns the gap between the title and the tick labels.
 * @param {dvt.Axis} axis
 * @return {number}
 * @private
 */
DvtAxisRenderer._getTitleGap = function(axis) {
  var options = axis.getOptions();
  return DvtAxisDefaults.getGapSize(axis.getCtx(), options, options['layout']['titleGap']);
};

/**
 * Renders the axis title and updates the available space.
 * @param {dvt.Axis} axis The axis being rendered.
 * @param {dvt.AxisInfo} axisInfo The axis model.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtAxisRenderer._renderTitle = function(axis, axisInfo, availSpace) {
  // Note: DvtAxisRenderer.getPreferredSize must be updated for any layout changes to this function.
  var options = axis.getOptions();
  if (!options['title'])
    return;

  // Create the title object and add to axis
  var position = options['position'];

  if (position == 'radial' || position == 'tangential')
    return; // polar chart doesn't have axis titles

  var bHoriz = (options['position'] == 'top' || options['position'] == 'bottom');
  var maxLabelWidth = bHoriz ? availSpace.w : availSpace.h;
  var maxLabelHeight = bHoriz ? availSpace.h : availSpace.w;
  var title = DvtAxisRenderer._createText(axis.getEventManager(), axis, options['title'], options['titleStyle'],
                                          0, 0, maxLabelWidth, maxLabelHeight,
                                          DvtAxisEventManager.getUIParams(DvtAxisConstants.TITLE));

  if (title) {
    // Position the title based on text size and axis position
    var gap = DvtAxisRenderer._getTitleGap(axis);
    var overflow = (axisInfo.getStartOverflow() - axisInfo.getEndOverflow()) / 2;
    var isRTL = dvt.Agent.isRightToLeft(axis.getCtx());
    var titleHeight = dvt.TextUtils.getTextHeight(title);
    title.alignCenter();

    // Position the label and update the space
    if (position == 'top') {
      title.setX(availSpace.x + overflow + availSpace.w / 2);
      title.setY(availSpace.y);
      availSpace.y += (titleHeight + gap);
      availSpace.h -= (titleHeight + gap);
    }
    else if (position == 'bottom') {
      title.setX(availSpace.x + overflow + availSpace.w / 2);
      title.setY(availSpace.y + availSpace.h - titleHeight);
      availSpace.h -= (titleHeight + gap);
    }
    else if (position == 'left') {
      title.alignMiddle();
      title.setRotation(isRTL ? Math.PI / 2 : 3 * Math.PI / 2);
      title.setTranslate(availSpace.x + titleHeight / 2, availSpace.y + availSpace.h / 2);
      availSpace.x += (titleHeight + gap);
      availSpace.w -= (titleHeight + gap);
    }
    else if (position == 'right') {
      title.alignMiddle();
      title.setRotation(isRTL ? Math.PI / 2 : 3 * Math.PI / 2);
      title.setTranslate(availSpace.x + availSpace.w - titleHeight / 2, availSpace.y + availSpace.h / 2);
      availSpace.w -= (titleHeight + gap);
    }

    axisInfo.setTitle(title);
  }
};


/**
 * Renders the tick labels and updates the available space.
 * @param {dvt.Axis} axis The axis being rendered.
 * @param {dvt.AxisInfo} axisInfo The axis model.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtAxisRenderer._renderLabels = function(axis, axisInfo, availSpace) {
  // Note: DvtAxisRenderer.getPreferredSize must be updated for any layout changes to this function.
  var options = axis.getOptions();
  if (options['tickLabel']['rendered'] == 'on') {
    // Axis labels are positioned based on the position of the axis.  In layout
    // mode, the labels will be positioned as close to the title as possible to
    // calculate the actual space used.
    var position = options['position'];
    if (position == 'top' || position == 'bottom')
      DvtAxisRenderer._renderLabelsHoriz(axis, axisInfo, availSpace);
    else if (position == 'tangential')
      DvtAxisRenderer._renderLabelsTangent(axis, axisInfo, availSpace);
    else
      DvtAxisRenderer._renderLabelsVert(axis, axisInfo, availSpace);

    // Render the label separators (applicable only to group axis)
    DvtAxisRenderer._renderGroupSeparators(axis, axisInfo, availSpace);
  }
};


/**
 * Renders tick labels for a horizontal axis and updates the available space.
 * @param {dvt.Axis} axis The axis being rendered.
 * @param {dvt.AxisInfo} axisInfo The axis model.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtAxisRenderer._renderLabelsHoriz = function(axis, axisInfo, availSpace) {
  // Note: DvtAxisRenderer.getPreferredSize must be updated for any layout changes to this function.
  // Position and add the axis labels.
  var context = axis.getCtx();
  var options = axis.getOptions();
  var position = options['position'];
  var isTickInside = options['tickLabel']['position'] == 'inside';
  var isRTL = dvt.Agent.isRightToLeft(context);
  var isGroupAxis = axisInfo instanceof dvt.GroupAxisInfo;
  var isHierarchical = isGroupAxis && axisInfo.getNumLevels() > 1;

  var levelIdx = isHierarchical ? 0 : null;
  var labels = axisInfo.getLabels(context, levelIdx);

  gap = isHierarchical ? DvtAxisDefaults.getGapSize(context, options, options['layout']['hierarchicalLabelGapHeight']) : 0;
  while (labels) {
    var height = 0;
    var maxLvlHeight = 0;

    for (var i = 0; i < labels.length; i++) {
      var label = labels[i];

      if (label == null)
        continue;

      var isMultiline = label instanceof dvt.MultilineText || label instanceof dvt.BackgroundMultilineText;

      if (axisInfo.isLabelRotated(levelIdx)) {
        // Truncate to fit. Multiline texts only need fitting here if wrap was disabled.
        var fitText = !isMultiline || (isMultiline && !label.isWrapEnabled());
        if (fitText && !dvt.TextUtils.fitText(label, availSpace.h, availSpace.w, axis))
          continue;

        //position and add the axis labels
        if (!isRTL)
          label.alignRight();
        else
          label.alignLeft();

        if (isHierarchical) {
          height = dvt.TextUtils.getTextWidth(label);
          label.setTranslateY(availSpace.h - height);
          maxLvlHeight = Math.max(maxLvlHeight, height);
        }
        else
          label.setTranslateY(availSpace.y);

      }
      else { // not rotated
        if (!isTickInside && dvt.TextUtils.guessTextDimensions(label).h - 1 > availSpace.h) // -1 to prevent rounding error ()
          continue;

        if (isHierarchical && position == 'bottom')
          label.setY(availSpace.h);
        else if (position == 'bottom')
          label.setY(availSpace.y);
        else
          label.setY(availSpace.y + availSpace.h);

        if (!isHierarchical && ((position == 'bottom' && !isTickInside) || (position == 'top' && isTickInside)))
          label.alignTop();
        else if (isHierarchical && position == 'top')
          label.alignTop();
        else
          label.alignBottom();

        if (isHierarchical)
          maxLvlHeight = Math.max(maxLvlHeight, dvt.TextUtils.guessTextDimensions(label).h);
        else if (isTickInside) {
          var gap = DvtAxisDefaults.getGapSize(context, options, options['layout']['insideLabelGapWidth']);
          isRTL ? label.alignRight() : label.alignLeft();
          label.setX(label.getX() + gap * (isRTL ? -1 : 1));
        }
      }

      // group axis labels store the true index of a label in the hierarchy of levels
      // true index necessary for getting proper attributes from axisInfo
      var index = isGroupAxis ? axisInfo.getLabelIndex(label) : i;

      // support for categorical axis tooltip and datatip
      var datatip = axisInfo.getDatatip(index, levelIdx);
      var tooltip = label.getUntruncatedTextString();
      // action support
      var action = axisInfo.getAction(index, levelIdx);
      // drilling support
      var drillable = axisInfo.isDrillable(index, levelIdx);
      var group = axisInfo.getGroup(index, levelIdx);

      // Associate with logical object to support automation and tooltips
      var params = DvtAxisEventManager.getUIParams(DvtAxisConstants.TICK_LABEL, label.getTextString(), index, levelIdx);

      axis.getEventManager().associate(label, new DvtAxisObjPeer(axis, label, group, action, drillable, tooltip, datatip, params));

      if (!isHierarchical)
        maxLvlHeight = Math.max(maxLvlHeight, dvt.TextUtils.guessTextDimensions(label).h);
      else
        axisInfo.setLastRenderedLevel(levelIdx);


      axis.addChild(label);
    }
    if (isHierarchical) {
      for (i = 0; i < labels.length; i++) {
        label = labels[i];
        if (label == null)
          continue;

        var isRotated = axisInfo.isLabelRotated(levelIdx);
        var isOuterLevel = levelIdx < axisInfo.getNumLevels() - 1;
        if (!isRotated && isOuterLevel) {
          // non-rotated outer multiline texts need height adjustment to center
          label.setY(availSpace.h - maxLvlHeight / 2);
          label.alignMiddle();
        }
        else // all rotated texts need height adjustment
          label.setTranslateY(availSpace.h - maxLvlHeight);
      }

      availSpace.y += maxLvlHeight + gap;
      availSpace.h -= maxLvlHeight + gap;
      levelIdx++;
      labels = axisInfo.getLabels(axis.getCtx(), levelIdx);
    }
    else {
      availSpace.y += maxLvlHeight;
      availSpace.h -= maxLvlHeight;
      labels = null;
    }
  }

  // Render the nested labels (level 2) for time axis.
  if (axisInfo instanceof dvt.TimeAxisInfo) {
    labels = axisInfo.getLabels(axis.getCtx());
    var lv2Labels = axisInfo.getLabels(axis.getCtx(), 1);
    var offset = 0;

    if (lv2Labels != null) {
      for (i = 0; i < lv2Labels.length; i++) {
        label = lv2Labels[i];
        if (label == null)
          continue;
        if (dvt.TextUtils.guessTextDimensions(label).h - 1 > availSpace.h) // -1 to prevent rounding error ()
          continue;

        // Associate with logical object to support automation and tooltips
        axis.getEventManager().associate(label, new dvt.SimpleObjPeer(null, null, null, DvtAxisEventManager.getUIParams(DvtAxisConstants.TICK_LABEL, label.getTextString())));

        // align with level 1 label
        var overflow1 = 0;
        var overflow2 = 0;
        var maxOverflow = axisInfo.getOptions()['_maxOverflowCoord'];
        var minOverflow = axisInfo.getOptions()['_minOverflowCoord'];
        if (labels[i] != null) {
          offset = labels[i].measureDimensions().w / 2;
          overflow1 = axisInfo._level1Overflow[i];
          overflow2 = axisInfo._level2Overflow[i];
        }

        // Code below skips attempt to align level2 label if it overflows and level1 label does not
        // This is because if the level2 label overflows it should not be moved inward, else we risk creating a label overlap
        if (overflow1 == 0 && overflow2 == 0) {
          // Check that shifting by offset will not cause overflow
          var x = label.getX();
          var newCoord;
          if (isRTL) {
            newCoord = x + offset <= maxOverflow ? x + offset : maxOverflow;
            label.setX(newCoord);
          }
          else {
            newCoord = x - offset >= minOverflow ? x - offset : minOverflow;
            label.setX(newCoord);
          }
        }
        else if (overflow1 < 0) // level1 label is at the left edge, push level2 label out to minOverflow coord
          label.setX(minOverflow);
        else if (overflow1 > 0)  // level1 label is at the right edge, push level2 label out to maxOverflow coord
          label.setX(maxOverflow);


        label.alignTop();
        label.setY(availSpace.y);
        axis.addChild(label);
      }
    }
  }
};


/**
 * Renders tick labels for a vertical axis and updates the available space.
 * @param {dvt.Axis} axis The axis being rendered.
 * @param {dvt.AxisInfo} axisInfo The axis model.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtAxisRenderer._renderLabelsVert = function(axis, axisInfo, availSpace) {
  // Note: DvtAxisRenderer.getPreferredSize must be updated for any layout changes to this function.
  var options = axis.getOptions();
  var position = options['position'];
  var context = axis.getCtx();
  var isRTL = dvt.Agent.isRightToLeft(context);
  var isNumerical = axisInfo instanceof dvt.DataAxisInfo;
  var isTickInside = options['tickLabel']['position'] == 'inside';
  var labels;
  var gap;
  var maxLvlWidth;
  var isGroupAxis = axisInfo instanceof dvt.GroupAxisInfo;
  var isHierarchical = isGroupAxis && axisInfo.getNumLevels() > 1;

  // Hierarchical group axis labels
  var levelIdx = isHierarchical ? 0 : null;
  labels = axisInfo.getLabels(axis.getCtx(), levelIdx);

  var labelX = 0;
  if (!isHierarchical) {
    // Categorical and time labels are aligned left is position=right, aligned right if position=left.
    // Numerical labels are always aligned right.
    if (position == 'radial') {
      gap = DvtAxisDefaults.getGapSize(context, options, options['layout']['radialLabelGap']);
      labelX = availSpace.x + availSpace.w / 2;
      if (isRTL)
        labelX += gap + dvt.TextUtils.getMaxTextDimensions(labels).w;
      else
        labelX -= gap;
    }
    else if (position == 'left') {
      labelX = availSpace.x + availSpace.w;
      if (isNumerical && isTickInside)
        labelX += dvt.TextUtils.getMaxTextDimensions(labels).w;
    }
    else { // position == 'right'
      labelX = availSpace.x;
      if (isNumerical && !isTickInside)
        labelX += dvt.TextUtils.getMaxTextDimensions(labels).w;
    }
  }
  else {
    gap = DvtAxisDefaults.getGapSize(context, options, options['layout']['hierarchicalLabelGapWidth']);
    maxLvlWidth = dvt.TextUtils.getMaxTextDimensions(labels).w;
  }


  var formatLabelVert = function(label, index) {
    var isMultiline = label instanceof dvt.MultilineText || label instanceof dvt.BackgroundMultilineText;
    var fitText = !isMultiline || (isMultiline && !label.isWrapEnabled()); // Multiline texts only need fitting if wrap was disabled.

    if (isHierarchical && dvt.TextUtils.getMaxTextDimensions(labels).w - 1 > availSpace.w) // -1 to prevent rounding error ()
      return;
    else if (!isHierarchical && !isTickInside && fitText && !dvt.TextUtils.fitText(label, availSpace.w, availSpace.h, axis))
      return;

    // group axis labels store the true index of a label in the hierarchy of levels
    // true index necessary for getting proper attributes from axisInfo
    index = isGroupAxis ? axisInfo.getLabelIndex(label) : index;

    // support for categorical axis tooltip and datatip
    var datatip = axisInfo.getDatatip(index, levelIdx);
    var tooltip = label.getUntruncatedTextString();
    // action support
    var action = axisInfo.getAction(index, levelIdx);
    // drilling support
    var drillable = axisInfo.isDrillable(index, levelIdx);
    var group = axisInfo.getGroup(index, levelIdx);

    // Associate with logical object to support automation and tooltips
    var params = DvtAxisEventManager.getUIParams(DvtAxisConstants.TICK_LABEL, label.getTextString(), index, levelIdx);

    axis.getEventManager().associate(label, new DvtAxisObjPeer(axis, label, group, action, drillable, tooltip, datatip, params));

    if (!isHierarchical) {
      label.setX(labelX);
      if (!isNumerical && position == 'right')
        label.alignLeft();
      else
        label.alignRight();

      if (isTickInside) {
        label.alignBottom();
        label.setY(label.getY() - DvtAxisDefaults.getGapSize(context, options, options['layout']['insideLabelGapHeight']));
      }

      if (position == 'radial') {
        var labelY = label.getY();
        label.setY(availSpace.y + availSpace.h / 2 - labelY);

        // draw bounding box to improve readability
        var bboxDims = label.getDimensions();
        var padding = bboxDims.h * 0.15;
        var cmd = dvt.PathUtils.roundedRectangle(bboxDims.x - padding, bboxDims.y, bboxDims.w + 2 * padding, bboxDims.h, 2, 2, 2, 2);
        var bbox = new dvt.Path(axis.getCtx(), cmd);
        var bgColor = label.getCSSStyle().getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
        var opacity = labelY + bboxDims.h / 2 > axisInfo.getEndCoord() && axis.getOptions()['polarGridShape'] == 'circle' ? 1 : 0.3;
        if (bgColor)
          bbox.setSolidFill(bgColor);
        else
          bbox.setSolidFill('#FFFFFF', opacity);
        axis.addChild(bbox);
      }
    }
    else {
      label.alignRight();
      label.setX(isRTL ? availSpace.w : availSpace.x + maxLvlWidth);
      axisInfo.setLastRenderedLevel(levelIdx);
    }
    axis.addChild(label);
  };

  while (labels) {
    for (var i = 0; i < labels.length; i++) {
      var label = labels[i];
      if (label != null)
        formatLabelVert(label, i);
    }
    if (isHierarchical) {
      availSpace.x += maxLvlWidth + gap;
      availSpace.w -= maxLvlWidth + gap;
      levelIdx++;
      labels = axisInfo.getLabels(axis.getCtx(), levelIdx);
      maxLvlWidth = labels ? dvt.TextUtils.getMaxTextDimensions(labels).w : null;
    }
    else
      break;
  }

  if (axisInfo instanceof dvt.TimeAxisInfo) {
    // Render the nested labels (level 2).
    var lv2Labels = axisInfo.getLabels(axis.getCtx(), 1);
    if (lv2Labels != null) {
      for (i = 0; i < lv2Labels.length; i++) {
        label = lv2Labels[i];
        if (label != null)
          formatLabelVert(label, i);
      }
    }
  }
};


/**
 * Renders tick labels for a tangential axis and updates the available space.
 * @param {dvt.Axis} axis The axis being rendered.
 * @param {dvt.AxisInfo} axisInfo The axis model.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtAxisRenderer._renderLabelsTangent = function(axis, axisInfo, availSpace) {
  var labels = axisInfo.getLabels(axis.getCtx());
  for (var i = 0; i < labels.length; i++) {
    var label = labels[i];
    if (label == null)
      continue;
    var maxWidth = availSpace.w / 2 - Math.abs(label.getX());
    var maxHeight = availSpace.h / 2 - Math.abs(label.getY());
    if (dvt.TextUtils.fitText(label, maxWidth, maxHeight, axis)) { // truncation

      // group axis labels store the true index of a label in the hierarchy of levels
      // true index necessary for getting proper attributes from axisInfo
      var index = axisInfo instanceof dvt.GroupAxisInfo ? axisInfo.getLabelIndex(label) : i;

      // support for categorical axis tooltip and datatip
      var datatip = axisInfo.getDatatip(index);
      var tooltip = label.getUntruncatedTextString();
      // action support
      var action = axisInfo.getAction(index);
      // drilling support
      var drillable = axisInfo.isDrillable(index);
      var group = axisInfo.getGroup(index);

      // Associate with logical object to support automation and tooltips
      var params = DvtAxisEventManager.getUIParams(DvtAxisConstants.TICK_LABEL, label.getTextString(), index);
      axis.getEventManager().associate(label, new DvtAxisObjPeer(axis, label, group, action, drillable, tooltip, datatip, params));

      label.setTranslateX(availSpace.x + availSpace.w / 2);
      label.setTranslateY(availSpace.y + availSpace.h / 2);
      axis.addChild(label);
    }
  }
};


/**
 * Creates and adds a DvtText object to a container. Will truncate and add tooltip as necessary.
 * @param {dvt.EventManager} eventManager
 * @param {dvt.Container} container The container to add the text object to.
 * @param {String} textString The text string of the text object.
 * @param {dvt.CSSStyle} cssStyle The css style to apply to the text object.
 * @param {number} x The x coordinate of the text object.
 * @param {number} y The y coordinate of the text object.
 * @param {number} width The width of available text space.
 * @param {number} height The height of the available text space.
 * @param {object} params Additional parameters that will be passed to the logical object.
 * @return {dvt.OutputText} The created text object. Can be null if no text object could be created in the given space.
 * @private
 */
DvtAxisRenderer._createText = function(eventManager, container, textString, cssStyle, x, y, width, height, params) {
  var text = new dvt.OutputText(container.getCtx(), textString, x, y);
  text.setCSSStyle(cssStyle);
  if (dvt.TextUtils.fitText(text, width, height, container)) {
    // Associate with logical object to support automation and truncation
    eventManager.associate(text, new dvt.SimpleObjPeer(text.getUntruncatedTextString(), null, null, params));
    return text;
  }
  else
    return null;
};


/**
 * Renders the separators between group labels
 * @param {dvt.Axis} axis The axis being rendered.
 * @param {dvt.AxisInfo} axisInfo The axis model.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtAxisRenderer._renderGroupSeparators = function(axis, axisInfo, availSpace) {
  if (axisInfo instanceof dvt.GroupAxisInfo && axisInfo.areSeparatorsRendered()) {
    var numLevels = axisInfo.getNumLevels();
    if (numLevels <= 1 || axisInfo.getLastRenderedLevel() <= 0) // only draw separators when there is more than one level
      return;

    var options = axis.getOptions();
    var position = options['position'];
    var isHoriz = (position == 'top' || position == 'bottom');
    var context = axis.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);

    var color = axisInfo.getSeparatorColor();
    var lineStroke = new dvt.SolidStroke(color, 1, 1);
    var prevLevelSize = 0;
    var gap = isHoriz ? DvtAxisDefaults.getGapSize(context, options, options['layout']['hierarchicalLabelGapHeight']) : DvtAxisDefaults.getGapSize(context, options, options['layout']['hierarchicalLabelGapWidth']);
    var startOffset = options['startGroupOffset'];
    var endOffset = options['endGroupOffset'];

    var x1, y1, x2, y2, x3, x4;
    /*
     * orientation = 'vertical'                     if rotated:
     * (x1, y1)                        (x2, y1)     (x1, y1)                 (x2, y1)
     *    |                               |            |     rotated label      |
     *    ------------- label -------------            --------------------------
     * (x1, y2)    (x3, y2)(x4, y2)    (x2, y2)     (x1, y2)                 (x2, y2)
     *
     *
     * orientation = 'horizontal'
     * (x1, y1) _______ (x2, y1)
     *         |
     *         |
     *         | label
     *         |
     *         |
     * (x1, y2) _______ (x2, y2)
     */

    // process from the innermost level that was rendered
    for (var level = axisInfo.getLastRenderedLevel(); level >= 0; level--) {
      var labels = axisInfo.getLabels(axis.getCtx(), level);
      var maxDims = dvt.TextUtils.getMaxTextDimensions(labels);
      var isRotated = axisInfo.isLabelRotated(level);
      var levelSize = isRotated || !isHoriz ? maxDims.w : maxDims.h;

      if (levelSize == 0) { // no labels to draw separators between
        prevLevelSize = levelSize;
        continue;
      }

      // variables to keep track of whether certain edge cases apply
      var prevLabelRendered = false; // previous label exists, does not have blank name, and is within the viewport
      var prevLabelEmpty = null; // previous label exists, but has a blank name (uneven heirarchy)

      // Start drawing separators from second innermost level rendered.
      if (level < axisInfo.getLastRenderedLevel()) {
        for (var i = 0; i < labels.length; i++) {
          var label = labels[i];
          if (label == null)
            continue;

          var index = axisInfo.getLabelIndex(label);
          var isEmptyLabel = axisInfo.getLabelAt(index, level).length == 0;  // label exists, but has a blank name (uneven heirarchy)

          if (isEmptyLabel)
            continue;

          // empty label at first or last position in the outermost level
          var eraseCornerEdge = isEmptyLabel && level == 0 && (index == 0 || index == labels.length - 1);

          var isFirstLabel = label && labels[index - 1] == null;
          var isLastLabel = label && labels[index + 1] == null;

          var start = axisInfo.getStartIndex(index, level);
          var end = axisInfo.getEndIndex(index, level);

          if (isHoriz) { // HORIZONTAL AXIS SEPARATORS

            // draw vertical lines, when necessary, around label
            if (label) {
              var yCoord;
              if (label instanceof dvt.MultilineText || label instanceof dvt.BackgroundMultilineText)
                yCoord = label.getYAlignCoord();
              else
                yCoord = label.getY();

              x1 = axisInfo.getCoordAt(start - startOffset);
              y1 = !isRotated ? yCoord - (levelSize / 2) - (prevLevelSize * .5) - gap : yCoord + prevLevelSize * .5;
              x2 = axisInfo.getCoordAt(end + endOffset);
              y2 = !isRotated ? yCoord : yCoord + levelSize + prevLevelSize + 2 * gap;

              if ((!isEmptyLabel || !eraseCornerEdge) && prevLabelRendered == false && x1 != null)
                DvtAxisRenderer._addSeparatorLine(axis, lineStroke, x1, y2, x1, y1);

              if (x2 != null && !eraseCornerEdge)
                DvtAxisRenderer._addSeparatorLine(axis, lineStroke, x2, y2, x2, y1);
            }

            // draw horizontal lines, when necessary, around non-empty labels
            if (!isEmptyLabel) {

              if (label)
                var labelWidth = isRotated ? dvt.TextUtils.getTextHeight(label) : dvt.TextUtils.getTextWidth(label);

              x1 = (isFirstLabel && prevLabelEmpty == false) ? axisInfo.getStartCoord() : axisInfo.getBoundedCoordAt(start - startOffset);
              if (isFirstLabel)
                isFirstLabel = false;
              var nextLabel = axisInfo.getLabelAt(index + 1, level);
              x2 = (isLastLabel && nextLabel && nextLabel.length > 0) ? axisInfo.getEndCoord() : axisInfo.getBoundedCoordAt(end + endOffset);

              x3 = label ? (isRTL ? label.getX() + (labelWidth * .5) : label.getX() - (labelWidth * .5)) : axisInfo.getBoundedCoordAt(end + endOffset);
              x4 = label ? (isRTL ? label.getX() - (labelWidth * .5) : label.getX() + (labelWidth * .5)) : axisInfo.getBoundedCoordAt(start - startOffset);

              if (label) {
                if (isRotated) // draw horizontal line beneath rotated label
                  DvtAxisRenderer._addSeparatorLine(axis, lineStroke, x1, y2, x2, y2);
                else { // draw horizontal lines on either size of rendered label
                  var spacing = isRTL ? -dvt.TextUtils.getTextHeight(label) * .5 : dvt.TextUtils.getTextHeight(label) * .5; // small space between end of horizontal lines and label
                  var drawRightLine = isRTL ? x1 > x3 - spacing : x1 < x3 - spacing;
                  var drawLeftLine = isRTL ? x4 + spacing > x2 : x4 + spacing < x2;

                  if (drawRightLine)
                    DvtAxisRenderer._addSeparatorLine(axis, lineStroke, x1, y2, x3 - spacing, y2);

                  if (drawLeftLine)
                    DvtAxisRenderer._addSeparatorLine(axis, lineStroke, x4 + spacing, y2, x2, y2);
                }
              }
            }
          }
          else { // VERTICAL AXIS SEPARATORS

            // draw horizontal lines, when necessary, around label
            if (label) {

              x1 = !isRTL ? label.getX() + gap * .5 : label.getX() - levelSize - gap * .5;
              y1 = axisInfo.getCoordAt(start - startOffset);
              x2 = !isRTL ? label.getX() - levelSize - gap * .5 : label.getX() + gap * .5;
              y2 = axisInfo.getCoordAt(end + endOffset);

              if (((!isEmptyLabel && prevLabelRendered == false) || (index == 0 && isEmptyLabel && level != 0)) && y1 != null)
                DvtAxisRenderer._addSeparatorLine(axis, lineStroke, x1, y1, x2, y1);

              if (y2 != null && !eraseCornerEdge)
                DvtAxisRenderer._addSeparatorLine(axis, lineStroke, x2, y2, x1, y2);
            }

            // draw vertical lines, when necessary, around non-empty labels
            if (!isEmptyLabel) {
              y1 = (isFirstLabel && prevLabelEmpty == false) ? 0 : axisInfo.getBoundedCoordAt(start - startOffset);
              if (isFirstLabel)
                isFirstLabel = false;
              nextLabel = axisInfo.getLabelAt(index + 1, level);
              y2 = (isLastLabel && nextLabel && nextLabel.length > 0) ? axisInfo.getEndCoord() : axisInfo.getBoundedCoordAt(end + endOffset);

              if (label) // draw vertical line around label
                DvtAxisRenderer._addSeparatorLine(axis, lineStroke, x2, y1, x2, y2);
            }
          }
          // information about previous label
          prevLabelRendered = (!isEmptyLabel && label != null);
          prevLabelEmpty = label != null || (label == null && isEmptyLabel); //TODO TAMIKA: IS THIS NECESSARY
        }
      }
      prevLevelSize = levelSize; // save height or width of previous level
    }
  }
  return;
};

/**
 * Renders separator line
 * @param {dvt.Axis} axis The axis on which the separators are rendered.
 * @param {dvt.SolidStroke} lineStroke The stroke for the line.
 * @param {Number} x1 The first xCoordinate of the line.
 * @param {Number} y1 The first yCoordinate of the line.
 * @param {Number} x2 The second xCoordinate of the line.
 * @param {Number} y2 The second yCoordinate of the line.
 * @private
 */
DvtAxisRenderer._addSeparatorLine = function(axis, lineStroke, x1, y1, x2, y2) {
  var line = new dvt.Line(axis.getCtx(), x1, y1, x2, y2);
  line.setStroke(lineStroke);
  line.setPixelHinting(true);
  axis.addChild(line);

  return;
};

/**
 * Gets the preferred size for a group axis, which may include hierarchical labels
 * @param {dvt.Axis} axis The axis
 * @param {dvt.GroupAxisInfo} axisInfo The group axis info
 * @param {Number} size The current preferred size of the axis
 * @param {Number} availSize The maximum availHeight or availWidth of the axis
 * @param {Boolean} bHoriz Whether or not the axis is vertical of horizontal
 * @return {Number}
 * @private
 */
DvtAxisRenderer._getGroupAxisPreferredSize = function(axis, axisInfo, size, availSize, bHoriz) {
  var context = axis.getCtx();
  var options = axis.getOptions();
  var numLevels = axisInfo.getNumLevels();
  var gapName = bHoriz ? 'hierarchicalLabelGapHeight' : 'hierarchicalLabelGapWidth';
  var gap = numLevels > 1 ? DvtAxisDefaults.getGapSize(context, options, options['layout'][gapName]) : 0;
  for (var level = 0; level < numLevels; level++) { // allocate space outermost to innermost
    var labels = axisInfo.getLabels(context, level);
    var labelSize; // corresponds to label height if bHoriz, label width if not

    if (bHoriz) {
      var maxDims = dvt.TextUtils.getMaxTextDimensions(labels);
      labelSize = axisInfo.isLabelRotated(level) ? maxDims.w : maxDims.h;
    }
    else
      labelSize = dvt.TextUtils.getMaxTextDimensions(labels).w;

    if (size + labelSize <= availSize)
      size += labelSize + gap;
    else {
      if (level == 0) // Outermost level labels were too big, assign all of availSize
        size = availSize;
      break;
    }
  }
  if (level != 0)
    size -= gap; // last hierarchical level rendered doesn't need gap

  return size;
};
/**
 * Calculated axis information and drawable creation.  This class should
 * not be instantiated directly.
 * @class
 * @constructor
 * @extends {dvt.Obj}
 */
dvt.AxisInfo = function() {};

dvt.Obj.createSubclass(dvt.AxisInfo, dvt.Obj);


/**
 * Creates an appropriate instance of dvt.AxisInfo with the specified parameters.
 * @param {dvt.Context} context
 * @param {object} options The object containing specifications and data for this component.
 * @param {dvt.Rectangle} availSpace The available space.
 * @return {dvt.AxisInfo}
 */
dvt.AxisInfo.newInstance = function(context, options, availSpace) {
  if (options['timeAxisType'] && options['timeAxisType'] != 'disabled')
    return new dvt.TimeAxisInfo(context, options, availSpace);
  else if (isNaN(options['dataMin']) && isNaN(options['dataMax']))
    return new dvt.GroupAxisInfo(context, options, availSpace);
  else
    return new dvt.DataAxisInfo(context, options, availSpace);
};


/**
 * Calculates and stores the axis information.
 * @param {dvt.Context} context
 * @param {object} options The object containing specifications and data for this component.
 * @param {dvt.Rectangle} availSpace The available space.
 * @protected
 */
dvt.AxisInfo.prototype.Init = function(context, options, availSpace) {
  this._context = context;

  // Figure out the start and end coordinate of the axis
  this.Position = options['position'];
  this._radius = options['_radius']; // for polar charts
  this._title = null;

  if (this.Position == 'top' || this.Position == 'bottom') {
    this.StartCoord = availSpace.x;
    this.EndCoord = availSpace.x + availSpace.w;
  }
  else if (this.Position == 'left' || this.Position == 'right') {
    this.StartCoord = availSpace.y;
    this.EndCoord = availSpace.y + availSpace.h;
  }
  else if (this.Position == 'radial') {
    this.StartCoord = 0;
    this.EndCoord = this._radius;
  }
  else if (this.Position == 'tangential') {
    if (dvt.Agent.isRightToLeft(context)) {
      this.StartCoord = 2 * Math.PI;
      this.EndCoord = 0;
    }
    else {
      this.StartCoord = 0;
      this.EndCoord = 2 * Math.PI;
    }
  }

  // Axis min and max value. Subclasses should set.
  this.MinValue = null;
  this.MaxValue = null;
  this.GlobalMin = null;
  this.GlobalMax = null;
  this.DataMin = null;
  this.DataMax = null;

  // Set the maximum zoom for this axis
  this.MinViewportExtent = null;

  // The overflows at the two ends of the axis
  this.StartOverflow = 0;
  this.EndOverflow = 0;

  // Sets the buffers (the maximum amount the labels can go over before they overflow)
  if (options['leftBuffer'] == null)
    options['leftBuffer'] = Infinity;
  if (options['rightBuffer'] == null)
    options['rightBuffer'] = Infinity;

  // Store the options object
  this.Options = options;
};


/**
 * Returns the dvt.Context associated with this instance.
 * @return {dvt.Context}
 */
dvt.AxisInfo.prototype.getCtx = function() {
  return this._context;
};


/**
 * Returns the options settings for the axis.
 * @return {object} The options for the axis.
 */
dvt.AxisInfo.prototype.getOptions = function() {
  return this.Options;
};


/**
 * Returns an array containing the tick labels for this axis.
 * @param {dvt.Context} context
 * @param {Number} levelIdx The level index (optional). 0 indicates the first level, 1 the second, etc. If skipped, 0 (the first level) is assumed.
 * @return {Array} The Array of DvtText objects.
 */
dvt.AxisInfo.prototype.getLabels = function(context, levelIdx) {
  return null; // subclasses should override
};


/**
 * Returns the title for this axis.
 * @return {DvtText} The DvtText object, if it exists.
 */
dvt.AxisInfo.prototype.getTitle = function() {
  return this._title;
};

/**
 * Sets the title for this axis.
 * @param {DvtText} title The axis title.
 */
dvt.AxisInfo.prototype.setTitle = function(title) {
  this._title = title;
};


/**
 * Returns the coordinates of the major ticks.
 * @return {array} Array of coords.
 */
dvt.AxisInfo.prototype.getMajorTickCoords = function() {
  return []; // subclasses should override
};

/**
 * Returns the coordinates of the minor ticks.
 * @return {array} Array of coords.
 */
dvt.AxisInfo.prototype.getMinorTickCoords = function() {
  return []; // subclasses should override
};


/**
 * Returns the coordinates of the baseline (value = 0). Only applies to numerical axis.
 * @return {number} Baseline coord.
 */
dvt.AxisInfo.prototype.getBaselineCoord = function() {
  return null; // subclasses should override
};


/**
 * Returns the value for the specified coordinate along the axis.  Returns null
 * if the coordinate is not within the axis.
 * @param {number} coord The coordinate along the axis.
 * @return {object} The value at that coordinate.
 */
dvt.AxisInfo.prototype.getValueAt = function(coord) {
  if (coord == null)
    return null;

  var minCoord = Math.min(this.StartCoord, this.EndCoord);
  var maxCoord = Math.max(this.StartCoord, this.EndCoord);

  // Return null if the coord is outside of the axis
  if (coord < minCoord || coord > maxCoord)
    return null;

  return this.getUnboundedValueAt(coord);
};


/**
 * Returns the coordinate for the specified value.  Returns null if the value is
 * not within the axis.
 * @param {object} value The value to locate.
 * @return {number} The coordinate for the value.
 */
dvt.AxisInfo.prototype.getCoordAt = function(value) {
  if (value == null)
    return null;

  if (value < this.MinValue || value > this.MaxValue)
    return null;
  else
    return this.getUnboundedCoordAt(value);
};


/**
 * Returns the value for the specified coordinate along the axis.  If a coordinate
 * is not within the axis, returns the value of the closest coordinate within the axis.
 * @param {number} coord The coordinate along the axis.
 * @return {object} The value at that coordinate.
 */
dvt.AxisInfo.prototype.getBoundedValueAt = function(coord) {
  if (coord == null)
    return null;

  var minCoord = Math.min(this.StartCoord, this.EndCoord);
  var maxCoord = Math.max(this.StartCoord, this.EndCoord);

  if (coord < minCoord)
    coord = minCoord;
  else if (coord > maxCoord)
    coord = maxCoord;

  return this.getUnboundedValueAt(coord);
};


/**
 * Returns the coordinate for the specified value along the axis.  If a value
 * is not within the axis, returns the coordinate of the closest value within the axis.
 * @param {object} value The value to locate.
 * @return {number} The coordinate for the value.
 */
dvt.AxisInfo.prototype.getBoundedCoordAt = function(value) {
  if (value == null)
    return null;

  if (value < this.MinValue)
    value = this.MinValue;
  else if (value >= this.MaxValue)
    value = this.MaxValue;

  return this.getUnboundedCoordAt(value);
};


/**
 * Returns the value for the specified coordinate along the axis.
 * @param {number} coord The coordinate along the axis.
 * @return {object} The value at that coordinate.
 */
dvt.AxisInfo.prototype.getUnboundedValueAt = function(coord) {
  return null; // subclasses should override
};


/**
 * Returns the coordinate for the specified value.
 * @param {object} value The value to locate.
 * @return {number} The coordinate for the value.
 */
dvt.AxisInfo.prototype.getUnboundedCoordAt = function(value) {
  return null; // subclasses should override
};


/**
 * Returns the datatip for the label at the given index and level.
 * @param {number} index
 * @param {number} level
 * @return {string} The datatip.
 */
dvt.AxisInfo.prototype.getDatatip = function(index, level) {
  return null; // subclasses should override
};


/**
 * Returns an object with the label's background labelStyles applied
 * @param {dvt.OutputText} label The label.
 * @param {dvt.Context} context
 * @return {dvt.Rect} The object to be rendered behind the label.
 */
dvt.AxisInfo.prototype.getLabelBackground = function(label, context) {
  return null; // subclasses should override
};


/**
 * Returns the action for the label with the given index
 * @param {number} index The label index.
 * @return {object} The action
 */
dvt.AxisInfo.prototype.getAction = function(index) {
  return null; // subclasses should override
};

/**
 * Returns whether the label at the given index is drillable
 * @param {number} index The label index.
 * @return {boolean} Whether the label is drillable.
 */
dvt.AxisInfo.prototype.isDrillable = function(index) {
  return null; // subclasses should override
};


/**
 * Returns the baseline coordinate for the axis, if applicable.
 * @return {number} The baseline coordinate for the axis.
 */
dvt.AxisInfo.prototype.getBaselineCoord = function() {
  return null;
};


/**
 * Returns if the labels of the horizontal axis are rotated by 90 degrees.
 * @return {boolean} Whether the labels are rotated.
 */
dvt.AxisInfo.prototype.isLabelRotated = function() {
  return false;
};


/**
 * Creates a DvtText instance for the specified text label.
 * @param {dvt.Context} context
 * @param {string} label The label string.
 * @param {number} coord The coordinate for the text.
 * @param {dvt.CSSStyle=} style Optional style for the text label.
 * @param {boolean=} bMultiline Optional boolean to create dvt.MultilineText
 * @return {dvt.OutputText|dvt.BackgroundOutputText|dvt.MultilineText}
 * @protected
 */
dvt.AxisInfo.prototype.CreateLabel = function(context, label, coord, style, bMultiline) {
  var text;

  if (this.Position == 'tangential') {
    var vTol = 16 / 180 * Math.PI; // the mid area (15 degrees) where labels will be middle aligned.
    var hTol = 1 / 180 * Math.PI; // the tolerance (1 degree) where labels will be center aligned.

    var offset = 0.5 * this.getTickLabelHeight();
    var dist = this._radius + offset;
    if (coord < hTol || coord > 2 * Math.PI - hTol)
      dist += offset; // avoild collision with radial label

    var xcoord = Math.round(dist * Math.sin(coord));
    var ycoord = Math.round(-dist * Math.cos(coord));
    text = style ? new dvt.BackgroundOutputText(context, label, xcoord, ycoord, style) : new dvt.OutputText(context, label, xcoord, ycoord);

    // Align the label according to the angular position
    if (coord < hTol || Math.abs(coord - Math.PI) < hTol || coord > 2 * Math.PI - hTol)
      text.alignCenter();
    else if (coord < Math.PI)
      text.alignLeft();
    else
      text.alignRight();

    if (Math.abs(coord - Math.PI / 2) < vTol || Math.abs(coord - 3 * Math.PI / 2) < vTol)
      text.alignMiddle();
    else if (coord < Math.PI / 2 || coord > 3 * Math.PI / 2)
      text.alignBottom();
    else
      text.alignTop();
  }
  else {
    if (bMultiline)
      text = style ? new dvt.BackgroundMultilineText(context, label, coord, coord, style) : new dvt.MultilineText(context, label, coord, coord);
    else {
      text = style ? new dvt.BackgroundOutputText(context, label, coord, coord, style) : new dvt.OutputText(context, label, coord, coord);
      text.alignMiddle();
    }
    text.alignCenter();
  }
  if ((text instanceof dvt.OutputText) || (text instanceof dvt.MultilineText)) // DvtBackgroundTexts already created with its CSSStyle
    text.setCSSStyle(this.Options['tickLabel']['style']);
  return text;
};


/**
 * Checks all the labels for the axis and returns whether they overlap.
 * @param {Array} labelDims An array of dvt.Rectangle objects that describe the x, y, height, width of the axis labels.
 * @param {number} skippedLabels The number of labels to skip. If skippedLabels is 1 then every other label will be skipped.
 * @return {boolean} True if any labels overlap.
 * @protected
 */
dvt.AxisInfo.prototype.IsOverlapping = function(labelDims, skippedLabels) {
  // If there are no labels, return
  if (!labelDims || labelDims.length <= 0)
    return false;

  var isVert = (this.Position == 'left' || this.Position == 'right' || this.Position == 'radial');
  var isRTL = dvt.Agent.isRightToLeft(this.getCtx());
  var gap = this.GetTickLabelGapSize();

  var pointA1, pointA2, pointB1, pointB2;
  for (var j = 0; j < labelDims.length; j += skippedLabels + 1) {
    if (labelDims[j] == null)
      continue;

    if (pointA1 == null || pointA2 == null) {
      // Set the first points
      if (isVert) {
        pointA1 = labelDims[j].y;
        pointA2 = labelDims[j].y + labelDims[j].h;
      } else {
        pointA1 = labelDims[j].x;
        pointA2 = labelDims[j].x + labelDims[j].w;
      }
      continue;
    }

    if (isVert) {
      pointB1 = labelDims[j].y;
      pointB2 = labelDims[j].y + labelDims[j].h;

      // Broken apart for clarity, next label may be above or below
      if (pointB1 >= pointA1 && pointB1 - gap < pointA2) // next label below
        return true;
      else if (pointB1 < pointA1 && pointB2 + gap > pointA1) // next label above
        return true;
    }
    else {
      pointB1 = labelDims[j].x;
      pointB2 = labelDims[j].x + labelDims[j].w;

      // Broken apart for clarity, next label is on the right for non-BIDI, left for BIDI
      if (!isRTL && (pointB1 - gap < pointA2))
        return true;
      else if (isRTL && (pointB2 + gap > pointA1))
        return true;
    }

    // Otherwise start evaluating from label j
    pointA1 = pointB1;
    pointA2 = pointB2;
  }
  return false;
};

/**
 * Compares two label dimensions and returns whether they overlap.
 * @param {Object} labelDims1 An object that describes the x, y, height, width of the first label.
 * @param {Object} labelDims2 An object that describes the x, y, height, width of the second label.
 * @return {boolean} True if the label dimensions overlap.
 * @protected
 */
dvt.AxisInfo.prototype.IsOverlappingDims = function(labelDims1, labelDims2) {
  if (!labelDims1 || !labelDims2)
    return false;

  var pointA1 = labelDims1.y;
  var pointA2 = labelDims1.y + labelDims1.h;
  var pointA3 = labelDims1.x;
  var pointA4 = labelDims1.x + labelDims1.w;

  var pointB1 = labelDims2.y;
  var pointB2 = labelDims2.y + labelDims2.h;
  var pointB3 = labelDims2.x;
  var pointB4 = labelDims2.x + labelDims2.w;

  var widthOverlap = (pointA3 <= pointB3 && pointB3 <= pointA4) ||
                     (pointA3 <= pointB4 && pointB4 <= pointA4) ||
                     (pointB3 <= pointA3 && pointA3 <= pointB4) ||
                     (pointB3 <= pointA4 && pointA4 <= pointB4);
  var heightOverlap = (pointB1 >= pointA1 && pointB1 < pointA2) || (pointB1 <= pointA1 && pointB2 >= pointA1);

  return (widthOverlap && heightOverlap);

};

/**
 * Returns the tick label gap size.
 * @return {number}
 * @protected
 */
dvt.AxisInfo.prototype.GetTickLabelGapSize = function() {
  // Create gap based on tick label height
  // GroupAxis and TimeAxis have smaller gaps since these axes become less useable as more labels are dropped
  var labelHeight = this.getTickLabelHeight();
  var gapHoriz = (this instanceof dvt.GroupAxisInfo) ? labelHeight * 0.24 : labelHeight * 0.79;
  var gapVert = (this instanceof dvt.GroupAxisInfo) ? labelHeight * 0.08 : labelHeight * 0.28;

  var isVert = (this.Position == 'left' || this.Position == 'right' || this.Position == 'radial');
  return (isVert || this.isLabelRotated()) ? gapVert : gapHoriz;
};

/**
 * Returns the tick label height in px.
 * @return {number}
 */
dvt.AxisInfo.prototype.getTickLabelHeight = function() {
  return dvt.TextUtils.getTextStringHeight(this.getCtx(), this.Options['tickLabel']['style']);
};


/**
 * Checks the labels for the axis and skips them as necessary.
 * @param {Array} labels An array of DvtText labels for the axis.
 * @param {Array} labelDims An array of dvt.Rectangle objects that describe the x, y, height, width of the axis labels.
 * @return {Array} The array of DvtText labels for the axis.
 * @protected
 */
dvt.AxisInfo.prototype.SkipLabels = function(labels, labelDims) {
  var skippedLabels = 0;
  var bOverlaps = this.IsOverlapping(labelDims, skippedLabels);
  while (bOverlaps) {
    skippedLabels++;
    bOverlaps = this.IsOverlapping(labelDims, skippedLabels);
  }

  if (skippedLabels > 0) {
    var renderedLabels = [];
    for (var j = 0; j < labels.length; j += skippedLabels + 1) {
      renderedLabels.push(labels[j]);
    }
    return renderedLabels;
  } else {
    return labels;
  }
};


/**
 * Checks the labels for the tangential axis and skips them as necessary.
 * @param {Array} labels An array of DvtText labels for the axis.
 * @param {Array} labelDims An array of dvt.Rectangle objects that describe the x, y, height, width of the axis labels.
 * @return {Array} The array of DvtText labels for the tangential axis.
 * @protected
 */
dvt.AxisInfo.prototype.SkipTangentialLabels = function(labels, labelDims) {
  var renderedLabels = [];
  var numLabels = labels.length;
  var firstLabelDims = null;

  if (numLabels > 1) {
    var prevLabelDims;
    // Include label if it does not overlap with previously included label
    for (var j = 0; j < numLabels; j++) {
      if (!labelDims[j])
        continue;
      if (!prevLabelDims || (prevLabelDims && !this.IsOverlappingDims(prevLabelDims, labelDims[j]))) {
        if (!firstLabelDims)
          firstLabelDims = labelDims[j];
        renderedLabels.push(labels[j]);
        prevLabelDims = labelDims[j];
      }
    }

    // Remove last included label if it overlaps with the first included label
    if (this.IsOverlappingDims(prevLabelDims, firstLabelDims))
      renderedLabels.pop();

    return renderedLabels;
  }
  return labels;
};


/**
 * Returns an array of dvt.Rectangle objects that describe the x, y, width, height of the axis labels.
 * @param {Array} labels An array of DvtText labels for the axis.
 * @param {dvt.Container} container
 * @return {Array} An array of dvt.Rectangle objects
 * @protected
 */
dvt.AxisInfo.prototype.GetLabelDims = function(labels, container) {
  var labelDims = [];

  // Get the text dimensions
  for (var i = 0; i < labels.length; i++) {
    var text = labels[i];
    if (text == null) {
      labelDims.push(null);
    } else {
      var dims = text.measureDimensions(container);
      if (dims.w && dims.h) // Empty group axis labels with 0 height and width are possible, they should count as null
        labelDims.push(dims);
      else
        labelDims.push(null);
    }
  }

  return labelDims;
};


/**
 * Returns an array of dvt.Rectangle objects that contains a conservative guess the x, y, width, height of the axis labels.
 * Assumes that the labels are center-middle aligned.
 * @param {Array} labels An array of DvtText labels for the axis.
 * @param {dvt.Container} container
 * @param {Number} fudgeFactor (optional) A factor the would be multiplied to the text width. If not provided, assumed to be 1.
 * @param {Number} level (optional) Used for group axis hierarchical labels
 * @return {Array} An array of dvt.Rectangle objects
 * @protected
 */
dvt.AxisInfo.prototype.GuessLabelDims = function(labels, container, fudgeFactor, level) {
  var labelDims = [];
  if (typeof fudgeFactor == 'undefined')
    fudgeFactor = 1;

  // Get the text dimensions
  for (var i = 0; i < labels.length; i++) {
    var text = labels[i];
    if (text == null) {
      labelDims.push(null);
    } else {
      // get a conservative estimate of the dimensions
      container.addChild(text);
      var estimatedSize = dvt.TextUtils.guessTextDimensions(text);
      var estW = estimatedSize.w * fudgeFactor;
      var estH = estimatedSize.h;
      container.removeChild(text);

      var dims;
      if (this.isLabelRotated(level)) {
        dims = new dvt.Rectangle(text.getTranslateX() - estH / 2, text.getTranslateY() - estW / 2, estH, estW);
      } else {
        dims = new dvt.Rectangle(text.getX() - estW / 2, text.getY() - estH / 2, estW, estH);
      }
      labelDims.push(dims);
    }
  }

  return labelDims;
};


/**
 * Returns the number of major tick counts for the axis.
 * @return {number} The number of major tick counts.
 */
dvt.AxisInfo.prototype.getMajorTickCount = function() {
  return null; // subclasses that allow major gridlines should implement
};


/**
 * Returns the number of minor tick counts for the axis.
 * @return {number} The number of minor tick counts.
 */
dvt.AxisInfo.prototype.getMinorTickCount = function() {
  return null; // subclasses that allow minor gridlines should implement
};


/**
 * Returns the major increment for the axis.
 * @return {number} The major increment.
 */
dvt.AxisInfo.prototype.getMajorIncrement = function() {
  return null; // subclasses that allow major gridlines should implement
};


/**
 * Returns the minor increment for the axis.
 * @return {number} The minor increment.
 */
dvt.AxisInfo.prototype.getMinorIncrement = function() {
  return null; // subclasses that allow minor gridlines should implement
};


/**
 * Returns the global min value of the axis.
 * @return {number} The global min value.
 */
dvt.AxisInfo.prototype.getGlobalMin = function() {
  return this.GlobalMin;
};


/**
 * Returns the global max value of the axis.
 * @return {number} The global max value.
 */
dvt.AxisInfo.prototype.getGlobalMax = function() {
  return this.GlobalMax;
};


/**
 * Returns the viewport min value of the axis.
 * @return {number} The viewport min value.
 */
dvt.AxisInfo.prototype.getViewportMin = function() {
  return this.MinValue;
};


/**
 * Returns the viewport max value of the axis.
 * @return {number} The viewport max value.
 */
dvt.AxisInfo.prototype.getViewportMax = function() {
  return this.MaxValue;
};


/**
 * Returns the data min value of the axis.
 * @return {number} The data min value.
 */
dvt.AxisInfo.prototype.getDataMin = function() {
  return this.DataMin;
};


/**
 * Returns the data max value of the axis.
 * @return {number} The data max value.
 */
dvt.AxisInfo.prototype.getDataMax = function() {
  return this.DataMax;
};


/**
 * Returns the minimum extent of the axis, i.e. the (maxLinearValue - minLinearValue) during maximum zoom.
 * @return {number} The minimum extent.
 */
dvt.AxisInfo.prototype.getMinimumExtent = function() {
  return 0;
};


/**
 * Returns the start coord.
 * @return {number}
 */
dvt.AxisInfo.prototype.getStartCoord = function() {
  return this.StartCoord;
};


/**
 * Returns the end coord.
 * @return {number}
 */
dvt.AxisInfo.prototype.getEndCoord = function() {
  return this.EndCoord;
};


/**
 * Returns how much the axis labels overflow over the start coord.
 * @return {number}
 */
dvt.AxisInfo.prototype.getStartOverflow = function() {
  return this.StartOverflow;
};


/**
 * Returns how much the axis labels overflow over the end coord.
 * @return {number}
 */
dvt.AxisInfo.prototype.getEndOverflow = function() {
  return this.EndOverflow;
};

/**
 * Gets the width of a group (for rendering bar chart)
 * @return {Number} the width of a group
 */
dvt.AxisInfo.prototype.getGroupWidth = function() {
  return 0;
};

/**
 * Returns a string or an array of groups names/ids of the ancestors of a group label at the given index and level.
 * @param {Number} index The index of the group label within it's level of labels
 * @param {Number=} level The level of the group labels
 * @return {String|Array} The group name/id, or an array of group names/ids.
 * @override
 */
dvt.AxisInfo.prototype.getGroup = function(index, level) {
  // only applies to group axis
  return null;
};


/**
 * Converts linear value to actual value.
 * For example, for a log scale, the linear value is the log of the actual value.
 * @param {number} value The linear value.
 * @return {number} The actual value.
 */
dvt.AxisInfo.prototype.linearToActual = function(value) {
  return value;
};


/**
 * Converts actual value to linear value.
 * For example, for a log scale, the linear value is the log of the actual value.
 * @param {number} value The actual value.
 * @return {number} The linear value.
 */
dvt.AxisInfo.prototype.actualToLinear = function(value) {
  return value;
};
/**
 * Calculated axis information and drawable creation for a data axis.
 * @param {dvt.Context} context
 * @param {object} options The object containing specifications and data for this component.
 * @param {dvt.Rectangle} availSpace The available space.
 * @class
 * @constructor
 * @extends {dvt.AxisInfo}
 */
dvt.DataAxisInfo = function(context, options, availSpace) {
  this.Init(context, options, availSpace);
};

dvt.Obj.createSubclass(dvt.DataAxisInfo, dvt.AxisInfo);

/** @private @const */
dvt.DataAxisInfo._MAX_NUMBER_OF_GRIDS_AUTO = 10;
/** @private @const */
dvt.DataAxisInfo._MINOR_TICK_COUNT = 2;
/** @private @const */
dvt.DataAxisInfo._MAX_ZOOM_FACTOR = 64;


/**
 * @override
 */
dvt.DataAxisInfo.prototype.Init = function(context, options, availSpace) {
  dvt.DataAxisInfo.superclass.Init.call(this, context, options, availSpace);

  // Figure out the coords for the min/max values
  if (this.Position == 'top' || this.Position == 'bottom') {
    // Provide at least the minimum buffer at each side to accommodate labels
    if (options['tickLabel']['rendered'] != 'off' && options['rendered'] != 'off') {
      this.StartOverflow = Math.max(dvt.Axis.MINIMUM_AXIS_BUFFER - options['leftBuffer'], 0);
      this.EndOverflow = Math.max(dvt.Axis.MINIMUM_AXIS_BUFFER - options['rightBuffer'], 0);
    }

    // Axis is horizontal, so flip for BIDI if needed
    if (dvt.Agent.isRightToLeft(context)) {
      this._minCoord = this.EndCoord - this.EndOverflow;
      this._maxCoord = this.StartCoord + this.StartOverflow;
    }
    else {
      this._minCoord = this.StartCoord + this.StartOverflow;
      this._maxCoord = this.EndCoord - this.EndOverflow;
    }
  }
  else if (this.Position == 'tangential' || this.Position == 'radial') {
    this._minCoord = this.StartCoord;
    this._maxCoord = this.EndCoord;
  }
  else {
    this._minCoord = this.EndCoord;
    this._maxCoord = this.StartCoord;
  }

  this.DataMin = options['dataMin'];
  this.DataMax = options['dataMax'];
  this._isLog = options['scale'] == 'log' && this.DataMin > 0 && this.DataMax > 0;

  this._globalMin = this.actualToLinear(options['min']);
  this._globalMax = this.actualToLinear(options['max']);
  this._minValue = options['viewportMin'] == null ? this._globalMin : this.actualToLinear(options['viewportMin']);
  this._maxValue = options['viewportMax'] == null ? this._globalMax : this.actualToLinear(options['viewportMax']);
  this._dataMin = this.actualToLinear(this.DataMin);
  this._dataMax = this.actualToLinear(this.DataMax);

  this._majorIncrement = this.actualToLinear(options['step']);
  this._minorIncrement = this.actualToLinear(options['minorStep']);
  this._minMajorIncrement = this.actualToLinear(options['minStep']);
  this._majorTickCount = options['_majorTickCount'];
  this._minorTickCount = options['_minorTickCount'];

  this._zeroBaseline = !this._isLog && options['baselineScaling'] == 'zero';

  this._converter = null;
  if (options['tickLabel'] != null)
    this._converter = options['tickLabel']['converter'];

  this._calcAxisExtents();

  this.GlobalMin = this.linearToActual(this._globalMin);
  this.GlobalMax = this.linearToActual(this._globalMax);
  this.MinValue = this.linearToActual(this._minValue);
  this.MaxValue = this.linearToActual(this._maxValue);
};


/**
 * Returns the value correspoding to the first tick label (or gridline) of the axis.
 * @return {number} The value of the min label.
 */
dvt.DataAxisInfo.prototype.getMinLabel = function() {
  if (this._zeroBaseline || (this.Options['_continuousExtent'] == 'on' && this.Options['min'] == null)) {
    // the tickLabels and gridlines should be at integer intervals from zero
    return Math.ceil(this._minValue / this._majorIncrement) * this._majorIncrement;
  } else {
    // the tickLabels and gridlines should be at integer intervals from the globalMin
    return Math.ceil((this._minValue - this._globalMin) / this._majorIncrement) * this._majorIncrement + this._globalMin;
  }
};


/**
 * @override
 */
dvt.DataAxisInfo.prototype.getLabels = function(context, levelIdx) {
  if (levelIdx && levelIdx > 0) // data axis has only one level
    return null;

  var labels = [];
  var labelDims = [];
  var container = context.getStage();

  // when scaling is set then init formatter
  if (this.Options['tickLabel'] && this.Options['tickLabel']['scaling']) {
    var autoPrecision = this.Options['tickLabel']['autoPrecision'] ? this.Options['tickLabel']['autoPrecision'] : 'on';
    this._axisValueFormatter = new dvt.LinearScaleAxisValueFormatter(context, this._minValue, this._maxValue, this._majorIncrement, this.Options['tickLabel']['scaling'], autoPrecision);
  }

  // Iterate on an integer to reduce rounding error.  We use <= since the first
  // tick is not counted in the tick count.
  for (var i = 0; i <= this._majorTickCount; i++) {
    var value = i * this._majorIncrement + this.getMinLabel();
    if (value > this._maxValue)
      break;

    var coord = this._getUnboundedCoordAt(value);
    if (this.Options['_skipHighestTick']) {
      if (value == this._maxValue)
        continue;
      if (this.Position != 'tangential' && Math.abs(coord - this._maxCoord) < this.getTickLabelHeight())
        continue;
    }

    var label;
    if (this._isLog) {
      // for log scale, format each label individually as the scaling don't need to match across labels
      value = this.linearToActual(value);
      this._axisValueFormatter = new dvt.LinearScaleAxisValueFormatter(context, value, value, value, this.Options['tickLabel']['scaling'], autoPrecision);
      label = this._formatValue(value);
    }
    else
      label = this._formatValue(value);

    var text = this.CreateLabel(context, label, coord);
    labels.push(text);
  }

  if (this.Position != 'tangential') {
    labelDims = this.GetLabelDims(labels, container);
    labels = this.SkipLabels(labels, labelDims);
  }

  return labels;
};


/**
 * @override
 */
dvt.DataAxisInfo.prototype.getMajorTickCoords = function() {
  var coords = [];

  // Iterate on an integer to reduce rounding error.  We use <= since the first
  // tick is not counted in the tick count.
  for (var i = 0; i <= this._majorTickCount; i++) {
    var value = i * this._majorIncrement + this.getMinLabel();
    if (value > this._maxValue)
      break;
    if (this.Options['_skipHighestTick'] && value == this._maxValue)
      continue;

    var coord = this._getUnboundedCoordAt(value);
    coords.push(coord);
  }

  return coords;
};

/**
 * @override
 */
dvt.DataAxisInfo.prototype.getMinorTickCoords = function() {
  var coords = [];

  // Iterate on an integer to reduce rounding error.  We use <= since the first
  // tick is not counted in the tick count.
  // Start from i=-1 so that minorTicks that should get rendered before the first majorTick are evaluated
  for (var i = -1; i <= this._majorTickCount; i++) {
    var value = i * this._majorIncrement + this.getMinLabel();
    if (this._isLog && this._majorIncrement == 1 && this._minorIncrement == 1) {
      // draw linear ticks from 2 to 9
      for (var j = 2; j <= 9; j++) {
        var linearValue = value + dvt.Math.log10(j);
        if (linearValue > this._maxValue)
          break;
        if (linearValue < this._minValue)
          continue;

        coord = this._getUnboundedCoordAt(linearValue);
        coords.push(coord);
      }
    }
    else {
      for (var j = 1; j < this._minorTickCount; j++) {
        var minorValue = value + (j * this._minorIncrement);
        if (minorValue > this._maxValue)
          break;
        if (minorValue < this._minValue)
          continue;

        var coord = this._getUnboundedCoordAt(minorValue);
        coords.push(coord);
      }
    }
  }
  return coords;
};

/**
 * @override
 */
dvt.DataAxisInfo.prototype.getBaselineCoord = function() {
  return this._isLog ? this._minCoord : this.getBoundedCoordAt(0);
};


/**
 * @override
 */
dvt.DataAxisInfo.prototype.getUnboundedValueAt = function(coord) {
  if (coord == null)
    return null;

  var ratio = (coord - this._minCoord) / (this._maxCoord - this._minCoord);
  var value = this._minValue + (ratio * (this._maxValue - this._minValue));
  return this.linearToActual(value);
};


/**
 * @override
 */
dvt.DataAxisInfo.prototype.getUnboundedCoordAt = function(value) {
  return this._getUnboundedCoordAt(this.actualToLinear(value));
};


/**
 * Returns the unbounded coord at the specified linearized value.
 * @param {number} value The linearized value.
 * @return {number}
 * @private
 */
dvt.DataAxisInfo.prototype._getUnboundedCoordAt = function(value) {
  if (value == null)
    return null;

  var ratio = (value - this._minValue) / (this._maxValue - this._minValue);
  return this._minCoord + (ratio * (this._maxCoord - this._minCoord));
};


/**
 * @param {number} value
 * @return {string} Formatted value.
 * @private
 */
dvt.DataAxisInfo.prototype._formatValue = function(value) {

  if (this._converter && (this._converter['getAsString'] || this._converter['format'])) {
    if (this._axisValueFormatter)
      return this._axisValueFormatter.format(value, this._converter);
    else if (this._converter['getAsString'])
      return this._converter['getAsString'](value);
    else if (this._converter['format'])
      return this._converter['format'](value);
  }

  else if (this._axisValueFormatter)
    return this._axisValueFormatter.format(value);

  else {
    // set the # of decimals of the value to the # of decimals of the major increment
    var t = dvt.Math.log10(this._majorIncrement);
    var decimals = Math.max(Math.ceil(-t), 0);
    return value.toFixed(decimals);
  }
};


/**
 * Determines the number of major and minor tick counts and increments for the axis if values were not given.
 * The default minor tick count is 2.
 * @param {number} scaleUnit The scale unit of the axis.
 * @private
 */
dvt.DataAxisInfo.prototype._calcMajorMinorIncr = function(scaleUnit) {
  if (!this._majorIncrement) {
    if (this._majorTickCount)
      this._majorIncrement = (this._maxValue - this._minValue) / this._majorTickCount;
    else
      this._majorIncrement = Math.max(scaleUnit, this._minMajorIncrement);
  }

  if (!this._majorTickCount)
    this._majorTickCount = (this._maxValue - this._minValue) / this._majorIncrement;

  if (!this._minorTickCount) {
    if (this._minorIncrement)
      this._minorTickCount = this._majorIncrement / this._minorIncrement;
    else if (this._isLog)
      this._minorTickCount = this._majorIncrement;
    else
      this._minorTickCount = dvt.DataAxisInfo._MINOR_TICK_COUNT;
  }

  if (!this._minorIncrement)
    this._minorIncrement = this._majorIncrement / this._minorTickCount;
};


/**
 * Determines the axis extents based on given start and end value
 * or calculated from the min and max data values of the chart.
 * @private
 */
dvt.DataAxisInfo.prototype._calcAxisExtents = function() {
  var continuousExtent = this.Options['_continuousExtent'] == 'on';

  // Include 0 in the axis if we're scaling from the baseline
  if (this._zeroBaseline) {
    this._dataMin = Math.min(0, this._dataMin);
    this._dataMax = Math.max(0, this._dataMax);
  }

  var scaleUnit = this._calcAxisScale((this._globalMin != null ? this._globalMin : this._dataMin),
                                      (this._globalMax != null ? this._globalMax : this._dataMax));

  // If there's only a single value on the axis, we need to adjust the
  // this._dataMin and this._dataMax to produce a nice looking axis with around 6 ticks.
  if (this._dataMin == this._dataMax) {
    if (this._dataMin == 0)
      this._dataMax += 5 * scaleUnit;
    else {
      this._dataMin -= 2 * scaleUnit;
      this._dataMax += 2 * scaleUnit;
    }
  }

  // Set the default global min
  if (this._globalMin == null) {
    if (this._zeroBaseline && this._dataMin >= 0) {
      this._globalMin = 0;
    }
    else if (continuousExtent) { // allow smooth pan/zoom transition
      this._globalMin = this._dataMin - (this._dataMax - this._dataMin) * 0.1;
    }
    else if (!this._zeroBaseline && this._globalMax != null) {
      this._globalMin = this._globalMax;
      while (this._globalMin >= this._dataMin)
        this._globalMin -= scaleUnit;
    }
    else {
      this._globalMin = (Math.ceil(this._dataMin / scaleUnit) - 1) * scaleUnit;
    }

    // If all data points are positive, the axis min shouldn't be less than zero
    if (this._dataMin >= 0)
      this._globalMin = Math.max(this._globalMin, 0);
  }

  // Set the default global max
  if (this._globalMax == null) {
    if (this._majorTickCount) {
      this._globalMax = this._globalMin + this._majorTickCount * scaleUnit;
    }
    else if (this._zeroBaseline && this._dataMax <= 0) {
      this._globalMax = 0;
    }
    else if (continuousExtent) { // allow smooth pan/zoom transition
      this._globalMax = this._dataMax + (this._dataMax - this._dataMin) * 0.1;
    }
    else if (!this._zeroBaseline) {
      this._globalMax = this._globalMin;
      while (this._globalMax <= this._dataMax)
        this._globalMax += scaleUnit;
    }
    else {
      this._globalMax = (Math.floor(this._dataMax / scaleUnit) + 1) * scaleUnit;
    }

    // If all data points are negative, the axis max shouldn't be more that zero
    if (this._dataMax <= 0)
      this._globalMax = Math.min(this._globalMax, 0);
  }

  if (this._globalMax == this._globalMin) { // happens if this._dataMin == this._dataMax == 0
    this._globalMax = 100;
    this._globalMin = 0;
    scaleUnit = (this._globalMax - this._globalMin) / dvt.DataAxisInfo._MAX_NUMBER_OF_GRIDS_AUTO;
  }

  if (this._minValue == null)
    this._minValue = this._globalMin;
  if (this._maxValue == null)
    this._maxValue = this._globalMax;

  // Recalc the scale unit if the axis viewport is limited
  if (this._minValue != this._globalMin || this._maxValue != this._globalMax)
    scaleUnit = this._calcAxisScale(this._minValue, this._maxValue);

  if (this._globalMin > this._minValue)
    this._globalMin = this._minValue;
  if (this._globalMax < this._maxValue)
    this._globalMax = this._maxValue;

  // Calculate major and minor gridlines
  this._calcMajorMinorIncr(scaleUnit);

};


/**
 * Determines the scale unit of the axis based on a given start and end axis extent.
 * @param {number} min The start data value for the axis.
 * @param {number} max The end data value for the axis.
 * @return {number} The scale unit of the axis.
 * @private
 */
dvt.DataAxisInfo.prototype._calcAxisScale = function(min, max) {
  if (this._majorIncrement)
    return this._majorIncrement;

  var spread = max - min;

  if (this._isLog)
    return Math.floor(spread / 8) + 1;

  if (spread == 0) {
    if (min == 0)
      return 10;
    else
      return Math.pow(10, Math.floor(dvt.Math.log10(min)) - 1);
  }

  if (this._majorTickCount) {
    //  - y2 axis should show better labels when tick marks are aligned
    var increment = spread / this._majorTickCount;
    var testVal = Math.pow(10, Math.ceil(dvt.Math.log10(increment) - 1));
    var firstDigit = increment / testVal;
    if (firstDigit > 1 && firstDigit <= 1.5)
      firstDigit = 1.5;
    else if (firstDigit > 5)
      firstDigit = 10;
    else
      firstDigit = Math.ceil(firstDigit);
    return firstDigit * testVal;
  }

  var t = dvt.Math.log10(spread);
  var testVal = Math.pow(10, Math.ceil(t) - 2);
  var first2Digits = Math.round(spread / testVal);

  // Aesthetically choose a scaling factor limiting to a max number of steps
  var scaleFactor = 1;
  if (first2Digits >= 10 && first2Digits <= 14)
    scaleFactor = 2;
  else if (first2Digits >= 15 && first2Digits <= 19)
    scaleFactor = 3;
  else if (first2Digits >= 20 && first2Digits <= 24)
    scaleFactor = 4;
  else if (first2Digits >= 25 && first2Digits <= 45)
    scaleFactor = 5;
  else if (first2Digits >= 46 && first2Digits <= 80)
    scaleFactor = 10;
  else
    scaleFactor = 20;

  return scaleFactor * testVal;
};


/**
 * @override
 */
dvt.DataAxisInfo.prototype.getMajorTickCount = function() {
  return this._majorTickCount;
};


/**
 * @override
 */
dvt.DataAxisInfo.prototype.getMinorTickCount = function() {
  return this._minorTickCount;
};


/**
 * @override
 */
dvt.DataAxisInfo.prototype.getMajorIncrement = function() {
  return this.linearToActual(this._majorIncrement);
};


/**
 * @override
 */
dvt.DataAxisInfo.prototype.getMinorIncrement = function() {
  return this.linearToActual(this._minorIncrement);
};


/**
 * @override
 */
dvt.DataAxisInfo.prototype.getMinimumExtent = function() {
  return (this._globalMax - this._globalMin) / dvt.DataAxisInfo._MAX_ZOOM_FACTOR;
};


/**
 * @override
 */
dvt.DataAxisInfo.prototype.getStartOverflow = function() {
  if ((this.Position == 'top' || this.Position == 'bottom') && dvt.Agent.isRightToLeft(this.getCtx()))
    return this.EndOverflow;
  else
    return this.StartOverflow;
};


/**
 * @override
 */
dvt.DataAxisInfo.prototype.getEndOverflow = function() {
  if ((this.Position == 'top' || this.Position == 'bottom') && dvt.Agent.isRightToLeft(this.getCtx()))
    return this.StartOverflow;
  else
    return this.EndOverflow;
};

/**
 * @override
 */
dvt.DataAxisInfo.prototype.linearToActual = function(value) {
  if (value == null)
    return null;
  return this._isLog ? Math.pow(10, value) : value;
};

/**
 * @override
 */
dvt.DataAxisInfo.prototype.actualToLinear = function(value) {
  if (value == null)
    return null;
  if (this._isLog)
    return value > 0 ? dvt.Math.log10(value) : null;
  return value;
};
/**
 * Calculated axis information and drawable creation for a group axis.
 * @param {dvt.Context} context
 * @param {object} options The object containing specifications and data for this component.
 * @param {dvt.Rectangle} availSpace The available space.
 * @class
 * @constructor
 * @extends {dvt.AxisInfo}
 */
dvt.GroupAxisInfo = function(context, options, availSpace) {
  this.Init(context, options, availSpace);
};

dvt.Obj.createSubclass(dvt.GroupAxisInfo, dvt.AxisInfo);

/**
 * The max amount of lines we allow in label wrapping.
 * Needed to prevent rotated labels from greedily wrapping along the length of the xAxis
 * @private
 */
dvt.GroupAxisInfo._MAX_LINE_WRAP = 3;

/**
 * @override
 */
dvt.GroupAxisInfo.prototype.Init = function(context, options, availSpace) {
  dvt.GroupAxisInfo.superclass.Init.call(this, context, options, availSpace);

  // Flip horizontal axes for BIDI
  var isRTL = dvt.Agent.isRightToLeft(context);
  var isHoriz = this.Position == 'top' || this.Position == 'bottom';
  if (isHoriz && isRTL) {
    var temp = this.StartCoord;
    this.StartCoord = this.EndCoord;
    this.EndCoord = temp;
  }

  this._levelsArray = [];
  this._groupCount = this._generateLevelsArray(options['groups'], 0, this._levelsArray, 0); // populates this._levelsArray and returns groupCount
  this._numLevels = this._levelsArray.length;
  this._areSeparatorsRendered = options['groupSeparators']['rendered'] == 'on';
  this._separatorColor = options['groupSeparators']['color'];
  this._lastRenderedLevel = null;
  this._drilling = options['drilling'];

  // Calculate the increment and add offsets if specified
  var endOffset = (options['endGroupOffset'] > 0) ? Number(options['endGroupOffset']) : 0;
  var startOffset = (options['startGroupOffset'] > 0) ? Number(options['startGroupOffset']) : 0;

  // Set the axis min/max
  this.DataMin = 0;
  this.DataMax = this._groupCount - 1;

  this.GlobalMin = options['min'] == null ? this.DataMin - startOffset : options['min'];
  this.GlobalMax = options['max'] == null ? this.DataMax + endOffset : options['max'];

  // Set min/max by start/endGroup
  var startIndex = this.getGroupIndex(options['viewportStartGroup']);
  var endIndex = this.getGroupIndex(options['viewportEndGroup']);
  if (startIndex != -1)
    this.MinValue = startIndex - startOffset;
  if (endIndex != -1)
    this.MaxValue = endIndex + endOffset;

  // Set min/max by viewport min/max
  if (options['viewportMin'] != null)
    this.MinValue = options['viewportMin'];
  if (options['viewportMax'] != null)
    this.MaxValue = options['viewportMax'];

  // If min/max is still undefined, fall back to global min/max
  if (this.MinValue == null)
    this.MinValue = this.GlobalMin;
  if (this.MaxValue == null)
    this.MaxValue = this.GlobalMax;

  if (this.GlobalMin > this.MinValue)
    this.GlobalMin = this.MinValue;
  if (this.GlobalMax < this.MaxValue)
    this.GlobalMax = this.MaxValue;

  this._groupWidthRatios = options['_groupWidthRatios'];
  this._processGroupWidthRatios();

  this._startBuffer = isRTL ? options['rightBuffer'] : options['leftBuffer'];
  this._endBuffer = isRTL ? options['leftBuffer'] : options['rightBuffer'];

  this._isLabelRotated = [];
  for (var i = 0; i < this._numLevels; i++)
    this._isLabelRotated.push(false);

  this._renderGridAtLabels = options['_renderGridAtLabels'];

  this._labels = null;

  // Initial height/width that will be available for the labels. Used for text wrapping.
  this._maxSpace = isHoriz ? availSpace.h : availSpace.w;
  if (options['title'])
    this._maxSpace -= dvt.TextUtils.getTextStringHeight(context, options['titleStyle']) + DvtAxisDefaults.getGapSize(context, options, options['layout']['titleGap']);

  this._maxLineWrap = dvt.GroupAxisInfo._MAX_LINE_WRAP;
};


/**
 * Processes group width ratios to support bar chart with varying widths.
 * @private
 */
dvt.GroupAxisInfo.prototype._processGroupWidthRatios = function() {
  // Edge case: less than two groups
  if (!this._groupWidthRatios || this._groupWidthRatios.length < 2) {
    this._groupWidthRatios = null;
    return;
  }

  // Compute the sums of the group widths that are contained within the viewport
  var sum = 0;
  var groupMin, groupMax;
  for (var g = 0; g < this._groupCount; g++) {
    groupMin = (g == 0) ? this.MinValue : Math.max(g - 0.5, this.MinValue);
    groupMax = (g == this._groupCount - 1) ? this.MaxValue : Math.min(g + 0.5, this.MaxValue);
    if (groupMax > groupMin)
      sum += (groupMax - groupMin) * this._groupWidthRatios[g];
  }

  // Divide the total viewport length (in pixels) proportionally based on the group width ratios.
  var totalWidth = this.EndCoord - this.StartCoord;
  this._groupWidths = dvt.ArrayUtils.map(this._groupWidthRatios, function(ratio) {return ratio * totalWidth / sum;});

  // Construct borderValues array which stores the the value location of the group boundaries.
  this._borderValues = [];
  for (var g = 0; g < this._groupWidthRatios.length - 1; g++) {
    this._borderValues.push(g + 0.5);
  }

  // Construct borderCoords array which stores the coord location of the group boundaries.
  this._borderCoords = [];
  var anchor = Math.min(Math.max(Math.round(this.MinValue), 0), this._borderValues.length - 1);
  this._borderCoords[anchor] = this.StartCoord + (this._borderValues[anchor] - this.MinValue) * this._groupWidths[anchor];
  for (var g = anchor + 1; g < this._borderValues.length; g++) // compute borderCoords after the anchor
    this._borderCoords[g] = this._borderCoords[g - 1] + this._groupWidths[g];
  for (var g = anchor - 1; g >= 0; g--) // compute borderCoords before the anchor
    this._borderCoords[g] = this._borderCoords[g + 1] - this._groupWidths[g + 1];
};


/**
 * Rotates the labels of the horizontal axis by 90 degrees and skips the labels if necessary.
 * @param {Array} labels An array of DvtText labels for the axis.
 * @param {dvt.Container} container
 * @param {number} overflow How much overflow the rotated labels will have.
 * @param {number} level The level the labels array corresponds to
 * @return {Array} The array of DvtText labels for the axis.
 * @private
 */
dvt.GroupAxisInfo.prototype._rotateLabels = function(labels, container, overflow, level) {
  var text;
  var x;
  var context = this.getCtx();
  var isRTL = dvt.Agent.isRightToLeft(context);
  var isHierarchical = this._numLevels > 1;

  if (level == null)
    level = this._numLevels - 1;

  this._isLabelRotated[level] = true;

  // TODO: For hierarchical labels, overflow change due to rotation is ignored.
  // Ideally we need to set the overflow at the end after all levels have been rotated.
  if (!isHierarchical)
    this._setOverflow(overflow, overflow, labels);

  for (var i = 0; i < labels.length; i++) {
    text = labels[i];
    if (text == null)
      continue;
    x = text.getX();

    // Wrap multiline text in new height/width dimensions
    var isMultiline = text instanceof dvt.MultilineText || text instanceof dvt.BackgroundMultilineText;
    if (isMultiline) {
      var groupSpan = this.getGroupWidth() * (this.getEndIndex(i, level) - this.getStartIndex(i, level) + 1);
      // Estimate if there is room for at least one wrap, and either attempt to wrap or disable wrap on the text
      // Note: This estimate may end up disabling wrap for text that may have just fit, but sufficiently excludes text that
      // will have definitely not fit.
      if (text.getLineHeight() * 2 < groupSpan)
        text.wrapText(this._maxSpace, text.getLineHeight() * dvt.GroupAxisInfo._MAX_LINE_WRAP, 1);
      else
        text.setWrapEnabled(false);
    }

    text.setX(0);
    text.setY(0);
    if (isRTL)
      text.setRotation(Math.PI / 2);
    else
      text.setRotation(3 * Math.PI / 2);
    text.setTranslateX(x);
  }

  var labelDims = this.GuessLabelDims(labels, container, null, level); // the guess returns the exact heights

  // Wrapped labels
  if (this.Options['tickLabel']['style'].getStyle(dvt.CSSStyle.WHITE_SPACE) == 'normal') {
    var updateLabelDims = this._sanitizeWrappedText(context, labelDims, labels, true, isHierarchical);
    // Recalculate label dims for skipping
    if (updateLabelDims)
      labelDims = this.GuessLabelDims(labels, container, null, level);
  }

  return this.SkipLabels(labels, labelDims);
};

/**
 * Checks if any label should be re-wrapped due to overlap and re-wraps text if needed to minimize overlap.
 * Updates remaining space available for wrapping hierarchical labels.
 * @param {dvt.Context} context
 * @param {Array} labelDims An array of DvtText dimensions for the axis.
 * @param {Array} labels An array of DvtText labels for the axis.
 * @param {Boolean} isRotated Whether or not labels are horizontal and rotated, or vertical.
 * @param {Boolean} isHierarchical Whether or not axis has hierarchical labels
 * @return {Boolean} Whether or not labels were re-wrapped
 * @private
 */
dvt.GroupAxisInfo.prototype._sanitizeWrappedText = function(context, labelDims, labels, isRotated, isHierarchical) {
  // Check any label should be wrapped
  var updateLabelDims = this._calculateMaxWrap(labelDims, labels, isRotated);

  var totalSpace = 0;
  // Re-wraps text if needed to minimize overlap, updates remaining space available for wrapping hierarchical labels.
  for (var i = 0; i < labels.length; i++) {
    var text = labels[i];
    if (!text)
      continue;

    var isMultiline = text instanceof dvt.MultilineText || text instanceof dvt.BackgroundMultilineText;

    // Re-wrap to minimize overlap
    if (updateLabelDims && isMultiline && text.isWrapEnabled())
      text.wrapText(this._maxSpace, text.getLineHeight() * this._maxLineWrap, 1);

    // Keep track of maximum height of this rotated level.
    if (isHierarchical)
      totalSpace = Math.max(totalSpace, dvt.TextUtils.getTextWidth(text));

    // Make sure texts, which may or may not have been re-wrapped are aligned center
    text.alignMiddle();
  }

  // Update remaining space available for wrapping hierarchical labels.
  if (isHierarchical) {
    var gap = isRotated ? this.Options['layout']['hierarchicalLabelGapHeight'] : this.Options['layout']['hierarchicalLabelGapWidth'];
    this._maxSpace -= (totalSpace + DvtAxisDefaults.getGapSize(context, this.Options, gap));
  }

  return updateLabelDims;
};


/**
 * Updates the maximum lines labels will be allowed to have to minimize overlap
 * @param {Array} labelDims An arry of the current label dimensions
 * @param {Array} labels An array of DvtText labels for the axis.
 * @param {Boolean} isRotated Whether or not the axis is horizontal
 * @return {Boolean} Whether or not labels will need to be re-wrapped
 * @private
 */
dvt.GroupAxisInfo.prototype._calculateMaxWrap = function(labelDims, labels, isRotated) {
  var updateLabelDims = false;

  // Estimate and update label dims of text if they were to be wrapped with current maxLineWrap
  // Decrease maxLineWrap until 1 if it is estimated text will still overlap
  while (this.IsOverlapping(labelDims, 0) && this._maxLineWrap > 1) {
    updateLabelDims = true;
    for (var i = 0; i < labels.length; i++) {
      var text = labels[i];
      if ((text instanceof dvt.MultilineText || text instanceof dvt.BackgroundMultilineText)) {
        if (text.getLineCount() == this._maxLineWrap) {
          var lineHeight = text.getLineHeight();
          if (isRotated)
            labelDims[i].w -= lineHeight;
          else {
            labelDims[i].y += lineHeight * .5;
            labelDims[i].h -= lineHeight;
          }
        }
      }
    }
    this._maxLineWrap--;
  }

  return updateLabelDims;
};


/**
 * @override
 */
dvt.GroupAxisInfo.prototype.isLabelRotated = function(level) {
  if (level == null)
    level = this._numLevels - 1;
  return this._isLabelRotated[level];
};


/**
 * Sets the start/end overflow of the axis.
 * @param {number} startOverflow How much the first label overflows beyond the start coord.
 * @param {number} endOverflow How much the last label overflows beyonod the end coord.
 * @param {array} labels An array of DvtText labels for a specific level. The x coordinated of the labels will be recalculated.
 * @private
 */
dvt.GroupAxisInfo.prototype._setOverflow = function(startOverflow, endOverflow, labels) {
  // TODO: hierarchical labels -- when more than one level is rotated, _setOverflow is incorrect
  //       due to text.setX(coord) (should be setting the translateX instead).

  startOverflow = Math.max(startOverflow - this._startBuffer, 0);
  endOverflow = Math.max(endOverflow - this._endBuffer, 0);

  // Revert the start/endCoord to the original positions before applying the new overflow values
  var isRTL = dvt.Agent.isRightToLeft(this.getCtx());
  this.StartCoord += (startOverflow - this.StartOverflow) * (isRTL ? -1 : 1);
  this.EndCoord -= (endOverflow - this.EndOverflow) * (isRTL ? -1 : 1);

  // Reprocess since startCoord and endCoord have changed
  this._processGroupWidthRatios();

  // Recalculate coords for all levels.
  for (var j = 0; j < this._numLevels; j++) {
    labels = this._labels[j];
    // Adjust the label coords
    for (var i = 0; i < labels.length; i++) {
      var text = labels[i];
      if (text) {
        var coord = this._getLabelCoord(j, this.getLabelIndex(text));
        text.setX(coord);
      }
    }
  }

  this.StartOverflow = startOverflow;
  this.EndOverflow = endOverflow;
};

/**
 * @override
 */
dvt.GroupAxisInfo.prototype.getLabels = function(context, level) {
  if (level == null) // Default to returning inner most labels
    level = this._numLevels - 1;

  if (!this._labels)
    this._generateLabels(context);

  return this._labels[level];

};

/**
 * Gets the coordinate of a group label based on it's position in the hierarchy
 * @param {number} level
 * @param {number} index
 * @private
 * @return {number} The label coord
 */
dvt.GroupAxisInfo.prototype._getLabelCoord = function(level, index) {
  var startValue = this.getStartIndex(index, level);
  var endValue = this.getEndIndex(index, level);
  if (startValue == null || endValue == null)
    return null;

  if (startValue < this.MinValue && endValue > this.MinValue)
    startValue = this.MinValue;
  if (endValue > this.MaxValue && startValue < this.MaxValue)
    endValue = this.MaxValue;
  var center = endValue ? startValue + (endValue - startValue) / 2 : startValue;
  return this.getCoordAt(center);
};


/**
 * Generates the labels
 * @param {dvt.Context} context
 * @private
 */
dvt.GroupAxisInfo.prototype._generateLabels = function(context) {
  var labels = [];
  this._labels = [];
  var container = context.getStage();
  var isHoriz = this.Position == 'top' || this.Position == 'bottom';
  var isRTL = dvt.Agent.isRightToLeft(context);
  var isHierarchical = this._numLevels > 1;
  var groupWidth = this.getGroupWidth();
  var availSize = this._maxSpace;
  var gapName = isHoriz ? 'hierarchicalLabelGapHeight' : 'hierarchicalLabelGapWidth';
  var gap = isHierarchical ? DvtAxisDefaults.getGapSize(context, this.Options, this.Options['layout'][gapName]) : 0;
  var rotationEnabled = this.Options['tickLabel']['rotation'] == 'auto' && isHoriz;

  // Attempt text wrapping if:
  // 1. white-space = 'normal'
  // 2. vertical or horizontal axis
  // 3. groupWidth > textHeight -> wrapping is only necessary when more than one text line can tentatively fit in the groupWidth
  var tickLabelStyle = this.Options['tickLabel']['style'];
  var wrapping = tickLabelStyle.getStyle(dvt.CSSStyle.WHITE_SPACE) == 'normal' && this.Position != 'tangential' && groupWidth > dvt.TextUtils.getTextStringHeight(context, tickLabelStyle);

  // Iterate and create the labels
  var label, firstLabel, lastLabel;
  var cssStyle;
  var text;

  for (var level = 0; level < this._numLevels; level++) {
    var levels = this._levelsArray[level];

    for (var i = 0; i < levels.length; i++) {
      if (levels[i]) {
        label = this.getLabelAt(i, level);
        // No text object created when group name is null or ''
        if (label == '' || (!label && label != 0)) {
          labels.push(null);
          continue;
        }

        var coord = this._getLabelCoord(level, i);
        if (coord != null) {
          // get categorical axis label style, if it exists
          cssStyle = this.getLabelStyleAt(i, level);
          var bMultiline = wrapping && typeof(label) != 'number' && label.indexOf(' ') >= 0;
          text = this.CreateLabel(context, label, coord, cssStyle, bMultiline);

          var groupSpan = groupWidth * (this.getEndIndex(i, level) - this.getStartIndex(i, level) + 1);
          var bWrappedLabel = bMultiline && this._isTextWrapNeeded(context, label, cssStyle, rotationEnabled, isHoriz ? groupSpan : availSize);
          // wrap text in the width available for each group
          if (bWrappedLabel) {
            if (isHoriz)
              text.wrapText(groupSpan, availSize, 1, true);
            else
              text.wrapText(availSize, text.getLineHeight() * this._maxLineWrap, 1, false);
          }
          else if (bMultiline && !isHoriz) // Multiline texts on vertical axis will not attempt further wrapping
            text.setWrapEnabled(false);

          text._index = i; // group axis labels should reference label._index for its index
          labels.push(text);

          // Store first and last label
          if (!firstLabel && level == 0)
            firstLabel = text;
          if (level == 0)
            lastLabel = text;
        }
        else
          labels.push(null);
      }
      else
        labels.push(null);
    }

    // Adjust availSize for generating wrapped hierarchical levels
    if (wrapping && isHierarchical) {
      var totalSpace = 0;
      for (var j = 0; j < labels.length; j++) {
        if (!labels[j])
          continue;

        var dims = labels[j].measureDimensions();
        totalSpace = Math.max(totalSpace, isHoriz ? dims.h : dims.w);
      }
      availSize -= (totalSpace + gap);
    }

    this._labels.push(labels);
    labels = [];
  }

  labels = this._labels[this._numLevels - 1];
  var labelDims = [];

  if (!firstLabel)
    return;

  if (this.Position == 'tangential') {
    labelDims = this.GetLabelDims(labels, container); // actual dims
    this._labels[0] = this.SkipTangentialLabels(labels, labelDims);
    return;
  }

  var firstLabelDim = firstLabel.measureDimensions();

  if (isHoriz) {
    var startOverflow, endOverflow;
    if (this.Options['_startOverflow'] != null && this.Options['_endOverflow'] != null) {
      // Use the preset value if available (during z&s animation)
      startOverflow = this.Options['_startOverflow'];
      endOverflow = this.Options['_endOverflow'];
    }
    else { // wrapping combined with rotation eliminate the potential for overflow
      // Set the overflow depending on how much the first and the last label go over the bounds
      var lastLabelDim = lastLabel.measureDimensions();
      startOverflow = isRTL ? firstLabelDim.w + firstLabelDim.x - this.StartCoord : this.StartCoord - firstLabelDim.x;
      endOverflow = isRTL ? this.EndCoord - lastLabelDim.x : lastLabelDim.w + lastLabelDim.x - this.EndCoord;
    }

    if (startOverflow > this._startBuffer || endOverflow > this._endBuffer)
      this._setOverflow(startOverflow, endOverflow, labels);
  }

  for (level = 0; level < this._numLevels; level++) {
    labels = this._labels[level];
    var minLabelDims = this.GuessLabelDims(labels, container, 0.3, level); // minimum estimate
    var maxLabelDims = this.GuessLabelDims(labels, container, null, level);      // maximum estimate

    if (!this.IsOverlapping(maxLabelDims, 0))
      this._labels[level] = labels; // all labels can fit

    // Rotate and skip the labels if necessary
    if (isHoriz) { // horizontal axis
      if (rotationEnabled) {
        if (this.IsOverlapping(minLabelDims, 0)) {
          this._labels[level] = this._rotateLabels(labels, container, firstLabelDim.h / 2, level);
        } else {
          labelDims = this.GetLabelDims(labels, container); // actual dims
          if (this.IsOverlapping(labelDims, 0)) {
            this._labels[level] = this._rotateLabels(labels, container, firstLabelDim.h / 2, level);
          }
          else {
            this._labels[level] = labels;  // all labels can fit
            if (isHierarchical) { // Adjust maxHeight for wrapping rotated hierarchical levels
              var totalHeight = 0;
              for (j = 0; j < labelDims.length; j++) {
                if (labelDims[j]) {
                  totalHeight = Math.max(totalHeight, labelDims[j].h);
                }
              }
              this._maxSpace -= (totalHeight + gap);
            }
          }
        }
      } else { // no rotation
        labelDims = this.GetLabelDims(labels, container); // get actual dims for skipping
        this._labels[level] = this.SkipLabels(labels, labelDims);
      }
    } else { // vertical axis
      // Wrapped labels
      if (wrapping) {
        var updateLabelDims = this._sanitizeWrappedText(context, maxLabelDims, labels, false, isHierarchical);

        // Recalculate label dims for skipping
        if (updateLabelDims)
          maxLabelDims = this.GuessLabelDims(labels, container, null, level);
      }

      this._labels[level] = this.SkipLabels(labels, maxLabelDims); // maxLabelDims contain the actual heights
    }
  }
};


/**
 * @override
 */
dvt.GroupAxisInfo.prototype.getMajorTickCoords = function() {
  var coords = [], coord;

  // when drawing lines between labels, polar charts need gridline drawn after last label, cartesian charts do not.
  var maxIndex = (this.Position == 'tangential') ? this.getGroupCount() : this.getGroupCount() - 1;

  for (var i = 0; i < this._levelsArray[0].length; i++) {
    if (this._levelsArray[0][i]) {
      var start = this.getStartIndex(i, 0);
      var end = this.getEndIndex(i, 0);
      /* If placing gridlines at labels, use the coordinates at the labels
       * Else if placing gridlines in between labels, use the value halfway between two consecutive coordinates */
      if (this._renderGridAtLabels)
        coord = this.getCoordAt(start + (end - start) * .5); // start == end for non-hierarchical labels
      else
        coord = (end + .5 < maxIndex) ? this.getCoordAt(end + .5) : null;

      if (coord != null)
        coords.push(coord);
    }
  }
  return coords;
};

/**
 * @override
 */
dvt.GroupAxisInfo.prototype.getMinorTickCoords = function() {
  var coords = [], coord;
  if (!this._levelsArray[1]) // minor ticks only rendered if two levels exist
    return coords;

  for (var i = 0; i < this._levelsArray[1].length; i++) {
    if (this._levelsArray[1][i]) {
      var start = this.getStartIndex(i, 1);
      var end = this.getEndIndex(i, 1);
      /* If placing gridlines at labels, use the coordinates at the labels
       * Else if placing gridlines in between labels, use the value halfway between two consecutive coordinates */
      if (this._renderGridAtLabels)
        coord = this.getCoordAt(start + (end - start) * .5);
      else
        coord = (end + .5 < this.getGroupCount() - 1) ? this.getCoordAt(end + .5) : null;

      if (coord != null)
        coords.push(coord);
    }
  }
  return coords;
};


/**
 * @override
 */
dvt.GroupAxisInfo.prototype.getUnboundedValueAt = function(coord) {
  if (coord == null)
    return null;

  if (this._groupWidthRatios) {
    // Find the anchor, i.e. the group boundary closest to the coord.
    var anchor = this._borderCoords.length;
    for (var g = 0; g < this._borderCoords.length; g++) {
      if (coord <= this._borderCoords[g]) {
        anchor = g;
        break;
      }
    }
    // Compute the value based on the group width at the anchor.
    if (anchor == 0)
      return this._borderValues[0] - (this._borderCoords[0] - coord) / this._groupWidths[0];
    else
      return this._borderValues[anchor - 1] + (coord - this._borderCoords[anchor - 1]) / this._groupWidths[anchor];
  }
  else {
    // Even group widths
    var incr = (this.EndCoord - this.StartCoord) / (this.MaxValue - this.MinValue);
    return this.MinValue + (coord - this.StartCoord) / incr;
  }
};


/**
 * @override
 */
dvt.GroupAxisInfo.prototype.getUnboundedCoordAt = function(value) {
  if (value == null)
    return null;

  if (this._groupWidthRatios) {
    // Find the anchor, i.e. the group boundary closest to the value.
    var anchor = this._borderValues.length;
    for (var g = 0; g < this._borderValues.length; g++) {
      if (value <= this._borderValues[g]) {
        anchor = g;
        break;
      }
    }
    // Compute the coord based on the group width at the anchor.
    if (anchor == 0)
      return this._borderCoords[0] - this._groupWidths[0] * (this._borderValues[0] - value);
    else
      return this._borderCoords[anchor - 1] + this._groupWidths[anchor] * (value - this._borderValues[anchor - 1]);
  }
  else {
    // Even group widths
    var incr = (this.EndCoord - this.StartCoord) / (this.MaxValue - this.MinValue);
    return this.StartCoord + (value - this.MinValue) * incr;
  }
};


/**
 * Returns the group label for the specified group.
 * @param {number} index The index of the group label within it's level.
 * @param {number} level (optional) The level of the group label.
 * @return {string} The group label.
 */
dvt.GroupAxisInfo.prototype.getLabelAt = function(index, level) {
  if (level == null)
    level = this._numLevels - 1;

  index = Math.round(index);
  if (index < 0)
    return null;

  var label = this._levelsArray[level] && this._levelsArray[level][index] ? this._levelsArray[level][index]['item'] : null;

  if (label) {
    if (label['name'])
      label = label['name'];
    else if (label['id'] != null) // Empty or null group name allowed if id is specified
      label = '';
  }
  return label;
};

/**
 * Returns the group name or id for the specified group.
 * @param {number} index The index of the group within it's level.
 * @param {number} level (optional) The level of the group label.
 * @return {string} The group name or id.
 */
dvt.GroupAxisInfo.prototype.getGroupAt = function(index, level) {
  if (level == null)
    level = this._numLevels - 1;

  index = Math.round(index);
  if (index < 0)
    return null;

  var label = this._levelsArray[level] && this._levelsArray[level][index] ? this._levelsArray[level][index]['item'] : null;

  if (label) {
    if (label['id'])
      return label['id'];
    else if (label['name'] || label['name'] == '')
      return label['name'];
  }

  return label;
};

/**
 * Returns the style for the group label at the specified index and level.
 * @param {number} index The group index.
 * @param {number} level (optional) The level of the group label.
 * @return {dvt.CSSStyle}
 */
dvt.GroupAxisInfo.prototype.getLabelStyleAt = function(index, level) {
  var labelStyle = this._getGroupAttribute(index, level, 'labelStyle');

  if (labelStyle) {
    var cssStyle = new dvt.CSSStyle(labelStyle);
    if (!cssStyle.getStyle('font-size')) // dvt.BackgroundOutputText needs font-size for adjusting select browser mis-alignment cases
      cssStyle.setStyle('font-size', this.Options['tickLabel']['style'].getStyle('font-size'));
    return cssStyle;
  }
  return null;
};

/**
 * @override
 */
dvt.GroupAxisInfo.prototype.getDatatip = function(index, level) {
  // categorical label datatip is the given shortDesc if it exists
  return this._getGroupAttribute(index, level, 'shortDesc');
};

/**
 * @override
 */
dvt.GroupAxisInfo.prototype.getAction = function(index, level) {
  return this._getGroupAttribute(index, level, 'action');
};

/**
 * @override
 */
dvt.GroupAxisInfo.prototype.isDrillable = function(index, level) {
  var drilling = this._getGroupAttribute(index, level, 'drilling');

  if (drilling == 'on')
    return true;
  else if (drilling == 'off')
    return false;
  else
    return this._drilling == 'on' || this._drilling == 'groupsOnly';
};

/**
 * Returns a string or an array of groups names/ids of the ancestors of a group label at the given index and level.
 * @param {Number} index The index of the group label within it's level of labels
 * @param {Number=} level The level of the group labels
 * @return {String|Array} The group name/id, or an array of group names/ids.
 * @override
 */
dvt.GroupAxisInfo.prototype.getGroup = function(index, level) {
  if (index < 0 || index > this.getGroupCount() - 1)
    return null;

  var groupLabels = [];
  if (level == null)
    level = this._numLevels - 1;
  var startIndex = this.getStartIndex(index, level);
  for (var levelIndex = 0; levelIndex <= level; levelIndex++) {
    var levelArray = this._levelsArray[levelIndex];
    for (var i = 0; i < levelArray.length; i++) {
      if (this.getStartIndex(i, levelIndex) <= startIndex && this.getEndIndex(i, levelIndex) >= startIndex) {
        groupLabels.push(this.getGroupAt(i, levelIndex));
        continue;
      }
    }
  }
  if (groupLabels.length > 0)
    return groupLabels.length == 1 ? groupLabels[0] : groupLabels;
  return null;
};

/**
 * @override
 */
dvt.GroupAxisInfo.prototype.getLabelBackground = function(label, context, level) {
  if (level == null)
    level = this._numLevels - 1;
  var style = label.getCSSStyle();
  if (style) {
    var bgColor = style.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
    var borderColor = style.getStyle(dvt.CSSStyle.BORDER_COLOR);
    var borderWidth = style.getStyle(dvt.CSSStyle.BORDER_WIDTH);
    var borderRadius = style.getStyle(dvt.CSSStyle.BORDER_RADIUS);

    // Create element for label background if group labelStyle has the background-related attributes that we support
    if (bgColor != null || borderColor != null || borderWidth != null || borderRadius != null) {
      var bboxDims = label.getDimensions();
      var padding = bboxDims.h * 0.15;

      // Chrome & IE handle 'vAlign = bottom' in a way that label and the background are misaligned, this corrects the dvt.Rect
      if ((dvt.Agent.isBrowserChrome() || dvt.Agent.isPlatformIE()) && label.getVertAlignment() === dvt.OutputText.V_ALIGN_BOTTOM)
        bboxDims.y += bboxDims.h / 2;

      var bbox = new dvt.Rect(context, bboxDims.x - padding, bboxDims.y, bboxDims.w + 2 * padding, bboxDims.h);

      var bgStyle = new dvt.CSSStyle();
      if (bgColor != null)
        bgStyle.setStyle(dvt.CSSStyle.BACKGROUND_COLOR, bgColor);
      else
        bbox.setInvisibleFill();
      bgStyle.setStyle(dvt.CSSStyle.BORDER_COLOR, borderColor);
      bgStyle.setStyle(dvt.CSSStyle.BORDER_WIDTH, borderWidth);
      bgStyle.setStyle(dvt.CSSStyle.BORDER_RADIUS, borderRadius);
      bbox.setCSSStyle(bgStyle);

      if (this._isLabelRotated[level])
        bbox.setMatrix(label.getMatrix());
      bbox.setMouseEnabled(false);
      return bbox;
    }
    return null;
  }
  else
    return null;
};

/**
 * Returns the index for the specified group.
 * @param {string} group The group.
 * @return {number} The group index. -1 if the group doesn't exist.
 */
dvt.GroupAxisInfo.prototype.getGroupIndex = function(group) {
  if (group == null)
    return -1;

  var index = -1;
  for (var i = 0; i < this._groupCount; i++) {
    var curGroup = this.getGroup(i);
    var matches = (group instanceof Array && curGroup instanceof Array) ? dvt.ArrayUtils.equals(group, curGroup) : group == curGroup;
    if (matches) {
      index = i;
      break;
    }
  }
  return index;
};


/**
 * @override
 */
dvt.GroupAxisInfo.prototype.getMinimumExtent = function() {
  return 1;
};


/**
 * @override
 */
dvt.GroupAxisInfo.prototype.getGroupWidth = function() {
  // returns the average group width
  return Math.abs(this.EndCoord - this.StartCoord) / Math.abs(this.MaxValue - this.MinValue);
};

/**
 * Returns the number of groups in the specified chart.
 * @return {number}
 */
dvt.GroupAxisInfo.prototype.getGroupCount = function() {
  return this._groupCount;
};


/**
 * Returns the number of label levels
 * @return {number}
 */
dvt.GroupAxisInfo.prototype.getNumLevels = function() {
  return this._numLevels;
};


/**
 * Conducts a DFS on a hierarchical group object to update the levelsArray
 * @param {object} groupsArray An array of chart groups
 * @param {number} level The level in the hierarchy
 * @param {object} levelsArray A structure of hierarchical group labels by level
 * @param {number} groupIndex The index of the current group
 * @return {groupIndex} A running count of the number of leaf groups
 * @private
 */
dvt.GroupAxisInfo.prototype._generateLevelsArray = function(groupsArray, level, levelsArray, groupIndex) {
  for (var i = 0; i < groupsArray.length; i++) {

    // Add new array if at first group in a new level
    if (!levelsArray[level])
      levelsArray[level] = [];

    // Store object for group
    levelsArray[level].push({'item': groupsArray[i], 'start': groupIndex, 'end': groupIndex, 'position': i});

    if (groupsArray[i] && groupsArray[i]['groups']) {
      var lastIndex = levelsArray[level].length - 1;
      var numChildren = this._generateLevelsArray(groupsArray[i]['groups'], level + 1, levelsArray, levelsArray[level][lastIndex]['start']);
      levelsArray[level][lastIndex]['end'] = numChildren - 1; // start and end index used for centering group labels
      groupIndex = numChildren;
    }
    else
      groupIndex++;
  }
  return groupIndex;
};


/**
 * Returns the value for the given attribute for the group item specified by index and level
 * @param {number} index
 * @param {number} level
 * @param {string} attribute The desired atribute
 * @return {string} The value of the desires attribute
 * @private
 */
dvt.GroupAxisInfo.prototype._getGroupAttribute = function(index, level, attribute) {
  if (level == null)
    level = this._numLevels - 1;
  var groupItem = (this._levelsArray[level] && this._levelsArray[level][index]) ? this._levelsArray[level][index]['item'] : null;
  return groupItem ? groupItem[attribute] : null;
};

/**
 * Returns whether or not to render group separators
 * @return {boolean}
 */
dvt.GroupAxisInfo.prototype.areSeparatorsRendered = function() {
  return this._areSeparatorsRendered;
};

/**
 * Returns the color of the group separators
 * @return {boolean}
 */
dvt.GroupAxisInfo.prototype.getSeparatorColor = function() {
  return this._separatorColor;
};

/**
 * Returns the start index for the group item specified by index and level
 * @param {number} index
 * @param {number} level
 * @return {number} The start index
 */
dvt.GroupAxisInfo.prototype.getStartIndex = function(index, level) {
  if (level == null)
    level = this._numLevels - 1;
  var startIndex = (this._levelsArray[level] && this._levelsArray[level][index]) ? this._levelsArray[level][index]['start'] : null;
  return startIndex;
};

/**
 * Returns the end index for the group item specified by index and level
 * @param {number} index
 * @param {number} level
 * @return {number} The end index
 */
dvt.GroupAxisInfo.prototype.getEndIndex = function(index, level) {
  if (level == null)
    level = this._numLevels - 1;
  var endIndex = (this._levelsArray[level] && this._levelsArray[level][index]) ? this._levelsArray[level][index]['end'] : null;
  return endIndex;
};

/**
 * Returns the position for the group item specified by index and level, in reference to it's parent
 * @param {number} index
 * @param {number} level
 * @return {number} The position of the group item in it's parent's array of children
 */
dvt.GroupAxisInfo.prototype.getPosition = function(index, level) {
  if (level == null)
    level = this._numLevels - 1;
  var endIndex = (this._levelsArray[level] && this._levelsArray[level][index]) ? this._levelsArray[level][index]['position'] : null;
  return endIndex;
};

/**
 * Returns whether or not the axis is shifted
 * @return {boolean}
 */
dvt.GroupAxisInfo.prototype.isRenderGridAtLabels = function() {
  return this._renderGridAtLabels;
};

/**
 * Store the index of the innermost level that was able to be rendered
 * @param {number} level The innermost level rendered
 */
dvt.GroupAxisInfo.prototype.setLastRenderedLevel = function(level) {
  this._lastRenderedLevel = level;
};

/**
 * Returns the index of the innermost level that was able to be rendered
 * @return {number} The innermost level rendered
 */
dvt.GroupAxisInfo.prototype.getLastRenderedLevel = function() {
  return this._lastRenderedLevel;
};

/**
 * Returns the true index of the given group label
 * @param {dvt.OutputText} label The group label
 * @return {Number} The index of teh group label in regards to it's position in it's level of labels
 */
dvt.GroupAxisInfo.prototype.getLabelIndex = function(label) {
  return label._index >= 0 ? label._index : null;
};

/**
 * Returns the maximum lines allowed for wrapped labels.
 * @return {number}
 */
dvt.GroupAxisInfo.prototype.getMaxLineWrap = function() {
  return this._maxLineWrap;
};

/**
 * Returns whether or not we should attempt to wrap a horizontal multiline text object
 * @param {dvt.Context} context
 * @param {String} label The label string of the text object
 * @param {dvt.CSSStyle} style The cssstyle of the text object
 * @param {Boolean} rotationEnabled Whether or not the text object is on an axis that enables label rotation
 * @param {Number} maxWidth The maximum width that will be given to the text object to wrap horizontally
 * @return {boolean}
 * @private
 */
dvt.GroupAxisInfo.prototype._isTextWrapNeeded = function(context, label, style, rotationEnabled, maxWidth) {
  var textWidth = dvt.TextUtils.getTextStringWidth(context, label, style);

  // Only attempt to wrap text horizontally if:
  // 1. The textWidth is longer that the maxWidth.
  // 2. The maximum possible width of each potential wrapped line is less than the maxWidth,
  //    or rotation is not enabled.
  // Note: This estimate may still attempt to wrap text that may not fully fit and eventually be rotated
  if (textWidth >= maxWidth && ((textWidth / this._maxLineWrap < maxWidth) || !rotationEnabled))
    return true;

  return false;
};
/**
 * Simple logical object for tooltip support.
 * @param {dvt.Axis} axis The axis.
 * @param {dvt.OutputText} label The owning text instance.
 * @param {string|Array} group A string or an array of groups names/ids of the label and the ancestors.
 * @param {object} action The action associated with the label.
 * @param {object} drillable Whether the label is drillable.
 * @param {string} tooltip The tooltip of the label.
 * @param {string} datatip The datatip of the label.
 * @param {object=} params Optional object containing additional parameters for use by component.
 * @class DvtAxisObjPeer
 * @constructor
 * @implements {dvt.SimpleObjPeer}
 * @implements {DvtLogicalObject}
 */
var DvtAxisObjPeer = function(axis, label, group, action, drillable, tooltip, datatip, params) {
  this.Init(axis, label, group, action, drillable, tooltip, datatip, params);
};

dvt.Obj.createSubclass(DvtAxisObjPeer, dvt.SimpleObjPeer);


/**
 * @param {dvt.Axis} axis The axis.
 * @param {dvt.OutputText} label The owning text instance.
 * @param {string|Array} group A string or an array of groups names/ids of the label and the ancestors.
 * @param {object} action The action associated with the label.
 * @param {object} drillable Whether the label is drillable.
 * @param {string} tooltip The tooltip of the label.
 * @param {string} datatip The datatip of the label.
 * @param {object=} params Optional object containing additional parameters for use by component.
 */
DvtAxisObjPeer.prototype.Init = function(axis, label, group, action, drillable, tooltip, datatip, params) {
  DvtAxisObjPeer.superclass.Init.call(this, tooltip, datatip, null, params);

  this._axis = axis;
  this._label = label;
  this._group = group;
  this._action = action;
  this._drillable = drillable;

  // Apply the cursor for the action if specified
  if (this._action || this._drillable)
    label.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());

  axis.__registerObject(this);
};


/**
 * Returns the label for this object.
 * @return {dvt.OutputText}
 */
DvtAxisObjPeer.prototype.getLabel = function() {
  return this._label;
};


/**
 * Returns the id for this object.
 * @return {object} The id for this label.
 */
DvtAxisObjPeer.prototype.getId = function() {
  return this._group;
};


/**
 * Return the action string for the label, if any exists.
 * @return {string} the action outcome for the label.
 */
DvtAxisObjPeer.prototype.getAction = function() {
  return this._action;
};


/**
 * Returns whether the label is drillable.
 * @return {boolean}
 */
DvtAxisObjPeer.prototype.isDrillable = function() {
  return this._drillable;
};


/**
 * Returns the group.
 * @return {string|Array}
 */
DvtAxisObjPeer.prototype.getGroup = function() {
  return this._group;
};


//---------------------------------------------------------------------//
// Keyboard Support: DvtKeyboardNavigable impl                         //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtAxisObjPeer.prototype.getNextNavigable = function(event) {
  // TODO: Figure out if this is necessary
  if (event.type == dvt.MouseEvent.CLICK)
    return this;

  var navigables = this._axis.__getKeyboardObjects();
  return dvt.KeyboardHandler.getNextNavigable(this, event, navigables);
};

/**
 * @override
 */
DvtAxisObjPeer.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) {
  if (this._label)
    return this._label.getDimensions(targetCoordinateSpace);
  else
    return new dvt.Rectangle(0, 0, 0, 0);
};

/**
 * @override
 */
DvtAxisObjPeer.prototype.getDisplayable = function() {
  return this._label;
};

/**
 * @override
 */
DvtAxisObjPeer.prototype.getTargetElem = function() {
  if (this._label)
    return this._label.getElem();
  return null;
};

/**
 * @override
 */
DvtAxisObjPeer.prototype.showKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = true;
  if (this._label) {
    var bounds = this.getKeyboardBoundingBox();
    this._overlayRect = new dvt.Rect(this._axis.getCtx(), bounds.x, bounds.y, bounds.w, bounds.h);
    this._overlayRect.setSolidStroke(dvt.Agent.getFocusColor());
    this._overlayRect.setInvisibleFill();
    this._axis.addChild(this._overlayRect);
  }
};


/**
 * @override
 */
DvtAxisObjPeer.prototype.hideKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = false;
  if (this._label) {
    this._axis.removeChild(this._overlayRect);
    this._overlayRect = null;
  }
};


/**
 * @override
 */
DvtAxisObjPeer.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};


//---------------------------------------------------------------------//
// WAI-ARIA Support: DvtLogicalObject impl               //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtAxisObjPeer.prototype.getAriaLabel = function() {
  var states;
  if (this.isDrillable())
    states = [dvt.Bundle.getTranslation(this._axis.getOptions(), 'stateDrillable', dvt.Bundle.UTIL_PREFIX, 'STATE_DRILLABLE')];

  if (this.getDatatip() != null) {
    return dvt.Displayable.generateAriaLabel(this.getDatatip() , states);
  }
  else if (states != null) {
    return dvt.Displayable.generateAriaLabel(this.getLabel().getTextString(), states);
  }

};
/**
 * Formatter for an axis with a linear scale.
 * Following cases can occur:
 * 1. scaling is set to none:
 *    No scaling is used in this case.
 * 2. scaling is set to auto, null or undefined:
 *    Scaling is computed. The nearest (less or equal) known scale is used. Regarding fraction part, if autoPrecision equals "on" then the count of significant decimal places
 *    is based on tickStep otherwise fraction part is not formatted.
 * 3. otherwise
 *    Defined scaling is used.
 *    Examples (autoPrecision = "on"):
 *    minValue = 0, maxValue=10000, tickStep=1000, scale="thousand" -> formatted axis values: 0K , ..., 10K
 *    minValue = 0, maxValue=100, tickStep=10, scale="thousand" -> formatted axis values: 0.00K, 0.01K, ..., 0.10K
 *
 * @param {dvt.Context} context
 * @param {number} minValue the minimum value on the axis
 * @param {number} maxValue the maximum value on the axis
 * @param {number} tickStep the tick step between values on the axis
 * @param {string} scale the scale of values on the axis; if null or undefined then auto scaling is used.
 * @param {string} autoPrecision "on" if auto precision should be applied otherwise "off"; if null or undefined then auto precision is applied.
 * @constructor
 */
dvt.LinearScaleAxisValueFormatter = function(context, minValue, maxValue, tickStep, scale, autoPrecision) {
  this.Init(context, minValue, maxValue, tickStep, scale, autoPrecision);
};

dvt.Obj.createSubclass(dvt.LinearScaleAxisValueFormatter, dvt.Obj);

// Allowed scales that can be used as formatter scale param values
/** @const **/
dvt.LinearScaleAxisValueFormatter.SCALE_NONE = 'none';
/** @const **/
dvt.LinearScaleAxisValueFormatter.SCALE_AUTO = 'auto';
/** @const **/
dvt.LinearScaleAxisValueFormatter.SCALE_THOUSAND = 'thousand';
/** @const **/
dvt.LinearScaleAxisValueFormatter.SCALE_MILLION = 'million';
/** @const **/
dvt.LinearScaleAxisValueFormatter.SCALE_BILLION = 'billion';
/** @const **/
dvt.LinearScaleAxisValueFormatter.SCALE_TRILLION = 'trillion';
/** @const **/
dvt.LinearScaleAxisValueFormatter.SCALE_QUADRILLION = 'quadrillion';
/** @const **/


/**
 * The scaling factor difference between successive scale values
 */
dvt.LinearScaleAxisValueFormatter.SCALING_FACTOR_DIFFERENCE = 3;


/**
 * Initializes the instance.
 * @param {object} context
 * @param {number} minValue
 * @param {number} maxValue
 * @param {number} tickStep
 * @param {number} scale
 * @param {number} autoPrecision
 */
dvt.LinearScaleAxisValueFormatter.prototype.Init = function(context, minValue, maxValue, tickStep, scale, autoPrecision) {
  this._context = context;
  // array of successive scale values
  this._scales = {
  };
  // array of scale values ordered by scale factor asc
  this._scalesOrder = [];
  // mapping of scale factors to corresponding scale objects
  this._factorToScaleMapping = {
  };

  this.InitScales();
  this.InitFormatter(minValue, maxValue, tickStep, scale, autoPrecision);
};


/**
 * Initializes scale objects.
 * @protected
 *
 */
dvt.LinearScaleAxisValueFormatter.prototype.InitScales = function() {
  /**
   * Creates scale object and refreshes formatter properties using it.
   * @param {string} scaleName one of allowed scale names (e.g. dvt.LinearScaleAxisValueFormatter.SCALE_THOUSAND)
   * @param {number} scaleFactor scale factor of corresponding scale, i.e. 'x' such that 10^x represents corresponding scale (e.g. for scale dvt.LinearScaleAxisValueFormatter.SCALE_THOUSAND x = 3)
   * @param {string} scaleKey translation key which value (translated) represents given scale (e.g. for dvt.LinearScaleAxisValueFormatter.SCALE_THOUSAND an translated english suffix is 'K')
   * @this {dvt.LinearScaleAxisValueFormatter}
   */
  var createScale = function(scaleName, scaleFactor, scaleKey) {
    var suffix;
    if (scaleKey) {
      // when bundle and bundle suffix is defined then init suffix
      suffix = dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, scaleKey);
    }

    var scale = {
      scaleFactor: scaleFactor, localizedSuffix: suffix
    };

    // update private properties
    this._scales[scaleName] = scale;
    this._scalesOrder.push(scale);
    this._factorToScaleMapping[scaleFactor] = scale;
  };

  var diff = dvt.LinearScaleAxisValueFormatter.SCALING_FACTOR_DIFFERENCE;

  createScale.call(this, dvt.LinearScaleAxisValueFormatter.SCALE_NONE, 0 * diff);
  createScale.call(this, dvt.LinearScaleAxisValueFormatter.SCALE_THOUSAND, 1 * diff, 'SCALING_SUFFIX_THOUSAND');
  createScale.call(this, dvt.LinearScaleAxisValueFormatter.SCALE_MILLION, 2 * diff, 'SCALING_SUFFIX_MILLION');
  createScale.call(this, dvt.LinearScaleAxisValueFormatter.SCALE_BILLION, 3 * diff, 'SCALING_SUFFIX_BILLION');
  createScale.call(this, dvt.LinearScaleAxisValueFormatter.SCALE_TRILLION, 4 * diff, 'SCALING_SUFFIX_TRILLION');
  createScale.call(this, dvt.LinearScaleAxisValueFormatter.SCALE_QUADRILLION, 5 * diff, 'SCALING_SUFFIX_QUADRILLION');

  // sort _scalesOrder array
  this._scalesOrder.sort(function(scale1, scale2) {
    if (scale1.scaleFactor < scale2.scaleFactor) {
      return - 1;
    }
    else if (scale1.scaleFactor > scale2.scaleFactor) {
      return 1;
    }
    else {
      return 0;
    }
  });
};


/**
 * Initializes properties used for values formatting (e.g. scale factor that should be applied etc.).
 *
 * @param {number} minValue the minimum value on the axis
 * @param {number} maxValue the maximum value on the axis
 * @param {number} tickStep the tick step between values on the axis
 * @param {string} scale the scale of values on the axis
 * @param {boolean} autoPrecision true if auto precision should be applied otherwise false
 * @protected
 *
 */
dvt.LinearScaleAxisValueFormatter.prototype.InitFormatter = function(minValue, maxValue, tickStep, scale, autoPrecision) {
  var findScale = false, decimalPlaces, scaleFactor, useAutoPrecision = false;

  // if autoPrecision doesn't equal "off" (i.e. is "on", null, undefined) then auto precision should be used.
  if (!(autoPrecision === 'off')) {
    useAutoPrecision = true;
  }
  // try to use scale given by "scale" param and if no scale factor is found find appropriate scale
  scaleFactor = this._getScaleFactor(scale);
  if ((typeof scaleFactor) !== 'number') {
    findScale = true;
  }

  // base a default scale factor calculation on the order of
  // magnitude (power of ten) of the maximum absolute value on the axis
  if (findScale) {
    // get the axis endpoint with the largest absolute value,
    // and find its base 10 exponent
    var absMax = Math.max(Math.abs(minValue), Math.abs(maxValue));

    var power = this._getPowerOfTen(absMax);
    scaleFactor = this._findNearestLEScaleFactor(power);
  }

  if (useAutoPrecision === true) {
    if (tickStep == 0 && minValue == maxValue) {
      // TODO:  Remove this hack for chart tooltips, which currently passes 0 as the tick step in all cases.
      // Workaround for now will be to add decimal places to show at least 1 and at most 4 significant digits
      var valuePowerOfTen = this._getPowerOfTen(maxValue);
      var scaleFactorDiff = scaleFactor - valuePowerOfTen;
      if (scaleFactorDiff <= 0) // Value is same or larger than the scale factor, ensure 4 significant digits.
        // Make sure that the number of decimal places is at least zero. 
        decimalPlaces = Math.max(scaleFactorDiff + 3, 0);
      else // Value is smaller, ensure enough decimals to show 1 significant digit
        decimalPlaces = Math.max(scaleFactorDiff, 4);
    }
    else {
      // get the number of decimal places in the number by subtracting
      // the order of magnitude of the tick step from the order of magnitude
      // of the scale factor
      // (e.g.: scale to K, tick step of 50 -> 3 - 1 = 2 decimal places)
      var tickStepPowerOfTen = this._getPowerOfTen(tickStep);
      decimalPlaces = Math.max(scaleFactor - tickStepPowerOfTen, 0);
    }
  }

  // init private properties with computed values
  this._useAutoPrecision = useAutoPrecision;
  this._scaleFactor = scaleFactor;
  this._decimalPlaces = decimalPlaces;
};


/**
 * Finds a scale factor 'x' such that x <= value (e.g. if value equals 4 then returned scale factor equals 3)
 * @param {number} value value representing an order of magnitude
 * @return {number} a scale factor 'x' such that x <= value
 * @private
 */
dvt.LinearScaleAxisValueFormatter.prototype._findNearestLEScaleFactor = function(value) {
  var scaleFactor = 0;

  if (value <= this._scalesOrder[0].scaleFactor) {
    // if the number is less than 10, don't scale
    scaleFactor = this._scalesOrder[0].scaleFactor;
  }
  else if (value >= this._scalesOrder[this._scalesOrder.length - 1].scaleFactor) {
    // if the data is greater than or equal to 10 quadrillion, scale to quadrillions
    scaleFactor = this._scalesOrder[this._scalesOrder.length - 1].scaleFactor;
  }
  else {
    // else find the nearest scaleFactor such that scaleFactor <= value
    var end = this._scalesOrder.length - 1;
    for (var i = end; i >= 0; i--) {
      if (this._scalesOrder[i].scaleFactor <= value) {
        scaleFactor = this._scalesOrder[i].scaleFactor;
        break;
      }
    }
  }
  return scaleFactor;
};


/**
 * Returns scale factor of scale given by scale name.
 * @param {string} scaleName
 * @return {number} scale factor of scale given by scale name
 * @private
 */
dvt.LinearScaleAxisValueFormatter.prototype._getScaleFactor = function(scaleName) {
  // If no scaling factor defined, use auto by default.
  if (!scaleName)
    scaleName = dvt.LinearScaleAxisValueFormatter.SCALE_AUTO;

  var scaleFactor, scale = this._scales[scaleName];
  if (scale) {
    scaleFactor = scale.scaleFactor;
  }
  return scaleFactor;
};


/**
 * Formats given value using previously computed scale factor and decimal digits count. In case that parsed value equals NaN an unformatted value is returned.
 * @override
 * @param {object} value to be formatted.
 * @return {string} formatted value as string
 */
dvt.LinearScaleAxisValueFormatter.prototype.format = function(value, converter) {
  var parsed = parseFloat(value);
  if (!isNaN(parsed)) {
    // Find the suffix for the scale factor
    var suffix;
    if (this._scaleFactor > 0) {
      for (var i = 0; i < this._scaleFactor; i++) {
        parsed /= 10;
      }
      suffix = this._factorToScaleMapping[this._scaleFactor].localizedSuffix;
    }

    // Convert the number itself
    if (converter && converter['getAsString']) {
      parsed = converter['getAsString'](parsed);
    }
    else if (converter && converter['format'])
      parsed = converter['format'](parsed);
    else {
      var defaultConverter = this._context.getNumberConverter({'minimumFractionDigits': this._decimalPlaces, 'maximumFractionDigits': this._decimalPlaces});
      if (defaultConverter && defaultConverter['format'])
        parsed = defaultConverter['format'](parsed);
      else if (this._useAutoPrecision && !isNaN(parseFloat(parsed))) {
        parsed = parseFloat(new Number(parsed).toFixed(this._decimalPlaces));
        parsed = this._formatFraction(parsed);
      }
    }

    // Add the scale factor suffix, unless value is zero
    if (typeof suffix === 'string' && value != 0) {
      parsed += suffix;
    }
    return parsed;
  }
  else {
    return value;
  }
};


/**
 * Formats fraction part of given value (adds zeroes if needed).
 * @param {number} value to be formatted
 * @return {string} number with fraction part formatted as string
 * @private
 */
dvt.LinearScaleAxisValueFormatter.prototype._formatFraction = function(value) {
  var formatted = value.toString();

  // Don't format scientific notation (e.g. '1e-7')
  if (formatted.indexOf('e') != -1)
    return formatted;

  var decimalSep = '.';
  decimalSep = dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'NUMBER_FORMAT_DECIMAL_SEPARATOR');
  if (this._decimalPlaces > 0) {
    if (formatted.indexOf('.') == -1) {
      formatted += decimalSep;
    } else {
      formatted = formatted.replace('.', decimalSep);
    }

    var existingPlacesCount = formatted.substring(formatted.indexOf(decimalSep) + 1).length;

    while (existingPlacesCount < this._decimalPlaces) {
      formatted += '0';
      existingPlacesCount++;
    }
  }
  return formatted;
};


/**
 * Fro given value it returns its order of magnitude.
 * @param {number} value for which order of magnitude should be found
 * @return {number} order of magnitude for given value
 * @private
 */
dvt.LinearScaleAxisValueFormatter.prototype._getPowerOfTen = function(value) {
  // more comprehensive and easier than working with value returned by Math.log(value)/Math.log(10)
  value = (value >= 0) ? value : - value;
  var power = 0;

  // Check for degenerate and zero values
  if (value < 1E-15) {
    return 0;
  }
  else if (value == Infinity) {
    return Number.MAX_VALUE;
  }

  if (value >= 10) {
    // e.g. for 1000 the power should be 3
    while (value >= 10) {
      power += 1;
      value /= 10;
    }
  }
  else if (value < 1) {
    while (value < 1) {
      power -= 1;
      value *= 10;
    }
  }
  return power;
};
/**
 * Calculated axis information and drawable creation for a time axis.
 * @param {dvt.Context} context
 * @param {object} options The object containing specifications and data for this component.
 * @param {dvt.Rectangle} availSpace The available space.
 * @class
 * @constructor
 * @extends {dvt.AxisInfo}
 */
dvt.TimeAxisInfo = function(context, options, availSpace) {
  this.Init(context, options, availSpace);
};

dvt.Obj.createSubclass(dvt.TimeAxisInfo, dvt.AxisInfo);

// ------------------------
// Constants
//
/** @const */
dvt.TimeAxisInfo.TIME_SECOND = 1000;
/** @const */
dvt.TimeAxisInfo.TIME_MINUTE = 60 * dvt.TimeAxisInfo.TIME_SECOND;
/** @const */
dvt.TimeAxisInfo.TIME_HOUR = 60 * dvt.TimeAxisInfo.TIME_MINUTE;
/** @const */
dvt.TimeAxisInfo.TIME_DAY = 24 * dvt.TimeAxisInfo.TIME_HOUR;
/** @const */
dvt.TimeAxisInfo.TIME_MONTH_MIN = 28 * dvt.TimeAxisInfo.TIME_DAY;
/** @const */
dvt.TimeAxisInfo.TIME_MONTH_MAX = 31 * dvt.TimeAxisInfo.TIME_DAY;
/** @const */
dvt.TimeAxisInfo.TIME_YEAR_MIN = 365 * dvt.TimeAxisInfo.TIME_DAY;
/** @const */
dvt.TimeAxisInfo.TIME_YEAR_MAX = 366 * dvt.TimeAxisInfo.TIME_DAY;

/**
 * @override
 */
dvt.TimeAxisInfo.prototype.Init = function(context, options, availSpace) {
  dvt.TimeAxisInfo.superclass.Init.call(this, context, options, availSpace);

  // Figure out the coords for the min/max values
  if (this.Position == 'top' || this.Position == 'bottom') {
    // Provide at least the minimum buffer at each side to accommodate labels
    if (!options['_isOverview'] && options['tickLabel']['rendered'] == 'on') {
      this.StartOverflow = Math.max(dvt.Axis.MINIMUM_AXIS_BUFFER - options['leftBuffer'], 0);
      this.EndOverflow = Math.max(dvt.Axis.MINIMUM_AXIS_BUFFER - options['rightBuffer'], 0);
    }

    // Axis is horizontal, so flip for BIDI if needed
    if (dvt.Agent.isRightToLeft(context)) {
      this._startCoord = this.EndCoord - this.EndOverflow;
      this._endCoord = this.StartCoord + this.StartOverflow;
    }
    else {
      this._startCoord = this.StartCoord + this.StartOverflow;
      this._endCoord = this.EndCoord - this.EndOverflow;
    }
  }
  else {
    // Vertical axis should go from top to bottom
    this._startCoord = this.StartCoord;
    this._endCoord = this.EndCoord;
  }

  var converter = options['tickLabel'] != null ? options['tickLabel']['converter'] : null;
  this._label1Converter = (converter && converter[0]) ? converter[0] : converter;
  this._label2Converter = (converter && converter[1]) ? converter[1] : null;
  this._dateToIsoConverter = context.getLocaleHelpers()['dateToIsoConverter'];

  this._groups = options['groups'];

  var timeAxisType = options['timeAxisType'];
  this._skipGaps = timeAxisType == 'skipGaps';
  this._mixedFrequency = timeAxisType == 'mixedFrequency';

  this.DataMin = options['dataMin'];
  this.DataMax = options['dataMax'];

  if (this._groups.length > 1)
    this._averageInterval = (this.DataMax - this.DataMin) / (this._groups.length - 1);
  else if (this.DataMax - this.DataMin > 0)
    this._averageInterval = this.DataMax - this.DataMin;
  else
    this._averageInterval = 6 * dvt.TimeAxisInfo.TIME_MINUTE; // to get the time axis to show YMDHM information
  this._step = options['step'];

  // Calculate the increment and add offsets if specified
  var endOffset = options['endGroupOffset'] > 0 ? options['endGroupOffset'] * this._averageInterval : 0;
  var startOffset = options['startGroupOffset'] > 0 ? options['startGroupOffset'] * this._averageInterval : 0;

  this.GlobalMin = options['min'] != null ? options['min'] : this.DataMin - startOffset;
  this.GlobalMax = options['max'] != null ? options['max'] : this.DataMax + endOffset;

  // Set min/max by start/endGroup
  if (options['viewportStartGroup'] != null)
    this.MinValue = options['viewportStartGroup'] - startOffset;
  if (options['viewportEndGroup'] != null)
    this.MaxValue = options['viewportEndGroup'] + endOffset;

  // Set min/max by viewport min/max
  if (options['viewportMin'] != null)
    this.MinValue = options['viewportMin'];
  if (options['viewportMax'] != null)
    this.MaxValue = options['viewportMax'];

  // If min/max is still undefined, fall back to global min/max
  if (this.MinValue == null)
    this.MinValue = this.GlobalMin;
  if (this.MaxValue == null)
    this.MaxValue = this.GlobalMax;

  if (this.GlobalMin > this.MinValue)
    this.GlobalMin = this.MinValue;
  if (this.GlobalMax < this.MaxValue)
    this.GlobalMax = this.MaxValue;

  this._timeRange = this.MaxValue - this.MinValue;

  this._level1Labels = null;
  this._level2Labels = null;
  // Coordinates of labels need to be stored for gridline rendering
  this._level1Coords = null;
  this._level2Coords = null;
  this._isOneLevel = true;

  // Overflow of labels need to be stored for attempting to align level1 & level2 labels
  this._level1Overflow = [];
  this._level2Overflow = [];

  this._locale = options['_locale'].toLowerCase();

  this._monthResources = [
    dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'MONTH_SHORT_JANUARY'),
    dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'MONTH_SHORT_FEBRUARY'),
    dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'MONTH_SHORT_MARCH'),
    dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'MONTH_SHORT_APRIL'),
    dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'MONTH_SHORT_MAY'),
    dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'MONTH_SHORT_JUNE'),
    dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'MONTH_SHORT_JULY'),
    dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'MONTH_SHORT_AUGUST'),
    dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'MONTH_SHORT_SEPTEMBER'),
    dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'MONTH_SHORT_OCTOBER'),
    dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'MONTH_SHORT_NOVEMBER'),
    dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'MONTH_SHORT_DECEMBER')
  ];
};

/**
 * Returns the am string for this locale if applicable.
 * @param {String} locale the locale for the axis.
 * @return {String} the string representing "am"
 * @private
 */
dvt.TimeAxisInfo._getAMString = function(locale) {
  var language = locale.substring(0, 2);
  if (locale == 'en-au' || locale == 'en-ie' || locale == 'en-ph')
    return 'am';
  else if (locale == 'en-gb')
    return '';
  switch (language) {
    case 'en':
      return 'AM';
    case 'ar':
      return '\u0635';
    case 'el':
      return '\u03c0\u03bc';
    case 'ko':
      return '\uc624\uc804';
    case 'zh':
      return '\u4e0a\u5348';
    default:
      return '';
  }
};

/**
 * Returns the pm string for this locale if applicable.
 * @param {String} locale the locale for the axis.
 * @return {String} the string representing "pm"
 * @private
 */
dvt.TimeAxisInfo._getPMString = function(locale) {
  var language = locale.substring(0, 2);
  if (locale == 'en-au' || locale == 'en-ie' || locale == 'en-ph')
    return 'pm';
  else if (locale == 'en-gb')
    return '';
  switch (language) {
    case 'en':
      return 'PM';
    case 'ar':
      return '\u0645';
    case 'el':
      return '\u03bc\u03bc';
    case 'ko':
      return '\uc624\ud6c4';
    case 'zh':
      return '\u4e0b\u5348';
    default:
      return '';
  }
};

/**
 * Returns whether the AM/PM string should be displayed before or after the time string based on locale.
 * @param {String} locale the locale for the axis
 * @return {boolean} whether the AM/PM string before the time.
 * @private
 */
dvt.TimeAxisInfo._getAMPMBefore = function(locale) {
  var language = locale.substring(0, 2);
  if (language == 'ko' || language == 'zh')
    return true;
  else
    return false;
};

/**
 * Returns the DMY order based on the locale
 * @param {String} locale the locale for the axis
 * @return {String} the order of date, month and year
 * @private
 */
dvt.TimeAxisInfo._getDMYOrder = function(locale) {
  var language = locale.substring(0, 2);
  if (locale == 'en-us' || locale == 'en-ph')
    return 'MDY';
  else if (language == 'fa' || language == 'hu' || language == 'ja' || language == 'ko' || language == 'lt' || language == 'mn' || language == 'zh')
    return 'YMD';
  else
    return 'DMY';
};

/**
 * Returns the trailing characters for the year
 * @param {String} locale the locale for the axis
 * @return {String} the year trailing character by locale
 * @private
 */
dvt.TimeAxisInfo._getYearTrailingCharacters = function(locale) {
  if (locale.indexOf('ja') == 0 || locale.indexOf('zh') == 0)
    return '\u5e74';
  else if (locale.indexOf('ko') == 0)
    return'\ub144';
  else
    return '';
};

/**
 * Returns the trailing characters for the day
 * @param {String} locale the locale for the axis
 * @return {String} the day trailing character by locale
 * @private
 */
dvt.TimeAxisInfo._getDayTrailingCharacters = function(locale) {
  if (locale.indexOf('ja') == 0 || locale.indexOf('zh') == 0)
    return '\u65e5';
  else if (locale.indexOf('ko') == 0)
    return'\uc77c';
  else
    return '';
};

/**
 * Formats the label given an axis value (used for generating tooltips).
 * @param {Number} axisValue The axis value (in milliseconds)
 * @return {String} A formatted axis label
 */
dvt.TimeAxisInfo.prototype.formatLabel = function(axisValue) {
  var date = new Date(axisValue);
  var twoLabels = this._formatAxisLabel(date, null, true);
  if (twoLabels[1] != null) {
    if (dvt.TimeAxisInfo._getDMYOrder(this._locale) == 'YMD' || (this._timeRange < dvt.TimeAxisInfo.TIME_MONTH_MIN && this._step < dvt.TimeAxisInfo.TIME_DAY)) // time showing HH:MM:SS or YMD order
      return twoLabels[1] + ' ' + twoLabels[0];
    else
      return twoLabels[0] + ' ' + twoLabels[1];
  }
  else
    return twoLabels[0];
};

/**
 * Formats the given date with the given converter
 * @param {Date} date The current date
 * @param {Date} prevDate The date of the previous set of labels
 * @param {Object} converter The converter
 * @return {String} An axis label
 * @private
 */
dvt.TimeAxisInfo.prototype._formatAxisLabelWithConverter = function(date, prevDate, converter) {
  if (converter) {
    var label = null;
    var prevLabel = null;
    if (converter['getAsString']) {
      label = converter['getAsString'](date);
      prevLabel = converter['getAsString'](prevDate);
    }
    else if (converter['format']) {
      label = converter['format'](this._dateToIsoConverter ? this._dateToIsoConverter(date) : date);
      prevLabel = converter['format'](this._dateToIsoConverter ? this._dateToIsoConverter(prevDate) : prevDate);
    }
    if (prevLabel != label)
      return label;
  }
  return null;
};

/**
 * Formats the level 1 and level 2 axis labels
 * @param {Date} date The current date
 * @param {Date} prevDate The date of the previous set of labels
 * @param {boolean} bOneLabel Whether we want to show only one label. Used for tooltip to get correct order for MDY
 * @return {Array} An array [level1Label, level2Label]
 * @private
 */
dvt.TimeAxisInfo.prototype._formatAxisLabel = function(date, prevDate, bOneLabel) {
  var label1 = null;// level 1 label
  var label2 = null;// level 2 label
  var isVert = this.Position == 'left' || this.Position == 'right';

  // If dateTimeFormatter is used, use it
  if (this._label1Converter || this._label2Converter) {
    if (this._label1Converter)
      label1 = this._formatAxisLabelWithConverter(date, prevDate, this._label1Converter);
    if (this._label2Converter)
      label2 = this._formatAxisLabelWithConverter(date, prevDate, this._label2Converter);

    return [label1, label2];
  }

  if (this._step >= dvt.TimeAxisInfo.TIME_YEAR_MIN || this._timeRange >= 6 * dvt.TimeAxisInfo.TIME_YEAR_MIN) {
    label1 = this._formatDate(date, false, false, true);// Year
  }

  else if (this._step >= dvt.TimeAxisInfo.TIME_MONTH_MIN || this._timeRange >= 6 * dvt.TimeAxisInfo.TIME_MONTH_MIN) {
    if (prevDate == null || prevDate.getMonth() != date.getMonth())
      label1 = this._formatDate(date, false, true, false);// Month

    if (prevDate == null || prevDate.getYear() != date.getYear())
      label2 = this._formatDate(date, false, false, true);// Year
  }

  else if (this._step >= dvt.TimeAxisInfo.TIME_DAY || this._timeRange >= 6 * dvt.TimeAxisInfo.TIME_DAY) {
    if (bOneLabel) {
      label1 = this._formatDate(date, true, true, true);// Day, Month, Year
    }
    else {
      if (prevDate == null || prevDate.getDate() != date.getDate())
        label1 = this._formatDate(date, true, false, false);// Day

      if (prevDate == null || prevDate.getYear() != date.getYear())
        label2 = this._formatDate(date, false, true, true);// Year, Month
      else if (prevDate.getMonth() != date.getMonth())
        label2 = this._formatDate(date, false, true, false);// Month
    }
  }

  else {
    if (this._step >= dvt.TimeAxisInfo.TIME_HOUR || this._timeRange >= 6 * dvt.TimeAxisInfo.TIME_HOUR) {
      if (prevDate == null || (prevDate.getHours() != date.getHours()))
        label1 = this._formatTime(date, false, false);// HH AM/PM or HH:MM
    }
    else if (this._step >= dvt.TimeAxisInfo.TIME_MINUTE || this._timeRange >= 6 * dvt.TimeAxisInfo.TIME_MINUTE) {
      if (prevDate == null || (prevDate.getMinutes() != date.getMinutes()))
        label1 = this._formatTime(date, true, false);// HH:MM
    }
    else {
      if (prevDate == null || prevDate.getSeconds() != date.getSeconds())
        label1 = this._formatTime(date, true, true);// HH:MM:SS
    }

    if (isVert) {
      if (prevDate == null || prevDate.getDate() != date.getDate())
        label2 = this._formatDate(date, true, true, false);// Month, Day
    }
    else {
      if (prevDate == null || prevDate.getYear() != date.getYear())
        label2 = this._formatDate(date, true, true, true);// Year, Month, Day
      else if (prevDate.getMonth() != date.getMonth())
        label2 = this._formatDate(date, true, true, false);// Month, Day
      else if (prevDate.getDate() != date.getDate())
        label2 = this._formatDate(date, true, false, false);// Day
    }
  }


  return [label1, label2];
};


/**
 * Returns the date as a DMY string
 * @param {Date} date The date
 * @param {boolean} showDay Whether the day is shown
 * @param {boolean} showMonth Whether the month is shown
 * @param {boolean} showYear Whether the year is shown
 * @return {string} The formatted string
 * @private
 */
dvt.TimeAxisInfo.prototype._formatDate = function(date, showDay, showMonth, showYear) {
  // . Manually add 543 years to the Gregorian year if using a Thai locale.
  // Should use date.toLocaleDateString once it's available on Safari
  var yearStr = (this._locale.substring(0, 2) == 'th' && this.Options['_environment'] != 'jet') ? date.getFullYear() + 543 : date.getFullYear();

  var monthStr;
  if (this._monthResources && this._monthResources.length >= 12)
    monthStr = this._monthResources[date.getMonth()];
  else
    monthStr = date.toString().split(' ')[1];// date.toString() returns "Day Mon Date HH:MM:SS TZD YYYY"
  var dayStr = date.getDate();

  // Add the day and year trailing characters if needed
  // These will be "" if not needed
  yearStr += dvt.TimeAxisInfo._getYearTrailingCharacters(this._locale);
  dayStr += dvt.TimeAxisInfo._getDayTrailingCharacters(this._locale);

  // Process the DMY Order
  var dmyOrder = dvt.TimeAxisInfo._getDMYOrder(this._locale);

  var dateStr = '';

  for (var i = 0; i < dmyOrder.length; i++) {
    if (showDay && dmyOrder[i] == 'D') {
      dateStr += dayStr + ' ';
    }
    else if (showMonth && dmyOrder[i] == 'M') {
      dateStr += monthStr + ' ';
    }
    else if (showYear && dmyOrder[i] == 'Y') {
      dateStr += yearStr + ' ';
    }
  }

  return dateStr.length > 0 ? dateStr.slice(0, dateStr.length - 1) : dateStr;
};


/**
 * Returns the date as an HH:MM:SS string
 * @param {Date} date The date
 * @param {boolean} showMinute Whether the minute is shown
 * @param {boolean} showSecond Whether the second is shown
 * @return {string} The formatted string
 * @private
 */
dvt.TimeAxisInfo.prototype._formatTime = function(date, showMinute, showSecond) {
  var hours = date.getHours();
  var mins = date.getMinutes();
  var secs = date.getSeconds();

  var am = dvt.TimeAxisInfo._getAMString(this._locale);
  var pm = dvt.TimeAxisInfo._getPMString(this._locale);
  var ampmBefore = dvt.TimeAxisInfo._getAMPMBefore(this._locale);

  var b12HFormat = (am != '' && pm != '');
  var ampm;
  var timeLabel = '';

  if (dvt.Agent.isRightToLeft(this.getCtx()))
    timeLabel = '\u200F';

  if (b12HFormat) {
    if (hours < 12) {
      ampm = am;
      if (hours == 0)
        hours = 12;
    }
    else {
      ampm = pm;
      if (hours > 12)
        hours -= 12;
    }
    timeLabel += hours;

    if (showMinute || mins != 0)
      timeLabel += ':' + this._doubleDigit(mins);
  }
  else
    timeLabel += this._doubleDigit(hours) + ':' + this._doubleDigit(mins);

  if (showSecond) {
    timeLabel += ':' + this._doubleDigit(secs);
  }

  if (b12HFormat) {
    if (ampmBefore)
      return ampm + ' ' + timeLabel;
    else
      return timeLabel + ' ' + ampm;
  }
  else {
    return timeLabel;
  }
};


/**
 * Creates a double-digit number string for the HH:MM:SS format
 * @param {Number} num A number less than 100
 * @return {String} A double-digit number string
 * @private
 */
dvt.TimeAxisInfo.prototype._doubleDigit = function(num) {
  if (num < 10) {
    return '0' + num;
  }
  return '' + num;
};


/**
 * Returns the time label interval for mixed frequency data.
 * Makes sure that the interval is a regular time unit.
 * @return {number} The interval.
 * @private
 */
dvt.TimeAxisInfo.prototype._getMixedFrequencyStep = function() {
  if (this._timeRange >= 6 * dvt.TimeAxisInfo.TIME_YEAR_MIN)
    return dvt.TimeAxisInfo.TIME_YEAR_MIN;
  if (this._timeRange >= 6 * dvt.TimeAxisInfo.TIME_MONTH_MIN)
    return dvt.TimeAxisInfo.TIME_MONTH_MIN;
  if (this._timeRange >= 6 * dvt.TimeAxisInfo.TIME_DAY)
    return dvt.TimeAxisInfo.TIME_DAY;
  if (this._timeRange >= dvt.TimeAxisInfo.TIME_DAY)
    return 3 * dvt.TimeAxisInfo.TIME_HOUR;
  if (this._timeRange >= 6 * dvt.TimeAxisInfo.TIME_HOUR)
    return dvt.TimeAxisInfo.TIME_HOUR;
  if (this._timeRange >= dvt.TimeAxisInfo.TIME_HOUR)
    return 15 * dvt.TimeAxisInfo.TIME_MINUTE;
  if (this._timeRange >= 30 * dvt.TimeAxisInfo.TIME_MINUTE)
    return 5 * dvt.TimeAxisInfo.TIME_MINUTE;
  if (this._timeRange >= 6 * dvt.TimeAxisInfo.TIME_MINUTE)
    return dvt.TimeAxisInfo.TIME_MINUTE;
  if (this._timeRange >= dvt.TimeAxisInfo.TIME_MINUTE)
    return 15 * dvt.TimeAxisInfo.TIME_SECOND;
  if (this._timeRange >= 30 * dvt.TimeAxisInfo.TIME_SECOND)
    return 5 * dvt.TimeAxisInfo.TIME_SECOND;
  return dvt.TimeAxisInfo.TIME_SECOND;
};


/**
 * Returns the positions of time axis labels, given the start, end, and step
 * @param {number} start The start time of the axis.
 * @param {number} end The end time of the axis.
 * @param {number} step The increment between labels.
 * @return {array} A list of label positions.
 * @private
 */
dvt.TimeAxisInfo._getLabelPositions = function(start, end, step) {
  // The time positions has to be at even intervals from the beginning of a year (January 1, 12:00:00 AM), otherwise
  // we may have labels such as [2013, 2014, 2015, ...] that are drawn at [June 8 2013, June 8 2014, June 8 2015, ...],
  // which is data misrepresentation.
  var anchor = new Date(start);
  anchor.setMonth(0, 1); // January 1
  anchor.setHours(0, 0, 0, 0); // 00:00:00
  var time = anchor.getTime();

  var times = [];
  if (step >= dvt.TimeAxisInfo.TIME_YEAR_MIN && step <= dvt.TimeAxisInfo.TIME_YEAR_MAX) {
    // Assume that the step is one year, which can mean different # of days depending on the year
    while (time < start)
      time = dvt.TimeAxisInfo._addOneYear(time);
    while (time <= end) {
      times.push(time);
      time = dvt.TimeAxisInfo._addOneYear(time);
    }
  }
  else if (step >= dvt.TimeAxisInfo.TIME_MONTH_MIN && step <= dvt.TimeAxisInfo.TIME_MONTH_MAX) {
    // Assume that the step is one month, which can mean different # of days depending on the month
    while (time < start)
      time = dvt.TimeAxisInfo._addOneMonth(time);
    while (time <= end) {
      times.push(time);
      time = dvt.TimeAxisInfo._addOneMonth(time);
    }
  }
  else {
    time += Math.ceil((start - time) / step) * step;
    while (time <= end) {
      times.push(time);
      time += step;
    }
  }
  return times;
};


/**
 * Adds the time by one year, e.g. 2014 January 15 -> 2015 January 15 -> ...
 * @param {number} time The current time
 * @return {number} Next year
 * @private
 */
dvt.TimeAxisInfo._addOneYear = function(time) {
  var date = new Date(time);
  date.setFullYear(date.getFullYear() + 1);
  return date.getTime();
};

/**
 * Adds the time by one month, e.g. January 15 -> February 15 -> March 15 -> ...
 * @param {number} time The current time
 * @return {number} Next month
 * @private
 */
dvt.TimeAxisInfo._addOneMonth = function(time) {
  var date = new Date(time);
  date.setMonth(date.getMonth() + 1);
  return date.getTime();
};


/**
 * Generates the level 1 and level 2 tick labels
 * @param {dvt.Context} context
 * @private
 */
dvt.TimeAxisInfo.prototype._generateLabels = function(context) {
  var labels1 = [];
  var labels2 = [];
  var labelInfos1 = [];
  var coords1 = [];
  var coords2 = [];
  var prevDate = null;
  var c1 = 0;// number of level 1 labels
  var c2 = 0;// number of level 2 labels
  var container = context.getStage(context);
  var isRTL = dvt.Agent.isRightToLeft(context);
  var isVert = (this.Position == 'left' || this.Position == 'right');
  var scrollable = this.Options['zoomAndScroll'] != 'off';
  var first = true;

  //  : On Chrome, creating a gap value to be used for spacing level1 labels and level2 labels
  var levelsGap = 0;
  if (isVert && dvt.Agent.isBrowserChrome()) {
    levelsGap = this.getTickLabelHeight() * 0.16;
  }

  // Find the time positions where labels are located
  var times = [];
  if (this._step != null) {
    times = dvt.TimeAxisInfo._getLabelPositions(this.MinValue, this.MaxValue, this._step);
  }
  else if (this._mixedFrequency) {
    this._step = this._getMixedFrequencyStep();
    times = dvt.TimeAxisInfo._getLabelPositions(this.MinValue, this.MaxValue, this._step);
  }
  else {
    for (var i = 0; i < this._groups.length; i++) {
      if (this._groups[i] >= this.MinValue && this._groups[i] <= this.MaxValue)
        times.push(this._groups[i]);
    }
    this._step = this._averageInterval;

    if (!this._skipGaps) {
      // Check the width of the first level1 label. If we expect that we'll have more group labels than we can fit in the
      // available space, then render the time labels at a regular interval (using mixed freq algorithm).
      var firstLabel = new dvt.OutputText(context, this._formatAxisLabel(new Date(times[0]))[0], 0, 0);
      var labelWidth = isVert ? dvt.TextUtils.guessTextDimensions(firstLabel).h : firstLabel.measureDimensions().w;
      var totalWidth = (labelWidth + this.GetTickLabelGapSize()) * (times.length - 1);
      var availWidth = Math.abs(this._endCoord - this._startCoord);
      if (totalWidth > availWidth) {
        this._step = this._getMixedFrequencyStep();
        times = dvt.TimeAxisInfo._getLabelPositions(this.MinValue, this.MaxValue, this._step);
      }
    }
  }

  if (times.length == 0)
    times = [this.MinValue]; // render at least one label

  // Create and format the labels
  for (var i = 0; i < times.length; i++) {
    var time = times[i];
    var coord = this.getCoordAt(time);
    if (coord == null)
      continue;

    var date = new Date(time);
    var twoLabels = this._formatAxisLabel(date, prevDate);

    var label1 = twoLabels[0];
    var label2 = twoLabels[1];
    //level 1 label
    if (label1 != null) {
      // If level 2 exists put a levelsGap space between labels. levelsGap is only non-zero on Chrome.
      labelInfos1.push({text: label1, coord: (label2 != null ? coord + levelsGap : coord)});
      coords1.push(coord);
      c1++;
    }
    else {
      labelInfos1.push(null);
      coords1.push(null);
    }
    // Defer label1 creation for now for performance optimization.
    // Only the labels we expect not to skip will be created in skipLabelsUniform().
    labels1.push(null);

    // Make sure that the position of first level2 label is constant if the chart is scrollable to prevent jumping around
    if (scrollable && first)
      coord = this.MinValue ? this.getCoordAt(this.MinValue) : coord;
    first = false;

    //level 2 label
    if (label2 != null) {
      var text = this.CreateLabel(context, label2, label2 != null ? coord - levelsGap : coord);
      coords2.push(coord);
      if (!isVert) //set alignment now in order to determine if the labels will overlap
        isRTL ? text.alignRight() : text.alignLeft();
      labels2.push(text);
      this._isOneLevel = false;
      c2++;
    }
    else {
      labels2.push(null);
      coords2.push(null);
    }

    prevDate = date;
  }

  // skip level 1 labels every uniform interval
  c1 = this._skipLabelsUniform(labelInfos1, labels1, container, false, isRTL);

  if (!scrollable && c2 > 1 && c1 < 1.5 * c2) {
    // too few level 1 labels
    labels1 = labels2;
    labels2 = null;
    // center align the new level1 labels
    for (var j = 0; j < labels1.length; j++) {
      if (labels1[j] != null)
        labels1[j].alignCenter();
    }
    c1 = this._skipLabelsGreedy(labels1, this.GetLabelDims(labels1, container), false, isRTL);
  }
  else {
    // skip level 2 labels greedily
    c2 = this._skipLabelsGreedy(labels2, this.GetLabelDims(labels2, container), true, isRTL);
    if (c2 == 0)
      labels2 = null; // null it so DvtAxisRenderer.getPreferredSize won't allocate space for it
  }

  if (isVert && labels2 != null)
    this._skipVertLabels(labels1, labels2, container);

  this._level1Labels = labels1;
  this._level2Labels = labels2;

  // Store coordinates of labels for gridline rendering
  this._level1Coords = coords1;
  this._level2Coords = coords2;
};


/**
 * Determines if rectangle A (bounded by pointA1 and pointA2) and rectangle B (bounded by pointB1 and B2) overlap.
 * All the points should lie in one dimension.
 * @param {Number} pointA1
 * @param {Number} pointA2
 * @param {Number} pointB1
 * @param {Number} pointB2
 * @param {Number} gap The minimum gap between the two rectangles
 * @return {Boolean} whether rectangle A and B overlap
 * @private
 */
dvt.TimeAxisInfo._isOverlapping = function(pointA1, pointA2, pointB1, pointB2, gap) {
  if (pointB1 >= pointA1 && pointB1 - gap < pointA2)
    return true;
  else if (pointB1 < pointA1 && pointB2 + gap > pointA1)
    return true;
  return false;
};

/**
 * Returns how much a label overflows outside of rendering bounds.
 * @param {Number} coord The current coordinate of a label
 * @param {Number} labelLength The length of a label
 * @param {boolean} isStartAligned Whether or not the labels are text-anchored start, assumes center alignment if false.
 * @param {boolean} isRTL Whether or not the context is right to left.
 * @return {Number} The label overflow
 * @private
 */
dvt.TimeAxisInfo.prototype._getLabelOverflow = function(coord, labelLength, isStartAligned, isRTL) {
  var minOverflow = coord - (isStartAligned ? (isRTL ? labelLength : 0) : labelLength * 0.5);
  if (minOverflow < this.Options['_minOverflowCoord']) // Negative overflow : Label overflows the beginning of the axis
    return Math.floor(minOverflow - this.Options['_minOverflowCoord']);

  var maxOverflow = coord + (isStartAligned ? (isRTL ? 0 : labelLength) : labelLength * 0.5);
  if (maxOverflow > this.Options['_maxOverflowCoord']) // Negative overflow : Label overflows the beginning of the axis
    return Math.ceil(maxOverflow - this.Options['_maxOverflowCoord']);

  return 0; // No overflow
};

/**
 * Skip labels greedily. Delete all labels that overlap with the last rendered label.
 * @param {Array} labels An array of DvtText labels for the axis. This array will be modified by the method.
 * @param {Array} labelDims An array of dvt.Rectangle objects that describe the x, y, height, width of the axis labels.
 * @param {boolean} isStartAligned Whether or not the labels are text-anchored start, assumes center alignment if false.
 * @param {boolean} isRTL Whether or not the context is right to left.
 * @return {Number} The number of remaining labels after skipping.
 * @private
 */
dvt.TimeAxisInfo.prototype._skipLabelsGreedy = function(labels, labelDims, isStartAligned, isRTL) {
  // If there are no labels, return
  if (!labelDims || labelDims.length <= 0)
    return false;

  var isVert = (this.Position == 'left' || this.Position == 'right');
  var labelHeight = this.getTickLabelHeight();
  var gap = isVert ? labelHeight * 0.08 : labelHeight * 0.24;

  var count = 0;// the number of non-null labels
  var pointA1, pointA2, pointB1, pointB2;


  // Check for potential overflow
  var label;
  var availWidth = Math.abs(this._endCoord - this._startCoord);  // The available width for the axis
  for (var j = 0; j < labelDims.length; j++) {
    this._level2Overflow.push(0);
    if (labels[j] != null) {
      label = labels[j];
      var labelLength = dvt.TextUtils.getTextWidth(label);

      if (labelDims[j].w > availWidth)
        labels[j] = null;
      else {
        var overflow = this._getLabelOverflow(label.getX(), labelLength, isStartAligned, isRTL);
        this._level2Overflow[j] = overflow;
        if (overflow != 0) {
          label.setX(label.getX() - overflow); // move label
          labelDims[j].x -= overflow; // adjust recorded dims so skipping takes into account new label position
        }
      }
    }
  }

  for (j = 0; j < labelDims.length; j++) {
    if (labelDims[j] == null)
      continue;

    if (isVert) {
      pointB1 = labelDims[j].y;
      pointB2 = labelDims[j].y + labelDims[j].h;
    }
    else {
      pointB1 = labelDims[j].x;
      pointB2 = labelDims[j].x + labelDims[j].w;
    }

    if (pointA1 != null && pointA2 != null && dvt.TimeAxisInfo._isOverlapping(pointA1, pointA2, pointB1, pointB2, gap))
      labels[j] = null;

    if (labels[j] != null) {
      // start evaluating from label j
      pointA1 = pointB1;
      pointA2 = pointB2;
      count++;
    }
  }

  return count;
};


/**
 * Skip labels uniformly (every regular interval).
 * @param {array} labelInfos An array of object containing text (the label text string) and coord (the label coordinate).
 * @param {array} labels An array of dvt.OutputText labels for the axis (initially empty). This array will be populated by the method.
 * @param {dvt.Container} container The label container.
 * @param {boolean} isRTL Whether or not the context is right to left.
 * @return {number} The number of remaining labels after skipping.
 * @private
 */
dvt.TimeAxisInfo.prototype._skipLabelsUniform = function(labelInfos, labels, container, isRTL) {
  var rLabelInfos = []; // contains rendered labels only
  var rLabelDims = [];

  // The available width for the axis
  var availWidth = Math.abs(this._endCoord - this._startCoord);

  for (var j = 0; j < labelInfos.length; j++) {
    if (labelInfos[j] != null) {
      rLabelInfos.push(labelInfos[j]);
      rLabelDims.push(null);
      this._level1Overflow.push(0);
    }
  }

  // Method that returns the label size. If the label object doesn't exist yet, it will create it and measure the
  // dimensions. Otherwise, it simply returns the stored dimensions.
  var isVert = this.Position == 'left' || this.Position == 'right';
  var _this = this;
  var getDim = function(i) {
    if (rLabelDims[i] == null) {
      rLabelInfos[i].label = _this.CreateLabel(container.getCtx(), rLabelInfos[i].text, rLabelInfos[i].coord);
      rLabelDims[i] = rLabelInfos[i].label.measureDimensions(container);

      if (rLabelDims[i].w > availWidth) {
        rLabelInfos[i].label = null;
        rLabelDims[i].w = 0;
        rLabelDims[i].h = 0;
      }
      else {
        var overflow = _this._getLabelOverflow(rLabelInfos[i].coord, rLabelDims[i].w, false, isRTL);
        if (overflow != 0) {
          rLabelInfos[i].coord -= overflow;
          rLabelDims[i].x -= overflow; // adjust recorded dims so skipping takes into account new label position
          rLabelInfos[i].label.setX(rLabelInfos[i].label.getX() - overflow);
          _this._level1Overflow[i] = overflow;
        }
      }

    }
    return isVert ? rLabelDims[i].h : rLabelDims[i].w;
  };


  // Estimate the minimum amount of skipping by dividing the total label width (estimated) by the
  // available axis width.
  var totalWidth = (getDim(0) + this.GetTickLabelGapSize()) * (rLabelInfos.length - 1);
  var skip = availWidth > 0 ? (Math.ceil(totalWidth / availWidth) - 1) : 0;

  // Iterate to find the minimum amount of skipping
  var bOverlaps = true;
  while (bOverlaps) {
    for (var j = 0; j < rLabelInfos.length; j++) {
      if (j % (skip + 1) == 0) {
        getDim(j); // create the label and obtain the dim
        rLabelInfos[j].skipped = false;
      }
      else
        rLabelInfos[j].skipped = true;
    }
    bOverlaps = this.IsOverlapping(rLabelDims, skip);
    skip++;
  }

  // Populate the labels array with non-skipped labels
  var count = 0; // # of rendered labels
  for (var j = 0; j < labelInfos.length; j++) {
    if (labelInfos[j] != null && !labelInfos[j].skipped) {
      labels[j] = labelInfos[j].label;
      count++;
    }
  }
  return count;
};


/**
 * Format the alignments of the vertical axis labels and skip them accordingly so that level1 and level2 don't overlap.
 * @param {Array} labels1 An array of level 1 DvtText labels for the axis. This array will be modified by the method.
 * @param {Array} labels2 An array of level 2 DvtText labels for the axis. This array will be modified by the method.
 * @param {dvt.Container} container
 * @private
 */
dvt.TimeAxisInfo.prototype._skipVertLabels = function(labels1, labels2, container) {
  var gap = this.getTickLabelHeight() * 0.08;

  // returns if two rectangles (dimsA and dimsB) overlap vertically
  var isOverlapping = function(dimsA, dimsB) {
    return dvt.TimeAxisInfo._isOverlapping(dimsA.y, dimsA.y + dimsA.h, dimsB.y, dimsB.y + dimsB.h, gap);
  };

  var lastDims = null;
  var overlapping = false;

  // attempt to render both level 1 and level 2 and see if they fit on the axis
  for (var i = 0; i < labels1.length; i++) {
    if (labels1[i] && labels2[i]) {
      labels1[i].alignTop();
      labels2[i].alignBottom();
      if (lastDims && isOverlapping(lastDims, labels2[i].measureDimensions())) {
        overlapping = true;
        break;
      }
      lastDims = labels1[i].measureDimensions();
    }
    else if (labels1[i] || labels2[i]) {
      var label = labels1[i] ? labels1[i] : labels2[i];
      if (lastDims && isOverlapping(lastDims, label.measureDimensions())) {
        overlapping = true;
        break;
      }
      lastDims = label.measureDimensions();
    }
  }

  if (!overlapping)
    return;// if both levels fit, we're done
  var lastLv1Idx = null;
  var lastLv1Dims = null;
  var lastLv2Dims = null;
  var dims;

  // if they don't fit:
  // - for points that have level 2 labels, don't generate the level 1 (one level nesting)
  // - skip all level 1 labels that overlaps with level 2 labels
  for (i = 0; i < labels1.length; i++) {
    if (labels2[i]) {
      // if level 2 exists
      labels1[i] = null;// delete level 1
      labels2[i].alignMiddle();
      dims = labels2[i].measureDimensions();
      if (lastLv1Dims && isOverlapping(lastLv1Dims, dims)) {
        labels1[lastLv1Idx] = null;
      }
      lastLv2Dims = dims;
    }
    else if (labels1[i]) {
      // if level 1 exists but not level 2
      dims = labels1[i].measureDimensions();
      if (lastLv2Dims && isOverlapping(lastLv2Dims, dims)) {
        labels1[i] = null;
      }
      else {
        lastLv1Dims = dims;
        lastLv1Idx = i;
      }
    }
  }
};


/**
 * @override
 */
dvt.TimeAxisInfo.prototype.getLabels = function(context, levelIdx) {
  if (levelIdx && levelIdx > 1)// time axis has no more than two levels
    return null;

  if (!this._level1Labels)
    this._generateLabels(context);

  if (levelIdx == 1) {
    return this._level2Labels;
  }

  return this._level1Labels;
};


/**
 * @override
 */
dvt.TimeAxisInfo.prototype.getMajorTickCoords = function() {
  var coords = [];
  if (this._isOneLevel) { // only one level, level1 is majorTick
    for (var i = 0; i < this._level1Coords.length; i++) {
      if (this._level1Coords[i] != null && this._level1Labels[i] != null)
        coords.push(this._level1Coords[i]);
    }
  }
  else { // level1 is minorTick, level2 is majorTick
    // don't draw majorTick for the first level2 label bc it's not the beginning of period
    for (var i = 1; i < this._level2Coords.length; i++) {
      if (this._level2Coords[i] != null)
        coords.push(this._level2Coords[i]); // render gridline even if label is skipped
    }
  }

  return coords;
};


/**
 * @override
 */
dvt.TimeAxisInfo.prototype.getMinorTickCoords = function() {
  if (this._isOneLevel) // minorTick only applies on timeAxis if there is more than one level
    return [];

  var coords = [];
  for (var i = 0; i < this._level1Coords.length; i++) {
    if (this._level1Coords[i] != null && this._level1Labels[i] != null)
      coords.push(this._level1Coords[i]);
  }

  return coords;
};


/**
 * @override
 */
dvt.TimeAxisInfo.prototype.getUnboundedValueAt = function(coord) {
  if (coord == null)
    return null;

  var ratio = (coord - this._startCoord) / (this._endCoord - this._startCoord);

  if (this._skipGaps) {
    var minVal = this._timeToIndex(this.MinValue);
    var maxVal = this._timeToIndex(this.MaxValue);
    return this._indexToTime(minVal + ratio * (maxVal - minVal));
  }
  else
    return this.MinValue + ratio * (this.MaxValue - this.MinValue);
};


/**
 * @override
 */
dvt.TimeAxisInfo.prototype.getUnboundedCoordAt = function(value) {
  if (value == null)
    return null;

  var ratio;
  if (this._skipGaps) {
    var minVal = this._timeToIndex(this.MinValue);
    var maxVal = this._timeToIndex(this.MaxValue);
    var val = this._timeToIndex(value);
    ratio = (val - minVal) / (maxVal - minVal);
  }
  else
    ratio = (value - this.MinValue) / (this.MaxValue - this.MinValue);

  return this._startCoord + ratio * (this._endCoord - this._startCoord);
};


/**
 * @override
 */
dvt.TimeAxisInfo.prototype.linearToActual = function(value) {
  if (value == null)
    return null;
  return this._skipGaps ? this._indexToTime(value) : value;
};

/**
 * @override
 */
dvt.TimeAxisInfo.prototype.actualToLinear = function(value) {
  if (value == null)
    return null;
  return this._skipGaps ? this._timeToIndex(value) : value;
};


/**
 * Converts time to group index for regular time axis.
 * @param {number} time
 * @return {number} index
 * @private
 */
dvt.TimeAxisInfo.prototype._timeToIndex = function(time) {
  var endIndex = this._groups.length;
  for (var i = 0; i < this._groups.length; i++) {
    if (time <= this._groups[i]) {
      endIndex = i;
      break;
    }
  }
  var startIndex = endIndex - 1;

  var startTime = this._groups[startIndex] !== undefined ? this._groups[startIndex] : this._groups[0] - this._averageInterval;
  var endTime = this._groups[endIndex] !== undefined ? this._groups[endIndex] : this._groups[this._groups.length - 1] + this._averageInterval;

  return startIndex + (time - startTime) / (endTime - startTime);
};


/**
 * Converts group index to time for regular time axis.
 * @param {number} index
 * @return {number} time
 * @private
 */
dvt.TimeAxisInfo.prototype._indexToTime = function(index) {
  var endIndex = Math.min(Math.max(Math.ceil(index), 0), this._groups.length);
  var startIndex = endIndex - 1;

  var startTime = this._groups[startIndex] !== undefined ? this._groups[startIndex] : this._groups[0] - this._averageInterval;
  var endTime = this._groups[endIndex] !== undefined ? this._groups[endIndex] : this._groups[this._groups.length - 1] + this._averageInterval;

  return startTime + (index - startIndex) * (endTime - startTime);
};


/**
 * @override
 */
dvt.TimeAxisInfo.prototype.getGroupWidth = function() {
  if (this._skipGaps)
    return Math.abs(this.getUnboundedCoordAt(this._indexToTime(1)) - this.getUnboundedCoordAt(this._indexToTime(0)));
  else
    return Math.abs(this.getUnboundedCoordAt(this.MinValue + this._averageInterval) - this.getUnboundedCoordAt(this.MinValue));
};


/**
 * @override
 */
dvt.TimeAxisInfo.prototype.getMinimumExtent = function() {
  return this._skipGaps ? 1 : this._mixedFrequency ? Math.min(this._timeRange / 8, this._averageInterval) : this._averageInterval;
};


/**
 * @override
 */
dvt.TimeAxisInfo.prototype.getStartOverflow = function() {
  if ((this.Position == 'top' || this.Position == 'bottom') && dvt.Agent.isRightToLeft(this.getCtx()))
    return this.EndOverflow;
  else
    return this.StartOverflow;
};


/**
 * @override
 */
dvt.TimeAxisInfo.prototype.getEndOverflow = function() {
  if ((this.Position == 'top' || this.Position == 'bottom') && dvt.Agent.isRightToLeft(this.getCtx()))
    return this.StartOverflow;
  else
    return this.EndOverflow;
};
})(dvt);

  return dvt;
});
