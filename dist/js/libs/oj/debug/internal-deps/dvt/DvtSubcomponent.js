/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

(function(dvt) {
/**
 * Base attribute groups handler.
 * @class
 * @constructor
 */
dvt.AttrGroups = function() {};

dvt.Obj.createSubclass(dvt.AttrGroups, dvt.Obj);


/**
 * Returns the mapping for the specified group or value.
 * @param {object} value The group or value whose mapping will be retrieved.
 * @return {object} The corresponding value along the ramp.
 */
dvt.AttrGroups.prototype.get = function(value) {
  // subclasses must override
};
/**
 * Discrete attribute groups handler.
 * @class
 * @constructor
 * @extends {dvt.AttrGroups}
 */
dvt.DiscreteAttrGroups = function() {
  this._results = new Array();
};

dvt.Obj.createSubclass(dvt.DiscreteAttrGroups, dvt.AttrGroups);


/**
 * Adds a mapping to this object.
 * @param {string} group The id for the group.
 * @param {string} groupLabel The label for the group.
 * @param {object} params
 */
dvt.DiscreteAttrGroups.prototype.add = function(group, groupLabel, params) {
  this._results.push({group: group, groupLabel: groupLabel, params: params});
};


/**
 * Returns the mapping for the specified group.
 * @param {object} group The group whose mapping will be retrieved.
 * @return {object} The parameters object
 */
dvt.DiscreteAttrGroups.prototype.get = function(group) {
  if (group === null)
    return null;

  // Loop through the results to find the mapping
  for (var i = 0; i < this._results.length; i++) {
    if (this._results[i].group == group)
      return this._results[i].params;
  }

  // Otherwise not found
  return null;
};


/**
 * Returns the array of mapping objects.  Each object contains the mapped value, the
 * group id, and the group label.
 * @return {array} An array of objects with value, group, and groupLabel fields.
 */
dvt.DiscreteAttrGroups.prototype.getMappingsArray = function() {
  return this._results.slice(0);
};
/**
 * Continuous attribute groups handler.
 * @param {number} minValue The minimum bounds for use in mapping values.
 * @param {number} maxValue The maximum bounds for use in mapping values.
 * @param {string} minLabel The label for the minimum bounds.
 * @param {string} maxLabel The label for the maximum bounds.
 * @param {array} ramp The ramp for use in mapping values.
 * @class
 * @constructor
 * @extends {dvt.AttrGroups}
 */
dvt.ContinuousAttrGroups = function(minValue, maxValue, minLabel, maxLabel, ramp) {
  this._minValue = minValue;
  this._maxValue = maxValue;
  this._minLabel = minLabel ? minLabel : this._minValue;
  this._maxLabel = maxLabel ? maxLabel : this._maxValue;
  this._ramp = ramp;

  // Cache the range for performance
  this._range = this._maxValue - this._minValue;
};

dvt.Obj.createSubclass(dvt.ContinuousAttrGroups, dvt.AttrGroups);


/**
 * Returns the mapping for the specified value.
 * @param {object} value The value whose mapping will be retrieved.
 * @return {object} The corresponding value along the ramp.
 */
dvt.ContinuousAttrGroups.prototype.get = function(value) {
  if (isNaN(value) || value === null)
    return null;

  // Calculate the ratio along the ramp.  Use 0.5 if the range is invalid.
  var ratio = this._range > 0 ? (value - this._minValue) / this._range : 0.5;
  ratio = Math.max(Math.min(ratio, 1), 0);

  // Find the surrounding object mappings
  var index = ratio * (this._ramp.length - 1);
  if (index === Math.round(index))
    return this._ramp[index];
  else {
    // Index falls between two values
    var a = this._ramp[Math.floor(index)];
    var b = this._ramp[Math.ceil(index)];
    return this._calcValue(a, b, index - Math.floor(index));
  }
};


/**
 * Returns the ramp used for mapping values.
 * @return {array}
 */
dvt.ContinuousAttrGroups.prototype.getRamp = function() {
  return this._ramp.slice(0);
};


/**
 * Returns the label for the minimum bounds.
 * @return {string}
 */
dvt.ContinuousAttrGroups.prototype.getMinLabel = function() {
  return this._minLabel;
};


/**
 * Returns the label for the maximum bounds.
 * @return {string}
 */
dvt.ContinuousAttrGroups.prototype.getMaxLabel = function() {
  return this._maxLabel;
};


/**
 * Returns the value between the specified parameters at the specified percent.
 * @param {object} a
 * @param {object} b
 * @param {number} percent The percent between a and b.
 * @return {object} The value at the specified percent between a and b.
 */
dvt.ContinuousAttrGroups.prototype._calcValue = function(a, b, percent) {
  // Note: Only color is supported by continuous attribute groups in this release.
  return dvt.ColorUtils.interpolateColor(a, b, percent);
};
/**
 * Legend rendering utilities for attribute groups components.
 * @class
 */
dvt.LegendAttrGroupsRenderer = function() {};

dvt.Obj.createSubclass(dvt.LegendAttrGroupsRenderer, dvt.Obj);

/** @private @const */
dvt.LegendAttrGroupsRenderer._LEGEND_MAX_HEIGHT = 0.4;
/** @private @const */
dvt.LegendAttrGroupsRenderer._CONTINUOUS_GROUP_GAP = 1;
/** @private @const */
dvt.LegendAttrGroupsRenderer._CONTINUOUS_ITEM_WIDTH = 50;
/** @private @const */
dvt.LegendAttrGroupsRenderer._CONTINUOUS_ITEM_HEIGHT = 10;
/** @private @const */
dvt.LegendAttrGroupsRenderer._CONTINUOUS_ITEM_GAP = 5;
/** @private @const */
dvt.LegendAttrGroupsRenderer._LABEL_SIZE = 11;
/** @private @const */
dvt.LegendAttrGroupsRenderer._LABEL_COLOR = '#636363';
/** @private @const */
dvt.LegendAttrGroupsRenderer._LABEL_VALUE_COLOR = '#333333';


/**
 * Performs layout and rendering for an attribute groups object.
 * @param {dvt.Context} context
 * @param {dvt.EventManager} eventManager
 * @param {dvt.Container} container The legend container.
 * @param {number} availWidth The available horizontal space.
 * @param {number} availHeight The available vertical space.
 * @param {dvt.AttrGroups} attrGroups An attribute groups describing the colors.
 * @return {dvt.Displayable} The rendered contents.
 */
dvt.LegendAttrGroupsRenderer.renderAttrGroups = function(context, eventManager, container, availWidth, availHeight, attrGroups, styles) {
  var colorContainer = null;
  if (attrGroups) {
	  if (attrGroups instanceof dvt.ContinuousAttrGroups)
	    colorContainer = dvt.LegendAttrGroupsRenderer._renderAttrGroupsContinuous(context, eventManager, container, availWidth, availHeight, attrGroups, styles);
	  else if (attrGroups instanceof dvt.DiscreteAttrGroups)
	    colorContainer = dvt.LegendAttrGroupsRenderer._renderAttrGroupsDiscrete(context, eventManager, container, availWidth, availHeight, attrGroups, styles);
  }
  return colorContainer;
};


/**
 * Performs layout and rendering for continuous attribute groups.
 * @param {dvt.Context} context
 * @param {dvt.EventManager} eventManager
 * @param {dvt.Container} container The legend container.
 * @param {number} availWidth The available horizontal space.
 * @param {number} availHeight The available vertical space.
 * @param {dvt.AttrGroups} attrGroups An attribute groups describing the colors.
 * @return {dvt.Displayable} The rendered contents.
 */
dvt.LegendAttrGroupsRenderer._renderAttrGroupsContinuous = function(context, eventManager, container, availWidth, availHeight, attrGroups, styles) {
  // Create a container for this item
  var isRTL = dvt.Agent.isRightToLeft(context);
  var labelY = dvt.LegendAttrGroupsRenderer._CONTINUOUS_ITEM_HEIGHT / 2 + dvt.LegendAttrGroupsRenderer._CONTINUOUS_GROUP_GAP;
  var colorContainer = new dvt.Container(context);
  container.addChild(colorContainer);

  // Min Label
  var minLabelStr = attrGroups.getMinLabel();
  var minLabel = new dvt.OutputText(context, minLabelStr, 0, labelY);
  minLabel.setCSSStyle(styles.labelStyle);
  minLabel.alignMiddle();
  colorContainer.addChild(minLabel);

  // Gradient
  var gradientRect = new dvt.Rect(context, 0, dvt.LegendAttrGroupsRenderer._CONTINUOUS_GROUP_GAP, dvt.LegendAttrGroupsRenderer._CONTINUOUS_ITEM_WIDTH, dvt.LegendAttrGroupsRenderer._CONTINUOUS_ITEM_HEIGHT);
  var ramp = isRTL ? attrGroups.getRamp().slice().reverse() : attrGroups.getRamp();
  gradientRect.setFill(new dvt.LinearGradientFill(0, ramp));
  if (styles.borderColor)
    gradientRect.setSolidStroke(styles.borderColor);

  colorContainer.addChild(gradientRect);
  var gradientWidth = dvt.LegendAttrGroupsRenderer._CONTINUOUS_ITEM_WIDTH + dvt.LegendAttrGroupsRenderer._CONTINUOUS_ITEM_GAP;

  // Max Label
  var maxLabelStr = attrGroups.getMaxLabel();
  var maxLabel = new dvt.OutputText(context, maxLabelStr, 0, labelY);
  maxLabel.setCSSStyle(styles.labelStyle);
  maxLabel.alignMiddle();
  colorContainer.addChild(maxLabel);

  // Position the labels and the rectangle
  if (isRTL) {
    // BIDI
    var maxLabelWidth = maxLabel.measureDimensions().w + dvt.LegendAttrGroupsRenderer._CONTINUOUS_ITEM_GAP;
    gradientRect.setTranslateX(maxLabelWidth);
    minLabel.setX(maxLabelWidth + gradientWidth);
  }
  else {
    // Non-BIDI
    var minLabelWidth = minLabel.measureDimensions().w + dvt.LegendAttrGroupsRenderer._CONTINUOUS_ITEM_GAP;
    gradientRect.setTranslateX(minLabelWidth);
    maxLabel.setX(minLabelWidth + gradientWidth);
  }

  // Add a tooltip to the gradient rectangle
  var tooltip = minLabelStr + ' - ' + maxLabelStr;
  eventManager.associate(gradientRect, new dvt.SimpleObjPeer(tooltip));

  // If there isn't enough space for all the content, drop the labels
  if (colorContainer.getDimensions().w > availWidth) {
    colorContainer.removeChild(minLabel);
    colorContainer.removeChild(maxLabel);
    gradientRect.setTranslateX(0);
  }

  // Return the contents
  return colorContainer;
};


/**
 * Performs layout and rendering for discrete attribute groups.
 * @param {dvt.Context} context
 * @param {dvt.EventManager} eventManager
 * @param {dvt.Container} container The legend container.
 * @param {number} availWidth The available horizontal space.
 * @param {number} availHeight The available vertical space.
 * @param {dvt.AttrGroups} attrGroups An attribute groups describing the colors.
 * @return {dvt.Displayable} The rendered contents.
 */
dvt.LegendAttrGroupsRenderer._renderAttrGroupsDiscrete = function(context, eventManager, container, availWidth, availHeight, attrGroups, styles) {
  var ret = new dvt.Container(context);
  container.addChild(ret);

  // Iterate through the attribute group mappings to build up the legend items array.
  var items = [];
  var mappings = attrGroups.getMappingsArray();
  for (var i = 0; i < mappings.length; i++) {
    var mapping = mappings[i];
    items.push({'text': mapping.groupLabel, 'color': mapping.params.color, 'pattern': mapping.params.pattern, 'borderColor': styles.borderColor});
  }

  // Create the legend data object and legend
  var legendOptions = {'sections': [{'items': items}],
        'orientation': 'horizontal',
        'layout': {'outerGapWidth': 0, 'outerGapHeight': 0},
        'textStyle': styles.labelStyle.toString()};
  var component = dvt.Legend.newInstance(context);
  component.setId(null);
  ret.addChild(component);

  // Layout the legend and get the preferred size
  var maxLegendHeight = availHeight * dvt.LegendAttrGroupsRenderer._LEGEND_MAX_HEIGHT;
  var preferredDims = component.getPreferredSize(legendOptions, availWidth, maxLegendHeight);
  component.render(legendOptions, availWidth, preferredDims.h);

  // Add a transparent background for the legend so that calling getDimensions on it
  // will return the full size with the gaps.
  var actualDims = component.getContentDimensions();
  var rect = new dvt.Rect(context, 0, 0, actualDims.w, preferredDims.h);
  rect.setInvisibleFill();
  ret.addChildAt(rect, 0);

  // Return the contents
  return ret;
};
/**
 * A component level breadcrumb drill event.
 * @param {string} id The id of the data item that was drilled.
 * @class
 * @constructor
 */
dvt.BreadcrumbsDrillEvent = function(id) {
  this.Init(dvt.BreadcrumbsDrillEvent.TYPE);
  this._id = id;
};

dvt.Obj.createSubclass(dvt.BreadcrumbsDrillEvent, dvt.BaseComponentEvent);

dvt.BreadcrumbsDrillEvent.TYPE = 'breadcrumbsDrill';


/**
 * Returns the id of the item that was drilled.
 * @return {string} The id of the item that was drilled.
 */
dvt.BreadcrumbsDrillEvent.prototype.getId = function() {
  return this._id;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.



/**
 * Breadcrumbs component.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @param {object} options The object containing options specifications for this component.
 * @class
 * @constructor
 * @extends {dvt.Container}
 * @implements {DvtComponentKeyboardHandler}
 */
dvt.Breadcrumbs = function(context, callback, callbackObj, options) {
  this.Init(context, callback, callbackObj, options);
};

dvt.Obj.createSubclass(dvt.Breadcrumbs, dvt.Container);


/**
 * Initializes the component.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @param {object} options The object containing options specifications for this component.
 * @protected
 */
dvt.Breadcrumbs.prototype.Init = function(context, callback, callbackObj, options) {
  dvt.Breadcrumbs.superclass.Init.call(this, context);
  this.setOptions(options);

  // Create the event handler and add event listeners
  this._eventHandler = new DvtBreadcrumbsEventManager(this, context, callback, callbackObj);
  this._eventHandler.addListeners(this);

  // Make sure the object has an id for clipRect naming
  this.setId('breadcrumbs' + 1000 + Math.floor(Math.random() * 1000000000));//@RandomNumberOk

  // index of the breadcrumb with keyboard focus. index is used to find the
  // Object stored in the _data object's item field
  this._curCrumbIdx = -1;

  // the dvt.Rect we use to show which breadcrumb has keyboard focus
  this._keyboardFocusRect = null;
  this._crumbs = null;
};


/**
 * Specifies the non-data options for this component.
 * @param {object} options The object containing options specifications for this component.
 * @protected
 */
dvt.Breadcrumbs.prototype.setOptions = function(options) {
  this._options = DvtBreadcrumbsDefaults.calcOptions(options);
};


/**
 * Renders the component with the specified data.  If no data is supplied to a component
 * that has already been rendered, the component will be re-rendered to the specified size.
 * @param {object} data The object containing data for this component.
 * @param {number} width The width of the component.
 */
dvt.Breadcrumbs.prototype.render = function(data, width) 
{
  // Update if new data has been provided. Clone to avoid modifying the provided object.
  this._data = data ? dvt.JsonUtils.clone(data) : this._data;

  // Clear previous contents
  this.removeChildren();
  this.SetCrumbs(null);

  // Render the contents
  DvtBreadcrumbsRenderer.render(this, this, width);
};


/**
 * Returns the data object for the component.
 * @return {object} The object containing data for this component.
 */
dvt.Breadcrumbs.prototype.__getData = function() {
  return this._data ? this._data : {};
};


/**
 * Returns the evaluated options object, which contains the user specifications
 * merged with the defaults.
 * @return {object} The options object.
 */
dvt.Breadcrumbs.prototype.__getOptions = function() {
  return this._options;
};


/**
 * Returns the dvt.EventManager for this component.
 * @return {dvt.EventManager}
 */
dvt.Breadcrumbs.prototype.getEventManager = function() {
  return this._eventHandler;
};

/**
 * @override
 */
dvt.Breadcrumbs.prototype.hideKeyboardFocusEffect = function()  
{
  var prevCrumbIdx = this._curCrumbIdx;
  this._curCrumbIdx = -1;
  this._updateKeyboardFocusEffect(prevCrumbIdx, this._curCrumbIdx);
};

/**
 * Returns the current crumb index
 * @return {Number}
 */
dvt.Breadcrumbs.prototype.getCurrentCrumbIndex = function()  
{
  return this._curCrumbIdx;
};

/**
 * Returns the number of crumbs
 * @return {Number}
 */
dvt.Breadcrumbs.prototype.getNumCrumbs = function()  
{
  return this._data.items.length;
};

/**
 * Updates the crumb in focus
 * @param {boolean} bShiftKey True if the shift key was pressed
 * @return {Number} The currently focused crumb index or -1 if none
 */
dvt.Breadcrumbs.prototype.updateCrumbFocus = function(bShiftKey)  
{
  var prevCrumbIdx = this._curCrumbIdx;
  this._curCrumbIdx = this._getUpdatedCrumbIndex(prevCrumbIdx, !bShiftKey);
  this._updateKeyboardFocusEffect(prevCrumbIdx, this._curCrumbIdx);
  return this._curCrumbIdx;
};

/**
 * Returns the updated crumb index which has focus or -1 if tabbed out of the breadcrumbs. Used only for keyboarding.
 * @param {Number} prevIndex The previously focused crumb index
 * @param {boolean} bForward True if we are tabbing forward, false if we are shift-tabbing backwards
 * @return {Number} The currently focused crumb index in the _data object's item array or -1 if none
 * @private
 */
dvt.Breadcrumbs.prototype._getUpdatedCrumbIndex = function(prevIndex, bForward) 
{
  // Handle initial keyboarding into breadcrumbs
  if (prevIndex == -1) {
    if (bForward)
      return 0;
    else
      return this._data.items.length - 2;
  }

  // Handle subsequent tab and shift-tab traversal of breadcrumbs
  if (bForward) {
    if (prevIndex == this._data.items.length - 2)
      return -1; // The last breadcrumb is not actionable so we are actually tabbing out of the breadcrumbs
    else
      return ++prevIndex;
  } else {
    if (prevIndex == 0)
      return -1;
    else
      return --prevIndex;
  }
};


/**
 * Updates the visual keyboard focus effect
 * @param {Number} prevIdx The index in the _data object's item array
 *        indicating the prev breadcrumb
 * @param {Number} nextIdx The index in the _data object's item array
 *        indicating the next breadcrumb
 * @private
 */
dvt.Breadcrumbs.prototype._updateKeyboardFocusEffect = function(prevIdx, nextIdx)
{
  // find the DvtText objects corresponding to the prev and next breadcrumbs
  var prevKeyboardFocusRect = this._keyboardFocusRect;
  var nextKeyboardFocusRect = null;

  // find the next breadcrumb to apply focus effect to
  var nextCrumbObj = this.getCrumb(nextIdx);
  if (nextCrumbObj)
  {
    var peer = this._eventHandler.GetLogicalObject(nextCrumbObj);
    if (peer && peer.isDrillable && peer.isDrillable())
    {
      // create a new focus effect rectangle for the next breadcrumb
      var context = this.getCtx();
      var bounds = nextCrumbObj.getDimensions();
      var matrix = nextCrumbObj.getMatrix();
      nextKeyboardFocusRect = new dvt.KeyboardFocusEffect(context, this, bounds, matrix);
      this._keyboardFocusRect = nextKeyboardFocusRect;
    }
    else
    {
      // we hit the last breadcrumb, which is not drillable. so this tab
      // takes us out of the breadcrumbs
      // clear the reference to the focus rectangle; the focus rectangle
      // is actually removed from the container at the end of this method
      this._keyboardFocusRect = null;
    }
  }

  if (prevKeyboardFocusRect)
    prevKeyboardFocusRect.hide();

  if (nextKeyboardFocusRect)
    nextKeyboardFocusRect.show();
};


/**
 * Returns the physical object corresponding to the breadcrumb with
 * keyboard focus
 * @param {Number} crumbIdx The index of the breadcrumb of interest
 * @return {dvt.Button}
 */
dvt.Breadcrumbs.prototype.getCrumb = function(crumbIdx)
{
  var crumbs = this.GetCrumbs();
  if (crumbIdx < 0 || !crumbs || crumbIdx >= crumbs.length)
    return null;
  return crumbs[crumbIdx];
};

/**
 * Returns the index of the breadcrumb of interest
 * @param {dvt.Button} crumb The breadcrumb of interest
 * @return {Number}
 */
dvt.Breadcrumbs.prototype.getCrumbIndex = function(crumb)
{
  var crumbs = this.GetCrumbs();
  for (var i = 0; i < crumbs.length; i++) {
    if (crumbs[i] == crumb)
      return i;
  }
};

/**
 * Sets an array of breadcrumbs
 * @param {array} crumbs
 * @protected
 */
dvt.Breadcrumbs.prototype.SetCrumbs = function(crumbs) {
  this._crumbs = crumbs;
};


/**
 * Gets an array of breadcrumbs
 * @return {array}
 * @protected
 */
dvt.Breadcrumbs.prototype.GetCrumbs = function() {
  return this._crumbs;
};
/**
 * Default values and utility functions for breadcrumb versioning.
 * @class
 */
var DvtBreadcrumbsDefaults = new Object();

dvt.Obj.createSubclass(DvtBreadcrumbsDefaults, dvt.Obj);


/**
 * Defaults for version 1.
 */
DvtBreadcrumbsDefaults.VERSION_1 = {
  'labelStyle': dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_11 + 'color: #003286;',
  'disabledLabelStyle': dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_11,

  //*********** Internal Attributes *************************************************//
  __labelGap: 2,
  __labelSeparator: '>'
};


/**
 * Combines the user options with the defaults for the specified version.  Returns the
 * combined options object.  This object will contain internal attribute values and
 * should be accessed in internal code only.
 * @param {object} userOptions The object containing options specifications for this component.
 * @return {object} The combined options object.
 */
DvtBreadcrumbsDefaults.calcOptions = function(userOptions) {
  var defaults = DvtBreadcrumbsDefaults._getDefaults(userOptions);

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
DvtBreadcrumbsDefaults._getDefaults = function(userOptions) {
  // Note: Version checking will eventually get added here
  // Note: Future defaults objects are deltas on top of previous objects
  return dvt.JsonUtils.clone(DvtBreadcrumbsDefaults.VERSION_1);
};


/**
 * Scales down gap sizes based on the size of the component.
 * @param {object} options The object containing options specifications for this component.
 * @param {Number} defaultSize The default gap size.
 * @return {Number}
 */
DvtBreadcrumbsDefaults.getGapSize = function(options, defaultSize) {
  return Math.ceil(defaultSize * options['layout']['gapRatio']);
};
/**
 * Event Manager for dvt.Breadcrumbs.
 */
var DvtBreadcrumbsEventManager = function(breadcrumbs, context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
  this._breadcrumbs = breadcrumbs;
};

dvt.Obj.createSubclass(DvtBreadcrumbsEventManager, dvt.EventManager);


/**
 * @override
 */
DvtBreadcrumbsEventManager.prototype.OnClick = function(event) {
  DvtBreadcrumbsEventManager.superclass.OnClick.call(this, event);
  this._processBreadcrumbs(this.GetLogicalObject(event.target));
};


/**
 * @override
 */
DvtBreadcrumbsEventManager.prototype.HandleTouchClickInternal = function(event) {
  this._processBreadcrumbs(this.GetLogicalObject(event.target));
};


/**
 * Processes a possible drill event on a breadcrumb.
 * @param {obj} The logical object which was clicked or tapped.
 * @private
 */
DvtBreadcrumbsEventManager.prototype._processBreadcrumbs = function(obj) {
  if (obj && obj instanceof DvtBreadcrumbsPeer && obj.isDrillable()) {
    // Create the event and fire to callbacks
    var event = new dvt.BreadcrumbsDrillEvent(obj.getId());
    this.FireEvent(event, this._breadcrumbs);
  }
};

/**
 * @override
 */
DvtBreadcrumbsEventManager.prototype.handleKeyboardEvent = function(event) {
  var eventConsumed = true;
  var keyCode = event.keyCode;

  if (keyCode == dvt.KeyboardEvent.TAB) {
    var curCrumbIdx = this._breadcrumbs.updateCrumbFocus(event.shiftKey);

    // If tabbing out of interactive breadcrumbs, propagate event. Last crumb is not interactive.
    if (curCrumbIdx == -1) {
      eventConsumed = false;
    } else {
      // Accessibility Support
      this.UpdateActiveElement(this._breadcrumbs.getCrumb(curCrumbIdx));
    }
  }
  else if (keyCode == dvt.KeyboardEvent.ENTER) {
    var crumb = this._breadcrumbs.getCrumb(this._breadcrumbs.getCurrentCrumbIndex());
    this._processBreadcrumbs(this.GetLogicalObject(crumb));
  }

  // keystrokes are consumed by default, unless we tab out of the breadcrumbs
  if (eventConsumed)
    dvt.EventManager.consumeEvent(event);

  return eventConsumed;
};
/**
 * Simple logical object for drilling and tooltip support.
 * @param {string} id The id of the associated breadcrumb.
 * @param {dvt.Displayable} displayable The displayable associated with this logical object
 * @class
 * @constructor
 * @implements {DvtTooltipSource}
 */
var DvtBreadcrumbsPeer = function(id, displayable) {
  this.Init();
  this._id = id;
  this._bDrillable = false;
  this._displayable = displayable;
};

dvt.Obj.createSubclass(DvtBreadcrumbsPeer, dvt.SimpleObjPeer);


/**
 * Returns the id of the associated breadcrumb.
 * @return {string}
 */
DvtBreadcrumbsPeer.prototype.getId = function() {
  return this._id;
};


/**
 * Returns true if the associated breadcrumb is drillable.
 * @return {boolean}
 */
DvtBreadcrumbsPeer.prototype.isDrillable = function() {
  return this._bDrillable;
};


/**
 * Specifies whether the associated breadcrumb is drillable.
 * @param {boolean} drillable
 */
DvtBreadcrumbsPeer.prototype.setDrillable = function(drillable) {
  this._bDrillable = drillable;
};

/**
 * @override
 */
DvtBreadcrumbsPeer.prototype.getDisplayable = function() {
  return this._displayable;
};
/**
 * Renderer for dvt.Breadcrumbs.
 * @class
 */
var DvtBreadcrumbsRenderer = new Object();

dvt.Obj.createSubclass(DvtBreadcrumbsRenderer, dvt.Obj);


/**
 * @private
 */
DvtBreadcrumbsRenderer._TOUCH_BUFFER = 3;


/**
 * Renders the breadcrumbs in the specified area.
 * @param {dvt.Breadcrumbs} breadcrumbs The breadcrumbs being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {number} width The width of the component.
 */
DvtBreadcrumbsRenderer.render = function(breadcrumbs, container, width) {
  var context = breadcrumbs.getCtx();
  var dataItems = breadcrumbs.__getData().items ? breadcrumbs.__getData().items : [];
  var options = breadcrumbs.__getOptions();
  var eventManager = breadcrumbs.getEventManager();

  // Create all of the labels
  var labels = [];
  var peers = [];
  for (var i = 0; i < dataItems.length; i++) {
    var dataItem = dataItems[i];
    if (dataItem) {
      // If the item does not have text, use "" as a placeholder to indicate text was missing
      var textStr = dataItem['label'] ? dataItem['label'] : '';

      // Create the text element
      var label = DvtBreadcrumbsRenderer._createLabel(context, textStr, options, i < dataItems.length - 1);
      labels.push(label);

      // Create peer for interactivity support
      var peer = new DvtBreadcrumbsPeer(dataItem['id'], label);
      eventManager.associate(label, peer);
      peers.push(peer);

      // All except the last label are drillable
      if (i < dataItems.length - 1) {
        peer.setDrillable(true);
      }
    }
  }
  breadcrumbs.SetCrumbs(labels);

  // Position the labels
  if (dvt.Agent.isRightToLeft(context))
    DvtBreadcrumbsRenderer._positionLabelsBidi(breadcrumbs, container, width, labels, peers);
  else
    DvtBreadcrumbsRenderer._positionLabels(breadcrumbs, container, width, labels, peers);
};

/**
 * Create a state for a label button.
 * @param {dvt.Context} context The dvt.Context to use.
 * @param {string} text The text for the label.
 * @param {dvt.CSSStyle} cssStyle Style object for the label.
 * @return {dvt.Rect}
 * @private
 */
DvtBreadcrumbsRenderer._createButtonState = function(context, text, cssStyle) {
  var dvtText = new dvt.OutputText(context, text, 0, 0);
  dvtText.setMouseEnabled(false);
  dvtText.setCSSStyle(cssStyle);

  var padTop = cssStyle.getPadding(dvt.CSSStyle.PADDING_TOP);
  var padRight = cssStyle.getPadding(dvt.CSSStyle.PADDING_RIGHT);
  var padBottom = cssStyle.getPadding(dvt.CSSStyle.PADDING_BOTTOM);
  var padLeft = cssStyle.getPadding(dvt.CSSStyle.PADDING_LEFT);

  var labelDims = dvt.DisplayableUtils.getDimensionsForced(context, dvtText);
  var state = new dvt.Rect(context, 0, 0, labelDims.w + padLeft + padRight, labelDims.h + padTop + padBottom);
  state.setInvisibleFill();
  state.setCSSStyle(cssStyle);
  dvtText.setTranslate(padLeft, padTop);
  state.addChild(dvtText);

  return state;
};


/**
 * Create the label object, which could be a dvt.Button, dvt.Rect, or DvtText.
 * @param {dvt.Context} context The dvt.Context to use.
 * @param {string} textStr The text string for the label.
 * @param {object} options Options for the breadcrumbs.
 * @param {boolean} bEnabled Flag indicating if this label is enabled or not.
 * @return {object}
 * @private
 */
DvtBreadcrumbsRenderer._createLabel = function(context, textStr, options, bEnabled) {
  var label;
  if (bEnabled && (options.labelStyleOver || options.labelStyleDown)) {
    var enaCss = new dvt.CSSStyle(options.labelStyle);
    var ovrCss = new dvt.CSSStyle(options.labelStyleOver);
    var dwnCss = new dvt.CSSStyle(options.labelStyleDown);

    var ena = DvtBreadcrumbsRenderer._createButtonState(context, textStr, enaCss);
    var ovr = DvtBreadcrumbsRenderer._createButtonState(context, textStr, ovrCss);
    var dwn = DvtBreadcrumbsRenderer._createButtonState(context, textStr, dwnCss);

    label = new dvt.Button(context, ena, ovr, dwn);
    label.setAriaRole('link');
    label.setAriaProperty('label', textStr);
  }
  else {
    var labelStyle = bEnabled ? options.labelStyle : options.disabledLabelStyle;
    var cssStyle = new dvt.CSSStyle(labelStyle);
    if (cssStyle.getPadding(dvt.CSSStyle.PADDING_LEFT) || cssStyle.getPadding(dvt.CSSStyle.PADDING_RIGHT) || cssStyle.getPadding(dvt.CSSStyle.PADDING_TOP) || cssStyle.getPadding(dvt.CSSStyle.PADDING_BOTTOM)) {
      label = DvtBreadcrumbsRenderer._createButtonState(context, textStr, cssStyle);
    }
    else {
      label = new dvt.OutputText(context, textStr, 0, 0);
      label.setCSSStyle(cssStyle);
    }
  }
  return label;
};


/**
 * Get the label text string.
 * @param {object} label The label object, which could be a dvt.Button, dvt.Rect, or DvtText.
 * @return {string}
 * @private
 */
DvtBreadcrumbsRenderer._getLabelTextString = function(label) {
  if (label instanceof dvt.Button) {
    var ena = label.upState;
    var text = ena.getChildAt(0);
    return text.getTextString();
  }
  else if (label instanceof dvt.Rect) {
    var text = label.getChildAt(0);
    return text.getTextString();
  }

  return label.getTextString();
};


/**
 * Truncates the breadcrumb labels.
 * @param {object} label The label object, which could be a dvt.Button, dvt.Rect, or DvtText.
 * @param {number} maxWidth The maximum label width.
 * @private
 */
DvtBreadcrumbsRenderer._truncateLabels = function(label, maxWidth) {
  if (label instanceof dvt.Button) {
    var ena = label.upState;
    var text = ena.getChildAt(0);
    dvt.TextUtils.fitText(text, Math.max(maxWidth - text.getTranslateX(), 0), Infinity, text.getParent());
    var ovr = label.overState;
    text = ovr.getChildAt(0);
    dvt.TextUtils.fitText(text, Math.max(maxWidth - text.getTranslateX(), 0), Infinity, text.getParent());
    var dwn = label.downState;
    text = dwn.getChildAt(0);
    dvt.TextUtils.fitText(text, Math.max(maxWidth - text.getTranslateX(), 0), Infinity, text.getParent());
    return;
  }
  else if (label instanceof dvt.Rect) {
    var text = label.getChildAt(0);
    dvt.TextUtils.fitText(text, Math.max(maxWidth - text.getTranslateX(), 0), Infinity, text.getParent());
    return;
  }

  dvt.TextUtils.fitText(label, maxWidth, Infinity, label.getParent());
};


/**
 * Positions the labels into the given container.
 * @param {dvt.Breadcrumbs} breadcrumbs The breadcrumbs being rendered.
 * @param {dvt.Container} container The container in which the labels will be added.
 * @param {number} availWidth The available width for positioning.
 * @param {array} labels The array of DvtText labels.
 * @param {array} peers The array of peers corresponding to the labels.  The last label will never have a peer.
 * @private
 */
DvtBreadcrumbsRenderer._positionLabels = function(breadcrumbs, container, availWidth, labels, peers) {
  var options = breadcrumbs.__getOptions();
  var eventManager = breadcrumbs.getEventManager();

  var arDims = [];
  var maxHeight = 0;
  for (var i = 0; i < labels.length; i++) {
    container.addChild(labels[i]);
    var dims = labels[i].getDimensions();
    arDims[i] = dims;
    maxHeight = Math.max(dims.h, maxHeight);
    container.removeChild(labels[i]);
  }

  var x = 0;
  for (var i = 0; i < labels.length; i++) {
    // Add and position the label, then calculate the space for the next one
    container.addChild(labels[i]);
    var dims = arDims[i];
    labels[i].setTranslate(x, .5 * (maxHeight - dims.h));

    // Add a buffer to make the objects easier to interact with on touch devices
    if (dvt.Agent.isTouchDevice()) {
      var rect = new dvt.Rect(container.getCtx(), -DvtBreadcrumbsRenderer._TOUCH_BUFFER, -DvtBreadcrumbsRenderer._TOUCH_BUFFER,
          dims.w + 2 * DvtBreadcrumbsRenderer._TOUCH_BUFFER, dims.h + 2 * DvtBreadcrumbsRenderer._TOUCH_BUFFER);
      rect.setInvisibleFill();
      labels[i].addChild(rect);
      if (i < peers.length)
        eventManager.associate(rect, peers[i]);
    }

    // Truncate if needed
    if (x + dims.w > availWidth) {
      var labelString = DvtBreadcrumbsRenderer._getLabelTextString(labels[i]);
      DvtBreadcrumbsRenderer._truncateLabels(labels[i], availWidth - x);

      // Add a tooltip
      if (i < peers.length)
        peers[i].setTooltip(labelString);
      else
        eventManager.associate(labels[i], new dvt.SimpleObjPeer(labelString));

      // No more space, all done
      return;
    }
    else // Update the x
      x += dims.w + options.__labelGap;

    // Add a separator if there are more labels
    if (i < labels.length - 1) {
      var separator = DvtBreadcrumbsRenderer._newSeparator(breadcrumbs);
      container.addChild(separator);
      var sepDims = separator.getDimensions();
      separator.setTranslate(x, .5 * (maxHeight - sepDims.h));

      // Check that there is enough space
      var separatorWidth = sepDims.w;
      if (x + separatorWidth > availWidth) {
        container.removeChild(separator);
        return;
      }

      x += separatorWidth + options.__labelGap;
    }
  }
};


/**
 * Positions the labels into the given container for BIDI locales
 * @param {dvt.Breadcrumbs} breadcrumbs The breadcrumbs being rendered.
 * @param {dvt.Container} container The container in which the labels will be added.
 * @param {number} availWidth The available width for positioning.
 * @param {array} labels The array of DvtText labels.
 * @param {array} peers The array of peers corresponding to the labels.  The last label will never have a peer.
 * @private
 */
DvtBreadcrumbsRenderer._positionLabelsBidi = function(breadcrumbs, container, availWidth, labels, peers) {
  var options = breadcrumbs.__getOptions();
  var eventManager = breadcrumbs.getEventManager();

  var x = availWidth;
  for (var i = 0; i < labels.length; i++) {
    // Add and position the label, then calculate the space for the next one
    container.addChild(labels[i]);
    var dims = labels[i].getDimensions();

    // Add a buffer to make the objects easier to interact with on touch devices
    if (dvt.Agent.isTouchDevice()) {
      var rect = new dvt.Rect(container.getCtx(), -DvtBreadcrumbsRenderer._TOUCH_BUFFER, -DvtBreadcrumbsRenderer._TOUCH_BUFFER,
          dims.w + 2 * DvtBreadcrumbsRenderer._TOUCH_BUFFER, dims.h + 2 * DvtBreadcrumbsRenderer._TOUCH_BUFFER);
      rect.setInvisibleFill();
      labels[i].addChild(rect);
      if (i < peers.length)
        eventManager.associate(rect, peers[i]);
    }

    // Truncate if needed
    if (x - dims.w < 0) {
      var labelString = DvtBreadcrumbsRenderer._getLabelTextString(labels[i]);
      DvtBreadcrumbsRenderer._truncateLabels(labels[i], x);
      labels[i].setTranslateX(0);

      // Add a tooltip
      if (i < peers.length)
        peers[i].setTooltip(labelString);
      else
        eventManager.associate(labels[i], new dvt.SimpleObjPeer(labelString));

      // No more space, all done
      return;
    }
    else {
      // Position and update the x
      labels[i].setTranslateX(x - dims.w);
      x -= (dims.w + options.__labelGap);
    }

    // Add a separator if there are more labels
    if (i < labels.length - 1) {
      var separator = DvtBreadcrumbsRenderer._newSeparator(breadcrumbs);
      container.addChild(separator);

      // Check that there is enough space
      var separatorWidth = separator.getDimensions().w;
      if (x - separatorWidth < 0) {
        container.removeChild(separator);
        return;
      }
      else {
        // Enough space, position
        separator.setTranslateX(x - separatorWidth);
        x -= separatorWidth + options.__labelGap;
      }
    }
  }
};


/**
 * Creates and returns a new separator for breadcrumb labels.
 * @param {dvt.Breadcrumbs} breadcrumbs The breadcrumbs being rendered.
 * @return {DvtText}
 * @private
 */
DvtBreadcrumbsRenderer._newSeparator = function(breadcrumbs) {
  var options = breadcrumbs.__getOptions();
  var label = new dvt.OutputText(breadcrumbs.getCtx(), options.__labelSeparator, 0, 0);
  label.setCSSStyle(new dvt.CSSStyle(options.labelStyle));
  return label;
};
/**
 * @constructor
 */
dvt.PanelDrawerEvent = function(subtype, activePanel) {
  this.Init(dvt.PanelDrawerEvent.TYPE);
  this._subtype = subtype;
  this._activePanel = activePanel;
};

dvt.Obj.createSubclass(dvt.PanelDrawerEvent, dvt.BaseComponentEvent);

dvt.PanelDrawerEvent.TYPE = 'dvtPanelDrawerEvent';
dvt.PanelDrawerEvent.SUBTYPE_HIDE = 'hide';
dvt.PanelDrawerEvent.SUBTYPE_SHOW = 'show';

dvt.PanelDrawerEvent.prototype.getSubType = function() {
  return this._subtype;
};


/**
 * @return {string} The id of the active panel
 */
dvt.PanelDrawerEvent.prototype.getActivePanel = function() {
  return this._activePanel;
};
// Copyright (c) 2012, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 * @constructor
 */
dvt.PanelDrawer = function(context, callback, callbackObj, sid) {
  this.Init(context, callback, callbackObj, sid);
};

dvt.Obj.createSubclass(dvt.PanelDrawer, dvt.Container);

dvt.PanelDrawer.DIR_LEFT = 'left';
dvt.PanelDrawer.DIR_RIGHT = 'right';

dvt.PanelDrawer.DOCK_TOP = 'top';
dvt.PanelDrawer.DOCK_BOTTOM = 'bottom';


//dvt.PanelDrawer styles
/**
 * Vertical space for the first tab
 * @const
 */
dvt.PanelDrawer._FIRST_TAB_SPACING = 15;


/**
 * Vertical space for between tabs
 * @const
 */
dvt.PanelDrawer._INTER_TAB_SPACING = 0;


/**
 * Tab size vertical and horizontal
 * @const
 */
dvt.PanelDrawer._TAB_SIZE = 42;


/**
 * Tab corner radius
 * @const
 */
dvt.PanelDrawer._TAB_CORNER_RADIUS = 2;


/**
 * Tab default background color
 * @const
 */
dvt.PanelDrawer._BACKGROUND_COLOR = '#ffffff';


/**
 * Tab default border color
 * @const
 */
dvt.PanelDrawer._BORDER_COLOR = '#bbc7d0';


/**
 * Tab default animation duration
 * @const
 */
dvt.PanelDrawer._ANIM_DURATION = .25;


/**
 * Content padding
 * @const
 */
dvt.PanelDrawer._CONTENT_PADDING = 10;

dvt.PanelDrawer._BACKGROUND_ALPHA = 1;
dvt.PanelDrawer._BACKGROUND_ALPHA_DE_EMPHASIZED = 1;
dvt.PanelDrawer._BACKGROUND_ALPHA_ROLLOVER = 1;

dvt.PanelDrawer._BORDER_ALPHA = 1;
dvt.PanelDrawer._BORDER_ALPHA_DE_EMPHASIZED = 1;

dvt.PanelDrawer._TAB_BACKGROUND_COLOR_INACTIVE = '#dee4e7';
dvt.PanelDrawer._TAB_BORDER_COLOR_INACTIVE = '#c1cede';

//factor to use for increasing width of content so that bounce animation
//doesn't appear to detach panelDrawer from edge of component
dvt.PanelDrawer._BOUNCE_WIDTH_FACTOR = 1.25;
dvt.PanelDrawer._DEFAULT_SKIN = 'alta';


/**
 * The dvt.PanelDrawer tab's image size
 * @const
 */
dvt.PanelDrawer.IMAGE_SIZE = 24;


/**
 * The dvt.PanelDrawer legend key
 * @const
 */
dvt.PanelDrawer.PANEL_LEGEND = 'legend';


/**
 * The dvt.PanelDrawer palette key
 * @const
 */
dvt.PanelDrawer.PANEL_PALETTE = 'palette';


/**
 * The dvt.PanelDrawer search key
 * @const
 */
dvt.PanelDrawer.PANEL_SEARCH = 'search';


/**
 * The dvt.PanelDrawer overview key
 * @const
 */
dvt.PanelDrawer.PANEL_OVERVIEW = 'overview';


/**
 * The dvt.PanelDrawer enabled search icon key
 * @const
 */
dvt.PanelDrawer.PANEL_SEARCH_ICON_ENA = 'searchEna';


/**
 * The dvt.PanelDrawer hover search icon key
 * @const
 */
dvt.PanelDrawer.PANEL_SEARCH_ICON_OVR = 'searchOvr';


/**
 * The dvt.PanelDrawer active search icon key
 * @const
 */
dvt.PanelDrawer.PANEL_SEARCH_ICON_DWN = 'searchDwn';


/**
 * The dvt.PanelDrawer serach tooltip key
 * @const
 */
dvt.PanelDrawer.PANEL_SEARCH_TIP = 'searchTip';


/**
 * The dvt.PanelDrawer enabled palette icon key
 * @const
 */
dvt.PanelDrawer.PANEL_PALETTE_ICON_ENA = 'paletteEna';


/**
 * The dvt.PanelDrawer hover palette icon key
 * @const
 */
dvt.PanelDrawer.PANEL_PALETTE_ICON_OVR = 'paletteOvr';


/**
 * The dvt.PanelDrawer active palette icon key
 * @const
 */
dvt.PanelDrawer.PANEL_PALETTE_ICON_DWN = 'paletteDwn';


/**
 * The dvt.PanelDrawer palette tooltip key
 * @const
 */
dvt.PanelDrawer.PANEL_PALETTE_TIP = 'paletteTip';


/**
 * The dvt.PanelDrawer enabled legend icon key
 * @const
 */
dvt.PanelDrawer.PANEL_LEGEND_ICON_ENA = 'legendEna';


/**
 * The dvt.PanelDrawer hover legend icon key
 * @const
 */
dvt.PanelDrawer.PANEL_LEGEND_ICON_OVR = 'legendOvr';


/**
 * The dvt.PanelDrawer active legend icon key
 * @const
 */
dvt.PanelDrawer.PANEL_LEGEND_ICON_DWN = 'legendDwn';


/**
 * The dvt.PanelDrawer legend tooltip key
 * @const
 */
dvt.PanelDrawer.PANEL_LEGEND_TIP = 'legendTip';


/**
 * The dvt.PanelDrawer enabled overview icon key
 * @const
 */
dvt.PanelDrawer.PANEL_OVERVIEW_ICON_ENA = 'overviewEna';


/**
 * The dvt.PanelDrawer hover overview icon key
 * @const
 */
dvt.PanelDrawer.PANEL_OVERVIEW_ICON_OVR = 'overviewOvr';


/**
 * The dvt.PanelDrawer active overview icon key
 * @const
 */
dvt.PanelDrawer.PANEL_OVERVIEW_ICON_DWN = 'overviewDwn';


/**
 * The dvt.PanelDrawer overview tooltip key
 * @const
 */
dvt.PanelDrawer.PANEL_OVERVIEW_TIP = 'overviewTip';


// TODO: refactor these so they're not duplicated across the subcomponent and panzoomcanvas features
/**
 * @const
 */
dvt.PanelDrawer.BG_ALPHA = 'backgroundAlpha';


/**
 * @const
 */
dvt.PanelDrawer.TAB_BG_COLOR_INACTIVE = 'tab-color-inactive';


/**
 * @const
 */
dvt.PanelDrawer.TAB_BORDER_COLOR_INACTIVE = 'tab-border-color-inactive';

//TO DO: fire state changes to callback


/**
 * A helper method called by the constructor to initialize this component
 * @param {dvt.Context} context An object maintaining application specific context, as well as well as providing
 *                             access to platform specific data and objects, such as the factory
 * @param {function} callback The function to call for communicating with the parent object
 * @param {dvt.Obj} callbackObj The object to call the callback function on
 * @param {String} sid The id for this component
 * @protected
 */
dvt.PanelDrawer.prototype.Init = function(context, callback, callbackObj, sid) {
  dvt.PanelDrawer.superclass.Init.call(this, context, null, 'panelDrawer' + sid);

  this._sid = sid;
  this._eventManager = new DvtPanelDrawerEventManager(context, callback, callbackObj);
  this._eventManager.addListeners(this);
  this._eventManager.addRolloverType(dvt.PanelDrawer);
  this._eventManager.associate(this, this);
  if (!dvt.Agent.isTouchDevice())
    this._eventManager.setKeyboardHandler(new DvtPanelDrawerKeyboardHandler(this._eventManager, this));

  this._callback = callback;
  this._callbackObj = callbackObj;

  this._panels = {};
  this._panelOrder = [];
  this._maxWidth = Number.MAX_VALUE;
  this._maxHeight = Number.MAX_VALUE;
  this._minWidth = 5;
  this._minHeight = 0;
  this._displayedPanelId;
  this._oldDisplayedPanelId;
  this._bDisclosed = false;
  this._bTransition = false;
  this._contentPane;
  this._activeContent;
  this._expandedContent;
  this._contentClipPath;
  this._expandedBorder;
  this._expandedBorderResizable;
  this._tabs = {};
  this._discloseDirection = dvt.PanelDrawer.DIR_LEFT;
  this._dockSide = dvt.PanelDrawer.DOCK_TOP;
  this._isFixed = false;

  this._styleMap = null;
  if (callbackObj)
    this._styleMap = callbackObj.getSubcomponentStyles();

  this._bgAlpha = dvt.StyleUtils.getStyle(this._styleMap, dvt.PanelDrawer.BG_ALPHA, dvt.PanelDrawer._BACKGROUND_ALPHA);
  this._borderColor = dvt.StyleUtils.getStyle(this._styleMap, dvt.CSSStyle.BORDER_COLOR, dvt.PanelDrawer._BORDER_COLOR);
  this._borderRadius = parseInt(dvt.StyleUtils.getStyle(this._styleMap, dvt.CSSStyle.BORDER_RADIUS, dvt.PanelDrawer._TAB_CORNER_RADIUS));
  this._bgColor = dvt.StyleUtils.getStyle(this._styleMap, dvt.CSSStyle.BACKGROUND_COLOR, dvt.PanelDrawer._BACKGROUND_COLOR);

  this._bgInactiveColor = dvt.StyleUtils.getStyle(this._styleMap, dvt.PanelDrawer.TAB_BG_COLOR_INACTIVE, dvt.PanelDrawer._TAB_BACKGROUND_COLOR_INACTIVE);
  this._borderInactiveColor = dvt.StyleUtils.getStyle(this._styleMap, dvt.PanelDrawer.TAB_BORDER_COLOR_INACTIVE, dvt.PanelDrawer._TAB_BORDER_COLOR_INACTIVE);

  this.setPixelHinting(true);

  //Panel drawer content padding
  this._contentPadding = dvt.PanelDrawer._CONTENT_PADDING;
};

dvt.PanelDrawer.prototype.addPanel = function(panel, upState, overState, downState, tooltip, id) {
  this._panels[id] = {'panel': panel, 'iconUp': upState, 'iconOver': overState, 'iconDown': downState, 'tooltip': tooltip};
  this._panelOrder.push(id);

  this._minHeight = dvt.PanelDrawer._FIRST_TAB_SPACING + this._panelOrder.length * (dvt.PanelDrawer._TAB_SIZE + dvt.PanelDrawer._INTER_TAB_SPACING);
};


/**
 * Returns whether this panel drawer is fixed or collapsible
 * @return {boolean}
 */
dvt.PanelDrawer.prototype.isFixed = function() {
  return this._isFixed;
};


/**
 * Sets whether this panel drawer is fixed or collapsible
 * @param {boolean} bFixed Whether the dvt.PanelDrawer is fixed
 */
dvt.PanelDrawer.prototype.setFixed = function(bFixed) {
  this._isFixed = bFixed;
};

dvt.PanelDrawer.prototype.setMaxWidth = function(width) {
  this._maxWidth = width;
};

dvt.PanelDrawer.prototype.getMaxWidth = function() {
  return this._maxWidth;
};


/**
 * Set Content padding of the panel drawer
 * @public
 * @param {number} padding  content padding
 */
dvt.PanelDrawer.prototype.setContentPadding = function(padding) {
  this._contentPadding = padding;
};


/**
 * Get Content padding of the panel darwer
 * @public
 * @return {number}  content padding
 */
dvt.PanelDrawer.prototype.getContentPadding = function() {
  return this._contentPadding;
};


/**
 * Get the maximum content width
 * @public
 * @return {number} maximum content width
 */
dvt.PanelDrawer.prototype.getMaxContentWidth = function() {
  return this._maxWidth - (2 * this.getContentPadding());
};

dvt.PanelDrawer.prototype.setMaxHeight = function(height) {
  this._maxHeight = height;
};

dvt.PanelDrawer.prototype.getMaxHeight = function() {
  return this._maxHeight;
};


/**
 * Get the maximum content height
 * @public
 * @return {number} maximum content height
 */
dvt.PanelDrawer.prototype.getMaxContentHeight = function() {
  return this._maxHeight - (2 * this.getContentPadding());
};

dvt.PanelDrawer.prototype.setDiscloseDirection = function(dir) {
  this._discloseDirection = dir;
};

dvt.PanelDrawer.prototype.getDiscloseDirection = function() {
  return this._discloseDirection;
};

dvt.PanelDrawer.prototype.setDockSide = function(dockSide) {
  this._dockSide = dockSide;
};

dvt.PanelDrawer.prototype.getDockSide = function() {
  return this._dockSide;
};

dvt.PanelDrawer.prototype.GetPanel = function(id) {
  return this._panels[id]['panel'];
};

dvt.PanelDrawer.prototype.GetIcon = function(id) {
  return this._panels[id]['icon'];
};

dvt.PanelDrawer.prototype.GetTooltip = function(id) {
  return this._panels[id]['tooltip'];
};

dvt.PanelDrawer.prototype.GetTab = function(id) {
  return this._tabs[id];
};


/**
 * Get panel ids
 * @return {array} array of panel ids
 */
dvt.PanelDrawer.prototype.GetPanelIds = function() {
  return this._panelOrder;
};


/**
 * Sets the id of an active panel
 * @param {string} id Active panel id
 * @param {boolean} bImmediate True to change panels state immediately (no animation)
 * @param {function} onEnd A function to call at the end of animation
 */
dvt.PanelDrawer.prototype.setDisplayedPanelId = function(id, bImmediate, onEnd) {
  this._oldDisplayedPanelId = this._displayedPanelId;
  this._displayedPanelId = id;
  if (this.isDisclosed()) {
    this.ChangeTabsState();
    this.ChangePanels(id, bImmediate, onEnd);
  }
  this._oldDisplayedPanelId = null;
};

dvt.PanelDrawer.prototype.getDisplayedPanelId = function() {
  var panelId = this._displayedPanelId;
  if (!panelId && this._panelOrder.length > 0) {
    return this._panelOrder[0];
  }
  return panelId;
};


/**
 * Either expands or collapses the PanelDrawer
 *
 * @param {boolean} bDisclosed Determines action of PanelDrawer (true => expand, false => collapse)
 * @param {boolean} bImmediate Determines whether or not to animate (true => no animation, false => animation)
 * @param {function} onEnd Function to be called following animation
 */
dvt.PanelDrawer.prototype.setDisclosed = function(bDisclosed, bImmediate, onEnd) {
  // skip if already transitioning
  if (!this._bTransition) {
    var oldDisclosed = this._bDisclosed;
    this._bDisclosed = bDisclosed;
    if (oldDisclosed != bDisclosed) {
      this._bTransition = true;
      if (bDisclosed) {
        this.DoExpand(bImmediate, onEnd);
      }
      else {
        this.DoCollapse(bImmediate, onEnd);
      }
    }
  }
};

dvt.PanelDrawer.prototype.isDisclosed = function() {
  return this._bDisclosed;
};


/**
 * Renders this panel drawer
 */
dvt.PanelDrawer.prototype.renderComponent = function() {
  if (!this._contentPane) {
    this._contentPane = new dvt.Container(this.getCtx(), 'pd_contentPane');
    this.addChild(this._contentPane);
    this._activeContent = new dvt.Container(this.getCtx(), 'pdcp_activeContent');
    this._contentPane.addChild(this._activeContent);
  }
  this.RenderTabs();
};


/**
 * Draws the tabs for each panel in The dvt.PanelDrawer in the non disclosed state.
 * No tabs are drawn if the dvt.PanelDrawer has fixed state and is in non disclosed state.
 * @protected
 */
dvt.PanelDrawer.prototype.RenderTabs = function() {
  if (!this.isFixed()) {
    var currX = -dvt.PanelDrawer._TAB_SIZE;
    if (this.getDiscloseDirection() == dvt.PanelDrawer.DIR_RIGHT) {
      currX = 0;
    }
    var currY = dvt.PanelDrawer._FIRST_TAB_SPACING;
    if (this.getDockSide() == dvt.PanelDrawer.DOCK_TOP) {
      for (var i = 0; i < this._panelOrder.length; i++) {
        var panelId = this._panelOrder[i];
        var tab = this.RenderTab(panelId);
        tab.setTranslate(currX, currY);
        currY += (dvt.PanelDrawer._TAB_SIZE + dvt.PanelDrawer._INTER_TAB_SPACING);
      }
    }
    else if (this.getDockSide() == dvt.PanelDrawer.DOCK_BOTTOM) {
      currY = -dvt.PanelDrawer._FIRST_TAB_SPACING - dvt.PanelDrawer._TAB_SIZE;
      for (var i = this._panelOrder.length - 1; i >= 0; i--) {
        var panelId = this._panelOrder[i];
        var tab = this.RenderTab(panelId);
        tab.setTranslate(currX, currY);
        currY -= (dvt.PanelDrawer._TAB_SIZE + dvt.PanelDrawer._INTER_TAB_SPACING);
      }
    }
  }
};

dvt.PanelDrawer.prototype.GetTabPathCommands = function() {
  var arPoints;
  switch (this.getDiscloseDirection()) {
    case dvt.PanelDrawer.DIR_RIGHT:
      arPoints = ['M', 0, 0,
                  'L', dvt.PanelDrawer._TAB_SIZE - this._borderRadius, 0,
                  'A', this._borderRadius, this._borderRadius, 0, 0, 1, dvt.PanelDrawer._TAB_SIZE, this._borderRadius,
                  'L', dvt.PanelDrawer._TAB_SIZE, dvt.PanelDrawer._TAB_SIZE - this._borderRadius,
                  'A', this._borderRadius, this._borderRadius, 0, 0, 1, dvt.PanelDrawer._TAB_SIZE - this._borderRadius, dvt.PanelDrawer._TAB_SIZE,
                  'L', 0, dvt.PanelDrawer._TAB_SIZE];
      break;
    case dvt.PanelDrawer.DIR_LEFT:
    default:
      arPoints = ['M', dvt.PanelDrawer._TAB_SIZE, 0,
                  'L', this._borderRadius, 0,
                  'A', this._borderRadius, this._borderRadius, 0, 0, 0, 0, this._borderRadius,
                  'L', 0, dvt.PanelDrawer._TAB_SIZE - this._borderRadius,
                  'A', this._borderRadius, this._borderRadius, 0, 0, 0, this._borderRadius, dvt.PanelDrawer._TAB_SIZE,
                  'L', dvt.PanelDrawer._TAB_SIZE, dvt.PanelDrawer._TAB_SIZE];
      break;
  }
  return arPoints;
};


/**
 * Renders panel drawer tab
 * @param {string} panelId Id of the rendered tab
 * @protected
 */
dvt.PanelDrawer.prototype.RenderTab = function(panelId) {
  var arPoints = this.GetTabPathCommands();
  var closedPath = arPoints;
  var strokeWidth = 1;

  var tab = new DvtPanelDrawerTab(this.getCtx(), closedPath, panelId, this);
  tab.setPixelHinting(true);
  tab.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
  this._contentPane.addChildAt(tab, 0);
  tab.setSolidFill(this._bgInactiveColor, this._bgAlpha);
  tab.setSolidStroke(this._borderInactiveColor, dvt.PanelDrawer._BORDER_ALPHA, strokeWidth);

  var panelObj = this._panels[panelId];

  var upState = new dvt.Path(this.getCtx(), closedPath);
  upState.setInvisibleFill();
  panelObj['iconUp'].setTranslate(.5 * (dvt.PanelDrawer._TAB_SIZE - dvt.PanelDrawer.IMAGE_SIZE), .5 * (dvt.PanelDrawer._TAB_SIZE - dvt.PanelDrawer.IMAGE_SIZE));
  upState.addChild(panelObj['iconUp']);
  var overState = new dvt.Path(this.getCtx(), closedPath);
  overState.setInvisibleFill();
  panelObj['iconOver'].setTranslate(.5 * (dvt.PanelDrawer._TAB_SIZE - dvt.PanelDrawer.IMAGE_SIZE), .5 * (dvt.PanelDrawer._TAB_SIZE - dvt.PanelDrawer.IMAGE_SIZE));
  overState.addChild(panelObj['iconOver']);
  var downState = new dvt.Path(this.getCtx(), closedPath);
  downState.setInvisibleFill();
  panelObj['iconDown'].setTranslate(.5 * (dvt.PanelDrawer._TAB_SIZE - dvt.PanelDrawer.IMAGE_SIZE), .5 * (dvt.PanelDrawer._TAB_SIZE - dvt.PanelDrawer.IMAGE_SIZE));
  downState.addChild(panelObj['iconDown']);

  var icon = new dvt.Button(this.getCtx(), upState, overState, downState);
  icon.setToggleEnabled(true);
  panelObj['icon'] = icon;

  tab.addChild(icon);

  this._tabs[panelId] = tab;

  var thisRef = this;
  var proxy = {};
  proxy.HandleClick = function(event) {
    thisRef.HandleTabClick(panelId);
  };
  proxy.getTooltip = function() {
    return thisRef.GetTooltip(panelId);
  };
  this._eventManager.associate(tab, proxy);
  tab.addAccessibilityAttributes();
  return tab;
};


/**
 * Tab click handler
 * @param {string} panelId Id of the clicked panel
 * @protected
 */
dvt.PanelDrawer.prototype.HandleTabClick = function(panelId) {
  this._oldDisplayedPanelId = this.getDisplayedPanelId();
  this._displayedPanelId = panelId;

  var currentTab = this.GetTab(panelId);
  var hasKeyboardFocusEffect = currentTab.isShowingKeyboardFocusEffect();


  var thisRef = this;
  var hideTooltipFunc = function() {
    var tooltipManager = thisRef.getCtx().getTooltipManager();
    if (tooltipManager) {
      tooltipManager.hideTooltip();
    }
  };
  //drawer is collapsed
  if (!this.isDisclosed()) {
    this.setDisclosed(true, false, hideTooltipFunc);
    this.ApplyAlphasRollover();
  }
  //drawer is expanded, but need to collapse
  else if (this._oldDisplayedPanelId == panelId) {
    this.setDisclosed(false, false, hideTooltipFunc);
  }
  //drawer is expanded, but need to change panels
  else {
    this.ChangeTabsState();
    this.ChangePanels(panelId, false);
  }
  this._oldDisplayedPanelId = null;


  this.FireListener(new dvt.PanelDrawerEvent(this.isDisclosed() ? dvt.PanelDrawerEvent.SUBTYPE_SHOW : dvt.PanelDrawerEvent.SUBTYPE_HIDE,
                                            this._displayedPanelId));
  //If there was previously a FocusObject, then set it in the new tab
  if (hasKeyboardFocusEffect) {
    this.getCtx().setCurrentKeyboardFocus(this);
  }


};



/**
 * @protected
 * Helper function to hadle panel change
 * @param {string} panelId active panel id
 * @param {boolean} bImmediate Determines whether or not to animate (true => no animation, false => animation)
 * @param {function} onEnd Function to be called following animation
 */
dvt.PanelDrawer.prototype.ChangePanels = function(panelId, bImmediate, onEnd) {
  var anim = null;
  if (!bImmediate) {
    anim = new dvt.Animator(this.getCtx(), dvt.PanelDrawer._ANIM_DURATION);
  }
  if (this._oldDisplayedPanelId) {
    var oldPanel = this.GetPanel(this._oldDisplayedPanelId);
    if (oldPanel) {
      this._expandedContentPanel.removeChild(oldPanel);
    }
  }
  this.DisplayPanel(panelId, anim);
  if (anim) {
    this.ApplyAlphasRollover();
    if (onEnd) {
      dvt.Playable.appendOnEnd(anim, onEnd);
    }
    anim.play();
  }
  else if (onEnd) {
    onEnd();
  }
};


/**
 * Expands panel drawer active tab.
 * @param {boolean} bImmediate Immediate expand, does not use animation
 * @param {function} onEnd A function to call at the end of animation
 * @protected
 */
dvt.PanelDrawer.prototype.DoExpand = function(bImmediate, onEnd) {
  this.DisplayPanel(this.getDisplayedPanelId());
  //width has been increased to account for bounce animation, so calculate original width
  var destX = -((1 / dvt.PanelDrawer._BOUNCE_WIDTH_FACTOR) * this._expandedContent.getWidth());
  if (this.getDiscloseDirection() == dvt.PanelDrawer.DIR_RIGHT) {
    destX = -destX;
    //since we're increasing width, need to offset x by amount of padding when panelDrawer is
    //on left edge of component
    this._expandedContent.setX(((1 / dvt.PanelDrawer._BOUNCE_WIDTH_FACTOR) - 1) * this._expandedContent.getWidth());
  }

  if (!bImmediate) {
    var anim = new dvt.Animator(this.getCtx(), dvt.PanelDrawer._ANIM_DURATION);
    //bounce anim at end
    anim.setEasing(dvt.Easing.backOut);
    anim.addProp(dvt.Animator.TYPE_NUMBER, this._contentPane, this._contentPane.getTranslateX, this._contentPane.setTranslateX, destX);

    if (onEnd) {
      dvt.Playable.appendOnEnd(anim, onEnd);
    }

    if (anim) {
      var thisRef = this;
      dvt.Playable.appendOnEnd(anim, function() { thisRef._bTransition = false; });
      anim.play();
    }
  }
  else {
    this._contentPane.setTranslateX(destX);
    if (onEnd) {
      onEnd();
    }
    this._bTransition = false;
  }
  this.ChangeTabsState();
};


/**
 * Collapses panel drawer.
 * @param {boolean} bImmediate True for immediate collapse (no animation)
 * @param {function} onEnd A function to call at the end of animation
 * @protected
 */
dvt.PanelDrawer.prototype.DoCollapse = function(bImmediate, onEnd) {
  if (!bImmediate) {
    var anim = new dvt.Animator(this.getCtx(), dvt.PanelDrawer._ANIM_DURATION);
    //bounce anim at beginning
    anim.setEasing(dvt.Easing.backIn);
    anim.addProp(dvt.Animator.TYPE_NUMBER, this._contentPane, this._contentPane.getTranslateX, this._contentPane.setTranslateX, 0);
    dvt.Playable.appendOnEnd(anim, this.RemoveExpandedContent, this);
    dvt.Playable.appendOnEnd(anim, this.ChangeTabsState, this);
    if (onEnd) {
      dvt.Playable.appendOnEnd(anim, onEnd);
    }
    var thisRef = this;
    dvt.Playable.appendOnEnd(anim, function() { thisRef._bTransition = false; });
    anim.play();
  }
  else {
    this._contentPane.setTranslateX(0);
    this.RemoveExpandedContent();
    if (onEnd) {
      onEnd();
    }
    this.ChangeTabsState();
    this._bTransition = false;
  }

};


/**
 * Removes the expanded content from this panel drawer
 */
dvt.PanelDrawer.prototype.RemoveExpandedContent = function() {
  if (this._expandedContent) {
    //can't set clipPath to null because error is thrown
    //clear clip path first
    //this._setContentClipPath(null);
    this._contentClipPath = null;

    // do not destroy the panels themselves so remove them before destroying their container
    this._expandedContentPanel.removeChildren();
    this._activeContent.removeAllDrawEffects();
    this._expandedContent.destroy();
    this._activeContent.removeChild(this._expandedContent);
    this._expandedContent = null;
    this._expandedContentPanel = null;
    this._expandedBorder = null;
    this._expandedBorderResizable = null;
  }
};


/**
 * Displays the specified panel in this panel drawer
 * @param {string} id the id of the panel to display
 * @param {dvt.Animator} anim the animator used to display the transition animation, optional
 * @param {function} onEnd the function to be called after the panel has been displayed, optional
 */
dvt.PanelDrawer.prototype.DisplayPanel = function(id, anim, onEnd) {
  if (!this._expandedContent) {
    this._expandedContent = new dvt.Rect(this.getCtx(), 0, 0, 1, 1, 'pdcp_expandedContent');
    this._activeContent.addChild(this._expandedContent);
    this._expandedContent.setSolidFill(this._bgColor, this._bgAlpha);

    this._expandedContentPanel = new dvt.Container(this._context);
    this._expandedContent.addChild(this._expandedContentPanel);
    this._expandedContentPanel.setTranslate(this.getContentPadding(), this.getContentPadding());
  }

  var panel = this.GetPanel(id);
  if (panel) {
    this._expandedContentPanel.addChild(panel);

    //remove the resize listener from the old displayed panel
    if (this._oldDisplayedPanelId) {
      var oldPanel = this.GetPanel(this._oldDisplayedPanelId);
      if (oldPanel) {
        oldPanel.removeEvtListener(dvt.ResizeEvent.RESIZE_EVENT, this.HandlePanelResize, false, this);
      }
    }
    //add the resize listener to the new displayed panel
    panel.addEvtListener(dvt.ResizeEvent.RESIZE_EVENT, this.HandlePanelResize, false, this);
  }

  if (!this._expandedBorder) {
    this._expandedBorder = new dvt.Path(this.getCtx(), ['M', 0, 0, 'L', 1, 1], 'pdcp_expandedBorder');
    this._expandedBorderResizable = new dvt.Path(this.getCtx(), ['M', 0, 0, 'L', 1, 1], 'pdcp_expandedBorderResizable');
    this._expandedContent.addChild(this._expandedBorder);
    this._expandedContent.addChild(this._expandedBorderResizable);
    this._expandedBorder.setSolidStroke(this._borderColor, dvt.PanelDrawer._BORDER_ALPHA);
    this._expandedBorder.setFill(null);
    this._expandedBorderResizable.setSolidStroke(this._borderColor, dvt.PanelDrawer._BORDER_ALPHA);
    this._expandedBorderResizable.setFill(null);
    this._expandedBorder.setPixelHinting(true);
    this._expandedBorderResizable.setPixelHinting(true);
  }

  this.RefreshExpandedSize(id, anim);

  if (onEnd) {
    if (anim) {
      dvt.Playable.appendOnEnd(anim, onEnd);
    }
    else {
      onEnd();
    }
  }
};

dvt.PanelDrawer.prototype.HandlePanelResize = function(event) {
  var anim = new dvt.Animator(this.getCtx(), dvt.PanelDrawer._ANIM_DURATION);
  var resizeWidth = event.getWidth();
  var resizeHeight = event.getHeight();
  var ecw = this.GetExpandedContentWidth(resizeWidth);
  var ech = this.GetExpandedContentHeight(resizeHeight);
  var xx = event.getX() ? event.getX() : 0;
  var yy = event.getY() ? event.getY() : 0;
  this._refreshPanelSize(this.getDisplayedPanelId(), anim, ecw, ech, xx, yy);
  anim.play();
};


/**
 * Refresh expanded panel
 * @protected
 * @param {number} id  panel id
 * @param {dvt.Animator} anim  Dvt Animator object
 */
dvt.PanelDrawer.prototype.RefreshExpandedSize = function(id, anim) {
  var panel = this.GetPanel(id);

  var ecw = 2 * this.getContentPadding();
  var ech = 2 * this.getContentPadding();
  var xx = 0;
  var yy = 0;
  if (panel) {
    var dims = panel.getContentDimensions ? panel.getContentDimensions() : panel.getDimensionsWithStroke();
    ecw = this.GetExpandedContentWidth(dims.w);
    ech = this.GetExpandedContentHeight(dims.h);
    xx = dims.x;
    yy = dims.y;
  }
  this._refreshPanelSize(id, anim, ecw, ech, xx, yy);
};


/**
 * Update a panel's size based on the given parameters
 * @param {String} id The id for the panel to update
 * @param {dvt.Animator} anim The animator to use for the size update
 * @param {Number} ecw The content width
 * @param {Number} ech The content height
 * @param {Number} xx The content x coordinate
 * @param {Number} yy  The content y coordinate
 * @private
 */
dvt.PanelDrawer.prototype._refreshPanelSize = function(id, anim, ecw, ech, xx, yy) {
  var panel = this.GetPanel(id);

  //if base panel is not positioned at origin, adjust it
  //  if (xx != 0) {
  if (anim) {
    anim.addProp(dvt.Animator.TYPE_NUMBER, panel, panel.getTranslateX, panel.setTranslateX, -xx);
  }
  else {
    panel.setTranslateX(-xx);
  }
  //  }
  //  if (yy != 0) {
  if (anim) {
    anim.addProp(dvt.Animator.TYPE_NUMBER, panel, panel.getTranslateY, panel.setTranslateY, -yy);
  }
  else {
    panel.setTranslateY(-yy);
  }
  //  }

  //  var currWidth = this._expandedContent.getWidth();
  //  var currHeight = this._expandedContent.getHeight();

  var clipRect = new dvt.Rectangle(this.getContentPadding(), this.getContentPadding(),
                                  ecw - 2 * this.getContentPadding(), ech - 2 * this.getContentPadding());

  //increase width so that bounce animation doesn't detach panelDRrawer from edge of component
  var expandedContentWidth = dvt.PanelDrawer._BOUNCE_WIDTH_FACTOR * ecw;
  if (anim) {
    anim.addProp(dvt.Animator.TYPE_NUMBER, this._expandedContent, this._expandedContent.getWidth, this._expandedContent.setWidth, expandedContentWidth);
    anim.addProp(dvt.Animator.TYPE_NUMBER, this._expandedContent, this._expandedContent.getHeight, this._expandedContent.setHeight, ech);
    anim.addProp(dvt.Animator.TYPE_RECTANGLE, this, this._getContentClipPath, this._setContentClipPath, clipRect);

    //if we have an animation, then animate the translate change because
    //we must be changing tabs in an already-expanded drawer
    if (this.getDiscloseDirection() == dvt.PanelDrawer.DIR_LEFT) {
      anim.addProp(dvt.Animator.TYPE_NUMBER, this._contentPane, this._contentPane.getTranslateX, this._contentPane.setTranslateX, -ecw);
    }
    else if (this.getDiscloseDirection() == dvt.PanelDrawer.DIR_RIGHT) {
      anim.addProp(dvt.Animator.TYPE_NUMBER, this._contentPane, this._contentPane.getTranslateX, this._contentPane.setTranslateX, ecw);
      anim.addProp(dvt.Animator.TYPE_NUMBER, this._expandedBorder, this._expandedBorder.getTranslateX, this._expandedBorder.setTranslateX, ecw);
      anim.addProp(dvt.Animator.TYPE_NUMBER, this._expandedBorderResizable, this._expandedBorderResizable.getTranslateX, this._expandedBorderResizable.setTranslateX, ecw);

      anim.addProp(dvt.Animator.TYPE_NUMBER, this._expandedContent, this._expandedContent.getTranslateX, this._expandedContent.setTranslateX, -ecw);
    }
    if (this.getDockSide() == dvt.PanelDrawer.DOCK_BOTTOM) {
      anim.addProp(dvt.Animator.TYPE_NUMBER, this._expandedBorder, this._expandedBorder.getTranslateY, this._expandedBorder.setTranslateY, ech);
      anim.addProp(dvt.Animator.TYPE_NUMBER, this._expandedBorderResizable, this._expandedBorderResizable.getTranslateY, this._expandedBorderResizable.setTranslateY, ech);

      anim.addProp(dvt.Animator.TYPE_NUMBER, this._expandedContent, this._expandedContent.getTranslateY, this._expandedContent.setTranslateY, -ech);
    }
  }
  else {
    this._expandedContent.setWidth(expandedContentWidth);
    this._expandedContent.setHeight(ech);
    if (this.getDiscloseDirection() == dvt.PanelDrawer.DIR_RIGHT) {
      this._expandedContent.setTranslateX(-ecw);
      this._expandedBorder.setTranslateX(ecw);
      this._expandedBorderResizable.setTranslateX(ecw);
    }
    if (this.getDockSide() == dvt.PanelDrawer.DOCK_BOTTOM) {
      this._expandedContent.setTranslateY(-ech);
      this._expandedBorder.setTranslateY(ech);
      this._expandedBorderResizable.setTranslateY(ech);
    }

    //setting clipPath isn't working correctly; it doesn't animate
    this._setContentClipPath(clipRect);

    //don't change the translate if we're not animating it because
    //we must be expanding and that will be handled by the expand itself
  }

  var tab = this.GetTab(id);
  var borderPath;

  //render corner line from tab to corner, and then to edge of component
  var edgeX = ecw;
  if (this.getDiscloseDirection() == dvt.PanelDrawer.DIR_RIGHT)
    edgeX = -ecw;

  if (this.getDockSide() == dvt.PanelDrawer.DOCK_TOP) {
    if (tab) {
      //render line from top to start of first tab
      borderPath = ['M', 0, 0, 'L', 0, tab.getTranslateY(), 'M', 0, tab.getTranslateY() + dvt.PanelDrawer._TAB_SIZE];
      //render line from bottom of tab to bottom of last tab
      var lastPanelId = this._panelOrder[this._panelOrder.length - 1];
      var lastTab = this.GetTab(lastPanelId);
      borderPath.push('L', 0, lastTab.getTranslateY() + dvt.PanelDrawer._TAB_SIZE);
      this._expandedBorder.setCommands(borderPath);

      //increase width so that bounce animation doesn't detach panelDRrawer from edge of component
      edgeX *= dvt.PanelDrawer._BOUNCE_WIDTH_FACTOR;
      borderPath = ['M', 0, lastTab.getTranslateY() + dvt.PanelDrawer._TAB_SIZE, 'L', 0, ech, 'L', edgeX, ech];
    } else {
      borderPath = ['M', 0, 0, 'L', 0, ech, 'L', edgeX, ech];
      this._expandedBorder.setCommands(borderPath);
    }
  }
  else if (this.getDockSide() == dvt.PanelDrawer.DOCK_BOTTOM) {
    if (tab) {
      //render line from bottom to bottom of tab
      borderPath = ['M', 0, 0, 'L', 0, tab.getTranslateY() + dvt.PanelDrawer._TAB_SIZE, 'M', 0, tab.getTranslateY()];
      //render line from top of tab to top of first tab
      var firstPanelId = this._panelOrder[0];
      var firstTab = this.GetTab(firstPanelId);
      borderPath.push('L', 0, firstTab.getTranslateY());
      this._expandedBorder.setCommands(borderPath);

      //increase width so that bounce animation doesn't detach panelDRrawer from edge of component
      edgeX *= dvt.PanelDrawer._BOUNCE_WIDTH_FACTOR;
      borderPath = ['M', 0, firstTab.getTranslateY(), 'L', 0, -ech, 'L', edgeX, -ech];
    } else {
      borderPath = ['M', 0, 0, 'L', 0, -ech, 'L', edgeX, -ech];
      this._expandedBorder.setCommands(borderPath);
    }
  }

  if (anim) {
    anim.addProp(dvt.Animator.TYPE_PATH, this._expandedBorderResizable, this._expandedBorderResizable.getCommands, this._expandedBorderResizable.setCommands, borderPath);
  }
  else {
    this._expandedBorderResizable.setCommands(borderPath);
  }

};

dvt.PanelDrawer.prototype._setContentClipPath = function(rect) {
  if (this._expandedContentPanel) {
    if (rect) {
      //need to change id of clipPath in order for Chrome to update
      var clipPath = new dvt.ClipPath('pdcp' + this._sid);
      clipPath.addRect(rect.x, rect.y, rect.w, rect.h);

      this._expandedContentPanel.setClipPath(clipPath);
    }
  }
  this._contentClipPath = rect;
};

dvt.PanelDrawer.prototype._getContentClipPath = function() {
  return this._contentClipPath;
};


/**
 * Get expanded content width
 * @protected
 * @param {number} preferredwidth  preferred width
 * @return {number}  expanded content width
 */
dvt.PanelDrawer.prototype.GetExpandedContentWidth = function(preferredWidth) {
  var ww = preferredWidth + 2 * this.getContentPadding();
  if ((this._minWidth || this._minWidth == 0) && ww < this._minWidth) {
    ww = this._minWidth;
  }
  if (this._maxWidth && ww > this._maxWidth) {
    ww = this._maxWidth;
  }
  return ww;
};


/**
 * Get expanded content height
 * @protected
 * @param {number} preferredHeight  preferred height
 * @return {number}  expanded content height
 */
dvt.PanelDrawer.prototype.GetExpandedContentHeight = function(preferredHeight) {
  var hh = preferredHeight + 2 * this.getContentPadding();
  if ((this._minHeight || this._minHeight == 0) && hh < this._minHeight) {
    hh = this._minHeight;
  }
  if (this._maxHeight && hh > this._maxHeight) {
    hh = this._maxHeight;
  }
  return hh;
};

dvt.PanelDrawer.prototype.ApplyFillAlpha = function(alpha) {
  if (this._expandedContent) {
    var fill = this._expandedContent.getFill().clone();
    fill.setAlpha(alpha);
    this._expandedContent.setFill(fill);
  }
  for (var panelId in this._tabs) {
    var tab = this._tabs[panelId];
    if (tab) {
      var fill = tab.getFill().clone();
      fill.setAlpha(alpha);
      tab.setFill(fill);
    }
  }
};

dvt.PanelDrawer.prototype.ApplyStrokeAlpha = function(alpha) {
  if (this._expandedBorder) {
    var stroke = this._expandedBorder.getStroke().clone();
    stroke.setAlpha(alpha);
    this._expandedBorder.setStroke(stroke);
  }
  if (this._expandedBorderResizable) {
    var stroke = this._expandedBorderResizable.getStroke().clone();
    stroke.setAlpha(alpha);
    this._expandedBorderResizable.setStroke(stroke);
  }
  for (var panelId in this._tabs) {
    var tab = this._tabs[panelId];
    if (tab) {
      var stroke = tab.getStroke().clone();
      stroke.setAlpha(alpha);
      tab.setStroke(stroke);
    }
  }
};


/**
 * De-emphasize the panel, for example while dragging other content
 * around in the window.
 */
dvt.PanelDrawer.prototype.deEmphasizeStart = function() {
  //disable interaction
  this.setMouseEnabled(false);
  this.ApplyFillAlpha(dvt.PanelDrawer._BACKGROUND_ALPHA_DE_EMPHASIZED);
  this.ApplyStrokeAlpha(dvt.PanelDrawer._BORDER_ALPHA_DE_EMPHASIZED);
  if (this._expandedContentPanel) {
    this._expandedContentPanel.setAlpha(dvt.PanelDrawer._BACKGROUND_ALPHA_DE_EMPHASIZED);
  }
  for (var panelId in this._tabs) {
    var icon = this.GetIcon(panelId);
    if (icon) {
      icon.setAlpha(dvt.PanelDrawer._BACKGROUND_ALPHA_DE_EMPHASIZED);
    }
  }
};


/**
 * Stop de-emphasizing the panel.
 */
dvt.PanelDrawer.prototype.deEmphasizeEnd = function() {
  //enable interaction
  this.setMouseEnabled(true);

  this.ApplyFillAlpha(this._bgAlpha);
  this.ApplyStrokeAlpha(dvt.PanelDrawer._BORDER_ALPHA);
  if (this._expandedContentPanel) {
    this._expandedContentPanel.setAlpha(1);
  }
  for (var panelId in this._tabs) {
    var icon = this.GetIcon(panelId);
    if (icon) {
      icon.setAlpha(1);
    }
  }

  //change alphas based on whether the mouse is currently over
  //the panel
  //TO DO:
  var bMouseOver = false;//this.hitTestPoint(stage.mouseX, stage.mouseY, true);
  if (bMouseOver) {
    this.HandleRollOver(null);
  }
  else {
    this.HandleRollOut(null);
  }
};


/**
 * Handle mouse roll over on the panel.
 *
 * @param event MouseEvent
 */
dvt.PanelDrawer.prototype.HandleRollOver = function(event) {
  //this.ApplyAlphasForMouse();
  this.ApplyAlphasRollover();
};


/**
 * Handle mouse roll out on the panel.
 *
 * @param event MouseEvent
 */
dvt.PanelDrawer.prototype.HandleRollOut = function(event) {
  //this.ApplyAlphasForMouse();
  if (!this._bFocus) {
    this.ApplyAlphasRollout();
  }
};


/**
 * Apply alpha values for mouse roll over.
 */
dvt.PanelDrawer.prototype.ApplyAlphasRollover = function() {
  this.ApplyFillAlpha(dvt.PanelDrawer._BACKGROUND_ALPHA_ROLLOVER);
};


/**
 * Apply alpha values for mouse roll out.
 */
dvt.PanelDrawer.prototype.ApplyAlphasRollout = function() {
  this.ApplyFillAlpha(this._bgAlpha);
};


/**
 * Updates state for each tab in the panel drawer
 * @protected
 */
dvt.PanelDrawer.prototype.ChangeTabsState = function() {

  for (var panelId in this._tabs) {
    var tab = this._tabs[panelId];
    if (tab) {
      if (panelId == this.getDisplayedPanelId() && this.isDisclosed()) {
        tab.setSolidFill(this._bgColor, this._bgAlpha);
        tab.setSolidStroke(this._borderColor, dvt.PanelDrawer._BORDER_ALPHA);
        tab.setDisclosed(true);
      }
      else {
        tab.setSolidFill(this._bgInactiveColor, this._bgAlpha);
        tab.setSolidStroke(this._borderInactiveColor, dvt.PanelDrawer._BORDER_ALPHA);
        tab.setDisclosed(false);
      }
    }

    //the displayed panel's icon remains highlighted
    var bActivePanel = this.isDisclosed() && panelId == this.getDisplayedPanelId();
    var icon = this.GetIcon(panelId);
    if (icon) {
      icon.setToggled(bActivePanel);
    }
    if (bActivePanel) {
      this._activeContent.addChild(tab);
    }
    else {
      this._contentPane.addChildAt(tab, 0);
    }
  }
};

dvt.PanelDrawer.prototype.setMaxContainerHeight = function(height) {
  if (!this._maxContainerHeight || this._maxContainerHeight < height)
    this._maxContainerHeight = height;
};

dvt.PanelDrawer.prototype.getMaxContainerHeight = function() {
  return this.GetExpandedContentHeight(this._maxContainerHeight);
};


/**
 * @override
 */
dvt.PanelDrawer.prototype.getDimensions = function(targetCoordinateSpace) {
  var dim = dvt.PanelDrawer.superclass.getDimensions.call(this, targetCoordinateSpace);
  dim.w /= dvt.PanelDrawer._BOUNCE_WIDTH_FACTOR;
  return dim;
};


/**
 * Get event manager for the component
 * @return {DvtPanelDrawerEventManager} event manager for the component
 */
dvt.PanelDrawer.prototype.getEventManager = function() {
  return this._eventManager;
};

// Copyright (c) 2014, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 * @constructor
 * Panel drawer tab
 * @param {dvt.Context} context the rendering context
 * @param {object} cmds the string of SVG path commands or an array of SVG path commands, whose entries contain the
 *                      commands followed by coordinates.
 * @param {string} id object id
 * @param {dvt.PanelDrawer} panelDrawer parent panel drawer component
 * @extends {dvt.Path}
 * @class DvtPanelDrawerTab
 * @constructor
 */
var DvtPanelDrawerTab = function(context, cmds, id, panelDrawer) {
  this.Init(context, cmds, id, panelDrawer);
};

dvt.Obj.createSubclass(DvtPanelDrawerTab, dvt.Path);


/**
 * Initialization function
 * @param {dvt.Context} context the rendering context
 * @param {object} cmds the string of SVG path commands or an array of SVG path commands, whose entries contain the
 *                      commands followed by coordinates.
 * @param {string} id object id
 * @param {dvt.PanelDrawer} panelDrawer parent panel drawer component
 * @protected
 */
DvtPanelDrawerTab.prototype.Init = function(context, cmds, id, panelDrawer) {
  DvtPanelDrawerTab.superclass.Init.call(this, context, cmds, 'pdcp_tab_' + id);
  this._panelDrawer = panelDrawer;
  this._isDisclosed = false;
  this._panelId = id;
};


/**
 * Handler for the keyboard event
 * @param {dvt.KeyboardEvent} event keyboard event
 * @protected
 */
DvtPanelDrawerTab.prototype.HandleKeyboardEvent = function(event) {
  var keyCode = event.keyCode;
  if (keyCode == dvt.KeyboardEvent.ENTER || keyCode == dvt.KeyboardEvent.SPACE) {
    var eventManager = this._panelDrawer.getEventManager();
    var point = this.localToStage(new dvt.Point(0, 0));
    var mouseEvent = dvt.DomEventFactory.generateMouseEventFromKeyboardEvent(event, this._context, dvt.MouseEvent.CLICK,
        this._context.getStage(),
        point.x, point.y);
    mouseEvent.target = this;
    eventManager.PreOnClick(mouseEvent);
  }
};


/**
 * Gets the tab is disclosed
 * @return {boolean} true if the tab is disclosed
 */
DvtPanelDrawerTab.prototype.isDisclosed = function() {
  return this._isDisclosed;
};


/**
 * Gets the tab is disclosed
 * @param {boolean} bDisclosed true if the tab is disclosed
 */
DvtPanelDrawerTab.prototype.setDisclosed = function(bDisclosed) {
  if (this._isDisclosed != bDisclosed) {
    this._isDisclosed = bDisclosed;
    this.updateAccessibilityAttributes();
  }
  else
    this._isDisclosed = bDisclosed;
};


/**
 * Gets WAI-ARIA label attribute
 * @return {string} WAI-ARIA label
 */
DvtPanelDrawerTab.prototype.getAriaLabel = function() {
  var states = [];
  states.push(this.isDisclosed() ? dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'STATE_EXPANDED') : dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'STATE_COLLAPSED'));
  return dvt.Displayable.generateAriaLabel(this._panelDrawer.GetTooltip(this._panelId), states);
};


/**
 * Add accessibility attributes to the panel drawer tab
 */
DvtPanelDrawerTab.prototype.addAccessibilityAttributes = function() {
  // WAI-ARIA
  this.setAriaRole('button');
  if (!dvt.Agent.deferAriaCreation()) {
    this.setAriaProperty('label', this.getAriaLabel());
  }
};


/**
 * Update accessibility attribute of the panel drawer tab
 */
DvtPanelDrawerTab.prototype.updateAccessibilityAttributes = function() {
  // WAI-ARIA
  if (!dvt.Agent.deferAriaCreation()) {
    this.setAriaProperty('label', this.getAriaLabel());
  }
};


//---------------------------------------------------------------------//
// Keyboard Support: DvtKeyboardNavigable impl                        //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtPanelDrawerTab.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  return this.getDimensions(targetCoordinateSpace);
};


/**
 * @override
 */
DvtPanelDrawerTab.prototype.getTargetElem = function() 
{
  return this.getElem();
};

/**
 * @override
 */
DvtPanelDrawerTab.prototype.showKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = true;
  if (!this._keyboardFocusEffect)
    this._createKeyboardFocusEffect();
  this._keyboardFocusEffect.show();
  this._context.setActiveElement(this); //accessibility feature
};


/**
 * @override
 */
DvtPanelDrawerTab.prototype.hideKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = false;
  if (!this._keyboardFocusEffect)
    this._createKeyboardFocusEffect();
  this._keyboardFocusEffect.hide();
};


/**
 * @override
 */
DvtPanelDrawerTab.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};


/**
 * @override
 */
DvtPanelDrawerTab.prototype.getNextNavigable = function(event) 
{
  var keyboardHandler = this._panelDrawer.getEventManager().getKeyboardHandler();
  return keyboardHandler.getNextNavigable(this, event);
};


/**
 * Create keyboard focus effect around given object
 * @private
 */
DvtPanelDrawerTab.prototype._createKeyboardFocusEffect = function() {
  var dim = this.getDimensions();
  this._keyboardFocusEffect = new dvt.KeyboardFocusEffect(this.getCtx(), this, new dvt.Rectangle(dim.x + 1, dim.y + 1, dim.w - 2, dim.h - 2), null, null, true);
};
// Copyright (c) 2012, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 * @constructor
 * @param {dvt.Context} context the platform specific context object
 * @param {function} callback a function that responds to component events
 * @param {object} callbackObj optional object instance that the callback function is defined on
 * @class DvtPanelDrawerEventManager
 * @extends {dvt.EventManager}
 */
var DvtPanelDrawerEventManager = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

dvt.Obj.createSubclass(DvtPanelDrawerEventManager, dvt.EventManager);


/**
 * @override
 */
DvtPanelDrawerEventManager.prototype.OnClick = function(event) {
  var obj = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));
  DvtPanelDrawerEventManager.superclass.OnClick.call(this, event);

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
 * @override
 */
DvtPanelDrawerEventManager.prototype.OnDblClickInternal = function(event) {
  var obj = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));

  // Done if there is no object
  if (!obj) {
    return;
  }

  if (obj.isDoubleClickable && obj.isDoubleClickable() && obj.HandleDblClick) {
    obj.HandleDblClick(event);
  }
  event.stopPropagation();
};


/**
 * @override
 */
DvtPanelDrawerEventManager.prototype.OnRollOver = function(event) {
  DvtPanelDrawerEventManager.superclass.OnRollOver.call(this, event);
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
 * @override
 */
DvtPanelDrawerEventManager.prototype.OnRollOut = function(event) {
  DvtPanelDrawerEventManager.superclass.OnRollOut.call(this, event);
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
DvtPanelDrawerEventManager.prototype.OnComponentTouchClick = function(event) {
  var obj = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));
  DvtPanelDrawerEventManager.superclass.OnComponentTouchClick.call(this, event);

  // Done if there is no object
  if (!obj) {
    return;
  }

  if (obj.HandleClick) {
    obj.HandleClick(event);
  }
  event.stopPropagation();
};
// Copyright (c) 2014, 2016, Oracle and/or its affiliates. All rights reserved.
/*---------------------------------------------------------------------------------*/
/*  DvtPanelDrawerKeyboardHandler     Keyboard handler for panel drawer            */
/*---------------------------------------------------------------------------------*/
/**
 * Keyboard handler for the panel drawer component
 * @param {dvt.EventManager} manager The owning dvt.EventManager
 * @param {DvtPalette} panelDrawer The owning panel drawer component
 * @class DvtPanelDrawerKeyboardHandler
 * @constructor
 * @extends {dvt.KeyboardHandler}
 */
var DvtPanelDrawerKeyboardHandler = function(manager, panelDrawer)
{
  this.Init(manager, panelDrawer);
};

dvt.Obj.createSubclass(DvtPanelDrawerKeyboardHandler, dvt.KeyboardHandler);


/**
 * @override
 */
DvtPanelDrawerKeyboardHandler.prototype.Init = function(manager, panelDrawer) {
  DvtPanelDrawerKeyboardHandler.superclass.Init.call(this, manager);
  this._panelDrawer = panelDrawer;
};

/**
 * @override
 */
DvtPanelDrawerKeyboardHandler.prototype.processKeyDown = function(event) {
  var keyCode = event.keyCode;
  var currentNavigable = this._eventManager.getFocus();
  if (keyCode == dvt.KeyboardEvent.TAB) {
    var next = null;
    dvt.EventManager.consumeEvent(event);
    if (!currentNavigable) {
      var panelIds = this._panelDrawer.GetPanelIds();
      next = this._panelDrawer.GetTab(panelIds[0]);
    }
    else {
      next = currentNavigable;
    }
    return next;
  }
  else if (keyCode == dvt.KeyboardEvent.ENTER || keyCode == dvt.KeyboardEvent.SPACE) {
    currentNavigable.HandleKeyboardEvent(event);
    return null;
  }
  else {
    return DvtPanelDrawerKeyboardHandler.superclass.processKeyDown.call(this, event);
  }
};


/**
 * Get next navigable tab in the panel drawer
 * @param {DvtPanelDrawerTab} currentNavigable a current navigable
 * @param {dvt.KeyboardEvent} event a keyboard event
 * @return {DvtPanelDrawerTab} next navigable
 */
DvtPanelDrawerKeyboardHandler.prototype.getNextNavigable = function(currentNavigable, event) {
  if (!(event.keyCode == dvt.KeyboardEvent.DOWN_ARROW || event.keyCode == dvt.KeyboardEvent.UP_ARROW))
    return currentNavigable;

  var next = currentNavigable;
  var bForward = (event.keyCode == dvt.KeyboardEvent.DOWN_ARROW) ? true : false;
  var panelIds = this._panelDrawer.GetPanelIds();
  var panelIndex = -1;
  for (var i = 0; i < panelIds.length; i++) {
    var panelId = panelIds[i];
    if (currentNavigable == this._panelDrawer.GetTab(panelId)) {
      if (bForward)
        panelIndex = (i == panelIds.length - 1) ? -1 : i + 1;
      else
        panelIndex = (i == 0) ? - 1 : i - 1;
      break;
    }
  }
  if (panelIndex >= 0) {
    next = this._panelDrawer.GetTab(panelIds[panelIndex]);
  }
  return next;
};
/**
 *  @constructor
 *  Creates an accordion UI control
 *  @param {dvt.Context} context object
 *  @param {string} id component id
 *  @param {number} w max content width
 *  @param {number} h max content height
 *  @param {dvt.EventManager} eventManager event manager for the control
 *  @param {images} images for the control
 *  @param {Object} styleMap for the control
 */
dvt.Accordion = function(context, id, w, h, eventManager, images, styleMap) {
  this.Init(context, id, w, h, eventManager, images, styleMap);
};

// TODO NAMESPACE ONLY USED BY PALETTE

dvt.Obj.createSubclass(dvt.Accordion, dvt.Container);

dvt.Accordion.COLLAPSE_ENA = 'sectionColEna';
dvt.Accordion.COLLAPSE_OVR = 'sectionColOvr';
dvt.Accordion.COLLAPSE_DWN = 'sectionColDwn';
dvt.Accordion.EXPAND_ENA = 'sectionExpEna';
dvt.Accordion.EXPAND_OVR = 'sectionExpOvr';
dvt.Accordion.EXPAND_DWN = 'sectionExpDwn';


/**
 * @protected
 * Initialization method called by the constructor
 * @param {dvt.Context} context object
 * @param {string} id component id
 * @param {number} w max content width
 * @param {number} h max content height
 * @param {dvt.EventManager} eventManager event manager for the control
 * @param {images} images for the control
 * @param {Object} styleMap for the control
 */
dvt.Accordion.prototype.Init = function(context, id, w, h, eventManager, images, styleMap) {
  dvt.Accordion.superclass.Init.call(this, context, null, id);
  this._images = images;
  var defaultStyles = new DvtAccordionDefaults();
  this._styleMap = defaultStyles.calcOptions(styleMap);
  this._sections = {};
  this._sectionOrder = [];
  this._maxWidth = w;
  this._minWidth = 0;
  this._maxHeight = h;
  this._bCollapseAll = false;
  this._bExpandMany = false;

  this._eventManager = eventManager;
};


/**
 * Creates and adds an accordion section
 * @param {string} title Section title
 * @param {dvt.Container} sectionContent Section content
 * @param {Boolean} isActive Indicates if the section initially opened
 * @param {Boolean} isCollapsible Indicates if the section is collapsible
 * @param {string} id Section id
 */
dvt.Accordion.prototype.addSection = function(title, sectionContent, isActive, isCollapsible, id) {
  if (!id)
    id = 'accordion_' + title.replace(/ /g, '_') + Math.floor(Math.random() * 1000000000);//@RandomNumberOk
  var accordionSection = new dvt.AccordionSection(this.getCtx(), sectionContent, title, isActive, isCollapsible, this, this._eventManager, id, this._images, this._styleMap);
  this._sections[id] = accordionSection;
  this._sectionOrder.push(id);
  this.addChild(accordionSection);
};


/**
 * Renders the control
 */
dvt.Accordion.prototype.render = function() {
  var maxSectionWidth = this.getMaxSectionWidth();
  var bHasActive = false; //ensure that at least one section is initially active

  for (var i = 0; i < this._sectionOrder.length; i++) {
    var section = this.getSectionByIndex(i);
    section.render(maxSectionWidth);

    // if we already have one active section and only one is allowed, make other sections inactive
    if (bHasActive && !this.canExpandMany())
      section.setActive(false);
    if (section.isActive() && section.isCollapsible())
      bHasActive = true;
  }
  if (!bHasActive && this._sectionOrder.length > 0 && !this.canCollapseAll())
    this.getSectionByIndex(0).setActive(true);

  this._drawSections();
};


/**
 * Sets max available height
 * @param {number} h max available height
 */
dvt.Accordion.prototype.setMaxHeight = function(h) {
  this._maxHeight = h;
};


/**
 * Gets max available height
 * @return {number} max available height
 */
dvt.Accordion.prototype.getMaxHeight = function() {
  return this._maxHeight;
};


/**
 * Sets max available width
 * @param {number} w max available width
 */
dvt.Accordion.prototype.setMaxWidth = function(w) {
  this._maxWidth = w;
};


/**
 * Gets max available width
 * @return {number} max available width
 */
dvt.Accordion.prototype.getMaxWidth = function() {
  return this._maxWidth;
};


/**
 * Sets min width for the control
 * @param {number} w min width for the control
 */
dvt.Accordion.prototype.setMinWidth = function(w) {
  this._minWidth = w;
};


/**
 * Gets min width for the control
 * @return {number} min width for the control
 */
dvt.Accordion.prototype.getMinWidth = function() {
  return this._minWidth;
};


/**
 * Updates accordion panel and resizes external container
 * @param {activeSectionId} activeSectionId section title
 */
dvt.Accordion.prototype.update = function(activeSectionId) {
  var activeSection = this.getSectionById(activeSectionId);
  var currActiveState = activeSection.isActive();
  if (!currActiveState) {
    //collapse sections if necessary, then open an active one
    if (!this.canExpandMany()) {
      for (var i = 0; i < this._sectionOrder.length; i++)
        this.getSectionByIndex(i).setActive(false);
    }
    activeSection.setActive(true);
  }
  else if (currActiveState && this._canCollapseSection(activeSection)) {
    activeSection.setActive(false);
  }
  this._drawSections();
};


/**
 * Returns max section width
 * @return {number}
 */
dvt.Accordion.prototype.getMaxSectionWidth = function() {
  if (!this._maxSectionWidth) {
    var maxSectionWidth = 0;
    var paddingX = this._styleMap['paddingX'];

    // find widest section
    for (var i = 0; i < this._sectionOrder.length; i++) {
      var section = this.getSectionByIndex(i);
      var dim = section.GetTitleDimensions();
      if (dim.w > maxSectionWidth)
        maxSectionWidth = dim.w;
      //add padding to the calculated section width
      var secWidth = section.getContentDimensions().w + paddingX * 2;
      if (secWidth > maxSectionWidth)
        maxSectionWidth = secWidth;
    }

    maxSectionWidth = Math.min(maxSectionWidth, this._maxWidth);
    maxSectionWidth = Math.max(maxSectionWidth, this._minWidth);
    this._maxSectionWidth = maxSectionWidth;
  }
  return this._maxSectionWidth;
};


/**
 * Returns max control height when all sections are expanded
 * @return {number}
 */
dvt.Accordion.prototype.getExpandedHeight = function() {
  if (!this._maxHeight) {
    var maxCollapsibleSectionHeight = 0; //collapsible sections height
    var maxFixedSectionHeight = 0; //fixed sections height
    for (var i = 0; i < this._sectionOrder.length; i++) {
      var section = this.getSectionByIndex(i);
      var sectionHeight = section.getExpandedDimensions().h;

      if (section.isCollapsible() && sectionHeight > maxCollapsibleSectionHeight)
        maxCollapsibleSectionHeight = sectionHeight;
      else if (!section.isCollapsible() || this.canExpandMany())
        maxFixedSectionHeight += sectionHeight;
    }
    this._maxHeight = maxCollapsibleSectionHeight + maxFixedSectionHeight;
  }
  return this._maxHeight;
};


/**
 * Gets section by given index
 * @param {number} index Section index
 * @return {dvt.AccordionSection} Section by given index
 */
dvt.Accordion.prototype.getSectionByIndex = function(index) {
  if (index >= 0 && index < this._sectionOrder.length) {
    var sectionId = this._sectionOrder[index];
    return this.getSectionById(sectionId);
  }
  else
    return null;
};


/**
 * Gets section by given section id
 * @param {string} sectionId Section id
 * @return {dvt.AccordionSection} Section by given id
 */
dvt.Accordion.prototype.getSectionById = function(sectionId) {
  return this._sections[sectionId];
};


/**
 * Sets "expand many" attribute for the control. Default value is false.
 * @param {boolean} bExpandMany True if more than one section can be expanded
 */
dvt.Accordion.prototype.setExpandMany = function(bExpandMany) {
  this._bExpandMany = bExpandMany;
};


/**
 * Checks "expand many" attribute for the control. Default value is false.
 * @return {boolean} True if more than one section can be expanded
 */
dvt.Accordion.prototype.canExpandMany = function() {
  return this._bExpandMany;
};


/**
 * Sets "collapse all" attribute for the control. Default value is false.
 * @param {boolean} bCollapseAll True if all section could be collapsed
 */
dvt.Accordion.prototype.setCollapseAll = function(bCollapseAll) {
  this._bCollapseAll = bCollapseAll;
};


/**
 * Checks "collapse all" attribute for the control. Default value is false.
 * @return {boolean} True if all sections could be collapsed
 */
dvt.Accordion.prototype.canCollapseAll = function() {
  return this._bCollapseAll;
};


/**
 * @private
 * Check if the given section can be collapsed
 * @param {dvt.AccordionSection} section The section to check for collapsability
 */
dvt.Accordion.prototype._canCollapseSection = function(section) {
  if (!section.isCollapsible())
    return false;
  else if (this.canCollapseAll())
    return true;
  else {
    var expandedSectionCounter = 0;
    for (var i = 0; i < this._sectionOrder.length; i++) {
      section = this.getSectionByIndex(i);
      if (section.isActive())
        expandedSectionCounter++;
    }
    return (expandedSectionCounter > 1);
  }
};


/**
 * @private
 * Collapse and expand sections as needed
 */
dvt.Accordion.prototype._drawSections = function() {
  var currY = 0;
  for (var i = 0; i < this._sectionOrder.length; i++) {
    var section = this.getSectionByIndex(i);
    section.setTranslateY(currY);

    if (section.isActive()) {
      section.expand();
      currY += section.getDimensionsWithStroke().h;
      currY += this._styleMap['paddingY'];
    }
    else {
      section.collapse();
      currY += this._styleMap['sectionHeader']['headerHeight'];
    }
  }
  var dims = this.getDimensionsWithStroke();
  this.FireListener(new dvt.ResizeEvent(dims.w, dims.h, 0, 0));
};

/**
 * Get accordion sections
 * @return {array} array of accordion sections
 */
dvt.Accordion.prototype.getSections = function() {
  var sections = [];
  for (var i = 0; i < this._sectionOrder.length; i++) {
    sections.push(this.getSectionByIndex(i));
  }
  return sections;
};

/**
 *  @constructor
 *  Creates an accordion section
 *  @param {dvt.Context} context object
 *  @param {dvt.Container} section content (doesn't include header)
 *  @param {string} title section title
 *  @param {Boolean} isActive Indicates if the section initially opened
 *  @param {Boolean} isCollapsible Indicates if the section is collapsible
 *  @param {dvt.Accordion} parent
 *  @param {dvt.EventManager} eventManager
 *  @param {string} id Section id
 *  @param {images} images for the control
 *  @param {Object} styleMap for the control
 */
dvt.AccordionSection = function(context, section, title, isActive, isCollapsible, parent, eventManager, id, images, styleMap) {
  this.Init(context, section, title, isActive, isCollapsible, parent, eventManager, id, images, styleMap);
};

dvt.Obj.createSubclass(dvt.AccordionSection, dvt.Container);


/**
 * @protected
 * Initialization method called by the constructor
 * @param {dvt.Context} context object
 * @param {dvt.Container} section content (doesn't include header)
 * @param {string} title section title
 * @param {Boolean} isActive Indicates if the section initially opened
 * @param {Boolean} isCollapsible Indicates if the section is collapsible
 * @param {dvt.Accordion} parent
 * @param {dvt.EventManager} eventManager
 * @param {string} id Section id
 * @param {images} images for the control
 * @param {Object} styleMap for the control
 */
dvt.AccordionSection.prototype.Init = function(context, section, title, isActive, isCollapsible, parent, eventManager, id, images, styleMap) {
  dvt.AccordionSection.superclass.Init.call(this, context, null, id);
  this._parent = parent;
  this._images = images;
  this._title = title;
  this._id = id;
  this._sectionContent = section;
  this._expandedBtn = null;
  this._collapsedBtn = null;
  this._isCollapsible = isCollapsible;
  this._isActive = isCollapsible ? isActive : true;
  this._eventManager = eventManager;

  //styles
  this._styleMap = styleMap;
  this._headerHeight = this._styleMap['sectionHeader']['headerHeight'];
  this._paddingX = this._styleMap['paddingX'];
  this._paddingY = this._styleMap['paddingY'];
  this._titleStyle = this._styleMap['sectionHeader']['styleEna'];
  this._imageWidth = this._styleMap['sectionHeader']['imageWidth'];
  this._imageHeight = this._styleMap['sectionHeader']['imageHeight'];
  this._textPadding = this._styleMap['sectionHeader']['textPadding'];
};


/**
 * Returns section id
 *
 * @return {string}
 */
dvt.AccordionSection.prototype.getId = function() {
  return this._id;
};


/**
 * Returns section title
 *
 * @return {string}
 */
dvt.AccordionSection.prototype.getTitle = function() {
  return this._title;
};


/**
 * Sets active indicator
 *
 * @param {Boolean} active
 */
dvt.AccordionSection.prototype.setActive = function(active) {
  this._isActive = active;
};


/**
 * Returns whether section is active
 *
 * @return {Boolean}
 */
dvt.AccordionSection.prototype.isActive = function() {
  return this._isActive;
};


/**
 * Returns whether section is collapsible
 *
 * @return {Boolean}
 */
dvt.AccordionSection.prototype.isCollapsible = function() {
  return this._isCollapsible;
};


/**
 * Returns content dimentsions (does not include title bar)
 *
 * @return {dvt.Rect}
 */
dvt.AccordionSection.prototype.getContentDimensions = function() {
  var dim = null;
  if (this.getChildIndex(this._sectionContent) < 0) {
    this.addChild(this._sectionContent);
    dim = this._sectionContent.getDimensions();
    this.removeChild(this._sectionContent);
  }
  else
    dim = this._sectionContent.getDimensions();
  return dim;
};


/**
 * Returns expanded section dimensions (includes title bar and content section)
 *
 * @return {dvt.Rect}
 */
dvt.AccordionSection.prototype.getExpandedDimensions = function() {
  var dim = null;
  if (this.getChildIndex(this._sectionContent) < 0) {
    this.addChild(this._sectionContent);
    this._sectionContent.setTranslateX(this._paddingX);
    this._sectionContent.setTranslateY(this._headerHeight + this._paddingY);
    dim = this.getDimensionsWithStroke();
    this.removeChild(this._sectionContent);
  }
  else
    dim = this.getDimensionsWithStroke();
  return dim;
};


/**
 * Renders the accordion section
 */
dvt.AccordionSection.prototype.render = function(width) {

  this._createHeader(width, this._headerHeight);

  if (!this.isCollapsible()) {
    this.addChildAt(this._header, 0);
    this.addChild(this._sectionContent);
    this._sectionContent.setTranslateX(this._paddingX);
    this._sectionContent.setTranslateY(this._headerHeight + this._paddingY);
  }
  else if (this.isActive()) {
    this.addChildAt(this._expandedBtn, 0);
    this.addChild(this._sectionContent);
    this._sectionContent.setTranslateX(this._paddingX);
    this._sectionContent.setTranslateY(this._headerHeight + this._paddingY);
  }
  else
    this.addChild(this._collapsedBtn);
};


/**
 * Collapses the accordion section
 */
dvt.AccordionSection.prototype.collapse = function() {
  if (this.isCollapsible()) {
    if (this.getChildIndex(this._expandedBtn) >= 0)
      this.removeChild(this._expandedBtn);
    if (this.getChildIndex(this._sectionContent) >= 0)
      this.removeChild(this._sectionContent);
    this.addChild(this._collapsedBtn);
    this.setActive(false);
    if (this.isShowingKeyboardFocusEffect()) {
      this.showKeyboardFocusEffect();
    }
  }
};


/**
 * Expands the accordion section
 */
dvt.AccordionSection.prototype.expand = function() {
  if (this.getChildIndex(this._collapsedBtn) >= 0)
    this.removeChild(this._collapsedBtn);

  this.addChild(this._expandedBtn);
  this.addChild(this._sectionContent);
  this._sectionContent.setTranslateX(this._paddingX);
  this._sectionContent.setTranslateY(this._headerHeight + this._paddingY);
  this.setActive(true);
  if (this.isShowingKeyboardFocusEffect()) {
    this.showKeyboardFocusEffect();
  }
};


/**
 * Handles click event of section header
 * @param {dvt.MouseEvent} event
 * @protected
 */
dvt.AccordionSection.prototype.HandleHeaderClick = function(event) {
  this._parent.update(this.getId());
};


/**
 * @protected
 */
dvt.AccordionSection.prototype.GetTitleDimensions = function() {
  if (!this._titleDim) {
    var text = new dvt.OutputText(this._context, this._title);
    text.setCSSStyle(this._titleStyle);
    var dim = text.measureDimensions();
    if (dim)
      dim.w = dim.w + this._imageWidth + this._textPadding;
    this._titleDim = dim;
  }
  return this._titleDim;
};


/**
 * @protected
 */
dvt.AccordionSection.prototype.SetTitleDimensions = function(dim) {
  if (!this._titleDim || this._titleDim.w < dim.w || this._titleDim.h < dim.h)
    this._titleDim = dim;
};


/**
 * @private
 * Creates section header
 * @param {number} width Section width
 * @param {number} height Section height
 */
dvt.AccordionSection.prototype._createHeader = function(width, height) {

  // create header
  if (this.isCollapsible()) {
    var ena, ovr, dwn;
    var ariaLabel;
    if (this._images.getAttr) {  //XML Node
      ena = this._createHeaderState(dvt.Button.STATE_ENABLED, this._images.getAttr(dvt.Accordion.EXPAND_ENA), this._title, width, height);
      ovr = this._createHeaderState(dvt.Button.STATE_OVER, this._images.getAttr(dvt.Accordion.EXPAND_OVR), this._title, width, height);
      dwn = this._createHeaderState(dvt.Button.STATE_DOWN, this._images.getAttr(dvt.Accordion.EXPAND_DWN), this._title, width, height);
    } else {  //JSON Object
      ena = this._createHeaderState(dvt.Button.STATE_ENABLED, this._images[dvt.Accordion.EXPAND_ENA], this._title, width, height);
      ovr = this._createHeaderState(dvt.Button.STATE_OVER, this._images[dvt.Accordion.EXPAND_OVR], this._title, width, height);
      dwn = this._createHeaderState(dvt.Button.STATE_DOWN, this._images[dvt.Accordion.EXPAND_DWN], this._title, width, height);
    }
    this._expandedBtn = new dvt.Button(this._context, ena, ovr, dwn);
    this._expandedBtn.setAriaRole('button');
    ariaLabel = dvt.Displayable.generateAriaLabel(this._title, [dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'STATE_EXPANDED')]);
    this._expandedBtn.setAriaProperty('label', ariaLabel);

    if (this._images.getAttr) {
      ena = this._createHeaderState(dvt.Button.STATE_ENABLED, this._images.getAttr(dvt.Accordion.COLLAPSE_ENA), this._title, width, height);
      ovr = this._createHeaderState(dvt.Button.STATE_OVER, this._images.getAttr(dvt.Accordion.COLLAPSE_OVR), this._title, width, height);
      dwn = this._createHeaderState(dvt.Button.STATE_DOWN, this._images.getAttr(dvt.Accordion.COLLAPSE_DWN), this._title, width, height);
    } else {
      ena = this._createHeaderState(dvt.Button.STATE_ENABLED, this._images[dvt.Accordion.COLLAPSE_ENA], this._title, width, height);
      ovr = this._createHeaderState(dvt.Button.STATE_OVER, this._images[dvt.Accordion.COLLAPSE_OVR], this._title, width, height);
      dwn = this._createHeaderState(dvt.Button.STATE_DOWN, this._images[dvt.Accordion.COLLAPSE_DWN], this._title, width, height);
    }
    this._collapsedBtn = new dvt.Button(this._context, ena, ovr, dwn);
    this._collapsedBtn.setAriaRole('button');
    ariaLabel = dvt.Displayable.generateAriaLabel(this._title, [dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'STATE_COLLAPSED')]);
    this._collapsedBtn.setAriaProperty('label', ariaLabel);

    this._eventManager.associate(this._expandedBtn, this);
    this._eventManager.associate(this._collapsedBtn, this);
  }
  else {
    var base = this._createButtonBase(dvt.Button.STATE_DISABLED, width, height);
    var text = this._createButtonText(dvt.Button.STATE_DISABLED, this._title);
    this._header = new dvt.Container(this._context);
    this._header.addChild(base);
    this._header.addChild(text);
  }
};


/**
 * @private
 * Helper function that creates header state
 * @param {number} state One of the buttons staes : dvt.Button.STATE_ENABLED, dvt.Button.STATE_OVER, dvt.Button.STATE_DOWN
 * @param {string} uri The URL to the collapse/expand image used in the header state
 * @param {string} label Section label
 * @param {number} width Section width
 * @param {height} height Section height
 */
dvt.AccordionSection.prototype._createHeaderState = function(state, uri, label, ww, hh) {

  var imageWidth = this._imageWidth;
  var imageHeight = this._imageHeight;
  var imageOffsetX = 0;
  var imageOffsetY = (this._headerHeight - imageHeight) / 2;

  var buttonState = new dvt.Container(this._context);
  var base = this._createButtonBase(state, ww, hh);
  buttonState.addChild(base);

  var image = uri ? new dvt.Image(this._context, uri, imageOffsetX, imageOffsetY, imageWidth, imageHeight) : null;
  if (image)
    buttonState.addChild(image);

  // text will be attached to the buttonState by dvt.TextUtils.fitText()
  var text = this._createButtonText(state, label, ww - imageWidth - imageOffsetX, hh, buttonState);

  if (!dvt.Agent.isRightToLeft(this._context)) {
    text.setTranslateX(imageWidth);
  }
  else {
    var dim = text.measureDimensions();
    text.setTranslateX(ww - dim.w - imageWidth);
    if (image)
      image.setTranslateX(ww - imageWidth);
  }

  if (!this._keyboardFocusEffect) {
    this._createKeyboardFocusEffect(image ? image : text);
  }

  return buttonState;
};


/**
 * @private
 * @param {number} state One of the buttons staes : dvt.Button.STATE_ENABLED, dvt.Button.STATE_OVER, dvt.Button.STATE_DOWN
 * @param {string} label the button text
 * @param {number} ww the maximum width of the text
 * @param {number} hh the maximum height of the text
 * @param {dvt.Container} container the parent of the text
 */
dvt.AccordionSection.prototype._createButtonText = function(state, label, ww, hh, container) {
  var text = null;
  if (label) {
    text = new dvt.OutputText(this._context, label);
    text.setCSSStyle(this._titleStyle);
    dvt.TextUtils.fitText(text, ww, hh, container);
    var dims = text.measureDimensions();
    this.SetTitleDimensions(dims);
    text.setTranslateY((this._headerHeight - dims.h) / 2);
  }
  return text;
};


/**
 * @private
 * @param {number} state One of the buttons staes : dvt.Button.STATE_ENABLED, dvt.Button.STATE_OVER, dvt.Button.STATE_DOWN
 * @param {number} ww the base width
 * @param {number} hh the base height
 */
dvt.AccordionSection.prototype._createButtonBase = function(state, ww, hh) {
  var style = null;
  switch (state) {
    case dvt.Button.STATE_OVER:
      style = this._styleMap['sectionHeader']['styleOvr'];
      break;
    case dvt.Button.STATE_DOWN:
      style = this._styleMap['sectionHeader']['styleDwn'];
      break;
    case dvt.Button.STATE_DISABLED:
      style = this._styleMap['sectionHeader']['styleDis'];
      break;
    case dvt.Button.STATE_ENABLED:
    default:
      style = this._styleMap['sectionHeader']['styleEna'];
  }
  var base = new dvt.Rect(this._context, 0, 0, ww, hh);
  base.setStroke(dvt.AccordionSection._getStroke(style));
  base.setFill(dvt.AccordionSection._getFill(style));
  return base;
};


/**
 * Helper function that gets fill value from the style map and creates a gradient or solid fill
 * @return {dvt.LinearGradientFill|dvt.SolidFill} section header fill
 */
dvt.AccordionSection._getFill = function(style) {
  var color = style.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
  var gradObj = style.getBackgroundImage();

  var fill = null;
  if (gradObj && (gradObj instanceof dvt.CSSGradient)) {
    var arColors = gradObj.getColors();
    var arAlphas = gradObj.getAlphas();
    var arStops = gradObj.getRatios();
    var angle = gradObj.getAngle();
    fill = new dvt.LinearGradientFill(angle, arColors, arAlphas, arStops);
  }
  else if (color)
    fill = new dvt.SolidFill(color, 1);
  return fill;
};


/**
 * Helper function that gets stroke value from the style map and creates a stroke for the section border
 * @return {dvt.SolidStroke} section header stroke for the section border
 */
dvt.AccordionSection._getStroke = function(style) {
  var color = style.getStyle(dvt.CSSStyle.BORDER_COLOR);
  return new dvt.SolidStroke(color, 1, 1);
};


//---------------------------------------------------------------------//
// Keyboard Support: DvtKeyboardNavigable impl                        //
//---------------------------------------------------------------------//
/**
 * @override
 */
dvt.AccordionSection.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  var obj = this.isActive() ? this._expandedBtn : this._collapsedBtn;
  var bounds = obj.getDimensions();
  var stageP1 = obj.localToStage(new dvt.Point(bounds.x, bounds.y));
  var stageP2 = obj.localToStage(new dvt.Point(bounds.x + bounds.w, bounds.y + bounds.h));
  return new dvt.Rectangle(stageP1.x, stageP1.y, stageP2.x - stageP1.x, stageP2.y - stageP1.y);
};


/**
 * @override
 */
dvt.AccordionSection.prototype.getTargetElem = function() 
{
  var obj = this.isActive() ? this._expandedBtn : this._collapsedBtn;
  return obj.getElem();
};

/**
 * @override
 */
dvt.AccordionSection.prototype.showKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = true;
  this._keyboardFocusEffect.show();
  this._context.setActiveElement(this.isActive() ? this._expandedBtn : this._collapsedBtn); //accessibility feature
};


/**
 * @override
 */
dvt.AccordionSection.prototype.hideKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = false;
  this._keyboardFocusEffect.hide();
};


/**
 * @override
 */
dvt.AccordionSection.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};


/**
 * @override
 */
dvt.AccordionSection.prototype.getNextNavigable = function(event) 
{
  var keyboardHandler = this._eventManager.getKeyboardHandler();
  return keyboardHandler.getNextNavigable(this, event);
};


/**
 * Create keyboard focus effect around given object
 * @param {dvt.Image|DvtText} obj an object around which keyboard effect will be created
 * @private
 */
dvt.AccordionSection.prototype._createKeyboardFocusEffect = function(obj) {
  var dim = obj.getDimensions();
  var x = obj.getTranslateX() || dim.x;
  var y = obj.getTranslateY() || dim.y;
  this._keyboardFocusEffect = new dvt.KeyboardFocusEffect(this.getCtx(), this, new dvt.Rectangle(x, y, dim.w, dim.h), null, null, true);
};
// Copyright (c) 2013, 2016, Oracle and/or its affiliates. All rights reserved.

/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {dvt.BaseComponentDefaults}
 */
var DvtAccordionDefaults = function() {
  this.Init({'skyros': DvtAccordionDefaults.VERSION_1, 'alta': DvtAccordionDefaults.SKIN_ALTA});
};

dvt.Obj.createSubclass(DvtAccordionDefaults, dvt.BaseComponentDefaults);


/**
 * Defaults for version 1.
 */
DvtAccordionDefaults.VERSION_1 = {
  'skin': dvt.CSSStyle.SKIN_ALTA,
  'sectionHeader': {
    'styleEna': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_14 + 'color:#252525;border-color:#D9DFE3;background-color:#F5F5F5;'),
    'styleOvr': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_14 + 'color:#252525;border-color:#D9DFE3;background-color:#F5F5F5;'),
    'styleDwn': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_14 + 'color:#252525;border-color:#D9DFE3;background-color:#F5F5F5;'),
    'styleDis': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_14 + 'color:#252525;border-color:#D9DFE3;background-color:#F5F5F5;'),
    'headerHeight': 33,
    'imageWidth': 24,
    'imageHeight': 24,
    'textPadding': 5
  },
  'paddingX': 0,
  'paddingY': 0
};

DvtAccordionDefaults.SKIN_ALTA = {
};
/**
 * @constructor
 * @param {dvt.Context} context The rendering context
 * @param {dvt.EventManager} eventManager  Event manager to handle train button events
 * @param {Array} labels  Array of labels for items in Train
 * @param {Array} buttonStyles  Array of button dvt.CSSStyle: TrainButtonStyle, TrainButtonHoverStyle and TrainButtonActiveStyle
 * @param {string} id  Train component Id
 * @param {boolean} isAltaSkin  flag value is true if the skin is Alta
 */
dvt.Train = function(context, eventManager, labels, buttonStyles, id, isAltaSkin) {
  this.Init(context, eventManager, labels, buttonStyles, id, isAltaSkin);
};

// TODO NAMESPACE DIAGRAM ONLY

/**
 * make dvt.Train a subclass of dvt.Container
 */
dvt.Obj.createSubclass(dvt.Train, dvt.Container);

dvt.Train.TRAIN_EVENT = 'dvtTrain';
dvt.Train.FILL_COLOR = '#c0cbd5';
dvt.Train.BORDER_COLOR = '#5d7891';
dvt.Train.SELECTED_FILL_COLOR = '#61bde3';
dvt.Train.SELECTED_BORDER_COLOR = '#0066ff';
dvt.Train.BUTTON_SIZE = 8;
dvt.Train.VPADDING = 1;
dvt.Train.HPADDING = 3;

dvt.Train.STATE_ENABLED = 0;
dvt.Train.STATE_HOVER = 1;
dvt.Train.STATE_SELECTED = 2;

/**
 * @protected
 * Initialization method called by the constructor
 *
 * @param {dvt.Context} context The rendering context
 * @param {dvt.EventManager} eventManager  Event manager to handle train button events
 * @param {Array} labels  Array of labels for items in Train
 * @param {Array} buttonStyles  Array of button dvt.CSSStyle: TrainButtonStyle, TrainButtonHoverStyle and TrainButtonActiveStyle
 * @param {string} id  Train component Id
 * @param {boolean} isAltaSkin  flag value is true if the skin is Alta
 */
dvt.Train.prototype.Init = function(context, eventManager, labels, buttonStyles, id, isAltaSkin) {
  dvt.Train.superclass.Init.call(this, context, null, id);

  //tooltipManager to use for displaying tooltips for items in Train
  this._tooltipManager = context.getTooltipManager();

  //Array of labels for items in Train
  this._labels = labels;
  this._buttonStyles = buttonStyles;
  this._count = labels.length;
  this._buttons = new Array(this._count);
  this._selectedIndex = 0;
  this._isAltaSkin = isAltaSkin;

  this.RenderSelf(eventManager);
};


/**
 * Set the selected index of the train.
 *
 * @param index new selected index
 */
dvt.Train.prototype.setSelectedIndex = function(index) {
  if (index >= 0 && index < this._count) {
    this.SelectedIndexChanged(this._selectedIndex, index);
  }
};


/**
 * Get the selected index of the train.
 *
 * @return selected index
 */
dvt.Train.prototype.getSelectedIndex = function() {
  return this._selectedIndex;

};

/**
 * Get the train buttons
 *
 * @return {array} array of DvtButtons
 */
dvt.Train.prototype.getButtons = function() {
  return this._buttons;
};


/**
 * Handle a click event on a train item.
 *
 * @param event mouse click event
 */
dvt.Train.prototype.HandleClick = function(event) {

  //don't want click to fall through to rest of node
  dvt.EventManager.consumeEvent(event);

  for (var i = 0; i < this._buttons.length; i++) {
    var target = event.target;

    // events fired on either the button or one of the button's images will work properly
    if (this._buttons[i] === target || this._buttons[i] === target.getParent()) {
      var selIndex = this.getSelectedIndex();
      this.SelectedIndexChanged(selIndex, i);

      if (selIndex != i) {
        this.fireTrainEvent();
      }
      break;
    }
  }
};


/**
 * Update the train for a change to the selected index.
 *
 * @param oldIndex old selected index
 * @param newIndex new selected index
 */
dvt.Train.prototype.SelectedIndexChanged = function(oldIndex, newIndex) {
  this._selectedIndex = newIndex;

  var button = this._buttons[oldIndex];
  if (button) {
    if (button.getOverState())
      button.getOverState().setCursor('pointer');
    if (button.getDownState())
      button.getDownState().setCursor('pointer');

    button.setToggled(false);
  }

  button = this._buttons[newIndex];
  if (button) {
    if (button.getOverState())
      button.getOverState().setCursor('default');
    if (button.getDownState())
      button.getDownState().setCursor('default');

    button.setToggled(true);
  }
};


/**
 * Add a TrainEvent listener to this train.
 * @param {function} listener the function to call
 * @param {object} obj instance of the object the listener is defined on
 */
dvt.Train.prototype.addTrainEventListener = function(listener, obj) {
  this.addEvtListener(dvt.Train.TRAIN_EVENT, listener, false, obj);
};


/**
 * Remove a TrainEvent listener from this train.
 * @param {function} listener the function to call
 * @param {object} obj instance of the object the listener is defined on
 */
dvt.Train.prototype.removeTrainEventListener = function(listener, obj) {
  this.removeEvtListener(dvt.Train.TRAIN_EVENT, listener, false, obj);
};


/**
 * Fire a train event.
 */
dvt.Train.prototype.fireTrainEvent = function() {
  var event = new DvtTrainEvent(this._selectedIndex);
  this.FireListener(event, false);
};


/**
 * Render this train.
 * @param {dvt.EventManager} eventManager  Event manager to handle train button events
 */
dvt.Train.prototype.RenderSelf = function(eventManager) {
  var bBiDi = dvt.Agent.isRightToLeft(this.getCtx());
  var buttonSize = this._getButtonSize();

  for (var i = 0; i < this._count; i++) {
    var bSelected = (i == this._selectedIndex);
    var button;

    button = this.CreateButton(buttonSize, bSelected, this._labels[i]);
    this.addButtonListeners(button);

    var j = i;

    //BiDi: reverse order of display of train items
    if (bBiDi)
      j = this._count - 1 - i;

    if (eventManager)
      eventManager.associate(button, button);

    var vPadding = this._isAltaSkin ? 0 : dvt.Train.VPADDING;
    button.setTranslate(j * (buttonSize + dvt.Train.HPADDING), vPadding);
    this.addChild(button);

    this._buttons[i] = button;
  }
};

dvt.Train.prototype.DrawButtonState = function(buttonSize, bSelected) {
  var buttonStyle;
  var bdColor;
  var bgColor;
  var offset;

  if (bSelected) {
    offset = 0;
    bgColor = dvt.Train.SELECTED_FILL_COLOR;
    bdColor = dvt.Train.SELECTED_BORDER_COLOR;
    if (this._buttonStyles)
      buttonStyle = this._buttonStyles[dvt.Train.STATE_SELECTED];
  }
  else {
    offset = 1;
    bgColor = dvt.Train.FILL_COLOR;
    bdColor = dvt.Train.BORDER_COLOR;
    if (this._buttonStyles)
      buttonStyle = this._buttonStyles[dvt.Train.STATE_ENABLED];
  }

  if (buttonStyle) {
    if (buttonStyle.getStyle(dvt.CSSStyle.BORDER_COLOR)) {
      bdColor = buttonStyle.getStyle(dvt.CSSStyle.BORDER_COLOR);
    }
    if (buttonStyle.getStyle(dvt.CSSStyle.BACKGROUND_COLOR)) {
      bgColor = buttonStyle.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
    }
  }

  var shape = new dvt.Rect(this.getCtx(), offset, offset,
                          buttonSize - 2 * offset,
                          buttonSize - 2 * offset);
  shape.setSolidFill(bgColor);
  shape.setSolidStroke(bdColor);

  return shape;
};


/**
 * Add listeners to a button.
 *
 * @param button button to add listeners to
 */
dvt.Train.prototype.addButtonListeners = function(button) {
  button.addEvtListener(dvt.TouchEvent.TOUCHSTART, this.HandleClick, false, this);
  if (!dvt.Agent.isTouchDevice()) {
    button.addEvtListener(dvt.MouseEvent.CLICK, this.HandleClick, false, this);
  }
};


/**
 * Remove listeners from a button.
 *
 * @param button button to remove listeners from
 */
dvt.Train.prototype.removeButtonListeners = function(button) {
  button.removeEvtListener(dvt.TouchEvent.TOUCHSTART, this.HandleClick, false, this);
  if (!dvt.Agent.isTouchDevice()) {
    button.removeEvtListener(dvt.MouseEvent.CLICK, this.HandleClick, false, this);
  }
};

dvt.Train.prototype._getButtonSize = function() {
  if (! this._buttonSize) {
    if (this._buttonStyles) {
      //assume they are all the same size for now
      var buttonStyle = this._buttonStyles[0];
      if (buttonStyle) {
        this._buttonSize = dvt.CSSStyle.toNumber(buttonStyle.getWidth());
      }
    }
    if (! this._buttonSize)
      this._buttonSize = dvt.Train.BUTTON_SIZE;
  }
  return this._buttonSize;
};

dvt.Train.prototype.CreateButtonState = function(url, buttonSize) {
  return new dvt.Image(this.getCtx(), url, 0, 0, buttonSize, buttonSize);
};

dvt.Train.prototype.MakeButtonState = function(buttonSize, state, bSelected ) {
  var style = this._buttonStyles ? this._buttonStyles[state] : null;
  var url = style ? style.getIconUrl() : null;

  var shape = url ? this.CreateButtonState(url, buttonSize) :
                    this.DrawButtonState(buttonSize, (state == dvt.Train.STATE_SELECTED));

  shape.setCursor((state == dvt.Train.STATE_ENABLED || bSelected) ?
                  'default' : 'pointer');

  return shape;
};

dvt.Train.prototype.CreateButton = function(buttonSize, bSelected, tooltip) {
  var button = new dvt.Button(this.getCtx(),
                             this.MakeButtonState(buttonSize, dvt.Train.STATE_ENABLED, bSelected),
                             this.MakeButtonState(buttonSize, dvt.Train.STATE_HOVER, bSelected),
                             this.MakeButtonState(buttonSize, dvt.Train.STATE_SELECTED, bSelected),
                             null);

  button.setTooltip(tooltip);
  button.setToggleEnabled(true);
  if (bSelected)
    button.setToggled(bSelected);

  return button;
};

/*
dvt.Train.prototype.destroy = function (listener) {
  if (listener)
    this.removeTrainEventListener(listener);

  for (var i = 0; i < this._count; i++) {
    var button = this._buttons[i];
    this.removeButtonListeners(button);
  }
}
*/

/**
 * A Train event.
 * @param {int} index The currently selected index
 * @class
 * @constructor
 */
var DvtTrainEvent = function(index) {
  this.Init(DvtTrainEvent.TYPE);
  this.type = this.getType();
  this._index = index;
};

dvt.Obj.createSubclass(DvtTrainEvent, dvt.BaseComponentEvent);


/**
 * @const
 */
DvtTrainEvent.TYPE = 'dvtTrain';


/**
 * Returns the index of the selected button
 * @return {index} The selected button
 */
DvtTrainEvent.prototype.getIndex = function() {
  return this._index;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 * Creates an Overview window component
 * @class dvt.OverviewWindow
 * @constructor
 *
 * @param {dvt.Context} context The rendering context
 * @param {string} id the id of the overview window
 * @param {number} x The leftmost position of the Overview window
 * @param {number} y The topmost position of the Overview window
 * @param {number} ww The width of the Overview window
 * @param {number} hh The height of the Overview window
 */
dvt.OverviewWindow = function(context, id, x, y, ww, hh)
{
  this.Init(context, id, x, y, ww, hh);
};

dvt.Obj.createSubclass(dvt.OverviewWindow, dvt.Container);

dvt.OverviewWindow.VIEWPORT_BG_COLOR = 'viewport-bg-color';
dvt.OverviewWindow.VIEWPORT_BORDER_COLOR = 'viewport-border-color';

dvt.OverviewWindow.OVERVIEW_DISCLOSED_KEY = 'isOverviewDisclosed';


/**
 * Initialization method called by the constructor
 *
 * @param {dvt.Context} context The rendering context
 * @param {string} id the id of the overview window
 * @param {number} x The leftmost position of the Overview window
 * @param {number} y The topmost position of the Overview window
 * @param {number} ww The width of the Overview window
 * @param {number} hh The height of the Overview window
 */
dvt.OverviewWindow.prototype.Init = function(context, id, x, y, ww, hh) {
  dvt.OverviewWindow.superclass.Init.call(this, context, null, id);
  this._x = x;
  this._y = y;
  this._ww = ww;
  this._hh = hh;

  this._skinStyle = null;
};


/**
 * Renders the overview window
 */
dvt.OverviewWindow.prototype.render = function()
{
  this._md = false;
  this._panEnable = true;

  if (this._overview) {
    if (dvt.Agent.isTouchDevice()) {
      this._overview.removeEvtListener(dvt.TouchEvent.TOUCHSTART, this._mouseDown, false, this);
      this._overview.removeEvtListener(dvt.TouchEvent.TOUCHMOVE, this._mouseMove, false, this);
      this._overview.removeEvtListener(dvt.TouchEvent.TOUCHEND, this._mouseUp, false, this);
    }
    else {
      this._overview.removeEvtListener(dvt.MouseEvent.MOUSEDOWN, this._mouseDown, false, this);
      this._overview.removeEvtListener(dvt.MouseEvent.MOUSEMOVE, this._mouseMove, false, this);
      this._overview.removeEvtListener(dvt.MouseEvent.MOUSEUP, this._mouseUp, false, this);
      this._overview.removeEvtListener(dvt.MouseEvent.MOUSEOUT, this._mouseOut, false, this);
    }
    this._overview.setClipPath(null);
  }
  this.removeChildren();
  this._viewport = null;
  this._overview = null;

  var clipPath = new dvt.ClipPath(this.getId());
  clipPath.addRect(0.0, 0.0, this._ww, this._hh);
  this._overview = new dvt.Rect(this._context, 0.0, 0.0, this._ww, this._hh);
  this._overview.setClipPath(clipPath);
  this._overview.setInvisibleFill();
  this.addChild(this._overview);

  // Create viewport
  this._viewport = new dvt.Rect(this._context, 0.0, 0.0, 0.0, 0.0, this.getId() + ':' + 'viewport');
  var bgColor = this.getSkinStyleAttr(dvt.OverviewWindow.VIEWPORT_BG_COLOR);
  var borderColor = this.getSkinStyleAttr(dvt.OverviewWindow.VIEWPORT_BORDER_COLOR);

  this._viewport.setSolidStroke(borderColor, null, 2);
  this._viewport.setSolidFill(bgColor);
  this._viewport.setMouseEnabled(false);
  this._overview.addChild(this._viewport);

  if (dvt.Agent.isTouchDevice()) {
    this._overview.addEvtListener(dvt.TouchEvent.TOUCHSTART, this._mouseDown, false, this);
    this._overview.addEvtListener(dvt.TouchEvent.TOUCHMOVE, this._mouseMove, false, this);
    this._overview.addEvtListener(dvt.TouchEvent.TOUCHEND, this._mouseUp, false, this);
  }
  else {
    this._overview.addEvtListener(dvt.MouseEvent.MOUSEDOWN, this._mouseDown, false, this);
    this._overview.addEvtListener(dvt.MouseEvent.MOUSEMOVE, this._mouseMove, false, this);
    this._overview.addEvtListener(dvt.MouseEvent.MOUSEUP, this._mouseUp, false, this);
    this._overview.addEvtListener(dvt.MouseEvent.MOUSEOUT, this._mouseOut, false, this);
  }
};

dvt.OverviewWindow.prototype.loadXmlNode = function(ovNode) 
{
  //TODO
  this._isDisclosed = ovNode.getAttr('disclosed') == 'true';
};

dvt.OverviewWindow.prototype.isDisclosed = function() 
{
  return this._isDisclosed;
};

dvt.OverviewWindow.prototype.setDisclosed = function(bDisclosed) {
  this._isDisclosed = bDisclosed;
};

dvt.OverviewWindow.prototype.getContentAreaWidth = function()
{
  return this.getContentDimensions().w;
};

dvt.OverviewWindow.prototype.getContentAreaHeight = function()
{
  return this.getContentDimensions().h;
};

dvt.OverviewWindow.prototype.getContentDimensions = function() 
{
  return new dvt.Rectangle(this._x, this._y, this._ww, this._hh);
};


/**
 * Sets the dimensions of the viewport within the overviewWindow.
 *
 * @param {dvt.Rectangle} dim The dimensions of the viewport (in content coordinates)
 * @param {dvt.Animator} animator An optional animator for animating the change
 *
 */
dvt.OverviewWindow.prototype.setViewportDimensions = function(dim, animator)
{
  var topLeft = this.TransformFromContentToViewportCoords(dim.x, dim.y, animator);
  var bottomRight = this.TransformFromContentToViewportCoords(dim.x + dim.w, dim.y + dim.h, animator);
  var vx = topLeft.x;
  var vy = topLeft.y;
  var vw = bottomRight.x - topLeft.x;
  var vh = bottomRight.y - topLeft.y;

  if (animator) {
    animator.addProp(dvt.Animator.TYPE_NUMBER, this._viewport, this._viewport.getX, this._viewport.setX, vx);
    animator.addProp(dvt.Animator.TYPE_NUMBER, this._viewport, this._viewport.getY, this._viewport.setY, vy);
    animator.addProp(dvt.Animator.TYPE_NUMBER, this._viewport, this._viewport.getWidth, this._viewport.setWidth, vw);
    animator.addProp(dvt.Animator.TYPE_NUMBER, this._viewport, this._viewport.getHeight, this._viewport.setHeight, vh);
  }
  else {
    this._viewport.setX(vx);
    this._viewport.setY(vy);
    this._viewport.setWidth(vw);
    this._viewport.setHeight(vh);
  }
};


/**
 * Gets the dimensions of the viewport within the overviewWindow.
 *
 * @return {dvt.Rectangle} The dimensions of the viewport (in content coordinates)
 */
dvt.OverviewWindow.prototype.getViewportDimensions = function() {
  var topLeft = this.TransformFromViewportToContentCoords(
      this._viewport.getX(), this._viewport.getY());
  var bottomRight = this.TransformFromViewportToContentCoords(
      this._viewport.getX() + this._viewport.getWidth(),
      this._viewport.getY() + this._viewport.getHeight());
  return new dvt.Rectangle(topLeft.x, topLeft.y,
                          bottomRight.x - topLeft.x,
                          bottomRight.y - topLeft.y);
};

/**  Determine whether the viewport is pannable or not
  *
  *  @param {Boolean} pan         True if you can pan the viewport
  *
  */

dvt.OverviewWindow.prototype.setPanEnabled = function(pan)
{
  this._panEnable = pan;
};


/**
  *  @return {Boolean}  Return true if the viewport is pannable
  */
dvt.OverviewWindow.prototype.isPanEnabled = function()
{
  return this._panEnable;
};


/**
 * Sets the content for this overview window
 *
 * @param {dvt.Displayable} content the content for this overview window
 */
dvt.OverviewWindow.prototype.setContent = function(content) {
  var oldDims = this.getViewportDimensions();

  //remove old content
  if (this._content) {
    this._overview.removeChild(this._content);
  }

  this._content = content;

  //move the content from the rootPane to the clipContainer
  this._overview.addChildAt(content, 0);

  this.setViewportDimensions(oldDims);
};


/**
 * Handler for the mouse down event
 *
 * @param {dvt.MouseEvent} the mouse down event
 */
dvt.OverviewWindow.prototype._mouseDown = function(evt) {
  if (!this._md && this._panEnable) {
    this._md = true;
    var offset = this._getRelativePosition(evt);
    var viewportEvent = new dvt.ViewportChangeEvent(this.getViewportDimensions(), this._getCenteredViewportDimensions(offset), evt);
    this.FireListener(viewportEvent);
  }
};


/**
 * Handler for the mouse move event
 *
 * @param {dvt.MouseEvent} the mouse move event
 */
dvt.OverviewWindow.prototype._mouseMove = function(evt) {
  if (this._md && this._panEnable) {
    var offset = this._getRelativePosition(evt);
    var viewportEvent = new dvt.ViewportChangeEvent(this.getViewportDimensions(), this._getCenteredViewportDimensions(offset), evt);
    this.FireListener(viewportEvent);
  }
};


/**
 * Handler for the mouse up event
 *
 * @param {dvt.MouseEvent} the mouse up event
 */
dvt.OverviewWindow.prototype._mouseUp = function(evt) {
  if (this._md && this._panEnable) {
    this._md = false;
  }
};


/**
 * Handler for the mouse out event
 *
 * @param {dvt.MouseEvent} the mouse out event
 */
dvt.OverviewWindow.prototype._mouseOut = function(evt) {
  this._mouseUp(evt);
};

dvt.OverviewWindow.prototype._getRelativePosition = function(evt) {
  var pageX;
  var pageY;

  if (dvt.Agent.isTouchDevice()) {
    // evt is a touch event
    var touches = evt.touches;
    if (touches.length > 0) {
      pageX = touches[0].pageX;
      pageY = touches[0].pageY;
    }
  }
  else {
    // evt is a mouse event
    pageX = evt.pageX;
    pageY = evt.pageY;
  }
  return this._context.pageToStageCoords(pageX, pageY);
};


/**
 * @protected
 */
dvt.OverviewWindow.prototype.TransformFromViewportToContentCoords = function(vx, vy)
{
  var tx = 0;
  var ty = 0;
  var sx = 1;
  var sy = 1;
  if (this._content)
  {
    tx = this._content.getTranslateX();
    ty = this._content.getTranslateY();
    sx = this._content.getScaleX();
    sy = this._content.getScaleY();
  }

  var cx = (vx - tx) / sx;
  var cy = (vy - ty) / sy;
  return new dvt.Point(cx, cy);
};


/**
 * @protected
 */
dvt.OverviewWindow.prototype.TransformFromContentToViewportCoords = function(cx, cy, animator)
{
  var tx = 0;
  var ty = 0;
  var sx = 1;
  var sy = 1;
  if (this._content)
  {
    tx = animator ? animator.getDestVal(this._content, this._content.getTranslateX, true) : this._content.getTranslateX();
    ty = animator ? animator.getDestVal(this._content, this._content.getTranslateY, true) : this._content.getTranslateY();
    sx = animator ? animator.getDestVal(this._content, this._content.getScaleX, true) : this._content.getScaleX();
    sy = animator ? animator.getDestVal(this._content, this._content.getScaleY, true) : this._content.getScaleY();
  }

  var vx = (cx * sx) + tx;
  var vy = (cy * sy) + ty;
  return new dvt.Point(vx, vy);
};

dvt.OverviewWindow.prototype.getSkinStyle = function() {
  return this._skinStyle;
};

dvt.OverviewWindow.prototype.setSkinStyle = function(skinStyle) {
  this._skinStyle = skinStyle;
};

dvt.OverviewWindow.prototype.getSkinStyleAttr = function(attr) {
  // Note: this._skinStyle is a map, not a dvt.CSSStyle
  if (this._skinStyle && this._skinStyle[attr] != 'undefined')
    return this._skinStyle[attr];
  else
    return null;
};


/**
 * Gets the dimensions for a viewport centered at the specified position
 *
 * @param {dvt.Point} pos the position to center the viewport
 * @return {dvt.Rectangle} the centered viewport dimensions
 */
dvt.OverviewWindow.prototype._getCenteredViewportDimensions = function(pos) {
  var overviewStart = this._overview.localToStage(new dvt.Point(0, 0));
  var viewportDims = this._viewport.getDimensions();
  var centeredViewportX = (pos.x - overviewStart.x) - viewportDims.w / 2;
  var centeredViewportY = (pos.y - overviewStart.y) - viewportDims.h / 2;
  var topLeft = this.TransformFromViewportToContentCoords(centeredViewportX, centeredViewportY);
  var bottomRight = this.TransformFromViewportToContentCoords(centeredViewportX + viewportDims.w, centeredViewportY + viewportDims.h);
  return new dvt.Rectangle(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
};

dvt.OverviewWindow.prototype.SetViewportRectangle = function(rect) {
  this._viewport.setX(rect.x);
  this._viewport.setY(rect.y);
  this._viewport.setWidth(rect.w);
  this._viewport.setHeight(rect.h);
};

dvt.OverviewWindow.prototype.GetViewportRectangle = function() {
  return new dvt.Rectangle(this._viewport.getX(), this._viewport.getY(), this._viewport.getWidth(), this._viewport.getHeight());
};


/**
 * @override
 */
dvt.OverviewWindow.prototype.getDimensions = function(targetCoordinateSpace) {
  var bounds = new dvt.Rectangle(0, 0, this._ww, this._hh);
  if (!targetCoordinateSpace || targetCoordinateSpace === this)
    return bounds;
  else { // Calculate the bounds relative to the target space
    return this.ConvertCoordSpaceRect(bounds, targetCoordinateSpace);
  }
};

/**
 * @override
 */
dvt.OverviewWindow.prototype.getDimensionsWithStroke = function(targetCoordinateSpace) {
  return this.getDimensions(targetCoordinateSpace);
};

dvt.Bundle.addDefaultStrings(dvt.Bundle.SUBCOMPONENT_PREFIX, {
  'CONTROL_PANEL' : 'Control Panel',
  'CONTROL_PANEL_ZOOMANDCENTER' : 'Zoom and Center',
  'CONTROL_PANEL_PAN' : 'Pan',
  'CONTROL_PANEL_LAYOUT' : 'Layout',
  'CONTROL_PANEL_LAYOUT_VERT_TOP' : 'Vertical, Top Down',
  'CONTROL_PANEL_LAYOUT_VERT_BOTTOM' : 'Vertical, Bottom Up',
  'CONTROL_PANEL_LAYOUT_HORIZ_START' : 'Horizontal, Start-to-End',
  'CONTROL_PANEL_LAYOUT_HORIZ_LEFT' : 'Horizontal, Left-to-Right',
  'CONTROL_PANEL_LAYOUT_HORIZ_RIGHT' : 'Horizontal, Right-to-Left',
  'CONTROL_PANEL_LAYOUT_RADIAL' : 'Radial',
  'CONTROL_PANEL_LAYOUT_TREE' : 'Tree',
  'CONTROL_PANEL_LAYOUT_CIRCLE' : 'Circle',
  'CONTROL_PANEL_SYNC' : 'View',
  'CONTROL_PANEL_ZOOMTOFIT' : 'Zoom to Fit',
  'CONTROL_PANEL_ZOOMIN' : 'Zoom In',
  'CONTROL_PANEL_ZOOMOUT' : 'Zoom Out',
  'CONTROL_PANEL_RESET' : 'Reset Map',
  'CONTROL_PANEL_DRILLUP' : 'Drill Up',
  'CONTROL_PANEL_DRILLDOWN' : 'Drill Down',
  'LEGEND' : 'Legend',
  'OVERVIEW' : 'Overview',
  'PALETTE' : 'Palette',
  'SEARCH' : 'Search',
  'SEARCH_TEXT' : 'Search',
  'SEARCH_TEXT_ALTA' : 'Find',
  'SEARCH_RESULTS' : 'Search Results [{0}]',
  'SEARCH_RESULTS_ALTA' : '{0} Results',
  'SEARCH_RESULTS_CLOSE' : 'Close',
  'SEARCH_RESULTS_NO_DATA' : 'No results to display'
});


})(dvt);

  return dvt;
});
