/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit', './DvtPanZoomCanvas'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

/**
 * @export
 */
dvt.AmxThematicMap = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

dvt.Obj.createSubclass(dvt.AmxThematicMap, dvt.Container);

dvt.AmxThematicMap._LEGEND_COMPONET_GAP = 10;

dvt.AmxThematicMap.prototype.Init = function(context, callback, callbackObj) {
  dvt.AmxThematicMap.superclass.Init.call(this, context);
  this._tmap = new dvt.ThematicMap(context, callback, callbackObj);
  this._tmapContainer = new dvt.Container(context);
  this._tmapContainer.addChild(this._tmap);
  this.addChild(this._tmapContainer);
  this.Defaults = new DvtThematicMapDefaults();
};


/**
 * Returns a new instance of dvt.AmxThematicMap.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @return {dvt.AmxThematicMap}
 * @export
 */
dvt.AmxThematicMap.newInstance = function(context, callback, callbackObj) {
  return new dvt.AmxThematicMap(context, callback, callbackObj);
};


/**
 * Renders the component with the specified data.  If no data is supplied to a component
 * that has already been rendered, the component will be rerendered to the specified size.
 * @param {object} options The object containing options for this component.
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 * @export
 */
dvt.AmxThematicMap.prototype.render = function(options, width, height) {
  this.Options = this.Defaults.calcOptions(options);
  this._width = width;
  this._height = height;

  // render legend
  var availSpace = new dvt.Rectangle(0, 0, width, height);
  this._renderLegend(this, availSpace);
  // render thematic map
  this._tmap.render(options, availSpace.w, availSpace.h);
};


/**
 * Renders legend and updates the available space.
 * @param {DvtChartImpl} chart The chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space.
 */
dvt.AmxThematicMap.prototype._renderLegend = function(container, availSpace) {
  //remove old legend
  if (this._legend) {
    container.removeChild(this._legend);
    this._legend = null;
  }

  var availLegendSpace = new dvt.Rectangle(dvt.AmxThematicMap._LEGEND_COMPONET_GAP, dvt.AmxThematicMap._LEGEND_COMPONET_GAP,
      availSpace.w - 2 * dvt.AmxThematicMap._LEGEND_COMPONET_GAP, availSpace.h - 2 * dvt.AmxThematicMap._LEGEND_COMPONET_GAP);

  var options = this.Options;

  var rendered = options['legend']['rendered'];
  var scrolling = options['legend']['scrolling'];

  // Create the options object for the legend
  var legendOptions = dvt.JsonUtils.clone(options['legend']);
  this._addLegendData(this.Options, legendOptions);

  // Done not rendered or nothing to render
  var legendSections = legendOptions['sections'];
  if (!rendered || (legendSections && legendSections.length == 0))
    return;

  var position = options['legend']['position'];
  delete legendOptions['position'];
  legendOptions['layout']['gapRatio'] = this.getGapRatio();
  legendOptions['hideAndShowBehavior'] = 'none';
  legendOptions['rolloverBehavior'] = 'none';
  legendOptions['scrolling'] = options['legend']['scrolling'];

  // Create and add the legend to the display list for calc and rendering
  // TODO handle chart event procissing i.e. hide show/ rollover
  var legend = dvt.Legend.newInstance(this._tmap.getCtx());
  container.addChild(legend);

  var maxWidth;
  var maxHeight;

  // Evaluate the automatic position
  // If scrolling is off, default legend position to bottom
  if (position == 'auto' && scrolling !== 'asNeeded') {
    position = 'bottom';
  }
  // If scrolling is on, auto will always render vertical legend
  else if (position == 'auto' && scrolling == 'asNeeded') {
    position = 'end';
  }

  // Convert "start" and "end" to absolute position
  var isRTL = dvt.Agent.isRightToLeft(container.getCtx());
  if (position == 'start')
    position = isRTL ? 'right' : 'left';
  else if (position == 'end')
    position = isRTL ? 'left' : 'right';

  // Add legend orientation
  legendOptions['orientation'] = (position == 'left' || position == 'right' ? 'vertical' : 'horizontal');

  // Evaluate non-auto position
  var isHoriz = (position == 'top' || position == 'bottom');
  maxWidth = isHoriz ? availLegendSpace.w : options['layout']['legendMaxSize'] * availLegendSpace.w;
  maxHeight = isHoriz ? options['layout']['legendMaxSize'] * availLegendSpace.h : availLegendSpace.h;
  var actualSize = legend.getPreferredSize(legendOptions, maxWidth, maxHeight);

  if (actualSize.w > 0 && actualSize.h > 0) {
    legend.render(legendOptions, actualSize.w, actualSize.h);
    this._legend = legend;
    var gap = DvtThematicMapDefaults.getGapSize(this, options['layout']['legendGap']);
    dvt.LayoutUtils.position(availLegendSpace, position, legend, actualSize.w, actualSize.h, gap);

    // update availSpace
    switch (position) {
      case 'top':
        this._tmapContainer.setTranslateY(actualSize.h + dvt.AmxThematicMap._LEGEND_COMPONET_GAP);
      case 'bottom':
        availSpace.h = availSpace.h - (actualSize.h + dvt.AmxThematicMap._LEGEND_COMPONET_GAP);
        break;
      case 'left':
        this._tmapContainer.setTranslateX(actualSize.w + dvt.AmxThematicMap._LEGEND_COMPONET_GAP);
      case 'right':
        availSpace.w = availSpace.w - (actualSize.w + dvt.AmxThematicMap._LEGEND_COMPONET_GAP);
        break;
      default:
        break;
    }
  }
};

dvt.AmxThematicMap.prototype.getGapRatio = function() {
  // If defined in the options, use that instead
  if (this.Options['layout']['gapRatio'] !== null && !isNaN(this.Options['layout']['gapRatio']))
    return this.Options['layout']['gapRatio'];
  else {
    var wRatio = Math.min(this._width / 400, 1);
    var hRatio = Math.min(this._height / 300, 1);
    return Math.min(wRatio, hRatio);
  }
};


/**
 * Added data into the options object to be passed to the legend.
 * @param {DvtChartImpl} chart The chart whose data will be passed to the legend.
 * @param {object} legendOptions The legend options object into which data will be added.
 * @return {object} The data object for the chart's legend.
 */
dvt.AmxThematicMap.prototype._addLegendData = function(data, legendOptions) {
  legendOptions['title'] = data['legend'] ? data['legend']['title'] : null;
  legendOptions['sections'] = [];

  if (data && data['legend'] && data['legend']['sections']) {
    // Iterate through any sections defined with attribute groups
    for (var i = 0; i < data['legend']['sections'].length; i++) {
      var dataSection = data['legend']['sections'][i];
      if (dataSection)
        legendOptions['sections'].push({'title': dataSection['title'], 'items': dataSection['items'], 'sections': dataSection['sections']});
    }
  }

  return legendOptions;
};
/**
 * DVT Toolkit based thematic map component
 * @extends {dvt.Container}
 * @class DVT Toolkit based thematic map component
 * @constructor
 * @export
 */
dvt.ThematicMap = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

dvt.Obj.createSubclass(dvt.ThematicMap, dvt.PanZoomComponent);
/**
 * @const
 * @private
 */
dvt.ThematicMap._FEATURES_OFF_PAN = 1;
/**
 * @const
 * @private
 */
dvt.ThematicMap._FEATURES_OFF_ZOOM = 2;
/**
 * @const
 * @private
 */
dvt.ThematicMap._FEATURES_OFF_PAN_ZOOM = 3;
/**
 * @const
 * @private
 */
dvt.ThematicMap._FEATURES_OFF_ZOOMTOFIT = 4;
/**
 * @const
 * @private
 */
dvt.ThematicMap._FEATURES_OFF_PAN_ZOOMTOFIT = 5;
/**
 * @const
 * @private
 */
dvt.ThematicMap._FEATURES_OFF_ZOOM_ZOOMTOFIT = 6;
/**
 * @const
 * @private
 */
dvt.ThematicMap._FEATURES_OFF_ALL = 7;
/**
 * @const
 * @private
 */
dvt.ThematicMap._COLLAPSIBLE_PANEL_OFFSET = 5;
/**
 * @const
 * @private
 */
dvt.ThematicMap._ELEM_RESOURCES_CONTROLPANEL = 'controlPanelResources';
/**
 * @const
 * @private
 */
dvt.ThematicMap._ELEM_RESOURCES_LEGEND = 'legendResources';
/**
 * @const
 * @private
 */
dvt.ThematicMap._ELEM_RESOURCES_PANEL_DRAWER = 'panelDrawerResources';
/**
 * @const
 * @private
 */
dvt.ThematicMap._ELEM_RESOURCES = 'resources';
/**
 * @const
 */
dvt.ThematicMap.DEFAULT_MAX_ZOOM_FACTOR = 6;


/**
 * Initializes the thematicMap
 * @param {dvt.Context} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {AdfDhtmlThematicMapPeer} callbackObj The object to dispatch component events to
 * @protected
 */
dvt.ThematicMap.prototype.Init = function(context, callback, callbackObj) {
  dvt.ThematicMap.superclass.Init.call(this, context, callback, callbackObj);
  this._createHandlers();

  this._layers = [];
  this._drillAnimFadeOutObjs = [];

  this._legend = null;
  this._legendPanel = null;
  this._legendData = null;
  this._legendButtonImages = null;

  this._bBaseMapChanged = false;
  this._drilledRowKeys = [];
  this._initDrilled = new Object();
  this._processingInitDrilled = false;
  this._drillDataLayer = new Object();

  this._childToParent = new Object();
  this._drilled = [];

  this._areaLayers = new dvt.Container(this.getCtx());
  this._dataAreaLayers = new dvt.Container(this.getCtx());
  this._dataPointLayers = new dvt.Container(this.getCtx());
  this._labelLayers = new dvt.Container(this.getCtx());

  this._initialZooming = false;
  this._zooming = false;
  this._panning = false;
  this._maxZoomFactor = dvt.ThematicMap.DEFAULT_MAX_ZOOM_FACTOR;
  this._isMarkerZoomBehaviorFixed = true;
  this._selectedAreas = {};

  this._bListenersRemoved = false;
  this._showPopupBehaviors = null;

  this.setDisplayedControls(dvt.ControlPanel.CONTROLS_ALL);

  this.Defaults = new DvtThematicMapDefaults();
  this._eventHandler.associate(this, this);
  this._bRendered = false;
};


/**
 * Returns a new instance of DvtJsonThematicMap. Currently only called by json supported platforms.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @return {dvt.ThematicMap}
 * @export
 */
dvt.ThematicMap.newInstance = function(context, callback, callbackObj) {
  return new dvt.ThematicMap(context, callback, callbackObj);
};


/**
 * @override
 */
dvt.ThematicMap.prototype.SetOptions = function(options) {
  dvt.ThematicMap.superclass.SetOptions.call(this, options);
  if (!dvt.Agent.isEnvironmentBrowser()) {
    this.Options['animationOnDisplay'] = 'none';
    this.Options['animationOnMapChange'] = 'none';
    this.Options['animationOnDrill'] = 'none';
  }

  var parser = new DvtThematicMapJsonParser(this);
  parser.parse(this.Options);
};


/**
 * Sets the style defaults for this component.
 * @param {Object} defaults The json object containing style defaults
 */
dvt.ThematicMap.prototype.setStyleDefaults = function(defaults) {
  this._styleDefaults = defaults;
};


/**
 * Returns the style defaults for this component.
 * @return {Object} The json object containing style defaults
 */
dvt.ThematicMap.prototype.getStyleDefaults = function() {
  return this._styleDefaults;
};

dvt.ThematicMap.prototype.getMaxZoomFactor = function() {
  // set to 1 if zooming is off for path simplification algorithm
  return (this._zooming ? this._maxZoomFactor : 1);
};

dvt.ThematicMap.prototype.setMaxZoomFactor = function(maxZoomFactor) {
  this._maxZoomFactor = maxZoomFactor;
};


/**
 * Returns whether the marker zoom behavior is 'fixed'. Valid values are fixed (default) and zoom.
 * @return {boolean} True if the marker zoom behavior is fixed
 */
dvt.ThematicMap.prototype.isMarkerZoomBehaviorFixed = function() {
  return this._isMarkerZoomBehaviorFixed;
};


/**
 * Sets the marker behavior when zooming. Valid values are fixed (default) and zoom.
 * @param {string} behavior The marker behavior on zoom
 */
dvt.ThematicMap.prototype.setMarkerZoomBehavior = function(behavior) {
  this._isMarkerZoomBehaviorFixed = (behavior == 'fixed');
};

/**
 * @override
 */
dvt.ThematicMap.prototype.getEventManager = function() {
  return this._eventHandler;
};

dvt.ThematicMap.prototype.addPointLayer = function(layer) {
  this._layers.push(layer);
};

dvt.ThematicMap.prototype.addLayer = function(layer) {
  this._layers.push(layer);
};

dvt.ThematicMap.prototype.getLayer = function(layerName) {
  for (var i = 0; i < this._layers.length; i++) {
    if (this._layers[i].getLayerName() == layerName)
      return this._layers[i];
  }
};


/**
 * Returns the array of area layer and top level point data layers for this map
 * @return {Array} The array of map layers
 */
dvt.ThematicMap.prototype.getAllLayers = function() {
  return this._layers;
};

dvt.ThematicMap.prototype.getAreaLayerContainer = function() {
  return this._areaLayers;
};

dvt.ThematicMap.prototype.getDataAreaContainer = function() {
  return this._dataAreaLayers;
};

dvt.ThematicMap.prototype.getDataPointContainer = function() {
  return this._dataPointLayers;
};

dvt.ThematicMap.prototype.getLabelContainer = function() {
  return this._labelLayers;
};

dvt.ThematicMap.prototype.setMapName = function(attr) {
  this._bBaseMapChanged = (this._mapName && this._mapName != attr);
  this._mapName = attr;
};

dvt.ThematicMap.prototype.setAnimationOnDisplay = function(attr) {
  this._animationOnDisplay = attr;
};

dvt.ThematicMap.prototype.setAnimationOnMapChange = function(attr) {
  this._animationOnMapChange = attr;
};

dvt.ThematicMap.prototype.setAnimationDuration = function(attr) {
  this._animationDuration = parseFloat(attr);
};


/**
 * Returns the animation duration for this component
 * @return {Number} The animation duration in milliseconds
 */
dvt.ThematicMap.prototype.getAnimationDuration = function() {
  return this._animationDuration;
};

dvt.ThematicMap.prototype.setDisplayTooltips = function(attr) {
  this._displayTooltips = attr;
};

dvt.ThematicMap.prototype.getDisplayTooltips = function() {
  return this._displayTooltips;
};

/**
 * Turns off certain features like panning or zooming for this component
 * @param {String} attr Flag for disabled comonent features
 */
dvt.ThematicMap.prototype.setFeaturesOff = function(attr) {
  var featuresOff = parseInt(attr);
  var controls = this.getDisplayedControls();
  if (featuresOff == dvt.ThematicMap._FEATURES_OFF_PAN || featuresOff == dvt.ThematicMap._FEATURES_OFF_PAN_ZOOM ||
      featuresOff == dvt.ThematicMap._FEATURES_OFF_PAN_ZOOMTOFIT || featuresOff == dvt.ThematicMap._FEATURES_OFF_ALL) {
    controls = controls & ~dvt.ControlPanel.CONTROLS_CENTER_BUTTON;
    this.setPanning(false);
  }
  if (featuresOff == dvt.ThematicMap._FEATURES_OFF_ZOOM || featuresOff == dvt.ThematicMap._FEATURES_OFF_PAN_ZOOM ||
      featuresOff == dvt.ThematicMap._FEATURES_OFF_ZOOM_ZOOMTOFIT || featuresOff == dvt.ThematicMap._FEATURES_OFF_ALL) {
    controls = controls & ~dvt.ControlPanel.CONTROLS_ZOOM;
    this.setZooming(false);
  }
  if (featuresOff == dvt.ThematicMap._FEATURES_OFF_ZOOMTOFIT || featuresOff == dvt.ThematicMap._FEATURES_OFF_PAN_ZOOMTOFIT ||
      featuresOff == dvt.ThematicMap._FEATURES_OFF_ZOOM_ZOOMTOFIT || featuresOff == dvt.ThematicMap._FEATURES_OFF_ALL) {
    controls = controls & ~dvt.ControlPanel.CONTROLS_ZOOM_TO_FIT_BUTTON;
  }

  this.setDisplayedControls(controls);
};

dvt.ThematicMap.prototype.setInitialCenterX = function(attr) {
  this._initialCenterX = attr;
};

dvt.ThematicMap.prototype.setInitialCenterY = function(attr) {
  this._initialCenterY = attr;
};

dvt.ThematicMap.prototype.setInitialZoom = function(attr) {
  this._initialZoom = attr;
};

dvt.ThematicMap.prototype.setAnimationOnDrill = function(attr) {
  this._animationOnDrill = attr;
};

dvt.ThematicMap.prototype.setDrillMode = function(attr) {
  this._drillMode = attr;
  this._eventHandler.setDrillMode(attr);
};

dvt.ThematicMap.prototype.setInitialZooming = function(attr) {
  this._initialZooming = attr;
};

dvt.ThematicMap.prototype.getLegendPanel = function(node) {
  return this._legendPanel;
};


/**
 * @override
 */
dvt.ThematicMap.prototype.PreRender = function() {
  dvt.ThematicMap.superclass.PreRender.call(this);
  // 3 cases we need to handle
  // 1. Initial render
  // 2. New area layer
  // 3. New base map
  // For cases 2 & 3 we will need to clear the old stored information
  if (!this.IsResize() && this._pzcContainer) {
    this._layers = [];
    this._drilledRowKeys = [];
    this._initDrilled = new Object();
    this._drillDataLayer = new Object();
    this._childToParent = new Object();
    this._drilled = [];

    this.removeChild(this._legendPanel);
    this._legendPanel = null;
    this._legend = null;
    this._legendData = null;
    this._legendButtonImages = null;
    this.setDisplayedControls(dvt.ControlPanel.CONTROLS_ALL);
    this._zooming = true;
    this._panning = true;

    // save a copy of the old pzc for animation
    this._oldPzc = this._pzc;

    this._areaLayers = new dvt.Container(this.getCtx());
    this._dataAreaLayers = new dvt.Container(this.getCtx());
    this._dataPointLayers = new dvt.Container(this.getCtx());
    this._labelLayers = new dvt.Container(this.getCtx());

    this._showPopupBehaviors = null;

    this._eventHandler.removeListeners(this);
    this._createHandlers();
    this._bListenersRemoved = false;
    // clear data tips from previous event handlers
    this._eventHandler.hideTooltip();
    this._eventHandler.associate(this, this);
  }
};


/**
 * Creates all the event handlers that this component needs
 * @private
 */
dvt.ThematicMap.prototype._createHandlers = function() {
  // Each Tmap has only one keyboard handler. Each layer has its own event manager
  // because selection modes can differ between layers.
  this._eventHandler = new DvtThematicMapEventManager(this.getCtx(), this.dispatchEvent, this);
  this._eventHandler.addListeners(this);
  if (!dvt.Agent.isTouchDevice()) {
    this._keyboardHandler = new DvtThematicMapKeyboardHandler(this, this._eventHandler);
    this._eventHandler.setKeyboardHandler(this._keyboardHandler);
  } else {
    this._keyboardHandler = null;
  }
};

dvt.ThematicMap.prototype.HandleLegendResize = function(event) {
  if (!dvt.Agent.isRightToLeft(this.getCtx())) {
    var x = this.getWidth() - 5 - event.getWidth();
    this._legendPanel.setTranslateX(x);
  }
};


/**
 * Creates, renders, and positions a DvtCommonLegend and its parent container within this component.
 * @private
 */
dvt.ThematicMap.prototype._renderLegend = function() {
  if (this._legendData) {
    // Cleanup previoius legend
    if (this._legendPanel) {
      this._legendPanel.destroy();
      this.removeChild(this._legendPanel);
    }

    var disclosed = this._legendData['disclosed'] == 'true';
    var isFixed = this._legendData['display'] == 'fixed' || dvt.Agent.isEnvironmentBatik();
    if ((isFixed && !disclosed))
      return;

    // determine the max width of the legend container
    var maxWidth = this._legendData['maxWidth'];
    // check if max legend width is given as a % or px
    var percentIndex = maxWidth.indexOf('%');
    var isPercent = (percentIndex != -1);
    if (isPercent)
      maxWidth = parseFloat(maxWidth.substring(0, percentIndex)) / 100 * this.getWidth();
    else
      maxWidth = parseFloat(maxWidth);
    var maxHeight = this.getHeight() - 2 * dvt.ThematicMap._COLLAPSIBLE_PANEL_OFFSET;

    // create the legend container based on the skin
    if (this.getSkinName() == dvt.CSSStyle.SKIN_ALTA) {
      this._legendPanel = new dvt.PanelDrawer(this.getCtx(), null, this, 'pd');
      this._legendPanel.addEvtListener(dvt.PanelDrawerEvent.TYPE, this.HandleLegendEvent, false, this);
      this._legendPanel.setMaxWidth(maxWidth);
      this._legendPanel.setMaxHeight(maxHeight);
      this._legendPanel.setFixed(isFixed);
      // position the container
      if (!dvt.Agent.isRightToLeft(this.getCtx())) {
        this._legendPanel.setTranslateX(this.getWidth());
      }
      else {
        this._legendPanel.setDiscloseDirection(dvt.PanelDrawer.DIR_RIGHT);
        this._legendPanel.setTranslateX(0);
      }
    } else {
      var legendCollapseDir = dvt.CollapsiblePanel.COLLAPSE_NORTHEAST;
      this._legendPanel = new dvt.CollapsiblePanel(this.getCtx(), maxWidth, maxHeight, legendCollapseDir,
          this.getResourcesMap(), this.getSubcomponentStyles(), disclosed, isFixed);
      this._legendPanel.addEvtListener(dvt.CollapsiblePanelEvent.TYPE, this.HandleLegendEvent, false, this);
      this._legendPanel.addEvtListener(dvt.ResizeEvent.RESIZE_EVENT, this.HandleLegendResize, false, this);
      var expandTooltip = this._legendData['expandTooltip'];
      var collapseTooltip = this._legendData['collapseTooltip'];
      this._legendPanel.setButtonTooltips(expandTooltip, collapseTooltip);
    }

    // create and render the legend
    var legendData = this._legendData;
    this._legend = dvt.Legend.newInstance(this.getCtx(), this.processLegendEvent, this);
    this.addChild(this._legendPanel);
    this.addChild(this._legend);
    var preferredSize = this._legend.getPreferredSize(legendData, this._legendPanel.getMaxContentWidth(), this._legendPanel.getMaxContentHeight());
    this._legend.render(legendData, preferredSize.w, preferredSize.h);

    // add the legend to its container
    var legendPanelDim;
    if (this.getSkinName() == dvt.CSSStyle.SKIN_ALTA) {
      this._legendPanel.setMaxContainerHeight(this._legend.getContentDimensions().h);
      this.removeChild(this._legend);

      var upState = new dvt.Image(this.getCtx(), this.getResourcesMap()[dvt.PanelDrawer.PANEL_LEGEND_ICON_ENA], 0, 0, dvt.PanelDrawer.IMAGE_SIZE, dvt.PanelDrawer.IMAGE_SIZE);
      var overState = new dvt.Image(this.getCtx(), this.getResourcesMap()[dvt.PanelDrawer.PANEL_LEGEND_ICON_OVR], 0, 0, dvt.PanelDrawer.IMAGE_SIZE, dvt.PanelDrawer.IMAGE_SIZE);
      var downState = new dvt.Image(this.getCtx(), this.getResourcesMap()[dvt.PanelDrawer.PANEL_LEGEND_ICON_DWN], 0, 0, dvt.PanelDrawer.IMAGE_SIZE, dvt.PanelDrawer.IMAGE_SIZE);
      var tip = dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'LEGEND');
      this._legendPanel.addPanel(this._legend, upState, overState, downState, tip, dvt.PanelDrawer.PANEL_LEGEND);
      this._legendPanel.renderComponent();
      if (disclosed)
        this._legendPanel.setDisclosed(true, true);
    } else {
      this._legendPanel.addContent(this._legend);
      // position the container
      legendPanelDim = this._legendPanel.getDimensions();
      var x = dvt.Agent.isRightToLeft(this.getCtx()) ? 5 : this.getWidth() - 5 - legendPanelDim.w - legendPanelDim.x;
      this._legendPanel.setTranslate(x, 5);
      // add on the 5 px border gap to account for legend size when resetting pzc size for fixed legend
      legendPanelDim.w += 5;
    }

    this._isFixedLegend = isFixed;
    if (isFixed) {
      if (!legendPanelDim)
        legendPanelDim = this._legendPanel.getDimensions();
      this._legendWidth = legendPanelDim.w;
      this._pzc.setSize(this.getWidth() - this._legendWidth, this.getHeight(), true);
    }

  }
};


/**
 * @override
 */
dvt.ThematicMap.prototype.Render = function() {
  dvt.ThematicMap.superclass.Render.call(this);
  // Create a new container and render the component into it
  var pzcContainer = new dvt.Container(this.getCtx());
  var cpContainer = new dvt.Container(this.getCtx());
  this._pzc = this.getPanZoomCanvas();
  this._pzc.addChild(pzcContainer);
  this._pzc.getContentPane().addChild(cpContainer);
  this._render(pzcContainer, cpContainer);

  if (!this._topLayer)
    return;

  // Re-add the control panel on top of any rendered layers
  this._controlPanel = this._pzc.getControlPanel();
  if (this._controlPanel)
    this._pzc.addChild(this._controlPanel);

  // Animation Support
  // Stop any animation in progress
  this._stopAnimation();
  var bounds = new dvt.Rectangle(0, 0, this.getWidth(), this.getHeight());
  // 3 types of animations can occur where 2 & 3 need to animate out the old data
  // 1) animation on display
  // 2) animation on base map change
  // 3) animation on area layer change

  if (!this._bRendered && !this._oldPzc) { // Case 1
    if (dvt.BlackBoxAnimationHandler.isSupported(this._animationOnDisplay)) {
      this._animation = dvt.BlackBoxAnimationHandler.getInAnimation(this.getCtx(), this._animationOnDisplay, this._pzc, bounds, this._animationDuration);
    }
  }
  else {
    var anim = null;
    if (this._bBaseMapChanged && !this.IsResize()) { // Case 2
      anim = this._animationOnMapChange;
    }
    else if (this._topLayer && this._topLayer.getLayerName() != this._oldTopLayerName) { // Case 3
      anim = this._topLayer.getAnimation();
    }

    if (dvt.BlackBoxAnimationHandler.isSupported(anim)) {
      this._animation = dvt.BlackBoxAnimationHandler.getCombinedAnimation(this.getCtx(), anim, this._oldPzc, this._pzc, bounds, this._animationDuration);
      if (this._animation)
        this.addChild(this._oldPzc);
    }
  }

  // If an animation was created, play it
  if (this._animation) {
    // Temporarily move control panel to top level container to prevent it from being
    // animated
    if (this._controlPanel)
      this.addChild(this._controlPanel);
    this._eventHandler.hideTooltip();
    // Disable event listeners temporarily
    this._eventHandler.removeListeners(this);
    this._bListenersRemoved = true;
    // Start the animation
    this._animation.setOnEnd(this.OnAnimationEnd, this);
    this._animation.play();
  } else {
    this.OnAnimationEnd();
  }

  // Update the pointers
  this._pzcContainer = pzcContainer;

  if (this._topLayer) {
    this._oldTopLayerName = this._topLayer.getLayerName();
  }

  // For mashup case, the component who calls this last will get their keyboard handler set on the wrapping div
  // so we need to call this after rendering data layers
  this.getCtx().setKeyboardFocusArray([this]);
  this._bRendered = true;
};


/**
 * Calculate the minimum zoom for this basemap taking into account the pan zoom canvas size
 * @return {number} The minimum zoom for this basemap
 * @private
 */
dvt.ThematicMap.prototype._calcMinZoom = function() {
  var zoomPadding = this._pzc.getZoomToFitPadding();
  var mapDim = this._topLayer.getLayerDim();
  var pzcDim = this._pzc.getSize();
  var dzx = (pzcDim.w - 2 * zoomPadding) / mapDim.w;
  var dzy = (pzcDim.h - 2 * zoomPadding) / mapDim.h;
  var dz = Math.min(dzx, dzy);
  return dz;
};


/**
 * Renders all layers and subcomponents for this component
 * @param {dvt.Container} pzcContainer A child container of the pan zoom canvas
 * @param {dvt.Container} cpContainer A child container of the pan zoom canvas content pane
 * @private
 */
dvt.ThematicMap.prototype._render = function(pzcContainer, cpContainer) {
  // render legend first since a fixed legend will affect the canvas size
  this._renderLegend();

  // Add all containers
  cpContainer.addChild(this._areaLayers);
  cpContainer.addChild(this._dataAreaLayers);
  if (this.isMarkerZoomBehaviorFixed())
    pzcContainer.addChild(this._dataPointLayers);
  else
    cpContainer.addChild(this._dataPointLayers);
  pzcContainer.addChild(this._labelLayers);

  // Render all point layers and the first area layer
  var pzcMatrix = this._pzc.getContentPane().getMatrix();
  this._topLayerRendered = false;
  for (var i = 0; i < this._layers.length; i++) {
    var layer = this._layers[i];
    if ((!this._topLayerRendered && layer instanceof DvtMapAreaLayer) || !(layer instanceof DvtMapAreaLayer)) {
      layer.render(pzcMatrix);
      if (!this._topLayerRendered && layer instanceof DvtMapAreaLayer) {
        this._topLayerRendered = true;
        this._topLayer = layer;
      }
    }
  }

  if (!this._topLayer)
    return;

  var isolatedArea = this._topLayer.getIsolatedArea();
  if (this._isolatedArea != isolatedArea) {
    // if the isolated area changes, ignore any saved zoom/pan states
    this._isolatedArea = isolatedArea;
    this.setInitialCenterX(null);
    this.setInitialCenterY(null);
    this.setInitialZoom(null);
  }

  // Set initially focus to area or marker if no data areas
  if (this._keyboardHandler) {
    var navigables = this.getNavigableAreas();
    if (navigables.length == 0)
      navigables = this.getNavigableObjects();
    this._eventHandler.setInitialFocus(navigables[0]);
  }

  // Do not set min and max zoom before calling zoom to fit on map
  this._pzc.setMinZoom(null);
  this._pzc.setMaxZoom(null);
  this._pzc.setZoomingEnabled(true);
  this._pzc.setPanningEnabled(true);


  // Zoom to fit before initial render animations so animations will look correct
  // Additional zooming for initialZooming will be applied after animations are complete
  // On resize and basemap change we want to refit the map to the viewport so ignore any saved zoom state
  if (!this._bBaseMapChanged && !this.IsResize() && this._initialZoom != null) {
    this._pzc.zoomTo(this._initialZoom);
    this._pzc.panTo(this._initialCenterX, this._initialCenterY);
  } else {
    this._pzc.zoomToFit(null, this._topLayer.getLayerDim());
  }

  // Set initially drilled regions
  this._processInitialDrilled();

  // Get the current zoom of the canvas to set min canvas zoom to fit component in viewport
  this._updateZoomLimits();

  this._pzc.setZoomingEnabled(this._zooming);
  this._pzc.setPanningEnabled(this._panning);
};


/**
 * Called on data layer ppr to render a data layer with new data.
 * @param {Object} dataLayerOptions The json object containing data layer information.
 * @param {String} parentLayer The area layer name for this data layer or null
 * @param {boolean} isAreaDataLayer True if we are parsing an area data layer
 * @export
 */
dvt.ThematicMap.prototype.updateLayer = function(dataLayerOptions, parentLayer, isAreaDataLayer) {
  // Stop any animations before starting layer animations
  this._bRendered = false;
  this._stopAnimation();

  // Parse new data layer
  var parser = new DvtThematicMapJsonParser(this);
  parser.ParseDataLayers([dataLayerOptions], this.getLayer(parentLayer), this._topLayer.getLayerName(), isAreaDataLayer);
  this._renderLegend();
  this._bRendered = true;

  // Reset initially focused object with updated data items
  if (this._keyboardHandler) {
    var navigables = this.getNavigableAreas();
    if (navigables.length == 0)
      navigables = this.getNavigableObjects();
    this._eventHandler.setInitialFocus(navigables[0]);
  }

  // Set component keyboard listener last for mashup case
  this.getCtx().setKeyboardFocusArray([this]);

  // reset zoom limits since we could now have an isolated area after data layer update
  this._updateZoomLimits();
};


/**
 * Determines and sets the min and max zoom for the component.
 * @private
 */
dvt.ThematicMap.prototype._updateZoomLimits = function() {
  var fittedZoom = this._calcMinZoom();
  this._pzc.setMinZoom(fittedZoom);
  this._pzc.setMaxZoom(fittedZoom * this.getMaxZoomFactor());
};

/**
 * Hook for updating the component after a data layer update
 * @protected
 */
dvt.ThematicMap.prototype.OnUpdateLayerEnd = function() {
  if (this._topLayer.getIsolatedArea())
    this._pzc.zoomToFit(null, this._topLayer.getLayerDim());

  this._processInitialDrilled();

  if (this._initialZooming)
    this._zoomData();
};

dvt.ThematicMap.prototype.getMapName = function() {
  return this._mapName;
};

dvt.ThematicMap.prototype.getDrillMode = function() {
  return this._drillMode;
};

dvt.ThematicMap.prototype.setLegendData = function(data) {
  this._legendData = data;
};

dvt.ThematicMap.prototype.setRolloverBehavior = function(rolloverBehavior) {
  this._rolloverBehavior = rolloverBehavior;
};

dvt.ThematicMap.prototype.getRolloverBehavior = function() {
  return this._rolloverBehavior;
};

/**
 * Handles transforms for containers that aren't updated by the pan zoom canvas
 * @param {dvt.Matrix} pzcMatrix The pan zoom canvas transform
 * @private
 */
dvt.ThematicMap.prototype._transformContainers = function(pzcMatrix) {
  // this._areaLayers, and this._dataAreaLayers transforms handled by pzc

  // update point and label layers with new panX/panY
  var mat = new dvt.Matrix();
  mat.translate(pzcMatrix.getTx(), pzcMatrix.getTy());

  // this._dataPointLayers zoom transforms handled by markers to avoid scaling marker filter effects
  // tx/ty transforms are handled by tmap for better interactivity
  if (this.isMarkerZoomBehaviorFixed())
    this._dataPointLayers.setMatrix(mat);
  this._labelLayers.setMatrix(mat);
};

/**
 * Creates and sends an adfPropertyChange to the peer for legend state saving
 * @param {dvt.BaseComponentEvent) event The event fired by the legend container panel on collapse/expand}
 * @protected
 */
dvt.ThematicMap.prototype.HandleLegendEvent = function(event) {
  // Currently only one collapsible container which contains a legend
  var spEvent = dvt.EventFactory.newAdfPropertyChangeEvent(dvt.PanZoomComponent.LEGEND_DISCLOSED_EVENT_KEY, event.getSubType() == dvt.CollapsiblePanelEvent.SUBTYPE_SHOW);
  this.dispatchEvent(spEvent);
};


/**
 * Constrain the component panning so that we only allow panning when zoomed beyond the current viewport and we don't
 * allow the map to be panned completely outside of the viewport.
 * @param {number} zoom The current component zoom
 * @private
 */
dvt.ThematicMap.prototype._constrainPanning = function(zoom) {
  var padding = this._pzc.getZoomToFitPadding();
  var pzcDim = this._pzc.getSize();
  var viewportDim = new dvt.Rectangle(padding, padding, pzcDim.w - 2 * padding, pzcDim.h - 2 * padding);
  var mapDim = this._topLayer.getLayerDim();
  var zoomedMapX = mapDim.x * zoom;
  var zoomedMapY = mapDim.y * zoom;
  var zoomedMapW = mapDim.w * zoom;
  var zoomedMapH = mapDim.h * zoom;

  var legendAdjust = 0;
  if (zoomedMapW > viewportDim.w) {
    if (this._isFixedLegend && dvt.Agent.isRightToLeft(this.getCtx()))
      legendAdjust = this._legendWidth;
    this._pzc.setMinPanX((viewportDim.x + viewportDim.w + legendAdjust) - (zoomedMapX + zoomedMapW));
    this._pzc.setMaxPanX(viewportDim.x - zoomedMapX + legendAdjust);
  } else {
    // if smaller, center it in the viewport
    if (this._isFixedLegend && dvt.Agent.isRightToLeft(this.getCtx()))
      legendAdjust = this._legendWidth * 2;
    var minMaxX = (viewportDim.x + viewportDim.w + legendAdjust) / 2 - (zoomedMapX + zoomedMapW / 2);
    this._pzc.setMinPanX(minMaxX);
    this._pzc.setMaxPanX(minMaxX);
  }

  if (zoomedMapH > viewportDim.h) {
    this._pzc.setMinPanY((viewportDim.y + viewportDim.h) - (zoomedMapY + zoomedMapH));
    this._pzc.setMaxPanY(viewportDim.y - zoomedMapY);
  } else {
    var minMaxY = (viewportDim.y + viewportDim.h) / 2 - (zoomedMapY + zoomedMapH / 2);
    this._pzc.setMinPanY(minMaxY);
    this._pzc.setMaxPanY(minMaxY);
  }
};


/**
 * Updates the dvt.Animator associated with a pan or zoom event with additional properties for containers not added to the content pane.
 * @param {dvt.BaseComponentEvent} event The pan or zoom event
 * @param {boolean} bRecenterObjs Whether to recenter map objects that are pinned to a particular long/lat or x/y coordinate
 * @private
 */
dvt.ThematicMap.prototype._updateAnimator = function(event, bRecenterObjs) {
  var animator = event.getAnimator();
  if (animator) {
    var contentPane = this._pzc.getContentPane();
    var mat = animator.getDestVal(contentPane, contentPane.getMatrix);
    if (bRecenterObjs) {
      this._currentAnimMatrix = contentPane.getMatrix();
      animator.addProp(dvt.Animator.TYPE_MATRIX, this, this._getCenteredObjsMatrix, this._setCenteredObjsMatrix, mat);
    }
    var transMat = new dvt.Matrix(1, 0, 0, 1, mat.getTx(), mat.getTy());
    if (this.isMarkerZoomBehaviorFixed())
      animator.addProp(dvt.Animator.TYPE_MATRIX, this._dataPointLayers, this._dataPointLayers.getMatrix, this._dataPointLayers.setMatrix, transMat);
    animator.addProp(dvt.Animator.TYPE_MATRIX, this._labelLayers, this._labelLayers.getMatrix, this._labelLayers.setMatrix, transMat);
  }
};


/**
 * Processes a zoom event for this component and subcomponents.
 * @param {dvt.ZoomEvent} event The event to process
 * @protected
 */
dvt.ThematicMap.prototype.HandleZoomEvent = function(event) {
  var type = event.getSubType();
  switch (type) {
    case dvt.ZoomEvent.SUBTYPE_ADJUST_PAN_CONSTRAINTS:
      // Calculate the new content dimensions based on the new zoom
      if (this._panning)
        this._constrainPanning(event.getNewZoom());
      break;
    case dvt.ZoomEvent.SUBTYPE_ZOOMING:
    case dvt.ZoomEvent.SUBTYPE_ELASTIC_ANIM_BEGIN:
      this._updateAnimator(event, true);
      break;
    case dvt.ZoomEvent.SUBTYPE_ZOOMED:
      var zoom = event.getNewZoom();
      if (zoom != null) {
        var pzcMatrix = this._pzc.getContentPane().getMatrix();
        // null out animator for Flash. Temp fix until  is done.
        event._animator = null;
        this.dispatchEvent(dvt.EventFactory.newThematicMapViewportChangeEvent(pzcMatrix.getTx(), pzcMatrix.getTy(), zoom));

        this._transformContainers(pzcMatrix);

        for (var i = 0; i < this._layers.length; i++)
          this._layers[i].HandleZoomEvent(event, pzcMatrix);
      }
      break;
    case dvt.ZoomEvent.SUBTYPE_ZOOM_AND_CENTER:
      // zoom and center on the current selection from the last clicked data layer
      // this can include both points and areas
      this.fitSelectedRegions();
      break;
    case dvt.ZoomEvent.SUBTYPE_ZOOM_TO_FIT_END:
      // reset pan/zoom state
      this.dispatchEvent(dvt.EventFactory.newThematicMapViewportChangeEvent());
      break;
    default:
      break;
  }
};


/**
 * @override
 */
dvt.ThematicMap.prototype.HandlePanEvent = function(event) {
  var subType = event.getSubType();
  if (subType == dvt.PanEvent.SUBTYPE_ELASTIC_ANIM_BEGIN) {
    this._updateAnimator(event, false);
  }
  else if (subType == dvt.PanEvent.SUBTYPE_PANNED) {
    if (event.getNewX() != null) {
      var pzcMatrix = this._pzc.getContentPane().getMatrix();
      // null out animator for Flash. Temp fix until  is done.
      event._animator = null;
      this.dispatchEvent(dvt.EventFactory.newThematicMapViewportChangeEvent(pzcMatrix.getTx(), pzcMatrix.getTy(), this._pzc.getZoom()));

      this._transformContainers(pzcMatrix);

      for (var i = 0; i < this._layers.length; i++)
        this._layers[i].HandlePanEvent(pzcMatrix);
    }
  }

  if (this._legendPanel) {
    // Handle dvt.PanelDrawer fade
    if (this.getSkinName() == dvt.CSSStyle.SKIN_ALTA) {
      if (subType === dvt.PanEvent.SUBTYPE_DRAG_PAN_BEGIN) {
        this._legendPanel.setMouseEnabled(false);
      }
      else if (subType === dvt.PanEvent.SUBTYPE_DRAG_PAN_END) {
        this._legendPanel.setMouseEnabled(true);
      }
    } else {
      var styleMap = this.getSubcomponentStyles();
      var stroke = this._legendPanel._background.getStroke().clone();
      // Handle dvt.CollapsiblePanel fade
      if (subType === dvt.PanEvent.SUBTYPE_DRAG_PAN_BEGIN) {
        this._legend.setAlpha(styleMap[dvt.ControlPanel.BG_DRAG_ALPHA]);
        stroke.setAlpha(styleMap[dvt.ControlPanel.FRAME_DRAG_ALPHA]);
        this._legendPanel._background.setStroke(stroke);
        if (this._legendPanel._buttonFrame)
          this._legendPanel._buttonFrame.setAlpha(styleMap[dvt.ControlPanel.FRAME_DRAG_ALPHA]);
        this._legendPanel.setMouseEnabled(false);
      }
      else if (subType === dvt.PanEvent.SUBTYPE_DRAG_PAN_END) {
        this._legend.setAlpha(1);
        stroke.setAlpha(styleMap[dvt.ControlPanel.FRAME_ROLLOUT_ALPHA]);
        this._legendPanel._background.setStroke(stroke);
        if (this._legendPanel._buttonFrame)
          this._legendPanel._buttonFrame.setAlpha(styleMap[dvt.ControlPanel.FRAME_ROLLOUT_ALPHA]);
        this._legendPanel.setMouseEnabled(true);
      }
    }
  }
};

/**
 * @override
 */
dvt.ThematicMap.prototype.GetControlPanelBehavior = function() {
  // Programatically hide control panel if drilling/zooming are off and we are in alta skin
  if (this._drillMode == 'none' && !this._zooming && (!this._panning || this.getSkinName() == dvt.CSSStyle.SKIN_ALTA))
    return dvt.PanZoomComponent.CONTROL_PANEL_BEHAVIOR_HIDDEN;
  else
    return dvt.ThematicMap.superclass.GetControlPanelBehavior.call(this);
};

/**
 * @override
 */
dvt.ThematicMap.prototype.GetControlPanel = function() {
  var cpBehavior = this.GetControlPanelBehavior();
  if (cpBehavior != dvt.PanZoomComponent.CONTROL_PANEL_BEHAVIOR_HIDDEN) {
    var cpState = (cpBehavior == dvt.PanZoomComponent.CONTROL_PANEL_BEHAVIOR_INIT_COLLAPSED ?
        dvt.ControlPanel.STATE_COLLAPSED : dvt.ControlPanel.STATE_EXPANDED);
    return new DvtThematicMapControlPanel(this.getCtx(), this, cpState);
  } else {
    return null;
  }
};

dvt.ThematicMap.prototype.setZooming = function(attr) {
  this._zooming = attr;
};

dvt.ThematicMap.prototype.setPanning = function(attr) {
  this._panning = attr;
};

dvt.ThematicMap.prototype.addDisclosedRowKey = function(drilled) {
  this._drilledRowKeys.push(drilled);
};

dvt.ThematicMap.prototype.addDrilledLayer = function(layerName, drilled) {
  this._initDrilled[layerName] = drilled;
};

dvt.ThematicMap.prototype._processInitialDrilled = function() {
  this._processingInitDrilled = true;
  for (var i = 0; i < this._layers.length; i++) {
    var layerName = this._layers[i].getLayerName();
    if (layerName in this._initDrilled) {
      this._selectedAreas[layerName] = this._initDrilled[layerName][1];
      this._clickedLayerName = layerName;
      this._clickedDataLayerId = this._initDrilled[layerName][0];
      this.drillDown();
    }
  }
  this._processingInitDrilled = false;
};

dvt.ThematicMap.prototype.resetMap = function() {
  // stop previous animation
  this._stopAnimation();

  //Clear selection and drilled starting from the lowest layer
  var removeObjs = [];
  var addObjs = [];
  for (var i = this._layers.length - 1; i > -1; i--) {
    if (this._layers[i].getLayerName() == this._topLayer.getLayerName())
      this._layers[i].reset(addObjs);
    else
      this._layers[i].reset(removeObjs);
  }
  for (var j = 0; j < removeObjs.length; j++) {
    if (removeObjs[j]) {
      var parent = removeObjs[j].getParent();
      if (parent)
        parent.removeChild(removeObjs[j]);
    }
  }
  // addObjs have opacity set to 0
  for (var j = 0; j < addObjs.length; j++) {
    if (addObjs[j]) {
      addObjs[j].setAlpha(1);
    }
  }
  this._drilledRowKeys = [];
  this.fitMap();
  this._drilled = [];

  if (this._controlPanel && this._drillMode != 'none') {
    this._controlPanel.setEnabledDrillDownButton(false);
    this._controlPanel.setEnabledDrillUpButton(false);
  }

};


/**
 * Zooms map to fit the current rendered data
 * @private
 */
dvt.ThematicMap.prototype._zoomData = function() {
  var areaBounds = this._dataAreaLayers.getDimensions();
  var pointBounds = this._dataPointLayers.getDimensions();
  if (this.isMarkerZoomBehaviorFixed()) {
    var mat = this._pzc.getContentPane().getMatrix();
    pointBounds.w /= mat.getA();
    pointBounds.h /= mat.getD();
    pointBounds.x /= mat.getA();
    pointBounds.y /= mat.getD();
  }

  var bounds = areaBounds.getUnion(pointBounds);
  this._stopAnimation();

  var maxZoom;
  if (!this._pzc.isZoomingEnabled()) {
    // if zooming is off, temporarily set max zoom factor as if zooming were
    // allowed so zoom to fit isn't constrained
    maxZoom = this._pzc.getMaxZoom();
    this._pzc.setMaxZoom(maxZoom * this._maxZoomFactor);
  }

  var animation;
  if (dvt.Agent.isEnvironmentBrowser())
    animation = new dvt.Animator(this.getCtx(), .3);
  if (bounds.w > 0 && bounds.h > 0)
    this._pzc.zoomToFit(animation, bounds);
  else
    this._pzc.zoomToFit(animation, this._topLayer.getLayerDim());
  if (animation)
    animation.play();

  if (maxZoom)
    this._pzc.setMaxZoom(maxZoom);
};


/**
 * Zooms the component to fit the passed in bounds
 * @param {dvt.Rectangle} bounds The bounds to zoom
 * @private
 */
dvt.ThematicMap.prototype._zoomToFitBounds = function(bounds) {
  var animator = new dvt.Animator(this.getCtx(), .3);
  this._pzc.zoomToFit(animator, bounds);
  animator.play();
};


/**
 * Zooms the component to fit a passed in or last clicked area
 * @param {dvt.Path} toFit The area to zoom to fit to
 */
dvt.ThematicMap.prototype.fitRegion = function(toFit) {
  if (!toFit)
    toFit = this._zoomToFitObject;
  if (!toFit)
    toFit = this._clickedObject;
  this._zoomToFitBounds(toFit.getDimensions());
};


/**
 * Zooms the component to fit the currently selected areas
 */
dvt.ThematicMap.prototype.fitSelectedRegions = function() {
  if (this._clickedDataLayerId) {
    var dataLayer = this.getLayer(this._clickedLayerName).getDataLayer(this._clickedDataLayerId);
    if (dataLayer) {
      var selectionHandler = dataLayer._selectionHandler;
      if (selectionHandler) {
        var selection = selectionHandler.getSelection();
        for (var i = 0; i < selection.length; i++) {
          selection[i] = selection[i].getDisplayable();
        }
        if (selection.length > 0) {
          var bounds = selection[0].getDimensions();
          for (var i = 1; i < selection.length; i++)
            bounds = bounds.getUnion(selection[i].getDimensions());
          this._zoomToFitBounds(bounds);
        }
      }
    }
  }
};

dvt.ThematicMap.prototype.fitMap = function() {
  var animator = new dvt.Animator(this.getCtx(), .3);
  this._pzc.zoomToFit(animator);
  animator.play();
};

dvt.ThematicMap.prototype.getDrillParentLayer = function(layerName) {
  var parentLayerName = DvtBaseMapManager.getParentLayerName(this._mapName, layerName);
  return this.getLayer(parentLayerName);
};

dvt.ThematicMap.prototype.getDrillChildLayer = function(layerName) {
  var childLayerName = DvtBaseMapManager.getChildLayerName(this._mapName, layerName);
  return this.getLayer(childLayerName);
};

dvt.ThematicMap.prototype.getNavigableAreas = function() {
  var disclosed = [];
  if (this._topLayer) {
    for (var i = 0; i < this._layers.length; i++) {
      var dataLayers = this._layers[i].getDataLayers();
      for (var id in dataLayers) {
        if (this._topLayer.getLayerName() == this._layers[i].getLayerName())
          disclosed = disclosed.concat(dataLayers[id].getNavigableAreaObjects());
        else
          disclosed = disclosed.concat(dataLayers[id].getNavigableDisclosedAreaObjects());
      }
    }
  }
  return disclosed;
};

dvt.ThematicMap.prototype.getNavigableObjects = function() {
  var navigable = [];
  if (this._topLayer) {
    for (var i = 0; i < this._layers.length; i++) {
      var dataLayers = this._layers[i].getDataLayers();
      if (this._topLayer.getLayerName() == this._layers[i].getLayerName() || !(this._layers[i] instanceof DvtMapAreaLayer)) {
        for (var id in dataLayers)
          navigable = navigable.concat(dataLayers[id].getDataObjects());
      }
    }
  }
  return navigable;
};


/**
 * Used for updating the positions of centered objects like markers, images, and labels during animation.
 * @param {dvt.Matrix} matrix The current animation matrix to use for updating the centered objects
 * @private
 */
dvt.ThematicMap.prototype._setCenteredObjsMatrix = function(matrix) {
  this._currentAnimMatrix = matrix;
  // update centered markers and images
  if (this.isMarkerZoomBehaviorFixed()) {
    var objs = this.getNavigableObjects();
    for (var i = 0; i < objs.length; i++)
      objs[i].HandleZoomEvent(matrix);
    // update centered labels for area and area data layers
    var numLabelLayers = this._labelLayers.getNumChildren();
    for (var j = 0; j < numLabelLayers; j++) {
      var labelLayer = this._labelLayers.getChildAt(j);
      var numLabels = labelLayer.getNumChildren();
      for (var k = 0; k < numLabels; k++) {
        var label = labelLayer.getChildAt(k);
        if (label instanceof DvtMapLabel)
          label.update(matrix);
      }
    }
  }
};


/**
 * Returns the current animation matrix used for updating centered objects
 * @return {dvt.Matrix} The current animation matrix
 * @private
 */
dvt.ThematicMap.prototype._getCenteredObjsMatrix = function() {
  return this._currentAnimMatrix;
};

/**
 * Drills down on the current selection of data areas, resetting other layers and areas as needed.
 */
dvt.ThematicMap.prototype.drillDown = function() {
  // stop previous animation
  this._stopAnimation();

  var childLayer = this.getDrillChildLayer(this._clickedLayerName);
  var parentLayer = this.getLayer(this._clickedLayerName);
  var fadeInObjs = [];

  if (childLayer) {
    this._drillDataLayer[this._clickedLayerName] = this._clickedDataLayerId;

    //Reset other disclosed regions in this layer
    var selectedAreas = this._selectedAreas[this._clickedLayerName];
    var areasToDrill = [];
    for (var i = 0; i < selectedAreas.length; i++) {
      if (!this._getAreaFromDataLayer(selectedAreas[i], parentLayer.getDataLayer(this._clickedDataLayerId)).isDrilled())
        areasToDrill.push(selectedAreas[i]);
    }

    // do not reset if just processing initiallly drilled row keys
    if (!this._processingInitDrilled && this._drillMode == 'single') {
      this._drilled.pop();
      parentLayer.reset(fadeInObjs, selectedAreas);
      childLayer.reset(this._drillAnimFadeOutObjs);
    }

    var newSelectedAreas = [];
    for (var i = 0; i < areasToDrill.length; i++) {
      var parentArea = areasToDrill[i];
      var childrenToDisclose = parentLayer.getChildrenForArea(parentArea);
      newSelectedAreas.push(childrenToDisclose[0]);

      //Update child to parent mapping
      for (var j = 0; j < childrenToDisclose.length; j++)
        this._childToParent[childrenToDisclose[j]] = parentArea;

      //Add disclosed child areas of drilled region
      childLayer.discloseAreas(childrenToDisclose, fadeInObjs);
      //Set the parent area border from selected to drilled
      var drillLayer = parentLayer.getDataLayer(this._clickedDataLayerId);
      if (drillLayer)
        drillLayer.drill(parentArea, this._drillAnimFadeOutObjs);
      //Update list of disclosed areas
      this._drilled.push(parentArea);
    }

    this._handleDrillAnimations(this._drillAnimFadeOutObjs, fadeInObjs, false);
    this._updateDrillButton(childLayer.getLayerName(), true);
    //Update so that drill up will work right after a drill down with no additional selection
    this._clickedLayerName = childLayer.getLayerName();
    this._selectedAreas[this._clickedLayerName] = newSelectedAreas;
  }
};

dvt.ThematicMap.prototype.drillUp = function() {
  // stop previous animation
  this._stopAnimation();

  var childLayer = this.getLayer(this._clickedLayerName);
  var parentLayer = this.getDrillParentLayer(this._clickedLayerName);
  //For fade in/out animation
  var fadeInObjs = [];
  var newSelectedAreas = [];
  var selectedAreas = this._selectedAreas[this._clickedLayerName];
  for (var i = 0; i < selectedAreas.length; i++) {
    var parentArea = this._childToParent[selectedAreas[i]];
    newSelectedAreas.push(parentArea);
    //Don't add a parent area multiple times if many children are selected
    if (dvt.ArrayUtils.getIndex(this._drilled, parentArea) != - 1) {
      var childrenToUndisclose = parentLayer.getChildrenForArea(parentArea);

      //Remove disclosed child areas of drilled region
      childLayer.undiscloseAreas(childrenToUndisclose, this._drillAnimFadeOutObjs);
      //Set the parent area border from drilled to selected
      parentLayer.getDataLayer(this._drillDataLayer[parentLayer.getLayerName()]).undrill(parentArea, fadeInObjs);
      //Update list of disclosed areas
      var index = dvt.ArrayUtils.getIndex(this._drilled, parentArea);
      if (index != - 1)
        this._drilled.splice(index, 1);
    }
  }

  this._handleDrillAnimations(this._drillAnimFadeOutObjs, fadeInObjs, true);

  this._clickedLayerName = parentLayer.getLayerName();
  this._clickedDataLayerId = this._drillDataLayer[this._clickedLayerName];
  this._selectedAreas[this._clickedLayerName] = newSelectedAreas;
  this._updateDrillButton(this._clickedLayerName);
};


dvt.ThematicMap.prototype._stopAnimation = function() {
  if (this._animation) {
    this._animation.stop(true);
    this._animation = null;
  }
};


/**
 * Handles drilling animations
 * @param {Array} oldObjs The array of displayables that will be removed once drilling is complete
 * @param {Array} newObjs The array of displayables that will be added once drilling is complete
 * @param {boolean} isDrillUp True if this is a drill up animation
 * @private
 */
dvt.ThematicMap.prototype._handleDrillAnimations = function(oldObjs, newObjs, isDrillUp) {
  var pzcMatrix = this._pzc.getContentPane().getMatrix();
  //Zoom to fit selection only if not proccessing initially drilled on initial render
  if (this._animationOnDrill == 'zoomToFit' && !this._processingInitDrilled) {
    var animator = new dvt.Animator(this.getCtx(), .3);
    if (!dvt.Agent.isEnvironmentBrowser())
      animator = null;
    if (isDrillUp)
      this._pzc.zoomToFit(animator);
    else
      this.fitSelectedRegions();
    if (animator)
      animator.play();
  }

  //Stop previous animation
  this._stopAnimation();
  if (dvt.Agent.isEnvironmentBrowser() && (this._animationOnDrill == 'alphaFade' || this._animationOnDrill == 'auto'))
    this._animation = dvt.BlackBoxAnimationHandler.getCombinedAnimation(this.getCtx(), 'alphaFade', oldObjs, newObjs, null, 0.5);
  // If an animation was created, play it
  if (this._animation) {
    this._eventHandler.hideTooltip();
    // Disable event listeners temporarily
    this._eventHandler.removeListeners(this);
    // Start the animation
    this._animation.setOnEnd(this.OnDrillAnimationEnd, this);
    this._animation.play();
  } else {
    this._cleanUpDrilledObjects();
  }
};

dvt.ThematicMap.prototype.setClickInfo = function(clientId, layerName, obj) {
  this._clickedLayerName = layerName;
  this._clickedDataLayerId = clientId;
  this._clickedObject = obj;
};

dvt.ThematicMap.prototype.setEventClientId = function(clientId) {
  this._eventClientId = clientId;
};


/**
 * @override
 */
dvt.ThematicMap.prototype.dispatchEvent = function(event) {
  var type = event['type'];
  if (type == 'selection') {
    this._handleSelectionEvent(event);
  }
  else if (type == dvt.MapDrillEvent.TYPE) {
    this._handleDrillEvent(event);
  }
  else if (type == 'adfShowPopup' || type == 'adfHidePopup') {
    event['clientId'] = this._eventClientId;
  }
  dvt.ThematicMap.superclass.dispatchEvent.call(this, event);
};


/**
 * Process a selection event before sending it to the peer
 * @param {object} event The selection event to process
 * @private
 */
dvt.ThematicMap.prototype._handleSelectionEvent = function(event) {
  if (this._clickedDataLayerId) {
    this._selectedRowKeys = event['selection'];
    var dataLayer = this.getLayer(this._clickedLayerName).getDataLayer(this._clickedDataLayerId);
    this._selectedAreas[this._clickedLayerName] = dataLayer.getSelectedAreas(this._selectedRowKeys);
    this._updateDrillButton(this._clickedLayerName);
    event['clientId'] = this._clickedDataLayerId;

    // Save fit to region object
    if (this._clickedObject && !(this._clickedObject instanceof dvt.Marker))
      this._zoomToFitObject = this._clickedObject;
  } else {
    this._updateDrillButton(null);
    this._zoomToFitObject = null;
  }
};

dvt.ThematicMap.prototype._hideSelectionMenu = function() {
  if (this._selectionText) {
    this.removeChild(this._selectionText);
    this._selectionText = null;
  }
};

/**
 * Enables or disables the drill buttons before and after drilling
 * @param {string} layerName
 * @param {boolean=} isDrillDown Optional param indicating whether a drill down just occurred
 * @private
 */
dvt.ThematicMap.prototype._updateDrillButton = function(layerName, isDrillDown) {
  if (this._controlPanel && this._drillMode && this._drillMode != 'none') {
    var childLayer = this.getDrillChildLayer(layerName);
    var parentLayer = this.getDrillParentLayer(layerName);
    if (childLayer && !isDrillDown)
      this._controlPanel.setEnabledDrillDownButton(true);
    else
      this._controlPanel.setEnabledDrillDownButton(false);

    if (parentLayer)
      this._controlPanel.setEnabledDrillUpButton(true);
    else
      this._controlPanel.setEnabledDrillUpButton(false);
  }
};

dvt.ThematicMap.prototype._handleDrillEvent = function(event) {
  event.addParam('clientId', this._eventClientId);
  if (this._drillMode == 'multiple')
    this._drilledRowKeys = this._drilledRowKeys.concat(this._selectedRowKeys);
  else
    this._drilledRowKeys = this._selectedRowKeys;

  var drillType = event.getDrillType();
  if (drillType == dvt.MapDrillEvent.DRILL_UP)
    this.drillUp();
  if (drillType == dvt.MapDrillEvent.DRILL_DOWN)
    this.drillDown();
  else if (drillType == dvt.MapDrillEvent.RESET)
    this.resetMap();

  event.setDisclosed(this._drilledRowKeys);
};

/**
 * Releases all component resources to prevent memory leaks.
 * @override
 * @export
 */
dvt.ThematicMap.prototype.destroy = function() {
  dvt.ThematicMap.superclass.destroy.call(this);
  if (this._eventHandler) {
    this._eventHandler.destroy();
    this._eventHandler = null;
  }
};


/**
 * Hook for cleaning up animation behavior at the end of the animation.
 * @protected
 */
dvt.ThematicMap.prototype.OnAnimationEnd = function() {
  // Add control panel back to pzc
  if (this._controlPanel)
    this._pzc.addChild(this._controlPanel);

  if (this._oldPzc) {
    this.removeChild(this._oldPzc);
    this._oldPzc = null;
  }

  // Remove the animation reference
  this._animation = null;

  // After the initial render animations we should perform any additional zooms
  if (this._initialZooming)
    this._zoomData();

  // Initial Highlighting
  if (this.Options['highlightedCategories'] && this.Options['highlightedCategories'].length > 0)
    this.highlight(this.Options['highlightedCategories']);

  // Restore event listeners
  if (this._bListenersRemoved) {
    this._eventHandler.addListeners(this);
    this._bListenersRemoved = false;
  }
};

dvt.ThematicMap.prototype.OnDrillAnimationEnd = function() {
  this._cleanUpDrilledObjects();
  // Remove the animation reference
  this._animation = null;
  // Restore event listeners
  this._eventHandler.addListeners(this);
};


/**
 * Removes the drilled objects from the map
 * @private
 */
dvt.ThematicMap.prototype._cleanUpDrilledObjects = function() {
  if (this._drillAnimFadeOutObjs.length > 0) {
    for (var i = 0; i < this._drillAnimFadeOutObjs.length; i++) {
      var obj = this._drillAnimFadeOutObjs[i];
      if (obj) {
        if (obj instanceof DvtMapLabel) {
          obj.reset();
        } else {
          if (obj.isDrilled && obj.isDrilled()) {
            obj.setAlpha(0);
            continue;
          }
          var parent = obj.getParent();
          if (parent)
            parent.removeChild(obj);
        }
      }
    }
    this._drillAnimFadeOutObjs = [];
  }
};

/*
 * Prototype for view switcher. Currently gets the only the area data objects from the top layer
 */
dvt.ThematicMap.prototype.getShapesForViewSwitcher = function(bOld) {
  var shapes = {};
  var dataLayers = this._topLayer.getDataLayers();
  for (var id in dataLayers) {
    var areaObjs = dataLayers[id].getAreaObjects();
    for (var i = 0; i < areaObjs.length; i++) {
      var areaObj = areaObjs[i];
      var disp = areaObj.getDisplayable();
      shapes[areaObj.getId()] = disp; //path
    }
    break;
  }
  return shapes;
};

/**
 * Get show popup behaviors
 * @return {array} array of spb's
 */
dvt.ThematicMap.prototype.getShowPopupBehaviors = function() {
  return this._showPopupBehaviors;
};

/**
 * Add show popup behavior
 * @param {array} spbs array of DvtAfShowPopupBehavior
 */
dvt.ThematicMap.prototype.setShowPopupBehaviors = function(spbs) {
  this._showPopupBehaviors = spbs;
};

/**
 * Returns the automation object for this thematic map
 * @return {dvt.Automation} The automation object
 * @export
 */
dvt.ThematicMap.prototype.getAutomation = function() {
  if (!this.Automation)
    this.Automation = new DvtThematicMapAutomation(this);
  return this.Automation;
};

/**
 * @override
 */
dvt.ThematicMap.prototype.GetComponentDescription = function() {
  return dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'THEMATIC_MAP');
};

/**
 * Callback method that handles legend events
 * @param {dvt.ResizeEvent} event
 * @param {object} source The component that is the source of the event, if available
 */
dvt.ThematicMap.prototype.processLegendEvent = function(event, source) {
  // do nothing at the moment
  if (event['type'] == dvt.ResizeEvent.RESIZE_EVENT && this._legend) {
    this._legend.FireListener(event);
  }
};

/**
 * @override
 * @export
 */
dvt.ThematicMap.prototype.highlight = function(categories) {
  // Update the options
  this.Options['highlightedCategories'] = dvt.JsonUtils.clone(categories);

  // Perform the highlighting
  dvt.CategoryRolloverHandler.highlight(categories, this.getNavigableAreas().concat(this.getNavigableObjects()), this.Options['highlightMatch'] == 'any');
};

/**
 * Hides or shows default hover effect on the specified data item
 * @param {string} id The data item id
 * @param {boolean} hovered True to show hover effect
 * @export
 */
dvt.ThematicMap.prototype.processDefaultHoverEffect = function(id, hovered) {
  var dataItem = this._getDataItemById(id);
  if (dataItem)
    dataItem.processDefaultHoverEffect(hovered);
};

/**
 * Hides or shows default selection effect on the specified data item
 * @param {string} id The data item id
 * @param {boolean} selected True to show selection effect
 * @export
 */
dvt.ThematicMap.prototype.processDefaultSelectionEffect = function(id, selected) {
  var dataItem = this._getDataItemById(id);
  if (dataItem)
    dataItem.processDefaultSelectionEffect(selected);
};

/**
 * Hides or shows default keyboard focus effect on the specified data item
 * @param {string} id The data item id
 * @param {boolean} focused True to show keyboard focus effect
 * @export
 */
dvt.ThematicMap.prototype.processDefaultFocusEffect = function(id, focused) {
  var dataItem = this._getDataItemById(id);
  if (dataItem)
    dataItem.processDefaultFocusEffect(focused);
};

/**
 * Retrieves a data item by id
 * @param {string} id The id of the data item to retreive
 * @return {DvtMapObjPeer}
 * @private
 */
dvt.ThematicMap.prototype._getDataItemById = function(id) {
  for (var i = 0; i < this._layers.length; i++) {
    var dataLayers = this._layers[i].getDataLayers();
    for (var dlId in dataLayers) {
      var dataObjs = dataLayers[dlId].getDataObjects();
      for (var j = 0; j < dataObjs.length; j++) {
        if (dataObjs[j].getId() === id)
          return dataObjs[j];
      }
    }
  }
  return null;
};

/**
 * Retrieves a map area by area name
 * @param {string} areaName
 * @param {DvtMapDataLayer} dataLayer
 * @return {DvtMapAreaPeer}
 * @private
 */
dvt.ThematicMap.prototype._getAreaFromDataLayer = function(areaName, dataLayer) {
  var dataObjs = dataLayer.getAreaObjects();
  for (var j = 0; j < dataObjs.length; j++) {
    if (dataObjs[j].getLocation() === areaName)
      return dataObjs[j];
  }
  return null;
};
/**
 * Default values and utility functions for thematic map component versioning.
 * @class
 * @constructor
 * @extends {dvt.BaseComponentDefaults}
 */
var DvtThematicMapDefaults = function() {
  this.Init({'fusion': DvtThematicMapDefaults.DEFAULT,
    'alta': DvtThematicMapDefaults.SKIN_ALTA});
};

dvt.Obj.createSubclass(DvtThematicMapDefaults, dvt.BaseComponentDefaults);

DvtThematicMapDefaults.DEFAULT = {
  'animationDuration' : 500,
  'animationOnDisplay' : 'none',
  'animationOnDrill' : 'none',
  'animationOnMapChange' : 'none',
  'controlPanelBehavior' : 'hidden',
  'drilling' : 'none',
  'highlightMatch' : 'all',
  'hoverBehavior': 'none',
  'initialZooming' : 'none',
  'markerZoomBehavior' : 'fixed',
  'panning' : 'none',
  'tooltipDisplay' : 'auto',
  'touchResponse' : 'auto',
  'visualEffects': 'none',
  'zooming' : 'none',
  'styleDefaults' : {
    'skin' : 'alta',
    'areaStyle' : 'background-color:#B8CDEC;border-color:#FFFFFF;',
    'hoverBehaviorDelay' : 200,
    'dataAreaDefaults' : {
      'borderColor' : '#FFFFFF',
      'drilledInnerColor' : '#FFFFFF',
      'drilledOuterColor' : '#000000',
      'hoverColor' : '#FFFFFF',
      'opacity' : 1,
      'selectedInnerColor' : '#FFFFFF',
      'selectedOuterColor' : '#000000'
    },
    'dataMarkerDefaults' : {
      'borderColor' : '#FFFFFF',
      'borderStyle' : 'solid',
      'borderWidth' : 0.5,
      'color' : '#000000',
      'height' : 8,
      'labelStyle' : 'font-family:Tahoma;font-size:13pt;color:#000000',
      'opacity' : 0.4,
      'scaleX' : 1,
      'scaleY' : 1,
      'shape' : 'circle',
      'width' : 8
    },
    'labelStyle' : 'font-family:Tahoma;font-size:11pt;'
  },
  // for amx only
  'legend' : {
    'position' : 'auto', 'rendered' : true, 'layout' : {
      'gapRatio' : 1.0
    }
  },
  'layout' : {
    'gapRatio' : null, // gapRatio is dynamic based on the component size
    // TODO, the following are internal and should be moved to a _layout object
    'legendMaxSize' : 0.3, 'legendGap' : 10
  },
  'resources' : {
    'images' : {},
    'translations' : {}
  }
};

DvtThematicMapDefaults.SKIN_ALTA = {
  'styleDefaults' : {
    'areaStyle' : 'background-color:#DDDDDD;border-color:#FFFFFF;',
    'dataAreaDefaults' : {
      'drilledOuterColor' : '#0572CE'
    },
    'dataMarkerDefaults' : {
      'color' : 'rgb(51,51,51)',
      'labelStyle' : dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'color:#333333',
      'opacity' : 1
    },
    'labelStyle' : dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12
  }
};

DvtThematicMapDefaults.DEFAULT_AREA_LAYER = {
  'animationOnLayerChange' : 'none',
  'labelDisplay' : 'auto',
  'labelType' : 'short'
};

DvtThematicMapDefaults.DEFAULT_DATA_LAYER = {
  'animationOnDataChange' : 'none',
  'selectionMode' : 'none'
};


/**
 * Combines the user options with the defaults for the specified version for an area layer.
 * Returns the combined options object.  This object will contain internal attribute values and should be
 * accessed in internal code only.
 * @param {object} userOptions The object containing options specifications for this component.
 * @return {object} The combined options object.
 */
DvtThematicMapDefaults.prototype.calcAreaLayerOptions = function(userOptions) {
  return dvt.JsonUtils.merge(userOptions, DvtThematicMapDefaults.DEFAULT_AREA_LAYER);
};


/**
 * Combines the user options with the defaults for the specified version for a data layer.
 * Returns the combined options object.  This object will contain internal attribute values and should be
 * accessed in internal code only.
 * @param {object} userOptions The object containing options specifications for this component.
 * @return {object} The combined options object.
 */
DvtThematicMapDefaults.prototype.calcDataLayerOptions = function(userOptions) {
  return dvt.JsonUtils.merge(userOptions, DvtThematicMapDefaults.DEFAULT_DATA_LAYER);
};


/**
 * Scales down gap sizes based on the size of the component.
 * @param {dvt.ThematicMap} map The thematic map that is being rendered.
 * @param {Number} defaultSize The default gap size.
 * @return {Number}
 */
DvtThematicMapDefaults.getGapSize = function(tmap, defaultSize) {
  return Math.ceil(defaultSize * tmap.getGapRatio());
};
// APIs called by the ADF Faces drag source for dvt.ThematicMap

dvt.ThematicMap.prototype._getCurrentDragSource = function() {
  for (var i = 0; i < this._layers.length; i++) {
    var dataLayers = this._layers[i].getDataLayers();
    for (var id in dataLayers) {
      var dataLayer = dataLayers[id];
      var dragSource = dataLayer.getDragSource();
      if (dragSource && dragSource.getDragCandidate())
        return dragSource;
    }
  }
  return null;
};


/**
 * If this object supports drag, returns the client id of the drag component.
 * Otherwise returns null.
 * @param mouseX the x coordinate of the mouse
 * @param mouseY the x coordinate of the mouse
 * @param clientIds the array of client ids of the valid drag components
 */
dvt.ThematicMap.prototype.isDragAvailable = function(mouseX, mouseY, clientIds) {
  this._dragAllowed = false;
  var dragSource = this._getCurrentDragSource();
  return dragSource ? dragSource.isDragAvailable(clientIds) : false;
};


/**
 * Returns the transferable object for a drag initiated at these coordinates.
 */
dvt.ThematicMap.prototype.getDragTransferable = function(mouseX, mouseY) {
  var dragSource = this._getCurrentDragSource();
  return dragSource ? dragSource.getDragTransferable(mouseX, mouseY) : null;
};


/**
 * Returns the feedback for the drag operation.
 */
dvt.ThematicMap.prototype.getDragOverFeedback = function(mouseX, mouseY) {
  var dragSource = this._getCurrentDragSource();
  return dragSource ? dragSource.getDragOverFeedback(mouseX, mouseY) : null;
};


/**
 * Returns an Object containing the drag context info.
 */
dvt.ThematicMap.prototype.getDragContext = function(mouseX, mouseY) {
  var dragSource = this._getCurrentDragSource();
  return dragSource ? dragSource.getDragContext(mouseX, mouseY) : null;
};


/**
 * Returns the offset to use for the drag feedback. This positions the drag
 * feedback relative to the pointer.
 */
dvt.ThematicMap.prototype.getDragOffset = function(mouseX, mouseY) {
  var dragSource = this._getCurrentDragSource();
  return dragSource ? dragSource.getDragOffset(mouseX, mouseY) : null;
};


/**
 * Returns the offset from the mouse pointer where the drag is considered to be located.
 */
dvt.ThematicMap.prototype.getPointerOffset = function(xOffset, yOffset) {
  var dragSource = this._getCurrentDragSource();
  return dragSource ? dragSource.getPointerOffset(xOffset, yOffset) : null;
};


/**
 * Notifies the component that a drag started.
 */
dvt.ThematicMap.prototype.initiateDrag = function() {
  var dragSource = this._getCurrentDragSource();
  if (dragSource)
    dragSource.initiateDrag();
};


/**
 * Clean up after the drag is completed.
 */
dvt.ThematicMap.prototype.dragDropEnd = function() {
  var dragSource = this._getCurrentDragSource();
  if (dragSource)
    dragSource.dragDropEnd();
  // : clean up the pan zoom touches after DnD
  this.getPanZoomCanvas().resetTouchTargets();
};


/**
 * Implemented for dvt.DragRecognizer
 * @override
 */
dvt.ThematicMap.prototype.prepDrag = function() {
  if (this._panning)
    this._startDragDropTimer(1000);
  else
    this._dragAllowed = true;
};


/**
 * Implemented for dvt.DragRecognizer
 * @override
 */
dvt.ThematicMap.prototype.abortPrep = function() {
  this._stopDragDropTimer();
};


/**
 * Implemented for dvt.DragRecognizer
 * @override
 */
dvt.ThematicMap.prototype.recognizeDrag = function() {
  this._stopDragDropTimer();
  return this._dragAllowed;
};


/**
 * Starts the drag timer to prevent immediately initiating a drag action when panning is available
 * @param {number} time The time in milliseconds to set the timer for
 * @private
 */
dvt.ThematicMap.prototype._startDragDropTimer = function(time) {
  this._dragDropTimer = new dvt.Timer(this.getCtx(), time, this._handleDragDropTimer, this, 1);
  this._dragDropTimer.start();
};


/**
 * Stops the drag timer and allows a drag action to initiate
 * @private
 */
dvt.ThematicMap.prototype._handleDragDropTimer = function() {
  this._stopDragDropTimer();
  this._dragAllowed = true;
};


/**
 * Stops the drag timer
 * @private
 */
dvt.ThematicMap.prototype._stopDragDropTimer = function() {
  if (this._dragDropTimer) {
    this._dragDropTimer.stop();
    this._dragDropTimer = null;
  }
};
// APIs called by the ADF Faces drop target for dvt.ThematicMap

dvt.ThematicMap.prototype._getCurrentDropTarget = function(mouseX, mouseY) {
  for (var i = 0; i < this._layers.length; i++) {
    if (this._layers[i].getDropTarget) {
      var dropTarget = this._layers[i].getDropTarget();
      if (dropTarget && dropTarget.getDropSite(mouseX, mouseY))
        return dropTarget;
    }
  }
  return null;
};


/**
 * If a drop is possible at these mouse coordinates, returns the client id
 * of the drop component. Returns null if drop is not possible.
 */
dvt.ThematicMap.prototype.acceptDrag = function(mouseX, mouseY, clientIds) {
  var zoom = this._pzc.getZoom();
  mouseX = (mouseX - this._pzc.getPanX()) / zoom;
  mouseY = (mouseY - this._pzc.getPanY()) / zoom;
  this._dropTarget = this._getCurrentDropTarget(mouseX, mouseY);
  if (this._dropTarget)
    return this._dropTarget.acceptDrag(mouseX, mouseY, clientIds);
  else
    return null;
};


/**
 * Paints drop site feedback as a drag enters the drop site.
 */
dvt.ThematicMap.prototype.dragEnter = function() {
  if (this._dropTarget)
    return this._dropTarget.dragEnter();
  else
    return null;
};


/**
 * Cleans up drop site feedback as a drag exits the drop site.
 */
dvt.ThematicMap.prototype.dragExit = function() {
  if (this._dropTarget)
    return this._dropTarget.dragExit();
  else
    return null;
};


/**
 * Returns the object representing the drop site. This method is called when a valid
 * drop is performed.
 */
dvt.ThematicMap.prototype.getDropSite = function(mouseX, mouseY) {
  var zoom = this._pzc.getZoom();
  mouseX = (mouseX - this._pzc.getPanX()) / zoom;
  mouseY = (mouseY - this._pzc.getPanY()) / zoom;
  if (this._dropTarget)
    return this._dropTarget.getDropSite(mouseX, mouseY);
  else
    return null;
};
/**
 * Drop Target event handler for dvt.ThematicMap
 * @param {DvtMapAreaLayer} areaLayer The area layer this drop target belongs to
 * @param {String} basemap The basemap name
 * @extends {dvt.DropTarget}
 * @constructor
 */
var DvtThematicMapDropTarget = function(areaLayer, basemap) {
  this._areaLayer = areaLayer;
  this._basemap = basemap;
};

dvt.Obj.createSubclass(DvtThematicMapDropTarget, dvt.DropTarget);


/**
 * @override
 */
DvtThematicMapDropTarget.prototype.acceptDrag = function(mouseX, mouseY, clientIds) {
  // If there is no obj under the point, then don't accept the drag
  var obj = this._areaLayer.__getObjectUnderPoint(mouseX, mouseY);
  if (!obj) {
    this._areaLayer.__showDropSiteFeedback(null);
    return null;
  }
  else if (obj != this._dropSite) {
    this._areaLayer.__showDropSiteFeedback(obj);
    this._dropSite = obj;
  }

  // Return the first clientId, since this component has only a single drag source
  return clientIds[0];
};


/**
 * @override
 */
DvtThematicMapDropTarget.prototype.dragExit = function() {
  // Remove drop site feedback
  this._areaLayer.__showDropSiteFeedback(null);
  this._dropSite = null;
};


/**
 * @override
 */
DvtThematicMapDropTarget.prototype.getDropSite = function(mouseX, mouseY) {
  var obj = this._areaLayer.__getObjectUnderPoint(mouseX, mouseY);
  if (obj) {
    var projPoint = DvtThematicMapProjections.inverseProject(mouseX, mouseY, this._basemap);
    return {regionId: obj.getAreaId(), localX: projPoint.x, localY: projPoint.y};
  } else {
    return null;
  }
};
/**
 * Provides automation services for a DVT component.
 * @class  DvtThematicMapAutomation
 * @param {dvt.ThematicMap} dvtComponent
 * @implements {dvt.Automation}
 * @constructor
 * @export
 */
var DvtThematicMapAutomation = function(dvtComponent) {
  this._tmap = dvtComponent;
};

dvt.Obj.createSubclass(DvtThematicMapAutomation, dvt.Automation);


/**
 * Valid subIds inlcude:
 * <ul>
 * <li>dataLayerId:area[index]</li>
 * <li>dataLayerId:marker[index]</li>
 * <li>tooltip</li>
 * <li>controlPanel#disclosure</li>
 * <li>controlPanel#zoomToFit</li>
 * <li>controlPanel#zoomIn</li>
 * <li>controlPanel#zoomOut</li>
 * <li>controlPanel#drillDown</li>
 * <li>controlPanel#drillUp</li>
 * <li>controlPanel#reset</li>
 * </ul>
 * @override
 */
DvtThematicMapAutomation.prototype.GetSubIdForDomElement = function(displayable) {
  var logicalObj = this._tmap.getEventManager().GetLogicalObject(displayable);
  if (logicalObj && (logicalObj instanceof DvtMapAreaPeer || logicalObj instanceof DvtMapObjPeer))
    return this._getSubId(logicalObj);

  //If displayable is from control panel
  var controlPanel = this._tmap.getPanZoomCanvas().getControlPanel();
  if (controlPanel) {
    logicalObj = controlPanel.getEventManager().GetLogicalObject(displayable);
    if (logicalObj && logicalObj instanceof dvt.Button) {
      var actions = ['disclosure', 'zoomIn', 'zoomOut', 'zoomToFit', 'drillDown', 'drillUp', 'reset'];
      for (var idx = 0; idx < actions.length; idx++) {
        if (controlPanel.getActionDisplayable(actions[idx]) === logicalObj) {
          return 'controlPanel#' + actions[idx];
        }
      }
    }
  }
  return null;
};


/**
 * Valid subIds inlcude:
 * <ul>
 * <li>dataLayerId:area[index]</li>
 * <li>dataLayerId:marker[index]</li>
 * <li>tooltip</li>
 * <li>controlPanel#disclosure</li>
 * <li>controlPanel#zoomToFit</li>
 * <li>controlPanel#zoomIn</li>
 * <li>controlPanel#zoomOut</li>
 * <li>controlPanel#drillDown</li>
 * <li>controlPanel#drillUp</li>
 * <li>controlPanel#reset</li>
 * </ul>
 * @override
 * @export
 */
DvtThematicMapAutomation.prototype.getDomElementForSubId = function(subId) {
  if (subId == dvt.Automation.TOOLTIP_SUBID)
    return this.GetTooltipElement(this._tmap);

  var colonIdx = subId.indexOf(':');
  var parenIdx = subId.indexOf('[');
  if (colonIdx > 0 && parenIdx > 0) {
    var dataLayerId = subId.substring(0, colonIdx);
    var dataObjType = subId.substring(colonIdx + 1, parenIdx);
    var index = parseInt(subId.substring(parenIdx + 1, subId.length - 1));
    return this._getDomElement(dataLayerId, dataObjType, index);
  } else if (subId.lastIndexOf('controlPanel') === 0) {
    var actionIdx = subId.indexOf('#');
    if (actionIdx > 0) {
      var action = subId.substring(actionIdx + 1);
      var controlPanel = this._tmap.getPanZoomCanvas().getControlPanel();
      if (controlPanel && action) {
        var displayable = controlPanel.getActionDisplayable(action);
        return displayable ? displayable.getElem() : null;
      }
    }
  }
  return null;
};


/**
 * Returns an object containing data for a thematic map data object. Used for verification.
 * Valid verification values inlcude:
 * <ul>
 * <li>color</li>
 * <li>tooltip</li>
 * <li>label</li>
 * <li>selected</li>
 * </ul>
 * @param {String} dataLayerId The id of the data layer
 * @param {String} dataObjType The object type. Valid values are area or marker
 * @param {Number} index The index of the area or marker
 * @return {Object} An object containing data for the marker or area
 * @export
 */
DvtThematicMapAutomation.prototype.getData = function(dataLayerId, dataObjType, index) {
  var dataObj = this._getDataObject(dataLayerId, dataObjType, index);
  if (dataObj) {
    var data = {};
    data['color'] = dataObj.getDatatipColor();
    data['tooltip'] = dataObj.getShortDesc();
    var label = dataObj.getLabel();
    data['label'] = label ? label.getTextString() : null;
    data['selected'] = dataObj.isSelected();
    return data;
  }
  return null;
};


/**
 * Returns the SVG DOM Element for a given subId
 * @param {String} dataLayerId The id of the data layer
 * @param {String} dataObjType The object type. Valid values are area or marker
 * @param {Number} index The index of the area or marker
 * @return {SVGElement} The SVG DOM Element
 * @private
 */
DvtThematicMapAutomation.prototype._getDomElement = function(dataLayerId, dataObjType, index) {
  var dataObj = this._getDataObject(dataLayerId, dataObjType, index);
  if (dataObj)
    return dataObj.getDisplayable().getElem();
  return null;
};


/**
 * Returns the subId for a thematic map data object
 * @param {DvtMapObjPeer} dataObject The DvtMapObjPeer to get a subId for
 * @return {String} The subId for the DvtMapObjPeer or null if there is no match
 * @private
 */
DvtThematicMapAutomation.prototype._getSubId = function(dataObject) {
  var displayable = dataObject.getDisplayable();
  var layers = this._tmap.getAllLayers();
  for (var i = 0; i < layers.length; i++) {
    var dataLayers = layers[i].getDataLayers();
    for (var id in dataLayers) {
      if (displayable instanceof dvt.Path) {
        var areas = dataLayers[id].getAreaObjects();
        for (var k = 0; k < areas.length; k++) {
          if (areas[k] === dataObject)
            return this._getDataLayerId(id) + ':' + 'area[' + k + ']';
        }
      }
      else if (displayable instanceof dvt.SimpleMarker || displayable instanceof dvt.ImageMarker) {
        var markers = dataLayers[id].getDataObjects();
        for (var k = 0; k < markers.length; k++) {
          if (markers[k] === dataObject)
            return this._getDataLayerId(id) + ':' + 'marker[' + k + ']';
        }
      }
    }
  }
  return null;
};


/**
 * Returns the DvtMapObjPeer for the given data layer and data object id
 * @param {String} dataLayerId The id of the data layer
 * @param {String} dataObjType The object type. Valid values are area or marker
 * @param {Number} index The index of the area or marker
 * @return {DvtMapObjPeer} The DvtMapObjPeer matching the parameters or null if none exists
 * @private
 */
DvtThematicMapAutomation.prototype._getDataObject = function(dataLayerId, dataObjType, index) {
  var layers = this._tmap.getAllLayers();
  for (var i = 0; i < layers.length; i++) {
    var dataLayers = layers[i].getDataLayers();
    for (var id in dataLayers) {
      if (this._getDataLayerId(id) == dataLayerId) {
        if (dataObjType == 'area') {
          return dataLayers[id].getDataAreaCollection()[index];
        }
        else if (dataObjType == 'marker') {
          return dataLayers[id].getDataMarkerCollection()[index];
        }
      }
    }
  }
  return null;
};


/**
 * Returns the data layer id in the expected subId format.
 * @param {String} dataLayerId The id of the data layer
 * @return {String} The id of the data layer in subId format
 * @private
 */
DvtThematicMapAutomation.prototype._getDataLayerId = function(dataLayerId) {
  // For ADF the clientId is passed in and we need to parse out just the data layerId e.g. 'demoTemplate:tm1:adl1'
  var colonIdx = dataLayerId.lastIndexOf(':');
  if (colonIdx > 0)
    return dataLayerId.substring(colonIdx + 1);
  return dataLayerId;
};
// Copyright (c) 2011, 2016, Oracle and/or its affiliates. All rights reserved.
/**
  *  Creates a map selectable shape that also supports drilling.
  *  @extends {DvtDrillablePath}
  *  @constructor
  */
var DvtDrillablePath = function(context, bSupportsVectorEffects) {
  this.Init(context, bSupportsVectorEffects);
};

dvt.Obj.createSubclass(DvtDrillablePath, dvt.Path);

// if not defined, stroke width is 1 for border effects
DvtDrillablePath.HOVER_STROKE_WIDTH = 2;
DvtDrillablePath.SELECTED_INNER_STROKE_WIDTH = 1;
DvtDrillablePath.SELECTED_OUTER_STROKE_WIDTH = 4;
DvtDrillablePath.SELECTED_HOVER_OUTER_STROKE_WIDTH = 6;
DvtDrillablePath.DISCLOSED_INNER_STROKE_WIDTH = 2;
DvtDrillablePath.DISCLOSED_OUTER_STROKE_WIDTH = 4;


/**
 *  Object initializer.
 *  @protected
 */
DvtDrillablePath.prototype.Init = function(context, bSupportsVectorEffects) {
  DvtDrillablePath.superclass.Init.call(this, context);
  this._disclosedInnerStroke = null;
  this._disclosedOuterStroke = null;
  this._disclosedInnerShape = null;
  this._disclosedOuterShape = null;
  this._isDrilled = false;
  this.Zoom = 1;
  //IE10, Flash/XML toolkit do not support vector-effects=non-scaling-stroke so we still need to set stroke width based on zoom
  this._bSupportsVectorEffects = bSupportsVectorEffects;
};

DvtDrillablePath.prototype.isDrilled = function() {
  return this._isDrilled;
};

DvtDrillablePath.prototype.setDrilled = function(drilled) {
  if (this._isDrilled == drilled)
    return;

  this._isDrilled = drilled;

  if (this.isDrilled()) {
    this._disclosedInnerShape = this.copyShape();
    this._disclosedInnerShape.setFill(null);
    this._disclosedInnerShape.setMouseEnabled(false);
    this._disclosedOuterShape = this.copyShape();
    this._disclosedOuterShape.setFill(null);
    this._disclosedOuterShape.setMouseEnabled(false);
    // because we remove the shape from the DOM, set the drill inner border on the parent directly
    var parent = this.getParent();
    parent.addChild(this._disclosedOuterShape);
    parent.addChild(this._disclosedInnerShape);
    this._disclosedInnerShape.setStroke(this._adjustStrokeZoomWidth(this._disclosedInnerStroke, DvtDrillablePath.DISCLOSED_INNER_STROKE_WIDTH));
    this._disclosedOuterShape.setStroke(this._adjustStrokeZoomWidth(this._disclosedOuterStroke, DvtDrillablePath.DISCLOSED_OUTER_STROKE_WIDTH));
    this.setMouseEnabled(false);
    // after object is drilled, it is removed from the DOM and does not recieve the hideHoverEffect call to set this flag
    this.IsShowingHoverEffect = false;
  }
  else {
    if (this.isHoverEffectShown()) {
      this.UpdateSelectionEffect();
      this.InnerShape.setStroke(this._adjustStrokeZoomWidth(this.HoverInnerStroke, 1), DvtDrillablePath.HOVER_STROKE_WIDTH);
    }
    this._disclosedOuterShape.getParent().removeChild(this._disclosedOuterShape);
    this._disclosedInnerShape.getParent().removeChild(this._disclosedInnerShape);
    this.setMouseEnabled(true);
    this.setAlpha(1);
  }
};


/**
 * @override
 */
DvtDrillablePath.prototype.setSelected = function(selected) {
  if (this.IsSelected == selected)
    return;
  if (selected) {
    if (this.isHoverEffectShown()) {
      this.CreateSelectedHoverStrokes();
      this.SelectedHoverInnerStroke = this._adjustStrokeZoomWidth(this.SelectedHoverInnerStroke, DvtDrillablePath.HOVER_STROKE_WIDTH);
      this.SelectedHoverOuterStroke = this._adjustStrokeZoomWidth(this.SelectedHoverOuterStroke, DvtDrillablePath.SELECTED_HOVER_OUTER_STROKE_WIDTH);
    } else {
      this.SelectedInnerStroke = this._adjustStrokeZoomWidth(this.SelectedInnerStroke, DvtDrillablePath.SELECTED_INNER_STROKE_WIDTH);
      this.SelectedOuterStroke = this._adjustStrokeZoomWidth(this.SelectedOuterStroke, DvtDrillablePath.SELECTED_OUTER_STROKE_WIDTH);
    }
  }
  DvtDrillablePath.superclass.setSelected.call(this, selected);
};


/**
 * @override
 */
DvtDrillablePath.prototype.showHoverEffect = function() {
  if (this.isSelected()) {
    this.CreateSelectedHoverStrokes();
    this.SelectedHoverInnerStroke = this._adjustStrokeZoomWidth(this.SelectedHoverInnerStroke, DvtDrillablePath.HOVER_STROKE_WIDTH);
    this.SelectedHoverOuterStroke = this._adjustStrokeZoomWidth(this.SelectedHoverOuterStroke, DvtDrillablePath.SELECTED_HOVER_OUTER_STROKE_WIDTH);
  } else {
    this.HoverInnerStroke = this._adjustStrokeZoomWidth(this.HoverInnerStroke, DvtDrillablePath.HOVER_STROKE_WIDTH);
  }
  DvtDrillablePath.superclass.showHoverEffect.call(this);
};


/**
 * @override
 */
DvtDrillablePath.prototype.CreateSelectedHoverStrokes = function() {
  if (!this.SelectedHoverInnerStroke) {
    this.SelectedHoverInnerStroke = this.HoverInnerStroke.clone();
    this.SelectedHoverInnerStroke.setWidth(DvtDrillablePath.HOVER_STROKE_WIDTH);
    if (this._bSupportsVectorEffects)
      this.SelectedHoverInnerStroke.setFixedWidth(true);
  }
  if (!this.SelectedHoverOuterStroke) {
    this.SelectedHoverOuterStroke = this.SelectedOuterStroke.clone();
    this.SelectedHoverOuterStroke.setWidth(DvtDrillablePath.SELECTED_HOVER_OUTER_STROKE_WIDTH);
    if (this._bSupportsVectorEffects)
      this.SelectedHoverOuterStroke.setFixedWidth(true);
  }
};


/**
 * @override
 */
DvtDrillablePath.prototype.hideHoverEffect = function() {
  if (this.isSelected()) {
    this.SelectedInnerStroke = this._adjustStrokeZoomWidth(this.SelectedInnerStroke, DvtDrillablePath.SELECTED_INNER_STROKE_WIDTH);
    this.SelectedOuterStroke = this._adjustStrokeZoomWidth(this.SelectedOuterStroke, DvtDrillablePath.SELECTED_OUTER_STROKE_WIDTH);
  }
  DvtDrillablePath.superclass.hideHoverEffect.call(this);
};


/**
 * @override
 */
DvtDrillablePath.prototype.setHoverStroke = function(innerStroke, outerStroke) {
  DvtDrillablePath.superclass.setHoverStroke.call(this, innerStroke, outerStroke);
  if (this._bSupportsVectorEffects) {
    if (this.HoverInnerStroke)
      this.HoverInnerStroke.setFixedWidth(true);
    if (this.HoverOuterStroke)
      this.HoverOuterStroke.setFixedWidth(true);
  }
  return this;
};


/**
 * @override
 */
DvtDrillablePath.prototype.setSelectedStroke = function(innerStroke, outerStroke) {
  DvtDrillablePath.superclass.setSelectedStroke.call(this, innerStroke, outerStroke);
  if (this._bSupportsVectorEffects) {
    if (this.SelectedInnerStroke)
      this.SelectedInnerStroke.setFixedWidth(true);
    if (this.SelectedOuterStroke)
      this.SelectedOuterStroke.setFixedWidth(true);
  }
  return this;
};


/**
 * @override
 */
DvtDrillablePath.prototype.setSelectedHoverStroke = function(innerStroke, outerStroke) {
  DvtDrillablePath.superclass.setSelectedHoverStroke.call(this, innerStroke, outerStroke);
  if (this._bSupportsVectorEffects) {
    if (this.SelectedHoverInnerStroke)
      this.SelectedHoverInnerStroke.setFixedWidth(true);
    if (this.SelectedHoverOuterStroke)
      this.SelectedHoverOuterStroke.setFixedWidth(true);
  }
  return this;
};


/**
 * Sets the disclosed stroke for this shape.
 * @return DvtDrillablePath To be used for chaining
 */
DvtDrillablePath.prototype.setDisclosedStroke = function(innerStroke, outerStroke) {
  this._disclosedInnerStroke = innerStroke;
  if (this._disclosedInnerStroke && this._bSupportsVectorEffects)
    this._disclosedInnerStroke.setFixedWidth(true);
  this._disclosedOuterStroke = outerStroke;
  if (this._disclosedOuterStroke && this._bSupportsVectorEffects)
    this._disclosedOuterStroke.setFixedWidth(true);
  return this;
};

DvtDrillablePath.prototype.savePatternFill = function(fill) {
  this._ptFill = fill;
};

DvtDrillablePath.prototype.getSavedPatternFill = function() {
  return this._ptFill;
};

DvtDrillablePath.prototype._updateStrokeZoomWidth = function(shape, fixedWidth) {
  if (!this._bSupportsVectorEffects) {
    var stroke = shape.getStroke();
    if (stroke) {
      stroke = stroke.clone();
      stroke.setWidth(fixedWidth / this.Zoom);
      shape.setStroke(stroke);
    }
  }
};

DvtDrillablePath.prototype._adjustStrokeZoomWidth = function(stroke, fixedWidth) {
  if (!this._bSupportsVectorEffects) {
    var adjustedStroke = stroke.clone();
    adjustedStroke.setWidth(fixedWidth / this.Zoom);
    return adjustedStroke;
  }
  return stroke;
};

DvtDrillablePath.prototype.handleZoomEvent = function(pzcMatrix) {
  this.Zoom = pzcMatrix.getA();
  if (this.isDrilled()) {
    this._updateStrokeZoomWidth(this._disclosedInnerShape, DvtDrillablePath.DISCLOSED_INNER_STROKE_WIDTH);
    this._updateStrokeZoomWidth(this._disclosedOuterShape, DvtDrillablePath.DISCLOSED_OUTER_STROKE_WIDTH);
  }
  else if (this.isSelected()) {
    if (this.isHoverEffectShown()) {
      this._updateStrokeZoomWidth(this.InnerShape, DvtDrillablePath.HOVER_STROKE_WIDTH);
      this._updateStrokeZoomWidth(this, DvtDrillablePath.SELECTED_HOVER_OUTER_STROKE_WIDTH);
    } else {
      this._updateStrokeZoomWidth(this.InnerShape, DvtDrillablePath.SELECTED_INNER_STROKE_WIDTH);
      this._updateStrokeZoomWidth(this, DvtDrillablePath.SELECTED_OUTER_STROKE_WIDTH);
    }
  }
  else if (this.isHoverEffectShown()) {
    this._updateStrokeZoomWidth(this.InnerShape, DvtDrillablePath.HOVER_STROKE_WIDTH);
  }
  else {
    this._updateStrokeZoomWidth(this, 1);
  }
};
// Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
/**
  *  Creates a custom data item that supports interaction and accessibility.
  *  @extends {dvt.Container}
  *  @constructor
  *  @param {dvt.Context} context The rendering context
  *  @param {SVGElement||dvt.BaseComponent} dataItem The custom data item which can be either an SVGElement or a dvt.BaseComponent
  *  @param {object} styles The object containing interaction styling info
  */
var DvtCustomDataItem = function(context, dataItem, styles) {
  this.Init(context, dataItem, styles);
};

dvt.Obj.createSubclass(DvtCustomDataItem, dvt.Container);

/**
 * Constant for the bounding rectangle padding
 * @const
 * @private
 */
DvtCustomDataItem._RECT_PADDING = 5;

/**
 *  Object initializer.
 *  @param {dvt.Context} context The rendering context
 *  @param {SVGElement||dvt.BaseComponent} dataItem The custom data item which can be either an SVGElement or a dvt.BaseComponent
 *  @param {object} styles The object containing interaction styling info
 *  @protected
 */
DvtCustomDataItem.prototype.Init = function(context, dataItem, styles) {
  DvtCustomDataItem.superclass.Init.call(this, context);

  this._dataItem = dataItem;
  if (dataItem instanceof dvt.BaseComponent) {
    this._width = dataItem.getWidth();
    this._height = dataItem.getHeight();
    this.addChild(dataItem);
  } else {
    this.getElem().appendChild(dataItem);//dataItem is output of a custom renderer function or a knockout template @HtmlUpdateOk
    // TODO make this more efficient by defering to render call
    var dim = dvt.DisplayableUtils.getDimensionsForced(context, this);
    this._width = dim.w;
    this._height = dim.h;
  }

  // Create bounding rect where we will apply interaction effects and wai-aria properties
  this._boundingRect = new dvt.Rect(context, -DvtCustomDataItem._RECT_PADDING,
      -DvtCustomDataItem._RECT_PADDING,
      this._width + 2 * DvtCustomDataItem._RECT_PADDING,
      this._height + 2 * DvtCustomDataItem._RECT_PADDING);
  this._boundingRect.setInvisibleFill();
  // TODO cleanup stroke styles
  var his = new dvt.SolidStroke(styles['selectedInnerColor'], 1, 2);
  var hos = new dvt.SolidStroke('rgb(235, 236, 237)', 1, 4);
  var sis = new dvt.SolidStroke(styles['selectedInnerColor'], 1, 2);
  var sos = new dvt.SolidStroke(styles['selectedOuterColor'], 1, 4);
  var shis = new dvt.SolidStroke(styles['selectedInnerColor'], 1, 2);
  var shos = new dvt.SolidStroke(styles['selectedOuterColor'], 1, 6);
  this._boundingRect.setHoverStroke(his, hos).setSelectedStroke(sis, sos).setSelectedHoverStroke(shis, shos);
  this.addChildAt(this._boundingRect, 0);
};

/**
 * For accessibility, a custom svg data item sets wai-aria information on its bounding rect for VoiceOver.
 * @override
 */
DvtCustomDataItem.prototype.setAriaProperty = function(property, value) {
  if (dvt.Agent.isTouchDevice())
    this._boundingRect.setAriaProperty(property, value);
  else
    DvtCustomDataItem.superclass.setAriaProperty.call(this, property, value);
};

/**
 * For accessibility, a custom svg data item sets wai-aria information on its bounding rect for VoiceOver.
 * @override
 */
DvtCustomDataItem.prototype.setAriaRole = function(role) {
  if (dvt.Agent.isTouchDevice())
    this._boundingRect.setAriaRole(role);
  else
    DvtCustomDataItem.superclass.setAriaRole.call(this, role);
};

/**
 * Returns the width of the custom svg dom element
 * @return {number}
 */
DvtCustomDataItem.prototype.getWidth = function() {
  return this._width;
};

/**
 * Returns the height of the custom svg dom element
 * @return {number}
 */
DvtCustomDataItem.prototype.getHeight = function() {
  return this._height;
};

/**
 * Sets whether this data item is selectable.
 * Implemented to match selection APIs on dvt.Shape called by the DvtMapObjPeer.
 * @param {boolean} bSelectable True if this data item is selectable
 */
DvtCustomDataItem.prototype.setSelectable = function(bSelectable) {
  this._boundingRect.setSelectable(bSelectable);
};

/**
 * Returns true if this data item is selectable.
 * Implemented to match selection APIs on dvt.Shape called by the DvtMapObjPeer.
 * @return {boolean}
 */
DvtCustomDataItem.prototype.isSelectable = function() {
  return this._boundingRect.isSelectable();
};

/**
 * Returns whether this data item is selected.
 * Implemented to match selection APIs on dvt.Shape called by the DvtMapObjPeer.
 * @return {boolean}
 */
DvtCustomDataItem.prototype.isSelected = function() {
  return this._boundingRect.isSelected();
};

/**
 * Sets whether this data item is selected.
 * Implemented to match selection APIs on dvt.Shape called by the DvtMapObjPeer.
 * @param {boolean} selected True if this data item is selected
 */
DvtCustomDataItem.prototype.setSelected = function(selected) {
  this._boundingRect.setSelected(selected);
};

/**
 * Shows the hover effect for this displayable.
 * Implemented to match selection APIs on dvt.Shape called by the DvtMapObjPeer.
 */
DvtCustomDataItem.prototype.showHoverEffect = function() {
  this._boundingRect.showHoverEffect();
};

/**
 * Hides the hover effect for this displayable.
 * Implemented to match selection APIs on dvt.Shape called by the DvtMapObjPeer.
 */
DvtCustomDataItem.prototype.hideHoverEffect = function() {
  this._boundingRect.hideHoverEffect();
};

/**
 * Returns the root element representing this data item which can either be a custom svg element or a DvtBaseComopnent.
 * @return {SVGElement|dvt.BaseComponent}
 */
DvtCustomDataItem.prototype.getRootElement = function() {
  return this._dataItem;
};

/**
 * Updates the current root element representing this data item which can either be a custom svg element or a DvtBaseComopnent
 * with the new which is used to update interaction effects.
 * @param {SVGElement|dvt.BaseComponent} rootElement The new root element
 */
DvtCustomDataItem.prototype.updateRootElement = function(rootElement) {
  if (this._dataItem === rootElement)
    return;

  if (this._dataItem)
    this._dataItem instanceof dvt.BaseComponent ? this.removeChild(this._dataItem) : this.getElem().removeChild(this._dataItem);

  // NOTE: Not updating width/height in this method call because we're assuming
  // that the application wouldn't want to recenter based on increased dimensions
  // caused by selection effects.
  if (rootElement instanceof dvt.BaseComponent)
    this.addChild(rootElement);
  else
    this.getElem().appendChild(rootElement);//rootElement is output of a custom renderer function or a knockout template @HtmlUpdateOk
  this._dataItem = rootElement;
};

/**
 * @override
 */
DvtCustomDataItem.prototype.fireKeyboardListener = function(event) {
  if (this._dataItem instanceof dvt.BaseComponent)
    this._dataItem.fireKeyboardListener(event);
};
// For MAF this != window and we want to use this
// For JET this isn't available in use strict mode so we want to use window
var DvtBaseMapManager;
if (this) {
  if (this['DvtBaseMapManager']) {
    DvtBaseMapManager = this['DvtBaseMapManager'];
  } else {
    DvtBaseMapManager = {};
    this['DvtBaseMapManager'] = DvtBaseMapManager;
    DvtBaseMapManager['_UNPROCESSED_MAPS'] = [[], [], []];
    DvtBaseMapManager['_UNPROCESSED_PARENT_UPDATES'] = [[]];
  }
} else {
  if (window['DvtBaseMapManager']) {
    DvtBaseMapManager = window['DvtBaseMapManager'];
  } else {
    DvtBaseMapManager = {};
    window['DvtBaseMapManager'] = DvtBaseMapManager;
    DvtBaseMapManager['_UNPROCESSED_MAPS'] = [[], [], []];
    DvtBaseMapManager['_UNPROCESSED_PARENT_UPDATES'] = [[]];
  }
}

dvt.Obj.createSubclass(DvtBaseMapManager, dvt.Obj, 'DvtBaseMapManager');

DvtBaseMapManager.TYPE_LABELS = 0;// contain region labels
DvtBaseMapManager.TYPE_PATH = 1;// contain region paths
DvtBaseMapManager.TYPE_PARENTREGION_CHILDREN = 2;// contains parent region id to current region id mappings.  Stored this way since mapping is only needed if child layer is present.
DvtBaseMapManager.TYPE_LABELINFO = 3;// contains leaderline info
DvtBaseMapManager.TYPE_DIM = 4; //basemap dimensions
DvtBaseMapManager._INDEX = '__index';
DvtBaseMapManager._GLOBAL_MAPS = new Object();

DvtBaseMapManager.getBaseMapDim = function(baseMapName, layerName) {
  DvtBaseMapManager._processUnprocessedMaps();
  var layer = DvtBaseMapManager._GLOBAL_MAPS[baseMapName][layerName];
  if (layer) {
    var dimAr = layer[DvtBaseMapManager.TYPE_DIM];
    if (dimAr)
      return new dvt.Rectangle(dimAr[0], dimAr[1], dimAr[2], dimAr[3]);
  }
  return null;
};

DvtBaseMapManager.getAreaLabelInfo = function(baseMapName, layerName) {
  DvtBaseMapManager._processUnprocessedMaps();
  var layer = DvtBaseMapManager._GLOBAL_MAPS[baseMapName][layerName];
  if (layer)
    return layer[DvtBaseMapManager.TYPE_LABELINFO];
  else
    return null;
};

DvtBaseMapManager.getAreaNames = function(baseMapName, layerName) {
  DvtBaseMapManager._processUnprocessedMaps();
  var layer = DvtBaseMapManager._GLOBAL_MAPS[baseMapName][layerName];
  if (layer)
    return layer[DvtBaseMapManager.TYPE_LABELS];
  else
    return null;
};

DvtBaseMapManager.getLongAreaLabel = function(baseMapName, layerName, areaId) {
  DvtBaseMapManager._processUnprocessedMaps();
  var layer = DvtBaseMapManager._GLOBAL_MAPS[baseMapName][layerName];
  var labels;
  if (layer)
    labels = layer[DvtBaseMapManager.TYPE_LABELS];
  if (labels && labels[areaId])
    return labels[areaId][1];
  else
    return null;
};

DvtBaseMapManager.getCityCoordinates = function(baseMapName, city) {
  DvtBaseMapManager._processUnprocessedMaps();
  var basemap = DvtBaseMapManager._GLOBAL_MAPS[baseMapName];
  if (basemap) {
    var cityLayer = basemap['cities'];
    if (cityLayer) {
      var coords = cityLayer[DvtBaseMapManager.TYPE_PATH][city];
      if (coords)
        return new dvt.Point(coords[0], coords[1]);
    }
  }
  return null;
};

DvtBaseMapManager.getCityLabel = function(baseMapName, city) {
  DvtBaseMapManager._processUnprocessedMaps();
  var basemap = DvtBaseMapManager._GLOBAL_MAPS[baseMapName];
  if (basemap) {
    var cityLayer = basemap['cities'];
    if (cityLayer) {
      var cityLabel = cityLayer[DvtBaseMapManager.TYPE_LABELS][city];
      if (cityLabel)
        return cityLabel[1];
    }
  }
  return null;
};

DvtBaseMapManager.getAreaCenter = function(baseMapName, layerName, areaId) {
  DvtBaseMapManager._processUnprocessedMaps();
  var basemap = DvtBaseMapManager._GLOBAL_MAPS[baseMapName];
  if (basemap) {
    var layer = basemap[layerName];
    if (layer) {
      var labelInfo = layer[DvtBaseMapManager.TYPE_LABELINFO];
      if (labelInfo && labelInfo[areaId]) {
        var ar = labelInfo[areaId][0];
        var bounds = dvt.Rectangle.create(ar);
        return bounds.getCenter();
      } else {
        // manually calculate the area path center
        var path = DvtBaseMapManager._GLOBAL_MAPS[baseMapName][layerName][DvtBaseMapManager.TYPE_PATH][areaId];
        if (!path)
          return null;
        var arPath = dvt.PathUtils.createPathArray(path);
        var dim = dvt.PathUtils.getDimensions(arPath);
        return dim.getCenter();
      }
    }
  }
  return null;
};

DvtBaseMapManager.getChildLayerName = function(baseMapName, layerName) {
  DvtBaseMapManager._processUnprocessedMaps();
  var layer = DvtBaseMapManager._GLOBAL_MAPS[baseMapName][layerName];
  if (layer)
    return DvtBaseMapManager._GLOBAL_MAPS[baseMapName][DvtBaseMapManager._INDEX][layer['__index'] + 1];
  else
    return null;
};


/**
 * Returns the parent layer name of the passed in layer or null if none exists
 * @param {String} baseMapName The basemap name
 * @param {String} layerName The layer name
 * @return {String} The parent layer name of the passed in layer
 */
DvtBaseMapManager.getParentLayerName = function(baseMapName, layerName) {
  DvtBaseMapManager._processUnprocessedMaps();
  var layer = DvtBaseMapManager._GLOBAL_MAPS[baseMapName][layerName];
  if (layer)
    return DvtBaseMapManager._GLOBAL_MAPS[baseMapName][DvtBaseMapManager._INDEX][DvtBaseMapManager._GLOBAL_MAPS[baseMapName][layerName]['__index'] - 1];
  else
    return null;
};

DvtBaseMapManager.getAreaPaths = function(baseMapName, layerName) {
  DvtBaseMapManager._processUnprocessedMaps();
  return DvtBaseMapManager._GLOBAL_MAPS[baseMapName][layerName][DvtBaseMapManager.TYPE_PATH];
};

DvtBaseMapManager.getPathForArea = function(baseMapName, layerName, area) {
  DvtBaseMapManager._processUnprocessedMaps();
  return DvtBaseMapManager._GLOBAL_MAPS[baseMapName][layerName][DvtBaseMapManager.TYPE_PATH][area];
};

DvtBaseMapManager.getChildrenForLayerAreas = function(baseMapName, layerName) {
  DvtBaseMapManager._processUnprocessedMaps();
  var childLayerName = DvtBaseMapManager.getChildLayerName(baseMapName, layerName);
  if (childLayerName) {
    var children = DvtBaseMapManager._GLOBAL_MAPS[baseMapName][childLayerName][DvtBaseMapManager.TYPE_PARENTREGION_CHILDREN];
    if (children)
      return children;
    else
      return [];
  }
  return [];
};

DvtBaseMapManager.getMapLayerName = function(baseMapName, index) {
  DvtBaseMapManager._processUnprocessedMaps();
  return DvtBaseMapManager._GLOBAL_MAPS[baseMapName][DvtBaseMapManager._INDEX][index];
};


/**
 * @export
 * called at the end of the base map JS metadata files to register new base map layer metadata
 */
DvtBaseMapManager.registerBaseMapLayer = function(baseMapName, layerName, labelMetadata, pathMetadata, parentsRegionMetadata, labelInfoMetadata, index, dim) {
  // bootstrap global base map metadata
  // find or create basemap metadata
  var basemapMetadata = DvtBaseMapManager._GLOBAL_MAPS[baseMapName];
  if (!basemapMetadata) {
    basemapMetadata = new Object();
    basemapMetadata[DvtBaseMapManager._INDEX] = new Array();
    DvtBaseMapManager._GLOBAL_MAPS[baseMapName] = basemapMetadata;
  }

  // find or create layer metadata
  var layerMetadata = basemapMetadata[layerName];
  if (!layerMetadata) {
    layerMetadata = new Object();
    basemapMetadata[layerName] = layerMetadata;
    // custom area layers don't have indicies when registered
    if (index != null)
      basemapMetadata[DvtBaseMapManager._INDEX][index] = layerName;
  }

  // register layer metadata base on type
  layerMetadata[DvtBaseMapManager.TYPE_LABELS] = labelMetadata;
  layerMetadata[DvtBaseMapManager.TYPE_PATH] = pathMetadata;
  layerMetadata[DvtBaseMapManager.TYPE_PARENTREGION_CHILDREN] = parentsRegionMetadata;
  layerMetadata[DvtBaseMapManager.TYPE_LABELINFO] = labelInfoMetadata;
  layerMetadata[DvtBaseMapManager.TYPE_DIM] = dim;
  layerMetadata[DvtBaseMapManager._INDEX] = index;
};


/**
 * @export
 */
DvtBaseMapManager.registerResourceBundle = function(baseMapName, layerName, labelMetadata) {
  var basemapMetadata = DvtBaseMapManager._GLOBAL_MAPS[baseMapName];
  if (!basemapMetadata) {
    basemapMetadata = new Object();
    DvtBaseMapManager._GLOBAL_MAPS[baseMapName] = basemapMetadata;
  }

  // find or create layer metadata
  var layerMetadata = basemapMetadata[layerName];
  if (!layerMetadata) {
    layerMetadata = new Object();
    basemapMetadata[layerName] = layerMetadata;
  }

  var layerMetadata = basemapMetadata[layerName];
  // Overwrite english labels with resource bundle language
  if (layerMetadata)
    layerMetadata[DvtBaseMapManager.TYPE_LABELS] = labelMetadata;
};


/**
 * @export
 */
DvtBaseMapManager.updateResourceBundle = function(baseMapName, layerName, labelMetadata) {
  var basemapMetadata = DvtBaseMapManager._GLOBAL_MAPS[baseMapName];
  if (basemapMetadata) {
    var layerMetadata = basemapMetadata[layerName];
    // Overwrite english labels with resource bundle language
    if (layerMetadata) {
      for (var prop in labelMetadata) {
        layerMetadata[DvtBaseMapManager.TYPE_LABELS][prop] = labelMetadata[prop];
      }
    }
  }
};

DvtBaseMapManager._processUnprocessedMaps = function() {
  var i;
  var args;
  var unprocessedMaps = DvtBaseMapManager['_UNPROCESSED_MAPS'];
  if (unprocessedMaps) {
    for (i = 0; i < unprocessedMaps[0].length; i++) { // registerBaseMapLayer
      args = unprocessedMaps[0][i];
      DvtBaseMapManager.registerBaseMapLayer(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
    }
    for (i = 0; i < unprocessedMaps[1].length; i++) { // registerResourceBundle
      args = unprocessedMaps[1][i];
      DvtBaseMapManager.registerResourceBundle(args[0], args[1], args[2]);
    }
    for (i = 0; i < unprocessedMaps[2].length; i++) { // updateResourceBundle
      args = unprocessedMaps[2][i];
      DvtBaseMapManager.updateResourceBundle(args[0], args[1], args[2]);
    }
    DvtBaseMapManager['_UNPROCESSED_MAPS'] = [[], [], []];
  }

  // update custom area layers and update hierarchy indicies
  var unprocessedParentUpdates = DvtBaseMapManager['_UNPROCESSED_PARENT_UPDATES'];
  if (unprocessedParentUpdates) {
    for (i = 0; i < unprocessedParentUpdates[0].length; i++) {
      args = unprocessedParentUpdates[0][i];
      // update extending layer parent mapping
      var basemapName = args[0];
      var extendedLayer = args[1];
      var layerName = args[2];
      var basemapMetadata = DvtBaseMapManager._GLOBAL_MAPS[basemapName];
      var basemapDim;
      var layerMetadata;
      if (basemapMetadata) {
        layerMetadata = basemapMetadata[extendedLayer];
        if (layerMetadata) {
          layerMetadata[DvtBaseMapManager.TYPE_PARENTREGION_CHILDREN] = args[3];
          basemapDim = layerMetadata[DvtBaseMapManager.TYPE_DIM];
          // get the index of the extended layer and update indicies for layers
          var index = layerMetadata[DvtBaseMapManager._INDEX];
          var indicies = basemapMetadata[DvtBaseMapManager._INDEX];
          indicies.splice(index, 0, layerName);
          basemapMetadata[layerName][DvtBaseMapManager._INDEX] = index;
          for (var i = (index + 1); i < indicies.length; i++) {
            var lowerLayer = basemapMetadata[indicies[i]];
            if (lowerLayer)
              lowerLayer[DvtBaseMapManager._INDEX]++;
          }
        }

        // update custom layer dimensions from extending layer
        layerMetadata = basemapMetadata[args[2]];
        if (layerMetadata) {
          layerMetadata[DvtBaseMapManager.TYPE_DIM] = basemapDim;
        }
      }
    }
    DvtBaseMapManager['_UNPROCESSED_PARENT_UPDATES'] = [[]];
  }
};

DvtBaseMapManager.simplifyAreaPaths = function(paths, basemapW, basemapH, viewportW, viewportH, zoomFactor) {
  // determine the scale factor for the map given the viewport
  if (zoomFactor > 0) {
    var dzx = viewportW / basemapW;
    var dzy = viewportH / basemapH;
    var dz = Math.min(dzx, dzy);
    var scale = 1 / (dz * zoomFactor); // 6 is the current max zoom
    if (scale <= 1)
      return paths;
    // If scale = 10 that means 10 pixels in the map coordinate space = 1 pixel in the current viewport
    // and any draw commands less than 10 pixels in the map coordinate space won't even show up in the viewport
    var simplifiedPaths = [];
    if (paths) {
      for (var path in paths) {
        var pathAr = paths[path];
        if (isNaN(pathAr))
          pathAr = dvt.PathUtils.createPathArray(paths[path]);
        simplifiedPaths[path] = dvt.PathUtils.simplifyPath(pathAr, scale);
      }
    }
    return simplifiedPaths;
  } else {
    return paths;
  }
};

/**
 * Returns a map of ids to area names for the given basemap and layer.
 * @param {string} baseMapName The name of the basemap
 * @param {string} layerName The name of the layer or 'cities' for the point data layer
 * @return {object}
 * @export
 */
DvtBaseMapManager.getLayerIds = function(baseMapName, layerName) {
  DvtBaseMapManager._processUnprocessedMaps();
  var layer = DvtBaseMapManager._GLOBAL_MAPS[baseMapName][layerName];
  var map = {};
  if (layer) {
    var ids = layer[DvtBaseMapManager.TYPE_LABELS];
    for (var id in ids)
      map[id] = ids[id][1];
  }
  return map;
};
/**
 * @constructor
 */
var DvtThematicMapCategoryWrapper = function(displayable, category)
{
  this.Init(displayable, category);
};

dvt.Obj.createSubclass(DvtThematicMapCategoryWrapper, dvt.Obj);

DvtThematicMapCategoryWrapper.prototype.Init = function(displayable, category) {
  this._displayable = displayable;
  this._category = category;
};

DvtThematicMapCategoryWrapper.prototype.getCategories = function() {
  return this._category;
};

DvtThematicMapCategoryWrapper.prototype.getDisplayables = function() {
  return [this._displayable];
};
dvt.MapDrillEvent = function(drillType) {
  this.Init(dvt.MapDrillEvent.TYPE);
  this._drillType = drillType;
};

dvt.Obj.createSubclass(dvt.MapDrillEvent, dvt.BaseComponentEvent);

dvt.MapDrillEvent.TYPE = 'drill';
dvt.MapDrillEvent.DRILL_UP = 0;
dvt.MapDrillEvent.DRILL_DOWN = 1;
dvt.MapDrillEvent.RESET = 2;


/**
 * Returns the array of currently drilled ids for the component.
 * @return {array} The array of currently drilled ids for the component.
 */
dvt.MapDrillEvent.prototype.getDisclosed = function() {
  return this._disclosed;
};

dvt.MapDrillEvent.prototype.setDisclosed = function(disclosed) {
  this._disclosed = disclosed;
};

dvt.MapDrillEvent.prototype.getDrillType = function() {
  return this._drillType;
};
/**
 * Map action event.
 * @param {string=} clientId The client id associated with this action event.
 * @param {string=} rowKey The rowKey for the object associated with this event.
 * @param {string=} action The action name.
 * @class
 * @constructor
 * @export
 */
dvt.MapActionEvent = function(clientId, rowKey, action) {
  this.Init(dvt.MapActionEvent.TYPE);
  this._clientId = clientId;
  this._rowKey = rowKey;
  this._action = action;
};

dvt.Obj.createSubclass(dvt.MapActionEvent, dvt.BaseComponentEvent);


/**
 * @export
 */
dvt.MapActionEvent.TYPE = 'action';


/**
 * Returns the clientId associated with this event.
 * @return {string} clientId.
 * @export
 */
dvt.MapActionEvent.prototype.getClientId = function() {
  return this._clientId;
};


/**
 * Returns the rowKey of the object associated with this event.
 * @return {string} rowKey.
 * @export
 */
dvt.MapActionEvent.prototype.getRowKey = function() {
  return this._rowKey;
};


/**
 * Returns the action name.
 * @return {string} action.
 * @export
 */
dvt.MapActionEvent.prototype.getAction = function() {
  return this._action;
};
/**
 * Base map layer metadata
 * @extends {dvt.Obj}
 * @class base map layer metadata
 * @constructor
 *
 * @param {dvt.Context} context The rendering context
 * @param {String} label Text for label
 * @param {Array} labelInfo Contains the label bounding box at different zoom levels and leader line info
 * @param {String} labelDisplay Specifies whether to display labels. "off", "on", or "auto"
 * @param {dvt.Container} parentContainer The container to add the label to
 * @param {boolean} bSupportsVectorEffects Whether the rendering platform supports vector effects
 */
var DvtMapLabel = function(context, label, labelInfo, labelDisplay, parentContainer, bSupportsVectorEffects) {
  this.Init(context, label, labelInfo, labelDisplay, parentContainer, bSupportsVectorEffects);
};

dvt.Obj.createSubclass(DvtMapLabel, dvt.OutputText);


/**
 * Initializes label.  Sets bounding rectangle for label and draws leaderlines if present.
 *
 * @param {dvt.Context} context The rendering context
 * @param {String} label Text for label
 * @param {Array} labelInfo Contains the label bounding box at different zoom levels and leader line info
 * @param {String} labelDisplay Specifies whether to display labels. "off", "on", or "auto"
 * @param {dvt.Container} parentContainer The container to add the label to
 * @param {boolean} bSupportsVectorEffects Whether the rendering platform supports vector effects
 * @protected
 */
DvtMapLabel.prototype.Init = function(context, label, labelInfo, labelDisplay, parentContainer, bSupportsVectorEffects) {
  DvtMapLabel.superclass.Init.call(this, context, label, 0, 0);
  //IE10, Flash/XML toolkit do not support vector-effects=non-scaling-stroke so we still need to set stroke width based on zoom
  this._bSupportsVectorEffects = bSupportsVectorEffects;
  this._boundRectangle = new Array();
  this.setMouseEnabled(false);
  this.alignCenter();
  this.alignMiddle();
  this._center = null;
  this._labelDisplay = labelDisplay;
  this._parentContainer = parentContainer;

  if (labelInfo) {
    this._boundRectangle.push(dvt.Rectangle.create(labelInfo[0]));
    if (labelInfo.length > 1) {
      this._leaderLines = new Array();

      for (var i = 1; i < labelInfo.length; i++) {
        var line = labelInfo[i];
        this._boundRectangle.push(dvt.Rectangle.create(line[0]));

        var polyline = new dvt.Polyline(context, line[1]);
        polyline.setPixelHinting(true);
        var stroke = new dvt.SolidStroke('#000000');
        if (this._bSupportsVectorEffects)
          stroke.setFixedWidth(true);
        polyline.setStroke(stroke);
        this._leaderLines.push(polyline);
      }
    }
  }
};

DvtMapLabel.prototype.addBounds = function(boundsRect) {
  this._boundRectangle.push(boundsRect);
};

DvtMapLabel.prototype.hasBounds = function() {
  return this._boundRectangle.length > 0;
};


/**
 * Updates this label's position, adding and
 * removing it as needed.
 * @param {dvt.Matrix} pzcMatrix zoom matrix
 */
DvtMapLabel.prototype.update = function(pzcMatrix) {
  var zoom = pzcMatrix.getA();
  var state = -1;
  var estimatedDims = dvt.TextUtils.guessTextDimensions(this);
  var remove = false;
  for (var i = 0; i < this._boundRectangle.length; i++) {
    var zoomW = this._boundRectangle[i].w * zoom;
    var zoomH = this._boundRectangle[i].h * zoom;
    // estimatedDims is accurate for text height
    if (estimatedDims.h <= zoomH) {
      if (estimatedDims.w <= zoomW) {
        state = i;
        break;
      } else {
        // estimatedDims is a conservative guess so if it doesn't fit we need to check the real dimensions
        if (!this.getParent()) {
          remove = true;
          this._parentContainer.addChild(this);
        }
        if (this.getDimensions().w <= zoomW) {
          state = i;
          break;
        }
      }
    }
  }

  // if labels are always displayed, use the last available bounding box
  if (state == -1 && this._labelDisplay == 'on')
    state = this._boundRectangle.length - 1;

  if (this._currentState != state) {
    if (state == -1) {
      this.reset();
    } else {
      if (!this.getParent())
        this._parentContainer.addChild(this);
      var center = this._boundRectangle[state].getCenter();
      this.setCenter(center);
      if (this._leaderLines) {
        this._parentContainer.removeChild(this._leaderLine);
        this._leaderLine = null;
        if (state > 0) {
          this._leaderLine = this._leaderLines[state - 1];
          this._parentContainer.addChild(this._leaderLine);
          // when using leaderliners, change text to black
          var style = this.getCSSStyle();
          style.setStyle(dvt.CSSStyle.COLOR, '#000000');
          this.setCSSStyle(style);
          var labelBox = this._boundRectangle[state];
          var leaderLinePoints = this._leaderLine.getPoints();
          var numPoints = leaderLinePoints.length;
          if (labelBox.x > leaderLinePoints[numPoints - 2]) {
            // leaderline position: left
            this.alignLeft();
            this.alignMiddle();
            this.setCenter(new dvt.Point(labelBox.x, center.y));
          }
          else if (labelBox.y > leaderLinePoints[numPoints - 1]) {
            // leaderline position: top
            this.alignTop();
            this.alignCenter();
            this.setCenter(new dvt.Point(center.x, labelBox.y));
          }
          else if ((labelBox.x + labelBox.w) < leaderLinePoints[numPoints - 2]) {
            // leaderline position: right
            this.alignRight();
            this.alignMiddle();
            this.setCenter(new dvt.Point(labelBox.x + labelBox.w, center.y));
          }
          else if ((labelBox.y + labelBox.h) < leaderLinePoints[numPoints - 1]) {
            // leaderline position: bottom
            this.alignBottom();
            this.alignCenter();
            this.setCenter(new dvt.Point(center.x, labelBox.y + labelBox.h));
          }
        } else {
          // reset label alignment if label now fits without leader line
          this.alignCenter();
          this.alignMiddle();
          // reset label color
          var style = this.getCSSStyle();
          style.setStyle(dvt.CSSStyle.COLOR, this._labelColor);
          this.setCSSStyle(style);
        }
      }
    }
    this._currentState = state;
  }
  else if (state == -1 && remove) { // remove label if we added it to call getDimensions and it wasn't already removed
    this._parentContainer.removeChild(this);
  }

  if (this._currentState != -1) {
    var mat = new dvt.Matrix();
    mat.translate(zoom * this._center.x - this._center.x, zoom * this._center.y - this._center.y);
    this.setMatrix(mat);
    if (this._leaderLine) {
      this._leaderLine.setMatrix(new dvt.Matrix(zoom, 0, 0, zoom));
      if (!this._bSupportsVectorEffects) {
        var stroke = this._leaderLine.getStroke().clone();
        stroke.setWidth(1 / zoom);
        this._leaderLine.setStroke(stroke);
      }
    }
  }

};

DvtMapLabel.prototype.setCenter = function(p) {
  this._center = p;
  this.setX(p.x);
  this.setY(p.y);
};

DvtMapLabel.prototype.getLeaderLine = function() {
  return this._leaderLine;
};

DvtMapLabel.prototype.getCenter = function() {
  return this._center;
};
DvtMapLabel.prototype.setCSSStyle = function(cssStyle) {
  DvtMapLabel.superclass.setCSSStyle.call(this, cssStyle);
  if (!this._labelColor) // save the label color for leader lines
    this._labelColor = cssStyle.getStyle(dvt.CSSStyle.COLOR);
};


/**
 * Removes the label from the map and resets it current state
 */
DvtMapLabel.prototype.reset = function() {
  this._parentContainer.removeChild(this);
  this._currentState = -1;
  if (this._leaderLine) {
    this._parentContainer.removeChild(this._leaderLine);
    this._leaderLine = null;
  }
};

/**
 * Logical object for a map data object
 * @param {object} data The options for this data object
 * @param {DvtMapDataLayer} dataLayer The data layer this object belongs to
 * @param {dvt.Shape|DvtCustomDataItem} displayable The displayable representing this data object
 * @param {dvt.OutputText} label The label for this data object
 * @param {dvt.Point} center The center of this data object
 * @constructor
 */
var DvtMapObjPeer = function(data, dataLayer, displayable, label, center) {
  this.Init(data, dataLayer, displayable, label, center);
};

dvt.Obj.createSubclass(DvtMapObjPeer, dvt.Obj);

/**
 * The order in which the delete animation occurs
 */
DvtMapObjPeer.ANIMATION_DELETE_PRIORITY = 0;
/**
 * The order in which the update animation occurs
 */
DvtMapObjPeer.ANIMATION_UPDATE_PRIORITY = 1;
/**
 * The order in which the insert animation occurs
 */
DvtMapObjPeer.ANIMATION_INSERT_PRIORITY = 2;

/**
 * @param {object} data The options for this data object
 * @param {DvtMapDataLayer} dataLayer The data layer this object belongs to
 * @param {dvt.Shape|DvtCustomDataItem} displayable The displayable representing this data object
 * @param {dvt.OutputText} label The label for this data object
 * @param {dvt.Point} center The center of this data object
 * @protected
 */
DvtMapObjPeer.prototype.Init = function(data, dataLayer, displayable, label, center) {
  this._data = data;
  this._dataLayer = dataLayer;
  this.Displayable = displayable;
  this._isSelected = false;
  this._isShowingHoverEffect = false;
  this._isShowingKeyboardFocusEffect = false;
  if (this.Displayable.setDataColor)
    this.Displayable.setDataColor(data['color']);
  this._label = label;
  this._center = center;
  this._zoom = 1;
  this._view = dataLayer.getMap();


  if (!this._data['categories']) {
    if (this._label)
      this._data['categories'] = [this._label.getTextString()];
  }

  var location = data['location'];
  this._locationName;
  if (location) {
    var mapLayer = dataLayer.getMapLayer();
    // For data objects associated with supported areas or cities we prepend the area/city name before the datatip
    if (!(mapLayer instanceof DvtMapAreaLayer) || (mapLayer instanceof DvtMapCustomAreaLayer))  // for AMX V1, custom basemaps only support points
      this._locationName = DvtBaseMapManager.getCityLabel(this._view.getMapName(), location);
    else
      this._locationName = DvtBaseMapManager.getLongAreaLabel(this._view.getMapName(), mapLayer.getLayerName(), location);
  }

  if (this._view.getDisplayTooltips() == 'auto' && this._locationName)
    this._data['shortDesc'] = (data['shortDesc'] ? this._locationName + ': ' + data['shortDesc'] : this._locationName);

  // WAI-ARIA
  if (this.Displayable) {
    if (data['destination']) {
      this.Displayable.setAriaRole('link');
      this._linkCallback = dvt.ToolkitUtils.getLinkCallback('_blank', data['destination']);
    } else {
      this.Displayable.setAriaRole('img');
    }
  }
  this.UpdateAriaLabel();
};

/**
 * Returns the id of this data object
 * @return {string}
 */
DvtMapObjPeer.prototype.getId = function() {
  return this._data['id'];
};

/**
 * Returns the clientId of this data object
 * @return {string}
 */
DvtMapObjPeer.prototype.getClientId = function() {
  return this._data['clientId'];
};

/**
 * Returns the location of this data object
 * @return {string}
 */
DvtMapObjPeer.prototype.getLocation = function() {
  return this._data['location'];
};

/**
 * Returns the location of this data object
 * @return {string}
 */
DvtMapObjPeer.prototype.getLocationName = function() {
  return this._locationName;
};

/**
 * Returns the center of this data object
 * @return {dvt.Point}
 */
DvtMapObjPeer.prototype.getCenter = function() {
  return this._center;
};

/**
 * Sets the center of this data object
 * @param {dvt.Point} center The center
 */
DvtMapObjPeer.prototype.setCenter = function(center) {
  this._center = center;
  this.__recenter();
};

/**
 * Returns the displayable of this data object
 * @return {dvt.Displayable}
 */
DvtMapObjPeer.prototype.getDisplayable = function() {
  return this.Displayable;
};

/**
 * Returns the label of this data object
 * @return {dvt.OutputText}
 */
DvtMapObjPeer.prototype.getLabel = function() {
  return this._label;
};

/**
 * Returns the data layer of this data object
 * @return {DvtMapDataLayer}
 */
DvtMapObjPeer.prototype.getDataLayer = function() {
  return this._dataLayer;
};

/**
 * Returns true if this data object has an action
 * @return {boolean}
 */
DvtMapObjPeer.prototype.hasAction = function() {
  return this.getAction() != null;
};

/**
 * Returns the action of this data object
 * @return {string}
 */
DvtMapObjPeer.prototype.getAction = function() {
  return this._data['action'];
};

/**
 * Sets the visibility of this data object
 * @param {boolean} bVisible True if this data object is visible and false otherwise
 */
DvtMapObjPeer.prototype.setVisible = function(bVisible) {
  this.Displayable.setVisible(bVisible);
  if (this._label)
    this._label.setVisible(bVisible);
};

/**
 * Returns the shortDesc of the data object
 * @return {string}
 */
DvtMapObjPeer.prototype.getShortDesc = function() {
  return this._data['shortDesc'];
};

/**
 * Removes the label on this data object
 */
DvtMapObjPeer.prototype.removeLabel = function() {
  this._label = null;
};

/**
 * Returns the size of this data object. Data object size is used for sorting.
 * @return {Number} The data object size which is its width * height.
 */
DvtMapObjPeer.prototype.getSize = function() {
  if (this.Displayable.getWidth)
    return this.Displayable.getWidth() * this.Displayable.getHeight();
  return 0;
};

/**
 * Implemented for DvtCategoricalObject
 * @override
 */
DvtMapObjPeer.prototype.getCategories = function() {
  return this._data['categories'];
};

/**
 * Implemented for DvtTooltipSource
 * @override
 */
DvtMapObjPeer.prototype.getDatatip = function() {
  if (this._view.getDisplayTooltips() != 'none') {
    // Custom Tooltip from Function
    var tooltipFunc = this._view.getOptions()['_tooltip'];
    if (tooltipFunc)
      return this._view.getCtx().getTooltipManager().getCustomTooltip(tooltipFunc, this.getDataContext());

    // Custom Tooltip from ShortDesc
    return this.getShortDesc();
  }
  return null;
};

/**
 * Returns the data context that will be passed to the tooltip function.
 * @return {object}
 */
DvtMapObjPeer.prototype.getDataContext = function() {
  return {
    'color': this.getDatatipColor(),
    'component': this._view.getOptions()['_widgetConstructor'],
    'data': this._data,
    'id': this.getId(),
    'label': this._label ? this._label.getTextString() : null,
    'location': this.getLocation(),
    'locationName': this._locationName,
    'tooltip': this.getShortDesc(),
    'x': this._data['x'],
    'y': this._data['y']
  };
};

/**
 * Returns the link callback
 * @return {function}
 */
DvtMapObjPeer.prototype.getLinkCallback = function() {
  return this._linkCallback;
};

/**
 * Implemented for DvtTooltipSource
 * @override
 */
DvtMapObjPeer.prototype.getDatatipColor = function() {
  return this._data['color'] ? this._data['color'] : '#000000';
};

/**
 * Implemented for DvtLogicalObject
 * @override
 */
DvtMapObjPeer.prototype.getAriaLabel = function() {
  var states = [];
  if (this.isSelectable())
    states.push(dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, this.isSelected() ? 'STATE_SELECTED' : 'STATE_UNSELECTED'));
  return dvt.Displayable.generateAriaLabel(this.getShortDesc(), states);
};

/**
 * Implemented for DvtLogicalObject
 * @override
 */
DvtMapObjPeer.prototype.getDisplayables = function() {
  return [this.getDisplayable()];
};

/**
 * Updates the aria label for a map data object
 * @protected
 */
DvtMapObjPeer.prototype.UpdateAriaLabel = function() {
  if (!dvt.Agent.deferAriaCreation()) {
    var desc = this.getAriaLabel();
    if (desc)
      this.Displayable.setAriaProperty('label', desc);
  }
};

/**
 * Sets whether the data item is selectable
 * @param {boolean} bSelectable True if this object is selectable
 */
DvtMapObjPeer.prototype.setSelectable = function(bSelectable) {
  var label = this.getLabel();
  if (this.Displayable.setSelectable) {
    // DvtShapes setSelectable also sets selecting cursor
    this.Displayable.setSelectable(bSelectable);
    if (label && bSelectable)
      label.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
  }

  // dvt.Shape clears cursors if not selectable so set the selecting cursor after
  if (this._data['destination']) {
    this.Displayable.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
    if (label)
      label.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
  }
};

/**
 * Implemented for DvtSelectable
 * @override
 */
DvtMapObjPeer.prototype.isSelectable = function() {
  return this.Displayable.isSelectable ? this.Displayable.isSelectable() : false;
};

/**
 * Implemented for DvtSelectable
 * @override
 */
DvtMapObjPeer.prototype.isSelected = function() {
  return this._isSelected;
};

/**
 * Implemented for DvtSelectable
 * @override
 */
DvtMapObjPeer.prototype.setSelected = function(selected) {
  if (this.isSelectable()) {
    var prevState = this._getState();
    this._isSelected = selected;
    if (this._dataLayer.getOptions()['selectionRenderer'])
      this._callCustomRenderer(this._dataLayer.getOptions()['selectionRenderer'], this._getState(), prevState);
    else
      this.processDefaultSelectionEffect(selected);
    this.UpdateAriaLabel();
  }
};

/**
 * Implemented for DvtSelectable
 * @override
 */
DvtMapObjPeer.prototype.showHoverEffect = function() {
  var prevState = this._getState();
  this._isShowingHoverEffect = true;
  if (this._dataLayer.getOptions()['hoverRenderer'])
    this._callCustomRenderer(this._dataLayer.getOptions()['hoverRenderer'], this._getState(), prevState);
  else
    this.processDefaultHoverEffect(true);
};

/**
 * Implemented for DvtSelectable
 * @override
 */
DvtMapObjPeer.prototype.hideHoverEffect = function() {
  var prevState = this._getState();
  this._isShowingHoverEffect = false;
  if (this._dataLayer.getOptions()['hoverRenderer'])
    this._callCustomRenderer(this._dataLayer.getOptions()['hoverRenderer'], this._getState(), prevState);
  else
    this.processDefaultHoverEffect(false);
};

/**
 * Implemented for DvtPopupSource.
 * @override
 */
DvtMapObjPeer.prototype.setShowPopupBehaviors = function(behaviors) {
  this._showPopupBehaviors = behaviors;
};

/**
 * Implemented for DvtPopupSource.
 * @override
 */
DvtMapObjPeer.prototype.getShowPopupBehaviors = function() {
  return this._showPopupBehaviors;
};

/**
 * Implemented for DvtDraggable.
 * @override
 */
DvtMapObjPeer.prototype.isDragAvailable = function(clientIds) {
  var parentId = this._dataLayer.getClientId();
  for (var i = 0; i < clientIds.length; i++) {
    if (clientIds[i] == parentId)
      return parentId;
  }
  return parentId;
};

/**
 * Implemented for DvtDraggable.
 * @override
 */
DvtMapObjPeer.prototype.getDragTransferable = function(mouseX, mouseY) {
  return this._dataLayer.__getDragTransferable(this);
};

/**
 * Implemented for DvtDraggable.
 * @override
 */
DvtMapObjPeer.prototype.getDragFeedback = function(mouseX, mouseY) {
  return this._dataLayer.__getDragFeedback();
};

/**
 * Implemented for DvtKeyboardNavigable.
 * @override
 */
DvtMapObjPeer.prototype.getNextNavigable = function(event) {
  if (event.type == dvt.MouseEvent.CLICK) {
    return this;
  } else if (event.keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey) {
    // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
    // care of the selection
    return this;
  } else {
    return dvt.KeyboardHandler.getNextAdjacentNavigable(this, event, this.GetNavigables());
  }
};

/**
 * Returns the possible keyboard navigables
 * @return {array} The array of DvtMapObjPeers that are possible candidates for keyboard navigation
 * @protected
 */
DvtMapObjPeer.prototype.GetNavigables = function() {
  return this.getDataLayer().getMap().getNavigableObjects();
};

/**
 * Implemented for DvtKeyboardNavigable.
 * @override
 */
DvtMapObjPeer.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) {
  if (this.Displayable.getParent()) {
    if (this.Displayable instanceof DvtCustomDataItem)
      return this.Displayable.getDimensions(targetCoordinateSpace ? targetCoordinateSpace : this.Displayable.getCtx().getStage());
    else
      return this.Displayable.getDimensions(targetCoordinateSpace);
  } else {
    return new dvt.Rectangle(0, 0, 0, 0);
  }
};

/**
 * Implemented for DvtKeyboardNavigable.
 * @override
 */
DvtMapObjPeer.prototype.getTargetElem = function() {
  return this.Displayable.getElem();
};

/**
 * Implemented for DvtKeyboardNavigable.
 * @override
 */
DvtMapObjPeer.prototype.showKeyboardFocusEffect = function() {
  var prevState = this._getState();
  this._isShowingKeyboardFocusEffect = true;
  if (this._dataLayer.getOptions()['focusRenderer'])
    this._callCustomRenderer(this._dataLayer.getOptions()['focusRenderer'], this._getState(), prevState);
  else
    this.processDefaultFocusEffect(true);
};

/**
 * Implemented for DvtKeyboardNavigable.
 * @override
 */
DvtMapObjPeer.prototype.hideKeyboardFocusEffect = function() {
  if (this.isShowingKeyboardFocusEffect()) {
    var prevState = this._getState();
    this._isShowingKeyboardFocusEffect = false;
    if (this._dataLayer.getOptions()['focusRenderer'])
      this._callCustomRenderer(this._dataLayer.getOptions()['focusRenderer'], this._getState(), prevState);
    else
      this.processDefaultFocusEffect(false);
  }
};

/**
 * Implemented for DvtKeyboardNavigable.
 * @override
 */
DvtMapObjPeer.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};

/**
 * Rescale and translate this data object
 * @param {dvt.Matrix} pzcMatrix The current transform of the pan zoom canvas
 * @protected
 */
DvtMapObjPeer.prototype.HandleZoomEvent = function(pzcMatrix) {
  if (!this.Displayable.getParent())
    return;
  this._zoom = pzcMatrix.getA();
  this.__recenter();
};

/**
 * Positions the label of this data object
 */
DvtMapObjPeer.prototype.positionLabel = function() {
  if (this._label) {
    this._label.alignCenter();
    var x = this.Displayable.getCx() * this._zoom;
    var markerY = this.Displayable.getCy() * this._zoom;
    var markerH = this.Displayable.getHeight();
    var markerType = this.Displayable instanceof dvt.SimpleMarker ? this.Displayable.getType() : 'image';

    var y;
    var position = this._data['labelPosition'];
    if (position == 'top') {
      y = markerY - markerH / 2 - 4;
      this._label.alignBottom();
    } else if (position == 'bottom') {
      y = markerY + markerH / 2;
      this._label.alignTop();
    } else if (markerType == dvt.SimpleMarker.TRIANGLE_UP) {
      // we need to move center of the label to the center of gravity, it looks much better
      y = markerY + markerH / 6;
      // in this special case we need special alignment since standard baseline has to be higher than
      // in other cases to be preciesly in the center of gravity
      this._label.alignMiddle();
    } else if (markerType == dvt.SimpleMarker.TRIANGLE_DOWN) {
      // we need to move center of the label to the center of gravity, it looks much better
      y = markerY - markerH / 6;
      this._label.alignMiddle();
    } else {
      y = markerY;
      this._label.alignMiddle();
    }

    this._label.setX(x).setY(y);
  }
};

/**
 * Recenters this data object
 * @protected
 */
DvtMapObjPeer.prototype.__recenter = function() {
  var width = this.Displayable.getWidth();
  var height = this.Displayable.getHeight();
  if (width != null && height != null && this.Displayable.getParent()) {
    // Calculate the current (transformed) center point
    var rotation = 0;
    var shapeX = this._center.x;
    var shapeY = this._center.y;
    if (this.Displayable.getRotation) {
      rotation = this.Displayable.getRotation();
      shapeX = this._center.x * Math.cos(rotation) - this._center.y * Math.sin(rotation);
      shapeY = this._center.x * Math.sin(rotation) + this._center.y * Math.cos(rotation);
    }
    shapeX = this._center.x * this._zoom - shapeX;
    shapeY = this._center.y * this._zoom - shapeY;
    // account for x/y if displayable doesn't have setters for x/y
    if (this.Displayable instanceof DvtCustomDataItem) {
      shapeX += (this._center.x - width / 2);
      shapeY += (this._center.y - height / 2);
    }
    this.Displayable.setTranslate(shapeX, shapeY);
    dvt.Agent.workaroundFirefoxRepaint(this.Displayable);

    this.positionLabel();
  }
};

/**
 * Creates the update animation for this data object.
 * @param {dvt.DataAnimationHandler} handler The animation handler, which can be used to chain animations.
 * @param {DvtMapObjPeer} oldObj The old data object state to animate from.
 */
DvtMapObjPeer.prototype.animateUpdate = function(handler, oldObj) {
  var anim = new dvt.CustomAnimation(this._view.getCtx(), this.Displayable, this.getDataLayer().getAnimationDuration());

  var oldDisplayable = oldObj.getDisplayable();
  // Color change
  if (this.Displayable.getFill) {
    var startFill = oldDisplayable.getFill();
    var endFill = this.Displayable.getFill();
    if (endFill instanceof dvt.SolidFill && !(endFill.getColor() == startFill.getColor() && endFill.getAlpha() == startFill.getAlpha())) {
      this.Displayable.setFill(startFill);
      if (oldObj.getLabel() && this._label) {
        var endLabelFill = this._label.getFill();
        this._label.setFill(oldObj.getLabel().getFill().clone());
        anim.getAnimator().addProp(dvt.Animator.TYPE_FILL, this._label, this._label.getFill, this._label.setFill, endLabelFill);
      }
      anim.getAnimator().addProp(dvt.Animator.TYPE_FILL, this.Displayable, this.Displayable.getFill, this.Displayable.setFill, endFill);
    }
  }

  // Position change for markers
  if (this.Displayable.getCenterDimensions) {
    var startRect = oldObj.getDisplayable().getCenterDimensions();
    var endRect = this.Displayable.getCenterDimensions();

    if (startRect.x != endRect.x || startRect.y != endRect.y || startRect.w != endRect.w || startRect.h != endRect.h) {
      this.Displayable.setCenterDimensions(startRect);
      anim.getAnimator().addProp(dvt.Animator.TYPE_RECTANGLE, this.Displayable, this.Displayable.getCenterDimensions, this.Displayable.setCenterDimensions, endRect);
    }
  }

  // Rotation
  var startRotation = oldDisplayable.getRotation();
  var endRotation = this.Displayable.getRotation();
  if (startRotation != endRotation) {
    var diffRotation = startRotation - endRotation;
    if (diffRotation > Math.PI)
      startRotation -= Math.PI * 2;
    else if (diffRotation < -Math.PI)
      startRotation += Math.PI * 2;
    this.Displayable.setRotation(startRotation);
    anim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this.Displayable, this.Displayable.getRotation, this.Displayable.setRotation, endRotation);
  }

  // Recenter based on new x, y, rotation
  var startCenter = oldObj.getCenter();
  var endCenter = this.getCenter();
  if (startCenter && endCenter) {
    if (startCenter.x != endCenter.x || startCenter.y != endCenter.y || startRotation != endRotation) {
      this.setCenter(new dvt.Point(startCenter.x, startCenter.y));
      anim.getAnimator().addProp(dvt.Animator.TYPE_POINT, this, this.getCenter, this.setCenter, new dvt.Point(endCenter.x, endCenter.y));
    }
  }

  // Animate Labels
  if (this._label && oldObj.getLabel()) {
    var startLabelX = oldObj.getLabel().getX();
    var endLabelX = this._label.getX();
    if (startLabelX != endLabelX) {
      this._label.setX(startLabelX);
      anim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this._label, this._label.getX, this._label.setX, endLabelX);
    }
    var startLabelY = oldObj.getLabel().getY();
    var endLabelY = this._label.getY();
    if (startLabelY != endLabelY) {
      this._label.setY(startLabelY);
      anim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this._label, this._label.getY, this._label.setY, endLabelY);
    }
    // Hide old label
    oldObj.getLabel().setAlpha(0);
  }
  else if (oldObj.getLabel()) {
    oldObj.getLabel().setAlpha(0);
  }

  // Hide old marker
  oldDisplayable.setAlpha(0);

  handler.add(anim, DvtMapObjPeer.ANIMATION_UPDATE_PRIORITY);
};

/**
 * Creates the delete animation for this data object.
 * @param {dvt.DataAnimationHandler} handler The animation handler, which can be used to chain animations.
 * @param {dvt.Container} container The container where deletes should be moved for animation.
 */
DvtMapObjPeer.prototype.animateDelete = function(handler, container) {
  var fadeObjs = [this.Displayable];
  var label = this.getLabel();
  if (label)
    fadeObjs.push(label);
  var anim = new dvt.AnimFadeOut(this._view.getCtx(), fadeObjs, this.getDataLayer().getAnimationDuration());
  handler.add(anim, DvtMapObjPeer.ANIMATION_DELETE_PRIORITY);
};

/**
 * Creates the insert animation for this data object.
 * @param {dvt.DataAnimationHandler} handler The animation handler, which can be used to chain animations.
 */
DvtMapObjPeer.prototype.animateInsert = function(handler) {
  var fadeObjs = [this.Displayable];
  this.Displayable.setAlpha(0);
  var label = this.getLabel();
  if (label) {
    label.setAlpha(0);
    fadeObjs.push(label);
  }
  var anim = new dvt.AnimFadeIn(this._view.getCtx(), fadeObjs, this.getDataLayer().getAnimationDuration());
  handler.add(anim, DvtMapObjPeer.ANIMATION_INSERT_PRIORITY);
};

/**
 * Hide or show selection effect on the node
 * @param {boolean} selected true to show selected effect
 */
DvtMapObjPeer.prototype.processDefaultSelectionEffect = function(selected) {
  if (this.Displayable.setSelected)
    this.Displayable.setSelected(selected);
};

/**
 * Hides or shows default keyboard focus effect
 * @param {boolean} focused true to show keyboard focus effect
 */
DvtMapObjPeer.prototype.processDefaultFocusEffect = function(focused) {
  this.processDefaultHoverEffect(focused);
};

/**
 * Hides or shows default hover effect
 * @param {boolean} hovered true to show hover effect
 */
DvtMapObjPeer.prototype.processDefaultHoverEffect = function(hovered) {
  if (hovered) {
    if (this.Displayable.showHoverEffect)
      this.Displayable.showHoverEffect();
  } else {
    if (this.Displayable.hideHoverEffect && !this.isShowingKeyboardFocusEffect())
      this.Displayable.hideHoverEffect();
  }
};

/**
 * Calls the specified renderer, adds, removes or updates content of the data item
 * @param {function} renderer Custom renderer for the data item state
 * @param {Object} state Object that contains current data item state
 * @param {Object} prevState Object that contains previous data item state
 * @private
 */
DvtMapObjPeer.prototype._callCustomRenderer = function(renderer, state, prevState) {
  if (!(this.Displayable instanceof DvtCustomDataItem))
    return;

  var contextHandler = this._view.getOptions()['_contextHandler'];
  if (!contextHandler)
    return;

  var rootElem = this.Displayable.getRootElement();
  var context = contextHandler(this.Displayable.getElem(), rootElem, this._data, state, prevState);
  var newRootElem = renderer(context);
  this.Displayable.updateRootElement(newRootElem);
};

/**
 * Returns true if the hover effect is currently shown.
 * @protected
 * @return {boolean}
 */
DvtMapObjPeer.prototype.IsHoverEffectShown = function() {
  return this._isShowingHoverEffect;
};

/**
 * Retrieves current state for the data item
 * @return {Object} object that contains current hovered, selected, focused states for the data item
 * @private
 */
DvtMapObjPeer.prototype._getState = function() {
  return {
    'hovered': this.IsHoverEffectShown(),
    'selected': this.isSelected(),
    'focused': this.isShowingKeyboardFocusEffect()
  };
};
/**
 * Logical object for a map data area
 * @param {object} data The options for this data object
 * @param {DvtMapDataLayer} dataLayer The data layer this object belongs to
 * @param {dvt.Displayable} displayable The displayable representing this data object
 * @param {dvt.OutputText} label The label for this data object
 * @constructor
 */
var DvtMapAreaPeer = function(data, dataLayer, displayable, label) {
  this.Init(data, dataLayer, displayable, label);
};

dvt.Obj.createSubclass(DvtMapAreaPeer, DvtMapObjPeer);

/**
 * @param {object} data The options for this data object
 * @param {DvtMapDataLayer} dataLayer The data layer this object belongs to
 * @param {dvt.Displayable} displayable The displayable representing this data object
 * @param {dvt.OutputText} label The label for this data object
 * @protected
 */
DvtMapAreaPeer.prototype.Init = function(data, dataLayer, displayable, label) {
  DvtMapAreaPeer.superclass.Init.call(this, data, dataLayer, displayable, label);
};

/**
 * Sets the area container for this component
 * @param  {dvt.Container} layer The container for this component's map areas
 */
DvtMapAreaPeer.prototype.setAreaLayer = function(layer) {
  this._dataAreaLayer = layer;
};

/**
 * Implemented for DvtSelectable
 * @override
 */
DvtMapAreaPeer.prototype.setSelected = function(selected) {
  if (this.isSelectable()) {
    // for initial selection where hover effect isn't shown on selection
    if (selected && !this.IsHoverEffectShown())
      this._dataAreaLayer.addChild(this.Displayable);
    DvtMapAreaPeer.superclass.setSelected.call(this, selected);
  }
};

/**
 * Implemented for DvtSelectable
 * @override
 */
DvtMapAreaPeer.prototype.showHoverEffect = function() {
  this._dataAreaLayer.addChild(this.Displayable);
  DvtMapAreaPeer.superclass.showHoverEffect.call(this);
};

/**
 * Implemented for DvtSelectable
 * @override
 */
DvtMapAreaPeer.prototype.hideHoverEffect = function() {
  if (this.isSelected())
    this._dataAreaLayer.addChild(this.Displayable);
  else
    this._dataAreaLayer.addChildAt(this.Displayable, 0);
  DvtMapAreaPeer.superclass.hideHoverEffect.call(this);
};

/**
 * Returns true if this data area is drilled and false otherwise.
 * @return {boolean}
 */
DvtMapAreaPeer.prototype.isDrilled = function() {
  return this.Displayable.isDrilled();
};

/**
 * Sets whether this data area is drilled
 * @param {boolean} drilled True if this data area is drilled
 */
DvtMapAreaPeer.prototype.setDrilled = function(drilled) {
  if (drilled)
    this._dataAreaLayer.addChild(this.Displayable);
  else
    this._dataAreaLayer.addChildAt(this.Displayable, 0);
  this.Displayable.setDrilled(drilled);
};

/**
 * @override
 */
DvtMapAreaPeer.prototype.HandleZoomEvent = function(pzcMatrix) {
  DvtMapAreaPeer.superclass.HandleZoomEvent.call(this, pzcMatrix);
  if (!this.Displayable.getParent())
    return;
  this.Displayable.handleZoomEvent(pzcMatrix);
  if (!this.isDrilled())
    this.positionLabel(pzcMatrix);
};

/**
 * @override
 */
DvtMapAreaPeer.prototype.positionLabel = function(pzcMatrix) {
  if (this.getLabel())
    this.getLabel().update(pzcMatrix);
};

/**
 * @override
 */
DvtMapAreaPeer.prototype.GetNavigables = function() {
  return this.getDataLayer().getMap().getNavigableAreas();
};

/**
 * @override
 */
DvtMapAreaPeer.prototype.animateUpdate = function(handler, oldObj) {
  DvtMapAreaPeer.superclass.animateUpdate.call(this, handler, oldObj);
  this.getDataLayer().getMapLayer().setAreaRendered(this.getLocation(), false);
};

/**
 * @override
 */
DvtMapAreaPeer.prototype.__recenter = function() {
  // no-op
};
/**
 * Displayable representing a non data map area
 * @extends {dvt.Container}
 * @constructor
 * @param {dvt.Context} context The rendering context
 * @param {dvt.ThematicMap} view The owning component
 * @param {dvt.Shape} dvtShape The shape representing the map area
 * @param {string} areaId The area id
 * @param {string} areaName The area name
 * @param {boolean} bSupportsVectorEffects True if the rendering browser supports vector effects
 */
var DvtMapArea = function(context, view, dvtShape, areaId, areaName, bSupportsVectorEffects) {
  this.Init(context, view, dvtShape, areaId, areaName, bSupportsVectorEffects);
};

dvt.Obj.createSubclass(DvtMapArea, dvt.Container);

DvtMapArea._DEFAULT_STROKE_WIDTH = 1;

/**
 * Helper class to instantiate a map area
 * @param {dvt.Context} context The rendering context
 * @param {dvt.ThematicMap} view The owning component
 * @param {dvt.Shape} dvtShape The shape representing the map area
 * @param {string} areaId The area id
 * @param {string} areaName The area name
 * @param {boolean} bSupportsVectorEffects True if the rendering browser supports vector effects
 * @protected
 */
DvtMapArea.prototype.Init = function(context, view, dvtShape, areaId, areaName, bSupportsVectorEffects) {
  DvtMapArea.superclass.Init.call(this, context);
  this._bSelectable = false;
  this._isSelected = false;
  this._areaId = areaId;
  this._areaName = areaName;
  this._shape = dvtShape;
  this.addChild(this._shape);
  this._view = view;

  //IE10, Flash/XML toolkit do not support vector-effects=non-scaling-stroke so we still need to set stroke width based on zoom
  this._bSupportsVectorEffects = bSupportsVectorEffects;
  var stroke = dvtShape.getStroke();
  if (stroke)
    this._areaStrokeWidth = stroke.getWidth();
};

/**
 * Returns the area id for this map area
 * @return {string}
 */
DvtMapArea.prototype.getAreaId = function() {
  return this._areaId;
};

/**
 * Implemented for DvtTooltipSource.
 * DvtMapAreas use datatips even though there's no data associated with them so that when you hover over
 * data and non data areas, there's not a 500ms delay between showing the two types since tooltips have the built in delay
 * and was meant for things like truncated text.
 * @override
 */
DvtMapArea.prototype.getDatatip = function() {
  var tooltipFunc = this._view.getOptions()['_tooltip'];
  if (tooltipFunc)
    return this._view.getCtx().getTooltipManager().getCustomTooltip(tooltipFunc, this.getDataContext());
  return this._tooltip;
};

/**
 * Implemented for DvtTooltipSource
 */
DvtMapArea.prototype.setDatatip = function(tooltip) {
  this._tooltip = tooltip;
};

/**
 * Returns the data context that will be passed to the tooltip function.
 * @return {object}
 */
DvtMapArea.prototype.getDataContext = function() {
  return {
    'color': null,
    'component': this._view.getOptions()['_widgetConstructor'],
    'data': null,
    'id': null,
    'label': null,
    'location': this.getAreaId(),
    'locationName': this._areaName,
    'tooltip': this._tooltip,
    'x': null,
    'y': null
  };
};

DvtMapArea.prototype.getStroke = function() {
  if (this._shape instanceof dvt.Shape)
    return this._shape.getStroke();
  return null;
};

DvtMapArea.prototype.setStroke = function(stroke) {
  if (this._shape instanceof dvt.Shape)
    this._shape.setStroke(stroke);
};

DvtMapArea.prototype.setFill = function(fill) {
  if (this._shape instanceof dvt.Shape) {
    this._shape.setFill(fill);
  }
};

DvtMapArea.prototype.getFill = function() {
  if (this._shape instanceof dvt.Shape) {
    return this._shape.getFill();
  }
  return null;
};

DvtMapArea.prototype.getCmds = function() {
  if (this._shape instanceof dvt.Path) {
    return this._shape.getCmds();
  }
  return null;
};

DvtMapArea.prototype.setCmds = function(cmds) {
  if (this._shape instanceof dvt.Path) {
    this._shape.setCmds(cmds);
  }
};

DvtMapArea.prototype.setSrc = function(src) {
  if (this._shape instanceof dvt.Image) {
    this._shape.setSrc(src);
  }
};


/**
 * @override
 */
DvtMapArea.prototype.getDropSiteFeedback = function() {
  return this._shape.copyShape();
};


/**
 * @override
 */
DvtMapArea.prototype.contains = function(x, y) {
  var dims = this.getDimensions();
  return x >= dims.x && x <= dims.x + dims.w &&
         y >= dims.y && y <= dims.y + dims.h;
};

DvtMapArea.prototype.HandleZoomEvent = function(pzcMatrix) {
  if (!this._bSupportsVectorEffects && this._shape && this._areaStrokeWidth) {
    var zoomStroke = this._shape.getStroke().clone();
    zoomStroke.setWidth(this._areaStrokeWidth / pzcMatrix.getA());
    this._shape.setStroke(zoomStroke);
  }
};
/**
 * Thematic Map map layer
 * @param {dvt.ThematicMap} tmap The thematic map this map layer belongs to
 * @param {String} layerName The name of map layer
 * @param {dvt.EventManager} eventHandler The thematic map event manager
 * @constructor
 */
var DvtMapLayer = function(tmap, layerName, eventHandler) {
  this.Init(tmap, layerName, eventHandler);
};

dvt.Obj.createSubclass(DvtMapLayer, dvt.Obj);


/**
 * Initializes this map layera
 * @param {dvt.ThematicMap} tmap The thematic map this map layer belongs to
 * @param {String} layerName The name of map layer
 * @param {dvt.EventManager} eventHandler The thematic map event manager
 * @protected
 */
DvtMapLayer.prototype.Init = function(tmap, layerName, eventHandler) {
  this._tmap = tmap;
  this.LayerName = layerName;
  this.EventHandler = eventHandler;
  this.DataLayers = {};
  this.PzcMatrix = new dvt.Matrix();
};


/**
 * Registers a data layer to this map layer
 * @param {DvtMapDataLayer} dataLayer The data layer to add to this map layer
 */
DvtMapLayer.prototype.addDataLayer = function(dataLayer) {
  this.DataLayers[dataLayer.getClientId()] = dataLayer;
};

DvtMapLayer.prototype.PreDataLayerUpdate = function() {
  //subclasses to override
};

DvtMapLayer.prototype.PostDataLayerUpdate = function() {
  //subclasses to override
};


/**
 * Renders a data layer on ppr with new data if currently visible.
 * @param {DvtMapDataLayer} dataLayer The data layer to add and render for this DvtMapLayer
 * @param {dvt.Matrix} pzcMatrix The current map transform
 * @param {String} topLayerName The layer name of the current top layer
 */
DvtMapLayer.prototype.updateDataLayer = function(dataLayer, pzcMatrix, topLayerName) {
  // stop previous animation
  if (this._animation) {
    this._animation.stop(true);
  }

  this.PzcMatrix = pzcMatrix;
  // Get old data layer
  this._oldDataLayer = this.getDataLayer(dataLayer.getClientId());
  this.addDataLayer(dataLayer);
  dataLayer.render(this.PzcMatrix);
  // create a zoom event so we can update the data objects with the current zoom
  dataLayer.HandleZoomEvent(new dvt.ZoomEvent(dvt.ZoomEvent.SUBTYPE_ZOOMED), this.PzcMatrix);

  if (this._oldDataLayer) {
    var anim = dataLayer.getAnimation();
    var animDur = dataLayer.getAnimationDuration();
    if (anim == 'auto') { // data change animation
      var animHandler = new dvt.DataAnimationHandler(this._tmap.getCtx());
      animHandler.constructAnimation(this._oldDataLayer.getAllObjects(), dataLayer.getAllObjects());
      this._animation = animHandler.getAnimation();
    }
    else if (dvt.BlackBoxAnimationHandler.isSupported(anim)) { // black box animation
      // since certain animations like zoom and cubeToLeft/Right will use the bounding box of the object we need to
      // ensure all animated objects are the same dimensions by adding an invisible rect to all of them during animation
      this._removeAnimRect = true;
      var bounds1 = new dvt.Rectangle(0, 0, this._tmap.getWidth(), this._tmap.getHeight());
      var oldNonScaledContainers = this._oldDataLayer.getNonScaledContainers();
      for (var i = 0; i < oldNonScaledContainers.length; i++) {
        var rect = new dvt.Rect(this._tmap.getCtx(), 0, 0, this._tmap.getWidth(), this._tmap.getHeight());
        rect.setFill(null);
        oldNonScaledContainers[i].addChild(rect);
      }
      var newNonScaledContainers = dataLayer.getNonScaledContainers();
      for (var i = 0; i < newNonScaledContainers.length; i++) {
        var rect = new dvt.Rect(this._tmap.getCtx(), 0, 0, this._tmap.getWidth(), this._tmap.getHeight());
        rect.setFill(null);
        newNonScaledContainers[i].addChild(rect);
      }
      var anim1 = dvt.BlackBoxAnimationHandler.getCombinedAnimation(this._tmap.getCtx(), anim,
          oldNonScaledContainers,
          newNonScaledContainers, bounds1, animDur);

      var bounds2 = new dvt.Rectangle(0, 0, this._tmap.getWidth() / this.PzcMatrix.getA(), this._tmap.getHeight() / this.PzcMatrix.getA());
      var oldScaledContainers = this._oldDataLayer.getScaledContainers();
      for (var i = 0; i < oldScaledContainers.length; i++) {
        var rect = new dvt.Rect(this._tmap.getCtx(), 0, 0, this._tmap.getWidth() / this.PzcMatrix.getA(), this._tmap.getHeight() / this.PzcMatrix.getA());
        rect.setFill(null);
        oldScaledContainers[i].addChild(rect);
      }
      var newScaledContainers = dataLayer.getScaledContainers();
      for (var i = 0; i < newScaledContainers.length; i++) {
        var rect = new dvt.Rect(this._tmap.getCtx(), 0, 0, this._tmap.getWidth() / this.PzcMatrix.getA(), this._tmap.getHeight() / this.PzcMatrix.getA());
        rect.setFill(null);
        newScaledContainers[i].addChild(rect);
      }

      var anim2 = dvt.BlackBoxAnimationHandler.getCombinedAnimation(this._tmap.getCtx(), anim,
          oldScaledContainers,
          newScaledContainers, bounds2, animDur);
      this._animation = new dvt.ParallelPlayable(this._tmap.getCtx(), [anim1, anim2]);
    }
    else { // no animation
      var oldContainers = this._oldDataLayer.getContainers();
      for (var i = 0; i < oldContainers.length; i++) {
        var parent = oldContainers[i].getParent();
        parent.removeChild(oldContainers[i]);
      }
    }

    this.PreDataLayerUpdate();

    // If an animation was created, play it
    if (this._animation) {

      // Disable event listeners temporarily
      this.EventHandler.removeListeners(this._callbackObj);

      // Start the animation
      var thisRef = this;
      this._animation.setOnEnd(function() {thisRef.OnAnimationEnd(dataLayer)}, this);
      this._animation.play();
    }
  } else {
    this.PostDataLayerUpdate();
    this._tmap.OnUpdateLayerEnd();
  }
};

DvtMapLayer.prototype.getDataLayers = function() {
  return this.DataLayers;
};

DvtMapLayer.prototype.getDataLayer = function(clientId) {
  return this.DataLayers ? this.DataLayers[clientId] : null;
};

/**
 * Returns the name of this map layer i.e. continents, countries, states for built-in basemaps
 * @return {String} The name of this map layer
 */
DvtMapLayer.prototype.getLayerName = function() {
  return this.LayerName;
};

/**
 * Renders a map layer and its children
 * @param {dvt.Matrix} pzcMatrix The current pan zoom canvas pan and zoom state
 */
DvtMapLayer.prototype.render = function(pzcMatrix) {
  this.PzcMatrix = pzcMatrix;
  for (var id in this.DataLayers)
    this.DataLayers[id].render(pzcMatrix);
};

/**
 * Handle for drilling to reset the currently drilled areas
 * @param {Array} fadeOutContainer The list of objects to fade out
 * @param {Array} doNotResetAreas The list of areas not to reset
 */
DvtMapLayer.prototype.reset = function(fadeOutContainer, doNotResetAreas) {
  for (var id in this.DataLayers)
    this.DataLayers[id].reset(fadeOutContainer, doNotResetAreas);
};

/**
 * Handles a zoom event for this map layer
 * @param {dvt.ZoomEvent} event The zoom event
 * @param {dvt.Matrix} pzcMatrix The current pan zoom canvas pan and zoom state
 * @protected
 */
DvtMapLayer.prototype.HandleZoomEvent = function(event, pzcMatrix) {
  this.PzcMatrix = pzcMatrix;
  for (var id in this.DataLayers)
    this.DataLayers[id].HandleZoomEvent(event, pzcMatrix);
};

/**
 * Handles a pan event for this map layer
 * @param {dvt.Matrix} pzcMatrix The current pan zoom canvas pan and zoom state
 * @protected
 */
DvtMapLayer.prototype.HandlePanEvent = function(pzcMatrix) {
  this.PzcMatrix = pzcMatrix;
  for (var id in this.DataLayers)
    this.DataLayers[id].HandlePanEvent(pzcMatrix);
};


/**
 * Cleans up animated objects after animation finishes
 * @param {DvtMapDataLayer} dataLayer The animated data layere
 * @protected
 */
DvtMapLayer.prototype.OnAnimationEnd = function(dataLayer) {
  // Clean up the old container used by black box updates
  if (this._oldDataLayer) {
    var oldContainers = this._oldDataLayer.getContainers();
    for (var i = 0; i < oldContainers.length; i++) {
      var parent = oldContainers[i].getParent();
      if (parent)
        parent.removeChild(oldContainers[i]);
    }
  }

  // remove invisible rect added for animation
  if (this._removeAnimRect) {
    this._removeAnimRect = false;
    var newNonScaledContainers = dataLayer.getNonScaledContainers();
    for (var i = 0; i < newNonScaledContainers.length; i++)
      newNonScaledContainers[i].removeChildAt(newNonScaledContainers[i].getNumChildren() - 1);
    var newScaledContainers = dataLayer.getScaledContainers();
    for (var i = 0; i < newScaledContainers.length; i++)
      newScaledContainers[i].removeChildAt(newScaledContainers[i].getNumChildren() - 1);
  }

  this.PostDataLayerUpdate();

  this._tmap.OnUpdateLayerEnd();
  // Reset the animation stopped flag
  // Remove the animation reference
  this._animation = null;
  // Restore event listeners
  this.EventHandler.addListeners(this._callbackObj);
};
/**
 * Thematic Map area layer
 * @param {dvt.ThematicMap} tmap The thematic map this map layer belongs to
 * @param {String} layerName The name of map area layer
 * @param {String} labelDisplay Whether to display the labels for this map layer
 * @param {String} labelType The type of labels to display for this map layer (short or long)
 * @param {dvt.EventManager} eventHandler The thematic map event manager
 * @constructor
 */
var DvtMapAreaLayer = function(tmap, layerName, labelDisplay, labelType, eventHandler) {
  this.Init(tmap, layerName, labelDisplay, labelType, eventHandler);
};

dvt.Obj.createSubclass(DvtMapAreaLayer, DvtMapLayer);

DvtMapAreaLayer._SHORT_NAME = 0;
DvtMapAreaLayer._LONG_NAME = 1;


/**
 * Helper method to initialize this DvtMapAreaLayer object
 * @param {dvt.ThematicMap} tmap The thematic map this map layer belongs to
 * @param {String} layerName The name of map area layer
 * @param {String} labelDisplay Whether to display the labels for this map layer
 * @param {String} labelType The type of labels to display for this map layer (short or long)
 * @param {dvt.EventManager} eventHandler The thematic map event manager
 * @protected
 */
DvtMapAreaLayer.prototype.Init = function(tmap, layerName, labelDisplay, labelType, eventHandler) {
  DvtMapAreaLayer.superclass.Init.call(this, tmap, layerName, eventHandler);
  this._labelDisplay = labelDisplay;
  this._labelType = labelType;
  this._areaLabels = new Object();
  this.Areas = new Object();
  this.AreaShapes = {};
  this.AreaNames = null;
  this._labelInfo = null;
  this._disclosed = [];
  this._renderArea = {}; // keep track of whether or not to render an area
  this._renderLabel = {}; // keep track of whether or not to render a label
  this._renderedLabels = {}; // keep track of the labels that are actually added to the DOM

  this.AreaContainer = new dvt.Container(this._tmap.getCtx());
  this.LabelContainer = new dvt.Container(this._tmap.getCtx());
  this._tmap.getAreaLayerContainer().addChildAt(this.AreaContainer, 0);
  this._tmap.getLabelContainer().addChildAt(this.LabelContainer, 0);

  this._dropTarget = new DvtThematicMapDropTarget(this, this._tmap.getMapName());
};

DvtMapAreaLayer.prototype.setAnimation = function(animType) {
  this._animType = animType;
};

DvtMapAreaLayer.prototype.getAnimation = function() {
  return this._animType;
};

DvtMapAreaLayer.prototype.setAnimationDuration = function(animDur) {
  this._animDur = animDur;
};

DvtMapAreaLayer.prototype.getAnimationDuration = function() {
  return this._animDur;
};

DvtMapAreaLayer.prototype.getDropTarget = function() {
  return this._dropTarget;
};

DvtMapAreaLayer.prototype.getLabelType = function() {
  return this._labelType;
};

DvtMapAreaLayer.prototype.setAreaShapes = function(shapes) {
  this.AreaShapes = shapes;
};

DvtMapAreaLayer.prototype.setAreaNames = function(values) {
  this.AreaNames = values;
  for (var area in this.AreaNames) {
    this.setAreaRendered(area, true);
    this.setLabelRendered(area, true);
  }
};

DvtMapAreaLayer.prototype.getShortAreaName = function(area) {
  return this.AreaNames[area][DvtMapAreaLayer._SHORT_NAME];
};

DvtMapAreaLayer.prototype.getLongAreaName = function(area) {
  return this.AreaNames[area][DvtMapAreaLayer._LONG_NAME];
};

DvtMapAreaLayer.prototype.setAreaLabelInfo = function(values) {
  this._labelInfo = values;
};

DvtMapAreaLayer.prototype.getLabelInfoForArea = function(area) {
  if (!this._labelInfo)
    return null;
  return this._labelInfo[area];
};

DvtMapAreaLayer.prototype.setAreaChildren = function(children) {
  this._children = children;
};

DvtMapAreaLayer.prototype.getChildrenForArea = function(area) {
  if (this._children[area])
    return this._children[area].split(',');
  else
    return [];
};

DvtMapAreaLayer.prototype.getArea = function(id) {
  return this.Areas[id];
};

DvtMapAreaLayer.prototype.getAreaShape = function(id) {
  return this.AreaShapes[id];
};

DvtMapAreaLayer.prototype.getLabelDisplay = function() {
  return this._labelDisplay;
};

DvtMapAreaLayer.prototype.setDropSiteCSSStyle = function(style) {
  this._dropSiteCSSStyle = style;
};

DvtMapAreaLayer.prototype.setLayerCSSStyle = function(style) {
  this._layerCSSStyle = style;
};

DvtMapAreaLayer.prototype.getLayerCSSStyle = function() {
  return new dvt.CSSStyle(this._layerCSSStyle);
};

/**
 * Sets whether an area in the area layer should be rendered.  Areas that contain a DvtMapAreaPeer do not need to
 * render its associated DvtMapArea since the data layer will handle the rendering.
 * @param {String} area The name of the area to update
 * @param {boolean} bRender True if the area should be drawn by the area layer
 */
DvtMapAreaLayer.prototype.setAreaRendered = function(area, bRender) {
  this._renderArea[area] = bRender;
};

/**
 * Sets whether a label for an area should be rendered.
 * @param {String} area The name of the area to update
 * @param {boolean} bRender True if the label should be drawn by the area layer
 */
DvtMapAreaLayer.prototype.setLabelRendered = function(area, bRender) {
  this._renderLabel[area] = bRender;
};

/**
 * Sets the currently isolated area for this area layer
 * @param {String} isolatedArea The id of the isolated area for this area layer
 */
DvtMapAreaLayer.prototype.setIsolatedArea = function(isolatedArea) {
  this._isolatedArea = isolatedArea;
  // reset the layer dimensions in case of data layer update
  this._layerDim = null;
  for (var area in this.AreaShapes) {
    if (area != isolatedArea)
      this._renderArea[area] = false;
  }
};

/**
 * returns the currently isolated area id for this area layer
 * @return {String}
 */
DvtMapAreaLayer.prototype.getIsolatedArea = function() {
  return this._isolatedArea;
};

/**
 * Returns the dimensions for this area layer.  Used for retrieving saved layer dimensions from built-in basemaps
 * and caching the layer dimensions
 * @return {dvt.Rectangle} The bounding box for this area layer
 */
DvtMapAreaLayer.prototype.getLayerDim = function() {
  if (!this._layerDim) {
    if (this._isolatedArea)
      this._layerDim = dvt.PathUtils.getDimensions(dvt.PathUtils.createPathArray(DvtBaseMapManager.getPathForArea(this._tmap.getMapName(), this.LayerName, this._isolatedArea)));
    else {
      if (this._tmap.getMapName() != 'world' && this._tmap.getMapName() != 'worldRegions')
        this._layerDim = DvtBaseMapManager.getBaseMapDim(this._tmap.getMapName(), this.LayerName);
      if (!this._layerDim) {
        // all layers for a basemap should have the same dimensions
        // need to combine area, data area and selected data area dimensions bc they are in separate containers
        var dim = this.AreaContainer.getDimensions().getUnion(this._tmap.getDataAreaContainer().getDimensions());
        // if we don't have cached dims and no objects have been rendered yet, dim will have 0 dimensions
        if (dim.w > 0 && dim.h > 0)
          this._layerDim = dim;
      }
    }
  }
  return this._layerDim;
};

DvtMapAreaLayer.prototype._createAreaAndLabel = function(area, bForceUpdateArea) {
  var areaShape = this.AreaShapes[area];
  if (areaShape) {
    if (bForceUpdateArea || !this.Areas[area])
      this.updateAreaShape(area);
    if (!this.Areas[area]) {
      var context = this._tmap.getCtx();
      var areaName = (this.AreaNames && this.AreaNames[area]) ? this.AreaNames[area][DvtMapAreaLayer._LONG_NAME] : null;
      var mapArea = new DvtMapArea(context, this._tmap, areaShape, area, areaName, this._tmap.supportsVectorEffects());
      this.Areas[area] = mapArea;
      this.EventHandler.associate(areaShape, mapArea);
      mapArea.setDatatip(areaName);
    }

    if (this._renderLabel[area]) {
      var label = this._areaLabels[area];
      if (!label) {
        if (this._labelDisplay != 'off' && this.AreaNames) {
          var labelText = (this._labelType == 'short') ? this.AreaNames[area][DvtMapAreaLayer._SHORT_NAME] :
                                                         this.AreaNames[area][DvtMapAreaLayer._LONG_NAME];
          if (labelText) {
            if (this._labelInfo && this._labelInfo[area])
              label = new DvtMapLabel(this._tmap.getCtx(), labelText, this._labelInfo[area], this._labelDisplay,
                                      this.LabelContainer, this._tmap.supportsVectorEffects());
            else {
              var areaDim = dvt.DisplayableUtils.getDimensionsForced(this._tmap.getCtx(), areaShape);
              label = new DvtMapLabel(this._tmap.getCtx(), labelText, [[areaDim.x, areaDim.y, areaDim.w, areaDim.h]],
                                      this._labelDisplay, this.LabelContainer, this._tmap.supportsVectorEffects());
            }
            this._areaLabels[area] = label;
            if (this._layerCSSStyle)
              label.setCSSStyle(this._layerCSSStyle);
          }
        }
      }
    }
  }
};


/**
 * Adds and area and its label.  Can be used for data layer animations to draw
 * @param {String} area The area to be added.
 * @param {Array} fadeInObjs If provided, the array of objects that will be faded out
 * @private
 */
DvtMapAreaLayer.prototype._addAreaAndLabel = function(area, fadeInObjs) {
  if (this.AreaShapes[area]) {
    this.AreaContainer.addChild(this.Areas[area]);

    var label = this._areaLabels[area];
    if (label) {
      if (this._renderLabel[area])
        label.update(this.PzcMatrix);
      else
        label.reset();
      this._renderedLabels[area] = this._renderLabel[area];
    }

    if (fadeInObjs) {
      fadeInObjs.push(this.Areas[area]);
      if (label) {
        fadeInObjs.push(label);
        fadeInObjs.push(label.getLeaderLine());
      }
    }
  }
};


/**
 * Updates an area layer area's path commands based
 * @param {String} area The area id that needs to be updated
 */
DvtMapAreaLayer.prototype.updateAreaShape = function(area) {
  if (!this._paths || this._bUpdateShapesForRender) {
    this._bUpdateShapesForRender = false;
    var layerDim;
    if (this._tmap.getMapName() == 'world' || this._tmap.getMapName() == 'worldRegions')
      layerDim = DvtBaseMapManager.getBaseMapDim(this._tmap.getMapName(), this.LayerName);
    else
      layerDim = this.getLayerDim();
    // don't simplify area paths if we don't know the dimensions ahead of time
    if (!layerDim) {
      this._paths = DvtBaseMapManager.getAreaPaths(this._tmap.getMapName(), this.LayerName);
    } else {
      this._paths = DvtBaseMapManager.simplifyAreaPaths(DvtBaseMapManager.getAreaPaths(this._tmap.getMapName(), this.LayerName),
                                                  layerDim.w, layerDim.h, this._tmap.getWidth(), this._tmap.getHeight(),
                                                  this._tmap.getMaxZoomFactor());
    }
  }
  var cmd = this._paths[area];
  if (this.AreaShapes[area] && cmd) {
    this.AreaShapes[area].setCmds(cmd);
  } else {
    delete this.AreaShapes[area];
  }
};

/**
 * Resets which areas and labels within this area layer are rendered
 */
DvtMapAreaLayer.prototype.resetRenderedAreas = function() {
  // reset rendered areas on data layer update
  for (var area in this.AreaNames) {
    this.setAreaRendered(area, true);
    this.setLabelRendered(area, true);
  }
};

/**
 * @override
 */
DvtMapAreaLayer.prototype.updateDataLayer = function(dataLayer, pzcMatrix, topLayerName) {
  DvtMapAreaLayer.superclass.updateDataLayer.call(this, dataLayer, pzcMatrix, topLayerName);
  if (topLayerName == this.getLayerName()) {
    for (var area in this.AreaShapes) {
      this._createAreaAndLabel(area, true);
      if (this._renderArea[area])
        this._addAreaAndLabel(area);
    }
  }
};

/**
 * @override
 */
DvtMapAreaLayer.prototype.render = function(pzcMatrix) {
  // create areashapes and then create the DvtMapArea object for all areas
  this._bUpdateShapesForRender = true;
  for (var area in this.AreaShapes) {
    this._createAreaAndLabel(area, true);
    if (this._renderArea[area])
      this._addAreaAndLabel(area);
  }
  DvtMapAreaLayer.superclass.render.call(this, pzcMatrix);
};


/**
 * @override
 */
DvtMapAreaLayer.prototype.PreDataLayerUpdate = function() {
  // Create and render areas that were originally not created because the area was already created in the data layer
  for (var area in this._renderArea) {
    if (!this._renderArea[area]) {
      this._createAreaAndLabel(area, false);
      this._addAreaAndLabel(area);
    }
  }
};


/**
 * @override
 */
DvtMapAreaLayer.prototype.PostDataLayerUpdate = function() {
  // remove areas that were rendered in the data layer or created for the animation
  for (var area in this._renderArea) {
    if (!this._renderArea[area]) {
      this.AreaContainer.removeChild(this.Areas[area]);
      var label = this._areaLabels[area];
      if (label) {
        this._renderedLabels[area] = false;
        this.LabelContainer.removeChild(label);
        var leaderLine = label.getLeaderLine();
        if (leaderLine)
          this.LabelContainer.removeChild(leaderLine);
      }
    }
  }
};

/**
 * Renders a set of the areas within this area layer
 * @param {Array} areas List of areas to render
 * @param {Array} fadeInObjs Array of objects that will be animated into the view
 */
DvtMapAreaLayer.prototype._renderSelectedAreasAndLabels = function(areas, fadeInObjs) {
  for (var i = 0; i < areas.length; i++) {
    this._createAreaAndLabel(areas[i], false);
    // Do not render areas that were rendered in the data layer
    if (this._renderArea[areas[i]])
      this._addAreaAndLabel(areas[i], fadeInObjs);
  }
};

/**
 * Discloses areas within this area layer
 * @param {Array} areas List of area ids of areas to disclose
 * @param {Array} fadeInObjs Array of objects that will be animated into the view
 */
DvtMapAreaLayer.prototype.discloseAreas = function(areas, fadeInObjs) {
  this._renderSelectedAreasAndLabels(areas, fadeInObjs);
  for (var id in this.DataLayers)
    this.DataLayers[id].discloseAreas(areas, fadeInObjs, this.PzcMatrix);
  this._disclosed = this._disclosed.concat(areas);
};


/**
 * Undiscloses areas within this area layer
 * @param {Array} areas List of area ids of areas to undisclose
 * @param {Array} fadeOutObjs Array of objects that will be removed once undisclosed
 */
DvtMapAreaLayer.prototype.undiscloseAreas = function(areas, fadeOutObjs) {
  for (var id in this.DataLayers)
    this.DataLayers[id].undiscloseAreas(areas, fadeOutObjs);
  var childAreaLayer = this._tmap.getDrillChildLayer(this.LayerName);
  for (var i = 0; i < areas.length; i++) {
    var areaName = areas[i];
    if (this.Areas[areaName]) {
      var idx = dvt.ArrayUtils.getIndex(this._disclosed, areaName);
      if (idx !== -1) {
        this._disclosed.splice(idx, 1);
        fadeOutObjs.push(this.Areas[areaName]);
      }
    }
    // undisclose its child areas
    if (childAreaLayer)
      childAreaLayer.undiscloseAreas(this.getChildrenForArea(areaName), fadeOutObjs);
  }
};


/**
 * @override
 */
DvtMapAreaLayer.prototype.reset = function(fadeOutObjs, doNotResetAreas) {
  DvtMapAreaLayer.superclass.reset.call(this, fadeOutObjs, doNotResetAreas);
  if (this._tmap.getDrillMode() != 'none') {
    this.undiscloseAreas(this._disclosed, fadeOutObjs);
    this._disclosed = [];
  }
};


/**
 * Returns the node under the specified coordinates.
 * @param {number} x
 * @param {number} y
 * @return {DvtMapArea}
 */
DvtMapAreaLayer.prototype.__getObjectUnderPoint = function(x, y) {
  for (var id in this.Areas) {
    if (this.Areas[id].contains(x, y))
      return this.Areas[id];
  }
  // No object found, return null
  return null;
};


/**
 * Displays drop site feedback for the specified node.
 * @param {DvtMapArea} obj The object for which to show drop feedback, or null to remove drop feedback.
 * @return {dvt.Displayable} The drop site feedback, if any.
 */
DvtMapAreaLayer.prototype.__showDropSiteFeedback = function(obj) {
  // Remove any existing drop site feedback
  if (this._dropSiteFeedback) {
    this.AreaContainer.removeChild(this._dropSiteFeedback);
    this._dropSiteFeedback = null;
  }

  // Create feedback for the node
  if (obj) {
    this._dropSiteFeedback = obj.getDropSiteFeedback();
    if (this._dropSiteFeedback) {
      this._dropSiteFeedback.setFill(new dvt.SolidFill(this._dropSiteCSSStyle.getStyle(dvt.CSSStyle.BACKGROUND_COLOR)));
      var strokeWidth = this._dropSiteCSSStyle.getStyle(dvt.CSSStyle.BORDER_WIDTH) ?
          this._dropSiteCSSStyle.getStyle(dvt.CSSStyle.BORDER_WIDTH).substring(0, this._dropSiteCSSStyle.getStyle(dvt.CSSStyle.BORDER_WIDTH).indexOf('px')) : 1;
      if (!this._tmap.supportsVectorEffects())
        strokeWidth /= this.PzcMatrix.getA();
      var stroke = new dvt.SolidStroke(this._dropSiteCSSStyle.getStyle(dvt.CSSStyle.BORDER_COLOR), 1, strokeWidth);
      if (this._tmap.supportsVectorEffects())
        stroke.setFixedWidth(true);

      this._dropSiteFeedback.setStroke(stroke);
      this.AreaContainer.addChild(this._dropSiteFeedback);
    }
  }

  return this._dropSiteFeedback;
};

/**
 * @override
 */
DvtMapAreaLayer.prototype.HandleZoomEvent = function(event, pzcMatrix) {
  DvtMapAreaLayer.superclass.HandleZoomEvent.call(this, event, pzcMatrix);
  if (!this._tmap.supportsVectorEffects()) {
    for (var area in this.Areas)
      this.Areas[area].HandleZoomEvent(pzcMatrix);
  }

  for (var area in this._renderedLabels) {
    if (this._renderedLabels[area]) {
      var label = this._areaLabels[area];
      if (label)
        label.update(pzcMatrix);
    }
  }
};
/**
 * Thematic Map custom area layer
 * @param {dvt.ThematicMap} tmap The thematic map this map layer belongs to
 * @param {String} layerName The name of map area layer
 * @param {String} labelDisplay Whether to display the labels for this map layer
 * @param {String} labelType The type of labels to display for this map layer (short or long)
 * @param {dvt.EventManager} eventHandler The thematic map event manager
 * @constructor
 */
var DvtMapCustomAreaLayer = function(tmap, layerName, labelDisplay, labelType, eventHandler) {
  this.Init(tmap, layerName, labelDisplay, labelType, eventHandler);
};

dvt.Obj.createSubclass(DvtMapCustomAreaLayer, DvtMapAreaLayer);


/**
 * Helper method to initialize this DvtMapCustomAreaLayer object
 * @param {dvt.ThematicMap} tmap The thematic map this map layer belongs to
 * @param {String} layerName The name of map area layer
 * @param {String} labelDisplay Whether to display the labels for this map layer
 * @param {String} labelType The type of labels to display for this map layer (short or long)
 * @param {dvt.EventManager} eventHandler The thematic map event manager
 * @protected
 */
DvtMapCustomAreaLayer.prototype.Init = function(tmap, layerName, labelDisplay, labelType, eventHandler) {
  DvtMapCustomAreaLayer.superclass.Init.call(this, tmap, layerName, labelDisplay, labelType, eventHandler);
};


/**
 * @override
 */
DvtMapCustomAreaLayer.prototype.updateAreaShape = function(area) {
};


/**
 * @override
 */
DvtMapCustomAreaLayer.prototype.getLayerDim = function() {
  return new dvt.Rectangle(0, 0, this._layerWidth, this._layerHeight);
};

DvtMapCustomAreaLayer.prototype._selectImageBasedOnResolution = function() {
  var widthRes = this._tmap.getWidth();
  var heightRes = this._tmap.getHeight();
  var images = this._areaLayerImages;
  // Iterate and use the first image with enough detail
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    var source = image['source'];
    var width = image['width'];
    var height = image['height'];
    var isSvg = (source && source.search('.svg') > -1);

    // Use the image if it's SVG, a PNG whose size > resolution, or the last image provided.
    if (isSvg || (width >= widthRes && height >= heightRes) || i == images.length - 1) {
      //Since points are given in the coordinate space of the original image size, we always set the image we choose
      //to that size.  The <image> tag will scale image as necessary.
      return source;
    }
  }
};

DvtMapCustomAreaLayer.prototype.setAreaLayerImage = function(images) {
  var shape = null;
  var isRTL = dvt.Agent.isRightToLeft(this._tmap.getCtx());
  // Use the images from the list provided
  if (images && images.length > 0) {
    var refWidth = images[0]['width'];
    var refHeight = images[0]['height'];
    this._layerWidth = refWidth;
    this._layerHeight = refHeight;

    // Filter the list to images matching the locale type.
    var locImages = [];
    for (var i = 0; i < images.length; i++) {
      if (isRTL && images[i]['dir'] == 'rtl')
        locImages.push(images[i]);
      else if (!isRTL && images[i]['dir'] == 'ltr')
        locImages.push(images[i]);
    }
    this._areaLayerImages = locImages.length > 0 ? locImages : images; // Use all images if none match the bidi flag
    this._imageSrc = this._selectImageBasedOnResolution();
    shape = new dvt.Image(this._tmap.getCtx(), this._imageSrc, 0, 0, refWidth, refHeight);

  }
  if (shape) {
    this.setAreaNames({'image': [null, null]});
    this.setAreaShapes({'image': shape});
  }
};

DvtMapCustomAreaLayer.prototype.HandleZoomEvent = function(event, pzcMatrix) {
  DvtMapCustomAreaLayer.superclass.HandleZoomEvent.call(this, event, pzcMatrix);
  if (this.Areas['image']) {
    var newImageSrc = this._selectImageBasedOnResolution();
    if (newImageSrc != this._imageSrc) {
      this._imageSrc = newImageSrc;
      this.Areas['image'].setSrc(this._imageSrc);
    }
  }
};
var DvtMapDataLayer = function(tmap, parentLayer, clientId, eventHandler, options) {
  this.Init(tmap, parentLayer, clientId, eventHandler, options);
};

dvt.Obj.createSubclass(DvtMapDataLayer, dvt.Obj);


/**
 * @param {string} layerId The client ID of the layer
 */
DvtMapDataLayer.prototype.Init = function(tmap, parentLayer, clientId, eventHandler, options) {
  this._tmap = tmap;
  this._clientId = clientId;
  this._options = options;
  this._areaObjs = [];
  this._dataObjs = [];
  this._dataAreaCollection = [];
  this._dataMarkerCollection = [];

  this._eventHandler = eventHandler;

  // Drag and drop support
  this._dragSource = new dvt.DragSource(tmap.getCtx());
  this._eventHandler.setDragSource(this._dragSource);

  this._dataAreaLayer = new dvt.Container(this._tmap.getCtx());
  this._dataPointLayer = new dvt.Container(this._tmap.getCtx());
  this._dataLabelLayer = new dvt.Container(this._tmap.getCtx());
  // Add containers to head of parent container so parent layer objects are always drawn first i.e. drilled area borders
  this._tmap.getDataAreaContainer().addChildAt(this._dataAreaLayer, 0);
  this._tmap.getDataPointContainer().addChildAt(this._dataPointLayer, 0);
  this._tmap.getLabelContainer().addChildAt(this._dataLabelLayer, 0);

  this._parentLayer = parentLayer;

  this._disclosed = [];
  this._drilled = [];
};

/**
 * Returns the options object for this data layer
 * @return {object}
 */
DvtMapDataLayer.prototype.getOptions = function() {
  return this._options;
};

DvtMapDataLayer.prototype.getDragSource = function() {
  return this._dragSource;
};


/**
 * Returns the DvtContainers for this data layer
 * @return {Array} Array of DvtContainers
 */
DvtMapDataLayer.prototype.getContainers = function() {
  var containers = [this._dataAreaLayer, this._dataPointLayer, this._dataLabelLayer];
  return containers;
};


/**
 * Returns an array of scaled containers for data layer animation
 * @return {array} The array of scaled containers
 */
DvtMapDataLayer.prototype.getScaledContainers = function() {
  return [this._dataAreaLayer];
};


/**
 * Returns an array of non scaled containers for data layer animation
 * @return {array} The array of non scaled containers
 */
DvtMapDataLayer.prototype.getNonScaledContainers = function() {
  var containers = [this._dataLabelLayer];
  if (this._tmap.isMarkerZoomBehaviorFixed())
    containers.push(this._dataPointLayer);
  return containers;
};


/**
 * Returns the label container for this data layer
 * @return {dvt.Container} container for labels
 */
DvtMapDataLayer.prototype.getDataLabelContainer = function() {
  return this._dataLabelLayer;
};

DvtMapDataLayer.prototype.getMapLayer = function() {
  return this._parentLayer;
};

DvtMapDataLayer.prototype.getMap = function() {
  return this._tmap;
};

DvtMapDataLayer.prototype.getAllObjects = function() {
  return this._dataObjs.concat(this._areaObjs);
};


/**
 * Returns the area data objects in a data layer
 * @return {Array} The array of area objects
 */
DvtMapDataLayer.prototype.getAreaObjects = function() {
  return this._areaObjs;
};


/**
 * Returns the marker and image data objects in a data layer
 * @return {Array} The array of marker and image objects
 */
DvtMapDataLayer.prototype.getDataObjects = function() {
  return this._dataObjs;
};

DvtMapDataLayer.prototype.getNavigableAreaObjects = function() {
  var navigables = [];
  for (var i = 0; i < this._areaObjs.length; i++) {
    if (!this._areaObjs[i].isDrilled())
      navigables.push(this._areaObjs[i]);
  }
  return navigables;
};

DvtMapDataLayer.prototype.getNavigableDisclosedAreaObjects = function() {
  var navigables = [];
  for (var i = 0; i < this._areaObjs.length; i++) {
    for (var j = 0; j < this._disclosed.length; j++) {
      if (this._areaObjs[i].getLocation() == this._disclosed[j]) {
        if (!this._areaObjs[i].isDrilled())
          navigables.push(this._areaObjs[i]);
      }
    }
  }
  return navigables;
};

/**
 * Adds an data object to this data layer
 * @param {DvtMapObjPeer} obj The map data object to add
 */
DvtMapDataLayer.prototype.addDataObject = function(obj) {
  this._dataMarkerCollection.push(obj);
  if (obj) {
    this._dataObjs.push(obj);
    this._eventHandler.associate(obj.getDisplayable(), obj);
    var label = obj.getLabel();
    if (label)
      this._eventHandler.associate(label, obj);
  }
};


/**
 * Adds a data area to this data layer
 * @param {DvtMapAreaPeer} obj The map data area to add
 */
DvtMapDataLayer.prototype.addAreaObject = function(obj) {
  this._dataAreaCollection.push(obj);
  if (obj) {
    this._areaObjs.push(obj);
    this._eventHandler.associate(obj.getDisplayable(), obj);
    obj.setAreaLayer(this._dataAreaLayer);
  }
};


/**
 * Returns the array of data areas for this data layer.
 * Used for automation and may contain nulls if items are hidden.
 * @return {Array}
 */
DvtMapDataLayer.prototype.getDataAreaCollection = function() {
  return this._dataAreaCollection;
};

/**
 * Returns the array of data markers for this data layer.
 * Used for automation and may contain nulls if items are hidden.
 * @return {Array}
 */
DvtMapDataLayer.prototype.getDataMarkerCollection = function() {
  return this._dataMarkerCollection;
};


/**
 * Removes an area object from this data layer
 * @param {DvtMapAreaPeer} obj The map area to remove
 * @private
 */
DvtMapDataLayer.prototype._removeAreaObject = function(obj) {
  var idx = this._areaObjs.indexOf(obj);
  if (idx !== -1)
    this._areaObjs.splice(idx, 1);
};

DvtMapDataLayer.prototype.getClientId = function() {
  return this._clientId;
};

DvtMapDataLayer.prototype.setAnimation = function(animType) {
  this._animType = animType;
};

DvtMapDataLayer.prototype.getAnimation = function() {
  return this._animType;
};

DvtMapDataLayer.prototype.setAnimationDuration = function(animDur) {
  this._animDur = animDur;
};

DvtMapDataLayer.prototype.getAnimationDuration = function() {
  return this._animDur;
};


/**
 * Sets the selection mode for this data layer
 * @param {String} mode The selection mode. Valid values are 's' and 'm'
 */
DvtMapDataLayer.prototype.setSelectionMode = function(mode) {
  this._selectionMode = mode;
  if (this._selectionMode) {
    this._selectionHandler = new dvt.SelectionHandler(this._selectionMode);
    this._eventHandler.setSelectionHandler(this._clientId, this._selectionHandler);
  }
};

DvtMapDataLayer.prototype.isSelectable = function() {
  return this._selectionMode != null;
};

DvtMapDataLayer.prototype.setIsolatedAreaRowKey = function(isolated) {
  this._isolatedAreaRowKey = isolated;
};


/**
 * Since we don't set the area path commands until render time, we create an empty DvtDrillablePath when parsing the xml
 * so we can still set the area color and other info.  This path with no commands needs to be updated before adding to DOM.
 */
DvtMapDataLayer.prototype._updateAreaShape = function(areaObj) {
  var displayable = areaObj.getDisplayable();
  var pathToCopy = this._parentLayer.getAreaShape(areaObj.getLocation());
  if (!pathToCopy) {
    this._removeAreaObject(areaObj);
    return false;
  } else {
    displayable.setCmds(pathToCopy.getCmds());
    return true;
  }
};


/**
 * Renders a specific DvtMapAreaPeer and updates the label
 * @param {number} areaIndex index of the area to be rendered
 * @return {boolean} Whether the area was successfully rendered
 * @private
 */
DvtMapDataLayer.prototype._renderAreaAndLabel = function(areaIndex) {
  if (this._updateAreaShape(this._areaObjs[areaIndex])) {
    var displayable = this._areaObjs[areaIndex].getDisplayable();
    this._dataAreaLayer.addChild(displayable);
    var label = this._areaObjs[areaIndex].getLabel();
    if (label) {
      if (!label.hasBounds()) {
        var areaDim = displayable.getDimensions();
        label.addBounds(areaDim);
      }
      label.update(this._pzcMatrix);
    }
    return true;
  }
  return false;
};


/**
 * Render the data layer objects
 * @param {dvt.Matrix} pzcMatrix The matrix to use when rendering the data layer
 */
DvtMapDataLayer.prototype.render = function(pzcMatrix) {
  this._bFixPatterns = true;
  this._pzcMatrix = pzcMatrix;
  var areaLabelsToRemove = {};
  // first make a copy of markers and then sort by size to prevent overlapping
  // original order should be kept for automation purposes
  var dataObjs = this._dataObjs.slice();
  dataObjs.sort(function compare(a,b) {if (a.getSize() < b.getSize()) return 1; else if (a.getSize() > b.getSize()) return -1; else return 0;});
  for (var i = 0; i < dataObjs.length; i++) {
    var dataObj = dataObjs[i];
    var displayable = dataObj.getDisplayable();
    var label = dataObj.getLabel();
    if (label) {
      var container = new dvt.Container(displayable.getCtx());
      this._dataPointLayer.addChild(container);
      container.addChild(displayable);
      container.addChild(label);
      dataObj.positionLabel();
    } else {
      this._dataPointLayer.addChild(displayable);
    }
    // if area marker, do not display area label
    var regionId = dataObj.getLocation();
    if (regionId)
      areaLabelsToRemove[regionId] = true;
  }
  for (var i = 0; i < this._areaObjs.length; i++) {
    if (areaLabelsToRemove[this._areaObjs[i].getLocation()])
      this._areaObjs[i].removeLabel();
    // areaObjs array can be modified by _renderAreaAndLabel if area has
    // been removed from parent area layer due to path simplification routine
    if (!this._renderAreaAndLabel(i))
      i--;
  }

  if (this._initSelections)
    this._processInitialSelections();
};


/**
 * Discloses the children of the current drilled parent area.
 * @param {Array} areas The ids of the areas to disclose
 * @param {Array} fadeInObjs The objects that will be faded in for the drilling animation
 * @param {dvt.Matrix} pzcMatrix The current canvas matrix
 */
DvtMapDataLayer.prototype.discloseAreas = function(areas, fadeInObjs, pzcMatrix) {
  this._pzcMatrix = pzcMatrix;
  var drilledAreas = [];
  for (var j = 0; j < areas.length; j++) {
    for (var i = 0; i < this._areaObjs.length; i++) {
      if (this._areaObjs[i].getLocation() == areas[j]) {
        drilledAreas.push(this._areaObjs[i].getLocation());
        this._renderAreaAndLabel(i);
        var displayable = this._areaObjs[i].getDisplayable();
        fadeInObjs.push(displayable);
        // update the disclosed area with the current zoom which is needed for IE to render the correct stroke widths
        displayable.handleZoomEvent(pzcMatrix);
        var label = this._areaObjs[i].getLabel();
        if (label) {
          fadeInObjs.push(label);
          var leaderLine = label.getLeaderLine();
          if (leaderLine)
            fadeInObjs.push(leaderLine);
        }
        break;
      }
    }
  }
  //If data layer contains markers or images, just add to data layer regardless of what area it is in if no id
  for (var i = 0; i < this._dataObjs.length; i++) {
    for (var j = 0; j < areas.length; j++) {
      var regionId = this._dataObjs[i].getLocation();
      var displayable = this._dataObjs[i].getDisplayable();
      if (regionId != null) {
        if (regionId == areas[j]) {
          this._dataPointLayer.addChild(displayable);
          fadeInObjs.push(displayable);
        }
      } else {
        this._dataPointLayer.addChild(displayable);
        fadeInObjs.push(displayable);
      }
    }
  }
  this._disclosed = this._disclosed.concat(drilledAreas);
};

DvtMapDataLayer.prototype.undiscloseAreas = function(areas, fadeOutObjs) {
  for (var j = 0; j < areas.length; j++) {
    for (var i = 0; i < this._areaObjs.length; i++) {
      if (this._areaObjs[i].getLocation() == areas[j]) {
        if (this._areaObjs[i].isDrilled())
          this._areaObjs[i].setDrilled(false);
        if (this._areaObjs[i].isSelected())
          this._selectionHandler.removeFromSelection(this._areaObjs[i]);
        var idx = dvt.ArrayUtils.getIndex(this._disclosed, areas[j]);
        if (idx > -1) {
          this._disclosed.splice(idx, 1);
          fadeOutObjs.push(this._areaObjs[i].getDisplayable());
          var label = this._areaObjs[i].getLabel();
          if (label) {
            fadeOutObjs.push(label);
            fadeOutObjs.push(label.getLeaderLine());
          }
        }
        break;
      }
    }
  }
};

DvtMapDataLayer.prototype.drill = function(areaName, fadeOutObjs) {
  for (var i = 0; i < this._areaObjs.length; i++) {
    if (this._areaObjs[i].getLocation() == areaName) {
      this._areaObjs[i].setDrilled(true);
      this._drilled.push(areaName);
      fadeOutObjs.push(this._areaObjs[i].getDisplayable());
      var label = this._areaObjs[i].getLabel();
      if (label) {
        fadeOutObjs.push(label);
        var leaderLine = label.getLeaderLine();
        if (leaderLine)
          fadeOutObjs.push(leaderLine);
      }
      break;
    }
  }
  for (var i = 0; i < this._dataObjs.length; i++) {
    if (this._dataObjs[i].getLocation() == areaName) {
      fadeOutObjs.push(this._dataObjs[i].getDisplayable());
      break;
    }
  }
};

DvtMapDataLayer.prototype.undrill = function(areaName, fadeInObjs) {
  for (var i = 0; i < this._areaObjs.length; i++) {
    if (this._areaObjs[i].getLocation() == areaName) {
      var idx = dvt.ArrayUtils.getIndex(this._drilled, areaName);
      this._drilled.splice(idx, 1);
      this._areaObjs[i].setDrilled(false);
      var displayable = this._areaObjs[i].getDisplayable();
      this._dataAreaLayer.addChild(displayable);
      fadeInObjs.push(displayable);
      var label = this._areaObjs[i].getLabel();
      if (label) {
        label.update(this._pzcMatrix);
        fadeInObjs.push(label);
        fadeInObjs.push(label.getLeaderLine());
      }
      break;
    }
  }
  for (var i = 0; i < this._dataObjs.length; i++) {
    if (this._dataObjs[i].getLocation() == areaName) {
      var displayable = this._dataObjs[i].getDisplayable();
      this._dataPointLayer.addChild(displayable);
      fadeInObjs.push(displayable);
      break;
    }
  }
};


/**
 * Resets the data layer to its initial condition.
 * @param {Array} fadeOutObjs The list of objects that will be animated away
 * @param {Array} doNotResetAreas List of ids of areas that should not be reset
 */
DvtMapDataLayer.prototype.reset = function(fadeOutObjs, doNotResetAreas) {
  // Clear selected
  if (this._selectionHandler) {
    var selectedObjs = this._selectionHandler.getSelection();
    for (var i = 0; i < selectedObjs.length; i++) {
      if (!doNotResetAreas || (doNotResetAreas && dvt.ArrayUtils.getIndex(doNotResetAreas, selectedObjs[i].getLocation()) == -1))
        this._selectionHandler.removeFromSelection(selectedObjs[i]);
    }
  }

  // Clear drilled if drilling is on
  if (this._tmap.getDrillMode() != 'none') {
    for (var j = 0; j < this._drilled.length; j++) {
      for (var i = 0; i < this._areaObjs.length; i++) {
        if (this._areaObjs[i].getLocation() == this._drilled[j]) {
          this._areaObjs[i].setDrilled(false);
          var displayable = this._areaObjs[i].getDisplayable();
          this._dataAreaLayer.addChild(displayable);
          fadeOutObjs.push(displayable);
          var label = this._areaObjs[i].getLabel();
          if (label) {
            label.update(this._pzcMatrix);
            fadeOutObjs.push(label);
            fadeOutObjs.push(label.getLeaderLine());
          }
          break;
        }
      }
      for (var i = 0; i < this._dataObjs.length; i++) {
        if (this._dataObjs[i].getLocation() == this._drilled[j]) {
          var displayable = this._dataObjs[i].getDisplayable();
          this._dataPointLayer.addChild(displayable);
          fadeOutObjs.push(displayable);
          break;
        }
      }
    }
  }

  this._drilled = [];
};


/**
 * Handles zoom events for the data layer objects
 * @param {dvt.ZoomEvent} event The zoom event sent by the pan zoom canvas
 * @param {dvt.Matrix} pzcMatrix The pan zoom canvas matrix
 * @protected
 */
DvtMapDataLayer.prototype.HandleZoomEvent = function(event, pzcMatrix) {
  this._pzcMatrix = pzcMatrix;
  var zoom = pzcMatrix.getA();
  // If this is initial zoom to fit need to set transform on pattern gradients
  var type = event.getSubType();
  if (this._bFixPatterns && type == dvt.ZoomEvent.SUBTYPE_ZOOMED) {
    this._bFixPatterns = false;
    for (var j = 0; j < this._areaObjs.length; j++) {
      var displayable = this._areaObjs[j].getDisplayable();
      var fill = displayable.getSavedPatternFill();
      if (fill) {
        var scaledFill = new dvt.PatternFill();
        fill.mergeProps(scaledFill);
        scaledFill.setMatrix(new dvt.Matrix(1 / zoom, null, null, 1 / zoom));
        displayable.setFill(scaledFill);
      }
    }
  }
  var areaObjs = this.getAreaObjects();
  for (var i = 0; i < areaObjs.length; i++)
    areaObjs[i].HandleZoomEvent(pzcMatrix);

  if (this._tmap.isMarkerZoomBehaviorFixed()) {
    var dataObjs = this.getDataObjects();
    for (var i = 0; i < dataObjs.length; i++)
      dataObjs[i].HandleZoomEvent(pzcMatrix);
  }
};


/**
 * Processes a pan event for this data layer and updates the locations of its data objects
 * @param {dvt.Matrix} pzcMatrix The matrix to use for updating data object locations
 * @protected
 */
DvtMapDataLayer.prototype.HandlePanEvent = function(pzcMatrix) {
  this._pzcMatrix = pzcMatrix;
};


DvtMapDataLayer.prototype.setInitialSelections = function(selections) {
  this._initSelections = selections;
};


/**
 * Update the selection handler with the initial selections.
 */
DvtMapDataLayer.prototype._processInitialSelections = function() {
  if (this._selectionHandler) {
    this._selectionHandler.processInitialSelections(this._initSelections, this.getAllObjects());
    this._initSelections = null;
  }
};


/**
 * Returns the row keys for the current drag.
 * @param {DvtMapObjPeer} obj The object where the drag was initiated.
 * @return {array} The row keys for the current drag.
 */
DvtMapDataLayer.prototype.__getDragTransferable = function(obj) {
  if (this._selectionHandler) {
    // Select the node if not already selected
    if (!obj.isSelected()) {
      this._selectionHandler.processClick(obj, false);
      this._eventHandler.fireSelectionEvent(obj);
    }

    // Gather the rowKeys for the selected objects
    var rowKeys = [];
    var selection = this._selectionHandler.getSelection();
    for (var i = 0; i < selection.length; i++) {
      rowKeys.push(selection[i].getId());
    }

    return rowKeys;
  } else {
    return null;
  }
};


/**
 * Returns the displayables to use for drag feedback for the current drag.
 * @return {array} The displayables for the current drag.
 */
DvtMapDataLayer.prototype.__getDragFeedback = function() {
  // This is called after __getDragTransferable, so the selection has been updated already.
  // Gather the displayables for the selected objects
  var displayables = [];
  var selection = this._selectionHandler.getSelection();
  for (var i = 0; i < selection.length; i++) {
    displayables.push(selection[i].getDisplayable());
  }

  return displayables;
};


/**
 * Given a list of area row keys, looks up and returns a list of their area ids
 * @param {Array} Row keys of areas to retrieve area ids for
 * @preturn {Array} Area ids
 */
DvtMapDataLayer.prototype.getSelectedAreas = function(selectedObjs) {
  var selectedAreas = [];
  var areaObjs = this.getAreaObjects();
  for (var i = 0; i < selectedObjs.length; i++) {
    for (var j = 0; j < areaObjs.length; j++) {
      if (areaObjs[j].getId() == selectedObjs[i]) {
        selectedAreas.push(areaObjs[j].getLocation());
        break;
      }
    }
  }
  return selectedAreas;
};
/**
 * @param {dvt.ThematicMap} tmap The owning component
 * @param {dvt.EventManager} manager The owning dvt.EventManager
 * @class DvtThematicMapKeyboardHandler
 * @extends {dvt.KeyboardHandler}
 * @constructor
 */
var DvtThematicMapKeyboardHandler = function(tmap, manager) {
  this.Init(tmap, manager);
};

dvt.Obj.createSubclass(DvtThematicMapKeyboardHandler, dvt.PanZoomCanvasKeyboardHandler);


/**
 * @override
 */
DvtThematicMapKeyboardHandler.prototype.Init = function(tmap, manager) {
  DvtThematicMapKeyboardHandler.superclass.Init.call(this, tmap, manager);
  this._tmap = tmap;
};


/**
 * @override
 */
DvtThematicMapKeyboardHandler.prototype.isSelectionEvent = function(event) {
  return this.isNavigationEvent(event) && !event.ctrlKey;
};


/**
 * @override
 */
DvtThematicMapKeyboardHandler.prototype.processKeyDown = function(event) {
  var keyCode = event.keyCode;

  if (keyCode == dvt.KeyboardEvent.CLOSE_BRACKET) {
    var focusObj = this._eventManager.getFocus();
    var navigables = this._tmap.getNavigableObjects();
    if (focusObj instanceof DvtMapAreaPeer && navigables.length > 0)
      focusObj = dvt.KeyboardHandler.getNextAdjacentNavigable(focusObj, event, navigables);
    this._eventManager.SetClickInfo(focusObj);
    return focusObj;
  }
  else if (keyCode == dvt.KeyboardEvent.OPEN_BRACKET) {
    var focusObj = this._eventManager.getFocus();
    var navigables = this._tmap.getNavigableAreas();
    if (!(focusObj instanceof DvtMapAreaPeer) && navigables.length > 0)
      focusObj = dvt.KeyboardHandler.getNextAdjacentNavigable(focusObj, event, navigables);
    this._eventManager.SetClickInfo(focusObj);
    return focusObj;
  }
  else {
    var focusObj = DvtThematicMapKeyboardHandler.superclass.processKeyDown.call(this, event);
    // update the clicked object for a navigation and selection event
    if (this.isNavigationEvent(event) && !event.ctrlKey)
      this._eventManager.SetClickInfo(focusObj);
    return focusObj;
  }
};


/**
 * @override
 */
DvtThematicMapKeyboardHandler.prototype.isMultiSelectEvent = function(event) {
  return event.keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey;
};


/**
 * @override
 */
DvtThematicMapKeyboardHandler.prototype.isNavigationEvent = function(event) {
  var isNavigable = DvtThematicMapKeyboardHandler.superclass.isNavigationEvent.call(this, event);

  if (!isNavigable) {
    var keyCode = event.keyCode;
    if (keyCode == dvt.KeyboardEvent.OPEN_BRACKET || keyCode == dvt.KeyboardEvent.CLOSE_BRACKET)
      isNavigable = true;
  }

  return isNavigable;
};
// Copyright (c) 2011, 2016, Oracle and/or its affiliates. All rights reserved.



/**
 * @constructor
 */
var DvtThematicMapEventManager = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

dvt.Obj.createSubclass(DvtThematicMapEventManager, dvt.EventManager);

DvtThematicMapEventManager.prototype.Init = function(context, callback, callbackObj) {
  DvtThematicMapEventManager.superclass.Init.call(this, context, callback, callbackObj);
  this._selectionHandlers = new Object();
  this._tmap = callbackObj;
  this._bPassOnEvent = false;
};

/**
 * @override
 */
DvtThematicMapEventManager.prototype.getSelectionHandler = function(logicalObj) {
  if (logicalObj && logicalObj.getDataLayer) {
    var clientId = logicalObj.getDataLayer().getClientId();
    return this._selectionHandlers[clientId];
  }
};


/**
 * @override
 */
DvtThematicMapEventManager.prototype.setSelectionHandler = function(dataLayerId, handler) {
  this._selectionHandlers[dataLayerId] = handler;
};

DvtThematicMapEventManager.prototype.setDrillMode = function(mode) {
  this._drillMode = mode;
};

DvtThematicMapEventManager.prototype.removeFromSelection = function(clientId, obj) {
  var selectionHandler = this._selectionHandlers[clientId];
  if (selectionHandler)
    selectionHandler.removeFromSelection(obj);
};

DvtThematicMapEventManager.prototype.clearSelection = function(clientId) {
  var selectionHandler = this._selectionHandlers[clientId];
  if (selectionHandler)
    selectionHandler.clearSelection();
};

DvtThematicMapEventManager.prototype.setInitialFocus = function(navigable) {
  //focus object will be set on child layers
  if (navigable) {
    DvtThematicMapEventManager.superclass.setFocus.call(this, navigable);
  }
};

/**
 * @override
 */
DvtThematicMapEventManager.prototype.OnMouseOver = function(event) {
  var obj = this.GetLogicalObject(event.target);
  if (obj && obj.getShowPopupBehaviors && obj.getDataLayer) {
    this._tmap.setEventClientId(obj.getDataLayer().getClientId());
  }
  DvtThematicMapEventManager.superclass.OnMouseOver.call(this, event);
};

/**
 * @override
 */
DvtThematicMapEventManager.prototype.OnMouseOut = function(event) {
  this._tmap.setEventClientId(null);
  DvtThematicMapEventManager.superclass.OnMouseOut.call(this, event);
};

/**
 * @override
 */
DvtThematicMapEventManager.prototype.OnClick = function(event) {
  var obj = this.GetLogicalObject(event.target);
  this.SetClickInfo(obj);

  // Clear all selection handlers if something not selectable is clicked
  if (!(obj && obj.isSelectable && obj.isSelectable())) {
    for (var clientId in this._selectionHandlers) {
      var bSelectionChanged = this._selectionHandlers[clientId].processClick(null, event.ctrlKey);
      // If the selection has changed, fire an event
      if (bSelectionChanged) {
        var selectionEvent = dvt.EventFactory.newSelectionEvent([]);
        selectionEvent['clientId'] = clientId;
        this._callback.call(this._callbackObj, selectionEvent);
      }
    }
  }

  DvtThematicMapEventManager.superclass.OnClick.call(this, event);
  this._handleClick(obj, event.pageX, event.pageY);
};


/**
 * Performs thematic map specific events on click called by the mouse and touch click handlers
 * @param {dvt.Displayable} obj The displayable that was clicked
 * @param {Number} pageX The x position where the action was triggered
 * @param {Number} pageY The y position where the action was triggered
 * @private
 */
DvtThematicMapEventManager.prototype._handleClick = function(obj, pageX, pageY) {
  if (obj instanceof DvtMapObjPeer) {
    var callback = obj.getLinkCallback();
    if (callback) {
      callback.call();
    }
    else if (obj.hasAction()) {
      this.HandleAction(obj, pageX, pageY);
    }
    else if (obj.getShowPopupBehaviors()) {
      this._tmap.setEventClientId(obj.getDataLayer().getClientId());
    }
  }
};

/**
 * Initiates a dvt.MapActionEvent
 * @param {dvt.Displayable} obj The displayable that was clicked
 * @param {Number} pageX The optional x position where the action was triggered
 * @param {Number} pageY The optional y position where the action was triggered
 * @protected
 */
DvtThematicMapEventManager.prototype.HandleAction = function(obj, pageX, pageY) {
  var actionEvent = new dvt.MapActionEvent(obj.getClientId(), obj.getId(), obj.getAction());
  actionEvent.addParam('clientId', obj.getDataLayer().getClientId());
  if (pageX != null && pageY != null) {
    // component x/y location is currently only needed by AMX for popup alignment to a marker or area id
    // keyboard triggered action events do not need these values currently
    var offset = this._tmap.getCtx().pageToStageCoords(pageX, pageY);
    actionEvent.addParam('pointXY', { 'x': offset.x, 'y': offset.y });
  }
  this.hideTooltip();
  this._callback.call(this._callbackObj, actionEvent);
};

DvtThematicMapEventManager.prototype.SetClickInfo = function(obj) {
  var clientId = null;
  var mapLayer = null;
  var clickedObj = null;
  if (obj) {
    if (obj instanceof DvtMapObjPeer)
      clickedObj = obj.getDisplayable();
    else if (obj instanceof DvtMapArea)
      clickedObj = obj;
    if (obj.getDataLayer) {
      var dataLayer = obj.getDataLayer();
      clientId = dataLayer.getClientId();
      mapLayer = dataLayer.getMapLayer().getLayerName();
    }
  }
  this._tmap.setClickInfo(clientId, mapLayer, clickedObj);
};


/**
 * @override
 */
DvtThematicMapEventManager.prototype.OnDblClickInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  if (this.getSelectionHandler(obj) && this._drillMode && this._drillMode != 'none') {
    // Create and fire the event
    var drillEvent = new dvt.MapDrillEvent(dvt.MapDrillEvent.DRILL_DOWN);
    this._callback.call(this._callbackObj, drillEvent);
  }
};


/**
 * Keyboard event handler. Handles keyboard navigation and triggering of context menus
 * @param {dvt.KeyboardEvent} event
 * @return {boolean} true if this event manager has consumed the event
 */
DvtThematicMapEventManager.prototype.ProcessKeyboardEvent = function(event) {
  var eventConsumed = true;
  var keyCode = event.keyCode;
  var focusObj = this.getFocus();
  var focusDisp = focusObj.getDisplayable();

  // Mashup
  if (keyCode != dvt.KeyboardEvent.TAB && this._bPassOnEvent) {
    focusDisp.fireKeyboardListener(event);
    event.preventDefault();
  }
  // Map Reset
  else if ((keyCode == dvt.KeyboardEvent.ZERO || keyCode == dvt.KeyboardEvent.NUMPAD_ZERO) && event.ctrlKey && event.shiftKey) {
    this._tmap.resetMap();
    event.preventDefault();
  }
  // Legend
  else if (keyCode == dvt.KeyboardEvent.BACK_SLASH) {
    var legendPanel = this._tmap.getLegendPanel();
    if (legendPanel) {
      if (legendPanel instanceof dvt.CollapsiblePanel)
        legendPanel.setCollapsed(!legendPanel.isCollapsed());
      else if (legendPanel instanceof dvt.PanelDrawer)
        legendPanel.setDisclosed(!legendPanel.isDisclosed());
    }
    event.preventDefault();
  }
  // Drilling or Action
  else if (keyCode == dvt.KeyboardEvent.ENTER) {
    if (focusObj instanceof DvtMapObjPeer) {
      var callback = focusObj.getLinkCallback();
      if (callback) {
        callback.call();
      } else if (focusObj.hasAction()) {
        this.HandleAction(focusObj);
      } else {
        if (event.shiftKey)
          this._tmap.drillUp();
        else
          this._tmap.drillDown();
      }
      event.preventDefault();
    }
  }
  // Selection
  else if (keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey) {
    this.SetClickInfo(focusObj);
    this.ProcessSelectionEventHelper(focusObj, true);
    event.preventDefault();
  }
  // Zoom to fit
  else if ((keyCode == dvt.KeyboardEvent.ZERO || keyCode == dvt.KeyboardEvent.NUMPAD_ZERO) && event.ctrlKey) {
    if (event.altKey)
      this._tmap.fitRegion(focusDisp);
    else
      this._tmap.fitSelectedRegions();
    event.preventDefault();
  }
  // Mashups
  else if (keyCode == dvt.KeyboardEvent.TAB && focusDisp instanceof DvtCustomDataItem) {
    // If displayable is already focused, then tab enters stamp and all future events pass to stamp until shift+tab
    // or tab out
    if (!event.shiftKey && focusObj.isShowingKeyboardFocusEffect()) {
      focusObj.hideKeyboardFocusEffect();
      focusDisp.fireKeyboardListener(event);
      event.preventDefault();
      this._bPassOnEvent = true;
    }
    // If stamp is focused, shift+tab will move focus back to thematic map
    else if (event.shiftKey && this._bPassOnEvent) {
      this.ShowFocusEffect(event, focusObj);
      event.preventDefault();
      this._bPassOnEvent = false;
    }
    // All other tab cases should be handled by superclass and will move focus out of component
    else {
      if (this._bPassOnEvent)
        focusObj.showKeyboardFocusEffect(); // checked by superclass to tab out of component
      eventConsumed = DvtThematicMapEventManager.superclass.ProcessKeyboardEvent.call(this, event);
      this._bPassOnEvent = false;
    }
  } else {
    eventConsumed = DvtThematicMapEventManager.superclass.ProcessKeyboardEvent.call(this, event);
  }

  return eventConsumed;
};


/**
 * @override
 */
DvtThematicMapEventManager.prototype.OnComponentTouchClick = function(event) {
  var consumed = this.GetEventInfo(event, dvt.PanZoomCanvasEventManager.EVENT_INFO_PANNED_KEY);
  if (consumed)
    return;

  var obj = this.GetLogicalObject(event.target);
  this.SetClickInfo(obj);

  // If logical object is dvt.ThematicMap, then background was tapped and we should call data layer
  // selection handlers to clear selection
  if (obj instanceof dvt.ThematicMap) {
    for (var clientId in this._selectionHandlers) {
      var bSelectionChanged = this._selectionHandlers[clientId].processClick(null, event.ctrlKey);
      // If the selection has changed, fire an event
      if (bSelectionChanged) {
        var selectedObjs = this._selectionHandlers[clientId].getSelection();
        var selectedIds = [];
        for (var i = 0; i < selectedObjs.length; i++)
          selectedIds.push(selectedObjs[i].getId());
        var selectionEvent = dvt.EventFactory.newSelectionEvent(selectedIds);
        this._callback.call(this._callbackObj, selectionEvent);
      }
    }
  }

  DvtThematicMapEventManager.superclass.OnComponentTouchClick.call(this, event);
  this._handleClick(obj, event.touch.pageX, event.touch.pageY);
};

/**
 * @override
 */
DvtThematicMapEventManager.prototype.HandleTouchHoverStartInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  if (obj && obj.getShowPopupBehaviors && obj.getDataLayer) {
    this._tmap.setEventClientId(obj.getDataLayer().getClientId());
  } else {
    this._tmap.setEventClientId(null);
  }
};

/**
 * @override
 */
DvtThematicMapEventManager.prototype.HandleTouchHoverOverInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  if (obj && obj.getShowPopupBehaviors && obj.getDataLayer) {
    this._tmap.setEventClientId(obj.getDataLayer().getClientId());
  } else {
    this._tmap.setEventClientId(null);
  }
};

/**
 * @override
 */
DvtThematicMapEventManager.prototype.HandleTouchDblClickInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;
  if (this.getSelectionHandler(obj) && this._drillMode && this._drillMode != 'none') {
    // First make sure a selection event is fired to support drilling on double click. Touch doesn't send click event
    // before a double click
    this.ProcessSelectionEventHelper(obj, event.ctrlKey);
    var drillEvent = new dvt.MapDrillEvent(dvt.MapDrillEvent.DRILL_DOWN);
    this._callback.call(this._callbackObj, drillEvent);
  }
};

/**
 * @override
 */
DvtThematicMapEventManager.prototype.HandleTouchActionsEnd = function(event, touch) {
  // Set click info before superclass so we have the area and data layer info before firing selection event
  var obj = this.GetLogicalObject(event.target);
  this.SetClickInfo(obj);
  DvtThematicMapEventManager.superclass.HandleTouchActionsEnd.call(this, event, touch);
};

/**
 * @override
 */
DvtThematicMapEventManager.prototype.ProcessRolloverEvent = function(event, obj, bOver) {
  // Don't continue if not enabled
  var options = this._tmap.getOptions();
  if (options['hoverBehavior'] != 'dim')
    return;

  // Compute the new highlighted categories and update the options
  var categories = obj.getCategories ? obj.getCategories() : [];
  options['highlightedCategories'] = bOver ? categories.slice() : null;

  // Fire the event to the rollover handler, who will fire to the component callback.
  var rolloverEvent = dvt.EventFactory.newCategoryHighlightEvent(options['highlightedCategories'], bOver);
  var hoverBehaviorDelay = dvt.StyleUtils.getTimeMilliseconds(options['styleDefaults']['hoverBehaviorDelay']);
  this.RolloverHandler.processEvent(rolloverEvent, this._tmap.getNavigableAreas().concat(this._tmap.getNavigableObjects()),
                                    hoverBehaviorDelay, options['highlightMatch'] == 'any');
};

/**
 * @override
 */
DvtThematicMapEventManager.prototype.GetTouchResponse = function() {
  var options = this._tmap.getOptions();
  if (options['panning'] !== 'none' || options['zooming'] !== 'none')
    return dvt.EventManager.TOUCH_RESPONSE_TOUCH_HOLD;
  else if (options['touchResponse'] === dvt.EventManager.TOUCH_RESPONSE_TOUCH_START)
    return dvt.EventManager.TOUCH_RESPONSE_TOUCH_START;
  return dvt.EventManager.TOUCH_RESPONSE_AUTO;
};

/**
 * @override
 */
DvtThematicMapEventManager.prototype.StoreInfoByEventType = function(key) {
  if (key == dvt.PanZoomCanvasEventManager.EVENT_INFO_PANNED_KEY) {
    return false;
  }
  return DvtThematicMapEventManager.superclass.StoreInfoByEventType.call(this, key);
};
// Copyright (c) 2011, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 * Thematic Map JSON parser
 * @param {dvt.ThematicMap} tmap The thematic map to update
 * @constructor
 */
var DvtThematicMapJsonParser = function(tmap) {
  this.Init(tmap);
};

dvt.Obj.createSubclass(DvtThematicMapJsonParser, dvt.Obj);

/** @private */
DvtThematicMapJsonParser._MIN_MARKER_SIZE = 6;

/** @private */
DvtThematicMapJsonParser._MAX_MARKER_SIZE_RATIO = 0.5;

/**
 * Initializes this thematic map JSON parser
 * @param {dvt.ThematicMap} tmap The thematic map to update
 */
DvtThematicMapJsonParser.prototype.Init = function(tmap) {
  this._tmap = tmap;
  this._isCustomBasemap = false;
  this._areaLayerStyle = null;
  this._isMobile = dvt.Agent.isTouchDevice();
  this._customAreaLayerImages = {};
  this._customMarkerDefs = {};
};

/**
 * Parses a JSON object containing map attributes and data
 * @param {Object} options The JSON object to parse
 */
DvtThematicMapJsonParser.prototype.parse = function(options) {
  this._parseMapProperties(options);
  if (options['_legend'])
    this._tmap.setLegendData(options['_legend']);
  this._parseStyles(options['styleDefaults']);
  // temporary code until JSON API approved for custom basemap
  if (this._isCustomBasemap && options['sourceXml']) {
    var xmlParser = new dvt.XmlParser(this._tmap.getCtx());
    var xmlNode = xmlParser.parse(options['sourceXml']);
    this._parseCustomBasemap(xmlNode);
  }
  this._parseAreaLayers(options['areaLayers']);
  this.ParseDataLayers(options['pointDataLayers'], null, null, false);
};

/**
 * Parses a JSON object containing map attributes
 * @param {Object} options The JSON object to parse
 * @private
 */
DvtThematicMapJsonParser.prototype._parseMapProperties = function(options) {
  var animDur = options['animationDuration'];
  if (typeof animDur == 'string') {
    if (animDur.slice(-2) == 'ms')
      animDur = parseInt((animDur.slice(0, -2))) / 1000;
    else if (animDur.slice(-1) == 's')
      animDur = parseFloat(animDur.slice(0, -1));
  } else {
    // default unit is milliseconds
    animDur /= 1000;
  }
  this._tmap.setAnimationDuration(animDur);

  this._tmap.setAnimationOnDisplay(options['animationOnDisplay'] == 'auto' ? 'alphaFade' : options['animationOnDisplay']);
  this._tmap.setAnimationOnMapChange(options['animationOnMapChange'] == 'auto' ? 'alphaFade' : options['animationOnMapChange']);

  this._isCustomBasemap = options['source'] != null;
  // prepend custom basemap name with a symbol so we don't overwrite built-in basemap data
  this._tmap.setMapName(this._isCustomBasemap ? '$' + options['basemap'] : options['basemap']);

  this._tmap.setFeaturesOff(options['featuresOff']);
  this._tmap.setControlPanelBehavior(options['controlPanelBehavior']);
  var tooltipDisplay = options['tooltipDisplay'];
  if (tooltipDisplay == 'shortDesc')
    tooltipDisplay = 'shortDescOnly';
  else if (tooltipDisplay == 'labelAndShortDesc')
    tooltipDisplay = 'auto';
  this._tmap.setDisplayTooltips(tooltipDisplay);
  var popups = options['popups'];
  if (popups) {
    this._tmap.setShowPopupBehaviors(this._getShowPopupBehaviors(popups));
  }

  // drilling attributes
  this._tmap.setDrillMode(options['drilling']);
  this._tmap.setAnimationOnDrill(options['animationOnDrill']);

  // zooming attributes
  this._tmap.setInitialZooming(options['initialZooming'] == 'auto');
  this._tmap.setMarkerZoomBehavior(options['markerZoomBehavior']);
  this._tmap.setPanning(options['panning'] == 'auto');
  this._tmap.setZooming(options['zooming'] == 'auto');
  this._tmap.setInitialCenterX(options['panX']);
  this._tmap.setInitialCenterY(options['panY']);
  this._tmap.setInitialZoom(options['zoom']);
  if (!isNaN(options['maxZoom']))
    this._tmap.setMaxZoomFactor(Math.max(options['maxZoom'], 1));
};

/**
 * Parses a JSON object containing map area layer attributes and data
 * @param {Object} areaLayers The JSON object to parse
 * @private
 */
DvtThematicMapJsonParser.prototype._parseAreaLayers = function(areaLayers) {
  var basemap = this._tmap.getMapName();
  for (var i = 0; i < areaLayers.length; i++) {
    var areaLayer = this._tmap.Defaults.calcAreaLayerOptions(areaLayers[i]);
    var layer = areaLayer['layer'];
    if (!layer)
      continue;

    var mapLayer;
    if (areaLayer['areaStyle'])
      this._areaLayerStyle.parseInlineStyle(areaLayer['areaStyle']);
    if (areaLayer['labelStyle'])
      this._areaLayerStyle.parseInlineStyle(areaLayer['labelStyle']);

    if (this._isCustomBasemap) {
      mapLayer = new DvtMapCustomAreaLayer(this._tmap, layer, areaLayer['labelDisplay'], areaLayer['labelType'], this._tmap.getEventManager());
      mapLayer.setAreaLayerImage(this._customAreaLayerImages[layer]);
    } else {
      mapLayer = new DvtMapAreaLayer(this._tmap, layer, areaLayer['labelDisplay'], areaLayer['labelType'], this._tmap.getEventManager());
      var areaNames = DvtBaseMapManager.getAreaNames(basemap, layer);
      mapLayer.setAreaShapes(this._createPathShapes(areaNames));
      mapLayer.setAreaNames(areaNames);
      mapLayer.setAreaLabelInfo(DvtBaseMapManager.getAreaLabelInfo(basemap, layer));
      mapLayer.setAreaChildren(DvtBaseMapManager.getChildrenForLayerAreas(this._tmap.getMapName(), layer));
    }
    mapLayer.setLayerCSSStyle(this._areaLayerStyle);
    mapLayer.setDropSiteCSSStyle(this._areaDropSiteStyle);

    mapLayer.setAnimation(areaLayer['animationOnLayerChange'] == 'auto' ? 'alphaFade' : areaLayer['animationOnLayerChange']);
    mapLayer.setAnimationDuration(this._tmap.getAnimationDuration());

    this._tmap.addLayer(mapLayer);
    // parse data layers
    if (areaLayer['areaDataLayer'])
      this.ParseDataLayers([areaLayer['areaDataLayer']], mapLayer, null, true);
    if (areaLayer['pointDataLayers'])
      this.ParseDataLayers(areaLayer['pointDataLayers'], mapLayer, null, false);
  }
};


/**
 * Parses JSON objects containing map data layer attributes and data
 * @param {Array} dataLayers An array of data layer JSON objects to parse
 * @param {DvtMapLayer} parentLayer The parent map layer this data layer belongs to
 * @param {String} topLayerName The name of the top area layer passed in for data layer updates
 * @param {boolean} isAreaDataLayer True if we are parsing an area data layer
 * @protected
 */
DvtThematicMapJsonParser.prototype.ParseDataLayers = function(dataLayers, parentLayer, topLayerName, isAreaDataLayer) {
  if (!dataLayers)
    return;

  for (var i = 0; i < dataLayers.length; i++) {
    var dataLayerOptions = this._tmap.Defaults.calcDataLayerOptions(dataLayers[i]);
    // custom markers
    if (dataLayerOptions['markerDefs']) {
      var markerDefs = dataLayerOptions['markerDefs'];
      for (var markerDef in markerDefs) {
        if (!this._customMarkerDefs[markerDef]) {
          var xmlParser = new dvt.XmlParser(this._tmap.getCtx());
          var xmlNode = xmlParser.parse(markerDefs[markerDef]);
          this._customMarkerDefs[markerDef] = dvt.MarkerUtils.createMarkerDef(this._tmap.getCtx(), xmlNode);
        }
      }
    }

    // for data layer updates we send updated legend info with data layer
    if (dataLayerOptions['legend'])
      this._tmap.setLegendData(dataLayerOptions['legend']);
    if (parentLayer) {
      if (parentLayer instanceof DvtMapAreaLayer && isAreaDataLayer)
        parentLayer.resetRenderedAreas();
    } else {
      parentLayer = new DvtMapLayer(this._tmap, dataLayerOptions['id'], this._tmap.getEventManager());
      this._tmap.addPointLayer(parentLayer);
    }
    var dataLayer = new DvtMapDataLayer(this._tmap, parentLayer, dataLayerOptions['id'], this._tmap.getEventManager(), dataLayerOptions);

    var selectionMode = dataLayerOptions['selectionMode'];
    if (selectionMode == 'single')
      dataLayer.setSelectionMode(dvt.SelectionHandler.TYPE_SINGLE);
    else if (selectionMode == 'multiple')
      dataLayer.setSelectionMode(dvt.SelectionHandler.TYPE_MULTIPLE);

    dataLayer.setAnimation(dataLayerOptions['animationOnDataChange']);
    dataLayer.setAnimationDuration(this._tmap.getAnimationDuration());

    //Add initially isolated area
    var isolatedRowKey = null;
    if (parentLayer instanceof DvtMapAreaLayer)
      isolatedRowKey = dataLayerOptions['isolatedItem'];

    var disclosedItems = dataLayerOptions['disclosedItems'];
    var initDisclosed = [];
    var isolatedAreaId;
    var isAreaDataLayer = parentLayer instanceof DvtMapAreaLayer;
    var popups;
    if (dataLayerOptions['popups'])
      popups = this._getShowPopupBehaviors(dataLayerOptions['popups']);
    // Parse data objects
    var hiddenCategories = this._tmap.getOptions()['hiddenCategories'];

    var areas = dataLayerOptions['areas'];
    if (areas) {
      for (var j = 0; j < areas.length; j++) {
        if (hiddenCategories && dvt.ArrayUtils.hasAnyItem(hiddenCategories, areas[j]['categories'])) {
          // placeholder null object for automation
          dataLayer.addAreaObject(null);
          continue;
        }

        var areaId = areas[j]['location'];

        if (isolatedRowKey) {
          if (isolatedRowKey != areas[j]['id'])
            continue;
          else
            isolatedAreaId = areaId;
        }

        if (disclosedItems && dvt.ArrayUtils.getIndex(disclosedItems, areas[j]['id']) != -1)
          initDisclosed.push(areaId);

        var dataObj = this._createArea(parentLayer, dataLayer, areas[j]);
        if (popups)
          dataObj.setShowPopupBehaviors(popups);
        if (dataObj) {
          dataObj.setSelectable(dataLayer.isSelectable());
          dataLayer.addAreaObject(dataObj);
        }
      }
    }

    var renderer = dataLayerOptions['renderer'];
    var markers = dataLayerOptions['markers'];
    if (markers && !renderer) {
      DvtThematicMapJsonParser.calcBubbleSizes(this._tmap, markers);
      for (var j = 0; j < markers.length; j++) {
        if (hiddenCategories && dvt.ArrayUtils.hasAnyItem(hiddenCategories, markers[j]['categories'])) {
          // placeholder null object for automation
          dataLayer.addDataObject(null);
          continue;
        }

        var areaId = markers[j]['location'];

        if (isolatedRowKey) {
          if (isolatedRowKey != markers[j]['id'])
            continue;
          else
            isolatedAreaId = areaId;
        }

        var dataObj = this._createMarker(parentLayer, dataLayer, markers[j], isAreaDataLayer);
        if (popups)
          dataObj.setShowPopupBehaviors(popups);
        if (dataObj) {
          dataObj.setSelectable(dataLayer.isSelectable());
          dataLayer.addDataObject(dataObj);
        }
      }
    }

    var images = dataLayerOptions['images'];
    if (images) {
      for (var j = 0; j < images.length; j++) {
        var areaId = images[j]['location'];

        if (isolatedRowKey) {
          if (isolatedRowKey != images[j]['id'])
            continue;
          else
            isolatedAreaId = areaId;
        }

        var dataObj = this._createImage(parentLayer, dataLayer, images[j], isAreaDataLayer);
        if (popups)
          dataObj.setShowPopupBehaviors(popups);
        if (dataObj) {
          dataLayer.addDataObject(dataObj);
        }
      }
    }

    if (renderer) {
      // custom renderer data is kept in markers option
      for (var j = 0; j < markers.length; j++) {
        var areaId = markers[j]['location'];

        if (isolatedRowKey) {
          if (isolatedRowKey != markers[j]['id'])
            continue;
          else
            isolatedAreaId = areaId;
        }

        if (disclosedItems && dvt.ArrayUtils.getIndex(disclosedItems, markers[j]['id']) != -1)
          initDisclosed.push(areaId);

        var initState = {'hovered': false, 'selected': false, 'focused': false};
        var context = this._tmap.getOptions()['_contextHandler'](this._tmap.getElem(), null, markers[j], initState, null);
        var svgElem = renderer(context);
        var dataObj = this._createCustomDataItem(parentLayer, dataLayer, markers[j], svgElem, isAreaDataLayer);
        if (popups)
          dataObj.setShowPopupBehaviors(popups);
        if (dataObj) {
          dataObj.setSelectable(dataLayer.isSelectable());
          dataLayer.addDataObject(dataObj);
        }
      }
    }

    // After processing all data objects we should have the area ID of the isolated area
    if (isolatedAreaId) {
      dataLayer.setIsolatedAreaRowKey(isolatedRowKey);
      parentLayer.setIsolatedArea(isolatedAreaId);
    }

    // Process initial data layer selections
    var initSelections = dataLayerOptions['selection'];
    if (initSelections && initSelections.length > 0)
      dataLayer.setInitialSelections(initSelections);

    if (initDisclosed && initDisclosed.length > 0)
      this._tmap.addDrilledLayer(parentLayer.getLayerName(), [dataLayer.getClientId(), initDisclosed]);

    if (topLayerName)
      parentLayer.updateDataLayer(dataLayer, this._tmap.getPanZoomCanvas().getContentPane().getMatrix(), topLayerName);
    else
      parentLayer.addDataLayer(dataLayer);
  }
};

/**
 * Parses a JSON object containing style defaults
 * @param {Object} styles The style default JSON object
 * @private
 */
DvtThematicMapJsonParser.prototype._parseStyles = function(styles) {
  this._tmap.parseComponentJson(styles);
  this._areaLayerStyle = new dvt.CSSStyle(styles['areaStyle']);
  this._areaLayerStyle.parseInlineStyle(styles['labelStyle']);
  this._areaDropSiteStyle = new dvt.CSSStyle(styles['dropTargetStyle']);
  this._tmap.setStyleDefaults(styles);
};

/**
 * Temporary method for parsing custom basemap xml for AMX and ADF until JET JSON API is approved.
 * @param {dvt.XmlNode} xmlNode The xml node containing custom basemap metadata
 * @private
 */
DvtThematicMapJsonParser.prototype._parseCustomBasemap = function(xmlNode) {
  var childNodes = xmlNode.getChildNodes();
  var node, nodeName;
  for (var i = 0; i < childNodes.length; i++) {
    node = childNodes[i];
    nodeName = node.getName();
    if (nodeName == 'layer')
      this._parseCustomLayer(node);
    else if (nodeName == 'points')
      this._parseCustomPoints(node);
  }
};


/**
 * Temporary method for parsing custom basemap xml for AMX and ADF until JET JSON API is approved.
 * @param {dvt.XmlNode} xmlNode The xml node containing custom layer metadata
 * @private
 */
DvtThematicMapJsonParser.prototype._parseCustomLayer = function(xmlNode) {
  var childNodes = xmlNode.getChildNodes();
  var layerName = xmlNode.getAttr('id');
  var node, nodeName;
  var images = [];
  for (var i = 0; i < childNodes.length; i++) {
    node = childNodes[i];
    nodeName = node.getName();
    // currently only images are supported
    if (nodeName == 'image') {
      var image = {};
      image['source'] = node.getAttr('source');
      image['width'] = Number(node.getAttr('width'));
      image['height'] = Number(node.getAttr('height'));
      var bidi = node.getAttr('bidi');
      var dir = node.getAttr('dir');
      // The bidi attribute is deprecated and dir="ltr/rtl" should be used instead.
      if (bidi == 'true' || dir == 'rtl')
        image['dir'] = 'rtl';
      else
        image['dir'] = 'ltr';
      images.push(image);
    }
  }
  this._customAreaLayerImages[layerName] = images;
};


/**
 * Temporary method for parsing custom basemap xml for AMX and ADF until JET JSON API is approved.
 * @param {dvt.XmlNode} xmlNode The xml node containing custom points metadata
 * @private
 */
DvtThematicMapJsonParser.prototype._parseCustomPoints = function(xmlNode) {
  var childNodes = xmlNode.getChildNodes();
  var node, nodeName;
  var points = {};
  var labels = {};
  for (var i = 0; i < childNodes.length; i++) {
    node = childNodes[i];
    nodeName = node.getName();
    if (nodeName == 'point') {
      points[node.getAttr('name')] = [Number(node.getAttr('x')), Number(node.getAttr('y'))];
      labels[node.getAttr('name')] = [null, node.getAttr('longLabel')];
    }
  }
  // register points with base map manager
  // index will change once we allow more layers besides point
  DvtBaseMapManager.registerBaseMapLayer(this._tmap.getMapName(), 'cities', labels, points, null, null, 1);
};


/**
 * Creates a map of area displayables for an area layer
 * @param {Array} areaNames The array of areas to generate displayables for
 * @return {Object}
 * @private
 */
DvtThematicMapJsonParser.prototype._createPathShapes = function(areaNames) {
  // create empty dvt.Path objects as placeholders
  var shapes = {};
  var context = this._tmap.getCtx();
  for (var area in areaNames) {
    shapes[area] = new dvt.Path(context);

    // Style area layer border and background colors
    var borderColor = this._areaLayerStyle.getStyle(dvt.CSSStyle.BORDER_COLOR);
    if (borderColor && borderColor != 'transparent') {
      var stroke = new dvt.SolidStroke(borderColor);
      if (this._tmap.supportsVectorEffects())
        stroke.setFixedWidth(true);
      shapes[area].setStroke(stroke);
    }

    var backgroundColor = this._areaLayerStyle.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
    if (backgroundColor != 'transparent')
      shapes[area].setSolidFill(backgroundColor);
    else //TODO set on area layer instead
      shapes[area].setFill(null);
  }
  return shapes;
};

/**
 * Creates a DvtMapDataArea
 * @param {DvtMapLayer} layer The map layer this data object belongs to
 * @param {DvtMapDataLayer} dataLayer The data layer this data object belongs to
 * @param {Object} data The JSON object containing data object attributes
 * @return {DvtMapDataArea} The data object
 * @private
 */
DvtThematicMapJsonParser.prototype._createArea = function(layer, dataLayer, data) {
  var areaId = data['location'];
  var areaShape = layer.getAreaShape(areaId);
  // only render data area if we have the path info for it and if it has a data color
  if (areaShape && data['color']) {
    // create an empty dvt.Path for now and will set the cmd at render time
    layer.setAreaRendered(areaId, false);
    var context = this._tmap.getCtx();
    var path = new DvtDrillablePath(context, this._tmap.supportsVectorEffects());

    data = dvt.JsonUtils.merge(data, this._tmap.getStyleDefaults()['dataAreaDefaults']);
    if (!data['labelStyle'])
      data['labelStyle'] = this._tmap.getStyleDefaults()['labelStyle'];

    var hs = new dvt.SolidStroke(data['hoverColor'], 1, DvtDrillablePath.HOVER_STROKE_WIDTH);
    var sis = new dvt.SolidStroke(data['selectedInnerColor'], 1, DvtDrillablePath.SELECTED_INNER_STROKE_WIDTH);
    var sos = new dvt.SolidStroke(data['selectedOuterColor'], 1, DvtDrillablePath.SELECTED_OUTER_STROKE_WIDTH);
    path.setHoverStroke(hs, null).setSelectedStroke(sis, sos);
    var dis = new dvt.SolidStroke(data['drilledInnerColor'], 1, DvtDrillablePath.DISCLOSED_INNER_STROKE_WIDTH);
    var dos = new dvt.SolidStroke(data['drilledOuterColor'], 1, DvtDrillablePath.DISCLOSED_OUTER_STROKE_WIDTH);
    path.setDisclosedStroke(dis, dos);

    // disable labels in area layer if data layer exists and has label
    layer.setLabelRendered(data['location'], false);
    this._styleDisplayable(data, path);
    var label = this._createLabel(layer, dataLayer, data, path, true);
    return new DvtMapAreaPeer(data, dataLayer, path, label);
  }
  return null;
};

/**
 * Creates a DvtMapDataMarker
 * @param {DvtMapLayer} layer The map layer this data object belongs to
 * @param {DvtMapDataLayer} dataLayer The data layer this data object belongs to
 * @param {Object} data The JSON object containing data object attributes
 * @param {boolean} isParentAreaDataLayer True if the parent is an area data layer
 * @return {DvtMapDataMarker} The data object
 * @private
 */
DvtThematicMapJsonParser.prototype._createMarker = function(layer, dataLayer, data, isParentAreaDataLayer) {
  var size = data['_size'];
  var center = DvtThematicMapJsonParser.getCenter(dataLayer, data);
  // Skip over data where no marker center was determined or values resulted in a calculated size of 0 pixels
  if (!center || size === 0)
    return null;

  // merge data marker default styles, need to handle label style differently because we want to merge the two css strings
  var markerDefaults = this._tmap.getStyleDefaults()['dataMarkerDefaults'];
  var markerLabelStyle = new dvt.CSSStyle(markerDefaults['labelStyle']);
  markerLabelStyle.parseInlineStyle(data['labelStyle']);
  data = dvt.JsonUtils.merge(data, markerDefaults);
  data['labelStyle'] = markerLabelStyle.toString();

  // Parse data object scales. Save original scale to maintain size despite zoom.
  var width;
  var height;
  if (size != null) {
    width = size;
    height = size;
  } else {
    var sx = data['scaleX'];
    if (sx == null)
      sx = 1;
    var sy = data['scaleY'];
    if (sy == null)
      sy = 1;

    var w = data['width'];
    if (w == null)
      w = this._tmap.getOptions()['styleDefaults']['dataMarkerDefaults']['width'];
    var h = data['height'];
    if (h == null)
      h = this._tmap.getOptions()['styleDefaults']['dataMarkerDefaults']['height'];

    width = w * sx;
    height = h * sy;
  }



  var br = data['borderRadius'];

  // id is used for custom marker definition lookup
  var marker;
  if (data['source']) {
    marker = new dvt.ImageMarker(this._tmap.getCtx(), center.x, center.y, width, height, br,
        data['source'], data['sourceSelected'], data['sourceHover'], data['sourceHoverSelected']);
  }
  else {
    var shapeType = data['shape'] ? data['shape'] : this._tmap.getOptions()['styleDefaults']['dataMarkerDefaults']['shape'];
    marker = new dvt.SimpleMarker(this._tmap.getCtx(), shapeType, this._tmap.getSkinName(), center.x, center.y, width, height, br);
  }
  var rotation = data['rotation'];
  if (rotation) {
    var radianRot = rotation * Math.PI / 180;
    marker.setRotation(radianRot);
  }
  // disable labels in area layer if data layer exists and has label
  if (isParentAreaDataLayer)
    layer.setLabelRendered(data['location'], false);

  this._styleDisplayable(data, marker);
  var label = this._createLabel(layer, dataLayer, data, marker, isParentAreaDataLayer);
  return new DvtMapObjPeer(data, dataLayer, marker, label, center);
};

/**
 * Creates a DvtMapDataImage
 * @param {DvtMapLayer} layer The map layer this data object belongs to
 * @param {DvtMapDataLayer} dataLayer The data layer this data object belongs to
 * @param {Object} data The JSON object containing data object attributes
 * @param {boolean} isParentAreaDataLayer True if the parent is an area data layer
 * @return {DvtMapDataImage} The data object
 * @private
 */
DvtThematicMapJsonParser.prototype._createImage = function(layer, dataLayer, data, isParentAreaDataLayer) {
  var center = DvtThematicMapJsonParser.getCenter(dataLayer, data);
  if (!center) // no matching city
    return null;

  var image = new dvt.Image(this._tmap.getCtx(), data['url']);
  var width = data['width'];
  var height = data['height'];
  // set x/y only if both width and height are set, otherwise x/y will be set in the callback
  if (width != null && height != null) {
    image.setX(center.x - width / 2);
    image.setY(center.y - height / 2);
    image.setWidth(width);
    image.setHeight(height);
  }

  // disable labels in area layer if data layer exists and has label
  if (isParentAreaDataLayer)
    layer.setLabelRendered(data['location'], false);

  var peer = new DvtMapObjPeer(data, dataLayer, image, null, center);
  if (!width || !height) {
    var callback = function(imageInfo) {
      if (imageInfo && imageInfo.width && imageInfo.height) {
        image.setWidth(imageInfo.width);
        image.setHeight(imageInfo.height);
        image.setX(center.x - imageInfo.width / 2);
        image.setY(center.y - imageInfo.height / 2);
        peer.__recenter();
      }
    };
    dvt.ImageLoader.loadImage(this._tmap.getCtx(), data['url'], callback);
  }
  return peer;
};

/**
 * Creates a DvtCustomDataItem
 * @param {DvtMapLayer} layer The map layer this data object belongs to
 * @param {DvtMapDataLayer} dataLayer The data layer this data object belongs to
 * @param {Object} data The JSON object containing data object attributes
 * @param {SVGElement} svgElem The custom svg DOM element
 * @param {boolean} isParentAreaDataLayer True if the parent is an area data layer
 * @return {DvtMapDataComponent} The data object
 * @private
 */
DvtThematicMapJsonParser.prototype._createCustomDataItem = function(layer, dataLayer, data, svgElem, isParentAreaDataLayer) {
  var center = DvtThematicMapJsonParser.getCenter(dataLayer, data);
  if (!center) // no matching city
    return null;

  // disable labels in area layer if data layer exists and has label
  if (isParentAreaDataLayer)
    layer.setLabelRendered(data['location'], false);

  var dataItem = new DvtCustomDataItem(this._tmap.getCtx(), svgElem, this._tmap.getStyleDefaults()['dataAreaDefaults']);
  return new DvtMapObjPeer(data, dataLayer, dataItem, null, center);
};

/**
 * Sets a label for a map data object
 * @param {DvtMapLayer} layer The map layer the data object belongs to
 * @param {DvtMapDataLayer} dataLayer The data layer the data object belongs to
 * @param {Object} data The JSON object containing label attributes
 * @param {dvt.Displayable} displayable The data object to set the label on
 * @param {boolean} isParentAreaDataLayer True if the parent is an area data layer
 * @return {dvt.Displayable} The label
 * @private
 */
DvtThematicMapJsonParser.prototype._createLabel = function(layer, dataLayer, data, displayable, isParentAreaDataLayer) {
  var areaId = data['location'];
  var labelText = data['label'];
  // if data label is provided, assume label display is on and if is from an area data layer, use area layer's label display
  var labelDisplay = labelText ? 'on' : 'off';
  if (isParentAreaDataLayer)
    labelDisplay = layer.getLabelDisplay();

  var isArea = displayable instanceof dvt.Path;
  // If object is in an areaDataLayer see if label is provided, if not, use the default area label
  if (!labelText && isParentAreaDataLayer && ((isArea && labelDisplay != 'off') ||
                                              (!isArea && labelDisplay == 'on'))) {
    labelText = (layer.getLabelType() == 'long' ? layer.getLongAreaName(areaId) : layer.getShortAreaName(areaId));
  }

  // Labels
  if (labelText) {
    var context = this._tmap.getCtx();
    var label;
    if (isArea)
      label = new DvtMapLabel(context, labelText, layer.getLabelInfoForArea ? layer.getLabelInfoForArea(areaId) : null,
                              labelDisplay, dataLayer.getDataLabelContainer(), this._tmap.supportsVectorEffects());
    else
      label = new dvt.OutputText(context, labelText, 0, 0);

    // Label styling
    var labelStyle = new dvt.CSSStyle();
    // add label style by merging styles sent from skin and tag
    if (isArea)
      labelStyle.merge(layer.getLayerCSSStyle());
    if (data['labelStyle']) {
      labelStyle.parseInlineStyle(data['labelStyle']);
    }
    var fillColor = labelStyle.getStyle(dvt.CSSStyle.COLOR);
    labelStyle.setStyle(dvt.CSSStyle.COLOR, null);
    label.setCSSStyle(labelStyle);
    // color label to contrast with data color if none provided or in high contrast mode
    if (label instanceof DvtMapLabel && (dvt.Agent.isHighContrast() || !fillColor)) {
      fillColor = dvt.ColorUtils.getContrastingTextColor(data['color']);
    }
    if (fillColor)
      label.setSolidFill(fillColor);
  }

  return label;
};

/**
 * Styles a map data object's displayable
 * @param {Object} style The css style object to style the displayable with
 * @param {dvt.Displayable} displayable The displayable to style
 * @private
 */
DvtThematicMapJsonParser.prototype._styleDisplayable = function(style, displayable) {
  var pattern = style['pattern'];
  var backgroundColor = style['color'];
  var gradient = (this._isMobile || this._tmap.getSkinName() == dvt.CSSStyle.SKIN_ALTA) ? 'none' : style['visualEffects'];

  // handle custom svg where color is set by user
  if (displayable instanceof dvt.SimpleMarker) {
    if (style['borderStyle'] != 'none') {
      var borderWidth = style['borderWidth'];
      if (typeof borderWidth == 'string') {
        if (borderWidth.slice(-2) == 'px')
          borderWidth = parseFloat(style['borderWidth'].slice(0, -2));
        else
          borderWidth = parseFloat(style['borderWidth']);
      }
      var stroke = new dvt.SolidStroke(style['borderColor'], 1, borderWidth);
      if (!this._tmap.isMarkerZoomBehaviorFixed())
        stroke.setFixedWidth(true);
      stroke.setType(dvt.Stroke.convertTypeString(style['borderStyle']));
      displayable.setStroke(stroke);
    }

    var opacity = style['opacity'];
    if (gradient != 'none')
      displayable.setFill(new dvt.MarkerGradient.createMarkerGradient(backgroundColor, displayable, opacity));
    else if (pattern)
      displayable.setFill(new dvt.PatternFill(pattern, backgroundColor, '#FFFFFF'));
    else if (backgroundColor)
      displayable.setSolidFill(backgroundColor, opacity);
  }
  else if (displayable instanceof dvt.Path) {
    var borderColor = style['borderColor'];
    if (borderColor) {
      var stroke = new dvt.SolidStroke(borderColor);
      if (this._tmap.supportsVectorEffects())
        stroke.setFixedWidth(true);
      displayable.setStroke(stroke);
    }

    if (pattern)
      displayable.savePatternFill(new dvt.PatternFill(pattern, backgroundColor, '#FFFFFF'));
    else
      displayable.setSolidFill(backgroundColor, opacity);
  }
};


/**
 * Retrieves the x/y coordinates for this data object if they exist
 * @param {DvtMapDataLayer} dataLayer The map data layer to look up coordinate data from
 * @param {Object} data The JSON object containing data object info
 * @return {dvt.Point}
 */
DvtThematicMapJsonParser.getCenter = function(dataLayer, data) {
  // We can get the coordiantes for a marker if they are:
  // 1) Passed in the xml
  // 2) A supported city
  // 3) A supported Area
  var map = dataLayer.getMap();
  var mapName = map.getMapName();
  var location = data['location'];
  if (location) {
    var locationCoords = DvtBaseMapManager.getAreaCenter(mapName, dataLayer.getMapLayer().getLayerName(), location);
    if (!locationCoords)
      locationCoords = DvtBaseMapManager.getCityCoordinates(mapName, location);
    return locationCoords;
  } else {
    return DvtThematicMapProjections.project(data['x'], data['y'], map.getMapName());
  }
};

/**
 * Parses an array of popup behaviors and creates an array of dvt.ShowPopupBehavior objects
 * @param {Array} popups An array of show popup behavior objects
 * @return {Array} An array of dvt.ShowPopupBehavior objects
 * @private
 */
DvtThematicMapJsonParser.prototype._getShowPopupBehaviors = function(popups) {
  var spbs = [];
  for (var i = 0; i < popups.length; i++)
    spbs.push(new dvt.ShowPopupBehavior(popups[i]['popupId'], popups[i]['triggerType'], null, popups[i]['align']));
  return spbs;
};

/**
 * Calculates the bubble sizes for the thematic map.
 * @param {dvt.ThematicMap} tmap The owning component
 * @param {Array} markers The array of markers to caclulate sizes for
 */
DvtThematicMapJsonParser.calcBubbleSizes = function(tmap, markers) {
  // Run thru markers and calc min/max values, skipping markers that don't have value option
  var maxValue = -Infinity;
  var minValue = Infinity;
  var valKey = 'value';
  for (var i = 0; i < markers.length; i++) {
    var value = markers[i][valKey];
    // Negative and zero marker values don't correlate to a marker radius size so we skip them when determining range
    if (value == null || value <= 0)
      continue;
    maxValue = Math.max(maxValue, value);
    minValue = Math.min(minValue, value);
  }

  // No marker values provided value option, skip marker sizing calculation
  if (minValue === Infinity)
    return;

  // Min/max allowed marker sizes
  var minSize = DvtThematicMapJsonParser._MIN_MARKER_SIZE;
  var maxSize = DvtThematicMapJsonParser._MAX_MARKER_SIZE_RATIO * Math.min(tmap.getWidth(), tmap.getHeight());
  // Loop through the data and update the sizes
  for (var i = 0; i < markers.length; i++) {
    var value = markers[i][valKey];
    // Treat markers with missing values the same as we treat negative/zero valued markers and set size to 0 so we skip rendering them
    markers[i]['_size'] = (value == null || value <= 0) ? 0 : dvt.LayoutUtils.getBubbleSize(value, minValue, maxValue, minSize, maxSize);
  }
};
var DvtThematicMapProjections = {
};

dvt.Obj.createSubclass(DvtThematicMapProjections, dvt.Obj);

DvtThematicMapProjections._VIEWPORT_BOUNDS = new dvt.Rectangle(0, 0, 800, 500);
DvtThematicMapProjections._RADIUS = 6378206.4;

DvtThematicMapProjections._NEW_ZEALAND_RECT = new dvt.Rectangle(500, 200, 200, 200);
DvtThematicMapProjections._NEW_ZEALAND_BOUNDS = new dvt.Rectangle(163, - 49, 17, 17);
DvtThematicMapProjections._AFRICA_BOUNDS = new dvt.Rectangle(- 17.379205428479874, - 37.201510854305546, 68.66391442808313, 77.50071544582713);
DvtThematicMapProjections._ASIA_BOUNDS = new dvt.Rectangle(- 0.8436866097568272, - 0.7626456732012923, 1.8336308036296942, 1.5748427214611724);
DvtThematicMapProjections._AUSTRALIA_BOUNDS = new dvt.Rectangle(113.29667079927977, - 52.89550592498755, 65.25257389065216, 42.123114617504626);
DvtThematicMapProjections._EUROPE_BOUNDS = new dvt.Rectangle(- 0.47944476148667076, - 0.0014669405958800579, 0.7364925893845453, 0.6293972741802124);
DvtThematicMapProjections._N_AMERICA_BOUNDS = new dvt.Rectangle(- 0.6154469465354344, - 0.24589767758847714, 1.2448236795108683, 1.2631535127174947);
DvtThematicMapProjections._S_AMERICA_BOUNDS = new dvt.Rectangle(- 80.60817722658722, - 60.796273249672765, 46.608687602908056, 66.96595767361796);
DvtThematicMapProjections._APAC_BOUNDS = new dvt.Rectangle(68.20516856593524, - 52.89892708045518, 111.65739821771903, 116.55460214469134);
DvtThematicMapProjections._EMEA_BOUNDS = new dvt.Rectangle(- 24.543831069368586, - 37.202500659225905, 204.54283106936856, 164.9634493690208);
DvtThematicMapProjections._L_AMERICA_BOUNDS = new dvt.Rectangle(- 117.12451221229134, - 54.95921623126266, 82.33223251442891, 87.67786623127876);
DvtThematicMapProjections._USA_CANADA_BOUNDS = new dvt.Rectangle(- 0.6154656300926513, 0.0507209798775865, 1.0153104799231851, 0.966537441082997);
DvtThematicMapProjections._WORLD_BOUNDS = new dvt.Rectangle(- 171.9, - 62.6, 349.8, 150.8);
DvtThematicMapProjections._ALASKA1_RECT = new dvt.Rectangle(172, 51, 8, 3);
DvtThematicMapProjections._ALASKA2_RECT = new dvt.Rectangle(- 180, 51, 51, 21);
DvtThematicMapProjections._HAWAII_RECT = new dvt.Rectangle(- 178.5, 18.9, 35, 11);
DvtThematicMapProjections._USA_RECT = new dvt.Rectangle(- 124.8, 24.4, 58, 25.5);
DvtThematicMapProjections._ALASKA_BOUNDS = new dvt.Rectangle(- 187.5517578125, 59.82610321044922, 57.562225341796875, 43.83738708496094);
DvtThematicMapProjections._HAWAII_BOUNDS = new dvt.Rectangle(- 160.23606872558594, 18.91549301147461, 5.4374847412109375, 3.3189010620117188);
DvtThematicMapProjections._USA_BOUNDS = new dvt.Rectangle(- 2386803.25, - 1183550.5, 4514111, 2908402);
DvtThematicMapProjections._HAWAII_WINDOW = new dvt.Rectangle(165.0, 400.0, 100.0, 100.0);
DvtThematicMapProjections._ALASKA_WINDOW = new dvt.Rectangle(-75.0, 350.0, 240.0, 150.0);

DvtThematicMapProjections._ROBINSON_COORDINATES = [[1, 0], [0.9986, 0.0314], [0.9954, 0.0629], [0.9900, 0.0943], [0.9822, 0.1258], [0.9730, 0.1572], [0.9600, 0.1887], [0.9427, 0.2201], [0.9216, 0.2515], [0.8962, 0.2826], [0.8679, 0.3132], [0.8350, 0.3433], [0.7986, 0.3726], [0.7597, 0.4008], [0.6732, 0.4532], [0.6213, 0.4765], [0.5722, 0.4951], [0.5322, 0.5072]];


/**
 * Gets the projection for built-in basemaps to be used for JET/AMX
 * @param {number} x Longitude
 * @param {number} y Latitude
 * @param {String} basemap The basemap name
 * @return {dvt.Point} The projected point in the basemap coordinate system for built-in basemaps, or null if the point is outside of the basemap bounds.
 */
DvtThematicMapProjections.project = function(x, y, basemap) {
  var point;
  switch (basemap) {
    case 'africa':
      point = DvtThematicMapProjections._getAffineProjection(DvtThematicMapProjections._AFRICA_BOUNDS,
                                                             DvtThematicMapProjections._getMercatorProjection(x, y));
      break;
    case 'asia':
      point = DvtThematicMapProjections._getAffineProjection(DvtThematicMapProjections._ASIA_BOUNDS,
                                                             DvtThematicMapProjections._getAlbersEqualAreaConicProjection(40, 95, 20, 60, x, y),
                                                             DvtThematicMapProjections.toRadians(5));
      break;
    case 'australia':
      point = DvtThematicMapProjections._getAustraliaProjection(x, y);
      break;
    case 'europe':
      point = DvtThematicMapProjections._getAffineProjection(DvtThematicMapProjections._EUROPE_BOUNDS,
                                                             DvtThematicMapProjections._getAlbersEqualAreaConicProjection(35, 25, 40, 65, x, y),
                                                             DvtThematicMapProjections.toRadians(10));
      break;
    case 'northAmerica':
      point = DvtThematicMapProjections._getAffineProjection(DvtThematicMapProjections._N_AMERICA_BOUNDS,
                                                             DvtThematicMapProjections._getAlbersEqualAreaConicProjection(23, - 96, 20, 60, x, y));
      break;
    case 'southAmerica':
      point = DvtThematicMapProjections._getAffineProjection(DvtThematicMapProjections._S_AMERICA_BOUNDS,
                                                             new dvt.Point(x, y),
                                                             DvtThematicMapProjections.toRadians(5));
      break;
    case 'apac':
      point = DvtThematicMapProjections._getAffineProjection(DvtThematicMapProjections._APAC_BOUNDS,
                                                             DvtThematicMapProjections._getMercatorProjection(x, y));
      break;
    case 'emea':
      point = DvtThematicMapProjections._getAffineProjection(DvtThematicMapProjections._EMEA_BOUNDS,
                                                             DvtThematicMapProjections._getMercatorProjection(x, y));
      break;
    case 'latinAmerica':
      point = DvtThematicMapProjections._getAffineProjection(DvtThematicMapProjections._L_AMERICA_BOUNDS,
          new dvt.Point(x, y));
      break;
    case 'usaAndCanada':
      point = DvtThematicMapProjections._getAffineProjection(DvtThematicMapProjections._USA_CANADA_BOUNDS,
                                                             DvtThematicMapProjections._getAlbersEqualAreaConicProjection(23, - 96, 20, 60, x, y));
      break;
    case 'worldRegions':
      point = DvtThematicMapProjections._getWorldProjection(x, y);
      break;
    case 'usa':
      point = DvtThematicMapProjections._getUSAProjection(x, y);
      break;
    case 'world':
      point = DvtThematicMapProjections._getWorldProjection(x, y);
      break;
    default :
      break;
  }
  if (point)
    return new dvt.Point(point.x * 10, point.y * 10);// multiply by 10 because basemaps are 10x bigger
  else
    return null;
};


/**
 * Returns the projected long/lat point in the usa basemap coordinate system
 * @param {number} x Longitude
 * @param {number} y Latitude
 * @return {dvt.Point} The projected point in the basemap coordinate system for built-in basemaps, or null if the point is outside of the basemap bounds.
 * @private
 */
DvtThematicMapProjections._getUSAProjection = function(x, y) {
  var viewPortTransform;
  var transformedPoint;
  if (DvtThematicMapProjections._ALASKA1_RECT.containsPoint(x, y) || DvtThematicMapProjections._ALASKA2_RECT.containsPoint(x, y)) {
    viewPortTransform = DvtThematicMapProjections._getViewPortTransformation(DvtThematicMapProjections._ALASKA_BOUNDS, DvtThematicMapProjections._ALASKA_WINDOW);
    transformedPoint = DvtThematicMapProjections._applyAffineTransform(viewPortTransform, DvtThematicMapProjections._getMercatorProjection(x, y));
  }
  else if (DvtThematicMapProjections._HAWAII_RECT.containsPoint(x, y)) {
    viewPortTransform = DvtThematicMapProjections._getViewPortTransformation(DvtThematicMapProjections._HAWAII_BOUNDS, DvtThematicMapProjections._HAWAII_WINDOW);
    transformedPoint = DvtThematicMapProjections._applyAffineTransform(viewPortTransform, new dvt.Point(x, y));
  }
  else if (DvtThematicMapProjections._USA_RECT.containsPoint(x, y)) {
    viewPortTransform = DvtThematicMapProjections._getViewPortTransformation(DvtThematicMapProjections._USA_BOUNDS, DvtThematicMapProjections._VIEWPORT_BOUNDS);
    transformedPoint = DvtThematicMapProjections._applyAffineTransform(viewPortTransform, DvtThematicMapProjections._getOrthographicProjection(new dvt.Point(- 95, 36), x, y));
  }

  return DvtThematicMapProjections._getBoundedTransformedPoint(DvtThematicMapProjections._VIEWPORT_BOUNDS, transformedPoint);
};


/**
 * Returns the projected long/lat point in the world basemap coordinate system
 * @param {number} x Longitude
 * @param {number} y Latitude
 * @return {dvt.Point} The projected point in the basemap coordinate system for built-in basemaps, or null if the point is outside of the basemap bounds.
 * @private
 */
DvtThematicMapProjections._getWorldProjection = function(x, y) {
  var viewPortTransform = DvtThematicMapProjections._getViewPortTransformation(DvtThematicMapProjections._WORLD_BOUNDS, DvtThematicMapProjections._VIEWPORT_BOUNDS);

  var transformedPoint = DvtThematicMapProjections._applyAffineTransform(viewPortTransform, DvtThematicMapProjections._getRobinsonProjection(x, y));
  return DvtThematicMapProjections._getBoundedTransformedPoint(DvtThematicMapProjections._VIEWPORT_BOUNDS, transformedPoint);
};


/**
 * Returns the projected long/lat point in the australia basemap coordinate system
 * @param {number} x Longitude
 * @param {number} y Latitude
 * @return {dvt.Point} The projected point in the basemap coordinate system for built-in basemaps, or null if the point is outside of the basemap bounds.
 * @private
 */
DvtThematicMapProjections._getAustraliaProjection = function(x, y) {
  var viewPortTransform;
  if (DvtThematicMapProjections._NEW_ZEALAND_BOUNDS.containsPoint(x, y))
    viewPortTransform = DvtThematicMapProjections._getViewPortTransformation(DvtThematicMapProjections._NEW_ZEALAND_BOUNDS, DvtThematicMapProjections._NEW_ZEALAND_RECT);
  else
    viewPortTransform = DvtThematicMapProjections._getViewPortTransformation(DvtThematicMapProjections._AUSTRALIA_BOUNDS, DvtThematicMapProjections._VIEWPORT_BOUNDS);

  var transformedPoint = DvtThematicMapProjections._applyAffineTransform(viewPortTransform, DvtThematicMapProjections._getMercatorProjection(x, y));
  return DvtThematicMapProjections._getBoundedTransformedPoint(DvtThematicMapProjections._VIEWPORT_BOUNDS, transformedPoint);
};


/**
 * Applies an affine transform to a point
 * @param {dvt.Rectangle} mapBounds The map bounds
 * @param {dvt.Point} point The point to apply the transform to
 * @param {number} rotRadians The rotation to apply to the transform matrix in radians
 * @private
 */
DvtThematicMapProjections._getAffineProjection = function(mapBounds, point, rotRadians) {
  var viewPortTransform = DvtThematicMapProjections._getViewPortTransformation(mapBounds, DvtThematicMapProjections._VIEWPORT_BOUNDS);
  if (rotRadians) {
    var rotMatrix = new dvt.Matrix();
    rotMatrix.rotate(rotRadians);
    viewPortTransform = DvtThematicMapProjections._concatAffineTransforms(viewPortTransform, rotMatrix);
  }
  var transformedPoint = viewPortTransform.transformPoint(point);
  return DvtThematicMapProjections._getBoundedTransformedPoint(DvtThematicMapProjections._VIEWPORT_BOUNDS, transformedPoint);
};


/**
 * Returns the given point if it is contained within the given bounds, or null if it is outside of the bounds
 * @param {dvt.Rectangle} bounds The map bounds
 * @param {dvt.Point} point The point
 * @return {dvt.Point} The original point or null if it is outside of the projection bounds
 * @private
 */
DvtThematicMapProjections._getBoundedTransformedPoint = function(bounds, point) {
  if (!point || !(bounds.containsPoint(point.x, point.y)))
    return null;

  return point;
};

/**
 * Returns the projected long/lat point using the albers equal area conic projection
 * @param {number} latOfOrigin latitude for the origin, in degrees
 * @param {number} lonOfOrigin longitude for the origin, in degrees
 * @param {number} sP1 standard parallel 1, in degrees
 * @param {number} sP2 standard parallel 2, in degrees
 * @param {number} x Longitude
 * @param {number} y Latitude
 * @return {dvt.Point} The projected point in the basemap coordinate system for built-in basemaps or the original point
 * @private
 */
DvtThematicMapProjections._getAlbersEqualAreaConicProjection = function(latOfOrigin, lonOfOrigin, sP1, sP2, x, y) {
  var lambda0 = DvtThematicMapProjections.toRadians(lonOfOrigin);
  var phi0 = DvtThematicMapProjections.toRadians(latOfOrigin);
  sP1 = DvtThematicMapProjections.toRadians(sP1);
  sP2 = DvtThematicMapProjections.toRadians(sP2);

  var n = 0.5 * (Math.sin(sP1) + Math.sin(sP2));
  var c = Math.pow((Math.cos(sP1)), 2) + (2 * n * Math.sin(sP1));

  var rho0 = c - (2 * n * Math.sin(phi0));
  rho0 = Math.sqrt(rho0) / n;

  var lambda = DvtThematicMapProjections.toRadians(x);
  var phi = DvtThematicMapProjections.toRadians(y);

  var theta = n * (lambda - lambda0);

  var rho = c - (2 * n * Math.sin(phi));
  rho = Math.sqrt(rho) / n;

  var pX = rho * Math.sin(theta);
  var pY = rho0 - (rho * Math.cos(theta));

  return new dvt.Point(pX, pY);
};


/**
 * Returns the projected long/lat point using the mercator projection assuming center is at 0,0
 * @param {number} x Longitude
 * @param {number} y Latitude
 * @return {dvt.Point} The projected point in the basemap coordinate system for built-in basemaps or the original point
 * @private
 */
DvtThematicMapProjections._getMercatorProjection = function(x, y) {
  var pY = Math.log(Math.tan(0.25 * Math.PI + 0.5 * DvtThematicMapProjections.toRadians(y)));
  return new dvt.Point(x, DvtThematicMapProjections.toDegrees(pY));
};


/**
 * Returns the projected long/lat point using the orthographic projection
 * @param {number} x Longitude
 * @param {number} y Latitude
 * @return {dvt.Point} The projected point in the basemap coordinate system for built-in basemaps or the original point
 * @private
 */
DvtThematicMapProjections._getOrthographicProjection = function(center, x, y) {
  var radX = DvtThematicMapProjections.toRadians(x);
  var radY = DvtThematicMapProjections.toRadians(y);
  var centerX = DvtThematicMapProjections.toRadians(center.x);
  var centerY = DvtThematicMapProjections.toRadians(center.y);
  var px = Math.cos(radY) * Math.sin(radX - centerX);
  var py = Math.cos(centerY) * Math.sin(radY) - Math.sin(centerY) * Math.cos(radY) * Math.cos(radX - centerX);
  return new dvt.Point(px * DvtThematicMapProjections._RADIUS, py * DvtThematicMapProjections._RADIUS);
};


/**
 * Returns the projected long/lat point using the robinson projection assuming center is at 0,0
 * @param {number} x Longitude
 * @param {number} y Latitude
 * @return {dvt.Point} The projected point in the basemap coordinate system for built-in basemaps or the original point
 * @private
 */
DvtThematicMapProjections._getRobinsonProjection = function(x, y) {
  var ycriteria = Math.floor(Math.abs(y) / 5);
  if (ycriteria >= DvtThematicMapProjections._ROBINSON_COORDINATES.length - 1)
    ycriteria = DvtThematicMapProjections._ROBINSON_COORDINATES.length - 2;

  var yInterval = (Math.abs(y) - ycriteria * 5) / 5;

  var xLength = DvtThematicMapProjections._ROBINSON_COORDINATES[ycriteria + 1][0] - DvtThematicMapProjections._ROBINSON_COORDINATES[ycriteria][0];
  var yLength = DvtThematicMapProjections._ROBINSON_COORDINATES[ycriteria + 1][1] - DvtThematicMapProjections._ROBINSON_COORDINATES[ycriteria][1];

  var newX = x * (DvtThematicMapProjections._ROBINSON_COORDINATES[ycriteria][0] + yInterval * xLength);
  var newY = (DvtThematicMapProjections._ROBINSON_COORDINATES[ycriteria][1] + yInterval * yLength);

  if (y < 0)
    newY = - 1 * newY;

  return new dvt.Point(newX, newY * 180);
};


/**
 * Applies an affine transformation to a dvt.Point
 * @param {dvt.Matrix} matrix The affine transformation matrix
 * @param {dvt.Point} point The point to apply the transform to
 * @return {dvt.Point} The transformed point
 * @private
 */
DvtThematicMapProjections._applyAffineTransform = function(matrix, point) {
  return new dvt.Point(point.x * matrix.getA() + matrix.getTx(), point.y * matrix.getD() + matrix.getTy());
};


/**
 * Returns the projected long/lat point using the robinson projection assuming center is at 0,0
 * @param {number} x Longitude
 * @param {number} y Latitude
 * @return {dvt.Point} The projected point in the basemap coordinate system for built-in basemaps or the original point
 * @private
 */
DvtThematicMapProjections._concatAffineTransforms = function(transform1, transform2) {
  var t1A = transform1.getA();
  var a = transform2.getA() * t1A;
  var b = transform2.getB() * t1A;
  var tx = transform1.getTx() + transform2.getTx() * t1A;

  var t1D = transform1.getD();
  var c = transform2.getC() * t1D;
  var d = transform2.getD() * t1D;
  var ty = transform1.getTy() + transform2.getTy() * t1D;

  return new dvt.Matrix(a, b, c, d, tx, ty);
};


/**
 * Gets the viewport transformation matrix
 * @param {dvt.Rectangle} mapBound The map bounds
 * @param {dvt.Rectangle} deviceView The viewport bounds
 * @return {dvt.Matrix} The viewport transform matrix
 * @private
 */
DvtThematicMapProjections._getViewPortTransformation = function(mapBound, deviceView) {
  var i = deviceView.x;
  var j = deviceView.y;

  var d = mapBound.w;
  var d1 = mapBound.h;
  var d2 = 0;
  var d3 = deviceView.w / d;
  var d4 = deviceView.h / d1;
  d2 = (d3 <= d4) ? d3 : d4;
  var d5 = i - mapBound.x * d2;
  var d6 = j + mapBound.y * d2;
  d5 += (deviceView.w - d * d2) / 2;
  d6 += deviceView.h - (deviceView.h - d1 * d2) / 2;

  return new dvt.Matrix(d2, 0, 0, - d2, d5, d6);
};


/**
 * Converts a number to radians
 * @param {number} x The number to convert to radians
 * @return {number} The number converted to radians
 */
DvtThematicMapProjections.toRadians = function(x) {
  return x * (Math.PI / 180);
};


/**
 * Converts a number to degrees
 * @param {number} x The number to convert to degrees
 * @return {number} The number converted to degrees
 */
DvtThematicMapProjections.toDegrees = function(x) {
  return x * (180 / Math.PI);
};


/**
 * Gets the inverse projection for built-in basemaps to be used for drag and drop
 * @param {number} x The x coordinate in the basemap coordinate system
 * @param {number} y The y coordinate in the basemap coordinate system
 * @param {String} basemap The basemap name
 * @return {dvt.Point} The inversely projected point in longitude/latitude for built-in basemaps or the original point
 */
DvtThematicMapProjections.inverseProject = function(x, y, basemap) {
  var point;
  // divide by 10 because basemaps are 10x larger than original projected maps
  x /= 10;
  y /= 10;
  switch (basemap) {
    case 'africa':
      point = DvtThematicMapProjections._getInverseAffineProjection(DvtThematicMapProjections._AFRICA_BOUNDS,
                                                                    new dvt.Point(x, y));
      point = DvtThematicMapProjections._getInverseMercatorProjection(point.x, point.y);
      break;
    case 'asia':
      point = DvtThematicMapProjections._getInverseAffineProjection(DvtThematicMapProjections._ASIA_BOUNDS,
                                                                    new dvt.Point(x, y),
                                                                    DvtThematicMapProjections.toRadians(5));
      point = DvtThematicMapProjections._getInverseAlbersEqualAreaConicProjection(40, 95, 20, 60, point.x, point.y);
      break;
    case 'australia':
      point = DvtThematicMapProjections._getInverseAustraliaProjection(x, y);
      break;
    case 'europe':
      point = DvtThematicMapProjections._getInverseAffineProjection(DvtThematicMapProjections._EUROPE_BOUNDS,
                                                                    new dvt.Point(x, y),
                                                                    DvtThematicMapProjections.toRadians(10));
      point = DvtThematicMapProjections._getInverseAlbersEqualAreaConicProjection(35, 25, 40, 65, point.x, point.y);
      break;
    case 'northAmerica':
      point = DvtThematicMapProjections._getInverseAffineProjection(DvtThematicMapProjections._N_AMERICA_BOUNDS,
                                                                    new dvt.Point(x, y));
      point = DvtThematicMapProjections._getInverseAlbersEqualAreaConicProjection(23, - 96, 20, 60, point.x, point.y);
      break;
    case 'southAmerica':
      point = DvtThematicMapProjections._getInverseAffineProjection(DvtThematicMapProjections._S_AMERICA_BOUNDS,
                                                                    new dvt.Point(x, y),
                                                                    DvtThematicMapProjections.toRadians(5));
      break;
    case 'apac':
      point = DvtThematicMapProjections._getInverseAffineProjection(DvtThematicMapProjections._APAC_BOUNDS,
                                                                    new dvt.Point(x, y));
      point = DvtThematicMapProjections._getInverseMercatorProjection(point.x, point.y);
      break;
    case 'emea':
      point = DvtThematicMapProjections._getInverseAffineProjection(DvtThematicMapProjections._EMEA_BOUNDS,
                                                                    new dvt.Point(x, y));
      point = DvtThematicMapProjections._getInverseMercatorProjection(point.x, point.y);
      break;
    case 'latinAmerica':
      point = DvtThematicMapProjections._getInverseAffineProjection(DvtThematicMapProjections._L_AMERICA_BOUNDS,
                                                                    new dvt.Point(x, y));
      break;
    case 'usaAndCanada':
      point = DvtThematicMapProjections._getInverseAffineProjection(DvtThematicMapProjections._USA_CANADA_BOUNDS,
                                                                    new dvt.Point(x, y));
      point = DvtThematicMapProjections._getInverseAlbersEqualAreaConicProjection(23, - 96, 20, 60, point.x, point.y);
      break;
    case 'worldRegions':
      point = DvtThematicMapProjections._getInverseWorldProjection(x, y);
      break;
    case 'usa':
      point = DvtThematicMapProjections._getInverseUSAProjection(x, y);
      break;
    case 'world':
      point = DvtThematicMapProjections._getInverseWorldProjection(x, y);
      break;
    default :
      break;
  }
  if (point)
    return point;
  else
    return new dvt.Point(x, y);
};


/**
 * Returns the inversely projected long/lat point in the usa basemap coordinate system
 * @param {number} x The x coordinate in the basemap coordinate system
 * @param {number} y The y coordinate in the basemap coordinate system
 * @return {dvt.Point} The projected point in longitude/latitude using the basemap projection
 * @private
 */
DvtThematicMapProjections._getInverseUSAProjection = function(x, y) {
  var viewPortTransform;
  if (DvtThematicMapProjections._ALASKA_WINDOW.containsPoint(x, y)) {
    viewPortTransform = DvtThematicMapProjections._getViewPortTransformation(DvtThematicMapProjections._ALASKA_BOUNDS, DvtThematicMapProjections._ALASKA_WINDOW);
    viewPortTransform.invert();
    var point = viewPortTransform.transformPoint(new dvt.Point(x, y));
    return DvtThematicMapProjections._getInverseMercatorProjection(point.x, point.y);
  }
  else if (DvtThematicMapProjections._HAWAII_WINDOW.containsPoint(x, y)) {
    viewPortTransform = DvtThematicMapProjections._getViewPortTransformation(DvtThematicMapProjections._HAWAII_BOUNDS, DvtThematicMapProjections._HAWAII_WINDOW);
    viewPortTransform.invert();
    return viewPortTransform.transformPoint(new dvt.Point(x, y));
  }
  else if (DvtThematicMapProjections._VIEWPORT_BOUNDS.containsPoint(x, y)) {
    viewPortTransform = DvtThematicMapProjections._getViewPortTransformation(DvtThematicMapProjections._USA_BOUNDS, DvtThematicMapProjections._VIEWPORT_BOUNDS);
    viewPortTransform.invert();
    var point = viewPortTransform.transformPoint(new dvt.Point(x, y));
    return DvtThematicMapProjections._getInverseOrthographicProjection(new dvt.Point(- 95, 36), point.x, point.y);
  }
  return new dvt.Point(x, y);
};


/**
 * Returns the inversely projected long/lat point in the world basemap coordinate system
 * @param {number} x The x coordinate in the basemap coordinate system
 * @param {number} y The y coordinate in the basemap coordinate system
 * @return {dvt.Point} The projected point in longitude/latitude using the basemap projection
 * @private
 */
DvtThematicMapProjections._getInverseWorldProjection = function(x, y) {
  var viewPortTransform = DvtThematicMapProjections._getViewPortTransformation(DvtThematicMapProjections._WORLD_BOUNDS, DvtThematicMapProjections._VIEWPORT_BOUNDS);
  viewPortTransform.invert();
  var point = viewPortTransform.transformPoint(new dvt.Point(x, y));
  return DvtThematicMapProjections._getInverseRobinsonProjection(point.x, point.y);
};


/**
 * Returns the inversely projected long/lat point in the australia basemap coordinate system
 * @param {number} x The x coordinate in the basemap coordinate system
 * @param {number} y The y coordinate in the basemap coordinate system
 * @return {dvt.Point} The projected point in longitude/latitude using the basemap projection
 * @private
 */
DvtThematicMapProjections._getInverseAustraliaProjection = function(x, y) {
  var viewPortTransform;
  if (DvtThematicMapProjections._NEW_ZEALAND_RECT.containsPoint(x, y))
    viewPortTransform = DvtThematicMapProjections._getViewPortTransformation(DvtThematicMapProjections._NEW_ZEALAND_BOUNDS, DvtThematicMapProjections._NEW_ZEALAND_RECT);
  else
    viewPortTransform = DvtThematicMapProjections._getViewPortTransformation(DvtThematicMapProjections._AUSTRALIA_BOUNDS, DvtThematicMapProjections._VIEWPORT_BOUNDS);

  viewPortTransform.invert();
  var point = viewPortTransform.transformPoint(new dvt.Point(x, y));
  return DvtThematicMapProjections._getInverseMercatorProjection(point.x, point.y);
};


/**
 * Applies an inverse affine transform to a point
 * @param {dvt.Rectangle} mapBounds The map bounds
 * @param {dvt.Point} point The point to apply the transform to
 * @param {number} rotRadians The rotation to apply to the transform matrix in radians
 * @private
 */
DvtThematicMapProjections._getInverseAffineProjection = function(mapBounds, point, rotRadians) {
  var viewPortTransform = DvtThematicMapProjections._getViewPortTransformation(mapBounds, DvtThematicMapProjections._VIEWPORT_BOUNDS);
  if (rotRadians) {
    var rotMatrix = new dvt.Matrix();
    rotMatrix.rotate(rotRadians);
    viewPortTransform = DvtThematicMapProjections._concatAffineTransforms(viewPortTransform, rotMatrix);
  }
  viewPortTransform.invert();
  return viewPortTransform.transformPoint(point);
};


/**
 * Returns the inversely projected long/lat point using the albers equal area conic projection
 * @param {number} x The x coordinate in the basemap coordinate system
 * @param {number} y The y coordinate in the basemap coordinate system
 * @return {dvt.Point} The projected point in longitude/latitude using the basemap projection
 * @private
 */
DvtThematicMapProjections._getInverseAlbersEqualAreaConicProjection = function(latOfOrigin, lonOfOrigin, sP1, sP2, x, y) {
  var lambda0 = DvtThematicMapProjections.toRadians(lonOfOrigin);
  var phi0 = DvtThematicMapProjections.toRadians(latOfOrigin);
  sP1 = DvtThematicMapProjections.toRadians(sP1);
  sP2 = DvtThematicMapProjections.toRadians(sP2);

  var n = 0.5 * (Math.sin(sP1) + Math.sin(sP2));
  var c = Math.pow((Math.cos(sP1)), 2) + (2 * n * Math.sin(sP1));

  var p0 = c - (2 * n * Math.sin(phi0));
  p0 = Math.sqrt(p0) / n;

  var p = Math.sqrt(x * x + (p0 - y) * (p0 - y));
  var pheta = Math.atan(x / (p0 - y));

  var py = Math.asin((c - p * p * n * n) / (2 * n));
  var px = lambda0 + pheta / n;

  return new dvt.Point(DvtThematicMapProjections.toDegrees(px), DvtThematicMapProjections.toDegrees(py));
};


/**
 * Returns the inversely projected long/lat point using the mercator projection, assuming center at 0,0
 * @param {number} x The x coordinate in the basemap coordinate system
 * @param {number} y The y coordinate in the basemap coordinate system
 * @return {dvt.Point} The projected point in longitude/latitude using the basemap projection
 * @private
 */
DvtThematicMapProjections._getInverseMercatorProjection = function(x, y) {
  var py = 2 * Math.atan(Math.exp(DvtThematicMapProjections.toRadians(y))) - 0.5 * Math.PI;
  return new dvt.Point(x, DvtThematicMapProjections.toDegrees(py));
};


/**
 * Returns the inversely projected long/lat point using the orthographic projection, assuming center at 0,0
 * @param {number} x The x coordinate in the basemap coordinate system
 * @param {number} y The y coordinate in the basemap coordinate system
 * @return {dvt.Point} The projected point in longitude/latitude using the basemap projection
 * @private
 */
DvtThematicMapProjections._getInverseOrthographicProjection = function(center, x, y) {
  var radX = x / DvtThematicMapProjections._RADIUS;
  var radY = y / DvtThematicMapProjections._RADIUS;
  var centerX = DvtThematicMapProjections.toRadians(center.x);
  var centerY = DvtThematicMapProjections.toRadians(center.y);

  var p = Math.sqrt((radX * radX) + (radY * radY));
  var c = Math.asin(p);

  var py = Math.asin(Math.cos(c) * Math.sin(centerY) + (radY * Math.sin(c) * Math.cos(centerY) / p));
  var px = centerX + Math.atan(radX * Math.sin(c) / (p * Math.cos(centerY) * Math.cos(c) - radY * Math.sin(centerY) * Math.sin(c)));

  return new dvt.Point(DvtThematicMapProjections.toDegrees(px), DvtThematicMapProjections.toDegrees(py));
};


/**
 * Returns the inversely projected long/lat point using the robinson projection, assuming center at 0,0
 * @param {number} x The x coordinate in the basemap coordinate system
 * @param {number} y The y coordinate in the basemap coordinate system
 * @return {dvt.Point} The projected point in longitude/latitude using the basemap projection
 * @private
 */
DvtThematicMapProjections._getInverseRobinsonProjection = function(x, y) {
  var criteria = Math.floor(Math.abs(y) / 5.0);
  if (criteria >= DvtThematicMapProjections._ROBINSON_COORDINATES.length - 1)
    criteria = DvtThematicMapProjections._ROBINSON_COORDINATES.length - 2;

  var xLength = DvtThematicMapProjections._ROBINSON_COORDINATES[criteria + 1][0] - DvtThematicMapProjections._ROBINSON_COORDINATES[criteria][0];
  var yLength = DvtThematicMapProjections._ROBINSON_COORDINATES[criteria + 1][1] - DvtThematicMapProjections._ROBINSON_COORDINATES[criteria][1];

  var yInterval = (Math.abs(y / 180.0) - DvtThematicMapProjections._ROBINSON_COORDINATES[criteria][1]) / yLength;
  var originalY = (yInterval * 5.0) + criteria * 5.0;
  var originalX = x / (DvtThematicMapProjections._ROBINSON_COORDINATES[criteria][0] + yInterval * xLength);

  if (y < 0.0)
    originalY = - 1 * originalY;

  return new dvt.Point(originalX, originalY);
};
/**
 * Thematic map control panel which includes buttons for drilling
 * @param {dvt.Context} context The rendering context
 * @param {dvt.PanZoomComponent} view The component that this control panel belongs to
 * @param {Number} state Whether the initial state is collapsed or expanded
 * @constructor
 */
var DvtThematicMapControlPanel = function(context, view, state) {
  this.Init(context, view, state);
};

dvt.Obj.createSubclass(DvtThematicMapControlPanel, dvt.ControlPanel);

/**
 * Initialize control panel
 * @param {dvt.Context} context The rendering context
 * @param {dvt.PanZoomComponent} view The component that this control panel belongs to
 * @param {Number} state Whether the initial state is collapsed or expanded
 * @protected
 */
DvtThematicMapControlPanel.prototype.Init = function(context, view, state) {
  DvtThematicMapControlPanel.superclass.Init.call(this, context, view, state);
  this._drillMode = view.getDrillMode();
  this._buttonImages = view.getResourcesMap();
  this._drillUpCallback = dvt.Obj.createCallback(view, view.drillUp);
  this._drillDownCallback = dvt.Obj.createCallback(view, view.drillDown);
  this._resetCallback = dvt.Obj.createCallback(view, view.resetMap);
  this._resetButton = null;
  this._drillUpButton = null;
  this._drillDownButton = null;
  this._drillDownButtonEnabled = false;
  this._drillUpButtonEnabled = false;
  this._styleMap = view.getSubcomponentStyles();
};

/**
 * Enables or disables the drill down button
 * @param {boolean} enable True if button should be enabled
 */
DvtThematicMapControlPanel.prototype.setEnabledDrillDownButton = function(enable) {
  this._drillDownButtonEnabled = enable;
  if (this._drillDownButton)
    this._drillDownButton.setEnabled(enable);
};

/**
 * Enables or disables the drill up button
 * @param {boolean} enable True if button should be enabled
 */
DvtThematicMapControlPanel.prototype.setEnabledDrillUpButton = function(enable) {
  this._drillUpButtonEnabled = enable;
  if (this._drillUpButton)
    this._drillUpButton.setEnabled(enable);
};

/**
 * Populate the horizontal part of the control panel
 * @param {dvt.Container} contentSprite Container for holding additional buttons
 * @protected
 */
DvtThematicMapControlPanel.prototype.PopulateHorzContentBar = function(contentSprite) {
  if (this._drillMode && this._drillMode != 'none') {
    var buttonOffset = dvt.StyleUtils.getStyle(this._styleMap, dvt.ControlPanel.CP_BUTTON_WIDTH, 0);
    this._resetButton = dvt.ButtonLAFUtils.createResetButton(this.getCtx(), this._buttonImages, this._styleMap);
    this._resetButton.setCallback(this._resetCallback, this);
    this._resetButton.setTooltip(dvt.Bundle.getTranslatedString(dvt.Bundle.SUBCOMPONENT_PREFIX, 'CONTROL_PANEL_RESET'));
    this._eventManager.associate(this._resetButton, this._resetButton);
    contentSprite.addChild(this._resetButton);

    this._drillDownButton = dvt.ButtonLAFUtils.createDrillDownButton(this.getCtx(), this._buttonImages, this._styleMap);
    this._drillDownButton.setCallback(this._drillDownCallback, this);
    this._drillDownButton.setTooltip(dvt.Bundle.getTranslatedString(dvt.Bundle.SUBCOMPONENT_PREFIX, 'CONTROL_PANEL_DRILLDOWN'));
    this._eventManager.associate(this._drillDownButton, this._drillDownButton);
    this._drillDownButton.setTranslateX(buttonOffset);
    this._drillDownButton.setEnabled(this._drillDownButtonEnabled);
    contentSprite.addChild(this._drillDownButton);

    this._drillUpButton = dvt.ButtonLAFUtils.createDrillUpButton(this.getCtx(), this._buttonImages, this._styleMap);
    this._drillUpButton.setCallback(this._drillUpCallback, this);
    this._drillUpButton.setTooltip(dvt.Bundle.getTranslatedString(dvt.Bundle.SUBCOMPONENT_PREFIX, 'CONTROL_PANEL_DRILLUP'));
    this._eventManager.associate(this._drillUpButton, this._drillUpButton);

    this._drillUpButton.setTranslateX(buttonOffset * 2);
    this._drillUpButton.setEnabled(this._drillUpButtonEnabled);
    contentSprite.addChild(this._drillUpButton);

  }
};

/**
 * @override
 */
DvtThematicMapControlPanel.prototype.getActionDisplayable = function(type, stampId) {
  var displayable = DvtThematicMapControlPanel.superclass.getActionDisplayable.call(this, type, stampId);
  if (!displayable && this.isDisclosed()) {
    if (type == 'drillDown' && this._drillDownButton && this._drillDownButton.isEnabled())
      displayable = this._drillDownButton;
    else if (type == 'drillUp' && this._drillUpButton && this._drillUpButton.isEnabled())
      displayable = this._drillUpButton;
    else if (type == 'reset' && this._resetButton && this._resetButton.isEnabled())
      displayable = this._resetButton;
  }
  return displayable;
};

// To avoid changing the basemaps, which each call the basemap manager, we will
// put the basemap manager onto the returned object. We'll only do this if it's
// not defined, since in min/min-debug mode, the non-exported version is on the window.
if(!dvt['DvtBaseMapManager'])
  dvt['DvtBaseMapManager'] = DvtBaseMapManager;

  return dvt;
});
