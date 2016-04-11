/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit', './DvtAxis', './DvtLegend', './DvtOverview'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

(function(dvt) {
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.

/**
 * Chart component.
 * @param {dvt.Context} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @class
 * @constructor
 * @extends {dvt.BaseComponent}
 */
dvt.Chart = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

dvt.Obj.createSubclass(dvt.Chart, dvt.BaseComponent);


/**
 * Returns a new instance of dvt.Chart.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @return {dvt.Chart}
 */
dvt.Chart.newInstance = function(context, callback, callbackObj) {
  return new dvt.Chart(context, callback, callbackObj);
};


/**
 * Returns a copy of the default options for the specified skin.
 * @param {string} skin The skin whose defaults are being returned.
 * @return {object} The object containing defaults for this component.
 */
dvt.Chart.getDefaults = function(skin) {
  return (new DvtChartDefaults()).getDefaults(skin);
};


/**
 * @override
 */
dvt.Chart.prototype.Init = function(context, callback, callbackObj) {
  dvt.Chart.superclass.Init.call(this, context, callback, callbackObj);

  // Create the defaults object
  this.Defaults = new DvtChartDefaults();

  // Create the event handler and add event listeners
  this.EventManager = new DvtChartEventManager(this);
  this.EventManager.addListeners(this);

  // Set up keyboard handler on non-touch devices
  if (!dvt.Agent.isTouchDevice())
    this.EventManager.setKeyboardHandler(this.CreateKeyboardHandler(this.EventManager));

  // Make sure the object has an id for clipRect naming
  this.setId('chart' + 1000 + Math.floor(Math.random() * 1000000000));//@RandomNumberOk

  /**
   * Reference to animation in progress.
   * @private
   */
  this._animation = null;

  /**
   * The legend of the chart.  This will be set during render time.
   * @type {dvt.Legend}
   */
  this.legend = null;
  /**
   * The x axis of the chart.  This will be set during render time.
   * @type {DvtChartAxis}
   */
  this.xAxis = null;
  /**
   * The y axis of the chart.  This will be set during render time.
   * @type {DvtChartAxis}
   */
  this.yAxis = null;
  /**
   * The y2 axis of the chart.  This will be set during render time for dual-y graphs.
   * @type {DvtChartAxis}
   */
  this.y2Axis = null;
  /**
   * The overview scrollbar of the chart.  This will be set during render time.
   * @type {DvtChartOverview}
   */
  this.overview = null;
  /**
   * The x-axis simple scrollbar of the chart.  This will be set during render time.
   * @type {dvt.SimpleScrollbar}
   */
  this.xScrollbar = null;
  /**
   * The y-axis simple scrollbar of the chart.  This will be set during render time.
   * @type {dvt.SimpleScrollbar}
   */
  this.yScrollbar = null;
  /**
   * The drag mode buttons of the chart.  This will be set during render time.
   * @type {dvt.Container}
   */
  this.dragButtons = null;
  /**
   * The pie chart subcomponent.  This will be set during render time for pie graphs.
   * @type {DvtChartPie}
   */
  this.pieChart = null;

  /**
   * The pie chart custom center content.
   * @type {Element}
   */
  this.pieCenterDiv = null;

  /**
   * The array of logical objects for this chart.
   * @protected
   */
  this.Peers = [];

  /**
   * Array to make sure that the styles of the series don't mutate of data change.
   * @protected
   */
  this.SeriesStyleArray = [];

  /**
   * Cache for storing the results of expensive computations.
   * @protected
   */
  this.Cache = {};

  // Support for changing z-order for selection
  this._numFrontObjs = 0;
  this._numSelectedObjsInFront = 0;

  /** @private */
  this._dataLabels = null;

  /**
   * Reference to user options before it's processed and used to create the chart.
   * @private
   */
  this._rawOptions = null;
};

/**
 * @override
 */
dvt.Chart.prototype.GetComponentDescription = function() 
{
  var options = this.getOptions();
  var compName = dvt.Bundle.getTranslation(options, 'componentName', dvt.Bundle.UTIL_PREFIX, 'CHART');

  var compDesc = '';
  var delimiter = dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'ARIA_LABEL_DESC_DELIMITER');
  if (options['title']['text']) {
    compDesc += this.Options['title']['text'];
    if (options['subtitle']['text'])
      compDesc += delimiter + this.Options['subtitle']['text'];
  }
  if (options['footnote']['text'])
    compDesc = (compDesc.length == 0) ? this.Options['footnote']['text'] : compDesc.concat(delimiter, this.Options['footnote']['text']);

  if (compDesc.length > 0)
    return dvt.Bundle.getTranslation(options, 'labelAndValue', dvt.Bundle.UTIL_PREFIX, 'COLON_SEP_LIST', [compName, compDesc]);
  else
    return compName;
};

/**
 * @override
 */
dvt.Chart.prototype.SetOptions = function(options) {
  // Reset options cache
  this.clearOptionsCache();

  if (options) {
    // Combine the user options with the defaults and store
    this._rawOptions = options;
    this.Options = this.Defaults.calcOptions(options);

    // Process "horizontalBar" chart type for backwards compatibility
    if (this.Options['type'] == 'horizontalBar') {
      this.Options['type'] = 'bar';
      this.Options['orientation'] = 'horizontal';
    }

    // Process the data to add bulletproofing
    DvtChartDataUtils.processDataObject(this);

    // Disable animation for canvas and xml
    if (!dvt.Agent.isEnvironmentBrowser()) {
      this.Options['animationOnDisplay'] = 'none';
      this.Options['animationOnDataChange'] = 'none';
    }
  }
  else if (!this.Options) // No object has ever been provided, copy the defaults
    this.Options = this.GetDefaults();

  // Initialize the selection handler
  var selectionMode = this.Options['selectionMode'];
  if (selectionMode == 'single')
    this._selectionHandler = new dvt.SelectionHandler(dvt.SelectionHandler.TYPE_SINGLE);
  else if (selectionMode == 'multiple')
    this._selectionHandler = new dvt.SelectionHandler(dvt.SelectionHandler.TYPE_MULTIPLE);
  else
    this._selectionHandler = null;

  // Pass to event handler
  this.EventManager.setSelectionHandler(this._selectionHandler);

  // Popup Support
  var popupBehaviors = this.Options['_spb'];
  if (popupBehaviors) {
    this._popupBehaviors = {};

    // Iterate through the popup behaviors for each parent stamp id
    for (var stampId in popupBehaviors) {
      var popupBehaviorArray = popupBehaviors[stampId];
      for (var i = 0; i < popupBehaviorArray.length; i++) {
        // Create the array of behaviors for this stampId
        if (!this._popupBehaviors[stampId])
          this._popupBehaviors[stampId] = [];

        var popupBehavior = popupBehaviorArray[i];
        var popupId = popupBehavior['popupId'];
        var triggerType = popupBehavior['triggerType'];
        var alignId = popupBehavior['alignId'];
        var align = popupBehavior['align'];
        this._popupBehaviors[stampId].push(new dvt.ShowPopupBehavior(popupId, triggerType, alignId, align));
      }
    }
  }
};


/**
 * @override
 */
dvt.Chart.prototype.render = function(options, width, height) 
{
  // Reset render cache
  this.clearRenderCache();

  var context = this.getCtx();

  var animationOnDataChange = this.Options ? this.Options['animationOnDataChange'] : 'none';

  // Cache and cleanup objects from the previous render
  var oldChart = (animationOnDataChange != 'none') ? new DvtChartDataChange(this) : null;
  var focusState = this.__cacheChartFocus();
  this.__cleanUp();

  // Update if a new options object has been provided or initialize with defaults if needed. This is done first to
  // ensure that property access, like DvtChartStyleUtils.getAnimationOnDataChange, do not generate default options.
  this.SetOptions(options);

  // Update the width and height if provided
  if (!isNaN(width) && !isNaN(height)) {
    this.Width = width;
    this.Height = height;
  }


  // Create a new container and render the component into it
  var container = new dvt.Container(context);
  this.addChild(container);
  DvtChartRenderer.render(this, container, new dvt.Rectangle(0, 0, this.Width, this.Height));

  // . We don't want the inner chart's listeners to be invoked when it is a spark chart, thus we are removing them.
  if (DvtChartTypeUtils.isSpark(this))
    this.EventManager.removeListeners(this);

  // Animation Support
  this._stopAnimation();

  // Construct the new animation playable
  var animationOnDisplay = DvtChartStyleUtils.getAnimationOnDisplay(this);
  var animationDuration = DvtChartStyleUtils.getAnimationDuration(this);
  var bounds = new dvt.Rectangle(0, 0, this.Width, this.Height);
  var bBlackBoxUpdate = false; // true if this is a black box update animation

  if (! this._container) {
    if (animationOnDisplay != 'none') {
      // AnimationOnDisplay
      this._animation = dvt.BlackBoxAnimationHandler.getInAnimation(context, animationOnDisplay, container,
          bounds, animationDuration);
      if (!this._animation && animationOnDisplay == 'auto') {
        this._animation = DvtChartAnimOnDisplay.createAnimation(this, animationOnDisplay, animationDuration);
      }
    }
  }
  else if (animationOnDataChange != 'none' && options) {
    // AnimationOnDataChange
    this._animation = dvt.BlackBoxAnimationHandler.getCombinedAnimation(context, animationOnDataChange, this._container,
        container, bounds, animationDuration);
    if (this._animation)           // Black Box Animation
      bBlackBoxUpdate = true;
    else if (animationOnDataChange == 'auto' && this.getPlotArea()) {
      var paSpace = this.__getPlotAreaSpace();
      this._delContainer = DvtChartPlotAreaRenderer.createClippedGroup(this, this._container, new dvt.Rectangle(0, 0, paSpace.w, paSpace.h));
      this._animation = DvtChartAnimOnDC.createAnimation(oldChart, this, animationOnDataChange,
          animationDuration, this._delContainer);

      if (this._delContainer.getNumChildren() > 0)
        this.getPlotArea().addChild(this._delContainer);
    }
  }

  // If an animation was created, play it
  if (this._animation) {
    // Disable event listeners temporarily
    this.EventManager.removeListeners(this);

    dvt.Playable.appendOnEnd(this._animation, this._onAnimationEnd, this);
    this._animation.play();
  }

  // Clean up the old container.  If doing black box animation, store a pointer and clean
  // up after animation is complete.  Otherwise, remove immediately.
  if (bBlackBoxUpdate) {
    this._oldContainer = this._container;
  }
  else if (this._container) {
    this.removeChild(this._container);  // Not black box animation, so clean up the old contents
    this._container.destroy();
    this._container = null;
  }

  // Update the pointer to the new container
  this._container = container;

  // Data Cursor
  this._dataCursor = DvtChartRenderer.renderDataCursor(this);

  this.UpdateAriaAttributes();

  // Restore focus
  this.__restoreChartFocus(focusState);

  if (!this._animation)
    // If not animating, that means we're done rendering, so fire the ready event.
    this.RenderComplete();
};

/**
 * Releases all component resources to prevent memory leaks.
 * @override
 */
dvt.Chart.prototype.destroy = function() {
  if (this.EventManager) {
    this.EventManager.removeListeners(this);
    this.EventManager.destroy();
    this.EventManager = null;
  }

  // Animation Support
  this._stopAnimation();

  // Call super last during destroy
  dvt.Chart.superclass.destroy.call(this);
};

/**
 * Performs cleanup of the previously rendered content.  Note that this doesn't cleanup anything needed for animation.
 * @protected
 */
dvt.Chart.prototype.__cleanUp = function() {
  // Data cursor cleanup
  if (this._dataCursor) {
    this.removeChild(this._dataCursor);
    this._dataCursor = null;
  }

  // Tooltip cleanup
  if (this.EventManager)
    this.EventManager.hideHoverFeedback();

  // Remove pie center content
  if (this.pieCenterDiv) {
    this.getCtx().getContainer().removeChild(this.pieCenterDiv);
    this.pieCenterDiv = null;
  }

  // Clear the list of registered peers
  this.Peers = [];

  // Clear scrollbars, buttons
  this.xScrollbar = null;
  this.yScrollbar = null;

  if (this.dragButtons) {
    this.removeChild(this.dragButtons);
    this.dragButtons.destroy();
    this.dragButtons = null;
    this.EventManager.panButton = null;
    this.EventManager.zoomButton = null;
    this.EventManager.selectButton = null;
  }

  this._plotArea = null;
  this._areaContainer = null;
  this._dataLabels = null;

  this.clearCache();
};


/**
 * Clean up axis and plot area for rerendering (zoom/scroll).
 */
dvt.Chart.prototype.__cleanUpAxisAndPlotArea = function() {
  // Tooltip cleanup
  this.EventManager.hideHoverFeedback();

  // Clear the list of registered peers
  this.Peers = [];

  // Clean up the axis and plot area
  this._container.removeChild(this.xAxis);
  this._container.removeChild(this.yAxis);
  this._container.removeChild(this.y2Axis);

  // Plot area which is a touch target needs to be kept so that subsequent touch events are fired.
  if (this._plotArea && this._plotArea == this._panZoomTarget)
    this._plotArea.setVisible(false);
  else
    this._container.removeChild(this._plotArea);

  this._plotArea = null;

  this.clearCache();
};


/**
 * Hook for cleaning up animation behavior at the end of the animation.
 * @private
 */
dvt.Chart.prototype._onAnimationEnd = function() {
  // Clean up the old container used by black box updates
  if (this._oldContainer) {
    this.removeChild(this._oldContainer);
    this._oldContainer.destroy();
    this._oldContainer = null;
  }

  if (this._delContainer && this._delContainer.getNumChildren() > 0)
    this.getPlotArea().removeChild(this._delContainer);

  this._delContainer = null;

  // Fire ready event saying animation is finished.
  if (!this._animationStopped)
    this.RenderComplete();

  // Reset the animation and reference
  this._animation = null;
  this._animationStopped = null;

  // Restore event listeners
  this.EventManager.addListeners(this);
};

/**
 * Hook for stopping animation if needed after render or destroy
 * @private
 */
dvt.Chart.prototype._stopAnimation = function() {
  // Stop any animation in progress
  if (this._animation) {
    this._animationStopped = true;
    this._animation.stop();
  }
};

/**
 * Creates the keyboard handler.
 * @param {DvtChartEventManager} manager Event manager.
 * @return {DvtChartKeyboardHandler}
 * @protected
 */
dvt.Chart.prototype.CreateKeyboardHandler = function(manager) {
  return new DvtChartKeyboardHandler(manager, this);
};


/**
 * Returns the automation object for this chart
 * @return {dvt.Automation} The automation object
 */
dvt.Chart.prototype.getAutomation = function() {
  return new DvtChartAutomation(this);
};

/**
 * Returns the x, y, and y2 axis values at the specified X and Y coordinate.
 * @param {Number} x The X coordinate relative to the component.
 * @param {Number} y The Y coordinate relative to the component.
 * @return {object} An object containing the "x", "y", and "y2" axis values.
 */
dvt.Chart.prototype.getValuesAt = function(x, y) {
  var paBounds = this.__getPlotAreaSpace();
  var relX = x - paBounds.x;
  var relY = y - paBounds.y;

  var isPolar = DvtChartTypeUtils.isPolar(this);
  var isHoriz = DvtChartTypeUtils.isHorizontal(this);

  if (isPolar) {
    // Convert cartesian to polar
    relX -= paBounds.w / 2;
    relY -= paBounds.h / 2;
    var r = Math.sqrt(relX * relX + relY * relY);
    var theta = Math.atan2(relX, -relY);
    if (theta < 0)
      theta += 2 * Math.PI;

    return {
      'x': this.xAxis ? this.xAxis.getValueAt(theta) : null,
      'y': this.yAxis ? this.yAxis.getValueAt(r) : null
    };
  }
  else {
    return {
      'x': this.xAxis ? this.xAxis.getValueAt(isHoriz ? relY : relX) : null,
      'y': this.yAxis ? this.yAxis.getValueAt(isHoriz ? relX : relY) : null,
      'y2': this.y2Axis ? this.y2Axis.getValueAt(isHoriz ? relX : relY) : null
    };
  }
};


/**
 * Filters or removes the filter from the specified category.
 * @param {string} category The category which has been filtered out.
 * @param {string} type "out" to filter out the specified category, or "in" to remove the filter.
 */
dvt.Chart.prototype.filter = function(category, type) {
  // Update the component state
  var visibility = (type == 'out' ? 'hidden' : 'visible');
  DvtChartEventUtils.setVisibility(this, category, visibility);

  // Rerender the component. Pass the options to cause animation to happen.
  this.render(this.Options);
};

/**
 * @override
 */
dvt.Chart.prototype.highlight = function(categories) {
  // Update the options
  this.getOptions()['highlightedCategories'] = dvt.JsonUtils.clone(categories);

  // Perform the highlighting and propagate to children
  dvt.CategoryRolloverHandler.highlight(categories, this.getObjects(), this.getOptions()['highlightMatch'] == 'any');

  if (this.legend)
    this.legend.highlight(categories);

  if (this.pieChart)
    this.pieChart.highlight(categories);

  if (this.overview)
    this.overview.getBackgroundChart().highlight(categories);
};

/**
 * @override
 */
dvt.Chart.prototype.select = function(selection) {
  // Update the options
  var options = this.getOptions();
  options['selection'] = dvt.JsonUtils.clone(selection);

  // Perform the selection
  var selected = DvtChartDataUtils.getInitialSelection(this);
  DvtChartEventUtils.setInitialSelection(this, selected);

  // Propagate to children
  if (this.pieChart)
    this.pieChart.setInitialSelection();
};

/**
 * Positions the data cursor.
 * @param {object} position The data cursor position, containing x, y, y2. If null, the data cursor will be hidden.
 */
dvt.Chart.prototype.positionDataCursor = function(position) {
  var handler = this.getEventManager().getDataCursorHandler();
  if (!handler)
    return;

  if (position) {
    var xCoord = (this.xAxis && position['x'] != null) ? this.xAxis.getCoordAt(position['x']) : null;
    var yCoord = null;
    if (DvtChartTypeUtils.isBLAC(this)) {
      // For BLAC use bounded coord for y-axis to enable syncing across charts with different scales
      if (this.yAxis && position['y'] != null)
        yCoord = this.yAxis.getBoundedCoordAt(position['y']);
      else if (this.y2Axis && position['y2'] != null)
        yCoord = this.yAxis.getBoundedCoordAt(position['y2']);
    }
    else
      yCoord = (this.yAxis && position['y'] != null) ? this.yAxis.getCoordAt(position['y']) : null;

    if (xCoord != null && yCoord != null) {
      // Convert to stage coords and pass them to data cursor handler
      var paBounds = this.__getPlotAreaSpace();
      var paCoords = DvtChartPlotAreaRenderer.convertAxisCoord(this, new dvt.Point(xCoord, yCoord), paBounds);
      handler.processMove(new dvt.Point(paBounds.x + paCoords.x, paBounds.y + paCoords.y), true);
      return;
    }
  }

  handler.processEnd(true);
};


/**
 * @override
 */
dvt.Chart.prototype.getEventManager = function() {
  return this.EventManager;
};


/**
 * Initialize/clear the che chart cache.
 */
dvt.Chart.prototype.clearCache = function() {
  this.Cache = {};
};

/**
 * Retrieves the value corresponding to the key from the chart cache.
 * @param {object} key
 * @return {object}
 */
dvt.Chart.prototype.getFromCache = function(key) {
  return this.Cache[key];
};

/**
 * Stores the value corresponding to the key in the chart cache.
 * @param {object} key
 * @param {object} value
 */
dvt.Chart.prototype.putToCache = function(key, value) {
  this.Cache[key] = value;
};

/**
 * Retrieves the value corresponding to itemKey from the cached map corresponding to mapKey.
 * @param {object} mapKey
 * @param {object} itemKey
 * @return {object}
 */
dvt.Chart.prototype.getFromCachedMap = function(mapKey, itemKey) {
  var map = this.getFromCache(mapKey);
  if (!map) {
    map = {};
    this.putToCache(mapKey, map);
  }
  return map[itemKey];
};

/**
 * Stores the value corresponding to itemKey to the cached map corresponding to mapKey.
 * @param {object} mapKey
 * @param {object} itemKey
 * @param {object} value
 */
dvt.Chart.prototype.putToCachedMap = function(mapKey, itemKey, value) {
  var map = this.getFromCache(mapKey);
  if (!map) {
    map = {};
    this.putToCache(mapKey, map);
  }
  map[itemKey] = value;
};

/**
 * Retrieves the value corresponding to (itemKeyA, itemKeyB) from the cached 2D map corresponding to mapKey.
 * @param {object} mapKey
 * @param {object} itemKeyA
 * @param {object} itemKeyB
 * @return {object}
 */
dvt.Chart.prototype.getFromCachedMap2D = function(mapKey, itemKeyA, itemKeyB) {
  var map = this.getFromCache(mapKey);
  if (!map) {
    map = new dvt.Map2D();
    this.putToCache(mapKey, map);
  }
  return map.get(itemKeyA, itemKeyB);
};

/**
 * Stores the value corresponding to (itemKeyA, itemKeyB) to the cached 2D map corresponding to mapKey.
 * @param {object} mapKey
 * @param {object} itemKeyA
 * @param {object} itemKeyB
 * @param {object} value
 */
dvt.Chart.prototype.putToCachedMap2D = function(mapKey, itemKeyA, itemKeyB, value) {
  var map = this.getFromCache(mapKey);
  if (!map) {
    map = new dvt.Map2D();
    this.putToCache(mapKey, map);
  }
  map.put(itemKeyA, itemKeyB, value);
};


/**
 * Processes the specified event.
 * @param {object} event
 * @param {object} source The component that is the source of the event, if available.
 */
dvt.Chart.prototype.processEvent = function(event, source) {
  var type = event['type'];
  if (type == 'categoryHide' || type == 'categoryShow')
    this.filter(event['category'], (type == 'categoryHide' ? 'out' : 'in'));

  else if (type == 'categoryHighlight') {
    // If the chart is not the source of the event, perform highlighting.
    if (this != source)
      this.highlight(event['categories']);

    if (this.legend && this.legend != source)
      this.legend.processEvent(event, source);
  }

  else if (type == 'selection')
    event = this._processSelectionEvent(event);

  else if (type == dvt.PanZoomEvent.TYPE)
    event = this._processPanZoomEvent(event);

  else if (type == dvt.MarqueeEvent.TYPE)
    event = this._processMarqueeEvent(event);

  else if (type == dvt.OverviewEvent.TYPE) {
    var subtype = event.getSubType();
    if (subtype == dvt.OverviewEvent.SUBTYPE_PRE_RANGECHANGE)
      return;
    var actionDone = subtype == dvt.OverviewEvent.SUBTYPE_SCROLL_TIME ||
                     subtype == dvt.OverviewEvent.SUBTYPE_SCROLL_END ||
                     subtype == dvt.OverviewEvent.SUBTYPE_RANGECHANGE;
    event = this._processScrollbarEvent(event.getNewStartTime(), event.getNewEndTime(), actionDone, source);
  }

  else if (type == dvt.SimpleScrollbarEvent.TYPE)
    event = this._processScrollbarEvent(event.getNewMin(), event.getNewMax(), event.getSubtype() == dvt.SimpleScrollbarEvent.SUBTYPE_END, source);

  else if (type == 'adfShowPopup')
    event = this._processShowPopupEvent(event);

  // For selection events, update the options object and calculate the added/removed arrays
  if (type == 'selection') {
    // TODO : The calculation of added/removedSet should ideally happen in the selectionHandler, but the code there
    // was changed such that it doesn't fire the selection event directly anymore.
    var options = this.getOptions();
    var oldItems = options['selection'];
    var newItems = DvtChartDataUtils.getCurrentSelection(this);
    if (event['complete']) // don't update options on input
      options['selection'] = newItems;

    // Ensure old and new items are not null
    oldItems = oldItems ? oldItems : [];
    newItems = newItems ? newItems : [];

    // Calculate the old and set selection id sets
    var oldIndex, newIndex;

    var oldSet = {};
    for (oldIndex = 0; oldIndex < oldItems.length; oldIndex++) {
      oldSet[oldItems[oldIndex]['id']] = true;
    }

    var newSet = {};
    for (newIndex = 0; newIndex < newItems.length; newIndex++) {
      newSet[newItems[newIndex]['id']] = true;
    }

    // Calculate the added and remove sets using the old and new
    var addedSet = {};
    for (newIndex = 0; newIndex < newItems.length; newIndex++) {
      var newItemId = newItems[newIndex]['id'];
      if (!oldSet[newItemId])
        addedSet[newItemId] = true;
    }

    var removedSet = {};
    for (oldIndex = 0; oldIndex < oldItems.length; oldIndex++) {
      var oldItemId = oldItems[oldIndex]['id'];
      if (!newSet[oldItemId])
        removedSet[oldItemId] = true;
    }

    // Finally add to the selection event
    event['addedSet'] = addedSet;
    event['removedSet'] = removedSet;
  }

  // Dispatch the event to the callback
  if (event)
    this.dispatchEvent(event);
};


/**
 * Processes selection event.
 * @param {object} event Selection event.
 * @return {object} Processed event.
 * @private
 */
dvt.Chart.prototype._processSelectionEvent = function(event) {
  var selection = DvtChartEventUtils.processIds(this, event['selection']);
  this._updateOverviewSelection();
  return dvt.EventFactory.newChartSelectionEvent(selection, true);
};


/**
 * Processes pan/zoom event.
 * @param {dvt.PanZoomEvent} event Pan/zoom event.
 * @return {object} Processed event.
 * @private
 */
dvt.Chart.prototype._processPanZoomEvent = function(event) {
  var subtype = event.getSubtype();
  var actionDone = subtype == dvt.PanZoomEvent.SUBTYPE_PAN_END || subtype == dvt.PanZoomEvent.SUBTYPE_ZOOM || subtype == dvt.PanZoomEvent.SUBTYPE_PINCH_END;
  var actionStart = subtype == dvt.PanZoomEvent.SUBTYPE_PAN_START || subtype == dvt.PanZoomEvent.SUBTYPE_PINCH_START;

  // The initial touch target has to be kept so that the subsequent touch move events are fired
  if (dvt.Agent.isTouchDevice() && actionStart && this._panZoomTarget != this._plotArea) {
    this._container.removeChild(this._panZoomTarget);
    this._panZoomTarget = this._plotArea;
  }

  // Calculate the bounds and update the viewport
  var bounds;
  if (DvtChartEventUtils.isLiveScroll(this)) { // live
    bounds = DvtChartEventUtils.getAxisBoundsByDelta(this, event.dxMin, event.dxMax, event.dyMin, event.dyMax);
    if (!actionStart) {
      this._setViewport(bounds, actionDone);
      this._setScrollbarViewport(bounds);
    }
  }
  else { // delayed
    bounds = DvtChartEventUtils.getAxisBoundsByDelta(this, event.dxMinTotal, event.dxMaxTotal, event.dyMinTotal, event.dyMaxTotal);
    this._setScrollbarViewport(bounds); // always update the scrollbars
    if (actionDone)
      this._setViewport(bounds, actionDone);
  }

  if (actionDone) {
    // Event handlers have to be reset because the plot area space may change
    DvtChartRenderer._setEventHandlers(this);

    // Clear the touch target, if there's one
    if (this._panZoomTarget != this._plotArea) {
      this._container.removeChild(this._panZoomTarget);
      this._panZoomTarget = null;
    }
  }

  // Fire viewport change event
  if (DvtChartTypeUtils.isBLAC(this))
    return dvt.EventFactory.newChartViewportChangeEvent(actionDone, bounds.xMin, bounds.xMax, bounds.startGroup, bounds.endGroup, null, null);
  else
    return dvt.EventFactory.newChartViewportChangeEvent(actionDone, bounds.xMin, bounds.xMax, null, null, bounds.yMin, bounds.yMax);
};


/**
 * Processes marquee event.
 * @param {dvt.MarqueeEvent} event Marquee event.
 * @return {object} Processed event.
 * @private
 */
dvt.Chart.prototype._processMarqueeEvent = function(event) {
  var subtype = event.getSubtype();
  var em = this.EventManager;
  var bounds; // chart bounds
  DvtChartEventUtils.adjustBounds(event);

  // Marquee selection
  if (em.getDragMode() == DvtChartEventManager.DRAG_MODE_SELECT) {
    var selectionHandler = em.getSelectionHandler();

    if (subtype == dvt.MarqueeEvent.SUBTYPE_START) {
      // If ctrl key is pressed at start of drag, the previous selection should be preserved.
      this._initSelection = event.ctrlKey ? selectionHandler.getSelectedIds() : [];
    }
    else {
      var targets = DvtChartEventUtils.getBoundedObjects(this, event);
      selectionHandler.processInitialSelections(this._initSelection, this.getChartObjPeers());
      selectionHandler.processGroupSelection(targets, true);
    }

    // Create and populate selection event
    var selection = DvtChartEventUtils.getSelectedObjects(this, event, selectionHandler);
    bounds = DvtChartEventUtils.getAxisBounds(this, event, false);
    var bComplete = (subtype == dvt.MarqueeEvent.SUBTYPE_END) ? true : false;
    var selectionEvent = dvt.EventFactory.newChartSelectionEvent(selection, bComplete,
        bounds.xMin, bounds.xMax, bounds.startGroup, bounds.endGroup,
        bounds.yMin, bounds.yMax, bounds.y2Min, bounds.y2Max);

    // Update the selection in the overview bg chart
    if (subtype == dvt.MarqueeEvent.SUBTYPE_END)
      this._updateOverviewSelection();

    return selectionEvent;
  }

  // Marquee zoom
  else if (em.getDragMode() == DvtChartEventManager.DRAG_MODE_ZOOM) {
    if (subtype != dvt.MarqueeEvent.SUBTYPE_END)
      return null;

    // Compute and limit the bounds
    bounds = DvtChartEventUtils.getAxisBounds(this, event, true);
    this._setViewport(bounds, true);
    this._setScrollbarViewport(bounds);

    // Event handlers have to be reset because the plot area space may change
    DvtChartRenderer._setEventHandlers(this);

    if (DvtChartTypeUtils.isBLAC(this))
      return dvt.EventFactory.newChartViewportChangeEvent(true, bounds.xMin, bounds.xMax, bounds.startGroup, bounds.endGroup, null, null);
    else
      return dvt.EventFactory.newChartViewportChangeEvent(true, bounds.xMin, bounds.xMax, null, null, bounds.yMin, bounds.yMax);
  }

  return null;
};


/**
 * Processes scrollbar event (overview or simple scrollbar).
 * @param {number} start The min value.
 * @param {number} end The max value.
 * @param {boolean} actionDone Whether the scrolling has finished.
 * @param {object} source The component that is the source of the event, if available.
 * @return {object} Processed event.
 * @private
 */
dvt.Chart.prototype._processScrollbarEvent = function(start, end, actionDone, source) {
  var axis = (source == this.yScrollbar) ? this.yAxis : this.xAxis;
  start = axis.linearToActual(start);
  end = axis.linearToActual(end);

  if (DvtChartEventUtils.isLiveScroll(this) || actionDone) {
    if (source == this.yScrollbar)
      this._setViewport({yMin: start, yMax: end}, actionDone);
    else
      this._setViewport({xMin: start, xMax: end}, actionDone);
  }

  if (source == this.yScrollbar)
    return dvt.EventFactory.newChartViewportChangeEvent(actionDone, null, null, null, null, start, end, null, null);
  else {
    var startEndGroup = DvtChartEventUtils.getAxisStartEndGroup(this.xAxis, start, end);
    return dvt.EventFactory.newChartViewportChangeEvent(actionDone, start, end, startEndGroup.startGroup, startEndGroup.endGroup, null, null, null, null);
  }
};


/**
 * Processes show popup event.
 * @param {object} event Show popup event.
 * @return {object} Processed event.
 * @private
 */
dvt.Chart.prototype._processShowPopupEvent = function(event) {
  // For events other than hover, use the selection context in the popup event
  if (event['triggerType'] != 'mouseHover' && this.isSelectionSupported() && this.getSelectionHandler().getSelectedCount() > 0) {
    var selection = DvtChartEventUtils.processIds(this, this.getSelectionHandler().getSelectedIds());
    event = dvt.EventFactory.newAdfShowPopupEvent(event['showPopupBehavior'], event['launcherBounds'], event['launcherId']);
    event[dvt.BaseComponentEvent.CLIENT_ROW_KEY] = selection;
  }

  return event;
};

/**
 * Updates the selection in the overview background chart.
 * @private
 */
dvt.Chart.prototype._updateOverviewSelection = function() {
  if (this.overview) {
    var ovChart = this.overview.getBackgroundChart();
    ovChart.getOptions()['selection'] = DvtChartDataUtils.getCurrentSelection(this);
    ovChart.render(); // rerender because unselected markers were not rendered
  }
};


/**
 * Updates the chart option and fires the optionChange event.
 * @param {string} key The name of the option to set.
 * @param {Object} value The value to set for the option.
 * @param {Object} optionMetadata (optional) The option metadata for the event.
 */
dvt.Chart.prototype.changeOption = function(key, value, optionMetadata) {
  this.getOptions()[key] = value;
  this.dispatchEvent(dvt.EventFactory.newOptionChangeEvent(key, value, optionMetadata));
};


/**
 * Registers the object peer with the chart.  The peer must be registered to participate
 * in interactivity.
 * @param {DvtChartObjPeer} peer
 */
dvt.Chart.prototype.registerObject = function(peer) {
  this.Peers.push(peer);
};


/**
 * Returns the peers for all objects within the chart.
 * @return {array}
 */
dvt.Chart.prototype.getObjects = function() {
  return this.Peers;
};


/**
 * Returns the peers for all chart objects within the chart.
 * @return {array}
 */
dvt.Chart.prototype.getChartObjPeers = function() {
  var chartObjPeers = [];
  for (var i = 0; i < this.Peers.length; i++) {
    if (this.Peers[i] instanceof DvtChartObjPeer)
      chartObjPeers.push(this.Peers[i]);
  }
  return chartObjPeers;
};

/**
 * Returns the peers for all reference objects within the chart.
 * @return {array}
 */
dvt.Chart.prototype.getRefObjPeers = function() {
  var refObjPeers = [];
  for (var i = 0; i < this.Peers.length; i++) {
    if (this.Peers[i] instanceof DvtChartRefObjPeer)
      refObjPeers.push(this.Peers[i]);
  }
  return refObjPeers;
};


/**
 * Returns the peer specified by the seriesIndex and groupIndex.
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {DvtChartObjPeer}
 */
dvt.Chart.prototype.getObject = function(seriesIndex, groupIndex) {
  for (var i = 0; i < this.Peers.length; i++) {
    if (this.Peers[i] instanceof DvtChartObjPeer && this.Peers[i].getSeriesIndex() == seriesIndex && this.Peers[i].getGroupIndex() == groupIndex)
      return this.Peers[i];
  }
  return null;
};

/**
 * @return {number} chart width
 */
dvt.Chart.prototype.getWidth = function() {
  return this.Width;
};


/**
 * @return {number} chart height
 */
dvt.Chart.prototype.getHeight = function() {
  return this.Height;
};



/**
 * Returns the array containing unique series ids.  This array is used
 * to maintain default styles for each unique series.
 * @return {array}
 */
dvt.Chart.prototype.getSeriesStyleArray = function() {
  return this.SeriesStyleArray;
};


/**
 * Returns the plot area container.
 * @return {dvt.Container}  the plot area container.
 */
dvt.Chart.prototype.getPlotArea = function() {
  return this._plotArea;
};


/**
 * Sets the plot area container.
 * @param {dvt.Container} plot  the plot area container.
 */
dvt.Chart.prototype.setPlotArea = function(plot) {
  this._plotArea = plot;
};


/**
 * Returns the type of this chart, such as "bar" or "scatter".
 * @return {string}
 */
dvt.Chart.prototype.getType = function() {
  return this.getOptions()['type'];
};


/**
 * Returns the skin of this chart.
 * @return {string}
 */
dvt.Chart.prototype.getSkin = function() {
  return this.getOptions()['skin'];
};


/**
 * Returns the scale factor for gap widths on this chart.
 * @return {number}
 */
dvt.Chart.prototype.getGapWidthRatio = function() {
  // If defined in the options, use that instead
  var options = this.getOptions();
  if (options['layout']['gapWidthRatio'] !== null)
    return options['layout']['gapWidthRatio'];
  else
    return Math.min(this.Width / 400, 1);
};

/**
 * Returns the scale factor for gap heights on this chart.
 * @return {number}
 */
dvt.Chart.prototype.getGapHeightRatio = function() {
  // If defined in the options, use that instead
  var options = this.getOptions();
  if (options['layout']['gapHeightRatio'] !== null)
    return options['layout']['gapHeightRatio'];
  else
    return Math.min(this.Height / 300, 1);
};


/**
 * Returns the selection handler for the graph.
 * @return {dvt.SelectionHandler} The selection handler for the graph
 */
dvt.Chart.prototype.getSelectionHandler = function() {
  return this._selectionHandler;
};


/**
 * Returns whether selecton is supported on the graph.
 * @return {boolean} True if selection is turned on for the graph and false otherwise.
 */
dvt.Chart.prototype.isSelectionSupported = function() {
  return (this._selectionHandler ? true : false);
};


/**
 * Returns the array of DvtShowPopupBehaviors for the given stamp id.
 * @param {string} stampId The id of the stamp containing the showPopupBehaviors.
 * @return {array} The array of showPopupBehaviors.
 */
dvt.Chart.prototype.getShowPopupBehaviors = function(stampId) {
  return this._popupBehaviors ? this._popupBehaviors[stampId] : null;
};


//---------------------------------------------------------------------//
// Ordering Support: ZOrderManager impl                                //
//---------------------------------------------------------------------//

/**
 * @override
 */
dvt.Chart.prototype.bringToFrontOfSelection = function(detObj)
{
  var par = detObj.getParent();
  if (par) {
    var parentChildCount = par.getNumChildren();

    if (parentChildCount - this._numFrontObjs > 1) {
      par.removeChild(detObj);
      var newIndex = parentChildCount - this._numFrontObjs - 1;
      par.addChildAt(detObj, newIndex);
    }
  }

  //if the object is not both selected and selecting then
  //increment the counter (otherwise the object is already
  //represented in the counter)
  if (!detObj.isSelected() || !detObj.isHoverEffectShown())
    this._numSelectedObjsInFront++;

};

/**
 * @override
 */
dvt.Chart.prototype.pushToBackOfSelection = function(detObj)
{
  //decrement the counter
  if (this._numSelectedObjsInFront > 0)
    this._numSelectedObjsInFront--;

  //move the object to the first z-index before the selected objects
  var par = detObj.getParent();
  if (par) {
    var parentChildCount = par.getNumChildren();
    var newIndex = parentChildCount - this._numFrontObjs - 1 - this._numSelectedObjsInFront;
    if (newIndex >= 0) {
      par.removeChild(detObj);
      par.addChildAt(detObj, newIndex);
    }
  }
};

/**
 * @override
 */
dvt.Chart.prototype.setNumFrontObjs = function(num)
{
  this._numFrontObjs = num;
};


/**
 * @override
 */
dvt.Chart.prototype.getShapesForViewSwitcher = function(bOld) {
  var shapes = {};

  if (this._currentMarkers && this.Peers) {
    for (var i = 0; i < this._currentMarkers.length; i++) {
      var arMarkers = this._currentMarkers[i];
      if (arMarkers) {
        for (var j = 0; j < arMarkers.length; j++) {
          var marker = arMarkers[j];
          if (!marker) {
            continue; //j loop
          }
          //find the peer associated with this marker in order to get the id
          for (var k = 0; k < this.Peers.length; k++) {
            var peer = this.Peers[k];
            var peerDisplayables = peer.getDisplayables();
            if (peerDisplayables && peerDisplayables.length > 0) {
              if (peerDisplayables[0] == marker) {
                var chartDataItem = peer.getId();
                if (chartDataItem) {
                  var id = chartDataItem.getId();
                  if (id) {
                    shapes[id] = marker;
                    break; //out of k loop
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  else if (this.pieChart) {
    shapes = this.pieChart.getShapesForViewSwitcher(bOld);
  }

  return shapes;
};


/**
 * Sets the chart viewport and rerender the axis and plot area.
 * @param {dvt.Rectangle} bounds An object containing the xMin, xMax, yMin, yMax of the new viewport.
 * @param {boolean} actionDone Whether the animation is done, so that the chart should be fully rendered.
 * @private
 */
dvt.Chart.prototype._setViewport = function(bounds, actionDone) {
  if (bounds.xMax != null)
    this.Options['xAxis']['viewportMax'] = bounds.xMax;
  if (bounds.xMin != null)
    this.Options['xAxis']['viewportMin'] = bounds.xMin;

  if (DvtChartTypeUtils.isBLAC(this)) {
    this.Options['xAxis']['viewportStartGroup'] = null;
    this.Options['xAxis']['viewportEndGroup'] = null;

    // Turn off initial zooming after pan/zoom
    this.Options['_initialZoomed'] = false;
  }
  else {
    if (bounds.yMax != null)
      this.Options['yAxis']['viewportMax'] = bounds.yMax;
    if (bounds.yMin != null)
      this.Options['yAxis']['viewportMin'] = bounds.yMin;
  }

  this.Options['_duringAnimation'] = !actionDone;
  DvtChartRenderer.rerenderAxisAndPlotArea(this, this._container);
};


/**
 * Sets the scrollbar viewport.
 * @param {dvt.Rectangle} bounds An object containing the xMin, xMax, yMin, yMax of the new viewport.
 * @private
 */
dvt.Chart.prototype._setScrollbarViewport = function(bounds) {
  if (this.xAxis && bounds.xMin != null && bounds.xMax != null) {
    var xMin = this.xAxis.actualToLinear(bounds.xMin);
    var xMax = this.xAxis.actualToLinear(bounds.xMax);
    if (this.overview)
      this.overview.setViewportRange(xMin, xMax);
    if (this.xScrollbar)
      this.xScrollbar.setViewportRange(xMin, xMax);
  }

  if (this.yAxis && bounds.yMin != null && bounds.yMax != null) {
    var yMin = this.yAxis.actualToLinear(bounds.yMin);
    var yMax = this.yAxis.actualToLinear(bounds.yMax);
    if (this.yScrollbar)
      this.yScrollbar.setViewportRange(yMin, yMax);
  }
};


/**
 * Sets the space for the axis and the plot area.
 * @param {dvt.Rectangle} space
 */
dvt.Chart.prototype.__setAxisSpace = function(space) {
  this._axisSpace = space;

  // Set the polar chart radius
  var maxWidth, maxHeight;
  if (DvtChartAxisUtils.isAxisRendered(this, 'x')) {
    maxWidth = space.w * 0.8;
    maxHeight = space.h - 4 * DvtChartAxisUtils.getTickLabelHeight(this, 'x');
  }
  else if (DvtChartAxisUtils.isAxisRendered(this, 'y')) {
    maxWidth = space.w;
    maxHeight = space.h - DvtChartAxisUtils.getTickLabelHeight(this, 'y');
  }
  else {
    maxWidth = space.w;
    maxHeight = space.h;
  }
  this._radius = Math.min(maxWidth, maxHeight) / 2;
};


/**
 * Gets the space for the axis and the plot area.
 * @return {dvt.Rectangle} space
 */
dvt.Chart.prototype.__getAxisSpace = function() {
  return this._axisSpace;
};


/**
 * Sets the space for the plot area.
 * @param {dvt.Rectangle} space
 */
dvt.Chart.prototype.__setPlotAreaSpace = function(space) {
  this._plotAreaSpace = space;
};


/**
 * Gets the space for the plot area.
 * @return {dvt.Rectangle} space
 */
dvt.Chart.prototype.__getPlotAreaSpace = function() {
  return this._plotAreaSpace;
};


/**
 * Sets the container of the chart area shapes.
 * @param {dvt.Container} container
 */
dvt.Chart.prototype.__setAreaContainer = function(container) {
  this._areaContainer = container;
};


/**
 * Gets the container of the chart area shapes.
 * @return {dvt.Container} container
 */
dvt.Chart.prototype.__getAreaContainer = function() {
  return this._areaContainer;
};


/**
 * Returns the radius of a polar chart.
 * @return {number} Polar chart radius.
 */
dvt.Chart.prototype.getRadius = function() {
  return this._radius;
};


/**
 * Shows the drag buttons.
 */
dvt.Chart.prototype.showDragButtons = function() {
  if (this.dragButtons)
    this.dragButtons.setVisible(true);
};

/**
 * Hides the drag buttons.
 */
dvt.Chart.prototype.hideDragButtons = function() {
  if (this.dragButtons)
    this.dragButtons.setVisible(false);
};

/**
 * Adds a data label to the internal list of labels to help with animation.
 * @param {dvt.OutputText} label
 */
dvt.Chart.prototype.addDataLabel = function(label) {
  this.getDataLabels().push(label);
};

/**
 * Provides the list of data labels so they can be animated.
 * @return {array} data labels in this chart
 */
dvt.Chart.prototype.getDataLabels = function() {
  if (!this._dataLabels)
    this._dataLabels = [];
  return this._dataLabels;
};

/**
 * Cache the chart focus so it's not lost on rerender.
 * @return {object} Object containing the chart, legend and axis focus
 */
dvt.Chart.prototype.__cacheChartFocus = function() {
  // Store the current chart and legend keyboard focus.
  var chartFocus = this.EventManager.getFocus();
  if (chartFocus)
    var chartShowingFocusEffect = chartFocus.isShowingKeyboardFocusEffect();
  if (this.xAxis) {
    var axisFocus = this.xAxis.getKeyboardFocus();
    if (axisFocus)
      var axisShowingFocusEffect = axisFocus.isShowingKeyboardFocusEffect();
  }
  if (this.legend) {
    var legendFocus = this.legend.getKeyboardFocus();
    if (legendFocus)
      var legendShowingFocusEffect = legendFocus.isShowingKeyboardFocusEffect();
  }
  return {chartFocus: chartFocus, chartShowingFocusEffect: chartShowingFocusEffect, axisFocus: axisFocus, axisShowingFocusEffect: axisShowingFocusEffect,
    legendFocus: legendFocus, legendShowingFocusEffect: legendShowingFocusEffect};
};

/**
 * Restore the chart focus
 * @param {object} focusState Object containing the chart, legend and axis focus
 */
dvt.Chart.prototype.__restoreChartFocus = function(focusState) {
  if (DvtChartTypeUtils.isOverview(this) || DvtChartTypeUtils.isSpark(this)) {
    return;
  }

  // Initialize the keyboard focus array with the new axis and legend
  var keyboardArray = [this];
  if (this.xAxis && this.xAxis.isNavigable())
    keyboardArray.push(this.xAxis);
  if (this.legend && this.legend.isNavigable())
    keyboardArray.push(this.legend);
  this.getCtx().setKeyboardFocusArray(keyboardArray);

  // Restore the keyboard focus after rerendering.
  if (focusState.chartFocus) {
    var navigables = DvtChartEventUtils.getKeyboardNavigables(this);
    var matchFound = false;
    for (var i = 0; i < navigables.length; i++) {
      var id = navigables[i].getId();
      if (id instanceof DvtChartDataItem && id.equals(focusState.chartFocus.getId())) {
        this.EventManager.setFocusObj(navigables[i]);
        if (focusState.chartShowingFocusEffect)
          navigables[i].showKeyboardFocusEffect();
        matchFound = true;
        break;
      }
    }
    if (!matchFound)
      this.EventManager.setFocusObj(this.EventManager.getKeyboardHandler().getDefaultNavigable(navigables));
  }
  if (focusState.axisFocus) {
    this.xAxis.setKeyboardFocus(focusState.axisFocus, focusState.axisShowingFocusEffect);
    if (focusState.axisShowingFocusEffect)
      this.getCtx().setCurrentKeyboardFocus(this.xAxis);
  }
  if (focusState.legendFocus) {
    this.legend.setKeyboardFocus(focusState.legendFocus, focusState.legendShowingFocusEffect);
    if (focusState.legendShowingFocusEffect)
      this.getCtx().setCurrentKeyboardFocus(this.legend);
  }
};

/**
 * Returns the user options before being processed and used to create the chart.
 * @return {object} User options.
 */
dvt.Chart.prototype.getRawOptions = function() {
  return this._rawOptions;
};
// Active Data Support for Charts
/**
 * Processes an array of active data changes and updates the component.
 * @param {array} changes The array of active data changes.
 */
dvt.Chart.prototype.processActiveDataChanges = function(changes) {
  // Clone the options object to store a copy of the old data
  var optionsOld = dvt.JsonUtils.clone(this.Options);
  var optionsNew = this.Options;

  // Iterate through the list of changes and apply all of them
  for (var changeIndex = 0; changeIndex < changes.length; changeIndex++) {
    this._processActiveDataChange(changes[changeIndex]);
  }

  // Re-render the component: First restore the old options object so that data change indicators can be calculated.
  this.Options = optionsOld;
  this.render(optionsNew);
};

/**
 * Processes a single active data change entry and updates the options object with the data change.
 * @param {object} entry
 * @private
 */
dvt.Chart.prototype._processActiveDataChange = function(entry) {
  var type = entry['type'];
  if (type == 'u')// Update
    this._processActiveDataUpdate(entry);
  else if (type == 'ia' || type == 'ib')// Insert After or Insert Before
    this._processActiveDataInsert(entry);
  else if (type == 'd')// Delete
    this._processActiveDataDelete(entry);
};

/**
 * Processes a single active data update and updates the options object with the data change.
 * @param {object} entry
 * @private
 */
dvt.Chart.prototype._processActiveDataUpdate = function(entry) {
  var data = entry['data'];
  for (var i = 0; i < data.length; i++) {
    var dataItemInfo = this._findDataItemById(entry['id'], data[i]['_id']);
    if (dataItemInfo) {
      // Data Item Found: Iterate thorugh and update all properties
      for (var key in data[i]) {
        if (key == '_id')
          continue;

        dataItemInfo.item[key] = data[i][key];
      }
    }
  }
};

/**
 * Processes a single active data insert and updates the options object with the data change.
 * @param {object} entry
 * @private
 */
dvt.Chart.prototype._processActiveDataInsert = function(entry) {
  var data = entry['data'];
  for (var i = 0; i < data.length; i++) {
    this.clearCache();
    var insertId = entry['insertId'];
    var insertedGroup = data[i]['group'];
    var insertedSeries = data[i]['series'];
    var seriesCount = DvtChartDataUtils.getSeriesCount(this);
    var groupCount = DvtChartDataUtils.getGroupCount(this);

    // Group names are required to be unique. If the series and group already exist, overwrite existing data item.
    var insertedSeriesIndex = DvtChartDataUtils.getSeriesIndex(this, insertedSeries);
    var insertedGroupIndex = DvtChartDataUtils.getGroupIndex(this, insertedGroup);
    if (insertedSeriesIndex >= 0 && insertedGroupIndex >= 0) {
      // Insert into existing series and existing group.
      var seriesItems = DvtChartDataUtils.getSeriesItem(this, insertedSeriesIndex)['items'];
      seriesItems[insertedGroupIndex] = {
        'id': entry['id']
      };
      dvt.Chart._copyActiveDataProperties(data[i], seriesItems[insertedGroupIndex]);
    }
    else if (insertedGroupIndex >= 0) {
      // Insert into existing group, but new series.  The new series is automatically placed at the end, as this is
      // not a real use case and it's impossible to determine the correct order.
      var items = new Array(groupCount);
      items[insertedGroupIndex] = {
        'id': entry['id']
      };
      dvt.Chart._copyActiveDataProperties(data[i], items[insertedGroupIndex]);
      this.Options['series'].push({
        'name' : insertedSeries, 'items' : items
      });
    }
    else {
      // Insert into new group.  Position based on insertId and type of entry (after or before)
      var dataItemInfo = this._findDataItemById(insertId);
      if (dataItemInfo)
        insertedGroupIndex = (entry['type'] == 'ia') ? dataItemInfo.groupIndex + 1 : dataItemInfo.groupIndex;
      else
        insertedGroupIndex = 0;

      // Create the series if needed
      if (insertedSeriesIndex < 0) {
        this.Options['series'].push({
          'name' : insertedSeries, 'items' : new Array(groupCount)
        });
        insertedSeriesIndex = seriesCount;
        seriesCount++;
      }

      // Insert a placeholder data item for the group for each series
      for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
        var seriesItems = DvtChartDataUtils.getSeriesItem(this, seriesIndex)['items'];
        seriesItems.splice(insertedGroupIndex, 0,
            {
              'id': entry['id']
            });

        // Insert the data item into the new series
        if (seriesIndex == insertedSeriesIndex)
          dvt.Chart._copyActiveDataProperties(data[i], seriesItems[insertedGroupIndex]);
      }

      // Insert the group
      this.Options['groups'].splice(insertedGroupIndex, 0, insertedGroup);
    }
  }
};

/**
 * Processes a single active data delete and updates the options object with the data change.
 * @param {object} entry
 * @private
 */
dvt.Chart.prototype._processActiveDataDelete = function(entry) {
  this.clearCache();
  var dataItemInfo = this._findDataItemById(entry['id']);
  if (dataItemInfo) {
    var dataItem;

    // Mark the data item for deletion
    for (var key in dataItemInfo.item) {
      dataItemInfo.item[key] = null;
    }
    dataItemInfo.item['_deleted'] = true;

    // Check if series or groups should be removed altogether
    var seriesCount = DvtChartDataUtils.getSeriesCount(this);
    var groupCount = DvtChartDataUtils.getGroupCount(this);

    // If this is the only undeleted point in the group, then delete the group.
    var bDeleteGroup = true;
    for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
      dataItem = DvtChartDataUtils.getDataItem(this, seriesIndex, dataItemInfo.groupIndex);
      if (dataItem && !dataItem['_deleted']) {
        bDeleteGroup = false;
        break;
      }
    }

    // If this is the only undeleted point in the group, then delete the group.
    var bDeleteSeries = true;
    for (var groupIndex = 0; groupIndex < groupCount; groupIndex++) {
      dataItem = DvtChartDataUtils.getDataItem(this, dataItemInfo.seriesIndex, groupIndex);
      if (dataItem && !dataItem['_deleted']) {
        bDeleteSeries = false;
        break;
      }
    }

    // Delete the group if necessary
    if (bDeleteGroup) {
      // Remove the data item for the group from each series
      for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
        var seriesItems = DvtChartDataUtils.getSeriesItem(this, seriesIndex).items;
        seriesItems.splice(dataItemInfo.groupIndex, 1);
      }

      // Remove the group from the groups list
      this.Options['groups'].splice(dataItemInfo.groupIndex, 1);
    }

    // Delete the series if necessary
    if (bDeleteSeries)
      this.Options['series'].splice(dataItemInfo.seriesIndex, 1);

    // recursively delete item with different stamp ids
    this._processActiveDataDelete(entry);
  }
};

/**
 * Copies the properties from the active data change entry into the specified data item.
 * @param {object} entry
 * @param {object} item
 * @private
 */
dvt.Chart._copyActiveDataProperties = function(entry, item) {
  for (var key in entry) {
    item[key] = entry[key];
  }
};

/**
 * Returns an object with properties item, seriesIndex, and groupIndex corresponding to the specified data item id.
 * Returns null if no data item with matching id is found.
 * @param {object} id The id of the data item.
 * @param {object} stampId The id of the stamp used to generate the data item.
 * @return {object}
 * @private
 */
dvt.Chart.prototype._findDataItemById = function(id, stampId) {
  // No match if id is invalid
  if (id == null)
    return null;

  // Loop through all data items until correct id is found.
  var seriesCount = DvtChartDataUtils.getSeriesCount(this);
  var groupCount = DvtChartDataUtils.getGroupCount(this);
  for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
    for (var groupIndex = 0; groupIndex < groupCount; groupIndex++) {
      var dataItem = DvtChartDataUtils.getDataItem(this, seriesIndex, groupIndex);
      if (dataItem != null && dataItem['id'] === id && (stampId == null || stampId === dataItem['_id']))
        return {item: dataItem, seriesIndex: seriesIndex, groupIndex: groupIndex};
    }
  }

  // Return null if no match found
  return null;
};
/**
 *  Provides automation services for a DVT component.
 *  @class DvtChartAutomation
 *  @param {dvt.Chart} dvtComponent
 *  @implements {dvt.Automation}
 *  @constructor
 */
var DvtChartAutomation = function(dvtComponent) {
  this._chart = dvtComponent;
  this._options = this._chart.getOptions();
  this._legend = this._chart.legend;
  this._xAxis = this._chart.xAxis;
  this._yAxis = this._chart.yAxis;
  this._y2Axis = this._chart.y2Axis;

  this._legendAutomation = this._legend ? this._legend.getAutomation() : null;
  this._xAxisAutomation = this._xAxis ? this._xAxis.getAutomation() : null;
  this._yAxisAutomation = this._yAxis ? this._yAxis.getAutomation() : null;
  this._y2AxisAutomation = this._y2Axis ? this._y2Axis.getAutomation() : null;
};

dvt.Obj.createSubclass(DvtChartAutomation, dvt.Automation);


/**
 * Valid subIds inlcude:
 * <ul>
 * <li>dataItem[seriesIndex][itemIndex]</li>
 * <li>series[seriesIndex] / legend:section[sectionIndex]:item[itemIndex]</li>
 * <li>group[groupIndex0]...[groupIndexN]</li>
 * <li>axis["axisType"]:title</li>
 * <li>axis["axisType"]:referenceObject[index]</li>
 * </ul>
 * @override
 */
DvtChartAutomation.prototype.GetSubIdForDomElement = function(displayable) {
  var axisSubId = null;
  if (displayable.isDescendantOf(this._xAxis)) {
    axisSubId = this._xAxisAutomation.GetSubIdForDomElement(displayable);
    return this._convertAxisSubIdToChartSubId(axisSubId, 'xAxis');
  }
  else if (displayable.isDescendantOf(this._yAxis)) {
    axisSubId = this._yAxisAutomation.GetSubIdForDomElement(displayable);
    return this._convertAxisSubIdToChartSubId(axisSubId, 'yAxis');
  }
  else if (displayable.isDescendantOf(this._y2Axis)) {
    axisSubId = this._y2AxisAutomation.GetSubIdForDomElement(displayable);
    return this._convertAxisSubIdToChartSubId(axisSubId, 'y2Axis');
  }
  else if (displayable.isDescendantOf(this._legend)) {
    var legendSubId = this._legendAutomation.GetSubIdForDomElement(displayable);
    return this._convertLegendSubIdToChartSubId(legendSubId);
  }
  else {
    var logicalObj = this._chart.getEventManager().GetLogicalObject(displayable);
    if (logicalObj && this._options['type'] == 'pie') // pie charts do not use ChartObjPeer and return only dataItem[seriesIndex]
      return 'dataItem[' + logicalObj.getSeriesIndex() + ']';

    if (logicalObj instanceof DvtChartObjPeer) { // Chart data items
      var seriesIndex = logicalObj.getSeriesIndex();
      var itemIndex = logicalObj.getGroupIndex(); // corresponds to data items position in its series array

      if (seriesIndex != null && itemIndex >= 0 && this._options['type'] != 'funnel')
        return 'dataItem[' + seriesIndex + '][' + itemIndex + ']';
      else if (seriesIndex != null && itemIndex == DvtChartFunnelRenderer._GROUP_INDEX && this._options['type'] == 'funnel')
        return 'dataItem[' + seriesIndex + ']';  // funnel chart only returns dataItem[seriesIndex]
      else if (seriesIndex != null && (itemIndex == null || itemIndex < 0)) // displayable represents a seriesItem e.g. line, area
        return 'series[' + seriesIndex + ']';
    }
    else if (logicalObj instanceof DvtChartRefObjPeer) { // reference objects
      var axisType = logicalObj.getAxisType();
      var refObjIndex = logicalObj.getIndex();
      return (axisType && refObjIndex >= 0) ? axisType + ':referenceObject[' + refObjIndex + ']' : null;
    }
  }
  return null;
};


/**
 * Takes the subId for a legend item and converts it to a valid subId for chart legends
 * @param {String} subId for legend
 * @return {String} series[seriesIndex] / legend:section[sectionIndex]:item[itemIndex]
 * @private
 */
DvtChartAutomation.prototype._convertLegendSubIdToChartSubId = function(subId) {
  // Get the legend item that corresponds to the legend subId
  var legendOptions = this._legend.getOptions();
  var legendItem = this._legendAutomation.getLegendItem(legendOptions, subId);
  if (legendItem) {
    // Get index of series item that has same name as legend items's text
    for (var s = 0; s < this._options['series'].length; s++) {
      var series = this._options['series'][s];
      if (series['name'] == legendItem['text'])
        return 'series[' + s + ']';
    }
    // legend item is not associated with a series
    return 'legend:' + subId;
  }
  return null;
};

/**
 * Takes the subId for an axis item and converts it to a valid subId for chart axes
 * @param {String} subId for returned by the axis
 * @param {String=} axisType The axisType
 * @return {String} group[groupIndex0]...[groupIndexN] or axis["axisType"]:title
 * @private
 */
DvtChartAutomation.prototype._convertAxisSubIdToChartSubId = function(subId, axisType) {
  if (subId == 'title' && axisType)
    return axisType + ':' + subId;
  else {
    // Take item[groupIndex0]...[groupIndexN] string and return group[groupIndex0]...[groupIndexN]
    var indexList = subId.substring(subId.indexOf('['));
    if (indexList)
      return 'group' + indexList;
  }

  return null;
};


/**
 * Valid subIds inlcude:
 * <ul>
 * <li>dataItem[seriesIndex][itemIndex]</li>
 * <li>series[seriesIndex] / legend:section[sectionIndex]:item[itemIndex]</li>
 * <li>group[groupIndex0]...[groupIndexN]</li>
 * <li>axis["axisType"]:title</li>
 * <li>axis["axisType"]:referenceObject[index]</li>
 * </ul>
 * @override
 */
DvtChartAutomation.prototype.getDomElementForSubId = function(subId) {
  // TOOLTIP
  if (subId == dvt.Automation.TOOLTIP_SUBID)
    return this.GetTooltipElement(this._chart, DvtChartTooltipUtils.isDataCursorEnabled(this._chart) ? DvtChartDataCursor.TOOLTIP_ID : null);

  // CHART ELEMENTS
  var openParen1 = subId.indexOf('[');
  var closeParen1 = subId.indexOf(']');
  var openParen2, closeParen2, logicalObj;
  var colon = subId.indexOf(':');

  if (openParen1 > 0 && closeParen1 > 0 || colon > 0) {

    var objType = (colon < 0) ? subId.substring(0, openParen1) : subId.substring(0, colon);

    // GROUP AXIS LABELS
    if (objType == 'group') {
      return this._xAxisAutomation.getDomElementForSubId(subId);
    }

    // LEGEND ITEMS
    if (objType == 'series') {
      subId = this._convertToLegendSubId(subId);
      return this._legendAutomation.getDomElementForSubId(subId);
    }
    else if (subId.substring(0, colon) == 'legend') {
      subId = subId.substring(colon + 1);
      return this._legendAutomation.getDomElementForSubId(subId);
    }

    var seriesIndex = subId.substring(openParen1 + 1, closeParen1);

    // AXIS TITLE & REFERENCE OBJECTS
    if (objType == 'xAxis' || objType == 'yAxis' || objType == 'y2Axis') {
      var axisObjectType = subId.substring(colon + 1);
      if (axisObjectType == 'title') { // subId for axis title
        if (objType == 'xAxis')
          return this._xAxisAutomation.getDomElementForSubId(axisObjectType);
        else if (objType == 'yAxis')
          return this._yAxisAutomation.getDomElementForSubId(axisObjectType);
        else if (objType == 'y2Axis')
          return this._y2AxisAutomation.getDomElementForSubId(axisObjectType);
      }
      else { // subId for axis reference objects
        openParen2 = axisObjectType.indexOf('[');
        closeParen2 = axisObjectType.indexOf(']');
        if (axisObjectType.substring(0, openParen2) == 'referenceObject') {
          var index = axisObjectType.substring(openParen2 + 1, closeParen2);
          logicalObj = this._getRefObjPeer(index);
          if (logicalObj)
            return logicalObj.getDisplayables()[0].getElem();
        }
      }
    }

    // CHART DATA ITEMS
    if (this._options['type'] == 'pie') {
      var pieSlice = this._chart.pieChart.getSliceDisplayable(seriesIndex);
      if (pieSlice)
        return pieSlice.getElem();
    }
    // If funnel chart set the default itemIndex, else parse it from the given subId
    if (this._options['type'] == 'funnel') {
      var itemIndex = DvtChartFunnelRenderer._GROUP_INDEX;
    }
    else {
      subId = subId.substring(closeParen1 + 1);
      openParen2 = subId.indexOf('[');
      closeParen2 = subId.indexOf(']');
      if (openParen2 >= 0 && closeParen2 >= 0) {
        itemIndex = subId.substring(openParen2 + 1, closeParen2);
      }
    }
    // Get the logical object and return the dom element of its associated displayable
    logicalObj = this._getChartObjPeer(seriesIndex, itemIndex);
    if (logicalObj)
      return logicalObj.getDisplayables()[0].getElem();

  }
  return null;
};


/**
 * Returns the DvtChartObjPeer for the given seriesIndex and itemIndex
 * @param {String} seriesIndex The seriesIndex for dataItem types
 * @param {String} itemIndex The itemIndex for dataItem types
 * @return {DvtChartObjPeer} The DvtChartObjPeer matching the parameters or null if none exists
 * @private
 */
DvtChartAutomation.prototype._getChartObjPeer = function(seriesIndex, itemIndex) {
  var peers = this._chart.getChartObjPeers();
  for (var i = 0; i < peers.length; i++) {
    var series = peers[i].getSeriesIndex();
    var item = peers[i].getGroupIndex(); // correspinds to the data item's position in its series array
    if (series == seriesIndex && item == itemIndex)
      return peers[i];
  }
  return null;
};


/**
 * Returns the DvtChartRefObjPeer for the given index
 * @param {String} index The index of the object in the referenceObjects array
 * @return {DvtChartObjPeer} The DvtChartRefObjPeer matching the index or null if none exists
 * @private
 */
DvtChartAutomation.prototype._getRefObjPeer = function(index) {
  var peers = this._chart.getRefObjPeers();
  for (var i = 0; i < peers.length; i++) {
    if (index == peers[i].getIndex())
      return peers[i];
  }
  return null;
};


/**
 * Takes the subId for a chart series and converts it to a valid subId for legend item
 * @param {String} subId series[seriesIndex]
 * @return {String} section[sectionIndex0]:item[itemIndex]
 * @private
 */
DvtChartAutomation.prototype._convertToLegendSubId = function(subId) {
  var openParen = subId.indexOf('[');
  var closeParen = subId.indexOf(']');
  var seriesIndex = subId.substring(openParen + 1, closeParen);

  var legendOptions = this._legend.getOptions();
  var series = this._options['series'][seriesIndex];

  var indices = this._legendAutomation.getIndicesFromSeries(series, legendOptions);
  return 'section' + indices;
};


/**
 * Returns an object containing data for a chart data item. Used for verification.
 * Valid verification values inlcude:
 * <ul>
 * <li>borderColor</li>
 * <li>color</li>
 * <li>label</li>
 * <li>targetValue</li>
 * <li>tooltip</li>
 * <li>value</li>
 * <li>open</li>
 * <li>close</li>
 * <li>high</li>
 * <li>low</li>
 * <li>volume</li>
 * <li>x</li>
 * <li>y</li>
 * <li>z</li>
 * <li>group</li>
 * <li>series</li>
 * <li>selected</li>
 * </ul>
 * @param {String} seriesIndex The seriesIndex for dataItem and series types, the itemIndex for group types
 * @param {String} itemIndex The itemIndex for dataItem types
 * @return {Object} An object containing data for the dataItem
 */
DvtChartAutomation.prototype.getDataItem = function(seriesIndex, itemIndex) {
  if (this._options['type'] == 'pie' || this._options['type'] == 'funnel')
    itemIndex = 0; //Not sure if neccessary but getDataItem will be null if itemIndex is null

  var dataItem = DvtChartDataUtils.getDataItem(this._chart, seriesIndex, itemIndex);

  if (dataItem) {
    return {
      'borderColor' : DvtChartStyleUtils.getBorderColor(this._chart, seriesIndex, itemIndex),
      'color' : DvtChartStyleUtils.getColor(this._chart, seriesIndex, itemIndex),
      'label' : DvtChartDataUtils.getDataLabel(this._chart, seriesIndex, itemIndex),
      'targetValue' : DvtChartDataUtils.getTargetValue(this._chart, seriesIndex, itemIndex),
      'tooltip' : DvtChartTooltipUtils.getDatatip(this._chart, seriesIndex, itemIndex, false),
      'value' : DvtChartDataUtils.getValue(this._chart, seriesIndex, itemIndex),
      'open': dataItem['open'],
      'close': dataItem['close'],
      'high': DvtChartDataUtils.getHighValue(this._chart, seriesIndex, itemIndex),
      'low': DvtChartDataUtils.getLowValue(this._chart, seriesIndex, itemIndex),
      'volume': dataItem['volume'],
      'x' : DvtChartDataUtils.getXValue(this._chart, seriesIndex, itemIndex),
      'y' : dataItem['y'],
      'z' : dataItem['z'],
      'min' : dataItem['min'],
      'max' : dataItem['max'],
      'group' : DvtChartDataUtils.getGroup(this._chart, itemIndex),
      'series' : DvtChartDataUtils.getSeries(this._chart, seriesIndex),
      'selected' : DvtChartDataUtils.isDataSelected(this._chart, seriesIndex, itemIndex)
    };
  }
  return null;
};

/**
 * Returns the group corresponding to the given index. Used for verification.
 * @param {String} itemIndex The index of the desired group
 * @return {String} The group corresponding to the given index
 */
DvtChartAutomation.prototype.getGroup = function(itemIndex) {
  return DvtChartDataUtils.getGroup(this._chart, itemIndex);
};

/**
 * Returns the name of the series corresponding to the given index. Used for verification.
 * @param {String} seriesIndex The index of the desired series
 * @return {String} the name of the series corresponding to the given index
 */
DvtChartAutomation.prototype.getSeries = function(seriesIndex) {
  return this._options['series'][seriesIndex]['name'];
};

/**
 * Returns the number of groups in the chart data. Used for verification.
 * @return {Number} The number of groups
 */
DvtChartAutomation.prototype.getGroupCount = function() {
  return DvtChartDataUtils.getGroupCount(this._chart);
};

/**
 * Returns the number of series in the chart data. Used for verification.
 * @return {Number} The number of series
 */
DvtChartAutomation.prototype.getSeriesCount = function() {
  return this._options['series'].length;
};

/**
 * Returns the chart title. Used for verification.
 * @return {String} The chart title
 */
DvtChartAutomation.prototype.getTitle = function() {
  return this._options['title']['text'];
};

/**
 * Returns an object that represents the legend data. Used for verification.
 * Valid verification values inlcude:
 * <ul>
 * <li>bounds</li>
 * <li>title</li>
 * </ul>
 * @return {Object} An object that represents the legend data
 */
DvtChartAutomation.prototype.getLegend = function() {
  var legendSpace = this._legend.__getBounds();
  var point = this._chart.localToStage(new dvt.Point(legendSpace.x, legendSpace.y));
  var legendBounds = {
    'x' : point.x,
    'y' : point.y,
    'width' : legendSpace.w,
    'height' : legendSpace.h
  };

  var legend = {
    'bounds' : legendBounds,
    'title' : this._legend.getOptions()['title']
  };

  return legend;
};

/**
 * Returns an object that represents the plot area data. Used for verification.
 * Valid verification values inlcude:
 * <ul>
 * <li>bounds</li>
 * </ul>
 * @return {Object} An object that represents the plot area data
 */
DvtChartAutomation.prototype.getPlotArea = function() {
  var plotAreaSpace = this._chart.__getPlotAreaSpace();

  var plotAreaBounds = {
    'x' : plotAreaSpace.x,
    'y' : plotAreaSpace.y,
    'width' : plotAreaSpace.w,
    'height' : plotAreaSpace.h
  };

  var plotArea = {
    'bounds' : plotAreaBounds
  };

  return plotArea;
};

/**
 * Returns an object that represents the xAxis data. Used for verification.
 * Valid verification values inlcude:
 * <ul>
 * <li>bounds</li>
 * <li>title</li>
 * </ul>
 * @return {Object} An object that represents the xAxis data
 */
DvtChartAutomation.prototype.getXAxis = function() {
  return this._getAxis('x');
};

/**
 * Returns an object that represents the yAxis data. Used for verification.
 * Valid verification values inlcude:
 * <ul>
 * <li>bounds</li>
 * <li>title</li>
 * </ul>
 * @return {Object} An object that represents the yAxis data
 */
DvtChartAutomation.prototype.getYAxis = function() {
  return this._getAxis('y');
};

/**
 * Returns an object that represents the y2Axis data. Used for verification.
 * Valid verification values inlcude:
 * <ul>
 * <li>bounds</li>
 * <li>title</li>
 * </ul>
 * @return {Object} An object that represents the y2Axis data
 */
DvtChartAutomation.prototype.getY2Axis = function() {
  return this._getAxis('y2');
};

/**
 * Returns an object that represents the axis data.
 * @param {string} type The axis type: x, y, or y2
 * @return {object} An object that represents the axis data
 * @private
 */
DvtChartAutomation.prototype._getAxis = function(type) {
  var axis = (type == 'x') ? this._xAxis : (type == 'y') ? this._yAxis : this._y2Axis;
  if (axis) {
    var axisSpace = axis.__getBounds();
    var stageCoord = axis.localToStage(new dvt.Point(axisSpace.x, axisSpace.y));
    var axisBounds = {
      'x' : stageCoord.x,
      'y' : stageCoord.y,
      'width' : axisSpace.w,
      'height' : axisSpace.h
    };

    var chart = this._chart;
    var getPreferredSize = function(width, height) {
      var axisOptions = axis.getOptions();
      var position = axisOptions['position'];
      var tickLabelGap = DvtChartAxisUtils.getTickLabelGapSize(chart, type);
      var outerGap = (DvtChartTypeUtils.isStandaloneXAxis(chart) || DvtChartTypeUtils.isStandaloneYAxis(chart) || DvtChartTypeUtils.isStandaloneY2Axis(chart)) ? 2 : 0;

      // the preferred size computed by the axis excludes tick label gap, so we have to subtract the gap
      // before passing to the axis, and add it again later
      var prefSize;
      if (position == 'top' || position == 'bottom') {
        prefSize = axis.getPreferredSize(axisOptions, width, height - tickLabelGap - outerGap);
        prefSize.h = Math.ceil(prefSize.h + tickLabelGap + outerGap);
      }
      else {
        prefSize = axis.getPreferredSize(axisOptions, width - tickLabelGap - outerGap, height);
        prefSize.w = Math.ceil(prefSize.w + tickLabelGap + outerGap);
      }
      return {'width': prefSize.w, 'height': prefSize.h};
    };

    var axisObj = {
      'bounds' : axisBounds,
      'title' : this._options[type + 'Axis']['title'],
      'getPreferredSize': getPreferredSize
    };
    return axisObj;
  }

  return null;
};

/**
 * @override
 */
dvt.Automation.prototype.IsTooltipElement = function(domElement) {
  var id = domElement.getAttribute('id');
  if (id && (id.indexOf(DvtChartDataCursor.TOOLTIP_ID) == 0 || id.indexOf(dvt.HtmlTooltipManager._TOOLTIP_DIV_ID) == 0))
    return true;
  return false;
};


dvt.Bundle.addDefaultStrings(dvt.Bundle.CHART_PREFIX, {
  'DEFAULT_GROUP_NAME': 'Group {0}',

  'LABEL_SERIES': 'Series',
  'LABEL_GROUP': 'Group',
  'LABEL_VALUE': 'Value',
  'LABEL_TARGET_VALUE': 'Target',
  'LABEL_X': 'X',
  'LABEL_Y': 'Y',
  'LABEL_Z': 'Z',
  'LABEL_PERCENTAGE': 'Percentage',
  'LABEL_MIN': 'Min',
  'LABEL_MAX': 'Max',
  'LABEL_HIGH': 'High',
  'LABEL_LOW': 'Low',
  'LABEL_OPEN': 'Open',
  'LABEL_CLOSE': 'Close',
  'LABEL_VOLUME': 'Volume',

  'LABEL_OTHER': 'Other',
  'MARQUEE_SELECT': 'Marquee select',
  'MARQUEE_ZOOM': 'Marquee zoom',
  'PAN': 'Pan'
});

/**
 * Event Manager for dvt.Chart.
 * @param {dvt.Chart} chart
 * @class
 * @extends {dvt.EventManager}
 * @constructor
 */
var DvtChartEventManager = function(chart) {
  DvtChartEventManager.superclass.Init.call(this, chart.getCtx(), chart.processEvent, chart);
  this._chart = chart;

  this._dragMode = null;
  this._dragButtonsVisible = dvt.Agent.isTouchDevice();

  /**
   * The pan button
   * @type {dvt.Button}
   */
  this.panButton = null;
  /**
   * The marquee zoom button
   * @type {dvt.Button}
   */
  this.zoomButton = null;
  /**
   * The marquee select button
   * @type {dvt.Button}
   */
  this.selectButton = null;

  // Event handlers
  this._dataCursorHandler = null;
  this._panZoomHandler = null;
  this._marqueeZoomHandler = null;
  this._marqueeSelectHandler = null;

  // Cached stage absolute position
  this._stageAbsolutePosition = null;
};

dvt.Obj.createSubclass(DvtChartEventManager, dvt.EventManager);

/** @const */
DvtChartEventManager.DRAG_MODE_PAN = 'pan';
/** @const */
DvtChartEventManager.DRAG_MODE_ZOOM = 'zoom';
/** @const */
DvtChartEventManager.DRAG_MODE_SELECT = 'select';
/** @const */
DvtChartEventManager.DRAG_MODE_OFF = 'off';

/**
 * @override
 */
DvtChartEventManager.prototype.addListeners = function(displayable) {
  dvt.SvgDocumentUtils.addDragListeners(this._chart, this._onDragStart, this._onDragMove, this._onDragEnd, this);
  DvtChartEventManager.superclass.addListeners.call(this, displayable);

  if (!dvt.Agent.isTouchDevice()) {
    displayable.addEvtListener(dvt.MouseEvent.MOUSEWHEEL, this.OnMouseWheel, false, this);
  }

};


/**
 * @override
 */
DvtChartEventManager.prototype.removeListeners = function(displayable) {
  DvtChartEventManager.superclass.removeListeners.call(this, displayable);
  if (!dvt.Agent.isTouchDevice()) {
    displayable.removeEvtListener(dvt.MouseEvent.MOUSEWHEEL, this.OnMouseWheel, false, this);
  }
};

/**
 * Returns the logical object corresponding to the specified dvt.Displayable.  All high level event handlers,
 * such as the selection and popup handlers, are designed to react to the logical objects.
 * @param {dvt.Displayable} target The displayable.
 * @return {object} The logical object corresponding to the target.
 */
DvtChartEventManager.prototype.getLogicalObject = function(target) {
  return this.GetLogicalObject(target, true);
};


/**
 * Return the relative position relative to the stage, based on the cached stage absolute position.
 * @param {number} pageX
 * @param {number} pageY
 * @return {dvt.Point} The relative position.
 * @private
 */
DvtChartEventManager.prototype._getRelativePosition = function(pageX, pageY) {
  if (!this._stageAbsolutePosition)
    this._stageAbsolutePosition = this._context.getStageAbsolutePosition();

  return new dvt.Point(pageX - this._stageAbsolutePosition.x, pageY - this._stageAbsolutePosition.y);
};


/**
 * Returns an event handler for the current drag mode.
 * @param {dvt.Point} relPos (optional) The current cursor position relative to the stage. If provided, the relPos will
 *    be considered in choosing the drag handler.
 * @return {dvt.MarqueeHandler or dvt.PanZoomHandler} Drag handler.
 * @private
 */
DvtChartEventManager.prototype._getDragHandler = function(relPos) {
  if (relPos && this._chart.getOptions()['dragMode'] == 'user' && DvtChartTypeUtils.isBLAC(this._chart) &&
      (this._dragMode == DvtChartEventManager.DRAG_MODE_PAN || this._dragMode == DvtChartEventManager.DRAG_MODE_ZOOM)) {
    // For BLAC chart on desktop, the pan and zoom modes are combined.
    // If the drag starts inside the plot area, it's a pan. If the drag starts inside the axis, it's a marquee zoom.
    if (this._panZoomHandler.isWithinBounds(relPos))
      this._dragMode = DvtChartEventManager.DRAG_MODE_PAN;
    else
      this._dragMode = DvtChartEventManager.DRAG_MODE_ZOOM;
  }

  if (this._dragMode == DvtChartEventManager.DRAG_MODE_PAN)
    return this._panZoomHandler;
  if (this._dragMode == DvtChartEventManager.DRAG_MODE_ZOOM)
    return this._marqueeZoomHandler;
  if (this._dragMode == DvtChartEventManager.DRAG_MODE_SELECT)
    return this._marqueeSelectHandler;
  return null;
};


/**
 * Drag start callback.
 * @param {dvt.BaseEvent} event
 * @return {boolean} Whether drag is initiated.
 * @private
 */
DvtChartEventManager.prototype._onDragStart = function(event) {
  if (dvt.Agent.isTouchDevice())
    return this._onTouchDragStart(event);
  else
    return this._onMouseDragStart(event);
};


/**
 * Drag move callback.
 * @param {dvt.BaseEvent} event
 * @return {boolean}
 * @private
 */
DvtChartEventManager.prototype._onDragMove = function(event) {
  if (dvt.Agent.isTouchDevice())
    return this._onTouchDragMove(event);
  else
    return this._onMouseDragMove(event);
};


/**
 * Drag end callback.
 * @param {dvt.BaseEvent} event
 * @return {boolean}
 * @private
 */
DvtChartEventManager.prototype._onDragEnd = function(event) {
  if (dvt.Agent.isTouchDevice())
    return this._onTouchDragEnd(event);
  else
    return this._onMouseDragEnd(event);
};


/**
 * Mouse drag start callback.
 * @param {dvt.BaseEvent} event
 * @return {boolean} Whether drag is initiated.
 * @private
 */
DvtChartEventManager.prototype._onMouseDragStart = function(event) {
  var relPos = this._getRelativePosition(event.pageX, event.pageY);
  var dragHandler = this._getDragHandler(relPos);
  var chartEvent;

  // Do not initiate drag if the target is selectable. Drag only on left click.
  var obj = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));
  var selectable = obj && obj.isSelectable && obj.isSelectable();
  if (!selectable && event.button == 0 && dragHandler) {
    chartEvent = dragHandler.processDragStart(relPos, event.ctrlKey);
    if (chartEvent)
      this._callback.call(this._callbackObj, chartEvent);

    this._chart.setCursor(dragHandler.getCursor(relPos));
    this.setDragButtonsVisible(false); // hide drag buttons on drag

    // Ensure the chart is currently focused so that it can accept cancel events
    if (this._chart != this.getCtx().getCurrentKeyboardFocus())
      this.getCtx().setCurrentKeyboardFocus(this._chart);
  }

  if (chartEvent) {
    if (this._dataCursorHandler)
      this._dataCursorHandler.processEnd();
    return true;
  }
  return false;
};


/**
 * Mouse drag move callback.
 * @param {dvt.BaseEvent} event
 * @private
 */
DvtChartEventManager.prototype._onMouseDragMove = function(event) {
  var relPos = this._getRelativePosition(event.pageX, event.pageY);
  var dragHandler = this._getDragHandler(); // don't pass the relPos so that the drag mode stays
  var chartEvent;

  if (dragHandler) {
    chartEvent = dragHandler.processDragMove(relPos, event.ctrlKey);
    if (chartEvent) {
      this._callback.call(this._callbackObj, chartEvent);
      this.setDragButtonsVisible(false); // hide drag buttons on drag
    }
  }

  if (chartEvent)
    event.stopPropagation(); // prevent data cursor from appearing
};


/**
 * Mouse drag end callback.
 * @param {dvt.BaseEvent} event
 * @private
 */
DvtChartEventManager.prototype._onMouseDragEnd = function(event) {
  var relPos = this._getRelativePosition(event.pageX, event.pageY);
  var dragHandler = this._getDragHandler(); // don't pass the relPos so that the drag mode stays
  var chartEvent;

  if (dragHandler) {
    chartEvent = dragHandler.processDragEnd(relPos, event.ctrlKey);
    if (chartEvent) {
      this._callback.call(this._callbackObj, chartEvent);
      this.autoToggleZoomButton();
    }

    this._chart.setCursor(dragHandler.getCursor(relPos));

    // Show the drag buttons
    var axisSpace = this._chart.__getAxisSpace();
    if (axisSpace)
      this.setDragButtonsVisible(axisSpace.containsPoint(relPos.x, relPos.y));
  }

  // Clear the stage absolute position cache
  this._stageAbsolutePosition = null;
};


/**
 * @override
 */
DvtChartEventManager.prototype.OnMouseMove = function(event) {
  DvtChartEventManager.superclass.OnMouseMove.call(this, event);

  var relPos = this._getRelativePosition(event.pageX, event.pageY);
  if (this._dataCursorHandler) {
    if (this.GetCurrentTargetForEvent(event) instanceof dvt.Button) // don't show DC over buttons
      this._dataCursorHandler.processEnd();
    else
      this._dataCursorHandler.processMove(relPos);
  }

  // Update the cursor
  var dragHandler = this._getDragHandler(relPos);
  if (dragHandler)
    this._chart.setCursor(dragHandler.getCursor(relPos));
  else
    this._chart.setCursor('default');
};

/**
 * @override
 */
DvtChartEventManager.prototype.OnMouseOut = function(event) {
  DvtChartEventManager.superclass.OnMouseOut.call(this, event);
  var relPos = this._getRelativePosition(event.pageX, event.pageY);

  // Hide the drag buttons
  var axisSpace = this._chart.__getAxisSpace();
  if (axisSpace)
    this.setDragButtonsVisible(axisSpace.containsPoint(relPos.x, relPos.y));

  if (this._dataCursorHandler)
    this._dataCursorHandler.processOut(relPos);

  // Clear the stage absolute position cache
  this._stageAbsolutePosition = null;

  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;
};

/**
 * @override
 */
DvtChartEventManager.prototype.OnMouseWheel = function(event) {
  if (!DvtChartEventUtils.isZoomable(this._chart))
    return;

  var delta = event.wheelDelta != null ? event.wheelDelta : 0;
  var relPos = this._getRelativePosition(event.pageX, event.pageY);

  if (this._panZoomHandler) {
    var panZoomEvent = this._panZoomHandler.processMouseWheel(relPos, delta);
    if (panZoomEvent) {
      event.preventDefault();
      event.stopPropagation();
      this._callback.call(this._callbackObj, panZoomEvent);

      // Update the data cursor since the viewport has changed
      if (this._dataCursorHandler)
        this._dataCursorHandler.processMove(relPos);
    }
  }
};

/**
 * @override
 */
DvtChartEventManager.prototype.ShowFocusEffect = function(event, navigable) {
  if (this._dataCursorHandler) {
    var pos = navigable.getDataPosition();
    if (pos) {
      var plotAreaBounds = this._chart.__getPlotAreaSpace();
      this._dataCursorHandler.processMove(new dvt.Point(pos.x + plotAreaBounds.x, pos.y + plotAreaBounds.y));
    }
  }
  DvtChartEventManager.superclass.ShowFocusEffect.call(this, event, navigable);
};

/**
 * @override
 */
DvtChartEventManager.prototype.OnBlur = function(event)
{
  if (this._dataCursorHandler)
    this._dataCursorHandler.processEnd();
  DvtChartEventManager.superclass.OnBlur.call(this, event);
};

/**
 * @override
 */
DvtChartEventManager.prototype.OnClickInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  var pos = this._getRelativePosition(event.pageX, event.pageY);
  if (this.SeriesFocusHandler)
    this.SeriesFocusHandler.processSeriesFocus(pos, obj);

  if (!obj)
    return;

  this.processActionEvent(obj);

  // Only drill if not selectable. If selectable, drill with double click.
  if (!(obj.isSelectable && obj.isSelectable()))
    this.processDrillEvent(obj);
};


/**
 * @override
 */
DvtChartEventManager.prototype.OnDblClickInternal = function(event) {
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
DvtChartEventManager.prototype.HandleTouchHoverStartInternal = function(event) {
  var dlo = this.GetLogicalObject(event.target);
  this.TouchManager.setTooltipEnabled(event.touch.identifier, this.getTooltipsEnabled(dlo));
  return false;
};


/**
 * @override
 */
DvtChartEventManager.prototype.HandleTouchHoverMoveInternal = function(event) {
  var dlo = this.GetLogicalObject(event.target);
  this.TouchManager.setTooltipEnabled(event.touch.identifier, this.getTooltipsEnabled(dlo));
  return false;
};

/**
 * @override
 */
DvtChartEventManager.prototype.HandleTouchHoverEndInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;

  this.processActionEvent(obj);

  // Only drill if not selectable. If selectable, drill using double click.
  if (!(obj.isSelectable && obj.isSelectable()))
    this.processDrillEvent(obj);
};

/**
 * @override
 */
DvtChartEventManager.prototype.HandleTouchClickInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;

  this.processActionEvent(obj);

  // Only drill if not selectable. If selectable, drill using double click.
  if (!(obj.isSelectable && obj.isSelectable()))
    this.processDrillEvent(obj);
};

/**
 * @override
 */
DvtChartEventManager.prototype.HandleTouchDblClickInternal = function(event) {
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
 * Processes an action on the specified chart item.
 * @param {DvtChartObjPeer} obj The chart item that was clicked.
 */
DvtChartEventManager.prototype.processActionEvent = function(obj) {
  if (obj && obj.getAction && obj.getAction())
    this.FireEvent(dvt.EventFactory.newActionEvent('action', obj.getAction(), obj.getId()));
};

/**
 * Processes an drill on the specified chart item.
 * @param {DvtChartObjPeer} obj The chart item that was clicked.
 */
DvtChartEventManager.prototype.processDrillEvent = function(obj) {
  if (obj && obj.isDrillable && obj.isDrillable()) {
    var id = obj.getId();
    if (obj instanceof DvtChartObjPeer)
      this.FireEvent(dvt.EventFactory.newChartDrillEvent(id.getId ? id.getId() : id, obj.getSeries(), obj.getGroup()));
    else if (obj instanceof DvtChartPieSlice)
      this.FireEvent(dvt.EventFactory.newChartDrillEvent(id.getId(), id.getSeries(), id.getGroup()));
  }
};

/**
 * @override
 */
DvtChartEventManager.prototype.ProcessRolloverEvent = function(event, obj, bOver) {
  // Don't continue if not enabled
  var options = this._chart.getOptions();
  if (DvtChartEventUtils.getHoverBehavior(this._chart) != 'dim')
    return;

  // Compute the new highlighted categories and update the options
  var categories = obj.getCategories ? obj.getCategories() : [];
  options['highlightedCategories'] = bOver ? categories.slice() : null;

  // Fire the event to the rollover handler, who will fire to the component callback.
  var rolloverEvent = dvt.EventFactory.newCategoryHighlightEvent(options['highlightedCategories'], bOver);
  var hoverBehaviorDelay = DvtChartStyleUtils.getHoverBehaviorDelay(this._chart);

  // Find all the objects that may need to be highlighted
  var objs = this._chart.getObjects();
  if (this._chart.pieChart)
    objs = objs.concat(this._chart.pieChart.__getSlices());

  this.RolloverHandler.processEvent(rolloverEvent, objs, hoverBehaviorDelay, options['highlightMatch'] == 'any');
};

/**
 * Touch drag start callback.
 * @param {dvt.BaseEvent} event
 * @return {boolean} Whether drag is initiated.
 * @private
 */
DvtChartEventManager.prototype._onTouchDragStart = function(event) {
  var touches = event.touches;
  var chartEvent, dataCursorOn;

  if (touches.length == 1) {
    var relPos = this._getRelativePosition(touches[0].pageX, touches[0].pageY);
    var dragHandler = this._getDragHandler();
    if (dragHandler)
      chartEvent = dragHandler.processDragStart(relPos, true);
    else if (this._dataCursorHandler) {
      this._dataCursorHandler.processMove(relPos);
      dataCursorOn = true;
    }
  }
  else if (touches.length == 2 && this._panZoomHandler && DvtChartEventUtils.isZoomable(this._chart)) {
    this.endDrag(); // clean 1-finger events before starting pinch zoom
    var relPos1 = this._getRelativePosition(touches[0].pageX, touches[0].pageY);
    var relPos2 = this._getRelativePosition(touches[1].pageX, touches[1].pageY);
    chartEvent = this._panZoomHandler.processPinchStart(relPos1, relPos2);
  }

  if (chartEvent) {
    this._callback.call(this._callbackObj, chartEvent);
    this.getCtx().getTooltipManager().hideTooltip();
  }

  if (chartEvent || dataCursorOn) {
    event.preventDefault();
    event.stopPropagation();
    this.setDragButtonsVisible(false); // hide drag buttons on drag
    return true;
  }

  return false;
};


/**
 * Touch drag move callback.
 * @param {dvt.BaseEvent} event
 * @private
 */
DvtChartEventManager.prototype._onTouchDragMove = function(event) {
  var touches = event.touches;
  var chartEvent, dataCursorOn;

  if (touches.length == 1) {
    var relPos = this._getRelativePosition(touches[0].pageX, touches[0].pageY);
    var dragHandler = this._getDragHandler();
    if (dragHandler)
      chartEvent = dragHandler.processDragMove(relPos, true);
    else if (this._dataCursorHandler) {
      this._dataCursorHandler.processMove(relPos);
      dataCursorOn = true;
    }
  }
  else if (touches.length == 2 && this._panZoomHandler && DvtChartEventUtils.isZoomable(this._chart)) {
    var relPos1 = this._getRelativePosition(touches[0].pageX, touches[0].pageY);
    var relPos2 = this._getRelativePosition(touches[1].pageX, touches[1].pageY);
    chartEvent = this._panZoomHandler.processPinchMove(relPos1, relPos2);
  }

  if (chartEvent || dataCursorOn) {
    event.preventDefault();
  }

  if (chartEvent) {
    this._callback.call(this._callbackObj, chartEvent);
    this.getCtx().getTooltipManager().hideTooltip();
  }
};


/**
 * Touch drag end callback.
 * @param {dvt.BaseEvent} event
 * @private
 */
DvtChartEventManager.prototype._onTouchDragEnd = function(event) {
  // End 1-finger event
  var chartEvent1 = this.endDrag();

  // End 2-finger event
  var chartEvent2;
  if (this._panZoomHandler && DvtChartEventUtils.isZoomable(this._chart)) {
    chartEvent2 = this._panZoomHandler.processPinchEnd();
    if (chartEvent2)
      this._callback.call(this._callbackObj, chartEvent2);
  }

  if (chartEvent1 || chartEvent2) {
    event.preventDefault();
    this.getCtx().getTooltipManager().hideTooltip();
  }

  this._stageAbsolutePosition = null; // Clear the stage absolute position cache
  this.setDragButtonsVisible(true);
};


/**
 * @override
 */
DvtChartEventManager.prototype.endDrag = function() {
  var dragHandler = this._getDragHandler();
  var chartEvent;

  if (dragHandler) {
    chartEvent = dragHandler.processDragEnd(null, true);
    if (chartEvent)
      this._callback.call(this._callbackObj, chartEvent);
  }
  if (this._dataCursorHandler)
    this._dataCursorHandler.processEnd();

  if (chartEvent)
    this._callback.call(this._callbackObj, chartEvent);

  return chartEvent;
};

/**
 * Zooms by the specified amount.
 * @param {number} dz A number specifying the zoom ratio. dz = 1 means no zoom.
 */
DvtChartEventManager.prototype.zoomBy = function(dz) {
  if (this._panZoomHandler && DvtChartEventUtils.isZoomable(this._chart)) {
    var chartEvent = this._panZoomHandler.zoomBy(dz);
    if (chartEvent)
      this._callback.call(this._callbackObj, chartEvent);
  }
};

/**
 * Pans by the specified amount.
 * @param {number} dx A number from specifying the pan ratio in the x direction, e.g. dx = 0.5 means pan end by 50%..
 * @param {number} dy A number from specifying the pan ratio in the y direction, e.g. dy = 0.5 means pan down by 50%.
 */
DvtChartEventManager.prototype.panBy = function(dx, dy) {
  if (this._panZoomHandler && DvtChartEventUtils.isScrollable(this._chart)) {
    var chartEvent = this._panZoomHandler.panBy(dx, dy);
    if (chartEvent)
      this._callback.call(this._callbackObj, chartEvent);
  }
};

/**
 * Helper function to hide tooltips and data cursor, generally in preparation for render or removal of the chart. This
 * is not done in hideTooltip to avoid interactions with the superclass, which would cause problems with the data cursor.
 */
DvtChartEventManager.prototype.hideHoverFeedback = function() {
  // Hide tooltip and data cursor
  this.hideTooltip();

  // Hide the data cursor. This is necessary to hide the data cursor line when the user mouses over the tooltip div in
  // IE9, which does not support pointer-events.
  if (this._dataCursorHandler)
    this._dataCursorHandler.processEnd();
};


/**
 * @override
 */
DvtChartEventManager.prototype.hideTooltip = function() {
  // Don't hide the tooltip if data cursor is shown on a touch device
  if (!this._dataCursorHandler || !this._dataCursorHandler.isDataCursorShown())
    DvtChartEventManager.superclass.hideTooltip.call(this);
};


/**
 * @override
 */
DvtChartEventManager.prototype.getTooltipsEnabled = function(logicalObj) {
  // Don't allow tooltips to conflict with the data cursor
  if (this._dataCursorHandler && (logicalObj instanceof DvtChartObjPeer || logicalObj instanceof DvtChartRefObjPeer || this._dataCursorHandler.isDataCursorShown()))
    return false;
  else
    return DvtChartEventManager.superclass.getTooltipsEnabled.call(this);
};


/**
 * Gets the data cursor handler.
 * @return {DvtChartDataCursorHandler} The data cursor handler.
 */
DvtChartEventManager.prototype.getDataCursorHandler = function() {
  return this._dataCursorHandler;
};

/**
 * Sets the data cursor handler.
 * @param {DvtChartDataCursorHandler} handler The data cursor handler.
 */
DvtChartEventManager.prototype.setDataCursorHandler = function(handler) {
  this._dataCursorHandler = handler;
};


/**
 * Sets the pan zoom handler.
 * @param {dvt.PanZoomHandler} handler The pan zoom handler.
 */
DvtChartEventManager.prototype.setPanZoomHandler = function(handler) {
  this._panZoomHandler = handler;
};

/**
 * Sets the marquee zoom handler.
 * @param {dvt.MarqueeHandler} handler The marquee zoom handler.
 */
DvtChartEventManager.prototype.setMarqueeZoomHandler = function(handler) {
  this._marqueeZoomHandler = handler;
};


/**
 * Sets the marquee select handler.
 * @param {dvt.MarqueeHandler} handler The marquee select handler.
 */
DvtChartEventManager.prototype.setMarqueeSelectHandler = function(handler) {
  this._marqueeSelectHandler = handler;
};


/**
 * Cancels marquee zoom/select.
 * @param {dvt.BaseEvent} event The event
 */
DvtChartEventManager.prototype.cancelMarquee = function(event) {
  if (this._dragMode == DvtChartEventManager.DRAG_MODE_ZOOM) {
    if (this._marqueeZoomHandler.cancelMarquee())
      event.preventDefault();
  }
  else if (this._dragMode == DvtChartEventManager.DRAG_MODE_SELECT) {
    // If marquee is in progress, re-render from the options obj, which has the old selection
    if (this._marqueeSelectHandler && this._marqueeSelectHandler.cancelMarquee())
      this._chart.render();
  }
};


/**
 * Gets the current drag mode.
 * @return {string} The drag mode.
 */
DvtChartEventManager.prototype.getDragMode = function() {
  return this._dragMode;
};


/**
 * Sets the drag mode. If set to null, the drag mode will become the default one.
 * @param {string} dragMode The drag mode, or null.
 */
DvtChartEventManager.prototype.setDragMode = function(dragMode) {
  if (dragMode == null)
    this._dragMode = this._getDefaultDragMode();
  else
    this._dragMode = dragMode;

  // If the chart is fully zoomed out, the pan mode should fall back to the zoom mode on desktop
  if (this._chart.xAxis.isFullViewport() && (!this._chart.yAxis || this._chart.yAxis.isFullViewport()))
    this.autoToggleZoomButton();
};


/**
 * Returns the default drag mode for the chart.
 * @return {string} The default drag mode.
 * @private
 */
DvtChartEventManager.prototype._getDefaultDragMode = function() {
  if (dvt.Agent.isTouchDevice())
    return DvtChartEventManager.DRAG_MODE_OFF;
  else if (DvtChartEventUtils.isScrollable(this._chart))
    return DvtChartEventManager.DRAG_MODE_PAN;
  else if (this._chart.getOptions()['selectionMode'] == 'multiple')
    return DvtChartEventManager.DRAG_MODE_SELECT;
  else
    return null;
};


/**
 * Handles the zoom button click event.
 * @param {object} event
 */
DvtChartEventManager.prototype.onZoomButtonClick = function(event) {
  if (this.zoomButton.isToggled()) {
    if (this.selectButton)
      this.selectButton.setToggled(false);
    this.setDragMode(DvtChartEventManager.DRAG_MODE_ZOOM);
  }
  else
    this.setDragMode(null);
};


/**
 * Handles the pan button click event.
 * @param {object} event
 */
DvtChartEventManager.prototype.onPanButtonClick = function(event) {
  if (this.panButton.isToggled()) {
    if (this.selectButton)
      this.selectButton.setToggled(false);
    this.setDragMode(DvtChartEventManager.DRAG_MODE_PAN);
  }
  else
    this.setDragMode(null);
};


/**
 * Handles the select button click event.
 * @param {object} event
 */
DvtChartEventManager.prototype.onSelectButtonClick = function(event) {
  if (this.selectButton.isToggled()) {
    if (this.zoomButton)
      this.zoomButton.setToggled(false);
    if (this.panButton)
      this.panButton.setToggled(false);
    this.setDragMode(DvtChartEventManager.DRAG_MODE_SELECT);
  }
  else
    this.setDragMode(null);
};


/**
 * Sets the visibility of the drag buttons.
 * @param {boolean} visible The visibility.
 */
DvtChartEventManager.prototype.setDragButtonsVisible = function(visible) {
  if (visible && !this._dragButtonsVisible) {
    this._chart.showDragButtons();
    this._dragButtonsVisible = true;
  }
  else if (!visible && this._dragButtonsVisible) {
    this._chart.hideDragButtons();
    this._dragButtonsVisible = false;
  }
};


/**
 * Returns whether the drag buttons are visible.
 * @return {boolean}
 */
DvtChartEventManager.prototype.areDragButtonsVisible = function() {
  return this._dragButtonsVisible;
};


/**
 * Toggles the marquee zoom button automatically:
 * - Marquee select button is unaffected.
 * - If the chart is fully zoomed out, turn on the marquee zoom mode; otherwise, turn it off.
 * Doesn't apply to touch devices.
 */
DvtChartEventManager.prototype.autoToggleZoomButton = function() {
  if (dvt.Agent.isTouchDevice() || !this.zoomButton)
    return;

  if (this._chart.xAxis.isFullViewport() && this._chart.yAxis.isFullViewport()) {
    if (this._dragMode == DvtChartEventManager.DRAG_MODE_PAN) {
      this.zoomButton.setToggled(true);
      this.onZoomButtonClick(null);
    }
  }
  else {
    if (this._dragMode == DvtChartEventManager.DRAG_MODE_ZOOM) {
      this.zoomButton.setToggled(false);
      this.onZoomButtonClick(null);
    }
  }
};

/**
 * @override
 */
DvtChartEventManager.prototype.GetTouchResponse = function() {
  if (this._dragMode && this._dragMode != DvtChartEventManager.DRAG_MODE_OFF) {
    return dvt.EventManager.TOUCH_RESPONSE_TOUCH_HOLD;
  }
  else
    return this._chart.getOptions()['touchResponse'];
};
/*---------------------------------------------------------------------------------*/
/*  DvtChartKeyboardHandler     Keyboard handler for Chart                         */
/*---------------------------------------------------------------------------------*/
/**
  *  @param {dvt.EventManager} manager The owning dvt.EventManager
  *  @param {dvt.Chart} chart
  *  @class DvtChartKeyboardHandler
  *  @extends {dvt.KeyboardHandler}
  *  @constructor
  */
var DvtChartKeyboardHandler = function(manager, chart)
{
  this.Init(manager, chart);
};

dvt.Obj.createSubclass(DvtChartKeyboardHandler, dvt.KeyboardHandler);


/**
 * @override
 */
DvtChartKeyboardHandler.prototype.Init = function(manager, chart) {
  DvtChartKeyboardHandler.superclass.Init.call(this, manager);
  this._chart = chart;
};


/**
 * @override
 */
DvtChartKeyboardHandler.prototype.isSelectionEvent = function(event)
{
  return this.isNavigationEvent(event) && !event.ctrlKey;
};


/**
 * @override
 */
DvtChartKeyboardHandler.prototype.isMultiSelectEvent = function(event)
{
  return event.keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey;
};


/**
 * @override
 */
DvtChartKeyboardHandler.prototype.processKeyDown = function(event) {
  var keyCode = event.keyCode;
  if (keyCode == dvt.KeyboardEvent.TAB) {
    var currentNavigable = this._eventManager.getFocus();
    if (currentNavigable) {
      dvt.EventManager.consumeEvent(event);
      return currentNavigable;
    }

    // navigate to the default
    var navigables = DvtChartEventUtils.getKeyboardNavigables(this._chart);
    if (navigables.length > 0) {
      dvt.EventManager.consumeEvent(event);
      return this.getDefaultNavigable(navigables);
    }
  }
  else if (keyCode == dvt.KeyboardEvent.ENTER) {
    var currentNavigable = this._eventManager.getFocus();
    if (currentNavigable) {
      this._eventManager.processActionEvent(currentNavigable);
      this._eventManager.processDrillEvent(currentNavigable);
      dvt.EventManager.consumeEvent(event);
      return currentNavigable;
    }
  }
  else if (keyCode == dvt.KeyboardEvent.ESCAPE) {
    this._eventManager.cancelMarquee(event);
  }
  else if (keyCode == dvt.KeyboardEvent.PAGE_UP) {
    if ((event.ctrlKey || event.shiftKey || DvtChartTypeUtils.isBLAC(this._chart)) && DvtChartTypeUtils.isVertical(this._chart)) { // pan left
      this._eventManager.panBy(-0.25, 0);
    }
    else { // pan up. Also used for horizontal bar charts
      this._eventManager.panBy(0, -0.25);
    }
    dvt.EventManager.consumeEvent(event);
  }
  else if (keyCode == dvt.KeyboardEvent.PAGE_DOWN) {
    if ((event.ctrlKey || event.shiftKey || DvtChartTypeUtils.isBLAC(this._chart)) && DvtChartTypeUtils.isVertical(this._chart)) { // pan right
      this._eventManager.panBy(0.25, 0);
    }
    else { // pan down. Also used for horizontal bar charts
      this._eventManager.panBy(0, 0.25);
    }
    dvt.EventManager.consumeEvent(event);
  }
  else if (dvt.KeyboardEvent.isEquals(event) || dvt.KeyboardEvent.isPlus(event)) { // zoom in
    this._eventManager.zoomBy(1.5);
  }
  else if (dvt.KeyboardEvent.isMinus(event) || dvt.KeyboardEvent.isUnderscore(event)) { // zoom out
    this._eventManager.zoomBy(1 / 1.5);
  }

  return DvtChartKeyboardHandler.superclass.processKeyDown.call(this, event);
};

/**
 * @override
 */
DvtChartKeyboardHandler.prototype.getDefaultNavigable = function(navigableItems) 
{
  if (!navigableItems || navigableItems.length <= 0)
    return null;

  var isPie = DvtChartTypeUtils.isPie(this._chart);
  var defaultNavigable, defaultSeries, defaultGroup;
  var navigable;

  // Pick the first group in the first series
  for (var i = 0; i < navigableItems.length; i++) {
    navigable = navigableItems[i];

    if (!defaultNavigable || navigable.getSeriesIndex() < defaultSeries) {
      defaultNavigable = navigable;
      defaultSeries = navigable.getSeriesIndex();
      if (!isPie)
        defaultGroup = navigable.getGroupIndex();
      continue;
    }

    if (!isPie && navigable.getGroupIndex() < defaultGroup) {
      defaultNavigable = navigable;
      defaultSeries = navigable.getSeriesIndex();
      defaultGroup = navigable.getGroupIndex();
    }
  }

  return defaultNavigable;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 * Logical object for chart data object displayables.
 * @param {dvt.Chart} chart The owning chart instance.
 * @param {array} displayables The array of associated DvtDisplayables.
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {dvt.Point} dataPos The coordinate of the data point relative to the plot area
 * @class
 * @constructor
 * @implements {DvtCategoricalObject}
 * @implements {DvtLogicalObject}
 * @implements {DvtPopupSource}
 * @implements {DvtSelectable}
 * @implements {DvtTooltipSource}
 */
var DvtChartObjPeer = function(chart, displayables, seriesIndex, groupIndex, dataPos) {
  this.Init(chart, displayables, seriesIndex, groupIndex, dataPos);
};

dvt.Obj.createSubclass(DvtChartObjPeer, dvt.Obj);


/**
 * @param {dvt.Chart} chart The owning chart instance.
 * @param {array} displayables The array of associated DvtDisplayables.
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {dvt.Point} dataPos The coordinate of the data point relative to the plot area
 */
DvtChartObjPeer.prototype.Init = function(chart, displayables, seriesIndex, groupIndex, dataPos) {
  this._chart = chart;
  this._displayables = displayables;
  this._seriesIndex = seriesIndex != null ? seriesIndex : -1;
  this._groupIndex = groupIndex != null ? groupIndex : -1;
  this._dataPos = dataPos;
  this._isSelected = false;
  this._isShowingKeyboardFocusEffect = false;

  // . Need to evaluate these up front because the series and group are used for animation
  if (seriesIndex >= 0)
    this._series = DvtChartDataUtils.getSeries(chart, seriesIndex);
  if (groupIndex >= 0)
    this._group = DvtChartDataUtils.getGroup(chart, groupIndex);

  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  if (seriesItem) {
    this._action = seriesItem['action'];
    this._drillable = DvtChartEventUtils.isSeriesDrillable(chart, seriesIndex);

    // Popup Support: Store the stamp id for this series item, which is used to look up the popup behaviors
    this._stampId = seriesItem['_id'];
  }

  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);

  // Create the array specifying all categories that this data item or series belongs to
  this._categories = DvtChartDataUtils.getDataItemCategories(chart, seriesIndex, groupIndex);

  if (dataItem) {
    this._dataItemId = dataItem['id'];
    this._action = dataItem['action']; // override the series action
    this._drillable = DvtChartEventUtils.isDataItemDrillable(chart, seriesIndex, groupIndex);

    // Popup Support: Override the series stamp id
    this._stampId = dataItem['_id'];
  }

  // Apply the cursor for the action if specified
  if (this._action || this._drillable) {
    for (var i = 0; i < this._displayables.length; i++) {
      this._displayables[i].setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
    }
  }

  // Apply the aria properties
  for (var index = 0; index < displayables.length; index++) {
    var displayable = displayables[index];
    // lines are not interactive so we shouldn't add wai-aria attributes
    if (!(displayable instanceof DvtChartLineArea))
      displayable.setAriaRole('img');
    this._updateAriaLabel(displayable);
  }
};


/**
 * Creates a data item to identify the specified displayable and registers it with the chart.
 * @param {dvt.Displayable} displayable The displayable to associate.
 * @param {dvt.Chart} chart The owning chart instance.
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {dvt.Point} dataPos The coordinate of the data point relative to the plot area
 */
DvtChartObjPeer.associate = function(displayable, chart, seriesIndex, groupIndex, dataPos) {
  if (!displayable)
    return;

  // Create the logical object.
  var identObj = new DvtChartObjPeer(chart, [displayable], seriesIndex, groupIndex, dataPos);

  // Register with the chart
  chart.registerObject(identObj);

  // Finally associate using the event manager
  chart.getEventManager().associate(displayable, identObj);
};


/**
 * @override
 */
DvtChartObjPeer.prototype.getId = function() {
  if (this._seriesIndex >= 0 && this._groupIndex >= 0)
    return new DvtChartDataItem(this._dataItemId, this.getSeries(), this.getGroup());
  else if (this._seriesIndex >= 0)
    return this.getSeries();
  else
    return null;
};


/**
 * Return the peer's data item id.  This is an optional id that is provided to simplifying
 * row key support for ADF and AMX.
 * @return {string} the peer's row key.
 */
DvtChartObjPeer.prototype.getDataItemId = function() {
  return this._dataItemId;
};


/**
 * Return the peer's series.
 * @return {string} the peer's series.
 */
DvtChartObjPeer.prototype.getSeries = function() {
  return this._series;
};


/**
 * Return the peer's series index.
 * @return {Number} the peer's series index.
 */
DvtChartObjPeer.prototype.getSeriesIndex = function() {
  return this._seriesIndex;
};


/**
 * Return the peer's group.
 * @return {string} the peer's group.
 */
DvtChartObjPeer.prototype.getGroup = function() {
  return this._group;
};


/**
 * Return the peer's group index.
 * @return {Number} the peer's group index.
 */
DvtChartObjPeer.prototype.getGroupIndex = function() {
  return this._groupIndex;
};


/**
 * Return the action string for the data item, if any exists.
 * @return {string} the action outcome for the data item.
 */
DvtChartObjPeer.prototype.getAction = function() {
  return this._action;
};


/**
 * Returns whether the chart object is drillable
 * @return {boolean}
 */
DvtChartObjPeer.prototype.isDrillable = function() {
  return this._drillable;
};


/**
 * Returns whether the chart object is double clickable.
 * @return {boolean}
 */
DvtChartObjPeer.prototype.isDoubleClickable = function() {
  // : IE double clicking workaround in dvt.EventManager.
  return this.isSelectable() && this.isDrillable();
};


/**
 * Convenience function to return the peer's chart.
 * @return {dvt.Chart} the associated chart object.
 */
DvtChartObjPeer.prototype.getChart = function() {
  return this._chart;
};


/**
 * Return the peer's series type.
 * @return {string} the peer's series type.
 */
DvtChartObjPeer.prototype.getSeriesType = function() {
  return DvtChartStyleUtils.getSeriesType(this._chart, this._seriesIndex);
};


/**
 * Return the peer's series item.
 * @return {object} the peer's series item.
 */
DvtChartObjPeer.prototype.getSeriesItem = function() {
  return DvtChartDataUtils.getSeriesItem(this._chart, this._seriesIndex);
};

//---------------------------------------------------------------------//
// Tooltip Support: DvtTooltipSource impl                              //
//---------------------------------------------------------------------//


/**
 * @override
 */
DvtChartObjPeer.prototype.getDatatip = function(target) {
  return DvtChartTooltipUtils.getDatatip(this._chart, this._seriesIndex, this._groupIndex, true);
};


/**
 * @override
 */
DvtChartObjPeer.prototype.getDatatipColor = function() {
  return DvtChartTooltipUtils.getDatatipColor(this._chart, this._seriesIndex, this._groupIndex);
};

//---------------------------------------------------------------------//
// Selection Support: DvtSelectable impl                               //
//---------------------------------------------------------------------//


/**
 * @override
 */
DvtChartObjPeer.prototype.isSelectable = function() {
  return DvtChartStyleUtils.isSelectable(this.getChart(), this.getSeriesIndex(), this.getGroupIndex());
};


/**
 * @override
 */
DvtChartObjPeer.prototype.isSelected = function() {
  return this._isSelected;
};


/**
 * @override
 */
DvtChartObjPeer.prototype.setSelected = function(bSelected) {
  this._isSelected = bSelected;
  for (var i = 0; i < this._displayables.length; i++) {
    if (this._displayables[i].setSelected) {
      this._displayables[i].setSelected(bSelected);
      this._updateAriaLabel(this._displayables[i]);
    }
  }
};


/**
 * @override
 */
DvtChartObjPeer.prototype.showHoverEffect = function() {
  for (var i = 0; i < this._displayables.length; i++) {
    if (this._displayables[i].showHoverEffect)
      this._displayables[i].showHoverEffect();
  }
};


/**
 * @override
 */
DvtChartObjPeer.prototype.hideHoverEffect = function() {
  for (var i = 0; i < this._displayables.length; i++) {
    if (this._displayables[i].hideHoverEffect)
      this._displayables[i].hideHoverEffect();
  }
};

//---------------------------------------------------------------------//
// Popup Support: DvtPopupSource impl                                  //
//---------------------------------------------------------------------//


/**
 * @override
 */
DvtChartObjPeer.prototype.getShowPopupBehaviors = function() {
  return this._chart.getShowPopupBehaviors(this._stampId);
};

//---------------------------------------------------------------------//
// Rollover and Hide/Show Support: DvtLogicalObject impl               //
//---------------------------------------------------------------------//


/**
 * @override
 */
DvtChartObjPeer.prototype.getDisplayables = function() {
  return this._displayables;
};


/**
 * @override
 */
DvtChartObjPeer.prototype.getAriaLabel = function() {
  var states = [];
  var options = this.getChart().getOptions();
  if (this.isSelectable())
    states.push(dvt.Bundle.getTranslation(options, this.isSelected() ? 'stateSelected' : 'stateUnselected', dvt.Bundle.UTIL_PREFIX, this.isSelected() ? 'STATE_SELECTED' : 'STATE_UNSELECTED'));
  if (this.isDrillable())
    states.push(dvt.Bundle.getTranslation(options, 'stateDrillable', dvt.Bundle.UTIL_PREFIX, 'STATE_DRILLABLE'));

  var shortDesc = DvtChartTooltipUtils.getDatatip(this._chart, this._seriesIndex, this._groupIndex, false);
  if (shortDesc == null && this._groupIndex < 0 && states.length > 0)
    shortDesc = DvtChartDataUtils.getSeriesLabel(this._chart, this._seriesIndex);

  return dvt.Displayable.generateAriaLabel(shortDesc, states);
};

/**
 * Updates the aria-label as needed. On desktop, we can defer the aria creation, and the aria-label will be updated
 * when the activeElement is set.
 * @param {dvt.Displayable} displayable The displayable object.
 * @private
 */
DvtChartObjPeer.prototype._updateAriaLabel = function(displayable) {
  if (!dvt.Agent.deferAriaCreation())
    displayable.setAriaProperty('label', this.getAriaLabel());
};


//---------------------------------------------------------------------//
// Rollover and Hide/Show Support: DvtCategoricalObject impl           //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtChartObjPeer.prototype.getCategories = function(category) {
  return this._categories;
};


/**
 * @return {dvt.Point} The coordinate of the data point relative to the plot area
 */
DvtChartObjPeer.prototype.getDataPosition = function() {
  return this._dataPos;
};


//---------------------------------------------------------------------//
// Keyboard Support: DvtKeyboardNavigable impl                        //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtChartObjPeer.prototype.getNextNavigable = function(event) {
  var keyCode;
  var next;

  keyCode = event.keyCode;
  if (event.type == dvt.MouseEvent.CLICK) {
    return this;
  }
  else if (keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey) {
    // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
    // care of the selection
    return this;
  }

  var chart = this._chart;
  var chartObjs = chart.getChartObjPeers();

  var navigables = [];
  for (var i = 0; i < chartObjs.length; i++) {
    if (chartObjs[i].isNavigable())
      navigables.push(chartObjs[i]);
  }

  if (DvtChartTypeUtils.isScatterBubble(chart)) {
    next = dvt.KeyboardHandler.getNextAdjacentNavigable(this, event, navigables);
  }
  // Polar bars should be treated the same way as line/area charts
  else if (DvtChartTypeUtils.isLineArea(chart) || DvtChartTypeUtils.isStacked(chart) || DvtChartTypeUtils.isPolar(chart)) {
    next = this._findNextNavigable(event);
  }
  else if (DvtChartTypeUtils.isFunnel(chart) && (event.keyCode == dvt.KeyboardEvent.UP_ARROW || event.keyCode == dvt.KeyboardEvent.DOWN_ARROW)) {
    event.keyCode = event.keyCode - 1;
    next = dvt.KeyboardHandler.getNextNavigable(this, event, navigables);
  }
  else {
    // : ignoreBounds for the case of range bars or bars with negative values that don't overlap with the adjacent series.
    next = dvt.KeyboardHandler.getNextNavigable(this, event, navigables, true);
  }
  return next;
};


/**
 * @override
 */
DvtChartObjPeer.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) {
  if (this._displayables[0])
    return this._displayables[0].getDimensions(targetCoordinateSpace);
  else
    return new dvt.Rectangle(0, 0, 0, 0);
};

/**
 * @override
 */
DvtChartObjPeer.prototype.getTargetElem = function() {
  if (this._displayables[0])
    return this._displayables[0].getElem();
  return null;
};

/**
 * @override
 */
DvtChartObjPeer.prototype.showKeyboardFocusEffect = function() {
  if (this.isNavigable()) {
    this._isShowingKeyboardFocusEffect = true;
    this.showHoverEffect();
  }
};


/**
 * @override
 */
DvtChartObjPeer.prototype.hideKeyboardFocusEffect = function() {
  if (this.isNavigable()) {
    this._isShowingKeyboardFocusEffect = false;
    this.hideHoverEffect();
  }
};


/**
 * @override
 */
DvtChartObjPeer.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};


/**
 * Returns true if the object is navigable
 * @return {boolean}
 */
DvtChartObjPeer.prototype.isNavigable = function() {
  return this.getGroupIndex() != -1 && this.getSeriesIndex() != -1;
};


/**
 * Returns the next navigable object in the direction of the arrow for line/area
 * @param {dvt.BaseEvent} event
 * @return {DvtChartObjPeer}
 * @private
 */
DvtChartObjPeer.prototype._findNextNavigable = function(event) {
  var keyCode = event.keyCode;
  var chart = this._chart;
  var context = chart.getCtx();

  var seriesIndex = this.getSeriesIndex();
  var groupIndex = this.getGroupIndex();
  var groupCount = DvtChartDataUtils.getGroupCount(chart);
  var nextSeriesIndex;
  var nextGroupIndex;

  var isHoriz = DvtChartTypeUtils.isHorizontal(chart);
  var isPolar = DvtChartTypeUtils.isPolar(chart);
  var isRTL = dvt.Agent.isRightToLeft(context);
  var isUp = isHoriz ? (isRTL ? keyCode == dvt.KeyboardEvent.LEFT_ARROW : keyCode == dvt.KeyboardEvent.RIGHT_ARROW) : keyCode == dvt.KeyboardEvent.UP_ARROW;
  var isDown = isHoriz ? (isRTL ? keyCode == dvt.KeyboardEvent.RIGHT_ARROW : keyCode == dvt.KeyboardEvent.LEFT_ARROW) : keyCode == dvt.KeyboardEvent.DOWN_ARROW;
  var isLeft = isHoriz ? keyCode == dvt.KeyboardEvent.UP_ARROW : (isRTL ? keyCode == dvt.KeyboardEvent.RIGHT_ARROW : keyCode == dvt.KeyboardEvent.LEFT_ARROW);
  var isRight = isHoriz ? keyCode == dvt.KeyboardEvent.DOWN_ARROW : (isRTL ? keyCode == dvt.KeyboardEvent.LEFT_ARROW : keyCode == dvt.KeyboardEvent.RIGHT_ARROW);

  if (isUp) {
    nextGroupIndex = groupIndex;
    nextSeriesIndex = this._findNextUpSeries(chart, seriesIndex, groupIndex);
  }
  else if (isDown) {
    nextGroupIndex = groupIndex;
    nextSeriesIndex = this._findNextDownSeries(chart, seriesIndex, groupIndex);
  }
  else if (isRight) {
    nextSeriesIndex = seriesIndex;
    nextGroupIndex = groupIndex;
    do {
      nextGroupIndex++;
      if (isPolar && nextGroupIndex >= groupCount)
        nextGroupIndex = 0;
    } while (chart.getObject(nextSeriesIndex, nextGroupIndex) == null && nextGroupIndex < groupCount);
  }
  else if (isLeft) {
    nextSeriesIndex = seriesIndex;
    nextGroupIndex = groupIndex;
    do {
      nextGroupIndex--;
      if (isPolar && nextGroupIndex < 0)
        nextGroupIndex = groupCount - 1;
    } while (chart.getObject(nextSeriesIndex, nextGroupIndex) == null && nextGroupIndex > -1);
  }

  var nextObj = chart.getObject(nextSeriesIndex, nextGroupIndex);
  return nextObj && nextObj.isNavigable() ? nextObj : this;
};


/**
 * Returns the index of the next up series
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex Current series index.
 * @param {number} groupIndex Current group index.
 * @return {number} Next up series index.
 * @private
 */
DvtChartObjPeer.prototype._findNextUpSeries = function(chart, seriesIndex, groupIndex) {
  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  var currentValue = DvtChartDataUtils.getCumulativeValue(chart, seriesIndex, groupIndex);
  var nextValue = null;
  var nextSeriesIndex = null;
  for (var i = 0; i < seriesCount; i++) {
    if (!DvtChartStyleUtils.isSeriesRendered(chart, i))
      continue;
    var itemValue = DvtChartDataUtils.getCumulativeValue(chart, i, groupIndex);
    if (itemValue > currentValue || (itemValue == currentValue && i > seriesIndex)) {
      if ((nextValue !== null && itemValue < nextValue) || (nextValue == null)) {
        nextValue = itemValue;
        nextSeriesIndex = i;
      }
    }
  }
  return nextSeriesIndex;
};


/**
 * Returns the index of the next down series.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex Current series index.
 * @param {number} groupIndex Current group index.
 * @return {number} Next down series index.
 * @private
 */
DvtChartObjPeer.prototype._findNextDownSeries = function(chart, seriesIndex, groupIndex) {
  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  var currentValue = DvtChartDataUtils.getCumulativeValue(chart, seriesIndex, groupIndex);
  var nextValue = null;
  var nextSeriesIndex = null;
  for (var i = seriesCount - 1; i >= 0; i--) {
    if (!DvtChartStyleUtils.isSeriesRendered(chart, i))
      continue;
    var itemValue = DvtChartDataUtils.getCumulativeValue(chart, i, groupIndex);
    if (itemValue < currentValue || (itemValue == currentValue && i < seriesIndex)) {
      if ((nextValue !== null && itemValue > nextValue) || (nextValue == null)) {
        nextValue = itemValue;
        nextSeriesIndex = i;
      }
    }
  }
  return nextSeriesIndex;
};
/**
 * Logical object for reference object displayables.
 * @param {dvt.Chart} chart
 * @param {array} displayables The array of associated DvtDisplayables.
 * @param {object} refObj reference object
 * @param {number} index The reference objects position in the reference object array
 * @param {string} axisType The axis the reference object is on
 * @class
 * @constructor
 * @implements {DvtCategoricalObject}
 * @implements {DvtLogicalObject}
 * @implements {DvtTooltipSource}
 */
var DvtChartRefObjPeer = function(chart, displayables, refObj, index, axisType) {
  this.Init(chart, displayables, refObj, index, axisType);
};

dvt.Obj.createSubclass(DvtChartRefObjPeer, dvt.Obj);

/**
 * @param {dvt.Chart} chart
 * @param {array} displayables The array of associated DvtDisplayables.
 * @param {object} refObj reference object
 * @param {number} index The reference objects position in the reference object array
 * @param {string} axisType The axis the reference object is on
 */
DvtChartRefObjPeer.prototype.Init = function(chart, displayables, refObj, index, axisType) {
  this._chart = chart;
  this._displayables = displayables;
  this._refObj = refObj;
  this._categories = DvtChartRefObjUtils.getRefObjCategories(this._refObj);

  // used for automation
  this._index = index;
  this._axisType = axisType;

  // WAI-ARIA
  for (var i = 0; i < displayables.length; i++) {
    var displayable = displayables[i];
    displayable.setAriaRole('img');
    displayable.setAriaProperty('label', refObj['shortDesc']);
  }
};

/**
 * @override
 */
DvtChartRefObjPeer.prototype.getCategories = function() {
  return this._categories;
};

/**
 * @override
 */
DvtChartRefObjPeer.prototype.getDisplayables = function() {
  return this._displayables;
};

/**
 * Returns the position of the reference object in the referenceObjects array.
 * @return {number} The position of this reference object.
 */
DvtChartRefObjPeer.prototype.getIndex = function() {
  return this._index;
};

/**
 * Returns which axis this reference object belongs to.
 * @return {string} xAxis, yAxis, or y2Axis
 */
DvtChartRefObjPeer.prototype.getAxisType = function() {
  return this._axisType;
};

/**
 * @override
 */
DvtChartRefObjPeer.prototype.getDatatip = function(target) {
  return DvtChartTooltipUtils.getRefObjTooltip(this._chart, this._refObj, this._axisType, this._index);
};

/**
 * @override
 */
DvtChartRefObjPeer.prototype.getDatatipColor = function() {
  return DvtChartRefObjUtils.getColor(this._refObj);
};
/**
  * Creates an object representing the ID of a chart data item.
  * @constructor
  * @param {string} id The ID for the data item, if available.
  * @param {string} series The series ID for the chart data item.
  * @param {string} group The group ID for the chart data item.
  */
var DvtChartDataItem = function(id, series, group) {
  // Expose as named properties to simplify uptake.
  this['id'] = id;
  this['series'] = series;
  this['group'] = group;
};

dvt.Obj.createSubclass(DvtChartDataItem, dvt.Obj);

/**
 * Returns the ID for the data item, if available.
 * @return {string} The data item ID.
 */
DvtChartDataItem.prototype.getId = function() {
  return this['id'];
};


/**
 * Returns the series ID for a chart data item.
 * @return {string} The series ID.
 */
DvtChartDataItem.prototype.getSeries = function() {
  return this['series'];
};


/**
 * Returns the group ID for a chart data item.
 * @return {string} The group ID.
 */
DvtChartDataItem.prototype.getGroup = function() {
  return this['group'];
};


/**
 * Determines if two DvtChartDataItem objects are equal.
 *
 * @param {DvtChartDataItem} dataItem The data item that will be used to test for equality.
 * @return {boolean} True if the two DvtChartDataItem objects are equal
 */
DvtChartDataItem.prototype.equals = function(dataItem) {
  // Note that the id is not compared, because the series and group ids are considered the primary identifiers.
  if (dataItem instanceof DvtChartDataItem) {
    if (this['series'] === dataItem['series']) {
      if (this['group'] instanceof Array && dataItem['group'] instanceof Array)
        return dvt.ArrayUtils.equals(this['group'], dataItem['group']);
      else
        return this['group'] === dataItem['group'];
    }
  }

  return false;
};
/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {dvt.BaseComponentDefaults}
 */
var DvtChartDefaults = function() {
  this.Init({'skyros': DvtChartDefaults.VERSION_1, 'alta': DvtChartDefaults.SKIN_ALTA, 'next': DvtChartDefaults.SKIN_NEXT});
};

dvt.Obj.createSubclass(DvtChartDefaults, dvt.BaseComponentDefaults);


/**
 * Contains overrides for the next generation skin.
 * @const
 */
DvtChartDefaults.SKIN_NEXT = {
  'skin': dvt.CSSStyle.SKIN_NEXT,

  'styleDefaults': {
    'dataItemGaps': 'auto',
    'markerSize': 10,
    'marqueeColor': 'rgba(255,255,255,0.4)', 'marqueeBorderColor': '#0572ce'
  },
  'yAxis': {
    'axisLine': {'rendered': 'auto'}
  },
  'y2Axis': {
    'axisLine': {'rendered': 'auto'}
  },
  'layout': {
    'titlePlotAreaGap': 16, 'footnoteGap': 10,
    'legendGapWidth': 15, 'legendGapHeight': 10,
    'tickLabelGapHeight': 8, 'tickLabelGapWidth': 9
  }
};

/**
 * Contains overrides for the 'alta' skin.
 * @const
 */
DvtChartDefaults.SKIN_ALTA = {
  'skin': dvt.CSSStyle.SKIN_ALTA,
  'title': {'style': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_13 + 'color: #252525;')},
  'subtitle': {'style': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA + 'color: #252525;')},
  'footnote': {'style': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_11)},
  '_statusMessageStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_13 + 'color: #252525;'),
  'pieCenter': {'labelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA)},

  'styleDefaults': {
    'seriesEffect': 'color',
    'colors': dvt.CSSStyle.COLORS_ALTA,
    'dataLabelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA),
    'stackLabelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD),
    'stockRisingColor': '#6b6f74',
    'stockFallingColor': '#ED6647'
  }
};

/**
 * Defaults for version 1.
 * @const
 */
DvtChartDefaults.VERSION_1 = {
  'skin': dvt.CSSStyle.SKIN_SKYROS, 'emptyText': null,
  'type': 'bar', 'stack': 'off', 'stackLabel': 'off', 'orientation': 'vertical', 'polarGridShape': 'circle',
  'selectionMode': 'none', 'hideAndShowBehavior': 'none', 'hoverBehavior': 'none',
  'zoomAndScroll': 'off', 'zoomDirection': 'auto', 'initialZooming': 'none', 'dragMode': 'user',
  'sorting': 'off', 'otherThreshold': 0,
  'animationOnDataChange': 'none', 'animationOnDisplay': 'none',
  '__sparkBarSpacing': 'subpixel', '__spark': false,
  'dataCursor': 'auto', 'dataCursorBehavior': 'auto',
  'drilling': 'off',
  'highlightMatch' : 'all',
  'series': [],
  'groups': [],
  'title': {'style': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_SKYROS + 'font-size: 12px; color: #003d5b; font-weight: bold'), 'halign': 'start'},
  'subtitle': {'style': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_SKYROS + 'font-size: 12px; color: #003d5b;')},
  'footnote': {'style': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_SKYROS + 'font-size: 10px; color: #333333;'), 'halign': 'start'},
  'titleSeparator': { 'upperColor': '#74779A', 'lowerColor': '#FFFFFF', 'rendered': 'off'},
  'touchResponse': 'auto',
  '_statusMessageStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_SKYROS + 'font-size: 12px; color: #003d5b; font-weight: bold'),

  'xAxis': {
    'tickLabel': {'rendered': 'on'},
    'majorTick': {'rendered': 'auto'},
    'minorTick': {'rendered': 'auto'},
    'axisLine': {'rendered': 'on'},
    'scale': 'linear',
    'maxSize': 0.33
  },
  'yAxis': {
    'tickLabel': {'rendered': 'on'},
    'majorTick': {'rendered': 'auto'},
    'minorTick': {'rendered': 'auto'},
    'axisLine': {'rendered': 'on'},
    'scale': 'linear',
    'maxSize': 0.33
  },
  'y2Axis': {
    'tickLabel': {'rendered': 'on'},
    'majorTick': {'rendered': 'auto'},
    'minorTick': {'rendered': 'auto'},
    'axisLine': {'rendered': 'on'},
    'scale': 'linear',
    'maxSize': 0.33,
    'alignTickMarks': 'on'
  },
  'pieCenter': {'labelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_SKYROS)},
  'pieCenterLabel': {},
  'plotArea': {'backgroundColor': null},

  'legend': {
    'position': 'auto',
    'rendered': 'auto',
    'maxSize': 0.3,
    'layout': {'gapRatio': 1.0},
    'seriesSection': {},
    'referenceObjectSection': {},
    'sections': []
  },

  'overview': {
    'rendered': 'off'
  },

  'styleDefaults': {
    'colors': dvt.CSSStyle.COLORS_SKYROS, 'borderColor': 'auto', 'borderWidth': 'auto',
    'patterns': ['smallDiagonalRight', 'smallChecker', 'smallDiagonalLeft', 'smallTriangle', 'smallCrosshatch', 'smallDiamond',
                 'largeDiagonalRight', 'largeChecker', 'largeDiagonalLeft', 'largeTriangle', 'largeCrosshatch', 'largeDiamond'],
    'shapes': ['square', 'circle', 'diamond', 'plus', 'triangleDown', 'triangleUp'],
    'seriesEffect': 'gradient', 'threeDEffect': 'off', 'selectionEffect': 'highlight',
    'animationDuration': 1000, 'animationIndicators': 'all',
    'animationUpColor': '#0099FF', 'animationDownColor': '#FF3300',
    'lineStyle': 'solid', 'lineType': 'auto', 'markerDisplayed': 'auto',
    'markerColor': null, 'markerShape': 'auto', 'markerSize': 8,
    'marqueeColor': 'rgba(255,255,255,0.5)', 'marqueeBorderColor': 'rgba(0,0,0,0.2)',
    'pieFeelerColor': '#BAC5D6', 'pieInnerRadius': 0,
    'selectedInnerColor': '#ffffff', 'selectedOuterColor': '#5a5a5a',
    'sliceLabelType': 'percent',
    'otherColor': '#4b4b4b',
    'stockRisingColor': '#006666',
    'stockFallingColor': '#CC3300',
    'stockRangeColor': '#B8B8B8',
    'dataItemGaps': '0%',
    'dataLabelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_SKYROS + dvt.BaseComponentDefaults.FONT_SIZE_11),
    'dataLabelPosition': 'auto',
    'funnelBackgroundColor': '#EDEDED',
    'x1Format': {}, 'y1Format': {}, 'y2Format': {}, 'zFormat': {},
    '_defaultSliceLabelColor': '#333333',
    '_scrollbarHeight': 3, '_scrollbarTrackColor': '#F0F0F0', '_scrollbarHandleColor': '#9E9E9E',
    'hoverBehaviorDelay' : 200,
    'dataCursor': {'markerSize': 8, 'markerDisplayed': 'on', 'lineColor': '#5a5a5a', 'lineWidth': 2, 'lineStyle': 'solid'},
    'groupSeparators' : {'rendered' : 'on', color: 'rgba(138,141,172,0.4)'},
    'padding': 'auto',
    '_tooltipStyle': new dvt.CSSStyle('border-collapse: separate; border-spacing: 2px'),
    'tooltipLabelStyle': new dvt.CSSStyle('color: #737373; padding: 0px 2px; white-space: nowrap;'),
    'tooltipValueStyle': new dvt.CSSStyle('color: #333333; padding: 0px 2px;'),
    'stackLabelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_SKYROS + dvt.BaseComponentDefaults.FONT_SIZE_11)
  },

  'layout': {
    'gapWidthRatio': null, 'gapHeightRatio': null, // gap ratio is dynamic based on the component size
    // TODO, the following are internal and should be moved to a _layout object
    'outerGapWidth': 10, 'outerGapHeight': 8,
    'titleSubtitleGapWidth': 14, 'titleSubtitleGapHeight': 4,
    'titleSeparatorGap': 6, 'titlePlotAreaGap': 10, 'footnoteGap': 7, 'verticalAxisGap': 6,
    'legendGapWidth': 10, 'legendGapHeight': 10, 'tickLabelGapHeight': 5, 'tickLabelGapWidth': 7
  },

  '_locale': 'en-us', '_resources': {}
};


/**
 * Scales down gap widths based on the width of the component.
 * @param {dvt.Chart} chart The chart that is being rendered.
 * @param {Number} defaultWidth The default gap width.
 * @return {Number}
 */
DvtChartDefaults.getGapWidth = function(chart, defaultWidth) {
  return Math.ceil(defaultWidth * chart.getGapWidthRatio());
};

/**
 * Scales down gap heights based on the height of the component.
 * @param {dvt.Chart} chart The chart that is being rendered.
 * @param {Number} defaultHeight The default gap height.
 * @return {Number}
 */
DvtChartDefaults.getGapHeight = function(chart, defaultHeight) {
  return Math.ceil(defaultHeight * chart.getGapHeightRatio());
};

/**
 * Returns true if the skyros skin effects should be used.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartDefaults.isSkyrosSkin = function(chart) {
  return chart.getSkin() == dvt.CSSStyle.SKIN_SKYROS;
};

/**
 * Returns true if the post-Alta skin effects should be used.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartDefaults.isPostAltaSkin = function(chart) {
  return chart.getSkin() != dvt.CSSStyle.SKIN_SKYROS && chart.getSkin() != dvt.CSSStyle.SKIN_ALTA;
};

/**
 * @override
 */
DvtChartDefaults.prototype.getNoCloneObject = function(chart) {
  // TODO: Put logic for no clone here
  return {};
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
/*---------------------------------------------------------------------*/
/*  DvtChartDataCursorHandler                 Data Cursor Event Handler                  */
/*---------------------------------------------------------------------*/
/**
 *  @class  DvtChartDataCursorHandler
 *  @extends {dvt.Obj}
 *  @constructor
 */
var DvtChartDataCursorHandler = function(chart, dataCursor) {
  this.Init(chart, dataCursor);
};

dvt.Obj.createSubclass(DvtChartDataCursorHandler, dvt.Obj);

// TODO CLEANUP: Major cleanup needed

DvtChartDataCursorHandler.prototype.Init = function(chart, dataCursor) {
  this._context = chart.getCtx();
  this._dataCursorShown = false;
  this._dataCursor = dataCursor;
  this._chart = chart;
};

// Show/hide the data cursor based on the global page coordinates of the action
// Returns whether or not data cursor is shown
DvtChartDataCursorHandler.prototype.processMove = function(pos, bSuppressEvent) {
  var plotRect = this._chart.__getPlotAreaSpace();
  if (plotRect.containsPoint(pos.x, pos.y)) {
    // Show the data cursor only if the current point is within the plot area
    this._showDataCursor(plotRect, pos.x, pos.y, bSuppressEvent);
    return true;
  }
  else {
    this._removeDataCursor(bSuppressEvent);
  }
  return false;
};

DvtChartDataCursorHandler.prototype.processEnd = function(bSuppressEvent) {
  this._removeDataCursor(bSuppressEvent);
};

DvtChartDataCursorHandler.prototype.processOut = function(pos, bSuppressEvent) {
  var plotRect = this._chart.__getPlotAreaSpace();
  if (!plotRect.containsPoint(pos.x, pos.y)) {
    this._removeDataCursor(bSuppressEvent);
  }
};

/**
 * Displays the data cursor.
 * @param {dvt.Rectangle} plotRect The bounds of the plot area
 * @param {number} x
 * @param {number} y
 * @param {object} targetObj
 * @private
 */
DvtChartDataCursorHandler.prototype._showDataCursor = function(plotRect, x, y, bSuppressEvent) {
  if (this._context.isOffscreen()) {
    this._removeDataCursor(bSuppressEvent);
    return;
  }

  var dataCursor = this._dataCursor;

  // Find the closest data point
  var closestMatch = this._getClosestMatch(x, y);
  if (closestMatch == null) {
    this._removeDataCursor(bSuppressEvent);
    return;
  }

  // Find the center of the data item
  var centerPoint = closestMatch.matchRegion.getCenter();

  var dcX = x;
  var dcY = y;
  // Adjust for snap behavior
  if (dataCursor.getBehavior() == DvtChartDataCursor.BEHAVIOR_SNAP) {
    if (dataCursor.isHorizontal())
      dcY = Math.min(Math.max(centerPoint.y, plotRect.y), plotRect.y + plotRect.h);
    else
      dcX = Math.min(Math.max(centerPoint.x, plotRect.x), plotRect.x + plotRect.w);
  }

  // If "dataCursor" attr is "auto", don't show the data cursor if tooltip text is null. Otherwise, always show the cursor.
  var tooltipText = DvtChartTooltipUtils.getDatatip(this._chart, closestMatch.sidx, closestMatch.gidx, true);
  if (tooltipText == null) {
    dataCursor.setVisible(false);
    return;
  }
  else
    dataCursor.setVisible(true);

  var seriesColor = DvtChartTooltipUtils.getDatatipColor(this._chart, closestMatch.sidx, closestMatch.gidx);
  var lineCoord = dataCursor.isHorizontal() ? dcY : dcX;
  dataCursor.render(plotRect, centerPoint.x, centerPoint.y, lineCoord, tooltipText, seriesColor);

  this._dataCursorShown = true;

  // fire optionChange event
  if (!bSuppressEvent) {
    var values = this._chart.getValuesAt(x, y);
    this._chart.changeOption('dataCursorPosition', values);
  }
};

// Remove the data cursor
DvtChartDataCursorHandler.prototype._removeDataCursor = function(bSuppressEvent) {
  if (this._dataCursor.getVisible())
    this._dataCursor.setVisible(false);

  this._context.getTooltipManager(DvtChartDataCursor.TOOLTIP_ID).hideTooltip();

  this._dataCursorShown = false;

  // fire optionChange event
  if (!bSuppressEvent)
    this._chart.changeOption('dataCursorPosition', null);
};

DvtChartDataCursorHandler.prototype.isDataCursorShown = function() {
  return this._dataCursorShown;
};

DvtChartDataCursorHandler._getClosestMatchSecondDirection = function(matchesInBounds, horizontal, x, y) {
  var closestMatch = null;
  var minDiff = Infinity;
  for (var i = 0; i < matchesInBounds.length; i++) {
    var match = matchesInBounds[i];
    var lowerBound = (horizontal) ? match.matchRegion.x : match.matchRegion.y;
    var higherBound = (horizontal) ? match.matchRegion.x + match.matchRegion.w : match.matchRegion.y + match.matchRegion.h;
    var value = (horizontal) ? x : y;
    var midPoint = (lowerBound + higherBound) / 2;
    var diffValue = Math.round(Math.abs(midPoint - value));
    if (diffValue < minDiff) {
      minDiff = diffValue;
      closestMatch = match;
    }
  }
  return closestMatch;
};

DvtChartDataCursorHandler._getClosestMatchesFirstDirection = function(matches, horizontal, x, y) {
  var minDiff = Infinity;
  var closestFirstDirectionMatches = new Array();
  // Get closest matches
  for (var i = 0; i < matches.length; i++) {
    var matchObj = matches[i];
    var lowerBound = (horizontal) ? matchObj.matchRegion.y : matchObj.matchRegion.x;
    var higherBound = (horizontal) ? matchObj.matchRegion.y + matchObj.matchRegion.h : matchObj.matchRegion.x + matchObj.matchRegion.w;
    var value = (horizontal) ? y : x;

    var midPoint = (lowerBound + higherBound) / 2;
    var diffValue = Math.round(Math.abs(midPoint - value));
    if (diffValue <= minDiff) {
      if (diffValue < minDiff) {
        closestFirstDirectionMatches = new Array();
      }
      closestFirstDirectionMatches.push(matchObj);
      minDiff = diffValue;
    }
  }
  return closestFirstDirectionMatches;
};

// TODO JSDOC: This class needs to be rewritten to not access private properties and get rid of these implicit object returns.
DvtChartDataCursorHandler.prototype._findMatches = function() {
  var stage = this._context.getStage();
  var eventManager = this._chart.getEventManager();
  var matches = [];

  if (!this._chart._currentMarkers)
    return null;

  for (var i = 0; i < this._chart._currentMarkers.length; i++) {
    var markers = this._chart._currentMarkers[i];
    var numMarkers = markers.length;

    for (var idx = 0; idx < numMarkers; idx++) {
      var item = markers[idx];
      var logicalObject = eventManager.GetLogicalObject(item);

      // Find the bounding box of the item.  We use getDimensionsSelf, an optimized version of getDimensions, where
      // possible.  It's safe to use either API since chart data objects do not have children.
      var dims = item.getDimensionsSelf ? item.getDimensionsSelf(stage) : item.getDimensions(stage);

      var match = { obj: item, matchRegion: dims, gidx: logicalObject.getGroupIndex(), sidx: logicalObject.getSeriesIndex(), marker: null };
      matches.push(match);
    }
  }
  return matches;
};

DvtChartDataCursorHandler.prototype._getClosestMatch = function(x, y) {
  var horizontal = DvtChartTypeUtils.isHorizontal(this._chart);
  var useAllInGroup = DvtChartTypeUtils.isLineArea(this._chart) && !DvtChartAxisUtils.isMixedFrequency(this._chart);

  var matches = this._findMatches();

  var matchesInBounds = DvtChartDataCursorHandler._getClosestMatchesFirstDirection(matches, horizontal, x, y);

  // Non-numerical x axis
  if (!DvtChartTypeUtils.isScatterBubble(this._chart)) {
    var closestLowerBound = Infinity;
    var closestHigherBound = -Infinity;
    var closestGroup = null;

    for (var i = 0; i < matchesInBounds.length; i++) {
      var closestFirstDirectionMatch = matchesInBounds[i];
      closestLowerBound = Math.min(closestLowerBound, (horizontal) ? closestFirstDirectionMatch.matchRegion.y : closestFirstDirectionMatch.matchRegion.x);
      closestHigherBound = Math.max(closestHigherBound, (horizontal) ? closestFirstDirectionMatch.matchRegion.y + closestFirstDirectionMatch.matchRegion.h : closestFirstDirectionMatch.matchRegion.x + closestFirstDirectionMatch.matchRegion.w);
      closestGroup = closestFirstDirectionMatch.gidx;
    }

    for (var i = 0; i < matches.length; i++) {
      var match = matches[i];
      var itemGroup = match.gidx;
      if (useAllInGroup) {
        if (closestGroup == itemGroup) {
          matchesInBounds.push(match);
        }
      }
      else {
        var lowerBound = (horizontal) ? match.matchRegion.y : match.matchRegion.x;
        var higherBound = (horizontal) ? match.matchRegion.y + match.matchRegion.h : match.matchRegion.x + match.matchRegion.w;
        var midPoint = (lowerBound + higherBound) / 2;
        if (closestHigherBound >= midPoint && closestLowerBound <= midPoint) {
          matchesInBounds.push(match);
        }

      }
    }
  }
  return DvtChartDataCursorHandler._getClosestMatchSecondDirection(matchesInBounds, horizontal, x, y);
};
// Copyright (c) 2011, 2016, Oracle and/or its affiliates. All rights reserved.
/**
  *  Creates a selectable shape using SVG path commands.
  *  @extends {dvt.Path}
  *  @class DvtChartSelectableWedge  Creates an arbitrary shape using SVG path commands.
  *  @constructor
  *  @param {dvt.Context} context
  *  @param {number} cx  The center x position.
  *  @param {number} cy  The center y position.
  *  @param {number} rx  The horizontal radius of the ellipse.
  *  @param {number} ry  The vertical radius of the ellipse.
  *  @param {number} sa  The starting angle in degrees (following the normal anti-clockwise is positive convention).
  *  @param {number} ae  The angle extent in degrees (following the normal anti-clockwise is positive convention).
  *  @param {number} gap The data item gap.
  *  @param {number} ir The inner radius.
  *  @param {String} id  Optional ID for the shape (see {@link  dvt.Displayable#setId}).
  */
var DvtChartSelectableWedge = function(context, cx, cy, rx, ry, sa, ae, gap, ir, id) {
  this.Init(context, null, id);
  this.setWedgeParams(cx, cy, rx, ry, sa, ae, gap, ir);
};

dvt.Obj.createSubclass(DvtChartSelectableWedge, dvt.Path);

/** @private @const */
DvtChartSelectableWedge._OUTER_BORDER_WIDTH = 2;

/** @private @const */
DvtChartSelectableWedge._OUTER_BORDER_WIDTH_HOVER = 1.25;

/** @private @const */
DvtChartSelectableWedge._INNER_BORDER_WIDTH = 1;

/**
  *  Object initializer.
  *  @param {dvt.Context} context
  *  @param {Object} cmds  Optional string of SVG path commands (see comment for
  *                        {@link dvt.Path#setCmds}), or an array containing
  *                        consecutive command and coordinate entries (see comment
  *                        for {@link dvt.Path#setCommands}).
  * @param {String} id  Optional ID for the shape (see {@link  dvt.Displayable#setId}).
 *  @protected
 */
DvtChartSelectableWedge.prototype.Init = function(context, cmds, id) {
  DvtChartSelectableWedge.superclass.Init.call(this, context, cmds, id);

};


/**
  *  Sets the path commands based on the wedge parameters
  *  @param {number} cx  The center x position.
  *  @param {number} cy  The center y position.
  *  @param {number} rx  The horizontal radius.
  *  @param {number} ry  The vertical radius.
  *  @param {number} sa  The starting angle in degrees (following the normal anti-clockwise is positive convention).
  *  @param {number} ae  The angle extent in degrees (following the normal anti-clockwise is positive convention).
  *  @param {number} gap The gap between wedges.
  *  @param {number} ir The inner radius of the wedge.
 */
DvtChartSelectableWedge.prototype.setWedgeParams = function(cx, cy, rx, ry, sa, ae, gap, ir) {
  this._cx = cx;
  this._cy = cy;
  this._rx = rx;
  this._ry = ry;
  this._sa = sa;
  this._ae = ae;
  this._gap = gap;
  this._ir = ir;
  var cmds = this._makeWedgePath(0);
  this.setCmds(cmds);
};

/**
 * Returns the path string for a wedge based on the set params.
 *  @param {number} inset  The number of pixels to inset the path.
 *  @return {String} the path commands for creating the wedge
 * @private
 */
DvtChartSelectableWedge.prototype._makeWedgePath = function(inset) {
  var rx = Math.max(this._rx - inset, 0);
  var ry = Math.max(this._ry - inset, 0);
  var gap = (this._ae == 360 || rx < inset) ? 0 : this._gap + 2 * inset;
  var ir = this._ir ? this._ir + inset : 0;

  var angleExtentRads = (this._ae == 360) ? dvt.Math.degreesToRads(359.99) : dvt.Math.degreesToRads(this._ae);
  var startAngleRads = dvt.Math.degreesToRads(this._sa);
  var dataItemGaps = gap / 2;

  var gapAngle = (dataItemGaps < rx) ? Math.asin(dataItemGaps / rx) : 0;
  var centerLineAngle = - angleExtentRads / 2 - startAngleRads;

  // distanceToStartPoint should be correlated with the dataItemGaps in that dimension- needed for 3D pies because rx != ry.
  var distanceToStartPointX = Math.min(dataItemGaps * 5, angleExtentRads > 0 ? Math.abs(dataItemGaps / Math.sin(angleExtentRads / 2)) : 0);
  var distanceToStartPointY = (rx == 0) ? distanceToStartPointX : distanceToStartPointX * ry / rx;

  var startPointX = this._cx + Math.cos(centerLineAngle) * distanceToStartPointX;
  var startPointY = this._cy + Math.sin(centerLineAngle) * distanceToStartPointY;

  var arcPointX = this._cx + Math.cos(-gapAngle - startAngleRads) * rx;
  var arcPointY = this._cy + Math.sin(-gapAngle - startAngleRads) * ry;

  var arcPoint2X = this._cx + Math.cos(-startAngleRads - angleExtentRads + gapAngle) * rx;
  var arcPoint2Y = this._cy + Math.sin(-startAngleRads - angleExtentRads + gapAngle) * ry;

  var pathCommands;
  if (ir > 0) {
    var innerGapAngle = (dataItemGaps < ir) ? Math.asin(dataItemGaps / ir) : 0;
    var innerPointX = this._cx + Math.cos(-innerGapAngle - startAngleRads) * ir;
    var innerPointY = this._cy + Math.sin(-innerGapAngle - startAngleRads) * ir;

    var innerPoint2X = this._cx + Math.cos(-startAngleRads - angleExtentRads + innerGapAngle) * ir;
    var innerPoint2Y = this._cy + Math.sin(-startAngleRads - angleExtentRads + innerGapAngle) * ir;
    if (this._ae == 360) {
      pathCommands = dvt.PathUtils.moveTo(arcPoint2X, arcPoint2Y);
      pathCommands += dvt.PathUtils.arcTo(rx, ry, angleExtentRads, 1, arcPointX, arcPointY);
      pathCommands += dvt.PathUtils.lineTo(arcPoint2X, arcPoint2Y);
      pathCommands += dvt.PathUtils.moveTo(innerPointX, innerPointY);
      pathCommands += dvt.PathUtils.arcTo(ir, ir, angleExtentRads, 0, innerPoint2X, innerPoint2Y);
    }
    else {
      pathCommands = dvt.PathUtils.moveTo(innerPoint2X, innerPoint2Y);
      pathCommands += dvt.PathUtils.lineTo(arcPoint2X, arcPoint2Y);
      pathCommands += dvt.PathUtils.arcTo(rx, ry, angleExtentRads, 1, arcPointX, arcPointY);
      pathCommands += dvt.PathUtils.lineTo(innerPointX, innerPointY);
      pathCommands += dvt.PathUtils.arcTo(ir, ir, angleExtentRads, 0, innerPoint2X, innerPoint2Y);
    }
  }
  else {
    if (this._ae == 360) {
      pathCommands = dvt.PathUtils.moveTo(arcPoint2X, arcPoint2Y);
      pathCommands += dvt.PathUtils.arcTo(rx, ry, angleExtentRads, 1, arcPointX, arcPointY);
    }
    else {
      pathCommands = dvt.PathUtils.moveTo(startPointX, startPointY);
      pathCommands += dvt.PathUtils.lineTo(arcPoint2X, arcPoint2Y);
      pathCommands += dvt.PathUtils.arcTo(rx, ry, angleExtentRads, 1, arcPointX, arcPointY);
      pathCommands += dvt.PathUtils.lineTo(startPointX, startPointY);
    }
  }

  pathCommands += dvt.PathUtils.closePath();
  return pathCommands;
};

/**
 * Helper function that creates and adds the shapes used for displaying hover and selection effects. Should only be
 * called on hover or select operations, since it assumes that the fill, stroke, and shape size are already determined.
 * @private
 */
DvtChartSelectableWedge.prototype._initializeSelectionEffects = function() {
  // Calculate the geometry of the shapes used for the selection effects
  var outerBorderWidth = this.isSelected() ? DvtChartSelectableWedge._OUTER_BORDER_WIDTH : DvtChartSelectableWedge._OUTER_BORDER_WIDTH_HOVER;
  var outerChildCmds = this._makeWedgePath(outerBorderWidth);
  var innerChildCmds = this._makeWedgePath(outerBorderWidth + DvtChartSelectableWedge._INNER_BORDER_WIDTH);

  // Just update the geometries if already initialized
  if (this.OuterChild) {
    this.OuterChild.setCmds(outerChildCmds);
    this.InnerChild.setCmds(innerChildCmds);
    return;
  }

  this.OuterChild = new dvt.Path(this.getCtx(), outerChildCmds);
  this.OuterChild.setInvisibleFill();
  this.OuterChild.setMouseEnabled(true);
  this.addChild(this.OuterChild);

  this.InnerChild = new dvt.Path(this.getCtx(), innerChildCmds);
  this.InnerChild.setInvisibleFill();
  this.InnerChild.setMouseEnabled(true);
  this.addChild(this.InnerChild);
};

/**
 * Helper function to apply border colors for hover and selection.
 * @param {string=} outerBorderColor
 * @param {string=} innerBorderColor
 * @private
 */
DvtChartSelectableWedge.prototype._showNestedBorders = function(outerBorderColor, innerBorderColor) {
  // Ensure that selection and hover shapes are created
  this._initializeSelectionEffects();

  // Modify the shapes based on which borders should be shown
  if (innerBorderColor) {
    this.setSolidFill(outerBorderColor);
    this.setStroke(null);
    this.OuterChild.setSolidFill(innerBorderColor);
    this.InnerChild.setFill(this._fill);
  }
  else if (outerBorderColor) {
    this.setSolidFill(outerBorderColor);
    this.setStroke(null);
    this.OuterChild.setFill(this._fill);
    this.InnerChild.setInvisibleFill();
  }
  else {
    this.setFill(this._fill);
    this.setStroke(this._shapeStroke);
    this.OuterChild.setInvisibleFill();
    this.InnerChild.setInvisibleFill();
  }
};

/**
 * Specifies the colors needed to generate the selection effect.
 * @param {dvt.Fill} fill
 * @param {dvt.Stroke} stroke
 * @param {string} dataColor The color of the data.
 * @param {string} innerColor The color of the inner selection border.
 * @param {string} outerColor The color of the outer selection border.
 */
DvtChartSelectableWedge.prototype.setStyleProperties = function(fill, stroke, dataColor, innerColor, outerColor)
{
  this._fill = fill;
  // Save original stroke style to get reapplied in _showNestedBorders. Cannot use this._stroke, as it gets overwritten during select and hover
  this._shapeStroke = stroke;
  this._hoverColor = dvt.SelectionEffectUtils.getHoverBorderColor(dataColor);
  this._innerColor = innerColor;
  this._outerColor = outerColor;

  // Apply the fill and stroke
  this.setFill(fill);
  if (stroke)
    this.setStroke(stroke);
};

/**
 * @override
 */
DvtChartSelectableWedge.prototype.showHoverEffect = function()
{
  this.IsShowingHoverEffect = true;
  this._showNestedBorders(this._hoverColor, this._innerColor);
};


/**
 * @override
 */
DvtChartSelectableWedge.prototype.hideHoverEffect = function()
{
  this.IsShowingHoverEffect = false;
  if (this.isSelected())
    this._showNestedBorders(this._outerColor, this._innerColor);
  else
    this._showNestedBorders();
};


/**
 * @override
 */
DvtChartSelectableWedge.prototype.setSelected = function(selected)
{
  if (this.IsSelected == selected)
    return;

  this.IsSelected = selected;
  if (this.isHoverEffectShown())
    this._showNestedBorders(this._hoverColor, this._innerColor);
  else if (this.isSelected())
    this._showNestedBorders(this._outerColor, this._innerColor);
  else
    this._showNestedBorders();
};


/**
 * @override
 */
DvtChartSelectableWedge.prototype.UpdateSelectionEffect = function() {
  // noop: Selection effects fully managed by this class
};
// Copyright (c) 2011, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 * A selectable polygon displayable.
 * @class DvtChartSelectableRectangularPolygon
 * @extends {dvt.Polygon}
 * @constructor
 * @param {dvt.Context} context
 * @param {array} arPoints The array of coordinates for this polygon, in the form [x1,y1,x2,y2...].
 * @param {string} id The optional id for the corresponding DOM element.
 */
var DvtChartSelectableRectangularPolygon = function(context, arPoints, id)
{
  this._x1 = Math.min(arPoints[0], arPoints[4]);
  this._x2 = Math.max(arPoints[0], arPoints[4]);
  this._y1 = Math.min(arPoints[1], arPoints[5]);
  this._y2 = Math.max(arPoints[1], arPoints[5]);
  this.Init(context, [this._x1, this._y1, this._x2, this._y1, this._x2, this._y2, this._x1, this._y2], id);
};

dvt.Obj.createSubclass(DvtChartSelectableRectangularPolygon, dvt.Polygon);


/** @const */
DvtChartSelectableRectangularPolygon.OUTER_BORDER_WIDTH = 2;

/** @const */
DvtChartSelectableRectangularPolygon.OUTER_BORDER_WIDTH_HOVER = 1.25;

/** @const */
DvtChartSelectableRectangularPolygon.INNER_BORDER_WIDTH = 1;

/** @const */
DvtChartSelectableRectangularPolygon.SHAPE_EXPAND_SELECTION = 1;

/**
 * Specifies the colors needed to generate the selection effect.
 * @param {dvt.Fill} fill
 * @param {dvt.Stroke} stroke
 * @param {string} dataColor The color of the data.
 * @param {string} innerColor The color of the inner selection border.
 * @param {string} outerColor The color of the outer selection border.
 */
DvtChartSelectableRectangularPolygon.prototype.setStyleProperties = function(fill, stroke, dataColor, innerColor, outerColor)
{
  this._fill = fill;
  // Save original stroke style to get reapplied in _showNestedBorders. Cannot use this._stroke, as it gets overwritten during select and hover
  this._borderStroke = stroke;
  this._hoverColor = dvt.SelectionEffectUtils.getHoverBorderColor(dataColor);
  this._innerColor = innerColor;
  this._outerColor = outerColor;

  // Apply the fill and stroke
  this.setFill(fill);
  if (stroke)
    this.setStroke(stroke);
};

/**
 * To allow the updating of the size of the child shapes during animation
 * @param {array} ar The array of points.
 */
DvtChartSelectableRectangularPolygon.prototype.setAnimationParams = function(ar) {
  this._x1 = Math.min(ar[0], ar[4]);
  this._x2 = Math.max(ar[0], ar[4]);
  this._y1 = Math.min(ar[1], ar[5]);
  this._y2 = Math.max(ar[1], ar[5]);
  this.setPoints(ar);
  this._initializeSelectionEffects();
};

/**
 * @override
 */
DvtChartSelectableRectangularPolygon.prototype.showHoverEffect = function()
{
  this.IsShowingHoverEffect = true;
  this._showNestedBorders(this._hoverColor, this._innerColor);
};


/**
 * @override
 */
DvtChartSelectableRectangularPolygon.prototype.hideHoverEffect = function()
{
  this.IsShowingHoverEffect = false;
  if (this.isSelected())
    this._showNestedBorders(this._outerColor, this._innerColor);
  else
    this._showNestedBorders();
};


/**
 * @override
 */
DvtChartSelectableRectangularPolygon.prototype.setSelected = function(selected)
{
  if (this.IsSelected == selected)
    return;

  this.IsSelected = selected;
  if (this.isHoverEffectShown())
    this._showNestedBorders(this._hoverColor, this._innerColor);
  else if (this.isSelected())
    this._showNestedBorders(this._outerColor, this._innerColor);
  else
    this._showNestedBorders();
};


/**
 * @override
 */
DvtChartSelectableRectangularPolygon.prototype.UpdateSelectionEffect = function() {
  // noop: Selection effects fully managed by this class
};


/**
 * Returns the primary dvt.Fill for this bar. Used for animation, since getFill may return the fill of the selection
 * shapes.
 * @return {dvt.Fill}
 */
DvtChartSelectableRectangularPolygon.prototype.getPrimaryFill = function() {
  return this._fill;
};


/**
 * Helper function that creates and adds the shapes used for displaying hover and selection effects. Should only be
 * called on hover or select operations, since it assumes that the fill, stroke, and shape size are already determined.
 * @private
 */
DvtChartSelectableRectangularPolygon.prototype._initializeSelectionEffects = function() {
  // Calculate the geometry of the shapes used for the selection effects
  this.setPoints(this._createPointsArray(this.isSelected() ? - DvtChartSelectableRectangularPolygon.SHAPE_EXPAND_SELECTION : 0));
  var outerBorderWidth = this.isSelected() ? DvtChartSelectableRectangularPolygon.OUTER_BORDER_WIDTH - DvtChartSelectableRectangularPolygon.SHAPE_EXPAND_SELECTION : DvtChartSelectableRectangularPolygon.OUTER_BORDER_WIDTH_HOVER;
  var outerChildPoints = this._createPointsArray(outerBorderWidth);
  var innerChildPoints = this._createPointsArray(outerBorderWidth + DvtChartSelectableRectangularPolygon.INNER_BORDER_WIDTH);

  // Just update the geometries if already initialized
  if (this.OuterChild) {
    this.OuterChild.setPoints(outerChildPoints);
    this.InnerChild.setPoints(innerChildPoints);
    return;
  }

  this.OuterChild = new dvt.Polygon(this.getCtx(), outerChildPoints);
  this.OuterChild.setInvisibleFill();
  this.OuterChild.setMouseEnabled(true);
  this.addChild(this.OuterChild);

  this.InnerChild = new dvt.Polygon(this.getCtx(), innerChildPoints);
  this.InnerChild.setInvisibleFill();
  this.InnerChild.setMouseEnabled(true);
  this.addChild(this.InnerChild);
};

/**
 * Helper function to apply border colors for hover and selection.
 * @param {string=} outerBorderColor
 * @param {string=} innerBorderColor
 * @private
 */
DvtChartSelectableRectangularPolygon.prototype._showNestedBorders = function(outerBorderColor, innerBorderColor) {
  // Ensure that selection and hover shapes are created
  this._initializeSelectionEffects();

  // Modify the shapes based on which borders should be shown
  if (innerBorderColor) {
    this.setSolidFill(outerBorderColor);
    this.setStroke(null);
    this.OuterChild.setSolidFill(innerBorderColor);
    this.InnerChild.setFill(this._fill);
  }
  else if (outerBorderColor) {
    this.setSolidFill(outerBorderColor);
    this.setStroke(null);
    this.OuterChild.setFill(this._fill);
    this.InnerChild.setInvisibleFill();
  }
  else {
    this.setFill(this._fill);
    this.setStroke(this._borderStroke);
    this.OuterChild.setInvisibleFill();
    this.InnerChild.setInvisibleFill();
  }
};

/**
 * Returns the points array for the polygon used to render the polygon, with an inset to show nested border effects.
 * @param {number} inset The number of pixels to inset the polygon.  Defaults to 0.
 * @return {array} The list of points for the polygon
 * @private
 */
DvtChartSelectableRectangularPolygon.prototype._createPointsArray = function(inset) {
  var x1 = this._x1 + inset;
  var x2 = this._x2 - inset;
  var y1 = this._y1 + inset;
  var y2 = this._y2 - inset;
  return [x1, y1, x2, y1, x2, y2, x1, y2];
};
/**
 * Axis component for use by dvt.Chart.  This class exposes additional functions needed for
 * rendering grid lines and data items.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @class
 * @constructor
 * @extends {dvt.Axis}
 */
var DvtChartAxis = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

dvt.Obj.createSubclass(DvtChartAxis, dvt.Axis);

/**
 * Converts the axis coord to plot area coord.
 * @param {number} coord Axis coord.
 * @return {number} Plot area coord.
 */
DvtChartAxis.prototype.axisToPlotArea = function(coord) {
  if (this.getOptions()['position'] == 'tangential')
    return coord;

  if (coord == null)
    return null;

  var ret = coord - this.getLeftOverflow();

  // Round to 1 decimal to keep the DOM small, but prevent undesidered gaps due to rounding errors
  return Math.round(ret * 10) / 10;
};


/**
 * Converts the plot area coord to axis coord.
 * @param {number} coord Plot area coord.
 * @param {boolean=} bRoundResult Whether the resulting coordinate is rounded to the nearest pixel.  Defaults to true.
 * @return {number} Axis coord.
 */
DvtChartAxis.prototype.plotAreaToAxis = function(coord, bRoundResult) {
  if (this.getOptions()['position'] == 'tangential')
    return coord;

  if (coord == null)
    return null;

  var ret = coord + this.getLeftOverflow();
  return (bRoundResult === false) ? ret : Math.round(ret);
};


/**
 * Converts linear value to actual value.
 * For example, for a log scale, the linear value is the log of the actual value.
 * @param {number} value The linear value.
 * @return {number} The actual value.
 */
DvtChartAxis.prototype.linearToActual = function(value) {
  return this.Info.linearToActual(value);
};


/**
 * Converts actual value to linear value.
 * For example, for a log scale, the linear value is the log of the actual value.
 * @param {number} value The actual value.
 * @return {number} The linear value.
 */
DvtChartAxis.prototype.actualToLinear = function(value) {
  return this.Info.actualToLinear(value);
};


/**
 * Returns the value for the specified coordinate along the axis.  Returns null
 * if the coordinate is not within the axis.
 * @param {number} coord The coordinate along the axis.
 * @return {object} The value at that coordinate.
 */
DvtChartAxis.prototype.getValueAt = function(coord) {
  return this.Info.getValueAt(this.plotAreaToAxis(coord));
};


/**
 * Returns the coordinate for the specified value.
 * @param {object} value The value to locate.
 * @return {number} The coordinate for the value.
 */
DvtChartAxis.prototype.getCoordAt = function(value) {
  return this.axisToPlotArea(this.Info.getCoordAt(value));
};


/**
 * Returns the value for the specified coordinate along the axis.  If a coordinate
 * is not within the axis, returns the value of the closest coordinate within the axis.
 * @param {number} coord The coordinate along the axis.
 * @return {object} The value at that coordinate.
 */
DvtChartAxis.prototype.getBoundedValueAt = function(coord) {
  return this.Info.getBoundedValueAt(this.plotAreaToAxis(coord));
};


/**
 * Returns the coordinate for the specified value.  If a value is not within the axis,
 * returns the coordinate of the closest value within the axis.
 * @param {object} value The value to locate.
 * @return {number} The coordinate for the value.
 */
DvtChartAxis.prototype.getBoundedCoordAt = function(value) {
  return this.axisToPlotArea(this.Info.getBoundedCoordAt(value));
};


/**
 * Returns the value for the specified coordinate along the axis.
 * @param {number} coord The coordinate along the axis.
 * @return {object} The value at that coordinate.
 */
DvtChartAxis.prototype.getUnboundedValueAt = function(coord) {
  return this.Info.getUnboundedValueAt(this.plotAreaToAxis(coord));
};


/**
 * Returns the coordinate for the specified value.
 * @param {object} value The value to locate.
 * @return {number} The coordinate for the value.
 */
DvtChartAxis.prototype.getUnboundedCoordAt = function(value) {
  return this.axisToPlotArea(this.Info.getUnboundedCoordAt(value));
};


/**
 * Returns the baseline coordinate for the axis, if applicable.
 * @return {number} The baseline coordinate for the axis.
 */
DvtChartAxis.prototype.getBaselineCoord = function() {
  return this.axisToPlotArea(this.Info.getBaselineCoord());
};


/**
 * Returns the position of the axis relative to the chart.
 * @return {string} The position of the axis.
 */
DvtChartAxis.prototype.getPosition = function() {
  return this.getOptions()['position'];
};


/**
 * Returns true if this is a group axis.
 * @return {boolean}
 */
DvtChartAxis.prototype.isGroupAxis = function() {
  return this.Info instanceof dvt.GroupAxisInfo;
};


/**
 * Returns true if this is a time axis.
 * @return {boolean}
 */
DvtChartAxis.prototype.isTimeAxis = function() {
  return this.Info instanceof dvt.TimeAxisInfo;
};


/**
 * Returns true if this is a data axis.
 * @return {boolean}
 */
DvtChartAxis.prototype.isDataAxis = function() {
  return this.Info instanceof dvt.DataAxisInfo;
};


/**
 * Returns the coordinates of the major ticks.
 * @return {array} Array of coords.
 */
DvtChartAxis.prototype.getMajorTickCoords = function() {
  var coords = this.Info ? this.Info.getMajorTickCoords() : [];
  for (var i = 0; i < coords.length; i++)
    coords[i] = this.axisToPlotArea(coords[i]);
  return coords;
};


/**
 * Returns the coordinates of the minor ticks.
 * @return {array} Array of coords.
 */
DvtChartAxis.prototype.getMinorTickCoords = function() {
  var coords = this.Info ? this.Info.getMinorTickCoords() : [];
  for (var i = 0; i < coords.length; i++)
    coords[i] = this.axisToPlotArea(coords[i]);
  return coords;
};


/**
 * Returns the coordinates of the baseline (value = 0). Only applies to numerical axis.
 * @return {number} Baseline coord.
 */
DvtChartAxis.prototype.getBaselineCoord = function() {
  return this.axisToPlotArea(this.Info.getBaselineCoord());
};


/**
 * Returns the linearized global min value of the axis.
 * @return {number} The global min value.
 */
DvtChartAxis.prototype.getLinearGlobalMin = function() {
  return this.actualToLinear(this.Info.getGlobalMin());
};


/**
 * Returns the linearized global max value of the axis.
 * @return {number} The global max value.
 */
DvtChartAxis.prototype.getLinearGlobalMax = function() {
  return this.actualToLinear(this.Info.getGlobalMax());
};


/**
 * Returns the linearized viewport min value of the axis.
 * @return {number} The viewport min value.
 */
DvtChartAxis.prototype.getLinearViewportMin = function() {
  return this.actualToLinear(this.Info.getViewportMin());
};


/**
 * Returns the linearized viewport max value of the axis.
 * @return {number} The viewport max value.
 */
DvtChartAxis.prototype.getLinearViewportMax = function() {
  return this.actualToLinear(this.Info.getViewportMax());
};


/**
 * Returns the linearized value for the specified coordinate along the axis.
 * @param {number} coord The coordinate along the axis.
 * @return {object} The linearized value at that coordinate.
 */
DvtChartAxis.prototype.getUnboundedLinearValueAt = function(coord) {
  return this.Info.actualToLinear(this.getUnboundedValueAt(coord));
};


/**
 * Returns whether the viewport is showing the full extent of the chart.
 * @return {boolean}
 */
DvtChartAxis.prototype.isFullViewport = function() {
  return this.Info.getViewportMin() == this.Info.getGlobalMin() && this.Info.getViewportMax() == this.Info.getGlobalMax();
};


/**
 * Returns how much the axis labels overflow to the left.
 * @return {number}
 */
DvtChartAxis.prototype.getLeftOverflow = function() {
  return dvt.Agent.isRightToLeft(this.getCtx()) ? this.Info.getEndOverflow() : this.Info.getStartOverflow();
};


/**
 * Returns how much the axis labels overflow to the right.
 * @return {number}
 */
DvtChartAxis.prototype.getRightOverflow = function() {
  return dvt.Agent.isRightToLeft(this.getCtx()) ? this.Info.getStartOverflow() : this.Info.getEndOverflow();
};


/**
 * Returns the length of the axis.
 * @return {number} The axis length.
 */
DvtChartAxis.prototype.getLength = function() {
  return Math.abs(this.Info.getStartCoord() - this.Info.getEndCoord());
};


/**
 * Returns the minimum coordinate of the axis.
 * @return {number}
 */
DvtChartAxis.prototype.getMinCoord = function() {
  return this.axisToPlotArea(Math.min(this.Info.getStartCoord(), this.Info.getEndCoord()));
};


/**
 * Returns the maximum coordinate of the axis.
 * @return {number}
 */
DvtChartAxis.prototype.getMaxCoord = function() {
  return this.axisToPlotArea(Math.max(this.Info.getStartCoord(), this.Info.getEndCoord()));
};
// Copyright (c) 2011, 2016, Oracle and/or its affiliates. All rights reserved.
/**
  *  A selectable bar for charting.
  *  @class DvtChartBar
  *  @extends {dvt.Polygon}
  *  @constructor
  *  @param {dvt.Chart} chart
  *  @param {number} axisCoord The location of the axis line.
  *  @param {number} baselineCoord The location from which the bar grows.
  *  @param {number} endCoord The location where the bar length ends.
  *  @param {number} x1 The left coord of a vertical bar, or the top of a horizontal bar.
  *  @param {number} x2 The right coord of a vertical bar, or the bottom of a horizontal bar.
  */
var DvtChartBar = function(chart, axisCoord, baselineCoord, endCoord, x1, x2)
{
  this.Init(chart.getCtx());
  this._bHoriz = DvtChartTypeUtils.isHorizontal(chart);
  this._bStacked = DvtChartTypeUtils.isStacked(chart);
  this._barGapRatio = DvtChartStyleUtils.getBarGapRatio(chart);
  this._dataItemGaps = DvtChartStyleUtils.getDataItemGaps(chart);
  this._axisCoord = axisCoord;

  // Calculate the points array and apply to the polygon
  this._setBarCoords(baselineCoord, endCoord, x1, x2, true);
};

dvt.Obj.createSubclass(DvtChartBar, DvtChartSelectableRectangularPolygon);

/** @private @const */
DvtChartBar._INDICATOR_OFFSET = 8;

/** @private @const */
DvtChartBar._MIN_BAR_WIDTH_FOR_GAPS = 5;

/** @private @const */
DvtChartBar._MIN_BAR_WIDTH_FOR_GAPS_PIXEL_HINTING = 15;

/** @private @const */
DvtChartBar._MIN_BAR_LENGTH_FOR_GAPS = 5;

/** @private @const */
DvtChartBar._MAX_GAP_SIZE = 2;


/**
 * @override
 */
DvtChartBar.prototype.setSelected = function(selected)
{
  if (this.IsSelected == selected)
    return;

  this.IsSelected = selected;
  if (this.isSelected()) {
    // Remove the gaps from the sides of the bar per UX spec
    this._tempX1 = this._x1;
    this._tempX2 = this._x2;
    this._tempBaselineCoord = this._baselineCoord;
    this._x1 = this._origX1;
    this._x2 = this._origX2;
    this._baselineCoord = this._origBaselineCoord;
    this.setPoints(this._createPointsArray());

    this._showNestedBorders(this.isHoverEffectShown() ? this._hoverColor : this._outerColor, this._innerColor);
  }
  else {
    // Restore the gaps from the sides of the bar per UX spec
    this._x1 = this._tempX1;
    this._x2 = this._tempX2;
    this._baselineCoord = this._tempBaselineCoord;
    this.setPoints(this._createPointsArray());

    this._showNestedBorders(this.isHoverEffectShown() ? this._hoverColor : null);
  }
};


/**
 * Returns the layout parameters for the current animation frame.
 * @param {boolean=} bFlip True if the result should be flipped for horizontal/vertical orientation change.
 * @return {array} The array of layout parameters.
 */
DvtChartBar.prototype.getAnimationParams = function(bFlip) {
  if (bFlip) {
    if (this._bHoriz) // flipping to vertical
      return [this._x2, this._x1, this._baselineCoord, this._endCoord];
    else // flipping to horizontal
      return [this._x1, this._x2, this._endCoord, this._baselineCoord];
  }
  else
    return [this._baselineCoord, this._endCoord, this._x1, this._x2];
};


/**
 * Sets the layout parameters for the current animation frame.
 * @param {array} params The array of layout parameters.
 * @param {dvt.Displayable=} indicator The animation indicator, whose geometry is centered at (0,0).
 */
DvtChartBar.prototype.setAnimationParams = function(params, indicator) {
  // Set bar coords but don't adjust for gaps, since they've already been factored in.
  this._setBarCoords(params[0], params[1], params[2], params[3], false);

  // Update animation indicator if present.
  if (indicator) {
    var indicatorPosition = this.getIndicatorPosition();
    indicator.setTranslate(indicatorPosition.x, indicatorPosition.y);
    indicator.setAlpha(1);

    // Reparent to keep indicator on top
    indicator.getParent().addChild(indicator);
  }
};


/**
 * Returns a dvt.Playable containing the animation of the bar to its initial data value.
 * @param {number} duration The duration of the animation in seconds.
 * @return {dvt.Playable} A playable for the initial bar animation.
 */
DvtChartBar.prototype.getDisplayAnimation = function(duration) {
  // Current state is the end state
  var endState = this.getAnimationParams();

  // Initialize the start state. To grow the bar, just set the end coord to the axis coord.
  this.setAnimationParams([this._axisCoord, this._axisCoord, this._x1, this._x2]);

  // Create and return the playable
  var nodePlayable = new dvt.CustomAnimation(this.getCtx(), this, duration);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this, this.getAnimationParams, this.setAnimationParams, endState);
  return nodePlayable;
};


/**
 * Returns a dvt.Playable containing the animation to delete the bar.
 * @param {number} duration The duration of the animation in seconds.
 * @return {dvt.Playable}
 */
DvtChartBar.prototype.getDeleteAnimation = function(duration) {
  // End state is for the bar length to shrink to 0
  var endState = [this._baselineCoord, this._baselineCoord, this._x1, this._x2];

  // Create and return the playable
  var nodePlayable = new dvt.CustomAnimation(this.getCtx(), this, duration);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this, this.getAnimationParams, this.setAnimationParams, endState);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.getAlpha, this.setAlpha, 0);
  return nodePlayable;
};


/**
 * Returns a dvt.Playable containing the insert animation of the bar.
 * @param {number} duration The duration of the animation in seconds.
 * @return {dvt.Playable}
 */
DvtChartBar.prototype.getInsertAnimation = function(duration) {
  // Initialize the alpha to fade in the bar
  this.setAlpha(0);

  // Create the playable
  var nodePlayable = this.getDisplayAnimation(duration);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.getAlpha, this.setAlpha, 1);
  return nodePlayable;
};


/**
 * Returns the position where the value change indicator should be displayed.
 * @return {dvt.Point}
 */
DvtChartBar.prototype.getIndicatorPosition = function() {
  var widthCoord = (this._x1 + this._x2) / 2;
  var x, y;
  if (this._bStacked) {
    // Center the indicator within the stacked bar
    var midLength = (this._endCoord + this._baselineCoord) / 2;
    x = this._bHoriz ? midLength : widthCoord;
    y = this._bHoriz ? widthCoord : midLength;
  }
  else {
    var lengthCoord = (this._endCoord >= this._baselineCoord) ? this._endCoord + DvtChartBar._INDICATOR_OFFSET :
                                                                this._endCoord - DvtChartBar._INDICATOR_OFFSET;
    x = this._bHoriz ? lengthCoord : widthCoord;
    y = this._bHoriz ? widthCoord : lengthCoord;
  }

  return new dvt.Point(x, y);
};


/**
 * Stores the point coords defining the bar.
 * @param {number} baselineCoord The location from which the bar grows.
 * @param {number} endCoord The location where the bar length ends.
 * @param {number} x1 The left coord of a vertical bar, or the top of a horizontal bar.
 * @param {number} x2 The right coord of a vertical bar, or the bottom of a horizontal bar.
 * @param {boolean} bAdjustForGaps True if the specified coordinate should be adjusted to produce gaps.
 * @private
 */
DvtChartBar.prototype._setBarCoords = function(baselineCoord, endCoord, x1, x2, bAdjustForGaps) {
  // Store the geometry values
  this._baselineCoord = baselineCoord;
  this._endCoord = endCoord;
  this._x1 = x1;
  this._x2 = x2;

  // Store the values before the gaps are applied
  this._origX1 = this._x1;
  this._origX2 = this._x2;
  this._origBaselineCoord = this._baselineCoord;

  // If data item gaps enabled, add gaps between bars.
  if (this._dataItemGaps > 0 && bAdjustForGaps && !this.isSelected()) {
    // Note: The gap sizes were found via experimentation and we may need to tweak them for browser updates. Firefox
    // vertical pixel hinting behavior requires double gaps.
    var gapSize = Math.ceil(DvtChartBar._MAX_GAP_SIZE * this._dataItemGaps);
    var barLength = Math.abs(this._baselineCoord - this._endCoord);
    var barWidth = this._x2 - this._x1;
    var bStartsAtBaseline = (this._axisCoord == this._baselineCoord);

    // Gaps between bars in stack
    if (barLength >= DvtChartBar._MIN_BAR_LENGTH_FOR_GAPS && this._bStacked && !bStartsAtBaseline)
      this._baselineCoord += (this._endCoord > this._baselineCoord ? gapSize : -gapSize);

    // Gaps between bars in cluster
    if (barWidth >= DvtChartBar._MIN_BAR_WIDTH_FOR_GAPS) {
      if (dvt.Agent.getDevicePixelRatio() == 1 && this._barGapRatio > 0 &&
          barWidth > DvtChartBar._MIN_BAR_WIDTH_FOR_GAPS_PIXEL_HINTING) {
        // If devicePixelRatio is 1, we need to be extremely precise since anti-aliasing must be disabled for correct
        // gaps. We can only do this for barGapRatio > 0, as otherwise positioning is more important than crispness.

        // Don't do this for FF though, since it does pixel hinting incorrectly.
        if (!dvt.Agent.isPlatformGecko())
          this.setPixelHinting(true);

        // Round the coords for crisp looking bars
        this._x1 = Math.round(this._x1);
        this._x2 = Math.round(this._x2);

        // Update to use the rounded coords
        this._origX1 = this._x1;
        this._origX2 = this._x2;

        // Apply the gap
        this._x2 -= gapSize;
      }
      else {
        // Browser zoom or retina display.  Allow anti-aliasing to do the work.
        this._x1 += gapSize / 2;
        this._x2 -= gapSize / 2;
      }
    }
  }

  // Calculate the points array for the outer shape
  var points = this._createPointsArray();
  this.setPoints(points);

  // If the inner shapes are already defined, update them as well
  if (this.OuterChild)
    this.OuterChild.setPoints(this._createPointsArray(DvtChartSelectableRectangularPolygon.OUTER_BORDER_WIDTH));

  if (this.InnerChild)
    this.InnerChild.setPoints(this._createPointsArray(DvtChartSelectableRectangularPolygon.OUTER_BORDER_WIDTH + DvtChartSelectableRectangularPolygon.INNER_BORDER_WIDTH));
};


/**
 * Returns the points array for the polygon used to render the bar. An optional inset can be provided to show nested
 * border effects. The inset is not applied along the baseline of the bar.
 * @param {number=} inset The number of pixels to inset the polygon.  Defaults to 0.
 * @return {array}
 * @private
 */
DvtChartBar.prototype._createPointsArray = function(inset) {
  var baselineCoord = this._baselineCoord;
  var endCoord = this._endCoord;
  var x1 = this._x1;
  var x2 = this._x2;

  // Check the inset if specified
  if (inset > 0) {
    // Ensure there's enough space for the inset
    if ((Math.abs(x1 - x2) < 2 * inset) || (Math.abs(baselineCoord - endCoord) < 2 * inset))
      return [];

    // x1 is always less than x2
    x1 += inset;
    x2 -= inset;

    // Relationship between baseline and endCoord aren't so static
    if (endCoord < baselineCoord) {
      baselineCoord -= inset;
      endCoord += inset;
    }
    else {
      baselineCoord += inset;
      endCoord -= inset;
    }
  }

  if (this._bHoriz)
    return [endCoord, x1, endCoord, x2, baselineCoord, x2, baselineCoord, x1];
  else
    return [x1, endCoord, x2, endCoord, x2, baselineCoord, x1, baselineCoord];
};


/**
 * Helper function that creates and adds the shapes used for displaying hover and selection effects. Should only be
 * called on hover or select operations, since it assumes that the fill, stroke, and shape size are already determined.
 * @private
 */
DvtChartBar.prototype._initializeSelectionEffects = function() {
  // Calculate the geometry of the shapes used for the selection effects
  var outerBorderWidth = this.isSelected() ? DvtChartSelectableRectangularPolygon.OUTER_BORDER_WIDTH : DvtChartSelectableRectangularPolygon.OUTER_BORDER_WIDTH_HOVER;
  var outerChildPoints = this._createPointsArray(outerBorderWidth);
  var innerChildPoints = this._createPointsArray(outerBorderWidth + DvtChartSelectableRectangularPolygon.INNER_BORDER_WIDTH);

  // Just update the geometries if already initialized
  if (this.OuterChild) {
    this.OuterChild.setPoints(outerChildPoints);
    this.InnerChild.setPoints(innerChildPoints);
    return;
  }

  this.OuterChild = new dvt.Polygon(this.getCtx(), outerChildPoints);
  this.OuterChild.setInvisibleFill();
  this.OuterChild.setMouseEnabled(true);
  this.addChild(this.OuterChild);

  this.InnerChild = new dvt.Polygon(this.getCtx(), innerChildPoints);
  this.InnerChild.setInvisibleFill();
  this.InnerChild.setMouseEnabled(true);
  this.addChild(this.InnerChild);
};


/**
 * Returns the bounding box of the shape
 * @return {dvt.Rectangle} bbox
 */
DvtChartBar.prototype.getBoundingBox = function() {
  var x = Math.min(this._x2, this._x1);
  var y = Math.min(this._endCoord, this._baselineCoord);
  var w = Math.abs(this._x2 - this._x1);
  var h = Math.abs(this._endCoord - this._baselineCoord);

  if (this._bHoriz)
    return new dvt.Rectangle(y, x, h, w);
  else
    return new dvt.Rectangle(x, y, w, h);
};


/**
 * Returns the bounds of the displayable relative to the target coordinate space.  If the target
 * coordinate space is not specified, returns the bounds relative to this displayable.  This function does not take
 * into account any child displayables.
 * @param {dvt.Displayable} targetCoordinateSpace The displayable defining the target coordinate space.
 * @return {dvt.Rectangle} The bounds of the displayable relative to the target coordinate space.
 */
DvtChartBar.prototype.getDimensionsSelf = function(targetCoordinateSpace) {
  // Note: In the near future, we will not support children for shapes, so this routine will be refactored into the
  //       existing getDimensions calls.  For now, components must be aware of the presence of children to use this.
  return this.ConvertCoordSpaceRect(this.getBoundingBox(), targetCoordinateSpace);
};
/**
 * Displayable for stock bars.
 * @extends {dvt.Container}
 * @param {dvt.Context} context
 * @param {number} xCoord
 * @param {number} barWidth
 * @param {number} openCoord
 * @param {number} closeCoord
 * @param {number=} lowCoord
 * @param {number=} highCoord
 * @class
 * @constructor
 */
var DvtChartCandlestick = function(context, xCoord, barWidth, openCoord, closeCoord, lowCoord, highCoord) {
  this.Init(context);

  // Calculate the bar width. For width >= 2, use even integer widths to ensure symmetry with range bar.
  barWidth = Math.max(Math.round(barWidth / 2) * 2, 1);
  var rangeWidth = Math.min(Math.ceil((DvtChartCandlestick._BAR_WIDTH * barWidth) / 2) * 2, barWidth);

  // Calculate the x coords of the bar. Round the xCoord to ensure pixel location.
  var x1 = Math.round(xCoord) - barWidth / 2;
  var x2 = x1 + barWidth;

  // Create the range shape if coords provided
  if (lowCoord != null && highCoord != null) {
    var rangeX1 = Math.round(xCoord) - rangeWidth / 2;
    var rangeX2 = rangeX1 + rangeWidth;
    this._rangeShape = new DvtChartSelectableRectangularPolygon(context, [rangeX1, lowCoord, rangeX2, lowCoord, rangeX2, highCoord, rangeX1, highCoord]);
    this.addChild(this._rangeShape);
  }

  // Create the change shape on top of range
  this._changeShape = new DvtChartSelectableRectangularPolygon(context, [x1, openCoord, x2, openCoord, x2, closeCoord, x1, closeCoord]);
  this.addChild(this._changeShape);

  // Never anti-alias. Coords are carefully chosen to be perfectly aligned.
  this.setPixelHinting(true);
};

dvt.Obj.createSubclass(DvtChartCandlestick, dvt.Container);

/**
 * The minimum width fraction of the range bar with respect to the change bar width.
 * @const
 * @private
 */
DvtChartCandlestick._BAR_WIDTH = .3;

/**
 * Specifies the fill and stroke for the change shape.
 * @param {dvt.Fill} fill
 * @param {dvt.Stroke} stroke
 * @param {string} dataColor The primary color of this data item.
 * @param {string} innerColor The inner color of the selection effect.
 * @param {string} outerColor The outer color of the selection effect.
 */
DvtChartCandlestick.prototype.setChangeStyle = function(fill, stroke, dataColor, innerColor, outerColor) {

  this._changeShape.setStyleProperties(fill, stroke, dataColor, innerColor, outerColor);
};

/**
 * Specifies the fill and stroke for the range shape.
 * @param {dvt.Fill} fill
 * @param {dvt.Stroke} stroke
 * @param {string} rangeColor The primary color of the range bar.
 * @param {string} outerColor The outer color of the selection effect.
 */
DvtChartCandlestick.prototype.setRangeStyle = function(fill, stroke, rangeColor, outerColor) {
  if (!this._rangeShape)
    return;

  this._rangeShape.setStyleProperties(fill, stroke, rangeColor, null, outerColor);
};

/**
 * Set selected obj for stock
 * @param {boolean} selected Indicates if the container is selested. We never want to display the range as selected
 */
DvtChartCandlestick.prototype.setSelected = function(selected) {
  this._changeShape.setSelected(selected);
  if (this._rangeShape)
    this._rangeShape.setSelected(selected);
};

/**
 * Only show the hover effect for the change and range shape, ignore volume
 */
DvtChartCandlestick.prototype.showHoverEffect = function() {
  this._changeShape.showHoverEffect();
  if (this._rangeShape)
    this._rangeShape.showHoverEffect();
};

/**
 * Hide the hover effect for change and range shape, ignore volume
 */
DvtChartCandlestick.prototype.hideHoverEffect = function() {
  this._changeShape.hideHoverEffect();
  if (this._rangeShape)
    this._rangeShape.hideHoverEffect();
};

/**
 * Returns a dvt.ParallelPlayable containing the display animations for the stock bars
 * @param {number} duration The duration of the animation in seconds.
 * @return {dvt.ParallelPlayable} A playable for the initial bar animation.
 */
DvtChartCandlestick.prototype.getDisplayAnimation = function(duration) {
  // Animation: Grow from the center of each bar.
  var nodePlayable = new dvt.CustomAnimation(this.getCtx(), this, duration);

  // Change Shape
  var endStateChange = this._changeShape.getPoints();
  this._changeShape.setPoints(DvtChartCandlestick._getInitialPoints(endStateChange));
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this._changeShape, this._changeShape.getPoints, this._changeShape.setAnimationParams, endStateChange);

  // Range Shape
  if (this._rangeShape) {
    var endStateRange = this._rangeShape.getPoints();
    this._rangeShape.setPoints(DvtChartCandlestick._getInitialPoints(endStateRange));
    nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this._rangeShape, this._rangeShape.getPoints, this._rangeShape.setAnimationParams, endStateRange);
  }

  return nodePlayable;
};

/**
 * Returns a dvt.Playable containing the animation to delete this displayable.
 * @param {number} duration The duration of the animation in seconds.
 * @return {dvt.Playable}
 */
DvtChartCandlestick.prototype.getDeleteAnimation = function(duration) {
  // Animation: Shrink to the center of each bar.
  var nodePlayable = new dvt.CustomAnimation(this.getCtx(), this, duration);

  // Change Shape
  var endStateChange = DvtChartCandlestick._getInitialPoints(this._changeShape.getPoints());
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this._changeShape, this._changeShape.getPoints, this._changeShape.setAnimationParams, endStateChange);

  // Range Shape
  if (this._rangeShape) {
    var endStateRange = DvtChartCandlestick._getInitialPoints(this._rangeShape.getPoints());
    nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this._rangeShape, this._rangeShape.getPoints, this._rangeShape.setAnimationParams, endStateRange);
  }

  // Alpha Fade
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.getAlpha, this.setAlpha, 0);

  return nodePlayable;
};


/**
 * Returns a dvt.Playable containing the insert animation for this displayable.
 * @param {number} duration The duration of the animation in seconds.
 * @return {dvt.Playable}
 */
DvtChartCandlestick.prototype.getInsertAnimation = function(duration) {
  // Initialize the alpha to fade in the bar
  this.setAlpha(0);

  // Create the playable
  var nodePlayable = this.getDisplayAnimation(duration);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.getAlpha, this.setAlpha, 1);
  return nodePlayable;
};

/**
 * Returns a dvt.Playable containing the update animation for this displayable.
 * @param {number} duration The duration of the animation in seconds.
 * @param {DvtChartCandlestick} oldShape The old shape to animate from.
 * @return {dvt.Playable}
 */
DvtChartCandlestick.prototype.getUpdateAnimation = function(duration, oldShape) {
  // Animation: Transition from old points to new points arrays.
  var nodePlayable = new dvt.CustomAnimation(this.getCtx(), this, duration);

  // Change Shape: Points
  var endStateChange = this._changeShape.getPoints();
  this._changeShape.setPoints(oldShape._changeShape.getPoints());
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this._changeShape, this._changeShape.getPoints, this._changeShape.setAnimationParams, endStateChange);

  // Change Shape: Fill. Need the get the primary color, since it might be overwritten during selection
  var bSkipFillAnimation = (oldShape._changeShape.isSelected() || this._changeShape.isSelected());
  var startFill = oldShape._changeShape.getPrimaryFill().clone();
  var endFill = this._changeShape.getPrimaryFill();
  if (!bSkipFillAnimation) {
    this._changeShape.setFill(startFill);
    nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_FILL, this._changeShape, this._changeShape.getFill, this._changeShape.setFill, endFill);
  }
  // Range Shape: Points
  if (this._rangeShape && oldShape._rangeShape) {
    var endStateRange = this._rangeShape.getPoints();
    this._rangeShape.setPoints(oldShape._rangeShape.getPoints());
    nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this._rangeShape, this._rangeShape.getPoints, this._rangeShape.setAnimationParams, endStateRange);
  }
  return nodePlayable;
};

/**
 * @override
 */
DvtChartCandlestick.prototype.UpdateSelectionEffect = function() {
  // noop: Selection effects fully managed by this class
};

/**
 * Returns the array of points for initial animation of the specified points array.
 * @param {array} points
 * @return {array}
 * @private
 */
DvtChartCandlestick._getInitialPoints = function(points) {
  var x1 = points[0];
  var x2 = points[2];
  var y1 = points[1];
  var y2 = points[5];
  var yMid = (y1 + y2) / 2;
  return [x1, yMid, x2, yMid, x2, yMid, x1, yMid];
};
// Copyright (c) 2011, 2016, Oracle and/or its affiliates. All rights reserved.

/**
 * Property bag of line/area coordinate for DvtChartPolygonSet.
 * The coordinates are represented by x, y1, and y2. Usually, y1 == y2. If y1 != y2, it means that there's a jump in
 * the y value at that x position (from y1 to y2) due to a null in the data.
 * @class DvtChartCoord
 * @extends {DvtObject}
 * @constructor
 * @param {number} x The x coordinate.
 * @param {number} y1 The first y coordinate.
 * @param {number} y2 The second y coordinate.
 * @param {number} groupIndex The group index of the coordinate.
 * @param {string} group The group name of the coordinate.
 * @param {boolean} filtered Whether the coordinate is filtered for performance.
 */
var DvtChartCoord = function(x, y1, y2, groupIndex, group, filtered) {
  this.x = x;
  this.y1 = y1;
  this.y2 = y2;
  this.groupIndex = groupIndex;
  this.group = group;
  this.filtered = filtered;
};

dvt.Obj.createSubclass(DvtChartCoord, dvt.Obj);

/**
 * Returns whether the step from y1 to y2 is upward. "Upward" is defined as moving further from the baseline.
 * @param {number} baseline The coordinate of the baseline.
 * @return {boolean}
 */
DvtChartCoord.prototype.isUpstep = function(baseline) {
  return Math.abs(this.y2 - baseline) > Math.abs(this.y1 - baseline);
};

/**
 * Returns a clone of itself.
 * @return {DvtChartCoord}
 */
DvtChartCoord.prototype.clone = function() {
  return new DvtChartCoord(this.x, this.y1, this.y2, this.groupIndex, this.group, this.filtered);
};
/**
 * A collection of line/area shapes for a chart series.
 * Usually there's only one shape for each series, but there can be multiple if there are null values in the data.
 * @class DvtChartLineArea
 * @extends {dvt.Container}
 * @constructor
 * @param {dvt.Chart} chart The chart.
 * @param {boolean} bArea Whether this is an Area (it is a Line otherwise).
 * @param {dvt.Rectangle} availSpace The available space.
 * @param {number} baseline The axis baseline coordinate.
 * @param {dvt.Fill} fill The fill of the shapes.
 * @param {dvt.Stroke} stroke The stroke of the shapes.
 * @param {string} type The type of the line or the area top: straight, curved, stepped, centeredStepped, segmented, or centeredSegmented.
 * @param {array} arCoord Array of DvtChartCoord representing the coordinates of the line or the area top.
 * @param {string} baseType The type of the area base: straight, curved, stepped, centeredStepped, segmented, or centeredSegmented.
 * @param {array} arBaseCoord Array of DvtChartCoord representing the coordinates of the area base.
 */
var DvtChartLineArea = function(chart, bArea, availSpace, baseline, fill, stroke, type, arCoord, baseType, arBaseCoord) {
  this.Init(chart.getCtx());

  // Calculate the points array and apply to the polygon
  this._chart = chart;
  this._bArea = bArea;
  this._availSpace = availSpace;
  this._baseline = baseline;
  this._fill = fill;
  this._stroke = stroke;
  this._type = type;
  this._baseType = baseType ? baseType : type;
  this._indicatorMap = {};

  this.setCoords(arCoord, arBaseCoord);
};

dvt.Obj.createSubclass(DvtChartLineArea, dvt.Container);

/** @private **/
DvtChartLineArea._INDICATOR_OFFSET = 8;

/**
 * Sets the coordinates of the shapes.
 * @param {array} arCoord Array of DvtChartCoord representing the coordinates of the line or the area top.
 * @param {array} arBaseCoord Array of DvtChartCoord representing the coordinates of the area base.
 */
DvtChartLineArea.prototype.setCoords = function(arCoord, arBaseCoord) {
  this._arCoord = arCoord;
  if (arBaseCoord)
    this._arBaseCoord = arBaseCoord;

  this.removeChildren(); // clean up

  if (this._bArea)
    this._renderAreas();
  else
    this._renderLines();

  this._positionIndicators();
};

/**
 * Returns the coordinates of the line or the area top.
 * @return {array} Array of DvtChartCoord representing the coordinates of the line or the area top.
 */
DvtChartLineArea.prototype.getCoords = function() {
  return this._arCoord;
};

/**
 * Returns the coordinates of the area base.
 * @return {array} Array of DvtChartCoord representing the coordinates of the area base.
 */
DvtChartLineArea.prototype.getBaseCoords = function() {
  return this._arBaseCoord;
};

/**
 * Returns the axis baseline coordinate.
 * @return {number}
 */
DvtChartLineArea.prototype.getBaseline = function() {
  return this._baseline;
};

/**
 * Returns whether this is an area (otherwise, it's a line).
 * @return {boolean}
 */
DvtChartLineArea.prototype.isArea = function() {
  return this._bArea;
};

/**
 * Creates arrays of dvt.Point for drawing polygons or polylines based on the DvtChartCoord array.
 * An array of dvt.Point arrays is returned, with each array being a set of contiguous points.
 * @param {array} coords The array of DvtChartCoords representing axis coordinates.
 * @param {string} type The line type: straight, curved, stepped, centeredStepped, segmented, or centeredSegmented.
 * @return {array} The arrays of contiguous points for drawing polygons or polylines.
 * @private
 */
DvtChartLineArea.prototype._getPointArrays = function(coords, type) {
  var pointsArrays = [];
  var points = [];
  pointsArrays.push(points);
  coords = DvtChartLineArea._convertToPointCoords(coords);

  var isPolar = DvtChartTypeUtils.isPolar(this._chart);
  var isCentered = type == 'centeredStepped' || type == 'centeredSegmented';
  var isParallel = isCentered || type == 'stepped' || type == 'segmented';
  var groupWidth = DvtChartStyleUtils.getGroupWidth(this._chart);
  var dir = dvt.Agent.isRightToLeft(this.getCtx()) && DvtChartTypeUtils.isVertical(this._chart) ? -1 : 1;

  var lastCoord;
  if (isPolar) // initiate lastCoord to be the final point
    lastCoord = coords[coords.length - 1];

  var coord, xCoord, isY2, finalXCoord;
  var inBump = false; // flag to indicate whether we're in a bump (a section surrounded by y1 != y2 cliffs)
  for (var i = 0; i < coords.length; i++) {
    if (coords[i] == null) {
      if (!DvtChartAxisUtils.isMixedFrequency(this._chart)) {
        // Draw the last step
        if (isParallel && !isPolar && lastCoord && !isY2) {
          finalXCoord = isCentered ? lastCoord.x + 0.5 * groupWidth * dir : lastCoord.x + groupWidth * dir;
          this._pushCoord(points, finalXCoord, lastCoord.y);
        }
      }

      if (this._chart.getOptions()['_environment'] == 'jet' || !DvtChartAxisUtils.isMixedFrequency(this._chart)) {
        // Start a new list of points, except in ADF and MAF mixed freq where we want to connect points across nulls.
        points = [];
        pointsArrays.push(points);
        lastCoord = null;
      }

      continue;
    }

    coord = coords[i];
    isY2 = coords[i]._isY2;
    xCoord = isCentered ? coord.x - groupWidth / 2 * dir : coord.x;

    if (isY2) {
      if (inBump && isParallel)
        xCoord += groupWidth * dir; // draw the segment at the end of the bump
      inBump = !inBump;
    }

    if (type == 'curved' && isY2)
      points.push(null, null); // flag to indicate that the curve should be broken

    if (lastCoord && isParallel) // draw the step
      this._pushCoord(points, xCoord, lastCoord.y);

    if (!this._bArea && (type == 'segmented' || type == 'centeredSegmented')) {
      // Start a new list of points to break the segments
      points = [];
      pointsArrays.push(points);
    }

    this._pushCoord(points, xCoord, coord.y);
    lastCoord = coord;
  }

  // Draw the last step
  if (isParallel && !isPolar && lastCoord && !isY2) {
    finalXCoord = isCentered ? lastCoord.x + 0.5 * groupWidth * dir : lastCoord.x + groupWidth * dir;
    this._pushCoord(points, finalXCoord, lastCoord.y);
  }

  // Connect the last points with the first ones for polar
  if (isPolar && pointsArrays.length > 1) {
    var lastPoints = pointsArrays.pop();
    pointsArrays[0] = lastPoints.concat(pointsArrays[0]);
  }

  return pointsArrays;
};

/**
 * Converts the axis coordinate to the stage coordinate and pushes the points to the pointArray.
 * @param {array} pointArray The point array.
 * @param {number} x The x-axis coordinate.
 * @param {number} y The y-axis coordinate.
 * @private
 */
DvtChartLineArea.prototype._pushCoord = function(pointArray, x, y) {
  var coord = DvtChartPlotAreaRenderer.convertAxisCoord(this._chart, new dvt.Point(x, y), this._availSpace);

  // Round to 1 decimal to keep the DOM small, but prevent undesidered gaps due to rounding errors
  pointArray.push(Math.round(coord.x * 10) / 10, Math.round(coord.y * 10) / 10);
};

/**
 * Returns whether the points form a complete ring/donut shape. Only applicable to polar charts.
 * @return {boolean}
 * @private
 */
DvtChartLineArea.prototype._isRing = function() {
  if (!DvtChartTypeUtils.isPolar(this._chart) || !DvtChartAxisUtils.hasGroupAxis(this._chart) || this._arCoord.length < DvtChartDataUtils.getGroupCount(this._chart))
    return false;

  // Check if there is any null that breaks the ring/donut.
  for (var i = 0; i < this._arCoord.length; i++) {
    if (this._arCoord[i].x == null)
      return false;
  }
  return true;
};

/**
 * Returns the spline type of the line/area based on the chart type.
 * @return {string} Spline type.
 * @private
 */
DvtChartLineArea.prototype._getSplineType = function() {
  if (DvtChartTypeUtils.isScatterBubble(this._chart))
    return dvt.PathUtils.SPLINE_TYPE_CARDINAL;
  else if (DvtChartTypeUtils.isPolar(this._chart))
    return this._isRing() ? dvt.PathUtils.SPLINE_TYPE_CARDINAL_CLOSED : dvt.PathUtils.SPLINE_TYPE_CARDINAL;
  else if (DvtChartTypeUtils.isHorizontal(this._chart))
    return dvt.PathUtils.SPLINE_TYPE_MONOTONE_HORIZONTAL;
  else
    return dvt.PathUtils.SPLINE_TYPE_MONOTONE_VERTICAL;
};

/**
 * Renders lines.
 * @private
 */
DvtChartLineArea.prototype._renderLines = function() {
  var pointArrays = this._getPointArrays(this._arCoord, this._type);
  var line;
  for (var i = 0; i < pointArrays.length; i++) {
    var points = pointArrays[i];
    if (points && points.length > 1) {
      if (this._type == 'curved') {
        var cmd = DvtChartLineArea._getCurvedPathCommands(points, false, this._getSplineType());
        line = new dvt.Path(this.getCtx(), cmd);
        line.setFill(null);
      }
      else { // not curved
        if (this._isRing()) { // create a closed loop
          line = new dvt.Polygon(this.getCtx(), points);
          line.setFill(null);
        }
        else
          line = new dvt.Polyline(this.getCtx(), points);
      }
      line.setStroke(this._stroke);
      this.addChild(line);
    }
  }
};

/**
 * Renders areas.
 * @private
 */
DvtChartLineArea.prototype._renderAreas = function() {
  // If both the area has both top and bottom coords, remove the edge points that go to the baseline at the two ends.
  // These edge points are invisible, but may show up if border is turned on, and also during animation.
  var arCoord = this._arCoord;
  var arBaseCoord = this._arBaseCoord;
  if (!DvtChartTypeUtils.isPolar(this._chart) && arCoord.length > 0 && arBaseCoord.length > 0) {
    // Don't update the stored arrays (this._arCoord and this._arBaseCoord) as the edge points may be needed later for animation.
    arCoord = arCoord.slice(0);
    arBaseCoord = arBaseCoord.slice(0);

    if (arCoord[0].x != null && arBaseCoord[0].x != null) {
      DvtChartLineArea._removeAreaEdge(arCoord, 0, this._baseline);
      DvtChartLineArea._removeAreaEdge(arBaseCoord, 0, this._baseline);
      arBaseCoord[0].x = arCoord[0].x;
    }
    if (arCoord[arCoord.length - 1].x != null && arBaseCoord[arBaseCoord.length - 1].x != null) {
      DvtChartLineArea._removeAreaEdge(arCoord, arCoord.length - 1, this._baseline);
      DvtChartLineArea._removeAreaEdge(arBaseCoord, arBaseCoord.length - 1, this._baseline);
      arBaseCoord[arBaseCoord.length - 1].x = arCoord[arCoord.length - 1].x;
    }
  }

  var highArrays = this._getPointArrays(arCoord, this._type);
  var lowArrays = this._getPointArrays(arBaseCoord, this._baseType);

  if (highArrays.length != lowArrays.length)
    return;

  var area;
  for (var i = 0; i < highArrays.length; i++) {
    var highArray = highArrays[i];
    var lowArray = lowArrays[i];

    if (highArray.length < 2)
      continue;

    var highCurved = this._type == 'curved';
    var lowCurved = this._baseType == 'curved';

    // For polar with group axis, form an polygonal donut if possible
    if (this._isRing()) {
      if (!highCurved)
        highArray.push(highArray[0], highArray[1]);
      if (lowArray.length >= 2 && !lowCurved)
        lowArray.push(lowArray[0], lowArray[1]);
    }

    // Reverse the lowArray
    var revLowArray = [];
    for (var j = 0; j < lowArray.length; j += 2)
      revLowArray.unshift(lowArray[j], lowArray[j + 1]);

    // If either the top or the base is a curve, we have to draw a path. Otherwise, we can use polygon.
    if (highCurved || lowCurved) {
      var splineType = this._getSplineType();
      var cmd = highCurved ? DvtChartLineArea._getCurvedPathCommands(highArray, false, splineType) : dvt.PathUtils.polyline(highArray, false);
      cmd += lowCurved ? DvtChartLineArea._getCurvedPathCommands(revLowArray, true, splineType) : dvt.PathUtils.polyline(revLowArray, true);
      cmd += dvt.PathUtils.closePath();
      area = new dvt.Path(this.getCtx(), cmd);
    }
    else { // not curved
      // Add the reversed low points to the high points to form a range
      var points = revLowArray.concat(highArray);
      area = new dvt.Polygon(this.getCtx(), points);
    }

    area.setFill(this._fill);
    if (this._stroke)
      area.setStroke(this._stroke);
    this.addChild(area);
  }
};

/**
 * Positions the animation indicators.
 * @private
 */
DvtChartLineArea.prototype._positionIndicators = function() {
  var indicatorObj, indicator, pos, y, coord;
  for (var i = 0; i < this._arCoord.length; i++) {
    coord = this._arCoord[i];
    indicatorObj = this._indicatorMap[coord.groupIndex];

    if (indicatorObj && indicatorObj.indicator) {
      // If the coord has unequal y1 and y2, pick the one farthest from the baseline.
      y = (coord.isUpstep(this._baseline) ? coord.y2 : coord.y1) +
          DvtChartLineArea._INDICATOR_OFFSET * (indicatorObj.direction == DvtChartDataChangeUtils.DIR_UP ? -1 : 1);
      pos = DvtChartPlotAreaRenderer.convertAxisCoord(this._chart, new dvt.Point(coord.x, y), this._availSpace);

      indicator = indicatorObj.indicator;
      indicator.setTranslate(pos.x, pos.y);
      indicator.setAlpha(1); // show it because it's hidden when added
      indicator.getParent().addChild(indicator); // reparent to keep at top
    }
  }
};

/**
 * Returns the animation params for the line or the area top.
 * @param {DvtChartLineArea} other The shape it is animating from/to. If provided, the animation params are guaranteed
 *     to contain all the groups that the other shape has, in the correct order.
 * @return {array} The animation params in the form of [x y1 y2 groupIndex x y1 y2 groupIndex ...]
 */
DvtChartLineArea.prototype.getAnimationParams = function(other) {
  return DvtChartLineArea._coordsToAnimationParams(this._arCoord, other ? other._arCoord : null, this._baseline);
};

/**
 * Updates the animation params for the line or the area top.
 * @param {array} params The animation params in the form of [x y1 y2 groupIndex x y1 y2 groupIndex ...]
 */
DvtChartLineArea.prototype.setAnimationParams = function(params) {
  var coords = DvtChartLineArea._animationParamsToCoords(params);
  this.setCoords(coords);
};

/**
 * Returns the animation params for the area base.
 * @param {DvtChartLineArea} other The shape it is animating from/to. If provided, the animation params are guaranteed
 *     to contain all the groups that the other shape has, in the correct order.
 * @return {array} The animation params in the form of [x y1 y2 groupIndex x y1 y2 groupIndex ...]
 */
DvtChartLineArea.prototype.getBaseAnimationParams = function(other) {
  return DvtChartLineArea._coordsToAnimationParams(this._arBaseCoord, other ? other._arBaseCoord : null, this._baseline);
};

/**
 * Updates the animation params for the area base.
 * @param {array} params The animation params in the form of [x y1 y2 groupIndex x y1 y2 groupIndex ...]
 */
DvtChartLineArea.prototype.setBaseAnimationParams = function(params) {
  this._arBaseCoord = DvtChartLineArea._animationParamsToCoords(params);
};

/**
 * Returns a list of group indices that are common between this and other (used for generating animation indicators).
 * @param {DvtChartLineArea} other The shape it is animating from/to.
 * @return {array} The array of common group indices.
 */
DvtChartLineArea.prototype.getCommonGroupIndices = function(other) {
  var indices = [];
  for (var i = 0; i < this._arCoord.length; i++) {
    if (this._arCoord[i].filtered || this._arCoord[i].x == null)
      continue;

    for (var j = 0; j < other._arCoord.length; j++) {
      if (other._arCoord[j].filtered || other._arCoord[j].x == null)
        continue;

      if (this._arCoord[i].group == other._arCoord[j].group) {
        indices.push(this._arCoord[i].groupIndex);
        break;
      }
    }
  }
  return indices;
};

/**
 * Adds an animation indicator.
 * @param {number} groupIndex The group index corresponding to the indicator.
 * @param {number} direction The direction of the indicator.
 * @param {dvt.Shape} indicator The indicator shape.
 */
DvtChartLineArea.prototype.addIndicator = function(groupIndex, direction, indicator) {
  indicator.setAlpha(0); // hide it until animation starts
  this._indicatorMap[groupIndex] = {direction: direction, indicator: indicator};
};

/**
 * Removes all animation indicators.
 */
DvtChartLineArea.prototype.removeIndicators = function() {
  for (var groupIndex in this._indicatorMap) {
    var indicator = this._indicatorMap[groupIndex].indicator;
    if (indicator)
      indicator.getParent().removeChild(indicator);
  }

  this._indicatorMap = {};
};

/**
 * Converts DvtChartCoord array into dvt.Point array. Excludes filtered points.
 * @param {array} coords DvtChartCoord array.
 * @return {array} dvt.Point array.
 * @private
 */
DvtChartLineArea._convertToPointCoords = function(coords) {
  var pointCoords = [];
  for (var i = 0; i < coords.length; i++) {
    if (coords[i].filtered)
      continue;

    if (coords[i].x == null)
      pointCoords.push(null);
    else {
      // if y1 == y2, then add just one point. Otherwise, add two points.
      pointCoords.push(new dvt.Point(coords[i].x, coords[i].y1));
      if (coords[i].y1 != coords[i].y2) {
        var p2 = new dvt.Point(coords[i].x, coords[i].y2);
        p2._isY2 = true; // flag to indicate the point comes from y2
        pointCoords.push(p2);
      }
    }
  }
  return pointCoords;
};

/**
 * Converts array of DvtChartCoord into animation params.
 * @param {array} coords Array of DvtChartCoord.
 * @param {array} otherCoords The array of DvtChartCoord it is animating from/to. If provided, the animation params are
 *     guaranteed to contain all the groups that the other shape has, in the correct order.
 * @param {number} baseline The axis baseline coordinate.
 * @return {array} The animation params in the form of [x y1 y2 groupIndex x y1 y2 groupIndex ...].
 * @private
 */
DvtChartLineArea._coordsToAnimationParams = function(coords, otherCoords, baseline) {
  if (otherCoords && otherCoords.length > 0) {
    // Construct coords list that contains all the groups that this shape and other shape have.
    if (coords && coords.length > 0) {
      coords = coords.slice(0);
      var otherGroups = DvtChartLineArea._coordsToGroups(otherCoords);
      var groups = DvtChartLineArea._coordsToGroups(coords);
      var idx = coords.length;

      // Iterate otherGroups backwards. For each group, check if the current shape has it. If not, insert a dummy coord
      // into the array, which has an identical value to the coord before it (or after it if the insertion is at the start).
      var group, groupIdx, dummyCoord;
      for (var g = otherGroups.length - 1; g >= 0; g--) {
        group = otherGroups[g];
        groupIdx = dvt.ArrayUtils.getIndex(groups, group);
        if (groupIdx == -1) { // Group not found -- insert dummy coord
          if (idx == 0) {
            dummyCoord = coords[0].clone(); // copy coord after it
            coords[0] = coords[0].clone();
            DvtChartLineArea._removeCoordJump(dummyCoord, coords[0], baseline);
          }
          else {
            dummyCoord = coords[idx - 1].clone(); // copy coord before it
            coords[idx - 1] = coords[idx - 1].clone();
            DvtChartLineArea._removeCoordJump(coords[idx - 1], dummyCoord, baseline);
          }
          dummyCoord.groupIndex = -1;
          coords.splice(idx, 0, dummyCoord);
        }
        else // Group found -- use idx to keep track of the last found group so we know where to add the dummy coord
          idx = groupIdx;
      }
    }
    else { // this coords is empty, so return the baseline coords
      coords = [];
      for (var g = 0; g < otherCoords.length; g++) {
        coords.push(new DvtChartCoord(otherCoords[g].x, baseline, baseline));
      }
    }
  }

  // Construct the animation params
  var params = [];
  for (var i = 0; i < coords.length; i++) {
    if (coords[i].filtered)
      continue;

    if (coords[i].x == null) {
      params.push(Infinity); // placeholder for nulls
      params.push(Infinity);
      params.push(Infinity);
    }
    else {
      params.push(coords[i].x);
      params.push(coords[i].y1);
      params.push(coords[i].y2);
    }
    params.push(coords[i].groupIndex);
  }
  return params;
};

/**
 * Converts animation params into array of DvtChartCoord.
 * @param {array} params The animation params in the form of [x y1 y2 groupIndex x y1 y2 groupIndex ...].
 * @return {array} Array of DvtChartCoord.
 * @private
 */
DvtChartLineArea._animationParamsToCoords = function(params) {
  var coords = [];
  for (var i = 0; i < params.length; i += 4) {
    if (params[i] == Infinity || isNaN(params[i]))
      coords.push(new DvtChartCoord(null, null, null, params[i + 3]));
    else
      coords.push(new DvtChartCoord(params[i], params[i + 1], params[i + 2], params[i + 3]));
  }
  return coords;
};

/**
 * Converts array of DvtChartCoord into array of group names.
 * @param {array} coords Array of DvtChartCoord.
 * @return {array} Array of group names.
 * @private
 */
DvtChartLineArea._coordsToGroups = function(coords) {
  var groups = [];
  for (var i = 0; i < coords.length; i++) {
    if (!coords[i].filtered)
      groups.push(coords[i].group);
  }
  return groups;
};

/**
 * Removes the jump (due to null values) between startCoord and endCoord, which are duplicates of each other:
 * - If the jump is upward, it eliminates the jump in the endCoord.
 * - If the jump is downward, it eliminates the jump in the startCoord.
 * @param {DvtChartCoord} startCoord The coord on the left (or right in R2L).
 * @param {DvtChartCoord} endCoord The coord on the right (or left in R2L).
 * @param {number} baseline The axis baseline coordinate.
 * @private
 */
DvtChartLineArea._removeCoordJump = function(startCoord, endCoord, baseline) {
  if (startCoord.isUpstep(baseline))
    endCoord.y1 = endCoord.y2;
  else
    startCoord.y2 = startCoord.y1;
};

/**
 * Returns the path commands for a curve that goes through the points.
 * @param {array} points The points array.
 * @param {boolean} connectWithLine Whether the first point is reached using lineTo. Otherwise, moveTo is used.
 * @param {string} splineType The spline type.
 * @return {string} Path commands.
 * @private
 */
DvtChartLineArea._getCurvedPathCommands = function(points, connectWithLine, splineType) {
  // First we need to split the points into multiple arrays. The separator between arrays are the nulls, which
  // indicate that the two segments should be connected by a straight line instead of a curve.
  var arP = [];
  var p = [];
  arP.push(p);
  for (var i = 0; i < points.length; i += 2) {
    if (points[i] == null) {
      p = [];
      arP.push(p);
    }
    else
      p.push(points[i], points[i + 1]);
  }

  // Connect the last segment with the first one for polar
  if (splineType == dvt.PathUtils.SPLINE_TYPE_CARDINAL_CLOSED && arP.length > 1) {
    var lastPoints = arP.pop();
    arP[0] = lastPoints.concat(arP[0]);
    splineType = dvt.PathUtils.SPLINE_TYPE_CARDINAL; // multiple segments, so not a closed curve
  }

  var cmd = '';
  for (var i = 0; i < arP.length; i++) {
    p = arP[i];
    cmd += dvt.PathUtils.curveThroughPoints(p, connectWithLine, splineType);
    connectWithLine = true; // after the first segment, the rest are connected by straight lines
  }

  return cmd;
};

/**
 * Removes the edge point of an area. Used to create range area shape without the extra lines at the edges.
 * @param {array} arCoord The coord array.
 * @param {number} index The index of the edge to be removed.
 * @param {number} baseline The baseline coord.
 * @private
 */
DvtChartLineArea._removeAreaEdge = function(arCoord, index, baseline) {
  var coord = arCoord[index].clone();
  if (coord.isUpstep(baseline))
    coord.y1 = coord.y2;
  else
    coord.y2 = coord.y1;
  arCoord[index] = coord;
};
// Copyright (c) 2011, 2016, Oracle and/or its affiliates. All rights reserved.
/**
  *  A marker object for selectable invisible markers.
  *  @param {dvt.Context} context
  *  @param {number} type The marker type.
  *  @param {number} cx The x position of the center of the marker.
  *  @param {number} cy The y position of the center of the marker.
  *  @param {number} size The size of the marker.
  *  @param {boolean} bOptimizeStroke True if the stroke of the markers has been applied on a container.
  *  @extends {dvt.SimpleMarker}
  *  @class DvtChartLineMarker
  *  @constructor
  */
var DvtChartLineMarker = function(context, type, cx, cy, size, bOptimizeStroke)
{
  this.Init(context, type, null, cx, cy, size, size);

  // Set the stroke if the container may have defined a different one.
  if (bOptimizeStroke)
    this.setStroke(DvtChartLineMarker.DEFAULT_STROKE);
};

dvt.Obj.createSubclass(DvtChartLineMarker, dvt.SimpleMarker);

/** @const */
DvtChartLineMarker.DEFAULT_STROKE = new dvt.SolidStroke('none');

/** @const */
DvtChartLineMarker.SELECTED_FILL = new dvt.SolidFill('#FFFFFF');

/** @const */
DvtChartLineMarker.SELECTED_STROKE = new dvt.SolidStroke('#5A5A5A', 1, 1.5);

/**
 * @override
 */
DvtChartLineMarker.prototype.setDataColor = function(dataColor)
{
  this._dataColor = dataColor;
  this._hoverStroke = new dvt.SolidStroke(dataColor, 1, 1.5);
};

/**
 * @override
 */
DvtChartLineMarker.prototype.getDataColor = function()
{
  return this._dataColor;
};

/**
 * @override
 */
DvtChartLineMarker.prototype.showHoverEffect = function()
{
  this.IsShowingHoverEffect = true;
  this.setStroke(this._hoverStroke);
};

/**
 * @override
 */
DvtChartLineMarker.prototype.hideHoverEffect = function()
{
  this.IsShowingHoverEffect = false;
  this.setStroke(this.isSelected() ? DvtChartLineMarker.SELECTED_STROKE : DvtChartLineMarker.DEFAULT_STROKE);
};

/**
 * @override
 */
DvtChartLineMarker.prototype.setSelected = function(selected)
{
  if (this.IsSelected == selected)
    return;

  this.IsSelected = selected;
  if (this.isSelected()) {
    this.setFill(DvtChartLineMarker.SELECTED_FILL);
    this.setStroke(this.isHoverEffectShown() ? this._hoverStroke : DvtChartLineMarker.SELECTED_STROKE);
  }
  else {
    this.setInvisibleFill();
    this.setStroke(this.isHoverEffectShown() ? this._hoverStroke : DvtChartLineMarker.DEFAULT_STROKE);
  }
};

/**
 * @override
 */
DvtChartLineMarker.prototype.UpdateSelectionEffect = function() {
  // noop: Selection effects fully managed by this class
};
/**
 * Overview window for chart.
 * @param {dvt.Chart} chart The parent chart who owns the overview.
 * @class
 * @constructor
 * @extends {dvt.Overview}
 */
var DvtChartOverview = function(chart) {
  this.Init(chart.getCtx(), chart.processEvent, chart);
  this._parentChart = chart;
  this._chart = chart.overview ? chart.overview.getBackgroundChart() : null; // save old background chart for animation
  this._id = chart.getId() + '_overview';
};

dvt.Obj.createSubclass(DvtChartOverview, dvt.Overview);


/**
 * Renders the background chart at the specified width and height.
 * @param {object} options Chart options.
 * @param {number} width Chart width.
 * @param {number} height Chart height.
 * @return {number} Chart plot area height.
 * @private
 */
DvtChartOverview.prototype._renderChart = function(options, width, height) {
  this._chartContainer = new dvt.Container(this.getCtx());
  this.addChild(this._chartContainer);

  // Set the default options override for the overview background chart
  var defaultOptions = {
    'legend': {'rendered': 'off', 'size': null},
    'xAxis': {
      'viewportMin': null, 'viewportMax': null, 'viewportStartGroup': null, 'viewportEndGroup': null,
      'axisLine': {'rendered': 'off'}, 'size': null, 'maxSize': 0.5, 'title': null
    },
    'yAxis': {'rendered': 'off', 'size': null},
    'y2Axis': {'rendered': 'off', 'size': null},
    'splitDualY': 'off',
    'title': {'text': null},
    'subtitle': {'text': null},
    'footnote': {'text': null},
    'titleSeparator': {'rendered': 'off'},
    'styleDefaults': {'animationIndicators': 'none'},
    'layout': {'outerGapWidth': 0, 'outerGapHeight': 0},
    '_isOverview': true
  };
  options = dvt.JsonUtils.merge(defaultOptions, options);

  if (DvtChartAxisUtils.hasGroupAxis(this._parentChart))
    options['xAxis']['tickLabel']['rendered'] = 'off';

  if (DvtChartTypeUtils.isStock(this._parentChart) && options['series'] && options['series'][0]) {
    options['series'] = [options['series'][0]];
    options['series'][0]['type'] = 'lineWithArea';
  }

  // Set the user options override
  var userOptions = this._parentChart.getOptions()['overview']['content'];
  options = dvt.JsonUtils.merge(userOptions, options);

  // Turn off zoomAndScroll to prevent scrollbar/overview from appearing inside the overview
  // This has to be done after setting userOptions to prevent users from overriding it
  options['zoomAndScroll'] = 'off';

  // Render the chart
  if (!this._chart) {
    this._chart = dvt.Chart.newInstance(this.getCtx());
    this._chart.setId(this._id); // Set the id to prevent randomly generated one from breaking tests
  }
  this._chartContainer.addChild(this._chart);
  this._chart.render(options, width, height);

  // Cover the chart with a glass pane and remove the keyboard handler to prevent interaction
  var glassPane = new dvt.Rect(this.getCtx(), 0, 0, width, height);
  glassPane.setInvisibleFill();
  this._chartContainer.addChild(glassPane);
  this._chart.getEventManager().setKeyboardHandler(null);

  return this._chart.__getPlotAreaSpace().h;
};


/**
 * @override
 */
DvtChartOverview.prototype.createBackground = function(width, height) {
  // pass. Handled by _renderChart().
};

/**
 * Override to change some of the styles
 * @override
 */
DvtChartOverview.prototype.render = function(options, width, height) {
  // override styles
  options['style'] = {
    'overviewBackgroundColor': 'rgba(0,0,0,0)',
    'windowBackgroundColor': 'rgba(0,0,0,0)',
    'windowBorderTopColor': '#333333',
    'windowBorderRightColor': '#333333',
    'windowBorderBottomColor': '#333333',
    'windowBorderLeftColor': '#333333',
    'leftFilterPanelColor': 'rgba(5,65,135,0.1)',
    'rightFilterPanelColor': 'rgba(5,65,135,0.1)',
    'handleBackgroundImage': options['chart']['_resources']['overviewGrippy'],
    'handleWidth': 3,
    'handleHeight': 15,
    'handleFillColor': 'rgba(0,0,0,0)'
  };
  options['animationOnClick'] = 'off';

  var windowHeight = this._renderChart(options['chart'], width, height);

  // now call super to render the scrollbar
  DvtChartOverview.superclass.render.call(this, options, width, windowHeight);
};

/**
 * @override
 */
DvtChartOverview.prototype.destroy = function() {
  DvtChartOverview.superclass.destroy.call(this);

  this._parentChart = null;
  this._chart = null;
};

/**
 * Returns the overview background chart.
 * @return {dvt.Chart} Overview background chart.
 */
DvtChartOverview.prototype.getBackgroundChart = function() {
  return this._chart;
};


/**
 * Renders filters beside the sliding window
 * @override
 */
DvtChartOverview.prototype.isLeftAndRightFilterRendered = function() {
  return true;
};

/**
 * @override
 */
DvtChartOverview.prototype.HandleKeyDown = function(event) {
  return; // remove keyboard behavior
};

/**
 * @override
 */
DvtChartOverview.prototype.HandleKeyUp = function(event) {
  return; // remove keyboard behavior
};
// Copyright (c) 2011, 2016, Oracle and/or its affiliates. All rights reserved.
/**
  *  A selectable polar bar for charting.
  *  @class DvtChartPolarBar
  *  @extends {dvt.Path}
  *  @constructor
  *  @param {dvt.Chart} chart
  *  @param {number} axisCoord The location of the axis line.
  *  @param {number} baselineCoord The location from which the bar grows.
  *  @param {number} endCoord The location where the bar length ends.
  *  @param {number} x1 The left coord of a vertical bar, or the top of a horizontal bar.
  *  @param {number} x2 The right coord of a vertical bar, or the bottom of a horizontal bar.
  *  @param {number} availSpace The plotAreaSpace, to convert the polar coordinates.
  */
var DvtChartPolarBar = function(chart, axisCoord, baselineCoord, endCoord, x1, x2, availSpace)
{
  // Initialize the path
  this.Init(chart.getCtx());

  this._axisCoord = axisCoord;
  this._availSpace = availSpace.clone();
  this._bbox = null;
  this._dataItemGaps = DvtChartStyleUtils.getDataItemGaps(chart) * DvtChartPolarBar._MAX_DATA_ITEM_GAP;

  // Calculate the path commands and apply to the path
  this._setBarCoords(baselineCoord, endCoord, x1, x2);
};

dvt.Obj.createSubclass(DvtChartPolarBar, DvtChartSelectableWedge);

/**
 * Min bar length for gaps to be added, in pixels.
 * @const
 * @private
 */
DvtChartPolarBar._MIN_BAR_LENGTH_FOR_GAPS = 4;

/**
 * Gap between bars in a stack in pixels.
 * @const
 * @private
 */
DvtChartPolarBar._MAX_DATA_ITEM_GAP = 3;


/**
 * Returns the layout parameters for the current animation frame.
 * @return {array} The array of layout parameters.
 */
DvtChartPolarBar.prototype.getAnimationParams = function() {
  return [this._baselineCoord, this._endCoord, this._x1, this._x2];
};


/**
 * Sets the layout parameters for the current animation frame.
 * @param {array} params The array of layout parameters.
 * @param {dvt.Displayable=} indicator The animation indicator, whose geometry is centered at (0,0).
 */
DvtChartPolarBar.prototype.setAnimationParams = function(params, indicator) {
  // Set bar coords but don't adjust for gaps, since they've already been factored in.
  this._setBarCoords(params[0], params[1], params[2], params[3]);
};

/**
 * Returns the primary dvt.Fill for this bar. Used for animation, since getFill may return the fill of the selection
 * shapes.
 * @return {dvt.Fill}
 */
DvtChartPolarBar.prototype.getPrimaryFill = function() {
  // Note: getFill is currently correct, but will change once we stop using filters.
  return this.getFill();
};


/**
 * Returns a dvt.Playable containing the animation of the bar to its initial data value.
 * @param {number} duration The duration of the animation in seconds.
 * @return {dvt.Playable} A playable for the initial bar animation.
 */
DvtChartPolarBar.prototype.getDisplayAnimation = function(duration) {
  // Current state is the end state
  var endState = this.getAnimationParams();

  // Initialize the start state. To grow the bar, just set the end coord to the baseline coord.
  this.setAnimationParams([this._axisCoord, this._axisCoord, 0, 0]);

  // Create and return the playable
  var nodePlayable = new dvt.CustomAnimation(this.getCtx(), this, duration);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this, this.getAnimationParams, this.setAnimationParams, endState);
  return nodePlayable;
};


/**
 * Returns a dvt.Playable containing the animation to delete the bar.
 * @param {number} duration The duration of the animation in seconds.
 * @return {dvt.Playable}
 */
DvtChartPolarBar.prototype.getDeleteAnimation = function(duration) {
  // End state is for the bar length to shrink to 0
  var endState = [this._baselineCoord, this._baselineCoord, this._x1, this._x2];

  // Create and return the playable
  var nodePlayable = new dvt.CustomAnimation(this.getCtx(), this, duration);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this, this.getAnimationParams, this.setAnimationParams, endState);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.getAlpha, this.setAlpha, 0);
  return nodePlayable;
};


/**
 * Returns a dvt.Playable containing the insert animation of the bar.
 * @param {number} duration The duration of the animation in seconds.
 * @return {dvt.Playable}
 */
DvtChartPolarBar.prototype.getInsertAnimation = function(duration) {
  // Initialize the alpha to fade in the bar
  this.setAlpha(0);

  // Current state is the end state
  var endState = this.getAnimationParams();

  // Initialize the start state. To grow the bar, just set the end coord to the baseline coord.
  this.setAnimationParams([this._baselineCoord, this._baselineCoord, this._x1, this._x2]);

  // Create and return the playable
  var nodePlayable = new dvt.CustomAnimation(this.getCtx(), this, duration);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this, this.getAnimationParams, this.setAnimationParams, endState);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.getAlpha, this.setAlpha, 1);
  return nodePlayable;
};


/**
 * Stores the point coords defining the bar.
 * @param {number} baselineCoord The location from which the bar grows.
 * @param {number} endCoord The location where the bar length ends.
 * @param {number} x1 The left coord of a vertical bar, or the top of a horizontal bar.
 * @param {number} x2 The right coord of a vertical bar, or the bottom of a horizontal bar.
 * @private
 */
DvtChartPolarBar.prototype._setBarCoords = function(baselineCoord, endCoord, x1, x2) {
  var cx = this._availSpace.x + this._availSpace.w / 2;
  var cy = this._availSpace.y + this._availSpace.h / 2;
  var r = Math.max(endCoord, baselineCoord);
  var ir = Math.abs(endCoord - baselineCoord) >= DvtChartPolarBar._MIN_BAR_LENGTH_FOR_GAPS && (this._axisCoord != baselineCoord) ?
      Math.min(endCoord, baselineCoord) + this._dataItemGaps : Math.min(endCoord, baselineCoord);
  var sa = 360 - dvt.Math.radsToDegrees(Math.max(x1, x2)) + 90;
  var ae = dvt.Math.radsToDegrees(Math.abs(x2 - x1));
  this.setWedgeParams(cx, cy, r, r, sa, ae, this._dataItemGaps, ir);

  // Calculate the coords to compute the bounding box
  var inner1 = DvtChartPlotAreaRenderer.polarToCartesian(baselineCoord, x1, this._availSpace);
  var inner2 = DvtChartPlotAreaRenderer.polarToCartesian(baselineCoord, x2, this._availSpace);
  var outer1 = DvtChartPlotAreaRenderer.polarToCartesian(endCoord, x1, this._availSpace);
  var outer2 = DvtChartPlotAreaRenderer.polarToCartesian(endCoord, x2, this._availSpace);
  var minX = Math.min(inner1.x, inner2.x, outer1.x, outer2.x);
  var maxX = Math.max(inner1.x, inner2.x, outer1.x, outer2.x);
  var minY = Math.min(inner1.y, inner2.y, outer1.y, outer2.y);
  var maxY = Math.max(inner1.y, inner2.y, outer1.y, outer2.y);
  this._bbox = new dvt.Rectangle(minX, minY, maxX - minX, maxY - minY);

  // Store the geometry values, needed for animation
  this._baselineCoord = baselineCoord;
  this._endCoord = endCoord;
  this._x1 = x1;
  this._x2 = x2;
};

/**
 * Returns the bounding box of the shape
 * @return {dvt.Rectangle} bbox
 */
DvtChartPolarBar.prototype.getBoundingBox = function() {
  return this._bbox;
};
/**
 * A marker for range area chart.
 * @class DvtChartRangeMarker
 * @extends {dvt.Path}
 * @constructor
 * @param {dvt.Context} context
 * @param {number} x1 The x coord of the first point.
 * @param {number} y1 The y coord of the first point.
 * @param {number} x2 The x coord of the second point.
 * @param {number} y2 The y coord of the second point.
 * @param {number} markerSize The diameter of the marker.
 * @param {boolean} isInvisible Whether the marker is invisible unless hovered/selected.
 */
var DvtChartRangeMarker = function(context, x1, y1, x2, y2, markerSize, isInvisible)
{
  this.Init(context);

  this._markerSize = markerSize;
  this._isInvisible = isInvisible;

  this._drawPath(x1, y1, x2, y2);
};

dvt.Obj.createSubclass(DvtChartRangeMarker, dvt.Path);

/**
 * Draws the marker shape.
 * @param {number} x1 The x coord of the first point.
 * @param {number} y1 The y coord of the first point.
 * @param {number} x2 The x coord of the second point.
 * @param {number} y2 The y coord of the second point.
 * @private
 */
DvtChartRangeMarker.prototype._drawPath = function(x1, y1, x2, y2) {
  // Construct the path
  var angle = Math.atan2(y2 - y1, x2 - x1);
  var r = this._markerSize / 2;
  var lineAngle = Math.PI / 8;

  var cmds = dvt.PathUtils.moveTo(x1 + r * Math.cos(angle + lineAngle), y1 + r * Math.sin(angle + lineAngle)) +
             dvt.PathUtils.arcTo(r, r, 2 * (Math.PI - lineAngle), 1, x1 + r * Math.cos(angle - lineAngle), y1 + r * Math.sin(angle - lineAngle)) +
             dvt.PathUtils.lineTo(x2 - r * Math.cos(angle + lineAngle), y2 - r * Math.sin(angle + lineAngle)) +
             dvt.PathUtils.arcTo(r, r, 2 * (Math.PI - lineAngle), 1, x2 - r * Math.cos(angle - lineAngle), y2 - r * Math.sin(angle - lineAngle)) +
             dvt.PathUtils.closePath();

  this.setCmds(cmds);

  // Save the coords
  this._x1 = x1;
  this._y1 = y1;
  this._x2 = x2;
  this._y2 = y2;
};

/**
 * Specifies the styles needed to generate the selection effect.
 * @param {dvt.Fill} fill
 * @param {dvt.Stroke} stroke
 * @param {string} dataColor The color of the data.
 * @param {string} innerColor The color of the inner selection border.
 * @param {string} outerColor The color of the outer selection border.
 */
DvtChartRangeMarker.prototype.setStyleProperties = function(fill, stroke, dataColor, innerColor, outerColor) {
  this._dataColor = dataColor;
  var hoverColor = dvt.SelectionEffectUtils.getHoverBorderColor(dataColor);

  if (this._isInvisible) {
    this.setInvisibleFill();
    this._hoverStroke = new dvt.SolidStroke(hoverColor, 1, 1.5);
  }
  else {
    this.setFill(fill);
    this.setStroke(stroke);
    this.setHoverStroke(new dvt.SolidStroke(innerColor, 1, 1), new dvt.SolidStroke(hoverColor, 1, 3.5));
    this.setSelectedStroke(new dvt.SolidStroke(innerColor, 1, 1.5), new dvt.SolidStroke(outerColor, 1, 4.5));
    this.setSelectedHoverStroke(new dvt.SolidStroke(innerColor, 1, 1.5), new dvt.SolidStroke(hoverColor, 1, 4.5));
  }
};

/**
 * @override
 */
DvtChartRangeMarker.prototype.getDataColor = function() {
  return this._dataColor;
};


/**
 * @override
 */
DvtChartRangeMarker.prototype.showHoverEffect = function() {
  if (this._isInvisible) {
    this.IsShowingHoverEffect = true;
    this.setStroke(this._hoverStroke);
  }
  else
    DvtChartRangeMarker.superclass.showHoverEffect.call(this);
};

/**
 * @override
 */
DvtChartRangeMarker.prototype.hideHoverEffect = function() {
  if (this._isInvisible) {
    this.IsShowingHoverEffect = false;
    this.setStroke(this.isSelected() ? DvtChartLineMarker.SELECTED_STROKE : DvtChartLineMarker.DEFAULT_STROKE);
  }
  else
    DvtChartRangeMarker.superclass.hideHoverEffect.call(this);
};

/**
 * @override
 */
DvtChartRangeMarker.prototype.setSelected = function(selected)
{
  if (this._isInvisible) {
    if (this.IsSelected == selected)
      return;

    this.IsSelected = selected;
    if (this.isSelected()) {
      this.setFill(DvtChartLineMarker.SELECTED_FILL);
      this.setStroke(this.isHoverEffectShown() ? this._hoverStroke : DvtChartLineMarker.SELECTED_STROKE);
    }
    else {
      this.setInvisibleFill();
      this.setStroke(this.isHoverEffectShown() ? this._hoverStroke : DvtChartLineMarker.DEFAULT_STROKE);
    }
  }
  else
    DvtChartRangeMarker.superclass.setSelected.call(this, selected);
};

/**
 * @override
 */
DvtChartRangeMarker.prototype.UpdateSelectionEffect = function() {
  if (!this._isInvisible)
    DvtChartRangeMarker.superclass.UpdateSelectionEffect.call(this);
};

/**
 * Returns the animation params for the marker.
 * @return {array} params
 */
DvtChartRangeMarker.prototype.getAnimationParams = function() {
  return [this._x1, this._y1, this._x2, this._y2];
};

/**
 * Updates the animation params for the marker.
 * @param {array} params
 */
DvtChartRangeMarker.prototype.setAnimationParams = function(params) {
  this._drawPath(params[0], params[1], params[2], params[3]);
};

/**
 * Returns whether the marker is invisible.
 * @return {boolean}
 */
DvtChartRangeMarker.prototype.isInvisible = function() {
  return this._isInvisible;
};

/**
 * Returns the bounding box of the shape
 * @return {dvt.Rectangle} bbox
 */
DvtChartRangeMarker.prototype.getBoundingBox = function() {
  return this.getBoundingBox1().getUnion(this.getBoundingBox2());
};

/**
 * Returns the bounding box of marker #1 (x1, y1)
 * @return {dvt.Rectangle} bbox
 */
DvtChartRangeMarker.prototype.getBoundingBox1 = function() {
  return new dvt.Rectangle(this._x1 - this._markerSize / 2, this._y1 - this._markerSize / 2, this._markerSize, this._markerSize);
};

/**
 * Returns the bounding box of marker #2 (x2, y2)
 * @return {dvt.Rectangle} bbox
 */
DvtChartRangeMarker.prototype.getBoundingBox2 = function() {
  return new dvt.Rectangle(this._x2 - this._markerSize / 2, this._y2 - this._markerSize / 2, this._markerSize, this._markerSize);
};
/**
 * Data cursor component.
 * @extends {dvt.Container}
 * @class DvtChartDataCursor  Creates a data cursor component.
 * @constructor
 * @param {dvt.Context} context The context object.
 * @param {object} options The data cursor options.
 * @param {boolean} bHoriz True if this is a data cursor for horizontal charts.
 */
var DvtChartDataCursor = function(context, options, bHoriz) {
  this.Init(context, options, bHoriz);
};

dvt.Obj.createSubclass(DvtChartDataCursor, dvt.Container);

/** @const */
DvtChartDataCursor.BEHAVIOR_SNAP = 'SNAP';
/** @const */
DvtChartDataCursor.BEHAVIOR_SMOOTH = 'SMOOTH';
/** @const */
DvtChartDataCursor.BEHAVIOR_AUTO = 'AUTO';
/** @const */
DvtChartDataCursor.TOOLTIP_ID = '_dvtDataCursor';


/**
 * Initializes the data cursor.
 * @param {dvt.Context} context The context object.
 * @param {object} options The data cursor options.
 * @param {boolean} bHoriz True if this is a data cursor for horizontal charts.
 */
DvtChartDataCursor.prototype.Init = function(context, options, bHoriz) {
  DvtChartDataCursor.superclass.Init.call(this, context);
  this._bHoriz = bHoriz;
  this._options = options;

  // Data cursor is never the target of mouse events
  this.setMouseEnabled(false);

  // Initially invisible until shown
  this.setVisible(false);

  //******************************************* Data Cursor Line ******************************************************/
  var lineWidth = options['lineWidth'];
  var lineColor = options['lineColor'];
  var lineStyle = dvt.Stroke.convertTypeString(options['lineStyle']);
  var stroke = new dvt.SolidStroke(lineColor, 1, lineWidth);
  stroke.setStyle(lineStyle);

  this._cursorLine = new dvt.Line(this.getCtx(), 0, 0, 0, 0, 'dcLine');
  this._cursorLine.setStroke(stroke);
  this.addChild(this._cursorLine);

  //****************************************** Data Cursor Marker *****************************************************/
  if (options['markerDisplayed'] != 'off') {
    this._marker = new dvt.Container(this._context);
    this._marker.setMouseEnabled(false);
    this.addChild(this._marker);

    var markerSize = options['markerSize'];
    var outerCircle = new dvt.SimpleMarker(this._context, dvt.SimpleMarker.CIRCLE, null, 0, 0, markerSize + 4 * lineWidth, markerSize + 4 * lineWidth);
    outerCircle.setSolidFill(lineColor);
    this._marker.addChild(outerCircle);

    var middleCircle = new dvt.SimpleMarker(this._context, dvt.SimpleMarker.CIRCLE, null, 0, 0, markerSize + 2 * lineWidth, markerSize + 2 * lineWidth);
    middleCircle.setSolidFill('white');
    this._marker.addChild(middleCircle);

    // Inner circle will be filled to correspond to the data item color
    this._markerInnerCircle = new dvt.SimpleMarker(this._context, dvt.SimpleMarker.CIRCLE, null, 0, 0, markerSize, markerSize);
    this._marker.addChild(this._markerInnerCircle);
  }
};


/**
 * Renders this data cursor.
 * @param {dvt.Rectangle} plotAreaBounds The bounds of the plot area.
 * @param {number} dataX The x coordinate of the actual data point, where the marker should be placed.
 * @param {number} dataY The y coordinate of the actual data point, where the marker should be placed.
 * @param {number} lineCoord The x coordinate of a vertical data cursor, or the y coordinate of a horizontal data cursor.
 * @param {string} text The text for the datatip.
 * @param {string} dataColor The primary color of the associated data item.
 */
DvtChartDataCursor.prototype.render = function(plotAreaBounds, dataX, dataY, lineCoord, text, dataColor) {
  var bHoriz = this.isHorizontal();
  var bRtl = dvt.Agent.isRightToLeft(this.getCtx());
  var tooltipBounds;

  if (text != null && text != '') {
    // First render the datatip to retrieve its size.
    var stagePageCoords = this.getCtx().getStageAbsolutePosition();
    var tooltipManager = this.getCtx().getTooltipManager(DvtChartDataCursor.TOOLTIP_ID);
    tooltipManager.showDatatip(dataX + stagePageCoords.x, dataY + stagePageCoords.y, text, dataColor, false);
    tooltipBounds = tooltipManager.getTooltipBounds(); // tooltipBounds is in the page coordinate space

    // Then reposition to the right location
    var markerSizeOuter = this._options['markerSize'] + 4 * this._options['lineWidth'];
    var tooltipX, tooltipY; // tooltipX and tooltipY in the stage coordinate space
    if (bHoriz) {
      tooltipX = bRtl ? plotAreaBounds.x - 0.75 * tooltipBounds.w : plotAreaBounds.x + plotAreaBounds.w - tooltipBounds.w / 4;
      tooltipY = lineCoord - tooltipBounds.h / 2;

      // Add a buffer between the tooltip and data point. This may be rejected in positionTip due to viewport location.
      if (!bRtl && tooltipX - dataX < markerSizeOuter)
        tooltipX = dataX + markerSizeOuter;
      else if (bRtl && dataX - (tooltipX + tooltipBounds.w) < markerSizeOuter)
        tooltipX = dataX - markerSizeOuter - tooltipBounds.w;
    }
    else {
      tooltipX = lineCoord - tooltipBounds.w / 2;
      tooltipY = plotAreaBounds.y - 0.75 * tooltipBounds.h;

      // Add a buffer between the tooltip and data point. This may be rejected in positionTip due to viewport location.
      if (dataY - (tooltipY + tooltipBounds.h) < markerSizeOuter)
        tooltipY = dataY - markerSizeOuter - tooltipBounds.h;
    }
    tooltipManager.positionTip(tooltipX + stagePageCoords.x, tooltipY + stagePageCoords.y);

    // Finally retrieve the rendered bounds to calculate the attachment point for the cursor line.
    tooltipBounds = tooltipManager.getTooltipBounds(); // tooltipBounds is in the page coordinate space
    tooltipBounds.x -= stagePageCoords.x;
    tooltipBounds.y -= stagePageCoords.y;
  }

  // Position the cursor line. Use 1px fudge factor to ensure that the line connects to the tooltip.
  if (bHoriz) {
    this._cursorLine.setTranslateY(lineCoord);
    if (bRtl) {
      this._cursorLine.setX1(tooltipBounds ? tooltipBounds.x + tooltipBounds.w - 1 : plotAreaBounds.x);
      this._cursorLine.setX2(plotAreaBounds.x + plotAreaBounds.w);
    }
    else {
      this._cursorLine.setX1(plotAreaBounds.x);
      this._cursorLine.setX2(tooltipBounds ? tooltipBounds.x + 1 : plotAreaBounds.x + plotAreaBounds.w);
    }
  }
  else { // Vertical
    this._cursorLine.setTranslateX(lineCoord);

    // Position the cursor line
    this._cursorLine.setY1(tooltipBounds ? tooltipBounds.y + tooltipBounds.h - 1 : plotAreaBounds.y);
    this._cursorLine.setY2(plotAreaBounds.y + plotAreaBounds.h);
  }

  if (this._marker) {
    // Position the marker
    this._marker.setTranslate(dataX, dataY);

    // Set the marker color
    var markerColor = this._options['markerColor'];
    this._markerInnerCircle.setSolidFill(markerColor ? markerColor : dataColor);

    // : Workaround firefox issue
    dvt.Agent.workaroundFirefoxRepaint(this._marker);
  }
};


/**
 * Returns true if this is a data cursor for a horizontal graph.
 * @return {boolean}
 */
DvtChartDataCursor.prototype.isHorizontal = function() {
  return this._bHoriz;
};


/**
 * Returns the behavior of the data cursor.
 * @return {string}
 */
DvtChartDataCursor.prototype.getBehavior = function() {
  return this._behavior ? this._behavior : DvtChartDataCursor.BEHAVIOR_AUTO;
};


/**
 * Specifies the behavior of the data cursor.
 * @param {string} behavior
 */
DvtChartDataCursor.prototype.setBehavior = function(behavior) {
  this._behavior = behavior;
};
// Copyright (c) 2013, 2016, Oracle and/or its affiliates. All rights reserved.
/**
  *  Creates a funnel shape.
  *  @extends {dvt.Path}
  *  @class DvtChartFunnelSlice  Creates a funnel slice object.
  *  @constructor
  *  @param {dvt.Chart} chart  The chart being rendered.
  *  @param {number} seriesIndex  The index of this slice.
  *  @param {number} numDrawnSeries  The number of series already drawn. Should be total number of series - seriesIndex - 1 if none are skipped.
  *  @param {number} funnelWidth The available width for the whole funnel.
  *  @param {number} funnelHeight The available height for the whole funnel.
  *  @param {number} startPercent The cumulative value of all the slices that come before. The start/leftmost value of the slice.
  *  @param {number} valuePercent The percent value for the slice. Dictates the width.
  *  @param {number} fillPercent The actual/target value, how much of the slice is filled.
  *  @param {number} gap The gap distance between slices.
  */
var DvtChartFunnelSlice = function(chart, seriesIndex, numDrawnSeries, funnelWidth, funnelHeight, startPercent, valuePercent, fillPercent, gap) {
  this.Init(chart, seriesIndex, numDrawnSeries, funnelWidth, funnelHeight, startPercent, valuePercent, fillPercent, gap);
};

dvt.Obj.createSubclass(DvtChartFunnelSlice, dvt.Path);


/**
 *  Object initializer.
  *  @param {dvt.Chart} chart  The chart being rendered.
  *  @param {number} seriesIndex  The index of this slice.
  *  @param {number} numDrawnSeries  The number of series already drawn. Should be total number of series - seriesIndex - 1 if none are skipped.
  *  @param {number} funnelWidth The available width for the whole funnel.
  *  @param {number} funnelHeight The available height for the whole funnel.
  *  @param {number} startPercent The cumulative value of all the slices that come before. The start/leftmost value of the slice.
  *  @param {number} valuePercent The percent value for the slice. Dictates the width.
  *  @param {number} fillPercent The actual/target value, how much of the slice is filled.
  *  @param {number} gap The gap distance between slices.
 *  @protected
 */
DvtChartFunnelSlice.prototype.Init = function(chart, seriesIndex, numDrawnSeries, funnelWidth, funnelHeight, startPercent, valuePercent, fillPercent, gap) {
  DvtChartFunnelSlice.superclass.Init.call(this, chart.getCtx());
  this._chart = chart;
  var styleDefaults = chart.getOptions()['styleDefaults'];
  this._seriesIndex = seriesIndex;
  this._numDrawnSeries = numDrawnSeries;
  this._funnelWidth = funnelWidth;
  this._funnelHeight = funnelHeight;
  this._startPercent = startPercent;
  this._valuePercent = valuePercent;
  this._fillPercent = fillPercent;
  this._3dRatio = (styleDefaults['threeDEffect'] == 'on') ? 1 : 0;
  this._gap = gap;
  var cmds = this._getPath();
  this._dataColor = DvtChartStyleUtils.getColor(this._chart, this._seriesIndex, 0);
  // Read the color from backgroundColor for backwards compatibility
  this._backgroundColor = styleDefaults['backgroundColor'] ? styleDefaults['backgroundColor'] : styleDefaults['funnelBackgroundColor'];

  this.setCmds(cmds['slice']);
  if (cmds['bar']) {
    this._bar = new dvt.Path(this.getCtx(), cmds['bar']);
    this.addChild(this._bar);
    this._bar.setMouseEnabled(false); // want the mouse interaction to only be with the slice.
  }

  this._setColorProperties(cmds['sliceBounds']);
  this._label = this._getSliceLabel(cmds['sliceBounds'], cmds['barBounds']);

  if (this._label != null) {
    this._label.setMouseEnabled(false);
    this.addChild(this._label);
  }
};

/** The ratio of rx/ry in the 3D funnel opening
 * @private */
DvtChartFunnelSlice._FUNNEL_3D_WIDTH_RATIO = .08;
/** Angle for creating the funnel sides
 * @private */
DvtChartFunnelSlice._FUNNEL_ANGLE_2D = 36;
/** Ratio between the smallest and largest slices
 * @private */
DvtChartFunnelSlice._FUNNEL_RATIO = 1 / 3;
/** Color for funnel slice border. Could be overridden in styleDefaults.
 * @private */
DvtChartFunnelSlice._BORDER_COLOR = '#FFFFFF';
/** Minimum number of characters to use when truncating.
 * @private */
DvtChartFunnelSlice._MIN_CHARS_DATA_LABEL = 3;
/** Length of the first line.
 * @private */
DvtChartFunnelSlice._LINE_FRACTION = 2 / 3;
/** Fraction into which the funnel area is divided by the first line.
 * @private */
DvtChartFunnelSlice._AREA_FRACTION = 0.41;
/** Fraction into which the funnel height is divided by the first line.
 * @private */
DvtChartFunnelSlice._HEIGHT_FRACTION = 0.28;
/** Length of the second line.
 * @private */
DvtChartFunnelSlice._LINE_FRACTION_2 = 0.4;
/** Fraction into which the funnel area is divided by the second line.
 * @private */
DvtChartFunnelSlice._AREA_FRACTION_2 = 0.8;
/** Fraction into which the funnel height is divided by the second line.
 * @private */
DvtChartFunnelSlice._HEIGHT_FRACTION_2 = 0.7;


/**
 * Creates the path commands that represent this slice
 * @return {object} The commands for drawing this slice. An object containing the sliceCommands, barCommands, sliceBounds and barBounds
 * @private
 */
DvtChartFunnelSlice.prototype._getPath = function() {
  var isBiDi = dvt.Agent.isRightToLeft(this.getCtx());
  var gapCount = DvtChartDataUtils.getSeriesCount(this._chart);
  var offset = (this._numDrawnSeries + 1) * this._gap;
  var angle = dvt.Math.degreesToRads(DvtChartFunnelSlice._FUNNEL_ANGLE_2D - 2 * this._3dRatio);

  var totalWidth = this._funnelWidth - gapCount * this._gap;
  var rx = totalWidth / Math.sin(dvt.Math.degreesToRads(DvtChartFunnelSlice._FUNNEL_ANGLE_2D));
  var ry = this._funnelHeight / Math.sin(angle);
  var ratio = this._3dRatio * this._funnelWidth / this._funnelHeight * DvtChartFunnelSlice._FUNNEL_3D_WIDTH_RATIO;
  if (ratio < 0.00001)
    ratio = 0;

  // Dividing the funnel into three trapezoids to come up with a better approximation for the dimensions. We draw two lines,
  // at .28 and .7 of the height, and they split the area to the ratio .41: .39: .2.
  var b1 = this._funnelHeight;
  var b2 = this._funnelHeight * DvtChartFunnelSlice._FUNNEL_RATIO;
  var p1, p2; // The percent at which we are calculating the width
  var b11, b12, b21, b22;  // The first and second base of the trapezoid into which the percent we are looking at falls.
  var f1, f2; // The fraction of the area included in the trapezoid we are considering.
  var t1, t2; // Total width of the trapezoid we are considering.
  var h1, h2; // Horizontal distance from the slice to the center of the ellipse for drawing the funnel arcs.

  // calculating first edge
  if (this._startPercent < DvtChartFunnelSlice._AREA_FRACTION) {
    p1 = this._startPercent;
    b11 = b1;
    b21 = this._funnelHeight * DvtChartFunnelSlice._LINE_FRACTION;
    f1 = DvtChartFunnelSlice._AREA_FRACTION;
    t1 = totalWidth * DvtChartFunnelSlice._HEIGHT_FRACTION;
    h1 = totalWidth * (1 - DvtChartFunnelSlice._HEIGHT_FRACTION);
  }
  else if (this._startPercent < DvtChartFunnelSlice._AREA_FRACTION_2) {
    p1 = this._startPercent - DvtChartFunnelSlice._AREA_FRACTION;
    b11 = this._funnelHeight * DvtChartFunnelSlice._LINE_FRACTION;
    b21 = this._funnelHeight * DvtChartFunnelSlice._LINE_FRACTION_2;
    f1 = DvtChartFunnelSlice._AREA_FRACTION_2 - DvtChartFunnelSlice._AREA_FRACTION;
    t1 = totalWidth * (DvtChartFunnelSlice._HEIGHT_FRACTION_2 - DvtChartFunnelSlice._HEIGHT_FRACTION);
    h1 = totalWidth * (1 - DvtChartFunnelSlice._HEIGHT_FRACTION_2);
  }
  else {
    p1 = this._startPercent - DvtChartFunnelSlice._AREA_FRACTION_2;
    b11 = this._funnelHeight * DvtChartFunnelSlice._LINE_FRACTION_2;
    b21 = b2;
    f1 = 1 - DvtChartFunnelSlice._AREA_FRACTION_2;
    t1 = totalWidth * (1 - DvtChartFunnelSlice._HEIGHT_FRACTION_2);
    h1 = 0;
  }

  // Calculating second edge
  if (this._startPercent + this._valuePercent < DvtChartFunnelSlice._AREA_FRACTION) {
    b12 = b1;
    b22 = this._funnelHeight * DvtChartFunnelSlice._LINE_FRACTION;
    p2 = this._startPercent + this._valuePercent;
    f2 = DvtChartFunnelSlice._AREA_FRACTION;
    t2 = totalWidth * DvtChartFunnelSlice._HEIGHT_FRACTION;
    h2 = totalWidth * (1 - DvtChartFunnelSlice._HEIGHT_FRACTION);
  }
  else if (this._startPercent + this._valuePercent < DvtChartFunnelSlice._AREA_FRACTION_2) {
    b12 = this._funnelHeight * DvtChartFunnelSlice._LINE_FRACTION;
    b22 = this._funnelHeight * DvtChartFunnelSlice._LINE_FRACTION_2;
    p2 = this._startPercent + this._valuePercent - DvtChartFunnelSlice._AREA_FRACTION;
    f2 = DvtChartFunnelSlice._AREA_FRACTION_2 - DvtChartFunnelSlice._AREA_FRACTION;
    t2 = totalWidth * (DvtChartFunnelSlice._HEIGHT_FRACTION_2 - DvtChartFunnelSlice._HEIGHT_FRACTION);
    h2 = totalWidth * (1 - DvtChartFunnelSlice._HEIGHT_FRACTION_2);
  }
  else {
    b12 = this._funnelHeight * DvtChartFunnelSlice._LINE_FRACTION_2;
    b22 = b2;
    p2 = this._startPercent + this._valuePercent - DvtChartFunnelSlice._AREA_FRACTION_2;
    f2 = 1 - DvtChartFunnelSlice._AREA_FRACTION_2;
    t2 = totalWidth * (1 - DvtChartFunnelSlice._HEIGHT_FRACTION_2);
    h2 = 0;
  }

  var w1 = Math.sqrt((f1 - p1) / f1 * b11 * b11 + p1 / f1 * b21 * b21);
  var w2 = Math.sqrt((f2 - p2) / f2 * b12 * b12 + p2 / f2 * b22 * b22);

  var startAngle = 0.98 * Math.asin((((w1 - b21) * (t1) / (b11 - b21)) + h1) / rx);
  var endAngle = 0.98 * Math.asin((((w2 - b22) * (t2) / (b12 - b22)) + h2) / rx);

  var c1 = (1 + DvtChartFunnelSlice._FUNNEL_RATIO) / 2 * this._funnelHeight + ry;
  var c2 = (1 - DvtChartFunnelSlice._FUNNEL_RATIO) / 2 * this._funnelHeight - ry;
  var ar, arcDir1, arcDir2;

  if (isBiDi) {
    ar = [rx * Math.sin(startAngle) + offset, c1 - ry * Math.cos(startAngle), rx * Math.sin(endAngle) + offset, c1 - ry * Math.cos(endAngle), rx * Math.sin(endAngle) + offset, c2 + ry * Math.cos(endAngle), rx * Math.sin(startAngle) + offset, c2 + ry * Math.cos(startAngle)];
    arcDir1 = 0;
    arcDir2 = 1;
  } else {
    ar = [this._funnelWidth - offset - rx * Math.sin(startAngle), c1 - ry * Math.cos(startAngle), this._funnelWidth - offset - rx * Math.sin(endAngle), c1 - ry * Math.cos(endAngle), this._funnelWidth - offset - rx * Math.sin(endAngle), c2 + ry * Math.cos(endAngle), this._funnelWidth - offset - rx * Math.sin(startAngle), c2 + ry * Math.cos(startAngle)];
    arcDir1 = 1;
    arcDir2 = 0;
  }

  var pathCommands = dvt.PathUtils.moveTo(ar[0], ar[1]);
  var barCommands = null;
  pathCommands += dvt.PathUtils.arcTo(ratio * (ar[1] - ar[7]) / 2, (ar[1] - ar[7]) / 2, Math.PI, arcDir2, ar[6], ar[7]);
  pathCommands += dvt.PathUtils.arcTo(ratio * (ar[1] - ar[7]) / 2, (ar[1] - ar[7]) / 2, Math.PI, arcDir2, ar[0], ar[1]);
  pathCommands += dvt.PathUtils.arcTo(rx, ry, angle, arcDir1, ar[2], ar[3]);
  pathCommands += dvt.PathUtils.arcTo(ratio * (ar[3] - ar[5]) / 2, (ar[3] - ar[5]) / 2, Math.PI, arcDir2, ar[4], ar[5]);
  pathCommands += dvt.PathUtils.arcTo(rx, ry, angle, arcDir1, ar[6], ar[7]);
  var sliceBounds = new dvt.Rectangle(Math.min(ar[0], ar[2]), ar[5], Math.abs(ar[0] - ar[2]), Math.abs(ar[3] - ar[5]));

  if (this._fillPercent != null) { // creating the bar commands for 3D slices if applicable
    var percent = Math.max(Math.min(this._fillPercent, 1), 0);
    var alpha = isBiDi ? - percent * Math.PI : percent * Math.PI;
    barCommands = dvt.PathUtils.moveTo(ar[0], ar[1]);
    barCommands += dvt.PathUtils.arcTo(rx, ry, angle, arcDir1, ar[2], ar[3]);
    barCommands += dvt.PathUtils.arcTo(ratio * (ar[3] - ar[5]) / 2, (ar[3] - ar[5]) / 2, alpha, arcDir2, ar[2] + ratio * (ar[3] - ar[5]) / 2 * Math.sin(alpha), (ar[5] + ar[3]) / 2 + (ar[3] - ar[5]) / 2 * Math.cos(alpha));
    // Edge cases require different bar shapes so they don't spill out of the slice.
    if (this._fillPercent > .95)
      barCommands += dvt.PathUtils.arcTo(rx, ry, angle, arcDir1, ar[6], ar[1] + percent * (ar[7] - ar[1]));
    else if (this._fillPercent < .05)
      barCommands += dvt.PathUtils.arcTo(rx, ry, angle, arcDir2, ar[6], ar[1] + percent * (ar[7] - ar[1]));
    else
      barCommands += dvt.PathUtils.lineTo(ar[6] + ratio * (ar[1] - ar[7]) / 2 * Math.sin(alpha), (ar[7] + ar[1]) / 2 + (ar[1] - ar[7]) / 2 * Math.cos(alpha));
    barCommands += dvt.PathUtils.arcTo(ratio * (ar[1] - ar[7]) / 2, (ar[1] - ar[7]) / 2, alpha, arcDir1, ar[0], ar[1]);
    barCommands += dvt.PathUtils.closePath();
    var barBounds = new dvt.Rectangle(Math.min(ar[0], ar[2]), ar[5] + Math.abs(ar[3] - ar[5]) * (1 - percent), Math.abs(ar[0] - ar[2]), Math.abs(ar[3] - ar[5]) * percent);
  }
  return {'slice': pathCommands, 'bar': barCommands, 'sliceBounds': sliceBounds, 'barBounds': barCommands ? barBounds : sliceBounds};

};


/**
 * Creates a single slice label DvtText object associated with this slice.
 * @param {dvt.Rectangle} sliceBounds The space occupied by the slice this is associated with.
 * @param {dvt.Rectangle} barBounds The space occupied by the colored bar this is associated with. Could affect the color.
 * @return {dvt.OutputText} slice label for this slice
 * @private
 */
DvtChartFunnelSlice.prototype._getSliceLabel = function(sliceBounds, barBounds) {
  // Get and create the label string
  var labelString = DvtChartDataUtils.getDataLabel(this._chart, this._seriesIndex, 0);
  if (!labelString) // if no data label set on the data item, set it from the series
    labelString = DvtChartDataUtils.getSeriesLabel(this._chart, this._seriesIndex);

  // Return if no label or label position none
  if (!labelString || DvtChartStyleUtils.getDataLabelPosition(this._chart, this._seriesIndex, 0) == 'none')
    return;

  var label = new dvt.OutputText(this.getCtx(), labelString, 0, 0);

  // Have to move the style setting first because was using wrong font size to come up with truncated text
  var isPatternBg = DvtChartStyleUtils.getPattern(this._chart, this._seriesIndex, 0) != null;
  var labelStyleArray = [this._chart.getOptions()['styleDefaults']['dataLabelStyle'], new dvt.CSSStyle(this._chart.getOptions()['styleDefaults']['sliceLabelStyle']),
        new dvt.CSSStyle(DvtChartDataUtils.getDataItem(this._chart, this._seriesIndex, 0)['labelStyle'])];
  var style = dvt.CSSStyle.mergeStyles(labelStyleArray);
  label.setCSSStyle(style);

  // Truncating text and dropping if doesn't fit.
  if (! dvt.TextUtils.fitText(label, sliceBounds.h - this._3dRatio * (0.8 - this._valuePercent) * 50, sliceBounds.w, this, DvtChartFunnelSlice._MIN_CHARS_DATA_LABEL))
    return;

  var textDim = label.measureDimensions();
  var pos = this._getLabelPosition(sliceBounds);
  // Checking if the text starts within the bounding box of the colored bar.
  if (isPatternBg) {
    var padding = textDim.h * 0.15;
    var displacement = dvt.Agent.isRightToLeft(this.getCtx()) ? 0.5 : -0.5;
    var cmd = dvt.PathUtils.roundedRectangle(textDim.x - padding, textDim.y, textDim.w + 2 * padding, textDim.h, 2, 2, 2, 2);
    var bbox = new dvt.Path(this.getCtx(), cmd);
    bbox.setSolidFill('#FFFFFF', 0.9);
    pos.translate(displacement * textDim.h, -displacement * textDim.w);
    bbox.setMatrix(pos);
    this.addChild(bbox);
  }
  var labelColor = isPatternBg ? '#000000' :
                   barBounds.containsPoint(sliceBounds.x, sliceBounds.y + (sliceBounds.h - textDim.w) / 2) ?
                   dvt.ColorUtils.getContrastingTextColor(this._dataColor) : dvt.ColorUtils.getContrastingTextColor(this._backgroundColor);
  // Don't want to override the color if it was set above, unless in high contrast mode.
  if (!style.getStyle('color') || dvt.Agent.isHighContrast())
    label.setCSSStyle(style.setStyle('color', labelColor));
  label.setMatrix(this._getLabelPosition(sliceBounds));
  label.alignCenter();
  label.alignMiddle();
  return label;
};


/**
 * Calculates the position of the text within this slice. Comes up with the translation/rotation matrix.
 * @param {dvt.Rectangle} sliceBounds The space occupied by the slice.
 * @return {dvt.Matrix} The matrix representing the transformation for placing the text.
 * @private
 */
DvtChartFunnelSlice.prototype._getLabelPosition = function(sliceBounds) {
  var displacement = this._3dRatio * (sliceBounds.h * this._funnelWidth / this._funnelHeight * DvtChartFunnelSlice._FUNNEL_3D_WIDTH_RATIO / 2); // to make up for the 3D funnel opening
  // Rotate the text
  var rotationMatrix = new dvt.Matrix();
  if (dvt.Agent.isRightToLeft(this.getCtx())) {
    rotationMatrix.rotate(Math.PI / 2);
    rotationMatrix.translate(sliceBounds.x + sliceBounds.w / 2 - displacement, sliceBounds.y + sliceBounds.h / 2);
  }
  else {
    rotationMatrix.rotate(3 * Math.PI / 2);
    rotationMatrix.translate(sliceBounds.x + sliceBounds.w / 2 + displacement, sliceBounds.y + sliceBounds.h / 2);
  }
  return rotationMatrix;
};


/**
 * Passing on the colors for the funnel slice object. Sets the slice fill and border color, as well as the selection and hover colors by reading them from the chart.
 * @param {dvt.Rectangle} sliceBounds The space occupied by the slice. This is used for calculating the gradient effect bounds.
 * @private
 */
DvtChartFunnelSlice.prototype._setColorProperties = function(sliceBounds) {
  var sliceFill = DvtChartSeriesEffectUtils.getFunnelSliceFill(this._chart, this._seriesIndex, this._dataColor, sliceBounds);
  var sliceBorder = DvtChartStyleUtils.getBorderColor(this._chart, this._seriesIndex, 0);
  if (sliceBorder == null && this._3dRatio > 0)
    sliceBorder = DvtChartFunnelSlice._BORDER_COLOR;

  var sliceBorderWidth = DvtChartStyleUtils.getBorderWidth(this._chart, this._seriesIndex, 0);
  var backgroundFill = DvtChartSeriesEffectUtils.getFunnelSliceFill(this._chart, this._seriesIndex, this._backgroundColor, sliceBounds, true);
  if (this._bar) {
    this.setFill(backgroundFill);
    this._bar.setFill(sliceFill);
  }
  else
    this.setFill(sliceFill);

  if (sliceBorder)
    this.setSolidStroke(sliceBorder, null, sliceBorderWidth);

  // Save the original border stroke
  this.OriginalStroke = this.getStroke();

  if (this._chart.isSelectionSupported()) {
    // Set the selection strokes
    var hoverColor = dvt.SelectionEffectUtils.getHoverBorderColor(this._dataColor);
    var innerColor = DvtChartStyleUtils.getSelectedInnerColor(this._chart);
    var outerColor = DvtChartStyleUtils.getSelectedOuterColor(this._chart) ? DvtChartStyleUtils.getSelectedOuterColor(this._chart) : this._dataColor;
    var shapeForSelection = this._bar != null ? this._bar : this;
    shapeForSelection.setHoverStroke(new dvt.SolidStroke(hoverColor, 1, 2));
    shapeForSelection.setSelectedStroke(new dvt.SolidStroke(innerColor, 1, 1.5), new dvt.SolidStroke(outerColor, 1, 4.5));
    shapeForSelection.setSelectedHoverStroke(new dvt.SolidStroke(innerColor, 1, 1.5), new dvt.SolidStroke(hoverColor, 1, 4.5));

    this.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
  }
};


/**
 * Gets the percent values associated with the slice for animation
 * @return {array} the start, value, fill percents, and alpha for this slice.
 */
DvtChartFunnelSlice.prototype.getAnimationParams = function() {
  return [this._startPercent, this._valuePercent, this._fillPercent, this.getAlpha(), this._3dRatio];
};


/**
 * Sets the percent values associated with the slice for animation
 * @param {array} ar The new start, value, and fill percents for this slice
 */
DvtChartFunnelSlice.prototype.setAnimationParams = function(ar) {
  this._startPercent = ar[0];
  this._valuePercent = ar[1];
  this._fillPercent = (this._fillPercent != null) ? ar[2] : null;
  this.setAlpha(ar[3]);
  this._3dRatio = ar[4];
  var cmds = this._getPath();
  this.setCmds(cmds['slice']);
  if (cmds['bar'] && this._bar)
    this._bar.setCmds(cmds['bar']);
  if (this._label)
    this._label.setMatrix(this._getLabelPosition(cmds['sliceBounds']));
};


/**
 * @override
 */
DvtChartFunnelSlice.prototype.setSelected = function(selected) {
  if (this._bar != null) {
    if (this.IsSelected == selected)
      return;
    this.IsSelected = selected;
    this._bar.setSelected(selected);
  }
  else
    DvtChartFunnelSlice.superclass.setSelected.call(this, selected);

  var dims = this.getDimensions();
  var shapeForSelection = (this._bar != null) ? this._bar : this;
  var displacement = 3;
  // To make the selection effect more apparent - make the bars slightly smaller
  var w = dims.w;
  if (selected) {
    shapeForSelection.setScaleX((w - displacement) / w);
    shapeForSelection.setTranslateX(Math.ceil(displacement / 2) + displacement / w * dims.x);
  } else {
    shapeForSelection.setScaleX(1);
    shapeForSelection.setTranslateX(0);
  }
};


/**
 * @override
 */
DvtChartFunnelSlice.prototype.showHoverEffect = function() {
  if (this._bar != null) {
    this._bar.showHoverEffect();
  }
  else
    DvtChartFunnelSlice.superclass.showHoverEffect.call(this);
};


/**
 * @override
 */
DvtChartFunnelSlice.prototype.hideHoverEffect = function() {
  if (this._bar != null) {
    this._bar.hideHoverEffect();
  }
  else
    DvtChartFunnelSlice.superclass.hideHoverEffect.call(this);
};


/**
 * @override
 */
DvtChartFunnelSlice.prototype.copyShape = function() {
  return new DvtChartFunnelSlice(this._chart, this._seriesIndex, this._numDrawnSeries, this._funnelWidth, this._funnelHeight, this._startPercent, this._valuePercent, this._fillPercent, this._gap);
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
/*---------------------------------------------------------------------*/
/*   DvtChartPie                                                       */
/*---------------------------------------------------------------------*/

/*
 * Call chain:
 *
 * DvtChartPie.init gets called to create each logical DvtChartPieSlice object. Setting up the slice's size, location,
 * fill, label, label layout and the creation of the physical shapes are NOT done at this step.
 *
 * DvtChartPie.render then gets called to
 *
 * 1. create and layout the physical pie surface objects and physical labels
 * 2. order the slices for rendering
 * 3. layout the slice labels and feelers
 * 4. render the actual slices (add them to this DvtChartPie)
 * 5. render the slice labels and feelers.
 */



/**
 * Creates an instance of DvtChartPie
 * @param {dvt.Chart} chart The chart object.
 * @param {dvt.Rectangle} availSpace The available space to render the chart.
 * @param {function} callback A function that responds to events
 * @param {object} callbackObj The optional object instance that the callback function is defined on.
 *  @class DvtChartPie
 *  @extends {dvt.Container}
 *  @constructor
 */
var DvtChartPie = function(chart, availSpace, callback, callbackObj) {
  this.Init(chart, availSpace, callback, callbackObj);
};

// Private pie rendering constants
/** @private */
DvtChartPie._THREED_TILT = 0.59;
/** @private */
DvtChartPie._THREED_DEPTH = 0.1;
/** @private */
DvtChartPie._RADIUS = 0.45;
/** @private */
DvtChartPie._RADIUS_LABELS = 0.38;

dvt.Obj.createSubclass(DvtChartPie, dvt.Container);


/*----------------------------------------------------------------------*/
/* Init()                                                               */
/*----------------------------------------------------------------------*/
/**
 * Object initializer
 * @protected
 * @param {dvt.Chart} chart The chart object.
 * @param {dvt.Rectangle} availSpace The available space to render the chart.
 * @param {function} callback A function that responds to events
 * @param {object} callbackObj The optional object instance that the callback function is defined on.
 */
DvtChartPie.prototype.Init = function(chart, availSpace, callback, callbackObj) {
  DvtChartPie.superclass.Init.call(this, chart.getCtx());

  this.chart = chart;
  this._options = chart.getOptions();
  this._frame = availSpace.clone();
  chart.pieChart = this; // store reference to itself for interactivity

  var labelPosition = this.getLabelPosition();

  // Read the position from all series. Override if some label positions are inside/none and some outside.
  // Only used for figuring out the pie radius
  var numSeries = DvtChartDataUtils.getSeriesCount(chart);
  for (var seriesIndex = 0; seriesIndex < numSeries; seriesIndex++) {
    var data = DvtChartDataUtils.getDataItem(chart, seriesIndex, 0);
    if (data && ((labelPosition == 'center' || labelPosition == 'none') && data['labelPosition'] == 'outsideSlice'))
      labelPosition = 'outsideSlice';
  }

  // Set position attributes
  this._center = new dvt.Point(availSpace.x + Math.floor(availSpace.w / 2), availSpace.y + Math.floor(availSpace.h / 2));
  var radiusScale = (labelPosition == 'center' || labelPosition == 'none') ? DvtChartPie._RADIUS : DvtChartPie._RADIUS_LABELS;
  this._radiusX = Math.floor(Math.min(availSpace.w, availSpace.h) * radiusScale);
  this._radiusY = this._radiusX;
  this._depth = 0;
  this._anchorOffset = 90;

  if (this.is3D()) {
    // Set depth as percentage of window height
    this._depth = availSpace.h * DvtChartPie._THREED_DEPTH;
    this._center.y -= Math.floor(this._depth / 2);
    this._radiusY *= DvtChartPie._THREED_TILT;
  }

  // Create slices and set initial selection
  this._slices = this._createSlices();

  // a dvt.Container where we add parts of the pie and feeler lines
  // any special filters (currently, drop shadow effect for 2D pies)
  // affecting the pie are added to this container
  this._shapesContainer = new dvt.Container(this.getCtx());

  // Support for changing z-order for selection
  this._numFrontObjs = 0;
  this._numSelectedObjsInFront = 0;
};


/**
 * Returns the options object of this pie chart.
 * @return {object}
 */
DvtChartPie.prototype.getOptions = function() {
  return this._options;
};

/**
 * Highlights the specified categories.
 * @param {array} categories The array of categories whose data items will be highlighted. If null or empty, all
 *                           highlighting will be removed.
 */
DvtChartPie.prototype.highlight = function(categories) {
  dvt.CategoryRolloverHandler.highlight(categories, this._slices, this.getOptions()['highlightMatch'] == 'any');
};


/**
 * Create pie slices.
 * @return {array} slices
 * @private
 */
DvtChartPie.prototype._createSlices = function() {
  // Iterate through the data and create the slice objects
  var slices = [];
  var slice;

  var seriesIndices = DvtChartPieUtils.getRenderedSeriesIndices(this.chart);
  var seriesIndex;
  var otherValue = DvtChartPieUtils.getOtherValue(this.chart);

  for (var i = 0; i < seriesIndices.length; i++) {
    seriesIndex = seriesIndices[i];

    // Skip the series if it shouldn't be rendered
    if (!DvtChartStyleUtils.isDataItemRendered(this.chart, seriesIndex))
      continue;

    slice = new DvtChartPieSlice(this, seriesIndex);

    // Do not render if the value is not positive
    if (slice.getValue() <= 0)
      continue;

    slices.push(slice);
  }

  // Create an "Other" slice if needed
  if (otherValue > 0) {
    var otherSlice = new DvtChartPieSlice(this);
    if (this.chart.getOptions()['sorting'] == 'ascending')
      slices.unshift(otherSlice);
    else
      slices.push(otherSlice);
  }

  // Reverse the slices for BIDI
  if (dvt.Agent.isRightToLeft(this.getCtx()))
    slices.reverse();

  return slices;
};


/**
 * Sets initial selection of the chart.
 */
DvtChartPie.prototype.setInitialSelection = function() {
  var handler = this.chart.getSelectionHandler();
  if (!handler)
    return;

  var selected = DvtChartDataUtils.getInitialSelection(this.chart);
  var selectedIds = [];
  for (var i = 0; i < selected.length; i++) {
    for (var j = 0; j < this._slices.length; j++) {
      var peerId = this._slices[j].getId();
      if (peerId && ((selected[i]['id'] && peerId.getId() == selected[i]['id']) ||
          (peerId.getSeries() == selected[i]['series'] && peerId.getGroup() == selected[i]['group']))) {
        selectedIds.push(peerId);
        continue;
      }
    }
  }

  // Add other slice to the list if all series in the "other" slice is selected
  if (DvtChartPieUtils.isOtherSliceSelected(this.chart, selected)) {
    var otherPeerId = DvtChartPieUtils.getOtherSliceId(this.chart);
    selectedIds.push(otherPeerId);
  }

  handler.processInitialSelections(selectedIds, this._slices);
};


/**
 * Renders the pie chart.
 */
DvtChartPie.prototype.render = function() {
  var shadow;
  if (!this.contains(this._shapesContainer)) {
    if (!this._shapesContainer) {
      this._shapesContainer = new dvt.Container(this.getCtx());
    }
    this.addChild(this._shapesContainer);

    if (!this.is3D() && this.getSkin() == dvt.CSSStyle.SKIN_SKYROS) {
      var shadowRGBA = dvt.ColorUtils.makeRGBA(78, 87, 101, 0.45);

      shadow = new dvt.Shadow(shadowRGBA, 4, // distance
          7, // blurX
          7, // blurY
          54, // angle of the shadow
          2, // strength or the imprint/spread
          3, // quality
          false, // inner shadow
          false, // knockout effect
          false// hide object
          );
    }
  }

  // Set each slice's angle start and angle extent
  // The order in which these slices are rendered is determined in the later call to orderSlicesForRendering
  DvtChartPie._layoutSlices(this._slices, this._anchorOffset);

  // create the physical surface objects and labels
  for (var i = 0; i < this._slices.length; i++) {
    this._slices[i].preRender();
  }

  // we order the slices for rendering, such that
  // the "front-most" slice, the one closest to the user
  // is redered last.  each slice is then responsible
  // for properly ordering each of its surfaces before
  // the surfaces are rendered.
  var zOrderedSlices = DvtChartPie._orderSlicesForRendering(this._slices);

  if (!this._duringDisplayAnim) {
    DvtChartPieLabelUtils.createPieCenter(this);
    DvtChartPieLabelUtils.layoutLabelsAndFeelers(this);
  }

  // now that everything has been laid out, tell the slices to
  // render their surfaces
  for (var i = 0; i < zOrderedSlices.length; i++) {
    zOrderedSlices[i].render(this._duringDisplayAnim);
  }

  // : Don't render shadows in Chrome SVG
  if (!dvt.Agent.isPlatformWebkit()) {
    //: apply shadow after rendering slices because
    //shadow effect may depend on bounding box
    if (shadow)
      this._shapesContainer.addDrawEffect(shadow);
  }

  // perform initial selection
  this.setInitialSelection();

  // Initial Highlighting
  this.highlight(DvtChartStyleUtils.getHighlightedCategories(this.chart));

};


/**
 * Returns the total value of the pie
 * @return {number} The total value of all pie slices
 */
DvtChartPie.prototype.getTotalValue = function() {
  var total = 0;
  for (var i = 0; i < this._slices.length; i++) {
    var sliceValue = this._slices[i].getValue();
    if (sliceValue >= 0)// Ignore negative slice values
      total += sliceValue;
  }
  return total;
};


// ported over from PieChart.as
/**
 * Sets the location of each slice in the pie. That is, each slice in the input slices array has its angle start and
 * angle extent set.  Label layout is not handled in this method.
 *
 * @param {Array} slices An array of DvtChartPieSlice objects
 * @param {number} anchorOffset The initial rotation offset for the pie, measured in degrees with 0 being the standard
 *                              0 from which trigonometric angles are measured. Thus, 90 means the first pie slice is
 *                              at the 12 o'clock position
 *
 * @private
 */
DvtChartPie._layoutSlices = function(slices, anchorOffset) {
  var i;
  var slice;
  var angle;

  var arc = 0;

  var nSlices = (slices) ? slices.length : 0;

  if (anchorOffset > 360)
    anchorOffset -= 360;

  if (anchorOffset < 0)
    anchorOffset += 360;

  var percentage = 0;
  var dataTotal = 0;
  if (nSlices > 0) {
    dataTotal = slices[0].getPieChart().getTotalValue();
  }

  for (var i = 0; i < nSlices; i++) {
    slice = slices[i];

    var value = slice.getValue();
    percentage = (dataTotal == 0) ? 0 : ((Math.abs(value) / dataTotal) * 100);

    arc = percentage * 3.60;// 3.60 = 360.0 / 100.0 - percentage of a 360 degree circle
    angle = anchorOffset - arc;

    if (angle < 0)
      angle += 360;

    slice.setAngleStart(angle);
    slice.setAngleExtent(arc);

    anchorOffset = slice.getAngleStart();// update anchor position for next slice
  }

};


/**
 * Sort slices by walking slices in a clockwise and then counterclockwise fashion,
 * processing the bottom-most slice last.  Each slice is responsible for sorting its
 * own surfaces so that they get rendered in the proper order.
 *
 * @param {Array} slices The array of DvtChartPieSlices to order
 * @return {Array} A z-ordered array of DvtChartPieSlices
 *
 * @private
 */
DvtChartPie._orderSlicesForRendering = function(slices) {
  var zOrderedSlices = [];
  var i;
  var nSlices = (slices) ? slices.length : 0;
  var slice;

  var rotateIdx = - 1;
  var angleStart;
  var angleExtent;
  var sliceSpanEnd;

  // the amount of the slice, in degrees, by which the slice that spans the 12 o'clock position spans
  // counterclockwise from 12 o'clock (i.e., how much of the slice is "before noon")
  var sliceSpanBeforeNoon;

  // if we have any sort of pie rotation, then we need to rotate a copy of the _slices array
  // so that the first entry in the array is at 12 o'clock, or spans 12 o'clock position
  // to do this, we just check the angle start and angle extent of each slice. The first element in
  // the array would be that angle whose start + extent = 90 or whose start < 90 and
  // start + extent > 90.
  // find the index of the slice that spans the 12 o'clock position
  for (var i = 0; i < nSlices; i++) {
    slice = slices[i];
    angleStart = slice.getAngleStart();
    angleExtent = slice.getAngleExtent();
    sliceSpanEnd = angleStart + angleExtent;

    if (sliceSpanEnd > 360)
      sliceSpanEnd -= 360;

    if (sliceSpanEnd < 0)
      sliceSpanEnd += 360;

    if ((sliceSpanEnd == 90) || ((angleStart < 90) && (sliceSpanEnd > 90))) {
      rotateIdx = i;
      sliceSpanBeforeNoon = sliceSpanEnd - 90;
      break;
    }
  }

  // now create an array in which the slices are ordered clockwise from the 12 o'clock position
  var rotatedSlices = [];
  for (var i = rotateIdx; i < nSlices; i++) {
    rotatedSlices.push(slices[i]);
  }
  for (var i = 0; i < rotateIdx; i++) {
    rotatedSlices.push(slices[i]);
  }

  //total accumulated angle of slice so far
  var accumAngle = 0;

  // the bottom-most slice index, whose extent either spans the two bottom
  // quadrants across the 270 degree mark (the "6 o'clock" position),
  // or is tangent to the 270 degree mark
  var lastSliceIndexToProcess = 0;

  //
  // process slices clockwise, starting at the top, series 0
  //
  var accumAngleThreshold = 180 + sliceSpanBeforeNoon;
  for (var i = 0; i < nSlices; i++) {
    slice = rotatedSlices[i];

    if (slice) {
      // if this slice makes the accumAngle exceed 180 degrees,
      // then save it for processing later because this is the
      // bottom-most slice (it crosses the 6 o'clock mark),
      // which means it should be in front in the z-order
      if (accumAngle + slice.getAngleExtent() > accumAngleThreshold) {
        lastSliceIndexToProcess = i;
        break;
      }

      // add this slice to the rendering queue for slices
      zOrderedSlices.push(slice);

      //add the current slice extent to the accumulated total
      accumAngle += slice.getAngleExtent();
    }
  }

  for (var i = nSlices - 1; i >= lastSliceIndexToProcess; i--) {
    slice = rotatedSlices[i];
    if (slice) {
      zOrderedSlices.push(slice);
    }
  }

  return zOrderedSlices;
};


/**
 * Returns a boolean indicating if the DvtChartPie is a 3D pie
 *
 * @return {boolean} true If the pie is to be rendered as a 3D pie
 */
DvtChartPie.prototype.is3D = function() {
  return this._options['styleDefaults']['threeDEffect'] == 'on';
};


/**
 * Determine the maximum distance a pie slice can be exploded from the pie
 *
 * @return {number} The maximum distance a pie slice can be exploded from the pie
 */
DvtChartPie.prototype.__calcMaxExplodeDistance = function() {
  var maxExplodeRatio = 0.5 / DvtChartPie._RADIUS - 1; //ensures that the exploded pie does not go outside the frame
  return this._radiusX * maxExplodeRatio;
};


/**
 * Returns the animation duration for this pie.
 * @return {number}
 */
DvtChartPie.prototype.getAnimationDuration = function() {
  return DvtChartStyleUtils.getAnimationDuration(this.chart);
};


/**
 * Creates initial display animation.  Called by DvtChartAnimOnDisplay.
 * @return {dvt.Playable} The display animation.
 */
DvtChartPie.prototype.getDisplayAnimation = function() {
  this._duringDisplayAnim = true; // flag to prevent label/feeler relayout
  var handler = new dvt.DataAnimationHandler(this.getCtx(), this);
  var duration = this.getAnimationDuration();

  // Construct animation to grow the slices like a fan.
  // A filler slice is needed to fill in the empty space not occupied by the slices while growing.
  var fillerSlice = DvtChartPieSlice.createFillerSlice(this, this.getTotalValue());
  this._slices.push(fillerSlice);

  // Add animation to shrink the filler slice
  var fillerAnim = new dvt.CustomAnimation(this.getCtx(), fillerSlice, duration);
  fillerAnim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, fillerSlice, fillerSlice.GetAnimationParams, fillerSlice.SetAnimationParams, fillerSlice.getDeletedAnimationParams());
  fillerAnim.setOnEnd(fillerSlice._removeDeletedSlice, fillerSlice);
  handler.add(fillerAnim, 0);

  // Add animation to grow the actual slices
  for (var i = 0; i < this._slices.length - 1; i++) { // don't include filler slice
    this._slices[i].animateInsert(handler);
  }

  // Construct the animation to render the pie using the updated values
  var renderAnim = new dvt.CustomAnimation(this.getCtx(), this, duration);
  renderAnim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this, this._getAnimationParams, this._setAnimationParams, this._getAnimationParams());
  handler.add(renderAnim, 0);

  // Construct fade in animation for labels and feelers. Should start from the very beginning of the slices animation
  var ar = [];
  for (var i = 0; i < this._slices.length; i++) {
    ar = ar.concat(this._slices[i].getLabelAndFeeler());
  }

  var labelAnim = new dvt.AnimFadeIn(this._context, ar, duration);
  handler.add(labelAnim, 0);

  // Initialize to the start state
  this._setAnimationParams();

  var anim = handler.getAnimation(true);
  anim.setOnEnd(this._onEnd, this); // restore label position
  return anim;
};


/**
 * Restores the label position and re-renders at the end of the display animation.
 * @private
 */
DvtChartPie.prototype._onEnd = function() {
  this._duringDisplayAnim = false;
  //  - need to re render at the end of the display animation
  this._setAnimationParams();
};

/** Getters and setters **/


/**
 * @return {dvt.Point} The center of this pie chart
 */
DvtChartPie.prototype.getCenter = function() {
  return this._center;
};

/**
 * @return {number} The inner radius of this pie chart
 */
DvtChartPie.prototype.getInnerRadius = function() {
  if (this.is3D()) // not supported
    return 0;
  else
    return this._options['styleDefaults']['pieInnerRadius'] * Math.min(this._radiusX, this._radiusY) * .95;
};

/**
 * @return {dvt.Rectangle} This DvtChartPie's pie frame
 */
DvtChartPie.prototype.__getFrame = function() {
  return this._frame;
};


/**
 * @return {number} the length of the pie chart's x-radius
 */
DvtChartPie.prototype.getRadiusX = function() {
  return this._radiusX;
};


/**
 * @return {number} the length of the pie chart's y-radius
 */
DvtChartPie.prototype.getRadiusY = function() {
  return this._radiusY;
};


/**
 * @return {number} The pie chart's depth
 */
DvtChartPie.prototype.getDepth = function() {
  return this._depth;
};


/**
 * Return the top surface displayable belonging to the slice with the given seriesIdx.
 * Internal API used for Automation purposes.
 * @param {Number} seriesIdx
 * @return {dvt.Displayable}
 */
DvtChartPie.prototype.getSliceDisplayable = function(seriesIdx) {
  var slice = DvtChartPieUtils.getSliceBySeriesIndex(this.chart, seriesIdx);
  if (slice)
    return slice.getTopDisplayable();
  return null;
};


/**
 * @return {dvt.Container} The dvt.Container where we add pie shapes and feeler lines to
 */
DvtChartPie.prototype.__getShapesContainer = function() {
  return this._shapesContainer;
};


/**
 * @return {Array} An array containing the DvtChartPieSlice objects in this pie chart
 */
DvtChartPie.prototype.__getSlices = function() {
  return this._slices;
};


//---------------------------------------------------------------------//
// Animation Support                                                   //
//---------------------------------------------------------------------//
/**
 * Creates the update animation for this object.
 * @param {dvt.DataAnimationHandler} handler The animation handler, which can be used to chain animations.
 * @param {DvtChartPie} oldPie The old pie state to animate from.
 */
DvtChartPie.prototype.animateUpdate = function(handler, oldPie) {
  // Create a new handler for the slices.  This handler is created to provide
  // access to the new chart for deleted objects, and to isolate the playables
  // for the pie animation from the other playables in the handler.
  var sliceHandler = new dvt.DataAnimationHandler(this.getCtx(), this);

  // Construct the animation to update slice values for the children
  sliceHandler.constructAnimation(oldPie.__getSlices(), this.__getSlices());
  var sliceAnim = sliceHandler.getAnimation(true);

  // Construct the animation to render the pie using the updated values
  var renderAnim = new dvt.CustomAnimation(this.getCtx(), this, this.getAnimationDuration());
  renderAnim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this, this._getAnimationParams, this._setAnimationParams, this._getAnimationParams());

  // Combine and add to the chart handler
  var anim = new dvt.ParallelPlayable(this.getCtx(), sliceAnim, renderAnim);
  anim.setOnEnd(this._setAnimationParams, this); // at the end, clear the container and render the final state

  handler.add(anim, 0);

  // Initialize to the start state
  this._setAnimationParams([oldPie.getDepth(), oldPie.getRadiusY(), oldPie.getCenter().y]);
};


/**
 * Creates the insert animation for this object.
 * @param {dvt.DataAnimationHandler} handler The animation handler, which can be used to chain animations.
 */
DvtChartPie.prototype.animateInsert = function(handler) {
  // This should never get called, since animation is only supported for a single pie
};


/**
 * Creates the delete animation for this object.
 * @param {dvt.DataAnimationHandler} handler The animation handler, which can be used to chain animations.
 * @param {dvt.Container} container The container where deletes should be moved for animation.
 */
DvtChartPie.prototype.animateDelete = function(handler, container) {
  // This should never get called, since animation is only supported for a single pie
};


/**
 * @return {array} params
 * @private
 */
DvtChartPie.prototype._getAnimationParams = function() {
  return [this._depth, this._radiusY, this._center.y];
};


/**
 * Called by the animation loop with a dummy parameter to force the chart to re-render.
 * @param {array} params
 * @private
 */
DvtChartPie.prototype._setAnimationParams = function(params) {

  // First delete the current contents
  this.removeChildren();

  if (this._shapesContainer)
    this._shapesContainer.destroy();

  // Clear references to the removed displayables
  this._shapesContainer = null;

  if (params) {
    this._depth = params[0];
    this._radiusY = params[1];
    this._center.y = params[2];
  }

  // Then render the new ones
  this.render();
};

//---------------------------------------------------------------------//
// End Animation Support                                               //
//---------------------------------------------------------------------//


//---------------------------------------------------------------------//
// Ordering Support: ZOrderManager impl                                //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtChartPie.prototype.bringToFrontOfSelection = function(slice) {
  var par = slice.getPieChart()._shapesContainer;
  if (par) {
    var parentChildCount = par.getNumChildren();
    if (parentChildCount - this._numFrontObjs > 1) {
      // Only change z-order for top surface
      par.removeChild(slice._topSurface[0]);
      var newIndex = parentChildCount - this._numFrontObjs - 1;
      par.addChildAt(slice._topSurface[0], newIndex);
    }
  }
};


/**
 * @override
 */
DvtChartPie.prototype.pushToBackOfSelection = function(slice) {
  var len = this._slices.length;
  var counter = 0;
  for (var i = 0; i < len; i++) {
    if (this._slices[i].isSelected())
      counter++;
  }
  this._numSelectedObjsInFront = counter;
  //move the object to the first z-index before the selected objects
  var par = slice.getPieChart()._shapesContainer;
  if (par) {
    var parentChildCount = par.getNumChildren();
    var newIndex = parentChildCount - this._numFrontObjs - 1 - this._numSelectedObjsInFront;
    if (newIndex >= 0) {
      par.removeChild(slice._topSurface[0]);
      par.addChildAt(slice._topSurface[0], newIndex);
    }
  }
};


/**
 * @override
 */
DvtChartPie.prototype.setNumFrontObjs = function(num) {
  this._numFrontObjs = num;
};

/**
 * @override
 */
DvtChartPie.prototype.getShapesForViewSwitcher = function(bOld) {
  var shapes = {};

  if (this._slices) {
    for (var iSlice = 0; iSlice < this._slices.length; iSlice++) {
      var slice = this._slices[iSlice];
      if (slice) {
        var chartDataItem = slice.getId();
        if (chartDataItem) {
          var id = chartDataItem.getId();
          if (id) {
            if (slice._topSurface && slice._topSurface.length > 0) {
              var topShape = slice._topSurface[0];
              shapes[id] = topShape;
            }
            //if (slice._crustSurface && slice._crustSurface.length > 0) {
            //  var crustShape = slice._crustSurface[0];
            //  shapes[id + "_crust"] = crustShape;
            //}
            //if (slice._leftSurface && slice._leftSurface.length > 0) {
            //  var leftShape = slice._leftSurface[0];
            //  shapes[id + "_left"] = leftShape;
            //}
            //if (slice._rightSurface && slice._rightSurface.length > 0) {
            //  var rightShape = slice._rightSurface[0];
            //  shapes[id + "_right"] = rightShape;
            //}
          }
        }
      }
    }
  }

  return shapes;
};

/**
 * Returns the location of the labels
 * @return {string} "auto", "none", "center", or "outsideSlice"
 */
DvtChartPie.prototype.getLabelPosition = function() {
  // First read from sliceLabelPosition to honor it if set.
  var position = this._options['styleDefaults']['sliceLabelPosition'];
  if (!position) // if sliceLabelPosition is not set, check for dataLabelPosition
    position = this._options['styleDefaults']['dataLabelPosition'];

  return DvtChartPie.parseLabelPosition(position);
};

/**
 * Returns the location of the labels
 * @param {number} seriesIndex  The index of the slice. If not passed in, we read the styleDefaults value
 * @return {string} "auto", "none", "center", or "outsideSlice"
 */
DvtChartPie.prototype.getSeriesLabelPosition = function(seriesIndex) {
  // Start out with the default label position for the pie
  var position = this.getLabelPosition();

  // Check if it's overriden for this series
  var data = DvtChartDataUtils.getDataItem(this.chart, seriesIndex, 0);
  if (data && data['labelPosition'])
    position = data['labelPosition'];

  return DvtChartPie.parseLabelPosition(position);
};

/**
 * Utility to standardize the position name
 * @param {string} position The position value read from the chart
 * @return {string} "auto", "none", "inside", or "outside"
 */
DvtChartPie.parseLabelPosition = function(position) {
  if (position == 'center' || position == 'inside')
    return 'center';
  else if (position == 'outsideSlice' || position == 'outside')
    return 'outsideSlice';
  else if (position == 'none')
    return 'none';
  else
    return 'auto';
};

/**
 * Return the skin to use for rendering.  If the value is not 'skyros', the simplified gradient effects will be used.
 * @return {string} skin
 */
DvtChartPie.prototype.getSkin = function() {
  return this._options['skin'];
};

// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
/*---------------------------------------------------------------------*/
/*   DvtChartPieSlice                                                       */
/*---------------------------------------------------------------------*/

/*
 * Call chain:
 *
 * DvtChartPie creates each logical DvtChartPieSlice object.  The physical surface objects are
 * then created in DvtChartPie.render, by calling DvtChartPieSlice.preRender()
 *
 * In DvtChartPieSlice.preRender() we
 *
 * 1. setup the gradient used for this DvtChartPieSlice
 * 2. create the physical objects representing each surface
 *
 * The labels are then created and laid out by DvtSliceLabelLayout.layoutLabelsAndFeelers.
 *
 * After the label layout is complete, DvtChartPie then calls
 *
 * 1. render() to render the pie slice itself
 * 2. renderLabelAndFeeler() to render the pie label and feeler (if necessary)
 *
 */



/**
 * Creates an instance of DvtChartPieSlice
 *
 * @param {DvtChartPie} pieChart The pie chart that owns the pie slice.
 * @param {number=} seriesIndex The series index of this slice. If not provided, the slice is an "Other" slice.
 * @class DvtChartPieSlice
 * @constructor
 * @implements {DvtLogicalObject}
 * @implements {DvtCategoricalObject}
 * @implements {DvtTooltipSource}
 * @implements {DvtPopupSource}
 */
var DvtChartPieSlice = function(pieChart, seriesIndex) {
  this.Init(pieChart, seriesIndex);
};

dvt.Obj.createSubclass(DvtChartPieSlice, dvt.Obj);


/**
 * Object initializer
 *
 * @param {DvtChartPie} pieChart The pie chart that owns the pie slice.
 * @param {number=} seriesIndex The series index of this slice. If not provided, the slice is an "Other" slice.
 * @protected
 */
DvtChartPieSlice.prototype.Init = function(pieChart, seriesIndex) {
  this._pieChart = pieChart;
  this._chart = pieChart.chart;

  this._angleStart = 0;
  this._angleExtent = 0;

  this._topSurface = null;// an array of DvtShapes representing the top of the slice
  this._leftSurface = null;// an array of DvtShapes representing the left side of the slice
  // ("left" as seen from the tip of the slice)
  this._rightSurface = null;// an array of DvtShapes representing the right side of the slice
  // ("right" as seen from the tip of the slice)
  this._crustSurface = null;// an array of DvtShapes representing the crust of the slice

  this._explodeOffsetX = 0;
  this._explodeOffsetY = 0;

  this._sliceLabel = null;
  this._sliceLabelString = null;

  this._hasFeeler = false;
  this._feelerRad = null;// the section of the feeler closest to the pie
  this._feelerHoriz = null;// the section of the feeler closest to the label
  this._outsideFeelerStart = null;// a point class with x and y fields. This represents the point on the pie
  // from which the feeler originates in the unexploded state
  this._outsideFeelerMid = null;// a point class with x and y fields. This represents the point on the pie
  // from which the feeler bends
  this._outsideFeelerEnd = null;// a point class with x and y fields. This represents the point not on the pie
  // at which the feeler ends
  this._selected = false;
  this._selecting = false;

  this._centerX = this._pieChart.getCenter().x;
  this._centerY = this._pieChart.getCenter().y;

  this._radiusX = this._pieChart.getRadiusX();
  this._radiusY = this._pieChart.getRadiusY();

  this._depth = this._pieChart.getDepth();

  // Set rendering constants
  var options = this._chart.getOptions();

  if (seriesIndex != null) { // not "Other" slice
    var dataItem = DvtChartDataUtils.getDataItem(this._chart, seriesIndex, 0);
    this._value = DvtChartDataUtils.getValue(this._chart, seriesIndex, 0);
    this._explode = DvtChartPieUtils.getSliceExplode(this._chart, seriesIndex);
    this._fillColor = DvtChartStyleUtils.getColor(this._chart, seriesIndex, 0);
    this._fillPattern = DvtChartStyleUtils.getPattern(this._chart, seriesIndex, 0);
    this._strokeColor = DvtChartStyleUtils.getBorderColor(this._chart, seriesIndex);
    this._borderWidth = DvtChartStyleUtils.getBorderWidth(this._chart, seriesIndex);
    this._customLabel = dataItem['label'];
    this._seriesLabel = DvtChartDataUtils.getSeries(this._chart, seriesIndex);
    this._action = dataItem['action'];
    this._drillable = DvtChartEventUtils.isDataItemDrillable(this._chart, seriesIndex, 0);
    this._showPopupBehaviors = this._chart.getShowPopupBehaviors(dataItem['_id']);
    this._id = DvtChartPieUtils.getSliceId(this._chart, seriesIndex);
    this._seriesIndex = seriesIndex;
    this._categories = DvtChartDataUtils.getDataItemCategories(this._chart, seriesIndex, 0);
  }
  else { // "Other" slice
    this._value = DvtChartPieUtils.getOtherValue(this._chart);
    this._explode = 0;
    this._fillColor = options['styleDefaults']['otherColor'];
    this._fillPattern = null;
    this._strokeColor = options['styleDefaults']['borderColor'];
    this._borderWidth = options['styleDefaults']['borderWidth'];
    this._customLabel = null;
    this._seriesLabel = dvt.Bundle.getTranslatedString(dvt.Bundle.CHART_PREFIX, 'LABEL_OTHER', null);
    this._action = null;
    this._drillable = false;
    this._showPopupBehaviors = DvtChartPieUtils.getOtherSliceShowPopupBehaviors(this._chart);
    this._id = DvtChartPieUtils.getOtherSliceId(this._chart);
  }
};


/**
 * Returns the owning DvtChartPie object.
 * @return {DvtChartPie}
 */
DvtChartPieSlice.prototype.getPieChart = function() {
  return this._pieChart;
};


/**
 * Render the pie slice only; rendering of label and feeler
 * occurs in DvtChartPieSlice.renderLabelAndFeelers
 * @param {boolean=} duringDisplayAnim Whether the render is during the display animation.
 */
DvtChartPieSlice.prototype.render = function(duringDisplayAnim) {
  var sortedSurfaces = DvtChartPieSlice._sortPieSurfaces(this._topSurface, this._leftSurface, this._rightSurface, this._crustSurface, this._angleStart, this._angleExtent);
  var len = sortedSurfaces.length;
  for (var i = 0; i < len; i++) {
    var shapeArray = sortedSurfaces[i];
    // shapeArray is an array of DvtShapes representing the given surface.
    // Iterate through this array and add each shape to the pieChart
    var shapeCount = shapeArray.length;
    for (var j = 0; j < shapeCount; j++) {
      var shapesContainer = this._pieChart.__getShapesContainer();
      shapesContainer.addChild(shapeArray[j]);
      if (shapeArray[j].render)// render is only defined on certain shape subclasses
        shapeArray[j].render();
    }
  }

  // Render label and feeler
  // assume that all layout and text truncation has already been done
  // so in theory, we just need to call addChild with the feeler and label
  if (this._sliceLabel) {
    this._pieChart.addChild(this._sliceLabel);

    // Associate the shapes with the slice for use during event handling
    DvtChartPieRenderUtils.associate(this, [this._sliceLabel]);

    if (duringDisplayAnim) {
      // Reuse the existing feeler instead of creating a new one for fade in animation
      this._pieChart.addChild(this._feelerRad);
      this._pieChart.addChild(this._feelerHoriz);
    }
    else
      this._renderOutsideFeeler();
  }

  // Perform initial explosion
  this._explodeSlice();

  // Apply the correct cursor if action is defined or selection is enabled
  if (this._action || this._drillable || this._pieChart.chart.isSelectionSupported()) {
    var sliceDisplayables = this.getDisplayables();
    for (var i = 0; i < sliceDisplayables.length; i++) {
      sliceDisplayables[i].setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
    }
  }

  // WAI-ARIA
  var displayable = this.getTopDisplayable();
  if (displayable) {
    displayable.setAriaRole('img');
    this._updateAriaLabel();
  }
};


/**
 * Create a feeler from pt1 to pt2.
 * @param {dvt.Point} pt1
 * @param {dvt.Point} pt2
 * @return {dvt.Line} feeler
 * @private
 */
DvtChartPieSlice.prototype._feelerFromPts = function(pt1, pt2) {
  var feeler = new dvt.Line(this._pieChart.getCtx(), pt1.x, pt1.y, pt2.x, pt2.y);
  var color = this._pieChart.getOptions()['styleDefaults']['pieFeelerColor'];
  var stroke = new dvt.SolidStroke(color);
  feeler.setStroke(stroke);
  this._pieChart.addChild(feeler);
  return feeler;
};


/**
 * Render a feeler outside the slice.
 * @private
 */
DvtChartPieSlice.prototype._renderOutsideFeeler = function() {
  if (!this._hasFeeler)
    return;

  var feelerRad = this._feelerFromPts(this._outsideFeelerStart, this._outsideFeelerMid);
  var feelerHoriz = this._feelerFromPts(this._outsideFeelerMid, this._outsideFeelerEnd);

  // Store a reference to it so that we can remove
  this._feelerRad = feelerRad;
  this._feelerHoriz = feelerHoriz;
};


/**
 * Creates the gradients and physical shapes for the pie surfaces. Z-Ordering of the shapes
 * and layout and creation of the pie label is done elsewhere.
 */
DvtChartPieSlice.prototype.preRender = function() {
  var fillType = this._bFillerSlice ? 'color' : DvtChartStyleUtils.getSeriesEffect(this._chart);
  var color = this.getFillColor();
  var pattern = this.getFillPattern();

  // Create the fills
  var topFill;
  if (fillType == 'pattern' || pattern != null) {
    topFill = new dvt.PatternFill(pattern, color);
    fillType = 'pattern';
  }
  else if (fillType == 'gradient') {
    var skin = this._pieChart.getSkin();
    var grAngle = (skin == dvt.CSSStyle.SKIN_SKYROS) ? 297 : 270;
    var style = (!this._pieChart.is3D()) ? '2D' : '3D';

    var arColors = DvtChartPieRenderUtils.getGradientColors(dvt.ColorUtils.getRGB(color), style, skin);
    var arAlphas = DvtChartPieRenderUtils.getGradientAlphas(dvt.ColorUtils.getAlpha(color), style);
    var arRatios = DvtChartPieRenderUtils.getGradientRatios(style, skin);
    var arBounds = [Math.floor(this._centerX - this._radiusX),
                    Math.floor(this._centerY - this._radiusY),
                    Math.ceil(2 * this._radiusX),
                    Math.ceil(2 * this._radiusY)];

    topFill = new dvt.LinearGradientFill(grAngle, arColors, arAlphas, arRatios, arBounds);
  }
  else
    topFill = new dvt.SolidFill(color);

  // Create the Top Surface
  this._topSurface = DvtChartPieRenderUtils.createTopSurface(this, topFill);

  // 3D Effect Support
  if ((this._depth > 0 || this._radiusX != this._radiusY)) {
    var useGradientFill = (fillType == 'gradient');
    var lateralFill = new dvt.SolidFill(dvt.ColorUtils.getDarker(color, 0.60));
    var sideFill = useGradientFill ? DvtChartPieRenderUtils.generateLateralGradientFill(this, DvtChartPieRenderUtils.SIDE) : lateralFill;
    var crustFill = useGradientFill ? DvtChartPieRenderUtils.generateLateralGradientFill(this, DvtChartPieRenderUtils.CRUST) : lateralFill;

    // Create the side surfaces for the slice, which will be sorted later
    this._leftSurface = DvtChartPieRenderUtils.createLateralSurface(this, DvtChartPieRenderUtils.SURFACE_LEFT, sideFill);
    this._rightSurface = DvtChartPieRenderUtils.createLateralSurface(this, DvtChartPieRenderUtils.SURFACE_RIGHT, sideFill);
    this._crustSurface = DvtChartPieRenderUtils.createLateralSurface(this, DvtChartPieRenderUtils.SURFACE_CRUST, crustFill);
  }
};


// This logic is ported over from PieChart.sortSliversBySlice, and pushed
// from the PieChart to the PieSlice
/**
 * Sorts this DvtChartPieSlice's surfaces by z-order
 *
 * @param {Array} topSurface An array of DvtShapes representing the top of this DvtChartPieSlice
 * @param {Array} leftSurface An array of DvtShapes representing the left side of this DvtChartPieSlice (as seen from
                  the tip of the slice)
 * @param {Array} rightSurface An array of DvtShapes representing the right side of this DvtChartPieSlice (as seen from
                  the tip of the slice)
 * @param {Array} crustSurface An array of DvtShapes representing the crust of this DvtChartPieSlice
 * @param {number} angleStart The starting position of this pie slice
 * @param {number} angleExtent The angular size of this pie slice
 *
 * @return {Array} A sorted array of arrays (two-dimensional array) of dvt.Shape objects for this slice to render.
 * @private
 */
DvtChartPieSlice._sortPieSurfaces = function(topSurface, leftSurface, rightSurface, crustSurface, angleStart, angleExtent) {
  var sortedSurfaces = [];

  if (leftSurface && rightSurface && crustSurface) {
    // ported from PieChart.sortSliversBySlice
    // NOTE that instead of relying on the order in which the surfaces were
    // originally created, we just get them from associative array by name
    // the last slice to render,
    // or if a slice starts at 270 degrees/6 o'clock (Fix for )
    if (angleStart <= 270 && (angleStart + angleExtent > 270)) {
      //we're in the bottom-most slice, so add surfaces in back-to-front z-order:
      //left edge, right edge, crust
      sortedSurfaces.push(leftSurface);
      sortedSurfaces.push(rightSurface);
      sortedSurfaces.push(crustSurface);
    }

    // right-side of the pie
    else if (angleStart > 270 || (angleStart + angleExtent <= 90)) {
      //we're in the right side of the pie, so add surfaces in back-to-front z-order:
      //left edge, crust, right edge
      sortedSurfaces.push(leftSurface);
      sortedSurfaces.push(crustSurface);
      sortedSurfaces.push(rightSurface);
    }

    else {
      //we're in the left side of the pie, so add surfaces in back-to-front z-order:
      //right edge, crust, left edge
      sortedSurfaces.push(rightSurface);
      sortedSurfaces.push(crustSurface);
      sortedSurfaces.push(leftSurface);
    }

  }

  // top is rendered last
  sortedSurfaces.push(topSurface);

  return sortedSurfaces;
};


/**
 * Returns true if (x-y1) and (x-y2) have different signs.
 * @param {number} x
 * @param {number} y1
 * @param {number} y2
 * @return {boolean}
 */
DvtChartPieSlice.oppositeDirection = function(x, y1, y2) {
  var positive1 = (x - y1) > 0;
  var positive2 = (x - y2) > 0;
  return positive1 != positive2;
};


/**
 * Explodes the DvtChartPieSlice and feeler line.
 * @private
 */
DvtChartPieSlice.prototype._explodeSlice = function() {
  if (this._explode != 0) {
    var arc = this._angleExtent;
    var angle = this._angleStart;
    var fAngle = angle + (arc / 2);
    var radian = (360 - fAngle) * dvt.Math.RADS_PER_DEGREE;
    var tilt = this._pieChart.is3D() ? DvtChartPie._THREED_TILT : 1;

    var explodeOffset = this._explode * this._pieChart.__calcMaxExplodeDistance();
    this._explodeOffsetX = Math.cos(radian) * explodeOffset;
    this._explodeOffsetY = Math.sin(radian) * tilt * explodeOffset;

    // To work around , in the 2D pie case, we need to poke the
    // DOM element that contains the shadow filter that is applied to the pie slices.
    // However, due to , just poking the DOM also causes jitter in the
    // slice animation.  To get rid of the jitter, we round the amount of the translation we
    // apply to the pie slice and we also shorten the duration of the animation to visually smooth
    // out the result of the rounding.
    // 
    if (dvt.Agent.isPlatformWebkit()) {
      this._explodeOffsetX = Math.round(this._explodeOffsetX);
      this._explodeOffsetY = Math.round(this._explodeOffsetY);
    }
  }
  else {
    this._explodeOffsetX = 0;
    this._explodeOffsetY = 0;
  }

  // now update each surface
  if (this._topSurface) {
    var offsets = this._pieChart.is3D() && this._topSurface[0].getSelectionOffset ? this._topSurface[0].getSelectionOffset() : [];
    DvtChartPieSlice._translateShapes(this._topSurface, offsets[0] ? offsets[0] + this._explodeOffsetX : this._explodeOffsetX, offsets[1] ? offsets[1] + this._explodeOffsetY : this._explodeOffsetY);
  }

  if (this._rightSurface) {
    DvtChartPieSlice._translateShapes(this._rightSurface, this._explodeOffsetX, this._explodeOffsetY);
  }

  if (this._leftSurface) {
    DvtChartPieSlice._translateShapes(this._leftSurface, this._explodeOffsetX, this._explodeOffsetY);
  }

  if (this._crustSurface) {
    DvtChartPieSlice._translateShapes(this._crustSurface, this._explodeOffsetX, this._explodeOffsetY);
  }

  // update the feeler line
  if (this._hasFeeler) {
    // get current starting x and y, and then update the feeler line only
    var oldStartX = this._outsideFeelerStart.x;
    var oldStartY = this._outsideFeelerStart.y;

    var newStartX = oldStartX + this._explodeOffsetX;
    var newStartY = oldStartY + this._explodeOffsetY;

    this._feelerRad.setX1(newStartX);
    this._feelerRad.setY1(newStartY);

    var oldMidX = this._outsideFeelerMid.x;
    var oldMidY = this._outsideFeelerMid.y;

    //The midpoint of the feeler has to be updated if the new radial feeler is pointing towards an opposite direction;
    //otherwise, the feeler will go through the slice.
    //The easy solution is to set the x/y of the midPt to be the same as startPt.
    if (DvtChartPieSlice.oppositeDirection(oldMidX, oldStartX, newStartX)) {
      this._feelerRad.setX2(newStartX);
      this._feelerHoriz.setX1(newStartX);
    }
    else {
      this._feelerRad.setX2(oldMidX);
      this._feelerHoriz.setX1(oldMidX);
    }

    if (DvtChartPieSlice.oppositeDirection(oldMidY, oldStartY, newStartY)) {
      this._feelerRad.setY2(newStartY);
      this._feelerHoriz.setY1(newStartY);
    }
    else {
      this._feelerRad.setY2(oldMidY);
      this._feelerHoriz.setY1(oldMidY);
    }

  }

  //update the label position
  if (this._sliceLabel && !this._hasFeeler) {
    this._sliceLabel.setTranslate(this._explodeOffsetX, this._explodeOffsetY);
  }
};


/**
 * Translates each element in an array of shapes by the same delta x and delta y
 *
 * @param {Array} shapes An array of dvt.Shape objects to translate
 * @param {number} tx
 * @param {number} ty
 *
 * @private
 */
DvtChartPieSlice._translateShapes = function(shapes, tx, ty) {
  if (!shapes)
    return;

  var len = shapes.length;

  for (var i = 0; i < len; i++) {
    var shape = shapes[i];
    shape.setTranslate(tx, ty);
  }

};


/** Getters and setters **/

/**
 * Returns the x radius of the slice.
 * @return {number}
 */
DvtChartPieSlice.prototype.getRadiusX = function() {
  return this._radiusX;
};

/**
 * Returns the y radius of the slice.
 * @return {number}
 */
DvtChartPieSlice.prototype.getRadiusY = function() {
  return this._radiusY;
};

/**
 * Returns the center of the pie. This is used to animate between pies with different center points.
 * @return {dvt.Point}
 */
DvtChartPieSlice.prototype.getCenter = function() {
  return new dvt.Point(this._centerX, this._centerY);
};

/**
 * Returns the depth of the pie. This is used to animate between pies with and without 3d effect.
 * @return {number}
 */
DvtChartPieSlice.prototype.getDepth = function() {
  return this._depth;
};

/**
 * @return {number} The size of this pie slice's angle
 */
DvtChartPieSlice.prototype.getAngleExtent = function() {
  return this._angleExtent;
};


/**
 * @param {number} extent The size of this pie slice's angle
 */
DvtChartPieSlice.prototype.setAngleExtent = function(extent) {
  this._angleExtent = extent;
};


/**
 * @return {number} The starting angle location of this pie slice
 */
DvtChartPieSlice.prototype.getAngleStart = function() {
  return this._angleStart;
};


/**
 * @param {number} start The starting angle location of this pie slice
 */
DvtChartPieSlice.prototype.setAngleStart = function(start) {
  this._angleStart = start;
};


/**
 * @return {number} The x-offset for this pie slice. Zero if the slice is not exploded.
 */
DvtChartPieSlice.prototype.__getExplodeOffsetX = function() {
  return this._explodeOffsetX;
};


/**
 * @return {number} The y-offset for this pie slice. Zero if the slice is not exploded.
 */
DvtChartPieSlice.prototype.__getExplodeOffsetY = function() {
  return this._explodeOffsetY;
};


/**
 * Set the points for a feeler outside the slice.
 *
 * @param {object} startPt The starting point of the feeler, located on the pie slice. Point has an x and y field
 * @param {object} midPt The mid point of the feeler, located between the slice and the label. Point has an x and y field
 * @param {object} endPt The ending point of the feeler, located on the pie label. Point has an x and y field
 */
DvtChartPieSlice.prototype.setOutsideFeelerPoints = function(startPt, midPt, endPt) {
  this._outsideFeelerStart = startPt;
  this._outsideFeelerMid = midPt;
  this._outsideFeelerEnd = endPt;
  this._hasFeeler = true;
};


/**
 * Set the slice without feeler.
 */
DvtChartPieSlice.prototype.setNoOutsideFeeler = function() {
  this._outsideFeelerStart = null;
  this._outsideFeelerMid = null;
  this._outsideFeelerEnd = null;
  this._hasFeeler = false;
};


/**
 * Returns an array containing the label and feeler objects of the slice.
 * @return {array}
 */
DvtChartPieSlice.prototype.getLabelAndFeeler = function() {
  var ar = [];
  if (this._sliceLabel)
    ar.push(this._sliceLabel);
  if (this._feelerRad)
    ar.push(this._feelerRad);
  if (this._feelerHoriz)
    ar.push(this._feelerHoriz);
  return ar;
};


/**
 * @return {dvt.OutputText|dvt.MultilineText} The label for this slice
 */
DvtChartPieSlice.prototype.getSliceLabel = function() {
  return this._sliceLabel;
};


/**
 * @param {dvt.OutputText|dvt.MultilineText} sliceLabel
 */
DvtChartPieSlice.prototype.setSliceLabel = function(sliceLabel) {
  this._sliceLabel = sliceLabel;
};


/**
 * @return {String} Untruncated slice label if slice label is truncated.
 */
DvtChartPieSlice.prototype.getSliceLabelString = function() {
  return this._sliceLabelString;
};


/**
 * @param {String} labelStr Untruncated slice label if slice label is truncated.
 */
DvtChartPieSlice.prototype.setSliceLabelString = function(labelStr) {
  this._sliceLabelString = labelStr;
};


/**
 * @return {Array} The top surface displayables of this Pie Slice
 */
DvtChartPieSlice.prototype.getTopSurface = function() {
  return this._topSurface;
};


/**
 * Returns the numeric data value associated with this slice
 * @return {number}
 */
DvtChartPieSlice.prototype.getValue = function() {
  return this._value;
};


/**
 * @return {String} The series id
 */
DvtChartPieSlice.prototype.getId = function() {
  return this._id;
};

/**
 * @return {Number} The series index
 */
DvtChartPieSlice.prototype.getSeriesIndex = function() {
  return this._seriesIndex;
};

/**
 * Returns true if this slice contains the given bounding box, used for labels.
 * @param {object} bbox The bounding box to check containment for.
 * @param {DvtChartPieSlice} slice The pie slice on which to check containment.
 * @return {boolean}
 */
DvtChartPieSlice.containsRect = function(bbox, slice) {
  return (slice.contains(bbox.x, bbox.y) && slice.contains(bbox.x + bbox.w, bbox.y) &&
          slice.contains(bbox.x + bbox.w, bbox.y + bbox.h) && slice.contains(bbox.x, bbox.y + bbox.h));
};


/**
 * Returns true if the specified displayable can be selected or hovered.
 * @param {dvt.Displayable} shape
 * @return {boolean}
 * @private
 */
DvtChartPieSlice._shapeIsSelectable = function(shape) {
  return (shape instanceof DvtChartSelectableWedge);
};


/**
 * Returns true if this slice contains the given coordinates.
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
DvtChartPieSlice.prototype.contains = function(x, y) {

  var ir = this._pieChart.getInnerRadius();
  var c = this._pieChart.getCenter();
  var cos = (x - c.x) / this._radiusX;
  var sin = (y - c.y) / this._radiusY;

  // Compute the angle
  var angle = -Math.atan2(sin, cos) * (180 / Math.PI); // in degrees
  // First adjust angle to be greater than the start angle.
  while (angle < this._angleStart)
    angle += 360;
  // Then adjust to be within 360 degrees of it
  while (angle - this._angleStart >= 360)
    angle -= 360;

  var distance = Math.pow(cos, 2) + Math.pow(sin, 2);
  var containsRadius = (Math.sqrt(distance) > (ir / this._radiusX)) && distance <= 1;
  var containsAngle = angle <= this._angleStart + this._angleExtent;
  return containsRadius && containsAngle;
};

//---------------------------------------------------------------------//
// Animation Support                                                   //
//---------------------------------------------------------------------//

/**
 * @override
 */
DvtChartPieSlice.prototype.GetAnimationParams = function() {
  var r = dvt.ColorUtils.getRed(this._fillColor);
  var g = dvt.ColorUtils.getGreen(this._fillColor);
  var b = dvt.ColorUtils.getBlue(this._fillColor);
  var a = dvt.ColorUtils.getAlpha(this._fillColor);
  return [this._value, this._radiusX, this._radiusY, this._explode, this._centerX, this._centerY, this._depth, r, g, b, a];
};

/**
 * @override
 */
DvtChartPieSlice.prototype.SetAnimationParams = function(params) {
  this._value = params[0];
  this._radiusX = params[1];
  this._radiusY = params[2];
  this._explode = params[3];
  this._centerX = params[4];
  this._centerY = params[5];
  this._depth = params[6];

  // Update the color.  Round them since color parts must be ints
  var r = Math.round(params[7]);
  var g = Math.round(params[8]);
  var b = Math.round(params[9]);
  var a = Math.round(params[10]);
  this._fillColor = dvt.ColorUtils.makeRGBA(r, g, b, a);
};

/**
 * Returns the animation params of a deleted slice.
 * @return {Array} animation params.
 */
DvtChartPieSlice.prototype.getDeletedAnimationParams = function() {
  var params = this.GetAnimationParams();
  params[0] = 0; // value
  params[1] = this.getInnerRadius(); // radiusX
  params[2] = this.getInnerRadius(); // radiusY
  params[3] = 0; // explode
  return params;
};

/**
 * Creates the update animation for this object.
 * @param {dvt.DataAnimationHandler} handler The animation handler, which can be used to chain animations.
 * @param {DvtChartPieSlice} oldSlice The old pie state to animate from.
 */
DvtChartPieSlice.prototype.animateUpdate = function(handler, oldSlice) {
  var startState = oldSlice.GetAnimationParams();
  var endState = this.GetAnimationParams();

  if (!dvt.ArrayUtils.equals(startState, endState)) {
    // Create the animation
    var anim = new dvt.CustomAnimation(this._pieChart.getCtx(), this, this.getPieChart().getAnimationDuration());
    anim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this, this.GetAnimationParams, this.SetAnimationParams, endState);
    handler.add(anim, 0);

    // Initialize to the start state
    this.SetAnimationParams(startState);
  }
};


/**
 * Creates the insert animation for this object.
 * @param {dvt.DataAnimationHandler} handler The animation handler, which can be used to chain animations.
 */
DvtChartPieSlice.prototype.animateInsert = function(handler) {
  // Create the animation
  var anim = new dvt.CustomAnimation(this._pieChart.getCtx(), this, this.getPieChart().getAnimationDuration());
  anim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this, this.GetAnimationParams, this.SetAnimationParams, this.GetAnimationParams());
  handler.add(anim, 0);

  // Initialize to the start state
  this.SetAnimationParams(this.getDeletedAnimationParams());
};


/**
 * Creates the delete animation for this object.
 * @param {dvt.DataAnimationHandler} handler The animation handler, which can be used to chain animations.
 * @param {DvtChartPie} container The new container where the pie slice should be moved for animation.
 */
DvtChartPieSlice.prototype.animateDelete = function(handler, container) {
  var newSlices = container.__getSlices();
  var oldSlices = this.getPieChart().__getSlices();

  // Add the deleted slice to the new pie in the right spot
  var oldIndex = dvt.ArrayUtils.getIndex(oldSlices, this);
  var prevIndex = oldIndex - 1;
  if (prevIndex >= 0) {
    var prevId = oldSlices[prevIndex].getId();
    // Find the location of the previous slice
    for (var i = 0; i < newSlices.length; i++) {
      if (newSlices[i].getId().equals(prevId)) {
        newSlices.splice(i + 1, 0, this);
        break;
      }
    }
  }
  else
    newSlices.splice(0, 0, this);

  this._pieChart = container; // reparent this slice to the new pie

  // Create the animation to delete the slice
  var anim = new dvt.CustomAnimation(container.getCtx(), this, this.getPieChart().getAnimationDuration());
  anim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this, this.GetAnimationParams, this.SetAnimationParams, this.getDeletedAnimationParams());

  // Set the onEnd listener so that the slice can be deleted
  anim.setOnEnd(this._removeDeletedSlice, this);

  // Finally add the animation
  handler.add(anim, 0);
};


/**
 * Removes a deleted slice from the owning pie chart.  A re-render must be performed for the
 * results to be visible.
 * @private
 */
DvtChartPieSlice.prototype._removeDeletedSlice = function() {
  var slices = this.getPieChart().__getSlices();
  var index = dvt.ArrayUtils.getIndex(slices, this);

  if (index >= 0)
    slices.splice(index, 1);
};


//---------------------------------------------------------------------//
// DvtLogicalObject impl                                               //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtChartPieSlice.prototype.getDisplayables = function() {
  var ret = new Array();

  if (this._topSurface)
    ret = ret.concat(this._topSurface);

  if (this._leftSurface)
    ret = ret.concat(this._leftSurface);

  if (this._rightSurface)
    ret = ret.concat(this._rightSurface);

  if (this._crustSurface)
    ret = ret.concat(this._crustSurface);

  if (this._sliceLabel)
    ret.push(this._sliceLabel);

  if (this._feelerRad)
    ret.push(this._feelerRad);

  if (this._feelerHoriz)
    ret.push(this._feelerHoriz);

  return ret;
};

/**
 * @override
 */
DvtChartPieSlice.prototype.getAriaLabel = function() {
  var shortDesc;
  if (this._seriesIndex == null) // other slice
    shortDesc = DvtChartTooltipUtils.getOtherSliceDatatip(this._chart, this._value, false);
  else
    shortDesc = DvtChartTooltipUtils.getDatatip(this._chart, this._seriesIndex, 0, false);

  // Include percentage in the shortDesc
  var percentageLabel = dvt.Bundle.getTranslatedString(dvt.Bundle.CHART_PREFIX, 'LABEL_PERCENTAGE', null);
  var percentage = DvtChartPieLabelUtils.generateSliceLabelString(this, 'percent');
  shortDesc += '; ' + dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'COLON_SEP_LIST', [percentageLabel, percentage]);

  var states = [];
  if (this.isSelectable())
    states.push(dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, this.isSelected() ? 'STATE_SELECTED' : 'STATE_UNSELECTED'));

  if (DvtChartEventUtils.isDataItemDrillable(this._chart, this._seriesIndex, this._groupIndex))
    states.push(dvt.Bundle.getTranslation(this._pieChart.getOptions(), 'stateDrillable', dvt.Bundle.UTIL_PREFIX, 'STATE_DRILLABLE'));

  return dvt.Displayable.generateAriaLabel(shortDesc, states);
};

/**
 * Updates the aria-label as needed. On desktop, we can defer the aria creation, and the aria-label will be updated
 * when the activeElement is set.
 * @private
 */
DvtChartPieSlice.prototype._updateAriaLabel = function() {
  var displayable = this.getTopDisplayable();
  if (displayable && !dvt.Agent.deferAriaCreation())
    displayable.setAriaProperty('label', this.getAriaLabel());
};

/**
 * Returns the displayable of the top surface.
 * @return {dvt.Shape}
 */
DvtChartPieSlice.prototype.getTopDisplayable = function() {
  if (this._topSurface && this._topSurface.length > 0)
    return this._topSurface[0];
  return null;
};

/**
 * @override
 */
DvtChartPieSlice.prototype.isSelectable = function() {
  return this._chart.isSelectionSupported();
};


/**
 * @override
 */
DvtChartPieSlice.prototype.isSelected = function() {
  return this._selected;
};


/**
 * @override
 */
DvtChartPieSlice.prototype.setSelected = function(bSelected, isInitial) {
  this._selected = bSelected;
  if (this._selected) {
    this._pieChart.bringToFrontOfSelection(this);
  }
  else if (!this._selecting) {
    this._pieChart.pushToBackOfSelection(this);
  }

  // Selection effect: Highlight
  if (DvtChartStyleUtils.isSelectionHighlighted(this._chart)) {
    var shapeArr = this.getDisplayables();
    for (var i = 0; i < shapeArr.length; i++) {
      if (DvtChartPieSlice._shapeIsSelectable(shapeArr[i])) {
        shapeArr[i].setSelected(bSelected);
      }
    }
  }

  // Selection effect: Explode
  if (DvtChartStyleUtils.isSelectionExploded(this._chart)) {
    var explode = bSelected ? 1 : 0;
    if (!isInitial && DvtChartStyleUtils.getAnimationOnDataChange(this._chart) != 'none') {
      // animate the explosion
      var anim = new dvt.CustomAnimation(this._pieChart.getCtx(), this, this._pieChart.getAnimationDuration() / 2);
      anim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.getExplode, this.setExplode, explode);
      anim.play();
    }
    else
      this.setExplode(explode);
  }

  this._updateAriaLabel();
};

/**
 * @override
 */
DvtChartPieSlice.prototype.showHoverEffect = function() {
  this._selecting = true;
  this._pieChart.bringToFrontOfSelection(this);
  var shapeArr = this.getDisplayables();
  for (var i = 0; i < shapeArr.length; i++) {
    if (DvtChartPieSlice._shapeIsSelectable(shapeArr[i])) {
      shapeArr[i].showHoverEffect();
    }
  }
};


/**
 * @override
 */
DvtChartPieSlice.prototype.hideHoverEffect = function() {
  this._selecting = false;
  if (!this._selected) {
    this._pieChart.pushToBackOfSelection(this);
  }
  var shapeArr = this.getDisplayables();
  for (var i = 0; i < shapeArr.length; i++) {
    if (DvtChartPieSlice._shapeIsSelectable(shapeArr[i])) {
      shapeArr[i].hideHoverEffect();
    }
  }
};


//---------------------------------------------------------------------//
// Tooltip Support: DvtTooltipSource impl                              //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtChartPieSlice.prototype.getDatatip = function(target, x, y) {
  if (target == this._sliceLabel) {
    if (this._sliceLabel && this._sliceLabel.isTruncated())
      return this.getSliceLabelString();
  }
  return this.getTooltip();
};


/**
 * @override
 */
DvtChartPieSlice.prototype.getDatatipColor = function() {
  return this.getFillColor();
};


//---------------------------------------------------------------------//
// Rollover and Hide/Show Support: DvtCategoricalObject impl           //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtChartPieSlice.prototype.getCategories = function() {
  if (this._categories && this._categories.length > 0)
    return this._categories;
  return [this.getId().getSeries()];
};


//---------------------------------------------------------------------//
// Keyboard Support: DvtKeyboardNavigables impl                        //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtChartPieSlice.prototype.getNextNavigable = function(event) 
{
  var keyCode = event.keyCode;
  if (event.type == dvt.MouseEvent.CLICK)
  {
    return this;
  }
  else if (keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey)
  {
    // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
    // care of the selection
    return this;
  }

  var rtl = dvt.Agent.isRightToLeft(this._chart.getCtx());
  var slices = this._pieChart.__getSlices();
  var idx = dvt.ArrayUtils.getIndex(slices, this);
  var next = null;

  if (keyCode == dvt.KeyboardEvent.RIGHT_ARROW || (keyCode == dvt.KeyboardEvent.DOWN_ARROW && !rtl) || (keyCode == dvt.KeyboardEvent.UP_ARROW && rtl)) {
    if (idx < slices.length - 1)
      next = slices[idx + 1];
    else
      next = slices[0];
  } else if (keyCode == dvt.KeyboardEvent.LEFT_ARROW || (keyCode == dvt.KeyboardEvent.DOWN_ARROW && rtl) || (keyCode == dvt.KeyboardEvent.UP_ARROW && !rtl)) {
    if (idx == 0)
      next = slices[slices.length - 1];
    else
      next = slices[idx - 1];
  }
  return next;
};


/**
 * @override
 */
DvtChartPieSlice.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) {
  var displayables = this.getDisplayables();
  if (displayables[0])
    return displayables[0].getDimensions(targetCoordinateSpace);
  else
    return new dvt.Rectangle(0, 0, 0, 0);
};

/**
 * @override
 */
DvtChartPieSlice.prototype.getTargetElem = function() {
  var displayables = this.getDisplayables();
  if (displayables[0])
    return displayables[0].getElem();
  return null;
};

/**
 * @override
 */
DvtChartPieSlice.prototype.showKeyboardFocusEffect = function() 
{
  this._isShowingKeyboardFocusEffect = true;
  this.showHoverEffect();

};


/**
 * @override
 */
DvtChartPieSlice.prototype.hideKeyboardFocusEffect = function() 
{
  this._isShowingKeyboardFocusEffect = false;
  this.hideHoverEffect();
};


/**
 * @override
 */
DvtChartPieSlice.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};


/**
 * Returns the current explode value for this pie slice
 * @return {number}
 */
DvtChartPieSlice.prototype.getExplode = function() {
  return this._explode;
};


/**
 * Sets the current explode value for this pie slice
 * @param {number} explode
 */
DvtChartPieSlice.prototype.setExplode = function(explode) {
  this._explode = explode;
  this._explodeSlice();
};


/**
 * Returns the user-defined label for this pie slice.
 * @return {string}
 */
DvtChartPieSlice.prototype.getCustomLabel = function() {
  return this._customLabel;
};


/**
 * Returns the default series label for this pie slice.
 * @return {string}
 */
DvtChartPieSlice.prototype.getSeriesLabel = function() {
  return this._seriesLabel;
};


/**
 * Returns the color of this pie slice, represented as a String
 * @return {String}
 */
DvtChartPieSlice.prototype.getFillColor = function() {
  return this._fillColor;
};


/**
 * Returns the name of the fill pattern for this pie slice
 * @return {string}
 */
DvtChartPieSlice.prototype.getFillPattern = function() {
  return this._fillPattern;
};


/**
 * Returns the color of this pie slice border
 * @return {String}
 */
DvtChartPieSlice.prototype.getStrokeColor = function() {
  return this._strokeColor;
};


/**
 * Returns the color of this pie slice border
 * @return {String}
 */
DvtChartPieSlice.prototype.getBorderWidth = function() {
  return this._borderWidth;
};

/**
 * Returns the slice gaps
 * @return {Number}
 */
DvtChartPieSlice.prototype.getSliceGaps = function() {
  // Slice gap is only supported if the pie is not tilted (depth = 0)
  if (this._depth == 0)
    return 3 * DvtChartStyleUtils.getDataItemGaps(this._chart);
  else
    return 0;
};

/**
 * Returns the inner radius
 * @return {Number}
 */
DvtChartPieSlice.prototype.getInnerRadius = function() {
  return this._pieChart.getInnerRadius();
};

/**
 * Returns the tooltip string associated with this slice
 * @return {String}
 */
DvtChartPieSlice.prototype.getTooltip = function() {
  if (this._seriesIndex == null) // other slice
    return DvtChartTooltipUtils.getOtherSliceDatatip(this._chart, this._value, true);

  return DvtChartTooltipUtils.getDatatip(this._chart, this._seriesIndex, 0, true);
};


/**
 * Return the action string for the data item, if any exists.
 * @return {string} the action outcome for the data item.
 */
DvtChartPieSlice.prototype.getAction = function() {
  return this._action;
};

/**
 * Returns whether the pie slice is drillable.
 * @return {boolean}
 */
DvtChartPieSlice.prototype.isDrillable = function() {
  return this._drillable;
};


/**
 * Returns the popup behaviors for this pie.
 * @return {array}
 */
DvtChartPieSlice.prototype.getShowPopupBehaviors = function() {
  return this._showPopupBehaviors;
};


/**
 * Creates a filler slice (for fan effect in display animation).
 * @param {DvtChartPie} pieChart
 * @param {number} value The value of the filler slice.
 * @return {DvtChartPieSlice} filler slice.
 */
DvtChartPieSlice.createFillerSlice = function(pieChart, value) {
  var slice = new DvtChartPieSlice(pieChart);
  slice._value = value;
  slice._bFillerSlice = true;
  slice._centerX = pieChart.getCenter().x;
  slice._centerY = pieChart.getCenter().y;
  slice._fillColor = 'rgba(255,255,255,0)';
  slice._strokeColor = 'rgba(255,255,255,0)';
  slice._id = new DvtChartDataItem(null, null, null);
  return slice;
};

/**
 * Returns the seriesIndex of the slice
 * @return {Number}
 */
DvtChartPieSlice.prototype.getSeriesIndex = function() {
  return this._seriesIndex;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 *   Animation on Display funtionality.
 *   @class
 */
var DvtChartAnimOnDisplay = function() {};

dvt.Obj.createSubclass(DvtChartAnimOnDisplay, dvt.Obj);


/**
 *  Creates a dvt.Playable that performs initial animation for a chart.
 *  @param {dvt.Chart} chart
 *  @param {string} type The animation type.
 *  @param {number} duration The duration of the animation in seconds.
 *  @return {dvt.Playable} The animation of the chart objects that are subject to animation.
 */
DvtChartAnimOnDisplay.createAnimation = function(chart, type, duration) {
  var arPlayables = [];

  if (DvtChartTypeUtils.isBLAC(chart)) {
    DvtChartAnimOnDisplay._animBarLineArea(chart, duration, arPlayables);
  }
  else if (DvtChartTypeUtils.isScatterBubble(chart) || DvtChartTypeUtils.isFunnel(chart)) {
    DvtChartAnimOnDisplay._animBubbleScatterFunnel(chart, duration, arPlayables);
  }
  else if (DvtChartTypeUtils.isPie(chart) && chart.pieChart) {
    // Delegate to the pie to create the animation.
    return chart.pieChart.getDisplayAnimation();
  }

  return ((arPlayables.length > 0) ? new dvt.ParallelPlayable(chart.getCtx(), arPlayables) : null);
};


/**
 *  Adds a list of playables that animates the chart on initial display, for
 *  the bar and line/area components (including visible markers) to the
 *  supplied array.
 *  @param {dvt.Chart} chart
 *  @param {number} duration The duration of the animation in seconds.
 *  @param {Array} arPlayables The array to which the playables should be added.
 *  @private
 */
DvtChartAnimOnDisplay._animBarLineArea = function(chart, duration, arPlayables) {
  var objs = chart.getChartObjPeers();
  var objCount = objs ? objs.length : 0;

  if (objCount) {
    var obj, peer;
    var nodePlayable;

    for (var i = 0; i < objCount; i++) {
      peer = objs[i];

      obj = peer.getDisplayables()[0];
      var seriesType = peer.getSeriesType();

      nodePlayable = null;
      if (obj instanceof DvtChartBar || obj instanceof DvtChartPolarBar || obj instanceof DvtChartCandlestick) {
        nodePlayable = obj.getDisplayAnimation(duration);
      }
      else if (obj instanceof DvtChartLineArea) {
        if (seriesType == 'line')
          nodePlayable = DvtChartAnimOnDisplay._getLinePlayable(chart, obj, duration);
        else
          nodePlayable = DvtChartAnimOnDisplay._getAreaPlayable(chart, obj, duration);
      }
      else if (obj instanceof dvt.SimpleMarker || obj instanceof DvtChartRangeMarker) {
        // DvtChartLineMarker is invisible unless selected.
        if (obj instanceof DvtChartLineMarker && (!obj.isSelected()))
          continue;

        // Fade-in the marker near the end of the line/area animation
        nodePlayable = new dvt.AnimFadeIn(chart.getCtx(), obj, (duration - 0.8), 0.8);
      }

      if (nodePlayable) {
        arPlayables.push(nodePlayable);
      }
    } // end for
  } // end if objs
};


/**
 *  Adds a list of playables that animates the chart on initial display, for
 *  the bubble and scatter components to the supplied array.
 *  @param {dvt.Chart} chart
 *  @param {number} duration The duration of the animation in seconds.
 *  @param {Array} arPlayables The array to which the playables should be added.
 *  @private
 */
DvtChartAnimOnDisplay._animBubbleScatterFunnel = function(chart, duration, arPlayables) {
  var objs = chart.getObjects();
  var objCount = objs ? objs.length : 0;

  if (objCount) {
    var obj, peer;
    var nodePlayable;

    for (var i = 0; i < objCount; i++) {
      peer = objs[i];
      obj = peer.getDisplayables()[0];

      if (obj instanceof dvt.SimpleMarker)
        nodePlayable = new dvt.AnimPopIn(chart.getCtx(), obj, true, duration);
      else if (obj instanceof DvtChartFunnelSlice) {
        nodePlayable = DvtChartAnimOnDisplay._getFunnelPlayable(chart, obj, duration);
      }

      if (nodePlayable)
        arPlayables.push(nodePlayable);
    }
  }
};


/**
 *   Returns a dvt.Playable representing the animation of an area polygon
 *   to its initial data value.
 *   @param {dvt.Chart} chart
 *   @param {DvtChartLineArea} shape  the area shape to be animated.
 *   @param {number} duration The duration of the animation in seconds.
 *   @return {dvt.Playable} a playable representing the animation of the area to its initial data value.
 *   @private
 */
DvtChartAnimOnDisplay._getAreaPlayable = function(chart, shape, duration) {
  var context = chart.getCtx();
  var baselineCoord = shape.getBaseline();

  // Create animation for the area base
  var baseAnim;
  if (shape.isArea()) {
    var baseCoords = shape.getBaseCoords();
    var baseParams = shape.getBaseAnimationParams();
    var baseEndState = baseParams.slice(0); // copy, we will update the original
    for (var j = 0; j < baseParams.length; j++) {
      if (j % 4 == 1 || j % 4 == 2) // y1 or y2
        baseParams[j] = baselineCoord;
    }
    shape.setBaseAnimationParams(baseParams); // set initial position
    baseAnim = new dvt.CustomAnimation(context, shape, duration);
    baseAnim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, shape, shape.getBaseAnimationParams, shape.setBaseAnimationParams, baseEndState);
  }

  // Create animation for the area top
  var coords = shape.getCoords();
  var params = shape.getAnimationParams();
  var endState = params.slice(0); // copy, we will update the original
  for (var j = 0; j < params.length; j++) {
    if (j % 4 == 1 || j % 4 == 2) // y1 or y2
      params[j] = baselineCoord;
  }
  shape.setAnimationParams(params); // set initial position
  var topAnim = new dvt.CustomAnimation(context, shape, duration);
  topAnim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, shape, shape.getAnimationParams, shape.setAnimationParams, endState);

  // Combine the top and base animation
  var nodePlayable = new dvt.ParallelPlayable(chart.getCtx(), baseAnim, topAnim);
  nodePlayable.setOnEnd(function() {
    shape.setCoords(coords, baseCoords);
  });

  return nodePlayable;
};


/**
 *   Returns a dvt.Playable representing the animation of a funnel slice to
 *   its initial data value and location.
 *   @param {dvt.Chart} chart
 *   @param {DvtChartFunnelSlice} slice  The funnel slice to be animated.
 *   @param {number} duration The duration of the animation in seconds.
 *   @return {dvt.Playable} a playable representing the animation of the slice polygon to its initial data value.
 *   @private
 */
DvtChartAnimOnDisplay._getFunnelPlayable = function(chart, slice, duration) {
  var context = chart.getCtx();
  var arPoints = slice.getAnimationParams();
  var endState1 = arPoints.slice(0);
  var endState2 = arPoints.slice(0); // copy, we will update the original
  arPoints[0] = 0;
  arPoints[2] = 0;
  endState1[2] = 0;

  slice.setAnimationParams(arPoints); // set initial position
  var nodePlayable1 = new dvt.CustomAnimation(context, slice, duration / 2);
  nodePlayable1.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, slice, slice.getAnimationParams, slice.setAnimationParams, endState1);
  var nodePlayable2 = new dvt.CustomAnimation(context, slice, duration / 2);
  nodePlayable2.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, slice, slice.getAnimationParams, slice.setAnimationParams, endState2);

  return new dvt.SequentialPlayable(context, [nodePlayable1, nodePlayable2]);
};

/**
 *   Returns a dvt.Playable representing the animation of the line to
 *   its initial data value.
 *   @param {dvt.Chart} chart
 *   @param {DvtChartLineArea} line  the line shape to be animated.
 *   @param {number} duration The duration of the animation in seconds.
 *   @return {dvt.Playable} a playable representing the animation of the line to its initial data value.
 *   @private
 */
DvtChartAnimOnDisplay._getLinePlayable = function(chart, line, duration) {
  var coords = line.getCoords();
  var params = line.getAnimationParams();
  var endState = params.slice(0); // copy, we will update the original
  DvtChartAnimOnDisplay._getMeanPoints(params); // update params to initial coords
  line.setAnimationParams(params); // set initial position

  var nodePlayable = new dvt.CustomAnimation(chart.getCtx(), line, duration);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, line, line.getAnimationParams, line.setAnimationParams, endState);
  nodePlayable.setOnEnd(function() {
    line.setCoords(coords);
  });
  return nodePlayable;
};

/**
 * Updates the supplied array of line coordinates to reflect the mean x or y position of the line data.
 * @param {array} params  The line animation parameters.
 * @private
 */
DvtChartAnimOnDisplay._getMeanPoints = function(params) {
  var mean = 0;
  var min = Number.MAX_VALUE;
  var max = Number.MIN_VALUE;
  var len = params.length;
  var i;

  for (i = 0; i < len; i++) { // find largest and smallest y-values
    var v = params[i];
    if (i % 4 == 0 || i % 4 == 3 || v == Infinity) // x value or groupIndex
      continue;
    if (v < min)
      min = v;
    if (v > max)
      max = v;
    mean += v;
  }

  // if more than 2 data points, discard smallest and largest values to get a generally more representative mean.
  if (len > 8) {
    mean -= 2 * min;
    mean -= 2 * max;
    mean /= len / 2 - 4;
  }
  else
    mean /= len / 2;

  for (i = 0; i < len; i++) {
    if (i % 4 == 1 || i % 4 == 2) // y1 or y2
      params[i] = mean;
  }
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.


/**
  *   Animation on Datachange functionality.
  *   @class
  */
var DvtChartAnimOnDC = function() {};

dvt.Obj.createSubclass(DvtChartAnimOnDC, dvt.Obj);


/**
 * Creates a dvt.Playable that performs animation between a chart's data states.
 * @param {dvt.Chart} oldChart
 * @param {dvt.Chart} newChart
 * @param {string} type The animation type.
 * @param {number} duration The duration of the animation in seconds.
 * @param {dvt.Container} delContainer The container for adding the deleted objects.
 * @return {dvt.Playable}
 */
DvtChartAnimOnDC.createAnimation = function(oldChart, newChart, type, duration, delContainer)
{
  if (! DvtChartAnimOnDC._canAnimate(oldChart, newChart)) {
    return null;
  }

  var ctx = newChart.getCtx();

  // Build arrays of old and new data change handlers.
  var arOldList = [];
  var arNewList = [];
  if (DvtChartTypeUtils.isPie(newChart)) {
    arOldList.push(oldChart.pieChart);
    arNewList.push(newChart.pieChart);
  }
  else {
    DvtChartAnimOnDC._buildAnimLists(ctx, arOldList, oldChart, arNewList, newChart, duration);
  }

  //  Walk the datachange handler arrays, and create animators for risers
  //  that need to be updated/deleted/inserted.
  var playable;
  var handler = new dvt.DataAnimationHandler(ctx, delContainer);
  handler.constructAnimation(arOldList, arNewList);
  if (handler.getNumPlayables() > 0)
    playable = handler.getAnimation(true);

  // Animating the fade-in of data labels if they exist for this chart.
  var newLabels = newChart.getDataLabels();
  if (playable && newLabels.length > 0) {
    for (var i = 0; i < newLabels.length; i++)
      newLabels[i].setAlpha(0);
    playable = new dvt.SequentialPlayable(ctx, playable, new dvt.AnimFadeIn(ctx, newLabels, duration / 4));
  }

  return playable;
};


/**
 * Builds two (supplied) arrays of data change handlers (such as {@link DvtChartDataChange3DBar}
 * for the old and new charts. Also creates this._Y1Animation list of gridline
 * playables if axis scale change.
 * @param {dvt.Context} ctx
 * @param {array} arOldList The array to fill in the old peers.
 * @param {dvt.Chart} oldChart
 * @param {array} arNewList The array to fill in the new peers.
 * @param {dvt.Chart} newChart
 * @param {number} duration Animation duration.
 * @private
 */
DvtChartAnimOnDC._buildAnimLists = function(ctx, arOldList, oldChart, arNewList, newChart, duration)
{
  //  Create a list of DC handlers in arOldPeers and arNewPeers for the old and new peers.
  var i, j;
  var ar = oldChart.getChartObjPeers();
  var aOut = arOldList; // start on old peers first
  var peer, obj, dch;

  for (i = 0; i < 2; i++) {            // loop over old peers and new peers
    for (j = 0; j < ar.length; j++) {
      peer = ar[j];

      obj = peer.getDisplayables()[0];
      dch = null;

      if (obj instanceof DvtChartFunnelSlice) {
        dch = new DvtChartDataChangeFunnelSlice(peer, duration);
      }
      else if (obj instanceof DvtChartBar || obj instanceof DvtChartPolarBar) {
        dch = new DvtChartDataChangeBar(peer, duration);
      }
      else if (obj instanceof DvtChartLineArea) {
        dch = new DvtChartDataChangeLineArea(peer, duration);
      }
      else if (obj instanceof dvt.SimpleMarker) {
        // DvtChartLineMarker is invisible unless selected.
        if (obj instanceof DvtChartLineMarker && !obj.isSelected())
          continue;

        dch = new DvtChartDataChangeMarker(peer, duration);
      }
      else if (obj instanceof DvtChartRangeMarker) {
        if (obj.isInvisible() && !obj.isSelected())
          continue;

        dch = new DvtChartDataChangeRangeMarker(peer, duration);
      }
      else if (obj instanceof DvtChartCandlestick) {
        dch = new DvtChartDataChangeAbstract(peer, duration);
      }

      if (dch) {
        aOut.push(dch);
        dch.setOldChart(oldChart);
      }
    }

    // repeat on the new chart's peer
    aOut = arNewList;
    ar = newChart.getChartObjPeers();
  }
};


/**
 * Checks if animation between the two charts is possible.
 * @param {dvt.Chart} oldChart
 * @param {dvt.Chart} newChart
 * @return {boolean} true if animation can be performed, else false.
 * @private
 */
DvtChartAnimOnDC._canAnimate = function(oldChart, newChart)
{
  //  Test for conditions for which we will not animate.
  if (DvtChartTypeUtils.isPie(oldChart) && DvtChartTypeUtils.isPie(newChart))
    return oldChart && newChart;
  else if (DvtChartTypeUtils.isPolar(oldChart) != DvtChartTypeUtils.isPolar(newChart))
    return false;
  else if (DvtChartTypeUtils.isBLAC(oldChart) && DvtChartTypeUtils.isBLAC(newChart))
    return true;
  else if (DvtChartTypeUtils.isScatterBubble(oldChart) && DvtChartTypeUtils.isScatterBubble(newChart))
    return true;
  else if (oldChart.getType() == newChart.getType())
    return true;
  else
    return false;
};
/**
 * Data context for an old chart during a data change animation.
 * @param {dvt.Chart} chart The actual chart, before being updated with the new data.
 * @class
 * @constructor
 * @extends {dvt.Chart}
 */
var DvtChartDataChange = function(chart) {
  this.Options = chart.Options;
  this.Peers = chart.Peers;
  this.SeriesStyleArray = chart.SeriesStyleArray;
  this.Cache = chart.Cache;
  this.pieChart = chart.pieChart;
  this._optionsCache = chart.getOptionsCache();
  this._renderCache = chart.getRenderCache();
};

dvt.Obj.createSubclass(DvtChartDataChange, dvt.Chart);

/**
 * Returns the render cache. Cleared on each render.
 * @return {object}
 */
DvtChartDataChange.prototype.getRenderCache = function() {
  return this._renderCache;
};

/**
 * Returns the options cache. Cleared on each setOptions
 * @return {object}
 */
DvtChartDataChange.prototype.getOptionsCache = function() {
  return this._optionsCache;
};

/**
  *  Abstract Data change handler for a chart object peer.
  *  @extends {dvt.Obj}
  *  @class DvtChartDataChangeAbstract  Data change Handler for a chart object peer.
  *  @constructor
  *  @param {DvtChartObjPeer} peer  The chart object peer to be animated on datachange.
  *  @param {Number} duration  the duration of the animation in seconds.
  */
var DvtChartDataChangeAbstract = function(peer, duration)
{
  this.Init(peer, duration);
};

dvt.Obj.createSubclass(DvtChartDataChangeAbstract, dvt.Obj);

/**
  * Creates an update animation from the old node to this node.
  * @param {dvt.DataAnimationHandler} handler The animation handler, which can
  *                                  be used to chain animations. Animations
  *                                  created should be added via
  *                                  dvt.DataAnimationHandler.add()
  * @param {DvtChartDataChangeAbstract} oldNode The old node state to animate from.
  */
DvtChartDataChangeAbstract.prototype.animateUpdate = function(handler, oldNode) {
  var oldShape = oldNode._shape;

  // Use update animation defined by the shape if available.
  if (this._shape && this._shape.getUpdateAnimation)
    handler.add(this._shape.getUpdateAnimation(this._updateDuration, oldShape), 1);
};

/**
  * Creates an insert animation for this node.
  * @param {dvt.DataAnimationHandler} handler The animation handler, which can
  *                                  be used to chain animations. Animations
  *                                  created should be added via
  *                                  dvt.DataAnimationHandler.add()
  */
DvtChartDataChangeAbstract.prototype.animateInsert = function(handler)
{
  // Use insert animation defined by the shape if available.
  if (this._shape && this._shape.getInsertAnimation)
    handler.add(this._shape.getInsertAnimation(this._insertDuration), 2);
  else { // Fade In
    var nodePlayable = new dvt.AnimFadeIn(this._shape.getCtx(), this._shape, this._insertDuration);
    handler.add(nodePlayable, 0);
  }
};

/**
  * Creates a delete animation for this node.
  * @param {dvt.DataAnimationHandler} handler The animation handler, which can
  *                                  be used to chain animations. Animations
  *                                  created should be added via
  *                                  dvt.DataAnimationHandler.add()
  * @param {dvt.Container} delContainer   The container to which deleted objects can
  *                                      be moved for animation.
  */
DvtChartDataChangeAbstract.prototype.animateDelete = function(handler, delContainer)
{
  // Move from the old chart to the delete container on top of the new chart.
  delContainer.addChild(this._shape);

  // Use the delete animation defined by the shape if available.
  if (this._shape && this._shape.getDeleteAnimation)
    handler.add(this._shape.getDeleteAnimation(this._deleteDuration), 0);
  else { // Fade Out
    var nodePlayable = new dvt.AnimFadeOut(this._shape.getCtx(), this._shape, this._deleteDuration);
    handler.add(nodePlayable, 0);
  }
};

/**
  *  @return {String}  a unique Id for object comparison during
  *  datachange animation of two charts.
  */
DvtChartDataChangeAbstract.prototype.getId = function()
{
  return this._animId;
};


/**
  *  Object initializer.
  *  @param {DvtChartObjPeer} peer The chart object peer for the shape to be animated.
  *  @param {number} duration  the animation duration is seconds.
  */
DvtChartDataChangeAbstract.prototype.Init = function(peer, duration)
{
  this._peer = peer;
  this._updateDuration = duration * 0.75;
  this._insertDuration = duration * 0.50;
  this._deleteDuration = duration * 0.50;
  this._shape = peer.getDisplayables()[0];
  this._animId = peer.getSeries() + '/' + peer.getGroup();
};

/**
  *   Saves the psuedo old chart object.
  *   @param {Object} chart  a synopsis object created by dvt.Chart before
  *   the chart object is updated and rendered with new data.
  */
DvtChartDataChangeAbstract.prototype.setOldChart = function(chart)
{
  this._oldChart = chart;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 *  Data change Handler for 2D Bar Riser (implements DvtChartDataChangeAbstract).
 *  @extends {DvtChartDataChangeAbstract}
 *  @class DvtChartDataChangeBar  Data change Handler for 2D Bar Riser.
 *  @constructor
 *  @param {DvtChartObjPeer} peer The chart object peer for the shape to be animated.
 *  @param {number} duration  the animation duration is seconds.
 */
var DvtChartDataChangeBar = function(peer, duration) {
  this.Init(peer, duration);
};

dvt.Obj.createSubclass(DvtChartDataChangeBar, DvtChartDataChangeAbstract);


/**
 * @override
 */
DvtChartDataChangeBar.prototype.Init = function(peer, duration) {
  DvtChartDataChangeBar.superclass.Init.call(this, peer, duration);

  this._indicator = null;
  this._animId += '/bar';
};


/**
 * @override
 */
DvtChartDataChangeBar.prototype.animateInsert = function(handler) {
  var playable = this._shape.getInsertAnimation(this._insertDuration);
  handler.add(playable, 2);
};


/**
 * @override
 */
DvtChartDataChangeBar.prototype.animateDelete = function(handler, delContainer) {
  // Move from the old chart to the new chart
  delContainer.addChild(this._shape);

  // Create the delete animation
  var playable = this._shape.getDeleteAnimation(this._deleteDuration);
  handler.add(playable, 0);
};


/**
 * @override
 */
DvtChartDataChangeBar.prototype.animateUpdate = function(handler, oldDC) {
  var oldChart = this._oldChart;
  var newChart = this._peer.getChart();

  // Get the start and end state for the animation. Get flipped coordinates if orientation has changed.
  var bFlip = DvtChartTypeUtils.isHorizontal(oldChart) != DvtChartTypeUtils.isHorizontal(newChart);
  var startState = oldDC._getAnimationParams(bFlip);
  var endState = this._getAnimationParams();

  // Get the start and end state for the fill animation. If either shape is selected, skip the fill animation so
  // that it doesn't animate the black fill of the selection outer shape
  var bSkipFillAnimation = (oldDC._shape.isSelected() || this._shape.isSelected());
  var startFill = oldDC._shape.getPrimaryFill().clone();
  var endFill = this._shape.getPrimaryFill();

  if (dvt.ArrayUtils.equals(startState, endState) && startFill.equals(endFill))
    return;

  var newSIdx = this._peer.getSeriesIndex();
  var oldSIdx = oldDC._peer.getSeriesIndex();
  var newGIdx = this._peer.getGroupIndex();
  var oldGIdx = oldDC._peer.getGroupIndex();

  //  Create an animate indicator if requested
  if (DvtChartStyleUtils.getAnimationIndicators(newChart) !== 'none')
    this._indicator = DvtChartDataChangeUtils.makeIndicator(oldChart, oldSIdx, oldGIdx, newChart, newSIdx, newGIdx);

  // Initialize start state
  this._setAnimationParams(startState);
  if (!bSkipFillAnimation)
    this._shape.setFill(startFill);

  // Create the animator for this bar update
  var nodePlayable = new dvt.CustomAnimation(this._shape.getCtx(), this, this._updateDuration);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this, this._getAnimationParams, this._setAnimationParams, endState);

  if (!bSkipFillAnimation)
    nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_FILL, this._shape, this._shape.getFill, this._shape.setFill, endFill);

  if (this._indicator) {
    nodePlayable.setOnEnd(this._onEndAnimation, this);
    this._indicator.setAlpha(0);
  }

  handler.add(nodePlayable, 1);// create the playable
};


/**
 * Returns the geometry of the bar.
 * @param {boolean} bFlip True if the result should be flipped for horizontal/vertical orientation change.
 * @return {Array}
 * @private
 */
DvtChartDataChangeBar.prototype._getAnimationParams = function(bFlip) {
  return this._shape.getAnimationParams(bFlip);
};


/**
 * Updates the geometry of the bar.
 * @param {Array} ar  an array containing the polygon points.
 * @private
 */
DvtChartDataChangeBar.prototype._setAnimationParams = function(ar) {
  this._shape.setAnimationParams(ar, this._indicator);
};


/**
 * Callback to remove the indicator object at the end of the animation.
 * @private
 */
DvtChartDataChangeBar.prototype._onEndAnimation = function() {
  this._indicator.getParent().removeChild(this._indicator);
  this._indicator = null;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.

/**
  *  Data change Handler for Line or Area (implements DvtChartDataChangeAbstract).
  *  @extends {dvt.Obj}
  *  @class DvtChartDataChangeLineArea  Data change Handler for Line and Area.
  *  @constructor
  *  @param {DvtChartObjPeer} peer  The chart object peer for the shape to be animated.
  *  @param {number} duration  the animation duration is seconds.
  */
var DvtChartDataChangeLineArea = function(peer, duration) 
{
  this.Init(peer, duration);
};

dvt.Obj.createSubclass(DvtChartDataChangeLineArea, DvtChartDataChangeAbstract);


/**
 * Creates the update animation for this Line or Area. Insert/delete of
 * groups within an existing series is treated as a special case of animateUpdate.
 * @param {dvt.DataAnimationHandler} handler The animation handler, which can be
 *                                          used to chain animations.
 * @param {DvtChartDataChangeLineArea} oldDC   The old node DC Handler to animate from.
 * @override
 */
DvtChartDataChangeLineArea.prototype.animateUpdate = function(handler, oldDC)
{
  this._baseCoords = this._shape.getBaseCoords();
  this._coords = this._shape.getCoords();
  var isArea = this._shape.isArea();

  var oldChart = this._oldChart;
  var newChart = this._chart;
  var newSIdx = this._peer.getSeriesIndex();
  var oldSIdx = oldDC._peer.getSeriesIndex();
  var newGIdcs = this._shape.getCommonGroupIndices(oldDC._shape);
  var oldGIdcs = oldDC._shape.getCommonGroupIndices(this._shape);

  // Construct animation for the area base.
  var baseAnim;
  if (isArea) {
    var baseStartState = oldDC._getBaseAnimationParams(this._shape);
    var baseEndState = this._getBaseAnimationParams(oldDC._shape);
    DvtChartDataChangeLineArea._matchGroupIndices(baseStartState, baseEndState);
    if (!dvt.ArrayUtils.equals(baseStartState, baseEndState)) {
      this._setBaseAnimationParams(baseStartState);    // initialize the start state
      baseAnim = new dvt.CustomAnimation(this._context, this, this._updateDuration);
      baseAnim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this,
          this._getBaseAnimationParams, this._setBaseAnimationParams, baseEndState);
    }
  }

  // Construct animation for the line or the area top.
  var topAnim;
  var startState = oldDC._getAnimationParams(this._shape);
  var endState = this._getAnimationParams(oldDC._shape);
  DvtChartDataChangeLineArea._matchGroupIndices(startState, endState);
  if (!dvt.ArrayUtils.equals(startState, endState)) {
    this._setAnimationParams(startState);    // initialize the start state
    topAnim = new dvt.CustomAnimation(this._context, this, this._updateDuration);
    topAnim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this,
        this._getAnimationParams, this._setAnimationParams, endState);
  }

  // Create animate indicators if requested. If seriesType is lineWithArea, add indicators only to the line.
  if (DvtChartStyleUtils.getAnimationIndicators(newChart) !== 'none' && !(isArea && this._peer.getSeriesType() == 'lineWithArea')) {
    var direction, indicator;
    for (var i = 0; i < newGIdcs.length; i++) {
      direction = DvtChartDataChangeUtils.getDirection(oldChart, oldSIdx, oldGIdcs[i], newChart, newSIdx, newGIdcs[i]);
      indicator = DvtChartDataChangeUtils.makeIndicator(oldChart, oldSIdx, oldGIdcs[i], newChart, newSIdx, newGIdcs[i]);
      if (indicator)
        this._shape.addIndicator(newGIdcs[i], direction, indicator);
    }
  }

  // Combine the top and base animation.
  if (baseAnim || topAnim) {
    var nodePlayable = new dvt.ParallelPlayable(this._context, baseAnim, topAnim);
    nodePlayable.setOnEnd(this._onAnimationEnd, this);
    handler.add(nodePlayable, 1);
  }
};


/**
 * Creates the insert animation for this Line or Area.
 * @param {dvt.DataAnimationHandler} handler The animation handler, which can be used to chain animations.
 * @override
 */
DvtChartDataChangeLineArea.prototype.animateInsert = function(handler)
{
  this._shape.setAlpha(0); // set alpha=0 so that the inserted object is hidden until the insert animation starts

  var nodePlayable = new dvt.AnimFadeIn(this._context, this._shape, this._insertDuration);
  handler.add(nodePlayable, 2);
};


/**
 * Creates the delete animation for this Line or Area
 * @param {dvt.DataAnimationHandler} handler The animation handler, which can be used to
 *                                          chain animations.
 * @param {dvt.Container} delContainer   The container to which the deleted objects should
 *                                      be moved for animation.
 * @override
 */
DvtChartDataChangeLineArea.prototype.animateDelete = function(handler, delContainer)
{
  var nodePlayable;
  var seriesType = DvtChartStyleUtils.getSeriesType(this._oldChart, this._peer.getSeriesIndex()); // get from old chart

  if (seriesType == 'area') {
    // For area chart, we need to add and fade out all of the areas (not just the deleted ones) to make sure that the
    // areas are in the correct z-order. Furthermore, the delContainer should be the areaContainer of the new chart
    // so that the deleted areas appear below the gridlines and other data items.
    var areaContainer = this._chart.__getAreaContainer(); // new chart's areaContainer
    this._deletedAreas = this._shape.getParent().getParent(); // the parent is the clipGroup, and the grandparent is the old chart's areaContainer
    if (areaContainer)
      areaContainer.addChild(this._deletedAreas);
    else
      return;
    nodePlayable = new dvt.AnimFadeOut(this._context, this._deletedAreas, this._deleteDuration);
    nodePlayable.setOnEnd(this._removeDeletedAreas, this);
    handler.add(nodePlayable, 0);
  }
  else {
    // Move from the old chart to the delete container on top of the new chart.
    delContainer.addChild(this._shape);
    nodePlayable = new dvt.AnimFadeOut(this._context, this._shape, this._deleteDuration);
    handler.add(nodePlayable, 0);
  }
};


/**
 * Removes the deleted areas at the end of delete animation.
 * @private
 */
DvtChartDataChangeLineArea.prototype._removeDeletedAreas = function() {
  var areaContainer = this._chart.__getAreaContainer();
  if (areaContainer)
    areaContainer.removeChild(this._deletedAreas);
};


/**
 * Returns the animation params for the line or the area top.
 * @param {DvtChartLineArea} otherShape
 * @return {array} params
 * @private
 */
DvtChartDataChangeLineArea.prototype._getAnimationParams = function(otherShape) {
  return this._shape.getAnimationParams(otherShape);
};

/**
 * Updates the animation params for the line or the area top.
 * @param {array} params
 * @private
 */
DvtChartDataChangeLineArea.prototype._setAnimationParams = function(params) {
  this._shape.setAnimationParams(params);
};

/**
 * Returns the animation params for the area base.
 * @param {DvtChartLineArea} otherShape
 * @return {array} params
 * @private
 */
DvtChartDataChangeLineArea.prototype._getBaseAnimationParams = function(otherShape) {
  return this._shape.getBaseAnimationParams(otherShape);
};

/**
 * Updates the animation params for the area base.
 * @param {array} params
 * @private
 */
DvtChartDataChangeLineArea.prototype._setBaseAnimationParams = function(params) {
  this._shape.setBaseAnimationParams(params);
};


/**
 * Clean up at the end of update animation.
 * @private
 */
DvtChartDataChangeLineArea.prototype._onAnimationEnd = function() {
  this._shape.removeIndicators();
  this._shape.setCoords(this._coords, this._baseCoords);
};

/**
 * Sets the group indices of the startParams to be the group indices of the endParams.
 * Required because the group indices of the startParams is taken from the oldChart.
 * @param {array} startParams
 * @param {array} endParams
 * @private
 */
DvtChartDataChangeLineArea._matchGroupIndices = function(startParams, endParams) {
  // group index is the 4th, 8th, 12th... param
  for (var i = 3; i < startParams.length; i += 4) {
    startParams[i] = endParams[i];
  }
};

/**
 * @override
 */
DvtChartDataChangeLineArea.prototype.Init = function(peer, duration) {
  DvtChartDataChangeLineArea.superclass.Init.call(this, peer, duration);

  this._context = this._shape.getCtx();
  this._chart = this._peer.getChart();
  this._animId += '/' + (this._shape.isArea() ? 'area' : 'line');
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
/**
  *  Data change Handler for markers.
  *  @extends {DvtChartDataChangeAbstract}
  *  @class DvtChartDataChangeMarker  Data change Handler for markers.
  *  @constructor
  *  @param {DvtChartObjPeer} peer  The chart object peer for the shape to be animated.
  *  @param {Number} duration  The animation duration is seconds.
  */
var DvtChartDataChangeMarker = function(peer, duration)
{
  this.Init(peer, duration);
};

dvt.Obj.createSubclass(DvtChartDataChangeMarker, DvtChartDataChangeAbstract);

/**
 * @override
 */
DvtChartDataChangeMarker.prototype.animateUpdate = function(handler, oldDC)
{
  var startRect = oldDC._shape.getCenterDimensions();
  var endRect = this._shape.getCenterDimensions();

  // Return if no change in the geometry
  if (endRect.equals(startRect))
    return;

  // Initialize the start state
  this._shape.setCenterDimensions(startRect);

  // Create the animator for this node
  var nodePlayable = new dvt.CustomAnimation(this._shape.getCtx(), this, this._updateDuration);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_RECTANGLE, this._shape, this._shape.getCenterDimensions, this._shape.setCenterDimensions, endRect);

  // If animation indicators required, and the value changed, add visual effect to marker.
  var chart = this._peer.getChart();
  if (this.isValueChange(oldDC) && (DvtChartStyleUtils.getAnimationIndicators(chart) != 'none') && DvtChartTypeUtils.isScatterBubble(chart)) {
    // Use the old shape for the update color overlay
    var overlay = oldDC._shape;
    overlay.setSolidFill('#FFFF2B', 0.9);
    overlay.setCenterDimensions(startRect);
    this._peer.getChart().getPlotArea().addChild(overlay);

    //  Move and fade the overlay
    nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_RECTANGLE, overlay, overlay.getCenterDimensions, overlay.setCenterDimensions, endRect);
    nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, overlay, overlay.getAlpha, overlay.setAlpha, 0);

    // Set end listener to remove the overlay
    this._overlay = overlay;
    nodePlayable.setOnEnd(this._onEndAnimation, this);
  }

  handler.add(nodePlayable, 1);
};

/**
 * @override
 */
DvtChartDataChangeMarker.prototype.animateInsert = function(handler)
{
  this._shape.setAlpha(0);
  var nodePlayable = new dvt.AnimFadeIn(this._shape.getCtx(), this._shape, this._insertDuration);

  handler.add(nodePlayable, 2);
};

/**
 * @override
 */
DvtChartDataChangeMarker.prototype.animateDelete = function(handler, delContainer)
{
  delContainer.addChild(this._shape);   // Move from the old chart to the delete
  // container on top of the new chart.

  var nodePlayable = new dvt.AnimFadeOut(this._shape.getCtx(), this._shape, this._deleteDuration);

  handler.add(nodePlayable, 0);
};

/**
 * Check if there is data change.
 * @param {DvtChartDataChangeMarker} oldDC    The old node state to animate from.
 * @return {boolean}  true if node data has changed.
 */
DvtChartDataChangeMarker.prototype.isValueChange = function(oldDC)
{
  var bRet = false;

  if (oldDC) {

    var oldSIdx = oldDC._peer.getSeriesIndex();
    var oldGIdx = oldDC._peer.getGroupIndex();
    var newSIdx = this._peer.getSeriesIndex();
    var newGIdx = this._peer.getGroupIndex();
    var oldData = oldDC._oldChart.getOptions();
    var newData = this._peer.getChart().getOptions();

    var oldX = oldData['series'][oldSIdx]['items'][oldGIdx]['x'];
    var oldY = oldData['series'][oldSIdx]['items'][oldGIdx]['y'];
    var oldZ = oldData['series'][oldSIdx]['items'][oldGIdx]['z'];
    var newX = newData['series'][newSIdx]['items'][newGIdx]['x'];
    var newY = newData['series'][newSIdx]['items'][newGIdx]['y'];
    var newZ = newData['series'][newSIdx]['items'][newGIdx]['z'];

    bRet = ((newX !== oldX) || (newY !== oldY) || (newZ !== oldZ));
  }

  return bRet;
};

/**
 * Remove update animation overlay
 * @private
 */
DvtChartDataChangeMarker.prototype._onEndAnimation = function()
{
  if (this._overlay) {
    this._peer.getChart().getPlotArea().removeChild(this._overlay);
    this._overlay = null;
  }
};

/**
 * @override
 */
DvtChartDataChangeMarker.prototype.Init = function(peer, duration) {
  DvtChartDataChangeMarker.superclass.Init.call(this, peer, duration);

  this._animId += '/marker';
};
/**
 *  Data change handler for range markers (implements DvtChartDataChangeAbstract).
 *  @extends {DvtChartDataChangeAbstract}
 *  @class DvtChartDataChangeRangeMarker  Data change Handler for range markers.
 *  @constructor
 *  @param {DvtChartObjPeer} peer The chart object peer for the shape to be animated.
 *  @param {number} duration  the animation duration is seconds.
 */
var DvtChartDataChangeRangeMarker = function(peer, duration) {
  this.Init(peer, duration);
};

dvt.Obj.createSubclass(DvtChartDataChangeRangeMarker, DvtChartDataChangeAbstract);


/**
 * @override
 */
DvtChartDataChangeRangeMarker.prototype.Init = function(peer, duration) {
  DvtChartDataChangeRangeMarker.superclass.Init.call(this, peer, duration);

  this._animId += '/rangeMarker';
};


/**
 * @override
 */
DvtChartDataChangeRangeMarker.prototype.animateInsert = function(handler) {
  this._shape.setAlpha(0);
  var nodePlayable = new dvt.AnimFadeIn(this._shape.getCtx(), this._shape, this._insertDuration);

  handler.add(nodePlayable, 2);
};


/**
 * @override
 */
DvtChartDataChangeRangeMarker.prototype.animateDelete = function(handler, delContainer) {
  delContainer.addChild(this._shape);   // Move from the old chart to the delete
  // container on top of the new chart.

  var nodePlayable = new dvt.AnimFadeOut(this._shape.getCtx(), this._shape, this._deleteDuration);

  handler.add(nodePlayable, 0);
};


/**
 * @override
 */
DvtChartDataChangeRangeMarker.prototype.animateUpdate = function(handler, oldDC) {
  var start = oldDC._shape.getAnimationParams();
  var end = this._shape.getAnimationParams();

  // Initialize the start state
  this._shape.setAnimationParams(start);

  // Create the animator for this node
  var nodePlayable = new dvt.CustomAnimation(this._shape.getCtx(), this, this._updateDuration);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this._shape, this._shape.getAnimationParams, this._shape.setAnimationParams, end);

  handler.add(nodePlayable, 1);
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
/*---------------------------------------------------------------------*/
/*  DvtChartDataChangeUtils()                                                       */
/*---------------------------------------------------------------------*/

// Utilities for Chart data change animations

/**
 * @constructor
 */
var DvtChartDataChangeUtils = new Object;

dvt.Obj.createSubclass(DvtChartDataChangeUtils, dvt.Obj);

DvtChartDataChangeUtils.DIR_UP = 0;     // pointer directions
DvtChartDataChangeUtils.DIR_DOWN = 1;
DvtChartDataChangeUtils.DIR_NOCHANGE = 2;

/**
 * Creates an update value direction pointer and positions it.
 * @param {Object} oldChart old chart.
 * @param {number} oldSIdx old series index.
 * @param {number} oldGIdx old group index.
 * @param {dvt.Chart} newChart new chart.
 * @param {number} newSIdx new series index.
 * @param {number} newGIdx new group index.
 * @return {dvt.Path} indicator.
 */
DvtChartDataChangeUtils.makeIndicator = function(oldChart, oldSIdx, oldGIdx, newChart, newSIdx, newGIdx) {
  if (DvtChartTypeUtils.isPolar(newChart))
    return null;

  var uiDirection = DvtChartDataChangeUtils.getDirection(oldChart, oldSIdx, oldGIdx, newChart, newSIdx, newGIdx);
  if (uiDirection == DvtChartDataChangeUtils.DIR_NOCHANGE)
    return null;

  var bDown = (uiDirection === DvtChartDataChangeUtils.DIR_DOWN);
  var fc = bDown ? DvtChartStyleUtils.getAnimationDownColor(newChart) : DvtChartStyleUtils.getAnimationUpColor(newChart);

  //  Create a path object that draws the indicator (it will be positioned in _setAnimationParams).
  var indicator = DvtChartDataChangeUtils._drawIndicator(newChart.getCtx(), bDown, DvtChartTypeUtils.isHorizontal(newChart), fc);
  newChart.getPlotArea().addChild(indicator);
  return indicator;
};

/**
 * Returns the direction of data change for use with animation indicators
 * @param {Object} oldChart old chart.
 * @param {number} oldSIdx old series index.
 * @param {number} oldGIdx old group index.
 * @param {dvt.Chart} newChart new chart.
 * @param {number} newSIdx new series index.
 * @param {number} newGIdx new group index.
 * @return {number} direction.
 */
DvtChartDataChangeUtils.getDirection = function(oldChart, oldSIdx, oldGIdx, newChart, newSIdx, newGIdx)
{
  var oldValue = DvtChartDataUtils.getValue(oldChart, oldSIdx, oldGIdx);
  var newValue = DvtChartDataUtils.getValue(newChart, newSIdx, newGIdx);

  if (newValue == null || oldValue == null || newValue == oldValue)
    return DvtChartDataChangeUtils.DIR_NOCHANGE;

  return (newValue > oldValue) ? DvtChartDataChangeUtils.DIR_UP : DvtChartDataChangeUtils.DIR_DOWN;
};

/**
 * Creates and returns a dvt.Path centered at (0,0) for the animation indicator.
 * @param {dvt.Context} context
 * @param {boolean} bDown True if the indicator represents a decrease in value.
 * @param {boolean} bHoriz True if the y axis is horizontal.
 * @param {string} fc The fill color of the indicator
 * @return {dvt.Path}
 * @private
 */
DvtChartDataChangeUtils._drawIndicator = function(context, bDown, bHoriz, fc)
{
  // TODO: This function will be combined with drawDirectionPointer and removed in the near future.
  var ptrCmds;
  if (bHoriz) {
    var bLeft = dvt.Agent.isRightToLeft(context) ? !bDown : bDown;
    ptrCmds = bLeft ? 'M3.5,-5L3.5,5L-3.5,0L3.5,-5' : 'M-3.5,-5L-3.5,5L3.5,0L-3.5,-5';
  }
  else  // Vertical
    ptrCmds = bDown ? 'M-5,-3.5L5,-3.5L0,3.5L-5,-3.5Z' : 'M-5,3.5L5,3.5L0,-3.5L-5,3.5Z';

  var ret = new dvt.Path(context, ptrCmds);
  ret.setSolidFill(fc);
  return ret;
};
// Copyright (c) 2013, 2016, Oracle and/or its affiliates. All rights reserved.



/**
 *  Data change Handler for DvtChartFunnelSlice (implements DvtChartDataChangeAbstract).
 *  @extends {DvtChartDataChangeAbstract}
 *  @class DvtChartDataChangeFunnelSlice  Data change Handler for Funnel Slices.
 *  @constructor
 *  @param {DvtChartObjPeer} peer  The chart object peer for the shape to be animated.
 *  @param {Number} duration  the animation duration is seconds.
 */
var DvtChartDataChangeFunnelSlice = function(peer, duration) {
  this.Init(peer, duration);
};

dvt.Obj.createSubclass(DvtChartDataChangeFunnelSlice, DvtChartDataChangeAbstract);


/**
 * @override
 */
DvtChartDataChangeFunnelSlice.prototype.animateUpdate = function(handler, oldDC) {
  var obj = this._shape;

  var startState = oldDC._shape.getAnimationParams();
  var endState = obj.getAnimationParams();

  var startFill = oldDC._shape.getFill().clone();
  var endFill = this._shape.getFill();

  if (dvt.ArrayUtils.equals(startState, endState) && startFill.equals(endFill)) // if no change,
    return; // nothing to animate.

  // Initialize start state
  obj.setAnimationParams(startState);
  this._shape.setFill(startFill);

  // Create the animator for this slice update
  var nodePlayable = new dvt.CustomAnimation(obj.getCtx(), this, this._updateDuration);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, obj, obj.getAnimationParams, obj.setAnimationParams, endState);

  // TODO  this only works for slices without target values. Slices with target values are drawn within
  // DvtChartFunnelSlice, so wait until the animation code is collapsed to do that work.
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_FILL, this._shape, this._shape.getFill, this._shape.setFill, endFill);

  // TODO  this line of code makes no sense, since we never draw an indicator for funnel
  if (this._indicator) {
    nodePlayable.setOnEnd(this._onEndAnimation, this);
  }

  handler.add(nodePlayable, 1); // create the playable
};


/**
 * @override
 */
DvtChartDataChangeFunnelSlice.prototype.animateInsert = function(handler) {
  var obj = this._shape;

  var endState = obj.getAnimationParams();
  var startState = endState.slice(0);
  startState[0] += startState[1] / 2;
  startState[1] = 0;
  startState[3] = 0; // start alpha

  obj.setAnimationParams(startState);// set the start state
  var nodePlayable = new dvt.CustomAnimation(obj.getCtx(), this, this._insertDuration);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, obj, obj.getAnimationParams, obj.setAnimationParams, endState);

  handler.add(nodePlayable, 2); // create the playable
};


/**
 * @override
 */
DvtChartDataChangeFunnelSlice.prototype.animateDelete = function(handler, delContainer) {
  var obj = this._shape;

  delContainer.addChild(obj); // move from existing container to the delete container on top of the new chart.

  var startState = obj.getAnimationParams();
  var endState = startState.slice(0);

  endState[0] += startState[1] / 2;
  endState[1] = 0;
  endState[3] = 0; // end alpha

  var nodePlayable = new dvt.CustomAnimation(obj.getCtx(), this, this._deleteDuration);
  nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, obj, obj.getAnimationParams, obj.setAnimationParams, endState);

  handler.add(nodePlayable, 0); // create the playable
};

/**
 * @override
 */
DvtChartDataChangeFunnelSlice.prototype.Init = function(peer, duration) {
  DvtChartDataChangeFunnelSlice.superclass.Init.call(this, peer, duration);

  this._animId += '/funnel';
};
/**
 * Axis related utility functions for dvt.Chart.
 * @class
 */
var DvtChartAxisUtils = new Object();

dvt.Obj.createSubclass(DvtChartAxisUtils, dvt.Obj);


/**
 * Returns the position of the x axis relative to the chart.
 * @param {dvt.Chart} chart
 * @return {string} The axis position
 */
DvtChartAxisUtils.getXAxisPosition = function(chart) {
  if (DvtChartTypeUtils.isPolar(chart))
    return 'tangential';
  if (DvtChartTypeUtils.isHorizontal(chart))
    return dvt.Agent.isRightToLeft(chart.getCtx()) ? 'right' : 'left';
  else
    return 'bottom';
};

/**
 * Returns the baselineScaling of the specified axis.
 * @param {DvtChartImpl} chart
 * @param {string} type The axis type: x, y, or y2
 * @return {string} The axis position
 */
DvtChartAxisUtils.getBaselineScaling = function(chart, type) {

  var axis = type + 'Axis';
  var baselineScaling = chart.getOptions()[axis]['baselineScaling'];
  if (baselineScaling && (baselineScaling == 'zero' || baselineScaling == 'min'))
    return baselineScaling;
  else if (DvtChartTypeUtils.isStock(chart))
    return 'min';
  else
    return 'zero';
};

/**
 * Returns the position of the y axis relative to the chart.
 * @param {dvt.Chart} chart
 * @return {string} The axis position
 */
DvtChartAxisUtils.getYAxisPosition = function(chart) {
  var position = chart.getOptions()['yAxis']['position'];

  if (DvtChartTypeUtils.isPolar(chart))
    return 'radial';
  else if (DvtChartTypeUtils.isHorizontal(chart)) {
    if (position && (position == 'top' || position == 'bottom'))
      return position;
    else
      return 'bottom';
  }
  else {
    if (DvtChartTypeUtils.isStock(chart))
      position = position ? position : 'end';
    if (!dvt.Agent.isRightToLeft(chart.getCtx()))
      return (position && position == 'end') ? 'right' : 'left';
    else
      return (position && position == 'end') ? 'left' : 'right';
  }
};

/**
 * Returns the position of the y2 axis relative to the chart.
 * @param {dvt.Chart} chart
 * @return {string} The axis position
 */
DvtChartAxisUtils.getY2AxisPosition = function(chart) {
  var position = chart.getOptions()['y2Axis']['position'];

  if (DvtChartTypeUtils.isHorizontal(chart)) {
    if (position && (position == 'top' || position == 'bottom'))
      return position;
    else
      return 'top';
  }
  else {
    if (!dvt.Agent.isRightToLeft(chart.getCtx()))
      return (position && position == 'start') ? 'left' : 'right';
    else
      return (position && position == 'start') ? 'right' : 'left';
  }
};


/**
 * Returns true if the chart has a time axis.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartAxisUtils.hasTimeAxis = function(chart) {
  return DvtChartTypeUtils.isBLAC(chart) && DvtChartAxisUtils.getTimeAxisType(chart) != 'disabled';
};


/**
 * Returns true if the chart has a group axis.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartAxisUtils.hasGroupAxis = function(chart) {
  return DvtChartTypeUtils.isBLAC(chart) && DvtChartAxisUtils.getTimeAxisType(chart) == 'disabled';
};

/**
 * Returns time axis type of the chart.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartAxisUtils.getTimeAxisType = function(chart) {
  var timeAxisType = chart.getOptions()['timeAxisType'];
  if (timeAxisType && timeAxisType != 'auto' && DvtChartTypeUtils.isBLAC(chart) && !DvtChartTypeUtils.isPolar(chart))
    return timeAxisType;
  if (DvtChartTypeUtils.isStock(chart))
    return 'skipGaps';
  return 'disabled';
};

/**
 * Returns if the chart contains mixed frequency data.
 * @param {dvt.Chart} chart The chart that will be rendered.
 * @return {boolean} True if chart has mixed data.
 */
DvtChartAxisUtils.isMixedFrequency = function(chart) {
  return DvtChartAxisUtils.getTimeAxisType(chart) == 'mixedFrequency';
};

/**
 * Returns the offset before and after the groups for the specified chart.
 * @param {dvt.Chart} chart
 * @return {number} The offset factor.
 */
DvtChartAxisUtils.getAxisOffset = function(chart) {
  // Use the cached value if it has been computed before
  var cacheKey = 'axisOffset';
  var axisOffset = chart.getFromCache(cacheKey);
  if (axisOffset != null)
    return axisOffset;

  var groupSeparators = chart.getOptions()['styleDefaults']['groupSeparators'];
  if (DvtChartAxisUtils.hasGroupAxis(chart) && DvtChartDataUtils.getNumLevels(chart) > 1 && groupSeparators['rendered'] == 'on') {
    // Use 0.5 offset for hierarchical group axis charts with groupSeparators, to ensure even spacing of the separators at start and end.
    axisOffset = 0.5;
  }
  else if (DvtChartTypeUtils.hasBarSeries(chart) || DvtChartTypeUtils.hasCenteredSeries(chart) || DvtChartTypeUtils.hasCandlestickSeries(chart) || (DvtChartTypeUtils.isBLAC(chart) && DvtChartDataUtils.getGroupCount(chart) == 1)) {
    // Use the offset for any chart with bars or centered lines/areas, or for single point line/area chart
    axisOffset = 0.5;
  }
  else if (DvtChartDefaults.isPostAltaSkin(chart) && !DvtChartTypeUtils.isSpark(chart) && !DvtChartEventUtils.isScrollable(chart) && !DvtChartTypeUtils.isOverview(chart)) {
    // Also add offset for line/area charts for post-alta skins
    var maxOffset = DvtChartTypeUtils.isHorizontal(chart) ? 0.2 : 0.5;
    axisOffset = maxOffset - (maxOffset / Math.sqrt(DvtChartDataUtils.getGroupCount(chart)));
  }
  else {
    // Otherwise no offset
    axisOffset = 0;
  }

  chart.putToCache(cacheKey, axisOffset);
  return axisOffset;
};

/**
 * Returns whether the grid lines should be shifted by 1/2, so that the grid lines are drawn between labels, instead of
 * at labels. True if all the series are either bars or centeredSegmented/centeredStepped lines/areas.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartAxisUtils.isGridShifted = function(chart) {
  if (!DvtChartTypeUtils.isBLAC(chart))
    return false;

  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  for (var i = 0; i < seriesCount; i++) {
    // Ignore the series if it isn't rendered
    if (!DvtChartStyleUtils.isSeriesRendered(chart, i))
      continue;
    var seriesType = DvtChartStyleUtils.getSeriesType(chart, i);
    var lineType = DvtChartStyleUtils.getLineType(chart, i);
    if (seriesType != 'bar' && lineType != 'centeredSegmented' && lineType != 'centeredStepped')
      return false;
  }

  return true;
};

/**
 * Returns whether the polar chart gridlines are polygonal.
 * @param {DvtChartImp} chart
 * @return {boolean}
 */
DvtChartAxisUtils.isGridPolygonal = function(chart) {
  if (!DvtChartTypeUtils.isBLAC(chart) || DvtChartTypeUtils.hasBarSeries(chart))
    return false;
  return chart.getOptions()['polarGridShape'] == 'polygon';
};

/**
 * Returns whether an axis is rendered (only tick labels and axis title are considered parts of the axis).
 * @param {dvt.Chart} chart
 * @param {string} type The axis type: x, y, or y2.
 * @return {boolean} True if the axis is rendered.
 */
DvtChartAxisUtils.isAxisRendered = function(chart, type) {
  // For y/y2, evaluate if there's any series assigned to them
  if (type == 'y' && DvtChartTypeUtils.hasY2DataOnly(chart))
    return false;
  if (type == 'y2' && !DvtChartTypeUtils.hasY2Data(chart))
    return false;

  // Check the chart options
  var options = chart.getOptions();
  var axisOptions = options[type + 'Axis'];
  if (axisOptions['rendered'] == 'off')
    return false;
  if (axisOptions['tickLabel']['rendered'] == 'off' && !axisOptions['title'])
    return false;

  return true;
};

/**
 * Returns true if the axis line for the specified axis is to be rendered.
 * @param {dvt.Chart} chart
 * @param {string} type The axis type: x, y, or y2.
 * @return {boolean}
 */
DvtChartAxisUtils.isAxisLineRendered = function(chart, type) {
  var axisOptions = chart.getOptions()[type + 'Axis'];
  if (axisOptions['rendered'] == 'off' || axisOptions['axisLine']['rendered'] == 'off')
    return false;
  else if (axisOptions['axisLine']['rendered'] == 'auto' && type != 'x' &&
           DvtChartTypeUtils.isBLAC(chart) && !DvtChartTypeUtils.isPolar(chart))
    return false; // yAxis lines not rendered for blac cartesian with axisLine.rendered="auto"
  else
    return true;
};

/**
 * Returns true if the major tick for the specified axis is to be rendered.
 * @param {dvt.Chart} chart
 * @param {string} type The axis type: x, y, or y2.
 * @return {boolean}
 */
DvtChartAxisUtils.isMajorTickRendered = function(chart, type) {
  var axisOptions = chart.getOptions()[type + 'Axis'];
  if (axisOptions['rendered'] == 'off' || axisOptions['majorTick']['rendered'] == 'off')
    return false;
  else if (axisOptions['majorTick']['rendered'] == 'auto' && type == 'x' &&
           DvtChartTypeUtils.isBLAC(chart) && !DvtChartTypeUtils.isPolar(chart))
    return false; // xAxis ticks not rendered for blac cartesian with axisLine.rendered="auto"
  else
    return true;
};

/**
 * Returns true if the minor tick for the specified axis is to be rendered.
 * @param {dvt.Chart} chart
 * @param {string} type The axis type: x, y, or y2.
 * @return {boolean}
 */
DvtChartAxisUtils.isMinorTickRendered = function(chart, type) {
  var axisOptions = chart.getOptions()[type + 'Axis'];
  if (axisOptions['rendered'] == 'off' || axisOptions['minorTick']['rendered'] == 'off')
    return false;
  else if (axisOptions['minorTick']['rendered'] == 'on')
    return true;
  else
    return DvtChartAxisUtils.isLog(chart, type);
};

/**
 * Returns true if the axis scale is logarithmic.
 * @param {dvt.Chart} chart
 * @param {string} type The axis type: x, y, or y2.
 * @return {boolean}
 */
DvtChartAxisUtils.isLog = function(chart, type) {
  var axisOptions = chart.getOptions()[type + 'Axis'];
  var minMax = DvtChartDataUtils.getMinMaxValue(chart, type, true);
  return axisOptions['scale'] == 'log' && minMax['min'] > 0 && minMax['max'] > 0;
};


/**
 * Returns the height of the axis tick label
 * @param {dvt.Chart} chart
 * @param {string} type The axis type: x, y, or y2
 * @return {number} Height in px
 */
DvtChartAxisUtils.getTickLabelHeight = function(chart, type) {
  var options = chart.getOptions();
  var axisOptions = options[type + 'Axis'];

  // Manually construct the tick label style
  var tickLabelStyle = axisOptions['tickLabel']['style'];
  if (!(tickLabelStyle instanceof dvt.CSSStyle))
    tickLabelStyle = new dvt.CSSStyle(tickLabelStyle);
  tickLabelStyle.mergeUnder(dvt.Axis.getDefaults(options['skin'])['tickLabel']['style']); // merge with the default

  return dvt.TextUtils.getTextStringHeight(chart.getCtx(), tickLabelStyle);
};


/**
 * Returns the tick label gap size for the axis.
 * @param {dvt.Chart} chart
 * @param {string} type The type of the axis: x, y, or y2.
 * @return {number} Gap size.
 */
DvtChartAxisUtils.getTickLabelGapSize = function(chart, type) {
  if (DvtChartAxisUtils.isTickLabelInside(chart, type))
    return 0;

  var options = chart.getOptions();
  var isHoriz = DvtChartTypeUtils.isHorizontal(chart);

  var scalingFactor = DvtChartAxisUtils.getGapScalingFactor(chart, type);
  var gapWidth = Math.ceil(options['layout']['tickLabelGapWidth'] * scalingFactor);
  var gapHeight = Math.ceil(options['layout']['tickLabelGapHeight'] * scalingFactor);

  if (type == 'x')
    return isHoriz ? gapWidth : gapHeight;
  else
    return isHoriz ? gapHeight : gapWidth;
};


/**
 * Returns the scaling factor for a gap based on the axis tick label font size.
 * @param {dvt.Chart} chart
 * @param {string} type The type of the axis: x, y, or y2.
 * @return {number} Scaling factor.
 */
DvtChartAxisUtils.getGapScalingFactor = function(chart, type) {
  if (DvtChartAxisUtils.isAxisRendered(chart, type))
    return DvtChartAxisUtils.getTickLabelHeight(chart, type) / 14; // 14px is the default label height, assuming 11px font size
  else
    return 0;
};


/**
 * Returns the position of the axis tick label is inside the plot area.
 * @param {dvt.Chart} chart
 * @param {string} type The type of the axis: x, y, or y2.
 * @return {boolean}
 */
DvtChartAxisUtils.isTickLabelInside = function(chart, type) {
  if (DvtChartTypeUtils.isPolar(chart) || DvtChartTypeUtils.isScatterBubble(chart) || (DvtChartTypeUtils.isBLAC(chart) && type == 'x'))
    return false;

  return chart.getOptions()[type + 'Axis']['tickLabel']['position'] == 'inside';
};


/**
 * Returns the viewport min/max of the x-axis. If viewportMin/Max is not defined, it assumes viewportStart/EndGroup to
 * be the viewport min/max.
 * @param {dvt.Chart} chart
 * @param {boolean} useGlobal Whether the method returns the global min/max if the viewport min/max is defined.
 * @return {object} An object containing min and max.
 */
DvtChartAxisUtils.getXAxisViewportMinMax = function(chart, useGlobal) {
  var options = chart.getOptions()['xAxis'];
  var isGroupAxis = DvtChartAxisUtils.hasGroupAxis(chart);
  var groupOffset = DvtChartAxisUtils.getAxisOffset(chart);

  if (useGlobal)
    var globalMinMax = DvtChartAxisUtils.getXAxisGlobalMinMax(chart);

  var min = null;
  if (options['viewportMin'] != null)
    min = options['viewportMin'];
  else if (options['viewportStartGroup'] != null)
    min = isGroupAxis ? DvtChartDataUtils.getGroupIndex(chart, options['viewportStartGroup']) - groupOffset : options['viewportStartGroup'];
  else if (useGlobal) {
    min = globalMinMax['min'];
  }

  var max = null;
  if (options['viewportMax'] != null)
    max = options['viewportMax'];
  else if (options['viewportEndGroup'] != null)
    max = isGroupAxis ? DvtChartDataUtils.getGroupIndex(chart, options['viewportEndGroup']) + groupOffset : options['viewportEndGroup'];
  else if (useGlobal) {
    max = globalMinMax['max'];
  }

  return {'min': min, 'max': max};
};

/**
 * Returns the global min/max of the x-axis.
 * @param {dvt.Chart} chart
 * @return {object} An object containing min and max.
 */
DvtChartAxisUtils.getXAxisGlobalMinMax = function(chart) {
  var options = chart.getOptions()['xAxis'];
  var isGroupAxis = DvtChartAxisUtils.hasGroupAxis(chart);
  var groupOffset = DvtChartAxisUtils.getAxisOffset(chart);

  if (!isGroupAxis)
    var minMax = DvtChartDataUtils.getMinMaxValue(chart, 'x');

  var min = null;
  if (options['min'] != null)
    min = options['min'];
  else if (isGroupAxis)
    min = 0 - groupOffset;
  else
    min = minMax['min'];

  var max = null;
  if (options['max'] != null)
    max = options['max'];
  else if (isGroupAxis)
    max = DvtChartDataUtils.getGroupCount(chart) - 1 + groupOffset;
  else
    max = minMax['max'];

  return {'min': min, 'max': max};
};


/**
 * Applies the chart initial zooming by updating the viewportMin/Max in the options object.
 * @param {dvt.Chart} chart
 * @param {dvt.Rectangle} availSpace The available axis space, to determine the amount of initial zooming.
 */
DvtChartAxisUtils.applyInitialZooming = function(chart, availSpace) {
  var options = chart.getOptions();
  var axisOptions = options['xAxis'];
  var initialZooming = options['initialZooming'];
  if (!DvtChartTypeUtils.isBLAC(chart) || options['zoomAndScroll'] == 'off' || initialZooming == 'none')
    return;

  // If the chart has been initially zoomed before, but is rerendered with the same options (possibly resized), the
  // initial zooming level has the be recomputed.
  if (options['_initialZoomed']) {
    if (initialZooming == 'last')
      axisOptions['viewportMin'] = null;
    else // initialZooming = first
      axisOptions['viewportMax'] = null;
  }

  var viewportMinMax = DvtChartAxisUtils.getXAxisViewportMinMax(chart, false);
  var viewportMin = viewportMinMax['min'];
  var viewportMax = viewportMinMax['max'];
  if ((initialZooming == 'last' && viewportMin != null) || (initialZooming == 'first' && viewportMax != null))
    return;

  var axisWidth = DvtChartTypeUtils.isHorizontal(chart) ? availSpace.h : availSpace.w; // estimated
  var maxNumGroups = Math.floor(axisWidth / (2 * DvtChartAxisUtils.getTickLabelHeight(chart, 'x'))) + DvtChartAxisUtils.getAxisOffset(chart);
  var numGroups = DvtChartDataUtils.getGroupCount(chart) - 1; // -1 because we count the number of group gaps
  if (numGroups <= maxNumGroups)
    return;

  var globalMin, globalMax;
  if (DvtChartAxisUtils.hasGroupAxis(chart)) {
    globalMin = 0;
    globalMax = numGroups; // numGroups is already subtracted by 1!
  }
  else {
    var globalMinMax = DvtChartDataUtils.getMinMaxValue(chart, 'x');
    globalMin = globalMinMax['min'];
    globalMax = globalMinMax['max'];
  }
  var maxViewportSize = (maxNumGroups / numGroups) * (globalMax - globalMin);

  if (options['initialZooming'] == 'last') {
    if (viewportMax == null)
      viewportMax = globalMax;
    axisOptions['viewportMin'] = Math.max(viewportMax - maxViewportSize, globalMin);
  }
  else { // initialZooming = first
    if (viewportMin == null)
      viewportMin = globalMin;
    axisOptions['viewportMax'] = Math.min(viewportMin + maxViewportSize, globalMax);
  }

  // Add flag to indicate that the viewportMin/Max is the result of initial zooming.
  options['_initialZoomed'] = true;
};


/**
 * Computes the ratios of the axis group widths (for bars with varying widths).
 * @param {dvt.Chart} chart
 * @return {Array} The array of the axis group width ratios.
 */
DvtChartAxisUtils.getGroupWidthRatios = function(chart) {
  if (!DvtChartTypeUtils.hasBarSeries(chart) && !DvtChartTypeUtils.hasCandlestickSeries(chart))
    return null;

  var options = chart.getOptions();
  var barGapRatio = DvtChartStyleUtils.getBarGapRatio(chart);

  if (barGapRatio >= 1) {
    options['_averageGroupZ'] = Infinity; // so that all bars have zero width
    return null;
  }

  options['_averageGroupZ'] = 0; // reset the value

  // Compute the total z-values of the bars occupying each group
  var numGroups = DvtChartDataUtils.getGroupCount(chart);
  var isSplitDualY = DvtChartTypeUtils.isSplitDualY(chart);
  var categories = DvtChartDataUtils.getStackCategories(chart, 'bar');
  var hasVaryingWidth = chart.getOptionsCache()['_hasVaryingBarWidth'];
  var barWidths = [], barWidth;
  var yWidth, y2Width, i;
  for (var g = 0; g < numGroups; g++) {
    yWidth = 0;
    y2Width = 0;
    if (hasVaryingWidth) {
      for (i = 0; i < categories['y'].length; i++)
        yWidth += DvtChartDataUtils.getBarCategoryZ(chart, categories['y'][i], g, false);

      for (i = 0; i < categories['y2'].length; i++)
        y2Width += DvtChartDataUtils.getBarCategoryZ(chart, categories['y2'][i], g, true);
    }
    else {
      yWidth = categories['y'].length;
      y2Width = categories['y2'].length;
    }

    barWidths.push(isSplitDualY ? Math.max(yWidth, y2Width) : yWidth + y2Width);
  }

  var barWidthSum = dvt.ArrayUtils.reduce(barWidths, function(prev, cur) {
    return prev + cur;
  });

  // The gap size is the same for all groups, regardless of the bar width.
  var gapWidthSum = barWidthSum * barGapRatio / (1 - barGapRatio);
  var groupWidths = dvt.ArrayUtils.map(barWidths, function(barWidth) {
    // divide the gaps evenly
    return barWidth + gapWidthSum / numGroups;
  });

  // Store the average z-value. This is useful because when we call groupAxisInfo.getGroupWidth(), it returns the average
  // group width. Thus, we can convert z-value to pixels using (zValue / averageGroupZ * groupAxisInfo.getGroupWidth()).
  options['_averageGroupZ'] = (barWidthSum + gapWidthSum) / numGroups;

  return groupWidths;
};

/**
 * Returns true if the y axis needs to be adjust to account for data labels.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartAxisUtils.isYAdjustmentNeeded = function(chart) {
  var dataLabelPosition = chart.getOptions()['styleDefaults']['dataLabelPosition'];
  var isStackLabelRendered = DvtChartStyleUtils.isStackLabelRendered(chart);
  if (DvtChartTypeUtils.hasBarSeries(chart) && (dataLabelPosition == 'outsideBarEdge' || isStackLabelRendered)) {
    return true;
  }
  return false;
};
/**
 * Data related utility functions for dvt.Chart.
 * @class
 */
var DvtChartDataUtils = new Object();

dvt.Obj.createSubclass(DvtChartDataUtils, dvt.Obj);


/**
 * Returns true if the specified chart has data.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartDataUtils.hasData = function(chart) {
  var options = chart.getOptions();

  // Check that there is a data object with at least one series
  if (!options || !options['series'] || options['series'].length < 1)
    return false;

  // Check that the minimum number of data points is present
  var minDataCount = 1;
  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  for (var i = 0; i < seriesCount; i++) {
    var seriesItem = DvtChartDataUtils.getSeriesItem(chart, i);
    if (seriesItem && seriesItem['items'] && seriesItem['items'].length >= minDataCount)
      return true;
  }

  return false;
};

/**
 * Returns true if the specified chart doesn't have valid data.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartDataUtils.hasInvalidData = function(chart) {
  return (!DvtChartDataUtils.hasData(chart) || DvtChartDataUtils.hasInvalidTimeData(chart));
};

/**
 * Returns true if the specified chart has a timeAxis without valid numerical values.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartDataUtils.hasInvalidTimeData = function(chart) {
  if (DvtChartTypeUtils.isFunnel(chart) || DvtChartTypeUtils.isPie(chart))
    return false;

  var options = chart.getOptions();
  var groupCount = DvtChartDataUtils.getGroupCount(chart);

  // Check that there is a data object with at least one series
  if (!options || !options['series'] || options['series'].length < 1)
    return true;
  // Check that there is a data object with at least one group
  if (groupCount < 1)
    return true;

  var seriesIndex, groupIndex;
  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);

  if (DvtChartAxisUtils.isMixedFrequency(chart)) {
    // Mixed frequency time axis uses x values to specify the dates
    for (seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
      for (groupIndex = 0; groupIndex < groupCount; groupIndex++) {
        var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
        if (dataItem && (dataItem['x'] == null || isNaN(dataItem['x']))) //Invalid values will either be NaN or null depending on the browser
          return true;
      }
    }
  }
  else if (DvtChartAxisUtils.hasTimeAxis(chart)) {
    // Check that all values are numbers
    for (groupIndex = 0; groupIndex < groupCount; groupIndex++) {
      var groupItem = DvtChartDataUtils.getGroup(chart, groupIndex);
      if (groupItem == null || isNaN(groupItem))
        return true;
    }
  }

  return false;
};


/**
 * Returns true if the specified chart series has non-null data.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {boolean}
 */
DvtChartDataUtils.hasSeriesData = function(chart, seriesIndex) {
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  var dataItems = seriesItem['items'];
  if (dataItems) {
    for (var i = 0; i < dataItems.length; i++) {
      if (dataItems[i] != null)
        return true;
    }
  }

  // No data items or no non-null data items
  return false;
};

/**
 * Processes the data object.  Generates default group labels if none or
 * not enough have been specified.
 * @param {dvt.Chart} chart
 */
DvtChartDataUtils.processDataObject = function(chart) {
  // If no data or unusable data, return
  if (!DvtChartDataUtils.hasData(chart))
    return;

  var options = chart.getOptions();
  var optionsCache = chart.getOptionsCache();
  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);

  // If chart type invalid, set to bar.
  if (!DvtChartTypeUtils.isValidType(chart))
    options['type'] = 'bar';

  // Stock Chart Overrides
  var isStock = DvtChartTypeUtils.isStock(chart);
  if (isStock) {
    optionsCache['_hasVolume'] = false;

    // Only a single series is supported currently
    if (seriesCount > 1) {
      options['series'] = options['series'].slice(0, 1);
      seriesCount = 1;
    }
  }

  var isBLAC = DvtChartTypeUtils.isBLAC(chart);
  optionsCache['_hasVaryingBarWidth'] = false;
  optionsCache['dataMarkerSizeSet'] = false;
  optionsCache['dataMarkerDisplayedSet'] = false;
  var isMixedFrequency = DvtChartAxisUtils.isMixedFrequency(chart);
  var hasLargeSeriesCount = seriesCount > 100;
  optionsCache['hasLargeSeriesCount'] = hasLargeSeriesCount;

  // Iterate through the series to keep track of the count and the series style indices
  var maxGroups = 0;
  var arSeriesStyle = chart.getSeriesStyleArray();
  for (var i = 0; i < seriesCount; i++) {
    var series = DvtChartDataUtils.getSeries(chart, i);
    if (!hasLargeSeriesCount && series != null && dvt.ArrayUtils.getIndex(arSeriesStyle, series) < 0)
      arSeriesStyle.push(series);

    var seriesItem = DvtChartDataUtils.getSeriesItem(chart, i);
    if (seriesItem && seriesItem['items'] && seriesItem['items'].length > maxGroups)
      maxGroups = seriesItem['items'].length;

    if (seriesItem['visibility'] == 'hidden') {
      var hiddenCategories = DvtChartStyleUtils.getHiddenCategories(chart);
      if (dvt.ArrayUtils.getIndex(hiddenCategories, series) < 0)
        hiddenCategories.push(series);
    }
    seriesItem['visibility'] = null;

    //  - SANITIZE CHART OPTIONS OBJECT
    if (seriesItem && seriesItem['items']) {
      var items = seriesItem['items'];
      var item;
      for (var j = 0; j < items.length; j++) {
        if (items[j]) {
          item = items[j];
          if (typeof(item) != 'object') {
            item = Number(item);
          } else {
            if (!isMixedFrequency && item['x'])
              item['x'] = Number(item['x']);

            if (item['y'])
              item['y'] = Number(item['y']);

            if (item['z']) {
              item['z'] = Number(item['z']);
              if (isBLAC && item['z'] != 1)
                optionsCache['_hasVaryingBarWidth'] = true;
            }

            if (item['value'])
              item['value'] = Number(item['value']);

            if (item['targetValue'])
              item['targetValue'] = Number(item['targetValue']);

            if (item['open'])
              item['open'] = Number(item['open']);

            if (item['close'])
              item['close'] = Number(item['close']);

            if (item['low'])
              item['low'] = Number(item['low']);

            if (item['high'])
              item['high'] = Number(item['high']);

            if (item['volume']) {
              item['volume'] = Number(item['volume']);
              optionsCache['_hasVolume'] = true;
            }
            if (item['markerSize'])
              optionsCache['dataMarkerSizeSet'] = true;

            if (item['markerDisplayed'])
              optionsCache['dataMarkerDisplayedSet'] = true;
          }
          items[j] = item;
        }
      }
    }
  }

  // Add Volume Series
  if (isStock && DvtChartDataUtils.hasVolumeSeries(chart) && !DvtChartTypeUtils.isOverview(chart)) {
    var volumeSeries = dvt.JsonUtils.clone(DvtChartDataUtils.getSeriesItem(chart, 0));
    volumeSeries['assignedToY2'] = 'on';
    volumeSeries['type'] = 'bar';
    volumeSeries['categories'] = DvtChartDataUtils.getSeriesCategories(chart, 0);
    volumeSeries['id'] = '_volume';
    volumeSeries['_selectable'] = 'off';
    volumeSeries['items'] = [];
    for (var itemIndex = 0; itemIndex < seriesItem['items'].length; itemIndex++) {
      var volumeItem = {};
      volumeItem['color'] = DvtChartStyleUtils.getStockVolumeColor(chart, 0, itemIndex);
      volumeItem['x'] = seriesItem['items'][itemIndex]['x'];
      volumeItem['value'] = seriesItem['items'][itemIndex]['volume'];
      volumeSeries['items'].push(volumeItem);
    }

    options['series'].push(volumeSeries);
  }

  // Reference Objects
  var refObjs = DvtChartRefObjUtils.getRefObjs(chart);
  for (var i = 0; i < refObjs.length; i++) {
    var items = refObjs[i]['items'];
    if (!items)
      continue;
    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      if (!item)
        continue;
      if (typeof(item) != 'object') {
        items[j] = Number(item);
      } else {
        if (!DvtChartAxisUtils.isMixedFrequency(chart) && item['x']) {
          item['x'] = Number(item['x']);
        }
        if (item['max']) {
          item['max'] = Number(item['max']);
        }
        if (item['min']) {
          item['min'] = Number(item['min']);
        }
        if (item['value']) {
          item['value'] = Number(item['value']);
        }
      }
    }
  }

  // Make sure the data object specifies enough groups
  if (!options['groups'])
    options['groups'] = new Array();

  // Lengthen the array so that there are enough groups
  var groupCount = DvtChartDataUtils.getGroupCount(chart);
  for (var i = 0; i < (maxGroups - groupCount); i++) {
    var group = dvt.Bundle.getTranslation(options, 'labelDefaultGroupName', dvt.Bundle.CHART_PREFIX, 'DEFAULT_GROUP_NAME', options['groups'].length + 1);// +1 so we start at "Group 1"
    options['groups'].push(group);
  }
  chart.putToCache('groupsArray', null);

  // Time Axis: Support date strings provided in the JSON
  DvtChartDataUtils._processTimeAxis(chart);

  // Sorting: Sort the groups based on their values if sorting is turned on
  var sorting = options['sorting'];
  sorting = (sorting == 'on') ? 'descending' : (sorting != 'ascending' && sorting != 'descending') ? 'off' : sorting;
  if (DvtChartTypeUtils.isBLAC(chart) && DvtChartAxisUtils.hasGroupAxis(chart) && sorting != 'off' && DvtChartDataUtils.getNumLevels(chart) == 1) {
    // Find all the group totals
    var groups = DvtChartDataUtils.getGroups(chart);

    var totalsMap = {};
    for (var j = 0; j < groups.length; j++) {
      var total = 0;
      for (var i = 0; i <= seriesCount; i++) {
        // Only count rendered series that are assigned to Y1
        if (DvtChartStyleUtils.isSeriesRendered(chart, i) && !DvtChartDataUtils.isAssignedToY2(chart, i)) {
          // Add up all the values for items in the group.  Null values are treated as 0.
          var value = DvtChartDataUtils.getValue(chart, i, j);
          total += ((value == null || isNaN(value)) ? 0 : value);
        }
      }
      totalsMap[groups[j]] = {'index': j, 'total': total, 'group': options['groups'][j]};
    }
    // Sort the groups list
    if (sorting == 'ascending')
      groups.sort(function(a, b) { return totalsMap[a]['total'] - totalsMap[b]['total']; });
    else
      groups.sort(function(a, b) { return totalsMap[b]['total'] - totalsMap[a]['total']; });

    // Sort the series items based on the groups order.
    for (var i = 0; i < seriesCount; i++) {
      var seriesItems = [];
      for (var j = 0; j < groups.length; j++) {
        seriesItems.push(DvtChartDataUtils.getDataItem(chart, i, totalsMap[groups[j]]['index']));
      }
      options['series'][i]['items'] = seriesItems;
    }

    var groupItems = [];
    for (var j = 0; j < groups.length; j++)
      groupItems.push(totalsMap[groups[j]]['group']);

    options['groups'] = groupItems;

    // Clear the cache because the data item ordering has been changed
    chart.clearCache();
  }

  // Don't allow axis extents where the min and max are the same
  DvtChartDataUtils._sanitizeAxis(options['xAxis']);
  DvtChartDataUtils._sanitizeAxis(options['yAxis']);
  DvtChartDataUtils._sanitizeAxis(options['y2Axis']);
};

/**
 * Sanitizes the options for a chart axis. Currently just ensures that equal min/max are not passed in.
 * @param {object} axisOptions
 * @private
 */
DvtChartDataUtils._sanitizeAxis = function(axisOptions) {
  if (axisOptions['min'] == axisOptions['max']) {
    axisOptions['min'] = null;
    axisOptions['max'] = null;
  }
};

/**
 * Process the dateTime object and returns as a number. Valid inputs include number of milliseconds, an iso string, or
 * a string that can be processed by Date.parse().
 * @param {dvt.Context} context
 * @param {object} dateTime
 * @return {number}
 * @private
 */
DvtChartDataUtils._sanitizeDateTime = function(context, dateTime) {
  var ret = null;

  // First try the converter if available
  var isoToDateConverter = context.getLocaleHelpers['isoToDateConverter'];
  if (isoToDateConverter) {
    // Enclose in a try/catch because the converter will throw an exception if the string is not in iso format
    try {
      ret = isoToDateConverter(dateTime);
    }
    catch (err) {
      ret = null;
    }

    // Convert to number
    if (ret != null)
      ret = ret.getTime();
  }

  // Try Date.parse next. It will return NaN for invalid inputs.
  if (ret == null)
    ret = Date.parse(dateTime);

  // Finally try casting to number.
  if (isNaN(ret))
    ret = Number(dateTime);

  return ret;
};

/**
 * Processes the options object for time axis.
 * @param {dvt.Chart} chart
 * @private
 */
DvtChartDataUtils._processTimeAxis = function(chart) {
  var context = chart.getCtx();
  var options = chart.getOptions();
  var seriesIndex, groupIndex;
  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  var groupCount = DvtChartDataUtils.getGroupCount(chart);

  // Sanitize values specific to mixed frequency or regular time axis
  if (DvtChartAxisUtils.isMixedFrequency(chart)) {
    // Mixed frequency time axis uses x values to specify the dates
    for (seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
      for (groupIndex = 0; groupIndex < groupCount; groupIndex++) {
        var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
        if (dataItem != null && typeof(dataItem['x']) == 'string') {
          if (dataItem['x'] != null)
            dataItem['x'] = DvtChartDataUtils._sanitizeDateTime(context, dataItem['x']);
        }
      }
    }
  }
  else if (DvtChartAxisUtils.hasTimeAxis(chart)) {
    // Regular time axis specify the dates in the groups array
    for (groupIndex = 0; groupIndex < groupCount; groupIndex++) {
      var group = DvtChartDataUtils.getGroup(chart, groupIndex);
      if (group != null)
        options['groups'][groupIndex] = DvtChartDataUtils._sanitizeDateTime(context, group);
    }
    chart.putToCache('groupsArray', null);
  }

  // Sanitize values that apply for all time axes
  if (DvtChartAxisUtils.hasTimeAxis(chart)) {
    // X-Axis Attributes
    var xOptions = options['xAxis'];
    if (xOptions['dataMin'] != null)
      xOptions['dataMin'] = DvtChartDataUtils._sanitizeDateTime(context, xOptions['dataMin']);

    if (xOptions['dataMax'] != null)
      xOptions['dataMax'] = DvtChartDataUtils._sanitizeDateTime(context, xOptions['dataMax']);

    if (xOptions['min'] != null)
      xOptions['min'] = DvtChartDataUtils._sanitizeDateTime(context, xOptions['min']);

    if (xOptions['max'] != null)
      xOptions['max'] = DvtChartDataUtils._sanitizeDateTime(context, xOptions['max']);

    if (xOptions['viewportMin'] != null)
      xOptions['viewportMin'] = DvtChartDataUtils._sanitizeDateTime(context, xOptions['viewportMin']);

    if (xOptions['viewportMax'] != null)
      xOptions['viewportMax'] = DvtChartDataUtils._sanitizeDateTime(context, xOptions['viewportMax']);

    if (xOptions['viewportStartGroup'] != null)
      xOptions['viewportStartGroup'] = DvtChartDataUtils._sanitizeDateTime(context, xOptions['viewportStartGroup']);

    if (xOptions['viewportEndGroup'] != null)
      xOptions['viewportEndGroup'] = DvtChartDataUtils._sanitizeDateTime(context, xOptions['viewportEndGroup']);

    // Reference Object X Values
    var refObjs = DvtChartRefObjUtils.getRefObjs(chart);
    for (var i = 0; i < refObjs.length; i++) {
      var items = refObjs[i]['items'];
      if (!items)
        continue;
      for (var j = 0; j < items.length; j++) {
        if (items[j]['x'] != null)
          items[j]['x'] = DvtChartDataUtils._sanitizeDateTime(context, items[j]['x']);
      }
    }
  }
};

/**
 * Returns the number of series in the specified chart.
 * @param {dvt.Chart} chart
 * @return {number}
 */
DvtChartDataUtils.getSeriesCount = function(chart) {
  return chart.getOptions()['series'].length;
};

/**
 * Returns the number of rendered y2 series in the specified chart. If type is specified returns the number of y2 series of that type.
 * @param {dvt.Chart} chart
 * @param {String} type (optional)
 * @param {Boolean} bIncludeHiddenSeries (optional) Whether or not to include hidden y2 series in the total, defaults to false.
 * @return {number}
 */
DvtChartDataUtils.getY2SeriesCount = function(chart, type, bIncludeHiddenSeries) {
  var y2SeriesCount = 0;
  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
    if (type && DvtChartStyleUtils.getSeriesType(chart, seriesIndex) != type)
      continue;
    if (!bIncludeHiddenSeries && !DvtChartStyleUtils.isSeriesRendered(chart, seriesIndex))
      continue;
    if (DvtChartDataUtils.isAssignedToY2(chart, seriesIndex))
      y2SeriesCount++;
  }
  return y2SeriesCount;
};

/**
 * Returns the id for the specified series.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {string} The id of the series.
 */
DvtChartDataUtils.getSeries = function(chart, seriesIndex) {
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  if (seriesItem) {
    if (seriesItem['id'])
      return seriesItem['id'];
    else if (seriesItem['name'] || seriesItem['name'] == '')
      return seriesItem['name'];
    else
      return String(seriesIndex);
  }
  else
    return null;
};


/**
 * Returns the label for the specified series.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {string} The label for the series.
 */
DvtChartDataUtils.getSeriesLabel = function(chart, seriesIndex) {
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  if (seriesItem && (seriesItem['name'] || seriesItem['name'] == ''))
    return seriesItem['name'];
  else
    return null;
};


/**
 * Returns the index for the specified series.
 * @param {dvt.Chart} chart
 * @param {string} series The id of the series
 * @return {number} The index of the series.
 */
DvtChartDataUtils.getSeriesIndex = function(chart, series) {
  var numSeries = DvtChartDataUtils.getSeriesCount(chart);
  for (var seriesIndex = 0; seriesIndex < numSeries; seriesIndex++) {
    var seriesId = DvtChartDataUtils.getSeries(chart, seriesIndex);
    if (seriesId == series)
      return seriesIndex;
  }

  // No match found
  return - 1;
};


/**
 * Returns the style index for the specified series.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {number} The index to use when looking for style information.
 */
DvtChartDataUtils.getSeriesStyleIndex = function(chart, seriesIndex) {
  if (chart.getOptionsCache()['hasLargeSeriesCount'])
    return seriesIndex;
  else {
    var series = DvtChartDataUtils.getSeries(chart, seriesIndex);
    return series ? dvt.ArrayUtils.getIndex(chart.getSeriesStyleArray(), series) : seriesIndex;
  }
};


/**
 * Returns the series item for the specified index.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {object} The series data item.
 */
DvtChartDataUtils.getSeriesItem = function(chart, seriesIndex) {
  if (isNaN(seriesIndex) || seriesIndex == null)
    return null;

  var options = chart.getOptions();
  if (options['series'] && options['series'].length > seriesIndex)
    return options['series'][seriesIndex];
};


/**
 * Returns the data item for the specified index.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {object} The data item.
 */
DvtChartDataUtils.getDataItem = function(chart, seriesIndex, groupIndex) {
  if (isNaN(groupIndex) || groupIndex == null || groupIndex < 0)
    return null;

  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  if (seriesItem && seriesItem['items'] && seriesItem['items'].length > groupIndex)
    return seriesItem['items'][groupIndex];

  return null;
};


/**
 * Returns the number of groups in the specified chart.
 * @param {dvt.Chart} chart
 * @return {number}
 */
DvtChartDataUtils.getGroupCount = function(chart) {
  return DvtChartDataUtils._getGroupsArray(chart).length;
};


/**
 * Returns the group id for the specified group index.
 * @param {dvt.Chart} chart
 * @param {Number} groupIndex The group index.
 * @return {string} The group id, null if the index is invalid.
 */
DvtChartDataUtils.getGroup = function(chart, groupIndex) {
  if (groupIndex >= 0 && groupIndex < DvtChartDataUtils.getGroupCount(chart)) {
    var group = DvtChartDataUtils._getGroupsArray(chart)[groupIndex];
    if (group) {
      if (group['id'])
        return group['id'];
      else if (group['name'] || group['name'] == '')
        return group['name'];
      else
        return group;
    }
  }

  return null;
};


/**
 * Returns the index of the group with the specified id.
 * @param {dvt.Chart} chart
 * @param {string|Array} group The group whose index will be returned.
 * @return {number} The index of the group
 */
DvtChartDataUtils.getGroupIndex = function(chart, group) {
  var groups = DvtChartDataUtils.getGroups(chart);
  for (var i = 0; i < groups.length; i++) {
    if ((group instanceof Array && groups[i] instanceof Array) ? dvt.ArrayUtils.equals(group, groups[i]) : group == groups[i])
      return i;
  }
  return -1;
};


/**
 * Returns the group label for the specified group index.
 * @param {dvt.Chart} chart
 * @param {Number} groupIndex The group index.
 * @return {string} The group label, null if the index is invalid.
 */
DvtChartDataUtils.getGroupLabel = function(chart, groupIndex) {
  if (groupIndex >= 0 && groupIndex < DvtChartDataUtils.getGroupCount(chart)) {
    var group = DvtChartDataUtils._getGroupsArray(chart)[groupIndex];
    if (group) {
      if (group['name'])
        return group['name'];
      else if (group['id'] != null) // Empty or null group name allowed if id is specified
        return '';
      else
        return group;
    }
  }

  return null;
};


/**
 * Returns a list of the group ids in the chart's data.
 * @param {dvt.Chart} chart
 * @return {Array} An array of the group id's.
 */
DvtChartDataUtils.getGroups = function(chart) {
  var groupCount = DvtChartDataUtils.getGroupCount(chart);
  var groups = [];
  for (var groupIndex = 0; groupIndex < groupCount; groupIndex++) {
    groups.push(DvtChartDataUtils.getGroup(chart, groupIndex));
  }
  return groups;
};


/**
 * Returns a structure containing the ids and names associated with each innermost group item.
 * @param {dvt.Chart} chart
 * @return {Array} An array of objects containing the ids and names associated with each innermost group item.
 * @private
 */
DvtChartDataUtils._getGroupsArray = function(chart) {
  var options = chart.getOptions();
  var cacheKey = 'groupsArray';
  var groupsArray = chart.getFromCache(cacheKey);

  if (!groupsArray) {
    groupsArray = [];

    if (options['groups'])
      groupsArray = DvtChartDataUtils._getNestedGroups(options['groups'], groupsArray);

    for (var i = 0; i < groupsArray.length; i++) {
      if (groupsArray[i]['id'].length == 1) {
        groupsArray[i]['id'] = groupsArray[i]['id'][0];
        groupsArray[i]['name'] = groupsArray[i]['name'][0];
      }
    }

    chart.putToCache(cacheKey, groupsArray);
  }

  return groupsArray;
};


/**
 * Returns a structure containing the ids and names associated with each innermost group item.
 * @param {Array} groups An array of chart groups
 * @param {Array} groupsArray The array of objects associated with each group item
 * @return {Array} An array of objects containing the ids and names associated with each innermost group item.
 * @private
 */
DvtChartDataUtils._getNestedGroups = function(groups, groupsArray) {
  if (!groups)
    return;

  for (var i = 0; i < groups.length; i++) {
    var group = groups[i];
    var elementId = null;
    var elementName = null;
    if (group != null) {
      elementId = group['id'] ? group['id'] : (group['name'] ? group['name'] : group);
      elementName = group['name'] ? group['name'] : group;
    }
    if (typeof elementId == 'object')
      elementId = null;
    if (typeof elementName == 'object')
      elementName = null;

    if (group && group['groups']) {
      var innerGroupArray = DvtChartDataUtils._getNestedGroups(group['groups'], []);
      if (!innerGroupArray)
        innerGroupArray = [{'id': [], 'name': []}];
      for (var j = 0; j < innerGroupArray.length; j++) {
        innerGroupArray[j]['id'].unshift(elementId);
        innerGroupArray[j]['name'].unshift(elementName);
      }
      groupsArray = groupsArray.concat(innerGroupArray);
    }
    else
      groupsArray.push({'id': [elementId], 'name': [elementName]});
  }
  return groupsArray;
};

/**
 * Returns the number of levels of hierarchical groups
 * @param {dvt.Chart} chart
 * @return {number} The number of label levels.
 */
DvtChartDataUtils.getNumLevels = function(chart) {
  var groupsArray = DvtChartDataUtils._getGroupsArray(chart);
  var numLevels = 0;

  for (var i = 0; i < groupsArray.length; i++) {
    var group = groupsArray[i];
    if (group && group['id']) {
      var length = dvt.ArrayUtils.isArray(group['id']) ? group['id'].length : 1;
      numLevels = Math.max(numLevels, length);
    }
  }

  return numLevels;
};


/**
 * Returns the value for the specified data item.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {number} The value of the specified data item.
 */
DvtChartDataUtils.getValue = function(chart, seriesIndex, groupIndex) {
  // Use the cached value if it has been computed before
  var cacheKey = 'value';
  var val = chart.getFromCachedMap2D(cacheKey, seriesIndex, groupIndex);
  if (val !== undefined) // anything that's defined, including null
    return val;

  val = null;
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  if (dataItem != null) {
    if (typeof(dataItem) != 'object') // Number, just return
      val = dataItem;
    else if (DvtChartTypeUtils.isStock(chart) && dataItem['close'] != null) // Use the close value for stock
      val = dataItem['close'];
    else if (dataItem['value'] != null) // Object with value property
      val = dataItem['value'];
    else if (dataItem['y'] != null) // Object with y property
      val = dataItem['y'];
  }

  // Cache the value
  chart.putToCachedMap2D(cacheKey, seriesIndex, groupIndex, val);
  return val;
};

/**
 * Returns the cumulative value for the specified data item, taking into account stacked values.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {boolean} bIncludeHiddenSeries True if hidden series should be included in the value calculation.
 * @return {number} The value of the specified data item.
 */
DvtChartDataUtils.getCumulativeValue = function(chart, seriesIndex, groupIndex, bIncludeHiddenSeries) {
  // Use the cached value if it has been computed before
  var cacheKey = bIncludeHiddenSeries ? 'cumValueH' : 'cumValue';
  var cumVal = chart.getFromCachedMap2D(cacheKey, seriesIndex, groupIndex);
  if (cumVal !== undefined) // anything that's defined, including null
    return cumVal;

  if (DvtChartTypeUtils.isStacked(chart)) {
    // Match the series type and add up the values
    var seriesType = DvtChartStyleUtils.getSeriesType(chart, seriesIndex);
    var bAssignedToY2 = DvtChartDataUtils.isAssignedToY2(chart, seriesIndex);
    var value = DvtChartDataUtils.getValue(chart, seriesIndex, groupIndex);

    // Determine if to add to negative stack
    // If a bar chart use item value, otherwise use the whole series
    var isNegative = (seriesType == 'bar') ? value < 0 : DvtChartDataUtils.isSeriesNegative(chart, seriesIndex);

    cumVal = 0;
    var category = DvtChartDataUtils.getStackCategory(chart, seriesIndex);
    for (var i = 0; i <= seriesIndex; i++) {
      // Skip series that are not rendered
      if (!bIncludeHiddenSeries && !DvtChartStyleUtils.isDataItemRendered(chart, i, groupIndex))
        continue;

      // Skip series that don't match the type
      if (seriesType != DvtChartStyleUtils.getSeriesType(chart, i))
        continue;

      // Skip series who aren't assigned to the same y axis
      if (bAssignedToY2 != DvtChartDataUtils.isAssignedToY2(chart, i))
        continue;

      // Add up all the values for items in the group in the same stack.  Null values are treated as 0.
      if (DvtChartDataUtils.getStackCategory(chart, i) == category) {
        var groupValue = DvtChartDataUtils.getValue(chart, i, groupIndex);

        // , only add up positive values of items if current bar being processed is positive, and vice versa.
        var isCurrentNegative = (seriesType == 'bar') ? groupValue < 0 : DvtChartDataUtils.isSeriesNegative(chart, i);
        if ((isNegative && isCurrentNegative) || (!isNegative && !isCurrentNegative))
          cumVal += ((groupValue == null || isNaN(groupValue)) ? 0 : groupValue);
      }
    }
  }
  else
    cumVal = DvtChartDataUtils.getValue(chart, seriesIndex, groupIndex);

  // Cache the value
  chart.putToCachedMap2D(cacheKey, seriesIndex, groupIndex, cumVal);
  return cumVal;
};

/**
 * Returns the low value for the specified data item.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {number} The value of the specified data item.
 */
DvtChartDataUtils.getLowValue = function(chart, seriesIndex, groupIndex) {
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  if (dataItem == null) // null or undefined, return null
    return null;
  if (DvtChartStyleUtils.getSeriesType(chart, seriesIndex) == 'candlestick') {
    if (dataItem['low'] == null && dataItem['close'] != null) {
      if (dataItem['open'] != null)
        return Math.min(dataItem['close'], dataItem['open']);
      else
        return dataItem['close'];
    }
    else
      return dataItem['low'];
  }
  if (dataItem['low'] != null && dataItem['close'] == null)
    return dataItem['low'];
  return null;
};

/**
 * Returns the high value for the specified data item.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {number} The value of the specified data item.
 */
DvtChartDataUtils.getHighValue = function(chart, seriesIndex, groupIndex) {
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  if (dataItem == null) // null or undefined, return null
    return null;
  if (DvtChartStyleUtils.getSeriesType(chart, seriesIndex) == 'candlestick') {
    if (dataItem['high'] == null) {
      if (dataItem['open'] != null)
        return Math.max(dataItem['close'], dataItem['open']);
      else
        return dataItem['close'];
    }
    else
      return dataItem['high'];
  }
  if (dataItem['high'] != null && dataItem['close'] == null)
    return dataItem['high'];
  return null;
};


/**
 * Returns the X value of a data point. For group axis, it will return the group index.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {number} The X value.
 */
DvtChartDataUtils.getXValue = function(chart, seriesIndex, groupIndex) {
  if (DvtChartAxisUtils.hasGroupAxis(chart)) {
    return groupIndex;
  }
  else {
    var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
    if (dataItem == null)
      return null;

    var xVal = dataItem['x'];
    if (xVal != null)
      return xVal;
    else
      return DvtChartDataUtils.getGroupLabel(chart, groupIndex);
  }
};


/**
 * Returns the target value for the specified data item in funnel charts.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {number} The target value of the specified data item.
 */
DvtChartDataUtils.getTargetValue = function(chart, seriesIndex) {
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, 0);
  if (dataItem == null || typeof(dataItem) != 'object')
    return null;
  else
    return dataItem['targetValue'];
};

/**
 * Returns the z value for the specified data item.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {number} defaultVal The default value if the z is not specified,
 * @return {number} The z value of the specified data item.
 */
DvtChartDataUtils.getZValue = function(chart, seriesIndex, groupIndex, defaultVal) {
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  if (dataItem == null || typeof(dataItem) != 'object')
    return defaultVal;
  if (dataItem['z'] != null) // Object with value property
    return dataItem['z'];
  return defaultVal;
};

/**
 * Returns true if the stock value is rising, false otherwise. Returns true for null or equal values.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {boolean}
 */
DvtChartDataUtils.isStockValueRising = function(chart, seriesIndex, groupIndex) {
  // Note: We return true for equality or null values, because stocks are generally shown as black for 0 or positive.
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  return dataItem ? dataItem['open'] <= dataItem['close'] : true;
};

/**
 * Returns the categories of the series item.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {string}
 */
DvtChartDataUtils.getSeriesCategories = function(chart, seriesIndex) {
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  var series = DvtChartDataUtils.getSeries(chart, seriesIndex);
  return seriesItem && seriesItem['categories'] ? seriesItem['categories'] : series ? [series] : [];
};

/**
 * Returns the categories of the series item.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {string}
 */
DvtChartDataUtils.getDataItemCategories = function(chart, seriesIndex, groupIndex) {
  // If categories array is not defined on the data item, then it will use the series categories
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  return dataItem && dataItem['categories'] ? dataItem['categories'] : DvtChartDataUtils.getSeriesCategories(chart, seriesIndex);
};

/**
 * Retuns whether the xValue is inside the viewport
 * @param {dvt.Chart} chart
 * @param {number} xVal
 * @return {boolean}
 */
DvtChartDataUtils.isXValInViewport = function(chart, xVal) {
  if (isNaN(xVal) || xVal == null)
    return false;
  else {
    var minMax = DvtChartAxisUtils.getXAxisViewportMinMax(chart, true);
    return !(minMax['min'] != null && xVal < minMax['min']) && !(minMax['max'] != null && xVal > minMax['max']);
  }
};


/**
 * Retuns whether the data point X value is inside the viewport
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {boolean}
 */
DvtChartDataUtils.isXInViewport = function(chart, seriesIndex, groupIndex) {
  // Use the cached value if it has been computed before
  var cacheKey = 'isXInViewport';
  var isXInViewport = chart.getFromCachedMap2D(cacheKey, seriesIndex, groupIndex);

  if (isXInViewport == null) {
    var xVal = DvtChartDataUtils.getXValue(chart, seriesIndex, groupIndex);
    isXInViewport = DvtChartDataUtils.isXValInViewport(chart, xVal);

    // Cache the value
    chart.putToCachedMap2D(cacheKey, seriesIndex, groupIndex, isXInViewport);
  }

  return isXInViewport;
};


/**
 * Retuns whether the referenceObject is inside the viewport
 * @param {dvt.Chart} chart
 * @param {object} items The array of reference object items
 * @param {number} index The index of the reference object in the items list
 * @return {boolean}
 */
DvtChartDataUtils.isRefObjInViewport = function(chart, items, index) {
  var xVal = DvtChartRefObjUtils.getXValue(chart, items, index);

  // Use the cached value if it has been computed before
  var cacheKey = 'isRefObjInViewport';
  var isRefObjInViewport = chart.getFromCachedMap2D(cacheKey, xVal);

  if (isRefObjInViewport == null) {
    var previousVal = DvtChartRefObjUtils.getXValue(chart, items, index - 1);
    var nextVal = DvtChartRefObjUtils.getXValue(chart, items, index + 1);

    // Reference object is said to be in the viewport if any part of its adjacent line/area segments are in the viewport
    isRefObjInViewport = DvtChartDataUtils.isXValInViewport(chart, xVal) ||
                         DvtChartDataUtils.isXValInViewport(chart, previousVal) ||
                         DvtChartDataUtils.isXValInViewport(chart, nextVal);

    // Cache the value
    chart.putToCachedMap2D(cacheKey, xVal, isRefObjInViewport);
  }

  return isRefObjInViewport;
};


/**
 * Retuns whether the data point is within the x-axis viewport. This method should only be used for BLAC charts.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {boolean}
 */
DvtChartDataUtils.isBLACItemInViewport = function(chart, seriesIndex, groupIndex) {
  if (!DvtChartStyleUtils.isDataItemRendered(chart, seriesIndex, groupIndex))
    return false;

  // For BLAC charts, we can safely assume that the data item is completely outside the viewport (not partially showing)
  // if both its x-value and the x-values of the adjacent points are outside the viewport.
  return DvtChartDataUtils.isXInViewport(chart, seriesIndex, groupIndex) ||
      DvtChartDataUtils.isXInViewport(chart, seriesIndex, groupIndex - 1) ||
      DvtChartDataUtils.isXInViewport(chart, seriesIndex, groupIndex + 1);
};


/**
 * Returns the number of groups within the viewport.
 * @param {dvt.Chart} chart
 * @return {number}
 */
DvtChartDataUtils.getViewportGroupCount = function(chart) {
  var viewportMinMax = DvtChartAxisUtils.getXAxisViewportMinMax(chart, true);
  var globalMinMax = DvtChartAxisUtils.getXAxisGlobalMinMax(chart);
  var ratio = (viewportMinMax['max'] - viewportMinMax['min']) / (globalMinMax['max'] - globalMinMax['min']);
  return isNaN(ratio) ? 1 : ratio * DvtChartDataUtils.getGroupCount(chart);
};


/**
 * Compute the Y corresponding to the X along the line from (x1,y1) to (x2,y2).
 * @param {boolean} isLog
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x
 * @return {number} The y value.
 * @private
 */
DvtChartDataUtils._computeYAlongLine = function(isLog, x1, y1, x2, y2, x) {
  if (isLog) {
    y1 = dvt.Math.log10(y1);
    y2 = dvt.Math.log10(y2);
  }
  var y = y1 + (y2 - y1) * (x - x1) / (x2 - x1);
  return isLog ? Math.pow(10, y) : y;
};


/**
 * Returns the Y values at the X-axis min/max edges of the viewport.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {object} An object containing the Y values at the viewport min/max edge.
 * @private
 */
DvtChartDataUtils._getViewportEdgeYValues = function(chart, seriesIndex) {
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);

  // Loop through the data
  var seriesData = seriesItem['items'];
  if (!seriesData)
    return {'min': null, 'max': null};

  // Include hidden series if hideAndShowBehavior occurs without rescale
  var bIncludeHiddenSeries = (DvtChartEventUtils.getHideAndShowBehavior(chart) == 'withoutRescale');

  // Find the viewport min/max
  var minMax = DvtChartAxisUtils.getXAxisViewportMinMax(chart, true);
  var min = minMax['min'];
  var max = minMax['max'];

  var isLog = DvtChartAxisUtils.isLog(chart, DvtChartDataUtils.isAssignedToY2(chart, seriesIndex) ? 'y2' : 'y');

  // Find the X locations of the edges and compute the Y values
  var x, y, prevX, prevY, yMin, yMax;
  for (var groupIndex = 0; groupIndex < seriesData.length; groupIndex++) {
    if (!bIncludeHiddenSeries && !DvtChartStyleUtils.isDataItemRendered(chart, seriesIndex, groupIndex))
      continue;

    x = DvtChartDataUtils.getXValue(chart, seriesIndex, groupIndex);
    y = DvtChartDataUtils.getCumulativeValue(chart, seriesIndex, groupIndex, bIncludeHiddenSeries);

    if (prevX != null) {
      if (min != null && min > prevX && min < x)
        yMin = DvtChartDataUtils._computeYAlongLine(isLog, prevX, prevY, x, y, min);
      if (max != null && max > prevX && max < x)
        yMax = DvtChartDataUtils._computeYAlongLine(isLog, prevX, prevY, x, y, max);
    }

    prevX = x;
    prevY = y;
  }

  return {'min': yMin, 'max': yMax};
};


/**
 * Returns the min and max values from the data.
 * @param {dvt.Chart} chart
 * @param {string} type The type of value to find: "x", "y", "y2", "z".
 * @param {boolean=} isDataOnly Use data points only in min/max computation. Excludes bubble radii and viewport edge values. Defaults to false.
 * @return {object} An object containing the minValue and the maxValue.
 */
DvtChartDataUtils.getMinMaxValue = function(chart, type, isDataOnly) {
  // Use the cached value if it has been computed before
  var cacheKey = type + (isDataOnly ? 'MinMaxDO' : 'MinMax');
  var minMax = chart.getFromCache(cacheKey);
  if (minMax)
    return minMax;

  // TODO support for null or NaN values

  var isLog = !isDataOnly && (type != 'z') && DvtChartAxisUtils.isLog(chart, type);

  // Y2 values pull from the y data value
  var isY2Value = (type == 'y2');
  if (isY2Value)
    type = 'y';

  // Y values may be listed directly as numbers
  var isYValue = (type == 'y');

  // limitToViewport is computing the min/max based on only the values that are within the viewport.
  // Only implemented for BLAC chart "y" and "y2" axis.
  var limitToViewport = !isDataOnly && isYValue && DvtChartTypeUtils.isBLAC(chart);

  // Include hidden series if hideAndShowBehavior occurs without rescale or for time axis
  var bIncludeHiddenSeries = (DvtChartEventUtils.getHideAndShowBehavior(chart) == 'withoutRescale') ||
                             (type == 'x' && DvtChartAxisUtils.hasTimeAxis(chart));

  var maxValue = -Infinity;
  var minValue = Infinity;
  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);

  for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
    var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
    var isRange = isYValue && (DvtChartStyleUtils.isRangeSeries(chart, seriesIndex) || DvtChartStyleUtils.getSeriesType(chart, seriesIndex) == 'candlestick');

    // Skip the series if it is hidden
    if (!bIncludeHiddenSeries && !DvtChartStyleUtils.isSeriesRendered(chart, seriesIndex))
      continue;

    // Skip the series if it's not assigned to the right y axis
    var isY2Series = DvtChartDataUtils.isAssignedToY2(chart, seriesIndex);
    if (isYValue && isY2Value != isY2Series)
      continue;

    // Loop through the data
    var seriesData = seriesItem['items'];
    if (!seriesData)
      continue;

    for (var groupIndex = 0; groupIndex < seriesData.length; groupIndex++) {
      // Skip the data item if it is hidden
      if (!bIncludeHiddenSeries && !DvtChartStyleUtils.isDataItemRendered(chart, seriesIndex, groupIndex))
        continue;

      if (typeof seriesData[groupIndex] != 'object')
        seriesData[groupIndex] = {'y': seriesData[groupIndex]};
      var data = seriesData[groupIndex];

      var value = null;
      if (isYValue) {
        if (!isRange)
          value = DvtChartDataUtils.getCumulativeValue(chart, seriesIndex, groupIndex, bIncludeHiddenSeries);
      }
      else if (type == 'x' && DvtChartAxisUtils.hasTimeAxis(chart) && !DvtChartAxisUtils.isMixedFrequency(chart)) {
        // Take time value from the groups array and transfer it to the data item
        value = DvtChartDataUtils.getGroupLabel(chart, groupIndex);
        if (data != null)
          data['x'] = value;
      }
      else if (data != null)
        value = data[type];

      if (type == 'z' && value <= 0) // exclude 0 for bubble radius min/max
        continue;

      if (limitToViewport && !DvtChartDataUtils.isXInViewport(chart, seriesIndex, groupIndex))
        continue;

      if (!isRange && value != null && typeof(value) == 'number') {
        var radius = 0;
        if (DvtChartTypeUtils.isBubble(chart) && !isDataOnly && (type != 'z'))
          radius = DvtChartMarkerUtils.getBubbleAxisRadius(chart, type, data['markerSize']);

        maxValue = Math.max(maxValue, isLog ? (value * Math.pow(10, radius)) : (value + radius));
        minValue = Math.min(minValue, isLog ? (value / Math.pow(10, radius)) : (value - radius));
      }

      if (isRange) {
        var high = DvtChartDataUtils.getHighValue(chart, seriesIndex, groupIndex);
        var low = DvtChartDataUtils.getLowValue(chart, seriesIndex, groupIndex);
        maxValue = Math.max(maxValue, high, low);
        minValue = Math.min(minValue, high, low);
      }
    }

    //Loop through reference objects and include their min/max values in the calulation
    var refObjects = null;
    if (type == 'x')
      refObjects = DvtChartRefObjUtils.getAxisRefObjs(chart, 'x');
    else if (isY2Value) // check isY2Value first, because isYValue will also be true
      refObjects = DvtChartRefObjUtils.getAxisRefObjs(chart, 'y2');
    else if (isYValue)
      refObjects = DvtChartRefObjUtils.getAxisRefObjs(chart, 'y');

    if (refObjects != null) {
      for (var i = 0; i < refObjects.length; i++) {
        var refObj = refObjects[i];
        var items = refObj['items']; //reference objects with varied min/max or values have the 'items' object populated
        var hidden = DvtChartEventUtils.getHideAndShowBehavior(chart) == 'withRescale' && refObj['visibility'] == 'hidden';
        // If refObj has varied values , loop through and evaluate all values in 'items'
        // Else just evaluate min/max/value on refObj
        if (hidden)
          continue;

        if (items && !hidden) {
          for (var j = 0; j < items.length; j++) {
            if (items[j] == null || (limitToViewport && !DvtChartDataUtils.isRefObjInViewport(chart, items, j)))
              continue;

            var low = DvtChartRefObjUtils.getLowValue(items[j]);
            var high = DvtChartRefObjUtils.getHighValue(items[j]);
            var val = isNaN(items[j]) ? items[j]['value'] : items[j];

            if (low != null && isFinite(low)) {
              minValue = Math.min(minValue, low);
              maxValue = Math.max(maxValue, low);
            }
            if (high != null && isFinite(high)) {
              minValue = Math.min(minValue, high);
              maxValue = Math.max(maxValue, high);
            }
            if (val != null && isFinite(val)) {
              minValue = Math.min(minValue, val);
              maxValue = Math.max(maxValue, val);
            }
          }
        }
        else {
          var low = DvtChartRefObjUtils.getLowValue(refObj);
          var high = DvtChartRefObjUtils.getHighValue(refObj);
          var val = refObj['value'];
          if (low != null && isFinite(low)) {
            minValue = Math.min(minValue, low);
            maxValue = Math.max(maxValue, low);
          }
          if (high != null && isFinite(high)) {
            minValue = Math.min(minValue, high);
            maxValue = Math.max(maxValue, high);
          }
          if (val != null && isFinite(val)) {
            minValue = Math.min(minValue, val);
            maxValue = Math.max(maxValue, val);
          }
        }
      }
    }

    // If the min/max is limited to viewport, included the values at the viewport edges.
    if (limitToViewport) {
      var edgeValues = DvtChartDataUtils._getViewportEdgeYValues(chart, seriesIndex);
      if (edgeValues['min'] != null) {
        minValue = Math.min(minValue, edgeValues['min']);
        maxValue = Math.max(maxValue, edgeValues['min']);
      }
      if (edgeValues['max'] != null) {
        minValue = Math.min(minValue, edgeValues['max']);
        maxValue = Math.max(maxValue, edgeValues['max']);
      }
    }
  }

  // Cache the value
  minMax = {'min': minValue, 'max': maxValue};
  chart.putToCache(cacheKey, minMax);

  return minMax;
};


/**
 * Returns true if the series is assigned to the y2 axis.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {boolean} True if the series is assigned to the y2 axis.
 */
DvtChartDataUtils.isAssignedToY2 = function(chart, seriesIndex) {
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  if (seriesItem && seriesItem['assignedToY2'] == 'on' && DvtChartTypeUtils.isDualY(chart))
    return true;
  else
    return false;
};


/**
 * Returns the array of initially selected objects for a chart.  This information is based on the data object.
 * @param {dvt.Chart} chart The chart that will be rendered.
 * @return {array} The array of selected objects.
 */
DvtChartDataUtils.getInitialSelection = function(chart) {
  var selection = chart.getOptions()['selection'];
  if (!selection)
    selection = [];

  // Process the data item ids and fill in series and group information
  var peers = chart.getChartObjPeers();
  for (var i = 0; i < selection.length; i++) {
    var id;
    if (typeof selection[i] == 'string') {
      id = selection[i];
      selection[i] = {'id': id};
    }
    else
      id = selection[i]['id'];

    // If id is defined, but series and group are not
    if (id != null && !(selection[i]['series'] && selection[i]['group'])) {
      for (var j = 0; j < peers.length; j++) {
        var peer = peers[j];
        if (id == peer.getDataItemId()) {
          selection[i]['series'] = peer.getSeries();
          selection[i]['group'] = peer.getGroup();
          break;
        }
      }
    }
  }

  return selection;
};


/**
 * Returns the current selection for the chart.  This selection is in the format of the data['selection'] API.
 * @param {dvt.Chart} chart The chart that will be rendered.
 * @return {array} The array of selected objects.
 */
DvtChartDataUtils.getCurrentSelection = function(chart) {
  var selection = [];
  var handler = chart.getSelectionHandler();
  if (handler) {
    var selectedIds = handler.getSelectedIds();
    for (var i = 0; i < selectedIds.length; i++) {
      var selectedId = selectedIds[i]; // selectedId is an instance of DvtChartDataItem
      selection.push({'series': selectedId.getSeries(), 'group': selectedId.getGroup(), 'id': selectedId.getId()});
    }
  }

  return selection;
};

/**
 * Returns whether the stock chart has a volume series
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartDataUtils.hasVolumeSeries = function(chart) {
  var hasVolume = chart.getOptionsCache()['_hasVolume'];
  return hasVolume ? hasVolume : false;
};
/**
 * Returns whether the data point is currently selected.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {boolean}
 */

DvtChartDataUtils.isDataSelected = function(chart, seriesIndex, groupIndex) {
  var id = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex)['id'];
  var series = DvtChartDataUtils.getSeries(chart, seriesIndex);
  var group = DvtChartDataUtils.getGroup(chart, groupIndex);

  // Check based on the selection attribute instead of asking the selectionHandler because
  // this method is called before the initial selection is set.
  var selection = chart.getOptions()['selection'];
  if (!selection)
    selection = [];

  for (var i = 0; i < selection.length; i++) {
    if (id != null && (id == selection[i] || id == selection[i]['id']))
      return true;
    if (series == selection[i]['series'] && group == selection[i]['group'])
      return true;
  }

  return false;
};


/**
 * Returns the data label for the specified data point.
 * @param {dvt.Chart} chart
 * @param {Number} seriesIndex The series index.
 * @param {Number} groupIndex The group index.
 * @param {number} type (optional) Data label type: low, high, or value.
 * @param {boolean} isStackLabel true if label for stack cummulative, false otherwise
 * @return {string} The data label, null if the index is invalid.
 */
DvtChartDataUtils.getDataLabel = function(chart, seriesIndex, groupIndex, type, isStackLabel) {
  var funcLabel;
  var defaultLabel = DvtChartDataUtils.getDefaultDataLabel(chart, seriesIndex, groupIndex, type, isStackLabel);

  // Use data Label function if there is one
  var dataLabelFunc = chart.getOptions()['dataLabel'];
  if (dataLabelFunc && !isStackLabel) {
    var dataContext = DvtChartDataUtils.getDataContext(chart, seriesIndex, groupIndex);
    dataContext['label'] = defaultLabel;
    funcLabel = dataLabelFunc(dataContext);
  }

  return funcLabel ? funcLabel : defaultLabel;
};

/**
 * Returns the default data label for the specified data point. It ignores the dataLabel function
 * @param {dvt.Chart} chart
 * @param {Number} seriesIndex The series index.
 * @param {Number} groupIndex The group index.
 * @param {number} type (optional) Data label type: low, high, or value.
 * @param {boolean} isStackLabel true if label for stack cummulative, false otherwise
 * @return {string} The default data label, null if the index is invalid.
 */
DvtChartDataUtils.getDefaultDataLabel = function(chart, seriesIndex, groupIndex, type, isStackLabel) {
  var label;
  if (isStackLabel)
    label = DvtChartDataUtils.getCumulativeValue(chart, seriesIndex, groupIndex);
  else {
    var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
    if (!dataItem)
      return null;

    label = dataItem['label'];
    // Range series data label support
    if (type == 'low')
      label = (label instanceof Array) ? label[0] : label;
    else if (type == 'high')
      label = (label instanceof Array) ? label[1] : null;
  }

  if (label != null) {
    // Numbers will be formatted, while all other labels will be treated as strings
    if (typeof label == 'number') {
      // Find the extents of the corresponding axis
      // Note: We assume y axis here because charts with numerical x axis would not pass a single value for the label.
      var min, max, majorIncrement;
      var bAssignedToY2 = DvtChartDataUtils.isAssignedToY2(chart, seriesIndex);
      var axis = (bAssignedToY2 && chart.y2Axis) ? chart.y2Axis : chart.yAxis;
      if (axis) {
        var axisInfo = axis.getInfo();
        min = axisInfo.getGlobalMin();
        max = axisInfo.getGlobalMax();
        majorIncrement = axisInfo.getMajorIncrement();
      }

      var valueFormat = DvtChartTooltipUtils.getValueFormat(chart, 'label');
      return DvtChartTooltipUtils.formatValue(chart.getCtx(), valueFormat, label, min, max, majorIncrement);
    }
    else
      return label;
  }
  return null;
};



/**
 * Returns the stack category of the specified series. If the chart is unstacked, returns the series name.
 * @param {dvt.Chart} chart
 * @param {Number} seriesIndex The series index.
 * @return {String} The stack category for stacked; the series name for unstacked.
 */
DvtChartDataUtils.getStackCategory = function(chart, seriesIndex) {
  var cacheKey = 'stackCategory';
  var stackCategories = chart.getOptionsCache()[cacheKey];
  if (stackCategories) {
    if (stackCategories[seriesIndex] != undefined)
      return stackCategories[seriesIndex];
  }
  else
    chart.getOptionsCache()[cacheKey] = {};

  var stackCategory;
  if (DvtChartTypeUtils.isStacked(chart))
    stackCategory = DvtChartDataUtils.getSeriesItem(chart, seriesIndex)['stackCategory'] || null;
  else
    stackCategory = DvtChartDataUtils.getSeries(chart, seriesIndex); // each series is its own stack category

  chart.getOptionsCache()[cacheKey][seriesIndex] = stackCategory;
  return stackCategory;
};

/**
 * Returns the lists of the stack categories for a series type.
 * @param {dvt.Chart} chart
 * @param {String} type (optional) The series type.
 * @param {Boolean} bIncludeHiddenSeries (optional) Whether or not to include hidden series categories, defaults to false.
 * @return {Object} An object containing the arrays of stack categories for y and y2 axis respectively.
 */
DvtChartDataUtils.getStackCategories = function(chart, type, bIncludeHiddenSeries) {
  var yCategories = [], y2Categories = [];
  var yCategoriesHash = {}, y2CategoriesHash = {}; // this is for performance to track categories processed
  var cacheKey = 'stackCategories';
  var categories = chart.getFromCachedMap2D(cacheKey, type, bIncludeHiddenSeries);
  if (categories)
    return categories;

  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  for (var s = 0; s < seriesCount; s++) {
    // Intentionally split up below for readability
    if (!DvtChartStyleUtils.isSeriesRendered(chart, s) && !bIncludeHiddenSeries) // skip unrendered series
      continue;
    else if (type) {
      // Treat candlestick as bar, as it inherits all the gap properties from bar.
      var seriesType = DvtChartStyleUtils.getSeriesType(chart, s);
      if (seriesType == 'candlestick')
        seriesType = 'bar';

      if (type != seriesType)
        continue;
    }

    var category = DvtChartDataUtils.getStackCategory(chart, s);
    if (DvtChartDataUtils.isAssignedToY2(chart, s)) {
      if (!y2CategoriesHash[category]) {
        y2Categories.push(category);
        y2CategoriesHash[category] = true;
      }
    }
    else if (!yCategoriesHash[category]) {
      yCategories.push(category);
      yCategoriesHash[category] = true;
    }
  }

  categories = {'y': yCategories, 'y2': y2Categories};
  chart.putToCachedMap2D(cacheKey, type, bIncludeHiddenSeries, categories);
  return categories;
};

/**
 * Computes z-value width of the specified stack category in a group.
 * @param {dvt.Chart} chart
 * @param {String} category The stack category. Use the series name for unstacked charts.
 * @param {Number} groupIndex
 * @param {Boolean} isY2 Whether the stack belongs to y2 axis.
 * @return {Number} The z-value width.
 */
DvtChartDataUtils.getBarCategoryZ = function(chart, category, groupIndex, isY2) {
  var width = 0;
  for (var s = 0; s < DvtChartDataUtils.getSeriesCount(chart); s++) {
    var seriesType = DvtChartStyleUtils.getSeriesType(chart, s);
    if ((seriesType != 'bar' && seriesType != 'candlestick') || DvtChartDataUtils.getStackCategory(chart, s) != category
        || !DvtChartStyleUtils.isSeriesRendered(chart, s))
      continue;

    // Compute the maximum z-value of the bars in the stack.
    var isSeriesY2 = DvtChartDataUtils.isAssignedToY2(chart, s);
    if ((isY2 && isSeriesY2) || (!isY2 && !isSeriesY2))
      width = Math.max(width, DvtChartDataUtils.getZValue(chart, s, groupIndex, 1));
  }

  return width;
};


/**
 * Returns the bar information needed to draw it for the specified index.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {dvt.Rectangle} availSpace
 * @return {Object} The coordinates associated with this bar for rendering purposes.
 */
DvtChartDataUtils.getBarInfo = function(chart, seriesIndex, groupIndex, availSpace) {
  var bHoriz = DvtChartTypeUtils.isHorizontal(chart);
  var bStacked = DvtChartTypeUtils.isStacked(chart);
  var isRTL = dvt.Agent.isRightToLeft(chart.getCtx());
  var xAxis = chart.xAxis;
  var bRange = DvtChartStyleUtils.isRangeSeries(chart, seriesIndex);
  var offsetMap = DvtChartStyleUtils.getBarCategoryOffsetMap(chart, groupIndex, bStacked);

  // Get the x-axis position
  var xValue = DvtChartDataUtils.getXValue(chart, seriesIndex, groupIndex);
  var xCoord = xAxis.getUnboundedCoordAt(xValue);

  // Find the corresponding y axis
  var bY2Series = DvtChartDataUtils.isAssignedToY2(chart, seriesIndex);
  var yAxis = bY2Series ? chart.y2Axis : chart.yAxis;
  var axisCoord = yAxis.getBaselineCoord();

  // Get the y-axis position
  var yCoord, baseCoord;
  if (bRange) {
    var lowValue = DvtChartDataUtils.getLowValue(chart, seriesIndex, groupIndex);
    var highValue = DvtChartDataUtils.getHighValue(chart, seriesIndex, groupIndex);
    if (lowValue == null || isNaN(lowValue) || highValue == null || isNaN(highValue)) // Don't render bars whose value is null
      return null;

    yCoord = yAxis.getBoundedCoordAt(lowValue);
    baseCoord = yAxis.getBoundedCoordAt(highValue);

    // Don't render bars whose start and end points are both out of bounds
    if (yCoord == baseCoord && yAxis.getCoordAt(lowValue) == null)
      return null;
  }
  else {
    var yValue = DvtChartDataUtils.getValue(chart, seriesIndex, groupIndex);
    var totalYValue = DvtChartDataUtils.getCumulativeValue(chart, seriesIndex, groupIndex);
    if (yValue == null || isNaN(yValue)) // Don't render bars whose value is null
      return null;

    yCoord = yAxis.getBoundedCoordAt(totalYValue);
    baseCoord = bStacked ? yAxis.getBoundedCoordAt(totalYValue - yValue) : axisCoord;

    // Don't render bars whose start and end points are both out of bounds
    if (yCoord == baseCoord && yAxis.getCoordAt(totalYValue) == null)
      return null;
  }

  // Calculate the width for the bar.
  var category = DvtChartDataUtils.getStackCategory(chart, seriesIndex);
  var barWidth = DvtChartStyleUtils.getBarWidth(chart, seriesIndex, groupIndex);
  var stackWidth = bStacked ? DvtChartStyleUtils.getBarStackWidth(chart, category, groupIndex, bY2Series) : barWidth;

  // : Mac FF pixel snaps greedily, so there must be 2 or more pixels of gaps.
  if (DvtChartStyleUtils.getBarSpacing(chart) == 'pixel' && dvt.Agent.isPlatformGecko()) {
    var groupWidth = barWidth / (1 - DvtChartStyleUtils.getBarGapRatio(chart));
    if (barWidth > 1 && groupWidth - barWidth < 2) {
      barWidth--;
      stackWidth = barWidth;
    }
  }

  // Calculate the actual coords for the bar
  var itemOffset = offsetMap[bY2Series ? 'y2' : 'y'][category] + 0.5 * (stackWidth - barWidth);
  var x1 = (isRTL && !bHoriz) ? xCoord - itemOffset - barWidth : xCoord + itemOffset;
  var x2 = x1 + barWidth;

  // Store the center of the data point relative to the plot area (for marquee selection)
  var dataPosX = (x1 + x2) / 2;
  var dataPosY = bRange ? (yCoord + baseCoord) / 2 : yCoord;
  var dataPos = DvtChartPlotAreaRenderer.convertAxisCoord(chart, new dvt.Point(dataPosX, dataPosY), availSpace);
  return {x1: x1, x2: x2, axisCoord: axisCoord, baseCoord: baseCoord, yCoord: yCoord, dataPos: dataPos, barWidth: barWidth};
};

/**
 * Returns the marker position for the specified index.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {dvt.Rectangle} availSpace
 * @return {dvt.Point} The marker position.
 */
DvtChartDataUtils.getMarkerPosition = function(chart, seriesIndex, groupIndex, availSpace) {
  var xAxis = chart.xAxis;
  var yAxis = DvtChartDataUtils.isAssignedToY2(chart, seriesIndex) ? chart.y2Axis : chart.yAxis;
  var isPolar = DvtChartTypeUtils.isPolar(chart);
  var bRange = DvtChartStyleUtils.isRangeSeries(chart, seriesIndex);

  // Get the x-axis position
  var xValue = DvtChartDataUtils.getXValue(chart, seriesIndex, groupIndex);
  var yValue = DvtChartDataUtils.getCumulativeValue(chart, seriesIndex, groupIndex);
  var xCoord, yCoord;

  // Get the position of the marker
  if (DvtChartTypeUtils.isBubble(chart)) {
    // The yValue for polar shouldn't go below the minimum because it will appear on the opposite side of the chart
    if (isPolar && yValue < yAxis.getInfo().getViewportMin())
      return null;
    // Markers for most graph types must be within the plot area to be rendered.  Bubble markers
    // do not, as they are available clipped to the plot area bounds.
    if (isPolar)
      xCoord = xAxis.getCoordAt(xValue);// if we use unbounded here, the value will wrap around the angle.
    else
      xCoord = xAxis.getUnboundedCoordAt(xValue);
    yCoord = yAxis.getUnboundedCoordAt(yValue);
  }
  else if (bRange) {
    var lowCoord = yAxis.getCoordAt(DvtChartDataUtils.getLowValue(chart, seriesIndex, groupIndex));
    var highCoord = yAxis.getCoordAt(DvtChartDataUtils.getHighValue(chart, seriesIndex, groupIndex));

    xCoord = xAxis.getCoordAt(DvtChartDataUtils.getXValue(chart, seriesIndex, groupIndex));
    yCoord = (lowCoord + highCoord) / 2;
  }
  else {
    xCoord = xAxis.getCoordAt(xValue);
    yCoord = yAxis.getCoordAt(yValue);
  }
  if (xCoord == null || yCoord == null)
    return null;

  var dataPos = DvtChartPlotAreaRenderer.convertAxisCoord(chart, new dvt.Point(xCoord, yCoord), availSpace);

  return dataPos;
};
/**
 * Returns the marker position for the specified index. Optimized for large data
 * scatter and bubble charts. Differs from the normal getMarkerPosition in that
 * elements just outside the viewport are ignored.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {dvt.Point} The marker position.
 */
DvtChartDataUtils.getScatterBubbleMarkerPosition = function(chart, seriesIndex, groupIndex) {
  var xAxis = chart.xAxis;
  var yAxis = chart.yAxis;

  // Get the x-axis position
  var xValue = DvtChartDataUtils.getXValue(chart, seriesIndex, groupIndex);
  var yValue = DvtChartDataUtils.getValue(chart, seriesIndex, groupIndex);

  // Get the position of the marker
  var xCoord = xAxis.getCoordAt(xValue);
  var yCoord = yAxis.getCoordAt(yValue);
  if (xCoord == null || yCoord == null)
    return null;
  else
    return new dvt.Point(xCoord, yCoord);
};

/**
 * Returns true if all the values of the series are negative.
 * @param {dvt.Chart} chart
 * @param {Number} seriesIndex
 * @return {boolean}
 */
DvtChartDataUtils.isSeriesNegative = function(chart, seriesIndex) {
  var groupCount = DvtChartDataUtils.getGroupCount(chart);
  for (var i = 0; i < groupCount; i++) { // Use first non zero value to set series type(negative or positive)
    var value = DvtChartDataUtils.getValue(chart, seriesIndex, i);
    if (value > 0) {
      return false;
    }
  }
  return true;
};

/**
 * Returns an object containing information about the data item used by tooltip and dataLabel callbacks.
 * @param {dvt.Chart} chart
 * @param {Number} seriesIndex The series index.
 * @param {Number} groupIndex The group index.
 * @return {object} An object containing information about the data item.
 */
DvtChartDataUtils.getDataContext = function(chart, seriesIndex, groupIndex) {
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  var rawOptions = chart.getRawOptions();
  var isOtherSlice = DvtChartTypeUtils.isPie(chart) && seriesIndex == null;
  var otherStr = dvt.Bundle.getTranslatedString(dvt.Bundle.CHART_PREFIX, 'LABEL_OTHER', null);
  var chartOptions = chart.getOptions();

  var dataContext = {
    'id': isOtherSlice ? otherStr : dataItem['id'],
    'series': isOtherSlice ? otherStr : DvtChartDataUtils.getSeries(chart, seriesIndex),
    'group': DvtChartDataUtils.getGroup(chart, groupIndex),
    'data' : isOtherSlice ? null : rawOptions['series'][seriesIndex]['items'][groupIndex],
    'seriesData': isOtherSlice ? null : rawOptions['series'][seriesIndex],
    'groupData': DvtChartDataUtils._getGroupsDataArray(chart)[groupIndex],
    'component': chartOptions['_widgetConstructor'],
    'value': isOtherSlice ? DvtChartPieUtils.getOtherValue(chart) : DvtChartDataUtils.getValue(chart, seriesIndex, groupIndex),
    'targetValue': DvtChartDataUtils.getTargetValue(chart, seriesIndex, groupIndex),
    'x': DvtChartDataUtils.getXValue(chart, seriesIndex, groupIndex),
    'y': DvtChartDataUtils.getValue(chart, seriesIndex, groupIndex),
    'z': DvtChartDataUtils.getZValue(chart, seriesIndex, groupIndex),
    'low': DvtChartDataUtils.getLowValue(chart, seriesIndex, groupIndex),
    'high': DvtChartDataUtils.getHighValue(chart, seriesIndex, groupIndex),
    'color': isOtherSlice ? chartOptions['styleDefaults']['otherColor'] : DvtChartStyleUtils.getColor(chart, seriesIndex, groupIndex),
    'open': isOtherSlice ? null : dataItem['open'],
    'close': isOtherSlice ? null : dataItem['close'],
    'volume': isOtherSlice ? null : dataItem['volume'],
    'totalValue': DvtChartTypeUtils.isPie(chart) ? chart.pieChart.getTotalValue() : null
  };
  return dataContext;
};

/**
 * Returns an array containing the hierarchical groups  associated with each innermost group item.
 * @param {dvt.Chart} chart
 * @return {Array} An array containing the hierarchical groups  associated with each innermost group item in chart.
 * @private
 */
DvtChartDataUtils._getGroupsDataArray = function(chart) {
  var cacheKey = 'groupsDataArray';
  var groupsDataArray = chart.getFromCache(cacheKey);

  if (!groupsDataArray) {
    var rawOptions = chart.getRawOptions();
    groupsDataArray = DvtChartDataUtils._getNestedGroupsData(rawOptions['groups']);
    chart.putToCache(cacheKey, groupsDataArray);
  }

  return groupsDataArray;
};

/**
 * Returns a structure containing the hierarchical groups  associated with each innermost group item.
 * @param {Array} groups An array of chart groups
 * @return {Array} An array of objects containing the hierarchical groups associated with each innermost group items in groups.
 * @private
 */
DvtChartDataUtils._getNestedGroupsData = function(groups) {
  if (!groups)
    return [];
  var groupsDataArray = [];

  for (var i = 0; i < groups.length; i++) {
    var group = groups[i];

    if (group['groups']) {
      var innerGroupData = DvtChartDataUtils._getNestedGroupsData(group['groups']);
      for (var j = 0; j < innerGroupData.length; j++) {
        innerGroupData[j].unshift(group);
      }
      groupsDataArray = groupsDataArray.concat(innerGroupData);
    }
    else
      groupsDataArray.push([group]);
  }
  return groupsDataArray;
};

/**
 * Whether or not a bar is the outermost bar in its group or category.
 * @param {dvt.Chart} chart
 * @param {Number} seriesIndex The series index.
 * @param {Number} groupIndex The group index.
 * @return {boolean}  true if the bar is the outermost bar in its group or category, otherwise false.
 */
DvtChartDataUtils.isOutermostBar = function(chart, seriesIndex, groupIndex) {
  var stackCategory = DvtChartDataUtils.getStackCategory(chart, seriesIndex);
  var isNegative = DvtChartDataUtils.getValue(chart, seriesIndex, groupIndex) < 0;
  var numSeries = DvtChartDataUtils.getSeriesCount(chart);

  // Checking only higher series
  for (var s = seriesIndex + 1; s < numSeries; s++) {
    if (stackCategory != DvtChartDataUtils.getStackCategory(chart, s))
      continue;
    if (isNegative != (DvtChartDataUtils.getValue(chart, s, groupIndex) < 0))
      continue;
    if (DvtChartStyleUtils.getSeriesType(chart, s) != 'bar')
      continue;
    if (!DvtChartDataUtils.isBLACItemInViewport(chart, s, groupIndex)) // Skip hidden data items
      continue;
    return false;
  }
  return true;
};
/**
 * Utility functions for dvt.Chart eventing and interactivity.
 * @class
 */
var DvtChartEventUtils = new Object();

dvt.Obj.createSubclass(DvtChartEventUtils, dvt.Obj);


/**
 * Returns the hide and show behavior for the specified chart.
 * @param {dvt.Chart} chart
 * @return {string}
 */
DvtChartEventUtils.getHideAndShowBehavior = function(chart) {
  return chart.getOptions()['hideAndShowBehavior'];
};


/**
 * Returns the hover behavior for the specified chart.
 * @param {dvt.Chart} chart
 * @return {string}
 */
DvtChartEventUtils.getHoverBehavior = function(chart) {
  return chart.getOptions()['hoverBehavior'];
};


/**
 * Updates the visibility of the specified category.  Returns true if the visibility is successfully
 * updated.  This function will return false if the visibility change is rejected, such as when
 * hiding the last visible series with hideAndShowBehavior withRescale.
 * @param {dvt.Chart} chart
 * @param {string} category
 * @param {string} visibility The new visibility of the category.
 * @return {boolean} True if the visibility was successfully updated.
 */
DvtChartEventUtils.setVisibility = function(chart, category, visibility) {

  //  - HIDE & SHOW FOR REFERENCE OBJECTS
  var refObj = DvtChartRefObjUtils.getRefObj(chart, category);
  if (refObj != null) {
    refObj['visibility'] = visibility;
  }
  // Update the categories list
  var hiddenCategories = DvtChartStyleUtils.getHiddenCategories(chart);
  var index = dvt.ArrayUtils.getIndex(hiddenCategories, category);
  if (visibility == 'hidden' && index < 0)
    hiddenCategories.push(category);
  else if (visibility == 'visible' && index >= 0)
    hiddenCategories.splice(index, 1);

  // Update the legend
  var options = chart.getOptions();
  if (options && options['legend'] && options['legend']['sections']) {
    // Iterate through any sections defined
    for (var i = 0; i < options['legend']['sections'].length; i++) {
      var dataSection = options['legend']['sections'][i];
      if (dataSection && dataSection['items']) {
        // Find the matching item and apply visibility
        for (var j = 0; j < dataSection['items'].length; j++) {
          if (dataSection['items'][j]['id'] == category)
            dataSection['items'][j]['categoryVisibility'] = visibility;
        }
      }
    }

    return true;
  }

  return false;
};


/**
 * Returns whether scroll is enabled.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartEventUtils.isScrollable = function(chart) {
  if (!DvtChartTypeUtils.isScrollSupported(chart))
    return false;
  return chart.getOptions()['zoomAndScroll'] != 'off';
};


/**
 * Returns whether zoom is enabled.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartEventUtils.isZoomable = function(chart) {
  if (!DvtChartTypeUtils.isScrollSupported(chart))
    return false;
  var zs = chart.getOptions()['zoomAndScroll'];
  return zs == 'live' || zs == 'delayed';
};


/**
 * Returns the zoom direction of the chart.
 * @param {dvt.Chart} chart
 * @return {string}
 */
DvtChartEventUtils.getZoomDirection = function(chart) {
  if (DvtChartTypeUtils.isScatterBubble(chart))
    return chart.getOptions()['zoomDirection'];
  else
    return 'auto';
};


/**
 * Returns whether zoom/scroll is live.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartEventUtils.isLiveScroll = function(chart) {
  if (!DvtChartTypeUtils.isScrollSupported(chart))
    return false;
  var zs = chart.getOptions()['zoomAndScroll'];
  return zs == 'live' || zs == 'liveScrollOnly';
};


/**
 * Returns whether zoom/scroll is delayed.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartEventUtils.isDelayedScroll = function(chart) {
  if (!DvtChartTypeUtils.isScrollSupported(chart))
    return false;
  var zs = chart.getOptions()['zoomAndScroll'];
  return zs == 'delayed' || zs == 'delayedScrollOnly';
};


/**
 * Processes an array of DvtChartDataItems representing the current selection, making them ready to be
 * dispatched to the callback. This is primarily used for expanding the "Other" data item into its contained
 * ids.
 * @param {dvt.Chart} chart
 * @param {array} selection The array of unprocessed ids.
 * @return {array} The array of processed ids, ready to be dispatched.
 */
DvtChartEventUtils.processIds = function(chart, selection) {
  var ret = [];
  for (var i = 0; i < selection.length; i++) {
    var item = selection[i];
    if (item.getSeries() == DvtChartPieUtils.OTHER_SLICE_SERIES_ID) {
      // Get the slice ids of the slices that are grouped into "other" slice
      var otherItems = DvtChartPieUtils.getOtherSliceIds(chart);
      ret = ret.concat(otherItems);
    }
    else
      ret.push(item);
  }
  return ret;
};


/**
 * Enlarge marquee rectangular bounds by one pixel in all directions to cover the points at the edges.
 * @param {dvt.MarqueeEvent} event The marquee event.
 */
DvtChartEventUtils.adjustBounds = function(event) {
  if (event.x != null) event.x -= 1;
  if (event.w != null) event.w += 2;
  if (event.y != null) event.y -= 1;
  if (event.h != null) event.h += 2;
};


/**
 * Gets the chart data items that are inside a marquee, even if not drawn.
 * @param {dvt.Chart} chart The chart.
 * @param {dvt.MarqueeEvent} event The marquee event, which contains the rectangular bounds (relative to stage).
 * @param {dvt.SelectionHandler} selectionHandler The selection handler for the graph
 * @return {array} Array of chart data items that are inside the rectangle.
 */
DvtChartEventUtils.getSelectedObjects = function(chart, event, selectionHandler) {
  // If data is not filtered, just use the selected ids from the peers
  if (!chart.getFromCache('dataFiltered'))
    return selectionHandler.getSelectedIds();

  var boundedObjects = [];

  // Get the cached data positions
  var cacheKey = 'dataPositions';
  var dataPositions = chart.getFromCache(cacheKey);

  // If not found in the cache, need to calculate the data positions for all the data points to be used for selection
  if (!dataPositions) {
    dataPositions = [];
    for (var seriesIdx = 0; seriesIdx < DvtChartDataUtils.getSeriesCount(chart); seriesIdx++) {
      for (var groupIdx = 0; groupIdx < DvtChartDataUtils.getGroupCount(chart); groupIdx++) {
        var dataPos;
        if (DvtChartStyleUtils.getSeriesType(chart, seriesIdx) == 'bar')
          dataPos = DvtChartDataUtils.getBarInfo(chart, seriesIdx, groupIdx).dataPos;
        else
          dataPos = DvtChartDataUtils.getMarkerPosition(chart, seriesIdx, groupIdx);
        if (dataPos) {
          dataPos = chart.getPlotArea().localToStage(dataPos);
          dataPositions.push({seriesIndex: seriesIdx, groupIndex: groupIdx, pos: dataPos });
        }
      }
    }
    chart.putToCache(cacheKey, dataPositions);
  }

  // Go through all the data positions for this chart and check if they are within the marquee rectangle
  for (var i = 0; i < dataPositions.length; i++) {
    var dataPos = dataPositions[i].pos;
    if (dataPos) {
      var withinX = (event.x == null) || (dataPos.x >= event.x && dataPos.x <= event.x + event.w);
      var withinY = (event.y == null) || (dataPos.y >= event.y && dataPos.y <= event.y + event.h);
      if (withinX && withinY)
        boundedObjects.push(new DvtChartDataItem(null, DvtChartDataUtils.getSeries(chart, dataPositions[i].seriesIndex), DvtChartDataUtils.getGroup(chart, dataPositions[i].groupIndex)));
    }
  }
  return boundedObjects;
};

/**
 * Gets the chart data items that are inside a marquee.
 * @param {dvt.Chart} chart The chart.
 * @param {dvt.MarqueeEvent} event The marquee event, which contains the rectangular bounds (relative to stage).
 * @return {array} Array of peer objects that are inside the rectangle.
 */
DvtChartEventUtils.getBoundedObjects = function(chart, event) {
  var peers = chart.getChartObjPeers();
  var boundedPeers = [];

  for (var i = 0; i < peers.length; i++) {
    var peer = peers[i];
    var dataPos = peer.getDataPosition();

    if (dataPos) {
      dataPos = chart.getPlotArea().localToStage(dataPos);
      var withinX = (event.x == null) || (dataPos.x >= event.x && dataPos.x <= event.x + event.w);
      var withinY = (event.y == null) || (dataPos.y >= event.y && dataPos.y <= event.y + event.h);
      if (withinX && withinY)
        boundedPeers.push(peer);
    }
  }

  return boundedPeers;
};


/**
 * Gets the chart axis bounds corresponding to the bounding rectangle.
 * @param {dvt.Chart} chart The chart.
 * @param {dvt.MarqueeEvent} event The marquee event, which contains the rectangular bounds (relative to stage).
 * @param {boolean} limitExtent Whether the result should be limited to the axis min/max extent.
 * @return {object} An object containing xMin, xMax, yMin, yMax, startGroup, endGroup corresponding to the bounds.
 */
DvtChartEventUtils.getAxisBounds = function(chart, event, limitExtent) {
  // Get the bounds in the axis coordinates
  var plotArea = chart.getPlotArea();
  var minPt = plotArea.stageToLocal(new dvt.Point(event.x, event.y));
  var maxPt = plotArea.stageToLocal(new dvt.Point(event.x + event.w, event.y + event.h));
  // Reset null values because they would be treated as zeros by stageToLocal()
  if (event.x == null) {
    minPt.x = null;
    maxPt.x = null;
  }
  if (event.y == null) {
    minPt.y = null;
    maxPt.y = null;
  }
  var coords = DvtChartEventUtils._convertToAxisCoord(chart, minPt.x, maxPt.x, minPt.y, maxPt.y);

  // Compute the axis bounds. Skip if the event values are null due to dragging on the axis.
  var xMinMax = {}, yMinMax = {}, y2MinMax = {}, startEndGroup = {};
  if (chart.xAxis) {
    xMinMax = DvtChartEventUtils._getAxisMinMax(chart.xAxis, coords.xMin, coords.xMax, limitExtent);
    startEndGroup = DvtChartEventUtils.getAxisStartEndGroup(chart.xAxis, xMinMax.min, xMinMax.max);
  }
  if (chart.yAxis)
    yMinMax = DvtChartEventUtils._getAxisMinMax(chart.yAxis, coords.yMin, coords.yMax, limitExtent);
  if (chart.y2Axis)
    y2MinMax = DvtChartEventUtils._getAxisMinMax(chart.y2Axis, coords.yMin, coords.yMax, limitExtent);

  return {xMin: xMinMax.min, xMax: xMinMax.max,
    yMin: yMinMax.min, yMax: yMinMax.max,
    y2Min: y2MinMax.min, y2Max: y2MinMax.max,
    startGroup: startEndGroup.startGroup, endGroup: startEndGroup.endGroup};
};


/**
 * Gets the axis min/max values corresponding to the bounding coords.
 * @param {DvtChartAxis} axis
 * @param {number} minCoord The coord of the minimum value of the axis.
 * @param {number} maxCoord The coord of the maximum value of the axis.
 * @param {boolean} limitExtent Whether the result should be limited to the axis min/max extent.
 * @return {object} An object containing the axis min/max value.
 * @private
 */
DvtChartEventUtils._getAxisMinMax = function(axis, minCoord, maxCoord, limitExtent) {
  if (minCoord == null || maxCoord == null)
    return {min: null, max: null};

  var min = axis.getUnboundedLinearValueAt(minCoord);
  var max = axis.getUnboundedLinearValueAt(maxCoord);

  if (limitExtent) {
    // Limit to min extent
    var minExtent = axis.getInfo().getMinimumExtent();
    if (max - min < minExtent) {
      var center = (max + min) / 2;
      max = center + minExtent / 2;
      min = center - minExtent / 2;
    }
    return DvtChartEventUtils._limitToGlobal(axis, min, max);
  }
  else
    return DvtChartEventUtils._getActualMinMax(axis, min, max);
};


/**
 * Gets the chart axis bounds corresponding to the deltas in coords. The results are bounded by axis global min/max and
 * minimum axis extent.
 * @param {dvt.Chart} chart The chart.
 * @param {number} xMinDelta The delta coord of the left end of the horizontal axis.
 * @param {number} xMaxDelta The delta coord of the right end of the horizontal axis.
 * @param {number} yMinDelta The delta coord of the top end of the vertical axis.
 * @param {number} yMaxDelta The delta coord of the bottom end of the vertical axis.
 * @return {object} An object containing xMin, xMax, yMin, yMax, startGroup, endGroup corresponding to the bounds.
 */
DvtChartEventUtils.getAxisBoundsByDelta = function(chart, xMinDelta, xMaxDelta, yMinDelta, yMaxDelta) {
  // Convert the deltas to the axis coordinates
  var deltas = DvtChartEventUtils._convertToAxisCoord(chart, xMinDelta, xMaxDelta, yMinDelta, yMaxDelta);
  var zoomDirection = DvtChartEventUtils.getZoomDirection(chart);

  // Compute the axis bounds.
  var xMinMax = {}, yMinMax = {}, y2MinMax = {}, startEndGroup = {};
  if (chart.xAxis && zoomDirection != 'y') {
    xMinMax = DvtChartEventUtils._getAxisMinMaxByDelta(chart.xAxis, deltas.xMin, deltas.xMax);
    startEndGroup = DvtChartEventUtils.getAxisStartEndGroup(chart.xAxis, xMinMax.min, xMinMax.max);
  }
  if (chart.yAxis && zoomDirection != 'x')
    yMinMax = DvtChartEventUtils._getAxisMinMaxByDelta(chart.yAxis, deltas.yMin, deltas.yMax);
  if (chart.y2Axis)
    y2MinMax = DvtChartEventUtils._getAxisMinMaxByDelta(chart.y2Axis, deltas.yMin, deltas.yMax);

  return {xMin: xMinMax.min, xMax: xMinMax.max,
    yMin: yMinMax.min, yMax: yMinMax.max,
    y2Min: y2MinMax.min, y2Max: y2MinMax.max,
    startGroup: startEndGroup.startGroup, endGroup: startEndGroup.endGroup};
};


/**
 * Gets the axis min/max values corresponding to the delta coords. The results are bounded by axis global min/max and
 * minimum axis extent.
 * @param {DvtChartAxis} axis
 * @param {number} minDelta The delta coord of the minimum value of the axis.
 * @param {number} maxDelta The delta coord of the maximum value of the axis.
 * @return {object} An object containing the axis min/max value.
 * @private
 */
DvtChartEventUtils._getAxisMinMaxByDelta = function(axis, minDelta, maxDelta) {
  var min = axis.getLinearViewportMin();
  var max = axis.getLinearViewportMax();

  // Don't do the computation if the min/max won't change. This is to prevent rounding errors.
  if (maxDelta == minDelta && axis.isFullViewport())
    return DvtChartEventUtils._getActualMinMax(axis, min, max);

  var minDeltaVal = axis.getUnboundedLinearValueAt(minDelta) - axis.getUnboundedLinearValueAt(0);
  var maxDeltaVal = axis.getUnboundedLinearValueAt(maxDelta) - axis.getUnboundedLinearValueAt(0);

  // Make sure that the min/max is not less than the minimum axis extent
  var weight = 1;
  var newExtent = (max + maxDeltaVal) - (min + minDeltaVal);
  var minExtent = axis.getInfo().getMinimumExtent();
  if (minDelta != maxDelta && newExtent < minExtent)
    weight = (max - min - minExtent) / (minDeltaVal - maxDeltaVal);

  min += minDeltaVal * weight;
  max += maxDeltaVal * weight;

  return DvtChartEventUtils._limitToGlobal(axis, min, max);
};


/**
 * Convert from real coord to axis coord.
 * @param {dvt.Chart} chart
 * @param {number} xMin The minimum x in real coord.
 * @param {number} xMax The maximum x in real coord.
 * @param {number} yMin The minimum y in real coord.
 * @param {number} yMax The maximum y in real coord.
 * @return {object} An object containing the axis xMin/Max and yMin/Max.
 * @private
 */
DvtChartEventUtils._convertToAxisCoord = function(chart, xMin, xMax, yMin, yMax) {
  var axisCoord = {};
  var isRTL = dvt.Agent.isRightToLeft(chart.getCtx());
  if (DvtChartTypeUtils.isHorizontal(chart)) {
    axisCoord.xMin = yMin;
    axisCoord.xMax = yMax;
    axisCoord.yMin = isRTL ? xMax : xMin;
    axisCoord.yMax = isRTL ? xMin : xMax;
  }
  else {
    axisCoord.xMin = isRTL ? xMax : xMin;
    axisCoord.xMax = isRTL ? xMin : xMax;
    axisCoord.yMin = yMax;
    axisCoord.yMax = yMin;
  }
  return axisCoord;
};


/**
 * Limits the min/max values to the global extents of the axis.
 * @param {DvtChartAxis} axis
 * @param {number} min Linearized min value of the axis.
 * @param {number} max Linearzied max value of the axis.
 * @return {object} An object containing the actual axis min/max value after limiting.
 * @private
 */
DvtChartEventUtils._limitToGlobal = function(axis, min, max) {
  var globalMin = axis.getLinearGlobalMin();
  var globalMax = axis.getLinearGlobalMax();

  // Limit to global min/max
  if ((max - min) >= (globalMax - globalMin)) {
    min = globalMin;
    max = globalMax;
  }
  else if (min < globalMin) {
    max += globalMin - min;
    min = globalMin;
  }
  else if (max > globalMax) {
    min -= max - globalMax;
    max = globalMax;
  }

  return DvtChartEventUtils._getActualMinMax(axis, min, max);
};


/**
 * Returns an object containing the actual min/max based on the linearized min/max.
 * @param {DvtChartAxis} axis
 * @param {number} min Linearized min value of the axis.
 * @param {number} max Linearzied max value of the axis.
 * @return {object} An object containing the actual axis min/max value.
 * @private
 */
DvtChartEventUtils._getActualMinMax = function(axis, min, max) {
  return {min: axis.linearToActual(min), max: axis.linearToActual(max)};
};


/**
 * Returns the start/endGroup of the axis.
 * @param {DvtChartAxis} axis
 * @param {number} min The minimum value of the axis.
 * @param {number} max The maximum value of the axis.
 * @return {object} An object containing the axis start/endGroup.
 */
DvtChartEventUtils.getAxisStartEndGroup = function(axis, min, max) {
  if (axis.isGroupAxis() && min != null && max != null) {
    var startIdx = Math.ceil(min);
    var endIdx = Math.floor(max);
    if (endIdx >= startIdx) {
      var startGroup = axis.getInfo().getGroup(startIdx);
      var endGroup = axis.getInfo().getGroup(endIdx);
      return {startGroup: startGroup, endGroup: endGroup};
    }
  }
  return {startGroup: null, endGroup: null};
};


/**
 * Sets initial selection for the graph.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {array} selected The array of initially selected objects.
 */
DvtChartEventUtils.setInitialSelection = function(chart, selected) {
  var handler = chart.getSelectionHandler();
  if (!handler)
    return;

  var peers = chart.getChartObjPeers();
  var selectedIds = [];
  for (var i = 0; i < selected.length; i++) {
    for (var j = 0; j < peers.length; j++) {
      var peer = peers[j];
      if (peer.getSeries() === selected[i]['series'] && peer.getGroup() === selected[i]['group']) {
        selectedIds.push(peer.getId());
        continue;
      }
    }
  }

  handler.processInitialSelections(selectedIds, peers);
};

/**
 * Returns the keyboard navigable objects for the chart.
 * @param {dvt.Chart} chart
 * @return {array}
 */
DvtChartEventUtils.getKeyboardNavigables = function(chart) {
  var navigables = [];
  if (DvtChartTypeUtils.isPie(chart)) {
    var slices = chart.pieChart.__getSlices();
    for (var i = 0; i < slices.length; i++) {
      // exclude hidden slices that may be included during delete animation
      if (DvtChartStyleUtils.isSeriesRendered(chart, slices[i].getSeriesIndex()))
        navigables.push(slices[i]);
    }
  }
  else {
    var peers = chart.getChartObjPeers();
    for (var i = 0; i < peers.length; i++) {
      if (peers[i].isNavigable())
        navigables.push(peers[i]);
    }
  }
  return navigables;
};


/**
 * Returns whether the series is drillable.
 * @param {dvt.Chart} chart
 * @param {Number} seriesIndex
 * @return {Boolean}
 */
DvtChartEventUtils.isSeriesDrillable = function(chart, seriesIndex) {
  var series = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  var drilling = series != null ? series['drilling'] : 'inherit';
  if (drilling == 'on')
    return true;
  else if (drilling == 'off')
    return false;
  else {
    drilling = chart.getOptions()['drilling'];
    return drilling == 'on' || drilling == 'seriesOnly';
  }
};

/**
 * Returns whether the data item is drillable.
 * @param {dvt.Chart} chart
 * @param {Number} seriesIndex
 * @param {Number} groupIndex
 * @return {Boolean}
 */
DvtChartEventUtils.isDataItemDrillable = function(chart, seriesIndex, groupIndex) {
  var item = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  var drilling = item != null ? item['drilling'] : 'inherit';
  if (drilling == 'on')
    return true;
  else if (drilling == 'off')
    return false;
  else {
    drilling = chart.getOptions()['drilling'];
    return drilling == 'on';
  }
};
/**
 * Reference object related utility functions for dvt.Chart.
 * @class
 */
var DvtChartRefObjUtils = new Object();

dvt.Obj.createSubclass(DvtChartRefObjUtils, dvt.Obj);


/**
 * Returns all reference objects for the current chart.
 * @param {dvt.Chart} chart
 * @return {array} The array of reference object definitions.
 */
DvtChartRefObjUtils.getRefObjs = function(chart) {
  var x = DvtChartRefObjUtils.getAxisRefObjs(chart, 'x');
  var y = DvtChartRefObjUtils.getAxisRefObjs(chart, 'y');
  var y2 = DvtChartRefObjUtils.getAxisRefObjs(chart, 'y2');
  return x.concat(y, y2);
};


/**
 * Returns all reference objects for the axis.
 * @param {dvt.Chart} chart
 * @param {string} axisType 'x', 'y', 'or 'y2'
 * @return {array} The array of reference object definitions.
 */
DvtChartRefObjUtils.getAxisRefObjs = function(chart, axisType) {
  var options = chart.getOptions();
  if (options && options[axisType + 'Axis'] && options[axisType + 'Axis']['referenceObjects'])
    return options[axisType + 'Axis']['referenceObjects'];
  else
    return [];
};


/**
 * Returns the type of the reference object.
 * @param {object} refObj The reference object definition.
 * @return {string} The type of the reference object.
 */
DvtChartRefObjUtils.getType = function(refObj) {
  if (refObj['type'] == 'area')
    return 'area';
  else // default to "line"
    return 'line';
};


/**
 * Returns the location of the reference object.
 * @param {object} refObj The reference object definition.
 * @return {string} The location of the reference object.
 */
DvtChartRefObjUtils.getLocation = function(refObj) {
  if (refObj['location'] == 'front')
    return 'front';
  else // default to "back"
    return 'back';
};


/**
 * Returns the color of the reference object.
 * @param {object} refObj The reference object definition.
 * @return {string} The color.
 */
DvtChartRefObjUtils.getColor = function(refObj) {
  if (refObj['color'])
    return refObj['color'];
  else
    return '#333333';
};


/**
 * Returns the line width of the reference line.
 * @param {object} refObj The reference object definition.
 * @return {number} The line width.
 */
DvtChartRefObjUtils.getLineWidth = function(refObj) {
  if (refObj['lineWidth'])
    return refObj['lineWidth'];
  else // default to 1 pixel
    return 1;
};

/**
 * Returns the line type of the reference line.
 * @param {object} refObj The reference object definition.
 * @return {number} The line type.
 */
DvtChartRefObjUtils.getLineType = function(refObj) {
  if (refObj['lineType'])
    return refObj['lineType'];
  else
    return 'straight';
};

/**
 * Returns true if the specified reference object should be rendered.
 * @param {dvt.Chart} chart
 * @param {object} refObj
 * @return {boolean}
 */
DvtChartRefObjUtils.isObjectRendered = function(chart, refObj) {
  var hiddenCategories = DvtChartStyleUtils.getHiddenCategories(chart);
  if (hiddenCategories.length > 0) {
    var categories = DvtChartRefObjUtils.getRefObjCategories(refObj);
    if (categories && dvt.ArrayUtils.hasAnyItem(hiddenCategories, categories)) {
      return false;
    }
  }
  return !(refObj['visibility'] == 'hidden');
};


/**
 * Returns the id of the reference object.
 * @param {object} refObj
 * @return {string}
 */
DvtChartRefObjUtils.getId = function(refObj) {
  return refObj['id'] != null ? refObj['id'] : refObj['text'];
};

/**
 * Returns the categories of the reference object.
 * @param {object} refObj
 * @return {string}
 */
DvtChartRefObjUtils.getRefObjCategories = function(refObj) {
  return refObj['categories'] ? refObj['categories'] : [DvtChartRefObjUtils.getId(refObj)];
};

/**
 * Returns reference object based on id.
 * @param {object} chart
 * @param {string} id The id of the ref obj.
 * @return {object}
 */
DvtChartRefObjUtils.getRefObj = function(chart, id) {
  var refObjs = DvtChartRefObjUtils.getRefObjs(chart);
  for (var i = 0; i < refObjs.length; i++) {
    if (DvtChartRefObjUtils.getId(refObjs[i]) == id) {
      return refObjs[i];
    }
  }
};


/**
 * Returns the low value of the refObj item.
 * @param {object} item
 * @return {number}
 */
DvtChartRefObjUtils.getLowValue = function(item) {
  if (item == null)
    return null;
  if (item['min'] != null) // for backwards compat
    return item['min'];
  return item['low'];
};

/**
 * Returns the high value of the refObj item.
 * @param {object} item
 * @return {number}
 */
DvtChartRefObjUtils.getHighValue = function(item) {
  if (item == null)
    return null;
  if (item['max'] != null) // for backwards compat
    return item['max'];
  return item['high'];
};

/**
 * Retuns the x value of the refObj item at the given index
 * @param {dvt.Chart} chart
 * @param {object} items
 * @param {number} index
 * @return {number}
 */
DvtChartRefObjUtils.getXValue = function(chart, items, index) {
  if (items[index] && items[index]['x'] != null)
    return items[index]['x'];
  else if (DvtChartAxisUtils.hasTimeAxis(chart) && !DvtChartAxisUtils.isMixedFrequency(chart))
    return DvtChartDataUtils.getGroupLabel(chart, index);
  else
    return index;
};
/**
 * Series effect utility functions for dvt.Chart.
 * @class
 */
var DvtChartSeriesEffectUtils = new Object();

dvt.Obj.createSubclass(DvtChartSeriesEffectUtils, dvt.Obj);


/**
 * Returns the fill for a bar with the given series and group.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {boolean} bHoriz True if the bar is horizontal
 * @param {number} barWidth The width of the bar
 * @return {dvt.Fill}
 */
DvtChartSeriesEffectUtils.getBarFill = function(chart, seriesIndex, groupIndex, bHoriz, barWidth) {
  // All series effects are based off of the color
  var color = DvtChartStyleUtils.getColor(chart, seriesIndex, groupIndex);
  var pattern = DvtChartStyleUtils.getPattern(chart, seriesIndex, groupIndex);
  var seriesEffect = DvtChartStyleUtils.getSeriesEffect(chart);

  if (pattern)
    return new dvt.PatternFill(pattern, color);
  else if (seriesEffect == 'gradient' && barWidth > 3) { // to improve performance, don't use gradient if bar is too thin
    var colors;
    var stops;
    var angle = bHoriz ? 270 : 0;
    if (DvtChartSeriesEffectUtils._useAltaGradients(chart))
    {
      colors = [dvt.ColorUtils.adjustHSL(color, 0, -0.09, 0.04),
                dvt.ColorUtils.adjustHSL(color, 0, -0.04, -0.05)];
      stops = [0, 1.0];
    }
    else {
      colors = [dvt.ColorUtils.getPastel(color, 0.15),
                dvt.ColorUtils.getPastel(color, 0.45),
                dvt.ColorUtils.getPastel(color, 0.25),
                color,
                dvt.ColorUtils.getPastel(color, 0.15),
                dvt.ColorUtils.getDarker(color, 0.9)];
      stops = [0, 0.15, 0.30, 0.65, 0.85, 1.0];
    }

    return new dvt.LinearGradientFill(angle, colors, null, stops);
  }
  else // seriesEffect="color"
    return new dvt.SolidFill(color);
};


/**
 * Returns the fill for an area with the given series and group.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {dvt.Fill}
 */
DvtChartSeriesEffectUtils.getAreaFill = function(chart, seriesIndex) {
  var isLineWithArea = DvtChartStyleUtils.getSeriesType(chart, seriesIndex) == 'lineWithArea';

  // Get the color
  var color;
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  if (seriesItem && seriesItem['areaColor'])
    color = seriesItem['areaColor'];
  else {
    color = DvtChartStyleUtils.getColor(chart, seriesIndex);
    if (isLineWithArea)
      color = dvt.ColorUtils.setAlpha(color, 0.2);
  }

  // All series effects are based off of the color
  var pattern = DvtChartStyleUtils.getPattern(chart, seriesIndex);
  var seriesEffect = DvtChartStyleUtils.getSeriesEffect(chart);

  if (pattern)
    return new dvt.PatternFill(pattern, color);
  else if (seriesEffect == 'gradient') {
    var colors, stops;
    var angle = DvtChartTypeUtils.isHorizontal(chart) ? 180 : 270;
    if (isLineWithArea) {
      var alpha = dvt.ColorUtils.getAlpha(color);
      colors = [dvt.ColorUtils.setAlpha(color, Math.min(alpha + 0.2, 1)),
                dvt.ColorUtils.setAlpha(color, Math.max(alpha - 0.15, 0))];
      stops = [0, 1.0];
    }
    else if (DvtChartSeriesEffectUtils._useAltaGradients(chart)) {
      colors = [dvt.ColorUtils.adjustHSL(color, 0, -0.09, 0.04),
                dvt.ColorUtils.adjustHSL(color, 0, -0.04, -0.05)];
      stops = [0, 1.0];
    }
    else {
      if (DvtChartTypeUtils.isSpark(chart)) {
        colors = [dvt.ColorUtils.getDarker(color, 0.5), color, dvt.ColorUtils.getPastel(color, 0.50)];
        stops = [0, 0.5, 1.0];
      }
      else {
        colors = [dvt.ColorUtils.getPastel(color, 0.5), color, dvt.ColorUtils.getDarker(color, 0.70)];
        stops = [0, 0.5, 1.0];
      }
    }
    return new dvt.LinearGradientFill(angle, colors, null, stops);
  }
  else // seriesEffect="color"
    return new dvt.SolidFill(color);
};


/**
 * Returns the fill for a marker with the given series and group.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {dvt.Fill}
 */
DvtChartSeriesEffectUtils.getMarkerFill = function(chart, seriesIndex, groupIndex) {
  // All series effects are based off of the color
  var color = DvtChartStyleUtils.getMarkerColor(chart, seriesIndex, groupIndex);
  var pattern = DvtChartStyleUtils.getPattern(chart, seriesIndex, groupIndex);

  if (pattern)
    return new dvt.PatternFill(pattern, color);

  // Only bubble markers use series effect(gradient)
  if (DvtChartTypeUtils.isBubble(chart)) {
    var seriesEffect = DvtChartStyleUtils.getSeriesEffect(chart);

    if (seriesEffect == 'gradient') {
      if (DvtChartSeriesEffectUtils._useAltaGradients(chart))
      {
        var colors = [dvt.ColorUtils.adjustHSL(color, 0, -0.09, 0.04),
                      dvt.ColorUtils.adjustHSL(color, 0, -0.04, -0.05)];
        var stops = [0, 1.0];
        return new dvt.LinearGradientFill(270, colors, null, stops);
      }
      else {
        // Gradient varies by shape
        var shape = DvtChartStyleUtils.getMarkerShape(chart, seriesIndex, groupIndex);
        if (shape == 'human') {
          var linearColors = [dvt.ColorUtils.getPastel(color, 0.2),
                              dvt.ColorUtils.getPastel(color, 0.1),
                              color,
                              dvt.ColorUtils.getDarker(color, 0.8)];
          var linearStops = [0, 0.3, 0.7, 1.0];
          return new dvt.LinearGradientFill(315, linearColors, null, linearStops);
        }
        else {
          var radialColors = [dvt.ColorUtils.getPastel(color, 0.15),
                              color,
                              dvt.ColorUtils.getDarker(color, 0.9),
                              dvt.ColorUtils.getDarker(color, 0.8)];
          var radialStops = [0, 0.5, 0.75, 1.0];
          return new dvt.RadialGradientFill(radialColors, null, radialStops);
        }
      }
    }
  }

  // seriesEffect="color" or line/scatter marker
  return new dvt.SolidFill(color);
};


/**
 * Returns the fill for a funnel slice with the given series and group.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {string} color  The color that is associated with the funnel slice, to apply the effect onto it.
 * @param {dvt.Rectangle} dimensions  The dimensions of this funnel slice, to pass as limits for the gradient effect.
 * @param {boolean} bBackground
 * @return {dvt.Fill}
 */
DvtChartSeriesEffectUtils.getFunnelSliceFill = function(chart, seriesIndex, color, dimensions, bBackground) {
  var pattern = DvtChartStyleUtils.getPattern(chart, seriesIndex, 0);
  var seriesEffect = DvtChartStyleUtils.getSeriesEffect(chart);

  if (pattern && !bBackground) {
    var fill = new dvt.PatternFill(pattern, color);
    // Need to rotate the pattern if vertical to counteract the chart rotation.
    if (chart.getOptions()['orientation'] == 'vertical') {
      if (dvt.Agent.isRightToLeft(chart.getCtx()))
        fill.setMatrix((new dvt.Matrix(0, -1, 1, 0)));
      else
        fill.setMatrix((new dvt.Matrix(0, 1, -1, 0)));
    }
    return fill;
  }
  else if (seriesEffect == 'gradient') {
    var angle = 90;
    var colors, stops;
    if (chart.getOptions()['styleDefaults']['threeDEffect'] == 'on') {
      colors = [dvt.ColorUtils.adjustHSL(color, 0, 0, - 0.1), dvt.ColorUtils.adjustHSL(color, 0, 0, 0.12), color];
      stops = [0, 0.65, 1.0];
    }
    else {
      colors = [dvt.ColorUtils.adjustHSL(color, 0, - 0.09, 0.04), dvt.ColorUtils.adjustHSL(color, 0, - 0.04, - 0.05)];
      stops = [0, 1.0];
    }
    return new dvt.LinearGradientFill(angle, colors, null, stops, [dimensions.x, dimensions.y, dimensions.w, dimensions.h]);
  }
  else // seriesEffect="color"
    return new dvt.SolidFill(color);
};


/**
 * Returns true if the alta gradients should be used.
 * @param {dvt.Chart} chart
 * @return {boolean}
 * @private
 */
DvtChartSeriesEffectUtils._useAltaGradients = function(chart) 
{
  return !DvtChartDefaults.isSkyrosSkin(chart);
};
/**
 * Style related utility functions for dvt.Chart.
 * @class
 */
var DvtChartStyleUtils = new Object();

dvt.Obj.createSubclass(DvtChartStyleUtils, dvt.Obj);


/** @private */
DvtChartStyleUtils._SERIES_TYPE_RAMP = ['bar', 'line', 'area'];


/**
 * Returns the series type for the specified data item.  Returns "auto" for chart types
 * that do not support multiple series types.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {string} The series type.
 */
DvtChartStyleUtils.getSeriesType = function(chart, seriesIndex) {
  var cacheKey = 'seriesTypes';
  var seriesTypes = chart.getOptionsCache()[cacheKey];
  if (seriesTypes) {
    if (seriesTypes[seriesIndex])
      return seriesTypes[seriesIndex];
  }
  else
    chart.getOptionsCache()[cacheKey] = {};

  if (!DvtChartTypeUtils.isBLAC(chart)) {
    chart.getOptionsCache()[cacheKey][seriesIndex] = 'auto';
    return 'auto';
  }

  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  var seriesType = seriesItem ? seriesItem['type'] : null;

  // Error prevention for candlestick series in non stock type charts
  if (!DvtChartTypeUtils.isStock(chart) && seriesType == 'candlestick')
    seriesType = 'auto';

  if (!seriesType || seriesType == 'auto') {
    // Series type not specified, get default
    if (DvtChartTypeUtils.isBar(chart))
      seriesType = 'bar';
    else if (DvtChartTypeUtils.isLine(chart))
      seriesType = 'line';
    else if (DvtChartTypeUtils.isArea(chart))
      seriesType = 'area';
    else if (DvtChartTypeUtils.isLineWithArea(chart))
      seriesType = 'lineWithArea';
    else if (DvtChartTypeUtils.isStock(chart))
      seriesType = 'candlestick';
    else if (DvtChartTypeUtils.isCombo(chart)) {
      var styleIndex = DvtChartDataUtils.getSeriesStyleIndex(chart, seriesIndex);
      var typeIndex = styleIndex % DvtChartStyleUtils._SERIES_TYPE_RAMP.length;
      seriesType = DvtChartStyleUtils._SERIES_TYPE_RAMP[typeIndex];
    }
  }

  chart.getOptionsCache()[cacheKey][seriesIndex] = seriesType;
  return seriesType;
};


/**
 * Returns whether the series is a range series.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {boolean}
 */
DvtChartStyleUtils.isRangeSeries = function(chart, seriesIndex) {
  // Use the cached value if it has been computed before
  var cacheKey = 'isRange';
  var isRange = chart.getFromCachedMap(cacheKey, seriesIndex);
  if (isRange != null)
    return isRange;

  isRange = false;
  var seriesType = DvtChartStyleUtils.getSeriesType(chart, seriesIndex);
  if (seriesType == 'bar' || seriesType == 'area') {
    for (var g = 0; g < DvtChartDataUtils.getGroupCount(chart); g++) {
      if (DvtChartDataUtils.getLowValue(chart, seriesIndex, g) != null || DvtChartDataUtils.getHighValue(chart, seriesIndex, g) != null) {
        isRange = true;
        break;
      }
    }
  }

  // Cache the value
  chart.putToCachedMap(cacheKey, seriesIndex, isRange);
  return isRange;
};


/**
 * Returns the series effect for the specified chart.
 * @param {dvt.Chart} chart
 * @return {string} The series effect.
 */
DvtChartStyleUtils.getSeriesEffect = function(chart) {
  // Style Defaults
  var options = chart.getOptions();
  return options['styleDefaults']['seriesEffect'];
};


/**
 * Returns the color for the specified data item.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {string} The color string.
 */
DvtChartStyleUtils.getColor = function(chart, seriesIndex, groupIndex) {
  // Data Override
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  if (dataItem && dataItem['color'])
    return dataItem['color'];

  // Stock Candlestick: Use rising/falling instead of series color or styleDefaults colors.
  if (DvtChartStyleUtils.getSeriesType(chart, seriesIndex) == 'candlestick')
    return DvtChartStyleUtils.getStockItemColor(chart, seriesIndex, groupIndex);

  // Series Override
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  if (seriesItem && seriesItem['color'])
    return seriesItem['color'];

  // Style Defaults
  var options = chart.getOptions();
  var defaultColors = options['styleDefaults']['colors'];
  var styleIndex = DvtChartDataUtils.getSeriesStyleIndex(chart, seriesIndex);
  var colorIndex = styleIndex % defaultColors.length;
  return options['styleDefaults']['colors'][colorIndex];
};

/**
 * Returns the stock item color for the specified data item for stock charts.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {string} The color string.
 */
DvtChartStyleUtils.getStockItemColor = function(chart, seriesIndex, groupIndex) {
  var options = chart.getOptions();
  if (DvtChartDataUtils.isStockValueRising(chart, seriesIndex, groupIndex))
    return options['styleDefaults']['stockRisingColor'];
  else
    return options['styleDefaults']['stockFallingColor'];
};

/**
 * Returns the color for the specified volume item for stock charts.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {string} The color string.
 */
DvtChartStyleUtils.getStockVolumeColor = function(chart, seriesIndex, groupIndex) {
  // Data Override
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  if (dataItem && dataItem['color'])
    return dataItem['color'];

  // Volume Color
  var options = chart.getOptions();
  if (options['styleDefaults']['stockVolumeColor'])
    return options['styleDefaults']['stockVolumeColor'];

  // Rising/Falling Color
  return DvtChartStyleUtils.getStockItemColor(chart, seriesIndex, groupIndex);
};

/**
 * Returns the splitterPosition to be used as a number from 0 to 1.
 * @param {dvt.Chart} chart
 * @return {number}
 */
DvtChartStyleUtils.getSplitterPosition = function(chart) {
  var options = chart.getOptions();

  var splitterPosition = options['splitterPosition'];
  if (splitterPosition != null)
    return splitterPosition;

  else if (DvtChartTypeUtils.isStock(chart))
    return .8;

  else
    return .5;
};

/**
 * Returns the pattern for the specified data item.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {string} The pattern string.
 */
DvtChartStyleUtils.getPattern = function(chart, seriesIndex, groupIndex) {
  // Data Override
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  if (dataItem && dataItem['pattern'] && dataItem['pattern'] != 'auto')
    return dataItem['pattern'];

  //get series type instead of chart type, in case its a combo chart
  var seriesType = DvtChartStyleUtils.getSeriesType(chart, seriesIndex);
  //prevent line/area markers from using series/styleDefaults pattern
  if ((seriesType == 'line' || seriesType == 'area') && groupIndex != null)
    return null;

  // Series Override
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  if (seriesItem && seriesItem['pattern'] && seriesItem['pattern'] != 'auto')
    return seriesItem['pattern'];

  // Style Defaults
  if (DvtChartStyleUtils.getSeriesEffect(chart) == 'pattern') {
    // For candlestick series, use pattern based on rising/falling value.
    if (DvtChartTypeUtils.isStock && DvtChartStyleUtils.getSeriesType(chart, seriesIndex) == 'candlestick') {
      var bRisingValue = DvtChartDataUtils.isStockValueRising(chart, seriesIndex, groupIndex);
      var bRtl = dvt.Agent.isRightToLeft(chart.getCtx());
      if (bRisingValue)
        return bRtl ? 'smallDiagonalLeft' : 'smallDiagonalRight';
      else // Falling Value
        return bRtl ? 'smallDiagonalRight' : 'smallDiagonalLeft';
    }
    else {
      var options = chart.getOptions();
      var defaultPatterns = options['styleDefaults']['patterns'];
      var styleIndex = DvtChartDataUtils.getSeriesStyleIndex(chart, seriesIndex);
      var patternIndex = styleIndex % defaultPatterns.length;
      return options['styleDefaults']['patterns'][patternIndex];
    }
  }
  else
    return null;
};

/**
 * Returns the border color for markers belonging to the specified data item.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {string} The border color string.
 */
DvtChartStyleUtils.getMarkerBorderColor = function(chart, seriesIndex, groupIndex) {
  // Return custom border color from API settings if found.
  var borderColor = DvtChartStyleUtils.getBorderColor(chart, seriesIndex, groupIndex);
  if (borderColor)
    return borderColor;

  // If data item gaps defined, use the background color to simulate gaps.
  if (DvtChartStyleUtils.getDataItemGaps(chart) > 0 && DvtChartStyleUtils.getSeriesType(chart, seriesIndex) != 'lineWithArea')
    return DvtChartStyleUtils.getBackgroundColor(chart, true);

  //  - In alta, automatically apply borders to bubbles in bubble charts using the 'color' seriesEffect for better readability
  if (DvtChartTypeUtils.isBubble(chart) && !DvtChartDefaults.isSkyrosSkin(chart) && DvtChartStyleUtils.getSeriesEffect(chart) != 'gradient') {
    var markerColor = DvtChartStyleUtils.getMarkerColor(chart, seriesIndex, groupIndex);
    if (markerColor)
      return dvt.ColorUtils.adjustHSL(markerColor, 0, 0.15, -0.25);
  }

  return null;
};

/**
 * Returns the border color for the specified data item.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {string} The border color string.
 */
DvtChartStyleUtils.getBorderColor = function(chart, seriesIndex, groupIndex) {
  // Data Override
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  if (dataItem && dataItem['borderColor'])
    return dataItem['borderColor'];

  // Series Override
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  if (seriesItem && seriesItem['borderColor'])
    return seriesItem['borderColor'];

  // Style Defaults
  var options = chart.getOptions();
  var styleDefaults = options['styleDefaults'];
  return styleDefaults['borderColor'] != 'auto' ? styleDefaults['borderColor'] : null;
};

/**
 * Returns the border color for the specified data item.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {number} The border width.
 */
DvtChartStyleUtils.getBorderWidth = function(chart, seriesIndex, groupIndex) {
  // Data Override
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  if (dataItem && dataItem['borderWidth'])
    return dataItem['borderWidth'];

  // Series Override
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  if (seriesItem && seriesItem['borderWidth'])
    return seriesItem['borderWidth'];

  // Style Defaults
  var styleDefaults = chart.getOptions()['styleDefaults'];
  if (styleDefaults['borderWidth'] != 'auto')
    return styleDefaults['borderWidth'];

  // The borderWidth is reduced for scatter/bubble because it looks hairy otherwise
  return DvtChartTypeUtils.isScatterBubble(chart) || DvtChartTypeUtils.isLineArea(chart) ? 1.25 : 1;
};

/**
 * Returns the marker color for the specified data item.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {string} The marker color string.
 */
DvtChartStyleUtils.getMarkerColor = function(chart, seriesIndex, groupIndex) {
  if (!DvtChartStyleUtils.isMarkerDisplayed(chart, seriesIndex, groupIndex))
    return DvtChartStyleUtils.getColor(chart, seriesIndex, groupIndex);

  // Data Override: Note that the data object defines a single 'color' attribute
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  if (dataItem && dataItem['color'])
    return dataItem['color'];

  // Series Override
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  if (seriesItem && seriesItem['markerColor'])
    return seriesItem['markerColor'];

  // Style Defaults
  var options = chart.getOptions();
  var defaultMarkerColor = options['styleDefaults']['markerColor'];
  if (defaultMarkerColor) // Return the default if set
    return defaultMarkerColor;
  else {
    // Otherwise return the series color
    return DvtChartStyleUtils.getColor(chart, seriesIndex, groupIndex);
  }
};


/**
 * Returns the marker shape for the specified data item.  Returns the actual shape
 * if the marker shape is set to "auto".
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {string} The marker shape.
 */
DvtChartStyleUtils.getMarkerShape = function(chart, seriesIndex, groupIndex) {
  // Style Defaults
  var options = chart.getOptions();
  var shape = options['styleDefaults']['markerShape'];

  // Series Override
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  if (seriesItem && seriesItem['markerShape'])
    shape = seriesItem['markerShape'];

  // Data Override
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  if (dataItem && dataItem['markerShape'])
    shape = dataItem['markerShape'];

  // Convert automatic shape to actual shape
  if (shape == 'auto') {
    if (chart.getType() == 'bubble' || DvtChartStyleUtils.isRangeSeries(chart, seriesIndex))
      shape = 'circle';
    else {
      var styleIndex = DvtChartDataUtils.getSeriesStyleIndex(chart, seriesIndex);

      // Iterate through the shape ramp to find the right shape
      var shapeRamp = options['styleDefaults']['shapes'];
      var shapeIndex = styleIndex % shapeRamp.length;
      shape = shapeRamp[shapeIndex];
    }
  }

  return shape;
};


/**
 * Returns the marker size for the specified data item.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {number} The marker size.
 */
DvtChartStyleUtils.getMarkerSize = function(chart, seriesIndex, groupIndex) {
  var markerSize;
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  if (dataItem && dataItem['markerSize'] != null) // Data Override
    markerSize = Number(dataItem['markerSize']);
  else {
    var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
    if (seriesItem && seriesItem['markerSize'] != null) // Series Override
      markerSize = Number(seriesItem['markerSize']);
    else // Style Defaults
      markerSize = Number(chart.getOptions()['styleDefaults']['markerSize']);
  }

  // Scale down for chart overview
  if (DvtChartTypeUtils.isOverview(chart))
    markerSize = Math.ceil(markerSize * 0.6);

  return markerSize;
};


/**
 * Returns the whether markers are displayed for the specified line or area series.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {boolean} Whether markers should be displayed.
 */
DvtChartStyleUtils.isMarkerDisplayed = function(chart, seriesIndex, groupIndex) {
  var displayed;
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  if (dataItem && dataItem['markerDisplayed'] != null) // data item override
    displayed = dataItem['markerDisplayed'];
  else {
    var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
    if (seriesItem && seriesItem['markerDisplayed'] != null) // series item override
      displayed = seriesItem['markerDisplayed'];
    else // style defaults
      displayed = chart.getOptions()['styleDefaults']['markerDisplayed'];
  }

  if (displayed == 'on')
    return true;
  else if (displayed == 'off')
    return false;
  else
    return DvtChartTypeUtils.isScatterBubble(chart) || DvtChartStyleUtils.getLineType(chart, seriesIndex) == 'none';
};


/**
 * Returns the marker size for the specified data item.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {string} sourceType
 * @return {string} The marker source for the type passed in.
 */
DvtChartStyleUtils.getImageSource = function(chart, seriesIndex, groupIndex, sourceType) {
  var imageSource;
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);

  if (dataItem && dataItem[sourceType])
    // Data Override
    imageSource = dataItem[sourceType];
  else {
    // Series Override
    var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
    if (seriesItem && seriesItem[sourceType])
      imageSource = seriesItem[sourceType];
  }

  return imageSource;
};


/**
 * Returns the line width for the specified series.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {number} The line width.
 */
DvtChartStyleUtils.getLineWidth = function(chart, seriesIndex) {
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  var options = chart.getOptions();
  var lineWidth;

  if (seriesItem && seriesItem['lineWidth'])
    // Series Override
    lineWidth = seriesItem['lineWidth'];
  else if (options['styleDefaults']['lineWidth'])
    // Style Defaults
    lineWidth = options['styleDefaults']['lineWidth'];
  else if (DvtChartStyleUtils.getSeriesType(chart, seriesIndex) == 'lineWithArea')
    lineWidth = 2;
  else
    lineWidth = 3;

  // Scale down for chart overview
  if (DvtChartTypeUtils.isOverview(chart))
    lineWidth = Math.ceil(lineWidth * 0.6);

  return lineWidth;
};


/**
 * Returns the line style for the specified series.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {string} The line style.
 */
DvtChartStyleUtils.getLineStyle = function(chart, seriesIndex) {
  // Series Override
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  if (seriesItem && seriesItem['lineStyle'])
    return seriesItem['lineStyle'];

  // Style Defaults
  var options = chart.getOptions();
  return options['styleDefaults']['lineStyle'];
};


/**
 * Returns the line type for the specified series.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {string} The line type.
 */
DvtChartStyleUtils.getLineType = function(chart, seriesIndex) {
  var lineType;
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);

  if (seriesItem && seriesItem['lineType']) // Series Override
    lineType = seriesItem['lineType'];
  else // Style Defaults
    lineType = chart.getOptions()['styleDefaults']['lineType'];

  if (lineType == 'auto')
    lineType = DvtChartTypeUtils.isScatterBubble(chart) ? 'none' : 'straight';

  // Centered segmented/stepped are not supported for polar and scatter/bubble
  if (DvtChartTypeUtils.isPolar(chart) || DvtChartTypeUtils.isScatterBubble(chart)) {
    if (lineType == 'centeredSegmented')
      lineType = 'segmented';
    if (lineType == 'centeredStepped')
      lineType = 'stepped';
  }

  return lineType;
};


/**
 * Returns the bar spacing behavior.  Only applies for spark charts.
 * @param {dvt.Chart} chart
 * @return {string} The bar spacing behavior
 */
DvtChartStyleUtils.getBarSpacing = function(chart) {
  var options = chart.getOptions();
  return options['__sparkBarSpacing'];
};


/**
 * Returns the bar gap ratio.
 * @param {dvt.Chart} chart
 * @return {Number} The bar gap ratio, between 0 and 1
 */
DvtChartStyleUtils.getBarGapRatio = function(chart) {
  var cacheKey = 'barGapRatio';
  var barGapRatio = chart.getFromCache(cacheKey);
  if (barGapRatio)
    return barGapRatio;

  barGapRatio = chart.getOptions()['styleDefaults']['barGapRatio'];
  if (typeof(barGapRatio) == 'string' && barGapRatio.slice(-1) == '%') // parse percent input
    barGapRatio = Number(barGapRatio.slice(0, -1)) / 100;

  if (barGapRatio != null && !isNaN(barGapRatio))
    return barGapRatio;

  var categories = DvtChartDataUtils.getStackCategories(chart, 'bar');
  var numYStacks = categories['y'].length;
  var numY2Stacks = categories['y2'].length;
  var numStacks = DvtChartTypeUtils.isSplitDualY(chart) ? Math.max(numYStacks, numY2Stacks) : numYStacks + numY2Stacks;

  // Fall back to the default
  if (DvtChartTypeUtils.isPolar(chart))
    barGapRatio = (numStacks == 1) ? 0 : 0.25;
  else
    barGapRatio = (numStacks == 1) ? (0.37 + (0.26 / DvtChartDataUtils.getViewportGroupCount(chart))) : 0.25;

  chart.putToCache(cacheKey, barGapRatio);
  return barGapRatio;
};

/**
 * Returns the maxBarWidth (in pixels) of the bars.
 * @param {dvt.Chart} chart
 * @return {number}
 */
DvtChartStyleUtils.getMaxBarWidth = function(chart) {
  var maxBarWidth = chart.getOptions()['styleDefaults']['maxBarWidth'];
  return (maxBarWidth != null && !DvtChartTypeUtils.isPolar(chart)) ? maxBarWidth : Infinity;
};

/**
 * Returns the bar width for the specified series and group.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {number} The bar width.
 */
DvtChartStyleUtils.getBarWidth = function(chart, seriesIndex, groupIndex) {
  var ratio = DvtChartDataUtils.getZValue(chart, seriesIndex, groupIndex, 1) / chart.getOptions()['_averageGroupZ'];
  return Math.min(ratio * DvtChartStyleUtils.getGroupWidth(chart), DvtChartStyleUtils.getMaxBarWidth(chart));
};

/**
 * Returns the bar width for the specified stack category.
 * @param {dvt.Chart} chart
 * @param {string} category The stack category. Use the series name for unstacked charts.
 * @param {number} groupIndex
 * @param {boolean} isY2 Whether the stack is assigned to Y2.
 * @return {number} The stack width.
 */
DvtChartStyleUtils.getBarStackWidth = function(chart, category, groupIndex, isY2) {
  var cacheKey = isY2 ? 'y2BarStackWidth' : 'yBarStackWidth';
  var barStackWidth = chart.getFromCachedMap2D(cacheKey, category, groupIndex);
  if (barStackWidth)
    return barStackWidth;

  var ratio = DvtChartDataUtils.getBarCategoryZ(chart, category, groupIndex, isY2) / chart.getOptions()['_averageGroupZ'];
  barStackWidth = Math.min(ratio * DvtChartStyleUtils.getGroupWidth(chart), DvtChartStyleUtils.getMaxBarWidth(chart));
  chart.putToCachedMap2D(cacheKey, category, groupIndex, barStackWidth);
  return barStackWidth;
};

/**
 * Computes the offsets of the bar stack categories relative to the group coordinate and stores it in a map.
 * @param {dvt.Chart} chart
 * @param {Number} groupIndex
 * @param {Boolean} bStacked
 * @return {Object} An object containing two maps for y and y2 respectively. Each map contains the categories as the
 *    keys and the offsets as the values.
 */
DvtChartStyleUtils.getBarCategoryOffsetMap = function(chart, groupIndex, bStacked) {
  var cacheKey = 'barCategoryOffsetMap';
  var yOffsetMaps = chart.getFromCachedMap2D(cacheKey, groupIndex, bStacked);
  if (yOffsetMaps)
    return yOffsetMaps;

  var categories = DvtChartDataUtils.getStackCategories(chart, 'bar');
  var isMixedFreq = DvtChartAxisUtils.isMixedFrequency(chart);
  var isSplitDualY = DvtChartTypeUtils.isSplitDualY(chart);
  var yOffsetMap = {}, y2OffsetMap = {};
  var yTotalWidth = 0, y2TotalWidth = 0;
  var stackWidth, i;

  // Populate offset maps
  if (bStacked) { // Use stack categories to get the width of each stack
    // Iterate through the y-axis stack categories and store the offsets relative the the start coord of the y stack
    for (i = 0; i < categories['y'].length; i++) {
      stackWidth = DvtChartStyleUtils.getBarStackWidth(chart, categories['y'][i], groupIndex, false);
      if (isMixedFreq)
        yOffsetMap[categories['y'][i]] = -0.5 * stackWidth;
      else {
        yOffsetMap[categories['y'][i]] = yTotalWidth;
        yTotalWidth += stackWidth;
      }
    }

    if (!isSplitDualY)
      y2TotalWidth = yTotalWidth;

    // Iterate through the y2-axis stack categories and store the offsets relative the the start coord of the y2 stack
    for (i = 0; i < categories['y2'].length; i++) {
      stackWidth = DvtChartStyleUtils.getBarStackWidth(chart, categories['y2'][i], groupIndex, true);
      if (isMixedFreq)
        y2OffsetMap[categories['y2'][i]] = -0.5 * stackWidth;
      else {
        y2OffsetMap[categories['y2'][i]] = y2TotalWidth;
        y2TotalWidth += stackWidth;
      }
    }

    if (!isSplitDualY)
      yTotalWidth = y2TotalWidth;
  }
  else { // The width of each bar series item is the width of the stack
    for (var i = 0; i < DvtChartDataUtils.getSeriesCount(chart); i++) {
      var seriesType = DvtChartStyleUtils.getSeriesType(chart, i);
      if ((seriesType != 'bar' && seriesType != 'candlestick') || !DvtChartStyleUtils.isSeriesRendered(chart, i))
        continue;

      var isY2Series = DvtChartDataUtils.isAssignedToY2(chart, i);
      var category = DvtChartDataUtils.getStackCategory(chart, i);
      stackWidth = DvtChartStyleUtils.getBarWidth(chart, i, groupIndex);

      if (!isY2Series) {
        if (isMixedFreq)
          yOffsetMap[category] = -0.5 * stackWidth;
        else {
          yOffsetMap[category] = yTotalWidth;
          yTotalWidth += stackWidth;
        }
      }
      else {
        if (isMixedFreq)
          y2OffsetMap[category] = -0.5 * stackWidth;
        else {
          y2OffsetMap[category] = y2TotalWidth;
          y2TotalWidth += stackWidth;
        }
      }
    }
  }

  // Now shift each bar by half the total stack width
  for (var category in yOffsetMap)
    yOffsetMap[category] -= (!isSplitDualY && !bStacked) ? (yTotalWidth + y2TotalWidth) / 2 : yTotalWidth / 2;
  for (var category in y2OffsetMap)
    y2OffsetMap[category] -= (!isSplitDualY && !bStacked) ? (yTotalWidth + y2TotalWidth) / 2 - yTotalWidth : y2TotalWidth / 2;

  yOffsetMaps = {'y': yOffsetMap, 'y2': y2OffsetMap};
  chart.putToCachedMap2D(cacheKey, groupIndex, bStacked, yOffsetMaps);
  return yOffsetMaps;
};

/**
 * Returns the ratio of data item gaps to be used as a number from 0 to 1.
 * @param {dvt.Chart} chart
 * @return {number}
 */
DvtChartStyleUtils.getDataItemGaps = function(chart) {
  var options = chart.getOptions();

  if (DvtChartTypeUtils.isFunnel(chart) && options['styleDefaults']['funnelSliceGaps'] == 'on') {
    // Backwards compatibility for funnelSliceGaps
    return 1;
  }
  else if (options['styleDefaults']['sliceGaps'] != null) {
    // Backwards compatibility with sliceGaps, which is a number between 0 and 1
    return options['styleDefaults']['sliceGaps'];
  }
  else {
    // dataItemGaps: Currently a percentage string to be converted to ratio or "auto"
    var dataItemGaps = options['styleDefaults']['dataItemGaps'];
    if (dataItemGaps == 'auto') {
      // Auto is 50% for 2D charts, 0% for 3D charts
      dataItemGaps = options['styleDefaults']['threeDEffect'] == 'on' ? '0%' : '50%';
    }

    // Process the percentage value
    var percentIndex = dataItemGaps && dataItemGaps.indexOf ? dataItemGaps.indexOf('%') : -1;
    if (percentIndex >= 0) {
      dataItemGaps = dataItemGaps.substring(0, percentIndex);
      return dataItemGaps / 100;
    }

    // Not a valid string, return 0.
    return 0;
  }
};

/**
 * Returns true if the specified data item is selectable.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {boolean} True if the data item is selectable.
 */
DvtChartStyleUtils.isSelectable = function(chart, seriesIndex, groupIndex) {
  // Series Override
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  if (seriesItem && seriesItem['_selectable'] == 'off')
    return false;

  // Otherwise the requirements are that selection is enabled and the object corresponds to a data item.
  return chart.isSelectionSupported() && seriesIndex >= 0 && groupIndex >= 0;
};

/**
 * Returns true if the specified series should be rendered.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {boolean} True if the series should be rendered.
 */
DvtChartStyleUtils.isSeriesRendered = function(chart, seriesIndex) {
  // Check if any category is hidden
  var hiddenCategories = DvtChartStyleUtils.getHiddenCategories(chart);
  if (hiddenCategories.length > 0) {
    if (dvt.ArrayUtils.hasAnyItem(hiddenCategories, DvtChartDataUtils.getSeriesCategories(chart, seriesIndex))) {
      return false;
    }
  }

  return true;

};


/**
 * Returns true if the specified data item should be rendered.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {boolean} True if the series should be rendered.
 */
DvtChartStyleUtils.isDataItemRendered = function(chart, seriesIndex, groupIndex) {
  if (!DvtChartStyleUtils.isSeriesRendered(chart, seriesIndex))
    return false;
  else {
    // Check if any category is hidden
    var hiddenCategories = DvtChartStyleUtils.getHiddenCategories(chart);
    if (hiddenCategories.length > 0) {
      if (DvtChartTypeUtils.isPie(chart) || DvtChartTypeUtils.isFunnel(chart))
        groupIndex = 0;

      if (dvt.ArrayUtils.hasAnyItem(hiddenCategories, DvtChartDataUtils.getDataItemCategories(chart, seriesIndex, groupIndex))) {
        return false;
      }
    }
  }

  return true;
};


/**
 * Returns the display animation for the specified chart.
 * @param {dvt.Chart} chart
 * @return {string}
 */
DvtChartStyleUtils.getAnimationOnDisplay = function(chart) {
  return chart.getOptions()['animationOnDisplay'];
};


/**
 * Returns the data change animation for the specified chart.
 * @param {dvt.Chart} chart
 * @return {string}
 */
DvtChartStyleUtils.getAnimationOnDataChange = function(chart) {
  return chart.getOptions()['animationOnDataChange'];
};


/**
 * Returns the animation duration in seconds for the specified chart.  This duration is
 * intended to be passed to the animatino handler, and is not in the same units
 * as the API.
 * @param {dvt.Chart} chart
 * @return {number} The animation duration in seconds.
 */
DvtChartStyleUtils.getAnimationDuration = function(chart) {
  return dvt.StyleUtils.getTimeMilliseconds(chart.getOptions()['styleDefaults']['animationDuration']) / 1000;
};


/**
 * Returns the animation indicators property for the specified chart.
 * @param {dvt.Chart} chart
 * @return {string}  The animation indicators value.
 */
DvtChartStyleUtils.getAnimationIndicators = function(chart) {
  return chart.getOptions()['styleDefaults']['animationIndicators'];
};


/**
 * Returns the animation indicators up color.
 * @param {dvt.Chart} chart
 * @return {string}  The animation indicator up color.
 */
DvtChartStyleUtils.getAnimationUpColor = function(chart) {
  return chart.getOptions()['styleDefaults']['animationUpColor'];
};


/**
 * Returns the animation indicators down color.
 * @param {dvt.Chart} chart
 * @return {string}  The animation indicator down color.
 */
DvtChartStyleUtils.getAnimationDownColor = function(chart) {
  return chart.getOptions()['styleDefaults']['animationDownColor'];
};


/**
 * Returns the array containing the hidden categories for the chart.
 * @param {dvt.Chart} chart
 * @return {array}
 */
DvtChartStyleUtils.getHiddenCategories = function(chart) {
  var options = chart.getOptions();
  if (!options['hiddenCategories'])
    options['hiddenCategories'] = [];

  return options['hiddenCategories'];
};

/**
 * Returns the array containing the highlighted categories for the chart.
 * @param {dvt.Chart} chart
 * @return {array}
 */
DvtChartStyleUtils.getHighlightedCategories = function(chart) {
  var options = chart.getOptions();
  if (!options['highlightedCategories'])
    options['highlightedCategories'] = [];

  return options['highlightedCategories'];
};

/**
 * Returns the inner color of the selection feedback.
 * @param {dvt.Chart} chart
 * @return {string}
 */
DvtChartStyleUtils.getSelectedInnerColor = function(chart) {
  return chart.getOptions()['styleDefaults']['selectedInnerColor'];
};


/**
 * Returns the outer color of the selection feedback.
 * @param {dvt.Chart} chart
 * @return {string}
 */
DvtChartStyleUtils.getSelectedOuterColor = function(chart) {
  return chart.getOptions()['styleDefaults']['selectedOuterColor'];
};

/**
 * Returns whether the selected items are highlighted.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartStyleUtils.isSelectionHighlighted = function(chart) {
  var effect = chart.getOptions()['styleDefaults']['selectionEffect'];
  return effect == 'highlight' || effect == 'highlightAndExplode';
};

/**
 * Returns whether the selected items are exploded (only applies to pie).
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartStyleUtils.isSelectionExploded = function(chart) {
  var effect = chart.getOptions()['styleDefaults']['selectionEffect'];
  return effect == 'explode' || effect == 'highlightAndExplode';
};

/**
 * Returns the data label style for the specified data point.
 * @param {dvt.Chart} chart
 * @param {Number} seriesIndex The series index.
 * @param {Number} groupIndex The group index.
 * @param {Color} dataColor The color of the marker this is associated with.
 * @param {string} position The position returned by the getDataLabelPosition function, not the API values.
 * @param {number} type (optional) Data label type: low, high, or value.
 * @return {string} The data label, null if the index is invalid.
 */
DvtChartStyleUtils.getDataLabelStyle = function(chart, seriesIndex, groupIndex, dataColor, position, type) {
  var labelStyleArray = [];

  var contrastingColor;
  if (dataColor && (DvtChartStyleUtils.getSeriesType(chart, seriesIndex) == 'bar' || DvtChartTypeUtils.isBubble(chart))
       && (position == 'center' || position == 'inBottom' || position == 'inTop' || position == 'inRight' || position == 'inLeft')) {
    contrastingColor = (DvtChartStyleUtils.getPattern(chart, seriesIndex, groupIndex) != null) ? '#000000' : dvt.ColorUtils.getContrastingTextColor(dataColor);
    labelStyleArray.push(new dvt.CSSStyle('color: ' + contrastingColor + ';'));
  }
  else
    labelStyleArray.push(new dvt.CSSStyle('color: #333333;'));

  labelStyleArray.push(DvtChartStyleUtils._parseLowHighArray(chart.getOptions()['styleDefaults']['dataLabelStyle'], type));
  labelStyleArray.push(new dvt.CSSStyle(DvtChartStyleUtils._parseLowHighArray(DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex)['labelStyle'], type)));

  // In high contrast mode, force use of contrasting color and ignore custom color
  if (contrastingColor && dvt.Agent.isHighContrast())
    labelStyleArray.push(new dvt.CSSStyle('color: ' + contrastingColor + ';'));

  return dvt.CSSStyle.mergeStyles(labelStyleArray);
};

/**
 * Returns the data label position for the specified data point.
 * @param {dvt.Chart} chart
 * @param {Number} seriesIndex The series index.
 * @param {Number} groupIndex The group index.
 * @param {number} type (optional) Data label type: low, high, or value.
 * @param {boolean} isStackLabel true if label for stack cummulative, false otherwise
 * @return {string} The data label position. Uses an internal list different from the API values.
 * Possible values are: center, inLeft, inRight, inTop, inBottom, left, right, top, bottom, none
 */
DvtChartStyleUtils.getDataLabelPosition = function(chart, seriesIndex, groupIndex, type, isStackLabel) {
  var data = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  var position;

  if (isStackLabel)
    position = 'outsideBarEdge';
  else {
    position = data['labelPosition'];

    if (!position)
      position = chart.getOptions()['styleDefaults']['dataLabelPosition'];
    position = DvtChartStyleUtils._parseLowHighArray(position, type);

    if (position == 'none')
      return 'none';
  }

  var bRTL = dvt.Agent.isRightToLeft(chart.getCtx());
  var bHorizontal = DvtChartTypeUtils.isHorizontal(chart);
  var bPolar = DvtChartTypeUtils.isPolar(chart);

  if (DvtChartTypeUtils.isFunnel(chart)) {
    return 'center';
  }
  // Bar series
  else if (DvtChartStyleUtils.getSeriesType(chart, seriesIndex) == 'bar') {
    // Only center is supported for polar bar
    if (position == 'center' || bPolar)
      return 'center';


    // Only insideBarEdge, outsideBarEdge, and center are supported for cartesian bar.
    // outsideBarEdge is not supported for stacked because it'll be covered by the bar above.
    var isStacked = DvtChartTypeUtils.isStacked(chart);
    if (position != 'insideBarEdge') {
      if (isStacked && !isStackLabel)
        return 'center';
      else if (position != 'outsideBarEdge')
        position = 'insideBarEdge';
    }
    if (position == 'insideBarEdge' && !isStacked) {
      var style = chart.getOptions()['styleDefaults']['dataLabelStyle'];
      var textDim;

      if (bHorizontal) {
        var text = DvtChartDataUtils.getDataLabel(chart, seriesIndex, groupIndex, type);
        textDim = dvt.TextUtils.getTextStringWidth(chart.getCtx(), text, style);
      }
      else
        textDim = dvt.TextUtils.getTextStringHeight(chart.getCtx(), style);

      var barInfo = DvtChartDataUtils.getBarInfo(chart, seriesIndex, groupIndex);
      var barHeight = Math.abs(barInfo.baseCoord - barInfo.yCoord);

      if (barHeight <= textDim)
        position = 'outsideBarEdge';
    }

    // Determine if the label is positioned in the low or high position
    var bNegative;
    if (type == 'low')
      bNegative = data['low'] <= data['high'];
    else if (type == 'high')
      bNegative = data['high'] < data['low'];
    else
      bNegative = DvtChartDataUtils.getValue(chart, seriesIndex, groupIndex) < 0;

    if (position == 'outsideBarEdge') {
      if (bHorizontal)
        return ((!bNegative && !bRTL) || (bNegative && bRTL)) ? 'right' : 'left';
      else
        return bNegative ? 'bottom' : 'top';
    }
    else { // insideBarEdge
      if (bHorizontal)
        return ((!bNegative && !bRTL) || (bNegative && bRTL)) ? 'inRight' : 'inLeft';
      else
        return bNegative ? 'inBottom' : 'inTop';
    }
  }

  // Scatter, Bubble, Line, or Area series
  else {
    if (position == 'center')
      return 'center';
    if (position == 'belowMarker')
      return 'bottom';
    if (position == 'aboveMarker')
      return 'top';

    if (position != 'afterMarker' && position != 'beforeMarker') {
      if (DvtChartTypeUtils.isBubble(chart))
        return 'center';
      else if (type == 'low' && !bPolar) {
        if (!bHorizontal)
          return 'bottom';
        else
          position = 'beforeMarker';
      }
      else if (type == 'high' && !bPolar) {
        if (!bHorizontal)
          return 'top';
        else
          position = 'afterMarker';
      }
      else
        position = 'afterMarker';
    }

    if ((!bRTL && position == 'afterMarker') || (bRTL && position == 'beforeMarker'))
      return 'right';
    else
      return 'left';
  }
};

/**
 * Parses the data label attribute. If a single value is provided, it will apply to all labels. If an array of
 * two values is provided, the first and second value will apply to the low and high label respectively.
 * @param {object} value The attribute value.
 * @param {type} type Data label type: low, high, or value.
 * @return {object} The value corresponding to the type.
 * @private
 */
DvtChartStyleUtils._parseLowHighArray = function(value, type) {
  if (value instanceof Array)
    return (type == 'high') ? value[1] : value[0];
  else
    return value;
};


/**
 * Returns whether the overview is rendered.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartStyleUtils.isOverviewRendered = function(chart) {
  var options = chart.getOptions();
  return DvtChartTypeUtils.isOverviewSupported(chart) && options['overview']['rendered'] != 'off';
};


/**
 * Returns the height of the overview scrollbar.
 * @param {dvt.Chart} chart
 * @return {number} The height.
 */
DvtChartStyleUtils.getOverviewHeight = function(chart) {
  var options = chart.getOptions();
  var height = options['overview']['height'];
  if (height == null)
    height = DvtChartAxisUtils.hasTimeAxis(chart) ? 0.25 : 0.2; // use default ratio

  return DvtChartStyleUtils.getSizeInPixels(height, chart.getHeight());
};


/**
 * Computes the size of a subcomponent in pixels by parsing the user input.
 * @param {object} size The size input given by the user. It can be in percent, pixels, or number.
 * @param {number} totalSize The total size of the component in pixels.
 * @return {number} The size of the subcomponent in pixels.
 */
DvtChartStyleUtils.getSizeInPixels = function(size, totalSize) {
  if (typeof(size) == 'string') {
    if (size.slice(-1) == '%')
      return totalSize * Number(size.slice(0, -1)) / 100;
    else if (size.slice(-2) == 'px')
      return Number(size.slice(0, -2));
    else
      size = Number(size);
  }

  if (typeof(size) == 'number') {
    if (size <= 1) // assume to be ratio
      return totalSize * size;
    else // assume to be absolute size in pixels
      return size;
  }
  else
    return 0;
};

/**
 * Returns the plot area background color.
 * @param {dvt.Chart} chart
 * @param {Boolean} useDefault Whether it should fall back to the white default if the background color is not defined.
 * @return {String}
 */
DvtChartStyleUtils.getBackgroundColor = function(chart, useDefault) {
  var options = chart.getOptions();
  if (options['plotArea']['backgroundColor'])
    return options['plotArea']['backgroundColor'];
  else
    return useDefault ? '#FFFFFF' : null;
};

/**
 * Returns the delay before mouse over event is triggerd.
 * This is used for highlighting in chart.
 * @param {dvt.Chart} chart
 * @return {number} The delay in ms.
 */
DvtChartStyleUtils.getHoverBehaviorDelay = function(chart) {
  var delay = chart.getOptions()['styleDefaults']['hoverBehaviorDelay'];
  if (delay) {
    delay = dvt.StyleUtils.getTimeMilliseconds(delay);

    if (DvtChartTypeUtils.isScatterBubble(chart) || DvtChartTypeUtils.isLine(chart)) {
      return 0.75 * delay;
    } else {
      return 1.25 * delay;
    }
    return delay;
  } else {
    return 0;
  }
};

/**
 * Returns true if the marker stroke should be optimized by moving onto a container.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartStyleUtils.optimizeMarkerStroke = function(chart) {
  return DvtChartTypeUtils.isScatterBubble(chart);
};

/**
 * Returns the chart x-axis group width.
 * Use this method instead of calling chart.xAxis.getInfo().getGroupWidth() directly for better performance.
 * @param {dvt.Chart} chart
 * @return {number}
 */
DvtChartStyleUtils.getGroupWidth = function(chart) {
  // Use the cached value if it has been computed before
  var cacheKey = 'groupWidth';
  var width = chart.getFromCache(cacheKey);
  if (width == null) {
    width = chart.xAxis.getInfo().getGroupWidth();
    chart.putToCache(cacheKey, width);
  }
  return width;
};

/**
 * Returns true if the chart is bar and stack label is enabled.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartStyleUtils.isStackLabelRendered = function(chart) {
  // To have stack labels, the attribute must be set and the chart must be a supporting type.
  var options = chart.getOptions();
  if (DvtChartTypeUtils.isStacked(chart) && options['stackLabel'] == 'on')
    return true;

  return false;
};
/**
 * Text related utility functions.
 * @class
 */
var DvtChartTextUtils = new Object();

dvt.Obj.createSubclass(DvtChartTextUtils, dvt.Obj);


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
 * @return {DvtText} The created text object. Can be null if no text object could be created in the given space.
 */
DvtChartTextUtils.createText = function(eventManager, container, textString, cssStyle, x, y, width, height) {
  var text = new dvt.OutputText(container.getCtx(), textString, x, y);
  text.setCSSStyle(cssStyle);

  if (dvt.TextUtils.fitText(text, width, height, container)) {
    // Associate with logical object to support truncation
    eventManager.associate(text, new dvt.SimpleObjPeer(text.getUntruncatedTextString()));
    return text;
  }
  else
    return null;
};

/**
 * Returns whether the chart has title, subtitle, or footnote.
 * @param {dvt.Chart} chart
 * @return {boolean} True if the chart has title, subtitle, or footnote.
 */
DvtChartTextUtils.areTitlesRendered = function(chart) {
  var options = chart.getOptions();
  return options['title']['text'] || options['subtitle']['text'] || options['footnote']['text'];
};
/**
 * Utility functions for dvt.Chart.
 * @class
 */
var DvtChartTooltipUtils = new Object();

dvt.Obj.createSubclass(DvtChartTooltipUtils, dvt.Obj);


/**
 * Returns the datatip color for the tooltip of a data item with the given series
 * and group indices.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {string} The datatip color.
 */
DvtChartTooltipUtils.getDatatipColor = function(chart, seriesIndex, groupIndex) {
  if (DvtChartTypeUtils.isStock(chart))
    return DvtChartStyleUtils.getColor(chart, 0, groupIndex);

  return DvtChartStyleUtils.getColor(chart, seriesIndex, groupIndex);
};


/**
 * Returns the datatip string for a data item with the given series and group indices.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {boolean} isTabular Whether the datatip is in a table format.
 * @return {string} The datatip string.
 */
DvtChartTooltipUtils.getDatatip = function(chart, seriesIndex, groupIndex, isTabular) {
  if (DvtChartTypeUtils.isSpark(chart) || DvtChartTypeUtils.isOverview(chart))
    return null;

  // Only data items have tooltips
  if (seriesIndex < 0 || groupIndex < 0)
    return null;

  // Custom Tooltip Support
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);

  // Custom Tooltip via Function
  var tooltipFunc = chart.getOptions()['tooltip'];

  if (isTabular && tooltipFunc) {
    var tooltipManager = chart.getCtx().getTooltipManager(DvtChartTooltipUtils.isDataCursorEnabled(chart) ? DvtChartDataCursor.TOOLTIP_ID : null);
    var dataContext = DvtChartDataUtils.getDataContext(chart, seriesIndex, groupIndex);

    // Get customized labels
    if (DvtChartTypeUtils.isPie(chart)) {
      var slice = DvtChartPieUtils.getSliceBySeriesIndex(chart, seriesIndex);
      dataContext['label'] = slice.getSliceLabelString();
    }
    else {
      dataContext['label'] = DvtChartDataUtils.getDataLabel(chart, seriesIndex, groupIndex);
    }

    return tooltipManager.getCustomTooltip(tooltipFunc, dataContext);
  }

  // Custom Tooltip via Short Desc
  if (dataItem && dataItem['shortDesc'] != null)
    return dataItem['shortDesc'];

  // Default Tooltip Support
  var datatip = '';
  if (DvtChartTypeUtils.isStock(chart))
    datatip += DvtChartTooltipUtils.getStockDatatip(chart, 0, groupIndex, isTabular);
  else {
    datatip = DvtChartTooltipUtils._addSeriesDatatip(datatip, chart, seriesIndex, groupIndex, isTabular);
    datatip = DvtChartTooltipUtils._addGroupDatatip(datatip, chart, seriesIndex, groupIndex, isTabular);
    datatip = DvtChartTooltipUtils._addValueDatatip(datatip, chart, seriesIndex, groupIndex, isTabular);
  }

  return DvtChartTooltipUtils._processDatatip(datatip, chart, isTabular);
};


/**
 * Returns the datatip string for an "Other" slice.
 * @param {dvt.Chart} chart
 * @param {number} otherValue The value of the "Other" slice
 * @param {boolean} isTabular Whether the datatip is in a table format.
 * @return {string} The datatip string.
 */
DvtChartTooltipUtils.getOtherSliceDatatip = function(chart, otherValue, isTabular) {
  var otherStr = dvt.Bundle.getTranslatedString(dvt.Bundle.CHART_PREFIX, 'LABEL_OTHER', null);

  // Custom Tooltip via Function
  var tooltipFunc = chart.getOptions()['tooltip'];
  if (isTabular && tooltipFunc) {
    var slice = DvtChartPieUtils.getSliceBySeriesIndex(chart, null);
    var dataContext = DvtChartDataUtils.getDataContext(chart, null, 0);
    dataContext['label'] = slice.getSliceLabelString();
    return chart.getCtx().getTooltipManager().getCustomTooltip(tooltipFunc, dataContext);
  }

  // Default Tooltip
  var datatip = '';
  datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'series', 'SERIES', otherStr, isTabular);
  datatip = DvtChartTooltipUtils._addGroupDatatip(datatip, chart, 0, 0, isTabular);
  datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'value', 'VALUE', otherValue, isTabular);
  return DvtChartTooltipUtils._processDatatip(datatip, chart, isTabular);
};


/**
 * Final processing for the datatip.
 * @param {string} datatip The current datatip.
 * @param {dvt.Chart} chart The owning chart instance.
 * @param {boolean} isTabular Whether the datatip is in a table format.
 * @return {string} The updated datatip.
 * @private
 */
DvtChartTooltipUtils._processDatatip = function(datatip, chart, isTabular) {
  // Don't render tooltip if empty
  if (datatip == '')
    return null;

  // Add outer table tags
  if (isTabular)
    return dvt.HtmlTooltipManager.createStartTag('table', chart.getOptions()['styleDefaults']['_tooltipStyle']) + datatip + '<\/table>';

  return datatip;
};


/**
 * Returns the tooltip for the reference object.
 * @param {dvt.Chart} chart
 * @param {object} refObj The reference object definition.
 * @param {object} axisType The type of axis could be 'yAxis', 'y2Axis' or 'xAxis'.
 * @param {object} index The index of the reference object in the axis.
 * @return {string} The tooltip for the reference object.
 */
DvtChartTooltipUtils.getRefObjTooltip = function(chart, refObj, axisType, index) {
  // Custom Tooltip via Function -- only if refObj['id'] is defined for backwards compat
  var tooltipFunc = chart.getOptions()['tooltip'];
  if (tooltipFunc && refObj['id'] != null) {
    var tooltipManager = chart.getCtx().getTooltipManager(DvtChartTooltipUtils.isDataCursorEnabled(chart) ? DvtChartDataCursor.TOOLTIP_ID : null);
    var dataContext = {
      'id': DvtChartRefObjUtils.getId(refObj),
      'label': refObj['text'],
      'data': chart.getRawOptions()[axisType]['referenceObjects'][index],
      'value': refObj['value'],
      'low': DvtChartRefObjUtils.getLowValue(refObj),
      'high': DvtChartRefObjUtils.getHighValue(refObj),
      'color': DvtChartRefObjUtils.getColor(refObj)
    };
    return tooltipManager.getCustomTooltip(tooltipFunc, dataContext);
  }

  return refObj['shortDesc'];
};

/**
 * Returns the datatip string for a data item with the given series and group indices.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {boolean} isTabular Whether the datatip is in a table format.
 * @return {string} The datatip string.
 */
DvtChartTooltipUtils.getStockDatatip = function(chart, seriesIndex, groupIndex, isTabular) {
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);

  // Default Tooltip
  var datatip = DvtChartTooltipUtils._addGroupDatatip('', chart, seriesIndex, groupIndex, isTabular);
  if (dataItem) {
    datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'open', 'OPEN', dataItem['open'], isTabular);
    datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'close', 'CLOSE', dataItem['close'], isTabular);
    datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'high', 'HIGH', dataItem['high'], isTabular);
    datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'low', 'LOW', dataItem['low'], isTabular);
    datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'volume', 'VOLUME', dataItem['volume'], isTabular);
  }
  return datatip;
};

/**
 * Adds the series string to the datatip.
 * @param {string} datatip The current datatip.
 * @param {dvt.Chart} chart The owning chart instance.
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {boolean} isTabular Whether the datatip is in a table format.
 * @return {string} The updated datatip.
 * @private
 */
DvtChartTooltipUtils._addSeriesDatatip = function(datatip, chart, seriesIndex, groupIndex, isTabular) {
  var seriesLabel = DvtChartDataUtils.getSeriesLabel(chart, seriesIndex);
  return DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'series', 'SERIES', seriesLabel, isTabular);
};

/**
 * Adds the group string to the datatip.
 * @param {string} datatip The current datatip.
 * @param {dvt.Chart} chart The owning chart instance.
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {boolean} isTabular Whether the datatip is in a table format.
 * @return {string} The updated datatip.
 * @private
 */
DvtChartTooltipUtils._addGroupDatatip = function(datatip, chart, seriesIndex, groupIndex, isTabular) {
  var groupLabel;
  if (DvtChartAxisUtils.hasTimeAxis(chart)) {
    var valueFormat = DvtChartTooltipUtils.getValueFormat(chart, 'group');
    var value = DvtChartDataUtils.getXValue(chart, seriesIndex, groupIndex);
    groupLabel = DvtChartTooltipUtils.formatDateValue(valueFormat, new Date(value));
    if (groupLabel == null)
      groupLabel = chart.xAxis.getInfo().formatLabel(value);
  }
  else
    groupLabel = DvtChartDataUtils.getGroupLabel(chart, groupIndex);

  var numLevels = DvtChartDataUtils.getNumLevels(chart);
  var defaultLabel = 'GROUP';
  if (numLevels == 1 || !(dvt.ArrayUtils.isArray(groupLabel)))
    datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'group', defaultLabel, groupLabel, isTabular);
  else { // hierarchical groups
    for (var levelIndex = numLevels - 1; levelIndex >= 0; levelIndex--) {
      datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'group', defaultLabel, groupLabel[levelIndex], isTabular, levelIndex);
      if (groupLabel[levelIndex])
        defaultLabel = null;
    }
  }
  return datatip;
};


/**
 * Adds the value string to the datatip.
 * @param {string} datatip The current datatip.
 * @param {dvt.Chart} chart The owning chart instance.
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {boolean} isTabular Whether the datatip is in a table format.
 * @return {string} The updated datatip.
 * @private
 */
DvtChartTooltipUtils._addValueDatatip = function(datatip, chart, seriesIndex, groupIndex, isTabular) {
  var val = DvtChartDataUtils.getValue(chart, seriesIndex, groupIndex);
  var xVal = DvtChartDataUtils.getXValue(chart, seriesIndex, groupIndex);
  var zVal = DvtChartDataUtils.getZValue(chart, seriesIndex, groupIndex);
  var lowVal = DvtChartDataUtils.getLowValue(chart, seriesIndex, groupIndex);
  var highVal = DvtChartDataUtils.getHighValue(chart, seriesIndex, groupIndex);

  if (DvtChartTypeUtils.isScatterBubble(chart)) {
    // Add the x and y values
    datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'x', 'X', xVal, isTabular);
    datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'y', 'Y', val, isTabular);

    // Also add the z value for a bubble chart
    if (DvtChartTypeUtils.isBubble(chart))
      datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'z', 'Z', zVal, isTabular);
  }
  else if (DvtChartTypeUtils.isPie(chart)) {
    datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'value', 'VALUE', val, isTabular);
  }
  else if (DvtChartTypeUtils.isFunnel(chart)) {
    datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'value', 'VALUE', val, isTabular);
    var target = DvtChartDataUtils.getTargetValue(chart, seriesIndex);
    if (target != null)
      datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'targetValue', 'TARGET_VALUE', target, isTabular);
  }
  else if (DvtChartTypeUtils.isBLAC(chart)) {
    var type = DvtChartDataUtils.isAssignedToY2(chart, seriesIndex) ? 'y2' : 'y';

    // Ad min/max for range bar/area. Add z-value if defined for bar width.
    if (lowVal != null || highVal != null) {
      datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'high', 'HIGH', highVal, isTabular);
      datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'low', 'LOW', lowVal, isTabular);
      if (zVal != null)
        datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'z', 'Z', zVal, isTabular);
    }
    else if (zVal != null) {
      datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, type, 'Y', val, isTabular);
      datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, 'z', 'Z', zVal, isTabular);
    }
    else
      datatip = DvtChartTooltipUtils._addDatatipRow(datatip, chart, type, 'VALUE', val, isTabular);
  }
  return datatip;
};


/**
 * Adds a row of item to the datatip string.
 * @param {string} datatip The current datatip.
 * @param {dvt.Chart} chart The owning chart instance.
 * @param {number} type The item type, e.g. series, group, x, etc.
 * @param {number} defaultLabel The bundle resource string for the default label.
 * @param {number} value The item value.
 * @param {boolean} isTabular Whether the datatip is in a table format.
 * @param {number} index (optional) The index of the tooltipLabel string to be used
 * @return {string} The updated datatip.
 * @private
 */
DvtChartTooltipUtils._addDatatipRow = function(datatip, chart, type, defaultLabel, value, isTabular, index) {
  if (value == null || value === '')
    return datatip;

  var options = chart.getOptions()['styleDefaults'];
  var valueFormat = DvtChartTooltipUtils.getValueFormat(chart, type);
  var tooltipDisplay = valueFormat['tooltipDisplay'];

  if (!tooltipDisplay || tooltipDisplay == 'auto') {
    // maintain old tooltip attrs for backwards compat
    if ((type == 'series' && options['seriesTooltipType'] == 'none') ||
        (type == 'group' && (options['groupTooltipType'] == 'none' || DvtChartTypeUtils.isPie(chart) || DvtChartTypeUtils.isFunnel(chart))) ||
        ((type != 'series' && type != 'group' && type != 'label') && options['valueTooltipType'] == 'none'))
      tooltipDisplay = 'off';
  }

  if (tooltipDisplay == 'off')
    return datatip;

  // Create tooltip label
  var tooltipLabel;
  if (typeof valueFormat['tooltipLabel'] === 'string')
    tooltipLabel = valueFormat['tooltipLabel'];
  else if (dvt.ArrayUtils.isArray(valueFormat['tooltipLabel']))
    tooltipLabel = valueFormat['tooltipLabel'][index ? index : 0];

  if (tooltipLabel == null) {
    if (defaultLabel == null) // non-innermost hierarchical group labels
      tooltipLabel = '';
    else {
      // : Use date instead of group for time axis chart tooltips. Only doing this for JET right now until
      // 1.1.1, after which we use the options.translations across fwks.
      if (defaultLabel == 'GROUP' && DvtChartAxisUtils.hasTimeAxis(chart))
        tooltipLabel = dvt.Bundle.getTranslation(chart.getOptions(), 'labelDate', dvt.Bundle.CHART_PREFIX, 'LABEL_GROUP');
      else
        tooltipLabel = dvt.Bundle.getTranslatedString(dvt.Bundle.CHART_PREFIX, 'LABEL_' + defaultLabel, '');
    }
  }

  // Create tooltip value
  if (type != 'series' && type != 'group')
    value = DvtChartTooltipUtils.formatValue(chart.getCtx(), valueFormat, value);

  if (isTabular) {
    var isRTL = dvt.Agent.isRightToLeft(chart.getCtx());
    options['tooltipLabelStyle'].setStyle(dvt.CSSStyle.TEXT_ALIGN, isRTL ? 'left' : 'right');
    options['tooltipValueStyle'].setStyle(dvt.CSSStyle.TEXT_ALIGN, isRTL ? 'right' : 'left');

    return datatip +
        '<tr>' +
        dvt.HtmlTooltipManager.createStartTag('td', options['tooltipLabelStyle']) + tooltipLabel + '<\/td>' +
        dvt.HtmlTooltipManager.createStartTag('td', options['tooltipValueStyle']) + value + '<\/td>' +
        '<\/tr>';
  }
  else {
    if (datatip.length > 0)
      datatip += '<br>';

    return datatip + dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'COLON_SEP_LIST', [tooltipLabel, value]);
  }
};


/**
 * Returns the valueFormat of the specified type.
 * @param {dvt.Chart} chart
 * @param {string} type The valueFormat type, e.g. series, group, or x.
 * @return {object} The valueFormat.
 */
DvtChartTooltipUtils.getValueFormat = function(chart, type) {
  var valueFormats = chart.getOptions()['valueFormats'];
  if (!valueFormats)
    return {};

  for (var i = 0; i < valueFormats.length; i++) {
    if (valueFormats[i]['type'] == type)
      return valueFormats[i];
  }

  // For chart with time axis, if group valueFormat is not defined, fall back to x.
  if (type == 'group' && DvtChartAxisUtils.hasTimeAxis(chart))
    return DvtChartTooltipUtils.getValueFormat(chart, 'x');

  // For BLAC charts, if y/y2 valueFormat is not defined, fall back to value.
  if ((type == 'y' || type == 'y2' || type == 'min' || type == 'max') && DvtChartTypeUtils.isBLAC(chart))
    return DvtChartTooltipUtils.getValueFormat(chart, 'value');

  return {};
};


/**
 * Formats value with the converter from the valueFormat.
 * @param {dvt.Context} context
 * @param {object} valueFormat
 * @param {number} value The value to format.
 * @param {number} min (optional) Min value of the axis corresponding to the value.  This should be provided only if the
 *                     label should be formatted in the context of the axis extents.
 * @param {number} max (optional) Max value of the axis corresponding to the value.  This should be provided only if the
 *                     label should be formatted in the context of the axis extents.
 * @param {number} majorIncrement (optional) major increment of the axis corresponding to the value.  This should be
 *                                provided only if the label should be formatted in the context of the axis extents.
 * @return {string} The formatted value string.
 */
DvtChartTooltipUtils.formatValue = function(context, valueFormat, value, min, max, majorIncrement) {
  var scaling = 'auto';
  var autoPrecision = 'on';
  var converter;
  // override from valueFormat
  if (valueFormat['scaling'])
    scaling = valueFormat['scaling'];
  if (valueFormat['autoPrecision'])
    autoPrecision = valueFormat['autoPrecision'];
  if (valueFormat['converter'])
    converter = valueFormat['converter'];

  // Retrieve the extent information
  min = (min != null) ? min : value;
  max = (max != null) ? max : value;
  majorIncrement = (majorIncrement != null) ? majorIncrement : 0;

  // Create the formatter
  var formatter = new dvt.LinearScaleAxisValueFormatter(context, min, max, majorIncrement, scaling, autoPrecision);
  if (converter && (converter['getAsString'] || converter['format']))
    return formatter.format(value, converter);
  else
    return formatter.format(value);
};

/**
 * Formats date with the converter from the valueFormat.
 * @param {object} valueFormat
 * @param {number} date The date to format.
 * @return {string} The formatted date string.
 */
DvtChartTooltipUtils.formatDateValue = function(valueFormat, date) {
  var converter = valueFormat['converter'];
  if (!converter)
    return null;
  if (converter['getAsString'])
    return converter['getAsString'](date);
  if (converter['format'])
    return converter['format'](date);
  return null;
};


/**
 * Returns whether or not the data cursor is enabled
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTooltipUtils.isDataCursorEnabled = function(chart) {
  if (DvtChartTypeUtils.isPie(chart) || DvtChartTypeUtils.isFunnel(chart) || DvtChartTypeUtils.isPolar(chart))
    return false;

  var options = chart.getOptions();
  if (options['dataCursor'] == 'on')
    return true;
  if (options['dataCursor'] == 'off')
    return false;

  // auto
  return dvt.Agent.isTouchDevice() && DvtChartTypeUtils.isLineArea(chart);
};

/**
 * Returns the data cursor behavior
 * @param {dvt.Chart} chart
 * @return {string}
 */
DvtChartTooltipUtils.getDataCursorBehavior = function(chart) {
  var dataCursorBehavior = chart.getOptions()['dataCursorBehavior'];

  if (dataCursorBehavior == 'snap')
    return DvtChartDataCursor.BEHAVIOR_SNAP;
  if (dataCursorBehavior == 'smooth')
    return DvtChartDataCursor.BEHAVIOR_SMOOTH;

  // auto
  return DvtChartTypeUtils.isLineArea(chart) ? DvtChartDataCursor.BEHAVIOR_SMOOTH : DvtChartDataCursor.BEHAVIOR_SNAP;
};
/**
 * Utility functions for dvt.Chart.
 * @class
 */
var DvtChartTypeUtils = new Object();

dvt.Obj.createSubclass(DvtChartTypeUtils, dvt.Obj);

/** @private @const */
DvtChartTypeUtils._SUPPORTED_TYPES = ['bar', 'line', 'area', 'lineWithArea', 'combo',
                                      'pie', 'bubble', 'scatter', 'funnel', 'stock'];

/**
 * Returns true if the chart's type is valid.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isValidType = function(chart) {
  return dvt.ArrayUtils.getIndex(DvtChartTypeUtils._SUPPORTED_TYPES, chart.getType()) >= 0;
};

/**
 * Returns true if the chart is a spark.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isSpark = function(chart) {
  return chart.getOptions()['__spark'];
};


/**
 * Returns true if the chart is an overview background.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isOverview = function(chart) {
  return chart.getOptions()['_isOverview'];
};


/**
 * Returns true if the chart is a combo type.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isCombo = function(chart) {
  return chart.getType() == 'combo';
};


/**
 * Returns true if the chart is a vertical type.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isVertical = function(chart) {
  return !DvtChartTypeUtils.isHorizontal(chart) && !DvtChartTypeUtils.isPolar(chart);
};


/**
 * Returns true if the chart is a horizontal type.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isHorizontal = function(chart) {
  return chart.getOptions()['orientation'] == 'horizontal' && !DvtChartTypeUtils.isPolar(chart) && !DvtChartTypeUtils.isStock(chart)
      && (DvtChartTypeUtils.isBLAC(chart) || DvtChartTypeUtils.isFunnel(chart));
};


/**
 * Returns true if the chart is polar.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isPolar = function(chart) {
  return chart.getOptions()['coordinateSystem'] == 'polar';
};


/**
 * Returns true if the chart series should be stacked.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isStacked = function(chart) {
  // To be stacked, the attribute must be set and the chart must be a supporting type.
  var options = chart.getOptions();
  if (options['stack'] != 'on' || DvtChartAxisUtils.isMixedFrequency(chart))
    return false;

  return DvtChartTypeUtils.isBLAC(chart);
};


/**
 * Returns true if the chart is a bar graph.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isBar = function(chart) {
  return chart.getType() == 'bar';
};

/**
 * Returns true if the chart is a stock chart.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isStock = function(chart) {
  return chart.getType() == 'stock';
};

/**
 * Returns true if the chart is a line graph.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isLine = function(chart) {
  return chart.getType() == 'line';
};

/**
 * Returns true if the chart is a line with area graph.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isLineWithArea = function(chart) {
  return chart.getType() == 'lineWithArea';
};

/**
 * Returns true if the chart is an area graph.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isArea = function(chart) {
  return chart.getType() == 'area';
};


/**
 * Returns true if the chart is a scatter graph.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isScatter = function(chart) {
  return chart.getType() == 'scatter';
};


/**
 * Returns true if the chart is a bubble graph.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isBubble = function(chart) {
  return chart.getType() == 'bubble';
};


/**
 * Returns true if the chart is a pie graph.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isPie = function(chart) {
  return chart.getType() == 'pie';
};


/**
 * Returns true if the chart is a funnel graph.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isFunnel = function(chart) {
  return chart.getType() == 'funnel';
};


/**
 * Returns true if the chart supports dual-y.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isDualY = function(chart) {
  // Verify the chart type
  if (!DvtChartTypeUtils.hasAxes(chart) || DvtChartTypeUtils.isScatterBubble(chart) || DvtChartTypeUtils.isPolar(chart))
    return false;

  // Dual-Y
  return true;
};

/**
 * Returns true if the chart is split dual-Y.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isSplitDualY = function(chart) {
  if (DvtChartTypeUtils.isStock(chart) && DvtChartDataUtils.hasVolumeSeries(chart) && !DvtChartTypeUtils.isOverview(chart))
    return true;

  return chart.getOptions()['splitDualY'] == 'on' &&
      DvtChartTypeUtils.hasY2Data(chart) && !DvtChartTypeUtils.hasY2DataOnly(chart);
};

/**
 * Returns true if the chart is type bar, line, area, combo, or stock.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isBLAC = function(chart) {
  var type = chart.getType();
  return (type == 'bar' || type == 'line' || type == 'area' || type == 'lineWithArea' || type == 'combo' || type == 'stock');
};


/**
 * Returns true if the chart is type scatter or bubble.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isScatterBubble = function(chart) {
  var type = chart.getType();
  return (type == 'scatter' || type == 'bubble');
};

/**
 * Returns true if the chart is type line, area, or lineWithArea.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isLineArea = function(chart) {
  var type = chart.getType();
  return (type == 'line' || type == 'area' || type == 'lineWithArea');
};


/**
 * Returns whether zoom and scroll is supported for the chart type
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isScrollSupported = function(chart) {
  return !DvtChartTypeUtils.isPie(chart) && !DvtChartTypeUtils.isFunnel(chart) && !DvtChartTypeUtils.isPolar(chart);
};


/**
 * Returns whether overview scrollbar is supported for the chart type
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isOverviewSupported = function(chart) {
  return DvtChartTypeUtils.isBLAC(chart) && DvtChartTypeUtils.isVertical(chart);
};


/**
 * Returns whether horizontal scrollbar is supported for the chart type
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isHorizScrollbarSupported = function(chart) {
  var direction = DvtChartEventUtils.getZoomDirection(chart);
  if (DvtChartTypeUtils.isPolar(chart))
    return false;
  return (DvtChartTypeUtils.isBLAC(chart) && DvtChartTypeUtils.isVertical(chart)) || (DvtChartTypeUtils.isScatterBubble(chart) && direction != 'y');
};


/**
 * Returns whether vertical scrollbar is supported for the chart type
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.isVertScrollbarSupported = function(chart) {
  var direction = DvtChartEventUtils.getZoomDirection(chart);
  if (DvtChartTypeUtils.isPolar(chart))
    return false;
  return (DvtChartTypeUtils.isBLAC(chart) && DvtChartTypeUtils.isHorizontal(chart)) || (DvtChartTypeUtils.isScatterBubble(chart) && direction != 'x');
};


/**
 * Returns true if the chart has axes.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.hasAxes = function(chart) {
  return !(chart.getType() == 'pie' || chart.getType() == 'funnel');
};


/**
 * Returns true if the chart has y2 data items only.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.hasY2DataOnly = function(chart) {
  if (!DvtChartTypeUtils.isDualY(chart))
    return false;

  // Verify that all the series are y2
  return DvtChartDataUtils.getY2SeriesCount(chart, null, true) == DvtChartDataUtils.getSeriesCount(chart);
};


/**
 * Returns true if the chart has y2 data items.
 * @param {dvt.Chart} chart
 * @param {string} type Optional series type to look for.
 * @return {boolean}
 */
DvtChartTypeUtils.hasY2Data = function(chart, type) {
  if (!DvtChartTypeUtils.isDualY(chart))
    return false;

  // Verify the chart has at least one y2 series
  return DvtChartDataUtils.getY2SeriesCount(chart, null, true) > 0;
};


/**
 * Returns true if the chart has y2 data items.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.hasY2BarData = function(chart) {
  return DvtChartTypeUtils.hasY2Data(chart, 'bar');
};


/**
 * @param {dvt.Chart} chart
 * @return {boolean} true if one of the series type is bar.
 */
DvtChartTypeUtils.hasBarSeries = function(chart) {
  return DvtChartTypeUtils._hasSeriesType(chart, 'bar');
};

/**
 * Returns true if one of the series type is stock.
 * @param {dvt.Chart} chart
 * @return {boolean}
 */
DvtChartTypeUtils.hasCandlestickSeries = function(chart) {
  return DvtChartTypeUtils._hasSeriesType(chart, 'candlestick');
};

/**
 * @param {dvt.Chart} chart
 * @return {boolean} true if one of the series type is line.
 */
DvtChartTypeUtils.hasLineSeries = function(chart) {
  return DvtChartTypeUtils._hasSeriesType(chart, 'line');
};

/**
 * @param {dvt.Chart} chart
 * @return {boolean} true if one of the series type is area.
 */
DvtChartTypeUtils.hasAreaSeries = function(chart) {
  return DvtChartTypeUtils._hasSeriesType(chart, 'area');
};

/**
 * @param {dvt.Chart} chart
 * @return {boolean} true if one of the series type is lineWithArea.
 */
DvtChartTypeUtils.hasLineWithAreaSeries = function(chart) {
  return DvtChartTypeUtils._hasSeriesType(chart, 'lineWithArea');
};

/**
 * @param {dvt.Chart} chart
 * @param {string} type The series type.
 * @return {boolean} True if one of the series is the specified series type. Only works for BLAC.
 * @private
 */
DvtChartTypeUtils._hasSeriesType = function(chart, type) {
  if (DvtChartTypeUtils.isBLAC(chart)) {
    var seriesCount = DvtChartDataUtils.getSeriesCount(chart);

    for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
      // Ignore the series if it isn't rendered
      if (!DvtChartStyleUtils.isSeriesRendered(chart, seriesIndex))
        continue;
      else if (DvtChartStyleUtils.getSeriesType(chart, seriesIndex) == type)
        return true;
    }
  }
  return false;
};

/**
 * @param {dvt.Chart} chart
 * @return {boolean} true if one of the series is centeredSegmented or centeredStepped line or area.
 */
DvtChartTypeUtils.hasCenteredSeries = function(chart) {
  if (!DvtChartTypeUtils.isBLAC(chart))
    return false;

  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
    // Ignore the series if it isn't rendered
    if (!DvtChartStyleUtils.isSeriesRendered(chart, seriesIndex))
      continue;
    else if (DvtChartStyleUtils.getSeriesType(chart, seriesIndex) != 'bar') { // line or area
      var lineType = DvtChartStyleUtils.getLineType(chart, seriesIndex);
      if (lineType == 'centeredSegmented' || lineType == 'centeredStepped')
        return true;
    }
  }
  return false;
};

/**
 * @param {dvt.Chart} chart
 * @return {boolean} true if one of the series is segmented or stepped line or area.
 */
DvtChartTypeUtils.hasUncenteredSeries = function(chart) {
  if (!DvtChartTypeUtils.isBLAC(chart))
    return false;

  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
    // Ignore the series if it isn't rendered
    if (!DvtChartStyleUtils.isSeriesRendered(chart, seriesIndex))
      continue;
    else if (DvtChartStyleUtils.getSeriesType(chart, seriesIndex) != 'bar') { // line or area
      var lineType = DvtChartStyleUtils.getLineType(chart, seriesIndex);
      if (lineType == 'segmented' || lineType == 'stepped')
        return true;
    }
  }
  return false;
};

/**
 * @param {dvt.Chart} chart
 * @return {boolean} true if the chart is a standalone plot area.
 */
DvtChartTypeUtils.isStandalonePlotArea = function(chart) {
  var options = chart.getOptions();
  if (DvtChartTextUtils.areTitlesRendered(chart))
    return false;
  if (options['legend']['rendered'] != 'off')
    return false;
  if (DvtChartAxisUtils.isAxisRendered(chart, 'x'))
    return false;
  if (DvtChartAxisUtils.isAxisRendered(chart, 'y'))
    return false;
  if (DvtChartAxisUtils.isAxisRendered(chart, 'y2'))
    return false;
  return true;
};

/**
 * @param {dvt.Chart} chart
 * @return {boolean} true if the chart is a standalone x-axis.
 */
DvtChartTypeUtils.isStandaloneXAxis = function(chart) {
  var options = chart.getOptions();
  if (DvtChartTextUtils.areTitlesRendered(chart))
    return false;
  if (options['legend']['rendered'] != 'off')
    return false;
  if (options['plotArea']['rendered'] != 'off')
    return false;
  if (DvtChartAxisUtils.isAxisRendered(chart, 'y'))
    return false;
  if (DvtChartAxisUtils.isAxisRendered(chart, 'y2'))
    return false;
  return true;
};

/**
 * @param {dvt.Chart} chart
 * @return {boolean} true if the chart is a standalone y-axis.
 */
DvtChartTypeUtils.isStandaloneYAxis = function(chart) {
  var options = chart.getOptions();
  if (DvtChartTextUtils.areTitlesRendered(chart))
    return false;
  if (options['legend']['rendered'] != 'off')
    return false;
  if (DvtChartAxisUtils.isAxisRendered(chart, 'x'))
    return false;
  if (options['plotArea']['rendered'] != 'off')
    return false;
  if (DvtChartAxisUtils.isAxisRendered(chart, 'y2'))
    return false;
  return true;
};

/**
 * @param {dvt.Chart} chart
 * @return {boolean} true if the chart is a standalone y2-axis.
 */
DvtChartTypeUtils.isStandaloneY2Axis = function(chart) {
  var options = chart.getOptions();
  if (DvtChartTextUtils.areTitlesRendered(chart))
    return false;
  if (options['legend']['rendered'] != 'off')
    return false;
  if (DvtChartAxisUtils.isAxisRendered(chart, 'x'))
    return false;
  if (DvtChartAxisUtils.isAxisRendered(chart, 'y'))
    return false;
  if (options['plotArea']['rendered'] != 'off')
    return false;
  return true;
};
/**
 * Bubble chart utility functions for dvt.Chart.
 * @class
 */
var DvtChartMarkerUtils = new Object();

dvt.Obj.createSubclass(DvtChartMarkerUtils, dvt.Obj);


/** @private */
DvtChartMarkerUtils._MIN_BUBBLE_SIZE = 6;


/** @private */
DvtChartMarkerUtils._MAX_BUBBLE_SIZE_RATIO = 0.5;


/**
 * Calculates the bubble sizes for the chart.
 * @param {dvt.Chart} chart
 * @param {dvt.Rectangle} availSpace
 */
DvtChartMarkerUtils.calcBubbleSizes = function(chart, availSpace) {
  // Calculate the min and max z values
  var minMax = DvtChartDataUtils.getMinMaxValue(chart, 'z');
  var minZ = minMax['min'];
  var maxZ = minMax['max'];

  // Calculate the max allowed bubble sizes
  var minSize = DvtChartMarkerUtils._MIN_BUBBLE_SIZE;
  var maxSize = DvtChartMarkerUtils._MAX_BUBBLE_SIZE_RATIO * Math.min(availSpace.w, availSpace.h);

  // Loop through the data and update the sizes
  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  var bIncludeHiddenSeries = DvtChartEventUtils.getHideAndShowBehavior(chart) == 'withoutRescale';
  for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
    if (!bIncludeHiddenSeries && !DvtChartStyleUtils.isSeriesRendered(chart, seriesIndex))
      continue;

    var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
    var numGroups = seriesItem['items'] ? seriesItem['items'].length : 0;
    for (var j = 0; j < numGroups; j++) {
      var dataItem = seriesItem['items'][j];

      // If a z value exists, calculate and set the marker size
      if (dataItem) {
        var markerSize = dvt.LayoutUtils.getBubbleSize(dataItem['z'], minZ, maxZ, minSize, maxSize);
        dataItem['markerSize'] = markerSize;
      }
    }
  }

  // The rest of the code is to determine how much the axis needs to be extended to cover the bubble
  // radii. _x/yAxisBubbleRatio will be used in DvtChartMarkerUtils.getBubbleAxisRadius().
  // NOTE: The computed values here are approximations, so they can be grossly inaccurate in some
  //       circumstances. We can't get the exact values at this point since the axes are not rendered yet, but
  //       we need to approximate now in order to layout the axes correctly.
  var axisWidth, axisHeight;
  if (DvtChartTypeUtils.isPolar(chart)) {
    axisWidth = Infinity; // polar x-axis is circular
    axisHeight = chart.getRadius();
  }
  else {
    // At this point, we still don't know the actual dimensions of the axes since they're not rendered yet, so we
    // approximate based on the tick label height
    axisWidth = availSpace.w - 2.4 * DvtChartAxisUtils.getTickLabelHeight(chart, 'y');
    axisHeight = availSpace.h - 1.6 * DvtChartAxisUtils.getTickLabelHeight(chart, 'x');
  }

  // Subtract the axis width and height based on the largest bubble size. This is to approximate the extra axis
  // space that is allocated to accommodate the bubbles near the plot area borders.
  axisWidth -= 0.5 * maxSize;
  axisHeight -= 0.5 * maxSize;

  // Store the computed ratios in the options cache
  var optionsCache = chart.getOptionsCache();

  var xAxisValueRange = DvtChartMarkerUtils._getAxisValueRange(chart, 'x');
  optionsCache['_xAxisBubbleRatio'] = xAxisValueRange / axisWidth;

  var yAxisValueRange = DvtChartMarkerUtils._getAxisValueRange(chart, 'y');
  optionsCache['_yAxisBubbleRatio'] = yAxisValueRange / axisHeight;
};

/**
 * Estimates how much axis range (in values, not pixels) the bubble radius would span.
 * @param {dvt.Chart} chart
 * @param {string} axisType 'x' or 'y'
 * @param {number} markerSize The size of the bubble marker
 * @return {number}
 */
DvtChartMarkerUtils.getBubbleAxisRadius = function(chart, axisType, markerSize) {
  if (!markerSize)
    return 0;

  var axisBubbleRatio = chart.getOptionsCache()['_' + axisType + 'AxisBubbleRatio'];
  return (markerSize / 2) * axisBubbleRatio;
};

/**
 * Returns the axis value range, disregarding the bubble radii (which we don't know yet at this point)
 * @param {dvt.Chart} chart
 * @param {string} type The axis type, 'x' or 'y'.
 * @return {number} Axis value range.
 * @private
 */
DvtChartMarkerUtils._getAxisValueRange = function(chart, type) {
  var axisOptions = chart.getOptions()[type + 'Axis'];
  var isLog = DvtChartAxisUtils.isLog(chart, type);
  var zeroBaseline = !isLog && DvtChartAxisUtils.getBaselineScaling(chart, type) == 'zero';
  var minMax = DvtChartDataUtils.getMinMaxValue(chart, type, true);

  var min = axisOptions['min'];
  if (min == null)
    min = zeroBaseline ? Math.min(0, minMax['min']) : minMax['min'];

  var max = axisOptions['max'];
  if (max == null)
    max = zeroBaseline ? Math.max(0, minMax['max']) : minMax['max'];

  if (isLog && max > 0 && min > 0)
    return (max == min) ? 6 : dvt.Math.log10(max / min);
  else
    return (max == min) ? 60 : max - min;
};

/**
 * Sorts the markers in order of descending marker size.
 * @param {array} markers The array of dvt.SimpleMarker objects or objects with size properties.
 */
DvtChartMarkerUtils.sortMarkers = function(markers) {
  markers.sort(DvtChartMarkerUtils._compareSize);
};

/**
 * Sorts the markers in order of descending marker size.
 * @param {array} markers The array of markerInfo objects with size properties.
 */
DvtChartMarkerUtils.sortMarkerInfos = function(markers) {
  markers.sort(DvtChartMarkerUtils._compareInfoSize);
};

/**
 * Compare function to sort markers in order of descending size.
 * @param {dvt.SimpleMarker | object} a
 * @param {dvt.SimpleMarker | object} b
 * @return {number} Comparison.
 * @private
 */
DvtChartMarkerUtils._compareSize = function(a, b) {
  return b.getSize() - a.getSize();
};

/**
 * Compare function to sort markerInfo objects in order of descending size.
 * @param {object} a
 * @param {object} b
 * @return {number} Comparison.
 * @private
 */
DvtChartMarkerUtils._compareInfoSize = function(a, b) {
  // We want to sort the markers from biggest to smallest
  return b.size - a.size;
};

/**
 * Returns true if the specified marker would be fully obscured.
 * @param {dvt.PixelMap} pixelMap
 * @param {number} markerX
 * @param {number} markerY
 * @param {number} markerSize
 * @return {boolean}
 */
DvtChartMarkerUtils.checkPixelMap = function(pixelMap, markerX, markerY, markerSize) {
  // Note: This function is conservative about the pixels occupied.
  var halfSize = markerSize / 2;
  var x1 = Math.max(Math.floor(markerX - halfSize), 0);
  var y1 = Math.max(Math.floor(markerY - halfSize), 0);
  var x2 = Math.max(Math.ceil(markerX + halfSize), 0);
  var y2 = Math.max(Math.ceil(markerY + halfSize), 0);
  return pixelMap.isObscured(x1, y1, x2, y2);
};


/**
 * Updates the pixel map for the specified marker.
 * @param {dvt.Map2D} pixelMap
 * @param {number} markerX
 * @param {number} markerY
 * @param {number} markerSize
 * @param {number} alpha
 */
DvtChartMarkerUtils.updatePixelMap = function(pixelMap, markerX, markerY, markerSize, alpha) {
  // Note: This function uses several approximations. Only 80% of the marker size is counted as occupied, partly to
  // account for marker shape. The coords are rounded, since the browser will likely anti-alias in the direction of
  // rounding.
  var halfSize = markerSize * 0.4;
  var x1 = Math.max(Math.round(markerX - halfSize), 0);
  var x2 = Math.max(Math.round(markerX + halfSize), 0);
  var y1 = Math.max(Math.round(markerY - halfSize), 0);
  var y2 = Math.max(Math.round(markerY + halfSize), 0);
  pixelMap.obscure(x1, y1, x2, y2, alpha);
};
/**
 * Utility functions for pie chart.
 * @class
 */
var DvtChartPieUtils = new Object();

dvt.Obj.createSubclass(DvtChartPieUtils, dvt.Obj);

DvtChartPieUtils.OTHER_SLICE_SERIES_ID = '_dvtOther';


/**
 * Generates the slice ID of a pie series
 * @param {dvt.Chart} chart The pie chart
 * @param {Number} seriesIndex The series index
 * @return {DvtChartDataItem} The slice ID
 */
DvtChartPieUtils.getSliceId = function(chart, seriesIndex) {
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, 0);
  var id = dataItem ? dataItem['id'] : null;
  var series = DvtChartDataUtils.getSeries(chart, seriesIndex);
  var group = DvtChartDataUtils.getGroup(chart, 0);
  return new DvtChartDataItem(id, series, group);
};


/**
 * Generates the slice ID of a pie "Other" series
 * @param {dvt.Chart} chart The pie chart
 * @return {DvtChartDataItem} The slice ID
 */
DvtChartPieUtils.getOtherSliceId = function(chart) {
  var group = DvtChartDataUtils.getGroup(chart, 0);
  return new DvtChartDataItem(null, DvtChartPieUtils.OTHER_SLICE_SERIES_ID, group);
};


/**
 * Returns an array of series indices that will be rendered on the pie chart.
 * The array is sorted if sorting is enabled, and does not include the series that will be grouped under "Other" slice.
 * The array includes hidden series and series with non-positive values.
 * @param {dvt.Chart} chart The pie chart
 * @return {Array} The array containing series indices
 */
DvtChartPieUtils.getRenderedSeriesIndices = function(chart) {
  return DvtChartPieUtils._getSeriesIndicesArrays(chart).rendered;
};


/**
 * Returns whether the pie has at least one series (visible or hidden) that is grouped under "Other".
 * @param {dvt.Chart} chart The pie chart
 * @return {Boolean}
 */
DvtChartPieUtils.hasOtherSeries = function(chart) {
  return DvtChartPieUtils._getSeriesIndicesArrays(chart).other.length > 0;
};


/**
 * Computes the total value of the "Other" slice. Only includes visible series with positive values.
 * @param {dvt.Chart} chart The pie chart
 * @return {Number} The total value
 */
DvtChartPieUtils.getOtherValue = function(chart) {
  var otherSeries = DvtChartPieUtils._getSeriesIndicesArrays(chart).other;
  var otherValue = 0;
  for (var i = 0; i < otherSeries.length; i++) {
    var seriesIndex = otherSeries[i];
    // Only add the values of visible series
    if (DvtChartStyleUtils.isSeriesRendered(chart, seriesIndex)) {
      var value = DvtChartDataUtils.getValue(chart, seriesIndex, 0);
      if (value > 0)
        otherValue += value;
    }
  }
  return otherValue;
};


/**
 * Generates the slice IDs of the series that are grouped under "Other".
 * @param {dvt.Chart} chart The pie chart
 * @return {Array} The array containing slice IDs
 */
DvtChartPieUtils.getOtherSliceIds = function(chart) {
  var otherSeries = DvtChartPieUtils._getSeriesIndicesArrays(chart).other;
  var seriesIds = [];
  for (var i = 0; i < otherSeries.length; i++) {
    var seriesIndex = otherSeries[i];
    seriesIds.push(DvtChartPieUtils.getSliceId(chart, seriesIndex));
  }
  return seriesIds;
};


/**
 * Returns whether the "Other" slice is selected. It is selected if all the series in it are selected.
 * @param {dvt.Chart} chart The pie chart
 * @param {Array} selected An array containing the ID objects of the selected slices.
 * @return {Boolean} Whether the "Other" slice is selected
 */
DvtChartPieUtils.isOtherSliceSelected = function(chart, selected) {
  var otherIds = DvtChartPieUtils.getOtherSliceIds(chart);

  for (var j = 0; j < otherIds.length; j++) {
    var sliceId = otherIds[j];
    var sliceSelected = false;

    // Check if this slice is in the selected list
    for (var i = 0; i < selected.length; i++) {
      if ((selected[i]['id'] && sliceId.getId() === selected[i]['id']) ||
          (sliceId.getSeries() === selected[i]['series'] && sliceId.getGroup() === selected[i]['group'])) {
        sliceSelected = true;
        break;
      }
    }

    if (!sliceSelected)
      return false;
  }

  return true;
};


/**
 * Divides the series indices into two arrays. The first array contains the series that are not grouped under "Other",
 * sorted by value if sorting is enabled. The second array contains the series that belongs to "Other". The arrays
 * include hidden series and series with non-positive values.
 * @param {dvt.Chart} chart The pie chart
 * @return {Object} An object in the form {rendered: firstArray, other: secondArray}. firstArray and secondArray are
 *     as described above.
 * @private
 */
DvtChartPieUtils._getSeriesIndicesArrays = function(chart) {
  var renderedSeries = [];
  var otherSeries = [];

  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  var options = chart.getOptions();
  var otherThreshold = options['otherThreshold'] * DvtChartPieUtils.getTotalValue(chart);

  for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
    // Skip the series if its value is 0 or negative
    var value = DvtChartDataUtils.getValue(chart, seriesIndex, 0);

    // Do not use "Other" if the threshold is zero
    if (otherThreshold > 0 && value < otherThreshold)
      otherSeries.push(seriesIndex);
    else
      renderedSeries.push(seriesIndex);
  }

  // Sort the slices if enabled
  if (options['sorting'] == 'ascending') {
    renderedSeries.sort(function(a, b) {
      return DvtChartDataUtils.getValue(chart, a, 0) - DvtChartDataUtils.getValue(chart, b, 0);
    });
  }
  else if (options['sorting'] == 'on' || options['sorting'] == 'descending') {
    renderedSeries.sort(function(a, b) {
      return DvtChartDataUtils.getValue(chart, b, 0) - DvtChartDataUtils.getValue(chart, a, 0);
    });
  }

  return {rendered: renderedSeries, other: otherSeries};
};


/**
 * Computes the total value of a pie chart, including hidden series.
 * @param {dvt.Chart} chart The pie chart.
 */
DvtChartPieUtils.getTotalValue = function(chart) {
  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  var totalValue = 0;

  for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
    // Skip the series if its value is 0 or negative
    var value = DvtChartDataUtils.getValue(chart, seriesIndex, 0);
    if (value > 0) {
      totalValue += value;
    }
  }

  return totalValue;
};


/**
 * Returns the pie slice explode for the specified series.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @return {number} The pie slice explode from 0 to 100.
 */
DvtChartPieUtils.getSliceExplode = function(chart, seriesIndex) {
  // Series Override
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  if (seriesItem && seriesItem['pieSliceExplode'])
    return seriesItem['pieSliceExplode'];
  else
    return 0;
};


/**
 * Returns the show popup behaviors of "Other" slice.
 * @param {dvt.Chart} chart
 * @return {array}
 */
DvtChartPieUtils.getOtherSliceShowPopupBehaviors = function(chart) {
  // Use the info from the first contained slice
  var otherSliceIds = DvtChartPieUtils.getOtherSliceIds(chart);
  if (otherSliceIds && otherSliceIds.length >= 1) {
    var firstDataItem = otherSliceIds[0];
    var firstDataItemSeriesIndex = DvtChartDataUtils.getSeriesIndex(chart, firstDataItem.getSeries());
    var stampId = DvtChartDataUtils.getDataItem(chart, firstDataItemSeriesIndex, 0)['_id'];
    return chart.getShowPopupBehaviors(stampId);
  }
};

/**
 * Returns the slice corresponding to the seriesIndex or null.
 * If seriesIndex is null or seriesIndex is part of "other", the "other" slice is returned
 * @param {dvt.Chart} chart
 * @param {Number} seriesIndex
 * @return {DvtChartPieSlice} slice
 */
DvtChartPieUtils.getSliceBySeriesIndex = function(chart, seriesIndex) {
  var slices = chart.pieChart.__getSlices();
  for (var i = 0; i < slices.length; i++) {
    if (slices[i].getSeriesIndex() == seriesIndex)
      return slices[i];
  }
  return null;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 * @class DvtChartPieRenderUtils
 */
var DvtChartPieRenderUtils = function() {
};

dvt.Obj.createSubclass(DvtChartPieRenderUtils, dvt.Obj);


/** @final  @type {String}  */
DvtChartPieRenderUtils.TWOD = '2D';


/** @final  @type {String}  */
DvtChartPieRenderUtils.THREED = '3D';


/** @final  @type {String}  */
DvtChartPieRenderUtils.CRUST = 'CRUST';


/** @final  @type {String}  */
DvtChartPieRenderUtils.SIDE = 'SIDE';


/** @final  @type {String}  */
DvtChartPieRenderUtils.BORDER = 'BORDER';

// surface types
DvtChartPieRenderUtils.SURFACE_CRUST = 0;
DvtChartPieRenderUtils.SURFACE_LEFT = 1;
DvtChartPieRenderUtils.SURFACE_RIGHT = 2;
DvtChartPieRenderUtils.SURFACE_TOP = 3;

/**
 * Returns a <code>Point</code> object representing a point at a given
 * angle at a distance specified by the rx and ry radius from the center cx, cy.
 *
 * Function reflects input angle over the y-axis.  It then scales the
 * cosine and sine of this angle by rx and ry, and then translates
 * the cosine and sine values by cx and cy.  The reflected, scaled, and
 * translated angle's cosine and sine values are then returned
 *
 * @param {number} angle A <code>Number</code> representing the desired angle in degrees.
 * @param {number} cx    A <code>Number</code> indicating the center horizontal position.
 * @param {number} cy    A <code>Number</code> indicating the center vertical position.
 * @param {number} rx    A <code>Number</code> indicating the horizontal radius.
 * @param {number} ry    A <code>Number</code> indicating the vertical radius.
 *
 * @return {object} A point object with the calculated x and y fields.
 */

// original code taken from com.oracle.dvt.shape.draw.utils.RenderUtils
// function originally called rotatePoint -- but that was a serious misnomer
DvtChartPieRenderUtils.reflectAngleOverYAxis = function(angle, cx, cy, rx, ry) {
  var radian = dvt.Math.degreesToRads(360 - angle);
  var cosine = Math.cos(radian);
  var sine = Math.sin(radian);

  return {x: cx + (cosine * rx), y: cy + (sine * ry)};
};


/**
 * Returns an array of colors (with no alphas) for use in creating a gradient, based on a base color and where the gradient
 * will be applied
 *
 * @param {String} baseColor
 * @param {String} style Either DvtChartPieRenderUtils.TWOD, DvtChartPieRenderUtils.THREED, DvtChartPieRenderUtils.CRUST,
 *                          DvtChartPieRenderUtils.SIDE, or DvtChartPieRenderUtils.BORDER
 * @param {string} skin
 * @return {Array}
 */
DvtChartPieRenderUtils.getGradientColors = function(baseColor, style, skin) {
  if (skin && skin != dvt.CSSStyle.SKIN_SKYROS) {
    if (style == DvtChartPieRenderUtils.TWOD || style == DvtChartPieRenderUtils.THREED)
      return [dvt.ColorUtils.adjustHSL(baseColor, 0, - 0.04, - 0.05), dvt.ColorUtils.adjustHSL(baseColor, 0, - 0.09, 0.04)];
    else if (style == DvtChartPieRenderUtils.CRUST)
      return [dvt.ColorUtils.adjustHSL(baseColor, 0, - 0.04, - 0.05), dvt.ColorUtils.adjustHSL(baseColor, 0, 0, - 0.14)];
    else if (style == DvtChartPieRenderUtils.SIDE)
      return [dvt.ColorUtils.adjustHSL(baseColor, 0, - 0.10, 0.06), dvt.ColorUtils.adjustHSL(baseColor, 0, - 0.04, - 0.05)];
  }
  else if (style == DvtChartPieRenderUtils.TWOD) {
    var arColors = [];
    arColors[0] = dvt.ColorUtils.getRGB(dvt.ColorUtils.getPastel(baseColor, 0.1));
    arColors[1] = arColors[0];
    arColors[2] = dvt.ColorUtils.getRGB(dvt.ColorUtils.getDarker(baseColor, 0.9));
    return arColors;
  }
  else if (style == DvtChartPieRenderUtils.BORDER)
    return ['#FFFFFF', '#000000', '#000000'];
  else {
    var c = dvt.ColorUtils.getRGB(dvt.ColorUtils.getDarker(baseColor, 0.88));
    var c1 = dvt.ColorUtils.getRGB(dvt.ColorUtils.getPastel(baseColor, .05));
    var c2 = dvt.ColorUtils.getRGB(dvt.ColorUtils.getPastel(baseColor, .15));
    var c3 = dvt.ColorUtils.getRGB(dvt.ColorUtils.getPastel(baseColor, .35));

    if (style == DvtChartPieRenderUtils.CRUST)
      return [c, c2, c3, c];
    else if (style == 'SIDE')
      return [c, c3];
    else if (style == '3D')
      return [c3, c2, c, c1, c3];
  }
};


/**
 * Returns an array of alphas for use in creating a gradient, based on an initial alpha value and where the gradient
 * will be applied
 *
 * @param {number} baseAlpha
 * @param {String} style Either DvtChartPieRenderUtils.TWOD, DvtChartPieRenderUtils.THREED, DvtChartPieRenderUtils.CRUST,
 *                          DvtChartPieRenderUtils.SIDE, or DvtChartPieRenderUtils.BORDER
 *
 * @return {Array}
 */
DvtChartPieRenderUtils.getGradientAlphas = function(baseAlpha, style) {
  var alpha = (baseAlpha == null || isNaN(baseAlpha) || baseAlpha == 0) ? 1.0 : baseAlpha;
  if (style == DvtChartPieRenderUtils.TWOD)
    return [alpha, alpha, alpha];
  else if (style == DvtChartPieRenderUtils.BORDER)
    return [(alpha / (0xFF / 0xA0)), (alpha / (0xFF / 0x30)), (alpha / (0xFF / 0x60))];
  else if (style == DvtChartPieRenderUtils.THREED)
    return [alpha, alpha, alpha, alpha, alpha];
  else if (style == DvtChartPieRenderUtils.CRUST)
    return [alpha, alpha, alpha, alpha];
  else if (style == DvtChartPieRenderUtils.SIDE)
    return [alpha, alpha];
};


// ported over from PieUtils
/**
 * Returns an array of stops for use in creating a gradient, based on where the gradient will be applied
 *
 * @param {String} style Either DvtChartPieRenderUtils.TWOD, DvtChartPieRenderUtils.THREED, DvtChartPieRenderUtils.CRUST,
 *                          DvtChartPieRenderUtils.SIDE, or DvtChartPieRenderUtils.BORDER
 * @param {string} skin
 * @return {Array}
 */
DvtChartPieRenderUtils.getGradientRatios = function(style, skin) {
  if (skin && skin != dvt.CSSStyle.SKIN_SKYROS)
    return [0, 1.0];
  else if (style == DvtChartPieRenderUtils.TWOD)
    return [0.2, 0.5, 1.0];
  else if (style == DvtChartPieRenderUtils.BORDER)
    return [0, 0.5, 1.0];
  else if (style == DvtChartPieRenderUtils.THREED)
    return [0.0, 0.29, 0.55, 0.84, 1.0];
  else if (style == DvtChartPieRenderUtils.CRUST)
    return [0, 0.43, 0.91, 1.0];
  else if (style == DvtChartPieRenderUtils.SIDE)
    return [0, 1];
};


/*
 * Static methods for generating the physical shapes that make up the different pieces of a DvtChartPieSlice
 */


/**
 * @this {DvtChartPieSlice}
 * Returns an array of dvt.Shape objects representing the top of a pie slice
 *
 * @param {DvtChartPieSlice} slice The slice to generate the top for
 * @param {dvt.Fill} fill The fill for the top
 * @return {Array} An array of dvt.Shape objects representing the top of this pie slice
 */
DvtChartPieRenderUtils.createTopSurface = function(slice, fill) {
  var pieChart = slice.getPieChart();
  var context = pieChart.getCtx();
  var pieCenter = slice.getCenter();

  var innerRadius = slice.getInnerRadius();
  var sliceGaps = pieChart.is3D() || (slice.getSliceGaps() > Math.sin(dvt.Math.degreesToRads(slice.getAngleExtent())) * slice._radiusX + 1) ? null : slice.getSliceGaps();
  var wedge = new DvtChartSelectableWedge(context, pieCenter.x, pieCenter.y, slice._radiusX, slice._radiusY, slice.getAngleStart(), slice.getAngleExtent(), sliceGaps, innerRadius);

  var innerColor = DvtChartStyleUtils.getSelectedInnerColor(pieChart.chart);
  var outerColor = DvtChartStyleUtils.getSelectedOuterColor(pieChart.chart);
  var stroke = new dvt.SolidStroke(slice.getStrokeColor(), null, slice.getBorderWidth());

  wedge.setStyleProperties(fill, stroke, slice.getFillColor(), innerColor, outerColor);

  var shapes = [wedge];

  if (!slice.getStrokeColor() && pieChart.getSkin() == dvt.CSSStyle.SKIN_SKYROS && pieChart.is3D() && slice.getDepth() > 0 && DvtChartStyleUtils.getSeriesEffect(pieChart.chart) == 'gradient' &&
      (slice.getAngleStart() >= 180 || (slice.getAngleStart() + slice.getAngleExtent()) >= 180 || slice.getAngleExtent() == 360))// ; slice.getAngleExtent() == 360 means we only have one slice
  {
    // create arc for the pie border with border gradient and add arc to shapes array
    var edge = DvtChartPieRenderUtils._createGradientPieBorder(slice, fill);
    edge.setTranslate(slice.__getExplodeOffsetX(), slice.__getExplodeOffsetY());
    shapes.push(edge);
  }

  // Associate the shapes with the slice for use during event handling
  DvtChartPieRenderUtils.associate(slice, shapes);

  return shapes;
};


/**
 * Associates the specified displayables with the specified slice.
 * @param {DvtChartPieSlice} slice The owning slice.
 * @param {array} displayables The displayables to associate.
 */
DvtChartPieRenderUtils.associate = function(slice, displayables) {
  if (!displayables)
    return;

  for (var i = 0; i < displayables.length; i++)
    slice.getPieChart().chart.getEventManager().associate(displayables[i], slice);
};


/**
 * Private helper method to generate the gradient border for a pie slice
 * @param {DvtChartPieSlice} slice
 * @param {dvt.GradientFill} topFill
 * @return {dvt.Arc} The gradient border to apply on top of the pie slice at the edge
 * @private
 */
DvtChartPieRenderUtils._createGradientPieBorder = function(slice, topFill) {
  // first create the gradient to apply
  var style = DvtChartPieRenderUtils.BORDER;
  var arColors = DvtChartPieRenderUtils.getGradientColors(null, style);// base color ignored for border gradient
  var arAlphas = DvtChartPieRenderUtils.getGradientAlphas(null, style);
  var arRatios = DvtChartPieRenderUtils.getGradientRatios(style);

  var arBounds = topFill.getBounds();

  var grAngle = 120;// constant used in Flash impl originally 120
  //  grAngle = 360 - grAngle ;        // Html5 toolkit rotates from 0 clockwise so
  // convert to anticlockwise convention
  var gradBorder = new dvt.LinearGradientStroke(grAngle, arColors, arAlphas, arRatios, arBounds);
  gradBorder.setWidth(1);

  // now create the arc for the border
  // only show border on the front-top-edge (180-360 degrees)
  var sliceAngleStart = slice.getAngleStart();
  var sliceAngleExtent = slice.getAngleExtent();

  var diff = (sliceAngleStart < 180) ? 180 - sliceAngleStart : 0;
  var angStart = (diff > 0) ? 180 : sliceAngleStart;
  var angExtent = sliceAngleExtent - diff;

  if (angStart + angExtent > 360)
    angExtent = 360 - angStart;

  var pieChart = slice.getPieChart();
  var pieCenter = slice.getCenter();

  var edge = new dvt.Arc(pieChart.getCtx(), pieCenter.x, pieCenter.y, pieChart.getRadiusX(), pieChart.getRadiusY(), angStart, angExtent, dvt.Arc.OPEN);

  edge.setStroke(gradBorder);

  return edge;
};

/**
 * Generates any lateral (non-top) pie surface
 *
 * @param {DvtChartPieSlice} slice
 * @param {number} pathType One of DvtChartPieRenderUtils.SURFACE_CRUST,
 *                          DvtChartPieRenderUtils.SURFACE_LEFT, or DvtChartPieRenderUtils.SURFACE_RIGHT
 * @param {dvt.Fill} fill The fill for the lateral surface
 *
 * @return {Array} An array of dvt.Shape objects representing this lateral surface
 */
// replaces PieSlice._draw
DvtChartPieRenderUtils.createLateralSurface = function(slice, pathType, fill) {
  // handle the case where we are animating a slice insert
  // initially, this slice will have 0 extent. in this case
  // don't generate any surface
  if (slice.getAngleExtent() == 0) {
    return [];
  }

  var talpha = dvt.ColorUtils.getAlpha(slice.getFillColor());
  var shapes = [];

  if (talpha > 0) {

    if (pathType == DvtChartPieRenderUtils.SURFACE_LEFT || pathType == DvtChartPieRenderUtils.SURFACE_RIGHT) {
      shapes.push(DvtChartPieRenderUtils._generateLateralShape(slice, pathType, null, fill));
    }
    else if (pathType == DvtChartPieRenderUtils.SURFACE_CRUST) {
      var pathCommands = DvtChartPieRenderUtils._createCrustPathCommands(slice);

      var len = pathCommands.length;
      for (var i = 0; i < len; i++) {
        shapes.push(DvtChartPieRenderUtils._generateLateralShape(slice, pathType, pathCommands[i], fill));
      }

    }
  }

  // Associate the shapes with the slice for use during event handling
  DvtChartPieRenderUtils.associate(slice, shapes);

  return shapes;
};


/**
 * Create the gradient fill used for lateral surfaces.
 * @param {DvtChartPieSlice} slice
 * @param {String} objType One of DvtChartPieRenderUtils.CRUST or DvtChartPieRenderUtils.SIDE
 * @return {dvt.LinearGradientFill}
 */
DvtChartPieRenderUtils.generateLateralGradientFill = function(slice, objType) {
  var pieChart = slice.getPieChart();
  var skin = pieChart.getSkin();
  var yOffset = (objType == DvtChartPieRenderUtils.CRUST) ? slice.getDepth() : 0;

  var angle = (skin == dvt.CSSStyle.SKIN_SKYROS) ? 0 : 270;
  var arColors = DvtChartPieRenderUtils.getGradientColors(dvt.ColorUtils.getRGB(slice.getFillColor()), objType, skin);
  var arAlphas = DvtChartPieRenderUtils.getGradientAlphas(dvt.ColorUtils.getAlpha(slice.getFillColor()), objType);
  var arRatios = DvtChartPieRenderUtils.getGradientRatios(objType, skin);
  var arBounds = null;
  if (skin == dvt.CSSStyle.SKIN_SKYROS) {
    arBounds = [Math.floor(slice.getCenter().x - pieChart.getRadiusX()),
                Math.floor(slice.getCenter().y - pieChart.getRadiusY()) + yOffset,
                Math.ceil(2 * pieChart.getRadiusX()),
                Math.ceil(2 * pieChart.getRadiusY())];
  }

  return new dvt.LinearGradientFill(angle, arColors, arAlphas, arRatios, arBounds);
};


/**
 * Private method that generates an array of dvt.Shape objects for different lateral pie surfaces
 *
 * @param {DvtChartPieSlice} slice
 * @param {number} pathType One of DvtChartPieRenderUtils.SURFACE_CRUST,
 *                          DvtChartPieRenderUtils.SURFACE_LEFT, or DvtChartPieRenderUtils.SURFACE_RIGHT
 * @param {String} pathCommand  A string of SVG commands in SVG "d" attribute format. Used when pathType is
 *                              DvtChartPieRenderUtils.SURFACE_CRUST. Can be set to null otherwise
 * @param {dvt.Fill} fill The fill to apply to the shapes
 *
 * @return {dvt.Shape} A right or left pie surface, or a piece of a crust, as described in pathCommands
 *
 * @private
 */
DvtChartPieRenderUtils._generateLateralShape = function(slice, pathType, pathCommand, fill) {
  var pie = slice.getPieChart();
  var context = pie.getCtx();
  // left side points and right side points
  if (pathType == DvtChartPieRenderUtils.SURFACE_LEFT || pathType == DvtChartPieRenderUtils.SURFACE_RIGHT) {
    var angle = slice.getAngleStart();
    var arc = slice.getAngleExtent();
    var xCenter = slice.getCenter().x;
    var yCenter = slice.getCenter().y;
    var xRadius = slice._radiusX;
    var yRadius = slice._radiusY;
    var depth = slice.getDepth();

    var pt = (pathType == DvtChartPieRenderUtils.SURFACE_LEFT) ? DvtChartPieRenderUtils.reflectAngleOverYAxis(angle + arc, xCenter, yCenter, xRadius, yRadius) :
        DvtChartPieRenderUtils.reflectAngleOverYAxis(angle, xCenter, yCenter, xRadius, yRadius);
    var pointArray = DvtChartPieRenderUtils._generateInnerPoints(xCenter, yCenter, pt.x, pt.y, depth);

    var points = [];
    for (var i = 0; i < pointArray.length; i++) {
      points.push(pointArray[i].x, pointArray[i].y);
    }

    var polygon = new dvt.Polygon(context, points);

    polygon.setFill(fill);
    if (slice.getStrokeColor())
      polygon.setSolidStroke(slice.getStrokeColor());

    return polygon;
  }
  else // draw piece of pie crust
  {
    if (pathCommand) {
      var path = new dvt.Path(context, null);

      path.setCmds(pathCommand);
      path.setTranslate(slice.__getExplodeOffsetX(), slice.__getExplodeOffsetY());

      path.setFill(fill);
      if (slice.getStrokeColor()) {
        path.setSolidStroke(slice.getStrokeColor());
      }

      return path;
    }
  }

  return null;
};


/**
 * Returns an array of path commands describing how to draw a pie crust
 *
 * @param {DvtChartPieSlice} slice
 *
 * @return {Array} An array of strings of SVG commands in SVG "d" attribute format.
 *                 e.g., [ [command1 x1, y1, ..., commandi xn, yn, ...], [commandj xs, ys, ...] ]
 *
 * @private
 */
DvtChartPieRenderUtils._createCrustPathCommands = function(slice) {
  var angle = slice.getAngleStart();
  var arc = slice.getAngleExtent();
  var angleEnd = angle + arc;
  var xCenter = slice.getCenter().x;
  var yCenter = slice.getCenter().y;
  var xRadius = slice._radiusX;
  var yRadius = slice._radiusY;
  var depth = slice.getDepth();

  // If slice crosses 0 degrees (right horizontal x-axis), we need to break crust into 2 pieces joined at the crossing
  // point so that the right side of the slice appears to be a solid 3D wall. If slice crosses 180 degrees (left
  // horizontal x-axis), we need to break crust into 2 pieces joined at the crossing point so that the left side of the
  // slice appears to be a solid 3D wall.
  var arOuterPath = [];
  if (angle < 180.0 && angleEnd > 360.0) {
    arOuterPath.push(DvtChartPieRenderUtils._makeOuterPath(xCenter, yCenter, xRadius, yRadius, depth, angle, 180.0 - angle)); // left
    arOuterPath.push(DvtChartPieRenderUtils._makeOuterPath(xCenter, yCenter, xRadius, yRadius, depth, 360.0, angleEnd - 360.0)); // right
    arOuterPath.push(DvtChartPieRenderUtils._makeOuterPath(xCenter, yCenter, xRadius, yRadius, depth, 180.0, 180.0)); // center
  }
  else if (angleEnd > 360.0) {
    arOuterPath.push(DvtChartPieRenderUtils._makeOuterPath(xCenter, yCenter, xRadius, yRadius, depth, angle, 360.0 - angle));
    arOuterPath.push(DvtChartPieRenderUtils._makeOuterPath(xCenter, yCenter, xRadius, yRadius, depth, 360.0, angleEnd - 360.0));
  }
  else if (angle < 180.0 && angleEnd > 180.0) {
    arOuterPath.push(DvtChartPieRenderUtils._makeOuterPath(xCenter, yCenter, xRadius, yRadius, depth, angle, 180.0 - angle));
    arOuterPath.push(DvtChartPieRenderUtils._makeOuterPath(xCenter, yCenter, xRadius, yRadius, depth, 180.0, angleEnd - 180.0));
  }
  else
    arOuterPath.push(DvtChartPieRenderUtils._makeOuterPath(xCenter, yCenter, xRadius, yRadius, depth, angle, arc));

  return arOuterPath;
};


/**
 * Returns the path string for a segment of the outer crust of a pie slice.
 * @param {number} cx The x coordinate of the center of the pie.
 * @param {number} cy The y coordinate of the center of the pie.
 * @param {number} rx The radius of the pie.
 * @param {number} ry The radius of the pie.
 * @param {number} depth The depth of the pie.
 * @param {number} startAngle The start angle in degrees.
 * @param {number} angleExtent The angular extent in degrees.  Always less than 180 degrees (half the pie).
 * @return {String} An SVG string that represents part of the crust.
 * @private
 */
DvtChartPieRenderUtils._makeOuterPath = function(cx, cy, rx, ry, depth, startAngle, angleExtent) {
  var angleExtentRads = dvt.Math.degreesToRads(angleExtent);
  var endAngleRads = -(dvt.Math.degreesToRads(startAngle) + angleExtentRads);

  // Calculate the start and end points on the top curve
  var startPointTop = DvtChartPieRenderUtils.reflectAngleOverYAxis(startAngle, cx, cy, rx, ry);
  var endPointTopX = cx + Math.cos(endAngleRads) * rx;
  var endPointTopY = cy + Math.sin(endAngleRads) * ry;

  // Top Curve
  var pathCommands = dvt.PathUtils.moveTo(startPointTop.x, startPointTop.y);
  pathCommands += dvt.PathUtils.arcTo(rx, ry, angleExtentRads, 0, endPointTopX, endPointTopY);

  // Line to Bottom Curve
  pathCommands += dvt.PathUtils.lineTo(endPointTopX, endPointTopY + depth);

  // Bottom Curve
  pathCommands += dvt.PathUtils.arcTo(rx, ry, angleExtentRads, 1, startPointTop.x, startPointTop.y + depth);

  // Line to Top Curve
  pathCommands += dvt.PathUtils.lineTo(startPointTop.x, startPointTop.y);

  return pathCommands;
};

/**
 * Private function to generate the points for the left or right pie surface
 *
 * @param {number} cx The x-coordinate of the center of the pie slice
 * @param {number} cy The y-coordinate of the center of the pie slice
 * @param {number} xpos The x-coordinate of the top, outside (left or right) edge of the pie slice
 * @param {number} ypos The y-coordinate of the top, outside (left or right) edge of the pie slice
 * @param {number} tilt Pie tilt
 *
 * @return {Array} An array of points that are the coordinates for the left or right surface of a pie slice
 *
 * @private
 */
DvtChartPieRenderUtils._generateInnerPoints = function(cx, cy, xpos, ypos, tilt) {
  var pointArray = [];
  pointArray.push({x: cx, y: cy});
  pointArray.push({x: xpos, y: ypos});
  pointArray.push({x: xpos, y: ypos + tilt});
  pointArray.push({x: cx, y: cy + tilt});
  return pointArray;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
/*---------------------------------------------------------------------*/
/* Class DvtChartPieLabelInfo       Slice label information               */
/*---------------------------------------------------------------------*/



/** A property bag used to pass around information used for label placement
 *
 * @constructor
 */
var DvtChartPieLabelInfo = function() {
  this._init();
};

dvt.Obj.createSubclass(DvtChartPieLabelInfo, dvt.Obj);


/**
 * Private initializer
 * @private
 */
DvtChartPieLabelInfo.prototype._init = function() {
  this._sliceLabel = null;// instance of dvt.OutputText or dvt.MultilineText
  this._slice = null;// DvtSlice we will associate _sliceLabel with, if we can fit the label
  this._angle = - 1;

  // this._position is the normalized midpoint angle, where 0 degrees is at 12 o'clock
  //    and angular measures are degrees away from 12 o'clock (so 90 degrees
  //    can be either at 3 o'clock or 9 o'clock on the unit circle)
  this._position = - 1;
  this._width = - 1;
  this._height = - 1;
  this._x = - 1;
  this._y = - 1;

  this._initialNumLines = - 1;

  this._hasFeeler = false;

  this._maxY = - 1;
  this._minY = - 1;
};


/**
 * @return {number} Angle of the text in this slice label
 */
DvtChartPieLabelInfo.prototype.getAngle = function() {
  return this._angle;
};


/**
 * @param {number} angle Sets the angle of the text in this slice label
 */
DvtChartPieLabelInfo.prototype.setAngle = function(angle) {
  this._angle = angle;
};


/**
 * @return {number} The height of this slice label
 */
DvtChartPieLabelInfo.prototype.getHeight = function() {
  return this._height;
};


/**
 * @param {number} height The height of this slice label
 */
DvtChartPieLabelInfo.prototype.setHeight = function(height) {
  this._height = height;
};


/**
 * @return {number}
 */
DvtChartPieLabelInfo.prototype.getInitialNumLines = function() {
  return this._initialNumLines;
};


/**
 * @param {number} numLines
 */
DvtChartPieLabelInfo.prototype.setInitialNumLines = function(numLines) {
  this._initialNumLines = numLines;
};


/**
 * @return {number} The maximum Y position of this slice label
 */
DvtChartPieLabelInfo.prototype.getMaxY = function() {
  return this._maxY;
};


/**
 * @param {number} maxY The maximum Y position of this slice label
 */
DvtChartPieLabelInfo.prototype.setMaxY = function(maxY) {
  this._maxY = maxY;
};


/**
 * @return {number} The minimum Y position of this slice label
 */
DvtChartPieLabelInfo.prototype.getMinY = function() {
  return this._minY;
};


/**
 * @param {number} minY The minimum Y position of this slice label
 */
DvtChartPieLabelInfo.prototype.setMinY = function(minY) {
  this._minY = minY;
};


/**
 * bound the value of y within minY and maxY
 * assumes that maxY > minY
 * @param {number} y value
 * @return {number} bounded y value
 */
DvtChartPieLabelInfo.prototype.boundY = function(y) {
  if (this._minY <= this._maxY) {
    y = Math.max(y, this._minY);
    y = Math.min(y, this._maxY);
  }
  return y;
};


/**
 * @return {boolean}
 */
DvtChartPieLabelInfo.prototype.hasFeeler = function() {
  return this._hasFeeler;
};


/**
 * @param {boolean} hasFeeler
 */
DvtChartPieLabelInfo.prototype.setHasFeeler = function(hasFeeler) {
  this._hasFeeler = hasFeeler;
};


/**
 * Returns the normalized midpoint angle, where 0 degrees is at 12 o'clock
 * and angular measures are degrees away from 12 o'clock (so 90 degrees
 * can be either at 3 o'clock or 9 o'clock on the unit circle)
 *
 * @return {number}
 */
DvtChartPieLabelInfo.prototype.getPosition = function() {
  return this._position;
};


/**
 * Sets the normalized midpoint angle, where 0 degrees is at 12 o'clock
 * and angular measures are degrees away from 12 o'clock (so 90 degrees
 * can be either at 3 o'clock or 9 o'clock on the unit circle)
 *
 * @param {number} position
 */
DvtChartPieLabelInfo.prototype.setPosition = function(position) {
  this._position = position;
};


/**
 * The slice that we want to associate the label with
 *
 * @return {DvtChartPieSlice}
 */
DvtChartPieLabelInfo.prototype.getSlice = function() {
  return this._slice;
};


/**
 * @param {DvtChartPieSlice} slice
 */
DvtChartPieLabelInfo.prototype.setSlice = function(slice) {
  this._slice = slice;
};


/**
 * The displayable associated with this SliceLabelInfo
 *
 * @return {dvt.OutputText|dvt.MultilineText}
 */
DvtChartPieLabelInfo.prototype.getSliceLabel = function() {
  return this._sliceLabel;
};


/**
 * Sets the displayable this label info will layout
 *
 * @param {dvt.OutputText|dvt.MultilineText} label
 */
DvtChartPieLabelInfo.prototype.setSliceLabel = function(label) {
  this._sliceLabel = label;
};


/**
 * @return {number} The width of this label
 */
DvtChartPieLabelInfo.prototype.getWidth = function() {
  return this._width;
};


/**
 * @param {number} width
 */
DvtChartPieLabelInfo.prototype.setWidth = function(width) {
  this._width = width;
};


/**
 * @return {number} The x-coordinate of the reference point for this label
 */
DvtChartPieLabelInfo.prototype.getX = function() {
  return this._x;
};


/**
 * @param {number} x
 */
DvtChartPieLabelInfo.prototype.setX = function(x) {
  this._x = x;
};


/**
 * @return {number} The y-coordinate of hte reference point for this label
 */
DvtChartPieLabelInfo.prototype.getY = function() {
  return this._y;
};


/**
 * @param {number} y
 */
DvtChartPieLabelInfo.prototype.setY = function(y) {
  this._y = y;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
/*---------------------------------------------------------------------*/
/*   DvtChartPieLabelUtils                                                  */
/*---------------------------------------------------------------------*/


/**
 * @class DvtChartPieLabelUtils
 */
var DvtChartPieLabelUtils = function() {
};

dvt.Obj.createSubclass(DvtChartPieLabelUtils, dvt.Obj);

/** @private */
DvtChartPieLabelUtils._MAX_LINES_PER_LABEL = 3;
/** @private */
DvtChartPieLabelUtils._COLLISION_MARGIN = 1;
/** @private */
DvtChartPieLabelUtils._LEFT_SIDE_LABELS = 1;
/** @private */
DvtChartPieLabelUtils._RIGHT_SIDE_LABELS = 2;
/** @private */
DvtChartPieLabelUtils._OUTSIDE_LABEL_DISTANCE = 1.04;// distance from the slice, as a ratio of the radius

//constants for column layout
/** @private */
DvtChartPieLabelUtils._FEELER_RAD_MINSIZE = 0.1;// ratio to the pie diameter
/** @private */
DvtChartPieLabelUtils._FEELER_HORIZ_MINSIZE = 0.1;// ratio to the pie diameter
/** @private */
DvtChartPieLabelUtils._LABEL_TO_FEELER_OFFSET = 0.5;// ratio to the label height
/** @private */
DvtChartPieLabelUtils._LABEL_TO_FEELER_DISTANCE = 3;// in pixels
/** @private */
DvtChartPieLabelUtils._NO_COLLISION = 0;
/** @private */
DvtChartPieLabelUtils._HALF_COLLISION = 1;
/** @private */
DvtChartPieLabelUtils._ALL_COLLISION = 2;


/**
 * Public entry point called by DvtChartPie to layout the pie chart's labels and feelers.
 * @param {DvtChartPie} pie the pie chart
 */
DvtChartPieLabelUtils.layoutLabelsAndFeelers = function(pie) {
  var labelPosition = pie.getLabelPosition();
  DvtChartPieLabelUtils._layoutInsideLabels(pie, labelPosition == 'auto');
  DvtChartPieLabelUtils._layoutOutsideLabelsAndFeelers(pie);

};


/**
 * Lays out labels that appear within the pie slices.
 * @param {DvtChartPie} pie the pie chart
 * @param {boolean} isHybrid Whether the labeling is inside/outside hybrid
 * @private
 */
DvtChartPieLabelUtils._layoutInsideLabels = function(pie, isHybrid) {
  var slices = pie.__getSlices();

  for (var i = 0; i < slices.length; i++) {
    var slice = slices[i];
    // Only doing layout for inside labels, so skip any labels that have a position of none or outside
    var labelPosition = pie.getSeriesLabelPosition(slice.getSeriesIndex());
    if (labelPosition == 'none' || labelPosition == 'outsideSlice')
      continue;

    var midAngle = slice.getAngleStart() + (slice.getAngleExtent() / 2);
    var ir = slice.getInnerRadius();
    var center = slice.getCenter();
    var posX = 0;
    var posY = 0;
    var sliceLabel = DvtChartPieLabelUtils._createLabel(slice, true);

    if (slices.length == 1) {
      // Center the label
      posX = center.x;
      posY = center.y;
    }
    else {
      var offset = Math.max(0.45, 0.65 - 0.45 * ir / Math.max(slice.getRadiusY(), 0.001));
      var midPt = DvtChartPieRenderUtils.reflectAngleOverYAxis(midAngle, center.x, center.y, ir + (slice.getRadiusX() - ir) * offset, ir + (slice.getRadiusY() - ir) * offset);

      posX = midPt.x;
      posY = midPt.y;
    }

    sliceLabel.setX(posX);
    sliceLabel.setY(posY);
    sliceLabel.alignMiddle();
    sliceLabel.alignCenter();

    // Find the estimated dimensions of the label
    var estimatedDims = dvt.TextUtils.guessTextDimensions(sliceLabel);

    // Find the largest rectangle that will fit.  The height is accurate, so we only need to check the width.
    var x1 = posX;
    var x2 = posX;
    var y1 = posY - estimatedDims.h / 2;
    var y2 = posY + estimatedDims.h / 2;

    // Calculate the left-most x1 that will fit
    while (slice.contains(x1, y1) && slice.contains(x1, y2)) {
      x1--;
    }

    // Calculate the right-most x2 that will fit
    while (slice.contains(x2, y1) && slice.contains(x2, y2)) {
      x2++;
    }

    // Add a 3-pixel buffer on each side (accounts for the potential extra pixel in the while loop on failed check)
    x1 = Math.ceil(x1 + 3);
    x2 = Math.floor(x2 - 3);

    // Adjust the anchor point to the midpoint of available space if truncation would occur centered at current anchor
    var usableSpace = 2 * Math.min(posX - x1, x2 - posX);
    if (usableSpace < estimatedDims.w) {
      sliceLabel.setX((x1 + x2) / 2);
      usableSpace = x2 - x1;
    }

    // Don't want to use the automatic hybrid layout if slice label position is specifically set as center
    if (isHybrid && labelPosition != 'center') {
      var textWidth = sliceLabel.getDimensions().w;
      if (textWidth < usableSpace)
        slice.setSliceLabel(sliceLabel);
      else
        slice.setSliceLabel(null); // use outside label
    }
    else {
      // Truncate the text.  It will be added to the chart later, so remove if it is added.
      var stage = pie.getCtx().getStage();
      var minChars = !DvtChartPieLabelUtils._isTextLabel(pie, slice) ? sliceLabel.getTextString().length : null;
      if (dvt.TextUtils.fitText(sliceLabel, usableSpace, estimatedDims.h, stage, minChars)) {
        stage.removeChild(sliceLabel);
        slice.setSliceLabel(sliceLabel);
      }
    }

    // If hybrid labeling, the slice can animate from having a outsideLabel + feeler to being inside. In this case, we
    // need to clear the outside feeler so that it doesn't stay around.
    if (slice.getSliceLabel() != null)
      slice.setNoOutsideFeeler();
  }
};


/**
 * Lays out labels (and feelers if necessary) that appear outside the pie slices
 * @param {DvtChartPie} pie The pie chart
 * @private
 */
DvtChartPieLabelUtils._layoutOutsideLabelsAndFeelers = function(pie) {
  var leftLabels = [];
  var rightLabels = [];

  // -----------------------------------------------------------
  // Build arrays of Left side and Right side Labels
  //
  // When computing the positioning of the labels, we consider
  // angles to be measured from the 12 o'clock position,
  // i.e., 12 o'clock is 0 degrees.
  // Angular measurements then range from 0 to 180.
  // A value of 90 degrees can then be either at the
  // 3 o'clock position or at the 9 o'clock position
  // -----------------------------------------------------------
  var alabels = DvtChartPieLabelUtils._generateInitialLayout(pie);

  leftLabels = alabels[0];
  rightLabels = alabels[1];

  // -----------------------------------------------------------
  // Evaluate initial label layout from generateInitialLayout
  // -----------------------------------------------------------
  var leftColl = DvtChartPieLabelUtils._refineInitialLayout(pie, leftLabels, DvtChartPieLabelUtils._LEFT_SIDE_LABELS);
  var rightColl = DvtChartPieLabelUtils._refineInitialLayout(pie, rightLabels, DvtChartPieLabelUtils._RIGHT_SIDE_LABELS);

  if (leftColl == DvtChartPieLabelUtils._HALF_COLLISION && rightColl != DvtChartPieLabelUtils._NO_COLLISION)
    DvtChartPieLabelUtils._columnLabels(pie, leftLabels, true, true, true);
  if (leftColl != DvtChartPieLabelUtils._NO_COLLISION && rightColl == DvtChartPieLabelUtils._HALF_COLLISION)
    DvtChartPieLabelUtils._columnLabels(pie, rightLabels, false, true, true);

  DvtChartPieLabelUtils._setLabelsAndFeelers(pie, leftLabels, DvtChartPieLabelUtils._LEFT_SIDE_LABELS);
  DvtChartPieLabelUtils._setLabelsAndFeelers(pie, rightLabels, DvtChartPieLabelUtils._RIGHT_SIDE_LABELS);
};


/**
 * Create a label for the given pie slice. Label positioning is done elsewhere
 * @param {DvtChartPieSlice} slice
 * @param {boolean} isInside True if the label is inside the slice.
 * @return {dvt.OutputText|dvt.MultilineText}
 * @private
 */
DvtChartPieLabelUtils._createLabel = function(slice, isInside) {
  var pieChart = slice.getPieChart();

  var context = pieChart.getCtx();
  var sliceLabel = isInside ? new dvt.OutputText(context) : new dvt.MultilineText(context);

  // Apply the label color- read all applicable styles and merge them.
  var styleDefaults = pieChart.getOptions()['styleDefaults'];
  var labelStyleArray = [styleDefaults['dataLabelStyle'], new dvt.CSSStyle(styleDefaults['sliceLabelStyle'])];
  var dataItem = DvtChartDataUtils.getDataItem(pieChart.chart, slice.getSeriesIndex(), 0);
  if (dataItem)
    labelStyleArray.push(new dvt.CSSStyle(dataItem['labelStyle']));
  var style = dvt.CSSStyle.mergeStyles(labelStyleArray);
  var bColorDefined = (style.getStyle('color') != null);
  if (isInside && (!bColorDefined || dvt.Agent.isHighContrast())) {
    // For interior labels or high contrast, apply the contrasting text color
    var contrastingColor = dvt.ColorUtils.getContrastingTextColor(slice.getFillColor());
    style.setStyle('color', contrastingColor);
  }
  else if (!bColorDefined) {
    // Apply the default label color if color not defined
    style.setStyle('color', styleDefaults['_defaultSliceLabelColor']);
  }

  sliceLabel.setCSSStyle(style);

  var labelStr = DvtChartPieLabelUtils.generateSliceLabelString(slice, styleDefaults['sliceLabelType']);
  sliceLabel.setTextString(labelStr);
  slice.setSliceLabelString(labelStr);

  return sliceLabel;
};

/**
 * Create the center content for pie chart.
 * @param {DvtChartPie} pieChart the pie chart
 */
DvtChartPieLabelUtils.createPieCenter = function(pieChart) {
  var options = pieChart.getOptions();
  var context = pieChart.getCtx();
  var pieCenter = DvtChartPieLabelUtils.getPieCenterOptions(options);
  var centerLabel = pieCenter['label'];
  var centerRenderer = pieCenter['renderer'];
  var dataLabelPosition = pieChart.getLabelPosition();
  var tooltipFunction = options['tooltip'];
  var centerCoord = pieChart.getCenter();
  var innerRadius = pieChart.getInnerRadius();

  if (!centerLabel && !centerRenderer)
    return;

  var radiusX = pieChart.getRadiusX();
  innerRadius = innerRadius > 0 ? innerRadius :
      (dataLabelPosition == 'outsideSlice' ? .9 * radiusX : .5 * radiusX);
  var innerSquareDimension = innerRadius * Math.sqrt(2);
  if (centerLabel) {
    var centerText = new dvt.MultilineText(context);
    var centerStyle = pieCenter['labelStyle'];
    centerText.setCSSStyle(centerStyle);

    // Scaling and Converter option handler
    if (typeof centerLabel === 'number') {
      centerLabel = DvtChartTooltipUtils.formatValue(context, pieCenter, centerLabel, centerLabel, centerLabel, 0);
    }

    centerText.setTextString(centerLabel);
    if (dvt.TextUtils.fitText(centerText, innerSquareDimension, innerSquareDimension, pieChart)) {
      var textDim = centerText.getDimensions();
      centerText.setY(centerCoord.y - textDim.h / 2);
      centerText.setX(centerCoord.x);
      centerText.alignCenter();

      if (centerText.isTruncated() && !tooltipFunction)
        pieChart.chart.getEventManager().associate(centerText, new dvt.SimpleObjPeer(centerText.getTextString()));
      pieChart.addChild(centerText);
    }
  }

  // If there is a tooltip callback function, overlay a circular object over the center area.
  if (tooltipFunction) {
    var centerOverlay = new dvt.Circle(context, centerCoord.x, centerCoord.y, innerRadius);
    centerOverlay.setInvisibleFill();
    pieChart.addChild(centerOverlay);
    var tooltipManager = pieChart.getCtx().getTooltipManager();
    pieChart.chart.getEventManager().associate(centerOverlay, new dvt.CustomDatatipPeer(tooltipManager, tooltipFunction, '#4b4b4b', {'component' : options['_widgetConstructor'], 'label': centerLabel}));
  }

  if (centerRenderer) {
    var dataContext = {
      'outerBounds': {'x': centerCoord.x - innerRadius, 'y': centerCoord.y - innerRadius, 'width': 2 * innerRadius, 'height': 2 * innerRadius },
      'innerBounds': {'x': (centerCoord.x - innerSquareDimension / 2), 'y': (centerCoord.y - innerSquareDimension / 2), 'width': innerSquareDimension, 'height': innerSquareDimension},
      'label': centerLabel,
      'component': options['_widgetConstructor']
    };
    var parentDiv = context.getContainer();

    // Remove existing overlay if there is one
    var existingOverlay = pieChart.chart.pieCenterDiv;
    if (existingOverlay)
      parentDiv.removeChild(existingOverlay);

    var customContent = centerRenderer(dataContext);
    if (!customContent)
      return;
    var newOverlay = context.createOverlayDiv();
    newOverlay.appendChild(customContent);
    pieChart.chart.pieCenterDiv = newOverlay;
    parentDiv.appendChild(newOverlay);

    // Invoke the overlay attached callback if one is available.
    var callback = context.getOverlayAttachedCallback();
    if (callback)
      callback(newOverlay);
  }
};

/**
 * Returns the untruncated label text for a given pie slice
 * @param {DvtChartPieSlice} slice
 * @param {string} labelType The label type.
 * @return {string} The full, untruncated label string, or null if the slice's pie chart is configured to not display labels
 */
DvtChartPieLabelUtils.generateSliceLabelString = function(slice, labelType) {
  var functionLabel;
  var defaultLabel = DvtChartPieLabelUtils.getDefaultSliceLabelString(slice, labelType);

  // Use data Label function if there is one
  var dataLabelFunc = slice.getPieChart().getOptions()['dataLabel'];

  if (dataLabelFunc) {
    var dataContext = DvtChartDataUtils.getDataContext(slice._chart, slice.getSeriesIndex(), 0);
    dataContext['label'] = defaultLabel;
    functionLabel = dataLabelFunc(dataContext);
  }

  return functionLabel ? functionLabel : defaultLabel;
};

/**
 * Returns the default label text for a given pie slice and ignores the dataLabel function
 * @param {DvtChartPieSlice} slice
 * @param {string} labelType The label type.
 * @return {string} The full, default label string, or null if the slice's pie chart is configured to not display labels
 */
DvtChartPieLabelUtils.getDefaultSliceLabelString = function(slice, labelType) {
  var pieChart = slice.getPieChart();

  // If customLabel exists it will be the slice label. If a converter is set, apply converter to customLabel
  var customLabel = slice.getCustomLabel();
  var valueFormat = DvtChartTooltipUtils.getValueFormat(pieChart.chart, 'label');
  if (customLabel != null) {
    if (typeof customLabel == 'number')
      return DvtChartTooltipUtils.formatValue(pieChart.getCtx(), valueFormat, customLabel);
    else
      return customLabel;
  }

  // Generate percent string
  var value = slice.getValue();
  var totalValue = pieChart.getTotalValue();
  var percentage = (totalValue == 0) ? 0 : ((value / totalValue));
  var decDigits = percentage < 0.01 ? 3 : percentage < 0.10 ? 2 : percentage < 1 ? 1 : 0;
  // For pies smaller than a certain size, drop to fewer significant digits so that the labels can display.
  if (pieChart.getRadiusX() * 2 < 150)
    decDigits = Math.max(decDigits - 1, 0);

  var percentConverter = pieChart.getCtx().getNumberConverter({'style': 'percent', 'maximumFractionDigits': decDigits, 'minimumFractionDigits': decDigits});
  var spercent = '';

  // Apply the percent converter if present
  if (percentConverter && percentConverter['getAsString']) {
    spercent = percentConverter['getAsString'](percentage);
  }
  else if (percentConverter && percentConverter['format']) {
    spercent = percentConverter['format'](percentage);
  }
  else {
    percentage *= 100;
    // If the percentage is 100%, make sure to display it without any fractions ("100%" not "100.0%")
    spercent = DvtChartTooltipUtils.formatValue(pieChart.getCtx(), {}, percentage, null, null, percentage == 100 ? 1 : Math.pow(10, -1 * decDigits)) + '%';
  }

  // Generate value string
  var svalue = DvtChartTooltipUtils.formatValue(pieChart.getCtx(), valueFormat, value);

  // Set default text to series name
  var stext = slice.getSeriesLabel();

  if (labelType == 'percent')
    return spercent;
  else if (labelType == 'number')
    return svalue;
  else if (labelType == 'text')
    return stext;
  else if (labelType == 'textAndPercent')
    return stext + ', ' + spercent;
  else
    return null;
};



/**
 * Called after initial naive layout is generated to resolve label collisions
 *
 * @param {DvtChartPie} pie
 * @param {Array} labelInfoArray An array of DvtChartPieLabelInfo objects
 * @param {number} side Either DvtChartPieLabelUtils._LEFT_SIDE_LABELS or DvtChartPieLabelUtils._RIGHT_SIDE_LABELS
 * @return {number} DvtChartPieLabelUtils._ALL_COLLISION, DvtChartPieLabelUtils._HALF_COLLISION, or DvtChartPieLabelUtils._NO_COLLISION
 * @private
 */
DvtChartPieLabelUtils._refineInitialLayout = function(pie, labelInfoArray, side) {

  if (labelInfoArray && labelInfoArray.length > 0) {
    var lastY = pie.__getFrame().y;//think again!!
    var collisionTop = false;
    var collisionCentral = false;
    var collisionBottom = false;
    var labelBottom = 0;

    var labelInfo;

    var bottomQuarter = false;
    var prevBottomQuarter = bottomQuarter;
    var collide = false;
    var isLeftSideLabels = (side == DvtChartPieLabelUtils._LEFT_SIDE_LABELS);

    for (var i = 0; i < labelInfoArray.length; i++) {
      labelInfo = labelInfoArray[i];

      prevBottomQuarter = bottomQuarter;
      if (labelInfo.getPosition() > 90)
        bottomQuarter = true;

      labelBottom = labelInfo.getY() + labelInfo.getHeight();

      collide = (lastY - labelInfo.getY()) > DvtChartPieLabelUtils._COLLISION_MARGIN;

      if (collide) {
        if (!bottomQuarter) {
          collisionTop = true;
        }
        else if (bottomQuarter && !prevBottomQuarter) {
          collisionCentral = true;
        }
        else {
          collisionBottom = true;
        }
      }

      if (labelBottom > lastY) {
        lastY = labelBottom;
      }
    }

    if ((collisionTop && collisionBottom) || collisionCentral) {
      DvtChartPieLabelUtils._columnLabels(pie, labelInfoArray, isLeftSideLabels, true, true);
      return DvtChartPieLabelUtils._ALL_COLLISION;
    }
    else if (collisionTop) {
      DvtChartPieLabelUtils._columnLabels(pie, labelInfoArray, isLeftSideLabels, true, false);//top only
      return DvtChartPieLabelUtils._HALF_COLLISION;
    }
    else if (collisionBottom) {
      DvtChartPieLabelUtils._columnLabels(pie, labelInfoArray, isLeftSideLabels, false, true);//bottom only
      return DvtChartPieLabelUtils._HALF_COLLISION;
    }
    else {
      return DvtChartPieLabelUtils._NO_COLLISION;
    }
  }
};


// ported over from PieChart.as, renderLabelsAndFeelers
/**
 *
 * Sets the location of the label objects as specified in the DvtChartPieLabelInfo objects in alabels.
 * When this method returns, the DvtChartPie labels corresponding to the DvtChartPieLabelInfo objects in alabels
 * will have their layout positions set, and will be ready to render
 *
 * @param {DvtChartPie} pie
 * @param {Array} alabels An array of DvtChartPieLabelInfo objects.
 * @param {number} side Either DvtChartPieLabelUtils._LEFT_SIDE_LABELS or DvtChartPieLabelUtils._RIGHT_SIDE_LABELS
 * @private
 */
DvtChartPieLabelUtils._setLabelsAndFeelers = function(pie, alabels, side) {
  if (alabels == null || alabels.length <= 0)
    return;

  var i;
  var slice;// instance of DvtChartPieSlice
  var sliceLabel;// instance of dvt.OutputText or dvt.MultilineText
  var labelInfo;// instance of DvtChartPieLabelInfo
  var isLeftSide = (side == DvtChartPieLabelUtils._LEFT_SIDE_LABELS);
  var frame = pie.__getFrame();

  var excessWidth = Infinity;
  var excessLength;

  // Determine how much the horizontal feelers can be shortened
  for (i = 0; i < alabels.length; i++) {
    labelInfo = alabels[i];
    slice = labelInfo.getSlice();

    if (labelInfo.hasFeeler()) {
      excessLength = DvtChartPieLabelUtils._calculateFeeler(labelInfo, slice, isLeftSide);
      var maxLabelWidth = DvtChartPieLabelUtils.getMaxLabelWidth(pie, labelInfo.getX(), isLeftSide);

      // Remove feelers for labels that will not be rendered and ignore for excess width calculation
      if (labelInfo.getWidth() - excessLength >= maxLabelWidth || labelInfo.getWidth() == 0) {
        labelInfo.setHasFeeler(false);
        continue;
      }
      excessWidth = Math.min(excessWidth, excessLength);
    }
    else
      slice.setNoOutsideFeeler();
  }

  for (i = 0; i < alabels.length; i++) {
    labelInfo = alabels[i];
    slice = labelInfo.getSlice();
    sliceLabel = labelInfo.getSliceLabel();

    if (labelInfo.hasFeeler()) {
      // shorten the horizontal feelers
      if (isLeftSide) {
        labelInfo.setX(labelInfo.getX() + excessWidth);
      } else {
        labelInfo.setX(labelInfo.getX() - excessWidth);
      }
      // setup the feeler line (let it clip if needed)
      DvtChartPieLabelUtils._calculateFeeler(labelInfo, slice, isLeftSide);
      // do not wrap text if column layout is used
      sliceLabel.setMaxLines(1);
    }

    sliceLabel.setY(labelInfo.getY());
    sliceLabel.setX(labelInfo.getX());

    // perform 'logical' clipping ourselves
    if ((labelInfo.getY() < frame.y) || (labelInfo.getY() + labelInfo.getHeight()) > frame.y + frame.h) {
      slice.setSliceLabel(null);
      slice.setNoOutsideFeeler(); // Bug 8358713 - don't show feelers if the label is 'clipped' (invisible)
    }
    else {
      DvtChartPieLabelUtils._truncateSliceLabel(pie, slice, labelInfo, isLeftSide);
      // If slice label has zero dimensions, don't add it to the slice, and disable feelers
      if ((labelInfo.getWidth() == 0) || (labelInfo.getHeight() == 0)) {
        slice.setSliceLabel(null);
        slice.setNoOutsideFeeler();
      }
      else
        slice.setSliceLabel(sliceLabel);
    }
  }
};


// replaces PieChart.drawFeeler
/**
 *
 * Sets the feeler line that extends from the pie to the targetPt on the given slice. This method computes where
 * on the pie the feeler line should start, and then the start point and targetPt are set on the input slice.
 *
 * @param {DvtChartPieLabelInfo} labelInfo A DvtChartPieLabelInfo object
 * @param {DvtChartPieSlice} slice A DvtChartPieSlice object
 * @param {boolean} isLeft Boolean indicating if these labels are on the left side of the pie
 * @return {number} The excess length of the horizontal feeler, i.e. the length of the horizontal feeler minus the minimum length
 * @private
 */
DvtChartPieLabelUtils._calculateFeeler = function(labelInfo, slice, isLeft) {
  var targetX = labelInfo.getX();
  var targetY = labelInfo.getY() + labelInfo.getHeight() * DvtChartPieLabelUtils._LABEL_TO_FEELER_OFFSET;
  var minHorizLength = DvtChartPieLabelUtils._FEELER_HORIZ_MINSIZE * slice.getRadiusX();

  var midX;
  if (isLeft) {
    targetX += DvtChartPieLabelUtils._LABEL_TO_FEELER_DISTANCE;
    midX = targetX + minHorizLength;
  }
  else {
    targetX -= DvtChartPieLabelUtils._LABEL_TO_FEELER_DISTANCE;
    midX = targetX - minHorizLength;
  }

  var startPt = {
    x: 0, y: 0
  };
  var midPt = {
    x: midX, y: targetY
  };
  var endPt = {
    x: targetX, y: targetY
  };

  var ma = labelInfo.getAngle();
  var tilt = DvtChartPieLabelUtils._adjustForDepth(ma, slice.getDepth());

  startPt = DvtChartPieRenderUtils.reflectAngleOverYAxis(ma, slice.getCenter().x, slice.getCenter().y + tilt, slice.getRadiusX(), slice.getRadiusY());

  // make set the first section of the feeler radial if possible
  var pa = dvt.Math.degreesToRads(labelInfo.getPosition());
  var radFeelerAngle = Math.abs(Math.atan2(midPt.x - startPt.x, startPt.y - midPt.y));
  var horizOffset = (startPt.y - midPt.y) * Math.tan(pa);// * pieChart.getRadiusX() / pieChart.getRadiusY();
  if ((pa > Math.PI / 2 && radFeelerAngle > Math.PI / 2 && radFeelerAngle < pa) || (pa < Math.PI / 2 && radFeelerAngle < Math.PI / 2 && radFeelerAngle > pa)) {
    if (isLeft) {
      midPt.x = startPt.x - horizOffset;
    }
    else {
      midPt.x = startPt.x + horizOffset;
    }
  }

  //store outside feeler points on slice
  //and let slice draw the feeler so that we can
  //easily redraw it when selecting
  slice.setOutsideFeelerPoints(startPt, midPt, endPt);
  return Math.abs(endPt.x - midPt.x) - minHorizLength;
};


/**

 * Generates the offset of a label feeler to account for the depth of a 3d pie.
 *
 * @param {number} ma The angle on the unit circle from which the leaderline should originate from
 * @param {number} pieDepth The pie chart's depth
 *
 * @return {number} The offset for the feeler line
 * @private
 */
DvtChartPieLabelUtils._adjustForDepth = function(ma, pieDepth) {
  var depth = 0;
  var leftMidHi = 189;
  var rightMidHi = 351;

  if (ma > leftMidHi && ma < rightMidHi) {
    depth = pieDepth;
  }

  return depth;
};


/**
 *  Finds the label corresponding to the most horizontal slice
 *
 *  @param {Array} alabels An array of DvtChartPieLabelInfo objects
 *  @return {number} the index of the most horizontal slice
 *  @private
 */
DvtChartPieLabelUtils._getMiddleLabel = function(alabels) {
  var bestAngle = 91;
  var bestIndex = -1;
  for (var i = 0; i < alabels.length; i++) {
    var pa = alabels[i].getPosition();
    if (Math.abs(pa - 90) < bestAngle) {
      bestAngle = Math.abs(pa - 90);
      bestIndex = i;
    }
  }
  return bestIndex;
};


/**
 * Sets the label at its optimal position, assuming all other labels do not exist.
 * @param {DvtChartPie} pie
 * @param {DvtChartPieLabelInfo} labelInfo
 * @param {number} vertX The x-position where the labels are aligned.
 * @param {boolean} isLeft Whether the label is on the left side of the pie.
 * @private
 */
DvtChartPieLabelUtils._setOptimalLabelPosition = function(pie, labelInfo, vertX, isLeft) {
  //set optimal X
  labelInfo.setX(vertX);

  //set optimal Y
  //  var a = pie.getRadiusX() * (1 + DvtChartPieLabelUtils._FEELER_RAD_MINSIZE);
  var b = pie.getRadiusY() * (1 + DvtChartPieLabelUtils._FEELER_RAD_MINSIZE);
  var angleInRad = dvt.Math.degreesToRads(labelInfo.getPosition());
  //  var heightFromCenter = a*b*Math.cos(angleInRad) /
  //      Math.sqrt(Math.pow(a*Math.cos(angleInRad), 2) + Math.pow(b*Math.sin(angleInRad), 2)); //ellipse equation
  var heightFromCenter = b * Math.cos(angleInRad);
  var tilt = DvtChartPieLabelUtils._adjustForDepth(labelInfo.getAngle(), pie.getDepth());
  var optimalY = pie.getCenter().y - heightFromCenter - labelInfo.getHeight() * DvtChartPieLabelUtils._LABEL_TO_FEELER_OFFSET + tilt;
  labelInfo.setY(labelInfo.boundY(optimalY));
};

/**
 * Calculates the feeler angle for this label based on the projected x and y positions of the label outside of the slice
 * @param {DvtChartPieLabelInfo} labelInfo
 * @param {number} x The x position
 * @param {number} y The y position
 * @return {number} The angle for the feeler line
 * @private
 */
DvtChartPieLabelUtils._getRadFeelerAngle = function(labelInfo, x, y) {

  var slice = labelInfo.getSlice();
  var center = slice.getCenter();
  var ma = labelInfo.getAngle();
  var tilt = DvtChartPieLabelUtils._adjustForDepth(ma, slice.getDepth());
  var startPt = DvtChartPieRenderUtils.reflectAngleOverYAxis(ma, center.x, center.y + tilt, slice.getRadiusX(), slice.getRadiusY());
  return Math.atan2(Math.abs(x - startPt.x), startPt.y - y);
};

/**
 *  Adjusts the label locations by positioning the labels vertically in a column
 *  @param {DvtChartPie} pie
 *  @param {Array} alabels An array of DvtChartPieLabelInfo objects
 *  @param {boolean} isLeft Boolean indicating if these labels are on the left side of the pie
 *  @param {boolean} isTop Boolean indicating if these labels are on the top of the pie
 *  @param {boolean} isBottom Boolean indicating if these labels are at the bottom of the pie
 *  @private
 */
DvtChartPieLabelUtils._columnLabels = function(pie, alabels, isLeft, isTop, isBottom) {
  var frame = pie.__getFrame();
  var minY = frame.y;
  var maxY = frame.y + frame.h;
  var i;
  var labelInfo;
  var pa = 0;
  var radFeelerAngle;

  //determine the position where the column will be aligned
  var vertX = pie.getCenter().x;
  var feelerX;
  var minFeelerDist = pie.getRadiusX() * (1 + DvtChartPieLabelUtils._FEELER_RAD_MINSIZE + DvtChartPieLabelUtils._FEELER_HORIZ_MINSIZE);

  if (isLeft) {
    vertX -= minFeelerDist;
    feelerX = vertX + pie.getRadiusX() * DvtChartPieLabelUtils._FEELER_HORIZ_MINSIZE;
  }
  else {
    vertX += minFeelerDist;
    feelerX = vertX - pie.getRadiusX() * DvtChartPieLabelUtils._FEELER_HORIZ_MINSIZE;
  }

  //set the minimum heights that ensures as many labels as possible are displayed
  for (i = 0; i < alabels.length; i++) {
    labelInfo = alabels[i];
    pa = dvt.Math.degreesToRads(labelInfo.getPosition());
    radFeelerAngle = DvtChartPieLabelUtils._getRadFeelerAngle(labelInfo, feelerX, minY);

    // Remove labels that are more than a certain angle away from the slice.
    if (radFeelerAngle - pa > 0.45 * Math.PI) {
      alabels.splice(i, 1);
      i--;
    }
    else {
      alabels[i].setMinY(minY);
      minY += alabels[i].getHeight();
    }
  }

  //set the maximum heights that ensures as many labels as possible are displayed
  for (i = alabels.length - 1; i >= 0; i--) {
    labelInfo = alabels[i];
    pa = dvt.Math.degreesToRads(labelInfo.getPosition());
    radFeelerAngle = DvtChartPieLabelUtils._getRadFeelerAngle(labelInfo, feelerX, maxY);

    // Remove labels that are more than a certain angle away from the slice.
    if (pa - radFeelerAngle > 0.45 * Math.PI) {
      alabels.splice(i, 1);
    }
    else {
      maxY -= alabels[i].getHeight();
      alabels[i].setMaxY(maxY);
    }
  }

  var startIndex = DvtChartPieLabelUtils._getMiddleLabel(alabels);
  var startLabel = alabels[startIndex];

  //if the column is only partial but there are too many labels, then set the whole side as column
  if (isTop && !isBottom) {
    if (startLabel.getMinY() + startLabel.getHeight() > pie.getCenter().y) {
      isBottom = true;
    }
  }
  if (isBottom && !isTop) {
    if (startLabel.getMaxY() < pie.getCenter().y) {
      isTop = true;
    }
  }

  var labelPostion = startLabel.getPosition();
  if ((isBottom && isTop) || (labelPostion > 90 && isBottom) || (labelPostion <= 90 && isTop)) {
    DvtChartPieLabelUtils._setOptimalLabelPosition(pie, startLabel, vertX, isLeft);
    startLabel.setHasFeeler(true);
  }

  var highestY = startLabel.getY();
  var lowestY = startLabel.getY() + startLabel.getHeight();

  var optimalY;
  var labelHeight;

  if (isTop) {
    //labels above the start label
    for (i = startIndex - 1; i >= 0; i--) {
      labelInfo = alabels[i];
      labelHeight = labelInfo.getHeight();
      DvtChartPieLabelUtils._setOptimalLabelPosition(pie, labelInfo, vertX, isLeft);
      labelInfo.setHasFeeler(true);

      //avoid collision with the label below
      optimalY = labelInfo.getY();
      if (optimalY + labelHeight < highestY) {
        highestY = optimalY;
      }
      else {
        highestY -= labelHeight;
      }
      labelInfo.setY(highestY);
    }
  }

  if (isBottom) {
    //labels below the start label
    for (i = startIndex + 1; i < alabels.length; i++) {
      labelInfo = alabels[i];
      labelHeight = labelInfo.getHeight();
      DvtChartPieLabelUtils._setOptimalLabelPosition(pie, labelInfo, vertX, isLeft);
      labelInfo.setHasFeeler(true);

      //avoid collision with the label above
      optimalY = labelInfo.getY();
      if (optimalY > lowestY) {
        lowestY = optimalY + labelHeight;
      }
      else {
        lowestY += labelHeight;
      }
      labelInfo.setY(lowestY - labelHeight);
    }
  }
};

/**
 *
 * Truncates the label for the last time after the final X position is calculated
 *
 * @param {DvtChartPie} pie
 * @param {DvtChartPieSlice} slice
 * @param {DvtChartPieLabelInfo} labelInfo
 * @param {boolean} isLeft Boolean indicating whether or not this slice is on the left side of the pie
 *
 * @return {boolean} True if the height is modified after truncation, false otherwise
 * @private
 */

DvtChartPieLabelUtils._truncateSliceLabel = function(pie, slice, labelInfo, isLeft) {
  var sliceLabel = labelInfo.getSliceLabel();
  var style = sliceLabel.getCSSStyle();
  var maxLabelWidth = 0;
  var tmDimPt;

  // before setting the label displayable, make sure it is added to the DOM
  // necessary because the displayable will try to wrap, and to do that,
  // it needs to get the elements dimensions, which it can only do if it's
  // added to the DOM
  var numChildren = pie.getNumChildren();
  var removeTextArea = false;
  if (!pie.contains(sliceLabel)) {
    pie.addChild(sliceLabel);
    removeTextArea = true;
  }

  sliceLabel.setCSSStyle(style);
  var labelStr = slice.getSliceLabelString();
  sliceLabel.setTextString(labelStr);

  if (removeTextArea) {
    pie.removeChildAt(numChildren);
  }

  maxLabelWidth = DvtChartPieLabelUtils.getMaxLabelWidth(pie, labelInfo.getX(), isLeft);

  // truncates with larger space
  tmDimPt = DvtChartPieLabelUtils._getTextDimension(pie, slice, sliceLabel, maxLabelWidth, labelInfo.getInitialNumLines());

  // Update labelinfo
  labelInfo.setWidth(tmDimPt.x);

  if (labelInfo.getHeight() != tmDimPt.y) {
    labelInfo.setHeight(tmDimPt.y);// new height
    return true;
  }
  else {
    return false;
  }

};


/**
 * Create initial layout, placing each label in its ideal location. Locations will be subsequently updated
 * to account for collisions
 * @param {DvtChartPie} pie
 * @return {Array}  An array with two elements. The first element is an array of DvtChartPieLabelInfo objects for the
 *                  labels on the left side of the pie.  The second element is an array of DvtChartPieLabelInfo objects
 *                  for the labels on the right side of the pie.
 * @private
 */
DvtChartPieLabelUtils._generateInitialLayout = function(pie) {
  var arArrays = new Array(2);
  var leftLabels = [];
  var rightLabels = [];

  var slices = pie.__getSlices();
  var frame = pie.__getFrame();

  for (var i = 0; i < slices.length; i++) {
    var slice = slices[i];
    // Only doing layout for outside labels, so skip any labels that have a position of none or inside, or was already positioned inside in auto layout
    var labelPosition = pie.getSeriesLabelPosition(slice.getSeriesIndex());
    if ((slice.getSliceLabel() != null) || (labelPosition == 'none') || (labelPosition == 'center'))
      continue;

    var s_label = DvtChartPieLabelUtils._createLabel(slice, false);

    var ma = slice.getAngleStart() + (slice.getAngleExtent() / 2);
    if (ma > 360)
      ma -= 360;
    if (ma < 0)
      ma += 360;

    var labelPt = DvtChartPieRenderUtils.reflectAngleOverYAxis(ma, pie.getCenter().x, pie.getCenter().y, pie.getRadiusX() * DvtChartPieLabelUtils._OUTSIDE_LABEL_DISTANCE, pie.getRadiusY() * DvtChartPieLabelUtils._OUTSIDE_LABEL_DISTANCE);

    var isLeftSide = ma >= 90 && ma < 270;
    var maxLabelWidth = DvtChartPieLabelUtils.getMaxLabelWidth(pie, labelPt.x, isLeftSide);

    var tmDimPt = DvtChartPieLabelUtils._getTextDimension(pie, slice, s_label, maxLabelWidth, DvtChartPieLabelUtils._MAX_LINES_PER_LABEL);// set up for word wrap
    var midArea = 15;

    if (ma < 180 - midArea && ma > midArea) {
      //upper half
      labelPt.y -= tmDimPt.y * 1;
    }
    else if (ma < midArea || ma > 360 - midArea) {
      //right side, near horizontal
      labelPt.y -= tmDimPt.y * 0.5;
      labelPt.x += tmDimPt.y * 0.2;
    }
    else if (ma > 180 - midArea && ma < 180 + midArea) {
      //left side, near horizontal
      labelPt.y -= tmDimPt.y * 0.5;
      labelPt.x -= tmDimPt.y * 0.2;
    }

    var tilt = DvtChartPieLabelUtils._adjustForDepth(ma, pie.getDepth());
    labelPt.y += tilt;

    if (slices.length == 1) // only 1 label
      labelPt.x -= tmDimPt.x / 2; //position the label at the center

    if (labelPt.y < frame.y || (labelPt.y + tmDimPt.y) > frame.y + frame.h) // label will not fit with appropriate spacing
      continue;

    var pa;
    if (ma >= 90.0 && ma < 270.0) { // left side
      // right align
      s_label.alignRight();
      //        s_label.alignTop();  // alignTop impl buggy - too much interline space in FF
      // normalize from 0 to 180
      pa = ma - 90.0;
      DvtChartPieLabelUtils._createLabelInfo(slice, s_label, ma, pa, tmDimPt, labelPt, leftLabels);
    }
    else { // right side
      // normalize from 0 to 180
      pa = (ma <= 90.0) ? Math.abs(90 - ma) : (180 - (ma - 270));
      DvtChartPieLabelUtils._createLabelInfo(slice, s_label, ma, pa, tmDimPt, labelPt, rightLabels);
    }
  }

  arArrays[0] = leftLabels;
  arArrays[1] = rightLabels;

  return arArrays;

};

/**
 * Create the DvtChartPieLabelInfo property bag object for a given slice and inserts it into labelInfoArray,
 * it its properly sorted position (where top-most labels are at the start of the array)
 *
 * @param {DvtChartPieSlice} slice
 * @param {dvt.OutputText|dvt.MultilineText} sliceLabel  The physical label we will associate with thie DvtChartPieLabelInfo. This
 label will be the one eventually associated with the input slice, if this
 label gets rendered
 * @param {number} ma The angle for the feeler line, with 0 degrees being the standard
 *                    0 degrees in the trigonometric sense (3 o'clock position)
 * @param {number} pa The normalized midpoint angle, where 0 degrees is at 12 o'clock
 *                    and angular measures are degrees away from 12 o'clock (so 90 degrees
 *                    can be either at 3 o'clock or 9 o'clock on the unit circle. Used to order slice
 *                    labels from top to bottom
 * @param {object} tmDimPt Object representing the width and height of the slice label
 * @param {object} labelPt The outside endpoint of the feeler line
 * @param {Array} labelInfoArray Where we store the newly created DvtChartPieLabelInfo
 * @private
 */

// method carefully refactored from the end of PieChart.prepareLabels
DvtChartPieLabelUtils._createLabelInfo = function(slice, sliceLabel, ma, pa, tmDimPt, labelPt, labelInfoArray) {
  var insertPos = - 1;
  var labelInfo;
  var s_label = sliceLabel;

  // insertion "sort"
  for (var j = 0; j < labelInfoArray.length; j++) {
    labelInfo = labelInfoArray[j];
    if (labelInfo.getPosition() > pa) {
      insertPos = j;
      break;
    }
  }

  if (insertPos == - 1)
    insertPos = labelInfoArray.length;

  labelInfo = new DvtChartPieLabelInfo();

  labelInfo.setPosition(pa);
  labelInfo.setAngle(ma);
  labelInfo.setSliceLabel(s_label);
  labelInfo.setSlice(slice);
  labelInfo.setWidth(tmDimPt.x);
  labelInfo.setHeight(tmDimPt.y);
  labelInfo.setX(labelPt.x);
  labelInfo.setY(labelPt.y);

  labelInfoArray.splice(insertPos, 0, labelInfo);
};

/**
 *
 * Wraps and truncates the text in the pieLabel, and returns a pt describing the new dimensions
 * @param {DvtChartPie} pieChart
 * @param {DvtChartPieSlice} slice
 * @param {dvt.MultilineText} sliceLabel the text instance to wrap and truncate
 * @param {Number} maxWidth the maxWidth of a line
 * @param {Number} maxLines the maximum number of lines to wrap, after which the rest of the text is truncated
 * @return {object} a point describing the new dimensions
 * @private
 */

DvtChartPieLabelUtils._getTextDimension = function(pieChart, slice, sliceLabel, maxWidth, maxLines) {
  // Truncate and wrap the text to fit in the available space
  sliceLabel.setMaxLines(maxLines);
  var minChars = !DvtChartPieLabelUtils._isTextLabel(pieChart, slice) ? sliceLabel.getTextString().length : null;
  if (dvt.TextUtils.fitText(sliceLabel, maxWidth, Infinity, pieChart, minChars)) {
    // Add the label to the DOM to get dimensions
    pieChart.addChild(sliceLabel);
    var dimensions = sliceLabel.getDimensions();
    pieChart.removeChild(sliceLabel);
    return {x: dimensions.w, y: dimensions.h};
  }
  else
    // It doesn't fit. return dimensions of 0x0
    return {x: 0, y: 0};
};

/**
 * Checks whether the label for the given slice is text or numeric
 * @param {DvtChartPie} pie
 * @param {DvtChartPieSlice} slice
 * @return {boolean} whether the label associated with the slice is text
 * @private
 */
DvtChartPieLabelUtils._isTextLabel = function(pie, slice) {
  var customLabel = slice.getCustomLabel();
  return (pie.getOptions()['styleDefaults']['sliceLabelType'].indexOf('text') != -1) || ((customLabel != null) && (typeof customLabel != 'number'));
};

/**
 *  Returns the maximum label length
 *  @param {DvtChartPie} pie
 *  @param {number} labelX the x point of the label
 *  @param {boolean} isLeftSide Indicates if the label is on left side of the pie chart
 *  @return {number} the maximum label length
 */
DvtChartPieLabelUtils.getMaxLabelWidth = function(pie, labelX, isLeftSide) {
  var frame = pie.__getFrame();
  return isLeftSide ? labelX - frame.x : frame.x + frame.w - labelX;
};

/**
 *  Returns the pie center option
 *  @param {object} options The options object
 *  @return {object} pieCenter object
 */
DvtChartPieLabelUtils.getPieCenterOptions = function(options) {
  var pieCenter = dvt.JsonUtils.clone(options['pieCenter']);
  var deprecatedPieCenter = options['pieCenterLabel'];
  if (deprecatedPieCenter['text']) {
    pieCenter['label'] = deprecatedPieCenter['text'];
    pieCenter['labelStyle'] = new dvt.CSSStyle(deprecatedPieCenter['style']);
  }

  return pieCenter;
};
/**
 * Renderer for dvt.Chart.
 * @class
 */
var DvtChartRenderer = new Object();

dvt.Obj.createSubclass(DvtChartRenderer, dvt.Obj);

/** @const @private */
DvtChartRenderer._BUTTON_SIZE = 16;
/** @const @private */
DvtChartRenderer._BUTTON_PADDING = 5;
/** @const @private */
DvtChartRenderer._BUTTON_CORNER_DIST = 4;
/** @const @private */
DvtChartRenderer._BUTTON_OPACITY = 0.8;

/** @const @private */
DvtChartRenderer._MOUSE_WHEEL_ZOOM_RATE_SLOW = 0.05;
/** @const @private */
DvtChartRenderer._MOUSE_WHEEL_ZOOM_RATE_FAST = 0.2;


/**
 * Renders the chart contents into the available space.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space.
 */
DvtChartRenderer.render = function(chart, container, availSpace) {
  DvtChartRenderer._renderBackground(chart, container, availSpace);

  if (!DvtChartDataUtils.hasInvalidData(chart)) {
    // Store min/max coords for axis label overflow
    if (!DvtChartTypeUtils.isOverview(chart)) {
      chart.getOptions()['_maxOverflowCoord'] = availSpace.x + availSpace.w;
      chart.getOptions()['_minOverflowCoord'] = availSpace.x;
    }

    // Layout and draw the contents.  Each render call will update availSpace.
    // 1. Fixed space items: Titles and title separator
    // 2. Variable size: Legend and Axes
    // 3. Remaining space: Plot Area
    DvtChartRenderer._addOuterGaps(chart, availSpace);
    var titleSpace = availSpace.clone();
    DvtChartRenderer._renderTitles(chart, container, availSpace);
    DvtChartRenderer._adjustAvailSpace(availSpace);

    DvtChartLegendRenderer.render(chart, container, availSpace);
    DvtChartRenderer._adjustAvailSpace(availSpace);

    var horizSbDim = DvtChartRenderer._prerenderHorizScrollbar(chart, container, availSpace);
    var vertSbDim = DvtChartRenderer._prerenderVertScrollbar(chart, container, availSpace);
    DvtChartRenderer._adjustAvailSpace(availSpace);
    chart.__setAxisSpace(availSpace.clone());

    DvtChartAxisRenderer.render(chart, container, availSpace);
    DvtChartRenderer._adjustAvailSpace(availSpace);
    DvtChartRenderer._positionLegend(chart.legend, availSpace);
    chart.__setPlotAreaSpace(availSpace.clone());

    DvtChartRenderer._setEventHandlers(chart);
    DvtChartRenderer._renderScrollbars(chart, horizSbDim, vertSbDim);

    DvtChartRenderer._updateTitles(chart, container, titleSpace, availSpace); // reposition title and/or footnote if aligned to plot area
    DvtChartRenderer._renderPlotArea(chart, container, availSpace);
    if (DvtChartTypeUtils.isPolar(chart))
      container.addChild(chart.yAxis); // move radial labels above the plot area objects

    DvtChartRenderer._renderDragButtons(chart, container);
  }
  else // Render the empty text
    DvtChartRenderer.renderEmptyText(chart, container, availSpace);
};


/**
 * Sets the marquee and pan/zoom event handlers.
 * @param {dvt.Chart} chart
 * @private
 */
DvtChartRenderer._setEventHandlers = function(chart) {
  var options = chart.getOptions();
  var em = chart.getEventManager();

  if (!DvtChartTypeUtils.hasAxes(chart) || DvtChartTypeUtils.isOverview(chart))
    return;

  var chartBounds = new dvt.Rectangle(0, 0, chart.getWidth(), chart.getHeight());
  var plotAreaBounds = chart.__getPlotAreaSpace();
  var axisBounds = chart.__getAxisSpace();
  var horizAxisBounds = new dvt.Rectangle(plotAreaBounds.x, axisBounds.y, plotAreaBounds.w, axisBounds.h);
  var vertAxisBounds = new dvt.Rectangle(axisBounds.x, plotAreaBounds.y, axisBounds.w, plotAreaBounds.h);

  var marqueeFill = new dvt.SolidFill(options['styleDefaults']['marqueeColor']);
  var marqueeStroke = new dvt.SolidStroke(options['styleDefaults']['marqueeBorderColor']);

  var marqueeHandler, panZoomHandler;

  if (DvtChartEventUtils.isScrollable(chart)) {
    // Pan/Zoom
    var zoomRate = DvtChartEventUtils.isDelayedScroll(chart) ? DvtChartRenderer._MOUSE_WHEEL_ZOOM_RATE_FAST : DvtChartRenderer._MOUSE_WHEEL_ZOOM_RATE_SLOW;
    panZoomHandler = new dvt.PanZoomHandler(chart, plotAreaBounds, chartBounds, zoomRate);
    panZoomHandler.setPanCursor(options['_resources']['panCursorUp'], options['_resources']['panCursorDown']);
    em.setPanZoomHandler(panZoomHandler);

    if (DvtChartEventUtils.isZoomable(chart)) {
      var direction = DvtChartEventUtils.getZoomDirection(chart);
      // Marquee Zoom
      if (DvtChartTypeUtils.isHorizontal(chart) || direction == 'y')
        marqueeHandler = new dvt.MarqueeHandler(chart, plotAreaBounds, chartBounds, marqueeFill, marqueeStroke, false, true, null, vertAxisBounds);
      else if (DvtChartTypeUtils.isBLAC(chart) || direction == 'x')
        marqueeHandler = new dvt.MarqueeHandler(chart, plotAreaBounds, chartBounds, marqueeFill, marqueeStroke, true, false, horizAxisBounds, null);
      else
        marqueeHandler = new dvt.MarqueeHandler(chart, plotAreaBounds, chartBounds, marqueeFill, marqueeStroke, true, true, horizAxisBounds, vertAxisBounds);
      em.setMarqueeZoomHandler(marqueeHandler);
    }
  }

  if (options['selectionMode'] == 'multiple') {
    // Marquee Select
    marqueeHandler = new dvt.MarqueeHandler(chart, plotAreaBounds, chartBounds, marqueeFill, marqueeStroke, true, true, horizAxisBounds, vertAxisBounds);
    em.setMarqueeSelectHandler(marqueeHandler);
  }
};


/**
 * Cleans up and rerenders the axis and the plot area.
 * @param {dvt.Chart} chart
 * @param {dvt.Container} container The container to render into.
 */
DvtChartRenderer.rerenderAxisAndPlotArea = function(chart, container) {
  if (DvtChartDataUtils.hasInvalidData(chart))
    return;

  var availSpace = chart.__getAxisSpace().clone();

  // Save focus and selection and clean up
  var selectionHandler = chart.getSelectionHandler();
  if (selectionHandler)
    var selectedIds = selectionHandler.getSelectedIds();
  var focusState = chart.__cacheChartFocus();
  chart.__cleanUpAxisAndPlotArea();

  DvtChartAxisRenderer.render(chart, container, availSpace);
  DvtChartRenderer._adjustAvailSpace(availSpace);

  chart.__setPlotAreaSpace(availSpace.clone());
  DvtChartRenderer._renderPlotArea(chart, container, availSpace);

  // Reapply selection
  if (selectionHandler)
    selectionHandler.processInitialSelections(selectedIds, chart.getChartObjPeers());

  chart.getEventManager().autoToggleZoomButton();
  DvtChartRenderer.positionDragButtons(chart); //reposition because the plot area dims may have changed

  // Restore focus and reapply highlight
  chart.highlight(DvtChartStyleUtils.getHighlightedCategories(chart));
  chart.__restoreChartFocus(focusState);
};


/**
 * Renders the chart background.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartRenderer._renderBackground = function(chart, container, availSpace) {
  // Chart background: Apply invisible background for interaction support
  var rect = new dvt.Rect(chart.getCtx(), availSpace.x, availSpace.y, availSpace.w, availSpace.h);
  rect.setInvisibleFill();
  container.addChild(rect);
};


/**
 * Adds paddings to the chart.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartRenderer._addOuterGaps = function(chart, availSpace) {
  var options = chart.getOptions();
  var gapWidth = DvtChartDefaults.getGapWidth(chart, options['layout']['outerGapWidth']);
  var gapHeight = DvtChartDefaults.getGapHeight(chart, options['layout']['outerGapHeight']);

  if (options['styleDefaults']['padding'] == 'none' ||
      DvtChartTypeUtils.isStandalonePlotArea(chart) || DvtChartTypeUtils.isStandaloneXAxis(chart) ||
      DvtChartTypeUtils.isStandaloneYAxis(chart) || DvtChartTypeUtils.isStandaloneY2Axis(chart)) {
    // Set the padding to at most 1px.
    gapWidth = Math.min(gapWidth, 1);
    gapHeight = Math.min(gapHeight, 1);
  }

  availSpace.x += gapWidth;
  availSpace.w -= 2 * gapWidth;
  availSpace.y += gapHeight;
  availSpace.h -= 2 * gapHeight;
};

/**
 * Renders the chart titles and updates the available space.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartRenderer._renderTitles = function(chart, container, availSpace) {
  var options = chart.getOptions();

  // Title
  if (options['title']['text']) {
    var titleObj = DvtChartTextUtils.createText(chart.getEventManager(), container, options['title']['text'], options['title']['style'],
                                                availSpace.x, availSpace.y, availSpace.w, availSpace.h);

    var titleHeight;
    var titleDims;
    var titleAlign = options['title']['hAlign'] != null ? options['title']['hAlign'] : options['title']['halign'];
    var alignTitlesToPlotArea = titleAlign.substring(0, 8) == 'plotArea';
    if (titleObj) {
      // Calc the dimensions to figure out remaining space
      titleDims = titleObj.getDimensions();
      titleHeight = titleDims.h;

      // WAI-ARIA
      titleObj.setAriaProperty('hidden', null);
    } else {
      titleHeight = 0;
      titleDims = new dvt.Rectangle(0, 0, 0, 0);
    }

    // Subtitle
    if (options['subtitle']['text']) {
      var subtitleObj = new dvt.OutputText(chart.getCtx(), options['subtitle']['text'], availSpace.x, availSpace.y);
      if (subtitleObj) {
        subtitleObj.setCSSStyle(options['subtitle']['style']);
        container.addChild(subtitleObj);
        var subtitleDims = subtitleObj.measureDimensions();

        // Put subtitle on next next line if it does not fit on same line as title, or if titles will be aligned to plot area
        var titleSubtitleGap = DvtChartDefaults.getGapWidth(chart, options['layout']['titleSubtitleGapWidth']);
        var titleSpace = titleDims.w + titleSubtitleGap + subtitleDims.w;
        if (titleSpace > availSpace.w || alignTitlesToPlotArea) {
          titleSubtitleGap = DvtChartDefaults.getGapHeight(chart, options['layout']['titleSubtitleGapHeight']);
          subtitleObj.setY(availSpace.y + titleHeight + titleSubtitleGap);

          if (dvt.TextUtils.fitText(subtitleObj, availSpace.w, availSpace.h, container)) {
            subtitleDims = subtitleObj.measureDimensions();
            titleHeight += subtitleDims.h + titleSubtitleGap;
            if (dvt.Agent.isRightToLeft(chart.getCtx())) {
              if (subtitleObj)
                subtitleObj.setX(availSpace.w - subtitleDims.w);
              if (titleObj)
                titleObj.setX(availSpace.w - titleDims.w);
            }
          }
        }
        else {
          var alignTextBottomsDiff = titleDims.h - subtitleDims.h;
          subtitleObj.setY(alignTextBottomsDiff + availSpace.y);
          if (titleObj) {
            dvt.LayoutUtils.align(availSpace, titleAlign, titleObj, titleSpace);
            // Adjust the positions based on locale
            if (dvt.Agent.isRightToLeft(chart.getCtx())) {
              subtitleObj.setX(titleObj.getX());
              if (titleObj)
                titleObj.setX(titleObj.getX() + subtitleDims.w + titleSubtitleGap);
            }
            else {
              subtitleObj.setX(titleObj.getX() + titleSpace - subtitleDims.w);
            }
          }
        }

        // WAI-ARIA
        subtitleObj.setAriaProperty('hidden', null);

        // Associate with logical object to support truncation
        chart.getEventManager().associate(subtitleObj, new dvt.SimpleObjPeer(subtitleObj.getUntruncatedTextString()));
      }
    }
    else {
      dvt.LayoutUtils.align(availSpace, titleAlign, titleObj, titleDims.w);
    }

    // Put to cache for use when repositioning to plot area
    if (alignTitlesToPlotArea) {
      chart.putToCache('title', titleObj);
      chart.putToCache('subtitle', subtitleObj);
    }

    // Update available space
    var titleGapBelow = options['titleSeparator']['rendered'] == 'on' ? options['layout']['titleSeparatorGap'] : options['layout']['titlePlotAreaGap'];
    availSpace.y += titleHeight + DvtChartDefaults.getGapHeight(chart, titleGapBelow);
    availSpace.h -= titleHeight + DvtChartDefaults.getGapHeight(chart, titleGapBelow);

    // Title Separator
    if (options['titleSeparator']['rendered'] == 'on') {
      var upperSepObj = new dvt.Line(chart.getCtx(), availSpace.x, availSpace.y, availSpace.x + availSpace.w, availSpace.y);
      var lowerSepObj = new dvt.Line(chart.getCtx(), availSpace.x, availSpace.y + 1, availSpace.x + availSpace.w, availSpace.y + 1);
      upperSepObj.setSolidStroke(options['titleSeparator']['upperColor']);
      lowerSepObj.setSolidStroke(options['titleSeparator']['lowerColor']);
      container.addChild(upperSepObj);
      container.addChild(lowerSepObj);

      // Remove the title separator and gap height from available space
      var titleSepHeight = 2 + DvtChartDefaults.getGapHeight(chart, options['layout']['titlePlotAreaGap']);
      availSpace.y += titleSepHeight;
      availSpace.h -= titleSepHeight;
    }
  }

  // Footnote
  if (options['footnote']['text']) {
    var footnoteObj = DvtChartTextUtils.createText(chart.getEventManager(), container, options['footnote']['text'], options['footnote']['style'],
                                                   availSpace.x, 0, availSpace.w, availSpace.h);

    var footnoteAlign = options['footnote']['hAlign'] != null ? options['footnote']['hAlign'] : options['footnote']['halign'];
    var alignFootnoteToPlotArea = footnoteAlign.substring(0, 8) == 'plotArea';

    if (footnoteObj) {
      // Get height and reposition at correct location
      var footnoteDims = footnoteObj.getDimensions();
      footnoteObj.setY(availSpace.y + availSpace.h - footnoteDims.h);
      availSpace.h -= (footnoteDims.h + DvtChartDefaults.getGapHeight(chart, options['layout']['footnoteGap']));
      dvt.LayoutUtils.align(availSpace, footnoteAlign, footnoteObj, footnoteDims.w);

      // WAI-ARIA
      footnoteObj.setAriaProperty('hidden', null);
    }

    // Put to cache for use when repositioning to plot area
    if (alignFootnoteToPlotArea)
      chart.putToCache('footnote', footnoteObj);
  }
};

/**
 * Repositions the chart titles and/or footnote if they are aligned to the plot area.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} titleSpace The space that was available for the titles when initially rendered.
 * @param {dvt.Rectangle} availSpace The current available space.
 * @private
 */
DvtChartRenderer._updateTitles = function(chart, container, titleSpace, availSpace) {
  var options = chart.getOptions();

  var titleAlign = options['title']['hAlign'] != null ? options['title']['hAlign'] : options['title']['halign'];
  var footnoteAlign = options['footnote']['hAlign'] != null ? options['footnote']['hAlign'] : options['footnote']['halign'];

  var updateTitle = options['title']['text'] && titleAlign.substring(0, 8) == 'plotArea';
  var updateFootnote = options['footnote']['text'] && footnoteAlign.substring(0, 8) == 'plotArea';

  // Update the space available for the titles
  titleSpace.x = availSpace.x;
  titleSpace.w = availSpace.w;

  // Reposition title and subtitle
  if (updateTitle) {
    var titleObj = chart.getFromCache('title');
    var subtitleObj = chart.getFromCache('subtitle');
    var titleDims = titleObj.getDimensions();
    var subtitleDims;

    DvtChartRenderer._alignTextToPlotArea(container, titleSpace, titleAlign, titleObj, titleDims.w);
    if (subtitleObj) {
      subtitleDims = subtitleObj.getDimensions();
      DvtChartRenderer._alignTextToPlotArea(container, titleSpace, titleAlign, subtitleObj, subtitleDims.w);
    }
  }

  // Reposition footnote
  if (updateFootnote) {
    var footnoteObj = chart.getFromCache('footnote');
    var footnoteDims = footnoteObj.getDimensions();

    DvtChartRenderer._alignTextToPlotArea(container, titleSpace, footnoteAlign, footnoteObj, footnoteDims.w);
  }
};

/**
 * Realigns the given text object to the plot area space
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The current available space for the plot area.
 * @param {String} halign The alignment of the text.
 * @param {dvt.OutputText} text The text object to be aligned.
 * @param {Number} width The width of the text object.
 * @private
 */
DvtChartRenderer._alignTextToPlotArea = function(container, availSpace, halign, text, width) {
  if (dvt.TextUtils.fitText(text, availSpace.w, availSpace.h, container)) {
    if (halign == 'plotAreaStart')
      dvt.LayoutUtils.align(availSpace, 'start', text, width);
    else if (halign == 'plotAreaCenter')
      dvt.LayoutUtils.align(availSpace, 'center', text, width);
    else if (halign == 'plotAreaEnd')
      dvt.LayoutUtils.align(availSpace, 'end', text, width);
  }
};

/**
 * Renders plot area.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartRenderer._renderPlotArea = function(chart, container, availSpace) {
  if (DvtChartTypeUtils.hasAxes(chart)) {
    // Create a container for the plot area contents
    var plotArea = new dvt.Container(chart.getCtx());
    plotArea.setTranslate(availSpace.x, availSpace.y);
    container.addChild(plotArea);
    chart.setPlotArea(plotArea);

    // Render the plot area contents
    var plotAreaBounds = new dvt.Rectangle(0, 0, availSpace.w, availSpace.h);
    DvtChartPlotAreaRenderer.render(chart, plotArea, plotAreaBounds);
  }
  else if (DvtChartTypeUtils.isPie(chart)) {
    var pieChart = new DvtChartPie(chart, availSpace);
    if (pieChart.__getSlices().length > 0) {
      container.addChild(pieChart);
      chart.setPlotArea(pieChart);
      pieChart.render();
    }
    else
      DvtChartRenderer.renderEmptyText(chart, container, availSpace);
  }
  else if (DvtChartTypeUtils.isFunnel(chart)) {
    DvtChartFunnelRenderer.render(chart, container, availSpace);
  }

  // All space is now used
  availSpace.w = 0;
  availSpace.h = 0;
};


/**
 * Renders the empty text for the component.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space.
 */
DvtChartRenderer.renderEmptyText = function(chart, container, availSpace) {
  // Get the empty text string
  var options = chart.getOptions();
  if (DvtChartDataUtils.hasInvalidTimeData(chart) && DvtChartDataUtils.hasData(chart))
    var emptyTextStr = dvt.Bundle.getTranslation(options, 'labelInvalidData', dvt.Bundle.UTIL_PREFIX, 'INVALID_DATA');
  else {
    emptyTextStr = options['emptyText'];
    if (!emptyTextStr) {
      emptyTextStr = dvt.Bundle.getTranslation(options, 'labelNoData', dvt.Bundle.UTIL_PREFIX, 'NO_DATA');
    }
  }

  dvt.TextUtils.renderEmptyText(container, emptyTextStr,
      new dvt.Rectangle(availSpace.x, availSpace.y, availSpace.w, availSpace.h),
      chart.getEventManager(), options['_statusMessageStyle']);
};


/**
 * Prepares the horizontal scrollbar for rendering.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space.
 * @return {dvt.Dimension} The dimension of the scrollbar.
 * @private
 */
DvtChartRenderer._prerenderHorizScrollbar = function(chart, container, availSpace) {
  var width = availSpace.w;
  var height = 0;
  if (DvtChartEventUtils.isScrollable(chart) && DvtChartTypeUtils.isHorizScrollbarSupported(chart)) {
    // Overview scrollbar
    if (DvtChartStyleUtils.isOverviewRendered(chart)) {
      height = Math.min(DvtChartStyleUtils.getOverviewHeight(chart), availSpace.h);
      if (height > 0) {
        chart.overview = new DvtChartOverview(chart);
        container.addChild(chart.overview);
        dvt.LayoutUtils.position(availSpace, 'bottom', chart.overview, width, height, 10); // TODO : store as default
      }
    }

    // Simple scrollbar
    else {
      height = chart.getOptions()['styleDefaults']['_scrollbarHeight'];
      chart.xScrollbar = new dvt.SimpleScrollbar(chart.getCtx(), chart.processEvent, chart);
      container.addChild(chart.xScrollbar);
      dvt.LayoutUtils.position(availSpace, 'bottom', chart.xScrollbar, width, height, 8);
      chart.overview = null; // clean up overview if existed from previous render
    }
  }
  else
    chart.overview = null; // clean up overview if existed from previous render

  return new dvt.Dimension(width, height);
};


/**
 * Prepares the vertical scrollbar for rendering.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space.
 * @return {dvt.Dimension} The dimension of the scrollbar.
 * @private
 */
DvtChartRenderer._prerenderVertScrollbar = function(chart, container, availSpace) {
  var width = 0;
  var height = availSpace.h;
  if (DvtChartEventUtils.isScrollable(chart) && DvtChartTypeUtils.isVertScrollbarSupported(chart)) {
    width = chart.getOptions()['styleDefaults']['_scrollbarHeight'];
    var scrollbar = new dvt.SimpleScrollbar(chart.getCtx(), chart.processEvent, chart);
    container.addChild(scrollbar);
    dvt.LayoutUtils.position(availSpace, dvt.Agent.isRightToLeft(chart.getCtx()) ? 'right' : 'left', scrollbar, width, height, 8);

    // Assign scrollbar to x- or y-axis depending on chart type
    if (DvtChartTypeUtils.isHorizontal(chart))
      chart.xScrollbar = scrollbar;
    else
      chart.yScrollbar = scrollbar;
  }

  return new dvt.Dimension(width, height);
};


/**
 * Renders the scrollbars.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Dimension} horizScrollbarDim The dimension of the horizontal scrollbar.
 * @param {dvt.Dimension} vertScrollbarDim The dimension of the vertical scrollbar.
 * @private
 */
DvtChartRenderer._renderScrollbars = function(chart, horizScrollbarDim, vertScrollbarDim) {
  var options = chart.getOptions();
  var sbOptions = {'color': options['styleDefaults']['_scrollbarHandleColor'], 'backgroundColor': options['styleDefaults']['_scrollbarTrackColor']};
  var plotAreaDim = chart.__getPlotAreaSpace();

  // Render x-axis simple scrollbar
  if (chart.xScrollbar) {
    sbOptions['min'] = chart.xAxis.getLinearGlobalMin();
    sbOptions['max'] = chart.xAxis.getLinearGlobalMax();
    // Vertical x-axis scrollbar
    if (DvtChartTypeUtils.isHorizontal(chart)) {
      sbOptions['isHorizontal'] = false;
      sbOptions['isReversed'] = false;
      chart.xScrollbar.setTranslateY(plotAreaDim.y);
      chart.xScrollbar.render(sbOptions, vertScrollbarDim.w, plotAreaDim.h);
    }
    // Horizontal x-axis scrollbar
    else {
      sbOptions['isHorizontal'] = true;
      sbOptions['isReversed'] = dvt.Agent.isRightToLeft(chart.getCtx());
      chart.xScrollbar.setTranslateX(plotAreaDim.x);
      chart.xScrollbar.render(sbOptions, plotAreaDim.w, horizScrollbarDim.h);
    }
    chart.xScrollbar.setViewportRange(chart.xAxis.getLinearViewportMin(), chart.xAxis.getLinearViewportMax());
  }

  // Render y-axis simple scrollbar
  if (chart.yScrollbar) {
    sbOptions['min'] = chart.yAxis.getLinearGlobalMin();
    sbOptions['max'] = chart.yAxis.getLinearGlobalMax();
    sbOptions['isHorizontal'] = false;
    sbOptions['isReversed'] = true;
    chart.yScrollbar.setTranslateY(plotAreaDim.y);
    chart.yScrollbar.render(sbOptions, vertScrollbarDim.w, plotAreaDim.h);
    chart.yScrollbar.setViewportRange(chart.yAxis.getLinearViewportMin(), chart.yAxis.getLinearViewportMax());
  }

  // Render x-axis overview scrollbar
  if (chart.overview) {
    var ovOptions = {
      'startTime': chart.xAxis.getLinearGlobalMin(),
      'endTime': chart.xAxis.getLinearGlobalMax(),
      'viewportStartTime': chart.xAxis.getLinearViewportMin(),
      'viewportEndTime': chart.xAxis.getLinearViewportMax(),
      'minimumWindowSize': chart.xAxis.getInfo().getMinimumExtent(),
      'chart': dvt.JsonUtils.clone(options)
    };

    if (!DvtChartEventUtils.isZoomable(chart))
      ovOptions['featuresOff'] = 'zoom';

    // Update min/max coords for axis label overflow
    ovOptions['chart']['_minOverflowCoord'] = options['_minOverflowCoord'] - plotAreaDim.x;
    ovOptions['chart']['_maxOverflowCoord'] = options['_maxOverflowCoord'] - plotAreaDim.x;
    chart.overview.setTranslateX(plotAreaDim.x);
    chart.overview.render(ovOptions, plotAreaDim.w, horizScrollbarDim.h);
    chart.overview.setViewportRange(chart.xAxis.getLinearViewportMin(), chart.xAxis.getLinearViewportMax());
  }
};


/**
 * Centers the legend within the availSpace.
 * @param {dvt.Legend} legend
 * @param {dvt.Rectangle} availSpace
 * @private
 */
DvtChartRenderer._positionLegend = function(legend, availSpace) {
  if (!legend)
    return;

  var dims = legend.getDimensions();
  var orientation = legend.getOptions()['orientation'];
  if (orientation == 'vertical' && dims.h <= availSpace.h)
    legend.setTranslateY(Math.round(availSpace.y + availSpace.h / 2 - dims.h / 2));
  else if (orientation == 'horizontal' && dims.w <= availSpace.w)
    legend.setTranslateX(Math.round(availSpace.x + availSpace.w / 2 - dims.w / 2));
};


/**
 * Renders the drag buttons.
 * @param {dvt.Chart} chart
 * @param {dvt.Container} container The container to render into.
 * @private
 */
DvtChartRenderer._renderDragButtons = function(chart, container) {
  var options = chart.getOptions();
  var em = chart.getEventManager();
  var dragMode = options['dragMode'];

  // If drag mode is specified by app, simply set the drag mode and don't draw the buttons
  if (dragMode != 'user') {
    if (dragMode == 'pan')
      em.setDragMode(DvtChartEventManager.DRAG_MODE_PAN);
    else if (dragMode == 'zoom')
      em.setDragMode(DvtChartEventManager.DRAG_MODE_ZOOM);
    else if (dragMode == 'select')
      em.setDragMode(DvtChartEventManager.DRAG_MODE_SELECT);
    else
      em.setDragMode(DvtChartEventManager.DRAG_MODE_OFF);
    return;
  }

  if (!DvtChartTypeUtils.hasAxes(chart) || DvtChartTypeUtils.isOverview(chart))
    return;

  var isTouch = dvt.Agent.isTouchDevice();
  var isScrollable = DvtChartEventUtils.isScrollable(chart);

  chart.dragButtons = new dvt.Container(chart.getCtx());
  var resources = options['_resources'];

  var tooltip, position;

  if (options['selectionMode'] == 'multiple' && (isTouch || isScrollable)) {
    position = isScrollable && (isTouch || DvtChartEventUtils.isZoomable(chart)) ? 'end' : 'solo';
    em.selectButton = DvtChartRenderer._createDragButton(chart, chart.dragButtons,
        resources['selectUp'], resources['selectDown'], em.onSelectButtonClick, em, position);
    tooltip = dvt.Bundle.getTranslation(options, 'tooltipSelect', dvt.Bundle.CHART_PREFIX, 'MARQUEE_SELECT');
    em.selectButton.setTooltip(tooltip);
    em.associate(em.selectButton, em.selectButton);
  }

  if (isScrollable) {
    position = em.selectButton == null ? 'solo' : 'start';
    if (isTouch) {
      em.panButton = DvtChartRenderer._createDragButton(chart, chart.dragButtons,
          resources['panUp'], resources['panDown'], em.onPanButtonClick, em, position);
      tooltip = dvt.Bundle.getTranslation(options, 'tooltipPan', dvt.Bundle.CHART_PREFIX, 'PAN');
      em.panButton.setTooltip(tooltip);
      em.associate(em.panButton, em.panButton);
    }
    else if (DvtChartEventUtils.isZoomable(chart) && DvtChartTypeUtils.isScatterBubble(chart)) {
      em.zoomButton = DvtChartRenderer._createDragButton(chart, chart.dragButtons,
          resources['zoomUp'], resources['zoomDown'], em.onZoomButtonClick, em, position);
      tooltip = dvt.Bundle.getTranslation(options, 'tooltipZoom', dvt.Bundle.CHART_PREFIX, 'MARQUEE_ZOOM');
      em.zoomButton.setTooltip(tooltip);
      em.associate(em.zoomButton, em.zoomButton);
    }
  }

  DvtChartRenderer.positionDragButtons(chart);
  em.setDragMode(null); // set the default drag mode

  if (chart.dragButtons.getNumChildren() > 0) {
    chart.addChild(chart.dragButtons);

    if (isTouch) {
      if (isScrollable) {
        // Set initial mode to pan
        em.panButton.setToggled(true);
        em.onPanButtonClick(null);
      }
    }
    else {
      // Buttons are not shown initially on desktop.
      chart.hideDragButtons();
    }

    // Override the chart cursor.
    chart.dragButtons.setCursor('default');
  }
};


/**
 * Positions the drag button
 * @param {dvt.Chart} chart
 * @param {dvt.Button} button
 * @param {dvt.Rectangle} availSpace
 * @private
 */
DvtChartRenderer._positionDragButton = function(chart, button, availSpace) {
  var transX;
  if (dvt.Agent.isRightToLeft(chart.getCtx())) {
    transX = availSpace.x + DvtChartRenderer._BUTTON_PADDING;
    availSpace.x += DvtChartRenderer._BUTTON_SIZE + 2 * DvtChartRenderer._BUTTON_PADDING;
  }
  else
    transX = availSpace.x + availSpace.w - DvtChartRenderer._BUTTON_SIZE - DvtChartRenderer._BUTTON_PADDING;

  availSpace.w -= DvtChartRenderer._BUTTON_SIZE + 2 * DvtChartRenderer._BUTTON_PADDING;
  button.setTranslate(transX, availSpace.y + DvtChartRenderer._BUTTON_PADDING);
};


/**
 * Positions the drag buttons at the top left/right corner of the plot area.
 * @param {dvt.Chart} chart
 */
DvtChartRenderer.positionDragButtons = function(chart) {
  var availSpace = chart.__getPlotAreaSpace().clone();
  availSpace.x += DvtChartRenderer._BUTTON_CORNER_DIST;
  availSpace.w -= 2 * DvtChartRenderer._BUTTON_CORNER_DIST;
  availSpace.y += DvtChartRenderer._BUTTON_CORNER_DIST;

  var em = chart.getEventManager();
  if (em.selectButton)
    DvtChartRenderer._positionDragButton(chart, em.selectButton, availSpace);
  if (em.panButton)
    DvtChartRenderer._positionDragButton(chart, em.panButton, availSpace);
  if (em.zoomButton)
    DvtChartRenderer._positionDragButton(chart, em.zoomButton, availSpace);
};


/**
 * Creates the rounded square background for the drag button.
 * @param {dvt.Context} context
 * @param {string} position The position of the button: start, end, or solo.
 * @return {dvt.Rect} The button background.
 * @private
 */
DvtChartRenderer._createDragButtonBackground = function(context, position) {
  var blcr = 2;
  var trcr = 2;
  var isR2L = dvt.Agent.isRightToLeft(context);
  if (position == 'start')
    isR2L ? blcr = 0 : trcr = 0;
  else if (position == 'end')
    isR2L ? trcr = 0 : blcr = 0;

  var tlcr = blcr;
  var brcr = trcr;

  var pos = -DvtChartRenderer._BUTTON_PADDING;
  var size = DvtChartRenderer._BUTTON_SIZE + DvtChartRenderer._BUTTON_PADDING * 2;
  var cmd = dvt.PathUtils.roundedRectangle(pos, pos, size, size, tlcr, trcr, brcr, blcr);

  var background = new dvt.Path(context, cmd);

  // don't use pixel hinting on desktop bc the corners look broken
  if (dvt.Agent.getDevicePixelRatio() > 1) {
    background.setSolidStroke('#D8DEE3', 1, 1);
    background.setPixelHinting(true);
  }
  else
    background.setSolidStroke('#B8BDC1', 1, 1);

  return background;
};


/**
 * Creates and a drag button.
 * @param {dvt.Chart} chart
 * @param {dvt.Container} container The container for the button.
 * @param {string} upSrc The image URL for the up state.
 * @param {string} downSrc The image URL for the down state.
 * @param {object} callback The callback method of the button.
 * @param {object} callbackObj The object of the callback method.
 * @param {string} position The position of the button: start, end, or solo.
 * @return {dvt.Button}
 * @private
 */
DvtChartRenderer._createDragButton = function(chart, container, upSrc, downSrc, callback, callbackObj, position) {
  // Create the button and add to the container
  var context = chart.getCtx();

  // Initialize the button states
  var upState = DvtChartRenderer._createDragButtonBackground(context, position);
  upState.setSolidFill('#FFFFFF', DvtChartRenderer._BUTTON_OPACITY);
  upState.addChild(new dvt.Image(context, upSrc, 0, 0, DvtChartRenderer._BUTTON_SIZE, DvtChartRenderer._BUTTON_SIZE));

  var overState = DvtChartRenderer._createDragButtonBackground(context, position);
  overState.setSolidFill('#E2E3E4', DvtChartRenderer._BUTTON_OPACITY);
  overState.addChild(new dvt.Image(context, upSrc, 0, 0, DvtChartRenderer._BUTTON_SIZE, DvtChartRenderer._BUTTON_SIZE));

  var downState = DvtChartRenderer._createDragButtonBackground(context, position);
  downState.setFill(new dvt.LinearGradientFill(90, ['#0527CE', '#0586F0'], [DvtChartRenderer._BUTTON_OPACITY, DvtChartRenderer._BUTTON_OPACITY]));
  downState.addChild(new dvt.Image(context, downSrc, 0, 0, DvtChartRenderer._BUTTON_SIZE, DvtChartRenderer._BUTTON_SIZE));

  var overDownState = DvtChartRenderer._createDragButtonBackground(context, position);
  overDownState.setSolidFill('#0586F0', DvtChartRenderer._BUTTON_OPACITY);
  overDownState.addChild(new dvt.Image(context, downSrc, 0, 0, DvtChartRenderer._BUTTON_SIZE, DvtChartRenderer._BUTTON_SIZE));

  var button = new dvt.Button(context, upState, overState, downState, null, null, callback, callbackObj);
  button.setOverDownState(overDownState);
  button.setToggleEnabled(true);
  container.addChild(button);

  // Button should consume mousedown event so that drag is not initiated
  button.addEvtListener(dvt.MouseEvent.MOUSEDOWN, function(event) {
    event.stopPropagation();
  });

  // Add hit area to the button for touch devices
  if (dvt.Agent.isTouchDevice()) {
    var isR2L = dvt.Agent.isRightToLeft(context);
    var hitPadding = DvtChartRenderer._BUTTON_PADDING * 2;

    var hitArea;
    if (position == 'solo')
      hitArea = new dvt.Rect(context, -hitPadding, -hitPadding, DvtChartRenderer._BUTTON_SIZE + 2 * hitPadding, DvtChartRenderer._BUTTON_SIZE + 2 * hitPadding);
    else if ((position == 'start' && !isR2L) || (position == 'end' && isR2L)) // left button
      hitArea = new dvt.Rect(context, -hitPadding, -hitPadding, DvtChartRenderer._BUTTON_SIZE + 1.5 * hitPadding, DvtChartRenderer._BUTTON_SIZE + 2 * hitPadding);
    else // right button
      hitArea = new dvt.Rect(context, -0.5 * hitPadding, -hitPadding, DvtChartRenderer._BUTTON_SIZE + 1.5 * hitPadding, DvtChartRenderer._BUTTON_SIZE + 2 * hitPadding);

    hitArea.setInvisibleFill();
    button.addChild(hitArea);
  }

  return button;
};


/**
 * Helper function that adjusts the input rectangle to the closest pixel.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartRenderer._adjustAvailSpace = function(availSpace) {
  // : Adjust the bounds to the closest pixel to prevent antialiasing issues.
  availSpace.x = Math.round(availSpace.x);
  availSpace.y = Math.round(availSpace.y);
  availSpace.w = Math.round(availSpace.w);
  availSpace.h = Math.round(availSpace.h);
};


/**
 * Renders the chart data cursor.
 * @param {dvt.Chart} chart
 * @return {DvtChartDataCursor}
 */
DvtChartRenderer.renderDataCursor = function(chart) {
  var dataCursor = null;
  var options = chart.getOptions();
  var eventManager = chart.getEventManager();

  if (DvtChartTooltipUtils.isDataCursorEnabled(chart)) {
    dataCursor = new DvtChartDataCursor(chart.getCtx(), options['styleDefaults']['dataCursor'], DvtChartTypeUtils.isHorizontal(chart));
    dataCursor.setBehavior(DvtChartTooltipUtils.getDataCursorBehavior(chart));
    chart.addChild(dataCursor);

    var dataCursorHandler = new DvtChartDataCursorHandler(chart, dataCursor);
    eventManager.setDataCursorHandler(dataCursorHandler);

    // Initially display the data cursor based on the options
    chart.positionDataCursor(options['dataCursorPosition']);
  }
  else
    eventManager.setDataCursorHandler(null);

  return dataCursor;
};
/**
 * Performs layout and positioning for the chart axes.
 * @class
 */
var DvtChartAxisRenderer = new Object();

dvt.Obj.createSubclass(DvtChartAxisRenderer, dvt.Obj);


/**
 * @this {DvtChartAxisRenderer}
 * Renders axes and updates the available space.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space.
 */
DvtChartAxisRenderer.render = function(chart, container, availSpace) {
  if (!DvtChartTypeUtils.hasAxes(chart))
    return;

  DvtChartAxisUtils.applyInitialZooming(chart, availSpace);

  // Approximate bubble sizes are needed at this point to compute the axis ranges
  if (DvtChartTypeUtils.isBubble(chart))
    DvtChartMarkerUtils.calcBubbleSizes(chart, availSpace);

  // Render axes based on coordinate system
  if (DvtChartTypeUtils.isPolar(chart))
    DvtChartAxisRenderer._renderPolar(chart, container, availSpace);
  else
    DvtChartAxisRenderer._renderCartesian(chart, container, availSpace);
};


/**
 * Renders axes in Cartesian coordinate system.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartAxisRenderer._renderCartesian = function(chart, container, availSpace) {
  var options = chart.getOptions();
  var isHoriz = DvtChartTypeUtils.isHorizontal(chart);
  var isSplitDualY = DvtChartTypeUtils.isSplitDualY(chart);
  var totalAvailSpace = availSpace.clone();
  var yPosition = DvtChartAxisUtils.getYAxisPosition(chart);
  var y2Position = DvtChartAxisUtils.getY2AxisPosition(chart);

  DvtChartAxisRenderer._addAxisGaps(chart, availSpace);

  // Set which axis loses its last label when both plot areas are rendered to avoid overlapping labels
  if (isSplitDualY && yPosition == y2Position) {
    options['yAxis']['_skipHighestTick'] = isHoriz;
    options['y2Axis']['_skipHighestTick'] = !isHoriz;
  }

  // Layout Algorithm
  // 1. Get preferred size of y axes and allocate space.
  // 2. Get preferred size of x axis and allocate space.
  // 3. Update y axes with reduced size (due to x axis)

  // Get preferred sizing for the y axes
  var yInfo = DvtChartAxisRenderer._createYAxis(chart, container, availSpace, totalAvailSpace);
  var y2Info = DvtChartAxisRenderer._createY2Axis(chart, container, availSpace, totalAvailSpace);

  // Align the y and y2 axis tick marks if needed
  var bAligned = !isSplitDualY && options['y2Axis']['alignTickMarks'] == 'on' && options['y2Axis']['step'] == null;
  if (bAligned && yInfo && y2Info) {
    // Alignment won't happen below if yAxis.getPreferredSize() is not called in _createYAxis(), so we must call
    // _alignYAxes() again later after rendering yAxis.
    DvtChartAxisRenderer._alignYAxes(yInfo, y2Info);

    //  - y2 tick label is missing sometimes
    // recalculate preferred dimensions to account for new set of labels, which may be wider than previous dimensions
    if (!isHoriz)
      y2Info.dim = DvtChartAxisRenderer._getPreferredSize(chart, y2Info.axis, chart.y2Axis, y2Info.options, 'y2', availSpace, totalAvailSpace);
  }

  var yGap = DvtChartAxisUtils.getTickLabelGapSize(chart, 'y');
  var y2Gap = DvtChartAxisUtils.getTickLabelGapSize(chart, 'y2');

  // Position the axes to reserve space
  if (isSplitDualY && yPosition == y2Position) {
    var maxSize; // align the two y axes
    if (isHoriz) {
      maxSize = Math.max(yInfo.dim.h + yGap, y2Info.dim.h + y2Gap);
      yInfo.dim.h = maxSize - yGap;
      y2Info.dim.h = maxSize - y2Gap;
    }
    else {
      maxSize = Math.max(yInfo.dim.w + yGap, y2Info.dim.w + y2Gap);
      yInfo.dim.w = maxSize - yGap;
      y2Info.dim.w = maxSize - y2Gap;
    }
    DvtChartAxisRenderer._positionAxis(availSpace.clone(), yInfo, yGap); // clone so availSpace not subtracted twice
    DvtChartAxisRenderer._positionAxis(availSpace, y2Info, y2Gap);
  }
  else {
    DvtChartAxisRenderer._positionAxis(availSpace, yInfo, yGap);
    DvtChartAxisRenderer._positionAxis(availSpace, y2Info, y2Gap);
  }

  // Spark Bar Spacing Support
  var numGroups = DvtChartDataUtils.getGroupCount(chart);
  if (DvtChartStyleUtils.getBarSpacing(chart) == 'pixel' && DvtChartTypeUtils.isBar(chart)) {
    // Adjust the width so that it's an even multiple of the number of groups
    if (availSpace.w > numGroups) {
      var newWidth = Math.floor(availSpace.w / numGroups) * numGroups;
      availSpace.x += (availSpace.w - newWidth) / 2;
      availSpace.w = newWidth;
    }
  }

  // Get preferred sizing for the x axes, render, and position.
  var xInfo = DvtChartAxisRenderer._createXAxis(chart, container, availSpace, totalAvailSpace);
  xInfo.axis.render(xInfo.options, xInfo.dim.w, xInfo.dim.h);
  DvtChartAxisRenderer._positionAxis(availSpace, xInfo, DvtChartAxisUtils.getTickLabelGapSize(chart, 'x'));

  var splitterPosition = DvtChartStyleUtils.getSplitterPosition(chart);
  var isR2L = dvt.Agent.isRightToLeft(chart.getCtx());
  var yAvailSpace = DvtChartAxisRenderer._getSplitAvailSpace(availSpace, splitterPosition, isHoriz, isHoriz && isR2L);
  var y2AvailSpace = DvtChartAxisRenderer._getSplitAvailSpace(availSpace, 1 - splitterPosition, isHoriz, !isHoriz || !isR2L);

  // Render and position the y axes
  if (isHoriz) {
    if (yInfo) {
      yInfo.axis.setTranslateX(availSpace.x);
      if (isSplitDualY)
        yInfo.axis.render(yInfo.options, yAvailSpace.w, yInfo.dim.h, yAvailSpace.x, 0);
      else
        yInfo.axis.render(yInfo.options, availSpace.w, yInfo.dim.h);
    }

    if (bAligned && yInfo && y2Info) // align again after rendering yAxis
      DvtChartAxisRenderer._alignYAxes(yInfo, y2Info);

    if (y2Info) {
      y2Info.axis.setTranslateX(availSpace.x);
      if (isSplitDualY)
        y2Info.axis.render(y2Info.options, y2AvailSpace.w, y2Info.dim.h, y2AvailSpace.x, 0);
      else
        y2Info.axis.render(y2Info.options, availSpace.w, y2Info.dim.h);
    }

    DvtChartAxisRenderer._setOverflow(availSpace, yInfo, xInfo);
  }
  else {
    if (yInfo) {
      if (isSplitDualY)
        yInfo.axis.render(yInfo.options, yInfo.dim.w, yAvailSpace.h, 0, yAvailSpace.y);
      else
        yInfo.axis.render(yInfo.options, yInfo.dim.w, availSpace.h);
    }

    if (bAligned && yInfo && y2Info)  // align again after rendering yAxis
      DvtChartAxisRenderer._alignYAxes(yInfo, y2Info);

    if (y2Info) {
      if (isSplitDualY)
        y2Info.axis.render(y2Info.options, y2Info.dim.w, y2AvailSpace.h, 0, y2AvailSpace.y);
      else
        y2Info.axis.render(y2Info.options, y2Info.dim.w, availSpace.h);
    }
    DvtChartAxisRenderer._setOverflow(availSpace, xInfo, yInfo, y2Info);
  }

  DvtChartAxisRenderer._storeAxes(chart, xInfo, yInfo, y2Info);
};


/**
 * Renders axes in polar coordinate system.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartAxisRenderer._renderPolar = function(chart, container, availSpace) {
  var xInfo = DvtChartAxisRenderer._createXAxis(chart, container, availSpace, availSpace);
  xInfo.axis.setTranslateX(availSpace.x);
  xInfo.axis.setTranslateY(availSpace.y);
  xInfo.axis.render(xInfo.options, availSpace.w, availSpace.h);

  var yInfo = DvtChartAxisRenderer._createYAxis(chart, container, availSpace, availSpace);
  yInfo.axis.setTranslateX(availSpace.x);
  yInfo.axis.setTranslateY(availSpace.y);
  yInfo.axis.render(yInfo.options, availSpace.w, availSpace.h);

  DvtChartAxisRenderer._storeAxes(chart, xInfo, yInfo);
};


/**
 * Returns an object containing the x-axis with its position and preferred size.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space for the axis.
 * @param {dvt.Rectangle} totalAvailSpace The total available space allocated for all axes and plot area.
 * @return {object}
 * @private
 */
DvtChartAxisRenderer._createXAxis = function(chart, container, availSpace, totalAvailSpace) {
  var options = chart.getOptions();
  var position = DvtChartAxisUtils.getXAxisPosition(chart);

  // Clone the axis options and fill with data info
  var axisOptions = dvt.JsonUtils.clone(options['xAxis']);
  axisOptions['position'] = position;
  axisOptions['isStandalone'] = DvtChartTypeUtils.isStandaloneXAxis(chart);
  axisOptions['groupSeparators'] = options['styleDefaults']['groupSeparators'];

  DvtChartAxisRenderer._addCommonAxisAttributes(axisOptions, 'x', chart);

  // Calc the data attributes and pass in the min and max data values for that axis
  axisOptions['groups'] = options['groups'];
  axisOptions['_groupWidthRatios'] = DvtChartAxisUtils.getGroupWidthRatios(chart);
  axisOptions['timeAxisType'] = DvtChartAxisUtils.getTimeAxisType(chart);
  axisOptions['_environment'] = options['_environment'];
  axisOptions['_locale'] = options['_locale'];
  axisOptions['drilling'] = options['drilling'];

  var isHoriz = (position == 'top' || position == 'bottom');
  var isGridShifted = DvtChartAxisUtils.isGridShifted(chart);

  // Add a time/group axis bar offset if needed
  if (position == 'tangential' && DvtChartAxisUtils.hasGroupAxis(chart)) {
    if (isGridShifted) {
      axisOptions['startGroupOffset'] = 0.5;
      axisOptions['endGroupOffset'] = 0.5;
    }
    else
      axisOptions['endGroupOffset'] = 1;
  }
  else {
    var axisOffset = DvtChartAxisUtils.getAxisOffset(chart);
    axisOptions['startGroupOffset'] = axisOffset;
    axisOptions['endGroupOffset'] = axisOffset;

    if (DvtChartTypeUtils.hasUncenteredSeries(chart))
      axisOptions['endGroupOffset'] += 1;

    // Add extra offset if the y-axis tick label is inside
    if (!DvtChartEventUtils.isScrollable(chart) && !DvtChartTypeUtils.isOverview(chart)) {
      var numGroups = DvtChartDataUtils.getGroupCount(chart);
      if (DvtChartAxisUtils.isAxisRendered(chart, 'y') && DvtChartAxisUtils.isTickLabelInside(chart, 'y'))
        axisOptions[(isHoriz ? 'start' : 'end') + 'GroupOffset'] += numGroups * 0.04;
      if (DvtChartAxisUtils.isAxisRendered(chart, 'y2') && DvtChartAxisUtils.isTickLabelInside(chart, 'y2'))
        axisOptions[(isHoriz ? 'end' : 'start') + 'GroupOffset'] += numGroups * 0.04;
    }
  }

  // Specify the buffers (how much the labels can overflow)
  axisOptions['leftBuffer'] = isHoriz ? availSpace.x - totalAvailSpace.x : 0;
  axisOptions['rightBuffer'] = isHoriz ? (totalAvailSpace.w + totalAvailSpace.x) - (availSpace.w + availSpace.x) : 0;

  // Variable to be used for features that may be rendered at the label or in between labels
  axisOptions['_renderGridAtLabels'] = !isGridShifted || DvtChartAxisUtils.hasTimeAxis(chart);

  // Create the x-axis
  var axis = new DvtChartAxis(chart.getCtx(), chart.processEvent, chart);
  container.addChild(axis);
  var preferredSize = DvtChartAxisRenderer._getPreferredSize(chart, axis, chart.xAxis, axisOptions, 'x', availSpace, totalAvailSpace);

  // Update min/max coords for axis label overflow
  axisOptions['_minOverflowCoord'] = options['_minOverflowCoord'] - availSpace.x;
  axisOptions['_maxOverflowCoord'] = options['_maxOverflowCoord'] - availSpace.x;

  return {axis: axis, options: axisOptions, dim: preferredSize};
};


/**
 * Returns an object containing the y-axis with its position and preferred size.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space for the axis.
 * @param {dvt.Rectangle} totalAvailSpace The total available space allocated for all axes and plot area.
 * @return {object}
 * @private
 */
DvtChartAxisRenderer._createYAxis = function(chart, container, availSpace, totalAvailSpace) {
  var options = chart.getOptions();

  // Check that the graph needs a y1 axis
  if (DvtChartTypeUtils.hasY2DataOnly(chart))
    return null;

  // Clone the axis options and fill with data info
  var axisOptions = dvt.JsonUtils.clone(options['yAxis']);
  axisOptions['position'] = DvtChartAxisUtils.getYAxisPosition(chart);
  axisOptions['isStandalone'] = DvtChartTypeUtils.isStandaloneYAxis(chart);

  DvtChartAxisRenderer._addCommonAxisAttributes(axisOptions, 'y', chart);
  DvtChartAxisRenderer._addCommonYAxisAttributes(axisOptions, chart);

  // Create the axis and add to the display list for calc and rendering
  var axis = new DvtChartAxis(chart.getCtx(), chart.processEvent, chart);
  container.addChild(axis);
  var preferredSize = DvtChartAxisRenderer._getPreferredSize(chart, axis, chart.yAxis, axisOptions, 'y', availSpace, totalAvailSpace);
  DvtChartAxisRenderer._adjustYAxisForLabels(axis, axisOptions, chart, 'y');

  // Store the axis min/max for zoom & scroll
  options['yAxis']['min'] = axisOptions['min'];
  options['yAxis']['max'] = axisOptions['max'];

  return {axis: axis, options: axisOptions, dim: preferredSize};
};


/**
 * Returns an object containing the y2-axis with its position and preferred size.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space for the axis.
 * @param {dvt.Rectangle} totalAvailSpace The total available space allocated for all axes and plot area.
 * @return {object}
 * @private
 */
DvtChartAxisRenderer._createY2Axis = function(chart, container, availSpace, totalAvailSpace) {
  var options = chart.getOptions();

  // Check that the graph has y2-axis data
  if (!DvtChartTypeUtils.hasY2Data(chart))
    return;

  // Clone the axis options and fill with data info
  var axisOptions = dvt.JsonUtils.clone(options['y2Axis']);
  axisOptions['position'] = DvtChartAxisUtils.getY2AxisPosition(chart);
  axisOptions['isStandalone'] = DvtChartTypeUtils.isStandaloneY2Axis(chart);

  DvtChartAxisRenderer._addCommonAxisAttributes(axisOptions, 'y2', chart);
  DvtChartAxisRenderer._addCommonYAxisAttributes(axisOptions, chart);

  // Create the axis and add to the display list for calc and rendering
  var axis = new DvtChartAxis(chart.getCtx(), chart.processEvent, chart);
  container.addChild(axis);
  var preferredSize = DvtChartAxisRenderer._getPreferredSize(chart, axis, chart.y2Axis, axisOptions, 'y2', availSpace, totalAvailSpace);
  DvtChartAxisRenderer._adjustYAxisForLabels(axis, axisOptions, chart, 'y2');

  // Store the axis min/max for zoom & scroll
  options['y2Axis']['min'] = axisOptions['min'];
  options['y2Axis']['max'] = axisOptions['max'];

  return {axis: axis, options: axisOptions, dim: preferredSize};
};


/**
 * Add attributes that are common to any type of axis.
 * @param {object} axisOptions The axis options object to be filled in.
 * @param {string} type The axis type: x, y, or y2
 * @param {dvt.Chart} chart
 * @private
 */
DvtChartAxisRenderer._addCommonAxisAttributes = function(axisOptions, type, chart) {
  var options = chart.getOptions();

  axisOptions['skin'] = options['skin'];
  axisOptions['tickLabel']['position'] = DvtChartAxisUtils.isTickLabelInside(chart, type) ? 'inside' : 'outside';
  axisOptions['baselineScaling'] = DvtChartAxisUtils.getBaselineScaling(chart, type);
  // Skip highest tick mark and label if the axis tick label is inside or if the axis is tangential
  if (DvtChartAxisUtils.isTickLabelInside(chart, type) || axisOptions['position'] == 'tangential')
    axisOptions['_skipHighestTick'] = true;

  axisOptions['zoomAndScroll'] = DvtChartTypeUtils.isPolar(chart) ? 'off' : options['zoomAndScroll'];
  axisOptions['_isOverview'] = DvtChartTypeUtils.isOverview(chart);

  // Data Axis Support
  if (type != 'x' || !DvtChartAxisUtils.hasGroupAxis(chart)) {
    var dataValues = DvtChartDataUtils.getMinMaxValue(chart, type);
    axisOptions['dataMin'] = (axisOptions['dataMin'] != null) ? axisOptions['dataMin'] : dataValues['min'];
    axisOptions['dataMax'] = (axisOptions['dataMax'] != null) ? axisOptions['dataMax'] : dataValues['max'];
  }

  if (DvtChartTypeUtils.isPolar(chart)) {
    axisOptions['polarGridShape'] = DvtChartAxisUtils.isGridPolygonal(chart) ? 'polygon' : 'circle';
    axisOptions['_radius'] = chart.getRadius();
  }
};


/**
 * Add attributes that are common to Y and Y2 axes.
 * @param {object} axisOptions The axis options object to be filled in.
 * @param {dvt.Chart} chart
 * @private
 */
DvtChartAxisRenderer._addCommonYAxisAttributes = function(axisOptions, chart) {
  axisOptions['timeAxisType'] = 'disabled';

  // Enable continuous extent for smooth y-axis rescaling animation
  if (DvtChartEventUtils.isLiveScroll(chart) && DvtChartTypeUtils.isBLAC(chart) && !DvtChartTypeUtils.isPolar(chart))
    axisOptions['_continuousExtent'] = 'on';

  // Specify the buffers (how much the labels can overflow)
  if (axisOptions['isStandalone']) {
    axisOptions['leftBuffer'] = 0;
    axisOptions['rightBuffer'] = 0;
  }
  else if (DvtChartTypeUtils.isSplitDualY(chart)) {
    axisOptions['leftBuffer'] = Infinity;
    axisOptions['rightBuffer'] = Infinity;
  }
  else {
    var isR2L = dvt.Agent.isRightToLeft(chart.getCtx());
    axisOptions['leftBuffer'] = isR2L ? 0 : dvt.Axis.MINIMUM_AXIS_BUFFER;
    axisOptions['rightBuffer'] = isR2L ? dvt.Axis.MINIMUM_AXIS_BUFFER : 0;
  }
};


/**
 * Adjust the max and min of the axes considering the height of labels
 * @param {object} axis The axis object.
 * @param {object} axisOptions The axis options object to be filled in.
 * @param {dvt.Chart} chart
 * @param {string} type The y axis type: y, or y2
 * @private
 */
DvtChartAxisRenderer._adjustYAxisForLabels = function(axis, axisOptions, chart, type) {
  var options = chart.getOptions();

  // 
  // Increase the data max/min to cause an extra interval to be added if max/min label will be hidden or covered
  if (DvtChartAxisUtils.isYAdjustmentNeeded(chart)) {
    var dataLabelStyle = options['styleDefaults']['dataLabelStyle'];
    var stackLabelStyle = options['styleDefaults']['stackLabelStyle'];
    var axisInfo = axis.getInfo();
    var isStackLabelRendered = DvtChartStyleUtils.isStackLabelRendered(chart);
    var textHeight = dvt.TextUtils.getTextStringHeight(chart.getCtx(), isStackLabelRendered ? stackLabelStyle : dataLabelStyle);
    var buffer = 0;

    if (axisOptions['scale'] == 'log') {
      // Only consider max since min can't go below 0
      var requiredMaxValue = axis.getUnboundedValueAt(axis.getUnboundedCoordAt(axisInfo.getDataMax()) - textHeight);
      buffer = requiredMaxValue - axisInfo.getDataMax();
    }
    else {
      var splitYFactor = 1;
      if (DvtChartTypeUtils.isSplitDualY(chart)) {
        splitYFactor = type == 'y' ? DvtChartStyleUtils.getSplitterPosition(chart) : (1 - DvtChartStyleUtils.getSplitterPosition(chart));
      }
      var yAxisHeight = Math.abs(axisInfo.getEndCoord() - axisInfo.getStartCoord()) * splitYFactor;
      buffer = Math.abs(axisInfo.getViewportMax() - axisInfo.getViewportMin()) / yAxisHeight * textHeight;
    }

    if (DvtChartTypeUtils.isHorizontal(chart))
      buffer *= 4;

    if ((axisInfo.getDataMin() - axisInfo.getGlobalMin()) < buffer && axisInfo.getDataMin() < 0)
      axisOptions['dataMin'] -= buffer;

    if (axisInfo.getGlobalMax() - axisInfo.getDataMax() < buffer && axisInfo.getDataMax() > 0)
      axisOptions['dataMax'] += buffer;
  }
};


/**
 * Returns the preferred size of the axis.
 * @param {dvt.Chart} chart
 * @param {dvt.Axis} axis
 * @param {dvt.Axis} oldAxis The axis from previous render. We use the dims from the old axis to increase animation performance.
 * @param {Object} axisOptions
 * @param {String} type The axis type: x, y, or y2.
 * @param {dvt.Rectangle} availSpace
 * @param {dvt.Rectangle} totalAvailSpace
 * @return {dvt.Dimension} The preferred size.
 * @private
 */
DvtChartAxisRenderer._getPreferredSize = function(chart, axis, oldAxis, axisOptions, type, availSpace, totalAvailSpace) {
  var isStandalone = axisOptions['isStandalone'];
  var position = axisOptions['position'];
  var isHoriz = (position == 'top' || position == 'bottom');
  var gap = DvtChartAxisUtils.getTickLabelGapSize(chart, type);
  var maxSize = axisOptions['maxSize'];
  var axisSize = axisOptions['size'];
  var preferredWidth = availSpace.w;
  var preferredHeight = availSpace.h;

  // preferredSize not needed for polar
  if (position == 'radial' || position == 'tangential') {
    preferredWidth = 0;
    preferredHeight = 0;
  }

  // if axis not rendered, return 0 for the size dimension
  else if (axisOptions['rendered'] == 'off') {
    if (isHoriz)
      preferredHeight = 0;
    else
      preferredWidth = 0;
  }

  // for standalone axis, use the entire space
  else if (isStandalone) {
    if (isHoriz)
      preferredHeight = availSpace.h - gap;
    else
      preferredWidth = availSpace.w - gap;
  }

  // size is explicitly specified

  else if (axisSize != null) {
    if (isHoriz)
      preferredHeight = DvtChartStyleUtils.getSizeInPixels(axisSize, totalAvailSpace.h) - gap;
    else
      preferredWidth = DvtChartStyleUtils.getSizeInPixels(axisSize, totalAvailSpace.w) - gap;
  }

  // during animation, reuse the previous axis size
  else if (chart.getOptions()['_duringAnimation']) {
    if (isHoriz) {
      // The axis overflow amount has to be maintained to prevent jumpy animation
      var isR2L = dvt.Agent.isRightToLeft(chart.getCtx());
      axisOptions['_startOverflow'] = isR2L ? oldAxis.getRightOverflow() : oldAxis.getLeftOverflow();
      axisOptions['_endOverflow'] = isR2L ? oldAxis.getLeftOverflow() : oldAxis.getRightOverflow();

      preferredHeight = oldAxis.getHeight();
    }
    else
      preferredWidth = oldAxis.getWidth();
  }

  else {
    // last option: use axis.getPreferredSize based on the maxSize
    if (isHoriz)
      return axis.getPreferredSize(axisOptions, availSpace.w, DvtChartStyleUtils.getSizeInPixels(maxSize, totalAvailSpace.h) - gap);
    else
      return axis.getPreferredSize(axisOptions, DvtChartStyleUtils.getSizeInPixels(maxSize, totalAvailSpace.w) - gap, availSpace.h);
  }

  //  Calling getPreferredSize to ensure that axis info is populated.
  if (DvtChartAxisUtils.isYAdjustmentNeeded(chart))
    axis.getPreferredSize(axisOptions, preferredWidth, preferredHeight);

  return new dvt.Dimension(preferredWidth, preferredHeight);

};


/**
 * Apply gaps to availSpace to accommodate the vertical axis labels.
 * @param {dvt.Chart} chart
 * @param {dvt.Rectangle} availSpace
 * @private
 */
DvtChartAxisRenderer._addAxisGaps = function(chart, availSpace) {
  var isHoriz = DvtChartTypeUtils.isHorizontal(chart);
  var yPosition = DvtChartAxisUtils.getYAxisPosition(chart);
  var y2Position = DvtChartAxisUtils.getY2AxisPosition(chart);
  var isXRendered = DvtChartAxisUtils.isAxisRendered(chart, 'x');
  var isYRendered = DvtChartAxisUtils.isAxisRendered(chart, 'y');
  var isY2Rendered = DvtChartAxisUtils.isAxisRendered(chart, 'y2');

  var axisGap = chart.getOptions()['layout']['verticalAxisGap'];
  if (isHoriz)
    axisGap *= DvtChartAxisUtils.getGapScalingFactor(chart, 'x');
  else
    axisGap *= Math.max(DvtChartAxisUtils.getGapScalingFactor(chart, 'y'), DvtChartAxisUtils.getGapScalingFactor(chart, 'y2'));
  axisGap = Math.ceil(axisGap); // prevent rounding errors

  // top gap if necessary
  if ((isHoriz && !(yPosition == 'top' && isYRendered) && !(y2Position == 'top' && isY2Rendered)) || !isHoriz) {
    availSpace.y += axisGap;
    availSpace.h -= axisGap;
  }

  // bottom gap if necessary
  if ((isHoriz && !(yPosition == 'bottom' && isYRendered) && !(y2Position == 'bottom' && isY2Rendered)) || (!isHoriz && !isXRendered))
    availSpace.h -= axisGap;
};


/**
 * Positions the axis.
 * @param {dvt.Rectangle} availSpace
 * @param {object} axisInfo
 * @param {number} gap The tick label gap size.
 * @private
 */
DvtChartAxisRenderer._positionAxis = function(availSpace, axisInfo, gap) {
  if (!axisInfo)
    return;

  dvt.LayoutUtils.position(availSpace, axisInfo.options['position'], axisInfo.axis, axisInfo.dim.w, axisInfo.dim.h, gap);
};


/**
 * Aligns Y1 and Y2 axes gridlines if needed.
 * @param {object} yInfo
 * @param {object} y2Info
 * @private
 */
DvtChartAxisRenderer._alignYAxes = function(yInfo, y2Info) {
  var yAxisInfo = yInfo.axis.getInfo();
  if (!yAxisInfo)
    return; // alignYAxes doesn't work if the y info hasn't been created (either in getPreferredSize or render)

  var majorTickCount = yAxisInfo.getMajorTickCount();
  var minorTickCount = yAxisInfo.getMinorTickCount();

  // Save tick counts in options for use when data axis info is re-created after layout
  var y2Options = y2Info.options;
  y2Options['_majorTickCount'] = majorTickCount;
  y2Options['_minorTickCount'] = minorTickCount;
};


/**
 * Returns the available space for the subchart of a split dual-Y chart
 * @param {dvt.Rectangle} availSpace The available space.
 * @param {number} splitRatio The percentage of the available height/width the subchart will use.
 * @param {boolean} isHoriz Whether or not the chart is horizontal.
 * @param {boolean} isEnd Whether this subchart is the right or the bottom half.
 * @return {dvt.Rectangle} The available space for the subchart
 * @private
 */
DvtChartAxisRenderer._getSplitAvailSpace = function(availSpace, splitRatio, isHoriz, isEnd) {
  var splitSpace = availSpace.clone();
  if (isHoriz) {
    splitSpace.w = availSpace.w * splitRatio;
    splitSpace.x = isEnd ? availSpace.w * (1 - splitRatio) : 0;
  }
  else {
    splitSpace.h = availSpace.h * splitRatio;
    splitSpace.y = isEnd ? availSpace.h * (1 - splitRatio) : 0;
  }

  return splitSpace;
};


/**
 * Reduce the availSpace based on the overflow of the horizontal axis. Shifts the vertical axes based on the reduced
 * plot area size.
 * @param {dvt.Rectangle} availSpace
 * @param {object} xInfo
 * @param {object} yInfo
 * @param {object} y2Info
 * @private
 */
DvtChartAxisRenderer._setOverflow = function(availSpace, xInfo, yInfo, y2Info) {
  if (!xInfo)
    return;

  // Adjust the y-axis position and plot area width depending on x-axis overflow
  var leftOverflow = xInfo.axis.getLeftOverflow();
  var rightOverflow = xInfo.axis.getRightOverflow();
  availSpace.x += leftOverflow;
  availSpace.w -= leftOverflow + rightOverflow;

  if (yInfo)
    yInfo.axis.setTranslateX(yInfo.axis.getTranslateX() + (yInfo.options['position'] == 'left' ? leftOverflow : -rightOverflow));
  if (y2Info)
    y2Info.axis.setTranslateX(y2Info.axis.getTranslateX() + (y2Info.options['position'] == 'left' ? leftOverflow : -rightOverflow));
};


/**
 * Destroys old axes and stores new axes to the chart.
 * @param {dvt.Chart} chart
 * @param {object} xInfo
 * @param {object} yInfo
 * @param {object} y2Info
 * @private
 */
DvtChartAxisRenderer._storeAxes = function(chart, xInfo, yInfo, y2Info) {
  // Destroy the axis and remove event listeners to fix memory leak issue
  if (chart.xAxis) {
    chart.xAxis.destroy();
    chart.removeChild(chart.xAxis);
  }
  if (chart.yAxis) {
    chart.yAxis.destroy();
    chart.removeChild(chart.yAxis);
  }
  if (chart.y2Axis) {
    chart.y2Axis.destroy();
    chart.removeChild(chart.y2Axis);
  }

  // Store the axis objects on the chart
  chart.xAxis = xInfo.axis;
  chart.yAxis = yInfo ? yInfo.axis : null;
  chart.y2Axis = y2Info ? y2Info.axis : null;
};
/**
 * Performs layout and positioning for the chart legend.
 * @class
 */
var DvtChartLegendRenderer = new Object();

dvt.Obj.createSubclass(DvtChartLegendRenderer, dvt.Obj);


/** @private */
DvtChartLegendRenderer._DEFAULT_LINE_WIDTH_WITH_MARKER = 2;

/**
 * Renders legend and updates the available space.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space.
 */
DvtChartLegendRenderer.render = function(chart, container, availSpace) {
  var options = chart.getOptions();
  var position = options['legend']['position'];

  // Done if not rendering
  if (options['legend']['rendered'] == 'off' || (options['legend']['rendered'] == 'auto' && chart.getOptionsCache()['hasLargeSeriesCount']))
    return;

  // Create the options object for the legend
  var legendOptions = dvt.JsonUtils.clone(options['legend']);
  delete legendOptions['position'];
  legendOptions['skin'] = options['skin'];
  legendOptions['hideAndShowBehavior'] = DvtChartEventUtils.getHideAndShowBehavior(chart);
  legendOptions['hoverBehavior'] = DvtChartEventUtils.getHoverBehavior(chart);
  legendOptions['hoverBehaviorDelay'] = DvtChartStyleUtils.getHoverBehaviorDelay(chart);
  legendOptions['hiddenCategories'] = DvtChartStyleUtils.getHiddenCategories(chart);
  legendOptions['highlightedCategories'] = DvtChartStyleUtils.getHighlightedCategories(chart);

  // Evaluate the automatic position
  // Position the legend to occupy the larger dimension so that the plot area is more square
  if (position == 'auto') {
    if (availSpace.w >= availSpace.h)
      position = 'end';
    else
      position = 'bottom';
  }

  // Add legend orientation
  var isHoriz = (position == 'top' || position == 'bottom');
  legendOptions['orientation'] = isHoriz ? 'horizontal' : 'vertical';

  // Set legend alignment
  if (position == 'start')
    legendOptions['halign'] = 'end';
  if (position == 'start' || position == 'end')
    legendOptions['valign'] = 'middle';
  if (position == 'top')
    legendOptions['valign'] = 'bottom';
  if (position == 'top' || position == 'bottom')
    legendOptions['halign'] = 'center';

  // Add data for the legend
  DvtChartLegendRenderer._addLegendData(chart, legendOptions);

  // If no legend sections were added, then nothing should be rendered
  if (legendOptions['sections'].length == 0)
    return;

  // Create and add the legend to the display list for calc and rendering
  var legend = dvt.Legend.newInstance(chart.getCtx(), chart.processEvent, chart);
  if (chart.getId() != null) {
    //create and set legend id based on parent id
    legend.setId(chart.getId() + 'legend');
  }
  container.addChild(legend);

  var actualSize;
  if (legendOptions['size'] != null) { // exact size is specified
    if (isHoriz)
      actualSize = new dvt.Dimension(availSpace.w, DvtChartStyleUtils.getSizeInPixels(legendOptions['size'], availSpace.h));
    else
      actualSize = new dvt.Dimension(DvtChartStyleUtils.getSizeInPixels(legendOptions['size'], availSpace.w), availSpace.h);
  }
  else { // use preferred size
    var maxWidth = isHoriz ? availSpace.w : DvtChartStyleUtils.getSizeInPixels(legendOptions['maxSize'], availSpace.w);
    var maxHeight = isHoriz ? DvtChartStyleUtils.getSizeInPixels(legendOptions['maxSize'], availSpace.h) : availSpace.h;
    actualSize = legend.getPreferredSize(legendOptions, maxWidth, maxHeight);
  }

  legend.render(legendOptions, actualSize.w, actualSize.h);
  var gap = isHoriz ? DvtChartDefaults.getGapHeight(chart, options['layout']['legendGapHeight']) : DvtChartDefaults.getGapWidth(chart, options['layout']['legendGapWidth']);
  dvt.LayoutUtils.position(availSpace, position, legend, actualSize.w, actualSize.h, gap);

  // Update the x & y coordinates of the legend after it's been positioned
  var bounds = legend.__getBounds();
  var shiftedPos = legend.localToStage(new dvt.Point(bounds.x, bounds.y));
  bounds.x = shiftedPos.x;
  bounds.y = shiftedPos.y;

  // Update min/max coords for axis label overflow
  if (!DvtChartTypeUtils.isOverview(chart)) {
    var isRTL = dvt.Agent.isRightToLeft(chart.getCtx());
    if (position == 'end') {
      if (isRTL)
        options['_minOverflowCoord'] = shiftedPos.x + bounds.w + (gap / 2);
      else
        options['_maxOverflowCoord'] = shiftedPos.x - (gap / 2);
    }
    else if (position == 'start') {
      if (isRTL)
        options['_maxOverflowCoord'] = shiftedPos.x - (gap / 2);
      else
        options['_minOverflowCoord'] = shiftedPos.x + bounds.w + (gap / 2);
    }
  }
  // Destroy the legend and remove event listeners to fix memory leak issue
  if (chart.legend) {
    chart.legend.destroy();
    container.removeChild(chart.legend);
  }

  // Cache the legend for interactivity
  chart.legend = legend;
};


/**
 * Adds data into the options object for the legend.
 * @param {dvt.Chart} chart The chart whose data will be passed to the legend.
 * @param {object} legendOptions The legend options object into which data will be added.
 * @private
 */
DvtChartLegendRenderer._addLegendData = function(chart, legendOptions) {
  // Series
  var seriesItems = DvtChartLegendRenderer._getSeriesItems(chart, legendOptions['orientation'] == 'vertical');
  if (seriesItems.length > 0) {
    var seriesSection = legendOptions['seriesSection'];
    seriesSection['items'] = seriesItems;
    legendOptions['sections'].unshift(seriesSection); // add Series as the first section
  }

  // Explicitly defined sections will be rendered between Series and Reference Objects

  // Reference Objects
  var refObjItems = DvtChartLegendRenderer._getRefObjItems(chart);
  if (refObjItems.length > 0) {
    var refObjSection = legendOptions['referenceObjectSection'];
    refObjSection['items'] = refObjItems;
    if (legendOptions['referenceObjectTitle']) // maintain this attr for backwards compat
      refObjSection['title'] = legendOptions['referenceObjectTitle'];
    legendOptions['sections'].push(refObjSection); // add Reference Objects as the last section
  }
};


/**
 * Returns the array of series items to pass to the legend.
 * @param {dvt.Chart} chart The chart whose data will be passed to the legend.
 * @param {Boolean} isVertical Whether the legend is vertical.
 * @return {Array} The series items.
 * @private
 */
DvtChartLegendRenderer._getSeriesItems = function(chart, isVertical) {
  var ret = [];
  var legendItem;
  var seriesIndex;

  if (chart.getType() == 'pie') {
    var seriesIndices = DvtChartPieUtils.getRenderedSeriesIndices(chart);
    // Add the series in the same order as the pie
    for (var i = 0; i < seriesIndices.length; i++) {
      seriesIndex = seriesIndices[i];
      legendItem = DvtChartLegendRenderer._createLegendItem(chart, seriesIndex);
      if (legendItem)
        ret.push(legendItem);
    }
    if (DvtChartPieUtils.hasOtherSeries(chart)) {
      // Create legend item for "other" slice
      legendItem = {'id': DvtChartPieUtils.OTHER_SLICE_SERIES_ID,
        'text': dvt.Bundle.getTranslation(chart.getOptions(), 'labelOther', dvt.Bundle.CHART_PREFIX, 'LABEL_OTHER'),
        'categoryVisibility': dvt.ArrayUtils.getIndex(DvtChartStyleUtils.getHiddenCategories(chart), DvtChartPieUtils.OTHER_SLICE_SERIES_ID) >= 0 ? 'hidden' : 'visible',
        'symbolType': 'marker',
        'color': chart.getOptions()['styleDefaults']['otherColor'],
        'borderColor': chart.getOptions()['styleDefaults']['borderColor']};
      ret.push(legendItem);
    }
  }
  else {
    var yCategoryMap = {};
    var y2CategoryMap = {};

    // Loop through series to create legendItem, and map each category to a legendItem array
    var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
    for (seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
      legendItem = DvtChartLegendRenderer._createLegendItem(chart, seriesIndex);
      if (legendItem) {
        var category = DvtChartDataUtils.getStackCategory(chart, seriesIndex);
        if (!DvtChartDataUtils.isAssignedToY2(chart, seriesIndex)) {
          if (yCategoryMap[category])
            yCategoryMap[category].push(legendItem);
          else
            yCategoryMap[category] = [legendItem];
        }
        else {
          if (y2CategoryMap[category])
            y2CategoryMap[category].push(legendItem);
          else
            y2CategoryMap[category] = [legendItem];
        }
      }
    }

    var categoryKeys = DvtChartDataUtils.getStackCategories(chart, null, true); // used for looping through categories in order to add legendItems
    var bReversed = DvtChartTypeUtils.isStacked(chart) && DvtChartTypeUtils.isVertical(chart) && isVertical;
    // yAxis items
    ret = DvtChartLegendRenderer._getSeriesItemsForAxis(yCategoryMap, categoryKeys['y'], bReversed, ret);
    // y2Axis items
    ret = DvtChartLegendRenderer._getSeriesItemsForAxis(y2CategoryMap, categoryKeys['y2'], bReversed, ret);
  }

  return ret;
};

/**
 * Returns the array of series items to pass to the legend for the given axis.
 * @param {Object} categoryMap The map of stack categories and their corresponding array of legendItems
 * @param {Object} categoryKeys The in-order lists of yAxis and y2Axis stack categories
 * @param {Boolean} bReversed Whether or not to reverse legendItems when adding to array
 * @param {Array} ret The array to add legendItems to
 * @return {Array} The series items.
 * @private
 */
DvtChartLegendRenderer._getSeriesItemsForAxis = function(categoryMap, categoryKeys, bReversed, ret) {
  var legendItemArray;
  for (var categoryIndex = 0; categoryIndex < categoryKeys.length; categoryIndex++) {
    legendItemArray = categoryMap[categoryKeys[categoryIndex]];
    if (legendItemArray) { // legendItemArray will be null if the only series item for a category has displayInLegend = 'off'
      if (bReversed)
        ret = ret.concat(legendItemArray.reverse());
      else
        ret = ret.concat(legendItemArray);
    }
  }
  return ret;
};

/**
 * Creates a legend item for a series
 * @param {dvt.Chart} chart The chart whose data will be passed to the legend
 * @param {Number} seriesIndex The series index
 * @return {Object} The legend item
 * @private
 */
DvtChartLegendRenderer._createLegendItem = function(chart, seriesIndex) {
  var seriesItem = DvtChartDataUtils.getSeriesItem(chart, seriesIndex);
  var chartType = chart.getType();
  var seriesType = DvtChartStyleUtils.getSeriesType(chart, seriesIndex);
  var lineType = DvtChartStyleUtils.getLineType(chart, seriesIndex);
  var displayInLegend = seriesItem['displayInLegend'];

  // Skip if the series item isn't defined or if not displayInLegend
  if (!seriesItem || displayInLegend == 'off')
    return null;

  // Skip if displayInLegend is auto and chart type is funnel or stock
  if (displayInLegend != 'on' && (DvtChartTypeUtils.isFunnel(chart) || DvtChartTypeUtils.isStock(chart)))
    return null;

  // Skip if displayInLegend is auto and series has no non-null data
  if (displayInLegend != 'on' && !DvtChartDataUtils.hasSeriesData(chart, seriesIndex))
    return null;

  // Skip if displayInLegend is auto and series label is an empty string
  var seriesLabel = DvtChartDataUtils.getSeriesLabel(chart, seriesIndex);
  if (displayInLegend != 'on' && (!seriesLabel || dvt.StringUtils.trim(seriesLabel).length <= 0))
    return null;

  // Create the legend item and add the properties for this series
  var legendItem = {'id': DvtChartDataUtils.getSeries(chart, seriesIndex),
    'text': seriesLabel,
    'categories': DvtChartDataUtils.getSeriesCategories(chart, seriesIndex),
    'categoryVisibility': DvtChartStyleUtils.isSeriesRendered(chart, seriesIndex) ? 'visible' : 'hidden'};

  // Shape varies by chart type
  if (seriesType == 'line' || seriesType == 'lineWithArea' || chartType == 'scatter' || chartType == 'bubble') {
    legendItem['lineStyle'] = DvtChartStyleUtils.getLineStyle(chart, seriesIndex);
    legendItem['lineWidth'] = DvtChartStyleUtils.getLineWidth(chart, seriesIndex);

    if (DvtChartStyleUtils.isMarkerDisplayed(chart, seriesIndex)) {
      var source = DvtChartStyleUtils.getImageSource(chart, seriesIndex, null, 'source');
      if (source) {
        legendItem['symbolType'] = 'image';
        legendItem['source'] = source;
      }
      else {
        legendItem['symbolType'] = lineType == 'none' ? 'marker' : 'lineWithMarker';
        if (legendItem['symbolType'] == 'lineWithMarker')
          legendItem['lineWidth'] = Math.min(DvtChartLegendRenderer._DEFAULT_LINE_WIDTH_WITH_MARKER, legendItem['lineWidth']);
        legendItem['markerShape'] = DvtChartStyleUtils.getMarkerShape(chart, seriesIndex);
        legendItem['markerColor'] = DvtChartStyleUtils.getMarkerColor(chart, seriesIndex);
      }
    }
    else
      legendItem['symbolType'] = 'line';
  }
  else {
    legendItem['symbolType'] = 'marker';
    if (DvtChartStyleUtils.getLineType(chart, seriesIndex) == 'none')
      legendItem['markerShape'] = DvtChartStyleUtils.getMarkerShape(chart, seriesIndex);
  }

  // Also add the color and pattern
  legendItem['color'] = DvtChartStyleUtils.getColor(chart, seriesIndex);
  legendItem['borderColor'] = DvtChartStyleUtils.getBorderColor(chart, seriesIndex);
  legendItem['pattern'] = DvtChartStyleUtils.getPattern(chart, seriesIndex);

  // Action, popup, drill, and tooltip support
  legendItem['action'] = seriesItem['action'];
  legendItem['_spb'] = chart.getShowPopupBehaviors(seriesItem['_id']);
  legendItem['drilling'] = DvtChartEventUtils.isSeriesDrillable(chart, seriesIndex) ? 'on' : 'off';
  legendItem['shortDesc'] = seriesItem['shortDesc'];

  return legendItem;
};


/**
 * Returns the array of reference object items to pass to the legend.
 * @param {dvt.Chart} chart The chart whose data will be passed to the legend.
 * @return {array} The reference object items.
 * @private
 */
DvtChartLegendRenderer._getRefObjItems = function(chart) {
  var refObjs = DvtChartRefObjUtils.getRefObjs(chart);
  if (refObjs.length <= 0)
    return [];

  var items = [];
  for (var i = 0; i < refObjs.length; i++) {
    var refObj = refObjs[i];

    // Reference Object must be defined with color and text to appear in legend
    if (!refObj || refObj['displayInLegend'] != 'on' || !refObj['text'])
      continue;

    var type = DvtChartRefObjUtils.getType(refObj);
    items.push({
      'symbolType': (type == 'area') ? 'square' : 'line',
      'text': refObj['text'],
      'color': DvtChartRefObjUtils.getColor(refObj),
      'lineStyle': refObj['lineStyle'],
      'lineWidth': DvtChartRefObjUtils.getLineWidth(refObj),
      'categories': DvtChartRefObjUtils.getRefObjCategories(refObj),
      'categoryVisibility': DvtChartRefObjUtils.isObjectRendered(chart, refObj) ? 'visible' : 'hidden',
      'shortDesc': refObj['shortDesc']
    });
  }

  return items;
};
/**
 * Renderer for the plot area of a dvt.Chart.
 * @class
 */
var DvtChartPlotAreaRenderer = new Object();

dvt.Obj.createSubclass(DvtChartPlotAreaRenderer, dvt.Obj);

/** @private @const */
DvtChartPlotAreaRenderer._MIN_TOUCH_MARKER_SIZE = 16; // minimum marker size for touch devices

/** @private @const */
DvtChartPlotAreaRenderer._MARKER_DATA_LABEL_GAP = 4; // space separating the data label from the marker

/** @private @const */
DvtChartPlotAreaRenderer._MIN_CHARS_DATA_LABEL = 3; // minimum number of chars to be displayed of a data label when truncating

/**
 * The minimum number of data points after which data filtering will be enabled for scatter and bubble charts.
 * @const
 * @private
 */
DvtChartPlotAreaRenderer._FILTER_THRESHOLD_SCATTER_BUBBLE = 10000;

/**
 * Renders the plot area into the available space.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} availSpace The available space.
 */
DvtChartPlotAreaRenderer.render = function(chart, container, availSpace) {
  if (chart.getOptions()['plotArea']['rendered'] == 'off') {
    DvtChartPlotAreaRenderer._renderAxisLines(chart, container, availSpace);
  }
  else if (availSpace.w > 0 && availSpace.h > 0) {
    // TODO: change to formal location for displayed data
    chart._currentMarkers = new Array();
    chart._currentAreas = new Array();

    DvtChartPlotAreaRenderer._renderBackgroundObjects(chart, container, availSpace);
    DvtChartPlotAreaRenderer._renderTicks(chart, container, availSpace);
    DvtChartPlotAreaRenderer._renderForegroundObjects(chart, container, availSpace);
  }
};


/**
 * Renders objects in the background of the plot area.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartPlotAreaRenderer._renderBackgroundObjects = function(chart, container, availSpace) {
  // Chart background
  var options = chart.getOptions();
  var background = DvtChartPlotAreaRenderer._getBackgroundShape(chart, availSpace);

  var backgroundColor = DvtChartStyleUtils.getBackgroundColor(chart);
  if (backgroundColor)
    background.setSolidFill(backgroundColor);
  else
    background.setInvisibleFill(); // Always render a background plot area rectangle and save for interactivity

  container.addChild(background);

  // Reference Objects
  if (options['xAxis']['referenceObjects'] || options['yAxis']['referenceObjects'] || options['y2Axis']['referenceObjects']) {
    var clipGroup = DvtChartPlotAreaRenderer.createClippedGroup(chart, container, availSpace);
    DvtChartRefObjRenderer.renderBackgroundObjects(chart, clipGroup, availSpace);
  }

  // Draw area series behind the gridlines (because they would obscure the grids)
  if (DvtChartTypeUtils.isBLAC(chart)) {
    // Create area container for all BLAC types to allow delete animation from a chart with area to a chart without area
    var areaContainer = new dvt.Container(chart.getCtx());
    container.addChild(areaContainer);
    chart.__setAreaContainer(areaContainer);

    if (DvtChartTypeUtils.hasAreaSeries(chart))
      DvtChartPlotAreaRenderer._renderAreas(chart, areaContainer, availSpace, false);
  }
};

/**
 * Helper function to create the background shape.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Rectangle} availSpace The available space.
 * @return {dvt.Shape} The background shape
 * @private
 */
DvtChartPlotAreaRenderer._getBackgroundShape = function(chart, availSpace) {
  var background;
  var context = chart.getCtx();
  if (DvtChartTypeUtils.isPolar(chart)) {
    var cx = availSpace.x + availSpace.w / 2;
    var cy = availSpace.y + availSpace.h / 2;
    if (DvtChartAxisUtils.isGridPolygonal(chart)) {
      var points = dvt.PolygonUtils.getRegularPolygonPoints(cx, cy, DvtChartDataUtils.getGroupCount(chart), chart.getRadius(), 0);
      background = new dvt.Polygon(context, points);
    }
    else
      background = new dvt.Circle(context, cx, cy, chart.getRadius());
  }
  else
    background = new dvt.Rect(context, availSpace.x, availSpace.y, availSpace.w, availSpace.h);
  return background;
};

/**
 * Renders the major and minor ticks for the chart.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartPlotAreaRenderer._renderTicks = function(chart, container, availSpace) {
  // Minor Ticks
  if (chart.xAxis && DvtChartAxisUtils.isMinorTickRendered(chart, 'x'))
    DvtChartPlotAreaRenderer._renderMinorTicks(chart, container, chart.xAxis, availSpace);

  if (chart.yAxis && DvtChartAxisUtils.isMinorTickRendered(chart, 'y'))
    DvtChartPlotAreaRenderer._renderMinorTicks(chart, container, chart.yAxis, availSpace);

  if (chart.y2Axis && DvtChartAxisUtils.isMinorTickRendered(chart, 'y2'))
    DvtChartPlotAreaRenderer._renderMinorTicks(chart, container, chart.y2Axis, availSpace);

  // Major Ticks
  if (chart.xAxis && DvtChartAxisUtils.isMajorTickRendered(chart, 'x'))
    DvtChartPlotAreaRenderer._renderMajorTicks(chart, container, chart.xAxis, availSpace);

  if (chart.yAxis && DvtChartAxisUtils.isMajorTickRendered(chart, 'y'))
    DvtChartPlotAreaRenderer._renderMajorTicks(chart, container, chart.yAxis, availSpace);

  if (chart.y2Axis && DvtChartAxisUtils.isMajorTickRendered(chart, 'y2'))
    DvtChartPlotAreaRenderer._renderMajorTicks(chart, container, chart.y2Axis, availSpace);
};

/**
 * Renders the axis lines for the chart.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartPlotAreaRenderer._renderAxisLines = function(chart, container, availSpace) {
  if (chart.xAxis && chart.yAxis && DvtChartAxisUtils.isAxisLineRendered(chart, 'x'))
    DvtChartPlotAreaRenderer._renderAxisLine(chart, container, chart.xAxis, chart.yAxis, availSpace);

  // Render x-axis line based on y2 if there's no y1 or if split dual-Y
  if (chart.xAxis && chart.y2Axis && DvtChartAxisUtils.isAxisLineRendered(chart, 'x')) {
    if (!chart.yAxis || DvtChartTypeUtils.isSplitDualY(chart))
      DvtChartPlotAreaRenderer._renderAxisLine(chart, container, chart.xAxis, chart.y2Axis, availSpace);
  }

  if (chart.yAxis && chart.xAxis && DvtChartAxisUtils.isAxisLineRendered(chart, 'y'))
    DvtChartPlotAreaRenderer._renderAxisLine(chart, container, chart.yAxis, chart.xAxis, availSpace);

  if (chart.y2Axis && chart.xAxis && DvtChartAxisUtils.isAxisLineRendered(chart, 'y2'))
    DvtChartPlotAreaRenderer._renderAxisLine(chart, container, chart.y2Axis, chart.xAxis, availSpace);

};

/**
 * Renders the major ticks for the axis.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {DvtChartAxis} axis The axis owning the major ticks.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartPlotAreaRenderer._renderMajorTicks = function(chart, container, axis, availSpace) {
  DvtChartPlotAreaRenderer._renderGridlines(chart, container, axis.getOptions()['majorTick'], axis.getPosition(),
      axis.getMajorTickCoords(), axis.getBaselineCoord(), availSpace);
};

/**
 * Renders the minor ticks for the axis.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {DvtChartAxis} axis The axis owning the minor ticks.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartPlotAreaRenderer._renderMinorTicks = function(chart, container, axis, availSpace) {
  DvtChartPlotAreaRenderer._renderGridlines(chart, container, axis.getOptions()['minorTick'], axis.getPosition(),
      axis.getMinorTickCoords(), null, availSpace);
};

/**
 * Renders the axis line for the axis.
 * Axis lines are drawn by the opposite axis. For example, x-axis line is drawn based on the y-axis coord (and will be
 * parallel to the y-axis gridlines), and vice versa.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {DvtChartAxis} oAxis The axis owning the axis line.
 * @param {DvtChartAxis} dAxis The axis drawing the axis line (i.e. the axis orthogonal to oAxis).
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartPlotAreaRenderer._renderAxisLine = function(chart, container, oAxis, dAxis, availSpace) {
  var options = oAxis.getOptions();
  var position = options['position'];
  var coord = (position == 'bottom' || position == 'right' || position == 'tangential') ? dAxis.getMaxCoord() : dAxis.getMinCoord();
  DvtChartPlotAreaRenderer._renderGridlines(chart, container, options['axisLine'], dAxis.getPosition(), [coord], null, availSpace);
};

/**
 * Renders the specified set of gridlines (ticks or axis lines).
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {Object} options The options object of the gridline.
 * @param {String} position The axis position.
 * @param {Array} coords The array gridline coords.
 * @param {Number} baselineCoord The baseline coord (to use baseline style).
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartPlotAreaRenderer._renderGridlines = function(chart, container, options, position, coords, baselineCoord, availSpace) {
  // Construct the default line stroke
  var lineColor = options['lineColor'];
  var lineStroke = new dvt.SolidStroke(lineColor, 1, options['lineWidth']);
  if (options['lineStyle'])
    lineStroke.setStyle(dvt.Stroke.convertTypeString(options['lineStyle']));

  // Construct the baseline stroke
  var baselineStroke = lineStroke.clone();
  if (options['baselineColor'] != 'inherit') {
    var baselineColor;
    if (options['baselineColor'] == 'auto')
      baselineColor = dvt.ColorUtils.getDarker(lineColor, 0.4); // derive the baselineColor from lineColor
    else
      baselineColor = options['baselineColor'];
    baselineStroke.setColor(baselineColor);
  }
  baselineStroke.setWidth(options['baselineWidth'] != null ? options['baselineWidth'] : options['lineWidth']);
  baselineStroke.setStyle(dvt.Stroke.convertTypeString(options['baselineStyle'] ? options['baselineStyle'] : options['lineStyle']));

  // Render each gridline
  for (var i = 0; i < coords.length; i++) {
    var stroke = (baselineCoord != null && coords[i] == baselineCoord) ? baselineStroke : lineStroke;
    DvtChartPlotAreaRenderer._renderGridline(chart, container, position, coords[i], stroke, availSpace);
  }
};

/**
 * Renders the specified gridline (tick or axis line).
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {String} position The axis position.
 * @param {Number} coord The gridline coord.
 * @param {dvt.Stroke} stroke The gridline stroke.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartPlotAreaRenderer._renderGridline = function(chart, container, position, coord, stroke, availSpace) {
  var line;
  var context = container.getCtx();
  var usePixelHinting = !dvt.Agent.isTouchDevice() || dvt.Agent.getDevicePixelRatio() > 1;

  if (position == 'radial') {
    if (DvtChartAxisUtils.isGridPolygonal(chart)) {
      var points = dvt.PolygonUtils.getRegularPolygonPoints(0, 0, DvtChartDataUtils.getGroupCount(chart), coord, 0);
      line = new dvt.Polygon(context, points);
    }
    else
      line = new dvt.Circle(context, 0, 0, coord);
    line.setInvisibleFill();
    line.setTranslate(availSpace.x + availSpace.w / 2, availSpace.y + availSpace.h / 2);
  }
  else if (position == 'tangential') {
    line = new dvt.Line(context, 0, 0, chart.getRadius() * Math.sin(coord), -chart.getRadius() * Math.cos(coord));
    if (coord % Math.PI / 2 < 0.01 && usePixelHinting) // use pixel hinting at 0, 90, 180, and 270 degrees
      line.setPixelHinting(true);

    line.setTranslate(availSpace.x + availSpace.w / 2, availSpace.y + availSpace.h / 2);
  }
  else {
    if (position == 'top' || position == 'bottom')
      line = new dvt.Line(context, coord, availSpace.y, coord, availSpace.y + availSpace.h);
    else
      line = new dvt.Line(context, availSpace.x, coord, availSpace.x + availSpace.w, coord);
    if (usePixelHinting)
      line.setPixelHinting(true);
  }
  line.setStroke(stroke);
  line.setMouseEnabled(false);
  container.addChild(line);
};


/**
 * Renders objects in the foreground of the plot area.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartPlotAreaRenderer._renderForegroundObjects = function(chart, container, availSpace) {
  // : Axis lines are generally rendered in the back of the foreground, but we render them after the
  // bars if only bar series are present.  We can't apply this fix with lines/areas, since the markers must appear over
  // the axis lines.
  var options = chart.getOptions();
  var bBLAC = DvtChartTypeUtils.isBLAC(chart);
  var bBarSeries = DvtChartTypeUtils.hasBarSeries(chart);
  var bLineSeries = DvtChartTypeUtils.hasLineSeries(chart);
  var bStockSeries = DvtChartTypeUtils.hasCandlestickSeries(chart);
  var bLineWithAreaSeries = DvtChartTypeUtils.hasLineWithAreaSeries(chart);

  // Get container for clipping
  var clipGroup = DvtChartPlotAreaRenderer.createClippedGroup(chart, container, availSpace);

  // Render axis lines after the clipGroup
  DvtChartPlotAreaRenderer._renderAxisLines(chart, container, availSpace);

  // plotArea border. We add it here to be above the clipGroup, but below the other foreground items
  var plotAreaBorderColor = options['plotArea']['borderColor'];
  var plotAreaBorderWidth = options['plotArea']['borderWidth'];
  if (plotAreaBorderColor && plotAreaBorderWidth != 0) {
    var plotAreaBorder = DvtChartPlotAreaRenderer._getBackgroundShape(chart, availSpace);
    plotAreaBorder.setInvisibleFill();
    plotAreaBorder.setSolidStroke(plotAreaBorderColor, null, plotAreaBorderWidth);
    plotAreaBorder.setMouseEnabled(false);
    container.addChild(plotAreaBorder);
  }

  // Data Objects for BLAC
  if (bBLAC) {
    // Areas were drawn in the background. Draw lineWithAreas, bars, and lines
    if (bLineWithAreaSeries)
      DvtChartPlotAreaRenderer._renderAreas(chart, container, availSpace, true);

    if (bBarSeries)
      DvtChartPlotAreaRenderer._renderBars(chart, clipGroup, availSpace);

    if (bLineSeries)
      DvtChartPlotAreaRenderer._renderLines(chart, container, clipGroup, availSpace);

    if (bStockSeries)
      DvtChartPlotAreaRenderer._renderStock(chart, clipGroup, availSpace);

  } else if (DvtChartTypeUtils.isScatterBubble(chart)) {
    DvtChartPlotAreaRenderer._renderScatterBubble(chart, container, clipGroup, true, availSpace);
  }

  // Reference Objects
  if (options['xAxis']['referenceObjects'] || options['yAxis']['referenceObjects'] || options['y2Axis']['referenceObjects']) {
    clipGroup = DvtChartPlotAreaRenderer.createClippedGroup(chart, container, availSpace);
    DvtChartRefObjRenderer.renderForegroundObjects(chart, clipGroup, availSpace);
  }

  // Initial Selection
  var selected = DvtChartDataUtils.getInitialSelection(chart);
  DvtChartEventUtils.setInitialSelection(chart, selected);

  // Initial Highlighting
  chart.highlight(DvtChartStyleUtils.getHighlightedCategories(chart));
};


/**
 * Renders a single data label associated with a data item.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} dataItemBounds The space occupied by the data item this is associated with.
 * @param {number} seriesIndex The series of this data label.
 * @param {number} groupIndex The group of this data label.
 * @param {Color} dataColor The color of the data item this label is associated with.
 * @param {number} type (optional) Data label type: low, high, or value.
 * @param {boolean} isStackLabel true if label for stack cummulative, false otherwise
 * @private
 */
DvtChartPlotAreaRenderer._renderDataLabel = function(chart, container, dataItemBounds, seriesIndex, groupIndex, dataColor, type, isStackLabel) {
  if (DvtChartTypeUtils.isOverview(chart)) // no data label in overview
    return;

  var labelString = DvtChartDataUtils.getDataLabel(chart, seriesIndex, groupIndex, type, isStackLabel);

  if (labelString == null)
    return;

  var position = DvtChartStyleUtils.getDataLabelPosition(chart, seriesIndex, groupIndex, type, isStackLabel);
  if (position == 'none')
    return;

  var label = new dvt.OutputText(chart.getCtx(), labelString, 0, 0);
  label.setMouseEnabled(false);

  var style = isStackLabel ? chart.getOptions()['styleDefaults']['stackLabelStyle'] : DvtChartStyleUtils.getDataLabelStyle(chart, seriesIndex, groupIndex, dataColor, position, type);
  label.setCSSStyle(style);

  label.setY(dataItemBounds.y + dataItemBounds.h / 2);
  label.setX(dataItemBounds.x + dataItemBounds.w / 2);
  label.alignCenter();
  label.alignMiddle();
  var textDim = label.measureDimensions();

  if (position == 'left') {
    label.setX(dataItemBounds.x - textDim.w / 2 - DvtChartPlotAreaRenderer._MARKER_DATA_LABEL_GAP);
  }
  else if (position == 'right') {
    label.setX(dataItemBounds.x + dataItemBounds.w + textDim.w / 2 + DvtChartPlotAreaRenderer._MARKER_DATA_LABEL_GAP);
  }
  else if (position == 'top') {
    label.setY(dataItemBounds.y - textDim.h / 2);
  }
  else if (position == 'bottom') {
    label.setY(dataItemBounds.y + dataItemBounds.h + textDim.h / 2 + DvtChartPlotAreaRenderer._MARKER_DATA_LABEL_GAP / 2);
  }
  else { // inside label
    if (DvtChartStyleUtils.getSeriesType(chart, seriesIndex) == 'bar') {
      if (textDim.w > dataItemBounds.w || textDim.h > dataItemBounds.h)
        return; //dropping text if doesn't fit.

      if (position == 'inLeft') {
        label.setX(dataItemBounds.x + textDim.w / 2.0 + DvtChartPlotAreaRenderer._MARKER_DATA_LABEL_GAP);
      }
      else if (position == 'inRight') {
        label.setX(dataItemBounds.x + dataItemBounds.w - textDim.w / 2.0 - DvtChartPlotAreaRenderer._MARKER_DATA_LABEL_GAP);
      }
      else if (position == 'inTop') {
        label.setY(dataItemBounds.y + textDim.h / 2.0 + DvtChartPlotAreaRenderer._MARKER_DATA_LABEL_GAP);
      }
      else if (position == 'inBottom') {
        label.setY(dataItemBounds.y + dataItemBounds.h - textDim.h / 2.0 - DvtChartPlotAreaRenderer._MARKER_DATA_LABEL_GAP / 2);
      }
    }
    else if (DvtChartTypeUtils.isBubble(chart)) {
      dataItemBounds.x += DvtChartPlotAreaRenderer._MARKER_DATA_LABEL_GAP;
      dataItemBounds.y += DvtChartPlotAreaRenderer._MARKER_DATA_LABEL_GAP;
      dataItemBounds.h -= DvtChartPlotAreaRenderer._MARKER_DATA_LABEL_GAP * 2;
      dataItemBounds.w -= DvtChartPlotAreaRenderer._MARKER_DATA_LABEL_GAP * 2;

      var size = label.getOptimalFontSize(dataItemBounds);
      label.setFontSize(size);
      if (!dvt.TextUtils.fitText(label, dataItemBounds.w, dataItemBounds.h, container, DvtChartPlotAreaRenderer._MIN_CHARS_DATA_LABEL))
        return; //dropping text if doesn't fit.
    }

    var isPatternBg = DvtChartStyleUtils.getPattern(chart, seriesIndex, groupIndex) != null;
    if (isPatternBg) {
      textDim = label.getDimensions();
      var padding = textDim.h * 0.15;
      var cmd = dvt.PathUtils.roundedRectangle(textDim.x - padding, textDim.y, textDim.w + 2 * padding, textDim.h, 2, 2, 2, 2);
      var bbox = new dvt.Path(chart.getCtx(), cmd);
      bbox.setSolidFill('#FFFFFF', 0.9);
      container.addChild(bbox);
    }
  }

  // Reset the stroke so that the container properties aren't inherited
  if (DvtChartStyleUtils.optimizeMarkerStroke(chart))
    label.setSolidStroke('none');

  container.addChild(label);
  chart.addDataLabel(label);
};


/**
 * Helper function. Calculates and passes the marker bounds to the data label rendering code.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.SimpleMarker} marker
 * @private
 */
DvtChartPlotAreaRenderer._renderDataLabelForMarker = function(chart, container, marker) {
  var logicalObject = chart.getEventManager().getLogicalObject(marker);
  var seriesIndex = logicalObject.getSeriesIndex();
  var groupIndex = logicalObject.getGroupIndex();

  if (marker instanceof dvt.SimpleMarker) {
    var markerBounds = new dvt.Rectangle(marker.getCx() - marker.getWidth() / 2, marker.getCy() - marker.getHeight() / 2, marker.getWidth(), marker.getHeight());
    DvtChartPlotAreaRenderer._renderDataLabel(chart, container, markerBounds, seriesIndex, groupIndex, marker.getDataColor());
  }
  else if (marker instanceof DvtChartRangeMarker) {
    DvtChartPlotAreaRenderer._renderDataLabel(chart, container, marker.getBoundingBox1(), seriesIndex, groupIndex, marker.getDataColor(), 'low');
    DvtChartPlotAreaRenderer._renderDataLabel(chart, container, marker.getBoundingBox2(), seriesIndex, groupIndex, marker.getDataColor(), 'high');
  }
};

/**
 * Renders the data markers for scatter and bubble chart.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Container} clipGroup The group for clipping the lines and bubbles.
 * @param {boolean} bSortBySize True if markers should be sorted by size to reduce overlaps.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartPlotAreaRenderer._renderScatterBubble = function(chart, container, clipGroup, bSortBySize, availSpace) {
  // Performance optimization for huge data sets.
  var markerInfos = DvtChartPlotAreaRenderer._filterScatterBubble(chart, bSortBySize, availSpace);

  // Loop through the series and draw line connectors.
  var seriesIndex;
  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  for (seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
    // Draw the line connector if the series has one
    if (DvtChartStyleUtils.getLineType(chart, seriesIndex) != 'none')
      DvtChartPlotAreaRenderer._renderLinesForSeries(chart, clipGroup, seriesIndex, availSpace);
  }

  // Calculate the default stroke to save DOM calls.
  var borderColor = DvtChartStyleUtils.getMarkerBorderColor(chart);
  var borderWidth = DvtChartStyleUtils.getBorderWidth(chart);
  var defaultStroke = new dvt.SolidStroke(borderColor, null, borderWidth);

  // Create the markers
  var markers = [];
  if (markerInfos) {
    // The stroke is optimized onto the parent container when possible.
    var bOptimizeStroke = DvtChartStyleUtils.optimizeMarkerStroke(chart);
    var defaultBorderColor = bOptimizeStroke ? defaultStroke.getColor() : null;
    var defaultBorderWidth = bOptimizeStroke ? defaultStroke.getWidth() : null;

    // Markers were filtered and markerInfo contains only the visible markers.
    for (var markerIndex = 0; markerIndex < markerInfos.length; markerIndex++) {
      var markerInfo = markerInfos[markerIndex];
      var marker = DvtChartPlotAreaRenderer._createMarker(chart, markerInfo, bOptimizeStroke, defaultBorderColor, defaultBorderWidth);
      markers.push(marker);
    }
  }
  else {
    for (seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
      var seriesMarkers = DvtChartPlotAreaRenderer._getMarkersForSeries(chart, seriesIndex, availSpace, defaultStroke);
      markers = markers.concat(seriesMarkers);
    }

    // Sort the markers from smallest to largest. Filtered markers were already sorted.
    if (bSortBySize)
      DvtChartMarkerUtils.sortMarkers(markers);
  }

  // Finally add the markers to their container.
  if (DvtChartTypeUtils.isBubble(chart))
    // For bubble, all the lines and markers are added to the clipGroups
    DvtChartPlotAreaRenderer._addMarkersToContainer(chart, clipGroup, markers, defaultStroke);
  else
    // For scatter, don't want to have the markers in the clipGroup so they don't get clipped
    DvtChartPlotAreaRenderer._addMarkersToContainer(chart, container, markers, defaultStroke);
};


/**
 * Renders the data markers for the specified line/area series.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {number} seriesIndex The series to render.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtChartPlotAreaRenderer._renderMarkersForSeries = function(chart, container, seriesIndex, availSpace) {
  // Calculate the default stroke to save DOM calls.
  var borderColor = DvtChartStyleUtils.getMarkerBorderColor(chart, seriesIndex);
  var borderWidth = DvtChartStyleUtils.getBorderWidth(chart, seriesIndex);
  var defaultStroke = new dvt.SolidStroke(borderColor, null, borderWidth);

  var markers;
  if (DvtChartStyleUtils.isRangeSeries(chart, seriesIndex))
    markers = DvtChartPlotAreaRenderer._getRangeMarkersForSeries(chart, seriesIndex, availSpace);
  else
    markers = DvtChartPlotAreaRenderer._getMarkersForSeries(chart, seriesIndex, availSpace, defaultStroke);

  DvtChartPlotAreaRenderer._addMarkersToContainer(chart, container, markers, defaultStroke);
};

/**
 * Adds the specified data markers to the container.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {array} markers The array of data markers.
 * @param {dvt.Stroke} defaultStroke The default stroke of the markers for optimization.
 * @private
 */
DvtChartPlotAreaRenderer._addMarkersToContainer = function(chart, container, markers, defaultStroke) {
  // Performance optimization for scatter and bubble: Create a container for the markers and data labels.
  var markerContainer = container;
  var bOptimize = DvtChartStyleUtils.optimizeMarkerStroke(chart);
  if (bOptimize) {
    markerContainer = new dvt.Container(chart.getCtx());
    markerContainer.setStroke(defaultStroke);
    container.addChild(markerContainer);
  }

  // Add the markers to the container
  for (var i = 0; i < markers.length; i++) {
    markerContainer.addChild(markers[i]);

    // Data Label Support
    DvtChartPlotAreaRenderer._renderDataLabelForMarker(chart, markerContainer, markers[i]);
  }

  // TODO: change to formal location for displayed data
  chart._currentMarkers.push(markers);
};

/**
 * Returns an object with rendering information for a single marker. Returns null
 * if the marker should be skipped. The returned object must remain consistent
 * with that returned by _getScatterBubbleMarkerInfo.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {dvt.Rectangle} availSpace The available space.
 * @return {object} An object with rendering information. Fields not documented as it is intended for use within this
 *                 class only.
 * @private
 */
DvtChartPlotAreaRenderer._getMarkerInfo = function(chart, seriesIndex, groupIndex, availSpace) {
  var options = chart.getOptions();

  // Skip for null or undefined values
  var dataValue = DvtChartDataUtils.getValue(chart, seriesIndex, groupIndex);
  if (dataValue == null || isNaN(dataValue))
    return null;

  // Filter markers to optimize rendering
  if (DvtChartPlotAreaRenderer._isDataItemFiltered(chart, seriesIndex, groupIndex))
    return null;

  // Determine whether a visible marker is to be displayed
  var numGroups = DvtChartDataUtils.getGroupCount(chart);
  var bMarkerDisplayed = DvtChartStyleUtils.isMarkerDisplayed(chart, seriesIndex, groupIndex);
  if (!bMarkerDisplayed) {
    if (options['_environment'] != 'jet' && DvtChartAxisUtils.isMixedFrequency(chart)) {
      // For mixed frequency in ADF and MAF, points are connected across nulls.
      // Markers only need to be drawn if there's only a single point.
      if (numGroups < 2)
        bMarkerDisplayed = true;
    }
    else {
      // If both previous and next values are null, then always display a marker
      // In computing the prev and next indices for polar chart, allow the index to wrap around
      var lastIndex = numGroups - 1;
      var isPolar = DvtChartTypeUtils.isPolar(chart);
      var prevIndex = (isPolar && lastIndex > 0 && groupIndex == 0) ? lastIndex : groupIndex - 1;
      var nextIndex = (isPolar && lastIndex > 0 && groupIndex == lastIndex) ? 0 : groupIndex + 1;

      var prevValue = DvtChartDataUtils.getValue(chart, seriesIndex, prevIndex);
      var nextValue = DvtChartDataUtils.getValue(chart, seriesIndex, nextIndex);
      if ((prevValue == null || isNaN(prevValue)) && (nextValue == null || isNaN(nextValue)))
        bMarkerDisplayed = true;
    }
  }

  // Skip hidden markers for overview, animation, and spark.
  if (!bMarkerDisplayed) {
    if (DvtChartTypeUtils.isSpark(chart))
      return null;
    else if ((options['_duringAnimation'] || DvtChartTypeUtils.isOverview(chart)) &&
            !DvtChartDataUtils.isDataSelected(chart, seriesIndex, groupIndex))
      return null;
  }

  // Skip if not visible. This check is relatively slow so we do it after the above checks.
  if (!DvtChartStyleUtils.isDataItemRendered(chart, seriesIndex, groupIndex))
    return false;

  var bInViewport = true;
  var pos = DvtChartDataUtils.getMarkerPosition(chart, seriesIndex, groupIndex, availSpace);
  var markerSize = DvtChartStyleUtils.getMarkerSize(chart, seriesIndex, groupIndex);
  if (availSpace && pos && markerSize)
    bInViewport = availSpace.intersects(new dvt.Rectangle(pos.x - markerSize / 2, pos.y - markerSize / 2, markerSize, markerSize));

  if (!pos || !bInViewport)
    return null;

  return {seriesIndex: seriesIndex, groupIndex: groupIndex,
    x: pos.x, y: pos.y, size: markerSize, markerDisplayed: bMarkerDisplayed};
};

/**
 * Optimized version of _getMarkerInfo for large data bubble and scatter charts.
 * The returned object's fields must remain consistent with that returned by
 * _getMarkerInfo.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @param {dvt.Rectangle} availSpace The available space.
 * @return {object} An object with rendering information. Fields not documented as it is intended for use within this
 *                 class only.
 * @private
 */
DvtChartPlotAreaRenderer._getScatterBubbleMarkerInfo = function(chart, seriesIndex, groupIndex, availSpace) {
  // Skip if not visible. This check is relatively slow so we do it after the above checks.
  if (!DvtChartStyleUtils.isDataItemRendered(chart, seriesIndex, groupIndex))
    return false;

  var pos = DvtChartDataUtils.getScatterBubbleMarkerPosition(chart, seriesIndex, groupIndex);
  if (!pos)
    return null;

  var markerSize = DvtChartStyleUtils.getMarkerSize(chart, seriesIndex, groupIndex);
  if (!markerSize)
    return null;

  return {seriesIndex: seriesIndex, groupIndex: groupIndex, x: pos.x, y: pos.y, size: markerSize};
};

/**
 * Creates and returns the array of dvt.SimpleMarker objects for the specified series.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {number} seriesIndex
 * @param {dvt.Rectangle} availSpace The available space.
 * @param {dvt.SolidStroke} defaultStroke The default stroke that will be applied to the container of the markers.
 * @return {array} The array of dvt.SimpleMarker objects for the specified series.
 * @private
 */
DvtChartPlotAreaRenderer._getMarkersForSeries = function(chart, seriesIndex, availSpace, defaultStroke) {
  // Skip the series if it shouldn't be rendered
  if (!DvtChartStyleUtils.isSeriesRendered(chart, seriesIndex))
    return [];

  // The stroke is optimized onto the parent container when possible.
  var bOptimizeStroke = DvtChartStyleUtils.optimizeMarkerStroke(chart);
  var defaultBorderColor = bOptimizeStroke ? defaultStroke.getColor() : null;
  var defaultBorderWidth = bOptimizeStroke ? defaultStroke.getWidth() : null;

  // Keep track of the markers so that they can be sorted and added
  var markers = [];

  // Loop through the groups in the series
  var numGroups = DvtChartDataUtils.getGroupCount(chart);
  for (var groupIndex = 0; groupIndex < numGroups; groupIndex++) {
    // Calculate the rendering info for the marker. If null is returned, skip.
    var markerInfo = DvtChartPlotAreaRenderer._getMarkerInfo(chart, seriesIndex, groupIndex, availSpace);
    if (!markerInfo)
      continue;

    var marker = DvtChartPlotAreaRenderer._createMarker(chart, markerInfo, bOptimizeStroke, defaultBorderColor, defaultBorderWidth);
    if (marker != null)
      markers.push(marker);
  }

  return markers;
};

/**
 * Creates the marker for the specified data item.
 * @param  {DvtChart} chart
 * @param  {object} markerInfo
 * @param  {boolean} bOptimizeStroke
 * @param  {string} defaultBorderColor
 * @param  {string} defaultBorderWidth
 * @return {DvtSimpleMarker}
 * @private
 */
DvtChartPlotAreaRenderer._createMarker = function(chart, markerInfo, bOptimizeStroke, defaultBorderColor, defaultBorderWidth) {
  var isTouchDevice = dvt.Agent.isTouchDevice();
  var context = chart.getCtx();

  // Create the marker
  var marker;
  var seriesIndex = markerInfo.seriesIndex;
  var groupIndex = markerInfo.groupIndex;
  var dataColor = DvtChartStyleUtils.getMarkerColor(chart, seriesIndex, groupIndex);
  var markerShape = DvtChartStyleUtils.getMarkerShape(chart, seriesIndex, groupIndex);
  var markerDisplayed = markerInfo.markerDisplayed;
  if (markerDisplayed == null)
    markerDisplayed = DvtChartStyleUtils.isMarkerDisplayed(chart, seriesIndex, groupIndex);

  if (markerDisplayed) {
    // Support for visible markers
    var source = DvtChartStyleUtils.getImageSource(chart, seriesIndex, groupIndex, 'source');
    if (source) {
      var sourceSelected = DvtChartStyleUtils.getImageSource(chart, seriesIndex, groupIndex, 'sourceSelected');
      var sourceHover = DvtChartStyleUtils.getImageSource(chart, seriesIndex, groupIndex, 'sourceHover');
      var sourceHoverSelected = DvtChartStyleUtils.getImageSource(chart, seriesIndex, groupIndex, 'sourceHoverSelected');
      marker = new dvt.ImageMarker(context, markerInfo.x, markerInfo.y, markerInfo.size, markerInfo.size, null,
          source, sourceSelected, sourceHover, sourceHoverSelected);
    }
    else {
      marker = new dvt.SimpleMarker(context, markerShape, chart.getSkin(), markerInfo.x, markerInfo.y, markerInfo.size, markerInfo.size);

      // Apply the marker style
      marker.setFill(DvtChartSeriesEffectUtils.getMarkerFill(chart, seriesIndex, groupIndex));

      var borderColor = DvtChartStyleUtils.getMarkerBorderColor(chart, seriesIndex, groupIndex);
      var borderWidth = DvtChartStyleUtils.getBorderWidth(chart, seriesIndex, groupIndex);
      if (borderColor != defaultBorderColor || borderWidth != defaultBorderWidth)
        marker.setSolidStroke(borderColor, null, borderWidth);

      // Set the data color, used for data label generation
      marker.setDataColor(dataColor, true);

      // Apply the selection effects, which are also used for keyboard focus.
      var hoverColor = dvt.SelectionEffectUtils.getHoverBorderColor(dataColor);
      var innerColor = DvtChartStyleUtils.getSelectedInnerColor(chart);
      var outerColor = DvtChartStyleUtils.getSelectedOuterColor(chart);
      marker.setHoverStroke(new dvt.SolidStroke(innerColor, 1, 1), new dvt.SolidStroke(hoverColor, 1, 3.5));
      marker.setSelectedStroke(new dvt.SolidStroke(innerColor, 1, 1.5), new dvt.SolidStroke(outerColor, 1, 4.5));
      marker.setSelectedHoverStroke(new dvt.SolidStroke(innerColor, 1, 1.5), new dvt.SolidStroke(hoverColor, 1, 4.5));
    }
    if (DvtChartStyleUtils.isSelectable(chart, seriesIndex, groupIndex))
      marker.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());

    // Make sure that the marker hit area is large enough for touch devices ()
    // Also make sure there is only 1 invisible marker ()
    if (isTouchDevice && (markerInfo.size < DvtChartPlotAreaRenderer._MIN_TOUCH_MARKER_SIZE))
      DvtChartPlotAreaRenderer._addMarkerHitArea(marker, markerInfo.x, markerInfo.y, bOptimizeStroke);
  }
  else {
    // Support for invisible markers for tooltips/interactivity
    if (DvtChartStyleUtils.isSelectable(chart, seriesIndex, groupIndex)) {
      marker = new DvtChartLineMarker(context, markerShape, markerInfo.x, markerInfo.y, markerInfo.size, bOptimizeStroke);
      marker.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
      if (isTouchDevice)
        DvtChartPlotAreaRenderer._addMarkerHitArea(marker, markerInfo.x, markerInfo.y, bOptimizeStroke);
    }
    else {
      // Selection not supported
      if (isTouchDevice)
        markerInfo.size = DvtChartPlotAreaRenderer._MIN_TOUCH_MARKER_SIZE;

      marker = new DvtChartLineMarker(context, dvt.SimpleMarker.SQUARE, markerInfo.x, markerInfo.y, markerInfo.size, bOptimizeStroke);
    }

    if (marker != null) {
      marker.setInvisibleFill();
      marker.setDataColor(dataColor);
    }
  }

  // Associate the marker for interactivity
  if (marker != null)
    DvtChartObjPeer.associate(marker, chart, seriesIndex, groupIndex, markerInfo);

  return marker;
};

/**
 * Adds hit area to marker.
 * @param {dvt.SimpleMarker} marker
 * @param {number} x The marker x position.
 * @param {number} y The marker y position.
 * @param {boolean} bOptimizeStroke Whether the marker stroke is defined in the marker container.
 * @private
 */
DvtChartPlotAreaRenderer._addMarkerHitArea = function(marker, x, y, bOptimizeStroke) {
  var hitArea = new dvt.Rect(marker.getCtx(),
      x - DvtChartPlotAreaRenderer._MIN_TOUCH_MARKER_SIZE / 2, y - DvtChartPlotAreaRenderer._MIN_TOUCH_MARKER_SIZE / 2,
      DvtChartPlotAreaRenderer._MIN_TOUCH_MARKER_SIZE, DvtChartPlotAreaRenderer._MIN_TOUCH_MARKER_SIZE);

  // If stroke is optimized by defining in the container, it needs to be removed from the hit area.
  if (bOptimizeStroke)
    hitArea.setSolidStroke('none');

  hitArea.setInvisibleFill();
  marker.addChild(hitArea);
};

/**
 * Creates and returns the array of DvtChartRangeMarker objects for the specified series.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {number} seriesIndex
 * @param {dvt.Rectangle} availSpace The available space.
 * @return {array} The array of DvtChartRangeMarker objects for the specified series.
 * @private
 */
DvtChartPlotAreaRenderer._getRangeMarkersForSeries = function(chart, seriesIndex, availSpace) {
  // Skip the series if it shouldn't be rendered
  if (!DvtChartStyleUtils.isSeriesRendered(chart, seriesIndex))
    return [];

  var isTouchDevice = dvt.Agent.isTouchDevice();
  var context = chart.getCtx();
  var xAxis = chart.xAxis;
  var yAxis = DvtChartDataUtils.isAssignedToY2(chart, seriesIndex) ? chart.y2Axis : chart.yAxis;
  var options = chart.getOptions();
  var numGroups = DvtChartDataUtils.getGroupCount(chart);

  // Keep track of the markers so that they can be sorted and added
  var markers = [];

  // Loop through the groups in the series
  for (var groupIndex = 0; groupIndex < numGroups; groupIndex++) {
    // Filter markers to optimize rendering
    if (DvtChartPlotAreaRenderer._isDataItemFiltered(chart, seriesIndex, groupIndex))
      continue;

    // Skip if not visible
    if (!DvtChartStyleUtils.isDataItemRendered(chart, seriesIndex, groupIndex))
      continue;

    // Get the axis values
    var xCoord = xAxis.getCoordAt(DvtChartDataUtils.getXValue(chart, seriesIndex, groupIndex));
    var lowCoord = yAxis.getUnboundedCoordAt(DvtChartDataUtils.getLowValue(chart, seriesIndex, groupIndex));
    var highCoord = yAxis.getUnboundedCoordAt(DvtChartDataUtils.getHighValue(chart, seriesIndex, groupIndex));

    if (xCoord == null || lowCoord == null || highCoord == null)
      continue;


    var bMarkerDisplayed = DvtChartStyleUtils.isMarkerDisplayed(chart, seriesIndex, groupIndex);
    if (!bMarkerDisplayed) {
      // If both previous and next values are null, then always display a marker
      // In computing the prev and next indices for polar chart, allow the index to wrap around
      var lastIndex = numGroups - 1;
      var isPolar = DvtChartTypeUtils.isPolar(chart);
      var prevIndex = (isPolar && lastIndex > 0 && groupIndex == 0) ? lastIndex : groupIndex - 1;
      var nextIndex = (isPolar && lastIndex > 0 && groupIndex == lastIndex) ? 0 : groupIndex + 1;

      var prevLowValue = DvtChartDataUtils.getLowValue(chart, seriesIndex, prevIndex);
      var prevHighValue = DvtChartDataUtils.getHighValue(chart, seriesIndex, prevIndex);
      var nextLowValue = DvtChartDataUtils.getLowValue(chart, seriesIndex, nextIndex);
      var nextHighValue = DvtChartDataUtils.getHighValue(chart, seriesIndex, prevIndex);

      if (prevLowValue == null && prevHighValue == null && nextLowValue == null && nextHighValue == null)
        bMarkerDisplayed = true;
    }

    // If the chart is inside overview or in the middle of animation, don't render invisible markers unless the marker is selected.
    if ((options['_duringAnimation'] || DvtChartTypeUtils.isOverview(chart) || DvtChartTypeUtils.isSpark(chart)) &&
        !bMarkerDisplayed && !DvtChartDataUtils.isDataSelected(chart, seriesIndex, groupIndex))
      continue;

    // Store the center of the data point relative to the plot area (for marquee selection)
    var pLow = DvtChartPlotAreaRenderer.convertAxisCoord(chart, new dvt.Point(xCoord, lowCoord), availSpace);
    var pHigh = DvtChartPlotAreaRenderer.convertAxisCoord(chart, new dvt.Point(xCoord, highCoord), availSpace);
    var dataPos = new dvt.Point((pLow.x + pHigh.x) / 2, (pLow.y + pHigh.y) / 2);

    // Create the marker. Even if the marker is invisible, we need it for keyboard and voiceover support.
    var markerSize = DvtChartStyleUtils.getMarkerSize(chart, seriesIndex, groupIndex);
    var marker = new DvtChartRangeMarker(context, pLow.x, pLow.y, pHigh.x, pHigh.y, markerSize, !bMarkerDisplayed);
    var fill = DvtChartSeriesEffectUtils.getMarkerFill(chart, seriesIndex, groupIndex);
    var borderColor = DvtChartStyleUtils.getMarkerBorderColor(chart, seriesIndex, groupIndex);
    var borderWidth = DvtChartStyleUtils.getBorderWidth(chart, seriesIndex, groupIndex);
    var stroke = new dvt.SolidStroke(borderColor, null, borderWidth);
    var dataColor = DvtChartStyleUtils.getMarkerColor(chart, seriesIndex, groupIndex);
    var innerColor = DvtChartStyleUtils.getSelectedInnerColor(chart);
    var outerColor = DvtChartStyleUtils.getSelectedOuterColor(chart);
    marker.setStyleProperties(fill, stroke, dataColor, innerColor, outerColor);

    if (DvtChartStyleUtils.isSelectable(chart, seriesIndex, groupIndex))
      marker.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());

    // Create hit area
    var hitArea = new dvt.Line(context, pLow.x, pLow.y, pHigh.x, pHigh.y);
    hitArea.setSolidStroke('rgba(0,0,0,0)', null, isTouchDevice ? Math.max(markerSize, DvtChartPlotAreaRenderer._MIN_TOUCH_MARKER_SIZE) : markerSize);
    marker.addChild(hitArea);

    // Add it to the markers array for sorting and addition to the display list later
    markers.push(marker);

    // Associate the marker for interactivity
    DvtChartObjPeer.associate(marker, chart, seriesIndex, groupIndex, dataPos);
  }

  return markers;
};


/**
 * Renders all bar series for the given chart.
 * @param {dvt.Chart} chart
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} availSpace
 * @private
 */
DvtChartPlotAreaRenderer._renderBars = function(chart, container, availSpace) {
  var bHoriz = DvtChartTypeUtils.isHorizontal(chart);
  var bPolar = DvtChartTypeUtils.isPolar(chart);
  var bStock = DvtChartTypeUtils.isStock(chart);
  var bPixelSpacing = (DvtChartStyleUtils.getBarSpacing(chart) == 'pixel');
  var isR2L = dvt.Agent.isRightToLeft(chart.getCtx());
  var hasStackLabel = DvtChartStyleUtils.isStackLabelRendered(chart);
  var isStacked = DvtChartTypeUtils.isStacked(chart);

  // Iterate through the data
  for (var groupIndex = 0; groupIndex < DvtChartDataUtils.getGroupCount(chart); groupIndex++) {

    for (var seriesIndex = 0; seriesIndex < DvtChartDataUtils.getSeriesCount(chart); seriesIndex++) {
      if (!DvtChartDataUtils.isBLACItemInViewport(chart, seriesIndex, groupIndex) || DvtChartStyleUtils.getSeriesType(chart, seriesIndex) != 'bar')
        continue;

      var barData = DvtChartDataUtils.getBarInfo(chart, seriesIndex, groupIndex, availSpace);
      if (barData == null)
        continue;

      // Get the y-axis position
      var yCoord = barData.yCoord;
      var baseCoord = barData.baseCoord;
      var axisCoord = barData.axisCoord;
      var x1 = barData.x1;
      var x2 = barData.x2;
      var barWidth = barData.barWidth;

      // Support for 0 value bars. If the bar is smaller than a pixel:
      // - draw as 1px bar if it's range series
      // - draw as an invisible 3px bar otherwise
      var bInvisible = false;
      if (Math.abs(yCoord - baseCoord) < 1) {
        if (DvtChartStyleUtils.isRangeSeries(chart, seriesIndex))
          yCoord--;
        else if (!isStacked || DvtChartDataUtils.isOutermostBar(chart, seriesIndex, groupIndex)) {
          bInvisible = true;
          if (yCoord > baseCoord || (bHoriz && !isR2L && yCoord == baseCoord)) // if horizontal, R2L must be considered to draw bar on positive side of baseline
            yCoord = baseCoord + 3;
          else
            yCoord = baseCoord - 3;
        }
      }

      // Create and apply the style
      var shape;
      if (bPolar)
        shape = new DvtChartPolarBar(chart, axisCoord, baseCoord, yCoord, x1, x2, availSpace);
      else
        shape = new DvtChartBar(chart, axisCoord, baseCoord, yCoord, x1, x2);
      container.addChild(shape);

      if (DvtChartStyleUtils.isSelectable(chart, seriesIndex, groupIndex))
        shape.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());

      var fill, stroke = null;
      if (bInvisible) // Apply an invisible fill for small bars
        fill = dvt.SolidFill.invisibleFill();
      else {
        // Apply the specified style
        fill = DvtChartSeriesEffectUtils.getBarFill(chart, seriesIndex, groupIndex, bHoriz, barWidth);
        var borderColor = DvtChartStyleUtils.getBorderColor(chart, seriesIndex, groupIndex);
        var borderWidth = DvtChartStyleUtils.getBorderWidth(chart, seriesIndex, groupIndex);
        if (borderColor)
          stroke = new dvt.SolidStroke(borderColor, null, borderWidth);
      }

      var dataColor = DvtChartStyleUtils.getColor(chart, seriesIndex, groupIndex);
      var innerColor = DvtChartStyleUtils.getSelectedInnerColor(chart);
      var outerColor = DvtChartStyleUtils.getSelectedOuterColor(chart);

      // Apply the fill, stroke, and selection colors
      shape.setStyleProperties(fill, stroke, dataColor, innerColor, outerColor);

      // Use pixel hinting for pixel bar spacing
      if (bPixelSpacing)
        shape.setPixelHinting(true);

      // Associate for interactivity
      DvtChartObjPeer.associate(shape, chart, seriesIndex, groupIndex, barData.dataPos);

      // Rendering data labels for this bar
      if (DvtChartStyleUtils.isRangeSeries(chart, seriesIndex)) {
        DvtChartPlotAreaRenderer._renderDataLabel(chart, container, shape.getBoundingBox(), seriesIndex, groupIndex, dataColor, 'low');
        DvtChartPlotAreaRenderer._renderDataLabel(chart, container, shape.getBoundingBox(), seriesIndex, groupIndex, dataColor, 'high');
      }
      else
        DvtChartPlotAreaRenderer._renderDataLabel(chart, container, shape.getBoundingBox(), seriesIndex, groupIndex, dataColor);

      var markers = new Array();
      markers.push(shape);

      if (!(bStock && seriesIndex != 0)) {
        // TODO: change to formal location for displayed data
        chart._currentMarkers.push(markers);
      }

      // Render stack cumulative labels
      if (hasStackLabel && DvtChartDataUtils.isOutermostBar(chart, seriesIndex, groupIndex)) {
        DvtChartPlotAreaRenderer._renderDataLabel(chart, container, shape.getBoundingBox(), seriesIndex, groupIndex, null, null, true);
      }
    }
  }
};

/**
 * Renders all stock values and ranges for the given chart.
 * @param {dvt.Chart} chart
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} availSpace
 * @private
 */
DvtChartPlotAreaRenderer._renderStock = function(chart, container, availSpace) {
  var options = chart.getOptions();
  var xAxis = chart.xAxis;
  var yAxis = chart.yAxis;

  // Only a single series is supported right now
  if (DvtChartStyleUtils.getSeriesType(chart, 0) != 'candlestick')
    return;

  // Iterate through the data
  for (var groupIndex = 0; groupIndex < DvtChartDataUtils.getGroupCount(chart); groupIndex++) {
    if (!DvtChartDataUtils.isBLACItemInViewport(chart, 0, groupIndex))
      continue;

    // Get the axis values
    var xValue = DvtChartDataUtils.getXValue(chart, 0, groupIndex);
    var dataItem = DvtChartDataUtils.getDataItem(chart, 0, groupIndex);
    var openValue, closeValue, lowValue, highValue = null;
    if (dataItem) {
      openValue = dataItem['open'];
      closeValue = dataItem['close'];
      lowValue = dataItem['low'];
      highValue = dataItem['high'];
    }

    var renderRange = lowValue != null && highValue != null;
    // Don't render bars whose value is null
    if (openValue == null || closeValue == null)
      continue;

    // Get the position on the x axis and the bar width.
    var xCoord = xAxis.getUnboundedCoordAt(xValue);
    var barWidth = DvtChartStyleUtils.getBarWidth(chart, 0, groupIndex);

    // Get the position on the y axis
    var openCoord = yAxis.getBoundedCoordAt(openValue);
    var closeCoord = yAxis.getBoundedCoordAt(closeValue);
    var lowCoord, highCoord = null;
    if (renderRange) {
      lowCoord = yAxis.getBoundedCoordAt(lowValue);
      highCoord = yAxis.getBoundedCoordAt(highValue);
    }

    // Create the candlestick
    var candlestick = new DvtChartCandlestick(chart.getCtx(), xCoord, barWidth, openCoord, closeCoord, lowCoord, highCoord);
    container.addChild(candlestick);

    if (DvtChartStyleUtils.isSelectable(chart, 0, groupIndex))
      candlestick.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());

    // Find the fill and stroke to be applied.
    var fill = DvtChartSeriesEffectUtils.getBarFill(chart, 0, groupIndex, false, barWidth);
    var stroke = null;
    var borderColor = DvtChartStyleUtils.getBorderColor(chart, 0, groupIndex);
    var borderWidth = DvtChartStyleUtils.getBorderWidth(chart, 0, groupIndex);
    if (borderColor)
      stroke = new dvt.SolidStroke(borderColor, null, borderWidth);
    else if (fill instanceof dvt.PatternFill) // Patterns aren't usable here without the stroke.
      stroke = new dvt.SolidStroke(fill.getColor(), null, borderWidth);

    // Find the hover and selected styles and pass to the candlestick.
    var dataColor = DvtChartStyleUtils.getColor(chart, 0, groupIndex);
    var innerColor = DvtChartStyleUtils.getSelectedInnerColor(chart);
    var outerColor = DvtChartStyleUtils.getSelectedOuterColor(chart);
    var rangeColor = options['styleDefaults']['stockRangeColor'];
    candlestick.setChangeStyle(fill, stroke, dataColor, innerColor, outerColor);
    candlestick.setRangeStyle(new dvt.SolidFill(rangeColor), stroke, rangeColor, outerColor);

    // Associate for interactivity
    var dataPos = new dvt.Point(xCoord, (openCoord + closeCoord) / 2);
    DvtChartObjPeer.associate(candlestick, chart, 0, groupIndex, dataPos);

    // TODO: Illegal private accesses for data cursor.
    // chart._currentMarkers will be removed when data cursor code is cleaned up
    var markers = new Array();
    markers.push(candlestick._changeShape);
    chart._currentMarkers.push(markers);
  }
};

/**
 * Renders all line series for the given chart.
 * @param {dvt.Chart} chart
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Container} clipGroup The group for clipping the line and the area.
 * @param {dvt.Rectangle} availSpace
 * @private
 */
DvtChartPlotAreaRenderer._renderLines = function(chart, container, clipGroup, availSpace) {
  // Find all series that are lines
  var lineSeries = [], seriesIndex;
  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  for (seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
    // Skip the series if it shouldn't be rendered or if the series type is not line.
    if (!DvtChartStyleUtils.isSeriesRendered(chart, seriesIndex) ||
        DvtChartStyleUtils.getSeriesType(chart, seriesIndex) != 'line')
      continue;
    else
      lineSeries.push(seriesIndex);
  }

  // Render the lines
  for (var lineIndex = 0; lineIndex < lineSeries.length; lineIndex++) {
    seriesIndex = lineSeries[lineIndex];

    if (DvtChartStyleUtils.getLineType(chart, seriesIndex) == 'none')
      continue;

    // Filter points to reduce render time
    if (!DvtChartTypeUtils.isPolar(chart))
      DvtChartPlotAreaRenderer._filterPointsForSeries(chart, seriesIndex);

    DvtChartPlotAreaRenderer._renderLinesForSeries(chart, clipGroup, seriesIndex, availSpace);
  }

  // Render the markers
  for (lineIndex = 0; lineIndex < lineSeries.length; lineIndex++)
    DvtChartPlotAreaRenderer._renderMarkersForSeries(chart, container, lineSeries[lineIndex], availSpace);
};


/**
 * Renders all area series for the given chart.
 * @param {dvt.Chart} chart
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} availSpace
 * @param {boolean} isLineWithArea True if rendering lineWithArea.
 * @private
 */
DvtChartPlotAreaRenderer._renderAreas = function(chart, container, availSpace, isLineWithArea) {
  // Find all series that are areas
  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  var seriesType = isLineWithArea ? 'lineWithArea' : 'area';
  var yAreaSeries = [], y2AreaSeries = [];

  for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
    // Skip the series if it shouldn't be rendered or if the series type is not area.
    if (!DvtChartStyleUtils.isSeriesRendered(chart, seriesIndex) || DvtChartStyleUtils.getSeriesType(chart, seriesIndex) != seriesType)
      continue;

    if (DvtChartDataUtils.isAssignedToY2(chart, seriesIndex))
      y2AreaSeries.push(seriesIndex);
    else
      yAreaSeries.push(seriesIndex);
  }

  if (yAreaSeries.length > 0)
    DvtChartPlotAreaRenderer._renderAreasForAxis(chart, container, yAreaSeries, chart.yAxis.getBaselineCoord(), availSpace, isLineWithArea);

  if (y2AreaSeries.length > 0)
    DvtChartPlotAreaRenderer._renderAreasForAxis(chart, container, y2AreaSeries, chart.y2Axis.getBaselineCoord(), availSpace, isLineWithArea);
};


/**
 * Renders all area series for the given y or y2 axis.
 * @param {dvt.Chart} chart
 * @param {dvt.Container} container The container to render to.
 * @param {array} areaSeries The series indices for the area series that belongs to the axis.
 * @param {number} baselineCoord The baseline coord of the axis.
 * @param {dvt.Rectangle} availSpace
 * @param {boolean} isLineWithArea True if rendering lineWithArea.
 * @private
 */
DvtChartPlotAreaRenderer._renderAreasForAxis = function(chart, container, areaSeries, baselineCoord, availSpace, isLineWithArea) {
  var bStacked = DvtChartTypeUtils.isStacked(chart);
  var bPolar = DvtChartTypeUtils.isPolar(chart);

  // Create group to clip the areas
  var clippedGroup = DvtChartPlotAreaRenderer.createClippedGroup(chart, container, availSpace);

  // For stacked areas, the bottom shape of the area has to follow the shape formed by the areas below it.
  // The prevCoords array stores the shape that has formed so far. For each group, it stores x, y1, and y2. When there's
  // a transition to/from null values, the shape at x jumps from y1 to y2. Otherwise, y1 == y2.
  var prevCoordsMap = {};
  var prevTypeMap = {};
  var prevCoordsMapNegative = {};
  var prevTypeMapNegative = {};

  // Construct baseline coords array to build the first area on the stack
  var baselineCoords = [];
  var groupCount = DvtChartDataUtils.getGroupCount(chart);
  for (var i = 0; i < groupCount; i++) {
    baselineCoords.push(new DvtChartCoord(null, baselineCoord, baselineCoord, i, DvtChartDataUtils.getGroup(chart, i), true));
  }

  // Loop through the series
  for (var areaIndex = 0; areaIndex < areaSeries.length; areaIndex++) {
    var seriesIndex = areaSeries[areaIndex];
    var category = DvtChartDataUtils.getStackCategory(chart, seriesIndex);
    var isSeriesNegative = DvtChartDataUtils.isSeriesNegative(chart, seriesIndex);
    // Use previous coords of the last area on the current series' axis with the same stackCategory
    var prevCoords = prevCoordsMap[category];
    var prevType = prevTypeMap[category];
    var prevCoordsNegative = prevCoordsMapNegative[category];
    var prevTypeNegative = prevTypeMapNegative[category];

    if (DvtChartStyleUtils.getLineType(chart, seriesIndex) == 'none') {
      // render markers only
      DvtChartPlotAreaRenderer._renderMarkersForSeries(chart, container, seriesIndex, availSpace);
      continue;
    }

    var fill = DvtChartSeriesEffectUtils.getAreaFill(chart, seriesIndex);
    var borderColor = DvtChartStyleUtils.getBorderColor(chart, seriesIndex);
    var borderWidth = DvtChartStyleUtils.getBorderWidth(chart, seriesIndex);
    var stroke = borderColor ? new dvt.SolidStroke(borderColor, null, borderWidth) : null;
    var type = DvtChartStyleUtils.getLineType(chart, seriesIndex);

    // Filter points to reduce render time
    if (!bPolar)
      DvtChartPlotAreaRenderer._filterPointsForSeries(chart, seriesIndex);

    var coords, baseCoords, baseType;
    var isRange = DvtChartStyleUtils.isRangeSeries(chart, seriesIndex);
    if (isRange) {
      coords = DvtChartPlotAreaRenderer._getCoordsForSeries(chart, seriesIndex, availSpace, 'high');
      baseCoords = DvtChartPlotAreaRenderer._getCoordsForSeries(chart, seriesIndex, availSpace, 'low');
      baseType = type;
    }
    else {
      if (isSeriesNegative) {
        coords = DvtChartPlotAreaRenderer._getAreaCoordsForSeries(chart, seriesIndex, availSpace, prevCoordsNegative ? prevCoordsNegative : baselineCoords);
        baseCoords = prevCoordsNegative ? prevCoordsNegative : [];
        baseType = prevTypeNegative;
      }
      else {
        coords = DvtChartPlotAreaRenderer._getAreaCoordsForSeries(chart, seriesIndex, availSpace, prevCoords ? prevCoords : baselineCoords);
        baseCoords = prevCoords ? prevCoords : [];
        baseType = prevType;
      }

    }

    var area = new DvtChartLineArea(chart, true, availSpace, baselineCoord, fill, stroke, type, coords, baseType, baseCoords);
    clippedGroup.addChild(area);
    chart._currentAreas.push(area); // TODO: change to formal API for storage
    DvtChartObjPeer.associate(area, chart, seriesIndex); // Associate for interactivity

    // Store for the base of the next area in the stack
    if (isSeriesNegative) {
      prevCoordsMapNegative[category] = coords;
      prevTypeMapNegative[category] = type;
    }
    else {
      prevCoordsMap[category] = coords;
      prevTypeMap[category] = type;
    }

    // If not stacked, draw with each series so that lines and markers don't bleed through
    if (!bStacked) {
      // Draw line as data item gap only if the area doesn't have border. Otherwise the gap will be drawn on top of the border
      if (isLineWithArea || (DvtChartStyleUtils.getDataItemGaps(chart) > 0 && !borderColor))
        DvtChartPlotAreaRenderer._renderLinesForSeries(chart, clippedGroup, seriesIndex, availSpace, !isLineWithArea);

      // For lineWithArea, always draw the markers last since the areas are semi-transparent
      if (!isLineWithArea)
        DvtChartPlotAreaRenderer._renderMarkersForSeries(chart, container, seriesIndex, availSpace);

      // : New group generated for the next area so that, in unstacked charts, the clipGroup for each area is
      // added after the markers of previous series
      if (areaIndex + 1 < areaSeries.length)
        clippedGroup = DvtChartPlotAreaRenderer.createClippedGroup(chart, container, availSpace);
    }
  }

  // If stacked, draw lines and markers at the end so that the stacked areas don't overlap them
  for (areaIndex = 0; areaIndex < areaSeries.length; areaIndex++) {
    seriesIndex = areaSeries[areaIndex];
    if (DvtChartStyleUtils.getLineType(chart, seriesIndex) == 'none')
      continue; // markers are already rendered in previous loop

    // Draw line as data item gap only if the area doesn't have border. Otherwise the gap will be drawn on top of the border
    var hasBorder = DvtChartStyleUtils.getBorderColor(chart, seriesIndex) || DvtChartStyleUtils.getBorderColor(chart, seriesIndex + 1);
    if (bStacked && (isLineWithArea || (DvtChartStyleUtils.getDataItemGaps(chart) > 0 && !hasBorder)))
      DvtChartPlotAreaRenderer._renderLinesForSeries(chart, clippedGroup, seriesIndex, availSpace, !isLineWithArea);

    // Also draw markers last for unstacked lineWithArea so people can interact with them through the semi-transparent areas
    if (bStacked || isLineWithArea)
      DvtChartPlotAreaRenderer._renderMarkersForSeries(chart, container, seriesIndex, availSpace);
  }
};


/**
 * Returns the coordinates for the specified area series.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {number} seriesIndex The series being rendered.
 * @param {dvt.Rectangle} availSpace The available space.
 * @param {array} prevCoords The array of DvtChartCood from the previous series.
 * @return {array} The arrays of DvtChartCoord for the current series.
 * @private
 */
DvtChartPlotAreaRenderer._getAreaCoordsForSeries = function(chart, seriesIndex, availSpace, prevCoords) {
  var rawCoords = DvtChartPlotAreaRenderer._getCoordsForSeries(chart, seriesIndex, availSpace);
  var coords = [];
  for (var i = 0; i < prevCoords.length; i++)
    coords.push(prevCoords[i].clone());

  // Construct the coords based on the prevCoords.
  // At each point, if it's not null:
  // - if the previous point is null, update only the y2 so that the shape jumps up from the old y1 to the new y2;
  // - if the next point is null, update only the y1 so that the shape jumps down from the new y1 to the old y2;
  // - else, y1 == y2 and there's no jump at that point.
  var lastIndex = rawCoords.length - 1;
  var bPolar = DvtChartTypeUtils.isPolar(chart);
  for (var i = 0; i < rawCoords.length; i++) {
    if (rawCoords[i].x != null) {
      var coord = coords[rawCoords[i].groupIndex];
      var prevIndex = (bPolar && i == 0) ? lastIndex : i - 1; // prev/nextIndex in polar is circular
      var nextIndex = (bPolar && i == lastIndex) ? 0 : i + 1;

      if (prevIndex >= 0 && rawCoords[prevIndex].x != null)
        coord.y1 = rawCoords[i].y1;
      if (nextIndex <= lastIndex && rawCoords[nextIndex].x != null)
        coord.y2 = rawCoords[i].y2;

      coord.x = rawCoords[i].x;

      // If y1!=y2, there's a jump so the point can't be filtered
      coord.filtered = coord.y1 == coord.y2 ? rawCoords[i].filtered : false;
    }
  }

  return coords;
};


/**
 * Create lines for a series (for line and lineWithArea) and add them to the container.
 * @param {dvt.Chart} chart
 * @param {dvt.Container} container The line container.
 * @param {Number} seriesIndex
 * @param {dvt.Rectangle} availSpace
 * @param {Boolean} isDataItemGap Whether this line is for drawing area gap.
 * @private
 */
DvtChartPlotAreaRenderer._renderLinesForSeries = function(chart, container, seriesIndex, availSpace, isDataItemGap) {
  // Get the style info
  var stroke;
  if (isDataItemGap) {
    var gapSize = DvtChartStyleUtils.getDataItemGaps(chart) * 2.5;
    stroke = new dvt.SolidStroke(DvtChartStyleUtils.getBackgroundColor(chart, true), 1, gapSize);
  }
  else {
    var color = DvtChartStyleUtils.getColor(chart, seriesIndex);
    var lineWidth = DvtChartStyleUtils.getLineWidth(chart, seriesIndex);
    var lineStyle = dvt.Stroke.convertTypeString(DvtChartStyleUtils.getLineStyle(chart, seriesIndex));
    stroke = new dvt.SolidStroke(color, 1, lineWidth);
    stroke.setStyle(lineStyle);
  }

  // Create the lines
  var baseline = DvtChartDataUtils.isAssignedToY2(chart, seriesIndex) ? chart.y2Axis.getBaselineCoord() : chart.yAxis.getBaselineCoord();
  var lineType = DvtChartStyleUtils.getLineType(chart, seriesIndex);
  var renderLine = function(type) {
    var coords = DvtChartPlotAreaRenderer._getCoordsForSeries(chart, seriesIndex, availSpace, type);
    var line = new DvtChartLineArea(chart, false, availSpace, baseline, null, stroke, lineType, coords);
    container.addChild(line);
    DvtChartObjPeer.associate(line, chart, seriesIndex); // Associate for interactivity
  };

  var isRange = DvtChartStyleUtils.isRangeSeries(chart, seriesIndex);
  if (isRange) {
    renderLine('high');
    renderLine('low');
  }
  else
    renderLine('value');
};

/**
 * Filters the bubble and scatter markers for performance.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {boolean} bSortBySize True if markers should be sorted by size to reduce overlaps.
 * @param {dvt.Rectangle} availSpace The available space.
 * @return {array} The array of visible markerInfo objects, or null if filtering was not performed.
 * @private
 */
DvtChartPlotAreaRenderer._filterScatterBubble = function(chart, bSortBySize, availSpace) {
  // Note: This function works by determining and marking the data to be filtered. When render of the data is called
  // afterwards, the filtering flag causes the item to be skipped.
  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);
  var groupCount = DvtChartDataUtils.getGroupCount(chart);

  // Filter only if there are a sufficient number of data points. The filtering cost has overhead based on the size of
  // the availSpace, and is not generally worthwhile until several thousand markers can be skipped.
  if (seriesCount * groupCount < DvtChartPlotAreaRenderer._FILTER_THRESHOLD_SCATTER_BUBBLE)
    return null;

  // Gather the marker information objects for all data items.
  var markerInfo;
  var markerInfos = [];
  for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
    // Skip the series if it shouldn't be rendered
    if (!DvtChartStyleUtils.isSeriesRendered(chart, seriesIndex))
      continue;

    for (var groupIndex = 0; groupIndex < groupCount; groupIndex++) {
      markerInfo = DvtChartPlotAreaRenderer._getScatterBubbleMarkerInfo(chart, seriesIndex, groupIndex, availSpace);
      if (markerInfo != null)
        markerInfos.push(markerInfo);
    }
  }

  // Check the data count again now that obscured series accounted for.
  if (markerInfos.length < DvtChartPlotAreaRenderer._FILTER_THRESHOLD_SCATTER_BUBBLE)
    return null;

  if (bSortBySize)
    DvtChartMarkerUtils.sortMarkerInfos(markerInfos);

  // Create the data structure to track if pixels are occupied.
  var pixelMap = new dvt.PixelMap(25, new dvt.PixelMap(5, new dvt.PixelMap()));

  // Loop backwards to determine if objects are visible. Create an array of visible markers.
  var ret = [];
  var markerCount = markerInfos.length;
  for (var markerIndex = markerCount - 1; markerIndex >= 0; markerIndex--) {
    markerInfo = markerInfos[markerIndex];

    // Check if the pixels are occupied and adjust the filtered flag.
    var bObscured = DvtChartMarkerUtils.checkPixelMap(pixelMap, markerInfo.x, markerInfo.y, markerInfo.size);
    if (!bObscured) {
      var dataColor = DvtChartStyleUtils.getColor(chart, markerInfo.seriesIndex, markerInfo.groupIndex);
      var markerDisplayed = DvtChartStyleUtils.isMarkerDisplayed(chart, seriesIndex, groupIndex);
      var alpha = markerDisplayed ? dvt.ColorUtils.getAlpha(dataColor) : 0;
      if (alpha > 0) {
        // Update the pixel map for this marker
        DvtChartMarkerUtils.updatePixelMap(pixelMap, markerInfo.x, markerInfo.y, markerInfo.size, alpha);
        ret.push(markerInfo);
      }
    }
  }

  // Set the flag in the cache so that marquee selection will be based on the data rather than rendered objects.
  chart.putToCache('dataFiltered', true);

  // Markers were added top to bottom. Reverse for rendering order and return.
  ret.reverse();
  return ret;
};

/**
 * Filters the data points for line/area so that no more than one point is drawn per pixel.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @private
 */
DvtChartPlotAreaRenderer._filterPointsForSeries = function(chart, seriesIndex) {
  var maxNumPts = chart.__getPlotAreaSpace().w; // one point per pixel
  var seriesItems = DvtChartDataUtils.getSeriesItem(chart, seriesIndex)['items'];
  var axisInfo = chart.xAxis.getInfo();
  var zoomFactor = (axisInfo.getDataMax() - axisInfo.getDataMin()) / (axisInfo.getViewportMax() - axisInfo.getViewportMin());
  var setSize = Math.round(2 * (seriesItems.length / zoomFactor) / maxNumPts); // pick two points (max and min) from each set

  if (setSize <= 2) {
    // Nothing should be filtered. Clear _filtered flags from previous rendering.
    for (var i = 0; i < seriesItems.length; i++) {
      dataItem = seriesItems[i];
      if (dataItem)
        dataItem['_filtered'] = false;
    }
    return;
  }

  var maxIndex, maxValue, minIndex, minValue, dataItem, dataValue;
  var filtered = false;
  for (var i = 0; i < seriesItems.length; i += setSize) {
    maxIndex = -1;
    maxValue = -Infinity;
    minIndex = -1;
    minValue = Infinity;

    // Find the extreme points (min/max) of the set
    for (var j = i; j < Math.min(i + setSize, seriesItems.length); j++) {
      dataValue = DvtChartDataUtils.getValue(chart, seriesIndex, j);
      dataItem = seriesItems[j];
      if (dataValue == null || dataItem == null)
        continue;
      if (dataValue > maxValue) {
        maxIndex = j;
        maxValue = dataValue;
      }
      if (dataValue < minValue) {
        minIndex = j;
        minValue = dataValue;
      }
      dataItem['_filtered'] = true; // Filter every point in the meanwhile
      filtered = true;
    }

    // Unfilter the extreme points of the set
    for (var j = i; j < Math.min(i + setSize, seriesItems.length); j++) {
      dataItem = seriesItems[j];
      if (dataItem == null)
        continue;
      if (j == maxIndex || j == minIndex)
        dataItem['_filtered'] = false;
    }
  }

  chart.putToCache('dataFiltered', filtered);
};

/**
 * Returns whether the data item is filtered.
 * @param {dvt.Chart} chart
 * @param {number} seriesIndex
 * @param {number} groupIndex
 * @return {boolean}
 * @private
 */
DvtChartPlotAreaRenderer._isDataItemFiltered = function(chart, seriesIndex, groupIndex) {
  var dataItem = DvtChartDataUtils.getDataItem(chart, seriesIndex, groupIndex);
  if (dataItem && dataItem['_filtered'])
    return true;
  return false;
};

/**
 * Creates and returns the coordinates for the specified series.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {number} seriesIndex The series being rendered.
 * @param {dvt.Rectangle} availSpace The available space.
 * @param {string} type (optional) The value type: 'value' (default), 'low', or 'high'.
 * @return {array} The array of DvtChartCoord.
 * @private
 */
DvtChartPlotAreaRenderer._getCoordsForSeries = function(chart, seriesIndex, availSpace, type) {
  var xAxis = chart.xAxis;
  var yAxis = chart.yAxis;
  if (DvtChartDataUtils.isAssignedToY2(chart, seriesIndex))
    yAxis = chart.y2Axis;

  // Loop through the groups
  var coords = [];
  for (var groupIndex = 0; groupIndex < DvtChartDataUtils.getGroupCount(chart); groupIndex++) {
    var group = DvtChartDataUtils.getGroup(chart, groupIndex);
    var dataValue = DvtChartDataUtils.getValue(chart, seriesIndex, groupIndex);

    // Get the axis values
    var xValue = DvtChartDataUtils.getXValue(chart, seriesIndex, groupIndex);

    var yValue = null;
    if (type == 'low')
      yValue = DvtChartDataUtils.getLowValue(chart, seriesIndex, groupIndex);
    else if (type == 'high')
      yValue = DvtChartDataUtils.getHighValue(chart, seriesIndex, groupIndex);
    else if (dataValue != null)
      yValue = DvtChartDataUtils.getCumulativeValue(chart, seriesIndex, groupIndex);

    // A null or undefined value begins another line or area and skips this data item
    if (yValue == null || isNaN(yValue) || !DvtChartDataUtils.isBLACItemInViewport(chart, seriesIndex, groupIndex)) {
      // Skip this value since it's invalid
      coords.push(new DvtChartCoord(null, null, null, groupIndex, group, false));
      continue;
    }

    if (DvtChartTypeUtils.isPolar(chart)) // The yValue for polar shouldn't go below the minimum because it will appear on the opposite side of the chart
      yValue = Math.max(yValue, yAxis.getInfo().getViewportMin());

    // Get the position on the axis
    var xCoord = xAxis.getUnboundedCoordAt(xValue);
    var yCoord = yAxis.getUnboundedCoordAt(yValue);

    var coord = new DvtChartCoord(xCoord, yCoord, yCoord, groupIndex, group, DvtChartPlotAreaRenderer._isDataItemFiltered(chart, seriesIndex, groupIndex));
    coords.push(coord);
  }

  return coords;
};


/**
 * Creates a container for plot area foreground objects with clipping.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} availSpace The available space.
 * @return {dvt.Container} The clipped container for plot area foreground objects.
 */
DvtChartPlotAreaRenderer.createClippedGroup = function(chart, container, availSpace) {
  var clipGroup = new dvt.Container(container.getCtx());
  container.addChild(clipGroup);
  var clip = new dvt.ClipPath(chart.getId());

  //  - line gets cut off at plot area max
  //  - line charts vertex clipped if dataMax too close to globalMax
  // For a chart with a line/linewitharea series, increase clip group by several pixels if lines risk getting clipped
  var buffer = DvtChartPlotAreaRenderer._extendClipGroup(chart);

  // Add clip path depending on plot area shape
  if (DvtChartTypeUtils.isPolar(chart)) {
    var cx = availSpace.x + availSpace.w / 2;
    var cy = availSpace.y + availSpace.h / 2;
    if (DvtChartAxisUtils.isGridPolygonal(chart)) {
      var points = dvt.PolygonUtils.getRegularPolygonPoints(cx, cy, DvtChartDataUtils.getGroupCount(chart), chart.getRadius(), 0);
      clip.addPolygon(points);
    }
    else
      clip.addCircle(cx, cy, chart.getRadius());
  }
  else if (DvtChartTypeUtils.isHorizontal(chart))
    clip.addRect(availSpace.x - buffer, availSpace.y, availSpace.w + 2 * buffer, availSpace.h);
  else
    clip.addRect(availSpace.x, availSpace.y - buffer, availSpace.w, availSpace.h + 2 * buffer);

  clipGroup.setClipPath(clip);
  return clipGroup;
};


/**
 * Converts polar coord to cartesian coord.
 * @param {number} r The radius.
 * @param {number} theta The angle.
 * @param {dvt.Rectangle} availSpace The availSpace, to compute the center.
 * @return {dvt.Point} The cartesian coord.
 */
DvtChartPlotAreaRenderer.polarToCartesian = function(r, theta, availSpace) {
  var x = availSpace.x + availSpace.w / 2 + r * Math.sin(theta);
  var y = availSpace.y + availSpace.h / 2 - r * Math.cos(theta);
  return new dvt.Point(x, y);
};


/**
 * Converts the axis coordinate into the plot area coordinate.
 * @param {dvt.Chart} chart
 * @param {dvt.Point} coord The axis coordinate.
 * @param {dvt.Rectangle} availSpace
 * @return {dvt.Point} The plot area coordinate.
 */
DvtChartPlotAreaRenderer.convertAxisCoord = function(chart, coord, availSpace) {
  if (DvtChartTypeUtils.isPolar(chart)) {
    var cartesian = DvtChartPlotAreaRenderer.polarToCartesian(coord.y, coord.x, availSpace);
    return new dvt.Point(cartesian.x, cartesian.y);
  }
  else if (DvtChartTypeUtils.isHorizontal(chart))
    return new dvt.Point(coord.y, coord.x);
  else
    return new dvt.Point(coord.x, coord.y);
};


/**
 * Checks or not the plot area should extend it's clip group, and returns how many pixels should be added.
 * Used for preventing clipping of line series at edge cases.
 * @param {dvt.Chart} chart
 * @return {number}
 * @private
 */
DvtChartPlotAreaRenderer._extendClipGroup = function(chart) {
  var hasLineSeries = DvtChartTypeUtils.hasLineSeries(chart) || DvtChartTypeUtils.hasLineWithAreaSeries(chart);
  if (hasLineSeries) {
    var lineWidth = DvtChartStyleUtils.getLineWidth(chart);
    var hasEdgeData = function(axis) {
      var axisInfo = axis.getInfo();
      var globalMaxCoord = axisInfo.getCoordAt(axisInfo.getGlobalMax());
      var dataMaxCoord = axisInfo.getCoordAt(axisInfo.getDataMax());
      var globalMinCoord = axisInfo.getCoordAt(axisInfo.getGlobalMin());
      var dataMinCoord = axisInfo.getCoordAt(axisInfo.getDataMin());

      if (globalMaxCoord != null && dataMaxCoord != null && dataMaxCoord - globalMaxCoord <= lineWidth / 2)
        return true;
      if (globalMinCoord != null && dataMinCoord != null && globalMinCoord - dataMinCoord <= lineWidth / 2)
        return true;

      return false;
    };

    if ((chart.yAxis && hasEdgeData(chart.yAxis)) || (chart.y2Axis && hasEdgeData(chart.y2Axis)))
      return Math.ceil(lineWidth / 2);
  }

  return 0;
};
/**
 * Renderer for funnel chart.
 * @class
 */
var DvtChartFunnelRenderer = new Object();

dvt.Obj.createSubclass(DvtChartFunnelRenderer, dvt.Obj);

/** @private @const */
DvtChartFunnelRenderer._DEFAULT_3D_GAP_RATIO = 1 / 36;
/** @private @const */
DvtChartFunnelRenderer._DEFAULT_2D_GAP_RATIO = 1 / 70;
/** @private @const */
DvtChartFunnelRenderer._MAX_WIDTH_FOR_GAPS = 0.25;
/** @private @const */
DvtChartFunnelRenderer._GROUP_INDEX = 0;

/**
 * Renders the funnel into the available space.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} availSpace The available space.
 */
DvtChartFunnelRenderer.render = function(chart, container, availSpace) {
  // Creating a container for the funnel so that it can be rotated if vertical, also for animation.
  var funnelContainer = new dvt.Container(chart.getCtx());
  funnelContainer.setTranslate(availSpace.x, availSpace.y);
  container.addChild(funnelContainer);
  chart.setPlotArea(funnelContainer);

  var bbox;

  if (chart.getOptions()['orientation'] == 'horizontal')
    bbox = new dvt.Rectangle(0, 0, availSpace.w, availSpace.h);
  else { //rotate the container and the bounding rect
    var rotationMatrix = new dvt.Matrix();
    var dirFactor = dvt.Agent.isRightToLeft(chart.getCtx()) ? -1 : 1;
    rotationMatrix.translate(- availSpace.h / 2, - availSpace.w / 2);
    rotationMatrix.rotate(dirFactor * Math.PI / 2);
    rotationMatrix.translate(availSpace.x + availSpace.w / 2, availSpace.y + availSpace.h / 2);
    bbox = new dvt.Rectangle(0, 0, availSpace.h, availSpace.w);
    funnelContainer.setMatrix(rotationMatrix);
  }

  if (! DvtChartFunnelRenderer._renderFunnelSlices(chart, funnelContainer, bbox))
    DvtChartRenderer.renderEmptyText(chart, container, availSpace);

  // Initial Selection
  var selected = DvtChartDataUtils.getInitialSelection(chart);
  DvtChartEventUtils.setInitialSelection(chart, selected);

  // Initial Highlighting
  chart.highlight(DvtChartStyleUtils.getHighlightedCategories(chart));
};


/**
 * Renders all funnel slices for the given chart.
 * @param {dvt.Chart} chart
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} availSpace
 * @return {boolean} true if funnel slices have been rendered, false otherwise
 * @private
 */
DvtChartFunnelRenderer._renderFunnelSlices = function(chart, container, availSpace) {
  var options = chart.getOptions();
  var seriesCount = DvtChartDataUtils.getSeriesCount(chart);

  // Compute the gap size
  var gapRatio = DvtChartStyleUtils.getDataItemGaps(chart);
  var defaultGapSize = (options['styleDefaults']['threeDEffect'] == 'on' ? DvtChartFunnelRenderer._DEFAULT_3D_GAP_RATIO : DvtChartFunnelRenderer._DEFAULT_2D_GAP_RATIO) * availSpace.w;
  var maxGapSize = Math.min(DvtChartFunnelRenderer._MAX_WIDTH_FOR_GAPS * availSpace.w / (seriesCount - 1), defaultGapSize);
  var gapSize = gapRatio * maxGapSize;

  var totalValue = 0; // the total value represented by the funnel
  var numDrawnSeries = 0; // to keep track of how many series are drawn, so we don't add too many gaps if there are zero values
  var cumulativeValue = 0; // keeping track of the total up to this series

  // Iterate through the data to calculate the total value
  for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
    // Skip the series if it shouldn't be rendered
    if (!DvtChartStyleUtils.isDataItemRendered(chart, seriesIndex))
      continue;

    // Do not render if the value is not positive
    var value = DvtChartDataUtils.getTargetValue(chart, seriesIndex);
    if (value == null)
      value = DvtChartDataUtils.getValue(chart, seriesIndex, DvtChartFunnelRenderer._GROUP_INDEX);
    if (value <= 0)
      continue;
    totalValue += value;
  }

  if (totalValue == 0)
    return false;

  // Iterate through the data
  for (var seriesIndex = seriesCount - 1; seriesIndex >= 0; seriesIndex--) {
    // Skip the series if it shouldn't be rendered
    if (!DvtChartStyleUtils.isDataItemRendered(chart, seriesIndex))
      continue;

    // Do not render if the value is not positive
    var value = DvtChartDataUtils.getValue(chart, seriesIndex, DvtChartFunnelRenderer._GROUP_INDEX);
    var targetValue = DvtChartDataUtils.getTargetValue(chart, seriesIndex);
    if ((value <= 0 && targetValue == null) || (targetValue != null && targetValue <= 0))
      continue;

    var slice;

    if (targetValue != null) {
      cumulativeValue += targetValue / totalValue;
      slice = new DvtChartFunnelSlice(chart, seriesIndex, numDrawnSeries, availSpace.w, availSpace.h, 1 - cumulativeValue, targetValue / totalValue, value / targetValue, gapSize);
    }
    else {
      cumulativeValue += value / totalValue;
      slice = new DvtChartFunnelSlice(chart, seriesIndex, numDrawnSeries, availSpace.w, availSpace.h, 1 - cumulativeValue, value / totalValue, null, gapSize);
    }

    numDrawnSeries++; // keeping track of how many series have been drawn to create the gap.
    container.addChild(slice);
    DvtChartObjPeer.associate(slice, chart, seriesIndex, DvtChartFunnelRenderer._GROUP_INDEX);
  }
  return true;
};
/**
 * Renderer for the reference objects of a dvt.Chart.
 * @class
 */
var DvtChartRefObjRenderer = new Object();

dvt.Obj.createSubclass(DvtChartRefObjRenderer, dvt.Obj);


/**
 * Renders the background reference objects.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} plotAreaBounds The bounds of the plot area.
 */
DvtChartRefObjRenderer.renderBackgroundObjects = function(chart, container, plotAreaBounds) {
  DvtChartRefObjRenderer._renderObjects(chart, container, plotAreaBounds, 'back');
};


/**
 * Renders the foreground reference objects.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} plotAreaBounds The bounds of the plot area.
 */
DvtChartRefObjRenderer.renderForegroundObjects = function(chart, container, plotAreaBounds) {
  DvtChartRefObjRenderer._renderObjects(chart, container, plotAreaBounds, 'front');
};


/**
 * Renders the reference objects for the given location.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} plotAreaBounds The bounds of the plot area.
 * @param {string} location The location of the reference objects.
 * @private
 */
DvtChartRefObjRenderer._renderObjects = function(chart, container, plotAreaBounds, location) {
  DvtChartRefObjRenderer._renderObjectsForAxis(chart, container, plotAreaBounds, location, chart.xAxis, DvtChartRefObjUtils.getAxisRefObjs(chart, 'x'));
  DvtChartRefObjRenderer._renderObjectsForAxis(chart, container, plotAreaBounds, location, chart.yAxis, DvtChartRefObjUtils.getAxisRefObjs(chart, 'y'));
  DvtChartRefObjRenderer._renderObjectsForAxis(chart, container, plotAreaBounds, location, chart.y2Axis, DvtChartRefObjUtils.getAxisRefObjs(chart, 'y2'));
};


/**
 * Renders the reference objects for the given location.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Container} container The container to render to.
 * @param {dvt.Rectangle} plotAreaBounds The bounds of the plot area.
 * @param {string} location The location of the reference objects.
 * @param {dvt.Axis} axis The axis corresponding to the reference objects.
 * @param {array} objects The array of reference objects.
 * @private
 */
DvtChartRefObjRenderer._renderObjectsForAxis = function(chart, container, plotAreaBounds, location, axis, objects) {
  if (!objects || !axis)
    return;

  // Loop through and render each reference object
  for (var i = 0; i < objects.length; i++) {
    var refObj = objects[i];

    if (!DvtChartRefObjUtils.isObjectRendered(chart, refObj)) {
      continue;
    }

    if (!refObj)
      continue;

    if (DvtChartRefObjUtils.getLocation(refObj) != location)
      continue;

    var shape;
    var type = DvtChartRefObjUtils.getType(refObj);
    if (type == 'area')
      shape = DvtChartRefObjRenderer._createReferenceArea(refObj, chart, plotAreaBounds, axis);
    else if (type == 'line')
      shape = DvtChartRefObjRenderer._createReferenceLine(refObj, chart, plotAreaBounds, axis);

    if (shape == null)
      continue;

    //  - HIDE & SHOW FOR REFERENCE OBJECTS
    // Associate for interactivity and tooltip support
    var axisType = (axis == chart.xAxis) ? 'xAxis' : ((axis == chart.yAxis) ? 'yAxis' : 'y2Axis');
    var refObjPeer = new DvtChartRefObjPeer(chart, [shape], refObj, i, axisType);
    chart.registerObject(refObjPeer);
    chart.getEventManager().associate(shape, refObjPeer);

    // Add the shape to the container
    container.addChild(shape);
  }
};


/**
 * Creates a reference area.
 * @param {object} refObj The options object for the reference area.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Rectangle} plotAreaBounds The bounds of the plot area.
 * @param {dvt.Axis} axis The axis corresponding to the reference area.
 * @return {dvt.Shape} The reference area.
 * @private
 */
DvtChartRefObjRenderer._createReferenceArea = function(refObj, chart, plotAreaBounds, axis) {
  var context = chart.getCtx();
  var position = axis.getPosition();
  var bHoriz = (position == 'top' || position == 'bottom');
  var bRadial = position == 'radial';
  var color = DvtChartRefObjUtils.getColor(refObj);
  var lineType = DvtChartRefObjUtils.getLineType(refObj);
  var shape;

  if (refObj['items'] != null && (axis == chart.yAxis || axis == chart.y2Axis)) { // REF AREA WITH MULTIPLE VALUES
    var items = refObj['items'];
    var highCoords = [];
    var lowCoords = [];

    // Match the number of items with the group count
    if (chart.xAxis.isGroupAxis()) {
      while (items.length < DvtChartDataUtils.getGroupCount(chart)) {
        items.push(null);
      }
    }

    // Build arrays of high/low axis coords
    for (var pointIndex = 0; pointIndex < items.length; pointIndex++) {
      var dataItem = items[pointIndex];
      var lVal = DvtChartRefObjUtils.getLowValue(dataItem);
      var hVal = DvtChartRefObjUtils.getHighValue(dataItem);
      if (lVal == null || hVal == null) {
        highCoords.push(new DvtChartCoord());
        lowCoords.push(new DvtChartCoord());
        continue;
      }

      // x is always the xCoord, and min and max along the yAxis
      var lCoord = axis.getUnboundedCoordAt(lVal);
      var hCoord = axis.getUnboundedCoordAt(hVal);
      var xCoord = chart.xAxis.getUnboundedCoordAt(DvtChartRefObjUtils.getXValue(chart, items, pointIndex));

      highCoords.push(new DvtChartCoord(xCoord, hCoord, hCoord));
      lowCoords.push(new DvtChartCoord(xCoord, lCoord, lCoord));
    }

    // Create the area shapes
    shape = new DvtChartLineArea(chart, true, plotAreaBounds, null, new dvt.SolidFill(color), null, lineType, highCoords, lineType, lowCoords);
  }

  else { // REF AREA WITH SINGLE VALUE
    var lowVal = DvtChartRefObjUtils.getLowValue(refObj);
    var highVal = DvtChartRefObjUtils.getHighValue(refObj);

    // Populate the default value if either low or high is missing or infinite
    if (lowVal == null || lowVal == -Infinity)
      lowVal = axis.getInfo().getGlobalMin();
    if (highVal == null || highVal == Infinity)
      highVal = axis.getInfo().getGlobalMax();

    // Find the coordinates
    var lowCoord = DvtChartRefObjRenderer._getAxisCoord(chart, axis, lowVal);
    var highCoord = DvtChartRefObjRenderer._getAxisCoord(chart, axis, highVal);

    if (DvtChartTypeUtils.isPolar(chart)) {
      var cmds;
      var cx = plotAreaBounds.x + plotAreaBounds.w / 2;
      var cy = plotAreaBounds.y + plotAreaBounds.h / 2;
      if (bRadial) {
        if (DvtChartAxisUtils.isGridPolygonal(chart)) { // draw polygonal donut
          var nSides = DvtChartDataUtils.getGroupCount(chart);
          var outerPoints = dvt.PolygonUtils.getRegularPolygonPoints(cx, cy, nSides, highCoord, 0, 1);
          var innerPoints = dvt.PolygonUtils.getRegularPolygonPoints(cx, cy, nSides, lowCoord, 0, 0);
          cmds = dvt.PathUtils.polyline(outerPoints) + dvt.PathUtils.polyline(innerPoints) + dvt.PathUtils.closePath();
        }
        else { // draw circular donut
          // To work around a chrome/safari bug, we draw two segments around each of the outer and inner arcs
          cmds = dvt.PathUtils.moveTo(cx, cy - highCoord) +
                 dvt.PathUtils.arcTo(highCoord, highCoord, Math.PI, 1, cx, cy + highCoord) +
                 dvt.PathUtils.arcTo(highCoord, highCoord, Math.PI, 1, cx, cy - highCoord) +
                 dvt.PathUtils.moveTo(cx, cy - lowCoord) +
                 dvt.PathUtils.arcTo(lowCoord, lowCoord, Math.PI, 0, cx, cy + lowCoord) +
                 dvt.PathUtils.arcTo(lowCoord, lowCoord, Math.PI, 0, cx, cy - lowCoord) +
                 dvt.PathUtils.closePath();
        }
      }
      else { // for tangential axis, draw circular segment. If polygonal, the shape will be clipped by the container.
        var radius = chart.getRadius();
        var pLow = DvtChartPlotAreaRenderer.polarToCartesian(radius, lowCoord, plotAreaBounds);
        var pHigh = DvtChartPlotAreaRenderer.polarToCartesian(radius, highCoord, plotAreaBounds);
        cmds = dvt.PathUtils.moveTo(cx, cy) +
               dvt.PathUtils.lineTo(pLow.x, pLow.y) +
               dvt.PathUtils.arcTo(radius, radius, highCoord - lowCoord, dvt.Agent.isRightToLeft(context) ? 0 : 1, pHigh.x, pHigh.y) +
               dvt.PathUtils.lineTo(pHigh.x, pHigh.y) +
               dvt.PathUtils.closePath();
      }
      shape = new dvt.Path(context, cmds);
    }
    else { // draw rectangle
      var points;
      if (bHoriz)
        points = [lowCoord, 0, highCoord, 0, highCoord, plotAreaBounds.h, lowCoord, plotAreaBounds.h];
      else
        points = [0, lowCoord, 0, highCoord, plotAreaBounds.w, highCoord, plotAreaBounds.w, lowCoord];
      shape = new dvt.Polygon(context, points);
    }
    shape.setSolidFill(color);
  }

  return shape;
};


/**
 * Creates a reference line.
 * @param {object} refObj The options object for the reference line.
 * @param {dvt.Chart} chart The chart being rendered.
 * @param {dvt.Rectangle} plotAreaBounds The bounds of the plot area.
 * @param {dvt.Axis} axis The axis corresponding to the reference line.
 * @return {dvt.Shape} The reference line.
 * @private
 */
DvtChartRefObjRenderer._createReferenceLine = function(refObj, chart, plotAreaBounds, axis) {
  var position = axis.getPosition();
  var bHoriz = (position == 'top' || position == 'bottom');
  var bRadial = position == 'radial';
  var bTangential = position == 'tangential';

  // Set style attributes
  var lineWidth = DvtChartRefObjUtils.getLineWidth(refObj);
  var lineType = DvtChartRefObjUtils.getLineType(refObj);
  var color = DvtChartRefObjUtils.getColor(refObj);
  var stroke = new dvt.SolidStroke(color, 1, lineWidth);
  if (refObj['lineStyle'])
    stroke.setStyle(dvt.Stroke.convertTypeString(refObj['lineStyle']));

  var context = chart.getCtx();
  var shape;

  if (refObj['items'] != null && (axis == chart.yAxis || axis == chart.y2Axis)) { // REF LINE WITH MULTIPLE VALUES
    var items = refObj['items'];
    var pointsArrays = [];
    var points = [];
    pointsArrays.push(points);

    // Match the number of items with the group count
    if (chart.xAxis.isGroupAxis()) {
      while (items.length < DvtChartDataUtils.getGroupCount(chart)) {
        items.push(null);
      }
    }

    // Build array of axis coords
    var coords = [];
    for (var pointIndex = 0; pointIndex < items.length; pointIndex++) {
      var dataItem = items[pointIndex];

      // Extract the value for the dataItem
      var value = null;
      if (dataItem != null) {
        if (typeof(dataItem) != 'object')
          value = dataItem;
        else if (dataItem['value'] != null)
          value = dataItem['value'];
      }

      if (value == null) {
        coords.push(new DvtChartCoord());
        continue;
      }

      // y is always along the xAxis, and value for yAxis
      var yCoord = axis.getUnboundedCoordAt(value);
      var xCoord = chart.xAxis.getUnboundedCoordAt(DvtChartRefObjUtils.getXValue(chart, items, pointIndex));
      coords.push(new DvtChartCoord(xCoord, yCoord, yCoord));
    }

    // Create line shapes
    shape = new DvtChartLineArea(chart, false, plotAreaBounds, null, null, stroke, lineType, coords);
  }

  else if (refObj['value']) { // REF LINE WITH SINGLE VALUE
    var lineCoord = DvtChartRefObjRenderer._getAxisCoord(chart, axis, refObj['value']);

    // Don't continue if the line is outside of the axis
    if (lineCoord == null || lineCoord == Infinity || lineCoord == -Infinity)
      return null;

    var cx = plotAreaBounds.x + plotAreaBounds.w / 2;
    var cy = plotAreaBounds.y + plotAreaBounds.h / 2;
    if (bRadial) {
      if (DvtChartAxisUtils.isGridPolygonal(chart)) {
        var points = dvt.PolygonUtils.getRegularPolygonPoints(cx, cy, DvtChartDataUtils.getGroupCount(chart), lineCoord, 0);
        shape = new dvt.Polygon(context, points);
      }
      else
        shape = new dvt.Circle(context, cx, cy, lineCoord);
      shape.setFill(null);
    }
    else if (bTangential) {
      var cartesian = DvtChartPlotAreaRenderer.polarToCartesian(chart.getRadius(), lineCoord, plotAreaBounds);
      shape = new dvt.Line(context, cx, cy, cartesian.x, cartesian.y);
    }
    else {
      if (bHoriz)
        shape = new dvt.Line(context, lineCoord, 0, lineCoord, plotAreaBounds.h);
      else
        shape = new dvt.Line(context, 0, lineCoord, plotAreaBounds.w, lineCoord);
      shape.setPixelHinting(true);
    }
    shape.setStroke(stroke);
  }

  else // no line created
    return null;

  return shape;
};


/**
 * Returns the coordinate of the specified value on the axis.  If the coordinate cannot be located, then returns null.
 * @param {dvt.Chart} chart
 * @param {dvt.Axis} axis The axis corresponding to the reference object.
 * @param {object} value The value whose coordinate will be returned.
 * @return {number}
 * @private
 */
DvtChartRefObjRenderer._getAxisCoord = function(chart, axis, value) {
  if (axis.isGroupAxis()) {
    // For group axis, find the index of the group and pass it to the axis
    var index = DvtChartDataUtils.getGroupIndex(chart, value);
    if (index >= 0)
      return axis.getUnboundedCoordAt(index);
  }

  // If value is number, treat is as the group index for group axis
  if (!isNaN(value))
    return axis.getUnboundedCoordAt(value);

  return null;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.

/**
 * Spark chart component.  This chart should never be instantiated directly.  Use the
 * newInstance function instead.
 * @class
 * @constructor
 * @extends {dvt.BaseComponent}
 */
dvt.SparkChart = function() {};

dvt.Obj.createSubclass(dvt.SparkChart, dvt.BaseComponent);


/**
 * Returns a new instance of dvt.SparkChart.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @return {dvt.SparkChart}
 */
dvt.SparkChart.newInstance = function(context, callback, callbackObj) {
  var sparkChart = new dvt.SparkChart();
  sparkChart.Init(context, callback, callbackObj);
  return sparkChart;
};


/**
 * Returns a copy of the default options for the specified skin.
 * @param {string} skin The skin whose defaults are being returned.
 * @return {object} The object containing defaults for this component.
 */
dvt.SparkChart.getDefaults = function(skin) 
{
  return (new DvtSparkChartDefaults()).getDefaults(skin);
};


/**
 * @override
 */
dvt.SparkChart.prototype.Init = function(context, callback, callbackObj) {
  dvt.SparkChart.superclass.Init.call(this, context, callback, callbackObj);

  // Create the defaults object
  this.Defaults = new DvtSparkChartDefaults();

  // Create the event handler and add event listeners
  this._eventManager = new DvtSparkChartEventManager(this);
  this._eventManager.addListeners(this);

  // Create the underlying chart instance for the component
  this._chart = dvt.Chart.newInstance(context, this._onRenderEnd, this);
  this.addChild(this._chart);

  // Set up keyboard handler on non-touch devices
  if (!dvt.Agent.isTouchDevice()) {
    // Add a keyboard handler to the spark chart itself so it can show tooltip on it
    this._eventManager.setKeyboardHandler(new dvt.KeyboardHandler(this._eventManager, this));
  }

  // Create the masking shape used for the tooltip
  this._tooltipMask = new dvt.Rect(context);
  this.addChild(this._tooltipMask);

  // Make sure the object has an id for clipRect naming
  this.setId('sparkChart' + 1000 + Math.floor(Math.random() * 1000000000));//@RandomNumberOk
};


/**
 * @override
 */
dvt.SparkChart.prototype.SetOptions = function(options) {
  if (options) {
    // Combine the user options with the defaults and store
    this.Options = this.Defaults.calcOptions(options);

    // Disable animation for canvas and xml
    if (!dvt.Agent.isEnvironmentBrowser()) {
      this.Options['animationOnDisplay'] = 'none';
      this.Options['animationOnDataChange'] = 'none';
    }
  }
  else if (!this.Options)
    this.Options = this.GetDefaults();
};


/**
 * @override
 */
dvt.SparkChart.prototype.setId = function(id) {
  dvt.SparkChart.superclass.setId.call(this, id);
  if (this._chart)
    this._chart.setId(id + 'chart');
};


/**
 * @override
 */
dvt.SparkChart.prototype.render = function(options, width, height) 
{
  // Update if a new options object has been provided or initialize with defaults if needed.
  this.SetOptions(options);

  // Update the store width and height if provided
  if (!isNaN(width) && !isNaN(height)) {
    this.Width = width;
    this.Height = height;
  }
  this._eventReceived = false;
  this._isDoneRendering = false;

  // Render the spark chart
  DvtSparkChartRenderer.render(this, this.Width, this.Height);

  // Apply the tooltip
  var tooltip = this.Options['shortDesc'];
  this._tooltipMask.setWidth(this.Width);
  this._tooltipMask.setHeight(this.Height);
  this._tooltipMask.setInvisibleFill();
  if (tooltip) {
    this._peer = new dvt.SimpleObjPeer(null, tooltip, this.Options['color']);
    this._eventManager.associate(this._tooltipMask, this._peer);
  }
  else
    this._peer = null;

  if (this.Options['_selectingCursor']) {
    this.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
  }

  this.UpdateAriaAttributes();

  if (this._eventReceived) {
    this.RenderComplete();
  }
  this._isDoneRendering = true;
};

/**
 * Sending the ready event at the end of a render.
 * @param {dvt.BaseEvent} event
 * @private
 */
dvt.SparkChart.prototype._onRenderEnd = function(event) {
  this._eventReceived = true;

  if (event['type'] == 'ready' && this._isDoneRendering) {
    this.RenderComplete();
  }
};

/**
 * Returns the underlying chart instance for the component.
 * @return {dvt.Chart} The underlying chart instance for this component.
 */
dvt.SparkChart.prototype.__getChart = function() {
  return this._chart;
};

/**
 * Returns the automation object for this sparkChart
 * @return {dvt.Automation} The automation object
 */
dvt.SparkChart.prototype.getAutomation = function() {
  return new DvtSparkChartAutomation(this);
};



/**
 * @override
 */
dvt.SparkChart.prototype.GetComponentDescription = function() {
  return dvt.Bundle.getTranslation(this.getOptions(), 'componentName', dvt.Bundle.UTIL_PREFIX, 'CHART');
};

/**
 * @override
 */
dvt.SparkChart.prototype.UpdateAriaAttributes = function() {
  var desc = dvt.Displayable.generateAriaLabel(dvt.StringUtils.processAriaLabel(this.GetComponentDescription()),
      this.Options['shortDesc'] ? [this.Options['shortDesc']] : null);
  if (this.IsParentRoot()) {
    this.getCtx().setAriaRole('img');
    this.getCtx().setAriaLabel(dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'COLON_SEP_LIST',
        [dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'DATA_VISUALIZATION'), desc]));
  }
  else {
    this.setAriaRole('img');
    this.setAriaProperty('label', desc);
  }
};

/**
 * @override
 */
dvt.SparkChart.prototype.getEventManager = function() {
  return this._eventManager;
};


/**
 * Returns the logical object corresponding to the spark chart
 * @return {Object}
 */
dvt.SparkChart.prototype.__getLogicalObject = function()
{
  return this._peer;
};
/**
 *  Provides automation services for a DVT component.
 *  @class DvtSparkChartAutomation
 *  @param {dvt.SparkChart} dvtComponent
 *  @implements {dvt.Automation}
 *  @constructor
 */
var DvtSparkChartAutomation = function(dvtComponent) {
  this._sparkChart = dvtComponent;
};

dvt.Obj.createSubclass(DvtSparkChartAutomation, dvt.Automation);


/**
 * Returns an object containing data for a spark chart data item. Used for verification.
 * Valid verification values inlcude:
 * <ul>
 * <li>borderColor</li>
 * <li>color</li>
 * <li>date</li>
 * <li>floatValue</li>
 * <li>value/li>
 * </ul>
 * @param {String} itemIndex The index for a sparkChart dataItem
 * @return {Object} An object containing data for the dataItem
 */
DvtSparkChartAutomation.prototype.getDataItem = function(itemIndex) {
  // Retrieve the information from the chart automation.
  var chart = this._sparkChart.__getChart();
  var dataItem = chart.getAutomation().getDataItem(0, itemIndex);

  // Population the spark automation results.
  if (dataItem) {
    return {
      'borderColor' : dataItem['borderColor'],
      'color' : dataItem['color'],
      'date' : dataItem['x'],
      'low' : dataItem['low'],
      'high': dataItem['high'],
      'value': (dataItem['low'] == null || dataItem['high'] == null) ? dataItem['value'] : dataItem['high'] - dataItem['low']
    };
  }
  return null;
};
/**
 * Default values and utility functions for chart versioning.
 * @class
 * @constructor
 * @extends {dvt.BaseComponentDefaults}
 */
var DvtSparkChartDefaults = function() {
  this.Init({'skyros': DvtSparkChartDefaults.VERSION_1, 'alta': DvtSparkChartDefaults.SKIN_ALTA});
};

dvt.Obj.createSubclass(DvtSparkChartDefaults, dvt.BaseComponentDefaults);


/**
 * Contains overrides for the 'alta' skin.
 */
DvtSparkChartDefaults.SKIN_ALTA = {
  'skin': dvt.CSSStyle.SKIN_ALTA,
  'color': '#267db3'
};


/**
 * Defaults for version 1.
 */
DvtSparkChartDefaults.VERSION_1 = {
  'skin': dvt.CSSStyle.SKIN_SKYROS,
  'type': 'line',
  'animationOnDisplay': 'none',
  'animationOnDataChange': 'none',
  'emptyText': null,
  'color': '#666699',
  'firstColor': null,
  'lastColor': null,
  'highColor': null,
  'lowColor': null,
  'visualEffects': 'auto',
  'baselineScaling': 'min',
  'barSpacing': 'auto',
  'lineWidth': 1,
  'lineStyle': 'solid',
  'lineType': 'straight',
  'markerSize': 5,
  'markerShape': 'auto',
  'barGapRatio': 0.25,
  '_statusMessageStyle': new dvt.CSSStyle('font-size: 12px; color: #404259;')
};
/**
 * Event Manager for dvt.SparkChart.
 * @param {dvt.SparkChart} sparkChart
 * @class
 * @extends {dvt.EventManager}
 * @constructor
 */
var DvtSparkChartEventManager = function(sparkChart) {
  this.Init(sparkChart.getCtx(), sparkChart.dispatchEvent, sparkChart);
  this._sparkChart = sparkChart;
};

dvt.Obj.createSubclass(DvtSparkChartEventManager, dvt.EventManager);


/**
 * @override
 */
DvtSparkChartEventManager.prototype.ProcessKeyboardEvent = function(event) 
{
  if (!this.KeyboardHandler)
    return false;

  if (event.keyCode == dvt.KeyboardEvent.TAB) {
    var pos = this._sparkChart.getCtx().getStageAbsolutePosition();
    this.ProcessObjectTooltip(event, pos.x, pos.y, this._sparkChart.__getLogicalObject(), this._sparkChart);
  }

  return false;
};

/**
 * @override
 */
DvtSparkChartEventManager.prototype.OnBlur = function(event) {
  DvtSparkChartEventManager.superclass.OnBlur.call(this, event);
  this.hideTooltip();
};
/**
 * Renderer for dvt.SparkChart.
 * @class
 */
var DvtSparkChartRenderer = new Object();

dvt.Obj.createSubclass(DvtSparkChartRenderer, dvt.Obj);


/**
 * @this {DvtSparkChartRenderer}
 * Renders the spark chart in the specified area.
 * @param {dvt.SparkChart} spark The spark chart being rendered.
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 */
DvtSparkChartRenderer.render = function(spark, width, height) {
  // Convert spark options into chart options
  var chart = spark.__getChart();
  var chartOptions = DvtSparkChartRenderer._convertOptionsObj(spark);

  // Allocate a gap for markers if they are enabled.
  var options = spark.getOptions();
  if (options['type'] == 'area' || options['type'] == 'line' || options['type'] == 'lineWithArea')
  {
    var items = DvtSparkChartRenderer._getDataItems(spark);
    var hasMarkers = false;

    // Look for the first/last/high/lowColor attributes, which cause markers to display
    if (options['firstColor'] || options['lastColor'] || options['highColor'] || options['lowColor'])
      hasMarkers = true;
    else {
      // Loop through the data to look for markerDisplayed
      for (var i = 0; i < items.length; i++) {
        if (items[i] && items[i]['markerDisplayed'] == 'on') {
          hasMarkers = true;
          break;
        }
      }
    }

    // Allocate the gap if markers were found
    if ((hasMarkers && items.length > 0) || options['lineType'] == 'none') {
      var markerGap = options['markerSize'] / 2;
      width -= 2 * markerGap;
      height -= 2 * markerGap;
      chart.setTranslate(markerGap, markerGap);
    }
  }

  // Render the chart
  chart.render(chartOptions, width, height);
};


/**
 * Returns the array of spark data items.
 * @param {dvt.SparkChart} spark
 * @return {array}
 * @private
 */
DvtSparkChartRenderer._getDataItems = function(spark) {
  var options = spark.getOptions();
  return (options && options['items']) ? options['items'] : [];
};


/**
 * Converts the spark chart options object into a chart options object.
 * @param {dvt.SparkChart} spark The spark chart.
 * @return {object} The resulting chart options object.
 * @private
 */
DvtSparkChartRenderer._convertOptionsObj = function(spark) {
  var options = spark.getOptions();
  var chartOptions = {'styleDefaults': {}, 'xAxis': {}, 'yAxis': {}, 'groups': []};

  // Translations
  chartOptions['translations'] = options['translations'];

  //**************************** Data Attributes *****************************/
  var bFloatingBar = (options['type'] == 'floatingBar');
  var chartItems = [];

  // Loop through the data
  var highIndex = -1;
  var lowIndex = -1;
  var highValue = -Infinity;
  var lowValue = Infinity;
  var items = DvtSparkChartRenderer._getDataItems(spark);
  for (var i = 0; i < items.length; i++) {
    var item = items[i];

    // Parse the spark data item properties
    var chartItem = {};
    if (item instanceof Object) {
      if (bFloatingBar) {
        // floating bar support for backwards compat
        chartItem['low'] = item['floatValue'];
        chartItem['high'] = item['floatValue'] + item['value'];
      }
      else {
        chartItem['value'] = item['value'];
        chartItem['low'] = item['low'];
        chartItem['high'] = item['high'];
      }

      // Time Axis Support
      if (item['date']) {
        chartOptions['timeAxisType'] = 'enabled';
        chartOptions['groups'].push(item['date']);
      }

      if (item['markerDisplayed'] == 'on')
        chartItem['markerDisplayed'] = 'on';

      if (item['color'])
        chartItem['color'] = item['color'];

      if (item['borderColor'])
        chartItem['borderColor'] = item['borderColor'];

      if (item['markerShape'])
        chartItem['markerShape'] = item['markerShape'];

      if (item['markerSize'])
        chartItem['markerSize'] = item['markerSize'];
    }
    else {
      // Item is just the value, wrap and push onto the array.
      chartItem['value'] = item;
    }

    // Push onto the array
    chartItems.push(chartItem);

    // Keep track of low and high values
    var topValue = chartItem['value'] != null ? chartItem['value'] : Math.max(chartItem['low'], chartItem['high']);
    if (highValue < topValue) {
      highValue = topValue;
      highIndex = i;
    }

    var baseValue = chartItem['value'] != null ? chartItem['value'] : Math.min(chartItem['low'], chartItem['high']);
    if (lowValue > baseValue) {
      lowValue = baseValue;
      lowIndex = i;
    }
  }

  // First/Last/High/LowColor Support: Process high and low first since they take precedence
  if (options['highColor'] && highIndex >= 0) {
    chartItems[highIndex]['markerDisplayed'] = 'on';
    if (!chartItems[highIndex]['color'])
      chartItems[highIndex]['color'] = options['highColor'];
  }

  if (options['lowColor'] && lowIndex >= 0) {
    chartItems[lowIndex]['markerDisplayed'] = 'on';
    if (!chartItems[lowIndex]['color'])
      chartItems[lowIndex]['color'] = options['lowColor'];
  }

  if (options['firstColor'] && chartItems.length > 0) {
    chartItems[0]['markerDisplayed'] = 'on';
    if (!chartItems[0]['color'])
      chartItems[0]['color'] = options['firstColor'];
  }

  if (options['lastColor'] && chartItems.length > 0) {
    chartItems[chartItems.length - 1]['markerDisplayed'] = 'on';
    if (!chartItems[chartItems.length - 1]['color'])
      chartItems[chartItems.length - 1]['color'] = options['lastColor'];
  }

  // Add the data items into a data object
  chartOptions['series'] = [{'items': chartItems, 'areaColor': options['areaColor']}];

  // Reference Objects
  if (options['referenceObjects'])
    chartOptions['yAxis']['referenceObjects'] = options['referenceObjects'];

  //**************************** Style Attributes ****************************/
  chartOptions['__spark'] = true;

  // barSpacing default is based on device
  var barSpacing = options['barSpacing'];
  if (barSpacing == 'auto')
    barSpacing = dvt.Agent.getDevicePixelRatio() > 1 ? 'subpixel' : 'pixel';
  chartOptions['__sparkBarSpacing'] = barSpacing;

  chartOptions['type'] = bFloatingBar ? 'bar' : options['type'];
  chartOptions['animationOnDataChange'] = options['animationOnDataChange'];
  chartOptions['animationOnDisplay'] = options['animationOnDisplay'];
  chartOptions['emptyText'] = options['emptyText'];

  chartOptions['styleDefaults']['colors'] = [options['color']];
  chartOptions['styleDefaults']['animationDuration'] = options['animationDuration'];
  chartOptions['styleDefaults']['animationIndicators'] = 'none';
  chartOptions['styleDefaults']['lineWidth'] = options['lineWidth'];
  chartOptions['styleDefaults']['lineStyle'] = options['lineStyle'];
  chartOptions['styleDefaults']['lineType'] = options['lineType'];
  chartOptions['styleDefaults']['markerSize'] = options['markerSize'];
  chartOptions['styleDefaults']['markerShape'] = options['markerShape'];
  chartOptions['styleDefaults']['barGapRatio'] = options['barGapRatio'];
  chartOptions['styleDefaults']['dataItemGaps'] = '0%';

  chartOptions['xAxis']['rendered'] = 'off';
  chartOptions['yAxis']['rendered'] = 'off';

  // Set Y-axis min and max
  var zeroBaseline = options['baselineScaling'] == 'zero';
  var axisGap = (highValue != lowValue) ? (highValue - lowValue) * 0.1 : Math.abs(highValue) * 0.1;
  chartOptions['yAxis']['min'] = (zeroBaseline && lowValue >= 0) ? 0 : lowValue - axisGap;
  chartOptions['yAxis']['max'] = (zeroBaseline && highValue <= 0) ? 0 : highValue + axisGap;

  // Visual Effects Support: Only for areas because gradients don't show up nicely for small bars
  if (options['visualEffects'] == 'none' || !(options['type'] == 'area' || options['type'] == 'lineWithArea'))
    chartOptions['styleDefaults']['seriesEffect'] = 'color';
  else
    chartOptions['styleDefaults']['seriesEffect'] = 'gradient';

  // Remove Gaps
  chartOptions['layout'] = {'gapWidthRatio': 0, 'gapHeightRatio': 0};

  // Disable Legend
  chartOptions['legend'] = {'rendered': 'off'};

  // Empty Text Style
  chartOptions['_statusMessageStyle'] = options['_statusMessageStyle'];

  return chartOptions;
};
dvt.exportProperty(dvt, 'Chart', dvt.Chart);
dvt.exportProperty(dvt.Chart, 'newInstance', dvt.Chart.newInstance);
dvt.exportProperty(dvt.Chart.prototype, 'destroy', dvt.Chart.prototype.destroy);
dvt.exportProperty(dvt.Chart.prototype, 'getAutomation', dvt.Chart.prototype.getAutomation);
dvt.exportProperty(dvt.Chart.prototype, 'getDefaults', dvt.Chart.prototype.getDefaults);
dvt.exportProperty(dvt.Chart.prototype, 'getValuesAt', dvt.Chart.prototype.getValuesAt);
dvt.exportProperty(dvt.Chart.prototype, 'highlight', dvt.Chart.prototype.highlight);
dvt.exportProperty(dvt.Chart.prototype, 'positionDataCursor', dvt.Chart.prototype.positionDataCursor);
dvt.exportProperty(dvt.Chart.prototype, 'render', dvt.Chart.prototype.render);
dvt.exportProperty(dvt.Chart.prototype, 'select', dvt.Chart.prototype.select);

dvt.exportProperty(DvtChartAutomation.prototype, 'getDomElementForSubId', DvtChartAutomation.prototype.getDomElementForSubId);
dvt.exportProperty(DvtChartAutomation.prototype, 'getDataItem', DvtChartAutomation.prototype.getDataItem);
dvt.exportProperty(DvtChartAutomation.prototype, 'getGroup', DvtChartAutomation.prototype.getGroup);
dvt.exportProperty(DvtChartAutomation.prototype, 'getSeries', DvtChartAutomation.prototype.getSeries);
dvt.exportProperty(DvtChartAutomation.prototype, 'getGroupCount', DvtChartAutomation.prototype.getGroupCount);
dvt.exportProperty(DvtChartAutomation.prototype, 'getSeriesCount', DvtChartAutomation.prototype.getSeriesCount);
dvt.exportProperty(DvtChartAutomation.prototype, 'getTitle', DvtChartAutomation.prototype.getTitle);
dvt.exportProperty(DvtChartAutomation.prototype, 'getLegend', DvtChartAutomation.prototype.getLegend);
dvt.exportProperty(DvtChartAutomation.prototype, 'getPlotArea', DvtChartAutomation.prototype.getPlotArea);
dvt.exportProperty(DvtChartAutomation.prototype, 'getXAxis', DvtChartAutomation.prototype.getXAxis);
dvt.exportProperty(DvtChartAutomation.prototype, 'getYAxis', DvtChartAutomation.prototype.getYAxis);
dvt.exportProperty(DvtChartAutomation.prototype, 'getY2Axis', DvtChartAutomation.prototype.getY2Axis);

dvt.exportProperty(DvtChartDataItem.prototype, 'getId', DvtChartDataItem.prototype.getId);
dvt.exportProperty(DvtChartDataItem.prototype, 'getSeries', DvtChartDataItem.prototype.getSeries);
dvt.exportProperty(DvtChartDataItem.prototype, 'getGroup', DvtChartDataItem.prototype.getGroup);

dvt.exportProperty(dvt, 'SparkChart', dvt.SparkChart);
dvt.exportProperty(dvt.SparkChart, 'newInstance', dvt.SparkChart.newInstance);
dvt.exportProperty(dvt.SparkChart.prototype, 'destroy', dvt.SparkChart.prototype.destroy);
dvt.exportProperty(dvt.SparkChart.prototype, 'getAutomation', dvt.SparkChart.prototype.getAutomation);
dvt.exportProperty(dvt.SparkChart.prototype, 'getDefaults', dvt.SparkChart.prototype.getDefaults);
dvt.exportProperty(dvt.SparkChart.prototype, 'render', dvt.SparkChart.prototype.render);

dvt.exportProperty(DvtSparkChartAutomation.prototype, 'getDataItem', DvtSparkChartAutomation.prototype.getDataItem);
})(dvt);

  return dvt;
});
