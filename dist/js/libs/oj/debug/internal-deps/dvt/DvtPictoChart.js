/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

  // Map the D namespace to dvt, which is used to provide access across partitions.
  var D = dvt;
  
/**
 * PictoChart component.  The component should never be instantiated directly.  Use the newInstance function instead
 * @param {DvtContext} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @class
 * @constructor
 * @export
 */
var DvtPictoChart = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

DvtObj.createSubclass(DvtPictoChart, DvtBaseComponent, 'DvtPictoChart');

/**
 * Returns a new instance of DvtPictoChart.
 * @param {DvtContext} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @return {DvtPictoChart}
 * @export
 */
DvtPictoChart.newInstance = function(context, callback, callbackObj) {
  return new DvtPictoChart(context, callback, callbackObj);
};

/**
 * Initializes the component.
 * @param {DvtContext} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @protected
 */
DvtPictoChart.prototype.Init = function(context, callback, callbackObj) {
  DvtPictoChart.superclass.Init.call(this, context, callback, callbackObj);

  // Create the event handler and add event listeners
  this.EventManager = new DvtPictoChartEventManager(this);
  this.EventManager.addListeners(this);

  // Set up keyboard handler on non-touch devices
  if (!DvtAgent.isTouchDevice())
    this.EventManager.setKeyboardHandler(new DvtPictoChartKeyboardHandler(this.EventManager));

  // Create the defaults object
  this.Defaults = new DvtPictoChartDefaults();

  // Create array of logical objects for pictoChart items
  this._items = [];
};

/**
 * Calculates the preferred dimensions for this pictoChart.
 * @param {Number=} width The component width, if defined.
 * @param {Number=} height The component height, if defined.
 * @return {DvtDimension} The preferred dimensions.
 * @private
 */
DvtPictoChart.prototype._getPreferredSize = function(width, height) {
  // Calculate the preferred width or height if not defined
  if (!width || !height) {
    var info = DvtPictoChartRenderer.getInfo(this, width, height);
    this._info = info; // store for use in render()

    if (!width)
      width = info.items ? info.colCount * info.colWidth : 0;
    if (!height)
      height = info.items ? info.rowCount * info.rowHeight : 0;
  }

  return new DvtDimension(width, height);
};

/**
 * @override
 * @export
 */
DvtPictoChart.prototype.render = function(options, width, height) {
  // IMPORTANT: If width and height are passed, then flowing layout would be disabled.

  // Keep old references for animation
  this._oldContainer = this._container;
  var oldMarkers = this._markers;
  var oldWidth = this.Width ? this.Width : 0;
  var oldHeight = this.Height ? this.Height : 0;

  // Clean up
  this.EventManager.hideTooltip();
  this._items = [];
  this._markers = [];
  this._info = null;
  if (this._emptyText) {
    this._container.removeChild(this._emptyText);
    this._emptyText = null;
  }
  if (this._animation) {
    this._animationStopped = true;
    this._animation.stop();
  }

  // Update if a new options object has been provided or initialize with defaults if needed
  this.SetOptions(options);
  var context = this.getCtx();

  if (!width && !height) {
    // Set display=block to the SVG to enable flowing layout (removing extra gap in the outer div)
    context.getSvgDocument().style.display = 'block';

    // Determine whether the layout is fixed or flowing.
    // To find out, set the preferred dims on the SVG, and see if the outerDiv dims follow the SVG dims.
    var preferredSize = this._getPreferredSize();
    DvtToolkitUtils.setSvgSize(context, preferredSize.w, preferredSize.h);
    var outerDivSize = DvtToolkitUtils.getOuterDivSize(context);

    if (preferredSize.w == outerDivSize.w && preferredSize.h != outerDivSize.h) {
      // Height is fixed, but width is probably flowing.
      // Relayout with fixed height to find the preferred width.
      this.Height = outerDivSize.h;
      preferredSize = this._getPreferredSize(null, this.Height);
      DvtToolkitUtils.setSvgSize(context, preferredSize.w, this.Height);
      this.Width = DvtToolkitUtils.getOuterDivSize(context).w;
    }
    else if (preferredSize.w != outerDivSize.w && preferredSize.h == outerDivSize.h) {
      // Width is fixed, but height is probably flowing.
      // Relayout with fixed width to find the preferred height.
      this.Width = outerDivSize.w;
      preferredSize = this._getPreferredSize(this.Width, null);
      DvtToolkitUtils.setSvgSize(context, this.Width, preferredSize.h);
      this.Height = DvtToolkitUtils.getOuterDivSize(context).h;
    }
    else {
      // The width and height are either both fixed or both flowing.
      // In either case, we can render at the outerDivSize because:
      // - if both width and height are flowing, the outerDivSize matches the preferredSize,
      // - if both width and height are fixed, we're forced to render at the outerDivSize.
      this.Width = outerDivSize.w;
      this.Height = outerDivSize.h;
    }

    // If the width/height doesn't match the last computed preferredSize, the info has to be recomputed
    if (this.Width != preferredSize.w || this.Height != preferredSize.h)
      this._info = null;
  }
  else {
    // If width and height are passed, flowing layout is disabled.
    // Use this mode for unit tests and ADF printable pages.
    this.Width = width;
    this.Height = height;
  }

  // Render the component
  this._container = new DvtContainer(context);
  this.addChild(this._container);
  DvtPictoChartRenderer.render(this, this._container, new DvtRectangle(0, 0, this.Width, this.Height), this._info);

  // Construct the new animation playable
  if (!this._oldContainer) {
    this._animation = this._getAnimationOnDisplay();
  }
  else if (this.Options['animationOnDataChange'] != 'none' && options) {
    // Treat layout changes as data change animations and animate to new positions
    var animHandler = new DvtDataAnimationHandler(context, null);
    animHandler.constructAnimation(oldMarkers, this._markers);
    this._animation = animHandler.getAnimation();
  }

  // If an animation was created, play it
  if (this._animation) {
    // Temporarily set the SVG size to max(oldSize, newSize) to ensure that the animation isn't truncated
    DvtToolkitUtils.setSvgSize(context, Math.max(oldWidth, this.Width), Math.max(oldHeight, this.Height));

    // Remove event listeners and empty text temporarily
    this.EventManager.removeListeners(this);
    if (this._emptyText)
      this._container.removeChild(this._emptyText);

    this._animation.setOnEnd(this._onRenderEnd, this);
    this._animation.play();
  }
  else
    this._onRenderEnd();
};

/**
 * @override
 */
DvtPictoChart.prototype.SetOptions = function(options) {
  if (options) {
    // Combine the user options with the defaults and store
    this.Options = this.Defaults.calcOptions(options);
  }
  else if (!this.Options)
    this.Options = this.GetDefaults();

  // Disable animation for png
  if (!DvtAgent.isEnvironmentBrowser()) {
    this.Options['animationOnDisplay'] = 'none';
    this.Options['animationOnDataChange'] = 'none';
  }

  // Initialize the selection handler
  var selectionMode = this.Options['selectionMode'];
  if (selectionMode == 'single')
    this._selectionHandler = new DvtSelectionHandler(DvtSelectionHandler.TYPE_SINGLE);
  else if (selectionMode == 'multiple')
    this._selectionHandler = new DvtSelectionHandler(DvtSelectionHandler.TYPE_MULTIPLE);
  else
    this._selectionHandler = null;

  // Pass to event manager
  this.EventManager.setSelectionHandler(this._selectionHandler);
};

/**
 * Cleaning and processing at the end of the render call.
 * @private
 */
DvtPictoChart.prototype._onRenderEnd = function() {
  // Clean up the old container used by black box updates
  if (this._oldContainer) {
    this.removeChild(this._oldContainer);
    this._oldContainer.destroy();
    this._oldContainer = null;
  }

  if (this._animation) {
    this._animation = null;

    // Restore event listeners and empty text
    this.EventManager.addListeners(this);
    if (this._emptyText)
      this._container.addChild(this._emptyText);
  }

  // Set the preferred size on the SVG element
  DvtToolkitUtils.setSvgSize(this.getCtx(), this.Width, this.Height);

  // Set the initial keyboard focus
  this.EventManager.setFocusObj(this._items[0]);

  // Set initial selection
  if (this._selectionHandler)
    this._selectionHandler.processInitialSelections(this.Options['selection'], this._items);

  // Set initial highlighting
  DvtCategoryRolloverHandler.highlight(this.Options['highlightedCategories'], this._items, this.Options['highlightMatch'] == 'any');

  this.UpdateAriaAttributes();

  if (!this._animationStopped)
    this.RenderComplete();
  this._animationStopped = null;
};

/**
 * @return {DvtPictoChartEventManager}
 */
DvtPictoChart.prototype.getEventManager = function() {
  return this.EventManager;
};

/**
 * Registers the pictoChart items. The items must be registered to participate in interactivity.
 * @param {array} items Array of DvtPictoChartItem.
 */
DvtPictoChart.prototype.registerItems = function(items) {
  this._items = items;
};

/**
 * Returns the pictoChart items.
 * @return {array} Array of DvtPictoChartItem.
 */
DvtPictoChart.prototype.getItems = function() {
  return this._items;
};

/**
 * Registers the marker with the component. The marker must be registered to participate in animation.
 * @param {DvtPictoChartShapeMarker|DvtPictoChartImageMarker} marker
 */
DvtPictoChart.prototype.registerMarker = function(marker) {
  this._markers.push(marker);
};

/**
 * Registers the "no data" text.
 * @param {DvtOutputText} text
 */
DvtPictoChart.prototype.registerEmptyText = function(text) {
  this._emptyText = text;
};

/**
 * Returns the total count of the all items.
 * @return {number}
 */
DvtPictoChart.prototype.getTotalCount = function() {
  var count = 0;
  for (var i = 0; i < this._items.length; i++) {
    count += this._items[i].getCount();
  }
  return count;
};

/**
 * Returns the animation duration.
 * @return {number}
 */
DvtPictoChart.prototype.getAnimationDuration = function() {
  return DvtStyleUtils.getTimeMilliseconds(this.Options['animationDuration']) / 1000;
};

/**
 * Returns the animation on display.
 * @return {DvtPlayable}
 * @private
 */
DvtPictoChart.prototype._getAnimationOnDisplay = function() {
  var animOnDisplay = this.Options['animationOnDisplay'];
  var duration = this.getAnimationDuration();
  var context = this.getCtx();
  var bounds = new DvtRectangle(0, 0, this.Width, this.Height);

  if (DvtBlackBoxAnimationHandler.isSupported(animOnDisplay))
    return DvtBlackBoxAnimationHandler.getInAnimation(context, animOnDisplay, this._container, bounds, duration);

  var playables = [];
  if (animOnDisplay == 'popIn') {
    for (var i = 0; i < this._markers.length; i++) {
      var marker = this._markers[i];
      playables.push(new DvtAnimPopIn(context, marker, true, duration));
    }
  }
  else if (animOnDisplay != 'none') {
    // Grow animation
    for (var i = 0; i < this._markers.length; i++) {
      var marker = this._markers[i];
      var playable = new DvtCustomAnimation(context, marker, duration);
      var startState, endState;

      if (DvtPictoChartRenderer.isVertical(this)) {
        startState = DvtPictoChartRenderer.isOriginRight(this) ? this.Width : 0;
        endState = marker.getCx();
        marker.setCx(startState);
        playable.getAnimator().addProp(DvtAnimator.TYPE_NUMBER, marker, marker.getCx, marker.setCx, endState);
      }
      else {
        startState = DvtPictoChartRenderer.isOriginBottom(this) ? this.Height : 0;
        endState = marker.getCy();
        marker.setCy(startState);
        playable.getAnimator().addProp(DvtAnimator.TYPE_NUMBER, marker, marker.getCy, marker.setCy, endState);
      }
      playables.push(playable);
    }
    // Add fade in to hide the ugly overlaps at the beginning
    playables.push(DvtBlackBoxAnimationHandler.getInAnimation(context, DvtBlackBoxAnimationHandler.ALPHA_FADE, this._container, bounds, duration));
  }

  if (playables.length > 0)
    return new DvtParallelPlayable(context, playables);
  else
    return null;
};

/**
 * @override
 * @export
 */
DvtPictoChart.prototype.destroy = function() {
  if (this.EventManager) {
    this.EventManager.removeListeners(this);
    this.EventManager.destroy();
    this.EventManager = null;
  }

  // Call super last during destroy
  DvtPictoChart.superclass.destroy.call(this);
};

/**
 * @override
 * @export
 */
DvtPictoChart.prototype.highlight = function(categories) {
  // Update the options
  var options = this.getOptions();
  options['highlightedCategories'] = DvtJSONUtils.clone(categories);

  // Perform the highlighting and propagate to children
  DvtCategoryRolloverHandler.highlight(categories, this.getItems(), options['highlightMatch'] == 'any');
};

/**
 * @override
 * @export
 */
DvtPictoChart.prototype.select = function(selection) {
  // Update the options
  var options = this.getOptions();
  options['selection'] = DvtJSONUtils.clone(selection);

  // Perform the selection
  if (this._selectionHandler)
    this._selectionHandler.processInitialSelections(selection, this.getItems());
};

/**
 * @override
 */
DvtPictoChart.prototype.GetComponentDescription = function() {
  return DvtBundle.getTranslation(this.getOptions(), 'componentName', DvtBundle.UTIL_PREFIX, 'PICTOCHART');
};

/**
 * Returns the automation object for this component.
 * @return {DvtPictoChartAutomation} The automation object.
 * @export
 */
DvtPictoChart.prototype.getAutomation = function() {
  if (!this._automation)
    this._automation = new DvtPictoChartAutomation(this);
  return this._automation;
};
/**
 * Provides automation services for DvtPictoChart.
 * @class  DvtPictoChartAutomation
 * @param {DvtPictoChart} picto
 * @implements {DvtAutomation}
 * @constructor
 * @export
 */
var DvtPictoChartAutomation = function(picto) {
  this._picto = picto;
};

DvtObj.createSubclass(DvtPictoChartAutomation, DvtAutomation, 'DvtPictoChartAutomation');

/**
 * Valid subIds inlcude:
 * <ul>
 * <li>item[index]</li>
 * <li>tooltip</li>
 * </ul>
 * @override
 */
DvtPictoChartAutomation.prototype.GetSubIdForDomElement = function(displayable) {
  var logicalObj = this._picto.getEventManager().GetLogicalObject(displayable);
  if (logicalObj && (logicalObj instanceof DvtPictoChartItem)) {
    var index = this._picto.getItems().indexOf(logicalObj);
    return 'item[' + index + ']';
  }
  return null;
};

/**
 * Valid subIds inlcude:
 * <ul>
 * <li>item[index]</li>
 * <li>tooltip</li>
 * </ul>
 * @override
 * @export
 */
DvtPictoChartAutomation.prototype.getDomElementForSubId = function(subId) {
  if (subId == DvtAutomation.TOOLTIP_SUBID)
    return this.GetTooltipElement(this._picto);

  var parenIdx = subId.indexOf('[');
  if (parenIdx > 0 && subId.substring(0, parenIdx) === 'item') {
    var index = parseInt(subId.substring(parenIdx + 1, subId.length - 1));
    var item = this._picto.getItems()[index];
    if (item)
      return item.getElem();
    else
      return null;
  }
  return null;
};

/**
 * Returns an object containing data for a pictoChart item. Used for verification.
 * Valid verification values inlcude:
 * <ul>
 * <li>color</li>
 * <li>tooltip</li>
 * <li>id</li>
 * <li>name</li>
 * <li>count</li>
 * <li>selected</li>
 * </ul>
 * @param {Number} index The index of the tag cloud item
 * @return {Object} An object containing data for the tag cloud item
 * @export
 */
DvtPictoChartAutomation.prototype.getItem = function(index) {
  var item = this._picto.getItems()[index];
  if (item) {
    var data = {};
    data['color'] = item.getDatatipColor();
    data['tooltip'] = item.getShortDesc();
    data['id'] = item.getId();
    data['name'] = item.getName();
    data['count'] = item.getCount();
    data['selected'] = item.isSelected();
    return data;
  }
  return null;
};

/**
 * Returns the number of items in the pictoChart
 * @return {Number}
 * @export
 */
DvtPictoChartAutomation.prototype.getItemCount = function() {
  return this._picto.getItems().length;
};
/**
 * Event Manager for pictoChart component.
 * @param {DvtPictoChart} picto
 * @constructor
 */
var DvtPictoChartEventManager = function(picto) {
  this.Init(picto.getCtx(), picto.dispatchEvent, picto);
  this._picto = picto;
};

DvtObj.createSubclass(DvtPictoChartEventManager, DvtEventManager, 'DvtPictoChartEventManager');

/**
 * @override
 */
DvtPictoChartEventManager.prototype.ProcessRolloverEvent = function(event, obj, bOver) {
  var options = this._picto.getOptions();
  if (options['hoverBehavior'] == 'none')
    return;

  // Compute the new highlighted categories and update the options
  var categories = obj.getCategories ? obj.getCategories() : [];
  options['highlightedCategories'] = bOver ? categories.slice() : null;

  // Fire the event to the rollover handler, who will fire to the component callback.
  var type = bOver ? DvtCategoryRolloverEvent.TYPE_OVER : DvtCategoryRolloverEvent.TYPE_OUT;
  var rolloverEvent = new DvtCategoryRolloverEvent(type, options['highlightedCategories']);
  var hoverBehaviorDelay = DvtStyleUtils.getTimeMilliseconds(options['hoverBehaviorDelay']);
  this.RolloverHandler.processEvent(rolloverEvent, this._picto.getItems(), hoverBehaviorDelay, options['highlightMatch'] == 'any');
};

/**
 * @override
 */
DvtPictoChartEventManager.prototype.OnClickInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;

  // Only drill if not selectable. If selectable, drill with double click.
  if (!(obj.isSelectable && obj.isSelectable()))
    this.processDrillEvent(obj);
};


/**
 * @override
 */
DvtPictoChartEventManager.prototype.OnDblClickInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;

  // Only double click to drill if selectable. Otherwise, drill with single click.
  if (obj.isSelectable && obj.isSelectable())
    this.processDrillEvent(obj);
};


/**
 * @override
 */
DvtPictoChartEventManager.prototype.HandleTouchHoverEndInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;

  // Only drill if not selectable. If selectable, drill using double click.
  if (!(obj.isSelectable && obj.isSelectable()))
    this.processDrillEvent(obj);
};

/**
 * @override
 */
DvtPictoChartEventManager.prototype.HandleTouchClickInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;

  // Only drill if not selectable. If selectable, drill using double click.
  if (!(obj.isSelectable && obj.isSelectable()))
    this.processDrillEvent(obj);
};

/**
 * @override
 */
DvtPictoChartEventManager.prototype.HandleTouchDblClickInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;

  // Only double click to drill if selectable. Otherwise, drill with single click.
  if (obj.isSelectable && obj.isSelectable()) {
    event.preventDefault();
    event.stopPropagation();
    this.processDrillEvent(obj);
  }
};

/**
 * Processes an drill on the specified object.
 * @param {DvtLogicalObject} obj The object that was clicked.
 */
DvtPictoChartEventManager.prototype.processDrillEvent = function(obj) {
  if (obj instanceof DvtPictoChartItem && obj.isDrillable())
    this.FireEvent(new DvtDrillEvent(obj.getId()));
};
/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {DvtBaseComponentDefaults}
 */
var DvtPictoChartDefaults = function() {
  this.Init({'alta': DvtPictoChartDefaults.VERSION_1});
};

DvtObj.createSubclass(DvtPictoChartDefaults, DvtBaseComponentDefaults, 'DvtPictoChartDefaults');

/**
 * Contains overrides for version 1.
 * @const
 */
DvtPictoChartDefaults.VERSION_1 = {
  'animationOnDisplay': 'none',
  'animationOnDataChange': 'none',
  'animationDuration' : 750,
  'drilling': 'off',
  'hiddenCategories': [],
  'highlightedCategories': [],
  'highlightMatch' : 'all',
  'hoverBehavior': 'none',
  'hoverBehaviorDelay' : 200,
  'layout': 'horizontal',
  'layoutOrigin': 'topStart',
  'selection': [],
  'selectionMode': 'none',

  '_defaultColor': '#a6acb1',
  '_defaultSize': 32,
  '_defaultShape': 'rectangle',
  '_gapRatio': 0.25,
  '_textStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #252525;"),
  '_statusMessageStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #252525;"),
  '_tooltipStyle': new DvtCSSStyle('border-collapse: separate; border-spacing: 1px'),
  '_tooltipLabelStyle': new DvtCSSStyle('color: #737373; padding: 0px 2px'),
  '_tooltipValueStyle': new DvtCSSStyle('color: #333333; padding: 0px 2px')
};
// Copyright (c) 2014, 2015, Oracle and/or its affiliates. All rights reserved.

/**
 * @param {DvtPictoChart} picto
 * @param {number} cx  The x position of the center of the marker.
 * @param {number} cy  The y position of the center of the marker.
 * @param {number} width  The width of the marker.
 * @param {number} height  The height of the marker.
 * @param {String} source Image URI for the default state.
 * @param {String} sourceSelected Image URI for the selected state.
 * @param {String} sourceHover Image URI for the hover state.
 * @param {String} sourceHoverSelected Image URI for the hover selected state.
 * @param {String} id The id of the marker.
 * @extends {DvtImageMarker}
 * @constructor
 */
var DvtPictoChartImageMarker = function(picto, cx, cy, width, height, source, sourceSelected, sourceHover, sourceHoverSelected, id) {
  DvtPictoChartImageMarker.superclass.Init.call(this, picto.getCtx(), cx, cy, width, height, source, sourceSelected, sourceHover, sourceHoverSelected, id);
  this._picto = picto;
};

DvtObj.createSubclass(DvtPictoChartImageMarker, DvtImageMarker, 'DvtPictoChartImageMarker');


//---------------------------------------------------------------------//
// Animation support: DvtDataAnimationHandler                          //
//---------------------------------------------------------------------//

/**
 * @override
 */
DvtPictoChartImageMarker.prototype.animateUpdate = function(handler, oldMarker) {
  var animation = new DvtCustomAnimation(this.getCtx(), this, this._picto.getAnimationDuration() * 0.75);
  var animator = animation.getAnimator();

  // Position and size animation
  var endParams = this._getAnimationParams();
  this._setAnimationParams(oldMarker._getAnimationParams());
  animator.addProp(DvtAnimator.TYPE_NUMBER_ARRAY, this, this._getAnimationParams, this._setAnimationParams, endParams);

  // Hide old item
  oldMarker.setAlpha(0);

  handler.add(animation, 1);
};

/**
 * @override
 */
DvtPictoChartImageMarker.prototype.animateDelete = function(handler) {
  handler.add(new DvtAnimFadeOut(this.getCtx(), this, this._picto.getAnimationDuration() * 0.5), 0);
};

/**
 * @override
 */
DvtPictoChartImageMarker.prototype.animateInsert = function(handler) {
  this.setAlpha(0);
  handler.add(new DvtAnimFadeIn(this.getCtx(), this, this._picto.getAnimationDuration() * 0.5), 2);
};

/**
 * Returns the animation params.
 * @return {Array}
 * @private
 */
DvtPictoChartImageMarker.prototype._getAnimationParams = function() {
  return [this.getCx(), this.getCy(), this.getWidth(), this.getHeight()];
};

/**
 * Sets the animation params.
 * @param {Array} params
 * @private
 */
DvtPictoChartImageMarker.prototype._setAnimationParams = function(params) {
  this.setCx(params[0]);
  this.setCy(params[1]);
  this.setWidth(params[2]);
  this.setHeight(params[3]);
};
// Copyright (c) 2008, 2015, Oracle and/or its affiliates. All rights reserved.
/**
 * PictoChartItem
 * @param {DvtPictoChart} picto
 * @param {object} item The option object of the pictoChart item
 * @class
 * @constructor
 * @implements {DvtCategoricalObject}
 * @implements {DvtLogicalObject}
 * @implements {DvtSelectable}
 * @implements {DvtTooltipSource}
 * @implements {DvtKeyboardNavigable}
 */
var DvtPictoChartItem = function(picto, item) {
  this.Init(picto, item);
};

DvtObj.createSubclass(DvtPictoChartItem, DvtContainer, 'DvtPictoChartItem');

/**
 * Counter for generating default id
 * @private
 */
DvtPictoChartItem._counter = 0;

/**
 * @param {DvtPictoChart} picto
 * @param {object} item The option object of the pictoChart item
 * @override
 */
DvtPictoChartItem.prototype.Init = function(picto, item) {
  DvtPictoChartItem.superclass.Init.call(this, picto.getCtx(), null, item['id']);

  this._picto = picto;
  this._item = item;

  this._id = (item['id'] != null) ? item['id'] : (item['name'] != null) ? item['name'] : '_defaultId' + DvtPictoChartItem._counter;
  DvtPictoChartItem._counter++;

  this._isSelected = false;
  this._isShowingKeyboardFocusEffect = false;
  this._keyboardTooltipLocation = new DvtPoint(0, 0);

  // Apply the selecting cursor if selectable or drillable
  if (this.isSelectable() || this.isDrillable())
    this.setCursor(DvtSelectionEffectUtils.getSelectingCursor());

  // Associate using the event manager
  picto.getEventManager().associate(this, this);
};

/**
 * Returns the column span of the item.
 * @return {number}
 */
DvtPictoChartItem.prototype.getColSpan = function() {
  var colSpan = this._item['columnSpan'];
  return (colSpan != null && colSpan >= 0) ? colSpan : 1;
};

/**
 * Returns the row span of the item.
 * @return {number}
 */
DvtPictoChartItem.prototype.getRowSpan = function() {
  var rowSpan = this._item['rowSpan'];
  return (rowSpan != null && rowSpan >= 0) ? rowSpan : 1;
};

/**
 * Returns the count of the item.
 * @return {number}
 */
DvtPictoChartItem.prototype.getCount = function() {
  var count = this._item['count'];
  return (count != null) ? Math.max(count, 0) : 1;
};

/**
 * Returns the shape of the item.
 * @return {string}
 */
DvtPictoChartItem.prototype.getShape = function() {
  return this._item['shape'] || this._picto.getOptions()['_defaultShape'];
};

/**
 * Returns the color of the item.
 * @return {string}
 */
DvtPictoChartItem.prototype.getColor = function() {
  return this._item['color'] || this._picto.getOptions()['_defaultColor'];
};

/**
 * Returns the border color of the item.
 * @return {string}
 */
DvtPictoChartItem.prototype.getBorderColor = function() {
  return this._item['borderColor'];
};

/**
 * Returns the border width of the item.
 * @return {number}
 */
DvtPictoChartItem.prototype.getBorderWidth = function() {
  return this._item['borderWidth'];
};

/**
 * Returns the URI of the default state.
 * @return {string}
 */
DvtPictoChartItem.prototype.getSource = function() {
  return this._item['source'];
};

/**
 * Returns the URI of the selected state.
 * @return {string}
 */
DvtPictoChartItem.prototype.getSourceSelected = function() {
  return this._item['sourceSelected'];
};

/**
 * Returns the URI of the hover state.
 * @return {string}
 */
DvtPictoChartItem.prototype.getSourceHover = function() {
  return this._item['sourceHover'];
};

/**
 * Returns the URI of the hover selected state.
 * @return {string}
 */
DvtPictoChartItem.prototype.getSourceHoverSelected = function() {
  return this._item['sourceHoverSelected'];
};

/**
 * Returns the name of the item.
 * @return {string}
 */
DvtPictoChartItem.prototype.getName = function() {
  return this._item['name'];
};

/**
 * Returns the id of the item.
 * @return {string}
 */
DvtPictoChartItem.prototype.getId = function() {
  return this._id;
};

/**
 * Returns the short description of the item.
 * @return {string}
 */
DvtPictoChartItem.prototype.getShortDesc = function() {
  return this._item['shortDesc'];
};

/**
 * Returns whether the item is drillable
 * @return {boolean}
 */
DvtPictoChartItem.prototype.isDrillable = function() {
  var drilling = this._item['drilling'];
  if (drilling && drilling != 'inherit')
    return drilling == 'on';
  else
    return this._picto.getOptions()['drilling'] == 'on';
};

/**
 * Returns whether the item is double clickable.
 * @return {boolean}
 */
DvtPictoChartItem.prototype.isDoubleClickable = function() {
  // : IE double clicking workaround in DvtEventManager.
  return this.isSelectable() && this.isDrillable();
};

/**
 * Updates the ARIA attributes. Must be called after all items have been registered with the component to ensure
 * that the accessibility string (total count) is correct.
 */
DvtPictoChartItem.prototype.updateAriaAttributes = function() {
  this.setAriaRole('img');
  this._updateAriaLabel();
};


//---------------------------------------------------------------------//
// Tooltip Support: DvtTooltipSource impl                              //
//---------------------------------------------------------------------//

/**
 * @override
 */
DvtPictoChartItem.prototype.getDatatip = function(target) {
  // Custom Tooltip via Function
  var options = this._picto.getOptions();
  var tooltipFunc = this._picto.getOptions()['tooltip'];
  if (tooltipFunc) {
    var tooltipManager = this._picto.getCtx().getTooltipManager();
    var dataContext = {
      'id': this.getId(),
      'name': this.getName(),
      'count': this.getCount(),
      'color': this.getColor()
    };
    return tooltipManager.getCustomTooltip(tooltipFunc, dataContext);
  }

  if (this.getShortDesc() != null)
    return this.getShortDesc();

  // Default Tooltip Support
  var nameTd = '';
  var name = this.getName();
  if (name)
    nameTd = DvtHtmlTooltipManager.createStartTag('td', options['_tooltipLabelStyle']) + name + '<\/td>';

  var isRTL = DvtAgent.isRightToLeft(this._picto.getCtx());
  options['_tooltipLabelStyle'].setStyle(DvtCSSStyle.TEXT_ALIGN, isRTL ? 'left' : 'right');
  options['_tooltipValueStyle'].setStyle(DvtCSSStyle.TEXT_ALIGN, isRTL ? 'right' : 'left');

  return DvtHtmlTooltipManager.createStartTag('table', options['_tooltipStyle']) + '<tr>' + nameTd +
      DvtHtmlTooltipManager.createStartTag('td', options['_tooltipValueStyle']) + this._getCountString() + '<\/td>' +
      '<\/tr><\/table>';
};

/**
 * @override
 */
DvtPictoChartItem.prototype.getDatatipColor = function() {
  return this.getColor();
};

/**
 * Returns the item count and total count tooltip string.
 * @return {string}
 * @private
 */
DvtPictoChartItem.prototype._getCountString = function() {
  return DvtBundle.getTranslation(this._picto.getOptions(), 'labelCountWithTotal', DvtBundle.UTIL_PREFIX, 'COUNT_WITH_TOTAL', [this.getCount(), this._picto.getTotalCount()]);
};


//---------------------------------------------------------------------//
// Selection Support: DvtSelectable impl                               //
//---------------------------------------------------------------------//

/**
 * @override
 */
DvtPictoChartItem.prototype.isSelectable = function() {
  return this._picto.getOptions()['selectionMode'] != 'none';
};

/**
 * @override
 */
DvtPictoChartItem.prototype.isSelected = function() {
  return this._isSelected;
};

/**
 * @override
 */
DvtPictoChartItem.prototype.setSelected = function(bSelected) {
  this._isSelected = bSelected;
  this._updateAriaLabel();

  for (var i = 0; i < this.getNumChildren(); i++) {
    var child = this.getChildAt(i);
    if (child instanceof DvtPictoChartShapeMarker || child instanceof DvtPictoChartImageMarker)
      child.setSelected(bSelected);
  }
};

/**
 * @override
 */
DvtPictoChartItem.prototype.showHoverEffect = function() {
  for (var i = 0; i < this.getNumChildren(); i++) {
    var child = this.getChildAt(i);
    if (child instanceof DvtPictoChartShapeMarker || child instanceof DvtPictoChartImageMarker)
      child.showHoverEffect();
  }
};

/**
 * @override
 */
DvtPictoChartItem.prototype.hideHoverEffect = function() {
  for (var i = 0; i < this.getNumChildren(); i++) {
    var child = this.getChildAt(i);
    if (child instanceof DvtPictoChartShapeMarker || child instanceof DvtPictoChartImageMarker)
      child.hideHoverEffect();
  }
};


//---------------------------------------------------------------------//
// Rollover and Hide/Show Support: DvtLogicalObject impl               //
//---------------------------------------------------------------------//

/**
 * @override
 */
DvtPictoChartItem.prototype.getDisplayables = function() {
  return [this];
};

/**
 * @override
 */
DvtPictoChartItem.prototype.getAriaLabel = function() {
  var states = [];
  var options = this._picto.getOptions();
  if (this.isSelectable())
    states.push(DvtBundle.getTranslation(options, this.isSelected() ? 'stateSelected' : 'stateUnselected', DvtBundle.UTIL_PREFIX, this.isSelected() ? 'STATE_SELECTED' : 'STATE_UNSELECTED'));
  if (this.isDrillable())
    states.push(DvtBundle.getTranslation(options, 'stateDrillable', DvtBundle.UTIL_PREFIX, 'STATE_DRILLABLE'));

  var shortDesc;
  var name = this.getName();
  if (this.getShortDesc() != null)
    shortDesc = this.getShortDesc();
  else if (name == null)
    shortDesc = this._getCountString();
  else
    shortDesc = DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'COLON_SEP_LIST', [name, this._getCountString()]);

  return DvtDisplayable.generateAriaLabel(shortDesc, states);
};

/**
 * Updates the aria-label as needed. On desktop, we can defer the aria creation, and the aria-label will be updated
 * when the activeElement is set.
 * @private
 */
DvtPictoChartItem.prototype._updateAriaLabel = function() {
  if (!DvtAgent.deferAriaCreation())
    this.setAriaProperty('label', this.getAriaLabel());
};


//---------------------------------------------------------------------//
// Rollover and Hide/Show Support: DvtCategoricalObject impl           //
//---------------------------------------------------------------------//

/**
 * @override
 */
DvtPictoChartItem.prototype.getCategories = function(category) {
  return this._item['categories'] || [this.getId()];
};


//---------------------------------------------------------------------//
// Keyboard Support: DvtKeyboardNavigable impl                        //
//---------------------------------------------------------------------//

/**
 * @override
 */
DvtPictoChartItem.prototype.getNextNavigable = function(event) {
  var keyboardHandler = this._picto.getEventManager().getKeyboardHandler();
  if (event.type == DvtMouseEvent.CLICK || keyboardHandler.isMultiSelectEvent(event))
    return this;
  else if (keyboardHandler.isNavigationEvent(event))
    return DvtPictoChartKeyboardHandler.getNextNavigable(this._picto, this, event);
  else
    return null;
};

/**
 * @override
 */
DvtPictoChartItem.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) {
  return this.getDimensions(targetCoordinateSpace);
};

/**
 * @override
 */
DvtPictoChartItem.prototype.getTargetElem = function() {
  return this.getElem();
};

/**
 * @override
 */
DvtPictoChartItem.prototype.showKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = true;
  this.showHoverEffect();
};

/**
 * @override
 */
DvtPictoChartItem.prototype.hideKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = false;
  this.hideHoverEffect();
};

/**
 * @override
 */
DvtPictoChartItem.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};

/**
 * Sets where the tooltip should appear on keyboard navigation.
 * @param {DvtPoint} location
 */
DvtPictoChartItem.prototype.setKeyboardTooltipLocation = function(location) {
  this._keyboardTooltipLocation = location;
};

/**
 * @override
 */
DvtPictoChartItem.prototype.getKeyboardTooltipLocation = function() {
  return this._keyboardTooltipLocation;
};
/**
 * @param {DvtPictoChartEventManager} eventManager The owning event manager.
 * @class DvtPictoChartKeyboardHandler
 * @extends {DvtKeyboardHandler}
 * @constructor
 */
var DvtPictoChartKeyboardHandler = function(eventManager) {
  this.Init(eventManager);
};

DvtObj.createSubclass(DvtPictoChartKeyboardHandler, DvtKeyboardHandler, 'DvtPictoChartKeyboardHandler');

/**
 * @override
 */
DvtPictoChartKeyboardHandler.prototype.isSelectionEvent = function(event) {
  return this.isNavigationEvent(event) && !event.ctrlKey;
};

/**
 * @override
 */
DvtPictoChartKeyboardHandler.prototype.isMultiSelectEvent = function(event) {
  return event.keyCode == DvtKeyboardEvent.SPACE && event.ctrlKey;
};

/**
 * Finds next navigable item based on direction.
 * @param {DvtPictoChart} picto The component.
 * @param {DvtKeyboardNavigable} currentNavigable The navigable item with current focus.
 * @param {DvtKeyboardEvent} event The keyboard event.
 * @return {DvtKeyboardNavigable} The next navigable.
 */
DvtPictoChartKeyboardHandler.getNextNavigable = function(picto, currentNavigable, event) {
  var isOriginRight = DvtPictoChartRenderer.isOriginRight(picto);
  var isOriginBottom = DvtPictoChartRenderer.isOriginBottom(picto);

  var isForward =
      (event.keyCode == DvtKeyboardEvent.LEFT_ARROW && isOriginRight) ||
      (event.keyCode == DvtKeyboardEvent.RIGHT_ARROW && !isOriginRight) ||
      (event.keyCode == DvtKeyboardEvent.UP_ARROW && isOriginBottom) ||
      (event.keyCode == DvtKeyboardEvent.DOWN_ARROW && !isOriginBottom);

  var navigableItems = picto.getItems();
  var nextIdx = DvtArrayUtils.getIndex(navigableItems, currentNavigable) + (isForward ? 1 : -1);
  if (nextIdx < navigableItems.length && nextIdx >= 0)
    return navigableItems[nextIdx];
  else
    return currentNavigable;
};

/**
 * @override
 */
DvtPictoChartKeyboardHandler.prototype.processKeyDown = function(event) {
  var currentNavigable = this._eventManager.getFocus();
  if (currentNavigable && event.keyCode == DvtKeyboardEvent.ENTER) {
    this._eventManager.processDrillEvent(currentNavigable);
    DvtEventManager.consumeEvent(event);
    return currentNavigable;
  }
  else
    return DvtPictoChartKeyboardHandler.superclass.processKeyDown.call(this, event);
};
// Copyright (c) 2014, 2015, Oracle and/or its affiliates. All rights reserved.

/**
 *  @param {DvtPictChart} picto
 *  @param {String} shape Marker shape.
 *  @param {number} cx The x position of the center of the marker.
 *  @param {number} cy The y position of the center of the marker.
 *  @param {number} width The width of the marker.
 *  @param {number} height The height of the marker.
 *  @param {String} id The id of the marker.
 *  @extends {DvtSimpleMarker}
 *  @constructor
 */
var DvtPictoChartShapeMarker = function(picto, shape, cx, cy, width, height, id) {
  DvtPictoChartShapeMarker.superclass.Init.call(this, picto.getCtx(), shape, DvtCSSStyle.SKIN_ALTA, cx, cy, width, height, true, id);
  this._picto = picto;
};

DvtObj.createSubclass(DvtPictoChartShapeMarker, DvtSimpleMarker, 'DvtPictoChartShapeMarker');


//---------------------------------------------------------------------//
// Animation support: DvtDataAnimationHandler                          //
//---------------------------------------------------------------------//

/**
 * @override
 */
DvtPictoChartShapeMarker.prototype.animateUpdate = function(handler, oldMarker) {
  var animation = new DvtCustomAnimation(this.getCtx(), this, this._picto.getAnimationDuration() * 0.75);
  var animator = animation.getAnimator();

  // Color animation
  var endFill = this.getFill();
  this.setFill(oldMarker.getFill().clone());
  animator.addProp(DvtAnimator.TYPE_FILL, this, this.getFill, this.setFill, endFill);

  // Position and size animation
  var endParams = this._getAnimationParams();
  this._setAnimationParams(oldMarker._getAnimationParams());
  animator.addProp(DvtAnimator.TYPE_NUMBER_ARRAY, this, this._getAnimationParams, this._setAnimationParams, endParams);

  // Hide old item
  oldMarker.setAlpha(0);

  handler.add(animation, 1);
};

/**
 * @override
 */
DvtPictoChartShapeMarker.prototype.animateDelete = function(handler) {
  handler.add(new DvtAnimFadeOut(this.getCtx(), this, this._picto.getAnimationDuration() * 0.5), 0);
};

/**
 * @override
 */
DvtPictoChartShapeMarker.prototype.animateInsert = function(handler) {
  this.setAlpha(0);
  handler.add(new DvtAnimFadeIn(this.getCtx(), this, this._picto.getAnimationDuration() * 0.5), 2);
};

/**
 * Returns the animation params.
 * @return {Array}
 * @private
 */
DvtPictoChartShapeMarker.prototype._getAnimationParams = function() {
  return [this.getCx(), this.getCy(), this.getWidth(), this.getHeight()];
};

/**
 * Sets the animation params.
 * @param {Array} params
 * @private
 */
DvtPictoChartShapeMarker.prototype._setAnimationParams = function(params) {
  this.setCx(params[0]);
  this.setCy(params[1]);
  this.setWidth(params[2]);
  this.setHeight(params[3]);
};
/**
 * Renderer for DvtPictoChart.
 * @class
 */
var DvtPictoChartRenderer = {};

DvtObj.createSubclass(DvtPictoChartRenderer, DvtObj, 'DvtPictoChartRenderer');

/**
 * Renders the pictoChart contents into the available space.
 * @param {DvtPictoChart} picto The pictoChart being rendered.
 * @param {DvtContainer} container The container to render into.
 * @param {DvtRectangle} availSpace The available space.
 * @param {Object=} info (optional) The pictoChart info, obtained from DvtPictoChartRenderer.getInfo().
 */
DvtPictoChartRenderer.render = function(picto, container, availSpace, info) {
  // Add invisible background to allow interactivity (e.g. clear selection)
  var context = picto.getCtx();
  var background = new DvtRect(context, availSpace.x, availSpace.y, availSpace.w, availSpace.h);
  background.setInvisibleFill();
  container.addChild(background);

  if (!info)
    info = DvtPictoChartRenderer.getInfo(picto, availSpace.w, availSpace.h);

  if (!info.items) {
    DvtPictoChartRenderer.renderEmptyText(picto, container, availSpace);
    return;
  }

  // Register the items
  picto.registerItems(info.items);

  var options = picto.getOptions();
  var gapRatio = options['_gapRatio'];
  var isVert = DvtPictoChartRenderer.isVertical(picto);
  var isOriginBottom = DvtPictoChartRenderer.isOriginBottom(picto);
  var isOriginRight = DvtPictoChartRenderer.isOriginRight(picto);

  // Use a 2D cell map to keep track of which cells are occupied
  var cellMap = new DvtMap2D();

  var prevColSpan = 0;
  var prevRowSpan = 0;
  var remainder = 0; // fractional remainder of the previous item

  for (var i = 0; i < info.items.length; i++) {
    var item = info.items[i];
    var colSpan = item.getColSpan();
    var rowSpan = item.getRowSpan();
    var w = colSpan * info.colWidth;
    var h = rowSpan * info.rowHeight;

    var count = item.getCount(); // number of markers left to be rendered
    var index = 0; // marker index for animation
    var isFirstMarker = true;
    var cell;

    while (count > 0) {
      // Fractional markers can't be combined if the colSpan and rowSpan don't match
      if (colSpan != prevColSpan || rowSpan != prevRowSpan)
        remainder = 0;

      // If there's no remainder, use a new cell. Otherwise, render on the previous cell
      if (remainder == 0)
        cell = DvtPictoChartRenderer._findNextAvailableCell(cellMap, colSpan, rowSpan, info.colCount, info.rowCount, isVert);

      if (cell == null)
        break;

      // Marker coords
      var xOffset = cell.col * info.colWidth + w / 2;
      var yOffset = cell.row * info.rowHeight + h / 2;
      var x = availSpace.x + (isOriginRight ? availSpace.w - xOffset : xOffset);
      var y = availSpace.y + (isOriginBottom ? availSpace.h - yOffset : yOffset);

      // Draw fractional marker if remaining count is less than one, or if there's a remainder from the previous item
      var fraction = Math.min(1 - remainder, count);

      // Coords for hit area and clip path
      var rectX, rectY, rectW, rectH;
      if (isVert) {
        rectX = x - w / 2;
        rectY = isOriginBottom ? y + h * (0.5 - fraction - remainder) : y + h * (remainder - 0.5);
        rectW = w;
        rectH = h * fraction;
      }
      else {
        rectX = isOriginRight ? x + w * (0.5 - fraction - remainder) : x + w * (remainder - 0.5);
        rectY = y - h / 2;
        rectW = w * fraction;
        rectH = h;
      }

      // Set the marker ID for data change animation
      var markerId;
      if (fraction == 1) {
        markerId = item.getId() + '_' + index;
        index++;
      }
      else {
        // Set a random ID so that fractional markers don't get animateUpdate (only animateInsert and animateDelete)
        // This is a workaround for not animating the clipPath
        markerId = Math.random();
      }

      var marker;
      if (item.getSource()) {
        // Custom image marker
        marker = new DvtPictoChartImageMarker(picto, x, y, w, h, item.getSource(), item.getSourceSelected(),
            item.getSourceHover(), item.getSourceHoverSelected(), markerId + '_I');
      }
      else {
        // Add hit area to remove gap between shapes (for selection, tooltip, etc)
        var hitArea = new DvtRect(context, rectX, rectY, rectW, rectH);
        hitArea.setInvisibleFill();
        item.addChild(hitArea);

        // Create shape marker
        marker = new DvtPictoChartShapeMarker(picto, item.getShape(), x, y,
            w - info.colWidth * gapRatio, h - info.rowHeight * gapRatio, markerId + '_S');
        marker.setSolidFill(item.getColor());
        marker.setSolidStroke(item.getBorderColor(), null, item.getBorderWidth());
        marker.setDataColor(item.getColor());
      }

      // Draw clip path if the marker is fractional
      if (fraction < 1) {
        var clipPath = new DvtClipPath();
        clipPath.addRect(rectX, rectY, rectW, rectH);
        marker.setClipPath(clipPath);
      }

      // Set the keyboard tooltip to show up on the first marker
      if (isFirstMarker) {
        item.setKeyboardTooltipLocation(new DvtPoint(x, y));
        isFirstMarker = false;
      }

      item.addChild(marker);
      picto.registerMarker(marker);

      count -= fraction;
      remainder = (remainder + fraction) % 1;
    }

    container.addChild(item);
    item.updateAriaAttributes();

    prevColSpan = colSpan;
    prevRowSpan = rowSpan;
  }
};

/**
 * Creates the pictoChart items and computes the layout variables.
 * @param {DvtPictoChart} picto The pictoChart being rendered.
 * @param {number=} width The width, if fixed by user (optional)
 * @param {number=} height The height, if fixed by user (optional)
 * @return {Object} An object containing items, colCount, rowCount, colWidth, and rowHeight.
 */
DvtPictoChartRenderer.getInfo = function(picto, width, height) {
  var options = picto.getOptions();
  var itemObjs = options['items'];
  if (!itemObjs)
    return {};

  // Create a boolean map of hidden categories for better performance
  var categoryMap = DvtArrayUtils.createBooleanMap(options['hiddenCategories']);

  // Create items and compute the number of cells that are needed to fit all items
  var items = [];
  var numCells = 0;
  var maxColSpan = 1;
  var maxRowSpan = 1;

  for (var i = 0; i < itemObjs.length; i++) {
    if (itemObjs[i] == null)
      continue;

    var item = new DvtPictoChartItem(picto, itemObjs[i]);
    if (categoryMap && DvtArrayUtils.hasAnyMapItem(categoryMap, item.getCategories()))
      continue;

    // Compute the maximum colSpan and rowSpan
    var colSpan = item.getColSpan();
    var rowSpan = item.getRowSpan();
    if (colSpan > maxColSpan)
      maxColSpan = colSpan;
    if (rowSpan > maxRowSpan)
      maxRowSpan = rowSpan;

    numCells += colSpan * rowSpan * item.getCount();
    items.push(item);
  }
  if (numCells == 0)
    return {};

  // Default colWidth and rowHeight for flowing layout
  var colWidth = options['columnWidth'];
  var rowHeight = options['rowHeight'];
  if (!width || !height) {
    if (!colWidth)
      colWidth = rowHeight ? rowHeight : options['_defaultSize'];
    if (!rowHeight)
      rowHeight = colWidth;
  }

  // Default colCount and rowCount for both layouts
  // We set the default colCount (or rowCount) to be an integer multiple of the maxColSpan (or maxRowSpan) to
  // ensure that all the items can find a spot to occupy in the mixed sizes case.
  var isVert = DvtPictoChartRenderer.isVertical(picto);
  var colCount = options['columnCount'];
  var rowCount = options['rowCount'];
  if (!colCount && !rowCount) {
    // Try to achieve square cells, (width / colCount) = (height / rowCount)
    if (width && height) {
      if (isVert)
        rowCount = DvtPictoChartRenderer._ceil(Math.sqrt(numCells * height / width), maxRowSpan);
      else
        colCount = DvtPictoChartRenderer._ceil(Math.sqrt(numCells * width / height), maxColSpan);
    }
    else if (width)
      colCount = Math.max(Math.floor(width / colWidth), 1);
    else if (height)
      rowCount = Math.max(Math.floor(height / rowHeight), 1);
    else {
      if (isVert)
        rowCount = DvtPictoChartRenderer._ceil(Math.sqrt(numCells), maxRowSpan);
      else
        colCount = DvtPictoChartRenderer._ceil(Math.sqrt(numCells), maxColSpan);
    }
  }
  // Now only either colCount or rowCount is undefined
  if (!colCount)
    colCount = DvtPictoChartRenderer._ceil(numCells / rowCount, maxColSpan);
  else if (!rowCount)
    rowCount = DvtPictoChartRenderer._ceil(numCells / colCount, maxRowSpan);

  // Default colWidth and rowHeight for fixed layout
  if (width && height) {
    if (!colWidth)
      colWidth = rowHeight ? rowHeight : Math.min(width / colCount, height / rowCount);
    if (!rowHeight)
      rowHeight = colWidth;
  }

  if (colCount <= 0 || rowCount <= 0 || colWidth <= 0 || rowHeight <= 0)
    return {};

  return {items: items, colCount: colCount, rowCount: rowCount, colWidth: colWidth, rowHeight: rowHeight};
};

/**
 * Round "a" up to the closest number that is an integer multiple of "b"
 * @param {number} a
 * @param {number} b
 * @return {number}
 * @private
 */
DvtPictoChartRenderer._ceil = function(a, b) {
  return Math.ceil(a / b) * b;
};

/**
 * Returns the next available cell for the shape.
 * @param {DvtMap2D} cellMap
 * @param {number} colSpan
 * @param {number} rowSpan
 * @param {number} colCount
 * @param {number} rowCount
 * @param {boolean} isVert Whether the layout is vertical.
 * @return {object} Contains the col and row of the next available cell.
 * @private
 */
DvtPictoChartRenderer._findNextAvailableCell = function(cellMap, colSpan, rowSpan, colCount, rowCount, isVert) {
  if (isVert) {
    // For vertical layout, switch row and col in the computation, and switch the result back
    var cell = DvtPictoChartRenderer._findNextAvailableCell(cellMap, rowSpan, colSpan, rowCount, colCount, false);
    return cell ? {col: cell.row, row: cell.col} : null;
  }

  for (var r = 0; r < rowCount - rowSpan + 1; r++) {
    for (var c = 0; c < colCount - colSpan + 1; c++) {
      if (DvtPictoChartRenderer._areCellsAvailable(cellMap, c, r, colSpan, rowSpan)) {
        DvtPictoChartRenderer._occupyCells(cellMap, c, r, colSpan, rowSpan);
        return {col: c, row: r};
      }
    }
  }

  return null;
};

/**
 * Returns whether the cells are available.
 * @param {DvtMap2D} cellMap
 * @param {number} col
 * @param {number} row
 * @param {number} colSpan
 * @param {number} rowSpan
 * @return {boolean}
 * @private
 */
DvtPictoChartRenderer._areCellsAvailable = function(cellMap, col, row, colSpan, rowSpan) {
  for (var r = 0; r < rowSpan; r++) {
    for (var c = 0; c < colSpan; c++) {
      if (cellMap.get(col + c, row + r))
        return false;
    }
  }
  return true;
};

/**
 * Occupies the specified cells.
 * @param {DvtMap2D} cellMap
 * @param {number} col
 * @param {number} row
 * @param {number} colSpan
 * @param {number} rowSpan
 * @private
 */
DvtPictoChartRenderer._occupyCells = function(cellMap, col, row, colSpan, rowSpan) {
  for (var r = 0; r < rowSpan; r++) {
    for (var c = 0; c < colSpan; c++) {
      cellMap.put(col + c, row + r, true);
    }
  }
};

/**
 * Renders the empty text for the component.
 * @param {DvtPictoChart} picto The pictoChart being rendered.
 * @param {DvtContainer} container The container to render into.
 * @param {DvtRectangle} availSpace The available space.
 */
DvtPictoChartRenderer.renderEmptyText = function(picto, container, availSpace) {
  var options = picto.getOptions();
  var emptyTextStr = DvtBundle.getTranslation(options, 'labelNoData', DvtBundle.UTIL_PREFIX, 'NO_DATA');
  var emptyText = DvtTextUtils.renderEmptyText(container, emptyTextStr, availSpace.clone(),
      picto.getEventManager(), options['_statusMessageStyle']);
  picto.registerEmptyText(emptyText);
};

/**
 * Returns whether the pictoChart is vertical.
 * @param {DvtPictoChart} picto
 * @return {boolean}
 */
DvtPictoChartRenderer.isVertical = function(picto) {
  return picto.getOptions()['layout'] == 'vertical';
};

/**
 * Returns whether the pictoChart is layout from bottom to top.
 * @param {DvtPictoChart} picto
 * @return {boolean}
 */
DvtPictoChartRenderer.isOriginBottom = function(picto) {
  var origin = picto.getOptions()['layoutOrigin'];
  return origin == 'bottomStart' || origin == 'bottomEnd';
};

/**
 * Returns whether the pictoChart is layout from right to left.
 * @param {DvtPictoChart} picto
 * @return {boolean}
 */
DvtPictoChartRenderer.isOriginRight = function(picto) {
  var origin = picto.getOptions()['layoutOrigin'];
  var isEnd = origin == 'topEnd' || origin == 'bottomEnd';
  return DvtAgent.isRightToLeft(picto.getCtx()) ? !isEnd : isEnd;
};

  return D;
});